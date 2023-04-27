import { BindingBehaviorExpression as t, ValueConverterExpression as e, AssignExpression as i, ConditionalExpression as s, AccessThisExpression as n, AccessScopeExpression as r, AccessMemberExpression as o, AccessKeyedExpression as l, CallScopeExpression as c, CallMemberExpression as h, CallFunctionExpression as a, BinaryExpression as u, UnaryExpression as d, PrimitiveLiteralExpression as f, ArrayLiteralExpression as g, ObjectLiteralExpression as b, TemplateExpression as p, TaggedTemplateExpression as v, ArrayBindingPattern as m, ObjectBindingPattern as C, BindingIdentifier as B, ForOfStatement as w, Interpolation as D, DestructuringAssignmentExpression as L, DestructuringAssignmentSingleExpression as y, DestructuringAssignmentRestExpression as E, ArrowFunction as _, astEvaluate as O, astAssign as S, astVisit as I, astBind as R, astUnbind as M, Unparser as j, getCollectionObserver as x, Scope as T, IExpressionParser as k, IObserverLocator as A } from "@aurelia/runtime";

import { bindingCommand as $, renderer as P, mixinUseScope as U, mixingBindingLimited as V, mixinAstEvaluator as q, IEventTarget as z, AppTask as F, PropertyBinding as G, AttributeBinding as H, ListenerBinding as J, LetBinding as K, InterpolationPartBinding as N, ContentBinding as Q, RefBinding as W, AuCompose as X, CustomElement as Y, BindableDefinition as Z, BindablesInfo as tt, ExpressionWatcher as et } from "@aurelia/runtime-html";

import { camelCase as it, DI as st } from "@aurelia/kernel";

let nt = false;

function defineAstMethods() {
    if (nt) {
        return;
    }
    nt = true;
    const def = (t, e, i) => Object.defineProperty(t.prototype, e, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: i
    });
    [ t, e, i, s, n, r, o, l, c, h, a, u, d, f, g, b, p, v, m, C, B, w, D, L, y, E, _ ].forEach((t => {
        def(t, "evaluate", (function(...t) {
            return O(this, ...t);
        }));
        def(t, "assign", (function(...t) {
            return S(this, ...t);
        }));
        def(t, "accept", (function(...t) {
            return I(this, ...t);
        }));
        def(t, "bind", (function(...t) {
            return R(this, ...t);
        }));
        def(t, "unbind", (function(...t) {
            return M(this, ...t);
        }));
        console.warn('"evaluate"/"assign"/"accept"/"visit"/"bind"/"unbind" are only valid on AST with $kind Custom.' + " Or import and use astEvaluate/astAssign/astVisit/astBind/astUnbind accordingly.");
    }));
}

function __decorate(t, e, i, s) {
    var n = arguments.length, r = n < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, i) : s, o;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(t, e, i, s); else for (var l = t.length - 1; l >= 0; l--) if (o = t[l]) r = (n < 3 ? o(r) : n > 3 ? o(e, i, r) : o(e, i)) || r;
    return n > 3 && r && Object.defineProperty(e, i, r), r;
}

const createLookup = () => Object.create(null);

const isFunction = t => typeof t === "function";

const isString = t => typeof t === "string";

const rt = Reflect.defineProperty;

const defineHiddenProp = (t, e, i) => {
    rt(t, e, {
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

const ot = Symbol(".call");

const lt = {
    register(t) {
        if (!t[ot]) {
            t[ot] = true;
            t.register(ht, at);
        }
    }
};

const ct = "rh";

class CallBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = ct;
    }
}

let ht = class CallBindingCommand {
    get type() {
        return 0;
    }
    build(t, e) {
        const i = t.bindable === null ? it(t.attr.target) : t.bindable.property;
        return new CallBindingInstruction(e.parse(t.attr.rawValue, 16 | 8), i);
    }
};

ht = __decorate([ $("call") ], ht);

let at = class CallBindingRenderer {
    render(t, e, i, s, n, r) {
        const o = ensureExpression(n, i.from, 16 | 8);
        t.addBinding(new CallBinding(t.container, r, o, getTarget(e), i.to));
    }
};

at = __decorate([ P(ct) ], at);

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
        const e = this.s.overrideContext;
        e.$event = t;
        const i = O(this.ast, this.s, this, null);
        Reflect.deleteProperty(e, "$event");
        return i;
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) {
                return;
            }
            this.unbind();
        }
        this.s = t;
        R(this.ast, t, this);
        this.targetObserver.setValue((t => this.callSource(t)), this.target, this.targetProperty);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        M(this.ast, this.s, this);
        this.s = void 0;
        this.targetObserver.setValue(null, this.target, this.targetProperty);
    }
}

U(CallBinding);

V(CallBinding, (() => "callSource"));

q(true)(CallBinding);

const ut = Symbol(".delegate");

const dt = {
    register(t) {
        if (!t[ut]) {
            t[ut] = true;
            t.register(vt, gt, bt);
        }
    }
};

const ft = "dl";

let gt = class DelegateBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new DelegateBindingInstruction(e.parse(t.attr.rawValue, 8), t.attr.target, false);
    }
};

gt = __decorate([ $("delegate") ], gt);

let bt = class ListenerBindingRenderer {
    static get inject() {
        return [ vt ];
    }
    constructor(t) {
        this.t = t;
    }
    render(t, e, i, s, n) {
        const r = ensureExpression(n, i.from, 8);
        t.addBinding(new DelegateListenerBinding(t.container, r, e, i.to, this.t, new DelegateListenerOptions(i.preventDefault)));
    }
};

bt = __decorate([ P(ft) ], bt);

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
    callSource(t) {
        const e = this.s.overrideContext;
        e.$event = t;
        let i = O(this.ast, this.s, this, null);
        delete e.$event;
        if (isFunction(i)) {
            i = i(t);
        }
        if (i !== true && this.i.prevent) {
            t.preventDefault();
        }
        return i;
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
        R(this.ast, t, this);
        this.handler = this.eventDelegator.addEventListener(this.l.get(z), this.target, this.targetEvent, this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        M(this.ast, this.s, this);
        this.s = void 0;
        this.handler.dispose();
        this.handler = null;
    }
}

U(DelegateListenerBinding);

V(DelegateListenerBinding, (() => "callSource"));

q(true, true)(DelegateListenerBinding);

const pt = {
    capture: false
};

class ListenerTracker {
    constructor(t, e, i = pt) {
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
    I(t) {
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
        this.R.O();
        this.M[this.u] = void 0;
    }
}

const vt = /*@__PURE__*/ st.createInterface("IEventDelegator", (t => t.cachedCallback((t => {
    const e = t.invoke(EventDelegator);
    t.register(F.deactivating((() => e.dispose())));
    return e;
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
        return new DelegateSubscription(l, l.I(e), i, s);
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

let mt = false;

const defineBindingMethods = () => {
    if (mt) return;
    mt = true;
    [ [ G, "Property binding" ], [ H, "Attribute binding" ], [ J, "Listener binding" ], [ CallBinding, "Call binding" ], [ K, "Let binding" ], [ N, "Interpolation binding" ], [ Q, "Text binding" ], [ W, "Ref binding" ], [ DelegateListenerBinding, "Delegate Listener binding" ] ].forEach((([t, e]) => {
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
    const getMessage = (t, e) => console.warn(`@deprecated "sourceExpression" property for expression on ${t}. It has been renamed to "ast". expression: "${j.unparse(e)}"`);
};

const Ct = F.creating(z, (t => {
    t.addEventListener("submit", (t => {
        const e = t.target;
        const i = e.action;
        if (e.tagName.toLowerCase() === "form" && !i) {
            t.preventDefault();
        }
    }), false);
}));

let Bt = false;

let wt = false;

const Dt = X.prototype;

const Lt = Symbol();

const yt = Dt.attaching;

const Et = Dt.propertyChanged;

function enableComposeCompat() {
    if (Bt) {
        return;
    }
    Bt = true;
    if (!wt) {
        wt = true;
        const t = Y.getDefinition(X);
        const e = t.bindables.viewModel = Z.create("viewModel", X);
        const i = t.bindables.view = Z.create("view", X);
        const s = tt.from(t, false);
        if (!("view" in s.attrs)) {
            s.attrs.view = s.bindables.view = i;
            s.attrs["view-model"] = s.bindables.viewModel = e;
        }
    }
    defineHiddenProp(Dt, "viewModelChanged", (function(t) {
        this.component = t;
    }));
    defineHiddenProp(Dt, "viewChanged", (function(t) {
        this.template = t;
    }));
    defineHiddenProp(Dt, "attaching", (function(...t) {
        this[Lt] = true;
        if (this.viewModel !== void 0) {
            this.component = this.viewModel;
        }
        if (this.view !== void 0) {
            this.template = this.view;
        }
        this[Lt] = false;
        return yt.apply(this, t);
    }));
    defineHiddenProp(Dt, "propertyChanged", (function(t) {
        if (this[Lt]) {
            return;
        }
        switch (t) {
          case "viewModel":
          case "view":
            return;
        }
        return Et.call(this, t);
    }));
}

function disableComposeCompat() {
    if (!Bt) {
        return;
    }
    if (wt) {
        wt = false;
        const t = Y.getDefinition(X);
        delete t.bindables.viewModel;
        delete t.bindables.view;
        const e = tt.from(t, false);
        if ("view" in e.attrs) {
            delete e.attrs.view;
            delete e.bindables.view;
            delete e.attrs["view-model"];
            delete e.bindables.viewModel;
        }
    }
    Bt = false;
    delete Dt.viewModelChanged;
    delete Dt.viewChanged;
    defineHiddenProp(Dt, "attaching", yt);
    defineHiddenProp(Dt, "propertyChanged", Et);
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
    collectionObserver(t) {
        return {
            subscribe: e => {
                const i = x(t);
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
    expressionObserver(t, e) {
        const i = T.create(t, {}, true);
        return {
            subscribe: t => {
                const s = new et(i, null, this.observerLocator, this.parser.parse(e, 16), t);
                s.bind();
                return {
                    dispose: () => s.unbind()
                };
            }
        };
    }
}

BindingEngine.inject = [ k, A ];

const _t = {
    register(t) {
        defineAstMethods();
        defineBindingMethods();
        enableComposeCompat();
        t.register(Ct);
        dt.register(t);
        lt.register(t);
    }
};

export { BindingEngine, CallBinding, ht as CallBindingCommand, CallBindingInstruction, at as CallBindingRenderer, gt as DelegateBindingCommand, DelegateBindingInstruction, DelegateListenerBinding, DelegateListenerOptions, EventDelegator, vt as IEventDelegator, bt as ListenerBindingRenderer, Ct as PreventFormActionlessSubmit, lt as callSyntax, _t as compatRegistration, dt as delegateSyntax, disableComposeCompat, enableComposeCompat };
//# sourceMappingURL=index.mjs.map
