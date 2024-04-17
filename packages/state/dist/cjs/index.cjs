"use strict";

var t = require("@aurelia/kernel");

var i = require("@aurelia/runtime");

var s = require("@aurelia/runtime-html");

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
    const i = t.get(s.IWindow);
    const n = i.__REDUX_DEVTOOLS_EXTENSION__;
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
        this.I = t.resolve(t.ILogger);
        this.C = t.resolve(t.lazy(a));
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

const u = i.AccessorType.Layout;

const d = s.State.activating;

class StateBinding {
    constructor(t, i, n, e, r, h, o, c) {
        this.isBound = false;
        this.P = null;
        this.v = void 0;
        this.T = void 0;
        this.O = 0;
        this.boundFn = false;
        this.mode = s.BindingMode.toView;
        this.R = t;
        this.l = i;
        this._ = e;
        this.H = c;
        this.oL = n;
        this.ast = r;
        this.target = h;
        this.targetProperty = o;
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
        this.updateTarget(this.v = s.astEvaluate(this.ast, this.s = createStateBindingScope(this.H.getState(), t), this, this.mode > s.BindingMode.oneTime ? this : null));
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
        const i = this.R.state !== d && (this.L.type & u) > 0;
        const n = this.obs;
        n.version++;
        t = s.astEvaluate(this.ast, this.s, this, this);
        n.clear();
        let e;
        if (i) {
            e = this.P;
            this.P = this._.queueTask((() => {
                this.updateTarget(t);
                this.P = null;
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
        const t = this.H.getState();
        const i = this.s;
        const n = i.overrideContext;
        i.bindingContext = n.bindingContext = n.$state = t;
        const e = s.astEvaluate(this.ast, i, this, this.mode > s.BindingMode.oneTime ? this : null);
        const r = this.R.state !== d && (this.L.type & u) > 0;
        if (e === this.v) {
            return;
        }
        this.v = e;
        let h = null;
        if (r) {
            h = this.P;
            this.P = this._.queueTask((() => {
                this.updateTarget(e);
                this.P = null;
            }), l);
            h?.cancel();
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

const l = {
    reusable: false,
    preempt: true
};

i.connectable(StateBinding, null);

s.mixinAstEvaluator(true)(StateBinding);

s.mixingBindingLimited(StateBinding, (() => "updateTarget"));

const f = new WeakMap;

class StateBindingBehavior {
    constructor() {
        this.H = t.resolve(r);
    }
    bind(t, i) {
        const s = i instanceof StateBinding;
        t = s ? t : createStateBindingScope(this.H.getState(), t);
        let n;
        if (!s) {
            n = f.get(i);
            if (n == null) {
                f.set(i, n = new StateSubscriber(i, t));
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
            this.H.unsubscribe(f.get(i));
            f.delete(i);
        }
    }
}

s.BindingBehavior.define("state", StateBindingBehavior);

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
        const n = s.astEvaluate(this.ast, i, this, null);
        delete i.overrideContext.$event;
        void this.H.dispatch(n);
    }
    handleEvent(t) {
        this.callSource(t);
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        s.astBind(this.ast, t, this);
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
        s.astUnbind(this.ast, this.s, this);
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

i.connectable(StateDispatchBinding, null);

s.mixinAstEvaluator(true)(StateDispatchBinding);

s.mixingBindingLimited(StateDispatchBinding, (() => "callSource"));

class StateAttributePattern {
    "PART.state"(t, i, n) {
        return new s.AttrSyntax(t, i, n[0], "state");
    }
}

class DispatchAttributePattern {
    "PART.dispatch"(t, i, n) {
        return new s.AttrSyntax(t, i, n[0], "dispatch");
    }
}

class StateBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(i, s, n) {
        const e = i.attr;
        let r = e.target;
        let h = e.rawValue;
        if (i.bindable == null) {
            r = n.map(i.node, r) ?? t.camelCase(r);
        } else {
            if (h === "" && i.def.kind === "element") {
                h = t.camelCase(r);
            }
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

class StateBindingInstructionRenderer {
    constructor() {
        this.j = t.resolve(r);
    }
    render(t, i, s, n, e, r) {
        t.addBinding(new StateBinding(t, t.container, r, n.domWriteQueue, ensureExpression(e, s.from, "IsFunction"), i, s.to, this.j));
    }
}

s.renderer("sb")(StateBindingInstructionRenderer, null);

class DispatchBindingInstructionRenderer {
    constructor() {
        this.j = t.resolve(r);
    }
    render(t, i, s, n, e) {
        const r = ensureExpression(e, s.ast, "IsProperty");
        t.addBinding(new StateDispatchBinding(t.container, r, i, s.from, this.j));
    }
}

s.renderer("sd")(DispatchBindingInstructionRenderer, null);

function ensureExpression(t, i, s) {
    if (typeof i === "string") {
        return t.parse(i, s);
    }
    return i;
}

const g = [ StateAttributePattern, StateBindingCommand, StateBindingInstructionRenderer, DispatchAttributePattern, DispatchBindingCommand, DispatchBindingInstructionRenderer, StateBindingBehavior, Store ];

const createConfiguration = (i, n, e = {}) => ({
    register: o => {
        o.register(t.Registration.instance(h, i), ...g, ...n.map(c.define), s.AppTask.creating(t.IContainer, (t => {
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

const S = /*@__PURE__*/ createConfiguration({}, []);

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

i.connectable(StateGetterBinding, null);

function fromState(t) {
    return function(i, s) {
        if (!(i === void 0 && s.kind === "field" || typeof i === "function" && s.kind === "setter")) {
            throw new Error(`Invalid usage. @state can only be used on a field ${i} - ${s.kind}`);
        }
        const n = s.name;
        const e = s.metadata[p] ??= [];
        e.push(new HydratingLifecycleHooks(t, n), new CreatedLifecycleHooks(t, n));
    };
}

const p = t.Protocol.annotation.keyFor("dependencies");

class HydratingLifecycleHooks {
    constructor(t, i) {
        this.$get = t;
        this.key = i;
    }
    register(i) {
        t.Registration.instance(s.ILifecycleHooks, this).register(i);
    }
    hydrating(t, i) {
        const s = i.container;
        if (i.vmKind !== "customElement") return;
        i.addBinding(new StateGetterBinding(t, this.key, s.get(r), this.$get));
    }
}

s.LifecycleHooks.define({}, HydratingLifecycleHooks);

class CreatedLifecycleHooks {
    constructor(t, i) {
        this.$get = t;
        this.key = i;
    }
    register(i) {
        t.Registration.instance(s.ILifecycleHooks, this).register(i);
    }
    created(t, i) {
        const s = i.container;
        if (i.vmKind !== "customAttribute") return;
        i.addBinding(new StateGetterBinding(t, this.key, s.get(r), this.$get));
    }
}

s.LifecycleHooks.define({}, CreatedLifecycleHooks);

exports.ActionHandler = c;

exports.DispatchAttributePattern = DispatchAttributePattern;

exports.DispatchBindingCommand = DispatchBindingCommand;

exports.DispatchBindingInstruction = DispatchBindingInstruction;

exports.DispatchBindingInstructionRenderer = DispatchBindingInstructionRenderer;

exports.IActionHandler = e;

exports.IState = h;

exports.IStore = r;

exports.StateAttributePattern = StateAttributePattern;

exports.StateBinding = StateBinding;

exports.StateBindingBehavior = StateBindingBehavior;

exports.StateBindingCommand = StateBindingCommand;

exports.StateBindingInstruction = StateBindingInstruction;

exports.StateBindingInstructionRenderer = StateBindingInstructionRenderer;

exports.StateDefaultConfiguration = S;

exports.StateDispatchBinding = StateDispatchBinding;

exports.fromState = fromState;
//# sourceMappingURL=index.cjs.map
