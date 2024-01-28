"use strict";

var t = require("@aurelia/runtime");

var e = require("@aurelia/runtime-html");

var i = require("@aurelia/kernel");

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

function __decorate(t, e, i, s) {
    var n = arguments.length, r = n < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, i) : s, o;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(t, e, i, s); else for (var l = t.length - 1; l >= 0; l--) if (o = t[l]) r = (n < 3 ? o(r) : n > 3 ? o(e, i, r) : o(e, i)) || r;
    return n > 3 && r && Object.defineProperty(e, i, r), r;
}

const createLookup = () => Object.create(null);

const isFunction = t => typeof t === "function";

const isString = t => typeof t === "string";

const n = Reflect.defineProperty;

const defineHiddenProp = (t, e, i) => {
    n(t, e, {
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

const o = Symbol(".call");

const l = {
    register(t) {
        if (!t[o]) {
            t[o] = true;
            t.register(exports.CallBindingCommand, exports.CallBindingRenderer);
        }
    }
};

const c = "rh";

class CallBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = c;
    }
}

exports.CallBindingCommand = class CallBindingCommand {
    get type() {
        return "None";
    }
    build(t, e) {
        const s = t.bindable === null ? i.camelCase(t.attr.target) : t.bindable.name;
        return new CallBindingInstruction(e.parse(t.attr.rawValue, r), s);
    }
};

exports.CallBindingCommand = __decorate([ e.bindingCommand("call") ], exports.CallBindingCommand);

exports.CallBindingRenderer = class CallBindingRenderer {
    render(t, e, i, s, n, o) {
        const l = ensureExpression(n, i.from, r);
        t.addBinding(new CallBinding(t.container, o, l, getTarget(e), i.to));
    }
};

exports.CallBindingRenderer = __decorate([ e.renderer(c) ], exports.CallBindingRenderer);

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
    callSource(e) {
        const i = this.s.overrideContext;
        i.$event = e;
        const s = t.astEvaluate(this.ast, this.s, this, null);
        Reflect.deleteProperty(i, "$event");
        return s;
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

const a = Symbol(".delegate");

const h = {
    register(t) {
        if (!t[a]) {
            t[a] = true;
            t.register(d, exports.DelegateBindingCommand, exports.ListenerBindingRenderer);
        }
    }
};

exports.DelegateBindingCommand = class DelegateBindingCommand {
    get type() {
        return "IgnoreAttr";
    }
    build(t, e) {
        return new DelegateBindingInstruction(e.parse(t.attr.rawValue, r), t.attr.target, false);
    }
};

exports.DelegateBindingCommand = __decorate([ e.bindingCommand("delegate") ], exports.DelegateBindingCommand);

exports.ListenerBindingRenderer = class ListenerBindingRenderer {
    static get inject() {
        return [ d ];
    }
    constructor(t) {
        this.t = t;
    }
    render(t, e, i, s, n) {
        const o = ensureExpression(n, i.from, r);
        t.addBinding(new DelegateListenerBinding(t.container, o, e, i.to, this.t, new DelegateListenerOptions(i.preventDefault)));
    }
};

exports.ListenerBindingRenderer = __decorate([ e.renderer("dl") ], exports.ListenerBindingRenderer);

class DelegateBindingInstruction {
    constructor(t, i, s) {
        this.from = t;
        this.to = i;
        this.preventDefault = s;
        this.type = e.InstructionType.listenerBinding;
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
        this.l = t;
        this.i = r;
    }
    callSource(e) {
        const i = this.s.overrideContext;
        i.$event = e;
        let s = t.astEvaluate(this.ast, this.s, this, null);
        delete i.$event;
        if (isFunction(s)) {
            s = s(e);
        }
        if (s !== true && this.i.prevent) {
            e.preventDefault();
        }
        return s;
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

const u = {
    capture: false
};

class ListenerTracker {
    constructor(t, e, i = u) {
        this.h = t;
        this.u = e;
        this.i = i;
        this.C = 0;
        this.B = new Map;
        this.L = new Map;
    }
    _() {
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
        this.R = t;
        this.M = e;
        this.u = i;
        t._();
        e[i] = s;
    }
    dispose() {
        this.R.I();
        this.M[this.u] = void 0;
    }
}

const d = /*@__PURE__*/ i.DI.createInterface("IEventDelegator", (t => t.cachedCallback((t => {
    const i = t.invoke(EventDelegator);
    t.register(e.AppTask.deactivating((() => i.dispose())));
    return i;
}))));

class EventDelegator {
    constructor() {
        this.j = createLookup();
    }
    addEventListener(t, e, i, s, n) {
        var r;
        const o = (r = this.j)[i] ?? (r[i] = new Map);
        let l = o.get(t);
        if (l === void 0) {
            o.set(t, l = new ListenerTracker(t, i, n));
        }
        return new DelegateSubscription(l, l.O(e), i, s);
    }
    dispose() {
        for (const t in this.j) {
            const e = this.j[t];
            for (const t of e.values()) {
                t.dispose();
            }
            e.clear();
        }
    }
}

let f = false;

const defineBindingMethods = () => {
    if (f) return;
    f = true;
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

const g = e.AppTask.creating(e.IEventTarget, (t => {
    t.addEventListener("submit", (t => {
        const e = t.target;
        const i = e.action;
        if (e.tagName.toLowerCase() === "form" && !i) {
            t.preventDefault();
        }
    }), false);
}));

let p = false;

let b = false;

const v = e.AuCompose.prototype;

const x = Symbol();

const C = v.attaching;

const m = v.propertyChanged;

function enableComposeCompat() {
    if (p) {
        return;
    }
    p = true;
    if (!b) {
        b = true;
        const t = e.CustomElement.getDefinition(e.AuCompose);
        const i = t.bindables.viewModel = e.BindableDefinition.create("viewModel", e.AuCompose);
        const s = t.bindables.view = e.BindableDefinition.create("view", e.AuCompose);
        const n = e.BindablesInfo.from(t, false);
        if (!("view" in n.attrs)) {
            n.attrs.view = n.bindables.view = s;
            n.attrs["view-model"] = n.bindables.viewModel = i;
        }
    }
    defineHiddenProp(v, "viewModelChanged", (function(t) {
        this.component = t;
    }));
    defineHiddenProp(v, "viewChanged", (function(t) {
        this.template = t;
    }));
    defineHiddenProp(v, "attaching", (function(...t) {
        this[x] = true;
        if (this.viewModel !== void 0) {
            this.component = this.viewModel;
        }
        if (this.view !== void 0) {
            this.template = this.view;
        }
        this[x] = false;
        return C.apply(this, t);
    }));
    defineHiddenProp(v, "propertyChanged", (function(t) {
        if (this[x]) {
            return;
        }
        switch (t) {
          case "viewModel":
          case "view":
            return;
        }
        return m.call(this, t);
    }));
}

function disableComposeCompat() {
    if (!p) {
        return;
    }
    if (b) {
        b = false;
        const t = e.CustomElement.getDefinition(e.AuCompose);
        delete t.bindables.viewModel;
        delete t.bindables.view;
        const i = e.BindablesInfo.from(t, false);
        if ("view" in i.attrs) {
            delete i.attrs.view;
            delete i.bindables.view;
            delete i.attrs["view-model"];
            delete i.bindables.viewModel;
        }
    }
    p = false;
    delete v.viewModelChanged;
    delete v.viewChanged;
    defineHiddenProp(v, "attaching", C);
    defineHiddenProp(v, "propertyChanged", m);
}

class BindingEngine {
    constructor(t, e) {
        this.parser = t;
        this.observerLocator = e;
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
    collectionObserver(e) {
        return {
            subscribe: i => {
                const s = t.getCollectionObserver(e);
                const n = {
                    handleCollectionChange: (t, e) => i(t, e)
                };
                s?.subscribe(n);
                return {
                    dispose: () => s?.unsubscribe(n)
                };
            }
        };
    }
    expressionObserver(i, s) {
        const n = t.Scope.create(i, {}, true);
        return {
            subscribe: t => {
                const i = new e.ExpressionWatcher(n, null, this.observerLocator, this.parser.parse(s, "IsProperty"), t);
                i.bind();
                return {
                    dispose: () => i.unbind()
                };
            }
        };
    }
}

BindingEngine.inject = [ t.IExpressionParser, t.IObserverLocator ];

const B = {
    register(t) {
        defineAstMethods();
        defineBindingMethods();
        enableComposeCompat();
        t.register(g);
        h.register(t);
        l.register(t);
    }
};

exports.BindingEngine = BindingEngine;

exports.CallBinding = CallBinding;

exports.CallBindingInstruction = CallBindingInstruction;

exports.DelegateBindingInstruction = DelegateBindingInstruction;

exports.DelegateListenerBinding = DelegateListenerBinding;

exports.DelegateListenerOptions = DelegateListenerOptions;

exports.EventDelegator = EventDelegator;

exports.IEventDelegator = d;

exports.PreventFormActionlessSubmit = g;

exports.callSyntax = l;

exports.compatRegistration = B;

exports.delegateSyntax = h;

exports.disableComposeCompat = disableComposeCompat;

exports.enableComposeCompat = enableComposeCompat;
//# sourceMappingURL=index.cjs.map
