"use strict";

var t = require("@aurelia/expression-parser");

var e = require("@aurelia/runtime-html");

var i = require("@aurelia/kernel");

var n = require("@aurelia/runtime");

let s = false;

function defineAstMethods() {
    if (s) {
        return;
    }
    s = true;
    const def = (t, e, i) => Object.defineProperty(t.prototype, e, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: i
    });
    [ t.BindingBehaviorExpression, t.ValueConverterExpression, t.AssignExpression, t.ConditionalExpression, t.AccessThisExpression, t.AccessScopeExpression, t.AccessMemberExpression, t.AccessKeyedExpression, t.CallScopeExpression, t.CallMemberExpression, t.CallFunctionExpression, t.BinaryExpression, t.UnaryExpression, t.PrimitiveLiteralExpression, t.ArrayLiteralExpression, t.ObjectLiteralExpression, t.TemplateExpression, t.TaggedTemplateExpression, t.ArrayBindingPattern, t.ObjectBindingPattern, t.BindingIdentifier, t.ForOfStatement, t.Interpolation, t.DestructuringAssignmentExpression, t.DestructuringAssignmentSingleExpression, t.DestructuringAssignmentRestExpression, t.ArrowFunction ].forEach((i => {
        def(i, "evaluate", (function(...t) {
            return e.astEvaluate(this, ...t);
        }));
        def(i, "assign", (function(...t) {
            return e.astAssign(this, ...t);
        }));
        def(i, "accept", (function(...e) {
            return t.astVisit(this, ...e);
        }));
        def(i, "bind", (function(...t) {
            return e.astBind(this, ...t);
        }));
        def(i, "unbind", (function(...t) {
            return e.astUnbind(this, ...t);
        }));
    }));
    console.warn('"evaluate"/"assign"/"accept"/"visit"/"bind"/"unbind" are only valid on AST with ast $kind "Custom".' + " Or import and use astEvaluate/astAssign/astVisit/astBind/astUnbind accordingly.");
}

const createLookup = () => Object.create(null);

const isFunction = t => typeof t === "function";

const isString = t => typeof t === "string";

const r = Reflect.defineProperty;

const defineHiddenProp = (t, e, i) => {
    r(t, e, {
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

const o = "IsFunction";

const l = new WeakSet;

const a = {
    register(t) {
        if (!l.has(t)) {
            l.add(t);
            t.register(CallBindingCommand, CallBindingRenderer);
        }
    }
};

const h = "rh";

class CallBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = h;
    }
}

class CallBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, e) {
        const n = t.bindable === null ? i.camelCase(t.attr.target) : t.bindable.name;
        return new CallBindingInstruction(e.parse(t.attr.rawValue, o), n);
    }
}

CallBindingCommand.$au = {
    type: "binding-command",
    name: "call"
};

class CallBindingRenderer {
    render(t, e, i, n, s, r) {
        const l = ensureExpression(s, i.from, o);
        t.addBinding(new CallBinding(t.container, r, l, getTarget(e), i.to));
    }
}

e.renderer(h)(CallBindingRenderer, null);

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
    callSource(t) {
        const i = this.s.overrideContext;
        i.$event = t;
        const n = e.astEvaluate(this.ast, this.s, this, null);
        Reflect.deleteProperty(i, "$event");
        return n;
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) {
                return;
            }
            this.unbind();
        }
        this.s = t;
        e.astBind(this.ast, t, this);
        this.targetObserver.setValue((t => this.callSource(t)), this.target, this.targetProperty);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        e.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.targetObserver.setValue(null, this.target, this.targetProperty);
    }
}

e.mixinUseScope(CallBinding);

e.mixingBindingLimited(CallBinding, (() => "callSource"));

e.mixinAstEvaluator(true)(CallBinding);

const c = new WeakSet;

const u = {
    register(t) {
        if (c.has(t)) {
            return;
        }
        c.add(t);
        t.get(e.IListenerBindingOptions).prevent = true;
    }
};

const d = new WeakSet;

const g = {
    register(t) {
        if (!d.has(t)) {
            d.add(t);
            t.register(p, DelegateBindingCommand, ListenerBindingRenderer);
        }
    }
};

class DelegateBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new DelegateBindingInstruction(e.parse(t.attr.rawValue, o), t.attr.target, true);
    }
}

DelegateBindingCommand.$au = {
    type: "binding-command",
    name: "delegate"
};

class ListenerBindingRenderer {
    constructor() {
        this.t = i.resolve(p);
    }
    render(t, e, i, n, s) {
        const r = ensureExpression(s, i.from, o);
        t.addBinding(new DelegateListenerBinding(t.container, r, e, i.to, this.t, new DelegateListenerOptions(i.preventDefault)));
    }
}

e.renderer("dl")(ListenerBindingRenderer, null);

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
    callSource(t) {
        const i = this.s.overrideContext;
        i.$event = t;
        let n = e.astEvaluate(this.ast, this.s, this, null);
        delete i.$event;
        if (isFunction(n)) {
            n = n(t);
        }
        if (n !== true && this.i.prevent) {
            t.preventDefault();
        }
        return n;
    }
    handleEvent(t) {
        this.callSource(t);
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) {
                return;
            }
            this.unbind();
        }
        this.s = t;
        e.astBind(this.ast, t, this);
        this.handler = this.eventDelegator.addEventListener(this.l.get(e.IEventTarget), this.target, this.targetEvent, this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        e.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.handler.dispose();
        this.handler = null;
    }
}

e.mixinUseScope(DelegateListenerBinding);

e.mixingBindingLimited(DelegateListenerBinding, (() => "callSource"));

e.mixinAstEvaluator(true, true)(DelegateListenerBinding);

const f = {
    capture: false
};

class ListenerTracker {
    constructor(t, e, i = f) {
        this.h = t;
        this.u = e;
        this.i = i;
        this.C = 0;
        this.B = new Map;
        this.L = new Map;
    }
    R() {
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
    O(t) {
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
        this.M = t;
        this.A = e;
        this.u = i;
        t.R();
        e[i] = n;
    }
    dispose() {
        this.M.I();
        this.A[this.u] = void 0;
    }
}

const p = /*@__PURE__*/ i.DI.createInterface("IEventDelegator", (t => t.cachedCallback((t => {
    const i = t.invoke(EventDelegator);
    t.register(e.AppTask.deactivating((() => i.dispose())));
    return i;
}))));

class EventDelegator {
    constructor() {
        this.T = createLookup();
    }
    addEventListener(t, e, i, n, s) {
        const r = this.T[i] ??= new Map;
        let o = r.get(t);
        if (o === void 0) {
            r.set(t, o = new ListenerTracker(t, i, s));
        }
        return new DelegateSubscription(o, o.O(e), i, n);
    }
    dispose() {
        for (const t in this.T) {
            const e = this.T[t];
            for (const t of e.values()) {
                t.dispose();
            }
            e.clear();
        }
    }
}

let b = false;

const defineBindingMethods = () => {
    if (b) return;
    b = true;
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
    const getMessage = (e, i) => console.warn(`[DEV:aurelia] @deprecated "sourceExpression" property for expression on ${e}. It has been renamed to "ast". expression: "${t.Unparser.unparse(i)}"`);
};

let C = false;

let m = false;

const B = e.AuCompose.prototype;

const v = Symbol();

const x = B.attaching;

const D = B.propertyChanged;

function enableComposeCompat() {
    if (C) {
        return;
    }
    C = true;
    if (!m) {
        m = true;
        const t = e.CustomElement.getDefinition(e.AuCompose);
        t.bindables.viewModel = e.BindableDefinition.create("viewModel");
        t.bindables.view = e.BindableDefinition.create("view");
    }
    defineHiddenProp(B, "viewModelChanged", (function(t) {
        this.component = t;
    }));
    defineHiddenProp(B, "viewChanged", (function(t) {
        this.template = t;
    }));
    defineHiddenProp(B, "attaching", (function(...t) {
        this[v] = true;
        if (this.viewModel !== void 0) {
            this.component = this.viewModel;
        }
        if (this.view !== void 0) {
            this.template = this.view;
        }
        this[v] = false;
        return x.apply(this, t);
    }));
    defineHiddenProp(B, "propertyChanged", (function(t) {
        if (this[v]) {
            return;
        }
        switch (t) {
          case "viewModel":
          case "view":
            return;
        }
        return D.call(this, t);
    }));
}

function disableComposeCompat() {
    if (!C) {
        return;
    }
    if (m) {
        m = false;
        const t = e.CustomElement.getDefinition(e.AuCompose);
        delete t.bindables.viewModel;
        delete t.bindables.view;
    }
    C = false;
    delete B.viewModelChanged;
    delete B.viewChanged;
    defineHiddenProp(B, "attaching", x);
    defineHiddenProp(B, "propertyChanged", D);
}

class BindingEngine {
    constructor() {
        this.parser = i.resolve(t.IExpressionParser);
        this.observerLocator = i.resolve(n.IObserverLocator);
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
    collectionObserver(t) {
        return {
            subscribe: e => {
                const i = n.getCollectionObserver(t);
                const s = {
                    handleCollectionChange: (t, i) => e(t, i)
                };
                i?.subscribe(s);
                return {
                    dispose: () => i?.unsubscribe(s)
                };
            }
        };
    }
    expressionObserver(t, i) {
        const s = n.Scope.create(t, {}, true);
        return {
            subscribe: t => {
                const n = new e.ExpressionWatcher(s, null, this.observerLocator, this.parser.parse(i, "IsProperty"), t);
                n.bind();
                return {
                    dispose: () => n.unbind()
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
        t.register(u, g, a);
    }
};

exports.BindingEngine = BindingEngine;

exports.CallBinding = CallBinding;

exports.CallBindingCommand = CallBindingCommand;

exports.CallBindingInstruction = CallBindingInstruction;

exports.CallBindingRenderer = CallBindingRenderer;

exports.DelegateBindingCommand = DelegateBindingCommand;

exports.DelegateBindingInstruction = DelegateBindingInstruction;

exports.DelegateListenerBinding = DelegateListenerBinding;

exports.DelegateListenerOptions = DelegateListenerOptions;

exports.EventDelegator = EventDelegator;

exports.IEventDelegator = p;

exports.ListenerBindingRenderer = ListenerBindingRenderer;

exports.callSyntax = a;

exports.compatRegistration = w;

exports.delegateSyntax = g;

exports.disableComposeCompat = disableComposeCompat;

exports.enableComposeCompat = enableComposeCompat;

exports.eventPreventDefaultBehavior = u;
//# sourceMappingURL=index.cjs.map
