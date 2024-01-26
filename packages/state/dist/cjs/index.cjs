"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var t = require("@aurelia/kernel");

var s = require("@aurelia/runtime-html");

var i = require("@aurelia/runtime");

const e = /*@__PURE__*/ t.DI.createInterface("IActionHandler");

const n = /*@__PURE__*/ t.DI.createInterface("IStore");

const r = /*@__PURE__*/ t.DI.createInterface("IState");

const h = "__au_ah__";

const o = Object.freeze({
    define(s) {
        function registry(t, i) {
            return s(t, i);
        }
        registry[h] = true;
        registry.register = function(i) {
            t.Registration.instance(e, s).register(i);
        };
        return registry;
    },
    isType: t => typeof t === "function" && h in t
});

class Store {
    static register(s) {
        t.Registration.singleton(n, this).register(s);
    }
    constructor(t, s, i) {
        this.t = new Set;
        this.i = 0;
        this.h = [];
        this._state = t ?? new State;
        this.u = s;
        this.B = i;
    }
    subscribe(t) {
        this.t.add(t);
    }
    unsubscribe(t) {
        this.t.delete(t);
    }
    _(t) {
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
        const reduce = (t, s) => this.u.reduce(((t, i) => {
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
                this._(t);
                this.i--;
                return afterDispatch(this._state);
            }), (t => {
                this.i--;
                throw t;
            }));
        } else {
            this._(i);
            this.i--;
            return afterDispatch(this._state);
        }
    }
}

Store.inject = [ t.optional(r), t.all(e), t.ILogger ];

class State {}

function __decorate(t, s, i, e) {
    var n = arguments.length, r = n < 3 ? s : e === null ? e = Object.getOwnPropertyDescriptor(s, i) : e, h;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(t, s, i, e); else for (var o = t.length - 1; o >= 0; o--) if (h = t[o]) r = (n < 3 ? h(r) : n > 3 ? h(s, i, r) : h(s, i)) || r;
    return n > 3 && r && Object.defineProperty(s, i, r), r;
}

function createStateBindingScope(t, s) {
    const e = {
        bindingContext: t
    };
    const n = i.Scope.create(t, e, true);
    n.parent = s;
    return n;
}

function isSubscribable$1(t) {
    return t instanceof Object && "subscribe" in t;
}

const c = i.AccessorType.Layout;

const a = s.State.activating;

class StateBinding {
    constructor(t, i, e, n, r, h, o, c) {
        this.isBound = false;
        this.I = null;
        this.v = void 0;
        this.P = void 0;
        this.C = 0;
        this.boundFn = false;
        this.mode = s.BindingMode.toView;
        this.R = t;
        this.l = i;
        this.A = n;
        this.T = c;
        this.oL = e;
        this.ast = r;
        this.target = h;
        this.targetProperty = o;
    }
    updateTarget(t) {
        const s = this.j;
        const i = this.target;
        const e = this.targetProperty;
        const n = this.C++;
        const isCurrentValue = () => n === this.C - 1;
        this.O();
        if (isSubscribable(t)) {
            this.P = t.subscribe((t => {
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
        this.j = this.oL.getAccessor(this.target, this.targetProperty);
        this.T.subscribe(this);
        this.updateTarget(this.v = i.astEvaluate(this.ast, this.s = createStateBindingScope(this.T.getState(), t), this, this.mode > s.BindingMode.oneTime ? this : null));
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.O();
        this.C++;
        this.s = void 0;
        this.I?.cancel();
        this.I = null;
        this.T.unsubscribe(this);
    }
    handleChange(t) {
        if (!this.isBound) {
            return;
        }
        const s = this.R.state !== a && (this.j.type & c) > 0;
        const e = this.obs;
        e.version++;
        t = i.astEvaluate(this.ast, this.s, this, this);
        e.clear();
        let n;
        if (s) {
            n = this.I;
            this.I = this.A.queueTask((() => {
                this.updateTarget(t);
                this.I = null;
            }), u);
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
        const t = this.T.getState();
        const e = this.s;
        const n = e.overrideContext;
        e.bindingContext = n.bindingContext = n.$state = t;
        const r = i.astEvaluate(this.ast, e, this, this.mode > s.BindingMode.oneTime ? this : null);
        const h = this.R.state !== a && (this.j.type & c) > 0;
        if (r === this.v) {
            return;
        }
        this.v = r;
        let o = null;
        if (h) {
            o = this.I;
            this.I = this.A.queueTask((() => {
                this.updateTarget(r);
                this.I = null;
            }), u);
            o?.cancel();
        } else {
            this.updateTarget(this.v);
        }
    }
    O() {
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

const u = {
    reusable: false,
    preempt: true
};

i.connectable(StateBinding);

s.mixinAstEvaluator(true)(StateBinding);

s.mixingBindingLimited(StateBinding, (() => "updateTarget"));

const l = new WeakMap;

exports.StateBindingBehavior = class StateBindingBehavior {
    constructor(t) {
        this.T = t;
    }
    bind(t, s) {
        const i = s instanceof StateBinding;
        t = i ? t : createStateBindingScope(this.T.getState(), t);
        let e;
        if (!i) {
            e = l.get(s);
            if (e == null) {
                l.set(s, e = new StateSubscriber(s, t));
            } else {
                e.H = t;
            }
            this.T.subscribe(e);
            s.useScope?.(t);
        }
    }
    unbind(t, s) {
        const i = s instanceof StateBinding;
        if (!i) {
            this.T.unsubscribe(l.get(s));
            l.delete(s);
        }
    }
};

exports.StateBindingBehavior.inject = [ n ];

exports.StateBindingBehavior = __decorate([ s.bindingBehavior("state") ], exports.StateBindingBehavior);

class StateSubscriber {
    constructor(t, s) {
        this.q = t;
        this.H = s;
    }
    handleStateChange(t) {
        const s = this.H;
        const i = s.overrideContext;
        s.bindingContext = i.bindingContext = i.$state = t;
        this.q.handleChange?.(undefined, undefined);
    }
}

class StateDispatchBinding {
    constructor(t, s, i, e, n) {
        this.isBound = false;
        this.boundFn = false;
        this.l = t;
        this.T = n;
        this.ast = s;
        this.L = i;
        this.M = e;
    }
    callSource(t) {
        const s = this.s;
        s.overrideContext.$event = t;
        const e = i.astEvaluate(this.ast, s, this, null);
        delete s.overrideContext.$event;
        void this.T.dispatch(e);
    }
    handleEvent(t) {
        this.callSource(t);
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        i.astBind(this.ast, t, this);
        this.s = createStateBindingScope(this.T.getState(), t);
        this.L.addEventListener(this.M, this);
        this.T.subscribe(this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        i.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.L.removeEventListener(this.M, this);
        this.T.unsubscribe(this);
    }
    handleStateChange(t) {
        const s = this.s;
        const i = s.overrideContext;
        s.bindingContext = i.bindingContext = t;
    }
}

i.connectable(StateDispatchBinding);

s.mixinAstEvaluator(true)(StateDispatchBinding);

s.mixingBindingLimited(StateDispatchBinding, (() => "callSource"));

exports.StateAttributePattern = class StateAttributePattern {
    "PART.state"(t, i, e) {
        return new s.AttrSyntax(t, i, e[0], "state");
    }
};

exports.StateAttributePattern = __decorate([ s.attributePattern({
    pattern: "PART.state",
    symbols: "."
}) ], exports.StateAttributePattern);

exports.DispatchAttributePattern = class DispatchAttributePattern {
    "PART.dispatch"(t, i, e) {
        return new s.AttrSyntax(t, i, e[0], "dispatch");
    }
};

exports.DispatchAttributePattern = __decorate([ s.attributePattern({
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
            if (h === "" && s.def.type === "Element") {
                h = t.camelCase(r);
            }
            r = s.bindable.name;
        }
        return new StateBindingInstruction(h, r);
    }
};

exports.StateBindingCommand = __decorate([ s.bindingCommand("state") ], exports.StateBindingCommand);

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

exports.DispatchBindingCommand = __decorate([ s.bindingCommand("dispatch") ], exports.DispatchBindingCommand);

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
    constructor(t) {
        this.$ = t;
    }
    render(t, s, i, e, n, r) {
        t.addBinding(new StateBinding(t, t.container, r, e.domWriteQueue, ensureExpression(n, i.from, "IsFunction"), s, i.to, this.$));
    }
};

exports.StateBindingInstructionRenderer.inject = [ n ];

exports.StateBindingInstructionRenderer = __decorate([ s.renderer("sb") ], exports.StateBindingInstructionRenderer);

exports.DispatchBindingInstructionRenderer = class DispatchBindingInstructionRenderer {
    constructor(t) {
        this.$ = t;
    }
    render(t, s, i, e, n) {
        const r = ensureExpression(n, i.ast, "IsProperty");
        t.addBinding(new StateDispatchBinding(t.container, r, s, i.from, this.$));
    }
};

exports.DispatchBindingInstructionRenderer.inject = [ n ];

exports.DispatchBindingInstructionRenderer = __decorate([ s.renderer("sd") ], exports.DispatchBindingInstructionRenderer);

function ensureExpression(t, s, i) {
    if (typeof s === "string") {
        return t.parse(s, i);
    }
    return s;
}

const d = [ exports.StateAttributePattern, exports.StateBindingCommand, exports.StateBindingInstructionRenderer, exports.DispatchAttributePattern, exports.DispatchBindingCommand, exports.DispatchBindingInstructionRenderer, exports.StateBindingBehavior, Store ];

const createConfiguration = (s, i) => ({
    register: e => {
        e.register(t.Registration.instance(r, s), ...d, ...i.map(o.define));
    },
    init: (t, ...s) => createConfiguration(t, s)
});

const f = createConfiguration({}, []);

let p = class StateGetterBinding {
    constructor(t, s, i, e) {
        this.isBound = false;
        this.v = void 0;
        this.P = void 0;
        this.C = 0;
        this.T = i;
        this.$get = e;
        this.target = t;
        this.key = s;
    }
    updateTarget(t) {
        const s = this.target;
        const i = this.key;
        const e = this.C++;
        const isCurrentValue = () => e === this.C - 1;
        this.O();
        if (isSubscribable$1(t)) {
            this.P = t.subscribe((t => {
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
        const s = this.T.getState();
        this.s = createStateBindingScope(s, t);
        this.T.subscribe(this);
        this.updateTarget(this.v = this.$get(s));
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.O();
        this.C++;
        this.s = void 0;
        this.T.unsubscribe(this);
    }
    handleStateChange(t) {
        const s = this.s;
        const i = s.overrideContext;
        s.bindingContext = i.bindingContext = i.$state = t;
        const e = this.$get(this.T.getState());
        if (e === this.v) {
            return;
        }
        this.v = e;
        this.updateTarget(e);
    }
    O() {
        if (typeof this.P === "function") {
            this.P();
        } else if (this.P !== void 0) {
            this.P.dispose?.();
            this.P.unsubscribe?.();
        }
        this.P = void 0;
    }
};

p = __decorate([ i.connectable() ], p);

function fromState(t) {
    return function(i, e, n) {
        if (typeof i === "function") {
            throw new Error(`Invalid usage. @state can only be used on a field`);
        }
        if (typeof n?.value !== "undefined") {
            throw new Error(`Invalid usage. @state can only be used on a field`);
        }
        i = i.constructor;
        let r = s.CustomElement.getAnnotation(i, g);
        if (r == null) {
            s.CustomElement.annotate(i, g, r = []);
        }
        r.push(new S(t, e));
        r = s.CustomAttribute.getAnnotation(i, g);
        if (r == null) {
            s.CustomElement.annotate(i, g, r = []);
        }
        r.push(new b(t, e));
    };
}

const g = "dependencies";

let S = class HydratingLifecycleHooks {
    constructor(t, s) {
        this.$get = t;
        this.key = s;
    }
    register(i) {
        t.Registration.instance(s.ILifecycleHooks, this).register(i);
    }
    hydrating(t, s) {
        const i = s.container;
        s.addBinding(new p(t, this.key, i.get(n), this.$get));
    }
};

S = __decorate([ s.lifecycleHooks() ], S);

let b = class CreatedLifecycleHooks {
    constructor(t, s) {
        this.$get = t;
        this.key = s;
    }
    register(i) {
        t.Registration.instance(s.ILifecycleHooks, this).register(i);
    }
    created(t, s) {
        const i = s.container;
        s.addBinding(new p(t, this.key, i.get(n), this.$get));
    }
};

b = __decorate([ s.lifecycleHooks() ], b);

exports.ActionHandler = o;

exports.DispatchBindingInstruction = DispatchBindingInstruction;

exports.IActionHandler = e;

exports.IState = r;

exports.IStore = n;

exports.StateBinding = StateBinding;

exports.StateBindingInstruction = StateBindingInstruction;

exports.StateDefaultConfiguration = f;

exports.StateDispatchBinding = StateDispatchBinding;

exports.fromState = fromState;
//# sourceMappingURL=index.cjs.map
