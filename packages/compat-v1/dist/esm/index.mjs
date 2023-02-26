import { BindingBehaviorExpression as t, ValueConverterExpression as i, AssignExpression as e, ConditionalExpression as n, AccessThisExpression as s, AccessScopeExpression as r, AccessMemberExpression as o, AccessKeyedExpression as l, CallScopeExpression as h, CallMemberExpression as c, CallFunctionExpression as u, BinaryExpression as a, UnaryExpression as d, PrimitiveLiteralExpression as g, ArrayLiteralExpression as f, ObjectLiteralExpression as b, TemplateExpression as p, TaggedTemplateExpression as B, ArrayBindingPattern as v, ObjectBindingPattern as m, BindingIdentifier as D, ForOfStatement as C, Interpolation as L, DestructuringAssignmentExpression as w, DestructuringAssignmentSingleExpression as y, DestructuringAssignmentRestExpression as E, ArrowFunction as O, astEvaluate as I, astAssign as S, astVisit as j, astBind as x, astUnbind as R, Unparser as k, getCollectionObserver as T, Scope as $, IExpressionParser as A, IObserverLocator as M } from "@aurelia/runtime";

import { bindingCommand as _, renderer as P, mixinUseScope as U, mixingBindingLimited as V, mixinAstEvaluator as q, AppTask as z, IEventTarget as F, PropertyBinding as G, AttributeBinding as H, ListenerBinding as J, LetBinding as K, InterpolationPartBinding as N, ContentBinding as Q, RefBinding as W, ExpressionWatcher as X } from "@aurelia/runtime-html";

import { camelCase as Y, DI as Z } from "@aurelia/kernel";

let tt = false;

function it() {
    if (tt) return;
    tt = true;
    const k = (t, i, e) => Object.defineProperty(t.prototype, i, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: e
    });
    [ t, i, e, n, s, r, o, l, h, c, u, a, d, g, f, b, p, B, v, m, D, C, L, w, y, E, O ].forEach((t => {
        k(t, "evaluate", (function(...t) {
            return I(this, ...t);
        }));
        k(t, "assign", (function(...t) {
            return S(this, ...t);
        }));
        k(t, "accept", (function(...t) {
            return j(this, ...t);
        }));
        k(t, "bind", (function(...t) {
            return x(this, ...t);
        }));
        k(t, "unbind", (function(...t) {
            return R(this, ...t);
        }));
        console.warn('"evaluate"/"assign"/"accept"/"visit"/"bind"/"unbind" are only valid on AST with $kind Custom.' + " Or import and use astEvaluate/astAssign/astVisit/astBind/astUnbind accordingly.");
    }));
}

function et(t, i, e, n) {
    var s = arguments.length, r = s < 3 ? i : null === n ? n = Object.getOwnPropertyDescriptor(i, e) : n, o;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(t, i, e, n); else for (var l = t.length - 1; l >= 0; l--) if (o = t[l]) r = (s < 3 ? o(r) : s > 3 ? o(i, e, r) : o(i, e)) || r;
    return s > 3 && r && Object.defineProperty(i, e, r), r;
}

const nt = () => Object.create(null);

const st = t => "function" === typeof t;

const rt = t => "string" === typeof t;

const ot = (t, i, e) => {
    if (rt(i)) return t.parse(i, e);
    return i;
};

const lt = Symbol(".call");

const ht = {
    register(t) {
        if (!t[lt]) {
            t[lt] = true;
            t.register(ut, at);
        }
    }
};

const ct = "rh";

class CallBindingInstruction {
    constructor(t, i) {
        this.from = t;
        this.to = i;
        this.type = ct;
    }
}

let ut = class CallBindingCommand {
    get type() {
        return 0;
    }
    build(t, i) {
        const e = null === t.bindable ? Y(t.attr.target) : t.bindable.property;
        return new CallBindingInstruction(i.parse(t.attr.rawValue, 16 | 8), e);
    }
};

ut = et([ _("call") ], ut);

let at = class CallBindingRenderer {
    render(t, i, e, n, s, r) {
        const o = ot(s, e.from, 16 | 8);
        t.addBinding(new CallBinding(t.container, r, o, dt(i), e.to));
    }
};

at = et([ P(ct) ], at);

function dt(t) {
    if (null != t.viewModel) return t.viewModel;
    return t;
}

class CallBinding {
    constructor(t, i, e, n, s) {
        this.ast = e;
        this.target = n;
        this.targetProperty = s;
        this.isBound = false;
        this.boundFn = false;
        this.l = t;
        this.targetObserver = i.getAccessor(n, s);
    }
    callSource(t) {
        const i = this.s.overrideContext;
        i.$event = t;
        const e = I(this.ast, this.s, this, null);
        Reflect.deleteProperty(i, "$event");
        return e;
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) return;
            this.unbind();
        }
        this.s = t;
        x(this.ast, t, this);
        this.targetObserver.setValue((t => this.callSource(t)), this.target, this.targetProperty);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        R(this.ast, this.s, this);
        this.s = void 0;
        this.targetObserver.setValue(null, this.target, this.targetProperty);
    }
}

U(CallBinding);

V(CallBinding, (() => "callSource"));

q(true)(CallBinding);

const gt = Symbol(".delegate");

const ft = {
    register(t) {
        if (!t[gt]) {
            t[gt] = true;
            t.register(mt, pt, Bt);
        }
    }
};

const bt = "dl";

let pt = class DelegateBindingCommand {
    get type() {
        return 1;
    }
    build(t, i) {
        return new DelegateBindingInstruction(i.parse(t.attr.rawValue, 8), t.attr.target, false);
    }
};

pt = et([ _("delegate") ], pt);

let Bt = class ListenerBindingRenderer {
    static get inject() {
        return [ mt ];
    }
    constructor(t) {
        this.t = t;
    }
    render(t, i, e, n, s) {
        const r = ot(s, e.from, 8);
        t.addBinding(new DelegateListenerBinding(t.container, r, i, e.to, this.t, new DelegateListenerOptions(e.preventDefault)));
    }
};

Bt = et([ P(bt) ], Bt);

class DelegateBindingInstruction {
    constructor(t, i, e) {
        this.from = t;
        this.to = i;
        this.preventDefault = e;
        this.type = "hb";
    }
}

class DelegateListenerOptions {
    constructor(t) {
        this.prevent = t;
    }
}

class DelegateListenerBinding {
    constructor(t, i, e, n, s, r) {
        this.ast = i;
        this.target = e;
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
        let e = I(this.ast, this.s, this, null);
        delete i.$event;
        if (st(e)) e = e(t);
        if (true !== e && this.i.prevent) t.preventDefault();
        return e;
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
        x(this.ast, t, this);
        this.handler = this.eventDelegator.addEventListener(this.l.get(F), this.target, this.targetEvent, this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        R(this.ast, this.s, this);
        this.s = void 0;
        this.handler.dispose();
        this.handler = null;
    }
}

U(DelegateListenerBinding);

V(DelegateListenerBinding, (() => "callSource"));

q(true, true)(DelegateListenerBinding);

const vt = {
    capture: false
};

class ListenerTracker {
    constructor(t, i, e = vt) {
        this.h = t;
        this.u = i;
        this.i = e;
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
        const i = true === this.i.capture ? this.C : this.L;
        let e = i.get(t);
        if (void 0 === e) i.set(t, e = nt());
        return e;
    }
    handleEvent(t) {
        const i = true === this.i.capture ? this.C : this.L;
        const e = t.composedPath();
        if (true === this.i.capture) e.reverse();
        for (const n of e) {
            const e = i.get(n);
            if (void 0 === e) continue;
            const s = e[this.u];
            if (void 0 === s) continue;
            if (st(s)) s(t); else s.handleEvent(t);
            if (true === t.cancelBubble) return;
        }
    }
}

class DelegateSubscription {
    constructor(t, i, e, n) {
        this.R = t;
        this.T = i;
        this.u = e;
        t.O();
        i[e] = n;
    }
    dispose() {
        this.R.I();
        this.T[this.u] = void 0;
    }
}

const mt = Z.createInterface("IEventDelegator", (t => t.cachedCallback((t => {
    const i = t.invoke(EventDelegator);
    t.register(z.deactivating((() => i.dispose())));
    return i;
}))));

class EventDelegator {
    constructor() {
        this.$ = nt();
    }
    addEventListener(t, i, e, n, s) {
        var r;
        const o = (r = this.$)[e] ?? (r[e] = new Map);
        let l = o.get(t);
        if (void 0 === l) o.set(t, l = new ListenerTracker(t, e, s));
        return new DelegateSubscription(l, l.j(i), e, n);
    }
    dispose() {
        for (const t in this.$) {
            const i = this.$[t];
            for (const t of i.values()) t.dispose();
            i.clear();
        }
    }
}

let Dt = false;

const Ct = () => {
    if (Dt) return;
    Dt = true;
    [ [ G, "Property binding" ], [ H, "Attribute binding" ], [ J, "Listener binding" ], [ CallBinding, "Call binding" ], [ K, "Let binding" ], [ N, "Interpolation binding" ], [ Q, "Text binding" ], [ W, "Ref binding" ], [ DelegateListenerBinding, "Delegate Listener binding" ] ].forEach((([t, i]) => {
        Object.defineProperty(t.prototype, "sourceExpression", {
            configurable: true,
            enumerable: false,
            writable: true,
            get() {
                console.warn(`@deprecated "sourceExpression" property for expression on ${i}. It has been renamed to "ast". expression: "${k.unparse(this.ast)}"`);
                return this.ast;
            }
        });
    }));
};

const Lt = z.creating(F, (t => {
    t.addEventListener("submit", (t => {
        const i = t.target;
        const e = i.action;
        if ("form" === i.tagName.toLowerCase() && !e) t.preventDefault();
    }), false);
}));

class BindingEngine {
    constructor(t, i) {
        this.parser = t;
        this.observerLocator = i;
    }
    propertyObserver(t, i) {
        return {
            subscribe: e => {
                const n = this.observerLocator.getObserver(t, i);
                const s = {
                    handleChange: (t, i) => e(t, i)
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
            subscribe: i => {
                const e = T(t);
                const n = {
                    handleCollectionChange: (t, e) => i(t, e)
                };
                e?.subscribe(n);
                return {
                    dispose: () => e?.unsubscribe(n)
                };
            }
        };
    }
    expressionObserver(t, i) {
        const e = $.create(t, {}, true);
        return {
            subscribe: t => {
                const n = new X(e, null, this.observerLocator, this.parser.parse(i, 16), t);
                n.bind();
                return {
                    dispose: () => n.unbind()
                };
            }
        };
    }
}

BindingEngine.inject = [ A, M ];

const wt = {
    register(t) {
        it();
        Ct();
        t.register(Lt);
        ft.register(t);
        ht.register(t);
    }
};

export { BindingEngine, CallBinding, ut as CallBindingCommand, CallBindingInstruction, at as CallBindingRenderer, pt as DelegateBindingCommand, DelegateBindingInstruction, DelegateListenerBinding, DelegateListenerOptions, EventDelegator, mt as IEventDelegator, Bt as ListenerBindingRenderer, Lt as PreventFormActionlessSubmit, ht as callSyntax, wt as compatRegistration, ft as delegateSyntax };
//# sourceMappingURL=index.mjs.map
