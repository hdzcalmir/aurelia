import { Protocol as t, getPrototypeChain as e, kebabCase as i, noop as s, DI as n, Registration as r, createResolver as l, firstDefined as h, mergeArrays as a, resolve as c, IPlatform as u, emptyArray as f, InstanceProvider as d, fromDefinitionOrDefault as m, pascalCase as g, fromAnnotationOrTypeOrDefault as p, fromAnnotationOrDefinitionOrTypeOrDefault as v, IContainer as b, optional as x, onResolveAll as w, onResolve as y, all as k, camelCase as C, IServiceLocator as A, emptyObject as B, ILogger as S, transient as _, toArray as R } from "@aurelia/kernel";

import { Metadata as I, isObject as T } from "@aurelia/metadata";

import { AccessorType as E, ISignaler as P, astEvaluate as L, connectable as D, ConnectableSwitcher as M, ProxyObservable as q, astBind as F, astUnbind as H, astAssign as O, subscriberCollection as V, IExpressionParser as N, IObserverLocator as $, ICoercionConfiguration as W, Scope as j, AccessScopeExpression as z, PropertyAccessor as U, IDirtyChecker as G, INodeObserverLocator as X, getObserverLookup as Q, SetterObserver as K, createIndexMap as Y, getCollectionObserver as Z, BindingContext as J, PrimitiveLiteralExpression as tt, DirtyChecker as et } from "@aurelia/runtime";

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

const wt = "running";

const yt = E.Observer;

const kt = E.Node;

const Ct = E.Layout;

const At = 1;

const Bt = 2;

const St = 4;

const _t = 6;

const Rt = 8;

const It = /*@__PURE__*/ ht({
    oneTime: At,
    toView: Bt,
    fromView: St,
    twoWay: _t,
    default: Rt
});

const Tt = I.getOwn;

const Et = I.hasOwn;

const Pt = I.define;

const {annotation: Lt, resource: Dt} = t;

const Mt = Lt.keyFor;

const qt = Dt.keyFor;

const Ft = Dt.appendTo;

const Ht = Lt.appendTo;

const Ot = Lt.getKeys;

function bindable(t, e) {
    let i;
    function decorator(t, e) {
        if (arguments.length > 1) {
            i.name = e;
        }
        Pt(Vt, BindableDefinition.create(e, t, i), t.constructor, e);
        Ht(t.constructor, Nt.keyFrom(e));
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

const Vt = /*@__PURE__*/ Mt("bindable");

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
                s[l++] = Tt(Vt, c, h[u].slice(i));
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
    key: /*@__PURE__*/ Mt("coercer"),
    define(t, e) {
        Pt($t.key, t[e].bind(t), t);
    },
    for(t) {
        return Tt($t.key, t);
    }
};

function getInterceptor(t, e, i = {}) {
    const n = i.type ?? I.get("design:type", e, t) ?? null;
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
        const i = Mt("aliases");
        const s = Tt(i, e);
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
        return Qt.define(t, e);
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
        return new BindingBehaviorDefinition(e, h(getBehaviorAnnotation(e, "name"), i), a(getBehaviorAnnotation(e, "aliases"), s.aliases, e.aliases), Qt.keyFrom(i));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        jt(i, e).register(t);
        zt(i, e).register(t);
        registerAliases(s, Qt, i, t);
    }
}

const Xt = /*@__PURE__*/ qt("binding-behavior");

const getBehaviorAnnotation = (t, e) => Tt(Mt(e), t);

const Qt = ht({
    name: Xt,
    keyFrom(t) {
        return `${Xt}:${t}`;
    },
    isType(t) {
        return isFunction(t) && Et(Xt, t);
    },
    define(t, e) {
        const i = BindingBehaviorDefinition.create(t, e);
        Pt(Xt, i, i.Type);
        Pt(Xt, i, i);
        Ft(e, Xt);
        return i.Type;
    },
    getDefinition(t) {
        const e = Tt(Xt, t);
        if (e === void 0) {
            throw createMappedError(151, t);
        }
        return e;
    },
    annotate(t, e, i) {
        Pt(Mt(e), i, t);
    },
    getAnnotation: getBehaviorAnnotation
});

const Kt = new Map;

class BindingModeBehavior {
    bind(t, e) {
        Kt.set(e, e.mode);
        e.mode = this.mode;
    }
    unbind(t, e) {
        e.mode = Kt.get(e);
        Kt.delete(e);
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
    if (t.has(vs, true)) {
        return t.get(vs).host;
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
        this.I = false;
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
        if (this.I && !!this.ref) {
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
        this.I = false;
        this.next = void 0;
        this.ref = void 0;
    }
    link(t) {
        this.I = true;
        if (isRenderLocation(t)) {
            this.ref = t;
        } else {
            this.next = t;
            this.T();
        }
    }
    T() {
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

const getAttributeAnnotation = (t, e) => Tt(Mt(e), t);

const isAttributeType = t => isFunction(t) && Et(me, t);

const findAttributeControllerFor = (t, e) => getRef(t, getAttributeKeyFrom(e)) ?? void 0;

const defineAttribute = (t, e) => {
    const i = CustomAttributeDefinition.create(t, e);
    Pt(me, i, i.Type);
    Pt(me, i, i);
    Ft(e, me);
    return i.Type;
};

const getAttributeDefinition = t => {
    const e = Tt(me, t);
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
        Pt(Mt(e), i, t);
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

const ve = Mt("watch");

const be = ht({
    name: ve,
    add(t, e) {
        let i = Tt(ve, t);
        if (i == null) {
            Pt(ve, i = [], t);
        }
        i.push(e);
    },
    getAnnotation(t) {
        return Tt(ve, t) ?? pe;
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
    const e = Tt(ye, t);
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
        Pt(ye, e, e.Type);
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

const we = {
    name: undefined,
    searchParents: false,
    optional: false
};

const returnZero = () => 0;

const returnNull = () => null;

const returnFalse = () => false;

const returnTrue = () => true;

const returnEmptyArray = () => f;

const ye = /*@__PURE__*/ qt("custom-element");

const getElementKeyFrom = t => `${ye}:${t}`;

const ke = /*@__PURE__*/ (() => {
    let t = 0;
    return () => `unnamed-${++t}`;
})();

const annotateElementMetadata = (t, e, i) => {
    Pt(Mt(e), i, t);
};

const defineElement = (t, e) => {
    const i = CustomElementDefinition.create(t, e);
    Pt(ye, i, i.Type);
    Pt(ye, i, i);
    Ft(i.Type, ye);
    return i.Type;
};

const isElementType = t => isFunction(t) && Et(ye, t);

const findElementControllerFor = (t, e = we) => {
    if (e.name === void 0 && e.searchParents !== true) {
        const i = getRef(t, ye);
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
            const i = getRef(t, ye);
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
            const t = getRef(i, ye);
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
        const t = getRef(i, ye);
        if (t !== null) {
            return t;
        }
        i = getEffectiveParentNode(i);
    }
    throw createMappedError(765, t);
};

const getElementAnnotation = (t, e) => Tt(Mt(e), t);

const getElementDefinition = t => {
    const e = Tt(ye, t);
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
    name: ye,
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

const Be = /*@__PURE__*/ Mt("processContent");

function processContent(t) {
    return t === void 0 ? function(t, e, i) {
        Pt(Be, ensureHook(t, e), t);
    } : function(e) {
        t = ensureHook(e, t);
        const i = Tt(ye, e);
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

const Ie = {
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

const Te = qt("value-converter");

const getConverterAnnotation = (t, e) => Tt(Mt(e), t);

const Ee = ht({
    name: Te,
    keyFrom: t => `${Te}:${t}`,
    isType(t) {
        return isFunction(t) && Et(Te, t);
    },
    define(t, e) {
        const i = ValueConverterDefinition.create(t, e);
        Pt(Te, i, i.Type);
        Pt(Te, i, i);
        Ft(e, Te);
        return i.Type;
    },
    getDefinition(t) {
        const e = Tt(Te, t);
        if (e === void 0) {
            throw createMappedError(152, t);
        }
        return e;
    },
    annotate(t, e, i) {
        Pt(Mt(e), i, t);
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
        const e = Qt.keyFrom(t);
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

const De = new WeakSet;

const mixingBindingLimited = (t, e) => {
    defineHiddenProp(t.prototype, "limit", (function(t) {
        if (De.has(this)) {
            throw createMappedError(9996);
        }
        De.add(this);
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
                De.delete(this);
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

const {enter: Me, exit: qe} = M;

const {wrap: Fe, unwrap: He} = q;

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
            Me(this);
            return this.v = He(this.$get.call(void 0, this.useProxy ? Fe(this.obj) : this.obj, this));
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

D(ComputedWatcher);

D(ExpressionWatcher);

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

const Ne = Mt("lifecycle-hooks");

const $e = ht({
    name: Ne,
    define(t, e) {
        const i = LifecycleHooksDefinition.create(t, e);
        Pt(Ne, i, e);
        Ft(e, Ne);
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
                r = Tt(Ne, n.constructor);
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
            const i = this.G.state !== rs;
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
        F(this.ast, t, this);
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
        H(this.ast, this.s, this);
        this.s = void 0;
        this.v = void 0;
        this.U?.cancel();
        this.U = null;
        this.obs.clearAll();
    }
}

mixinUseScope(AttributeBinding);

mixingBindingLimited(AttributeBinding, (() => "updateTarget"));

D(AttributeBinding);

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
        const l = this.G.state !== rs && (r.type & Ct) > 0;
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
        this.owner.K();
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
        F(this.ast, t, this);
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
        H(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

mixinUseScope(InterpolationPartBinding);

mixingBindingLimited(InterpolationPartBinding, (() => "updateTarget"));

D(InterpolationPartBinding);

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
        const e = this.G.state !== rs;
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
        const e = this.G.state !== rs;
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
        F(this.ast, t, this);
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
        H(this.ast, this.s, this);
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

D()(ContentBinding);

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
        F(this.ast, t, this);
        this.v = L(this.ast, this.s, this, this);
        this.updateTarget();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        H(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

mixinUseScope(LetBinding);

mixingBindingLimited(LetBinding, (() => "updateTarget"));

D(LetBinding);

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
        O(this.ast, this.s, this, t);
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = L(this.ast, this.s, this, (this.mode & Bt) > 0 ? this : null);
        this.obs.clear();
        const e = this.G.state !== rs && (this.X.type & Ct) > 0;
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
        F(this.ast, t, this);
        const e = this.oL;
        const i = this.mode;
        let s = this.X;
        if (!s) {
            if (i & St) {
                s = e.getObserver(this.target, this.targetProperty);
            } else {
                s = e.getAccessor(this.target, this.targetProperty);
            }
            this.X = s;
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
        H(this.ast, this.s, this);
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

mixingBindingLimited(PropertyBinding, (t => t.mode & St ? "updateSource" : "updateTarget"));

D(PropertyBinding);

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
        F(this.ast, t, this);
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
        H(this.ast, this.s, this);
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
        let i = L(this.ast, this.s, this, null);
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
        F(this.ast, t, this);
        this.target.addEventListener(this.targetEvent, this, this.et);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        H(this.ast, this.s, this);
        this.s = void 0;
        this.target.removeEventListener(this.targetEvent, this, this.et);
    }
}

mixinUseScope(ListenerBinding);

mixingBindingLimited(ListenerBinding, (() => "callSource"));

mixinAstEvaluator(true, true)(ListenerBinding);

const Xe = /*@__PURE__*/ Wt("IViewFactory");

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

const Qe = "au-start";

const Ke = "au-end";

const createElement = (t, e) => t.document.createElement(e);

const createComment = (t, e) => t.document.createComment(e);

const createLocation = t => {
    const e = createComment(t, Ke);
    e.$start = createComment(t, Qe);
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

const Ye = /*@__PURE__*/ Wt("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

const Ze = /*@__PURE__*/ Wt("IAuSlotWatcher");

class AuSlotWatcherBinding {
    constructor(t, e, i, s) {
        this.nt = new Set;
        this.rt = f;
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
                if (this.ot === "*" || isElement(r) && r.matches(this.ot)) {
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
        Ut(Oe, this).register(t);
    }
    hydrating(t, e) {
        const i = this.lt;
        const s = new AuSlotWatcherBinding(t, i.callback ?? `${rt(i.name)}Changed`, i.slotName ?? "default", i.query ?? "*");
        mt(t, i.name, {
            enumerable: true,
            configurable: true,
            get: at((() => s.getValue()), {
                getObserver: () => s
            }),
            set: () => {}
        });
        Ut(Ze, s).register(e.container);
        e.addBinding(s);
    }
}

function slotted(t, e) {
    if (!Je) {
        Je = true;
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

let Je = false;

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
                  case bi:
                    renderSpreadInstruction(t + 1);
                    break;

                  case xi:
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
        this.ht = t;
        this.isBound = false;
        this.ct = [];
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
        const e = this.scope = this.ht.controller.scope.parent ?? void 0;
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
        if (t.vmKind !== is) {
            throw createMappedError(9998);
        }
        this.$controller.addChild(t);
    }
}

const ti = "ra";

const ei = "rb";

const ii = "rc";

const si = "rd";

const ni = "re";

const ri = "rf";

const oi = "rg";

const li = "ri";

const hi = "rj";

const ai = "rk";

const ci = "rl";

const ui = "ha";

const fi = "hb";

const di = "hc";

const mi = "hd";

const gi = "he";

const pi = "hf";

const vi = "hg";

const bi = "hs";

const xi = "hp";

const wi = /*@__PURE__*/ ht({
    hydrateElement: ti,
    hydrateAttribute: ei,
    hydrateTemplateController: ii,
    hydrateLetElement: si,
    setProperty: ni,
    interpolation: ri,
    propertyBinding: oi,
    letBinding: li,
    refBinding: hi,
    iteratorBinding: ai,
    multiAttr: ci,
    textBinding: ui,
    listenerBinding: fi,
    attributeBinding: di,
    stylePropertyBinding: mi,
    setAttribute: gi,
    setClassAttribute: pi,
    setStyleAttribute: vi,
    spreadBinding: bi,
    spreadElementProp: xi
});

const yi = /*@__PURE__*/ Wt("Instruction");

function isInstruction(t) {
    const e = t.type;
    return isString(e) && e.length === 2;
}

class InterpolationInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = ri;
    }
}

class PropertyBindingInstruction {
    constructor(t, e, i) {
        this.from = t;
        this.to = e;
        this.mode = i;
        this.type = oi;
    }
}

class IteratorBindingInstruction {
    constructor(t, e, i) {
        this.forOf = t;
        this.to = e;
        this.props = i;
        this.type = ai;
    }
}

class RefBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = hi;
    }
}

class SetPropertyInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = ni;
    }
}

class MultiAttrInstruction {
    constructor(t, e, i) {
        this.value = t;
        this.to = e;
        this.command = i;
        this.type = ci;
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
        this.type = ti;
        this.auSlot = null;
    }
}

class HydrateAttributeInstruction {
    constructor(t, e, i) {
        this.res = t;
        this.alias = e;
        this.props = i;
        this.type = ei;
    }
}

class HydrateTemplateController {
    constructor(t, e, i, s) {
        this.def = t;
        this.res = e;
        this.alias = i;
        this.props = s;
        this.type = ii;
    }
}

class HydrateLetElementInstruction {
    constructor(t, e) {
        this.instructions = t;
        this.toBindingContext = e;
        this.type = si;
    }
}

class LetBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = li;
    }
}

class TextBindingInstruction {
    constructor(t) {
        this.from = t;
        this.type = ui;
    }
}

class ListenerBindingInstruction {
    constructor(t, e, i, s) {
        this.from = t;
        this.to = e;
        this.preventDefault = i;
        this.capture = s;
        this.type = fi;
    }
}

class StylePropertyBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = mi;
    }
}

class SetAttributeInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = gi;
    }
}

class SetClassAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = pi;
    }
}

class SetStyleAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = vi;
    }
}

class AttributeBindingInstruction {
    constructor(t, e, i) {
        this.attr = t;
        this.from = e;
        this.to = i;
        this.type = di;
    }
}

class SpreadBindingInstruction {
    constructor() {
        this.type = bi;
    }
}

class SpreadElementPropBindingInstruction {
    constructor(t) {
        this.instructions = t;
        this.type = xi;
    }
}

const ki = /*@__PURE__*/ Wt("ITemplateCompiler");

const Ci = /*@__PURE__*/ Wt("IRenderer");

function renderer(t) {
    return function decorator(e) {
        e.register = function(t) {
            jt(Ci, this).register(t);
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

let Ai = class SetPropertyRenderer {
    render(t, e, i) {
        const s = getTarget(e);
        if (s.$observers?.[i.to] !== void 0) {
            s.$observers[i.to].setValue(i.value);
        } else {
            s[i.to] = i.value;
        }
    }
};

Ai = __decorate([ renderer(ni) ], Ai);

let Bi = class CustomElementRenderer {
    constructor() {
        this.r = c(Xi);
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

Bi = __decorate([ renderer(ti) ], Bi);

let Si = class CustomAttributeRenderer {
    constructor() {
        this.r = c(Xi);
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

Si = __decorate([ renderer(ei) ], Si);

let _i = class TemplateControllerRenderer {
    constructor() {
        this.r = c(Xi);
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

_i = __decorate([ renderer(ii) ], _i);

let Ri = class LetElementRenderer {
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

Ri = __decorate([ renderer(si) ], Ri);

let Ii = class RefBindingRenderer {
    render(t, e, i, s, n) {
        t.addBinding(new RefBinding(t.container, ensureExpression(n, i.from, bt), getRefTarget(e, i.to)));
    }
};

Ii = __decorate([ renderer(hi) ], Ii);

let Ti = class InterpolationBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new InterpolationBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, gt), getTarget(e), i.to, Bt));
    }
};

Ti = __decorate([ renderer(ri) ], Ti);

let Ei = class PropertyBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, bt), getTarget(e), i.to, i.mode));
    }
};

Ei = __decorate([ renderer(oi) ], Ei);

let Pi = class IteratorBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.forOf, pt), getTarget(e), i.to, Bt));
    }
};

Pi = __decorate([ renderer(ai) ], Pi);

let Li = class TextBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, s.domWriteQueue, s, ensureExpression(n, i.from, bt), e));
    }
};

Li = __decorate([ renderer(ui) ], Li);

let Di = class ListenerBindingRenderer {
    render(t, e, i, s, n) {
        t.addBinding(new ListenerBinding(t.container, ensureExpression(n, i.from, vt), e, i.to, new ListenerBindingOptions(i.preventDefault, i.capture)));
    }
};

Di = __decorate([ renderer(fi) ], Di);

let Mi = class SetAttributeRenderer {
    render(t, e, i) {
        e.setAttribute(i.to, i.value);
    }
};

Mi = __decorate([ renderer(gi) ], Mi);

let qi = class SetClassAttributeRenderer {
    render(t, e, i) {
        addClasses(e.classList, i.value);
    }
};

qi = __decorate([ renderer(pi) ], qi);

let Fi = class SetStyleAttributeRenderer {
    render(t, e, i) {
        e.style.cssText += i.value;
    }
};

Fi = __decorate([ renderer(vi) ], Fi);

let Hi = class StylePropertyBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, bt), e.style, i.to, Bt));
    }
};

Hi = __decorate([ renderer(mi) ], Hi);

let Oi = class AttributeBindingRenderer {
    render(t, e, i, s, n, r) {
        const l = t.container;
        const h = l.has(le, false) ? l.get(le) : null;
        t.addBinding(new AttributeBinding(t, l, r, s.domWriteQueue, ensureExpression(n, i.from, bt), e, i.attr, h == null ? i.to : i.to.split(/\s/g).map((t => h[t] ?? t)).join(" "), Bt));
    }
};

Oi = __decorate([ renderer(di) ], Oi);

let Vi = class SpreadRenderer {
    constructor() {
        this.ut = c(ki);
        this.r = c(Xi);
    }
    render(t, e, i, s, n, r) {
        SpreadBinding.create(t.container.get(ds), e, void 0, this.r, this.ut, s, n, r).forEach((e => t.addBinding(e)));
    }
};

Vi = __decorate([ renderer(bi) ], Vi);

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

const Ni = "IController";

const $i = "IInstruction";

const Wi = "IRenderLocation";

const ji = "ISlotsInfo";

function createElementContainer(t, e, i, s, n, r) {
    const l = e.container.createChild();
    registerHostNode(l, t, i);
    registerResolver(l, fs, new d(Ni, e));
    registerResolver(l, yi, new d($i, s));
    registerResolver(l, oe, n == null ? zi : new RenderLocationProvider(n));
    registerResolver(l, Xe, Ui);
    registerResolver(l, Ye, r == null ? Gi : new d(ji, r));
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
    registerResolver(c, fs, new d(Ni, a));
    registerResolver(c, yi, new d($i, n));
    registerResolver(c, oe, l == null ? zi : new d(Wi, l));
    registerResolver(c, Xe, r == null ? Ui : new ViewFactoryProvider(r));
    registerResolver(c, Ye, h == null ? Gi : new d(ji, h));
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

const zi = new RenderLocationProvider(null);

const Ui = new ViewFactoryProvider(null);

const Gi = new d(ji, new AuSlotsInfo(f));

const Xi = /*@__PURE__*/ Wt("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.ft ?? (this.ft = this.dt.getAll(Ci, false).reduce(((t, e) => {
            t[e.target] = e;
            return t;
        }), createLookup()));
    }
    constructor() {
        this.gt = new WeakMap;
        this.vt = new WeakMap;
        const t = this.dt = c(b).root;
        this.p = t.get(se);
        this.ep = t.get(N);
        this.oL = t.get($);
        this.bt = new FragmentNodeSequence(this.p, this.p.document.createDocumentFragment());
    }
    compile(t, e, i) {
        if (t.needsCompile !== false) {
            const s = this.gt;
            const n = e.get(ki);
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

var Qi;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["host"] = 1] = "host";
    t[t["shadowRoot"] = 2] = "shadowRoot";
    t[t["location"] = 3] = "location";
})(Qi || (Qi = {}));

const Ki = {
    optional: true
};

const Yi = optionalResource(W);

const Zi = new WeakMap;

class Controller {
    get lifecycleHooks() {
        return this.yt;
    }
    get isActive() {
        return (this.state & (rs | os)) > 0 && (this.state & ls) === 0;
    }
    get name() {
        if (this.parent === null) {
            switch (this.vmKind) {
              case is:
                return `[${this.definition.name}]`;

              case es:
                return this.definition.name;

              case ss:
                return this.viewFactory.name;
            }
        }
        switch (this.vmKind) {
          case is:
            return `${this.parent.name}>[${this.definition.name}]`;

          case es:
            return `${this.parent.name}>${this.definition.name}`;

          case ss:
            return this.viewFactory.name === this.parent.definition?.name ? `${this.parent.name}[view]` : `${this.parent.name}[view:${this.viewFactory.name}]`;
        }
    }
    get viewModel() {
        return this.kt;
    }
    set viewModel(t) {
        this.kt = t;
        this.Ct = t == null || this.vmKind === ss ? HooksDefinition.none : new HooksDefinition(t);
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
        this.mountTarget = 0;
        this.shadowRoot = null;
        this.nodes = null;
        this.location = null;
        this.yt = null;
        this.state = ns;
        this.Bt = false;
        this.$initiator = null;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this.St = 0;
        this._t = 0;
        this.Rt = 0;
        this.kt = n;
        this.Ct = e === ss ? HooksDefinition.none : new HooksDefinition(n);
        this.location = l;
        this.r = t.root.get(Xi);
        this.coercion = e === ss ? void 0 : t.get(Yi);
    }
    static getCached(t) {
        return Zi.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (e === void 0) {
            throw createMappedError(500, t);
        }
        return e;
    }
    static $el(t, e, i, s, n = void 0, r = null) {
        if (Zi.has(e)) {
            return Zi.get(e);
        }
        n = n ?? getElementDefinition(e.constructor);
        const l = new Controller(t, es, n, null, e, i, r);
        const h = t.get(x(ds));
        if (n.dependencies.length > 0) {
            t.register(...n.dependencies);
        }
        registerResolver(t, ds, new d("IHydrationContext", new HydrationContext(l, s, h)));
        Zi.set(e, l);
        if (s == null || s.hydrate !== false) {
            l.hE(s, h);
        }
        return l;
    }
    static $attr(t, e, i, s) {
        if (Zi.has(e)) {
            return Zi.get(e);
        }
        s = s ?? getAttributeDefinition(e.constructor);
        const n = new Controller(t, is, s, null, e, i, null);
        if (s.dependencies.length > 0) {
            t.register(...s.dependencies);
        }
        Zi.set(e, n);
        n.It();
        return n;
    }
    static $view(t, e = void 0) {
        const i = new Controller(t.container, ss, null, t, null, null, null);
        i.parent = e ?? null;
        i.Tt();
        return i;
    }
    hE(t, e) {
        const i = this.container;
        const s = this.kt;
        let n = this.definition;
        this.scope = j.create(s, null, true);
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
        this.yt = $e.resolve(i);
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
        if (this.yt.hydrating != null) {
            this.yt.hydrating.forEach(callHydratingHook, this);
        }
        if (this.Ct.Pt) {
            this.kt.hydrating(this);
        }
        const e = this.Lt = this.r.compile(this.definition, this.container, t);
        const {shadowOptions: i, hasSlots: s, containerless: n} = e;
        let r = this.location;
        if ((this.hostController = findElementControllerFor(this.host, Ki)) !== null) {
            this.host = this.container.root.get(se).document.createElement(this.definition.name);
            if (n && r == null) {
                r = this.location = convertToRenderLocation(this.host);
            }
        }
        setRef(this.host, ye, this);
        setRef(this.host, this.definition.key, this);
        if (i !== null || s) {
            if (r != null) {
                throw createMappedError(501);
            }
            setRef(this.shadowRoot = this.host.attachShadow(i ?? ts), ye, this);
            setRef(this.shadowRoot, this.definition.key, this);
            this.mountTarget = 2;
        } else if (r != null) {
            setRef(r, ye, this);
            setRef(r, this.definition.key, this);
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
    It() {
        const t = this.definition;
        const e = this.kt;
        if (t.watches.length > 0) {
            createWatchers(this, this.container, t, e);
        }
        createObservers(this, t, e);
        e.$controller = this;
        this.yt = $e.resolve(this.container);
        if (this.yt.created !== void 0) {
            this.yt.created.forEach(callCreatedHook, this);
        }
        if (this.Ct.Mt) {
            this.kt.created(this);
        }
    }
    Tt() {
        this.Lt = this.r.compile(this.viewFactory.def, this.container, null);
        this.r.render(this, (this.nodes = this.r.createNodes(this.Lt)).findTargets(), this.Lt, void 0);
    }
    activate(t, e, i) {
        switch (this.state) {
          case ns:
          case hs:
            if (!(e === null || e.isActive)) {
                return;
            }
            this.state = rs;
            break;

          case os:
            return;

          case cs:
            throw createMappedError(502, this.name);

          default:
            throw createMappedError(503, this.name, stringifyState(this.state));
        }
        this.parent = e;
        switch (this.vmKind) {
          case es:
            this.scope.parent = i ?? null;
            break;

          case is:
            this.scope = i ?? null;
            break;

          case ss:
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
        if (this.vmKind !== ss && this.yt.binding != null) {
            s = w(...this.yt.binding.map(callBindingHook, this));
        }
        if (this.Ct.Ft) {
            s = w(s, this.kt.binding(this.$initiator, this.parent));
        }
        if (isPromise(s)) {
            this.Ht();
            s.then((() => {
                this.At = true;
                if (this.state !== rs) {
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
        let i = void 0;
        if (this.bindings !== null) {
            t = 0;
            e = this.bindings.length;
            while (e > t) {
                this.bindings[t].bind(this.scope);
                ++t;
            }
        }
        if (this.vmKind !== ss && this.yt.bound != null) {
            i = w(...this.yt.bound.map(callBoundHook, this));
        }
        if (this.Ct.Nt) {
            i = w(i, this.kt.bound(this.$initiator, this.parent));
        }
        if (isPromise(i)) {
            this.Ht();
            i.then((() => {
                this.isBound = true;
                if (this.state !== rs) {
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
        if (this.vmKind !== ss && this.yt.attaching != null) {
            e = w(...this.yt.attaching.map(callAttachingHook, this));
        }
        if (this.Ct.jt) {
            e = w(e, this.kt.attaching(this.$initiator, this.parent));
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
        switch (this.state & ~as) {
          case os:
            this.state = ls;
            break;

          case rs:
            this.state = ls;
            i = this.$promise?.catch(s);
            break;

          case ns:
          case hs:
          case cs:
          case hs | cs:
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
        return y(i, (() => {
            if (this.isBound) {
                if (this.vmKind !== ss && this.yt.detaching != null) {
                    r = w(...this.yt.detaching.map(callDetachingHook, this));
                }
                if (this.Ct.Ut) {
                    r = w(r, this.kt.detaching(this.$initiator, this.parent));
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
          case es:
          case ss:
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
          case is:
            this.scope = null;
            break;

          case ss:
            if (!this.hasLockedScope) {
                this.scope = null;
            }
            if ((this.state & as) === as && !this.viewFactory.tryReturnToCache(this) && this.$initiator === this) {
                this.dispose();
            }
            break;

          case es:
            this.scope.parent = null;
            break;
        }
        this.state = hs;
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
            ms = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            ms();
            ms = void 0;
        }
    }
    Vt(t) {
        if (this.$promise !== void 0) {
            gs = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            gs(t);
            gs = void 0;
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
        if (this.state !== rs) {
            --this.St;
            this.Xt();
            if (this.$initiator !== this) {
                this.parent.Ot();
            }
            return;
        }
        if (--this.St === 0) {
            if (this.vmKind !== ss && this.yt.attached != null) {
                ps = w(...this.yt.attached.map(callAttachedHook, this));
            }
            if (this.Ct.Qt) {
                ps = w(ps, this.kt.attached(this.$initiator));
            }
            if (isPromise(ps)) {
                this.Ht();
                ps.then((() => {
                    this.state = os;
                    this.Xt();
                    if (this.$initiator !== this) {
                        this.parent.Ot();
                    }
                })).catch((t => {
                    this.Vt(t);
                }));
                ps = void 0;
                return;
            }
            ps = void 0;
            this.state = os;
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
            let e = void 0;
            while (t !== null) {
                if (t !== this) {
                    if (t.debug) {
                        t.logger.trace(`detach()`);
                    }
                    t.removeNodes();
                }
                if (t.At) {
                    if (t.vmKind !== ss && t.yt.unbinding != null) {
                        e = w(...t.yt.unbinding.map(callUnbindingHook, t));
                    }
                    if (t.Ct.Yt) {
                        if (t.debug) {
                            t.logger.trace("unbinding()");
                        }
                        e = w(e, t.viewModel.unbinding(t.$initiator, t.parent));
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
          case is:
            {
                return getAttributeDefinition(this.kt.constructor).name === t;
            }

          case es:
            {
                return getElementDefinition(this.kt.constructor).name === t;
            }

          case ss:
            return this.viewFactory.name === t;
        }
    }
    lockScope(t) {
        this.scope = t;
        this.hasLockedScope = true;
    }
    setHost(t) {
        if (this.vmKind === es) {
            setRef(t, ye, this);
            setRef(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = 1;
        return this;
    }
    setShadowRoot(t) {
        if (this.vmKind === es) {
            setRef(t, ye, this);
            setRef(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = 2;
        return this;
    }
    setLocation(t) {
        if (this.vmKind === es) {
            setRef(t, ye, this);
            setRef(t, this.definition.key, this);
        }
        this.location = t;
        this.mountTarget = 3;
        return this;
    }
    release() {
        this.state |= as;
    }
    dispose() {
        if ((this.state & cs) === cs) {
            return;
        }
        this.state |= cs;
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
            Zi.delete(this.kt);
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

const Ji = new Map;

const getAccessScopeAst = t => {
    let e = Ji.get(t);
    if (e == null) {
        e = new z(t, 0);
        Ji.set(t, e);
    }
    return e;
};

function createWatchers(t, e, i, s) {
    const n = e.get($);
    const r = e.get(N);
    const l = i.watches;
    const h = t.vmKind === es ? t.scope : j.create(s, null, true);
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
    return t instanceof Controller && t.vmKind === es;
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

const ts = {
    mode: "open"
};

const es = "customElement";

const is = "customAttribute";

const ss = "synthetic";

const ns = 0;

const rs = 1;

const os = 2;

const ls = 4;

const hs = 8;

const as = 16;

const cs = 32;

const us = /*@__PURE__*/ ht({
    none: ns,
    activating: rs,
    activated: os,
    deactivating: ls,
    deactivated: hs,
    released: as,
    disposed: cs
});

function stringifyState(t) {
    const e = [];
    if ((t & rs) === rs) {
        e.push("activating");
    }
    if ((t & os) === os) {
        e.push("activated");
    }
    if ((t & ls) === ls) {
        e.push("deactivating");
    }
    if ((t & hs) === hs) {
        e.push("deactivated");
    }
    if ((t & as) === as) {
        e.push("released");
    }
    if ((t & cs) === cs) {
        e.push("disposed");
    }
    return e.length === 0 ? "none" : e.join("|");
}

const fs = /*@__PURE__*/ Wt("IController");

const ds = /*@__PURE__*/ Wt("IHydrationContext");

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

let ms;

let gs;

let ps;

const vs = /*@__PURE__*/ Wt("IAppRoot");

class AppRoot {
    constructor(t, e, i, s) {
        this.config = t;
        this.platform = e;
        this.container = i;
        this.ee = void 0;
        this.host = t.host;
        s.prepare(this);
        registerHostNode(i, e, t.host);
        this.ee = y(this.ie("creating"), (() => {
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
            return y(this.ie("hydrating"), (() => {
                l.hS(null);
                return y(this.ie("hydrated"), (() => {
                    l.hC();
                    this.ee = void 0;
                }));
            }));
        }));
    }
    activate() {
        return y(this.ee, (() => y(this.ie("activating"), (() => y(this.controller.activate(this.controller, null, void 0), (() => this.ie("activated")))))));
    }
    deactivate() {
        return y(this.ie("deactivating"), (() => y(this.controller.deactivate(this.controller, null), (() => this.ie("deactivated")))));
    }
    ie(t) {
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

const bs = /*@__PURE__*/ Wt("IAurelia");

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
        if (t.has(bs, true) || t.has(Aurelia, true)) {
            throw createMappedError(768);
        }
        registerResolver(t, bs, new d("IAurelia", this));
        registerResolver(t, Aurelia, new d("Aurelia", this));
        registerResolver(t, vs, this.he = new d("IAppRoot"));
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
        registerResolver(i, re, new d("IEventTarget", s));
        e = e ?? null;
        const h = Controller.$el(i, l, s, null, CustomElementDefinition.create({
            name: ke(),
            template: s,
            enhance: true
        }));
        return y(h.activate(h, e), (() => h));
    }
    async waitForIdle() {
        const t = this.root.platform;
        await t.domWriteQueue.yield();
        await t.domReadQueue.yield();
        await t.taskQueue.yield();
    }
    ae(t) {
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
        if (isPromise(this.oe)) {
            return this.oe;
        }
        return this.oe = y(this.stop(), (() => {
            Reflect.set(t.host, "$aurelia", this);
            this.he.prepare(this.re = t);
            this.se = true;
            return y(t.activate(), (() => {
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
            return this.le = y(e.deactivate(), (() => {
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
        this.parts = f;
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
            this.parts = f;
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

const xs = /*@__PURE__*/ Wt("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

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
            l = this.Ie(s, r);
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
            s = this.Te(s, t.charAt(n), e);
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
    Te(t, e, i) {
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
    Ie(t, e) {
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

const ws = /*@__PURE__*/ Wt("IAttributePattern");

const ys = /*@__PURE__*/ Wt("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor(t, e) {
        this.it = {};
        this.Ee = t;
        const i = this.ye = {};
        const s = e.reduce(((t, e) => {
            const s = getAllPatternDefinitions(e.constructor);
            s.forEach((t => i[t.pattern] = e));
            return t.concat(s);
        }), f);
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

AttributeParser.inject = [ xs, k(ws) ];

function attributePattern(...t) {
    return function decorator(e) {
        return As.define(t, e);
    };
}

class AttributePatternResourceDefinition {
    constructor(t) {
        this.Type = t;
        this.name = void 0;
    }
    register(t) {
        jt(ws, this.Type).register(t);
    }
}

const ks = qt("attribute-pattern");

const Cs = "attribute-pattern-definitions";

const getAllPatternDefinitions = e => t.annotation.get(e, Cs);

const As = ht({
    name: ks,
    definitionAnnotationKey: Cs,
    define(e, i) {
        const s = new AttributePatternResourceDefinition(i);
        Pt(ks, s, i);
        Ft(i, ks);
        t.annotation.set(i, Cs, e);
        Ht(i, Cs);
        return i;
    },
    getPatternDefinitions: getAllPatternDefinitions
});

let Bs = class DotSeparatedAttributePattern {
    "PART.PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], i[1]);
    }
    "PART.PART.PART"(t, e, i) {
        return new AttrSyntax(t, e, `${i[0]}.${i[1]}`, i[2]);
    }
};

Bs = __decorate([ attributePattern({
    pattern: "PART.PART",
    symbols: "."
}, {
    pattern: "PART.PART.PART",
    symbols: "."
}) ], Bs);

let Ss = class RefAttributePattern {
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

Ss = __decorate([ attributePattern({
    pattern: "ref",
    symbols: ""
}, {
    pattern: "PART.ref",
    symbols: "."
}) ], Ss);

let _s = class ColonPrefixedBindAttributePattern {
    ":PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "bind");
    }
};

_s = __decorate([ attributePattern({
    pattern: ":PART",
    symbols: ":"
}) ], _s);

let Rs = class AtPrefixedTriggerAttributePattern {
    "@PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "trigger");
    }
};

Rs = __decorate([ attributePattern({
    pattern: "@PART",
    symbols: "@"
}) ], Rs);

let Is = class SpreadAttributePattern {
    "...$attrs"(t, e, i) {
        return new AttrSyntax(t, e, "", "...$attrs");
    }
};

Is = __decorate([ attributePattern({
    pattern: "...$attrs",
    symbols: ""
}) ], Is);

const Ts = "None";

const Es = "IgnoreAttr";

function bindingCommand(t) {
    return function(e) {
        return Ls.define(t, e);
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
        registerAliases(s, Ls, i, t);
    }
}

const Ps = /*@__PURE__*/ qt("binding-command");

const getCommandKeyFrom = t => `${Ps}:${t}`;

const getCommandAnnotation = (t, e) => Tt(Mt(e), t);

const Ls = ht({
    name: Ps,
    keyFrom: getCommandKeyFrom,
    define(t, e) {
        const i = BindingCommandDefinition.create(t, e);
        Pt(Ps, i, i.Type);
        Pt(Ps, i, i);
        Ft(e, Ps);
        return i.Type;
    },
    getAnnotation: getCommandAnnotation
});

let Ds = class OneTimeBindingCommand {
    get type() {
        return Ts;
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

Ds = __decorate([ bindingCommand("one-time") ], Ds);

let Ms = class ToViewBindingCommand {
    get type() {
        return Ts;
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

Ms = __decorate([ bindingCommand("to-view") ], Ms);

let qs = class FromViewBindingCommand {
    get type() {
        return Ts;
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

qs = __decorate([ bindingCommand("from-view") ], qs);

let Fs = class TwoWayBindingCommand {
    get type() {
        return Ts;
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

Fs = __decorate([ bindingCommand("two-way") ], Fs);

let Hs = class DefaultBindingCommand {
    get type() {
        return Ts;
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

Hs = __decorate([ bindingCommand("bind") ], Hs);

let Os = class ForBindingCommand {
    get type() {
        return Ts;
    }
    static get inject() {
        return [ ys ];
    }
    constructor(t) {
        this.Pe = t;
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
                const r = this.Pe.parse(t, s);
                n = [ new MultiAttrInstruction(s, r.target, r.command) ];
            }
        }
        return new IteratorBindingInstruction(s, i, n);
    }
};

Os = __decorate([ bindingCommand("for") ], Os);

let Vs = class TriggerBindingCommand {
    get type() {
        return Es;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, vt), t.attr.target, true, false);
    }
};

Vs = __decorate([ bindingCommand("trigger") ], Vs);

let Ns = class CaptureBindingCommand {
    get type() {
        return Es;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, vt), t.attr.target, false, true);
    }
};

Ns = __decorate([ bindingCommand("capture") ], Ns);

let $s = class AttrBindingCommand {
    get type() {
        return Es;
    }
    build(t, e) {
        return new AttributeBindingInstruction(t.attr.target, e.parse(t.attr.rawValue, bt), t.attr.target);
    }
};

$s = __decorate([ bindingCommand("attr") ], $s);

let Ws = class StyleBindingCommand {
    get type() {
        return Es;
    }
    build(t, e) {
        return new AttributeBindingInstruction("style", e.parse(t.attr.rawValue, bt), t.attr.target);
    }
};

Ws = __decorate([ bindingCommand("style") ], Ws);

let js = class ClassBindingCommand {
    get type() {
        return Es;
    }
    build(t, e) {
        return new AttributeBindingInstruction("class", e.parse(t.attr.rawValue, bt), t.attr.target);
    }
};

js = __decorate([ bindingCommand("class") ], js);

let zs = class RefBindingCommand {
    get type() {
        return Es;
    }
    build(t, e) {
        return new RefBindingInstruction(e.parse(t.attr.rawValue, bt), t.attr.target);
    }
};

zs = __decorate([ bindingCommand("ref") ], zs);

let Us = class SpreadBindingCommand {
    get type() {
        return Es;
    }
    build(t) {
        return new SpreadBindingInstruction;
    }
};

Us = __decorate([ bindingCommand("...$attrs") ], Us);

const Gs = /*@__PURE__*/ Wt("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

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
        return jt(Gs, this).register(t);
    }
    constructor(t) {
        this.Le = at(createLookup(), {
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

SVGAnalyzer.inject = [ se ];

const Xs = /*@__PURE__*/ Wt("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    constructor() {
        this.fns = [];
        this.qe = createLookup();
        this.Fe = createLookup();
        this.svg = c(Gs);
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

const Qs = createLookup();

class AttributeNSAccessor {
    static forNs(t) {
        return Qs[t] ?? (Qs[t] = new AttributeNSAccessor(t));
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

const Ks = new DataAttributeAccessor;

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
        this.type = kt | yt | Ct;
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
        (this.Ve = createMutationObserver(this.P, this.$e.bind(this))).observe(this.P, Ys);
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
        Zs = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Zs);
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

let Zs = void 0;

const Js = "--";

class StyleAttributeAccessor {
    constructor(t) {
        this.obj = t;
        this.type = kt | Ct;
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
                if (s.startsWith(Js)) {
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
        return f;
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
        return f;
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
        if (dt(t, this.v)) {
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
        tn = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, tn);
    }
}

mixinNodeObserverUseConfig(ValueAttributeObserver);

V(ValueAttributeObserver);

let tn = void 0;

const en = "http://www.w3.org/1999/xlink";

const sn = "http://www.w3.org/XML/1998/namespace";

const nn = "http://www.w3.org/2000/xmlns/";

const rn = at(createLookup(), {
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

const on = new U;

on.type = kt | Ct;

class NodeObserverLocator {
    constructor() {
        this.allowDirtyCheck = true;
        this.Xe = createLookup();
        this.Qe = createLookup();
        this.Ke = createLookup();
        this.Ye = createLookup();
        this.Ze = c(A);
        this.p = c(se);
        this.Je = c(G);
        this.svg = c(Gs);
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
        zt(X, NodeObserverLocator).register(t);
        jt(X, NodeObserverLocator).register(t);
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
        if (e in this.Ye || e in (this.Ke[t.tagName] ?? B)) {
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
            return Ks;

          default:
            {
                const i = rn[e];
                if (i !== undefined) {
                    return AttributeNSAccessor.forNs(i[1]);
                }
                if (isDataAttribute(t, e, this.svg)) {
                    return Ks;
                }
                return on;
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
                Q(t)[e] = n;
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
            return Ks;
        }
        if (e in t.constructor.prototype) {
            if (this.allowDirtyCheck) {
                return this.Je.createProperty(t, e);
            }
            throw createMappedError(652, e);
        } else {
            return new K(t, e);
        }
    }
}

NodeObserverLocator.inject = [ A, se, G, Gs ];

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
        ln = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, ln);
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

V(CheckedObserver);

let ln = void 0;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) {
            throw createMappedError(9994, e);
        }
        e.useTargetObserver(Ks);
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
        this.ni = c(X);
    }
    bind(t, e, ...i) {
        if (!(this.ni instanceof NodeObserverLocator)) {
            throw createMappedError(9993);
        }
        if (i.length === 0) {
            throw createMappedError(802);
        }
        if (!(e instanceof PropertyBinding) || !(e.mode & St)) {
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
        this.li = c(Xe);
        this.l = c(oe);
    }
    attaching(t, e) {
        return this.hi(this.value);
    }
    detaching(t, e) {
        this.ri = true;
        return y(this.pending, (() => {
            this.ri = false;
            this.pending = void 0;
            void this.view?.deactivate(t, this.$controller);
        }));
    }
    valueChanged(t, e) {
        if (!this.$controller.isActive) return;
        t = !!t;
        e = !!e;
        if (t !== e) return this.hi(t);
    }
    hi(t) {
        const e = this.view;
        const i = this.$controller;
        const s = this.oi++;
        const isCurrent = () => !this.ri && this.oi === s + 1;
        let n;
        return y(this.pending, (() => this.pending = y(e?.deactivate(e, i), (() => {
            if (!isCurrent()) {
                return;
            }
            if (t) {
                n = this.view = this.ifView = this.cache && this.ifView != null ? this.ifView : this.li.create();
            } else {
                n = this.view = this.elseView = this.cache && this.elseView != null ? this.elseView : this.elseFactory?.create();
            }
            if (n == null) {
                return;
            }
            n.setLocation(this.l);
            return y(n.activate(n, i, i.scope), (() => {
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
        this.f = c(Xe);
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

const hn = [ "BindingBehavior", "ValueConverter" ];

class Repeat {
    constructor(t, e, i, s, n) {
        this.views = [];
        this.ai = [];
        this.key = null;
        this.ui = new Map;
        this.fi = new Map;
        this.di = void 0;
        this.mi = false;
        this.gi = false;
        this.pi = null;
        this.vi = void 0;
        this.bi = false;
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
        this.xi = s;
        this.f = n;
    }
    binding(t, e) {
        const i = this.xi.bindings;
        const s = i.length;
        let n = void 0;
        let r;
        let l = 0;
        for (;s > l; ++l) {
            n = i[l];
            if (n.target === this && n.targetProperty === "items") {
                r = this.forOf = n.ast;
                this.wi = n;
                let t = r.iterable;
                while (t != null && hn.includes(t.$kind)) {
                    t = t.expression;
                    this.mi = true;
                }
                this.pi = t;
                break;
            }
        }
        this.yi();
        const h = r.declaration;
        if (!(this.bi = h.$kind === "ArrayDestructuring" || h.$kind === "ObjectDestructuring")) {
            this.local = L(h, this.$controller.scope, n, null);
        }
    }
    attaching(t, e) {
        this.ki();
        return this.Ci(t);
    }
    detaching(t, e) {
        this.yi();
        return this.Ai(t);
    }
    unbinding(t, e) {
        this.fi.clear();
        this.ui.clear();
    }
    itemsChanged() {
        if (!this.$controller.isActive) {
            return;
        }
        this.yi();
        this.ki();
        this.Bi(this.items, void 0);
    }
    handleCollectionChange(t, e) {
        const i = this.$controller;
        if (!i.isActive) {
            return;
        }
        if (this.mi) {
            if (this.gi) {
                return;
            }
            this.gi = true;
            this.items = L(this.forOf.iterable, i.scope, this.wi, null);
            this.gi = false;
            return;
        }
        this.ki();
        this.Bi(t, e);
    }
    Bi(t, e) {
        const i = this.views;
        this.ai = i.slice();
        const s = i.length;
        const n = this.key;
        const r = n !== null;
        if (r || e === void 0) {
            const t = this.local;
            const l = this.vi;
            const h = l.length;
            const a = this.forOf;
            const c = a.declaration;
            const u = this.wi;
            const f = this.bi;
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
                const w = s - 1;
                const y = h - 1;
                const k = new Map;
                const C = new Map;
                const A = this.ui;
                const B = this.fi;
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
            const t = y(this.Ai(null), (() => this.Ci(null)));
            if (isPromise(t)) {
                t.catch(rethrow);
            }
        } else {
            if (e.deletedIndices.length > 0) {
                const t = y(this.Si(e), (() => this._i(s, e)));
                if (isPromise(t)) {
                    t.catch(rethrow);
                }
            } else {
                this._i(s, e);
            }
        }
    }
    yi() {
        const t = this.$controller.scope;
        let e = this.Ri;
        let i = this.mi;
        let s;
        if (i) {
            e = this.Ri = L(this.pi, t, this.wi, null) ?? null;
            i = this.mi = !dt(this.items, e);
        }
        const n = this.di;
        if (this.$controller.isActive) {
            s = this.di = Z(i ? e : this.items);
            if (n !== s) {
                n?.unsubscribe(this);
                s?.subscribe(this);
            }
        } else {
            n?.unsubscribe(this);
            this.di = undefined;
        }
    }
    ki() {
        const {items: t} = this;
        if (isArray(t)) {
            this.vi = t;
            return;
        }
        const e = [];
        iterate(t, ((t, i) => {
            e[i] = t;
        }));
        this.vi = e;
    }
    Ci(t) {
        let e = void 0;
        let i;
        let s;
        let n;
        const {$controller: r, f: l, local: h, l: a, items: c, fi: u, wi: f, forOf: d, bi: m} = this;
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
    Ai(t) {
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
    Si(t) {
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
    _i(t, e) {
        let i = void 0;
        let s;
        let n;
        let r;
        let l = 0;
        const {$controller: h, f: a, local: c, vi: u, l: f, views: d, bi: m, wi: g, fi: p, ai: v, forOf: b} = this;
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
                    O(B, n.scope, g, u[l]);
                } else {
                    n.scope.bindingContext[c] = u[l];
                }
                setContextualProperties(n.scope.overrideContext, l, y);
                n.nodes.insertBefore(n.location);
            } else {
                if (m) {
                    O(B, n.scope, g, u[l]);
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

Repeat.inject = [ yi, N, oe, fs, Xe ];

__decorate([ bindable ], Repeat.prototype, "items", void 0);

templateController("repeat")(Repeat);

let an = 16;

let cn = new Int32Array(an);

let un = new Int32Array(an);

function longestIncreasingSubsequence(t) {
    const e = t.length;
    if (e > an) {
        an = e;
        cn = new Int32Array(e);
        un = new Int32Array(e);
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
            l = cn[i];
            n = t[l];
            if (n !== -2 && n < s) {
                un[r] = l;
                cn[++i] = r;
                continue;
            }
            h = 0;
            a = i;
            while (h < a) {
                c = h + a >> 1;
                n = t[cn[c]];
                if (n !== -2 && n < s) {
                    h = c + 1;
                } else {
                    a = c;
                }
            }
            n = t[cn[h]];
            if (s < n || n === -2) {
                if (h > 0) {
                    un[r] = cn[h - 1];
                }
                cn[h] = r;
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

const dn = ot.toString;

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
        this.view = c(Xe).create().setLocation(c(oe));
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

let mn = class Switch {
    constructor() {
        this.cases = [];
        this.activeCases = [];
        this.promise = void 0;
        this.f = c(Xe);
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
        this.queue((() => this.Ii(t)));
    }
    Ii(t) {
        const e = t.isMatch(this.value);
        const i = this.activeCases;
        const s = i.length;
        if (!e) {
            if (s > 0 && i[0].id === t.id) {
                return this.Ti(null);
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
        return y(this.Ti(null, n), (() => {
            this.activeCases = n;
            return this.Ei(null);
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
        return y(this.activeCases.length > 0 ? this.Ti(t, i) : void 0, (() => {
            this.activeCases = i;
            if (i.length === 0) {
                return;
            }
            return this.Ei(t);
        }));
    }
    Ei(t) {
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
    Ti(t, e = []) {
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
        return y(w(...i.reduce(((i, s) => {
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
        i = this.promise = y(y(e, t), (() => {
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

__decorate([ bindable ], mn.prototype, "value", void 0);

mn = __decorate([ templateController("switch") ], mn);

let gn = 0;

let pn = class Case {
    constructor() {
        this.id = ++gn;
        this.fallThrough = false;
        this.view = void 0;
        this.f = c(Xe);
        this.Ze = c($);
        this.l = c(oe);
        this.Pi = c(S).scopeTo(`${this.constructor.name}-#${this.id}`);
    }
    link(t, e, i, s) {
        const n = t.parent;
        const r = n?.viewModel;
        if (r instanceof mn) {
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
        this.Pi.debug("isMatch()");
        const e = this.value;
        if (isArray(e)) {
            if (this.di === void 0) {
                this.di = this.Li(e);
            }
            return e.includes(t);
        }
        return e === t;
    }
    valueChanged(t, e) {
        if (isArray(t)) {
            this.di?.unsubscribe(this);
            this.di = this.Li(t);
        } else if (this.di !== void 0) {
            this.di.unsubscribe(this);
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
        this.di?.unsubscribe(this);
        this.view?.dispose();
        this.view = void 0;
    }
    linkToSwitch(t) {
        t.cases.push(this);
    }
    Li(t) {
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

__decorate([ bindable ], pn.prototype, "value", void 0);

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
}) ], pn.prototype, "fallThrough", void 0);

pn = __decorate([ templateController("case") ], pn);

let vn = class DefaultCase extends pn {
    linkToSwitch(t) {
        if (t.defaultCase !== void 0) {
            throw createMappedError(816);
        }
        t.defaultCase = this;
    }
};

vn = __decorate([ templateController("default-case") ], vn);

let bn = class PromiseTemplateController {
    constructor() {
        this.preSettledTask = null;
        this.postSettledTask = null;
        this.f = c(Xe);
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
        return y(i.activate(t, s, this.viewScope = j.fromParent(s.scope, {})), (() => this.swap(t)));
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
                if (this.preSettledTask.status === wt) {
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
                if (this.preSettledTask.status === wt) {
                    void h.then(reject);
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

__decorate([ bindable ], bn.prototype, "value", void 0);

bn = __decorate([ templateController("promise") ], bn);

let xn = class PendingTemplateController {
    constructor() {
        this.view = void 0;
        this.f = c(Xe);
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
}) ], xn.prototype, "value", void 0);

xn = __decorate([ templateController(xt) ], xn);

let wn = class FulfilledTemplateController {
    constructor() {
        this.view = void 0;
        this.f = c(Xe);
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
}) ], wn.prototype, "value", void 0);

wn = __decorate([ templateController("then") ], wn);

let yn = class RejectedTemplateController {
    constructor() {
        this.view = void 0;
        this.f = c(Xe);
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
}) ], yn.prototype, "value", void 0);

yn = __decorate([ templateController("catch") ], yn);

function getPromiseController(t) {
    const e = t.parent;
    const i = e?.viewModel;
    if (i instanceof bn) {
        return i;
    }
    throw createMappedError(813);
}

let kn = class PromiseAttributePattern {
    "promise.resolve"(t, e, i) {
        return new AttrSyntax(t, e, "promise", "bind");
    }
};

kn = __decorate([ attributePattern({
    pattern: "promise.resolve",
    symbols: ""
}) ], kn);

let Cn = class FulfilledAttributePattern {
    then(t, e, i) {
        return new AttrSyntax(t, e, "then", "from-view");
    }
};

Cn = __decorate([ attributePattern({
    pattern: "then",
    symbols: ""
}) ], Cn);

let An = class RejectedAttributePattern {
    catch(t, e, i) {
        return new AttrSyntax(t, e, "catch", "from-view");
    }
};

An = __decorate([ attributePattern({
    pattern: "catch",
    symbols: ""
}) ], An);

class Focus {
    constructor() {
        this.Di = false;
        this.Mi = c(ne);
        this.p = c(se);
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) {
            this.qi();
        } else {
            this.Di = true;
        }
    }
    attached() {
        if (this.Di) {
            this.Di = false;
            this.qi();
        }
        this.Mi.addEventListener("focus", this);
        this.Mi.addEventListener("blur", this);
    }
    detaching() {
        const t = this.Mi;
        t.removeEventListener("focus", this);
        t.removeEventListener("blur", this);
    }
    handleEvent(t) {
        if (t.type === "focus") {
            this.value = true;
        } else if (!this.Fi) {
            this.value = false;
        }
    }
    qi() {
        const t = this.Mi;
        const e = this.Fi;
        const i = this.value;
        if (i && !e) {
            t.focus();
        } else if (!i && e) {
            t.blur();
        }
    }
    get Fi() {
        return this.Mi === this.p.document.activeElement;
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
        const t = c(Xe);
        const e = c(oe);
        const i = c(se);
        this.p = i;
        this.Hi = i.document.createElement("div");
        (this.view = t.create()).setLocation(this.Oi = createLocation(i));
        setEffectiveParentNode(this.view.nodes, e);
    }
    attaching(t) {
        if (this.callbackContext == null) {
            this.callbackContext = this.$controller.scope.bindingContext;
        }
        const e = this.Hi = this.Vi();
        this.Ni(e, this.position);
        return this.$i(t, e);
    }
    detaching(t) {
        return this.Wi(t, this.Hi);
    }
    targetChanged() {
        const {$controller: t} = this;
        if (!t.isActive) {
            return;
        }
        const e = this.Vi();
        if (this.Hi === e) {
            return;
        }
        this.Hi = e;
        const i = y(this.Wi(null, e), (() => {
            this.Ni(e, this.position);
            return this.$i(null, e);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    positionChanged() {
        const {$controller: t, Hi: e} = this;
        if (!t.isActive) {
            return;
        }
        const i = y(this.Wi(null, e), (() => {
            this.Ni(e, this.position);
            return this.$i(null, e);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    $i(t, e) {
        const {activating: i, callbackContext: s, view: n} = this;
        return y(i?.call(s, e, n), (() => this.ji(t, e)));
    }
    ji(t, e) {
        const {$controller: i, view: s} = this;
        if (t === null) {
            s.nodes.insertBefore(this.Oi);
        } else {
            return y(s.activate(t ?? s, i, i.scope), (() => this.zi(e)));
        }
        return this.zi(e);
    }
    zi(t) {
        const {activated: e, callbackContext: i, view: s} = this;
        return e?.call(i, t, s);
    }
    Wi(t, e) {
        const {deactivating: i, callbackContext: s, view: n} = this;
        return y(i?.call(s, e, n), (() => this.Ui(t, e)));
    }
    Ui(t, e) {
        const {$controller: i, view: s} = this;
        if (t === null) {
            s.nodes.remove();
        } else {
            return y(s.deactivate(t, i), (() => this.Gi(e)));
        }
        return this.Gi(e);
    }
    Gi(t) {
        const {deactivated: e, callbackContext: i, view: s} = this;
        return y(e?.call(i, t, s), (() => this.Xi()));
    }
    Vi() {
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
    Xi() {
        this.Oi.remove();
        this.Oi.$start.remove();
    }
    Ni(t, e) {
        const i = this.Oi;
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

let Bn = class AuSlot {
    constructor() {
        this.Qi = null;
        this.Ki = null;
        this.Qt = false;
        this.expose = null;
        this.slotchange = null;
        this.Yi = new Set;
        this.di = null;
        const t = c(ds);
        const e = c(oe);
        const i = c(yi);
        const s = c(Xi);
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
            this.Zi = false;
        } else {
            a = l.createChild();
            a.useResources(t.parent.controller.container);
            registerResolver(a, ds, new d(void 0, t.parent));
            h = s.getViewFactory(r, a);
            this.Zi = true;
            this.Ji = l.getAll(Ze, false)?.filter((t => t.slotName === "*" || t.slotName === n.name)) ?? f;
        }
        this.ts = (this.Ji ?? (this.Ji = f)).length > 0;
        this.es = t;
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
        this.Yi.add(t);
    }
    unsubscribe(t) {
        this.Yi.delete(t);
    }
    binding(t, e) {
        this.Qi = this.$controller.scope.parent;
        let i;
        if (this.Zi) {
            i = this.es.controller.scope.parent;
            (this.Ki = j.fromParent(i, i.bindingContext)).overrideContext.$host = this.expose ?? this.Qi.bindingContext;
        }
    }
    attaching(t, e) {
        return y(this.view.activate(t, this.$controller, this.Zi ? this.Ki : this.Qi), (() => {
            if (this.ts) {
                this.Ji.forEach((t => t.watch(this)));
                this.ii();
                this.ss();
                this.Qt = true;
            }
        }));
    }
    detaching(t, e) {
        this.Qt = false;
        this.rs();
        this.Ji.forEach((t => t.unwatch(this)));
        return this.view.deactivate(t, this.$controller);
    }
    exposeChanged(t) {
        if (this.Zi && this.Ki != null) {
            this.Ki.overrideContext.$host = t;
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
        if (this.di != null) {
            return;
        }
        const t = this.l;
        const e = t.parentElement;
        if (e == null) {
            return;
        }
        (this.di = createMutationObserver(e, (e => {
            if (isMutationWithinLocation(t, e)) {
                this.ss();
            }
        }))).observe(e, {
            childList: true
        });
    }
    rs() {
        this.di?.disconnect();
        this.di = null;
    }
    ss() {
        const t = this.nodes;
        const e = new Set(this.Yi);
        let i;
        if (this.Qt) {
            this.slotchange?.call(void 0, this.name, t);
        }
        for (i of e) {
            i.handleSlotChange(this, t);
        }
    }
};

__decorate([ bindable ], Bn.prototype, "expose", void 0);

__decorate([ bindable ], Bn.prototype, "slotchange", void 0);

Bn = __decorate([ customElement({
    name: "au-slot",
    template: null,
    containerless: true
}) ], Bn);

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
        this.os = void 0;
        this.c = c(b);
        this.parent = c(fs);
        this.host = c(ne);
        this.l = c(oe);
        this.p = c(se);
        this.r = c(Xi);
        this.ls = c(yi);
        this.cs = c(_(CompositionContextFactory));
        this.ut = c(ki);
        this.ht = c(ds);
        this.ep = c(N);
        this.oL = c($);
    }
    get composing() {
        return this.us;
    }
    get composition() {
        return this.os;
    }
    attaching(t, e) {
        return this.us = y(this.queue(new ChangeInfo(this.template, this.component, this.model, void 0), t), (t => {
            if (this.cs.ds(t)) {
                this.us = void 0;
            }
        }));
    }
    detaching(t) {
        const e = this.os;
        const i = this.us;
        this.cs.invalidate();
        this.os = this.us = void 0;
        return y(i, (() => e?.deactivate(t)));
    }
    propertyChanged(t) {
        if (t === "composing" || t === "composition") return;
        if (t === "model" && this.os != null) {
            this.os.update(this.model);
            return;
        }
        this.us = y(this.us, (() => y(this.queue(new ChangeInfo(this.template, this.component, this.model, t), void 0), (t => {
            if (this.cs.ds(t)) {
                this.us = void 0;
            }
        }))));
    }
    queue(t, e) {
        const i = this.cs;
        const s = this.os;
        return y(i.create(t), (t => {
            if (i.ds(t)) {
                return y(this.compose(t), (n => {
                    if (i.ds(t)) {
                        return y(n.activate(e), (() => {
                            if (i.ds(t)) {
                                this.os = n;
                                return y(s?.deactivate(e), (() => t));
                            } else {
                                return y(n.controller.deactivate(n.controller, this.$controller), (() => {
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
        const {gs: i, ps: s, vs: n} = t.change;
        const {c: r, host: l, $controller: h, l: a, ls: c} = this;
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
            e = this.bs(d, s, m);
        } else {
            m = a ?? l;
            e = this.bs(d, s, m);
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
                }, this.ht.parent);
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
                const p = SpreadBinding.create(g, m, u, this.r, this.ut, this.p, this.ep, this.oL);
                p.forEach((t => a.addBinding(t)));
                return new CompositionController(a, (t => a.activate(t ?? a, h, h.scope.parent)), (t => y(a.deactivate(t ?? a, h), removeCompositionHost)), (t => e.activate?.(t)), t);
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
            return y(e.activate(n), (() => compose()));
        } else {
            return compose();
        }
    }
    bs(t, e, i) {
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
    ds(t) {
        return t.id === this.id;
    }
    create(t) {
        return y(t.load(), (t => new CompositionContext(++this.id, t)));
    }
    invalidate() {
        this.id++;
    }
}

class ChangeInfo {
    constructor(t, e, i, s) {
        this.gs = t;
        this.ps = e;
        this.vs = i;
        this.xs = s;
    }
    load() {
        if (isPromise(this.gs) || isPromise(this.ps)) {
            return Promise.all([ this.gs, this.ps ]).then((([t, e]) => new LoadedChangeInfo(t, e, this.vs, this.xs)));
        } else {
            return new LoadedChangeInfo(this.gs, this.ps, this.vs, this.xs);
        }
    }
}

class LoadedChangeInfo {
    constructor(t, e, i, s) {
        this.gs = t;
        this.ps = e;
        this.vs = i;
        this.xs = s;
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

const Sn = /*@__PURE__*/ Wt("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw createMappedError(99, "sanitize");
    }
})));

class SanitizeValueConverter {
    constructor() {
        this.ws = c(Sn);
    }
    toView(t) {
        if (t == null) {
            return null;
        }
        return this.ws.sanitize(t);
    }
}

valueConverter("sanitize")(SanitizeValueConverter);

const _n = /*@__PURE__*/ Wt("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const Rn = {};

class TemplateElementFactory {
    constructor() {
        this.p = c(se);
        this.gs = this.t();
    }
    t() {
        return this.p.document.createElement("template");
    }
    createTemplate(t) {
        if (isString(t)) {
            let e = Rn[t];
            if (e === void 0) {
                const i = this.gs;
                i.innerHTML = t;
                const s = i.content.firstElementChild;
                if (needsWrapping(s)) {
                    this.gs = this.t();
                    e = i;
                } else {
                    i.content.removeChild(s);
                    e = s;
                }
                Rn[t] = e;
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
        t.register(jt(this, this), zt(this, ki));
    }
    compile(t, e, i) {
        const s = CustomElementDefinition.getOrCreate(t);
        if (s.template === null || s.template === void 0) {
            return s;
        }
        if (s.needsCompile === false) {
            return s;
        }
        i ?? (i = Pn);
        const n = new CompilationContext(t, e, i, null, null, void 0);
        const r = isString(s.template) || !t.enhance ? n.ys.createTemplate(s.template) : s.template;
        const l = r.nodeName === In && r.content != null;
        const h = l ? r.content : r;
        const a = e.get(allResources(Vn));
        const c = a.length;
        let u = 0;
        if (c > 0) {
            while (c > u) {
                a[u].compiling?.(r);
                ++u;
            }
        }
        if (r.hasAttribute(On)) {
            throw createMappedError(701, s);
        }
        this.ks(h, n);
        this.Cs(h, n);
        return CustomElementDefinition.create({
            ...t,
            name: t.name || ke(),
            dependencies: (t.dependencies ?? f).concat(n.deps ?? f),
            instructions: n.rows,
            surrogates: l ? this.As(r, n) : f,
            template: r,
            hasSlots: n.hasSlot,
            needsCompile: false
        });
    }
    compileSpread(t, e, i, s, n) {
        const r = new CompilationContext(t, i, Pn, null, null, void 0);
        const l = [];
        const h = n ?? r.Bs(s.nodeName.toLowerCase());
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
        let A;
        let B;
        for (;u > f; ++f) {
            d = e[f];
            A = d.target;
            B = d.rawValue;
            w = r.Ss(d);
            if (w !== null && w.type === Es) {
                Dn.node = s;
                Dn.attr = d;
                Dn.bindable = null;
                Dn.def = null;
                l.push(w.build(Dn, r.ep, r.m));
                continue;
            }
            m = r._s(A);
            if (m !== null) {
                if (m.isTemplateController) {
                    throw createMappedError(9998, A);
                }
                v = BindablesInfo.from(m, true);
                k = m.noMultiBindings === false && w === null && hasInlineBindings(B);
                if (k) {
                    p = this.Rs(s, B, m, r);
                } else {
                    x = v.primary;
                    if (w === null) {
                        y = c.parse(B, gt);
                        p = [ y === null ? new SetPropertyInstruction(B, x.name) : new InterpolationInstruction(y, x.name) ];
                    } else {
                        Dn.node = s;
                        Dn.attr = d;
                        Dn.bindable = x;
                        Dn.def = m;
                        p = [ w.build(Dn, r.ep, r.m) ];
                    }
                }
                (g ?? (g = [])).push(new HydrateAttributeInstruction(this.resolveResources ? m : m.name, m.aliases != null && m.aliases.includes(A) ? A : void 0, p));
                continue;
            }
            if (w === null) {
                y = c.parse(B, gt);
                if (a) {
                    v = BindablesInfo.from(h, false);
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
                if (a) {
                    v = BindablesInfo.from(h, false);
                    b = v.attrs[A];
                    if (b !== void 0) {
                        Dn.node = s;
                        Dn.attr = d;
                        Dn.bindable = b;
                        Dn.def = h;
                        l.push(new SpreadElementPropBindingInstruction(w.build(Dn, r.ep, r.m)));
                        continue;
                    }
                }
                Dn.node = s;
                Dn.attr = d;
                Dn.bindable = null;
                Dn.def = null;
                l.push(w.build(Dn, r.ep, r.m));
            }
        }
        resetCommandBuildInfo();
        if (g != null) {
            return g.concat(l);
        }
        return l;
    }
    As(t, e) {
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
            if (Mn[w]) {
                throw createMappedError(702, a);
            }
            v = e.Ss(u);
            if (v !== null && v.type === Es) {
                Dn.node = t;
                Dn.attr = u;
                Dn.bindable = null;
                Dn.def = null;
                i.push(v.build(Dn, e.ep, e.m));
                continue;
            }
            f = e._s(w);
            if (f !== null) {
                if (f.isTemplateController) {
                    throw createMappedError(703, w);
                }
                g = BindablesInfo.from(f, true);
                x = f.noMultiBindings === false && v === null && hasInlineBindings(y);
                if (x) {
                    m = this.Rs(t, y, f, e);
                } else {
                    p = g.primary;
                    if (v === null) {
                        b = n.parse(y, gt);
                        m = [ b === null ? new SetPropertyInstruction(y, p.name) : new InterpolationInstruction(b, p.name) ];
                    } else {
                        Dn.node = t;
                        Dn.attr = u;
                        Dn.bindable = p;
                        Dn.def = f;
                        m = [ v.build(Dn, e.ep, e.m) ];
                    }
                }
                t.removeAttribute(a);
                --l;
                --r;
                (d ?? (d = [])).push(new HydrateAttributeInstruction(this.resolveResources ? f : f.name, f.aliases != null && f.aliases.includes(w) ? w : void 0, m));
                continue;
            }
            if (v === null) {
                b = n.parse(y, gt);
                if (b != null) {
                    t.removeAttribute(a);
                    --l;
                    --r;
                    i.push(new InterpolationInstruction(b, e.m.map(t, w) ?? C(w)));
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
                Dn.node = t;
                Dn.attr = u;
                Dn.bindable = null;
                Dn.def = null;
                i.push(v.build(Dn, e.ep, e.m));
            }
        }
        resetCommandBuildInfo();
        if (d != null) {
            return d.concat(i);
        }
        return i;
    }
    Cs(t, e) {
        switch (t.nodeType) {
          case 1:
            switch (t.nodeName) {
              case "LET":
                return this.Is(t, e);

              default:
                return this.Ts(t, e);
            }

          case 3:
            return this.Es(t, e);

          case 11:
            {
                let i = t.firstChild;
                while (i !== null) {
                    i = this.Cs(i, e);
                }
                break;
            }
        }
        return t.nextSibling;
    }
    Is(t, e) {
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
            d = e.Ss(c);
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
        return this.Ps(t, e).nextSibling;
    }
    Ts(t, e) {
        var i, n, r, l;
        const h = t.nextSibling;
        const a = (t.getAttribute("as-element") ?? t.nodeName).toLowerCase();
        const c = e.Bs(a);
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
        let I;
        let T = null;
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
            _ = e.Pe.parse(B, S);
            O = e.Ss(_);
            $ = _.target;
            W = _.rawValue;
            if (m && (!g || g && m($))) {
                if (O != null && O.type === Es) {
                    b();
                    p.push(_);
                    continue;
                }
                U = $ !== zn && $ !== "slot";
                if (U) {
                    V = BindablesInfo.from(c, false);
                    if (V.attrs[$] == null && !e._s($)?.isTemplateController) {
                        b();
                        p.push(_);
                        continue;
                    }
                }
            }
            if (O !== null && O.type === Es) {
                Dn.node = t;
                Dn.attr = _;
                Dn.bindable = null;
                Dn.def = null;
                (R ?? (R = [])).push(O.build(Dn, e.ep, e.m));
                b();
                continue;
            }
            T = e._s($);
            if (T !== null) {
                V = BindablesInfo.from(T, true);
                E = T.noMultiBindings === false && O === null && hasInlineBindings(W);
                if (E) {
                    D = this.Rs(t, W, T, e);
                } else {
                    N = V.primary;
                    if (O === null) {
                        F = v.parse(W, gt);
                        D = [ F === null ? new SetPropertyInstruction(W, N.name) : new InterpolationInstruction(F, N.name) ];
                    } else {
                        Dn.node = t;
                        Dn.attr = _;
                        Dn.bindable = N;
                        Dn.def = T;
                        D = [ O.build(Dn, e.ep, e.m) ];
                    }
                }
                b();
                if (T.isTemplateController) {
                    (M ?? (M = [])).push(new HydrateTemplateController(Ln, this.resolveResources ? T : T.name, void 0, D));
                } else {
                    (L ?? (L = [])).push(new HydrateAttributeInstruction(this.resolveResources ? T : T.name, T.aliases != null && T.aliases.includes($) ? $ : void 0, D));
                }
                continue;
            }
            if (O === null) {
                if (u) {
                    V = BindablesInfo.from(c, false);
                    P = V.attrs[$];
                    if (P !== void 0) {
                        F = v.parse(W, gt);
                        (I ?? (I = [])).push(F == null ? new SetPropertyInstruction(W, P.name) : new InterpolationInstruction(F, P.name));
                        b();
                        continue;
                    }
                }
                F = v.parse(W, gt);
                if (F != null) {
                    b();
                    (R ?? (R = [])).push(new InterpolationInstruction(F, e.m.map(t, $) ?? C($)));
                }
                continue;
            }
            b();
            if (u) {
                V = BindablesInfo.from(c, false);
                P = V.attrs[$];
                if (P !== void 0) {
                    Dn.node = t;
                    Dn.attr = _;
                    Dn.bindable = P;
                    Dn.def = c;
                    (I ?? (I = [])).push(O.build(Dn, e.ep, e.m));
                    continue;
                }
            }
            Dn.node = t;
            Dn.attr = _;
            Dn.bindable = null;
            Dn.def = null;
            (R ?? (R = [])).push(O.build(Dn, e.ep, e.m));
        }
        resetCommandBuildInfo();
        if (this.Ls(t, R) && R != null && R.length > 1) {
            this.Ds(t, R);
        }
        if (u) {
            H = new HydrateElementInstruction(this.resolveResources ? c : c.name, void 0, I ?? f, null, z, p);
            if (a === zn) {
                const i = t.getAttribute("name") || jn;
                const s = e.t();
                const n = e.Ms();
                let r = t.firstChild;
                let l = 0;
                while (r !== null) {
                    if (isElement(r) && r.hasAttribute(zn)) {
                        t.removeChild(r);
                    } else {
                        appendToTemplate(s, r);
                        l++;
                    }
                    r = t.firstChild;
                }
                if (l > 0) {
                    this.Cs(s.content, n);
                }
                H.auSlot = {
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
        if (R != null || H != null || L != null) {
            w = f.concat(H ?? f, L ?? f, R ?? f);
            G = true;
        }
        let X;
        if (M != null) {
            y = M.length - 1;
            k = y;
            q = M[k];
            let s;
            if (isMarker(t)) {
                s = e.t();
                appendManyToTemplate(s, [ e.wt(), e.qs(Tn), e.qs(En) ]);
            } else {
                this.Fs(t, e);
                if (t.nodeName === "TEMPLATE") {
                    s = t;
                } else {
                    s = e.t();
                    appendToTemplate(s, t);
                }
            }
            const r = s;
            const l = e.Ms(w == null ? [] : [ w ]);
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
                    f = isElement(S) ? S.getAttribute(zn) : null;
                    m = f !== null || u && !d;
                    h = S.nextSibling;
                    if (m) {
                        if (!u) {
                            throw createMappedError(706, f, a);
                        }
                        S.removeAttribute?.(zn);
                        _ = isTextNode(S) && S.textContent.trim() === "";
                        if (!_) {
                            ((i = p ?? (p = {}))[n = f || jn] ?? (i[n] = [])).push(S);
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
                    C = e.Ms();
                    this.Cs(s.content, C);
                    g[f] = CustomElementDefinition.create({
                        name: ke(),
                        template: s,
                        instructions: C.rows,
                        needsCompile: false
                    });
                }
                H.projections = g;
            }
            if (G) {
                if (u && (z || c.containerless)) {
                    this.Fs(t, e);
                } else {
                    this.Ps(t, e);
                }
            }
            X = !u || !c.containerless && !z && j !== false;
            if (X) {
                if (t.nodeName === In) {
                    this.Cs(t.content, l);
                } else {
                    S = t.firstChild;
                    while (S !== null) {
                        S = this.Cs(S, l);
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
                q = M[k];
                s = e.t();
                x = e.wt();
                appendManyToTemplate(s, [ x, e.qs(Tn), e.qs(En) ]);
                q.def = CustomElementDefinition.create({
                    name: ke(),
                    template: s,
                    needsCompile: false,
                    instructions: [ [ M[k + 1] ] ]
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
            let h = false;
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
                    n = isElement(i) ? i.getAttribute(zn) : null;
                    h = n !== null || u && !d;
                    s = i.nextSibling;
                    if (h) {
                        if (!u) {
                            throw createMappedError(706, n, a);
                        }
                        i.removeAttribute?.(zn);
                        x = isTextNode(i) && i.textContent.trim() === "";
                        if (!x) {
                            ((r = m ?? (m = {}))[l = n || jn] ?? (r[l] = [])).push(i);
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
                        if (p.nodeName === In) {
                            if (p.attributes.length > 0) {
                                appendToTemplate(v, p);
                            } else {
                                appendToTemplate(v, p.content);
                            }
                        } else {
                            appendToTemplate(v, p);
                        }
                    }
                    b = e.Ms();
                    this.Cs(v.content, b);
                    f[n] = CustomElementDefinition.create({
                        name: ke(),
                        template: v,
                        instructions: b.rows,
                        needsCompile: false
                    });
                }
                H.projections = f;
            }
            if (G) {
                if (u && (z || c.containerless)) {
                    this.Fs(t, e);
                } else {
                    this.Ps(t, e);
                }
            }
            X = !u || !c.containerless && !z && j !== false;
            if (X && t.childNodes.length > 0) {
                i = t.firstChild;
                while (i !== null) {
                    i = this.Cs(i, e);
                }
            }
        }
        return h;
    }
    Es(t, e) {
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
                insertBefore(i, e.Hs(c), t);
            }
            for (h = 0, a = l.length; a > h; ++h) {
                insertManyBefore(i, t, [ e.wt(), e.Hs(" ") ]);
                if (c = r[h + 1]) {
                    insertBefore(i, e.Hs(c), t);
                }
                e.rows.push([ new TextBindingInstruction(l[h]) ]);
            }
            i.removeChild(t);
        }
        return n;
    }
    Rs(t, e, i, s) {
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
                m = s.Ss(d);
                g = n.attrs[d.target];
                if (g == null) {
                    throw createMappedError(707, d.target, i.name);
                }
                if (m === null) {
                    f = s.ep.parse(a, gt);
                    l.push(f === null ? new SetPropertyInstruction(a, g.name) : new InterpolationInstruction(f, g.name));
                } else {
                    Dn.node = t;
                    Dn.attr = d;
                    Dn.bindable = g;
                    Dn.def = i;
                    l.push(m.build(Dn, s.ep, s.m));
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
    ks(t, e) {
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
                const l = R(e.attributes).filter((t => !Hn.includes(t.name)));
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
            e.Os(defineElement({
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
    Ls(t, e) {
        const i = t.nodeName;
        return i === "INPUT" && qn[t.type] === 1 || i === "SELECT" && (t.hasAttribute("multiple") || e?.some((t => t.type === oi && t.to === "multiple")));
    }
    Ds(t, e) {
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
    Ps(t, e) {
        insertBefore(t.parentNode, e.qs("au*"), t);
        return t;
    }
    Fs(t, e) {
        if (isMarker(t)) {
            return t;
        }
        const i = t.parentNode;
        const s = e.wt();
        insertManyBefore(i, t, [ s, e.qs(Tn), e.qs(En) ]);
        i.removeChild(t);
        return s;
    }
}

const In = "TEMPLATE";

const Tn = "au-start";

const En = "au-end";

const isMarker = t => t.nodeValue === "au*";

class CompilationContext {
    constructor(t, e, i, s, n, r) {
        this.hasSlot = false;
        this.Vs = createLookup();
        const l = s !== null;
        this.c = e;
        this.root = n === null ? this : n;
        this.def = t;
        this.ci = i;
        this.parent = s;
        this.ys = l ? s.ys : e.get(_n);
        this.Pe = l ? s.Pe : e.get(ys);
        this.ep = l ? s.ep : e.get(N);
        this.m = l ? s.m : e.get(Xs);
        this.Pi = l ? s.Pi : e.get(S);
        this.p = l ? s.p : e.get(se);
        this.localEls = l ? s.localEls : new Set;
        this.rows = r ?? [];
    }
    Os(t) {
        var e;
        ((e = this.root).deps ?? (e.deps = [])).push(t);
        this.root.c.register(t);
    }
    Hs(t) {
        return createText(this.p, t);
    }
    qs(t) {
        return createComment(this.p, t);
    }
    wt() {
        return this.qs("au*");
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
    Bs(t) {
        return this.c.find(Ae, t);
    }
    _s(t) {
        return this.c.find(ge, t);
    }
    Ms(t) {
        return new CompilationContext(this.def, this.c, this.ci, this, this.root, t);
    }
    Ss(t) {
        if (this.root !== this) {
            return this.root.Ss(t);
        }
        const e = t.command;
        if (e === null) {
            return null;
        }
        let i = this.Vs[e];
        if (i === void 0) {
            i = this.c.create(Ls, e);
            if (i === null) {
                throw createMappedError(713, e);
            }
            this.Vs[e] = i;
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
    Dn.node = Dn.attr = Dn.bindable = Dn.def = null;
};

const Pn = {
    projections: null
};

const Ln = {
    name: "unnamed"
};

const Dn = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const Mn = at(createLookup(), {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
});

const qn = {
    checkbox: 1,
    radio: 1
};

const Fn = new WeakMap;

class BindablesInfo {
    static from(t, e) {
        let i = Fn.get(t);
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
            Fn.set(t, i = new BindablesInfo(n, s, c));
        }
        return i;
    }
    constructor(t, e, i) {
        this.attrs = t;
        this.bindables = e;
        this.primary = i;
    }
}

const Hn = ht([ "name", "attribute", "mode" ]);

const On = "as-custom-element";

const processTemplateName = (t, e, i) => {
    const s = e.getAttribute(On);
    if (s === null || s === "") {
        throw createMappedError(715, t);
    }
    if (i.has(s)) {
        throw createMappedError(716, s, t);
    } else {
        i.add(s);
        e.removeAttribute(On);
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

const Vn = /*@__PURE__*/ Wt("ITemplateCompilerHooks");

const Nn = new WeakMap;

const $n = /*@__PURE__*/ qt("compiler-hooks");

const Wn = ht({
    name: $n,
    define(t) {
        let e = Nn.get(t);
        if (e === void 0) {
            Nn.set(t, e = new TemplateCompilerHooksDefinition(t));
            Pt($n, e, t);
            Ft(t, $n);
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
        t.register(jt(Vn, this.Type));
    }
}

const templateCompilerHooks = t => {
    return t === void 0 ? decorator : decorator(t);
    function decorator(t) {
        return Wn.define(t);
    }
};

const jn = "default";

const zn = "au-slot";

class Show {
    constructor() {
        this.el = c(ne);
        this.p = c(se);
        this.Ns = false;
        this.U = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.U = null;
            if (Boolean(this.value) !== this.$s) {
                if (this.$s === this.Ws) {
                    this.$s = !this.Ws;
                    this.$val = this.el.style.getPropertyValue("display");
                    this.$prio = this.el.style.getPropertyPriority("display");
                    this.el.style.setProperty("display", "none", "important");
                } else {
                    this.$s = this.Ws;
                    this.el.style.setProperty("display", this.$val, this.$prio);
                    if (this.el.getAttribute("style") === "") {
                        this.el.removeAttribute("style");
                    }
                }
            }
        };
        const t = c(yi);
        this.$s = this.Ws = t.alias !== "hide";
    }
    binding() {
        this.Ns = true;
        this.update();
    }
    detaching() {
        this.Ns = false;
        this.U?.cancel();
        this.U = null;
    }
    valueChanged() {
        if (this.Ns && this.U === null) {
            this.U = this.p.domWriteQueue.queueTask(this.update);
        }
    }
}

__decorate([ bindable ], Show.prototype, "value", void 0);

alias("hide")(Show);

customAttribute("show")(Show);

const Un = [ TemplateCompiler, et, NodeObserverLocator ];

const Gn = [ Ss, Bs, Is ];

const Xn = [ Rs, _s ];

const Qn = [ Hs, Ds, qs, Ms, Fs, Os, zs, Vs, Ns, js, Ws, $s, Us ];

const Kn = [ DebounceBindingBehavior, OneTimeBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, SignalBindingBehavior, ThrottleBindingBehavior, TwoWayBindingBehavior, SanitizeValueConverter, If, Else, Repeat, With, mn, pn, vn, bn, xn, wn, yn, kn, Cn, An, AttrBindingBehavior, SelfBindingBehavior, UpdateTriggerBindingBehavior, AuCompose, Portal, Focus, Show, Bn ];

const Yn = [ Ei, Pi, Ii, Ti, Ai, Bi, Si, _i, Ri, Di, Oi, Mi, qi, Fi, Hi, Li, Vi ];

const Zn = /*@__PURE__*/ createConfiguration(s);

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
            return e.register(Ut(W, i.coercingOptions), ...Un, ...Kn, ...Gn, ...Qn, ...Yn);
        },
        customize(e) {
            return createConfiguration(e ?? t);
        }
    };
}

function children(t, e) {
    if (!er) {
        er = true;
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
    constructor(t, e, i, s = defaultChildQuery, n = defaultChildFilter, r = defaultChildMap, l = Jn) {
        this.js = void 0;
        this.ot = defaultChildQuery;
        this.zs = defaultChildFilter;
        this.Us = defaultChildMap;
        this.isBound = false;
        this.G = t;
        this.obj = e;
        this.cb = i;
        this.ot = s;
        this.zs = n;
        this.Us = r;
        this.et = l;
        this.di = createMutationObserver(this.Gs = t.host, (() => {
            this.Xs();
        }));
    }
    getValue() {
        return this.isBound ? this.js : this.Qs();
    }
    setValue(t) {}
    bind() {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        this.di.observe(this.Gs, this.et);
        this.js = this.Qs();
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.di.disconnect();
        this.js = f;
    }
    Xs() {
        this.js = this.Qs();
        this.cb?.call(this.obj);
        this.subs.notify(this.js, undefined);
    }
    get() {
        throw createMappedError(99, "get");
    }
    Qs() {
        return filterChildren(this.G, this.ot, this.zs, this.Us);
    }
}

const Jn = {
    childList: true
};

const defaultChildQuery = t => t.host.childNodes;

const defaultChildFilter = (t, e, i) => !!i;

const defaultChildMap = (t, e, i) => i;

const tr = {
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
        a = findElementControllerFor(h, tr);
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
        Ut(Oe, this).register(t);
    }
    hydrating(t, e) {
        const i = this.lt;
        const s = new ChildrenBinding(e, t, t[i.callback ?? `${rt(i.name)}Changed`], i.query ?? defaultChildQuery, i.filter ?? defaultChildFilter, i.map ?? defaultChildMap, i.options ?? Jn);
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

let er = false;

export { AdoptedStyleSheetsStyles, AppRoot, ie as AppTask, Rs as AtPrefixedTriggerAttributePattern, AttrBindingBehavior, $s as AttrBindingCommand, AttrSyntax, AttributeBinding, AttributeBindingInstruction, Oi as AttributeBindingRenderer, AttributeNSAccessor, As as AttributePattern, AuCompose, Bn as AuSlot, AuSlotsInfo, Aurelia, Nt as Bindable, BindableDefinition, BindablesInfo, Qt as BindingBehavior, BindingBehaviorDefinition, Ls as BindingCommand, BindingCommandDefinition, It as BindingMode, BindingModeBehavior, BindingTargetSubscriber, CSSModulesProcessorRegistry, Ns as CaptureBindingCommand, pn as Case, CheckedObserver, ChildrenBinding, ClassAttributeAccessor, js as ClassBindingCommand, _s as ColonPrefixedBindAttributePattern, ComputedWatcher, ContentBinding, Controller, ge as CustomAttribute, CustomAttributeDefinition, Si as CustomAttributeRenderer, Ae as CustomElement, CustomElementDefinition, Bi as CustomElementRenderer, DataAttributeAccessor, DebounceBindingBehavior, Hs as DefaultBindingCommand, Qn as DefaultBindingLanguage, Gn as DefaultBindingSyntax, vn as DefaultCase, Un as DefaultComponents, Yn as DefaultRenderers, Kn as DefaultResources, Bs as DotSeparatedAttributePattern, Else, ExpressionWatcher, FlushQueue, Focus, Os as ForBindingCommand, FragmentNodeSequence, FromViewBindingBehavior, qs as FromViewBindingCommand, wn as FulfilledTemplateController, HydrateAttributeInstruction, HydrateElementInstruction, HydrateLetElementInstruction, HydrateTemplateController, vs as IAppRoot, ee as IAppTask, Xs as IAttrMapper, ys as IAttributeParser, ws as IAttributePattern, Ze as IAuSlotWatcher, Ye as IAuSlotsInfo, bs as IAurelia, fs as IController, re as IEventTarget, Le as IFlushQueue, ue as IHistory, ds as IHydrationContext, yi as IInstruction, Oe as ILifecycleHooks, ce as ILocation, ne as INode, se as IPlatform, oe as IRenderLocation, Ci as IRenderer, Xi as IRendering, Gs as ISVGAnalyzer, Sn as ISanitizer, Re as IShadowDOMGlobalStyles, _e as IShadowDOMStyles, xs as ISyntaxInterpreter, ki as ITemplateCompiler, Vn as ITemplateCompilerHooks, _n as ITemplateElementFactory, Xe as IViewFactory, ae as IWindow, If, wi as InstructionType, InterpolationBinding, Ti as InterpolationBindingRenderer, InterpolationInstruction, InterpolationPartBinding, Interpretation, IteratorBindingInstruction, Pi as IteratorBindingRenderer, LetBinding, LetBindingInstruction, Ri as LetElementRenderer, $e as LifecycleHooks, LifecycleHooksDefinition, LifecycleHooksEntry, ListenerBinding, ListenerBindingInstruction, ListenerBindingOptions, Di as ListenerBindingRenderer, MultiAttrInstruction, NodeObserverLocator, NoopSVGAnalyzer, OneTimeBindingBehavior, Ds as OneTimeBindingCommand, xn as PendingTemplateController, Portal, bn as PromiseTemplateController, PropertyBinding, PropertyBindingInstruction, Ei as PropertyBindingRenderer, Ss as RefAttributePattern, RefBinding, RefBindingInstruction, Ii as RefBindingRenderer, yn as RejectedTemplateController, Rendering, Repeat, SVGAnalyzer, SanitizeValueConverter, SelectValueObserver, SelfBindingBehavior, SetAttributeInstruction, Mi as SetAttributeRenderer, SetClassAttributeInstruction, qi as SetClassAttributeRenderer, SetPropertyInstruction, Ai as SetPropertyRenderer, SetStyleAttributeInstruction, Fi as SetStyleAttributeRenderer, ShadowDOMRegistry, Xn as ShortHandBindingSyntax, SignalBindingBehavior, SpreadBindingInstruction, SpreadElementPropBindingInstruction, Vi as SpreadRenderer, Zn as StandardConfiguration, us as State, StyleAttributeAccessor, Ws as StyleBindingCommand, Ie as StyleConfiguration, StyleElementStyles, StylePropertyBindingInstruction, Hi as StylePropertyBindingRenderer, mn as Switch, TemplateCompiler, Wn as TemplateCompilerHooks, _i as TemplateControllerRenderer, TextBindingInstruction, Li as TextBindingRenderer, ThrottleBindingBehavior, ToViewBindingBehavior, Ms as ToViewBindingCommand, Vs as TriggerBindingCommand, TwoWayBindingBehavior, Fs as TwoWayBindingCommand, UpdateTriggerBindingBehavior, ValueAttributeObserver, Ee as ValueConverter, ValueConverterDefinition, ViewFactory, be as Watch, With, alias, allResources, attributePattern, bindable, bindingBehavior, bindingCommand, capture, children, coercer, containerless, convertToRenderLocation, cssModules, customAttribute, customElement, getEffectiveParentNode, getRef, isCustomElementController, isCustomElementViewModel, isInstruction, isRenderLocation, lifecycleHooks, mixinAstEvaluator, mixinUseScope, mixingBindingLimited, processContent, registerAliases, renderer, setEffectiveParentNode, setRef, shadowCSS, slotted, templateCompilerHooks, templateController, useShadowDOM, valueConverter, watch };
//# sourceMappingURL=index.mjs.map
