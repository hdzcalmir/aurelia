"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var t = require("@aurelia/runtime");

var e = require("@aurelia/runtime-html");

var i = require("@aurelia/kernel");

let s = false;

function n() {
    if (s) return;
    s = true;
    const e = (t, e, i) => Object.defineProperty(t.prototype, e, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: i
    });
    [ t.BindingBehaviorExpression, t.ValueConverterExpression, t.AssignExpression, t.ConditionalExpression, t.AccessThisExpression, t.AccessScopeExpression, t.AccessMemberExpression, t.AccessKeyedExpression, t.CallScopeExpression, t.CallMemberExpression, t.CallFunctionExpression, t.BinaryExpression, t.UnaryExpression, t.PrimitiveLiteralExpression, t.ArrayLiteralExpression, t.ObjectLiteralExpression, t.TemplateExpression, t.TaggedTemplateExpression, t.ArrayBindingPattern, t.ObjectBindingPattern, t.BindingIdentifier, t.ForOfStatement, t.Interpolation, t.DestructuringAssignmentExpression, t.DestructuringAssignmentSingleExpression, t.DestructuringAssignmentRestExpression, t.ArrowFunction ].forEach((i => {
        e(i, "evaluate", (function(...e) {
            return t.astEvaluate(this, ...e);
        }));
        e(i, "assign", (function(...e) {
            return t.astAssign(this, ...e);
        }));
        e(i, "accept", (function(...e) {
            return t.astVisit(this, ...e);
        }));
        e(i, "bind", (function(...e) {
            return t.astBind(this, ...e);
        }));
        e(i, "unbind", (function(...e) {
            return t.astUnbind(this, ...e);
        }));
        console.warn('"evaluate"/"assign"/"accept"/"visit"/"bind"/"unbind" are only valid on AST with $kind Custom.' + " Or import and use astEvaluate/astAssign/astVisit/astBind/astUnbind accordingly.");
    }));
}

function r(t, e, i, s) {
    var n = arguments.length, r = n < 3 ? e : null === s ? s = Object.getOwnPropertyDescriptor(e, i) : s, o;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(t, e, i, s); else for (var l = t.length - 1; l >= 0; l--) if (o = t[l]) r = (n < 3 ? o(r) : n > 3 ? o(e, i, r) : o(e, i)) || r;
    return n > 3 && r && Object.defineProperty(e, i, r), r;
}

const o = () => Object.create(null);

const l = t => "function" === typeof t;

const c = t => "string" === typeof t;

const h = Reflect.defineProperty;

const u = (t, e, i) => {
    h(t, e, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: i
    });
    return i;
};

const a = (t, e, i) => {
    if (c(e)) return t.parse(e, i);
    return e;
};

const d = Symbol(".call");

const f = {
    register(t) {
        if (!t[d]) {
            t[d] = true;
            t.register(exports.CallBindingCommand, exports.CallBindingRenderer);
        }
    }
};

const g = "rh";

class CallBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = g;
    }
}

exports.CallBindingCommand = class CallBindingCommand {
    get type() {
        return 0;
    }
    build(t, e) {
        const s = null === t.bindable ? i.camelCase(t.attr.target) : t.bindable.property;
        return new CallBindingInstruction(e.parse(t.attr.rawValue, 16 | 8), s);
    }
};

exports.CallBindingCommand = r([ e.bindingCommand("call") ], exports.CallBindingCommand);

exports.CallBindingRenderer = class CallBindingRenderer {
    render(t, e, i, s, n, r) {
        const o = a(n, i.from, 16 | 8);
        t.addBinding(new CallBinding(t.container, r, o, p(e), i.to));
    }
};

exports.CallBindingRenderer = r([ e.renderer(g) ], exports.CallBindingRenderer);

function p(t) {
    if (null != t.viewModel) return t.viewModel;
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
            if (this.s === e) return;
            this.unbind();
        }
        this.s = e;
        t.astBind(this.ast, e, this);
        this.targetObserver.setValue((t => this.callSource(t)), this.target, this.targetProperty);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        t.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.targetObserver.setValue(null, this.target, this.targetProperty);
    }
}

e.mixinUseScope(CallBinding);

e.mixingBindingLimited(CallBinding, (() => "callSource"));

e.mixinAstEvaluator(true)(CallBinding);

const b = Symbol(".delegate");

const v = {
    register(t) {
        if (!t[b]) {
            t[b] = true;
            t.register(w, exports.DelegateBindingCommand, exports.ListenerBindingRenderer);
        }
    }
};

const x = "dl";

exports.DelegateBindingCommand = class DelegateBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new DelegateBindingInstruction(e.parse(t.attr.rawValue, 8), t.attr.target, false);
    }
};

exports.DelegateBindingCommand = r([ e.bindingCommand("delegate") ], exports.DelegateBindingCommand);

exports.ListenerBindingRenderer = class ListenerBindingRenderer {
    static get inject() {
        return [ w ];
    }
    constructor(t) {
        this.t = t;
    }
    render(t, e, i, s, n) {
        const r = a(n, i.from, 8);
        t.addBinding(new DelegateListenerBinding(t.container, r, e, i.to, this.t, new DelegateListenerOptions(i.preventDefault)));
    }
};

exports.ListenerBindingRenderer = r([ e.renderer(x) ], exports.ListenerBindingRenderer);

class DelegateBindingInstruction {
    constructor(t, e, i) {
        this.from = t;
        this.to = e;
        this.preventDefault = i;
        this.type = "hb";
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
        if (l(s)) s = s(e);
        if (true !== s && this.i.prevent) e.preventDefault();
        return s;
    }
    handleEvent(t) {
        this.callSource(t);
    }
    bind(i) {
        if (this.isBound) {
            if (this.s === i) return;
            this.unbind();
        }
        this.s = i;
        t.astBind(this.ast, i, this);
        this.handler = this.eventDelegator.addEventListener(this.l.get(e.IEventTarget), this.target, this.targetEvent, this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
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

const B = {
    capture: false
};

class ListenerTracker {
    constructor(t, e, i = B) {
        this.h = t;
        this.u = e;
        this.i = i;
        this.B = 0;
        this.C = new Map;
        this.L = new Map;
    }
    O() {
        if (1 === ++this.B) this.h.addEventListener(this.u, this, this.i);
    }
    I() {
        if (0 === --this.B) this.h.removeEventListener(this.u, this, this.i);
    }
    dispose() {
        if (this.B > 0) {
            this.B = 0;
            this.h.removeEventListener(this.u, this, this.i);
        }
        this.C.clear();
        this.L.clear();
    }
    j(t) {
        const e = true === this.i.capture ? this.C : this.L;
        let i = e.get(t);
        if (void 0 === i) e.set(t, i = o());
        return i;
    }
    handleEvent(t) {
        const e = true === this.i.capture ? this.C : this.L;
        const i = t.composedPath();
        if (true === this.i.capture) i.reverse();
        for (const s of i) {
            const i = e.get(s);
            if (void 0 === i) continue;
            const n = i[this.u];
            if (void 0 === n) continue;
            if (l(n)) n(t); else n.handleEvent(t);
            if (true === t.cancelBubble) return;
        }
    }
}

class DelegateSubscription {
    constructor(t, e, i, s) {
        this.R = t;
        this.M = e;
        this.u = i;
        t.O();
        e[i] = s;
    }
    dispose() {
        this.R.I();
        this.M[this.u] = void 0;
    }
}

const w = i.DI.createInterface("IEventDelegator", (t => t.cachedCallback((t => {
    const i = t.invoke(EventDelegator);
    t.register(e.AppTask.deactivating((() => i.dispose())));
    return i;
}))));

class EventDelegator {
    constructor() {
        this._ = o();
    }
    addEventListener(t, e, i, s, n) {
        var r;
        const o = (r = this._)[i] ?? (r[i] = new Map);
        let l = o.get(t);
        if (void 0 === l) o.set(t, l = new ListenerTracker(t, i, n));
        return new DelegateSubscription(l, l.j(e), i, s);
    }
    dispose() {
        for (const t in this._) {
            const e = this._[t];
            for (const t of e.values()) t.dispose();
            e.clear();
        }
    }
}

let C = false;

const D = () => {
    if (C) return;
    C = true;
    [ [ e.PropertyBinding, "Property binding" ], [ e.AttributeBinding, "Attribute binding" ], [ e.ListenerBinding, "Listener binding" ], [ CallBinding, "Call binding" ], [ e.LetBinding, "Let binding" ], [ e.InterpolationPartBinding, "Interpolation binding" ], [ e.ContentBinding, "Text binding" ], [ e.RefBinding, "Ref binding" ], [ DelegateListenerBinding, "Delegate Listener binding" ] ].forEach((([e, i]) => {
        Object.defineProperty(e.prototype, "sourceExpression", {
            configurable: true,
            enumerable: false,
            writable: true,
            get() {
                console.warn(`@deprecated "sourceExpression" property for expression on ${i}. It has been renamed to "ast". expression: "${t.Unparser.unparse(this.ast)}"`);
                return this.ast;
            }
        });
    }));
};

const m = e.AppTask.creating(e.IEventTarget, (t => {
    t.addEventListener("submit", (t => {
        const e = t.target;
        const i = e.action;
        if ("form" === e.tagName.toLowerCase() && !i) t.preventDefault();
    }), false);
}));

let L = false;

let y = false;

const E = e.AuCompose.prototype;

const O = Symbol();

const S = E.attaching;

const I = E.propertyChanged;

function j() {
    if (L) return;
    L = true;
    if (!y) {
        y = true;
        const t = e.CustomElement.getDefinition(e.AuCompose);
        const i = t.bindables.viewModel = e.BindableDefinition.create("viewModel", e.AuCompose);
        const s = t.bindables.view = e.BindableDefinition.create("view", e.AuCompose);
        const n = e.BindablesInfo.from(t, false);
        if (!("view" in n.attrs)) {
            n.attrs.view = n.bindables.view = s;
            n.attrs["view-model"] = n.bindables.viewModel = i;
        }
    }
    u(E, "viewModelChanged", (function(t) {
        this.component = t;
    }));
    u(E, "viewChanged", (function(t) {
        this.template = t;
    }));
    u(E, "attaching", (function(...t) {
        this[O] = true;
        if (void 0 !== this.viewModel) this.component = this.viewModel;
        if (void 0 !== this.view) this.template = this.view;
        this[O] = false;
        return S.apply(this, t);
    }));
    u(E, "propertyChanged", (function(t) {
        if (this[O]) return;
        switch (t) {
          case "viewModel":
          case "view":
            return;
        }
        return I.call(this, t);
    }));
}

function R() {
    if (!L) return;
    if (y) {
        y = false;
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
    L = false;
    delete E.viewModelChanged;
    delete E.viewChanged;
    u(E, "attaching", S);
    u(E, "propertyChanged", I);
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
                const i = new e.ExpressionWatcher(n, null, this.observerLocator, this.parser.parse(s, 16), t);
                i.bind();
                return {
                    dispose: () => i.unbind()
                };
            }
        };
    }
}

BindingEngine.inject = [ t.IExpressionParser, t.IObserverLocator ];

const M = {
    register(t) {
        n();
        D();
        j();
        t.register(m);
        v.register(t);
        f.register(t);
    }
};

exports.BindingEngine = BindingEngine;

exports.CallBinding = CallBinding;

exports.CallBindingInstruction = CallBindingInstruction;

exports.DelegateBindingInstruction = DelegateBindingInstruction;

exports.DelegateListenerBinding = DelegateListenerBinding;

exports.DelegateListenerOptions = DelegateListenerOptions;

exports.EventDelegator = EventDelegator;

exports.IEventDelegator = w;

exports.PreventFormActionlessSubmit = m;

exports.callSyntax = f;

exports.compatRegistration = M;

exports.delegateSyntax = v;

exports.disableComposeCompat = R;

exports.enableComposeCompat = j;
//# sourceMappingURL=index.cjs.map
