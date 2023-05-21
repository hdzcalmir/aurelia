import { Protocol as t, getPrototypeChain as e, kebabCase as i, noop as s, DI as n, Registration as r, firstDefined as l, mergeArrays as h, resolve as a, IPlatform as c, emptyArray as u, InstanceProvider as f, fromDefinitionOrDefault as d, pascalCase as m, fromAnnotationOrTypeOrDefault as g, fromAnnotationOrDefinitionOrTypeOrDefault as p, IContainer as v, optional as b, onResolveAll as x, onResolve as w, all as y, camelCase as k, IServiceLocator as A, emptyObject as C, ILogger as R, transient as S, toArray as B } from "@aurelia/kernel";

import { Metadata as _, isObject as T } from "@aurelia/metadata";

import { ISignaler as I, astEvaluate as E, connectable as L, ConnectableSwitcher as P, ProxyObservable as M, subscriberCollection as $, astBind as D, astUnbind as q, astAssign as U, IExpressionParser as F, IObserverLocator as H, ICoercionConfiguration as O, Scope as V, AccessScopeExpression as N, PropertyAccessor as j, IDirtyChecker as W, INodeObserverLocator as z, getObserverLookup as G, SetterObserver as X, createIndexMap as Q, applyMutationsToIndices as K, getCollectionObserver as Y, synchronizeIndices as Z, BindingContext as J, PrimitiveLiteralExpression as tt, DirtyChecker as et } from "@aurelia/runtime";

import { BrowserPlatform as it } from "@aurelia/platform-browser";

import { TaskAbortError as st } from "@aurelia/platform";

function __decorate(t, e, i, s) {
    var n = arguments.length, r = n < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, i) : s, l;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(t, e, i, s); else for (var h = t.length - 1; h >= 0; h--) if (l = t[h]) r = (n < 3 ? l(r) : n > 3 ? l(e, i, r) : l(e, i)) || r;
    return n > 3 && r && Object.defineProperty(e, i, r), r;
}

const nt = _.getOwn;

const rt = _.hasOwn;

const ot = _.define;

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

const createError = t => new Error(t);

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

const At = mt.is;

const Ct = Reflect.defineProperty;

const defineHiddenProp = (t, e, i) => {
    Ct(t, e, {
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
        ot(Rt, BindableDefinition.create(e, t, i), t.constructor, e);
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
    return t.startsWith(Rt);
}

const Rt = /*@__PURE__*/ at("bindable");

const St = bt({
    name: Rt,
    keyFrom: t => `${Rt}:${t}`,
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
        const i = Rt.length + 1;
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
                s[l++] = nt(Rt, c, h[u].slice(i));
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
    Bt.define(t, e);
}

const Bt = {
    key: /*@__PURE__*/ at("coercer"),
    define(t, e) {
        ot(Bt.key, t[e].bind(t), t);
    },
    for(t) {
        return nt(Bt.key, t);
    }
};

function getInterceptor(t, e, i = {}) {
    const n = i.type ?? _.get("design:type", e, t) ?? null;
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
            r = typeof t === "function" ? t.bind(n) : Bt.for(n) ?? s;
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

const _t = n.createInterface;

const Tt = r.singleton;

const It = r.aliasTo;

const Et = r.instance;

r.callback;

const Lt = r.transient;

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

function bindingBehavior(t) {
    return function(e) {
        return Mt.define(t, e);
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
        return new BindingBehaviorDefinition(e, l(getBehaviorAnnotation(e, "name"), i), h(getBehaviorAnnotation(e, "aliases"), s.aliases, e.aliases), Mt.keyFrom(i));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        Tt(i, e).register(t);
        It(i, e).register(t);
        registerAliases(s, Mt, i, t);
    }
}

const Pt = /*@__PURE__*/ ct("binding-behavior");

const getBehaviorAnnotation = (t, e) => nt(at(e), t);

const Mt = bt({
    name: Pt,
    keyFrom(t) {
        return `${Pt}:${t}`;
    },
    isType(t) {
        return isFunction(t) && rt(Pt, t);
    },
    define(t, e) {
        const i = BindingBehaviorDefinition.create(t, e);
        ot(Pt, i, i.Type);
        ot(Pt, i, i);
        ut(e, Pt);
        return i.Type;
    },
    getDefinition(t) {
        const e = nt(Pt, t);
        if (e === void 0) {
            throw createError(`AUR0151:${t.name}`);
        }
        return e;
    },
    annotate(t, e, i) {
        ot(at(e), i, t);
    },
    getAnnotation: getBehaviorAnnotation
});

const $t = new Map;

class BindingModeBehavior {
    bind(t, e) {
        $t.set(e, e.mode);
        e.mode = this.mode;
    }
    unbind(t, e) {
        e.mode = $t.get(e);
        $t.delete(e);
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

const Dt = new WeakMap;

const qt = 200;

class DebounceBindingBehavior {
    constructor() {
        this.p = a(c);
    }
    bind(t, e, i, s) {
        const n = {
            type: "debounce",
            delay: i ?? qt,
            now: this.p.performanceNow,
            queue: this.p.taskQueue,
            signals: isString(s) ? [ s ] : s ?? u
        };
        const r = e.limit?.(n);
        if (r == null) ; else {
            Dt.set(e, r);
        }
    }
    unbind(t, e) {
        Dt.get(e)?.dispose();
        Dt.delete(e);
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
            throw createError(`AUR0817`);
        }
        if (i.length === 0) {
            throw createError(`AUR0818`);
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

const Ut = new WeakMap;

const Ft = 200;

class ThrottleBindingBehavior {
    constructor() {
        ({performanceNow: this.A, taskQueue: this.C} = a(c));
    }
    bind(t, e, i, s) {
        const n = {
            type: "throttle",
            delay: i ?? Ft,
            now: this.A,
            queue: this.C,
            signals: isString(s) ? [ s ] : s ?? u
        };
        const r = e.limit?.(n);
        if (r == null) ; else {
            Ut.set(e, r);
        }
    }
    unbind(t, e) {
        Ut.get(e)?.dispose();
        Ut.delete(e);
    }
}

bindingBehavior("throttle")(ThrottleBindingBehavior);

const Ht = /*@__PURE__*/ _t("IAppTask");

class $AppTask {
    constructor(t, e, i) {
        this.c = void 0;
        this.slot = t;
        this.k = e;
        this.cb = i;
    }
    register(t) {
        return this.c = t.register(Et(Ht, this));
    }
    run() {
        const t = this.k;
        const e = this.cb;
        return t === null ? e() : e(this.c.get(t));
    }
}

const Ot = bt({
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

const Vt = c;

const Nt = "au-start";

const jt = "au-end";

const createElement = (t, e) => t.document.createElement(e);

const createComment = (t, e) => t.document.createComment(e);

const createLocation = t => {
    const e = createComment(t, jt);
    e.$start = createComment(t, Nt);
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

const markerToTarget = t => {
    const e = t.nextSibling;
    let i;
    let s;
    if (e == null) {
        throw markerMalformedError();
    }
    if (e.nodeType === 8) {
        if (e.textContent === "au-start") {
            i = e;
            if ((s = i.nextSibling) == null) {
                throw markerMalformedError();
            }
            t.remove();
            s.$start = i;
            return s;
        } else {
            throw markerMalformedError();
        }
    }
    t.remove();
    return e;
};

const createMutationObserver = (t, e) => new t.ownerDocument.defaultView.MutationObserver(e);

const markerMalformedError = () => createError(`AURxxxx`);

class Refs {}

function getRef(t, e) {
    return t.$au?.[e] ?? null;
}

function setRef(t, e, i) {
    var s;
    ((s = t).$au ?? (s.$au = new Refs))[e] = i;
}

const Wt = /*@__PURE__*/ _t("INode");

const zt = /*@__PURE__*/ _t("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(Ri, true)) {
        return t.get(Ri).host;
    }
    return t.get(Vt).document;
}))));

const Gt = /*@__PURE__*/ _t("IRenderLocation");

const Xt = /*@__PURE__*/ _t("CssModules");

const Qt = new WeakMap;

function getEffectiveParentNode(t) {
    if (Qt.has(t)) {
        return Qt.get(t);
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
            Qt.set(i[t], e);
        }
    } else {
        Qt.set(t, e);
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
        return this.R;
    }
    get lastChild() {
        return this.B;
    }
    constructor(t, e) {
        this.platform = t;
        this.next = void 0;
        this._ = false;
        this.T = false;
        this.ref = null;
        const i = (this.f = e).querySelectorAll("au-m");
        let s = 0;
        let n = i.length;
        let r = this.t = Array(n);
        while (n > s) {
            r[s] = markerToTarget(i[s]);
            ++s;
        }
        const l = e.childNodes;
        const h = this.childNodes = Array(n = l.length);
        s = 0;
        while (n > s) {
            h[s] = l[s];
            ++s;
        }
        this.R = e.firstChild;
        this.B = e.lastChild;
    }
    findTargets() {
        return this.t;
    }
    insertBefore(t) {
        if (this.T && !!this.ref) {
            this.addToLinked();
        } else {
            const e = t.parentNode;
            if (this._) {
                let i = this.R;
                let s;
                const n = this.B;
                while (i != null) {
                    s = i.nextSibling;
                    e.insertBefore(i, t);
                    if (i === n) {
                        break;
                    }
                    i = s;
                }
            } else {
                this._ = true;
                t.parentNode.insertBefore(this.f, t);
            }
        }
    }
    appendTo(t, e = false) {
        if (this._) {
            let e = this.R;
            let i;
            const s = this.B;
            while (e != null) {
                i = e.nextSibling;
                t.appendChild(e);
                if (e === s) {
                    break;
                }
                e = i;
            }
        } else {
            this._ = true;
            if (!e) {
                t.appendChild(this.f);
            }
        }
    }
    remove() {
        if (this._) {
            this._ = false;
            const t = this.f;
            const e = this.B;
            let i;
            let s = this.R;
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
        if (this._) {
            let i = this.R;
            let s;
            const n = this.B;
            while (i != null) {
                s = i.nextSibling;
                e.insertBefore(i, t);
                if (i === n) {
                    break;
                }
                i = s;
            }
        } else {
            this._ = true;
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

const Kt = /*@__PURE__*/ _t("IWindow", (t => t.callback((t => t.get(Vt).window))));

const Yt = /*@__PURE__*/ _t("ILocation", (t => t.callback((t => t.get(Kt).location))));

const Zt = /*@__PURE__*/ _t("IHistory", (t => t.callback((t => t.get(Kt).history))));

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
        return new CustomAttributeDefinition(e, l(getAttributeAnnotation(e, "name"), i), h(getAttributeAnnotation(e, "aliases"), s.aliases, e.aliases), getAttributeKeyFrom(i), l(getAttributeAnnotation(e, "defaultBindingMode"), s.defaultBindingMode, e.defaultBindingMode, 2), l(getAttributeAnnotation(e, "isTemplateController"), s.isTemplateController, e.isTemplateController, false), St.from(e, ...St.getAll(e), getAttributeAnnotation(e, "bindables"), e.bindables, s.bindables), l(getAttributeAnnotation(e, "noMultiBindings"), s.noMultiBindings, e.noMultiBindings, false), h(se.getAnnotation(e), e.watches), h(getAttributeAnnotation(e, "dependencies"), s.dependencies, e.dependencies));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        Lt(i, e).register(t);
        It(i, e).register(t);
        registerAliases(s, te, i, t);
    }
}

const Jt = ct("custom-attribute");

const getAttributeKeyFrom = t => `${Jt}:${t}`;

const getAttributeAnnotation = (t, e) => nt(at(e), t);

const isAttributeType = t => isFunction(t) && rt(Jt, t);

const findAttributeControllerFor = (t, e) => getRef(t, getAttributeKeyFrom(e)) ?? void 0;

const defineAttribute = (t, e) => {
    const i = CustomAttributeDefinition.create(t, e);
    ot(Jt, i, i.Type);
    ot(Jt, i, i);
    ut(e, Jt);
    return i.Type;
};

const getAttributeDefinition = t => {
    const e = nt(Jt, t);
    if (e === void 0) {
        throw createError(`AUR0759:${t.name}`);
    }
    return e;
};

const te = bt({
    name: Jt,
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
        throw createError(`AUR0772`);
    }
    return function decorator(i, s, n) {
        const r = s == null;
        const l = r ? i : i.constructor;
        const h = new WatchDefinition(t, r ? e : n.value);
        if (r) {
            if (!isFunction(e) && (e == null || !(e in l.prototype))) {
                throw createError(`AUR0773:${gt(e)}@${l.name}}`);
            }
        } else if (!isFunction(n?.value)) {
            throw createError(`AUR0774:${gt(s)}`);
        }
        se.add(l, h);
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

const ee = u;

const ie = at("watch");

const se = bt({
    name: ie,
    add(t, e) {
        let i = nt(ie, t);
        if (i == null) {
            ot(ie, i = [], t);
        }
        i.push(e);
    },
    getAnnotation(t) {
        return nt(ie, t) ?? ee;
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
    const e = nt(oe, t);
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

const ne = new WeakMap;

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
                throw createError(`AUR0761:${t}`);
            }
            const s = d("name", i, le);
            if (isFunction(i.Type)) {
                e = i.Type;
            } else {
                e = he(m(s));
            }
            return new CustomElementDefinition(e, s, h(i.aliases), d("key", i, (() => getElementKeyFrom(s))), d("cache", i, returnZero), d("capture", i, returnFalse), d("template", i, returnNull), h(i.instructions), h(i.dependencies), d("injectable", i, returnNull), d("needsCompile", i, returnTrue), h(i.surrogates), St.from(e, i.bindables), d("containerless", i, returnFalse), d("isStrictBinding", i, returnFalse), d("shadowOptions", i, returnNull), d("hasSlots", i, returnFalse), d("enhance", i, returnFalse), d("watches", i, returnEmptyArray), g("processContent", e, returnNull));
        }
        if (isString(t)) {
            return new CustomElementDefinition(e, t, h(getElementAnnotation(e, "aliases"), e.aliases), getElementKeyFrom(t), g("cache", e, returnZero), g("capture", e, returnFalse), g("template", e, returnNull), h(getElementAnnotation(e, "instructions"), e.instructions), h(getElementAnnotation(e, "dependencies"), e.dependencies), g("injectable", e, returnNull), g("needsCompile", e, returnTrue), h(getElementAnnotation(e, "surrogates"), e.surrogates), St.from(e, ...St.getAll(e), getElementAnnotation(e, "bindables"), e.bindables), g("containerless", e, returnFalse), g("isStrictBinding", e, returnFalse), g("shadowOptions", e, returnNull), g("hasSlots", e, returnFalse), g("enhance", e, returnFalse), h(se.getAnnotation(e), e.watches), g("processContent", e, returnNull));
        }
        const i = d("name", t, le);
        return new CustomElementDefinition(e, i, h(getElementAnnotation(e, "aliases"), t.aliases, e.aliases), getElementKeyFrom(i), p("cache", t, e, returnZero), p("capture", t, e, returnFalse), p("template", t, e, returnNull), h(getElementAnnotation(e, "instructions"), t.instructions, e.instructions), h(getElementAnnotation(e, "dependencies"), t.dependencies, e.dependencies), p("injectable", t, e, returnNull), p("needsCompile", t, e, returnTrue), h(getElementAnnotation(e, "surrogates"), t.surrogates, e.surrogates), St.from(e, ...St.getAll(e), getElementAnnotation(e, "bindables"), e.bindables, t.bindables), p("containerless", t, e, returnFalse), p("isStrictBinding", t, e, returnFalse), p("shadowOptions", t, e, returnNull), p("hasSlots", t, e, returnFalse), p("enhance", t, e, returnFalse), h(t.watches, se.getAnnotation(e), e.watches), p("processContent", t, e, returnNull));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) {
            return t;
        }
        if (ne.has(t)) {
            return ne.get(t);
        }
        const e = CustomElementDefinition.create(t);
        ne.set(t, e);
        ot(oe, e, e.Type);
        return e;
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        if (!t.has(i, false)) {
            Lt(i, e).register(t);
            It(i, e).register(t);
            registerAliases(s, ae, i, t);
        }
    }
}

const re = {
    name: undefined,
    searchParents: false,
    optional: false
};

const returnZero = () => 0;

const returnNull = () => null;

const returnFalse = () => false;

const returnTrue = () => true;

const returnEmptyArray = () => u;

const oe = /*@__PURE__*/ ct("custom-element");

const getElementKeyFrom = t => `${oe}:${t}`;

const le = /*@__PURE__*/ (() => {
    let t = 0;
    return () => `unnamed-${++t}`;
})();

const annotateElementMetadata = (t, e, i) => {
    ot(at(e), i, t);
};

const defineElement = (t, e) => {
    const i = CustomElementDefinition.create(t, e);
    ot(oe, i, i.Type);
    ot(oe, i, i);
    ut(i.Type, oe);
    return i.Type;
};

const isElementType = t => isFunction(t) && rt(oe, t);

const findElementControllerFor = (t, e = re) => {
    if (e.name === void 0 && e.searchParents !== true) {
        const i = getRef(t, oe);
        if (i === null) {
            if (e.optional === true) {
                return null;
            }
            throw createError(`AUR0762`);
        }
        return i;
    }
    if (e.name !== void 0) {
        if (e.searchParents !== true) {
            const i = getRef(t, oe);
            if (i === null) {
                throw createError(`AUR0763`);
            }
            if (i.is(e.name)) {
                return i;
            }
            return void 0;
        }
        let i = t;
        let s = false;
        while (i !== null) {
            const t = getRef(i, oe);
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
        throw createError(`AUR0764`);
    }
    let i = t;
    while (i !== null) {
        const t = getRef(i, oe);
        if (t !== null) {
            return t;
        }
        i = getEffectiveParentNode(i);
    }
    throw createError(`AUR0765`);
};

const getElementAnnotation = (t, e) => nt(at(e), t);

const getElementDefinition = t => {
    const e = nt(oe, t);
    if (e === void 0) {
        throw createError(`AUR0760:${t.name}`);
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

const he = /*@__PURE__*/ function() {
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
        Ct(n, "name", t);
        if (s !== e) {
            xt(n.prototype, s);
        }
        return n;
    };
}();

const ae = bt({
    name: oe,
    keyFrom: getElementKeyFrom,
    isType: isElementType,
    for: findElementControllerFor,
    define: defineElement,
    getDefinition: getElementDefinition,
    annotate: annotateElementMetadata,
    getAnnotation: getElementAnnotation,
    generateName: le,
    createInjectable: createElementInjectable,
    generateType: he
});

const ce = /*@__PURE__*/ at("processContent");

function processContent(t) {
    return t === void 0 ? function(t, e, i) {
        ot(ce, ensureHook(t, e), t);
    } : function(e) {
        t = ensureHook(e, t);
        const i = nt(oe, e);
        if (i !== void 0) {
            i.processContent = t;
        } else {
            ot(ce, t, e);
        }
        return e;
    };
}

function ensureHook(t, e) {
    if (isString(e)) {
        e = t[e];
    }
    if (!isFunction(e)) {
        throw createError(`AUR0766:${typeof e}`);
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
                addListener(this.L, e, this);
            }
            this.P = true;
            this.M?.();
        }
    }));
    defineHiddenProp(i, "unsubscribe", (function(t) {
        if (this.subs.remove(t) && this.subs.count === 0) {
            for (e of this.cf.events) {
                removeListener(this.L, e, this);
            }
            this.P = false;
            this.$?.();
        }
    }));
    defineHiddenProp(i, "useConfig", (function(t) {
        this.cf = t;
        if (this.P) {
            for (e of this.cf.events) {
                removeListener(this.L, e, this);
            }
            for (e of this.cf.events) {
                addListener(this.L, e, this);
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
        this.q = {};
        this.U = 0;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (t !== this.v) {
            this.v = t;
            this.F();
        }
    }
    F() {
        const t = this.q;
        const e = ++this.U;
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
                t[l] = this.U;
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
                this.H = new ClassAttributeAccessor(t);
            }
            binding() {
                this.valueChanged();
            }
            valueChanged() {
                this.H.setValue(this.value?.split(/\s+/g).map((t => i[t] || t)) ?? "");
            }
        }, e.inject = [ Wt ], e));
        t.register(s, Et(Xt, i));
    }
}

function shadowCSS(...t) {
    return new ShadowDOMRegistry(t);
}

const ue = /*@__PURE__*/ _t("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
    if (AdoptedStyleSheetsStyles.supported(t.get(Vt))) {
        return t.get(AdoptedStyleSheetsStylesFactory);
    }
    return t.get(StyleElementStylesFactory);
}))));

class ShadowDOMRegistry {
    constructor(t) {
        this.css = t;
    }
    register(t) {
        const e = t.get(de);
        const i = t.get(ue);
        t.register(Et(fe, i.createStyles(this.css, e)));
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

AdoptedStyleSheetsStylesFactory.inject = [ Vt ];

class StyleElementStylesFactory {
    constructor(t) {
        this.p = t;
    }
    createStyles(t, e) {
        return new StyleElementStyles(this.p, t, e);
    }
}

StyleElementStylesFactory.inject = [ Vt ];

const fe = /*@__PURE__*/ _t("IShadowDOMStyles");

const de = /*@__PURE__*/ _t("IShadowDOMGlobalStyles", (t => t.instance({
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

const me = {
    shadowDOM(t) {
        return Ot.creating(v, (e => {
            if (t.sharedStyles != null) {
                const i = e.get(ue);
                e.register(Et(de, i.createStyles(t.sharedStyles, null)));
            }
        }));
    }
};

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
        return new ValueConverterDefinition(e, l(getConverterAnnotation(e, "name"), i), h(getConverterAnnotation(e, "aliases"), s.aliases, e.aliases), pe.keyFrom(i));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        r.singleton(i, e).register(t);
        r.aliasTo(i, e).register(t);
        registerAliases(s, pe, i, t);
    }
}

const ge = ct("value-converter");

const getConverterAnnotation = (t, e) => nt(at(e), t);

const pe = bt({
    name: ge,
    keyFrom: t => `${ge}:${t}`,
    isType(t) {
        return isFunction(t) && rt(ge, t);
    },
    define(t, e) {
        const i = ValueConverterDefinition.create(t, e);
        ot(ge, i, i.Type);
        ot(ge, i, i);
        ut(e, ge);
        return i.Type;
    },
    getDefinition(t) {
        const e = nt(ge, t);
        if (e === void 0) {
            throw createError(`AUR0152:${t.name}`);
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
        this.O = e;
    }
    flush() {
        this.b.updateSource(this.v);
    }
    handleChange(t, e) {
        const i = this.b;
        if (t !== E(i.ast, i.s, i, null)) {
            this.v = t;
            this.O.add(this);
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
        Ct(s, "strict", {
            enumerable: true,
            get: function() {
                return t;
            }
        });
    }
    Ct(s, "strictFnCall", {
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
        const e = pe.keyFrom(t);
        let i = ve.get(this);
        if (i == null) {
            ve.set(this, i = new ResourceLookup);
        }
        return i[e] ?? (i[e] = this.l.get(resource(e)));
    }));
    defineHiddenProp(s, "getBehavior", (function(t) {
        const e = Mt.keyFrom(t);
        let i = ve.get(this);
        if (i == null) {
            ve.set(this, i = new ResourceLookup);
        }
        return i[e] ?? (i[e] = this.l.get(resource(e)));
    }));
};

const ve = new WeakMap;

class ResourceLookup {}

const be = /*@__PURE__*/ _t("IFlushQueue", (t => t.singleton(FlushQueue)));

class FlushQueue {
    constructor() {
        this.V = false;
        this.N = new Set;
    }
    get count() {
        return this.N.size;
    }
    add(t) {
        this.N.add(t);
        if (this.V) {
            return;
        }
        this.V = true;
        try {
            this.N.forEach(flushItem);
        } finally {
            this.V = false;
        }
    }
    clear() {
        this.N.clear();
        this.V = false;
    }
}

function flushItem(t, e, i) {
    i.delete(t);
    t.flush();
}

const xe = new WeakSet;

const mixingBindingLimited = (t, e) => {
    defineHiddenProp(t.prototype, "limit", (function(t) {
        if (xe.has(this)) {
            throw createError(`AURXXXX: a rate limit has already been applied.`);
        }
        xe.add(this);
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

const {enter: we, exit: ye} = P;

const {wrap: ke, unwrap: Ae} = M;

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
        if (!At(i, e)) {
            this.cb.call(t, i, e, t);
        }
    }
    compute() {
        this.running = true;
        this.obs.version++;
        try {
            we(this);
            return this.v = Ae(this.$get.call(void 0, this.useProxy ? ke(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            ye(this);
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
        if (!At(t, s)) {
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

L(ComputedWatcher);

L(ExpressionWatcher);

mixinAstEvaluator(true)(ExpressionWatcher);

const Ce = /*@__PURE__*/ _t("ILifecycleHooks");

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
        Tt(Ce, this.Type).register(t);
    }
}

const Re = new WeakMap;

const Se = at("lifecycle-hooks");

const Be = bt({
    name: Se,
    define(t, e) {
        const i = LifecycleHooksDefinition.create(t, e);
        ot(Se, i, e);
        ut(e, Se);
        return i.Type;
    },
    resolve(t) {
        let e = Re.get(t);
        if (e === void 0) {
            Re.set(t, e = new LifecycleHooksLookupImpl);
            const i = t.root;
            const s = i.id === t.id ? t.getAll(Ce) : t.has(Ce, false) ? i.getAll(Ce).concat(t.getAll(Ce)) : i.getAll(Ce);
            let n;
            let r;
            let l;
            let h;
            let a;
            for (n of s) {
                r = nt(Se, n.constructor);
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

class AttributeObserver {
    constructor(t, e, i) {
        this.type = 2 | 1 | 4;
        this.v = null;
        this.ov = null;
        this.W = false;
        this.o = t;
        this.G = e;
        this.X = i;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        this.v = t;
        this.W = t !== this.ov;
        this.F();
    }
    F() {
        if (this.W) {
            this.W = false;
            this.ov = this.v;
            switch (this.X) {
              case "class":
                {
                    this.o.classList.toggle(this.G, !!this.v);
                    break;
                }

              case "style":
                {
                    let t = "";
                    let e = this.v;
                    if (isString(e) && e.includes("!important")) {
                        t = "important";
                        e = e.replace("!important", "");
                    }
                    this.o.style.setProperty(this.G, e, t);
                    break;
                }

              default:
                {
                    if (this.v == null) {
                        this.o.removeAttribute(this.X);
                    } else {
                        this.o.setAttribute(this.X, gt(this.v));
                    }
                }
            }
        }
    }
    handleMutation(t) {
        let e = false;
        for (let i = 0, s = t.length; s > i; ++i) {
            const s = t[i];
            if (s.type === "attributes" && s.attributeName === this.G) {
                e = true;
                break;
            }
        }
        if (e) {
            let t;
            switch (this.X) {
              case "class":
                t = this.o.classList.contains(this.G);
                break;

              case "style":
                t = this.o.style.getPropertyValue(this.G);
                break;

              default:
                throw createError(`AUR0651:${this.X}`);
            }
            if (t !== this.v) {
                this.ov = this.v;
                this.v = t;
                this.W = false;
                this.K();
            }
        }
    }
    subscribe(t) {
        if (this.subs.add(t) && this.subs.count === 1) {
            this.v = this.ov = this.o.getAttribute(this.G);
            startObservation(this.o, this);
        }
    }
    unsubscribe(t) {
        if (this.subs.remove(t) && this.subs.count === 0) {
            stopObservation(this.o, this);
        }
    }
    K() {
        _e = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, _e);
    }
}

$(AttributeObserver);

const startObservation = (t, e) => {
    if (t.$eMObs === undefined) {
        t.$eMObs = new Set;
    }
    if (t.$mObs === undefined) {
        (t.$mObs = createMutationObserver(t, handleMutation)).observe(t, {
            attributes: true
        });
    }
    t.$eMObs.add(e);
};

const stopObservation = (t, e) => {
    const i = t.$eMObs;
    if (i && i.delete(e)) {
        if (i.size === 0) {
            t.$mObs.disconnect();
            t.$mObs = undefined;
        }
        return true;
    }
    return false;
};

const handleMutation = t => {
    t[0].target.$eMObs.forEach(invokeHandleMutation, t);
};

function invokeHandleMutation(t) {
    t.handleMutation(this);
}

let _e = void 0;

const Te = {
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
        this.Y = null;
        this.v = void 0;
        this.boundFn = false;
        this.l = e;
        this.ast = n;
        this.Z = t;
        this.target = r;
        this.oL = i;
        this.C = s;
    }
    updateTarget(t) {
        this.J.setValue(t, this.target, this.targetProperty);
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
            const i = this.Z.state !== 1 && (this.J.type & 4) > 0;
            if (i) {
                t = this.Y;
                this.Y = this.C.queueTask((() => {
                    this.Y = null;
                    this.updateTarget(e);
                }), Te);
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
        this.J ?? (this.J = new AttributeObserver(this.target, this.targetProperty, this.targetAttribute));
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
        this.Y?.cancel();
        this.Y = null;
        this.obs.clearAll();
    }
}

mixinUseScope(AttributeBinding);

mixingBindingLimited(AttributeBinding, (() => "updateTarget"));

L(AttributeBinding);

mixinAstEvaluator(true)(AttributeBinding);

const Ie = {
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
        this.Y = null;
        this.Z = t;
        this.oL = i;
        this.C = s;
        this.J = i.getAccessor(r, l);
        const a = n.expressions;
        const c = this.partBindings = Array(a.length);
        const u = a.length;
        let f = 0;
        for (;u > f; ++f) {
            c[f] = new InterpolationPartBinding(a[f], r, l, e, i, this);
        }
    }
    tt() {
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
        const r = this.J;
        const l = this.Z.state !== 1 && (r.type & 4) > 0;
        let h;
        if (l) {
            h = this.Y;
            this.Y = this.C.queueTask((() => {
                this.Y = null;
                r.setValue(s, this.target, this.targetProperty);
            }), Ie);
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
        this.Y?.cancel();
        this.Y = null;
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
        this.owner.tt();
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
        D(this.ast, t, this);
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

L(InterpolationPartBinding);

mixinAstEvaluator(true)(InterpolationPartBinding);

class ContentBinding {
    constructor(t, e, i, s, n, r, l, h) {
        this.p = n;
        this.ast = r;
        this.target = l;
        this.strict = h;
        this.isBound = false;
        this.mode = 2;
        this.Y = null;
        this.v = "";
        this.et = false;
        this.boundFn = false;
        this.l = e;
        this.Z = t;
        this.oL = i;
        this.C = s;
    }
    updateTarget(t) {
        const e = this.target;
        const i = this.v;
        this.v = t;
        if (this.et) {
            i.parentNode?.removeChild(i);
            this.et = false;
        }
        if (t instanceof this.p.Node) {
            e.parentNode?.insertBefore(t, e);
            t = "";
            this.et = true;
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
            this.Y?.cancel();
            this.Y = null;
            return;
        }
        const e = this.Z.state !== 1;
        if (e) {
            this.it(t);
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
        const e = this.Z.state !== 1;
        if (e) {
            this.it(t);
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
        if (this.et) {
            this.v.parentNode?.removeChild(this.v);
        }
        this.s = void 0;
        this.obs.clearAll();
        this.Y?.cancel();
        this.Y = null;
    }
    it(t) {
        const e = this.Y;
        this.Y = this.C.queueTask((() => {
            this.Y = null;
            this.updateTarget(t);
        }), Ie);
        e?.cancel();
    }
}

mixinUseScope(ContentBinding);

mixingBindingLimited(ContentBinding, (() => "updateTarget"));

L()(ContentBinding);

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
        this.st = n;
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
        this.target = this.st ? t.bindingContext : t.overrideContext;
        D(this.ast, t, this);
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

L(LetBinding);

mixinAstEvaluator(true)(LetBinding);

class PropertyBinding {
    constructor(t, e, i, s, n, r, l, h) {
        this.ast = n;
        this.target = r;
        this.targetProperty = l;
        this.mode = h;
        this.isBound = false;
        this.s = void 0;
        this.J = void 0;
        this.Y = null;
        this.nt = null;
        this.boundFn = false;
        this.l = e;
        this.Z = t;
        this.C = s;
        this.oL = i;
    }
    updateTarget(t) {
        this.J.setValue(t, this.target, this.targetProperty);
    }
    updateSource(t) {
        U(this.ast, this.s, this, t);
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = E(this.ast, this.s, this, (this.mode & 2) > 0 ? this : null);
        this.obs.clear();
        const e = this.Z.state !== 1 && (this.J.type & 4) > 0;
        if (e) {
            Ee = this.Y;
            this.Y = this.C.queueTask((() => {
                this.updateTarget(t);
                this.Y = null;
            }), Le);
            Ee?.cancel();
            Ee = null;
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
        let s = this.J;
        if (!s) {
            if (i & 4) {
                s = e.getObserver(this.target, this.targetProperty);
            } else {
                s = e.getAccessor(this.target, this.targetProperty);
            }
            this.J = s;
        }
        const n = (i & 2) > 0;
        if (i & (2 | 1)) {
            this.updateTarget(E(this.ast, this.s, this, n ? this : null));
        }
        if (i & 4) {
            s.subscribe(this.nt ?? (this.nt = new BindingTargetSubscriber(this, this.l.get(be))));
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
        if (this.nt) {
            this.J.unsubscribe(this.nt);
            this.nt = null;
        }
        this.Y?.cancel();
        this.Y = null;
        this.obs.clearAll();
    }
    useTargetObserver(t) {
        this.J?.unsubscribe(this);
        (this.J = t).subscribe(this);
    }
    useTargetSubscriber(t) {
        if (this.nt != null) {
            throw createError(`AURxxxx: binding already has a target subscriber`);
        }
        this.nt = t;
    }
}

mixinUseScope(PropertyBinding);

mixingBindingLimited(PropertyBinding, (t => t.mode & 4 ? "updateSource" : "updateTarget"));

L(PropertyBinding);

mixinAstEvaluator(true, false)(PropertyBinding);

let Ee = null;

const Le = {
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
        U(this.ast, this.s, this, this.target);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        if (E(this.ast, this.s, this, null) === this.target) {
            U(this.ast, this.s, this, null);
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
        this.rt = n;
    }
    callSource(t) {
        const e = this.s.overrideContext;
        e.$event = t;
        let i = E(this.ast, this.s, this, null);
        delete e.$event;
        if (isFunction(i)) {
            i = i(t);
        }
        if (i !== true && this.rt.prevent) {
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
        D(this.ast, t, this);
        this.target.addEventListener(this.targetEvent, this, this.rt);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        q(this.ast, this.s, this);
        this.s = void 0;
        this.target.removeEventListener(this.targetEvent, this, this.rt);
    }
}

mixinUseScope(ListenerBinding);

mixingBindingLimited(ListenerBinding, (() => "callSource"));

mixinAstEvaluator(true, true)(ListenerBinding);

const Pe = /*@__PURE__*/ _t("IViewFactory");

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

const Me = /*@__PURE__*/ _t("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

const $e = /*@__PURE__*/ _t("IAuSlotWatcher");

class AuSlotWatcherBinding {
    constructor(t, e, i, s) {
        this.ht = new Set;
        this.ct = u;
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
                if (this.ut === "*" || r.nodeType === 1 && r.matches(this.ut)) {
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
        throw new Error("not implemented");
    }
}

class SlottedLifecycleHooks {
    constructor(t) {
        this.ft = t;
    }
    register(t) {
        Et(Ce, this).register(t);
    }
    hydrating(t, e) {
        const i = this.ft;
        const s = new AuSlotWatcherBinding(t, i.callback ?? `${gt(i.name)}Changed`, i.slotName ?? "default", i.query ?? "*");
        Ct(t, i.name, {
            enumerable: true,
            configurable: true,
            get: xt((() => s.getValue()), {
                getObserver: () => s
            }),
            set: () => {}
        });
        Et($e, s).register(e.container);
        e.addBinding(s);
    }
}

function slotted(t, e) {
    if (!De) {
        De = true;
        $(AuSlotWatcherBinding);
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
            throw new Error(`Invalid usage. @slotted can only be used on a field`);
        }
        const h = s.constructor;
        let a = ae.getAnnotation(h, i);
        if (a == null) {
            ae.annotate(h, i, a = []);
        }
        a.push(new SlottedLifecycleHooks(l));
    }
    return decorator;
}

let De = false;

var qe;

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
})(qe || (qe = {}));

const Ue = /*@__PURE__*/ _t("Instruction");

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

const Fe = /*@__PURE__*/ _t("ITemplateCompiler");

const He = /*@__PURE__*/ _t("IRenderer");

function renderer(t) {
    return function decorator(e) {
        e.register = function(t) {
            Tt(He, this).register(t);
        };
        Ct(e.prototype, "target", {
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
        throw createError(`AUR0750`);

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
                throw createError(`AUR0751:${e}`);
            }
            return s.viewModel;
        }
    }
}

let Oe = class SetPropertyRenderer {
    render(t, e, i) {
        const s = getTarget(e);
        if (s.$observers?.[i.to] !== void 0) {
            s.$observers[i.to].setValue(i.value);
        } else {
            s[i.to] = i.value;
        }
    }
};

Oe = __decorate([ renderer("re") ], Oe);

let Ve = class CustomElementRenderer {
    static get inject() {
        return [ ui ];
    }
    constructor(t) {
        this.r = t;
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
            l = m.find(ae, u);
            if (l == null) {
                throw createError(`AUR0752:${u}@${t["name"]}`);
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

Ve = __decorate([ renderer("ra") ], Ve);

let Ne = class CustomAttributeRenderer {
    static get inject() {
        return [ ui ];
    }
    constructor(t) {
        this.r = t;
    }
    render(t, e, i, s, n, r) {
        let l = t.container;
        let h;
        switch (typeof i.res) {
          case "string":
            h = l.find(te, i.res);
            if (h == null) {
                throw createError(`AUR0753:${i.res}@${t["name"]}`);
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

Ne = __decorate([ renderer("rb") ], Ne);

let je = class TemplateControllerRenderer {
    static get inject() {
        return [ ui, Vt ];
    }
    constructor(t, e) {
        this.r = t;
        this.p = e;
    }
    render(t, e, i, s, n, r) {
        let l = t.container;
        let h;
        switch (typeof i.res) {
          case "string":
            h = l.find(te, i.res);
            if (h == null) {
                throw createError(`AUR0754:${i.res}@${t["name"]}`);
            }
            break;

          default:
            h = i.res;
        }
        const a = this.r.getViewFactory(i.def, l);
        const c = convertToRenderLocation(e);
        const u = invokeAttribute(this.p, h, t, e, i, a, c);
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

je = __decorate([ renderer("rc") ], je);

let We = class LetElementRenderer {
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

We = __decorate([ renderer("rd") ], We);

let ze = class RefBindingRenderer {
    render(t, e, i, s, n) {
        t.addBinding(new RefBinding(t.container, ensureExpression(n, i.from, 16), getRefTarget(e, i.to)));
    }
};

ze = __decorate([ renderer("rj") ], ze);

let Ge = class InterpolationBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new InterpolationBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, 1), getTarget(e), i.to, 2));
    }
};

Ge = __decorate([ renderer("rf") ], Ge);

let Xe = class PropertyBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, 16), getTarget(e), i.to, i.mode));
    }
};

Xe = __decorate([ renderer("rg") ], Xe);

let Qe = class IteratorBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.forOf, 2), getTarget(e), i.to, 2));
    }
};

Qe = __decorate([ renderer("rk") ], Qe);

let Ke = class TextBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, s.domWriteQueue, s, ensureExpression(n, i.from, 16), e, i.strict));
    }
};

Ke = __decorate([ renderer("ha") ], Ke);

let Ye = class ListenerBindingRenderer {
    render(t, e, i, s, n) {
        t.addBinding(new ListenerBinding(t.container, ensureExpression(n, i.from, 8), e, i.to, new ListenerBindingOptions(i.preventDefault, i.capture)));
    }
};

Ye = __decorate([ renderer("hb") ], Ye);

let Ze = class SetAttributeRenderer {
    render(t, e, i) {
        e.setAttribute(i.to, i.value);
    }
};

Ze = __decorate([ renderer("he") ], Ze);

let Je = class SetClassAttributeRenderer {
    render(t, e, i) {
        addClasses(e.classList, i.value);
    }
};

Je = __decorate([ renderer("hf") ], Je);

let ti = class SetStyleAttributeRenderer {
    render(t, e, i) {
        e.style.cssText += i.value;
    }
};

ti = __decorate([ renderer("hg") ], ti);

let ei = class StylePropertyBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, 16), e.style, i.to, 2));
    }
};

ei = __decorate([ renderer("hd") ], ei);

let ii = class AttributeBindingRenderer {
    render(t, e, i, s, n, r) {
        const l = t.container;
        const h = l.has(Xt, false) ? l.get(Xt) : null;
        t.addBinding(new AttributeBinding(t, l, r, s.domWriteQueue, ensureExpression(n, i.from, 16), e, i.attr, h == null ? i.to : i.to.split(/\s/g).map((t => h[t] ?? t)).join(" "), 2));
    }
};

ii = __decorate([ renderer("hc") ], ii);

let si = class SpreadRenderer {
    static get inject() {
        return [ Fe, ui ];
    }
    constructor(t, e) {
        this.dt = t;
        this.r = e;
    }
    render(t, e, i, s, n, r) {
        const l = t.container;
        const h = l.get(yi);
        const a = this.r.renderers;
        const getHydrationContext = t => {
            let e = t;
            let i = h;
            while (i != null && e > 0) {
                i = i.parent;
                --e;
            }
            if (i == null) {
                throw createError("No scope context for spread binding.");
            }
            return i;
        };
        const renderSpreadInstruction = i => {
            const l = getHydrationContext(i);
            const h = createSurrogateBinding(l);
            const c = this.dt.compileSpread(l.controller.definition, l.instruction?.captures ?? u, l.controller.container, e);
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

si = __decorate([ renderer("hs") ], si);

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
        this.gt = t;
        this.vt = e;
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
        const e = this.scope = this.vt.controller.scope.parent ?? void 0;
        if (e == null) {
            throw createError("Invalid spreading. Context scope is null/undefined");
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
        if (t.vmKind !== 1) {
            throw createError("Spread binding does not support spreading custom attributes/template controllers");
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

const ni = "IController";

const ri = "IInstruction";

const oi = "IRenderLocation";

const li = "ISlotsInfo";

function createElementContainer(t, e, i, s, n, r) {
    const l = e.container.createChild();
    registerHostNode(l, t, i);
    registerResolver(l, wi, new f(ni, e));
    registerResolver(l, Ue, new f(ri, s));
    registerResolver(l, Gt, n == null ? hi : new RenderLocationProvider(n));
    registerResolver(l, Pe, ai);
    registerResolver(l, Me, r == null ? ci : new f(li, r));
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
            throw createError(`AUR7055`);
        }
        if (!isString(t.name) || t.name.length === 0) {
            throw createError(`AUR0756`);
        }
        return t;
    }
}

function invokeAttribute(t, e, i, s, n, r, l, h) {
    const a = i.container.createChild();
    registerHostNode(a, t, s);
    i = i instanceof Controller ? i : i.ctrl;
    registerResolver(a, wi, new f(ni, i));
    registerResolver(a, Ue, new f(ri, n));
    registerResolver(a, Gt, l == null ? hi : new f(oi, l));
    registerResolver(a, Pe, r == null ? ai : new ViewFactoryProvider(r));
    registerResolver(a, Me, h == null ? ci : new f(li, h));
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

const hi = new RenderLocationProvider(null);

const ai = new ViewFactoryProvider(null);

const ci = new f(li, new AuSlotsInfo(u));

const ui = /*@__PURE__*/ _t("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.bt ?? (this.bt = this.xt.getAll(He, false).reduce(((t, e) => {
            t[e.target] = e;
            return t;
        }), createLookup()));
    }
    constructor() {
        this.wt = new WeakMap;
        this.yt = new WeakMap;
        const t = this.xt = a(v).root;
        this.p = t.get(Vt);
        this.ep = t.get(F);
        this.oL = t.get(H);
        this.kt = new FragmentNodeSequence(this.p, this.p.document.createDocumentFragment());
    }
    compile(t, e, i) {
        if (t.needsCompile !== false) {
            const s = this.wt;
            const n = e.get(Fe);
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
            return new FragmentNodeSequence(this.p, t.template);
        }
        let e;
        let i = false;
        const s = this.yt;
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
            s.set(t, e);
        }
        return e == null ? this.kt : new FragmentNodeSequence(this.p, i ? r.importNode(e, true) : r.adoptNode(e.cloneNode(true)));
    }
    render(t, e, i, s) {
        const n = i.instructions;
        const r = this.renderers;
        const l = e.length;
        if (e.length !== n.length) {
            throw createError(`AUR0757:${l}<>${n.length}`);
        }
        let h = 0;
        let a = 0;
        let c = 0;
        let u;
        let f;
        let d;
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
}

var fi;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["host"] = 1] = "host";
    t[t["shadowRoot"] = 2] = "shadowRoot";
    t[t["location"] = 3] = "location";
})(fi || (fi = {}));

const di = {
    optional: true
};

const mi = optionalResource(O);

const gi = new WeakMap;

class Controller {
    get lifecycleHooks() {
        return this.At;
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
        return this.Ct;
    }
    set viewModel(t) {
        this.Ct = t;
        this.Rt = t == null || this.vmKind === 2 ? HooksDefinition.none : new HooksDefinition(t);
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
        this.St = false;
        this.hostController = null;
        this.mountTarget = 0;
        this.shadowRoot = null;
        this.nodes = null;
        this.location = null;
        this.At = null;
        this.state = 0;
        this.Bt = false;
        this.$initiator = null;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this._t = 0;
        this.Tt = 0;
        this.It = 0;
        this.Ct = n;
        this.Rt = e === 2 ? HooksDefinition.none : new HooksDefinition(n);
        this.location = l;
        this.r = t.root.get(ui);
        this.coercion = e === 2 ? void 0 : t.get(mi);
    }
    static getCached(t) {
        return gi.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (e === void 0) {
            throw createError(`AUR0500:${t}`);
        }
        return e;
    }
    static $el(t, e, i, s, n = void 0, r = null) {
        if (gi.has(e)) {
            return gi.get(e);
        }
        n = n ?? getElementDefinition(e.constructor);
        const l = new Controller(t, 0, n, null, e, i, r);
        const h = t.get(b(yi));
        if (n.dependencies.length > 0) {
            t.register(...n.dependencies);
        }
        registerResolver(t, yi, new f("IHydrationContext", new HydrationContext(l, s, h)));
        gi.set(e, l);
        if (s == null || s.hydrate !== false) {
            l.hE(s, h);
        }
        return l;
    }
    static $attr(t, e, i, s) {
        if (gi.has(e)) {
            return gi.get(e);
        }
        s = s ?? getAttributeDefinition(e.constructor);
        const n = new Controller(t, 1, s, null, e, i, null);
        if (s.dependencies.length > 0) {
            t.register(...s.dependencies);
        }
        gi.set(e, n);
        n.Et();
        return n;
    }
    static $view(t, e = void 0) {
        const i = new Controller(t.container, 2, null, t, null, null, null);
        i.parent = e ?? null;
        i.Lt();
        return i;
    }
    hE(t, e) {
        const i = this.container;
        const s = this.Ct;
        let n = this.definition;
        this.scope = V.create(s, null, true);
        if (n.watches.length > 0) {
            createWatchers(this, i, n, s);
        }
        createObservers(this, n, s);
        if (this.Rt.Pt) {
            const t = s.define(this, e, n);
            if (t !== void 0 && t !== n) {
                n = CustomElementDefinition.getOrCreate(t);
            }
        }
        this.At = Be.resolve(i);
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
        if (this.At.hydrating != null) {
            this.At.hydrating.forEach(callHydratingHook, this);
        }
        if (this.Rt.Mt) {
            this.Ct.hydrating(this);
        }
        const e = this.$t = this.r.compile(this.definition, this.container, t);
        const {shadowOptions: i, isStrictBinding: s, hasSlots: n, containerless: r} = e;
        let l = this.location;
        this.isStrictBinding = s;
        if ((this.hostController = findElementControllerFor(this.host, di)) !== null) {
            this.host = this.container.root.get(Vt).document.createElement(this.definition.name);
            if (r && l == null) {
                l = this.location = convertToRenderLocation(this.host);
            }
        }
        setRef(this.host, oe, this);
        setRef(this.host, this.definition.key, this);
        if (i !== null || n) {
            if (l != null) {
                throw createError(`AUR0501`);
            }
            setRef(this.shadowRoot = this.host.attachShadow(i ?? vi), oe, this);
            setRef(this.shadowRoot, this.definition.key, this);
            this.mountTarget = 2;
        } else if (l != null) {
            setRef(l, oe, this);
            setRef(l, this.definition.key, this);
            this.mountTarget = 3;
        } else {
            this.mountTarget = 1;
        }
        this.Ct.$controller = this;
        this.nodes = this.r.createNodes(e);
        if (this.At.hydrated !== void 0) {
            this.At.hydrated.forEach(callHydratedHook, this);
        }
        if (this.Rt.Dt) {
            this.Ct.hydrated(this);
        }
    }
    hC() {
        this.r.render(this, this.nodes.findTargets(), this.$t, this.host);
        if (this.At.created !== void 0) {
            this.At.created.forEach(callCreatedHook, this);
        }
        if (this.Rt.qt) {
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
        this.At = Be.resolve(this.container);
        if (this.At.created !== void 0) {
            this.At.created.forEach(callCreatedHook, this);
        }
        if (this.Rt.qt) {
            this.Ct.created(this);
        }
    }
    Lt() {
        this.$t = this.r.compile(this.viewFactory.def, this.container, null);
        this.isStrictBinding = this.$t.isStrictBinding;
        this.r.render(this, (this.nodes = this.r.createNodes(this.$t)).findTargets(), this.$t, void 0);
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
            throw createError(`AUR0502:${this.name}`);

          default:
            throw createError(`AUR0503:${this.name} ${stringifyState(this.state)}`);
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
                throw createError(`AUR0504`);
            }
            if (!this.hasLockedScope) {
                this.scope = i;
            }
            break;
        }
        if (this.isStrictBinding) ;
        this.$initiator = t;
        this.Ut();
        let s;
        if (this.vmKind !== 2 && this.At.binding != null) {
            s = x(...this.At.binding.map(callBindingHook, this));
        }
        if (this.Rt.Ft) {
            s = x(s, this.Ct.binding(this.$initiator, this.parent));
        }
        if (isPromise(s)) {
            this.Ht();
            s.then((() => {
                this.St = true;
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
        this.St = true;
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
        if (this.vmKind !== 2 && this.At.bound != null) {
            i = x(...this.At.bound.map(callBoundHook, this));
        }
        if (this.Rt.Nt) {
            i = x(i, this.Ct.bound(this.$initiator, this.parent));
        }
        if (isPromise(i)) {
            this.Ht();
            i.then((() => {
                this.isBound = true;
                if (this.state !== 1) {
                    this.Ot();
                } else {
                    this.jt();
                }
            })).catch((t => {
                this.Vt(t);
            }));
            return;
        }
        this.isBound = true;
        this.jt();
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
    jt() {
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
                const e = t.has(fe, false) ? t.get(fe) : t.get(de);
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
        if (this.vmKind !== 2 && this.At.attaching != null) {
            e = x(...this.At.attaching.map(callAttachingHook, this));
        }
        if (this.Rt.zt) {
            e = x(e, this.Ct.attaching(this.$initiator, this.parent));
        }
        if (isPromise(e)) {
            this.Ht();
            this.Ut();
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
            throw createError(`AUR0505:${this.name} ${stringifyState(this.state)}`);
        }
        this.$initiator = t;
        if (t === this) {
            this.Gt();
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
                if (this.vmKind !== 2 && this.At.detaching != null) {
                    r = x(...this.At.detaching.map(callDetachingHook, this));
                }
                if (this.Rt.Xt) {
                    r = x(r, this.Ct.detaching(this.$initiator, this.parent));
                }
            }
            if (isPromise(r)) {
                this.Ht();
                t.Gt();
                r.then((() => {
                    t.Qt();
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
            this.Qt();
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
            ki = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            ki();
            ki = void 0;
        }
    }
    Vt(t) {
        if (this.$promise !== void 0) {
            Ai = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            Ai(t);
            Ai = void 0;
        }
        if (this.$initiator !== this) {
            this.parent.Vt(t);
        }
    }
    Ut() {
        ++this._t;
        if (this.$initiator !== this) {
            this.parent.Ut();
        }
    }
    Ot() {
        if (this.state !== 1) {
            --this._t;
            this.Kt();
            if (this.$initiator !== this) {
                this.parent.Ot();
            }
            return;
        }
        if (--this._t === 0) {
            if (this.vmKind !== 2 && this.At.attached != null) {
                Ci = x(...this.At.attached.map(callAttachedHook, this));
            }
            if (this.Rt.Yt) {
                Ci = x(Ci, this.Ct.attached(this.$initiator));
            }
            if (isPromise(Ci)) {
                this.Ht();
                Ci.then((() => {
                    this.state = 2;
                    this.Kt();
                    if (this.$initiator !== this) {
                        this.parent.Ot();
                    }
                })).catch((t => {
                    this.Vt(t);
                }));
                Ci = void 0;
                return;
            }
            Ci = void 0;
            this.state = 2;
            this.Kt();
        }
        if (this.$initiator !== this) {
            this.parent.Ot();
        }
    }
    Gt() {
        ++this.Tt;
    }
    Qt() {
        if (--this.Tt === 0) {
            this.Zt();
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
                if (t.St) {
                    if (t.vmKind !== 2 && t.At.unbinding != null) {
                        e = x(...t.At.unbinding.map(callUnbindingHook, t));
                    }
                    if (t.Rt.Jt) {
                        if (t.debug) {
                            t.logger.trace("unbinding()");
                        }
                        e = x(e, t.viewModel.unbinding(t.$initiator, t.parent));
                    }
                }
                if (isPromise(e)) {
                    this.Ht();
                    this.Zt();
                    e.then((() => {
                        this.te();
                    })).catch((t => {
                        this.Vt(t);
                    }));
                }
                e = void 0;
                t = t.next;
            }
            this.te();
        }
    }
    Zt() {
        ++this.It;
    }
    te() {
        if (--this.It === 0) {
            let t = this.$initiator.head;
            let e = null;
            while (t !== null) {
                if (t !== this) {
                    t.St = false;
                    t.isBound = false;
                    t.unbind();
                }
                e = t.next;
                t.next = null;
                t = e;
            }
            this.head = this.tail = null;
            this.St = false;
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
                return getAttributeDefinition(this.Ct.constructor).name === t;
            }

          case 0:
            {
                return getElementDefinition(this.Ct.constructor).name === t;
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
            setRef(t, oe, this);
            setRef(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = 1;
        return this;
    }
    setShadowRoot(t) {
        if (this.vmKind === 0) {
            setRef(t, oe, this);
            setRef(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = 2;
        return this;
    }
    setLocation(t) {
        if (this.vmKind === 0) {
            setRef(t, oe, this);
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
        if (this.Rt.ee) {
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
            gi.delete(this.Ct);
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
        if (this.Rt.ie && this.Ct.accept(t) === true) {
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
    const h = t.container.get(H);
    if (l > 0) {
        for (let e = 0; e < l; ++e) {
            const l = r[e];
            const a = n[l];
            const c = a.callback;
            const u = h.getObserver(i, l);
            if (a.set !== s) {
                if (u.useCoercer?.(a.set, t.coercion) !== true) {
                    throw createError(`AURxxxx: coercion(${gt(l)})`);
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
                    throw createError(`AURxxx: changed(${gt})`);
                }
            }
        }
    }
}

const pi = new Map;

const getAccessScopeAst = t => {
    let e = pi.get(t);
    if (e == null) {
        e = new N(t, 0);
        pi.set(t, e);
    }
    return e;
};

function createWatchers(t, e, i, s) {
    const n = e.get(H);
    const r = e.get(F);
    const l = i.watches;
    const h = t.vmKind === 0 ? t.scope : V.create(s, null, true);
    const a = l.length;
    let c;
    let u;
    let f;
    let d = 0;
    for (;a > d; ++d) {
        ({expression: c, callback: u} = l[d]);
        u = isFunction(u) ? u : Reflect.get(s, u);
        if (!isFunction(u)) {
            throw createError(`AUR0506:${gt(u)}`);
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
        this.Pt = "define" in t;
        this.Mt = "hydrating" in t;
        this.Dt = "hydrated" in t;
        this.qt = "created" in t;
        this.Ft = "binding" in t;
        this.Nt = "bound" in t;
        this.zt = "attaching" in t;
        this.Yt = "attached" in t;
        this.Xt = "detaching" in t;
        this.Jt = "unbinding" in t;
        this.ee = "dispose" in t;
        this.ie = "accept" in t;
    }
}

HooksDefinition.none = new HooksDefinition({});

const vi = {
    mode: "open"
};

var bi;

(function(t) {
    t[t["customElement"] = 0] = "customElement";
    t[t["customAttribute"] = 1] = "customAttribute";
    t[t["synthetic"] = 2] = "synthetic";
})(bi || (bi = {}));

var xi;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["activating"] = 1] = "activating";
    t[t["activated"] = 2] = "activated";
    t[t["deactivating"] = 4] = "deactivating";
    t[t["deactivated"] = 8] = "deactivated";
    t[t["released"] = 16] = "released";
    t[t["disposed"] = 32] = "disposed";
})(xi || (xi = {}));

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

const wi = /*@__PURE__*/ _t("IController");

const yi = /*@__PURE__*/ _t("IHydrationContext");

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

let ki;

let Ai;

let Ci;

const Ri = /*@__PURE__*/ _t("IAppRoot");

class AppRoot {
    constructor(t, e, i, s) {
        this.config = t;
        this.platform = e;
        this.container = i;
        this.se = void 0;
        this.host = t.host;
        s.prepare(this);
        registerHostNode(i, e, t.host);
        this.se = w(this.ne("creating"), (() => {
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
            return w(this.ne("hydrating"), (() => {
                l.hS(null);
                return w(this.ne("hydrated"), (() => {
                    l.hC();
                    this.se = void 0;
                }));
            }));
        }));
    }
    activate() {
        return w(this.se, (() => w(this.ne("activating"), (() => w(this.controller.activate(this.controller, null, void 0), (() => this.ne("activated")))))));
    }
    deactivate() {
        return w(this.ne("deactivating"), (() => w(this.controller.deactivate(this.controller, null), (() => this.ne("deactivated")))));
    }
    ne(t) {
        return x(...this.container.getAll(Ht).reduce(((e, i) => {
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

const Si = /*@__PURE__*/ _t("IAurelia");

class Aurelia {
    get isRunning() {
        return this.ir;
    }
    get isStarting() {
        return this.re;
    }
    get isStopping() {
        return this.oe;
    }
    get root() {
        if (this.le == null) {
            if (this.next == null) {
                throw createError(`AUR0767`);
            }
            return this.next;
        }
        return this.le;
    }
    constructor(t = n.createContainer()) {
        this.container = t;
        this.ir = false;
        this.re = false;
        this.oe = false;
        this.le = void 0;
        this.next = void 0;
        this.he = void 0;
        this.ae = void 0;
        if (t.has(Si, true) || t.has(Aurelia, true)) {
            throw createError(`AUR0768`);
        }
        registerResolver(t, Si, new f("IAurelia", this));
        registerResolver(t, Aurelia, new f("Aurelia", this));
        registerResolver(t, Ri, this.ce = new f("IAppRoot"));
    }
    register(...t) {
        this.container.register(...t);
        return this;
    }
    app(t) {
        this.next = new AppRoot(t, this.ue(t.host), this.container, this.ce);
        return this;
    }
    enhance(t, e) {
        const i = t.container ?? this.container.createChild();
        const s = t.host;
        const n = this.ue(s);
        const r = t.component;
        let l;
        if (isFunction(r)) {
            registerHostNode(i, n, s);
            l = i.invoke(r);
        } else {
            l = r;
        }
        registerResolver(i, zt, new f("IEventTarget", s));
        e = e ?? null;
        const h = Controller.$el(i, l, s, null, CustomElementDefinition.create({
            name: le(),
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
    ue(t) {
        let e;
        if (!this.container.has(Vt, false)) {
            if (t.ownerDocument.defaultView === null) {
                throw createError(`AUR0769`);
            }
            e = new it(t.ownerDocument.defaultView);
            this.container.register(Et(Vt, e));
        } else {
            e = this.container.get(Vt);
        }
        return e;
    }
    start(t = this.next) {
        if (t == null) {
            throw createError(`AUR0770`);
        }
        if (isPromise(this.he)) {
            return this.he;
        }
        return this.he = w(this.stop(), (() => {
            Reflect.set(t.host, "$aurelia", this);
            this.ce.prepare(this.le = t);
            this.re = true;
            return w(t.activate(), (() => {
                this.ir = true;
                this.re = false;
                this.he = void 0;
                this.fe(t, "au-started", t.host);
            }));
        }));
    }
    stop(t = false) {
        if (isPromise(this.ae)) {
            return this.ae;
        }
        if (this.ir === true) {
            const e = this.le;
            this.ir = false;
            this.oe = true;
            return this.ae = w(e.deactivate(), (() => {
                Reflect.deleteProperty(e.host, "$aurelia");
                if (t) {
                    e.dispose();
                }
                this.le = void 0;
                this.ce.dispose();
                this.oe = false;
                this.fe(e, "au-stopped", e.host);
            }));
        }
    }
    dispose() {
        if (this.ir || this.oe) {
            throw createError(`AUR0771`);
        }
        this.container.dispose();
    }
    fe(t, e, i) {
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
                this.has = this.de;
                break;

              case 1:
                this.has = this.me;
                break;

              default:
                this.has = this.ge;
            }
        } else {
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
        }
    }
    equals(t) {
        return this.chars === t.chars && this.repeat === t.repeat && this.isSymbol === t.isSymbol && this.isInverted === t.isInverted;
    }
    be(t) {
        return this.chars.includes(t);
    }
    ve(t) {
        return this.chars === t;
    }
    pe(t) {
        return false;
    }
    ge(t) {
        return !this.chars.includes(t);
    }
    me(t) {
        return this.chars !== t;
    }
    de(t) {
        return true;
    }
}

class Interpretation {
    constructor() {
        this.parts = u;
        this.xe = "";
        this.we = {};
        this.ye = {};
    }
    get pattern() {
        const t = this.xe;
        if (t === "") {
            return null;
        } else {
            return t;
        }
    }
    set pattern(t) {
        if (t == null) {
            this.xe = "";
            this.parts = u;
        } else {
            this.xe = t;
            this.parts = this.ye[t];
        }
    }
    append(t, e) {
        const i = this.we;
        if (i[t] === undefined) {
            i[t] = e;
        } else {
            i[t] += e;
        }
    }
    next(t) {
        const e = this.we;
        let i;
        if (e[t] !== undefined) {
            i = this.ye;
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
    get xe() {
        return this.ke ? this.Ae[0] : null;
    }
    constructor(t, ...e) {
        this.charSpec = t;
        this.Ce = [];
        this.Re = null;
        this.ke = false;
        this.Ae = e;
    }
    findChild(t) {
        const e = this.Ce;
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
        const i = this.Ae;
        if (!i.includes(e)) {
            i.push(e);
        }
        let s = this.findChild(t);
        if (s == null) {
            s = new AttrParsingState(t, e);
            this.Ce.push(s);
            if (t.repeat) {
                s.Ce.push(s);
            }
        }
        return s;
    }
    findMatches(t, e) {
        const i = [];
        const s = this.Ce;
        const n = s.length;
        let r = 0;
        let l = null;
        let h = 0;
        let a = 0;
        for (;h < n; ++h) {
            l = s[h];
            if (l.charSpec.has(t)) {
                i.push(l);
                r = l.Ae.length;
                a = 0;
                if (l.charSpec.isSymbol) {
                    for (;a < r; ++a) {
                        e.next(l.Ae[a]);
                    }
                } else {
                    for (;a < r; ++a) {
                        e.append(l.Ae[a], t);
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
        const e = this.Se = t.length;
        const i = this.Be = [];
        let s = 0;
        for (;e > s; ++s) {
            i.push(new CharSpec(t[s], false, false, false));
        }
    }
    eachChar(t) {
        const e = this.Se;
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
        this._e = new CharSpec(t, true, false, true);
    }
    eachChar(t) {
        t(this._e);
    }
}

class SymbolSegment {
    constructor(t) {
        this.text = t;
        this._e = new CharSpec(t, false, true, false);
    }
    eachChar(t) {
        t(this._e);
    }
}

class SegmentTypes {
    constructor() {
        this.statics = 0;
        this.dynamics = 0;
        this.symbols = 0;
    }
}

const Bi = /*@__PURE__*/ _t("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

class SyntaxInterpreter {
    constructor() {
        this.Te = new AttrParsingState(null);
        this.Ie = [ this.Te ];
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
            i = this.Te;
            s = t[c];
            n = s.pattern;
            r = new SegmentTypes;
            l = this.Ee(s, r);
            h = l.length;
            a = t => i = i.append(t, n);
            for (u = 0; h > u; ++u) {
                l[u].eachChar(a);
            }
            i.Re = r;
            i.ke = true;
            ++c;
        }
    }
    interpret(t) {
        const e = new Interpretation;
        const i = t.length;
        let s = this.Ie;
        let n = 0;
        let r;
        for (;n < i; ++n) {
            s = this.Le(s, t.charAt(n), e);
            if (s.length === 0) {
                break;
            }
        }
        s = s.filter(isEndpoint);
        if (s.length > 0) {
            s.sort(sortEndpoint);
            r = s[0];
            if (!r.charSpec.isSymbol) {
                e.next(r.xe);
            }
            e.pattern = r.xe;
        }
        return e;
    }
    Le(t, e, i) {
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
    Ee(t, e) {
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
    return t.ke;
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
    constructor(t, e, i, s) {
        this.rawName = t;
        this.rawValue = e;
        this.target = i;
        this.command = s;
    }
}

const _i = /*@__PURE__*/ _t("IAttributePattern");

const Ti = /*@__PURE__*/ _t("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor(t, e) {
        this.ot = {};
        this.Pe = t;
        const i = this.Ae = {};
        const s = e.reduce(((t, e) => {
            const s = getAllPatternDefinitions(e.constructor);
            s.forEach((t => i[t.pattern] = e));
            return t.concat(s);
        }), u);
        t.add(s);
    }
    parse(t, e) {
        let i = this.ot[t];
        if (i == null) {
            i = this.ot[t] = this.Pe.interpret(t);
        }
        const s = i.pattern;
        if (s == null) {
            return new AttrSyntax(t, e, t, null);
        } else {
            return this.Ae[s][s](t, e, i.parts);
        }
    }
}

AttributeParser.inject = [ Bi, y(_i) ];

function attributePattern(...t) {
    return function decorator(e) {
        return Li.define(t, e);
    };
}

class AttributePatternResourceDefinition {
    constructor(t) {
        this.Type = t;
        this.name = void 0;
    }
    register(t) {
        Tt(_i, this.Type).register(t);
    }
}

const Ii = ct("attribute-pattern");

const Ei = "attribute-pattern-definitions";

const getAllPatternDefinitions = e => t.annotation.get(e, Ei);

const Li = bt({
    name: Ii,
    definitionAnnotationKey: Ei,
    define(e, i) {
        const s = new AttributePatternResourceDefinition(i);
        ot(Ii, s, i);
        ut(i, Ii);
        t.annotation.set(i, Ei, e);
        ft(i, Ei);
        return i;
    },
    getPatternDefinitions: getAllPatternDefinitions
});

let Pi = class DotSeparatedAttributePattern {
    "PART.PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], i[1]);
    }
    "PART.PART.PART"(t, e, i) {
        return new AttrSyntax(t, e, `${i[0]}.${i[1]}`, i[2]);
    }
};

Pi = __decorate([ attributePattern({
    pattern: "PART.PART",
    symbols: "."
}, {
    pattern: "PART.PART.PART",
    symbols: "."
}) ], Pi);

let Mi = class RefAttributePattern {
    ref(t, e, i) {
        return new AttrSyntax(t, e, "element", "ref");
    }
    "PART.ref"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "ref");
    }
};

Mi = __decorate([ attributePattern({
    pattern: "ref",
    symbols: ""
}, {
    pattern: "PART.ref",
    symbols: "."
}) ], Mi);

let $i = class ColonPrefixedBindAttributePattern {
    ":PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "bind");
    }
};

$i = __decorate([ attributePattern({
    pattern: ":PART",
    symbols: ":"
}) ], $i);

let Di = class AtPrefixedTriggerAttributePattern {
    "@PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "trigger");
    }
};

Di = __decorate([ attributePattern({
    pattern: "@PART",
    symbols: "@"
}) ], Di);

let qi = class SpreadAttributePattern {
    "...$attrs"(t, e, i) {
        return new AttrSyntax(t, e, "", "...$attrs");
    }
};

qi = __decorate([ attributePattern({
    pattern: "...$attrs",
    symbols: ""
}) ], qi);

var Ui;

(function(t) {
    t[t["None"] = 0] = "None";
    t[t["IgnoreAttr"] = 1] = "IgnoreAttr";
})(Ui || (Ui = {}));

function bindingCommand(t) {
    return function(e) {
        return Hi.define(t, e);
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
        registerAliases(s, Hi, i, t);
    }
}

const Fi = /*@__PURE__*/ ct("binding-command");

const getCommandKeyFrom = t => `${Fi}:${t}`;

const getCommandAnnotation = (t, e) => nt(at(e), t);

const Hi = bt({
    name: Fi,
    keyFrom: getCommandKeyFrom,
    define(t, e) {
        const i = BindingCommandDefinition.create(t, e);
        ot(Fi, i, i.Type);
        ot(Fi, i, i);
        ut(e, Fi);
        return i.Type;
    },
    getAnnotation: getCommandAnnotation
});

let Oi = class OneTimeBindingCommand {
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

Oi = __decorate([ bindingCommand("one-time") ], Oi);

let Vi = class ToViewBindingCommand {
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

Vi = __decorate([ bindingCommand("to-view") ], Vi);

let Ni = class FromViewBindingCommand {
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

Ni = __decorate([ bindingCommand("from-view") ], Ni);

let ji = class TwoWayBindingCommand {
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

ji = __decorate([ bindingCommand("two-way") ], ji);

let Wi = class DefaultBindingCommand {
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

Wi = __decorate([ bindingCommand("bind") ], Wi);

let zi = class ForBindingCommand {
    get type() {
        return 0;
    }
    static get inject() {
        return [ Ti ];
    }
    constructor(t) {
        this.Me = t;
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
                const r = this.Me.parse(t, s);
                n = [ new MultiAttrInstruction(s, r.target, r.command) ];
            }
        }
        return new IteratorBindingInstruction(s, i, n);
    }
};

zi = __decorate([ bindingCommand("for") ], zi);

let Gi = class TriggerBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, 8), t.attr.target, true, false);
    }
};

Gi = __decorate([ bindingCommand("trigger") ], Gi);

let Xi = class CaptureBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, 8), t.attr.target, false, true);
    }
};

Xi = __decorate([ bindingCommand("capture") ], Xi);

let Qi = class AttrBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction(t.attr.target, e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

Qi = __decorate([ bindingCommand("attr") ], Qi);

let Ki = class StyleBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction("style", e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

Ki = __decorate([ bindingCommand("style") ], Ki);

let Yi = class ClassBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction("class", e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

Yi = __decorate([ bindingCommand("class") ], Yi);

let Zi = class RefBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new RefBindingInstruction(e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

Zi = __decorate([ bindingCommand("ref") ], Zi);

let Ji = class SpreadBindingCommand {
    get type() {
        return 1;
    }
    build(t) {
        return new SpreadBindingInstruction;
    }
};

Ji = __decorate([ bindingCommand("...$attrs") ], Ji);

const ts = /*@__PURE__*/ _t("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

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
        return Tt(ts, this).register(t);
    }
    constructor(t) {
        this.$e = xt(createLookup(), {
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
        this.qe = o("alignment-baseline baseline-shift clip-path clip-rule clip color-interpolation-filters color-interpolation color-profile color-rendering color cursor direction display dominant-baseline enable-background fill-opacity fill-rule fill filter flood-color flood-opacity font-family font-size-adjust font-size font-stretch font-style font-variant font-weight glyph-orientation-horizontal glyph-orientation-vertical image-rendering kerning letter-spacing lighting-color marker-end marker-mid marker-start mask opacity overflow pointer-events shape-rendering stop-color stop-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width stroke text-anchor text-decoration text-rendering unicode-bidi visibility word-spacing writing-mode");
        this.SVGElement = t.globalThis.SVGElement;
        const e = t.document.createElement("div");
        e.innerHTML = "<svg><altGlyph /></svg>";
        if (e.firstElementChild.nodeName === "altglyph") {
            const t = this.$e;
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
        return this.De[t.nodeName] === true && this.qe[e] === true || this.$e[t.nodeName]?.[e] === true;
    }
}

SVGAnalyzer.inject = [ Vt ];

const es = /*@__PURE__*/ _t("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    constructor() {
        this.fns = [];
        this.Ue = createLookup();
        this.Fe = createLookup();
        this.svg = a(ts);
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
            s = (e = this.Ue)[n] ?? (e[n] = createLookup());
            for (r in i) {
                if (s[r] !== void 0) {
                    throw createMappedError(r, n);
                }
                s[r] = i[r];
            }
        }
    }
    useGlobalMapping(t) {
        const e = this.Fe;
        for (const i in t) {
            if (e[i] !== void 0) {
                throw createMappedError(i, "*");
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
        return this.Ue[t.nodeName]?.[e] ?? this.Fe[e] ?? (isDataAttribute(t, e, this.svg) ? e : null);
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

function createMappedError(t, e) {
    return createError(`Attribute ${t} has been already registered for ${e === "*" ? "all elements" : `<${e}/>`}`);
}

var is;

(function(t) {
    t[t["oneTime"] = 1] = "oneTime";
    t[t["toView"] = 2] = "toView";
    t[t["fromView"] = 4] = "fromView";
    t[t["twoWay"] = 6] = "twoWay";
    t[t["default"] = 8] = "default";
})(is || (is = {}));

const ss = createLookup();

class AttributeNSAccessor {
    static forNs(t) {
        return ss[t] ?? (ss[t] = new AttributeNSAccessor(t));
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

const ns = new DataAttributeAccessor;

const rs = {
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
        this.W = false;
        this.He = void 0;
        this.Oe = void 0;
        this.iO = false;
        this.P = false;
        this.L = t;
        this.oL = s;
        this.cf = i;
    }
    getValue() {
        return this.iO ? this.v : this.L.multiple ? getSelectedOptions(this.L.options) : this.L.value;
    }
    setValue(t) {
        this.ov = this.v;
        this.v = t;
        this.W = t !== this.ov;
        this.Ve(t instanceof Array ? t : null);
        this.F();
    }
    F() {
        if (this.W) {
            this.W = false;
            this.syncOptions();
        }
    }
    handleCollectionChange() {
        this.syncOptions();
    }
    syncOptions() {
        const t = this.v;
        const e = this.L;
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
        const t = this.L;
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
        (this.Oe = createMutationObserver(this.L, this.Ne.bind(this))).observe(this.L, rs);
        this.Ve(this.v instanceof Array ? this.v : null);
        this.iO = true;
    }
    $() {
        this.Oe.disconnect();
        this.He?.unsubscribe(this);
        this.Oe = this.He = void 0;
        this.iO = false;
    }
    Ve(t) {
        this.He?.unsubscribe(this);
        this.He = void 0;
        if (t != null) {
            if (!this.L.multiple) {
                throw createError(`AUR0654`);
            }
            (this.He = this.oL.getArrayObserver(t)).subscribe(this);
        }
    }
    handleEvent() {
        const t = this.syncValue();
        if (t) {
            this.K();
        }
    }
    Ne(t) {
        this.syncOptions();
        const e = this.syncValue();
        if (e) {
            this.K();
        }
    }
    K() {
        os = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, os);
    }
}

mixinNodeObserverUseConfig(SelectValueObserver);

$(SelectValueObserver);

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

let os = void 0;

const ls = "--";

class StyleAttributeAccessor {
    constructor(t) {
        this.obj = t;
        this.type = 2 | 4;
        this.v = "";
        this.ov = "";
        this.styles = {};
        this.version = 0;
        this.W = false;
    }
    getValue() {
        return this.obj.style.cssText;
    }
    setValue(t) {
        this.v = t;
        this.W = t !== this.ov;
        this.F();
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
    We(t) {
        let e;
        let s;
        const n = [];
        for (s in t) {
            e = t[s];
            if (e == null) {
                continue;
            }
            if (isString(e)) {
                if (s.startsWith(ls)) {
                    n.push([ s, e ]);
                    continue;
                }
                n.push([ i(s), e ]);
                continue;
            }
            n.push(...this.ze(e));
        }
        return n;
    }
    Ge(t) {
        const e = t.length;
        if (e > 0) {
            const i = [];
            let s = 0;
            for (;e > s; ++s) {
                i.push(...this.ze(t[s]));
            }
            return i;
        }
        return u;
    }
    ze(t) {
        if (isString(t)) {
            return this.je(t);
        }
        if (t instanceof Array) {
            return this.Ge(t);
        }
        if (t instanceof Object) {
            return this.We(t);
        }
        return u;
    }
    F() {
        if (this.W) {
            this.W = false;
            const t = this.v;
            const e = this.styles;
            const i = this.ze(t);
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
        this.W = false;
        this.P = false;
        this.L = t;
        this.k = e;
        this.cf = i;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (At(t, this.v)) {
            return;
        }
        this.ov = this.v;
        this.v = t;
        this.W = true;
        if (!this.cf.readonly) {
            this.F();
        }
    }
    F() {
        if (this.W) {
            this.W = false;
            this.L[this.k] = this.v ?? this.cf.default;
            this.K();
        }
    }
    handleEvent() {
        this.ov = this.v;
        this.v = this.L[this.k];
        if (this.ov !== this.v) {
            this.W = false;
            this.K();
        }
    }
    M() {
        this.v = this.ov = this.L[this.k];
    }
    K() {
        hs = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, hs);
    }
}

mixinNodeObserverUseConfig(ValueAttributeObserver);

$(ValueAttributeObserver);

let hs = void 0;

const as = "http://www.w3.org/1999/xlink";

const cs = "http://www.w3.org/XML/1998/namespace";

const us = "http://www.w3.org/2000/xmlns/";

const fs = xt(createLookup(), {
    "xlink:actuate": [ "actuate", as ],
    "xlink:arcrole": [ "arcrole", as ],
    "xlink:href": [ "href", as ],
    "xlink:role": [ "role", as ],
    "xlink:show": [ "show", as ],
    "xlink:title": [ "title", as ],
    "xlink:type": [ "type", as ],
    "xml:lang": [ "lang", cs ],
    "xml:space": [ "space", cs ],
    xmlns: [ "xmlns", us ],
    "xmlns:xlink": [ "xlink", us ]
});

const ds = new j;

ds.type = 2 | 4;

class NodeObserverLocator {
    constructor() {
        this.allowDirtyCheck = true;
        this.Xe = createLookup();
        this.Qe = createLookup();
        this.Ke = createLookup();
        this.Ye = createLookup();
        this.Ze = a(A);
        this.p = a(Vt);
        this.Je = a(W);
        this.svg = a(ts);
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
        It(z, NodeObserverLocator).register(t);
        Tt(z, NodeObserverLocator).register(t);
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
        if (e in this.Ye || e in (this.Ke[t.tagName] ?? C)) {
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
            return ns;

          default:
            {
                const i = fs[e];
                if (i !== undefined) {
                    return AttributeNSAccessor.forNs(i[1]);
                }
                if (isDataAttribute(t, e, this.svg)) {
                    return ns;
                }
                return ds;
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
        const n = fs[e];
        if (n !== undefined) {
            return AttributeNSAccessor.forNs(n[1]);
        }
        if (isDataAttribute(t, e, this.svg)) {
            return ns;
        }
        if (e in t.constructor.prototype) {
            if (this.allowDirtyCheck) {
                return this.Je.createProperty(t, e);
            }
            throw createError(`AUR0652:${gt(e)}`);
        } else {
            return new X(t, e);
        }
    }
}

NodeObserverLocator.inject = [ A, Vt, W, ts ];

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
    throw createError(`AUR0653:${gt(e)}@${t}`);
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
        this.P = false;
        this.L = t;
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
        this.K();
    }
    handleCollectionChange() {
        this.si();
    }
    handleChange(t, e) {
        this.si();
    }
    si() {
        const t = this.v;
        const e = this.L;
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
        const e = this.L;
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
        this.K();
    }
    M() {
        this.ii();
    }
    $() {
        this.ti?.unsubscribe(this);
        this.ei?.unsubscribe(this);
        this.ti = this.ei = void 0;
    }
    K() {
        ms = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, ms);
    }
    ii() {
        const t = this.L;
        (this.ei ?? (this.ei = t.$observers?.model ?? t.$observers?.value))?.subscribe(this);
        this.ti?.unsubscribe(this);
        this.ti = void 0;
        if (t.type === "checkbox") {
            (this.ti = getCollectionObserver(this.v, this.oL))?.subscribe(this);
        }
    }
}

mixinNodeObserverUseConfig(CheckedObserver);

$(CheckedObserver);

let ms = void 0;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) {
            throw createError(`AURxxxx`);
        }
        e.useTargetObserver(ns);
    }
}

bindingBehavior("attr")(AttrBindingBehavior);

class SelfBindingBehavior {
    bind(t, e) {
        if (!(e instanceof ListenerBinding)) {
            throw createError(`AUR0801`);
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
        this.oL = a(H);
        this.ni = a(z);
    }
    bind(t, e, ...i) {
        if (!(this.ni instanceof NodeObserverLocator)) {
            throw createError("AURxxxx: updateTrigger binding behavior only works with the default implementation of Aurelia HTML observation. Implement your own node observation + updateTrigger");
        }
        if (i.length === 0) {
            throw createError(`AUR0802`);
        }
        if (!(e instanceof PropertyBinding) || !(e.mode & 4)) {
            throw createError(`AUR0803`);
        }
        const s = this.ni.getNodeObserverConfig(e.target, e.targetProperty);
        if (s == null) {
            {
                throw createError(`AURxxxx`);
            }
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
        this.li = a(Pe);
        this.l = a(Gt);
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
        this.f = a(Pe);
    }
    link(t, e, i, s) {
        const n = t.children;
        const r = n[n.length - 1];
        if (r instanceof If) {
            r.elseFactory = this.f;
        } else if (r.viewModel instanceof If) {
            r.viewModel.elseFactory = this.f;
        } else {
            throw createError(`AUR0810`);
        }
    }
}

templateController({
    name: "else"
})(Else);

function dispose(t) {
    t.dispose();
}

const gs = [ 18, 17 ];

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
                    {
                        throw createError(`AUR775:${s}`);
                    }
                }
            } else {
                {
                    throw createError(`AUR776:${t}`);
                }
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
                while (t != null && gs.includes(t.$kind)) {
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
        this.Ai(this.items, void 0);
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
        this.Ai(t, e);
    }
    Ai(t, e) {
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
                const A = new Map;
                const C = this.hi;
                const R = this.ai;
                const S = this.$controller.scope;
                d = 0;
                t: {
                    while (true) {
                        if (r) {
                            g = m[d];
                            p = l[d];
                            v = getKeyValue(C, n, g, getScope(R, g, a, S, u, t, f), u);
                            b = getKeyValue(C, n, p, getScope(R, p, a, S, u, t, f), u);
                        } else {
                            g = v = ensureUnique(m[d], d);
                            p = b = ensureUnique(l[d], d);
                        }
                        if (v !== b) {
                            C.set(g, v);
                            C.set(p, b);
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
                            v = getKeyValue(C, n, g, getScope(R, g, a, S, u, t, f), u);
                            b = getKeyValue(C, n, p, getScope(R, p, a, S, u, t, f), u);
                        } else {
                            g = v = ensureUnique(m[d], d);
                            p = b = ensureUnique(l[d], d);
                        }
                        if (v !== b) {
                            C.set(g, v);
                            C.set(p, b);
                            break;
                        }
                        --x;
                        if (d > x) {
                            break t;
                        }
                    }
                }
                const B = d;
                const _ = d;
                for (d = _; d <= y; ++d) {
                    if (C.has(p = r ? l[d] : ensureUnique(l[d], d))) {
                        b = C.get(p);
                    } else {
                        b = r ? getKeyValue(C, n, p, getScope(R, p, a, S, u, t, f), u) : p;
                        C.set(p, b);
                    }
                    A.set(b, d);
                }
                for (d = B; d <= w; ++d) {
                    if (C.has(g = r ? m[d] : ensureUnique(m[d], d))) {
                        v = C.get(g);
                    } else {
                        v = r ? getKeyValue(C, n, g, i[d].scope, u) : g;
                    }
                    k.set(v, d);
                    if (A.has(v)) {
                        e[A.get(v)] = d;
                    } else {
                        e.deletedIndices.push(d);
                        e.deletedItems.push(g);
                    }
                }
                for (d = _; d <= y; ++d) {
                    if (!k.has(C.get(r ? l[d] : ensureUnique(l[d], d)))) {
                        e[d] = -2;
                    }
                }
                k.clear();
                A.clear();
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
                const e = w(this.Ci(t), (() => this.Ri(s, t)));
                if (isPromise(e)) {
                    e.catch(rethrow);
                }
            } else {
                this.Ri(s, t);
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
            i = this.fi = !At(this.items, e);
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
    Ci(t) {
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
    Ri(t, e) {
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
            throw mismatchedLengthError(d.length, b);
        }
        const x = h.scope;
        const w = e.length;
        Z(d, e);
        const y = longestIncreasingSubsequence(e);
        const k = y.length;
        const A = v.declaration;
        let C;
        let R = k - 1;
        l = w - 1;
        for (;l >= 0; --l) {
            n = d[l];
            C = d[l + 1];
            n.nodes.link(C?.nodes ?? f);
            if (e[l] === -2) {
                r = getScope(p, u[l], v, x, g, c, m);
                setContextualProperties(r.overrideContext, l, w);
                n.setLocation(f);
                s = n.activate(n, h, r);
                if (isPromise(s)) {
                    (i ?? (i = [])).push(s);
                }
            } else if (R < 0 || k === 1 || l !== y[R]) {
                if (m) {
                    U(A, n.scope, g, u[l]);
                } else {
                    n.scope.bindingContext[c] = u[l];
                }
                setContextualProperties(n.scope.overrideContext, l, w);
                n.nodes.insertBefore(n.location);
            } else {
                if (m) {
                    U(A, n.scope, g, u[l]);
                } else {
                    n.scope.bindingContext[c] = u[l];
                }
                if (t !== w) {
                    setContextualProperties(n.scope.overrideContext, l, w);
                }
                --R;
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

Repeat.inject = [ Ue, F, Gt, wi, Pe ];

__decorate([ bindable ], Repeat.prototype, "items", void 0);

templateController("repeat")(Repeat);

let ps = 16;

let vs = new Int32Array(ps);

let bs = new Int32Array(ps);

function longestIncreasingSubsequence(t) {
    const e = t.length;
    if (e > ps) {
        ps = e;
        vs = new Int32Array(e);
        bs = new Int32Array(e);
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
            l = vs[i];
            n = t[l];
            if (n !== -2 && n < s) {
                bs[r] = l;
                vs[++i] = r;
                continue;
            }
            h = 0;
            a = i;
            while (h < a) {
                c = h + a >> 1;
                n = t[vs[c]];
                if (n !== -2 && n < s) {
                    h = c + 1;
                } else {
                    a = c;
                }
            }
            n = t[vs[h]];
            if (s < n || n === -2) {
                if (h > 0) {
                    bs[r] = vs[h - 1];
                }
                vs[h] = r;
            }
        }
    }
    r = ++i;
    const u = new Int32Array(r);
    s = vs[i - 1];
    while (i-- > 0) {
        u[i] = s;
        s = bs[s];
    }
    while (r-- > 0) vs[r] = 0;
    return u;
}

const mismatchedLengthError = (t, e) => createError(`AUR0814:${t}!=${e}`);

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

const xs = pt.toString;

const getCount = t => {
    switch (xs.call(t)) {
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
        throw createError(`Cannot count ${xs.call(t)}`);
    }
};

const iterate = (t, e) => {
    switch (xs.call(t)) {
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
        throw createError(`Cannot iterate over ${xs.call(t)}`);
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
            U(i.declaration, h = V.fromParent(s, new J), n, e);
        } else {
            h = V.fromParent(s, new J(r, e));
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
        this.view = a(Pe).create().setLocation(a(Gt));
    }
    valueChanged(t, e) {
        const i = this.$controller;
        const s = this.view.bindings;
        let n;
        let r = 0, l = 0;
        if (i.isActive && s != null) {
            n = V.fromParent(i.scope, t === void 0 ? {} : t);
            for (l = s.length; l > r; ++r) {
                s[r].bind(n);
            }
        }
    }
    attaching(t, e) {
        const {$controller: i, value: s} = this;
        const n = V.fromParent(i.scope, s === void 0 ? {} : s);
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

let ws = class Switch {
    constructor() {
        this.cases = [];
        this.activeCases = [];
        this.promise = void 0;
        this.f = a(Pe);
        this.l = a(Gt);
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
        this.queue((() => this.Bi(t)));
    }
    Bi(t) {
        const e = t.isMatch(this.value);
        const i = this.activeCases;
        const s = i.length;
        if (!e) {
            if (s > 0 && i[0].id === t.id) {
                return this._i(null);
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
        return w(this._i(null, n), (() => {
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
        return w(this.activeCases.length > 0 ? this._i(t, i) : void 0, (() => {
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
    _i(t, e = []) {
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

__decorate([ bindable ], ws.prototype, "value", void 0);

ws = __decorate([ templateController("switch") ], ws);

let ys = 0;

let ks = class Case {
    constructor() {
        this.id = ++ys;
        this.fallThrough = false;
        this.view = void 0;
        this.f = a(Pe);
        this.Ze = a(H);
        this.l = a(Gt);
        this.Ii = a(R).scopeTo(`${this.constructor.name}-#${this.id}`);
    }
    link(t, e, i, s) {
        const n = t.parent;
        const r = n?.viewModel;
        if (r instanceof ws) {
            this.$switch = r;
            this.linkToSwitch(r);
        } else {
            throw createError(`AUR0815`);
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

__decorate([ bindable ], ks.prototype, "value", void 0);

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
}) ], ks.prototype, "fallThrough", void 0);

ks = __decorate([ templateController("case") ], ks);

let As = class DefaultCase extends ks {
    linkToSwitch(t) {
        if (t.defaultCase !== void 0) {
            throw createError(`AUR0816`);
        }
        t.defaultCase = this;
    }
};

As = __decorate([ templateController("default-case") ], As);

let Cs = class PromiseTemplateController {
    constructor() {
        this.preSettledTask = null;
        this.postSettledTask = null;
        this.f = a(Pe);
        this.l = a(Gt);
        this.p = a(Vt);
        this.logger = a(R).scopeTo("promise.resolve");
    }
    link(t, e, i, s) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(t, e) {
        const i = this.view;
        const s = this.$controller;
        return w(i.activate(t, s, this.viewScope = V.fromParent(s.scope, {})), (() => this.swap(t)));
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
            this.logger.warn(`The value '${gt(e)}' is not a promise. No change will be done.`);
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

let Rs = class PendingTemplateController {
    constructor() {
        this.view = void 0;
        this.f = a(Pe);
        this.l = a(Gt);
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
}) ], Rs.prototype, "value", void 0);

Rs = __decorate([ templateController("pending") ], Rs);

let Ss = class FulfilledTemplateController {
    constructor() {
        this.view = void 0;
        this.f = a(Pe);
        this.l = a(Gt);
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
}) ], Ss.prototype, "value", void 0);

Ss = __decorate([ templateController("then") ], Ss);

let Bs = class RejectedTemplateController {
    constructor() {
        this.view = void 0;
        this.f = a(Pe);
        this.l = a(Gt);
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
}) ], Bs.prototype, "value", void 0);

Bs = __decorate([ templateController("catch") ], Bs);

function getPromiseController(t) {
    const e = t.parent;
    const i = e?.viewModel;
    if (i instanceof Cs) {
        return i;
    }
    throw createError(`AUR0813`);
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

let Ts = class FulfilledAttributePattern {
    then(t, e, i) {
        return new AttrSyntax(t, e, "then", "from-view");
    }
};

Ts = __decorate([ attributePattern({
    pattern: "then",
    symbols: ""
}) ], Ts);

let Is = class RejectedAttributePattern {
    catch(t, e, i) {
        return new AttrSyntax(t, e, "catch", "from-view");
    }
};

Is = __decorate([ attributePattern({
    pattern: "catch",
    symbols: ""
}) ], Is);

class Focus {
    constructor() {
        this.Li = false;
        this.Pi = a(Wt);
        this.p = a(Vt);
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) {
            this.Mi();
        } else {
            this.Li = true;
        }
    }
    attached() {
        if (this.Li) {
            this.Li = false;
            this.Mi();
        }
        this.Pi.addEventListener("focus", this);
        this.Pi.addEventListener("blur", this);
    }
    detaching() {
        const t = this.Pi;
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
    Mi() {
        const t = this.Pi;
        const e = this.$i;
        const i = this.value;
        if (i && !e) {
            t.focus();
        } else if (!i && e) {
            t.blur();
        }
    }
    get $i() {
        return this.Pi === this.p.document.activeElement;
    }
}

Focus.inject = [ Wt, Vt ];

__decorate([ bindable({
    mode: 6
}) ], Focus.prototype, "value", void 0);

customAttribute("focus")(Focus);

class Portal {
    constructor() {
        this.position = "beforeend";
        this.strict = false;
        const t = a(Pe);
        const e = a(Gt);
        const i = a(Vt);
        this.p = i;
        this.Di = i.document.createElement("div");
        (this.view = t.create()).setLocation(this.qi = createLocation(i));
        setEffectiveParentNode(this.view.nodes, e);
    }
    attaching(t) {
        if (this.callbackContext == null) {
            this.callbackContext = this.$controller.scope.bindingContext;
        }
        const e = this.Di = this.Ui();
        this.Fi(e, this.position);
        return this.Hi(t, e);
    }
    detaching(t) {
        return this.Oi(t, this.Di);
    }
    targetChanged() {
        const {$controller: t} = this;
        if (!t.isActive) {
            return;
        }
        const e = this.Ui();
        if (this.Di === e) {
            return;
        }
        this.Di = e;
        const i = w(this.Oi(null, e), (() => {
            this.Fi(e, this.position);
            return this.Hi(null, e);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    positionChanged() {
        const {$controller: t, Di: e} = this;
        if (!t.isActive) {
            return;
        }
        const i = w(this.Oi(null, e), (() => {
            this.Fi(e, this.position);
            return this.Hi(null, e);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    Hi(t, e) {
        const {activating: i, callbackContext: s, view: n} = this;
        return w(i?.call(s, e, n), (() => this.Vi(t, e)));
    }
    Vi(t, e) {
        const {$controller: i, view: s} = this;
        if (t === null) {
            s.nodes.insertBefore(this.qi);
        } else {
            return w(s.activate(t ?? s, i, i.scope), (() => this.Ni(e)));
        }
        return this.Ni(e);
    }
    Ni(t) {
        const {activated: e, callbackContext: i, view: s} = this;
        return e?.call(i, t, s);
    }
    Oi(t, e) {
        const {deactivating: i, callbackContext: s, view: n} = this;
        return w(i?.call(s, e, n), (() => this.ji(t, e)));
    }
    ji(t, e) {
        const {$controller: i, view: s} = this;
        if (t === null) {
            s.nodes.remove();
        } else {
            return w(s.deactivate(t, i), (() => this.Wi(e)));
        }
        return this.Wi(e);
    }
    Wi(t) {
        const {deactivated: e, callbackContext: i, view: s} = this;
        return e?.call(i, t, s);
    }
    Ui() {
        const t = this.p;
        const e = t.document;
        let i = this.target;
        let s = this.renderContext;
        if (i === "") {
            if (this.strict) {
                throw createError(`AUR0811`);
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
                throw createError(`AUR0812`);
            }
            return e.body;
        }
        return i;
    }
    Fi(t, e) {
        const i = this.qi;
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

let Es = class AuSlot {
    constructor() {
        this.zi = null;
        this.Gi = null;
        this.Yt = false;
        this.expose = null;
        this.slotchange = null;
        this.Xi = new Set;
        this.ui = null;
        const t = a(Gt);
        const e = a(Ue);
        const i = a(yi);
        const s = a(ui);
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
            this.Ki = l.container.getAll($e, false)?.filter((t => t.slotName === "*" || t.slotName === n.name)) ?? u;
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
        this.zi = this.$controller.scope.parent;
        let i;
        if (this.Qi) {
            i = this.Zi.controller.scope.parent;
            (this.Gi = V.fromParent(i, i.bindingContext)).overrideContext.$host = this.expose ?? this.zi.bindingContext;
        }
    }
    attaching(t, e) {
        return w(this.view.activate(t, this.$controller, this.Qi ? this.Gi : this.zi), (() => {
            if (this.Yi) {
                this.Ki.forEach((t => t.watch(this)));
                this.ii();
                this.Ji();
                this.Yt = true;
            }
        }));
    }
    detaching(t, e) {
        this.Yt = false;
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
        if (this.Yt) {
            this.slotchange?.call(void 0, this.name, t);
        }
        for (i of e) {
            i.handleSlotChange(this, t);
        }
    }
};

__decorate([ bindable ], Es.prototype, "expose", void 0);

__decorate([ bindable ], Es.prototype, "slotchange", void 0);

Es = __decorate([ customElement({
    name: "au-slot",
    template: null,
    containerless: true
}) ], Es);

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

var Ls;

(function(t) {
    t[t["Element"] = 1] = "Element";
    t[t["Attribute"] = 2] = "Attribute";
})(Ls || (Ls = {}));

class AuCompose {
    constructor() {
        this.scopeBehavior = "auto";
        this.es = void 0;
        this.c = a(v);
        this.parent = a(wi);
        this.host = a(Wt);
        this.l = a(Gt);
        this.p = a(Vt);
        this.r = a(ui);
        this.ss = a(Ue);
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
                throw createError(`AUR0806`);
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
                    name: ae.generateName(),
                    template: n
                });
                const r = this.r.getViewFactory(s, d);
                const l = Controller.$view(r, c);
                const h = this.scopeBehavior === "auto" ? V.fromParent(this.parent.scope, e) : V.create(e);
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
        registerResolver(t, Gt, new f("IRenderLocation", n ? i : null));
        const r = t.invoke(e);
        registerResolver(t, e, new f("au-compose.component", r));
        return r;
    }
    getDef(t) {
        const e = isFunction(t) ? t : t?.constructor;
        return ae.isType(e) ? ae.getDefinition(e) : null;
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
        throw createError(`AUR0805`);
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
            throw createError(`AUR0807:${this.controller.name}`);
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
            throw createError(`AUR0808`);

          default:
            this.state = -1;
        }
    }
}

const Ps = /*@__PURE__*/ _t("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw createError('"sanitize" method not implemented');
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

const Ms = /*@__PURE__*/ _t("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const $s = {};

class TemplateElementFactory {
    constructor() {
        this.p = a(Vt);
        this.ls = createTemplate(this.p);
    }
    createTemplate(t) {
        if (isString(t)) {
            let e = $s[t];
            if (e === void 0) {
                const i = this.ls;
                i.innerHTML = t;
                const s = i.content.firstElementChild;
                if (s == null || s.nodeName !== "TEMPLATE" || s.nextElementSibling != null) {
                    this.ls = createTemplate(this.p);
                    e = i;
                } else {
                    i.content.removeChild(s);
                    e = s;
                }
                $s[t] = e;
            }
            return e.cloneNode(true);
        }
        if (t.nodeName !== "TEMPLATE") {
            const e = createTemplate(this.p);
            e.content.appendChild(t);
            return e;
        }
        t.parentNode?.removeChild(t);
        return t.cloneNode(true);
    }
}

const createTemplate = t => t.document.createElement("template");

class TemplateCompiler {
    constructor() {
        this.debug = false;
        this.resolveResources = true;
    }
    static register(t) {
        t.register(Tt(this, this), It(this, Fe));
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
        const l = r.nodeName === qs && r.content != null;
        const h = l ? r.content : r;
        const a = e.get(allResources(Xs));
        const c = a.length;
        let f = 0;
        if (c > 0) {
            while (c > f) {
                a[f].compiling?.(r);
                ++f;
            }
        }
        if (r.hasAttribute(Gs)) {
            throw createError(`AUR0701`);
        }
        this.bs(h, n);
        this.xs(h, n);
        return CustomElementDefinition.create({
            ...t,
            name: t.name || le(),
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
        let A;
        let C;
        for (;c > u; ++u) {
            f = e[u];
            A = f.target;
            C = f.rawValue;
            x = n.ks(f);
            if (x !== null && (x.type & 1) > 0) {
                Vs.node = s;
                Vs.attr = f;
                Vs.bindable = null;
                Vs.def = null;
                r.push(x.build(Vs, n.ep, n.m));
                continue;
            }
            d = n.As(A);
            if (d !== null) {
                if (d.isTemplateController) {
                    throw createError(`AUR0703:${A}`);
                }
                p = BindablesInfo.from(d, true);
                y = d.noMultiBindings === false && x === null && hasInlineBindings(C);
                if (y) {
                    g = this.Cs(s, C, d, n);
                } else {
                    b = p.primary;
                    if (x === null) {
                        w = a.parse(C, 1);
                        g = [ w === null ? new SetPropertyInstruction(C, b.property) : new InterpolationInstruction(w, b.property) ];
                    } else {
                        Vs.node = s;
                        Vs.attr = f;
                        Vs.bindable = b;
                        Vs.def = d;
                        g = [ x.build(Vs, n.ep, n.m) ];
                    }
                }
                (m ?? (m = [])).push(new HydrateAttributeInstruction(this.resolveResources ? d : d.name, d.aliases != null && d.aliases.includes(A) ? A : void 0, g));
                continue;
            }
            if (x === null) {
                w = a.parse(C, 1);
                if (h) {
                    p = BindablesInfo.from(l, false);
                    v = p.attrs[A];
                    if (v !== void 0) {
                        w = a.parse(C, 1);
                        r.push(new SpreadElementPropBindingInstruction(w == null ? new SetPropertyInstruction(C, v.property) : new InterpolationInstruction(w, v.property)));
                        continue;
                    }
                }
                if (w != null) {
                    r.push(new InterpolationInstruction(w, n.m.map(s, A) ?? k(A)));
                } else {
                    switch (A) {
                      case "class":
                        r.push(new SetClassAttributeInstruction(C));
                        break;

                      case "style":
                        r.push(new SetStyleAttributeInstruction(C));
                        break;

                      default:
                        r.push(new SetAttributeInstruction(C, A));
                    }
                }
            } else {
                if (h) {
                    p = BindablesInfo.from(l, false);
                    v = p.attrs[A];
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
            u = e.Me.parse(a, c);
            w = u.target;
            y = u.rawValue;
            if (Ns[w]) {
                throw createError(`AUR0702:${a}`);
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
            f = e.As(w);
            if (f !== null) {
                if (f.isTemplateController) {
                    throw createError(`AUR0703:${w}`);
                }
                g = BindablesInfo.from(f, true);
                x = f.noMultiBindings === false && v === null && hasInlineBindings(y);
                if (x) {
                    m = this.Cs(t, y, f, e);
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
                return this.Rs(t, e);

              default:
                return this.Ss(t, e);
            }

          case 3:
            return this.Bs(t, e);

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
    Rs(t, e) {
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
            c = e.Me.parse(u, f);
            m = c.target;
            g = c.rawValue;
            d = e.ks(c);
            if (d !== null) {
                if (c.command === "bind") {
                    n.push(new LetBindingInstruction(r.parse(g, 16), k(m)));
                } else {
                    throw createError(`AUR0704:${c.command}`);
                }
                continue;
            }
            p = r.parse(g, 1);
            n.push(new LetBindingInstruction(p === null ? new tt(g) : p, k(m)));
        }
        e.rows.push([ new HydrateLetElementInstruction(n, l) ]);
        return this._s(t, e).nextSibling;
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
            t.removeAttribute(R);
            --A;
            --y;
        };
        let x = t.attributes;
        let w;
        let y = x.length;
        let A = 0;
        let C;
        let R;
        let S;
        let B;
        let _;
        let T;
        let I = null;
        let E = false;
        let L;
        let P;
        let M;
        let $;
        let D;
        let q;
        let U;
        let F = null;
        let H;
        let O;
        let V;
        let N;
        let j = true;
        let W = false;
        let z = false;
        let G = false;
        if (a === "slot") {
            if (e.root.def.shadowOptions == null) {
                throw createError(`AUR0717:${e.root.def.name}`);
            }
            e.root.hasSlot = true;
        }
        if (f) {
            j = c.processContent?.call(c.Type, t, e.p);
            x = t.attributes;
            y = x.length;
        }
        for (;y > A; ++A) {
            C = x[A];
            R = C.name;
            S = C.value;
            switch (R) {
              case "as-element":
              case "containerless":
                b();
                if (!W) {
                    W = R === "containerless";
                }
                continue;
            }
            B = e.Me.parse(R, S);
            F = e.ks(B);
            V = B.target;
            N = B.rawValue;
            if (m && (!g || g && m(V))) {
                if (F != null && F.type & 1) {
                    b();
                    p.push(B);
                    continue;
                }
                z = V !== Js && V !== "slot";
                if (z) {
                    H = BindablesInfo.from(c, false);
                    if (H.attrs[V] == null && !e.As(V)?.isTemplateController) {
                        b();
                        p.push(B);
                        continue;
                    }
                }
            }
            if (F !== null && F.type & 1) {
                Vs.node = t;
                Vs.attr = B;
                Vs.bindable = null;
                Vs.def = null;
                (_ ?? (_ = [])).push(F.build(Vs, e.ep, e.m));
                b();
                continue;
            }
            I = e.As(V);
            if (I !== null) {
                H = BindablesInfo.from(I, true);
                E = I.noMultiBindings === false && F === null && hasInlineBindings(N);
                if (E) {
                    M = this.Cs(t, N, I, e);
                } else {
                    O = H.primary;
                    if (F === null) {
                        q = v.parse(N, 1);
                        M = [ q === null ? new SetPropertyInstruction(N, O.property) : new InterpolationInstruction(q, O.property) ];
                    } else {
                        Vs.node = t;
                        Vs.attr = B;
                        Vs.bindable = O;
                        Vs.def = I;
                        M = [ F.build(Vs, e.ep, e.m) ];
                    }
                }
                b();
                if (I.isTemplateController) {
                    ($ ?? ($ = [])).push(new HydrateTemplateController(Os, this.resolveResources ? I : I.name, void 0, M));
                } else {
                    (P ?? (P = [])).push(new HydrateAttributeInstruction(this.resolveResources ? I : I.name, I.aliases != null && I.aliases.includes(V) ? V : void 0, M));
                }
                continue;
            }
            if (F === null) {
                if (f) {
                    H = BindablesInfo.from(c, false);
                    L = H.attrs[V];
                    if (L !== void 0) {
                        q = v.parse(N, 1);
                        (T ?? (T = [])).push(q == null ? new SetPropertyInstruction(N, L.property) : new InterpolationInstruction(q, L.property));
                        b();
                        continue;
                    }
                }
                q = v.parse(N, 1);
                if (q != null) {
                    b();
                    (_ ?? (_ = [])).push(new InterpolationInstruction(q, e.m.map(t, V) ?? k(V)));
                }
                continue;
            }
            b();
            if (f) {
                H = BindablesInfo.from(c, false);
                L = H.attrs[V];
                if (L !== void 0) {
                    Vs.node = t;
                    Vs.attr = B;
                    Vs.bindable = L;
                    Vs.def = c;
                    (T ?? (T = [])).push(F.build(Vs, e.ep, e.m));
                    continue;
                }
            }
            Vs.node = t;
            Vs.attr = B;
            Vs.bindable = null;
            Vs.def = null;
            (_ ?? (_ = [])).push(F.build(Vs, e.ep, e.m));
        }
        resetCommandBuildInfo();
        if (this.Ts(t, _) && _ != null && _.length > 1) {
            this.Is(t, _);
        }
        if (f) {
            U = new HydrateElementInstruction(this.resolveResources ? c : c.name, void 0, T ?? u, null, W, p);
            if (a === Js) {
                const i = t.getAttribute("name") || Zs;
                const s = e.t();
                const n = e.Es();
                let r = t.firstChild;
                let l = 0;
                while (r !== null) {
                    if (r.nodeType === 1 && r.hasAttribute(Js)) {
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
                U.auSlot = {
                    name: i,
                    fallback: CustomElementDefinition.create({
                        name: le(),
                        template: s,
                        instructions: n.rows,
                        needsCompile: false
                    })
                };
            }
        }
        if (_ != null || U != null || P != null) {
            w = u.concat(U ?? u, P ?? u, _ ?? u);
            G = true;
        }
        let X;
        if ($ != null) {
            y = $.length - 1;
            A = y;
            D = $[A];
            let s;
            if (isMarker(t)) {
                s = e.t();
                appendManyToTemplate(s, [ e.h(Ds), e.Ls(Us), e.Ls(Fs) ]);
            } else {
                this.Ps(t, e);
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
            let k = 0, C = 0;
            let R = t.firstChild;
            let S = false;
            if (j !== false) {
                while (R !== null) {
                    u = R.nodeType === 1 ? R.getAttribute(Js) : null;
                    if (u !== null) {
                        R.removeAttribute(Js);
                    }
                    if (f) {
                        h = R.nextSibling;
                        if (!d) {
                            S = R.nodeType === 3 && R.textContent.trim() === "";
                            if (!S) {
                                ((i = g ?? (g = {}))[n = u || Zs] ?? (i[n] = [])).push(R);
                            }
                            t.removeChild(R);
                        }
                        R = h;
                    } else {
                        if (u !== null) {
                            u = u || Zs;
                            throw createError(`AUR0706:${a}[${u}]`);
                        }
                        R = R.nextSibling;
                    }
                }
            }
            if (g != null) {
                m = {};
                for (u in g) {
                    s = e.t();
                    p = g[u];
                    for (k = 0, C = p.length; C > k; ++k) {
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
                        name: le(),
                        template: s,
                        instructions: x.rows,
                        needsCompile: false,
                        isStrictBinding: e.root.def.isStrictBinding
                    });
                }
                U.projections = m;
            }
            if (G) {
                if (f && (W || c.containerless)) {
                    this.Ps(t, e);
                } else {
                    this._s(t, e);
                }
            }
            X = !f || !c.containerless && !W && j !== false;
            if (X) {
                if (t.nodeName === qs) {
                    this.xs(t.content, l);
                } else {
                    R = t.firstChild;
                    while (R !== null) {
                        R = this.xs(R, l);
                    }
                }
            }
            D.def = CustomElementDefinition.create({
                name: le(),
                template: r,
                instructions: l.rows,
                needsCompile: false,
                isStrictBinding: e.root.def.isStrictBinding
            });
            while (A-- > 0) {
                D = $[A];
                s = e.t();
                b = e.h(Ds);
                appendManyToTemplate(s, [ b, e.Ls(Us), e.Ls(Fs) ]);
                D.def = CustomElementDefinition.create({
                    name: le(),
                    template: s,
                    needsCompile: false,
                    instructions: [ [ $[A + 1] ] ],
                    isStrictBinding: e.root.def.isStrictBinding
                });
            }
            e.rows.push([ D ]);
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
                    n = i.nodeType === 1 ? i.getAttribute(Js) : null;
                    if (n !== null) {
                        i.removeAttribute(Js);
                    }
                    if (f) {
                        s = i.nextSibling;
                        if (!d) {
                            b = i.nodeType === 3 && i.textContent.trim() === "";
                            if (!b) {
                                ((r = u ?? (u = {}))[l = n || Zs] ?? (r[l] = [])).push(i);
                            }
                            t.removeChild(i);
                        }
                        i = s;
                    } else {
                        if (n !== null) {
                            n = n || Zs;
                            throw createError(`AUR0706:${a}[${n}]`);
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
                        if (g.nodeName === qs) {
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
                        name: le(),
                        template: p,
                        instructions: v.rows,
                        needsCompile: false,
                        isStrictBinding: e.root.def.isStrictBinding
                    });
                }
                U.projections = h;
            }
            if (G) {
                if (f && (W || c.containerless)) {
                    this.Ps(t, e);
                } else {
                    this._s(t, e);
                }
            }
            X = !f || !c.containerless && !W && j !== false;
            if (X && t.childNodes.length > 0) {
                i = t.firstChild;
                while (i !== null) {
                    i = this.xs(i, e);
                }
            }
        }
        return h;
    }
    Bs(t, e) {
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
                insertBefore(i, e.Ms(c), t);
            }
            for (h = 0, a = l.length; a > h; ++h) {
                insertManyBefore(i, t, [ e.h(Ds), e.Ms(" ") ]);
                if (c = r[h + 1]) {
                    insertBefore(i, e.Ms(c), t);
                }
                e.rows.push([ new TextBindingInstruction(l[h], e.root.def.isStrictBinding) ]);
            }
            i.removeChild(t);
        }
        return n;
    }
    Cs(t, e, i, s) {
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
                d = s.Me.parse(h, a);
                m = s.ks(d);
                g = n.attrs[d.target];
                if (g == null) {
                    throw createError(`AUR0707:${i.name}.${d.target}`);
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
        const i = t;
        const s = B(i.querySelectorAll("template[as-custom-element]"));
        const n = s.length;
        if (n === 0) {
            return;
        }
        if (n === i.childElementCount) {
            throw createError(`AUR0708`);
        }
        const r = new Set;
        const l = [];
        for (const t of s) {
            if (t.parentNode !== i) {
                throw createError(`AUR0709`);
            }
            const s = processTemplateName(t, r);
            const n = t.content;
            const h = B(n.querySelectorAll("bindable"));
            const a = new Set;
            const c = new Set;
            const u = h.reduce(((t, e) => {
                if (e.parentNode !== n) {
                    throw createError(`AUR0710`);
                }
                const i = e.getAttribute("property");
                if (i === null) {
                    throw createError(`AUR0711`);
                }
                const s = e.getAttribute("attribute");
                if (s !== null && c.has(s) || a.has(i)) {
                    throw createError(`AUR0712:${i}+${s}`);
                } else {
                    if (s !== null) {
                        c.add(s);
                    }
                    a.add(i);
                }
                const r = B(e.attributes).filter((t => !zs.includes(t.name)));
                if (r.length > 0) ;
                e.remove();
                t[i] = {
                    attribute: s ?? void 0,
                    mode: getBindingMode(e)
                };
                return t;
            }), {});
            class LocalTemplateType {}
            Ct(LocalTemplateType, "name", {
                value: s
            });
            l.push(LocalTemplateType);
            e.$s(defineElement({
                name: s,
                template: t,
                bindables: u
            }, LocalTemplateType));
            i.removeChild(t);
        }
        const h = [ ...e.def.dependencies ?? u, ...l ];
        for (const t of l) {
            getElementDefinition(t).dependencies.push(h.filter((e => e !== t)));
        }
    }
    Ts(t, e) {
        const i = t.nodeName;
        return i === "INPUT" && js[t.type] === 1 || i === "SELECT" && (t.hasAttribute("multiple") || e?.some((t => t.type === "rg" && t.to === "multiple")));
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
    _s(t, e) {
        insertBefore(t.parentNode, e.h(Ds), t);
        return t;
    }
    Ps(t, e) {
        if (isMarker(t)) {
            return t;
        }
        const i = t.parentNode;
        const s = e.h(Ds);
        insertManyBefore(i, t, [ s, e.Ls(Us), e.Ls(Fs) ]);
        i.removeChild(t);
        return s;
    }
}

const Ds = "AU-M";

const qs = "TEMPLATE";

const Us = "au-start";

const Fs = "au-end";

const isMarker = t => t.nodeName === Ds;

class CompilationContext {
    constructor(t, e, i, s, n, r) {
        this.hasSlot = false;
        this.Ds = createLookup();
        const l = s !== null;
        this.c = e;
        this.root = n === null ? this : n;
        this.def = t;
        this.ci = i;
        this.parent = s;
        this.vs = l ? s.vs : e.get(Ms);
        this.Me = l ? s.Me : e.get(Ti);
        this.ep = l ? s.ep : e.get(F);
        this.m = l ? s.m : e.get(es);
        this.Ii = l ? s.Ii : e.get(R);
        this.p = l ? s.p : e.get(Vt);
        this.localEls = l ? s.localEls : new Set;
        this.rows = r ?? [];
    }
    $s(t) {
        var e;
        ((e = this.root).deps ?? (e.deps = [])).push(t);
        this.root.c.register(t);
    }
    Ms(t) {
        return createText(this.p, t);
    }
    Ls(t) {
        return createComment(this.p, t);
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
        return this.c.find(ae, t);
    }
    As(t) {
        return this.c.find(te, t);
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
        let i = this.Ds[e];
        if (i === void 0) {
            i = this.c.create(Hi, e);
            if (i === null) {
                throw createError(`AUR0713:${e}`);
            }
            this.Ds[e] = i;
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

const js = {
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
                        throw createError(`AUR0714:${t.name}`);
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

const zs = bt([ "property", "attribute", "mode" ]);

const Gs = "as-custom-element";

const processTemplateName = (t, e) => {
    const i = t.getAttribute(Gs);
    if (i === null || i === "") {
        throw createError(`AUR0715`);
    }
    if (e.has(i)) {
        throw createError(`AUR0716:${i}`);
    } else {
        e.add(i);
        t.removeAttribute(Gs);
    }
    return i;
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

const Xs = /*@__PURE__*/ _t("ITemplateCompilerHooks");

const Qs = new WeakMap;

const Ks = /*@__PURE__*/ ct("compiler-hooks");

const Ys = bt({
    name: Ks,
    define(t) {
        let e = Qs.get(t);
        if (e === void 0) {
            Qs.set(t, e = new TemplateCompilerHooksDefinition(t));
            ot(Ks, e, t);
            ut(t, Ks);
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
        t.register(Tt(Xs, this.Type));
    }
}

const templateCompilerHooks = t => {
    return t === void 0 ? decorator : decorator(t);
    function decorator(t) {
        return Ys.define(t);
    }
};

const Zs = "default";

const Js = "au-slot";

class Show {
    constructor() {
        this.el = a(Wt);
        this.p = a(Vt);
        this.qs = false;
        this.Y = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.Y = null;
            if (Boolean(this.value) !== this.Us) {
                if (this.Us === this.Fs) {
                    this.Us = !this.Fs;
                    this.$val = this.el.style.getPropertyValue("display");
                    this.$prio = this.el.style.getPropertyPriority("display");
                    this.el.style.setProperty("display", "none", "important");
                } else {
                    this.Us = this.Fs;
                    this.el.style.setProperty("display", this.$val, this.$prio);
                    if (this.el.getAttribute("style") === "") {
                        this.el.removeAttribute("style");
                    }
                }
            }
        };
        const t = a(Ue);
        this.Us = this.Fs = t.alias !== "hide";
    }
    binding() {
        this.qs = true;
        this.update();
    }
    detaching() {
        this.qs = false;
        this.Y?.cancel();
        this.Y = null;
    }
    valueChanged() {
        if (this.qs && this.Y === null) {
            this.Y = this.p.domWriteQueue.queueTask(this.update);
        }
    }
}

__decorate([ bindable ], Show.prototype, "value", void 0);

alias("hide")(Show);

customAttribute("show")(Show);

const tn = [ TemplateCompiler, et, NodeObserverLocator ];

const en = [ Mi, Pi, qi ];

const sn = [ Di, $i ];

const nn = [ Wi, Oi, Ni, Vi, ji, zi, Zi, Gi, Xi, Yi, Ki, Qi, Ji ];

const rn = [ DebounceBindingBehavior, OneTimeBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, SignalBindingBehavior, ThrottleBindingBehavior, TwoWayBindingBehavior, SanitizeValueConverter, If, Else, Repeat, With, ws, ks, As, Cs, Rs, Ss, Bs, _s, Ts, Is, AttrBindingBehavior, SelfBindingBehavior, UpdateTriggerBindingBehavior, AuCompose, Portal, Focus, Show, Es ];

const on = [ Xe, Qe, ze, Ge, Oe, Ve, Ne, je, We, Ye, ii, Ze, Je, ti, ei, Ke, si ];

const ln = /*@__PURE__*/ createConfiguration(s);

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
            return e.register(Et(O, i.coercingOptions), ...tn, ...rn, ...en, ...nn, ...on);
        },
        customize(e) {
            return createConfiguration(e ?? t);
        }
    };
}

function children(t, e) {
    if (!cn) {
        cn = true;
        $(ChildrenBinding);
        lifecycleHooks()(ChildrenLifecycleHooks);
    }
    let i;
    const s = "dependencies";
    function decorator(t, e, n) {
        if (arguments.length > 1) {
            i.name = e;
        }
        if (typeof t === "function" || typeof n?.value !== "undefined") {
            throw new Error(`Invalid usage. @children can only be used on a field`);
        }
        const r = t.constructor;
        let l = ae.getAnnotation(r, s);
        if (l == null) {
            ae.annotate(r, s, l = []);
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
    constructor(t, e, i, s = defaultChildQuery, n = defaultChildFilter, r = defaultChildMap, l = hn) {
        this.Hs = void 0;
        this.ut = defaultChildQuery;
        this.Os = defaultChildFilter;
        this.Vs = defaultChildMap;
        this.isBound = false;
        this.Z = t;
        this.obj = e;
        this.cb = i;
        this.ut = s;
        this.Os = n;
        this.Vs = r;
        this.rt = l;
        this.ui = createMutationObserver(this.Ns = t.host, (() => {
            this.js();
        }));
    }
    getValue() {
        return this.isBound ? this.Hs : this.Ws();
    }
    setValue(t) {}
    bind() {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        this.ui.observe(this.Ns, this.rt);
        this.Hs = this.Ws();
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.ui.disconnect();
        this.Hs = u;
    }
    js() {
        this.Hs = this.Ws();
        this.cb?.call(this.obj);
        this.subs.notify(this.Hs, undefined);
    }
    get() {
        throw notImplemented("get");
    }
    Ws() {
        return filterChildren(this.Z, this.ut, this.Os, this.Vs);
    }
}

const hn = {
    childList: true
};

const notImplemented = t => createError(`Method "${t}": not implemented`);

const defaultChildQuery = t => t.host.childNodes;

const defaultChildFilter = (t, e, i) => !!i;

const defaultChildMap = (t, e, i) => i;

const an = {
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
        a = findElementControllerFor(h, an);
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
        Et(Ce, this).register(t);
    }
    hydrating(t, e) {
        const i = this.ft;
        const s = new ChildrenBinding(e, t, t[i.callback ?? `${gt(i.name)}Changed`], i.query ?? defaultChildQuery, i.filter ?? defaultChildFilter, i.map ?? defaultChildMap, i.options ?? hn);
        Ct(t, i.name, {
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

let cn = false;

export { AdoptedStyleSheetsStyles, AppRoot, Ot as AppTask, Di as AtPrefixedTriggerAttributePattern, AttrBindingBehavior, Qi as AttrBindingCommand, AttrSyntax, AttributeBinding, AttributeBindingInstruction, ii as AttributeBindingRenderer, AttributeNSAccessor, Li as AttributePattern, AuCompose, Es as AuSlot, AuSlotsInfo, Aurelia, St as Bindable, BindableDefinition, BindablesInfo, Mt as BindingBehavior, BindingBehaviorDefinition, Hi as BindingCommand, BindingCommandDefinition, is as BindingMode, BindingModeBehavior, BindingTargetSubscriber, CSSModulesProcessorRegistry, Xi as CaptureBindingCommand, ks as Case, CheckedObserver, ChildrenBinding, ClassAttributeAccessor, Yi as ClassBindingCommand, $i as ColonPrefixedBindAttributePattern, Ui as CommandType, ComputedWatcher, ContentBinding, Controller, te as CustomAttribute, CustomAttributeDefinition, Ne as CustomAttributeRenderer, ae as CustomElement, CustomElementDefinition, Ve as CustomElementRenderer, DataAttributeAccessor, DebounceBindingBehavior, Wi as DefaultBindingCommand, nn as DefaultBindingLanguage, en as DefaultBindingSyntax, As as DefaultCase, tn as DefaultComponents, on as DefaultRenderers, rn as DefaultResources, Ls as DefinitionType, Pi as DotSeparatedAttributePattern, Else, ExpressionWatcher, FlushQueue, Focus, zi as ForBindingCommand, FragmentNodeSequence, FromViewBindingBehavior, Ni as FromViewBindingCommand, Ss as FulfilledTemplateController, HydrateAttributeInstruction, HydrateElementInstruction, HydrateLetElementInstruction, HydrateTemplateController, Ri as IAppRoot, Ht as IAppTask, es as IAttrMapper, Ti as IAttributeParser, _i as IAttributePattern, $e as IAuSlotWatcher, Me as IAuSlotsInfo, Si as IAurelia, wi as IController, zt as IEventTarget, be as IFlushQueue, Zt as IHistory, yi as IHydrationContext, Ue as IInstruction, Ce as ILifecycleHooks, Yt as ILocation, Wt as INode, Vt as IPlatform, Gt as IRenderLocation, He as IRenderer, ui as IRendering, ts as ISVGAnalyzer, Ps as ISanitizer, de as IShadowDOMGlobalStyles, fe as IShadowDOMStyles, Bi as ISyntaxInterpreter, Fe as ITemplateCompiler, Xs as ITemplateCompilerHooks, Ms as ITemplateElementFactory, Pe as IViewFactory, Kt as IWindow, If, qe as InstructionType, InterpolationBinding, Ge as InterpolationBindingRenderer, InterpolationInstruction, InterpolationPartBinding, Interpretation, IteratorBindingInstruction, Qe as IteratorBindingRenderer, LetBinding, LetBindingInstruction, We as LetElementRenderer, Be as LifecycleHooks, LifecycleHooksDefinition, LifecycleHooksEntry, ListenerBinding, ListenerBindingInstruction, ListenerBindingOptions, Ye as ListenerBindingRenderer, MultiAttrInstruction, NodeObserverLocator, NoopSVGAnalyzer, OneTimeBindingBehavior, Oi as OneTimeBindingCommand, Rs as PendingTemplateController, Portal, Cs as PromiseTemplateController, PropertyBinding, PropertyBindingInstruction, Xe as PropertyBindingRenderer, Mi as RefAttributePattern, RefBinding, RefBindingInstruction, ze as RefBindingRenderer, Bs as RejectedTemplateController, Rendering, Repeat, SVGAnalyzer, SanitizeValueConverter, SelectValueObserver, SelfBindingBehavior, SetAttributeInstruction, Ze as SetAttributeRenderer, SetClassAttributeInstruction, Je as SetClassAttributeRenderer, SetPropertyInstruction, Oe as SetPropertyRenderer, SetStyleAttributeInstruction, ti as SetStyleAttributeRenderer, ShadowDOMRegistry, sn as ShortHandBindingSyntax, SignalBindingBehavior, SpreadBindingInstruction, SpreadElementPropBindingInstruction, si as SpreadRenderer, ln as StandardConfiguration, xi as State, StyleAttributeAccessor, Ki as StyleBindingCommand, me as StyleConfiguration, StyleElementStyles, StylePropertyBindingInstruction, ei as StylePropertyBindingRenderer, ws as Switch, TemplateCompiler, Ys as TemplateCompilerHooks, je as TemplateControllerRenderer, TextBindingInstruction, Ke as TextBindingRenderer, ThrottleBindingBehavior, ToViewBindingBehavior, Vi as ToViewBindingCommand, Gi as TriggerBindingCommand, TwoWayBindingBehavior, ji as TwoWayBindingCommand, UpdateTriggerBindingBehavior, ValueAttributeObserver, pe as ValueConverter, ValueConverterDefinition, ViewFactory, bi as ViewModelKind, se as Watch, With, alias, allResources, attributePattern, bindable, bindingBehavior, bindingCommand, capture, children, coercer, containerless, convertToRenderLocation, cssModules, customAttribute, customElement, getEffectiveParentNode, getRef, isCustomElementController, isCustomElementViewModel, isInstruction, isRenderLocation, lifecycleHooks, mixinAstEvaluator, mixinUseScope, mixingBindingLimited, processContent, registerAliases, renderer, setEffectiveParentNode, setRef, shadowCSS, slotted, strict, templateCompilerHooks, templateController, useShadowDOM, valueConverter, watch };
//# sourceMappingURL=index.mjs.map
