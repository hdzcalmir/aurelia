import { DI as t, Registration as i, resolve as s, optional as n, all as e, ILogger as r, lazy as h, camelCase as o, IContainer as c, Protocol as a } from "@aurelia/kernel";

import { Scope as u, AccessorType as d, connectable as l } from "@aurelia/runtime";

import { IWindow as f, State as g, mixinAstEvaluator as S, mixingBindingLimited as p, BindingMode as B, astEvaluate as b, BindingBehavior as m, astBind as y, astUnbind as v, renderer as w, AttrSyntax as I, AppTask as D, LifecycleHooks as C, ILifecycleHooks as A } from "@aurelia/runtime-html";

const P = t.createInterface;

function createStateBindingScope(t, i) {
    const s = {
        bindingContext: t
    };
    const n = u.create(t, s, true);
    n.parent = i;
    return n;
}

function isSubscribable$1(t) {
    return t instanceof Object && "subscribe" in t;
}

const T = /*@__PURE__*/ P("IActionHandler");

const O = /*@__PURE__*/ P("IStore");

const E = /*@__PURE__*/ P("IState");

const R = "__au_ah__";

const _ = Object.freeze({
    define(t) {
        function registry(i, s) {
            return t(i, s);
        }
        registry[R] = true;
        registry.register = function(s) {
            i.instance(T, t).register(s);
        };
        return registry;
    },
    isType: t => typeof t === "function" && R in t
});

const H = /*@__PURE__*/ P("IDevToolsExtension", (t => t.cachedCallback((t => {
    const i = t.get(f);
    const s = i.__REDUX_DEVTOOLS_EXTENSION__;
    return s ?? null;
}))));

class Store {
    static register(t) {
        t.register(i.singleton(this, this), i.aliasTo(this, O));
    }
    constructor() {
        this.t = new Set;
        this.i = 0;
        this.h = [];
        this.u = this._state = s(n(E)) ?? new State;
        this.B = s(e(T));
        this.I = s(r);
        this.C = s(h(H));
    }
    subscribe(t) {
        this.t.add(t);
    }
    unsubscribe(t) {
        this.t.delete(t);
    }
    A(t) {
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
                this.A(t);
                this.i--;
                return afterDispatch(this._state);
            }), (t => {
                this.i--;
                throw t;
            }));
        } else {
            this.A(s);
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
            this.I.info("DevTools sent a message:", t);
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
                    this.A(JSON.parse(t.state));
                    return;

                  case "COMMIT":
                    n.init(this._state);
                    return;

                  case "RESET":
                    n.init(this.u);
                    this.A(this.u);
                    return;

                  case "ROLLBACK":
                    {
                        const i = JSON.parse(t.state);
                        this.A(i);
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

const L = d.Layout;

const k = g.activating;

class StateBinding {
    constructor(t, i, s, n, e, r, h, o) {
        this.isBound = false;
        this.P = null;
        this.v = void 0;
        this.T = void 0;
        this.O = 0;
        this.boundFn = false;
        this.mode = B.toView;
        this.R = t;
        this.l = i;
        this._ = n;
        this.H = o;
        this.oL = s;
        this.ast = e;
        this.target = r;
        this.targetProperty = h;
    }
    updateTarget(t) {
        const i = this.L;
        const s = this.target;
        const n = this.targetProperty;
        const e = this.O++;
        const isCurrentValue = () => e === this.O - 1;
        this.J();
        if (isSubscribable(t)) {
            this.T = t.subscribe((t => {
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
        this.L = this.oL.getAccessor(this.target, this.targetProperty);
        this.H.subscribe(this);
        this.updateTarget(this.v = b(this.ast, this.s = createStateBindingScope(this.H.getState(), t), this, this.mode > B.oneTime ? this : null));
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.J();
        this.O++;
        this.s = void 0;
        this.P?.cancel();
        this.P = null;
        this.H.unsubscribe(this);
    }
    handleChange(t) {
        if (!this.isBound) {
            return;
        }
        const i = this.R.state !== k && (this.L.type & L) > 0;
        const s = this.obs;
        s.version++;
        t = b(this.ast, this.s, this, this);
        s.clear();
        let n;
        if (i) {
            n = this.P;
            this.P = this._.queueTask((() => {
                this.updateTarget(t);
                this.P = null;
            }), J);
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
        const t = this.H.getState();
        const i = this.s;
        const s = i.overrideContext;
        i.bindingContext = s.bindingContext = s.$state = t;
        const n = b(this.ast, i, this, this.mode > B.oneTime ? this : null);
        const e = this.R.state !== k && (this.L.type & L) > 0;
        if (n === this.v) {
            return;
        }
        this.v = n;
        let r = null;
        if (e) {
            r = this.P;
            this.P = this._.queueTask((() => {
                this.updateTarget(n);
                this.P = null;
            }), J);
            r?.cancel();
        } else {
            this.updateTarget(this.v);
        }
    }
    J() {
        if (typeof this.T === "function") {
            this.T();
        } else if (this.T !== void 0) {
            this.T.dispose?.();
            this.T.unsubscribe?.();
        }
        this.T = void 0;
    }
}

function isSubscribable(t) {
    return t instanceof Object && "subscribe" in t;
}

const J = {
    reusable: false,
    preempt: true
};

l(StateBinding, null);

S(true)(StateBinding);

p(StateBinding, (() => "updateTarget"));

const x = new WeakMap;

class StateBindingBehavior {
    constructor() {
        this.H = s(O);
    }
    bind(t, i) {
        const s = i instanceof StateBinding;
        t = s ? t : createStateBindingScope(this.H.getState(), t);
        let n;
        if (!s) {
            n = x.get(i);
            if (n == null) {
                x.set(i, n = new StateSubscriber(i, t));
            } else {
                n.N = t;
            }
            this.H.subscribe(n);
            i.useScope?.(t);
        }
    }
    unbind(t, i) {
        const s = i instanceof StateBinding;
        if (!s) {
            this.H.unsubscribe(x.get(i));
            x.delete(i);
        }
    }
}

m.define("state", StateBindingBehavior);

class StateSubscriber {
    constructor(t, i) {
        this.$ = t;
        this.N = i;
    }
    handleStateChange(t) {
        const i = this.N;
        const s = i.overrideContext;
        i.bindingContext = s.bindingContext = s.$state = t;
        this.$.handleChange?.(undefined, undefined);
    }
}

class StateDispatchBinding {
    constructor(t, i, s, n, e) {
        this.isBound = false;
        this.boundFn = false;
        this.l = t;
        this.H = e;
        this.ast = i;
        this.M = s;
        this.G = n;
    }
    callSource(t) {
        const i = this.s;
        i.overrideContext.$event = t;
        const s = b(this.ast, i, this, null);
        delete i.overrideContext.$event;
        void this.H.dispatch(s);
    }
    handleEvent(t) {
        this.callSource(t);
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        y(this.ast, t, this);
        this.s = createStateBindingScope(this.H.getState(), t);
        this.M.addEventListener(this.G, this);
        this.H.subscribe(this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        v(this.ast, this.s, this);
        this.s = void 0;
        this.M.removeEventListener(this.G, this);
        this.H.unsubscribe(this);
    }
    handleStateChange(t) {
        const i = this.s;
        const s = i.overrideContext;
        i.bindingContext = s.bindingContext = t;
    }
}

l(StateDispatchBinding, null);

S(true)(StateDispatchBinding);

p(StateDispatchBinding, (() => "callSource"));

class StateAttributePattern {
    "PART.state"(t, i, s) {
        return new I(t, i, s[0], "state");
    }
}

class DispatchAttributePattern {
    "PART.dispatch"(t, i, s) {
        return new I(t, i, s[0], "dispatch");
    }
}

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

class StateBindingInstructionRenderer {
    constructor() {
        this.j = s(O);
    }
    render(t, i, s, n, e, r) {
        t.addBinding(new StateBinding(t, t.container, r, n.domWriteQueue, ensureExpression(e, s.from, "IsFunction"), i, s.to, this.j));
    }
}

w("sb")(StateBindingInstructionRenderer, null);

class DispatchBindingInstructionRenderer {
    constructor() {
        this.j = s(O);
    }
    render(t, i, s, n, e) {
        const r = ensureExpression(e, s.ast, "IsProperty");
        t.addBinding(new StateDispatchBinding(t.container, r, i, s.from, this.j));
    }
}

w("sd")(DispatchBindingInstructionRenderer, null);

function ensureExpression(t, i, s) {
    if (typeof i === "string") {
        return t.parse(i, s);
    }
    return i;
}

const N = [ StateAttributePattern, StateBindingCommand, StateBindingInstructionRenderer, DispatchAttributePattern, DispatchBindingCommand, DispatchBindingInstructionRenderer, StateBindingBehavior, Store ];

const createConfiguration = (t, s, n = {}) => ({
    register: e => {
        e.register(i.instance(E, t), ...N, ...s.map(_.define), D.creating(c, (t => {
            const i = t.get(O);
            const s = t.get(H);
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

const $ = /*@__PURE__*/ createConfiguration({}, []);

class StateGetterBinding {
    constructor(t, i, s, n) {
        this.isBound = false;
        this.v = void 0;
        this.T = void 0;
        this.O = 0;
        this.H = s;
        this.$get = n;
        this.target = t;
        this.key = i;
    }
    updateTarget(t) {
        const i = this.target;
        const s = this.key;
        const n = this.O++;
        const isCurrentValue = () => n === this.O - 1;
        this.J();
        if (isSubscribable$1(t)) {
            this.T = t.subscribe((t => {
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
        const i = this.H.getState();
        this.s = createStateBindingScope(i, t);
        this.H.subscribe(this);
        this.updateTarget(this.v = this.$get(i));
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.J();
        this.O++;
        this.s = void 0;
        this.H.unsubscribe(this);
    }
    handleStateChange(t) {
        const i = this.s;
        const s = i.overrideContext;
        i.bindingContext = s.bindingContext = s.$state = t;
        const n = this.$get(this.H.getState());
        if (n === this.v) {
            return;
        }
        this.v = n;
        this.updateTarget(n);
    }
    J() {
        if (typeof this.T === "function") {
            this.T();
        } else if (this.T !== void 0) {
            this.T.dispose?.();
            this.T.unsubscribe?.();
        }
        this.T = void 0;
    }
}

l(StateGetterBinding, null);

function fromState(t) {
    return function(i, s) {
        if (!(i === void 0 && s.kind === "field" || typeof i === "function" && s.kind === "setter")) {
            throw new Error(`Invalid usage. @state can only be used on a field ${i} - ${s.kind}`);
        }
        const n = s.name;
        const e = s.metadata[M] ??= [];
        e.push(new HydratingLifecycleHooks(t, n), new CreatedLifecycleHooks(t, n));
    };
}

const M = a.annotation.keyFor("dependencies");

class HydratingLifecycleHooks {
    constructor(t, i) {
        this.$get = t;
        this.key = i;
    }
    register(t) {
        i.instance(A, this).register(t);
    }
    hydrating(t, i) {
        const s = i.container;
        if (i.vmKind !== "customElement") return;
        i.addBinding(new StateGetterBinding(t, this.key, s.get(O), this.$get));
    }
}

C.define({}, HydratingLifecycleHooks);

class CreatedLifecycleHooks {
    constructor(t, i) {
        this.$get = t;
        this.key = i;
    }
    register(t) {
        i.instance(A, this).register(t);
    }
    created(t, i) {
        const s = i.container;
        if (i.vmKind !== "customAttribute") return;
        i.addBinding(new StateGetterBinding(t, this.key, s.get(O), this.$get));
    }
}

C.define({}, CreatedLifecycleHooks);

export { _ as ActionHandler, DispatchAttributePattern, DispatchBindingCommand, DispatchBindingInstruction, DispatchBindingInstructionRenderer, T as IActionHandler, E as IState, O as IStore, StateAttributePattern, StateBinding, StateBindingBehavior, StateBindingCommand, StateBindingInstruction, StateBindingInstructionRenderer, $ as StateDefaultConfiguration, StateDispatchBinding, fromState };
//# sourceMappingURL=index.mjs.map
