import { Protocol as t, getPrototypeChain as e, kebabCase as i, noop as s, DI as n, Registration as r, firstDefined as l, mergeArrays as h, resolve as a, IPlatform as c, emptyArray as u, InstanceProvider as f, fromDefinitionOrDefault as d, pascalCase as m, fromAnnotationOrTypeOrDefault as g, fromAnnotationOrDefinitionOrTypeOrDefault as p, IContainer as v, optional as b, onResolveAll as x, onResolve as w, all as y, camelCase as k, IServiceLocator as C, emptyObject as A, ILogger as B, transient as S, toArray as _ } from "../kernel/dist/native-modules/index.mjs";

import { Metadata as R, isObject as T } from "../metadata/dist/native-modules/index.mjs";

import { ISignaler as I, astEvaluate as E, connectable as P, ConnectableSwitcher as L, ProxyObservable as D, astBind as M, astUnbind as q, astAssign as F, subscriberCollection as H, IExpressionParser as O, IObserverLocator as V, ICoercionConfiguration as N, Scope as $, AccessScopeExpression as W, PropertyAccessor as j, IDirtyChecker as z, INodeObserverLocator as U, getObserverLookup as G, SetterObserver as X, createIndexMap as Q, applyMutationsToIndices as K, getCollectionObserver as Y, synchronizeIndices as Z, BindingContext as J, PrimitiveLiteralExpression as tt, DirtyChecker as et } from "../runtime/dist/native-modules/index.mjs";

import { BrowserPlatform as it } from "../platform-browser/dist/native-modules/index.mjs";

import { TaskAbortError as st } from "../platform/dist/native-modules/index.mjs";

function __decorate(t, e, i, s) {
    var n = arguments.length, r = n < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, i) : s, l;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(t, e, i, s); else for (var h = t.length - 1; h >= 0; h--) if (l = t[h]) r = (n < 3 ? l(r) : n > 3 ? l(e, i, r) : l(e, i)) || r;
    return n > 3 && r && Object.defineProperty(e, i, r), r;
}

const nt = R.getOwn;

const rt = R.hasOwn;

const ot = R.define;

const {annotation: lt, resource: ht} = t;

const at = lt.keyFor;

const ct = ht.keyFor;

const ut = ht.appendTo;

const ft = lt.appendTo;

const dt = lt.getKeys;

const mt = Object;

const gt = String;

const pt = mt.prototype;

const createLookup = () => mt.create(null);

const createError$1 = t => new Error(t);

const vt = pt.hasOwnProperty;

const bt = mt.freeze;

const xt = mt.assign;

const wt = mt.getOwnPropertyNames;

const yt = mt.keys;

const kt = /*@__PURE__*/ createLookup();

const isDataAttribute = (t, e, i) => {
    if (kt[e] === true) {
        return true;
    }
    if (!isString(e)) {
        return false;
    }
    const s = e.slice(0, 5);
    return kt[e] = s === "aria-" || s === "data-" || i.isStandardSvgAttribute(t, e);
};

const isPromise = t => t instanceof Promise;

const isArray = t => t instanceof Array;

const isFunction = t => typeof t === "function";

const isString = t => typeof t === "string";

const rethrow = t => {
    throw t;
};

const Ct = mt.is;

const At = Reflect.defineProperty;

const defineHiddenProp = (t, e, i) => {
    At(t, e, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: i
    });
    return i;
};

const addSignalListener = (t, e, i) => t.addSignalListener(e, i);

const removeSignalListener = (t, e, i) => t.removeSignalListener(e, i);

function bindable(t, e) {
    let i;
    function decorator(t, e) {
        if (arguments.length > 1) {
            i.property = e;
        }
        ot(Bt, BindableDefinition.create(e, t, i), t.constructor, e);
        ft(t.constructor, St.keyFrom(e));
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
    return t.startsWith(Bt);
}

const Bt = /*@__PURE__*/ at("bindable");

const St = bt({
    name: Bt,
    keyFrom: t => `${Bt}:${t}`,
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
                i[t.property] = t;
            } else if (t !== void 0) {
                yt(t).forEach((e => addDescription(e, t[e])));
            }
        }
        e.forEach(addList);
        return i;
    },
    getAll(t) {
        const i = Bt.length + 1;
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
            h = dt(c).filter(isBindableAnnotation);
            a = h.length;
            for (u = 0; u < a; ++u) {
                s[l++] = nt(Bt, c, h[u].slice(i));
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
        this.property = n;
        this.set = r;
    }
    static create(t, e, s = {}) {
        return new BindableDefinition(s.attribute ?? i(t), s.callback ?? `${t}Changed`, s.mode ?? 2, s.primary ?? false, s.property ?? t, s.set ?? getInterceptor(t, e, s));
    }
}

function coercer(t, e, i) {
    _t.define(t, e);
}

const _t = {
    key: /*@__PURE__*/ at("coercer"),
    define(t, e) {
        ot(_t.key, t[e].bind(t), t);
    },
    for(t) {
        return nt(_t.key, t);
    }
};

function getInterceptor(t, e, i = {}) {
    const n = i.type ?? R.get("design:type", e, t) ?? null;
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
            r = typeof t === "function" ? t.bind(n) : _t.for(n) ?? s;
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

const resource = t => {
    function Resolver(t, e, i) {
        n.inject(Resolver)(t, e, i);
    }
    Resolver.$isResolver = true;
    Resolver.resolve = (e, i) => i.has(t, false) ? i.get(t) : i.root.get(t);
    return Resolver;
};

const optionalResource = t => xt((function Resolver(t, e, i) {
    n.inject(Resolver)(t, e, i);
}), {
    $isResolver: true,
    resolve: (e, i) => i.has(t, false) ? i.get(t) : i.root.has(t, false) ? i.root.get(t) : void 0
});

const allResources = t => {
    function Resolver(t, e, i) {
        n.inject(Resolver)(t, e, i);
    }
    Resolver.$isResolver = true;
    Resolver.resolve = function(e, i) {
        if (i.root === i) {
            return i.getAll(t, false);
        }
        return i.has(t, false) ? i.getAll(t, false).concat(i.root.getAll(t, false)) : i.root.getAll(t, false);
    };
    return Resolver;
};

const Rt = n.createInterface;

const Tt = r.singleton;

const It = r.aliasTo;

const Et = r.instance;

r.callback;

const Pt = r.transient;

const registerResolver = (t, e, i) => t.registerResolver(e, i);

function alias(...t) {
    return function(e) {
        const i = at("aliases");
        const s = nt(i, e);
        if (s === void 0) {
            ot(i, t, e);
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

const createMappedError = (t, ...e) => new Error(`AUR${gt(t).padStart(4, "0")}:${e.map(gt)}`);

function bindingBehavior(t) {
    return function(e) {
        return Dt.define(t, e);
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
        return new BindingBehaviorDefinition(e, l(getBehaviorAnnotation(e, "name"), i), h(getBehaviorAnnotation(e, "aliases"), s.aliases, e.aliases), Dt.keyFrom(i));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        Tt(i, e).register(t);
        It(i, e).register(t);
        registerAliases(s, Dt, i, t);
    }
}

const Lt = /*@__PURE__*/ ct("binding-behavior");

const getBehaviorAnnotation = (t, e) => nt(at(e), t);

const Dt = bt({
    name: Lt,
    keyFrom(t) {
        return `${Lt}:${t}`;
    },
    isType(t) {
        return isFunction(t) && rt(Lt, t);
    },
    define(t, e) {
        const i = BindingBehaviorDefinition.create(t, e);
        ot(Lt, i, i.Type);
        ot(Lt, i, i);
        ut(e, Lt);
        return i.Type;
    },
    getDefinition(t) {
        const e = nt(Lt, t);
        if (e === void 0) {
            throw createMappedError(151, t);
        }
        return e;
    },
    annotate(t, e, i) {
        ot(at(e), i, t);
    },
    getAnnotation: getBehaviorAnnotation
});

const Mt = new Map;

class BindingModeBehavior {
    bind(t, e) {
        Mt.set(e, e.mode);
        e.mode = this.mode;
    }
    unbind(t, e) {
        e.mode = Mt.get(e);
        Mt.delete(e);
    }
}

class OneTimeBindingBehavior extends BindingModeBehavior {
    get mode() {
        return 1;
    }
}

class ToViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return 2;
    }
}

class FromViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return 4;
    }
}

class TwoWayBindingBehavior extends BindingModeBehavior {
    get mode() {
        return 6;
    }
}

bindingBehavior("oneTime")(OneTimeBindingBehavior);

bindingBehavior("toView")(ToViewBindingBehavior);

bindingBehavior("fromView")(FromViewBindingBehavior);

bindingBehavior("twoWay")(TwoWayBindingBehavior);

const qt = new WeakMap;

const Ft = 200;

class DebounceBindingBehavior {
    constructor() {
        this.p = a(c);
    }
    bind(t, e, i, s) {
        const n = {
            type: "debounce",
            delay: i ?? Ft,
            now: this.p.performanceNow,
            queue: this.p.taskQueue,
            signals: isString(s) ? [ s ] : s ?? u
        };
        const r = e.limit?.(n);
        if (r == null) ; else {
            qt.set(e, r);
        }
    }
    unbind(t, e) {
        qt.get(e)?.dispose();
        qt.delete(e);
    }
}

bindingBehavior("debounce")(DebounceBindingBehavior);

class SignalBindingBehavior {
    constructor() {
        this.i = new Map;
        this.u = a(I);
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

const Ht = new WeakMap;

const Ot = 200;

class ThrottleBindingBehavior {
    constructor() {
        ({performanceNow: this.C, taskQueue: this.A} = a(c));
    }
    bind(t, e, i, s) {
        const n = {
            type: "throttle",
            delay: i ?? Ot,
            now: this.C,
            queue: this.A,
            signals: isString(s) ? [ s ] : s ?? u
        };
        const r = e.limit?.(n);
        if (r == null) ; else {
            Ht.set(e, r);
        }
    }
    unbind(t, e) {
        Ht.get(e)?.dispose();
        Ht.delete(e);
    }
}

bindingBehavior("throttle")(ThrottleBindingBehavior);

const Vt = /*@__PURE__*/ Rt("IAppTask");

class $AppTask {
    constructor(t, e, i) {
        this.c = void 0;
        this.slot = t;
        this.k = e;
        this.cb = i;
    }
    register(t) {
        return this.c = t.register(Et(Vt, this));
    }
    run() {
        const t = this.k;
        const e = this.cb;
        return t === null ? e() : e(this.c.get(t));
    }
}

const Nt = bt({
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

const $t = c;

class Refs {}

function getRef(t, e) {
    return t.$au?.[e] ?? null;
}

function setRef(t, e, i) {
    var s;
    ((s = t).$au ?? (s.$au = new Refs))[e] = i;
}

const Wt = /*@__PURE__*/ Rt("INode");

const jt = /*@__PURE__*/ Rt("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(ki, true)) {
        return t.get(ki).host;
    }
    return t.get($t).document;
}))));

const zt = /*@__PURE__*/ Rt("IRenderLocation");

const Ut = /*@__PURE__*/ Rt("CssModules");

const Gt = new WeakMap;

function getEffectiveParentNode(t) {
    if (Gt.has(t)) {
        return Gt.get(t);
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
        if (e.mountTarget === 2) {
            return getEffectiveParentNode(e.host);
        }
    }
    return t.parentNode;
}

function setEffectiveParentNode(t, e) {
    if (t.platform !== void 0 && !(t instanceof t.platform.Node)) {
        const i = t.childNodes;
        for (let t = 0, s = i.length; t < s; ++t) {
            Gt.set(i[t], e);
        }
    } else {
        Gt.set(t, e);
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
        return this.B;
    }
    get lastChild() {
        return this._;
    }
    constructor(t, e) {
        this.platform = t;
        this.next = void 0;
        this.R = false;
        this.T = false;
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
        this.B = e.firstChild;
        this._ = e.lastChild;
    }
    findTargets() {
        return this.t;
    }
    insertBefore(t) {
        if (this.T && !!this.ref) {
            this.addToLinked();
        } else {
            const e = t.parentNode;
            if (this.R) {
                let i = this.B;
                let s;
                const n = this._;
                while (i != null) {
                    s = i.nextSibling;
                    e.insertBefore(i, t);
                    if (i === n) {
                        break;
                    }
                    i = s;
                }
            } else {
                this.R = true;
                t.parentNode.insertBefore(this.f, t);
            }
        }
    }
    appendTo(t, e = false) {
        if (this.R) {
            let e = this.B;
            let i;
            const s = this._;
            while (e != null) {
                i = e.nextSibling;
                t.appendChild(e);
                if (e === s) {
                    break;
                }
                e = i;
            }
        } else {
            this.R = true;
            if (!e) {
                t.appendChild(this.f);
            }
        }
    }
    remove() {
        if (this.R) {
            this.R = false;
            const t = this.f;
            const e = this._;
            let i;
            let s = this.B;
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
        if (this.R) {
            let i = this.B;
            let s;
            const n = this._;
            while (i != null) {
                s = i.nextSibling;
                e.insertBefore(i, t);
                if (i === n) {
                    break;
                }
                i = s;
            }
        } else {
            this.R = true;
            e.insertBefore(this.f, t);
        }
    }
    unlink() {
        this.T = false;
        this.next = void 0;
        this.ref = void 0;
    }
    link(t) {
        this.T = true;
        if (isRenderLocation(t)) {
            this.ref = t;
        } else {
            this.next = t;
            this.I();
        }
    }
    I() {
        if (this.next !== void 0) {
            this.ref = this.next.firstChild;
        } else {
            this.ref = void 0;
        }
    }
}

const Xt = /*@__PURE__*/ Rt("IWindow", (t => t.callback((t => t.get($t).window))));

const Qt = /*@__PURE__*/ Rt("ILocation", (t => t.callback((t => t.get(Xt).location))));

const Kt = /*@__PURE__*/ Rt("IHistory", (t => t.callback((t => t.get(Xt).history))));

const registerHostNode = (t, e, i) => {
    registerResolver(t, e.HTMLElement, registerResolver(t, e.Element, registerResolver(t, Wt, new f("ElementResolver", i))));
    return t;
};

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
        return 2;
    }
    constructor(t, e, i, s, n, r, l, h, a, c) {
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
        return new CustomAttributeDefinition(e, l(getAttributeAnnotation(e, "name"), i), h(getAttributeAnnotation(e, "aliases"), s.aliases, e.aliases), getAttributeKeyFrom(i), l(getAttributeAnnotation(e, "defaultBindingMode"), s.defaultBindingMode, e.defaultBindingMode, 2), l(getAttributeAnnotation(e, "isTemplateController"), s.isTemplateController, e.isTemplateController, false), St.from(e, ...St.getAll(e), getAttributeAnnotation(e, "bindables"), e.bindables, s.bindables), l(getAttributeAnnotation(e, "noMultiBindings"), s.noMultiBindings, e.noMultiBindings, false), h(ee.getAnnotation(e), e.watches), h(getAttributeAnnotation(e, "dependencies"), s.dependencies, e.dependencies));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        Pt(i, e).register(t);
        It(i, e).register(t);
        registerAliases(s, Zt, i, t);
    }
    toString() {
        return `au:ca:${this.name}`;
    }
}

const Yt = ct("custom-attribute");

const getAttributeKeyFrom = t => `${Yt}:${t}`;

const getAttributeAnnotation = (t, e) => nt(at(e), t);

const isAttributeType = t => isFunction(t) && rt(Yt, t);

const findAttributeControllerFor = (t, e) => getRef(t, getAttributeKeyFrom(e)) ?? void 0;

const defineAttribute = (t, e) => {
    const i = CustomAttributeDefinition.create(t, e);
    ot(Yt, i, i.Type);
    ot(Yt, i, i);
    ut(e, Yt);
    return i.Type;
};

const getAttributeDefinition = t => {
    const e = nt(Yt, t);
    if (e === void 0) {
        throw createMappedError(759, t);
    }
    return e;
};

const Zt = bt({
    name: Yt,
    keyFrom: getAttributeKeyFrom,
    isType: isAttributeType,
    for: findAttributeControllerFor,
    define: defineAttribute,
    getDefinition: getAttributeDefinition,
    annotate(t, e, i) {
        ot(at(e), i, t);
    },
    getAnnotation: getAttributeAnnotation
});

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
                throw createMappedError(773, `${gt(e)}@${l.name}}`);
            }
        } else if (!isFunction(n?.value)) {
            throw createMappedError(774, s);
        }
        ee.add(l, h);
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

const Jt = u;

const te = at("watch");

const ee = bt({
    name: te,
    add(t, e) {
        let i = nt(te, t);
        if (i == null) {
            ot(te, i = [], t);
        }
        i.push(e);
    },
    getAnnotation(t) {
        return nt(te, t) ?? Jt;
    }
});

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
    const e = nt(ne, t);
    if (e === void 0) {
        annotateElementMetadata(t, "containerless", true);
        return;
    }
    e.containerless = true;
}

function strict(t) {
    if (t === void 0) {
        return function(t) {
            annotateElementMetadata(t, "isStrictBinding", true);
        };
    }
    annotateElementMetadata(t, "isStrictBinding", true);
}

const ie = new WeakMap;

class CustomElementDefinition {
    get type() {
        return 1;
    }
    constructor(t, e, i, s, n, r, l, h, a, c, u, f, d, m, g, p, v, b, x, w) {
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
        this.isStrictBinding = g;
        this.shadowOptions = p;
        this.hasSlots = v;
        this.enhance = b;
        this.watches = x;
        this.processContent = w;
    }
    static create(t, e = null) {
        if (e === null) {
            const i = t;
            if (isString(i)) {
                throw createMappedError(761, t);
            }
            const s = d("name", i, re);
            if (isFunction(i.Type)) {
                e = i.Type;
            } else {
                e = oe(m(s));
            }
            return new CustomElementDefinition(e, s, h(i.aliases), d("key", i, (() => getElementKeyFrom(s))), d("cache", i, returnZero), d("capture", i, returnFalse), d("template", i, returnNull), h(i.instructions), h(i.dependencies), d("injectable", i, returnNull), d("needsCompile", i, returnTrue), h(i.surrogates), St.from(e, i.bindables), d("containerless", i, returnFalse), d("isStrictBinding", i, returnFalse), d("shadowOptions", i, returnNull), d("hasSlots", i, returnFalse), d("enhance", i, returnFalse), d("watches", i, returnEmptyArray), g("processContent", e, returnNull));
        }
        if (isString(t)) {
            return new CustomElementDefinition(e, t, h(getElementAnnotation(e, "aliases"), e.aliases), getElementKeyFrom(t), g("cache", e, returnZero), g("capture", e, returnFalse), g("template", e, returnNull), h(getElementAnnotation(e, "instructions"), e.instructions), h(getElementAnnotation(e, "dependencies"), e.dependencies), g("injectable", e, returnNull), g("needsCompile", e, returnTrue), h(getElementAnnotation(e, "surrogates"), e.surrogates), St.from(e, ...St.getAll(e), getElementAnnotation(e, "bindables"), e.bindables), g("containerless", e, returnFalse), g("isStrictBinding", e, returnFalse), g("shadowOptions", e, returnNull), g("hasSlots", e, returnFalse), g("enhance", e, returnFalse), h(ee.getAnnotation(e), e.watches), g("processContent", e, returnNull));
        }
        const i = d("name", t, re);
        return new CustomElementDefinition(e, i, h(getElementAnnotation(e, "aliases"), t.aliases, e.aliases), getElementKeyFrom(i), p("cache", t, e, returnZero), p("capture", t, e, returnFalse), p("template", t, e, returnNull), h(getElementAnnotation(e, "instructions"), t.instructions, e.instructions), h(getElementAnnotation(e, "dependencies"), t.dependencies, e.dependencies), p("injectable", t, e, returnNull), p("needsCompile", t, e, returnTrue), h(getElementAnnotation(e, "surrogates"), t.surrogates, e.surrogates), St.from(e, ...St.getAll(e), getElementAnnotation(e, "bindables"), e.bindables, t.bindables), p("containerless", t, e, returnFalse), p("isStrictBinding", t, e, returnFalse), p("shadowOptions", t, e, returnNull), p("hasSlots", t, e, returnFalse), p("enhance", t, e, returnFalse), h(t.watches, ee.getAnnotation(e), e.watches), p("processContent", t, e, returnNull));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) {
            return t;
        }
        if (ie.has(t)) {
            return ie.get(t);
        }
        const e = CustomElementDefinition.create(t);
        ie.set(t, e);
        ot(ne, e, e.Type);
        return e;
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        if (!t.has(i, false)) {
            Pt(i, e).register(t);
            It(i, e).register(t);
            registerAliases(s, le, i, t);
        }
    }
    toString() {
        return `au:ce:${this.name}`;
    }
}

const se = {
    name: undefined,
    searchParents: false,
    optional: false
};

const returnZero = () => 0;

const returnNull = () => null;

const returnFalse = () => false;

const returnTrue = () => true;

const returnEmptyArray = () => u;

const ne = /*@__PURE__*/ ct("custom-element");

const getElementKeyFrom = t => `${ne}:${t}`;

const re = /*@__PURE__*/ (() => {
    let t = 0;
    return () => `unnamed-${++t}`;
})();

const annotateElementMetadata = (t, e, i) => {
    ot(at(e), i, t);
};

const defineElement = (t, e) => {
    const i = CustomElementDefinition.create(t, e);
    ot(ne, i, i.Type);
    ot(ne, i, i);
    ut(i.Type, ne);
    return i.Type;
};

const isElementType = t => isFunction(t) && rt(ne, t);

const findElementControllerFor = (t, e = se) => {
    if (e.name === void 0 && e.searchParents !== true) {
        const i = getRef(t, ne);
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
            const i = getRef(t, ne);
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
            const t = getRef(i, ne);
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
        const t = getRef(i, ne);
        if (t !== null) {
            return t;
        }
        i = getEffectiveParentNode(i);
    }
    throw createMappedError(765, t);
};

const getElementAnnotation = (t, e) => nt(at(e), t);

const getElementDefinition = t => {
    const e = nt(ne, t);
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
    $injectable.register = function(t) {
        return {
            resolve(t, e) {
                if (e.has($injectable, true)) {
                    return e.get($injectable);
                } else {
                    return null;
                }
            }
        };
    };
    return $injectable;
};

const oe = /*@__PURE__*/ function() {
    const t = {
        value: "",
        writable: false,
        enumerable: false,
        configurable: true
    };
    const e = {};
    return function(i, s = e) {
        const n = class {};
        t.value = i;
        At(n, "name", t);
        if (s !== e) {
            xt(n.prototype, s);
        }
        return n;
    };
}();

const le = bt({
    name: ne,
    keyFrom: getElementKeyFrom,
    isType: isElementType,
    for: findElementControllerFor,
    define: defineElement,
    getDefinition: getElementDefinition,
    annotate: annotateElementMetadata,
    getAnnotation: getElementAnnotation,
    generateName: re,
    createInjectable: createElementInjectable,
    generateType: oe
});

const he = /*@__PURE__*/ at("processContent");

function processContent(t) {
    return t === void 0 ? function(t, e, i) {
        ot(he, ensureHook(t, e), t);
    } : function(e) {
        t = ensureHook(e, t);
        const i = nt(ne, e);
        if (i !== void 0) {
            i.processContent = t;
        } else {
            ot(he, t, e);
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
                addListener(this.P, e, this);
            }
            this.L = true;
            this.M?.();
        }
    }));
    defineHiddenProp(i, "unsubscribe", (function(t) {
        if (this.subs.remove(t) && this.subs.count === 0) {
            for (e of this.cf.events) {
                removeListener(this.P, e, this);
            }
            this.L = false;
            this.q?.();
        }
    }));
    defineHiddenProp(i, "useConfig", (function(t) {
        this.cf = t;
        if (this.L) {
            for (e of this.cf.events) {
                removeListener(this.P, e, this);
            }
            for (e of this.cf.events) {
                addListener(this.P, e, this);
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
        this.type = 2 | 4;
        this.v = "";
        this.F = {};
        this.H = 0;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (t !== this.v) {
            this.v = t;
            this.O();
        }
    }
    O() {
        const t = this.F;
        const e = ++this.H;
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
                t[l] = this.H;
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
        return u;
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
            return u;
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
        return u;
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
        const i = xt({}, ...this.modules);
        const s = defineAttribute({
            name: "class",
            bindables: [ "value" ],
            noMultiBindings: true
        }, (e = class CustomAttributeClass {
            constructor(t) {
                this.V = new ClassAttributeAccessor(t);
            }
            binding() {
                this.valueChanged();
            }
            valueChanged() {
                this.V.setValue(this.value?.split(/\s+/g).map((t => i[t] || t)) ?? "");
            }
        }, e.inject = [ Wt ], e));
        t.register(s, Et(Ut, i));
    }
}

function shadowCSS(...t) {
    return new ShadowDOMRegistry(t);
}

const ae = /*@__PURE__*/ Rt("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
    if (AdoptedStyleSheetsStyles.supported(t.get($t))) {
        return t.get(AdoptedStyleSheetsStylesFactory);
    }
    return t.get(StyleElementStylesFactory);
}))));

class ShadowDOMRegistry {
    constructor(t) {
        this.css = t;
    }
    register(t) {
        const e = t.get(ue);
        const i = t.get(ae);
        t.register(Et(ce, i.createStyles(this.css, e)));
    }
}

class AdoptedStyleSheetsStylesFactory {
    constructor(t) {
        this.p = t;
        this.cache = new Map;
    }
    createStyles(t, e) {
        return new AdoptedStyleSheetsStyles(this.p, t, this.cache, e);
    }
}

AdoptedStyleSheetsStylesFactory.inject = [ $t ];

class StyleElementStylesFactory {
    constructor(t) {
        this.p = t;
    }
    createStyles(t, e) {
        return new StyleElementStyles(this.p, t, e);
    }
}

StyleElementStylesFactory.inject = [ $t ];

const ce = /*@__PURE__*/ Rt("IShadowDOMStyles");

const ue = /*@__PURE__*/ Rt("IShadowDOMGlobalStyles", (t => t.instance({
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

const fe = {
    shadowDOM(t) {
        return Nt.creating(v, (e => {
            if (t.sharedStyles != null) {
                const i = e.get(ae);
                e.register(Et(ue, i.createStyles(t.sharedStyles, null)));
            }
        }));
    }
};

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
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        r.singleton(i, e).register(t);
        r.aliasTo(i, e).register(t);
        registerAliases(s, me, i, t);
    }
}

const de = ct("value-converter");

const getConverterAnnotation = (t, e) => nt(at(e), t);

const me = bt({
    name: de,
    keyFrom: t => `${de}:${t}`,
    isType(t) {
        return isFunction(t) && rt(de, t);
    },
    define(t, e) {
        const i = ValueConverterDefinition.create(t, e);
        ot(de, i, i.Type);
        ot(de, i, i);
        ut(e, de);
        return i.Type;
    },
    getDefinition(t) {
        const e = nt(de, t);
        if (e === void 0) {
            throw createMappedError(152, t);
        }
        return e;
    },
    annotate(t, e, i) {
        ot(at(e), i, t);
    },
    getAnnotation: getConverterAnnotation
});

class BindingTargetSubscriber {
    constructor(t, e) {
        this.v = void 0;
        this.b = t;
        this.N = e;
    }
    flush() {
        this.b.updateSource(this.v);
    }
    handleChange(t, e) {
        const i = this.b;
        if (t !== E(i.ast, i.s, i, null)) {
            this.v = t;
            this.N.add(this);
        }
    }
}

const mixinUseScope = t => {
    defineHiddenProp(t.prototype, "useScope", (function(t) {
        this.s = t;
    }));
};

const mixinAstEvaluator = (t, e = true) => i => {
    const s = i.prototype;
    if (t != null) {
        At(s, "strict", {
            enumerable: true,
            get: function() {
                return t;
            }
        });
    }
    At(s, "strictFnCall", {
        enumerable: true,
        get: function() {
            return e;
        }
    });
    defineHiddenProp(s, "get", (function(t) {
        return this.l.get(t);
    }));
    defineHiddenProp(s, "getSignaler", (function() {
        return this.l.root.get(I);
    }));
    defineHiddenProp(s, "getConverter", (function(t) {
        const e = me.keyFrom(t);
        let i = ge.get(this);
        if (i == null) {
            ge.set(this, i = new ResourceLookup);
        }
        return i[e] ?? (i[e] = this.l.get(resource(e)));
    }));
    defineHiddenProp(s, "getBehavior", (function(t) {
        const e = Dt.keyFrom(t);
        let i = ge.get(this);
        if (i == null) {
            ge.set(this, i = new ResourceLookup);
        }
        return i[e] ?? (i[e] = this.l.get(resource(e)));
    }));
};

const ge = new WeakMap;

class ResourceLookup {}

const pe = /*@__PURE__*/ Rt("IFlushQueue", (t => t.singleton(FlushQueue)));

class FlushQueue {
    constructor() {
        this.$ = false;
        this.W = new Set;
    }
    get count() {
        return this.W.size;
    }
    add(t) {
        this.W.add(t);
        if (this.$) {
            return;
        }
        this.$ = true;
        try {
            this.W.forEach(flushItem);
        } finally {
            this.$ = false;
        }
    }
    clear() {
        this.W.clear();
        this.$ = false;
    }
}

function flushItem(t, e, i) {
    i.delete(t);
    t.flush();
}

const ve = new WeakSet;

const mixingBindingLimited = (t, e) => {
    defineHiddenProp(t.prototype, "limit", (function(t) {
        if (ve.has(this)) {
            throw createMappedError(9996);
        }
        ve.add(this);
        const i = e(this, t);
        const s = t.signals;
        const n = s.length > 0 ? this.get(I) : null;
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
                ve.delete(this);
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
        l = s?.status === 0;
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
        a = s?.status === 0;
        u();
        if (a) {
            callOriginalCallback();
        }
    };
    return fn;
};

const {enter: be, exit: xe} = L;

const {wrap: we, unwrap: ye} = D;

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
        if (!Ct(i, e)) {
            this.cb.call(t, i, e, t);
        }
    }
    compute() {
        this.running = true;
        this.obs.version++;
        try {
            be(this);
            return this.v = ye(this.$get.call(void 0, this.useProxy ? we(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            xe(this);
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
        this.j = s;
        this.cb = n;
    }
    handleChange(t) {
        const e = this.j;
        const i = this.obj;
        const s = this.v;
        const n = e.$kind === 1 && this.obs.count === 1;
        if (!n) {
            this.obs.version++;
            t = E(e, this.scope, this, this);
            this.obs.clear();
        }
        if (!Ct(t, s)) {
            this.v = t;
            this.cb.call(i, t, s, i);
        }
    }
    bind() {
        if (this.isBound) {
            return;
        }
        this.obs.version++;
        this.v = E(this.j, this.scope, this, this);
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

P(ComputedWatcher);

P(ExpressionWatcher);

mixinAstEvaluator(true)(ExpressionWatcher);

const ke = /*@__PURE__*/ Rt("ILifecycleHooks");

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
        while (s !== pt) {
            for (const t of wt(s)) {
                if (t !== "constructor" && !t.startsWith("_")) {
                    i.add(t);
                }
            }
            s = Object.getPrototypeOf(s);
        }
        return new LifecycleHooksDefinition(e, i);
    }
    register(t) {
        Tt(ke, this.Type).register(t);
    }
}

const Ce = new WeakMap;

const Ae = at("lifecycle-hooks");

const Be = bt({
    name: Ae,
    define(t, e) {
        const i = LifecycleHooksDefinition.create(t, e);
        ot(Ae, i, e);
        ut(e, Ae);
        return i.Type;
    },
    resolve(t) {
        let e = Ce.get(t);
        if (e === void 0) {
            Ce.set(t, e = new LifecycleHooksLookupImpl);
            const i = t.root;
            const s = i.id === t.id ? t.getAll(ke) : t.has(ke, false) ? i.getAll(ke).concat(t.getAll(ke)) : i.getAll(ke);
            let n;
            let r;
            let l;
            let h;
            let a;
            for (n of s) {
                r = nt(Ae, n.constructor);
                l = new LifecycleHooksEntry(r, n);
                for (h of r.propertyNames) {
                    a = e[h];
                    if (a === void 0) {
                        e[h] = [ l ];
                    } else {
                        a.push(l);
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
        return Be.define({}, t);
    };
}

const Se = {
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
        this.U = null;
        this.v = void 0;
        this.boundFn = false;
        this.l = e;
        this.ast = n;
        this.G = t;
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
                let n = gt(t);
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
                    e.setAttribute(i, gt(t));
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
        const e = E(this.ast, this.s, this, (this.mode & 2) > 0 ? this : null);
        this.obs.clear();
        if (e !== this.v) {
            this.v = e;
            const i = this.G.state !== 1;
            if (i) {
                t = this.U;
                this.U = this.A.queueTask((() => {
                    this.U = null;
                    this.updateTarget(e);
                }), Se);
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
        M(this.ast, t, this);
        if (this.mode & (2 | 1)) {
            this.updateTarget(this.v = E(this.ast, t, this, (this.mode & 2) > 0 ? this : null));
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
        this.U?.cancel();
        this.U = null;
        this.obs.clearAll();
    }
}

mixinUseScope(AttributeBinding);

mixingBindingLimited(AttributeBinding, (() => "updateTarget"));

P(AttributeBinding);

mixinAstEvaluator(true)(AttributeBinding);

const _e = {
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
        this.U = null;
        this.G = t;
        this.oL = i;
        this.A = s;
        this.X = i.getAccessor(r, l);
        const a = n.expressions;
        const c = this.partBindings = Array(a.length);
        const u = a.length;
        let f = 0;
        for (;u > f; ++f) {
            c[f] = new InterpolationPartBinding(a[f], r, l, e, i, this);
        }
    }
    K() {
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
        const r = this.X;
        const l = this.G.state !== 1 && (r.type & 4) > 0;
        let h;
        if (l) {
            h = this.U;
            this.U = this.A.queueTask((() => {
                this.U = null;
                r.setValue(s, this.target, this.targetProperty);
            }), _e);
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
        this.U?.cancel();
        this.U = null;
    }
}

class InterpolationPartBinding {
    constructor(t, e, i, s, n, r) {
        this.ast = t;
        this.target = e;
        this.targetProperty = i;
        this.owner = r;
        this.mode = 2;
        this.task = null;
        this.isBound = false;
        this.v = "";
        this.boundFn = false;
        this.l = s;
        this.oL = n;
    }
    updateTarget() {
        this.owner.K();
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = E(this.ast, this.s, this, (this.mode & 2) > 0 ? this : null);
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
        M(this.ast, t, this);
        this.v = E(this.ast, this.s, this, (this.mode & 2) > 0 ? this : null);
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

P(InterpolationPartBinding);

mixinAstEvaluator(true)(InterpolationPartBinding);

class ContentBinding {
    constructor(t, e, i, s, n, r, l, h) {
        this.p = n;
        this.ast = r;
        this.target = l;
        this.strict = h;
        this.isBound = false;
        this.mode = 2;
        this.U = null;
        this.v = "";
        this.Y = false;
        this.boundFn = false;
        this.l = e;
        this.G = t;
        this.oL = i;
        this.A = s;
    }
    updateTarget(t) {
        const e = this.target;
        const i = this.v;
        this.v = t;
        if (this.Y) {
            i.parentNode?.removeChild(i);
            this.Y = false;
        }
        if (t instanceof this.p.Node) {
            e.parentNode?.insertBefore(t, e);
            t = "";
            this.Y = true;
        }
        e.textContent = gt(t);
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = E(this.ast, this.s, this, (this.mode & 2) > 0 ? this : null);
        this.obs.clear();
        if (t === this.v) {
            this.U?.cancel();
            this.U = null;
            return;
        }
        const e = this.G.state !== 1;
        if (e) {
            this.Z(t);
        } else {
            this.updateTarget(t);
        }
    }
    handleCollectionChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = this.v = E(this.ast, this.s, this, (this.mode & 2) > 0 ? this : null);
        this.obs.clear();
        if (isArray(t)) {
            this.observeCollection(t);
        }
        const e = this.G.state !== 1;
        if (e) {
            this.Z(t);
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
        M(this.ast, t, this);
        const e = this.v = E(this.ast, this.s, this, (this.mode & 2) > 0 ? this : null);
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
        if (this.Y) {
            this.v.parentNode?.removeChild(this.v);
        }
        this.s = void 0;
        this.obs.clearAll();
        this.U?.cancel();
        this.U = null;
    }
    Z(t) {
        const e = this.U;
        this.U = this.A.queueTask((() => {
            this.U = null;
            this.updateTarget(t);
        }), _e);
        e?.cancel();
    }
}

mixinUseScope(ContentBinding);

mixingBindingLimited(ContentBinding, (() => "updateTarget"));

P()(ContentBinding);

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
        this.J = n;
    }
    updateTarget() {
        this.target[this.targetProperty] = this.v;
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        this.v = E(this.ast, this.s, this, this);
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
        this.target = this.J ? t.bindingContext : t.overrideContext;
        M(this.ast, t, this);
        this.v = E(this.ast, this.s, this, this);
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

P(LetBinding);

mixinAstEvaluator(true)(LetBinding);

class PropertyBinding {
    constructor(t, e, i, s, n, r, l, h) {
        this.ast = n;
        this.target = r;
        this.targetProperty = l;
        this.mode = h;
        this.isBound = false;
        this.s = void 0;
        this.X = void 0;
        this.U = null;
        this.tt = null;
        this.boundFn = false;
        this.l = e;
        this.G = t;
        this.A = s;
        this.oL = i;
    }
    updateTarget(t) {
        this.X.setValue(t, this.target, this.targetProperty);
    }
    updateSource(t) {
        F(this.ast, this.s, this, t);
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = E(this.ast, this.s, this, (this.mode & 2) > 0 ? this : null);
        this.obs.clear();
        const e = this.G.state !== 1 && (this.X.type & 4) > 0;
        if (e) {
            Re = this.U;
            this.U = this.A.queueTask((() => {
                this.updateTarget(t);
                this.U = null;
            }), Te);
            Re?.cancel();
            Re = null;
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
        M(this.ast, t, this);
        const e = this.oL;
        const i = this.mode;
        let s = this.X;
        if (!s) {
            if (i & 4) {
                s = e.getObserver(this.target, this.targetProperty);
            } else {
                s = e.getAccessor(this.target, this.targetProperty);
            }
            this.X = s;
        }
        const n = (i & 2) > 0;
        if (i & (2 | 1)) {
            this.updateTarget(E(this.ast, this.s, this, n ? this : null));
        }
        if (i & 4) {
            s.subscribe(this.tt ?? (this.tt = new BindingTargetSubscriber(this, this.l.get(pe))));
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
        if (this.tt) {
            this.X.unsubscribe(this.tt);
            this.tt = null;
        }
        this.U?.cancel();
        this.U = null;
        this.obs.clearAll();
    }
    useTargetObserver(t) {
        this.X?.unsubscribe(this);
        (this.X = t).subscribe(this);
    }
    useTargetSubscriber(t) {
        if (this.tt != null) {
            throw createMappedError(9995);
        }
        this.tt = t;
    }
}

mixinUseScope(PropertyBinding);

mixingBindingLimited(PropertyBinding, (t => t.mode & 4 ? "updateSource" : "updateTarget"));

P(PropertyBinding);

mixinAstEvaluator(true, false)(PropertyBinding);

let Re = null;

const Te = {
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
        M(this.ast, t, this);
        F(this.ast, this.s, this, this.target);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        if (E(this.ast, this.s, this, null) === this.target) {
            F(this.ast, this.s, this, null);
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
    constructor(t, e, i, s, n) {
        this.ast = e;
        this.target = i;
        this.targetEvent = s;
        this.isBound = false;
        this.self = false;
        this.boundFn = true;
        this.l = t;
        this.et = n;
    }
    callSource(t) {
        const e = this.s.overrideContext;
        e.$event = t;
        let i = E(this.ast, this.s, this, null);
        delete e.$event;
        if (isFunction(i)) {
            i = i(t);
        }
        if (i !== true && this.et.prevent) {
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
        M(this.ast, t, this);
        this.target.addEventListener(this.targetEvent, this, this.et);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        q(this.ast, this.s, this);
        this.s = void 0;
        this.target.removeEventListener(this.targetEvent, this, this.et);
    }
}

mixinUseScope(ListenerBinding);

mixingBindingLimited(ListenerBinding, (() => "callSource"));

mixinAstEvaluator(true, true)(ListenerBinding);

const Ie = /*@__PURE__*/ Rt("IViewFactory");

class ViewFactory {
    constructor(t, e) {
        this.isCaching = false;
        this.it = null;
        this.st = -1;
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
            if (this.st === -1 || !e) {
                this.st = t;
            }
        }
        if (this.st > 0) {
            this.it = [];
        } else {
            this.it = null;
        }
        this.isCaching = this.st > 0;
    }
    canReturnToCache(t) {
        return this.it != null && this.it.length < this.st;
    }
    tryReturnToCache(t) {
        if (this.canReturnToCache(t)) {
            this.it.push(t);
            return true;
        }
        return false;
    }
    create(t) {
        const e = this.it;
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

const Ee = /*@__PURE__*/ Rt("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

const Pe = /*@__PURE__*/ Rt("IAuSlotWatcher");

class AuSlotWatcherBinding {
    constructor(t, e, i, s) {
        this.nt = new Set;
        this.rt = u;
        this.isBound = false;
        this.cb = (this.o = t)[e];
        this.slotName = i;
        this.ot = s;
    }
    bind() {
        this.isBound = true;
    }
    unbind() {
        this.isBound = false;
    }
    getValue() {
        return this.rt;
    }
    watch(t) {
        if (!this.nt.has(t)) {
            this.nt.add(t);
            t.subscribe(this);
        }
    }
    unwatch(t) {
        if (this.nt.delete(t)) {
            t.unsubscribe(this);
        }
    }
    handleSlotChange(t, e) {
        if (!this.isBound) {
            return;
        }
        const i = this.rt;
        const s = [];
        let n;
        let r;
        for (n of this.nt) {
            for (r of n === t ? e : n.nodes) {
                if (this.ot === "*" || r.nodeType === 1 && r.matches(this.ot)) {
                    s[s.length] = r;
                }
            }
        }
        if (s.length !== i.length || s.some(((t, e) => t !== i[e]))) {
            this.rt = s;
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
        this.lt = t;
    }
    register(t) {
        Et(ke, this).register(t);
    }
    hydrating(t, e) {
        const i = this.lt;
        const s = new AuSlotWatcherBinding(t, i.callback ?? `${gt(i.name)}Changed`, i.slotName ?? "default", i.query ?? "*");
        At(t, i.name, {
            enumerable: true,
            configurable: true,
            get: xt((() => s.getValue()), {
                getObserver: () => s
            }),
            set: () => {}
        });
        Et(Pe, s).register(e.container);
        e.addBinding(s);
    }
}

function slotted(t, e) {
    if (!Le) {
        Le = true;
        H(AuSlotWatcherBinding);
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
        let a = le.getAnnotation(h, i);
        if (a == null) {
            le.annotate(h, i, a = []);
        }
        a.push(new SlottedLifecycleHooks(l));
    }
    return decorator;
}

let Le = false;

var De;

(function(t) {
    t["hydrateElement"] = "ra";
    t["hydrateAttribute"] = "rb";
    t["hydrateTemplateController"] = "rc";
    t["hydrateLetElement"] = "rd";
    t["setProperty"] = "re";
    t["interpolation"] = "rf";
    t["propertyBinding"] = "rg";
    t["letBinding"] = "ri";
    t["refBinding"] = "rj";
    t["iteratorBinding"] = "rk";
    t["multiAttr"] = "rl";
    t["textBinding"] = "ha";
    t["listenerBinding"] = "hb";
    t["attributeBinding"] = "hc";
    t["stylePropertyBinding"] = "hd";
    t["setAttribute"] = "he";
    t["setClassAttribute"] = "hf";
    t["setStyleAttribute"] = "hg";
    t["spreadBinding"] = "hs";
    t["spreadElementProp"] = "hp";
})(De || (De = {}));

const Me = /*@__PURE__*/ Rt("Instruction");

function isInstruction(t) {
    const e = t.type;
    return isString(e) && e.length === 2;
}

class InterpolationInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = "rf";
    }
}

class PropertyBindingInstruction {
    constructor(t, e, i) {
        this.from = t;
        this.to = e;
        this.mode = i;
        this.type = "rg";
    }
}

class IteratorBindingInstruction {
    constructor(t, e, i) {
        this.forOf = t;
        this.to = e;
        this.props = i;
        this.type = "rk";
    }
}

class RefBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = "rj";
    }
}

class SetPropertyInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = "re";
    }
}

class MultiAttrInstruction {
    constructor(t, e, i) {
        this.value = t;
        this.to = e;
        this.command = i;
        this.type = "rl";
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
        this.type = "ra";
        this.auSlot = null;
    }
}

class HydrateAttributeInstruction {
    constructor(t, e, i) {
        this.res = t;
        this.alias = e;
        this.props = i;
        this.type = "rb";
    }
}

class HydrateTemplateController {
    constructor(t, e, i, s) {
        this.def = t;
        this.res = e;
        this.alias = i;
        this.props = s;
        this.type = "rc";
    }
}

class HydrateLetElementInstruction {
    constructor(t, e) {
        this.instructions = t;
        this.toBindingContext = e;
        this.type = "rd";
    }
}

class LetBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = "ri";
    }
}

class TextBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.strict = e;
        this.type = "ha";
    }
}

class ListenerBindingInstruction {
    constructor(t, e, i, s) {
        this.from = t;
        this.to = e;
        this.preventDefault = i;
        this.capture = s;
        this.type = "hb";
    }
}

class StylePropertyBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = "hd";
    }
}

class SetAttributeInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = "he";
    }
}

class SetClassAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = "hf";
    }
}

class SetStyleAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = "hg";
    }
}

class AttributeBindingInstruction {
    constructor(t, e, i) {
        this.attr = t;
        this.from = e;
        this.to = i;
        this.type = "hc";
    }
}

class SpreadBindingInstruction {
    constructor() {
        this.type = "hs";
    }
}

class SpreadElementPropBindingInstruction {
    constructor(t) {
        this.instructions = t;
        this.type = "hp";
    }
}

const qe = /*@__PURE__*/ Rt("ITemplateCompiler");

const Fe = /*@__PURE__*/ Rt("IRenderer");

function renderer(t) {
    return function decorator(e) {
        e.register = function(t) {
            Tt(Fe, this).register(t);
        };
        At(e.prototype, "target", {
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

      case "view-model":
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

let He = class SetPropertyRenderer {
    render(t, e, i) {
        const s = getTarget(e);
        if (s.$observers?.[i.to] !== void 0) {
            s.$observers[i.to].setValue(i.value);
        } else {
            s[i.to] = i.value;
        }
    }
};

He = __decorate([ renderer("re") ], He);

let Oe = class CustomElementRenderer {
    constructor() {
        this.r = a(hi);
    }
    render(t, e, i, s, n, r) {
        let l;
        let h;
        let a;
        let c;
        const u = i.res;
        const d = i.projections;
        const m = t.container;
        switch (typeof u) {
          case "string":
            l = m.find(le, u);
            if (l == null) {
                throw createMappedError(752, i, t);
            }
            break;

          default:
            l = u;
        }
        const g = i.containerless || l.containerless;
        const p = g ? convertToRenderLocation(e) : null;
        const v = createElementContainer(s, t, e, i, p, d == null ? void 0 : new AuSlotsInfo(yt(d)));
        h = l.Type;
        a = v.invoke(h);
        registerResolver(v, h, new f(l.key, a));
        c = Controller.$el(v, a, e, i, l, p);
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

Oe = __decorate([ renderer("ra") ], Oe);

let Ve = class CustomAttributeRenderer {
    constructor() {
        this.r = a(hi);
    }
    render(t, e, i, s, n, r) {
        let l = t.container;
        let h;
        switch (typeof i.res) {
          case "string":
            h = l.find(Zt, i.res);
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

Ve = __decorate([ renderer("rb") ], Ve);

let Ne = class TemplateControllerRenderer {
    constructor() {
        this.r = a(hi);
    }
    render(t, e, i, s, n, r) {
        let l = t.container;
        let h;
        switch (typeof i.res) {
          case "string":
            h = l.find(Zt, i.res);
            if (h == null) {
                throw createMappedError(754, i, t);
            }
            break;

          default:
            h = i.res;
        }
        const a = this.r.getViewFactory(i.def, l);
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

Ne = __decorate([ renderer("rc") ], Ne);

let $e = class LetElementRenderer {
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
            f = ensureExpression(n, u.from, 16);
            t.addBinding(new LetBinding(a, r, f, u.to, h));
            ++d;
        }
    }
};

$e = __decorate([ renderer("rd") ], $e);

let We = class RefBindingRenderer {
    render(t, e, i, s, n) {
        t.addBinding(new RefBinding(t.container, ensureExpression(n, i.from, 16), getRefTarget(e, i.to)));
    }
};

We = __decorate([ renderer("rj") ], We);

let je = class InterpolationBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new InterpolationBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, 1), getTarget(e), i.to, 2));
    }
};

je = __decorate([ renderer("rf") ], je);

let ze = class PropertyBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, 16), getTarget(e), i.to, i.mode));
    }
};

ze = __decorate([ renderer("rg") ], ze);

let Ue = class IteratorBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.forOf, 2), getTarget(e), i.to, 2));
    }
};

Ue = __decorate([ renderer("rk") ], Ue);

let Ge = class TextBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, s.domWriteQueue, s, ensureExpression(n, i.from, 16), e, i.strict));
    }
};

Ge = __decorate([ renderer("ha") ], Ge);

let Xe = class ListenerBindingRenderer {
    render(t, e, i, s, n) {
        t.addBinding(new ListenerBinding(t.container, ensureExpression(n, i.from, 8), e, i.to, new ListenerBindingOptions(i.preventDefault, i.capture)));
    }
};

Xe = __decorate([ renderer("hb") ], Xe);

let Qe = class SetAttributeRenderer {
    render(t, e, i) {
        e.setAttribute(i.to, i.value);
    }
};

Qe = __decorate([ renderer("he") ], Qe);

let Ke = class SetClassAttributeRenderer {
    render(t, e, i) {
        addClasses(e.classList, i.value);
    }
};

Ke = __decorate([ renderer("hf") ], Ke);

let Ye = class SetStyleAttributeRenderer {
    render(t, e, i) {
        e.style.cssText += i.value;
    }
};

Ye = __decorate([ renderer("hg") ], Ye);

let Ze = class StylePropertyBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, 16), e.style, i.to, 2));
    }
};

Ze = __decorate([ renderer("hd") ], Ze);

let Je = class AttributeBindingRenderer {
    render(t, e, i, s, n, r) {
        const l = t.container;
        const h = l.has(Ut, false) ? l.get(Ut) : null;
        t.addBinding(new AttributeBinding(t, l, r, s.domWriteQueue, ensureExpression(n, i.from, 16), e, i.attr, h == null ? i.to : i.to.split(/\s/g).map((t => h[t] ?? t)).join(" "), 2));
    }
};

Je = __decorate([ renderer("hc") ], Je);

let ti = class SpreadRenderer {
    constructor() {
        this.ht = a(qe);
        this.r = a(hi);
    }
    render(t, e, i, s, n, r) {
        const l = t.container;
        const h = l.get(bi);
        const a = this.r.renderers;
        const getHydrationContext = t => {
            let e = t;
            let i = h;
            while (i != null && e > 0) {
                i = i.parent;
                --e;
            }
            if (i == null) {
                throw createMappedError(9999);
            }
            return i;
        };
        const renderSpreadInstruction = i => {
            const l = getHydrationContext(i);
            const h = createSurrogateBinding(l);
            const c = this.ht.compileSpread(l.controller.definition, l.instruction?.captures ?? u, l.controller.container, e);
            let f;
            for (f of c) {
                switch (f.type) {
                  case "hs":
                    renderSpreadInstruction(i + 1);
                    break;

                  case "hp":
                    a[f.instructions.type].render(h, findElementControllerFor(e), f.instructions, s, n, r);
                    break;

                  default:
                    a[f.type].render(h, e, f, s, n, r);
                }
            }
            t.addBinding(h);
        };
        renderSpreadInstruction(0);
    }
};

ti = __decorate([ renderer("hs") ], ti);

class SpreadBinding {
    get container() {
        return this.locator;
    }
    get definition() {
        return this.ctrl.definition;
    }
    get isStrictBinding() {
        return this.ctrl.isStrictBinding;
    }
    get state() {
        return this.ctrl.state;
    }
    constructor(t, e) {
        this.ct = t;
        this.ut = e;
        this.isBound = false;
        this.ctrl = e.controller;
        this.locator = this.ctrl.container;
    }
    get(t) {
        return this.locator.get(t);
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        const e = this.scope = this.ut.controller.scope.parent ?? void 0;
        if (e == null) {
            throw createMappedError(9999);
        }
        this.ct.forEach((t => t.bind(e)));
    }
    unbind() {
        this.ct.forEach((t => t.unbind()));
        this.isBound = false;
    }
    addBinding(t) {
        this.ct.push(t);
    }
    addChild(t) {
        if (t.vmKind !== 1) {
            throw createMappedError(9998);
        }
        this.ctrl.addChild(t);
    }
}

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

const createSurrogateBinding = t => new SpreadBinding([], t);

const ei = "IController";

const ii = "IInstruction";

const si = "IRenderLocation";

const ni = "ISlotsInfo";

function createElementContainer(t, e, i, s, n, r) {
    const l = e.container.createChild();
    registerHostNode(l, t, i);
    registerResolver(l, vi, new f(ei, e));
    registerResolver(l, Me, new f(ii, s));
    registerResolver(l, zt, n == null ? ri : new RenderLocationProvider(n));
    registerResolver(l, Ie, oi);
    registerResolver(l, Ee, r == null ? li : new f(ni, r));
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
    const a = i.container.createChild();
    registerHostNode(a, t, s);
    i = i instanceof Controller ? i : i.ctrl;
    registerResolver(a, vi, new f(ei, i));
    registerResolver(a, Me, new f(ii, n));
    registerResolver(a, zt, l == null ? ri : new f(si, l));
    registerResolver(a, Ie, r == null ? oi : new ViewFactoryProvider(r));
    registerResolver(a, Ee, h == null ? li : new f(ni, h));
    return {
        vm: a.invoke(e.Type),
        ctn: a
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

const ri = new RenderLocationProvider(null);

const oi = new ViewFactoryProvider(null);

const li = new f(ni, new AuSlotsInfo(u));

const hi = /*@__PURE__*/ Rt("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.ft ?? (this.ft = this.dt.getAll(Fe, false).reduce(((t, e) => {
            t[e.target] = e;
            return t;
        }), createLookup()));
    }
    constructor() {
        this.gt = new WeakMap;
        this.vt = new WeakMap;
        const t = this.dt = a(v).root;
        this.p = t.get($t);
        this.ep = t.get(O);
        this.oL = t.get(V);
        this.bt = new FragmentNodeSequence(this.p, this.p.document.createDocumentFragment());
    }
    compile(t, e, i) {
        if (t.needsCompile !== false) {
            const s = this.gt;
            const n = e.get(qe);
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
            return new FragmentNodeSequence(this.p, this.xt(t.template));
        }
        let e;
        let i = false;
        const s = this.vt;
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
            this.xt(e);
            s.set(t, e);
        }
        return e == null ? this.bt : new FragmentNodeSequence(this.p, i ? r.importNode(e, true) : r.adoptNode(e.cloneNode(true)));
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
    wt() {
        return this.p.document.createElement("au-m");
    }
    xt(t) {
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
                e.insertBefore(this.wt(), s);
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

var ai;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["host"] = 1] = "host";
    t[t["shadowRoot"] = 2] = "shadowRoot";
    t[t["location"] = 3] = "location";
})(ai || (ai = {}));

const ci = {
    optional: true
};

const ui = optionalResource(N);

const fi = new WeakMap;

class Controller {
    get lifecycleHooks() {
        return this.yt;
    }
    get isActive() {
        return (this.state & (1 | 2)) > 0 && (this.state & 4) === 0;
    }
    get name() {
        if (this.parent === null) {
            switch (this.vmKind) {
              case 1:
                return `[${this.definition.name}]`;

              case 0:
                return this.definition.name;

              case 2:
                return this.viewFactory.name;
            }
        }
        switch (this.vmKind) {
          case 1:
            return `${this.parent.name}>[${this.definition.name}]`;

          case 0:
            return `${this.parent.name}>${this.definition.name}`;

          case 2:
            return this.viewFactory.name === this.parent.definition?.name ? `${this.parent.name}[view]` : `${this.parent.name}[view:${this.viewFactory.name}]`;
        }
    }
    get viewModel() {
        return this.kt;
    }
    set viewModel(t) {
        this.kt = t;
        this.Ct = t == null || this.vmKind === 2 ? HooksDefinition.none : new HooksDefinition(t);
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
        this.isStrictBinding = false;
        this.scope = null;
        this.isBound = false;
        this.At = false;
        this.hostController = null;
        this.mountTarget = 0;
        this.shadowRoot = null;
        this.nodes = null;
        this.location = null;
        this.yt = null;
        this.state = 0;
        this.Bt = false;
        this.$initiator = null;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this.St = 0;
        this._t = 0;
        this.Rt = 0;
        this.kt = n;
        this.Ct = e === 2 ? HooksDefinition.none : new HooksDefinition(n);
        this.location = l;
        this.r = t.root.get(hi);
        this.coercion = e === 2 ? void 0 : t.get(ui);
    }
    static getCached(t) {
        return fi.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (e === void 0) {
            throw createMappedError(500, t);
        }
        return e;
    }
    static $el(t, e, i, s, n = void 0, r = null) {
        if (fi.has(e)) {
            return fi.get(e);
        }
        n = n ?? getElementDefinition(e.constructor);
        const l = new Controller(t, 0, n, null, e, i, r);
        const h = t.get(b(bi));
        if (n.dependencies.length > 0) {
            t.register(...n.dependencies);
        }
        registerResolver(t, bi, new f("IHydrationContext", new HydrationContext(l, s, h)));
        fi.set(e, l);
        if (s == null || s.hydrate !== false) {
            l.hE(s, h);
        }
        return l;
    }
    static $attr(t, e, i, s) {
        if (fi.has(e)) {
            return fi.get(e);
        }
        s = s ?? getAttributeDefinition(e.constructor);
        const n = new Controller(t, 1, s, null, e, i, null);
        if (s.dependencies.length > 0) {
            t.register(...s.dependencies);
        }
        fi.set(e, n);
        n.Tt();
        return n;
    }
    static $view(t, e = void 0) {
        const i = new Controller(t.container, 2, null, t, null, null, null);
        i.parent = e ?? null;
        i.It();
        return i;
    }
    hE(t, e) {
        const i = this.container;
        const s = this.kt;
        let n = this.definition;
        this.scope = $.create(s, null, true);
        if (n.watches.length > 0) {
            createWatchers(this, i, n, s);
        }
        createObservers(this, n, s);
        if (this.Ct.Et) {
            const t = s.define(this, e, n);
            if (t !== void 0 && t !== n) {
                n = CustomElementDefinition.getOrCreate(t);
            }
        }
        this.yt = Be.resolve(i);
        n.register(i);
        if (n.injectable !== null) {
            registerResolver(i, n.injectable, new f("definition.injectable", s));
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
        if (this.Ct.Pt) {
            this.kt.hydrating(this);
        }
        const e = this.Lt = this.r.compile(this.definition, this.container, t);
        const {shadowOptions: i, isStrictBinding: s, hasSlots: n, containerless: r} = e;
        let l = this.location;
        this.isStrictBinding = s;
        if ((this.hostController = findElementControllerFor(this.host, ci)) !== null) {
            this.host = this.container.root.get($t).document.createElement(this.definition.name);
            if (r && l == null) {
                l = this.location = convertToRenderLocation(this.host);
            }
        }
        setRef(this.host, ne, this);
        setRef(this.host, this.definition.key, this);
        if (i !== null || n) {
            if (l != null) {
                throw createMappedError(501);
            }
            setRef(this.shadowRoot = this.host.attachShadow(i ?? mi), ne, this);
            setRef(this.shadowRoot, this.definition.key, this);
            this.mountTarget = 2;
        } else if (l != null) {
            setRef(l, ne, this);
            setRef(l, this.definition.key, this);
            this.mountTarget = 3;
        } else {
            this.mountTarget = 1;
        }
        this.kt.$controller = this;
        this.nodes = this.r.createNodes(e);
        if (this.yt.hydrated !== void 0) {
            this.yt.hydrated.forEach(callHydratedHook, this);
        }
        if (this.Ct.Dt) {
            this.kt.hydrated(this);
        }
    }
    hC() {
        this.r.render(this, this.nodes.findTargets(), this.Lt, this.host);
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
        this.yt = Be.resolve(this.container);
        if (this.yt.created !== void 0) {
            this.yt.created.forEach(callCreatedHook, this);
        }
        if (this.Ct.Mt) {
            this.kt.created(this);
        }
    }
    It() {
        this.Lt = this.r.compile(this.viewFactory.def, this.container, null);
        this.isStrictBinding = this.Lt.isStrictBinding;
        this.r.render(this, (this.nodes = this.r.createNodes(this.Lt)).findTargets(), this.Lt, void 0);
    }
    activate(t, e, i) {
        switch (this.state) {
          case 0:
          case 8:
            if (!(e === null || e.isActive)) {
                return;
            }
            this.state = 1;
            break;

          case 2:
            return;

          case 32:
            throw createMappedError(502, this.name);

          default:
            throw createMappedError(503, this.name, stringifyState(this.state));
        }
        this.parent = e;
        switch (this.vmKind) {
          case 0:
            this.scope.parent = i ?? null;
            break;

          case 1:
            this.scope = i ?? null;
            break;

          case 2:
            if (i === void 0 || i === null) {
                throw createMappedError(504, this.name);
            }
            if (!this.hasLockedScope) {
                this.scope = i;
            }
            break;
        }
        if (this.isStrictBinding) ;
        this.$initiator = t;
        this.qt();
        let s;
        if (this.vmKind !== 2 && this.yt.binding != null) {
            s = x(...this.yt.binding.map(callBindingHook, this));
        }
        if (this.Ct.Ft) {
            s = x(s, this.kt.binding(this.$initiator, this.parent));
        }
        if (isPromise(s)) {
            this.Ht();
            s.then((() => {
                this.At = true;
                if (this.state !== 1) {
                    this.Ot();
                } else {
                    this.bind();
                }
            })).catch((t => {
                this.Vt(t);
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
        let i;
        if (this.bindings !== null) {
            t = 0;
            e = this.bindings.length;
            while (e > t) {
                this.bindings[t].bind(this.scope);
                ++t;
            }
        }
        if (this.vmKind !== 2 && this.yt.bound != null) {
            i = x(...this.yt.bound.map(callBoundHook, this));
        }
        if (this.Ct.Nt) {
            i = x(i, this.kt.bound(this.$initiator, this.parent));
        }
        if (isPromise(i)) {
            this.Ht();
            i.then((() => {
                this.isBound = true;
                if (this.state !== 1) {
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
          case 1:
            this.host.append(...t);
            break;

          case 2:
            this.shadowRoot.append(...t);
            break;

          case 3:
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
              case 1:
              case 2:
                this.hostController.Wt(this.host);
                break;

              case 3:
                this.hostController.Wt(this.location.$start, this.location);
                break;
            }
        }
        switch (this.mountTarget) {
          case 1:
            this.nodes.appendTo(this.host, this.definition != null && this.definition.enhance);
            break;

          case 2:
            {
                const t = this.container;
                const e = t.has(ce, false) ? t.get(ce) : t.get(ue);
                e.applyTo(this.shadowRoot);
                this.nodes.appendTo(this.shadowRoot);
                break;
            }

          case 3:
            this.nodes.insertBefore(this.location);
            break;
        }
        let t = 0;
        let e = void 0;
        if (this.vmKind !== 2 && this.yt.attaching != null) {
            e = x(...this.yt.attaching.map(callAttachingHook, this));
        }
        if (this.Ct.jt) {
            e = x(e, this.kt.attaching(this.$initiator, this.parent));
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
        switch (this.state & ~16) {
          case 2:
            this.state = 4;
            break;

          case 1:
            this.state = 4;
            i = this.$promise?.catch(s);
            break;

          case 0:
          case 8:
          case 32:
          case 8 | 32:
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
        return w(i, (() => {
            if (this.isBound) {
                if (this.vmKind !== 2 && this.yt.detaching != null) {
                    r = x(...this.yt.detaching.map(callDetachingHook, this));
                }
                if (this.Ct.Ut) {
                    r = x(r, this.kt.detaching(this.$initiator, this.parent));
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
          case 0:
          case 2:
            this.nodes.remove();
            this.nodes.unlink();
        }
        if (this.hostController !== null) {
            switch (this.mountTarget) {
              case 1:
              case 2:
                this.host.remove();
                break;

              case 3:
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
          case 1:
            this.scope = null;
            break;

          case 2:
            if (!this.hasLockedScope) {
                this.scope = null;
            }
            if ((this.state & 16) === 16 && !this.viewFactory.tryReturnToCache(this) && this.$initiator === this) {
                this.dispose();
            }
            break;

          case 0:
            this.scope.parent = null;
            break;
        }
        this.state = 8;
        this.$initiator = null;
        this.Xt();
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
    Xt() {
        if (this.$promise !== void 0) {
            xi = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            xi();
            xi = void 0;
        }
    }
    Vt(t) {
        if (this.$promise !== void 0) {
            wi = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            wi(t);
            wi = void 0;
        }
        if (this.$initiator !== this) {
            this.parent.Vt(t);
        }
    }
    qt() {
        ++this.St;
        if (this.$initiator !== this) {
            this.parent.qt();
        }
    }
    Ot() {
        if (this.state !== 1) {
            --this.St;
            this.Xt();
            if (this.$initiator !== this) {
                this.parent.Ot();
            }
            return;
        }
        if (--this.St === 0) {
            if (this.vmKind !== 2 && this.yt.attached != null) {
                yi = x(...this.yt.attached.map(callAttachedHook, this));
            }
            if (this.Ct.Qt) {
                yi = x(yi, this.kt.attached(this.$initiator));
            }
            if (isPromise(yi)) {
                this.Ht();
                yi.then((() => {
                    this.state = 2;
                    this.Xt();
                    if (this.$initiator !== this) {
                        this.parent.Ot();
                    }
                })).catch((t => {
                    this.Vt(t);
                }));
                yi = void 0;
                return;
            }
            yi = void 0;
            this.state = 2;
            this.Xt();
        }
        if (this.$initiator !== this) {
            this.parent.Ot();
        }
    }
    zt() {
        ++this._t;
    }
    Gt() {
        if (--this._t === 0) {
            this.Kt();
            this.removeNodes();
            let t = this.$initiator.head;
            let e;
            while (t !== null) {
                if (t !== this) {
                    if (t.debug) {
                        t.logger.trace(`detach()`);
                    }
                    t.removeNodes();
                }
                if (t.At) {
                    if (t.vmKind !== 2 && t.yt.unbinding != null) {
                        e = x(...t.yt.unbinding.map(callUnbindingHook, t));
                    }
                    if (t.Ct.Yt) {
                        if (t.debug) {
                            t.logger.trace("unbinding()");
                        }
                        e = x(e, t.viewModel.unbinding(t.$initiator, t.parent));
                    }
                }
                if (isPromise(e)) {
                    this.Ht();
                    this.Kt();
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
    Kt() {
        ++this.Rt;
    }
    Zt() {
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
          case 1:
            {
                return getAttributeDefinition(this.kt.constructor).name === t;
            }

          case 0:
            {
                return getElementDefinition(this.kt.constructor).name === t;
            }

          case 2:
            return this.viewFactory.name === t;
        }
    }
    lockScope(t) {
        this.scope = t;
        this.hasLockedScope = true;
    }
    setHost(t) {
        if (this.vmKind === 0) {
            setRef(t, ne, this);
            setRef(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = 1;
        return this;
    }
    setShadowRoot(t) {
        if (this.vmKind === 0) {
            setRef(t, ne, this);
            setRef(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = 2;
        return this;
    }
    setLocation(t) {
        if (this.vmKind === 0) {
            setRef(t, ne, this);
            setRef(t, this.definition.key, this);
        }
        this.location = t;
        this.mountTarget = 3;
        return this;
    }
    release() {
        this.state |= 16;
    }
    dispose() {
        if ((this.state & 32) === 32) {
            return;
        }
        this.state |= 32;
        if (this.Ct.Jt) {
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
            fi.delete(this.kt);
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
        if (this.Ct.te && this.kt.accept(t) === true) {
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

function createObservers(t, e, i) {
    const n = e.bindables;
    const r = wt(n);
    const l = r.length;
    const h = t.container.get(V);
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

const di = new Map;

const getAccessScopeAst = t => {
    let e = di.get(t);
    if (e == null) {
        e = new W(t, 0);
        di.set(t, e);
    }
    return e;
};

function createWatchers(t, e, i, s) {
    const n = e.get(V);
    const r = e.get(O);
    const l = i.watches;
    const h = t.vmKind === 0 ? t.scope : $.create(s, null, true);
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
            f = isString(c) ? r.parse(c, 16) : getAccessScopeAst(c);
            t.addBinding(new ExpressionWatcher(h, e, n, f, u));
        }
    }
}

function isCustomElementController(t) {
    return t instanceof Controller && t.vmKind === 0;
}

function isCustomElementViewModel(t) {
    return T(t) && isElementType(t.constructor);
}

class HooksDefinition {
    constructor(t) {
        this.Et = "define" in t;
        this.Pt = "hydrating" in t;
        this.Dt = "hydrated" in t;
        this.Mt = "created" in t;
        this.Ft = "binding" in t;
        this.Nt = "bound" in t;
        this.jt = "attaching" in t;
        this.Qt = "attached" in t;
        this.Ut = "detaching" in t;
        this.Yt = "unbinding" in t;
        this.Jt = "dispose" in t;
        this.te = "accept" in t;
    }
}

HooksDefinition.none = new HooksDefinition({});

const mi = {
    mode: "open"
};

var gi;

(function(t) {
    t[t["customElement"] = 0] = "customElement";
    t[t["customAttribute"] = 1] = "customAttribute";
    t[t["synthetic"] = 2] = "synthetic";
})(gi || (gi = {}));

var pi;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["activating"] = 1] = "activating";
    t[t["activated"] = 2] = "activated";
    t[t["deactivating"] = 4] = "deactivating";
    t[t["deactivated"] = 8] = "deactivated";
    t[t["released"] = 16] = "released";
    t[t["disposed"] = 32] = "disposed";
})(pi || (pi = {}));

function stringifyState(t) {
    const e = [];
    if ((t & 1) === 1) {
        e.push("activating");
    }
    if ((t & 2) === 2) {
        e.push("activated");
    }
    if ((t & 4) === 4) {
        e.push("deactivating");
    }
    if ((t & 8) === 8) {
        e.push("deactivated");
    }
    if ((t & 16) === 16) {
        e.push("released");
    }
    if ((t & 32) === 32) {
        e.push("disposed");
    }
    return e.length === 0 ? "none" : e.join("|");
}

const vi = /*@__PURE__*/ Rt("IController");

const bi = /*@__PURE__*/ Rt("IHydrationContext");

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

let xi;

let wi;

let yi;

const ki = /*@__PURE__*/ Rt("IAppRoot");

class AppRoot {
    constructor(t, e, i, s) {
        this.config = t;
        this.platform = e;
        this.container = i;
        this.ee = void 0;
        this.host = t.host;
        s.prepare(this);
        registerHostNode(i, e, t.host);
        this.ee = w(this.ie("creating"), (() => {
            const e = t.component;
            const s = i.createChild();
            let n;
            if (isElementType(e)) {
                n = this.container.get(e);
            } else {
                n = t.component;
            }
            const r = {
                hydrate: false,
                projections: null
            };
            const l = this.controller = Controller.$el(s, n, this.host, r);
            l.hE(r, null);
            return w(this.ie("hydrating"), (() => {
                l.hS(null);
                return w(this.ie("hydrated"), (() => {
                    l.hC();
                    this.ee = void 0;
                }));
            }));
        }));
    }
    activate() {
        return w(this.ee, (() => w(this.ie("activating"), (() => w(this.controller.activate(this.controller, null, void 0), (() => this.ie("activated")))))));
    }
    deactivate() {
        return w(this.ie("deactivating"), (() => w(this.controller.deactivate(this.controller, null), (() => this.ie("deactivated")))));
    }
    ie(t) {
        return x(...this.container.getAll(Vt).reduce(((e, i) => {
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

const Ci = /*@__PURE__*/ Rt("IAurelia");

class Aurelia {
    get isRunning() {
        return this.ir;
    }
    get isStarting() {
        return this.se;
    }
    get isStopping() {
        return this.ne;
    }
    get root() {
        if (this.re == null) {
            if (this.next == null) {
                throw createMappedError(767);
            }
            return this.next;
        }
        return this.re;
    }
    constructor(t = n.createContainer()) {
        this.container = t;
        this.ir = false;
        this.se = false;
        this.ne = false;
        this.re = void 0;
        this.next = void 0;
        this.oe = void 0;
        this.le = void 0;
        if (t.has(Ci, true) || t.has(Aurelia, true)) {
            throw createMappedError(768);
        }
        registerResolver(t, Ci, new f("IAurelia", this));
        registerResolver(t, Aurelia, new f("Aurelia", this));
        registerResolver(t, ki, this.he = new f("IAppRoot"));
    }
    register(...t) {
        this.container.register(...t);
        return this;
    }
    app(t) {
        this.next = new AppRoot(t, this.ae(t.host), this.container, this.he);
        return this;
    }
    enhance(t, e) {
        const i = t.container ?? this.container.createChild();
        const s = t.host;
        const n = this.ae(s);
        const r = t.component;
        let l;
        if (isFunction(r)) {
            registerHostNode(i, n, s);
            l = i.invoke(r);
        } else {
            l = r;
        }
        registerResolver(i, jt, new f("IEventTarget", s));
        e = e ?? null;
        const h = Controller.$el(i, l, s, null, CustomElementDefinition.create({
            name: re(),
            template: s,
            enhance: true
        }));
        return w(h.activate(h, e), (() => h));
    }
    async waitForIdle() {
        const t = this.root.platform;
        await t.domWriteQueue.yield();
        await t.domReadQueue.yield();
        await t.taskQueue.yield();
    }
    ae(t) {
        let e;
        if (!this.container.has($t, false)) {
            if (t.ownerDocument.defaultView === null) {
                throw createMappedError(769);
            }
            e = new it(t.ownerDocument.defaultView);
            this.container.register(Et($t, e));
        } else {
            e = this.container.get($t);
        }
        return e;
    }
    start(t = this.next) {
        if (t == null) {
            throw createMappedError(770);
        }
        if (isPromise(this.oe)) {
            return this.oe;
        }
        return this.oe = w(this.stop(), (() => {
            Reflect.set(t.host, "$aurelia", this);
            this.he.prepare(this.re = t);
            this.se = true;
            return w(t.activate(), (() => {
                this.ir = true;
                this.se = false;
                this.oe = void 0;
                this.ce(t, "au-started", t.host);
            }));
        }));
    }
    stop(t = false) {
        if (isPromise(this.le)) {
            return this.le;
        }
        if (this.ir === true) {
            const e = this.re;
            this.ir = false;
            this.ne = true;
            return this.le = w(e.deactivate(), (() => {
                Reflect.deleteProperty(e.host, "$aurelia");
                if (t) {
                    e.dispose();
                }
                this.re = void 0;
                this.he.dispose();
                this.ne = false;
                this.ce(e, "au-stopped", e.host);
            }));
        }
    }
    dispose() {
        if (this.ir || this.ne) {
            throw createMappedError(771);
        }
        this.container.dispose();
    }
    ce(t, e, i) {
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
                this.has = this.ue;
                break;

              case 1:
                this.has = this.fe;
                break;

              default:
                this.has = this.de;
            }
        } else {
            switch (t.length) {
              case 0:
                this.has = this.me;
                break;

              case 1:
                this.has = this.ge;
                break;

              default:
                this.has = this.pe;
            }
        }
    }
    equals(t) {
        return this.chars === t.chars && this.repeat === t.repeat && this.isSymbol === t.isSymbol && this.isInverted === t.isInverted;
    }
    pe(t) {
        return this.chars.includes(t);
    }
    ge(t) {
        return this.chars === t;
    }
    me(t) {
        return false;
    }
    de(t) {
        return !this.chars.includes(t);
    }
    fe(t) {
        return this.chars !== t;
    }
    ue(t) {
        return true;
    }
}

class Interpretation {
    constructor() {
        this.parts = u;
        this.ve = "";
        this.be = {};
        this.xe = {};
    }
    get pattern() {
        const t = this.ve;
        if (t === "") {
            return null;
        } else {
            return t;
        }
    }
    set pattern(t) {
        if (t == null) {
            this.ve = "";
            this.parts = u;
        } else {
            this.ve = t;
            this.parts = this.xe[t];
        }
    }
    append(t, e) {
        const i = this.be;
        if (i[t] === undefined) {
            i[t] = e;
        } else {
            i[t] += e;
        }
    }
    next(t) {
        const e = this.be;
        let i;
        if (e[t] !== undefined) {
            i = this.xe;
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
    get ve() {
        return this.we ? this.ye[0] : null;
    }
    constructor(t, ...e) {
        this.charSpec = t;
        this.ke = [];
        this.Ce = null;
        this.we = false;
        this.ye = e;
    }
    findChild(t) {
        const e = this.ke;
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
        const i = this.ye;
        if (!i.includes(e)) {
            i.push(e);
        }
        let s = this.findChild(t);
        if (s == null) {
            s = new AttrParsingState(t, e);
            this.ke.push(s);
            if (t.repeat) {
                s.ke.push(s);
            }
        }
        return s;
    }
    findMatches(t, e) {
        const i = [];
        const s = this.ke;
        const n = s.length;
        let r = 0;
        let l = null;
        let h = 0;
        let a = 0;
        for (;h < n; ++h) {
            l = s[h];
            if (l.charSpec.has(t)) {
                i.push(l);
                r = l.ye.length;
                a = 0;
                if (l.charSpec.isSymbol) {
                    for (;a < r; ++a) {
                        e.next(l.ye[a]);
                    }
                } else {
                    for (;a < r; ++a) {
                        e.append(l.ye[a], t);
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
        const e = this.Ae = t.length;
        const i = this.Be = [];
        let s = 0;
        for (;e > s; ++s) {
            i.push(new CharSpec(t[s], false, false, false));
        }
    }
    eachChar(t) {
        const e = this.Ae;
        const i = this.Be;
        let s = 0;
        for (;e > s; ++s) {
            t(i[s]);
        }
    }
}

class DynamicSegment {
    constructor(t) {
        this.text = "PART";
        this.Se = new CharSpec(t, true, false, true);
    }
    eachChar(t) {
        t(this.Se);
    }
}

class SymbolSegment {
    constructor(t) {
        this.text = t;
        this.Se = new CharSpec(t, false, true, false);
    }
    eachChar(t) {
        t(this.Se);
    }
}

class SegmentTypes {
    constructor() {
        this.statics = 0;
        this.dynamics = 0;
        this.symbols = 0;
    }
}

const Ai = /*@__PURE__*/ Rt("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

class SyntaxInterpreter {
    constructor() {
        this._e = new AttrParsingState(null);
        this.Re = [ this._e ];
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
            i = this._e;
            s = t[c];
            n = s.pattern;
            r = new SegmentTypes;
            l = this.Te(s, r);
            h = l.length;
            a = t => i = i.append(t, n);
            for (u = 0; h > u; ++u) {
                l[u].eachChar(a);
            }
            i.Ce = r;
            i.we = true;
            ++c;
        }
    }
    interpret(t) {
        const e = new Interpretation;
        const i = t.length;
        let s = this.Re;
        let n = 0;
        let r;
        for (;n < i; ++n) {
            s = this.Ie(s, t.charAt(n), e);
            if (s.length === 0) {
                break;
            }
        }
        s = s.filter(isEndpoint);
        if (s.length > 0) {
            s.sort(sortEndpoint);
            r = s[0];
            if (!r.charSpec.isSymbol) {
                e.next(r.ve);
            }
            e.pattern = r.ve;
        }
        return e;
    }
    Ie(t, e, i) {
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
    Te(t, e) {
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
    return t.we;
}

function sortEndpoint(t, e) {
    const i = t.Ce;
    const s = e.Ce;
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
    constructor(t, e, i, s) {
        this.rawName = t;
        this.rawValue = e;
        this.target = i;
        this.command = s;
    }
}

const Bi = /*@__PURE__*/ Rt("IAttributePattern");

const Si = /*@__PURE__*/ Rt("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor(t, e) {
        this.it = {};
        this.Ee = t;
        const i = this.ye = {};
        const s = e.reduce(((t, e) => {
            const s = getAllPatternDefinitions(e.constructor);
            s.forEach((t => i[t.pattern] = e));
            return t.concat(s);
        }), u);
        t.add(s);
    }
    parse(t, e) {
        let i = this.it[t];
        if (i == null) {
            i = this.it[t] = this.Ee.interpret(t);
        }
        const s = i.pattern;
        if (s == null) {
            return new AttrSyntax(t, e, t, null);
        } else {
            return this.ye[s][s](t, e, i.parts);
        }
    }
}

AttributeParser.inject = [ Ai, y(Bi) ];

function attributePattern(...t) {
    return function decorator(e) {
        return Ti.define(t, e);
    };
}

class AttributePatternResourceDefinition {
    constructor(t) {
        this.Type = t;
        this.name = void 0;
    }
    register(t) {
        Tt(Bi, this.Type).register(t);
    }
}

const _i = ct("attribute-pattern");

const Ri = "attribute-pattern-definitions";

const getAllPatternDefinitions = e => t.annotation.get(e, Ri);

const Ti = bt({
    name: _i,
    definitionAnnotationKey: Ri,
    define(e, i) {
        const s = new AttributePatternResourceDefinition(i);
        ot(_i, s, i);
        ut(i, _i);
        t.annotation.set(i, Ri, e);
        ft(i, Ri);
        return i;
    },
    getPatternDefinitions: getAllPatternDefinitions
});

let Ii = class DotSeparatedAttributePattern {
    "PART.PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], i[1]);
    }
    "PART.PART.PART"(t, e, i) {
        return new AttrSyntax(t, e, `${i[0]}.${i[1]}`, i[2]);
    }
};

Ii = __decorate([ attributePattern({
    pattern: "PART.PART",
    symbols: "."
}, {
    pattern: "PART.PART.PART",
    symbols: "."
}) ], Ii);

let Ei = class RefAttributePattern {
    ref(t, e, i) {
        return new AttrSyntax(t, e, "element", "ref");
    }
    "PART.ref"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "ref");
    }
};

Ei = __decorate([ attributePattern({
    pattern: "ref",
    symbols: ""
}, {
    pattern: "PART.ref",
    symbols: "."
}) ], Ei);

let Pi = class ColonPrefixedBindAttributePattern {
    ":PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "bind");
    }
};

Pi = __decorate([ attributePattern({
    pattern: ":PART",
    symbols: ":"
}) ], Pi);

let Li = class AtPrefixedTriggerAttributePattern {
    "@PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "trigger");
    }
};

Li = __decorate([ attributePattern({
    pattern: "@PART",
    symbols: "@"
}) ], Li);

let Di = class SpreadAttributePattern {
    "...$attrs"(t, e, i) {
        return new AttrSyntax(t, e, "", "...$attrs");
    }
};

Di = __decorate([ attributePattern({
    pattern: "...$attrs",
    symbols: ""
}) ], Di);

var Mi;

(function(t) {
    t[t["None"] = 0] = "None";
    t[t["IgnoreAttr"] = 1] = "IgnoreAttr";
})(Mi || (Mi = {}));

function bindingCommand(t) {
    return function(e) {
        return Fi.define(t, e);
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
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        Tt(i, e).register(t);
        It(i, e).register(t);
        registerAliases(s, Fi, i, t);
    }
}

const qi = /*@__PURE__*/ ct("binding-command");

const getCommandKeyFrom = t => `${qi}:${t}`;

const getCommandAnnotation = (t, e) => nt(at(e), t);

const Fi = bt({
    name: qi,
    keyFrom: getCommandKeyFrom,
    define(t, e) {
        const i = BindingCommandDefinition.create(t, e);
        ot(qi, i, i.Type);
        ot(qi, i, i);
        ut(e, qi);
        return i.Type;
    },
    getAnnotation: getCommandAnnotation
});

let Hi = class OneTimeBindingCommand {
    get type() {
        return 0;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = t.attr.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? k(n);
        } else {
            if (r === "" && t.def.type === 1) {
                r = k(n);
            }
            n = t.bindable.property;
        }
        return new PropertyBindingInstruction(e.parse(r, 16), n, 1);
    }
};

Hi = __decorate([ bindingCommand("one-time") ], Hi);

let Oi = class ToViewBindingCommand {
    get type() {
        return 0;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = t.attr.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? k(n);
        } else {
            if (r === "" && t.def.type === 1) {
                r = k(n);
            }
            n = t.bindable.property;
        }
        return new PropertyBindingInstruction(e.parse(r, 16), n, 2);
    }
};

Oi = __decorate([ bindingCommand("to-view") ], Oi);

let Vi = class FromViewBindingCommand {
    get type() {
        return 0;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = s.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? k(n);
        } else {
            if (r === "" && t.def.type === 1) {
                r = k(n);
            }
            n = t.bindable.property;
        }
        return new PropertyBindingInstruction(e.parse(r, 16), n, 4);
    }
};

Vi = __decorate([ bindingCommand("from-view") ], Vi);

let Ni = class TwoWayBindingCommand {
    get type() {
        return 0;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = s.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? k(n);
        } else {
            if (r === "" && t.def.type === 1) {
                r = k(n);
            }
            n = t.bindable.property;
        }
        return new PropertyBindingInstruction(e.parse(r, 16), n, 6);
    }
};

Ni = __decorate([ bindingCommand("two-way") ], Ni);

let $i = class DefaultBindingCommand {
    get type() {
        return 0;
    }
    build(t, e, i) {
        const s = t.attr;
        const n = t.bindable;
        let r;
        let l;
        let h = s.target;
        let a = s.rawValue;
        if (n == null) {
            l = i.isTwoWay(t.node, h) ? 6 : 2;
            h = i.map(t.node, h) ?? k(h);
        } else {
            if (a === "" && t.def.type === 1) {
                a = k(h);
            }
            r = t.def.defaultBindingMode;
            l = n.mode === 8 || n.mode == null ? r == null || r === 8 ? 2 : r : n.mode;
            h = n.property;
        }
        return new PropertyBindingInstruction(e.parse(a, 16), h, l);
    }
};

$i = __decorate([ bindingCommand("bind") ], $i);

let Wi = class ForBindingCommand {
    get type() {
        return 0;
    }
    static get inject() {
        return [ Si ];
    }
    constructor(t) {
        this.Pe = t;
    }
    build(t, e) {
        const i = t.bindable === null ? k(t.attr.target) : t.bindable.property;
        const s = e.parse(t.attr.rawValue, 2);
        let n = u;
        if (s.semiIdx > -1) {
            const e = t.attr.rawValue.slice(s.semiIdx + 1);
            const i = e.indexOf(":");
            if (i > -1) {
                const t = e.slice(0, i).trim();
                const s = e.slice(i + 1).trim();
                const r = this.Pe.parse(t, s);
                n = [ new MultiAttrInstruction(s, r.target, r.command) ];
            }
        }
        return new IteratorBindingInstruction(s, i, n);
    }
};

Wi = __decorate([ bindingCommand("for") ], Wi);

let ji = class TriggerBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, 8), t.attr.target, true, false);
    }
};

ji = __decorate([ bindingCommand("trigger") ], ji);

let zi = class CaptureBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, 8), t.attr.target, false, true);
    }
};

zi = __decorate([ bindingCommand("capture") ], zi);

let Ui = class AttrBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction(t.attr.target, e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

Ui = __decorate([ bindingCommand("attr") ], Ui);

let Gi = class StyleBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction("style", e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

Gi = __decorate([ bindingCommand("style") ], Gi);

let Xi = class ClassBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction("class", e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

Xi = __decorate([ bindingCommand("class") ], Xi);

let Qi = class RefBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new RefBindingInstruction(e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

Qi = __decorate([ bindingCommand("ref") ], Qi);

let Ki = class SpreadBindingCommand {
    get type() {
        return 1;
    }
    build(t) {
        return new SpreadBindingInstruction;
    }
};

Ki = __decorate([ bindingCommand("...$attrs") ], Ki);

const Yi = /*@__PURE__*/ Rt("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

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
        return Tt(Yi, this).register(t);
    }
    constructor(t) {
        this.Le = xt(createLookup(), {
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
        this.De = o("a altGlyph animate animateColor circle clipPath defs ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feFlood feGaussianBlur feImage feMerge feMorphology feOffset feSpecularLighting feTile feTurbulence filter font foreignObject g glyph glyphRef image line linearGradient marker mask missing-glyph path pattern polygon polyline radialGradient rect stop svg switch symbol text textPath tref tspan use");
        this.Me = o("alignment-baseline baseline-shift clip-path clip-rule clip color-interpolation-filters color-interpolation color-profile color-rendering color cursor direction display dominant-baseline enable-background fill-opacity fill-rule fill filter flood-color flood-opacity font-family font-size-adjust font-size font-stretch font-style font-variant font-weight glyph-orientation-horizontal glyph-orientation-vertical image-rendering kerning letter-spacing lighting-color marker-end marker-mid marker-start mask opacity overflow pointer-events shape-rendering stop-color stop-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width stroke text-anchor text-decoration text-rendering unicode-bidi visibility word-spacing writing-mode");
        this.SVGElement = t.globalThis.SVGElement;
        const e = t.document.createElement("div");
        e.innerHTML = "<svg><altGlyph /></svg>";
        if (e.firstElementChild.nodeName === "altglyph") {
            const t = this.Le;
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
        return this.De[t.nodeName] === true && this.Me[e] === true || this.Le[t.nodeName]?.[e] === true;
    }
}

SVGAnalyzer.inject = [ $t ];

const Zi = /*@__PURE__*/ Rt("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    constructor() {
        this.fns = [];
        this.qe = createLookup();
        this.Fe = createLookup();
        this.svg = a(Yi);
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
            s = (e = this.qe)[n] ?? (e[n] = createLookup());
            for (r in i) {
                if (s[r] !== void 0) {
                    throw createError(r, n);
                }
                s[r] = i[r];
            }
        }
    }
    useGlobalMapping(t) {
        const e = this.Fe;
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
        return this.qe[t.nodeName]?.[e] ?? this.Fe[e] ?? (isDataAttribute(t, e, this.svg) ? e : null);
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

var Ji;

(function(t) {
    t[t["oneTime"] = 1] = "oneTime";
    t[t["toView"] = 2] = "toView";
    t[t["fromView"] = 4] = "fromView";
    t[t["twoWay"] = 6] = "twoWay";
    t[t["default"] = 8] = "default";
})(Ji || (Ji = {}));

const ts = createLookup();

class AttributeNSAccessor {
    static forNs(t) {
        return ts[t] ?? (ts[t] = new AttributeNSAccessor(t));
    }
    constructor(t) {
        this.ns = t;
        this.type = 2 | 4;
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
        this.type = 2 | 4;
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

const es = new DataAttributeAccessor;

const is = "au-start";

const ss = "au-end";

const createElement = (t, e) => t.document.createElement(e);

const createComment = (t, e) => t.document.createComment(e);

const createLocation = t => {
    const e = createComment(t, ss);
    e.$start = createComment(t, is);
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

const ns = {
    childList: true,
    subtree: true,
    characterData: true
};

function defaultMatcher$1(t, e) {
    return t === e;
}

class SelectValueObserver {
    constructor(t, e, i, s) {
        this.type = 2 | 1 | 4;
        this.v = void 0;
        this.ov = void 0;
        this.He = false;
        this.Oe = void 0;
        this.Ve = void 0;
        this.iO = false;
        this.L = false;
        this.P = t;
        this.oL = s;
        this.cf = i;
    }
    getValue() {
        return this.iO ? this.v : this.P.multiple ? getSelectedOptions(this.P.options) : this.P.value;
    }
    setValue(t) {
        this.ov = this.v;
        this.v = t;
        this.He = t !== this.ov;
        this.Ne(t instanceof Array ? t : null);
        this.O();
    }
    O() {
        if (this.He) {
            this.He = false;
            this.syncOptions();
        }
    }
    handleCollectionChange() {
        this.syncOptions();
    }
    syncOptions() {
        const t = this.v;
        const e = this.P;
        const i = isArray(t);
        const s = e.matcher ?? defaultMatcher$1;
        const n = e.options;
        let r = n.length;
        while (r-- > 0) {
            const e = n[r];
            const l = vt.call(e, "model") ? e.model : e.value;
            if (i) {
                e.selected = t.findIndex((t => !!s(l, t))) !== -1;
                continue;
            }
            e.selected = !!s(l, t);
        }
    }
    syncValue() {
        const t = this.P;
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
                    h.push(vt.call(r, "model") ? r.model : r.value);
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
                r = vt.call(l, "model") ? l.model : l.value;
                break;
            }
            ++n;
        }
        this.ov = this.v;
        this.v = r;
        return true;
    }
    M() {
        (this.Ve = createMutationObserver(this.P, this.$e.bind(this))).observe(this.P, ns);
        this.Ne(this.v instanceof Array ? this.v : null);
        this.iO = true;
    }
    q() {
        this.Ve.disconnect();
        this.Oe?.unsubscribe(this);
        this.Ve = this.Oe = void 0;
        this.iO = false;
    }
    Ne(t) {
        this.Oe?.unsubscribe(this);
        this.Oe = void 0;
        if (t != null) {
            if (!this.P.multiple) {
                throw createError$1(`AUR0654`);
            }
            (this.Oe = this.oL.getArrayObserver(t)).subscribe(this);
        }
    }
    handleEvent() {
        const t = this.syncValue();
        if (t) {
            this.We();
        }
    }
    $e(t) {
        this.syncOptions();
        const e = this.syncValue();
        if (e) {
            this.We();
        }
    }
    We() {
        rs = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, rs);
    }
}

mixinNodeObserverUseConfig(SelectValueObserver);

H(SelectValueObserver);

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
            e[e.length] = vt.call(n, "model") ? n.model : n.value;
        }
        ++s;
    }
    return e;
}

let rs = void 0;

const os = "--";

class StyleAttributeAccessor {
    constructor(t) {
        this.obj = t;
        this.type = 2 | 4;
        this.v = "";
        this.ov = "";
        this.styles = {};
        this.version = 0;
        this.He = false;
    }
    getValue() {
        return this.obj.style.cssText;
    }
    setValue(t) {
        this.v = t;
        this.He = t !== this.ov;
        this.O();
    }
    je(t) {
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
    ze(t) {
        let e;
        let s;
        const n = [];
        for (s in t) {
            e = t[s];
            if (e == null) {
                continue;
            }
            if (isString(e)) {
                if (s.startsWith(os)) {
                    n.push([ s, e ]);
                    continue;
                }
                n.push([ i(s), e ]);
                continue;
            }
            n.push(...this.Ue(e));
        }
        return n;
    }
    Ge(t) {
        const e = t.length;
        if (e > 0) {
            const i = [];
            let s = 0;
            for (;e > s; ++s) {
                i.push(...this.Ue(t[s]));
            }
            return i;
        }
        return u;
    }
    Ue(t) {
        if (isString(t)) {
            return this.je(t);
        }
        if (t instanceof Array) {
            return this.Ge(t);
        }
        if (t instanceof Object) {
            return this.ze(t);
        }
        return u;
    }
    O() {
        if (this.He) {
            this.He = false;
            const t = this.v;
            const e = this.styles;
            const i = this.Ue(t);
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
                if (!vt.call(e, s) || e[s] !== n) {
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
        this.type = 2 | 1 | 4;
        this.v = "";
        this.ov = "";
        this.He = false;
        this.L = false;
        this.P = t;
        this.k = e;
        this.cf = i;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (Ct(t, this.v)) {
            return;
        }
        this.ov = this.v;
        this.v = t;
        this.He = true;
        if (!this.cf.readonly) {
            this.O();
        }
    }
    O() {
        if (this.He) {
            this.He = false;
            this.P[this.k] = this.v ?? this.cf.default;
            this.We();
        }
    }
    handleEvent() {
        this.ov = this.v;
        this.v = this.P[this.k];
        if (this.ov !== this.v) {
            this.He = false;
            this.We();
        }
    }
    M() {
        this.v = this.ov = this.P[this.k];
    }
    We() {
        ls = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, ls);
    }
}

mixinNodeObserverUseConfig(ValueAttributeObserver);

H(ValueAttributeObserver);

let ls = void 0;

const hs = "http://www.w3.org/1999/xlink";

const as = "http://www.w3.org/XML/1998/namespace";

const cs = "http://www.w3.org/2000/xmlns/";

const us = xt(createLookup(), {
    "xlink:actuate": [ "actuate", hs ],
    "xlink:arcrole": [ "arcrole", hs ],
    "xlink:href": [ "href", hs ],
    "xlink:role": [ "role", hs ],
    "xlink:show": [ "show", hs ],
    "xlink:title": [ "title", hs ],
    "xlink:type": [ "type", hs ],
    "xml:lang": [ "lang", as ],
    "xml:space": [ "space", as ],
    xmlns: [ "xmlns", cs ],
    "xmlns:xlink": [ "xlink", cs ]
});

const fs = new j;

fs.type = 2 | 4;

class NodeObserverLocator {
    constructor() {
        this.allowDirtyCheck = true;
        this.Xe = createLookup();
        this.Qe = createLookup();
        this.Ke = createLookup();
        this.Ye = createLookup();
        this.Ze = a(C);
        this.p = a($t);
        this.Je = a(z);
        this.svg = a(Yi);
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
    static register(t) {
        It(U, NodeObserverLocator).register(t);
        Tt(U, NodeObserverLocator).register(t);
    }
    handles(t, e) {
        return t instanceof this.p.Node;
    }
    useConfig(t, e, i) {
        const s = this.Xe;
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
        const i = this.Qe;
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
        if (e in this.Ye || e in (this.Ke[t.tagName] ?? A)) {
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
            return es;

          default:
            {
                const i = us[e];
                if (i !== undefined) {
                    return AttributeNSAccessor.forNs(i[1]);
                }
                if (isDataAttribute(t, e, this.svg)) {
                    return es;
                }
                return fs;
            }
        }
    }
    overrideAccessor(t, e) {
        var i, s;
        let n;
        if (isString(t)) {
            n = (i = this.Ke)[t] ?? (i[t] = createLookup());
            n[e] = true;
        } else {
            for (const e in t) {
                for (const i of t[e]) {
                    n = (s = this.Ke)[e] ?? (s[e] = createLookup());
                    n[i] = true;
                }
            }
        }
    }
    overrideAccessorGlobal(...t) {
        for (const e of t) {
            this.Ye[e] = true;
        }
    }
    getNodeObserverConfig(t, e) {
        return this.Xe[t.tagName]?.[e] ?? this.Qe[e];
    }
    getNodeObserver(t, e, i) {
        const s = this.Xe[t.tagName]?.[e] ?? this.Qe[e];
        let n;
        if (s != null) {
            n = new (s.type ?? ValueAttributeObserver)(t, e, s, i, this.Ze);
            if (!n.doNotCache) {
                G(t)[e] = n;
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
        const n = us[e];
        if (n !== undefined) {
            return AttributeNSAccessor.forNs(n[1]);
        }
        if (isDataAttribute(t, e, this.svg)) {
            return es;
        }
        if (e in t.constructor.prototype) {
            if (this.allowDirtyCheck) {
                return this.Je.createProperty(t, e);
            }
            throw createMappedError(652, e);
        } else {
            return new X(t, e);
        }
    }
}

NodeObserverLocator.inject = [ C, $t, z, Yi ];

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
        this.type = 2 | 1 | 4;
        this.v = void 0;
        this.ov = void 0;
        this.ti = void 0;
        this.ei = void 0;
        this.L = false;
        this.P = t;
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
        this.ii();
        this.si();
        this.We();
    }
    handleCollectionChange() {
        this.si();
    }
    handleChange(t, e) {
        this.si();
    }
    si() {
        const t = this.v;
        const e = this.P;
        const i = vt.call(e, "model") ? e.model : e.value;
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
        const e = this.P;
        const i = vt.call(e, "model") ? e.model : e.value;
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
        this.We();
    }
    M() {
        this.ii();
    }
    q() {
        this.ti?.unsubscribe(this);
        this.ei?.unsubscribe(this);
        this.ti = this.ei = void 0;
    }
    We() {
        ds = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, ds);
    }
    ii() {
        const t = this.P;
        (this.ei ?? (this.ei = t.$observers?.model ?? t.$observers?.value))?.subscribe(this);
        this.ti?.unsubscribe(this);
        this.ti = void 0;
        if (t.type === "checkbox") {
            (this.ti = getCollectionObserver(this.v, this.oL))?.subscribe(this);
        }
    }
}

mixinNodeObserverUseConfig(CheckedObserver);

H(CheckedObserver);

let ds = void 0;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) {
            throw createMappedError(9994, e);
        }
        e.useTargetObserver(es);
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
        this.oL = a(V);
        this.ni = a(U);
    }
    bind(t, e, ...i) {
        if (!(this.ni instanceof NodeObserverLocator)) {
            throw createMappedError(9993);
        }
        if (i.length === 0) {
            throw createMappedError(802);
        }
        if (!(e instanceof PropertyBinding) || !(e.mode & 4)) {
            throw createMappedError(803);
        }
        const s = this.ni.getNodeObserverConfig(e.target, e.targetProperty);
        if (s == null) {
            throw createMappedError(9992, e);
        }
        const n = this.ni.getNodeObserver(e.target, e.targetProperty, this.oL);
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
        this.ri = false;
        this.oi = 0;
        this.li = a(Ie);
        this.l = a(zt);
    }
    attaching(t, e) {
        let i;
        const s = this.$controller;
        const n = this.oi++;
        const isCurrent = () => !this.ri && this.oi === n + 1;
        return w(this.pending, (() => {
            if (!isCurrent()) {
                return;
            }
            this.pending = void 0;
            if (this.value) {
                i = this.view = this.ifView = this.cache && this.ifView != null ? this.ifView : this.li.create();
            } else {
                i = this.view = this.elseView = this.cache && this.elseView != null ? this.elseView : this.elseFactory?.create();
            }
            if (i == null) {
                return;
            }
            i.setLocation(this.l);
            this.pending = w(i.activate(t, s, s.scope), (() => {
                if (isCurrent()) {
                    this.pending = void 0;
                }
            }));
        }));
    }
    detaching(t, e) {
        this.ri = true;
        return w(this.pending, (() => {
            this.ri = false;
            this.pending = void 0;
            void this.view?.deactivate(t, this.$controller);
        }));
    }
    valueChanged(t, e) {
        if (!this.$controller.isActive) {
            return;
        }
        t = !!t;
        e = !!e;
        if (t === e) {
            return;
        }
        const i = this.view;
        const s = this.$controller;
        const n = this.oi++;
        const isCurrent = () => !this.ri && this.oi === n + 1;
        let r;
        return w(this.pending, (() => this.pending = w(i?.deactivate(i, s), (() => {
            if (!isCurrent()) {
                return;
            }
            if (t) {
                r = this.view = this.ifView = this.cache && this.ifView != null ? this.ifView : this.li.create();
            } else {
                r = this.view = this.elseView = this.cache && this.elseView != null ? this.elseView : this.elseFactory?.create();
            }
            if (r == null) {
                return;
            }
            r.setLocation(this.l);
            return w(r.activate(r, s, s.scope), (() => {
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
        this.f = a(Ie);
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

const ms = [ 18, 17 ];

class Repeat {
    constructor(t, e, i, s, n) {
        this.views = [];
        this.key = null;
        this.hi = new Map;
        this.ai = new Map;
        this.ui = void 0;
        this.fi = false;
        this.di = false;
        this.mi = null;
        this.gi = void 0;
        this.pi = false;
        const r = t.props[0].props[0];
        if (r !== void 0) {
            const {to: t, value: i, command: s} = r;
            if (t === "key") {
                if (s === null) {
                    this.key = i;
                } else if (s === "bind") {
                    this.key = e.parse(i, 16);
                } else {
                    throw createMappedError(775, s);
                }
            } else {
                throw createMappedError(776, t);
            }
        }
        this.l = i;
        this.vi = s;
        this.f = n;
    }
    binding(t, e) {
        const i = this.vi.bindings;
        const s = i.length;
        let n = void 0;
        let r;
        let l = 0;
        for (;s > l; ++l) {
            n = i[l];
            if (n.target === this && n.targetProperty === "items") {
                r = this.forOf = n.ast;
                this.bi = n;
                let t = r.iterable;
                while (t != null && ms.includes(t.$kind)) {
                    t = t.expression;
                    this.fi = true;
                }
                this.mi = t;
                break;
            }
        }
        this.xi();
        const h = r.declaration;
        if (!(this.pi = h.$kind === 24 || h.$kind === 25)) {
            this.local = E(h, this.$controller.scope, n, null);
        }
    }
    attaching(t, e) {
        this.wi();
        return this.yi(t);
    }
    detaching(t, e) {
        this.xi();
        return this.ki(t);
    }
    unbinding(t, e) {
        this.ai.clear();
        this.hi.clear();
    }
    itemsChanged() {
        if (!this.$controller.isActive) {
            return;
        }
        this.xi();
        this.wi();
        this.Ci(this.items, void 0);
    }
    handleCollectionChange(t, e) {
        const i = this.$controller;
        if (!i.isActive) {
            return;
        }
        if (this.fi) {
            if (this.di) {
                return;
            }
            this.di = true;
            this.items = E(this.forOf.iterable, i.scope, this.bi, null);
            this.di = false;
            return;
        }
        this.wi();
        this.Ci(t, e);
    }
    Ci(t, e) {
        const i = this.views;
        const s = i.length;
        const n = this.key;
        const r = n !== null;
        if (r || e === void 0) {
            const t = this.local;
            const l = this.gi;
            const h = l.length;
            const a = this.forOf;
            const c = a.declaration;
            const u = this.bi;
            const f = this.pi;
            e = Q(h);
            let d = 0;
            if (s === 0) {
                for (;d < h; ++d) {
                    e[d] = -2;
                }
            } else if (h === 0) {
                if (f) {
                    for (d = 0; d < s; ++d) {
                        e.deletedIndices.push(d);
                        e.deletedItems.push(E(c, i[d].scope, u, null));
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
                        m[d] = E(c, i[d].scope, u, null);
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
                const A = this.hi;
                const B = this.ai;
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
            const t = w(this.ki(null), (() => this.yi(null)));
            if (isPromise(t)) {
                t.catch(rethrow);
            }
        } else {
            const t = K(e);
            if (t.deletedIndices.length > 0) {
                const e = w(this.Ai(t), (() => this.Bi(s, t)));
                if (isPromise(e)) {
                    e.catch(rethrow);
                }
            } else {
                this.Bi(s, t);
            }
        }
    }
    xi() {
        const t = this.$controller.scope;
        let e = this.Si;
        let i = this.fi;
        let s;
        if (i) {
            e = this.Si = E(this.mi, t, this.bi, null) ?? null;
            i = this.fi = !Ct(this.items, e);
        }
        const n = this.ui;
        if (this.$controller.isActive) {
            s = this.ui = Y(i ? e : this.items);
            if (n !== s) {
                n?.unsubscribe(this);
                s?.subscribe(this);
            }
        } else {
            n?.unsubscribe(this);
            this.ui = undefined;
        }
    }
    wi() {
        const {items: t} = this;
        if (isArray(t)) {
            this.gi = t;
            return;
        }
        const e = [];
        iterate(t, ((t, i) => {
            e[i] = t;
        }));
        this.gi = e;
    }
    yi(t) {
        let e = void 0;
        let i;
        let s;
        let n;
        const {$controller: r, f: l, local: h, l: a, items: c, ai: u, bi: f, forOf: d, pi: m} = this;
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
    ki(t) {
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
    Ai(t) {
        let e = void 0;
        let i;
        let s;
        const {$controller: n, views: r} = this;
        const l = t.deletedIndices;
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
        let c = 0;
        for (;h > a; ++a) {
            c = l[a] - a;
            r.splice(c, 1);
        }
        if (e !== void 0) {
            return e.length === 1 ? e[0] : Promise.all(e);
        }
    }
    Bi(t, e) {
        let i = void 0;
        let s;
        let n;
        let r;
        let l = 0;
        const {$controller: h, f: a, local: c, gi: u, l: f, views: d, pi: m, bi: g, ai: p, forOf: v} = this;
        const b = e.length;
        for (;b > l; ++l) {
            if (e[l] === -2) {
                n = a.create();
                d.splice(l, 0, n);
            }
        }
        if (d.length !== b) {
            throw createMappedError(814, [ d.length, b ]);
        }
        const x = h.scope;
        const w = e.length;
        Z(d, e);
        const y = longestIncreasingSubsequence(e);
        const k = y.length;
        const C = v.declaration;
        let A;
        let B = k - 1;
        l = w - 1;
        for (;l >= 0; --l) {
            n = d[l];
            A = d[l + 1];
            n.nodes.link(A?.nodes ?? f);
            if (e[l] === -2) {
                r = getScope(p, u[l], v, x, g, c, m);
                setContextualProperties(r.overrideContext, l, w);
                n.setLocation(f);
                s = n.activate(n, h, r);
                if (isPromise(s)) {
                    (i ?? (i = [])).push(s);
                }
            } else if (B < 0 || k === 1 || l !== y[B]) {
                if (m) {
                    F(C, n.scope, g, u[l]);
                } else {
                    n.scope.bindingContext[c] = u[l];
                }
                setContextualProperties(n.scope.overrideContext, l, w);
                n.nodes.insertBefore(n.location);
            } else {
                if (m) {
                    F(C, n.scope, g, u[l]);
                } else {
                    n.scope.bindingContext[c] = u[l];
                }
                if (t !== w) {
                    setContextualProperties(n.scope.overrideContext, l, w);
                }
                --B;
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

Repeat.inject = [ Me, O, zt, vi, Ie ];

__decorate([ bindable ], Repeat.prototype, "items", void 0);

templateController("repeat")(Repeat);

let gs = 16;

let ps = new Int32Array(gs);

let vs = new Int32Array(gs);

function longestIncreasingSubsequence(t) {
    const e = t.length;
    if (e > gs) {
        gs = e;
        ps = new Int32Array(e);
        vs = new Int32Array(e);
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
            l = ps[i];
            n = t[l];
            if (n !== -2 && n < s) {
                vs[r] = l;
                ps[++i] = r;
                continue;
            }
            h = 0;
            a = i;
            while (h < a) {
                c = h + a >> 1;
                n = t[ps[c]];
                if (n !== -2 && n < s) {
                    h = c + 1;
                } else {
                    a = c;
                }
            }
            n = t[ps[h]];
            if (s < n || n === -2) {
                if (h > 0) {
                    vs[r] = ps[h - 1];
                }
                ps[h] = r;
            }
        }
    }
    r = ++i;
    const u = new Int32Array(r);
    s = ps[i - 1];
    while (i-- > 0) {
        u[i] = s;
        s = vs[s];
    }
    while (r-- > 0) ps[r] = 0;
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

const bs = pt.toString;

const getCount = t => {
    switch (bs.call(t)) {
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
    switch (bs.call(t)) {
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
            r = E(e, s, n, null);
        }
        t.set(i, r);
    }
    return r;
};

const getScope = (t, e, i, s, n, r, l) => {
    let h = t.get(e);
    if (h === void 0) {
        if (l) {
            F(i.declaration, h = $.fromParent(s, new J), n, e);
        } else {
            h = $.fromParent(s, new J(r, e));
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

class With {
    constructor() {
        this.view = a(Ie).create().setLocation(a(zt));
    }
    valueChanged(t, e) {
        const i = this.$controller;
        const s = this.view.bindings;
        let n;
        let r = 0, l = 0;
        if (i.isActive && s != null) {
            n = $.fromParent(i.scope, t === void 0 ? {} : t);
            for (l = s.length; l > r; ++r) {
                s[r].bind(n);
            }
        }
    }
    attaching(t, e) {
        const {$controller: i, value: s} = this;
        const n = $.fromParent(i.scope, s === void 0 ? {} : s);
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

let xs = class Switch {
    constructor() {
        this.cases = [];
        this.activeCases = [];
        this.promise = void 0;
        this.f = a(Ie);
        this.l = a(zt);
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
        this.queue((() => this._i(t)));
    }
    _i(t) {
        const e = t.isMatch(this.value);
        const i = this.activeCases;
        const s = i.length;
        if (!e) {
            if (s > 0 && i[0].id === t.id) {
                return this.Ri(null);
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
        return w(this.Ri(null, n), (() => {
            this.activeCases = n;
            return this.Ti(null);
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
        return w(this.activeCases.length > 0 ? this.Ri(t, i) : void 0, (() => {
            this.activeCases = i;
            if (i.length === 0) {
                return;
            }
            return this.Ti(t);
        }));
    }
    Ti(t) {
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
        return x(...i.map((e => e.activate(t, n))));
    }
    Ri(t, e = []) {
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
        return w(x(...i.reduce(((i, s) => {
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
        i = this.promise = w(w(e, t), (() => {
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

__decorate([ bindable ], xs.prototype, "value", void 0);

xs = __decorate([ templateController("switch") ], xs);

let ws = 0;

let ys = class Case {
    constructor() {
        this.id = ++ws;
        this.fallThrough = false;
        this.view = void 0;
        this.f = a(Ie);
        this.Ze = a(V);
        this.l = a(zt);
        this.Ii = a(B).scopeTo(`${this.constructor.name}-#${this.id}`);
    }
    link(t, e, i, s) {
        const n = t.parent;
        const r = n?.viewModel;
        if (r instanceof xs) {
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
        this.Ii.debug("isMatch()");
        const e = this.value;
        if (isArray(e)) {
            if (this.ui === void 0) {
                this.ui = this.Ei(e);
            }
            return e.includes(t);
        }
        return e === t;
    }
    valueChanged(t, e) {
        if (isArray(t)) {
            this.ui?.unsubscribe(this);
            this.ui = this.Ei(t);
        } else if (this.ui !== void 0) {
            this.ui.unsubscribe(this);
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
        this.ui?.unsubscribe(this);
        this.view?.dispose();
        this.view = void 0;
    }
    linkToSwitch(t) {
        t.cases.push(this);
    }
    Ei(t) {
        const e = this.Ze.getArrayObserver(t);
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

__decorate([ bindable ], ys.prototype, "value", void 0);

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
    mode: 1
}) ], ys.prototype, "fallThrough", void 0);

ys = __decorate([ templateController("case") ], ys);

let ks = class DefaultCase extends ys {
    linkToSwitch(t) {
        if (t.defaultCase !== void 0) {
            throw createMappedError(816);
        }
        t.defaultCase = this;
    }
};

ks = __decorate([ templateController("default-case") ], ks);

let Cs = class PromiseTemplateController {
    constructor() {
        this.preSettledTask = null;
        this.postSettledTask = null;
        this.f = a(Ie);
        this.l = a(zt);
        this.p = a($t);
        this.logger = a(B).scopeTo("promise.resolve");
    }
    link(t, e, i, s) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(t, e) {
        const i = this.view;
        const s = this.$controller;
        return w(i.activate(t, s, this.viewScope = $.fromParent(s.scope, {})), (() => this.swap(t)));
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
            void x(h = (this.preSettledTask = i.queueTask((() => x(s?.deactivate(t), n?.deactivate(t), r?.activate(t, l))), a)).result.catch((t => {
                if (!(t instanceof st)) throw t;
            })), e.then((c => {
                if (this.value !== e) {
                    return;
                }
                const fulfill = () => {
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => x(r?.deactivate(t), n?.deactivate(t), s?.activate(t, l, c))), a)).result;
                };
                if (this.preSettledTask.status === 1) {
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
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => x(r?.deactivate(t), s?.deactivate(t), n?.activate(t, l, c))), a)).result;
                };
                if (this.preSettledTask.status === 1) {
                    void h.then(reject);
                } else {
                    this.preSettledTask.cancel();
                    reject();
                }
            })));
        };
        if (this.postSettledTask?.status === 1) {
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

__decorate([ bindable ], Cs.prototype, "value", void 0);

Cs = __decorate([ templateController("promise") ], Cs);

let As = class PendingTemplateController {
    constructor() {
        this.view = void 0;
        this.f = a(Ie);
        this.l = a(zt);
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
    mode: 2
}) ], As.prototype, "value", void 0);

As = __decorate([ templateController("pending") ], As);

let Bs = class FulfilledTemplateController {
    constructor() {
        this.view = void 0;
        this.f = a(Ie);
        this.l = a(zt);
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
    mode: 4
}) ], Bs.prototype, "value", void 0);

Bs = __decorate([ templateController("then") ], Bs);

let Ss = class RejectedTemplateController {
    constructor() {
        this.view = void 0;
        this.f = a(Ie);
        this.l = a(zt);
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
    mode: 4
}) ], Ss.prototype, "value", void 0);

Ss = __decorate([ templateController("catch") ], Ss);

function getPromiseController(t) {
    const e = t.parent;
    const i = e?.viewModel;
    if (i instanceof Cs) {
        return i;
    }
    throw createMappedError(813);
}

let _s = class PromiseAttributePattern {
    "promise.resolve"(t, e, i) {
        return new AttrSyntax(t, e, "promise", "bind");
    }
};

_s = __decorate([ attributePattern({
    pattern: "promise.resolve",
    symbols: ""
}) ], _s);

let Rs = class FulfilledAttributePattern {
    then(t, e, i) {
        return new AttrSyntax(t, e, "then", "from-view");
    }
};

Rs = __decorate([ attributePattern({
    pattern: "then",
    symbols: ""
}) ], Rs);

let Ts = class RejectedAttributePattern {
    catch(t, e, i) {
        return new AttrSyntax(t, e, "catch", "from-view");
    }
};

Ts = __decorate([ attributePattern({
    pattern: "catch",
    symbols: ""
}) ], Ts);

class Focus {
    constructor() {
        this.Pi = false;
        this.Li = a(Wt);
        this.p = a($t);
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) {
            this.Di();
        } else {
            this.Pi = true;
        }
    }
    attached() {
        if (this.Pi) {
            this.Pi = false;
            this.Di();
        }
        this.Li.addEventListener("focus", this);
        this.Li.addEventListener("blur", this);
    }
    detaching() {
        const t = this.Li;
        t.removeEventListener("focus", this);
        t.removeEventListener("blur", this);
    }
    handleEvent(t) {
        if (t.type === "focus") {
            this.value = true;
        } else if (!this.Mi) {
            this.value = false;
        }
    }
    Di() {
        const t = this.Li;
        const e = this.Mi;
        const i = this.value;
        if (i && !e) {
            t.focus();
        } else if (!i && e) {
            t.blur();
        }
    }
    get Mi() {
        return this.Li === this.p.document.activeElement;
    }
}

Focus.inject = [ Wt, $t ];

__decorate([ bindable({
    mode: 6
}) ], Focus.prototype, "value", void 0);

customAttribute("focus")(Focus);

class Portal {
    constructor() {
        this.position = "beforeend";
        this.strict = false;
        const t = a(Ie);
        const e = a(zt);
        const i = a($t);
        this.p = i;
        this.qi = i.document.createElement("div");
        (this.view = t.create()).setLocation(this.Fi = createLocation(i));
        setEffectiveParentNode(this.view.nodes, e);
    }
    attaching(t) {
        if (this.callbackContext == null) {
            this.callbackContext = this.$controller.scope.bindingContext;
        }
        const e = this.qi = this.Hi();
        this.Oi(e, this.position);
        return this.Vi(t, e);
    }
    detaching(t) {
        return this.Ni(t, this.qi);
    }
    targetChanged() {
        const {$controller: t} = this;
        if (!t.isActive) {
            return;
        }
        const e = this.Hi();
        if (this.qi === e) {
            return;
        }
        this.qi = e;
        const i = w(this.Ni(null, e), (() => {
            this.Oi(e, this.position);
            return this.Vi(null, e);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    positionChanged() {
        const {$controller: t, qi: e} = this;
        if (!t.isActive) {
            return;
        }
        const i = w(this.Ni(null, e), (() => {
            this.Oi(e, this.position);
            return this.Vi(null, e);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    Vi(t, e) {
        const {activating: i, callbackContext: s, view: n} = this;
        return w(i?.call(s, e, n), (() => this.$i(t, e)));
    }
    $i(t, e) {
        const {$controller: i, view: s} = this;
        if (t === null) {
            s.nodes.insertBefore(this.Fi);
        } else {
            return w(s.activate(t ?? s, i, i.scope), (() => this.Wi(e)));
        }
        return this.Wi(e);
    }
    Wi(t) {
        const {activated: e, callbackContext: i, view: s} = this;
        return e?.call(i, t, s);
    }
    Ni(t, e) {
        const {deactivating: i, callbackContext: s, view: n} = this;
        return w(i?.call(s, e, n), (() => this.ji(t, e)));
    }
    ji(t, e) {
        const {$controller: i, view: s} = this;
        if (t === null) {
            s.nodes.remove();
        } else {
            return w(s.deactivate(t, i), (() => this.zi(e)));
        }
        return this.zi(e);
    }
    zi(t) {
        const {deactivated: e, callbackContext: i, view: s} = this;
        return e?.call(i, t, s);
    }
    Hi() {
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
    Oi(t, e) {
        const i = this.Fi;
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

let Is = class AuSlot {
    constructor() {
        this.Ui = null;
        this.Gi = null;
        this.Qt = false;
        this.expose = null;
        this.slotchange = null;
        this.Xi = new Set;
        this.ui = null;
        const t = a(zt);
        const e = a(Me);
        const i = a(bi);
        const s = a(hi);
        const n = e.auSlot;
        const r = i.instruction?.projections?.[n.name];
        const l = i.controller;
        let h;
        let c;
        this.name = n.name;
        if (r == null) {
            h = s.getViewFactory(n.fallback, l.container);
            this.Qi = false;
        } else {
            c = i.parent.controller.container.createChild();
            registerResolver(c, l.definition.Type, new f(void 0, l.viewModel));
            h = s.getViewFactory(r, c);
            this.Qi = true;
            this.Ki = l.container.getAll(Pe, false)?.filter((t => t.slotName === "*" || t.slotName === n.name)) ?? u;
        }
        this.Yi = (this.Ki ?? (this.Ki = u)).length > 0;
        this.Zi = i;
        this.view = h.create().setLocation(this.l = t);
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
        this.Xi.add(t);
    }
    unsubscribe(t) {
        this.Xi.delete(t);
    }
    binding(t, e) {
        this.Ui = this.$controller.scope.parent;
        let i;
        if (this.Qi) {
            i = this.Zi.controller.scope.parent;
            (this.Gi = $.fromParent(i, i.bindingContext)).overrideContext.$host = this.expose ?? this.Ui.bindingContext;
        }
    }
    attaching(t, e) {
        return w(this.view.activate(t, this.$controller, this.Qi ? this.Gi : this.Ui), (() => {
            if (this.Yi) {
                this.Ki.forEach((t => t.watch(this)));
                this.ii();
                this.Ji();
                this.Qt = true;
            }
        }));
    }
    detaching(t, e) {
        this.Qt = false;
        this.ts();
        this.Ki.forEach((t => t.unwatch(this)));
        return this.view.deactivate(t, this.$controller);
    }
    exposeChanged(t) {
        if (this.Qi && this.Gi != null) {
            this.Gi.overrideContext.$host = t;
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
    ii() {
        if (this.ui != null) {
            return;
        }
        const t = this.l;
        const e = t.parentElement;
        if (e == null) {
            return;
        }
        (this.ui = createMutationObserver(e, (e => {
            if (isMutationWithinLocation(t, e)) {
                this.Ji();
            }
        }))).observe(e, {
            childList: true
        });
    }
    ts() {
        this.ui?.disconnect();
        this.ui = null;
    }
    Ji() {
        const t = this.nodes;
        const e = new Set(this.Xi);
        let i;
        if (this.Qt) {
            this.slotchange?.call(void 0, this.name, t);
        }
        for (i of e) {
            i.handleSlotChange(this, t);
        }
    }
};

__decorate([ bindable ], Is.prototype, "expose", void 0);

__decorate([ bindable ], Is.prototype, "slotchange", void 0);

Is = __decorate([ customElement({
    name: "au-slot",
    template: null,
    containerless: true
}) ], Is);

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

var Es;

(function(t) {
    t[t["Element"] = 1] = "Element";
    t[t["Attribute"] = 2] = "Attribute";
})(Es || (Es = {}));

class AuCompose {
    constructor() {
        this.scopeBehavior = "auto";
        this.es = void 0;
        this.c = a(v);
        this.parent = a(vi);
        this.host = a(Wt);
        this.l = a(zt);
        this.p = a($t);
        this.r = a(hi);
        this.ss = a(Me);
        this.rs = a(S(CompositionContextFactory));
    }
    get pending() {
        return this.os;
    }
    get composition() {
        return this.es;
    }
    attaching(t, e) {
        return this.os = w(this.queue(new ChangeInfo(this.template, this.component, this.model, void 0), t), (t => {
            if (this.rs.isCurrent(t)) {
                this.os = void 0;
            }
        }));
    }
    detaching(t) {
        const e = this.es;
        const i = this.os;
        this.rs.invalidate();
        this.es = this.os = void 0;
        return w(i, (() => e?.deactivate(t)));
    }
    propertyChanged(t) {
        if (t === "model" && this.es != null) {
            this.es.update(this.model);
            return;
        }
        this.os = w(this.os, (() => w(this.queue(new ChangeInfo(this.template, this.component, this.model, t), void 0), (t => {
            if (this.rs.isCurrent(t)) {
                this.os = void 0;
            }
        }))));
    }
    queue(t, e) {
        const i = this.rs;
        const s = this.es;
        return w(i.create(t), (t => {
            if (i.isCurrent(t)) {
                return w(this.compose(t), (n => {
                    if (i.isCurrent(t)) {
                        return w(n.activate(e), (() => {
                            if (i.isCurrent(t)) {
                                this.es = n;
                                return w(s?.deactivate(e), (() => t));
                            } else {
                                return w(n.controller.deactivate(n.controller, this.$controller), (() => {
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
        let e;
        let i;
        let s;
        const {ls: n, cs: r, us: l} = t.change;
        const {c: h, host: a, $controller: c, l: u} = this;
        const f = this.getDef(r);
        const d = h.createChild();
        const m = u == null ? a.parentNode : u.parentNode;
        if (f !== null) {
            if (f.containerless) {
                throw createMappedError(806, f);
            }
            if (u == null) {
                i = a;
                s = () => {};
            } else {
                i = m.insertBefore(this.p.document.createElement(f.name), u);
                s = () => {
                    i.remove();
                };
            }
            e = this.ds(d, r, i);
        } else {
            i = u == null ? a : u;
            e = this.ds(d, r, i);
        }
        const compose = () => {
            if (f !== null) {
                const n = Controller.$el(d, e, i, {
                    projections: this.ss.projections
                }, f);
                return new CompositionController(n, (t => n.activate(t ?? n, c, c.scope.parent)), (t => w(n.deactivate(t ?? n, c), s)), (t => e.activate?.(t)), t);
            } else {
                const s = CustomElementDefinition.create({
                    name: le.generateName(),
                    template: n
                });
                const r = this.r.getViewFactory(s, d);
                const l = Controller.$view(r, c);
                const h = this.scopeBehavior === "auto" ? $.fromParent(this.parent.scope, e) : $.create(e);
                if (isRenderLocation(i)) {
                    l.setLocation(i);
                } else {
                    l.setHost(i);
                }
                return new CompositionController(l, (t => l.activate(t ?? l, c, h)), (t => l.deactivate(t ?? l, c)), (t => e.activate?.(t)), t);
            }
        };
        if ("activate" in e) {
            return w(e.activate(l), (() => compose()));
        } else {
            return compose();
        }
    }
    ds(t, e, i) {
        if (e == null) {
            return new EmptyComponent;
        }
        if (typeof e === "object") {
            return e;
        }
        const s = this.p;
        const n = isRenderLocation(i);
        registerHostNode(t, s, n ? null : i);
        registerResolver(t, zt, new f("IRenderLocation", n ? i : null));
        const r = t.invoke(e);
        registerResolver(t, e, new f("au-compose.component", r));
        return r;
    }
    getDef(t) {
        const e = isFunction(t) ? t : t?.constructor;
        return le.isType(e) ? le.getDefinition(e) : null;
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

customElement("au-compose")(AuCompose);

class EmptyComponent {}

class CompositionContextFactory {
    constructor() {
        this.id = 0;
    }
    isCurrent(t) {
        return t.id === this.id;
    }
    create(t) {
        return w(t.load(), (t => new CompositionContext(++this.id, t)));
    }
    invalidate() {
        this.id++;
    }
}

class ChangeInfo {
    constructor(t, e, i, s) {
        this.ls = t;
        this.cs = e;
        this.us = i;
        this.gs = s;
    }
    load() {
        if (isPromise(this.ls) || isPromise(this.cs)) {
            return Promise.all([ this.ls, this.cs ]).then((([t, e]) => new LoadedChangeInfo(t, e, this.us, this.gs)));
        } else {
            return new LoadedChangeInfo(this.ls, this.cs, this.us, this.gs);
        }
    }
}

class LoadedChangeInfo {
    constructor(t, e, i, s) {
        this.ls = t;
        this.cs = e;
        this.us = i;
        this.gs = s;
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

const Ps = /*@__PURE__*/ Rt("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw createMappedError(99, "sanitize");
    }
})));

class SanitizeValueConverter {
    constructor() {
        this.ps = a(Ps);
    }
    toView(t) {
        if (t == null) {
            return null;
        }
        return this.ps.sanitize(t);
    }
}

valueConverter("sanitize")(SanitizeValueConverter);

const Ls = /*@__PURE__*/ Rt("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const Ds = {};

class TemplateElementFactory {
    constructor() {
        this.p = a($t);
        this.ls = this.t();
    }
    t() {
        return this.p.document.createElement("template");
    }
    createTemplate(t) {
        if (isString(t)) {
            let e = Ds[t];
            if (e === void 0) {
                const i = this.ls;
                i.innerHTML = t;
                const s = i.content.firstElementChild;
                if (s == null || s.nodeName !== "TEMPLATE" || s.nextElementSibling != null) {
                    this.ls = this.t();
                    e = i;
                } else {
                    i.content.removeChild(s);
                    e = s;
                }
                Ds[t] = e;
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
    }
}

class TemplateCompiler {
    constructor() {
        this.debug = false;
        this.resolveResources = true;
    }
    static register(t) {
        t.register(Tt(this, this), It(this, qe));
    }
    compile(t, e, i) {
        const s = CustomElementDefinition.getOrCreate(t);
        if (s.template === null || s.template === void 0) {
            return s;
        }
        if (s.needsCompile === false) {
            return s;
        }
        i ?? (i = Hs);
        const n = new CompilationContext(t, e, i, null, null, void 0);
        const r = isString(s.template) || !t.enhance ? n.vs.createTemplate(s.template) : s.template;
        const l = r.nodeName === Ms && r.content != null;
        const h = l ? r.content : r;
        const a = e.get(allResources(Us));
        const c = a.length;
        let f = 0;
        if (c > 0) {
            while (c > f) {
                a[f].compiling?.(r);
                ++f;
            }
        }
        if (r.hasAttribute(zs)) {
            throw createMappedError(701, s);
        }
        this.bs(h, n);
        this.xs(h, n);
        return CustomElementDefinition.create({
            ...t,
            name: t.name || re(),
            dependencies: (t.dependencies ?? u).concat(n.deps ?? u),
            instructions: n.rows,
            surrogates: l ? this.ws(r, n) : u,
            template: r,
            hasSlots: n.hasSlot,
            needsCompile: false
        });
    }
    compileSpread(t, e, i, s) {
        const n = new CompilationContext(t, i, Hs, null, null, void 0);
        const r = [];
        const l = n.ys(s.nodeName.toLowerCase());
        const h = l !== null;
        const a = n.ep;
        const c = e.length;
        let u = 0;
        let f;
        let d = null;
        let m;
        let g;
        let p;
        let v;
        let b;
        let x = null;
        let w;
        let y;
        let C;
        let A;
        for (;c > u; ++u) {
            f = e[u];
            C = f.target;
            A = f.rawValue;
            x = n.ks(f);
            if (x !== null && (x.type & 1) > 0) {
                Vs.node = s;
                Vs.attr = f;
                Vs.bindable = null;
                Vs.def = null;
                r.push(x.build(Vs, n.ep, n.m));
                continue;
            }
            d = n.Cs(C);
            if (d !== null) {
                if (d.isTemplateController) {
                    throw createMappedError(9998, C);
                }
                p = BindablesInfo.from(d, true);
                y = d.noMultiBindings === false && x === null && hasInlineBindings(A);
                if (y) {
                    g = this.As(s, A, d, n);
                } else {
                    b = p.primary;
                    if (x === null) {
                        w = a.parse(A, 1);
                        g = [ w === null ? new SetPropertyInstruction(A, b.property) : new InterpolationInstruction(w, b.property) ];
                    } else {
                        Vs.node = s;
                        Vs.attr = f;
                        Vs.bindable = b;
                        Vs.def = d;
                        g = [ x.build(Vs, n.ep, n.m) ];
                    }
                }
                (m ?? (m = [])).push(new HydrateAttributeInstruction(this.resolveResources ? d : d.name, d.aliases != null && d.aliases.includes(C) ? C : void 0, g));
                continue;
            }
            if (x === null) {
                w = a.parse(A, 1);
                if (h) {
                    p = BindablesInfo.from(l, false);
                    v = p.attrs[C];
                    if (v !== void 0) {
                        w = a.parse(A, 1);
                        r.push(new SpreadElementPropBindingInstruction(w == null ? new SetPropertyInstruction(A, v.property) : new InterpolationInstruction(w, v.property)));
                        continue;
                    }
                }
                if (w != null) {
                    r.push(new InterpolationInstruction(w, n.m.map(s, C) ?? k(C)));
                } else {
                    switch (C) {
                      case "class":
                        r.push(new SetClassAttributeInstruction(A));
                        break;

                      case "style":
                        r.push(new SetStyleAttributeInstruction(A));
                        break;

                      default:
                        r.push(new SetAttributeInstruction(A, C));
                    }
                }
            } else {
                if (h) {
                    p = BindablesInfo.from(l, false);
                    v = p.attrs[C];
                    if (v !== void 0) {
                        Vs.node = s;
                        Vs.attr = f;
                        Vs.bindable = v;
                        Vs.def = l;
                        r.push(new SpreadElementPropBindingInstruction(x.build(Vs, n.ep, n.m)));
                        continue;
                    }
                }
                Vs.node = s;
                Vs.attr = f;
                Vs.bindable = null;
                Vs.def = null;
                r.push(x.build(Vs, n.ep, n.m));
            }
        }
        resetCommandBuildInfo();
        if (m != null) {
            return m.concat(r);
        }
        return r;
    }
    ws(t, e) {
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
            u = e.Pe.parse(a, c);
            w = u.target;
            y = u.rawValue;
            if (Ns[w]) {
                throw createMappedError(702, a);
            }
            v = e.ks(u);
            if (v !== null && (v.type & 1) > 0) {
                Vs.node = t;
                Vs.attr = u;
                Vs.bindable = null;
                Vs.def = null;
                i.push(v.build(Vs, e.ep, e.m));
                continue;
            }
            f = e.Cs(w);
            if (f !== null) {
                if (f.isTemplateController) {
                    throw createMappedError(703, w);
                }
                g = BindablesInfo.from(f, true);
                x = f.noMultiBindings === false && v === null && hasInlineBindings(y);
                if (x) {
                    m = this.As(t, y, f, e);
                } else {
                    p = g.primary;
                    if (v === null) {
                        b = n.parse(y, 1);
                        m = [ b === null ? new SetPropertyInstruction(y, p.property) : new InterpolationInstruction(b, p.property) ];
                    } else {
                        Vs.node = t;
                        Vs.attr = u;
                        Vs.bindable = p;
                        Vs.def = f;
                        m = [ v.build(Vs, e.ep, e.m) ];
                    }
                }
                t.removeAttribute(a);
                --l;
                --r;
                (d ?? (d = [])).push(new HydrateAttributeInstruction(this.resolveResources ? f : f.name, f.aliases != null && f.aliases.includes(w) ? w : void 0, m));
                continue;
            }
            if (v === null) {
                b = n.parse(y, 1);
                if (b != null) {
                    t.removeAttribute(a);
                    --l;
                    --r;
                    i.push(new InterpolationInstruction(b, e.m.map(t, w) ?? k(w)));
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
                Vs.node = t;
                Vs.attr = u;
                Vs.bindable = null;
                Vs.def = null;
                i.push(v.build(Vs, e.ep, e.m));
            }
        }
        resetCommandBuildInfo();
        if (d != null) {
            return d.concat(i);
        }
        return i;
    }
    xs(t, e) {
        switch (t.nodeType) {
          case 1:
            switch (t.nodeName) {
              case "LET":
                return this.Bs(t, e);

              default:
                return this.Ss(t, e);
            }

          case 3:
            return this._s(t, e);

          case 11:
            {
                let i = t.firstChild;
                while (i !== null) {
                    i = this.xs(i, e);
                }
                break;
            }
        }
        return t.nextSibling;
    }
    Bs(t, e) {
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
            c = e.Pe.parse(u, f);
            m = c.target;
            g = c.rawValue;
            d = e.ks(c);
            if (d !== null) {
                if (c.command === "bind") {
                    n.push(new LetBindingInstruction(r.parse(g, 16), k(m)));
                } else {
                    throw createMappedError(704, c);
                }
                continue;
            }
            p = r.parse(g, 1);
            n.push(new LetBindingInstruction(p === null ? new tt(g) : p, k(m)));
        }
        e.rows.push([ new HydrateLetElementInstruction(n, l) ]);
        return this.Rs(t, e).nextSibling;
    }
    Ss(t, e) {
        var i, n, r, l;
        const h = t.nextSibling;
        const a = (t.getAttribute("as-element") ?? t.nodeName).toLowerCase();
        const c = e.ys(a);
        const f = c !== null;
        const d = f && c.shadowOptions != null;
        const m = c?.capture;
        const g = m != null && typeof m !== "boolean";
        const p = m ? [] : u;
        const v = e.ep;
        const b = this.debug ? s : () => {
            t.removeAttribute(B);
            --C;
            --y;
        };
        let x = t.attributes;
        let w;
        let y = x.length;
        let C = 0;
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
        let D;
        let M;
        let q;
        let F;
        let H;
        let O = null;
        let V;
        let N;
        let $;
        let W;
        let j = true;
        let z = false;
        let U = false;
        let G = false;
        if (a === "slot") {
            if (e.root.def.shadowOptions == null) {
                throw createMappedError(717, e.root.def.name);
            }
            e.root.hasSlot = true;
        }
        if (f) {
            j = c.processContent?.call(c.Type, t, e.p);
            x = t.attributes;
            y = x.length;
        }
        for (;y > C; ++C) {
            A = x[C];
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
            _ = e.Pe.parse(B, S);
            O = e.ks(_);
            $ = _.target;
            W = _.rawValue;
            if (m && (!g || g && m($))) {
                if (O != null && O.type & 1) {
                    b();
                    p.push(_);
                    continue;
                }
                U = $ !== Ys && $ !== "slot";
                if (U) {
                    V = BindablesInfo.from(c, false);
                    if (V.attrs[$] == null && !e.Cs($)?.isTemplateController) {
                        b();
                        p.push(_);
                        continue;
                    }
                }
            }
            if (O !== null && O.type & 1) {
                Vs.node = t;
                Vs.attr = _;
                Vs.bindable = null;
                Vs.def = null;
                (R ?? (R = [])).push(O.build(Vs, e.ep, e.m));
                b();
                continue;
            }
            I = e.Cs($);
            if (I !== null) {
                V = BindablesInfo.from(I, true);
                E = I.noMultiBindings === false && O === null && hasInlineBindings(W);
                if (E) {
                    D = this.As(t, W, I, e);
                } else {
                    N = V.primary;
                    if (O === null) {
                        F = v.parse(W, 1);
                        D = [ F === null ? new SetPropertyInstruction(W, N.property) : new InterpolationInstruction(F, N.property) ];
                    } else {
                        Vs.node = t;
                        Vs.attr = _;
                        Vs.bindable = N;
                        Vs.def = I;
                        D = [ O.build(Vs, e.ep, e.m) ];
                    }
                }
                b();
                if (I.isTemplateController) {
                    (M ?? (M = [])).push(new HydrateTemplateController(Os, this.resolveResources ? I : I.name, void 0, D));
                } else {
                    (L ?? (L = [])).push(new HydrateAttributeInstruction(this.resolveResources ? I : I.name, I.aliases != null && I.aliases.includes($) ? $ : void 0, D));
                }
                continue;
            }
            if (O === null) {
                if (f) {
                    V = BindablesInfo.from(c, false);
                    P = V.attrs[$];
                    if (P !== void 0) {
                        F = v.parse(W, 1);
                        (T ?? (T = [])).push(F == null ? new SetPropertyInstruction(W, P.property) : new InterpolationInstruction(F, P.property));
                        b();
                        continue;
                    }
                }
                F = v.parse(W, 1);
                if (F != null) {
                    b();
                    (R ?? (R = [])).push(new InterpolationInstruction(F, e.m.map(t, $) ?? k($)));
                }
                continue;
            }
            b();
            if (f) {
                V = BindablesInfo.from(c, false);
                P = V.attrs[$];
                if (P !== void 0) {
                    Vs.node = t;
                    Vs.attr = _;
                    Vs.bindable = P;
                    Vs.def = c;
                    (T ?? (T = [])).push(O.build(Vs, e.ep, e.m));
                    continue;
                }
            }
            Vs.node = t;
            Vs.attr = _;
            Vs.bindable = null;
            Vs.def = null;
            (R ?? (R = [])).push(O.build(Vs, e.ep, e.m));
        }
        resetCommandBuildInfo();
        if (this.Ts(t, R) && R != null && R.length > 1) {
            this.Is(t, R);
        }
        if (f) {
            H = new HydrateElementInstruction(this.resolveResources ? c : c.name, void 0, T ?? u, null, z, p);
            if (a === Ys) {
                const i = t.getAttribute("name") || Ks;
                const s = e.t();
                const n = e.Es();
                let r = t.firstChild;
                let l = 0;
                while (r !== null) {
                    if (r.nodeType === 1 && r.hasAttribute(Ys)) {
                        t.removeChild(r);
                    } else {
                        appendToTemplate(s, r);
                        l++;
                    }
                    r = t.firstChild;
                }
                if (l > 0) {
                    this.xs(s.content, n);
                }
                H.auSlot = {
                    name: i,
                    fallback: CustomElementDefinition.create({
                        name: re(),
                        template: s,
                        instructions: n.rows,
                        needsCompile: false
                    })
                };
            }
        }
        if (R != null || H != null || L != null) {
            w = u.concat(H ?? u, L ?? u, R ?? u);
            G = true;
        }
        let X;
        if (M != null) {
            y = M.length - 1;
            C = y;
            q = M[C];
            let s;
            if (isMarker(t)) {
                s = e.t();
                appendManyToTemplate(s, [ e.wt(), e.Ps(qs), e.Ps(Fs) ]);
            } else {
                this.Ls(t, e);
                if (t.nodeName === "TEMPLATE") {
                    s = t;
                } else {
                    s = e.t();
                    appendToTemplate(s, t);
                }
            }
            const r = s;
            const l = e.Es(w == null ? [] : [ w ]);
            let h;
            let u;
            let m;
            let g;
            let p;
            let v;
            let b;
            let x;
            let k = 0, A = 0;
            let B = t.firstChild;
            let S = false;
            if (j !== false) {
                while (B !== null) {
                    u = B.nodeType === 1 ? B.getAttribute(Ys) : null;
                    if (u !== null) {
                        B.removeAttribute(Ys);
                    }
                    if (f) {
                        h = B.nextSibling;
                        if (!d) {
                            S = B.nodeType === 3 && B.textContent.trim() === "";
                            if (!S) {
                                ((i = g ?? (g = {}))[n = u || Ks] ?? (i[n] = [])).push(B);
                            }
                            t.removeChild(B);
                        }
                        B = h;
                    } else {
                        if (u !== null) {
                            u = u || Ks;
                            throw createMappedError(706, u, a);
                        }
                        B = B.nextSibling;
                    }
                }
            }
            if (g != null) {
                m = {};
                for (u in g) {
                    s = e.t();
                    p = g[u];
                    for (k = 0, A = p.length; A > k; ++k) {
                        v = p[k];
                        if (v.nodeName === "TEMPLATE") {
                            if (v.attributes.length > 0) {
                                appendToTemplate(s, v);
                            } else {
                                appendToTemplate(s, v.content);
                            }
                        } else {
                            appendToTemplate(s, v);
                        }
                    }
                    x = e.Es();
                    this.xs(s.content, x);
                    m[u] = CustomElementDefinition.create({
                        name: re(),
                        template: s,
                        instructions: x.rows,
                        needsCompile: false,
                        isStrictBinding: e.root.def.isStrictBinding
                    });
                }
                H.projections = m;
            }
            if (G) {
                if (f && (z || c.containerless)) {
                    this.Ls(t, e);
                } else {
                    this.Rs(t, e);
                }
            }
            X = !f || !c.containerless && !z && j !== false;
            if (X) {
                if (t.nodeName === Ms) {
                    this.xs(t.content, l);
                } else {
                    B = t.firstChild;
                    while (B !== null) {
                        B = this.xs(B, l);
                    }
                }
            }
            q.def = CustomElementDefinition.create({
                name: re(),
                template: r,
                instructions: l.rows,
                needsCompile: false,
                isStrictBinding: e.root.def.isStrictBinding
            });
            while (C-- > 0) {
                q = M[C];
                s = e.t();
                b = e.wt();
                appendManyToTemplate(s, [ b, e.Ps(qs), e.Ps(Fs) ]);
                q.def = CustomElementDefinition.create({
                    name: re(),
                    template: s,
                    needsCompile: false,
                    instructions: [ [ M[C + 1] ] ],
                    isStrictBinding: e.root.def.isStrictBinding
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
            let h = null;
            let u;
            let m;
            let g;
            let p;
            let v;
            let b = false;
            let x = 0, y = 0;
            if (j !== false) {
                while (i !== null) {
                    n = i.nodeType === 1 ? i.getAttribute(Ys) : null;
                    if (n !== null) {
                        i.removeAttribute(Ys);
                    }
                    if (f) {
                        s = i.nextSibling;
                        if (!d) {
                            b = i.nodeType === 3 && i.textContent.trim() === "";
                            if (!b) {
                                ((r = u ?? (u = {}))[l = n || Ks] ?? (r[l] = [])).push(i);
                            }
                            t.removeChild(i);
                        }
                        i = s;
                    } else {
                        if (n !== null) {
                            n = n || Ks;
                            throw createMappedError(706, n, a);
                        }
                        i = i.nextSibling;
                    }
                }
            }
            if (u != null) {
                h = {};
                for (n in u) {
                    p = e.t();
                    m = u[n];
                    for (x = 0, y = m.length; y > x; ++x) {
                        g = m[x];
                        if (g.nodeName === Ms) {
                            if (g.attributes.length > 0) {
                                appendToTemplate(p, g);
                            } else {
                                appendToTemplate(p, g.content);
                            }
                        } else {
                            appendToTemplate(p, g);
                        }
                    }
                    v = e.Es();
                    this.xs(p.content, v);
                    h[n] = CustomElementDefinition.create({
                        name: re(),
                        template: p,
                        instructions: v.rows,
                        needsCompile: false,
                        isStrictBinding: e.root.def.isStrictBinding
                    });
                }
                H.projections = h;
            }
            if (G) {
                if (f && (z || c.containerless)) {
                    this.Ls(t, e);
                } else {
                    this.Rs(t, e);
                }
            }
            X = !f || !c.containerless && !z && j !== false;
            if (X && t.childNodes.length > 0) {
                i = t.firstChild;
                while (i !== null) {
                    i = this.xs(i, e);
                }
            }
        }
        return h;
    }
    _s(t, e) {
        const i = t.parentNode;
        const s = e.ep.parse(t.textContent, 1);
        const n = t.nextSibling;
        let r;
        let l;
        let h;
        let a;
        let c;
        if (s !== null) {
            ({parts: r, expressions: l} = s);
            if (c = r[0]) {
                insertBefore(i, e.Ds(c), t);
            }
            for (h = 0, a = l.length; a > h; ++h) {
                insertManyBefore(i, t, [ e.wt(), e.Ds(" ") ]);
                if (c = r[h + 1]) {
                    insertBefore(i, e.Ds(c), t);
                }
                e.rows.push([ new TextBindingInstruction(l[h], e.root.def.isStrictBinding) ]);
            }
            i.removeChild(t);
        }
        return n;
    }
    As(t, e, i, s) {
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
                d = s.Pe.parse(h, a);
                m = s.ks(d);
                g = n.attrs[d.target];
                if (g == null) {
                    throw createMappedError(707, d.target, i.name);
                }
                if (m === null) {
                    f = s.ep.parse(a, 1);
                    l.push(f === null ? new SetPropertyInstruction(a, g.property) : new InterpolationInstruction(f, g.property));
                } else {
                    Vs.node = t;
                    Vs.attr = d;
                    Vs.bindable = g;
                    Vs.def = i;
                    l.push(m.build(Vs, s.ep, s.m));
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
    bs(t, e) {
        const i = e.root.def.name;
        const s = t;
        const n = _(s.querySelectorAll("template[as-custom-element]"));
        const r = n.length;
        if (r === 0) {
            return;
        }
        if (r === s.childElementCount) {
            throw createMappedError(708, i);
        }
        const l = new Set;
        const h = [];
        for (const t of n) {
            if (t.parentNode !== s) {
                throw createMappedError(709, i);
            }
            const n = processTemplateName(i, t, l);
            const r = t.content;
            const a = _(r.querySelectorAll("bindable"));
            const c = new Set;
            const u = new Set;
            const f = a.reduce(((t, e) => {
                if (e.parentNode !== r) {
                    throw createMappedError(710, n);
                }
                const i = e.getAttribute("property");
                if (i === null) {
                    throw createMappedError(711, e, n);
                }
                const s = e.getAttribute("attribute");
                if (s !== null && u.has(s) || c.has(i)) {
                    throw createMappedError(712, c, s);
                } else {
                    if (s !== null) {
                        u.add(s);
                    }
                    c.add(i);
                }
                const l = _(e.attributes).filter((t => !js.includes(t.name)));
                if (l.length > 0) ;
                e.remove();
                t[i] = {
                    attribute: s ?? void 0,
                    mode: getBindingMode(e)
                };
                return t;
            }), {});
            class LocalTemplateType {}
            At(LocalTemplateType, "name", {
                value: n
            });
            h.push(LocalTemplateType);
            e.Ms(defineElement({
                name: n,
                template: t,
                bindables: f
            }, LocalTemplateType));
            s.removeChild(t);
        }
        const a = [ ...e.def.dependencies ?? u, ...h ];
        for (const t of h) {
            getElementDefinition(t).dependencies.push(a.filter((e => e !== t)));
        }
    }
    Ts(t, e) {
        const i = t.nodeName;
        return i === "INPUT" && $s[t.type] === 1 || i === "SELECT" && (t.hasAttribute("multiple") || e?.some((t => t.type === "rg" && t.to === "multiple")));
    }
    Is(t, e) {
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
    Rs(t, e) {
        insertBefore(t.parentNode, e.Ps("au*"), t);
        return t;
    }
    Ls(t, e) {
        if (isMarker(t)) {
            return t;
        }
        const i = t.parentNode;
        const s = e.wt();
        insertManyBefore(i, t, [ s, e.Ps(qs), e.Ps(Fs) ]);
        i.removeChild(t);
        return s;
    }
}

const Ms = "TEMPLATE";

const qs = "au-start";

const Fs = "au-end";

const isMarker = t => t.nodeValue === "au*";

class CompilationContext {
    constructor(t, e, i, s, n, r) {
        this.hasSlot = false;
        this.qs = createLookup();
        const l = s !== null;
        this.c = e;
        this.root = n === null ? this : n;
        this.def = t;
        this.ci = i;
        this.parent = s;
        this.vs = l ? s.vs : e.get(Ls);
        this.Pe = l ? s.Pe : e.get(Si);
        this.ep = l ? s.ep : e.get(O);
        this.m = l ? s.m : e.get(Zi);
        this.Ii = l ? s.Ii : e.get(B);
        this.p = l ? s.p : e.get($t);
        this.localEls = l ? s.localEls : new Set;
        this.rows = r ?? [];
    }
    Ms(t) {
        var e;
        ((e = this.root).deps ?? (e.deps = [])).push(t);
        this.root.c.register(t);
    }
    Ds(t) {
        return createText(this.p, t);
    }
    Ps(t) {
        return createComment(this.p, t);
    }
    wt() {
        return this.Ps("au*");
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
    ys(t) {
        return this.c.find(le, t);
    }
    Cs(t) {
        return this.c.find(Zt, t);
    }
    Es(t) {
        return new CompilationContext(this.def, this.c, this.ci, this, this.root, t);
    }
    ks(t) {
        if (this.root !== this) {
            return this.root.ks(t);
        }
        const e = t.command;
        if (e === null) {
            return null;
        }
        let i = this.qs[e];
        if (i === void 0) {
            i = this.c.create(Fi, e);
            if (i === null) {
                throw createMappedError(713, e);
            }
            this.qs[e] = i;
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
    Vs.node = Vs.attr = Vs.bindable = Vs.def = null;
};

const Hs = {
    projections: null
};

const Os = {
    name: "unnamed"
};

const Vs = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const Ns = xt(createLookup(), {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
});

const $s = {
    checkbox: 1,
    radio: 1
};

const Ws = new WeakMap;

class BindablesInfo {
    static from(t, e) {
        let i = Ws.get(t);
        if (i == null) {
            const s = t.bindables;
            const n = createLookup();
            const r = e ? t.defaultBindingMode === void 0 ? 8 : t.defaultBindingMode : 8;
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
            Ws.set(t, i = new BindablesInfo(n, s, c));
        }
        return i;
    }
    constructor(t, e, i) {
        this.attrs = t;
        this.bindables = e;
        this.primary = i;
    }
}

const js = bt([ "property", "attribute", "mode" ]);

const zs = "as-custom-element";

const processTemplateName = (t, e, i) => {
    const s = e.getAttribute(zs);
    if (s === null || s === "") {
        throw createMappedError(715, t);
    }
    if (i.has(s)) {
        throw createMappedError(716, s, t);
    } else {
        i.add(s);
        e.removeAttribute(zs);
    }
    return s;
};

const getBindingMode = t => {
    switch (t.getAttribute("mode")) {
      case "oneTime":
        return 1;

      case "toView":
        return 2;

      case "fromView":
        return 4;

      case "twoWay":
        return 6;

      case "default":
      default:
        return 8;
    }
};

const Us = /*@__PURE__*/ Rt("ITemplateCompilerHooks");

const Gs = new WeakMap;

const Xs = /*@__PURE__*/ ct("compiler-hooks");

const Qs = bt({
    name: Xs,
    define(t) {
        let e = Gs.get(t);
        if (e === void 0) {
            Gs.set(t, e = new TemplateCompilerHooksDefinition(t));
            ot(Xs, e, t);
            ut(t, Xs);
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
        t.register(Tt(Us, this.Type));
    }
}

const templateCompilerHooks = t => {
    return t === void 0 ? decorator : decorator(t);
    function decorator(t) {
        return Qs.define(t);
    }
};

const Ks = "default";

const Ys = "au-slot";

class Show {
    constructor() {
        this.el = a(Wt);
        this.p = a($t);
        this.Fs = false;
        this.U = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.U = null;
            if (Boolean(this.value) !== this.Hs) {
                if (this.Hs === this.Os) {
                    this.Hs = !this.Os;
                    this.$val = this.el.style.getPropertyValue("display");
                    this.$prio = this.el.style.getPropertyPriority("display");
                    this.el.style.setProperty("display", "none", "important");
                } else {
                    this.Hs = this.Os;
                    this.el.style.setProperty("display", this.$val, this.$prio);
                    if (this.el.getAttribute("style") === "") {
                        this.el.removeAttribute("style");
                    }
                }
            }
        };
        const t = a(Me);
        this.Hs = this.Os = t.alias !== "hide";
    }
    binding() {
        this.Fs = true;
        this.update();
    }
    detaching() {
        this.Fs = false;
        this.U?.cancel();
        this.U = null;
    }
    valueChanged() {
        if (this.Fs && this.U === null) {
            this.U = this.p.domWriteQueue.queueTask(this.update);
        }
    }
}

__decorate([ bindable ], Show.prototype, "value", void 0);

alias("hide")(Show);

customAttribute("show")(Show);

const Zs = [ TemplateCompiler, et, NodeObserverLocator ];

const Js = [ Ei, Ii, Di ];

const tn = [ Li, Pi ];

const en = [ $i, Hi, Vi, Oi, Ni, Wi, Qi, ji, zi, Xi, Gi, Ui, Ki ];

const sn = [ DebounceBindingBehavior, OneTimeBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, SignalBindingBehavior, ThrottleBindingBehavior, TwoWayBindingBehavior, SanitizeValueConverter, If, Else, Repeat, With, xs, ys, ks, Cs, As, Bs, Ss, _s, Rs, Ts, AttrBindingBehavior, SelfBindingBehavior, UpdateTriggerBindingBehavior, AuCompose, Portal, Focus, Show, Is ];

const nn = [ ze, Ue, We, je, He, Oe, Ve, Ne, $e, Xe, Je, Qe, Ke, Ye, Ze, Ge, ti ];

const rn = /*@__PURE__*/ createConfiguration(s);

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
            return e.register(Et(N, i.coercingOptions), ...Zs, ...sn, ...Js, ...en, ...nn);
        },
        customize(e) {
            return createConfiguration(e ?? t);
        }
    };
}

function children(t, e) {
    if (!hn) {
        hn = true;
        H(ChildrenBinding);
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
        let l = le.getAnnotation(r, s);
        if (l == null) {
            le.annotate(r, s, l = []);
        }
        l.push(new ChildrenLifecycleHooks(i));
    }
    if (arguments.length > 1) {
        i = {};
        decorator(t, e);
        return;
    } else if (isString(t)) {
        i = {
            filter: e => e.nodeType === 1 && e.matches(t),
            map: t => t
        };
        return decorator;
    }
    i = t === void 0 ? {} : t;
    return decorator;
}

class ChildrenBinding {
    constructor(t, e, i, s = defaultChildQuery, n = defaultChildFilter, r = defaultChildMap, l = on) {
        this.Vs = void 0;
        this.ot = defaultChildQuery;
        this.Ns = defaultChildFilter;
        this.$s = defaultChildMap;
        this.isBound = false;
        this.G = t;
        this.obj = e;
        this.cb = i;
        this.ot = s;
        this.Ns = n;
        this.$s = r;
        this.et = l;
        this.ui = createMutationObserver(this.Ws = t.host, (() => {
            this.js();
        }));
    }
    getValue() {
        return this.isBound ? this.Vs : this.zs();
    }
    setValue(t) {}
    bind() {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        this.ui.observe(this.Ws, this.et);
        this.Vs = this.zs();
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.ui.disconnect();
        this.Vs = u;
    }
    js() {
        this.Vs = this.zs();
        this.cb?.call(this.obj);
        this.subs.notify(this.Vs, undefined);
    }
    get() {
        throw createMappedError(99, "get");
    }
    zs() {
        return filterChildren(this.G, this.ot, this.Ns, this.$s);
    }
}

const on = {
    childList: true
};

const defaultChildQuery = t => t.host.childNodes;

const defaultChildFilter = (t, e, i) => !!i;

const defaultChildMap = (t, e, i) => i;

const ln = {
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
        a = findElementControllerFor(h, ln);
        c = a?.viewModel ?? null;
        if (i(h, a, c)) {
            l.push(s(h, a, c));
        }
    }
    return l;
};

class ChildrenLifecycleHooks {
    constructor(t) {
        this.lt = t;
    }
    register(t) {
        Et(ke, this).register(t);
    }
    hydrating(t, e) {
        const i = this.lt;
        const s = new ChildrenBinding(e, t, t[i.callback ?? `${gt(i.name)}Changed`], i.query ?? defaultChildQuery, i.filter ?? defaultChildFilter, i.map ?? defaultChildMap, i.options ?? on);
        At(t, i.name, {
            enumerable: true,
            configurable: true,
            get: xt((() => s.getValue()), {
                getObserver: () => s
            }),
            set: () => {}
        });
        e.addBinding(s);
    }
}

let hn = false;

export { AdoptedStyleSheetsStyles, AppRoot, Nt as AppTask, Li as AtPrefixedTriggerAttributePattern, AttrBindingBehavior, Ui as AttrBindingCommand, AttrSyntax, AttributeBinding, AttributeBindingInstruction, Je as AttributeBindingRenderer, AttributeNSAccessor, Ti as AttributePattern, AuCompose, Is as AuSlot, AuSlotsInfo, Aurelia, St as Bindable, BindableDefinition, BindablesInfo, Dt as BindingBehavior, BindingBehaviorDefinition, Fi as BindingCommand, BindingCommandDefinition, Ji as BindingMode, BindingModeBehavior, BindingTargetSubscriber, CSSModulesProcessorRegistry, zi as CaptureBindingCommand, ys as Case, CheckedObserver, ChildrenBinding, ClassAttributeAccessor, Xi as ClassBindingCommand, Pi as ColonPrefixedBindAttributePattern, Mi as CommandType, ComputedWatcher, ContentBinding, Controller, Zt as CustomAttribute, CustomAttributeDefinition, Ve as CustomAttributeRenderer, le as CustomElement, CustomElementDefinition, Oe as CustomElementRenderer, DataAttributeAccessor, DebounceBindingBehavior, $i as DefaultBindingCommand, en as DefaultBindingLanguage, Js as DefaultBindingSyntax, ks as DefaultCase, Zs as DefaultComponents, nn as DefaultRenderers, sn as DefaultResources, Es as DefinitionType, Ii as DotSeparatedAttributePattern, Else, ExpressionWatcher, FlushQueue, Focus, Wi as ForBindingCommand, FragmentNodeSequence, FromViewBindingBehavior, Vi as FromViewBindingCommand, Bs as FulfilledTemplateController, HydrateAttributeInstruction, HydrateElementInstruction, HydrateLetElementInstruction, HydrateTemplateController, ki as IAppRoot, Vt as IAppTask, Zi as IAttrMapper, Si as IAttributeParser, Bi as IAttributePattern, Pe as IAuSlotWatcher, Ee as IAuSlotsInfo, Ci as IAurelia, vi as IController, jt as IEventTarget, pe as IFlushQueue, Kt as IHistory, bi as IHydrationContext, Me as IInstruction, ke as ILifecycleHooks, Qt as ILocation, Wt as INode, $t as IPlatform, zt as IRenderLocation, Fe as IRenderer, hi as IRendering, Yi as ISVGAnalyzer, Ps as ISanitizer, ue as IShadowDOMGlobalStyles, ce as IShadowDOMStyles, Ai as ISyntaxInterpreter, qe as ITemplateCompiler, Us as ITemplateCompilerHooks, Ls as ITemplateElementFactory, Ie as IViewFactory, Xt as IWindow, If, De as InstructionType, InterpolationBinding, je as InterpolationBindingRenderer, InterpolationInstruction, InterpolationPartBinding, Interpretation, IteratorBindingInstruction, Ue as IteratorBindingRenderer, LetBinding, LetBindingInstruction, $e as LetElementRenderer, Be as LifecycleHooks, LifecycleHooksDefinition, LifecycleHooksEntry, ListenerBinding, ListenerBindingInstruction, ListenerBindingOptions, Xe as ListenerBindingRenderer, MultiAttrInstruction, NodeObserverLocator, NoopSVGAnalyzer, OneTimeBindingBehavior, Hi as OneTimeBindingCommand, As as PendingTemplateController, Portal, Cs as PromiseTemplateController, PropertyBinding, PropertyBindingInstruction, ze as PropertyBindingRenderer, Ei as RefAttributePattern, RefBinding, RefBindingInstruction, We as RefBindingRenderer, Ss as RejectedTemplateController, Rendering, Repeat, SVGAnalyzer, SanitizeValueConverter, SelectValueObserver, SelfBindingBehavior, SetAttributeInstruction, Qe as SetAttributeRenderer, SetClassAttributeInstruction, Ke as SetClassAttributeRenderer, SetPropertyInstruction, He as SetPropertyRenderer, SetStyleAttributeInstruction, Ye as SetStyleAttributeRenderer, ShadowDOMRegistry, tn as ShortHandBindingSyntax, SignalBindingBehavior, SpreadBindingInstruction, SpreadElementPropBindingInstruction, ti as SpreadRenderer, rn as StandardConfiguration, pi as State, StyleAttributeAccessor, Gi as StyleBindingCommand, fe as StyleConfiguration, StyleElementStyles, StylePropertyBindingInstruction, Ze as StylePropertyBindingRenderer, xs as Switch, TemplateCompiler, Qs as TemplateCompilerHooks, Ne as TemplateControllerRenderer, TextBindingInstruction, Ge as TextBindingRenderer, ThrottleBindingBehavior, ToViewBindingBehavior, Oi as ToViewBindingCommand, ji as TriggerBindingCommand, TwoWayBindingBehavior, Ni as TwoWayBindingCommand, UpdateTriggerBindingBehavior, ValueAttributeObserver, me as ValueConverter, ValueConverterDefinition, ViewFactory, gi as ViewModelKind, ee as Watch, With, alias, allResources, attributePattern, bindable, bindingBehavior, bindingCommand, capture, children, coercer, containerless, convertToRenderLocation, cssModules, customAttribute, customElement, getEffectiveParentNode, getRef, isCustomElementController, isCustomElementViewModel, isInstruction, isRenderLocation, lifecycleHooks, mixinAstEvaluator, mixinUseScope, mixingBindingLimited, processContent, registerAliases, renderer, setEffectiveParentNode, setRef, shadowCSS, slotted, strict, templateCompilerHooks, templateController, useShadowDOM, valueConverter, watch };

