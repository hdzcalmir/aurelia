"use strict";

var t = require("@aurelia/kernel");

var s = require("@aurelia/runtime");

var i = require("@aurelia/runtime-html");

const e = t.DI.createInterface;

function createStateBindingScope(t, i) {
    const e = {
        bindingContext: t
    };
    const n = s.Scope.create(t, e, true);
    n.parent = i;
    return n;
}

function isSubscribable$1(t) {
    return t instanceof Object && "subscribe" in t;
}

const n = /*@__PURE__*/ e("IActionHandler");

const r = /*@__PURE__*/ e("IStore");

const h = /*@__PURE__*/ e("IState");

const o = "__au_ah__";

const c = Object.freeze({
    define(s) {
        function registry(t, i) {
            return s(t, i);
        }
        registry[o] = true;
        registry.register = function(i) {
            t.Registration.instance(n, s).register(i);
        };
        return registry;
    },
    isType: t => typeof t === "function" && o in t
});

const a = /*@__PURE__*/ e("IDevToolsExtension", (t => t.cachedCallback((t => {
    const s = t.get(i.IWindow);
    const e = s.__REDUX_DEVTOOLS_EXTENSION__;
    return e ?? null;
}))));

class Store {
    static register(s) {
        s.register(t.Registration.singleton(this, this), t.Registration.aliasTo(this, r));
    }
    constructor() {
        this.t = new Set;
        this.i = 0;
        this.h = [];
        this.u = this._state = t.resolve(t.optional(h)) ?? new State;
        this.B = t.resolve(t.all(n));
        this._ = t.resolve(t.ILogger);
        this.I = t.resolve(t.lazy(a));
    }
    subscribe(t) {
        this.t.add(t);
    }
    unsubscribe(t) {
        this.t.delete(t);
    }
    T(t) {
        const s = this._state;
        this._state = t;
        this.t.forEach((i => i.handleStateChange(t, s)));
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
        let s;
        const reduce = (t, s) => this.B.reduce(((t, i) => {
            if (t instanceof Promise) {
                return t.then((t => i(t, s)));
            }
            return i(t, s);
        }), t);
        const afterDispatch = t => {
            if (this.h.length > 0) {
                s = this.h.shift();
                const i = reduce(t, s);
                if (i instanceof Promise) {
                    return i.then((t => afterDispatch(t)));
                } else {
                    return afterDispatch(i);
                }
            }
        };
        const i = reduce(this._state, t);
        if (i instanceof Promise) {
            return i.then((t => {
                this.T(t);
                this.i--;
                return afterDispatch(this._state);
            }), (t => {
                this.i--;
                throw t;
            }));
        } else {
            this.T(i);
            this.i--;
            return afterDispatch(this._state);
        }
    }
    connectDevTools(t) {
        const s = this.I();
        const i = s != null;
        if (!i) {
            throw new Error("Devtools extension is not available");
        }
        t.name ??= "Aurelia State plugin";
        const e = s.connect(t);
        e.init(this.u);
        e.subscribe((t => {
            this._.info("DevTools sent a message:", t);
            const s = typeof t.payload === "string" ? tryParseJson(t.payload) : t.payload;
            if (s === void 0) {
                return;
            }
            if (t.type === "ACTION") {
                if (s == null) {
                    throw new Error("DevTools sent an action with no payload");
                }
                void new Promise((t => {
                    t(this.dispatch(s));
                })).catch((t => {
                    throw new Error(`Issue when trying to dispatch an action through devtools:\n${t}`);
                })).then((() => {
                    e.send("ACTION", this._state);
                }));
                return;
            }
            if (t.type === "DISPATCH" && s != null) {
                switch (s.type) {
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
                        const s = JSON.parse(t.state);
                        this.T(s);
                        e.send("ROLLBACK", s);
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
    } catch (s) {
        console.log(`Error parsing JSON:\n${(t ?? "").slice(0, 200)}\n${s}`);
        return undefined;
    }
}

function __decorate(t, s, i, e) {
    var n = arguments.length, r = n < 3 ? s : e === null ? e = Object.getOwnPropertyDescriptor(s, i) : e, h;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(t, s, i, e); else for (var o = t.length - 1; o >= 0; o--) if (h = t[o]) r = (n < 3 ? h(r) : n > 3 ? h(s, i, r) : h(s, i)) || r;
    return n > 3 && r && Object.defineProperty(s, i, r), r;
}

const u = s.AccessorType.Layout;

const l = i.State.activating;

class StateBinding {
    constructor(t, s, e, n, r, h, o, c) {
        this.isBound = false;
        this.P = null;
        this.v = void 0;
        this.O = void 0;
        this.A = 0;
        this.boundFn = false;
        this.mode = i.BindingMode.toView;
        this.C = t;
        this.l = s;
        this.R = n;
        this.J = c;
        this.oL = e;
        this.ast = r;
        this.target = h;
        this.targetProperty = o;
    }
    updateTarget(t) {
        const s = this.N;
        const i = this.target;
        const e = this.targetProperty;
        const n = this.A++;
        const isCurrentValue = () => n === this.A - 1;
        this.j();
        if (isSubscribable(t)) {
            this.O = t.subscribe((t => {
                if (isCurrentValue()) {
                    s.setValue(t, i, e);
                }
            }));
            return;
        }
        if (t instanceof Promise) {
            void t.then((t => {
                if (isCurrentValue()) {
                    s.setValue(t, i, e);
                }
            }), (() => {}));
            return;
        }
        s.setValue(t, i, e);
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        this.N = this.oL.getAccessor(this.target, this.targetProperty);
        this.J.subscribe(this);
        this.updateTarget(this.v = s.astEvaluate(this.ast, this.s = createStateBindingScope(this.J.getState(), t), this, this.mode > i.BindingMode.oneTime ? this : null));
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
        const i = this.C.state !== l && (this.N.type & u) > 0;
        const e = this.obs;
        e.version++;
        t = s.astEvaluate(this.ast, this.s, this, this);
        e.clear();
        let n;
        if (i) {
            n = this.P;
            this.P = this.R.queueTask((() => {
                this.updateTarget(t);
                this.P = null;
            }), d);
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
        const e = this.s;
        const n = e.overrideContext;
        e.bindingContext = n.bindingContext = n.$state = t;
        const r = s.astEvaluate(this.ast, e, this, this.mode > i.BindingMode.oneTime ? this : null);
        const h = this.C.state !== l && (this.N.type & u) > 0;
        if (r === this.v) {
            return;
        }
        this.v = r;
        let o = null;
        if (h) {
            o = this.P;
            this.P = this.R.queueTask((() => {
                this.updateTarget(r);
                this.P = null;
            }), d);
            o?.cancel();
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

const d = {
    reusable: false,
    preempt: true
};

s.connectable(StateBinding);

i.mixinAstEvaluator(true)(StateBinding);

i.mixingBindingLimited(StateBinding, (() => "updateTarget"));

const f = new WeakMap;

exports.StateBindingBehavior = class StateBindingBehavior {
    constructor() {
        this.J = t.resolve(r);
    }
    bind(t, s) {
        const i = s instanceof StateBinding;
        t = i ? t : createStateBindingScope(this.J.getState(), t);
        let e;
        if (!i) {
            e = f.get(s);
            if (e == null) {
                f.set(s, e = new StateSubscriber(s, t));
            } else {
                e.L = t;
            }
            this.J.subscribe(e);
            s.useScope?.(t);
        }
    }
    unbind(t, s) {
        const i = s instanceof StateBinding;
        if (!i) {
            this.J.unsubscribe(f.get(s));
            f.delete(s);
        }
    }
};

exports.StateBindingBehavior = __decorate([ i.bindingBehavior("state") ], exports.StateBindingBehavior);

class StateSubscriber {
    constructor(t, s) {
        this.H = t;
        this.L = s;
    }
    handleStateChange(t) {
        const s = this.L;
        const i = s.overrideContext;
        s.bindingContext = i.bindingContext = i.$state = t;
        this.H.handleChange?.(undefined, undefined);
    }
}

class StateDispatchBinding {
    constructor(t, s, i, e, n) {
        this.isBound = false;
        this.boundFn = false;
        this.l = t;
        this.J = n;
        this.ast = s;
        this.M = i;
        this.$ = e;
    }
    callSource(t) {
        const i = this.s;
        i.overrideContext.$event = t;
        const e = s.astEvaluate(this.ast, i, this, null);
        delete i.overrideContext.$event;
        void this.J.dispatch(e);
    }
    handleEvent(t) {
        this.callSource(t);
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        s.astBind(this.ast, t, this);
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
        s.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.M.removeEventListener(this.$, this);
        this.J.unsubscribe(this);
    }
    handleStateChange(t) {
        const s = this.s;
        const i = s.overrideContext;
        s.bindingContext = i.bindingContext = t;
    }
}

s.connectable(StateDispatchBinding);

i.mixinAstEvaluator(true)(StateDispatchBinding);

i.mixingBindingLimited(StateDispatchBinding, (() => "callSource"));

exports.StateAttributePattern = class StateAttributePattern {
    "PART.state"(t, s, e) {
        return new i.AttrSyntax(t, s, e[0], "state");
    }
};

exports.StateAttributePattern = __decorate([ i.attributePattern({
    pattern: "PART.state",
    symbols: "."
}) ], exports.StateAttributePattern);

exports.DispatchAttributePattern = class DispatchAttributePattern {
    "PART.dispatch"(t, s, e) {
        return new i.AttrSyntax(t, s, e[0], "dispatch");
    }
};

exports.DispatchAttributePattern = __decorate([ i.attributePattern({
    pattern: "PART.dispatch",
    symbols: "."
}) ], exports.DispatchAttributePattern);

exports.StateBindingCommand = class StateBindingCommand {
    get type() {
        return "None";
    }
    get name() {
        return "state";
    }
    build(s, i, e) {
        const n = s.attr;
        let r = n.target;
        let h = n.rawValue;
        if (s.bindable == null) {
            r = e.map(s.node, r) ?? t.camelCase(r);
        } else {
            if (h === "" && s.def.kind === "element") {
                h = t.camelCase(r);
            }
            r = s.bindable.name;
        }
        return new StateBindingInstruction(h, r);
    }
};

exports.StateBindingCommand = __decorate([ i.bindingCommand("state") ], exports.StateBindingCommand);

exports.DispatchBindingCommand = class DispatchBindingCommand {
    get type() {
        return "IgnoreAttr";
    }
    get name() {
        return "dispatch";
    }
    build(t) {
        const s = t.attr;
        return new DispatchBindingInstruction(s.target, s.rawValue);
    }
};

exports.DispatchBindingCommand = __decorate([ i.bindingCommand("dispatch") ], exports.DispatchBindingCommand);

class StateBindingInstruction {
    constructor(t, s) {
        this.from = t;
        this.to = s;
        this.type = "sb";
    }
}

class DispatchBindingInstruction {
    constructor(t, s) {
        this.from = t;
        this.ast = s;
        this.type = "sd";
    }
}

exports.StateBindingInstructionRenderer = class StateBindingInstructionRenderer {
    constructor() {
        this.q = t.resolve(r);
    }
    render(t, s, i, e, n, r) {
        t.addBinding(new StateBinding(t, t.container, r, e.domWriteQueue, ensureExpression(n, i.from, "IsFunction"), s, i.to, this.q));
    }
};

exports.StateBindingInstructionRenderer = __decorate([ i.renderer("sb") ], exports.StateBindingInstructionRenderer);

exports.DispatchBindingInstructionRenderer = class DispatchBindingInstructionRenderer {
    constructor() {
        this.q = t.resolve(r);
    }
    render(t, s, i, e, n) {
        const r = ensureExpression(n, i.ast, "IsProperty");
        t.addBinding(new StateDispatchBinding(t.container, r, s, i.from, this.q));
    }
};

exports.DispatchBindingInstructionRenderer = __decorate([ i.renderer("sd") ], exports.DispatchBindingInstructionRenderer);

function ensureExpression(t, s, i) {
    if (typeof s === "string") {
        return t.parse(s, i);
    }
    return s;
}

const p = [ exports.StateAttributePattern, exports.StateBindingCommand, exports.StateBindingInstructionRenderer, exports.DispatchAttributePattern, exports.DispatchBindingCommand, exports.DispatchBindingInstructionRenderer, exports.StateBindingBehavior, Store ];

const createConfiguration = (s, e, n = {}) => ({
    register: o => {
        o.register(t.Registration.instance(h, s), ...p, ...e.map(c.define), i.AppTask.creating(t.IContainer, (t => {
            const s = t.get(r);
            const i = t.get(a);
            if (n.devToolsOptions?.disable !== true && i != null) {
                s.connectDevTools(n.devToolsOptions ?? {});
            }
        })));
    },
    init: (t, s, ...i) => {
        const e = typeof s === "function";
        const n = e ? {} : s;
        i = e ? [ s, ...i ] : i;
        return createConfiguration(t, i, n);
    }
});

const g = /*@__PURE__*/ createConfiguration({}, []);

let S = class StateGetterBinding {
    constructor(t, s, i, e) {
        this.isBound = false;
        this.v = void 0;
        this.O = void 0;
        this.A = 0;
        this.J = i;
        this.$get = e;
        this.target = t;
        this.key = s;
    }
    updateTarget(t) {
        const s = this.target;
        const i = this.key;
        const e = this.A++;
        const isCurrentValue = () => e === this.A - 1;
        this.j();
        if (isSubscribable$1(t)) {
            this.O = t.subscribe((t => {
                if (isCurrentValue()) {
                    s[i] = t;
                }
            }));
            return;
        }
        if (t instanceof Promise) {
            void t.then((t => {
                if (isCurrentValue()) {
                    s[i] = t;
                }
            }), (() => {}));
            return;
        }
        s[i] = t;
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        const s = this.J.getState();
        this.s = createStateBindingScope(s, t);
        this.J.subscribe(this);
        this.updateTarget(this.v = this.$get(s));
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
        const s = this.s;
        const i = s.overrideContext;
        s.bindingContext = i.bindingContext = i.$state = t;
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

S = __decorate([ s.connectable() ], S);

function fromState(t) {
    return function(s, e, n) {
        if (typeof s === "function") {
            throw new Error(`Invalid usage. @state can only be used on a field`);
        }
        if (typeof n?.value !== "undefined") {
            throw new Error(`Invalid usage. @state can only be used on a field`);
        }
        s = s.constructor;
        let r = i.CustomElement.getAnnotation(s, b);
        if (r == null) {
            i.CustomElement.annotate(s, b, r = []);
        }
        r.push(new x(t, e));
        r = i.CustomAttribute.getAnnotation(s, b);
        if (r == null) {
            i.CustomElement.annotate(s, b, r = []);
        }
        r.push(new B(t, e));
    };
}

const b = "dependencies";

let x = class HydratingLifecycleHooks {
    constructor(t, s) {
        this.$get = t;
        this.key = s;
    }
    register(s) {
        t.Registration.instance(i.ILifecycleHooks, this).register(s);
    }
    hydrating(t, s) {
        const i = s.container;
        s.addBinding(new S(t, this.key, i.get(r), this.$get));
    }
};

x = __decorate([ i.lifecycleHooks() ], x);

let B = class CreatedLifecycleHooks {
    constructor(t, s) {
        this.$get = t;
        this.key = s;
    }
    register(s) {
        t.Registration.instance(i.ILifecycleHooks, this).register(s);
    }
    created(t, s) {
        const i = s.container;
        s.addBinding(new S(t, this.key, i.get(r), this.$get));
    }
};

B = __decorate([ i.lifecycleHooks() ], B);

exports.ActionHandler = c;

exports.DispatchBindingInstruction = DispatchBindingInstruction;

exports.IActionHandler = n;

exports.IState = h;

exports.IStore = r;

exports.StateBinding = StateBinding;

exports.StateBindingInstruction = StateBindingInstruction;

exports.StateDefaultConfiguration = g;

exports.StateDispatchBinding = StateDispatchBinding;

exports.fromState = fromState;
//# sourceMappingURL=index.cjs.map
