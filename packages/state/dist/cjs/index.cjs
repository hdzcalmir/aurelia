"use strict";

var t = require("@aurelia/kernel");

var i = require("@aurelia/runtime-html");

var s = require("@aurelia/runtime");

const n = t.DI.createInterface;

function createStateBindingScope(t, s) {
    const n = {
        bindingContext: t
    };
    const e = i.Scope.create(t, n, true);
    e.parent = s;
    return e;
}

function isSubscribable$1(t) {
    return t instanceof Object && "subscribe" in t;
}

const e = /*@__PURE__*/ n("IActionHandler");

const r = /*@__PURE__*/ n("IStore");

const h = /*@__PURE__*/ n("IState");

const o = "__au_ah__";

const c = Object.freeze({
    define(i) {
        function registry(t, s) {
            return i(t, s);
        }
        registry[o] = true;
        registry.register = function(s) {
            t.Registration.instance(e, i).register(s);
        };
        return registry;
    },
    isType: t => typeof t === "function" && o in t
});

const a = /*@__PURE__*/ n("IDevToolsExtension", (t => t.cachedCallback((t => {
    const s = t.get(i.IWindow);
    const n = s.__REDUX_DEVTOOLS_EXTENSION__;
    return n ?? null;
}))));

class Store {
    static register(i) {
        i.register(t.Registration.singleton(this, this), t.Registration.aliasTo(this, r));
    }
    constructor() {
        this.t = new Set;
        this.i = 0;
        this.h = [];
        this.u = this._state = t.resolve(t.optional(h)) ?? new State;
        this.B = t.resolve(t.all(e));
        this.C = t.resolve(t.ILogger);
        this.I = t.resolve(t.lazy(a));
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

const u = s.AccessorType.Layout;

const d = i.State.activating;

class StateBinding {
    constructor(t, s, n, e, r, h, o, c) {
        this.isBound = false;
        this.O = null;
        this.v = void 0;
        this.A = void 0;
        this.P = 0;
        this.boundFn = false;
        this.mode = i.BindingMode.toView;
        this._ = t;
        this.l = s;
        this.H = e;
        this.L = c;
        this.oL = n;
        this.ast = r;
        this.target = h;
        this.targetProperty = o;
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
        this.updateTarget(this.v = i.astEvaluate(this.ast, this.s = createStateBindingScope(this.L.getState(), t), this, this.mode > i.BindingMode.oneTime ? this : null));
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
        const s = this._.state !== d && (this.J.type & u) > 0;
        const n = this.obs;
        n.version++;
        t = i.astEvaluate(this.ast, this.s, this, this);
        n.clear();
        let e;
        if (s) {
            e = this.O;
            this.O = this.H.queueTask((() => {
                this.updateTarget(t);
                this.O = null;
            }), l);
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
        const t = this.L.getState();
        const s = this.s;
        const n = s.overrideContext;
        s.bindingContext = n.bindingContext = n.$state = t;
        const e = i.astEvaluate(this.ast, s, this, this.mode > i.BindingMode.oneTime ? this : null);
        const r = this._.state !== d && (this.J.type & u) > 0;
        if (e === this.v) {
            return;
        }
        this.v = e;
        let h = null;
        if (r) {
            h = this.O;
            this.O = this.H.queueTask((() => {
                this.updateTarget(e);
                this.O = null;
            }), l);
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

const l = {
    preempt: true
};

s.connectable(StateBinding, null);

i.mixinAstEvaluator(true)(StateBinding);

i.mixingBindingLimited(StateBinding, (() => "updateTarget"));

const f = new WeakMap;

class StateBindingBehavior {
    constructor() {
        this.L = t.resolve(r);
    }
    bind(t, i) {
        const s = i instanceof StateBinding;
        t = s ? t : createStateBindingScope(this.L.getState(), t);
        let n;
        if (!s) {
            n = f.get(i);
            if (n == null) {
                f.set(i, n = new StateSubscriber(i, t));
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
            this.L.unsubscribe(f.get(i));
            f.delete(i);
        }
    }
}

i.BindingBehavior.define("state", StateBindingBehavior);

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
        const s = this.s;
        s.overrideContext.$event = t;
        const n = i.astEvaluate(this.ast, s, this, null);
        delete s.overrideContext.$event;
        void this.L.dispatch(n);
    }
    handleEvent(t) {
        this.callSource(t);
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        i.astBind(this.ast, t, this);
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
        i.astUnbind(this.ast, this.s, this);
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

s.connectable(StateDispatchBinding, null);

i.mixinAstEvaluator(true)(StateDispatchBinding);

i.mixingBindingLimited(StateDispatchBinding, (() => "callSource"));

class StateBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(i, s, n) {
        const e = i.attr;
        let r = e.target;
        let h = e.rawValue;
        h = h === "" ? t.camelCase(r) : h;
        if (i.bindable == null) {
            r = n.map(i.node, r) ?? t.camelCase(r);
        } else {
            r = i.bindable.name;
        }
        return new StateBindingInstruction(h, r);
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

const g = /*@__PURE__*/ i.renderer(class StateBindingInstructionRenderer {
    constructor() {
        this.target = "sb";
        this.j = t.resolve(r);
    }
    render(t, i, s, n, e, r) {
        const h = ensureExpression(e, s.from, "IsFunction");
        t.addBinding(new StateBinding(t, t.container, r, n.domQueue, h, i, s.to, this.j));
    }
}, null);

const S = /*@__PURE__*/ i.renderer(class DispatchBindingInstructionRenderer {
    constructor() {
        this.target = "sd";
        this.j = t.resolve(r);
    }
    render(t, i, s, n, e) {
        const r = ensureExpression(e, s.ast, "IsProperty");
        t.addBinding(new StateDispatchBinding(t.container, r, i, s.from, this.j));
    }
}, null);

function ensureExpression(t, i, s) {
    if (typeof i === "string") {
        return t.parse(i, s);
    }
    return i;
}

const p = [ StateBindingCommand, g, DispatchBindingCommand, S, StateBindingBehavior, Store ];

const createConfiguration = (s, n, e = {}) => ({
    register: o => {
        o.register(t.Registration.instance(h, s), ...p, ...n.map(c.define), i.AppTask.creating(t.IContainer, (t => {
            const i = t.get(r);
            const s = t.get(a);
            if (e.devToolsOptions?.disable !== true && s != null) {
                i.connectDevTools(e.devToolsOptions ?? {});
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

const B = /*@__PURE__*/ createConfiguration({}, []);

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

s.connectable(StateGetterBinding, null);

function fromState(t) {
    return function(i, s) {
        if (!(i === void 0 && s.kind === "field" || typeof i === "function" && s.kind === "setter")) {
            throw new Error(`Invalid usage. @state can only be used on a field ${i} - ${s.kind}`);
        }
        const n = s.name;
        const e = s.metadata[b] ??= [];
        e.push(new HydratingLifecycleHooks(t, n), new CreatedLifecycleHooks(t, n));
    };
}

const b = t.Protocol.annotation.keyFor("dependencies");

class HydratingLifecycleHooks {
    constructor(t, i) {
        this.$get = t;
        this.key = i;
    }
    register(s) {
        t.Registration.instance(i.ILifecycleHooks, this).register(s);
    }
    hydrating(t, i) {
        const s = i.container;
        if (i.vmKind !== "customElement") return;
        i.addBinding(new StateGetterBinding(t, this.key, s.get(r), this.$get));
    }
}

i.LifecycleHooks.define({}, HydratingLifecycleHooks);

class CreatedLifecycleHooks {
    constructor(t, i) {
        this.$get = t;
        this.key = i;
    }
    register(s) {
        t.Registration.instance(i.ILifecycleHooks, this).register(s);
    }
    created(t, i) {
        const s = i.container;
        if (i.vmKind !== "customAttribute") return;
        i.addBinding(new StateGetterBinding(t, this.key, s.get(r), this.$get));
    }
}

i.LifecycleHooks.define({}, CreatedLifecycleHooks);

exports.ActionHandler = c;

exports.DispatchBindingCommand = DispatchBindingCommand;

exports.DispatchBindingInstruction = DispatchBindingInstruction;

exports.DispatchBindingInstructionRenderer = S;

exports.IActionHandler = e;

exports.IState = h;

exports.IStore = r;

exports.StateBinding = StateBinding;

exports.StateBindingBehavior = StateBindingBehavior;

exports.StateBindingCommand = StateBindingCommand;

exports.StateBindingInstruction = StateBindingInstruction;

exports.StateBindingInstructionRenderer = g;

exports.StateDefaultConfiguration = B;

exports.StateDispatchBinding = StateDispatchBinding;

exports.fromState = fromState;
//# sourceMappingURL=index.cjs.map
