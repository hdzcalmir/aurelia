import { DI as t, Registration as i, resolve as s, optional as n, all as e, ILogger as h, lazy as r, camelCase as o, IContainer as c, Protocol as a } from "../../../kernel/dist/native-modules/index.mjs";

import { Scope as u, IWindow as l, State as d, mixinAstEvaluator as f, mixingBindingLimited as g, BindingMode as S, astEvaluate as p, BindingBehavior as B, astBind as b, astUnbind as m, renderer as y, AppTask as v, LifecycleHooks as w, ILifecycleHooks as C } from "../../../runtime-html/dist/native-modules/index.mjs";

import { AccessorType as I, connectable as D } from "../../../runtime/dist/native-modules/index.mjs";

const T = t.createInterface;

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

const O = /*@__PURE__*/ T("IActionHandler");

const E = /*@__PURE__*/ T("IStore");

const A = /*@__PURE__*/ T("IState");

const P = "__au_ah__";

const _ = Object.freeze({
    define(t) {
        function registry(i, s) {
            return t(i, s);
        }
        registry[P] = true;
        registry.register = function(s) {
            i.instance(O, t).register(s);
        };
        return registry;
    },
    isType: t => typeof t === "function" && P in t
});

const H = /*@__PURE__*/ T("IDevToolsExtension", (t => t.cachedCallback((t => {
    const i = t.get(l);
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
        this.u = this._state = s(n(A)) ?? new State;
        this.B = s(e(O));
        this.C = s(h);
        this.I = s(r(H));
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
        const n = i.connect(t);
        n.init(this.u);
        n.subscribe((t => {
            this.C.info("DevTools sent a message:", t);
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
                    this.T(JSON.parse(t.state));
                    return;

                  case "COMMIT":
                    n.init(this._state);
                    return;

                  case "RESET":
                    n.init(this.u);
                    this.T(this.u);
                    return;

                  case "ROLLBACK":
                    {
                        const i = JSON.parse(t.state);
                        this.T(i);
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

const L = I.Layout;

const k = d.activating;

class StateBinding {
    constructor(t, i, s, n, e, h, r, o) {
        this.isBound = false;
        this.O = null;
        this.v = void 0;
        this.A = void 0;
        this.P = 0;
        this.boundFn = false;
        this.mode = S.toView;
        this._ = t;
        this.l = i;
        this.H = n;
        this.L = o;
        this.oL = s;
        this.ast = e;
        this.target = h;
        this.targetProperty = r;
    }
    updateTarget(t) {
        const i = this.J;
        const s = this.target;
        const n = this.targetProperty;
        const e = this.P++;
        const isCurrentValue = () => e === this.P - 1;
        this.N();
        if (isSubscribable(t)) {
            this.A = t.subscribe((t => {
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
        this.J = this.oL.getAccessor(this.target, this.targetProperty);
        this.L.subscribe(this);
        this.updateTarget(this.v = p(this.ast, this.s = createStateBindingScope(this.L.getState(), t), this, this.mode > S.oneTime ? this : null));
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.N();
        this.P++;
        this.s = void 0;
        this.O?.cancel();
        this.O = null;
        this.L.unsubscribe(this);
    }
    handleChange(t) {
        if (!this.isBound) {
            return;
        }
        const i = this._.state !== k && (this.J.type & L) > 0;
        const s = this.obs;
        s.version++;
        t = p(this.ast, this.s, this, this);
        s.clear();
        let n;
        if (i) {
            n = this.O;
            this.O = this.H.queueTask((() => {
                this.updateTarget(t);
                this.O = null;
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
        const t = this.L.getState();
        const i = this.s;
        const s = i.overrideContext;
        i.bindingContext = s.bindingContext = s.$state = t;
        const n = p(this.ast, i, this, this.mode > S.oneTime ? this : null);
        const e = this._.state !== k && (this.J.type & L) > 0;
        if (n === this.v) {
            return;
        }
        this.v = n;
        let h = null;
        if (e) {
            h = this.O;
            this.O = this.H.queueTask((() => {
                this.updateTarget(n);
                this.O = null;
            }), J);
            h?.cancel();
        } else {
            this.updateTarget(this.v);
        }
    }
    N() {
        if (typeof this.A === "function") {
            this.A();
        } else if (this.A !== void 0) {
            this.A.dispose?.();
            this.A.unsubscribe?.();
        }
        this.A = void 0;
    }
}

function isSubscribable(t) {
    return t instanceof Object && "subscribe" in t;
}

const J = {
    reusable: false,
    preempt: true
};

D(StateBinding, null);

f(true)(StateBinding);

g(StateBinding, (() => "updateTarget"));

const x = new WeakMap;

class StateBindingBehavior {
    constructor() {
        this.L = s(E);
    }
    bind(t, i) {
        const s = i instanceof StateBinding;
        t = s ? t : createStateBindingScope(this.L.getState(), t);
        let n;
        if (!s) {
            n = x.get(i);
            if (n == null) {
                x.set(i, n = new StateSubscriber(i, t));
            } else {
                n.$ = t;
            }
            this.L.subscribe(n);
            i.useScope?.(t);
        }
    }
    unbind(t, i) {
        const s = i instanceof StateBinding;
        if (!s) {
            this.L.unsubscribe(x.get(i));
            x.delete(i);
        }
    }
}

B.define("state", StateBindingBehavior);

class StateSubscriber {
    constructor(t, i) {
        this.M = t;
        this.$ = i;
    }
    handleStateChange(t) {
        const i = this.$;
        const s = i.overrideContext;
        i.bindingContext = s.bindingContext = s.$state = t;
        this.M.handleChange?.(undefined, undefined);
    }
}

class StateDispatchBinding {
    constructor(t, i, s, n, e) {
        this.isBound = false;
        this.boundFn = false;
        this.l = t;
        this.L = e;
        this.ast = i;
        this.R = s;
        this.G = n;
    }
    callSource(t) {
        const i = this.s;
        i.overrideContext.$event = t;
        const s = p(this.ast, i, this, null);
        delete i.overrideContext.$event;
        void this.L.dispatch(s);
    }
    handleEvent(t) {
        this.callSource(t);
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        b(this.ast, t, this);
        this.s = createStateBindingScope(this.L.getState(), t);
        this.R.addEventListener(this.G, this);
        this.L.subscribe(this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        m(this.ast, this.s, this);
        this.s = void 0;
        this.R.removeEventListener(this.G, this);
        this.L.unsubscribe(this);
    }
    handleStateChange(t) {
        const i = this.s;
        const s = i.overrideContext;
        i.bindingContext = s.bindingContext = t;
    }
}

D(StateDispatchBinding, null);

f(true)(StateDispatchBinding);

g(StateDispatchBinding, (() => "callSource"));

class StateBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, i, s) {
        const n = t.attr;
        let e = n.target;
        let h = n.rawValue;
        h = h === "" ? o(e) : h;
        if (t.bindable == null) {
            e = s.map(t.node, e) ?? o(e);
        } else {
            e = t.bindable.name;
        }
        return new StateBindingInstruction(h, e);
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

const N = /*@__PURE__*/ y(class StateBindingInstructionRenderer {
    constructor() {
        this.target = "sb";
        this.j = s(E);
    }
    render(t, i, s, n, e, h) {
        const r = ensureExpression(e, s.from, "IsFunction");
        t.addBinding(new StateBinding(t, t.container, h, n.domQueue, r, i, s.to, this.j));
    }
}, null);

const $ = /*@__PURE__*/ y(class DispatchBindingInstructionRenderer {
    constructor() {
        this.target = "sd";
        this.j = s(E);
    }
    render(t, i, s, n, e) {
        const h = ensureExpression(e, s.ast, "IsProperty");
        t.addBinding(new StateDispatchBinding(t.container, h, i, s.from, this.j));
    }
}, null);

function ensureExpression(t, i, s) {
    if (typeof i === "string") {
        return t.parse(i, s);
    }
    return i;
}

const M = [ StateBindingCommand, N, DispatchBindingCommand, $, StateBindingBehavior, Store ];

const createConfiguration = (t, s, n = {}) => ({
    register: e => {
        e.register(i.instance(A, t), ...M, ...s.map(_.define), v.creating(c, (t => {
            const i = t.get(E);
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

const R = /*@__PURE__*/ createConfiguration({}, []);

class StateGetterBinding {
    constructor(t, i, s, n) {
        this.isBound = false;
        this.v = void 0;
        this.A = void 0;
        this.P = 0;
        this.L = s;
        this.$get = n;
        this.target = t;
        this.key = i;
    }
    updateTarget(t) {
        const i = this.target;
        const s = this.key;
        const n = this.P++;
        const isCurrentValue = () => n === this.P - 1;
        this.N();
        if (isSubscribable$1(t)) {
            this.A = t.subscribe((t => {
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
        const i = this.L.getState();
        this.s = createStateBindingScope(i, t);
        this.L.subscribe(this);
        this.updateTarget(this.v = this.$get(i));
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.N();
        this.P++;
        this.s = void 0;
        this.L.unsubscribe(this);
    }
    handleStateChange(t) {
        const i = this.s;
        const s = i.overrideContext;
        i.bindingContext = s.bindingContext = s.$state = t;
        const n = this.$get(this.L.getState());
        if (n === this.v) {
            return;
        }
        this.v = n;
        this.updateTarget(n);
    }
    N() {
        if (typeof this.A === "function") {
            this.A();
        } else if (this.A !== void 0) {
            this.A.dispose?.();
            this.A.unsubscribe?.();
        }
        this.A = void 0;
    }
}

D(StateGetterBinding, null);

function fromState(t) {
    return function(i, s) {
        if (!(i === void 0 && s.kind === "field" || typeof i === "function" && s.kind === "setter")) {
            throw new Error(`Invalid usage. @state can only be used on a field ${i} - ${s.kind}`);
        }
        const n = s.name;
        const e = s.metadata[G] ??= [];
        e.push(new HydratingLifecycleHooks(t, n), new CreatedLifecycleHooks(t, n));
    };
}

const G = a.annotation.keyFor("dependencies");

class HydratingLifecycleHooks {
    constructor(t, i) {
        this.$get = t;
        this.key = i;
    }
    register(t) {
        i.instance(C, this).register(t);
    }
    hydrating(t, i) {
        const s = i.container;
        if (i.vmKind !== "customElement") return;
        i.addBinding(new StateGetterBinding(t, this.key, s.get(E), this.$get));
    }
}

w.define({}, HydratingLifecycleHooks);

class CreatedLifecycleHooks {
    constructor(t, i) {
        this.$get = t;
        this.key = i;
    }
    register(t) {
        i.instance(C, this).register(t);
    }
    created(t, i) {
        const s = i.container;
        if (i.vmKind !== "customAttribute") return;
        i.addBinding(new StateGetterBinding(t, this.key, s.get(E), this.$get));
    }
}

w.define({}, CreatedLifecycleHooks);

export { _ as ActionHandler, DispatchBindingCommand, DispatchBindingInstruction, $ as DispatchBindingInstructionRenderer, O as IActionHandler, A as IState, E as IStore, StateBinding, StateBindingBehavior, StateBindingCommand, StateBindingInstruction, N as StateBindingInstructionRenderer, R as StateDefaultConfiguration, StateDispatchBinding, fromState };

