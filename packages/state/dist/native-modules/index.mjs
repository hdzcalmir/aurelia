import { DI as t, Registration as i, resolve as s, optional as e, all as n, ILogger as r, lazy as h, camelCase as o, IContainer as c } from "../../../kernel/dist/native-modules/index.mjs";

import { Scope as a, AccessorType as u, connectable as l, astEvaluate as d, astBind as f, astUnbind as S } from "../../../runtime/dist/native-modules/index.mjs";

import { IWindow as g, State as p, mixinAstEvaluator as b, mixingBindingLimited as B, BindingMode as _, bindingBehavior as y, attributePattern as v, bindingCommand as w, renderer as m, AttrSyntax as I, AppTask as T, lifecycleHooks as D, CustomElement as P, CustomAttribute as O, ILifecycleHooks as A } from "../../../runtime-html/dist/native-modules/index.mjs";

const C = t.createInterface;

function createStateBindingScope(t, i) {
    const s = {
        bindingContext: t
    };
    const e = a.create(t, s, true);
    e.parent = i;
    return e;
}

function isSubscribable$1(t) {
    return t instanceof Object && "subscribe" in t;
}

const E = /*@__PURE__*/ C("IActionHandler");

const R = /*@__PURE__*/ C("IStore");

const J = /*@__PURE__*/ C("IState");

const N = "__au_ah__";

const x = Object.freeze({
    define(t) {
        function registry(i, s) {
            return t(i, s);
        }
        registry[N] = true;
        registry.register = function(s) {
            i.instance(E, t).register(s);
        };
        return registry;
    },
    isType: t => typeof t === "function" && N in t
});

const j = /*@__PURE__*/ C("IDevToolsExtension", (t => t.cachedCallback((t => {
    const i = t.get(g);
    const s = i.__REDUX_DEVTOOLS_EXTENSION__;
    return s ?? null;
}))));

class Store {
    static register(t) {
        t.register(i.singleton(this, this), i.aliasTo(this, R));
    }
    constructor() {
        this.t = new Set;
        this.i = 0;
        this.h = [];
        this.u = this._state = s(e(J)) ?? new State;
        this.B = s(n(E));
        this._ = s(r);
        this.I = s(h(j));
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
        t.name ??= "Aurelia State plugin";
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

const L = u.Layout;

const H = p.activating;

class StateBinding {
    constructor(t, i, s, e, n, r, h, o) {
        this.isBound = false;
        this.P = null;
        this.v = void 0;
        this.O = void 0;
        this.A = 0;
        this.boundFn = false;
        this.mode = _.toView;
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
        this.updateTarget(this.v = d(this.ast, this.s = createStateBindingScope(this.J.getState(), t), this, this.mode > _.oneTime ? this : null));
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
        const i = this.C.state !== H && (this.N.type & L) > 0;
        const s = this.obs;
        s.version++;
        t = d(this.ast, this.s, this, this);
        s.clear();
        let e;
        if (i) {
            e = this.P;
            this.P = this.R.queueTask((() => {
                this.updateTarget(t);
                this.P = null;
            }), M);
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
        const e = d(this.ast, i, this, this.mode > _.oneTime ? this : null);
        const n = this.C.state !== H && (this.N.type & L) > 0;
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
            }), M);
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

const M = {
    reusable: false,
    preempt: true
};

l(StateBinding);

b(true)(StateBinding);

B(StateBinding, (() => "updateTarget"));

const $ = new WeakMap;

let k = class StateBindingBehavior {
    constructor() {
        this.J = s(R);
    }
    bind(t, i) {
        const s = i instanceof StateBinding;
        t = s ? t : createStateBindingScope(this.J.getState(), t);
        let e;
        if (!s) {
            e = $.get(i);
            if (e == null) {
                $.set(i, e = new StateSubscriber(i, t));
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
            this.J.unsubscribe($.get(i));
            $.delete(i);
        }
    }
};

k = __decorate([ y("state") ], k);

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
        const s = d(this.ast, i, this, null);
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
        f(this.ast, t, this);
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
        S(this.ast, this.s, this);
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

l(StateDispatchBinding);

b(true)(StateDispatchBinding);

B(StateDispatchBinding, (() => "callSource"));

let K = class StateAttributePattern {
    "PART.state"(t, i, s) {
        return new I(t, i, s[0], "state");
    }
};

K = __decorate([ v({
    pattern: "PART.state",
    symbols: "."
}) ], K);

let U = class DispatchAttributePattern {
    "PART.dispatch"(t, i, s) {
        return new I(t, i, s[0], "dispatch");
    }
};

U = __decorate([ v({
    pattern: "PART.dispatch",
    symbols: "."
}) ], U);

let F = class StateBindingCommand {
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
            n = s.map(t.node, n) ?? o(n);
        } else {
            if (r === "" && t.def.kind === "element") {
                r = o(n);
            }
            n = t.bindable.name;
        }
        return new StateBindingInstruction(r, n);
    }
};

F = __decorate([ w("state") ], F);

let G = class DispatchBindingCommand {
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

G = __decorate([ w("dispatch") ], G);

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

let W = class StateBindingInstructionRenderer {
    constructor() {
        this.K = s(R);
    }
    render(t, i, s, e, n, r) {
        t.addBinding(new StateBinding(t, t.container, r, e.domWriteQueue, ensureExpression(n, s.from, "IsFunction"), i, s.to, this.K));
    }
};

W = __decorate([ m("sb") ], W);

let q = class DispatchBindingInstructionRenderer {
    constructor() {
        this.K = s(R);
    }
    render(t, i, s, e, n) {
        const r = ensureExpression(n, s.ast, "IsProperty");
        t.addBinding(new StateDispatchBinding(t.container, r, i, s.from, this.K));
    }
};

q = __decorate([ m("sd") ], q);

function ensureExpression(t, i, s) {
    if (typeof i === "string") {
        return t.parse(i, s);
    }
    return i;
}

const z = [ K, F, W, U, G, q, k, Store ];

const createConfiguration = (t, s, e = {}) => ({
    register: n => {
        n.register(i.instance(J, t), ...z, ...s.map(x.define), T.creating(c, (t => {
            const i = t.get(R);
            const s = t.get(j);
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

const Q = /*@__PURE__*/ createConfiguration({}, []);

let V = class StateGetterBinding {
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

V = __decorate([ l() ], V);

function fromState(t) {
    return function(i, s, e) {
        if (typeof i === "function") {
            throw new Error(`Invalid usage. @state can only be used on a field`);
        }
        if (typeof e?.value !== "undefined") {
            throw new Error(`Invalid usage. @state can only be used on a field`);
        }
        i = i.constructor;
        let n = P.getAnnotation(i, X);
        if (n == null) {
            P.annotate(i, X, n = []);
        }
        n.push(new Y(t, s));
        n = O.getAnnotation(i, X);
        if (n == null) {
            P.annotate(i, X, n = []);
        }
        n.push(new Z(t, s));
    };
}

const X = "dependencies";

let Y = class HydratingLifecycleHooks {
    constructor(t, i) {
        this.$get = t;
        this.key = i;
    }
    register(t) {
        i.instance(A, this).register(t);
    }
    hydrating(t, i) {
        const s = i.container;
        i.addBinding(new V(t, this.key, s.get(R), this.$get));
    }
};

Y = __decorate([ D() ], Y);

let Z = class CreatedLifecycleHooks {
    constructor(t, i) {
        this.$get = t;
        this.key = i;
    }
    register(t) {
        i.instance(A, this).register(t);
    }
    created(t, i) {
        const s = i.container;
        i.addBinding(new V(t, this.key, s.get(R), this.$get));
    }
};

Z = __decorate([ D() ], Z);

export { x as ActionHandler, U as DispatchAttributePattern, G as DispatchBindingCommand, DispatchBindingInstruction, q as DispatchBindingInstructionRenderer, E as IActionHandler, J as IState, R as IStore, K as StateAttributePattern, StateBinding, k as StateBindingBehavior, F as StateBindingCommand, StateBindingInstruction, W as StateBindingInstructionRenderer, Q as StateDefaultConfiguration, StateDispatchBinding, fromState };

