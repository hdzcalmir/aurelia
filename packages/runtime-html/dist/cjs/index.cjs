"use strict";

var t = require("@aurelia/kernel");

var e = require("@aurelia/metadata");

var s = require("@aurelia/runtime");

var i = require("@aurelia/platform-browser");

var n = require("@aurelia/platform");

function __decorate(t, e, s, i) {
    var n = arguments.length, r = n < 3 ? e : i === null ? i = Object.getOwnPropertyDescriptor(e, s) : i, l;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(t, e, s, i); else for (var h = t.length - 1; h >= 0; h--) if (l = t[h]) r = (n < 3 ? l(r) : n > 3 ? l(e, s, r) : l(e, s)) || r;
    return n > 3 && r && Object.defineProperty(e, s, r), r;
}

const r = Object;

const l = String;

const h = r.prototype;

const createLookup = () => r.create(null);

const createError$1 = t => new Error(t);

const a = h.hasOwnProperty;

const c = r.freeze;

const u = r.assign;

const f = r.getOwnPropertyNames;

const d = r.keys;

const p = /*@__PURE__*/ createLookup();

const isDataAttribute = (t, e, s) => {
    if (p[e] === true) {
        return true;
    }
    if (!isString(e)) {
        return false;
    }
    const i = e.slice(0, 5);
    return p[e] = i === "aria-" || i === "data-" || s.isStandardSvgAttribute(t, e);
};

const isPromise = t => t instanceof Promise;

const isArray = t => t instanceof Array;

const isFunction = t => typeof t === "function";

const isString = t => typeof t === "string";

const rethrow = t => {
    throw t;
};

const m = r.is;

const g = Reflect.defineProperty;

const defineHiddenProp = (t, e, s) => {
    g(t, e, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: s
    });
    return s;
};

const addSignalListener = (t, e, s) => t.addSignalListener(e, s);

const removeSignalListener = (t, e, s) => t.removeSignalListener(e, s);

const x = "Interpolation";

const v = "IsIterator";

const b = "IsFunction";

const y = "IsProperty";

const w = "pending";

const k = "running";

const C = s.AccessorType.Observer;

const A = s.AccessorType.Node;

const B = s.AccessorType.Layout;

const S = 1;

const _ = 2;

const R = 4;

const T = 6;

const I = 8;

const E = /*@__PURE__*/ c({
    oneTime: S,
    toView: _,
    fromView: R,
    twoWay: T,
    default: I
});

const P = e.Metadata.getOwn;

const L = e.Metadata.hasOwn;

const M = e.Metadata.define;

const {annotation: D, resource: q} = t.Protocol;

const H = D.keyFor;

const F = q.keyFor;

const O = q.appendTo;

const V = D.appendTo;

const N = D.getKeys;

function bindable(t, e) {
    let s;
    function decorator(t, e) {
        if (arguments.length > 1) {
            s.name = e;
        }
        M($, BindableDefinition.create(e, t, s), t.constructor, e);
        V(t.constructor, W.keyFrom(e));
    }
    if (arguments.length > 1) {
        s = {};
        decorator(t, e);
        return;
    } else if (isString(t)) {
        s = {};
        return decorator;
    }
    s = t === void 0 ? {} : t;
    return decorator;
}

function isBindableAnnotation(t) {
    return t.startsWith($);
}

const $ = /*@__PURE__*/ H("bindable");

const W = c({
    name: $,
    keyFrom: t => `${$}:${t}`,
    from(t, ...e) {
        const s = {};
        const i = Array.isArray;
        function addName(e) {
            s[e] = BindableDefinition.create(e, t);
        }
        function addDescription(e, i) {
            s[e] = i instanceof BindableDefinition ? i : BindableDefinition.create(e, t, i);
        }
        function addList(t) {
            if (i(t)) {
                t.forEach(addName);
            } else if (t instanceof BindableDefinition) {
                s[t.name] = t;
            } else if (t !== void 0) {
                d(t).forEach((e => addDescription(e, t[e])));
            }
        }
        e.forEach(addList);
        return s;
    },
    getAll(e) {
        const s = $.length + 1;
        const i = [];
        const n = t.getPrototypeChain(e);
        let r = n.length;
        let l = 0;
        let h;
        let a;
        let c;
        let u;
        while (--r >= 0) {
            c = n[r];
            h = N(c).filter(isBindableAnnotation);
            a = h.length;
            for (u = 0; u < a; ++u) {
                i[l++] = P($, c, h[u].slice(s));
            }
        }
        return i;
    }
});

class BindableDefinition {
    constructor(t, e, s, i, n, r) {
        this.attribute = t;
        this.callback = e;
        this.mode = s;
        this.primary = i;
        this.name = n;
        this.set = r;
    }
    static create(e, s, i = {}) {
        return new BindableDefinition(i.attribute ?? t.kebabCase(e), i.callback ?? `${e}Changed`, i.mode ?? _, i.primary ?? false, i.name ?? e, i.set ?? getInterceptor(e, s, i));
    }
}

function coercer(t, e, s) {
    j.define(t, e);
}

const j = {
    key: /*@__PURE__*/ H("coercer"),
    define(t, e) {
        M(j.key, t[e].bind(t), t);
    },
    for(t) {
        return P(j.key, t);
    }
};

function getInterceptor(s, i, n = {}) {
    const r = n.type ?? e.Metadata.get("design:type", i, s) ?? null;
    if (r == null) {
        return t.noop;
    }
    let l;
    switch (r) {
      case Number:
      case Boolean:
      case String:
      case BigInt:
        l = r;
        break;

      default:
        {
            const e = r.coerce;
            l = typeof e === "function" ? e.bind(r) : j.for(r) ?? t.noop;
            break;
        }
    }
    return l === t.noop ? l : createCoercer(l, n.nullable);
}

function createCoercer(t, e) {
    return function(s, i) {
        if (!i?.enableCoercion) return s;
        return (e ?? (i?.coerceNullish ?? false ? false : true)) && s == null ? s : t(s, i);
    };
}

const resource = e => t.createResolver(((t, e, s) => s.has(t, false) ? s.get(t) : s.root.get(t)))(e);

const optionalResource = e => t.createResolver(((t, e, s) => s.has(t, false) ? s.get(t) : s.root.has(t, false) ? s.root.get(t) : void 0))(e);

const allResources = e => t.createResolver(((t, e, s) => {
    if (s.root === s) {
        return s.getAll(t, false);
    }
    return s.has(t, false) ? s.getAll(t, false).concat(s.root.getAll(t, false)) : s.root.getAll(t, false);
}))(e);

const z = t.DI.createInterface;

const U = t.Registration.singleton;

const G = t.Registration.aliasTo;

const K = t.Registration.instance;

t.Registration.callback;

const X = t.Registration.transient;

const registerResolver = (t, e, s) => t.registerResolver(e, s);

function alias(...t) {
    return function(e) {
        const s = H("aliases");
        const i = P(s, e);
        if (i === void 0) {
            M(s, t, e);
        } else {
            i.push(...t);
        }
    };
}

function registerAliases(e, s, i, n) {
    for (let r = 0, l = e.length; r < l; ++r) {
        t.Registration.aliasTo(i, s.keyFrom(e[r])).register(n);
    }
}

const createMappedError = (t, ...e) => new Error(`AUR${l(t).padStart(4, "0")}:${e.map(l)}`);

function bindingBehavior(t) {
    return function(e) {
        return Y.define(t, e);
    };
}

class BindingBehaviorDefinition {
    constructor(t, e, s, i) {
        this.Type = t;
        this.name = e;
        this.aliases = s;
        this.key = i;
    }
    static create(e, s) {
        let i;
        let n;
        if (isString(e)) {
            i = e;
            n = {
                name: i
            };
        } else {
            i = e.name;
            n = e;
        }
        return new BindingBehaviorDefinition(s, t.firstDefined(getBehaviorAnnotation(s, "name"), i), t.mergeArrays(getBehaviorAnnotation(s, "aliases"), n.aliases, s.aliases), Y.keyFrom(i));
    }
    register(t) {
        const {Type: e, key: s, aliases: i} = this;
        U(s, e).register(t);
        G(s, e).register(t);
        registerAliases(i, Y, s, t);
    }
}

const Q = /*@__PURE__*/ F("binding-behavior");

const getBehaviorAnnotation = (t, e) => P(H(e), t);

const Y = c({
    name: Q,
    keyFrom(t) {
        return `${Q}:${t}`;
    },
    isType(t) {
        return isFunction(t) && L(Q, t);
    },
    define(t, e) {
        const s = BindingBehaviorDefinition.create(t, e);
        M(Q, s, s.Type);
        M(Q, s, s);
        O(e, Q);
        return s.Type;
    },
    getDefinition(t) {
        const e = P(Q, t);
        if (e === void 0) {
            throw createMappedError(151, t);
        }
        return e;
    },
    annotate(t, e, s) {
        M(H(e), s, t);
    },
    getAnnotation: getBehaviorAnnotation
});

const Z = new Map;

class BindingModeBehavior {
    bind(t, e) {
        Z.set(e, e.mode);
        e.mode = this.mode;
    }
    unbind(t, e) {
        e.mode = Z.get(e);
        Z.delete(e);
    }
}

class OneTimeBindingBehavior extends BindingModeBehavior {
    get mode() {
        return S;
    }
}

class ToViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return _;
    }
}

class FromViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return R;
    }
}

class TwoWayBindingBehavior extends BindingModeBehavior {
    get mode() {
        return T;
    }
}

bindingBehavior("oneTime")(OneTimeBindingBehavior);

bindingBehavior("toView")(ToViewBindingBehavior);

bindingBehavior("fromView")(FromViewBindingBehavior);

bindingBehavior("twoWay")(TwoWayBindingBehavior);

const J = new WeakMap;

const tt = 200;

class DebounceBindingBehavior {
    constructor() {
        this.p = t.resolve(t.IPlatform);
    }
    bind(e, s, i, n) {
        const r = {
            type: "debounce",
            delay: i ?? tt,
            now: this.p.performanceNow,
            queue: this.p.taskQueue,
            signals: isString(n) ? [ n ] : n ?? t.emptyArray
        };
        const l = s.limit?.(r);
        if (l == null) ; else {
            J.set(s, l);
        }
    }
    unbind(t, e) {
        J.get(e)?.dispose();
        J.delete(e);
    }
}

bindingBehavior("debounce")(DebounceBindingBehavior);

class SignalBindingBehavior {
    constructor() {
        this.i = new Map;
        this.u = t.resolve(s.ISignaler);
    }
    bind(t, e, ...s) {
        if (!("handleChange" in e)) {
            throw createMappedError(817);
        }
        if (s.length === 0) {
            throw createMappedError(818);
        }
        this.i.set(e, s);
        let i;
        for (i of s) {
            addSignalListener(this.u, i, e);
        }
    }
    unbind(t, e) {
        const s = this.i.get(e);
        this.i.delete(e);
        let i;
        for (i of s) {
            removeSignalListener(this.u, i, e);
        }
    }
}

bindingBehavior("signal")(SignalBindingBehavior);

const et = new WeakMap;

const st = 200;

class ThrottleBindingBehavior {
    constructor() {
        ({performanceNow: this.C, taskQueue: this.A} = t.resolve(t.IPlatform));
    }
    bind(e, s, i, n) {
        const r = {
            type: "throttle",
            delay: i ?? st,
            now: this.C,
            queue: this.A,
            signals: isString(n) ? [ n ] : n ?? t.emptyArray
        };
        const l = s.limit?.(r);
        if (l == null) ; else {
            et.set(s, l);
        }
    }
    unbind(t, e) {
        et.get(e)?.dispose();
        et.delete(e);
    }
}

bindingBehavior("throttle")(ThrottleBindingBehavior);

const it = /*@__PURE__*/ z("IAppTask");

class $AppTask {
    constructor(t, e, s) {
        this.c = void 0;
        this.slot = t;
        this.k = e;
        this.cb = s;
    }
    register(t) {
        return this.c = t.register(K(it, this));
    }
    run() {
        const t = this.k;
        const e = this.cb;
        return t === null ? e() : e(this.c.get(t));
    }
}

const nt = c({
    creating: createAppTaskSlotHook("creating"),
    hydrating: createAppTaskSlotHook("hydrating"),
    hydrated: createAppTaskSlotHook("hydrated"),
    activating: createAppTaskSlotHook("activating"),
    activated: createAppTaskSlotHook("activated"),
    deactivating: createAppTaskSlotHook("deactivating"),
    deactivated: createAppTaskSlotHook("deactivated")
});

function createAppTaskSlotHook(t) {
    function appTaskFactory(e, s) {
        if (isFunction(s)) {
            return new $AppTask(t, e, s);
        }
        return new $AppTask(t, null, e);
    }
    return appTaskFactory;
}

const rt = t.IPlatform;

class Refs {}

function getRef(t, e) {
    return t.$au?.[e] ?? null;
}

function setRef(t, e, s) {
    var i;
    ((i = t).$au ?? (i.$au = new Refs))[e] = s;
}

const ot = /*@__PURE__*/ z("INode");

const lt = /*@__PURE__*/ z("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(os, true)) {
        return t.get(os).host;
    }
    return t.get(rt).document;
}))));

const ht = /*@__PURE__*/ z("IRenderLocation");

const at = /*@__PURE__*/ z("CssModules");

const ct = new WeakMap;

function getEffectiveParentNode(t) {
    if (ct.has(t)) {
        return ct.get(t);
    }
    let e = 0;
    let s = t.nextSibling;
    while (s !== null) {
        if (s.nodeType === 8) {
            switch (s.textContent) {
              case "au-start":
                ++e;
                break;

              case "au-end":
                if (e-- === 0) {
                    return s;
                }
            }
        }
        s = s.nextSibling;
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
        const s = t.childNodes;
        for (let t = 0, i = s.length; t < i; ++t) {
            ct.set(s[t], e);
        }
    } else {
        ct.set(t, e);
    }
}

function convertToRenderLocation(t) {
    if (isRenderLocation(t)) {
        return t;
    }
    const e = t.ownerDocument.createComment("au-end");
    const s = e.$start = t.ownerDocument.createComment("au-start");
    const i = t.parentNode;
    if (i !== null) {
        i.replaceChild(e, t);
        i.insertBefore(s, e);
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
        const s = (this.f = e).querySelectorAll("au-m");
        let i = 0;
        let n = s.length;
        let r = this.t = Array(n);
        let l;
        let h;
        while (n > i) {
            h = s[i];
            l = h.nextSibling;
            h.remove();
            if (l.nodeType === 8) {
                h = l;
                (l = l.nextSibling).$start = h;
            }
            r[i] = l;
            ++i;
        }
        const a = e.childNodes;
        const c = this.childNodes = Array(n = a.length);
        i = 0;
        while (n > i) {
            c[i] = a[i];
            ++i;
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
                let s = this.B;
                let i;
                const n = this._;
                while (s != null) {
                    i = s.nextSibling;
                    e.insertBefore(s, t);
                    if (s === n) {
                        break;
                    }
                    s = i;
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
            let s;
            const i = this._;
            while (e != null) {
                s = e.nextSibling;
                t.appendChild(e);
                if (e === i) {
                    break;
                }
                e = s;
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
            let s;
            let i = this.B;
            while (i !== null) {
                s = i.nextSibling;
                t.appendChild(i);
                if (i === e) {
                    break;
                }
                i = s;
            }
        }
    }
    addToLinked() {
        const t = this.ref;
        const e = t.parentNode;
        if (this.R) {
            let s = this.B;
            let i;
            const n = this._;
            while (s != null) {
                i = s.nextSibling;
                e.insertBefore(s, t);
                if (s === n) {
                    break;
                }
                s = i;
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

const ut = /*@__PURE__*/ z("IWindow", (t => t.callback((t => t.get(rt).window))));

const ft = /*@__PURE__*/ z("ILocation", (t => t.callback((t => t.get(ut).location))));

const dt = /*@__PURE__*/ z("IHistory", (t => t.callback((t => t.get(ut).history))));

const registerHostNode = (e, s, i) => {
    registerResolver(e, s.HTMLElement, registerResolver(e, s.Element, registerResolver(e, ot, new t.InstanceProvider("ElementResolver", i))));
    return e;
};

const pt = "Element";

const mt = "Attribute";

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
        return mt;
    }
    constructor(t, e, s, i, n, r, l, h, a, c) {
        this.Type = t;
        this.name = e;
        this.aliases = s;
        this.key = i;
        this.defaultBindingMode = n;
        this.isTemplateController = r;
        this.bindables = l;
        this.noMultiBindings = h;
        this.watches = a;
        this.dependencies = c;
    }
    static create(e, s) {
        let i;
        let n;
        if (isString(e)) {
            i = e;
            n = {
                name: i
            };
        } else {
            i = e.name;
            n = e;
        }
        return new CustomAttributeDefinition(s, t.firstDefined(getAttributeAnnotation(s, "name"), i), t.mergeArrays(getAttributeAnnotation(s, "aliases"), n.aliases, s.aliases), getAttributeKeyFrom(i), t.firstDefined(getAttributeAnnotation(s, "defaultBindingMode"), n.defaultBindingMode, s.defaultBindingMode, _), t.firstDefined(getAttributeAnnotation(s, "isTemplateController"), n.isTemplateController, s.isTemplateController, false), W.from(s, ...W.getAll(s), getAttributeAnnotation(s, "bindables"), s.bindables, n.bindables), t.firstDefined(getAttributeAnnotation(s, "noMultiBindings"), n.noMultiBindings, s.noMultiBindings, false), t.mergeArrays(yt.getAnnotation(s), s.watches), t.mergeArrays(getAttributeAnnotation(s, "dependencies"), n.dependencies, s.dependencies));
    }
    register(t) {
        const {Type: e, key: s, aliases: i} = this;
        X(s, e).register(t);
        G(s, e).register(t);
        registerAliases(i, xt, s, t);
    }
    toString() {
        return `au:ca:${this.name}`;
    }
}

const gt = F("custom-attribute");

const getAttributeKeyFrom = t => `${gt}:${t}`;

const getAttributeAnnotation = (t, e) => P(H(e), t);

const isAttributeType = t => isFunction(t) && L(gt, t);

const findAttributeControllerFor = (t, e) => getRef(t, getAttributeKeyFrom(e)) ?? void 0;

const defineAttribute = (t, e) => {
    const s = CustomAttributeDefinition.create(t, e);
    M(gt, s, s.Type);
    M(gt, s, s);
    O(e, gt);
    return s.Type;
};

const getAttributeDefinition = t => {
    const e = P(gt, t);
    if (e === void 0) {
        throw createMappedError(759, t);
    }
    return e;
};

const xt = c({
    name: gt,
    keyFrom: getAttributeKeyFrom,
    isType: isAttributeType,
    for: findAttributeControllerFor,
    define: defineAttribute,
    getDefinition: getAttributeDefinition,
    annotate(t, e, s) {
        M(H(e), s, t);
    },
    getAnnotation: getAttributeAnnotation
});

function watch(t, e) {
    if (t == null) {
        throw createMappedError(772);
    }
    return function decorator(s, i, n) {
        const r = i == null;
        const h = r ? s : s.constructor;
        const a = new WatchDefinition(t, r ? e : n.value);
        if (r) {
            if (!isFunction(e) && (e == null || !(e in h.prototype))) {
                throw createMappedError(773, `${l(e)}@${h.name}}`);
            }
        } else if (!isFunction(n?.value)) {
            throw createMappedError(774, i);
        }
        yt.add(h, a);
        if (isAttributeType(h)) {
            getAttributeDefinition(h).watches.push(a);
        }
        if (isElementType(h)) {
            getElementDefinition(h).watches.push(a);
        }
    };
}

class WatchDefinition {
    constructor(t, e) {
        this.expression = t;
        this.callback = e;
    }
}

const vt = t.emptyArray;

const bt = H("watch");

const yt = c({
    name: bt,
    add(t, e) {
        let s = P(bt, t);
        if (s == null) {
            M(bt, s = [], t);
        }
        s.push(e);
    },
    getAnnotation(t) {
        return P(bt, t) ?? vt;
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
    const e = P(Ct, t);
    if (e === void 0) {
        annotateElementMetadata(t, "containerless", true);
        return;
    }
    e.containerless = true;
}

const wt = new WeakMap;

class CustomElementDefinition {
    get type() {
        return pt;
    }
    constructor(t, e, s, i, n, r, l, h, a, c, u, f, d, p, m, g, x, v, b) {
        this.Type = t;
        this.name = e;
        this.aliases = s;
        this.key = i;
        this.cache = n;
        this.capture = r;
        this.template = l;
        this.instructions = h;
        this.dependencies = a;
        this.injectable = c;
        this.needsCompile = u;
        this.surrogates = f;
        this.bindables = d;
        this.containerless = p;
        this.shadowOptions = m;
        this.hasSlots = g;
        this.enhance = x;
        this.watches = v;
        this.processContent = b;
    }
    static create(e, s = null) {
        if (s === null) {
            const i = e;
            if (isString(i)) {
                throw createMappedError(761, e);
            }
            const n = t.fromDefinitionOrDefault("name", i, At);
            if (isFunction(i.Type)) {
                s = i.Type;
            } else {
                s = Bt(t.pascalCase(n));
            }
            return new CustomElementDefinition(s, n, t.mergeArrays(i.aliases), t.fromDefinitionOrDefault("key", i, (() => getElementKeyFrom(n))), t.fromDefinitionOrDefault("cache", i, returnZero), t.fromDefinitionOrDefault("capture", i, returnFalse), t.fromDefinitionOrDefault("template", i, returnNull), t.mergeArrays(i.instructions), t.mergeArrays(i.dependencies), t.fromDefinitionOrDefault("injectable", i, returnNull), t.fromDefinitionOrDefault("needsCompile", i, returnTrue), t.mergeArrays(i.surrogates), W.from(s, i.bindables), t.fromDefinitionOrDefault("containerless", i, returnFalse), t.fromDefinitionOrDefault("shadowOptions", i, returnNull), t.fromDefinitionOrDefault("hasSlots", i, returnFalse), t.fromDefinitionOrDefault("enhance", i, returnFalse), t.fromDefinitionOrDefault("watches", i, returnEmptyArray), t.fromAnnotationOrTypeOrDefault("processContent", s, returnNull));
        }
        if (isString(e)) {
            return new CustomElementDefinition(s, e, t.mergeArrays(getElementAnnotation(s, "aliases"), s.aliases), getElementKeyFrom(e), t.fromAnnotationOrTypeOrDefault("cache", s, returnZero), t.fromAnnotationOrTypeOrDefault("capture", s, returnFalse), t.fromAnnotationOrTypeOrDefault("template", s, returnNull), t.mergeArrays(getElementAnnotation(s, "instructions"), s.instructions), t.mergeArrays(getElementAnnotation(s, "dependencies"), s.dependencies), t.fromAnnotationOrTypeOrDefault("injectable", s, returnNull), t.fromAnnotationOrTypeOrDefault("needsCompile", s, returnTrue), t.mergeArrays(getElementAnnotation(s, "surrogates"), s.surrogates), W.from(s, ...W.getAll(s), getElementAnnotation(s, "bindables"), s.bindables), t.fromAnnotationOrTypeOrDefault("containerless", s, returnFalse), t.fromAnnotationOrTypeOrDefault("shadowOptions", s, returnNull), t.fromAnnotationOrTypeOrDefault("hasSlots", s, returnFalse), t.fromAnnotationOrTypeOrDefault("enhance", s, returnFalse), t.mergeArrays(yt.getAnnotation(s), s.watches), t.fromAnnotationOrTypeOrDefault("processContent", s, returnNull));
        }
        const i = t.fromDefinitionOrDefault("name", e, At);
        return new CustomElementDefinition(s, i, t.mergeArrays(getElementAnnotation(s, "aliases"), e.aliases, s.aliases), getElementKeyFrom(i), t.fromAnnotationOrDefinitionOrTypeOrDefault("cache", e, s, returnZero), t.fromAnnotationOrDefinitionOrTypeOrDefault("capture", e, s, returnFalse), t.fromAnnotationOrDefinitionOrTypeOrDefault("template", e, s, returnNull), t.mergeArrays(getElementAnnotation(s, "instructions"), e.instructions, s.instructions), t.mergeArrays(getElementAnnotation(s, "dependencies"), e.dependencies, s.dependencies), t.fromAnnotationOrDefinitionOrTypeOrDefault("injectable", e, s, returnNull), t.fromAnnotationOrDefinitionOrTypeOrDefault("needsCompile", e, s, returnTrue), t.mergeArrays(getElementAnnotation(s, "surrogates"), e.surrogates, s.surrogates), W.from(s, ...W.getAll(s), getElementAnnotation(s, "bindables"), s.bindables, e.bindables), t.fromAnnotationOrDefinitionOrTypeOrDefault("containerless", e, s, returnFalse), t.fromAnnotationOrDefinitionOrTypeOrDefault("shadowOptions", e, s, returnNull), t.fromAnnotationOrDefinitionOrTypeOrDefault("hasSlots", e, s, returnFalse), t.fromAnnotationOrDefinitionOrTypeOrDefault("enhance", e, s, returnFalse), t.mergeArrays(e.watches, yt.getAnnotation(s), s.watches), t.fromAnnotationOrDefinitionOrTypeOrDefault("processContent", e, s, returnNull));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) {
            return t;
        }
        if (wt.has(t)) {
            return wt.get(t);
        }
        const e = CustomElementDefinition.create(t);
        wt.set(t, e);
        M(Ct, e, e.Type);
        return e;
    }
    register(t) {
        const {Type: e, key: s, aliases: i} = this;
        if (!t.has(s, false)) {
            X(s, e).register(t);
            G(s, e).register(t);
            registerAliases(i, St, s, t);
        }
    }
    toString() {
        return `au:ce:${this.name}`;
    }
}

const kt = {
    name: undefined,
    searchParents: false,
    optional: false
};

const returnZero = () => 0;

const returnNull = () => null;

const returnFalse = () => false;

const returnTrue = () => true;

const returnEmptyArray = () => t.emptyArray;

const Ct = /*@__PURE__*/ F("custom-element");

const getElementKeyFrom = t => `${Ct}:${t}`;

const At = /*@__PURE__*/ (() => {
    let t = 0;
    return () => `unnamed-${++t}`;
})();

const annotateElementMetadata = (t, e, s) => {
    M(H(e), s, t);
};

const defineElement = (t, e) => {
    const s = CustomElementDefinition.create(t, e);
    M(Ct, s, s.Type);
    M(Ct, s, s);
    O(s.Type, Ct);
    return s.Type;
};

const isElementType = t => isFunction(t) && L(Ct, t);

const findElementControllerFor = (t, e = kt) => {
    if (e.name === void 0 && e.searchParents !== true) {
        const s = getRef(t, Ct);
        if (s === null) {
            if (e.optional === true) {
                return null;
            }
            throw createMappedError(762, t);
        }
        return s;
    }
    if (e.name !== void 0) {
        if (e.searchParents !== true) {
            const s = getRef(t, Ct);
            if (s === null) {
                throw createMappedError(763, t);
            }
            if (s.is(e.name)) {
                return s;
            }
            return void 0;
        }
        let s = t;
        let i = false;
        while (s !== null) {
            const t = getRef(s, Ct);
            if (t !== null) {
                i = true;
                if (t.is(e.name)) {
                    return t;
                }
            }
            s = getEffectiveParentNode(s);
        }
        if (i) {
            return void 0;
        }
        throw createMappedError(764, t);
    }
    let s = t;
    while (s !== null) {
        const t = getRef(s, Ct);
        if (t !== null) {
            return t;
        }
        s = getEffectiveParentNode(s);
    }
    throw createMappedError(765, t);
};

const getElementAnnotation = (t, e) => P(H(e), t);

const getElementDefinition = t => {
    const e = P(Ct, t);
    if (e === void 0) {
        throw createMappedError(760, t);
    }
    return e;
};

const createElementInjectable = () => {
    const $injectable = function(e, s, i) {
        const n = t.DI.getOrCreateAnnotationParamTypes(e);
        n[i] = $injectable;
        return e;
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

const Bt = /*@__PURE__*/ function() {
    const t = {
        value: "",
        writable: false,
        enumerable: false,
        configurable: true
    };
    const e = {};
    return function(s, i = e) {
        const n = class {};
        t.value = s;
        g(n, "name", t);
        if (i !== e) {
            u(n.prototype, i);
        }
        return n;
    };
}();

const St = c({
    name: Ct,
    keyFrom: getElementKeyFrom,
    isType: isElementType,
    for: findElementControllerFor,
    define: defineElement,
    getDefinition: getElementDefinition,
    annotate: annotateElementMetadata,
    getAnnotation: getElementAnnotation,
    generateName: At,
    createInjectable: createElementInjectable,
    generateType: Bt
});

const _t = /*@__PURE__*/ H("processContent");

function processContent(t) {
    return t === void 0 ? function(t, e, s) {
        M(_t, ensureHook(t, e), t);
    } : function(e) {
        t = ensureHook(e, t);
        const s = P(Ct, e);
        if (s !== void 0) {
            s.processContent = t;
        } else {
            M(_t, t, e);
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
        const s = isFunction(t) ? t : true;
        annotateElementMetadata(e, "capture", s);
        if (isElementType(e)) {
            getElementDefinition(e).capture = s;
        }
    };
}

const addListener = (t, e, s, i) => {
    t.addEventListener(e, s, i);
};

const removeListener = (t, e, s, i) => {
    t.removeEventListener(e, s, i);
};

const mixinNodeObserverUseConfig = t => {
    let e;
    const s = t.prototype;
    defineHiddenProp(s, "subscribe", (function(t) {
        if (this.subs.add(t) && this.subs.count === 1) {
            for (e of this.cf.events) {
                addListener(this.P, e, this);
            }
            this.L = true;
            this.M?.();
        }
    }));
    defineHiddenProp(s, "unsubscribe", (function(t) {
        if (this.subs.remove(t) && this.subs.count === 0) {
            for (e of this.cf.events) {
                removeListener(this.P, e, this);
            }
            this.L = false;
            this.q?.();
        }
    }));
    defineHiddenProp(s, "useConfig", (function(t) {
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

const mixinNoopSubscribable = e => {
    defineHiddenProp(e.prototype, "subscribe", t.noop);
    defineHiddenProp(e.prototype, "unsubscribe", t.noop);
};

class ClassAttributeAccessor {
    get doNotCache() {
        return true;
    }
    constructor(t) {
        this.obj = t;
        this.type = A | B;
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
        const s = this.obj.classList;
        const i = getClassesToAdd(this.v);
        const n = i.length;
        let r = 0;
        let l;
        if (n > 0) {
            for (;r < n; r++) {
                l = i[r];
                if (l.length === 0) {
                    continue;
                }
                t[l] = this.F;
                s.add(l);
            }
        }
        if (e === 1) {
            return;
        }
        for (l in t) {
            if (t[l] === e) {
                continue;
            }
            s.remove(l);
        }
    }
}

function getClassesToAdd(e) {
    if (isString(e)) {
        return splitClassString(e);
    }
    if (typeof e !== "object") {
        return t.emptyArray;
    }
    if (e instanceof Array) {
        const s = e.length;
        if (s > 0) {
            const t = [];
            let i = 0;
            for (;s > i; ++i) {
                t.push(...getClassesToAdd(e[i]));
            }
            return t;
        } else {
            return t.emptyArray;
        }
    }
    const s = [];
    let i;
    for (i in e) {
        if (Boolean(e[i])) {
            if (i.includes(" ")) {
                s.push(...splitClassString(i));
            } else {
                s.push(i);
            }
        }
    }
    return s;
}

function splitClassString(e) {
    const s = e.match(/\S+/g);
    if (s === null) {
        return t.emptyArray;
    }
    return s;
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
        const s = u({}, ...this.modules);
        const i = defineAttribute({
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
                this.V.setValue(this.value?.split(/\s+/g).map((t => s[t] || t)) ?? "");
            }
        }, e.inject = [ ot ], e));
        t.register(i, K(at, s));
    }
}

function shadowCSS(...t) {
    return new ShadowDOMRegistry(t);
}

const Rt = /*@__PURE__*/ z("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
    if (AdoptedStyleSheetsStyles.supported(t.get(rt))) {
        return t.get(AdoptedStyleSheetsStylesFactory);
    }
    return t.get(StyleElementStylesFactory);
}))));

class ShadowDOMRegistry {
    constructor(t) {
        this.css = t;
    }
    register(t) {
        const e = t.get(It);
        const s = t.get(Rt);
        t.register(K(Tt, s.createStyles(this.css, e)));
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

AdoptedStyleSheetsStylesFactory.inject = [ rt ];

class StyleElementStylesFactory {
    constructor(t) {
        this.p = t;
    }
    createStyles(t, e) {
        return new StyleElementStyles(this.p, t, e);
    }
}

StyleElementStylesFactory.inject = [ rt ];

const Tt = /*@__PURE__*/ z("IShadowDOMStyles");

const It = /*@__PURE__*/ z("IShadowDOMGlobalStyles", (e => e.instance({
    applyTo: t.noop
})));

class AdoptedStyleSheetsStyles {
    constructor(t, e, s, i = null) {
        this.sharedStyles = i;
        this.styleSheets = e.map((e => {
            let i;
            if (e instanceof t.CSSStyleSheet) {
                i = e;
            } else {
                i = s.get(e);
                if (i === void 0) {
                    i = new t.CSSStyleSheet;
                    i.replaceSync(e);
                    s.set(e, i);
                }
            }
            return i;
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
    constructor(t, e, s = null) {
        this.p = t;
        this.localStyles = e;
        this.sharedStyles = s;
    }
    applyTo(t) {
        const e = this.localStyles;
        const s = this.p;
        for (let i = e.length - 1; i > -1; --i) {
            const n = s.document.createElement("style");
            n.innerHTML = e[i];
            t.prepend(n);
        }
        if (this.sharedStyles !== null) {
            this.sharedStyles.applyTo(t);
        }
    }
}

const Et = {
    shadowDOM(e) {
        return nt.creating(t.IContainer, (t => {
            if (e.sharedStyles != null) {
                const s = t.get(Rt);
                t.register(K(It, s.createStyles(e.sharedStyles, null)));
            }
        }));
    }
};

function valueConverter(t) {
    return function(e) {
        return Lt.define(t, e);
    };
}

class ValueConverterDefinition {
    constructor(t, e, s, i) {
        this.Type = t;
        this.name = e;
        this.aliases = s;
        this.key = i;
    }
    static create(e, s) {
        let i;
        let n;
        if (isString(e)) {
            i = e;
            n = {
                name: i
            };
        } else {
            i = e.name;
            n = e;
        }
        return new ValueConverterDefinition(s, t.firstDefined(getConverterAnnotation(s, "name"), i), t.mergeArrays(getConverterAnnotation(s, "aliases"), n.aliases, s.aliases), Lt.keyFrom(i));
    }
    register(e) {
        const {Type: s, key: i, aliases: n} = this;
        t.Registration.singleton(i, s).register(e);
        t.Registration.aliasTo(i, s).register(e);
        registerAliases(n, Lt, i, e);
    }
}

const Pt = F("value-converter");

const getConverterAnnotation = (t, e) => P(H(e), t);

const Lt = c({
    name: Pt,
    keyFrom: t => `${Pt}:${t}`,
    isType(t) {
        return isFunction(t) && L(Pt, t);
    },
    define(t, e) {
        const s = ValueConverterDefinition.create(t, e);
        M(Pt, s, s.Type);
        M(Pt, s, s);
        O(e, Pt);
        return s.Type;
    },
    getDefinition(t) {
        const e = P(Pt, t);
        if (e === void 0) {
            throw createMappedError(152, t);
        }
        return e;
    },
    annotate(t, e, s) {
        M(H(e), s, t);
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
        if (t !== s.astEvaluate(i.ast, i.s, i, null)) {
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
    const n = i.prototype;
    if (t != null) {
        g(n, "strict", {
            enumerable: true,
            get: function() {
                return t;
            }
        });
    }
    g(n, "strictFnCall", {
        enumerable: true,
        get: function() {
            return e;
        }
    });
    defineHiddenProp(n, "get", (function(t) {
        return this.l.get(t);
    }));
    defineHiddenProp(n, "getSignaler", (function() {
        return this.l.root.get(s.ISignaler);
    }));
    defineHiddenProp(n, "getConverter", (function(t) {
        const e = Lt.keyFrom(t);
        let s = Mt.get(this);
        if (s == null) {
            Mt.set(this, s = new ResourceLookup);
        }
        return s[e] ?? (s[e] = this.l.get(resource(e)));
    }));
    defineHiddenProp(n, "getBehavior", (function(t) {
        const e = Y.keyFrom(t);
        let s = Mt.get(this);
        if (s == null) {
            Mt.set(this, s = new ResourceLookup);
        }
        return s[e] ?? (s[e] = this.l.get(resource(e)));
    }));
};

const Mt = new WeakMap;

class ResourceLookup {}

const Dt = /*@__PURE__*/ z("IFlushQueue", (t => t.singleton(FlushQueue)));

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

function flushItem(t, e, s) {
    s.delete(t);
    t.flush();
}

const qt = new WeakSet;

const mixingBindingLimited = (t, e) => {
    defineHiddenProp(t.prototype, "limit", (function(t) {
        if (qt.has(this)) {
            throw createMappedError(9996);
        }
        qt.add(this);
        const i = e(this, t);
        const n = t.signals;
        const r = n.length > 0 ? this.get(s.ISignaler) : null;
        const l = this[i];
        const callOriginal = (...t) => l.call(this, ...t);
        const h = t.type === "debounce" ? debounced(t, callOriginal, this) : throttled(t, callOriginal, this);
        const a = r ? {
            handleChange: h.flush
        } : null;
        this[i] = h;
        if (r) {
            n.forEach((t => addSignalListener(r, t, a)));
        }
        return {
            dispose: () => {
                if (r) {
                    n.forEach((t => removeSignalListener(r, t, a)));
                }
                qt.delete(this);
                h.dispose();
                delete this[i];
            }
        };
    }));
};

const debounced = (t, e, s) => {
    let i;
    let n;
    let r;
    let l = false;
    const h = t.queue;
    const callOriginalCallback = () => e(r);
    const fn = e => {
        r = e;
        if (s.isBound) {
            n = i;
            i = h.queueTask(callOriginalCallback, {
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
        i?.cancel();
        n = i = void 0;
    };
    fn.flush = () => {
        l = i?.status === w;
        a();
        if (l) {
            callOriginalCallback();
        }
    };
    return fn;
};

const throttled = (t, e, s) => {
    let i;
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
        if (s.isBound) {
            l = now() - r;
            n = i;
            if (l > t.delay) {
                r = now();
                callOriginalCallback();
            } else {
                i = c.queueTask((() => {
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
        i?.cancel();
        n = i = void 0;
    };
    fn.flush = () => {
        a = i?.status === w;
        u();
        if (a) {
            callOriginalCallback();
        }
    };
    return fn;
};

const {enter: Ht, exit: Ft} = s.ConnectableSwitcher;

const {wrap: Ot, unwrap: Vt} = s.ProxyObservable;

class ComputedWatcher {
    get value() {
        return this.v;
    }
    constructor(t, e, s, i, n) {
        this.obj = t;
        this.$get = s;
        this.useProxy = n;
        this.isBound = false;
        this.running = false;
        this.v = void 0;
        this.cb = i;
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
        const s = this.compute();
        if (!m(s, e)) {
            this.cb.call(t, s, e, t);
        }
    }
    compute() {
        this.running = true;
        this.obs.version++;
        try {
            Ht(this);
            return this.v = Vt(this.$get.call(void 0, this.useProxy ? Ot(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            Ft(this);
        }
    }
}

class ExpressionWatcher {
    get value() {
        return this.v;
    }
    constructor(t, e, s, i, n) {
        this.scope = t;
        this.l = e;
        this.oL = s;
        this.isBound = false;
        this.boundFn = false;
        this.obj = t.bindingContext;
        this.j = i;
        this.cb = n;
    }
    handleChange(t) {
        const e = this.j;
        const i = this.obj;
        const n = this.v;
        const r = e.$kind === "AccessScope" && this.obs.count === 1;
        if (!r) {
            this.obs.version++;
            t = s.astEvaluate(e, this.scope, this, this);
            this.obs.clear();
        }
        if (!m(t, n)) {
            this.v = t;
            this.cb.call(i, t, n, i);
        }
    }
    bind() {
        if (this.isBound) {
            return;
        }
        this.obs.version++;
        this.v = s.astEvaluate(this.j, this.scope, this, this);
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

s.connectable(ComputedWatcher);

s.connectable(ExpressionWatcher);

mixinAstEvaluator(true)(ExpressionWatcher);

const Nt = /*@__PURE__*/ z("ILifecycleHooks");

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
        const s = new Set;
        let i = e.prototype;
        while (i !== h) {
            for (const t of f(i)) {
                if (t !== "constructor" && !t.startsWith("_")) {
                    s.add(t);
                }
            }
            i = Object.getPrototypeOf(i);
        }
        return new LifecycleHooksDefinition(e, s);
    }
    register(t) {
        U(Nt, this.Type).register(t);
    }
}

const $t = new WeakMap;

const Wt = H("lifecycle-hooks");

const jt = c({
    name: Wt,
    define(t, e) {
        const s = LifecycleHooksDefinition.create(t, e);
        M(Wt, s, e);
        O(e, Wt);
        return s.Type;
    },
    resolve(t) {
        let e = $t.get(t);
        if (e === void 0) {
            $t.set(t, e = new LifecycleHooksLookupImpl);
            const s = t.root;
            const i = s.id === t.id ? t.getAll(Nt) : t.has(Nt, false) ? s.getAll(Nt).concat(t.getAll(Nt)) : s.getAll(Nt);
            let n;
            let r;
            let l;
            let h;
            let a;
            for (n of i) {
                r = P(Wt, n.constructor);
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
        return jt.define({}, t);
    };
}

const zt = {
    reusable: false,
    preempt: true
};

class AttributeBinding {
    constructor(t, e, s, i, n, r, l, h, a) {
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
        this.oL = s;
        this.A = i;
    }
    updateTarget(t) {
        const e = this.target;
        const s = this.targetAttribute;
        const i = this.targetProperty;
        switch (s) {
          case "class":
            e.classList.toggle(i, !!t);
            break;

          case "style":
            {
                let s = "";
                let n = l(t);
                if (isString(n) && n.includes("!important")) {
                    s = "important";
                    n = n.replace("!important", "");
                }
                e.style.setProperty(i, n, s);
                break;
            }

          default:
            {
                if (t == null) {
                    e.removeAttribute(s);
                } else {
                    e.setAttribute(s, l(t));
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
        const e = s.astEvaluate(this.ast, this.s, this, (this.mode & _) > 0 ? this : null);
        this.obs.clear();
        if (e !== this.v) {
            this.v = e;
            const s = this.G.state !== Ke;
            if (s) {
                t = this.U;
                this.U = this.A.queueTask((() => {
                    this.U = null;
                    this.updateTarget(e);
                }), zt);
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
        s.astBind(this.ast, t, this);
        if (this.mode & (_ | S)) {
            this.updateTarget(this.v = s.astEvaluate(this.ast, t, this, (this.mode & _) > 0 ? this : null));
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        s.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.v = void 0;
        this.U?.cancel();
        this.U = null;
        this.obs.clearAll();
    }
}

mixinUseScope(AttributeBinding);

mixingBindingLimited(AttributeBinding, (() => "updateTarget"));

s.connectable(AttributeBinding);

mixinAstEvaluator(true)(AttributeBinding);

const Ut = {
    reusable: false,
    preempt: true
};

class InterpolationBinding {
    constructor(t, e, s, i, n, r, l, h) {
        this.ast = n;
        this.target = r;
        this.targetProperty = l;
        this.mode = h;
        this.isBound = false;
        this.s = void 0;
        this.U = null;
        this.G = t;
        this.oL = s;
        this.A = i;
        this.K = s.getAccessor(r, l);
        const a = n.expressions;
        const c = this.partBindings = Array(a.length);
        const u = a.length;
        let f = 0;
        for (;u > f; ++f) {
            c[f] = new InterpolationPartBinding(a[f], r, l, e, s, this);
        }
    }
    X() {
        this.updateTarget();
    }
    updateTarget() {
        const t = this.partBindings;
        const e = this.ast.parts;
        const s = t.length;
        let i = "";
        let n = 0;
        if (s === 1) {
            i = e[0] + t[0].v + e[1];
        } else {
            i = e[0];
            for (;s > n; ++n) {
                i += t[n].v + e[n + 1];
            }
        }
        const r = this.K;
        const l = this.G.state !== Ke && (r.type & B) > 0;
        let h;
        if (l) {
            h = this.U;
            this.U = this.A.queueTask((() => {
                this.U = null;
                r.setValue(i, this.target, this.targetProperty);
            }), Ut);
            h?.cancel();
            h = null;
        } else {
            r.setValue(i, this.target, this.targetProperty);
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
        const s = e.length;
        let i = 0;
        for (;s > i; ++i) {
            e[i].bind(t);
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
        let s = 0;
        for (;e > s; ++s) {
            t[s].unbind();
        }
        this.U?.cancel();
        this.U = null;
    }
}

class InterpolationPartBinding {
    constructor(t, e, s, i, n, r) {
        this.ast = t;
        this.target = e;
        this.targetProperty = s;
        this.owner = r;
        this.mode = _;
        this.task = null;
        this.isBound = false;
        this.v = "";
        this.boundFn = false;
        this.l = i;
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
        const t = s.astEvaluate(this.ast, this.s, this, (this.mode & _) > 0 ? this : null);
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
        s.astBind(this.ast, t, this);
        this.v = s.astEvaluate(this.ast, this.s, this, (this.mode & _) > 0 ? this : null);
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
        s.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

mixinUseScope(InterpolationPartBinding);

mixingBindingLimited(InterpolationPartBinding, (() => "updateTarget"));

s.connectable(InterpolationPartBinding);

mixinAstEvaluator(true)(InterpolationPartBinding);

const Gt = {
    reusable: false,
    preempt: true
};

class ContentBinding {
    constructor(t, e, s, i, n, r, l) {
        this.p = n;
        this.ast = r;
        this.target = l;
        this.isBound = false;
        this.mode = _;
        this.U = null;
        this.v = "";
        this.Y = false;
        this.boundFn = false;
        this.strict = true;
        this.l = e;
        this.G = t;
        this.oL = s;
        this.A = i;
    }
    updateTarget(t) {
        const e = this.target;
        const s = this.v;
        this.v = t;
        if (this.Y) {
            s.parentNode?.removeChild(s);
            this.Y = false;
        }
        if (t instanceof this.p.Node) {
            e.parentNode?.insertBefore(t, e);
            t = "";
            this.Y = true;
        }
        e.textContent = l(t ?? "");
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = s.astEvaluate(this.ast, this.s, this, (this.mode & _) > 0 ? this : null);
        this.obs.clear();
        if (t === this.v) {
            this.U?.cancel();
            this.U = null;
            return;
        }
        const e = this.G.state !== Ke;
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
        const t = this.v = s.astEvaluate(this.ast, this.s, this, (this.mode & _) > 0 ? this : null);
        this.obs.clear();
        if (isArray(t)) {
            this.observeCollection(t);
        }
        const e = this.G.state !== Ke;
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
        s.astBind(this.ast, t, this);
        const e = this.v = s.astEvaluate(this.ast, this.s, this, (this.mode & _) > 0 ? this : null);
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
        s.astUnbind(this.ast, this.s, this);
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
        }), Gt);
        e?.cancel();
    }
}

mixinUseScope(ContentBinding);

mixingBindingLimited(ContentBinding, (() => "updateTarget"));

s.connectable()(ContentBinding);

mixinAstEvaluator(void 0, false)(ContentBinding);

class LetBinding {
    constructor(t, e, s, i, n = false) {
        this.ast = s;
        this.targetProperty = i;
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
        this.v = s.astEvaluate(this.ast, this.s, this, this);
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
        s.astBind(this.ast, t, this);
        this.v = s.astEvaluate(this.ast, this.s, this, this);
        this.updateTarget();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        s.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

mixinUseScope(LetBinding);

mixingBindingLimited(LetBinding, (() => "updateTarget"));

s.connectable(LetBinding);

mixinAstEvaluator(true)(LetBinding);

class PropertyBinding {
    constructor(t, e, s, i, n, r, l, h) {
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
        this.A = i;
        this.oL = s;
    }
    updateTarget(t) {
        this.K.setValue(t, this.target, this.targetProperty);
    }
    updateSource(t) {
        s.astAssign(this.ast, this.s, this, t);
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = s.astEvaluate(this.ast, this.s, this, (this.mode & _) > 0 ? this : null);
        this.obs.clear();
        const e = this.G.state !== Ke && (this.K.type & B) > 0;
        if (e) {
            Kt = this.U;
            this.U = this.A.queueTask((() => {
                this.updateTarget(t);
                this.U = null;
            }), Xt);
            Kt?.cancel();
            Kt = null;
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
        s.astBind(this.ast, t, this);
        const e = this.oL;
        const i = this.mode;
        let n = this.K;
        if (!n) {
            if (i & R) {
                n = e.getObserver(this.target, this.targetProperty);
            } else {
                n = e.getAccessor(this.target, this.targetProperty);
            }
            this.K = n;
        }
        const r = (i & _) > 0;
        if (i & (_ | S)) {
            this.updateTarget(s.astEvaluate(this.ast, this.s, this, r ? this : null));
        }
        if (i & R) {
            n.subscribe(this.tt ?? (this.tt = new BindingTargetSubscriber(this, this.l.get(Dt))));
            if (!r) {
                this.updateSource(n.getValue(this.target, this.targetProperty));
            }
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        s.astUnbind(this.ast, this.s, this);
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

mixingBindingLimited(PropertyBinding, (t => t.mode & R ? "updateSource" : "updateTarget"));

s.connectable(PropertyBinding);

mixinAstEvaluator(true, false)(PropertyBinding);

let Kt = null;

const Xt = {
    reusable: false,
    preempt: true
};

class RefBinding {
    constructor(t, e, s) {
        this.ast = e;
        this.target = s;
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
        s.astBind(this.ast, t, this);
        s.astAssign(this.ast, this.s, this, this.target);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        if (s.astEvaluate(this.ast, this.s, this, null) === this.target) {
            s.astAssign(this.ast, this.s, this, null);
        }
        s.astUnbind(this.ast, this.s, this);
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
    constructor(t, e, s, i, n, r) {
        this.ast = e;
        this.target = s;
        this.targetEvent = i;
        this.isBound = false;
        this.self = false;
        this.boundFn = true;
        this.et = null;
        this.l = t;
        this.st = n;
        this.et = r;
    }
    callSource(t) {
        const e = this.s.overrideContext;
        e.$event = t;
        let i = s.astEvaluate(this.ast, this.s, this, null);
        delete e.$event;
        if (isFunction(i)) {
            i = i(t);
        }
        if (i !== true && this.st.prevent) {
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
        s.astBind(this.ast, t, this);
        this.target.addEventListener(this.targetEvent, this, this.st);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        s.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.target.removeEventListener(this.targetEvent, this, this.st);
    }
}

mixinUseScope(ListenerBinding);

mixingBindingLimited(ListenerBinding, (() => "callSource"));

mixinAstEvaluator(true, true)(ListenerBinding);

const Qt = /*@__PURE__*/ z("IEventModifier");

const Yt = /*@__PURE__*/ z("IKeyMapping", (t => t.instance({
    meta: c([ "ctrl", "alt", "shift", "meta" ]),
    keys: {
        escape: "Escape",
        enter: "Enter",
        space: "Space",
        tab: "tab",
        ...Array.from({
            length: 25
        }).reduce(((t, e, s) => {
            let i = String.fromCharCode(s + 65);
            t[s + 65] = i;
            i = String.fromCharCode(s + 97);
            t[s + 97] = t[i] = i;
            return t;
        }), {})
    }
})));

class ModifiedMouseEventHandler {
    constructor() {
        this.type = [ "click", "mousedown", "mousemove", "mouseup", "dblclick", "contextmenu" ];
        this.it = t.resolve(Yt);
        this.nt = [ "left", "middle", "right" ];
    }
    static register(t) {
        t.register(U(Qt, ModifiedMouseEventHandler));
    }
    getHandler(t) {
        const e = t.split(/[:+.]/);
        return t => {
            let s = false;
            let i = false;
            let n;
            for (n of e) {
                switch (n) {
                  case "prevent":
                    s = true;
                    continue;

                  case "stop":
                    i = true;
                    continue;

                  case "left":
                  case "middle":
                  case "right":
                    if (t.button !== this.nt.indexOf(n)) return false;
                    continue;
                }
                if (this.it.meta.includes(n) && t[`${n}Key`] !== true) {
                    return false;
                }
            }
            if (s) t.preventDefault();
            if (i) t.stopPropagation();
            return true;
        };
    }
}

class ModifiedKeyboardEventHandler {
    constructor() {
        this.it = t.resolve(Yt);
        this.type = [ "keydown", "keyup" ];
    }
    static register(t) {
        t.register(U(Qt, ModifiedKeyboardEventHandler));
    }
    getHandler(t) {
        const e = t.split(/[:+.]/);
        return t => {
            let s = false;
            let i = false;
            let n;
            for (n of e) {
                switch (n) {
                  case "prevent":
                    s = true;
                    continue;

                  case "stop":
                    i = true;
                    continue;
                }
                if (this.it.meta.includes(n)) {
                    if (t[`${n}Key`] !== true) {
                        return false;
                    }
                    continue;
                }
                const e = this.it.keys[n];
                if (e !== t.key) {
                    return false;
                }
            }
            if (s) t.preventDefault();
            if (i) t.stopPropagation();
            return true;
        };
    }
}

const Zt = /*@__PURE__*/ z("IEventModifierHandler", (t => t.instance({
    getHandler: () => null
})));

class EventModifier {
    constructor() {
        this.rt = t.resolve(t.all(Qt)).reduce(((t, e) => {
            const s = isArray(e.type) ? e.type : [ e.type ];
            s.forEach((s => t[s] = e));
            return t;
        }), {});
    }
    static register(t) {
        t.register(U(Zt, EventModifier));
    }
    getHandler(t, e) {
        return isString(e) ? this.rt[t]?.getHandler(e) ?? null : null;
    }
}

const Jt = {
    register(t) {
        t.register(EventModifier, ModifiedMouseEventHandler, ModifiedKeyboardEventHandler);
    }
};

const te = /*@__PURE__*/ z("IViewFactory");

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
        let s;
        if (e != null && e.length > 0) {
            s = e.pop();
            return s;
        }
        s = Controller.$view(this, t);
        return s;
    }
}

ViewFactory.maxCacheSize = 65535;

const ee = "au-start";

const se = "au-end";

const createElement = (t, e) => t.document.createElement(e);

const createComment = (t, e) => t.document.createComment(e);

const createLocation = t => {
    const e = createComment(t, se);
    e.$start = createComment(t, ee);
    return e;
};

const createText = (t, e) => t.document.createTextNode(e);

const insertBefore = (t, e, s) => t.insertBefore(e, s);

const insertManyBefore = (t, e, s) => {
    if (t === null) {
        return;
    }
    const i = s.length;
    let n = 0;
    while (i > n) {
        t.insertBefore(s[n], e);
        ++n;
    }
};

const appendToTemplate = (t, e) => t.content.appendChild(e);

const appendManyToTemplate = (t, e) => {
    const s = e.length;
    let i = 0;
    while (s > i) {
        t.content.appendChild(e[i]);
        ++i;
    }
};

const createMutationObserver = (t, e) => new t.ownerDocument.defaultView.MutationObserver(e);

const isElement = t => t.nodeType === 1;

const isTextNode = t => t.nodeType === 3;

const ie = /*@__PURE__*/ z("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

const ne = /*@__PURE__*/ z("IAuSlotWatcher");

class AuSlotWatcherBinding {
    constructor(e, s, i, n) {
        this.ht = new Set;
        this.ct = t.emptyArray;
        this.isBound = false;
        this.cb = (this.o = e)[s];
        this.slotName = i;
        this.ut = n;
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
        const s = this.ct;
        const i = [];
        let n;
        let r;
        for (n of this.ht) {
            for (r of n === t ? e : n.nodes) {
                if (this.ut === "*" || isElement(r) && r.matches(this.ut)) {
                    i[i.length] = r;
                }
            }
        }
        if (i.length !== s.length || i.some(((t, e) => t !== s[e]))) {
            this.ct = i;
            this.cb?.call(this.o, i);
            this.subs.notify(i, s);
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
        K(Nt, this).register(t);
    }
    hydrating(t, e) {
        const s = this.ft;
        const i = new AuSlotWatcherBinding(t, s.callback ?? `${l(s.name)}Changed`, s.slotName ?? "default", s.query ?? "*");
        g(t, s.name, {
            enumerable: true,
            configurable: true,
            get: u((() => i.getValue()), {
                getObserver: () => i
            }),
            set: () => {}
        });
        K(ne, i).register(e.container);
        e.addBinding(i);
    }
}

function slotted(t, e) {
    if (!re) {
        re = true;
        s.subscriberCollection(AuSlotWatcherBinding);
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
        let a = St.getAnnotation(h, i);
        if (a == null) {
            St.annotate(h, i, a = []);
        }
        a.push(new SlottedLifecycleHooks(l));
    }
    return decorator;
}

let re = false;

class SpreadBinding {
    static create(e, s, i, n, r, l, h, a) {
        const c = [];
        const u = n.renderers;
        const getHydrationContext = t => {
            let s = t;
            let i = e;
            while (i != null && s > 0) {
                i = i.parent;
                --s;
            }
            if (i == null) {
                throw createMappedError(9999);
            }
            return i;
        };
        const renderSpreadInstruction = e => {
            const n = getHydrationContext(e);
            const f = new SpreadBinding(n);
            const d = r.compileSpread(n.controller.definition, n.instruction?.captures ?? t.emptyArray, n.controller.container, s, i);
            let p;
            for (p of d) {
                switch (p.type) {
                  case Ae:
                    renderSpreadInstruction(e + 1);
                    break;

                  case Be:
                    u[p.instructions.type].render(f, findElementControllerFor(s), p.instructions, l, h, a);
                    break;

                  default:
                    u[p.type].render(f, s, p, l, h, a);
                }
            }
            c.push(f);
        };
        renderSpreadInstruction(0);
        return c;
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
        if (t.vmKind !== ze) {
            throw createMappedError(9998);
        }
        this.$controller.addChild(t);
    }
}

const oe = "ra";

const le = "rb";

const he = "rc";

const ae = "rd";

const ce = "re";

const ue = "rf";

const fe = "rg";

const de = "ri";

const pe = "rj";

const me = "rk";

const ge = "rl";

const xe = "ha";

const ve = "hb";

const be = "hc";

const ye = "hd";

const we = "he";

const ke = "hf";

const Ce = "hg";

const Ae = "hs";

const Be = "hp";

const Se = /*@__PURE__*/ c({
    hydrateElement: oe,
    hydrateAttribute: le,
    hydrateTemplateController: he,
    hydrateLetElement: ae,
    setProperty: ce,
    interpolation: ue,
    propertyBinding: fe,
    letBinding: de,
    refBinding: pe,
    iteratorBinding: me,
    multiAttr: ge,
    textBinding: xe,
    listenerBinding: ve,
    attributeBinding: be,
    stylePropertyBinding: ye,
    setAttribute: we,
    setClassAttribute: ke,
    setStyleAttribute: Ce,
    spreadBinding: Ae,
    spreadElementProp: Be
});

const _e = /*@__PURE__*/ z("Instruction");

function isInstruction(t) {
    const e = t.type;
    return isString(e) && e.length === 2;
}

class InterpolationInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = ue;
    }
}

class PropertyBindingInstruction {
    constructor(t, e, s) {
        this.from = t;
        this.to = e;
        this.mode = s;
        this.type = fe;
    }
}

class IteratorBindingInstruction {
    constructor(t, e, s) {
        this.forOf = t;
        this.to = e;
        this.props = s;
        this.type = me;
    }
}

class RefBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = pe;
    }
}

class SetPropertyInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = ce;
    }
}

class MultiAttrInstruction {
    constructor(t, e, s) {
        this.value = t;
        this.to = e;
        this.command = s;
        this.type = ge;
    }
}

class HydrateElementInstruction {
    constructor(t, e, s, i, n, r) {
        this.res = t;
        this.alias = e;
        this.props = s;
        this.projections = i;
        this.containerless = n;
        this.captures = r;
        this.type = oe;
        this.auSlot = null;
    }
}

class HydrateAttributeInstruction {
    constructor(t, e, s) {
        this.res = t;
        this.alias = e;
        this.props = s;
        this.type = le;
    }
}

class HydrateTemplateController {
    constructor(t, e, s, i) {
        this.def = t;
        this.res = e;
        this.alias = s;
        this.props = i;
        this.type = he;
    }
}

class HydrateLetElementInstruction {
    constructor(t, e) {
        this.instructions = t;
        this.toBindingContext = e;
        this.type = ae;
    }
}

class LetBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = de;
    }
}

class TextBindingInstruction {
    constructor(t) {
        this.from = t;
        this.type = xe;
    }
}

class ListenerBindingInstruction {
    constructor(t, e, s, i, n) {
        this.from = t;
        this.to = e;
        this.preventDefault = s;
        this.capture = i;
        this.modifier = n;
        this.type = ve;
    }
}

class StylePropertyBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = ye;
    }
}

class SetAttributeInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = we;
    }
}

class SetClassAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = ke;
    }
}

class SetStyleAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = Ce;
    }
}

class AttributeBindingInstruction {
    constructor(t, e, s) {
        this.attr = t;
        this.from = e;
        this.to = s;
        this.type = be;
    }
}

class SpreadBindingInstruction {
    constructor() {
        this.type = Ae;
    }
}

class SpreadElementPropBindingInstruction {
    constructor(t) {
        this.instructions = t;
        this.type = Be;
    }
}

const Re = /*@__PURE__*/ z("ITemplateCompiler");

const Te = /*@__PURE__*/ z("IRenderer");

function renderer(t) {
    return function decorator(e) {
        e.register = function(t) {
            U(Te, this).register(t);
        };
        g(e.prototype, "target", {
            configurable: true,
            get: function() {
                return t;
            }
        });
        return e;
    };
}

function ensureExpression(t, e, s) {
    if (isString(e)) {
        return t.parse(e, s);
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
            const s = findAttributeControllerFor(t, e);
            if (s !== void 0) {
                return s.viewModel;
            }
            const i = findElementControllerFor(t, {
                name: e
            });
            if (i === void 0) {
                throw createMappedError(751, e);
            }
            return i.viewModel;
        }
    }
}

exports.SetPropertyRenderer = class SetPropertyRenderer {
    render(t, e, s) {
        const i = getTarget(e);
        if (i.$observers?.[s.to] !== void 0) {
            i.$observers[s.to].setValue(s.value);
        } else {
            i[s.to] = s.value;
        }
    }
};

exports.SetPropertyRenderer = __decorate([ renderer(ce) ], exports.SetPropertyRenderer);

exports.CustomElementRenderer = class CustomElementRenderer {
    constructor() {
        this.r = t.resolve(He);
    }
    render(e, s, i, n, r, l) {
        let h;
        let a;
        let c;
        let u;
        const f = i.res;
        const p = i.projections;
        const m = e.container;
        switch (typeof f) {
          case "string":
            h = m.find(St, f);
            if (h == null) {
                throw createMappedError(752, i, e);
            }
            break;

          default:
            h = f;
        }
        const g = i.containerless || h.containerless;
        const x = g ? convertToRenderLocation(s) : null;
        const v = createElementContainer(n, e, s, i, x, p == null ? void 0 : new AuSlotsInfo(d(p)));
        a = h.Type;
        c = v.invoke(a);
        registerResolver(v, a, new t.InstanceProvider(h.key, c));
        u = Controller.$el(v, c, s, i, h, x);
        setRef(s, h.key, u);
        const b = this.r.renderers;
        const y = i.props;
        const w = y.length;
        let k = 0;
        let C;
        while (w > k) {
            C = y[k];
            b[C.type].render(e, u, C, n, r, l);
            ++k;
        }
        e.addChild(u);
    }
};

exports.CustomElementRenderer = __decorate([ renderer(oe) ], exports.CustomElementRenderer);

exports.CustomAttributeRenderer = class CustomAttributeRenderer {
    constructor() {
        this.r = t.resolve(He);
    }
    render(t, e, s, i, n, r) {
        let l = t.container;
        let h;
        switch (typeof s.res) {
          case "string":
            h = l.find(xt, s.res);
            if (h == null) {
                throw createMappedError(753, s, t);
            }
            break;

          default:
            h = s.res;
        }
        const a = invokeAttribute(i, h, t, e, s, void 0, void 0);
        const c = Controller.$attr(a.ctn, a.vm, e, h);
        setRef(e, h.key, c);
        const u = this.r.renderers;
        const f = s.props;
        const d = f.length;
        let p = 0;
        let m;
        while (d > p) {
            m = f[p];
            u[m.type].render(t, c, m, i, n, r);
            ++p;
        }
        t.addChild(c);
    }
};

exports.CustomAttributeRenderer = __decorate([ renderer(le) ], exports.CustomAttributeRenderer);

exports.TemplateControllerRenderer = class TemplateControllerRenderer {
    constructor() {
        this.r = t.resolve(He);
    }
    render(t, e, s, i, n, r) {
        let l = t.container;
        let h;
        switch (typeof s.res) {
          case "string":
            h = l.find(xt, s.res);
            if (h == null) {
                throw createMappedError(754, s, t);
            }
            break;

          default:
            h = s.res;
        }
        const a = this.r.getViewFactory(s.def, l);
        const c = convertToRenderLocation(e);
        const u = invokeAttribute(i, h, t, e, s, a, c);
        const f = Controller.$attr(u.ctn, u.vm, e, h);
        setRef(c, h.key, f);
        u.vm.link?.(t, f, e, s);
        const d = this.r.renderers;
        const p = s.props;
        const m = p.length;
        let g = 0;
        let x;
        while (m > g) {
            x = p[g];
            d[x.type].render(t, f, x, i, n, r);
            ++g;
        }
        t.addChild(f);
    }
};

exports.TemplateControllerRenderer = __decorate([ renderer(he) ], exports.TemplateControllerRenderer);

exports.LetElementRenderer = class LetElementRenderer {
    render(t, e, s, i, n, r) {
        e.remove();
        const l = s.instructions;
        const h = s.toBindingContext;
        const a = t.container;
        const c = l.length;
        let u;
        let f;
        let d = 0;
        while (c > d) {
            u = l[d];
            f = ensureExpression(n, u.from, y);
            t.addBinding(new LetBinding(a, r, f, u.to, h));
            ++d;
        }
    }
};

exports.LetElementRenderer = __decorate([ renderer(ae) ], exports.LetElementRenderer);

exports.RefBindingRenderer = class RefBindingRenderer {
    render(t, e, s, i, n) {
        t.addBinding(new RefBinding(t.container, ensureExpression(n, s.from, y), getRefTarget(e, s.to)));
    }
};

exports.RefBindingRenderer = __decorate([ renderer(pe) ], exports.RefBindingRenderer);

exports.InterpolationBindingRenderer = class InterpolationBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new InterpolationBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, x), getTarget(e), s.to, _));
    }
};

exports.InterpolationBindingRenderer = __decorate([ renderer(ue) ], exports.InterpolationBindingRenderer);

exports.PropertyBindingRenderer = class PropertyBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, y), getTarget(e), s.to, s.mode));
    }
};

exports.PropertyBindingRenderer = __decorate([ renderer(fe) ], exports.PropertyBindingRenderer);

exports.IteratorBindingRenderer = class IteratorBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.forOf, v), getTarget(e), s.to, _));
    }
};

exports.IteratorBindingRenderer = __decorate([ renderer(me) ], exports.IteratorBindingRenderer);

exports.TextBindingRenderer = class TextBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, i.domWriteQueue, i, ensureExpression(n, s.from, y), e));
    }
};

exports.TextBindingRenderer = __decorate([ renderer(xe) ], exports.TextBindingRenderer);

exports.ListenerBindingRenderer = class ListenerBindingRenderer {
    constructor() {
        this.xt = t.resolve(Zt);
    }
    render(t, e, s, i, n) {
        t.addBinding(new ListenerBinding(t.container, ensureExpression(n, s.from, b), e, s.to, new ListenerBindingOptions(s.preventDefault, s.capture), this.xt.getHandler(s.to, s.modifier)));
    }
};

exports.ListenerBindingRenderer = __decorate([ renderer(ve) ], exports.ListenerBindingRenderer);

exports.SetAttributeRenderer = class SetAttributeRenderer {
    render(t, e, s) {
        e.setAttribute(s.to, s.value);
    }
};

exports.SetAttributeRenderer = __decorate([ renderer(we) ], exports.SetAttributeRenderer);

exports.SetClassAttributeRenderer = class SetClassAttributeRenderer {
    render(t, e, s) {
        addClasses(e.classList, s.value);
    }
};

exports.SetClassAttributeRenderer = __decorate([ renderer(ke) ], exports.SetClassAttributeRenderer);

exports.SetStyleAttributeRenderer = class SetStyleAttributeRenderer {
    render(t, e, s) {
        e.style.cssText += s.value;
    }
};

exports.SetStyleAttributeRenderer = __decorate([ renderer(Ce) ], exports.SetStyleAttributeRenderer);

exports.StylePropertyBindingRenderer = class StylePropertyBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, y), e.style, s.to, _));
    }
};

exports.StylePropertyBindingRenderer = __decorate([ renderer(ye) ], exports.StylePropertyBindingRenderer);

exports.AttributeBindingRenderer = class AttributeBindingRenderer {
    render(t, e, s, i, n, r) {
        const l = t.container;
        const h = l.has(at, false) ? l.get(at) : null;
        t.addBinding(new AttributeBinding(t, l, r, i.domWriteQueue, ensureExpression(n, s.from, y), e, s.attr, h == null ? s.to : s.to.split(/\s/g).map((t => h[t] ?? t)).join(" "), _));
    }
};

exports.AttributeBindingRenderer = __decorate([ renderer(be) ], exports.AttributeBindingRenderer);

exports.SpreadRenderer = class SpreadRenderer {
    constructor() {
        this.vt = t.resolve(Re);
        this.r = t.resolve(He);
    }
    render(t, e, s, i, n, r) {
        SpreadBinding.create(t.container.get(ss), e, void 0, this.r, this.vt, i, n, r).forEach((e => t.addBinding(e)));
    }
};

exports.SpreadRenderer = __decorate([ renderer(Ae) ], exports.SpreadRenderer);

function addClasses(t, e) {
    const s = e.length;
    let i = 0;
    for (let n = 0; n < s; ++n) {
        if (e.charCodeAt(n) === 32) {
            if (n !== i) {
                t.add(e.slice(i, n));
            }
            i = n + 1;
        } else if (n + 1 === s) {
            t.add(e.slice(i));
        }
    }
}

const Ie = "IController";

const Ee = "IInstruction";

const Pe = "IRenderLocation";

const Le = "ISlotsInfo";

function createElementContainer(e, s, i, n, r, l) {
    const h = s.container.createChild();
    registerHostNode(h, e, i);
    registerResolver(h, es, new t.InstanceProvider(Ie, s));
    registerResolver(h, _e, new t.InstanceProvider(Ee, n));
    registerResolver(h, ht, r == null ? Me : new RenderLocationProvider(r));
    registerResolver(h, te, De);
    registerResolver(h, ie, l == null ? qe : new t.InstanceProvider(Le, l));
    return h;
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

function invokeAttribute(e, s, i, n, r, l, h, a) {
    const c = i instanceof Controller ? i : i.$controller;
    const u = c.container.createChild();
    registerHostNode(u, e, n);
    registerResolver(u, es, new t.InstanceProvider(Ie, c));
    registerResolver(u, _e, new t.InstanceProvider(Ee, r));
    registerResolver(u, ht, h == null ? Me : new t.InstanceProvider(Pe, h));
    registerResolver(u, te, l == null ? De : new ViewFactoryProvider(l));
    registerResolver(u, ie, a == null ? qe : new t.InstanceProvider(Le, a));
    return {
        vm: u.invoke(s.Type),
        ctn: u
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

const Me = new RenderLocationProvider(null);

const De = new ViewFactoryProvider(null);

const qe = new t.InstanceProvider(Le, new AuSlotsInfo(t.emptyArray));

const He = /*@__PURE__*/ z("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.bt ?? (this.bt = this.yt.getAll(Te, false).reduce(((t, e) => {
            t[e.target] = e;
            return t;
        }), createLookup()));
    }
    constructor() {
        this.wt = new WeakMap;
        this.kt = new WeakMap;
        const e = this.yt = t.resolve(t.IContainer).root;
        this.p = e.get(rt);
        this.ep = e.get(s.IExpressionParser);
        this.oL = e.get(s.IObserverLocator);
        this.Ct = new FragmentNodeSequence(this.p, this.p.document.createDocumentFragment());
    }
    compile(t, e, s) {
        if (t.needsCompile !== false) {
            const i = this.wt;
            const n = e.get(Re);
            let r = i.get(t);
            if (r == null) {
                i.set(t, r = n.compile(t, e, s));
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
        let s = false;
        const i = this.kt;
        const n = this.p;
        const r = n.document;
        if (i.has(t)) {
            e = i.get(t);
        } else {
            const l = t.template;
            let h;
            if (l === null) {
                e = null;
            } else if (l instanceof n.Node) {
                if (l.nodeName === "TEMPLATE") {
                    e = l.content;
                    s = true;
                } else {
                    (e = r.createDocumentFragment()).appendChild(l.cloneNode(true));
                }
            } else {
                h = r.createElement("template");
                if (isString(l)) {
                    h.innerHTML = l;
                }
                e = h.content;
                s = true;
            }
            this.At(e);
            i.set(t, e);
        }
        return e == null ? this.Ct : new FragmentNodeSequence(this.p, s ? r.importNode(e, true) : r.adoptNode(e.cloneNode(true)));
    }
    render(t, e, s, i) {
        const n = s.instructions;
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
        if (i != null) {
            u = s.surrogates;
            if ((c = u.length) > 0) {
                a = 0;
                while (c > a) {
                    f = u[a];
                    r[f.type].render(t, i, f, this.p, this.ep, this.oL);
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
        let s = e.firstChild;
        let i = null;
        while (s != null) {
            if (s.nodeType === 8 && s.nodeValue === "au*") {
                i = s.nextSibling;
                e.removeChild(s);
                e.insertBefore(this.Bt(), i);
                if (i.nodeType === 8) {
                    s = i.nextSibling;
                } else {
                    s = i;
                }
            }
            i = s?.firstChild;
            if (i == null) {
                i = s?.nextSibling;
                if (i == null) {
                    s = e.nextSibling;
                    e = e.parentNode;
                    while (s == null && e != null) {
                        s = e.nextSibling;
                        e = e.parentNode;
                    }
                } else {
                    s = i;
                }
            } else {
                e = s;
                s = i;
            }
        }
        return t;
    }
}

var Fe;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["host"] = 1] = "host";
    t[t["shadowRoot"] = 2] = "shadowRoot";
    t[t["location"] = 3] = "location";
})(Fe || (Fe = {}));

const Oe = {
    optional: true
};

const Ve = optionalResource(s.ICoercionConfiguration);

const Ne = new WeakMap;

class Controller {
    get lifecycleHooks() {
        return this.St;
    }
    get isActive() {
        return (this.state & (Ke | Xe)) > 0 && (this.state & Qe) === 0;
    }
    get name() {
        if (this.parent === null) {
            switch (this.vmKind) {
              case ze:
                return `[${this.definition.name}]`;

              case je:
                return this.definition.name;

              case Ue:
                return this.viewFactory.name;
            }
        }
        switch (this.vmKind) {
          case ze:
            return `${this.parent.name}>[${this.definition.name}]`;

          case je:
            return `${this.parent.name}>${this.definition.name}`;

          case Ue:
            return this.viewFactory.name === this.parent.definition?.name ? `${this.parent.name}[view]` : `${this.parent.name}[view:${this.viewFactory.name}]`;
        }
    }
    get viewModel() {
        return this._t;
    }
    set viewModel(t) {
        this._t = t;
        this.Rt = t == null || this.vmKind === Ue ? HooksDefinition.none : new HooksDefinition(t);
    }
    constructor(t, e, s, i, n, r, l) {
        this.container = t;
        this.vmKind = e;
        this.definition = s;
        this.viewFactory = i;
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
        this.state = Ge;
        this.It = false;
        this.$initiator = null;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this.Et = 0;
        this.Pt = 0;
        this.Lt = 0;
        this._t = n;
        this.Rt = e === Ue ? HooksDefinition.none : new HooksDefinition(n);
        this.location = l;
        this.r = t.root.get(He);
        this.coercion = e === Ue ? void 0 : t.get(Ve);
    }
    static getCached(t) {
        return Ne.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (e === void 0) {
            throw createMappedError(500, t);
        }
        return e;
    }
    static $el(e, s, i, n, r = void 0, l = null) {
        if (Ne.has(s)) {
            return Ne.get(s);
        }
        r = r ?? getElementDefinition(s.constructor);
        const h = new Controller(e, je, r, null, s, i, l);
        const a = e.get(t.optional(ss));
        if (r.dependencies.length > 0) {
            e.register(...r.dependencies);
        }
        registerResolver(e, ss, new t.InstanceProvider("IHydrationContext", new HydrationContext(h, n, a)));
        Ne.set(s, h);
        if (n == null || n.hydrate !== false) {
            h.hE(n, a);
        }
        return h;
    }
    static $attr(t, e, s, i) {
        if (Ne.has(e)) {
            return Ne.get(e);
        }
        i = i ?? getAttributeDefinition(e.constructor);
        const n = new Controller(t, ze, i, null, e, s, null);
        if (i.dependencies.length > 0) {
            t.register(...i.dependencies);
        }
        Ne.set(e, n);
        n.Mt();
        return n;
    }
    static $view(t, e = void 0) {
        const s = new Controller(t.container, Ue, null, t, null, null, null);
        s.parent = e ?? null;
        s.Dt();
        return s;
    }
    hE(e, i) {
        const n = this.container;
        const r = this._t;
        let l = this.definition;
        this.scope = s.Scope.create(r, null, true);
        if (l.watches.length > 0) {
            createWatchers(this, n, l, r);
        }
        createObservers(this, l, r);
        if (this.Rt.qt) {
            const t = r.define(this, i, l);
            if (t !== void 0 && t !== l) {
                l = CustomElementDefinition.getOrCreate(t);
            }
        }
        this.St = jt.resolve(n);
        l.register(n);
        if (l.injectable !== null) {
            registerResolver(n, l.injectable, new t.InstanceProvider("definition.injectable", r));
        }
        if (e == null || e.hydrate !== false) {
            this.hS(e);
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
        const {shadowOptions: s, hasSlots: i, containerless: n} = e;
        let r = this.location;
        if ((this.hostController = findElementControllerFor(this.host, Oe)) !== null) {
            this.host = this.container.root.get(rt).document.createElement(this.definition.name);
            if (n && r == null) {
                r = this.location = convertToRenderLocation(this.host);
            }
        }
        setRef(this.host, Ct, this);
        setRef(this.host, this.definition.key, this);
        if (s !== null || i) {
            if (r != null) {
                throw createMappedError(501);
            }
            setRef(this.shadowRoot = this.host.attachShadow(s ?? We), Ct, this);
            setRef(this.shadowRoot, this.definition.key, this);
            this.mountTarget = 2;
        } else if (r != null) {
            setRef(r, Ct, this);
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
        this.St = jt.resolve(this.container);
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
    activate(e, s, i) {
        switch (this.state) {
          case Ge:
          case Ye:
            if (!(s === null || s.isActive)) {
                return;
            }
            this.state = Ke;
            break;

          case Xe:
            return;

          case Je:
            throw createMappedError(502, this.name);

          default:
            throw createMappedError(503, this.name, stringifyState(this.state));
        }
        this.parent = s;
        switch (this.vmKind) {
          case je:
            this.scope.parent = i ?? null;
            break;

          case ze:
            this.scope = i ?? null;
            break;

          case Ue:
            if (i === void 0 || i === null) {
                throw createMappedError(504, this.name);
            }
            if (!this.hasLockedScope) {
                this.scope = i;
            }
            break;
        }
        this.$initiator = e;
        this.Nt();
        let n = void 0;
        if (this.vmKind !== Ue && this.St.binding != null) {
            n = t.onResolveAll(...this.St.binding.map(callBindingHook, this));
        }
        if (this.Rt.$t) {
            n = t.onResolveAll(n, this._t.binding(this.$initiator, this.parent));
        }
        if (isPromise(n)) {
            this.Wt();
            n.then((() => {
                this.Tt = true;
                if (this.state !== Ke) {
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
        let e = 0;
        let s = 0;
        let i = void 0;
        if (this.bindings !== null) {
            e = 0;
            s = this.bindings.length;
            while (s > e) {
                this.bindings[e].bind(this.scope);
                ++e;
            }
        }
        if (this.vmKind !== Ue && this.St.bound != null) {
            i = t.onResolveAll(...this.St.bound.map(callBoundHook, this));
        }
        if (this.Rt.Ut) {
            i = t.onResolveAll(i, this._t.bound(this.$initiator, this.parent));
        }
        if (isPromise(i)) {
            this.Wt();
            i.then((() => {
                this.isBound = true;
                if (this.state !== Ke) {
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
                const e = t.has(Tt, false) ? t.get(Tt) : t.get(It);
                e.applyTo(this.shadowRoot);
                this.nodes.appendTo(this.shadowRoot);
                break;
            }

          case 3:
            this.nodes.insertBefore(this.location);
            break;
        }
        let e = 0;
        let s = void 0;
        if (this.vmKind !== Ue && this.St.attaching != null) {
            s = t.onResolveAll(...this.St.attaching.map(callAttachingHook, this));
        }
        if (this.Rt.Xt) {
            s = t.onResolveAll(s, this._t.attaching(this.$initiator, this.parent));
        }
        if (isPromise(s)) {
            this.Wt();
            this.Nt();
            s.then((() => {
                this.jt();
            })).catch((t => {
                this.zt(t);
            }));
        }
        if (this.children !== null) {
            for (;e < this.children.length; ++e) {
                void this.children[e].activate(this.$initiator, this, this.scope);
            }
        }
        this.jt();
    }
    deactivate(e, s) {
        let i = void 0;
        switch (this.state & ~Ze) {
          case Xe:
            this.state = Qe;
            break;

          case Ke:
            this.state = Qe;
            i = this.$promise?.catch(t.noop);
            break;

          case Ge:
          case Ye:
          case Je:
          case Ye | Je:
            return;

          default:
            throw createMappedError(505, this.name, this.state);
        }
        this.$initiator = e;
        if (e === this) {
            this.Qt();
        }
        let n = 0;
        let r;
        if (this.children !== null) {
            for (n = 0; n < this.children.length; ++n) {
                void this.children[n].deactivate(e, this);
            }
        }
        return t.onResolve(i, (() => {
            if (this.isBound) {
                if (this.vmKind !== Ue && this.St.detaching != null) {
                    r = t.onResolveAll(...this.St.detaching.map(callDetachingHook, this));
                }
                if (this.Rt.Yt) {
                    r = t.onResolveAll(r, this._t.detaching(this.$initiator, this.parent));
                }
            }
            if (isPromise(r)) {
                this.Wt();
                e.Qt();
                r.then((() => {
                    e.Zt();
                })).catch((t => {
                    e.zt(t);
                }));
            }
            if (e.head === null) {
                e.head = this;
            } else {
                e.tail.next = this;
            }
            e.tail = this;
            if (e !== this) {
                return;
            }
            this.Zt();
            return this.$promise;
        }));
    }
    removeNodes() {
        switch (this.vmKind) {
          case je:
          case Ue:
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
          case ze:
            this.scope = null;
            break;

          case Ue:
            if (!this.hasLockedScope) {
                this.scope = null;
            }
            if ((this.state & Ze) === Ze && !this.viewFactory.tryReturnToCache(this) && this.$initiator === this) {
                this.dispose();
            }
            break;

          case je:
            this.scope.parent = null;
            break;
        }
        this.state = Ye;
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
            is = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            is();
            is = void 0;
        }
    }
    zt(t) {
        if (this.$promise !== void 0) {
            ns = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            ns(t);
            ns = void 0;
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
        if (this.state !== Ke) {
            --this.Et;
            this.Jt();
            if (this.$initiator !== this) {
                this.parent.jt();
            }
            return;
        }
        if (--this.Et === 0) {
            if (this.vmKind !== Ue && this.St.attached != null) {
                rs = t.onResolveAll(...this.St.attached.map(callAttachedHook, this));
            }
            if (this.Rt.te) {
                rs = t.onResolveAll(rs, this._t.attached(this.$initiator));
            }
            if (isPromise(rs)) {
                this.Wt();
                rs.then((() => {
                    this.state = Xe;
                    this.Jt();
                    if (this.$initiator !== this) {
                        this.parent.jt();
                    }
                })).catch((t => {
                    this.zt(t);
                }));
                rs = void 0;
                return;
            }
            rs = void 0;
            this.state = Xe;
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
            let e = this.$initiator.head;
            let s = void 0;
            while (e !== null) {
                if (e !== this) {
                    if (e.debug) {
                        e.logger.trace(`detach()`);
                    }
                    e.removeNodes();
                }
                if (e.Tt) {
                    if (e.vmKind !== Ue && e.St.unbinding != null) {
                        s = t.onResolveAll(...e.St.unbinding.map(callUnbindingHook, e));
                    }
                    if (e.Rt.se) {
                        if (e.debug) {
                            e.logger.trace("unbinding()");
                        }
                        s = t.onResolveAll(s, e.viewModel.unbinding(e.$initiator, e.parent));
                    }
                }
                if (isPromise(s)) {
                    this.Wt();
                    this.ee();
                    s.then((() => {
                        this.ie();
                    })).catch((t => {
                        this.zt(t);
                    }));
                }
                s = void 0;
                e = e.next;
            }
            this.ie();
        }
    }
    ee() {
        ++this.Lt;
    }
    ie() {
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
          case ze:
            {
                return getAttributeDefinition(this._t.constructor).name === t;
            }

          case je:
            {
                return getElementDefinition(this._t.constructor).name === t;
            }

          case Ue:
            return this.viewFactory.name === t;
        }
    }
    lockScope(t) {
        this.scope = t;
        this.hasLockedScope = true;
    }
    setHost(t) {
        if (this.vmKind === je) {
            setRef(t, Ct, this);
            setRef(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = 1;
        return this;
    }
    setShadowRoot(t) {
        if (this.vmKind === je) {
            setRef(t, Ct, this);
            setRef(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = 2;
        return this;
    }
    setLocation(t) {
        if (this.vmKind === je) {
            setRef(t, Ct, this);
            setRef(t, this.definition.key, this);
        }
        this.location = t;
        this.mountTarget = 3;
        return this;
    }
    release() {
        this.state |= Ze;
    }
    dispose() {
        if ((this.state & Je) === Je) {
            return;
        }
        this.state |= Je;
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
            Ne.delete(this._t);
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
            for (let s = 0, i = e.length; s < i; ++s) {
                if (e[s].accept(t) === true) {
                    return true;
                }
            }
        }
    }
}

function createObservers(e, i, n) {
    const r = i.bindables;
    const l = f(r);
    const h = l.length;
    const a = e.container.get(s.IObserverLocator);
    if (h > 0) {
        for (let s = 0; s < h; ++s) {
            const i = l[s];
            const h = r[i];
            const c = h.callback;
            const u = a.getObserver(n, i);
            if (h.set !== t.noop) {
                if (u.useCoercer?.(h.set, e.coercion) !== true) {
                    throw createMappedError(507, i);
                }
            }
            if (n[c] != null || n.propertyChanged != null) {
                const callback = (t, s) => {
                    if (e.isBound) {
                        n[c]?.(t, s);
                        n.propertyChanged?.(i, t, s);
                    }
                };
                if (u.useCallback?.(callback) !== true) {
                    throw createMappedError(508, i);
                }
            }
        }
    }
}

const $e = new Map;

const getAccessScopeAst = t => {
    let e = $e.get(t);
    if (e == null) {
        e = new s.AccessScopeExpression(t, 0);
        $e.set(t, e);
    }
    return e;
};

function createWatchers(t, e, i, n) {
    const r = e.get(s.IObserverLocator);
    const l = e.get(s.IExpressionParser);
    const h = i.watches;
    const a = t.vmKind === je ? t.scope : s.Scope.create(n, null, true);
    const c = h.length;
    let u;
    let f;
    let d;
    let p = 0;
    for (;c > p; ++p) {
        ({expression: u, callback: f} = h[p]);
        f = isFunction(f) ? f : Reflect.get(n, f);
        if (!isFunction(f)) {
            throw createMappedError(506, f);
        }
        if (isFunction(u)) {
            t.addBinding(new ComputedWatcher(n, r, u, f, true));
        } else {
            d = isString(u) ? l.parse(u, y) : getAccessScopeAst(u);
            t.addBinding(new ExpressionWatcher(a, e, r, d, f));
        }
    }
}

function isCustomElementController(t) {
    return t instanceof Controller && t.vmKind === je;
}

function isCustomElementViewModel(t) {
    return e.isObject(t) && isElementType(t.constructor);
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
        this.se = "unbinding" in t;
        this.ne = "dispose" in t;
        this.re = "accept" in t;
    }
}

HooksDefinition.none = new HooksDefinition({});

const We = {
    mode: "open"
};

const je = "customElement";

const ze = "customAttribute";

const Ue = "synthetic";

const Ge = 0;

const Ke = 1;

const Xe = 2;

const Qe = 4;

const Ye = 8;

const Ze = 16;

const Je = 32;

const ts = /*@__PURE__*/ c({
    none: Ge,
    activating: Ke,
    activated: Xe,
    deactivating: Qe,
    deactivated: Ye,
    released: Ze,
    disposed: Je
});

function stringifyState(t) {
    const e = [];
    if ((t & Ke) === Ke) {
        e.push("activating");
    }
    if ((t & Xe) === Xe) {
        e.push("activated");
    }
    if ((t & Qe) === Qe) {
        e.push("deactivating");
    }
    if ((t & Ye) === Ye) {
        e.push("deactivated");
    }
    if ((t & Ze) === Ze) {
        e.push("released");
    }
    if ((t & Je) === Je) {
        e.push("disposed");
    }
    return e.length === 0 ? "none" : e.join("|");
}

const es = /*@__PURE__*/ z("IController");

const ss = /*@__PURE__*/ z("IHydrationContext");

class HydrationContext {
    constructor(t, e, s) {
        this.instruction = e;
        this.parent = s;
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

let is;

let ns;

let rs;

const os = /*@__PURE__*/ z("IAppRoot");

class AppRoot {
    constructor(e, s, i, n) {
        this.config = e;
        this.platform = s;
        this.container = i;
        this.oe = void 0;
        this.host = e.host;
        n.prepare(this);
        registerHostNode(i, s, e.host);
        this.oe = t.onResolve(this.le("creating"), (() => {
            const s = e.component;
            const n = i.createChild();
            let r;
            if (isElementType(s)) {
                r = this.container.get(s);
            } else {
                r = e.component;
            }
            const l = {
                hydrate: false,
                projections: null
            };
            const h = this.controller = Controller.$el(n, r, this.host, l);
            h.hE(l, null);
            return t.onResolve(this.le("hydrating"), (() => {
                h.hS(null);
                return t.onResolve(this.le("hydrated"), (() => {
                    h.hC();
                    this.oe = void 0;
                }));
            }));
        }));
    }
    activate() {
        return t.onResolve(this.oe, (() => t.onResolve(this.le("activating"), (() => t.onResolve(this.controller.activate(this.controller, null, void 0), (() => this.le("activated")))))));
    }
    deactivate() {
        return t.onResolve(this.le("deactivating"), (() => t.onResolve(this.controller.deactivate(this.controller, null), (() => this.le("deactivated")))));
    }
    le(e) {
        return t.onResolveAll(...this.container.getAll(it).reduce(((t, s) => {
            if (s.slot === e) {
                t.push(s.run());
            }
            return t;
        }), []));
    }
    dispose() {
        this.controller?.dispose();
    }
}

const ls = /*@__PURE__*/ z("IAurelia");

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
    constructor(e = t.DI.createContainer()) {
        this.container = e;
        this.ir = false;
        this.he = false;
        this.ae = false;
        this.ce = void 0;
        this.next = void 0;
        this.ue = void 0;
        this.fe = void 0;
        if (e.has(ls, true) || e.has(Aurelia, true)) {
            throw createMappedError(768);
        }
        registerResolver(e, ls, new t.InstanceProvider("IAurelia", this));
        registerResolver(e, Aurelia, new t.InstanceProvider("Aurelia", this));
        registerResolver(e, os, this.de = new t.InstanceProvider("IAppRoot"));
    }
    register(...t) {
        this.container.register(...t);
        return this;
    }
    app(t) {
        this.next = new AppRoot(t, this.pe(t.host), this.container, this.de);
        return this;
    }
    enhance(e, s) {
        const i = e.container ?? this.container.createChild();
        const n = e.host;
        const r = this.pe(n);
        const l = e.component;
        let h;
        if (isFunction(l)) {
            registerHostNode(i, r, n);
            h = i.invoke(l);
        } else {
            h = l;
        }
        registerResolver(i, lt, new t.InstanceProvider("IEventTarget", n));
        s = s ?? null;
        const a = Controller.$el(i, h, n, null, CustomElementDefinition.create({
            name: At(),
            template: n,
            enhance: true
        }));
        return t.onResolve(a.activate(a, s), (() => a));
    }
    async waitForIdle() {
        const t = this.root.platform;
        await t.domWriteQueue.yield();
        await t.domReadQueue.yield();
        await t.taskQueue.yield();
    }
    pe(t) {
        let e;
        if (!this.container.has(rt, false)) {
            if (t.ownerDocument.defaultView === null) {
                throw createMappedError(769);
            }
            e = new i.BrowserPlatform(t.ownerDocument.defaultView);
            this.container.register(K(rt, e));
        } else {
            e = this.container.get(rt);
        }
        return e;
    }
    start(e = this.next) {
        if (e == null) {
            throw createMappedError(770);
        }
        if (isPromise(this.ue)) {
            return this.ue;
        }
        return this.ue = t.onResolve(this.stop(), (() => {
            Reflect.set(e.host, "$aurelia", this);
            this.de.prepare(this.ce = e);
            this.he = true;
            return t.onResolve(e.activate(), (() => {
                this.ir = true;
                this.he = false;
                this.ue = void 0;
                this.me(e, "au-started", e.host);
            }));
        }));
    }
    stop(e = false) {
        if (isPromise(this.fe)) {
            return this.fe;
        }
        if (this.ir === true) {
            const s = this.ce;
            this.ir = false;
            this.ae = true;
            return this.fe = t.onResolve(s.deactivate(), (() => {
                Reflect.deleteProperty(s.host, "$aurelia");
                if (e) {
                    s.dispose();
                }
                this.ce = void 0;
                this.de.dispose();
                this.ae = false;
                this.me(s, "au-stopped", s.host);
            }));
        }
    }
    dispose() {
        if (this.ir || this.ae) {
            throw createMappedError(771);
        }
        this.container.dispose();
    }
    me(t, e, s) {
        const i = new t.platform.window.CustomEvent(e, {
            detail: this,
            bubbles: true,
            cancelable: true
        });
        s.dispatchEvent(i);
    }
}

class CharSpec {
    constructor(t, e, s, i) {
        this.chars = t;
        this.repeat = e;
        this.isSymbol = s;
        this.isInverted = i;
        if (i) {
            switch (t.length) {
              case 0:
                this.has = this.ge;
                break;

              case 1:
                this.has = this.xe;
                break;

              default:
                this.has = this.ve;
            }
        } else {
            switch (t.length) {
              case 0:
                this.has = this.be;
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
    be(t) {
        return false;
    }
    ve(t) {
        return !this.chars.includes(t);
    }
    xe(t) {
        return this.chars !== t;
    }
    ge(t) {
        return true;
    }
}

class Interpretation {
    constructor() {
        this.parts = t.emptyArray;
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
    set pattern(e) {
        if (e == null) {
            this.ke = "";
            this.parts = t.emptyArray;
        } else {
            this.ke = e;
            this.parts = this.Ae[e];
        }
    }
    append(t, e) {
        const s = this.Ce;
        if (s[t] === undefined) {
            s[t] = e;
        } else {
            s[t] += e;
        }
    }
    next(t) {
        const e = this.Ce;
        let s;
        if (e[t] !== undefined) {
            s = this.Ae;
            if (s[t] === undefined) {
                s[t] = [ e[t] ];
            } else {
                s[t].push(e[t]);
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
        const s = e.length;
        let i = null;
        let n = 0;
        for (;n < s; ++n) {
            i = e[n];
            if (t.equals(i.charSpec)) {
                return i;
            }
        }
        return null;
    }
    append(t, e) {
        const s = this.Se;
        if (!s.includes(e)) {
            s.push(e);
        }
        let i = this.findChild(t);
        if (i == null) {
            i = new AttrParsingState(t, e);
            this._e.push(i);
            if (t.repeat) {
                i._e.push(i);
            }
        }
        return i;
    }
    findMatches(t, e) {
        const s = [];
        const i = this._e;
        const n = i.length;
        let r = 0;
        let l = null;
        let h = 0;
        let a = 0;
        for (;h < n; ++h) {
            l = i[h];
            if (l.charSpec.has(t)) {
                s.push(l);
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
        return s;
    }
}

class StaticSegment {
    constructor(t) {
        this.text = t;
        const e = this.Te = t.length;
        const s = this.Ie = [];
        let i = 0;
        for (;e > i; ++i) {
            s.push(new CharSpec(t[i], false, false, false));
        }
    }
    eachChar(t) {
        const e = this.Te;
        const s = this.Ie;
        let i = 0;
        for (;e > i; ++i) {
            t(s[i]);
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

const hs = /*@__PURE__*/ z("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

class SyntaxInterpreter {
    constructor() {
        this.Pe = new AttrParsingState(null);
        this.Le = [ this.Pe ];
    }
    add(t) {
        t = t.slice(0).sort(((t, e) => t.pattern > e.pattern ? 1 : -1));
        const e = t.length;
        let s;
        let i;
        let n;
        let r;
        let l;
        let h;
        let a;
        let c = 0;
        let u;
        while (e > c) {
            s = this.Pe;
            i = t[c];
            n = i.pattern;
            r = new SegmentTypes;
            l = this.Me(i, r);
            h = l.length;
            a = t => s = s.append(t, n);
            for (u = 0; h > u; ++u) {
                l[u].eachChar(a);
            }
            s.Re = r;
            s.Be = true;
            ++c;
        }
    }
    interpret(t) {
        const e = new Interpretation;
        const s = t.length;
        let i = this.Le;
        let n = 0;
        let r;
        for (;n < s; ++n) {
            i = this.De(i, t.charAt(n), e);
            if (i.length === 0) {
                break;
            }
        }
        i = i.filter(isEndpoint);
        if (i.length > 0) {
            i.sort(sortEndpoint);
            r = i[0];
            if (!r.charSpec.isSymbol) {
                e.next(r.ke);
            }
            e.pattern = r.ke;
        }
        return e;
    }
    De(t, e, s) {
        const i = [];
        let n = null;
        const r = t.length;
        let l = 0;
        for (;l < r; ++l) {
            n = t[l];
            i.push(...n.findMatches(e, s));
        }
        return i;
    }
    Me(t, e) {
        const s = [];
        const i = t.pattern;
        const n = i.length;
        const r = t.symbols;
        let l = 0;
        let h = 0;
        let a = "";
        while (l < n) {
            a = i.charAt(l);
            if (r.length === 0 || !r.includes(a)) {
                if (l === h) {
                    if (a === "P" && i.slice(l, l + 4) === "PART") {
                        h = l = l + 4;
                        s.push(new DynamicSegment(r));
                        ++e.dynamics;
                    } else {
                        ++l;
                    }
                } else {
                    ++l;
                }
            } else if (l !== h) {
                s.push(new StaticSegment(i.slice(h, l)));
                ++e.statics;
                h = l;
            } else {
                s.push(new SymbolSegment(i.slice(h, l + 1)));
                ++e.symbols;
                h = ++l;
            }
        }
        if (h !== l) {
            s.push(new StaticSegment(i.slice(h, l)));
            ++e.statics;
        }
        return s;
    }
}

function isEndpoint(t) {
    return t.Be;
}

function sortEndpoint(t, e) {
    const s = t.Re;
    const i = e.Re;
    if (s.statics !== i.statics) {
        return i.statics - s.statics;
    }
    if (s.dynamics !== i.dynamics) {
        return i.dynamics - s.dynamics;
    }
    if (s.symbols !== i.symbols) {
        return i.symbols - s.symbols;
    }
    return 0;
}

class AttrSyntax {
    constructor(t, e, s, i, n = null) {
        this.rawName = t;
        this.rawValue = e;
        this.target = s;
        this.command = i;
        this.parts = n;
    }
}

const as = /*@__PURE__*/ z("IAttributePattern");

const cs = /*@__PURE__*/ z("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor(e, s) {
        this.ot = {};
        this.qe = e;
        const i = this.Se = {};
        const n = s.reduce(((t, e) => {
            const s = getAllPatternDefinitions(e.constructor);
            s.forEach((t => i[t.pattern] = e));
            return t.concat(s);
        }), t.emptyArray);
        e.add(n);
    }
    parse(t, e) {
        let s = this.ot[t];
        if (s == null) {
            s = this.ot[t] = this.qe.interpret(t);
        }
        const i = s.pattern;
        if (i == null) {
            return new AttrSyntax(t, e, t, null, null);
        } else {
            return this.Se[i][i](t, e, s.parts);
        }
    }
}

AttributeParser.inject = [ hs, t.all(as) ];

function attributePattern(...t) {
    return function decorator(e) {
        return ds.define(t, e);
    };
}

class AttributePatternResourceDefinition {
    constructor(t) {
        this.Type = t;
        this.name = void 0;
    }
    register(t) {
        U(as, this.Type).register(t);
    }
}

const us = F("attribute-pattern");

const fs = "attribute-pattern-definitions";

const getAllPatternDefinitions = e => t.Protocol.annotation.get(e, fs);

const ds = c({
    name: us,
    definitionAnnotationKey: fs,
    define(e, s) {
        const i = new AttributePatternResourceDefinition(s);
        M(us, i, s);
        O(s, us);
        t.Protocol.annotation.set(s, fs, e);
        V(s, fs);
        return s;
    },
    getPatternDefinitions: getAllPatternDefinitions
});

exports.DotSeparatedAttributePattern = class DotSeparatedAttributePattern {
    "PART.PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], s[1]);
    }
    "PART.PART.PART"(t, e, s) {
        return new AttrSyntax(t, e, `${s[0]}.${s[1]}`, s[2]);
    }
};

exports.DotSeparatedAttributePattern = __decorate([ attributePattern({
    pattern: "PART.PART",
    symbols: "."
}, {
    pattern: "PART.PART.PART",
    symbols: "."
}) ], exports.DotSeparatedAttributePattern);

exports.RefAttributePattern = class RefAttributePattern {
    ref(t, e, s) {
        return new AttrSyntax(t, e, "element", "ref");
    }
    "PART.ref"(t, e, s) {
        let i = s[0];
        if (i === "view-model") {
            i = "component";
        }
        return new AttrSyntax(t, e, i, "ref");
    }
};

exports.RefAttributePattern = __decorate([ attributePattern({
    pattern: "ref",
    symbols: ""
}, {
    pattern: "PART.ref",
    symbols: "."
}) ], exports.RefAttributePattern);

let ps = class EventAttributePattern {
    "PART.trigger:PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "trigger", s);
    }
    "PART.capture:PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "capture", s);
    }
};

ps = __decorate([ attributePattern({
    pattern: "PART.trigger:PART",
    symbols: ".:"
}, {
    pattern: "PART.capture:PART",
    symbols: ".:"
}) ], ps);

exports.ColonPrefixedBindAttributePattern = class ColonPrefixedBindAttributePattern {
    ":PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "bind");
    }
};

exports.ColonPrefixedBindAttributePattern = __decorate([ attributePattern({
    pattern: ":PART",
    symbols: ":"
}) ], exports.ColonPrefixedBindAttributePattern);

exports.AtPrefixedTriggerAttributePattern = class AtPrefixedTriggerAttributePattern {
    "@PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "trigger");
    }
    "@PART:PART"(t, e, s) {
        s.splice(1, 0, "trigger");
        return new AttrSyntax(t, e, s[0], "trigger", s);
    }
};

exports.AtPrefixedTriggerAttributePattern = __decorate([ attributePattern({
    pattern: "@PART",
    symbols: "@"
}, {
    pattern: "@PART:PART",
    symbols: "@:"
}) ], exports.AtPrefixedTriggerAttributePattern);

let ms = class SpreadAttributePattern {
    "...$attrs"(t, e, s) {
        return new AttrSyntax(t, e, "", "...$attrs");
    }
};

ms = __decorate([ attributePattern({
    pattern: "...$attrs",
    symbols: ""
}) ], ms);

const gs = "None";

const xs = "IgnoreAttr";

function bindingCommand(t) {
    return function(e) {
        return bs.define(t, e);
    };
}

class BindingCommandDefinition {
    constructor(t, e, s, i, n) {
        this.Type = t;
        this.name = e;
        this.aliases = s;
        this.key = i;
        this.type = n;
    }
    static create(e, s) {
        let i;
        let n;
        if (isString(e)) {
            i = e;
            n = {
                name: i
            };
        } else {
            i = e.name;
            n = e;
        }
        return new BindingCommandDefinition(s, t.firstDefined(getCommandAnnotation(s, "name"), i), t.mergeArrays(getCommandAnnotation(s, "aliases"), n.aliases, s.aliases), getCommandKeyFrom(i), t.firstDefined(getCommandAnnotation(s, "type"), n.type, s.type, null));
    }
    register(t) {
        const {Type: e, key: s, aliases: i} = this;
        U(s, e).register(t);
        G(s, e).register(t);
        registerAliases(i, bs, s, t);
    }
}

const vs = /*@__PURE__*/ F("binding-command");

const getCommandKeyFrom = t => `${vs}:${t}`;

const getCommandAnnotation = (t, e) => P(H(e), t);

const bs = c({
    name: vs,
    keyFrom: getCommandKeyFrom,
    define(t, e) {
        const s = BindingCommandDefinition.create(t, e);
        M(vs, s, s.Type);
        M(vs, s, s);
        O(e, vs);
        return s.Type;
    },
    getAnnotation: getCommandAnnotation
});

exports.OneTimeBindingCommand = class OneTimeBindingCommand {
    get type() {
        return gs;
    }
    build(e, s, i) {
        const n = e.attr;
        let r = n.target;
        let l = e.attr.rawValue;
        if (e.bindable == null) {
            r = i.map(e.node, r) ?? t.camelCase(r);
        } else {
            if (l === "" && e.def.type === pt) {
                l = t.camelCase(r);
            }
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(s.parse(l, y), r, S);
    }
};

exports.OneTimeBindingCommand = __decorate([ bindingCommand("one-time") ], exports.OneTimeBindingCommand);

exports.ToViewBindingCommand = class ToViewBindingCommand {
    get type() {
        return gs;
    }
    build(e, s, i) {
        const n = e.attr;
        let r = n.target;
        let l = e.attr.rawValue;
        if (e.bindable == null) {
            r = i.map(e.node, r) ?? t.camelCase(r);
        } else {
            if (l === "" && e.def.type === pt) {
                l = t.camelCase(r);
            }
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(s.parse(l, y), r, _);
    }
};

exports.ToViewBindingCommand = __decorate([ bindingCommand("to-view") ], exports.ToViewBindingCommand);

exports.FromViewBindingCommand = class FromViewBindingCommand {
    get type() {
        return gs;
    }
    build(e, s, i) {
        const n = e.attr;
        let r = n.target;
        let l = n.rawValue;
        if (e.bindable == null) {
            r = i.map(e.node, r) ?? t.camelCase(r);
        } else {
            if (l === "" && e.def.type === pt) {
                l = t.camelCase(r);
            }
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(s.parse(l, y), r, R);
    }
};

exports.FromViewBindingCommand = __decorate([ bindingCommand("from-view") ], exports.FromViewBindingCommand);

exports.TwoWayBindingCommand = class TwoWayBindingCommand {
    get type() {
        return gs;
    }
    build(e, s, i) {
        const n = e.attr;
        let r = n.target;
        let l = n.rawValue;
        if (e.bindable == null) {
            r = i.map(e.node, r) ?? t.camelCase(r);
        } else {
            if (l === "" && e.def.type === pt) {
                l = t.camelCase(r);
            }
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(s.parse(l, y), r, T);
    }
};

exports.TwoWayBindingCommand = __decorate([ bindingCommand("two-way") ], exports.TwoWayBindingCommand);

exports.DefaultBindingCommand = class DefaultBindingCommand {
    get type() {
        return gs;
    }
    build(e, s, i) {
        const n = e.attr;
        const r = e.bindable;
        let l;
        let h;
        let a = n.target;
        let c = n.rawValue;
        if (r == null) {
            h = i.isTwoWay(e.node, a) ? T : _;
            a = i.map(e.node, a) ?? t.camelCase(a);
        } else {
            if (c === "" && e.def.type === pt) {
                c = t.camelCase(a);
            }
            l = e.def.defaultBindingMode;
            h = r.mode === I || r.mode == null ? l == null || l === I ? _ : l : r.mode;
            a = r.name;
        }
        return new PropertyBindingInstruction(s.parse(c, y), a, h);
    }
};

exports.DefaultBindingCommand = __decorate([ bindingCommand("bind") ], exports.DefaultBindingCommand);

exports.ForBindingCommand = class ForBindingCommand {
    get type() {
        return gs;
    }
    static get inject() {
        return [ cs ];
    }
    constructor(t) {
        this.He = t;
    }
    build(e, s) {
        const i = e.bindable === null ? t.camelCase(e.attr.target) : e.bindable.name;
        const n = s.parse(e.attr.rawValue, v);
        let r = t.emptyArray;
        if (n.semiIdx > -1) {
            const t = e.attr.rawValue.slice(n.semiIdx + 1);
            const s = t.indexOf(":");
            if (s > -1) {
                const e = t.slice(0, s).trim();
                const i = t.slice(s + 1).trim();
                const n = this.He.parse(e, i);
                r = [ new MultiAttrInstruction(i, n.target, n.command) ];
            }
        }
        return new IteratorBindingInstruction(n, i, r);
    }
};

exports.ForBindingCommand = __decorate([ bindingCommand("for") ], exports.ForBindingCommand);

exports.TriggerBindingCommand = class TriggerBindingCommand {
    get type() {
        return xs;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, b), t.attr.target, true, false, t.attr.parts?.[2] ?? null);
    }
};

exports.TriggerBindingCommand = __decorate([ bindingCommand("trigger") ], exports.TriggerBindingCommand);

exports.CaptureBindingCommand = class CaptureBindingCommand {
    get type() {
        return xs;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, b), t.attr.target, false, true, t.attr.parts?.[2] ?? null);
    }
};

exports.CaptureBindingCommand = __decorate([ bindingCommand("capture") ], exports.CaptureBindingCommand);

exports.AttrBindingCommand = class AttrBindingCommand {
    get type() {
        return xs;
    }
    build(t, e) {
        return new AttributeBindingInstruction(t.attr.target, e.parse(t.attr.rawValue, y), t.attr.target);
    }
};

exports.AttrBindingCommand = __decorate([ bindingCommand("attr") ], exports.AttrBindingCommand);

exports.StyleBindingCommand = class StyleBindingCommand {
    get type() {
        return xs;
    }
    build(t, e) {
        return new AttributeBindingInstruction("style", e.parse(t.attr.rawValue, y), t.attr.target);
    }
};

exports.StyleBindingCommand = __decorate([ bindingCommand("style") ], exports.StyleBindingCommand);

exports.ClassBindingCommand = class ClassBindingCommand {
    get type() {
        return xs;
    }
    build(t, e) {
        return new AttributeBindingInstruction("class", e.parse(t.attr.rawValue, y), t.attr.target);
    }
};

exports.ClassBindingCommand = __decorate([ bindingCommand("class") ], exports.ClassBindingCommand);

let ys = class RefBindingCommand {
    get type() {
        return xs;
    }
    build(t, e) {
        return new RefBindingInstruction(e.parse(t.attr.rawValue, y), t.attr.target);
    }
};

ys = __decorate([ bindingCommand("ref") ], ys);

let ws = class SpreadBindingCommand {
    get type() {
        return xs;
    }
    build(t) {
        return new SpreadBindingInstruction;
    }
};

ws = __decorate([ bindingCommand("...$attrs") ], ws);

const ks = /*@__PURE__*/ z("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

const o = t => {
    const e = createLookup();
    t = isString(t) ? t.split(" ") : t;
    let s;
    for (s of t) {
        e[s] = true;
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
        return U(ks, this).register(t);
    }
    constructor(t) {
        this.Fe = u(createLookup(), {
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

SVGAnalyzer.inject = [ rt ];

const Cs = /*@__PURE__*/ z("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    constructor() {
        this.fns = [];
        this.Ne = createLookup();
        this.$e = createLookup();
        this.svg = t.resolve(ks);
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
        let s;
        let i;
        let n;
        let r;
        for (n in t) {
            s = t[n];
            i = (e = this.Ne)[n] ?? (e[n] = createLookup());
            for (r in s) {
                if (i[r] !== void 0) {
                    throw createError(r, n);
                }
                i[r] = s[r];
            }
        }
    }
    useGlobalMapping(t) {
        const e = this.$e;
        for (const s in t) {
            if (e[s] !== void 0) {
                throw createError(s, "*");
            }
            e[s] = t[s];
        }
    }
    useTwoWay(t) {
        this.fns.push(t);
    }
    isTwoWay(t, e) {
        return shouldDefaultToTwoWay(t, e) || this.fns.length > 0 && this.fns.some((s => s(t, e)));
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

const As = createLookup();

class AttributeNSAccessor {
    static forNs(t) {
        return As[t] ?? (As[t] = new AttributeNSAccessor(t));
    }
    constructor(t) {
        this.ns = t;
        this.type = A | B;
    }
    getValue(t, e) {
        return t.getAttributeNS(this.ns, e);
    }
    setValue(t, e, s) {
        if (t == null) {
            e.removeAttributeNS(this.ns, s);
        } else {
            e.setAttributeNS(this.ns, s, t);
        }
    }
}

mixinNoopSubscribable(AttributeNSAccessor);

class DataAttributeAccessor {
    constructor() {
        this.type = A | B;
    }
    getValue(t, e) {
        return t.getAttribute(e);
    }
    setValue(t, e, s) {
        if (t == null) {
            e.removeAttribute(s);
        } else {
            e.setAttribute(s, t);
        }
    }
}

mixinNoopSubscribable(DataAttributeAccessor);

const Bs = new DataAttributeAccessor;

const Ss = {
    childList: true,
    subtree: true,
    characterData: true
};

function defaultMatcher$1(t, e) {
    return t === e;
}

class SelectValueObserver {
    constructor(t, e, s, i) {
        this.type = A | C | B;
        this.v = void 0;
        this.ov = void 0;
        this.We = false;
        this.je = void 0;
        this.ze = void 0;
        this.iO = false;
        this.L = false;
        this.P = t;
        this.oL = i;
        this.cf = s;
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
        const s = isArray(t);
        const i = e.matcher ?? defaultMatcher$1;
        const n = e.options;
        let r = n.length;
        while (r-- > 0) {
            const e = n[r];
            const l = a.call(e, "model") ? e.model : e.value;
            if (s) {
                e.selected = t.findIndex((t => !!i(l, t))) !== -1;
                continue;
            }
            e.selected = !!i(l, t);
        }
    }
    syncValue() {
        const t = this.P;
        const e = t.options;
        const s = e.length;
        const i = this.v;
        let n = 0;
        if (t.multiple) {
            if (!(i instanceof Array)) {
                return true;
            }
            let r;
            const l = t.matcher || defaultMatcher$1;
            const h = [];
            while (n < s) {
                r = e[n];
                if (r.selected) {
                    h.push(a.call(r, "model") ? r.model : r.value);
                }
                ++n;
            }
            let c;
            n = 0;
            while (n < i.length) {
                c = i[n];
                if (h.findIndex((t => !!l(c, t))) === -1) {
                    i.splice(n, 1);
                } else {
                    ++n;
                }
            }
            n = 0;
            while (n < h.length) {
                c = h[n];
                if (i.findIndex((t => !!l(c, t))) === -1) {
                    i.push(c);
                }
                ++n;
            }
            return false;
        }
        let r = null;
        let l;
        while (n < s) {
            l = e[n];
            if (l.selected) {
                r = a.call(l, "model") ? l.model : l.value;
                break;
            }
            ++n;
        }
        this.ov = this.v;
        this.v = r;
        return true;
    }
    M() {
        (this.ze = createMutationObserver(this.P, this.Ge.bind(this))).observe(this.P, Ss);
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
        _s = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, _s);
    }
}

mixinNodeObserverUseConfig(SelectValueObserver);

s.subscriberCollection(SelectValueObserver);

function getSelectedOptions(t) {
    const e = [];
    if (t.length === 0) {
        return e;
    }
    const s = t.length;
    let i = 0;
    let n;
    while (s > i) {
        n = t[i];
        if (n.selected) {
            e[e.length] = a.call(n, "model") ? n.model : n.value;
        }
        ++i;
    }
    return e;
}

let _s = void 0;

const Rs = "--";

class StyleAttributeAccessor {
    constructor(t) {
        this.obj = t;
        this.type = A | B;
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
        const s = /url\([^)]+$/;
        let i = 0;
        let n = "";
        let r;
        let l;
        let h;
        let a;
        while (i < t.length) {
            r = t.indexOf(";", i);
            if (r === -1) {
                r = t.length;
            }
            n += t.substring(i, r);
            i = r + 1;
            if (s.test(n)) {
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
    Qe(e) {
        let s;
        let i;
        const n = [];
        for (i in e) {
            s = e[i];
            if (s == null) {
                continue;
            }
            if (isString(s)) {
                if (i.startsWith(Rs)) {
                    n.push([ i, s ]);
                    continue;
                }
                n.push([ t.kebabCase(i), s ]);
                continue;
            }
            n.push(...this.Ye(s));
        }
        return n;
    }
    Ze(e) {
        const s = e.length;
        if (s > 0) {
            const t = [];
            let i = 0;
            for (;s > i; ++i) {
                t.push(...this.Ye(e[i]));
            }
            return t;
        }
        return t.emptyArray;
    }
    Ye(e) {
        if (isString(e)) {
            return this.Xe(e);
        }
        if (e instanceof Array) {
            return this.Ze(e);
        }
        if (e instanceof Object) {
            return this.Qe(e);
        }
        return t.emptyArray;
    }
    O() {
        if (this.We) {
            this.We = false;
            const t = this.v;
            const e = this.styles;
            const s = this.Ye(t);
            let i;
            let n = this.version;
            this.ov = t;
            let r;
            let l;
            let h;
            let c = 0;
            const u = s.length;
            for (;c < u; ++c) {
                r = s[c];
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
            for (i in e) {
                if (!a.call(e, i) || e[i] !== n) {
                    continue;
                }
                this.obj.style.removeProperty(i);
            }
        }
    }
    setProperty(t, e) {
        let s = "";
        if (e != null && isFunction(e.indexOf) && e.includes("!important")) {
            s = "important";
            e = e.replace("!important", "");
        }
        this.obj.style.setProperty(t, e, s);
    }
    bind() {
        this.v = this.ov = this.obj.style.cssText;
    }
}

mixinNoopSubscribable(StyleAttributeAccessor);

class ValueAttributeObserver {
    constructor(t, e, s) {
        this.type = A | C | B;
        this.v = "";
        this.ov = "";
        this.We = false;
        this.L = false;
        this.P = t;
        this.k = e;
        this.cf = s;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (m(t, this.v)) {
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
        Ts = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Ts);
    }
}

mixinNodeObserverUseConfig(ValueAttributeObserver);

s.subscriberCollection(ValueAttributeObserver);

let Ts = void 0;

const Is = "http://www.w3.org/1999/xlink";

const Es = "http://www.w3.org/XML/1998/namespace";

const Ps = "http://www.w3.org/2000/xmlns/";

const Ls = u(createLookup(), {
    "xlink:actuate": [ "actuate", Is ],
    "xlink:arcrole": [ "arcrole", Is ],
    "xlink:href": [ "href", Is ],
    "xlink:role": [ "role", Is ],
    "xlink:show": [ "show", Is ],
    "xlink:title": [ "title", Is ],
    "xlink:type": [ "type", Is ],
    "xml:lang": [ "lang", Es ],
    "xml:space": [ "space", Es ],
    xmlns: [ "xmlns", Ps ],
    "xmlns:xlink": [ "xlink", Ps ]
});

const Ms = new s.PropertyAccessor;

Ms.type = A | B;

class NodeObserverLocator {
    constructor() {
        this.allowDirtyCheck = true;
        this.Je = createLookup();
        this.ts = createLookup();
        this.es = createLookup();
        this.ss = createLookup();
        this.rs = t.resolve(t.IServiceLocator);
        this.p = t.resolve(rt);
        this.os = t.resolve(s.IDirtyChecker);
        this.svg = t.resolve(ks);
        const e = [ "change", "input" ];
        const i = {
            events: e,
            default: ""
        };
        this.useConfig({
            INPUT: {
                value: i,
                valueAsNumber: {
                    events: e,
                    default: 0
                },
                checked: {
                    type: CheckedObserver,
                    events: e
                },
                files: {
                    events: e,
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
                value: i
            }
        });
        const n = {
            events: [ "change", "input", "blur", "keyup", "paste" ],
            default: ""
        };
        const r = {
            events: [ "scroll" ],
            default: 0
        };
        this.useConfigGlobal({
            scrollTop: r,
            scrollLeft: r,
            textContent: n,
            innerHTML: n
        });
        this.overrideAccessorGlobal("css", "style", "class");
        this.overrideAccessor({
            INPUT: [ "value", "checked", "model" ],
            SELECT: [ "value" ],
            TEXTAREA: [ "value" ]
        });
    }
    static register(t) {
        G(s.INodeObserverLocator, NodeObserverLocator).register(t);
        U(s.INodeObserverLocator, NodeObserverLocator).register(t);
    }
    handles(t, e) {
        return t instanceof this.p.Node;
    }
    useConfig(t, e, s) {
        const i = this.Je;
        let n;
        if (isString(t)) {
            n = i[t] ?? (i[t] = createLookup());
            if (n[e] == null) {
                n[e] = s;
            } else {
                throwMappingExisted(t, e);
            }
        } else {
            for (const s in t) {
                n = i[s] ?? (i[s] = createLookup());
                const r = t[s];
                for (e in r) {
                    if (n[e] == null) {
                        n[e] = r[e];
                    } else {
                        throwMappingExisted(s, e);
                    }
                }
            }
        }
    }
    useConfigGlobal(t, e) {
        const s = this.ts;
        if (typeof t === "object") {
            for (const e in t) {
                if (s[e] == null) {
                    s[e] = t[e];
                } else {
                    throwMappingExisted("*", e);
                }
            }
        } else {
            if (s[t] == null) {
                s[t] = e;
            } else {
                throwMappingExisted("*", t);
            }
        }
    }
    getAccessor(e, s, i) {
        if (s in this.ss || s in (this.es[e.tagName] ?? t.emptyObject)) {
            return this.getObserver(e, s, i);
        }
        switch (s) {
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
            return Bs;

          default:
            {
                const t = Ls[s];
                if (t !== undefined) {
                    return AttributeNSAccessor.forNs(t[1]);
                }
                if (isDataAttribute(e, s, this.svg)) {
                    return Bs;
                }
                return Ms;
            }
        }
    }
    overrideAccessor(t, e) {
        var s, i;
        let n;
        if (isString(t)) {
            n = (s = this.es)[t] ?? (s[t] = createLookup());
            n[e] = true;
        } else {
            for (const e in t) {
                for (const s of t[e]) {
                    n = (i = this.es)[e] ?? (i[e] = createLookup());
                    n[s] = true;
                }
            }
        }
    }
    overrideAccessorGlobal(...t) {
        for (const e of t) {
            this.ss[e] = true;
        }
    }
    getNodeObserverConfig(t, e) {
        return this.Je[t.tagName]?.[e] ?? this.ts[e];
    }
    getNodeObserver(t, e, i) {
        const n = this.Je[t.tagName]?.[e] ?? this.ts[e];
        let r;
        if (n != null) {
            r = new (n.type ?? ValueAttributeObserver)(t, e, n, i, this.rs);
            if (!r.doNotCache) {
                s.getObserverLookup(t)[e] = r;
            }
            return r;
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
        const n = this.getNodeObserver(t, e, i);
        if (n != null) {
            return n;
        }
        const r = Ls[e];
        if (r !== undefined) {
            return AttributeNSAccessor.forNs(r[1]);
        }
        if (isDataAttribute(t, e, this.svg)) {
            return Bs;
        }
        if (e in t.constructor.prototype) {
            if (this.allowDirtyCheck) {
                return this.os.createProperty(t, e);
            }
            throw createMappedError(652, e);
        } else {
            return new s.SetterObserver(t, e);
        }
    }
}

NodeObserverLocator.inject = [ t.IServiceLocator, rt, s.IDirtyChecker, ks ];

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
    constructor(t, e, s, i) {
        this.type = A | C | B;
        this.v = void 0;
        this.ov = void 0;
        this.ls = void 0;
        this.cs = void 0;
        this.L = false;
        this.P = t;
        this.oL = i;
        this.cf = s;
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
        this.us();
        this.ds();
        this.Ke();
    }
    handleCollectionChange() {
        this.ds();
    }
    handleChange(t, e) {
        this.ds();
    }
    ds() {
        const t = this.v;
        const e = this.P;
        const s = a.call(e, "model") ? e.model : e.value;
        const i = e.type === "radio";
        const n = e.matcher !== void 0 ? e.matcher : defaultMatcher;
        if (i) {
            e.checked = !!n(t, s);
        } else if (t === true) {
            e.checked = true;
        } else {
            let i = false;
            if (isArray(t)) {
                i = t.findIndex((t => !!n(t, s))) !== -1;
            } else if (t instanceof Set) {
                for (const e of t) {
                    if (n(e, s)) {
                        i = true;
                        break;
                    }
                }
            } else if (t instanceof Map) {
                for (const e of t) {
                    const t = e[0];
                    const r = e[1];
                    if (n(t, s) && r === true) {
                        i = true;
                        break;
                    }
                }
            }
            e.checked = i;
        }
    }
    handleEvent() {
        let t = this.ov = this.v;
        const e = this.P;
        const s = a.call(e, "model") ? e.model : e.value;
        const i = e.checked;
        const n = e.matcher !== void 0 ? e.matcher : defaultMatcher;
        if (e.type === "checkbox") {
            if (isArray(t)) {
                const e = t.findIndex((t => !!n(t, s)));
                if (i && e === -1) {
                    t.push(s);
                } else if (!i && e !== -1) {
                    t.splice(e, 1);
                }
                return;
            } else if (t instanceof Set) {
                const e = {};
                let r = e;
                for (const e of t) {
                    if (n(e, s) === true) {
                        r = e;
                        break;
                    }
                }
                if (i && r === e) {
                    t.add(s);
                } else if (!i && r !== e) {
                    t.delete(r);
                }
                return;
            } else if (t instanceof Map) {
                let e;
                for (const i of t) {
                    const t = i[0];
                    if (n(t, s) === true) {
                        e = t;
                        break;
                    }
                }
                t.set(e, i);
                return;
            }
            t = i;
        } else if (i) {
            t = s;
        } else {
            return;
        }
        this.v = t;
        this.Ke();
    }
    M() {
        this.us();
    }
    q() {
        this.ls?.unsubscribe(this);
        this.cs?.unsubscribe(this);
        this.ls = this.cs = void 0;
    }
    Ke() {
        Ds = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Ds);
    }
    us() {
        const t = this.P;
        (this.cs ?? (this.cs = t.$observers?.model ?? t.$observers?.value))?.subscribe(this);
        this.ls?.unsubscribe(this);
        this.ls = void 0;
        if (t.type === "checkbox") {
            (this.ls = getCollectionObserver(this.v, this.oL))?.subscribe(this);
        }
    }
}

mixinNodeObserverUseConfig(CheckedObserver);

s.subscriberCollection(CheckedObserver);

let Ds = void 0;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) {
            throw createMappedError(9994, e);
        }
        e.useTargetObserver(Bs);
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
        this.oL = t.resolve(s.IObserverLocator);
        this.ps = t.resolve(s.INodeObserverLocator);
    }
    bind(t, e, ...s) {
        if (!(this.ps instanceof NodeObserverLocator)) {
            throw createMappedError(9993);
        }
        if (s.length === 0) {
            throw createMappedError(802);
        }
        if (!(e instanceof PropertyBinding) || !(e.mode & R)) {
            throw createMappedError(803);
        }
        const i = this.ps.getNodeObserverConfig(e.target, e.targetProperty);
        if (i == null) {
            throw createMappedError(9992, e);
        }
        const n = this.ps.getNodeObserver(e.target, e.targetProperty, this.oL);
        n.useConfig({
            readonly: i.readonly,
            default: i.default,
            events: s
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
        this.gs = false;
        this.xs = 0;
        this.vs = t.resolve(te);
        this.l = t.resolve(ht);
    }
    attaching(t, e) {
        return this.bs(this.value);
    }
    detaching(e, s) {
        this.gs = true;
        return t.onResolve(this.pending, (() => {
            this.gs = false;
            this.pending = void 0;
            void this.view?.deactivate(e, this.$controller);
        }));
    }
    valueChanged(t, e) {
        if (!this.$controller.isActive) return;
        t = !!t;
        e = !!e;
        if (t !== e) return this.bs(t);
    }
    bs(e) {
        const s = this.view;
        const i = this.$controller;
        const n = this.xs++;
        const isCurrent = () => !this.gs && this.xs === n + 1;
        let r;
        return t.onResolve(this.pending, (() => this.pending = t.onResolve(s?.deactivate(s, i), (() => {
            if (!isCurrent()) {
                return;
            }
            if (e) {
                r = this.view = this.ifView = this.cache && this.ifView != null ? this.ifView : this.vs.create();
            } else {
                r = this.view = this.elseView = this.cache && this.elseView != null ? this.elseView : this.elseFactory?.create();
            }
            if (r == null) {
                return;
            }
            r.setLocation(this.l);
            return t.onResolve(r.activate(r, i, i.scope), (() => {
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
        this.f = t.resolve(te);
    }
    link(t, e, s, i) {
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

const qs = [ "BindingBehavior", "ValueConverter" ];

class Repeat {
    constructor(t, e, s, i, n) {
        this.views = [];
        this.ys = [];
        this.key = null;
        this.ws = new Map;
        this.ks = new Map;
        this.Cs = void 0;
        this.As = false;
        this.Bs = false;
        this.Ss = null;
        this._s = void 0;
        this.Rs = false;
        const r = t.props[0].props[0];
        if (r !== void 0) {
            const {to: t, value: s, command: i} = r;
            if (t === "key") {
                if (i === null) {
                    this.key = s;
                } else if (i === "bind") {
                    this.key = e.parse(s, y);
                } else {
                    throw createMappedError(775, i);
                }
            } else {
                throw createMappedError(776, t);
            }
        }
        this.l = s;
        this.Ts = i;
        this.f = n;
    }
    binding(t, e) {
        const i = this.Ts.bindings;
        const n = i.length;
        let r = void 0;
        let l;
        let h = 0;
        for (;n > h; ++h) {
            r = i[h];
            if (r.target === this && r.targetProperty === "items") {
                l = this.forOf = r.ast;
                this.Is = r;
                let t = l.iterable;
                while (t != null && qs.includes(t.$kind)) {
                    t = t.expression;
                    this.As = true;
                }
                this.Ss = t;
                break;
            }
        }
        this.Es();
        const a = l.declaration;
        if (!(this.Rs = a.$kind === "ArrayDestructuring" || a.$kind === "ObjectDestructuring")) {
            this.local = s.astEvaluate(a, this.$controller.scope, r, null);
        }
    }
    attaching(t, e) {
        this.Ps();
        return this.Ls(t);
    }
    detaching(t, e) {
        this.Es();
        return this.Ms(t);
    }
    unbinding(t, e) {
        this.ks.clear();
        this.ws.clear();
    }
    itemsChanged() {
        if (!this.$controller.isActive) {
            return;
        }
        this.Es();
        this.Ps();
        this.Ds(this.items, void 0);
    }
    handleCollectionChange(t, e) {
        const i = this.$controller;
        if (!i.isActive) {
            return;
        }
        if (this.As) {
            if (this.Bs) {
                return;
            }
            this.Bs = true;
            this.items = s.astEvaluate(this.forOf.iterable, i.scope, this.Is, null);
            this.Bs = false;
            return;
        }
        this.Ps();
        this.Ds(t, e);
    }
    Ds(e, i) {
        const n = this.views;
        this.ys = n.slice();
        const r = n.length;
        const l = this.key;
        const h = l !== null;
        if (h || i === void 0) {
            const t = this.local;
            const e = this._s;
            const a = e.length;
            const c = this.forOf;
            const u = c.declaration;
            const f = this.Is;
            const d = this.Rs;
            i = s.createIndexMap(a);
            let p = 0;
            if (r === 0) {
                for (;p < a; ++p) {
                    i[p] = -2;
                }
            } else if (a === 0) {
                if (d) {
                    for (p = 0; p < r; ++p) {
                        i.deletedIndices.push(p);
                        i.deletedItems.push(s.astEvaluate(u, n[p].scope, f, null));
                    }
                } else {
                    for (p = 0; p < r; ++p) {
                        i.deletedIndices.push(p);
                        i.deletedItems.push(n[p].scope.bindingContext[t]);
                    }
                }
            } else {
                const m = Array(r);
                if (d) {
                    for (p = 0; p < r; ++p) {
                        m[p] = s.astEvaluate(u, n[p].scope, f, null);
                    }
                } else {
                    for (p = 0; p < r; ++p) {
                        m[p] = n[p].scope.bindingContext[t];
                    }
                }
                let g;
                let x;
                let v;
                let b;
                let y = 0;
                const w = r - 1;
                const k = a - 1;
                const C = new Map;
                const A = new Map;
                const B = this.ws;
                const S = this.ks;
                const _ = this.$controller.scope;
                p = 0;
                t: {
                    while (true) {
                        if (h) {
                            g = m[p];
                            x = e[p];
                            v = getKeyValue(B, l, g, getScope(S, g, c, _, f, t, d), f);
                            b = getKeyValue(B, l, x, getScope(S, x, c, _, f, t, d), f);
                        } else {
                            g = v = ensureUnique(m[p], p);
                            x = b = ensureUnique(e[p], p);
                        }
                        if (v !== b) {
                            B.set(g, v);
                            B.set(x, b);
                            break;
                        }
                        ++p;
                        if (p > w || p > k) {
                            break t;
                        }
                    }
                    if (w !== k) {
                        break t;
                    }
                    y = k;
                    while (true) {
                        if (h) {
                            g = m[y];
                            x = e[y];
                            v = getKeyValue(B, l, g, getScope(S, g, c, _, f, t, d), f);
                            b = getKeyValue(B, l, x, getScope(S, x, c, _, f, t, d), f);
                        } else {
                            g = v = ensureUnique(m[p], p);
                            x = b = ensureUnique(e[p], p);
                        }
                        if (v !== b) {
                            B.set(g, v);
                            B.set(x, b);
                            break;
                        }
                        --y;
                        if (p > y) {
                            break t;
                        }
                    }
                }
                const R = p;
                const T = p;
                for (p = T; p <= k; ++p) {
                    if (B.has(x = h ? e[p] : ensureUnique(e[p], p))) {
                        b = B.get(x);
                    } else {
                        b = h ? getKeyValue(B, l, x, getScope(S, x, c, _, f, t, d), f) : x;
                        B.set(x, b);
                    }
                    A.set(b, p);
                }
                for (p = R; p <= w; ++p) {
                    if (B.has(g = h ? m[p] : ensureUnique(m[p], p))) {
                        v = B.get(g);
                    } else {
                        v = h ? getKeyValue(B, l, g, n[p].scope, f) : g;
                    }
                    C.set(v, p);
                    if (A.has(v)) {
                        i[A.get(v)] = p;
                    } else {
                        i.deletedIndices.push(p);
                        i.deletedItems.push(g);
                    }
                }
                for (p = T; p <= k; ++p) {
                    if (!C.has(B.get(h ? e[p] : ensureUnique(e[p], p)))) {
                        i[p] = -2;
                    }
                }
                C.clear();
                A.clear();
            }
        }
        if (i === void 0) {
            const e = t.onResolve(this.Ms(null), (() => this.Ls(null)));
            if (isPromise(e)) {
                e.catch(rethrow);
            }
        } else {
            if (i.deletedIndices.length > 0) {
                const e = t.onResolve(this.qs(i), (() => this.Hs(r, i)));
                if (isPromise(e)) {
                    e.catch(rethrow);
                }
            } else {
                this.Hs(r, i);
            }
        }
    }
    Es() {
        const t = this.$controller.scope;
        let e = this.Fs;
        let i = this.As;
        let n;
        if (i) {
            e = this.Fs = s.astEvaluate(this.Ss, t, this.Is, null) ?? null;
            i = this.As = !m(this.items, e);
        }
        const r = this.Cs;
        if (this.$controller.isActive) {
            n = this.Cs = s.getCollectionObserver(i ? e : this.items);
            if (r !== n) {
                r?.unsubscribe(this);
                n?.subscribe(this);
            }
        } else {
            r?.unsubscribe(this);
            this.Cs = undefined;
        }
    }
    Ps() {
        const {items: t} = this;
        if (isArray(t)) {
            this._s = t;
            return;
        }
        const e = [];
        iterate(t, ((t, s) => {
            e[s] = t;
        }));
        this._s = e;
    }
    Ls(t) {
        let e = void 0;
        let s;
        let i;
        let n;
        const {$controller: r, f: l, local: h, l: a, items: c, ks: u, Is: f, forOf: d, Rs: p} = this;
        const m = r.scope;
        const g = getCount(c);
        const x = this.views = Array(g);
        iterate(c, ((c, v) => {
            i = x[v] = l.create().setLocation(a);
            i.nodes.unlink();
            n = getScope(u, c, d, m, f, h, p);
            setContextualProperties(n.overrideContext, v, g);
            s = i.activate(t ?? i, r, n);
            if (isPromise(s)) {
                (e ?? (e = [])).push(s);
            }
        }));
        if (e !== void 0) {
            return e.length === 1 ? e[0] : Promise.all(e);
        }
    }
    Ms(t) {
        let e = void 0;
        let s;
        let i;
        let n = 0;
        const {views: r, $controller: l} = this;
        const h = r.length;
        for (;h > n; ++n) {
            i = r[n];
            i.release();
            s = i.deactivate(t ?? i, l);
            if (isPromise(s)) {
                (e ?? (e = [])).push(s);
            }
        }
        if (e !== void 0) {
            return e.length === 1 ? e[0] : Promise.all(e);
        }
    }
    qs(t) {
        let e = void 0;
        let s;
        let i;
        const {$controller: n, views: r} = this;
        const l = t.deletedIndices.slice().sort(compareNumber);
        const h = l.length;
        let a = 0;
        for (;h > a; ++a) {
            i = r[l[a]];
            i.release();
            s = i.deactivate(i, n);
            if (isPromise(s)) {
                (e ?? (e = [])).push(s);
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
    Hs(t, e) {
        let i = void 0;
        let n;
        let r;
        let l;
        let h = 0;
        const {$controller: a, f: c, local: u, _s: f, l: d, views: p, Rs: m, Is: g, ks: x, ys: v, forOf: b} = this;
        const y = e.length;
        for (;y > h; ++h) {
            if (e[h] === -2) {
                r = c.create();
                p.splice(h, 0, r);
            }
        }
        if (p.length !== y) {
            throw createMappedError(814, [ p.length, y ]);
        }
        const w = a.scope;
        const k = e.length;
        let C = 0;
        h = 0;
        for (;h < e.length; ++h) {
            if ((C = e[h]) !== -2) {
                p[h] = v[C];
            }
        }
        const A = longestIncreasingSubsequence(e);
        const B = A.length;
        const S = b.declaration;
        let _;
        let R = B - 1;
        h = k - 1;
        for (;h >= 0; --h) {
            r = p[h];
            _ = p[h + 1];
            r.nodes.link(_?.nodes ?? d);
            if (e[h] === -2) {
                l = getScope(x, f[h], b, w, g, u, m);
                setContextualProperties(l.overrideContext, h, k);
                r.setLocation(d);
                n = r.activate(r, a, l);
                if (isPromise(n)) {
                    (i ?? (i = [])).push(n);
                }
            } else if (R < 0 || B === 1 || h !== A[R]) {
                if (m) {
                    s.astAssign(S, r.scope, g, f[h]);
                } else {
                    r.scope.bindingContext[u] = f[h];
                }
                setContextualProperties(r.scope.overrideContext, h, k);
                r.nodes.insertBefore(r.location);
            } else {
                if (m) {
                    s.astAssign(S, r.scope, g, f[h]);
                } else {
                    r.scope.bindingContext[u] = f[h];
                }
                if (t !== k) {
                    setContextualProperties(r.scope.overrideContext, h, k);
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
            for (let s = 0, i = e.length; s < i; ++s) {
                if (e[s].accept(t) === true) {
                    return true;
                }
            }
        }
    }
}

Repeat.inject = [ _e, s.IExpressionParser, ht, es, te ];

__decorate([ bindable ], Repeat.prototype, "items", void 0);

templateController("repeat")(Repeat);

let Hs = 16;

let Fs = new Int32Array(Hs);

let Os = new Int32Array(Hs);

function longestIncreasingSubsequence(t) {
    const e = t.length;
    if (e > Hs) {
        Hs = e;
        Fs = new Int32Array(e);
        Os = new Int32Array(e);
    }
    let s = 0;
    let i = 0;
    let n = 0;
    let r = 0;
    let l = 0;
    let h = 0;
    let a = 0;
    let c = 0;
    for (;r < e; r++) {
        i = t[r];
        if (i !== -2) {
            l = Fs[s];
            n = t[l];
            if (n !== -2 && n < i) {
                Os[r] = l;
                Fs[++s] = r;
                continue;
            }
            h = 0;
            a = s;
            while (h < a) {
                c = h + a >> 1;
                n = t[Fs[c]];
                if (n !== -2 && n < i) {
                    h = c + 1;
                } else {
                    a = c;
                }
            }
            n = t[Fs[h]];
            if (i < n || n === -2) {
                if (h > 0) {
                    Os[r] = Fs[h - 1];
                }
                Fs[h] = r;
            }
        }
    }
    r = ++s;
    const u = new Int32Array(r);
    i = Fs[s - 1];
    while (s-- > 0) {
        u[s] = i;
        i = Os[i];
    }
    while (r-- > 0) Fs[r] = 0;
    return u;
}

const setContextualProperties = (t, e, s) => {
    const i = e === 0;
    const n = e === s - 1;
    const r = e % 2 === 0;
    t.$index = e;
    t.$first = i;
    t.$last = n;
    t.$middle = !i && !n;
    t.$even = r;
    t.$odd = !r;
    t.$length = s;
};

const Vs = h.toString;

const getCount = t => {
    switch (Vs.call(t)) {
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
    switch (Vs.call(t)) {
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
    const s = t.length;
    let i = 0;
    for (;i < s; ++i) {
        e(t[i], i, t);
    }
};

const $map = (t, e) => {
    let s = -0;
    let i;
    for (i of t.entries()) {
        e(i, s++, t);
    }
};

const $set = (t, e) => {
    let s = 0;
    let i;
    for (i of t.keys()) {
        e(i, s++, t);
    }
};

const $number = (t, e) => {
    let s = 0;
    for (;s < t; ++s) {
        e(s, s, t);
    }
};

const getKeyValue = (t, e, i, n, r) => {
    let l = t.get(i);
    if (l === void 0) {
        if (typeof e === "string") {
            l = i[e];
        } else {
            l = s.astEvaluate(e, n, r, null);
        }
        t.set(i, l);
    }
    return l;
};

const getScope = (t, e, i, n, r, l, h) => {
    let a = t.get(e);
    if (a === void 0) {
        if (h) {
            s.astAssign(i.declaration, a = s.Scope.fromParent(n, new s.BindingContext), r, e);
        } else {
            a = s.Scope.fromParent(n, new s.BindingContext(l, e));
        }
        t.set(e, a);
    }
    return a;
};

const ensureUnique = (t, e) => {
    const s = typeof t;
    switch (s) {
      case "object":
        if (t !== null) return t;

      case "string":
      case "number":
      case "bigint":
      case "undefined":
      case "boolean":
        return `${e}${s}${t}`;

      default:
        return t;
    }
};

const compareNumber = (t, e) => t - e;

class With {
    constructor() {
        this.view = t.resolve(te).create().setLocation(t.resolve(ht));
    }
    valueChanged(t, e) {
        const i = this.$controller;
        const n = this.view.bindings;
        let r;
        let l = 0, h = 0;
        if (i.isActive && n != null) {
            r = s.Scope.fromParent(i.scope, t === void 0 ? {} : t);
            for (h = n.length; h > l; ++l) {
                n[l].bind(r);
            }
        }
    }
    attaching(t, e) {
        const {$controller: i, value: n} = this;
        const r = s.Scope.fromParent(i.scope, n === void 0 ? {} : n);
        return this.view.activate(t, i, r);
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

exports.Switch = class Switch {
    constructor() {
        this.cases = [];
        this.activeCases = [];
        this.promise = void 0;
        this.f = t.resolve(te);
        this.l = t.resolve(ht);
    }
    link(t, e, s, i) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(t, e) {
        const s = this.view;
        const i = this.$controller;
        this.queue((() => s.activate(t, i, i.scope)));
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
        this.queue((() => this.Os(t)));
    }
    Os(e) {
        const s = e.isMatch(this.value);
        const i = this.activeCases;
        const n = i.length;
        if (!s) {
            if (n > 0 && i[0].id === e.id) {
                return this.Vs(null);
            }
            return;
        }
        if (n > 0 && i[0].id < e.id) {
            return;
        }
        const r = [];
        let l = e.fallThrough;
        if (!l) {
            r.push(e);
        } else {
            const t = this.cases;
            const s = t.indexOf(e);
            for (let e = s, i = t.length; e < i && l; e++) {
                const s = t[e];
                r.push(s);
                l = s.fallThrough;
            }
        }
        return t.onResolve(this.Vs(null, r), (() => {
            this.activeCases = r;
            return this.Ns(null);
        }));
    }
    swap(e, s) {
        const i = [];
        let n = false;
        for (const t of this.cases) {
            if (n || t.isMatch(s)) {
                i.push(t);
                n = t.fallThrough;
            }
            if (i.length > 0 && !n) {
                break;
            }
        }
        const r = this.defaultCase;
        if (i.length === 0 && r !== void 0) {
            i.push(r);
        }
        return t.onResolve(this.activeCases.length > 0 ? this.Vs(e, i) : void 0, (() => {
            this.activeCases = i;
            if (i.length === 0) {
                return;
            }
            return this.Ns(e);
        }));
    }
    Ns(e) {
        const s = this.$controller;
        if (!s.isActive) {
            return;
        }
        const i = this.activeCases;
        const n = i.length;
        if (n === 0) {
            return;
        }
        const r = s.scope;
        if (n === 1) {
            return i[0].activate(e, r);
        }
        return t.onResolveAll(...i.map((t => t.activate(e, r))));
    }
    Vs(e, s = []) {
        const i = this.activeCases;
        const n = i.length;
        if (n === 0) {
            return;
        }
        if (n === 1) {
            const t = i[0];
            if (!s.includes(t)) {
                i.length = 0;
                return t.deactivate(e);
            }
            return;
        }
        return t.onResolve(t.onResolveAll(...i.reduce(((t, i) => {
            if (!s.includes(i)) {
                t.push(i.deactivate(e));
            }
            return t;
        }), [])), (() => {
            i.length = 0;
        }));
    }
    queue(e) {
        const s = this.promise;
        let i = void 0;
        i = this.promise = t.onResolve(t.onResolve(s, e), (() => {
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

__decorate([ bindable ], exports.Switch.prototype, "value", void 0);

exports.Switch = __decorate([ templateController("switch") ], exports.Switch);

let Ns = 0;

exports.Case = class Case {
    constructor() {
        this.id = ++Ns;
        this.fallThrough = false;
        this.view = void 0;
        this.f = t.resolve(te);
        this.rs = t.resolve(s.IObserverLocator);
        this.l = t.resolve(ht);
        this.$s = t.resolve(t.ILogger).scopeTo(`${this.constructor.name}-#${this.id}`);
    }
    link(t, e, s, i) {
        const n = t.parent;
        const r = n?.viewModel;
        if (r instanceof exports.Switch) {
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
        this.$s.debug("isMatch()");
        const e = this.value;
        if (isArray(e)) {
            if (this.Cs === void 0) {
                this.Cs = this.Ws(e);
            }
            return e.includes(t);
        }
        return e === t;
    }
    valueChanged(t, e) {
        if (isArray(t)) {
            this.Cs?.unsubscribe(this);
            this.Cs = this.Ws(t);
        } else if (this.Cs !== void 0) {
            this.Cs.unsubscribe(this);
        }
        this.$switch.caseChanged(this);
    }
    handleCollectionChange() {
        this.$switch.caseChanged(this);
    }
    activate(t, e) {
        let s = this.view;
        if (s === void 0) {
            s = this.view = this.f.create().setLocation(this.l);
        }
        if (s.isActive) {
            return;
        }
        return s.activate(t ?? s, this.$controller, e);
    }
    deactivate(t) {
        const e = this.view;
        if (e === void 0 || !e.isActive) {
            return;
        }
        return e.deactivate(t ?? e, this.$controller);
    }
    dispose() {
        this.Cs?.unsubscribe(this);
        this.view?.dispose();
        this.view = void 0;
    }
    linkToSwitch(t) {
        t.cases.push(this);
    }
    Ws(t) {
        const e = this.rs.getArrayObserver(t);
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

__decorate([ bindable ], exports.Case.prototype, "value", void 0);

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
    mode: S
}) ], exports.Case.prototype, "fallThrough", void 0);

exports.Case = __decorate([ templateController("case") ], exports.Case);

exports.DefaultCase = class DefaultCase extends exports.Case {
    linkToSwitch(t) {
        if (t.defaultCase !== void 0) {
            throw createMappedError(816);
        }
        t.defaultCase = this;
    }
};

exports.DefaultCase = __decorate([ templateController("default-case") ], exports.DefaultCase);

exports.PromiseTemplateController = class PromiseTemplateController {
    constructor() {
        this.preSettledTask = null;
        this.postSettledTask = null;
        this.f = t.resolve(te);
        this.l = t.resolve(ht);
        this.p = t.resolve(rt);
        this.logger = t.resolve(t.ILogger).scopeTo("promise.resolve");
    }
    link(t, e, s, i) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(e, i) {
        const n = this.view;
        const r = this.$controller;
        return t.onResolve(n.activate(e, r, this.viewScope = s.Scope.fromParent(r.scope, {})), (() => this.swap(e)));
    }
    valueChanged(t, e) {
        if (!this.$controller.isActive) {
            return;
        }
        this.swap(null);
    }
    swap(e) {
        const s = this.value;
        if (!isPromise(s)) {
            return;
        }
        const i = this.p.domWriteQueue;
        const r = this.fulfilled;
        const l = this.rejected;
        const h = this.pending;
        const a = this.viewScope;
        let c;
        const u = {
            reusable: false
        };
        const $swap = () => {
            void t.onResolveAll(c = (this.preSettledTask = i.queueTask((() => t.onResolveAll(r?.deactivate(e), l?.deactivate(e), h?.activate(e, a))), u)).result.catch((t => {
                if (!(t instanceof n.TaskAbortError)) throw t;
            })), s.then((n => {
                if (this.value !== s) {
                    return;
                }
                const fulfill = () => {
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => t.onResolveAll(h?.deactivate(e), l?.deactivate(e), r?.activate(e, a, n))), u)).result;
                };
                if (this.preSettledTask.status === k) {
                    void c.then(fulfill);
                } else {
                    this.preSettledTask.cancel();
                    fulfill();
                }
            }), (n => {
                if (this.value !== s) {
                    return;
                }
                const reject = () => {
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => t.onResolveAll(h?.deactivate(e), r?.deactivate(e), l?.activate(e, a, n))), u)).result;
                };
                if (this.preSettledTask.status === k) {
                    void c.then(reject);
                } else {
                    this.preSettledTask.cancel();
                    reject();
                }
            })));
        };
        if (this.postSettledTask?.status === k) {
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

__decorate([ bindable ], exports.PromiseTemplateController.prototype, "value", void 0);

exports.PromiseTemplateController = __decorate([ templateController("promise") ], exports.PromiseTemplateController);

exports.PendingTemplateController = class PendingTemplateController {
    constructor() {
        this.view = void 0;
        this.f = t.resolve(te);
        this.l = t.resolve(ht);
    }
    link(t, e, s, i) {
        getPromiseController(t).pending = this;
    }
    activate(t, e) {
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
    detaching(t) {
        return this.deactivate(t);
    }
    dispose() {
        this.view?.dispose();
        this.view = void 0;
    }
};

__decorate([ bindable({
    mode: _
}) ], exports.PendingTemplateController.prototype, "value", void 0);

exports.PendingTemplateController = __decorate([ templateController(w) ], exports.PendingTemplateController);

exports.FulfilledTemplateController = class FulfilledTemplateController {
    constructor() {
        this.view = void 0;
        this.f = t.resolve(te);
        this.l = t.resolve(ht);
    }
    link(t, e, s, i) {
        getPromiseController(t).fulfilled = this;
    }
    activate(t, e, s) {
        this.value = s;
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
    detaching(t, e) {
        return this.deactivate(t);
    }
    dispose() {
        this.view?.dispose();
        this.view = void 0;
    }
};

__decorate([ bindable({
    mode: R
}) ], exports.FulfilledTemplateController.prototype, "value", void 0);

exports.FulfilledTemplateController = __decorate([ templateController("then") ], exports.FulfilledTemplateController);

exports.RejectedTemplateController = class RejectedTemplateController {
    constructor() {
        this.view = void 0;
        this.f = t.resolve(te);
        this.l = t.resolve(ht);
    }
    link(t, e, s, i) {
        getPromiseController(t).rejected = this;
    }
    activate(t, e, s) {
        this.value = s;
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
    detaching(t, e) {
        return this.deactivate(t);
    }
    dispose() {
        this.view?.dispose();
        this.view = void 0;
    }
};

__decorate([ bindable({
    mode: R
}) ], exports.RejectedTemplateController.prototype, "value", void 0);

exports.RejectedTemplateController = __decorate([ templateController("catch") ], exports.RejectedTemplateController);

function getPromiseController(t) {
    const e = t.parent;
    const s = e?.viewModel;
    if (s instanceof exports.PromiseTemplateController) {
        return s;
    }
    throw createMappedError(813);
}

let $s = class PromiseAttributePattern {
    "promise.resolve"(t, e, s) {
        return new AttrSyntax(t, e, "promise", "bind");
    }
};

$s = __decorate([ attributePattern({
    pattern: "promise.resolve",
    symbols: ""
}) ], $s);

let Ws = class FulfilledAttributePattern {
    then(t, e, s) {
        return new AttrSyntax(t, e, "then", "from-view");
    }
};

Ws = __decorate([ attributePattern({
    pattern: "then",
    symbols: ""
}) ], Ws);

let js = class RejectedAttributePattern {
    catch(t, e, s) {
        return new AttrSyntax(t, e, "catch", "from-view");
    }
};

js = __decorate([ attributePattern({
    pattern: "catch",
    symbols: ""
}) ], js);

class Focus {
    constructor() {
        this.js = false;
        this.zs = t.resolve(ot);
        this.p = t.resolve(rt);
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) {
            this.Us();
        } else {
            this.js = true;
        }
    }
    attached() {
        if (this.js) {
            this.js = false;
            this.Us();
        }
        this.zs.addEventListener("focus", this);
        this.zs.addEventListener("blur", this);
    }
    detaching() {
        const t = this.zs;
        t.removeEventListener("focus", this);
        t.removeEventListener("blur", this);
    }
    handleEvent(t) {
        if (t.type === "focus") {
            this.value = true;
        } else if (!this.Gs) {
            this.value = false;
        }
    }
    Us() {
        const t = this.zs;
        const e = this.Gs;
        const s = this.value;
        if (s && !e) {
            t.focus();
        } else if (!s && e) {
            t.blur();
        }
    }
    get Gs() {
        return this.zs === this.p.document.activeElement;
    }
}

Focus.inject = [ ot, rt ];

__decorate([ bindable({
    mode: T
}) ], Focus.prototype, "value", void 0);

customAttribute("focus")(Focus);

class Portal {
    constructor() {
        this.position = "beforeend";
        this.strict = false;
        const e = t.resolve(te);
        const s = t.resolve(ht);
        const i = t.resolve(rt);
        this.p = i;
        this.Ks = i.document.createElement("div");
        (this.view = e.create()).setLocation(this.Xs = createLocation(i));
        setEffectiveParentNode(this.view.nodes, s);
    }
    attaching(t) {
        if (this.callbackContext == null) {
            this.callbackContext = this.$controller.scope.bindingContext;
        }
        const e = this.Ks = this.Qs();
        this.Ys(e, this.position);
        return this.Zs(t, e);
    }
    detaching(t) {
        return this.Js(t, this.Ks);
    }
    targetChanged() {
        const {$controller: e} = this;
        if (!e.isActive) {
            return;
        }
        const s = this.Qs();
        if (this.Ks === s) {
            return;
        }
        this.Ks = s;
        const i = t.onResolve(this.Js(null, s), (() => {
            this.Ys(s, this.position);
            return this.Zs(null, s);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    positionChanged() {
        const {$controller: e, Ks: s} = this;
        if (!e.isActive) {
            return;
        }
        const i = t.onResolve(this.Js(null, s), (() => {
            this.Ys(s, this.position);
            return this.Zs(null, s);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    Zs(e, s) {
        const {activating: i, callbackContext: n, view: r} = this;
        return t.onResolve(i?.call(n, s, r), (() => this.ti(e, s)));
    }
    ti(e, s) {
        const {$controller: i, view: n} = this;
        if (e === null) {
            n.nodes.insertBefore(this.Xs);
        } else {
            return t.onResolve(n.activate(e ?? n, i, i.scope), (() => this.ei(s)));
        }
        return this.ei(s);
    }
    ei(t) {
        const {activated: e, callbackContext: s, view: i} = this;
        return e?.call(s, t, i);
    }
    Js(e, s) {
        const {deactivating: i, callbackContext: n, view: r} = this;
        return t.onResolve(i?.call(n, s, r), (() => this.si(e, s)));
    }
    si(e, s) {
        const {$controller: i, view: n} = this;
        if (e === null) {
            n.nodes.remove();
        } else {
            return t.onResolve(n.deactivate(e, i), (() => this.ii(s)));
        }
        return this.ii(s);
    }
    ii(e) {
        const {deactivated: s, callbackContext: i, view: n} = this;
        return t.onResolve(s?.call(i, e, n), (() => this.ni()));
    }
    Qs() {
        const t = this.p;
        const e = t.document;
        let s = this.target;
        let i = this.renderContext;
        if (s === "") {
            if (this.strict) {
                throw createMappedError(811);
            }
            return e.body;
        }
        if (isString(s)) {
            let n = e;
            if (isString(i)) {
                i = e.querySelector(i);
            }
            if (i instanceof t.Node) {
                n = i;
            }
            s = n.querySelector(s);
        }
        if (s instanceof t.Node) {
            return s;
        }
        if (s == null) {
            if (this.strict) {
                throw createMappedError(812);
            }
            return e.body;
        }
        return s;
    }
    ni() {
        this.Xs.remove();
        this.Xs.$start.remove();
    }
    Ys(t, e) {
        const s = this.Xs;
        const i = s.$start;
        const n = t.parentNode;
        const r = [ i, s ];
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

exports.AuSlot = class AuSlot {
    constructor() {
        this.ri = null;
        this.oi = null;
        this.te = false;
        this.expose = null;
        this.slotchange = null;
        this.li = new Set;
        this.Cs = null;
        const e = t.resolve(ss);
        const s = t.resolve(ht);
        const i = t.resolve(_e);
        const n = t.resolve(He);
        const r = i.auSlot;
        const l = e.instruction?.projections?.[r.name];
        const h = e.controller.container;
        let a;
        let c;
        this.name = r.name;
        if (l == null) {
            c = h.createChild({
                inheritParentResources: true
            });
            a = n.getViewFactory(r.fallback, c);
            this.hi = false;
        } else {
            c = h.createChild();
            c.useResources(e.parent.controller.container);
            registerResolver(c, ss, new t.InstanceProvider(void 0, e.parent));
            a = n.getViewFactory(l, c);
            this.hi = true;
            this.ai = h.getAll(ne, false)?.filter((t => t.slotName === "*" || t.slotName === r.name)) ?? t.emptyArray;
        }
        this.ui = (this.ai ?? (this.ai = t.emptyArray)).length > 0;
        this.fi = e;
        this.view = a.create().setLocation(this.l = s);
    }
    get nodes() {
        const t = [];
        const e = this.l;
        let s = e.$start.nextSibling;
        while (s != null && s !== e) {
            if (s.nodeType !== 8) {
                t.push(s);
            }
            s = s.nextSibling;
        }
        return t;
    }
    subscribe(t) {
        this.li.add(t);
    }
    unsubscribe(t) {
        this.li.delete(t);
    }
    binding(t, e) {
        this.ri = this.$controller.scope.parent;
        let i;
        if (this.hi) {
            i = this.fi.controller.scope.parent;
            (this.oi = s.Scope.fromParent(i, i.bindingContext)).overrideContext.$host = this.expose ?? this.ri.bindingContext;
        }
    }
    attaching(e, s) {
        return t.onResolve(this.view.activate(e, this.$controller, this.hi ? this.oi : this.ri), (() => {
            if (this.ui) {
                this.ai.forEach((t => t.watch(this)));
                this.us();
                this.di();
                this.te = true;
            }
        }));
    }
    detaching(t, e) {
        this.te = false;
        this.pi();
        this.ai.forEach((t => t.unwatch(this)));
        return this.view.deactivate(t, this.$controller);
    }
    exposeChanged(t) {
        if (this.hi && this.oi != null) {
            this.oi.overrideContext.$host = t;
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
    us() {
        if (this.Cs != null) {
            return;
        }
        const t = this.l;
        const e = t.parentElement;
        if (e == null) {
            return;
        }
        (this.Cs = createMutationObserver(e, (e => {
            if (isMutationWithinLocation(t, e)) {
                this.di();
            }
        }))).observe(e, {
            childList: true
        });
    }
    pi() {
        this.Cs?.disconnect();
        this.Cs = null;
    }
    di() {
        const t = this.nodes;
        const e = new Set(this.li);
        let s;
        if (this.te) {
            this.slotchange?.call(void 0, this.name, t);
        }
        for (s of e) {
            s.handleSlotChange(this, t);
        }
    }
};

__decorate([ bindable ], exports.AuSlot.prototype, "expose", void 0);

__decorate([ bindable ], exports.AuSlot.prototype, "slotchange", void 0);

exports.AuSlot = __decorate([ customElement({
    name: "au-slot",
    template: null,
    containerless: true
}) ], exports.AuSlot);

const comparePosition = (t, e) => t.compareDocumentPosition(e);

const isMutationWithinLocation = (t, e) => {
    for (const {addedNodes: s, removedNodes: i, nextSibling: n} of e) {
        let e = 0;
        let r = s.length;
        let l;
        for (;e < r; ++e) {
            l = s[e];
            if (comparePosition(t.$start, l) === 4 && comparePosition(t, l) === 2) {
                return true;
            }
        }
        if (i.length > 0) {
            if (n != null && comparePosition(t.$start, n) === 4 && comparePosition(t, n) === 2) {
                return true;
            }
        }
    }
};

class AuCompose {
    constructor() {
        this.scopeBehavior = "auto";
        this.mi = void 0;
        this.c = t.resolve(t.IContainer);
        this.parent = t.resolve(es);
        this.host = t.resolve(ot);
        this.l = t.resolve(ht);
        this.p = t.resolve(rt);
        this.r = t.resolve(He);
        this.gi = t.resolve(_e);
        this.xi = t.resolve(t.transient(CompositionContextFactory));
        this.vt = t.resolve(Re);
        this.dt = t.resolve(ss);
        this.ep = t.resolve(s.IExpressionParser);
        this.oL = t.resolve(s.IObserverLocator);
    }
    get composing() {
        return this.vi;
    }
    get composition() {
        return this.mi;
    }
    attaching(e, s) {
        return this.vi = t.onResolve(this.queue(new ChangeInfo(this.template, this.component, this.model, void 0), e), (t => {
            if (this.xi.bi(t)) {
                this.vi = void 0;
            }
        }));
    }
    detaching(e) {
        const s = this.mi;
        const i = this.vi;
        this.xi.invalidate();
        this.mi = this.vi = void 0;
        return t.onResolve(i, (() => s?.deactivate(e)));
    }
    propertyChanged(e) {
        if (e === "composing" || e === "composition") return;
        if (e === "model" && this.mi != null) {
            this.mi.update(this.model);
            return;
        }
        this.vi = t.onResolve(this.vi, (() => t.onResolve(this.queue(new ChangeInfo(this.template, this.component, this.model, e), void 0), (t => {
            if (this.xi.bi(t)) {
                this.vi = void 0;
            }
        }))));
    }
    queue(e, s) {
        const i = this.xi;
        const n = this.mi;
        return t.onResolve(i.create(e), (e => {
            if (i.bi(e)) {
                return t.onResolve(this.compose(e), (r => {
                    if (i.bi(e)) {
                        return t.onResolve(r.activate(s), (() => {
                            if (i.bi(e)) {
                                this.mi = r;
                                return t.onResolve(n?.deactivate(s), (() => e));
                            } else {
                                return t.onResolve(r.controller.deactivate(r.controller, this.$controller), (() => {
                                    r.controller.dispose();
                                    return e;
                                }));
                            }
                        }));
                    }
                    r.controller.dispose();
                    return e;
                }));
            }
            return e;
        }));
    }
    compose(e) {
        let i;
        const {yi: n, wi: r, ki: l} = e.change;
        const {c: h, host: a, $controller: c, l: u, gi: f} = this;
        const d = this.getDef(r);
        const p = h.createChild();
        let m;
        if (d !== null) {
            m = this.p.document.createElement(d.name);
            if (u == null) {
                a.appendChild(m);
            } else {
                u.parentNode.insertBefore(m, u);
            }
            i = this.Ci(p, r, m);
        } else {
            m = u ?? a;
            i = this.Ci(p, r, m);
        }
        const compose = () => {
            if (d !== null) {
                const s = f.captures ?? t.emptyArray;
                const n = d.capture;
                const [r, l] = s.reduce(((t, e) => {
                    const s = !(e.target in d.bindables) && (n === true || isFunction(n) && !!n(e.target));
                    t[s ? 0 : 1].push(e);
                    return t;
                }), [ [], [] ]);
                const h = d.containerless ? convertToRenderLocation(m) : null;
                const a = Controller.$el(p, i, m, {
                    projections: f.projections,
                    captures: r
                }, d, h);
                const u = new HydrationContext(c, {
                    projections: null,
                    captures: l
                }, this.dt.parent);
                const removeCompositionHost = () => {
                    if (h == null) {
                        m.remove();
                    } else {
                        let t = h.$start.nextSibling;
                        let e = null;
                        while (t !== null && t !== h) {
                            e = t.nextSibling;
                            t.remove();
                            t = e;
                        }
                        h.$start?.remove();
                        h.remove();
                    }
                };
                const g = SpreadBinding.create(u, m, d, this.r, this.vt, this.p, this.ep, this.oL);
                g.forEach((t => a.addBinding(t)));
                return new CompositionController(a, (t => a.activate(t ?? a, c, c.scope.parent)), (e => t.onResolve(a.deactivate(e ?? a, c), removeCompositionHost)), (t => i.activate?.(t)), e);
            } else {
                const t = CustomElementDefinition.create({
                    name: St.generateName(),
                    template: n
                });
                const r = this.r.getViewFactory(t, p);
                const l = Controller.$view(r, c);
                const h = this.scopeBehavior === "auto" ? s.Scope.fromParent(this.parent.scope, i) : s.Scope.create(i);
                if (isRenderLocation(m)) {
                    l.setLocation(m);
                } else {
                    l.setHost(m);
                }
                return new CompositionController(l, (t => l.activate(t ?? l, c, h)), (t => l.deactivate(t ?? l, c)), (t => i.activate?.(t)), e);
            }
        };
        if ("activate" in i) {
            return t.onResolve(i.activate(l), (() => compose()));
        } else {
            return compose();
        }
    }
    Ci(e, s, i) {
        if (s == null) {
            return new EmptyComponent;
        }
        if (typeof s === "object") {
            return s;
        }
        const n = this.p;
        const r = isRenderLocation(i);
        registerHostNode(e, n, r ? null : i);
        registerResolver(e, ht, new t.InstanceProvider("IRenderLocation", r ? i : null));
        const l = e.invoke(s);
        registerResolver(e, s, new t.InstanceProvider("au-compose.component", l));
        return l;
    }
    getDef(t) {
        const e = isFunction(t) ? t : t?.constructor;
        return St.isType(e) ? St.getDefinition(e) : null;
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
    mode: R
}) ], AuCompose.prototype, "composing", null);

__decorate([ bindable({
    mode: R
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
    bi(t) {
        return t.id === this.id;
    }
    create(e) {
        return t.onResolve(e.load(), (t => new CompositionContext(++this.id, t)));
    }
    invalidate() {
        this.id++;
    }
}

class ChangeInfo {
    constructor(t, e, s, i) {
        this.yi = t;
        this.wi = e;
        this.ki = s;
        this.Ai = i;
    }
    load() {
        if (isPromise(this.yi) || isPromise(this.wi)) {
            return Promise.all([ this.yi, this.wi ]).then((([t, e]) => new LoadedChangeInfo(t, e, this.ki, this.Ai)));
        } else {
            return new LoadedChangeInfo(this.yi, this.wi, this.ki, this.Ai);
        }
    }
}

class LoadedChangeInfo {
    constructor(t, e, s, i) {
        this.yi = t;
        this.wi = e;
        this.ki = s;
        this.Ai = i;
    }
}

class CompositionContext {
    constructor(t, e) {
        this.id = t;
        this.change = e;
    }
}

class CompositionController {
    constructor(t, e, s, i, n) {
        this.controller = t;
        this.start = e;
        this.stop = s;
        this.update = i;
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

const zs = /*@__PURE__*/ z("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw createMappedError(99, "sanitize");
    }
})));

class SanitizeValueConverter {
    constructor() {
        this.Bi = t.resolve(zs);
    }
    toView(t) {
        if (t == null) {
            return null;
        }
        return this.Bi.sanitize(t);
    }
}

valueConverter("sanitize")(SanitizeValueConverter);

const Us = /*@__PURE__*/ z("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const Gs = {};

class TemplateElementFactory {
    constructor() {
        this.p = t.resolve(rt);
        this.yi = this.t();
    }
    t() {
        return this.p.document.createElement("template");
    }
    createTemplate(t) {
        if (isString(t)) {
            let e = Gs[t];
            if (e === void 0) {
                const s = this.yi;
                s.innerHTML = t;
                const i = s.content.firstElementChild;
                if (needsWrapping(i)) {
                    this.yi = this.t();
                    e = s;
                } else {
                    s.content.removeChild(i);
                    e = i;
                }
                Gs[t] = e;
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
            const s = t.previousSibling;
            if (s != null) {
                switch (s.nodeType) {
                  case 3:
                    return s.textContent.trim().length > 0;
                }
            }
            const i = t.nextSibling;
            if (i != null) {
                switch (i.nodeType) {
                  case 3:
                    return i.textContent.trim().length > 0;
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
        t.register(U(this, this), G(this, Re));
    }
    compile(e, s, i) {
        const n = CustomElementDefinition.getOrCreate(e);
        if (n.template === null || n.template === void 0) {
            return n;
        }
        if (n.needsCompile === false) {
            return n;
        }
        i ?? (i = Ys);
        const r = new CompilationContext(e, s, i, null, null, void 0);
        const l = isString(n.template) || !e.enhance ? r.Si.createTemplate(n.template) : n.template;
        const h = l.nodeName === Ks && l.content != null;
        const a = h ? l.content : l;
        const c = s.get(allResources(ri));
        const u = c.length;
        let f = 0;
        if (u > 0) {
            while (u > f) {
                c[f].compiling?.(l);
                ++f;
            }
        }
        if (l.hasAttribute(ni)) {
            throw createMappedError(701, n);
        }
        this._i(a, r);
        this.Ri(a, r);
        return CustomElementDefinition.create({
            ...e,
            name: e.name || At(),
            dependencies: (e.dependencies ?? t.emptyArray).concat(r.deps ?? t.emptyArray),
            instructions: r.rows,
            surrogates: h ? this.Ti(l, r) : t.emptyArray,
            template: l,
            hasSlots: r.hasSlot,
            needsCompile: false
        });
    }
    compileSpread(e, s, i, n, r) {
        const l = new CompilationContext(e, i, Ys, null, null, void 0);
        const h = [];
        const a = r ?? l.Ii(n.nodeName.toLowerCase());
        const c = a !== null;
        const u = l.ep;
        const f = s.length;
        let d = 0;
        let p;
        let m = null;
        let g;
        let v;
        let b;
        let y;
        let w;
        let k = null;
        let C;
        let A;
        let B;
        let S;
        for (;f > d; ++d) {
            p = s[d];
            B = p.target;
            S = p.rawValue;
            k = l.Ei(p);
            if (k !== null && k.type === xs) {
                Js.node = n;
                Js.attr = p;
                Js.bindable = null;
                Js.def = null;
                h.push(k.build(Js, l.ep, l.m));
                continue;
            }
            m = l.Pi(B);
            if (m !== null) {
                if (m.isTemplateController) {
                    throw createMappedError(9998, B);
                }
                b = BindablesInfo.from(m, true);
                A = m.noMultiBindings === false && k === null && hasInlineBindings(S);
                if (A) {
                    v = this.Li(n, S, m, l);
                } else {
                    w = b.primary;
                    if (k === null) {
                        C = u.parse(S, x);
                        v = [ C === null ? new SetPropertyInstruction(S, w.name) : new InterpolationInstruction(C, w.name) ];
                    } else {
                        Js.node = n;
                        Js.attr = p;
                        Js.bindable = w;
                        Js.def = m;
                        v = [ k.build(Js, l.ep, l.m) ];
                    }
                }
                (g ?? (g = [])).push(new HydrateAttributeInstruction(this.resolveResources ? m : m.name, m.aliases != null && m.aliases.includes(B) ? B : void 0, v));
                continue;
            }
            if (k === null) {
                C = u.parse(S, x);
                if (c) {
                    b = BindablesInfo.from(a, false);
                    y = b.attrs[B];
                    if (y !== void 0) {
                        C = u.parse(S, x);
                        h.push(new SpreadElementPropBindingInstruction(C == null ? new SetPropertyInstruction(S, y.name) : new InterpolationInstruction(C, y.name)));
                        continue;
                    }
                }
                if (C != null) {
                    h.push(new InterpolationInstruction(C, l.m.map(n, B) ?? t.camelCase(B)));
                } else {
                    switch (B) {
                      case "class":
                        h.push(new SetClassAttributeInstruction(S));
                        break;

                      case "style":
                        h.push(new SetStyleAttributeInstruction(S));
                        break;

                      default:
                        h.push(new SetAttributeInstruction(S, B));
                    }
                }
            } else {
                if (c) {
                    b = BindablesInfo.from(a, false);
                    y = b.attrs[B];
                    if (y !== void 0) {
                        Js.node = n;
                        Js.attr = p;
                        Js.bindable = y;
                        Js.def = a;
                        h.push(new SpreadElementPropBindingInstruction(k.build(Js, l.ep, l.m)));
                        continue;
                    }
                }
                Js.node = n;
                Js.attr = p;
                Js.bindable = null;
                Js.def = null;
                h.push(k.build(Js, l.ep, l.m));
            }
        }
        resetCommandBuildInfo();
        if (g != null) {
            return g.concat(h);
        }
        return h;
    }
    Ti(e, s) {
        const i = [];
        const n = e.attributes;
        const r = s.ep;
        let l = n.length;
        let h = 0;
        let a;
        let c;
        let u;
        let f;
        let d = null;
        let p;
        let m;
        let g;
        let v;
        let b = null;
        let y;
        let w;
        let k;
        let C;
        for (;l > h; ++h) {
            a = n[h];
            c = a.name;
            u = a.value;
            f = s.He.parse(c, u);
            k = f.target;
            C = f.rawValue;
            if (ti[k]) {
                throw createMappedError(702, c);
            }
            b = s.Ei(f);
            if (b !== null && b.type === xs) {
                Js.node = e;
                Js.attr = f;
                Js.bindable = null;
                Js.def = null;
                i.push(b.build(Js, s.ep, s.m));
                continue;
            }
            d = s.Pi(k);
            if (d !== null) {
                if (d.isTemplateController) {
                    throw createMappedError(703, k);
                }
                g = BindablesInfo.from(d, true);
                w = d.noMultiBindings === false && b === null && hasInlineBindings(C);
                if (w) {
                    m = this.Li(e, C, d, s);
                } else {
                    v = g.primary;
                    if (b === null) {
                        y = r.parse(C, x);
                        m = [ y === null ? new SetPropertyInstruction(C, v.name) : new InterpolationInstruction(y, v.name) ];
                    } else {
                        Js.node = e;
                        Js.attr = f;
                        Js.bindable = v;
                        Js.def = d;
                        m = [ b.build(Js, s.ep, s.m) ];
                    }
                }
                e.removeAttribute(c);
                --h;
                --l;
                (p ?? (p = [])).push(new HydrateAttributeInstruction(this.resolveResources ? d : d.name, d.aliases != null && d.aliases.includes(k) ? k : void 0, m));
                continue;
            }
            if (b === null) {
                y = r.parse(C, x);
                if (y != null) {
                    e.removeAttribute(c);
                    --h;
                    --l;
                    i.push(new InterpolationInstruction(y, s.m.map(e, k) ?? t.camelCase(k)));
                } else {
                    switch (c) {
                      case "class":
                        i.push(new SetClassAttributeInstruction(C));
                        break;

                      case "style":
                        i.push(new SetStyleAttributeInstruction(C));
                        break;

                      default:
                        i.push(new SetAttributeInstruction(C, c));
                    }
                }
            } else {
                Js.node = e;
                Js.attr = f;
                Js.bindable = null;
                Js.def = null;
                i.push(b.build(Js, s.ep, s.m));
            }
        }
        resetCommandBuildInfo();
        if (p != null) {
            return p.concat(i);
        }
        return i;
    }
    Ri(t, e) {
        switch (t.nodeType) {
          case 1:
            switch (t.nodeName) {
              case "LET":
                return this.Mi(t, e);

              default:
                return this.Di(t, e);
            }

          case 3:
            return this.qi(t, e);

          case 11:
            {
                let s = t.firstChild;
                while (s !== null) {
                    s = this.Ri(s, e);
                }
                break;
            }
        }
        return t.nextSibling;
    }
    Mi(e, i) {
        const n = e.attributes;
        const r = n.length;
        const l = [];
        const h = i.ep;
        let a = false;
        let c = 0;
        let u;
        let f;
        let d;
        let p;
        let m;
        let g;
        let v;
        let b;
        for (;r > c; ++c) {
            u = n[c];
            d = u.name;
            p = u.value;
            if (d === "to-binding-context") {
                a = true;
                continue;
            }
            f = i.He.parse(d, p);
            g = f.target;
            v = f.rawValue;
            m = i.Ei(f);
            if (m !== null) {
                if (f.command === "bind") {
                    l.push(new LetBindingInstruction(h.parse(v, y), t.camelCase(g)));
                } else {
                    throw createMappedError(704, f);
                }
                continue;
            }
            b = h.parse(v, x);
            l.push(new LetBindingInstruction(b === null ? new s.PrimitiveLiteralExpression(v) : b, t.camelCase(g)));
        }
        i.rows.push([ new HydrateLetElementInstruction(l, a) ]);
        return this.Hi(e, i).nextSibling;
    }
    Di(e, s) {
        var i, n, r, l;
        const h = e.nextSibling;
        const a = (e.getAttribute("as-element") ?? e.nodeName).toLowerCase();
        const c = s.Ii(a);
        const u = c !== null;
        const f = u && c.shadowOptions != null;
        const d = c?.capture;
        const p = d != null && typeof d !== "boolean";
        const m = d ? [] : t.emptyArray;
        const g = s.ep;
        const v = this.debug ? t.noop : () => {
            e.removeAttribute(A);
            --k;
            --w;
        };
        let b = e.attributes;
        let y;
        let w = b.length;
        let k = 0;
        let C;
        let A;
        let B;
        let S;
        let _;
        let R;
        let T = null;
        let I = false;
        let E;
        let P;
        let L;
        let M;
        let D;
        let q;
        let H;
        let F = null;
        let O;
        let V;
        let N;
        let $;
        let W = true;
        let j = false;
        let z = false;
        let U = false;
        if (a === "slot") {
            if (s.root.def.shadowOptions == null) {
                throw createMappedError(717, s.root.def.name);
            }
            s.root.hasSlot = true;
        }
        if (u) {
            W = c.processContent?.call(c.Type, e, s.p);
            b = e.attributes;
            w = b.length;
        }
        for (;w > k; ++k) {
            C = b[k];
            A = C.name;
            B = C.value;
            switch (A) {
              case "as-element":
              case "containerless":
                v();
                if (!j) {
                    j = A === "containerless";
                }
                continue;
            }
            S = s.He.parse(A, B);
            F = s.Ei(S);
            N = S.target;
            $ = S.rawValue;
            if (d && (!p || p && d(N))) {
                if (F != null && F.type === xs) {
                    v();
                    m.push(S);
                    continue;
                }
                z = N !== ci && N !== "slot";
                if (z) {
                    O = BindablesInfo.from(c, false);
                    if (O.attrs[N] == null && !s.Pi(N)?.isTemplateController) {
                        v();
                        m.push(S);
                        continue;
                    }
                }
            }
            if (F !== null && F.type === xs) {
                Js.node = e;
                Js.attr = S;
                Js.bindable = null;
                Js.def = null;
                (_ ?? (_ = [])).push(F.build(Js, s.ep, s.m));
                v();
                continue;
            }
            T = s.Pi(N);
            if (T !== null) {
                O = BindablesInfo.from(T, true);
                I = T.noMultiBindings === false && F === null && hasInlineBindings($);
                if (I) {
                    L = this.Li(e, $, T, s);
                } else {
                    V = O.primary;
                    if (F === null) {
                        q = g.parse($, x);
                        L = [ q === null ? new SetPropertyInstruction($, V.name) : new InterpolationInstruction(q, V.name) ];
                    } else {
                        Js.node = e;
                        Js.attr = S;
                        Js.bindable = V;
                        Js.def = T;
                        L = [ F.build(Js, s.ep, s.m) ];
                    }
                }
                v();
                if (T.isTemplateController) {
                    (M ?? (M = [])).push(new HydrateTemplateController(Zs, this.resolveResources ? T : T.name, void 0, L));
                } else {
                    (P ?? (P = [])).push(new HydrateAttributeInstruction(this.resolveResources ? T : T.name, T.aliases != null && T.aliases.includes(N) ? N : void 0, L));
                }
                continue;
            }
            if (F === null) {
                if (u) {
                    O = BindablesInfo.from(c, false);
                    E = O.attrs[N];
                    if (E !== void 0) {
                        q = g.parse($, x);
                        (R ?? (R = [])).push(q == null ? new SetPropertyInstruction($, E.name) : new InterpolationInstruction(q, E.name));
                        v();
                        continue;
                    }
                }
                q = g.parse($, x);
                if (q != null) {
                    v();
                    (_ ?? (_ = [])).push(new InterpolationInstruction(q, s.m.map(e, N) ?? t.camelCase(N)));
                }
                continue;
            }
            v();
            if (u) {
                O = BindablesInfo.from(c, false);
                E = O.attrs[N];
                if (E !== void 0) {
                    Js.node = e;
                    Js.attr = S;
                    Js.bindable = E;
                    Js.def = c;
                    (R ?? (R = [])).push(F.build(Js, s.ep, s.m));
                    continue;
                }
            }
            Js.node = e;
            Js.attr = S;
            Js.bindable = null;
            Js.def = null;
            (_ ?? (_ = [])).push(F.build(Js, s.ep, s.m));
        }
        resetCommandBuildInfo();
        if (this.Fi(e, _) && _ != null && _.length > 1) {
            this.Oi(e, _);
        }
        if (u) {
            H = new HydrateElementInstruction(this.resolveResources ? c : c.name, void 0, R ?? t.emptyArray, null, j, m);
            if (a === ci) {
                const t = e.getAttribute("name") || ai;
                const i = s.t();
                const n = s.Vi();
                let r = e.firstChild;
                let l = 0;
                while (r !== null) {
                    if (isElement(r) && r.hasAttribute(ci)) {
                        e.removeChild(r);
                    } else {
                        appendToTemplate(i, r);
                        l++;
                    }
                    r = e.firstChild;
                }
                if (l > 0) {
                    this.Ri(i.content, n);
                }
                H.auSlot = {
                    name: t,
                    fallback: CustomElementDefinition.create({
                        name: At(),
                        template: i,
                        instructions: n.rows,
                        needsCompile: false
                    })
                };
            }
        }
        if (_ != null || H != null || P != null) {
            y = t.emptyArray.concat(H ?? t.emptyArray, P ?? t.emptyArray, _ ?? t.emptyArray);
            U = true;
        }
        let G;
        if (M != null) {
            w = M.length - 1;
            k = w;
            D = M[k];
            let t;
            if (isMarker(e)) {
                t = s.t();
                appendManyToTemplate(t, [ s.Bt(), s.Ni(Xs), s.Ni(Qs) ]);
            } else {
                this.$i(e, s);
                if (e.nodeName === "TEMPLATE") {
                    t = e;
                } else {
                    t = s.t();
                    appendToTemplate(t, e);
                }
            }
            const r = t;
            const l = s.Vi(y == null ? [] : [ y ]);
            let h;
            let d;
            let p = false;
            let m;
            let g;
            let x;
            let v;
            let b;
            let C;
            let A = 0, B = 0;
            let S = e.firstChild;
            let _ = false;
            if (W !== false) {
                while (S !== null) {
                    d = isElement(S) ? S.getAttribute(ci) : null;
                    p = d !== null || u && !f;
                    h = S.nextSibling;
                    if (p) {
                        if (!u) {
                            throw createMappedError(706, d, a);
                        }
                        S.removeAttribute?.(ci);
                        _ = isTextNode(S) && S.textContent.trim() === "";
                        if (!_) {
                            ((i = g ?? (g = {}))[n = d || ai] ?? (i[n] = [])).push(S);
                        }
                        e.removeChild(S);
                    }
                    S = h;
                }
            }
            if (g != null) {
                m = {};
                for (d in g) {
                    t = s.t();
                    x = g[d];
                    for (A = 0, B = x.length; B > A; ++A) {
                        v = x[A];
                        if (v.nodeName === "TEMPLATE") {
                            if (v.attributes.length > 0) {
                                appendToTemplate(t, v);
                            } else {
                                appendToTemplate(t, v.content);
                            }
                        } else {
                            appendToTemplate(t, v);
                        }
                    }
                    C = s.Vi();
                    this.Ri(t.content, C);
                    m[d] = CustomElementDefinition.create({
                        name: At(),
                        template: t,
                        instructions: C.rows,
                        needsCompile: false
                    });
                }
                H.projections = m;
            }
            if (U) {
                if (u && (j || c.containerless)) {
                    this.$i(e, s);
                } else {
                    this.Hi(e, s);
                }
            }
            G = !u || !c.containerless && !j && W !== false;
            if (G) {
                if (e.nodeName === Ks) {
                    this.Ri(e.content, l);
                } else {
                    S = e.firstChild;
                    while (S !== null) {
                        S = this.Ri(S, l);
                    }
                }
            }
            D.def = CustomElementDefinition.create({
                name: At(),
                template: r,
                instructions: l.rows,
                needsCompile: false
            });
            while (k-- > 0) {
                D = M[k];
                t = s.t();
                b = s.Bt();
                appendManyToTemplate(t, [ b, s.Ni(Xs), s.Ni(Qs) ]);
                D.def = CustomElementDefinition.create({
                    name: At(),
                    template: t,
                    needsCompile: false,
                    instructions: [ [ M[k + 1] ] ]
                });
            }
            s.rows.push([ D ]);
        } else {
            if (y != null) {
                s.rows.push(y);
            }
            let t = e.firstChild;
            let i;
            let n;
            let h = false;
            let d = null;
            let p;
            let m;
            let g;
            let x;
            let v;
            let b = false;
            let w = 0, k = 0;
            if (W !== false) {
                while (t !== null) {
                    n = isElement(t) ? t.getAttribute(ci) : null;
                    h = n !== null || u && !f;
                    i = t.nextSibling;
                    if (h) {
                        if (!u) {
                            throw createMappedError(706, n, a);
                        }
                        t.removeAttribute?.(ci);
                        b = isTextNode(t) && t.textContent.trim() === "";
                        if (!b) {
                            ((r = p ?? (p = {}))[l = n || ai] ?? (r[l] = [])).push(t);
                        }
                        e.removeChild(t);
                    }
                    t = i;
                }
            }
            if (p != null) {
                d = {};
                for (n in p) {
                    x = s.t();
                    m = p[n];
                    for (w = 0, k = m.length; k > w; ++w) {
                        g = m[w];
                        if (g.nodeName === Ks) {
                            if (g.attributes.length > 0) {
                                appendToTemplate(x, g);
                            } else {
                                appendToTemplate(x, g.content);
                            }
                        } else {
                            appendToTemplate(x, g);
                        }
                    }
                    v = s.Vi();
                    this.Ri(x.content, v);
                    d[n] = CustomElementDefinition.create({
                        name: At(),
                        template: x,
                        instructions: v.rows,
                        needsCompile: false
                    });
                }
                H.projections = d;
            }
            if (U) {
                if (u && (j || c.containerless)) {
                    this.$i(e, s);
                } else {
                    this.Hi(e, s);
                }
            }
            G = !u || !c.containerless && !j && W !== false;
            if (G && e.childNodes.length > 0) {
                t = e.firstChild;
                while (t !== null) {
                    t = this.Ri(t, s);
                }
            }
        }
        return h;
    }
    qi(t, e) {
        const s = t.parentNode;
        const i = e.ep.parse(t.textContent, x);
        const n = t.nextSibling;
        let r;
        let l;
        let h;
        let a;
        let c;
        if (i !== null) {
            ({parts: r, expressions: l} = i);
            if (c = r[0]) {
                insertBefore(s, e.Wi(c), t);
            }
            for (h = 0, a = l.length; a > h; ++h) {
                insertManyBefore(s, t, [ e.Bt(), e.Wi(" ") ]);
                if (c = r[h + 1]) {
                    insertBefore(s, e.Wi(c), t);
                }
                e.rows.push([ new TextBindingInstruction(l[h]) ]);
            }
            s.removeChild(t);
        }
        return n;
    }
    Li(t, e, s, i) {
        const n = BindablesInfo.from(s, true);
        const r = e.length;
        const l = [];
        let h = void 0;
        let a = void 0;
        let c = 0;
        let u = 0;
        let f;
        let d;
        let p;
        let m;
        for (let g = 0; g < r; ++g) {
            u = e.charCodeAt(g);
            if (u === 92) {
                ++g;
            } else if (u === 58) {
                h = e.slice(c, g);
                while (e.charCodeAt(++g) <= 32) ;
                c = g;
                for (;g < r; ++g) {
                    u = e.charCodeAt(g);
                    if (u === 92) {
                        ++g;
                    } else if (u === 59) {
                        a = e.slice(c, g);
                        break;
                    }
                }
                if (a === void 0) {
                    a = e.slice(c);
                }
                d = i.He.parse(h, a);
                p = i.Ei(d);
                m = n.attrs[d.target];
                if (m == null) {
                    throw createMappedError(707, d.target, s.name);
                }
                if (p === null) {
                    f = i.ep.parse(a, x);
                    l.push(f === null ? new SetPropertyInstruction(a, m.name) : new InterpolationInstruction(f, m.name));
                } else {
                    Js.node = t;
                    Js.attr = d;
                    Js.bindable = m;
                    Js.def = s;
                    l.push(p.build(Js, i.ep, i.m));
                }
                while (g < r && e.charCodeAt(++g) <= 32) ;
                c = g;
                h = void 0;
                a = void 0;
            }
        }
        resetCommandBuildInfo();
        return l;
    }
    _i(e, s) {
        const i = s.root.def.name;
        const n = e;
        const r = t.toArray(n.querySelectorAll("template[as-custom-element]"));
        const l = r.length;
        if (l === 0) {
            return;
        }
        if (l === n.childElementCount) {
            throw createMappedError(708, i);
        }
        const h = new Set;
        const a = [];
        for (const e of r) {
            if (e.parentNode !== n) {
                throw createMappedError(709, i);
            }
            const r = processTemplateName(i, e, h);
            const l = e.content;
            const c = t.toArray(l.querySelectorAll("bindable"));
            const u = new Set;
            const f = new Set;
            const d = c.reduce(((e, s) => {
                if (s.parentNode !== l) {
                    throw createMappedError(710, r);
                }
                const i = s.getAttribute("name");
                if (i === null) {
                    throw createMappedError(711, s, r);
                }
                const n = s.getAttribute("attribute");
                if (n !== null && f.has(n) || u.has(i)) {
                    throw createMappedError(712, u, n);
                } else {
                    if (n !== null) {
                        f.add(n);
                    }
                    u.add(i);
                }
                const h = t.toArray(s.attributes).filter((t => !ii.includes(t.name)));
                if (h.length > 0) ;
                s.remove();
                e[i] = {
                    attribute: n ?? void 0,
                    mode: getBindingMode(s)
                };
                return e;
            }), {});
            class LocalTemplateType {}
            g(LocalTemplateType, "name", {
                value: r
            });
            a.push(LocalTemplateType);
            s.ji(defineElement({
                name: r,
                template: e,
                bindables: d
            }, LocalTemplateType));
            n.removeChild(e);
        }
        const c = [ ...s.def.dependencies ?? t.emptyArray, ...a ];
        for (const t of a) {
            getElementDefinition(t).dependencies.push(c.filter((e => e !== t)));
        }
    }
    Fi(t, e) {
        const s = t.nodeName;
        return s === "INPUT" && ei[t.type] === 1 || s === "SELECT" && (t.hasAttribute("multiple") || e?.some((t => t.type === fe && t.to === "multiple")));
    }
    Oi(t, e) {
        switch (t.nodeName) {
          case "INPUT":
            {
                const t = e;
                let s = void 0;
                let i = void 0;
                let n = 0;
                let r;
                for (let e = 0; e < t.length && n < 3; e++) {
                    r = t[e];
                    switch (r.to) {
                      case "model":
                      case "value":
                      case "matcher":
                        s = e;
                        n++;
                        break;

                      case "checked":
                        i = e;
                        n++;
                        break;
                    }
                }
                if (i !== void 0 && s !== void 0 && i < s) {
                    [t[s], t[i]] = [ t[i], t[s] ];
                }
                break;
            }

          case "SELECT":
            {
                const t = e;
                let s = 0;
                let i = 0;
                let n = 0;
                let r;
                for (let e = 0; e < t.length && n < 2; ++e) {
                    r = t[e];
                    switch (r.to) {
                      case "multiple":
                        i = e;
                        n++;
                        break;

                      case "value":
                        s = e;
                        n++;
                        break;
                    }
                    if (n === 2 && s < i) {
                        [t[i], t[s]] = [ t[s], t[i] ];
                    }
                }
            }
        }
    }
    Hi(t, e) {
        insertBefore(t.parentNode, e.Ni("au*"), t);
        return t;
    }
    $i(t, e) {
        if (isMarker(t)) {
            return t;
        }
        const s = t.parentNode;
        const i = e.Bt();
        insertManyBefore(s, t, [ i, e.Ni(Xs), e.Ni(Qs) ]);
        s.removeChild(t);
        return i;
    }
}

const Ks = "TEMPLATE";

const Xs = "au-start";

const Qs = "au-end";

const isMarker = t => t.nodeValue === "au*";

class CompilationContext {
    constructor(e, i, n, r, l, h) {
        this.hasSlot = false;
        this.zi = createLookup();
        const a = r !== null;
        this.c = i;
        this.root = l === null ? this : l;
        this.def = e;
        this.ci = n;
        this.parent = r;
        this.Si = a ? r.Si : i.get(Us);
        this.He = a ? r.He : i.get(cs);
        this.ep = a ? r.ep : i.get(s.IExpressionParser);
        this.m = a ? r.m : i.get(Cs);
        this.$s = a ? r.$s : i.get(t.ILogger);
        this.p = a ? r.p : i.get(rt);
        this.localEls = a ? r.localEls : new Set;
        this.rows = h ?? [];
    }
    ji(t) {
        var e;
        ((e = this.root).deps ?? (e.deps = [])).push(t);
        this.root.c.register(t);
    }
    Wi(t) {
        return createText(this.p, t);
    }
    Ni(t) {
        return createComment(this.p, t);
    }
    Bt() {
        return this.Ni("au*");
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
    Ii(t) {
        return this.c.find(St, t);
    }
    Pi(t) {
        return this.c.find(xt, t);
    }
    Vi(t) {
        return new CompilationContext(this.def, this.c, this.ci, this, this.root, t);
    }
    Ei(t) {
        if (this.root !== this) {
            return this.root.Ei(t);
        }
        const e = t.command;
        if (e === null) {
            return null;
        }
        let s = this.zi[e];
        if (s === void 0) {
            s = this.c.create(bs, e);
            if (s === null) {
                throw createMappedError(713, e);
            }
            this.zi[e] = s;
        }
        return s;
    }
}

const hasInlineBindings = t => {
    const e = t.length;
    let s = 0;
    let i = 0;
    while (e > i) {
        s = t.charCodeAt(i);
        if (s === 92) {
            ++i;
        } else if (s === 58) {
            return true;
        } else if (s === 36 && t.charCodeAt(i + 1) === 123) {
            return false;
        }
        ++i;
    }
    return false;
};

const resetCommandBuildInfo = () => {
    Js.node = Js.attr = Js.bindable = Js.def = null;
};

const Ys = {
    projections: null
};

const Zs = {
    name: "unnamed"
};

const Js = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const ti = u(createLookup(), {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
});

const ei = {
    checkbox: 1,
    radio: 1
};

const si = new WeakMap;

class BindablesInfo {
    static from(t, e) {
        let s = si.get(t);
        if (s == null) {
            const i = t.bindables;
            const n = createLookup();
            const r = e ? t.defaultBindingMode === void 0 ? I : t.defaultBindingMode : I;
            let l;
            let h;
            let a = false;
            let c;
            let u;
            for (h in i) {
                l = i[h];
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
            si.set(t, s = new BindablesInfo(n, i, c));
        }
        return s;
    }
    constructor(t, e, s) {
        this.attrs = t;
        this.bindables = e;
        this.primary = s;
    }
}

const ii = c([ "name", "attribute", "mode" ]);

const ni = "as-custom-element";

const processTemplateName = (t, e, s) => {
    const i = e.getAttribute(ni);
    if (i === null || i === "") {
        throw createMappedError(715, t);
    }
    if (s.has(i)) {
        throw createMappedError(716, i, t);
    } else {
        s.add(i);
        e.removeAttribute(ni);
    }
    return i;
};

const getBindingMode = t => {
    switch (t.getAttribute("mode")) {
      case "oneTime":
        return S;

      case "toView":
        return _;

      case "fromView":
        return R;

      case "twoWay":
        return T;

      case "default":
      default:
        return I;
    }
};

const ri = /*@__PURE__*/ z("ITemplateCompilerHooks");

const oi = new WeakMap;

const li = /*@__PURE__*/ F("compiler-hooks");

const hi = c({
    name: li,
    define(t) {
        let e = oi.get(t);
        if (e === void 0) {
            oi.set(t, e = new TemplateCompilerHooksDefinition(t));
            M(li, e, t);
            O(t, li);
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
        t.register(U(ri, this.Type));
    }
}

const templateCompilerHooks = t => {
    return t === void 0 ? decorator : decorator(t);
    function decorator(t) {
        return hi.define(t);
    }
};

const ai = "default";

const ci = "au-slot";

class Show {
    constructor() {
        this.el = t.resolve(ot);
        this.p = t.resolve(rt);
        this.Ui = false;
        this.U = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.U = null;
            if (Boolean(this.value) !== this.Gi) {
                if (this.Gi === this.Ki) {
                    this.Gi = !this.Ki;
                    this.$val = this.el.style.getPropertyValue("display");
                    this.$prio = this.el.style.getPropertyPriority("display");
                    this.el.style.setProperty("display", "none", "important");
                } else {
                    this.Gi = this.Ki;
                    this.el.style.setProperty("display", this.$val, this.$prio);
                    if (this.el.getAttribute("style") === "") {
                        this.el.removeAttribute("style");
                    }
                }
            }
        };
        const e = t.resolve(_e);
        this.Gi = this.Ki = e.alias !== "hide";
    }
    binding() {
        this.Ui = true;
        this.update();
    }
    detaching() {
        this.Ui = false;
        this.U?.cancel();
        this.U = null;
    }
    valueChanged() {
        if (this.Ui && this.U === null) {
            this.U = this.p.domWriteQueue.queueTask(this.update);
        }
    }
}

__decorate([ bindable ], Show.prototype, "value", void 0);

alias("hide")(Show);

customAttribute("show")(Show);

const ui = [ TemplateCompiler, s.DirtyChecker, NodeObserverLocator ];

const fi = [ exports.RefAttributePattern, exports.DotSeparatedAttributePattern, ms, ps, Jt ];

const di = [ exports.AtPrefixedTriggerAttributePattern, exports.ColonPrefixedBindAttributePattern ];

const pi = [ exports.DefaultBindingCommand, exports.OneTimeBindingCommand, exports.FromViewBindingCommand, exports.ToViewBindingCommand, exports.TwoWayBindingCommand, exports.ForBindingCommand, ys, exports.TriggerBindingCommand, exports.CaptureBindingCommand, exports.ClassBindingCommand, exports.StyleBindingCommand, exports.AttrBindingCommand, ws ];

const mi = [ DebounceBindingBehavior, OneTimeBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, SignalBindingBehavior, ThrottleBindingBehavior, TwoWayBindingBehavior, SanitizeValueConverter, If, Else, Repeat, With, exports.Switch, exports.Case, exports.DefaultCase, exports.PromiseTemplateController, exports.PendingTemplateController, exports.FulfilledTemplateController, exports.RejectedTemplateController, $s, Ws, js, AttrBindingBehavior, SelfBindingBehavior, UpdateTriggerBindingBehavior, AuCompose, Portal, Focus, Show, exports.AuSlot ];

const gi = [ exports.PropertyBindingRenderer, exports.IteratorBindingRenderer, exports.RefBindingRenderer, exports.InterpolationBindingRenderer, exports.SetPropertyRenderer, exports.CustomElementRenderer, exports.CustomAttributeRenderer, exports.TemplateControllerRenderer, exports.LetElementRenderer, exports.ListenerBindingRenderer, exports.AttributeBindingRenderer, exports.SetAttributeRenderer, exports.SetClassAttributeRenderer, exports.SetStyleAttributeRenderer, exports.StylePropertyBindingRenderer, exports.TextBindingRenderer, exports.SpreadRenderer ];

const xi = /*@__PURE__*/ createConfiguration(t.noop);

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
            return e.register(K(s.ICoercionConfiguration, i.coercingOptions), ...ui, ...mi, ...fi, ...pi, ...gi);
        },
        customize(e) {
            return createConfiguration(e ?? t);
        }
    };
}

function children(t, e) {
    if (!yi) {
        yi = true;
        s.subscriberCollection(ChildrenBinding);
        lifecycleHooks()(ChildrenLifecycleHooks);
    }
    let i;
    const n = "dependencies";
    function decorator(t, e, s) {
        if (arguments.length > 1) {
            i.name = e;
        }
        if (typeof t === "function" || typeof s?.value !== "undefined") {
            throw createMappedError(9991);
        }
        const r = t.constructor;
        let l = St.getAnnotation(r, n);
        if (l == null) {
            St.annotate(r, n, l = []);
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
    constructor(t, e, s, i = defaultChildQuery, n = defaultChildFilter, r = defaultChildMap, l = vi) {
        this.Xi = void 0;
        this.ut = defaultChildQuery;
        this.Qi = defaultChildFilter;
        this.Yi = defaultChildMap;
        this.isBound = false;
        this.G = t;
        this.obj = e;
        this.cb = s;
        this.ut = i;
        this.Qi = n;
        this.Yi = r;
        this.st = l;
        this.Cs = createMutationObserver(this.Zi = t.host, (() => {
            this.Ji();
        }));
    }
    getValue() {
        return this.isBound ? this.Xi : this.tn();
    }
    setValue(t) {}
    bind() {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        this.Cs.observe(this.Zi, this.st);
        this.Xi = this.tn();
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.Cs.disconnect();
        this.Xi = t.emptyArray;
    }
    Ji() {
        this.Xi = this.tn();
        this.cb?.call(this.obj);
        this.subs.notify(this.Xi, undefined);
    }
    get() {
        throw createMappedError(99, "get");
    }
    tn() {
        return filterChildren(this.G, this.ut, this.Qi, this.Yi);
    }
}

const vi = {
    childList: true
};

const defaultChildQuery = t => t.host.childNodes;

const defaultChildFilter = (t, e, s) => !!s;

const defaultChildMap = (t, e, s) => s;

const bi = {
    optional: true
};

const filterChildren = (t, e, s, i) => {
    const n = e(t);
    const r = n.length;
    const l = [];
    let h;
    let a;
    let c;
    let u = 0;
    for (;u < r; ++u) {
        h = n[u];
        a = findElementControllerFor(h, bi);
        c = a?.viewModel ?? null;
        if (s(h, a, c)) {
            l.push(i(h, a, c));
        }
    }
    return l;
};

class ChildrenLifecycleHooks {
    constructor(t) {
        this.ft = t;
    }
    register(t) {
        K(Nt, this).register(t);
    }
    hydrating(t, e) {
        const s = this.ft;
        const i = new ChildrenBinding(e, t, t[s.callback ?? `${l(s.name)}Changed`], s.query ?? defaultChildQuery, s.filter ?? defaultChildFilter, s.map ?? defaultChildMap, s.options ?? vi);
        g(t, s.name, {
            enumerable: true,
            configurable: true,
            get: u((() => i.getValue()), {
                getObserver: () => i
            }),
            set: () => {}
        });
        e.addBinding(i);
    }
}

let yi = false;

exports.AdoptedStyleSheetsStyles = AdoptedStyleSheetsStyles;

exports.AppRoot = AppRoot;

exports.AppTask = nt;

exports.AttrBindingBehavior = AttrBindingBehavior;

exports.AttrSyntax = AttrSyntax;

exports.AttributeBinding = AttributeBinding;

exports.AttributeBindingInstruction = AttributeBindingInstruction;

exports.AttributeNSAccessor = AttributeNSAccessor;

exports.AttributePattern = ds;

exports.AuCompose = AuCompose;

exports.AuSlotsInfo = AuSlotsInfo;

exports.Aurelia = Aurelia;

exports.Bindable = W;

exports.BindableDefinition = BindableDefinition;

exports.BindablesInfo = BindablesInfo;

exports.BindingBehavior = Y;

exports.BindingBehaviorDefinition = BindingBehaviorDefinition;

exports.BindingCommand = bs;

exports.BindingCommandDefinition = BindingCommandDefinition;

exports.BindingMode = E;

exports.BindingModeBehavior = BindingModeBehavior;

exports.BindingTargetSubscriber = BindingTargetSubscriber;

exports.CSSModulesProcessorRegistry = CSSModulesProcessorRegistry;

exports.CheckedObserver = CheckedObserver;

exports.ChildrenBinding = ChildrenBinding;

exports.ClassAttributeAccessor = ClassAttributeAccessor;

exports.ComputedWatcher = ComputedWatcher;

exports.ContentBinding = ContentBinding;

exports.Controller = Controller;

exports.CustomAttribute = xt;

exports.CustomAttributeDefinition = CustomAttributeDefinition;

exports.CustomElement = St;

exports.CustomElementDefinition = CustomElementDefinition;

exports.DataAttributeAccessor = DataAttributeAccessor;

exports.DebounceBindingBehavior = DebounceBindingBehavior;

exports.DefaultBindingLanguage = pi;

exports.DefaultBindingSyntax = fi;

exports.DefaultComponents = ui;

exports.DefaultRenderers = gi;

exports.DefaultResources = mi;

exports.Else = Else;

exports.EventModifier = EventModifier;

exports.EventModifierRegistration = Jt;

exports.ExpressionWatcher = ExpressionWatcher;

exports.FlushQueue = FlushQueue;

exports.Focus = Focus;

exports.FragmentNodeSequence = FragmentNodeSequence;

exports.FromViewBindingBehavior = FromViewBindingBehavior;

exports.HydrateAttributeInstruction = HydrateAttributeInstruction;

exports.HydrateElementInstruction = HydrateElementInstruction;

exports.HydrateLetElementInstruction = HydrateLetElementInstruction;

exports.HydrateTemplateController = HydrateTemplateController;

exports.IAppRoot = os;

exports.IAppTask = it;

exports.IAttrMapper = Cs;

exports.IAttributeParser = cs;

exports.IAttributePattern = as;

exports.IAuSlotWatcher = ne;

exports.IAuSlotsInfo = ie;

exports.IAurelia = ls;

exports.IController = es;

exports.IEventModifier = Zt;

exports.IEventTarget = lt;

exports.IFlushQueue = Dt;

exports.IHistory = dt;

exports.IHydrationContext = ss;

exports.IInstruction = _e;

exports.IKeyMapping = Yt;

exports.ILifecycleHooks = Nt;

exports.ILocation = ft;

exports.IModifiedEventHandlerCreator = Qt;

exports.INode = ot;

exports.IPlatform = rt;

exports.IRenderLocation = ht;

exports.IRenderer = Te;

exports.IRendering = He;

exports.ISVGAnalyzer = ks;

exports.ISanitizer = zs;

exports.IShadowDOMGlobalStyles = It;

exports.IShadowDOMStyles = Tt;

exports.ISyntaxInterpreter = hs;

exports.ITemplateCompiler = Re;

exports.ITemplateCompilerHooks = ri;

exports.ITemplateElementFactory = Us;

exports.IViewFactory = te;

exports.IWindow = ut;

exports.If = If;

exports.InstructionType = Se;

exports.InterpolationBinding = InterpolationBinding;

exports.InterpolationInstruction = InterpolationInstruction;

exports.InterpolationPartBinding = InterpolationPartBinding;

exports.Interpretation = Interpretation;

exports.IteratorBindingInstruction = IteratorBindingInstruction;

exports.LetBinding = LetBinding;

exports.LetBindingInstruction = LetBindingInstruction;

exports.LifecycleHooks = jt;

exports.LifecycleHooksDefinition = LifecycleHooksDefinition;

exports.LifecycleHooksEntry = LifecycleHooksEntry;

exports.ListenerBinding = ListenerBinding;

exports.ListenerBindingInstruction = ListenerBindingInstruction;

exports.ListenerBindingOptions = ListenerBindingOptions;

exports.MultiAttrInstruction = MultiAttrInstruction;

exports.NodeObserverLocator = NodeObserverLocator;

exports.NoopSVGAnalyzer = NoopSVGAnalyzer;

exports.OneTimeBindingBehavior = OneTimeBindingBehavior;

exports.Portal = Portal;

exports.PropertyBinding = PropertyBinding;

exports.PropertyBindingInstruction = PropertyBindingInstruction;

exports.RefBinding = RefBinding;

exports.RefBindingInstruction = RefBindingInstruction;

exports.Rendering = Rendering;

exports.Repeat = Repeat;

exports.SVGAnalyzer = SVGAnalyzer;

exports.SanitizeValueConverter = SanitizeValueConverter;

exports.SelectValueObserver = SelectValueObserver;

exports.SelfBindingBehavior = SelfBindingBehavior;

exports.SetAttributeInstruction = SetAttributeInstruction;

exports.SetClassAttributeInstruction = SetClassAttributeInstruction;

exports.SetPropertyInstruction = SetPropertyInstruction;

exports.SetStyleAttributeInstruction = SetStyleAttributeInstruction;

exports.ShadowDOMRegistry = ShadowDOMRegistry;

exports.ShortHandBindingSyntax = di;

exports.SignalBindingBehavior = SignalBindingBehavior;

exports.SpreadBindingInstruction = SpreadBindingInstruction;

exports.SpreadElementPropBindingInstruction = SpreadElementPropBindingInstruction;

exports.StandardConfiguration = xi;

exports.State = ts;

exports.StyleAttributeAccessor = StyleAttributeAccessor;

exports.StyleConfiguration = Et;

exports.StyleElementStyles = StyleElementStyles;

exports.StylePropertyBindingInstruction = StylePropertyBindingInstruction;

exports.TemplateCompiler = TemplateCompiler;

exports.TemplateCompilerHooks = hi;

exports.TextBindingInstruction = TextBindingInstruction;

exports.ThrottleBindingBehavior = ThrottleBindingBehavior;

exports.ToViewBindingBehavior = ToViewBindingBehavior;

exports.TwoWayBindingBehavior = TwoWayBindingBehavior;

exports.UpdateTriggerBindingBehavior = UpdateTriggerBindingBehavior;

exports.ValueAttributeObserver = ValueAttributeObserver;

exports.ValueConverter = Lt;

exports.ValueConverterDefinition = ValueConverterDefinition;

exports.ViewFactory = ViewFactory;

exports.Watch = yt;

exports.With = With;

exports.alias = alias;

exports.allResources = allResources;

exports.attributePattern = attributePattern;

exports.bindable = bindable;

exports.bindingBehavior = bindingBehavior;

exports.bindingCommand = bindingCommand;

exports.capture = capture;

exports.children = children;

exports.coercer = coercer;

exports.containerless = containerless;

exports.convertToRenderLocation = convertToRenderLocation;

exports.cssModules = cssModules;

exports.customAttribute = customAttribute;

exports.customElement = customElement;

exports.getEffectiveParentNode = getEffectiveParentNode;

exports.getRef = getRef;

exports.isCustomElementController = isCustomElementController;

exports.isCustomElementViewModel = isCustomElementViewModel;

exports.isInstruction = isInstruction;

exports.isRenderLocation = isRenderLocation;

exports.lifecycleHooks = lifecycleHooks;

exports.mixinAstEvaluator = mixinAstEvaluator;

exports.mixinUseScope = mixinUseScope;

exports.mixingBindingLimited = mixingBindingLimited;

exports.processContent = processContent;

exports.registerAliases = registerAliases;

exports.renderer = renderer;

exports.setEffectiveParentNode = setEffectiveParentNode;

exports.setRef = setRef;

exports.shadowCSS = shadowCSS;

exports.slotted = slotted;

exports.templateCompilerHooks = templateCompilerHooks;

exports.templateController = templateController;

exports.useShadowDOM = useShadowDOM;

exports.valueConverter = valueConverter;

exports.watch = watch;
//# sourceMappingURL=index.cjs.map
