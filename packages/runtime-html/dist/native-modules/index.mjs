import { Protocol as t, getPrototypeChain as e, kebabCase as i, noop as s, DI as n, Registration as r, firstDefined as l, mergeArrays as h, resourceBaseName as a, resource as c, getResourceKeyFor as u, resolve as f, IPlatform as d, emptyArray as m, Registrable as g, all as p, InstanceProvider as v, IContainer as b, optionalResource as x, optional as w, onResolveAll as y, onResolve as k, fromDefinitionOrDefault as C, pascalCase as A, fromAnnotationOrTypeOrDefault as B, fromAnnotationOrDefinitionOrTypeOrDefault as S, camelCase as _, IServiceLocator as R, emptyObject as I, ILogger as T, transient as E, toArray as P, allResources as L } from "../../../kernel/dist/native-modules/index.mjs";

import { Metadata as M, isObject as D } from "../../../metadata/dist/native-modules/index.mjs";

import { AccessorType as q, ISignaler as H, astEvaluate as F, connectable as O, astBind as V, astUnbind as N, astAssign as $, subscriberCollection as W, IExpressionParser as j, IObserverLocator as z, ConnectableSwitcher as U, ProxyObservable as G, ICoercionConfiguration as K, Scope as X, AccessScopeExpression as Q, PropertyAccessor as Y, INodeObserverLocator as Z, IDirtyChecker as J, getObserverLookup as tt, SetterObserver as et, createIndexMap as it, getCollectionObserver as st, BindingContext as nt, PrimitiveLiteralExpression as rt, DirtyChecker as ot } from "../../../runtime/dist/native-modules/index.mjs";

import { BrowserPlatform as lt } from "../../../platform-browser/dist/native-modules/index.mjs";

import { TaskAbortError as ht } from "../../../platform/dist/native-modules/index.mjs";

function __decorate(t, e, i, s) {
    var n = arguments.length, r = n < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, i) : s, l;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(t, e, i, s); else for (var h = t.length - 1; h >= 0; h--) if (l = t[h]) r = (n < 3 ? l(r) : n > 3 ? l(e, i, r) : l(e, i)) || r;
    return n > 3 && r && Object.defineProperty(e, i, r), r;
}

const at = Object;

const ct = String;

const ut = at.prototype;

const createLookup = () => at.create(null);

const createError$1 = t => new Error(t);

const ft = ut.hasOwnProperty;

const dt = at.freeze;

const mt = at.assign;

const gt = at.getOwnPropertyNames;

const pt = at.keys;

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

const bt = at.is;

const xt = Reflect.defineProperty;

const defineHiddenProp = (t, e, i) => {
    xt(t, e, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: i
    });
    return i;
};

const addSignalListener = (t, e, i) => t.addSignalListener(e, i);

const removeSignalListener = (t, e, i) => t.removeSignalListener(e, i);

const wt = "Interpolation";

const yt = "IsIterator";

const kt = "IsFunction";

const Ct = "IsProperty";

const At = "pending";

const Bt = "running";

const St = q.Observer;

const _t = q.Node;

const Rt = q.Layout;

const It = 1;

const Tt = 2;

const Et = 4;

const Pt = 6;

const Lt = 8;

const Mt = /*@__PURE__*/ dt({
    oneTime: It,
    toView: Tt,
    fromView: Et,
    twoWay: Pt,
    default: Lt
});

const Dt = M.getOwn;

const qt = M.hasOwn;

const Ht = M.define;

const {annotation: Ft} = t;

const Ot = Ft.keyFor;

const Vt = Ft.appendTo;

const Nt = Ft.getKeys;

function bindable(t, e) {
    let i;
    function decorator(t, e) {
        if (arguments.length > 1) {
            i.name = e;
        }
        Ht($t, BindableDefinition.create(e, t, i), t.constructor, e);
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
    return t.startsWith($t);
}

const $t = /*@__PURE__*/ Ot("bindable");

const Wt = dt({
    name: $t,
    keyFrom: t => `${$t}:${t}`,
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
                pt(t).forEach((e => addDescription(e, t[e])));
            }
        }
        e.forEach(addList);
        return i;
    },
    getAll(t) {
        const i = $t.length + 1;
        const s = [];
        const n = e(t);
        let r = n.length;
        let l = 0;
        let h;
        let a;
        let c;
        let u;
        while (--r >= 0) {
            c = n[r];
            h = Nt(c).filter(isBindableAnnotation);
            a = h.length;
            for (u = 0; u < a; ++u) {
                s[l++] = Dt($t, c, h[u].slice(i));
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
        return new BindableDefinition(s.attribute ?? i(t), s.callback ?? `${t}Changed`, s.mode ?? Tt, s.primary ?? false, s.name ?? t, s.set ?? getInterceptor(t, e, s));
    }
}

function coercer(t, e, i) {
    jt.define(t, e);
}

const jt = {
    key: /*@__PURE__*/ Ot("coercer"),
    define(t, e) {
        Ht(jt.key, t[e].bind(t), t);
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

const Xt = r.transient;

const registerResolver = (t, e, i) => t.registerResolver(e, i);

function alias(...t) {
    return function(e) {
        const i = Ot("aliases");
        const s = Dt(i, e);
        if (s === void 0) {
            Ht(i, t, e);
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

function bindingBehavior(t) {
    return function(e) {
        return Yt.define(t, e);
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
        return new BindingBehaviorDefinition(e, l(getBehaviorAnnotation(e, "name"), i), h(getBehaviorAnnotation(e, "aliases"), s.aliases, e.aliases), Yt.keyFrom(i));
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

const Qt = /*@__PURE__*/ u("binding-behavior");

const getBehaviorAnnotation = (t, e) => Dt(Ot(e), t);

const getBindingBehaviorKeyFrom = t => `${Qt}:${t}`;

const Yt = dt({
    name: Qt,
    keyFrom: getBindingBehaviorKeyFrom,
    isType(t) {
        return isFunction(t) && qt(Qt, t);
    },
    define(t, e) {
        const i = BindingBehaviorDefinition.create(t, e);
        const s = i.Type;
        Ht(Qt, i, s);
        Ht(a, i, s);
        return s;
    },
    getDefinition(t) {
        const e = Dt(Qt, t);
        if (e === void 0) {
            throw createMappedError(151, t);
        }
        return e;
    },
    find(t, e) {
        const i = getBindingBehaviorKeyFrom(e);
        const s = t.find(i);
        return s == null ? null : Dt(Qt, s) ?? null;
    },
    get(t, e) {
        return t.get(c(getBindingBehaviorKeyFrom(e)));
    }
});

const Zt = new Map;

class BindingModeBehavior {
    bind(t, e) {
        Zt.set(e, e.mode);
        e.mode = this.mode;
    }
    unbind(t, e) {
        e.mode = Zt.get(e);
        Zt.delete(e);
    }
}

class OneTimeBindingBehavior extends BindingModeBehavior {
    get mode() {
        return It;
    }
}

class ToViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return Tt;
    }
}

class FromViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return Et;
    }
}

class TwoWayBindingBehavior extends BindingModeBehavior {
    get mode() {
        return Pt;
    }
}

bindingBehavior("oneTime")(OneTimeBindingBehavior);

bindingBehavior("toView")(ToViewBindingBehavior);

bindingBehavior("fromView")(FromViewBindingBehavior);

bindingBehavior("twoWay")(TwoWayBindingBehavior);

const Jt = new WeakMap;

const te = 200;

class DebounceBindingBehavior {
    constructor() {
        this.p = f(d);
    }
    bind(t, e, i, s) {
        const n = {
            type: "debounce",
            delay: i ?? te,
            now: this.p.performanceNow,
            queue: this.p.taskQueue,
            signals: isString(s) ? [ s ] : s ?? m
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

bindingBehavior("debounce")(DebounceBindingBehavior);

class SignalBindingBehavior {
    constructor() {
        this.i = new Map;
        this.u = f(H);
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

const ee = new WeakMap;

const ie = 200;

class ThrottleBindingBehavior {
    constructor() {
        ({performanceNow: this.C, taskQueue: this.A} = f(d));
    }
    bind(t, e, i, s) {
        const n = {
            type: "throttle",
            delay: i ?? ie,
            now: this.C,
            queue: this.A,
            signals: isString(s) ? [ s ] : s ?? m
        };
        const r = e.limit?.(n);
        if (r == null) ; else {
            ee.set(e, r);
        }
    }
    unbind(t, e) {
        ee.get(e)?.dispose();
        ee.delete(e);
    }
}

bindingBehavior("throttle")(ThrottleBindingBehavior);

const se = /*@__PURE__*/ zt("IAppTask");

class $AppTask {
    constructor(t, e, i) {
        this.c = void 0;
        this.slot = t;
        this.k = e;
        this.cb = i;
    }
    register(t) {
        return this.c = t.register(Kt(se, this));
    }
    run() {
        const t = this.k;
        const e = this.cb;
        return t === null ? e() : e(this.c.get(t));
    }
}

const ne = dt({
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

const re = d;

function watch(t, e) {
    if (t == null) {
        throw createMappedError(772);
    }
    return function decorator(i, s, n) {
        const r = s == null;
        const l = r ? i : i.constructor;
        const h = new WatchDefinition(t, r ? e : n.value);
        if (r) {
            if (!isFunction(e) && (e == null || !(e in l.prototype))) {
                throw createMappedError(773, `${ct(e)}@${l.name}}`);
            }
        } else if (!isFunction(n?.value)) {
            throw createMappedError(774, s);
        }
        oe.add(l, h);
        if (isAttributeType(l)) {
            getAttributeDefinition(l).watches.push(h);
        }
        if (isElementType(l)) {
            getElementDefinition(l).watches.push(h);
        }
    };
}

class WatchDefinition {
    constructor(t, e) {
        this.expression = t;
        this.callback = e;
    }
}

const oe = /*@__PURE__*/ (() => {
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

const le = "element";

const he = "attribute";

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
        return he;
    }
    constructor(t, e, i, s, n, r, l, h, a, c, u) {
        this.Type = t;
        this.name = e;
        this.aliases = i;
        this.key = s;
        this.defaultBindingMode = n;
        this.isTemplateController = r;
        this.bindables = l;
        this.noMultiBindings = h;
        this.watches = a;
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
        return new CustomAttributeDefinition(e, l(getAttributeAnnotation(e, "name"), i), h(getAttributeAnnotation(e, "aliases"), s.aliases, e.aliases), getAttributeKeyFrom(i), l(getAttributeAnnotation(e, "defaultBindingMode"), s.defaultBindingMode, e.defaultBindingMode, Tt), l(getAttributeAnnotation(e, "isTemplateController"), s.isTemplateController, e.isTemplateController, false), Wt.from(e, ...Wt.getAll(e), getAttributeAnnotation(e, "bindables"), e.bindables, s.bindables), l(getAttributeAnnotation(e, "noMultiBindings"), s.noMultiBindings, e.noMultiBindings, false), h(oe.getDefinitions(e), e.watches), h(getAttributeAnnotation(e, "dependencies"), s.dependencies, e.dependencies), l(getAttributeAnnotation(e, "containerStrategy"), s.containerStrategy, e.containerStrategy, "reuse"));
    }
    register(t, e) {
        const i = this.Type;
        const s = typeof e === "string" ? getAttributeKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(s, false)) {
            t.register(t.has(i, false) ? null : Xt(i, i), Gt(i, s), ...n.map((t => Gt(i, getAttributeKeyFrom(t)))));
        }
    }
    toString() {
        return `au:ca:${this.name}`;
    }
}

const ae = /*@__PURE__*/ u("custom-attribute");

const getAttributeKeyFrom = t => `${ae}:${t}`;

const getAttributeAnnotation = (t, e) => Dt(Ot(e), t);

const isAttributeType = t => isFunction(t) && qt(ae, t);

const findAttributeControllerFor = (t, e) => getRef(t, getAttributeKeyFrom(e)) ?? void 0;

const defineAttribute = (t, e) => {
    const i = CustomAttributeDefinition.create(t, e);
    const s = i.Type;
    Ht(ae, i, s);
    Ht(a, i, s);
    return s;
};

const getAttributeDefinition = t => {
    const e = Dt(ae, t);
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

const ce = dt({
    name: ae,
    keyFrom: getAttributeKeyFrom,
    isType: isAttributeType,
    for: findAttributeControllerFor,
    closest: findClosestControllerByName,
    define: defineAttribute,
    getDefinition: getAttributeDefinition,
    annotate(t, e, i) {
        Ht(Ot(e), i, t);
    },
    getAnnotation: getAttributeAnnotation,
    find(t, e) {
        const i = getAttributeKeyFrom(e);
        const s = t.find(i);
        return s === null ? null : Dt(ae, s) ?? null;
    }
});

const ue = /*@__PURE__*/ zt("ILifecycleHooks");

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

const fe = /*@__PURE__*/ (() => {
    const t = new WeakMap;
    const e = new WeakMap;
    return dt({
        define(t, i) {
            const s = LifecycleHooksDefinition.create(t, i);
            const n = s.Type;
            e.set(n, s);
            return g.define(n, (t => {
                Ut(ue, n).register(t);
            }));
        },
        resolve(i) {
            let s = t.get(i);
            if (s === void 0) {
                t.set(i, s = new LifecycleHooksLookupImpl);
                const n = i.root;
                const r = n === i ? i.getAll(ue) : i.has(ue, false) ? n.getAll(ue).concat(i.getAll(ue)) : n.getAll(ue);
                let l;
                let h;
                let a;
                let c;
                let u;
                for (l of r) {
                    h = e.get(l.constructor);
                    a = new LifecycleHooksEntry(h, l);
                    for (c of h.propertyNames) {
                        u = s[c];
                        if (u === void 0) {
                            s[c] = [ a ];
                        } else {
                            u.push(a);
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
        return fe.define({}, t);
    };
}

function valueConverter(t) {
    return function(e) {
        return me.define(t, e);
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
        return new ValueConverterDefinition(e, l(getConverterAnnotation(e, "name"), i), h(getConverterAnnotation(e, "aliases"), s.aliases, e.aliases), me.keyFrom(i));
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

const de = /*@__PURE__*/ u("value-converter");

const getConverterAnnotation = (t, e) => Dt(Ot(e), t);

const getValueConverterKeyFrom = t => `${de}:${t}`;

const me = dt({
    name: de,
    keyFrom: getValueConverterKeyFrom,
    isType(t) {
        return isFunction(t) && qt(de, t);
    },
    define(t, e) {
        const i = ValueConverterDefinition.create(t, e);
        const s = i.Type;
        Ht(de, i, s);
        Ht(a, i, s);
        return s;
    },
    getDefinition(t) {
        const e = Dt(de, t);
        if (e === void 0) {
            throw createMappedError(152, t);
        }
        return e;
    },
    annotate(t, e, i) {
        Ht(Ot(e), i, t);
    },
    getAnnotation: getConverterAnnotation,
    find(t, e) {
        const i = getValueConverterKeyFrom(e);
        const s = t.find(i);
        return s == null ? null : Dt(de, s) ?? null;
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
        if (t !== F(i.ast, i.s, i, null)) {
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
        xt(s, "strict", {
            enumerable: true,
            get: function() {
                return t;
            }
        });
    }
    xt(s, "strictFnCall", {
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

const ge = new WeakMap;

const pe = new WeakMap;

class ResourceLookup {}

const ve = /*@__PURE__*/ zt("IFlushQueue", (t => t.singleton(FlushQueue)));

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
    return this.l.root.get(H);
}

function evaluatorGetConverter(t) {
    let e = ge.get(this);
    if (e == null) {
        ge.set(this, e = new ResourceLookup);
    }
    return e[t] ??= me.get(this.l, t);
}

function evaluatorGetBehavior(t) {
    let e = pe.get(this);
    if (e == null) {
        pe.set(this, e = new ResourceLookup);
    }
    return e[t] ??= Yt.get(this.l, t);
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
        const n = s.length > 0 ? this.get(H) : null;
        const r = this[i];
        const callOriginal = (...t) => r.call(this, ...t);
        const l = t.type === "debounce" ? debounced(t, callOriginal, this) : throttled(t, callOriginal, this);
        const h = n ? {
            handleChange: l.flush
        } : null;
        this[i] = l;
        if (n) {
            s.forEach((t => addSignalListener(n, t, h)));
        }
        return {
            dispose: () => {
                if (n) {
                    s.forEach((t => removeSignalListener(n, t, h)));
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
    const h = t.queue;
    const callOriginalCallback = () => e(r);
    const fn = e => {
        r = e;
        if (i.isBound) {
            n = s;
            s = h.queueTask(callOriginalCallback, {
                delay: t.delay,
                reusable: false
            });
            n?.cancel();
        } else {
            callOriginalCallback();
        }
    };
    const a = fn.dispose = () => {
        n?.cancel();
        s?.cancel();
        n = s = void 0;
    };
    fn.flush = () => {
        l = s?.status === At;
        a();
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
    let h;
    let a = false;
    const c = t.queue;
    const now = () => t.now();
    const callOriginalCallback = () => e(h);
    const fn = e => {
        h = e;
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
        a = s?.status === At;
        u();
        if (a) {
            callOriginalCallback();
        }
    };
    return fn;
};

const xe = {
    reusable: false,
    preempt: true
};

class AttributeBinding {
    constructor(t, e, i, s, n, r, l, h, a) {
        this.targetAttribute = l;
        this.targetProperty = h;
        this.mode = a;
        this.isBound = false;
        this.s = void 0;
        this.I = null;
        this.v = void 0;
        this.boundFn = false;
        this.l = e;
        this.ast = n;
        this.T = t;
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
        const e = F(this.ast, this.s, this, (this.mode & Tt) > 0 ? this : null);
        this.obs.clear();
        if (e !== this.v) {
            this.v = e;
            const i = this.T.state !== ts;
            if (i) {
                t = this.I;
                this.I = this.A.queueTask((() => {
                    this.I = null;
                    this.updateTarget(e);
                }), xe);
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
        if (this.mode & (Tt | It)) {
            this.updateTarget(this.v = F(this.ast, t, this, (this.mode & Tt) > 0 ? this : null));
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        N(this.ast, this.s, this);
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

const we = {
    reusable: false,
    preempt: true
};

class InterpolationBinding {
    constructor(t, e, i, s, n, r, l, h) {
        this.ast = n;
        this.target = r;
        this.targetProperty = l;
        this.mode = h;
        this.isBound = false;
        this.s = void 0;
        this.I = null;
        this.T = t;
        this.oL = i;
        this.A = s;
        this.P = i.getAccessor(r, l);
        const a = n.expressions;
        const c = this.partBindings = Array(a.length);
        const u = a.length;
        let f = 0;
        for (;u > f; ++f) {
            c[f] = new InterpolationPartBinding(a[f], r, l, e, i, this);
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
        const l = this.T.state !== ts && (r.type & Rt) > 0;
        let h;
        if (l) {
            h = this.I;
            this.I = this.A.queueTask((() => {
                this.I = null;
                r.setValue(s, this.target, this.targetProperty);
            }), we);
            h?.cancel();
            h = null;
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
        this.mode = Tt;
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
        const t = F(this.ast, this.s, this, (this.mode & Tt) > 0 ? this : null);
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
        this.v = F(this.ast, this.s, this, (this.mode & Tt) > 0 ? this : null);
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
        N(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

mixinUseScope(InterpolationPartBinding);

mixingBindingLimited(InterpolationPartBinding, (() => "updateTarget"));

O(InterpolationPartBinding);

mixinAstEvaluator(true)(InterpolationPartBinding);

const ye = {
    reusable: false,
    preempt: true
};

class ContentBinding {
    constructor(t, e, i, s, n, r, l) {
        this.p = n;
        this.ast = r;
        this.target = l;
        this.isBound = false;
        this.mode = Tt;
        this.I = null;
        this.v = "";
        this.M = false;
        this.boundFn = false;
        this.strict = true;
        this.l = e;
        this.T = t;
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
        const t = F(this.ast, this.s, this, (this.mode & Tt) > 0 ? this : null);
        this.obs.clear();
        if (t === this.v) {
            this.I?.cancel();
            this.I = null;
            return;
        }
        const e = this.T.state !== ts;
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
        const t = this.v = F(this.ast, this.s, this, (this.mode & Tt) > 0 ? this : null);
        this.obs.clear();
        if (isArray(t)) {
            this.observeCollection(t);
        }
        const e = this.T.state !== ts;
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
        const e = this.v = F(this.ast, this.s, this, (this.mode & Tt) > 0 ? this : null);
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
        N(this.ast, this.s, this);
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
        }), ye);
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
        this.v = F(this.ast, this.s, this, this);
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
        V(this.ast, t, this);
        this.v = F(this.ast, this.s, this, this);
        this.updateTarget();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        N(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

mixinUseScope(LetBinding);

mixingBindingLimited(LetBinding, (() => "updateTarget"));

O(LetBinding);

mixinAstEvaluator(true)(LetBinding);

class PropertyBinding {
    constructor(t, e, i, s, n, r, l, h) {
        this.ast = n;
        this.target = r;
        this.targetProperty = l;
        this.mode = h;
        this.isBound = false;
        this.s = void 0;
        this.P = void 0;
        this.I = null;
        this.F = null;
        this.boundFn = false;
        this.l = e;
        this.T = t;
        this.A = s;
        this.oL = i;
    }
    updateTarget(t) {
        this.P.setValue(t, this.target, this.targetProperty);
    }
    updateSource(t) {
        $(this.ast, this.s, this, t);
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = F(this.ast, this.s, this, (this.mode & Tt) > 0 ? this : null);
        this.obs.clear();
        const e = this.T.state !== ts && (this.P.type & Rt) > 0;
        if (e) {
            ke = this.I;
            this.I = this.A.queueTask((() => {
                this.updateTarget(t);
                this.I = null;
            }), Ce);
            ke?.cancel();
            ke = null;
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
            if (i & Et) {
                s = e.getObserver(this.target, this.targetProperty);
            } else {
                s = e.getAccessor(this.target, this.targetProperty);
            }
            this.P = s;
        }
        const n = (i & Tt) > 0;
        if (i & (Tt | It)) {
            this.updateTarget(F(this.ast, this.s, this, n ? this : null));
        }
        if (i & Et) {
            s.subscribe(this.F ??= new BindingTargetSubscriber(this, this.l.get(ve)));
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
        N(this.ast, this.s, this);
        this.s = void 0;
        if (this.F) {
            this.P.unsubscribe(this.F);
            this.F = null;
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
        if (this.F != null) {
            throw createMappedError(9995);
        }
        this.F = t;
    }
}

mixinUseScope(PropertyBinding);

mixingBindingLimited(PropertyBinding, (t => t.mode & Et ? "updateSource" : "updateTarget"));

O(PropertyBinding);

mixinAstEvaluator(true, false)(PropertyBinding);

let ke = null;

const Ce = {
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
        $(this.ast, this.s, this, this.target);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        if (F(this.ast, this.s, this, null) === this.target) {
            $(this.ast, this.s, this, null);
        }
        N(this.ast, this.s, this);
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
        let i = F(this.ast, this.s, this, null);
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
        N(this.ast, this.s, this);
        this.s = void 0;
        this.target.removeEventListener(this.targetEvent, this, this.V);
    }
}

mixinUseScope(ListenerBinding);

mixingBindingLimited(ListenerBinding, (() => "callSource"));

mixinAstEvaluator(true, true)(ListenerBinding);

const Ae = /*@__PURE__*/ zt("IEventModifier");

const Be = /*@__PURE__*/ zt("IKeyMapping", (t => t.instance({
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
        this.N = f(Be);
        this.$ = [ "left", "middle", "right" ];
    }
    static register(t) {
        t.register(Ut(Ae, ModifiedMouseEventHandler));
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
                    if (t.button !== this.$.indexOf(n)) return false;
                    continue;
                }
                if (this.N.meta.includes(n) && t[`${n}Key`] !== true) {
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
        this.N = f(Be);
        this.type = [ "keydown", "keyup" ];
    }
    static register(t) {
        t.register(Ut(Ae, ModifiedKeyboardEventHandler));
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
                if (this.N.meta.includes(n)) {
                    if (t[`${n}Key`] !== true) {
                        return false;
                    }
                    continue;
                }
                const e = this.N.keys[n];
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

const Se = /*@__PURE__*/ zt("IEventModifierHandler", (t => t.instance({
    getHandler: () => null
})));

class EventModifier {
    constructor() {
        this.W = f(p(Ae)).reduce(((t, e) => {
            const i = isArray(e.type) ? e.type : [ e.type ];
            i.forEach((i => t[i] = e));
            return t;
        }), {});
    }
    static register(t) {
        t.register(Ut(Se, EventModifier));
    }
    getHandler(t, e) {
        return isString(e) ? this.W[t]?.getHandler(e) ?? null : null;
    }
}

const _e = {
    register(t) {
        t.register(EventModifier, ModifiedMouseEventHandler, ModifiedKeyboardEventHandler);
    }
};

const Re = /*@__PURE__*/ zt("IViewFactory");

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

const Te = "au-end";

const createElement = (t, e) => t.document.createElement(e);

const createComment = (t, e) => t.document.createComment(e);

const createLocation = t => {
    const e = createComment(t, Te);
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

const Ee = "default";

const Pe = "au-slot";

const Le = /*@__PURE__*/ zt("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

const Me = /*@__PURE__*/ zt("IAuSlotWatcher");

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
        Kt(ue, this).register(t);
    }
    hydrating(t, e) {
        const i = this.Y;
        const s = new AuSlotWatcherBinding(t, i.callback ?? `${ct(i.name)}Changed`, i.slotName ?? "default", i.query ?? "*");
        xt(t, i.name, {
            enumerable: true,
            configurable: true,
            get: mt((() => s.getValue()), {
                getObserver: () => s
            }),
            set: () => {}
        });
        Kt(Me, s).register(e.container);
        e.addBinding(s);
    }
}

function slotted(t, e) {
    if (!De) {
        De = true;
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
        const h = s.constructor;
        let a = Bs.getAnnotation(h, i);
        if (a == null) {
            Bs.annotate(h, i, a = []);
        }
        a.push(new SlottedLifecycleHooks(l));
    }
    return decorator;
}

let De = false;

class SpreadBinding {
    static create(t, e, i, s, n, r, l, h) {
        const a = [];
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
                  case ti:
                    renderSpreadInstruction(t + 1);
                    break;

                  case ei:
                    c[d.instructions.type].render(u, findElementControllerFor(e), d.instructions, r, l, h);
                    break;

                  default:
                    c[d.type].render(u, e, d, r, l, h);
                }
            }
            a.push(u);
        };
        renderSpreadInstruction(0);
        return a;
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
        if (t.vmKind !== Yi) {
            throw createMappedError(9998);
        }
        this.$controller.addChild(t);
    }
}

const qe = "ra";

const He = "rb";

const Fe = "rc";

const Oe = "rd";

const Ve = "re";

const Ne = "rf";

const $e = "rg";

const We = "ri";

const je = "rj";

const ze = "rk";

const Ue = "rl";

const Ge = "ha";

const Ke = "hb";

const Xe = "hc";

const Qe = "hd";

const Ye = "he";

const Ze = "hf";

const Je = "hg";

const ti = "hs";

const ei = "hp";

const ii = /*@__PURE__*/ dt({
    hydrateElement: qe,
    hydrateAttribute: He,
    hydrateTemplateController: Fe,
    hydrateLetElement: Oe,
    setProperty: Ve,
    interpolation: Ne,
    propertyBinding: $e,
    letBinding: We,
    refBinding: je,
    iteratorBinding: ze,
    multiAttr: Ue,
    textBinding: Ge,
    listenerBinding: Ke,
    attributeBinding: Xe,
    stylePropertyBinding: Qe,
    setAttribute: Ye,
    setClassAttribute: Ze,
    setStyleAttribute: Je,
    spreadBinding: ti,
    spreadElementProp: ei
});

const si = /*@__PURE__*/ zt("Instruction");

function isInstruction(t) {
    const e = t.type;
    return isString(e) && e.length === 2;
}

class InterpolationInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Ne;
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
        this.type = ze;
    }
}

class RefBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = je;
    }
}

class SetPropertyInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = Ve;
    }
}

class MultiAttrInstruction {
    constructor(t, e, i) {
        this.value = t;
        this.to = e;
        this.command = i;
        this.type = Ue;
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
        this.type = qe;
    }
}

class HydrateAttributeInstruction {
    constructor(t, e, i) {
        this.res = t;
        this.alias = e;
        this.props = i;
        this.type = He;
    }
}

class HydrateTemplateController {
    constructor(t, e, i, s) {
        this.def = t;
        this.res = e;
        this.alias = i;
        this.props = s;
        this.type = Fe;
    }
}

class HydrateLetElementInstruction {
    constructor(t, e) {
        this.instructions = t;
        this.toBindingContext = e;
        this.type = Oe;
    }
}

class LetBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = We;
    }
}

class TextBindingInstruction {
    constructor(t) {
        this.from = t;
        this.type = Ge;
    }
}

class ListenerBindingInstruction {
    constructor(t, e, i, s) {
        this.from = t;
        this.to = e;
        this.capture = i;
        this.modifier = s;
        this.type = Ke;
    }
}

class StylePropertyBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Qe;
    }
}

class SetAttributeInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = Ye;
    }
}

class SetClassAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = Ze;
    }
}

class SetStyleAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = Je;
    }
}

class AttributeBindingInstruction {
    constructor(t, e, i) {
        this.attr = t;
        this.from = e;
        this.to = i;
        this.type = Xe;
    }
}

class SpreadBindingInstruction {
    constructor() {
        this.type = ti;
    }
}

class SpreadElementPropBindingInstruction {
    constructor(t) {
        this.instructions = t;
        this.type = ei;
    }
}

const ni = /*@__PURE__*/ zt("ITemplateCompiler");

const ri = /*@__PURE__*/ zt("IRenderer");

function renderer(t) {
    return function decorator(e) {
        xt(e.prototype, "target", {
            configurable: true,
            get() {
                return t;
            }
        });
        return g.define(e, (function(t) {
            Ut(ri, this).register(t);
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

let oi = class SetPropertyRenderer {
    render(t, e, i) {
        const s = getTarget(e);
        if (s.$observers?.[i.to] !== void 0) {
            s.$observers[i.to].setValue(i.value);
        } else {
            s[i.to] = i.value;
        }
    }
};

oi = __decorate([ renderer(Ve) ], oi);

let li = class CustomElementRenderer {
    constructor() {
        this.r = f(Ei);
    }
    render(t, e, i, s, n, r) {
        let l;
        let h;
        let a;
        const c = i.res;
        const u = i.projections;
        const f = t.container;
        switch (typeof c) {
          case "string":
            l = Bs.find(f, c);
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
        h = g.invoke(l.Type);
        a = Controller.$el(g, h, e, i, l, m);
        setRef(e, l.key, a);
        const p = this.r.renderers;
        const v = i.props;
        const b = v.length;
        let x = 0;
        let w;
        while (b > x) {
            w = v[x];
            p[w.type].render(t, a, w, s, n, r);
            ++x;
        }
        t.addChild(a);
    }
};

li = __decorate([ renderer(qe) ], li);

let hi = class CustomAttributeRenderer {
    constructor() {
        this.r = f(Ei);
    }
    render(t, e, i, s, n, r) {
        let l = t.container;
        let h;
        switch (typeof i.res) {
          case "string":
            h = ce.find(l, i.res);
            if (h == null) {
                throw createMappedError(753, i, t);
            }
            break;

          default:
            h = i.res;
        }
        const a = invokeAttribute(s, h, t, e, i, void 0, void 0);
        const c = Controller.$attr(a.ctn, a.vm, e, h);
        setRef(e, h.key, c);
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

hi = __decorate([ renderer(He) ], hi);

let ai = class TemplateControllerRenderer {
    constructor() {
        this.r = f(Ei);
    }
    render(t, e, i, s, n, r) {
        let l = t.container;
        let h;
        switch (typeof i.res) {
          case "string":
            h = ce.find(l, i.res);
            if (h == null) {
                throw createMappedError(754, i, t);
            }
            break;

          default:
            h = i.res;
        }
        const a = this.r.getViewFactory(i.def, h.containerStrategy === "new" ? l.createChild({
            inheritParentResources: true
        }) : l);
        const c = convertToRenderLocation(e);
        const u = invokeAttribute(s, h, t, e, i, a, c);
        const f = Controller.$attr(u.ctn, u.vm, e, h);
        setRef(c, h.key, f);
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

ai = __decorate([ renderer(Fe) ], ai);

let ci = class LetElementRenderer {
    render(t, e, i, s, n, r) {
        e.remove();
        const l = i.instructions;
        const h = i.toBindingContext;
        const a = t.container;
        const c = l.length;
        let u;
        let f;
        let d = 0;
        while (c > d) {
            u = l[d];
            f = ensureExpression(n, u.from, Ct);
            t.addBinding(new LetBinding(a, r, f, u.to, h));
            ++d;
        }
    }
};

ci = __decorate([ renderer(Oe) ], ci);

let ui = class RefBindingRenderer {
    render(t, e, i, s, n) {
        t.addBinding(new RefBinding(t.container, ensureExpression(n, i.from, Ct), getRefTarget(e, i.to)));
    }
};

ui = __decorate([ renderer(je) ], ui);

let fi = class InterpolationBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new InterpolationBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, wt), getTarget(e), i.to, Tt));
    }
};

fi = __decorate([ renderer(Ne) ], fi);

let di = class PropertyBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, Ct), getTarget(e), i.to, i.mode));
    }
};

di = __decorate([ renderer($e) ], di);

let mi = class IteratorBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.forOf, yt), getTarget(e), i.to, Tt));
    }
};

mi = __decorate([ renderer(ze) ], mi);

let gi = class TextBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, s.domWriteQueue, s, ensureExpression(n, i.from, Ct), e));
    }
};

gi = __decorate([ renderer(Ge) ], gi);

const pi = zt("IListenerBindingOptions", (t => t.instance({
    prevent: false
})));

let vi = class ListenerBindingRenderer {
    constructor() {
        this.tt = f(Se);
        this.et = f(pi);
    }
    render(t, e, i, s, n) {
        t.addBinding(new ListenerBinding(t.container, ensureExpression(n, i.from, kt), e, i.to, new ListenerBindingOptions(this.et.prevent, i.capture), this.tt.getHandler(i.to, i.modifier)));
    }
};

vi = __decorate([ renderer(Ke) ], vi);

let bi = class SetAttributeRenderer {
    render(t, e, i) {
        e.setAttribute(i.to, i.value);
    }
};

bi = __decorate([ renderer(Ye) ], bi);

let xi = class SetClassAttributeRenderer {
    render(t, e, i) {
        addClasses(e.classList, i.value);
    }
};

xi = __decorate([ renderer(Ze) ], xi);

let wi = class SetStyleAttributeRenderer {
    render(t, e, i) {
        e.style.cssText += i.value;
    }
};

wi = __decorate([ renderer(Je) ], wi);

let yi = class StylePropertyBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, Ct), e.style, i.to, Tt));
    }
};

yi = __decorate([ renderer(Qe) ], yi);

let ki = class AttributeBindingRenderer {
    render(t, e, i, s, n, r) {
        const l = t.container;
        const h = l.has(gs, false) ? l.get(gs) : null;
        t.addBinding(new AttributeBinding(t, l, r, s.domWriteQueue, ensureExpression(n, i.from, Ct), e, i.attr, h == null ? i.to : i.to.split(/\s/g).map((t => h[t] ?? t)).join(" "), Tt));
    }
};

ki = __decorate([ renderer(Xe) ], ki);

let Ci = class SpreadRenderer {
    constructor() {
        this.it = f(ni);
        this.r = f(Ei);
    }
    render(t, e, i, s, n, r) {
        SpreadBinding.create(t.container.get(hs), e, void 0, this.r, this.it, s, n, r).forEach((e => t.addBinding(e)));
    }
};

Ci = __decorate([ renderer(ti) ], Ci);

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

const Ai = "IController";

const Bi = "IInstruction";

const Si = "IRenderLocation";

const _i = "ISlotsInfo";

function createElementContainer(t, e, i, s, n, r) {
    const l = e.container.createChild();
    registerHostNode(l, t, i);
    registerResolver(l, ls, new v(Ai, e));
    registerResolver(l, si, new v(Bi, s));
    registerResolver(l, ms, n == null ? Ri : new RenderLocationProvider(n));
    registerResolver(l, Re, Ii);
    registerResolver(l, Le, r == null ? Ti : new v(_i, r));
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

function invokeAttribute(t, e, i, s, n, r, l, h) {
    const a = i instanceof Controller ? i : i.$controller;
    const c = a.container.createChild();
    registerHostNode(c, t, s);
    registerResolver(c, ls, new v(Ai, a));
    registerResolver(c, si, new v(Bi, n));
    registerResolver(c, ms, l == null ? Ri : new v(Si, l));
    registerResolver(c, Re, r == null ? Ii : new ViewFactoryProvider(r));
    registerResolver(c, Le, h == null ? Ti : new v(_i, h));
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

const Ri = new RenderLocationProvider(null);

const Ii = new ViewFactoryProvider(null);

const Ti = new v(_i, new AuSlotsInfo(m));

const Ei = /*@__PURE__*/ zt("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.st ??= this.nt.getAll(ri, false).reduce(((t, e) => {
            t[e.target] = e;
            return t;
        }), createLookup());
    }
    constructor() {
        this.rt = new WeakMap;
        this.ot = new WeakMap;
        const t = this.nt = f(b).root;
        this.p = t.get(re);
        this.ep = t.get(j);
        this.oL = t.get(z);
        this.lt = new FragmentNodeSequence(this.p, this.p.document.createDocumentFragment());
    }
    compile(t, e, i) {
        if (t.needsCompile !== false) {
            const s = this.rt;
            const n = e.get(ni);
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
            let h;
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
                h = r.createElement("template");
                if (isString(l)) {
                    h.innerHTML = l;
                }
                e = h.content;
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
        let h = 0;
        let a = 0;
        let c = n.length;
        let u;
        let f;
        let d;
        if (l !== c) {
            throw createMappedError(757, l, c);
        }
        if (l > 0) {
            while (l > h) {
                u = n[h];
                d = e[h];
                a = 0;
                c = u.length;
                while (c > a) {
                    f = u[a];
                    r[f.type].render(t, d, f, this.p, this.ep, this.oL);
                    ++a;
                }
                ++h;
            }
        }
        if (s != null) {
            u = i.surrogates;
            if ((c = u.length) > 0) {
                a = 0;
                while (c > a) {
                    f = u[a];
                    r[f.type].render(t, s, f, this.p, this.ep, this.oL);
                    ++a;
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
        this.type = _t | Rt;
        this.v = "";
        this.vt = {};
        this.bt = 0;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (t !== this.v) {
            this.v = t;
            this.xt();
        }
    }
    xt() {
        const t = this.vt;
        const e = ++this.bt;
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
                t[l] = this.bt;
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
                this.wt = new ClassAttributeAccessor(f(fs));
                this.value = "";
            }
            binding() {
                this.valueChanged();
            }
            valueChanged() {
                this.wt.setValue(this.value?.split(/\s+/g).map((t => e[t] || t)) ?? "");
            }
        });
        t.register(i, Kt(gs, e));
    }
}

function shadowCSS(...t) {
    return new ShadowDOMRegistry(t);
}

const Pi = /*@__PURE__*/ zt("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
    if (AdoptedStyleSheetsStyles.supported(t.get(re))) {
        return t.get(AdoptedStyleSheetsStylesFactory);
    }
    return t.get(StyleElementStylesFactory);
}))));

class ShadowDOMRegistry {
    constructor(t) {
        this.css = t;
    }
    register(t) {
        const e = t.get(Mi);
        const i = t.get(Pi);
        t.register(Kt(Li, i.createStyles(this.css, e)));
    }
}

class AdoptedStyleSheetsStylesFactory {
    constructor() {
        this.p = f(re);
        this.cache = new Map;
    }
    createStyles(t, e) {
        return new AdoptedStyleSheetsStyles(this.p, t, this.cache, e);
    }
}

class StyleElementStylesFactory {
    constructor() {
        this.p = f(re);
    }
    createStyles(t, e) {
        return new StyleElementStyles(this.p, t, e);
    }
}

const Li = /*@__PURE__*/ zt("IShadowDOMStyles");

const Mi = /*@__PURE__*/ zt("IShadowDOMGlobalStyles", (t => t.instance({
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

const Di = {
    shadowDOM(t) {
        return ne.creating(b, (e => {
            if (t.sharedStyles != null) {
                const i = e.get(Pi);
                e.register(Kt(Mi, i.createStyles(t.sharedStyles, null)));
            }
        }));
    }
};

const {enter: qi, exit: Hi} = U;

const {wrap: Fi, unwrap: Oi} = G;

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
        if (!bt(i, e)) {
            this.cb.call(t, i, e, t);
        }
    }
    compute() {
        this.running = true;
        this.obs.version++;
        try {
            qi(this);
            return this.v = Oi(this.$get.call(void 0, this.useProxy ? Fi(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            Hi(this);
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
        this.yt = s;
        this.cb = n;
    }
    handleChange(t) {
        const e = this.yt;
        const i = this.obj;
        const s = this.v;
        const n = e.$kind === "AccessScope" && this.obs.count === 1;
        if (!n) {
            this.obs.version++;
            t = F(e, this.scope, this, this);
            this.obs.clear();
        }
        if (!bt(t, s)) {
            this.v = t;
            this.cb.call(i, t, s, i);
        }
    }
    bind() {
        if (this.isBound) {
            return;
        }
        this.obs.version++;
        this.v = F(this.yt, this.scope, this, this);
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
        return (this.state & (ts | es)) > 0 && (this.state & is) === 0;
    }
    get name() {
        if (this.parent === null) {
            switch (this.vmKind) {
              case Yi:
                return `[${this.definition.name}]`;

              case Qi:
                return this.definition.name;

              case Zi:
                return this.viewFactory.name;
            }
        }
        switch (this.vmKind) {
          case Yi:
            return `${this.parent.name}>[${this.definition.name}]`;

          case Qi:
            return `${this.parent.name}>${this.definition.name}`;

          case Zi:
            return this.viewFactory.name === this.parent.definition?.name ? `${this.parent.name}[view]` : `${this.parent.name}[view:${this.viewFactory.name}]`;
        }
    }
    get viewModel() {
        return this.Ct;
    }
    set viewModel(t) {
        this.Ct = t;
        this.At = t == null || this.vmKind === Zi ? HooksDefinition.none : new HooksDefinition(t);
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
        this.mountTarget = Ni;
        this.shadowRoot = null;
        this.nodes = null;
        this.location = null;
        this.kt = null;
        this.state = Ji;
        this.St = false;
        this.$initiator = null;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this._t = 0;
        this.Rt = 0;
        this.It = 0;
        this.Ct = n;
        this.At = e === Zi ? HooksDefinition.none : new HooksDefinition(n);
        this.location = l;
        this.r = t.root.get(Ei);
        this.coercion = e === Zi ? void 0 : t.get(Gi);
    }
    static getCached(t) {
        return Vi.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (e === void 0) {
            throw createMappedError(500, t);
        }
        return e;
    }
    static $el(t, e, i, s, n = void 0, r = null) {
        if (Vi.has(e)) {
            return Vi.get(e);
        }
        {
            n = n ?? getElementDefinition(e.constructor);
        }
        registerResolver(t, n.Type, new v(n.key, e, n.Type));
        const l = new Controller(t, Qi, n, null, e, i, r);
        const h = t.get(w(hs));
        if (n.dependencies.length > 0) {
            t.register(...n.dependencies);
        }
        registerResolver(t, hs, new v("IHydrationContext", new HydrationContext(l, s, h)));
        Vi.set(e, l);
        if (s == null || s.hydrate !== false) {
            l.hE(s, h);
        }
        return l;
    }
    static $attr(t, e, i, s) {
        if (Vi.has(e)) {
            return Vi.get(e);
        }
        s = s ?? getAttributeDefinition(e.constructor);
        registerResolver(t, s.Type, new v(s.key, e, s.Type));
        const n = new Controller(t, Yi, s, null, e, i, null);
        if (s.dependencies.length > 0) {
            t.register(...s.dependencies);
        }
        Vi.set(e, n);
        n.Tt();
        return n;
    }
    static $view(t, e = void 0) {
        const i = new Controller(t.container, Zi, null, t, null, null, null);
        i.parent = e ?? null;
        i.Et();
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
        this.kt = fe.resolve(i);
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
        let h = this.location;
        if ((this.hostController = findElementControllerFor(l, Ui)) !== null) {
            l = this.host = this.container.root.get(re).document.createElement(e.name);
            if (r && h == null) {
                h = this.location = convertToRenderLocation(l);
            }
        }
        setRef(l, ks, this);
        setRef(l, e.key, this);
        if (s !== null || n) {
            if (h != null) {
                throw createMappedError(501);
            }
            setRef(this.shadowRoot = l.attachShadow(s ?? Xi), ks, this);
            setRef(this.shadowRoot, e.key, this);
            this.mountTarget = Wi;
        } else if (h != null) {
            setRef(h, ks, this);
            setRef(h, e.key, this);
            this.mountTarget = ji;
        } else {
            this.mountTarget = $i;
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
    Tt() {
        const t = this.definition;
        const e = this.Ct;
        if (t.watches.length > 0) {
            createWatchers(this, this.container, t, e);
        }
        createObservers(this, t, e);
        e.$controller = this;
        this.kt = fe.resolve(this.container);
        if (this.kt.created !== void 0) {
            this.kt.created.forEach(callCreatedHook, this);
        }
        if (this.At.Dt) {
            this.Ct.created(this);
        }
    }
    Et() {
        this.Lt = this.r.compile(this.viewFactory.def, this.container, null);
        this.r.render(this, (this.nodes = this.r.createNodes(this.Lt)).findTargets(), this.Lt, void 0);
    }
    activate(t, e, i) {
        switch (this.state) {
          case Ji:
          case ss:
            if (!(e === null || e.isActive)) {
                return;
            }
            this.state = ts;
            break;

          case es:
            return;

          case rs:
            throw createMappedError(502, this.name);

          default:
            throw createMappedError(503, this.name, stringifyState(this.state));
        }
        this.parent = e;
        switch (this.vmKind) {
          case Qi:
            this.scope.parent = i ?? null;
            break;

          case Yi:
            this.scope = i ?? null;
            break;

          case Zi:
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
        if (this.vmKind !== Zi && this.kt.binding != null) {
            s = y(...this.kt.binding.map(callBindingHook, this));
        }
        if (this.At.Ht) {
            s = y(s, this.Ct.binding(this.$initiator, this.parent));
        }
        if (isPromise(s)) {
            this.Ft();
            s.then((() => {
                this.Bt = true;
                if (this.state !== ts) {
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
        if (this.vmKind !== Zi && this.kt.bound != null) {
            i = y(...this.kt.bound.map(callBoundHook, this));
        }
        if (this.At.Nt) {
            i = y(i, this.Ct.bound(this.$initiator, this.parent));
        }
        if (isPromise(i)) {
            this.Ft();
            i.then((() => {
                this.isBound = true;
                if (this.state !== ts) {
                    this.Ot();
                } else {
                    this.$t();
                }
            })).catch((t => {
                this.Vt(t);
            }));
            return;
        }
        this.isBound = true;
        this.$t();
    }
    Wt(...t) {
        switch (this.mountTarget) {
          case $i:
            this.host.append(...t);
            break;

          case Wi:
            this.shadowRoot.append(...t);
            break;

          case ji:
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
              case $i:
              case Wi:
                this.hostController.Wt(this.host);
                break;

              case ji:
                this.hostController.Wt(this.location.$start, this.location);
                break;
            }
        }
        switch (this.mountTarget) {
          case $i:
            this.nodes.appendTo(this.host, this.definition != null && this.definition.enhance);
            break;

          case Wi:
            {
                const t = this.container;
                const e = t.has(Li, false) ? t.get(Li) : t.get(Mi);
                e.applyTo(this.shadowRoot);
                this.nodes.appendTo(this.shadowRoot);
                break;
            }

          case ji:
            this.nodes.insertBefore(this.location);
            break;
        }
        let t = 0;
        let e = void 0;
        if (this.vmKind !== Zi && this.kt.attaching != null) {
            e = y(...this.kt.attaching.map(callAttachingHook, this));
        }
        if (this.At.jt) {
            e = y(e, this.Ct.attaching(this.$initiator, this.parent));
        }
        if (isPromise(e)) {
            this.Ft();
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
        switch (this.state & ~ns) {
          case es:
            this.state = is;
            break;

          case ts:
            this.state = is;
            i = this.$promise?.catch(s);
            break;

          case Ji:
          case ss:
          case rs:
          case ss | rs:
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
                if (this.vmKind !== Zi && this.kt.detaching != null) {
                    r = y(...this.kt.detaching.map(callDetachingHook, this));
                }
                if (this.At.Ut) {
                    r = y(r, this.Ct.detaching(this.$initiator, this.parent));
                }
            }
            if (isPromise(r)) {
                this.Ft();
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
          case Qi:
          case Zi:
            this.nodes.remove();
            this.nodes.unlink();
        }
        if (this.hostController !== null) {
            switch (this.mountTarget) {
              case $i:
              case Wi:
                this.host.remove();
                break;

              case ji:
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
          case Yi:
            this.scope = null;
            break;

          case Zi:
            if (!this.hasLockedScope) {
                this.scope = null;
            }
            if ((this.state & ns) === ns && !this.viewFactory.tryReturnToCache(this) && this.$initiator === this) {
                this.dispose();
            }
            break;

          case Qi:
            this.scope.parent = null;
            break;
        }
        this.state = ss;
        this.$initiator = null;
        this.Kt();
    }
    Ft() {
        if (this.$promise === void 0) {
            this.$promise = new Promise(((t, e) => {
                this.$resolve = t;
                this.$reject = e;
            }));
            if (this.$initiator !== this) {
                this.parent.Ft();
            }
        }
    }
    Kt() {
        if (this.$promise !== void 0) {
            as = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            as();
            as = void 0;
        }
    }
    Vt(t) {
        if (this.$promise !== void 0) {
            cs = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            cs(t);
            cs = void 0;
        }
        if (this.$initiator !== this) {
            this.parent.Vt(t);
        }
    }
    qt() {
        ++this._t;
        if (this.$initiator !== this) {
            this.parent.qt();
        }
    }
    Ot() {
        if (this.state !== ts) {
            --this._t;
            this.Kt();
            if (this.$initiator !== this) {
                this.parent.Ot();
            }
            return;
        }
        if (--this._t === 0) {
            if (this.vmKind !== Zi && this.kt.attached != null) {
                us = y(...this.kt.attached.map(callAttachedHook, this));
            }
            if (this.At.Xt) {
                us = y(us, this.Ct.attached(this.$initiator));
            }
            if (isPromise(us)) {
                this.Ft();
                us.then((() => {
                    this.state = es;
                    this.Kt();
                    if (this.$initiator !== this) {
                        this.parent.Ot();
                    }
                })).catch((t => {
                    this.Vt(t);
                }));
                us = void 0;
                return;
            }
            us = void 0;
            this.state = es;
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
                    if (t.vmKind !== Zi && t.kt.unbinding != null) {
                        e = y(...t.kt.unbinding.map(callUnbindingHook, t));
                    }
                    if (t.At.Yt) {
                        if (t.debug) {
                            t.logger.trace("unbinding()");
                        }
                        e = y(e, t.viewModel.unbinding(t.$initiator, t.parent));
                    }
                }
                if (isPromise(e)) {
                    this.Ft();
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
          case Yi:
          case Qi:
            {
                return this.definition.name === t;
            }

          case Zi:
            return this.viewFactory.name === t;
        }
    }
    lockScope(t) {
        this.scope = t;
        this.hasLockedScope = true;
    }
    setHost(t) {
        if (this.vmKind === Qi) {
            setRef(t, ks, this);
            setRef(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = $i;
        return this;
    }
    setShadowRoot(t) {
        if (this.vmKind === Qi) {
            setRef(t, ks, this);
            setRef(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = Wi;
        return this;
    }
    setLocation(t) {
        if (this.vmKind === Qi) {
            setRef(t, ks, this);
            setRef(t, this.definition.key, this);
        }
        this.location = t;
        this.mountTarget = ji;
        return this;
    }
    release() {
        this.state |= ns;
    }
    dispose() {
        if ((this.state & rs) === rs) {
            return;
        }
        this.state |= rs;
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
            Vi.delete(this.Ct);
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

const Vi = new WeakMap;

const Ni = 0;

const $i = 1;

const Wi = 2;

const ji = 3;

const zi = dt({
    none: Ni,
    host: $i,
    shadowRoot: Wi,
    location: ji
});

const Ui = {
    optional: true
};

const Gi = x(K);

function createObservers(t, e, i) {
    const n = e.bindables;
    const r = gt(n);
    const l = r.length;
    const h = t.container.get(z);
    if (l > 0) {
        for (let e = 0; e < l; ++e) {
            const l = r[e];
            const a = n[l];
            const c = a.callback;
            const u = h.getObserver(i, l);
            if (a.set !== s) {
                if (u.useCoercer?.(a.set, t.coercion) !== true) {
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

const Ki = new Map;

const getAccessScopeAst = t => {
    let e = Ki.get(t);
    if (e == null) {
        e = new Q(t, 0);
        Ki.set(t, e);
    }
    return e;
};

function createWatchers(t, e, i, s) {
    const n = e.get(z);
    const r = e.get(j);
    const l = i.watches;
    const h = t.vmKind === Qi ? t.scope : X.create(s, null, true);
    const a = l.length;
    let c;
    let u;
    let f;
    let d = 0;
    for (;a > d; ++d) {
        ({expression: c, callback: u} = l[d]);
        u = isFunction(u) ? u : Reflect.get(s, u);
        if (!isFunction(u)) {
            throw createMappedError(506, u);
        }
        if (isFunction(c)) {
            t.addBinding(new ComputedWatcher(s, n, c, u, true));
        } else {
            f = isString(c) ? r.parse(c, Ct) : getAccessScopeAst(c);
            t.addBinding(new ExpressionWatcher(h, e, n, f, u));
        }
    }
}

function isCustomElementController(t) {
    return t instanceof Controller && t.vmKind === Qi;
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
        this.Ht = "binding" in t;
        this.Nt = "bound" in t;
        this.jt = "attaching" in t;
        this.Xt = "attached" in t;
        this.Ut = "detaching" in t;
        this.Yt = "unbinding" in t;
        this.Jt = "dispose" in t;
        this.te = "accept" in t;
    }
}

HooksDefinition.none = new HooksDefinition({});

const Xi = {
    mode: "open"
};

const Qi = "customElement";

const Yi = "customAttribute";

const Zi = "synthetic";

const Ji = 0;

const ts = 1;

const es = 2;

const is = 4;

const ss = 8;

const ns = 16;

const rs = 32;

const os = /*@__PURE__*/ dt({
    none: Ji,
    activating: ts,
    activated: es,
    deactivating: is,
    deactivated: ss,
    released: ns,
    disposed: rs
});

function stringifyState(t) {
    const e = [];
    if ((t & ts) === ts) {
        e.push("activating");
    }
    if ((t & es) === es) {
        e.push("activated");
    }
    if ((t & is) === is) {
        e.push("deactivating");
    }
    if ((t & ss) === ss) {
        e.push("deactivated");
    }
    if ((t & ns) === ns) {
        e.push("released");
    }
    if ((t & rs) === rs) {
        e.push("disposed");
    }
    return e.length === 0 ? "none" : e.join("|");
}

const ls = /*@__PURE__*/ zt("IController");

const hs = /*@__PURE__*/ zt("IHydrationContext");

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

let as;

let cs;

let us;

class Refs {}

function getRef(t, e) {
    return t.$au?.[e] ?? null;
}

function setRef(t, e, i) {
    (t.$au ??= new Refs)[e] = i;
}

const fs = /*@__PURE__*/ zt("INode");

const ds = /*@__PURE__*/ zt("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(_s, true)) {
        return t.get(_s).host;
    }
    return t.get(re).document;
}))));

const ms = /*@__PURE__*/ zt("IRenderLocation");

const gs = /*@__PURE__*/ zt("CssModules");

const ps = new WeakMap;

function getEffectiveParentNode(t) {
    if (ps.has(t)) {
        return ps.get(t);
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
        if (e.mountTarget === zi.shadowRoot) {
            return getEffectiveParentNode(e.host);
        }
    }
    return t.parentNode;
}

function setEffectiveParentNode(t, e) {
    if (t.platform !== void 0 && !(t instanceof t.platform.Node)) {
        const i = t.childNodes;
        for (let t = 0, s = i.length; t < s; ++t) {
            ps.set(i[t], e);
        }
    } else {
        ps.set(t, e);
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
        let h;
        while (n > s) {
            h = i[s];
            l = h.nextSibling;
            h.remove();
            if (l.nodeType === 8) {
                h = l;
                (l = l.nextSibling).$start = h;
            }
            r[s] = l;
            ++s;
        }
        const a = e.childNodes;
        const c = this.childNodes = Array(n = a.length);
        s = 0;
        while (n > s) {
            c[s] = a[s];
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

const vs = /*@__PURE__*/ zt("IWindow", (t => t.callback((t => t.get(re).window))));

const bs = /*@__PURE__*/ zt("ILocation", (t => t.callback((t => t.get(vs).location))));

const xs = /*@__PURE__*/ zt("IHistory", (t => t.callback((t => t.get(vs).history))));

const registerHostNode = (t, e, i) => {
    registerResolver(t, e.HTMLElement, registerResolver(t, e.Element, registerResolver(t, fs, new v("ElementResolver", i))));
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
    const e = Dt(ks, t);
    if (e === void 0) {
        annotateElementMetadata(t, "containerless", true);
        return;
    }
    e.containerless = true;
}

const ws = new WeakMap;

class CustomElementDefinition {
    get kind() {
        return le;
    }
    constructor(t, e, i, s, n, r, l, h, a, c, u, f, d, m, g, p, v, b, x) {
        this.Type = t;
        this.name = e;
        this.aliases = i;
        this.key = s;
        this.cache = n;
        this.capture = r;
        this.template = l;
        this.instructions = h;
        this.dependencies = a;
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
            const s = C("name", i, Cs);
            if (isFunction(i.Type)) {
                e = i.Type;
            } else {
                e = As(A(s));
            }
            return new CustomElementDefinition(e, s, h(i.aliases), C("key", i, (() => getElementKeyFrom(s))), C("cache", i, returnZero), C("capture", i, returnFalse), C("template", i, returnNull), h(i.instructions), h(i.dependencies), C("injectable", i, returnNull), C("needsCompile", i, returnTrue), h(i.surrogates), Wt.from(e, i.bindables), C("containerless", i, returnFalse), C("shadowOptions", i, returnNull), C("hasSlots", i, returnFalse), C("enhance", i, returnFalse), C("watches", i, returnEmptyArray), B("processContent", e, returnNull));
        }
        if (isString(t)) {
            return new CustomElementDefinition(e, t, h(getElementAnnotation(e, "aliases"), e.aliases), getElementKeyFrom(t), B("cache", e, returnZero), B("capture", e, returnFalse), B("template", e, returnNull), h(getElementAnnotation(e, "instructions"), e.instructions), h(getElementAnnotation(e, "dependencies"), e.dependencies), B("injectable", e, returnNull), B("needsCompile", e, returnTrue), h(getElementAnnotation(e, "surrogates"), e.surrogates), Wt.from(e, ...Wt.getAll(e), getElementAnnotation(e, "bindables"), e.bindables), B("containerless", e, returnFalse), B("shadowOptions", e, returnNull), B("hasSlots", e, returnFalse), B("enhance", e, returnFalse), h(oe.getDefinitions(e), e.watches), B("processContent", e, returnNull));
        }
        const i = C("name", t, Cs);
        return new CustomElementDefinition(e, i, h(getElementAnnotation(e, "aliases"), t.aliases, e.aliases), getElementKeyFrom(i), S("cache", t, e, returnZero), S("capture", t, e, returnFalse), S("template", t, e, returnNull), h(getElementAnnotation(e, "instructions"), t.instructions, e.instructions), h(getElementAnnotation(e, "dependencies"), t.dependencies, e.dependencies), S("injectable", t, e, returnNull), S("needsCompile", t, e, returnTrue), h(getElementAnnotation(e, "surrogates"), t.surrogates, e.surrogates), Wt.from(e, ...Wt.getAll(e), getElementAnnotation(e, "bindables"), e.bindables, t.bindables), S("containerless", t, e, returnFalse), S("shadowOptions", t, e, returnNull), S("hasSlots", t, e, returnFalse), S("enhance", t, e, returnFalse), h(t.watches, oe.getDefinitions(e), e.watches), S("processContent", t, e, returnNull));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) {
            return t;
        }
        if (ws.has(t)) {
            return ws.get(t);
        }
        const e = CustomElementDefinition.create(t);
        ws.set(t, e);
        Ht(ks, e, e.Type);
        return e;
    }
    register(t, e) {
        const i = this.Type;
        const s = typeof e === "string" ? getElementKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(s, false)) {
            t.register(t.has(i, false) ? null : Xt(i, i), Gt(i, s), ...n.map((t => Gt(i, getElementKeyFrom(t)))));
        }
    }
    toString() {
        return `au:ce:${this.name}`;
    }
}

const ys = {
    name: undefined,
    searchParents: false,
    optional: false
};

const returnZero = () => 0;

const returnNull = () => null;

const returnFalse = () => false;

const returnTrue = () => true;

const returnEmptyArray = () => m;

const ks = /*@__PURE__*/ u("custom-element");

const getElementKeyFrom = t => `${ks}:${t}`;

const Cs = /*@__PURE__*/ (() => {
    let t = 0;
    return () => `unnamed-${++t}`;
})();

const annotateElementMetadata = (t, e, i) => {
    Ht(Ot(e), i, t);
};

const defineElement = (t, e) => {
    const i = CustomElementDefinition.create(t, e);
    const s = i.Type;
    Ht(ks, i, s);
    Ht(a, i, s);
    return s;
};

const isElementType = t => isFunction(t) && qt(ks, t);

const findElementControllerFor = (t, e = ys) => {
    if (e.name === void 0 && e.searchParents !== true) {
        const i = getRef(t, ks);
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
            const i = getRef(t, ks);
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
            const t = getRef(i, ks);
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
        const t = getRef(i, ks);
        if (t !== null) {
            return t;
        }
        i = getEffectiveParentNode(i);
    }
    throw createMappedError(765, t);
};

const getElementAnnotation = (t, e) => Dt(Ot(e), t);

const getElementDefinition = t => {
    const e = Dt(ks, t);
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

const As = /*@__PURE__*/ function() {
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
        xt(n, "name", t);
        if (s !== e) {
            mt(n.prototype, s);
        }
        return n;
    };
}();

const Bs = dt({
    name: ks,
    keyFrom: getElementKeyFrom,
    isType: isElementType,
    for: findElementControllerFor,
    define: defineElement,
    getDefinition: getElementDefinition,
    annotate: annotateElementMetadata,
    getAnnotation: getElementAnnotation,
    generateName: Cs,
    createInjectable: createElementInjectable,
    generateType: As,
    find(t, e) {
        const i = getElementKeyFrom(e);
        const s = t.find(i);
        return s == null ? null : Dt(ks, s) ?? null;
    }
});

const Ss = /*@__PURE__*/ Ot("processContent");

function processContent(t) {
    return t === void 0 ? function(t, e, i) {
        Ht(Ss, ensureHook(t, e), t);
    } : function(e) {
        t = ensureHook(e, t);
        const i = Dt(ks, e);
        if (i !== void 0) {
            i.processContent = t;
        } else {
            Ht(Ss, t, e);
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
        return this.T;
    }
    constructor(t, e, i, s = false) {
        this.config = t;
        this.container = e;
        this.le = void 0;
        this.he = s;
        const n = this.host = t.host;
        i.prepare(this);
        registerHostNode(e, this.platform = this.ae(e, n), n);
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
            const h = {
                hydrate: false,
                projections: null
            };
            const a = s ? CustomElementDefinition.create({
                name: Cs(),
                template: this.host,
                enhance: true
            }) : void 0;
            const c = this.T = Controller.$el(i, l, n, h, a);
            c.hE(h, null);
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
        return k(this.le, (() => k(this.ce("activating"), (() => k(this.T.activate(this.T, null, void 0), (() => this.ce("activated")))))));
    }
    deactivate() {
        return k(this.ce("deactivating"), (() => k(this.T.deactivate(this.T, null), (() => this.ce("deactivated")))));
    }
    ce(t) {
        const e = this.container;
        const i = this.he && !e.has(se, false) ? [] : e.getAll(se);
        return y(...i.reduce(((e, i) => {
            if (i.slot === t) {
                e.push(i.run());
            }
            return e;
        }), []));
    }
    ae(t, e) {
        let i;
        if (!t.has(re, false)) {
            if (e.ownerDocument.defaultView === null) {
                throw createMappedError(769);
            }
            i = new lt(e.ownerDocument.defaultView);
            t.register(Kt(re, i));
        } else {
            i = t.get(re);
        }
        return i;
    }
    dispose() {
        this.T?.dispose();
    }
}

const Rs = /*@__PURE__*/ zt("IAurelia");

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
        if (t.has(Rs, true) || t.has(Aurelia, true)) {
            throw createMappedError(768);
        }
        registerResolver(t, Rs, new v("IAurelia", this));
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
                this.has = this.be;
                break;

              case 1:
                this.has = this.xe;
                break;

              default:
                this.has = this.we;
            }
        } else {
            switch (t.length) {
              case 0:
                this.has = this.ye;
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
    ye(t) {
        return false;
    }
    we(t) {
        return !this.chars.includes(t);
    }
    xe(t) {
        return this.chars !== t;
    }
    be(t) {
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
        return this._e ? this.Re[0] : null;
    }
    constructor(t, ...e) {
        this.charSpec = t;
        this.Ie = [];
        this.Te = null;
        this._e = false;
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
        let h = 0;
        let a = 0;
        for (;h < n; ++h) {
            l = s[h];
            if (l.charSpec.has(t)) {
                i.push(l);
                r = l.Re.length;
                a = 0;
                if (l.charSpec.isSymbol) {
                    for (;a < r; ++a) {
                        e.next(l.Re[a]);
                    }
                } else {
                    for (;a < r; ++a) {
                        e.append(l.Re[a], t);
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
        const e = this.Ee = t.length;
        const i = this.Pe = [];
        let s = 0;
        for (;e > s; ++s) {
            i.push(new CharSpec(t[s], false, false, false));
        }
    }
    eachChar(t) {
        const e = this.Ee;
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

const Is = /*@__PURE__*/ zt("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

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
        let h;
        let a;
        let c = 0;
        let u;
        while (e > c) {
            i = this.Me;
            s = t[c];
            n = s.pattern;
            r = new SegmentTypes;
            l = this.qe(s, r);
            h = l.length;
            a = t => i = i.append(t, n);
            for (u = 0; h > u; ++u) {
                l[u].eachChar(a);
            }
            i.Te = r;
            i._e = true;
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
            s = this.He(s, t.charAt(n), e);
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
    He(t, e, i) {
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
        let h = 0;
        let a = "";
        while (l < n) {
            a = s.charAt(l);
            if (r.length === 0 || !r.includes(a)) {
                if (l === h) {
                    if (a === "P" && s.slice(l, l + 4) === "PART") {
                        h = l = l + 4;
                        i.push(new DynamicSegment(r));
                        ++e.dynamics;
                    } else {
                        ++l;
                    }
                } else {
                    ++l;
                }
            } else if (l !== h) {
                i.push(new StaticSegment(s.slice(h, l)));
                ++e.statics;
                h = l;
            } else {
                i.push(new SymbolSegment(s.slice(h, l + 1)));
                ++e.symbols;
                h = ++l;
            }
        }
        if (h !== l) {
            i.push(new StaticSegment(s.slice(h, l)));
            ++e.statics;
        }
        return i;
    }
}

function isEndpoint(t) {
    return t._e;
}

function sortEndpoint(t, e) {
    const i = t.Te;
    const s = e.Te;
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

const Ts = /*@__PURE__*/ zt("IAttributePattern");

const Es = /*@__PURE__*/ zt("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor() {
        this.j = {};
        const t = this.Fe = f(Is);
        const e = Ls.findAll(f(b));
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
            i = this.j[t] = this.Fe.interpret(t);
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
        return Ls.define(t, e);
    };
}

const getAllPatternDefinitions = t => Ps.get(t) ?? m;

const Ps = new WeakMap;

const Ls = dt({
    name: u("attribute-pattern"),
    define(t, e) {
        Ps.set(e, t);
        return g.define(e, (t => {
            Ut(Ts, e).register(t);
        }));
    },
    getPatternDefinitions: getAllPatternDefinitions,
    findAll: t => t.root.getAll(Ts)
});

let Ms = class DotSeparatedAttributePattern {
    "PART.PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], i[1]);
    }
    "PART.PART.PART"(t, e, i) {
        return new AttrSyntax(t, e, `${i[0]}.${i[1]}`, i[2]);
    }
};

Ms = __decorate([ attributePattern({
    pattern: "PART.PART",
    symbols: "."
}, {
    pattern: "PART.PART.PART",
    symbols: "."
}) ], Ms);

let Ds = class RefAttributePattern {
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

Ds = __decorate([ attributePattern({
    pattern: "ref",
    symbols: ""
}, {
    pattern: "PART.ref",
    symbols: "."
}) ], Ds);

let qs = class EventAttributePattern {
    "PART.trigger:PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "trigger", i);
    }
    "PART.capture:PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "capture", i);
    }
};

qs = __decorate([ attributePattern({
    pattern: "PART.trigger:PART",
    symbols: ".:"
}, {
    pattern: "PART.capture:PART",
    symbols: ".:"
}) ], qs);

let Hs = class ColonPrefixedBindAttributePattern {
    ":PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "bind");
    }
};

Hs = __decorate([ attributePattern({
    pattern: ":PART",
    symbols: ":"
}) ], Hs);

let Fs = class AtPrefixedTriggerAttributePattern {
    "@PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "trigger");
    }
    "@PART:PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "trigger", [ i[0], "trigger", ...i.slice(1) ]);
    }
};

Fs = __decorate([ attributePattern({
    pattern: "@PART",
    symbols: "@"
}, {
    pattern: "@PART:PART",
    symbols: "@:"
}) ], Fs);

let Os = class SpreadAttributePattern {
    "...$attrs"(t, e, i) {
        return new AttrSyntax(t, e, "", "...$attrs");
    }
};

Os = __decorate([ attributePattern({
    pattern: "...$attrs",
    symbols: ""
}) ], Os);

const Vs = "None";

const Ns = "IgnoreAttr";

function bindingCommand(t) {
    return function(e) {
        return Ws.define(t, e);
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
        return new BindingCommandDefinition(e, l(getCommandAnnotation(e, "name"), i), h(getCommandAnnotation(e, "aliases"), s.aliases, e.aliases), getCommandKeyFrom(i), l(getCommandAnnotation(e, "type"), s.type, e.type, null));
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

const $s = /*@__PURE__*/ u("binding-command");

const getCommandKeyFrom = t => `${$s}:${t}`;

const getCommandAnnotation = (t, e) => Dt(Ot(e), t);

const Ws = dt({
    name: $s,
    keyFrom: getCommandKeyFrom,
    define(t, e) {
        const i = BindingCommandDefinition.create(t, e);
        const s = i.Type;
        Ht($s, i, s);
        Ht(a, i, s);
        return s;
    },
    getAnnotation: getCommandAnnotation,
    find(t, e) {
        const i = getCommandKeyFrom(e);
        const s = t.find(i);
        return s == null ? null : Dt($s, s) ?? null;
    },
    get(t, e) {
        return t.get(c(getCommandKeyFrom(e)));
    }
});

let js = class OneTimeBindingCommand {
    get type() {
        return Vs;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = t.attr.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? _(n);
        } else {
            if (r === "" && t.def.kind === le) {
                r = _(n);
            }
            n = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, Ct), n, It);
    }
};

js = __decorate([ bindingCommand("one-time") ], js);

let zs = class ToViewBindingCommand {
    get type() {
        return Vs;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = t.attr.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? _(n);
        } else {
            if (r === "" && t.def.kind === le) {
                r = _(n);
            }
            n = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, Ct), n, Tt);
    }
};

zs = __decorate([ bindingCommand("to-view") ], zs);

let Us = class FromViewBindingCommand {
    get type() {
        return Vs;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = s.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? _(n);
        } else {
            if (r === "" && t.def.kind === le) {
                r = _(n);
            }
            n = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, Ct), n, Et);
    }
};

Us = __decorate([ bindingCommand("from-view") ], Us);

let Gs = class TwoWayBindingCommand {
    get type() {
        return Vs;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = s.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? _(n);
        } else {
            if (r === "" && t.def.kind === le) {
                r = _(n);
            }
            n = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, Ct), n, Pt);
    }
};

Gs = __decorate([ bindingCommand("two-way") ], Gs);

let Ks = class DefaultBindingCommand {
    get type() {
        return Vs;
    }
    build(t, e, i) {
        const s = t.attr;
        const n = t.bindable;
        let r;
        let l;
        let h = s.target;
        let a = s.rawValue;
        if (n == null) {
            l = i.isTwoWay(t.node, h) ? Pt : Tt;
            h = i.map(t.node, h) ?? _(h);
        } else {
            if (a === "" && t.def.kind === le) {
                a = _(h);
            }
            r = t.def.defaultBindingMode;
            l = n.mode === Lt || n.mode == null ? r == null || r === Lt ? Tt : r : n.mode;
            h = n.name;
        }
        return new PropertyBindingInstruction(e.parse(a, Ct), h, l);
    }
};

Ks = __decorate([ bindingCommand("bind") ], Ks);

let Xs = class ForBindingCommand {
    get type() {
        return Vs;
    }
    static get inject() {
        return [ Es ];
    }
    constructor(t) {
        this.Oe = t;
    }
    build(t, e) {
        const i = t.bindable === null ? _(t.attr.target) : t.bindable.name;
        const s = e.parse(t.attr.rawValue, yt);
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
};

Xs = __decorate([ bindingCommand("for") ], Xs);

let Qs = class TriggerBindingCommand {
    get type() {
        return Ns;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, kt), t.attr.target, false, t.attr.parts?.[2] ?? null);
    }
};

Qs = __decorate([ bindingCommand("trigger") ], Qs);

let Ys = class CaptureBindingCommand {
    get type() {
        return Ns;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, kt), t.attr.target, true, t.attr.parts?.[2] ?? null);
    }
};

Ys = __decorate([ bindingCommand("capture") ], Ys);

let Zs = class AttrBindingCommand {
    get type() {
        return Ns;
    }
    build(t, e) {
        return new AttributeBindingInstruction(t.attr.target, e.parse(t.attr.rawValue, Ct), t.attr.target);
    }
};

Zs = __decorate([ bindingCommand("attr") ], Zs);

let Js = class StyleBindingCommand {
    get type() {
        return Ns;
    }
    build(t, e) {
        return new AttributeBindingInstruction("style", e.parse(t.attr.rawValue, Ct), t.attr.target);
    }
};

Js = __decorate([ bindingCommand("style") ], Js);

let tn = class ClassBindingCommand {
    get type() {
        return Ns;
    }
    build(t, e) {
        return new AttributeBindingInstruction("class", e.parse(t.attr.rawValue, Ct), t.attr.target);
    }
};

tn = __decorate([ bindingCommand("class") ], tn);

let en = class RefBindingCommand {
    get type() {
        return Ns;
    }
    build(t, e) {
        return new RefBindingInstruction(e.parse(t.attr.rawValue, Ct), t.attr.target);
    }
};

en = __decorate([ bindingCommand("ref") ], en);

let sn = class SpreadBindingCommand {
    get type() {
        return Ns;
    }
    build(t) {
        return new SpreadBindingInstruction;
    }
};

sn = __decorate([ bindingCommand("...$attrs") ], sn);

const nn = /*@__PURE__*/ zt("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

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
        t.register(Ut(this, this), Gt(this, nn));
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
        this.Ne = o("a altGlyph animate animateColor circle clipPath defs ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feFlood feGaussianBlur feImage feMerge feMorphology feOffset feSpecularLighting feTile feTurbulence filter font foreignObject g glyph glyphRef image line linearGradient marker mask missing-glyph path pattern polygon polyline radialGradient rect stop svg switch symbol text textPath tref tspan use");
        this.$e = o("alignment-baseline baseline-shift clip-path clip-rule clip color-interpolation-filters color-interpolation color-profile color-rendering color cursor direction display dominant-baseline enable-background fill-opacity fill-rule fill filter flood-color flood-opacity font-family font-size-adjust font-size font-stretch font-style font-variant font-weight glyph-orientation-horizontal glyph-orientation-vertical image-rendering kerning letter-spacing lighting-color marker-end marker-mid marker-start mask opacity overflow pointer-events shape-rendering stop-color stop-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width stroke text-anchor text-decoration text-rendering unicode-bidi visibility word-spacing writing-mode");
        const t = f(re);
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
        return this.Ne[t.nodeName] === true && this.$e[e] === true || this.Ve[t.nodeName]?.[e] === true;
    }
}

const rn = /*@__PURE__*/ zt("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    constructor() {
        this.fns = [];
        this.We = createLookup();
        this.je = createLookup();
        this.svg = f(nn);
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

const on = createLookup();

class AttributeNSAccessor {
    static forNs(t) {
        return on[t] ??= new AttributeNSAccessor(t);
    }
    constructor(t) {
        this.ns = t;
        this.type = _t | Rt;
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
        this.type = _t | Rt;
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

const ln = new DataAttributeAccessor;

const hn = {
    childList: true,
    subtree: true,
    characterData: true
};

function defaultMatcher$1(t, e) {
    return t === e;
}

class SelectValueObserver {
    constructor(t, e, i, s) {
        this.type = _t | St | Rt;
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
        this.xt();
    }
    xt() {
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
            const h = [];
            while (n < i) {
                r = e[n];
                if (r.selected) {
                    h.push(ft.call(r, "model") ? r.model : r.value);
                }
                ++n;
            }
            let a;
            n = 0;
            while (n < s.length) {
                a = s[n];
                if (h.findIndex((t => !!l(a, t))) === -1) {
                    s.splice(n, 1);
                } else {
                    ++n;
                }
            }
            n = 0;
            while (n < h.length) {
                a = h[n];
                if (s.findIndex((t => !!l(a, t))) === -1) {
                    s.push(a);
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
        (this.Ge = createMutationObserver(this.ut, this.Xe.bind(this))).observe(this.ut, hn);
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
        an = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, an);
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

let an = void 0;

const cn = "--";

class StyleAttributeAccessor {
    constructor(t) {
        this.obj = t;
        this.type = _t | Rt;
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
        this.xt();
    }
    Ye(t) {
        const e = [];
        const i = /url\([^)]+$/;
        let s = 0;
        let n = "";
        let r;
        let l;
        let h;
        let a;
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
            h = n.substring(0, l).trim();
            a = n.substring(l + 1).trim();
            e.push([ h, a ]);
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
                if (s.startsWith(cn)) {
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
    xt() {
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
            let h;
            let a = 0;
            const c = i.length;
            for (;a < c; ++a) {
                r = i[a];
                l = r[0];
                h = r[1];
                this.setProperty(l, h);
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
        this.type = _t | St | Rt;
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
        if (bt(t, this.v)) {
            return;
        }
        this.ov = this.v;
        this.v = t;
        this.ze = true;
        if (!this.cf.readonly) {
            this.xt();
        }
    }
    xt() {
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
        un = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, un);
    }
}

mixinNodeObserverUseConfig(ValueAttributeObserver);

W(ValueAttributeObserver);

let un = void 0;

const dn = "http://www.w3.org/1999/xlink";

const mn = "http://www.w3.org/XML/1998/namespace";

const gn = "http://www.w3.org/2000/xmlns/";

const pn = mt(createLookup(), {
    "xlink:actuate": [ "actuate", dn ],
    "xlink:arcrole": [ "arcrole", dn ],
    "xlink:href": [ "href", dn ],
    "xlink:role": [ "role", dn ],
    "xlink:show": [ "show", dn ],
    "xlink:title": [ "title", dn ],
    "xlink:type": [ "type", dn ],
    "xml:lang": [ "lang", mn ],
    "xml:space": [ "space", mn ],
    xmlns: [ "xmlns", gn ],
    "xmlns:xlink": [ "xlink", gn ]
});

const vn = new Y;

vn.type = _t | Rt;

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
        this.p = f(re);
        this.oi = f(J);
        this.svg = f(nn);
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
            return ln;

          default:
            {
                const i = pn[e];
                if (i !== undefined) {
                    return AttributeNSAccessor.forNs(i[1]);
                }
                if (isDataAttribute(t, e, this.svg)) {
                    return ln;
                }
                return vn;
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
        const n = pn[e];
        if (n !== undefined) {
            return AttributeNSAccessor.forNs(n[1]);
        }
        if (isDataAttribute(t, e, this.svg)) {
            return ln;
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
        this.type = _t | St | Rt;
        this.v = void 0;
        this.ov = void 0;
        this.li = void 0;
        this.hi = void 0;
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
        this.ai();
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
        this.ai();
    }
    gt() {
        this.li?.unsubscribe(this);
        this.hi?.unsubscribe(this);
        this.li = this.hi = void 0;
    }
    Qe() {
        bn = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, bn);
    }
    ai() {
        const t = this.ut;
        (this.hi ??= t.$observers?.model ?? t.$observers?.value)?.subscribe(this);
        this.li?.unsubscribe(this);
        this.li = void 0;
        if (t.type === "checkbox") {
            (this.li = getCollectionObserver(this.v, this.oL))?.subscribe(this);
        }
    }
}

mixinNodeObserverUseConfig(CheckedObserver);

W(CheckedObserver);

let bn = void 0;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) {
            throw createMappedError(9994, e);
        }
        e.useTargetObserver(ln);
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
        if (!(e instanceof PropertyBinding) || !(e.mode & Et)) {
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
        this.di = false;
        this.mi = 0;
        this.gi = f(Re);
        this.l = f(ms);
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

__decorate([ bindable ], If.prototype, "value", void 0);

__decorate([ bindable({
    set: t => t === "" || !!t && t !== "false"
}) ], If.prototype, "cache", void 0);

templateController("if")(If);

class Else {
    constructor() {
        this.f = f(Re);
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

const xn = [ "BindingBehavior", "ValueConverter" ];

class Repeat {
    constructor(t, e, i, s, n) {
        this.views = [];
        this.vi = [];
        this.key = null;
        this.bi = new Map;
        this.xi = new Map;
        this.wi = void 0;
        this.yi = false;
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
                this._i = n;
                let t = r.iterable;
                while (t != null && xn.includes(t.$kind)) {
                    t = t.expression;
                    this.yi = true;
                }
                this.Ci = t;
                break;
            }
        }
        this.Ri();
        const h = r.declaration;
        if (!(this.Bi = h.$kind === "ArrayDestructuring" || h.$kind === "ObjectDestructuring")) {
            this.local = F(h, this.$controller.scope, n, null);
        }
    }
    attaching(t, e) {
        this.Ii();
        return this.Ti(t);
    }
    detaching(t, e) {
        this.Ri();
        return this.Ei(t);
    }
    unbinding(t, e) {
        this.xi.clear();
        this.bi.clear();
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
        if (this.yi) {
            if (this.ki) {
                return;
            }
            this.ki = true;
            this.items = F(this.forOf.iterable, i.scope, this._i, null);
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
            const h = l.length;
            const a = this.forOf;
            const c = a.declaration;
            const u = this._i;
            const f = this.Bi;
            e = it(h);
            let d = 0;
            if (s === 0) {
                for (;d < h; ++d) {
                    e[d] = -2;
                }
            } else if (h === 0) {
                if (f) {
                    for (d = 0; d < s; ++d) {
                        e.deletedIndices.push(d);
                        e.deletedItems.push(F(c, i[d].scope, u, null));
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
                        m[d] = F(c, i[d].scope, u, null);
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
                const y = h - 1;
                const k = new Map;
                const C = new Map;
                const A = this.bi;
                const B = this.xi;
                const S = this.$controller.scope;
                d = 0;
                t: {
                    while (true) {
                        if (r) {
                            g = m[d];
                            p = l[d];
                            v = getKeyValue(A, n, g, getScope(B, g, a, S, u, t, f), u);
                            b = getKeyValue(A, n, p, getScope(B, p, a, S, u, t, f), u);
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
                            v = getKeyValue(A, n, g, getScope(B, g, a, S, u, t, f), u);
                            b = getKeyValue(A, n, p, getScope(B, p, a, S, u, t, f), u);
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
                        b = r ? getKeyValue(A, n, p, getScope(B, p, a, S, u, t, f), u) : p;
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
            const t = k(this.Ei(null), (() => this.Ti(null)));
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
        let i = this.yi;
        let s;
        if (i) {
            e = this.Di = F(this.Ci, t, this._i, null) ?? null;
            i = this.yi = !bt(this.items, e);
        }
        const n = this.wi;
        if (this.$controller.isActive) {
            s = this.wi = st(i ? e : this.items);
            if (n !== s) {
                n?.unsubscribe(this);
                s?.subscribe(this);
            }
        } else {
            n?.unsubscribe(this);
            this.wi = undefined;
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
    Ti(t) {
        let e = void 0;
        let i;
        let s;
        let n;
        const {$controller: r, f: l, local: h, l: a, items: c, xi: u, _i: f, forOf: d, Bi: m} = this;
        const g = r.scope;
        const p = getCount(c);
        const v = this.views = Array(p);
        iterate(c, ((c, b) => {
            s = v[b] = l.create().setLocation(a);
            s.nodes.unlink();
            n = getScope(u, c, d, g, f, h, m);
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
    Ei(t) {
        let e = void 0;
        let i;
        let s;
        let n = 0;
        const {views: r, $controller: l} = this;
        const h = r.length;
        for (;h > n; ++n) {
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
        const h = l.length;
        let a = 0;
        for (;h > a; ++a) {
            s = r[l[a]];
            s.release();
            i = s.deactivate(s, n);
            if (isPromise(i)) {
                (e ?? (e = [])).push(i);
            }
        }
        a = 0;
        for (;h > a; ++a) {
            r.splice(l[a] - a, 1);
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
        const {$controller: h, f: a, local: c, Ai: u, l: f, views: d, Bi: m, _i: g, xi: p, vi: v, forOf: b} = this;
        const x = e.length;
        for (;x > l; ++l) {
            if (e[l] === -2) {
                n = a.create();
                d.splice(l, 0, n);
            }
        }
        if (d.length !== x) {
            throw createMappedError(814, [ d.length, x ]);
        }
        const w = h.scope;
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
                s = n.activate(n, h, r);
                if (isPromise(s)) {
                    (i ?? (i = [])).push(s);
                }
            } else if (_ < 0 || A === 1 || l !== C[_]) {
                if (m) {
                    $(B, n.scope, g, u[l]);
                } else {
                    n.scope.bindingContext[c] = u[l];
                }
                setContextualProperties(n.scope.overrideContext, l, y);
                n.nodes.insertBefore(n.location);
            } else {
                if (m) {
                    $(B, n.scope, g, u[l]);
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

Repeat.inject = [ si, j, ms, ls, Re ];

__decorate([ bindable ], Repeat.prototype, "items", void 0);

templateController("repeat")(Repeat);

let wn = 16;

let yn = new Int32Array(wn);

let kn = new Int32Array(wn);

function longestIncreasingSubsequence(t) {
    const e = t.length;
    if (e > wn) {
        wn = e;
        yn = new Int32Array(e);
        kn = new Int32Array(e);
    }
    let i = 0;
    let s = 0;
    let n = 0;
    let r = 0;
    let l = 0;
    let h = 0;
    let a = 0;
    let c = 0;
    for (;r < e; r++) {
        s = t[r];
        if (s !== -2) {
            l = yn[i];
            n = t[l];
            if (n !== -2 && n < s) {
                kn[r] = l;
                yn[++i] = r;
                continue;
            }
            h = 0;
            a = i;
            while (h < a) {
                c = h + a >> 1;
                n = t[yn[c]];
                if (n !== -2 && n < s) {
                    h = c + 1;
                } else {
                    a = c;
                }
            }
            n = t[yn[h]];
            if (s < n || n === -2) {
                if (h > 0) {
                    kn[r] = yn[h - 1];
                }
                yn[h] = r;
            }
        }
    }
    r = ++i;
    const u = new Int32Array(r);
    s = yn[i - 1];
    while (i-- > 0) {
        u[i] = s;
        s = kn[s];
    }
    while (r-- > 0) yn[r] = 0;
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

const Cn = ut.toString;

const getCount = t => {
    switch (Cn.call(t)) {
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
    switch (Cn.call(t)) {
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
            r = F(e, s, n, null);
        }
        t.set(i, r);
    }
    return r;
};

const getScope = (t, e, i, s, n, r, l) => {
    let h = t.get(e);
    if (h === void 0) {
        if (l) {
            $(i.declaration, h = X.fromParent(s, new nt), n, e);
        } else {
            h = X.fromParent(s, new nt(r, e));
        }
        t.set(e, h);
    }
    return h;
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
        this.view = f(Re).create().setLocation(f(ms));
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

__decorate([ bindable ], With.prototype, "value", void 0);

templateController("with")(With);

let An = class Switch {
    constructor() {
        this.cases = [];
        this.activeCases = [];
        this.promise = void 0;
        this.f = f(Re);
        this.l = f(ms);
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
                return this.Hi(null);
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
        return k(this.Hi(null, n), (() => {
            this.activeCases = n;
            return this.Fi(null);
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
        return k(this.activeCases.length > 0 ? this.Hi(t, i) : void 0, (() => {
            this.activeCases = i;
            if (i.length === 0) {
                return;
            }
            return this.Fi(t);
        }));
    }
    Fi(t) {
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
        return y(...i.map((e => e.activate(t, n))));
    }
    Hi(t, e = []) {
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
        return k(y(...i.reduce(((i, s) => {
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
};

__decorate([ bindable ], An.prototype, "value", void 0);

An = __decorate([ templateController("switch") ], An);

let Bn = 0;

let Sn = class Case {
    constructor() {
        this.id = ++Bn;
        this.fallThrough = false;
        this.view = void 0;
        this.f = f(Re);
        this.ri = f(z);
        this.l = f(ms);
        this.Oi = f(T).scopeTo(`${this.constructor.name}-#${this.id}`);
    }
    link(t, e, i, s) {
        const n = t.parent;
        const r = n?.viewModel;
        if (r instanceof An) {
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
            if (this.wi === void 0) {
                this.wi = this.Vi(e);
            }
            return e.includes(t);
        }
        return e === t;
    }
    valueChanged(t, e) {
        if (isArray(t)) {
            this.wi?.unsubscribe(this);
            this.wi = this.Vi(t);
        } else if (this.wi !== void 0) {
            this.wi.unsubscribe(this);
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
        this.wi?.unsubscribe(this);
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
};

__decorate([ bindable ], Sn.prototype, "value", void 0);

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
    mode: It
}) ], Sn.prototype, "fallThrough", void 0);

Sn = __decorate([ templateController("case") ], Sn);

let _n = class DefaultCase extends Sn {
    linkToSwitch(t) {
        if (t.defaultCase !== void 0) {
            throw createMappedError(816);
        }
        t.defaultCase = this;
    }
};

_n = __decorate([ templateController("default-case") ], _n);

let Rn = class PromiseTemplateController {
    constructor() {
        this.preSettledTask = null;
        this.postSettledTask = null;
        this.f = f(Re);
        this.l = f(ms);
        this.p = f(re);
        this.logger = f(T).scopeTo("promise.resolve");
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
        let h;
        const a = {
            reusable: false
        };
        const $swap = () => {
            void y(h = (this.preSettledTask = i.queueTask((() => y(s?.deactivate(t), n?.deactivate(t), r?.activate(t, l))), a)).result.catch((t => {
                if (!(t instanceof ht)) throw t;
            })), e.then((c => {
                if (this.value !== e) {
                    return;
                }
                const fulfill = () => {
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => y(r?.deactivate(t), n?.deactivate(t), s?.activate(t, l, c))), a)).result;
                };
                if (this.preSettledTask.status === Bt) {
                    void h.then(fulfill);
                } else {
                    this.preSettledTask.cancel();
                    fulfill();
                }
            }), (c => {
                if (this.value !== e) {
                    return;
                }
                const reject = () => {
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => y(r?.deactivate(t), s?.deactivate(t), n?.activate(t, l, c))), a)).result;
                };
                if (this.preSettledTask.status === Bt) {
                    void h.then(reject);
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
};

__decorate([ bindable ], Rn.prototype, "value", void 0);

Rn = __decorate([ templateController("promise") ], Rn);

let In = class PendingTemplateController {
    constructor() {
        this.view = void 0;
        this.f = f(Re);
        this.l = f(ms);
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
    mode: Tt
}) ], In.prototype, "value", void 0);

In = __decorate([ templateController(At) ], In);

let Tn = class FulfilledTemplateController {
    constructor() {
        this.view = void 0;
        this.f = f(Re);
        this.l = f(ms);
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
    mode: Et
}) ], Tn.prototype, "value", void 0);

Tn = __decorate([ templateController("then") ], Tn);

let En = class RejectedTemplateController {
    constructor() {
        this.view = void 0;
        this.f = f(Re);
        this.l = f(ms);
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
    mode: Et
}) ], En.prototype, "value", void 0);

En = __decorate([ templateController("catch") ], En);

function getPromiseController(t) {
    const e = t.parent;
    const i = e?.viewModel;
    if (i instanceof Rn) {
        return i;
    }
    throw createMappedError(813);
}

let Pn = class PromiseAttributePattern {
    "promise.resolve"(t, e) {
        return new AttrSyntax(t, e, "promise", "bind");
    }
};

Pn = __decorate([ attributePattern({
    pattern: "promise.resolve",
    symbols: ""
}) ], Pn);

let Ln = class FulfilledAttributePattern {
    then(t, e) {
        return new AttrSyntax(t, e, "then", "from-view");
    }
};

Ln = __decorate([ attributePattern({
    pattern: "then",
    symbols: ""
}) ], Ln);

let Mn = class RejectedAttributePattern {
    catch(t, e) {
        return new AttrSyntax(t, e, "catch", "from-view");
    }
};

Mn = __decorate([ attributePattern({
    pattern: "catch",
    symbols: ""
}) ], Mn);

class Focus {
    constructor() {
        this.Ni = false;
        this.$i = f(fs);
        this.p = f(re);
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) {
            this.Wi();
        } else {
            this.Ni = true;
        }
    }
    attached() {
        if (this.Ni) {
            this.Ni = false;
            this.Wi();
        }
        this.$i.addEventListener("focus", this);
        this.$i.addEventListener("blur", this);
    }
    detaching() {
        const t = this.$i;
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
        const t = this.$i;
        const e = this.ji;
        const i = this.value;
        if (i && !e) {
            t.focus();
        } else if (!i && e) {
            t.blur();
        }
    }
    get ji() {
        return this.$i === this.p.document.activeElement;
    }
}

__decorate([ bindable({
    mode: Pt
}) ], Focus.prototype, "value", void 0);

customAttribute("focus")(Focus);

class Portal {
    constructor() {
        this.position = "beforeend";
        this.strict = false;
        const t = f(Re);
        const e = f(ms);
        const i = f(re);
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

let Dn;

let qn = class AuSlot {
    constructor() {
        this.ss = null;
        this.rs = null;
        this.Xt = false;
        this.expose = null;
        this.slotchange = null;
        this.os = new Set;
        this.wi = null;
        const t = f(hs);
        const e = f(ms);
        const i = f(si);
        const s = f(Ei);
        const n = this.name = i.data.name;
        const r = i.projections?.[Ee];
        const l = t.instruction?.projections?.[n];
        const h = t.controller.container;
        let a;
        let c;
        if (l == null) {
            c = h.createChild({
                inheritParentResources: true
            });
            a = s.getViewFactory(r ?? (Dn ??= CustomElementDefinition.create({
                name: "au-slot-empty-template",
                template: "",
                needsCompile: false
            })), c);
            this.ls = false;
        } else {
            c = h.createChild();
            c.useResources(t.parent.controller.container);
            registerResolver(c, hs, new v(void 0, t.parent));
            a = s.getViewFactory(l, c);
            this.ls = true;
            this.cs = h.getAll(Me, false)?.filter((t => t.slotName === "*" || t.slotName === n)) ?? m;
        }
        this.us = (this.cs ??= m).length > 0;
        this.ds = t;
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
                this.ai();
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
    ai() {
        if (this.wi != null) {
            return;
        }
        const t = this.l;
        const e = t.parentElement;
        if (e == null) {
            return;
        }
        (this.wi = createMutationObserver(e, (e => {
            if (isMutationWithinLocation(t, e)) {
                this.gs();
            }
        }))).observe(e, {
            childList: true
        });
    }
    ps() {
        this.wi?.disconnect();
        this.wi = null;
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
};

__decorate([ bindable ], qn.prototype, "expose", void 0);

__decorate([ bindable ], qn.prototype, "slotchange", void 0);

qn = __decorate([ customElement({
    name: "au-slot",
    template: null,
    containerless: true,
    processContent(t, e, i) {
        i.name = t.getAttribute("name") ?? Ee;
        let s = t.firstChild;
        let n = null;
        while (s !== null) {
            n = s.nextSibling;
            if (isElement(s) && s.hasAttribute(Pe)) {
                t.removeChild(s);
            }
            s = n;
        }
    }
}) ], qn);

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
        this.c = f(b);
        this.parent = f(ls);
        this.bs = f(fs);
        this.l = f(ms);
        this.p = f(re);
        this.r = f(Ei);
        this.xs = f(si);
        this.ws = f(E(CompositionContextFactory));
        this.it = f(ni);
        this.J = f(hs);
        this.ep = f(j);
        this.oL = f(z);
    }
    get composing() {
        return this.ys;
    }
    get composition() {
        return this.vs;
    }
    attaching(t, e) {
        return this.ys = k(this.queue(new ChangeInfo(this.template, this.component, this.model, void 0), t), (t => {
            if (this.ws.ks(t)) {
                this.ys = void 0;
            }
        }));
    }
    detaching(t) {
        const e = this.vs;
        const i = this.ys;
        this.ws.invalidate();
        this.vs = this.ys = void 0;
        return k(i, (() => e?.deactivate(t)));
    }
    propertyChanged(t) {
        if (t === "composing" || t === "composition") return;
        if (t === "model" && this.vs != null) {
            this.vs.update(this.model);
            return;
        }
        if (t === "tag" && this.vs?.controller.vmKind === Qi) {
            return;
        }
        this.ys = k(this.ys, (() => k(this.queue(new ChangeInfo(this.template, this.component, this.model, t), void 0), (t => {
            if (this.ws.ks(t)) {
                this.ys = void 0;
            }
        }))));
    }
    queue(t, e) {
        const i = this.ws;
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
        const {c: n, $controller: r, l: l, xs: h} = this;
        const a = this.Ss(this.J.controller.container, i);
        const c = n.createChild();
        const u = this.p.document.createElement(a == null ? this.tag ?? "div" : a.name);
        l.parentNode.insertBefore(u, l);
        let f;
        if (a == null) {
            f = this.tag == null ? convertToRenderLocation(u) : null;
        } else {
            f = a.containerless ? convertToRenderLocation(u) : null;
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
        const d = this._s(c, typeof i === "string" ? a.Type : i, u, f);
        const compose = () => {
            const i = h.captures ?? m;
            if (a !== null) {
                const e = a.capture;
                const [s, n] = i.reduce(((t, i) => {
                    const s = !(i.target in a.bindables) && (e === true || isFunction(e) && !!e(i.target));
                    t[s ? 0 : 1].push(i);
                    return t;
                }), [ [], [] ]);
                const l = Controller.$el(c, d, u, {
                    projections: h.projections,
                    captures: s
                }, a, f);
                this.Rs(u, a, n).forEach((t => l.addBinding(t)));
                return new CompositionController(l, (t => l.activate(t ?? l, r, r.scope.parent)), (t => k(l.deactivate(t ?? l, r), removeCompositionHost)), (t => d.activate?.(t)), t);
            } else {
                const s = CustomElementDefinition.create({
                    name: Bs.generateName(),
                    template: e
                });
                const n = this.r.getViewFactory(s, c);
                const l = Controller.$view(n, r);
                const h = this.scopeBehavior === "auto" ? X.fromParent(this.parent.scope, d) : X.create(d);
                l.setHost(u);
                if (f == null) {
                    this.Rs(u, s, i).forEach((t => l.addBinding(t)));
                } else {
                    l.setLocation(f);
                }
                return new CompositionController(l, (t => l.activate(t ?? l, r, h)), (t => k(l.deactivate(t ?? l, r), removeCompositionHost)), (t => d.activate?.(t)), t);
            }
        };
        if ("activate" in d) {
            return k(d.activate(s), (() => compose()));
        } else {
            return compose();
        }
    }
    _s(t, e, i, s) {
        if (e == null) {
            return new EmptyComponent;
        }
        if (typeof e === "object") {
            return e;
        }
        const n = this.p;
        registerHostNode(t, n, i);
        registerResolver(t, ms, new v("IRenderLocation", s));
        const r = t.invoke(e);
        registerResolver(t, e, new v("au-compose.component", r));
        return r;
    }
    Ss(t, e) {
        if (typeof e === "string") {
            const i = Bs.find(t, e);
            if (i == null) {
                throw createMappedError(806, e);
            }
            return i;
        }
        const i = isFunction(e) ? e : e?.constructor;
        return Bs.isType(i) ? Bs.getDefinition(i) : null;
    }
    Rs(t, e, i) {
        const s = new HydrationContext(this.$controller, {
            projections: null,
            captures: i
        }, this.J.parent);
        return SpreadBinding.create(s, t, e, this.r, this.it, this.p, this.ep, this.oL);
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
    mode: Et
}) ], AuCompose.prototype, "composing", null);

__decorate([ bindable({
    mode: Et
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

const Hn = /*@__PURE__*/ zt("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw createMappedError(99, "sanitize");
    }
})));

class SanitizeValueConverter {
    constructor() {
        this.Ts = f(Hn);
    }
    toView(t) {
        if (t == null) {
            return null;
        }
        return this.Ts.sanitize(t);
    }
}

valueConverter("sanitize")(SanitizeValueConverter);

const Fn = /*@__PURE__*/ zt("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const On = {};

class TemplateElementFactory {
    constructor() {
        this.p = f(re);
        this.Cs = this.t();
    }
    t() {
        return this.p.document.createElement("template");
    }
    createTemplate(t) {
        if (isString(t)) {
            let e = On[t];
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
                On[t] = e;
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
        t.register(Ut(this, this), Gt(this, ni));
    }
    compile(t, e, i) {
        const s = CustomElementDefinition.getOrCreate(t);
        if (s.template === null || s.template === void 0) {
            return s;
        }
        if (s.needsCompile === false) {
            return s;
        }
        i ??= Wn;
        const n = new CompilationContext(t, e, i, null, null, void 0);
        const r = isString(s.template) || !t.enhance ? n.Es.createTemplate(s.template) : s.template;
        const l = r.nodeName === Vn && r.content != null;
        const h = l ? r.content : r;
        const a = Zn.findAll(e);
        const c = a.length;
        let u = 0;
        if (c > 0) {
            while (c > u) {
                a[u].compiling?.(r);
                ++u;
            }
        }
        if (r.hasAttribute(Qn)) {
            throw createMappedError(701, s);
        }
        this.Ps(h, n);
        this.Ls(h, n);
        const f = CustomElementDefinition.create({
            ...t,
            name: t.name || Cs(),
            dependencies: (t.dependencies ?? m).concat(n.deps ?? m),
            instructions: n.rows,
            surrogates: l ? this.Ms(r, n) : m,
            template: r,
            hasSlots: n.hasSlot,
            needsCompile: false
        });
        if (n.deps != null) {
            const t = [ f.Type, ...f.dependencies, ...n.deps ];
            for (const e of n.deps) {
                getElementDefinition(e).dependencies.push(...t.filter((t => t !== e)));
            }
        }
        return f;
    }
    compileSpread(t, e, i, s, n) {
        const r = new CompilationContext(t, i, Wn, null, null, void 0);
        const l = [];
        const h = n ?? r.Ds(s.nodeName.toLowerCase());
        const a = h !== null;
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
        let C;
        let A;
        for (;u > f; ++f) {
            d = e[f];
            C = d.target;
            A = d.rawValue;
            w = r.qs(d);
            if (w !== null && w.type === Ns) {
                zn.node = s;
                zn.attr = d;
                zn.bindable = null;
                zn.def = null;
                l.push(w.build(zn, r.ep, r.m));
                continue;
            }
            m = r.Hs(C);
            if (m !== null) {
                if (m.isTemplateController) {
                    throw createMappedError(9998, C);
                }
                v = BindablesInfo.from(m, true);
                k = m.noMultiBindings === false && w === null && hasInlineBindings(A);
                if (k) {
                    p = this.Fs(s, A, m, r);
                } else {
                    x = v.primary;
                    if (w === null) {
                        y = c.parse(A, wt);
                        p = [ y === null ? new SetPropertyInstruction(A, x.name) : new InterpolationInstruction(y, x.name) ];
                    } else {
                        zn.node = s;
                        zn.attr = d;
                        zn.bindable = x;
                        zn.def = m;
                        p = [ w.build(zn, r.ep, r.m) ];
                    }
                }
                (g ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? m : m.name, m.aliases != null && m.aliases.includes(C) ? C : void 0, p));
                continue;
            }
            if (w === null) {
                y = c.parse(A, wt);
                if (a) {
                    v = BindablesInfo.from(h, false);
                    b = v.attrs[C];
                    if (b !== void 0) {
                        y = c.parse(A, wt);
                        l.push(new SpreadElementPropBindingInstruction(y == null ? new SetPropertyInstruction(A, b.name) : new InterpolationInstruction(y, b.name)));
                        continue;
                    }
                }
                if (y != null) {
                    l.push(new InterpolationInstruction(y, r.m.map(s, C) ?? _(C)));
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
                if (a) {
                    v = BindablesInfo.from(h, false);
                    b = v.attrs[C];
                    if (b !== void 0) {
                        zn.node = s;
                        zn.attr = d;
                        zn.bindable = b;
                        zn.def = h;
                        l.push(new SpreadElementPropBindingInstruction(w.build(zn, r.ep, r.m)));
                        continue;
                    }
                }
                zn.node = s;
                zn.attr = d;
                zn.bindable = null;
                zn.def = null;
                l.push(w.build(zn, r.ep, r.m));
            }
        }
        resetCommandBuildInfo();
        if (g != null) {
            return g.concat(l);
        }
        return l;
    }
    Ms(t, e) {
        const i = [];
        const s = t.attributes;
        const n = e.ep;
        let r = s.length;
        let l = 0;
        let h;
        let a;
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
            h = s[l];
            a = h.name;
            c = h.value;
            u = e.Oe.parse(a, c);
            w = u.target;
            y = u.rawValue;
            if (Un[w]) {
                throw createMappedError(702, a);
            }
            v = e.qs(u);
            if (v !== null && v.type === Ns) {
                zn.node = t;
                zn.attr = u;
                zn.bindable = null;
                zn.def = null;
                i.push(v.build(zn, e.ep, e.m));
                continue;
            }
            f = e.Hs(w);
            if (f !== null) {
                if (f.isTemplateController) {
                    throw createMappedError(703, w);
                }
                g = BindablesInfo.from(f, true);
                x = f.noMultiBindings === false && v === null && hasInlineBindings(y);
                if (x) {
                    m = this.Fs(t, y, f, e);
                } else {
                    p = g.primary;
                    if (v === null) {
                        b = n.parse(y, wt);
                        m = b === null ? y === "" ? [] : [ new SetPropertyInstruction(y, p.name) ] : [ new InterpolationInstruction(b, p.name) ];
                    } else {
                        zn.node = t;
                        zn.attr = u;
                        zn.bindable = p;
                        zn.def = f;
                        m = [ v.build(zn, e.ep, e.m) ];
                    }
                }
                t.removeAttribute(a);
                --l;
                --r;
                (d ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? f : f.name, f.aliases != null && f.aliases.includes(w) ? w : void 0, m));
                continue;
            }
            if (v === null) {
                b = n.parse(y, wt);
                if (b != null) {
                    t.removeAttribute(a);
                    --l;
                    --r;
                    i.push(new InterpolationInstruction(b, e.m.map(t, w) ?? _(w)));
                } else {
                    switch (a) {
                      case "class":
                        i.push(new SetClassAttributeInstruction(y));
                        break;

                      case "style":
                        i.push(new SetStyleAttributeInstruction(y));
                        break;

                      default:
                        i.push(new SetAttributeInstruction(y, a));
                    }
                }
            } else {
                zn.node = t;
                zn.attr = u;
                zn.bindable = null;
                zn.def = null;
                i.push(v.build(zn, e.ep, e.m));
            }
        }
        resetCommandBuildInfo();
        if (d != null) {
            return d.concat(i);
        }
        return i;
    }
    Ls(t, e) {
        switch (t.nodeType) {
          case 1:
            switch (t.nodeName) {
              case "LET":
                return this.Os(t, e);

              default:
                return this.Vs(t, e);
            }

          case 3:
            return this.Ns(t, e);

          case 11:
            {
                let i = t.firstChild;
                while (i !== null) {
                    i = this.Ls(i, e);
                }
                break;
            }
        }
        return t.nextSibling;
    }
    Os(t, e) {
        const i = t.attributes;
        const s = i.length;
        const n = [];
        const r = e.ep;
        let l = false;
        let h = 0;
        let a;
        let c;
        let u;
        let f;
        let d;
        let m;
        let g;
        let p;
        for (;s > h; ++h) {
            a = i[h];
            u = a.name;
            f = a.value;
            if (u === "to-binding-context") {
                l = true;
                continue;
            }
            c = e.Oe.parse(u, f);
            m = c.target;
            g = c.rawValue;
            d = e.qs(c);
            if (d !== null) {
                if (c.command === "bind") {
                    n.push(new LetBindingInstruction(r.parse(g, Ct), _(m)));
                } else {
                    throw createMappedError(704, c);
                }
                continue;
            }
            p = r.parse(g, wt);
            n.push(new LetBindingInstruction(p === null ? new rt(g) : p, _(m)));
        }
        e.rows.push([ new HydrateLetElementInstruction(n, l) ]);
        return this.$s(t, e).nextSibling;
    }
    Vs(t, e) {
        const i = t.nextSibling;
        const n = (t.getAttribute("as-element") ?? t.nodeName).toLowerCase();
        const r = e.Ds(n);
        const l = r !== null;
        const h = l && r.shadowOptions != null;
        const a = r?.capture;
        const c = a != null && typeof a !== "boolean";
        const u = a ? [] : m;
        const f = e.ep;
        const d = this.debug ? s : () => {
            t.removeAttribute(w);
            --b;
            --v;
        };
        let g = t.attributes;
        let p;
        let v = g.length;
        let b = 0;
        let x;
        let w;
        let y;
        let k;
        let C;
        let A;
        let B = null;
        let S = false;
        let R;
        let I;
        let T;
        let E;
        let P;
        let L;
        let M;
        let D = null;
        let q;
        let H;
        let F;
        let O;
        let V = true;
        let N = false;
        let $ = false;
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
        for (;v > b; ++b) {
            x = g[b];
            w = x.name;
            y = x.value;
            switch (w) {
              case "as-element":
              case "containerless":
                d();
                if (!N) {
                    N = w === "containerless";
                }
                continue;
            }
            k = e.Oe.parse(w, y);
            D = e.qs(k);
            F = k.target;
            O = k.rawValue;
            if (a && (!c || c && a(F))) {
                if (D != null && D.type === Ns) {
                    d();
                    u.push(k);
                    continue;
                }
                $ = F !== Pe && F !== "slot";
                if ($) {
                    q = BindablesInfo.from(r, false);
                    if (q.attrs[F] == null && !e.Hs(F)?.isTemplateController) {
                        d();
                        u.push(k);
                        continue;
                    }
                }
            }
            if (D?.type === Ns) {
                zn.node = t;
                zn.attr = k;
                zn.bindable = null;
                zn.def = null;
                (C ??= []).push(D.build(zn, e.ep, e.m));
                d();
                continue;
            }
            if (l) {
                q = BindablesInfo.from(r, false);
                R = q.attrs[F];
                if (R !== void 0) {
                    if (D === null) {
                        L = f.parse(O, wt);
                        (A ??= []).push(L == null ? new SetPropertyInstruction(O, R.name) : new InterpolationInstruction(L, R.name));
                    } else {
                        zn.node = t;
                        zn.attr = k;
                        zn.bindable = R;
                        zn.def = r;
                        (A ??= []).push(D.build(zn, e.ep, e.m));
                    }
                    d();
                    continue;
                }
            }
            B = e.Hs(F);
            if (B !== null) {
                q = BindablesInfo.from(B, true);
                S = B.noMultiBindings === false && D === null && hasInlineBindings(O);
                if (S) {
                    T = this.Fs(t, O, B, e);
                } else {
                    H = q.primary;
                    if (D === null) {
                        L = f.parse(O, wt);
                        T = L === null ? O === "" ? [] : [ new SetPropertyInstruction(O, H.name) ] : [ new InterpolationInstruction(L, H.name) ];
                    } else {
                        zn.node = t;
                        zn.attr = k;
                        zn.bindable = H;
                        zn.def = B;
                        T = [ D.build(zn, e.ep, e.m) ];
                    }
                }
                d();
                if (B.isTemplateController) {
                    (E ??= []).push(new HydrateTemplateController(jn, this.resolveResources ? B : B.name, void 0, T));
                } else {
                    (I ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? B : B.name, B.aliases != null && B.aliases.includes(F) ? F : void 0, T));
                }
                continue;
            }
            if (D === null) {
                L = f.parse(O, wt);
                if (L != null) {
                    d();
                    (C ??= []).push(new InterpolationInstruction(L, e.m.map(t, F) ?? _(F)));
                }
                continue;
            }
            zn.node = t;
            zn.attr = k;
            zn.bindable = null;
            zn.def = null;
            (C ??= []).push(D.build(zn, e.ep, e.m));
            d();
        }
        resetCommandBuildInfo();
        if (this.Ws(t, C) && C != null && C.length > 1) {
            this.js(t, C);
        }
        if (l) {
            M = new HydrateElementInstruction(this.resolveResources ? r : r.name, A ?? m, null, N, u, j);
        }
        if (C != null || M != null || I != null) {
            p = m.concat(M ?? m, I ?? m, C ?? m);
            W = true;
        }
        let z;
        if (E != null) {
            v = E.length - 1;
            b = v;
            P = E[b];
            let i;
            if (isMarker(t)) {
                i = e.t();
                appendManyToTemplate(i, [ e.ct(), e.zs(Nn), e.zs($n) ]);
            } else {
                this.Us(t, e);
                if (t.nodeName === "TEMPLATE") {
                    i = t;
                } else {
                    i = e.t();
                    appendToTemplate(i, t);
                }
            }
            const s = i;
            const a = e.Gs(p == null ? [] : [ p ]);
            let c;
            let u;
            let f = false;
            let d;
            let m;
            let g;
            let x;
            let w;
            let y;
            let k = 0, C = 0;
            let A = t.firstChild;
            let B = false;
            if (V !== false) {
                while (A !== null) {
                    u = isElement(A) ? A.getAttribute(Pe) : null;
                    f = u !== null || l && !h;
                    c = A.nextSibling;
                    if (f) {
                        if (!l) {
                            throw createMappedError(706, u, n);
                        }
                        A.removeAttribute?.(Pe);
                        B = isTextNode(A) && A.textContent.trim() === "";
                        if (!B) {
                            ((m ??= {})[u || Ee] ??= []).push(A);
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
                        x = g[k];
                        if (x.nodeName === "TEMPLATE") {
                            if (x.attributes.length > 0) {
                                appendToTemplate(i, x);
                            } else {
                                appendToTemplate(i, x.content);
                            }
                        } else {
                            appendToTemplate(i, x);
                        }
                    }
                    y = e.Gs();
                    this.Ls(i.content, y);
                    d[u] = CustomElementDefinition.create({
                        name: Cs(),
                        template: i,
                        instructions: y.rows,
                        needsCompile: false
                    });
                }
                M.projections = d;
            }
            if (W) {
                if (l && (N || r.containerless)) {
                    this.Us(t, e);
                } else {
                    this.$s(t, e);
                }
            }
            z = !l || !r.containerless && !N && V !== false;
            if (z) {
                if (t.nodeName === Vn) {
                    this.Ls(t.content, a);
                } else {
                    A = t.firstChild;
                    while (A !== null) {
                        A = this.Ls(A, a);
                    }
                }
            }
            P.def = CustomElementDefinition.create({
                name: Cs(),
                template: s,
                instructions: a.rows,
                needsCompile: false
            });
            while (b-- > 0) {
                P = E[b];
                i = e.t();
                w = e.ct();
                appendManyToTemplate(i, [ w, e.zs(Nn), e.zs($n) ]);
                P.def = CustomElementDefinition.create({
                    name: Cs(),
                    template: i,
                    needsCompile: false,
                    instructions: [ [ E[b + 1] ] ]
                });
            }
            e.rows.push([ P ]);
        } else {
            if (p != null) {
                e.rows.push(p);
            }
            let i = t.firstChild;
            let s;
            let a;
            let c = false;
            let u = null;
            let f;
            let d;
            let m;
            let g;
            let v;
            let b = false;
            let x = 0, w = 0;
            if (V !== false) {
                while (i !== null) {
                    a = isElement(i) ? i.getAttribute(Pe) : null;
                    c = a !== null || l && !h;
                    s = i.nextSibling;
                    if (c) {
                        if (!l) {
                            throw createMappedError(706, a, n);
                        }
                        i.removeAttribute?.(Pe);
                        b = isTextNode(i) && i.textContent.trim() === "";
                        if (!b) {
                            ((f ??= {})[a || Ee] ??= []).push(i);
                        }
                        t.removeChild(i);
                    }
                    i = s;
                }
            }
            if (f != null) {
                u = {};
                for (a in f) {
                    g = e.t();
                    d = f[a];
                    for (x = 0, w = d.length; w > x; ++x) {
                        m = d[x];
                        if (m.nodeName === Vn) {
                            if (m.attributes.length > 0) {
                                appendToTemplate(g, m);
                            } else {
                                appendToTemplate(g, m.content);
                            }
                        } else {
                            appendToTemplate(g, m);
                        }
                    }
                    v = e.Gs();
                    this.Ls(g.content, v);
                    u[a] = CustomElementDefinition.create({
                        name: Cs(),
                        template: g,
                        instructions: v.rows,
                        needsCompile: false
                    });
                }
                M.projections = u;
            }
            if (W) {
                if (l && (N || r.containerless)) {
                    this.Us(t, e);
                } else {
                    this.$s(t, e);
                }
            }
            z = !l || !r.containerless && !N && V !== false;
            if (z && t.childNodes.length > 0) {
                i = t.firstChild;
                while (i !== null) {
                    i = this.Ls(i, e);
                }
            }
        }
        return i;
    }
    Ns(t, e) {
        const i = t.parentNode;
        const s = e.ep.parse(t.textContent, wt);
        const n = t.nextSibling;
        let r;
        let l;
        let h;
        let a;
        let c;
        if (s !== null) {
            ({parts: r, expressions: l} = s);
            if (c = r[0]) {
                insertBefore(i, e.Ks(c), t);
            }
            for (h = 0, a = l.length; a > h; ++h) {
                insertManyBefore(i, t, [ e.ct(), e.Ks(" ") ]);
                if (c = r[h + 1]) {
                    insertBefore(i, e.Ks(c), t);
                }
                e.rows.push([ new TextBindingInstruction(l[h]) ]);
            }
            i.removeChild(t);
        }
        return n;
    }
    Fs(t, e, i, s) {
        const n = BindablesInfo.from(i, true);
        const r = e.length;
        const l = [];
        let h = void 0;
        let a = void 0;
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
                h = e.slice(c, p);
                while (e.charCodeAt(++p) <= 32) ;
                c = p;
                for (;p < r; ++p) {
                    u = e.charCodeAt(p);
                    if (u === 92) {
                        ++p;
                    } else if (u === 59) {
                        a = e.slice(c, p);
                        break;
                    }
                }
                if (a === void 0) {
                    a = e.slice(c);
                }
                d = s.Oe.parse(h, a);
                m = s.qs(d);
                g = n.attrs[d.target];
                if (g == null) {
                    throw createMappedError(707, d.target, i.name);
                }
                if (m === null) {
                    f = s.ep.parse(a, wt);
                    l.push(f === null ? new SetPropertyInstruction(a, g.name) : new InterpolationInstruction(f, g.name));
                } else {
                    zn.node = t;
                    zn.attr = d;
                    zn.bindable = g;
                    zn.def = i;
                    l.push(m.build(zn, s.ep, s.m));
                }
                while (p < r && e.charCodeAt(++p) <= 32) ;
                c = p;
                h = void 0;
                a = void 0;
            }
        }
        resetCommandBuildInfo();
        return l;
    }
    Ps(t, e) {
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
            const h = P(r.querySelectorAll("bindable"));
            const a = new Set;
            const c = new Set;
            const u = h.reduce(((t, e) => {
                if (e.parentNode !== r) {
                    throw createMappedError(710, n);
                }
                const i = e.getAttribute("name");
                if (i === null) {
                    throw createMappedError(711, e, n);
                }
                const s = e.getAttribute("attribute");
                if (s !== null && c.has(s) || a.has(i)) {
                    throw createMappedError(712, a, s);
                } else {
                    if (s !== null) {
                        c.add(s);
                    }
                    a.add(i);
                }
                const l = P(e.attributes).filter((t => !Xn.includes(t.name)));
                if (l.length > 0) ;
                e.remove();
                t[i] = {
                    attribute: s ?? void 0,
                    mode: getBindingMode(e)
                };
                return t;
            }), {});
            class LocalTemplateType {}
            xt(LocalTemplateType, "name", {
                value: n
            });
            e.Xs(defineElement({
                name: n,
                template: t,
                bindables: u
            }, LocalTemplateType));
            s.removeChild(t);
        }
    }
    Ws(t, e) {
        const i = t.nodeName;
        return i === "INPUT" && Gn[t.type] === 1 || i === "SELECT" && (t.hasAttribute("multiple") || e?.some((t => t.type === $e && t.to === "multiple")));
    }
    js(t, e) {
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
    $s(t, e) {
        insertBefore(t.parentNode, e.zs("au*"), t);
        return t;
    }
    Us(t, e) {
        if (isMarker(t)) {
            return t;
        }
        const i = t.parentNode;
        const s = e.ct();
        insertManyBefore(i, t, [ s, e.zs(Nn), e.zs($n) ]);
        i.removeChild(t);
        return s;
    }
}

const Vn = "TEMPLATE";

const Nn = "au-start";

const $n = "au-end";

const isMarker = t => t.nodeValue === "au*";

class CompilationContext {
    constructor(t, e, i, s, n, r) {
        this.hasSlot = false;
        this.Qs = createLookup();
        const l = s !== null;
        this.c = e;
        this.root = n === null ? this : n;
        this.def = t;
        this.ci = i;
        this.parent = s;
        this.Es = l ? s.Es : e.get(Fn);
        this.Oe = l ? s.Oe : e.get(Es);
        this.ep = l ? s.ep : e.get(j);
        this.m = l ? s.m : e.get(rn);
        this.Oi = l ? s.Oi : e.get(T);
        this.p = l ? s.p : e.get(re);
        this.localEls = l ? s.localEls : new Set;
        this.rows = r ?? [];
    }
    Xs(t) {
        (this.root.deps ??= []).push(t);
        this.root.c.register(t);
        return t;
    }
    Ks(t) {
        return createText(this.p, t);
    }
    zs(t) {
        return createComment(this.p, t);
    }
    ct() {
        return this.zs("au*");
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
    Ds(t) {
        return Bs.find(this.c, t);
    }
    Hs(t) {
        return ce.find(this.c, t);
    }
    Gs(t) {
        return new CompilationContext(this.def, this.c, this.ci, this, this.root, t);
    }
    qs(t) {
        if (this.root !== this) {
            return this.root.qs(t);
        }
        const e = t.command;
        if (e === null) {
            return null;
        }
        let i = this.Qs[e];
        let s;
        if (i === void 0) {
            s = Ws.find(this.c, e);
            if (s == null) {
                throw createMappedError(713, e);
            }
            this.Qs[e] = i = Ws.get(this.c, e);
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
    zn.node = zn.attr = zn.bindable = zn.def = null;
};

const Wn = {
    projections: null
};

const jn = {
    name: "unnamed"
};

const zn = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const Un = mt(createLookup(), {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
});

const Gn = {
    checkbox: 1,
    radio: 1
};

const Kn = new WeakMap;

class BindablesInfo {
    static from(t, e) {
        let i = Kn.get(t);
        if (i == null) {
            const s = t.bindables;
            const n = createLookup();
            const r = e ? t.defaultBindingMode === void 0 ? Lt : t.defaultBindingMode : Lt;
            let l;
            let h;
            let a = false;
            let c;
            let u;
            for (h in s) {
                l = s[h];
                u = l.attribute;
                if (l.primary === true) {
                    if (a) {
                        throw createMappedError(714, t);
                    }
                    a = true;
                    c = l;
                } else if (!a && c == null) {
                    c = l;
                }
                n[u] = BindableDefinition.create(h, t.Type, l);
            }
            if (l == null && e) {
                c = n.value = BindableDefinition.create("value", t.Type, {
                    mode: r
                });
            }
            Kn.set(t, i = new BindablesInfo(n, s, c));
        }
        return i;
    }
    constructor(t, e, i) {
        this.attrs = t;
        this.bindables = e;
        this.primary = i;
    }
}

const Xn = dt([ "name", "attribute", "mode" ]);

const Qn = "as-custom-element";

const processTemplateName = (t, e, i) => {
    const s = e.getAttribute(Qn);
    if (s === null || s === "") {
        throw createMappedError(715, t);
    }
    if (i.has(s)) {
        throw createMappedError(716, s, t);
    } else {
        i.add(s);
        e.removeAttribute(Qn);
    }
    return s;
};

const getBindingMode = t => {
    switch (t.getAttribute("mode")) {
      case "oneTime":
        return It;

      case "toView":
        return Tt;

      case "fromView":
        return Et;

      case "twoWay":
        return Pt;

      case "default":
      default:
        return Lt;
    }
};

const Yn = /*@__PURE__*/ zt("ITemplateCompilerHooks");

const Zn = dt({
    name: /*@__PURE__*/ u("compiler-hooks"),
    define(t) {
        return g.define(t, (function(t) {
            Ut(Yn, this).register(t);
        }));
    },
    findAll(t) {
        return t.get(L(Yn));
    }
});

const templateCompilerHooks = t => {
    return t === void 0 ? decorator : decorator(t);
    function decorator(t) {
        return Zn.define(t);
    }
};

class Show {
    constructor() {
        this.el = f(fs);
        this.p = f(re);
        this.Ys = false;
        this.I = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.I = null;
            if (Boolean(this.value) !== this.Zs) {
                if (this.Zs === this.Js) {
                    this.Zs = !this.Js;
                    this.$val = this.el.style.getPropertyValue("display");
                    this.$prio = this.el.style.getPropertyPriority("display");
                    this.el.style.setProperty("display", "none", "important");
                } else {
                    this.Zs = this.Js;
                    this.el.style.setProperty("display", this.$val, this.$prio);
                    if (this.el.getAttribute("style") === "") {
                        this.el.removeAttribute("style");
                    }
                }
            }
        };
        const t = f(si);
        this.Zs = this.Js = t.alias !== "hide";
    }
    binding() {
        this.Ys = true;
        this.update();
    }
    detaching() {
        this.Ys = false;
        this.I?.cancel();
        this.I = null;
    }
    valueChanged() {
        if (this.Ys && this.I === null) {
            this.I = this.p.domWriteQueue.queueTask(this.update);
        }
    }
}

__decorate([ bindable ], Show.prototype, "value", void 0);

alias("hide")(Show);

customAttribute("show")(Show);

const Jn = [ TemplateCompiler, ot, NodeObserverLocator ];

const tr = [ Ds, Ms, Os, qs, _e ];

const er = [ Fs, Hs ];

const ir = [ Ks, js, Us, zs, Gs, Xs, en, Qs, Ys, tn, Js, Zs, sn ];

const sr = [ DebounceBindingBehavior, OneTimeBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, SignalBindingBehavior, ThrottleBindingBehavior, TwoWayBindingBehavior, SanitizeValueConverter, If, Else, Repeat, With, An, Sn, _n, Rn, In, Tn, En, Pn, Ln, Mn, AttrBindingBehavior, SelfBindingBehavior, UpdateTriggerBindingBehavior, AuCompose, Portal, Focus, Show, qn ];

const nr = [ di, mi, ui, fi, oi, li, hi, ai, ci, vi, ki, bi, xi, wi, yi, gi, Ci ];

const rr = /*@__PURE__*/ createConfiguration(s);

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
            return e.register(Kt(K, i.coercingOptions), ...Jn, ...sr, ...tr, ...ir, ...nr);
        },
        customize(e) {
            return createConfiguration(e ?? t);
        }
    };
}

function children(t, e) {
    if (!hr) {
        hr = true;
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
        let l = Bs.getAnnotation(r, s);
        if (l == null) {
            Bs.annotate(r, s, l = []);
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
    constructor(t, e, i, s = defaultChildQuery, n = defaultChildFilter, r = defaultChildMap, l = or) {
        this.tn = void 0;
        this.X = defaultChildQuery;
        this.en = defaultChildFilter;
        this.sn = defaultChildMap;
        this.isBound = false;
        this.T = t;
        this.obj = e;
        this.cb = i;
        this.X = s;
        this.en = n;
        this.sn = r;
        this.V = l;
        this.wi = createMutationObserver(this.bs = t.host, (() => {
            this.nn();
        }));
    }
    getValue() {
        return this.isBound ? this.tn : this.rn();
    }
    setValue(t) {}
    bind() {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        this.wi.observe(this.bs, this.V);
        this.tn = this.rn();
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.wi.disconnect();
        this.tn = m;
    }
    nn() {
        this.tn = this.rn();
        this.cb?.call(this.obj);
        this.subs.notify(this.tn, undefined);
    }
    get() {
        throw createMappedError(99, "get");
    }
    rn() {
        return filterChildren(this.T, this.X, this.en, this.sn);
    }
}

const or = {
    childList: true
};

const defaultChildQuery = t => t.host.childNodes;

const defaultChildFilter = (t, e, i) => !!i;

const defaultChildMap = (t, e, i) => i;

const lr = {
    optional: true
};

const filterChildren = (t, e, i, s) => {
    const n = e(t);
    const r = n.length;
    const l = [];
    let h;
    let a;
    let c;
    let u = 0;
    for (;u < r; ++u) {
        h = n[u];
        a = findElementControllerFor(h, lr);
        c = a?.viewModel ?? null;
        if (i(h, a, c)) {
            l.push(s(h, a, c));
        }
    }
    return l;
};

class ChildrenLifecycleHooks {
    constructor(t) {
        this.Y = t;
    }
    register(t) {
        Kt(ue, this).register(t);
    }
    hydrating(t, e) {
        const i = this.Y;
        const s = new ChildrenBinding(e, t, t[i.callback ?? `${ct(i.name)}Changed`], i.query ?? defaultChildQuery, i.filter ?? defaultChildFilter, i.map ?? defaultChildMap, i.options ?? or);
        xt(t, i.name, {
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

let hr = false;

export { AdoptedStyleSheetsStyles, AppRoot, ne as AppTask, Fs as AtPrefixedTriggerAttributePattern, AttrBindingBehavior, Zs as AttrBindingCommand, AttrSyntax, AttributeBinding, AttributeBindingInstruction, ki as AttributeBindingRenderer, AttributeNSAccessor, Ls as AttributePattern, AuCompose, qn as AuSlot, AuSlotsInfo, Aurelia, Wt as Bindable, BindableDefinition, BindablesInfo, Yt as BindingBehavior, BindingBehaviorDefinition, Ws as BindingCommand, BindingCommandDefinition, Mt as BindingMode, BindingModeBehavior, BindingTargetSubscriber, CSSModulesProcessorRegistry, Ys as CaptureBindingCommand, Sn as Case, CheckedObserver, ChildrenBinding, ClassAttributeAccessor, tn as ClassBindingCommand, Hs as ColonPrefixedBindAttributePattern, ComputedWatcher, ContentBinding, Controller, ce as CustomAttribute, CustomAttributeDefinition, hi as CustomAttributeRenderer, Bs as CustomElement, CustomElementDefinition, li as CustomElementRenderer, DataAttributeAccessor, DebounceBindingBehavior, Ks as DefaultBindingCommand, ir as DefaultBindingLanguage, tr as DefaultBindingSyntax, _n as DefaultCase, Jn as DefaultComponents, nr as DefaultRenderers, sr as DefaultResources, Ms as DotSeparatedAttributePattern, Else, EventModifier, _e as EventModifierRegistration, ExpressionWatcher, FlushQueue, Focus, Xs as ForBindingCommand, FragmentNodeSequence, FromViewBindingBehavior, Us as FromViewBindingCommand, Tn as FulfilledTemplateController, HydrateAttributeInstruction, HydrateElementInstruction, HydrateLetElementInstruction, HydrateTemplateController, _s as IAppRoot, se as IAppTask, rn as IAttrMapper, Es as IAttributeParser, Ts as IAttributePattern, Me as IAuSlotWatcher, Le as IAuSlotsInfo, Rs as IAurelia, ls as IController, Se as IEventModifier, ds as IEventTarget, ve as IFlushQueue, xs as IHistory, hs as IHydrationContext, si as IInstruction, Be as IKeyMapping, ue as ILifecycleHooks, pi as IListenerBindingOptions, bs as ILocation, Ae as IModifiedEventHandlerCreator, fs as INode, re as IPlatform, ms as IRenderLocation, ri as IRenderer, Ei as IRendering, nn as ISVGAnalyzer, Hn as ISanitizer, Mi as IShadowDOMGlobalStyles, Pi as IShadowDOMStyleFactory, Li as IShadowDOMStyles, Is as ISyntaxInterpreter, ni as ITemplateCompiler, Yn as ITemplateCompilerHooks, Fn as ITemplateElementFactory, Re as IViewFactory, vs as IWindow, If, ii as InstructionType, InterpolationBinding, fi as InterpolationBindingRenderer, InterpolationInstruction, InterpolationPartBinding, Interpretation, IteratorBindingInstruction, mi as IteratorBindingRenderer, LetBinding, LetBindingInstruction, ci as LetElementRenderer, fe as LifecycleHooks, LifecycleHooksDefinition, LifecycleHooksEntry, ListenerBinding, ListenerBindingInstruction, ListenerBindingOptions, vi as ListenerBindingRenderer, MultiAttrInstruction, NodeObserverLocator, NoopSVGAnalyzer, OneTimeBindingBehavior, js as OneTimeBindingCommand, In as PendingTemplateController, Portal, Rn as PromiseTemplateController, PropertyBinding, PropertyBindingInstruction, di as PropertyBindingRenderer, Ds as RefAttributePattern, RefBinding, RefBindingInstruction, ui as RefBindingRenderer, En as RejectedTemplateController, Rendering, Repeat, SVGAnalyzer, SanitizeValueConverter, SelectValueObserver, SelfBindingBehavior, SetAttributeInstruction, bi as SetAttributeRenderer, SetClassAttributeInstruction, xi as SetClassAttributeRenderer, SetPropertyInstruction, oi as SetPropertyRenderer, SetStyleAttributeInstruction, wi as SetStyleAttributeRenderer, ShadowDOMRegistry, er as ShortHandBindingSyntax, SignalBindingBehavior, SpreadBindingInstruction, SpreadElementPropBindingInstruction, Ci as SpreadRenderer, rr as StandardConfiguration, os as State, StyleAttributeAccessor, Js as StyleBindingCommand, Di as StyleConfiguration, StyleElementStyles, StylePropertyBindingInstruction, yi as StylePropertyBindingRenderer, An as Switch, TemplateCompiler, Zn as TemplateCompilerHooks, ai as TemplateControllerRenderer, TextBindingInstruction, gi as TextBindingRenderer, ThrottleBindingBehavior, ToViewBindingBehavior, zs as ToViewBindingCommand, Qs as TriggerBindingCommand, TwoWayBindingBehavior, Gs as TwoWayBindingCommand, UpdateTriggerBindingBehavior, ValueAttributeObserver, me as ValueConverter, ValueConverterDefinition, ViewFactory, oe as Watch, With, alias, attributePattern, bindable, bindingBehavior, bindingCommand, capture, children, coercer, containerless, convertToRenderLocation, cssModules, customAttribute, customElement, getEffectiveParentNode, getRef, isCustomElementController, isCustomElementViewModel, isInstruction, isRenderLocation, lifecycleHooks, mixinAstEvaluator, mixinUseScope, mixingBindingLimited, processContent, registerAliases, renderer, setEffectiveParentNode, setRef, shadowCSS, slotted, templateCompilerHooks, templateController, useShadowDOM, valueConverter, watch };

