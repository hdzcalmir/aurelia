import { BindingBehaviorExpression as t, ValueConverterExpression as e, AssignExpression as i, ConditionalExpression as n, AccessThisExpression as s, AccessScopeExpression as r, AccessMemberExpression as o, AccessKeyedExpression as l, CallScopeExpression as a, CallMemberExpression as h, CallFunctionExpression as c, BinaryExpression as u, UnaryExpression as d, PrimitiveLiteralExpression as g, ArrayLiteralExpression as f, ObjectLiteralExpression as p, TemplateExpression as b, TaggedTemplateExpression as m, ArrayBindingPattern as C, ObjectBindingPattern as v, BindingIdentifier as B, ForOfStatement as D, Interpolation as w, DestructuringAssignmentExpression as L, DestructuringAssignmentSingleExpression as y, DestructuringAssignmentRestExpression as E, ArrowFunction as I, astVisit as S, Unparser as O, IExpressionParser as k } from "@aurelia/expression-parser";

import { astEvaluate as x, astAssign as M, astBind as A, astUnbind as R, mixinUseScope as T, mixingBindingLimited as $, mixinAstEvaluator as j, renderer as W, IListenerBindingOptions as _, IEventTarget as P, AppTask as V, PropertyBinding as F, AttributeBinding as U, ListenerBinding as q, LetBinding as z, InterpolationPartBinding as G, ContentBinding as H, RefBinding as J, AuCompose as K, CustomElement as N, BindableDefinition as Q, Scope as X, ExpressionWatcher as Y } from "@aurelia/runtime-html";

import { camelCase as Z, resolve as tt, DI as et } from "@aurelia/kernel";

import { IObserverLocator as it, getCollectionObserver as nt } from "@aurelia/runtime";

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
    [ t, e, i, n, s, r, o, l, a, h, c, u, d, g, f, p, b, m, C, v, B, D, w, L, y, E, I ].forEach((t => {
        def(t, "evaluate", (function(...t) {
            return x(this, ...t);
        }));
        def(t, "assign", (function(...t) {
            return M(this, ...t);
        }));
        def(t, "accept", (function(...t) {
            return S(this, ...t);
        }));
        def(t, "bind", (function(...t) {
            return A(this, ...t);
        }));
        def(t, "unbind", (function(...t) {
            return R(this, ...t);
        }));
    }));
    console.warn('"evaluate"/"assign"/"accept"/"visit"/"bind"/"unbind" are only valid on AST with ast $kind "Custom".' + " Or import and use astEvaluate/astAssign/astVisit/astBind/astUnbind accordingly.");
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

const lt = new WeakSet;

const at = {
    register(t) {
        if (!lt.has(t)) {
            lt.add(t);
            t.register(CallBindingCommand, ct);
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
        const i = t.bindable === null ? Z(t.attr.target) : t.bindable.name;
        return new CallBindingInstruction(e.parse(t.attr.rawValue, ot), i);
    }
}

CallBindingCommand.$au = {
    type: "binding-command",
    name: "call"
};

const ct = /*@__PURE__*/ W(class CallBindingRenderer {
    constructor() {
        this.target = ht;
    }
    render(t, e, i, n, s, r) {
        const o = ensureExpression(s, i.from, ot);
        t.addBinding(new CallBinding(t.container, r, o, getTarget(e), i.to));
    }
}, null);

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
        const i = x(this.ast, this.s, this, null);
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
        A(this.ast, t, this);
        this.targetObserver.setValue((t => this.callSource(t)), this.target, this.targetProperty);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        R(this.ast, this.s, this);
        this.s = void 0;
        this.targetObserver.setValue(null, this.target, this.targetProperty);
    }
}

(() => {
    T(CallBinding);
    $(CallBinding, (() => "callSource"));
    j(true)(CallBinding);
})();

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
            t.register(mt, DelegateBindingCommand, pt);
        }
    }
};

class DelegateBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new DelegateBindingInstruction(e.parse(t.attr.rawValue, ot), t.attr.target, true);
    }
}

DelegateBindingCommand.$au = {
    type: "binding-command",
    name: "delegate"
};

const pt = /*@__PURE__*/ W(class ListenerBindingRenderer {
    constructor() {
        this.target = "dl";
        this.t = tt(mt);
    }
    render(t, e, i, n, s) {
        const r = ensureExpression(s, i.from, ot);
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
    constructor(t, e, i, n, s, r) {
        this.ast = e;
        this.target = i;
        this.targetEvent = n;
        this.eventDelegator = s;
        this.isBound = false;
        this.handler = null;
        this.boundFn = true;
        this.self = false;
        this.l = t;
        this.i = r;
    }
    callSource(t) {
        const e = this.s.overrideContext;
        e.$event = t;
        let i = x(this.ast, this.s, this, null);
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
        A(this.ast, t, this);
        this.handler = this.eventDelegator.addEventListener(this.l.get(P), this.target, this.targetEvent, this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        R(this.ast, this.s, this);
        this.s = void 0;
        this.handler.dispose();
        this.handler = null;
    }
}

(() => {
    T(DelegateListenerBinding);
    $(DelegateListenerBinding, (() => "callSource"));
    j(true, true)(DelegateListenerBinding);
})();

const bt = {
    capture: false
};

class ListenerTracker {
    constructor(t, e, i = bt) {
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
        this.A = t;
        this.R = e;
        this.u = i;
        t.I();
        e[i] = n;
    }
    dispose() {
        this.A.O();
        this.R[this.u] = void 0;
    }
}

const mt = /*@__PURE__*/ et.createInterface("IEventDelegator", (t => t.cachedCallback((t => {
    const e = t.invoke(EventDelegator);
    t.register(V.deactivating((() => e.dispose())));
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
        return new DelegateSubscription(o, o.M(e), i, n);
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

let Ct = false;

const defineBindingMethods = () => {
    if (Ct) return;
    Ct = true;
    [ [ F, "Property binding" ], [ U, "Attribute binding" ], [ q, "Listener binding" ], [ CallBinding, "Call binding" ], [ z, "Let binding" ], [ G, "Interpolation binding" ], [ H, "Text binding" ], [ J, "Ref binding" ], [ DelegateListenerBinding, "Delegate Listener binding" ] ].forEach((([t, e]) => {
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
    const getMessage = (t, e) => console.warn(`[DEV:aurelia] @deprecated "sourceExpression" property for expression on ${t}. It has been renamed to "ast". expression: "${O.unparse(e)}"`);
};

let vt = false;

let Bt = false;

const Dt = K.prototype;

const wt = Symbol();

const Lt = Dt.attaching;

const yt = Dt.propertyChanged;

function enableComposeCompat() {
    if (vt) {
        return;
    }
    vt = true;
    if (!Bt) {
        Bt = true;
        const t = N.getDefinition(K);
        t.bindables.viewModel = Q.create("viewModel");
        t.bindables.view = Q.create("view");
    }
    defineHiddenProp(Dt, "viewModelChanged", (function(t) {
        this.component = t;
    }));
    defineHiddenProp(Dt, "viewChanged", (function(t) {
        this.template = t;
    }));
    defineHiddenProp(Dt, "attaching", (function(...t) {
        this[wt] = true;
        if (this.viewModel !== void 0) {
            this.component = this.viewModel;
        }
        if (this.view !== void 0) {
            this.template = this.view;
        }
        this[wt] = false;
        return Lt.apply(this, t);
    }));
    defineHiddenProp(Dt, "propertyChanged", (function(t) {
        if (this[wt]) {
            return;
        }
        switch (t) {
          case "viewModel":
          case "view":
            return;
        }
        return yt.call(this, t);
    }));
}

function disableComposeCompat() {
    if (!vt) {
        return;
    }
    if (Bt) {
        Bt = false;
        const t = N.getDefinition(K);
        delete t.bindables.viewModel;
        delete t.bindables.view;
    }
    vt = false;
    delete Dt.viewModelChanged;
    delete Dt.viewChanged;
    defineHiddenProp(Dt, "attaching", Lt);
    defineHiddenProp(Dt, "propertyChanged", yt);
}

class BindingEngine {
    constructor() {
        this.parser = tt(k);
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
        const i = X.create(t, {}, true);
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

const Et = {
    register(t) {
        defineAstMethods();
        defineBindingMethods();
        enableComposeCompat();
        t.register(dt, ft, at);
    }
};

export { BindingEngine, CallBinding, CallBindingCommand, CallBindingInstruction, ct as CallBindingRenderer, DelegateBindingCommand, DelegateBindingInstruction, DelegateListenerBinding, DelegateListenerOptions, EventDelegator, mt as IEventDelegator, pt as ListenerBindingRenderer, at as callSyntax, Et as compatRegistration, ft as delegateSyntax, disableComposeCompat, enableComposeCompat, dt as eventPreventDefaultBehavior };
//# sourceMappingURL=index.mjs.map
