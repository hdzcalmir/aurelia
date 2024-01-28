import { DI as t, Registration as i, optional as s, all as e, ILogger as n, lazy as r, camelCase as h, IContainer as o } from "@aurelia/kernel";

import { Scope as c, AccessorType as a, connectable as u, astEvaluate as l, astBind as d, astUnbind as f } from "@aurelia/runtime";

import { IWindow as S, State as g, mixinAstEvaluator as p, mixingBindingLimited as b, BindingMode as B, bindingBehavior as _, attributePattern as y, bindingCommand as v, renderer as w, AttrSyntax as m, AppTask as I, lifecycleHooks as T, CustomElement as D, CustomAttribute as P, ILifecycleHooks as O } from "@aurelia/runtime-html";

const A = t.createInterface;

function createStateBindingScope(t, i) {
    const s = {
        bindingContext: t
    };
    const e = c.create(t, s, true);
    e.parent = i;
    return e;
}

function isSubscribable$1(t) {
    return t instanceof Object && "subscribe" in t;
}

const C = /*@__PURE__*/ A("IActionHandler");

const E = /*@__PURE__*/ A("IStore");

const R = /*@__PURE__*/ A("IState");

const J = "__au_ah__";

const N = Object.freeze({
    define(t) {
        function registry(i, s) {
            return t(i, s);
        }
        registry[J] = true;
        registry.register = function(s) {
            i.instance(C, t).register(s);
        };
        return registry;
    },
    isType: t => typeof t === "function" && J in t
});

const x = /*@__PURE__*/ A("IDevToolsExtension", (t => t.cachedCallback((t => {
    const i = t.get(S);
    const s = i.__REDUX_DEVTOOLS_EXTENSION__;
    return s ?? null;
}))));

class Store {
    static register(t) {
        i.singleton(E, this).register(t);
    }
    constructor(t, i, s, e) {
        this.t = new Set;
        this.i = 0;
        this.h = [];
        this.u = this._state = t ?? new State;
        this.B = i;
        this._ = s;
        this.I = e;
    }
    subscribe(t) {
        this.t.add(t);
    }
    unsubscribe(t) {
        this.t.delete(t);
    }
    T(t) {
        const i = this._state;
        this._state = t;
        this.t.forEach((s => s.handleStateChange(t, i)));
    }
    getState() {
        return this._state;
    }
    dispatch(t) {
        if (this.i > 0) {
            this.h.push(t);
            return;
        }
        this.i++;
        let i;
        const reduce = (t, i) => this.B.reduce(((t, s) => {
            if (t instanceof Promise) {
                return t.then((t => s(t, i)));
            }
            return s(t, i);
        }), t);
        const afterDispatch = t => {
            if (this.h.length > 0) {
                i = this.h.shift();
                const s = reduce(t, i);
                if (s instanceof Promise) {
                    return s.then((t => afterDispatch(t)));
                } else {
                    return afterDispatch(s);
                }
            }
        };
        const s = reduce(this._state, t);
        if (s instanceof Promise) {
            return s.then((t => {
                this.T(t);
                this.i--;
                return afterDispatch(this._state);
            }), (t => {
                this.i--;
                throw t;
            }));
        } else {
            this.T(s);
            this.i--;
            return afterDispatch(this._state);
        }
    }
    connectDevTools(t) {
        const i = this.I();
        const s = i != null;
        if (!s) {
            throw new Error("Devtools extension is not available");
        }
        t.name ?? (t.name = "Aurelia State plugin");
        const e = i.connect(t);
        e.init(this.u);
        e.subscribe((t => {
            this._.info("DevTools sent a message:", t);
            const i = typeof t.payload === "string" ? tryParseJson(t.payload) : t.payload;
            if (i === void 0) {
                return;
            }
            if (t.type === "ACTION") {
                if (i == null) {
                    throw new Error("DevTools sent an action with no payload");
                }
                void new Promise((t => {
                    t(this.dispatch(i));
                })).catch((t => {
                    throw new Error(`Issue when trying to dispatch an action through devtools:\n${t}`);
                })).then((() => {
                    e.send("ACTION", this._state);
                }));
                return;
            }
            if (t.type === "DISPATCH" && i != null) {
                switch (i.type) {
                  case "JUMP_TO_STATE":
                  case "JUMP_TO_ACTION":
                    this.T(JSON.parse(t.state));
                    return;

                  case "COMMIT":
                    e.init(this._state);
                    return;

                  case "RESET":
                    e.init(this.u);
                    this.T(this.u);
                    return;

                  case "ROLLBACK":
                    {
                        const i = JSON.parse(t.state);
                        this.T(i);
                        e.send("ROLLBACK", i);
                        return;
                    }
                }
            }
        }));
    }
}

Store.inject = [ s(R), e(C), n, r(x) ];

class State {}

function tryParseJson(t) {
    try {
        return JSON.parse(t);
    } catch (i) {
        console.log(`Error parsing JSON:\n${(t ?? "").slice(0, 200)}\n${i}`);
        return undefined;
    }
}

function __decorate(t, i, s, e) {
    var n = arguments.length, r = n < 3 ? i : e === null ? e = Object.getOwnPropertyDescriptor(i, s) : e, h;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(t, i, s, e); else for (var o = t.length - 1; o >= 0; o--) if (h = t[o]) r = (n < 3 ? h(r) : n > 3 ? h(i, s, r) : h(i, s)) || r;
    return n > 3 && r && Object.defineProperty(i, s, r), r;
}

const j = a.Layout;

const L = g.activating;

class StateBinding {
    constructor(t, i, s, e, n, r, h, o) {
        this.isBound = false;
        this.P = null;
        this.v = void 0;
        this.O = void 0;
        this.A = 0;
        this.boundFn = false;
        this.mode = B.toView;
        this.C = t;
        this.l = i;
        this.R = e;
        this.J = o;
        this.oL = s;
        this.ast = n;
        this.target = r;
        this.targetProperty = h;
    }
    updateTarget(t) {
        const i = this.N;
        const s = this.target;
        const e = this.targetProperty;
        const n = this.A++;
        const isCurrentValue = () => n === this.A - 1;
        this.j();
        if (isSubscribable(t)) {
            this.O = t.subscribe((t => {
                if (isCurrentValue()) {
                    i.setValue(t, s, e);
                }
            }));
            return;
        }
        if (t instanceof Promise) {
            void t.then((t => {
                if (isCurrentValue()) {
                    i.setValue(t, s, e);
                }
            }), (() => {}));
            return;
        }
        i.setValue(t, s, e);
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        this.N = this.oL.getAccessor(this.target, this.targetProperty);
        this.J.subscribe(this);
        this.updateTarget(this.v = l(this.ast, this.s = createStateBindingScope(this.J.getState(), t), this, this.mode > B.oneTime ? this : null));
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.j();
        this.A++;
        this.s = void 0;
        this.P?.cancel();
        this.P = null;
        this.J.unsubscribe(this);
    }
    handleChange(t) {
        if (!this.isBound) {
            return;
        }
        const i = this.C.state !== L && (this.N.type & j) > 0;
        const s = this.obs;
        s.version++;
        t = l(this.ast, this.s, this, this);
        s.clear();
        let e;
        if (i) {
            e = this.P;
            this.P = this.R.queueTask((() => {
                this.updateTarget(t);
                this.P = null;
            }), H);
            e?.cancel();
            e = null;
        } else {
            this.updateTarget(t);
        }
    }
    handleStateChange() {
        if (!this.isBound) {
            return;
        }
        const t = this.J.getState();
        const i = this.s;
        const s = i.overrideContext;
        i.bindingContext = s.bindingContext = s.$state = t;
        const e = l(this.ast, i, this, this.mode > B.oneTime ? this : null);
        const n = this.C.state !== L && (this.N.type & j) > 0;
        if (e === this.v) {
            return;
        }
        this.v = e;
        let r = null;
        if (n) {
            r = this.P;
            this.P = this.R.queueTask((() => {
                this.updateTarget(e);
                this.P = null;
            }), H);
            r?.cancel();
        } else {
            this.updateTarget(this.v);
        }
    }
    j() {
        if (typeof this.O === "function") {
            this.O();
        } else if (this.O !== void 0) {
            this.O.dispose?.();
            this.O.unsubscribe?.();
        }
        this.O = void 0;
    }
}

function isSubscribable(t) {
    return t instanceof Object && "subscribe" in t;
}

const H = {
    reusable: false,
    preempt: true
};

u(StateBinding);

p(true)(StateBinding);

b(StateBinding, (() => "updateTarget"));

const M = new WeakMap;

let $ = class StateBindingBehavior {
    constructor(t) {
        this.J = t;
    }
    bind(t, i) {
        const s = i instanceof StateBinding;
        t = s ? t : createStateBindingScope(this.J.getState(), t);
        let e;
        if (!s) {
            e = M.get(i);
            if (e == null) {
                M.set(i, e = new StateSubscriber(i, t));
            } else {
                e.L = t;
            }
            this.J.subscribe(e);
            i.useScope?.(t);
        }
    }
    unbind(t, i) {
        const s = i instanceof StateBinding;
        if (!s) {
            this.J.unsubscribe(M.get(i));
            M.delete(i);
        }
    }
};

$.inject = [ E ];

$ = __decorate([ _("state") ], $);

class StateSubscriber {
    constructor(t, i) {
        this.H = t;
        this.L = i;
    }
    handleStateChange(t) {
        const i = this.L;
        const s = i.overrideContext;
        i.bindingContext = s.bindingContext = s.$state = t;
        this.H.handleChange?.(undefined, undefined);
    }
}

class StateDispatchBinding {
    constructor(t, i, s, e, n) {
        this.isBound = false;
        this.boundFn = false;
        this.l = t;
        this.J = n;
        this.ast = i;
        this.M = s;
        this.$ = e;
    }
    callSource(t) {
        const i = this.s;
        i.overrideContext.$event = t;
        const s = l(this.ast, i, this, null);
        delete i.overrideContext.$event;
        void this.J.dispatch(s);
    }
    handleEvent(t) {
        this.callSource(t);
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        d(this.ast, t, this);
        this.s = createStateBindingScope(this.J.getState(), t);
        this.M.addEventListener(this.$, this);
        this.J.subscribe(this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        f(this.ast, this.s, this);
        this.s = void 0;
        this.M.removeEventListener(this.$, this);
        this.J.unsubscribe(this);
    }
    handleStateChange(t) {
        const i = this.s;
        const s = i.overrideContext;
        i.bindingContext = s.bindingContext = t;
    }
}

u(StateDispatchBinding);

p(true)(StateDispatchBinding);

b(StateDispatchBinding, (() => "callSource"));

let k = class StateAttributePattern {
    "PART.state"(t, i, s) {
        return new m(t, i, s[0], "state");
    }
};

k = __decorate([ y({
    pattern: "PART.state",
    symbols: "."
}) ], k);

let K = class DispatchAttributePattern {
    "PART.dispatch"(t, i, s) {
        return new m(t, i, s[0], "dispatch");
    }
};

K = __decorate([ y({
    pattern: "PART.dispatch",
    symbols: "."
}) ], K);

let U = class StateBindingCommand {
    get type() {
        return "None";
    }
    get name() {
        return "state";
    }
    build(t, i, s) {
        const e = t.attr;
        let n = e.target;
        let r = e.rawValue;
        if (t.bindable == null) {
            n = s.map(t.node, n) ?? h(n);
        } else {
            if (r === "" && t.def.type === "Element") {
                r = h(n);
            }
            n = t.bindable.name;
        }
        return new StateBindingInstruction(r, n);
    }
};

U = __decorate([ v("state") ], U);

let F = class DispatchBindingCommand {
    get type() {
        return "IgnoreAttr";
    }
    get name() {
        return "dispatch";
    }
    build(t) {
        const i = t.attr;
        return new DispatchBindingInstruction(i.target, i.rawValue);
    }
};

F = __decorate([ v("dispatch") ], F);

class StateBindingInstruction {
    constructor(t, i) {
        this.from = t;
        this.to = i;
        this.type = "sb";
    }
}

class DispatchBindingInstruction {
    constructor(t, i) {
        this.from = t;
        this.ast = i;
        this.type = "sd";
    }
}

let G = class StateBindingInstructionRenderer {
    constructor(t) {
        this.K = t;
    }
    render(t, i, s, e, n, r) {
        t.addBinding(new StateBinding(t, t.container, r, e.domWriteQueue, ensureExpression(n, s.from, "IsFunction"), i, s.to, this.K));
    }
};

G.inject = [ E ];

G = __decorate([ w("sb") ], G);

let W = class DispatchBindingInstructionRenderer {
    constructor(t) {
        this.K = t;
    }
    render(t, i, s, e, n) {
        const r = ensureExpression(n, s.ast, "IsProperty");
        t.addBinding(new StateDispatchBinding(t.container, r, i, s.from, this.K));
    }
};

W.inject = [ E ];

W = __decorate([ w("sd") ], W);

function ensureExpression(t, i, s) {
    if (typeof i === "string") {
        return t.parse(i, s);
    }
    return i;
}

const q = [ k, U, G, K, F, W, $, Store ];

const createConfiguration = (t, s, e = {}) => ({
    register: n => {
        n.register(i.instance(R, t), ...q, ...s.map(N.define), I.creating(o, (t => {
            const i = t.get(E);
            const s = t.get(x);
            if (e.devToolsOptions?.disable !== true && s != null) {
                i.connectDevTools(e.devToolsOptions ?? {});
            }
        })));
    },
    init: (t, i, ...s) => {
        const e = typeof i === "function";
        const n = e ? {} : i;
        s = e ? [ i, ...s ] : s;
        return createConfiguration(t, s, n);
    }
});

const z = /*@__PURE__*/ createConfiguration({}, []);

let Q = class StateGetterBinding {
    constructor(t, i, s, e) {
        this.isBound = false;
        this.v = void 0;
        this.O = void 0;
        this.A = 0;
        this.J = s;
        this.$get = e;
        this.target = t;
        this.key = i;
    }
    updateTarget(t) {
        const i = this.target;
        const s = this.key;
        const e = this.A++;
        const isCurrentValue = () => e === this.A - 1;
        this.j();
        if (isSubscribable$1(t)) {
            this.O = t.subscribe((t => {
                if (isCurrentValue()) {
                    i[s] = t;
                }
            }));
            return;
        }
        if (t instanceof Promise) {
            void t.then((t => {
                if (isCurrentValue()) {
                    i[s] = t;
                }
            }), (() => {}));
            return;
        }
        i[s] = t;
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        const i = this.J.getState();
        this.s = createStateBindingScope(i, t);
        this.J.subscribe(this);
        this.updateTarget(this.v = this.$get(i));
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.j();
        this.A++;
        this.s = void 0;
        this.J.unsubscribe(this);
    }
    handleStateChange(t) {
        const i = this.s;
        const s = i.overrideContext;
        i.bindingContext = s.bindingContext = s.$state = t;
        const e = this.$get(this.J.getState());
        if (e === this.v) {
            return;
        }
        this.v = e;
        this.updateTarget(e);
    }
    j() {
        if (typeof this.O === "function") {
            this.O();
        } else if (this.O !== void 0) {
            this.O.dispose?.();
            this.O.unsubscribe?.();
        }
        this.O = void 0;
    }
};

Q = __decorate([ u() ], Q);

function fromState(t) {
    return function(i, s, e) {
        if (typeof i === "function") {
            throw new Error(`Invalid usage. @state can only be used on a field`);
        }
        if (typeof e?.value !== "undefined") {
            throw new Error(`Invalid usage. @state can only be used on a field`);
        }
        i = i.constructor;
        let n = D.getAnnotation(i, V);
        if (n == null) {
            D.annotate(i, V, n = []);
        }
        n.push(new X(t, s));
        n = P.getAnnotation(i, V);
        if (n == null) {
            D.annotate(i, V, n = []);
        }
        n.push(new Y(t, s));
    };
}

const V = "dependencies";

let X = class HydratingLifecycleHooks {
    constructor(t, i) {
        this.$get = t;
        this.key = i;
    }
    register(t) {
        i.instance(O, this).register(t);
    }
    hydrating(t, i) {
        const s = i.container;
        i.addBinding(new Q(t, this.key, s.get(E), this.$get));
    }
};

X = __decorate([ T() ], X);

let Y = class CreatedLifecycleHooks {
    constructor(t, i) {
        this.$get = t;
        this.key = i;
    }
    register(t) {
        i.instance(O, this).register(t);
    }
    created(t, i) {
        const s = i.container;
        i.addBinding(new Q(t, this.key, s.get(E), this.$get));
    }
};

Y = __decorate([ T() ], Y);

export { N as ActionHandler, K as DispatchAttributePattern, F as DispatchBindingCommand, DispatchBindingInstruction, W as DispatchBindingInstructionRenderer, C as IActionHandler, R as IState, E as IStore, k as StateAttributePattern, StateBinding, $ as StateBindingBehavior, U as StateBindingCommand, StateBindingInstruction, G as StateBindingInstructionRenderer, z as StateDefaultConfiguration, StateDispatchBinding, fromState };
//# sourceMappingURL=index.mjs.map
