"use strict";

var t = require("@aurelia/runtime");

var e = require("@aurelia/runtime-html");

var i = require("@aurelia/kernel");

let n = false;

function defineAstMethods() {
    if (n) {
        return;
    }
    n = true;
    const def = (t, e, i) => Object.defineProperty(t.prototype, e, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: i
    });
    [ t.BindingBehaviorExpression, t.ValueConverterExpression, t.AssignExpression, t.ConditionalExpression, t.AccessThisExpression, t.AccessScopeExpression, t.AccessMemberExpression, t.AccessKeyedExpression, t.CallScopeExpression, t.CallMemberExpression, t.CallFunctionExpression, t.BinaryExpression, t.UnaryExpression, t.PrimitiveLiteralExpression, t.ArrayLiteralExpression, t.ObjectLiteralExpression, t.TemplateExpression, t.TaggedTemplateExpression, t.ArrayBindingPattern, t.ObjectBindingPattern, t.BindingIdentifier, t.ForOfStatement, t.Interpolation, t.DestructuringAssignmentExpression, t.DestructuringAssignmentSingleExpression, t.DestructuringAssignmentRestExpression, t.ArrowFunction ].forEach((e => {
        def(e, "evaluate", (function(...e) {
            return t.astEvaluate(this, ...e);
        }));
        def(e, "assign", (function(...e) {
            return t.astAssign(this, ...e);
        }));
        def(e, "accept", (function(...e) {
            return t.astVisit(this, ...e);
        }));
        def(e, "bind", (function(...e) {
            return t.astBind(this, ...e);
        }));
        def(e, "unbind", (function(...e) {
            return t.astUnbind(this, ...e);
        }));
    }));
    console.warn('"evaluate"/"assign"/"accept"/"visit"/"bind"/"unbind" are only valid on AST with ast $kind "Custom".' + " Or import and use astEvaluate/astAssign/astVisit/astBind/astUnbind accordingly.");
}

function __decorate(t, e, i, n) {
    var s = arguments.length, r = s < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, i) : n, o;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(t, e, i, n); else for (var l = t.length - 1; l >= 0; l--) if (o = t[l]) r = (s < 3 ? o(r) : s > 3 ? o(e, i, r) : o(e, i)) || r;
    return s > 3 && r && Object.defineProperty(e, i, r), r;
}

const createLookup = () => Object.create(null);

const isFunction = t => typeof t === "function";

const isString = t => typeof t === "string";

const s = Reflect.defineProperty;

const defineHiddenProp = (t, e, i) => {
    s(t, e, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: i
    });
    return i;
};

const ensureExpression = (t, e, i) => {
    if (isString(e)) {
        return t.parse(e, i);
    }
    return e;
};

const r = "IsFunction";

const o = new WeakSet;

const l = {
    register(t) {
        if (!o.has(t)) {
            o.add(t);
            t.register(CallBindingCommand, exports.CallBindingRenderer);
        }
    }
};

const a = "rh";

class CallBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = a;
    }
}

class CallBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, e) {
        const n = t.bindable === null ? i.camelCase(t.attr.target) : t.bindable.name;
        return new CallBindingInstruction(e.parse(t.attr.rawValue, r), n);
    }
}

CallBindingCommand.$au = {
    type: "binding-command",
    name: "call"
};

exports.CallBindingRenderer = class CallBindingRenderer {
    render(t, e, i, n, s, o) {
        const l = ensureExpression(s, i.from, r);
        t.addBinding(new CallBinding(t.container, o, l, getTarget(e), i.to));
    }
};

exports.CallBindingRenderer = __decorate([ e.renderer(a) ], exports.CallBindingRenderer);

function getTarget(t) {
    if (t.viewModel != null) {
        return t.viewModel;
    }
    return t;
}

class CallBinding {
    constructor(t, e, i, n, s) {
        this.ast = i;
        this.target = n;
        this.targetProperty = s;
        this.isBound = false;
        this.boundFn = false;
        this.l = t;
        this.targetObserver = e.getAccessor(n, s);
    }
    callSource(e) {
        const i = this.s.overrideContext;
        i.$event = e;
        const n = t.astEvaluate(this.ast, this.s, this, null);
        Reflect.deleteProperty(i, "$event");
        return n;
    }
    bind(e) {
        if (this.isBound) {
            if (this.s === e) {
                return;
            }
            this.unbind();
        }
        this.s = e;
        t.astBind(this.ast, e, this);
        this.targetObserver.setValue((t => this.callSource(t)), this.target, this.targetProperty);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        t.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.targetObserver.setValue(null, this.target, this.targetProperty);
    }
}

e.mixinUseScope(CallBinding);

e.mixingBindingLimited(CallBinding, (() => "callSource"));

e.mixinAstEvaluator(true)(CallBinding);

const c = new WeakSet;

const h = {
    register(t) {
        if (c.has(t)) {
            return;
        }
        c.add(t);
        t.get(e.IListenerBindingOptions).prevent = true;
    }
};

const u = new WeakSet;

const d = {
    register(t) {
        if (!u.has(t)) {
            u.add(t);
            t.register(f, DelegateBindingCommand, exports.ListenerBindingRenderer);
        }
    }
};

class DelegateBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new DelegateBindingInstruction(e.parse(t.attr.rawValue, r), t.attr.target, true);
    }
}

DelegateBindingCommand.$au = {
    type: "binding-command",
    name: "delegate"
};

exports.ListenerBindingRenderer = class ListenerBindingRenderer {
    constructor() {
        this.t = i.resolve(f);
    }
    render(t, e, i, n, s) {
        const o = ensureExpression(s, i.from, r);
        t.addBinding(new DelegateListenerBinding(t.container, o, e, i.to, this.t, new DelegateListenerOptions(i.preventDefault)));
    }
};

exports.ListenerBindingRenderer = __decorate([ e.renderer("dl") ], exports.ListenerBindingRenderer);

class DelegateBindingInstruction {
    constructor(t, i, n) {
        this.from = t;
        this.to = i;
        this.preventDefault = n;
        this.type = e.InstructionType.listenerBinding;
    }
}

class DelegateListenerOptions {
    constructor(t) {
        this.prevent = t;
    }
}

class DelegateListenerBinding {
    constructor(t, e, i, n, s, r) {
        this.ast = e;
        this.target = i;
        this.targetEvent = n;
        this.eventDelegator = s;
        this.isBound = false;
        this.handler = null;
        this.boundFn = true;
        this.l = t;
        this.i = r;
    }
    callSource(e) {
        const i = this.s.overrideContext;
        i.$event = e;
        let n = t.astEvaluate(this.ast, this.s, this, null);
        delete i.$event;
        if (isFunction(n)) {
            n = n(e);
        }
        if (n !== true && this.i.prevent) {
            e.preventDefault();
        }
        return n;
    }
    handleEvent(t) {
        this.callSource(t);
    }
    bind(i) {
        if (this.isBound) {
            if (this.s === i) {
                return;
            }
            this.unbind();
        }
        this.s = i;
        t.astBind(this.ast, i, this);
        this.handler = this.eventDelegator.addEventListener(this.l.get(e.IEventTarget), this.target, this.targetEvent, this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        t.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.handler.dispose();
        this.handler = null;
    }
}

e.mixinUseScope(DelegateListenerBinding);

e.mixingBindingLimited(DelegateListenerBinding, (() => "callSource"));

e.mixinAstEvaluator(true, true)(DelegateListenerBinding);

const g = {
    capture: false
};

class ListenerTracker {
    constructor(t, e, i = g) {
        this.h = t;
        this.u = e;
        this.i = i;
        this.C = 0;
        this.B = new Map;
        this.L = new Map;
    }
    O() {
        if (++this.C === 1) {
            this.h.addEventListener(this.u, this, this.i);
        }
    }
    I() {
        if (--this.C === 0) {
            this.h.removeEventListener(this.u, this, this.i);
        }
    }
    dispose() {
        if (this.C > 0) {
            this.C = 0;
            this.h.removeEventListener(this.u, this, this.i);
        }
        this.B.clear();
        this.L.clear();
    }
    R(t) {
        const e = this.i.capture === true ? this.B : this.L;
        let i = e.get(t);
        if (i === void 0) {
            e.set(t, i = createLookup());
        }
        return i;
    }
    handleEvent(t) {
        const e = this.i.capture === true ? this.B : this.L;
        const i = t.composedPath();
        if (this.i.capture === true) {
            i.reverse();
        }
        for (const n of i) {
            const i = e.get(n);
            if (i === void 0) {
                continue;
            }
            const s = i[this.u];
            if (s === void 0) {
                continue;
            }
            if (isFunction(s)) {
                s(t);
            } else {
                s.handleEvent(t);
            }
            if (t.cancelBubble === true) {
                return;
            }
        }
    }
}

class DelegateSubscription {
    constructor(t, e, i, n) {
        this._ = t;
        this.M = e;
        this.u = i;
        t.O();
        e[i] = n;
    }
    dispose() {
        this._.I();
        this.M[this.u] = void 0;
    }
}

const f = /*@__PURE__*/ i.DI.createInterface("IEventDelegator", (t => t.cachedCallback((t => {
    const i = t.invoke(EventDelegator);
    t.register(e.AppTask.deactivating((() => i.dispose())));
    return i;
}))));

class EventDelegator {
    constructor() {
        this.A = createLookup();
    }
    addEventListener(t, e, i, n, s) {
        const r = this.A[i] ??= new Map;
        let o = r.get(t);
        if (o === void 0) {
            r.set(t, o = new ListenerTracker(t, i, s));
        }
        return new DelegateSubscription(o, o.R(e), i, n);
    }
    dispose() {
        for (const t in this.A) {
            const e = this.A[t];
            for (const t of e.values()) {
                t.dispose();
            }
            e.clear();
        }
    }
}

let p = false;

const defineBindingMethods = () => {
    if (p) return;
    p = true;
    [ [ e.PropertyBinding, "Property binding" ], [ e.AttributeBinding, "Attribute binding" ], [ e.ListenerBinding, "Listener binding" ], [ CallBinding, "Call binding" ], [ e.LetBinding, "Let binding" ], [ e.InterpolationPartBinding, "Interpolation binding" ], [ e.ContentBinding, "Text binding" ], [ e.RefBinding, "Ref binding" ], [ DelegateListenerBinding, "Delegate Listener binding" ] ].forEach((([t, e]) => {
        Object.defineProperty(t.prototype, "sourceExpression", {
            configurable: true,
            enumerable: false,
            get() {
                console.warn(getMessage(e, this.ast));
                return this.ast;
            },
            set(t) {
                console.warn(getMessage(e, this.ast));
                Reflect.set(this, "ast", t);
            }
        });
    }));
    const getMessage = (e, i) => console.warn(`@deprecated "sourceExpression" property for expression on ${e}. It has been renamed to "ast". expression: "${t.Unparser.unparse(i)}"`);
};

let b = false;

let m = false;

const C = e.AuCompose.prototype;

const v = Symbol();

const B = C.attaching;

const x = C.propertyChanged;

function enableComposeCompat() {
    if (b) {
        return;
    }
    b = true;
    if (!m) {
        m = true;
        const t = e.CustomElement.getDefinition(e.AuCompose);
        t.bindables.viewModel = e.BindableDefinition.create("viewModel", e.AuCompose);
        t.bindables.view = e.BindableDefinition.create("view", e.AuCompose);
    }
    defineHiddenProp(C, "viewModelChanged", (function(t) {
        this.component = t;
    }));
    defineHiddenProp(C, "viewChanged", (function(t) {
        this.template = t;
    }));
    defineHiddenProp(C, "attaching", (function(...t) {
        this[v] = true;
        if (this.viewModel !== void 0) {
            this.component = this.viewModel;
        }
        if (this.view !== void 0) {
            this.template = this.view;
        }
        this[v] = false;
        return B.apply(this, t);
    }));
    defineHiddenProp(C, "propertyChanged", (function(t) {
        if (this[v]) {
            return;
        }
        switch (t) {
          case "viewModel":
          case "view":
            return;
        }
        return x.call(this, t);
    }));
}

function disableComposeCompat() {
    if (!b) {
        return;
    }
    if (m) {
        m = false;
        const t = e.CustomElement.getDefinition(e.AuCompose);
        delete t.bindables.viewModel;
        delete t.bindables.view;
    }
    b = false;
    delete C.viewModelChanged;
    delete C.viewChanged;
    defineHiddenProp(C, "attaching", B);
    defineHiddenProp(C, "propertyChanged", x);
}

class BindingEngine {
    constructor() {
        this.parser = i.resolve(t.IExpressionParser);
        this.observerLocator = i.resolve(t.IObserverLocator);
    }
    propertyObserver(t, e) {
        return {
            subscribe: i => {
                const n = this.observerLocator.getObserver(t, e);
                const s = {
                    handleChange: (t, e) => i(t, e)
                };
                n.subscribe(s);
                return {
                    dispose: () => n.unsubscribe(s)
                };
            }
        };
    }
    collectionObserver(e) {
        return {
            subscribe: i => {
                const n = t.getCollectionObserver(e);
                const s = {
                    handleCollectionChange: (t, e) => i(t, e)
                };
                n?.subscribe(s);
                return {
                    dispose: () => n?.unsubscribe(s)
                };
            }
        };
    }
    expressionObserver(i, n) {
        const s = t.Scope.create(i, {}, true);
        return {
            subscribe: t => {
                const i = new e.ExpressionWatcher(s, null, this.observerLocator, this.parser.parse(n, "IsProperty"), t);
                i.bind();
                return {
                    dispose: () => i.unbind()
                };
            }
        };
    }
}

const w = {
    register(t) {
        defineAstMethods();
        defineBindingMethods();
        enableComposeCompat();
        t.register(h, d, l);
    }
};

exports.BindingEngine = BindingEngine;

exports.CallBinding = CallBinding;

exports.CallBindingCommand = CallBindingCommand;

exports.CallBindingInstruction = CallBindingInstruction;

exports.DelegateBindingCommand = DelegateBindingCommand;

exports.DelegateBindingInstruction = DelegateBindingInstruction;

exports.DelegateListenerBinding = DelegateListenerBinding;

exports.DelegateListenerOptions = DelegateListenerOptions;

exports.EventDelegator = EventDelegator;

exports.IEventDelegator = f;

exports.callSyntax = l;

exports.compatRegistration = w;

exports.delegateSyntax = d;

exports.disableComposeCompat = disableComposeCompat;

exports.enableComposeCompat = enableComposeCompat;

exports.eventPreventDefaultBehavior = h;
//# sourceMappingURL=index.cjs.map
