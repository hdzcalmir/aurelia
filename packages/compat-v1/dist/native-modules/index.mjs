import { BindingBehaviorExpression as t, ValueConverterExpression as e, AssignExpression as i, ConditionalExpression as n, AccessThisExpression as s, AccessScopeExpression as r, AccessMemberExpression as o, AccessKeyedExpression as l, CallScopeExpression as a, CallMemberExpression as h, CallFunctionExpression as c, BinaryExpression as u, UnaryExpression as d, PrimitiveLiteralExpression as g, ArrayLiteralExpression as f, ObjectLiteralExpression as p, TemplateExpression as b, TaggedTemplateExpression as m, ArrayBindingPattern as C, ObjectBindingPattern as B, BindingIdentifier as v, ForOfStatement as D, Interpolation as w, DestructuringAssignmentExpression as L, DestructuringAssignmentSingleExpression as y, DestructuringAssignmentRestExpression as E, ArrowFunction as R, astVisit as I, Unparser as S, IExpressionParser as O } from "../../../expression-parser/dist/native-modules/index.mjs";

import { astEvaluate as k, astAssign as x, astBind as M, astUnbind as A, renderer as T, mixinUseScope as $, mixingBindingLimited as j, mixinAstEvaluator as W, IListenerBindingOptions as _, InstructionType as P, IEventTarget as V, AppTask as F, PropertyBinding as U, AttributeBinding as q, ListenerBinding as z, LetBinding as G, InterpolationPartBinding as H, ContentBinding as J, RefBinding as K, AuCompose as N, CustomElement as Q, BindableDefinition as X, ExpressionWatcher as Y } from "../../../runtime-html/dist/native-modules/index.mjs";

import { camelCase as Z, resolve as tt, DI as et } from "../../../kernel/dist/native-modules/index.mjs";

import { IObserverLocator as it, getCollectionObserver as nt, Scope as st } from "../../../runtime/dist/native-modules/index.mjs";

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
    [ t, e, i, n, s, r, o, l, a, h, c, u, d, g, f, p, b, m, C, B, v, D, w, L, y, E, R ].forEach((t => {
        def(t, "evaluate", (function(...t) {
            return k(this, ...t);
        }));
        def(t, "assign", (function(...t) {
            return x(this, ...t);
        }));
        def(t, "accept", (function(...t) {
            return I(this, ...t);
        }));
        def(t, "bind", (function(...t) {
            return M(this, ...t);
        }));
        def(t, "unbind", (function(...t) {
            return A(this, ...t);
        }));
    }));
    console.warn('"evaluate"/"assign"/"accept"/"visit"/"bind"/"unbind" are only valid on AST with ast $kind "Custom".' + " Or import and use astEvaluate/astAssign/astVisit/astBind/astUnbind accordingly.");
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

const ht = {
    register(t) {
        if (!at.has(t)) {
            at.add(t);
            t.register(CallBindingCommand, CallBindingRenderer);
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

class CallBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, e) {
        const i = t.bindable === null ? Z(t.attr.target) : t.bindable.name;
        return new CallBindingInstruction(e.parse(t.attr.rawValue, lt), i);
    }
}

CallBindingCommand.$au = {
    type: "binding-command",
    name: "call"
};

class CallBindingRenderer {
    render(t, e, i, n, s, r) {
        const o = ensureExpression(s, i.from, lt);
        t.addBinding(new CallBinding(t.container, r, o, getTarget(e), i.to));
    }
}

T(ct)(CallBindingRenderer, null);

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
        const i = k(this.ast, this.s, this, null);
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
        M(this.ast, t, this);
        this.targetObserver.setValue((t => this.callSource(t)), this.target, this.targetProperty);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        A(this.ast, this.s, this);
        this.s = void 0;
        this.targetObserver.setValue(null, this.target, this.targetProperty);
    }
}

$(CallBinding);

j(CallBinding, (() => "callSource"));

W(true)(CallBinding);

const ut = new WeakSet;

const dt = {
    register(t) {
        if (ut.has(t)) {
            return;
        }
        ut.add(t);
        t.get(_).prevent = true;
    }
};

const gt = new WeakSet;

const ft = {
    register(t) {
        if (!gt.has(t)) {
            gt.add(t);
            t.register(bt, DelegateBindingCommand, ListenerBindingRenderer);
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

class ListenerBindingRenderer {
    constructor() {
        this.t = tt(bt);
    }
    render(t, e, i, n, s) {
        const r = ensureExpression(s, i.from, lt);
        t.addBinding(new DelegateListenerBinding(t.container, r, e, i.to, this.t, new DelegateListenerOptions(i.preventDefault)));
    }
}

T("dl")(ListenerBindingRenderer, null);

class DelegateBindingInstruction {
    constructor(t, e, i) {
        this.from = t;
        this.to = e;
        this.preventDefault = i;
        this.type = P.listenerBinding;
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
        let i = k(this.ast, this.s, this, null);
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
        M(this.ast, t, this);
        this.handler = this.eventDelegator.addEventListener(this.l.get(V), this.target, this.targetEvent, this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        A(this.ast, this.s, this);
        this.s = void 0;
        this.handler.dispose();
        this.handler = null;
    }
}

$(DelegateListenerBinding);

j(DelegateListenerBinding, (() => "callSource"));

W(true, true)(DelegateListenerBinding);

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

const bt = /*@__PURE__*/ et.createInterface("IEventDelegator", (t => t.cachedCallback((t => {
    const e = t.invoke(EventDelegator);
    t.register(F.deactivating((() => e.dispose())));
    return e;
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

let mt = false;

const defineBindingMethods = () => {
    if (mt) return;
    mt = true;
    [ [ U, "Property binding" ], [ q, "Attribute binding" ], [ z, "Listener binding" ], [ CallBinding, "Call binding" ], [ G, "Let binding" ], [ H, "Interpolation binding" ], [ J, "Text binding" ], [ K, "Ref binding" ], [ DelegateListenerBinding, "Delegate Listener binding" ] ].forEach((([t, e]) => {
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
    const getMessage = (t, e) => console.warn(`[DEV:aurelia] @deprecated "sourceExpression" property for expression on ${t}. It has been renamed to "ast". expression: "${S.unparse(e)}"`);
};

let Ct = false;

let Bt = false;

const vt = N.prototype;

const Dt = Symbol();

const wt = vt.attaching;

const Lt = vt.propertyChanged;

function enableComposeCompat() {
    if (Ct) {
        return;
    }
    Ct = true;
    if (!Bt) {
        Bt = true;
        const t = Q.getDefinition(N);
        t.bindables.viewModel = X.create("viewModel");
        t.bindables.view = X.create("view");
    }
    defineHiddenProp(vt, "viewModelChanged", (function(t) {
        this.component = t;
    }));
    defineHiddenProp(vt, "viewChanged", (function(t) {
        this.template = t;
    }));
    defineHiddenProp(vt, "attaching", (function(...t) {
        this[Dt] = true;
        if (this.viewModel !== void 0) {
            this.component = this.viewModel;
        }
        if (this.view !== void 0) {
            this.template = this.view;
        }
        this[Dt] = false;
        return wt.apply(this, t);
    }));
    defineHiddenProp(vt, "propertyChanged", (function(t) {
        if (this[Dt]) {
            return;
        }
        switch (t) {
          case "viewModel":
          case "view":
            return;
        }
        return Lt.call(this, t);
    }));
}

function disableComposeCompat() {
    if (!Ct) {
        return;
    }
    if (Bt) {
        Bt = false;
        const t = Q.getDefinition(N);
        delete t.bindables.viewModel;
        delete t.bindables.view;
    }
    Ct = false;
    delete vt.viewModelChanged;
    delete vt.viewChanged;
    defineHiddenProp(vt, "attaching", wt);
    defineHiddenProp(vt, "propertyChanged", Lt);
}

class BindingEngine {
    constructor() {
        this.parser = tt(O);
        this.observerLocator = tt(it);
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
                const i = nt(t);
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
        const i = st.create(t, {}, true);
        return {
            subscribe: t => {
                const n = new Y(i, null, this.observerLocator, this.parser.parse(e, "IsProperty"), t);
                n.bind();
                return {
                    dispose: () => n.unbind()
                };
            }
        };
    }
}

const yt = {
    register(t) {
        defineAstMethods();
        defineBindingMethods();
        enableComposeCompat();
        t.register(dt, ft, ht);
    }
};

export { BindingEngine, CallBinding, CallBindingCommand, CallBindingInstruction, CallBindingRenderer, DelegateBindingCommand, DelegateBindingInstruction, DelegateListenerBinding, DelegateListenerOptions, EventDelegator, bt as IEventDelegator, ListenerBindingRenderer, ht as callSyntax, yt as compatRegistration, ft as delegateSyntax, disableComposeCompat, enableComposeCompat, dt as eventPreventDefaultBehavior };

