import { DI as t, Registration as i, resolve as s, optional as n, all as e, ILogger as r, lazy as h, camelCase as o, IContainer as c } from "@aurelia/kernel";

import { Scope as a, AccessorType as u, connectable as l, astEvaluate as d, astBind as f, astUnbind as g } from "@aurelia/runtime";

import { IWindow as S, State as p, mixinAstEvaluator as b, mixingBindingLimited as m, BindingMode as B, bindingBehavior as y, attributePattern as _, renderer as v, AttrSyntax as w, AppTask as C, lifecycleHooks as I, CustomElement as T, CustomAttribute as D, ILifecycleHooks as P } from "@aurelia/runtime-html";

const A = t.createInterface;

function createStateBindingScope(t, i) {
    const s = {
        bindingContext: t
    };
    const n = a.create(t, s, true);
    n.parent = i;
    return n;
}

function isSubscribable$1(t) {
    return t instanceof Object && "subscribe" in t;
}

const O = /*@__PURE__*/ A("IActionHandler");

const E = /*@__PURE__*/ A("IStore");

const R = /*@__PURE__*/ A("IState");

const J = "__au_ah__";

const x = Object.freeze({
    define(t) {
        function registry(i, s) {
            return t(i, s);
        }
        registry[J] = true;
        registry.register = function(s) {
            i.instance(O, t).register(s);
        };
        return registry;
    },
    isType: t => typeof t === "function" && J in t
});

const N = /*@__PURE__*/ A("IDevToolsExtension", (t => t.cachedCallback((t => {
    const i = t.get(S);
    const s = i.__REDUX_DEVTOOLS_EXTENSION__;
    return s ?? null;
}))));

class Store {
    static register(t) {
        t.register(i.singleton(this, this), i.aliasTo(this, E));
    }
    constructor() {
        this.t = new Set;
        this.i = 0;
        this.h = [];
        this.u = this._state = s(n(R)) ?? new State;
        this.B = s(e(O));
        this._ = s(r);
        this.C = s(h(N));
    }
    subscribe(t) {
        this.t.add(t);
    }
    unsubscribe(t) {
        this.t.delete(t);
    }
    I(t) {
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
                this.I(t);
                this.i--;
                return afterDispatch(this._state);
            }), (t => {
                this.i--;
                throw t;
            }));
        } else {
            this.I(s);
            this.i--;
            return afterDispatch(this._state);
        }
    }
    connectDevTools(t) {
        const i = this.C();
        const s = i != null;
        if (!s) {
            throw new Error("Devtools extension is not available");
        }
        t.name ??= "Aurelia State plugin";
        const n = i.connect(t);
        n.init(this.u);
        n.subscribe((t => {
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
                    n.send("ACTION", this._state);
                }));
                return;
            }
            if (t.type === "DISPATCH" && i != null) {
                switch (i.type) {
                  case "JUMP_TO_STATE":
                  case "JUMP_TO_ACTION":
                    this.I(JSON.parse(t.state));
                    return;

                  case "COMMIT":
                    n.init(this._state);
                    return;

                  case "RESET":
                    n.init(this.u);
                    this.I(this.u);
                    return;

                  case "ROLLBACK":
                    {
                        const i = JSON.parse(t.state);
                        this.I(i);
                        n.send("ROLLBACK", i);
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

function __decorate(t, i, s, n) {
    var e = arguments.length, r = e < 3 ? i : n === null ? n = Object.getOwnPropertyDescriptor(i, s) : n, h;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(t, i, s, n); else for (var o = t.length - 1; o >= 0; o--) if (h = t[o]) r = (e < 3 ? h(r) : e > 3 ? h(i, s, r) : h(i, s)) || r;
    return e > 3 && r && Object.defineProperty(i, s, r), r;
}

const j = u.Layout;

const L = p.activating;

class StateBinding {
    constructor(t, i, s, n, e, r, h, o) {
        this.isBound = false;
        this.T = null;
        this.v = void 0;
        this.P = void 0;
        this.A = 0;
        this.boundFn = false;
        this.mode = B.toView;
        this.O = t;
        this.l = i;
        this.R = n;
        this.J = o;
        this.oL = s;
        this.ast = e;
        this.target = r;
        this.targetProperty = h;
    }
    updateTarget(t) {
        const i = this.N;
        const s = this.target;
        const n = this.targetProperty;
        const e = this.A++;
        const isCurrentValue = () => e === this.A - 1;
        this.j();
        if (isSubscribable(t)) {
            this.P = t.subscribe((t => {
                if (isCurrentValue()) {
                    i.setValue(t, s, n);
                }
            }));
            return;
        }
        if (t instanceof Promise) {
            void t.then((t => {
                if (isCurrentValue()) {
                    i.setValue(t, s, n);
                }
            }), (() => {}));
            return;
        }
        i.setValue(t, s, n);
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        this.N = this.oL.getAccessor(this.target, this.targetProperty);
        this.J.subscribe(this);
        this.updateTarget(this.v = d(this.ast, this.s = createStateBindingScope(this.J.getState(), t), this, this.mode > B.oneTime ? this : null));
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
        this.T?.cancel();
        this.T = null;
        this.J.unsubscribe(this);
    }
    handleChange(t) {
        if (!this.isBound) {
            return;
        }
        const i = this.O.state !== L && (this.N.type & j) > 0;
        const s = this.obs;
        s.version++;
        t = d(this.ast, this.s, this, this);
        s.clear();
        let n;
        if (i) {
            n = this.T;
            this.T = this.R.queueTask((() => {
                this.updateTarget(t);
                this.T = null;
            }), H);
            n?.cancel();
            n = null;
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
        const n = d(this.ast, i, this, this.mode > B.oneTime ? this : null);
        const e = this.O.state !== L && (this.N.type & j) > 0;
        if (n === this.v) {
            return;
        }
        this.v = n;
        let r = null;
        if (e) {
            r = this.T;
            this.T = this.R.queueTask((() => {
                this.updateTarget(n);
                this.T = null;
            }), H);
            r?.cancel();
        } else {
            this.updateTarget(this.v);
        }
    }
    j() {
        if (typeof this.P === "function") {
            this.P();
        } else if (this.P !== void 0) {
            this.P.dispose?.();
            this.P.unsubscribe?.();
        }
        this.P = void 0;
    }
}

function isSubscribable(t) {
    return t instanceof Object && "subscribe" in t;
}

const H = {
    reusable: false,
    preempt: true
};

l(StateBinding);

b(true)(StateBinding);

m(StateBinding, (() => "updateTarget"));

const M = new WeakMap;

let $ = class StateBindingBehavior {
    constructor() {
        this.J = s(E);
    }
    bind(t, i) {
        const s = i instanceof StateBinding;
        t = s ? t : createStateBindingScope(this.J.getState(), t);
        let n;
        if (!s) {
            n = M.get(i);
            if (n == null) {
                M.set(i, n = new StateSubscriber(i, t));
            } else {
                n.L = t;
            }
            this.J.subscribe(n);
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

$ = __decorate([ y("state") ], $);

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
    constructor(t, i, s, n, e) {
        this.isBound = false;
        this.boundFn = false;
        this.l = t;
        this.J = e;
        this.ast = i;
        this.M = s;
        this.$ = n;
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
        g(this.ast, this.s, this);
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

m(StateDispatchBinding, (() => "callSource"));

let k = class StateAttributePattern {
    "PART.state"(t, i, s) {
        return new w(t, i, s[0], "state");
    }
};

k = __decorate([ _({
    pattern: "PART.state",
    symbols: "."
}) ], k);

let K = class DispatchAttributePattern {
    "PART.dispatch"(t, i, s) {
        return new w(t, i, s[0], "dispatch");
    }
};

K = __decorate([ _({
    pattern: "PART.dispatch",
    symbols: "."
}) ], K);

class StateBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, i, s) {
        const n = t.attr;
        let e = n.target;
        let r = n.rawValue;
        if (t.bindable == null) {
            e = s.map(t.node, e) ?? o(e);
        } else {
            if (r === "" && t.def.kind === "element") {
                r = o(e);
            }
            e = t.bindable.name;
        }
        return new StateBindingInstruction(r, e);
    }
}

StateBindingCommand.$au = {
    type: "binding-command",
    name: "state"
};

class DispatchBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t) {
        const i = t.attr;
        return new DispatchBindingInstruction(i.target, i.rawValue);
    }
}

DispatchBindingCommand.$au = {
    type: "binding-command",
    name: "dispatch"
};

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

let U = class StateBindingInstructionRenderer {
    constructor() {
        this.K = s(E);
    }
    render(t, i, s, n, e, r) {
        t.addBinding(new StateBinding(t, t.container, r, n.domWriteQueue, ensureExpression(e, s.from, "IsFunction"), i, s.to, this.K));
    }
};

U = __decorate([ v("sb") ], U);

let F = class DispatchBindingInstructionRenderer {
    constructor() {
        this.K = s(E);
    }
    render(t, i, s, n, e) {
        const r = ensureExpression(e, s.ast, "IsProperty");
        t.addBinding(new StateDispatchBinding(t.container, r, i, s.from, this.K));
    }
};

F = __decorate([ v("sd") ], F);

function ensureExpression(t, i, s) {
    if (typeof i === "string") {
        return t.parse(i, s);
    }
    return i;
}

const G = [ k, StateBindingCommand, U, K, DispatchBindingCommand, F, $, Store ];

const createConfiguration = (t, s, n = {}) => ({
    register: e => {
        e.register(i.instance(R, t), ...G, ...s.map(x.define), C.creating(c, (t => {
            const i = t.get(E);
            const s = t.get(N);
            if (n.devToolsOptions?.disable !== true && s != null) {
                i.connectDevTools(n.devToolsOptions ?? {});
            }
        })));
    },
    init: (t, i, ...s) => {
        const n = typeof i === "function";
        const e = n ? {} : i;
        s = n ? [ i, ...s ] : s;
        return createConfiguration(t, s, e);
    }
});

const W = /*@__PURE__*/ createConfiguration({}, []);

let q = class StateGetterBinding {
    constructor(t, i, s, n) {
        this.isBound = false;
        this.v = void 0;
        this.P = void 0;
        this.A = 0;
        this.J = s;
        this.$get = n;
        this.target = t;
        this.key = i;
    }
    updateTarget(t) {
        const i = this.target;
        const s = this.key;
        const n = this.A++;
        const isCurrentValue = () => n === this.A - 1;
        this.j();
        if (isSubscribable$1(t)) {
            this.P = t.subscribe((t => {
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
        const n = this.$get(this.J.getState());
        if (n === this.v) {
            return;
        }
        this.v = n;
        this.updateTarget(n);
    }
    j() {
        if (typeof this.P === "function") {
            this.P();
        } else if (this.P !== void 0) {
            this.P.dispose?.();
            this.P.unsubscribe?.();
        }
        this.P = void 0;
    }
};

q = __decorate([ l() ], q);

function fromState(t) {
    return function(i, s, n) {
        if (typeof i === "function") {
            throw new Error(`Invalid usage. @state can only be used on a field`);
        }
        if (typeof n?.value !== "undefined") {
            throw new Error(`Invalid usage. @state can only be used on a field`);
        }
        i = i.constructor;
        let e = T.getAnnotation(i, z);
        if (e == null) {
            T.annotate(i, z, e = []);
        }
        e.push(new Q(t, s));
        e = D.getAnnotation(i, z);
        if (e == null) {
            T.annotate(i, z, e = []);
        }
        e.push(new V(t, s));
    };
}

const z = "dependencies";

let Q = class HydratingLifecycleHooks {
    constructor(t, i) {
        this.$get = t;
        this.key = i;
    }
    register(t) {
        i.instance(P, this).register(t);
    }
    hydrating(t, i) {
        const s = i.container;
        i.addBinding(new q(t, this.key, s.get(E), this.$get));
    }
};

Q = __decorate([ I() ], Q);

let V = class CreatedLifecycleHooks {
    constructor(t, i) {
        this.$get = t;
        this.key = i;
    }
    register(t) {
        i.instance(P, this).register(t);
    }
    created(t, i) {
        const s = i.container;
        i.addBinding(new q(t, this.key, s.get(E), this.$get));
    }
};

V = __decorate([ I() ], V);

export { x as ActionHandler, K as DispatchAttributePattern, DispatchBindingCommand, DispatchBindingInstruction, F as DispatchBindingInstructionRenderer, O as IActionHandler, R as IState, E as IStore, k as StateAttributePattern, StateBinding, $ as StateBindingBehavior, StateBindingCommand, StateBindingInstruction, U as StateBindingInstructionRenderer, W as StateDefaultConfiguration, StateDispatchBinding, fromState };
//# sourceMappingURL=index.mjs.map
