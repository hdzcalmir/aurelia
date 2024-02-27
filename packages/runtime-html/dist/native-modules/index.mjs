import { Protocol as t, getPrototypeChain as e, kebabCase as i, noop as s, DI as n, Registration as r, createResolver as l, firstDefined as a, mergeArrays as h, resolve as c, IPlatform as u, emptyArray as f, all as d, InstanceProvider as m, IContainer as g, optional as p, onResolveAll as v, onResolve as b, fromDefinitionOrDefault as x, pascalCase as w, fromAnnotationOrTypeOrDefault as y, fromAnnotationOrDefinitionOrTypeOrDefault as k, camelCase as C, IServiceLocator as A, emptyObject as B, ILogger as S, transient as _, toArray as R } from "../../../kernel/dist/native-modules/index.mjs";

import { Metadata as T, isObject as I } from "../../../metadata/dist/native-modules/index.mjs";

import { AccessorType as E, ISignaler as P, astEvaluate as L, connectable as M, astBind as D, astUnbind as q, astAssign as H, subscriberCollection as F, IExpressionParser as O, IObserverLocator as V, ConnectableSwitcher as $, ProxyObservable as N, Scope as W, ICoercionConfiguration as j, AccessScopeExpression as z, PropertyAccessor as U, INodeObserverLocator as G, IDirtyChecker as K, getObserverLookup as X, SetterObserver as Q, createIndexMap as Y, getCollectionObserver as Z, BindingContext as J, PrimitiveLiteralExpression as tt, DirtyChecker as et } from "../../../runtime/dist/native-modules/index.mjs";

import { BrowserPlatform as it } from "../../../platform-browser/dist/native-modules/index.mjs";

import { TaskAbortError as st } from "../../../platform/dist/native-modules/index.mjs";

function __decorate(t, e, i, s) {
    var n = arguments.length, r = n < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, i) : s, l;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(t, e, i, s); else for (var a = t.length - 1; a >= 0; a--) if (l = t[a]) r = (n < 3 ? l(r) : n > 3 ? l(e, i, r) : l(e, i)) || r;
    return n > 3 && r && Object.defineProperty(e, i, r), r;
}

const nt = Object;

const rt = String;

const ot = nt.prototype;

const createLookup = () => nt.create(null);

const createError$1 = t => new Error(t);

const lt = ot.hasOwnProperty;

const at = nt.freeze;

const ht = nt.assign;

const ct = nt.getOwnPropertyNames;

const ut = nt.keys;

const ft = /*@__PURE__*/ createLookup();

const isDataAttribute = (t, e, i) => {
    if (ft[e] === true) {
        return true;
    }
    if (!isString(e)) {
        return false;
    }
    const s = e.slice(0, 5);
    return ft[e] = s === "aria-" || s === "data-" || i.isStandardSvgAttribute(t, e);
};

const isPromise = t => t instanceof Promise;

const isArray = t => t instanceof Array;

const isFunction = t => typeof t === "function";

const isString = t => typeof t === "string";

const rethrow = t => {
    throw t;
};

const dt = nt.is;

const mt = Reflect.defineProperty;

const defineHiddenProp = (t, e, i) => {
    mt(t, e, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: i
    });
    return i;
};

const addSignalListener = (t, e, i) => t.addSignalListener(e, i);

const removeSignalListener = (t, e, i) => t.removeSignalListener(e, i);

const gt = "Interpolation";

const pt = "IsIterator";

const vt = "IsFunction";

const bt = "IsProperty";

const xt = "pending";

const wt = "running";

const yt = E.Observer;

const kt = E.Node;

const Ct = E.Layout;

const At = 1;

const Bt = 2;

const St = 4;

const _t = 6;

const Rt = 8;

const Tt = /*@__PURE__*/ at({
    oneTime: At,
    toView: Bt,
    fromView: St,
    twoWay: _t,
    default: Rt
});

const It = T.getOwn;

const Et = T.hasOwn;

const Pt = T.define;

const {annotation: Lt, resource: Mt} = t;

const Dt = Lt.keyFor;

const qt = Mt.keyFor;

const Ht = Mt.appendTo;

const Ft = Lt.appendTo;

const Ot = Lt.getKeys;

function bindable(t, e) {
    let i;
    function decorator(t, e) {
        if (arguments.length > 1) {
            i.name = e;
        }
        Pt(Vt, BindableDefinition.create(e, t, i), t.constructor, e);
        Ft(t.constructor, $t.keyFrom(e));
    }
    if (arguments.length > 1) {
        i = {};
        decorator(t, e);
        return;
    } else if (isString(t)) {
        i = {};
        return decorator;
    }
    i = t === void 0 ? {} : t;
    return decorator;
}

function isBindableAnnotation(t) {
    return t.startsWith(Vt);
}

const Vt = /*@__PURE__*/ Dt("bindable");

const $t = at({
    name: Vt,
    keyFrom: t => `${Vt}:${t}`,
    from(t, ...e) {
        const i = {};
        const s = Array.isArray;
        function addName(e) {
            i[e] = BindableDefinition.create(e, t);
        }
        function addDescription(e, s) {
            i[e] = s instanceof BindableDefinition ? s : BindableDefinition.create(e, t, s);
        }
        function addList(t) {
            if (s(t)) {
                t.forEach(addName);
            } else if (t instanceof BindableDefinition) {
                i[t.name] = t;
            } else if (t !== void 0) {
                ut(t).forEach((e => addDescription(e, t[e])));
            }
        }
        e.forEach(addList);
        return i;
    },
    getAll(t) {
        const i = Vt.length + 1;
        const s = [];
        const n = e(t);
        let r = n.length;
        let l = 0;
        let a;
        let h;
        let c;
        let u;
        while (--r >= 0) {
            c = n[r];
            a = Ot(c).filter(isBindableAnnotation);
            h = a.length;
            for (u = 0; u < h; ++u) {
                s[l++] = It(Vt, c, a[u].slice(i));
            }
        }
        return s;
    }
});

class BindableDefinition {
    constructor(t, e, i, s, n, r) {
        this.attribute = t;
        this.callback = e;
        this.mode = i;
        this.primary = s;
        this.name = n;
        this.set = r;
    }
    static create(t, e, s = {}) {
        return new BindableDefinition(s.attribute ?? i(t), s.callback ?? `${t}Changed`, s.mode ?? Bt, s.primary ?? false, s.name ?? t, s.set ?? getInterceptor(t, e, s));
    }
}

function coercer(t, e, i) {
    Nt.define(t, e);
}

const Nt = {
    key: /*@__PURE__*/ Dt("coercer"),
    define(t, e) {
        Pt(Nt.key, t[e].bind(t), t);
    },
    for(t) {
        return It(Nt.key, t);
    }
};

function getInterceptor(t, e, i = {}) {
    const n = i.type ?? T.get("design:type", e, t) ?? null;
    if (n == null) {
        return s;
    }
    let r;
    switch (n) {
      case Number:
      case Boolean:
      case String:
      case BigInt:
        r = n;
        break;

      default:
        {
            const t = n.coerce;
            r = typeof t === "function" ? t.bind(n) : Nt.for(n) ?? s;
            break;
        }
    }
    return r === s ? r : createCoercer(r, i.nullable);
}

function createCoercer(t, e) {
    return function(i, s) {
        if (!s?.enableCoercion) return i;
        return (e ?? (s?.coerceNullish ?? false ? false : true)) && i == null ? i : t(i, s);
    };
}

const resource = t => l(((t, e, i) => i.has(t, false) ? i.get(t) : i.root.get(t)))(t);

const optionalResource = t => l(((t, e, i) => i.has(t, false) ? i.get(t) : i.root.has(t, false) ? i.root.get(t) : void 0))(t);

const allResources = t => l(((t, e, i) => {
    if (i.root === i) {
        return i.getAll(t, false);
    }
    return i.has(t, false) ? i.getAll(t, false).concat(i.root.getAll(t, false)) : i.root.getAll(t, false);
}))(t);

const Wt = n.createInterface;

const jt = r.singleton;

const zt = r.aliasTo;

const Ut = r.instance;

r.callback;

const Gt = r.transient;

const registerResolver = (t, e, i) => t.registerResolver(e, i);

function alias(...t) {
    return function(e) {
        const i = Dt("aliases");
        const s = It(i, e);
        if (s === void 0) {
            Pt(i, t, e);
        } else {
            s.push(...t);
        }
    };
}

function registerAliases(t, e, i, s) {
    for (let n = 0, l = t.length; n < l; ++n) {
        r.aliasTo(i, e.keyFrom(t[n])).register(s);
    }
}

const createMappedError = (t, ...e) => new Error(`AUR${rt(t).padStart(4, "0")}:${e.map(rt)}`);

function bindingBehavior(t) {
    return function(e) {
        return Xt.define(t, e);
    };
}

class BindingBehaviorDefinition {
    constructor(t, e, i, s) {
        this.Type = t;
        this.name = e;
        this.aliases = i;
        this.key = s;
    }
    static create(t, e) {
        let i;
        let s;
        if (isString(t)) {
            i = t;
            s = {
                name: i
            };
        } else {
            i = t.name;
            s = t;
        }
        return new BindingBehaviorDefinition(e, a(getBehaviorAnnotation(e, "name"), i), h(getBehaviorAnnotation(e, "aliases"), s.aliases, e.aliases), Xt.keyFrom(i));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        if (!t.has(i, false)) {
            t.register(jt(i, e), zt(i, e), ...s.map((t => zt(e, Xt.keyFrom(t)))));
        }
    }
}

const Kt = /*@__PURE__*/ qt("binding-behavior");

const getBehaviorAnnotation = (t, e) => It(Dt(e), t);

const Xt = at({
    name: Kt,
    keyFrom(t) {
        return `${Kt}:${t}`;
    },
    isType(t) {
        return isFunction(t) && Et(Kt, t);
    },
    define(t, e) {
        const i = BindingBehaviorDefinition.create(t, e);
        Pt(Kt, i, i.Type);
        Pt(Kt, i, i);
        Ht(e, Kt);
        return i.Type;
    },
    getDefinition(t) {
        const e = It(Kt, t);
        if (e === void 0) {
            throw createMappedError(151, t);
        }
        return e;
    },
    annotate(t, e, i) {
        Pt(Dt(e), i, t);
    },
    getAnnotation: getBehaviorAnnotation
});

const Qt = new Map;

class BindingModeBehavior {
    bind(t, e) {
        Qt.set(e, e.mode);
        e.mode = this.mode;
    }
    unbind(t, e) {
        e.mode = Qt.get(e);
        Qt.delete(e);
    }
}

class OneTimeBindingBehavior extends BindingModeBehavior {
    get mode() {
        return At;
    }
}

class ToViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return Bt;
    }
}

class FromViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return St;
    }
}

class TwoWayBindingBehavior extends BindingModeBehavior {
    get mode() {
        return _t;
    }
}

bindingBehavior("oneTime")(OneTimeBindingBehavior);

bindingBehavior("toView")(ToViewBindingBehavior);

bindingBehavior("fromView")(FromViewBindingBehavior);

bindingBehavior("twoWay")(TwoWayBindingBehavior);

const Yt = new WeakMap;

const Zt = 200;

class DebounceBindingBehavior {
    constructor() {
        this.p = c(u);
    }
    bind(t, e, i, s) {
        const n = {
            type: "debounce",
            delay: i ?? Zt,
            now: this.p.performanceNow,
            queue: this.p.taskQueue,
            signals: isString(s) ? [ s ] : s ?? f
        };
        const r = e.limit?.(n);
        if (r == null) ; else {
            Yt.set(e, r);
        }
    }
    unbind(t, e) {
        Yt.get(e)?.dispose();
        Yt.delete(e);
    }
}

bindingBehavior("debounce")(DebounceBindingBehavior);

class SignalBindingBehavior {
    constructor() {
        this.i = new Map;
        this.u = c(P);
    }
    bind(t, e, ...i) {
        if (!("handleChange" in e)) {
            throw createMappedError(817);
        }
        if (i.length === 0) {
            throw createMappedError(818);
        }
        this.i.set(e, i);
        let s;
        for (s of i) {
            addSignalListener(this.u, s, e);
        }
    }
    unbind(t, e) {
        const i = this.i.get(e);
        this.i.delete(e);
        let s;
        for (s of i) {
            removeSignalListener(this.u, s, e);
        }
    }
}

bindingBehavior("signal")(SignalBindingBehavior);

const Jt = new WeakMap;

const te = 200;

class ThrottleBindingBehavior {
    constructor() {
        ({performanceNow: this.C, taskQueue: this.A} = c(u));
    }
    bind(t, e, i, s) {
        const n = {
            type: "throttle",
            delay: i ?? te,
            now: this.C,
            queue: this.A,
            signals: isString(s) ? [ s ] : s ?? f
        };
        const r = e.limit?.(n);
        if (r == null) ; else {
            Jt.set(e, r);
        }
    }
    unbind(t, e) {
        Jt.get(e)?.dispose();
        Jt.delete(e);
    }
}

bindingBehavior("throttle")(ThrottleBindingBehavior);

const ee = /*@__PURE__*/ Wt("IAppTask");

class $AppTask {
    constructor(t, e, i) {
        this.c = void 0;
        this.slot = t;
        this.k = e;
        this.cb = i;
    }
    register(t) {
        return this.c = t.register(Ut(ee, this));
    }
    run() {
        const t = this.k;
        const e = this.cb;
        return t === null ? e() : e(this.c.get(t));
    }
}

const ie = at({
    creating: createAppTaskSlotHook("creating"),
    hydrating: createAppTaskSlotHook("hydrating"),
    hydrated: createAppTaskSlotHook("hydrated"),
    activating: createAppTaskSlotHook("activating"),
    activated: createAppTaskSlotHook("activated"),
    deactivating: createAppTaskSlotHook("deactivating"),
    deactivated: createAppTaskSlotHook("deactivated")
});

function createAppTaskSlotHook(t) {
    function appTaskFactory(e, i) {
        if (isFunction(i)) {
            return new $AppTask(t, e, i);
        }
        return new $AppTask(t, null, e);
    }
    return appTaskFactory;
}

const se = u;

function watch(t, e) {
    if (t == null) {
        throw createMappedError(772);
    }
    return function decorator(i, s, n) {
        const r = s == null;
        const l = r ? i : i.constructor;
        const a = new WatchDefinition(t, r ? e : n.value);
        if (r) {
            if (!isFunction(e) && (e == null || !(e in l.prototype))) {
                throw createMappedError(773, `${rt(e)}@${l.name}}`);
            }
        } else if (!isFunction(n?.value)) {
            throw createMappedError(774, s);
        }
        oe.add(l, a);
        if (isAttributeType(l)) {
            getAttributeDefinition(l).watches.push(a);
        }
        if (isElementType(l)) {
            getElementDefinition(l).watches.push(a);
        }
    };
}

class WatchDefinition {
    constructor(t, e) {
        this.expression = t;
        this.callback = e;
    }
}

const ne = f;

const re = Dt("watch");

const oe = at({
    name: re,
    add(t, e) {
        let i = It(re, t);
        if (i == null) {
            Pt(re, i = [], t);
        }
        i.push(e);
    },
    getAnnotation(t) {
        return It(re, t) ?? ne;
    }
});

const le = "element";

const ae = "attribute";

function customAttribute(t) {
    return function(e) {
        return defineAttribute(t, e);
    };
}

function templateController(t) {
    return function(e) {
        return defineAttribute(isString(t) ? {
            isTemplateController: true,
            name: t
        } : {
            isTemplateController: true,
            ...t
        }, e);
    };
}

class CustomAttributeDefinition {
    get type() {
        return ae;
    }
    constructor(t, e, i, s, n, r, l, a, h, c) {
        this.Type = t;
        this.name = e;
        this.aliases = i;
        this.key = s;
        this.defaultBindingMode = n;
        this.isTemplateController = r;
        this.bindables = l;
        this.noMultiBindings = a;
        this.watches = h;
        this.dependencies = c;
    }
    static create(t, e) {
        let i;
        let s;
        if (isString(t)) {
            i = t;
            s = {
                name: i
            };
        } else {
            i = t.name;
            s = t;
        }
        return new CustomAttributeDefinition(e, a(getAttributeAnnotation(e, "name"), i), h(getAttributeAnnotation(e, "aliases"), s.aliases, e.aliases), getAttributeKeyFrom(i), a(getAttributeAnnotation(e, "defaultBindingMode"), s.defaultBindingMode, e.defaultBindingMode, Bt), a(getAttributeAnnotation(e, "isTemplateController"), s.isTemplateController, e.isTemplateController, false), $t.from(e, ...$t.getAll(e), getAttributeAnnotation(e, "bindables"), e.bindables, s.bindables), a(getAttributeAnnotation(e, "noMultiBindings"), s.noMultiBindings, e.noMultiBindings, false), h(oe.getAnnotation(e), e.watches), h(getAttributeAnnotation(e, "dependencies"), s.dependencies, e.dependencies));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        if (!t.has(i, false)) {
            t.register(Gt(i, e), zt(i, e), ...s.map((t => zt(e, ce.keyFrom(t)))));
        }
    }
    toString() {
        return `au:ca:${this.name}`;
    }
}

const he = qt("custom-attribute");

const getAttributeKeyFrom = t => `${he}:${t}`;

const getAttributeAnnotation = (t, e) => It(Dt(e), t);

const isAttributeType = t => isFunction(t) && Et(he, t);

const findAttributeControllerFor = (t, e) => getRef(t, getAttributeKeyFrom(e)) ?? void 0;

const defineAttribute = (t, e) => {
    const i = CustomAttributeDefinition.create(t, e);
    Pt(he, i, i.Type);
    Pt(he, i, i);
    Ht(e, he);
    return i.Type;
};

const getAttributeDefinition = t => {
    const e = It(he, t);
    if (e === void 0) {
        throw createMappedError(759, t);
    }
    return e;
};

const ce = at({
    name: he,
    keyFrom: getAttributeKeyFrom,
    isType: isAttributeType,
    for: findAttributeControllerFor,
    define: defineAttribute,
    getDefinition: getAttributeDefinition,
    annotate(t, e, i) {
        Pt(Dt(e), i, t);
    },
    getAnnotation: getAttributeAnnotation
});

const ue = /*@__PURE__*/ Wt("ILifecycleHooks");

class LifecycleHooksEntry {
    constructor(t, e) {
        this.definition = t;
        this.instance = e;
    }
}

class LifecycleHooksDefinition {
    constructor(t, e) {
        this.Type = t;
        this.propertyNames = e;
    }
    static create(t, e) {
        const i = new Set;
        let s = e.prototype;
        while (s !== ot) {
            for (const t of ct(s)) {
                if (t !== "constructor" && !t.startsWith("_")) {
                    i.add(t);
                }
            }
            s = Object.getPrototypeOf(s);
        }
        return new LifecycleHooksDefinition(e, i);
    }
    register(t) {
        jt(ue, this.Type).register(t);
    }
}

const fe = new WeakMap;

const de = Dt("lifecycle-hooks");

const me = at({
    name: de,
    define(t, e) {
        const i = LifecycleHooksDefinition.create(t, e);
        Pt(de, i, e);
        Ht(e, de);
        return i.Type;
    },
    resolve(t) {
        let e = fe.get(t);
        if (e === void 0) {
            fe.set(t, e = new LifecycleHooksLookupImpl);
            const i = t.root;
            const s = i.id === t.id ? t.getAll(ue) : t.has(ue, false) ? i.getAll(ue).concat(t.getAll(ue)) : i.getAll(ue);
            let n;
            let r;
            let l;
            let a;
            let h;
            for (n of s) {
                r = It(de, n.constructor);
                l = new LifecycleHooksEntry(r, n);
                for (a of r.propertyNames) {
                    h = e[a];
                    if (h === void 0) {
                        e[a] = [ l ];
                    } else {
                        h.push(l);
                    }
                }
            }
        }
        return e;
    }
});

class LifecycleHooksLookupImpl {}

function lifecycleHooks() {
    return function decorator(t) {
        return me.define({}, t);
    };
}

function valueConverter(t) {
    return function(e) {
        return pe.define(t, e);
    };
}

class ValueConverterDefinition {
    constructor(t, e, i, s) {
        this.Type = t;
        this.name = e;
        this.aliases = i;
        this.key = s;
    }
    static create(t, e) {
        let i;
        let s;
        if (isString(t)) {
            i = t;
            s = {
                name: i
            };
        } else {
            i = t.name;
            s = t;
        }
        return new ValueConverterDefinition(e, a(getConverterAnnotation(e, "name"), i), h(getConverterAnnotation(e, "aliases"), s.aliases, e.aliases), pe.keyFrom(i));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        if (!t.has(i, false)) {
            t.register(jt(i, e), zt(i, e), ...s.map((t => zt(e, pe.keyFrom(t)))));
        }
    }
}

const ge = qt("value-converter");

const getConverterAnnotation = (t, e) => It(Dt(e), t);

const pe = at({
    name: ge,
    keyFrom: t => `${ge}:${t}`,
    isType(t) {
        return isFunction(t) && Et(ge, t);
    },
    define(t, e) {
        const i = ValueConverterDefinition.create(t, e);
        Pt(ge, i, i.Type);
        Pt(ge, i, i);
        Ht(e, ge);
        return i.Type;
    },
    getDefinition(t) {
        const e = It(ge, t);
        if (e === void 0) {
            throw createMappedError(152, t);
        }
        return e;
    },
    annotate(t, e, i) {
        Pt(Dt(e), i, t);
    },
    getAnnotation: getConverterAnnotation
});

class BindingTargetSubscriber {
    constructor(t, e) {
        this.v = void 0;
        this.b = t;
        this.B = e;
    }
    flush() {
        this.b.updateSource(this.v);
    }
    handleChange(t, e) {
        const i = this.b;
        if (t !== L(i.ast, i.s, i, null)) {
            this.v = t;
            this.B.add(this);
        }
    }
}

const mixinUseScope = t => {
    defineHiddenProp(t.prototype, "useScope", useScope);
};

const mixinAstEvaluator = (t, e = true) => i => {
    const s = i.prototype;
    if (t != null) {
        mt(s, "strict", {
            enumerable: true,
            get: function() {
                return t;
            }
        });
    }
    mt(s, "strictFnCall", {
        enumerable: true,
        get: function() {
            return e;
        }
    });
    defineHiddenProp(s, "get", evaluatorGet);
    defineHiddenProp(s, "getSignaler", evaluatorGetSignaler);
    defineHiddenProp(s, "getConverter", evaluatorGetConverter);
    defineHiddenProp(s, "getBehavior", evaluatorGetBehavior);
};

const ve = new WeakMap;

class ResourceLookup {}

const be = /*@__PURE__*/ Wt("IFlushQueue", (t => t.singleton(FlushQueue)));

class FlushQueue {
    constructor() {
        this._ = false;
        this.R = new Set;
    }
    get count() {
        return this.R.size;
    }
    add(t) {
        this.R.add(t);
        if (this._) {
            return;
        }
        this._ = true;
        try {
            this.R.forEach(flushItem);
        } finally {
            this._ = false;
        }
    }
    clear() {
        this.R.clear();
        this._ = false;
    }
}

function useScope(t) {
    this.s = t;
}

function evaluatorGet(t) {
    return this.l.get(t);
}

function evaluatorGetSignaler() {
    return this.l.root.get(P);
}

function evaluatorGetConverter(t) {
    const e = pe.keyFrom(t);
    let i = ve.get(this);
    if (i == null) {
        ve.set(this, i = new ResourceLookup);
    }
    return i[e] ?? (i[e] = this.l.get(resource(e)));
}

function evaluatorGetBehavior(t) {
    const e = Xt.keyFrom(t);
    let i = ve.get(this);
    if (i == null) {
        ve.set(this, i = new ResourceLookup);
    }
    return i[e] ?? (i[e] = this.l.get(resource(e)));
}

function flushItem(t, e, i) {
    i.delete(t);
    t.flush();
}

const xe = new WeakSet;

const mixingBindingLimited = (t, e) => {
    defineHiddenProp(t.prototype, "limit", (function(t) {
        if (xe.has(this)) {
            throw createMappedError(9996);
        }
        xe.add(this);
        const i = e(this, t);
        const s = t.signals;
        const n = s.length > 0 ? this.get(P) : null;
        const r = this[i];
        const callOriginal = (...t) => r.call(this, ...t);
        const l = t.type === "debounce" ? debounced(t, callOriginal, this) : throttled(t, callOriginal, this);
        const a = n ? {
            handleChange: l.flush
        } : null;
        this[i] = l;
        if (n) {
            s.forEach((t => addSignalListener(n, t, a)));
        }
        return {
            dispose: () => {
                if (n) {
                    s.forEach((t => removeSignalListener(n, t, a)));
                }
                xe.delete(this);
                l.dispose();
                delete this[i];
            }
        };
    }));
};

const debounced = (t, e, i) => {
    let s;
    let n;
    let r;
    let l = false;
    const a = t.queue;
    const callOriginalCallback = () => e(r);
    const fn = e => {
        r = e;
        if (i.isBound) {
            n = s;
            s = a.queueTask(callOriginalCallback, {
                delay: t.delay,
                reusable: false
            });
            n?.cancel();
        } else {
            callOriginalCallback();
        }
    };
    const h = fn.dispose = () => {
        n?.cancel();
        s?.cancel();
        n = s = void 0;
    };
    fn.flush = () => {
        l = s?.status === xt;
        h();
        if (l) {
            callOriginalCallback();
        }
    };
    return fn;
};

const throttled = (t, e, i) => {
    let s;
    let n;
    let r = 0;
    let l = 0;
    let a;
    let h = false;
    const c = t.queue;
    const now = () => t.now();
    const callOriginalCallback = () => e(a);
    const fn = e => {
        a = e;
        if (i.isBound) {
            l = now() - r;
            n = s;
            if (l > t.delay) {
                r = now();
                callOriginalCallback();
            } else {
                s = c.queueTask((() => {
                    r = now();
                    callOriginalCallback();
                }), {
                    delay: t.delay - l,
                    reusable: false
                });
            }
            n?.cancel();
        } else {
            callOriginalCallback();
        }
    };
    const u = fn.dispose = () => {
        n?.cancel();
        s?.cancel();
        n = s = void 0;
    };
    fn.flush = () => {
        h = s?.status === xt;
        u();
        if (h) {
            callOriginalCallback();
        }
    };
    return fn;
};

const we = {
    reusable: false,
    preempt: true
};

class AttributeBinding {
    constructor(t, e, i, s, n, r, l, a, h) {
        this.targetAttribute = l;
        this.targetProperty = a;
        this.mode = h;
        this.isBound = false;
        this.s = void 0;
        this.T = null;
        this.v = void 0;
        this.boundFn = false;
        this.l = e;
        this.ast = n;
        this.I = t;
        this.target = r;
        this.oL = i;
        this.A = s;
    }
    updateTarget(t) {
        const e = this.target;
        const i = this.targetAttribute;
        const s = this.targetProperty;
        switch (i) {
          case "class":
            e.classList.toggle(s, !!t);
            break;

          case "style":
            {
                let i = "";
                let n = rt(t);
                if (isString(n) && n.includes("!important")) {
                    i = "important";
                    n = n.replace("!important", "");
                }
                e.style.setProperty(s, n, i);
                break;
            }

          default:
            {
                if (t == null) {
                    e.removeAttribute(i);
                } else {
                    e.setAttribute(i, rt(t));
                }
            }
        }
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        let t;
        this.obs.version++;
        const e = L(this.ast, this.s, this, (this.mode & Bt) > 0 ? this : null);
        this.obs.clear();
        if (e !== this.v) {
            this.v = e;
            const i = this.I.state !== Zi;
            if (i) {
                t = this.T;
                this.T = this.A.queueTask((() => {
                    this.T = null;
                    this.updateTarget(e);
                }), we);
                t?.cancel();
            } else {
                this.updateTarget(e);
            }
        }
    }
    handleCollectionChange() {
        this.handleChange();
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) {
                return;
            }
            this.unbind();
        }
        this.s = t;
        D(this.ast, t, this);
        if (this.mode & (Bt | At)) {
            this.updateTarget(this.v = L(this.ast, t, this, (this.mode & Bt) > 0 ? this : null));
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        q(this.ast, this.s, this);
        this.s = void 0;
        this.v = void 0;
        this.T?.cancel();
        this.T = null;
        this.obs.clearAll();
    }
}

mixinUseScope(AttributeBinding);

mixingBindingLimited(AttributeBinding, (() => "updateTarget"));

M(AttributeBinding);

mixinAstEvaluator(true)(AttributeBinding);

const ye = {
    reusable: false,
    preempt: true
};

class InterpolationBinding {
    constructor(t, e, i, s, n, r, l, a) {
        this.ast = n;
        this.target = r;
        this.targetProperty = l;
        this.mode = a;
        this.isBound = false;
        this.s = void 0;
        this.T = null;
        this.I = t;
        this.oL = i;
        this.A = s;
        this.P = i.getAccessor(r, l);
        const h = n.expressions;
        const c = this.partBindings = Array(h.length);
        const u = h.length;
        let f = 0;
        for (;u > f; ++f) {
            c[f] = new InterpolationPartBinding(h[f], r, l, e, i, this);
        }
    }
    L() {
        this.updateTarget();
    }
    updateTarget() {
        const t = this.partBindings;
        const e = this.ast.parts;
        const i = t.length;
        let s = "";
        let n = 0;
        if (i === 1) {
            s = e[0] + t[0].v + e[1];
        } else {
            s = e[0];
            for (;i > n; ++n) {
                s += t[n].v + e[n + 1];
            }
        }
        const r = this.P;
        const l = this.I.state !== Zi && (r.type & Ct) > 0;
        let a;
        if (l) {
            a = this.T;
            this.T = this.A.queueTask((() => {
                this.T = null;
                r.setValue(s, this.target, this.targetProperty);
            }), ye);
            a?.cancel();
            a = null;
        } else {
            r.setValue(s, this.target, this.targetProperty);
        }
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) {
                return;
            }
            this.unbind();
        }
        this.s = t;
        const e = this.partBindings;
        const i = e.length;
        let s = 0;
        for (;i > s; ++s) {
            e[s].bind(t);
        }
        this.updateTarget();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.s = void 0;
        const t = this.partBindings;
        const e = t.length;
        let i = 0;
        for (;e > i; ++i) {
            t[i].unbind();
        }
        this.T?.cancel();
        this.T = null;
    }
}

class InterpolationPartBinding {
    constructor(t, e, i, s, n, r) {
        this.ast = t;
        this.target = e;
        this.targetProperty = i;
        this.owner = r;
        this.mode = Bt;
        this.task = null;
        this.isBound = false;
        this.v = "";
        this.boundFn = false;
        this.l = s;
        this.oL = n;
    }
    updateTarget() {
        this.owner.L();
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = L(this.ast, this.s, this, (this.mode & Bt) > 0 ? this : null);
        this.obs.clear();
        if (t != this.v) {
            this.v = t;
            if (isArray(t)) {
                this.observeCollection(t);
            }
            this.updateTarget();
        }
    }
    handleCollectionChange() {
        this.updateTarget();
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) {
                return;
            }
            this.unbind();
        }
        this.s = t;
        D(this.ast, t, this);
        this.v = L(this.ast, this.s, this, (this.mode & Bt) > 0 ? this : null);
        if (isArray(this.v)) {
            this.observeCollection(this.v);
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        q(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

mixinUseScope(InterpolationPartBinding);

mixingBindingLimited(InterpolationPartBinding, (() => "updateTarget"));

M(InterpolationPartBinding);

mixinAstEvaluator(true)(InterpolationPartBinding);

const ke = {
    reusable: false,
    preempt: true
};

class ContentBinding {
    constructor(t, e, i, s, n, r, l) {
        this.p = n;
        this.ast = r;
        this.target = l;
        this.isBound = false;
        this.mode = Bt;
        this.T = null;
        this.v = "";
        this.M = false;
        this.boundFn = false;
        this.strict = true;
        this.l = e;
        this.I = t;
        this.oL = i;
        this.A = s;
    }
    updateTarget(t) {
        const e = this.target;
        const i = this.v;
        this.v = t;
        if (this.M) {
            i.parentNode?.removeChild(i);
            this.M = false;
        }
        if (t instanceof this.p.Node) {
            e.parentNode?.insertBefore(t, e);
            t = "";
            this.M = true;
        }
        e.textContent = rt(t ?? "");
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = L(this.ast, this.s, this, (this.mode & Bt) > 0 ? this : null);
        this.obs.clear();
        if (t === this.v) {
            this.T?.cancel();
            this.T = null;
            return;
        }
        const e = this.I.state !== Zi;
        if (e) {
            this.q(t);
        } else {
            this.updateTarget(t);
        }
    }
    handleCollectionChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = this.v = L(this.ast, this.s, this, (this.mode & Bt) > 0 ? this : null);
        this.obs.clear();
        if (isArray(t)) {
            this.observeCollection(t);
        }
        const e = this.I.state !== Zi;
        if (e) {
            this.q(t);
        } else {
            this.updateTarget(t);
        }
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) {
                return;
            }
            this.unbind();
        }
        this.s = t;
        D(this.ast, t, this);
        const e = this.v = L(this.ast, this.s, this, (this.mode & Bt) > 0 ? this : null);
        if (isArray(e)) {
            this.observeCollection(e);
        }
        this.updateTarget(e);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        q(this.ast, this.s, this);
        if (this.M) {
            this.v.parentNode?.removeChild(this.v);
        }
        this.s = void 0;
        this.obs.clearAll();
        this.T?.cancel();
        this.T = null;
    }
    q(t) {
        const e = this.T;
        this.T = this.A.queueTask((() => {
            this.T = null;
            this.updateTarget(t);
        }), ke);
        e?.cancel();
    }
}

mixinUseScope(ContentBinding);

mixingBindingLimited(ContentBinding, (() => "updateTarget"));

M()(ContentBinding);

mixinAstEvaluator(void 0, false)(ContentBinding);

class LetBinding {
    constructor(t, e, i, s, n = false) {
        this.ast = i;
        this.targetProperty = s;
        this.isBound = false;
        this.s = void 0;
        this.target = null;
        this.boundFn = false;
        this.l = t;
        this.oL = e;
        this.H = n;
    }
    updateTarget() {
        this.target[this.targetProperty] = this.v;
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        this.v = L(this.ast, this.s, this, this);
        this.obs.clear();
        this.updateTarget();
    }
    handleCollectionChange() {
        this.handleChange();
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) {
                return;
            }
            this.unbind();
        }
        this.s = t;
        this.target = this.H ? t.bindingContext : t.overrideContext;
        D(this.ast, t, this);
        this.v = L(this.ast, this.s, this, this);
        this.updateTarget();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        q(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

mixinUseScope(LetBinding);

mixingBindingLimited(LetBinding, (() => "updateTarget"));

M(LetBinding);

mixinAstEvaluator(true)(LetBinding);

class PropertyBinding {
    constructor(t, e, i, s, n, r, l, a) {
        this.ast = n;
        this.target = r;
        this.targetProperty = l;
        this.mode = a;
        this.isBound = false;
        this.s = void 0;
        this.P = void 0;
        this.T = null;
        this.F = null;
        this.boundFn = false;
        this.l = e;
        this.I = t;
        this.A = s;
        this.oL = i;
    }
    updateTarget(t) {
        this.P.setValue(t, this.target, this.targetProperty);
    }
    updateSource(t) {
        H(this.ast, this.s, this, t);
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = L(this.ast, this.s, this, (this.mode & Bt) > 0 ? this : null);
        this.obs.clear();
        const e = this.I.state !== Zi && (this.P.type & Ct) > 0;
        if (e) {
            Ce = this.T;
            this.T = this.A.queueTask((() => {
                this.updateTarget(t);
                this.T = null;
            }), Ae);
            Ce?.cancel();
            Ce = null;
        } else {
            this.updateTarget(t);
        }
    }
    handleCollectionChange() {
        this.handleChange();
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) {
                return;
            }
            this.unbind();
        }
        this.s = t;
        D(this.ast, t, this);
        const e = this.oL;
        const i = this.mode;
        let s = this.P;
        if (!s) {
            if (i & St) {
                s = e.getObserver(this.target, this.targetProperty);
            } else {
                s = e.getAccessor(this.target, this.targetProperty);
            }
            this.P = s;
        }
        const n = (i & Bt) > 0;
        if (i & (Bt | At)) {
            this.updateTarget(L(this.ast, this.s, this, n ? this : null));
        }
        if (i & St) {
            s.subscribe(this.F ?? (this.F = new BindingTargetSubscriber(this, this.l.get(be))));
            if (!n) {
                this.updateSource(s.getValue(this.target, this.targetProperty));
            }
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        q(this.ast, this.s, this);
        this.s = void 0;
        if (this.F) {
            this.P.unsubscribe(this.F);
            this.F = null;
        }
        this.T?.cancel();
        this.T = null;
        this.obs.clearAll();
    }
    useTargetObserver(t) {
        this.P?.unsubscribe(this);
        (this.P = t).subscribe(this);
    }
    useTargetSubscriber(t) {
        if (this.F != null) {
            throw createMappedError(9995);
        }
        this.F = t;
    }
}

mixinUseScope(PropertyBinding);

mixingBindingLimited(PropertyBinding, (t => t.mode & St ? "updateSource" : "updateTarget"));

M(PropertyBinding);

mixinAstEvaluator(true, false)(PropertyBinding);

let Ce = null;

const Ae = {
    reusable: false,
    preempt: true
};

class RefBinding {
    constructor(t, e, i) {
        this.ast = e;
        this.target = i;
        this.isBound = false;
        this.s = void 0;
        this.l = t;
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) {
                return;
            }
            this.unbind();
        }
        this.s = t;
        D(this.ast, t, this);
        H(this.ast, this.s, this, this.target);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        if (L(this.ast, this.s, this, null) === this.target) {
            H(this.ast, this.s, this, null);
        }
        q(this.ast, this.s, this);
        this.s = void 0;
    }
}

mixinAstEvaluator(false)(RefBinding);

class ListenerBindingOptions {
    constructor(t, e = false) {
        this.prevent = t;
        this.capture = e;
    }
}

class ListenerBinding {
    constructor(t, e, i, s, n, r) {
        this.ast = e;
        this.target = i;
        this.targetEvent = s;
        this.isBound = false;
        this.self = false;
        this.boundFn = true;
        this.O = null;
        this.l = t;
        this.V = n;
        this.O = r;
    }
    callSource(t) {
        const e = this.s.overrideContext;
        e.$event = t;
        let i = L(this.ast, this.s, this, null);
        delete e.$event;
        if (isFunction(i)) {
            i = i(t);
        }
        if (i !== true && this.V.prevent) {
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
        if (this.O?.(t) !== false) {
            this.callSource(t);
        }
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) {
                return;
            }
            this.unbind();
        }
        this.s = t;
        D(this.ast, t, this);
        this.target.addEventListener(this.targetEvent, this, this.V);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        q(this.ast, this.s, this);
        this.s = void 0;
        this.target.removeEventListener(this.targetEvent, this, this.V);
    }
}

mixinUseScope(ListenerBinding);

mixingBindingLimited(ListenerBinding, (() => "callSource"));

mixinAstEvaluator(true, true)(ListenerBinding);

const Be = /*@__PURE__*/ Wt("IEventModifier");

const Se = /*@__PURE__*/ Wt("IKeyMapping", (t => t.instance({
    meta: at([ "ctrl", "alt", "shift", "meta" ]),
    keys: {
        escape: "Escape",
        enter: "Enter",
        space: "Space",
        tab: "tab",
        ...Array.from({
            length: 25
        }).reduce(((t, e, i) => {
            let s = String.fromCharCode(i + 65);
            t[i + 65] = s;
            s = String.fromCharCode(i + 97);
            t[i + 97] = t[s] = s;
            return t;
        }), {})
    }
})));

class ModifiedMouseEventHandler {
    constructor() {
        this.type = [ "click", "mousedown", "mousemove", "mouseup", "dblclick", "contextmenu" ];
        this.$ = c(Se);
        this.N = [ "left", "middle", "right" ];
    }
    static register(t) {
        t.register(jt(Be, ModifiedMouseEventHandler));
    }
    getHandler(t) {
        const e = t.split(/[:+.]/);
        return t => {
            let i = false;
            let s = false;
            let n;
            for (n of e) {
                switch (n) {
                  case "prevent":
                    i = true;
                    continue;

                  case "stop":
                    s = true;
                    continue;

                  case "left":
                  case "middle":
                  case "right":
                    if (t.button !== this.N.indexOf(n)) return false;
                    continue;
                }
                if (this.$.meta.includes(n) && t[`${n}Key`] !== true) {
                    return false;
                }
            }
            if (i) t.preventDefault();
            if (s) t.stopPropagation();
            return true;
        };
    }
}

class ModifiedKeyboardEventHandler {
    constructor() {
        this.$ = c(Se);
        this.type = [ "keydown", "keyup" ];
    }
    static register(t) {
        t.register(jt(Be, ModifiedKeyboardEventHandler));
    }
    getHandler(t) {
        const e = t.split(/[:+.]/);
        return t => {
            let i = false;
            let s = false;
            let n;
            for (n of e) {
                switch (n) {
                  case "prevent":
                    i = true;
                    continue;

                  case "stop":
                    s = true;
                    continue;
                }
                if (this.$.meta.includes(n)) {
                    if (t[`${n}Key`] !== true) {
                        return false;
                    }
                    continue;
                }
                const e = this.$.keys[n];
                if (e !== t.key) {
                    return false;
                }
            }
            if (i) t.preventDefault();
            if (s) t.stopPropagation();
            return true;
        };
    }
}

const _e = /*@__PURE__*/ Wt("IEventModifierHandler", (t => t.instance({
    getHandler: () => null
})));

class EventModifier {
    constructor() {
        this.W = c(d(Be)).reduce(((t, e) => {
            const i = isArray(e.type) ? e.type : [ e.type ];
            i.forEach((i => t[i] = e));
            return t;
        }), {});
    }
    static register(t) {
        t.register(jt(_e, EventModifier));
    }
    getHandler(t, e) {
        return isString(e) ? this.W[t]?.getHandler(e) ?? null : null;
    }
}

const Re = {
    register(t) {
        t.register(EventModifier, ModifiedMouseEventHandler, ModifiedKeyboardEventHandler);
    }
};

const Te = /*@__PURE__*/ Wt("IViewFactory");

class ViewFactory {
    constructor(t, e) {
        this.isCaching = false;
        this.j = null;
        this.U = -1;
        this.name = e.name;
        this.container = t;
        this.def = e;
    }
    setCacheSize(t, e) {
        if (t) {
            if (t === "*") {
                t = ViewFactory.maxCacheSize;
            } else if (isString(t)) {
                t = parseInt(t, 10);
            }
            if (this.U === -1 || !e) {
                this.U = t;
            }
        }
        if (this.U > 0) {
            this.j = [];
        } else {
            this.j = null;
        }
        this.isCaching = this.U > 0;
    }
    canReturnToCache(t) {
        return this.j != null && this.j.length < this.U;
    }
    tryReturnToCache(t) {
        if (this.canReturnToCache(t)) {
            this.j.push(t);
            return true;
        }
        return false;
    }
    create(t) {
        const e = this.j;
        let i;
        if (e != null && e.length > 0) {
            i = e.pop();
            return i;
        }
        i = Controller.$view(this, t);
        return i;
    }
}

ViewFactory.maxCacheSize = 65535;

const Ie = "au-start";

const Ee = "au-end";

const createElement = (t, e) => t.document.createElement(e);

const createComment = (t, e) => t.document.createComment(e);

const createLocation = t => {
    const e = createComment(t, Ee);
    e.$start = createComment(t, Ie);
    return e;
};

const createText = (t, e) => t.document.createTextNode(e);

const insertBefore = (t, e, i) => t.insertBefore(e, i);

const insertManyBefore = (t, e, i) => {
    if (t === null) {
        return;
    }
    const s = i.length;
    let n = 0;
    while (s > n) {
        t.insertBefore(i[n], e);
        ++n;
    }
};

const appendToTemplate = (t, e) => t.content.appendChild(e);

const appendManyToTemplate = (t, e) => {
    const i = e.length;
    let s = 0;
    while (i > s) {
        t.content.appendChild(e[s]);
        ++s;
    }
};

const createMutationObserver = (t, e) => new t.ownerDocument.defaultView.MutationObserver(e);

const isElement = t => t.nodeType === 1;

const isTextNode = t => t.nodeType === 3;

const Pe = /*@__PURE__*/ Wt("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

const Le = /*@__PURE__*/ Wt("IAuSlotWatcher");

class AuSlotWatcherBinding {
    constructor(t, e, i, s) {
        this.G = new Set;
        this.K = f;
        this.isBound = false;
        this.cb = (this.o = t)[e];
        this.slotName = i;
        this.X = s;
    }
    bind() {
        this.isBound = true;
    }
    unbind() {
        this.isBound = false;
    }
    getValue() {
        return this.K;
    }
    watch(t) {
        if (!this.G.has(t)) {
            this.G.add(t);
            t.subscribe(this);
        }
    }
    unwatch(t) {
        if (this.G.delete(t)) {
            t.unsubscribe(this);
        }
    }
    handleSlotChange(t, e) {
        if (!this.isBound) {
            return;
        }
        const i = this.K;
        const s = [];
        let n;
        let r;
        for (n of this.G) {
            for (r of n === t ? e : n.nodes) {
                if (this.X === "*" || isElement(r) && r.matches(this.X)) {
                    s[s.length] = r;
                }
            }
        }
        if (s.length !== i.length || s.some(((t, e) => t !== i[e]))) {
            this.K = s;
            this.cb?.call(this.o, s);
            this.subs.notify(s, i);
        }
    }
    get() {
        throw createMappedError(99, "get");
    }
}

class SlottedLifecycleHooks {
    constructor(t) {
        this.Y = t;
    }
    register(t) {
        Ut(ue, this).register(t);
    }
    hydrating(t, e) {
        const i = this.Y;
        const s = new AuSlotWatcherBinding(t, i.callback ?? `${rt(i.name)}Changed`, i.slotName ?? "default", i.query ?? "*");
        mt(t, i.name, {
            enumerable: true,
            configurable: true,
            get: ht((() => s.getValue()), {
                getObserver: () => s
            }),
            set: () => {}
        });
        Ut(Le, s).register(e.container);
        e.addBinding(s);
    }
}

function slotted(t, e) {
    if (!Me) {
        Me = true;
        F(AuSlotWatcherBinding);
        lifecycleHooks()(SlottedLifecycleHooks);
    }
    const i = "dependencies";
    function decorator(s, n, r) {
        const l = typeof t === "object" ? t : {
            query: t,
            slotName: e,
            name: ""
        };
        l.name = n;
        if (typeof s === "function" || typeof r?.value !== "undefined") {
            throw createMappedError(9990);
        }
        const a = s.constructor;
        let h = Cs.getAnnotation(a, i);
        if (h == null) {
            Cs.annotate(a, i, h = []);
        }
        h.push(new SlottedLifecycleHooks(l));
    }
    return decorator;
}

let Me = false;

class SpreadBinding {
    static create(t, e, i, s, n, r, l, a) {
        const h = [];
        const c = s.renderers;
        const getHydrationContext = e => {
            let i = e;
            let s = t;
            while (s != null && i > 0) {
                s = s.parent;
                --i;
            }
            if (s == null) {
                throw createMappedError(9999);
            }
            return s;
        };
        const renderSpreadInstruction = t => {
            const s = getHydrationContext(t);
            const u = new SpreadBinding(s);
            const d = n.compileSpread(s.controller.definition, s.instruction?.captures ?? f, s.controller.container, e, i);
            let m;
            for (m of d) {
                switch (m.type) {
                  case Je:
                    renderSpreadInstruction(t + 1);
                    break;

                  case ti:
                    c[m.instructions.type].render(u, findElementControllerFor(e), m.instructions, r, l, a);
                    break;

                  default:
                    c[m.type].render(u, e, m, r, l, a);
                }
            }
            h.push(u);
        };
        renderSpreadInstruction(0);
        return h;
    }
    get container() {
        return this.locator;
    }
    get definition() {
        return this.$controller.definition;
    }
    get state() {
        return this.$controller.state;
    }
    constructor(t) {
        this.isBound = false;
        this.Z = [];
        this.locator = (this.$controller = (this.J = t).controller).container;
    }
    get(t) {
        return this.locator.get(t);
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        const e = this.scope = this.J.controller.scope.parent ?? void 0;
        if (e == null) {
            throw createMappedError(9999);
        }
        this.Z.forEach((t => t.bind(e)));
    }
    unbind() {
        this.Z.forEach((t => t.unbind()));
        this.isBound = false;
    }
    addBinding(t) {
        this.Z.push(t);
    }
    addChild(t) {
        if (t.vmKind !== Xi) {
            throw createMappedError(9998);
        }
        this.$controller.addChild(t);
    }
}

const De = "ra";

const qe = "rb";

const He = "rc";

const Fe = "rd";

const Oe = "re";

const Ve = "rf";

const $e = "rg";

const Ne = "ri";

const We = "rj";

const je = "rk";

const ze = "rl";

const Ue = "ha";

const Ge = "hb";

const Ke = "hc";

const Xe = "hd";

const Qe = "he";

const Ye = "hf";

const Ze = "hg";

const Je = "hs";

const ti = "hp";

const ei = /*@__PURE__*/ at({
    hydrateElement: De,
    hydrateAttribute: qe,
    hydrateTemplateController: He,
    hydrateLetElement: Fe,
    setProperty: Oe,
    interpolation: Ve,
    propertyBinding: $e,
    letBinding: Ne,
    refBinding: We,
    iteratorBinding: je,
    multiAttr: ze,
    textBinding: Ue,
    listenerBinding: Ge,
    attributeBinding: Ke,
    stylePropertyBinding: Xe,
    setAttribute: Qe,
    setClassAttribute: Ye,
    setStyleAttribute: Ze,
    spreadBinding: Je,
    spreadElementProp: ti
});

const ii = /*@__PURE__*/ Wt("Instruction");

function isInstruction(t) {
    const e = t.type;
    return isString(e) && e.length === 2;
}

class InterpolationInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Ve;
    }
}

class PropertyBindingInstruction {
    constructor(t, e, i) {
        this.from = t;
        this.to = e;
        this.mode = i;
        this.type = $e;
    }
}

class IteratorBindingInstruction {
    constructor(t, e, i) {
        this.forOf = t;
        this.to = e;
        this.props = i;
        this.type = je;
    }
}

class RefBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = We;
    }
}

class SetPropertyInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = Oe;
    }
}

class MultiAttrInstruction {
    constructor(t, e, i) {
        this.value = t;
        this.to = e;
        this.command = i;
        this.type = ze;
    }
}

class HydrateElementInstruction {
    constructor(t, e, i, s, n, r) {
        this.res = t;
        this.alias = e;
        this.props = i;
        this.projections = s;
        this.containerless = n;
        this.captures = r;
        this.type = De;
        this.auSlot = null;
    }
}

class HydrateAttributeInstruction {
    constructor(t, e, i) {
        this.res = t;
        this.alias = e;
        this.props = i;
        this.type = qe;
    }
}

class HydrateTemplateController {
    constructor(t, e, i, s) {
        this.def = t;
        this.res = e;
        this.alias = i;
        this.props = s;
        this.type = He;
    }
}

class HydrateLetElementInstruction {
    constructor(t, e) {
        this.instructions = t;
        this.toBindingContext = e;
        this.type = Fe;
    }
}

class LetBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Ne;
    }
}

class TextBindingInstruction {
    constructor(t) {
        this.from = t;
        this.type = Ue;
    }
}

class ListenerBindingInstruction {
    constructor(t, e, i, s, n) {
        this.from = t;
        this.to = e;
        this.preventDefault = i;
        this.capture = s;
        this.modifier = n;
        this.type = Ge;
    }
}

class StylePropertyBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Xe;
    }
}

class SetAttributeInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = Qe;
    }
}

class SetClassAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = Ye;
    }
}

class SetStyleAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = Ze;
    }
}

class AttributeBindingInstruction {
    constructor(t, e, i) {
        this.attr = t;
        this.from = e;
        this.to = i;
        this.type = Ke;
    }
}

class SpreadBindingInstruction {
    constructor() {
        this.type = Je;
    }
}

class SpreadElementPropBindingInstruction {
    constructor(t) {
        this.instructions = t;
        this.type = ti;
    }
}

const si = /*@__PURE__*/ Wt("ITemplateCompiler");

const ni = /*@__PURE__*/ Wt("IRenderer");

function renderer(t) {
    return function decorator(e) {
        e.register = function(t) {
            jt(ni, this).register(t);
        };
        mt(e.prototype, "target", {
            configurable: true,
            get: function() {
                return t;
            }
        });
        return e;
    };
}

function ensureExpression(t, e, i) {
    if (isString(e)) {
        return t.parse(e, i);
    }
    return e;
}

function getTarget(t) {
    if (t.viewModel != null) {
        return t.viewModel;
    }
    return t;
}

function getRefTarget(t, e) {
    if (e === "element") {
        return t;
    }
    switch (e) {
      case "controller":
        return findElementControllerFor(t);

      case "view":
        throw createMappedError(750);

      case "component":
        return findElementControllerFor(t).viewModel;

      default:
        {
            const i = findAttributeControllerFor(t, e);
            if (i !== void 0) {
                return i.viewModel;
            }
            const s = findElementControllerFor(t, {
                name: e
            });
            if (s === void 0) {
                throw createMappedError(751, e);
            }
            return s.viewModel;
        }
    }
}

let ri = class SetPropertyRenderer {
    render(t, e, i) {
        const s = getTarget(e);
        if (s.$observers?.[i.to] !== void 0) {
            s.$observers[i.to].setValue(i.value);
        } else {
            s[i.to] = i.value;
        }
    }
};

ri = __decorate([ renderer(Oe) ], ri);

let oi = class CustomElementRenderer {
    constructor() {
        this.r = c(Ti);
    }
    render(t, e, i, s, n, r) {
        let l;
        let a;
        let h;
        let c;
        const u = i.res;
        const f = i.projections;
        const d = t.container;
        switch (typeof u) {
          case "string":
            l = d.find(Cs, u);
            if (l == null) {
                throw createMappedError(752, i, t);
            }
            break;

          default:
            l = u;
        }
        const g = i.containerless || l.containerless;
        const p = g ? convertToRenderLocation(e) : null;
        const v = createElementContainer(s, t, e, i, p, f == null ? void 0 : new AuSlotsInfo(ut(f)));
        a = l.Type;
        h = v.invoke(a);
        registerResolver(v, a, new m(l.key, h));
        c = Controller.$el(v, h, e, i, l, p);
        setRef(e, l.key, c);
        const b = this.r.renderers;
        const x = i.props;
        const w = x.length;
        let y = 0;
        let k;
        while (w > y) {
            k = x[y];
            b[k.type].render(t, c, k, s, n, r);
            ++y;
        }
        t.addChild(c);
    }
};

oi = __decorate([ renderer(De) ], oi);

let li = class CustomAttributeRenderer {
    constructor() {
        this.r = c(Ti);
    }
    render(t, e, i, s, n, r) {
        let l = t.container;
        let a;
        switch (typeof i.res) {
          case "string":
            a = l.find(ce, i.res);
            if (a == null) {
                throw createMappedError(753, i, t);
            }
            break;

          default:
            a = i.res;
        }
        const h = invokeAttribute(s, a, t, e, i, void 0, void 0);
        const c = Controller.$attr(h.ctn, h.vm, e, a);
        setRef(e, a.key, c);
        const u = this.r.renderers;
        const f = i.props;
        const d = f.length;
        let m = 0;
        let g;
        while (d > m) {
            g = f[m];
            u[g.type].render(t, c, g, s, n, r);
            ++m;
        }
        t.addChild(c);
    }
};

li = __decorate([ renderer(qe) ], li);

let ai = class TemplateControllerRenderer {
    constructor() {
        this.r = c(Ti);
    }
    render(t, e, i, s, n, r) {
        let l = t.container;
        let a;
        switch (typeof i.res) {
          case "string":
            a = l.find(ce, i.res);
            if (a == null) {
                throw createMappedError(754, i, t);
            }
            break;

          default:
            a = i.res;
        }
        const h = this.r.getViewFactory(i.def, l);
        const c = convertToRenderLocation(e);
        const u = invokeAttribute(s, a, t, e, i, h, c);
        const f = Controller.$attr(u.ctn, u.vm, e, a);
        setRef(c, a.key, f);
        u.vm.link?.(t, f, e, i);
        const d = this.r.renderers;
        const m = i.props;
        const g = m.length;
        let p = 0;
        let v;
        while (g > p) {
            v = m[p];
            d[v.type].render(t, f, v, s, n, r);
            ++p;
        }
        t.addChild(f);
    }
};

ai = __decorate([ renderer(He) ], ai);

let hi = class LetElementRenderer {
    render(t, e, i, s, n, r) {
        e.remove();
        const l = i.instructions;
        const a = i.toBindingContext;
        const h = t.container;
        const c = l.length;
        let u;
        let f;
        let d = 0;
        while (c > d) {
            u = l[d];
            f = ensureExpression(n, u.from, bt);
            t.addBinding(new LetBinding(h, r, f, u.to, a));
            ++d;
        }
    }
};

hi = __decorate([ renderer(Fe) ], hi);

let ci = class RefBindingRenderer {
    render(t, e, i, s, n) {
        t.addBinding(new RefBinding(t.container, ensureExpression(n, i.from, bt), getRefTarget(e, i.to)));
    }
};

ci = __decorate([ renderer(We) ], ci);

let ui = class InterpolationBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new InterpolationBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, gt), getTarget(e), i.to, Bt));
    }
};

ui = __decorate([ renderer(Ve) ], ui);

let fi = class PropertyBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, bt), getTarget(e), i.to, i.mode));
    }
};

fi = __decorate([ renderer($e) ], fi);

let di = class IteratorBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.forOf, pt), getTarget(e), i.to, Bt));
    }
};

di = __decorate([ renderer(je) ], di);

let mi = class TextBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, s.domWriteQueue, s, ensureExpression(n, i.from, bt), e));
    }
};

mi = __decorate([ renderer(Ue) ], mi);

let gi = class ListenerBindingRenderer {
    constructor() {
        this.tt = c(_e);
    }
    render(t, e, i, s, n) {
        t.addBinding(new ListenerBinding(t.container, ensureExpression(n, i.from, vt), e, i.to, new ListenerBindingOptions(i.preventDefault, i.capture), this.tt.getHandler(i.to, i.modifier)));
    }
};

gi = __decorate([ renderer(Ge) ], gi);

let pi = class SetAttributeRenderer {
    render(t, e, i) {
        e.setAttribute(i.to, i.value);
    }
};

pi = __decorate([ renderer(Qe) ], pi);

let vi = class SetClassAttributeRenderer {
    render(t, e, i) {
        addClasses(e.classList, i.value);
    }
};

vi = __decorate([ renderer(Ye) ], vi);

let bi = class SetStyleAttributeRenderer {
    render(t, e, i) {
        e.style.cssText += i.value;
    }
};

bi = __decorate([ renderer(Ze) ], bi);

let xi = class StylePropertyBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, bt), e.style, i.to, Bt));
    }
};

xi = __decorate([ renderer(Xe) ], xi);

let wi = class AttributeBindingRenderer {
    render(t, e, i, s, n, r) {
        const l = t.container;
        const a = l.has(ds, false) ? l.get(ds) : null;
        t.addBinding(new AttributeBinding(t, l, r, s.domWriteQueue, ensureExpression(n, i.from, bt), e, i.attr, a == null ? i.to : i.to.split(/\s/g).map((t => a[t] ?? t)).join(" "), Bt));
    }
};

wi = __decorate([ renderer(Ke) ], wi);

let yi = class SpreadRenderer {
    constructor() {
        this.et = c(si);
        this.r = c(Ti);
    }
    render(t, e, i, s, n, r) {
        SpreadBinding.create(t.container.get(os), e, void 0, this.r, this.et, s, n, r).forEach((e => t.addBinding(e)));
    }
};

yi = __decorate([ renderer(Je) ], yi);

function addClasses(t, e) {
    const i = e.length;
    let s = 0;
    for (let n = 0; n < i; ++n) {
        if (e.charCodeAt(n) === 32) {
            if (n !== s) {
                t.add(e.slice(s, n));
            }
            s = n + 1;
        } else if (n + 1 === i) {
            t.add(e.slice(s));
        }
    }
}

const ki = "IController";

const Ci = "IInstruction";

const Ai = "IRenderLocation";

const Bi = "ISlotsInfo";

function createElementContainer(t, e, i, s, n, r) {
    const l = e.container.createChild();
    registerHostNode(l, t, i);
    registerResolver(l, rs, new m(ki, e));
    registerResolver(l, ii, new m(Ci, s));
    registerResolver(l, fs, n == null ? Si : new RenderLocationProvider(n));
    registerResolver(l, Te, _i);
    registerResolver(l, Pe, r == null ? Ri : new m(Bi, r));
    return l;
}

class ViewFactoryProvider {
    get $isResolver() {
        return true;
    }
    constructor(t) {
        this.f = t;
    }
    resolve() {
        const t = this.f;
        if (t === null) {
            throw createMappedError(755);
        }
        if (!isString(t.name) || t.name.length === 0) {
            throw createMappedError(756);
        }
        return t;
    }
}

function invokeAttribute(t, e, i, s, n, r, l, a) {
    const h = i instanceof Controller ? i : i.$controller;
    const c = h.container.createChild();
    registerHostNode(c, t, s);
    registerResolver(c, rs, new m(ki, h));
    registerResolver(c, ii, new m(Ci, n));
    registerResolver(c, fs, l == null ? Si : new m(Ai, l));
    registerResolver(c, Te, r == null ? _i : new ViewFactoryProvider(r));
    registerResolver(c, Pe, a == null ? Ri : new m(Bi, a));
    return {
        vm: c.invoke(e.Type),
        ctn: c
    };
}

class RenderLocationProvider {
    get name() {
        return "IRenderLocation";
    }
    get $isResolver() {
        return true;
    }
    constructor(t) {
        this.l = t;
    }
    resolve() {
        return this.l;
    }
}

const Si = new RenderLocationProvider(null);

const _i = new ViewFactoryProvider(null);

const Ri = new m(Bi, new AuSlotsInfo(f));

const Ti = /*@__PURE__*/ Wt("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.it ?? (this.it = this.st.getAll(ni, false).reduce(((t, e) => {
            t[e.target] = e;
            return t;
        }), createLookup()));
    }
    constructor() {
        this.nt = new WeakMap;
        this.rt = new WeakMap;
        const t = this.st = c(g).root;
        this.p = t.get(se);
        this.ep = t.get(O);
        this.oL = t.get(V);
        this.ot = new FragmentNodeSequence(this.p, this.p.document.createDocumentFragment());
    }
    compile(t, e, i) {
        if (t.needsCompile !== false) {
            const s = this.nt;
            const n = e.get(si);
            let r = s.get(t);
            if (r == null) {
                s.set(t, r = n.compile(t, e, i));
            } else {
                e.register(...r.dependencies);
            }
            return r;
        }
        return t;
    }
    getViewFactory(t, e) {
        return new ViewFactory(e, CustomElementDefinition.getOrCreate(t));
    }
    createNodes(t) {
        if (t.enhance === true) {
            return new FragmentNodeSequence(this.p, this.lt(t.template));
        }
        let e;
        let i = false;
        const s = this.rt;
        const n = this.p;
        const r = n.document;
        if (s.has(t)) {
            e = s.get(t);
        } else {
            const l = t.template;
            let a;
            if (l === null) {
                e = null;
            } else if (l instanceof n.Node) {
                if (l.nodeName === "TEMPLATE") {
                    e = l.content;
                    i = true;
                } else {
                    (e = r.createDocumentFragment()).appendChild(l.cloneNode(true));
                }
            } else {
                a = r.createElement("template");
                if (isString(l)) {
                    a.innerHTML = l;
                }
                e = a.content;
                i = true;
            }
            this.lt(e);
            s.set(t, e);
        }
        return e == null ? this.ot : new FragmentNodeSequence(this.p, i ? r.importNode(e, true) : r.adoptNode(e.cloneNode(true)));
    }
    render(t, e, i, s) {
        const n = i.instructions;
        const r = this.renderers;
        const l = e.length;
        let a = 0;
        let h = 0;
        let c = n.length;
        let u;
        let f;
        let d;
        if (l !== c) {
            throw createMappedError(757, l, c);
        }
        if (l > 0) {
            while (l > a) {
                u = n[a];
                d = e[a];
                h = 0;
                c = u.length;
                while (c > h) {
                    f = u[h];
                    r[f.type].render(t, d, f, this.p, this.ep, this.oL);
                    ++h;
                }
                ++a;
            }
        }
        if (s != null) {
            u = i.surrogates;
            if ((c = u.length) > 0) {
                h = 0;
                while (c > h) {
                    f = u[h];
                    r[f.type].render(t, s, f, this.p, this.ep, this.oL);
                    ++h;
                }
            }
        }
    }
    ht() {
        return this.p.document.createElement("au-m");
    }
    lt(t) {
        if (t == null) {
            return null;
        }
        let e = t;
        let i = e.firstChild;
        let s = null;
        while (i != null) {
            if (i.nodeType === 8 && i.nodeValue === "au*") {
                s = i.nextSibling;
                e.removeChild(i);
                e.insertBefore(this.ht(), s);
                if (s.nodeType === 8) {
                    i = s.nextSibling;
                } else {
                    i = s;
                }
            }
            s = i?.firstChild;
            if (s == null) {
                s = i?.nextSibling;
                if (s == null) {
                    i = e.nextSibling;
                    e = e.parentNode;
                    while (i == null && e != null) {
                        i = e.nextSibling;
                        e = e.parentNode;
                    }
                } else {
                    i = s;
                }
            } else {
                e = i;
                i = s;
            }
        }
        return t;
    }
}

const addListener = (t, e, i, s) => {
    t.addEventListener(e, i, s);
};

const removeListener = (t, e, i, s) => {
    t.removeEventListener(e, i, s);
};

const mixinNodeObserverUseConfig = t => {
    let e;
    const i = t.prototype;
    defineHiddenProp(i, "subscribe", (function(t) {
        if (this.subs.add(t) && this.subs.count === 1) {
            for (e of this.cf.events) {
                addListener(this.ct, e, this);
            }
            this.ut = true;
            this.ft?.();
        }
    }));
    defineHiddenProp(i, "unsubscribe", (function(t) {
        if (this.subs.remove(t) && this.subs.count === 0) {
            for (e of this.cf.events) {
                removeListener(this.ct, e, this);
            }
            this.ut = false;
            this.dt?.();
        }
    }));
    defineHiddenProp(i, "useConfig", (function(t) {
        this.cf = t;
        if (this.ut) {
            for (e of this.cf.events) {
                removeListener(this.ct, e, this);
            }
            for (e of this.cf.events) {
                addListener(this.ct, e, this);
            }
        }
    }));
};

const mixinNoopSubscribable = t => {
    defineHiddenProp(t.prototype, "subscribe", s);
    defineHiddenProp(t.prototype, "unsubscribe", s);
};

class ClassAttributeAccessor {
    get doNotCache() {
        return true;
    }
    constructor(t) {
        this.obj = t;
        this.type = kt | Ct;
        this.v = "";
        this.gt = {};
        this.vt = 0;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (t !== this.v) {
            this.v = t;
            this.bt();
        }
    }
    bt() {
        const t = this.gt;
        const e = ++this.vt;
        const i = this.obj.classList;
        const s = getClassesToAdd(this.v);
        const n = s.length;
        let r = 0;
        let l;
        if (n > 0) {
            for (;r < n; r++) {
                l = s[r];
                if (l.length === 0) {
                    continue;
                }
                t[l] = this.vt;
                i.add(l);
            }
        }
        if (e === 1) {
            return;
        }
        for (l in t) {
            if (t[l] === e) {
                continue;
            }
            i.remove(l);
        }
    }
}

function getClassesToAdd(t) {
    if (isString(t)) {
        return splitClassString(t);
    }
    if (typeof t !== "object") {
        return f;
    }
    if (t instanceof Array) {
        const e = t.length;
        if (e > 0) {
            const i = [];
            let s = 0;
            for (;e > s; ++s) {
                i.push(...getClassesToAdd(t[s]));
            }
            return i;
        } else {
            return f;
        }
    }
    const e = [];
    let i;
    for (i in t) {
        if (Boolean(t[i])) {
            if (i.includes(" ")) {
                e.push(...splitClassString(i));
            } else {
                e.push(i);
            }
        }
    }
    return e;
}

function splitClassString(t) {
    const e = t.match(/\S+/g);
    if (e === null) {
        return f;
    }
    return e;
}

mixinNoopSubscribable(ClassAttributeAccessor);

function cssModules(...t) {
    return new CSSModulesProcessorRegistry(t);
}

class CSSModulesProcessorRegistry {
    constructor(t) {
        this.modules = t;
    }
    register(t) {
        var e;
        const i = ht({}, ...this.modules);
        const s = defineAttribute({
            name: "class",
            bindables: [ "value" ],
            noMultiBindings: true
        }, (e = class CustomAttributeClass {
            constructor(t) {
                this.xt = new ClassAttributeAccessor(t);
            }
            binding() {
                this.valueChanged();
            }
            valueChanged() {
                this.xt.setValue(this.value?.split(/\s+/g).map((t => i[t] || t)) ?? "");
            }
        }, e.inject = [ cs ], e));
        t.register(s, Ut(ds, i));
    }
}

function shadowCSS(...t) {
    return new ShadowDOMRegistry(t);
}

const Ii = /*@__PURE__*/ Wt("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
    if (AdoptedStyleSheetsStyles.supported(t.get(se))) {
        return t.get(AdoptedStyleSheetsStylesFactory);
    }
    return t.get(StyleElementStylesFactory);
}))));

class ShadowDOMRegistry {
    constructor(t) {
        this.css = t;
    }
    register(t) {
        const e = t.get(Pi);
        const i = t.get(Ii);
        t.register(Ut(Ei, i.createStyles(this.css, e)));
    }
}

class AdoptedStyleSheetsStylesFactory {
    constructor() {
        this.p = c(se);
        this.cache = new Map;
    }
    createStyles(t, e) {
        return new AdoptedStyleSheetsStyles(this.p, t, this.cache, e);
    }
}

class StyleElementStylesFactory {
    constructor() {
        this.p = c(se);
    }
    createStyles(t, e) {
        return new StyleElementStyles(this.p, t, e);
    }
}

const Ei = /*@__PURE__*/ Wt("IShadowDOMStyles");

const Pi = /*@__PURE__*/ Wt("IShadowDOMGlobalStyles", (t => t.instance({
    applyTo: s
})));

class AdoptedStyleSheetsStyles {
    constructor(t, e, i, s = null) {
        this.sharedStyles = s;
        this.styleSheets = e.map((e => {
            let s;
            if (e instanceof t.CSSStyleSheet) {
                s = e;
            } else {
                s = i.get(e);
                if (s === void 0) {
                    s = new t.CSSStyleSheet;
                    s.replaceSync(e);
                    i.set(e, s);
                }
            }
            return s;
        }));
    }
    static supported(t) {
        return "adoptedStyleSheets" in t.ShadowRoot.prototype;
    }
    applyTo(t) {
        if (this.sharedStyles !== null) {
            this.sharedStyles.applyTo(t);
        }
        t.adoptedStyleSheets = [ ...t.adoptedStyleSheets, ...this.styleSheets ];
    }
}

class StyleElementStyles {
    constructor(t, e, i = null) {
        this.p = t;
        this.localStyles = e;
        this.sharedStyles = i;
    }
    applyTo(t) {
        const e = this.localStyles;
        const i = this.p;
        for (let s = e.length - 1; s > -1; --s) {
            const n = i.document.createElement("style");
            n.innerHTML = e[s];
            t.prepend(n);
        }
        if (this.sharedStyles !== null) {
            this.sharedStyles.applyTo(t);
        }
    }
}

const Li = {
    shadowDOM(t) {
        return ie.creating(g, (e => {
            if (t.sharedStyles != null) {
                const i = e.get(Ii);
                e.register(Ut(Pi, i.createStyles(t.sharedStyles, null)));
            }
        }));
    }
};

const {enter: Mi, exit: Di} = $;

const {wrap: qi, unwrap: Hi} = N;

class ComputedWatcher {
    get value() {
        return this.v;
    }
    constructor(t, e, i, s, n) {
        this.obj = t;
        this.$get = i;
        this.useProxy = n;
        this.isBound = false;
        this.running = false;
        this.v = void 0;
        this.cb = s;
        this.oL = e;
    }
    handleChange() {
        this.run();
    }
    handleCollectionChange() {
        this.run();
    }
    bind() {
        if (this.isBound) {
            return;
        }
        this.compute();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.obs.clearAll();
    }
    run() {
        if (!this.isBound || this.running) {
            return;
        }
        const t = this.obj;
        const e = this.v;
        const i = this.compute();
        if (!dt(i, e)) {
            this.cb.call(t, i, e, t);
        }
    }
    compute() {
        this.running = true;
        this.obs.version++;
        try {
            Mi(this);
            return this.v = Hi(this.$get.call(void 0, this.useProxy ? qi(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            Di(this);
        }
    }
}

class ExpressionWatcher {
    get value() {
        return this.v;
    }
    constructor(t, e, i, s, n) {
        this.scope = t;
        this.l = e;
        this.oL = i;
        this.isBound = false;
        this.boundFn = false;
        this.obj = t.bindingContext;
        this.wt = s;
        this.cb = n;
    }
    handleChange(t) {
        const e = this.wt;
        const i = this.obj;
        const s = this.v;
        const n = e.$kind === "AccessScope" && this.obs.count === 1;
        if (!n) {
            this.obs.version++;
            t = L(e, this.scope, this, this);
            this.obs.clear();
        }
        if (!dt(t, s)) {
            this.v = t;
            this.cb.call(i, t, s, i);
        }
    }
    bind() {
        if (this.isBound) {
            return;
        }
        this.obs.version++;
        this.v = L(this.wt, this.scope, this, this);
        this.obs.clear();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.obs.clearAll();
        this.v = void 0;
    }
}

M(ComputedWatcher);

M(ExpressionWatcher);

mixinAstEvaluator(true)(ExpressionWatcher);

class Controller {
    get lifecycleHooks() {
        return this.yt;
    }
    get isActive() {
        return (this.state & (Zi | Ji)) > 0 && (this.state & ts) === 0;
    }
    get name() {
        if (this.parent === null) {
            switch (this.vmKind) {
              case Xi:
                return `[${this.definition.name}]`;

              case Ki:
                return this.definition.name;

              case Qi:
                return this.viewFactory.name;
            }
        }
        switch (this.vmKind) {
          case Xi:
            return `${this.parent.name}>[${this.definition.name}]`;

          case Ki:
            return `${this.parent.name}>${this.definition.name}`;

          case Qi:
            return this.viewFactory.name === this.parent.definition?.name ? `${this.parent.name}[view]` : `${this.parent.name}[view:${this.viewFactory.name}]`;
        }
    }
    get viewModel() {
        return this.kt;
    }
    set viewModel(t) {
        this.kt = t;
        this.Ct = t == null || this.vmKind === Qi ? HooksDefinition.none : new HooksDefinition(t);
    }
    constructor(t, e, i, s, n, r, l) {
        this.container = t;
        this.vmKind = e;
        this.definition = i;
        this.viewFactory = s;
        this.host = r;
        this.head = null;
        this.tail = null;
        this.next = null;
        this.parent = null;
        this.bindings = null;
        this.children = null;
        this.hasLockedScope = false;
        this.scope = null;
        this.isBound = false;
        this.At = false;
        this.hostController = null;
        this.mountTarget = Oi;
        this.shadowRoot = null;
        this.nodes = null;
        this.location = null;
        this.yt = null;
        this.state = Yi;
        this.Bt = false;
        this.$initiator = null;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this.St = 0;
        this._t = 0;
        this.Rt = 0;
        this.kt = n;
        this.Ct = e === Qi ? HooksDefinition.none : new HooksDefinition(n);
        this.location = l;
        this.r = t.root.get(Ti);
        this.coercion = e === Qi ? void 0 : t.get(zi);
    }
    static getCached(t) {
        return Fi.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (e === void 0) {
            throw createMappedError(500, t);
        }
        return e;
    }
    static $el(t, e, i, s, n = void 0, r = null) {
        if (Fi.has(e)) {
            return Fi.get(e);
        }
        n = n ?? getElementDefinition(e.constructor);
        const l = new Controller(t, Ki, n, null, e, i, r);
        const a = t.get(p(os));
        if (n.dependencies.length > 0) {
            t.register(...n.dependencies);
        }
        registerResolver(t, os, new m("IHydrationContext", new HydrationContext(l, s, a)));
        Fi.set(e, l);
        if (s == null || s.hydrate !== false) {
            l.hE(s, a);
        }
        return l;
    }
    static $attr(t, e, i, s) {
        if (Fi.has(e)) {
            return Fi.get(e);
        }
        s = s ?? getAttributeDefinition(e.constructor);
        const n = new Controller(t, Xi, s, null, e, i, null);
        if (s.dependencies.length > 0) {
            t.register(...s.dependencies);
        }
        Fi.set(e, n);
        n.Tt();
        return n;
    }
    static $view(t, e = void 0) {
        const i = new Controller(t.container, Qi, null, t, null, null, null);
        i.parent = e ?? null;
        i.It();
        return i;
    }
    hE(t, e) {
        const i = this.container;
        const s = this.kt;
        const n = this.definition;
        this.scope = W.create(s, null, true);
        if (n.watches.length > 0) {
            createWatchers(this, i, n, s);
        }
        createObservers(this, n, s);
        this.yt = me.resolve(i);
        n.register(i);
        if (n.injectable !== null) {
            registerResolver(i, n.injectable, new m("definition.injectable", s));
        }
        if (t == null || t.hydrate !== false) {
            this.hS(t);
            this.hC();
        }
    }
    hS(t) {
        if (this.yt.hydrating != null) {
            this.yt.hydrating.forEach(callHydratingHook, this);
        }
        if (this.Ct.Et) {
            this.kt.hydrating(this);
        }
        const e = this.Pt = this.r.compile(this.definition, this.container, t);
        const {shadowOptions: i, hasSlots: s, containerless: n} = e;
        let r = this.location;
        if ((this.hostController = findElementControllerFor(this.host, ji)) !== null) {
            this.host = this.container.root.get(se).document.createElement(this.definition.name);
            if (n && r == null) {
                r = this.location = convertToRenderLocation(this.host);
            }
        }
        setRef(this.host, ws, this);
        setRef(this.host, this.definition.key, this);
        if (i !== null || s) {
            if (r != null) {
                throw createMappedError(501);
            }
            setRef(this.shadowRoot = this.host.attachShadow(i ?? Gi), ws, this);
            setRef(this.shadowRoot, this.definition.key, this);
            this.mountTarget = $i;
        } else if (r != null) {
            setRef(r, ws, this);
            setRef(r, this.definition.key, this);
            this.mountTarget = Ni;
        } else {
            this.mountTarget = Vi;
        }
        this.kt.$controller = this;
        this.nodes = this.r.createNodes(e);
        if (this.yt.hydrated !== void 0) {
            this.yt.hydrated.forEach(callHydratedHook, this);
        }
        if (this.Ct.Lt) {
            this.kt.hydrated(this);
        }
    }
    hC() {
        this.r.render(this, this.nodes.findTargets(), this.Pt, this.host);
        if (this.yt.created !== void 0) {
            this.yt.created.forEach(callCreatedHook, this);
        }
        if (this.Ct.Mt) {
            this.kt.created(this);
        }
    }
    Tt() {
        const t = this.definition;
        const e = this.kt;
        if (t.watches.length > 0) {
            createWatchers(this, this.container, t, e);
        }
        createObservers(this, t, e);
        e.$controller = this;
        this.yt = me.resolve(this.container);
        if (this.yt.created !== void 0) {
            this.yt.created.forEach(callCreatedHook, this);
        }
        if (this.Ct.Mt) {
            this.kt.created(this);
        }
    }
    It() {
        this.Pt = this.r.compile(this.viewFactory.def, this.container, null);
        this.r.render(this, (this.nodes = this.r.createNodes(this.Pt)).findTargets(), this.Pt, void 0);
    }
    activate(t, e, i) {
        switch (this.state) {
          case Yi:
          case es:
            if (!(e === null || e.isActive)) {
                return;
            }
            this.state = Zi;
            break;

          case Ji:
            return;

          case ss:
            throw createMappedError(502, this.name);

          default:
            throw createMappedError(503, this.name, stringifyState(this.state));
        }
        this.parent = e;
        switch (this.vmKind) {
          case Ki:
            this.scope.parent = i ?? null;
            break;

          case Xi:
            this.scope = i ?? null;
            break;

          case Qi:
            if (i === void 0 || i === null) {
                throw createMappedError(504, this.name);
            }
            if (!this.hasLockedScope) {
                this.scope = i;
            }
            break;
        }
        this.$initiator = t;
        this.Dt();
        let s = void 0;
        if (this.vmKind !== Qi && this.yt.binding != null) {
            s = v(...this.yt.binding.map(callBindingHook, this));
        }
        if (this.Ct.qt) {
            s = v(s, this.kt.binding(this.$initiator, this.parent));
        }
        if (isPromise(s)) {
            this.Ht();
            s.then((() => {
                this.At = true;
                if (this.state !== Zi) {
                    this.Ft();
                } else {
                    this.bind();
                }
            })).catch((t => {
                this.Ot(t);
            }));
            return this.$promise;
        }
        this.At = true;
        this.bind();
        return this.$promise;
    }
    bind() {
        let t = 0;
        let e = 0;
        let i = void 0;
        if (this.bindings !== null) {
            t = 0;
            e = this.bindings.length;
            while (e > t) {
                this.bindings[t].bind(this.scope);
                ++t;
            }
        }
        if (this.vmKind !== Qi && this.yt.bound != null) {
            i = v(...this.yt.bound.map(callBoundHook, this));
        }
        if (this.Ct.Vt) {
            i = v(i, this.kt.bound(this.$initiator, this.parent));
        }
        if (isPromise(i)) {
            this.Ht();
            i.then((() => {
                this.isBound = true;
                if (this.state !== Zi) {
                    this.Ft();
                } else {
                    this.$t();
                }
            })).catch((t => {
                this.Ot(t);
            }));
            return;
        }
        this.isBound = true;
        this.$t();
    }
    Nt(...t) {
        switch (this.mountTarget) {
          case Vi:
            this.host.append(...t);
            break;

          case $i:
            this.shadowRoot.append(...t);
            break;

          case Ni:
            {
                let e = 0;
                for (;e < t.length; ++e) {
                    this.location.parentNode.insertBefore(t[e], this.location);
                }
                break;
            }
        }
    }
    $t() {
        if (this.hostController !== null) {
            switch (this.mountTarget) {
              case Vi:
              case $i:
                this.hostController.Nt(this.host);
                break;

              case Ni:
                this.hostController.Nt(this.location.$start, this.location);
                break;
            }
        }
        switch (this.mountTarget) {
          case Vi:
            this.nodes.appendTo(this.host, this.definition != null && this.definition.enhance);
            break;

          case $i:
            {
                const t = this.container;
                const e = t.has(Ei, false) ? t.get(Ei) : t.get(Pi);
                e.applyTo(this.shadowRoot);
                this.nodes.appendTo(this.shadowRoot);
                break;
            }

          case Ni:
            this.nodes.insertBefore(this.location);
            break;
        }
        let t = 0;
        let e = void 0;
        if (this.vmKind !== Qi && this.yt.attaching != null) {
            e = v(...this.yt.attaching.map(callAttachingHook, this));
        }
        if (this.Ct.Wt) {
            e = v(e, this.kt.attaching(this.$initiator, this.parent));
        }
        if (isPromise(e)) {
            this.Ht();
            this.Dt();
            e.then((() => {
                this.Ft();
            })).catch((t => {
                this.Ot(t);
            }));
        }
        if (this.children !== null) {
            for (;t < this.children.length; ++t) {
                void this.children[t].activate(this.$initiator, this, this.scope);
            }
        }
        this.Ft();
    }
    deactivate(t, e) {
        let i = void 0;
        switch (this.state & ~is) {
          case Ji:
            this.state = ts;
            break;

          case Zi:
            this.state = ts;
            i = this.$promise?.catch(s);
            break;

          case Yi:
          case es:
          case ss:
          case es | ss:
            return;

          default:
            throw createMappedError(505, this.name, this.state);
        }
        this.$initiator = t;
        if (t === this) {
            this.jt();
        }
        let n = 0;
        let r;
        if (this.children !== null) {
            for (n = 0; n < this.children.length; ++n) {
                void this.children[n].deactivate(t, this);
            }
        }
        return b(i, (() => {
            if (this.isBound) {
                if (this.vmKind !== Qi && this.yt.detaching != null) {
                    r = v(...this.yt.detaching.map(callDetachingHook, this));
                }
                if (this.Ct.zt) {
                    r = v(r, this.kt.detaching(this.$initiator, this.parent));
                }
            }
            if (isPromise(r)) {
                this.Ht();
                t.jt();
                r.then((() => {
                    t.Ut();
                })).catch((e => {
                    t.Ot(e);
                }));
            }
            if (t.head === null) {
                t.head = this;
            } else {
                t.tail.next = this;
            }
            t.tail = this;
            if (t !== this) {
                return;
            }
            this.Ut();
            return this.$promise;
        }));
    }
    removeNodes() {
        switch (this.vmKind) {
          case Ki:
          case Qi:
            this.nodes.remove();
            this.nodes.unlink();
        }
        if (this.hostController !== null) {
            switch (this.mountTarget) {
              case Vi:
              case $i:
                this.host.remove();
                break;

              case Ni:
                this.location.$start.remove();
                this.location.remove();
                break;
            }
        }
    }
    unbind() {
        let t = 0;
        if (this.bindings !== null) {
            for (;t < this.bindings.length; ++t) {
                this.bindings[t].unbind();
            }
        }
        this.parent = null;
        switch (this.vmKind) {
          case Xi:
            this.scope = null;
            break;

          case Qi:
            if (!this.hasLockedScope) {
                this.scope = null;
            }
            if ((this.state & is) === is && !this.viewFactory.tryReturnToCache(this) && this.$initiator === this) {
                this.dispose();
            }
            break;

          case Ki:
            this.scope.parent = null;
            break;
        }
        this.state = es;
        this.$initiator = null;
        this.Gt();
    }
    Ht() {
        if (this.$promise === void 0) {
            this.$promise = new Promise(((t, e) => {
                this.$resolve = t;
                this.$reject = e;
            }));
            if (this.$initiator !== this) {
                this.parent.Ht();
            }
        }
    }
    Gt() {
        if (this.$promise !== void 0) {
            ls = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            ls();
            ls = void 0;
        }
    }
    Ot(t) {
        if (this.$promise !== void 0) {
            as = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            as(t);
            as = void 0;
        }
        if (this.$initiator !== this) {
            this.parent.Ot(t);
        }
    }
    Dt() {
        ++this.St;
        if (this.$initiator !== this) {
            this.parent.Dt();
        }
    }
    Ft() {
        if (this.state !== Zi) {
            --this.St;
            this.Gt();
            if (this.$initiator !== this) {
                this.parent.Ft();
            }
            return;
        }
        if (--this.St === 0) {
            if (this.vmKind !== Qi && this.yt.attached != null) {
                hs = v(...this.yt.attached.map(callAttachedHook, this));
            }
            if (this.Ct.Kt) {
                hs = v(hs, this.kt.attached(this.$initiator));
            }
            if (isPromise(hs)) {
                this.Ht();
                hs.then((() => {
                    this.state = Ji;
                    this.Gt();
                    if (this.$initiator !== this) {
                        this.parent.Ft();
                    }
                })).catch((t => {
                    this.Ot(t);
                }));
                hs = void 0;
                return;
            }
            hs = void 0;
            this.state = Ji;
            this.Gt();
        }
        if (this.$initiator !== this) {
            this.parent.Ft();
        }
    }
    jt() {
        ++this._t;
    }
    Ut() {
        if (--this._t === 0) {
            this.Xt();
            this.removeNodes();
            let t = this.$initiator.head;
            let e = void 0;
            while (t !== null) {
                if (t !== this) {
                    if (t.debug) {
                        t.logger.trace(`detach()`);
                    }
                    t.removeNodes();
                }
                if (t.At) {
                    if (t.vmKind !== Qi && t.yt.unbinding != null) {
                        e = v(...t.yt.unbinding.map(callUnbindingHook, t));
                    }
                    if (t.Ct.Qt) {
                        if (t.debug) {
                            t.logger.trace("unbinding()");
                        }
                        e = v(e, t.viewModel.unbinding(t.$initiator, t.parent));
                    }
                }
                if (isPromise(e)) {
                    this.Ht();
                    this.Xt();
                    e.then((() => {
                        this.Yt();
                    })).catch((t => {
                        this.Ot(t);
                    }));
                }
                e = void 0;
                t = t.next;
            }
            this.Yt();
        }
    }
    Xt() {
        ++this.Rt;
    }
    Yt() {
        if (--this.Rt === 0) {
            let t = this.$initiator.head;
            let e = null;
            while (t !== null) {
                if (t !== this) {
                    t.At = false;
                    t.isBound = false;
                    t.unbind();
                }
                e = t.next;
                t.next = null;
                t = e;
            }
            this.head = this.tail = null;
            this.At = false;
            this.isBound = false;
            this.unbind();
        }
    }
    addBinding(t) {
        if (this.bindings === null) {
            this.bindings = [ t ];
        } else {
            this.bindings[this.bindings.length] = t;
        }
    }
    addChild(t) {
        if (this.children === null) {
            this.children = [ t ];
        } else {
            this.children[this.children.length] = t;
        }
    }
    is(t) {
        switch (this.vmKind) {
          case Xi:
            {
                return getAttributeDefinition(this.kt.constructor).name === t;
            }

          case Ki:
            {
                return getElementDefinition(this.kt.constructor).name === t;
            }

          case Qi:
            return this.viewFactory.name === t;
        }
    }
    lockScope(t) {
        this.scope = t;
        this.hasLockedScope = true;
    }
    setHost(t) {
        if (this.vmKind === Ki) {
            setRef(t, ws, this);
            setRef(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = Vi;
        return this;
    }
    setShadowRoot(t) {
        if (this.vmKind === Ki) {
            setRef(t, ws, this);
            setRef(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = $i;
        return this;
    }
    setLocation(t) {
        if (this.vmKind === Ki) {
            setRef(t, ws, this);
            setRef(t, this.definition.key, this);
        }
        this.location = t;
        this.mountTarget = Ni;
        return this;
    }
    release() {
        this.state |= is;
    }
    dispose() {
        if ((this.state & ss) === ss) {
            return;
        }
        this.state |= ss;
        if (this.Ct.Zt) {
            this.kt.dispose();
        }
        if (this.children !== null) {
            this.children.forEach(callDispose);
            this.children = null;
        }
        this.hostController = null;
        this.scope = null;
        this.nodes = null;
        this.location = null;
        this.viewFactory = null;
        if (this.kt !== null) {
            Fi.delete(this.kt);
            this.kt = null;
        }
        this.kt = null;
        this.host = null;
        this.shadowRoot = null;
        this.container.disposeResolvers();
    }
    accept(t) {
        if (t(this) === true) {
            return true;
        }
        if (this.Ct.Jt && this.kt.accept(t) === true) {
            return true;
        }
        if (this.children !== null) {
            const {children: e} = this;
            for (let i = 0, s = e.length; i < s; ++i) {
                if (e[i].accept(t) === true) {
                    return true;
                }
            }
        }
    }
}

const Fi = new WeakMap;

const Oi = 0;

const Vi = 1;

const $i = 2;

const Ni = 3;

const Wi = at({
    none: Oi,
    host: Vi,
    shadowRoot: $i,
    location: Ni
});

const ji = {
    optional: true
};

const zi = optionalResource(j);

function createObservers(t, e, i) {
    const n = e.bindables;
    const r = ct(n);
    const l = r.length;
    const a = t.container.get(V);
    if (l > 0) {
        for (let e = 0; e < l; ++e) {
            const l = r[e];
            const h = n[l];
            const c = h.callback;
            const u = a.getObserver(i, l);
            if (h.set !== s) {
                if (u.useCoercer?.(h.set, t.coercion) !== true) {
                    throw createMappedError(507, l);
                }
            }
            if (i[c] != null || i.propertyChanged != null) {
                const callback = (e, s) => {
                    if (t.isBound) {
                        i[c]?.(e, s);
                        i.propertyChanged?.(l, e, s);
                    }
                };
                if (u.useCallback?.(callback) !== true) {
                    throw createMappedError(508, l);
                }
            }
        }
    }
}

const Ui = new Map;

const getAccessScopeAst = t => {
    let e = Ui.get(t);
    if (e == null) {
        e = new z(t, 0);
        Ui.set(t, e);
    }
    return e;
};

function createWatchers(t, e, i, s) {
    const n = e.get(V);
    const r = e.get(O);
    const l = i.watches;
    const a = t.vmKind === Ki ? t.scope : W.create(s, null, true);
    const h = l.length;
    let c;
    let u;
    let f;
    let d = 0;
    for (;h > d; ++d) {
        ({expression: c, callback: u} = l[d]);
        u = isFunction(u) ? u : Reflect.get(s, u);
        if (!isFunction(u)) {
            throw createMappedError(506, u);
        }
        if (isFunction(c)) {
            t.addBinding(new ComputedWatcher(s, n, c, u, true));
        } else {
            f = isString(c) ? r.parse(c, bt) : getAccessScopeAst(c);
            t.addBinding(new ExpressionWatcher(a, e, n, f, u));
        }
    }
}

function isCustomElementController(t) {
    return t instanceof Controller && t.vmKind === Ki;
}

function isCustomElementViewModel(t) {
    return I(t) && isElementType(t.constructor);
}

class HooksDefinition {
    constructor(t) {
        this.te = "define" in t;
        this.Et = "hydrating" in t;
        this.Lt = "hydrated" in t;
        this.Mt = "created" in t;
        this.qt = "binding" in t;
        this.Vt = "bound" in t;
        this.Wt = "attaching" in t;
        this.Kt = "attached" in t;
        this.zt = "detaching" in t;
        this.Qt = "unbinding" in t;
        this.Zt = "dispose" in t;
        this.Jt = "accept" in t;
    }
}

HooksDefinition.none = new HooksDefinition({});

const Gi = {
    mode: "open"
};

const Ki = "customElement";

const Xi = "customAttribute";

const Qi = "synthetic";

const Yi = 0;

const Zi = 1;

const Ji = 2;

const ts = 4;

const es = 8;

const is = 16;

const ss = 32;

const ns = /*@__PURE__*/ at({
    none: Yi,
    activating: Zi,
    activated: Ji,
    deactivating: ts,
    deactivated: es,
    released: is,
    disposed: ss
});

function stringifyState(t) {
    const e = [];
    if ((t & Zi) === Zi) {
        e.push("activating");
    }
    if ((t & Ji) === Ji) {
        e.push("activated");
    }
    if ((t & ts) === ts) {
        e.push("deactivating");
    }
    if ((t & es) === es) {
        e.push("deactivated");
    }
    if ((t & is) === is) {
        e.push("released");
    }
    if ((t & ss) === ss) {
        e.push("disposed");
    }
    return e.length === 0 ? "none" : e.join("|");
}

const rs = /*@__PURE__*/ Wt("IController");

const os = /*@__PURE__*/ Wt("IHydrationContext");

class HydrationContext {
    constructor(t, e, i) {
        this.instruction = e;
        this.parent = i;
        this.controller = t;
    }
}

function callDispose(t) {
    t.dispose();
}

function callCreatedHook(t) {
    t.instance.created(this.kt, this);
}

function callHydratingHook(t) {
    t.instance.hydrating(this.kt, this);
}

function callHydratedHook(t) {
    t.instance.hydrated(this.kt, this);
}

function callBindingHook(t) {
    return t.instance.binding(this.kt, this["$initiator"], this.parent);
}

function callBoundHook(t) {
    return t.instance.bound(this.kt, this["$initiator"], this.parent);
}

function callAttachingHook(t) {
    return t.instance.attaching(this.kt, this["$initiator"], this.parent);
}

function callAttachedHook(t) {
    return t.instance.attached(this.kt, this["$initiator"]);
}

function callDetachingHook(t) {
    return t.instance.detaching(this.kt, this["$initiator"], this.parent);
}

function callUnbindingHook(t) {
    return t.instance.unbinding(this.kt, this["$initiator"], this.parent);
}

let ls;

let as;

let hs;

class Refs {}

function getRef(t, e) {
    return t.$au?.[e] ?? null;
}

function setRef(t, e, i) {
    var s;
    ((s = t).$au ?? (s.$au = new Refs))[e] = i;
}

const cs = /*@__PURE__*/ Wt("INode");

const us = /*@__PURE__*/ Wt("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(Bs, true)) {
        return t.get(Bs).host;
    }
    return t.get(se).document;
}))));

const fs = /*@__PURE__*/ Wt("IRenderLocation");

const ds = /*@__PURE__*/ Wt("CssModules");

const ms = new WeakMap;

function getEffectiveParentNode(t) {
    if (ms.has(t)) {
        return ms.get(t);
    }
    let e = 0;
    let i = t.nextSibling;
    while (i !== null) {
        if (i.nodeType === 8) {
            switch (i.textContent) {
              case "au-start":
                ++e;
                break;

              case "au-end":
                if (e-- === 0) {
                    return i;
                }
            }
        }
        i = i.nextSibling;
    }
    if (t.parentNode === null && t.nodeType === 11) {
        const e = findElementControllerFor(t);
        if (e === void 0) {
            return null;
        }
        if (e.mountTarget === Wi.shadowRoot) {
            return getEffectiveParentNode(e.host);
        }
    }
    return t.parentNode;
}

function setEffectiveParentNode(t, e) {
    if (t.platform !== void 0 && !(t instanceof t.platform.Node)) {
        const i = t.childNodes;
        for (let t = 0, s = i.length; t < s; ++t) {
            ms.set(i[t], e);
        }
    } else {
        ms.set(t, e);
    }
}

function convertToRenderLocation(t) {
    if (isRenderLocation(t)) {
        return t;
    }
    const e = t.ownerDocument.createComment("au-end");
    const i = e.$start = t.ownerDocument.createComment("au-start");
    const s = t.parentNode;
    if (s !== null) {
        s.replaceChild(e, t);
        s.insertBefore(i, e);
    }
    return e;
}

function isRenderLocation(t) {
    return t.textContent === "au-end";
}

class FragmentNodeSequence {
    get firstChild() {
        return this.ee;
    }
    get lastChild() {
        return this.ie;
    }
    constructor(t, e) {
        this.platform = t;
        this.next = void 0;
        this.se = false;
        this.ne = false;
        this.ref = null;
        const i = (this.f = e).querySelectorAll("au-m");
        let s = 0;
        let n = i.length;
        let r = this.t = Array(n);
        let l;
        let a;
        while (n > s) {
            a = i[s];
            l = a.nextSibling;
            a.remove();
            if (l.nodeType === 8) {
                a = l;
                (l = l.nextSibling).$start = a;
            }
            r[s] = l;
            ++s;
        }
        const h = e.childNodes;
        const c = this.childNodes = Array(n = h.length);
        s = 0;
        while (n > s) {
            c[s] = h[s];
            ++s;
        }
        this.ee = e.firstChild;
        this.ie = e.lastChild;
    }
    findTargets() {
        return this.t;
    }
    insertBefore(t) {
        if (this.ne && !!this.ref) {
            this.addToLinked();
        } else {
            const e = t.parentNode;
            if (this.se) {
                let i = this.ee;
                let s;
                const n = this.ie;
                while (i != null) {
                    s = i.nextSibling;
                    e.insertBefore(i, t);
                    if (i === n) {
                        break;
                    }
                    i = s;
                }
            } else {
                this.se = true;
                t.parentNode.insertBefore(this.f, t);
            }
        }
    }
    appendTo(t, e = false) {
        if (this.se) {
            let e = this.ee;
            let i;
            const s = this.ie;
            while (e != null) {
                i = e.nextSibling;
                t.appendChild(e);
                if (e === s) {
                    break;
                }
                e = i;
            }
        } else {
            this.se = true;
            if (!e) {
                t.appendChild(this.f);
            }
        }
    }
    remove() {
        if (this.se) {
            this.se = false;
            const t = this.f;
            const e = this.ie;
            let i;
            let s = this.ee;
            while (s !== null) {
                i = s.nextSibling;
                t.appendChild(s);
                if (s === e) {
                    break;
                }
                s = i;
            }
        }
    }
    addToLinked() {
        const t = this.ref;
        const e = t.parentNode;
        if (this.se) {
            let i = this.ee;
            let s;
            const n = this.ie;
            while (i != null) {
                s = i.nextSibling;
                e.insertBefore(i, t);
                if (i === n) {
                    break;
                }
                i = s;
            }
        } else {
            this.se = true;
            e.insertBefore(this.f, t);
        }
    }
    unlink() {
        this.ne = false;
        this.next = void 0;
        this.ref = void 0;
    }
    link(t) {
        this.ne = true;
        if (isRenderLocation(t)) {
            this.ref = t;
        } else {
            this.next = t;
            this.re();
        }
    }
    re() {
        if (this.next !== void 0) {
            this.ref = this.next.firstChild;
        } else {
            this.ref = void 0;
        }
    }
}

const gs = /*@__PURE__*/ Wt("IWindow", (t => t.callback((t => t.get(se).window))));

const ps = /*@__PURE__*/ Wt("ILocation", (t => t.callback((t => t.get(gs).location))));

const vs = /*@__PURE__*/ Wt("IHistory", (t => t.callback((t => t.get(gs).history))));

const registerHostNode = (t, e, i) => {
    registerResolver(t, e.HTMLElement, registerResolver(t, e.Element, registerResolver(t, cs, new m("ElementResolver", i))));
    return t;
};

function customElement(t) {
    return function(e) {
        return defineElement(t, e);
    };
}

function useShadowDOM(t) {
    if (t === void 0) {
        return function(t) {
            annotateElementMetadata(t, "shadowOptions", {
                mode: "open"
            });
        };
    }
    if (!isFunction(t)) {
        return function(e) {
            annotateElementMetadata(e, "shadowOptions", t);
        };
    }
    annotateElementMetadata(t, "shadowOptions", {
        mode: "open"
    });
}

function containerless(t) {
    if (t === void 0) {
        return function(t) {
            markContainerless(t);
        };
    }
    markContainerless(t);
}

function markContainerless(t) {
    const e = It(ws, t);
    if (e === void 0) {
        annotateElementMetadata(t, "containerless", true);
        return;
    }
    e.containerless = true;
}

const bs = new WeakMap;

class CustomElementDefinition {
    get type() {
        return le;
    }
    constructor(t, e, i, s, n, r, l, a, h, c, u, f, d, m, g, p, v, b, x) {
        this.Type = t;
        this.name = e;
        this.aliases = i;
        this.key = s;
        this.cache = n;
        this.capture = r;
        this.template = l;
        this.instructions = a;
        this.dependencies = h;
        this.injectable = c;
        this.needsCompile = u;
        this.surrogates = f;
        this.bindables = d;
        this.containerless = m;
        this.shadowOptions = g;
        this.hasSlots = p;
        this.enhance = v;
        this.watches = b;
        this.processContent = x;
    }
    static create(t, e = null) {
        if (e === null) {
            const i = t;
            if (isString(i)) {
                throw createMappedError(761, t);
            }
            const s = x("name", i, ys);
            if (isFunction(i.Type)) {
                e = i.Type;
            } else {
                e = ks(w(s));
            }
            return new CustomElementDefinition(e, s, h(i.aliases), x("key", i, (() => getElementKeyFrom(s))), x("cache", i, returnZero), x("capture", i, returnFalse), x("template", i, returnNull), h(i.instructions), h(i.dependencies), x("injectable", i, returnNull), x("needsCompile", i, returnTrue), h(i.surrogates), $t.from(e, i.bindables), x("containerless", i, returnFalse), x("shadowOptions", i, returnNull), x("hasSlots", i, returnFalse), x("enhance", i, returnFalse), x("watches", i, returnEmptyArray), y("processContent", e, returnNull));
        }
        if (isString(t)) {
            return new CustomElementDefinition(e, t, h(getElementAnnotation(e, "aliases"), e.aliases), getElementKeyFrom(t), y("cache", e, returnZero), y("capture", e, returnFalse), y("template", e, returnNull), h(getElementAnnotation(e, "instructions"), e.instructions), h(getElementAnnotation(e, "dependencies"), e.dependencies), y("injectable", e, returnNull), y("needsCompile", e, returnTrue), h(getElementAnnotation(e, "surrogates"), e.surrogates), $t.from(e, ...$t.getAll(e), getElementAnnotation(e, "bindables"), e.bindables), y("containerless", e, returnFalse), y("shadowOptions", e, returnNull), y("hasSlots", e, returnFalse), y("enhance", e, returnFalse), h(oe.getAnnotation(e), e.watches), y("processContent", e, returnNull));
        }
        const i = x("name", t, ys);
        return new CustomElementDefinition(e, i, h(getElementAnnotation(e, "aliases"), t.aliases, e.aliases), getElementKeyFrom(i), k("cache", t, e, returnZero), k("capture", t, e, returnFalse), k("template", t, e, returnNull), h(getElementAnnotation(e, "instructions"), t.instructions, e.instructions), h(getElementAnnotation(e, "dependencies"), t.dependencies, e.dependencies), k("injectable", t, e, returnNull), k("needsCompile", t, e, returnTrue), h(getElementAnnotation(e, "surrogates"), t.surrogates, e.surrogates), $t.from(e, ...$t.getAll(e), getElementAnnotation(e, "bindables"), e.bindables, t.bindables), k("containerless", t, e, returnFalse), k("shadowOptions", t, e, returnNull), k("hasSlots", t, e, returnFalse), k("enhance", t, e, returnFalse), h(t.watches, oe.getAnnotation(e), e.watches), k("processContent", t, e, returnNull));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) {
            return t;
        }
        if (bs.has(t)) {
            return bs.get(t);
        }
        const e = CustomElementDefinition.create(t);
        bs.set(t, e);
        Pt(ws, e, e.Type);
        return e;
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        if (!t.has(i, false)) {
            t.register(Gt(i, e), zt(i, e), ...s.map((t => zt(e, Cs.keyFrom(t)))));
        }
    }
    toString() {
        return `au:ce:${this.name}`;
    }
}

const xs = {
    name: undefined,
    searchParents: false,
    optional: false
};

const returnZero = () => 0;

const returnNull = () => null;

const returnFalse = () => false;

const returnTrue = () => true;

const returnEmptyArray = () => f;

const ws = /*@__PURE__*/ qt("custom-element");

const getElementKeyFrom = t => `${ws}:${t}`;

const ys = /*@__PURE__*/ (() => {
    let t = 0;
    return () => `unnamed-${++t}`;
})();

const annotateElementMetadata = (t, e, i) => {
    Pt(Dt(e), i, t);
};

const defineElement = (t, e) => {
    const i = CustomElementDefinition.create(t, e);
    Pt(ws, i, i.Type);
    Pt(ws, i, i);
    Ht(i.Type, ws);
    return i.Type;
};

const isElementType = t => isFunction(t) && Et(ws, t);

const findElementControllerFor = (t, e = xs) => {
    if (e.name === void 0 && e.searchParents !== true) {
        const i = getRef(t, ws);
        if (i === null) {
            if (e.optional === true) {
                return null;
            }
            throw createMappedError(762, t);
        }
        return i;
    }
    if (e.name !== void 0) {
        if (e.searchParents !== true) {
            const i = getRef(t, ws);
            if (i === null) {
                throw createMappedError(763, t);
            }
            if (i.is(e.name)) {
                return i;
            }
            return void 0;
        }
        let i = t;
        let s = false;
        while (i !== null) {
            const t = getRef(i, ws);
            if (t !== null) {
                s = true;
                if (t.is(e.name)) {
                    return t;
                }
            }
            i = getEffectiveParentNode(i);
        }
        if (s) {
            return void 0;
        }
        throw createMappedError(764, t);
    }
    let i = t;
    while (i !== null) {
        const t = getRef(i, ws);
        if (t !== null) {
            return t;
        }
        i = getEffectiveParentNode(i);
    }
    throw createMappedError(765, t);
};

const getElementAnnotation = (t, e) => It(Dt(e), t);

const getElementDefinition = t => {
    const e = It(ws, t);
    if (e === void 0) {
        throw createMappedError(760, t);
    }
    return e;
};

const createElementInjectable = () => {
    const $injectable = function(t, e, i) {
        const s = n.getOrCreateAnnotationParamTypes(t);
        s[i] = $injectable;
        return t;
    };
    $injectable.register = () => ({
        $isResolver: true,
        resolve(t, e) {
            if (e.has($injectable, true)) {
                return e.get($injectable);
            } else {
                return null;
            }
        }
    });
    return $injectable;
};

const ks = /*@__PURE__*/ function() {
    const t = {
        value: "",
        writable: false,
        enumerable: false,
        configurable: true
    };
    const e = {};
    return function(i, s = e) {
        const n = class Anonymous {};
        t.value = i;
        mt(n, "name", t);
        if (s !== e) {
            ht(n.prototype, s);
        }
        return n;
    };
}();

const Cs = at({
    name: ws,
    keyFrom: getElementKeyFrom,
    isType: isElementType,
    for: findElementControllerFor,
    define: defineElement,
    getDefinition: getElementDefinition,
    annotate: annotateElementMetadata,
    getAnnotation: getElementAnnotation,
    generateName: ys,
    createInjectable: createElementInjectable,
    generateType: ks
});

const As = /*@__PURE__*/ Dt("processContent");

function processContent(t) {
    return t === void 0 ? function(t, e, i) {
        Pt(As, ensureHook(t, e), t);
    } : function(e) {
        t = ensureHook(e, t);
        const i = It(ws, e);
        if (i !== void 0) {
            i.processContent = t;
        } else {
            Pt(As, t, e);
        }
        return e;
    };
}

function ensureHook(t, e) {
    if (isString(e)) {
        e = t[e];
    }
    if (!isFunction(e)) {
        throw createMappedError(766, e);
    }
    return e;
}

function capture(t) {
    return function(e) {
        const i = isFunction(t) ? t : true;
        annotateElementMetadata(e, "capture", i);
        if (isElementType(e)) {
            getElementDefinition(e).capture = i;
        }
    };
}

const Bs = /*@__PURE__*/ Wt("IAppRoot");

class AppRoot {
    constructor(t, e, i, s) {
        this.config = t;
        this.platform = e;
        this.container = i;
        this.oe = void 0;
        this.host = t.host;
        s.prepare(this);
        registerHostNode(i, e, t.host);
        this.oe = b(this.le("creating"), (() => {
            const e = t.component;
            const s = i.createChild();
            let n;
            if (isElementType(e)) {
                n = s.invoke(e);
                Ut(e, n);
            } else {
                n = t.component;
            }
            const r = {
                hydrate: false,
                projections: null
            };
            const l = this.controller = Controller.$el(s, n, this.host, r);
            l.hE(r, null);
            return b(this.le("hydrating"), (() => {
                l.hS(null);
                return b(this.le("hydrated"), (() => {
                    l.hC();
                    this.oe = void 0;
                }));
            }));
        }));
    }
    activate() {
        return b(this.oe, (() => b(this.le("activating"), (() => b(this.controller.activate(this.controller, null, void 0), (() => this.le("activated")))))));
    }
    deactivate() {
        return b(this.le("deactivating"), (() => b(this.controller.deactivate(this.controller, null), (() => this.le("deactivated")))));
    }
    le(t) {
        return v(...this.container.getAll(ee).reduce(((e, i) => {
            if (i.slot === t) {
                e.push(i.run());
            }
            return e;
        }), []));
    }
    dispose() {
        this.controller?.dispose();
    }
}

const Ss = /*@__PURE__*/ Wt("IAurelia");

class Aurelia {
    get isRunning() {
        return this.ir;
    }
    get isStarting() {
        return this.ae;
    }
    get isStopping() {
        return this.he;
    }
    get root() {
        if (this.ce == null) {
            if (this.next == null) {
                throw createMappedError(767);
            }
            return this.next;
        }
        return this.ce;
    }
    constructor(t = n.createContainer()) {
        this.container = t;
        this.ir = false;
        this.ae = false;
        this.he = false;
        this.ce = void 0;
        this.next = void 0;
        this.ue = void 0;
        this.fe = void 0;
        if (t.has(Ss, true) || t.has(Aurelia, true)) {
            throw createMappedError(768);
        }
        registerResolver(t, Ss, new m("IAurelia", this));
        registerResolver(t, Aurelia, new m("Aurelia", this));
        registerResolver(t, Bs, this.de = new m("IAppRoot"));
    }
    register(...t) {
        this.container.register(...t);
        return this;
    }
    app(t) {
        this.next = new AppRoot(t, this.me(t.host), this.container, this.de);
        return this;
    }
    enhance(t, e) {
        const i = t.container ?? this.container.createChild();
        const s = t.host;
        const n = this.me(s);
        const r = t.component;
        let l;
        if (isFunction(r)) {
            registerHostNode(i, n, s);
            l = i.invoke(r);
        } else {
            l = r;
        }
        registerResolver(i, us, new m("IEventTarget", s));
        e = e ?? null;
        const a = Controller.$el(i, l, s, null, CustomElementDefinition.create({
            name: ys(),
            template: s,
            enhance: true
        }));
        return b(a.activate(a, e), (() => a));
    }
    async waitForIdle() {
        const t = this.root.platform;
        await t.domWriteQueue.yield();
        await t.domReadQueue.yield();
        await t.taskQueue.yield();
    }
    me(t) {
        let e;
        if (!this.container.has(se, false)) {
            if (t.ownerDocument.defaultView === null) {
                throw createMappedError(769);
            }
            e = new it(t.ownerDocument.defaultView);
            this.container.register(Ut(se, e));
        } else {
            e = this.container.get(se);
        }
        return e;
    }
    start(t = this.next) {
        if (t == null) {
            throw createMappedError(770);
        }
        if (isPromise(this.ue)) {
            return this.ue;
        }
        return this.ue = b(this.stop(), (() => {
            Reflect.set(t.host, "$aurelia", this);
            this.de.prepare(this.ce = t);
            this.ae = true;
            return b(t.activate(), (() => {
                this.ir = true;
                this.ae = false;
                this.ue = void 0;
                this.ge(t, "au-started", t.host);
            }));
        }));
    }
    stop(t = false) {
        if (isPromise(this.fe)) {
            return this.fe;
        }
        if (this.ir === true) {
            const e = this.ce;
            this.ir = false;
            this.he = true;
            return this.fe = b(e.deactivate(), (() => {
                Reflect.deleteProperty(e.host, "$aurelia");
                if (t) {
                    e.dispose();
                }
                this.ce = void 0;
                this.de.dispose();
                this.he = false;
                this.ge(e, "au-stopped", e.host);
            }));
        }
    }
    dispose() {
        if (this.ir || this.he) {
            throw createMappedError(771);
        }
        this.container.dispose();
    }
    ge(t, e, i) {
        const s = new t.platform.window.CustomEvent(e, {
            detail: this,
            bubbles: true,
            cancelable: true
        });
        i.dispatchEvent(s);
    }
}

class CharSpec {
    constructor(t, e, i, s) {
        this.chars = t;
        this.repeat = e;
        this.isSymbol = i;
        this.isInverted = s;
        if (s) {
            switch (t.length) {
              case 0:
                this.has = this.pe;
                break;

              case 1:
                this.has = this.ve;
                break;

              default:
                this.has = this.be;
            }
        } else {
            switch (t.length) {
              case 0:
                this.has = this.xe;
                break;

              case 1:
                this.has = this.we;
                break;

              default:
                this.has = this.ye;
            }
        }
    }
    equals(t) {
        return this.chars === t.chars && this.repeat === t.repeat && this.isSymbol === t.isSymbol && this.isInverted === t.isInverted;
    }
    ye(t) {
        return this.chars.includes(t);
    }
    we(t) {
        return this.chars === t;
    }
    xe(t) {
        return false;
    }
    be(t) {
        return !this.chars.includes(t);
    }
    ve(t) {
        return this.chars !== t;
    }
    pe(t) {
        return true;
    }
}

class Interpretation {
    constructor() {
        this.parts = f;
        this.ke = "";
        this.Ce = {};
        this.Ae = {};
    }
    get pattern() {
        const t = this.ke;
        if (t === "") {
            return null;
        } else {
            return t;
        }
    }
    set pattern(t) {
        if (t == null) {
            this.ke = "";
            this.parts = f;
        } else {
            this.ke = t;
            this.parts = this.Ae[t];
        }
    }
    append(t, e) {
        const i = this.Ce;
        if (i[t] === undefined) {
            i[t] = e;
        } else {
            i[t] += e;
        }
    }
    next(t) {
        const e = this.Ce;
        let i;
        if (e[t] !== undefined) {
            i = this.Ae;
            if (i[t] === undefined) {
                i[t] = [ e[t] ];
            } else {
                i[t].push(e[t]);
            }
            e[t] = undefined;
        }
    }
}

class AttrParsingState {
    get ke() {
        return this.Be ? this.Se[0] : null;
    }
    constructor(t, ...e) {
        this.charSpec = t;
        this._e = [];
        this.Re = null;
        this.Be = false;
        this.Se = e;
    }
    findChild(t) {
        const e = this._e;
        const i = e.length;
        let s = null;
        let n = 0;
        for (;n < i; ++n) {
            s = e[n];
            if (t.equals(s.charSpec)) {
                return s;
            }
        }
        return null;
    }
    append(t, e) {
        const i = this.Se;
        if (!i.includes(e)) {
            i.push(e);
        }
        let s = this.findChild(t);
        if (s == null) {
            s = new AttrParsingState(t, e);
            this._e.push(s);
            if (t.repeat) {
                s._e.push(s);
            }
        }
        return s;
    }
    findMatches(t, e) {
        const i = [];
        const s = this._e;
        const n = s.length;
        let r = 0;
        let l = null;
        let a = 0;
        let h = 0;
        for (;a < n; ++a) {
            l = s[a];
            if (l.charSpec.has(t)) {
                i.push(l);
                r = l.Se.length;
                h = 0;
                if (l.charSpec.isSymbol) {
                    for (;h < r; ++h) {
                        e.next(l.Se[h]);
                    }
                } else {
                    for (;h < r; ++h) {
                        e.append(l.Se[h], t);
                    }
                }
            }
        }
        return i;
    }
}

class StaticSegment {
    constructor(t) {
        this.text = t;
        const e = this.Te = t.length;
        const i = this.Ie = [];
        let s = 0;
        for (;e > s; ++s) {
            i.push(new CharSpec(t[s], false, false, false));
        }
    }
    eachChar(t) {
        const e = this.Te;
        const i = this.Ie;
        let s = 0;
        for (;e > s; ++s) {
            t(i[s]);
        }
    }
}

class DynamicSegment {
    constructor(t) {
        this.text = "PART";
        this.Ee = new CharSpec(t, true, false, true);
    }
    eachChar(t) {
        t(this.Ee);
    }
}

class SymbolSegment {
    constructor(t) {
        this.text = t;
        this.Ee = new CharSpec(t, false, true, false);
    }
    eachChar(t) {
        t(this.Ee);
    }
}

class SegmentTypes {
    constructor() {
        this.statics = 0;
        this.dynamics = 0;
        this.symbols = 0;
    }
}

const _s = /*@__PURE__*/ Wt("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

class SyntaxInterpreter {
    constructor() {
        this.Pe = new AttrParsingState(null);
        this.Le = [ this.Pe ];
    }
    add(t) {
        t = t.slice(0).sort(((t, e) => t.pattern > e.pattern ? 1 : -1));
        const e = t.length;
        let i;
        let s;
        let n;
        let r;
        let l;
        let a;
        let h;
        let c = 0;
        let u;
        while (e > c) {
            i = this.Pe;
            s = t[c];
            n = s.pattern;
            r = new SegmentTypes;
            l = this.Me(s, r);
            a = l.length;
            h = t => i = i.append(t, n);
            for (u = 0; a > u; ++u) {
                l[u].eachChar(h);
            }
            i.Re = r;
            i.Be = true;
            ++c;
        }
    }
    interpret(t) {
        const e = new Interpretation;
        const i = t.length;
        let s = this.Le;
        let n = 0;
        let r;
        for (;n < i; ++n) {
            s = this.De(s, t.charAt(n), e);
            if (s.length === 0) {
                break;
            }
        }
        s = s.filter(isEndpoint);
        if (s.length > 0) {
            s.sort(sortEndpoint);
            r = s[0];
            if (!r.charSpec.isSymbol) {
                e.next(r.ke);
            }
            e.pattern = r.ke;
        }
        return e;
    }
    De(t, e, i) {
        const s = [];
        let n = null;
        const r = t.length;
        let l = 0;
        for (;l < r; ++l) {
            n = t[l];
            s.push(...n.findMatches(e, i));
        }
        return s;
    }
    Me(t, e) {
        const i = [];
        const s = t.pattern;
        const n = s.length;
        const r = t.symbols;
        let l = 0;
        let a = 0;
        let h = "";
        while (l < n) {
            h = s.charAt(l);
            if (r.length === 0 || !r.includes(h)) {
                if (l === a) {
                    if (h === "P" && s.slice(l, l + 4) === "PART") {
                        a = l = l + 4;
                        i.push(new DynamicSegment(r));
                        ++e.dynamics;
                    } else {
                        ++l;
                    }
                } else {
                    ++l;
                }
            } else if (l !== a) {
                i.push(new StaticSegment(s.slice(a, l)));
                ++e.statics;
                a = l;
            } else {
                i.push(new SymbolSegment(s.slice(a, l + 1)));
                ++e.symbols;
                a = ++l;
            }
        }
        if (a !== l) {
            i.push(new StaticSegment(s.slice(a, l)));
            ++e.statics;
        }
        return i;
    }
}

function isEndpoint(t) {
    return t.Be;
}

function sortEndpoint(t, e) {
    const i = t.Re;
    const s = e.Re;
    if (i.statics !== s.statics) {
        return s.statics - i.statics;
    }
    if (i.dynamics !== s.dynamics) {
        return s.dynamics - i.dynamics;
    }
    if (i.symbols !== s.symbols) {
        return s.symbols - i.symbols;
    }
    return 0;
}

class AttrSyntax {
    constructor(t, e, i, s, n = null) {
        this.rawName = t;
        this.rawValue = e;
        this.target = i;
        this.command = s;
        this.parts = n;
    }
}

const Rs = /*@__PURE__*/ Wt("IAttributePattern");

const Ts = /*@__PURE__*/ Wt("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor() {
        this.j = {};
        const t = this.qe = c(_s);
        const e = c(d(Rs));
        const i = this.Se = {};
        const s = e.reduce(((t, e) => {
            const s = getAllPatternDefinitions(e.constructor);
            s.forEach((t => i[t.pattern] = e));
            return t.concat(s);
        }), f);
        t.add(s);
    }
    parse(t, e) {
        let i = this.j[t];
        if (i == null) {
            i = this.j[t] = this.qe.interpret(t);
        }
        const s = i.pattern;
        if (s == null) {
            return new AttrSyntax(t, e, t, null, null);
        } else {
            return this.Se[s][s](t, e, i.parts);
        }
    }
}

function attributePattern(...t) {
    return function decorator(e) {
        return Ps.define(t, e);
    };
}

class AttributePatternResourceDefinition {
    constructor(t) {
        this.Type = t;
        this.name = void 0;
    }
    register(t) {
        jt(Rs, this.Type).register(t);
    }
}

const Is = qt("attribute-pattern");

const Es = "attribute-pattern-definitions";

const getAllPatternDefinitions = e => t.annotation.get(e, Es);

const Ps = at({
    name: Is,
    definitionAnnotationKey: Es,
    define(e, i) {
        const s = new AttributePatternResourceDefinition(i);
        Pt(Is, s, i);
        Ht(i, Is);
        t.annotation.set(i, Es, e);
        Ft(i, Es);
        return i;
    },
    getPatternDefinitions: getAllPatternDefinitions
});

let Ls = class DotSeparatedAttributePattern {
    "PART.PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], i[1]);
    }
    "PART.PART.PART"(t, e, i) {
        return new AttrSyntax(t, e, `${i[0]}.${i[1]}`, i[2]);
    }
};

Ls = __decorate([ attributePattern({
    pattern: "PART.PART",
    symbols: "."
}, {
    pattern: "PART.PART.PART",
    symbols: "."
}) ], Ls);

let Ms = class RefAttributePattern {
    ref(t, e, i) {
        return new AttrSyntax(t, e, "element", "ref");
    }
    "PART.ref"(t, e, i) {
        let s = i[0];
        if (s === "view-model") {
            s = "component";
        }
        return new AttrSyntax(t, e, s, "ref");
    }
};

Ms = __decorate([ attributePattern({
    pattern: "ref",
    symbols: ""
}, {
    pattern: "PART.ref",
    symbols: "."
}) ], Ms);

let Ds = class EventAttributePattern {
    "PART.trigger:PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "trigger", i);
    }
    "PART.capture:PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "capture", i);
    }
};

Ds = __decorate([ attributePattern({
    pattern: "PART.trigger:PART",
    symbols: ".:"
}, {
    pattern: "PART.capture:PART",
    symbols: ".:"
}) ], Ds);

let qs = class ColonPrefixedBindAttributePattern {
    ":PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "bind");
    }
};

qs = __decorate([ attributePattern({
    pattern: ":PART",
    symbols: ":"
}) ], qs);

let Hs = class AtPrefixedTriggerAttributePattern {
    "@PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "trigger");
    }
    "@PART:PART"(t, e, i) {
        i.splice(1, 0, "trigger");
        return new AttrSyntax(t, e, i[0], "trigger", i);
    }
};

Hs = __decorate([ attributePattern({
    pattern: "@PART",
    symbols: "@"
}, {
    pattern: "@PART:PART",
    symbols: "@:"
}) ], Hs);

let Fs = class SpreadAttributePattern {
    "...$attrs"(t, e, i) {
        return new AttrSyntax(t, e, "", "...$attrs");
    }
};

Fs = __decorate([ attributePattern({
    pattern: "...$attrs",
    symbols: ""
}) ], Fs);

const Os = "None";

const Vs = "IgnoreAttr";

function bindingCommand(t) {
    return function(e) {
        return Ns.define(t, e);
    };
}

class BindingCommandDefinition {
    constructor(t, e, i, s, n) {
        this.Type = t;
        this.name = e;
        this.aliases = i;
        this.key = s;
        this.type = n;
    }
    static create(t, e) {
        let i;
        let s;
        if (isString(t)) {
            i = t;
            s = {
                name: i
            };
        } else {
            i = t.name;
            s = t;
        }
        return new BindingCommandDefinition(e, a(getCommandAnnotation(e, "name"), i), h(getCommandAnnotation(e, "aliases"), s.aliases, e.aliases), getCommandKeyFrom(i), a(getCommandAnnotation(e, "type"), s.type, e.type, null));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        if (!t.has(i, false)) {
            t.register(jt(i, e), zt(i, e), ...s.map((t => zt(i, Ns.keyFrom(t)))));
        }
    }
}

const $s = /*@__PURE__*/ qt("binding-command");

const getCommandKeyFrom = t => `${$s}:${t}`;

const getCommandAnnotation = (t, e) => It(Dt(e), t);

const Ns = at({
    name: $s,
    keyFrom: getCommandKeyFrom,
    define(t, e) {
        const i = BindingCommandDefinition.create(t, e);
        Pt($s, i, i.Type);
        Pt($s, i, i);
        Ht(e, $s);
        return i.Type;
    },
    getAnnotation: getCommandAnnotation
});

let Ws = class OneTimeBindingCommand {
    get type() {
        return Os;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = t.attr.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? C(n);
        } else {
            if (r === "" && t.def.type === le) {
                r = C(n);
            }
            n = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, bt), n, At);
    }
};

Ws = __decorate([ bindingCommand("one-time") ], Ws);

let js = class ToViewBindingCommand {
    get type() {
        return Os;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = t.attr.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? C(n);
        } else {
            if (r === "" && t.def.type === le) {
                r = C(n);
            }
            n = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, bt), n, Bt);
    }
};

js = __decorate([ bindingCommand("to-view") ], js);

let zs = class FromViewBindingCommand {
    get type() {
        return Os;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = s.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? C(n);
        } else {
            if (r === "" && t.def.type === le) {
                r = C(n);
            }
            n = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, bt), n, St);
    }
};

zs = __decorate([ bindingCommand("from-view") ], zs);

let Us = class TwoWayBindingCommand {
    get type() {
        return Os;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = s.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? C(n);
        } else {
            if (r === "" && t.def.type === le) {
                r = C(n);
            }
            n = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, bt), n, _t);
    }
};

Us = __decorate([ bindingCommand("two-way") ], Us);

let Gs = class DefaultBindingCommand {
    get type() {
        return Os;
    }
    build(t, e, i) {
        const s = t.attr;
        const n = t.bindable;
        let r;
        let l;
        let a = s.target;
        let h = s.rawValue;
        if (n == null) {
            l = i.isTwoWay(t.node, a) ? _t : Bt;
            a = i.map(t.node, a) ?? C(a);
        } else {
            if (h === "" && t.def.type === le) {
                h = C(a);
            }
            r = t.def.defaultBindingMode;
            l = n.mode === Rt || n.mode == null ? r == null || r === Rt ? Bt : r : n.mode;
            a = n.name;
        }
        return new PropertyBindingInstruction(e.parse(h, bt), a, l);
    }
};

Gs = __decorate([ bindingCommand("bind") ], Gs);

let Ks = class ForBindingCommand {
    get type() {
        return Os;
    }
    static get inject() {
        return [ Ts ];
    }
    constructor(t) {
        this.He = t;
    }
    build(t, e) {
        const i = t.bindable === null ? C(t.attr.target) : t.bindable.name;
        const s = e.parse(t.attr.rawValue, pt);
        let n = f;
        if (s.semiIdx > -1) {
            const e = t.attr.rawValue.slice(s.semiIdx + 1);
            const i = e.indexOf(":");
            if (i > -1) {
                const t = e.slice(0, i).trim();
                const s = e.slice(i + 1).trim();
                const r = this.He.parse(t, s);
                n = [ new MultiAttrInstruction(s, r.target, r.command) ];
            }
        }
        return new IteratorBindingInstruction(s, i, n);
    }
};

Ks = __decorate([ bindingCommand("for") ], Ks);

let Xs = class TriggerBindingCommand {
    get type() {
        return Vs;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, vt), t.attr.target, true, false, t.attr.parts?.[2] ?? null);
    }
};

Xs = __decorate([ bindingCommand("trigger") ], Xs);

let Qs = class CaptureBindingCommand {
    get type() {
        return Vs;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, vt), t.attr.target, false, true, t.attr.parts?.[2] ?? null);
    }
};

Qs = __decorate([ bindingCommand("capture") ], Qs);

let Ys = class AttrBindingCommand {
    get type() {
        return Vs;
    }
    build(t, e) {
        return new AttributeBindingInstruction(t.attr.target, e.parse(t.attr.rawValue, bt), t.attr.target);
    }
};

Ys = __decorate([ bindingCommand("attr") ], Ys);

let Zs = class StyleBindingCommand {
    get type() {
        return Vs;
    }
    build(t, e) {
        return new AttributeBindingInstruction("style", e.parse(t.attr.rawValue, bt), t.attr.target);
    }
};

Zs = __decorate([ bindingCommand("style") ], Zs);

let Js = class ClassBindingCommand {
    get type() {
        return Vs;
    }
    build(t, e) {
        return new AttributeBindingInstruction("class", e.parse(t.attr.rawValue, bt), t.attr.target);
    }
};

Js = __decorate([ bindingCommand("class") ], Js);

let tn = class RefBindingCommand {
    get type() {
        return Vs;
    }
    build(t, e) {
        return new RefBindingInstruction(e.parse(t.attr.rawValue, bt), t.attr.target);
    }
};

tn = __decorate([ bindingCommand("ref") ], tn);

let en = class SpreadBindingCommand {
    get type() {
        return Vs;
    }
    build(t) {
        return new SpreadBindingInstruction;
    }
};

en = __decorate([ bindingCommand("...$attrs") ], en);

const sn = /*@__PURE__*/ Wt("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

const o = t => {
    const e = createLookup();
    t = isString(t) ? t.split(" ") : t;
    let i;
    for (i of t) {
        e[i] = true;
    }
    return e;
};

class NoopSVGAnalyzer {
    isStandardSvgAttribute(t, e) {
        return false;
    }
}

class SVGAnalyzer {
    static register(t) {
        t.register(jt(this, this), zt(this, sn));
    }
    constructor() {
        this.Fe = ht(createLookup(), {
            a: o("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage target transform xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            altGlyph: o("class dx dy externalResourcesRequired format glyphRef id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            altglyph: createLookup(),
            altGlyphDef: o("id xml:base xml:lang xml:space"),
            altglyphdef: createLookup(),
            altGlyphItem: o("id xml:base xml:lang xml:space"),
            altglyphitem: createLookup(),
            animate: o("accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            animateColor: o("accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            animateMotion: o("accumulate additive begin by calcMode dur end externalResourcesRequired fill from id keyPoints keySplines keyTimes max min onbegin onend onload onrepeat origin path repeatCount repeatDur requiredExtensions requiredFeatures restart rotate systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            animateTransform: o("accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to type values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            circle: o("class cx cy externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup r requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            clipPath: o("class clipPathUnits externalResourcesRequired id requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            "color-profile": o("id local name rendering-intent xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            cursor: o("externalResourcesRequired id requiredExtensions requiredFeatures systemLanguage x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            defs: o("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            desc: o("class id style xml:base xml:lang xml:space"),
            ellipse: o("class cx cy externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rx ry style systemLanguage transform xml:base xml:lang xml:space"),
            feBlend: o("class height id in in2 mode result style width x xml:base xml:lang xml:space y"),
            feColorMatrix: o("class height id in result style type values width x xml:base xml:lang xml:space y"),
            feComponentTransfer: o("class height id in result style width x xml:base xml:lang xml:space y"),
            feComposite: o("class height id in in2 k1 k2 k3 k4 operator result style width x xml:base xml:lang xml:space y"),
            feConvolveMatrix: o("bias class divisor edgeMode height id in kernelMatrix kernelUnitLength order preserveAlpha result style targetX targetY width x xml:base xml:lang xml:space y"),
            feDiffuseLighting: o("class diffuseConstant height id in kernelUnitLength result style surfaceScale width x xml:base xml:lang xml:space y"),
            feDisplacementMap: o("class height id in in2 result scale style width x xChannelSelector xml:base xml:lang xml:space y yChannelSelector"),
            feDistantLight: o("azimuth elevation id xml:base xml:lang xml:space"),
            feFlood: o("class height id result style width x xml:base xml:lang xml:space y"),
            feFuncA: o("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feFuncB: o("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feFuncG: o("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feFuncR: o("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feGaussianBlur: o("class height id in result stdDeviation style width x xml:base xml:lang xml:space y"),
            feImage: o("class externalResourcesRequired height id preserveAspectRatio result style width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            feMerge: o("class height id result style width x xml:base xml:lang xml:space y"),
            feMergeNode: o("id xml:base xml:lang xml:space"),
            feMorphology: o("class height id in operator radius result style width x xml:base xml:lang xml:space y"),
            feOffset: o("class dx dy height id in result style width x xml:base xml:lang xml:space y"),
            fePointLight: o("id x xml:base xml:lang xml:space y z"),
            feSpecularLighting: o("class height id in kernelUnitLength result specularConstant specularExponent style surfaceScale width x xml:base xml:lang xml:space y"),
            feSpotLight: o("id limitingConeAngle pointsAtX pointsAtY pointsAtZ specularExponent x xml:base xml:lang xml:space y z"),
            feTile: o("class height id in result style width x xml:base xml:lang xml:space y"),
            feTurbulence: o("baseFrequency class height id numOctaves result seed stitchTiles style type width x xml:base xml:lang xml:space y"),
            filter: o("class externalResourcesRequired filterRes filterUnits height id primitiveUnits style width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            font: o("class externalResourcesRequired horiz-adv-x horiz-origin-x horiz-origin-y id style vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space"),
            "font-face": o("accent-height alphabetic ascent bbox cap-height descent font-family font-size font-stretch font-style font-variant font-weight hanging id ideographic mathematical overline-position overline-thickness panose-1 slope stemh stemv strikethrough-position strikethrough-thickness underline-position underline-thickness unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical widths x-height xml:base xml:lang xml:space"),
            "font-face-format": o("id string xml:base xml:lang xml:space"),
            "font-face-name": o("id name xml:base xml:lang xml:space"),
            "font-face-src": o("id xml:base xml:lang xml:space"),
            "font-face-uri": o("id xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            foreignObject: o("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform width x xml:base xml:lang xml:space y"),
            g: o("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            glyph: o("arabic-form class d glyph-name horiz-adv-x id lang orientation style unicode vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space"),
            glyphRef: o("class dx dy format glyphRef id style x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            glyphref: createLookup(),
            hkern: o("g1 g2 id k u1 u2 xml:base xml:lang xml:space"),
            image: o("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage transform width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            line: o("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform x1 x2 xml:base xml:lang xml:space y1 y2"),
            linearGradient: o("class externalResourcesRequired gradientTransform gradientUnits id spreadMethod style x1 x2 xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space y1 y2"),
            marker: o("class externalResourcesRequired id markerHeight markerUnits markerWidth orient preserveAspectRatio refX refY style viewBox xml:base xml:lang xml:space"),
            mask: o("class externalResourcesRequired height id maskContentUnits maskUnits requiredExtensions requiredFeatures style systemLanguage width x xml:base xml:lang xml:space y"),
            metadata: o("id xml:base xml:lang xml:space"),
            "missing-glyph": o("class d horiz-adv-x id style vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space"),
            mpath: o("externalResourcesRequired id xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            path: o("class d externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup pathLength requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            pattern: o("class externalResourcesRequired height id patternContentUnits patternTransform patternUnits preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage viewBox width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            polygon: o("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup points requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            polyline: o("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup points requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            radialGradient: o("class cx cy externalResourcesRequired fx fy gradientTransform gradientUnits id r spreadMethod style xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space"),
            rect: o("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rx ry style systemLanguage transform width x xml:base xml:lang xml:space y"),
            script: o("externalResourcesRequired id type xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            set: o("attributeName attributeType begin dur end externalResourcesRequired fill id max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            stop: o("class id offset style xml:base xml:lang xml:space"),
            style: o("id media title type xml:base xml:lang xml:space"),
            svg: o("baseProfile class contentScriptType contentStyleType externalResourcesRequired height id onabort onactivate onclick onerror onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup onresize onscroll onunload onzoom preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage version viewBox width x xml:base xml:lang xml:space y zoomAndPan"),
            switch: o("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            symbol: o("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup preserveAspectRatio style viewBox xml:base xml:lang xml:space"),
            text: o("class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength transform x xml:base xml:lang xml:space y"),
            textPath: o("class externalResourcesRequired id lengthAdjust method onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures spacing startOffset style systemLanguage textLength xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space"),
            title: o("class id style xml:base xml:lang xml:space"),
            tref: o("class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength x xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space y"),
            tspan: o("class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength x xml:base xml:lang xml:space y"),
            use: o("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            view: o("externalResourcesRequired id preserveAspectRatio viewBox viewTarget xml:base xml:lang xml:space zoomAndPan"),
            vkern: o("g1 g2 id k u1 u2 xml:base xml:lang xml:space")
        });
        this.Oe = o("a altGlyph animate animateColor circle clipPath defs ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feFlood feGaussianBlur feImage feMerge feMorphology feOffset feSpecularLighting feTile feTurbulence filter font foreignObject g glyph glyphRef image line linearGradient marker mask missing-glyph path pattern polygon polyline radialGradient rect stop svg switch symbol text textPath tref tspan use");
        this.Ve = o("alignment-baseline baseline-shift clip-path clip-rule clip color-interpolation-filters color-interpolation color-profile color-rendering color cursor direction display dominant-baseline enable-background fill-opacity fill-rule fill filter flood-color flood-opacity font-family font-size-adjust font-size font-stretch font-style font-variant font-weight glyph-orientation-horizontal glyph-orientation-vertical image-rendering kerning letter-spacing lighting-color marker-end marker-mid marker-start mask opacity overflow pointer-events shape-rendering stop-color stop-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width stroke text-anchor text-decoration text-rendering unicode-bidi visibility word-spacing writing-mode");
        const t = c(se);
        this.SVGElement = t.globalThis.SVGElement;
        const e = t.document.createElement("div");
        e.innerHTML = "<svg><altGlyph /></svg>";
        if (e.firstElementChild.nodeName === "altglyph") {
            const t = this.Fe;
            let e = t.altGlyph;
            t.altGlyph = t.altglyph;
            t.altglyph = e;
            e = t.altGlyphDef;
            t.altGlyphDef = t.altglyphdef;
            t.altglyphdef = e;
            e = t.altGlyphItem;
            t.altGlyphItem = t.altglyphitem;
            t.altglyphitem = e;
            e = t.glyphRef;
            t.glyphRef = t.glyphref;
            t.glyphref = e;
        }
    }
    isStandardSvgAttribute(t, e) {
        if (!(t instanceof this.SVGElement)) {
            return false;
        }
        return this.Oe[t.nodeName] === true && this.Ve[e] === true || this.Fe[t.nodeName]?.[e] === true;
    }
}

const nn = /*@__PURE__*/ Wt("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    constructor() {
        this.fns = [];
        this.$e = createLookup();
        this.Ne = createLookup();
        this.svg = c(sn);
        this.useMapping({
            LABEL: {
                for: "htmlFor"
            },
            IMG: {
                usemap: "useMap"
            },
            INPUT: {
                maxlength: "maxLength",
                minlength: "minLength",
                formaction: "formAction",
                formenctype: "formEncType",
                formmethod: "formMethod",
                formnovalidate: "formNoValidate",
                formtarget: "formTarget",
                inputmode: "inputMode"
            },
            TEXTAREA: {
                maxlength: "maxLength"
            },
            TD: {
                rowspan: "rowSpan",
                colspan: "colSpan"
            },
            TH: {
                rowspan: "rowSpan",
                colspan: "colSpan"
            }
        });
        this.useGlobalMapping({
            accesskey: "accessKey",
            contenteditable: "contentEditable",
            tabindex: "tabIndex",
            textcontent: "textContent",
            innerhtml: "innerHTML",
            scrolltop: "scrollTop",
            scrollleft: "scrollLeft",
            readonly: "readOnly"
        });
    }
    useMapping(t) {
        var e;
        let i;
        let s;
        let n;
        let r;
        for (n in t) {
            i = t[n];
            s = (e = this.$e)[n] ?? (e[n] = createLookup());
            for (r in i) {
                if (s[r] !== void 0) {
                    throw createError(r, n);
                }
                s[r] = i[r];
            }
        }
    }
    useGlobalMapping(t) {
        const e = this.Ne;
        for (const i in t) {
            if (e[i] !== void 0) {
                throw createError(i, "*");
            }
            e[i] = t[i];
        }
    }
    useTwoWay(t) {
        this.fns.push(t);
    }
    isTwoWay(t, e) {
        return shouldDefaultToTwoWay(t, e) || this.fns.length > 0 && this.fns.some((i => i(t, e)));
    }
    map(t, e) {
        return this.$e[t.nodeName]?.[e] ?? this.Ne[e] ?? (isDataAttribute(t, e, this.svg) ? e : null);
    }
}

function shouldDefaultToTwoWay(t, e) {
    switch (t.nodeName) {
      case "INPUT":
        switch (t.type) {
          case "checkbox":
          case "radio":
            return e === "checked";

          default:
            return e === "value" || e === "files" || e === "value-as-number" || e === "value-as-date";
        }

      case "TEXTAREA":
      case "SELECT":
        return e === "value";

      default:
        switch (e) {
          case "textcontent":
          case "innerhtml":
            return t.hasAttribute("contenteditable");

          case "scrolltop":
          case "scrollleft":
            return true;

          default:
            return false;
        }
    }
}

function createError(t, e) {
    return createMappedError(719, t, e);
}

const rn = createLookup();

class AttributeNSAccessor {
    static forNs(t) {
        return rn[t] ?? (rn[t] = new AttributeNSAccessor(t));
    }
    constructor(t) {
        this.ns = t;
        this.type = kt | Ct;
    }
    getValue(t, e) {
        return t.getAttributeNS(this.ns, e);
    }
    setValue(t, e, i) {
        if (t == null) {
            e.removeAttributeNS(this.ns, i);
        } else {
            e.setAttributeNS(this.ns, i, t);
        }
    }
}

mixinNoopSubscribable(AttributeNSAccessor);

class DataAttributeAccessor {
    constructor() {
        this.type = kt | Ct;
    }
    getValue(t, e) {
        return t.getAttribute(e);
    }
    setValue(t, e, i) {
        if (t == null) {
            e.removeAttribute(i);
        } else {
            e.setAttribute(i, t);
        }
    }
}

mixinNoopSubscribable(DataAttributeAccessor);

const on = new DataAttributeAccessor;

const ln = {
    childList: true,
    subtree: true,
    characterData: true
};

function defaultMatcher$1(t, e) {
    return t === e;
}

class SelectValueObserver {
    constructor(t, e, i, s) {
        this.type = kt | yt | Ct;
        this.v = void 0;
        this.ov = void 0;
        this.We = false;
        this.je = void 0;
        this.ze = void 0;
        this.iO = false;
        this.ut = false;
        this.ct = t;
        this.oL = s;
        this.cf = i;
    }
    getValue() {
        return this.iO ? this.v : this.ct.multiple ? getSelectedOptions(this.ct.options) : this.ct.value;
    }
    setValue(t) {
        this.ov = this.v;
        this.v = t;
        this.We = t !== this.ov;
        this.Ue(t instanceof Array ? t : null);
        this.bt();
    }
    bt() {
        if (this.We) {
            this.We = false;
            this.syncOptions();
        }
    }
    handleCollectionChange() {
        this.syncOptions();
    }
    syncOptions() {
        const t = this.v;
        const e = this.ct;
        const i = isArray(t);
        const s = e.matcher ?? defaultMatcher$1;
        const n = e.options;
        let r = n.length;
        while (r-- > 0) {
            const e = n[r];
            const l = lt.call(e, "model") ? e.model : e.value;
            if (i) {
                e.selected = t.findIndex((t => !!s(l, t))) !== -1;
                continue;
            }
            e.selected = !!s(l, t);
        }
    }
    syncValue() {
        const t = this.ct;
        const e = t.options;
        const i = e.length;
        const s = this.v;
        let n = 0;
        if (t.multiple) {
            if (!(s instanceof Array)) {
                return true;
            }
            let r;
            const l = t.matcher || defaultMatcher$1;
            const a = [];
            while (n < i) {
                r = e[n];
                if (r.selected) {
                    a.push(lt.call(r, "model") ? r.model : r.value);
                }
                ++n;
            }
            let h;
            n = 0;
            while (n < s.length) {
                h = s[n];
                if (a.findIndex((t => !!l(h, t))) === -1) {
                    s.splice(n, 1);
                } else {
                    ++n;
                }
            }
            n = 0;
            while (n < a.length) {
                h = a[n];
                if (s.findIndex((t => !!l(h, t))) === -1) {
                    s.push(h);
                }
                ++n;
            }
            return false;
        }
        let r = null;
        let l;
        while (n < i) {
            l = e[n];
            if (l.selected) {
                r = lt.call(l, "model") ? l.model : l.value;
                break;
            }
            ++n;
        }
        this.ov = this.v;
        this.v = r;
        return true;
    }
    ft() {
        (this.ze = createMutationObserver(this.ct, this.Ge.bind(this))).observe(this.ct, ln);
        this.Ue(this.v instanceof Array ? this.v : null);
        this.iO = true;
    }
    dt() {
        this.ze.disconnect();
        this.je?.unsubscribe(this);
        this.ze = this.je = void 0;
        this.iO = false;
    }
    Ue(t) {
        this.je?.unsubscribe(this);
        this.je = void 0;
        if (t != null) {
            if (!this.ct.multiple) {
                throw createError$1(`AUR0654`);
            }
            (this.je = this.oL.getArrayObserver(t)).subscribe(this);
        }
    }
    handleEvent() {
        const t = this.syncValue();
        if (t) {
            this.Ke();
        }
    }
    Ge(t) {
        this.syncOptions();
        const e = this.syncValue();
        if (e) {
            this.Ke();
        }
    }
    Ke() {
        an = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, an);
    }
}

mixinNodeObserverUseConfig(SelectValueObserver);

F(SelectValueObserver);

function getSelectedOptions(t) {
    const e = [];
    if (t.length === 0) {
        return e;
    }
    const i = t.length;
    let s = 0;
    let n;
    while (i > s) {
        n = t[s];
        if (n.selected) {
            e[e.length] = lt.call(n, "model") ? n.model : n.value;
        }
        ++s;
    }
    return e;
}

let an = void 0;

const hn = "--";

class StyleAttributeAccessor {
    constructor(t) {
        this.obj = t;
        this.type = kt | Ct;
        this.v = "";
        this.ov = "";
        this.styles = {};
        this.version = 0;
        this.We = false;
    }
    getValue() {
        return this.obj.style.cssText;
    }
    setValue(t) {
        this.v = t;
        this.We = t !== this.ov;
        this.bt();
    }
    Xe(t) {
        const e = [];
        const i = /url\([^)]+$/;
        let s = 0;
        let n = "";
        let r;
        let l;
        let a;
        let h;
        while (s < t.length) {
            r = t.indexOf(";", s);
            if (r === -1) {
                r = t.length;
            }
            n += t.substring(s, r);
            s = r + 1;
            if (i.test(n)) {
                n += ";";
                continue;
            }
            l = n.indexOf(":");
            a = n.substring(0, l).trim();
            h = n.substring(l + 1).trim();
            e.push([ a, h ]);
            n = "";
        }
        return e;
    }
    Qe(t) {
        let e;
        let s;
        const n = [];
        for (s in t) {
            e = t[s];
            if (e == null) {
                continue;
            }
            if (isString(e)) {
                if (s.startsWith(hn)) {
                    n.push([ s, e ]);
                    continue;
                }
                n.push([ i(s), e ]);
                continue;
            }
            n.push(...this.Ye(e));
        }
        return n;
    }
    Ze(t) {
        const e = t.length;
        if (e > 0) {
            const i = [];
            let s = 0;
            for (;e > s; ++s) {
                i.push(...this.Ye(t[s]));
            }
            return i;
        }
        return f;
    }
    Ye(t) {
        if (isString(t)) {
            return this.Xe(t);
        }
        if (t instanceof Array) {
            return this.Ze(t);
        }
        if (t instanceof Object) {
            return this.Qe(t);
        }
        return f;
    }
    bt() {
        if (this.We) {
            this.We = false;
            const t = this.v;
            const e = this.styles;
            const i = this.Ye(t);
            let s;
            let n = this.version;
            this.ov = t;
            let r;
            let l;
            let a;
            let h = 0;
            const c = i.length;
            for (;h < c; ++h) {
                r = i[h];
                l = r[0];
                a = r[1];
                this.setProperty(l, a);
                e[l] = n;
            }
            this.styles = e;
            this.version += 1;
            if (n === 0) {
                return;
            }
            n -= 1;
            for (s in e) {
                if (!lt.call(e, s) || e[s] !== n) {
                    continue;
                }
                this.obj.style.removeProperty(s);
            }
        }
    }
    setProperty(t, e) {
        let i = "";
        if (e != null && isFunction(e.indexOf) && e.includes("!important")) {
            i = "important";
            e = e.replace("!important", "");
        }
        this.obj.style.setProperty(t, e, i);
    }
    bind() {
        this.v = this.ov = this.obj.style.cssText;
    }
}

mixinNoopSubscribable(StyleAttributeAccessor);

class ValueAttributeObserver {
    constructor(t, e, i) {
        this.type = kt | yt | Ct;
        this.v = "";
        this.ov = "";
        this.We = false;
        this.ut = false;
        this.ct = t;
        this.k = e;
        this.cf = i;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (dt(t, this.v)) {
            return;
        }
        this.ov = this.v;
        this.v = t;
        this.We = true;
        if (!this.cf.readonly) {
            this.bt();
        }
    }
    bt() {
        if (this.We) {
            this.We = false;
            this.ct[this.k] = this.v ?? this.cf.default;
            this.Ke();
        }
    }
    handleEvent() {
        this.ov = this.v;
        this.v = this.ct[this.k];
        if (this.ov !== this.v) {
            this.We = false;
            this.Ke();
        }
    }
    ft() {
        this.v = this.ov = this.ct[this.k];
    }
    Ke() {
        cn = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, cn);
    }
}

mixinNodeObserverUseConfig(ValueAttributeObserver);

F(ValueAttributeObserver);

let cn = void 0;

const un = "http://www.w3.org/1999/xlink";

const dn = "http://www.w3.org/XML/1998/namespace";

const mn = "http://www.w3.org/2000/xmlns/";

const gn = ht(createLookup(), {
    "xlink:actuate": [ "actuate", un ],
    "xlink:arcrole": [ "arcrole", un ],
    "xlink:href": [ "href", un ],
    "xlink:role": [ "role", un ],
    "xlink:show": [ "show", un ],
    "xlink:title": [ "title", un ],
    "xlink:type": [ "type", un ],
    "xml:lang": [ "lang", dn ],
    "xml:space": [ "space", dn ],
    xmlns: [ "xmlns", mn ],
    "xmlns:xlink": [ "xlink", mn ]
});

const pn = new U;

pn.type = kt | Ct;

class NodeObserverLocator {
    static register(t) {
        t.register(jt(this, this), zt(this, G));
    }
    constructor() {
        this.allowDirtyCheck = true;
        this.Je = createLookup();
        this.ti = createLookup();
        this.ei = createLookup();
        this.ii = createLookup();
        this.si = c(A);
        this.p = c(se);
        this.ni = c(K);
        this.svg = c(sn);
        const t = [ "change", "input" ];
        const e = {
            events: t,
            default: ""
        };
        this.useConfig({
            INPUT: {
                value: e,
                valueAsNumber: {
                    events: t,
                    default: 0
                },
                checked: {
                    type: CheckedObserver,
                    events: t
                },
                files: {
                    events: t,
                    readonly: true
                }
            },
            SELECT: {
                value: {
                    type: SelectValueObserver,
                    events: [ "change" ],
                    default: ""
                }
            },
            TEXTAREA: {
                value: e
            }
        });
        const i = {
            events: [ "change", "input", "blur", "keyup", "paste" ],
            default: ""
        };
        const s = {
            events: [ "scroll" ],
            default: 0
        };
        this.useConfigGlobal({
            scrollTop: s,
            scrollLeft: s,
            textContent: i,
            innerHTML: i
        });
        this.overrideAccessorGlobal("css", "style", "class");
        this.overrideAccessor({
            INPUT: [ "value", "checked", "model" ],
            SELECT: [ "value" ],
            TEXTAREA: [ "value" ]
        });
    }
    handles(t, e) {
        return t instanceof this.p.Node;
    }
    useConfig(t, e, i) {
        const s = this.Je;
        let n;
        if (isString(t)) {
            n = s[t] ?? (s[t] = createLookup());
            if (n[e] == null) {
                n[e] = i;
            } else {
                throwMappingExisted(t, e);
            }
        } else {
            for (const i in t) {
                n = s[i] ?? (s[i] = createLookup());
                const r = t[i];
                for (e in r) {
                    if (n[e] == null) {
                        n[e] = r[e];
                    } else {
                        throwMappingExisted(i, e);
                    }
                }
            }
        }
    }
    useConfigGlobal(t, e) {
        const i = this.ti;
        if (typeof t === "object") {
            for (const e in t) {
                if (i[e] == null) {
                    i[e] = t[e];
                } else {
                    throwMappingExisted("*", e);
                }
            }
        } else {
            if (i[t] == null) {
                i[t] = e;
            } else {
                throwMappingExisted("*", t);
            }
        }
    }
    getAccessor(t, e, i) {
        if (e in this.ii || e in (this.ei[t.tagName] ?? B)) {
            return this.getObserver(t, e, i);
        }
        switch (e) {
          case "src":
          case "href":
          case "role":
          case "minLength":
          case "maxLength":
          case "placeholder":
          case "size":
          case "pattern":
          case "title":
          case "popovertarget":
          case "popovertargetaction":
            return on;

          default:
            {
                const i = gn[e];
                if (i !== undefined) {
                    return AttributeNSAccessor.forNs(i[1]);
                }
                if (isDataAttribute(t, e, this.svg)) {
                    return on;
                }
                return pn;
            }
        }
    }
    overrideAccessor(t, e) {
        var i, s;
        let n;
        if (isString(t)) {
            n = (i = this.ei)[t] ?? (i[t] = createLookup());
            n[e] = true;
        } else {
            for (const e in t) {
                for (const i of t[e]) {
                    n = (s = this.ei)[e] ?? (s[e] = createLookup());
                    n[i] = true;
                }
            }
        }
    }
    overrideAccessorGlobal(...t) {
        for (const e of t) {
            this.ii[e] = true;
        }
    }
    getNodeObserverConfig(t, e) {
        return this.Je[t.tagName]?.[e] ?? this.ti[e];
    }
    getNodeObserver(t, e, i) {
        const s = this.Je[t.tagName]?.[e] ?? this.ti[e];
        let n;
        if (s != null) {
            n = new (s.type ?? ValueAttributeObserver)(t, e, s, i, this.si);
            if (!n.doNotCache) {
                X(t)[e] = n;
            }
            return n;
        }
        return null;
    }
    getObserver(t, e, i) {
        switch (e) {
          case "class":
            return new ClassAttributeAccessor(t);

          case "css":
          case "style":
            return new StyleAttributeAccessor(t);
        }
        const s = this.getNodeObserver(t, e, i);
        if (s != null) {
            return s;
        }
        const n = gn[e];
        if (n !== undefined) {
            return AttributeNSAccessor.forNs(n[1]);
        }
        if (isDataAttribute(t, e, this.svg)) {
            return on;
        }
        if (e in t.constructor.prototype) {
            if (this.allowDirtyCheck) {
                return this.ni.createProperty(t, e);
            }
            throw createMappedError(652, e);
        } else {
            return new Q(t, e);
        }
    }
}

function getCollectionObserver(t, e) {
    if (t instanceof Array) {
        return e.getArrayObserver(t);
    }
    if (t instanceof Map) {
        return e.getMapObserver(t);
    }
    if (t instanceof Set) {
        return e.getSetObserver(t);
    }
}

function throwMappingExisted(t, e) {
    throw createMappedError(653, t, e);
}

function defaultMatcher(t, e) {
    return t === e;
}

class CheckedObserver {
    constructor(t, e, i, s) {
        this.type = kt | yt | Ct;
        this.v = void 0;
        this.ov = void 0;
        this.ri = void 0;
        this.oi = void 0;
        this.ut = false;
        this.ct = t;
        this.oL = s;
        this.cf = i;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        const e = this.v;
        if (t === e) {
            return;
        }
        this.v = t;
        this.ov = e;
        this.li();
        this.ai();
        this.Ke();
    }
    handleCollectionChange() {
        this.ai();
    }
    handleChange(t, e) {
        this.ai();
    }
    ai() {
        const t = this.v;
        const e = this.ct;
        const i = lt.call(e, "model") ? e.model : e.value;
        const s = e.type === "radio";
        const n = e.matcher !== void 0 ? e.matcher : defaultMatcher;
        if (s) {
            e.checked = !!n(t, i);
        } else if (t === true) {
            e.checked = true;
        } else {
            let s = false;
            if (isArray(t)) {
                s = t.findIndex((t => !!n(t, i))) !== -1;
            } else if (t instanceof Set) {
                for (const e of t) {
                    if (n(e, i)) {
                        s = true;
                        break;
                    }
                }
            } else if (t instanceof Map) {
                for (const e of t) {
                    const t = e[0];
                    const r = e[1];
                    if (n(t, i) && r === true) {
                        s = true;
                        break;
                    }
                }
            }
            e.checked = s;
        }
    }
    handleEvent() {
        let t = this.ov = this.v;
        const e = this.ct;
        const i = lt.call(e, "model") ? e.model : e.value;
        const s = e.checked;
        const n = e.matcher !== void 0 ? e.matcher : defaultMatcher;
        if (e.type === "checkbox") {
            if (isArray(t)) {
                const e = t.findIndex((t => !!n(t, i)));
                if (s && e === -1) {
                    t.push(i);
                } else if (!s && e !== -1) {
                    t.splice(e, 1);
                }
                return;
            } else if (t instanceof Set) {
                const e = {};
                let r = e;
                for (const e of t) {
                    if (n(e, i) === true) {
                        r = e;
                        break;
                    }
                }
                if (s && r === e) {
                    t.add(i);
                } else if (!s && r !== e) {
                    t.delete(r);
                }
                return;
            } else if (t instanceof Map) {
                let e;
                for (const s of t) {
                    const t = s[0];
                    if (n(t, i) === true) {
                        e = t;
                        break;
                    }
                }
                t.set(e, s);
                return;
            }
            t = s;
        } else if (s) {
            t = i;
        } else {
            return;
        }
        this.v = t;
        this.Ke();
    }
    ft() {
        this.li();
    }
    dt() {
        this.ri?.unsubscribe(this);
        this.oi?.unsubscribe(this);
        this.ri = this.oi = void 0;
    }
    Ke() {
        vn = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, vn);
    }
    li() {
        const t = this.ct;
        (this.oi ?? (this.oi = t.$observers?.model ?? t.$observers?.value))?.subscribe(this);
        this.ri?.unsubscribe(this);
        this.ri = void 0;
        if (t.type === "checkbox") {
            (this.ri = getCollectionObserver(this.v, this.oL))?.subscribe(this);
        }
    }
}

mixinNodeObserverUseConfig(CheckedObserver);

F(CheckedObserver);

let vn = void 0;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) {
            throw createMappedError(9994, e);
        }
        e.useTargetObserver(on);
    }
}

bindingBehavior("attr")(AttrBindingBehavior);

class SelfBindingBehavior {
    bind(t, e) {
        if (!(e instanceof ListenerBinding)) {
            throw createMappedError(801);
        }
        e.self = true;
    }
    unbind(t, e) {
        e.self = false;
    }
}

bindingBehavior("self")(SelfBindingBehavior);

class UpdateTriggerBindingBehavior {
    constructor() {
        this.oL = c(V);
        this.hi = c(G);
    }
    bind(t, e, ...i) {
        if (!(this.hi instanceof NodeObserverLocator)) {
            throw createMappedError(9993);
        }
        if (i.length === 0) {
            throw createMappedError(802);
        }
        if (!(e instanceof PropertyBinding) || !(e.mode & St)) {
            throw createMappedError(803);
        }
        const s = this.hi.getNodeObserverConfig(e.target, e.targetProperty);
        if (s == null) {
            throw createMappedError(9992, e);
        }
        const n = this.hi.getNodeObserver(e.target, e.targetProperty, this.oL);
        n.useConfig({
            readonly: s.readonly,
            default: s.default,
            events: i
        });
        e.useTargetObserver(n);
    }
}

bindingBehavior("updateTrigger")(UpdateTriggerBindingBehavior);

class If {
    constructor() {
        this.elseFactory = void 0;
        this.elseView = void 0;
        this.ifView = void 0;
        this.view = void 0;
        this.value = false;
        this.cache = true;
        this.pending = void 0;
        this.ui = false;
        this.fi = 0;
        this.di = c(Te);
        this.l = c(fs);
    }
    attaching(t, e) {
        return this.mi(this.value);
    }
    detaching(t, e) {
        this.ui = true;
        return b(this.pending, (() => {
            this.ui = false;
            this.pending = void 0;
            void this.view?.deactivate(t, this.$controller);
        }));
    }
    valueChanged(t, e) {
        if (!this.$controller.isActive) return;
        t = !!t;
        e = !!e;
        if (t !== e) return this.mi(t);
    }
    mi(t) {
        const e = this.view;
        const i = this.$controller;
        const s = this.fi++;
        const isCurrent = () => !this.ui && this.fi === s + 1;
        let n;
        return b(this.pending, (() => this.pending = b(e?.deactivate(e, i), (() => {
            if (!isCurrent()) {
                return;
            }
            if (t) {
                n = this.view = this.ifView = this.cache && this.ifView != null ? this.ifView : this.di.create();
            } else {
                n = this.view = this.elseView = this.cache && this.elseView != null ? this.elseView : this.elseFactory?.create();
            }
            if (n == null) {
                return;
            }
            n.setLocation(this.l);
            return b(n.activate(n, i, i.scope), (() => {
                if (isCurrent()) {
                    this.pending = void 0;
                }
            }));
        }))));
    }
    dispose() {
        this.ifView?.dispose();
        this.elseView?.dispose();
        this.ifView = this.elseView = this.view = void 0;
    }
    accept(t) {
        if (this.view?.accept(t) === true) {
            return true;
        }
    }
}

__decorate([ bindable ], If.prototype, "value", void 0);

__decorate([ bindable({
    set: t => t === "" || !!t && t !== "false"
}) ], If.prototype, "cache", void 0);

templateController("if")(If);

class Else {
    constructor() {
        this.f = c(Te);
    }
    link(t, e, i, s) {
        const n = t.children;
        const r = n[n.length - 1];
        if (r instanceof If) {
            r.elseFactory = this.f;
        } else if (r.viewModel instanceof If) {
            r.viewModel.elseFactory = this.f;
        } else {
            throw createMappedError(810);
        }
    }
}

templateController({
    name: "else"
})(Else);

function dispose(t) {
    t.dispose();
}

const bn = [ "BindingBehavior", "ValueConverter" ];

class Repeat {
    constructor(t, e, i, s, n) {
        this.views = [];
        this.gi = [];
        this.key = null;
        this.pi = new Map;
        this.vi = new Map;
        this.bi = void 0;
        this.xi = false;
        this.wi = false;
        this.yi = null;
        this.ki = void 0;
        this.Ci = false;
        const r = t.props[0].props[0];
        if (r !== void 0) {
            const {to: t, value: i, command: s} = r;
            if (t === "key") {
                if (s === null) {
                    this.key = i;
                } else if (s === "bind") {
                    this.key = e.parse(i, bt);
                } else {
                    throw createMappedError(775, s);
                }
            } else {
                throw createMappedError(776, t);
            }
        }
        this.l = i;
        this.Ai = s;
        this.f = n;
    }
    binding(t, e) {
        const i = this.Ai.bindings;
        const s = i.length;
        let n = void 0;
        let r;
        let l = 0;
        for (;s > l; ++l) {
            n = i[l];
            if (n.target === this && n.targetProperty === "items") {
                r = this.forOf = n.ast;
                this.Bi = n;
                let t = r.iterable;
                while (t != null && bn.includes(t.$kind)) {
                    t = t.expression;
                    this.xi = true;
                }
                this.yi = t;
                break;
            }
        }
        this.Si();
        const a = r.declaration;
        if (!(this.Ci = a.$kind === "ArrayDestructuring" || a.$kind === "ObjectDestructuring")) {
            this.local = L(a, this.$controller.scope, n, null);
        }
    }
    attaching(t, e) {
        this._i();
        return this.Ri(t);
    }
    detaching(t, e) {
        this.Si();
        return this.Ti(t);
    }
    unbinding(t, e) {
        this.vi.clear();
        this.pi.clear();
    }
    itemsChanged() {
        if (!this.$controller.isActive) {
            return;
        }
        this.Si();
        this._i();
        this.Ii(this.items, void 0);
    }
    handleCollectionChange(t, e) {
        const i = this.$controller;
        if (!i.isActive) {
            return;
        }
        if (this.xi) {
            if (this.wi) {
                return;
            }
            this.wi = true;
            this.items = L(this.forOf.iterable, i.scope, this.Bi, null);
            this.wi = false;
            return;
        }
        this._i();
        this.Ii(t, e);
    }
    Ii(t, e) {
        const i = this.views;
        this.gi = i.slice();
        const s = i.length;
        const n = this.key;
        const r = n !== null;
        if (r || e === void 0) {
            const t = this.local;
            const l = this.ki;
            const a = l.length;
            const h = this.forOf;
            const c = h.declaration;
            const u = this.Bi;
            const f = this.Ci;
            e = Y(a);
            let d = 0;
            if (s === 0) {
                for (;d < a; ++d) {
                    e[d] = -2;
                }
            } else if (a === 0) {
                if (f) {
                    for (d = 0; d < s; ++d) {
                        e.deletedIndices.push(d);
                        e.deletedItems.push(L(c, i[d].scope, u, null));
                    }
                } else {
                    for (d = 0; d < s; ++d) {
                        e.deletedIndices.push(d);
                        e.deletedItems.push(i[d].scope.bindingContext[t]);
                    }
                }
            } else {
                const m = Array(s);
                if (f) {
                    for (d = 0; d < s; ++d) {
                        m[d] = L(c, i[d].scope, u, null);
                    }
                } else {
                    for (d = 0; d < s; ++d) {
                        m[d] = i[d].scope.bindingContext[t];
                    }
                }
                let g;
                let p;
                let v;
                let b;
                let x = 0;
                const w = s - 1;
                const y = a - 1;
                const k = new Map;
                const C = new Map;
                const A = this.pi;
                const B = this.vi;
                const S = this.$controller.scope;
                d = 0;
                t: {
                    while (true) {
                        if (r) {
                            g = m[d];
                            p = l[d];
                            v = getKeyValue(A, n, g, getScope(B, g, h, S, u, t, f), u);
                            b = getKeyValue(A, n, p, getScope(B, p, h, S, u, t, f), u);
                        } else {
                            g = v = ensureUnique(m[d], d);
                            p = b = ensureUnique(l[d], d);
                        }
                        if (v !== b) {
                            A.set(g, v);
                            A.set(p, b);
                            break;
                        }
                        ++d;
                        if (d > w || d > y) {
                            break t;
                        }
                    }
                    if (w !== y) {
                        break t;
                    }
                    x = y;
                    while (true) {
                        if (r) {
                            g = m[x];
                            p = l[x];
                            v = getKeyValue(A, n, g, getScope(B, g, h, S, u, t, f), u);
                            b = getKeyValue(A, n, p, getScope(B, p, h, S, u, t, f), u);
                        } else {
                            g = v = ensureUnique(m[d], d);
                            p = b = ensureUnique(l[d], d);
                        }
                        if (v !== b) {
                            A.set(g, v);
                            A.set(p, b);
                            break;
                        }
                        --x;
                        if (d > x) {
                            break t;
                        }
                    }
                }
                const _ = d;
                const R = d;
                for (d = R; d <= y; ++d) {
                    if (A.has(p = r ? l[d] : ensureUnique(l[d], d))) {
                        b = A.get(p);
                    } else {
                        b = r ? getKeyValue(A, n, p, getScope(B, p, h, S, u, t, f), u) : p;
                        A.set(p, b);
                    }
                    C.set(b, d);
                }
                for (d = _; d <= w; ++d) {
                    if (A.has(g = r ? m[d] : ensureUnique(m[d], d))) {
                        v = A.get(g);
                    } else {
                        v = r ? getKeyValue(A, n, g, i[d].scope, u) : g;
                    }
                    k.set(v, d);
                    if (C.has(v)) {
                        e[C.get(v)] = d;
                    } else {
                        e.deletedIndices.push(d);
                        e.deletedItems.push(g);
                    }
                }
                for (d = R; d <= y; ++d) {
                    if (!k.has(A.get(r ? l[d] : ensureUnique(l[d], d)))) {
                        e[d] = -2;
                    }
                }
                k.clear();
                C.clear();
            }
        }
        if (e === void 0) {
            const t = b(this.Ti(null), (() => this.Ri(null)));
            if (isPromise(t)) {
                t.catch(rethrow);
            }
        } else {
            if (e.deletedIndices.length > 0) {
                const t = b(this.Ei(e), (() => this.Pi(s, e)));
                if (isPromise(t)) {
                    t.catch(rethrow);
                }
            } else {
                this.Pi(s, e);
            }
        }
    }
    Si() {
        const t = this.$controller.scope;
        let e = this.Li;
        let i = this.xi;
        let s;
        if (i) {
            e = this.Li = L(this.yi, t, this.Bi, null) ?? null;
            i = this.xi = !dt(this.items, e);
        }
        const n = this.bi;
        if (this.$controller.isActive) {
            s = this.bi = Z(i ? e : this.items);
            if (n !== s) {
                n?.unsubscribe(this);
                s?.subscribe(this);
            }
        } else {
            n?.unsubscribe(this);
            this.bi = undefined;
        }
    }
    _i() {
        const {items: t} = this;
        if (isArray(t)) {
            this.ki = t;
            return;
        }
        const e = [];
        iterate(t, ((t, i) => {
            e[i] = t;
        }));
        this.ki = e;
    }
    Ri(t) {
        let e = void 0;
        let i;
        let s;
        let n;
        const {$controller: r, f: l, local: a, l: h, items: c, vi: u, Bi: f, forOf: d, Ci: m} = this;
        const g = r.scope;
        const p = getCount(c);
        const v = this.views = Array(p);
        iterate(c, ((c, b) => {
            s = v[b] = l.create().setLocation(h);
            s.nodes.unlink();
            n = getScope(u, c, d, g, f, a, m);
            setContextualProperties(n.overrideContext, b, p);
            i = s.activate(t ?? s, r, n);
            if (isPromise(i)) {
                (e ?? (e = [])).push(i);
            }
        }));
        if (e !== void 0) {
            return e.length === 1 ? e[0] : Promise.all(e);
        }
    }
    Ti(t) {
        let e = void 0;
        let i;
        let s;
        let n = 0;
        const {views: r, $controller: l} = this;
        const a = r.length;
        for (;a > n; ++n) {
            s = r[n];
            s.release();
            i = s.deactivate(t ?? s, l);
            if (isPromise(i)) {
                (e ?? (e = [])).push(i);
            }
        }
        if (e !== void 0) {
            return e.length === 1 ? e[0] : Promise.all(e);
        }
    }
    Ei(t) {
        let e = void 0;
        let i;
        let s;
        const {$controller: n, views: r} = this;
        const l = t.deletedIndices.slice().sort(compareNumber);
        const a = l.length;
        let h = 0;
        for (;a > h; ++h) {
            s = r[l[h]];
            s.release();
            i = s.deactivate(s, n);
            if (isPromise(i)) {
                (e ?? (e = [])).push(i);
            }
        }
        h = 0;
        for (;a > h; ++h) {
            r.splice(l[h] - h, 1);
        }
        if (e !== void 0) {
            return e.length === 1 ? e[0] : Promise.all(e);
        }
    }
    Pi(t, e) {
        let i = void 0;
        let s;
        let n;
        let r;
        let l = 0;
        const {$controller: a, f: h, local: c, ki: u, l: f, views: d, Ci: m, Bi: g, vi: p, gi: v, forOf: b} = this;
        const x = e.length;
        for (;x > l; ++l) {
            if (e[l] === -2) {
                n = h.create();
                d.splice(l, 0, n);
            }
        }
        if (d.length !== x) {
            throw createMappedError(814, [ d.length, x ]);
        }
        const w = a.scope;
        const y = e.length;
        let k = 0;
        l = 0;
        for (;l < e.length; ++l) {
            if ((k = e[l]) !== -2) {
                d[l] = v[k];
            }
        }
        const C = longestIncreasingSubsequence(e);
        const A = C.length;
        const B = b.declaration;
        let S;
        let _ = A - 1;
        l = y - 1;
        for (;l >= 0; --l) {
            n = d[l];
            S = d[l + 1];
            n.nodes.link(S?.nodes ?? f);
            if (e[l] === -2) {
                r = getScope(p, u[l], b, w, g, c, m);
                setContextualProperties(r.overrideContext, l, y);
                n.setLocation(f);
                s = n.activate(n, a, r);
                if (isPromise(s)) {
                    (i ?? (i = [])).push(s);
                }
            } else if (_ < 0 || A === 1 || l !== C[_]) {
                if (m) {
                    H(B, n.scope, g, u[l]);
                } else {
                    n.scope.bindingContext[c] = u[l];
                }
                setContextualProperties(n.scope.overrideContext, l, y);
                n.nodes.insertBefore(n.location);
            } else {
                if (m) {
                    H(B, n.scope, g, u[l]);
                } else {
                    n.scope.bindingContext[c] = u[l];
                }
                if (t !== y) {
                    setContextualProperties(n.scope.overrideContext, l, y);
                }
                --_;
            }
        }
        if (i !== void 0) {
            return i.length === 1 ? i[0] : Promise.all(i);
        }
    }
    dispose() {
        this.views.forEach(dispose);
        this.views = void 0;
    }
    accept(t) {
        const {views: e} = this;
        if (e !== void 0) {
            for (let i = 0, s = e.length; i < s; ++i) {
                if (e[i].accept(t) === true) {
                    return true;
                }
            }
        }
    }
}

Repeat.inject = [ ii, O, fs, rs, Te ];

__decorate([ bindable ], Repeat.prototype, "items", void 0);

templateController("repeat")(Repeat);

let xn = 16;

let wn = new Int32Array(xn);

let yn = new Int32Array(xn);

function longestIncreasingSubsequence(t) {
    const e = t.length;
    if (e > xn) {
        xn = e;
        wn = new Int32Array(e);
        yn = new Int32Array(e);
    }
    let i = 0;
    let s = 0;
    let n = 0;
    let r = 0;
    let l = 0;
    let a = 0;
    let h = 0;
    let c = 0;
    for (;r < e; r++) {
        s = t[r];
        if (s !== -2) {
            l = wn[i];
            n = t[l];
            if (n !== -2 && n < s) {
                yn[r] = l;
                wn[++i] = r;
                continue;
            }
            a = 0;
            h = i;
            while (a < h) {
                c = a + h >> 1;
                n = t[wn[c]];
                if (n !== -2 && n < s) {
                    a = c + 1;
                } else {
                    h = c;
                }
            }
            n = t[wn[a]];
            if (s < n || n === -2) {
                if (a > 0) {
                    yn[r] = wn[a - 1];
                }
                wn[a] = r;
            }
        }
    }
    r = ++i;
    const u = new Int32Array(r);
    s = wn[i - 1];
    while (i-- > 0) {
        u[i] = s;
        s = yn[s];
    }
    while (r-- > 0) wn[r] = 0;
    return u;
}

const setContextualProperties = (t, e, i) => {
    const s = e === 0;
    const n = e === i - 1;
    const r = e % 2 === 0;
    t.$index = e;
    t.$first = s;
    t.$last = n;
    t.$middle = !s && !n;
    t.$even = r;
    t.$odd = !r;
    t.$length = i;
};

const kn = ot.toString;

const getCount = t => {
    switch (kn.call(t)) {
      case "[object Array]":
        return t.length;

      case "[object Map]":
        return t.size;

      case "[object Set]":
        return t.size;

      case "[object Number]":
        return t;

      case "[object Null]":
        return 0;

      case "[object Undefined]":
        return 0;

      default:
        throw createMappedError(778, t);
    }
};

const iterate = (t, e) => {
    switch (kn.call(t)) {
      case "[object Array]":
        return $array(t, e);

      case "[object Map]":
        return $map(t, e);

      case "[object Set]":
        return $set(t, e);

      case "[object Number]":
        return $number(t, e);

      case "[object Null]":
        return;

      case "[object Undefined]":
        return;

      default:
        createMappedError(777, t);
    }
};

const $array = (t, e) => {
    const i = t.length;
    let s = 0;
    for (;s < i; ++s) {
        e(t[s], s, t);
    }
};

const $map = (t, e) => {
    let i = -0;
    let s;
    for (s of t.entries()) {
        e(s, i++, t);
    }
};

const $set = (t, e) => {
    let i = 0;
    let s;
    for (s of t.keys()) {
        e(s, i++, t);
    }
};

const $number = (t, e) => {
    let i = 0;
    for (;i < t; ++i) {
        e(i, i, t);
    }
};

const getKeyValue = (t, e, i, s, n) => {
    let r = t.get(i);
    if (r === void 0) {
        if (typeof e === "string") {
            r = i[e];
        } else {
            r = L(e, s, n, null);
        }
        t.set(i, r);
    }
    return r;
};

const getScope = (t, e, i, s, n, r, l) => {
    let a = t.get(e);
    if (a === void 0) {
        if (l) {
            H(i.declaration, a = W.fromParent(s, new J), n, e);
        } else {
            a = W.fromParent(s, new J(r, e));
        }
        t.set(e, a);
    }
    return a;
};

const ensureUnique = (t, e) => {
    const i = typeof t;
    switch (i) {
      case "object":
        if (t !== null) return t;

      case "string":
      case "number":
      case "bigint":
      case "undefined":
      case "boolean":
        return `${e}${i}${t}`;

      default:
        return t;
    }
};

const compareNumber = (t, e) => t - e;

class With {
    constructor() {
        this.view = c(Te).create().setLocation(c(fs));
    }
    valueChanged(t, e) {
        const i = this.$controller;
        const s = this.view.bindings;
        let n;
        let r = 0, l = 0;
        if (i.isActive && s != null) {
            n = W.fromParent(i.scope, t === void 0 ? {} : t);
            for (l = s.length; l > r; ++r) {
                s[r].bind(n);
            }
        }
    }
    attaching(t, e) {
        const {$controller: i, value: s} = this;
        const n = W.fromParent(i.scope, s === void 0 ? {} : s);
        return this.view.activate(t, i, n);
    }
    detaching(t, e) {
        return this.view.deactivate(t, this.$controller);
    }
    dispose() {
        this.view.dispose();
        this.view = void 0;
    }
    accept(t) {
        if (this.view?.accept(t) === true) {
            return true;
        }
    }
}

__decorate([ bindable ], With.prototype, "value", void 0);

templateController("with")(With);

let Cn = class Switch {
    constructor() {
        this.cases = [];
        this.activeCases = [];
        this.promise = void 0;
        this.f = c(Te);
        this.l = c(fs);
    }
    link(t, e, i, s) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(t, e) {
        const i = this.view;
        const s = this.$controller;
        this.queue((() => i.activate(t, s, s.scope)));
        this.queue((() => this.swap(t, this.value)));
        return this.promise;
    }
    detaching(t, e) {
        this.queue((() => {
            const e = this.view;
            return e.deactivate(t, this.$controller);
        }));
        return this.promise;
    }
    dispose() {
        this.view?.dispose();
        this.view = void 0;
    }
    valueChanged(t, e) {
        if (!this.$controller.isActive) {
            return;
        }
        this.queue((() => this.swap(null, this.value)));
    }
    caseChanged(t) {
        this.queue((() => this.Mi(t)));
    }
    Mi(t) {
        const e = t.isMatch(this.value);
        const i = this.activeCases;
        const s = i.length;
        if (!e) {
            if (s > 0 && i[0].id === t.id) {
                return this.Di(null);
            }
            return;
        }
        if (s > 0 && i[0].id < t.id) {
            return;
        }
        const n = [];
        let r = t.fallThrough;
        if (!r) {
            n.push(t);
        } else {
            const e = this.cases;
            const i = e.indexOf(t);
            for (let t = i, s = e.length; t < s && r; t++) {
                const i = e[t];
                n.push(i);
                r = i.fallThrough;
            }
        }
        return b(this.Di(null, n), (() => {
            this.activeCases = n;
            return this.qi(null);
        }));
    }
    swap(t, e) {
        const i = [];
        let s = false;
        for (const t of this.cases) {
            if (s || t.isMatch(e)) {
                i.push(t);
                s = t.fallThrough;
            }
            if (i.length > 0 && !s) {
                break;
            }
        }
        const n = this.defaultCase;
        if (i.length === 0 && n !== void 0) {
            i.push(n);
        }
        return b(this.activeCases.length > 0 ? this.Di(t, i) : void 0, (() => {
            this.activeCases = i;
            if (i.length === 0) {
                return;
            }
            return this.qi(t);
        }));
    }
    qi(t) {
        const e = this.$controller;
        if (!e.isActive) {
            return;
        }
        const i = this.activeCases;
        const s = i.length;
        if (s === 0) {
            return;
        }
        const n = e.scope;
        if (s === 1) {
            return i[0].activate(t, n);
        }
        return v(...i.map((e => e.activate(t, n))));
    }
    Di(t, e = []) {
        const i = this.activeCases;
        const s = i.length;
        if (s === 0) {
            return;
        }
        if (s === 1) {
            const s = i[0];
            if (!e.includes(s)) {
                i.length = 0;
                return s.deactivate(t);
            }
            return;
        }
        return b(v(...i.reduce(((i, s) => {
            if (!e.includes(s)) {
                i.push(s.deactivate(t));
            }
            return i;
        }), [])), (() => {
            i.length = 0;
        }));
    }
    queue(t) {
        const e = this.promise;
        let i = void 0;
        i = this.promise = b(b(e, t), (() => {
            if (this.promise === i) {
                this.promise = void 0;
            }
        }));
    }
    accept(t) {
        if (this.$controller.accept(t) === true) {
            return true;
        }
        if (this.activeCases.some((e => e.accept(t)))) {
            return true;
        }
    }
};

__decorate([ bindable ], Cn.prototype, "value", void 0);

Cn = __decorate([ templateController("switch") ], Cn);

let An = 0;

let Bn = class Case {
    constructor() {
        this.id = ++An;
        this.fallThrough = false;
        this.view = void 0;
        this.f = c(Te);
        this.si = c(V);
        this.l = c(fs);
        this.Hi = c(S).scopeTo(`${this.constructor.name}-#${this.id}`);
    }
    link(t, e, i, s) {
        const n = t.parent;
        const r = n?.viewModel;
        if (r instanceof Cn) {
            this.$switch = r;
            this.linkToSwitch(r);
        } else {
            throw createMappedError(815);
        }
    }
    detaching(t, e) {
        return this.deactivate(t);
    }
    isMatch(t) {
        this.Hi.debug("isMatch()");
        const e = this.value;
        if (isArray(e)) {
            if (this.bi === void 0) {
                this.bi = this.Fi(e);
            }
            return e.includes(t);
        }
        return e === t;
    }
    valueChanged(t, e) {
        if (isArray(t)) {
            this.bi?.unsubscribe(this);
            this.bi = this.Fi(t);
        } else if (this.bi !== void 0) {
            this.bi.unsubscribe(this);
        }
        this.$switch.caseChanged(this);
    }
    handleCollectionChange() {
        this.$switch.caseChanged(this);
    }
    activate(t, e) {
        let i = this.view;
        if (i === void 0) {
            i = this.view = this.f.create().setLocation(this.l);
        }
        if (i.isActive) {
            return;
        }
        return i.activate(t ?? i, this.$controller, e);
    }
    deactivate(t) {
        const e = this.view;
        if (e === void 0 || !e.isActive) {
            return;
        }
        return e.deactivate(t ?? e, this.$controller);
    }
    dispose() {
        this.bi?.unsubscribe(this);
        this.view?.dispose();
        this.view = void 0;
    }
    linkToSwitch(t) {
        t.cases.push(this);
    }
    Fi(t) {
        const e = this.si.getArrayObserver(t);
        e.subscribe(this);
        return e;
    }
    accept(t) {
        if (this.$controller.accept(t) === true) {
            return true;
        }
        return this.view?.accept(t);
    }
};

__decorate([ bindable ], Bn.prototype, "value", void 0);

__decorate([ bindable({
    set: t => {
        switch (t) {
          case "true":
            return true;

          case "false":
            return false;

          default:
            return !!t;
        }
    },
    mode: At
}) ], Bn.prototype, "fallThrough", void 0);

Bn = __decorate([ templateController("case") ], Bn);

let Sn = class DefaultCase extends Bn {
    linkToSwitch(t) {
        if (t.defaultCase !== void 0) {
            throw createMappedError(816);
        }
        t.defaultCase = this;
    }
};

Sn = __decorate([ templateController("default-case") ], Sn);

let _n = class PromiseTemplateController {
    constructor() {
        this.preSettledTask = null;
        this.postSettledTask = null;
        this.f = c(Te);
        this.l = c(fs);
        this.p = c(se);
        this.logger = c(S).scopeTo("promise.resolve");
    }
    link(t, e, i, s) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(t, e) {
        const i = this.view;
        const s = this.$controller;
        return b(i.activate(t, s, this.viewScope = W.fromParent(s.scope, {})), (() => this.swap(t)));
    }
    valueChanged(t, e) {
        if (!this.$controller.isActive) {
            return;
        }
        this.swap(null);
    }
    swap(t) {
        const e = this.value;
        if (!isPromise(e)) {
            return;
        }
        const i = this.p.domWriteQueue;
        const s = this.fulfilled;
        const n = this.rejected;
        const r = this.pending;
        const l = this.viewScope;
        let a;
        const h = {
            reusable: false
        };
        const $swap = () => {
            void v(a = (this.preSettledTask = i.queueTask((() => v(s?.deactivate(t), n?.deactivate(t), r?.activate(t, l))), h)).result.catch((t => {
                if (!(t instanceof st)) throw t;
            })), e.then((c => {
                if (this.value !== e) {
                    return;
                }
                const fulfill = () => {
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => v(r?.deactivate(t), n?.deactivate(t), s?.activate(t, l, c))), h)).result;
                };
                if (this.preSettledTask.status === wt) {
                    void a.then(fulfill);
                } else {
                    this.preSettledTask.cancel();
                    fulfill();
                }
            }), (c => {
                if (this.value !== e) {
                    return;
                }
                const reject = () => {
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => v(r?.deactivate(t), s?.deactivate(t), n?.activate(t, l, c))), h)).result;
                };
                if (this.preSettledTask.status === wt) {
                    void a.then(reject);
                } else {
                    this.preSettledTask.cancel();
                    reject();
                }
            })));
        };
        if (this.postSettledTask?.status === wt) {
            void this.postSettlePromise.then($swap);
        } else {
            this.postSettledTask?.cancel();
            $swap();
        }
    }
    detaching(t, e) {
        this.preSettledTask?.cancel();
        this.postSettledTask?.cancel();
        this.preSettledTask = this.postSettledTask = null;
        return this.view.deactivate(t, this.$controller);
    }
    dispose() {
        this.view?.dispose();
        this.view = void 0;
    }
};

__decorate([ bindable ], _n.prototype, "value", void 0);

_n = __decorate([ templateController("promise") ], _n);

let Rn = class PendingTemplateController {
    constructor() {
        this.view = void 0;
        this.f = c(Te);
        this.l = c(fs);
    }
    link(t, e, i, s) {
        getPromiseController(t).pending = this;
    }
    activate(t, e) {
        let i = this.view;
        if (i === void 0) {
            i = this.view = this.f.create().setLocation(this.l);
        }
        if (i.isActive) {
            return;
        }
        return i.activate(i, this.$controller, e);
    }
    deactivate(t) {
        const e = this.view;
        if (e === void 0 || !e.isActive) {
            return;
        }
        return e.deactivate(e, this.$controller);
    }
    detaching(t) {
        return this.deactivate(t);
    }
    dispose() {
        this.view?.dispose();
        this.view = void 0;
    }
};

__decorate([ bindable({
    mode: Bt
}) ], Rn.prototype, "value", void 0);

Rn = __decorate([ templateController(xt) ], Rn);

let Tn = class FulfilledTemplateController {
    constructor() {
        this.view = void 0;
        this.f = c(Te);
        this.l = c(fs);
    }
    link(t, e, i, s) {
        getPromiseController(t).fulfilled = this;
    }
    activate(t, e, i) {
        this.value = i;
        let s = this.view;
        if (s === void 0) {
            s = this.view = this.f.create().setLocation(this.l);
        }
        if (s.isActive) {
            return;
        }
        return s.activate(s, this.$controller, e);
    }
    deactivate(t) {
        const e = this.view;
        if (e === void 0 || !e.isActive) {
            return;
        }
        return e.deactivate(e, this.$controller);
    }
    detaching(t, e) {
        return this.deactivate(t);
    }
    dispose() {
        this.view?.dispose();
        this.view = void 0;
    }
};

__decorate([ bindable({
    mode: St
}) ], Tn.prototype, "value", void 0);

Tn = __decorate([ templateController("then") ], Tn);

let In = class RejectedTemplateController {
    constructor() {
        this.view = void 0;
        this.f = c(Te);
        this.l = c(fs);
    }
    link(t, e, i, s) {
        getPromiseController(t).rejected = this;
    }
    activate(t, e, i) {
        this.value = i;
        let s = this.view;
        if (s === void 0) {
            s = this.view = this.f.create().setLocation(this.l);
        }
        if (s.isActive) {
            return;
        }
        return s.activate(s, this.$controller, e);
    }
    deactivate(t) {
        const e = this.view;
        if (e === void 0 || !e.isActive) {
            return;
        }
        return e.deactivate(e, this.$controller);
    }
    detaching(t, e) {
        return this.deactivate(t);
    }
    dispose() {
        this.view?.dispose();
        this.view = void 0;
    }
};

__decorate([ bindable({
    mode: St
}) ], In.prototype, "value", void 0);

In = __decorate([ templateController("catch") ], In);

function getPromiseController(t) {
    const e = t.parent;
    const i = e?.viewModel;
    if (i instanceof _n) {
        return i;
    }
    throw createMappedError(813);
}

let En = class PromiseAttributePattern {
    "promise.resolve"(t, e, i) {
        return new AttrSyntax(t, e, "promise", "bind");
    }
};

En = __decorate([ attributePattern({
    pattern: "promise.resolve",
    symbols: ""
}) ], En);

let Pn = class FulfilledAttributePattern {
    then(t, e, i) {
        return new AttrSyntax(t, e, "then", "from-view");
    }
};

Pn = __decorate([ attributePattern({
    pattern: "then",
    symbols: ""
}) ], Pn);

let Ln = class RejectedAttributePattern {
    catch(t, e, i) {
        return new AttrSyntax(t, e, "catch", "from-view");
    }
};

Ln = __decorate([ attributePattern({
    pattern: "catch",
    symbols: ""
}) ], Ln);

class Focus {
    constructor() {
        this.Oi = false;
        this.Vi = c(cs);
        this.p = c(se);
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) {
            this.$i();
        } else {
            this.Oi = true;
        }
    }
    attached() {
        if (this.Oi) {
            this.Oi = false;
            this.$i();
        }
        this.Vi.addEventListener("focus", this);
        this.Vi.addEventListener("blur", this);
    }
    detaching() {
        const t = this.Vi;
        t.removeEventListener("focus", this);
        t.removeEventListener("blur", this);
    }
    handleEvent(t) {
        if (t.type === "focus") {
            this.value = true;
        } else if (!this.Ni) {
            this.value = false;
        }
    }
    $i() {
        const t = this.Vi;
        const e = this.Ni;
        const i = this.value;
        if (i && !e) {
            t.focus();
        } else if (!i && e) {
            t.blur();
        }
    }
    get Ni() {
        return this.Vi === this.p.document.activeElement;
    }
}

__decorate([ bindable({
    mode: _t
}) ], Focus.prototype, "value", void 0);

customAttribute("focus")(Focus);

class Portal {
    constructor() {
        this.position = "beforeend";
        this.strict = false;
        const t = c(Te);
        const e = c(fs);
        const i = c(se);
        this.p = i;
        this.Wi = i.document.createElement("div");
        (this.view = t.create()).setLocation(this.ji = createLocation(i));
        setEffectiveParentNode(this.view.nodes, e);
    }
    attaching(t) {
        if (this.callbackContext == null) {
            this.callbackContext = this.$controller.scope.bindingContext;
        }
        const e = this.Wi = this.zi();
        this.Ui(e, this.position);
        return this.Gi(t, e);
    }
    detaching(t) {
        return this.Ki(t, this.Wi);
    }
    targetChanged() {
        const {$controller: t} = this;
        if (!t.isActive) {
            return;
        }
        const e = this.zi();
        if (this.Wi === e) {
            return;
        }
        this.Wi = e;
        const i = b(this.Ki(null, e), (() => {
            this.Ui(e, this.position);
            return this.Gi(null, e);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    positionChanged() {
        const {$controller: t, Wi: e} = this;
        if (!t.isActive) {
            return;
        }
        const i = b(this.Ki(null, e), (() => {
            this.Ui(e, this.position);
            return this.Gi(null, e);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    Gi(t, e) {
        const {activating: i, callbackContext: s, view: n} = this;
        return b(i?.call(s, e, n), (() => this.Xi(t, e)));
    }
    Xi(t, e) {
        const {$controller: i, view: s} = this;
        if (t === null) {
            s.nodes.insertBefore(this.ji);
        } else {
            return b(s.activate(t ?? s, i, i.scope), (() => this.Qi(e)));
        }
        return this.Qi(e);
    }
    Qi(t) {
        const {activated: e, callbackContext: i, view: s} = this;
        return e?.call(i, t, s);
    }
    Ki(t, e) {
        const {deactivating: i, callbackContext: s, view: n} = this;
        return b(i?.call(s, e, n), (() => this.Yi(t, e)));
    }
    Yi(t, e) {
        const {$controller: i, view: s} = this;
        if (t === null) {
            s.nodes.remove();
        } else {
            return b(s.deactivate(t, i), (() => this.Zi(e)));
        }
        return this.Zi(e);
    }
    Zi(t) {
        const {deactivated: e, callbackContext: i, view: s} = this;
        return b(e?.call(i, t, s), (() => this.Ji()));
    }
    zi() {
        const t = this.p;
        const e = t.document;
        let i = this.target;
        let s = this.renderContext;
        if (i === "") {
            if (this.strict) {
                throw createMappedError(811);
            }
            return e.body;
        }
        if (isString(i)) {
            let n = e;
            if (isString(s)) {
                s = e.querySelector(s);
            }
            if (s instanceof t.Node) {
                n = s;
            }
            i = n.querySelector(i);
        }
        if (i instanceof t.Node) {
            return i;
        }
        if (i == null) {
            if (this.strict) {
                throw createMappedError(812);
            }
            return e.body;
        }
        return i;
    }
    Ji() {
        this.ji.remove();
        this.ji.$start.remove();
    }
    Ui(t, e) {
        const i = this.ji;
        const s = i.$start;
        const n = t.parentNode;
        const r = [ s, i ];
        switch (e) {
          case "beforeend":
            insertManyBefore(t, null, r);
            break;

          case "afterbegin":
            insertManyBefore(t, t.firstChild, r);
            break;

          case "beforebegin":
            insertManyBefore(n, t, r);
            break;

          case "afterend":
            insertManyBefore(n, t.nextSibling, r);
            break;

          default:
            throw new Error("Invalid portal insertion position");
        }
    }
    dispose() {
        this.view.dispose();
        this.view = void 0;
        this.callbackContext = null;
    }
    accept(t) {
        if (this.view?.accept(t) === true) {
            return true;
        }
    }
}

__decorate([ bindable({
    primary: true
}) ], Portal.prototype, "target", void 0);

__decorate([ bindable() ], Portal.prototype, "position", void 0);

__decorate([ bindable({
    callback: "targetChanged"
}) ], Portal.prototype, "renderContext", void 0);

__decorate([ bindable() ], Portal.prototype, "strict", void 0);

__decorate([ bindable() ], Portal.prototype, "deactivating", void 0);

__decorate([ bindable() ], Portal.prototype, "activating", void 0);

__decorate([ bindable() ], Portal.prototype, "deactivated", void 0);

__decorate([ bindable() ], Portal.prototype, "activated", void 0);

__decorate([ bindable() ], Portal.prototype, "callbackContext", void 0);

templateController("portal")(Portal);

let Mn = class AuSlot {
    constructor() {
        this.ts = null;
        this.es = null;
        this.Kt = false;
        this.expose = null;
        this.slotchange = null;
        this.ss = new Set;
        this.bi = null;
        const t = c(os);
        const e = c(fs);
        const i = c(ii);
        const s = c(Ti);
        const n = i.auSlot;
        const r = t.instruction?.projections?.[n.name];
        const l = t.controller.container;
        let a;
        let h;
        this.name = n.name;
        if (r == null) {
            h = l.createChild({
                inheritParentResources: true
            });
            a = s.getViewFactory(n.fallback, h);
            this.rs = false;
        } else {
            h = l.createChild();
            h.useResources(t.parent.controller.container);
            registerResolver(h, os, new m(void 0, t.parent));
            a = s.getViewFactory(r, h);
            this.rs = true;
            this.os = l.getAll(Le, false)?.filter((t => t.slotName === "*" || t.slotName === n.name)) ?? f;
        }
        this.ls = (this.os ?? (this.os = f)).length > 0;
        this.cs = t;
        this.view = a.create().setLocation(this.l = e);
    }
    get nodes() {
        const t = [];
        const e = this.l;
        let i = e.$start.nextSibling;
        while (i != null && i !== e) {
            if (i.nodeType !== 8) {
                t.push(i);
            }
            i = i.nextSibling;
        }
        return t;
    }
    subscribe(t) {
        this.ss.add(t);
    }
    unsubscribe(t) {
        this.ss.delete(t);
    }
    binding(t, e) {
        this.ts = this.$controller.scope.parent;
        let i;
        if (this.rs) {
            i = this.cs.controller.scope.parent;
            (this.es = W.fromParent(i, i.bindingContext)).overrideContext.$host = this.expose ?? this.ts.bindingContext;
        }
    }
    attaching(t, e) {
        return b(this.view.activate(t, this.$controller, this.rs ? this.es : this.ts), (() => {
            if (this.ls) {
                this.os.forEach((t => t.watch(this)));
                this.li();
                this.us();
                this.Kt = true;
            }
        }));
    }
    detaching(t, e) {
        this.Kt = false;
        this.ds();
        this.os.forEach((t => t.unwatch(this)));
        return this.view.deactivate(t, this.$controller);
    }
    exposeChanged(t) {
        if (this.rs && this.es != null) {
            this.es.overrideContext.$host = t;
        }
    }
    dispose() {
        this.view.dispose();
        this.view = void 0;
    }
    accept(t) {
        if (this.view?.accept(t) === true) {
            return true;
        }
    }
    li() {
        if (this.bi != null) {
            return;
        }
        const t = this.l;
        const e = t.parentElement;
        if (e == null) {
            return;
        }
        (this.bi = createMutationObserver(e, (e => {
            if (isMutationWithinLocation(t, e)) {
                this.us();
            }
        }))).observe(e, {
            childList: true
        });
    }
    ds() {
        this.bi?.disconnect();
        this.bi = null;
    }
    us() {
        const t = this.nodes;
        const e = new Set(this.ss);
        let i;
        if (this.Kt) {
            this.slotchange?.call(void 0, this.name, t);
        }
        for (i of e) {
            i.handleSlotChange(this, t);
        }
    }
};

__decorate([ bindable ], Mn.prototype, "expose", void 0);

__decorate([ bindable ], Mn.prototype, "slotchange", void 0);

Mn = __decorate([ customElement({
    name: "au-slot",
    template: null,
    containerless: true
}) ], Mn);

const comparePosition = (t, e) => t.compareDocumentPosition(e);

const isMutationWithinLocation = (t, e) => {
    for (const {addedNodes: i, removedNodes: s, nextSibling: n} of e) {
        let e = 0;
        let r = i.length;
        let l;
        for (;e < r; ++e) {
            l = i[e];
            if (comparePosition(t.$start, l) === 4 && comparePosition(t, l) === 2) {
                return true;
            }
        }
        if (s.length > 0) {
            if (n != null && comparePosition(t.$start, n) === 4 && comparePosition(t, n) === 2) {
                return true;
            }
        }
    }
};

class AuCompose {
    constructor() {
        this.scopeBehavior = "auto";
        this.gs = void 0;
        this.tag = null;
        this.c = c(g);
        this.parent = c(rs);
        this.ps = c(cs);
        this.l = c(fs);
        this.p = c(se);
        this.r = c(Ti);
        this.vs = c(ii);
        this.bs = c(_(CompositionContextFactory));
        this.et = c(si);
        this.J = c(os);
        this.ep = c(O);
        this.oL = c(V);
    }
    get composing() {
        return this.xs;
    }
    get composition() {
        return this.gs;
    }
    attaching(t, e) {
        return this.xs = b(this.queue(new ChangeInfo(this.template, this.component, this.model, void 0), t), (t => {
            if (this.bs.ws(t)) {
                this.xs = void 0;
            }
        }));
    }
    detaching(t) {
        const e = this.gs;
        const i = this.xs;
        this.bs.invalidate();
        this.gs = this.xs = void 0;
        return b(i, (() => e?.deactivate(t)));
    }
    propertyChanged(t) {
        if (t === "composing" || t === "composition") return;
        if (t === "model" && this.gs != null) {
            this.gs.update(this.model);
            return;
        }
        if (t === "tag" && this.gs?.controller.vmKind === Ki) {
            return;
        }
        this.xs = b(this.xs, (() => b(this.queue(new ChangeInfo(this.template, this.component, this.model, t), void 0), (t => {
            if (this.bs.ws(t)) {
                this.xs = void 0;
            }
        }))));
    }
    queue(t, e) {
        const i = this.bs;
        const s = this.gs;
        return b(i.create(t), (t => {
            if (i.ws(t)) {
                return b(this.compose(t), (n => {
                    if (i.ws(t)) {
                        return b(n.activate(e), (() => {
                            if (i.ws(t)) {
                                this.gs = n;
                                return b(s?.deactivate(e), (() => t));
                            } else {
                                return b(n.controller.deactivate(n.controller, this.$controller), (() => {
                                    n.controller.dispose();
                                    return t;
                                }));
                            }
                        }));
                    }
                    n.controller.dispose();
                    return t;
                }));
            }
            return t;
        }));
    }
    compose(t) {
        const {ys: e, ks: i, Cs: s} = t.change;
        const {c: n, $controller: r, l: l, vs: a} = this;
        const h = this.As(this.J.controller.container, i);
        const c = n.createChild();
        const u = this.p.document.createElement(h == null ? this.tag ?? "div" : h.name);
        l.parentNode.insertBefore(u, l);
        let d;
        if (h == null) {
            d = this.tag == null ? convertToRenderLocation(u) : null;
        } else {
            d = h.containerless ? convertToRenderLocation(u) : null;
        }
        const removeCompositionHost = () => {
            u.remove();
            if (d != null) {
                let t = d.$start.nextSibling;
                let e = null;
                while (t !== null && t !== d) {
                    e = t.nextSibling;
                    t.remove();
                    t = e;
                }
                d.$start?.remove();
                d.remove();
            }
        };
        const m = this.Bs(c, typeof i === "string" ? h.Type : i, u, d);
        const compose = () => {
            const i = a.captures ?? f;
            if (h !== null) {
                const e = h.capture;
                const [s, n] = i.reduce(((t, i) => {
                    const s = !(i.target in h.bindables) && (e === true || isFunction(e) && !!e(i.target));
                    t[s ? 0 : 1].push(i);
                    return t;
                }), [ [], [] ]);
                const l = Controller.$el(c, m, u, {
                    projections: a.projections,
                    captures: s
                }, h, d);
                this.Ss(u, h, n).forEach((t => l.addBinding(t)));
                return new CompositionController(l, (t => l.activate(t ?? l, r, r.scope.parent)), (t => b(l.deactivate(t ?? l, r), removeCompositionHost)), (t => m.activate?.(t)), t);
            } else {
                const s = CustomElementDefinition.create({
                    name: Cs.generateName(),
                    template: e
                });
                const n = this.r.getViewFactory(s, c);
                const l = Controller.$view(n, r);
                const a = this.scopeBehavior === "auto" ? W.fromParent(this.parent.scope, m) : W.create(m);
                l.setHost(u);
                if (d == null) {
                    this.Ss(u, s, i).forEach((t => l.addBinding(t)));
                } else {
                    l.setLocation(d);
                }
                return new CompositionController(l, (t => l.activate(t ?? l, r, a)), (t => b(l.deactivate(t ?? l, r), removeCompositionHost)), (t => m.activate?.(t)), t);
            }
        };
        if ("activate" in m) {
            return b(m.activate(s), (() => compose()));
        } else {
            return compose();
        }
    }
    Bs(t, e, i, s) {
        if (e == null) {
            return new EmptyComponent;
        }
        if (typeof e === "object") {
            return e;
        }
        const n = this.p;
        registerHostNode(t, n, i);
        registerResolver(t, fs, new m("IRenderLocation", s));
        const r = t.invoke(e);
        registerResolver(t, e, new m("au-compose.component", r));
        return r;
    }
    As(t, e) {
        if (typeof e === "string") {
            const i = t.find(Cs, e);
            if (i == null) {
                throw createMappedError(806, e);
            }
            return i;
        }
        const i = isFunction(e) ? e : e?.constructor;
        return Cs.isType(i) ? Cs.getDefinition(i) : null;
    }
    Ss(t, e, i) {
        const s = new HydrationContext(this.$controller, {
            projections: null,
            captures: i
        }, this.J.parent);
        return SpreadBinding.create(s, t, e, this.r, this.et, this.p, this.ep, this.oL);
    }
}

__decorate([ bindable ], AuCompose.prototype, "template", void 0);

__decorate([ bindable ], AuCompose.prototype, "component", void 0);

__decorate([ bindable ], AuCompose.prototype, "model", void 0);

__decorate([ bindable({
    set: t => {
        if (t === "scoped" || t === "auto") {
            return t;
        }
        throw createMappedError(805, t);
    }
}) ], AuCompose.prototype, "scopeBehavior", void 0);

__decorate([ bindable({
    mode: St
}) ], AuCompose.prototype, "composing", null);

__decorate([ bindable({
    mode: St
}) ], AuCompose.prototype, "composition", null);

__decorate([ bindable ], AuCompose.prototype, "tag", void 0);

customElement({
    name: "au-compose",
    capture: true,
    containerless: true
})(AuCompose);

class EmptyComponent {}

class CompositionContextFactory {
    constructor() {
        this.id = 0;
    }
    ws(t) {
        return t.id === this.id;
    }
    create(t) {
        return b(t.load(), (t => new CompositionContext(++this.id, t)));
    }
    invalidate() {
        this.id++;
    }
}

class ChangeInfo {
    constructor(t, e, i, s) {
        this.ys = t;
        this.ks = e;
        this.Cs = i;
        this._s = s;
    }
    load() {
        if (isPromise(this.ys) || isPromise(this.ks)) {
            return Promise.all([ this.ys, this.ks ]).then((([t, e]) => new LoadedChangeInfo(t, e, this.Cs, this._s)));
        } else {
            return new LoadedChangeInfo(this.ys, this.ks, this.Cs, this._s);
        }
    }
}

class LoadedChangeInfo {
    constructor(t, e, i, s) {
        this.ys = t;
        this.ks = e;
        this.Cs = i;
        this._s = s;
    }
}

class CompositionContext {
    constructor(t, e) {
        this.id = t;
        this.change = e;
    }
}

class CompositionController {
    constructor(t, e, i, s, n) {
        this.controller = t;
        this.start = e;
        this.stop = i;
        this.update = s;
        this.context = n;
        this.state = 0;
    }
    activate(t) {
        if (this.state !== 0) {
            throw createMappedError(807, this);
        }
        this.state = 1;
        return this.start(t);
    }
    deactivate(t) {
        switch (this.state) {
          case 1:
            this.state = -1;
            return this.stop(t);

          case -1:
            throw createMappedError(808);

          default:
            this.state = -1;
        }
    }
}

const Dn = /*@__PURE__*/ Wt("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw createMappedError(99, "sanitize");
    }
})));

class SanitizeValueConverter {
    constructor() {
        this.Rs = c(Dn);
    }
    toView(t) {
        if (t == null) {
            return null;
        }
        return this.Rs.sanitize(t);
    }
}

valueConverter("sanitize")(SanitizeValueConverter);

const qn = /*@__PURE__*/ Wt("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const Hn = {};

class TemplateElementFactory {
    constructor() {
        this.p = c(se);
        this.ys = this.t();
    }
    t() {
        return this.p.document.createElement("template");
    }
    createTemplate(t) {
        if (isString(t)) {
            let e = Hn[t];
            if (e === void 0) {
                const i = this.ys;
                i.innerHTML = t;
                const s = i.content.firstElementChild;
                if (needsWrapping(s)) {
                    this.ys = this.t();
                    e = i;
                } else {
                    i.content.removeChild(s);
                    e = s;
                }
                Hn[t] = e;
            }
            return e.cloneNode(true);
        }
        if (t.nodeName !== "TEMPLATE") {
            const e = this.t();
            e.content.appendChild(t);
            return e;
        }
        t.parentNode?.removeChild(t);
        return t.cloneNode(true);
        function needsWrapping(t) {
            if (t == null) return true;
            if (t.nodeName !== "TEMPLATE") return true;
            const e = t.nextElementSibling;
            if (e != null) return true;
            const i = t.previousSibling;
            if (i != null) {
                switch (i.nodeType) {
                  case 3:
                    return i.textContent.trim().length > 0;
                }
            }
            const s = t.nextSibling;
            if (s != null) {
                switch (s.nodeType) {
                  case 3:
                    return s.textContent.trim().length > 0;
                }
            }
            return false;
        }
    }
}

class TemplateCompiler {
    constructor() {
        this.debug = false;
        this.resolveResources = true;
    }
    static register(t) {
        t.register(jt(this, this), zt(this, si));
    }
    compile(t, e, i) {
        const s = CustomElementDefinition.getOrCreate(t);
        if (s.template === null || s.template === void 0) {
            return s;
        }
        if (s.needsCompile === false) {
            return s;
        }
        i ?? (i = $n);
        const n = new CompilationContext(t, e, i, null, null, void 0);
        const r = isString(s.template) || !t.enhance ? n.Ts.createTemplate(s.template) : s.template;
        const l = r.nodeName === Fn && r.content != null;
        const a = l ? r.content : r;
        const h = e.get(allResources(Xn));
        const c = h.length;
        let u = 0;
        if (c > 0) {
            while (c > u) {
                h[u].compiling?.(r);
                ++u;
            }
        }
        if (r.hasAttribute(Kn)) {
            throw createMappedError(701, s);
        }
        this.Is(a, n);
        this.Es(a, n);
        const d = CustomElementDefinition.create({
            ...t,
            name: t.name || ys(),
            dependencies: (t.dependencies ?? f).concat(n.deps ?? f),
            instructions: n.rows,
            surrogates: l ? this.Ps(r, n) : f,
            template: r,
            hasSlots: n.hasSlot,
            needsCompile: false
        });
        if (n.deps != null) {
            const t = [ d.Type, ...d.dependencies, ...n.deps ];
            for (const e of n.deps) {
                getElementDefinition(e).dependencies.push(...t.filter((t => t !== e)));
            }
        }
        return d;
    }
    compileSpread(t, e, i, s, n) {
        const r = new CompilationContext(t, i, $n, null, null, void 0);
        const l = [];
        const a = n ?? r.Ls(s.nodeName.toLowerCase());
        const h = a !== null;
        const c = r.ep;
        const u = e.length;
        let f = 0;
        let d;
        let m = null;
        let g;
        let p;
        let v;
        let b;
        let x;
        let w = null;
        let y;
        let k;
        let A;
        let B;
        for (;u > f; ++f) {
            d = e[f];
            A = d.target;
            B = d.rawValue;
            w = r.Ms(d);
            if (w !== null && w.type === Vs) {
                Wn.node = s;
                Wn.attr = d;
                Wn.bindable = null;
                Wn.def = null;
                l.push(w.build(Wn, r.ep, r.m));
                continue;
            }
            m = r.Ds(A);
            if (m !== null) {
                if (m.isTemplateController) {
                    throw createMappedError(9998, A);
                }
                v = BindablesInfo.from(m, true);
                k = m.noMultiBindings === false && w === null && hasInlineBindings(B);
                if (k) {
                    p = this.qs(s, B, m, r);
                } else {
                    x = v.primary;
                    if (w === null) {
                        y = c.parse(B, gt);
                        p = [ y === null ? new SetPropertyInstruction(B, x.name) : new InterpolationInstruction(y, x.name) ];
                    } else {
                        Wn.node = s;
                        Wn.attr = d;
                        Wn.bindable = x;
                        Wn.def = m;
                        p = [ w.build(Wn, r.ep, r.m) ];
                    }
                }
                (g ?? (g = [])).push(new HydrateAttributeInstruction(this.resolveResources ? m : m.name, m.aliases != null && m.aliases.includes(A) ? A : void 0, p));
                continue;
            }
            if (w === null) {
                y = c.parse(B, gt);
                if (h) {
                    v = BindablesInfo.from(a, false);
                    b = v.attrs[A];
                    if (b !== void 0) {
                        y = c.parse(B, gt);
                        l.push(new SpreadElementPropBindingInstruction(y == null ? new SetPropertyInstruction(B, b.name) : new InterpolationInstruction(y, b.name)));
                        continue;
                    }
                }
                if (y != null) {
                    l.push(new InterpolationInstruction(y, r.m.map(s, A) ?? C(A)));
                } else {
                    switch (A) {
                      case "class":
                        l.push(new SetClassAttributeInstruction(B));
                        break;

                      case "style":
                        l.push(new SetStyleAttributeInstruction(B));
                        break;

                      default:
                        l.push(new SetAttributeInstruction(B, A));
                    }
                }
            } else {
                if (h) {
                    v = BindablesInfo.from(a, false);
                    b = v.attrs[A];
                    if (b !== void 0) {
                        Wn.node = s;
                        Wn.attr = d;
                        Wn.bindable = b;
                        Wn.def = a;
                        l.push(new SpreadElementPropBindingInstruction(w.build(Wn, r.ep, r.m)));
                        continue;
                    }
                }
                Wn.node = s;
                Wn.attr = d;
                Wn.bindable = null;
                Wn.def = null;
                l.push(w.build(Wn, r.ep, r.m));
            }
        }
        resetCommandBuildInfo();
        if (g != null) {
            return g.concat(l);
        }
        return l;
    }
    Ps(t, e) {
        const i = [];
        const s = t.attributes;
        const n = e.ep;
        let r = s.length;
        let l = 0;
        let a;
        let h;
        let c;
        let u;
        let f = null;
        let d;
        let m;
        let g;
        let p;
        let v = null;
        let b;
        let x;
        let w;
        let y;
        for (;r > l; ++l) {
            a = s[l];
            h = a.name;
            c = a.value;
            u = e.He.parse(h, c);
            w = u.target;
            y = u.rawValue;
            if (jn[w]) {
                throw createMappedError(702, h);
            }
            v = e.Ms(u);
            if (v !== null && v.type === Vs) {
                Wn.node = t;
                Wn.attr = u;
                Wn.bindable = null;
                Wn.def = null;
                i.push(v.build(Wn, e.ep, e.m));
                continue;
            }
            f = e.Ds(w);
            if (f !== null) {
                if (f.isTemplateController) {
                    throw createMappedError(703, w);
                }
                g = BindablesInfo.from(f, true);
                x = f.noMultiBindings === false && v === null && hasInlineBindings(y);
                if (x) {
                    m = this.qs(t, y, f, e);
                } else {
                    p = g.primary;
                    if (v === null) {
                        b = n.parse(y, gt);
                        m = [ b === null ? new SetPropertyInstruction(y, p.name) : new InterpolationInstruction(b, p.name) ];
                    } else {
                        Wn.node = t;
                        Wn.attr = u;
                        Wn.bindable = p;
                        Wn.def = f;
                        m = [ v.build(Wn, e.ep, e.m) ];
                    }
                }
                t.removeAttribute(h);
                --l;
                --r;
                (d ?? (d = [])).push(new HydrateAttributeInstruction(this.resolveResources ? f : f.name, f.aliases != null && f.aliases.includes(w) ? w : void 0, m));
                continue;
            }
            if (v === null) {
                b = n.parse(y, gt);
                if (b != null) {
                    t.removeAttribute(h);
                    --l;
                    --r;
                    i.push(new InterpolationInstruction(b, e.m.map(t, w) ?? C(w)));
                } else {
                    switch (h) {
                      case "class":
                        i.push(new SetClassAttributeInstruction(y));
                        break;

                      case "style":
                        i.push(new SetStyleAttributeInstruction(y));
                        break;

                      default:
                        i.push(new SetAttributeInstruction(y, h));
                    }
                }
            } else {
                Wn.node = t;
                Wn.attr = u;
                Wn.bindable = null;
                Wn.def = null;
                i.push(v.build(Wn, e.ep, e.m));
            }
        }
        resetCommandBuildInfo();
        if (d != null) {
            return d.concat(i);
        }
        return i;
    }
    Es(t, e) {
        switch (t.nodeType) {
          case 1:
            switch (t.nodeName) {
              case "LET":
                return this.Hs(t, e);

              default:
                return this.Fs(t, e);
            }

          case 3:
            return this.Os(t, e);

          case 11:
            {
                let i = t.firstChild;
                while (i !== null) {
                    i = this.Es(i, e);
                }
                break;
            }
        }
        return t.nextSibling;
    }
    Hs(t, e) {
        const i = t.attributes;
        const s = i.length;
        const n = [];
        const r = e.ep;
        let l = false;
        let a = 0;
        let h;
        let c;
        let u;
        let f;
        let d;
        let m;
        let g;
        let p;
        for (;s > a; ++a) {
            h = i[a];
            u = h.name;
            f = h.value;
            if (u === "to-binding-context") {
                l = true;
                continue;
            }
            c = e.He.parse(u, f);
            m = c.target;
            g = c.rawValue;
            d = e.Ms(c);
            if (d !== null) {
                if (c.command === "bind") {
                    n.push(new LetBindingInstruction(r.parse(g, bt), C(m)));
                } else {
                    throw createMappedError(704, c);
                }
                continue;
            }
            p = r.parse(g, gt);
            n.push(new LetBindingInstruction(p === null ? new tt(g) : p, C(m)));
        }
        e.rows.push([ new HydrateLetElementInstruction(n, l) ]);
        return this.Vs(t, e).nextSibling;
    }
    Fs(t, e) {
        var i, n, r, l;
        const a = t.nextSibling;
        const h = (t.getAttribute("as-element") ?? t.nodeName).toLowerCase();
        const c = e.Ls(h);
        const u = c !== null;
        const d = u && c.shadowOptions != null;
        const m = c?.capture;
        const g = m != null && typeof m !== "boolean";
        const p = m ? [] : f;
        const v = e.ep;
        const b = this.debug ? s : () => {
            t.removeAttribute(B);
            --k;
            --y;
        };
        let x = t.attributes;
        let w;
        let y = x.length;
        let k = 0;
        let A;
        let B;
        let S;
        let _;
        let R;
        let T;
        let I = null;
        let E = false;
        let P;
        let L;
        let M;
        let D;
        let q;
        let H;
        let F;
        let O = null;
        let V;
        let $;
        let N;
        let W;
        let j = true;
        let z = false;
        let U = false;
        let G = false;
        if (h === "slot") {
            if (e.root.def.shadowOptions == null) {
                throw createMappedError(717, e.root.def.name);
            }
            e.root.hasSlot = true;
        }
        if (u) {
            j = c.processContent?.call(c.Type, t, e.p);
            x = t.attributes;
            y = x.length;
        }
        for (;y > k; ++k) {
            A = x[k];
            B = A.name;
            S = A.value;
            switch (B) {
              case "as-element":
              case "containerless":
                b();
                if (!z) {
                    z = B === "containerless";
                }
                continue;
            }
            _ = e.He.parse(B, S);
            O = e.Ms(_);
            N = _.target;
            W = _.rawValue;
            if (m && (!g || g && m(N))) {
                if (O != null && O.type === Vs) {
                    b();
                    p.push(_);
                    continue;
                }
                U = N !== tr && N !== "slot";
                if (U) {
                    V = BindablesInfo.from(c, false);
                    if (V.attrs[N] == null && !e.Ds(N)?.isTemplateController) {
                        b();
                        p.push(_);
                        continue;
                    }
                }
            }
            if (O?.type === Vs) {
                Wn.node = t;
                Wn.attr = _;
                Wn.bindable = null;
                Wn.def = null;
                (R ?? (R = [])).push(O.build(Wn, e.ep, e.m));
                b();
                continue;
            }
            if (u) {
                V = BindablesInfo.from(c, false);
                P = V.attrs[N];
                if (P !== void 0) {
                    if (O === null) {
                        H = v.parse(W, gt);
                        (T ?? (T = [])).push(H == null ? new SetPropertyInstruction(W, P.name) : new InterpolationInstruction(H, P.name));
                    } else {
                        Wn.node = t;
                        Wn.attr = _;
                        Wn.bindable = P;
                        Wn.def = c;
                        (T ?? (T = [])).push(O.build(Wn, e.ep, e.m));
                    }
                    b();
                    continue;
                }
            }
            I = e.Ds(N);
            if (I !== null) {
                V = BindablesInfo.from(I, true);
                E = I.noMultiBindings === false && O === null && hasInlineBindings(W);
                if (E) {
                    M = this.qs(t, W, I, e);
                } else {
                    $ = V.primary;
                    if (O === null) {
                        H = v.parse(W, gt);
                        M = [ H === null ? new SetPropertyInstruction(W, $.name) : new InterpolationInstruction(H, $.name) ];
                    } else {
                        Wn.node = t;
                        Wn.attr = _;
                        Wn.bindable = $;
                        Wn.def = I;
                        M = [ O.build(Wn, e.ep, e.m) ];
                    }
                }
                b();
                if (I.isTemplateController) {
                    (D ?? (D = [])).push(new HydrateTemplateController(Nn, this.resolveResources ? I : I.name, void 0, M));
                } else {
                    (L ?? (L = [])).push(new HydrateAttributeInstruction(this.resolveResources ? I : I.name, I.aliases != null && I.aliases.includes(N) ? N : void 0, M));
                }
                continue;
            }
            if (O === null) {
                H = v.parse(W, gt);
                if (H != null) {
                    b();
                    (R ?? (R = [])).push(new InterpolationInstruction(H, e.m.map(t, N) ?? C(N)));
                }
                continue;
            }
            Wn.node = t;
            Wn.attr = _;
            Wn.bindable = null;
            Wn.def = null;
            (R ?? (R = [])).push(O.build(Wn, e.ep, e.m));
            b();
        }
        resetCommandBuildInfo();
        if (this.$s(t, R) && R != null && R.length > 1) {
            this.Ns(t, R);
        }
        if (u) {
            F = new HydrateElementInstruction(this.resolveResources ? c : c.name, void 0, T ?? f, null, z, p);
            if (h === tr) {
                const i = t.getAttribute("name") || Jn;
                const s = e.t();
                const n = e.Ws();
                let r = t.firstChild;
                let l = 0;
                while (r !== null) {
                    if (isElement(r) && r.hasAttribute(tr)) {
                        t.removeChild(r);
                    } else {
                        appendToTemplate(s, r);
                        l++;
                    }
                    r = t.firstChild;
                }
                if (l > 0) {
                    this.Es(s.content, n);
                }
                F.auSlot = {
                    name: i,
                    fallback: CustomElementDefinition.create({
                        name: ys(),
                        template: s,
                        instructions: n.rows,
                        needsCompile: false
                    })
                };
            }
        }
        if (R != null || F != null || L != null) {
            w = f.concat(F ?? f, L ?? f, R ?? f);
            G = true;
        }
        let K;
        if (D != null) {
            y = D.length - 1;
            k = y;
            q = D[k];
            let s;
            if (isMarker(t)) {
                s = e.t();
                appendManyToTemplate(s, [ e.ht(), e.js(On), e.js(Vn) ]);
            } else {
                this.zs(t, e);
                if (t.nodeName === "TEMPLATE") {
                    s = t;
                } else {
                    s = e.t();
                    appendToTemplate(s, t);
                }
            }
            const r = s;
            const l = e.Ws(w == null ? [] : [ w ]);
            let a;
            let f;
            let m = false;
            let g;
            let p;
            let v;
            let b;
            let x;
            let C;
            let A = 0, B = 0;
            let S = t.firstChild;
            let _ = false;
            if (j !== false) {
                while (S !== null) {
                    f = isElement(S) ? S.getAttribute(tr) : null;
                    m = f !== null || u && !d;
                    a = S.nextSibling;
                    if (m) {
                        if (!u) {
                            throw createMappedError(706, f, h);
                        }
                        S.removeAttribute?.(tr);
                        _ = isTextNode(S) && S.textContent.trim() === "";
                        if (!_) {
                            ((i = p ?? (p = {}))[n = f || Jn] ?? (i[n] = [])).push(S);
                        }
                        t.removeChild(S);
                    }
                    S = a;
                }
            }
            if (p != null) {
                g = {};
                for (f in p) {
                    s = e.t();
                    v = p[f];
                    for (A = 0, B = v.length; B > A; ++A) {
                        b = v[A];
                        if (b.nodeName === "TEMPLATE") {
                            if (b.attributes.length > 0) {
                                appendToTemplate(s, b);
                            } else {
                                appendToTemplate(s, b.content);
                            }
                        } else {
                            appendToTemplate(s, b);
                        }
                    }
                    C = e.Ws();
                    this.Es(s.content, C);
                    g[f] = CustomElementDefinition.create({
                        name: ys(),
                        template: s,
                        instructions: C.rows,
                        needsCompile: false
                    });
                }
                F.projections = g;
            }
            if (G) {
                if (u && (z || c.containerless)) {
                    this.zs(t, e);
                } else {
                    this.Vs(t, e);
                }
            }
            K = !u || !c.containerless && !z && j !== false;
            if (K) {
                if (t.nodeName === Fn) {
                    this.Es(t.content, l);
                } else {
                    S = t.firstChild;
                    while (S !== null) {
                        S = this.Es(S, l);
                    }
                }
            }
            q.def = CustomElementDefinition.create({
                name: ys(),
                template: r,
                instructions: l.rows,
                needsCompile: false
            });
            while (k-- > 0) {
                q = D[k];
                s = e.t();
                x = e.ht();
                appendManyToTemplate(s, [ x, e.js(On), e.js(Vn) ]);
                q.def = CustomElementDefinition.create({
                    name: ys(),
                    template: s,
                    needsCompile: false,
                    instructions: [ [ D[k + 1] ] ]
                });
            }
            e.rows.push([ q ]);
        } else {
            if (w != null) {
                e.rows.push(w);
            }
            let i = t.firstChild;
            let s;
            let n;
            let a = false;
            let f = null;
            let m;
            let g;
            let p;
            let v;
            let b;
            let x = false;
            let y = 0, k = 0;
            if (j !== false) {
                while (i !== null) {
                    n = isElement(i) ? i.getAttribute(tr) : null;
                    a = n !== null || u && !d;
                    s = i.nextSibling;
                    if (a) {
                        if (!u) {
                            throw createMappedError(706, n, h);
                        }
                        i.removeAttribute?.(tr);
                        x = isTextNode(i) && i.textContent.trim() === "";
                        if (!x) {
                            ((r = m ?? (m = {}))[l = n || Jn] ?? (r[l] = [])).push(i);
                        }
                        t.removeChild(i);
                    }
                    i = s;
                }
            }
            if (m != null) {
                f = {};
                for (n in m) {
                    v = e.t();
                    g = m[n];
                    for (y = 0, k = g.length; k > y; ++y) {
                        p = g[y];
                        if (p.nodeName === Fn) {
                            if (p.attributes.length > 0) {
                                appendToTemplate(v, p);
                            } else {
                                appendToTemplate(v, p.content);
                            }
                        } else {
                            appendToTemplate(v, p);
                        }
                    }
                    b = e.Ws();
                    this.Es(v.content, b);
                    f[n] = CustomElementDefinition.create({
                        name: ys(),
                        template: v,
                        instructions: b.rows,
                        needsCompile: false
                    });
                }
                F.projections = f;
            }
            if (G) {
                if (u && (z || c.containerless)) {
                    this.zs(t, e);
                } else {
                    this.Vs(t, e);
                }
            }
            K = !u || !c.containerless && !z && j !== false;
            if (K && t.childNodes.length > 0) {
                i = t.firstChild;
                while (i !== null) {
                    i = this.Es(i, e);
                }
            }
        }
        return a;
    }
    Os(t, e) {
        const i = t.parentNode;
        const s = e.ep.parse(t.textContent, gt);
        const n = t.nextSibling;
        let r;
        let l;
        let a;
        let h;
        let c;
        if (s !== null) {
            ({parts: r, expressions: l} = s);
            if (c = r[0]) {
                insertBefore(i, e.Us(c), t);
            }
            for (a = 0, h = l.length; h > a; ++a) {
                insertManyBefore(i, t, [ e.ht(), e.Us(" ") ]);
                if (c = r[a + 1]) {
                    insertBefore(i, e.Us(c), t);
                }
                e.rows.push([ new TextBindingInstruction(l[a]) ]);
            }
            i.removeChild(t);
        }
        return n;
    }
    qs(t, e, i, s) {
        const n = BindablesInfo.from(i, true);
        const r = e.length;
        const l = [];
        let a = void 0;
        let h = void 0;
        let c = 0;
        let u = 0;
        let f;
        let d;
        let m;
        let g;
        for (let p = 0; p < r; ++p) {
            u = e.charCodeAt(p);
            if (u === 92) {
                ++p;
            } else if (u === 58) {
                a = e.slice(c, p);
                while (e.charCodeAt(++p) <= 32) ;
                c = p;
                for (;p < r; ++p) {
                    u = e.charCodeAt(p);
                    if (u === 92) {
                        ++p;
                    } else if (u === 59) {
                        h = e.slice(c, p);
                        break;
                    }
                }
                if (h === void 0) {
                    h = e.slice(c);
                }
                d = s.He.parse(a, h);
                m = s.Ms(d);
                g = n.attrs[d.target];
                if (g == null) {
                    throw createMappedError(707, d.target, i.name);
                }
                if (m === null) {
                    f = s.ep.parse(h, gt);
                    l.push(f === null ? new SetPropertyInstruction(h, g.name) : new InterpolationInstruction(f, g.name));
                } else {
                    Wn.node = t;
                    Wn.attr = d;
                    Wn.bindable = g;
                    Wn.def = i;
                    l.push(m.build(Wn, s.ep, s.m));
                }
                while (p < r && e.charCodeAt(++p) <= 32) ;
                c = p;
                a = void 0;
                h = void 0;
            }
        }
        resetCommandBuildInfo();
        return l;
    }
    Is(t, e) {
        const i = e.root.def.name;
        const s = t;
        const n = R(s.querySelectorAll("template[as-custom-element]"));
        const r = n.length;
        if (r === 0) {
            return;
        }
        if (r === s.childElementCount) {
            throw createMappedError(708, i);
        }
        const l = new Set;
        for (const t of n) {
            if (t.parentNode !== s) {
                throw createMappedError(709, i);
            }
            const n = processTemplateName(i, t, l);
            const r = t.content;
            const a = R(r.querySelectorAll("bindable"));
            const h = new Set;
            const c = new Set;
            const u = a.reduce(((t, e) => {
                if (e.parentNode !== r) {
                    throw createMappedError(710, n);
                }
                const i = e.getAttribute("name");
                if (i === null) {
                    throw createMappedError(711, e, n);
                }
                const s = e.getAttribute("attribute");
                if (s !== null && c.has(s) || h.has(i)) {
                    throw createMappedError(712, h, s);
                } else {
                    if (s !== null) {
                        c.add(s);
                    }
                    h.add(i);
                }
                const l = R(e.attributes).filter((t => !Gn.includes(t.name)));
                if (l.length > 0) ;
                e.remove();
                t[i] = {
                    attribute: s ?? void 0,
                    mode: getBindingMode(e)
                };
                return t;
            }), {});
            class LocalTemplateType {}
            mt(LocalTemplateType, "name", {
                value: n
            });
            e.Gs(defineElement({
                name: n,
                template: t,
                bindables: u
            }, LocalTemplateType));
            s.removeChild(t);
        }
    }
    $s(t, e) {
        const i = t.nodeName;
        return i === "INPUT" && zn[t.type] === 1 || i === "SELECT" && (t.hasAttribute("multiple") || e?.some((t => t.type === $e && t.to === "multiple")));
    }
    Ns(t, e) {
        switch (t.nodeName) {
          case "INPUT":
            {
                const t = e;
                let i = void 0;
                let s = void 0;
                let n = 0;
                let r;
                for (let e = 0; e < t.length && n < 3; e++) {
                    r = t[e];
                    switch (r.to) {
                      case "model":
                      case "value":
                      case "matcher":
                        i = e;
                        n++;
                        break;

                      case "checked":
                        s = e;
                        n++;
                        break;
                    }
                }
                if (s !== void 0 && i !== void 0 && s < i) {
                    [t[i], t[s]] = [ t[s], t[i] ];
                }
                break;
            }

          case "SELECT":
            {
                const t = e;
                let i = 0;
                let s = 0;
                let n = 0;
                let r;
                for (let e = 0; e < t.length && n < 2; ++e) {
                    r = t[e];
                    switch (r.to) {
                      case "multiple":
                        s = e;
                        n++;
                        break;

                      case "value":
                        i = e;
                        n++;
                        break;
                    }
                    if (n === 2 && i < s) {
                        [t[s], t[i]] = [ t[i], t[s] ];
                    }
                }
            }
        }
    }
    Vs(t, e) {
        insertBefore(t.parentNode, e.js("au*"), t);
        return t;
    }
    zs(t, e) {
        if (isMarker(t)) {
            return t;
        }
        const i = t.parentNode;
        const s = e.ht();
        insertManyBefore(i, t, [ s, e.js(On), e.js(Vn) ]);
        i.removeChild(t);
        return s;
    }
}

const Fn = "TEMPLATE";

const On = "au-start";

const Vn = "au-end";

const isMarker = t => t.nodeValue === "au*";

class CompilationContext {
    constructor(t, e, i, s, n, r) {
        this.hasSlot = false;
        this.Ks = createLookup();
        const l = s !== null;
        this.c = e;
        this.root = n === null ? this : n;
        this.def = t;
        this.ci = i;
        this.parent = s;
        this.Ts = l ? s.Ts : e.get(qn);
        this.He = l ? s.He : e.get(Ts);
        this.ep = l ? s.ep : e.get(O);
        this.m = l ? s.m : e.get(nn);
        this.Hi = l ? s.Hi : e.get(S);
        this.p = l ? s.p : e.get(se);
        this.localEls = l ? s.localEls : new Set;
        this.rows = r ?? [];
    }
    Gs(t) {
        var e;
        ((e = this.root).deps ?? (e.deps = [])).push(t);
        this.root.c.register(t);
        return t;
    }
    Us(t) {
        return createText(this.p, t);
    }
    js(t) {
        return createComment(this.p, t);
    }
    ht() {
        return this.js("au*");
    }
    h(t) {
        const e = createElement(this.p, t);
        if (t === "template") {
            this.p.document.adoptNode(e.content);
        }
        return e;
    }
    t() {
        return this.h("template");
    }
    Ls(t) {
        return this.c.find(Cs, t);
    }
    Ds(t) {
        return this.c.find(ce, t);
    }
    Ws(t) {
        return new CompilationContext(this.def, this.c, this.ci, this, this.root, t);
    }
    Ms(t) {
        if (this.root !== this) {
            return this.root.Ms(t);
        }
        const e = t.command;
        if (e === null) {
            return null;
        }
        let i = this.Ks[e];
        if (i === void 0) {
            i = this.c.create(Ns, e);
            if (i === null) {
                throw createMappedError(713, e);
            }
            this.Ks[e] = i;
        }
        return i;
    }
}

const hasInlineBindings = t => {
    const e = t.length;
    let i = 0;
    let s = 0;
    while (e > s) {
        i = t.charCodeAt(s);
        if (i === 92) {
            ++s;
        } else if (i === 58) {
            return true;
        } else if (i === 36 && t.charCodeAt(s + 1) === 123) {
            return false;
        }
        ++s;
    }
    return false;
};

const resetCommandBuildInfo = () => {
    Wn.node = Wn.attr = Wn.bindable = Wn.def = null;
};

const $n = {
    projections: null
};

const Nn = {
    name: "unnamed"
};

const Wn = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const jn = ht(createLookup(), {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
});

const zn = {
    checkbox: 1,
    radio: 1
};

const Un = new WeakMap;

class BindablesInfo {
    static from(t, e) {
        let i = Un.get(t);
        if (i == null) {
            const s = t.bindables;
            const n = createLookup();
            const r = e ? t.defaultBindingMode === void 0 ? Rt : t.defaultBindingMode : Rt;
            let l;
            let a;
            let h = false;
            let c;
            let u;
            for (a in s) {
                l = s[a];
                u = l.attribute;
                if (l.primary === true) {
                    if (h) {
                        throw createMappedError(714, t);
                    }
                    h = true;
                    c = l;
                } else if (!h && c == null) {
                    c = l;
                }
                n[u] = BindableDefinition.create(a, t.Type, l);
            }
            if (l == null && e) {
                c = n.value = BindableDefinition.create("value", t.Type, {
                    mode: r
                });
            }
            Un.set(t, i = new BindablesInfo(n, s, c));
        }
        return i;
    }
    constructor(t, e, i) {
        this.attrs = t;
        this.bindables = e;
        this.primary = i;
    }
}

const Gn = at([ "name", "attribute", "mode" ]);

const Kn = "as-custom-element";

const processTemplateName = (t, e, i) => {
    const s = e.getAttribute(Kn);
    if (s === null || s === "") {
        throw createMappedError(715, t);
    }
    if (i.has(s)) {
        throw createMappedError(716, s, t);
    } else {
        i.add(s);
        e.removeAttribute(Kn);
    }
    return s;
};

const getBindingMode = t => {
    switch (t.getAttribute("mode")) {
      case "oneTime":
        return At;

      case "toView":
        return Bt;

      case "fromView":
        return St;

      case "twoWay":
        return _t;

      case "default":
      default:
        return Rt;
    }
};

const Xn = /*@__PURE__*/ Wt("ITemplateCompilerHooks");

const Qn = new WeakMap;

const Yn = /*@__PURE__*/ qt("compiler-hooks");

const Zn = at({
    name: Yn,
    define(t) {
        let e = Qn.get(t);
        if (e === void 0) {
            Qn.set(t, e = new TemplateCompilerHooksDefinition(t));
            Pt(Yn, e, t);
            Ht(t, Yn);
        }
        return t;
    }
});

class TemplateCompilerHooksDefinition {
    get name() {
        return "";
    }
    constructor(t) {
        this.Type = t;
    }
    register(t) {
        t.register(jt(Xn, this.Type));
    }
}

const templateCompilerHooks = t => {
    return t === void 0 ? decorator : decorator(t);
    function decorator(t) {
        return Zn.define(t);
    }
};

const Jn = "default";

const tr = "au-slot";

class Show {
    constructor() {
        this.el = c(cs);
        this.p = c(se);
        this.Xs = false;
        this.T = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.T = null;
            if (Boolean(this.value) !== this.Qs) {
                if (this.Qs === this.Ys) {
                    this.Qs = !this.Ys;
                    this.$val = this.el.style.getPropertyValue("display");
                    this.$prio = this.el.style.getPropertyPriority("display");
                    this.el.style.setProperty("display", "none", "important");
                } else {
                    this.Qs = this.Ys;
                    this.el.style.setProperty("display", this.$val, this.$prio);
                    if (this.el.getAttribute("style") === "") {
                        this.el.removeAttribute("style");
                    }
                }
            }
        };
        const t = c(ii);
        this.Qs = this.Ys = t.alias !== "hide";
    }
    binding() {
        this.Xs = true;
        this.update();
    }
    detaching() {
        this.Xs = false;
        this.T?.cancel();
        this.T = null;
    }
    valueChanged() {
        if (this.Xs && this.T === null) {
            this.T = this.p.domWriteQueue.queueTask(this.update);
        }
    }
}

__decorate([ bindable ], Show.prototype, "value", void 0);

alias("hide")(Show);

customAttribute("show")(Show);

const er = [ TemplateCompiler, et, NodeObserverLocator ];

const ir = [ Ms, Ls, Fs, Ds, Re ];

const sr = [ Hs, qs ];

const nr = [ Gs, Ws, zs, js, Us, Ks, tn, Xs, Qs, Js, Zs, Ys, en ];

const rr = [ DebounceBindingBehavior, OneTimeBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, SignalBindingBehavior, ThrottleBindingBehavior, TwoWayBindingBehavior, SanitizeValueConverter, If, Else, Repeat, With, Cn, Bn, Sn, _n, Rn, Tn, In, En, Pn, Ln, AttrBindingBehavior, SelfBindingBehavior, UpdateTriggerBindingBehavior, AuCompose, Portal, Focus, Show, Mn ];

const or = [ fi, di, ci, ui, ri, oi, li, ai, hi, gi, wi, pi, vi, bi, xi, mi, yi ];

const lr = /*@__PURE__*/ createConfiguration(s);

function createConfiguration(t) {
    return {
        optionsProvider: t,
        register(e) {
            const i = {
                coercingOptions: {
                    enableCoercion: false,
                    coerceNullish: false
                }
            };
            t(i);
            return e.register(Ut(j, i.coercingOptions), ...er, ...rr, ...ir, ...nr, ...or);
        },
        customize(e) {
            return createConfiguration(e ?? t);
        }
    };
}

function children(t, e) {
    if (!cr) {
        cr = true;
        F(ChildrenBinding);
        lifecycleHooks()(ChildrenLifecycleHooks);
    }
    let i;
    const s = "dependencies";
    function decorator(t, e, n) {
        if (arguments.length > 1) {
            i.name = e;
        }
        if (typeof t === "function" || typeof n?.value !== "undefined") {
            throw createMappedError(9991);
        }
        const r = t.constructor;
        let l = Cs.getAnnotation(r, s);
        if (l == null) {
            Cs.annotate(r, s, l = []);
        }
        l.push(new ChildrenLifecycleHooks(i));
    }
    if (arguments.length > 1) {
        i = {};
        decorator(t, e);
        return;
    } else if (isString(t)) {
        i = {
            filter: e => isElement(e) && e.matches(t),
            map: t => t
        };
        return decorator;
    }
    i = t === void 0 ? {} : t;
    return decorator;
}

class ChildrenBinding {
    constructor(t, e, i, s = defaultChildQuery, n = defaultChildFilter, r = defaultChildMap, l = ar) {
        this.Zs = void 0;
        this.X = defaultChildQuery;
        this.Js = defaultChildFilter;
        this.tn = defaultChildMap;
        this.isBound = false;
        this.I = t;
        this.obj = e;
        this.cb = i;
        this.X = s;
        this.Js = n;
        this.tn = r;
        this.V = l;
        this.bi = createMutationObserver(this.ps = t.host, (() => {
            this.en();
        }));
    }
    getValue() {
        return this.isBound ? this.Zs : this.sn();
    }
    setValue(t) {}
    bind() {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        this.bi.observe(this.ps, this.V);
        this.Zs = this.sn();
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.bi.disconnect();
        this.Zs = f;
    }
    en() {
        this.Zs = this.sn();
        this.cb?.call(this.obj);
        this.subs.notify(this.Zs, undefined);
    }
    get() {
        throw createMappedError(99, "get");
    }
    sn() {
        return filterChildren(this.I, this.X, this.Js, this.tn);
    }
}

const ar = {
    childList: true
};

const defaultChildQuery = t => t.host.childNodes;

const defaultChildFilter = (t, e, i) => !!i;

const defaultChildMap = (t, e, i) => i;

const hr = {
    optional: true
};

const filterChildren = (t, e, i, s) => {
    const n = e(t);
    const r = n.length;
    const l = [];
    let a;
    let h;
    let c;
    let u = 0;
    for (;u < r; ++u) {
        a = n[u];
        h = findElementControllerFor(a, hr);
        c = h?.viewModel ?? null;
        if (i(a, h, c)) {
            l.push(s(a, h, c));
        }
    }
    return l;
};

class ChildrenLifecycleHooks {
    constructor(t) {
        this.Y = t;
    }
    register(t) {
        Ut(ue, this).register(t);
    }
    hydrating(t, e) {
        const i = this.Y;
        const s = new ChildrenBinding(e, t, t[i.callback ?? `${rt(i.name)}Changed`], i.query ?? defaultChildQuery, i.filter ?? defaultChildFilter, i.map ?? defaultChildMap, i.options ?? ar);
        mt(t, i.name, {
            enumerable: true,
            configurable: true,
            get: ht((() => s.getValue()), {
                getObserver: () => s
            }),
            set: () => {}
        });
        e.addBinding(s);
    }
}

let cr = false;

export { AdoptedStyleSheetsStyles, AppRoot, ie as AppTask, Hs as AtPrefixedTriggerAttributePattern, AttrBindingBehavior, Ys as AttrBindingCommand, AttrSyntax, AttributeBinding, AttributeBindingInstruction, wi as AttributeBindingRenderer, AttributeNSAccessor, Ps as AttributePattern, AuCompose, Mn as AuSlot, AuSlotsInfo, Aurelia, $t as Bindable, BindableDefinition, BindablesInfo, Xt as BindingBehavior, BindingBehaviorDefinition, Ns as BindingCommand, BindingCommandDefinition, Tt as BindingMode, BindingModeBehavior, BindingTargetSubscriber, CSSModulesProcessorRegistry, Qs as CaptureBindingCommand, Bn as Case, CheckedObserver, ChildrenBinding, ClassAttributeAccessor, Js as ClassBindingCommand, qs as ColonPrefixedBindAttributePattern, ComputedWatcher, ContentBinding, Controller, ce as CustomAttribute, CustomAttributeDefinition, li as CustomAttributeRenderer, Cs as CustomElement, CustomElementDefinition, oi as CustomElementRenderer, DataAttributeAccessor, DebounceBindingBehavior, Gs as DefaultBindingCommand, nr as DefaultBindingLanguage, ir as DefaultBindingSyntax, Sn as DefaultCase, er as DefaultComponents, or as DefaultRenderers, rr as DefaultResources, Ls as DotSeparatedAttributePattern, Else, EventModifier, Re as EventModifierRegistration, ExpressionWatcher, FlushQueue, Focus, Ks as ForBindingCommand, FragmentNodeSequence, FromViewBindingBehavior, zs as FromViewBindingCommand, Tn as FulfilledTemplateController, HydrateAttributeInstruction, HydrateElementInstruction, HydrateLetElementInstruction, HydrateTemplateController, Bs as IAppRoot, ee as IAppTask, nn as IAttrMapper, Ts as IAttributeParser, Rs as IAttributePattern, Le as IAuSlotWatcher, Pe as IAuSlotsInfo, Ss as IAurelia, rs as IController, _e as IEventModifier, us as IEventTarget, be as IFlushQueue, vs as IHistory, os as IHydrationContext, ii as IInstruction, Se as IKeyMapping, ue as ILifecycleHooks, ps as ILocation, Be as IModifiedEventHandlerCreator, cs as INode, se as IPlatform, fs as IRenderLocation, ni as IRenderer, Ti as IRendering, sn as ISVGAnalyzer, Dn as ISanitizer, Pi as IShadowDOMGlobalStyles, Ei as IShadowDOMStyles, _s as ISyntaxInterpreter, si as ITemplateCompiler, Xn as ITemplateCompilerHooks, qn as ITemplateElementFactory, Te as IViewFactory, gs as IWindow, If, ei as InstructionType, InterpolationBinding, ui as InterpolationBindingRenderer, InterpolationInstruction, InterpolationPartBinding, Interpretation, IteratorBindingInstruction, di as IteratorBindingRenderer, LetBinding, LetBindingInstruction, hi as LetElementRenderer, me as LifecycleHooks, LifecycleHooksDefinition, LifecycleHooksEntry, ListenerBinding, ListenerBindingInstruction, ListenerBindingOptions, gi as ListenerBindingRenderer, MultiAttrInstruction, NodeObserverLocator, NoopSVGAnalyzer, OneTimeBindingBehavior, Ws as OneTimeBindingCommand, Rn as PendingTemplateController, Portal, _n as PromiseTemplateController, PropertyBinding, PropertyBindingInstruction, fi as PropertyBindingRenderer, Ms as RefAttributePattern, RefBinding, RefBindingInstruction, ci as RefBindingRenderer, In as RejectedTemplateController, Rendering, Repeat, SVGAnalyzer, SanitizeValueConverter, SelectValueObserver, SelfBindingBehavior, SetAttributeInstruction, pi as SetAttributeRenderer, SetClassAttributeInstruction, vi as SetClassAttributeRenderer, SetPropertyInstruction, ri as SetPropertyRenderer, SetStyleAttributeInstruction, bi as SetStyleAttributeRenderer, ShadowDOMRegistry, sr as ShortHandBindingSyntax, SignalBindingBehavior, SpreadBindingInstruction, SpreadElementPropBindingInstruction, yi as SpreadRenderer, lr as StandardConfiguration, ns as State, StyleAttributeAccessor, Zs as StyleBindingCommand, Li as StyleConfiguration, StyleElementStyles, StylePropertyBindingInstruction, xi as StylePropertyBindingRenderer, Cn as Switch, TemplateCompiler, Zn as TemplateCompilerHooks, ai as TemplateControllerRenderer, TextBindingInstruction, mi as TextBindingRenderer, ThrottleBindingBehavior, ToViewBindingBehavior, js as ToViewBindingCommand, Xs as TriggerBindingCommand, TwoWayBindingBehavior, Us as TwoWayBindingCommand, UpdateTriggerBindingBehavior, ValueAttributeObserver, pe as ValueConverter, ValueConverterDefinition, ViewFactory, oe as Watch, With, alias, allResources, attributePattern, bindable, bindingBehavior, bindingCommand, capture, children, coercer, containerless, convertToRenderLocation, cssModules, customAttribute, customElement, getEffectiveParentNode, getRef, isCustomElementController, isCustomElementViewModel, isInstruction, isRenderLocation, lifecycleHooks, mixinAstEvaluator, mixinUseScope, mixingBindingLimited, processContent, registerAliases, renderer, setEffectiveParentNode, setRef, shadowCSS, slotted, templateCompilerHooks, templateController, useShadowDOM, valueConverter, watch };

