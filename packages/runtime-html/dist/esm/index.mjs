import { Protocol as t, getPrototypeChain as e, kebabCase as i, noop as s, DI as n, Registration as r, createResolver as l, firstDefined as h, mergeArrays as a, resolve as c, IPlatform as u, emptyArray as f, InstanceProvider as d, fromDefinitionOrDefault as m, pascalCase as g, fromAnnotationOrTypeOrDefault as p, fromAnnotationOrDefinitionOrTypeOrDefault as v, IContainer as b, all as x, optional as y, onResolveAll as w, onResolve as k, camelCase as C, IServiceLocator as A, emptyObject as B, ILogger as S, transient as _, toArray as R } from "@aurelia/kernel";

import { Metadata as T, isObject as I } from "@aurelia/metadata";

import { AccessorType as E, ISignaler as P, astEvaluate as L, connectable as M, ConnectableSwitcher as D, ProxyObservable as q, astBind as H, astUnbind as F, astAssign as O, subscriberCollection as V, IExpressionParser as N, IObserverLocator as $, ICoercionConfiguration as W, Scope as j, AccessScopeExpression as z, PropertyAccessor as U, IDirtyChecker as G, INodeObserverLocator as K, getObserverLookup as X, SetterObserver as Q, createIndexMap as Y, getCollectionObserver as Z, BindingContext as J, PrimitiveLiteralExpression as tt, DirtyChecker as et } from "@aurelia/runtime";

import { BrowserPlatform as it } from "@aurelia/platform-browser";

import { TaskAbortError as st } from "@aurelia/platform";

function __decorate(t, e, i, s) {
    var n = arguments.length, r = n < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, i) : s, l;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(t, e, i, s); else for (var h = t.length - 1; h >= 0; h--) if (l = t[h]) r = (n < 3 ? l(r) : n > 3 ? l(e, i, r) : l(e, i)) || r;
    return n > 3 && r && Object.defineProperty(e, i, r), r;
}

const nt = Object;

const rt = String;

const ot = nt.prototype;

const createLookup = () => nt.create(null);

const createError$1 = t => new Error(t);

const lt = ot.hasOwnProperty;

const ht = nt.freeze;

const at = nt.assign;

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

const yt = "running";

const wt = E.Observer;

const kt = E.Node;

const Ct = E.Layout;

const At = 1;

const Bt = 2;

const St = 4;

const _t = 6;

const Rt = 8;

const Tt = /*@__PURE__*/ ht({
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
        Ft(t.constructor, Nt.keyFrom(e));
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

const Nt = ht({
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
        let h;
        let a;
        let c;
        let u;
        while (--r >= 0) {
            c = n[r];
            h = Ot(c).filter(isBindableAnnotation);
            a = h.length;
            for (u = 0; u < a; ++u) {
                s[l++] = It(Vt, c, h[u].slice(i));
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
    $t.define(t, e);
}

const $t = {
    key: /*@__PURE__*/ Dt("coercer"),
    define(t, e) {
        Pt($t.key, t[e].bind(t), t);
    },
    for(t) {
        return It($t.key, t);
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
            r = typeof t === "function" ? t.bind(n) : $t.for(n) ?? s;
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
        return new BindingBehaviorDefinition(e, h(getBehaviorAnnotation(e, "name"), i), a(getBehaviorAnnotation(e, "aliases"), s.aliases, e.aliases), Xt.keyFrom(i));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        jt(i, e).register(t);
        zt(i, e).register(t);
        registerAliases(s, Xt, i, t);
    }
}

const Kt = /*@__PURE__*/ qt("binding-behavior");

const getBehaviorAnnotation = (t, e) => It(Dt(e), t);

const Xt = ht({
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

const ie = ht({
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

class Refs {}

function getRef(t, e) {
    return t.$au?.[e] ?? null;
}

function setRef(t, e, i) {
    var s;
    ((s = t).$au ?? (s.$au = new Refs))[e] = i;
}

const ne = /*@__PURE__*/ Wt("INode");

const re = /*@__PURE__*/ Wt("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(ws, true)) {
        return t.get(ws).host;
    }
    return t.get(se).document;
}))));

const oe = /*@__PURE__*/ Wt("IRenderLocation");

const le = /*@__PURE__*/ Wt("CssModules");

const he = new WeakMap;

function getEffectiveParentNode(t) {
    if (he.has(t)) {
        return he.get(t);
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
            he.set(i[t], e);
        }
    } else {
        he.set(t, e);
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

const ae = /*@__PURE__*/ Wt("IWindow", (t => t.callback((t => t.get(se).window))));

const ce = /*@__PURE__*/ Wt("ILocation", (t => t.callback((t => t.get(ae).location))));

const ue = /*@__PURE__*/ Wt("IHistory", (t => t.callback((t => t.get(ae).history))));

const registerHostNode = (t, e, i) => {
    registerResolver(t, e.HTMLElement, registerResolver(t, e.Element, registerResolver(t, ne, new d("ElementResolver", i))));
    return t;
};

const fe = "Element";

const de = "Attribute";

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
        return de;
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
        return new CustomAttributeDefinition(e, h(getAttributeAnnotation(e, "name"), i), a(getAttributeAnnotation(e, "aliases"), s.aliases, e.aliases), getAttributeKeyFrom(i), h(getAttributeAnnotation(e, "defaultBindingMode"), s.defaultBindingMode, e.defaultBindingMode, Bt), h(getAttributeAnnotation(e, "isTemplateController"), s.isTemplateController, e.isTemplateController, false), Nt.from(e, ...Nt.getAll(e), getAttributeAnnotation(e, "bindables"), e.bindables, s.bindables), h(getAttributeAnnotation(e, "noMultiBindings"), s.noMultiBindings, e.noMultiBindings, false), a(be.getAnnotation(e), e.watches), a(getAttributeAnnotation(e, "dependencies"), s.dependencies, e.dependencies));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        Gt(i, e).register(t);
        zt(i, e).register(t);
        registerAliases(s, ge, i, t);
    }
    toString() {
        return `au:ca:${this.name}`;
    }
}

const me = qt("custom-attribute");

const getAttributeKeyFrom = t => `${me}:${t}`;

const getAttributeAnnotation = (t, e) => It(Dt(e), t);

const isAttributeType = t => isFunction(t) && Et(me, t);

const findAttributeControllerFor = (t, e) => getRef(t, getAttributeKeyFrom(e)) ?? void 0;

const defineAttribute = (t, e) => {
    const i = CustomAttributeDefinition.create(t, e);
    Pt(me, i, i.Type);
    Pt(me, i, i);
    Ht(e, me);
    return i.Type;
};

const getAttributeDefinition = t => {
    const e = It(me, t);
    if (e === void 0) {
        throw createMappedError(759, t);
    }
    return e;
};

const ge = ht({
    name: me,
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
                throw createMappedError(773, `${rt(e)}@${l.name}}`);
            }
        } else if (!isFunction(n?.value)) {
            throw createMappedError(774, s);
        }
        be.add(l, h);
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

const pe = f;

const ve = Dt("watch");

const be = ht({
    name: ve,
    add(t, e) {
        let i = It(ve, t);
        if (i == null) {
            Pt(ve, i = [], t);
        }
        i.push(e);
    },
    getAnnotation(t) {
        return It(ve, t) ?? pe;
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
    const e = It(we, t);
    if (e === void 0) {
        annotateElementMetadata(t, "containerless", true);
        return;
    }
    e.containerless = true;
}

const xe = new WeakMap;

class CustomElementDefinition {
    get type() {
        return fe;
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
            const s = m("name", i, ke);
            if (isFunction(i.Type)) {
                e = i.Type;
            } else {
                e = Ce(g(s));
            }
            return new CustomElementDefinition(e, s, a(i.aliases), m("key", i, (() => getElementKeyFrom(s))), m("cache", i, returnZero), m("capture", i, returnFalse), m("template", i, returnNull), a(i.instructions), a(i.dependencies), m("injectable", i, returnNull), m("needsCompile", i, returnTrue), a(i.surrogates), Nt.from(e, i.bindables), m("containerless", i, returnFalse), m("shadowOptions", i, returnNull), m("hasSlots", i, returnFalse), m("enhance", i, returnFalse), m("watches", i, returnEmptyArray), p("processContent", e, returnNull));
        }
        if (isString(t)) {
            return new CustomElementDefinition(e, t, a(getElementAnnotation(e, "aliases"), e.aliases), getElementKeyFrom(t), p("cache", e, returnZero), p("capture", e, returnFalse), p("template", e, returnNull), a(getElementAnnotation(e, "instructions"), e.instructions), a(getElementAnnotation(e, "dependencies"), e.dependencies), p("injectable", e, returnNull), p("needsCompile", e, returnTrue), a(getElementAnnotation(e, "surrogates"), e.surrogates), Nt.from(e, ...Nt.getAll(e), getElementAnnotation(e, "bindables"), e.bindables), p("containerless", e, returnFalse), p("shadowOptions", e, returnNull), p("hasSlots", e, returnFalse), p("enhance", e, returnFalse), a(be.getAnnotation(e), e.watches), p("processContent", e, returnNull));
        }
        const i = m("name", t, ke);
        return new CustomElementDefinition(e, i, a(getElementAnnotation(e, "aliases"), t.aliases, e.aliases), getElementKeyFrom(i), v("cache", t, e, returnZero), v("capture", t, e, returnFalse), v("template", t, e, returnNull), a(getElementAnnotation(e, "instructions"), t.instructions, e.instructions), a(getElementAnnotation(e, "dependencies"), t.dependencies, e.dependencies), v("injectable", t, e, returnNull), v("needsCompile", t, e, returnTrue), a(getElementAnnotation(e, "surrogates"), t.surrogates, e.surrogates), Nt.from(e, ...Nt.getAll(e), getElementAnnotation(e, "bindables"), e.bindables, t.bindables), v("containerless", t, e, returnFalse), v("shadowOptions", t, e, returnNull), v("hasSlots", t, e, returnFalse), v("enhance", t, e, returnFalse), a(t.watches, be.getAnnotation(e), e.watches), v("processContent", t, e, returnNull));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) {
            return t;
        }
        if (xe.has(t)) {
            return xe.get(t);
        }
        const e = CustomElementDefinition.create(t);
        xe.set(t, e);
        Pt(we, e, e.Type);
        return e;
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        if (!t.has(i, false)) {
            Gt(i, e).register(t);
            zt(i, e).register(t);
            registerAliases(s, Ae, i, t);
        }
    }
    toString() {
        return `au:ce:${this.name}`;
    }
}

const ye = {
    name: undefined,
    searchParents: false,
    optional: false
};

const returnZero = () => 0;

const returnNull = () => null;

const returnFalse = () => false;

const returnTrue = () => true;

const returnEmptyArray = () => f;

const we = /*@__PURE__*/ qt("custom-element");

const getElementKeyFrom = t => `${we}:${t}`;

const ke = /*@__PURE__*/ (() => {
    let t = 0;
    return () => `unnamed-${++t}`;
})();

const annotateElementMetadata = (t, e, i) => {
    Pt(Dt(e), i, t);
};

const defineElement = (t, e) => {
    const i = CustomElementDefinition.create(t, e);
    Pt(we, i, i.Type);
    Pt(we, i, i);
    Ht(i.Type, we);
    return i.Type;
};

const isElementType = t => isFunction(t) && Et(we, t);

const findElementControllerFor = (t, e = ye) => {
    if (e.name === void 0 && e.searchParents !== true) {
        const i = getRef(t, we);
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
            const i = getRef(t, we);
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
            const t = getRef(i, we);
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
        const t = getRef(i, we);
        if (t !== null) {
            return t;
        }
        i = getEffectiveParentNode(i);
    }
    throw createMappedError(765, t);
};

const getElementAnnotation = (t, e) => It(Dt(e), t);

const getElementDefinition = t => {
    const e = It(we, t);
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

const Ce = /*@__PURE__*/ function() {
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
        mt(n, "name", t);
        if (s !== e) {
            at(n.prototype, s);
        }
        return n;
    };
}();

const Ae = ht({
    name: we,
    keyFrom: getElementKeyFrom,
    isType: isElementType,
    for: findElementControllerFor,
    define: defineElement,
    getDefinition: getElementDefinition,
    annotate: annotateElementMetadata,
    getAnnotation: getElementAnnotation,
    generateName: ke,
    createInjectable: createElementInjectable,
    generateType: Ce
});

const Be = /*@__PURE__*/ Dt("processContent");

function processContent(t) {
    return t === void 0 ? function(t, e, i) {
        Pt(Be, ensureHook(t, e), t);
    } : function(e) {
        t = ensureHook(e, t);
        const i = It(we, e);
        if (i !== void 0) {
            i.processContent = t;
        } else {
            Pt(Be, t, e);
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
        this.type = kt | Ct;
        this.v = "";
        this.H = {};
        this.F = 0;
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
        const t = this.H;
        const e = ++this.F;
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
                t[l] = this.F;
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
        const i = at({}, ...this.modules);
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
        }, e.inject = [ ne ], e));
        t.register(s, Ut(le, i));
    }
}

function shadowCSS(...t) {
    return new ShadowDOMRegistry(t);
}

const Se = /*@__PURE__*/ Wt("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
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
        const e = t.get(Re);
        const i = t.get(Se);
        t.register(Ut(_e, i.createStyles(this.css, e)));
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

AdoptedStyleSheetsStylesFactory.inject = [ se ];

class StyleElementStylesFactory {
    constructor(t) {
        this.p = t;
    }
    createStyles(t, e) {
        return new StyleElementStyles(this.p, t, e);
    }
}

StyleElementStylesFactory.inject = [ se ];

const _e = /*@__PURE__*/ Wt("IShadowDOMStyles");

const Re = /*@__PURE__*/ Wt("IShadowDOMGlobalStyles", (t => t.instance({
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

const Te = {
    shadowDOM(t) {
        return ie.creating(b, (e => {
            if (t.sharedStyles != null) {
                const i = e.get(Se);
                e.register(Ut(Re, i.createStyles(t.sharedStyles, null)));
            }
        }));
    }
};

function valueConverter(t) {
    return function(e) {
        return Ee.define(t, e);
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
        return new ValueConverterDefinition(e, h(getConverterAnnotation(e, "name"), i), a(getConverterAnnotation(e, "aliases"), s.aliases, e.aliases), Ee.keyFrom(i));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        r.singleton(i, e).register(t);
        r.aliasTo(i, e).register(t);
        registerAliases(s, Ee, i, t);
    }
}

const Ie = qt("value-converter");

const getConverterAnnotation = (t, e) => It(Dt(e), t);

const Ee = ht({
    name: Ie,
    keyFrom: t => `${Ie}:${t}`,
    isType(t) {
        return isFunction(t) && Et(Ie, t);
    },
    define(t, e) {
        const i = ValueConverterDefinition.create(t, e);
        Pt(Ie, i, i.Type);
        Pt(Ie, i, i);
        Ht(e, Ie);
        return i.Type;
    },
    getDefinition(t) {
        const e = It(Ie, t);
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
        this.N = e;
    }
    flush() {
        this.b.updateSource(this.v);
    }
    handleChange(t, e) {
        const i = this.b;
        if (t !== L(i.ast, i.s, i, null)) {
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
    defineHiddenProp(s, "get", (function(t) {
        return this.l.get(t);
    }));
    defineHiddenProp(s, "getSignaler", (function() {
        return this.l.root.get(P);
    }));
    defineHiddenProp(s, "getConverter", (function(t) {
        const e = Ee.keyFrom(t);
        let i = Pe.get(this);
        if (i == null) {
            Pe.set(this, i = new ResourceLookup);
        }
        return i[e] ?? (i[e] = this.l.get(resource(e)));
    }));
    defineHiddenProp(s, "getBehavior", (function(t) {
        const e = Xt.keyFrom(t);
        let i = Pe.get(this);
        if (i == null) {
            Pe.set(this, i = new ResourceLookup);
        }
        return i[e] ?? (i[e] = this.l.get(resource(e)));
    }));
};

const Pe = new WeakMap;

class ResourceLookup {}

const Le = /*@__PURE__*/ Wt("IFlushQueue", (t => t.singleton(FlushQueue)));

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

const Me = new WeakSet;

const mixingBindingLimited = (t, e) => {
    defineHiddenProp(t.prototype, "limit", (function(t) {
        if (Me.has(this)) {
            throw createMappedError(9996);
        }
        Me.add(this);
        const i = e(this, t);
        const s = t.signals;
        const n = s.length > 0 ? this.get(P) : null;
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
                Me.delete(this);
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
        l = s?.status === xt;
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
        a = s?.status === xt;
        u();
        if (a) {
            callOriginalCallback();
        }
    };
    return fn;
};

const {enter: De, exit: qe} = D;

const {wrap: He, unwrap: Fe} = q;

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
            De(this);
            return this.v = Fe(this.$get.call(void 0, this.useProxy ? He(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            qe(this);
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
        this.v = L(this.j, this.scope, this, this);
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

const Oe = /*@__PURE__*/ Wt("ILifecycleHooks");

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
        jt(Oe, this.Type).register(t);
    }
}

const Ve = new WeakMap;

const Ne = Dt("lifecycle-hooks");

const $e = ht({
    name: Ne,
    define(t, e) {
        const i = LifecycleHooksDefinition.create(t, e);
        Pt(Ne, i, e);
        Ht(e, Ne);
        return i.Type;
    },
    resolve(t) {
        let e = Ve.get(t);
        if (e === void 0) {
            Ve.set(t, e = new LifecycleHooksLookupImpl);
            const i = t.root;
            const s = i.id === t.id ? t.getAll(Oe) : t.has(Oe, false) ? i.getAll(Oe).concat(t.getAll(Oe)) : i.getAll(Oe);
            let n;
            let r;
            let l;
            let h;
            let a;
            for (n of s) {
                r = It(Ne, n.constructor);
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
        return $e.define({}, t);
    };
}

const We = {
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
            const i = this.G.state !== as;
            if (i) {
                t = this.U;
                this.U = this.A.queueTask((() => {
                    this.U = null;
                    this.updateTarget(e);
                }), We);
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
        H(this.ast, t, this);
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
        F(this.ast, this.s, this);
        this.s = void 0;
        this.v = void 0;
        this.U?.cancel();
        this.U = null;
        this.obs.clearAll();
    }
}

mixinUseScope(AttributeBinding);

mixingBindingLimited(AttributeBinding, (() => "updateTarget"));

M(AttributeBinding);

mixinAstEvaluator(true)(AttributeBinding);

const je = {
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
        this.K = i.getAccessor(r, l);
        const a = n.expressions;
        const c = this.partBindings = Array(a.length);
        const u = a.length;
        let f = 0;
        for (;u > f; ++f) {
            c[f] = new InterpolationPartBinding(a[f], r, l, e, i, this);
        }
    }
    X() {
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
        const r = this.K;
        const l = this.G.state !== as && (r.type & Ct) > 0;
        let h;
        if (l) {
            h = this.U;
            this.U = this.A.queueTask((() => {
                this.U = null;
                r.setValue(s, this.target, this.targetProperty);
            }), je);
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
        this.mode = Bt;
        this.task = null;
        this.isBound = false;
        this.v = "";
        this.boundFn = false;
        this.l = s;
        this.oL = n;
    }
    updateTarget() {
        this.owner.X();
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
        H(this.ast, t, this);
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
        F(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

mixinUseScope(InterpolationPartBinding);

mixingBindingLimited(InterpolationPartBinding, (() => "updateTarget"));

M(InterpolationPartBinding);

mixinAstEvaluator(true)(InterpolationPartBinding);

const ze = {
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
        this.U = null;
        this.v = "";
        this.Y = false;
        this.boundFn = false;
        this.strict = true;
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
            this.U?.cancel();
            this.U = null;
            return;
        }
        const e = this.G.state !== as;
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
        const t = this.v = L(this.ast, this.s, this, (this.mode & Bt) > 0 ? this : null);
        this.obs.clear();
        if (isArray(t)) {
            this.observeCollection(t);
        }
        const e = this.G.state !== as;
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
        H(this.ast, t, this);
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
        F(this.ast, this.s, this);
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
        }), ze);
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
        this.target = this.J ? t.bindingContext : t.overrideContext;
        H(this.ast, t, this);
        this.v = L(this.ast, this.s, this, this);
        this.updateTarget();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        F(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

mixinUseScope(LetBinding);

mixingBindingLimited(LetBinding, (() => "updateTarget"));

M(LetBinding);

mixinAstEvaluator(true)(LetBinding);

class PropertyBinding {
    constructor(t, e, i, s, n, r, l, h) {
        this.ast = n;
        this.target = r;
        this.targetProperty = l;
        this.mode = h;
        this.isBound = false;
        this.s = void 0;
        this.K = void 0;
        this.U = null;
        this.tt = null;
        this.boundFn = false;
        this.l = e;
        this.G = t;
        this.A = s;
        this.oL = i;
    }
    updateTarget(t) {
        this.K.setValue(t, this.target, this.targetProperty);
    }
    updateSource(t) {
        O(this.ast, this.s, this, t);
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = L(this.ast, this.s, this, (this.mode & Bt) > 0 ? this : null);
        this.obs.clear();
        const e = this.G.state !== as && (this.K.type & Ct) > 0;
        if (e) {
            Ue = this.U;
            this.U = this.A.queueTask((() => {
                this.updateTarget(t);
                this.U = null;
            }), Ge);
            Ue?.cancel();
            Ue = null;
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
        H(this.ast, t, this);
        const e = this.oL;
        const i = this.mode;
        let s = this.K;
        if (!s) {
            if (i & St) {
                s = e.getObserver(this.target, this.targetProperty);
            } else {
                s = e.getAccessor(this.target, this.targetProperty);
            }
            this.K = s;
        }
        const n = (i & Bt) > 0;
        if (i & (Bt | At)) {
            this.updateTarget(L(this.ast, this.s, this, n ? this : null));
        }
        if (i & St) {
            s.subscribe(this.tt ?? (this.tt = new BindingTargetSubscriber(this, this.l.get(Le))));
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
        F(this.ast, this.s, this);
        this.s = void 0;
        if (this.tt) {
            this.K.unsubscribe(this.tt);
            this.tt = null;
        }
        this.U?.cancel();
        this.U = null;
        this.obs.clearAll();
    }
    useTargetObserver(t) {
        this.K?.unsubscribe(this);
        (this.K = t).subscribe(this);
    }
    useTargetSubscriber(t) {
        if (this.tt != null) {
            throw createMappedError(9995);
        }
        this.tt = t;
    }
}

mixinUseScope(PropertyBinding);

mixingBindingLimited(PropertyBinding, (t => t.mode & St ? "updateSource" : "updateTarget"));

M(PropertyBinding);

mixinAstEvaluator(true, false)(PropertyBinding);

let Ue = null;

const Ge = {
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
        H(this.ast, t, this);
        O(this.ast, this.s, this, this.target);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        if (L(this.ast, this.s, this, null) === this.target) {
            O(this.ast, this.s, this, null);
        }
        F(this.ast, this.s, this);
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
        this.et = null;
        this.l = t;
        this.it = n;
        this.et = r;
    }
    callSource(t) {
        const e = this.s.overrideContext;
        e.$event = t;
        let i = L(this.ast, this.s, this, null);
        delete e.$event;
        if (isFunction(i)) {
            i = i(t);
        }
        if (i !== true && this.it.prevent) {
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
        if (this.et?.(t) !== false) {
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
        H(this.ast, t, this);
        this.target.addEventListener(this.targetEvent, this, this.it);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        F(this.ast, this.s, this);
        this.s = void 0;
        this.target.removeEventListener(this.targetEvent, this, this.it);
    }
}

mixinUseScope(ListenerBinding);

mixingBindingLimited(ListenerBinding, (() => "callSource"));

mixinAstEvaluator(true, true)(ListenerBinding);

const Ke = /*@__PURE__*/ Wt("IEventModifier");

const Xe = /*@__PURE__*/ Wt("IKeyMapping", (t => t.instance({
    meta: ht([ "ctrl", "alt", "shift", "meta" ]),
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
        this.st = c(Xe);
        this.nt = [ "left", "middle", "right" ];
    }
    static register(t) {
        t.register(jt(Ke, ModifiedMouseEventHandler));
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
                    if (t.button !== this.nt.indexOf(n)) return false;
                    continue;
                }
                if (this.st.meta.includes(n) && t[`${n}Key`] !== true) {
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
        this.st = c(Xe);
        this.type = [ "keydown", "keyup" ];
    }
    static register(t) {
        t.register(jt(Ke, ModifiedKeyboardEventHandler));
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
                if (this.st.meta.includes(n)) {
                    if (t[`${n}Key`] !== true) {
                        return false;
                    }
                    continue;
                }
                const e = this.st.keys[n];
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

const Qe = /*@__PURE__*/ Wt("IEventModifierHandler", (t => t.instance({
    getHandler: () => null
})));

class EventModifier {
    constructor() {
        this.rt = c(x(Ke)).reduce(((t, e) => {
            const i = isArray(e.type) ? e.type : [ e.type ];
            i.forEach((i => t[i] = e));
            return t;
        }), {});
    }
    static register(t) {
        t.register(jt(Qe, EventModifier));
    }
    getHandler(t, e) {
        return isString(e) ? this.rt[t]?.getHandler(e) ?? null : null;
    }
}

const Ye = {
    register(t) {
        t.register(EventModifier, ModifiedMouseEventHandler, ModifiedKeyboardEventHandler);
    }
};

const Ze = /*@__PURE__*/ Wt("IViewFactory");

class ViewFactory {
    constructor(t, e) {
        this.isCaching = false;
        this.ot = null;
        this.lt = -1;
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
            if (this.lt === -1 || !e) {
                this.lt = t;
            }
        }
        if (this.lt > 0) {
            this.ot = [];
        } else {
            this.ot = null;
        }
        this.isCaching = this.lt > 0;
    }
    canReturnToCache(t) {
        return this.ot != null && this.ot.length < this.lt;
    }
    tryReturnToCache(t) {
        if (this.canReturnToCache(t)) {
            this.ot.push(t);
            return true;
        }
        return false;
    }
    create(t) {
        const e = this.ot;
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

const Je = "au-start";

const ti = "au-end";

const createElement = (t, e) => t.document.createElement(e);

const createComment = (t, e) => t.document.createComment(e);

const createLocation = t => {
    const e = createComment(t, ti);
    e.$start = createComment(t, Je);
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

const ei = /*@__PURE__*/ Wt("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

const ii = /*@__PURE__*/ Wt("IAuSlotWatcher");

class AuSlotWatcherBinding {
    constructor(t, e, i, s) {
        this.ht = new Set;
        this.ct = f;
        this.isBound = false;
        this.cb = (this.o = t)[e];
        this.slotName = i;
        this.ut = s;
    }
    bind() {
        this.isBound = true;
    }
    unbind() {
        this.isBound = false;
    }
    getValue() {
        return this.ct;
    }
    watch(t) {
        if (!this.ht.has(t)) {
            this.ht.add(t);
            t.subscribe(this);
        }
    }
    unwatch(t) {
        if (this.ht.delete(t)) {
            t.unsubscribe(this);
        }
    }
    handleSlotChange(t, e) {
        if (!this.isBound) {
            return;
        }
        const i = this.ct;
        const s = [];
        let n;
        let r;
        for (n of this.ht) {
            for (r of n === t ? e : n.nodes) {
                if (this.ut === "*" || isElement(r) && r.matches(this.ut)) {
                    s[s.length] = r;
                }
            }
        }
        if (s.length !== i.length || s.some(((t, e) => t !== i[e]))) {
            this.ct = s;
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
        this.ft = t;
    }
    register(t) {
        Ut(Oe, this).register(t);
    }
    hydrating(t, e) {
        const i = this.ft;
        const s = new AuSlotWatcherBinding(t, i.callback ?? `${rt(i.name)}Changed`, i.slotName ?? "default", i.query ?? "*");
        mt(t, i.name, {
            enumerable: true,
            configurable: true,
            get: at((() => s.getValue()), {
                getObserver: () => s
            }),
            set: () => {}
        });
        Ut(ii, s).register(e.container);
        e.addBinding(s);
    }
}

function slotted(t, e) {
    if (!si) {
        si = true;
        V(AuSlotWatcherBinding);
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
        let a = Ae.getAnnotation(h, i);
        if (a == null) {
            Ae.annotate(h, i, a = []);
        }
        a.push(new SlottedLifecycleHooks(l));
    }
    return decorator;
}

let si = false;

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
            const d = n.compileSpread(s.controller.definition, s.instruction?.captures ?? f, s.controller.container, e, i);
            let m;
            for (m of d) {
                switch (m.type) {
                  case ki:
                    renderSpreadInstruction(t + 1);
                    break;

                  case Ci:
                    c[m.instructions.type].render(u, findElementControllerFor(e), m.instructions, r, l, h);
                    break;

                  default:
                    c[m.type].render(u, e, m, r, l, h);
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
        this.dt = t;
        this.isBound = false;
        this.gt = [];
        this.$controller = t.controller;
        this.locator = this.$controller.container;
    }
    get(t) {
        return this.locator.get(t);
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        const e = this.scope = this.dt.controller.scope.parent ?? void 0;
        if (e == null) {
            throw createMappedError(9999);
        }
        this.gt.forEach((t => t.bind(e)));
    }
    unbind() {
        this.gt.forEach((t => t.unbind()));
        this.isBound = false;
    }
    addBinding(t) {
        this.gt.push(t);
    }
    addChild(t) {
        if (t.vmKind !== os) {
            throw createMappedError(9998);
        }
        this.$controller.addChild(t);
    }
}

const ni = "ra";

const ri = "rb";

const oi = "rc";

const li = "rd";

const hi = "re";

const ai = "rf";

const ci = "rg";

const ui = "ri";

const fi = "rj";

const di = "rk";

const mi = "rl";

const gi = "ha";

const pi = "hb";

const vi = "hc";

const bi = "hd";

const xi = "he";

const yi = "hf";

const wi = "hg";

const ki = "hs";

const Ci = "hp";

const Ai = /*@__PURE__*/ ht({
    hydrateElement: ni,
    hydrateAttribute: ri,
    hydrateTemplateController: oi,
    hydrateLetElement: li,
    setProperty: hi,
    interpolation: ai,
    propertyBinding: ci,
    letBinding: ui,
    refBinding: fi,
    iteratorBinding: di,
    multiAttr: mi,
    textBinding: gi,
    listenerBinding: pi,
    attributeBinding: vi,
    stylePropertyBinding: bi,
    setAttribute: xi,
    setClassAttribute: yi,
    setStyleAttribute: wi,
    spreadBinding: ki,
    spreadElementProp: Ci
});

const Bi = /*@__PURE__*/ Wt("Instruction");

function isInstruction(t) {
    const e = t.type;
    return isString(e) && e.length === 2;
}

class InterpolationInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = ai;
    }
}

class PropertyBindingInstruction {
    constructor(t, e, i) {
        this.from = t;
        this.to = e;
        this.mode = i;
        this.type = ci;
    }
}

class IteratorBindingInstruction {
    constructor(t, e, i) {
        this.forOf = t;
        this.to = e;
        this.props = i;
        this.type = di;
    }
}

class RefBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = fi;
    }
}

class SetPropertyInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = hi;
    }
}

class MultiAttrInstruction {
    constructor(t, e, i) {
        this.value = t;
        this.to = e;
        this.command = i;
        this.type = mi;
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
        this.type = ni;
        this.auSlot = null;
    }
}

class HydrateAttributeInstruction {
    constructor(t, e, i) {
        this.res = t;
        this.alias = e;
        this.props = i;
        this.type = ri;
    }
}

class HydrateTemplateController {
    constructor(t, e, i, s) {
        this.def = t;
        this.res = e;
        this.alias = i;
        this.props = s;
        this.type = oi;
    }
}

class HydrateLetElementInstruction {
    constructor(t, e) {
        this.instructions = t;
        this.toBindingContext = e;
        this.type = li;
    }
}

class LetBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = ui;
    }
}

class TextBindingInstruction {
    constructor(t) {
        this.from = t;
        this.type = gi;
    }
}

class ListenerBindingInstruction {
    constructor(t, e, i, s, n) {
        this.from = t;
        this.to = e;
        this.preventDefault = i;
        this.capture = s;
        this.modifier = n;
        this.type = pi;
    }
}

class StylePropertyBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = bi;
    }
}

class SetAttributeInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = xi;
    }
}

class SetClassAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = yi;
    }
}

class SetStyleAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = wi;
    }
}

class AttributeBindingInstruction {
    constructor(t, e, i) {
        this.attr = t;
        this.from = e;
        this.to = i;
        this.type = vi;
    }
}

class SpreadBindingInstruction {
    constructor() {
        this.type = ki;
    }
}

class SpreadElementPropBindingInstruction {
    constructor(t) {
        this.instructions = t;
        this.type = Ci;
    }
}

const Si = /*@__PURE__*/ Wt("ITemplateCompiler");

const _i = /*@__PURE__*/ Wt("IRenderer");

function renderer(t) {
    return function decorator(e) {
        e.register = function(t) {
            jt(_i, this).register(t);
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

let Ri = class SetPropertyRenderer {
    render(t, e, i) {
        const s = getTarget(e);
        if (s.$observers?.[i.to] !== void 0) {
            s.$observers[i.to].setValue(i.value);
        } else {
            s[i.to] = i.value;
        }
    }
};

Ri = __decorate([ renderer(hi) ], Ri);

let Ti = class CustomElementRenderer {
    constructor() {
        this.r = c(Zi);
    }
    render(t, e, i, s, n, r) {
        let l;
        let h;
        let a;
        let c;
        const u = i.res;
        const f = i.projections;
        const m = t.container;
        switch (typeof u) {
          case "string":
            l = m.find(Ae, u);
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
        h = l.Type;
        a = v.invoke(h);
        registerResolver(v, h, new d(l.key, a));
        c = Controller.$el(v, a, e, i, l, p);
        setRef(e, l.key, c);
        const b = this.r.renderers;
        const x = i.props;
        const y = x.length;
        let w = 0;
        let k;
        while (y > w) {
            k = x[w];
            b[k.type].render(t, c, k, s, n, r);
            ++w;
        }
        t.addChild(c);
    }
};

Ti = __decorate([ renderer(ni) ], Ti);

let Ii = class CustomAttributeRenderer {
    constructor() {
        this.r = c(Zi);
    }
    render(t, e, i, s, n, r) {
        let l = t.container;
        let h;
        switch (typeof i.res) {
          case "string":
            h = l.find(ge, i.res);
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

Ii = __decorate([ renderer(ri) ], Ii);

let Ei = class TemplateControllerRenderer {
    constructor() {
        this.r = c(Zi);
    }
    render(t, e, i, s, n, r) {
        let l = t.container;
        let h;
        switch (typeof i.res) {
          case "string":
            h = l.find(ge, i.res);
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

Ei = __decorate([ renderer(oi) ], Ei);

let Pi = class LetElementRenderer {
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
            f = ensureExpression(n, u.from, bt);
            t.addBinding(new LetBinding(a, r, f, u.to, h));
            ++d;
        }
    }
};

Pi = __decorate([ renderer(li) ], Pi);

let Li = class RefBindingRenderer {
    render(t, e, i, s, n) {
        t.addBinding(new RefBinding(t.container, ensureExpression(n, i.from, bt), getRefTarget(e, i.to)));
    }
};

Li = __decorate([ renderer(fi) ], Li);

let Mi = class InterpolationBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new InterpolationBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, gt), getTarget(e), i.to, Bt));
    }
};

Mi = __decorate([ renderer(ai) ], Mi);

let Di = class PropertyBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, bt), getTarget(e), i.to, i.mode));
    }
};

Di = __decorate([ renderer(ci) ], Di);

let qi = class IteratorBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.forOf, pt), getTarget(e), i.to, Bt));
    }
};

qi = __decorate([ renderer(di) ], qi);

let Hi = class TextBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, s.domWriteQueue, s, ensureExpression(n, i.from, bt), e));
    }
};

Hi = __decorate([ renderer(gi) ], Hi);

let Fi = class ListenerBindingRenderer {
    constructor() {
        this.vt = c(Qe);
    }
    render(t, e, i, s, n) {
        t.addBinding(new ListenerBinding(t.container, ensureExpression(n, i.from, vt), e, i.to, new ListenerBindingOptions(i.preventDefault, i.capture), this.vt.getHandler(i.to, i.modifier)));
    }
};

Fi = __decorate([ renderer(pi) ], Fi);

let Oi = class SetAttributeRenderer {
    render(t, e, i) {
        e.setAttribute(i.to, i.value);
    }
};

Oi = __decorate([ renderer(xi) ], Oi);

let Vi = class SetClassAttributeRenderer {
    render(t, e, i) {
        addClasses(e.classList, i.value);
    }
};

Vi = __decorate([ renderer(yi) ], Vi);

let Ni = class SetStyleAttributeRenderer {
    render(t, e, i) {
        e.style.cssText += i.value;
    }
};

Ni = __decorate([ renderer(wi) ], Ni);

let $i = class StylePropertyBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, bt), e.style, i.to, Bt));
    }
};

$i = __decorate([ renderer(bi) ], $i);

let Wi = class AttributeBindingRenderer {
    render(t, e, i, s, n, r) {
        const l = t.container;
        const h = l.has(le, false) ? l.get(le) : null;
        t.addBinding(new AttributeBinding(t, l, r, s.domWriteQueue, ensureExpression(n, i.from, bt), e, i.attr, h == null ? i.to : i.to.split(/\s/g).map((t => h[t] ?? t)).join(" "), Bt));
    }
};

Wi = __decorate([ renderer(vi) ], Wi);

let ji = class SpreadRenderer {
    constructor() {
        this.bt = c(Si);
        this.r = c(Zi);
    }
    render(t, e, i, s, n, r) {
        SpreadBinding.create(t.container.get(vs), e, void 0, this.r, this.bt, s, n, r).forEach((e => t.addBinding(e)));
    }
};

ji = __decorate([ renderer(ki) ], ji);

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

const zi = "IController";

const Ui = "IInstruction";

const Gi = "IRenderLocation";

const Ki = "ISlotsInfo";

function createElementContainer(t, e, i, s, n, r) {
    const l = e.container.createChild();
    registerHostNode(l, t, i);
    registerResolver(l, ps, new d(zi, e));
    registerResolver(l, Bi, new d(Ui, s));
    registerResolver(l, oe, n == null ? Xi : new RenderLocationProvider(n));
    registerResolver(l, Ze, Qi);
    registerResolver(l, ei, r == null ? Yi : new d(Ki, r));
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
    registerResolver(c, ps, new d(zi, a));
    registerResolver(c, Bi, new d(Ui, n));
    registerResolver(c, oe, l == null ? Xi : new d(Gi, l));
    registerResolver(c, Ze, r == null ? Qi : new ViewFactoryProvider(r));
    registerResolver(c, ei, h == null ? Yi : new d(Ki, h));
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

const Xi = new RenderLocationProvider(null);

const Qi = new ViewFactoryProvider(null);

const Yi = new d(Ki, new AuSlotsInfo(f));

const Zi = /*@__PURE__*/ Wt("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.xt ?? (this.xt = this.yt.getAll(_i, false).reduce(((t, e) => {
            t[e.target] = e;
            return t;
        }), createLookup()));
    }
    constructor() {
        this.wt = new WeakMap;
        this.kt = new WeakMap;
        const t = this.yt = c(b).root;
        this.p = t.get(se);
        this.ep = t.get(N);
        this.oL = t.get($);
        this.Ct = new FragmentNodeSequence(this.p, this.p.document.createDocumentFragment());
    }
    compile(t, e, i) {
        if (t.needsCompile !== false) {
            const s = this.wt;
            const n = e.get(Si);
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
            return new FragmentNodeSequence(this.p, this.At(t.template));
        }
        let e;
        let i = false;
        const s = this.kt;
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
            this.At(e);
            s.set(t, e);
        }
        return e == null ? this.Ct : new FragmentNodeSequence(this.p, i ? r.importNode(e, true) : r.adoptNode(e.cloneNode(true)));
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
    Bt() {
        return this.p.document.createElement("au-m");
    }
    At(t) {
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
                e.insertBefore(this.Bt(), s);
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

var Ji;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["host"] = 1] = "host";
    t[t["shadowRoot"] = 2] = "shadowRoot";
    t[t["location"] = 3] = "location";
})(Ji || (Ji = {}));

const ts = {
    optional: true
};

const es = optionalResource(W);

const is = new WeakMap;

class Controller {
    get lifecycleHooks() {
        return this.St;
    }
    get isActive() {
        return (this.state & (as | cs)) > 0 && (this.state & us) === 0;
    }
    get name() {
        if (this.parent === null) {
            switch (this.vmKind) {
              case os:
                return `[${this.definition.name}]`;

              case rs:
                return this.definition.name;

              case ls:
                return this.viewFactory.name;
            }
        }
        switch (this.vmKind) {
          case os:
            return `${this.parent.name}>[${this.definition.name}]`;

          case rs:
            return `${this.parent.name}>${this.definition.name}`;

          case ls:
            return this.viewFactory.name === this.parent.definition?.name ? `${this.parent.name}[view]` : `${this.parent.name}[view:${this.viewFactory.name}]`;
        }
    }
    get viewModel() {
        return this._t;
    }
    set viewModel(t) {
        this._t = t;
        this.Rt = t == null || this.vmKind === ls ? HooksDefinition.none : new HooksDefinition(t);
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
        this.Tt = false;
        this.hostController = null;
        this.mountTarget = 0;
        this.shadowRoot = null;
        this.nodes = null;
        this.location = null;
        this.St = null;
        this.state = hs;
        this.It = false;
        this.$initiator = null;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this.Et = 0;
        this.Pt = 0;
        this.Lt = 0;
        this._t = n;
        this.Rt = e === ls ? HooksDefinition.none : new HooksDefinition(n);
        this.location = l;
        this.r = t.root.get(Zi);
        this.coercion = e === ls ? void 0 : t.get(es);
    }
    static getCached(t) {
        return is.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (e === void 0) {
            throw createMappedError(500, t);
        }
        return e;
    }
    static $el(t, e, i, s, n = void 0, r = null) {
        if (is.has(e)) {
            return is.get(e);
        }
        n = n ?? getElementDefinition(e.constructor);
        const l = new Controller(t, rs, n, null, e, i, r);
        const h = t.get(y(vs));
        if (n.dependencies.length > 0) {
            t.register(...n.dependencies);
        }
        registerResolver(t, vs, new d("IHydrationContext", new HydrationContext(l, s, h)));
        is.set(e, l);
        if (s == null || s.hydrate !== false) {
            l.hE(s, h);
        }
        return l;
    }
    static $attr(t, e, i, s) {
        if (is.has(e)) {
            return is.get(e);
        }
        s = s ?? getAttributeDefinition(e.constructor);
        const n = new Controller(t, os, s, null, e, i, null);
        if (s.dependencies.length > 0) {
            t.register(...s.dependencies);
        }
        is.set(e, n);
        n.Mt();
        return n;
    }
    static $view(t, e = void 0) {
        const i = new Controller(t.container, ls, null, t, null, null, null);
        i.parent = e ?? null;
        i.Dt();
        return i;
    }
    hE(t, e) {
        const i = this.container;
        const s = this._t;
        let n = this.definition;
        this.scope = j.create(s, null, true);
        if (n.watches.length > 0) {
            createWatchers(this, i, n, s);
        }
        createObservers(this, n, s);
        if (this.Rt.qt) {
            const t = s.define(this, e, n);
            if (t !== void 0 && t !== n) {
                n = CustomElementDefinition.getOrCreate(t);
            }
        }
        this.St = $e.resolve(i);
        n.register(i);
        if (n.injectable !== null) {
            registerResolver(i, n.injectable, new d("definition.injectable", s));
        }
        if (t == null || t.hydrate !== false) {
            this.hS(t);
            this.hC();
        }
    }
    hS(t) {
        if (this.St.hydrating != null) {
            this.St.hydrating.forEach(callHydratingHook, this);
        }
        if (this.Rt.Ht) {
            this._t.hydrating(this);
        }
        const e = this.Ft = this.r.compile(this.definition, this.container, t);
        const {shadowOptions: i, hasSlots: s, containerless: n} = e;
        let r = this.location;
        if ((this.hostController = findElementControllerFor(this.host, ts)) !== null) {
            this.host = this.container.root.get(se).document.createElement(this.definition.name);
            if (n && r == null) {
                r = this.location = convertToRenderLocation(this.host);
            }
        }
        setRef(this.host, we, this);
        setRef(this.host, this.definition.key, this);
        if (i !== null || s) {
            if (r != null) {
                throw createMappedError(501);
            }
            setRef(this.shadowRoot = this.host.attachShadow(i ?? ns), we, this);
            setRef(this.shadowRoot, this.definition.key, this);
            this.mountTarget = 2;
        } else if (r != null) {
            setRef(r, we, this);
            setRef(r, this.definition.key, this);
            this.mountTarget = 3;
        } else {
            this.mountTarget = 1;
        }
        this._t.$controller = this;
        this.nodes = this.r.createNodes(e);
        if (this.St.hydrated !== void 0) {
            this.St.hydrated.forEach(callHydratedHook, this);
        }
        if (this.Rt.Ot) {
            this._t.hydrated(this);
        }
    }
    hC() {
        this.r.render(this, this.nodes.findTargets(), this.Ft, this.host);
        if (this.St.created !== void 0) {
            this.St.created.forEach(callCreatedHook, this);
        }
        if (this.Rt.Vt) {
            this._t.created(this);
        }
    }
    Mt() {
        const t = this.definition;
        const e = this._t;
        if (t.watches.length > 0) {
            createWatchers(this, this.container, t, e);
        }
        createObservers(this, t, e);
        e.$controller = this;
        this.St = $e.resolve(this.container);
        if (this.St.created !== void 0) {
            this.St.created.forEach(callCreatedHook, this);
        }
        if (this.Rt.Vt) {
            this._t.created(this);
        }
    }
    Dt() {
        this.Ft = this.r.compile(this.viewFactory.def, this.container, null);
        this.r.render(this, (this.nodes = this.r.createNodes(this.Ft)).findTargets(), this.Ft, void 0);
    }
    activate(t, e, i) {
        switch (this.state) {
          case hs:
          case fs:
            if (!(e === null || e.isActive)) {
                return;
            }
            this.state = as;
            break;

          case cs:
            return;

          case ms:
            throw createMappedError(502, this.name);

          default:
            throw createMappedError(503, this.name, stringifyState(this.state));
        }
        this.parent = e;
        switch (this.vmKind) {
          case rs:
            this.scope.parent = i ?? null;
            break;

          case os:
            this.scope = i ?? null;
            break;

          case ls:
            if (i === void 0 || i === null) {
                throw createMappedError(504, this.name);
            }
            if (!this.hasLockedScope) {
                this.scope = i;
            }
            break;
        }
        this.$initiator = t;
        this.Nt();
        let s = void 0;
        if (this.vmKind !== ls && this.St.binding != null) {
            s = w(...this.St.binding.map(callBindingHook, this));
        }
        if (this.Rt.$t) {
            s = w(s, this._t.binding(this.$initiator, this.parent));
        }
        if (isPromise(s)) {
            this.Wt();
            s.then((() => {
                this.Tt = true;
                if (this.state !== as) {
                    this.jt();
                } else {
                    this.bind();
                }
            })).catch((t => {
                this.zt(t);
            }));
            return this.$promise;
        }
        this.Tt = true;
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
        if (this.vmKind !== ls && this.St.bound != null) {
            i = w(...this.St.bound.map(callBoundHook, this));
        }
        if (this.Rt.Ut) {
            i = w(i, this._t.bound(this.$initiator, this.parent));
        }
        if (isPromise(i)) {
            this.Wt();
            i.then((() => {
                this.isBound = true;
                if (this.state !== as) {
                    this.jt();
                } else {
                    this.Gt();
                }
            })).catch((t => {
                this.zt(t);
            }));
            return;
        }
        this.isBound = true;
        this.Gt();
    }
    Kt(...t) {
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
    Gt() {
        if (this.hostController !== null) {
            switch (this.mountTarget) {
              case 1:
              case 2:
                this.hostController.Kt(this.host);
                break;

              case 3:
                this.hostController.Kt(this.location.$start, this.location);
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
                const e = t.has(_e, false) ? t.get(_e) : t.get(Re);
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
        if (this.vmKind !== ls && this.St.attaching != null) {
            e = w(...this.St.attaching.map(callAttachingHook, this));
        }
        if (this.Rt.Xt) {
            e = w(e, this._t.attaching(this.$initiator, this.parent));
        }
        if (isPromise(e)) {
            this.Wt();
            this.Nt();
            e.then((() => {
                this.jt();
            })).catch((t => {
                this.zt(t);
            }));
        }
        if (this.children !== null) {
            for (;t < this.children.length; ++t) {
                void this.children[t].activate(this.$initiator, this, this.scope);
            }
        }
        this.jt();
    }
    deactivate(t, e) {
        let i = void 0;
        switch (this.state & ~ds) {
          case cs:
            this.state = us;
            break;

          case as:
            this.state = us;
            i = this.$promise?.catch(s);
            break;

          case hs:
          case fs:
          case ms:
          case fs | ms:
            return;

          default:
            throw createMappedError(505, this.name, this.state);
        }
        this.$initiator = t;
        if (t === this) {
            this.Qt();
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
                if (this.vmKind !== ls && this.St.detaching != null) {
                    r = w(...this.St.detaching.map(callDetachingHook, this));
                }
                if (this.Rt.Yt) {
                    r = w(r, this._t.detaching(this.$initiator, this.parent));
                }
            }
            if (isPromise(r)) {
                this.Wt();
                t.Qt();
                r.then((() => {
                    t.Zt();
                })).catch((e => {
                    t.zt(e);
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
            this.Zt();
            return this.$promise;
        }));
    }
    removeNodes() {
        switch (this.vmKind) {
          case rs:
          case ls:
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
          case os:
            this.scope = null;
            break;

          case ls:
            if (!this.hasLockedScope) {
                this.scope = null;
            }
            if ((this.state & ds) === ds && !this.viewFactory.tryReturnToCache(this) && this.$initiator === this) {
                this.dispose();
            }
            break;

          case rs:
            this.scope.parent = null;
            break;
        }
        this.state = fs;
        this.$initiator = null;
        this.Jt();
    }
    Wt() {
        if (this.$promise === void 0) {
            this.$promise = new Promise(((t, e) => {
                this.$resolve = t;
                this.$reject = e;
            }));
            if (this.$initiator !== this) {
                this.parent.Wt();
            }
        }
    }
    Jt() {
        if (this.$promise !== void 0) {
            bs = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            bs();
            bs = void 0;
        }
    }
    zt(t) {
        if (this.$promise !== void 0) {
            xs = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            xs(t);
            xs = void 0;
        }
        if (this.$initiator !== this) {
            this.parent.zt(t);
        }
    }
    Nt() {
        ++this.Et;
        if (this.$initiator !== this) {
            this.parent.Nt();
        }
    }
    jt() {
        if (this.state !== as) {
            --this.Et;
            this.Jt();
            if (this.$initiator !== this) {
                this.parent.jt();
            }
            return;
        }
        if (--this.Et === 0) {
            if (this.vmKind !== ls && this.St.attached != null) {
                ys = w(...this.St.attached.map(callAttachedHook, this));
            }
            if (this.Rt.te) {
                ys = w(ys, this._t.attached(this.$initiator));
            }
            if (isPromise(ys)) {
                this.Wt();
                ys.then((() => {
                    this.state = cs;
                    this.Jt();
                    if (this.$initiator !== this) {
                        this.parent.jt();
                    }
                })).catch((t => {
                    this.zt(t);
                }));
                ys = void 0;
                return;
            }
            ys = void 0;
            this.state = cs;
            this.Jt();
        }
        if (this.$initiator !== this) {
            this.parent.jt();
        }
    }
    Qt() {
        ++this.Pt;
    }
    Zt() {
        if (--this.Pt === 0) {
            this.ee();
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
                if (t.Tt) {
                    if (t.vmKind !== ls && t.St.unbinding != null) {
                        e = w(...t.St.unbinding.map(callUnbindingHook, t));
                    }
                    if (t.Rt.ie) {
                        if (t.debug) {
                            t.logger.trace("unbinding()");
                        }
                        e = w(e, t.viewModel.unbinding(t.$initiator, t.parent));
                    }
                }
                if (isPromise(e)) {
                    this.Wt();
                    this.ee();
                    e.then((() => {
                        this.se();
                    })).catch((t => {
                        this.zt(t);
                    }));
                }
                e = void 0;
                t = t.next;
            }
            this.se();
        }
    }
    ee() {
        ++this.Lt;
    }
    se() {
        if (--this.Lt === 0) {
            let t = this.$initiator.head;
            let e = null;
            while (t !== null) {
                if (t !== this) {
                    t.Tt = false;
                    t.isBound = false;
                    t.unbind();
                }
                e = t.next;
                t.next = null;
                t = e;
            }
            this.head = this.tail = null;
            this.Tt = false;
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
          case os:
            {
                return getAttributeDefinition(this._t.constructor).name === t;
            }

          case rs:
            {
                return getElementDefinition(this._t.constructor).name === t;
            }

          case ls:
            return this.viewFactory.name === t;
        }
    }
    lockScope(t) {
        this.scope = t;
        this.hasLockedScope = true;
    }
    setHost(t) {
        if (this.vmKind === rs) {
            setRef(t, we, this);
            setRef(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = 1;
        return this;
    }
    setShadowRoot(t) {
        if (this.vmKind === rs) {
            setRef(t, we, this);
            setRef(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = 2;
        return this;
    }
    setLocation(t) {
        if (this.vmKind === rs) {
            setRef(t, we, this);
            setRef(t, this.definition.key, this);
        }
        this.location = t;
        this.mountTarget = 3;
        return this;
    }
    release() {
        this.state |= ds;
    }
    dispose() {
        if ((this.state & ms) === ms) {
            return;
        }
        this.state |= ms;
        if (this.Rt.ne) {
            this._t.dispose();
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
        if (this._t !== null) {
            is.delete(this._t);
            this._t = null;
        }
        this._t = null;
        this.host = null;
        this.shadowRoot = null;
        this.container.disposeResolvers();
    }
    accept(t) {
        if (t(this) === true) {
            return true;
        }
        if (this.Rt.re && this._t.accept(t) === true) {
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
    const r = ct(n);
    const l = r.length;
    const h = t.container.get($);
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

const ss = new Map;

const getAccessScopeAst = t => {
    let e = ss.get(t);
    if (e == null) {
        e = new z(t, 0);
        ss.set(t, e);
    }
    return e;
};

function createWatchers(t, e, i, s) {
    const n = e.get($);
    const r = e.get(N);
    const l = i.watches;
    const h = t.vmKind === rs ? t.scope : j.create(s, null, true);
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
            f = isString(c) ? r.parse(c, bt) : getAccessScopeAst(c);
            t.addBinding(new ExpressionWatcher(h, e, n, f, u));
        }
    }
}

function isCustomElementController(t) {
    return t instanceof Controller && t.vmKind === rs;
}

function isCustomElementViewModel(t) {
    return I(t) && isElementType(t.constructor);
}

class HooksDefinition {
    constructor(t) {
        this.qt = "define" in t;
        this.Ht = "hydrating" in t;
        this.Ot = "hydrated" in t;
        this.Vt = "created" in t;
        this.$t = "binding" in t;
        this.Ut = "bound" in t;
        this.Xt = "attaching" in t;
        this.te = "attached" in t;
        this.Yt = "detaching" in t;
        this.ie = "unbinding" in t;
        this.ne = "dispose" in t;
        this.re = "accept" in t;
    }
}

HooksDefinition.none = new HooksDefinition({});

const ns = {
    mode: "open"
};

const rs = "customElement";

const os = "customAttribute";

const ls = "synthetic";

const hs = 0;

const as = 1;

const cs = 2;

const us = 4;

const fs = 8;

const ds = 16;

const ms = 32;

const gs = /*@__PURE__*/ ht({
    none: hs,
    activating: as,
    activated: cs,
    deactivating: us,
    deactivated: fs,
    released: ds,
    disposed: ms
});

function stringifyState(t) {
    const e = [];
    if ((t & as) === as) {
        e.push("activating");
    }
    if ((t & cs) === cs) {
        e.push("activated");
    }
    if ((t & us) === us) {
        e.push("deactivating");
    }
    if ((t & fs) === fs) {
        e.push("deactivated");
    }
    if ((t & ds) === ds) {
        e.push("released");
    }
    if ((t & ms) === ms) {
        e.push("disposed");
    }
    return e.length === 0 ? "none" : e.join("|");
}

const ps = /*@__PURE__*/ Wt("IController");

const vs = /*@__PURE__*/ Wt("IHydrationContext");

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
    t.instance.created(this._t, this);
}

function callHydratingHook(t) {
    t.instance.hydrating(this._t, this);
}

function callHydratedHook(t) {
    t.instance.hydrated(this._t, this);
}

function callBindingHook(t) {
    return t.instance.binding(this._t, this["$initiator"], this.parent);
}

function callBoundHook(t) {
    return t.instance.bound(this._t, this["$initiator"], this.parent);
}

function callAttachingHook(t) {
    return t.instance.attaching(this._t, this["$initiator"], this.parent);
}

function callAttachedHook(t) {
    return t.instance.attached(this._t, this["$initiator"]);
}

function callDetachingHook(t) {
    return t.instance.detaching(this._t, this["$initiator"], this.parent);
}

function callUnbindingHook(t) {
    return t.instance.unbinding(this._t, this["$initiator"], this.parent);
}

let bs;

let xs;

let ys;

const ws = /*@__PURE__*/ Wt("IAppRoot");

class AppRoot {
    constructor(t, e, i, s) {
        this.config = t;
        this.platform = e;
        this.container = i;
        this.oe = void 0;
        this.host = t.host;
        s.prepare(this);
        registerHostNode(i, e, t.host);
        this.oe = k(this.le("creating"), (() => {
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
            return k(this.le("hydrating"), (() => {
                l.hS(null);
                return k(this.le("hydrated"), (() => {
                    l.hC();
                    this.oe = void 0;
                }));
            }));
        }));
    }
    activate() {
        return k(this.oe, (() => k(this.le("activating"), (() => k(this.controller.activate(this.controller, null, void 0), (() => this.le("activated")))))));
    }
    deactivate() {
        return k(this.le("deactivating"), (() => k(this.controller.deactivate(this.controller, null), (() => this.le("deactivated")))));
    }
    le(t) {
        return w(...this.container.getAll(ee).reduce(((e, i) => {
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

const ks = /*@__PURE__*/ Wt("IAurelia");

class Aurelia {
    get isRunning() {
        return this.ir;
    }
    get isStarting() {
        return this.he;
    }
    get isStopping() {
        return this.ae;
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
        this.he = false;
        this.ae = false;
        this.ce = void 0;
        this.next = void 0;
        this.ue = void 0;
        this.fe = void 0;
        if (t.has(ks, true) || t.has(Aurelia, true)) {
            throw createMappedError(768);
        }
        registerResolver(t, ks, new d("IAurelia", this));
        registerResolver(t, Aurelia, new d("Aurelia", this));
        registerResolver(t, ws, this.de = new d("IAppRoot"));
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
        registerResolver(i, re, new d("IEventTarget", s));
        e = e ?? null;
        const h = Controller.$el(i, l, s, null, CustomElementDefinition.create({
            name: ke(),
            template: s,
            enhance: true
        }));
        return k(h.activate(h, e), (() => h));
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
        return this.ue = k(this.stop(), (() => {
            Reflect.set(t.host, "$aurelia", this);
            this.de.prepare(this.ce = t);
            this.he = true;
            return k(t.activate(), (() => {
                this.ir = true;
                this.he = false;
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
            this.ae = true;
            return this.fe = k(e.deactivate(), (() => {
                Reflect.deleteProperty(e.host, "$aurelia");
                if (t) {
                    e.dispose();
                }
                this.ce = void 0;
                this.de.dispose();
                this.ae = false;
                this.ge(e, "au-stopped", e.host);
            }));
        }
    }
    dispose() {
        if (this.ir || this.ae) {
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
                this.has = this.ye;
                break;

              default:
                this.has = this.we;
            }
        }
    }
    equals(t) {
        return this.chars === t.chars && this.repeat === t.repeat && this.isSymbol === t.isSymbol && this.isInverted === t.isInverted;
    }
    we(t) {
        return this.chars.includes(t);
    }
    ye(t) {
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
        let h = 0;
        let a = 0;
        for (;h < n; ++h) {
            l = s[h];
            if (l.charSpec.has(t)) {
                i.push(l);
                r = l.Se.length;
                a = 0;
                if (l.charSpec.isSymbol) {
                    for (;a < r; ++a) {
                        e.next(l.Se[a]);
                    }
                } else {
                    for (;a < r; ++a) {
                        e.append(l.Se[a], t);
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

const Cs = /*@__PURE__*/ Wt("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

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
        let h;
        let a;
        let c = 0;
        let u;
        while (e > c) {
            i = this.Pe;
            s = t[c];
            n = s.pattern;
            r = new SegmentTypes;
            l = this.Me(s, r);
            h = l.length;
            a = t => i = i.append(t, n);
            for (u = 0; h > u; ++u) {
                l[u].eachChar(a);
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

const As = /*@__PURE__*/ Wt("IAttributePattern");

const Bs = /*@__PURE__*/ Wt("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor(t, e) {
        this.ot = {};
        this.qe = t;
        const i = this.Se = {};
        const s = e.reduce(((t, e) => {
            const s = getAllPatternDefinitions(e.constructor);
            s.forEach((t => i[t.pattern] = e));
            return t.concat(s);
        }), f);
        t.add(s);
    }
    parse(t, e) {
        let i = this.ot[t];
        if (i == null) {
            i = this.ot[t] = this.qe.interpret(t);
        }
        const s = i.pattern;
        if (s == null) {
            return new AttrSyntax(t, e, t, null, null);
        } else {
            return this.Se[s][s](t, e, i.parts);
        }
    }
}

AttributeParser.inject = [ Cs, x(As) ];

function attributePattern(...t) {
    return function decorator(e) {
        return Rs.define(t, e);
    };
}

class AttributePatternResourceDefinition {
    constructor(t) {
        this.Type = t;
        this.name = void 0;
    }
    register(t) {
        jt(As, this.Type).register(t);
    }
}

const Ss = qt("attribute-pattern");

const _s = "attribute-pattern-definitions";

const getAllPatternDefinitions = e => t.annotation.get(e, _s);

const Rs = ht({
    name: Ss,
    definitionAnnotationKey: _s,
    define(e, i) {
        const s = new AttributePatternResourceDefinition(i);
        Pt(Ss, s, i);
        Ht(i, Ss);
        t.annotation.set(i, _s, e);
        Ft(i, _s);
        return i;
    },
    getPatternDefinitions: getAllPatternDefinitions
});

let Ts = class DotSeparatedAttributePattern {
    "PART.PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], i[1]);
    }
    "PART.PART.PART"(t, e, i) {
        return new AttrSyntax(t, e, `${i[0]}.${i[1]}`, i[2]);
    }
};

Ts = __decorate([ attributePattern({
    pattern: "PART.PART",
    symbols: "."
}, {
    pattern: "PART.PART.PART",
    symbols: "."
}) ], Ts);

let Is = class RefAttributePattern {
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

Is = __decorate([ attributePattern({
    pattern: "ref",
    symbols: ""
}, {
    pattern: "PART.ref",
    symbols: "."
}) ], Is);

let Es = class EventAttributePattern {
    "PART.trigger:PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "trigger", i);
    }
    "PART.capture:PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "capture", i);
    }
};

Es = __decorate([ attributePattern({
    pattern: "PART.trigger:PART",
    symbols: ".:"
}, {
    pattern: "PART.capture:PART",
    symbols: ".:"
}) ], Es);

let Ps = class ColonPrefixedBindAttributePattern {
    ":PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "bind");
    }
};

Ps = __decorate([ attributePattern({
    pattern: ":PART",
    symbols: ":"
}) ], Ps);

let Ls = class AtPrefixedTriggerAttributePattern {
    "@PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "trigger");
    }
    "@PART:PART"(t, e, i) {
        i.splice(1, 0, "trigger");
        return new AttrSyntax(t, e, i[0], "trigger", i);
    }
};

Ls = __decorate([ attributePattern({
    pattern: "@PART",
    symbols: "@"
}, {
    pattern: "@PART:PART",
    symbols: "@:"
}) ], Ls);

let Ms = class SpreadAttributePattern {
    "...$attrs"(t, e, i) {
        return new AttrSyntax(t, e, "", "...$attrs");
    }
};

Ms = __decorate([ attributePattern({
    pattern: "...$attrs",
    symbols: ""
}) ], Ms);

const Ds = "None";

const qs = "IgnoreAttr";

function bindingCommand(t) {
    return function(e) {
        return Fs.define(t, e);
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
        return new BindingCommandDefinition(e, h(getCommandAnnotation(e, "name"), i), a(getCommandAnnotation(e, "aliases"), s.aliases, e.aliases), getCommandKeyFrom(i), h(getCommandAnnotation(e, "type"), s.type, e.type, null));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        jt(i, e).register(t);
        zt(i, e).register(t);
        registerAliases(s, Fs, i, t);
    }
}

const Hs = /*@__PURE__*/ qt("binding-command");

const getCommandKeyFrom = t => `${Hs}:${t}`;

const getCommandAnnotation = (t, e) => It(Dt(e), t);

const Fs = ht({
    name: Hs,
    keyFrom: getCommandKeyFrom,
    define(t, e) {
        const i = BindingCommandDefinition.create(t, e);
        Pt(Hs, i, i.Type);
        Pt(Hs, i, i);
        Ht(e, Hs);
        return i.Type;
    },
    getAnnotation: getCommandAnnotation
});

let Os = class OneTimeBindingCommand {
    get type() {
        return Ds;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = t.attr.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? C(n);
        } else {
            if (r === "" && t.def.type === fe) {
                r = C(n);
            }
            n = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, bt), n, At);
    }
};

Os = __decorate([ bindingCommand("one-time") ], Os);

let Vs = class ToViewBindingCommand {
    get type() {
        return Ds;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = t.attr.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? C(n);
        } else {
            if (r === "" && t.def.type === fe) {
                r = C(n);
            }
            n = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, bt), n, Bt);
    }
};

Vs = __decorate([ bindingCommand("to-view") ], Vs);

let Ns = class FromViewBindingCommand {
    get type() {
        return Ds;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = s.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? C(n);
        } else {
            if (r === "" && t.def.type === fe) {
                r = C(n);
            }
            n = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, bt), n, St);
    }
};

Ns = __decorate([ bindingCommand("from-view") ], Ns);

let $s = class TwoWayBindingCommand {
    get type() {
        return Ds;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = s.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? C(n);
        } else {
            if (r === "" && t.def.type === fe) {
                r = C(n);
            }
            n = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, bt), n, _t);
    }
};

$s = __decorate([ bindingCommand("two-way") ], $s);

let Ws = class DefaultBindingCommand {
    get type() {
        return Ds;
    }
    build(t, e, i) {
        const s = t.attr;
        const n = t.bindable;
        let r;
        let l;
        let h = s.target;
        let a = s.rawValue;
        if (n == null) {
            l = i.isTwoWay(t.node, h) ? _t : Bt;
            h = i.map(t.node, h) ?? C(h);
        } else {
            if (a === "" && t.def.type === fe) {
                a = C(h);
            }
            r = t.def.defaultBindingMode;
            l = n.mode === Rt || n.mode == null ? r == null || r === Rt ? Bt : r : n.mode;
            h = n.name;
        }
        return new PropertyBindingInstruction(e.parse(a, bt), h, l);
    }
};

Ws = __decorate([ bindingCommand("bind") ], Ws);

let js = class ForBindingCommand {
    get type() {
        return Ds;
    }
    static get inject() {
        return [ Bs ];
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

js = __decorate([ bindingCommand("for") ], js);

let zs = class TriggerBindingCommand {
    get type() {
        return qs;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, vt), t.attr.target, true, false, t.attr.parts?.[2] ?? null);
    }
};

zs = __decorate([ bindingCommand("trigger") ], zs);

let Us = class CaptureBindingCommand {
    get type() {
        return qs;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, vt), t.attr.target, false, true, t.attr.parts?.[2] ?? null);
    }
};

Us = __decorate([ bindingCommand("capture") ], Us);

let Gs = class AttrBindingCommand {
    get type() {
        return qs;
    }
    build(t, e) {
        return new AttributeBindingInstruction(t.attr.target, e.parse(t.attr.rawValue, bt), t.attr.target);
    }
};

Gs = __decorate([ bindingCommand("attr") ], Gs);

let Ks = class StyleBindingCommand {
    get type() {
        return qs;
    }
    build(t, e) {
        return new AttributeBindingInstruction("style", e.parse(t.attr.rawValue, bt), t.attr.target);
    }
};

Ks = __decorate([ bindingCommand("style") ], Ks);

let Xs = class ClassBindingCommand {
    get type() {
        return qs;
    }
    build(t, e) {
        return new AttributeBindingInstruction("class", e.parse(t.attr.rawValue, bt), t.attr.target);
    }
};

Xs = __decorate([ bindingCommand("class") ], Xs);

let Qs = class RefBindingCommand {
    get type() {
        return qs;
    }
    build(t, e) {
        return new RefBindingInstruction(e.parse(t.attr.rawValue, bt), t.attr.target);
    }
};

Qs = __decorate([ bindingCommand("ref") ], Qs);

let Ys = class SpreadBindingCommand {
    get type() {
        return qs;
    }
    build(t) {
        return new SpreadBindingInstruction;
    }
};

Ys = __decorate([ bindingCommand("...$attrs") ], Ys);

const Zs = /*@__PURE__*/ Wt("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

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
        return jt(Zs, this).register(t);
    }
    constructor(t) {
        this.Fe = at(createLookup(), {
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

SVGAnalyzer.inject = [ se ];

const Js = /*@__PURE__*/ Wt("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    constructor() {
        this.fns = [];
        this.Ne = createLookup();
        this.$e = createLookup();
        this.svg = c(Zs);
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
            s = (e = this.Ne)[n] ?? (e[n] = createLookup());
            for (r in i) {
                if (s[r] !== void 0) {
                    throw createError(r, n);
                }
                s[r] = i[r];
            }
        }
    }
    useGlobalMapping(t) {
        const e = this.$e;
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
        return this.Ne[t.nodeName]?.[e] ?? this.$e[e] ?? (isDataAttribute(t, e, this.svg) ? e : null);
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

const tn = createLookup();

class AttributeNSAccessor {
    static forNs(t) {
        return tn[t] ?? (tn[t] = new AttributeNSAccessor(t));
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

const en = new DataAttributeAccessor;

const sn = {
    childList: true,
    subtree: true,
    characterData: true
};

function defaultMatcher$1(t, e) {
    return t === e;
}

class SelectValueObserver {
    constructor(t, e, i, s) {
        this.type = kt | wt | Ct;
        this.v = void 0;
        this.ov = void 0;
        this.We = false;
        this.je = void 0;
        this.ze = void 0;
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
        this.We = t !== this.ov;
        this.Ue(t instanceof Array ? t : null);
        this.O();
    }
    O() {
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
        const e = this.P;
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
                    h.push(lt.call(r, "model") ? r.model : r.value);
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
                r = lt.call(l, "model") ? l.model : l.value;
                break;
            }
            ++n;
        }
        this.ov = this.v;
        this.v = r;
        return true;
    }
    M() {
        (this.ze = createMutationObserver(this.P, this.Ge.bind(this))).observe(this.P, sn);
        this.Ue(this.v instanceof Array ? this.v : null);
        this.iO = true;
    }
    q() {
        this.ze.disconnect();
        this.je?.unsubscribe(this);
        this.ze = this.je = void 0;
        this.iO = false;
    }
    Ue(t) {
        this.je?.unsubscribe(this);
        this.je = void 0;
        if (t != null) {
            if (!this.P.multiple) {
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
        nn = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, nn);
    }
}

mixinNodeObserverUseConfig(SelectValueObserver);

V(SelectValueObserver);

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

let nn = void 0;

const rn = "--";

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
        this.O();
    }
    Xe(t) {
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
                if (s.startsWith(rn)) {
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
    O() {
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
        this.type = kt | wt | Ct;
        this.v = "";
        this.ov = "";
        this.We = false;
        this.L = false;
        this.P = t;
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
            this.O();
        }
    }
    O() {
        if (this.We) {
            this.We = false;
            this.P[this.k] = this.v ?? this.cf.default;
            this.Ke();
        }
    }
    handleEvent() {
        this.ov = this.v;
        this.v = this.P[this.k];
        if (this.ov !== this.v) {
            this.We = false;
            this.Ke();
        }
    }
    M() {
        this.v = this.ov = this.P[this.k];
    }
    Ke() {
        on = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, on);
    }
}

mixinNodeObserverUseConfig(ValueAttributeObserver);

V(ValueAttributeObserver);

let on = void 0;

const ln = "http://www.w3.org/1999/xlink";

const hn = "http://www.w3.org/XML/1998/namespace";

const an = "http://www.w3.org/2000/xmlns/";

const cn = at(createLookup(), {
    "xlink:actuate": [ "actuate", ln ],
    "xlink:arcrole": [ "arcrole", ln ],
    "xlink:href": [ "href", ln ],
    "xlink:role": [ "role", ln ],
    "xlink:show": [ "show", ln ],
    "xlink:title": [ "title", ln ],
    "xlink:type": [ "type", ln ],
    "xml:lang": [ "lang", hn ],
    "xml:space": [ "space", hn ],
    xmlns: [ "xmlns", an ],
    "xmlns:xlink": [ "xlink", an ]
});

const un = new U;

un.type = kt | Ct;

class NodeObserverLocator {
    constructor() {
        this.allowDirtyCheck = true;
        this.Je = createLookup();
        this.ti = createLookup();
        this.ei = createLookup();
        this.ii = createLookup();
        this.si = c(A);
        this.p = c(se);
        this.ni = c(G);
        this.svg = c(Zs);
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
        zt(K, NodeObserverLocator).register(t);
        jt(K, NodeObserverLocator).register(t);
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
            return en;

          default:
            {
                const i = cn[e];
                if (i !== undefined) {
                    return AttributeNSAccessor.forNs(i[1]);
                }
                if (isDataAttribute(t, e, this.svg)) {
                    return en;
                }
                return un;
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
        const n = cn[e];
        if (n !== undefined) {
            return AttributeNSAccessor.forNs(n[1]);
        }
        if (isDataAttribute(t, e, this.svg)) {
            return en;
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

NodeObserverLocator.inject = [ A, se, G, Zs ];

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
        this.type = kt | wt | Ct;
        this.v = void 0;
        this.ov = void 0;
        this.ri = void 0;
        this.oi = void 0;
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
        this.li();
        this.hi();
        this.Ke();
    }
    handleCollectionChange() {
        this.hi();
    }
    handleChange(t, e) {
        this.hi();
    }
    hi() {
        const t = this.v;
        const e = this.P;
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
        const e = this.P;
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
    M() {
        this.li();
    }
    q() {
        this.ri?.unsubscribe(this);
        this.oi?.unsubscribe(this);
        this.ri = this.oi = void 0;
    }
    Ke() {
        dn = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, dn);
    }
    li() {
        const t = this.P;
        (this.oi ?? (this.oi = t.$observers?.model ?? t.$observers?.value))?.subscribe(this);
        this.ri?.unsubscribe(this);
        this.ri = void 0;
        if (t.type === "checkbox") {
            (this.ri = getCollectionObserver(this.v, this.oL))?.subscribe(this);
        }
    }
}

mixinNodeObserverUseConfig(CheckedObserver);

V(CheckedObserver);

let dn = void 0;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) {
            throw createMappedError(9994, e);
        }
        e.useTargetObserver(en);
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
        this.oL = c($);
        this.ai = c(K);
    }
    bind(t, e, ...i) {
        if (!(this.ai instanceof NodeObserverLocator)) {
            throw createMappedError(9993);
        }
        if (i.length === 0) {
            throw createMappedError(802);
        }
        if (!(e instanceof PropertyBinding) || !(e.mode & St)) {
            throw createMappedError(803);
        }
        const s = this.ai.getNodeObserverConfig(e.target, e.targetProperty);
        if (s == null) {
            throw createMappedError(9992, e);
        }
        const n = this.ai.getNodeObserver(e.target, e.targetProperty, this.oL);
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
        this.di = c(Ze);
        this.l = c(oe);
    }
    attaching(t, e) {
        return this.mi(this.value);
    }
    detaching(t, e) {
        this.ui = true;
        return k(this.pending, (() => {
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
        return k(this.pending, (() => this.pending = k(e?.deactivate(e, i), (() => {
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
        this.f = c(Ze);
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

const mn = [ "BindingBehavior", "ValueConverter" ];

class Repeat {
    constructor(t, e, i, s, n) {
        this.views = [];
        this.gi = [];
        this.key = null;
        this.pi = new Map;
        this.vi = new Map;
        this.bi = void 0;
        this.xi = false;
        this.yi = false;
        this.wi = null;
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
                while (t != null && mn.includes(t.$kind)) {
                    t = t.expression;
                    this.xi = true;
                }
                this.wi = t;
                break;
            }
        }
        this.Si();
        const h = r.declaration;
        if (!(this.Ci = h.$kind === "ArrayDestructuring" || h.$kind === "ObjectDestructuring")) {
            this.local = L(h, this.$controller.scope, n, null);
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
            if (this.yi) {
                return;
            }
            this.yi = true;
            this.items = L(this.forOf.iterable, i.scope, this.Bi, null);
            this.yi = false;
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
            const h = l.length;
            const a = this.forOf;
            const c = a.declaration;
            const u = this.Bi;
            const f = this.Ci;
            e = Y(h);
            let d = 0;
            if (s === 0) {
                for (;d < h; ++d) {
                    e[d] = -2;
                }
            } else if (h === 0) {
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
                const y = s - 1;
                const w = h - 1;
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
                        if (d > y || d > w) {
                            break t;
                        }
                    }
                    if (y !== w) {
                        break t;
                    }
                    x = w;
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
                for (d = R; d <= w; ++d) {
                    if (A.has(p = r ? l[d] : ensureUnique(l[d], d))) {
                        b = A.get(p);
                    } else {
                        b = r ? getKeyValue(A, n, p, getScope(B, p, a, S, u, t, f), u) : p;
                        A.set(p, b);
                    }
                    C.set(b, d);
                }
                for (d = _; d <= y; ++d) {
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
                for (d = R; d <= w; ++d) {
                    if (!k.has(A.get(r ? l[d] : ensureUnique(l[d], d)))) {
                        e[d] = -2;
                    }
                }
                k.clear();
                C.clear();
            }
        }
        if (e === void 0) {
            const t = k(this.Ti(null), (() => this.Ri(null)));
            if (isPromise(t)) {
                t.catch(rethrow);
            }
        } else {
            if (e.deletedIndices.length > 0) {
                const t = k(this.Ei(e), (() => this.Pi(s, e)));
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
            e = this.Li = L(this.wi, t, this.Bi, null) ?? null;
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
        const {$controller: r, f: l, local: h, l: a, items: c, vi: u, Bi: f, forOf: d, Ci: m} = this;
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
    Ti(t) {
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
    Ei(t) {
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
    Pi(t, e) {
        let i = void 0;
        let s;
        let n;
        let r;
        let l = 0;
        const {$controller: h, f: a, local: c, ki: u, l: f, views: d, Ci: m, Bi: g, vi: p, gi: v, forOf: b} = this;
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
        const y = h.scope;
        const w = e.length;
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
        l = w - 1;
        for (;l >= 0; --l) {
            n = d[l];
            S = d[l + 1];
            n.nodes.link(S?.nodes ?? f);
            if (e[l] === -2) {
                r = getScope(p, u[l], b, y, g, c, m);
                setContextualProperties(r.overrideContext, l, w);
                n.setLocation(f);
                s = n.activate(n, h, r);
                if (isPromise(s)) {
                    (i ?? (i = [])).push(s);
                }
            } else if (_ < 0 || A === 1 || l !== C[_]) {
                if (m) {
                    O(B, n.scope, g, u[l]);
                } else {
                    n.scope.bindingContext[c] = u[l];
                }
                setContextualProperties(n.scope.overrideContext, l, w);
                n.nodes.insertBefore(n.location);
            } else {
                if (m) {
                    O(B, n.scope, g, u[l]);
                } else {
                    n.scope.bindingContext[c] = u[l];
                }
                if (t !== w) {
                    setContextualProperties(n.scope.overrideContext, l, w);
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

Repeat.inject = [ Bi, N, oe, ps, Ze ];

__decorate([ bindable ], Repeat.prototype, "items", void 0);

templateController("repeat")(Repeat);

let gn = 16;

let pn = new Int32Array(gn);

let vn = new Int32Array(gn);

function longestIncreasingSubsequence(t) {
    const e = t.length;
    if (e > gn) {
        gn = e;
        pn = new Int32Array(e);
        vn = new Int32Array(e);
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
            l = pn[i];
            n = t[l];
            if (n !== -2 && n < s) {
                vn[r] = l;
                pn[++i] = r;
                continue;
            }
            h = 0;
            a = i;
            while (h < a) {
                c = h + a >> 1;
                n = t[pn[c]];
                if (n !== -2 && n < s) {
                    h = c + 1;
                } else {
                    a = c;
                }
            }
            n = t[pn[h]];
            if (s < n || n === -2) {
                if (h > 0) {
                    vn[r] = pn[h - 1];
                }
                pn[h] = r;
            }
        }
    }
    r = ++i;
    const u = new Int32Array(r);
    s = pn[i - 1];
    while (i-- > 0) {
        u[i] = s;
        s = vn[s];
    }
    while (r-- > 0) pn[r] = 0;
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

const bn = ot.toString;

const getCount = t => {
    switch (bn.call(t)) {
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
    switch (bn.call(t)) {
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
    let h = t.get(e);
    if (h === void 0) {
        if (l) {
            O(i.declaration, h = j.fromParent(s, new J), n, e);
        } else {
            h = j.fromParent(s, new J(r, e));
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
        this.view = c(Ze).create().setLocation(c(oe));
    }
    valueChanged(t, e) {
        const i = this.$controller;
        const s = this.view.bindings;
        let n;
        let r = 0, l = 0;
        if (i.isActive && s != null) {
            n = j.fromParent(i.scope, t === void 0 ? {} : t);
            for (l = s.length; l > r; ++r) {
                s[r].bind(n);
            }
        }
    }
    attaching(t, e) {
        const {$controller: i, value: s} = this;
        const n = j.fromParent(i.scope, s === void 0 ? {} : s);
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

let xn = class Switch {
    constructor() {
        this.cases = [];
        this.activeCases = [];
        this.promise = void 0;
        this.f = c(Ze);
        this.l = c(oe);
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
        return k(this.Di(null, n), (() => {
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
        return k(this.activeCases.length > 0 ? this.Di(t, i) : void 0, (() => {
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
        return w(...i.map((e => e.activate(t, n))));
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
        return k(w(...i.reduce(((i, s) => {
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

__decorate([ bindable ], xn.prototype, "value", void 0);

xn = __decorate([ templateController("switch") ], xn);

let yn = 0;

let wn = class Case {
    constructor() {
        this.id = ++yn;
        this.fallThrough = false;
        this.view = void 0;
        this.f = c(Ze);
        this.si = c($);
        this.l = c(oe);
        this.Hi = c(S).scopeTo(`${this.constructor.name}-#${this.id}`);
    }
    link(t, e, i, s) {
        const n = t.parent;
        const r = n?.viewModel;
        if (r instanceof xn) {
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

__decorate([ bindable ], wn.prototype, "value", void 0);

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
}) ], wn.prototype, "fallThrough", void 0);

wn = __decorate([ templateController("case") ], wn);

let kn = class DefaultCase extends wn {
    linkToSwitch(t) {
        if (t.defaultCase !== void 0) {
            throw createMappedError(816);
        }
        t.defaultCase = this;
    }
};

kn = __decorate([ templateController("default-case") ], kn);

let Cn = class PromiseTemplateController {
    constructor() {
        this.preSettledTask = null;
        this.postSettledTask = null;
        this.f = c(Ze);
        this.l = c(oe);
        this.p = c(se);
        this.logger = c(S).scopeTo("promise.resolve");
    }
    link(t, e, i, s) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(t, e) {
        const i = this.view;
        const s = this.$controller;
        return k(i.activate(t, s, this.viewScope = j.fromParent(s.scope, {})), (() => this.swap(t)));
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
            void w(h = (this.preSettledTask = i.queueTask((() => w(s?.deactivate(t), n?.deactivate(t), r?.activate(t, l))), a)).result.catch((t => {
                if (!(t instanceof st)) throw t;
            })), e.then((c => {
                if (this.value !== e) {
                    return;
                }
                const fulfill = () => {
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => w(r?.deactivate(t), n?.deactivate(t), s?.activate(t, l, c))), a)).result;
                };
                if (this.preSettledTask.status === yt) {
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
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => w(r?.deactivate(t), s?.deactivate(t), n?.activate(t, l, c))), a)).result;
                };
                if (this.preSettledTask.status === yt) {
                    void h.then(reject);
                } else {
                    this.preSettledTask.cancel();
                    reject();
                }
            })));
        };
        if (this.postSettledTask?.status === yt) {
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

__decorate([ bindable ], Cn.prototype, "value", void 0);

Cn = __decorate([ templateController("promise") ], Cn);

let An = class PendingTemplateController {
    constructor() {
        this.view = void 0;
        this.f = c(Ze);
        this.l = c(oe);
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
}) ], An.prototype, "value", void 0);

An = __decorate([ templateController(xt) ], An);

let Bn = class FulfilledTemplateController {
    constructor() {
        this.view = void 0;
        this.f = c(Ze);
        this.l = c(oe);
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
}) ], Bn.prototype, "value", void 0);

Bn = __decorate([ templateController("then") ], Bn);

let Sn = class RejectedTemplateController {
    constructor() {
        this.view = void 0;
        this.f = c(Ze);
        this.l = c(oe);
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
}) ], Sn.prototype, "value", void 0);

Sn = __decorate([ templateController("catch") ], Sn);

function getPromiseController(t) {
    const e = t.parent;
    const i = e?.viewModel;
    if (i instanceof Cn) {
        return i;
    }
    throw createMappedError(813);
}

let _n = class PromiseAttributePattern {
    "promise.resolve"(t, e, i) {
        return new AttrSyntax(t, e, "promise", "bind");
    }
};

_n = __decorate([ attributePattern({
    pattern: "promise.resolve",
    symbols: ""
}) ], _n);

let Rn = class FulfilledAttributePattern {
    then(t, e, i) {
        return new AttrSyntax(t, e, "then", "from-view");
    }
};

Rn = __decorate([ attributePattern({
    pattern: "then",
    symbols: ""
}) ], Rn);

let Tn = class RejectedAttributePattern {
    catch(t, e, i) {
        return new AttrSyntax(t, e, "catch", "from-view");
    }
};

Tn = __decorate([ attributePattern({
    pattern: "catch",
    symbols: ""
}) ], Tn);

class Focus {
    constructor() {
        this.Oi = false;
        this.Vi = c(ne);
        this.p = c(se);
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) {
            this.Ni();
        } else {
            this.Oi = true;
        }
    }
    attached() {
        if (this.Oi) {
            this.Oi = false;
            this.Ni();
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
        } else if (!this.$i) {
            this.value = false;
        }
    }
    Ni() {
        const t = this.Vi;
        const e = this.$i;
        const i = this.value;
        if (i && !e) {
            t.focus();
        } else if (!i && e) {
            t.blur();
        }
    }
    get $i() {
        return this.Vi === this.p.document.activeElement;
    }
}

Focus.inject = [ ne, se ];

__decorate([ bindable({
    mode: _t
}) ], Focus.prototype, "value", void 0);

customAttribute("focus")(Focus);

class Portal {
    constructor() {
        this.position = "beforeend";
        this.strict = false;
        const t = c(Ze);
        const e = c(oe);
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
        const i = k(this.Ki(null, e), (() => {
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
        const i = k(this.Ki(null, e), (() => {
            this.Ui(e, this.position);
            return this.Gi(null, e);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    Gi(t, e) {
        const {activating: i, callbackContext: s, view: n} = this;
        return k(i?.call(s, e, n), (() => this.Xi(t, e)));
    }
    Xi(t, e) {
        const {$controller: i, view: s} = this;
        if (t === null) {
            s.nodes.insertBefore(this.ji);
        } else {
            return k(s.activate(t ?? s, i, i.scope), (() => this.Qi(e)));
        }
        return this.Qi(e);
    }
    Qi(t) {
        const {activated: e, callbackContext: i, view: s} = this;
        return e?.call(i, t, s);
    }
    Ki(t, e) {
        const {deactivating: i, callbackContext: s, view: n} = this;
        return k(i?.call(s, e, n), (() => this.Yi(t, e)));
    }
    Yi(t, e) {
        const {$controller: i, view: s} = this;
        if (t === null) {
            s.nodes.remove();
        } else {
            return k(s.deactivate(t, i), (() => this.Zi(e)));
        }
        return this.Zi(e);
    }
    Zi(t) {
        const {deactivated: e, callbackContext: i, view: s} = this;
        return k(e?.call(i, t, s), (() => this.Ji()));
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

let In = class AuSlot {
    constructor() {
        this.ts = null;
        this.es = null;
        this.te = false;
        this.expose = null;
        this.slotchange = null;
        this.ss = new Set;
        this.bi = null;
        const t = c(vs);
        const e = c(oe);
        const i = c(Bi);
        const s = c(Zi);
        const n = i.auSlot;
        const r = t.instruction?.projections?.[n.name];
        const l = t.controller.container;
        let h;
        let a;
        this.name = n.name;
        if (r == null) {
            a = l.createChild({
                inheritParentResources: true
            });
            h = s.getViewFactory(n.fallback, a);
            this.rs = false;
        } else {
            a = l.createChild();
            a.useResources(t.parent.controller.container);
            registerResolver(a, vs, new d(void 0, t.parent));
            h = s.getViewFactory(r, a);
            this.rs = true;
            this.os = l.getAll(ii, false)?.filter((t => t.slotName === "*" || t.slotName === n.name)) ?? f;
        }
        this.ls = (this.os ?? (this.os = f)).length > 0;
        this.cs = t;
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
            (this.es = j.fromParent(i, i.bindingContext)).overrideContext.$host = this.expose ?? this.ts.bindingContext;
        }
    }
    attaching(t, e) {
        return k(this.view.activate(t, this.$controller, this.rs ? this.es : this.ts), (() => {
            if (this.ls) {
                this.os.forEach((t => t.watch(this)));
                this.li();
                this.us();
                this.te = true;
            }
        }));
    }
    detaching(t, e) {
        this.te = false;
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
        if (this.te) {
            this.slotchange?.call(void 0, this.name, t);
        }
        for (i of e) {
            i.handleSlotChange(this, t);
        }
    }
};

__decorate([ bindable ], In.prototype, "expose", void 0);

__decorate([ bindable ], In.prototype, "slotchange", void 0);

In = __decorate([ customElement({
    name: "au-slot",
    template: null,
    containerless: true
}) ], In);

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
        this.c = c(b);
        this.parent = c(ps);
        this.host = c(ne);
        this.l = c(oe);
        this.p = c(se);
        this.r = c(Zi);
        this.ps = c(Bi);
        this.vs = c(_(CompositionContextFactory));
        this.bt = c(Si);
        this.dt = c(vs);
        this.ep = c(N);
        this.oL = c($);
    }
    get composing() {
        return this.bs;
    }
    get composition() {
        return this.gs;
    }
    attaching(t, e) {
        return this.bs = k(this.queue(new ChangeInfo(this.template, this.component, this.model, void 0), t), (t => {
            if (this.vs.xs(t)) {
                this.bs = void 0;
            }
        }));
    }
    detaching(t) {
        const e = this.gs;
        const i = this.bs;
        this.vs.invalidate();
        this.gs = this.bs = void 0;
        return k(i, (() => e?.deactivate(t)));
    }
    propertyChanged(t) {
        if (t === "composing" || t === "composition") return;
        if (t === "model" && this.gs != null) {
            this.gs.update(this.model);
            return;
        }
        this.bs = k(this.bs, (() => k(this.queue(new ChangeInfo(this.template, this.component, this.model, t), void 0), (t => {
            if (this.vs.xs(t)) {
                this.bs = void 0;
            }
        }))));
    }
    queue(t, e) {
        const i = this.vs;
        const s = this.gs;
        return k(i.create(t), (t => {
            if (i.xs(t)) {
                return k(this.compose(t), (n => {
                    if (i.xs(t)) {
                        return k(n.activate(e), (() => {
                            if (i.xs(t)) {
                                this.gs = n;
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
        let e;
        const {ys: i, ws: s, ks: n} = t.change;
        const {c: r, host: l, $controller: h, l: a, ps: c} = this;
        const u = this.getDef(s);
        const d = r.createChild();
        let m;
        if (u !== null) {
            m = this.p.document.createElement(u.name);
            if (a == null) {
                l.appendChild(m);
            } else {
                a.parentNode.insertBefore(m, a);
            }
            e = this.Cs(d, s, m);
        } else {
            m = a ?? l;
            e = this.Cs(d, s, m);
        }
        const compose = () => {
            if (u !== null) {
                const i = c.captures ?? f;
                const s = u.capture;
                const [n, r] = i.reduce(((t, e) => {
                    const i = !(e.target in u.bindables) && (s === true || isFunction(s) && !!s(e.target));
                    t[i ? 0 : 1].push(e);
                    return t;
                }), [ [], [] ]);
                const l = u.containerless ? convertToRenderLocation(m) : null;
                const a = Controller.$el(d, e, m, {
                    projections: c.projections,
                    captures: n
                }, u, l);
                const g = new HydrationContext(h, {
                    projections: null,
                    captures: r
                }, this.dt.parent);
                const removeCompositionHost = () => {
                    if (l == null) {
                        m.remove();
                    } else {
                        let t = l.$start.nextSibling;
                        let e = null;
                        while (t !== null && t !== l) {
                            e = t.nextSibling;
                            t.remove();
                            t = e;
                        }
                        l.$start?.remove();
                        l.remove();
                    }
                };
                const p = SpreadBinding.create(g, m, u, this.r, this.bt, this.p, this.ep, this.oL);
                p.forEach((t => a.addBinding(t)));
                return new CompositionController(a, (t => a.activate(t ?? a, h, h.scope.parent)), (t => k(a.deactivate(t ?? a, h), removeCompositionHost)), (t => e.activate?.(t)), t);
            } else {
                const s = CustomElementDefinition.create({
                    name: Ae.generateName(),
                    template: i
                });
                const n = this.r.getViewFactory(s, d);
                const r = Controller.$view(n, h);
                const l = this.scopeBehavior === "auto" ? j.fromParent(this.parent.scope, e) : j.create(e);
                if (isRenderLocation(m)) {
                    r.setLocation(m);
                } else {
                    r.setHost(m);
                }
                return new CompositionController(r, (t => r.activate(t ?? r, h, l)), (t => r.deactivate(t ?? r, h)), (t => e.activate?.(t)), t);
            }
        };
        if ("activate" in e) {
            return k(e.activate(n), (() => compose()));
        } else {
            return compose();
        }
    }
    Cs(t, e, i) {
        if (e == null) {
            return new EmptyComponent;
        }
        if (typeof e === "object") {
            return e;
        }
        const s = this.p;
        const n = isRenderLocation(i);
        registerHostNode(t, s, n ? null : i);
        registerResolver(t, oe, new d("IRenderLocation", n ? i : null));
        const r = t.invoke(e);
        registerResolver(t, e, new d("au-compose.component", r));
        return r;
    }
    getDef(t) {
        const e = isFunction(t) ? t : t?.constructor;
        return Ae.isType(e) ? Ae.getDefinition(e) : null;
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

customElement({
    name: "au-compose",
    capture: true
})(AuCompose);

class EmptyComponent {}

class CompositionContextFactory {
    constructor() {
        this.id = 0;
    }
    xs(t) {
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
        this.ys = t;
        this.ws = e;
        this.ks = i;
        this.As = s;
    }
    load() {
        if (isPromise(this.ys) || isPromise(this.ws)) {
            return Promise.all([ this.ys, this.ws ]).then((([t, e]) => new LoadedChangeInfo(t, e, this.ks, this.As)));
        } else {
            return new LoadedChangeInfo(this.ys, this.ws, this.ks, this.As);
        }
    }
}

class LoadedChangeInfo {
    constructor(t, e, i, s) {
        this.ys = t;
        this.ws = e;
        this.ks = i;
        this.As = s;
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

const En = /*@__PURE__*/ Wt("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw createMappedError(99, "sanitize");
    }
})));

class SanitizeValueConverter {
    constructor() {
        this.Bs = c(En);
    }
    toView(t) {
        if (t == null) {
            return null;
        }
        return this.Bs.sanitize(t);
    }
}

valueConverter("sanitize")(SanitizeValueConverter);

const Pn = /*@__PURE__*/ Wt("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const Ln = {};

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
            let e = Ln[t];
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
                Ln[t] = e;
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
        t.register(jt(this, this), zt(this, Si));
    }
    compile(t, e, i) {
        const s = CustomElementDefinition.getOrCreate(t);
        if (s.template === null || s.template === void 0) {
            return s;
        }
        if (s.needsCompile === false) {
            return s;
        }
        i ?? (i = Hn);
        const n = new CompilationContext(t, e, i, null, null, void 0);
        const r = isString(s.template) || !t.enhance ? n.Ss.createTemplate(s.template) : s.template;
        const l = r.nodeName === Mn && r.content != null;
        const h = l ? r.content : r;
        const a = e.get(allResources(zn));
        const c = a.length;
        let u = 0;
        if (c > 0) {
            while (c > u) {
                a[u].compiling?.(r);
                ++u;
            }
        }
        if (r.hasAttribute(jn)) {
            throw createMappedError(701, s);
        }
        this._s(h, n);
        this.Rs(h, n);
        return CustomElementDefinition.create({
            ...t,
            name: t.name || ke(),
            dependencies: (t.dependencies ?? f).concat(n.deps ?? f),
            instructions: n.rows,
            surrogates: l ? this.Ts(r, n) : f,
            template: r,
            hasSlots: n.hasSlot,
            needsCompile: false
        });
    }
    compileSpread(t, e, i, s, n) {
        const r = new CompilationContext(t, i, Hn, null, null, void 0);
        const l = [];
        const h = n ?? r.Is(s.nodeName.toLowerCase());
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
        let y = null;
        let w;
        let k;
        let A;
        let B;
        for (;u > f; ++f) {
            d = e[f];
            A = d.target;
            B = d.rawValue;
            y = r.Es(d);
            if (y !== null && y.type === qs) {
                On.node = s;
                On.attr = d;
                On.bindable = null;
                On.def = null;
                l.push(y.build(On, r.ep, r.m));
                continue;
            }
            m = r.Ps(A);
            if (m !== null) {
                if (m.isTemplateController) {
                    throw createMappedError(9998, A);
                }
                v = BindablesInfo.from(m, true);
                k = m.noMultiBindings === false && y === null && hasInlineBindings(B);
                if (k) {
                    p = this.Ls(s, B, m, r);
                } else {
                    x = v.primary;
                    if (y === null) {
                        w = c.parse(B, gt);
                        p = [ w === null ? new SetPropertyInstruction(B, x.name) : new InterpolationInstruction(w, x.name) ];
                    } else {
                        On.node = s;
                        On.attr = d;
                        On.bindable = x;
                        On.def = m;
                        p = [ y.build(On, r.ep, r.m) ];
                    }
                }
                (g ?? (g = [])).push(new HydrateAttributeInstruction(this.resolveResources ? m : m.name, m.aliases != null && m.aliases.includes(A) ? A : void 0, p));
                continue;
            }
            if (y === null) {
                w = c.parse(B, gt);
                if (a) {
                    v = BindablesInfo.from(h, false);
                    b = v.attrs[A];
                    if (b !== void 0) {
                        w = c.parse(B, gt);
                        l.push(new SpreadElementPropBindingInstruction(w == null ? new SetPropertyInstruction(B, b.name) : new InterpolationInstruction(w, b.name)));
                        continue;
                    }
                }
                if (w != null) {
                    l.push(new InterpolationInstruction(w, r.m.map(s, A) ?? C(A)));
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
                if (a) {
                    v = BindablesInfo.from(h, false);
                    b = v.attrs[A];
                    if (b !== void 0) {
                        On.node = s;
                        On.attr = d;
                        On.bindable = b;
                        On.def = h;
                        l.push(new SpreadElementPropBindingInstruction(y.build(On, r.ep, r.m)));
                        continue;
                    }
                }
                On.node = s;
                On.attr = d;
                On.bindable = null;
                On.def = null;
                l.push(y.build(On, r.ep, r.m));
            }
        }
        resetCommandBuildInfo();
        if (g != null) {
            return g.concat(l);
        }
        return l;
    }
    Ts(t, e) {
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
        let y;
        let w;
        for (;r > l; ++l) {
            h = s[l];
            a = h.name;
            c = h.value;
            u = e.He.parse(a, c);
            y = u.target;
            w = u.rawValue;
            if (Vn[y]) {
                throw createMappedError(702, a);
            }
            v = e.Es(u);
            if (v !== null && v.type === qs) {
                On.node = t;
                On.attr = u;
                On.bindable = null;
                On.def = null;
                i.push(v.build(On, e.ep, e.m));
                continue;
            }
            f = e.Ps(y);
            if (f !== null) {
                if (f.isTemplateController) {
                    throw createMappedError(703, y);
                }
                g = BindablesInfo.from(f, true);
                x = f.noMultiBindings === false && v === null && hasInlineBindings(w);
                if (x) {
                    m = this.Ls(t, w, f, e);
                } else {
                    p = g.primary;
                    if (v === null) {
                        b = n.parse(w, gt);
                        m = [ b === null ? new SetPropertyInstruction(w, p.name) : new InterpolationInstruction(b, p.name) ];
                    } else {
                        On.node = t;
                        On.attr = u;
                        On.bindable = p;
                        On.def = f;
                        m = [ v.build(On, e.ep, e.m) ];
                    }
                }
                t.removeAttribute(a);
                --l;
                --r;
                (d ?? (d = [])).push(new HydrateAttributeInstruction(this.resolveResources ? f : f.name, f.aliases != null && f.aliases.includes(y) ? y : void 0, m));
                continue;
            }
            if (v === null) {
                b = n.parse(w, gt);
                if (b != null) {
                    t.removeAttribute(a);
                    --l;
                    --r;
                    i.push(new InterpolationInstruction(b, e.m.map(t, y) ?? C(y)));
                } else {
                    switch (a) {
                      case "class":
                        i.push(new SetClassAttributeInstruction(w));
                        break;

                      case "style":
                        i.push(new SetStyleAttributeInstruction(w));
                        break;

                      default:
                        i.push(new SetAttributeInstruction(w, a));
                    }
                }
            } else {
                On.node = t;
                On.attr = u;
                On.bindable = null;
                On.def = null;
                i.push(v.build(On, e.ep, e.m));
            }
        }
        resetCommandBuildInfo();
        if (d != null) {
            return d.concat(i);
        }
        return i;
    }
    Rs(t, e) {
        switch (t.nodeType) {
          case 1:
            switch (t.nodeName) {
              case "LET":
                return this.Ms(t, e);

              default:
                return this.Ds(t, e);
            }

          case 3:
            return this.qs(t, e);

          case 11:
            {
                let i = t.firstChild;
                while (i !== null) {
                    i = this.Rs(i, e);
                }
                break;
            }
        }
        return t.nextSibling;
    }
    Ms(t, e) {
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
            c = e.He.parse(u, f);
            m = c.target;
            g = c.rawValue;
            d = e.Es(c);
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
        return this.Hs(t, e).nextSibling;
    }
    Ds(t, e) {
        var i, n, r, l;
        const h = t.nextSibling;
        const a = (t.getAttribute("as-element") ?? t.nodeName).toLowerCase();
        const c = e.Is(a);
        const u = c !== null;
        const d = u && c.shadowOptions != null;
        const m = c?.capture;
        const g = m != null && typeof m !== "boolean";
        const p = m ? [] : f;
        const v = e.ep;
        const b = this.debug ? s : () => {
            t.removeAttribute(B);
            --k;
            --w;
        };
        let x = t.attributes;
        let y;
        let w = x.length;
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
        if (u) {
            j = c.processContent?.call(c.Type, t, e.p);
            x = t.attributes;
            w = x.length;
        }
        for (;w > k; ++k) {
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
            O = e.Es(_);
            $ = _.target;
            W = _.rawValue;
            if (m && (!g || g && m($))) {
                if (O != null && O.type === qs) {
                    b();
                    p.push(_);
                    continue;
                }
                U = $ !== Qn && $ !== "slot";
                if (U) {
                    V = BindablesInfo.from(c, false);
                    if (V.attrs[$] == null && !e.Ps($)?.isTemplateController) {
                        b();
                        p.push(_);
                        continue;
                    }
                }
            }
            if (O !== null && O.type === qs) {
                On.node = t;
                On.attr = _;
                On.bindable = null;
                On.def = null;
                (R ?? (R = [])).push(O.build(On, e.ep, e.m));
                b();
                continue;
            }
            I = e.Ps($);
            if (I !== null) {
                V = BindablesInfo.from(I, true);
                E = I.noMultiBindings === false && O === null && hasInlineBindings(W);
                if (E) {
                    M = this.Ls(t, W, I, e);
                } else {
                    N = V.primary;
                    if (O === null) {
                        H = v.parse(W, gt);
                        M = [ H === null ? new SetPropertyInstruction(W, N.name) : new InterpolationInstruction(H, N.name) ];
                    } else {
                        On.node = t;
                        On.attr = _;
                        On.bindable = N;
                        On.def = I;
                        M = [ O.build(On, e.ep, e.m) ];
                    }
                }
                b();
                if (I.isTemplateController) {
                    (D ?? (D = [])).push(new HydrateTemplateController(Fn, this.resolveResources ? I : I.name, void 0, M));
                } else {
                    (L ?? (L = [])).push(new HydrateAttributeInstruction(this.resolveResources ? I : I.name, I.aliases != null && I.aliases.includes($) ? $ : void 0, M));
                }
                continue;
            }
            if (O === null) {
                if (u) {
                    V = BindablesInfo.from(c, false);
                    P = V.attrs[$];
                    if (P !== void 0) {
                        H = v.parse(W, gt);
                        (T ?? (T = [])).push(H == null ? new SetPropertyInstruction(W, P.name) : new InterpolationInstruction(H, P.name));
                        b();
                        continue;
                    }
                }
                H = v.parse(W, gt);
                if (H != null) {
                    b();
                    (R ?? (R = [])).push(new InterpolationInstruction(H, e.m.map(t, $) ?? C($)));
                }
                continue;
            }
            b();
            if (u) {
                V = BindablesInfo.from(c, false);
                P = V.attrs[$];
                if (P !== void 0) {
                    On.node = t;
                    On.attr = _;
                    On.bindable = P;
                    On.def = c;
                    (T ?? (T = [])).push(O.build(On, e.ep, e.m));
                    continue;
                }
            }
            On.node = t;
            On.attr = _;
            On.bindable = null;
            On.def = null;
            (R ?? (R = [])).push(O.build(On, e.ep, e.m));
        }
        resetCommandBuildInfo();
        if (this.Fs(t, R) && R != null && R.length > 1) {
            this.Os(t, R);
        }
        if (u) {
            F = new HydrateElementInstruction(this.resolveResources ? c : c.name, void 0, T ?? f, null, z, p);
            if (a === Qn) {
                const i = t.getAttribute("name") || Xn;
                const s = e.t();
                const n = e.Vs();
                let r = t.firstChild;
                let l = 0;
                while (r !== null) {
                    if (isElement(r) && r.hasAttribute(Qn)) {
                        t.removeChild(r);
                    } else {
                        appendToTemplate(s, r);
                        l++;
                    }
                    r = t.firstChild;
                }
                if (l > 0) {
                    this.Rs(s.content, n);
                }
                F.auSlot = {
                    name: i,
                    fallback: CustomElementDefinition.create({
                        name: ke(),
                        template: s,
                        instructions: n.rows,
                        needsCompile: false
                    })
                };
            }
        }
        if (R != null || F != null || L != null) {
            y = f.concat(F ?? f, L ?? f, R ?? f);
            G = true;
        }
        let K;
        if (D != null) {
            w = D.length - 1;
            k = w;
            q = D[k];
            let s;
            if (isMarker(t)) {
                s = e.t();
                appendManyToTemplate(s, [ e.Bt(), e.Ns(Dn), e.Ns(qn) ]);
            } else {
                this.$s(t, e);
                if (t.nodeName === "TEMPLATE") {
                    s = t;
                } else {
                    s = e.t();
                    appendToTemplate(s, t);
                }
            }
            const r = s;
            const l = e.Vs(y == null ? [] : [ y ]);
            let h;
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
                    f = isElement(S) ? S.getAttribute(Qn) : null;
                    m = f !== null || u && !d;
                    h = S.nextSibling;
                    if (m) {
                        if (!u) {
                            throw createMappedError(706, f, a);
                        }
                        S.removeAttribute?.(Qn);
                        _ = isTextNode(S) && S.textContent.trim() === "";
                        if (!_) {
                            ((i = p ?? (p = {}))[n = f || Xn] ?? (i[n] = [])).push(S);
                        }
                        t.removeChild(S);
                    }
                    S = h;
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
                    C = e.Vs();
                    this.Rs(s.content, C);
                    g[f] = CustomElementDefinition.create({
                        name: ke(),
                        template: s,
                        instructions: C.rows,
                        needsCompile: false
                    });
                }
                F.projections = g;
            }
            if (G) {
                if (u && (z || c.containerless)) {
                    this.$s(t, e);
                } else {
                    this.Hs(t, e);
                }
            }
            K = !u || !c.containerless && !z && j !== false;
            if (K) {
                if (t.nodeName === Mn) {
                    this.Rs(t.content, l);
                } else {
                    S = t.firstChild;
                    while (S !== null) {
                        S = this.Rs(S, l);
                    }
                }
            }
            q.def = CustomElementDefinition.create({
                name: ke(),
                template: r,
                instructions: l.rows,
                needsCompile: false
            });
            while (k-- > 0) {
                q = D[k];
                s = e.t();
                x = e.Bt();
                appendManyToTemplate(s, [ x, e.Ns(Dn), e.Ns(qn) ]);
                q.def = CustomElementDefinition.create({
                    name: ke(),
                    template: s,
                    needsCompile: false,
                    instructions: [ [ D[k + 1] ] ]
                });
            }
            e.rows.push([ q ]);
        } else {
            if (y != null) {
                e.rows.push(y);
            }
            let i = t.firstChild;
            let s;
            let n;
            let h = false;
            let f = null;
            let m;
            let g;
            let p;
            let v;
            let b;
            let x = false;
            let w = 0, k = 0;
            if (j !== false) {
                while (i !== null) {
                    n = isElement(i) ? i.getAttribute(Qn) : null;
                    h = n !== null || u && !d;
                    s = i.nextSibling;
                    if (h) {
                        if (!u) {
                            throw createMappedError(706, n, a);
                        }
                        i.removeAttribute?.(Qn);
                        x = isTextNode(i) && i.textContent.trim() === "";
                        if (!x) {
                            ((r = m ?? (m = {}))[l = n || Xn] ?? (r[l] = [])).push(i);
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
                    for (w = 0, k = g.length; k > w; ++w) {
                        p = g[w];
                        if (p.nodeName === Mn) {
                            if (p.attributes.length > 0) {
                                appendToTemplate(v, p);
                            } else {
                                appendToTemplate(v, p.content);
                            }
                        } else {
                            appendToTemplate(v, p);
                        }
                    }
                    b = e.Vs();
                    this.Rs(v.content, b);
                    f[n] = CustomElementDefinition.create({
                        name: ke(),
                        template: v,
                        instructions: b.rows,
                        needsCompile: false
                    });
                }
                F.projections = f;
            }
            if (G) {
                if (u && (z || c.containerless)) {
                    this.$s(t, e);
                } else {
                    this.Hs(t, e);
                }
            }
            K = !u || !c.containerless && !z && j !== false;
            if (K && t.childNodes.length > 0) {
                i = t.firstChild;
                while (i !== null) {
                    i = this.Rs(i, e);
                }
            }
        }
        return h;
    }
    qs(t, e) {
        const i = t.parentNode;
        const s = e.ep.parse(t.textContent, gt);
        const n = t.nextSibling;
        let r;
        let l;
        let h;
        let a;
        let c;
        if (s !== null) {
            ({parts: r, expressions: l} = s);
            if (c = r[0]) {
                insertBefore(i, e.Ws(c), t);
            }
            for (h = 0, a = l.length; a > h; ++h) {
                insertManyBefore(i, t, [ e.Bt(), e.Ws(" ") ]);
                if (c = r[h + 1]) {
                    insertBefore(i, e.Ws(c), t);
                }
                e.rows.push([ new TextBindingInstruction(l[h]) ]);
            }
            i.removeChild(t);
        }
        return n;
    }
    Ls(t, e, i, s) {
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
                d = s.He.parse(h, a);
                m = s.Es(d);
                g = n.attrs[d.target];
                if (g == null) {
                    throw createMappedError(707, d.target, i.name);
                }
                if (m === null) {
                    f = s.ep.parse(a, gt);
                    l.push(f === null ? new SetPropertyInstruction(a, g.name) : new InterpolationInstruction(f, g.name));
                } else {
                    On.node = t;
                    On.attr = d;
                    On.bindable = g;
                    On.def = i;
                    l.push(m.build(On, s.ep, s.m));
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
    _s(t, e) {
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
        const h = [];
        for (const t of n) {
            if (t.parentNode !== s) {
                throw createMappedError(709, i);
            }
            const n = processTemplateName(i, t, l);
            const r = t.content;
            const a = R(r.querySelectorAll("bindable"));
            const c = new Set;
            const u = new Set;
            const f = a.reduce(((t, e) => {
                if (e.parentNode !== r) {
                    throw createMappedError(710, n);
                }
                const i = e.getAttribute("name");
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
                const l = R(e.attributes).filter((t => !Wn.includes(t.name)));
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
            h.push(LocalTemplateType);
            e.js(defineElement({
                name: n,
                template: t,
                bindables: f
            }, LocalTemplateType));
            s.removeChild(t);
        }
        const a = [ ...e.def.dependencies ?? f, ...h ];
        for (const t of h) {
            getElementDefinition(t).dependencies.push(a.filter((e => e !== t)));
        }
    }
    Fs(t, e) {
        const i = t.nodeName;
        return i === "INPUT" && Nn[t.type] === 1 || i === "SELECT" && (t.hasAttribute("multiple") || e?.some((t => t.type === ci && t.to === "multiple")));
    }
    Os(t, e) {
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
    Hs(t, e) {
        insertBefore(t.parentNode, e.Ns("au*"), t);
        return t;
    }
    $s(t, e) {
        if (isMarker(t)) {
            return t;
        }
        const i = t.parentNode;
        const s = e.Bt();
        insertManyBefore(i, t, [ s, e.Ns(Dn), e.Ns(qn) ]);
        i.removeChild(t);
        return s;
    }
}

const Mn = "TEMPLATE";

const Dn = "au-start";

const qn = "au-end";

const isMarker = t => t.nodeValue === "au*";

class CompilationContext {
    constructor(t, e, i, s, n, r) {
        this.hasSlot = false;
        this.zs = createLookup();
        const l = s !== null;
        this.c = e;
        this.root = n === null ? this : n;
        this.def = t;
        this.ci = i;
        this.parent = s;
        this.Ss = l ? s.Ss : e.get(Pn);
        this.He = l ? s.He : e.get(Bs);
        this.ep = l ? s.ep : e.get(N);
        this.m = l ? s.m : e.get(Js);
        this.Hi = l ? s.Hi : e.get(S);
        this.p = l ? s.p : e.get(se);
        this.localEls = l ? s.localEls : new Set;
        this.rows = r ?? [];
    }
    js(t) {
        var e;
        ((e = this.root).deps ?? (e.deps = [])).push(t);
        this.root.c.register(t);
    }
    Ws(t) {
        return createText(this.p, t);
    }
    Ns(t) {
        return createComment(this.p, t);
    }
    Bt() {
        return this.Ns("au*");
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
    Is(t) {
        return this.c.find(Ae, t);
    }
    Ps(t) {
        return this.c.find(ge, t);
    }
    Vs(t) {
        return new CompilationContext(this.def, this.c, this.ci, this, this.root, t);
    }
    Es(t) {
        if (this.root !== this) {
            return this.root.Es(t);
        }
        const e = t.command;
        if (e === null) {
            return null;
        }
        let i = this.zs[e];
        if (i === void 0) {
            i = this.c.create(Fs, e);
            if (i === null) {
                throw createMappedError(713, e);
            }
            this.zs[e] = i;
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
    On.node = On.attr = On.bindable = On.def = null;
};

const Hn = {
    projections: null
};

const Fn = {
    name: "unnamed"
};

const On = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const Vn = at(createLookup(), {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
});

const Nn = {
    checkbox: 1,
    radio: 1
};

const $n = new WeakMap;

class BindablesInfo {
    static from(t, e) {
        let i = $n.get(t);
        if (i == null) {
            const s = t.bindables;
            const n = createLookup();
            const r = e ? t.defaultBindingMode === void 0 ? Rt : t.defaultBindingMode : Rt;
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
            $n.set(t, i = new BindablesInfo(n, s, c));
        }
        return i;
    }
    constructor(t, e, i) {
        this.attrs = t;
        this.bindables = e;
        this.primary = i;
    }
}

const Wn = ht([ "name", "attribute", "mode" ]);

const jn = "as-custom-element";

const processTemplateName = (t, e, i) => {
    const s = e.getAttribute(jn);
    if (s === null || s === "") {
        throw createMappedError(715, t);
    }
    if (i.has(s)) {
        throw createMappedError(716, s, t);
    } else {
        i.add(s);
        e.removeAttribute(jn);
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

const zn = /*@__PURE__*/ Wt("ITemplateCompilerHooks");

const Un = new WeakMap;

const Gn = /*@__PURE__*/ qt("compiler-hooks");

const Kn = ht({
    name: Gn,
    define(t) {
        let e = Un.get(t);
        if (e === void 0) {
            Un.set(t, e = new TemplateCompilerHooksDefinition(t));
            Pt(Gn, e, t);
            Ht(t, Gn);
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
        t.register(jt(zn, this.Type));
    }
}

const templateCompilerHooks = t => {
    return t === void 0 ? decorator : decorator(t);
    function decorator(t) {
        return Kn.define(t);
    }
};

const Xn = "default";

const Qn = "au-slot";

class Show {
    constructor() {
        this.el = c(ne);
        this.p = c(se);
        this.Us = false;
        this.U = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.U = null;
            if (Boolean(this.value) !== this.Gs) {
                if (this.Gs === this.Ks) {
                    this.Gs = !this.Ks;
                    this.$val = this.el.style.getPropertyValue("display");
                    this.$prio = this.el.style.getPropertyPriority("display");
                    this.el.style.setProperty("display", "none", "important");
                } else {
                    this.Gs = this.Ks;
                    this.el.style.setProperty("display", this.$val, this.$prio);
                    if (this.el.getAttribute("style") === "") {
                        this.el.removeAttribute("style");
                    }
                }
            }
        };
        const t = c(Bi);
        this.Gs = this.Ks = t.alias !== "hide";
    }
    binding() {
        this.Us = true;
        this.update();
    }
    detaching() {
        this.Us = false;
        this.U?.cancel();
        this.U = null;
    }
    valueChanged() {
        if (this.Us && this.U === null) {
            this.U = this.p.domWriteQueue.queueTask(this.update);
        }
    }
}

__decorate([ bindable ], Show.prototype, "value", void 0);

alias("hide")(Show);

customAttribute("show")(Show);

const Yn = [ TemplateCompiler, et, NodeObserverLocator ];

const Zn = [ Is, Ts, Ms, Es, Ye ];

const Jn = [ Ls, Ps ];

const tr = [ Ws, Os, Ns, Vs, $s, js, Qs, zs, Us, Xs, Ks, Gs, Ys ];

const er = [ DebounceBindingBehavior, OneTimeBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, SignalBindingBehavior, ThrottleBindingBehavior, TwoWayBindingBehavior, SanitizeValueConverter, If, Else, Repeat, With, xn, wn, kn, Cn, An, Bn, Sn, _n, Rn, Tn, AttrBindingBehavior, SelfBindingBehavior, UpdateTriggerBindingBehavior, AuCompose, Portal, Focus, Show, In ];

const ir = [ Di, qi, Li, Mi, Ri, Ti, Ii, Ei, Pi, Fi, Wi, Oi, Vi, Ni, $i, Hi, ji ];

const sr = /*@__PURE__*/ createConfiguration(s);

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
            return e.register(Ut(W, i.coercingOptions), ...Yn, ...er, ...Zn, ...tr, ...ir);
        },
        customize(e) {
            return createConfiguration(e ?? t);
        }
    };
}

function children(t, e) {
    if (!or) {
        or = true;
        V(ChildrenBinding);
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
        let l = Ae.getAnnotation(r, s);
        if (l == null) {
            Ae.annotate(r, s, l = []);
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
    constructor(t, e, i, s = defaultChildQuery, n = defaultChildFilter, r = defaultChildMap, l = nr) {
        this.Xs = void 0;
        this.ut = defaultChildQuery;
        this.Qs = defaultChildFilter;
        this.Ys = defaultChildMap;
        this.isBound = false;
        this.G = t;
        this.obj = e;
        this.cb = i;
        this.ut = s;
        this.Qs = n;
        this.Ys = r;
        this.it = l;
        this.bi = createMutationObserver(this.Zs = t.host, (() => {
            this.Js();
        }));
    }
    getValue() {
        return this.isBound ? this.Xs : this.tn();
    }
    setValue(t) {}
    bind() {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        this.bi.observe(this.Zs, this.it);
        this.Xs = this.tn();
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.bi.disconnect();
        this.Xs = f;
    }
    Js() {
        this.Xs = this.tn();
        this.cb?.call(this.obj);
        this.subs.notify(this.Xs, undefined);
    }
    get() {
        throw createMappedError(99, "get");
    }
    tn() {
        return filterChildren(this.G, this.ut, this.Qs, this.Ys);
    }
}

const nr = {
    childList: true
};

const defaultChildQuery = t => t.host.childNodes;

const defaultChildFilter = (t, e, i) => !!i;

const defaultChildMap = (t, e, i) => i;

const rr = {
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
        a = findElementControllerFor(h, rr);
        c = a?.viewModel ?? null;
        if (i(h, a, c)) {
            l.push(s(h, a, c));
        }
    }
    return l;
};

class ChildrenLifecycleHooks {
    constructor(t) {
        this.ft = t;
    }
    register(t) {
        Ut(Oe, this).register(t);
    }
    hydrating(t, e) {
        const i = this.ft;
        const s = new ChildrenBinding(e, t, t[i.callback ?? `${rt(i.name)}Changed`], i.query ?? defaultChildQuery, i.filter ?? defaultChildFilter, i.map ?? defaultChildMap, i.options ?? nr);
        mt(t, i.name, {
            enumerable: true,
            configurable: true,
            get: at((() => s.getValue()), {
                getObserver: () => s
            }),
            set: () => {}
        });
        e.addBinding(s);
    }
}

let or = false;

export { AdoptedStyleSheetsStyles, AppRoot, ie as AppTask, Ls as AtPrefixedTriggerAttributePattern, AttrBindingBehavior, Gs as AttrBindingCommand, AttrSyntax, AttributeBinding, AttributeBindingInstruction, Wi as AttributeBindingRenderer, AttributeNSAccessor, Rs as AttributePattern, AuCompose, In as AuSlot, AuSlotsInfo, Aurelia, Nt as Bindable, BindableDefinition, BindablesInfo, Xt as BindingBehavior, BindingBehaviorDefinition, Fs as BindingCommand, BindingCommandDefinition, Tt as BindingMode, BindingModeBehavior, BindingTargetSubscriber, CSSModulesProcessorRegistry, Us as CaptureBindingCommand, wn as Case, CheckedObserver, ChildrenBinding, ClassAttributeAccessor, Xs as ClassBindingCommand, Ps as ColonPrefixedBindAttributePattern, ComputedWatcher, ContentBinding, Controller, ge as CustomAttribute, CustomAttributeDefinition, Ii as CustomAttributeRenderer, Ae as CustomElement, CustomElementDefinition, Ti as CustomElementRenderer, DataAttributeAccessor, DebounceBindingBehavior, Ws as DefaultBindingCommand, tr as DefaultBindingLanguage, Zn as DefaultBindingSyntax, kn as DefaultCase, Yn as DefaultComponents, ir as DefaultRenderers, er as DefaultResources, Ts as DotSeparatedAttributePattern, Else, EventModifier, Ye as EventModifierRegistration, ExpressionWatcher, FlushQueue, Focus, js as ForBindingCommand, FragmentNodeSequence, FromViewBindingBehavior, Ns as FromViewBindingCommand, Bn as FulfilledTemplateController, HydrateAttributeInstruction, HydrateElementInstruction, HydrateLetElementInstruction, HydrateTemplateController, ws as IAppRoot, ee as IAppTask, Js as IAttrMapper, Bs as IAttributeParser, As as IAttributePattern, ii as IAuSlotWatcher, ei as IAuSlotsInfo, ks as IAurelia, ps as IController, Qe as IEventModifier, re as IEventTarget, Le as IFlushQueue, ue as IHistory, vs as IHydrationContext, Bi as IInstruction, Xe as IKeyMapping, Oe as ILifecycleHooks, ce as ILocation, Ke as IModifiedEventHandlerCreator, ne as INode, se as IPlatform, oe as IRenderLocation, _i as IRenderer, Zi as IRendering, Zs as ISVGAnalyzer, En as ISanitizer, Re as IShadowDOMGlobalStyles, _e as IShadowDOMStyles, Cs as ISyntaxInterpreter, Si as ITemplateCompiler, zn as ITemplateCompilerHooks, Pn as ITemplateElementFactory, Ze as IViewFactory, ae as IWindow, If, Ai as InstructionType, InterpolationBinding, Mi as InterpolationBindingRenderer, InterpolationInstruction, InterpolationPartBinding, Interpretation, IteratorBindingInstruction, qi as IteratorBindingRenderer, LetBinding, LetBindingInstruction, Pi as LetElementRenderer, $e as LifecycleHooks, LifecycleHooksDefinition, LifecycleHooksEntry, ListenerBinding, ListenerBindingInstruction, ListenerBindingOptions, Fi as ListenerBindingRenderer, MultiAttrInstruction, NodeObserverLocator, NoopSVGAnalyzer, OneTimeBindingBehavior, Os as OneTimeBindingCommand, An as PendingTemplateController, Portal, Cn as PromiseTemplateController, PropertyBinding, PropertyBindingInstruction, Di as PropertyBindingRenderer, Is as RefAttributePattern, RefBinding, RefBindingInstruction, Li as RefBindingRenderer, Sn as RejectedTemplateController, Rendering, Repeat, SVGAnalyzer, SanitizeValueConverter, SelectValueObserver, SelfBindingBehavior, SetAttributeInstruction, Oi as SetAttributeRenderer, SetClassAttributeInstruction, Vi as SetClassAttributeRenderer, SetPropertyInstruction, Ri as SetPropertyRenderer, SetStyleAttributeInstruction, Ni as SetStyleAttributeRenderer, ShadowDOMRegistry, Jn as ShortHandBindingSyntax, SignalBindingBehavior, SpreadBindingInstruction, SpreadElementPropBindingInstruction, ji as SpreadRenderer, sr as StandardConfiguration, gs as State, StyleAttributeAccessor, Ks as StyleBindingCommand, Te as StyleConfiguration, StyleElementStyles, StylePropertyBindingInstruction, $i as StylePropertyBindingRenderer, xn as Switch, TemplateCompiler, Kn as TemplateCompilerHooks, Ei as TemplateControllerRenderer, TextBindingInstruction, Hi as TextBindingRenderer, ThrottleBindingBehavior, ToViewBindingBehavior, Vs as ToViewBindingCommand, zs as TriggerBindingCommand, TwoWayBindingBehavior, $s as TwoWayBindingCommand, UpdateTriggerBindingBehavior, ValueAttributeObserver, Ee as ValueConverter, ValueConverterDefinition, ViewFactory, be as Watch, With, alias, allResources, attributePattern, bindable, bindingBehavior, bindingCommand, capture, children, coercer, containerless, convertToRenderLocation, cssModules, customAttribute, customElement, getEffectiveParentNode, getRef, isCustomElementController, isCustomElementViewModel, isInstruction, isRenderLocation, lifecycleHooks, mixinAstEvaluator, mixinUseScope, mixingBindingLimited, processContent, registerAliases, renderer, setEffectiveParentNode, setRef, shadowCSS, slotted, templateCompilerHooks, templateController, useShadowDOM, valueConverter, watch };
//# sourceMappingURL=index.mjs.map
