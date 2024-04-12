import { BindingBehaviorExpression as t, ValueConverterExpression as e, AssignExpression as i, ConditionalExpression as n, AccessThisExpression as s, AccessScopeExpression as r, AccessMemberExpression as o, AccessKeyedExpression as l, CallScopeExpression as a, CallMemberExpression as c, CallFunctionExpression as h, BinaryExpression as u, UnaryExpression as d, PrimitiveLiteralExpression as g, ArrayLiteralExpression as f, ObjectLiteralExpression as p, TemplateExpression as b, TaggedTemplateExpression as m, ArrayBindingPattern as C, ObjectBindingPattern as v, BindingIdentifier as B, ForOfStatement as w, Interpolation as D, DestructuringAssignmentExpression as L, DestructuringAssignmentSingleExpression as y, DestructuringAssignmentRestExpression as E, ArrowFunction as O, astEvaluate as I, astAssign as S, astVisit as R, astBind as _, astUnbind as k, Unparser as M, IExpressionParser as x, IObserverLocator as A, getCollectionObserver as j, Scope as T } from "../../../runtime/dist/native-modules/index.mjs";

import { renderer as $, mixinUseScope as W, mixingBindingLimited as P, mixinAstEvaluator as F, IListenerBindingOptions as U, InstructionType as V, IEventTarget as q, AppTask as z, PropertyBinding as G, AttributeBinding as H, ListenerBinding as J, LetBinding as K, InterpolationPartBinding as N, ContentBinding as Q, RefBinding as X, AuCompose as Y, CustomElement as Z, BindableDefinition as tt, ExpressionWatcher as et } from "../../../runtime-html/dist/native-modules/index.mjs";

import { camelCase as it, resolve as nt, DI as st } from "../../../kernel/dist/native-modules/index.mjs";

let rt = false;

function defineAstMethods() {
    if (rt) {
        return;
    }
    rt = true;
    const def = (t, e, i) => Object.defineProperty(t.prototype, e, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: i
    });
    [ t, e, i, n, s, r, o, l, a, c, h, u, d, g, f, p, b, m, C, v, B, w, D, L, y, E, O ].forEach((t => {
        def(t, "evaluate", (function(...t) {
            return I(this, ...t);
        }));
        def(t, "assign", (function(...t) {
            return S(this, ...t);
        }));
        def(t, "accept", (function(...t) {
            return R(this, ...t);
        }));
        def(t, "bind", (function(...t) {
            return _(this, ...t);
        }));
        def(t, "unbind", (function(...t) {
            return k(this, ...t);
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

const ot = Reflect.defineProperty;

const defineHiddenProp = (t, e, i) => {
    ot(t, e, {
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

const lt = "IsFunction";

const at = new WeakSet;

const ct = {
    register(t) {
        if (!at.has(t)) {
            at.add(t);
            t.register(CallBindingCommand, ut);
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

class CallBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, e) {
        const i = t.bindable === null ? it(t.attr.target) : t.bindable.name;
        return new CallBindingInstruction(e.parse(t.attr.rawValue, lt), i);
    }
}

CallBindingCommand.$au = {
    type: "binding-command",
    name: "call"
};

let ut = class CallBindingRenderer {
    render(t, e, i, n, s, r) {
        const o = ensureExpression(s, i.from, lt);
        t.addBinding(new CallBinding(t.container, r, o, getTarget(e), i.to));
    }
};

ut = __decorate([ $(ht) ], ut);

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
        _(this.ast, t, this);
        this.targetObserver.setValue((t => this.callSource(t)), this.target, this.targetProperty);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        k(this.ast, this.s, this);
        this.s = void 0;
        this.targetObserver.setValue(null, this.target, this.targetProperty);
    }
}

W(CallBinding);

P(CallBinding, (() => "callSource"));

F(true)(CallBinding);

const dt = new WeakSet;

const gt = {
    register(t) {
        if (dt.has(t)) {
            return;
        }
        dt.add(t);
        t.get(U).prevent = true;
    }
};

const ft = new WeakSet;

const pt = {
    register(t) {
        if (!ft.has(t)) {
            ft.add(t);
            t.register(Ct, DelegateBindingCommand, bt);
        }
    }
};

class DelegateBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new DelegateBindingInstruction(e.parse(t.attr.rawValue, lt), t.attr.target, true);
    }
}

DelegateBindingCommand.$au = {
    type: "binding-command",
    name: "delegate"
};

let bt = class ListenerBindingRenderer {
    constructor() {
        this.t = nt(Ct);
    }
    render(t, e, i, n, s) {
        const r = ensureExpression(s, i.from, lt);
        t.addBinding(new DelegateListenerBinding(t.container, r, e, i.to, this.t, new DelegateListenerOptions(i.preventDefault)));
    }
};

bt = __decorate([ $("dl") ], bt);

class DelegateBindingInstruction {
    constructor(t, e, i) {
        this.from = t;
        this.to = e;
        this.preventDefault = i;
        this.type = V.listenerBinding;
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
        _(this.ast, t, this);
        this.handler = this.eventDelegator.addEventListener(this.l.get(q), this.target, this.targetEvent, this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        k(this.ast, this.s, this);
        this.s = void 0;
        this.handler.dispose();
        this.handler = null;
    }
}

W(DelegateListenerBinding);

P(DelegateListenerBinding, (() => "callSource"));

F(true, true)(DelegateListenerBinding);

const mt = {
    capture: false
};

class ListenerTracker {
    constructor(t, e, i = mt) {
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

const Ct = /*@__PURE__*/ st.createInterface("IEventDelegator", (t => t.cachedCallback((t => {
    const e = t.invoke(EventDelegator);
    t.register(z.deactivating((() => e.dispose())));
    return e;
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

let vt = false;

const defineBindingMethods = () => {
    if (vt) return;
    vt = true;
    [ [ G, "Property binding" ], [ H, "Attribute binding" ], [ J, "Listener binding" ], [ CallBinding, "Call binding" ], [ K, "Let binding" ], [ N, "Interpolation binding" ], [ Q, "Text binding" ], [ X, "Ref binding" ], [ DelegateListenerBinding, "Delegate Listener binding" ] ].forEach((([t, e]) => {
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
    const getMessage = (t, e) => console.warn(`@deprecated "sourceExpression" property for expression on ${t}. It has been renamed to "ast". expression: "${M.unparse(e)}"`);
};

let Bt = false;

let wt = false;

const Dt = Y.prototype;

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
        const t = Z.getDefinition(Y);
        t.bindables.viewModel = tt.create("viewModel", Y);
        t.bindables.view = tt.create("view", Y);
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
        const t = Z.getDefinition(Y);
        delete t.bindables.viewModel;
        delete t.bindables.view;
    }
    Bt = false;
    delete Dt.viewModelChanged;
    delete Dt.viewChanged;
    defineHiddenProp(Dt, "attaching", yt);
    defineHiddenProp(Dt, "propertyChanged", Et);
}

class BindingEngine {
    constructor() {
        this.parser = nt(x);
        this.observerLocator = nt(A);
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
                const i = j(t);
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
                const n = new et(i, null, this.observerLocator, this.parser.parse(e, "IsProperty"), t);
                n.bind();
                return {
                    dispose: () => n.unbind()
                };
            }
        };
    }
}

const Ot = {
    register(t) {
        defineAstMethods();
        defineBindingMethods();
        enableComposeCompat();
        t.register(gt, pt, ct);
    }
};

export { BindingEngine, CallBinding, CallBindingCommand, CallBindingInstruction, ut as CallBindingRenderer, DelegateBindingCommand, DelegateBindingInstruction, DelegateListenerBinding, DelegateListenerOptions, EventDelegator, Ct as IEventDelegator, bt as ListenerBindingRenderer, ct as callSyntax, Ot as compatRegistration, pt as delegateSyntax, disableComposeCompat, enableComposeCompat, gt as eventPreventDefaultBehavior };

