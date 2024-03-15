import { BindingBehaviorExpression as t, ValueConverterExpression as e, AssignExpression as i, ConditionalExpression as s, AccessThisExpression as n, AccessScopeExpression as r, AccessMemberExpression as o, AccessKeyedExpression as l, CallScopeExpression as c, CallMemberExpression as h, CallFunctionExpression as a, BinaryExpression as u, UnaryExpression as d, PrimitiveLiteralExpression as f, ArrayLiteralExpression as g, ObjectLiteralExpression as p, TemplateExpression as b, TaggedTemplateExpression as v, ArrayBindingPattern as m, ObjectBindingPattern as C, BindingIdentifier as B, ForOfStatement as w, Interpolation as D, DestructuringAssignmentExpression as L, DestructuringAssignmentSingleExpression as y, DestructuringAssignmentRestExpression as _, ArrowFunction as E, astEvaluate as I, astAssign as O, astVisit as S, astBind as R, astUnbind as M, Unparser as j, IExpressionParser as k, IObserverLocator as x, getCollectionObserver as A, Scope as T } from "../../../runtime/dist/native-modules/index.mjs";

import { bindingCommand as $, renderer as P, mixinUseScope as W, mixingBindingLimited as F, mixinAstEvaluator as N, IListenerBindingOptions as U, InstructionType as V, IEventTarget as q, AppTask as z, PropertyBinding as G, AttributeBinding as H, ListenerBinding as J, LetBinding as K, InterpolationPartBinding as Q, ContentBinding as X, RefBinding as Y, AuCompose as Z, CustomElement as tt, BindableDefinition as et, BindablesInfo as it, ExpressionWatcher as st } from "../../../runtime-html/dist/native-modules/index.mjs";

import { camelCase as nt, DI as rt, resolve as ot } from "../../../kernel/dist/native-modules/index.mjs";

let lt = false;

function defineAstMethods() {
    if (lt) {
        return;
    }
    lt = true;
    const def = (t, e, i) => Object.defineProperty(t.prototype, e, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: i
    });
    [ t, e, i, s, n, r, o, l, c, h, a, u, d, f, g, p, b, v, m, C, B, w, D, L, y, _, E ].forEach((t => {
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

const ct = Reflect.defineProperty;

const defineHiddenProp = (t, e, i) => {
    ct(t, e, {
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

const ht = "IsFunction";

const at = Symbol(".call");

const ut = {
    register(t) {
        if (!t[at]) {
            t[at] = true;
            t.register(ft, gt);
        }
    }
};

const dt = "rh";

class CallBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = dt;
    }
}

let ft = class CallBindingCommand {
    get type() {
        return "None";
    }
    build(t, e) {
        const i = t.bindable === null ? nt(t.attr.target) : t.bindable.name;
        return new CallBindingInstruction(e.parse(t.attr.rawValue, ht), i);
    }
};

ft = __decorate([ $("call") ], ft);

let gt = class CallBindingRenderer {
    render(t, e, i, s, n, r) {
        const o = ensureExpression(n, i.from, ht);
        t.addBinding(new CallBinding(t.container, r, o, getTarget(e), i.to));
    }
};

gt = __decorate([ P(dt) ], gt);

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

W(CallBinding);

F(CallBinding, (() => "callSource"));

N(true)(CallBinding);

const pt = new WeakSet;

const bt = {
    register(t) {
        if (pt.has(t)) {
            return;
        }
        pt.add(t);
        t.get(U).prevent = true;
    }
};

const vt = new WeakSet;

const mt = {
    register(t) {
        if (!vt.has(t)) {
            vt.add(t);
            t.register(Dt, Ct, Bt);
        }
    }
};

let Ct = class DelegateBindingCommand {
    get type() {
        return "IgnoreAttr";
    }
    build(t, e) {
        return new DelegateBindingInstruction(e.parse(t.attr.rawValue, ht), t.attr.target, true);
    }
};

Ct = __decorate([ $("delegate") ], Ct);

let Bt = class ListenerBindingRenderer {
    static get inject() {
        return [ Dt ];
    }
    constructor(t) {
        this.t = t;
    }
    render(t, e, i, s, n) {
        const r = ensureExpression(n, i.from, ht);
        t.addBinding(new DelegateListenerBinding(t.container, r, e, i.to, this.t, new DelegateListenerOptions(i.preventDefault)));
    }
};

Bt = __decorate([ P("dl") ], Bt);

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
        this.handler = this.eventDelegator.addEventListener(this.l.get(q), this.target, this.targetEvent, this);
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

W(DelegateListenerBinding);

F(DelegateListenerBinding, (() => "callSource"));

N(true, true)(DelegateListenerBinding);

const wt = {
    capture: false
};

class ListenerTracker {
    constructor(t, e, i = wt) {
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

const Dt = /*@__PURE__*/ rt.createInterface("IEventDelegator", (t => t.cachedCallback((t => {
    const e = t.invoke(EventDelegator);
    t.register(z.deactivating((() => e.dispose())));
    return e;
}))));

class EventDelegator {
    constructor() {
        this.j = createLookup();
    }
    addEventListener(t, e, i, s, n) {
        const r = this.j[i] ??= new Map;
        let o = r.get(t);
        if (o === void 0) {
            r.set(t, o = new ListenerTracker(t, i, n));
        }
        return new DelegateSubscription(o, o.O(e), i, s);
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

let Lt = false;

const defineBindingMethods = () => {
    if (Lt) return;
    Lt = true;
    [ [ G, "Property binding" ], [ H, "Attribute binding" ], [ J, "Listener binding" ], [ CallBinding, "Call binding" ], [ K, "Let binding" ], [ Q, "Interpolation binding" ], [ X, "Text binding" ], [ Y, "Ref binding" ], [ DelegateListenerBinding, "Delegate Listener binding" ] ].forEach((([t, e]) => {
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

const yt = z.creating(q, (t => {
    t.addEventListener("submit", (t => {
        const e = t.target;
        const i = e.action;
        if (e.tagName.toLowerCase() === "form" && !i) {
            t.preventDefault();
        }
    }), false);
}));

let _t = false;

let Et = false;

const It = Z.prototype;

const Ot = Symbol();

const St = It.attaching;

const Rt = It.propertyChanged;

function enableComposeCompat() {
    if (_t) {
        return;
    }
    _t = true;
    if (!Et) {
        Et = true;
        const t = tt.getDefinition(Z);
        const e = t.bindables.viewModel = et.create("viewModel", Z);
        const i = t.bindables.view = et.create("view", Z);
        const s = it.from(t, false);
        if (!("view" in s.attrs)) {
            s.attrs.view = s.bindables.view = i;
            s.attrs["view-model"] = s.bindables.viewModel = e;
        }
    }
    defineHiddenProp(It, "viewModelChanged", (function(t) {
        this.component = t;
    }));
    defineHiddenProp(It, "viewChanged", (function(t) {
        this.template = t;
    }));
    defineHiddenProp(It, "attaching", (function(...t) {
        this[Ot] = true;
        if (this.viewModel !== void 0) {
            this.component = this.viewModel;
        }
        if (this.view !== void 0) {
            this.template = this.view;
        }
        this[Ot] = false;
        return St.apply(this, t);
    }));
    defineHiddenProp(It, "propertyChanged", (function(t) {
        if (this[Ot]) {
            return;
        }
        switch (t) {
          case "viewModel":
          case "view":
            return;
        }
        return Rt.call(this, t);
    }));
}

function disableComposeCompat() {
    if (!_t) {
        return;
    }
    if (Et) {
        Et = false;
        const t = tt.getDefinition(Z);
        delete t.bindables.viewModel;
        delete t.bindables.view;
        const e = it.from(t, false);
        if ("view" in e.attrs) {
            delete e.attrs.view;
            delete e.bindables.view;
            delete e.attrs["view-model"];
            delete e.bindables.viewModel;
        }
    }
    _t = false;
    delete It.viewModelChanged;
    delete It.viewChanged;
    defineHiddenProp(It, "attaching", St);
    defineHiddenProp(It, "propertyChanged", Rt);
}

class BindingEngine {
    constructor() {
        this.parser = ot(k);
        this.observerLocator = ot(x);
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
                const i = A(t);
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
                const s = new st(i, null, this.observerLocator, this.parser.parse(e, "IsProperty"), t);
                s.bind();
                return {
                    dispose: () => s.unbind()
                };
            }
        };
    }
}

const Mt = {
    register(t) {
        defineAstMethods();
        defineBindingMethods();
        enableComposeCompat();
        t.register(yt, bt, mt, ut);
    }
};

export { BindingEngine, CallBinding, ft as CallBindingCommand, CallBindingInstruction, gt as CallBindingRenderer, Ct as DelegateBindingCommand, DelegateBindingInstruction, DelegateListenerBinding, DelegateListenerOptions, EventDelegator, Dt as IEventDelegator, Bt as ListenerBindingRenderer, yt as PreventFormActionlessSubmit, ut as callSyntax, Mt as compatRegistration, mt as delegateSyntax, disableComposeCompat, enableComposeCompat, bt as eventPreventDefaultBehavior };

