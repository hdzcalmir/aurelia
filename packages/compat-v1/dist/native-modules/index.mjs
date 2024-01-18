import { BindingBehaviorExpression as t, ValueConverterExpression as e, AssignExpression as i, ConditionalExpression as n, AccessThisExpression as s, AccessScopeExpression as r, AccessMemberExpression as o, AccessKeyedExpression as l, CallScopeExpression as c, CallMemberExpression as h, CallFunctionExpression as a, BinaryExpression as u, UnaryExpression as d, PrimitiveLiteralExpression as f, ArrayLiteralExpression as g, ObjectLiteralExpression as b, TemplateExpression as p, TaggedTemplateExpression as v, ArrayBindingPattern as m, ObjectBindingPattern as C, BindingIdentifier as B, ForOfStatement as w, Interpolation as D, DestructuringAssignmentExpression as L, DestructuringAssignmentSingleExpression as y, DestructuringAssignmentRestExpression as E, ArrowFunction as _, astEvaluate as I, astAssign as O, astVisit as S, astBind as R, astUnbind as M, Unparser as j, getCollectionObserver as x, Scope as A, IExpressionParser as T, IObserverLocator as k } from "../../../runtime/dist/native-modules/index.mjs";

import { bindingCommand as $, renderer as P, mixinUseScope as F, mixingBindingLimited as N, mixinAstEvaluator as U, IEventTarget as V, AppTask as q, PropertyBinding as z, AttributeBinding as G, ListenerBinding as H, LetBinding as J, InterpolationPartBinding as K, ContentBinding as Q, RefBinding as W, AuCompose as X, CustomElement as Y, BindableDefinition as Z, BindablesInfo as tt, ExpressionWatcher as et } from "../../../runtime-html/dist/native-modules/index.mjs";

import { camelCase as it, DI as nt } from "../../../kernel/dist/native-modules/index.mjs";

let st = false;

function defineAstMethods() {
    if (st) {
        return;
    }
    st = true;
    const def = (t, e, i) => Object.defineProperty(t.prototype, e, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: i
    });
    [ t, e, i, n, s, r, o, l, c, h, a, u, d, f, g, b, p, v, m, C, B, w, D, L, y, E, _ ].forEach((t => {
        def(t, "evaluate", (function(...t) {
            return I(this, ...t);
        }));
        def(t, "assign", (function(...t) {
            return O(this, ...t);
        }));
        def(t, "accept", (function(...t) {
            return S(this, ...t);
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

function __decorate(t, e, i, n) {
    var s = arguments.length, r = s < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, i) : n, o;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(t, e, i, n); else for (var l = t.length - 1; l >= 0; l--) if (o = t[l]) r = (s < 3 ? o(r) : s > 3 ? o(e, i, r) : o(e, i)) || r;
    return s > 3 && r && Object.defineProperty(e, i, r), r;
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

const ot = "IsFunction";

const lt = Symbol(".call");

const ct = {
    register(t) {
        if (!t[lt]) {
            t[lt] = true;
            t.register(at, ut);
        }
    }
};

const ht = "rh";

class CallBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = ht;
    }
}

let at = class CallBindingCommand {
    get type() {
        return "None";
    }
    build(t, e) {
        const i = t.bindable === null ? it(t.attr.target) : t.bindable.name;
        return new CallBindingInstruction(e.parse(t.attr.rawValue, ot), i);
    }
};

at = __decorate([ $("call") ], at);

let ut = class CallBindingRenderer {
    render(t, e, i, n, s, r) {
        const o = ensureExpression(s, i.from, ot);
        t.addBinding(new CallBinding(t.container, r, o, getTarget(e), i.to));
    }
};

ut = __decorate([ P(ht) ], ut);

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
        const e = this.s.overrideContext;
        e.$event = t;
        const i = I(this.ast, this.s, this, null);
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

F(CallBinding);

N(CallBinding, (() => "callSource"));

U(true)(CallBinding);

const dt = Symbol(".delegate");

const ft = {
    register(t) {
        if (!t[dt]) {
            t[dt] = true;
            t.register(mt, bt, pt);
        }
    }
};

const gt = "dl";

let bt = class DelegateBindingCommand {
    get type() {
        return "IgnoreAttr";
    }
    build(t, e) {
        return new DelegateBindingInstruction(e.parse(t.attr.rawValue, ot), t.attr.target, false);
    }
};

bt = __decorate([ $("delegate") ], bt);

let pt = class ListenerBindingRenderer {
    static get inject() {
        return [ mt ];
    }
    constructor(t) {
        this.t = t;
    }
    render(t, e, i, n, s) {
        const r = ensureExpression(s, i.from, ot);
        t.addBinding(new DelegateListenerBinding(t.container, r, e, i.to, this.t, new DelegateListenerOptions(i.preventDefault)));
    }
};

pt = __decorate([ P(gt) ], pt);

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
        const e = this.s.overrideContext;
        e.$event = t;
        let i = I(this.ast, this.s, this, null);
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
        this.handler = this.eventDelegator.addEventListener(this.l.get(V), this.target, this.targetEvent, this);
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

F(DelegateListenerBinding);

N(DelegateListenerBinding, (() => "callSource"));

U(true, true)(DelegateListenerBinding);

const vt = {
    capture: false
};

class ListenerTracker {
    constructor(t, e, i = vt) {
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
        this.R = t;
        this.M = e;
        this.u = i;
        t._();
        e[i] = n;
    }
    dispose() {
        this.R.I();
        this.M[this.u] = void 0;
    }
}

const mt = /*@__PURE__*/ nt.createInterface("IEventDelegator", (t => t.cachedCallback((t => {
    const e = t.invoke(EventDelegator);
    t.register(q.deactivating((() => e.dispose())));
    return e;
}))));

class EventDelegator {
    constructor() {
        this.j = createLookup();
    }
    addEventListener(t, e, i, n, s) {
        var r;
        const o = (r = this.j)[i] ?? (r[i] = new Map);
        let l = o.get(t);
        if (l === void 0) {
            o.set(t, l = new ListenerTracker(t, i, s));
        }
        return new DelegateSubscription(l, l.O(e), i, n);
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

let Ct = false;

const defineBindingMethods = () => {
    if (Ct) return;
    Ct = true;
    [ [ z, "Property binding" ], [ G, "Attribute binding" ], [ H, "Listener binding" ], [ CallBinding, "Call binding" ], [ J, "Let binding" ], [ K, "Interpolation binding" ], [ Q, "Text binding" ], [ W, "Ref binding" ], [ DelegateListenerBinding, "Delegate Listener binding" ] ].forEach((([t, e]) => {
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

const Bt = q.creating(V, (t => {
    t.addEventListener("submit", (t => {
        const e = t.target;
        const i = e.action;
        if (e.tagName.toLowerCase() === "form" && !i) {
            t.preventDefault();
        }
    }), false);
}));

let wt = false;

let Dt = false;

const Lt = X.prototype;

const yt = Symbol();

const Et = Lt.attaching;

const _t = Lt.propertyChanged;

function enableComposeCompat() {
    if (wt) {
        return;
    }
    wt = true;
    if (!Dt) {
        Dt = true;
        const t = Y.getDefinition(X);
        const e = t.bindables.viewModel = Z.create("viewModel", X);
        const i = t.bindables.view = Z.create("view", X);
        const n = tt.from(t, false);
        if (!("view" in n.attrs)) {
            n.attrs.view = n.bindables.view = i;
            n.attrs["view-model"] = n.bindables.viewModel = e;
        }
    }
    defineHiddenProp(Lt, "viewModelChanged", (function(t) {
        this.component = t;
    }));
    defineHiddenProp(Lt, "viewChanged", (function(t) {
        this.template = t;
    }));
    defineHiddenProp(Lt, "attaching", (function(...t) {
        this[yt] = true;
        if (this.viewModel !== void 0) {
            this.component = this.viewModel;
        }
        if (this.view !== void 0) {
            this.template = this.view;
        }
        this[yt] = false;
        return Et.apply(this, t);
    }));
    defineHiddenProp(Lt, "propertyChanged", (function(t) {
        if (this[yt]) {
            return;
        }
        switch (t) {
          case "viewModel":
          case "view":
            return;
        }
        return _t.call(this, t);
    }));
}

function disableComposeCompat() {
    if (!wt) {
        return;
    }
    if (Dt) {
        Dt = false;
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
    wt = false;
    delete Lt.viewModelChanged;
    delete Lt.viewChanged;
    defineHiddenProp(Lt, "attaching", Et);
    defineHiddenProp(Lt, "propertyChanged", _t);
}

class BindingEngine {
    constructor(t, e) {
        this.parser = t;
        this.observerLocator = e;
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
                const i = x(t);
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
    expressionObserver(t, e) {
        const i = A.create(t, {}, true);
        return {
            subscribe: t => {
                const n = new et(i, null, this.observerLocator, this.parser.parse(e, "IsProperty"), t);
                n.bind();
                return {
                    dispose: () => n.unbind()
                };
            }
        };
    }
}

BindingEngine.inject = [ T, k ];

const It = {
    register(t) {
        defineAstMethods();
        defineBindingMethods();
        enableComposeCompat();
        t.register(Bt);
        ft.register(t);
        ct.register(t);
    }
};

export { BindingEngine, CallBinding, at as CallBindingCommand, CallBindingInstruction, ut as CallBindingRenderer, bt as DelegateBindingCommand, DelegateBindingInstruction, DelegateListenerBinding, DelegateListenerOptions, EventDelegator, mt as IEventDelegator, pt as ListenerBindingRenderer, Bt as PreventFormActionlessSubmit, ct as callSyntax, It as compatRegistration, ft as delegateSyntax, disableComposeCompat, enableComposeCompat };

