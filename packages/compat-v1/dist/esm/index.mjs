import { BindingBehaviorExpression as t, ValueConverterExpression as e, AssignExpression as i, ConditionalExpression as n, AccessThisExpression as s, AccessScopeExpression as r, AccessMemberExpression as o, AccessKeyedExpression as l, CallScopeExpression as c, CallMemberExpression as h, CallFunctionExpression as u, BinaryExpression as a, UnaryExpression as d, PrimitiveLiteralExpression as f, ArrayLiteralExpression as g, ObjectLiteralExpression as b, TemplateExpression as p, TaggedTemplateExpression as v, ArrayBindingPattern as B, ObjectBindingPattern as m, BindingIdentifier as w, ForOfStatement as C, Interpolation as D, DestructuringAssignmentExpression as L, DestructuringAssignmentSingleExpression as y, DestructuringAssignmentRestExpression as E, ArrowFunction as O, astEvaluate as S, astAssign as I, astVisit as R, astBind as j, astUnbind as x, Unparser as M, getCollectionObserver as k, Scope as T, IExpressionParser as $, IObserverLocator as A } from "@aurelia/runtime";

import { bindingCommand as _, renderer as P, mixinUseScope as U, mixingBindingLimited as V, mixinAstEvaluator as q, AppTask as z, IEventTarget as F, PropertyBinding as G, AttributeBinding as H, ListenerBinding as J, LetBinding as K, InterpolationPartBinding as N, ContentBinding as Q, RefBinding as W, AuCompose as X, CustomElement as Y, BindableDefinition as Z, BindablesInfo as tt, ExpressionWatcher as et } from "@aurelia/runtime-html";

import { camelCase as it, DI as nt } from "@aurelia/kernel";

let st = false;

function rt() {
    if (st) return;
    st = true;
    const M = (t, e, i) => Object.defineProperty(t.prototype, e, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: i
    });
    [ t, e, i, n, s, r, o, l, c, h, u, a, d, f, g, b, p, v, B, m, w, C, D, L, y, E, O ].forEach((t => {
        M(t, "evaluate", (function(...t) {
            return S(this, ...t);
        }));
        M(t, "assign", (function(...t) {
            return I(this, ...t);
        }));
        M(t, "accept", (function(...t) {
            return R(this, ...t);
        }));
        M(t, "bind", (function(...t) {
            return j(this, ...t);
        }));
        M(t, "unbind", (function(...t) {
            return x(this, ...t);
        }));
        console.warn('"evaluate"/"assign"/"accept"/"visit"/"bind"/"unbind" are only valid on AST with $kind Custom.' + " Or import and use astEvaluate/astAssign/astVisit/astBind/astUnbind accordingly.");
    }));
}

function ot(t, e, i, n) {
    var s = arguments.length, r = s < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, i) : n, o;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(t, e, i, n); else for (var l = t.length - 1; l >= 0; l--) if (o = t[l]) r = (s < 3 ? o(r) : s > 3 ? o(e, i, r) : o(e, i)) || r;
    return s > 3 && r && Object.defineProperty(e, i, r), r;
}

const lt = () => Object.create(null);

const ct = t => "function" === typeof t;

const ht = t => "string" === typeof t;

const ut = Reflect.defineProperty;

const at = (t, e, i) => {
    ut(t, e, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: i
    });
    return i;
};

const dt = (t, e, i) => {
    if (ht(e)) return t.parse(e, i);
    return e;
};

const ft = Symbol(".call");

const gt = {
    register(t) {
        if (!t[ft]) {
            t[ft] = true;
            t.register(pt, vt);
        }
    }
};

const bt = "rh";

class CallBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = bt;
    }
}

let pt = class CallBindingCommand {
    get type() {
        return 0;
    }
    build(t, e) {
        const i = null === t.bindable ? it(t.attr.target) : t.bindable.property;
        return new CallBindingInstruction(e.parse(t.attr.rawValue, 16 | 8), i);
    }
};

pt = ot([ _("call") ], pt);

let vt = class CallBindingRenderer {
    render(t, e, i, n, s, r) {
        const o = dt(s, i.from, 16 | 8);
        t.addBinding(new CallBinding(t.container, r, o, Bt(e), i.to));
    }
};

vt = ot([ P(bt) ], vt);

function Bt(t) {
    if (null != t.viewModel) return t.viewModel;
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
        const i = S(this.ast, this.s, this, null);
        Reflect.deleteProperty(e, "$event");
        return i;
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) return;
            this.unbind();
        }
        this.s = t;
        j(this.ast, t, this);
        this.targetObserver.setValue((t => this.callSource(t)), this.target, this.targetProperty);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        x(this.ast, this.s, this);
        this.s = void 0;
        this.targetObserver.setValue(null, this.target, this.targetProperty);
    }
}

U(CallBinding);

V(CallBinding, (() => "callSource"));

q(true)(CallBinding);

const mt = Symbol(".delegate");

const wt = {
    register(t) {
        if (!t[mt]) {
            t[mt] = true;
            t.register(Et, Dt, Lt);
        }
    }
};

const Ct = "dl";

let Dt = class DelegateBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new DelegateBindingInstruction(e.parse(t.attr.rawValue, 8), t.attr.target, false);
    }
};

Dt = ot([ _("delegate") ], Dt);

let Lt = class ListenerBindingRenderer {
    static get inject() {
        return [ Et ];
    }
    constructor(t) {
        this.t = t;
    }
    render(t, e, i, n, s) {
        const r = dt(s, i.from, 8);
        t.addBinding(new DelegateListenerBinding(t.container, r, e, i.to, this.t, new DelegateListenerOptions(i.preventDefault)));
    }
};

Lt = ot([ P(Ct) ], Lt);

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
        let i = S(this.ast, this.s, this, null);
        delete e.$event;
        if (ct(i)) i = i(t);
        if (true !== i && this.i.prevent) t.preventDefault();
        return i;
    }
    handleEvent(t) {
        this.callSource(t);
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) return;
            this.unbind();
        }
        this.s = t;
        j(this.ast, t, this);
        this.handler = this.eventDelegator.addEventListener(this.l.get(F), this.target, this.targetEvent, this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        x(this.ast, this.s, this);
        this.s = void 0;
        this.handler.dispose();
        this.handler = null;
    }
}

U(DelegateListenerBinding);

V(DelegateListenerBinding, (() => "callSource"));

q(true, true)(DelegateListenerBinding);

const yt = {
    capture: false
};

class ListenerTracker {
    constructor(t, e, i = yt) {
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
    R(t) {
        const e = true === this.i.capture ? this.C : this.L;
        let i = e.get(t);
        if (void 0 === i) e.set(t, i = lt());
        return i;
    }
    handleEvent(t) {
        const e = true === this.i.capture ? this.C : this.L;
        const i = t.composedPath();
        if (true === this.i.capture) i.reverse();
        for (const n of i) {
            const i = e.get(n);
            if (void 0 === i) continue;
            const s = i[this.u];
            if (void 0 === s) continue;
            if (ct(s)) s(t); else s.handleEvent(t);
            if (true === t.cancelBubble) return;
        }
    }
}

class DelegateSubscription {
    constructor(t, e, i, n) {
        this.j = t;
        this.M = e;
        this.u = i;
        t.O();
        e[i] = n;
    }
    dispose() {
        this.j.I();
        this.M[this.u] = void 0;
    }
}

const Et = nt.createInterface("IEventDelegator", (t => t.cachedCallback((t => {
    const e = t.invoke(EventDelegator);
    t.register(z.deactivating((() => e.dispose())));
    return e;
}))));

class EventDelegator {
    constructor() {
        this.T = lt();
    }
    addEventListener(t, e, i, n, s) {
        var r;
        const o = (r = this.T)[i] ?? (r[i] = new Map);
        let l = o.get(t);
        if (void 0 === l) o.set(t, l = new ListenerTracker(t, i, s));
        return new DelegateSubscription(l, l.R(e), i, n);
    }
    dispose() {
        for (const t in this.T) {
            const e = this.T[t];
            for (const t of e.values()) t.dispose();
            e.clear();
        }
    }
}

let Ot = false;

const St = () => {
    if (Ot) return;
    Ot = true;
    [ [ G, "Property binding" ], [ H, "Attribute binding" ], [ J, "Listener binding" ], [ CallBinding, "Call binding" ], [ K, "Let binding" ], [ N, "Interpolation binding" ], [ Q, "Text binding" ], [ W, "Ref binding" ], [ DelegateListenerBinding, "Delegate Listener binding" ] ].forEach((([t, e]) => {
        Object.defineProperty(t.prototype, "sourceExpression", {
            configurable: true,
            enumerable: false,
            writable: true,
            get() {
                console.warn(`@deprecated "sourceExpression" property for expression on ${e}. It has been renamed to "ast". expression: "${M.unparse(this.ast)}"`);
                return this.ast;
            }
        });
    }));
};

const It = z.creating(F, (t => {
    t.addEventListener("submit", (t => {
        const e = t.target;
        const i = e.action;
        if ("form" === e.tagName.toLowerCase() && !i) t.preventDefault();
    }), false);
}));

let Rt = false;

let jt = false;

const xt = X.prototype;

const Mt = Symbol();

const kt = xt.attaching;

const Tt = xt.propertyChanged;

function $t() {
    if (Rt) return;
    Rt = true;
    if (!jt) {
        jt = true;
        const t = Y.getDefinition(X);
        const e = t.bindables.viewModel = Z.create("viewModel", X);
        const i = t.bindables.view = Z.create("view", X);
        const n = tt.from(t, false);
        if (!("view" in n.attrs)) {
            n.attrs.view = n.bindables.view = i;
            n.attrs["view-model"] = n.bindables.viewModel = e;
        }
    }
    at(xt, "viewModelChanged", (function(t) {
        this.component = t;
    }));
    at(xt, "viewChanged", (function(t) {
        this.template = t;
    }));
    at(xt, "attaching", (function(...t) {
        this[Mt] = true;
        if (void 0 !== this.viewModel) this.component = this.viewModel;
        if (void 0 !== this.view) this.template = this.view;
        this[Mt] = false;
        return kt.apply(this, t);
    }));
    at(xt, "propertyChanged", (function(t) {
        if (this[Mt]) return;
        switch (t) {
          case "viewModel":
          case "view":
            return;
        }
        return Tt.call(this, t);
    }));
}

function At() {
    if (!Rt) return;
    if (jt) {
        jt = false;
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
    Rt = false;
    delete xt.viewModelChanged;
    delete xt.viewChanged;
    at(xt, "attaching", kt);
    at(xt, "propertyChanged", Tt);
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
                const i = k(t);
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
        const i = T.create(t, {}, true);
        return {
            subscribe: t => {
                const n = new et(i, null, this.observerLocator, this.parser.parse(e, 16), t);
                n.bind();
                return {
                    dispose: () => n.unbind()
                };
            }
        };
    }
}

BindingEngine.inject = [ $, A ];

const _t = {
    register(t) {
        rt();
        St();
        $t();
        t.register(It);
        wt.register(t);
        gt.register(t);
    }
};

export { BindingEngine, CallBinding, pt as CallBindingCommand, CallBindingInstruction, vt as CallBindingRenderer, Dt as DelegateBindingCommand, DelegateBindingInstruction, DelegateListenerBinding, DelegateListenerOptions, EventDelegator, Et as IEventDelegator, Lt as ListenerBindingRenderer, It as PreventFormActionlessSubmit, gt as callSyntax, _t as compatRegistration, wt as delegateSyntax, At as disableComposeCompat, $t as enableComposeCompat };
//# sourceMappingURL=index.mjs.map
