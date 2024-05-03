"use strict";

var t = require("@aurelia/expression-parser");

var e = require("@aurelia/runtime-html");

var i = require("@aurelia/kernel");

var s = require("@aurelia/runtime");

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
            t.register(CallBindingCommand, c);
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
        const s = t.bindable === null ? i.camelCase(t.attr.target) : t.bindable.name;
        return new CallBindingInstruction(e.parse(t.attr.rawValue, o), s);
    }
}

CallBindingCommand.$au = {
    type: "binding-command",
    name: "call"
};

const c = /*@__PURE__*/ e.renderer(class CallBindingRenderer {
    constructor() {
        this.target = h;
    }
    render(t, e, i, s, n, r) {
        const l = ensureExpression(n, i.from, o);
        t.addBinding(new CallBinding(t.container, r, l, getTarget(e), i.to));
    }
}, null);

function getTarget(t) {
    if (t.viewModel != null) {
        return t.viewModel;
    }
    return t;
}

class CallBinding {
    constructor(t, e, i, s, n) {
        this.ast = i;
        this.target = s;
        this.targetProperty = n;
        this.isBound = false;
        this.boundFn = false;
        this.l = t;
        this.targetObserver = e.getAccessor(s, n);
    }
    callSource(t) {
        const i = this.s.overrideContext;
        i.$event = t;
        const s = e.astEvaluate(this.ast, this.s, this, null);
        Reflect.deleteProperty(i, "$event");
        return s;
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

(() => {
    e.mixinUseScope(CallBinding);
    e.mixingBindingLimited(CallBinding, (() => "callSource"));
    e.mixinAstEvaluator(true)(CallBinding);
})();

const u = new WeakSet;

const d = {
    register(t) {
        if (u.has(t)) {
            return;
        }
        u.add(t);
        t.get(e.IListenerBindingOptions).prevent = true;
    }
};

const g = new WeakSet;

const f = {
    register(t) {
        if (!g.has(t)) {
            g.add(t);
            t.register(m, DelegateBindingCommand, p);
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

const p = /*@__PURE__*/ e.renderer(class ListenerBindingRenderer {
    constructor() {
        this.target = "dl";
        this.t = i.resolve(m);
    }
    render(t, e, i, s, n) {
        const r = ensureExpression(n, i.from, o);
        t.addBinding(new DelegateListenerBinding(t.container, r, e, i.to, this.t, new DelegateListenerOptions(i.preventDefault)));
    }
}, null);

class DelegateBindingInstruction {
    constructor(t, e, i) {
        this.from = t;
        this.to = e;
        this.preventDefault = i;
        this.type = "dl";
    }
}

class DelegateListenerOptions {
    constructor(t) {
        this.prevent = t;
    }
}

class DelegateListenerBinding {
    constructor(t, e, i, s, n, r) {
        this.ast = e;
        this.target = i;
        this.targetEvent = s;
        this.eventDelegator = n;
        this.isBound = false;
        this.handler = null;
        this.boundFn = true;
        this.self = false;
        this.l = t;
        this.i = r;
    }
    callSource(t) {
        const i = this.s.overrideContext;
        i.$event = t;
        let s = e.astEvaluate(this.ast, this.s, this, null);
        delete i.$event;
        if (isFunction(s)) {
            s = s(t);
        }
        if (s !== true && this.i.prevent) {
            t.preventDefault();
        }
        return s;
    }
    handleEvent(t) {
        if (this.self) {
            if (this.target !== t.composedPath()[0]) {
                return;
            }
        }
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

(() => {
    e.mixinUseScope(DelegateListenerBinding);
    e.mixingBindingLimited(DelegateListenerBinding, (() => "callSource"));
    e.mixinAstEvaluator(true, true)(DelegateListenerBinding);
})();

const b = {
    capture: false
};

class ListenerTracker {
    constructor(t, e, i = b) {
        this.h = t;
        this.u = e;
        this.i = i;
        this.C = 0;
        this.B = new Map;
        this.L = new Map;
    }
    I() {
        if (++this.C === 1) {
            this.h.addEventListener(this.u, this, this.i);
        }
    }
    O() {
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
    M(t) {
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
        for (const s of i) {
            const i = e.get(s);
            if (i === void 0) {
                continue;
            }
            const n = i[this.u];
            if (n === void 0) {
                continue;
            }
            if (isFunction(n)) {
                n(t);
            } else {
                n.handleEvent(t);
            }
            if (t.cancelBubble === true) {
                return;
            }
        }
    }
}

class DelegateSubscription {
    constructor(t, e, i, s) {
        this.A = t;
        this.R = e;
        this.u = i;
        t.I();
        e[i] = s;
    }
    dispose() {
        this.A.O();
        this.R[this.u] = void 0;
    }
}

const m = /*@__PURE__*/ i.DI.createInterface("IEventDelegator", (t => t.cachedCallback((t => {
    const i = t.invoke(EventDelegator);
    t.register(e.AppTask.deactivating((() => i.dispose())));
    return i;
}))));

class EventDelegator {
    constructor() {
        this.T = createLookup();
    }
    addEventListener(t, e, i, s, n) {
        const r = this.T[i] ??= new Map;
        let o = r.get(t);
        if (o === void 0) {
            r.set(t, o = new ListenerTracker(t, i, n));
        }
        return new DelegateSubscription(o, o.M(e), i, s);
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

let C = false;

const defineBindingMethods = () => {
    if (C) return;
    C = true;
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

let v = false;

let B = false;

const x = e.AuCompose.prototype;

const D = Symbol();

const w = x.attaching;

const L = x.propertyChanged;

function enableComposeCompat() {
    if (v) {
        return;
    }
    v = true;
    if (!B) {
        B = true;
        const t = e.CustomElement.getDefinition(e.AuCompose);
        t.bindables.viewModel = e.BindableDefinition.create("viewModel");
        t.bindables.view = e.BindableDefinition.create("view");
    }
    defineHiddenProp(x, "viewModelChanged", (function(t) {
        this.component = t;
    }));
    defineHiddenProp(x, "viewChanged", (function(t) {
        this.template = t;
    }));
    defineHiddenProp(x, "attaching", (function(...t) {
        this[D] = true;
        if (this.viewModel !== void 0) {
            this.component = this.viewModel;
        }
        if (this.view !== void 0) {
            this.template = this.view;
        }
        this[D] = false;
        return w.apply(this, t);
    }));
    defineHiddenProp(x, "propertyChanged", (function(t) {
        if (this[D]) {
            return;
        }
        switch (t) {
          case "viewModel":
          case "view":
            return;
        }
        return L.call(this, t);
    }));
}

function disableComposeCompat() {
    if (!v) {
        return;
    }
    if (B) {
        B = false;
        const t = e.CustomElement.getDefinition(e.AuCompose);
        delete t.bindables.viewModel;
        delete t.bindables.view;
    }
    v = false;
    delete x.viewModelChanged;
    delete x.viewChanged;
    defineHiddenProp(x, "attaching", w);
    defineHiddenProp(x, "propertyChanged", L);
}

class BindingEngine {
    constructor() {
        this.parser = i.resolve(t.IExpressionParser);
        this.observerLocator = i.resolve(s.IObserverLocator);
    }
    propertyObserver(t, e) {
        return {
            subscribe: i => {
                const s = this.observerLocator.getObserver(t, e);
                const n = {
                    handleChange: (t, e) => i(t, e)
                };
                s.subscribe(n);
                return {
                    dispose: () => s.unsubscribe(n)
                };
            }
        };
    }
    collectionObserver(t) {
        return {
            subscribe: e => {
                const i = s.getCollectionObserver(t);
                const n = {
                    handleCollectionChange: (t, i) => e(t, i)
                };
                i?.subscribe(n);
                return {
                    dispose: () => i?.unsubscribe(n)
                };
            }
        };
    }
    expressionObserver(t, i) {
        const s = e.Scope.create(t, {}, true);
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

const y = {
    register(t) {
        defineAstMethods();
        defineBindingMethods();
        enableComposeCompat();
        t.register(d, f, a);
    }
};

exports.BindingEngine = BindingEngine;

exports.CallBinding = CallBinding;

exports.CallBindingCommand = CallBindingCommand;

exports.CallBindingInstruction = CallBindingInstruction;

exports.CallBindingRenderer = c;

exports.DelegateBindingCommand = DelegateBindingCommand;

exports.DelegateBindingInstruction = DelegateBindingInstruction;

exports.DelegateListenerBinding = DelegateListenerBinding;

exports.DelegateListenerOptions = DelegateListenerOptions;

exports.EventDelegator = EventDelegator;

exports.IEventDelegator = m;

exports.ListenerBindingRenderer = p;

exports.callSyntax = a;

exports.compatRegistration = y;

exports.delegateSyntax = f;

exports.disableComposeCompat = disableComposeCompat;

exports.enableComposeCompat = enableComposeCompat;

exports.eventPreventDefaultBehavior = d;
//# sourceMappingURL=index.cjs.map
