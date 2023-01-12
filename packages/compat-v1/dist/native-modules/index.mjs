import { BindingBehaviorExpression as t, ValueConverterExpression as i, AssignExpression as e, ConditionalExpression as n, AccessThisExpression as s, AccessScopeExpression as r, AccessMemberExpression as l, AccessKeyedExpression as o, CallScopeExpression as h, CallMemberExpression as c, CallFunctionExpression as a, BinaryExpression as u, UnaryExpression as d, PrimitiveLiteralExpression as f, ArrayLiteralExpression as g, ObjectLiteralExpression as b, TemplateExpression as p, TaggedTemplateExpression as B, ArrayBindingPattern as m, ObjectBindingPattern as v, BindingIdentifier as D, ForOfStatement as L, Interpolation as C, DestructuringAssignmentExpression as w, DestructuringAssignmentSingleExpression as y, DestructuringAssignmentRestExpression as E, ArrowFunction as I, astEvaluate as O, astAssign as S, astVisit as j, astBind as R, astUnbind as x, Unparser as k } from "../runtime/dist/native-modules/index.mjs";

import { bindingCommand as T, renderer as $, mixinUseScope as A, mixingBindingLimited as M, mixinAstEvaluator as _, AppTask as P, IEventTarget as U, PropertyBinding as V, AttributeBinding as q, ListenerBinding as z, LetBinding as F, InterpolationPartBinding as G, ContentBinding as H, RefBinding as J } from "../runtime-html/dist/native-modules/index.mjs";

import { camelCase as K, DI as N } from "../kernel/dist/native-modules/index.mjs";

let Q = false;

function W() {
    if (Q) return;
    Q = true;
    const k = (t, i, e) => Object.defineProperty(t.prototype, i, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: e
    });
    [ t, i, e, n, s, r, l, o, h, c, a, u, d, f, g, b, p, B, m, v, D, L, C, w, y, E, I ].forEach((t => {
        k(t, "evaluate", (function(...t) {
            return O(this, ...t);
        }));
        k(t, "assign", (function(...t) {
            return S(this, ...t);
        }));
        k(t, "accept", (function(...t) {
            return j(this, ...t);
        }));
        k(t, "bind", (function(...t) {
            return R(this, ...t);
        }));
        k(t, "unbind", (function(...t) {
            return x(this, ...t);
        }));
        console.warn('"evaluate"/"assign"/"accept"/"visit"/"bind"/"unbind" are only valid on AST with $kind Custom.' + " Or import and use astEvaluate/astAssign/astVisit/astBind/astUnbind accordingly.");
    }));
}

function X(t, i, e, n) {
    var s = arguments.length, r = s < 3 ? i : null === n ? n = Object.getOwnPropertyDescriptor(i, e) : n, l;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(t, i, e, n); else for (var o = t.length - 1; o >= 0; o--) if (l = t[o]) r = (s < 3 ? l(r) : s > 3 ? l(i, e, r) : l(i, e)) || r;
    return s > 3 && r && Object.defineProperty(i, e, r), r;
}

const Y = () => Object.create(null);

const Z = t => "function" === typeof t;

const tt = t => "string" === typeof t;

const it = (t, i, e) => {
    if (tt(i)) return t.parse(i, e);
    return i;
};

const et = Symbol(".call");

const nt = {
    register(t) {
        if (!t[et]) {
            t[et] = true;
            t.register(rt, lt);
        }
    }
};

const st = "rh";

class CallBindingInstruction {
    constructor(t, i) {
        this.from = t;
        this.to = i;
        this.type = st;
    }
}

let rt = class CallBindingCommand {
    get type() {
        return 0;
    }
    build(t, i) {
        const e = null === t.bindable ? K(t.attr.target) : t.bindable.property;
        return new CallBindingInstruction(i.parse(t.attr.rawValue, 16 | 8), e);
    }
};

rt = X([ T("call") ], rt);

let lt = class CallBindingRenderer {
    render(t, i, e, n, s, r) {
        const l = it(s, e.from, 16 | 8);
        t.addBinding(new CallBinding(t.container, r, l, ot(i), e.to));
    }
};

lt = X([ $(st) ], lt);

function ot(t) {
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
        const e = O(this.ast, this.s, this, null);
        Reflect.deleteProperty(i, "$event");
        return e;
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) return;
            this.unbind();
        }
        this.s = t;
        R(this.ast, t, this);
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

A(CallBinding);

M(CallBinding, (() => "callSource"));

_(true)(CallBinding);

const ht = Symbol(".delegate");

const ct = {
    register(t) {
        if (!t[ht]) {
            t[ht] = true;
            t.register(gt, ut, dt);
        }
    }
};

const at = "dl";

let ut = class DelegateBindingCommand {
    get type() {
        return 1;
    }
    build(t, i) {
        return new DelegateBindingInstruction(i.parse(t.attr.rawValue, 8), t.attr.target, false);
    }
};

ut = X([ T("delegate") ], ut);

let dt = class ListenerBindingRenderer {
    constructor(t) {
        this.t = t;
    }
    static get inject() {
        return [ gt ];
    }
    render(t, i, e, n, s) {
        const r = it(s, e.from, 8);
        t.addBinding(new DelegateListenerBinding(t.container, r, i, e.to, this.t, new DelegateListenerOptions(e.preventDefault)));
    }
};

dt = X([ $(at) ], dt);

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
        let e = O(this.ast, this.s, this, null);
        delete i.$event;
        if (Z(e)) e = e(t);
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
        R(this.ast, t, this);
        this.handler = this.eventDelegator.addEventListener(this.l.get(U), this.target, this.targetEvent, this);
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

A(DelegateListenerBinding);

M(DelegateListenerBinding, (() => "callSource"));

_(true, true)(DelegateListenerBinding);

const ft = {
    capture: false
};

class ListenerTracker {
    constructor(t, i, e = ft) {
        this.h = t;
        this.u = i;
        this.i = e;
        this.B = 0;
        this.L = new Map;
        this.C = new Map;
    }
    I() {
        if (1 === ++this.B) this.h.addEventListener(this.u, this, this.i);
    }
    O() {
        if (0 === --this.B) this.h.removeEventListener(this.u, this, this.i);
    }
    dispose() {
        if (this.B > 0) {
            this.B = 0;
            this.h.removeEventListener(this.u, this, this.i);
        }
        this.L.clear();
        this.C.clear();
    }
    j(t) {
        const i = true === this.i.capture ? this.L : this.C;
        let e = i.get(t);
        if (void 0 === e) i.set(t, e = Y());
        return e;
    }
    handleEvent(t) {
        const i = true === this.i.capture ? this.L : this.C;
        const e = t.composedPath();
        if (true === this.i.capture) e.reverse();
        for (const n of e) {
            const e = i.get(n);
            if (void 0 === e) continue;
            const s = e[this.u];
            if (void 0 === s) continue;
            if (Z(s)) s(t); else s.handleEvent(t);
            if (true === t.cancelBubble) return;
        }
    }
}

class DelegateSubscription {
    constructor(t, i, e, n) {
        this.R = t;
        this.T = i;
        this.u = e;
        t.I();
        i[e] = n;
    }
    dispose() {
        this.R.O();
        this.T[this.u] = void 0;
    }
}

const gt = N.createInterface("IEventDelegator", (t => t.cachedCallback((t => {
    const i = t.invoke(EventDelegator);
    t.register(P.deactivating((() => i.dispose())));
    return i;
}))));

class EventDelegator {
    constructor() {
        this.$ = Y();
    }
    addEventListener(t, i, e, n, s) {
        var r;
        const l = (r = this.$)[e] ?? (r[e] = new Map);
        let o = l.get(t);
        if (void 0 === o) l.set(t, o = new ListenerTracker(t, e, s));
        return new DelegateSubscription(o, o.j(i), e, n);
    }
    dispose() {
        for (const t in this.$) {
            const i = this.$[t];
            for (const t of i.values()) t.dispose();
            i.clear();
        }
    }
}

let bt = false;

const pt = () => {
    if (bt) return;
    bt = true;
    [ [ V, "Property binding" ], [ q, "Attribute binding" ], [ z, "Listener binding" ], [ CallBinding, "Call binding" ], [ F, "Let binding" ], [ G, "Interpolation binding" ], [ H, "Text binding" ], [ J, "Ref binding" ], [ DelegateListenerBinding, "Delegate Listener binding" ] ].forEach((([t, i]) => {
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

const Bt = P.creating(U, (t => {
    t.addEventListener("submit", (t => {
        const i = t.target;
        const e = i.action;
        if ("form" === i.tagName.toLowerCase() && !e) t.preventDefault();
    }), false);
}));

const mt = {
    register(t) {
        W();
        pt();
        t.register(Bt);
        ct.register(t);
        nt.register(t);
    }
};

export { CallBinding, rt as CallBindingCommand, CallBindingInstruction, lt as CallBindingRenderer, ut as DelegateBindingCommand, DelegateBindingInstruction, DelegateListenerBinding, DelegateListenerOptions, EventDelegator, gt as IEventDelegator, dt as ListenerBindingRenderer, Bt as PreventFormActionlessSubmit, nt as callSyntax, mt as compatRegistration, ct as delegateSyntax };

