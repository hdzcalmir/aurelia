import { Protocol as t, getPrototypeChain as e, kebabCase as i, noop as s, DI as n, Registration as r, firstDefined as l, mergeArrays as a, resourceBaseName as h, resource as c, getResourceKeyFor as u, resolve as f, IPlatform as d, emptyArray as m, Registrable as g, all as p, InstanceProvider as v, IContainer as x, optionalResource as w, optional as y, onResolveAll as b, onResolve as k, fromDefinitionOrDefault as C, pascalCase as A, fromAnnotationOrTypeOrDefault as B, fromAnnotationOrDefinitionOrTypeOrDefault as S, camelCase as T, IServiceLocator as R, emptyObject as I, ILogger as E, transient as _, toArray as P, allResources as L } from "../../../kernel/dist/native-modules/index.mjs";

import { Metadata as M, isObject as D } from "../../../metadata/dist/native-modules/index.mjs";

import { AccessorType as q, ISignaler as F, astEvaluate as H, connectable as O, astBind as V, astUnbind as $, astAssign as N, subscriberCollection as W, IExpressionParser as j, IObserverLocator as z, ConnectableSwitcher as U, ProxyObservable as G, ICoercionConfiguration as K, Scope as X, AccessScopeExpression as Q, PropertyAccessor as Y, INodeObserverLocator as Z, IDirtyChecker as J, getObserverLookup as tt, SetterObserver as et, createIndexMap as it, getCollectionObserver as st, BindingContext as nt, PrimitiveLiteralExpression as rt, DirtyChecker as ot } from "../../../runtime/dist/native-modules/index.mjs";

import { BrowserPlatform as lt } from "../../../platform-browser/dist/native-modules/index.mjs";

import { TaskAbortError as at } from "../../../platform/dist/native-modules/index.mjs";

function __decorate(t, e, i, s) {
    var n = arguments.length, r = n < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, i) : s, l;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(t, e, i, s); else for (var a = t.length - 1; a >= 0; a--) if (l = t[a]) r = (n < 3 ? l(r) : n > 3 ? l(e, i, r) : l(e, i)) || r;
    return n > 3 && r && Object.defineProperty(e, i, r), r;
}

const ht = Object;

const ct = String;

const ut = ht.prototype;

const createLookup = () => ht.create(null);

const createError$1 = t => new Error(t);

const ft = ut.hasOwnProperty;

const dt = ht.freeze;

const mt = ht.assign;

const gt = ht.getOwnPropertyNames;

const pt = ht.keys;

const vt = /*@__PURE__*/ createLookup();

const isDataAttribute = (t, e, i) => {
    if (vt[e] === true) {
        return true;
    }
    if (!isString(e)) {
        return false;
    }
    const s = e.slice(0, 5);
    return vt[e] = s === "aria-" || s === "data-" || i.isStandardSvgAttribute(t, e);
};

const isPromise = t => t instanceof Promise;

const isArray = t => t instanceof Array;

const isFunction = t => typeof t === "function";

const isString = t => typeof t === "string";

const rethrow = t => {
    throw t;
};

const xt = ht.is;

const wt = Reflect.defineProperty;

const defineHiddenProp = (t, e, i) => {
    wt(t, e, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: i
    });
    return i;
};

const addSignalListener = (t, e, i) => t.addSignalListener(e, i);

const removeSignalListener = (t, e, i) => t.removeSignalListener(e, i);

const yt = "Interpolation";

const bt = "IsIterator";

const kt = "IsFunction";

const Ct = "IsProperty";

const At = "pending";

const Bt = "running";

const St = q.Observer;

const Tt = q.Node;

const Rt = q.Layout;

const It = 1;

const Et = 2;

const _t = 4;

const Pt = 6;

const Lt = 8;

const Mt = /*@__PURE__*/ dt({
    oneTime: It,
    toView: Et,
    fromView: _t,
    twoWay: Pt,
    default: Lt
});

const Dt = M.getOwn;

const qt = M.hasOwn;

const Ft = M.define;

const {annotation: Ht} = t;

const Ot = Ht.keyFor;

const Vt = Ht.appendTo;

const $t = Ht.getKeys;

function bindable(t, e) {
    let i;
    function decorator(t, e) {
        if (arguments.length > 1) {
            i.name = e;
        }
        Ft(Nt, BindableDefinition.create(e, t, i), t.constructor, e);
        Vt(t.constructor, Wt.keyFrom(e));
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
    return t.startsWith(Nt);
}

const Nt = /*@__PURE__*/ Ot("bindable");

const Wt = dt({
    name: Nt,
    keyFrom: t => `${Nt}:${t}`,
    from(t, ...e) {
        const i = {};
        const s = Array.isArray;
        function addName(e) {
            i[e] = BindableDefinition.create(e, t);
        }
        function addDescription(e, s) {
            i[e] = s instanceof BindableDefinition ? s : BindableDefinition.create(e, t, s === true ? {} : s);
        }
        function addList(t) {
            if (s(t)) {
                t.forEach((t => isString(t) ? addName(t) : addDescription(t.name, t)));
            } else if (t instanceof BindableDefinition) {
                i[t.name] = t;
            } else if (t !== void 0) {
                pt(t).forEach((e => addDescription(e, t[e])));
            }
        }
        e.forEach(addList);
        return i;
    },
    getAll(t) {
        const i = Nt.length + 1;
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
            a = $t(c).filter(isBindableAnnotation);
            h = a.length;
            for (u = 0; u < h; ++u) {
                s[l++] = Dt(Nt, c, a[u].slice(i));
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
        return new BindableDefinition(s.attribute ?? i(t), s.callback ?? `${t}Changed`, s.mode ?? Et, s.primary ?? false, s.name ?? t, s.set ?? getInterceptor(t, e, s));
    }
}

function coercer(t, e, i) {
    jt.define(t, e);
}

const jt = {
    key: /*@__PURE__*/ Ot("coercer"),
    define(t, e) {
        Ft(jt.key, t[e].bind(t), t);
    },
    for(t) {
        return Dt(jt.key, t);
    }
};

function getInterceptor(t, e, i = {}) {
    const n = i.type ?? M.get("design:type", e, t) ?? null;
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
            r = typeof t === "function" ? t.bind(n) : jt.for(n) ?? s;
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

const zt = n.createInterface;

const Ut = r.singleton;

const Gt = r.aliasTo;

const Kt = r.instance;

r.callback;

r.transient;

const registerResolver = (t, e, i) => t.registerResolver(e, i);

function alias(...t) {
    return function(e) {
        const i = Ot("aliases");
        const s = Dt(i, e);
        if (s === void 0) {
            Ft(i, t, e);
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

const createMappedError = (t, ...e) => new Error(`AUR${ct(t).padStart(4, "0")}:${e.map(ct)}`);

const Xt = "element";

const Qt = "attribute";

const Yt = "__au_static_resource__";

const getDefinitionFromStaticAu = (t, e, i) => {
    let s = Dt(Yt, t);
    if (s == null) {
        if (t.$au?.type === e) {
            s = i(t.$au, t);
            Ft(Yt, s, t);
        }
    }
    return s;
};

function bindingBehavior(t) {
    return function(e) {
        return te.define(t, e);
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
        return new BindingBehaviorDefinition(e, l(getBehaviorAnnotation(e, "name"), i), a(getBehaviorAnnotation(e, "aliases"), s.aliases, e.aliases), te.keyFrom(i));
    }
    register(t, e) {
        const i = this.Type;
        const s = typeof e === "string" ? getBindingBehaviorKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(s, false)) {
            t.register(t.has(i, false) ? null : Ut(i, i), Gt(i, s), ...n.map((t => Gt(i, getBindingBehaviorKeyFrom(t)))));
        }
    }
}

const Zt = "binding-behavior";

const Jt = /*@__PURE__*/ u(Zt);

const getBehaviorAnnotation = (t, e) => Dt(Ot(e), t);

const getBindingBehaviorKeyFrom = t => `${Jt}:${t}`;

const te = dt({
    name: Jt,
    keyFrom: getBindingBehaviorKeyFrom,
    isType(t) {
        return isFunction(t) && (qt(Jt, t) || t.$au?.type === Zt);
    },
    define(t, e) {
        const i = BindingBehaviorDefinition.create(t, e);
        const s = i.Type;
        Ft(Jt, i, s);
        Ft(h, i, s);
        return s;
    },
    getDefinition(t) {
        const e = Dt(Jt, t) ?? getDefinitionFromStaticAu(t, Zt, BindingBehaviorDefinition.create);
        if (e === void 0) {
            throw createMappedError(151, t);
        }
        return e;
    },
    find(t, e) {
        const i = t.find(Zt, e);
        return i == null ? null : Dt(Jt, i) ?? getDefinitionFromStaticAu(i, Zt, BindingBehaviorDefinition.create) ?? null;
    },
    get(t, e) {
        return t.get(c(getBindingBehaviorKeyFrom(e)));
    }
});

const ee = new Map;

const createConfig = t => ({
    type: Zt,
    name: t
});

class BindingModeBehavior {
    bind(t, e) {
        ee.set(e, e.mode);
        e.mode = this.mode;
    }
    unbind(t, e) {
        e.mode = ee.get(e);
        ee.delete(e);
    }
}

class OneTimeBindingBehavior extends BindingModeBehavior {
    get mode() {
        return It;
    }
}

OneTimeBindingBehavior.$au = createConfig("oneTime");

class ToViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return Et;
    }
}

ToViewBindingBehavior.$au = createConfig("toView");

class FromViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return _t;
    }
}

FromViewBindingBehavior.$au = createConfig("fromView");

class TwoWayBindingBehavior extends BindingModeBehavior {
    get mode() {
        return Pt;
    }
}

TwoWayBindingBehavior.$au = createConfig("twoWay");

const ie = new WeakMap;

const se = 200;

class DebounceBindingBehavior {
    constructor() {
        this.p = f(d);
    }
    bind(t, e, i, s) {
        const n = {
            type: "debounce",
            delay: i ?? se,
            now: this.p.performanceNow,
            queue: this.p.taskQueue,
            signals: isString(s) ? [ s ] : s ?? m
        };
        const r = e.limit?.(n);
        if (r == null) ; else {
            ie.set(e, r);
        }
    }
    unbind(t, e) {
        ie.get(e)?.dispose();
        ie.delete(e);
    }
}

DebounceBindingBehavior.$au = {
    type: Zt,
    name: "debounce"
};

class SignalBindingBehavior {
    constructor() {
        this.i = new Map;
        this.u = f(F);
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

SignalBindingBehavior.$au = {
    type: Zt,
    name: "signal"
};

const ne = new WeakMap;

const re = 200;

class ThrottleBindingBehavior {
    constructor() {
        ({performanceNow: this.C, taskQueue: this.A} = f(d));
    }
    bind(t, e, i, s) {
        const n = {
            type: "throttle",
            delay: i ?? re,
            now: this.C,
            queue: this.A,
            signals: isString(s) ? [ s ] : s ?? m
        };
        const r = e.limit?.(n);
        if (r == null) ; else {
            ne.set(e, r);
        }
    }
    unbind(t, e) {
        ne.get(e)?.dispose();
        ne.delete(e);
    }
}

ThrottleBindingBehavior.$au = {
    type: Zt,
    name: "throttle"
};

const oe = /*@__PURE__*/ zt("IAppTask");

class $AppTask {
    constructor(t, e, i) {
        this.c = void 0;
        this.slot = t;
        this.k = e;
        this.cb = i;
    }
    register(t) {
        return this.c = t.register(Kt(oe, this));
    }
    run() {
        const t = this.k;
        const e = this.cb;
        return t === null ? e() : e(this.c.get(t));
    }
}

const le = dt({
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

const ae = d;

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
                throw createMappedError(773, `${ct(e)}@${l.name}}`);
            }
        } else if (!isFunction(n?.value)) {
            throw createMappedError(774, s);
        }
        he.add(l, a);
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

const he = /*@__PURE__*/ (() => {
    const t = new WeakMap;
    return dt({
        add(e, i) {
            let s = t.get(e);
            if (s == null) {
                t.set(e, s = []);
            }
            s.push(i);
        },
        getDefinitions(e) {
            return t.get(e) ?? m;
        }
    });
})();

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
    get kind() {
        return Qt;
    }
    constructor(t, e, i, s, n, r, l, a, h, c, u) {
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
        this.containerStrategy = u;
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
        return new CustomAttributeDefinition(e, l(getAttributeAnnotation(e, "name"), i), a(getAttributeAnnotation(e, "aliases"), s.aliases, e.aliases), getAttributeKeyFrom(i), l(getAttributeAnnotation(e, "defaultBindingMode"), s.defaultBindingMode, e.defaultBindingMode, Et), l(getAttributeAnnotation(e, "isTemplateController"), s.isTemplateController, e.isTemplateController, false), Wt.from(e, ...Wt.getAll(e), getAttributeAnnotation(e, "bindables"), e.bindables, s.bindables), l(getAttributeAnnotation(e, "noMultiBindings"), s.noMultiBindings, e.noMultiBindings, false), a(he.getDefinitions(e), e.watches), a(getAttributeAnnotation(e, "dependencies"), s.dependencies, e.dependencies), l(getAttributeAnnotation(e, "containerStrategy"), s.containerStrategy, e.containerStrategy, "reuse"));
    }
    register(t, e) {
        const i = this.Type;
        const s = typeof e === "string" ? getAttributeKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(s, false)) {
            t.register(t.has(i, false) ? null : Ut(i, i), Gt(i, s), ...n.map((t => Gt(i, getAttributeKeyFrom(t)))));
        }
    }
    toString() {
        return `au:ca:${this.name}`;
    }
}

const ce = "custom-attribute";

const ue = /*@__PURE__*/ u(ce);

const getAttributeKeyFrom = t => `${ue}:${t}`;

const getAttributeAnnotation = (t, e) => Dt(Ot(e), t);

const isAttributeType = t => isFunction(t) && (qt(ue, t) || t.$au?.type === ce);

const findAttributeControllerFor = (t, e) => getRef(t, getAttributeKeyFrom(e)) ?? void 0;

const defineAttribute = (t, e) => {
    const i = CustomAttributeDefinition.create(t, e);
    const s = i.Type;
    Ft(ue, i, s);
    Ft(h, i, s);
    return s;
};

const getAttributeDefinition = t => {
    const e = Dt(ue, t) ?? getDefinitionFromStaticAu(t, ce, CustomAttributeDefinition.create);
    if (e === void 0) {
        throw createMappedError(759, t);
    }
    return e;
};

const findClosestControllerByName = (t, e) => {
    let i = "";
    let s = "";
    if (isString(e)) {
        i = getAttributeKeyFrom(e);
        s = e;
    } else {
        const t = getAttributeDefinition(e);
        i = t.key;
        s = t.name;
    }
    let n = t;
    while (n !== null) {
        const t = getRef(n, i);
        if (t?.is(s)) {
            return t;
        }
        n = getEffectiveParentNode(n);
    }
    return null;
};

const fe = dt({
    name: ue,
    keyFrom: getAttributeKeyFrom,
    isType: isAttributeType,
    for: findAttributeControllerFor,
    closest: findClosestControllerByName,
    define: defineAttribute,
    getDefinition: getAttributeDefinition,
    annotate(t, e, i) {
        Ft(Ot(e), i, t);
    },
    getAnnotation: getAttributeAnnotation,
    find(t, e) {
        const i = t.find(ce, e);
        return i === null ? null : Dt(ue, i) ?? getDefinitionFromStaticAu(i, ce, CustomAttributeDefinition.create) ?? null;
    }
});

const de = /*@__PURE__*/ zt("ILifecycleHooks");

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
        while (s !== ut) {
            for (const t of gt(s)) {
                if (t !== "constructor" && !t.startsWith("_")) {
                    i.add(t);
                }
            }
            s = Object.getPrototypeOf(s);
        }
        return new LifecycleHooksDefinition(e, i);
    }
}

const me = /*@__PURE__*/ (() => {
    const t = new WeakMap;
    const e = new WeakMap;
    return dt({
        define(t, i) {
            const s = LifecycleHooksDefinition.create(t, i);
            const n = s.Type;
            e.set(n, s);
            return g.define(n, (t => {
                Ut(de, n).register(t);
            }));
        },
        resolve(i) {
            let s = t.get(i);
            if (s === void 0) {
                t.set(i, s = new LifecycleHooksLookupImpl);
                const n = i.root;
                const r = n === i ? i.getAll(de) : i.has(de, false) ? n.getAll(de).concat(i.getAll(de)) : n.getAll(de);
                let l;
                let a;
                let h;
                let c;
                let u;
                for (l of r) {
                    a = e.get(l.constructor);
                    h = new LifecycleHooksEntry(a, l);
                    for (c of a.propertyNames) {
                        u = s[c];
                        if (u === void 0) {
                            s[c] = [ h ];
                        } else {
                            u.push(h);
                        }
                    }
                }
            }
            return s;
        }
    });
})();

class LifecycleHooksLookupImpl {}

function lifecycleHooks() {
    return function decorator(t) {
        return me.define({}, t);
    };
}

function valueConverter(t) {
    return function(e) {
        return ve.define(t, e);
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
        return new ValueConverterDefinition(e, l(getConverterAnnotation(e, "name"), i), a(getConverterAnnotation(e, "aliases"), s.aliases, e.aliases), ve.keyFrom(i));
    }
    register(t, e) {
        const i = this.Type;
        const s = typeof e === "string" ? getValueConverterKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(s, false)) {
            t.register(t.has(i, false) ? null : Ut(i, i), Gt(i, s), ...n.map((t => Gt(i, getValueConverterKeyFrom(t)))));
        }
    }
}

const ge = "value-converter";

const pe = /*@__PURE__*/ u(ge);

const getConverterAnnotation = (t, e) => Dt(Ot(e), t);

const getValueConverterKeyFrom = t => `${pe}:${t}`;

const ve = dt({
    name: pe,
    keyFrom: getValueConverterKeyFrom,
    isType(t) {
        return isFunction(t) && (qt(pe, t) || t.$au?.type === ge);
    },
    define(t, e) {
        const i = ValueConverterDefinition.create(t, e);
        const s = i.Type;
        Ft(pe, i, s);
        Ft(h, i, s);
        return s;
    },
    getDefinition(t) {
        const e = Dt(pe, t) ?? getDefinitionFromStaticAu(t, ge, ValueConverterDefinition.create);
        if (e === void 0) {
            throw createMappedError(152, t);
        }
        return e;
    },
    annotate(t, e, i) {
        Ft(Ot(e), i, t);
    },
    getAnnotation: getConverterAnnotation,
    find(t, e) {
        const i = t.find(ge, e);
        return i == null ? null : Dt(pe, i) ?? getDefinitionFromStaticAu(i, ge, ValueConverterDefinition.create) ?? null;
    },
    get(t, e) {
        return t.get(c(getValueConverterKeyFrom(e)));
    }
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
        if (t !== H(i.ast, i.s, i, null)) {
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
        wt(s, "strict", {
            enumerable: true,
            get: function() {
                return t;
            }
        });
    }
    wt(s, "strictFnCall", {
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

const xe = new WeakMap;

const we = new WeakMap;

class ResourceLookup {}

const ye = /*@__PURE__*/ zt("IFlushQueue", (t => t.singleton(FlushQueue)));

class FlushQueue {
    constructor() {
        this.T = false;
        this.R = new Set;
    }
    get count() {
        return this.R.size;
    }
    add(t) {
        this.R.add(t);
        if (this.T) {
            return;
        }
        this.T = true;
        try {
            this.R.forEach(flushItem);
        } finally {
            this.T = false;
        }
    }
    clear() {
        this.R.clear();
        this.T = false;
    }
}

function useScope(t) {
    this.s = t;
}

function evaluatorGet(t) {
    return this.l.get(t);
}

function evaluatorGetSignaler() {
    return this.l.root.get(F);
}

function evaluatorGetConverter(t) {
    let e = xe.get(this);
    if (e == null) {
        xe.set(this, e = new ResourceLookup);
    }
    return e[t] ??= ve.get(this.l, t);
}

function evaluatorGetBehavior(t) {
    let e = we.get(this);
    if (e == null) {
        we.set(this, e = new ResourceLookup);
    }
    return e[t] ??= te.get(this.l, t);
}

function flushItem(t, e, i) {
    i.delete(t);
    t.flush();
}

const be = new WeakSet;

const mixingBindingLimited = (t, e) => {
    defineHiddenProp(t.prototype, "limit", (function(t) {
        if (be.has(this)) {
            throw createMappedError(9996);
        }
        be.add(this);
        const i = e(this, t);
        const s = t.signals;
        const n = s.length > 0 ? this.get(F) : null;
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
                be.delete(this);
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
        l = s?.status === At;
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
        h = s?.status === At;
        u();
        if (h) {
            callOriginalCallback();
        }
    };
    return fn;
};

const ke = {
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
        this.I = null;
        this.v = void 0;
        this.boundFn = false;
        this.l = e;
        this.ast = n;
        this._ = t;
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
                let n = ct(t);
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
                    e.setAttribute(i, ct(t));
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
        const e = H(this.ast, this.s, this, (this.mode & Et) > 0 ? this : null);
        this.obs.clear();
        if (e !== this.v) {
            this.v = e;
            const i = this._.state !== ss;
            if (i) {
                t = this.I;
                this.I = this.A.queueTask((() => {
                    this.I = null;
                    this.updateTarget(e);
                }), ke);
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
        V(this.ast, t, this);
        if (this.mode & (Et | It)) {
            this.updateTarget(this.v = H(this.ast, t, this, (this.mode & Et) > 0 ? this : null));
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        $(this.ast, this.s, this);
        this.s = void 0;
        this.v = void 0;
        this.I?.cancel();
        this.I = null;
        this.obs.clearAll();
    }
}

mixinUseScope(AttributeBinding);

mixingBindingLimited(AttributeBinding, (() => "updateTarget"));

O(AttributeBinding);

mixinAstEvaluator(true)(AttributeBinding);

const Ce = {
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
        this.I = null;
        this._ = t;
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
        const l = this._.state !== ss && (r.type & Rt) > 0;
        let a;
        if (l) {
            a = this.I;
            this.I = this.A.queueTask((() => {
                this.I = null;
                r.setValue(s, this.target, this.targetProperty);
            }), Ce);
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
        this.I?.cancel();
        this.I = null;
    }
}

class InterpolationPartBinding {
    constructor(t, e, i, s, n, r) {
        this.ast = t;
        this.target = e;
        this.targetProperty = i;
        this.owner = r;
        this.mode = Et;
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
        const t = H(this.ast, this.s, this, (this.mode & Et) > 0 ? this : null);
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
        V(this.ast, t, this);
        this.v = H(this.ast, this.s, this, (this.mode & Et) > 0 ? this : null);
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
        $(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

mixinUseScope(InterpolationPartBinding);

mixingBindingLimited(InterpolationPartBinding, (() => "updateTarget"));

O(InterpolationPartBinding);

mixinAstEvaluator(true)(InterpolationPartBinding);

const Ae = {
    reusable: false,
    preempt: true
};

class ContentBinding {
    constructor(t, e, i, s, n, r, l) {
        this.p = n;
        this.ast = r;
        this.target = l;
        this.isBound = false;
        this.mode = Et;
        this.I = null;
        this.v = "";
        this.M = false;
        this.boundFn = false;
        this.strict = true;
        this.l = e;
        this._ = t;
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
        e.textContent = ct(t ?? "");
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = H(this.ast, this.s, this, (this.mode & Et) > 0 ? this : null);
        this.obs.clear();
        if (t === this.v) {
            this.I?.cancel();
            this.I = null;
            return;
        }
        const e = this._.state !== ss;
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
        const t = this.v = H(this.ast, this.s, this, (this.mode & Et) > 0 ? this : null);
        this.obs.clear();
        if (isArray(t)) {
            this.observeCollection(t);
        }
        const e = this._.state !== ss;
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
        V(this.ast, t, this);
        const e = this.v = H(this.ast, this.s, this, (this.mode & Et) > 0 ? this : null);
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
        $(this.ast, this.s, this);
        if (this.M) {
            this.v.parentNode?.removeChild(this.v);
        }
        this.s = void 0;
        this.obs.clearAll();
        this.I?.cancel();
        this.I = null;
    }
    q(t) {
        const e = this.I;
        this.I = this.A.queueTask((() => {
            this.I = null;
            this.updateTarget(t);
        }), Ae);
        e?.cancel();
    }
}

mixinUseScope(ContentBinding);

mixingBindingLimited(ContentBinding, (() => "updateTarget"));

O()(ContentBinding);

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
        this.F = n;
    }
    updateTarget() {
        this.target[this.targetProperty] = this.v;
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        this.v = H(this.ast, this.s, this, this);
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
        this.target = this.F ? t.bindingContext : t.overrideContext;
        V(this.ast, t, this);
        this.v = H(this.ast, this.s, this, this);
        this.updateTarget();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        $(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

mixinUseScope(LetBinding);

mixingBindingLimited(LetBinding, (() => "updateTarget"));

O(LetBinding);

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
        this.I = null;
        this.H = null;
        this.boundFn = false;
        this.l = e;
        this._ = t;
        this.A = s;
        this.oL = i;
    }
    updateTarget(t) {
        this.P.setValue(t, this.target, this.targetProperty);
    }
    updateSource(t) {
        N(this.ast, this.s, this, t);
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = H(this.ast, this.s, this, (this.mode & Et) > 0 ? this : null);
        this.obs.clear();
        const e = this._.state !== ss && (this.P.type & Rt) > 0;
        if (e) {
            Be = this.I;
            this.I = this.A.queueTask((() => {
                this.updateTarget(t);
                this.I = null;
            }), Se);
            Be?.cancel();
            Be = null;
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
        V(this.ast, t, this);
        const e = this.oL;
        const i = this.mode;
        let s = this.P;
        if (!s) {
            if (i & _t) {
                s = e.getObserver(this.target, this.targetProperty);
            } else {
                s = e.getAccessor(this.target, this.targetProperty);
            }
            this.P = s;
        }
        const n = (i & Et) > 0;
        if (i & (Et | It)) {
            this.updateTarget(H(this.ast, this.s, this, n ? this : null));
        }
        if (i & _t) {
            s.subscribe(this.H ??= new BindingTargetSubscriber(this, this.l.get(ye)));
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
        $(this.ast, this.s, this);
        this.s = void 0;
        if (this.H) {
            this.P.unsubscribe(this.H);
            this.H = null;
        }
        this.I?.cancel();
        this.I = null;
        this.obs.clearAll();
    }
    useTargetObserver(t) {
        this.P?.unsubscribe(this);
        (this.P = t).subscribe(this);
    }
    useTargetSubscriber(t) {
        if (this.H != null) {
            throw createMappedError(9995);
        }
        this.H = t;
    }
}

mixinUseScope(PropertyBinding);

mixingBindingLimited(PropertyBinding, (t => t.mode & _t ? "updateSource" : "updateTarget"));

O(PropertyBinding);

mixinAstEvaluator(true, false)(PropertyBinding);

let Be = null;

const Se = {
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
        V(this.ast, t, this);
        N(this.ast, this.s, this, this.target);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        if (H(this.ast, this.s, this, null) === this.target) {
            N(this.ast, this.s, this, null);
        }
        $(this.ast, this.s, this);
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
        let i = H(this.ast, this.s, this, null);
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
        V(this.ast, t, this);
        this.target.addEventListener(this.targetEvent, this, this.V);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        $(this.ast, this.s, this);
        this.s = void 0;
        this.target.removeEventListener(this.targetEvent, this, this.V);
    }
}

mixinUseScope(ListenerBinding);

mixingBindingLimited(ListenerBinding, (() => "callSource"));

mixinAstEvaluator(true, true)(ListenerBinding);

const Te = /*@__PURE__*/ zt("IEventModifier");

const Re = /*@__PURE__*/ zt("IKeyMapping", (t => t.instance({
    meta: dt([ "ctrl", "alt", "shift", "meta" ]),
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
        this.$ = f(Re);
        this.N = [ "left", "middle", "right" ];
    }
    static register(t) {
        t.register(Ut(Te, ModifiedMouseEventHandler));
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
        this.$ = f(Re);
        this.type = [ "keydown", "keyup" ];
    }
    static register(t) {
        t.register(Ut(Te, ModifiedKeyboardEventHandler));
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

const Ie = /*@__PURE__*/ zt("IEventModifierHandler", (t => t.instance({
    getHandler: () => null
})));

class EventModifier {
    constructor() {
        this.W = f(p(Te)).reduce(((t, e) => {
            const i = isArray(e.type) ? e.type : [ e.type ];
            i.forEach((i => t[i] = e));
            return t;
        }), {});
    }
    static register(t) {
        t.register(Ut(Ie, EventModifier));
    }
    getHandler(t, e) {
        return isString(e) ? this.W[t]?.getHandler(e) ?? null : null;
    }
}

const Ee = {
    register(t) {
        t.register(EventModifier, ModifiedMouseEventHandler, ModifiedKeyboardEventHandler);
    }
};

const _e = /*@__PURE__*/ zt("IViewFactory");

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

const Pe = "au-start";

const Le = "au-end";

const createElement = (t, e) => t.document.createElement(e);

const createComment = (t, e) => t.document.createComment(e);

const createLocation = t => {
    const e = createComment(t, Le);
    e.$start = createComment(t, Pe);
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

const Me = "default";

const De = "au-slot";

const qe = /*@__PURE__*/ zt("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

const Fe = /*@__PURE__*/ zt("IAuSlotWatcher");

class AuSlotWatcherBinding {
    constructor(t, e, i, s) {
        this.G = new Set;
        this.K = m;
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
        Kt(de, this).register(t);
    }
    hydrating(t, e) {
        const i = this.Y;
        const s = new AuSlotWatcherBinding(t, i.callback ?? `${ct(i.name)}Changed`, i.slotName ?? "default", i.query ?? "*");
        wt(t, i.name, {
            enumerable: true,
            configurable: true,
            get: mt((() => s.getValue()), {
                getObserver: () => s
            }),
            set: () => {}
        });
        Kt(Fe, s).register(e.container);
        e.addBinding(s);
    }
}

function slotted(t, e) {
    if (!He) {
        He = true;
        W(AuSlotWatcherBinding);
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
        let h = Is.getAnnotation(a, i);
        if (h == null) {
            Is.annotate(a, i, h = []);
        }
        h.push(new SlottedLifecycleHooks(l));
    }
    return decorator;
}

let He = false;

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
            const f = n.compileSpread(s.controller.definition, s.instruction?.captures ?? m, s.controller.container, e, i);
            let d;
            for (d of f) {
                switch (d.type) {
                  case si:
                    renderSpreadInstruction(t + 1);
                    break;

                  case ni:
                    c[d.instructions.type].render(u, findElementControllerFor(e), d.instructions, r, l, a);
                    break;

                  default:
                    c[d.type].render(u, e, d, r, l, a);
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
        if (t.vmKind !== ts) {
            throw createMappedError(9998);
        }
        this.$controller.addChild(t);
    }
}

const Oe = "ra";

const Ve = "rb";

const $e = "rc";

const Ne = "rd";

const We = "re";

const je = "rf";

const ze = "rg";

const Ue = "ri";

const Ge = "rj";

const Ke = "rk";

const Xe = "rl";

const Qe = "ha";

const Ye = "hb";

const Ze = "hc";

const Je = "hd";

const ti = "he";

const ei = "hf";

const ii = "hg";

const si = "hs";

const ni = "hp";

const ri = /*@__PURE__*/ dt({
    hydrateElement: Oe,
    hydrateAttribute: Ve,
    hydrateTemplateController: $e,
    hydrateLetElement: Ne,
    setProperty: We,
    interpolation: je,
    propertyBinding: ze,
    letBinding: Ue,
    refBinding: Ge,
    iteratorBinding: Ke,
    multiAttr: Xe,
    textBinding: Qe,
    listenerBinding: Ye,
    attributeBinding: Ze,
    stylePropertyBinding: Je,
    setAttribute: ti,
    setClassAttribute: ei,
    setStyleAttribute: ii,
    spreadBinding: si,
    spreadElementProp: ni
});

const oi = /*@__PURE__*/ zt("Instruction");

function isInstruction(t) {
    const e = t.type;
    return isString(e) && e.length === 2;
}

class InterpolationInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = je;
    }
}

class PropertyBindingInstruction {
    constructor(t, e, i) {
        this.from = t;
        this.to = e;
        this.mode = i;
        this.type = ze;
    }
}

class IteratorBindingInstruction {
    constructor(t, e, i) {
        this.forOf = t;
        this.to = e;
        this.props = i;
        this.type = Ke;
    }
}

class RefBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Ge;
    }
}

class SetPropertyInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = We;
    }
}

class MultiAttrInstruction {
    constructor(t, e, i) {
        this.value = t;
        this.to = e;
        this.command = i;
        this.type = Xe;
    }
}

class HydrateElementInstruction {
    constructor(t, e, i, s, n, r) {
        this.res = t;
        this.props = e;
        this.projections = i;
        this.containerless = s;
        this.captures = n;
        this.data = r;
        this.type = Oe;
    }
}

class HydrateAttributeInstruction {
    constructor(t, e, i) {
        this.res = t;
        this.alias = e;
        this.props = i;
        this.type = Ve;
    }
}

class HydrateTemplateController {
    constructor(t, e, i, s) {
        this.def = t;
        this.res = e;
        this.alias = i;
        this.props = s;
        this.type = $e;
    }
}

class HydrateLetElementInstruction {
    constructor(t, e) {
        this.instructions = t;
        this.toBindingContext = e;
        this.type = Ne;
    }
}

class LetBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Ue;
    }
}

class TextBindingInstruction {
    constructor(t) {
        this.from = t;
        this.type = Qe;
    }
}

class ListenerBindingInstruction {
    constructor(t, e, i, s) {
        this.from = t;
        this.to = e;
        this.capture = i;
        this.modifier = s;
        this.type = Ye;
    }
}

class StylePropertyBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Je;
    }
}

class SetAttributeInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = ti;
    }
}

class SetClassAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = ei;
    }
}

class SetStyleAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = ii;
    }
}

class AttributeBindingInstruction {
    constructor(t, e, i) {
        this.attr = t;
        this.from = e;
        this.to = i;
        this.type = Ze;
    }
}

class SpreadBindingInstruction {
    constructor() {
        this.type = si;
    }
}

class SpreadElementPropBindingInstruction {
    constructor(t) {
        this.instructions = t;
        this.type = ni;
    }
}

const li = /*@__PURE__*/ zt("ITemplateCompiler");

const ai = /*@__PURE__*/ zt("IRenderer");

function renderer(t) {
    return function decorator(e) {
        wt(e.prototype, "target", {
            configurable: true,
            get() {
                return t;
            }
        });
        return g.define(e, (function(t) {
            Ut(ai, this).register(t);
        }));
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

let hi = class SetPropertyRenderer {
    render(t, e, i) {
        const s = getTarget(e);
        if (s.$observers?.[i.to] !== void 0) {
            s.$observers[i.to].setValue(i.value);
        } else {
            s[i.to] = i.value;
        }
    }
};

hi = __decorate([ renderer(We) ], hi);

let ci = class CustomElementRenderer {
    constructor() {
        this.r = f(Mi);
    }
    render(t, e, i, s, n, r) {
        let l;
        let a;
        let h;
        const c = i.res;
        const u = i.projections;
        const f = t.container;
        switch (typeof c) {
          case "string":
            l = Is.find(f, c);
            if (l == null) {
                throw createMappedError(752, i, t);
            }
            break;

          default:
            l = c;
        }
        const d = i.containerless || l.containerless;
        const m = d ? convertToRenderLocation(e) : null;
        const g = createElementContainer(s, t, e, i, m, u == null ? void 0 : new AuSlotsInfo(pt(u)));
        a = g.invoke(l.Type);
        h = Controller.$el(g, a, e, i, l, m);
        setRef(e, l.key, h);
        const p = this.r.renderers;
        const v = i.props;
        const x = v.length;
        let w = 0;
        let y;
        while (x > w) {
            y = v[w];
            p[y.type].render(t, h, y, s, n, r);
            ++w;
        }
        t.addChild(h);
    }
};

ci = __decorate([ renderer(Oe) ], ci);

let ui = class CustomAttributeRenderer {
    constructor() {
        this.r = f(Mi);
    }
    render(t, e, i, s, n, r) {
        let l = t.container;
        let a;
        switch (typeof i.res) {
          case "string":
            a = fe.find(l, i.res);
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

ui = __decorate([ renderer(Ve) ], ui);

let fi = class TemplateControllerRenderer {
    constructor() {
        this.r = f(Mi);
    }
    render(t, e, i, s, n, r) {
        let l = t.container;
        let a;
        switch (typeof i.res) {
          case "string":
            a = fe.find(l, i.res);
            if (a == null) {
                throw createMappedError(754, i, t);
            }
            break;

          default:
            a = i.res;
        }
        const h = this.r.getViewFactory(i.def, a.containerStrategy === "new" ? l.createChild({
            inheritParentResources: true
        }) : l);
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

fi = __decorate([ renderer($e) ], fi);

let di = class LetElementRenderer {
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
            f = ensureExpression(n, u.from, Ct);
            t.addBinding(new LetBinding(h, r, f, u.to, a));
            ++d;
        }
    }
};

di = __decorate([ renderer(Ne) ], di);

let mi = class RefBindingRenderer {
    render(t, e, i, s, n) {
        t.addBinding(new RefBinding(t.container, ensureExpression(n, i.from, Ct), getRefTarget(e, i.to)));
    }
};

mi = __decorate([ renderer(Ge) ], mi);

let gi = class InterpolationBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new InterpolationBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, yt), getTarget(e), i.to, Et));
    }
};

gi = __decorate([ renderer(je) ], gi);

let pi = class PropertyBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, Ct), getTarget(e), i.to, i.mode));
    }
};

pi = __decorate([ renderer(ze) ], pi);

let vi = class IteratorBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.forOf, bt), getTarget(e), i.to, Et));
    }
};

vi = __decorate([ renderer(Ke) ], vi);

let xi = class TextBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, s.domWriteQueue, s, ensureExpression(n, i.from, Ct), e));
    }
};

xi = __decorate([ renderer(Qe) ], xi);

const wi = zt("IListenerBindingOptions", (t => t.instance({
    prevent: false
})));

let yi = class ListenerBindingRenderer {
    constructor() {
        this.tt = f(Ie);
        this.et = f(wi);
    }
    render(t, e, i, s, n) {
        t.addBinding(new ListenerBinding(t.container, ensureExpression(n, i.from, kt), e, i.to, new ListenerBindingOptions(this.et.prevent, i.capture), this.tt.getHandler(i.to, i.modifier)));
    }
};

yi = __decorate([ renderer(Ye) ], yi);

let bi = class SetAttributeRenderer {
    render(t, e, i) {
        e.setAttribute(i.to, i.value);
    }
};

bi = __decorate([ renderer(ti) ], bi);

let ki = class SetClassAttributeRenderer {
    render(t, e, i) {
        addClasses(e.classList, i.value);
    }
};

ki = __decorate([ renderer(ei) ], ki);

let Ci = class SetStyleAttributeRenderer {
    render(t, e, i) {
        e.style.cssText += i.value;
    }
};

Ci = __decorate([ renderer(ii) ], Ci);

let Ai = class StylePropertyBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, Ct), e.style, i.to, Et));
    }
};

Ai = __decorate([ renderer(Je) ], Ai);

let Bi = class AttributeBindingRenderer {
    render(t, e, i, s, n, r) {
        const l = t.container;
        const a = l.has(xs, false) ? l.get(xs) : null;
        t.addBinding(new AttributeBinding(t, l, r, s.domWriteQueue, ensureExpression(n, i.from, Ct), e, i.attr, a == null ? i.to : i.to.split(/\s/g).map((t => a[t] ?? t)).join(" "), Et));
    }
};

Bi = __decorate([ renderer(Ze) ], Bi);

let Si = class SpreadRenderer {
    constructor() {
        this.it = f(li);
        this.r = f(Mi);
    }
    render(t, e, i, s, n, r) {
        SpreadBinding.create(t.container.get(us), e, void 0, this.r, this.it, s, n, r).forEach((e => t.addBinding(e)));
    }
};

Si = __decorate([ renderer(si) ], Si);

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

const Ti = "IController";

const Ri = "IInstruction";

const Ii = "IRenderLocation";

const Ei = "ISlotsInfo";

function createElementContainer(t, e, i, s, n, r) {
    const l = e.container.createChild();
    registerHostNode(l, t, i);
    registerResolver(l, cs, new v(Ti, e));
    registerResolver(l, oi, new v(Ri, s));
    registerResolver(l, vs, n == null ? _i : new RenderLocationProvider(n));
    registerResolver(l, _e, Pi);
    registerResolver(l, qe, r == null ? Li : new v(Ei, r));
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
    registerResolver(c, cs, new v(Ti, h));
    registerResolver(c, oi, new v(Ri, n));
    registerResolver(c, vs, l == null ? _i : new v(Ii, l));
    registerResolver(c, _e, r == null ? Pi : new ViewFactoryProvider(r));
    registerResolver(c, qe, a == null ? Li : new v(Ei, a));
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

const _i = new RenderLocationProvider(null);

const Pi = new ViewFactoryProvider(null);

const Li = new v(Ei, new AuSlotsInfo(m));

const Mi = /*@__PURE__*/ zt("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.st ??= this.nt.getAll(ai, false).reduce(((t, e) => {
            t[e.target] = e;
            return t;
        }), createLookup());
    }
    constructor() {
        this.rt = new WeakMap;
        this.ot = new WeakMap;
        const t = this.nt = f(x).root;
        this.p = t.get(ae);
        this.ep = t.get(j);
        this.oL = t.get(z);
        this.lt = new FragmentNodeSequence(this.p, this.p.document.createDocumentFragment());
    }
    compile(t, e, i) {
        if (t.needsCompile !== false) {
            const s = this.rt;
            const n = e.get(li);
            let r = s.get(t);
            if (r == null) {
                s.set(t, r = n.compile(CustomElementDefinition.getOrCreate(t), e, i));
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
            return new FragmentNodeSequence(this.p, this.ht(t.template));
        }
        let e;
        let i = false;
        const s = this.ot;
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
            this.ht(e);
            s.set(t, e);
        }
        return e == null ? this.lt : new FragmentNodeSequence(this.p, i ? r.importNode(e, true) : r.adoptNode(e.cloneNode(true)));
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
    ct() {
        return this.p.document.createElement("au-m");
    }
    ht(t) {
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
                e.insertBefore(this.ct(), s);
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
                addListener(this.ut, e, this);
            }
            this.ft = true;
            this.dt?.();
        }
    }));
    defineHiddenProp(i, "unsubscribe", (function(t) {
        if (this.subs.remove(t) && this.subs.count === 0) {
            for (e of this.cf.events) {
                removeListener(this.ut, e, this);
            }
            this.ft = false;
            this.gt?.();
        }
    }));
    defineHiddenProp(i, "useConfig", (function(t) {
        this.cf = t;
        if (this.ft) {
            for (e of this.cf.events) {
                removeListener(this.ut, e, this);
            }
            for (e of this.cf.events) {
                addListener(this.ut, e, this);
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
        this.type = Tt | Rt;
        this.v = "";
        this.vt = {};
        this.xt = 0;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (t !== this.v) {
            this.v = t;
            this.wt();
        }
    }
    wt() {
        const t = this.vt;
        const e = ++this.xt;
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
                t[l] = this.xt;
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
        return m;
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
            return m;
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
        return m;
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
        const e = mt({}, ...this.modules);
        const i = defineAttribute({
            name: "class",
            bindables: [ "value" ],
            noMultiBindings: true
        }, class CustomAttributeClass {
            constructor() {
                this.yt = new ClassAttributeAccessor(f(gs));
                this.value = "";
            }
            binding() {
                this.valueChanged();
            }
            valueChanged() {
                this.yt.setValue(this.value?.split(/\s+/g).map((t => e[t] || t)) ?? "");
            }
        });
        t.register(i, Kt(xs, e));
    }
}

function shadowCSS(...t) {
    return new ShadowDOMRegistry(t);
}

const Di = /*@__PURE__*/ zt("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
    if (AdoptedStyleSheetsStyles.supported(t.get(ae))) {
        return t.get(AdoptedStyleSheetsStylesFactory);
    }
    return t.get(StyleElementStylesFactory);
}))));

class ShadowDOMRegistry {
    constructor(t) {
        this.css = t;
    }
    register(t) {
        const e = t.get(Fi);
        const i = t.get(Di);
        t.register(Kt(qi, i.createStyles(this.css, e)));
    }
}

class AdoptedStyleSheetsStylesFactory {
    constructor() {
        this.p = f(ae);
        this.cache = new Map;
    }
    createStyles(t, e) {
        return new AdoptedStyleSheetsStyles(this.p, t, this.cache, e);
    }
}

class StyleElementStylesFactory {
    constructor() {
        this.p = f(ae);
    }
    createStyles(t, e) {
        return new StyleElementStyles(this.p, t, e);
    }
}

const qi = /*@__PURE__*/ zt("IShadowDOMStyles");

const Fi = /*@__PURE__*/ zt("IShadowDOMGlobalStyles", (t => t.instance({
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

const Hi = {
    shadowDOM(t) {
        return le.creating(x, (e => {
            if (t.sharedStyles != null) {
                const i = e.get(Di);
                e.register(Kt(Fi, i.createStyles(t.sharedStyles, null)));
            }
        }));
    }
};

const {enter: Oi, exit: Vi} = U;

const {wrap: $i, unwrap: Ni} = G;

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
        if (!xt(i, e)) {
            this.cb.call(t, i, e, t);
        }
    }
    compute() {
        this.running = true;
        this.obs.version++;
        try {
            Oi(this);
            return this.v = Ni(this.$get.call(void 0, this.useProxy ? $i(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            Vi(this);
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
        this.bt = s;
        this.cb = n;
    }
    handleChange(t) {
        const e = this.bt;
        const i = this.obj;
        const s = this.v;
        const n = e.$kind === "AccessScope" && this.obs.count === 1;
        if (!n) {
            this.obs.version++;
            t = H(e, this.scope, this, this);
            this.obs.clear();
        }
        if (!xt(t, s)) {
            this.v = t;
            this.cb.call(i, t, s, i);
        }
    }
    bind() {
        if (this.isBound) {
            return;
        }
        this.obs.version++;
        this.v = H(this.bt, this.scope, this, this);
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

O(ComputedWatcher);

O(ExpressionWatcher);

mixinAstEvaluator(true)(ExpressionWatcher);

class Controller {
    get lifecycleHooks() {
        return this.kt;
    }
    get isActive() {
        return (this.state & (ss | ns)) > 0 && (this.state & rs) === 0;
    }
    get name() {
        if (this.parent === null) {
            switch (this.vmKind) {
              case ts:
                return `[${this.definition.name}]`;

              case Ji:
                return this.definition.name;

              case es:
                return this.viewFactory.name;
            }
        }
        switch (this.vmKind) {
          case ts:
            return `${this.parent.name}>[${this.definition.name}]`;

          case Ji:
            return `${this.parent.name}>${this.definition.name}`;

          case es:
            return this.viewFactory.name === this.parent.definition?.name ? `${this.parent.name}[view]` : `${this.parent.name}[view:${this.viewFactory.name}]`;
        }
    }
    get viewModel() {
        return this.Ct;
    }
    set viewModel(t) {
        this.Ct = t;
        this.At = t == null || this.vmKind === es ? HooksDefinition.none : new HooksDefinition(t);
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
        this.Bt = false;
        this.hostController = null;
        this.mountTarget = ji;
        this.shadowRoot = null;
        this.nodes = null;
        this.location = null;
        this.kt = null;
        this.state = is;
        this.St = false;
        this.$initiator = null;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this.Tt = 0;
        this.Rt = 0;
        this.It = 0;
        this.Ct = n;
        this.At = e === es ? HooksDefinition.none : new HooksDefinition(n);
        this.location = l;
        this.r = t.root.get(Mi);
        this.coercion = e === es ? void 0 : t.get(Qi);
    }
    static getCached(t) {
        return Wi.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (e === void 0) {
            throw createMappedError(500, t);
        }
        return e;
    }
    static $el(t, e, i, s, n = void 0, r = null) {
        if (Wi.has(e)) {
            return Wi.get(e);
        }
        {
            n = n ?? getElementDefinition(e.constructor);
        }
        registerResolver(t, n.Type, new v(n.key, e, n.Type));
        const l = new Controller(t, Ji, n, null, e, i, r);
        const a = t.get(y(us));
        if (n.dependencies.length > 0) {
            t.register(...n.dependencies);
        }
        registerResolver(t, us, new v("IHydrationContext", new HydrationContext(l, s, a)));
        Wi.set(e, l);
        if (s == null || s.hydrate !== false) {
            l.hE(s, a);
        }
        return l;
    }
    static $attr(t, e, i, s) {
        if (Wi.has(e)) {
            return Wi.get(e);
        }
        s = s ?? getAttributeDefinition(e.constructor);
        registerResolver(t, s.Type, new v(s.key, e, s.Type));
        const n = new Controller(t, ts, s, null, e, i, null);
        if (s.dependencies.length > 0) {
            t.register(...s.dependencies);
        }
        Wi.set(e, n);
        n.Et();
        return n;
    }
    static $view(t, e = void 0) {
        const i = new Controller(t.container, es, null, t, null, null, null);
        i.parent = e ?? null;
        i._t();
        return i;
    }
    hE(t, e) {
        const i = this.container;
        const s = this.Ct;
        const n = this.definition;
        this.scope = X.create(s, null, true);
        if (n.watches.length > 0) {
            createWatchers(this, i, n, s);
        }
        createObservers(this, n, s);
        this.kt = me.resolve(i);
        i.register(n.Type);
        if (n.injectable !== null) {
            registerResolver(i, n.injectable, new v("definition.injectable", s));
        }
        if (t == null || t.hydrate !== false) {
            this.hS(t);
            this.hC();
        }
    }
    hS(t) {
        if (this.kt.hydrating != null) {
            this.kt.hydrating.forEach(callHydratingHook, this);
        }
        if (this.At.Pt) {
            this.Ct.hydrating(this);
        }
        const e = this.definition;
        const i = this.Lt = this.r.compile(e, this.container, t);
        const s = i.shadowOptions;
        const n = i.hasSlots;
        const r = i.containerless;
        let l = this.host;
        let a = this.location;
        if ((this.hostController = findElementControllerFor(l, Xi)) !== null) {
            l = this.host = this.container.root.get(ae).document.createElement(e.name);
            if (r && a == null) {
                a = this.location = convertToRenderLocation(l);
            }
        }
        setRef(l, Ss, this);
        setRef(l, e.key, this);
        if (s !== null || n) {
            if (a != null) {
                throw createMappedError(501);
            }
            setRef(this.shadowRoot = l.attachShadow(s ?? Zi), Ss, this);
            setRef(this.shadowRoot, e.key, this);
            this.mountTarget = Ui;
        } else if (a != null) {
            setRef(a, Ss, this);
            setRef(a, e.key, this);
            this.mountTarget = Gi;
        } else {
            this.mountTarget = zi;
        }
        this.Ct.$controller = this;
        this.nodes = this.r.createNodes(i);
        if (this.kt.hydrated !== void 0) {
            this.kt.hydrated.forEach(callHydratedHook, this);
        }
        if (this.At.Mt) {
            this.Ct.hydrated(this);
        }
    }
    hC() {
        this.r.render(this, this.nodes.findTargets(), this.Lt, this.host);
        if (this.kt.created !== void 0) {
            this.kt.created.forEach(callCreatedHook, this);
        }
        if (this.At.Dt) {
            this.Ct.created(this);
        }
    }
    Et() {
        const t = this.definition;
        const e = this.Ct;
        if (t.watches.length > 0) {
            createWatchers(this, this.container, t, e);
        }
        createObservers(this, t, e);
        e.$controller = this;
        this.kt = me.resolve(this.container);
        if (this.kt.created !== void 0) {
            this.kt.created.forEach(callCreatedHook, this);
        }
        if (this.At.Dt) {
            this.Ct.created(this);
        }
    }
    _t() {
        this.Lt = this.r.compile(this.viewFactory.def, this.container, null);
        this.r.render(this, (this.nodes = this.r.createNodes(this.Lt)).findTargets(), this.Lt, void 0);
    }
    activate(t, e, i) {
        switch (this.state) {
          case is:
          case os:
            if (!(e === null || e.isActive)) {
                return;
            }
            this.state = ss;
            break;

          case ns:
            return;

          case as:
            throw createMappedError(502, this.name);

          default:
            throw createMappedError(503, this.name, stringifyState(this.state));
        }
        this.parent = e;
        switch (this.vmKind) {
          case Ji:
            this.scope.parent = i ?? null;
            break;

          case ts:
            this.scope = i ?? null;
            break;

          case es:
            if (i === void 0 || i === null) {
                throw createMappedError(504, this.name);
            }
            if (!this.hasLockedScope) {
                this.scope = i;
            }
            break;
        }
        this.$initiator = t;
        this.qt();
        let s = void 0;
        if (this.vmKind !== es && this.kt.binding != null) {
            s = b(...this.kt.binding.map(callBindingHook, this));
        }
        if (this.At.Ft) {
            s = b(s, this.Ct.binding(this.$initiator, this.parent));
        }
        if (isPromise(s)) {
            this.Ht();
            s.then((() => {
                this.Bt = true;
                if (this.state !== ss) {
                    this.Ot();
                } else {
                    this.bind();
                }
            })).catch((t => {
                this.Vt(t);
            }));
            return this.$promise;
        }
        this.Bt = true;
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
        if (this.vmKind !== es && this.kt.bound != null) {
            i = b(...this.kt.bound.map(callBoundHook, this));
        }
        if (this.At.$t) {
            i = b(i, this.Ct.bound(this.$initiator, this.parent));
        }
        if (isPromise(i)) {
            this.Ht();
            i.then((() => {
                this.isBound = true;
                if (this.state !== ss) {
                    this.Ot();
                } else {
                    this.Nt();
                }
            })).catch((t => {
                this.Vt(t);
            }));
            return;
        }
        this.isBound = true;
        this.Nt();
    }
    Wt(...t) {
        switch (this.mountTarget) {
          case zi:
            this.host.append(...t);
            break;

          case Ui:
            this.shadowRoot.append(...t);
            break;

          case Gi:
            {
                let e = 0;
                for (;e < t.length; ++e) {
                    this.location.parentNode.insertBefore(t[e], this.location);
                }
                break;
            }
        }
    }
    Nt() {
        if (this.hostController !== null) {
            switch (this.mountTarget) {
              case zi:
              case Ui:
                this.hostController.Wt(this.host);
                break;

              case Gi:
                this.hostController.Wt(this.location.$start, this.location);
                break;
            }
        }
        switch (this.mountTarget) {
          case zi:
            this.nodes.appendTo(this.host, this.definition != null && this.definition.enhance);
            break;

          case Ui:
            {
                const t = this.container;
                const e = t.has(qi, false) ? t.get(qi) : t.get(Fi);
                e.applyTo(this.shadowRoot);
                this.nodes.appendTo(this.shadowRoot);
                break;
            }

          case Gi:
            this.nodes.insertBefore(this.location);
            break;
        }
        let t = 0;
        let e = void 0;
        if (this.vmKind !== es && this.kt.attaching != null) {
            e = b(...this.kt.attaching.map(callAttachingHook, this));
        }
        if (this.At.jt) {
            e = b(e, this.Ct.attaching(this.$initiator, this.parent));
        }
        if (isPromise(e)) {
            this.Ht();
            this.qt();
            e.then((() => {
                this.Ot();
            })).catch((t => {
                this.Vt(t);
            }));
        }
        if (this.children !== null) {
            for (;t < this.children.length; ++t) {
                void this.children[t].activate(this.$initiator, this, this.scope);
            }
        }
        this.Ot();
    }
    deactivate(t, e) {
        let i = void 0;
        switch (this.state & ~ls) {
          case ns:
            this.state = rs;
            break;

          case ss:
            this.state = rs;
            i = this.$promise?.catch(s);
            break;

          case is:
          case os:
          case as:
          case os | as:
            return;

          default:
            throw createMappedError(505, this.name, this.state);
        }
        this.$initiator = t;
        if (t === this) {
            this.zt();
        }
        let n = 0;
        let r;
        if (this.children !== null) {
            for (n = 0; n < this.children.length; ++n) {
                void this.children[n].deactivate(t, this);
            }
        }
        return k(i, (() => {
            if (this.isBound) {
                if (this.vmKind !== es && this.kt.detaching != null) {
                    r = b(...this.kt.detaching.map(callDetachingHook, this));
                }
                if (this.At.Ut) {
                    r = b(r, this.Ct.detaching(this.$initiator, this.parent));
                }
            }
            if (isPromise(r)) {
                this.Ht();
                t.zt();
                r.then((() => {
                    t.Gt();
                })).catch((e => {
                    t.Vt(e);
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
            this.Gt();
            return this.$promise;
        }));
    }
    removeNodes() {
        switch (this.vmKind) {
          case Ji:
          case es:
            this.nodes.remove();
            this.nodes.unlink();
        }
        if (this.hostController !== null) {
            switch (this.mountTarget) {
              case zi:
              case Ui:
                this.host.remove();
                break;

              case Gi:
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
          case ts:
            this.scope = null;
            break;

          case es:
            if (!this.hasLockedScope) {
                this.scope = null;
            }
            if ((this.state & ls) === ls && !this.viewFactory.tryReturnToCache(this) && this.$initiator === this) {
                this.dispose();
            }
            break;

          case Ji:
            this.scope.parent = null;
            break;
        }
        this.state = os;
        this.$initiator = null;
        this.Kt();
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
    Kt() {
        if (this.$promise !== void 0) {
            fs = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            fs();
            fs = void 0;
        }
    }
    Vt(t) {
        if (this.$promise !== void 0) {
            ds = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            ds(t);
            ds = void 0;
        }
        if (this.$initiator !== this) {
            this.parent.Vt(t);
        }
    }
    qt() {
        ++this.Tt;
        if (this.$initiator !== this) {
            this.parent.qt();
        }
    }
    Ot() {
        if (this.state !== ss) {
            --this.Tt;
            this.Kt();
            if (this.$initiator !== this) {
                this.parent.Ot();
            }
            return;
        }
        if (--this.Tt === 0) {
            if (this.vmKind !== es && this.kt.attached != null) {
                ms = b(...this.kt.attached.map(callAttachedHook, this));
            }
            if (this.At.Xt) {
                ms = b(ms, this.Ct.attached(this.$initiator));
            }
            if (isPromise(ms)) {
                this.Ht();
                ms.then((() => {
                    this.state = ns;
                    this.Kt();
                    if (this.$initiator !== this) {
                        this.parent.Ot();
                    }
                })).catch((t => {
                    this.Vt(t);
                }));
                ms = void 0;
                return;
            }
            ms = void 0;
            this.state = ns;
            this.Kt();
        }
        if (this.$initiator !== this) {
            this.parent.Ot();
        }
    }
    zt() {
        ++this.Rt;
    }
    Gt() {
        if (--this.Rt === 0) {
            this.Qt();
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
                if (t.Bt) {
                    if (t.vmKind !== es && t.kt.unbinding != null) {
                        e = b(...t.kt.unbinding.map(callUnbindingHook, t));
                    }
                    if (t.At.Yt) {
                        if (t.debug) {
                            t.logger.trace("unbinding()");
                        }
                        e = b(e, t.viewModel.unbinding(t.$initiator, t.parent));
                    }
                }
                if (isPromise(e)) {
                    this.Ht();
                    this.Qt();
                    e.then((() => {
                        this.Zt();
                    })).catch((t => {
                        this.Vt(t);
                    }));
                }
                e = void 0;
                t = t.next;
            }
            this.Zt();
        }
    }
    Qt() {
        ++this.It;
    }
    Zt() {
        if (--this.It === 0) {
            let t = this.$initiator.head;
            let e = null;
            while (t !== null) {
                if (t !== this) {
                    t.Bt = false;
                    t.isBound = false;
                    t.unbind();
                }
                e = t.next;
                t.next = null;
                t = e;
            }
            this.head = this.tail = null;
            this.Bt = false;
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
          case ts:
          case Ji:
            {
                return this.definition.name === t;
            }

          case es:
            return this.viewFactory.name === t;
        }
    }
    lockScope(t) {
        this.scope = t;
        this.hasLockedScope = true;
    }
    setHost(t) {
        if (this.vmKind === Ji) {
            setRef(t, Ss, this);
            setRef(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = zi;
        return this;
    }
    setShadowRoot(t) {
        if (this.vmKind === Ji) {
            setRef(t, Ss, this);
            setRef(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = Ui;
        return this;
    }
    setLocation(t) {
        if (this.vmKind === Ji) {
            setRef(t, Ss, this);
            setRef(t, this.definition.key, this);
        }
        this.location = t;
        this.mountTarget = Gi;
        return this;
    }
    release() {
        this.state |= ls;
    }
    dispose() {
        if ((this.state & as) === as) {
            return;
        }
        this.state |= as;
        if (this.At.Jt) {
            this.Ct.dispose();
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
        if (this.Ct !== null) {
            Wi.delete(this.Ct);
            this.Ct = null;
        }
        this.Ct = null;
        this.host = null;
        this.shadowRoot = null;
        this.container.disposeResolvers();
    }
    accept(t) {
        if (t(this) === true) {
            return true;
        }
        if (this.At.te && this.Ct.accept(t) === true) {
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

const Wi = new WeakMap;

const ji = 0;

const zi = 1;

const Ui = 2;

const Gi = 3;

const Ki = dt({
    none: ji,
    host: zi,
    shadowRoot: Ui,
    location: Gi
});

const Xi = {
    optional: true
};

const Qi = w(K);

function createObservers(t, e, i) {
    const n = e.bindables;
    const r = gt(n);
    const l = r.length;
    const a = t.container.get(z);
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

const Yi = new Map;

const getAccessScopeAst = t => {
    let e = Yi.get(t);
    if (e == null) {
        e = new Q(t, 0);
        Yi.set(t, e);
    }
    return e;
};

function createWatchers(t, e, i, s) {
    const n = e.get(z);
    const r = e.get(j);
    const l = i.watches;
    const a = t.vmKind === Ji ? t.scope : X.create(s, null, true);
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
            f = isString(c) ? r.parse(c, Ct) : getAccessScopeAst(c);
            t.addBinding(new ExpressionWatcher(a, e, n, f, u));
        }
    }
}

function isCustomElementController(t) {
    return t instanceof Controller && t.vmKind === Ji;
}

function isCustomElementViewModel(t) {
    return D(t) && isElementType(t.constructor);
}

class HooksDefinition {
    constructor(t) {
        this.ee = "define" in t;
        this.Pt = "hydrating" in t;
        this.Mt = "hydrated" in t;
        this.Dt = "created" in t;
        this.Ft = "binding" in t;
        this.$t = "bound" in t;
        this.jt = "attaching" in t;
        this.Xt = "attached" in t;
        this.Ut = "detaching" in t;
        this.Yt = "unbinding" in t;
        this.Jt = "dispose" in t;
        this.te = "accept" in t;
    }
}

HooksDefinition.none = new HooksDefinition({});

const Zi = {
    mode: "open"
};

const Ji = "customElement";

const ts = "customAttribute";

const es = "synthetic";

const is = 0;

const ss = 1;

const ns = 2;

const rs = 4;

const os = 8;

const ls = 16;

const as = 32;

const hs = /*@__PURE__*/ dt({
    none: is,
    activating: ss,
    activated: ns,
    deactivating: rs,
    deactivated: os,
    released: ls,
    disposed: as
});

function stringifyState(t) {
    const e = [];
    if ((t & ss) === ss) {
        e.push("activating");
    }
    if ((t & ns) === ns) {
        e.push("activated");
    }
    if ((t & rs) === rs) {
        e.push("deactivating");
    }
    if ((t & os) === os) {
        e.push("deactivated");
    }
    if ((t & ls) === ls) {
        e.push("released");
    }
    if ((t & as) === as) {
        e.push("disposed");
    }
    return e.length === 0 ? "none" : e.join("|");
}

const cs = /*@__PURE__*/ zt("IController");

const us = /*@__PURE__*/ zt("IHydrationContext");

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
    t.instance.created(this.Ct, this);
}

function callHydratingHook(t) {
    t.instance.hydrating(this.Ct, this);
}

function callHydratedHook(t) {
    t.instance.hydrated(this.Ct, this);
}

function callBindingHook(t) {
    return t.instance.binding(this.Ct, this["$initiator"], this.parent);
}

function callBoundHook(t) {
    return t.instance.bound(this.Ct, this["$initiator"], this.parent);
}

function callAttachingHook(t) {
    return t.instance.attaching(this.Ct, this["$initiator"], this.parent);
}

function callAttachedHook(t) {
    return t.instance.attached(this.Ct, this["$initiator"]);
}

function callDetachingHook(t) {
    return t.instance.detaching(this.Ct, this["$initiator"], this.parent);
}

function callUnbindingHook(t) {
    return t.instance.unbinding(this.Ct, this["$initiator"], this.parent);
}

let fs;

let ds;

let ms;

class Refs {}

function getRef(t, e) {
    return t.$au?.[e] ?? null;
}

function setRef(t, e, i) {
    (t.$au ??= new Refs)[e] = i;
}

const gs = /*@__PURE__*/ zt("INode");

const ps = /*@__PURE__*/ zt("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(_s, true)) {
        return t.get(_s).host;
    }
    return t.get(ae).document;
}))));

const vs = /*@__PURE__*/ zt("IRenderLocation");

const xs = /*@__PURE__*/ zt("CssModules");

const ws = new WeakMap;

function getEffectiveParentNode(t) {
    if (ws.has(t)) {
        return ws.get(t);
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
        const e = findElementControllerFor(t, {
            optional: true
        });
        if (e == null) {
            return null;
        }
        if (e.mountTarget === Ki.shadowRoot) {
            return getEffectiveParentNode(e.host);
        }
    }
    return t.parentNode;
}

function setEffectiveParentNode(t, e) {
    if (t.platform !== void 0 && !(t instanceof t.platform.Node)) {
        const i = t.childNodes;
        for (let t = 0, s = i.length; t < s; ++t) {
            ws.set(i[t], e);
        }
    } else {
        ws.set(t, e);
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
        return this.ie;
    }
    get lastChild() {
        return this.se;
    }
    constructor(t, e) {
        this.platform = t;
        this.next = void 0;
        this.ne = false;
        this.re = false;
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
        this.ie = e.firstChild;
        this.se = e.lastChild;
    }
    findTargets() {
        return this.t;
    }
    insertBefore(t) {
        if (this.re && !!this.ref) {
            this.addToLinked();
        } else {
            const e = t.parentNode;
            if (this.ne) {
                let i = this.ie;
                let s;
                const n = this.se;
                while (i != null) {
                    s = i.nextSibling;
                    e.insertBefore(i, t);
                    if (i === n) {
                        break;
                    }
                    i = s;
                }
            } else {
                this.ne = true;
                t.parentNode.insertBefore(this.f, t);
            }
        }
    }
    appendTo(t, e = false) {
        if (this.ne) {
            let e = this.ie;
            let i;
            const s = this.se;
            while (e != null) {
                i = e.nextSibling;
                t.appendChild(e);
                if (e === s) {
                    break;
                }
                e = i;
            }
        } else {
            this.ne = true;
            if (!e) {
                t.appendChild(this.f);
            }
        }
    }
    remove() {
        if (this.ne) {
            this.ne = false;
            const t = this.f;
            const e = this.se;
            let i;
            let s = this.ie;
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
        if (this.ne) {
            let i = this.ie;
            let s;
            const n = this.se;
            while (i != null) {
                s = i.nextSibling;
                e.insertBefore(i, t);
                if (i === n) {
                    break;
                }
                i = s;
            }
        } else {
            this.ne = true;
            e.insertBefore(this.f, t);
        }
    }
    unlink() {
        this.re = false;
        this.next = void 0;
        this.ref = void 0;
    }
    link(t) {
        this.re = true;
        if (isRenderLocation(t)) {
            this.ref = t;
        } else {
            this.next = t;
            this.oe();
        }
    }
    oe() {
        if (this.next !== void 0) {
            this.ref = this.next.firstChild;
        } else {
            this.ref = void 0;
        }
    }
}

const ys = /*@__PURE__*/ zt("IWindow", (t => t.callback((t => t.get(ae).window))));

const bs = /*@__PURE__*/ zt("ILocation", (t => t.callback((t => t.get(ys).location))));

const ks = /*@__PURE__*/ zt("IHistory", (t => t.callback((t => t.get(ys).history))));

const registerHostNode = (t, e, i) => {
    registerResolver(t, e.HTMLElement, registerResolver(t, e.Element, registerResolver(t, gs, new v("ElementResolver", i))));
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
    const e = Dt(Ss, t);
    if (e === void 0) {
        annotateElementMetadata(t, "containerless", true);
        return;
    }
    e.containerless = true;
}

const Cs = new WeakMap;

class CustomElementDefinition {
    get kind() {
        return Xt;
    }
    constructor(t, e, i, s, n, r, l, a, h, c, u, f, d, m, g, p, v, x, w) {
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
        this.watches = x;
        this.processContent = w;
    }
    static create(t, e = null) {
        if (e === null) {
            const i = t;
            if (isString(i)) {
                throw createMappedError(761, t);
            }
            const s = C("name", i, Ts);
            if (isFunction(i.Type)) {
                e = i.Type;
            } else {
                e = Rs(A(s));
            }
            return new CustomElementDefinition(e, s, a(i.aliases), C("key", i, (() => getElementKeyFrom(s))), C("cache", i, returnZero), C("capture", i, returnFalse), C("template", i, returnNull), a(i.instructions), a(i.dependencies), C("injectable", i, returnNull), C("needsCompile", i, returnTrue), a(i.surrogates), Wt.from(e, i.bindables), C("containerless", i, returnFalse), C("shadowOptions", i, returnNull), C("hasSlots", i, returnFalse), C("enhance", i, returnFalse), C("watches", i, returnEmptyArray), B("processContent", e, returnNull));
        }
        if (isString(t)) {
            return new CustomElementDefinition(e, t, a(getElementAnnotation(e, "aliases"), e.aliases), getElementKeyFrom(t), B("cache", e, returnZero), B("capture", e, returnFalse), B("template", e, returnNull), a(getElementAnnotation(e, "instructions"), e.instructions), a(getElementAnnotation(e, "dependencies"), e.dependencies), B("injectable", e, returnNull), B("needsCompile", e, returnTrue), a(getElementAnnotation(e, "surrogates"), e.surrogates), Wt.from(e, ...Wt.getAll(e), getElementAnnotation(e, "bindables"), e.bindables), B("containerless", e, returnFalse), B("shadowOptions", e, returnNull), B("hasSlots", e, returnFalse), B("enhance", e, returnFalse), a(he.getDefinitions(e), e.watches), B("processContent", e, returnNull));
        }
        const i = C("name", t, Ts);
        return new CustomElementDefinition(e, i, a(getElementAnnotation(e, "aliases"), t.aliases, e.aliases), getElementKeyFrom(i), S("cache", t, e, returnZero), S("capture", t, e, returnFalse), S("template", t, e, returnNull), a(getElementAnnotation(e, "instructions"), t.instructions, e.instructions), a(getElementAnnotation(e, "dependencies"), t.dependencies, e.dependencies), S("injectable", t, e, returnNull), S("needsCompile", t, e, returnTrue), a(getElementAnnotation(e, "surrogates"), t.surrogates, e.surrogates), Wt.from(e, ...Wt.getAll(e), getElementAnnotation(e, "bindables"), e.bindables, t.bindables), S("containerless", t, e, returnFalse), S("shadowOptions", t, e, returnNull), S("hasSlots", t, e, returnFalse), S("enhance", t, e, returnFalse), a(t.watches, he.getDefinitions(e), e.watches), S("processContent", t, e, returnNull));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) {
            return t;
        }
        if (Cs.has(t)) {
            return Cs.get(t);
        }
        const e = CustomElementDefinition.create(t);
        Cs.set(t, e);
        Ft(Ss, e, e.Type);
        return e;
    }
    register(t, e) {
        const i = this.Type;
        const s = typeof e === "string" ? getElementKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(s, false)) {
            t.register(t.has(i, false) ? null : Ut(i, i), Gt(i, s), ...n.map((t => Gt(i, getElementKeyFrom(t)))));
        }
    }
    toString() {
        return `au:ce:${this.name}`;
    }
}

const As = {
    name: undefined,
    searchParents: false,
    optional: false
};

const returnZero = () => 0;

const returnNull = () => null;

const returnFalse = () => false;

const returnTrue = () => true;

const returnEmptyArray = () => m;

const Bs = "custom-element";

const Ss = /*@__PURE__*/ u(Bs);

const getElementKeyFrom = t => `${Ss}:${t}`;

const Ts = /*@__PURE__*/ (t => () => `unnamed-${++t}`)(0);

const annotateElementMetadata = (t, e, i) => {
    Ft(Ot(e), i, t);
};

const defineElement = (t, e) => {
    const i = CustomElementDefinition.create(t, e);
    const s = i.Type;
    Ft(Ss, i, s);
    Ft(h, i, s);
    return s;
};

const isElementType = t => isFunction(t) && (qt(Ss, t) || t.$au?.type === Bs);

const findElementControllerFor = (t, e = As) => {
    if (e.name === void 0 && e.searchParents !== true) {
        const i = getRef(t, Ss);
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
            const i = getRef(t, Ss);
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
            const t = getRef(i, Ss);
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
        const t = getRef(i, Ss);
        if (t !== null) {
            return t;
        }
        i = getEffectiveParentNode(i);
    }
    throw createMappedError(765, t);
};

const getElementAnnotation = (t, e) => Dt(Ot(e), t);

const getElementDefinition = t => {
    const e = Dt(Ss, t) ?? getDefinitionFromStaticAu(t, Bs, CustomElementDefinition.create);
    if (e == null) {
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

const Rs = /*@__PURE__*/ function() {
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
        wt(n, "name", t);
        if (s !== e) {
            mt(n.prototype, s);
        }
        return n;
    };
}();

const Is = dt({
    name: Ss,
    keyFrom: getElementKeyFrom,
    isType: isElementType,
    for: findElementControllerFor,
    define: defineElement,
    getDefinition: getElementDefinition,
    annotate: annotateElementMetadata,
    getAnnotation: getElementAnnotation,
    generateName: Ts,
    createInjectable: createElementInjectable,
    generateType: Rs,
    find(t, e) {
        const i = t.find(Bs, e);
        return i == null ? null : Dt(Ss, i) ?? getDefinitionFromStaticAu(i, Bs, CustomElementDefinition.create) ?? null;
    }
});

const Es = /*@__PURE__*/ Ot("processContent");

function processContent(t) {
    return t === void 0 ? function(t, e, i) {
        Ft(Es, ensureHook(t, e), t);
    } : function(e) {
        t = ensureHook(e, t);
        const i = Dt(Ss, e);
        if (i !== void 0) {
            i.processContent = t;
        } else {
            Ft(Es, t, e);
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

const _s = /*@__PURE__*/ zt("IAppRoot");

class AppRoot {
    get controller() {
        return this._;
    }
    constructor(t, e, i, s = false) {
        this.config = t;
        this.container = e;
        this.le = void 0;
        this.ae = s;
        const n = this.host = t.host;
        i.prepare(this);
        registerHostNode(e, this.platform = this.he(e, n), n);
        this.le = k(this.ce("creating"), (() => {
            if (!t.allowActionlessForm !== false) {
                n.addEventListener("submit", (t => {
                    const e = t.target;
                    const i = (e.getAttribute("action")?.length ?? 0) > 0;
                    if (e.tagName === "FORM" && !i) {
                        t.preventDefault();
                    }
                }), false);
            }
            const i = s ? e : e.createChild();
            const r = t.component;
            let l;
            if (isFunction(r)) {
                l = i.invoke(r);
                Kt(r, l);
            } else {
                l = t.component;
            }
            const a = {
                hydrate: false,
                projections: null
            };
            const h = s ? CustomElementDefinition.create({
                name: Ts(),
                template: this.host,
                enhance: true
            }) : void 0;
            const c = this._ = Controller.$el(i, l, n, a, h);
            c.hE(a, null);
            return k(this.ce("hydrating"), (() => {
                c.hS(null);
                return k(this.ce("hydrated"), (() => {
                    c.hC();
                    this.le = void 0;
                }));
            }));
        }));
    }
    activate() {
        return k(this.le, (() => k(this.ce("activating"), (() => k(this._.activate(this._, null, void 0), (() => this.ce("activated")))))));
    }
    deactivate() {
        return k(this.ce("deactivating"), (() => k(this._.deactivate(this._, null), (() => this.ce("deactivated")))));
    }
    ce(t) {
        const e = this.container;
        const i = this.ae && !e.has(oe, false) ? [] : e.getAll(oe);
        return b(...i.reduce(((e, i) => {
            if (i.slot === t) {
                e.push(i.run());
            }
            return e;
        }), []));
    }
    he(t, e) {
        let i;
        if (!t.has(ae, false)) {
            if (e.ownerDocument.defaultView === null) {
                throw createMappedError(769);
            }
            i = new lt(e.ownerDocument.defaultView);
            t.register(Kt(ae, i));
        } else {
            i = t.get(ae);
        }
        return i;
    }
    dispose() {
        this._?.dispose();
    }
}

const Ps = /*@__PURE__*/ zt("IAurelia");

class Aurelia {
    get isRunning() {
        return this.ir;
    }
    get isStarting() {
        return this.ue;
    }
    get isStopping() {
        return this.fe;
    }
    get root() {
        if (this.de == null) {
            if (this.next == null) {
                throw createMappedError(767);
            }
            return this.next;
        }
        return this.de;
    }
    constructor(t = n.createContainer()) {
        this.container = t;
        this.ir = false;
        this.ue = false;
        this.fe = false;
        this.de = void 0;
        this.next = void 0;
        this.me = void 0;
        this.ge = void 0;
        if (t.has(Ps, true) || t.has(Aurelia, true)) {
            throw createMappedError(768);
        }
        registerResolver(t, Ps, new v("IAurelia", this));
        registerResolver(t, Aurelia, new v("Aurelia", this));
        registerResolver(t, _s, this.pe = new v("IAppRoot"));
    }
    register(...t) {
        this.container.register(...t);
        return this;
    }
    app(t) {
        this.next = new AppRoot(t, this.container, this.pe);
        return this;
    }
    enhance(t) {
        const e = new AppRoot({
            host: t.host,
            component: t.component
        }, t.container ?? this.container.createChild(), new v("IAppRoot"), true);
        return k(e.activate(), (() => e));
    }
    async waitForIdle() {
        const t = this.root.platform;
        await t.domWriteQueue.yield();
        await t.domReadQueue.yield();
        await t.taskQueue.yield();
    }
    start(t = this.next) {
        if (t == null) {
            throw createMappedError(770);
        }
        if (isPromise(this.me)) {
            return this.me;
        }
        return this.me = k(this.stop(), (() => {
            Reflect.set(t.host, "$aurelia", this);
            this.pe.prepare(this.de = t);
            this.ue = true;
            return k(t.activate(), (() => {
                this.ir = true;
                this.ue = false;
                this.me = void 0;
                this.ve(t, "au-started", t.host);
            }));
        }));
    }
    stop(t = false) {
        if (isPromise(this.ge)) {
            return this.ge;
        }
        if (this.ir === true) {
            const e = this.de;
            this.ir = false;
            this.fe = true;
            return this.ge = k(e.deactivate(), (() => {
                Reflect.deleteProperty(e.host, "$aurelia");
                if (t) {
                    e.dispose();
                }
                this.de = void 0;
                this.pe.dispose();
                this.fe = false;
                this.ve(e, "au-stopped", e.host);
            }));
        }
    }
    dispose() {
        if (this.ir || this.fe) {
            throw createMappedError(771);
        }
        this.container.dispose();
    }
    ve(t, e, i) {
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
                this.has = this.xe;
                break;

              case 1:
                this.has = this.we;
                break;

              default:
                this.has = this.ye;
            }
        } else {
            switch (t.length) {
              case 0:
                this.has = this.be;
                break;

              case 1:
                this.has = this.ke;
                break;

              default:
                this.has = this.Ce;
            }
        }
    }
    equals(t) {
        return this.chars === t.chars && this.repeat === t.repeat && this.isSymbol === t.isSymbol && this.isInverted === t.isInverted;
    }
    Ce(t) {
        return this.chars.includes(t);
    }
    ke(t) {
        return this.chars === t;
    }
    be(t) {
        return false;
    }
    ye(t) {
        return !this.chars.includes(t);
    }
    we(t) {
        return this.chars !== t;
    }
    xe(t) {
        return true;
    }
}

class Interpretation {
    constructor() {
        this.parts = m;
        this.Ae = "";
        this.Be = {};
        this.Se = {};
    }
    get pattern() {
        const t = this.Ae;
        if (t === "") {
            return null;
        } else {
            return t;
        }
    }
    set pattern(t) {
        if (t == null) {
            this.Ae = "";
            this.parts = m;
        } else {
            this.Ae = t;
            this.parts = this.Se[t];
        }
    }
    append(t, e) {
        const i = this.Be;
        if (i[t] === undefined) {
            i[t] = e;
        } else {
            i[t] += e;
        }
    }
    next(t) {
        const e = this.Be;
        let i;
        if (e[t] !== undefined) {
            i = this.Se;
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
    get Ae() {
        return this.Te ? this.Re[0] : null;
    }
    constructor(t, ...e) {
        this.charSpec = t;
        this.Ie = [];
        this.Ee = null;
        this.Te = false;
        this.Re = e;
    }
    findChild(t) {
        const e = this.Ie;
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
        const i = this.Re;
        if (!i.includes(e)) {
            i.push(e);
        }
        let s = this.findChild(t);
        if (s == null) {
            s = new AttrParsingState(t, e);
            this.Ie.push(s);
            if (t.repeat) {
                s.Ie.push(s);
            }
        }
        return s;
    }
    findMatches(t, e) {
        const i = [];
        const s = this.Ie;
        const n = s.length;
        let r = 0;
        let l = null;
        let a = 0;
        let h = 0;
        for (;a < n; ++a) {
            l = s[a];
            if (l.charSpec.has(t)) {
                i.push(l);
                r = l.Re.length;
                h = 0;
                if (l.charSpec.isSymbol) {
                    for (;h < r; ++h) {
                        e.next(l.Re[h]);
                    }
                } else {
                    for (;h < r; ++h) {
                        e.append(l.Re[h], t);
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
        const e = this._e = t.length;
        const i = this.Pe = [];
        let s = 0;
        for (;e > s; ++s) {
            i.push(new CharSpec(t[s], false, false, false));
        }
    }
    eachChar(t) {
        const e = this._e;
        const i = this.Pe;
        let s = 0;
        for (;e > s; ++s) {
            t(i[s]);
        }
    }
}

class DynamicSegment {
    constructor(t) {
        this.text = "PART";
        this.Le = new CharSpec(t, true, false, true);
    }
    eachChar(t) {
        t(this.Le);
    }
}

class SymbolSegment {
    constructor(t) {
        this.text = t;
        this.Le = new CharSpec(t, false, true, false);
    }
    eachChar(t) {
        t(this.Le);
    }
}

class SegmentTypes {
    constructor() {
        this.statics = 0;
        this.dynamics = 0;
        this.symbols = 0;
    }
}

const Ls = /*@__PURE__*/ zt("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

class SyntaxInterpreter {
    constructor() {
        this.Me = new AttrParsingState(null);
        this.De = [ this.Me ];
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
            i = this.Me;
            s = t[c];
            n = s.pattern;
            r = new SegmentTypes;
            l = this.qe(s, r);
            a = l.length;
            h = t => i = i.append(t, n);
            for (u = 0; a > u; ++u) {
                l[u].eachChar(h);
            }
            i.Ee = r;
            i.Te = true;
            ++c;
        }
    }
    interpret(t) {
        const e = new Interpretation;
        const i = t.length;
        let s = this.De;
        let n = 0;
        let r;
        for (;n < i; ++n) {
            s = this.Fe(s, t.charAt(n), e);
            if (s.length === 0) {
                break;
            }
        }
        s = s.filter(isEndpoint);
        if (s.length > 0) {
            s.sort(sortEndpoint);
            r = s[0];
            if (!r.charSpec.isSymbol) {
                e.next(r.Ae);
            }
            e.pattern = r.Ae;
        }
        return e;
    }
    Fe(t, e, i) {
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
    qe(t, e) {
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
    return t.Te;
}

function sortEndpoint(t, e) {
    const i = t.Ee;
    const s = e.Ee;
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

const Ms = /*@__PURE__*/ zt("IAttributePattern");

const Ds = /*@__PURE__*/ zt("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor() {
        this.j = {};
        const t = this.He = f(Ls);
        const e = Fs.findAll(f(x));
        const i = this.Re = {};
        const s = e.reduce(((t, e) => {
            const s = getAllPatternDefinitions(e.constructor);
            s.forEach((t => i[t.pattern] = e));
            return t.concat(s);
        }), m);
        t.add(s);
    }
    parse(t, e) {
        let i = this.j[t];
        if (i == null) {
            i = this.j[t] = this.He.interpret(t);
        }
        const s = i.pattern;
        if (s == null) {
            return new AttrSyntax(t, e, t, null, null);
        } else {
            return this.Re[s][s](t, e, i.parts);
        }
    }
}

function attributePattern(...t) {
    return function decorator(e) {
        return Fs.define(t, e);
    };
}

const getAllPatternDefinitions = t => qs.get(t) ?? m;

const qs = new WeakMap;

const Fs = dt({
    name: u("attribute-pattern"),
    define(t, e) {
        qs.set(e, t);
        return g.define(e, (t => {
            Ut(Ms, e).register(t);
        }));
    },
    getPatternDefinitions: getAllPatternDefinitions,
    findAll: t => t.root.getAll(Ms)
});

let Hs = class DotSeparatedAttributePattern {
    "PART.PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], i[1]);
    }
    "PART.PART.PART"(t, e, i) {
        return new AttrSyntax(t, e, `${i[0]}.${i[1]}`, i[2]);
    }
};

Hs = __decorate([ attributePattern({
    pattern: "PART.PART",
    symbols: "."
}, {
    pattern: "PART.PART.PART",
    symbols: "."
}) ], Hs);

let Os = class RefAttributePattern {
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

Os = __decorate([ attributePattern({
    pattern: "ref",
    symbols: ""
}, {
    pattern: "PART.ref",
    symbols: "."
}) ], Os);

let Vs = class EventAttributePattern {
    "PART.trigger:PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "trigger", i);
    }
    "PART.capture:PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "capture", i);
    }
};

Vs = __decorate([ attributePattern({
    pattern: "PART.trigger:PART",
    symbols: ".:"
}, {
    pattern: "PART.capture:PART",
    symbols: ".:"
}) ], Vs);

let $s = class ColonPrefixedBindAttributePattern {
    ":PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "bind");
    }
};

$s = __decorate([ attributePattern({
    pattern: ":PART",
    symbols: ":"
}) ], $s);

let Ns = class AtPrefixedTriggerAttributePattern {
    "@PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "trigger");
    }
    "@PART:PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "trigger", [ i[0], "trigger", ...i.slice(1) ]);
    }
};

Ns = __decorate([ attributePattern({
    pattern: "@PART",
    symbols: "@"
}, {
    pattern: "@PART:PART",
    symbols: "@:"
}) ], Ns);

let Ws = class SpreadAttributePattern {
    "...$attrs"(t, e, i) {
        return new AttrSyntax(t, e, "", "...$attrs");
    }
};

Ws = __decorate([ attributePattern({
    pattern: "...$attrs",
    symbols: ""
}) ], Ws);

function bindingCommand(t) {
    return function(e) {
        return Us.define(t, e);
    };
}

class BindingCommandDefinition {
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
        return new BindingCommandDefinition(e, l(getCommandAnnotation(e, "name"), i), a(getCommandAnnotation(e, "aliases"), s.aliases, e.aliases), getCommandKeyFrom(i));
    }
    register(t, e) {
        const i = this.Type;
        const s = typeof e === "string" ? getCommandKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(s, false)) {
            t.register(t.has(i, false) ? null : Ut(i, i), Gt(i, s), ...n.map((t => Gt(i, getCommandKeyFrom(t)))));
        }
    }
}

const js = "binding-command";

const zs = /*@__PURE__*/ u(js);

const getCommandKeyFrom = t => `${zs}:${t}`;

const getCommandAnnotation = (t, e) => Dt(Ot(e), t);

const Us = dt({
    name: zs,
    keyFrom: getCommandKeyFrom,
    define(t, e) {
        const i = BindingCommandDefinition.create(t, e);
        const s = i.Type;
        Ft(zs, i, s);
        Ft(h, i, s);
        return s;
    },
    getAnnotation: getCommandAnnotation,
    find(t, e) {
        const i = t.find(js, e);
        return i == null ? null : Dt(zs, i) ?? getDefinitionFromStaticAu(i, js, BindingCommandDefinition.create) ?? null;
    },
    get(t, e) {
        return t.get(c(getCommandKeyFrom(e)));
    }
});

class OneTimeBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = t.attr.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? T(n);
        } else {
            if (r === "" && t.def.kind === Xt) {
                r = T(n);
            }
            n = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, Ct), n, It);
    }
}

OneTimeBindingCommand.$au = {
    type: js,
    name: "one-time"
};

class ToViewBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = t.attr.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? T(n);
        } else {
            if (r === "" && t.def.kind === Xt) {
                r = T(n);
            }
            n = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, Ct), n, Et);
    }
}

ToViewBindingCommand.$au = {
    type: js,
    name: "to-view"
};

class FromViewBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = s.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? T(n);
        } else {
            if (r === "" && t.def.kind === Xt) {
                r = T(n);
            }
            n = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, Ct), n, _t);
    }
}

FromViewBindingCommand.$au = {
    type: js,
    name: "from-view"
};

class TwoWayBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = s.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? T(n);
        } else {
            if (r === "" && t.def.kind === Xt) {
                r = T(n);
            }
            n = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, Ct), n, Pt);
    }
}

TwoWayBindingCommand.$au = {
    type: js,
    name: "two-way"
};

class DefaultBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, e, i) {
        const s = t.attr;
        const n = t.bindable;
        let r;
        let l;
        let a = s.target;
        let h = s.rawValue;
        if (n == null) {
            l = i.isTwoWay(t.node, a) ? Pt : Et;
            a = i.map(t.node, a) ?? T(a);
        } else {
            if (h === "" && t.def.kind === Xt) {
                h = T(a);
            }
            r = t.def.defaultBindingMode;
            l = n.mode === Lt || n.mode == null ? r == null || r === Lt ? Et : r : n.mode;
            a = n.name;
        }
        return new PropertyBindingInstruction(e.parse(h, Ct), a, l);
    }
}

DefaultBindingCommand.$au = {
    type: js,
    name: "bind"
};

class ForBindingCommand {
    constructor() {
        this.Oe = f(Ds);
    }
    get ignoreAttr() {
        return false;
    }
    build(t, e) {
        const i = t.bindable === null ? T(t.attr.target) : t.bindable.name;
        const s = e.parse(t.attr.rawValue, bt);
        let n = m;
        if (s.semiIdx > -1) {
            const e = t.attr.rawValue.slice(s.semiIdx + 1);
            const i = e.indexOf(":");
            if (i > -1) {
                const t = e.slice(0, i).trim();
                const s = e.slice(i + 1).trim();
                const r = this.Oe.parse(t, s);
                n = [ new MultiAttrInstruction(s, r.target, r.command) ];
            }
        }
        return new IteratorBindingInstruction(s, i, n);
    }
}

ForBindingCommand.$au = {
    type: js,
    name: "for"
};

class TriggerBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, kt), t.attr.target, false, t.attr.parts?.[2] ?? null);
    }
}

TriggerBindingCommand.$au = {
    type: js,
    name: "trigger"
};

class CaptureBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, kt), t.attr.target, true, t.attr.parts?.[2] ?? null);
    }
}

CaptureBindingCommand.$au = {
    type: js,
    name: "capture"
};

class AttrBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new AttributeBindingInstruction(t.attr.target, e.parse(t.attr.rawValue, Ct), t.attr.target);
    }
}

AttrBindingCommand.$au = {
    type: js,
    name: "attr"
};

class StyleBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new AttributeBindingInstruction("style", e.parse(t.attr.rawValue, Ct), t.attr.target);
    }
}

StyleBindingCommand.$au = {
    type: js,
    name: "style"
};

class ClassBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new AttributeBindingInstruction("class", e.parse(t.attr.rawValue, Ct), t.attr.target);
    }
}

ClassBindingCommand.$au = {
    type: js,
    name: "class"
};

class RefBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new RefBindingInstruction(e.parse(t.attr.rawValue, Ct), t.attr.target);
    }
}

RefBindingCommand.$au = {
    type: js,
    name: "ref"
};

class SpreadBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t) {
        return new SpreadBindingInstruction;
    }
}

SpreadBindingCommand.$au = {
    type: js,
    name: "...$attrs"
};

const Gs = /*@__PURE__*/ zt("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

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
        t.register(Ut(this, this), Gt(this, Gs));
    }
    constructor() {
        this.Ve = mt(createLookup(), {
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
        this.$e = o("a altGlyph animate animateColor circle clipPath defs ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feFlood feGaussianBlur feImage feMerge feMorphology feOffset feSpecularLighting feTile feTurbulence filter font foreignObject g glyph glyphRef image line linearGradient marker mask missing-glyph path pattern polygon polyline radialGradient rect stop svg switch symbol text textPath tref tspan use");
        this.Ne = o("alignment-baseline baseline-shift clip-path clip-rule clip color-interpolation-filters color-interpolation color-profile color-rendering color cursor direction display dominant-baseline enable-background fill-opacity fill-rule fill filter flood-color flood-opacity font-family font-size-adjust font-size font-stretch font-style font-variant font-weight glyph-orientation-horizontal glyph-orientation-vertical image-rendering kerning letter-spacing lighting-color marker-end marker-mid marker-start mask opacity overflow pointer-events shape-rendering stop-color stop-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width stroke text-anchor text-decoration text-rendering unicode-bidi visibility word-spacing writing-mode");
        const t = f(ae);
        this.SVGElement = t.globalThis.SVGElement;
        const e = t.document.createElement("div");
        e.innerHTML = "<svg><altGlyph /></svg>";
        if (e.firstElementChild.nodeName === "altglyph") {
            const t = this.Ve;
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
        return this.$e[t.nodeName] === true && this.Ne[e] === true || this.Ve[t.nodeName]?.[e] === true;
    }
}

const Ks = /*@__PURE__*/ zt("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    constructor() {
        this.fns = [];
        this.We = createLookup();
        this.je = createLookup();
        this.svg = f(Gs);
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
        let e;
        let i;
        let s;
        let n;
        for (s in t) {
            e = t[s];
            i = this.We[s] ??= createLookup();
            for (n in e) {
                if (i[n] !== void 0) {
                    throw createError(n, s);
                }
                i[n] = e[n];
            }
        }
    }
    useGlobalMapping(t) {
        const e = this.je;
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
        return this.We[t.nodeName]?.[e] ?? this.je[e] ?? (isDataAttribute(t, e, this.svg) ? e : null);
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

const Xs = createLookup();

class AttributeNSAccessor {
    static forNs(t) {
        return Xs[t] ??= new AttributeNSAccessor(t);
    }
    constructor(t) {
        this.ns = t;
        this.type = Tt | Rt;
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
        this.type = Tt | Rt;
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

const Qs = new DataAttributeAccessor;

const Ys = {
    childList: true,
    subtree: true,
    characterData: true
};

function defaultMatcher$1(t, e) {
    return t === e;
}

class SelectValueObserver {
    constructor(t, e, i, s) {
        this.type = Tt | St | Rt;
        this.v = void 0;
        this.ov = void 0;
        this.ze = false;
        this.Ue = void 0;
        this.Ge = void 0;
        this.iO = false;
        this.ft = false;
        this.ut = t;
        this.oL = s;
        this.cf = i;
    }
    getValue() {
        return this.iO ? this.v : this.ut.multiple ? getSelectedOptions(this.ut.options) : this.ut.value;
    }
    setValue(t) {
        this.ov = this.v;
        this.v = t;
        this.ze = t !== this.ov;
        this.Ke(t instanceof Array ? t : null);
        this.wt();
    }
    wt() {
        if (this.ze) {
            this.ze = false;
            this.syncOptions();
        }
    }
    handleCollectionChange() {
        this.syncOptions();
    }
    syncOptions() {
        const t = this.v;
        const e = this.ut;
        const i = isArray(t);
        const s = e.matcher ?? defaultMatcher$1;
        const n = e.options;
        let r = n.length;
        while (r-- > 0) {
            const e = n[r];
            const l = ft.call(e, "model") ? e.model : e.value;
            if (i) {
                e.selected = t.findIndex((t => !!s(l, t))) !== -1;
                continue;
            }
            e.selected = !!s(l, t);
        }
    }
    syncValue() {
        const t = this.ut;
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
                    a.push(ft.call(r, "model") ? r.model : r.value);
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
                r = ft.call(l, "model") ? l.model : l.value;
                break;
            }
            ++n;
        }
        this.ov = this.v;
        this.v = r;
        return true;
    }
    dt() {
        (this.Ge = createMutationObserver(this.ut, this.Xe.bind(this))).observe(this.ut, Ys);
        this.Ke(this.v instanceof Array ? this.v : null);
        this.iO = true;
    }
    gt() {
        this.Ge.disconnect();
        this.Ue?.unsubscribe(this);
        this.Ge = this.Ue = void 0;
        this.iO = false;
    }
    Ke(t) {
        this.Ue?.unsubscribe(this);
        this.Ue = void 0;
        if (t != null) {
            if (!this.ut.multiple) {
                throw createError$1(`AUR0654`);
            }
            (this.Ue = this.oL.getArrayObserver(t)).subscribe(this);
        }
    }
    handleEvent() {
        const t = this.syncValue();
        if (t) {
            this.Qe();
        }
    }
    Xe(t) {
        this.syncOptions();
        const e = this.syncValue();
        if (e) {
            this.Qe();
        }
    }
    Qe() {
        Zs = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Zs);
    }
}

mixinNodeObserverUseConfig(SelectValueObserver);

W(SelectValueObserver);

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
            e[e.length] = ft.call(n, "model") ? n.model : n.value;
        }
        ++s;
    }
    return e;
}

let Zs = void 0;

const Js = "--";

class StyleAttributeAccessor {
    constructor(t) {
        this.obj = t;
        this.type = Tt | Rt;
        this.v = "";
        this.ov = "";
        this.styles = {};
        this.version = 0;
        this.ze = false;
    }
    getValue() {
        return this.obj.style.cssText;
    }
    setValue(t) {
        this.v = t;
        this.ze = t !== this.ov;
        this.wt();
    }
    Ye(t) {
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
    Ze(t) {
        let e;
        let s;
        const n = [];
        for (s in t) {
            e = t[s];
            if (e == null) {
                continue;
            }
            if (isString(e)) {
                if (s.startsWith(Js)) {
                    n.push([ s, e ]);
                    continue;
                }
                n.push([ i(s), e ]);
                continue;
            }
            n.push(...this.Je(e));
        }
        return n;
    }
    ti(t) {
        const e = t.length;
        if (e > 0) {
            const i = [];
            let s = 0;
            for (;e > s; ++s) {
                i.push(...this.Je(t[s]));
            }
            return i;
        }
        return m;
    }
    Je(t) {
        if (isString(t)) {
            return this.Ye(t);
        }
        if (t instanceof Array) {
            return this.ti(t);
        }
        if (t instanceof Object) {
            return this.Ze(t);
        }
        return m;
    }
    wt() {
        if (this.ze) {
            this.ze = false;
            const t = this.v;
            const e = this.styles;
            const i = this.Je(t);
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
                if (!ft.call(e, s) || e[s] !== n) {
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
        this.type = Tt | St | Rt;
        this.v = "";
        this.ov = "";
        this.ze = false;
        this.ft = false;
        this.ut = t;
        this.k = e;
        this.cf = i;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (xt(t, this.v)) {
            return;
        }
        this.ov = this.v;
        this.v = t;
        this.ze = true;
        if (!this.cf.readonly) {
            this.wt();
        }
    }
    wt() {
        if (this.ze) {
            this.ze = false;
            this.ut[this.k] = this.v ?? this.cf.default;
            this.Qe();
        }
    }
    handleEvent() {
        this.ov = this.v;
        this.v = this.ut[this.k];
        if (this.ov !== this.v) {
            this.ze = false;
            this.Qe();
        }
    }
    dt() {
        this.v = this.ov = this.ut[this.k];
    }
    Qe() {
        tn = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, tn);
    }
}

mixinNodeObserverUseConfig(ValueAttributeObserver);

W(ValueAttributeObserver);

let tn = void 0;

const en = "http://www.w3.org/1999/xlink";

const sn = "http://www.w3.org/XML/1998/namespace";

const nn = "http://www.w3.org/2000/xmlns/";

const rn = mt(createLookup(), {
    "xlink:actuate": [ "actuate", en ],
    "xlink:arcrole": [ "arcrole", en ],
    "xlink:href": [ "href", en ],
    "xlink:role": [ "role", en ],
    "xlink:show": [ "show", en ],
    "xlink:title": [ "title", en ],
    "xlink:type": [ "type", en ],
    "xml:lang": [ "lang", sn ],
    "xml:space": [ "space", sn ],
    xmlns: [ "xmlns", nn ],
    "xmlns:xlink": [ "xlink", nn ]
});

const on = new Y;

on.type = Tt | Rt;

class NodeObserverLocator {
    static register(t) {
        t.register(Ut(this, this), Gt(this, Z));
    }
    constructor() {
        this.allowDirtyCheck = true;
        this.ei = createLookup();
        this.ii = createLookup();
        this.si = createLookup();
        this.ni = createLookup();
        this.ri = f(R);
        this.p = f(ae);
        this.oi = f(J);
        this.svg = f(Gs);
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
        const s = this.ei;
        let n;
        if (isString(t)) {
            n = s[t] ??= createLookup();
            if (n[e] == null) {
                n[e] = i;
            } else {
                throwMappingExisted(t, e);
            }
        } else {
            for (const i in t) {
                n = s[i] ??= createLookup();
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
        const i = this.ii;
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
        if (e in this.ni || e in (this.si[t.tagName] ?? I)) {
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
            return Qs;

          default:
            {
                const i = rn[e];
                if (i !== undefined) {
                    return AttributeNSAccessor.forNs(i[1]);
                }
                if (isDataAttribute(t, e, this.svg)) {
                    return Qs;
                }
                return on;
            }
        }
    }
    overrideAccessor(t, e) {
        let i;
        if (isString(t)) {
            i = this.si[t] ??= createLookup();
            i[e] = true;
        } else {
            for (const e in t) {
                for (const s of t[e]) {
                    i = this.si[e] ??= createLookup();
                    i[s] = true;
                }
            }
        }
    }
    overrideAccessorGlobal(...t) {
        for (const e of t) {
            this.ni[e] = true;
        }
    }
    getNodeObserverConfig(t, e) {
        return this.ei[t.tagName]?.[e] ?? this.ii[e];
    }
    getNodeObserver(t, e, i) {
        const s = this.ei[t.tagName]?.[e] ?? this.ii[e];
        let n;
        if (s != null) {
            n = new (s.type ?? ValueAttributeObserver)(t, e, s, i, this.ri);
            if (!n.doNotCache) {
                tt(t)[e] = n;
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
        const n = rn[e];
        if (n !== undefined) {
            return AttributeNSAccessor.forNs(n[1]);
        }
        if (isDataAttribute(t, e, this.svg)) {
            return Qs;
        }
        if (e in t.constructor.prototype) {
            if (this.allowDirtyCheck) {
                return this.oi.createProperty(t, e);
            }
            throw createMappedError(652, e);
        } else {
            return new et(t, e);
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
        this.type = Tt | St | Rt;
        this.v = void 0;
        this.ov = void 0;
        this.li = void 0;
        this.ai = void 0;
        this.ft = false;
        this.ut = t;
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
        this.hi();
        this.ui();
        this.Qe();
    }
    handleCollectionChange() {
        this.ui();
    }
    handleChange(t, e) {
        this.ui();
    }
    ui() {
        const t = this.v;
        const e = this.ut;
        const i = ft.call(e, "model") ? e.model : e.value;
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
        const e = this.ut;
        const i = ft.call(e, "model") ? e.model : e.value;
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
        this.Qe();
    }
    dt() {
        this.hi();
    }
    gt() {
        this.li?.unsubscribe(this);
        this.ai?.unsubscribe(this);
        this.li = this.ai = void 0;
    }
    Qe() {
        ln = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, ln);
    }
    hi() {
        const t = this.ut;
        (this.ai ??= t.$observers?.model ?? t.$observers?.value)?.subscribe(this);
        this.li?.unsubscribe(this);
        this.li = void 0;
        if (t.type === "checkbox") {
            (this.li = getCollectionObserver(this.v, this.oL))?.subscribe(this);
        }
    }
}

mixinNodeObserverUseConfig(CheckedObserver);

W(CheckedObserver);

let ln = void 0;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) {
            throw createMappedError(9994, e);
        }
        e.useTargetObserver(Qs);
    }
}

AttrBindingBehavior.$au = {
    type: Zt,
    name: "attr"
};

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

SelfBindingBehavior.$au = {
    type: Zt,
    name: "self"
};

class UpdateTriggerBindingBehavior {
    constructor() {
        this.oL = f(z);
        this.fi = f(Z);
    }
    bind(t, e, ...i) {
        if (!(this.fi instanceof NodeObserverLocator)) {
            throw createMappedError(9993);
        }
        if (i.length === 0) {
            throw createMappedError(802);
        }
        if (!(e instanceof PropertyBinding) || !(e.mode & _t)) {
            throw createMappedError(803);
        }
        const s = this.fi.getNodeObserverConfig(e.target, e.targetProperty);
        if (s == null) {
            throw createMappedError(9992, e);
        }
        const n = this.fi.getNodeObserver(e.target, e.targetProperty, this.oL);
        n.useConfig({
            readonly: s.readonly,
            default: s.default,
            events: i
        });
        e.useTargetObserver(n);
    }
}

UpdateTriggerBindingBehavior.$au = {
    type: Zt,
    name: "updateTrigger"
};

class If {
    constructor() {
        this.elseFactory = void 0;
        this.elseView = void 0;
        this.ifView = void 0;
        this.view = void 0;
        this.value = false;
        this.cache = true;
        this.pending = void 0;
        this.di = false;
        this.mi = 0;
        this.gi = f(_e);
        this.l = f(vs);
    }
    attaching(t, e) {
        return this.pi(this.value);
    }
    detaching(t, e) {
        this.di = true;
        return k(this.pending, (() => {
            this.di = false;
            this.pending = void 0;
            void this.view?.deactivate(t, this.$controller);
        }));
    }
    valueChanged(t, e) {
        if (!this.$controller.isActive) return;
        t = !!t;
        e = !!e;
        if (t !== e) return this.pi(t);
    }
    pi(t) {
        const e = this.view;
        const i = this.$controller;
        const s = this.mi++;
        const isCurrent = () => !this.di && this.mi === s + 1;
        let n;
        return k(this.pending, (() => this.pending = k(e?.deactivate(e, i), (() => {
            if (!isCurrent()) {
                return;
            }
            if (t) {
                n = this.view = this.ifView = this.cache && this.ifView != null ? this.ifView : this.gi.create();
            } else {
                n = this.view = this.elseView = this.cache && this.elseView != null ? this.elseView : this.elseFactory?.create();
            }
            if (n == null) {
                return;
            }
            n.setLocation(this.l);
            return k(n.activate(n, i, i.scope), (() => {
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

If.$au = {
    type: ce,
    name: "if",
    isTemplateController: true,
    bindables: {
        value: true,
        cache: {
            set: t => t === "" || !!t && t !== "false"
        }
    }
};

class Else {
    constructor() {
        this.f = f(_e);
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

Else.$au = {
    type: "custom-attribute",
    name: "else",
    isTemplateController: true
};

function dispose(t) {
    t.dispose();
}

const an = [ "BindingBehavior", "ValueConverter" ];

class Repeat {
    constructor(t, e, i, s, n) {
        this.views = [];
        this.vi = [];
        this.key = null;
        this.xi = new Map;
        this.wi = new Map;
        this.yi = void 0;
        this.bi = false;
        this.ki = false;
        this.Ci = null;
        this.Ai = void 0;
        this.Bi = false;
        const r = t.props[0].props[0];
        if (r !== void 0) {
            const {to: t, value: i, command: s} = r;
            if (t === "key") {
                if (s === null) {
                    this.key = i;
                } else if (s === "bind") {
                    this.key = e.parse(i, Ct);
                } else {
                    throw createMappedError(775, s);
                }
            } else {
                throw createMappedError(776, t);
            }
        }
        this.l = i;
        this.Si = s;
        this.f = n;
    }
    binding(t, e) {
        const i = this.Si.bindings;
        const s = i.length;
        let n = void 0;
        let r;
        let l = 0;
        for (;s > l; ++l) {
            n = i[l];
            if (n.target === this && n.targetProperty === "items") {
                r = this.forOf = n.ast;
                this.Ti = n;
                let t = r.iterable;
                while (t != null && an.includes(t.$kind)) {
                    t = t.expression;
                    this.bi = true;
                }
                this.Ci = t;
                break;
            }
        }
        this.Ri();
        const a = r.declaration;
        if (!(this.Bi = a.$kind === "ArrayDestructuring" || a.$kind === "ObjectDestructuring")) {
            this.local = H(a, this.$controller.scope, n, null);
        }
    }
    attaching(t, e) {
        this.Ii();
        return this.Ei(t);
    }
    detaching(t, e) {
        this.Ri();
        return this._i(t);
    }
    unbinding(t, e) {
        this.wi.clear();
        this.xi.clear();
    }
    itemsChanged() {
        if (!this.$controller.isActive) {
            return;
        }
        this.Ri();
        this.Ii();
        this.Pi(this.items, void 0);
    }
    handleCollectionChange(t, e) {
        const i = this.$controller;
        if (!i.isActive) {
            return;
        }
        if (this.bi) {
            if (this.ki) {
                return;
            }
            this.ki = true;
            this.items = H(this.forOf.iterable, i.scope, this.Ti, null);
            this.ki = false;
            return;
        }
        this.Ii();
        this.Pi(t, e);
    }
    Pi(t, e) {
        const i = this.views;
        this.vi = i.slice();
        const s = i.length;
        const n = this.key;
        const r = n !== null;
        if (r || e === void 0) {
            const t = this.local;
            const l = this.Ai;
            const a = l.length;
            const h = this.forOf;
            const c = h.declaration;
            const u = this.Ti;
            const f = this.Bi;
            e = it(a);
            let d = 0;
            if (s === 0) {
                for (;d < a; ++d) {
                    e[d] = -2;
                }
            } else if (a === 0) {
                if (f) {
                    for (d = 0; d < s; ++d) {
                        e.deletedIndices.push(d);
                        e.deletedItems.push(H(c, i[d].scope, u, null));
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
                        m[d] = H(c, i[d].scope, u, null);
                    }
                } else {
                    for (d = 0; d < s; ++d) {
                        m[d] = i[d].scope.bindingContext[t];
                    }
                }
                let g;
                let p;
                let v;
                let x;
                let w = 0;
                const y = s - 1;
                const b = a - 1;
                const k = new Map;
                const C = new Map;
                const A = this.xi;
                const B = this.wi;
                const S = this.$controller.scope;
                d = 0;
                t: {
                    while (true) {
                        if (r) {
                            g = m[d];
                            p = l[d];
                            v = getKeyValue(A, n, g, getScope(B, g, h, S, u, t, f), u);
                            x = getKeyValue(A, n, p, getScope(B, p, h, S, u, t, f), u);
                        } else {
                            g = v = ensureUnique(m[d], d);
                            p = x = ensureUnique(l[d], d);
                        }
                        if (v !== x) {
                            A.set(g, v);
                            A.set(p, x);
                            break;
                        }
                        ++d;
                        if (d > y || d > b) {
                            break t;
                        }
                    }
                    if (y !== b) {
                        break t;
                    }
                    w = b;
                    while (true) {
                        if (r) {
                            g = m[w];
                            p = l[w];
                            v = getKeyValue(A, n, g, getScope(B, g, h, S, u, t, f), u);
                            x = getKeyValue(A, n, p, getScope(B, p, h, S, u, t, f), u);
                        } else {
                            g = v = ensureUnique(m[d], d);
                            p = x = ensureUnique(l[d], d);
                        }
                        if (v !== x) {
                            A.set(g, v);
                            A.set(p, x);
                            break;
                        }
                        --w;
                        if (d > w) {
                            break t;
                        }
                    }
                }
                const T = d;
                const R = d;
                for (d = R; d <= b; ++d) {
                    if (A.has(p = r ? l[d] : ensureUnique(l[d], d))) {
                        x = A.get(p);
                    } else {
                        x = r ? getKeyValue(A, n, p, getScope(B, p, h, S, u, t, f), u) : p;
                        A.set(p, x);
                    }
                    C.set(x, d);
                }
                for (d = T; d <= y; ++d) {
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
                for (d = R; d <= b; ++d) {
                    if (!k.has(A.get(r ? l[d] : ensureUnique(l[d], d)))) {
                        e[d] = -2;
                    }
                }
                k.clear();
                C.clear();
            }
        }
        if (e === void 0) {
            const t = k(this._i(null), (() => this.Ei(null)));
            if (isPromise(t)) {
                t.catch(rethrow);
            }
        } else {
            if (e.deletedIndices.length > 0) {
                const t = k(this.Li(e), (() => this.Mi(s, e)));
                if (isPromise(t)) {
                    t.catch(rethrow);
                }
            } else {
                this.Mi(s, e);
            }
        }
    }
    Ri() {
        const t = this.$controller.scope;
        let e = this.Di;
        let i = this.bi;
        let s;
        if (i) {
            e = this.Di = H(this.Ci, t, this.Ti, null) ?? null;
            i = this.bi = !xt(this.items, e);
        }
        const n = this.yi;
        if (this.$controller.isActive) {
            s = this.yi = st(i ? e : this.items);
            if (n !== s) {
                n?.unsubscribe(this);
                s?.subscribe(this);
            }
        } else {
            n?.unsubscribe(this);
            this.yi = undefined;
        }
    }
    Ii() {
        const {items: t} = this;
        if (isArray(t)) {
            this.Ai = t;
            return;
        }
        const e = [];
        iterate(t, ((t, i) => {
            e[i] = t;
        }));
        this.Ai = e;
    }
    Ei(t) {
        let e = void 0;
        let i;
        let s;
        let n;
        const {$controller: r, f: l, local: a, l: h, items: c, wi: u, Ti: f, forOf: d, Bi: m} = this;
        const g = r.scope;
        const p = getCount(c);
        const v = this.views = Array(p);
        iterate(c, ((c, x) => {
            s = v[x] = l.create().setLocation(h);
            s.nodes.unlink();
            n = getScope(u, c, d, g, f, a, m);
            setContextualProperties(n.overrideContext, x, p);
            i = s.activate(t ?? s, r, n);
            if (isPromise(i)) {
                (e ?? (e = [])).push(i);
            }
        }));
        if (e !== void 0) {
            return e.length === 1 ? e[0] : Promise.all(e);
        }
    }
    _i(t) {
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
    Li(t) {
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
    Mi(t, e) {
        let i = void 0;
        let s;
        let n;
        let r;
        let l = 0;
        const {$controller: a, f: h, local: c, Ai: u, l: f, views: d, Bi: m, Ti: g, wi: p, vi: v, forOf: x} = this;
        const w = e.length;
        for (;w > l; ++l) {
            if (e[l] === -2) {
                n = h.create();
                d.splice(l, 0, n);
            }
        }
        if (d.length !== w) {
            throw createMappedError(814, [ d.length, w ]);
        }
        const y = a.scope;
        const b = e.length;
        let k = 0;
        l = 0;
        for (;l < e.length; ++l) {
            if ((k = e[l]) !== -2) {
                d[l] = v[k];
            }
        }
        const C = longestIncreasingSubsequence(e);
        const A = C.length;
        const B = x.declaration;
        let S;
        let T = A - 1;
        l = b - 1;
        for (;l >= 0; --l) {
            n = d[l];
            S = d[l + 1];
            n.nodes.link(S?.nodes ?? f);
            if (e[l] === -2) {
                r = getScope(p, u[l], x, y, g, c, m);
                setContextualProperties(r.overrideContext, l, b);
                n.setLocation(f);
                s = n.activate(n, a, r);
                if (isPromise(s)) {
                    (i ?? (i = [])).push(s);
                }
            } else if (T < 0 || A === 1 || l !== C[T]) {
                if (m) {
                    N(B, n.scope, g, u[l]);
                } else {
                    n.scope.bindingContext[c] = u[l];
                }
                setContextualProperties(n.scope.overrideContext, l, b);
                n.nodes.insertBefore(n.location);
            } else {
                if (m) {
                    N(B, n.scope, g, u[l]);
                } else {
                    n.scope.bindingContext[c] = u[l];
                }
                if (t !== b) {
                    setContextualProperties(n.scope.overrideContext, l, b);
                }
                --T;
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

Repeat.$au = {
    type: ce,
    name: "repeat",
    isTemplateController: true,
    bindables: [ "items" ]
};

Repeat.inject = [ oi, j, vs, cs, _e ];

let hn = 16;

let cn = new Int32Array(hn);

let un = new Int32Array(hn);

function longestIncreasingSubsequence(t) {
    const e = t.length;
    if (e > hn) {
        hn = e;
        cn = new Int32Array(e);
        un = new Int32Array(e);
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
            l = cn[i];
            n = t[l];
            if (n !== -2 && n < s) {
                un[r] = l;
                cn[++i] = r;
                continue;
            }
            a = 0;
            h = i;
            while (a < h) {
                c = a + h >> 1;
                n = t[cn[c]];
                if (n !== -2 && n < s) {
                    a = c + 1;
                } else {
                    h = c;
                }
            }
            n = t[cn[a]];
            if (s < n || n === -2) {
                if (a > 0) {
                    un[r] = cn[a - 1];
                }
                cn[a] = r;
            }
        }
    }
    r = ++i;
    const u = new Int32Array(r);
    s = cn[i - 1];
    while (i-- > 0) {
        u[i] = s;
        s = un[s];
    }
    while (r-- > 0) cn[r] = 0;
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

const dn = ut.toString;

const getCount = t => {
    switch (dn.call(t)) {
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
    switch (dn.call(t)) {
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
            r = H(e, s, n, null);
        }
        t.set(i, r);
    }
    return r;
};

const getScope = (t, e, i, s, n, r, l) => {
    let a = t.get(e);
    if (a === void 0) {
        if (l) {
            N(i.declaration, a = X.fromParent(s, new nt), n, e);
        } else {
            a = X.fromParent(s, new nt(r, e));
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
        this.view = f(_e).create().setLocation(f(vs));
    }
    valueChanged(t, e) {
        const i = this.$controller;
        const s = this.view.bindings;
        let n;
        let r = 0, l = 0;
        if (i.isActive && s != null) {
            n = X.fromParent(i.scope, t === void 0 ? {} : t);
            for (l = s.length; l > r; ++r) {
                s[r].bind(n);
            }
        }
    }
    attaching(t, e) {
        const {$controller: i, value: s} = this;
        const n = X.fromParent(i.scope, s === void 0 ? {} : s);
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

With.$au = {
    type: ce,
    name: "with",
    isTemplateController: true,
    bindables: [ "value" ]
};

var mn, gn;

class Switch {
    constructor() {
        this.cases = [];
        this.activeCases = [];
        this.promise = void 0;
        this.f = f(_e);
        this.l = f(vs);
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
        this.queue((() => this.qi(t)));
    }
    qi(t) {
        const e = t.isMatch(this.value);
        const i = this.activeCases;
        const s = i.length;
        if (!e) {
            if (s > 0 && i[0].id === t.id) {
                return this.Fi(null);
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
        return k(this.Fi(null, n), (() => {
            this.activeCases = n;
            return this.Hi(null);
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
        return k(this.activeCases.length > 0 ? this.Fi(t, i) : void 0, (() => {
            this.activeCases = i;
            if (i.length === 0) {
                return;
            }
            return this.Hi(t);
        }));
    }
    Hi(t) {
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
        return b(...i.map((e => e.activate(t, n))));
    }
    Fi(t, e = []) {
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
        return k(b(...i.reduce(((i, s) => {
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
        i = this.promise = k(k(e, t), (() => {
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
}

Switch.$au = {
    type: ce,
    name: "switch",
    isTemplateController: true,
    bindables: [ "value" ]
};

let pn = 0;

class Case {
    constructor() {
        this.id = ++pn;
        this.fallThrough = false;
        this.view = void 0;
        this.f = f(_e);
        this.ri = f(z);
        this.l = f(vs);
        this.Oi = f(E).scopeTo(`${this.constructor.name}-#${this.id}`);
    }
    link(t, e, i, s) {
        const n = t.parent;
        const r = n?.viewModel;
        if (r instanceof Switch) {
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
        this.Oi.debug("isMatch()");
        const e = this.value;
        if (isArray(e)) {
            if (this.yi === void 0) {
                this.yi = this.Vi(e);
            }
            return e.includes(t);
        }
        return e === t;
    }
    valueChanged(t, e) {
        if (isArray(t)) {
            this.yi?.unsubscribe(this);
            this.yi = this.Vi(t);
        } else if (this.yi !== void 0) {
            this.yi.unsubscribe(this);
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
        this.yi?.unsubscribe(this);
        this.view?.dispose();
        this.view = void 0;
    }
    linkToSwitch(t) {
        t.cases.push(this);
    }
    Vi(t) {
        const e = this.ri.getArrayObserver(t);
        e.subscribe(this);
        return e;
    }
    accept(t) {
        if (this.$controller.accept(t) === true) {
            return true;
        }
        return this.view?.accept(t);
    }
}

Case.$au = {
    type: "custom-attribute",
    name: "case",
    isTemplateController: true,
    bindables: [ "value", {
        name: "fallThrough",
        mode: It,
        set(t) {
            switch (t) {
              case "true":
                return true;

              case "false":
                return false;

              default:
                return !!t;
            }
        }
    } ]
};

class DefaultCase extends(gn = Case){
    linkToSwitch(t) {
        if (t.defaultCase !== void 0) {
            throw createMappedError(816);
        }
        t.defaultCase = this;
    }
}

mn = DefaultCase;

DefaultCase.$au = {
    ...Reflect.get(gn, "$au", mn),
    name: "default-case",
    bindables: [ "value" ]
};

class PromiseTemplateController {
    constructor() {
        this.preSettledTask = null;
        this.postSettledTask = null;
        this.f = f(_e);
        this.l = f(vs);
        this.p = f(ae);
        this.logger = f(E).scopeTo("promise.resolve");
    }
    link(t, e, i, s) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(t, e) {
        const i = this.view;
        const s = this.$controller;
        return k(i.activate(t, s, this.viewScope = X.fromParent(s.scope, {})), (() => this.swap(t)));
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
            void b(a = (this.preSettledTask = i.queueTask((() => b(s?.deactivate(t), n?.deactivate(t), r?.activate(t, l))), h)).result.catch((t => {
                if (!(t instanceof at)) throw t;
            })), e.then((c => {
                if (this.value !== e) {
                    return;
                }
                const fulfill = () => {
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => b(r?.deactivate(t), n?.deactivate(t), s?.activate(t, l, c))), h)).result;
                };
                if (this.preSettledTask.status === Bt) {
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
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => b(r?.deactivate(t), s?.deactivate(t), n?.activate(t, l, c))), h)).result;
                };
                if (this.preSettledTask.status === Bt) {
                    void a.then(reject);
                } else {
                    this.preSettledTask.cancel();
                    reject();
                }
            })));
        };
        if (this.postSettledTask?.status === Bt) {
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
}

PromiseTemplateController.$au = {
    type: ce,
    name: "promise",
    isTemplateController: true,
    bindables: [ "value" ]
};

class PendingTemplateController {
    constructor() {
        this.view = void 0;
        this.f = f(_e);
        this.l = f(vs);
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
}

PendingTemplateController.$au = {
    type: "custom-attribute",
    name: "pending",
    isTemplateController: true,
    bindables: {
        value: {
            mode: Et
        }
    }
};

class FulfilledTemplateController {
    constructor() {
        this.view = void 0;
        this.f = f(_e);
        this.l = f(vs);
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
}

FulfilledTemplateController.$au = {
    type: "custom-attribute",
    name: "then",
    isTemplateController: true,
    bindables: {
        value: {
            mode: _t
        }
    }
};

class RejectedTemplateController {
    constructor() {
        this.view = void 0;
        this.f = f(_e);
        this.l = f(vs);
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
}

RejectedTemplateController.$au = {
    type: "custom-attribute",
    name: "catch",
    isTemplateController: true,
    bindables: {
        value: {
            mode: _t
        }
    }
};

function getPromiseController(t) {
    const e = t.parent;
    const i = e?.viewModel;
    if (i instanceof PromiseTemplateController) {
        return i;
    }
    throw createMappedError(813);
}

let vn = class PromiseAttributePattern {
    "promise.resolve"(t, e) {
        return new AttrSyntax(t, e, "promise", "bind");
    }
};

vn = __decorate([ attributePattern({
    pattern: "promise.resolve",
    symbols: ""
}) ], vn);

let xn = class FulfilledAttributePattern {
    then(t, e) {
        return new AttrSyntax(t, e, "then", "from-view");
    }
};

xn = __decorate([ attributePattern({
    pattern: "then",
    symbols: ""
}) ], xn);

let wn = class RejectedAttributePattern {
    catch(t, e) {
        return new AttrSyntax(t, e, "catch", "from-view");
    }
};

wn = __decorate([ attributePattern({
    pattern: "catch",
    symbols: ""
}) ], wn);

class Focus {
    constructor() {
        this.$i = false;
        this.Ni = f(gs);
        this.p = f(ae);
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) {
            this.Wi();
        } else {
            this.$i = true;
        }
    }
    attached() {
        if (this.$i) {
            this.$i = false;
            this.Wi();
        }
        this.Ni.addEventListener("focus", this);
        this.Ni.addEventListener("blur", this);
    }
    detaching() {
        const t = this.Ni;
        t.removeEventListener("focus", this);
        t.removeEventListener("blur", this);
    }
    handleEvent(t) {
        if (t.type === "focus") {
            this.value = true;
        } else if (!this.ji) {
            this.value = false;
        }
    }
    Wi() {
        const t = this.Ni;
        const e = this.ji;
        const i = this.value;
        if (i && !e) {
            t.focus();
        } else if (!i && e) {
            t.blur();
        }
    }
    get ji() {
        return this.Ni === this.p.document.activeElement;
    }
}

Focus.$au = {
    type: ce,
    name: "focus",
    bindables: {
        value: {
            mode: Pt
        }
    }
};

class Portal {
    constructor() {
        this.position = "beforeend";
        this.strict = false;
        const t = f(_e);
        const e = f(vs);
        const i = f(ae);
        this.p = i;
        this.zi = i.document.createElement("div");
        (this.view = t.create()).setLocation(this.Ui = createLocation(i));
        setEffectiveParentNode(this.view.nodes, e);
    }
    attaching(t) {
        if (this.callbackContext == null) {
            this.callbackContext = this.$controller.scope.bindingContext;
        }
        const e = this.zi = this.Gi();
        this.Ki(e, this.position);
        return this.Xi(t, e);
    }
    detaching(t) {
        return this.Qi(t, this.zi);
    }
    targetChanged() {
        const {$controller: t} = this;
        if (!t.isActive) {
            return;
        }
        const e = this.Gi();
        if (this.zi === e) {
            return;
        }
        this.zi = e;
        const i = k(this.Qi(null, e), (() => {
            this.Ki(e, this.position);
            return this.Xi(null, e);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    positionChanged() {
        const {$controller: t, zi: e} = this;
        if (!t.isActive) {
            return;
        }
        const i = k(this.Qi(null, e), (() => {
            this.Ki(e, this.position);
            return this.Xi(null, e);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    Xi(t, e) {
        const {activating: i, callbackContext: s, view: n} = this;
        return k(i?.call(s, e, n), (() => this.Yi(t, e)));
    }
    Yi(t, e) {
        const {$controller: i, view: s} = this;
        if (t === null) {
            s.nodes.insertBefore(this.Ui);
        } else {
            return k(s.activate(t ?? s, i, i.scope), (() => this.Zi(e)));
        }
        return this.Zi(e);
    }
    Zi(t) {
        const {activated: e, callbackContext: i, view: s} = this;
        return e?.call(i, t, s);
    }
    Qi(t, e) {
        const {deactivating: i, callbackContext: s, view: n} = this;
        return k(i?.call(s, e, n), (() => this.Ji(t, e)));
    }
    Ji(t, e) {
        const {$controller: i, view: s} = this;
        if (t === null) {
            s.nodes.remove();
        } else {
            return k(s.deactivate(t, i), (() => this.ts(e)));
        }
        return this.ts(e);
    }
    ts(t) {
        const {deactivated: e, callbackContext: i, view: s} = this;
        return k(e?.call(i, t, s), (() => this.es()));
    }
    Gi() {
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
    es() {
        this.Ui.remove();
        this.Ui.$start.remove();
    }
    Ki(t, e) {
        const i = this.Ui;
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

Portal.$au = {
    type: ce,
    name: "portal",
    isTemplateController: true,
    bindables: [ {
        name: "target",
        primary: true
    }, "position", "activated", "activating", "callbackContext", {
        name: "renderContext",
        callback: "targetChanged"
    }, "strict", "deactivated", "deactivating" ]
};

let yn;

class AuSlot {
    constructor() {
        this.ss = null;
        this.rs = null;
        this.Xt = false;
        this.expose = null;
        this.slotchange = null;
        this.os = new Set;
        this.yi = null;
        const t = f(us);
        const e = f(vs);
        const i = f(oi);
        const s = f(Mi);
        const n = this.name = i.data.name;
        const r = i.projections?.[Me];
        const l = t.instruction?.projections?.[n];
        const a = t.controller.container;
        let h;
        let c;
        if (l == null) {
            c = a.createChild({
                inheritParentResources: true
            });
            h = s.getViewFactory(r ?? (yn ??= CustomElementDefinition.create({
                name: "au-slot-empty-template",
                template: "",
                needsCompile: false
            })), c);
            this.ls = false;
        } else {
            c = a.createChild();
            c.useResources(t.parent.controller.container);
            registerResolver(c, us, new v(void 0, t.parent));
            h = s.getViewFactory(l, c);
            this.ls = true;
            this.cs = a.getAll(Fe, false)?.filter((t => t.slotName === "*" || t.slotName === n)) ?? m;
        }
        this.us = (this.cs ??= m).length > 0;
        this.ds = t;
        this.view = h.create().setLocation(this.l = e);
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
        this.os.add(t);
    }
    unsubscribe(t) {
        this.os.delete(t);
    }
    binding(t, e) {
        this.ss = this.$controller.scope.parent;
        let i;
        if (this.ls) {
            i = this.ds.controller.scope.parent;
            (this.rs = X.fromParent(i, i.bindingContext)).overrideContext.$host = this.expose ?? this.ss.bindingContext;
        }
    }
    attaching(t, e) {
        return k(this.view.activate(t, this.$controller, this.ls ? this.rs : this.ss), (() => {
            if (this.us) {
                this.cs.forEach((t => t.watch(this)));
                this.hi();
                this.gs();
                this.Xt = true;
            }
        }));
    }
    detaching(t, e) {
        this.Xt = false;
        this.ps();
        this.cs.forEach((t => t.unwatch(this)));
        return this.view.deactivate(t, this.$controller);
    }
    exposeChanged(t) {
        if (this.ls && this.rs != null) {
            this.rs.overrideContext.$host = t;
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
    hi() {
        if (this.yi != null) {
            return;
        }
        const t = this.l;
        const e = t.parentElement;
        if (e == null) {
            return;
        }
        (this.yi = createMutationObserver(e, (e => {
            if (isMutationWithinLocation(t, e)) {
                this.gs();
            }
        }))).observe(e, {
            childList: true
        });
    }
    ps() {
        this.yi?.disconnect();
        this.yi = null;
    }
    gs() {
        const t = this.nodes;
        const e = new Set(this.os);
        let i;
        if (this.Xt) {
            this.slotchange?.call(void 0, this.name, t);
        }
        for (i of e) {
            i.handleSlotChange(this, t);
        }
    }
}

AuSlot.$au = {
    type: Bs,
    name: "au-slot",
    template: null,
    containerless: true,
    processContent(t, e, i) {
        i.name = t.getAttribute("name") ?? Me;
        let s = t.firstChild;
        let n = null;
        while (s !== null) {
            n = s.nextSibling;
            if (isElement(s) && s.hasAttribute(De)) {
                t.removeChild(s);
            }
            s = n;
        }
    },
    bindables: [ "expose", "slotchange" ]
};

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
        this.vs = void 0;
        this.tag = null;
        this.c = f(x);
        this.parent = f(cs);
        this.xs = f(gs);
        this.l = f(vs);
        this.p = f(ae);
        this.r = f(Mi);
        this.ws = f(oi);
        this.ys = f(_(CompositionContextFactory));
        this.it = f(li);
        this.J = f(us);
        this.ep = f(j);
        this.oL = f(z);
    }
    get composing() {
        return this.bs;
    }
    get composition() {
        return this.vs;
    }
    attaching(t, e) {
        return this.bs = k(this.queue(new ChangeInfo(this.template, this.component, this.model, void 0), t), (t => {
            if (this.ys.ks(t)) {
                this.bs = void 0;
            }
        }));
    }
    detaching(t) {
        const e = this.vs;
        const i = this.bs;
        this.ys.invalidate();
        this.vs = this.bs = void 0;
        return k(i, (() => e?.deactivate(t)));
    }
    propertyChanged(t) {
        if (t === "composing" || t === "composition") return;
        if (t === "model" && this.vs != null) {
            this.vs.update(this.model);
            return;
        }
        if (t === "tag" && this.vs?.controller.vmKind === Ji) {
            return;
        }
        this.bs = k(this.bs, (() => k(this.queue(new ChangeInfo(this.template, this.component, this.model, t), void 0), (t => {
            if (this.ys.ks(t)) {
                this.bs = void 0;
            }
        }))));
    }
    queue(t, e) {
        const i = this.ys;
        const s = this.vs;
        return k(i.create(t), (t => {
            if (i.ks(t)) {
                return k(this.compose(t), (n => {
                    if (i.ks(t)) {
                        return k(n.activate(e), (() => {
                            if (i.ks(t)) {
                                this.vs = n;
                                return k(s?.deactivate(e), (() => t));
                            } else {
                                return k(n.controller.deactivate(n.controller, this.$controller), (() => {
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
        const {Cs: e, As: i, Bs: s} = t.change;
        const {c: n, $controller: r, l: l, ws: a} = this;
        const h = this.Ss(this.J.controller.container, i);
        const c = n.createChild();
        const u = this.p.document.createElement(h == null ? this.tag ?? "div" : h.name);
        l.parentNode.insertBefore(u, l);
        let f;
        if (h == null) {
            f = this.tag == null ? convertToRenderLocation(u) : null;
        } else {
            f = h.containerless ? convertToRenderLocation(u) : null;
        }
        const removeCompositionHost = () => {
            u.remove();
            if (f != null) {
                let t = f.$start.nextSibling;
                let e = null;
                while (t !== null && t !== f) {
                    e = t.nextSibling;
                    t.remove();
                    t = e;
                }
                f.$start?.remove();
                f.remove();
            }
        };
        const d = this.Ts(c, typeof i === "string" ? h.Type : i, u, f);
        const compose = () => {
            const i = a.captures ?? m;
            if (h !== null) {
                const e = h.capture;
                const [s, n] = i.reduce(((t, i) => {
                    const s = !(i.target in h.bindables) && (e === true || isFunction(e) && !!e(i.target));
                    t[s ? 0 : 1].push(i);
                    return t;
                }), [ [], [] ]);
                const l = Controller.$el(c, d, u, {
                    projections: a.projections,
                    captures: s
                }, h, f);
                this.Rs(u, h, n).forEach((t => l.addBinding(t)));
                return new CompositionController(l, (t => l.activate(t ?? l, r, r.scope.parent)), (t => k(l.deactivate(t ?? l, r), removeCompositionHost)), (t => d.activate?.(t)), t);
            } else {
                const s = CustomElementDefinition.create({
                    name: Is.generateName(),
                    template: e
                });
                const n = this.r.getViewFactory(s, c);
                const l = Controller.$view(n, r);
                const a = this.scopeBehavior === "auto" ? X.fromParent(this.parent.scope, d) : X.create(d);
                l.setHost(u);
                if (f == null) {
                    this.Rs(u, s, i).forEach((t => l.addBinding(t)));
                } else {
                    l.setLocation(f);
                }
                return new CompositionController(l, (t => l.activate(t ?? l, r, a)), (t => k(l.deactivate(t ?? l, r), removeCompositionHost)), (t => d.activate?.(t)), t);
            }
        };
        if ("activate" in d) {
            return k(d.activate(s), (() => compose()));
        } else {
            return compose();
        }
    }
    Ts(t, e, i, s) {
        if (e == null) {
            return new EmptyComponent;
        }
        if (typeof e === "object") {
            return e;
        }
        const n = this.p;
        registerHostNode(t, n, i);
        registerResolver(t, vs, new v("IRenderLocation", s));
        const r = t.invoke(e);
        registerResolver(t, e, new v("au-compose.component", r));
        return r;
    }
    Ss(t, e) {
        if (typeof e === "string") {
            const i = Is.find(t, e);
            if (i == null) {
                throw createMappedError(806, e);
            }
            return i;
        }
        const i = isFunction(e) ? e : e?.constructor;
        return Is.isType(i) ? Is.getDefinition(i) : null;
    }
    Rs(t, e, i) {
        const s = new HydrationContext(this.$controller, {
            projections: null,
            captures: i
        }, this.J.parent);
        return SpreadBinding.create(s, t, e, this.r, this.it, this.p, this.ep, this.oL);
    }
}

AuCompose.$au = {
    type: Bs,
    name: "au-compose",
    capture: true,
    containerless: true,
    bindables: [ "template", "component", "model", {
        name: "scopeBehavior",
        set: t => {
            if (t === "scoped" || t === "auto") {
                return t;
            }
            throw createMappedError(805, t);
        }
    }, {
        name: "composing",
        mode: _t
    }, {
        name: "composition",
        mode: _t
    }, "tag" ]
};

class EmptyComponent {}

class CompositionContextFactory {
    constructor() {
        this.id = 0;
    }
    ks(t) {
        return t.id === this.id;
    }
    create(t) {
        return k(t.load(), (t => new CompositionContext(++this.id, t)));
    }
    invalidate() {
        this.id++;
    }
}

class ChangeInfo {
    constructor(t, e, i, s) {
        this.Cs = t;
        this.As = e;
        this.Bs = i;
        this.Is = s;
    }
    load() {
        if (isPromise(this.Cs) || isPromise(this.As)) {
            return Promise.all([ this.Cs, this.As ]).then((([t, e]) => new LoadedChangeInfo(t, e, this.Bs, this.Is)));
        } else {
            return new LoadedChangeInfo(this.Cs, this.As, this.Bs, this.Is);
        }
    }
}

class LoadedChangeInfo {
    constructor(t, e, i, s) {
        this.Cs = t;
        this.As = e;
        this.Bs = i;
        this.Is = s;
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

const bn = /*@__PURE__*/ zt("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw createMappedError(99, "sanitize");
    }
})));

class SanitizeValueConverter {
    constructor() {
        this.Es = f(bn);
    }
    toView(t) {
        if (t == null) {
            return null;
        }
        return this.Es.sanitize(t);
    }
}

SanitizeValueConverter.$au = {
    type: ge,
    name: "sanitize"
};

const kn = /*@__PURE__*/ zt("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const Cn = {};

class TemplateElementFactory {
    constructor() {
        this.p = f(ae);
        this.Cs = this.t();
    }
    t() {
        return this.p.document.createElement("template");
    }
    createTemplate(t) {
        if (isString(t)) {
            let e = Cn[t];
            if (e === void 0) {
                const i = this.Cs;
                i.innerHTML = t;
                const s = i.content.firstElementChild;
                if (needsWrapping(s)) {
                    this.Cs = this.t();
                    e = i;
                } else {
                    i.content.removeChild(s);
                    e = s;
                }
                Cn[t] = e;
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
        this._s = f(Pn);
        this.debug = false;
        this.resolveResources = true;
    }
    static register(t) {
        t.register(Ut(this, this), Gt(this, li));
    }
    compile(t, e, i) {
        if (t.template == null || t.needsCompile === false) {
            return t;
        }
        i ??= Tn;
        const s = new CompilationContext(t, e, i, null, null, void 0);
        const n = isString(t.template) || !t.enhance ? s.Ps.createTemplate(t.template) : t.template;
        const r = n.nodeName === An && n.content != null;
        const l = r ? n.content : n;
        const a = Fn.findAll(e);
        const h = a.length;
        let c = 0;
        if (h > 0) {
            while (h > c) {
                a[c].compiling?.(n);
                ++c;
            }
        }
        if (n.hasAttribute(Dn)) {
            throw createMappedError(701, t);
        }
        this.Ls(l, s);
        this.Ms(l, s);
        const u = CustomElementDefinition.create({
            ...t,
            name: t.name || Ts(),
            dependencies: (t.dependencies ?? m).concat(s.deps ?? m),
            instructions: s.rows,
            surrogates: r ? this.Ds(n, s) : m,
            template: n,
            hasSlots: s.hasSlot,
            needsCompile: false
        });
        if (s.deps != null) {
            const t = [ u.Type, ...u.dependencies, ...s.deps ];
            for (const e of s.deps) {
                getElementDefinition(e).dependencies.push(...t.filter((t => t !== e)));
            }
        }
        return u;
    }
    compileSpread(t, e, i, s, n) {
        const r = new CompilationContext(t, i, Tn, null, null, void 0);
        const l = [];
        const a = n ?? r.qs(s.nodeName.toLowerCase());
        const h = a !== null;
        const c = r.ep;
        const u = e.length;
        let f = 0;
        let d;
        let m = null;
        let g;
        let p;
        let v;
        let x;
        let w;
        let y = null;
        let b;
        let k;
        let C;
        let A;
        for (;u > f; ++f) {
            d = e[f];
            C = d.target;
            A = d.rawValue;
            y = r.Fs(d);
            if (y !== null && y.ignoreAttr) {
                In.node = s;
                In.attr = d;
                In.bindable = null;
                In.def = null;
                l.push(y.build(In, r.ep, r.m));
                continue;
            }
            m = r.Hs(C);
            if (m !== null) {
                if (m.isTemplateController) {
                    throw createMappedError(9998, C);
                }
                v = this._s.get(m);
                k = m.noMultiBindings === false && y === null && hasInlineBindings(A);
                if (k) {
                    p = this.Os(s, A, m, r);
                } else {
                    w = v.primary;
                    if (y === null) {
                        b = c.parse(A, yt);
                        p = [ b === null ? new SetPropertyInstruction(A, w.name) : new InterpolationInstruction(b, w.name) ];
                    } else {
                        In.node = s;
                        In.attr = d;
                        In.bindable = w;
                        In.def = m;
                        p = [ y.build(In, r.ep, r.m) ];
                    }
                }
                (g ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? m : m.name, m.aliases != null && m.aliases.includes(C) ? C : void 0, p));
                continue;
            }
            if (y === null) {
                b = c.parse(A, yt);
                if (h) {
                    v = this._s.get(a);
                    x = v.attrs[C];
                    if (x !== void 0) {
                        b = c.parse(A, yt);
                        l.push(new SpreadElementPropBindingInstruction(b == null ? new SetPropertyInstruction(A, x.name) : new InterpolationInstruction(b, x.name)));
                        continue;
                    }
                }
                if (b != null) {
                    l.push(new InterpolationInstruction(b, r.m.map(s, C) ?? T(C)));
                } else {
                    switch (C) {
                      case "class":
                        l.push(new SetClassAttributeInstruction(A));
                        break;

                      case "style":
                        l.push(new SetStyleAttributeInstruction(A));
                        break;

                      default:
                        l.push(new SetAttributeInstruction(A, C));
                    }
                }
            } else {
                if (h) {
                    v = this._s.get(a);
                    x = v.attrs[C];
                    if (x !== void 0) {
                        In.node = s;
                        In.attr = d;
                        In.bindable = x;
                        In.def = a;
                        l.push(new SpreadElementPropBindingInstruction(y.build(In, r.ep, r.m)));
                        continue;
                    }
                }
                In.node = s;
                In.attr = d;
                In.bindable = null;
                In.def = null;
                l.push(y.build(In, r.ep, r.m));
            }
        }
        resetCommandBuildInfo();
        if (g != null) {
            return g.concat(l);
        }
        return l;
    }
    Ds(t, e) {
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
        let x;
        let w;
        let y;
        let b;
        for (;r > l; ++l) {
            a = s[l];
            h = a.name;
            c = a.value;
            u = e.Oe.parse(h, c);
            y = u.target;
            b = u.rawValue;
            if (En[y]) {
                throw createMappedError(702, h);
            }
            v = e.Fs(u);
            if (v !== null && v.ignoreAttr) {
                In.node = t;
                In.attr = u;
                In.bindable = null;
                In.def = null;
                i.push(v.build(In, e.ep, e.m));
                continue;
            }
            f = e.Hs(y);
            if (f !== null) {
                if (f.isTemplateController) {
                    throw createMappedError(703, y);
                }
                g = this._s.get(f);
                w = f.noMultiBindings === false && v === null && hasInlineBindings(b);
                if (w) {
                    m = this.Os(t, b, f, e);
                } else {
                    p = g.primary;
                    if (v === null) {
                        x = n.parse(b, yt);
                        m = x === null ? b === "" ? [] : [ new SetPropertyInstruction(b, p.name) ] : [ new InterpolationInstruction(x, p.name) ];
                    } else {
                        In.node = t;
                        In.attr = u;
                        In.bindable = p;
                        In.def = f;
                        m = [ v.build(In, e.ep, e.m) ];
                    }
                }
                t.removeAttribute(h);
                --l;
                --r;
                (d ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? f : f.name, f.aliases != null && f.aliases.includes(y) ? y : void 0, m));
                continue;
            }
            if (v === null) {
                x = n.parse(b, yt);
                if (x != null) {
                    t.removeAttribute(h);
                    --l;
                    --r;
                    i.push(new InterpolationInstruction(x, e.m.map(t, y) ?? T(y)));
                } else {
                    switch (h) {
                      case "class":
                        i.push(new SetClassAttributeInstruction(b));
                        break;

                      case "style":
                        i.push(new SetStyleAttributeInstruction(b));
                        break;

                      default:
                        i.push(new SetAttributeInstruction(b, h));
                    }
                }
            } else {
                In.node = t;
                In.attr = u;
                In.bindable = null;
                In.def = null;
                i.push(v.build(In, e.ep, e.m));
            }
        }
        resetCommandBuildInfo();
        if (d != null) {
            return d.concat(i);
        }
        return i;
    }
    Ms(t, e) {
        switch (t.nodeType) {
          case 1:
            switch (t.nodeName) {
              case "LET":
                return this.Vs(t, e);

              default:
                return this.$s(t, e);
            }

          case 3:
            return this.Ns(t, e);

          case 11:
            {
                let i = t.firstChild;
                while (i !== null) {
                    i = this.Ms(i, e);
                }
                break;
            }
        }
        return t.nextSibling;
    }
    Vs(t, e) {
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
            c = e.Oe.parse(u, f);
            m = c.target;
            g = c.rawValue;
            d = e.Fs(c);
            if (d !== null) {
                if (c.command === "bind") {
                    n.push(new LetBindingInstruction(r.parse(g, Ct), T(m)));
                } else {
                    throw createMappedError(704, c);
                }
                continue;
            }
            p = r.parse(g, yt);
            n.push(new LetBindingInstruction(p === null ? new rt(g) : p, T(m)));
        }
        e.rows.push([ new HydrateLetElementInstruction(n, l) ]);
        return this.Ws(t, e).nextSibling;
    }
    $s(t, e) {
        const i = t.nextSibling;
        const n = (t.getAttribute("as-element") ?? t.nodeName).toLowerCase();
        const r = e.qs(n);
        const l = r !== null;
        const a = l && r.shadowOptions != null;
        const h = r?.capture;
        const c = h != null && typeof h !== "boolean";
        const u = h ? [] : m;
        const f = e.ep;
        const d = this.debug ? s : () => {
            t.removeAttribute(y);
            --x;
            --v;
        };
        let g = t.attributes;
        let p;
        let v = g.length;
        let x = 0;
        let w;
        let y;
        let b;
        let k;
        let C;
        let A;
        let B = null;
        let S = false;
        let R;
        let I;
        let E;
        let _;
        let P;
        let L;
        let M;
        let D = null;
        let q;
        let F;
        let H;
        let O;
        let V = true;
        let $ = false;
        let N = false;
        let W = false;
        let j;
        if (n === "slot") {
            if (e.root.def.shadowOptions == null) {
                throw createMappedError(717, e.root.def.name);
            }
            e.root.hasSlot = true;
        }
        if (l) {
            j = {};
            V = r.processContent?.call(r.Type, t, e.p, j);
            g = t.attributes;
            v = g.length;
        }
        for (;v > x; ++x) {
            w = g[x];
            y = w.name;
            b = w.value;
            switch (y) {
              case "as-element":
              case "containerless":
                d();
                if (!$) {
                    $ = y === "containerless";
                }
                continue;
            }
            k = e.Oe.parse(y, b);
            D = e.Fs(k);
            H = k.target;
            O = k.rawValue;
            if (h && (!c || c && h(H))) {
                if (D != null && D.ignoreAttr) {
                    d();
                    u.push(k);
                    continue;
                }
                N = H !== De && H !== "slot";
                if (N) {
                    q = this._s.get(r);
                    if (q.attrs[H] == null && !e.Hs(H)?.isTemplateController) {
                        d();
                        u.push(k);
                        continue;
                    }
                }
            }
            if (D?.ignoreAttr) {
                In.node = t;
                In.attr = k;
                In.bindable = null;
                In.def = null;
                (C ??= []).push(D.build(In, e.ep, e.m));
                d();
                continue;
            }
            if (l) {
                q = this._s.get(r);
                R = q.attrs[H];
                if (R !== void 0) {
                    if (D === null) {
                        L = f.parse(O, yt);
                        (A ??= []).push(L == null ? new SetPropertyInstruction(O, R.name) : new InterpolationInstruction(L, R.name));
                    } else {
                        In.node = t;
                        In.attr = k;
                        In.bindable = R;
                        In.def = r;
                        (A ??= []).push(D.build(In, e.ep, e.m));
                    }
                    d();
                    continue;
                }
            }
            B = e.Hs(H);
            if (B !== null) {
                q = this._s.get(B);
                S = B.noMultiBindings === false && D === null && hasInlineBindings(O);
                if (S) {
                    E = this.Os(t, O, B, e);
                } else {
                    F = q.primary;
                    if (D === null) {
                        L = f.parse(O, yt);
                        E = L === null ? O === "" ? [] : [ new SetPropertyInstruction(O, F.name) ] : [ new InterpolationInstruction(L, F.name) ];
                    } else {
                        In.node = t;
                        In.attr = k;
                        In.bindable = F;
                        In.def = B;
                        E = [ D.build(In, e.ep, e.m) ];
                    }
                }
                d();
                if (B.isTemplateController) {
                    (_ ??= []).push(new HydrateTemplateController(Rn, this.resolveResources ? B : B.name, void 0, E));
                } else {
                    (I ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? B : B.name, B.aliases != null && B.aliases.includes(H) ? H : void 0, E));
                }
                continue;
            }
            if (D === null) {
                L = f.parse(O, yt);
                if (L != null) {
                    d();
                    (C ??= []).push(new InterpolationInstruction(L, e.m.map(t, H) ?? T(H)));
                }
                continue;
            }
            In.node = t;
            In.attr = k;
            In.bindable = null;
            In.def = null;
            (C ??= []).push(D.build(In, e.ep, e.m));
            d();
        }
        resetCommandBuildInfo();
        if (this.js(t, C) && C != null && C.length > 1) {
            this.zs(t, C);
        }
        if (l) {
            M = new HydrateElementInstruction(this.resolveResources ? r : r.name, A ?? m, null, $, u, j);
        }
        if (C != null || M != null || I != null) {
            p = m.concat(M ?? m, I ?? m, C ?? m);
            W = true;
        }
        let z;
        if (_ != null) {
            v = _.length - 1;
            x = v;
            P = _[x];
            let i;
            if (isMarker(t)) {
                i = e.t();
                appendManyToTemplate(i, [ e.ct(), e.Us(Bn), e.Us(Sn) ]);
            } else {
                this.Gs(t, e);
                if (t.nodeName === "TEMPLATE") {
                    i = t;
                } else {
                    i = e.t();
                    appendToTemplate(i, t);
                }
            }
            const s = i;
            const h = e.Ks(p == null ? [] : [ p ]);
            let c;
            let u;
            let f = false;
            let d;
            let m;
            let g;
            let w;
            let y;
            let b;
            let k = 0, C = 0;
            let A = t.firstChild;
            let B = false;
            if (V !== false) {
                while (A !== null) {
                    u = isElement(A) ? A.getAttribute(De) : null;
                    f = u !== null || l && !a;
                    c = A.nextSibling;
                    if (f) {
                        if (!l) {
                            throw createMappedError(706, u, n);
                        }
                        A.removeAttribute?.(De);
                        B = isTextNode(A) && A.textContent.trim() === "";
                        if (!B) {
                            ((m ??= {})[u || Me] ??= []).push(A);
                        }
                        t.removeChild(A);
                    }
                    A = c;
                }
            }
            if (m != null) {
                d = {};
                for (u in m) {
                    i = e.t();
                    g = m[u];
                    for (k = 0, C = g.length; C > k; ++k) {
                        w = g[k];
                        if (w.nodeName === "TEMPLATE") {
                            if (w.attributes.length > 0) {
                                appendToTemplate(i, w);
                            } else {
                                appendToTemplate(i, w.content);
                            }
                        } else {
                            appendToTemplate(i, w);
                        }
                    }
                    b = e.Ks();
                    this.Ms(i.content, b);
                    d[u] = CustomElementDefinition.create({
                        name: Ts(),
                        template: i,
                        instructions: b.rows,
                        needsCompile: false
                    });
                }
                M.projections = d;
            }
            if (W) {
                if (l && ($ || r.containerless)) {
                    this.Gs(t, e);
                } else {
                    this.Ws(t, e);
                }
            }
            z = !l || !r.containerless && !$ && V !== false;
            if (z) {
                if (t.nodeName === An) {
                    this.Ms(t.content, h);
                } else {
                    A = t.firstChild;
                    while (A !== null) {
                        A = this.Ms(A, h);
                    }
                }
            }
            P.def = CustomElementDefinition.create({
                name: Ts(),
                template: s,
                instructions: h.rows,
                needsCompile: false
            });
            while (x-- > 0) {
                P = _[x];
                i = e.t();
                y = e.ct();
                appendManyToTemplate(i, [ y, e.Us(Bn), e.Us(Sn) ]);
                P.def = CustomElementDefinition.create({
                    name: Ts(),
                    template: i,
                    needsCompile: false,
                    instructions: [ [ _[x + 1] ] ]
                });
            }
            e.rows.push([ P ]);
        } else {
            if (p != null) {
                e.rows.push(p);
            }
            let i = t.firstChild;
            let s;
            let h;
            let c = false;
            let u = null;
            let f;
            let d;
            let m;
            let g;
            let v;
            let x = false;
            let w = 0, y = 0;
            if (V !== false) {
                while (i !== null) {
                    h = isElement(i) ? i.getAttribute(De) : null;
                    c = h !== null || l && !a;
                    s = i.nextSibling;
                    if (c) {
                        if (!l) {
                            throw createMappedError(706, h, n);
                        }
                        i.removeAttribute?.(De);
                        x = isTextNode(i) && i.textContent.trim() === "";
                        if (!x) {
                            ((f ??= {})[h || Me] ??= []).push(i);
                        }
                        t.removeChild(i);
                    }
                    i = s;
                }
            }
            if (f != null) {
                u = {};
                for (h in f) {
                    g = e.t();
                    d = f[h];
                    for (w = 0, y = d.length; y > w; ++w) {
                        m = d[w];
                        if (m.nodeName === An) {
                            if (m.attributes.length > 0) {
                                appendToTemplate(g, m);
                            } else {
                                appendToTemplate(g, m.content);
                            }
                        } else {
                            appendToTemplate(g, m);
                        }
                    }
                    v = e.Ks();
                    this.Ms(g.content, v);
                    u[h] = CustomElementDefinition.create({
                        name: Ts(),
                        template: g,
                        instructions: v.rows,
                        needsCompile: false
                    });
                }
                M.projections = u;
            }
            if (W) {
                if (l && ($ || r.containerless)) {
                    this.Gs(t, e);
                } else {
                    this.Ws(t, e);
                }
            }
            z = !l || !r.containerless && !$ && V !== false;
            if (z && t.childNodes.length > 0) {
                i = t.firstChild;
                while (i !== null) {
                    i = this.Ms(i, e);
                }
            }
        }
        return i;
    }
    Ns(t, e) {
        const i = t.parentNode;
        const s = e.ep.parse(t.textContent, yt);
        const n = t.nextSibling;
        let r;
        let l;
        let a;
        let h;
        let c;
        if (s !== null) {
            ({parts: r, expressions: l} = s);
            if (c = r[0]) {
                insertBefore(i, e.Xs(c), t);
            }
            for (a = 0, h = l.length; h > a; ++a) {
                insertManyBefore(i, t, [ e.ct(), e.Xs(" ") ]);
                if (c = r[a + 1]) {
                    insertBefore(i, e.Xs(c), t);
                }
                e.rows.push([ new TextBindingInstruction(l[a]) ]);
            }
            i.removeChild(t);
        }
        return n;
    }
    Os(t, e, i, s) {
        const n = this._s.get(i);
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
                d = s.Oe.parse(a, h);
                m = s.Fs(d);
                g = n.attrs[d.target];
                if (g == null) {
                    throw createMappedError(707, d.target, i.name);
                }
                if (m === null) {
                    f = s.ep.parse(h, yt);
                    l.push(f === null ? new SetPropertyInstruction(h, g.name) : new InterpolationInstruction(f, g.name));
                } else {
                    In.node = t;
                    In.attr = d;
                    In.bindable = g;
                    In.def = i;
                    l.push(m.build(In, s.ep, s.m));
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
    Ls(t, e) {
        const i = e.root.def.name;
        const s = t;
        const n = P(s.querySelectorAll("template[as-custom-element]"));
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
            const a = P(r.querySelectorAll("bindable"));
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
                const l = P(e.attributes).filter((t => !Mn.includes(t.name)));
                if (l.length > 0) ;
                e.remove();
                t[i] = {
                    attribute: s ?? void 0,
                    mode: getBindingMode(e)
                };
                return t;
            }), {});
            class LocalTemplateType {}
            wt(LocalTemplateType, "name", {
                value: n
            });
            e.Qs(defineElement({
                name: n,
                template: t,
                bindables: u
            }, LocalTemplateType));
            s.removeChild(t);
        }
    }
    js(t, e) {
        const i = t.nodeName;
        return i === "INPUT" && _n[t.type] === 1 || i === "SELECT" && (t.hasAttribute("multiple") || e?.some((t => t.type === ze && t.to === "multiple")));
    }
    zs(t, e) {
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
    Ws(t, e) {
        insertBefore(t.parentNode, e.Us("au*"), t);
        return t;
    }
    Gs(t, e) {
        if (isMarker(t)) {
            return t;
        }
        const i = t.parentNode;
        const s = e.ct();
        insertManyBefore(i, t, [ s, e.Us(Bn), e.Us(Sn) ]);
        i.removeChild(t);
        return s;
    }
}

const An = "TEMPLATE";

const Bn = "au-start";

const Sn = "au-end";

const isMarker = t => t.nodeValue === "au*";

class CompilationContext {
    constructor(t, e, i, s, n, r) {
        this.hasSlot = false;
        const l = s !== null;
        this.c = e;
        this.root = n === null ? this : n;
        this.def = t;
        this.ci = i;
        this.parent = s;
        this.Ys = l ? s.Ys : e.get(Ln);
        this.Ps = l ? s.Ps : e.get(kn);
        this.Oe = l ? s.Oe : e.get(Ds);
        this.ep = l ? s.ep : e.get(j);
        this.m = l ? s.m : e.get(Ks);
        this.Oi = l ? s.Oi : e.get(E);
        this.p = l ? s.p : e.get(ae);
        this.localEls = l ? s.localEls : new Set;
        this.rows = r ?? [];
    }
    Qs(t) {
        (this.root.deps ??= []).push(t);
        this.root.c.register(t);
        return t;
    }
    Xs(t) {
        return createText(this.p, t);
    }
    Us(t) {
        return createComment(this.p, t);
    }
    ct() {
        return this.Us("au*");
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
    qs(t) {
        return this.Ys.el(this.c, t);
    }
    Hs(t) {
        return this.Ys.attr(this.c, t);
    }
    Ks(t) {
        return new CompilationContext(this.def, this.c, this.ci, this, this.root, t);
    }
    Fs(t) {
        const e = t.command;
        if (e === null) {
            return null;
        }
        return this.Ys.command(this.c, e);
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
    In.node = In.attr = In.bindable = In.def = null;
};

const Tn = {
    projections: null
};

const Rn = {
    name: "unnamed"
};

const In = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const En = mt(createLookup(), {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
});

const _n = {
    checkbox: 1,
    radio: 1
};

const Pn = /*@__PURE__*/ zt("IBindablesInfoResolver", (t => {
    class BindablesInfoResolver {
        constructor() {
            this.j = new WeakMap;
        }
        get(t) {
            let e = this.j.get(t);
            if (e == null) {
                const i = t.bindables;
                const s = createLookup();
                let n;
                let r;
                let l = false;
                let a;
                let h;
                for (r in i) {
                    n = i[r];
                    h = n.attribute;
                    if (n.primary === true) {
                        if (l) {
                            throw createMappedError(714, t);
                        }
                        l = true;
                        a = n;
                    } else if (!l && a == null) {
                        a = n;
                    }
                    s[h] = BindableDefinition.create(r, t.Type, n);
                }
                if (n == null && t.kind === "attribute") {
                    a = s.value = BindableDefinition.create("value", t.Type, {
                        mode: t.defaultBindingMode != null ? t.defaultBindingMode : Lt
                    });
                }
                this.j.set(t, e = new BindablesInfo(s, i, a ?? null));
            }
            return e;
        }
    }
    class BindablesInfo {
        constructor(t, e, i) {
            this.attrs = t;
            this.bindables = e;
            this.primary = i;
        }
    }
    return t.singleton(BindablesInfoResolver);
}));

const Ln = /*@__PURE__*/ zt("IResourceResolver", (t => t.singleton(ResourceResolver)));

class ResourceResolver {
    constructor() {
        this.Zs = new WeakMap;
        this.Js = new WeakMap;
    }
    el(t, e) {
        let i = this.Zs.get(t);
        if (i == null) {
            this.Zs.set(t, i = new RecordCache);
        }
        return e in i.element ? i.element[e] : i.element[e] = Is.find(t, e);
    }
    attr(t, e) {
        let i = this.Zs.get(t);
        if (i == null) {
            this.Zs.set(t, i = new RecordCache);
        }
        return e in i.attr ? i.attr[e] : i.attr[e] = fe.find(t, e);
    }
    command(t, e) {
        let i = this.Js.get(t);
        if (i == null) {
            this.Js.set(t, i = createLookup());
        }
        let s = i[e];
        if (s === void 0) {
            let n = this.Zs.get(t);
            if (n == null) {
                this.Zs.set(t, n = new RecordCache);
            }
            const r = e in n.command ? n.command[e] : n.command[e] = Us.find(t, e);
            if (r == null) {
                throw createMappedError(713, e);
            }
            i[e] = s = Us.get(t, e);
        }
        return s;
    }
}

class RecordCache {
    constructor() {
        this.element = createLookup();
        this.attr = createLookup();
        this.command = createLookup();
    }
}

const Mn = dt([ "name", "attribute", "mode" ]);

const Dn = "as-custom-element";

const processTemplateName = (t, e, i) => {
    const s = e.getAttribute(Dn);
    if (s === null || s === "") {
        throw createMappedError(715, t);
    }
    if (i.has(s)) {
        throw createMappedError(716, s, t);
    } else {
        i.add(s);
        e.removeAttribute(Dn);
    }
    return s;
};

const getBindingMode = t => {
    switch (t.getAttribute("mode")) {
      case "oneTime":
        return It;

      case "toView":
        return Et;

      case "fromView":
        return _t;

      case "twoWay":
        return Pt;

      case "default":
      default:
        return Lt;
    }
};

const qn = /*@__PURE__*/ zt("ITemplateCompilerHooks");

const Fn = dt({
    name: /*@__PURE__*/ u("compiler-hooks"),
    define(t) {
        return g.define(t, (function(t) {
            Ut(qn, this).register(t);
        }));
    },
    findAll(t) {
        return t.get(L(qn));
    }
});

const templateCompilerHooks = t => {
    return t === void 0 ? decorator : decorator(t);
    function decorator(t) {
        return Fn.define(t);
    }
};

class Show {
    constructor() {
        this.el = f(gs);
        this.p = f(ae);
        this.tn = false;
        this.I = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.I = null;
            if (Boolean(this.value) !== this.en) {
                if (this.en === this.sn) {
                    this.en = !this.sn;
                    this.$val = this.el.style.getPropertyValue("display");
                    this.$prio = this.el.style.getPropertyPriority("display");
                    this.el.style.setProperty("display", "none", "important");
                } else {
                    this.en = this.sn;
                    this.el.style.setProperty("display", this.$val, this.$prio);
                    if (this.el.getAttribute("style") === "") {
                        this.el.removeAttribute("style");
                    }
                }
            }
        };
        const t = f(oi);
        this.en = this.sn = t.alias !== "hide";
    }
    binding() {
        this.tn = true;
        this.update();
    }
    detaching() {
        this.tn = false;
        this.I?.cancel();
        this.I = null;
    }
    valueChanged() {
        if (this.tn && this.I === null) {
            this.I = this.p.domWriteQueue.queueTask(this.update);
        }
    }
}

Show.$au = {
    type: ce,
    name: "show",
    bindables: [ "value" ],
    aliases: [ "hide" ]
};

const Hn = [ TemplateCompiler, ot, NodeObserverLocator ];

const On = [ Os, Hs, Ws, Vs, Ee ];

const Vn = [ Ns, $s ];

const $n = [ DefaultBindingCommand, OneTimeBindingCommand, FromViewBindingCommand, ToViewBindingCommand, TwoWayBindingCommand, ForBindingCommand, RefBindingCommand, TriggerBindingCommand, CaptureBindingCommand, ClassBindingCommand, StyleBindingCommand, AttrBindingCommand, SpreadBindingCommand ];

const Nn = [ DebounceBindingBehavior, OneTimeBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, SignalBindingBehavior, ThrottleBindingBehavior, TwoWayBindingBehavior, SanitizeValueConverter, If, Else, Repeat, With, Switch, Case, DefaultCase, PromiseTemplateController, PendingTemplateController, FulfilledTemplateController, RejectedTemplateController, vn, xn, wn, AttrBindingBehavior, SelfBindingBehavior, UpdateTriggerBindingBehavior, AuCompose, Portal, Focus, Show, AuSlot ];

const Wn = [ pi, vi, mi, gi, hi, ci, ui, fi, di, yi, Bi, bi, ki, Ci, Ai, xi, Si ];

const jn = /*@__PURE__*/ createConfiguration(s);

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
            return e.register(Kt(K, i.coercingOptions), ...Hn, ...Nn, ...On, ...$n, ...Wn);
        },
        customize(e) {
            return createConfiguration(e ?? t);
        }
    };
}

function children(t, e) {
    if (!Gn) {
        Gn = true;
        W(ChildrenBinding);
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
        let l = Is.getAnnotation(r, s);
        if (l == null) {
            Is.annotate(r, s, l = []);
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
    constructor(t, e, i, s = defaultChildQuery, n = defaultChildFilter, r = defaultChildMap, l = zn) {
        this.nn = void 0;
        this.X = defaultChildQuery;
        this.rn = defaultChildFilter;
        this.on = defaultChildMap;
        this.isBound = false;
        this._ = t;
        this.obj = e;
        this.cb = i;
        this.X = s;
        this.rn = n;
        this.on = r;
        this.V = l;
        this.yi = createMutationObserver(this.xs = t.host, (() => {
            this.ln();
        }));
    }
    getValue() {
        return this.isBound ? this.nn : this.an();
    }
    setValue(t) {}
    bind() {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        this.yi.observe(this.xs, this.V);
        this.nn = this.an();
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.yi.disconnect();
        this.nn = m;
    }
    ln() {
        this.nn = this.an();
        this.cb?.call(this.obj);
        this.subs.notify(this.nn, undefined);
    }
    get() {
        throw createMappedError(99, "get");
    }
    an() {
        return filterChildren(this._, this.X, this.rn, this.on);
    }
}

const zn = {
    childList: true
};

const defaultChildQuery = t => t.host.childNodes;

const defaultChildFilter = (t, e, i) => !!i;

const defaultChildMap = (t, e, i) => i;

const Un = {
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
        h = findElementControllerFor(a, Un);
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
        Kt(de, this).register(t);
    }
    hydrating(t, e) {
        const i = this.Y;
        const s = new ChildrenBinding(e, t, t[i.callback ?? `${ct(i.name)}Changed`], i.query ?? defaultChildQuery, i.filter ?? defaultChildFilter, i.map ?? defaultChildMap, i.options ?? zn);
        wt(t, i.name, {
            enumerable: true,
            configurable: true,
            get: mt((() => s.getValue()), {
                getObserver: () => s
            }),
            set: () => {}
        });
        e.addBinding(s);
    }
}

let Gn = false;

export { AdoptedStyleSheetsStyles, AppRoot, le as AppTask, Ns as AtPrefixedTriggerAttributePattern, AttrBindingBehavior, AttrBindingCommand, AttrSyntax, AttributeBinding, AttributeBindingInstruction, Bi as AttributeBindingRenderer, AttributeNSAccessor, Fs as AttributePattern, AuCompose, AuSlot, AuSlotsInfo, Aurelia, Wt as Bindable, BindableDefinition, te as BindingBehavior, BindingBehaviorDefinition, Us as BindingCommand, BindingCommandDefinition, Mt as BindingMode, BindingModeBehavior, BindingTargetSubscriber, CSSModulesProcessorRegistry, CaptureBindingCommand, Case, CheckedObserver, ChildrenBinding, ClassAttributeAccessor, ClassBindingCommand, $s as ColonPrefixedBindAttributePattern, ComputedWatcher, ContentBinding, Controller, fe as CustomAttribute, CustomAttributeDefinition, ui as CustomAttributeRenderer, Is as CustomElement, CustomElementDefinition, ci as CustomElementRenderer, DataAttributeAccessor, DebounceBindingBehavior, DefaultBindingCommand, $n as DefaultBindingLanguage, On as DefaultBindingSyntax, DefaultCase, Hn as DefaultComponents, Wn as DefaultRenderers, Nn as DefaultResources, Hs as DotSeparatedAttributePattern, Else, EventModifier, Ee as EventModifierRegistration, ExpressionWatcher, FlushQueue, Focus, ForBindingCommand, FragmentNodeSequence, FromViewBindingBehavior, FromViewBindingCommand, FulfilledTemplateController, HydrateAttributeInstruction, HydrateElementInstruction, HydrateLetElementInstruction, HydrateTemplateController, _s as IAppRoot, oe as IAppTask, Ks as IAttrMapper, Ds as IAttributeParser, Ms as IAttributePattern, Fe as IAuSlotWatcher, qe as IAuSlotsInfo, Ps as IAurelia, Pn as IBindablesInfoResolver, cs as IController, Ie as IEventModifier, ps as IEventTarget, ye as IFlushQueue, ks as IHistory, us as IHydrationContext, oi as IInstruction, Re as IKeyMapping, de as ILifecycleHooks, wi as IListenerBindingOptions, bs as ILocation, Te as IModifiedEventHandlerCreator, gs as INode, ae as IPlatform, vs as IRenderLocation, ai as IRenderer, Mi as IRendering, Gs as ISVGAnalyzer, bn as ISanitizer, Fi as IShadowDOMGlobalStyles, Di as IShadowDOMStyleFactory, qi as IShadowDOMStyles, Ls as ISyntaxInterpreter, li as ITemplateCompiler, qn as ITemplateCompilerHooks, kn as ITemplateElementFactory, _e as IViewFactory, ys as IWindow, If, ri as InstructionType, InterpolationBinding, gi as InterpolationBindingRenderer, InterpolationInstruction, InterpolationPartBinding, Interpretation, IteratorBindingInstruction, vi as IteratorBindingRenderer, LetBinding, LetBindingInstruction, di as LetElementRenderer, me as LifecycleHooks, LifecycleHooksDefinition, LifecycleHooksEntry, ListenerBinding, ListenerBindingInstruction, ListenerBindingOptions, yi as ListenerBindingRenderer, MultiAttrInstruction, NodeObserverLocator, NoopSVGAnalyzer, OneTimeBindingBehavior, OneTimeBindingCommand, PendingTemplateController, Portal, PromiseTemplateController, PropertyBinding, PropertyBindingInstruction, pi as PropertyBindingRenderer, Os as RefAttributePattern, RefBinding, RefBindingInstruction, mi as RefBindingRenderer, RejectedTemplateController, Rendering, Repeat, SVGAnalyzer, SanitizeValueConverter, SelectValueObserver, SelfBindingBehavior, SetAttributeInstruction, bi as SetAttributeRenderer, SetClassAttributeInstruction, ki as SetClassAttributeRenderer, SetPropertyInstruction, hi as SetPropertyRenderer, SetStyleAttributeInstruction, Ci as SetStyleAttributeRenderer, ShadowDOMRegistry, Vn as ShortHandBindingSyntax, SignalBindingBehavior, SpreadBindingInstruction, SpreadElementPropBindingInstruction, Si as SpreadRenderer, jn as StandardConfiguration, hs as State, StyleAttributeAccessor, StyleBindingCommand, Hi as StyleConfiguration, StyleElementStyles, StylePropertyBindingInstruction, Ai as StylePropertyBindingRenderer, Switch, TemplateCompiler, Fn as TemplateCompilerHooks, fi as TemplateControllerRenderer, TextBindingInstruction, xi as TextBindingRenderer, ThrottleBindingBehavior, ToViewBindingBehavior, ToViewBindingCommand, TriggerBindingCommand, TwoWayBindingBehavior, TwoWayBindingCommand, UpdateTriggerBindingBehavior, ValueAttributeObserver, ve as ValueConverter, ValueConverterDefinition, ViewFactory, he as Watch, With, alias, attributePattern, bindable, bindingBehavior, bindingCommand, capture, children, coercer, containerless, convertToRenderLocation, cssModules, customAttribute, customElement, getEffectiveParentNode, getRef, isCustomElementController, isCustomElementViewModel, isInstruction, isRenderLocation, lifecycleHooks, mixinAstEvaluator, mixinUseScope, mixingBindingLimited, processContent, registerAliases, renderer, setEffectiveParentNode, setRef, shadowCSS, slotted, templateCompilerHooks, templateController, useShadowDOM, valueConverter, watch };

