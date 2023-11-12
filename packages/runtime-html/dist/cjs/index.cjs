"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

const r = e.Metadata.getOwn;

const l = e.Metadata.hasOwn;

const h = e.Metadata.define;

const {annotation: a, resource: c} = t.Protocol;

const u = a.keyFor;

const f = c.keyFor;

const d = c.appendTo;

const p = a.appendTo;

const m = a.getKeys;

const x = Object;

const g = String;

const v = x.prototype;

const createLookup = () => x.create(null);

const createError$1 = t => new Error(t);

const b = v.hasOwnProperty;

const w = x.freeze;

const y = x.assign;

const k = x.getOwnPropertyNames;

const C = x.keys;

const A = /*@__PURE__*/ createLookup();

const isDataAttribute = (t, e, s) => {
    if (A[e] === true) {
        return true;
    }
    if (!isString(e)) {
        return false;
    }
    const i = e.slice(0, 5);
    return A[e] = i === "aria-" || i === "data-" || s.isStandardSvgAttribute(t, e);
};

const isPromise = t => t instanceof Promise;

const isArray = t => t instanceof Array;

const isFunction = t => typeof t === "function";

const isString = t => typeof t === "string";

const rethrow = t => {
    throw t;
};

const B = x.is;

const S = Reflect.defineProperty;

const defineHiddenProp = (t, e, s) => {
    S(t, e, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: s
    });
    return s;
};

const addSignalListener = (t, e, s) => t.addSignalListener(e, s);

const removeSignalListener = (t, e, s) => t.removeSignalListener(e, s);

function bindable(t, e) {
    let s;
    function decorator(t, e) {
        if (arguments.length > 1) {
            s.name = e;
        }
        h(_, BindableDefinition.create(e, t, s), t.constructor, e);
        p(t.constructor, R.keyFrom(e));
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
    return t.startsWith(_);
}

const _ = /*@__PURE__*/ u("bindable");

const R = w({
    name: _,
    keyFrom: t => `${_}:${t}`,
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
                C(t).forEach((e => addDescription(e, t[e])));
            }
        }
        e.forEach(addList);
        return s;
    },
    getAll(e) {
        const s = _.length + 1;
        const i = [];
        const n = t.getPrototypeChain(e);
        let l = n.length;
        let h = 0;
        let a;
        let c;
        let u;
        let f;
        while (--l >= 0) {
            u = n[l];
            a = m(u).filter(isBindableAnnotation);
            c = a.length;
            for (f = 0; f < c; ++f) {
                i[h++] = r(_, u, a[f].slice(s));
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
        return new BindableDefinition(i.attribute ?? t.kebabCase(e), i.callback ?? `${e}Changed`, i.mode ?? 2, i.primary ?? false, i.name ?? e, i.set ?? getInterceptor(e, s, i));
    }
}

function coercer(t, e, s) {
    T.define(t, e);
}

const T = {
    key: /*@__PURE__*/ u("coercer"),
    define(t, e) {
        h(T.key, t[e].bind(t), t);
    },
    for(t) {
        return r(T.key, t);
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
            l = typeof e === "function" ? e.bind(r) : T.for(r) ?? t.noop;
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

const resource = e => {
    function Resolver(e, s, i) {
        t.DI.inject(Resolver)(e, s, i);
    }
    Resolver.$isResolver = true;
    Resolver.resolve = (t, s) => s.has(e, false) ? s.get(e) : s.root.get(e);
    return Resolver;
};

const optionalResource = e => y((function Resolver(e, s, i) {
    t.DI.inject(Resolver)(e, s, i);
}), {
    $isResolver: true,
    resolve: (t, s) => s.has(e, false) ? s.get(e) : s.root.has(e, false) ? s.root.get(e) : void 0
});

const allResources = e => {
    function Resolver(e, s, i) {
        t.DI.inject(Resolver)(e, s, i);
    }
    Resolver.$isResolver = true;
    Resolver.resolve = function(t, s) {
        if (s.root === s) {
            return s.getAll(e, false);
        }
        return s.has(e, false) ? s.getAll(e, false).concat(s.root.getAll(e, false)) : s.root.getAll(e, false);
    };
    return Resolver;
};

const I = t.DI.createInterface;

const E = t.Registration.singleton;

const L = t.Registration.aliasTo;

const P = t.Registration.instance;

t.Registration.callback;

const q = t.Registration.transient;

const registerResolver = (t, e, s) => t.registerResolver(e, s);

function alias(...t) {
    return function(e) {
        const s = u("aliases");
        const i = r(s, e);
        if (i === void 0) {
            h(s, t, e);
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

const createMappedError = (t, ...e) => new Error(`AUR${g(t).padStart(4, "0")}:${e.map(g)}`);

function bindingBehavior(t) {
    return function(e) {
        return M.define(t, e);
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
        return new BindingBehaviorDefinition(s, t.firstDefined(getBehaviorAnnotation(s, "name"), i), t.mergeArrays(getBehaviorAnnotation(s, "aliases"), n.aliases, s.aliases), M.keyFrom(i));
    }
    register(t) {
        const {Type: e, key: s, aliases: i} = this;
        E(s, e).register(t);
        L(s, e).register(t);
        registerAliases(i, M, s, t);
    }
}

const D = /*@__PURE__*/ f("binding-behavior");

const getBehaviorAnnotation = (t, e) => r(u(e), t);

const M = w({
    name: D,
    keyFrom(t) {
        return `${D}:${t}`;
    },
    isType(t) {
        return isFunction(t) && l(D, t);
    },
    define(t, e) {
        const s = BindingBehaviorDefinition.create(t, e);
        h(D, s, s.Type);
        h(D, s, s);
        d(e, D);
        return s.Type;
    },
    getDefinition(t) {
        const e = r(D, t);
        if (e === void 0) {
            throw createMappedError(151, t);
        }
        return e;
    },
    annotate(t, e, s) {
        h(u(e), s, t);
    },
    getAnnotation: getBehaviorAnnotation
});

const F = new Map;

class BindingModeBehavior {
    bind(t, e) {
        F.set(e, e.mode);
        e.mode = this.mode;
    }
    unbind(t, e) {
        e.mode = F.get(e);
        F.delete(e);
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

const H = new WeakMap;

const O = 200;

class DebounceBindingBehavior {
    constructor() {
        this.p = t.resolve(t.IPlatform);
    }
    bind(e, s, i, n) {
        const r = {
            type: "debounce",
            delay: i ?? O,
            now: this.p.performanceNow,
            queue: this.p.taskQueue,
            signals: isString(n) ? [ n ] : n ?? t.emptyArray
        };
        const l = s.limit?.(r);
        if (l == null) ; else {
            H.set(s, l);
        }
    }
    unbind(t, e) {
        H.get(e)?.dispose();
        H.delete(e);
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

const V = new WeakMap;

const N = 200;

class ThrottleBindingBehavior {
    constructor() {
        ({performanceNow: this.C, taskQueue: this.A} = t.resolve(t.IPlatform));
    }
    bind(e, s, i, n) {
        const r = {
            type: "throttle",
            delay: i ?? N,
            now: this.C,
            queue: this.A,
            signals: isString(n) ? [ n ] : n ?? t.emptyArray
        };
        const l = s.limit?.(r);
        if (l == null) ; else {
            V.set(s, l);
        }
    }
    unbind(t, e) {
        V.get(e)?.dispose();
        V.delete(e);
    }
}

bindingBehavior("throttle")(ThrottleBindingBehavior);

const $ = /*@__PURE__*/ I("IAppTask");

class $AppTask {
    constructor(t, e, s) {
        this.c = void 0;
        this.slot = t;
        this.k = e;
        this.cb = s;
    }
    register(t) {
        return this.c = t.register(P($, this));
    }
    run() {
        const t = this.k;
        const e = this.cb;
        return t === null ? e() : e(this.c.get(t));
    }
}

const j = w({
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

const W = t.IPlatform;

class Refs {}

function getRef(t, e) {
    return t.$au?.[e] ?? null;
}

function setRef(t, e, s) {
    var i;
    ((i = t).$au ?? (i.$au = new Refs))[e] = s;
}

const z = /*@__PURE__*/ I("INode");

const U = /*@__PURE__*/ I("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(re, true)) {
        return t.get(re).host;
    }
    return t.get(W).document;
}))));

const G = /*@__PURE__*/ I("IRenderLocation");

const X = /*@__PURE__*/ I("CssModules");

const Q = new WeakMap;

function getEffectiveParentNode(t) {
    if (Q.has(t)) {
        return Q.get(t);
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
            Q.set(s[t], e);
        }
    } else {
        Q.set(t, e);
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

const K = /*@__PURE__*/ I("IWindow", (t => t.callback((t => t.get(W).window))));

const Y = /*@__PURE__*/ I("ILocation", (t => t.callback((t => t.get(K).location))));

const Z = /*@__PURE__*/ I("IHistory", (t => t.callback((t => t.get(K).history))));

const registerHostNode = (e, s, i) => {
    registerResolver(e, s.HTMLElement, registerResolver(e, s.Element, registerResolver(e, z, new t.InstanceProvider("ElementResolver", i))));
    return e;
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
        return new CustomAttributeDefinition(s, t.firstDefined(getAttributeAnnotation(s, "name"), i), t.mergeArrays(getAttributeAnnotation(s, "aliases"), n.aliases, s.aliases), getAttributeKeyFrom(i), t.firstDefined(getAttributeAnnotation(s, "defaultBindingMode"), n.defaultBindingMode, s.defaultBindingMode, 2), t.firstDefined(getAttributeAnnotation(s, "isTemplateController"), n.isTemplateController, s.isTemplateController, false), R.from(s, ...R.getAll(s), getAttributeAnnotation(s, "bindables"), s.bindables, n.bindables), t.firstDefined(getAttributeAnnotation(s, "noMultiBindings"), n.noMultiBindings, s.noMultiBindings, false), t.mergeArrays(it.getAnnotation(s), s.watches), t.mergeArrays(getAttributeAnnotation(s, "dependencies"), n.dependencies, s.dependencies));
    }
    register(t) {
        const {Type: e, key: s, aliases: i} = this;
        q(s, e).register(t);
        L(s, e).register(t);
        registerAliases(i, tt, s, t);
    }
    toString() {
        return `au:ca:${this.name}`;
    }
}

const J = f("custom-attribute");

const getAttributeKeyFrom = t => `${J}:${t}`;

const getAttributeAnnotation = (t, e) => r(u(e), t);

const isAttributeType = t => isFunction(t) && l(J, t);

const findAttributeControllerFor = (t, e) => getRef(t, getAttributeKeyFrom(e)) ?? void 0;

const defineAttribute = (t, e) => {
    const s = CustomAttributeDefinition.create(t, e);
    h(J, s, s.Type);
    h(J, s, s);
    d(e, J);
    return s.Type;
};

const getAttributeDefinition = t => {
    const e = r(J, t);
    if (e === void 0) {
        throw createMappedError(759, t);
    }
    return e;
};

const tt = w({
    name: J,
    keyFrom: getAttributeKeyFrom,
    isType: isAttributeType,
    for: findAttributeControllerFor,
    define: defineAttribute,
    getDefinition: getAttributeDefinition,
    annotate(t, e, s) {
        h(u(e), s, t);
    },
    getAnnotation: getAttributeAnnotation
});

function watch(t, e) {
    if (t == null) {
        throw createMappedError(772);
    }
    return function decorator(s, i, n) {
        const r = i == null;
        const l = r ? s : s.constructor;
        const h = new WatchDefinition(t, r ? e : n.value);
        if (r) {
            if (!isFunction(e) && (e == null || !(e in l.prototype))) {
                throw createMappedError(773, `${g(e)}@${l.name}}`);
            }
        } else if (!isFunction(n?.value)) {
            throw createMappedError(774, i);
        }
        it.add(l, h);
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

const et = t.emptyArray;

const st = u("watch");

const it = w({
    name: st,
    add(t, e) {
        let s = r(st, t);
        if (s == null) {
            h(st, s = [], t);
        }
        s.push(e);
    },
    getAnnotation(t) {
        return r(st, t) ?? et;
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
    const e = r(ot, t);
    if (e === void 0) {
        annotateElementMetadata(t, "containerless", true);
        return;
    }
    e.containerless = true;
}

const nt = new WeakMap;

class CustomElementDefinition {
    get type() {
        return 1;
    }
    constructor(t, e, s, i, n, r, l, h, a, c, u, f, d, p, m, x, g, v, b) {
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
        this.hasSlots = x;
        this.enhance = g;
        this.watches = v;
        this.processContent = b;
    }
    static create(e, s = null) {
        if (s === null) {
            const i = e;
            if (isString(i)) {
                throw createMappedError(761, e);
            }
            const n = t.fromDefinitionOrDefault("name", i, lt);
            if (isFunction(i.Type)) {
                s = i.Type;
            } else {
                s = ht(t.pascalCase(n));
            }
            return new CustomElementDefinition(s, n, t.mergeArrays(i.aliases), t.fromDefinitionOrDefault("key", i, (() => getElementKeyFrom(n))), t.fromDefinitionOrDefault("cache", i, returnZero), t.fromDefinitionOrDefault("capture", i, returnFalse), t.fromDefinitionOrDefault("template", i, returnNull), t.mergeArrays(i.instructions), t.mergeArrays(i.dependencies), t.fromDefinitionOrDefault("injectable", i, returnNull), t.fromDefinitionOrDefault("needsCompile", i, returnTrue), t.mergeArrays(i.surrogates), R.from(s, i.bindables), t.fromDefinitionOrDefault("containerless", i, returnFalse), t.fromDefinitionOrDefault("shadowOptions", i, returnNull), t.fromDefinitionOrDefault("hasSlots", i, returnFalse), t.fromDefinitionOrDefault("enhance", i, returnFalse), t.fromDefinitionOrDefault("watches", i, returnEmptyArray), t.fromAnnotationOrTypeOrDefault("processContent", s, returnNull));
        }
        if (isString(e)) {
            return new CustomElementDefinition(s, e, t.mergeArrays(getElementAnnotation(s, "aliases"), s.aliases), getElementKeyFrom(e), t.fromAnnotationOrTypeOrDefault("cache", s, returnZero), t.fromAnnotationOrTypeOrDefault("capture", s, returnFalse), t.fromAnnotationOrTypeOrDefault("template", s, returnNull), t.mergeArrays(getElementAnnotation(s, "instructions"), s.instructions), t.mergeArrays(getElementAnnotation(s, "dependencies"), s.dependencies), t.fromAnnotationOrTypeOrDefault("injectable", s, returnNull), t.fromAnnotationOrTypeOrDefault("needsCompile", s, returnTrue), t.mergeArrays(getElementAnnotation(s, "surrogates"), s.surrogates), R.from(s, ...R.getAll(s), getElementAnnotation(s, "bindables"), s.bindables), t.fromAnnotationOrTypeOrDefault("containerless", s, returnFalse), t.fromAnnotationOrTypeOrDefault("shadowOptions", s, returnNull), t.fromAnnotationOrTypeOrDefault("hasSlots", s, returnFalse), t.fromAnnotationOrTypeOrDefault("enhance", s, returnFalse), t.mergeArrays(it.getAnnotation(s), s.watches), t.fromAnnotationOrTypeOrDefault("processContent", s, returnNull));
        }
        const i = t.fromDefinitionOrDefault("name", e, lt);
        return new CustomElementDefinition(s, i, t.mergeArrays(getElementAnnotation(s, "aliases"), e.aliases, s.aliases), getElementKeyFrom(i), t.fromAnnotationOrDefinitionOrTypeOrDefault("cache", e, s, returnZero), t.fromAnnotationOrDefinitionOrTypeOrDefault("capture", e, s, returnFalse), t.fromAnnotationOrDefinitionOrTypeOrDefault("template", e, s, returnNull), t.mergeArrays(getElementAnnotation(s, "instructions"), e.instructions, s.instructions), t.mergeArrays(getElementAnnotation(s, "dependencies"), e.dependencies, s.dependencies), t.fromAnnotationOrDefinitionOrTypeOrDefault("injectable", e, s, returnNull), t.fromAnnotationOrDefinitionOrTypeOrDefault("needsCompile", e, s, returnTrue), t.mergeArrays(getElementAnnotation(s, "surrogates"), e.surrogates, s.surrogates), R.from(s, ...R.getAll(s), getElementAnnotation(s, "bindables"), s.bindables, e.bindables), t.fromAnnotationOrDefinitionOrTypeOrDefault("containerless", e, s, returnFalse), t.fromAnnotationOrDefinitionOrTypeOrDefault("shadowOptions", e, s, returnNull), t.fromAnnotationOrDefinitionOrTypeOrDefault("hasSlots", e, s, returnFalse), t.fromAnnotationOrDefinitionOrTypeOrDefault("enhance", e, s, returnFalse), t.mergeArrays(e.watches, it.getAnnotation(s), s.watches), t.fromAnnotationOrDefinitionOrTypeOrDefault("processContent", e, s, returnNull));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) {
            return t;
        }
        if (nt.has(t)) {
            return nt.get(t);
        }
        const e = CustomElementDefinition.create(t);
        nt.set(t, e);
        h(ot, e, e.Type);
        return e;
    }
    register(t) {
        const {Type: e, key: s, aliases: i} = this;
        if (!t.has(s, false)) {
            q(s, e).register(t);
            L(s, e).register(t);
            registerAliases(i, at, s, t);
        }
    }
    toString() {
        return `au:ce:${this.name}`;
    }
}

const rt = {
    name: undefined,
    searchParents: false,
    optional: false
};

const returnZero = () => 0;

const returnNull = () => null;

const returnFalse = () => false;

const returnTrue = () => true;

const returnEmptyArray = () => t.emptyArray;

const ot = /*@__PURE__*/ f("custom-element");

const getElementKeyFrom = t => `${ot}:${t}`;

const lt = /*@__PURE__*/ (() => {
    let t = 0;
    return () => `unnamed-${++t}`;
})();

const annotateElementMetadata = (t, e, s) => {
    h(u(e), s, t);
};

const defineElement = (t, e) => {
    const s = CustomElementDefinition.create(t, e);
    h(ot, s, s.Type);
    h(ot, s, s);
    d(s.Type, ot);
    return s.Type;
};

const isElementType = t => isFunction(t) && l(ot, t);

const findElementControllerFor = (t, e = rt) => {
    if (e.name === void 0 && e.searchParents !== true) {
        const s = getRef(t, ot);
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
            const s = getRef(t, ot);
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
            const t = getRef(s, ot);
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
        const t = getRef(s, ot);
        if (t !== null) {
            return t;
        }
        s = getEffectiveParentNode(s);
    }
    throw createMappedError(765, t);
};

const getElementAnnotation = (t, e) => r(u(e), t);

const getElementDefinition = t => {
    const e = r(ot, t);
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

const ht = /*@__PURE__*/ function() {
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
        S(n, "name", t);
        if (i !== e) {
            y(n.prototype, i);
        }
        return n;
    };
}();

const at = w({
    name: ot,
    keyFrom: getElementKeyFrom,
    isType: isElementType,
    for: findElementControllerFor,
    define: defineElement,
    getDefinition: getElementDefinition,
    annotate: annotateElementMetadata,
    getAnnotation: getElementAnnotation,
    generateName: lt,
    createInjectable: createElementInjectable,
    generateType: ht
});

const ct = /*@__PURE__*/ u("processContent");

function processContent(t) {
    return t === void 0 ? function(t, e, s) {
        h(ct, ensureHook(t, e), t);
    } : function(e) {
        t = ensureHook(e, t);
        const s = r(ot, e);
        if (s !== void 0) {
            s.processContent = t;
        } else {
            h(ct, t, e);
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
                addListener(this.L, e, this);
            }
            this.P = true;
            this.q?.();
        }
    }));
    defineHiddenProp(s, "unsubscribe", (function(t) {
        if (this.subs.remove(t) && this.subs.count === 0) {
            for (e of this.cf.events) {
                removeListener(this.L, e, this);
            }
            this.P = false;
            this.M?.();
        }
    }));
    defineHiddenProp(s, "useConfig", (function(t) {
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
                t[l] = this.H;
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
        const s = y({}, ...this.modules);
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
        }, e.inject = [ z ], e));
        t.register(i, P(X, s));
    }
}

function shadowCSS(...t) {
    return new ShadowDOMRegistry(t);
}

const ut = /*@__PURE__*/ I("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
    if (AdoptedStyleSheetsStyles.supported(t.get(W))) {
        return t.get(AdoptedStyleSheetsStylesFactory);
    }
    return t.get(StyleElementStylesFactory);
}))));

class ShadowDOMRegistry {
    constructor(t) {
        this.css = t;
    }
    register(t) {
        const e = t.get(dt);
        const s = t.get(ut);
        t.register(P(ft, s.createStyles(this.css, e)));
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

AdoptedStyleSheetsStylesFactory.inject = [ W ];

class StyleElementStylesFactory {
    constructor(t) {
        this.p = t;
    }
    createStyles(t, e) {
        return new StyleElementStyles(this.p, t, e);
    }
}

StyleElementStylesFactory.inject = [ W ];

const ft = /*@__PURE__*/ I("IShadowDOMStyles");

const dt = /*@__PURE__*/ I("IShadowDOMGlobalStyles", (e => e.instance({
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

const pt = {
    shadowDOM(e) {
        return j.creating(t.IContainer, (t => {
            if (e.sharedStyles != null) {
                const s = t.get(ut);
                t.register(P(dt, s.createStyles(e.sharedStyles, null)));
            }
        }));
    }
};

function valueConverter(t) {
    return function(e) {
        return xt.define(t, e);
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
        return new ValueConverterDefinition(s, t.firstDefined(getConverterAnnotation(s, "name"), i), t.mergeArrays(getConverterAnnotation(s, "aliases"), n.aliases, s.aliases), xt.keyFrom(i));
    }
    register(e) {
        const {Type: s, key: i, aliases: n} = this;
        t.Registration.singleton(i, s).register(e);
        t.Registration.aliasTo(i, s).register(e);
        registerAliases(n, xt, i, e);
    }
}

const mt = f("value-converter");

const getConverterAnnotation = (t, e) => r(u(e), t);

const xt = w({
    name: mt,
    keyFrom: t => `${mt}:${t}`,
    isType(t) {
        return isFunction(t) && l(mt, t);
    },
    define(t, e) {
        const s = ValueConverterDefinition.create(t, e);
        h(mt, s, s.Type);
        h(mt, s, s);
        d(e, mt);
        return s.Type;
    },
    getDefinition(t) {
        const e = r(mt, t);
        if (e === void 0) {
            throw createMappedError(152, t);
        }
        return e;
    },
    annotate(t, e, s) {
        h(u(e), s, t);
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
        S(n, "strict", {
            enumerable: true,
            get: function() {
                return t;
            }
        });
    }
    S(n, "strictFnCall", {
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
        const e = xt.keyFrom(t);
        let s = gt.get(this);
        if (s == null) {
            gt.set(this, s = new ResourceLookup);
        }
        return s[e] ?? (s[e] = this.l.get(resource(e)));
    }));
    defineHiddenProp(n, "getBehavior", (function(t) {
        const e = M.keyFrom(t);
        let s = gt.get(this);
        if (s == null) {
            gt.set(this, s = new ResourceLookup);
        }
        return s[e] ?? (s[e] = this.l.get(resource(e)));
    }));
};

const gt = new WeakMap;

class ResourceLookup {}

const vt = /*@__PURE__*/ I("IFlushQueue", (t => t.singleton(FlushQueue)));

class FlushQueue {
    constructor() {
        this.$ = false;
        this.j = new Set;
    }
    get count() {
        return this.j.size;
    }
    add(t) {
        this.j.add(t);
        if (this.$) {
            return;
        }
        this.$ = true;
        try {
            this.j.forEach(flushItem);
        } finally {
            this.$ = false;
        }
    }
    clear() {
        this.j.clear();
        this.$ = false;
    }
}

function flushItem(t, e, s) {
    s.delete(t);
    t.flush();
}

const bt = new WeakSet;

const mixingBindingLimited = (t, e) => {
    defineHiddenProp(t.prototype, "limit", (function(t) {
        if (bt.has(this)) {
            throw createMappedError(9996);
        }
        bt.add(this);
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
                bt.delete(this);
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
        l = i?.status === 0;
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
        a = i?.status === 0;
        u();
        if (a) {
            callOriginalCallback();
        }
    };
    return fn;
};

const {enter: wt, exit: yt} = s.ConnectableSwitcher;

const {wrap: kt, unwrap: Ct} = s.ProxyObservable;

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
        if (!B(s, e)) {
            this.cb.call(t, s, e, t);
        }
    }
    compute() {
        this.running = true;
        this.obs.version++;
        try {
            wt(this);
            return this.v = Ct(this.$get.call(void 0, this.useProxy ? kt(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            yt(this);
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
        this.W = i;
        this.cb = n;
    }
    handleChange(t) {
        const e = this.W;
        const i = this.obj;
        const n = this.v;
        const r = e.$kind === 2 && this.obs.count === 1;
        if (!r) {
            this.obs.version++;
            t = s.astEvaluate(e, this.scope, this, this);
            this.obs.clear();
        }
        if (!B(t, n)) {
            this.v = t;
            this.cb.call(i, t, n, i);
        }
    }
    bind() {
        if (this.isBound) {
            return;
        }
        this.obs.version++;
        this.v = s.astEvaluate(this.W, this.scope, this, this);
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

const At = /*@__PURE__*/ I("ILifecycleHooks");

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
        while (i !== v) {
            for (const t of k(i)) {
                if (t !== "constructor" && !t.startsWith("_")) {
                    s.add(t);
                }
            }
            i = Object.getPrototypeOf(i);
        }
        return new LifecycleHooksDefinition(e, s);
    }
    register(t) {
        E(At, this.Type).register(t);
    }
}

const Bt = new WeakMap;

const St = u("lifecycle-hooks");

const _t = w({
    name: St,
    define(t, e) {
        const s = LifecycleHooksDefinition.create(t, e);
        h(St, s, e);
        d(e, St);
        return s.Type;
    },
    resolve(t) {
        let e = Bt.get(t);
        if (e === void 0) {
            Bt.set(t, e = new LifecycleHooksLookupImpl);
            const s = t.root;
            const i = s.id === t.id ? t.getAll(At) : t.has(At, false) ? s.getAll(At).concat(t.getAll(At)) : s.getAll(At);
            let n;
            let l;
            let h;
            let a;
            let c;
            for (n of i) {
                l = r(St, n.constructor);
                h = new LifecycleHooksEntry(l, n);
                for (a of l.propertyNames) {
                    c = e[a];
                    if (c === void 0) {
                        e[a] = [ h ];
                    } else {
                        c.push(h);
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
        return _t.define({}, t);
    };
}

const Rt = {
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
                let n = g(t);
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
                    e.setAttribute(s, g(t));
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
        const e = s.astEvaluate(this.ast, this.s, this, (this.mode & 2) > 0 ? this : null);
        this.obs.clear();
        if (e !== this.v) {
            this.v = e;
            const s = this.G.state !== 1;
            if (s) {
                t = this.U;
                this.U = this.A.queueTask((() => {
                    this.U = null;
                    this.updateTarget(e);
                }), Rt);
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
        if (this.mode & (2 | 1)) {
            this.updateTarget(this.v = s.astEvaluate(this.ast, t, this, (this.mode & 2) > 0 ? this : null));
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

const Tt = {
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
        this.X = s.getAccessor(r, l);
        const a = n.expressions;
        const c = this.partBindings = Array(a.length);
        const u = a.length;
        let f = 0;
        for (;u > f; ++f) {
            c[f] = new InterpolationPartBinding(a[f], r, l, e, s, this);
        }
    }
    K() {
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
        const r = this.X;
        const l = this.G.state !== 1 && (r.type & 4) > 0;
        let h;
        if (l) {
            h = this.U;
            this.U = this.A.queueTask((() => {
                this.U = null;
                r.setValue(i, this.target, this.targetProperty);
            }), Tt);
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
        this.mode = 2;
        this.task = null;
        this.isBound = false;
        this.v = "";
        this.boundFn = false;
        this.l = i;
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
        const t = s.astEvaluate(this.ast, this.s, this, (this.mode & 2) > 0 ? this : null);
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
        this.v = s.astEvaluate(this.ast, this.s, this, (this.mode & 2) > 0 ? this : null);
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

const It = {
    reusable: false,
    preempt: true
};

class ContentBinding {
    constructor(t, e, s, i, n, r, l) {
        this.p = n;
        this.ast = r;
        this.target = l;
        this.isBound = false;
        this.mode = 2;
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
        e.textContent = g(t ?? "");
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = s.astEvaluate(this.ast, this.s, this, (this.mode & 2) > 0 ? this : null);
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
        const t = this.v = s.astEvaluate(this.ast, this.s, this, (this.mode & 2) > 0 ? this : null);
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
        s.astBind(this.ast, t, this);
        const e = this.v = s.astEvaluate(this.ast, this.s, this, (this.mode & 2) > 0 ? this : null);
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
        }), It);
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
        this.X = void 0;
        this.U = null;
        this.tt = null;
        this.boundFn = false;
        this.l = e;
        this.G = t;
        this.A = i;
        this.oL = s;
    }
    updateTarget(t) {
        this.X.setValue(t, this.target, this.targetProperty);
    }
    updateSource(t) {
        s.astAssign(this.ast, this.s, this, t);
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = s.astEvaluate(this.ast, this.s, this, (this.mode & 2) > 0 ? this : null);
        this.obs.clear();
        const e = this.G.state !== 1 && (this.X.type & 4) > 0;
        if (e) {
            Et = this.U;
            this.U = this.A.queueTask((() => {
                this.updateTarget(t);
                this.U = null;
            }), Lt);
            Et?.cancel();
            Et = null;
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
        let n = this.X;
        if (!n) {
            if (i & 4) {
                n = e.getObserver(this.target, this.targetProperty);
            } else {
                n = e.getAccessor(this.target, this.targetProperty);
            }
            this.X = n;
        }
        const r = (i & 2) > 0;
        if (i & (2 | 1)) {
            this.updateTarget(s.astEvaluate(this.ast, this.s, this, r ? this : null));
        }
        if (i & 4) {
            n.subscribe(this.tt ?? (this.tt = new BindingTargetSubscriber(this, this.l.get(vt))));
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

s.connectable(PropertyBinding);

mixinAstEvaluator(true, false)(PropertyBinding);

let Et = null;

const Lt = {
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
    constructor(t, e, s, i, n) {
        this.ast = e;
        this.target = s;
        this.targetEvent = i;
        this.isBound = false;
        this.self = false;
        this.boundFn = true;
        this.l = t;
        this.et = n;
    }
    callSource(t) {
        const e = this.s.overrideContext;
        e.$event = t;
        let i = s.astEvaluate(this.ast, this.s, this, null);
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
        s.astBind(this.ast, t, this);
        this.target.addEventListener(this.targetEvent, this, this.et);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        s.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.target.removeEventListener(this.targetEvent, this, this.et);
    }
}

mixinUseScope(ListenerBinding);

mixingBindingLimited(ListenerBinding, (() => "callSource"));

mixinAstEvaluator(true, true)(ListenerBinding);

const Pt = /*@__PURE__*/ I("IViewFactory");

class ViewFactory {
    constructor(t, e) {
        this.isCaching = false;
        this.st = null;
        this.it = -1;
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
            if (this.it === -1 || !e) {
                this.it = t;
            }
        }
        if (this.it > 0) {
            this.st = [];
        } else {
            this.st = null;
        }
        this.isCaching = this.it > 0;
    }
    canReturnToCache(t) {
        return this.st != null && this.st.length < this.it;
    }
    tryReturnToCache(t) {
        if (this.canReturnToCache(t)) {
            this.st.push(t);
            return true;
        }
        return false;
    }
    create(t) {
        const e = this.st;
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

const qt = /*@__PURE__*/ I("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

const Dt = /*@__PURE__*/ I("IAuSlotWatcher");

class AuSlotWatcherBinding {
    constructor(e, s, i, n) {
        this.nt = new Set;
        this.rt = t.emptyArray;
        this.isBound = false;
        this.cb = (this.o = e)[s];
        this.slotName = i;
        this.ot = n;
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
        const s = this.rt;
        const i = [];
        let n;
        let r;
        for (n of this.nt) {
            for (r of n === t ? e : n.nodes) {
                if (this.ot === "*" || r.nodeType === 1 && r.matches(this.ot)) {
                    i[i.length] = r;
                }
            }
        }
        if (i.length !== s.length || i.some(((t, e) => t !== s[e]))) {
            this.rt = i;
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
        this.lt = t;
    }
    register(t) {
        P(At, this).register(t);
    }
    hydrating(t, e) {
        const s = this.lt;
        const i = new AuSlotWatcherBinding(t, s.callback ?? `${g(s.name)}Changed`, s.slotName ?? "default", s.query ?? "*");
        S(t, s.name, {
            enumerable: true,
            configurable: true,
            get: y((() => i.getValue()), {
                getObserver: () => i
            }),
            set: () => {}
        });
        P(Dt, i).register(e.container);
        e.addBinding(i);
    }
}

function slotted(t, e) {
    if (!Mt) {
        Mt = true;
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
        let a = at.getAnnotation(h, i);
        if (a == null) {
            at.annotate(h, i, a = []);
        }
        a.push(new SlottedLifecycleHooks(l));
    }
    return decorator;
}

let Mt = false;

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
                  case "hs":
                    renderSpreadInstruction(e + 1);
                    break;

                  case "hp":
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
        if (t.vmKind !== 1) {
            throw createMappedError(9998);
        }
        this.$controller.addChild(t);
    }
}

exports.InstructionType = void 0;

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
})(exports.InstructionType || (exports.InstructionType = {}));

const Ft = /*@__PURE__*/ I("Instruction");

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
    constructor(t, e, s) {
        this.from = t;
        this.to = e;
        this.mode = s;
        this.type = "rg";
    }
}

class IteratorBindingInstruction {
    constructor(t, e, s) {
        this.forOf = t;
        this.to = e;
        this.props = s;
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
    constructor(t, e, s) {
        this.value = t;
        this.to = e;
        this.command = s;
        this.type = "rl";
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
        this.type = "ra";
        this.auSlot = null;
    }
}

class HydrateAttributeInstruction {
    constructor(t, e, s) {
        this.res = t;
        this.alias = e;
        this.props = s;
        this.type = "rb";
    }
}

class HydrateTemplateController {
    constructor(t, e, s, i) {
        this.def = t;
        this.res = e;
        this.alias = s;
        this.props = i;
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
    constructor(t) {
        this.from = t;
        this.type = "ha";
    }
}

class ListenerBindingInstruction {
    constructor(t, e, s, i) {
        this.from = t;
        this.to = e;
        this.preventDefault = s;
        this.capture = i;
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
    constructor(t, e, s) {
        this.attr = t;
        this.from = e;
        this.to = s;
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

const Ht = /*@__PURE__*/ I("ITemplateCompiler");

const Ot = /*@__PURE__*/ I("IRenderer");

function renderer(t) {
    return function decorator(e) {
        e.register = function(t) {
            E(Ot, this).register(t);
        };
        S(e.prototype, "target", {
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

exports.SetPropertyRenderer = __decorate([ renderer("re") ], exports.SetPropertyRenderer);

exports.CustomElementRenderer = class CustomElementRenderer {
    constructor() {
        this.r = t.resolve(Gt);
    }
    render(e, s, i, n, r, l) {
        let h;
        let a;
        let c;
        let u;
        const f = i.res;
        const d = i.projections;
        const p = e.container;
        switch (typeof f) {
          case "string":
            h = p.find(at, f);
            if (h == null) {
                throw createMappedError(752, i, e);
            }
            break;

          default:
            h = f;
        }
        const m = i.containerless || h.containerless;
        const x = m ? convertToRenderLocation(s) : null;
        const g = createElementContainer(n, e, s, i, x, d == null ? void 0 : new AuSlotsInfo(C(d)));
        a = h.Type;
        c = g.invoke(a);
        registerResolver(g, a, new t.InstanceProvider(h.key, c));
        u = Controller.$el(g, c, s, i, h, x);
        setRef(s, h.key, u);
        const v = this.r.renderers;
        const b = i.props;
        const w = b.length;
        let y = 0;
        let k;
        while (w > y) {
            k = b[y];
            v[k.type].render(e, u, k, n, r, l);
            ++y;
        }
        e.addChild(u);
    }
};

exports.CustomElementRenderer = __decorate([ renderer("ra") ], exports.CustomElementRenderer);

exports.CustomAttributeRenderer = class CustomAttributeRenderer {
    constructor() {
        this.r = t.resolve(Gt);
    }
    render(t, e, s, i, n, r) {
        let l = t.container;
        let h;
        switch (typeof s.res) {
          case "string":
            h = l.find(tt, s.res);
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

exports.CustomAttributeRenderer = __decorate([ renderer("rb") ], exports.CustomAttributeRenderer);

exports.TemplateControllerRenderer = class TemplateControllerRenderer {
    constructor() {
        this.r = t.resolve(Gt);
    }
    render(t, e, s, i, n, r) {
        let l = t.container;
        let h;
        switch (typeof s.res) {
          case "string":
            h = l.find(tt, s.res);
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
        let x = 0;
        let g;
        while (m > x) {
            g = p[x];
            d[g.type].render(t, f, g, i, n, r);
            ++x;
        }
        t.addChild(f);
    }
};

exports.TemplateControllerRenderer = __decorate([ renderer("rc") ], exports.TemplateControllerRenderer);

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
            f = ensureExpression(n, u.from, 16);
            t.addBinding(new LetBinding(a, r, f, u.to, h));
            ++d;
        }
    }
};

exports.LetElementRenderer = __decorate([ renderer("rd") ], exports.LetElementRenderer);

exports.RefBindingRenderer = class RefBindingRenderer {
    render(t, e, s, i, n) {
        t.addBinding(new RefBinding(t.container, ensureExpression(n, s.from, 16), getRefTarget(e, s.to)));
    }
};

exports.RefBindingRenderer = __decorate([ renderer("rj") ], exports.RefBindingRenderer);

exports.InterpolationBindingRenderer = class InterpolationBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new InterpolationBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, 1), getTarget(e), s.to, 2));
    }
};

exports.InterpolationBindingRenderer = __decorate([ renderer("rf") ], exports.InterpolationBindingRenderer);

exports.PropertyBindingRenderer = class PropertyBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, 16), getTarget(e), s.to, s.mode));
    }
};

exports.PropertyBindingRenderer = __decorate([ renderer("rg") ], exports.PropertyBindingRenderer);

exports.IteratorBindingRenderer = class IteratorBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.forOf, 2), getTarget(e), s.to, 2));
    }
};

exports.IteratorBindingRenderer = __decorate([ renderer("rk") ], exports.IteratorBindingRenderer);

exports.TextBindingRenderer = class TextBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, i.domWriteQueue, i, ensureExpression(n, s.from, 16), e));
    }
};

exports.TextBindingRenderer = __decorate([ renderer("ha") ], exports.TextBindingRenderer);

exports.ListenerBindingRenderer = class ListenerBindingRenderer {
    render(t, e, s, i, n) {
        t.addBinding(new ListenerBinding(t.container, ensureExpression(n, s.from, 8), e, s.to, new ListenerBindingOptions(s.preventDefault, s.capture)));
    }
};

exports.ListenerBindingRenderer = __decorate([ renderer("hb") ], exports.ListenerBindingRenderer);

exports.SetAttributeRenderer = class SetAttributeRenderer {
    render(t, e, s) {
        e.setAttribute(s.to, s.value);
    }
};

exports.SetAttributeRenderer = __decorate([ renderer("he") ], exports.SetAttributeRenderer);

exports.SetClassAttributeRenderer = class SetClassAttributeRenderer {
    render(t, e, s) {
        addClasses(e.classList, s.value);
    }
};

exports.SetClassAttributeRenderer = __decorate([ renderer("hf") ], exports.SetClassAttributeRenderer);

exports.SetStyleAttributeRenderer = class SetStyleAttributeRenderer {
    render(t, e, s) {
        e.style.cssText += s.value;
    }
};

exports.SetStyleAttributeRenderer = __decorate([ renderer("hg") ], exports.SetStyleAttributeRenderer);

exports.StylePropertyBindingRenderer = class StylePropertyBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, 16), e.style, s.to, 2));
    }
};

exports.StylePropertyBindingRenderer = __decorate([ renderer("hd") ], exports.StylePropertyBindingRenderer);

exports.AttributeBindingRenderer = class AttributeBindingRenderer {
    render(t, e, s, i, n, r) {
        const l = t.container;
        const h = l.has(X, false) ? l.get(X) : null;
        t.addBinding(new AttributeBinding(t, l, r, i.domWriteQueue, ensureExpression(n, s.from, 16), e, s.attr, h == null ? s.to : s.to.split(/\s/g).map((t => h[t] ?? t)).join(" "), 2));
    }
};

exports.AttributeBindingRenderer = __decorate([ renderer("hc") ], exports.AttributeBindingRenderer);

exports.SpreadRenderer = class SpreadRenderer {
    constructor() {
        this.ut = t.resolve(Ht);
        this.r = t.resolve(Gt);
    }
    render(t, e, s, i, n, r) {
        SpreadBinding.create(t.container.get(ee), e, void 0, this.r, this.ut, i, n, r).forEach((e => t.addBinding(e)));
    }
};

exports.SpreadRenderer = __decorate([ renderer("hs") ], exports.SpreadRenderer);

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

const Vt = "IController";

const Nt = "IInstruction";

const $t = "IRenderLocation";

const jt = "ISlotsInfo";

function createElementContainer(e, s, i, n, r, l) {
    const h = s.container.createChild();
    registerHostNode(h, e, i);
    registerResolver(h, te, new t.InstanceProvider(Vt, s));
    registerResolver(h, Ft, new t.InstanceProvider(Nt, n));
    registerResolver(h, G, r == null ? Wt : new RenderLocationProvider(r));
    registerResolver(h, Pt, zt);
    registerResolver(h, qt, l == null ? Ut : new t.InstanceProvider(jt, l));
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
    registerResolver(u, te, new t.InstanceProvider(Vt, c));
    registerResolver(u, Ft, new t.InstanceProvider(Nt, r));
    registerResolver(u, G, h == null ? Wt : new t.InstanceProvider($t, h));
    registerResolver(u, Pt, l == null ? zt : new ViewFactoryProvider(l));
    registerResolver(u, qt, a == null ? Ut : new t.InstanceProvider(jt, a));
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

const Wt = new RenderLocationProvider(null);

const zt = new ViewFactoryProvider(null);

const Ut = new t.InstanceProvider(jt, new AuSlotsInfo(t.emptyArray));

const Gt = /*@__PURE__*/ I("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.ft ?? (this.ft = this.dt.getAll(Ot, false).reduce(((t, e) => {
            t[e.target] = e;
            return t;
        }), createLookup()));
    }
    constructor() {
        this.xt = new WeakMap;
        this.gt = new WeakMap;
        const e = this.dt = t.resolve(t.IContainer).root;
        this.p = e.get(W);
        this.ep = e.get(s.IExpressionParser);
        this.oL = e.get(s.IObserverLocator);
        this.vt = new FragmentNodeSequence(this.p, this.p.document.createDocumentFragment());
    }
    compile(t, e, s) {
        if (t.needsCompile !== false) {
            const i = this.xt;
            const n = e.get(Ht);
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
            return new FragmentNodeSequence(this.p, this.bt(t.template));
        }
        let e;
        let s = false;
        const i = this.gt;
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
            this.bt(e);
            i.set(t, e);
        }
        return e == null ? this.vt : new FragmentNodeSequence(this.p, s ? r.importNode(e, true) : r.adoptNode(e.cloneNode(true)));
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
    wt() {
        return this.p.document.createElement("au-m");
    }
    bt(t) {
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
                e.insertBefore(this.wt(), i);
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

var Xt;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["host"] = 1] = "host";
    t[t["shadowRoot"] = 2] = "shadowRoot";
    t[t["location"] = 3] = "location";
})(Xt || (Xt = {}));

const Qt = {
    optional: true
};

const Kt = optionalResource(s.ICoercionConfiguration);

const Yt = new WeakMap;

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
        this.r = t.root.get(Gt);
        this.coercion = e === 2 ? void 0 : t.get(Kt);
    }
    static getCached(t) {
        return Yt.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (e === void 0) {
            throw createMappedError(500, t);
        }
        return e;
    }
    static $el(e, s, i, n, r = void 0, l = null) {
        if (Yt.has(s)) {
            return Yt.get(s);
        }
        r = r ?? getElementDefinition(s.constructor);
        const h = new Controller(e, 0, r, null, s, i, l);
        const a = e.get(t.optional(ee));
        if (r.dependencies.length > 0) {
            e.register(...r.dependencies);
        }
        registerResolver(e, ee, new t.InstanceProvider("IHydrationContext", new HydrationContext(h, n, a)));
        Yt.set(s, h);
        if (n == null || n.hydrate !== false) {
            h.hE(n, a);
        }
        return h;
    }
    static $attr(t, e, s, i) {
        if (Yt.has(e)) {
            return Yt.get(e);
        }
        i = i ?? getAttributeDefinition(e.constructor);
        const n = new Controller(t, 1, i, null, e, s, null);
        if (i.dependencies.length > 0) {
            t.register(...i.dependencies);
        }
        Yt.set(e, n);
        n.Tt();
        return n;
    }
    static $view(t, e = void 0) {
        const s = new Controller(t.container, 2, null, t, null, null, null);
        s.parent = e ?? null;
        s.It();
        return s;
    }
    hE(e, i) {
        const n = this.container;
        const r = this.kt;
        let l = this.definition;
        this.scope = s.Scope.create(r, null, true);
        if (l.watches.length > 0) {
            createWatchers(this, n, l, r);
        }
        createObservers(this, l, r);
        if (this.Ct.Et) {
            const t = r.define(this, i, l);
            if (t !== void 0 && t !== l) {
                l = CustomElementDefinition.getOrCreate(t);
            }
        }
        this.yt = _t.resolve(n);
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
        if (this.yt.hydrating != null) {
            this.yt.hydrating.forEach(callHydratingHook, this);
        }
        if (this.Ct.Lt) {
            this.kt.hydrating(this);
        }
        const e = this.Pt = this.r.compile(this.definition, this.container, t);
        const {shadowOptions: s, hasSlots: i, containerless: n} = e;
        let r = this.location;
        if ((this.hostController = findElementControllerFor(this.host, Qt)) !== null) {
            this.host = this.container.root.get(W).document.createElement(this.definition.name);
            if (n && r == null) {
                r = this.location = convertToRenderLocation(this.host);
            }
        }
        setRef(this.host, ot, this);
        setRef(this.host, this.definition.key, this);
        if (s !== null || i) {
            if (r != null) {
                throw createMappedError(501);
            }
            setRef(this.shadowRoot = this.host.attachShadow(s ?? Jt), ot, this);
            setRef(this.shadowRoot, this.definition.key, this);
            this.mountTarget = 2;
        } else if (r != null) {
            setRef(r, ot, this);
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
        if (this.Ct.qt) {
            this.kt.hydrated(this);
        }
    }
    hC() {
        this.r.render(this, this.nodes.findTargets(), this.Pt, this.host);
        if (this.yt.created !== void 0) {
            this.yt.created.forEach(callCreatedHook, this);
        }
        if (this.Ct.Dt) {
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
        this.yt = _t.resolve(this.container);
        if (this.yt.created !== void 0) {
            this.yt.created.forEach(callCreatedHook, this);
        }
        if (this.Ct.Dt) {
            this.kt.created(this);
        }
    }
    It() {
        this.Pt = this.r.compile(this.viewFactory.def, this.container, null);
        this.r.render(this, (this.nodes = this.r.createNodes(this.Pt)).findTargets(), this.Pt, void 0);
    }
    activate(e, s, i) {
        switch (this.state) {
          case 0:
          case 8:
            if (!(s === null || s.isActive)) {
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
        this.parent = s;
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
        this.$initiator = e;
        this.Mt();
        let n = void 0;
        if (this.vmKind !== 2 && this.yt.binding != null) {
            n = t.onResolveAll(...this.yt.binding.map(callBindingHook, this));
        }
        if (this.Ct.Ft) {
            n = t.onResolveAll(n, this.kt.binding(this.$initiator, this.parent));
        }
        if (isPromise(n)) {
            this.Ht();
            n.then((() => {
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
        if (this.vmKind !== 2 && this.yt.bound != null) {
            i = t.onResolveAll(...this.yt.bound.map(callBoundHook, this));
        }
        if (this.Ct.Nt) {
            i = t.onResolveAll(i, this.kt.bound(this.$initiator, this.parent));
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
    jt(...t) {
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
                this.hostController.jt(this.host);
                break;

              case 3:
                this.hostController.jt(this.location.$start, this.location);
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
                const e = t.has(ft, false) ? t.get(ft) : t.get(dt);
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
        if (this.vmKind !== 2 && this.yt.attaching != null) {
            s = t.onResolveAll(...this.yt.attaching.map(callAttachingHook, this));
        }
        if (this.Ct.Wt) {
            s = t.onResolveAll(s, this.kt.attaching(this.$initiator, this.parent));
        }
        if (isPromise(s)) {
            this.Ht();
            this.Mt();
            s.then((() => {
                this.Ot();
            })).catch((t => {
                this.Vt(t);
            }));
        }
        if (this.children !== null) {
            for (;e < this.children.length; ++e) {
                void this.children[e].activate(this.$initiator, this, this.scope);
            }
        }
        this.Ot();
    }
    deactivate(e, s) {
        let i = void 0;
        switch (this.state & ~16) {
          case 2:
            this.state = 4;
            break;

          case 1:
            this.state = 4;
            i = this.$promise?.catch(t.noop);
            break;

          case 0:
          case 8:
          case 32:
          case 8 | 32:
            return;

          default:
            throw createMappedError(505, this.name, this.state);
        }
        this.$initiator = e;
        if (e === this) {
            this.zt();
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
                if (this.vmKind !== 2 && this.yt.detaching != null) {
                    r = t.onResolveAll(...this.yt.detaching.map(callDetachingHook, this));
                }
                if (this.Ct.Ut) {
                    r = t.onResolveAll(r, this.kt.detaching(this.$initiator, this.parent));
                }
            }
            if (isPromise(r)) {
                this.Ht();
                e.zt();
                r.then((() => {
                    e.Gt();
                })).catch((t => {
                    e.Vt(t);
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
            se = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            se();
            se = void 0;
        }
    }
    Vt(t) {
        if (this.$promise !== void 0) {
            ie = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            ie(t);
            ie = void 0;
        }
        if (this.$initiator !== this) {
            this.parent.Vt(t);
        }
    }
    Mt() {
        ++this.St;
        if (this.$initiator !== this) {
            this.parent.Mt();
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
                ne = t.onResolveAll(...this.yt.attached.map(callAttachedHook, this));
            }
            if (this.Ct.Qt) {
                ne = t.onResolveAll(ne, this.kt.attached(this.$initiator));
            }
            if (isPromise(ne)) {
                this.Ht();
                ne.then((() => {
                    this.state = 2;
                    this.Xt();
                    if (this.$initiator !== this) {
                        this.parent.Ot();
                    }
                })).catch((t => {
                    this.Vt(t);
                }));
                ne = void 0;
                return;
            }
            ne = void 0;
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
            let e = this.$initiator.head;
            let s = void 0;
            while (e !== null) {
                if (e !== this) {
                    if (e.debug) {
                        e.logger.trace(`detach()`);
                    }
                    e.removeNodes();
                }
                if (e.At) {
                    if (e.vmKind !== 2 && e.yt.unbinding != null) {
                        s = t.onResolveAll(...e.yt.unbinding.map(callUnbindingHook, e));
                    }
                    if (e.Ct.Yt) {
                        if (e.debug) {
                            e.logger.trace("unbinding()");
                        }
                        s = t.onResolveAll(s, e.viewModel.unbinding(e.$initiator, e.parent));
                    }
                }
                if (isPromise(s)) {
                    this.Ht();
                    this.Kt();
                    s.then((() => {
                        this.Zt();
                    })).catch((t => {
                        this.Vt(t);
                    }));
                }
                s = void 0;
                e = e.next;
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
            setRef(t, ot, this);
            setRef(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = 1;
        return this;
    }
    setShadowRoot(t) {
        if (this.vmKind === 0) {
            setRef(t, ot, this);
            setRef(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = 2;
        return this;
    }
    setLocation(t) {
        if (this.vmKind === 0) {
            setRef(t, ot, this);
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
            Yt.delete(this.kt);
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
    const l = k(r);
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

const Zt = new Map;

const getAccessScopeAst = t => {
    let e = Zt.get(t);
    if (e == null) {
        e = new s.AccessScopeExpression(t, 0);
        Zt.set(t, e);
    }
    return e;
};

function createWatchers(t, e, i, n) {
    const r = e.get(s.IObserverLocator);
    const l = e.get(s.IExpressionParser);
    const h = i.watches;
    const a = t.vmKind === 0 ? t.scope : s.Scope.create(n, null, true);
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
            d = isString(u) ? l.parse(u, 16) : getAccessScopeAst(u);
            t.addBinding(new ExpressionWatcher(a, e, r, d, f));
        }
    }
}

function isCustomElementController(t) {
    return t instanceof Controller && t.vmKind === 0;
}

function isCustomElementViewModel(t) {
    return e.isObject(t) && isElementType(t.constructor);
}

class HooksDefinition {
    constructor(t) {
        this.Et = "define" in t;
        this.Lt = "hydrating" in t;
        this.qt = "hydrated" in t;
        this.Dt = "created" in t;
        this.Ft = "binding" in t;
        this.Nt = "bound" in t;
        this.Wt = "attaching" in t;
        this.Qt = "attached" in t;
        this.Ut = "detaching" in t;
        this.Yt = "unbinding" in t;
        this.Jt = "dispose" in t;
        this.te = "accept" in t;
    }
}

HooksDefinition.none = new HooksDefinition({});

const Jt = {
    mode: "open"
};

exports.ViewModelKind = void 0;

(function(t) {
    t[t["customElement"] = 0] = "customElement";
    t[t["customAttribute"] = 1] = "customAttribute";
    t[t["synthetic"] = 2] = "synthetic";
})(exports.ViewModelKind || (exports.ViewModelKind = {}));

exports.State = void 0;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["activating"] = 1] = "activating";
    t[t["activated"] = 2] = "activated";
    t[t["deactivating"] = 4] = "deactivating";
    t[t["deactivated"] = 8] = "deactivated";
    t[t["released"] = 16] = "released";
    t[t["disposed"] = 32] = "disposed";
})(exports.State || (exports.State = {}));

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

const te = /*@__PURE__*/ I("IController");

const ee = /*@__PURE__*/ I("IHydrationContext");

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

let se;

let ie;

let ne;

const re = /*@__PURE__*/ I("IAppRoot");

class AppRoot {
    constructor(e, s, i, n) {
        this.config = e;
        this.platform = s;
        this.container = i;
        this.ee = void 0;
        this.host = e.host;
        n.prepare(this);
        registerHostNode(i, s, e.host);
        this.ee = t.onResolve(this.se("creating"), (() => {
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
            return t.onResolve(this.se("hydrating"), (() => {
                h.hS(null);
                return t.onResolve(this.se("hydrated"), (() => {
                    h.hC();
                    this.ee = void 0;
                }));
            }));
        }));
    }
    activate() {
        return t.onResolve(this.ee, (() => t.onResolve(this.se("activating"), (() => t.onResolve(this.controller.activate(this.controller, null, void 0), (() => this.se("activated")))))));
    }
    deactivate() {
        return t.onResolve(this.se("deactivating"), (() => t.onResolve(this.controller.deactivate(this.controller, null), (() => this.se("deactivated")))));
    }
    se(e) {
        return t.onResolveAll(...this.container.getAll($).reduce(((t, s) => {
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

const oe = /*@__PURE__*/ I("IAurelia");

class Aurelia {
    get isRunning() {
        return this.ir;
    }
    get isStarting() {
        return this.ie;
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
    constructor(e = t.DI.createContainer()) {
        this.container = e;
        this.ir = false;
        this.ie = false;
        this.ne = false;
        this.re = void 0;
        this.next = void 0;
        this.oe = void 0;
        this.le = void 0;
        if (e.has(oe, true) || e.has(Aurelia, true)) {
            throw createMappedError(768);
        }
        registerResolver(e, oe, new t.InstanceProvider("IAurelia", this));
        registerResolver(e, Aurelia, new t.InstanceProvider("Aurelia", this));
        registerResolver(e, re, this.he = new t.InstanceProvider("IAppRoot"));
    }
    register(...t) {
        this.container.register(...t);
        return this;
    }
    app(t) {
        this.next = new AppRoot(t, this.ae(t.host), this.container, this.he);
        return this;
    }
    enhance(e, s) {
        const i = e.container ?? this.container.createChild();
        const n = e.host;
        const r = this.ae(n);
        const l = e.component;
        let h;
        if (isFunction(l)) {
            registerHostNode(i, r, n);
            h = i.invoke(l);
        } else {
            h = l;
        }
        registerResolver(i, U, new t.InstanceProvider("IEventTarget", n));
        s = s ?? null;
        const a = Controller.$el(i, h, n, null, CustomElementDefinition.create({
            name: lt(),
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
    ae(t) {
        let e;
        if (!this.container.has(W, false)) {
            if (t.ownerDocument.defaultView === null) {
                throw createMappedError(769);
            }
            e = new i.BrowserPlatform(t.ownerDocument.defaultView);
            this.container.register(P(W, e));
        } else {
            e = this.container.get(W);
        }
        return e;
    }
    start(e = this.next) {
        if (e == null) {
            throw createMappedError(770);
        }
        if (isPromise(this.oe)) {
            return this.oe;
        }
        return this.oe = t.onResolve(this.stop(), (() => {
            Reflect.set(e.host, "$aurelia", this);
            this.he.prepare(this.re = e);
            this.ie = true;
            return t.onResolve(e.activate(), (() => {
                this.ir = true;
                this.ie = false;
                this.oe = void 0;
                this.ce(e, "au-started", e.host);
            }));
        }));
    }
    stop(e = false) {
        if (isPromise(this.le)) {
            return this.le;
        }
        if (this.ir === true) {
            const s = this.re;
            this.ir = false;
            this.ne = true;
            return this.le = t.onResolve(s.deactivate(), (() => {
                Reflect.deleteProperty(s.host, "$aurelia");
                if (e) {
                    s.dispose();
                }
                this.re = void 0;
                this.he.dispose();
                this.ne = false;
                this.ce(s, "au-stopped", s.host);
            }));
        }
    }
    dispose() {
        if (this.ir || this.ne) {
            throw createMappedError(771);
        }
        this.container.dispose();
    }
    ce(t, e, s) {
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
                this.has = this.pe;
                break;

              case 1:
                this.has = this.me;
                break;

              default:
                this.has = this.xe;
            }
        }
    }
    equals(t) {
        return this.chars === t.chars && this.repeat === t.repeat && this.isSymbol === t.isSymbol && this.isInverted === t.isInverted;
    }
    xe(t) {
        return this.chars.includes(t);
    }
    me(t) {
        return this.chars === t;
    }
    pe(t) {
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
        this.parts = t.emptyArray;
        this.ge = "";
        this.ve = {};
        this.be = {};
    }
    get pattern() {
        const t = this.ge;
        if (t === "") {
            return null;
        } else {
            return t;
        }
    }
    set pattern(e) {
        if (e == null) {
            this.ge = "";
            this.parts = t.emptyArray;
        } else {
            this.ge = e;
            this.parts = this.be[e];
        }
    }
    append(t, e) {
        const s = this.ve;
        if (s[t] === undefined) {
            s[t] = e;
        } else {
            s[t] += e;
        }
    }
    next(t) {
        const e = this.ve;
        let s;
        if (e[t] !== undefined) {
            s = this.be;
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
    get ge() {
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
        const s = this.ye;
        if (!s.includes(e)) {
            s.push(e);
        }
        let i = this.findChild(t);
        if (i == null) {
            i = new AttrParsingState(t, e);
            this.ke.push(i);
            if (t.repeat) {
                i.ke.push(i);
            }
        }
        return i;
    }
    findMatches(t, e) {
        const s = [];
        const i = this.ke;
        const n = i.length;
        let r = 0;
        let l = null;
        let h = 0;
        let a = 0;
        for (;h < n; ++h) {
            l = i[h];
            if (l.charSpec.has(t)) {
                s.push(l);
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
        return s;
    }
}

class StaticSegment {
    constructor(t) {
        this.text = t;
        const e = this.Ae = t.length;
        const s = this.Be = [];
        let i = 0;
        for (;e > i; ++i) {
            s.push(new CharSpec(t[i], false, false, false));
        }
    }
    eachChar(t) {
        const e = this.Ae;
        const s = this.Be;
        let i = 0;
        for (;e > i; ++i) {
            t(s[i]);
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

const le = /*@__PURE__*/ I("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

class SyntaxInterpreter {
    constructor() {
        this._e = new AttrParsingState(null);
        this.Re = [ this._e ];
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
            s = this._e;
            i = t[c];
            n = i.pattern;
            r = new SegmentTypes;
            l = this.Te(i, r);
            h = l.length;
            a = t => s = s.append(t, n);
            for (u = 0; h > u; ++u) {
                l[u].eachChar(a);
            }
            s.Ce = r;
            s.we = true;
            ++c;
        }
    }
    interpret(t) {
        const e = new Interpretation;
        const s = t.length;
        let i = this.Re;
        let n = 0;
        let r;
        for (;n < s; ++n) {
            i = this.Ie(i, t.charAt(n), e);
            if (i.length === 0) {
                break;
            }
        }
        i = i.filter(isEndpoint);
        if (i.length > 0) {
            i.sort(sortEndpoint);
            r = i[0];
            if (!r.charSpec.isSymbol) {
                e.next(r.ge);
            }
            e.pattern = r.ge;
        }
        return e;
    }
    Ie(t, e, s) {
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
    Te(t, e) {
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
    return t.we;
}

function sortEndpoint(t, e) {
    const s = t.Ce;
    const i = e.Ce;
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
    constructor(t, e, s, i) {
        this.rawName = t;
        this.rawValue = e;
        this.target = s;
        this.command = i;
    }
}

const he = /*@__PURE__*/ I("IAttributePattern");

const ae = /*@__PURE__*/ I("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor(e, s) {
        this.st = {};
        this.Ee = e;
        const i = this.ye = {};
        const n = s.reduce(((t, e) => {
            const s = getAllPatternDefinitions(e.constructor);
            s.forEach((t => i[t.pattern] = e));
            return t.concat(s);
        }), t.emptyArray);
        e.add(n);
    }
    parse(t, e) {
        let s = this.st[t];
        if (s == null) {
            s = this.st[t] = this.Ee.interpret(t);
        }
        const i = s.pattern;
        if (i == null) {
            return new AttrSyntax(t, e, t, null);
        } else {
            return this.ye[i][i](t, e, s.parts);
        }
    }
}

AttributeParser.inject = [ le, t.all(he) ];

function attributePattern(...t) {
    return function decorator(e) {
        return fe.define(t, e);
    };
}

class AttributePatternResourceDefinition {
    constructor(t) {
        this.Type = t;
        this.name = void 0;
    }
    register(t) {
        E(he, this.Type).register(t);
    }
}

const ce = f("attribute-pattern");

const ue = "attribute-pattern-definitions";

const getAllPatternDefinitions = e => t.Protocol.annotation.get(e, ue);

const fe = w({
    name: ce,
    definitionAnnotationKey: ue,
    define(e, s) {
        const i = new AttributePatternResourceDefinition(s);
        h(ce, i, s);
        d(s, ce);
        t.Protocol.annotation.set(s, ue, e);
        p(s, ue);
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
};

exports.AtPrefixedTriggerAttributePattern = __decorate([ attributePattern({
    pattern: "@PART",
    symbols: "@"
}) ], exports.AtPrefixedTriggerAttributePattern);

let de = class SpreadAttributePattern {
    "...$attrs"(t, e, s) {
        return new AttrSyntax(t, e, "", "...$attrs");
    }
};

de = __decorate([ attributePattern({
    pattern: "...$attrs",
    symbols: ""
}) ], de);

exports.CommandType = void 0;

(function(t) {
    t[t["None"] = 0] = "None";
    t[t["IgnoreAttr"] = 1] = "IgnoreAttr";
})(exports.CommandType || (exports.CommandType = {}));

function bindingCommand(t) {
    return function(e) {
        return me.define(t, e);
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
        E(s, e).register(t);
        L(s, e).register(t);
        registerAliases(i, me, s, t);
    }
}

const pe = /*@__PURE__*/ f("binding-command");

const getCommandKeyFrom = t => `${pe}:${t}`;

const getCommandAnnotation = (t, e) => r(u(e), t);

const me = w({
    name: pe,
    keyFrom: getCommandKeyFrom,
    define(t, e) {
        const s = BindingCommandDefinition.create(t, e);
        h(pe, s, s.Type);
        h(pe, s, s);
        d(e, pe);
        return s.Type;
    },
    getAnnotation: getCommandAnnotation
});

exports.OneTimeBindingCommand = class OneTimeBindingCommand {
    get type() {
        return 0;
    }
    build(e, s, i) {
        const n = e.attr;
        let r = n.target;
        let l = e.attr.rawValue;
        if (e.bindable == null) {
            r = i.map(e.node, r) ?? t.camelCase(r);
        } else {
            if (l === "" && e.def.type === 1) {
                l = t.camelCase(r);
            }
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(s.parse(l, 16), r, 1);
    }
};

exports.OneTimeBindingCommand = __decorate([ bindingCommand("one-time") ], exports.OneTimeBindingCommand);

exports.ToViewBindingCommand = class ToViewBindingCommand {
    get type() {
        return 0;
    }
    build(e, s, i) {
        const n = e.attr;
        let r = n.target;
        let l = e.attr.rawValue;
        if (e.bindable == null) {
            r = i.map(e.node, r) ?? t.camelCase(r);
        } else {
            if (l === "" && e.def.type === 1) {
                l = t.camelCase(r);
            }
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(s.parse(l, 16), r, 2);
    }
};

exports.ToViewBindingCommand = __decorate([ bindingCommand("to-view") ], exports.ToViewBindingCommand);

exports.FromViewBindingCommand = class FromViewBindingCommand {
    get type() {
        return 0;
    }
    build(e, s, i) {
        const n = e.attr;
        let r = n.target;
        let l = n.rawValue;
        if (e.bindable == null) {
            r = i.map(e.node, r) ?? t.camelCase(r);
        } else {
            if (l === "" && e.def.type === 1) {
                l = t.camelCase(r);
            }
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(s.parse(l, 16), r, 4);
    }
};

exports.FromViewBindingCommand = __decorate([ bindingCommand("from-view") ], exports.FromViewBindingCommand);

exports.TwoWayBindingCommand = class TwoWayBindingCommand {
    get type() {
        return 0;
    }
    build(e, s, i) {
        const n = e.attr;
        let r = n.target;
        let l = n.rawValue;
        if (e.bindable == null) {
            r = i.map(e.node, r) ?? t.camelCase(r);
        } else {
            if (l === "" && e.def.type === 1) {
                l = t.camelCase(r);
            }
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(s.parse(l, 16), r, 6);
    }
};

exports.TwoWayBindingCommand = __decorate([ bindingCommand("two-way") ], exports.TwoWayBindingCommand);

exports.DefaultBindingCommand = class DefaultBindingCommand {
    get type() {
        return 0;
    }
    build(e, s, i) {
        const n = e.attr;
        const r = e.bindable;
        let l;
        let h;
        let a = n.target;
        let c = n.rawValue;
        if (r == null) {
            h = i.isTwoWay(e.node, a) ? 6 : 2;
            a = i.map(e.node, a) ?? t.camelCase(a);
        } else {
            if (c === "" && e.def.type === 1) {
                c = t.camelCase(a);
            }
            l = e.def.defaultBindingMode;
            h = r.mode === 8 || r.mode == null ? l == null || l === 8 ? 2 : l : r.mode;
            a = r.name;
        }
        return new PropertyBindingInstruction(s.parse(c, 16), a, h);
    }
};

exports.DefaultBindingCommand = __decorate([ bindingCommand("bind") ], exports.DefaultBindingCommand);

exports.ForBindingCommand = class ForBindingCommand {
    get type() {
        return 0;
    }
    static get inject() {
        return [ ae ];
    }
    constructor(t) {
        this.Le = t;
    }
    build(e, s) {
        const i = e.bindable === null ? t.camelCase(e.attr.target) : e.bindable.name;
        const n = s.parse(e.attr.rawValue, 2);
        let r = t.emptyArray;
        if (n.semiIdx > -1) {
            const t = e.attr.rawValue.slice(n.semiIdx + 1);
            const s = t.indexOf(":");
            if (s > -1) {
                const e = t.slice(0, s).trim();
                const i = t.slice(s + 1).trim();
                const n = this.Le.parse(e, i);
                r = [ new MultiAttrInstruction(i, n.target, n.command) ];
            }
        }
        return new IteratorBindingInstruction(n, i, r);
    }
};

exports.ForBindingCommand = __decorate([ bindingCommand("for") ], exports.ForBindingCommand);

exports.TriggerBindingCommand = class TriggerBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, 8), t.attr.target, true, false);
    }
};

exports.TriggerBindingCommand = __decorate([ bindingCommand("trigger") ], exports.TriggerBindingCommand);

exports.CaptureBindingCommand = class CaptureBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, 8), t.attr.target, false, true);
    }
};

exports.CaptureBindingCommand = __decorate([ bindingCommand("capture") ], exports.CaptureBindingCommand);

exports.AttrBindingCommand = class AttrBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction(t.attr.target, e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

exports.AttrBindingCommand = __decorate([ bindingCommand("attr") ], exports.AttrBindingCommand);

exports.StyleBindingCommand = class StyleBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction("style", e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

exports.StyleBindingCommand = __decorate([ bindingCommand("style") ], exports.StyleBindingCommand);

exports.ClassBindingCommand = class ClassBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction("class", e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

exports.ClassBindingCommand = __decorate([ bindingCommand("class") ], exports.ClassBindingCommand);

let xe = class RefBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new RefBindingInstruction(e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

xe = __decorate([ bindingCommand("ref") ], xe);

let ge = class SpreadBindingCommand {
    get type() {
        return 1;
    }
    build(t) {
        return new SpreadBindingInstruction;
    }
};

ge = __decorate([ bindingCommand("...$attrs") ], ge);

const ve = /*@__PURE__*/ I("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

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
        return E(ve, this).register(t);
    }
    constructor(t) {
        this.Pe = y(createLookup(), {
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
        this.qe = o("a altGlyph animate animateColor circle clipPath defs ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feFlood feGaussianBlur feImage feMerge feMorphology feOffset feSpecularLighting feTile feTurbulence filter font foreignObject g glyph glyphRef image line linearGradient marker mask missing-glyph path pattern polygon polyline radialGradient rect stop svg switch symbol text textPath tref tspan use");
        this.De = o("alignment-baseline baseline-shift clip-path clip-rule clip color-interpolation-filters color-interpolation color-profile color-rendering color cursor direction display dominant-baseline enable-background fill-opacity fill-rule fill filter flood-color flood-opacity font-family font-size-adjust font-size font-stretch font-style font-variant font-weight glyph-orientation-horizontal glyph-orientation-vertical image-rendering kerning letter-spacing lighting-color marker-end marker-mid marker-start mask opacity overflow pointer-events shape-rendering stop-color stop-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width stroke text-anchor text-decoration text-rendering unicode-bidi visibility word-spacing writing-mode");
        this.SVGElement = t.globalThis.SVGElement;
        const e = t.document.createElement("div");
        e.innerHTML = "<svg><altGlyph /></svg>";
        if (e.firstElementChild.nodeName === "altglyph") {
            const t = this.Pe;
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
        return this.qe[t.nodeName] === true && this.De[e] === true || this.Pe[t.nodeName]?.[e] === true;
    }
}

SVGAnalyzer.inject = [ W ];

const be = /*@__PURE__*/ I("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    constructor() {
        this.fns = [];
        this.Me = createLookup();
        this.Fe = createLookup();
        this.svg = t.resolve(ve);
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
            i = (e = this.Me)[n] ?? (e[n] = createLookup());
            for (r in s) {
                if (i[r] !== void 0) {
                    throw createError(r, n);
                }
                i[r] = s[r];
            }
        }
    }
    useGlobalMapping(t) {
        const e = this.Fe;
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
        return this.Me[t.nodeName]?.[e] ?? this.Fe[e] ?? (isDataAttribute(t, e, this.svg) ? e : null);
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

exports.BindingMode = void 0;

(function(t) {
    t[t["oneTime"] = 1] = "oneTime";
    t[t["toView"] = 2] = "toView";
    t[t["fromView"] = 4] = "fromView";
    t[t["twoWay"] = 6] = "twoWay";
    t[t["default"] = 8] = "default";
})(exports.BindingMode || (exports.BindingMode = {}));

const we = createLookup();

class AttributeNSAccessor {
    static forNs(t) {
        return we[t] ?? (we[t] = new AttributeNSAccessor(t));
    }
    constructor(t) {
        this.ns = t;
        this.type = 2 | 4;
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
        this.type = 2 | 4;
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

const ye = new DataAttributeAccessor;

const ke = "au-start";

const Ce = "au-end";

const createElement = (t, e) => t.document.createElement(e);

const createComment = (t, e) => t.document.createComment(e);

const createLocation = t => {
    const e = createComment(t, Ce);
    e.$start = createComment(t, ke);
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

const Ae = {
    childList: true,
    subtree: true,
    characterData: true
};

function defaultMatcher$1(t, e) {
    return t === e;
}

class SelectValueObserver {
    constructor(t, e, s, i) {
        this.type = 2 | 1 | 4;
        this.v = void 0;
        this.ov = void 0;
        this.He = false;
        this.Oe = void 0;
        this.Ve = void 0;
        this.iO = false;
        this.P = false;
        this.L = t;
        this.oL = i;
        this.cf = s;
    }
    getValue() {
        return this.iO ? this.v : this.L.multiple ? getSelectedOptions(this.L.options) : this.L.value;
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
        const e = this.L;
        const s = isArray(t);
        const i = e.matcher ?? defaultMatcher$1;
        const n = e.options;
        let r = n.length;
        while (r-- > 0) {
            const e = n[r];
            const l = b.call(e, "model") ? e.model : e.value;
            if (s) {
                e.selected = t.findIndex((t => !!i(l, t))) !== -1;
                continue;
            }
            e.selected = !!i(l, t);
        }
    }
    syncValue() {
        const t = this.L;
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
                    h.push(b.call(r, "model") ? r.model : r.value);
                }
                ++n;
            }
            let a;
            n = 0;
            while (n < i.length) {
                a = i[n];
                if (h.findIndex((t => !!l(a, t))) === -1) {
                    i.splice(n, 1);
                } else {
                    ++n;
                }
            }
            n = 0;
            while (n < h.length) {
                a = h[n];
                if (i.findIndex((t => !!l(a, t))) === -1) {
                    i.push(a);
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
                r = b.call(l, "model") ? l.model : l.value;
                break;
            }
            ++n;
        }
        this.ov = this.v;
        this.v = r;
        return true;
    }
    q() {
        (this.Ve = createMutationObserver(this.L, this.$e.bind(this))).observe(this.L, Ae);
        this.Ne(this.v instanceof Array ? this.v : null);
        this.iO = true;
    }
    M() {
        this.Ve.disconnect();
        this.Oe?.unsubscribe(this);
        this.Ve = this.Oe = void 0;
        this.iO = false;
    }
    Ne(t) {
        this.Oe?.unsubscribe(this);
        this.Oe = void 0;
        if (t != null) {
            if (!this.L.multiple) {
                throw createError$1(`AUR0654`);
            }
            (this.Oe = this.oL.getArrayObserver(t)).subscribe(this);
        }
    }
    handleEvent() {
        const t = this.syncValue();
        if (t) {
            this.je();
        }
    }
    $e(t) {
        this.syncOptions();
        const e = this.syncValue();
        if (e) {
            this.je();
        }
    }
    je() {
        Be = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Be);
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
            e[e.length] = b.call(n, "model") ? n.model : n.value;
        }
        ++i;
    }
    return e;
}

let Be = void 0;

const Se = "--";

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
    We(t) {
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
    ze(e) {
        let s;
        let i;
        const n = [];
        for (i in e) {
            s = e[i];
            if (s == null) {
                continue;
            }
            if (isString(s)) {
                if (i.startsWith(Se)) {
                    n.push([ i, s ]);
                    continue;
                }
                n.push([ t.kebabCase(i), s ]);
                continue;
            }
            n.push(...this.Ue(s));
        }
        return n;
    }
    Ge(e) {
        const s = e.length;
        if (s > 0) {
            const t = [];
            let i = 0;
            for (;s > i; ++i) {
                t.push(...this.Ue(e[i]));
            }
            return t;
        }
        return t.emptyArray;
    }
    Ue(e) {
        if (isString(e)) {
            return this.We(e);
        }
        if (e instanceof Array) {
            return this.Ge(e);
        }
        if (e instanceof Object) {
            return this.ze(e);
        }
        return t.emptyArray;
    }
    O() {
        if (this.He) {
            this.He = false;
            const t = this.v;
            const e = this.styles;
            const s = this.Ue(t);
            let i;
            let n = this.version;
            this.ov = t;
            let r;
            let l;
            let h;
            let a = 0;
            const c = s.length;
            for (;a < c; ++a) {
                r = s[a];
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
                if (!b.call(e, i) || e[i] !== n) {
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
        this.type = 2 | 1 | 4;
        this.v = "";
        this.ov = "";
        this.He = false;
        this.P = false;
        this.L = t;
        this.k = e;
        this.cf = s;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (B(t, this.v)) {
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
            this.L[this.k] = this.v ?? this.cf.default;
            this.je();
        }
    }
    handleEvent() {
        this.ov = this.v;
        this.v = this.L[this.k];
        if (this.ov !== this.v) {
            this.He = false;
            this.je();
        }
    }
    q() {
        this.v = this.ov = this.L[this.k];
    }
    je() {
        _e = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, _e);
    }
}

mixinNodeObserverUseConfig(ValueAttributeObserver);

s.subscriberCollection(ValueAttributeObserver);

let _e = void 0;

const Re = "http://www.w3.org/1999/xlink";

const Te = "http://www.w3.org/XML/1998/namespace";

const Ie = "http://www.w3.org/2000/xmlns/";

const Ee = y(createLookup(), {
    "xlink:actuate": [ "actuate", Re ],
    "xlink:arcrole": [ "arcrole", Re ],
    "xlink:href": [ "href", Re ],
    "xlink:role": [ "role", Re ],
    "xlink:show": [ "show", Re ],
    "xlink:title": [ "title", Re ],
    "xlink:type": [ "type", Re ],
    "xml:lang": [ "lang", Te ],
    "xml:space": [ "space", Te ],
    xmlns: [ "xmlns", Ie ],
    "xmlns:xlink": [ "xlink", Ie ]
});

const Le = new s.PropertyAccessor;

Le.type = 2 | 4;

class NodeObserverLocator {
    constructor() {
        this.allowDirtyCheck = true;
        this.Xe = createLookup();
        this.Qe = createLookup();
        this.Ke = createLookup();
        this.Ye = createLookup();
        this.Ze = t.resolve(t.IServiceLocator);
        this.p = t.resolve(W);
        this.Je = t.resolve(s.IDirtyChecker);
        this.svg = t.resolve(ve);
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
        L(s.INodeObserverLocator, NodeObserverLocator).register(t);
        E(s.INodeObserverLocator, NodeObserverLocator).register(t);
    }
    handles(t, e) {
        return t instanceof this.p.Node;
    }
    useConfig(t, e, s) {
        const i = this.Xe;
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
        const s = this.Qe;
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
        if (s in this.Ye || s in (this.Ke[e.tagName] ?? t.emptyObject)) {
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
            return ye;

          default:
            {
                const t = Ee[s];
                if (t !== undefined) {
                    return AttributeNSAccessor.forNs(t[1]);
                }
                if (isDataAttribute(e, s, this.svg)) {
                    return ye;
                }
                return Le;
            }
        }
    }
    overrideAccessor(t, e) {
        var s, i;
        let n;
        if (isString(t)) {
            n = (s = this.Ke)[t] ?? (s[t] = createLookup());
            n[e] = true;
        } else {
            for (const e in t) {
                for (const s of t[e]) {
                    n = (i = this.Ke)[e] ?? (i[e] = createLookup());
                    n[s] = true;
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
        const n = this.Xe[t.tagName]?.[e] ?? this.Qe[e];
        let r;
        if (n != null) {
            r = new (n.type ?? ValueAttributeObserver)(t, e, n, i, this.Ze);
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
        const r = Ee[e];
        if (r !== undefined) {
            return AttributeNSAccessor.forNs(r[1]);
        }
        if (isDataAttribute(t, e, this.svg)) {
            return ye;
        }
        if (e in t.constructor.prototype) {
            if (this.allowDirtyCheck) {
                return this.Je.createProperty(t, e);
            }
            throw createMappedError(652, e);
        } else {
            return new s.SetterObserver(t, e);
        }
    }
}

NodeObserverLocator.inject = [ t.IServiceLocator, W, s.IDirtyChecker, ve ];

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
        this.type = 2 | 1 | 4;
        this.v = void 0;
        this.ov = void 0;
        this.ts = void 0;
        this.es = void 0;
        this.P = false;
        this.L = t;
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
        this.ss();
        this.rs();
        this.je();
    }
    handleCollectionChange() {
        this.rs();
    }
    handleChange(t, e) {
        this.rs();
    }
    rs() {
        const t = this.v;
        const e = this.L;
        const s = b.call(e, "model") ? e.model : e.value;
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
        const e = this.L;
        const s = b.call(e, "model") ? e.model : e.value;
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
        this.je();
    }
    q() {
        this.ss();
    }
    M() {
        this.ts?.unsubscribe(this);
        this.es?.unsubscribe(this);
        this.ts = this.es = void 0;
    }
    je() {
        Pe = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Pe);
    }
    ss() {
        const t = this.L;
        (this.es ?? (this.es = t.$observers?.model ?? t.$observers?.value))?.subscribe(this);
        this.ts?.unsubscribe(this);
        this.ts = void 0;
        if (t.type === "checkbox") {
            (this.ts = getCollectionObserver(this.v, this.oL))?.subscribe(this);
        }
    }
}

mixinNodeObserverUseConfig(CheckedObserver);

s.subscriberCollection(CheckedObserver);

let Pe = void 0;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) {
            throw createMappedError(9994, e);
        }
        e.useTargetObserver(ye);
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
        this.os = t.resolve(s.INodeObserverLocator);
    }
    bind(t, e, ...s) {
        if (!(this.os instanceof NodeObserverLocator)) {
            throw createMappedError(9993);
        }
        if (s.length === 0) {
            throw createMappedError(802);
        }
        if (!(e instanceof PropertyBinding) || !(e.mode & 4)) {
            throw createMappedError(803);
        }
        const i = this.os.getNodeObserverConfig(e.target, e.targetProperty);
        if (i == null) {
            throw createMappedError(9992, e);
        }
        const n = this.os.getNodeObserver(e.target, e.targetProperty, this.oL);
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
        this.ls = false;
        this.cs = 0;
        this.us = t.resolve(Pt);
        this.l = t.resolve(G);
    }
    attaching(t, e) {
        return this.ds(this.value);
    }
    detaching(e, s) {
        this.ls = true;
        return t.onResolve(this.pending, (() => {
            this.ls = false;
            this.pending = void 0;
            void this.view?.deactivate(e, this.$controller);
        }));
    }
    valueChanged(t, e) {
        if (!this.$controller.isActive) return;
        t = !!t;
        e = !!e;
        if (t !== e) return this.ds(t);
    }
    ds(e) {
        const s = this.view;
        const i = this.$controller;
        const n = this.cs++;
        const isCurrent = () => !this.ls && this.cs === n + 1;
        let r;
        return t.onResolve(this.pending, (() => this.pending = t.onResolve(s?.deactivate(s, i), (() => {
            if (!isCurrent()) {
                return;
            }
            if (e) {
                r = this.view = this.ifView = this.cache && this.ifView != null ? this.ifView : this.us.create();
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
        this.f = t.resolve(Pt);
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

const qe = [ 20, 19 ];

class Repeat {
    constructor(t, e, s, i, n) {
        this.views = [];
        this.key = null;
        this.ps = new Map;
        this.xs = new Map;
        this.gs = void 0;
        this.vs = false;
        this.bs = false;
        this.ws = null;
        this.ys = void 0;
        this.ks = false;
        const r = t.props[0].props[0];
        if (r !== void 0) {
            const {to: t, value: s, command: i} = r;
            if (t === "key") {
                if (i === null) {
                    this.key = s;
                } else if (i === "bind") {
                    this.key = e.parse(s, 16);
                } else {
                    throw createMappedError(775, i);
                }
            } else {
                throw createMappedError(776, t);
            }
        }
        this.l = s;
        this.Cs = i;
        this.f = n;
    }
    binding(t, e) {
        const i = this.Cs.bindings;
        const n = i.length;
        let r = void 0;
        let l;
        let h = 0;
        for (;n > h; ++h) {
            r = i[h];
            if (r.target === this && r.targetProperty === "items") {
                l = this.forOf = r.ast;
                this.As = r;
                let t = l.iterable;
                while (t != null && qe.includes(t.$kind)) {
                    t = t.expression;
                    this.vs = true;
                }
                this.ws = t;
                break;
            }
        }
        this.Bs();
        const a = l.declaration;
        if (!(this.ks = a.$kind === 26 || a.$kind === 27)) {
            this.local = s.astEvaluate(a, this.$controller.scope, r, null);
        }
    }
    attaching(t, e) {
        this.Ss();
        return this._s(t);
    }
    detaching(t, e) {
        this.Bs();
        return this.Rs(t);
    }
    unbinding(t, e) {
        this.xs.clear();
        this.ps.clear();
    }
    itemsChanged() {
        if (!this.$controller.isActive) {
            return;
        }
        this.Bs();
        this.Ss();
        this.Ts(this.items, void 0);
    }
    handleCollectionChange(t, e) {
        const i = this.$controller;
        if (!i.isActive) {
            return;
        }
        if (this.vs) {
            if (this.bs) {
                return;
            }
            this.bs = true;
            this.items = s.astEvaluate(this.forOf.iterable, i.scope, this.As, null);
            this.bs = false;
            return;
        }
        this.Ss();
        this.Ts(t, e);
    }
    Ts(e, i) {
        const n = this.views;
        const r = n.length;
        const l = this.key;
        const h = l !== null;
        if (h || i === void 0) {
            const t = this.local;
            const e = this.ys;
            const a = e.length;
            const c = this.forOf;
            const u = c.declaration;
            const f = this.As;
            const d = this.ks;
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
                let x;
                let g;
                let v;
                let b;
                let w = 0;
                const y = r - 1;
                const k = a - 1;
                const C = new Map;
                const A = new Map;
                const B = this.ps;
                const S = this.xs;
                const _ = this.$controller.scope;
                p = 0;
                t: {
                    while (true) {
                        if (h) {
                            x = m[p];
                            g = e[p];
                            v = getKeyValue(B, l, x, getScope(S, x, c, _, f, t, d), f);
                            b = getKeyValue(B, l, g, getScope(S, g, c, _, f, t, d), f);
                        } else {
                            x = v = ensureUnique(m[p], p);
                            g = b = ensureUnique(e[p], p);
                        }
                        if (v !== b) {
                            B.set(x, v);
                            B.set(g, b);
                            break;
                        }
                        ++p;
                        if (p > y || p > k) {
                            break t;
                        }
                    }
                    if (y !== k) {
                        break t;
                    }
                    w = k;
                    while (true) {
                        if (h) {
                            x = m[w];
                            g = e[w];
                            v = getKeyValue(B, l, x, getScope(S, x, c, _, f, t, d), f);
                            b = getKeyValue(B, l, g, getScope(S, g, c, _, f, t, d), f);
                        } else {
                            x = v = ensureUnique(m[p], p);
                            g = b = ensureUnique(e[p], p);
                        }
                        if (v !== b) {
                            B.set(x, v);
                            B.set(g, b);
                            break;
                        }
                        --w;
                        if (p > w) {
                            break t;
                        }
                    }
                }
                const R = p;
                const T = p;
                for (p = T; p <= k; ++p) {
                    if (B.has(g = h ? e[p] : ensureUnique(e[p], p))) {
                        b = B.get(g);
                    } else {
                        b = h ? getKeyValue(B, l, g, getScope(S, g, c, _, f, t, d), f) : g;
                        B.set(g, b);
                    }
                    A.set(b, p);
                }
                for (p = R; p <= y; ++p) {
                    if (B.has(x = h ? m[p] : ensureUnique(m[p], p))) {
                        v = B.get(x);
                    } else {
                        v = h ? getKeyValue(B, l, x, n[p].scope, f) : x;
                    }
                    C.set(v, p);
                    if (A.has(v)) {
                        i[A.get(v)] = p;
                    } else {
                        i.deletedIndices.push(p);
                        i.deletedItems.push(x);
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
            const e = t.onResolve(this.Rs(null), (() => this._s(null)));
            if (isPromise(e)) {
                e.catch(rethrow);
            }
        } else {
            const e = s.applyMutationsToIndices(i);
            if (e.deletedIndices.length > 0) {
                const s = t.onResolve(this.Is(e), (() => this.Es(r, e)));
                if (isPromise(s)) {
                    s.catch(rethrow);
                }
            } else {
                this.Es(r, e);
            }
        }
    }
    Bs() {
        const t = this.$controller.scope;
        let e = this.Ls;
        let i = this.vs;
        let n;
        if (i) {
            e = this.Ls = s.astEvaluate(this.ws, t, this.As, null) ?? null;
            i = this.vs = !B(this.items, e);
        }
        const r = this.gs;
        if (this.$controller.isActive) {
            n = this.gs = s.getCollectionObserver(i ? e : this.items);
            if (r !== n) {
                r?.unsubscribe(this);
                n?.subscribe(this);
            }
        } else {
            r?.unsubscribe(this);
            this.gs = undefined;
        }
    }
    Ss() {
        const {items: t} = this;
        if (isArray(t)) {
            this.ys = t;
            return;
        }
        const e = [];
        iterate(t, ((t, s) => {
            e[s] = t;
        }));
        this.ys = e;
    }
    _s(t) {
        let e = void 0;
        let s;
        let i;
        let n;
        const {$controller: r, f: l, local: h, l: a, items: c, xs: u, As: f, forOf: d, ks: p} = this;
        const m = r.scope;
        const x = getCount(c);
        const g = this.views = Array(x);
        iterate(c, ((c, v) => {
            i = g[v] = l.create().setLocation(a);
            i.nodes.unlink();
            n = getScope(u, c, d, m, f, h, p);
            setContextualProperties(n.overrideContext, v, x);
            s = i.activate(t ?? i, r, n);
            if (isPromise(s)) {
                (e ?? (e = [])).push(s);
            }
        }));
        if (e !== void 0) {
            return e.length === 1 ? e[0] : Promise.all(e);
        }
    }
    Rs(t) {
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
    Is(t) {
        let e = void 0;
        let s;
        let i;
        const {$controller: n, views: r} = this;
        const l = t.deletedIndices;
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
        let c = 0;
        for (;h > a; ++a) {
            c = l[a] - a;
            r.splice(c, 1);
        }
        if (e !== void 0) {
            return e.length === 1 ? e[0] : Promise.all(e);
        }
    }
    Es(t, e) {
        let i = void 0;
        let n;
        let r;
        let l;
        let h = 0;
        const {$controller: a, f: c, local: u, ys: f, l: d, views: p, ks: m, As: x, xs: g, forOf: v} = this;
        const b = e.length;
        for (;b > h; ++h) {
            if (e[h] === -2) {
                r = c.create();
                p.splice(h, 0, r);
            }
        }
        if (p.length !== b) {
            throw createMappedError(814, [ p.length, b ]);
        }
        const w = a.scope;
        const y = e.length;
        s.synchronizeIndices(p, e);
        const k = longestIncreasingSubsequence(e);
        const C = k.length;
        const A = v.declaration;
        let B;
        let S = C - 1;
        h = y - 1;
        for (;h >= 0; --h) {
            r = p[h];
            B = p[h + 1];
            r.nodes.link(B?.nodes ?? d);
            if (e[h] === -2) {
                l = getScope(g, f[h], v, w, x, u, m);
                setContextualProperties(l.overrideContext, h, y);
                r.setLocation(d);
                n = r.activate(r, a, l);
                if (isPromise(n)) {
                    (i ?? (i = [])).push(n);
                }
            } else if (S < 0 || C === 1 || h !== k[S]) {
                if (m) {
                    s.astAssign(A, r.scope, x, f[h]);
                } else {
                    r.scope.bindingContext[u] = f[h];
                }
                setContextualProperties(r.scope.overrideContext, h, y);
                r.nodes.insertBefore(r.location);
            } else {
                if (m) {
                    s.astAssign(A, r.scope, x, f[h]);
                } else {
                    r.scope.bindingContext[u] = f[h];
                }
                if (t !== y) {
                    setContextualProperties(r.scope.overrideContext, h, y);
                }
                --S;
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

Repeat.inject = [ Ft, s.IExpressionParser, G, te, Pt ];

__decorate([ bindable ], Repeat.prototype, "items", void 0);

templateController("repeat")(Repeat);

let De = 16;

let Me = new Int32Array(De);

let Fe = new Int32Array(De);

function longestIncreasingSubsequence(t) {
    const e = t.length;
    if (e > De) {
        De = e;
        Me = new Int32Array(e);
        Fe = new Int32Array(e);
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
            l = Me[s];
            n = t[l];
            if (n !== -2 && n < i) {
                Fe[r] = l;
                Me[++s] = r;
                continue;
            }
            h = 0;
            a = s;
            while (h < a) {
                c = h + a >> 1;
                n = t[Me[c]];
                if (n !== -2 && n < i) {
                    h = c + 1;
                } else {
                    a = c;
                }
            }
            n = t[Me[h]];
            if (i < n || n === -2) {
                if (h > 0) {
                    Fe[r] = Me[h - 1];
                }
                Me[h] = r;
            }
        }
    }
    r = ++s;
    const u = new Int32Array(r);
    i = Me[s - 1];
    while (s-- > 0) {
        u[s] = i;
        i = Fe[i];
    }
    while (r-- > 0) Me[r] = 0;
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

const He = v.toString;

const getCount = t => {
    switch (He.call(t)) {
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
    switch (He.call(t)) {
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

class With {
    constructor() {
        this.view = t.resolve(Pt).create().setLocation(t.resolve(G));
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
        this.f = t.resolve(Pt);
        this.l = t.resolve(G);
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
        this.queue((() => this.Ps(t)));
    }
    Ps(e) {
        const s = e.isMatch(this.value);
        const i = this.activeCases;
        const n = i.length;
        if (!s) {
            if (n > 0 && i[0].id === e.id) {
                return this.qs(null);
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
        return t.onResolve(this.qs(null, r), (() => {
            this.activeCases = r;
            return this.Ds(null);
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
        return t.onResolve(this.activeCases.length > 0 ? this.qs(e, i) : void 0, (() => {
            this.activeCases = i;
            if (i.length === 0) {
                return;
            }
            return this.Ds(e);
        }));
    }
    Ds(e) {
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
    qs(e, s = []) {
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

let Oe = 0;

exports.Case = class Case {
    constructor() {
        this.id = ++Oe;
        this.fallThrough = false;
        this.view = void 0;
        this.f = t.resolve(Pt);
        this.Ze = t.resolve(s.IObserverLocator);
        this.l = t.resolve(G);
        this.Ms = t.resolve(t.ILogger).scopeTo(`${this.constructor.name}-#${this.id}`);
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
        this.Ms.debug("isMatch()");
        const e = this.value;
        if (isArray(e)) {
            if (this.gs === void 0) {
                this.gs = this.Fs(e);
            }
            return e.includes(t);
        }
        return e === t;
    }
    valueChanged(t, e) {
        if (isArray(t)) {
            this.gs?.unsubscribe(this);
            this.gs = this.Fs(t);
        } else if (this.gs !== void 0) {
            this.gs.unsubscribe(this);
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
        this.gs?.unsubscribe(this);
        this.view?.dispose();
        this.view = void 0;
    }
    linkToSwitch(t) {
        t.cases.push(this);
    }
    Fs(t) {
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
    mode: 1
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
        this.f = t.resolve(Pt);
        this.l = t.resolve(G);
        this.p = t.resolve(W);
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
                if (this.preSettledTask.status === 1) {
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
                if (this.preSettledTask.status === 1) {
                    void c.then(reject);
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

__decorate([ bindable ], exports.PromiseTemplateController.prototype, "value", void 0);

exports.PromiseTemplateController = __decorate([ templateController("promise") ], exports.PromiseTemplateController);

exports.PendingTemplateController = class PendingTemplateController {
    constructor() {
        this.view = void 0;
        this.f = t.resolve(Pt);
        this.l = t.resolve(G);
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
    mode: 2
}) ], exports.PendingTemplateController.prototype, "value", void 0);

exports.PendingTemplateController = __decorate([ templateController("pending") ], exports.PendingTemplateController);

exports.FulfilledTemplateController = class FulfilledTemplateController {
    constructor() {
        this.view = void 0;
        this.f = t.resolve(Pt);
        this.l = t.resolve(G);
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
    mode: 4
}) ], exports.FulfilledTemplateController.prototype, "value", void 0);

exports.FulfilledTemplateController = __decorate([ templateController("then") ], exports.FulfilledTemplateController);

exports.RejectedTemplateController = class RejectedTemplateController {
    constructor() {
        this.view = void 0;
        this.f = t.resolve(Pt);
        this.l = t.resolve(G);
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
    mode: 4
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

let Ve = class PromiseAttributePattern {
    "promise.resolve"(t, e, s) {
        return new AttrSyntax(t, e, "promise", "bind");
    }
};

Ve = __decorate([ attributePattern({
    pattern: "promise.resolve",
    symbols: ""
}) ], Ve);

let Ne = class FulfilledAttributePattern {
    then(t, e, s) {
        return new AttrSyntax(t, e, "then", "from-view");
    }
};

Ne = __decorate([ attributePattern({
    pattern: "then",
    symbols: ""
}) ], Ne);

let $e = class RejectedAttributePattern {
    catch(t, e, s) {
        return new AttrSyntax(t, e, "catch", "from-view");
    }
};

$e = __decorate([ attributePattern({
    pattern: "catch",
    symbols: ""
}) ], $e);

class Focus {
    constructor() {
        this.Hs = false;
        this.Os = t.resolve(z);
        this.p = t.resolve(W);
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) {
            this.Vs();
        } else {
            this.Hs = true;
        }
    }
    attached() {
        if (this.Hs) {
            this.Hs = false;
            this.Vs();
        }
        this.Os.addEventListener("focus", this);
        this.Os.addEventListener("blur", this);
    }
    detaching() {
        const t = this.Os;
        t.removeEventListener("focus", this);
        t.removeEventListener("blur", this);
    }
    handleEvent(t) {
        if (t.type === "focus") {
            this.value = true;
        } else if (!this.Ns) {
            this.value = false;
        }
    }
    Vs() {
        const t = this.Os;
        const e = this.Ns;
        const s = this.value;
        if (s && !e) {
            t.focus();
        } else if (!s && e) {
            t.blur();
        }
    }
    get Ns() {
        return this.Os === this.p.document.activeElement;
    }
}

Focus.inject = [ z, W ];

__decorate([ bindable({
    mode: 6
}) ], Focus.prototype, "value", void 0);

customAttribute("focus")(Focus);

class Portal {
    constructor() {
        this.position = "beforeend";
        this.strict = false;
        const e = t.resolve(Pt);
        const s = t.resolve(G);
        const i = t.resolve(W);
        this.p = i;
        this.$s = i.document.createElement("div");
        (this.view = e.create()).setLocation(this.js = createLocation(i));
        setEffectiveParentNode(this.view.nodes, s);
    }
    attaching(t) {
        if (this.callbackContext == null) {
            this.callbackContext = this.$controller.scope.bindingContext;
        }
        const e = this.$s = this.Ws();
        this.zs(e, this.position);
        return this.Us(t, e);
    }
    detaching(t) {
        return this.Gs(t, this.$s);
    }
    targetChanged() {
        const {$controller: e} = this;
        if (!e.isActive) {
            return;
        }
        const s = this.Ws();
        if (this.$s === s) {
            return;
        }
        this.$s = s;
        const i = t.onResolve(this.Gs(null, s), (() => {
            this.zs(s, this.position);
            return this.Us(null, s);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    positionChanged() {
        const {$controller: e, $s: s} = this;
        if (!e.isActive) {
            return;
        }
        const i = t.onResolve(this.Gs(null, s), (() => {
            this.zs(s, this.position);
            return this.Us(null, s);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    Us(e, s) {
        const {activating: i, callbackContext: n, view: r} = this;
        return t.onResolve(i?.call(n, s, r), (() => this.Xs(e, s)));
    }
    Xs(e, s) {
        const {$controller: i, view: n} = this;
        if (e === null) {
            n.nodes.insertBefore(this.js);
        } else {
            return t.onResolve(n.activate(e ?? n, i, i.scope), (() => this.Qs(s)));
        }
        return this.Qs(s);
    }
    Qs(t) {
        const {activated: e, callbackContext: s, view: i} = this;
        return e?.call(s, t, i);
    }
    Gs(e, s) {
        const {deactivating: i, callbackContext: n, view: r} = this;
        return t.onResolve(i?.call(n, s, r), (() => this.Ks(e, s)));
    }
    Ks(e, s) {
        const {$controller: i, view: n} = this;
        if (e === null) {
            n.nodes.remove();
        } else {
            return t.onResolve(n.deactivate(e, i), (() => this.Ys(s)));
        }
        return this.Ys(s);
    }
    Ys(t) {
        const {deactivated: e, callbackContext: s, view: i} = this;
        return e?.call(s, t, i);
    }
    Ws() {
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
    zs(t, e) {
        const s = this.js;
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
        this.Zs = null;
        this.Js = null;
        this.Qt = false;
        this.expose = null;
        this.slotchange = null;
        this.ti = new Set;
        this.gs = null;
        const e = t.resolve(G);
        const s = t.resolve(Ft);
        const i = t.resolve(ee);
        const n = t.resolve(Gt);
        const r = s.auSlot;
        const l = i.instruction?.projections?.[r.name];
        const h = i.controller;
        let a;
        let c;
        this.name = r.name;
        if (l == null) {
            a = n.getViewFactory(r.fallback, h.container);
            this.ei = false;
        } else {
            c = i.parent.controller.container.createChild({
                inheritParentResources: true
            });
            registerResolver(c, h.definition.Type, new t.InstanceProvider(void 0, h.viewModel));
            a = n.getViewFactory(l, c);
            this.ei = true;
            this.si = h.container.getAll(Dt, false)?.filter((t => t.slotName === "*" || t.slotName === r.name)) ?? t.emptyArray;
        }
        this.ii = (this.si ?? (this.si = t.emptyArray)).length > 0;
        this.ni = i;
        this.view = a.create().setLocation(this.l = e);
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
        this.ti.add(t);
    }
    unsubscribe(t) {
        this.ti.delete(t);
    }
    binding(t, e) {
        this.Zs = this.$controller.scope.parent;
        let i;
        if (this.ei) {
            i = this.ni.controller.scope.parent;
            (this.Js = s.Scope.fromParent(i, i.bindingContext)).overrideContext.$host = this.expose ?? this.Zs.bindingContext;
        }
    }
    attaching(e, s) {
        return t.onResolve(this.view.activate(e, this.$controller, this.ei ? this.Js : this.Zs), (() => {
            if (this.ii) {
                this.si.forEach((t => t.watch(this)));
                this.ss();
                this.ri();
                this.Qt = true;
            }
        }));
    }
    detaching(t, e) {
        this.Qt = false;
        this.oi();
        this.si.forEach((t => t.unwatch(this)));
        return this.view.deactivate(t, this.$controller);
    }
    exposeChanged(t) {
        if (this.ei && this.Js != null) {
            this.Js.overrideContext.$host = t;
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
    ss() {
        if (this.gs != null) {
            return;
        }
        const t = this.l;
        const e = t.parentElement;
        if (e == null) {
            return;
        }
        (this.gs = createMutationObserver(e, (e => {
            if (isMutationWithinLocation(t, e)) {
                this.ri();
            }
        }))).observe(e, {
            childList: true
        });
    }
    oi() {
        this.gs?.disconnect();
        this.gs = null;
    }
    ri() {
        const t = this.nodes;
        const e = new Set(this.ti);
        let s;
        if (this.Qt) {
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

exports.DefinitionType = void 0;

(function(t) {
    t[t["Element"] = 1] = "Element";
    t[t["Attribute"] = 2] = "Attribute";
})(exports.DefinitionType || (exports.DefinitionType = {}));

class AuCompose {
    constructor() {
        this.scopeBehavior = "auto";
        this.li = void 0;
        this.c = t.resolve(t.IContainer);
        this.parent = t.resolve(te);
        this.host = t.resolve(z);
        this.l = t.resolve(G);
        this.p = t.resolve(W);
        this.r = t.resolve(Gt);
        this.hi = t.resolve(Ft);
        this.ai = t.resolve(t.transient(CompositionContextFactory));
        this.ut = t.resolve(Ht);
        this.ht = t.resolve(ee);
        this.ep = t.resolve(s.IExpressionParser);
        this.oL = t.resolve(s.IObserverLocator);
    }
    get composing() {
        return this.ui;
    }
    get composition() {
        return this.li;
    }
    attaching(e, s) {
        return this.ui = t.onResolve(this.queue(new ChangeInfo(this.template, this.component, this.model, void 0), e), (t => {
            if (this.ai.fi(t)) {
                this.ui = void 0;
            }
        }));
    }
    detaching(e) {
        const s = this.li;
        const i = this.ui;
        this.ai.invalidate();
        this.li = this.ui = void 0;
        return t.onResolve(i, (() => s?.deactivate(e)));
    }
    propertyChanged(e) {
        if (e === "composing" || e === "composition") return;
        if (e === "model" && this.li != null) {
            this.li.update(this.model);
            return;
        }
        this.ui = t.onResolve(this.ui, (() => t.onResolve(this.queue(new ChangeInfo(this.template, this.component, this.model, e), void 0), (t => {
            if (this.ai.fi(t)) {
                this.ui = void 0;
            }
        }))));
    }
    queue(e, s) {
        const i = this.ai;
        const n = this.li;
        return t.onResolve(i.create(e), (e => {
            if (i.fi(e)) {
                return t.onResolve(this.compose(e), (r => {
                    if (i.fi(e)) {
                        return t.onResolve(r.activate(s), (() => {
                            if (i.fi(e)) {
                                this.li = r;
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
        const {di: n, pi: r, mi: l} = e.change;
        const {c: h, host: a, $controller: c, l: u, hi: f} = this;
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
            i = this.xi(p, r, m);
        } else {
            m = u ?? a;
            i = this.xi(p, r, m);
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
                }, this.ht.parent);
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
                const x = SpreadBinding.create(u, m, d, this.r, this.ut, this.p, this.ep, this.oL);
                x.forEach((t => a.addBinding(t)));
                return new CompositionController(a, (t => a.activate(t ?? a, c, c.scope.parent)), (e => t.onResolve(a.deactivate(e ?? a, c), removeCompositionHost)), (t => i.activate?.(t)), e);
            } else {
                const t = CustomElementDefinition.create({
                    name: at.generateName(),
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
    xi(e, s, i) {
        if (s == null) {
            return new EmptyComponent;
        }
        if (typeof s === "object") {
            return s;
        }
        const n = this.p;
        const r = isRenderLocation(i);
        registerHostNode(e, n, r ? null : i);
        registerResolver(e, G, new t.InstanceProvider("IRenderLocation", r ? i : null));
        const l = e.invoke(s);
        registerResolver(e, s, new t.InstanceProvider("au-compose.component", l));
        return l;
    }
    getDef(t) {
        const e = isFunction(t) ? t : t?.constructor;
        return at.isType(e) ? at.getDefinition(e) : null;
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
    mode: 4
}) ], AuCompose.prototype, "composing", null);

__decorate([ bindable({
    mode: 4
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
    fi(t) {
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
        this.di = t;
        this.pi = e;
        this.mi = s;
        this.gi = i;
    }
    load() {
        if (isPromise(this.di) || isPromise(this.pi)) {
            return Promise.all([ this.di, this.pi ]).then((([t, e]) => new LoadedChangeInfo(t, e, this.mi, this.gi)));
        } else {
            return new LoadedChangeInfo(this.di, this.pi, this.mi, this.gi);
        }
    }
}

class LoadedChangeInfo {
    constructor(t, e, s, i) {
        this.di = t;
        this.pi = e;
        this.mi = s;
        this.gi = i;
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

const je = /*@__PURE__*/ I("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw createMappedError(99, "sanitize");
    }
})));

class SanitizeValueConverter {
    constructor() {
        this.vi = t.resolve(je);
    }
    toView(t) {
        if (t == null) {
            return null;
        }
        return this.vi.sanitize(t);
    }
}

valueConverter("sanitize")(SanitizeValueConverter);

const We = /*@__PURE__*/ I("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const ze = {};

class TemplateElementFactory {
    constructor() {
        this.p = t.resolve(W);
        this.di = this.t();
    }
    t() {
        return this.p.document.createElement("template");
    }
    createTemplate(t) {
        if (isString(t)) {
            let e = ze[t];
            if (e === void 0) {
                const s = this.di;
                s.innerHTML = t;
                const i = s.content.firstElementChild;
                if (i == null || i.nodeName !== "TEMPLATE" || i.nextElementSibling != null) {
                    this.di = this.t();
                    e = s;
                } else {
                    s.content.removeChild(i);
                    e = i;
                }
                ze[t] = e;
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
        t.register(E(this, this), L(this, Ht));
    }
    compile(e, s, i) {
        const n = CustomElementDefinition.getOrCreate(e);
        if (n.template === null || n.template === void 0) {
            return n;
        }
        if (n.needsCompile === false) {
            return n;
        }
        i ?? (i = Qe);
        const r = new CompilationContext(e, s, i, null, null, void 0);
        const l = isString(n.template) || !e.enhance ? r.bi.createTemplate(n.template) : n.template;
        const h = l.nodeName === Ue && l.content != null;
        const a = h ? l.content : l;
        const c = s.get(allResources(is));
        const u = c.length;
        let f = 0;
        if (u > 0) {
            while (u > f) {
                c[f].compiling?.(l);
                ++f;
            }
        }
        if (l.hasAttribute(ss)) {
            throw createMappedError(701, n);
        }
        this.wi(a, r);
        this.yi(a, r);
        return CustomElementDefinition.create({
            ...e,
            name: e.name || lt(),
            dependencies: (e.dependencies ?? t.emptyArray).concat(r.deps ?? t.emptyArray),
            instructions: r.rows,
            surrogates: h ? this.ki(l, r) : t.emptyArray,
            template: l,
            hasSlots: r.hasSlot,
            needsCompile: false
        });
    }
    compileSpread(e, s, i, n, r) {
        const l = new CompilationContext(e, i, Qe, null, null, void 0);
        const h = [];
        const a = r ?? l.Ci(n.nodeName.toLowerCase());
        const c = a !== null;
        const u = l.ep;
        const f = s.length;
        let d = 0;
        let p;
        let m = null;
        let x;
        let g;
        let v;
        let b;
        let w;
        let y = null;
        let k;
        let C;
        let A;
        let B;
        for (;f > d; ++d) {
            p = s[d];
            A = p.target;
            B = p.rawValue;
            y = l.Ai(p);
            if (y !== null && (y.type & 1) > 0) {
                Ye.node = n;
                Ye.attr = p;
                Ye.bindable = null;
                Ye.def = null;
                h.push(y.build(Ye, l.ep, l.m));
                continue;
            }
            m = l.Bi(A);
            if (m !== null) {
                if (m.isTemplateController) {
                    throw createMappedError(9998, A);
                }
                v = BindablesInfo.from(m, true);
                C = m.noMultiBindings === false && y === null && hasInlineBindings(B);
                if (C) {
                    g = this.Si(n, B, m, l);
                } else {
                    w = v.primary;
                    if (y === null) {
                        k = u.parse(B, 1);
                        g = [ k === null ? new SetPropertyInstruction(B, w.name) : new InterpolationInstruction(k, w.name) ];
                    } else {
                        Ye.node = n;
                        Ye.attr = p;
                        Ye.bindable = w;
                        Ye.def = m;
                        g = [ y.build(Ye, l.ep, l.m) ];
                    }
                }
                (x ?? (x = [])).push(new HydrateAttributeInstruction(this.resolveResources ? m : m.name, m.aliases != null && m.aliases.includes(A) ? A : void 0, g));
                continue;
            }
            if (y === null) {
                k = u.parse(B, 1);
                if (c) {
                    v = BindablesInfo.from(a, false);
                    b = v.attrs[A];
                    if (b !== void 0) {
                        k = u.parse(B, 1);
                        h.push(new SpreadElementPropBindingInstruction(k == null ? new SetPropertyInstruction(B, b.name) : new InterpolationInstruction(k, b.name)));
                        continue;
                    }
                }
                if (k != null) {
                    h.push(new InterpolationInstruction(k, l.m.map(n, A) ?? t.camelCase(A)));
                } else {
                    switch (A) {
                      case "class":
                        h.push(new SetClassAttributeInstruction(B));
                        break;

                      case "style":
                        h.push(new SetStyleAttributeInstruction(B));
                        break;

                      default:
                        h.push(new SetAttributeInstruction(B, A));
                    }
                }
            } else {
                if (c) {
                    v = BindablesInfo.from(a, false);
                    b = v.attrs[A];
                    if (b !== void 0) {
                        Ye.node = n;
                        Ye.attr = p;
                        Ye.bindable = b;
                        Ye.def = a;
                        h.push(new SpreadElementPropBindingInstruction(y.build(Ye, l.ep, l.m)));
                        continue;
                    }
                }
                Ye.node = n;
                Ye.attr = p;
                Ye.bindable = null;
                Ye.def = null;
                h.push(y.build(Ye, l.ep, l.m));
            }
        }
        resetCommandBuildInfo();
        if (x != null) {
            return x.concat(h);
        }
        return h;
    }
    ki(e, s) {
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
        let x;
        let g;
        let v = null;
        let b;
        let w;
        let y;
        let k;
        for (;l > h; ++h) {
            a = n[h];
            c = a.name;
            u = a.value;
            f = s.Le.parse(c, u);
            y = f.target;
            k = f.rawValue;
            if (Ze[y]) {
                throw createMappedError(702, c);
            }
            v = s.Ai(f);
            if (v !== null && (v.type & 1) > 0) {
                Ye.node = e;
                Ye.attr = f;
                Ye.bindable = null;
                Ye.def = null;
                i.push(v.build(Ye, s.ep, s.m));
                continue;
            }
            d = s.Bi(y);
            if (d !== null) {
                if (d.isTemplateController) {
                    throw createMappedError(703, y);
                }
                x = BindablesInfo.from(d, true);
                w = d.noMultiBindings === false && v === null && hasInlineBindings(k);
                if (w) {
                    m = this.Si(e, k, d, s);
                } else {
                    g = x.primary;
                    if (v === null) {
                        b = r.parse(k, 1);
                        m = [ b === null ? new SetPropertyInstruction(k, g.name) : new InterpolationInstruction(b, g.name) ];
                    } else {
                        Ye.node = e;
                        Ye.attr = f;
                        Ye.bindable = g;
                        Ye.def = d;
                        m = [ v.build(Ye, s.ep, s.m) ];
                    }
                }
                e.removeAttribute(c);
                --h;
                --l;
                (p ?? (p = [])).push(new HydrateAttributeInstruction(this.resolveResources ? d : d.name, d.aliases != null && d.aliases.includes(y) ? y : void 0, m));
                continue;
            }
            if (v === null) {
                b = r.parse(k, 1);
                if (b != null) {
                    e.removeAttribute(c);
                    --h;
                    --l;
                    i.push(new InterpolationInstruction(b, s.m.map(e, y) ?? t.camelCase(y)));
                } else {
                    switch (c) {
                      case "class":
                        i.push(new SetClassAttributeInstruction(k));
                        break;

                      case "style":
                        i.push(new SetStyleAttributeInstruction(k));
                        break;

                      default:
                        i.push(new SetAttributeInstruction(k, c));
                    }
                }
            } else {
                Ye.node = e;
                Ye.attr = f;
                Ye.bindable = null;
                Ye.def = null;
                i.push(v.build(Ye, s.ep, s.m));
            }
        }
        resetCommandBuildInfo();
        if (p != null) {
            return p.concat(i);
        }
        return i;
    }
    yi(t, e) {
        switch (t.nodeType) {
          case 1:
            switch (t.nodeName) {
              case "LET":
                return this._i(t, e);

              default:
                return this.Ri(t, e);
            }

          case 3:
            return this.Ti(t, e);

          case 11:
            {
                let s = t.firstChild;
                while (s !== null) {
                    s = this.yi(s, e);
                }
                break;
            }
        }
        return t.nextSibling;
    }
    _i(e, i) {
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
        let x;
        let g;
        let v;
        for (;r > c; ++c) {
            u = n[c];
            d = u.name;
            p = u.value;
            if (d === "to-binding-context") {
                a = true;
                continue;
            }
            f = i.Le.parse(d, p);
            x = f.target;
            g = f.rawValue;
            m = i.Ai(f);
            if (m !== null) {
                if (f.command === "bind") {
                    l.push(new LetBindingInstruction(h.parse(g, 16), t.camelCase(x)));
                } else {
                    throw createMappedError(704, f);
                }
                continue;
            }
            v = h.parse(g, 1);
            l.push(new LetBindingInstruction(v === null ? new s.PrimitiveLiteralExpression(g) : v, t.camelCase(x)));
        }
        i.rows.push([ new HydrateLetElementInstruction(l, a) ]);
        return this.Ii(e, i).nextSibling;
    }
    Ri(e, s) {
        var i, n, r, l;
        const h = e.nextSibling;
        const a = (e.getAttribute("as-element") ?? e.nodeName).toLowerCase();
        const c = s.Ci(a);
        const u = c !== null;
        const f = u && c.shadowOptions != null;
        const d = c?.capture;
        const p = d != null && typeof d !== "boolean";
        const m = d ? [] : t.emptyArray;
        const x = s.ep;
        const g = this.debug ? t.noop : () => {
            e.removeAttribute(C);
            --y;
            --w;
        };
        let v = e.attributes;
        let b;
        let w = v.length;
        let y = 0;
        let k;
        let C;
        let A;
        let B;
        let S;
        let _;
        let R = null;
        let T = false;
        let I;
        let E;
        let L;
        let P;
        let q;
        let D;
        let M;
        let F = null;
        let H;
        let O;
        let V;
        let N;
        let $ = true;
        let j = false;
        let W = false;
        let z = false;
        if (a === "slot") {
            if (s.root.def.shadowOptions == null) {
                throw createMappedError(717, s.root.def.name);
            }
            s.root.hasSlot = true;
        }
        if (u) {
            $ = c.processContent?.call(c.Type, e, s.p);
            v = e.attributes;
            w = v.length;
        }
        for (;w > y; ++y) {
            k = v[y];
            C = k.name;
            A = k.value;
            switch (C) {
              case "as-element":
              case "containerless":
                g();
                if (!j) {
                    j = C === "containerless";
                }
                continue;
            }
            B = s.Le.parse(C, A);
            F = s.Ai(B);
            V = B.target;
            N = B.rawValue;
            if (d && (!p || p && d(V))) {
                if (F != null && F.type & 1) {
                    g();
                    m.push(B);
                    continue;
                }
                W = V !== hs && V !== "slot";
                if (W) {
                    H = BindablesInfo.from(c, false);
                    if (H.attrs[V] == null && !s.Bi(V)?.isTemplateController) {
                        g();
                        m.push(B);
                        continue;
                    }
                }
            }
            if (F !== null && F.type & 1) {
                Ye.node = e;
                Ye.attr = B;
                Ye.bindable = null;
                Ye.def = null;
                (S ?? (S = [])).push(F.build(Ye, s.ep, s.m));
                g();
                continue;
            }
            R = s.Bi(V);
            if (R !== null) {
                H = BindablesInfo.from(R, true);
                T = R.noMultiBindings === false && F === null && hasInlineBindings(N);
                if (T) {
                    L = this.Si(e, N, R, s);
                } else {
                    O = H.primary;
                    if (F === null) {
                        D = x.parse(N, 1);
                        L = [ D === null ? new SetPropertyInstruction(N, O.name) : new InterpolationInstruction(D, O.name) ];
                    } else {
                        Ye.node = e;
                        Ye.attr = B;
                        Ye.bindable = O;
                        Ye.def = R;
                        L = [ F.build(Ye, s.ep, s.m) ];
                    }
                }
                g();
                if (R.isTemplateController) {
                    (P ?? (P = [])).push(new HydrateTemplateController(Ke, this.resolveResources ? R : R.name, void 0, L));
                } else {
                    (E ?? (E = [])).push(new HydrateAttributeInstruction(this.resolveResources ? R : R.name, R.aliases != null && R.aliases.includes(V) ? V : void 0, L));
                }
                continue;
            }
            if (F === null) {
                if (u) {
                    H = BindablesInfo.from(c, false);
                    I = H.attrs[V];
                    if (I !== void 0) {
                        D = x.parse(N, 1);
                        (_ ?? (_ = [])).push(D == null ? new SetPropertyInstruction(N, I.name) : new InterpolationInstruction(D, I.name));
                        g();
                        continue;
                    }
                }
                D = x.parse(N, 1);
                if (D != null) {
                    g();
                    (S ?? (S = [])).push(new InterpolationInstruction(D, s.m.map(e, V) ?? t.camelCase(V)));
                }
                continue;
            }
            g();
            if (u) {
                H = BindablesInfo.from(c, false);
                I = H.attrs[V];
                if (I !== void 0) {
                    Ye.node = e;
                    Ye.attr = B;
                    Ye.bindable = I;
                    Ye.def = c;
                    (_ ?? (_ = [])).push(F.build(Ye, s.ep, s.m));
                    continue;
                }
            }
            Ye.node = e;
            Ye.attr = B;
            Ye.bindable = null;
            Ye.def = null;
            (S ?? (S = [])).push(F.build(Ye, s.ep, s.m));
        }
        resetCommandBuildInfo();
        if (this.Ei(e, S) && S != null && S.length > 1) {
            this.Li(e, S);
        }
        if (u) {
            M = new HydrateElementInstruction(this.resolveResources ? c : c.name, void 0, _ ?? t.emptyArray, null, j, m);
            if (a === hs) {
                const t = e.getAttribute("name") || ls;
                const i = s.t();
                const n = s.Pi();
                let r = e.firstChild;
                let l = 0;
                while (r !== null) {
                    if (r.nodeType === 1 && r.hasAttribute(hs)) {
                        e.removeChild(r);
                    } else {
                        appendToTemplate(i, r);
                        l++;
                    }
                    r = e.firstChild;
                }
                if (l > 0) {
                    this.yi(i.content, n);
                }
                M.auSlot = {
                    name: t,
                    fallback: CustomElementDefinition.create({
                        name: lt(),
                        template: i,
                        instructions: n.rows,
                        needsCompile: false
                    })
                };
            }
        }
        if (S != null || M != null || E != null) {
            b = t.emptyArray.concat(M ?? t.emptyArray, E ?? t.emptyArray, S ?? t.emptyArray);
            z = true;
        }
        let U;
        if (P != null) {
            w = P.length - 1;
            y = w;
            q = P[y];
            let t;
            if (isMarker(e)) {
                t = s.t();
                appendManyToTemplate(t, [ s.wt(), s.qi(Ge), s.qi(Xe) ]);
            } else {
                this.Di(e, s);
                if (e.nodeName === "TEMPLATE") {
                    t = e;
                } else {
                    t = s.t();
                    appendToTemplate(t, e);
                }
            }
            const r = t;
            const l = s.Pi(b == null ? [] : [ b ]);
            let h;
            let d;
            let p;
            let m;
            let x;
            let g;
            let v;
            let k;
            let C = 0, A = 0;
            let B = e.firstChild;
            let S = false;
            if ($ !== false) {
                while (B !== null) {
                    d = B.nodeType === 1 ? B.getAttribute(hs) : null;
                    if (d !== null) {
                        B.removeAttribute(hs);
                    }
                    if (u) {
                        h = B.nextSibling;
                        if (!f) {
                            S = B.nodeType === 3 && B.textContent.trim() === "";
                            if (!S) {
                                ((i = m ?? (m = {}))[n = d || ls] ?? (i[n] = [])).push(B);
                            }
                            e.removeChild(B);
                        }
                        B = h;
                    } else {
                        if (d !== null) {
                            d = d || ls;
                            throw createMappedError(706, d, a);
                        }
                        B = B.nextSibling;
                    }
                }
            }
            if (m != null) {
                p = {};
                for (d in m) {
                    t = s.t();
                    x = m[d];
                    for (C = 0, A = x.length; A > C; ++C) {
                        g = x[C];
                        if (g.nodeName === "TEMPLATE") {
                            if (g.attributes.length > 0) {
                                appendToTemplate(t, g);
                            } else {
                                appendToTemplate(t, g.content);
                            }
                        } else {
                            appendToTemplate(t, g);
                        }
                    }
                    k = s.Pi();
                    this.yi(t.content, k);
                    p[d] = CustomElementDefinition.create({
                        name: lt(),
                        template: t,
                        instructions: k.rows,
                        needsCompile: false
                    });
                }
                M.projections = p;
            }
            if (z) {
                if (u && (j || c.containerless)) {
                    this.Di(e, s);
                } else {
                    this.Ii(e, s);
                }
            }
            U = !u || !c.containerless && !j && $ !== false;
            if (U) {
                if (e.nodeName === Ue) {
                    this.yi(e.content, l);
                } else {
                    B = e.firstChild;
                    while (B !== null) {
                        B = this.yi(B, l);
                    }
                }
            }
            q.def = CustomElementDefinition.create({
                name: lt(),
                template: r,
                instructions: l.rows,
                needsCompile: false
            });
            while (y-- > 0) {
                q = P[y];
                t = s.t();
                v = s.wt();
                appendManyToTemplate(t, [ v, s.qi(Ge), s.qi(Xe) ]);
                q.def = CustomElementDefinition.create({
                    name: lt(),
                    template: t,
                    needsCompile: false,
                    instructions: [ [ P[y + 1] ] ]
                });
            }
            s.rows.push([ q ]);
        } else {
            if (b != null) {
                s.rows.push(b);
            }
            let t = e.firstChild;
            let i;
            let n;
            let h = null;
            let d;
            let p;
            let m;
            let x;
            let g;
            let v = false;
            let w = 0, y = 0;
            if ($ !== false) {
                while (t !== null) {
                    n = t.nodeType === 1 ? t.getAttribute(hs) : null;
                    if (n !== null) {
                        t.removeAttribute(hs);
                    }
                    if (u) {
                        i = t.nextSibling;
                        if (!f) {
                            v = t.nodeType === 3 && t.textContent.trim() === "";
                            if (!v) {
                                ((r = d ?? (d = {}))[l = n || ls] ?? (r[l] = [])).push(t);
                            }
                            e.removeChild(t);
                        }
                        t = i;
                    } else {
                        if (n !== null) {
                            n = n || ls;
                            throw createMappedError(706, n, a);
                        }
                        t = t.nextSibling;
                    }
                }
            }
            if (d != null) {
                h = {};
                for (n in d) {
                    x = s.t();
                    p = d[n];
                    for (w = 0, y = p.length; y > w; ++w) {
                        m = p[w];
                        if (m.nodeName === Ue) {
                            if (m.attributes.length > 0) {
                                appendToTemplate(x, m);
                            } else {
                                appendToTemplate(x, m.content);
                            }
                        } else {
                            appendToTemplate(x, m);
                        }
                    }
                    g = s.Pi();
                    this.yi(x.content, g);
                    h[n] = CustomElementDefinition.create({
                        name: lt(),
                        template: x,
                        instructions: g.rows,
                        needsCompile: false
                    });
                }
                M.projections = h;
            }
            if (z) {
                if (u && (j || c.containerless)) {
                    this.Di(e, s);
                } else {
                    this.Ii(e, s);
                }
            }
            U = !u || !c.containerless && !j && $ !== false;
            if (U && e.childNodes.length > 0) {
                t = e.firstChild;
                while (t !== null) {
                    t = this.yi(t, s);
                }
            }
        }
        return h;
    }
    Ti(t, e) {
        const s = t.parentNode;
        const i = e.ep.parse(t.textContent, 1);
        const n = t.nextSibling;
        let r;
        let l;
        let h;
        let a;
        let c;
        if (i !== null) {
            ({parts: r, expressions: l} = i);
            if (c = r[0]) {
                insertBefore(s, e.Mi(c), t);
            }
            for (h = 0, a = l.length; a > h; ++h) {
                insertManyBefore(s, t, [ e.wt(), e.Mi(" ") ]);
                if (c = r[h + 1]) {
                    insertBefore(s, e.Mi(c), t);
                }
                e.rows.push([ new TextBindingInstruction(l[h]) ]);
            }
            s.removeChild(t);
        }
        return n;
    }
    Si(t, e, s, i) {
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
        for (let x = 0; x < r; ++x) {
            u = e.charCodeAt(x);
            if (u === 92) {
                ++x;
            } else if (u === 58) {
                h = e.slice(c, x);
                while (e.charCodeAt(++x) <= 32) ;
                c = x;
                for (;x < r; ++x) {
                    u = e.charCodeAt(x);
                    if (u === 92) {
                        ++x;
                    } else if (u === 59) {
                        a = e.slice(c, x);
                        break;
                    }
                }
                if (a === void 0) {
                    a = e.slice(c);
                }
                d = i.Le.parse(h, a);
                p = i.Ai(d);
                m = n.attrs[d.target];
                if (m == null) {
                    throw createMappedError(707, d.target, s.name);
                }
                if (p === null) {
                    f = i.ep.parse(a, 1);
                    l.push(f === null ? new SetPropertyInstruction(a, m.name) : new InterpolationInstruction(f, m.name));
                } else {
                    Ye.node = t;
                    Ye.attr = d;
                    Ye.bindable = m;
                    Ye.def = s;
                    l.push(p.build(Ye, i.ep, i.m));
                }
                while (x < r && e.charCodeAt(++x) <= 32) ;
                c = x;
                h = void 0;
                a = void 0;
            }
        }
        resetCommandBuildInfo();
        return l;
    }
    wi(e, s) {
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
                const h = t.toArray(s.attributes).filter((t => !es.includes(t.name)));
                if (h.length > 0) ;
                s.remove();
                e[i] = {
                    attribute: n ?? void 0,
                    mode: getBindingMode(s)
                };
                return e;
            }), {});
            class LocalTemplateType {}
            S(LocalTemplateType, "name", {
                value: r
            });
            a.push(LocalTemplateType);
            s.Fi(defineElement({
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
    Ei(t, e) {
        const s = t.nodeName;
        return s === "INPUT" && Je[t.type] === 1 || s === "SELECT" && (t.hasAttribute("multiple") || e?.some((t => t.type === "rg" && t.to === "multiple")));
    }
    Li(t, e) {
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
    Ii(t, e) {
        insertBefore(t.parentNode, e.qi("au*"), t);
        return t;
    }
    Di(t, e) {
        if (isMarker(t)) {
            return t;
        }
        const s = t.parentNode;
        const i = e.wt();
        insertManyBefore(s, t, [ i, e.qi(Ge), e.qi(Xe) ]);
        s.removeChild(t);
        return i;
    }
}

const Ue = "TEMPLATE";

const Ge = "au-start";

const Xe = "au-end";

const isMarker = t => t.nodeValue === "au*";

class CompilationContext {
    constructor(e, i, n, r, l, h) {
        this.hasSlot = false;
        this.Hi = createLookup();
        const a = r !== null;
        this.c = i;
        this.root = l === null ? this : l;
        this.def = e;
        this.ci = n;
        this.parent = r;
        this.bi = a ? r.bi : i.get(We);
        this.Le = a ? r.Le : i.get(ae);
        this.ep = a ? r.ep : i.get(s.IExpressionParser);
        this.m = a ? r.m : i.get(be);
        this.Ms = a ? r.Ms : i.get(t.ILogger);
        this.p = a ? r.p : i.get(W);
        this.localEls = a ? r.localEls : new Set;
        this.rows = h ?? [];
    }
    Fi(t) {
        var e;
        ((e = this.root).deps ?? (e.deps = [])).push(t);
        this.root.c.register(t);
    }
    Mi(t) {
        return createText(this.p, t);
    }
    qi(t) {
        return createComment(this.p, t);
    }
    wt() {
        return this.qi("au*");
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
    Ci(t) {
        return this.c.find(at, t);
    }
    Bi(t) {
        return this.c.find(tt, t);
    }
    Pi(t) {
        return new CompilationContext(this.def, this.c, this.ci, this, this.root, t);
    }
    Ai(t) {
        if (this.root !== this) {
            return this.root.Ai(t);
        }
        const e = t.command;
        if (e === null) {
            return null;
        }
        let s = this.Hi[e];
        if (s === void 0) {
            s = this.c.create(me, e);
            if (s === null) {
                throw createMappedError(713, e);
            }
            this.Hi[e] = s;
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
    Ye.node = Ye.attr = Ye.bindable = Ye.def = null;
};

const Qe = {
    projections: null
};

const Ke = {
    name: "unnamed"
};

const Ye = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const Ze = y(createLookup(), {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
});

const Je = {
    checkbox: 1,
    radio: 1
};

const ts = new WeakMap;

class BindablesInfo {
    static from(t, e) {
        let s = ts.get(t);
        if (s == null) {
            const i = t.bindables;
            const n = createLookup();
            const r = e ? t.defaultBindingMode === void 0 ? 8 : t.defaultBindingMode : 8;
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
            ts.set(t, s = new BindablesInfo(n, i, c));
        }
        return s;
    }
    constructor(t, e, s) {
        this.attrs = t;
        this.bindables = e;
        this.primary = s;
    }
}

const es = w([ "name", "attribute", "mode" ]);

const ss = "as-custom-element";

const processTemplateName = (t, e, s) => {
    const i = e.getAttribute(ss);
    if (i === null || i === "") {
        throw createMappedError(715, t);
    }
    if (s.has(i)) {
        throw createMappedError(716, i, t);
    } else {
        s.add(i);
        e.removeAttribute(ss);
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

const is = /*@__PURE__*/ I("ITemplateCompilerHooks");

const ns = new WeakMap;

const rs = /*@__PURE__*/ f("compiler-hooks");

const os = w({
    name: rs,
    define(t) {
        let e = ns.get(t);
        if (e === void 0) {
            ns.set(t, e = new TemplateCompilerHooksDefinition(t));
            h(rs, e, t);
            d(t, rs);
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
        t.register(E(is, this.Type));
    }
}

const templateCompilerHooks = t => {
    return t === void 0 ? decorator : decorator(t);
    function decorator(t) {
        return os.define(t);
    }
};

const ls = "default";

const hs = "au-slot";

class Show {
    constructor() {
        this.el = t.resolve(z);
        this.p = t.resolve(W);
        this.Oi = false;
        this.U = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.U = null;
            if (Boolean(this.value) !== this.Vi) {
                if (this.Vi === this.Ni) {
                    this.Vi = !this.Ni;
                    this.$val = this.el.style.getPropertyValue("display");
                    this.$prio = this.el.style.getPropertyPriority("display");
                    this.el.style.setProperty("display", "none", "important");
                } else {
                    this.Vi = this.Ni;
                    this.el.style.setProperty("display", this.$val, this.$prio);
                    if (this.el.getAttribute("style") === "") {
                        this.el.removeAttribute("style");
                    }
                }
            }
        };
        const e = t.resolve(Ft);
        this.Vi = this.Ni = e.alias !== "hide";
    }
    binding() {
        this.Oi = true;
        this.update();
    }
    detaching() {
        this.Oi = false;
        this.U?.cancel();
        this.U = null;
    }
    valueChanged() {
        if (this.Oi && this.U === null) {
            this.U = this.p.domWriteQueue.queueTask(this.update);
        }
    }
}

__decorate([ bindable ], Show.prototype, "value", void 0);

alias("hide")(Show);

customAttribute("show")(Show);

const as = [ TemplateCompiler, s.DirtyChecker, NodeObserverLocator ];

const cs = [ exports.RefAttributePattern, exports.DotSeparatedAttributePattern, de ];

const us = [ exports.AtPrefixedTriggerAttributePattern, exports.ColonPrefixedBindAttributePattern ];

const fs = [ exports.DefaultBindingCommand, exports.OneTimeBindingCommand, exports.FromViewBindingCommand, exports.ToViewBindingCommand, exports.TwoWayBindingCommand, exports.ForBindingCommand, xe, exports.TriggerBindingCommand, exports.CaptureBindingCommand, exports.ClassBindingCommand, exports.StyleBindingCommand, exports.AttrBindingCommand, ge ];

const ds = [ DebounceBindingBehavior, OneTimeBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, SignalBindingBehavior, ThrottleBindingBehavior, TwoWayBindingBehavior, SanitizeValueConverter, If, Else, Repeat, With, exports.Switch, exports.Case, exports.DefaultCase, exports.PromiseTemplateController, exports.PendingTemplateController, exports.FulfilledTemplateController, exports.RejectedTemplateController, Ve, Ne, $e, AttrBindingBehavior, SelfBindingBehavior, UpdateTriggerBindingBehavior, AuCompose, Portal, Focus, Show, exports.AuSlot ];

const ps = [ exports.PropertyBindingRenderer, exports.IteratorBindingRenderer, exports.RefBindingRenderer, exports.InterpolationBindingRenderer, exports.SetPropertyRenderer, exports.CustomElementRenderer, exports.CustomAttributeRenderer, exports.TemplateControllerRenderer, exports.LetElementRenderer, exports.ListenerBindingRenderer, exports.AttributeBindingRenderer, exports.SetAttributeRenderer, exports.SetClassAttributeRenderer, exports.SetStyleAttributeRenderer, exports.StylePropertyBindingRenderer, exports.TextBindingRenderer, exports.SpreadRenderer ];

const ms = /*@__PURE__*/ createConfiguration(t.noop);

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
            return e.register(P(s.ICoercionConfiguration, i.coercingOptions), ...as, ...ds, ...cs, ...fs, ...ps);
        },
        customize(e) {
            return createConfiguration(e ?? t);
        }
    };
}

function children(t, e) {
    if (!vs) {
        vs = true;
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
        let l = at.getAnnotation(r, n);
        if (l == null) {
            at.annotate(r, n, l = []);
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
    constructor(t, e, s, i = defaultChildQuery, n = defaultChildFilter, r = defaultChildMap, l = xs) {
        this.$i = void 0;
        this.ot = defaultChildQuery;
        this.ji = defaultChildFilter;
        this.Wi = defaultChildMap;
        this.isBound = false;
        this.G = t;
        this.obj = e;
        this.cb = s;
        this.ot = i;
        this.ji = n;
        this.Wi = r;
        this.et = l;
        this.gs = createMutationObserver(this.zi = t.host, (() => {
            this.Ui();
        }));
    }
    getValue() {
        return this.isBound ? this.$i : this.Gi();
    }
    setValue(t) {}
    bind() {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        this.gs.observe(this.zi, this.et);
        this.$i = this.Gi();
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.gs.disconnect();
        this.$i = t.emptyArray;
    }
    Ui() {
        this.$i = this.Gi();
        this.cb?.call(this.obj);
        this.subs.notify(this.$i, undefined);
    }
    get() {
        throw createMappedError(99, "get");
    }
    Gi() {
        return filterChildren(this.G, this.ot, this.ji, this.Wi);
    }
}

const xs = {
    childList: true
};

const defaultChildQuery = t => t.host.childNodes;

const defaultChildFilter = (t, e, s) => !!s;

const defaultChildMap = (t, e, s) => s;

const gs = {
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
        a = findElementControllerFor(h, gs);
        c = a?.viewModel ?? null;
        if (s(h, a, c)) {
            l.push(i(h, a, c));
        }
    }
    return l;
};

class ChildrenLifecycleHooks {
    constructor(t) {
        this.lt = t;
    }
    register(t) {
        P(At, this).register(t);
    }
    hydrating(t, e) {
        const s = this.lt;
        const i = new ChildrenBinding(e, t, t[s.callback ?? `${g(s.name)}Changed`], s.query ?? defaultChildQuery, s.filter ?? defaultChildFilter, s.map ?? defaultChildMap, s.options ?? xs);
        S(t, s.name, {
            enumerable: true,
            configurable: true,
            get: y((() => i.getValue()), {
                getObserver: () => i
            }),
            set: () => {}
        });
        e.addBinding(i);
    }
}

let vs = false;

exports.AdoptedStyleSheetsStyles = AdoptedStyleSheetsStyles;

exports.AppRoot = AppRoot;

exports.AppTask = j;

exports.AttrBindingBehavior = AttrBindingBehavior;

exports.AttrSyntax = AttrSyntax;

exports.AttributeBinding = AttributeBinding;

exports.AttributeBindingInstruction = AttributeBindingInstruction;

exports.AttributeNSAccessor = AttributeNSAccessor;

exports.AttributePattern = fe;

exports.AuCompose = AuCompose;

exports.AuSlotsInfo = AuSlotsInfo;

exports.Aurelia = Aurelia;

exports.Bindable = R;

exports.BindableDefinition = BindableDefinition;

exports.BindablesInfo = BindablesInfo;

exports.BindingBehavior = M;

exports.BindingBehaviorDefinition = BindingBehaviorDefinition;

exports.BindingCommand = me;

exports.BindingCommandDefinition = BindingCommandDefinition;

exports.BindingModeBehavior = BindingModeBehavior;

exports.BindingTargetSubscriber = BindingTargetSubscriber;

exports.CSSModulesProcessorRegistry = CSSModulesProcessorRegistry;

exports.CheckedObserver = CheckedObserver;

exports.ChildrenBinding = ChildrenBinding;

exports.ClassAttributeAccessor = ClassAttributeAccessor;

exports.ComputedWatcher = ComputedWatcher;

exports.ContentBinding = ContentBinding;

exports.Controller = Controller;

exports.CustomAttribute = tt;

exports.CustomAttributeDefinition = CustomAttributeDefinition;

exports.CustomElement = at;

exports.CustomElementDefinition = CustomElementDefinition;

exports.DataAttributeAccessor = DataAttributeAccessor;

exports.DebounceBindingBehavior = DebounceBindingBehavior;

exports.DefaultBindingLanguage = fs;

exports.DefaultBindingSyntax = cs;

exports.DefaultComponents = as;

exports.DefaultRenderers = ps;

exports.DefaultResources = ds;

exports.Else = Else;

exports.ExpressionWatcher = ExpressionWatcher;

exports.FlushQueue = FlushQueue;

exports.Focus = Focus;

exports.FragmentNodeSequence = FragmentNodeSequence;

exports.FromViewBindingBehavior = FromViewBindingBehavior;

exports.HydrateAttributeInstruction = HydrateAttributeInstruction;

exports.HydrateElementInstruction = HydrateElementInstruction;

exports.HydrateLetElementInstruction = HydrateLetElementInstruction;

exports.HydrateTemplateController = HydrateTemplateController;

exports.IAppRoot = re;

exports.IAppTask = $;

exports.IAttrMapper = be;

exports.IAttributeParser = ae;

exports.IAttributePattern = he;

exports.IAuSlotWatcher = Dt;

exports.IAuSlotsInfo = qt;

exports.IAurelia = oe;

exports.IController = te;

exports.IEventTarget = U;

exports.IFlushQueue = vt;

exports.IHistory = Z;

exports.IHydrationContext = ee;

exports.IInstruction = Ft;

exports.ILifecycleHooks = At;

exports.ILocation = Y;

exports.INode = z;

exports.IPlatform = W;

exports.IRenderLocation = G;

exports.IRenderer = Ot;

exports.IRendering = Gt;

exports.ISVGAnalyzer = ve;

exports.ISanitizer = je;

exports.IShadowDOMGlobalStyles = dt;

exports.IShadowDOMStyles = ft;

exports.ISyntaxInterpreter = le;

exports.ITemplateCompiler = Ht;

exports.ITemplateCompilerHooks = is;

exports.ITemplateElementFactory = We;

exports.IViewFactory = Pt;

exports.IWindow = K;

exports.If = If;

exports.InterpolationBinding = InterpolationBinding;

exports.InterpolationInstruction = InterpolationInstruction;

exports.InterpolationPartBinding = InterpolationPartBinding;

exports.Interpretation = Interpretation;

exports.IteratorBindingInstruction = IteratorBindingInstruction;

exports.LetBinding = LetBinding;

exports.LetBindingInstruction = LetBindingInstruction;

exports.LifecycleHooks = _t;

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

exports.ShortHandBindingSyntax = us;

exports.SignalBindingBehavior = SignalBindingBehavior;

exports.SpreadBindingInstruction = SpreadBindingInstruction;

exports.SpreadElementPropBindingInstruction = SpreadElementPropBindingInstruction;

exports.StandardConfiguration = ms;

exports.StyleAttributeAccessor = StyleAttributeAccessor;

exports.StyleConfiguration = pt;

exports.StyleElementStyles = StyleElementStyles;

exports.StylePropertyBindingInstruction = StylePropertyBindingInstruction;

exports.TemplateCompiler = TemplateCompiler;

exports.TemplateCompilerHooks = os;

exports.TextBindingInstruction = TextBindingInstruction;

exports.ThrottleBindingBehavior = ThrottleBindingBehavior;

exports.ToViewBindingBehavior = ToViewBindingBehavior;

exports.TwoWayBindingBehavior = TwoWayBindingBehavior;

exports.UpdateTriggerBindingBehavior = UpdateTriggerBindingBehavior;

exports.ValueAttributeObserver = ValueAttributeObserver;

exports.ValueConverter = xt;

exports.ValueConverterDefinition = ValueConverterDefinition;

exports.ViewFactory = ViewFactory;

exports.Watch = it;

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
