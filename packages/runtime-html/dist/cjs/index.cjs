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

function __param(t, e) {
    return function(s, i) {
        e(s, i, t);
    };
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

const createError = t => new Error(t);

const b = v.hasOwnProperty;

const w = x.freeze;

const y = x.assign;

const k = x.getOwnPropertyNames;

const A = x.keys;

const C = /*@__PURE__*/ createLookup();

const isDataAttribute = (t, e, s) => {
    if (C[e] === true) {
        return true;
    }
    if (!isString(e)) {
        return false;
    }
    const i = e.slice(0, 5);
    return C[e] = i === "aria-" || i === "data-" || s.isStandardSvgAttribute(t, e);
};

const isPromise = t => t instanceof Promise;

const isArray = t => t instanceof Array;

const isFunction = t => typeof t === "function";

const isString = t => typeof t === "string";

const R = x.defineProperty;

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
            s.property = e;
        }
        h(_, BindableDefinition.create(e, t, s), t.constructor, e);
        p(t.constructor, T.keyFrom(e));
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

const T = w({
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
                s[t.property] = t;
            } else if (t !== void 0) {
                A(t).forEach((e => addDescription(e, t[e])));
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
        this.property = n;
        this.set = r;
    }
    static create(e, s, i = {}) {
        return new BindableDefinition(i.attribute ?? t.kebabCase(e), i.callback ?? `${e}Changed`, i.mode ?? 2, i.primary ?? false, i.property ?? e, i.set ?? getInterceptor(e, s, i));
    }
}

function coercer(t, e, s) {
    I.define(t, e);
}

const I = {
    key: /*@__PURE__*/ u("coercer"),
    define(t, e) {
        h(I.key, t[e].bind(t), t);
    },
    for(t) {
        return r(I.key, t);
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
            l = typeof e === "function" ? e.bind(r) : I.for(r) ?? t.noop;
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

const E = t.DI.createInterface;

const L = t.Registration.singleton;

const P = t.Registration.aliasTo;

const M = t.Registration.instance;

t.Registration.callback;

const D = t.Registration.transient;

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

function bindingBehavior(t) {
    return function(e) {
        return q.define(t, e);
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
        return new BindingBehaviorDefinition(s, t.firstDefined(getBehaviorAnnotation(s, "name"), i), t.mergeArrays(getBehaviorAnnotation(s, "aliases"), n.aliases, s.aliases), q.keyFrom(i));
    }
    register(t) {
        const {Type: e, key: s, aliases: i} = this;
        L(s, e).register(t);
        P(s, e).register(t);
        registerAliases(i, q, s, t);
    }
}

const $ = f("binding-behavior");

const getBehaviorAnnotation = (t, e) => r(u(e), t);

const q = w({
    name: $,
    keyFrom(t) {
        return `${$}:${t}`;
    },
    isType(t) {
        return isFunction(t) && l($, t);
    },
    define(t, e) {
        const s = BindingBehaviorDefinition.create(t, e);
        h($, s, s.Type);
        h($, s, s);
        d(e, $);
        return s.Type;
    },
    getDefinition(t) {
        const e = r($, t);
        if (e === void 0) {
            throw createError(`AUR0151:${t.name}`);
        }
        return e;
    },
    annotate(t, e, s) {
        h(u(e), s, t);
    },
    getAnnotation: getBehaviorAnnotation
});

const U = new Map;

class BindingModeBehavior {
    bind(t, e) {
        U.set(e, e.mode);
        e.mode = this.mode;
    }
    unbind(t, e) {
        e.mode = U.get(e);
        U.delete(e);
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

const F = new WeakMap;

const H = 200;

class DebounceBindingBehavior {
    constructor(t) {
        this.p = t;
    }
    bind(e, s, i, n) {
        const r = {
            type: "debounce",
            delay: i ?? H,
            now: this.p.performanceNow,
            queue: this.p.taskQueue,
            signals: isString(n) ? [ n ] : n ?? t.emptyArray
        };
        const l = s.limit?.(r);
        if (l == null) ; else {
            F.set(s, l);
        }
    }
    unbind(t, e) {
        F.get(e)?.dispose();
        F.delete(e);
    }
}

DebounceBindingBehavior.inject = [ t.IPlatform ];

bindingBehavior("debounce")(DebounceBindingBehavior);

class SignalBindingBehavior {
    constructor(t) {
        this.i = new Map;
        this.u = t;
    }
    bind(t, e, ...s) {
        if (!("handleChange" in e)) {
            throw createError(`AUR0817`);
        }
        if (s.length === 0) {
            throw createError(`AUR0818`);
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

SignalBindingBehavior.inject = [ s.ISignaler ];

bindingBehavior("signal")(SignalBindingBehavior);

const O = new WeakMap;

const V = 200;

class ThrottleBindingBehavior {
    constructor(t) {
        this.A = t.performanceNow;
        this.C = t.taskQueue;
    }
    bind(e, s, i, n) {
        const r = {
            type: "throttle",
            delay: i ?? V,
            now: this.A,
            queue: this.C,
            signals: isString(n) ? [ n ] : n ?? t.emptyArray
        };
        const l = s.limit?.(r);
        if (l == null) ; else {
            O.set(s, l);
        }
    }
    unbind(t, e) {
        O.get(e)?.dispose();
        O.delete(e);
    }
}

ThrottleBindingBehavior.inject = [ t.IPlatform ];

bindingBehavior("throttle")(ThrottleBindingBehavior);

const N = /*@__PURE__*/ E("IAppTask");

class $AppTask {
    constructor(t, e, s) {
        this.c = void 0;
        this.slot = t;
        this.k = e;
        this.cb = s;
    }
    register(t) {
        return this.c = t.register(M(N, this));
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

const z = "au-start";

const G = "au-end";

const createElement = (t, e) => t.document.createElement(e);

const createComment = (t, e) => t.document.createComment(e);

const createLocation = t => {
    const e = createComment(t, G);
    e.$start = createComment(t, z);
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

const getPreviousSibling = t => t.previousSibling;

const appendToTemplate = (t, e) => t.content.appendChild(e);

const appendManyToTemplate = (t, e) => {
    const s = e.length;
    let i = 0;
    while (s > i) {
        t.content.appendChild(e[i]);
        ++i;
    }
};

const markerToLocation = t => {
    const e = t.previousSibling;
    let s;
    if (e?.nodeType === 8 && e.textContent === "au-end") {
        s = e;
        if ((s.$start = s.previousSibling) == null) {
            throw markerMalformedError();
        }
        t.parentNode?.removeChild(t);
        return s;
    } else {
        throw markerMalformedError();
    }
};

const createMutationObserver = (t, e) => new t.ownerDocument.defaultView.MutationObserver(e);

const markerMalformedError = () => createError(`AURxxxx`);

class Refs {}

function getRef(t, e) {
    return t.$au?.[e] ?? null;
}

function setRef(t, e, s) {
    var i;
    ((i = t).$au ?? (i.$au = new Refs))[e] = s;
}

const X = /*@__PURE__*/ E("INode");

const K = /*@__PURE__*/ E("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(he, true)) {
        return t.get(he).host;
    }
    return t.get(W).document;
}))));

const Q = /*@__PURE__*/ E("IRenderLocation");

const Y = /*@__PURE__*/ E("CssModules");

const Z = new WeakMap;

function getEffectiveParentNode(t) {
    if (Z.has(t)) {
        return Z.get(t);
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
            Z.set(s[t], e);
        }
    } else {
        Z.set(t, e);
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
        this.f = e;
        const s = e.querySelectorAll(".au");
        let i = 0;
        let n = s.length;
        let r;
        let l = this.t = Array(n);
        while (n > i) {
            r = s[i];
            if (r.nodeName === "AU-M") {
                l[i] = markerToLocation(r);
            } else {
                l[i] = r;
            }
            ++i;
        }
        const h = e.childNodes;
        const a = this.childNodes = Array(n = h.length);
        i = 0;
        while (n > i) {
            a[i] = h[i];
            ++i;
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
                let s = this.R;
                let i;
                const n = this.B;
                while (s != null) {
                    i = s.nextSibling;
                    e.insertBefore(s, t);
                    if (s === n) {
                        break;
                    }
                    s = i;
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
            let s;
            const i = this.B;
            while (e != null) {
                s = e.nextSibling;
                t.appendChild(e);
                if (e === i) {
                    break;
                }
                e = s;
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
            let s;
            let i = this.R;
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
        if (this._) {
            let s = this.R;
            let i;
            const n = this.B;
            while (s != null) {
                i = s.nextSibling;
                e.insertBefore(s, t);
                if (s === n) {
                    break;
                }
                s = i;
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

const J = /*@__PURE__*/ E("IWindow", (t => t.callback((t => t.get(W).window))));

const tt = /*@__PURE__*/ E("ILocation", (t => t.callback((t => t.get(J).location))));

const et = /*@__PURE__*/ E("IHistory", (t => t.callback((t => t.get(J).history))));

const registerHostNode = (e, s, i) => {
    registerResolver(e, s.HTMLElement, registerResolver(e, s.Element, registerResolver(e, X, new t.InstanceProvider("ElementResolver", i))));
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
        return new CustomAttributeDefinition(s, t.firstDefined(getAttributeAnnotation(s, "name"), i), t.mergeArrays(getAttributeAnnotation(s, "aliases"), n.aliases, s.aliases), getAttributeKeyFrom(i), t.firstDefined(getAttributeAnnotation(s, "defaultBindingMode"), n.defaultBindingMode, s.defaultBindingMode, 2), t.firstDefined(getAttributeAnnotation(s, "isTemplateController"), n.isTemplateController, s.isTemplateController, false), T.from(s, ...T.getAll(s), getAttributeAnnotation(s, "bindables"), s.bindables, n.bindables), t.firstDefined(getAttributeAnnotation(s, "noMultiBindings"), n.noMultiBindings, s.noMultiBindings, false), t.mergeArrays(ot.getAnnotation(s), s.watches), t.mergeArrays(getAttributeAnnotation(s, "dependencies"), n.dependencies, s.dependencies));
    }
    register(t) {
        const {Type: e, key: s, aliases: i} = this;
        D(s, e).register(t);
        P(s, e).register(t);
        registerAliases(i, it, s, t);
    }
}

const st = f("custom-attribute");

const getAttributeKeyFrom = t => `${st}:${t}`;

const getAttributeAnnotation = (t, e) => r(u(e), t);

const isAttributeType = t => isFunction(t) && l(st, t);

const findAttributeControllerFor = (t, e) => getRef(t, getAttributeKeyFrom(e)) ?? void 0;

const defineAttribute = (t, e) => {
    const s = CustomAttributeDefinition.create(t, e);
    h(st, s, s.Type);
    h(st, s, s);
    d(e, st);
    return s.Type;
};

const getAttributeDefinition = t => {
    const e = r(st, t);
    if (e === void 0) {
        throw createError(`AUR0759:${t.name}`);
    }
    return e;
};

const it = w({
    name: st,
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
        throw createError(`AUR0772`);
    }
    return function decorator(s, i, n) {
        const r = i == null;
        const l = r ? s : s.constructor;
        const h = new WatchDefinition(t, r ? e : n.value);
        if (r) {
            if (!isFunction(e) && (e == null || !(e in l.prototype))) {
                throw createError(`AUR0773:${g(e)}@${l.name}}`);
            }
        } else if (!isFunction(n?.value)) {
            throw createError(`AUR0774:${g(i)}`);
        }
        ot.add(l, h);
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

const nt = t.emptyArray;

const rt = u("watch");

const ot = w({
    name: rt,
    add(t, e) {
        let s = r(rt, t);
        if (s == null) {
            h(rt, s = [], t);
        }
        s.push(e);
    },
    getAnnotation(t) {
        return r(rt, t) ?? nt;
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
    const e = r(at, t);
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

const lt = new WeakMap;

class CustomElementDefinition {
    get type() {
        return 1;
    }
    constructor(t, e, s, i, n, r, l, h, a, c, u, f, d, p, m, x, g, v, b, w) {
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
        this.isStrictBinding = m;
        this.shadowOptions = x;
        this.hasSlots = g;
        this.enhance = v;
        this.watches = b;
        this.processContent = w;
    }
    static create(e, s = null) {
        if (s === null) {
            const i = e;
            if (isString(i)) {
                throw createError(`AUR0761:${e}`);
            }
            const n = t.fromDefinitionOrDefault("name", i, ct);
            if (isFunction(i.Type)) {
                s = i.Type;
            } else {
                s = ut(t.pascalCase(n));
            }
            return new CustomElementDefinition(s, n, t.mergeArrays(i.aliases), t.fromDefinitionOrDefault("key", i, (() => getElementKeyFrom(n))), t.fromDefinitionOrDefault("cache", i, returnZero), t.fromDefinitionOrDefault("capture", i, returnFalse), t.fromDefinitionOrDefault("template", i, returnNull), t.mergeArrays(i.instructions), t.mergeArrays(i.dependencies), t.fromDefinitionOrDefault("injectable", i, returnNull), t.fromDefinitionOrDefault("needsCompile", i, returnTrue), t.mergeArrays(i.surrogates), T.from(s, i.bindables), t.fromDefinitionOrDefault("containerless", i, returnFalse), t.fromDefinitionOrDefault("isStrictBinding", i, returnFalse), t.fromDefinitionOrDefault("shadowOptions", i, returnNull), t.fromDefinitionOrDefault("hasSlots", i, returnFalse), t.fromDefinitionOrDefault("enhance", i, returnFalse), t.fromDefinitionOrDefault("watches", i, returnEmptyArray), t.fromAnnotationOrTypeOrDefault("processContent", s, returnNull));
        }
        if (isString(e)) {
            return new CustomElementDefinition(s, e, t.mergeArrays(getElementAnnotation(s, "aliases"), s.aliases), getElementKeyFrom(e), t.fromAnnotationOrTypeOrDefault("cache", s, returnZero), t.fromAnnotationOrTypeOrDefault("capture", s, returnFalse), t.fromAnnotationOrTypeOrDefault("template", s, returnNull), t.mergeArrays(getElementAnnotation(s, "instructions"), s.instructions), t.mergeArrays(getElementAnnotation(s, "dependencies"), s.dependencies), t.fromAnnotationOrTypeOrDefault("injectable", s, returnNull), t.fromAnnotationOrTypeOrDefault("needsCompile", s, returnTrue), t.mergeArrays(getElementAnnotation(s, "surrogates"), s.surrogates), T.from(s, ...T.getAll(s), getElementAnnotation(s, "bindables"), s.bindables), t.fromAnnotationOrTypeOrDefault("containerless", s, returnFalse), t.fromAnnotationOrTypeOrDefault("isStrictBinding", s, returnFalse), t.fromAnnotationOrTypeOrDefault("shadowOptions", s, returnNull), t.fromAnnotationOrTypeOrDefault("hasSlots", s, returnFalse), t.fromAnnotationOrTypeOrDefault("enhance", s, returnFalse), t.mergeArrays(ot.getAnnotation(s), s.watches), t.fromAnnotationOrTypeOrDefault("processContent", s, returnNull));
        }
        const i = t.fromDefinitionOrDefault("name", e, ct);
        return new CustomElementDefinition(s, i, t.mergeArrays(getElementAnnotation(s, "aliases"), e.aliases, s.aliases), getElementKeyFrom(i), t.fromAnnotationOrDefinitionOrTypeOrDefault("cache", e, s, returnZero), t.fromAnnotationOrDefinitionOrTypeOrDefault("capture", e, s, returnFalse), t.fromAnnotationOrDefinitionOrTypeOrDefault("template", e, s, returnNull), t.mergeArrays(getElementAnnotation(s, "instructions"), e.instructions, s.instructions), t.mergeArrays(getElementAnnotation(s, "dependencies"), e.dependencies, s.dependencies), t.fromAnnotationOrDefinitionOrTypeOrDefault("injectable", e, s, returnNull), t.fromAnnotationOrDefinitionOrTypeOrDefault("needsCompile", e, s, returnTrue), t.mergeArrays(getElementAnnotation(s, "surrogates"), e.surrogates, s.surrogates), T.from(s, ...T.getAll(s), getElementAnnotation(s, "bindables"), s.bindables, e.bindables), t.fromAnnotationOrDefinitionOrTypeOrDefault("containerless", e, s, returnFalse), t.fromAnnotationOrDefinitionOrTypeOrDefault("isStrictBinding", e, s, returnFalse), t.fromAnnotationOrDefinitionOrTypeOrDefault("shadowOptions", e, s, returnNull), t.fromAnnotationOrDefinitionOrTypeOrDefault("hasSlots", e, s, returnFalse), t.fromAnnotationOrDefinitionOrTypeOrDefault("enhance", e, s, returnFalse), t.mergeArrays(e.watches, ot.getAnnotation(s), s.watches), t.fromAnnotationOrDefinitionOrTypeOrDefault("processContent", e, s, returnNull));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) {
            return t;
        }
        if (lt.has(t)) {
            return lt.get(t);
        }
        const e = CustomElementDefinition.create(t);
        lt.set(t, e);
        h(at, e, e.Type);
        return e;
    }
    register(t) {
        const {Type: e, key: s, aliases: i} = this;
        if (!t.has(s, false)) {
            D(s, e).register(t);
            P(s, e).register(t);
            registerAliases(i, ft, s, t);
        }
    }
}

const ht = {
    name: undefined,
    searchParents: false,
    optional: false
};

const returnZero = () => 0;

const returnNull = () => null;

const returnFalse = () => false;

const returnTrue = () => true;

const returnEmptyArray = () => t.emptyArray;

const at = /*@__PURE__*/ f("custom-element");

const getElementKeyFrom = t => `${at}:${t}`;

const ct = /*@__PURE__*/ (() => {
    let t = 0;
    return () => `unnamed-${++t}`;
})();

const annotateElementMetadata = (t, e, s) => {
    h(u(e), s, t);
};

const defineElement = (t, e) => {
    const s = CustomElementDefinition.create(t, e);
    h(at, s, s.Type);
    h(at, s, s);
    d(s.Type, at);
    return s.Type;
};

const isElementType = t => isFunction(t) && l(at, t);

const findElementControllerFor = (t, e = ht) => {
    if (e.name === void 0 && e.searchParents !== true) {
        const s = getRef(t, at);
        if (s === null) {
            if (e.optional === true) {
                return null;
            }
            throw createError(`AUR0762`);
        }
        return s;
    }
    if (e.name !== void 0) {
        if (e.searchParents !== true) {
            const s = getRef(t, at);
            if (s === null) {
                throw createError(`AUR0763`);
            }
            if (s.is(e.name)) {
                return s;
            }
            return void 0;
        }
        let s = t;
        let i = false;
        while (s !== null) {
            const t = getRef(s, at);
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
        throw createError(`AUR0764`);
    }
    let s = t;
    while (s !== null) {
        const t = getRef(s, at);
        if (t !== null) {
            return t;
        }
        s = getEffectiveParentNode(s);
    }
    throw createError(`AUR0765`);
};

const getElementAnnotation = (t, e) => r(u(e), t);

const getElementDefinition = t => {
    const e = r(at, t);
    if (e === void 0) {
        throw createError(`AUR0760:${t.name}`);
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

const ut = /*@__PURE__*/ function() {
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
        Reflect.defineProperty(n, "name", t);
        if (i !== e) {
            y(n.prototype, i);
        }
        return n;
    };
}();

const ft = w({
    name: at,
    keyFrom: getElementKeyFrom,
    isType: isElementType,
    for: findElementControllerFor,
    define: defineElement,
    getDefinition: getElementDefinition,
    annotate: annotateElementMetadata,
    getAnnotation: getElementAnnotation,
    generateName: ct,
    createInjectable: createElementInjectable,
    generateType: ut
});

const dt = /*@__PURE__*/ u("processContent");

function processContent(t) {
    return t === void 0 ? function(t, e, s) {
        h(dt, ensureHook(t, e), t);
    } : function(e) {
        t = ensureHook(e, t);
        const s = r(at, e);
        if (s !== void 0) {
            s.processContent = t;
        } else {
            h(dt, t, e);
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
            this.M?.();
        }
    }));
    defineHiddenProp(s, "unsubscribe", (function(t) {
        if (this.subs.remove(t) && this.subs.count === 0) {
            for (e of this.cf.events) {
                removeListener(this.L, e, this);
            }
            this.P = false;
            this.$?.();
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
                t[l] = this.U;
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
                this.H = new ClassAttributeAccessor(t);
            }
            binding() {
                this.valueChanged();
            }
            valueChanged() {
                this.H.setValue(this.value?.split(/\s+/g).map((t => s[t] || t)) ?? "");
            }
        }, e.inject = [ X ], e));
        t.register(i, M(Y, s));
    }
}

function shadowCSS(...t) {
    return new ShadowDOMRegistry(t);
}

const pt = /*@__PURE__*/ E("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
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
        const e = t.get(xt);
        const s = t.get(pt);
        t.register(M(mt, s.createStyles(this.css, e)));
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

const mt = /*@__PURE__*/ E("IShadowDOMStyles");

const xt = /*@__PURE__*/ E("IShadowDOMGlobalStyles", (e => e.instance({
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

const gt = {
    shadowDOM(e) {
        return j.creating(t.IContainer, (t => {
            if (e.sharedStyles != null) {
                const s = t.get(pt);
                t.register(M(xt, s.createStyles(e.sharedStyles, null)));
            }
        }));
    }
};

function valueConverter(t) {
    return function(e) {
        return bt.define(t, e);
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
        return new ValueConverterDefinition(s, t.firstDefined(getConverterAnnotation(s, "name"), i), t.mergeArrays(getConverterAnnotation(s, "aliases"), n.aliases, s.aliases), bt.keyFrom(i));
    }
    register(e) {
        const {Type: s, key: i, aliases: n} = this;
        t.Registration.singleton(i, s).register(e);
        t.Registration.aliasTo(i, s).register(e);
        registerAliases(n, bt, i, e);
    }
}

const vt = f("value-converter");

const getConverterAnnotation = (t, e) => r(u(e), t);

const bt = w({
    name: vt,
    keyFrom: t => `${vt}:${t}`,
    isType(t) {
        return isFunction(t) && l(vt, t);
    },
    define(t, e) {
        const s = ValueConverterDefinition.create(t, e);
        h(vt, s, s.Type);
        h(vt, s, s);
        d(e, vt);
        return s.Type;
    },
    getDefinition(t) {
        const e = r(vt, t);
        if (e === void 0) {
            throw createError(`AUR0152:${t.name}`);
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
        this.O = e;
    }
    flush() {
        this.b.updateSource(this.v);
    }
    handleChange(t, e) {
        const i = this.b;
        if (t !== s.astEvaluate(i.ast, i.s, i, null)) {
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
        const e = bt.keyFrom(t);
        let s = wt.get(this);
        if (s == null) {
            wt.set(this, s = new ResourceLookup);
        }
        return s[e] ?? (s[e] = this.l.get(resource(e)));
    }));
    defineHiddenProp(n, "getBehavior", (function(t) {
        const e = q.keyFrom(t);
        let s = wt.get(this);
        if (s == null) {
            wt.set(this, s = new ResourceLookup);
        }
        return s[e] ?? (s[e] = this.l.get(resource(e)));
    }));
};

const wt = new WeakMap;

class ResourceLookup {}

const yt = /*@__PURE__*/ E("IFlushQueue", (t => t.singleton(FlushQueue)));

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

function flushItem(t, e, s) {
    s.delete(t);
    t.flush();
}

const kt = new WeakSet;

const mixingBindingLimited = (t, e) => {
    defineHiddenProp(t.prototype, "limit", (function(t) {
        if (kt.has(this)) {
            throw createError(`AURXXXX: a rate limit has already been applied.`);
        }
        kt.add(this);
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
                kt.delete(this);
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

const {enter: At, exit: Ct} = s.ConnectableSwitcher;

const {wrap: Rt, unwrap: Bt} = s.ProxyObservable;

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
            At(this);
            return this.v = Bt(this.$get.call(void 0, this.useProxy ? Rt(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            Ct(this);
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
        const r = e.$kind === 1 && this.obs.count === 1;
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

const St = /*@__PURE__*/ E("ILifecycleHooks");

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
        L(St, this.Type).register(t);
    }
}

const _t = new WeakMap;

const Tt = u("lifecycle-hooks");

const It = w({
    name: Tt,
    define(t, e) {
        const s = LifecycleHooksDefinition.create(t, e);
        h(Tt, s, e);
        d(e, Tt);
        return s.Type;
    },
    resolve(t) {
        let e = _t.get(t);
        if (e === void 0) {
            _t.set(t, e = new LifecycleHooksLookupImpl);
            const s = t.root;
            const i = s.id === t.id ? t.getAll(St) : t.has(St, false) ? s.getAll(St).concat(t.getAll(St)) : s.getAll(St);
            let n;
            let l;
            let h;
            let a;
            let c;
            for (n of i) {
                l = r(Tt, n.constructor);
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
        return It.define({}, t);
    };
}

class AttributeObserver {
    constructor(t, e, s) {
        this.type = 2 | 1 | 4;
        this.v = null;
        this.ov = null;
        this.W = false;
        this.o = t;
        this.G = e;
        this.X = s;
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
                        this.o.setAttribute(this.X, g(this.v));
                    }
                }
            }
        }
    }
    handleMutation(t) {
        let e = false;
        for (let s = 0, i = t.length; i > s; ++s) {
            const i = t[s];
            if (i.type === "attributes" && i.attributeName === this.G) {
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
        Et = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Et);
    }
}

s.subscriberCollection(AttributeObserver);

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
    const s = t.$eMObs;
    if (s && s.delete(e)) {
        if (s.size === 0) {
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

let Et = void 0;

const Lt = {
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
        this.Y = null;
        this.v = void 0;
        this.boundFn = false;
        this.l = e;
        this.ast = n;
        this.Z = t;
        this.target = r;
        this.oL = s;
        this.C = i;
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
        const e = s.astEvaluate(this.ast, this.s, this, (this.mode & 2) > 0 ? this : null);
        this.obs.clear();
        if (e !== this.v) {
            this.v = e;
            const s = this.Z.state !== 1 && (this.J.type & 4) > 0;
            if (s) {
                t = this.Y;
                this.Y = this.C.queueTask((() => {
                    this.Y = null;
                    this.updateTarget(e);
                }), Lt);
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
        this.J ?? (this.J = new AttributeObserver(this.target, this.targetProperty, this.targetAttribute));
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
        this.Y?.cancel();
        this.Y = null;
        this.obs.clearAll();
    }
}

mixinUseScope(AttributeBinding);

mixingBindingLimited(AttributeBinding, (() => "updateTarget"));

s.connectable(AttributeBinding);

mixinAstEvaluator(true)(AttributeBinding);

const Pt = {
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
        this.Y = null;
        this.Z = t;
        this.oL = s;
        this.C = i;
        this.J = s.getAccessor(r, l);
        const a = n.expressions;
        const c = this.partBindings = Array(a.length);
        const u = a.length;
        let f = 0;
        for (;u > f; ++f) {
            c[f] = new InterpolationPartBinding(a[f], r, l, e, s, this);
        }
    }
    tt() {
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
        const r = this.J;
        const l = this.Z.state !== 1 && (r.type & 4) > 0;
        let h;
        if (l) {
            h = this.Y;
            this.Y = this.C.queueTask((() => {
                this.Y = null;
                r.setValue(i, this.target, this.targetProperty);
            }), Pt);
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
        this.Y?.cancel();
        this.Y = null;
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
        this.owner.tt();
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

class ContentBinding {
    constructor(t, e, s, i, n, r, l, h) {
        this.p = n;
        this.ast = r;
        this.target = l;
        this.strict = h;
        this.isBound = false;
        this.mode = 2;
        this.Y = null;
        this.v = "";
        this.boundFn = false;
        this.l = e;
        this.Z = t;
        this.oL = s;
        this.C = i;
    }
    updateTarget(t) {
        const e = this.target;
        const s = this.p.Node;
        const i = this.v;
        this.v = t;
        if (i instanceof s) {
            i.parentNode?.removeChild(i);
        }
        if (t instanceof s) {
            e.textContent = "";
            e.parentNode?.insertBefore(t, e);
        } else {
            e.textContent = g(t);
        }
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = s.astEvaluate(this.ast, this.s, this, (this.mode & 2) > 0 ? this : null);
        this.obs.clear();
        if (t === this.v) {
            this.Y?.cancel();
            this.Y = null;
            return;
        }
        const e = this.Z.state !== 1;
        if (e) {
            this.et(t);
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
        const e = this.Z.state !== 1;
        if (e) {
            this.et(t);
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
        this.s = void 0;
        this.obs.clearAll();
        this.Y?.cancel();
        this.Y = null;
    }
    et(t) {
        const e = this.Y;
        this.Y = this.C.queueTask((() => {
            this.Y = null;
            this.updateTarget(t);
        }), Pt);
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
        this.target = this.st ? t.bindingContext : t.overrideContext;
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
        this.J = void 0;
        this.Y = null;
        this.it = null;
        this.boundFn = false;
        this.l = e;
        this.Z = t;
        this.C = i;
        this.oL = s;
    }
    updateTarget(t) {
        this.J.setValue(t, this.target, this.targetProperty);
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
        const e = this.Z.state !== 1 && (this.J.type & 4) > 0;
        if (e) {
            Mt = this.Y;
            this.Y = this.C.queueTask((() => {
                this.updateTarget(t);
                this.Y = null;
            }), Dt);
            Mt?.cancel();
            Mt = null;
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
        let n = this.J;
        if (!n) {
            if (i & 4) {
                n = e.getObserver(this.target, this.targetProperty);
            } else {
                n = e.getAccessor(this.target, this.targetProperty);
            }
            this.J = n;
        }
        const r = (i & 2) > 0;
        if (i & (2 | 1)) {
            this.updateTarget(s.astEvaluate(this.ast, this.s, this, r ? this : null));
        }
        if (i & 4) {
            n.subscribe(this.it ?? (this.it = new BindingTargetSubscriber(this, this.l.get(yt))));
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
        if (this.it) {
            this.J.unsubscribe(this.it);
            this.it = null;
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
        if (this.it != null) {
            throw createError(`AURxxxx: binding already has a target subscriber`);
        }
        this.it = t;
    }
}

mixinUseScope(PropertyBinding);

mixingBindingLimited(PropertyBinding, (t => t.mode & 4 ? "updateSource" : "updateTarget"));

s.connectable(PropertyBinding);

mixinAstEvaluator(true, false)(PropertyBinding);

let Mt = null;

const Dt = {
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
        this.nt = n;
    }
    callSource(t) {
        const e = this.s.overrideContext;
        e.$event = t;
        let i = s.astEvaluate(this.ast, this.s, this, null);
        delete e.$event;
        if (isFunction(i)) {
            i = i(t);
        }
        if (i !== true && this.nt.prevent) {
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
        this.target.addEventListener(this.targetEvent, this, this.nt);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        s.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.target.removeEventListener(this.targetEvent, this, this.nt);
    }
}

mixinUseScope(ListenerBinding);

mixingBindingLimited(ListenerBinding, (() => "callSource"));

mixinAstEvaluator(true, true)(ListenerBinding);

const $t = /*@__PURE__*/ E("IViewFactory");

class ViewFactory {
    constructor(t, e) {
        this.isCaching = false;
        this.rt = null;
        this.ot = -1;
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
            if (this.ot === -1 || !e) {
                this.ot = t;
            }
        }
        if (this.ot > 0) {
            this.rt = [];
        } else {
            this.rt = null;
        }
        this.isCaching = this.ot > 0;
    }
    canReturnToCache(t) {
        return this.rt != null && this.rt.length < this.ot;
    }
    tryReturnToCache(t) {
        if (this.canReturnToCache(t)) {
            this.rt.push(t);
            return true;
        }
        return false;
    }
    create(t) {
        const e = this.rt;
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

const qt = /*@__PURE__*/ E("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

const Ut = /*@__PURE__*/ E("IAuSlotWatcher");

class AuSlotWatcherBinding {
    static create(t, e, s, i, n) {
        const r = t.viewModel;
        const l = new AuSlotWatcherBinding(r, s, i, n);
        S(r, e, {
            enumerable: true,
            configurable: true,
            get: y((() => l.getValue()), {
                getObserver: () => l
            }),
            set: () => {}
        });
        return l;
    }
    constructor(e, s, i, n) {
        this.lt = new Set;
        this.ht = t.emptyArray;
        this.isBound = false;
        this.cb = (this.o = e)[s];
        this.slotName = i;
        this.ct = n;
    }
    bind() {
        this.isBound = true;
    }
    unbind() {
        this.isBound = false;
    }
    getValue() {
        return this.ht;
    }
    watch(t) {
        if (!this.lt.has(t)) {
            this.lt.add(t);
            t.subscribe(this);
        }
    }
    unwatch(t) {
        if (this.lt.delete(t)) {
            t.unsubscribe(this);
        }
    }
    handleSlotChange(t, e) {
        if (!this.isBound) {
            return;
        }
        const s = this.ht;
        const i = [];
        let n;
        let r;
        for (n of this.lt) {
            for (r of n === t ? e : n.nodes) {
                if (this.ct === "*" || r.nodeType === 1 && r.matches(this.ct)) {
                    i[i.length] = r;
                }
            }
        }
        if (i.length !== s.length || i.some(((t, e) => t !== s[e]))) {
            this.ht = i;
            this.cb?.call(this.o, i);
            this.subs.notify(i, s);
        }
    }
    get() {
        throw new Error("not implemented");
    }
}

class SlottedLifecycleHooks {
    constructor(t) {
        this.def = t;
    }
    register(t) {
        M(St, this).register(t);
    }
    hydrating(t, e) {
        const s = this.def;
        const i = AuSlotWatcherBinding.create(e, s.name, s.callback ?? `${g(s.name)}Changed`, s.slotName ?? "default", s.query ?? "*");
        M(Ut, i).register(e.container);
        e.addBinding(i);
    }
}

function slotted(t, e) {
    if (!Ft) {
        Ft = true;
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
            throw new Error(`Invalid usage. @slotted can only be used on a field`);
        }
        const h = s.constructor;
        let a = ft.getAnnotation(h, i);
        if (a == null) {
            ft.annotate(h, i, a = []);
        }
        a.push(new SlottedLifecycleHooks(l));
    }
    return decorator;
}

let Ft = false;

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

const Ht = /*@__PURE__*/ E("Instruction");

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
    constructor(t, e) {
        this.from = t;
        this.strict = e;
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

const Ot = /*@__PURE__*/ E("ITemplateCompiler");

const Vt = /*@__PURE__*/ E("IRenderer");

function renderer(t) {
    return function decorator(e) {
        e.register = function(t) {
            L(Vt, this).register(t);
        };
        R(e.prototype, "target", {
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
        throw createError(`AUR0750`);

      case "view-model":
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
                throw createError(`AUR0751:${e}`);
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
    static get inject() {
        return [ Qt ];
    }
    constructor(t) {
        this.r = t;
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
            h = p.find(ft, f);
            if (h == null) {
                throw createError(`AUR0752:${f}@${e["name"]}`);
            }
            break;

          default:
            h = f;
        }
        const m = i.containerless || h.containerless;
        const x = m ? convertToRenderLocation(s) : null;
        const g = createElementContainer(n, e, s, i, x, d == null ? void 0 : new AuSlotsInfo(A(d)));
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
    static get inject() {
        return [ Qt ];
    }
    constructor(t) {
        this.r = t;
    }
    render(t, e, s, i, n, r) {
        let l = t.container;
        let h;
        switch (typeof s.res) {
          case "string":
            h = l.find(it, s.res);
            if (h == null) {
                throw createError(`AUR0753:${s.res}@${t["name"]}`);
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
    static get inject() {
        return [ Qt, W ];
    }
    constructor(t, e) {
        this.r = t;
        this.p = e;
    }
    render(t, e, s, i, n, r) {
        let l = t.container;
        let h;
        switch (typeof s.res) {
          case "string":
            h = l.find(it, s.res);
            if (h == null) {
                throw createError(`AUR0754:${s.res}@${t["name"]}`);
            }
            break;

          default:
            h = s.res;
        }
        const a = this.r.getViewFactory(s.def, l);
        const c = convertToRenderLocation(e);
        const u = invokeAttribute(this.p, h, t, e, s, a, c);
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
        t.addBinding(new ContentBinding(t, t.container, r, i.domWriteQueue, i, ensureExpression(n, s.from, 16), insertBefore(e.parentNode, createText(i, ""), e), s.strict));
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
        const h = l.has(Y, false) ? l.get(Y) : null;
        t.addBinding(new AttributeBinding(t, l, r, i.domWriteQueue, ensureExpression(n, s.from, 16), e, s.attr, h == null ? s.to : s.to.split(/\s/g).map((t => h[t] ?? t)).join(" "), 2));
    }
};

exports.AttributeBindingRenderer = __decorate([ renderer("hc") ], exports.AttributeBindingRenderer);

exports.SpreadRenderer = class SpreadRenderer {
    static get inject() {
        return [ Ot, Qt ];
    }
    constructor(t, e) {
        this.ut = t;
        this.r = e;
    }
    render(e, s, i, n, r, l) {
        const h = e.container;
        const a = h.get(ne);
        const c = this.r.renderers;
        const getHydrationContext = t => {
            let e = t;
            let s = a;
            while (s != null && e > 0) {
                s = s.parent;
                --e;
            }
            if (s == null) {
                throw createError("No scope context for spread binding.");
            }
            return s;
        };
        const renderSpreadInstruction = i => {
            const h = getHydrationContext(i);
            const a = createSurrogateBinding(h);
            const u = this.ut.compileSpread(h.controller.definition, h.instruction?.captures ?? t.emptyArray, h.controller.container, s);
            let f;
            for (f of u) {
                switch (f.type) {
                  case "hs":
                    renderSpreadInstruction(i + 1);
                    break;

                  case "hp":
                    c[f.instructions.type].render(a, findElementControllerFor(s), f.instructions, n, r, l);
                    break;

                  default:
                    c[f.type].render(a, s, f, n, r, l);
                }
            }
            e.addBinding(a);
        };
        renderSpreadInstruction(0);
    }
};

exports.SpreadRenderer = __decorate([ renderer("hs") ], exports.SpreadRenderer);

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
        this.ft = t;
        this.dt = e;
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
        const e = this.scope = this.dt.controller.scope.parent ?? void 0;
        if (e == null) {
            throw createError("Invalid spreading. Context scope is null/undefined");
        }
        this.ft.forEach((t => t.bind(e)));
    }
    unbind() {
        this.ft.forEach((t => t.unbind()));
        this.isBound = false;
    }
    addBinding(t) {
        this.ft.push(t);
    }
    addChild(t) {
        if (t.vmKind !== 1) {
            throw createError("Spread binding does not support spreading custom attributes/template controllers");
        }
        this.ctrl.addChild(t);
    }
}

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

const createSurrogateBinding = t => new SpreadBinding([], t);

const Nt = "IController";

const jt = "IInstruction";

const Wt = "IRenderLocation";

const zt = "ISlotsInfo";

function createElementContainer(e, s, i, n, r, l) {
    const h = s.container.createChild();
    registerHostNode(h, e, i);
    registerResolver(h, ie, new t.InstanceProvider(Nt, s));
    registerResolver(h, Ht, new t.InstanceProvider(jt, n));
    registerResolver(h, Q, r == null ? Gt : new RenderLocationProvider(r));
    registerResolver(h, $t, Xt);
    registerResolver(h, qt, l == null ? Kt : new t.InstanceProvider(zt, l));
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
            throw createError(`AUR7055`);
        }
        if (!isString(t.name) || t.name.length === 0) {
            throw createError(`AUR0756`);
        }
        return t;
    }
}

function invokeAttribute(e, s, i, n, r, l, h, a) {
    const c = i.container.createChild();
    registerHostNode(c, e, n);
    i = i instanceof Controller ? i : i.ctrl;
    registerResolver(c, ie, new t.InstanceProvider(Nt, i));
    registerResolver(c, Ht, new t.InstanceProvider(jt, r));
    registerResolver(c, Q, h == null ? Gt : new t.InstanceProvider(Wt, h));
    registerResolver(c, $t, l == null ? Xt : new ViewFactoryProvider(l));
    registerResolver(c, qt, a == null ? Kt : new t.InstanceProvider(zt, a));
    return {
        vm: c.invoke(s.Type),
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

const Gt = new RenderLocationProvider(null);

const Xt = new ViewFactoryProvider(null);

const Kt = new t.InstanceProvider(zt, new AuSlotsInfo(t.emptyArray));

const Qt = /*@__PURE__*/ E("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.xt ?? (this.xt = this.gt.getAll(Vt, false).reduce(((t, e) => {
            t[e.target] = e;
            return t;
        }), createLookup()));
    }
    constructor(t) {
        this.vt = new WeakMap;
        this.bt = new WeakMap;
        const e = t.root;
        this.p = (this.gt = e).get(W);
        this.ep = e.get(s.IExpressionParser);
        this.oL = e.get(s.IObserverLocator);
        this.wt = new FragmentNodeSequence(this.p, this.p.document.createDocumentFragment());
    }
    compile(t, e, s) {
        if (t.needsCompile !== false) {
            const i = this.vt;
            const n = e.get(Ot);
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
            return new FragmentNodeSequence(this.p, t.template);
        }
        let e;
        let s = false;
        const i = this.bt;
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
            i.set(t, e);
        }
        return e == null ? this.wt : new FragmentNodeSequence(this.p, s ? r.importNode(e, true) : r.adoptNode(e.cloneNode(true)));
    }
    render(t, e, s, i) {
        const n = s.instructions;
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
}

Rendering.inject = [ t.IContainer ];

var Yt;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["host"] = 1] = "host";
    t[t["shadowRoot"] = 2] = "shadowRoot";
    t[t["location"] = 3] = "location";
})(Yt || (Yt = {}));

const Zt = {
    optional: true
};

const Jt = optionalResource(s.ICoercionConfiguration);

const te = new WeakMap;

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
    get hooks() {
        return this.kt;
    }
    get viewModel() {
        return this.At;
    }
    set viewModel(t) {
        this.At = t;
        this.kt = t == null || this.vmKind === 2 ? HooksDefinition.none : new HooksDefinition(t);
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
        this.isStrictBinding = false;
        this.scope = null;
        this.isBound = false;
        this.hostController = null;
        this.mountTarget = 0;
        this.shadowRoot = null;
        this.nodes = null;
        this.location = null;
        this.yt = null;
        this.state = 0;
        this.Ct = false;
        this.$initiator = null;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this.Rt = 0;
        this.Bt = 0;
        this.St = 0;
        this.At = n;
        this.kt = e === 2 ? HooksDefinition.none : new HooksDefinition(n);
        this.location = l;
        this.r = t.root.get(Qt);
        this.coercion = e === 2 ? void 0 : t.get(Jt);
    }
    static getCached(t) {
        return te.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (e === void 0) {
            throw createError(`AUR0500:${t}`);
        }
        return e;
    }
    static $el(e, s, i, n, r = void 0, l = null) {
        if (te.has(s)) {
            return te.get(s);
        }
        r = r ?? getElementDefinition(s.constructor);
        const h = new Controller(e, 0, r, null, s, i, l);
        const a = e.get(t.optional(ne));
        if (r.dependencies.length > 0) {
            e.register(...r.dependencies);
        }
        registerResolver(e, ne, new t.InstanceProvider("IHydrationContext", new HydrationContext(h, n, a)));
        te.set(s, h);
        if (n == null || n.hydrate !== false) {
            h.hE(n, a);
        }
        return h;
    }
    static $attr(t, e, s, i) {
        if (te.has(e)) {
            return te.get(e);
        }
        i = i ?? getAttributeDefinition(e.constructor);
        const n = new Controller(t, 1, i, null, e, s, null);
        if (i.dependencies.length > 0) {
            t.register(...i.dependencies);
        }
        te.set(e, n);
        n._t();
        return n;
    }
    static $view(t, e = void 0) {
        const s = new Controller(t.container, 2, null, t, null, null, null);
        s.parent = e ?? null;
        s.Tt();
        return s;
    }
    hE(e, i) {
        const n = this.container;
        const r = this.At;
        let l = this.definition;
        this.scope = s.Scope.create(r, null, true);
        if (l.watches.length > 0) {
            createWatchers(this, n, l, r);
        }
        createObservers(this, l, r);
        if (this.kt.hasDefine) {
            const t = r.define(this, i, l);
            if (t !== void 0 && t !== l) {
                l = CustomElementDefinition.getOrCreate(t);
            }
        }
        this.yt = It.resolve(n);
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
        if (this.kt.hasHydrating) {
            this.At.hydrating(this);
        }
        const e = this.It = this.r.compile(this.definition, this.container, t);
        const {shadowOptions: s, isStrictBinding: i, hasSlots: n, containerless: r} = e;
        let l = this.location;
        this.isStrictBinding = i;
        if ((this.hostController = findElementControllerFor(this.host, Zt)) !== null) {
            this.host = this.container.root.get(W).document.createElement(this.definition.name);
            if (r && l == null) {
                l = this.location = convertToRenderLocation(this.host);
            }
        }
        setRef(this.host, at, this);
        setRef(this.host, this.definition.key, this);
        if (s !== null || n) {
            if (l != null) {
                throw createError(`AUR0501`);
            }
            setRef(this.shadowRoot = this.host.attachShadow(s ?? se), at, this);
            setRef(this.shadowRoot, this.definition.key, this);
            this.mountTarget = 2;
        } else if (l != null) {
            setRef(l, at, this);
            setRef(l, this.definition.key, this);
            this.mountTarget = 3;
        } else {
            this.mountTarget = 1;
        }
        this.At.$controller = this;
        this.nodes = this.r.createNodes(e);
        if (this.yt.hydrated !== void 0) {
            this.yt.hydrated.forEach(callHydratedHook, this);
        }
        if (this.kt.hasHydrated) {
            this.At.hydrated(this);
        }
    }
    hC() {
        this.r.render(this, this.nodes.findTargets(), this.It, this.host);
        if (this.yt.created !== void 0) {
            this.yt.created.forEach(callCreatedHook, this);
        }
        if (this.kt.hasCreated) {
            this.At.created(this);
        }
    }
    _t() {
        const t = this.definition;
        const e = this.At;
        if (t.watches.length > 0) {
            createWatchers(this, this.container, t, e);
        }
        createObservers(this, t, e);
        e.$controller = this;
        this.yt = It.resolve(this.container);
        if (this.yt.created !== void 0) {
            this.yt.created.forEach(callCreatedHook, this);
        }
        if (this.kt.hasCreated) {
            this.At.created(this);
        }
    }
    Tt() {
        this.It = this.r.compile(this.viewFactory.def, this.container, null);
        this.isStrictBinding = this.It.isStrictBinding;
        this.r.render(this, (this.nodes = this.r.createNodes(this.It)).findTargets(), this.It, void 0);
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
            throw createError(`AUR0502:${this.name}`);

          default:
            throw createError(`AUR0503:${this.name} ${stringifyState(this.state)}`);
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
                throw createError(`AUR0504`);
            }
            if (!this.hasLockedScope) {
                this.scope = i;
            }
            break;
        }
        if (this.isStrictBinding) ;
        this.$initiator = e;
        this.Et();
        let n;
        if (this.vmKind !== 2 && this.yt.binding != null) {
            n = t.resolveAll(...this.yt.binding.map(callBindingHook, this));
        }
        if (this.kt.hasBinding) {
            n = t.resolveAll(n, this.At.binding(this.$initiator, this.parent));
        }
        if (isPromise(n)) {
            this.Lt();
            n.then((() => {
                this.bind();
            })).catch((t => {
                this.Pt(t);
            }));
            return this.$promise;
        }
        this.bind();
        return this.$promise;
    }
    bind() {
        let e = 0;
        let s = 0;
        let i;
        if (this.bindings !== null) {
            e = 0;
            s = this.bindings.length;
            while (s > e) {
                this.bindings[e].bind(this.scope);
                ++e;
            }
        }
        if (this.vmKind !== 2 && this.yt.bound != null) {
            i = t.resolveAll(...this.yt.bound.map(callBoundHook, this));
        }
        if (this.kt.hasBound) {
            i = t.resolveAll(i, this.At.bound(this.$initiator, this.parent));
        }
        if (isPromise(i)) {
            this.Lt();
            i.then((() => {
                this.isBound = true;
                this.Mt();
            })).catch((t => {
                this.Pt(t);
            }));
            return;
        }
        this.isBound = true;
        this.Mt();
    }
    Dt(...t) {
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
    Mt() {
        if (this.hostController !== null) {
            switch (this.mountTarget) {
              case 1:
              case 2:
                this.hostController.Dt(this.host);
                break;

              case 3:
                this.hostController.Dt(this.location.$start, this.location);
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
                const e = t.has(mt, false) ? t.get(mt) : t.get(xt);
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
            s = t.resolveAll(...this.yt.attaching.map(callAttachingHook, this));
        }
        if (this.kt.hasAttaching) {
            s = t.resolveAll(s, this.At.attaching(this.$initiator, this.parent));
        }
        if (isPromise(s)) {
            this.Lt();
            this.Et();
            s.then((() => {
                this.$t();
            })).catch((t => {
                this.Pt(t);
            }));
        }
        if (this.children !== null) {
            for (;e < this.children.length; ++e) {
                void this.children[e].activate(this.$initiator, this, this.scope);
            }
        }
        this.$t();
    }
    deactivate(e, s) {
        switch (this.state & ~16) {
          case 2:
            this.state = 4;
            break;

          case 0:
          case 8:
          case 32:
          case 8 | 32:
            return;

          default:
            throw createError(`AUR0505:${this.name} ${stringifyState(this.state)}`);
        }
        this.$initiator = e;
        if (e === this) {
            this.qt();
        }
        let i = 0;
        let n;
        if (this.children !== null) {
            for (i = 0; i < this.children.length; ++i) {
                void this.children[i].deactivate(e, this);
            }
        }
        if (this.vmKind !== 2 && this.yt.detaching != null) {
            n = t.resolveAll(...this.yt.detaching.map(callDetachingHook, this));
        }
        if (this.kt.hasDetaching) {
            n = t.resolveAll(n, this.At.detaching(this.$initiator, this.parent));
        }
        if (isPromise(n)) {
            this.Lt();
            e.qt();
            n.then((() => {
                e.Ut();
            })).catch((t => {
                e.Pt(t);
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
        this.Ut();
        return this.$promise;
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
        this.Ft();
    }
    Lt() {
        if (this.$promise === void 0) {
            this.$promise = new Promise(((t, e) => {
                this.$resolve = t;
                this.$reject = e;
            }));
            if (this.$initiator !== this) {
                this.parent.Lt();
            }
        }
    }
    Ft() {
        if (this.$promise !== void 0) {
            re = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            re();
            re = void 0;
        }
    }
    Pt(t) {
        if (this.$promise !== void 0) {
            oe = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            oe(t);
            oe = void 0;
        }
        if (this.$initiator !== this) {
            this.parent.Pt(t);
        }
    }
    Et() {
        ++this.Rt;
        if (this.$initiator !== this) {
            this.parent.Et();
        }
    }
    $t() {
        if (--this.Rt === 0) {
            if (this.vmKind !== 2 && this.yt.attached != null) {
                le = t.resolveAll(...this.yt.attached.map(callAttachedHook, this));
            }
            if (this.kt.hasAttached) {
                le = t.resolveAll(le, this.At.attached(this.$initiator));
            }
            if (isPromise(le)) {
                this.Lt();
                le.then((() => {
                    this.state = 2;
                    this.Ft();
                    if (this.$initiator !== this) {
                        this.parent.$t();
                    }
                })).catch((t => {
                    this.Pt(t);
                }));
                le = void 0;
                return;
            }
            le = void 0;
            this.state = 2;
            this.Ft();
        }
        if (this.$initiator !== this) {
            this.parent.$t();
        }
    }
    qt() {
        ++this.Bt;
    }
    Ut() {
        if (--this.Bt === 0) {
            this.Ht();
            this.removeNodes();
            let e = this.$initiator.head;
            let s;
            while (e !== null) {
                if (e !== this) {
                    if (e.debug) {
                        e.logger.trace(`detach()`);
                    }
                    e.removeNodes();
                }
                if (e.vmKind !== 2 && e.yt.unbinding != null) {
                    s = t.resolveAll(...e.yt.unbinding.map(callUnbindingHook, this));
                }
                if (e.kt.hasUnbinding) {
                    if (e.debug) {
                        e.logger.trace("unbinding()");
                    }
                    s = t.resolveAll(s, e.viewModel.unbinding(e.$initiator, e.parent));
                }
                if (isPromise(s)) {
                    this.Lt();
                    this.Ht();
                    s.then((() => {
                        this.Ot();
                    })).catch((t => {
                        this.Pt(t);
                    }));
                }
                s = void 0;
                e = e.next;
            }
            this.Ot();
        }
    }
    Ht() {
        ++this.St;
    }
    Ot() {
        if (--this.St === 0) {
            let t = this.$initiator.head;
            let e = null;
            while (t !== null) {
                if (t !== this) {
                    t.isBound = false;
                    t.unbind();
                }
                e = t.next;
                t.next = null;
                t = e;
            }
            this.head = this.tail = null;
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
                return getAttributeDefinition(this.At.constructor).name === t;
            }

          case 0:
            {
                return getElementDefinition(this.At.constructor).name === t;
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
            setRef(t, at, this);
            setRef(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = 1;
        return this;
    }
    setShadowRoot(t) {
        if (this.vmKind === 0) {
            setRef(t, at, this);
            setRef(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = 2;
        return this;
    }
    setLocation(t) {
        if (this.vmKind === 0) {
            setRef(t, at, this);
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
        if (this.kt.hasDispose) {
            this.At.dispose();
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
        if (this.At !== null) {
            te.delete(this.At);
            this.At = null;
        }
        this.At = null;
        this.host = null;
        this.shadowRoot = null;
        this.container.disposeResolvers();
    }
    accept(t) {
        if (t(this) === true) {
            return true;
        }
        if (this.kt.hasAccept && this.At.accept(t) === true) {
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
                    throw createError(`AURxxxx: coercion(${g(i)})`);
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
                    throw createError(`AURxxx: changed(${g})`);
                }
            }
        }
    }
}

const ee = new Map;

const getAccessScopeAst = t => {
    let e = ee.get(t);
    if (e == null) {
        e = new s.AccessScopeExpression(t, 0);
        ee.set(t, e);
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
            throw createError(`AUR0506:${g(f)}`);
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
        this.hasDefine = "define" in t;
        this.hasHydrating = "hydrating" in t;
        this.hasHydrated = "hydrated" in t;
        this.hasCreated = "created" in t;
        this.hasBinding = "binding" in t;
        this.hasBound = "bound" in t;
        this.hasAttaching = "attaching" in t;
        this.hasAttached = "attached" in t;
        this.hasDetaching = "detaching" in t;
        this.hasUnbinding = "unbinding" in t;
        this.hasDispose = "dispose" in t;
        this.hasAccept = "accept" in t;
    }
}

HooksDefinition.none = new HooksDefinition({});

const se = {
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

const ie = /*@__PURE__*/ E("IController");

const ne = /*@__PURE__*/ E("IHydrationContext");

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
    t.instance.created(this.At, this);
}

function callHydratingHook(t) {
    t.instance.hydrating(this.At, this);
}

function callHydratedHook(t) {
    t.instance.hydrated(this.At, this);
}

function callBindingHook(t) {
    return t.instance.binding(this.At, this["$initiator"], this.parent);
}

function callBoundHook(t) {
    return t.instance.bound(this.At, this["$initiator"], this.parent);
}

function callAttachingHook(t) {
    return t.instance.attaching(this.At, this["$initiator"], this.parent);
}

function callAttachedHook(t) {
    return t.instance.attached(this.At, this["$initiator"]);
}

function callDetachingHook(t) {
    return t.instance.detaching(this.At, this["$initiator"], this.parent);
}

function callUnbindingHook(t) {
    return t.instance.unbinding(this.At, this["$initiator"], this.parent);
}

let re;

let oe;

let le;

const he = /*@__PURE__*/ E("IAppRoot");

class AppRoot {
    constructor(e, s, i, n) {
        this.config = e;
        this.platform = s;
        this.container = i;
        this.Vt = void 0;
        this.host = e.host;
        n.prepare(this);
        registerHostNode(i, s, e.host);
        this.Vt = t.onResolve(this.Nt("creating"), (() => {
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
            return t.onResolve(this.Nt("hydrating"), (() => {
                h.hS(null);
                return t.onResolve(this.Nt("hydrated"), (() => {
                    h.hC();
                    this.Vt = void 0;
                }));
            }));
        }));
    }
    activate() {
        return t.onResolve(this.Vt, (() => t.onResolve(this.Nt("activating"), (() => t.onResolve(this.controller.activate(this.controller, null, void 0), (() => this.Nt("activated")))))));
    }
    deactivate() {
        return t.onResolve(this.Nt("deactivating"), (() => t.onResolve(this.controller.deactivate(this.controller, null), (() => this.Nt("deactivated")))));
    }
    Nt(e) {
        return t.resolveAll(...this.container.getAll(N).reduce(((t, s) => {
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

const ae = /*@__PURE__*/ E("IAurelia");

class Aurelia {
    get isRunning() {
        return this.ir;
    }
    get isStarting() {
        return this.jt;
    }
    get isStopping() {
        return this.Wt;
    }
    get root() {
        if (this.zt == null) {
            if (this.next == null) {
                throw createError(`AUR0767`);
            }
            return this.next;
        }
        return this.zt;
    }
    constructor(e = t.DI.createContainer()) {
        this.container = e;
        this.ir = false;
        this.jt = false;
        this.Wt = false;
        this.zt = void 0;
        this.next = void 0;
        this.Gt = void 0;
        this.Xt = void 0;
        if (e.has(ae, true) || e.has(Aurelia, true)) {
            throw createError(`AUR0768`);
        }
        registerResolver(e, ae, new t.InstanceProvider("IAurelia", this));
        registerResolver(e, Aurelia, new t.InstanceProvider("Aurelia", this));
        registerResolver(e, he, this.Kt = new t.InstanceProvider("IAppRoot"));
    }
    register(...t) {
        this.container.register(...t);
        return this;
    }
    app(t) {
        this.next = new AppRoot(t, this.Qt(t.host), this.container, this.Kt);
        return this;
    }
    enhance(e, s) {
        const i = e.container ?? this.container.createChild();
        const n = e.host;
        const r = this.Qt(n);
        const l = e.component;
        let h;
        if (isFunction(l)) {
            registerHostNode(i, r, n);
            h = i.invoke(l);
        } else {
            h = l;
        }
        registerResolver(i, K, new t.InstanceProvider("IEventTarget", n));
        s = s ?? null;
        const a = Controller.$el(i, h, n, null, CustomElementDefinition.create({
            name: ct(),
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
    Qt(t) {
        let e;
        if (!this.container.has(W, false)) {
            if (t.ownerDocument.defaultView === null) {
                throw createError(`AUR0769`);
            }
            e = new i.BrowserPlatform(t.ownerDocument.defaultView);
            this.container.register(M(W, e));
        } else {
            e = this.container.get(W);
        }
        return e;
    }
    start(e = this.next) {
        if (e == null) {
            throw createError(`AUR0770`);
        }
        if (isPromise(this.Gt)) {
            return this.Gt;
        }
        return this.Gt = t.onResolve(this.stop(), (() => {
            Reflect.set(e.host, "$aurelia", this);
            this.Kt.prepare(this.zt = e);
            this.jt = true;
            return t.onResolve(e.activate(), (() => {
                this.ir = true;
                this.jt = false;
                this.Gt = void 0;
                this.Yt(e, "au-started", e.host);
            }));
        }));
    }
    stop(e = false) {
        if (isPromise(this.Xt)) {
            return this.Xt;
        }
        if (this.ir === true) {
            const s = this.zt;
            this.ir = false;
            this.Wt = true;
            return this.Xt = t.onResolve(s.deactivate(), (() => {
                Reflect.deleteProperty(s.host, "$aurelia");
                if (e) {
                    s.dispose();
                }
                this.zt = void 0;
                this.Kt.dispose();
                this.Wt = false;
                this.Yt(s, "au-stopped", s.host);
            }));
        }
    }
    dispose() {
        if (this.ir || this.Wt) {
            throw createError(`AUR0771`);
        }
        this.container.dispose();
    }
    Yt(t, e, s) {
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
                this.has = this.Zt;
                break;

              case 1:
                this.has = this.Jt;
                break;

              default:
                this.has = this.te;
            }
        } else {
            switch (t.length) {
              case 0:
                this.has = this.ee;
                break;

              case 1:
                this.has = this.se;
                break;

              default:
                this.has = this.ie;
            }
        }
    }
    equals(t) {
        return this.chars === t.chars && this.repeat === t.repeat && this.isSymbol === t.isSymbol && this.isInverted === t.isInverted;
    }
    ie(t) {
        return this.chars.includes(t);
    }
    se(t) {
        return this.chars === t;
    }
    ee(t) {
        return false;
    }
    te(t) {
        return !this.chars.includes(t);
    }
    Jt(t) {
        return this.chars !== t;
    }
    Zt(t) {
        return true;
    }
}

class Interpretation {
    constructor() {
        this.parts = t.emptyArray;
        this.ne = "";
        this.re = {};
        this.oe = {};
    }
    get pattern() {
        const t = this.ne;
        if (t === "") {
            return null;
        } else {
            return t;
        }
    }
    set pattern(e) {
        if (e == null) {
            this.ne = "";
            this.parts = t.emptyArray;
        } else {
            this.ne = e;
            this.parts = this.oe[e];
        }
    }
    append(t, e) {
        const s = this.re;
        if (s[t] === undefined) {
            s[t] = e;
        } else {
            s[t] += e;
        }
    }
    next(t) {
        const e = this.re;
        let s;
        if (e[t] !== undefined) {
            s = this.oe;
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
    get ne() {
        return this.le ? this.he[0] : null;
    }
    constructor(t, ...e) {
        this.charSpec = t;
        this.ae = [];
        this.ce = null;
        this.le = false;
        this.he = e;
    }
    findChild(t) {
        const e = this.ae;
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
        const s = this.he;
        if (!s.includes(e)) {
            s.push(e);
        }
        let i = this.findChild(t);
        if (i == null) {
            i = new AttrParsingState(t, e);
            this.ae.push(i);
            if (t.repeat) {
                i.ae.push(i);
            }
        }
        return i;
    }
    findMatches(t, e) {
        const s = [];
        const i = this.ae;
        const n = i.length;
        let r = 0;
        let l = null;
        let h = 0;
        let a = 0;
        for (;h < n; ++h) {
            l = i[h];
            if (l.charSpec.has(t)) {
                s.push(l);
                r = l.he.length;
                a = 0;
                if (l.charSpec.isSymbol) {
                    for (;a < r; ++a) {
                        e.next(l.he[a]);
                    }
                } else {
                    for (;a < r; ++a) {
                        e.append(l.he[a], t);
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
        const e = this.ue = t.length;
        const s = this.fe = [];
        let i = 0;
        for (;e > i; ++i) {
            s.push(new CharSpec(t[i], false, false, false));
        }
    }
    eachChar(t) {
        const e = this.ue;
        const s = this.fe;
        let i = 0;
        for (;e > i; ++i) {
            t(s[i]);
        }
    }
}

class DynamicSegment {
    constructor(t) {
        this.text = "PART";
        this.de = new CharSpec(t, true, false, true);
    }
    eachChar(t) {
        t(this.de);
    }
}

class SymbolSegment {
    constructor(t) {
        this.text = t;
        this.de = new CharSpec(t, false, true, false);
    }
    eachChar(t) {
        t(this.de);
    }
}

class SegmentTypes {
    constructor() {
        this.statics = 0;
        this.dynamics = 0;
        this.symbols = 0;
    }
}

const ce = /*@__PURE__*/ E("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

class SyntaxInterpreter {
    constructor() {
        this.pe = new AttrParsingState(null);
        this.me = [ this.pe ];
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
            s = this.pe;
            i = t[c];
            n = i.pattern;
            r = new SegmentTypes;
            l = this.xe(i, r);
            h = l.length;
            a = t => s = s.append(t, n);
            for (u = 0; h > u; ++u) {
                l[u].eachChar(a);
            }
            s.ce = r;
            s.le = true;
            ++c;
        }
    }
    interpret(t) {
        const e = new Interpretation;
        const s = t.length;
        let i = this.me;
        let n = 0;
        let r;
        for (;n < s; ++n) {
            i = this.ge(i, t.charAt(n), e);
            if (i.length === 0) {
                break;
            }
        }
        i = i.filter(isEndpoint);
        if (i.length > 0) {
            i.sort(sortEndpoint);
            r = i[0];
            if (!r.charSpec.isSymbol) {
                e.next(r.ne);
            }
            e.pattern = r.ne;
        }
        return e;
    }
    ge(t, e, s) {
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
    xe(t, e) {
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
    return t.le;
}

function sortEndpoint(t, e) {
    const s = t.ce;
    const i = e.ce;
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

const ue = /*@__PURE__*/ E("IAttributePattern");

const fe = /*@__PURE__*/ E("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor(e, s) {
        this.rt = {};
        this.ve = e;
        const i = this.he = {};
        const n = s.reduce(((t, e) => {
            const s = getAllPatternDefinitions(e.constructor);
            s.forEach((t => i[t.pattern] = e));
            return t.concat(s);
        }), t.emptyArray);
        e.add(n);
    }
    parse(t, e) {
        let s = this.rt[t];
        if (s == null) {
            s = this.rt[t] = this.ve.interpret(t);
        }
        const i = s.pattern;
        if (i == null) {
            return new AttrSyntax(t, e, t, null);
        } else {
            return this.he[i][i](t, e, s.parts);
        }
    }
}

AttributeParser.inject = [ ce, t.all(ue) ];

function attributePattern(...t) {
    return function decorator(e) {
        return me.define(t, e);
    };
}

class AttributePatternResourceDefinition {
    constructor(t) {
        this.Type = t;
        this.name = void 0;
    }
    register(t) {
        L(ue, this.Type).register(t);
    }
}

const de = f("attribute-pattern");

const pe = "attribute-pattern-definitions";

const getAllPatternDefinitions = e => t.Protocol.annotation.get(e, pe);

const me = w({
    name: de,
    definitionAnnotationKey: pe,
    define(e, s) {
        const i = new AttributePatternResourceDefinition(s);
        h(de, i, s);
        d(s, de);
        t.Protocol.annotation.set(s, pe, e);
        p(s, pe);
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
        return new AttrSyntax(t, e, s[0], "ref");
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

let xe = class SpreadAttributePattern {
    "...$attrs"(t, e, s) {
        return new AttrSyntax(t, e, "", "...$attrs");
    }
};

xe = __decorate([ attributePattern({
    pattern: "...$attrs",
    symbols: ""
}) ], xe);

exports.CommandType = void 0;

(function(t) {
    t[t["None"] = 0] = "None";
    t[t["IgnoreAttr"] = 1] = "IgnoreAttr";
})(exports.CommandType || (exports.CommandType = {}));

function bindingCommand(t) {
    return function(e) {
        return ve.define(t, e);
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
        L(s, e).register(t);
        P(s, e).register(t);
        registerAliases(i, ve, s, t);
    }
}

const ge = f("binding-command");

const getCommandKeyFrom = t => `${ge}:${t}`;

const getCommandAnnotation = (t, e) => r(u(e), t);

const ve = w({
    name: ge,
    keyFrom: getCommandKeyFrom,
    define(t, e) {
        const s = BindingCommandDefinition.create(t, e);
        h(ge, s, s.Type);
        h(ge, s, s);
        d(e, ge);
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
            r = e.bindable.property;
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
            r = e.bindable.property;
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
            r = e.bindable.property;
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
            r = e.bindable.property;
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
            a = r.property;
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
        return [ fe ];
    }
    constructor(t) {
        this.be = t;
    }
    build(e, s) {
        const i = e.bindable === null ? t.camelCase(e.attr.target) : e.bindable.property;
        const n = s.parse(e.attr.rawValue, 2);
        let r = t.emptyArray;
        if (n.semiIdx > -1) {
            const t = e.attr.rawValue.slice(n.semiIdx + 1);
            const s = t.indexOf(":");
            if (s > -1) {
                const e = t.slice(0, s).trim();
                const i = t.slice(s + 1).trim();
                const n = this.be.parse(e, i);
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

let be = class RefBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new RefBindingInstruction(e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

be = __decorate([ bindingCommand("ref") ], be);

let we = class SpreadBindingCommand {
    get type() {
        return 1;
    }
    build(t) {
        return new SpreadBindingInstruction;
    }
};

we = __decorate([ bindingCommand("...$attrs") ], we);

const ye = /*@__PURE__*/ E("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

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
        return L(ye, this).register(t);
    }
    constructor(t) {
        this.we = y(createLookup(), {
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
        this.ye = o("a altGlyph animate animateColor circle clipPath defs ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feFlood feGaussianBlur feImage feMerge feMorphology feOffset feSpecularLighting feTile feTurbulence filter font foreignObject g glyph glyphRef image line linearGradient marker mask missing-glyph path pattern polygon polyline radialGradient rect stop svg switch symbol text textPath tref tspan use");
        this.ke = o("alignment-baseline baseline-shift clip-path clip-rule clip color-interpolation-filters color-interpolation color-profile color-rendering color cursor direction display dominant-baseline enable-background fill-opacity fill-rule fill filter flood-color flood-opacity font-family font-size-adjust font-size font-stretch font-style font-variant font-weight glyph-orientation-horizontal glyph-orientation-vertical image-rendering kerning letter-spacing lighting-color marker-end marker-mid marker-start mask opacity overflow pointer-events shape-rendering stop-color stop-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width stroke text-anchor text-decoration text-rendering unicode-bidi visibility word-spacing writing-mode");
        this.SVGElement = t.globalThis.SVGElement;
        const e = t.document.createElement("div");
        e.innerHTML = "<svg><altGlyph /></svg>";
        if (e.firstElementChild.nodeName === "altglyph") {
            const t = this.we;
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
        return this.ye[t.nodeName] === true && this.ke[e] === true || this.we[t.nodeName]?.[e] === true;
    }
}

SVGAnalyzer.inject = [ W ];

const ke = /*@__PURE__*/ E("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    static get inject() {
        return [ ye ];
    }
    constructor(t) {
        this.svg = t;
        this.fns = [];
        this.Ae = createLookup();
        this.Ce = createLookup();
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
            i = (e = this.Ae)[n] ?? (e[n] = createLookup());
            for (r in s) {
                if (i[r] !== void 0) {
                    throw createMappedError(r, n);
                }
                i[r] = s[r];
            }
        }
    }
    useGlobalMapping(t) {
        const e = this.Ce;
        for (const s in t) {
            if (e[s] !== void 0) {
                throw createMappedError(s, "*");
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
        return this.Ae[t.nodeName]?.[e] ?? this.Ce[e] ?? (isDataAttribute(t, e, this.svg) ? e : null);
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

exports.BindingMode = void 0;

(function(t) {
    t[t["oneTime"] = 1] = "oneTime";
    t[t["toView"] = 2] = "toView";
    t[t["fromView"] = 4] = "fromView";
    t[t["twoWay"] = 6] = "twoWay";
    t[t["default"] = 8] = "default";
})(exports.BindingMode || (exports.BindingMode = {}));

const Ae = createLookup();

class AttributeNSAccessor {
    static forNs(t) {
        return Ae[t] ?? (Ae[t] = new AttributeNSAccessor(t));
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

const Ce = new DataAttributeAccessor;

const Re = {
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
        this.W = false;
        this.Re = void 0;
        this.Be = void 0;
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
        this.W = t !== this.ov;
        this.Se(t instanceof Array ? t : null);
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
    M() {
        (this.Be = createMutationObserver(this.L, this._e.bind(this))).observe(this.L, Re);
        this.Se(this.v instanceof Array ? this.v : null);
        this.iO = true;
    }
    $() {
        this.Be.disconnect();
        this.Re?.unsubscribe(this);
        this.Be = this.Re = void 0;
        this.iO = false;
    }
    Se(t) {
        this.Re?.unsubscribe(this);
        this.Re = void 0;
        if (t != null) {
            if (!this.L.multiple) {
                throw createError(`AUR0654`);
            }
            (this.Re = this.oL.getArrayObserver(t)).subscribe(this);
        }
    }
    handleEvent() {
        const t = this.syncValue();
        if (t) {
            this.K();
        }
    }
    _e(t) {
        this.syncOptions();
        const e = this.syncValue();
        if (e) {
            this.K();
        }
    }
    K() {
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
    Te(t) {
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
    Ie(e) {
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
            n.push(...this.Ee(s));
        }
        return n;
    }
    Le(e) {
        const s = e.length;
        if (s > 0) {
            const t = [];
            let i = 0;
            for (;s > i; ++i) {
                t.push(...this.Ee(e[i]));
            }
            return t;
        }
        return t.emptyArray;
    }
    Ee(e) {
        if (isString(e)) {
            return this.Te(e);
        }
        if (e instanceof Array) {
            return this.Le(e);
        }
        if (e instanceof Object) {
            return this.Ie(e);
        }
        return t.emptyArray;
    }
    F() {
        if (this.W) {
            this.W = false;
            const t = this.v;
            const e = this.styles;
            const s = this.Ee(t);
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
        this.W = false;
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
        _e = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, _e);
    }
}

mixinNodeObserverUseConfig(ValueAttributeObserver);

s.subscriberCollection(ValueAttributeObserver);

let _e = void 0;

const Te = "http://www.w3.org/1999/xlink";

const Ie = "http://www.w3.org/XML/1998/namespace";

const Ee = "http://www.w3.org/2000/xmlns/";

const Le = y(createLookup(), {
    "xlink:actuate": [ "actuate", Te ],
    "xlink:arcrole": [ "arcrole", Te ],
    "xlink:href": [ "href", Te ],
    "xlink:role": [ "role", Te ],
    "xlink:show": [ "show", Te ],
    "xlink:title": [ "title", Te ],
    "xlink:type": [ "type", Te ],
    "xml:lang": [ "lang", Ie ],
    "xml:space": [ "space", Ie ],
    xmlns: [ "xmlns", Ee ],
    "xmlns:xlink": [ "xlink", Ee ]
});

const Pe = new s.PropertyAccessor;

Pe.type = 2 | 4;

class NodeObserverLocator {
    constructor(t, e, s, i) {
        this.locator = t;
        this.platform = e;
        this.dirtyChecker = s;
        this.svgAnalyzer = i;
        this.allowDirtyCheck = true;
        this.Pe = createLookup();
        this.Me = createLookup();
        this.De = createLookup();
        this.$e = createLookup();
        const n = [ "change", "input" ];
        const r = {
            events: n,
            default: ""
        };
        this.useConfig({
            INPUT: {
                value: r,
                valueAsNumber: {
                    events: n,
                    default: 0
                },
                checked: {
                    type: CheckedObserver,
                    events: n
                },
                files: {
                    events: n,
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
                value: r
            }
        });
        const l = {
            events: [ "change", "input", "blur", "keyup", "paste" ],
            default: ""
        };
        const h = {
            events: [ "scroll" ],
            default: 0
        };
        this.useConfigGlobal({
            scrollTop: h,
            scrollLeft: h,
            textContent: l,
            innerHTML: l
        });
        this.overrideAccessorGlobal("css", "style", "class");
        this.overrideAccessor({
            INPUT: [ "value", "checked", "model" ],
            SELECT: [ "value" ],
            TEXTAREA: [ "value" ]
        });
    }
    static register(t) {
        P(s.INodeObserverLocator, NodeObserverLocator).register(t);
        L(s.INodeObserverLocator, NodeObserverLocator).register(t);
    }
    handles(t, e) {
        return t instanceof this.platform.Node;
    }
    useConfig(t, e, s) {
        const i = this.Pe;
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
        const s = this.Me;
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
        if (s in this.$e || s in (this.De[e.tagName] ?? t.emptyObject)) {
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
            return Ce;

          default:
            {
                const t = Le[s];
                if (t !== undefined) {
                    return AttributeNSAccessor.forNs(t[1]);
                }
                if (isDataAttribute(e, s, this.svgAnalyzer)) {
                    return Ce;
                }
                return Pe;
            }
        }
    }
    overrideAccessor(t, e) {
        var s, i;
        let n;
        if (isString(t)) {
            n = (s = this.De)[t] ?? (s[t] = createLookup());
            n[e] = true;
        } else {
            for (const e in t) {
                for (const s of t[e]) {
                    n = (i = this.De)[e] ?? (i[e] = createLookup());
                    n[s] = true;
                }
            }
        }
    }
    overrideAccessorGlobal(...t) {
        for (const e of t) {
            this.$e[e] = true;
        }
    }
    getNodeObserverConfig(t, e) {
        return this.Pe[t.tagName]?.[e] ?? this.Me[e];
    }
    getNodeObserver(t, e, i) {
        const n = this.Pe[t.tagName]?.[e] ?? this.Me[e];
        let r;
        if (n != null) {
            r = new (n.type ?? ValueAttributeObserver)(t, e, n, i, this.locator);
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
        const r = Le[e];
        if (r !== undefined) {
            return AttributeNSAccessor.forNs(r[1]);
        }
        if (isDataAttribute(t, e, this.svgAnalyzer)) {
            return Ce;
        }
        if (e in t.constructor.prototype) {
            if (this.allowDirtyCheck) {
                return this.dirtyChecker.createProperty(t, e);
            }
            throw createError(`AUR0652:${g(e)}`);
        } else {
            return new s.SetterObserver(t, e);
        }
    }
}

NodeObserverLocator.inject = [ t.IServiceLocator, W, s.IDirtyChecker, ye ];

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
    throw createError(`AUR0653:${g(e)}@${t}`);
}

function defaultMatcher(t, e) {
    return t === e;
}

class CheckedObserver {
    constructor(t, e, s, i) {
        this.type = 2 | 1 | 4;
        this.v = void 0;
        this.ov = void 0;
        this.qe = void 0;
        this.Ue = void 0;
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
        this.Fe();
        this.He();
        this.K();
    }
    handleCollectionChange() {
        this.He();
    }
    handleChange(t, e) {
        this.He();
    }
    He() {
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
        this.K();
    }
    M() {
        this.Fe();
    }
    $() {
        this.qe?.unsubscribe(this);
        this.Ue?.unsubscribe(this);
        this.qe = this.Ue = void 0;
    }
    K() {
        Me = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Me);
    }
    Fe() {
        const t = this.L;
        (this.Ue ?? (this.Ue = t.$observers?.model ?? t.$observers?.value))?.subscribe(this);
        this.qe?.unsubscribe(this);
        this.qe = void 0;
        if (t.type === "checkbox") {
            (this.qe = getCollectionObserver(this.v, this.oL))?.subscribe(this);
        }
    }
}

mixinNodeObserverUseConfig(CheckedObserver);

s.subscriberCollection(CheckedObserver);

let Me = void 0;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) {
            throw createError(`AURxxxx`);
        }
        e.useTargetObserver(Ce);
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
    constructor(t, e) {
        if (!(e instanceof NodeObserverLocator)) {
            throw createError("AURxxxx: updateTrigger binding behavior only works with the default implementation of Aurelia HTML observation. Implement your own node observation + updateTrigger");
        }
        this.oL = t;
        this.Oe = e;
    }
    bind(t, e, ...s) {
        if (s.length === 0) {
            throw createError(`AUR0802`);
        }
        if (!(e instanceof PropertyBinding) || !(e.mode & 4)) {
            throw createError(`AUR0803`);
        }
        const i = this.Oe.getNodeObserverConfig(e.target, e.targetProperty);
        if (i == null) {
            {
                throw createError(`AURxxxx`);
            }
        }
        const n = this.Oe.getNodeObserver(e.target, e.targetProperty, this.oL);
        n.useConfig({
            readonly: i.readonly,
            default: i.default,
            events: s
        });
        e.useTargetObserver(n);
    }
}

UpdateTriggerBindingBehavior.inject = [ s.IObserverLocator, s.INodeObserverLocator ];

bindingBehavior("updateTrigger")(UpdateTriggerBindingBehavior);

class If {
    constructor(t, e) {
        this.elseFactory = void 0;
        this.elseView = void 0;
        this.ifView = void 0;
        this.view = void 0;
        this.value = false;
        this.cache = true;
        this.pending = void 0;
        this.Ve = false;
        this.Ne = 0;
        this.je = t;
        this.l = e;
    }
    attaching(e, s) {
        let i;
        const n = this.$controller;
        const r = this.Ne++;
        const isCurrent = () => !this.Ve && this.Ne === r + 1;
        return t.onResolve(this.pending, (() => {
            if (!isCurrent()) {
                return;
            }
            this.pending = void 0;
            if (this.value) {
                i = this.view = this.ifView = this.cache && this.ifView != null ? this.ifView : this.je.create();
            } else {
                i = this.view = this.elseView = this.cache && this.elseView != null ? this.elseView : this.elseFactory?.create();
            }
            if (i == null) {
                return;
            }
            i.setLocation(this.l);
            this.pending = t.onResolve(i.activate(e, n, n.scope), (() => {
                if (isCurrent()) {
                    this.pending = void 0;
                }
            }));
        }));
    }
    detaching(e, s) {
        this.Ve = true;
        return t.onResolve(this.pending, (() => {
            this.Ve = false;
            this.pending = void 0;
            void this.view?.deactivate(e, this.$controller);
        }));
    }
    valueChanged(e, s) {
        if (!this.$controller.isActive) {
            return;
        }
        e = !!e;
        s = !!s;
        if (e === s) {
            return;
        }
        const i = this.view;
        const n = this.$controller;
        const r = this.Ne++;
        const isCurrent = () => !this.Ve && this.Ne === r + 1;
        let l;
        return t.onResolve(this.pending, (() => this.pending = t.onResolve(i?.deactivate(i, n), (() => {
            if (!isCurrent()) {
                return;
            }
            if (e) {
                l = this.view = this.ifView = this.cache && this.ifView != null ? this.ifView : this.je.create();
            } else {
                l = this.view = this.elseView = this.cache && this.elseView != null ? this.elseView : this.elseFactory?.create();
            }
            if (l == null) {
                return;
            }
            l.setLocation(this.l);
            return t.onResolve(l.activate(l, n, n.scope), (() => {
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

If.inject = [ $t, Q ];

__decorate([ bindable ], If.prototype, "value", void 0);

__decorate([ bindable({
    set: t => t === "" || !!t && t !== "false"
}) ], If.prototype, "cache", void 0);

templateController("if")(If);

class Else {
    constructor(t) {
        this.f = t;
    }
    link(t, e, s, i) {
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

Else.inject = [ $t ];

templateController({
    name: "else"
})(Else);

function dispose(t) {
    t.dispose();
}

const De = [ 18, 17 ];

class Repeat {
    constructor(t, e, s, i, n) {
        this.views = [];
        this.key = null;
        this.We = new Map;
        this.ze = new Map;
        this.Ge = void 0;
        this.Xe = false;
        this.Ke = false;
        this.Qe = null;
        this.Ye = void 0;
        this.Ze = false;
        const r = t.props[0].props[0];
        if (r !== void 0) {
            const {to: t, value: s, command: i} = r;
            if (t === "key") {
                if (i === null) {
                    this.key = s;
                } else if (i === "bind") {
                    this.key = e.parse(s, 16);
                } else {
                    {
                        throw createError(`AUR775:${i}`);
                    }
                }
            } else {
                {
                    throw createError(`AUR776:${t}`);
                }
            }
        }
        this.l = s;
        this.Je = i;
        this.f = n;
    }
    binding(t, e) {
        const i = this.Je.bindings;
        const n = i.length;
        let r = void 0;
        let l;
        let h = 0;
        for (;n > h; ++h) {
            r = i[h];
            if (r.target === this && r.targetProperty === "items") {
                l = this.forOf = r.ast;
                this.ts = r;
                let t = l.iterable;
                while (t != null && De.includes(t.$kind)) {
                    t = t.expression;
                    this.Xe = true;
                }
                this.Qe = t;
                break;
            }
        }
        this.es();
        const a = l.declaration;
        if (!(this.Ze = a.$kind === 24 || a.$kind === 25)) {
            this.local = s.astEvaluate(a, this.$controller.scope, r, null);
        }
    }
    attaching(t, e) {
        this.ss();
        return this.rs(t);
    }
    detaching(t, e) {
        this.es();
        return this.os(t);
    }
    unbinding(t, e) {
        this.ze.clear();
        this.We.clear();
    }
    itemsChanged() {
        if (!this.$controller.isActive) {
            return;
        }
        this.es();
        this.ss();
        this.ls(this.items, void 0);
    }
    handleCollectionChange(t, e) {
        const i = this.$controller;
        if (!i.isActive) {
            return;
        }
        if (this.Xe) {
            if (this.Ke) {
                return;
            }
            this.Ke = true;
            this.items = s.astEvaluate(this.forOf.iterable, i.scope, this.ts, null);
            this.Ke = false;
            return;
        }
        this.ss();
        this.ls(t, e);
    }
    ls(e, i) {
        const n = this.views;
        const r = n.length;
        const l = this.key;
        const h = l !== null;
        if (h || i === void 0) {
            const t = this.local;
            const e = this.Ye;
            const a = e.length;
            const c = this.forOf;
            const u = c.declaration;
            const f = this.ts;
            const d = this.Ze;
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
                const A = new Map;
                const C = new Map;
                const R = this.We;
                const B = this.ze;
                const S = this.$controller.scope;
                p = 0;
                t: {
                    while (true) {
                        if (h) {
                            x = m[p];
                            g = e[p];
                            v = getKeyValue(R, l, x, getScope(B, x, c, S, f, t, d), f);
                            b = getKeyValue(R, l, g, getScope(B, g, c, S, f, t, d), f);
                        } else {
                            x = v = ensureUnique(m[p], p);
                            g = b = ensureUnique(e[p], p);
                        }
                        if (v !== b) {
                            R.set(x, v);
                            R.set(g, b);
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
                            v = getKeyValue(R, l, x, getScope(B, x, c, S, f, t, d), f);
                            b = getKeyValue(R, l, g, getScope(B, g, c, S, f, t, d), f);
                        } else {
                            x = v = ensureUnique(m[p], p);
                            g = b = ensureUnique(e[p], p);
                        }
                        if (v !== b) {
                            R.set(x, v);
                            R.set(g, b);
                            break;
                        }
                        --w;
                        if (p > w) {
                            break t;
                        }
                    }
                }
                const _ = p;
                const T = p;
                for (p = T; p <= k; ++p) {
                    if (R.has(g = h ? e[p] : ensureUnique(e[p], p))) {
                        b = R.get(g);
                    } else {
                        b = h ? getKeyValue(R, l, g, getScope(B, g, c, S, f, t, d), f) : g;
                        R.set(g, b);
                    }
                    C.set(b, p);
                }
                for (p = _; p <= y; ++p) {
                    if (R.has(x = h ? m[p] : ensureUnique(m[p], p))) {
                        v = R.get(x);
                    } else {
                        v = h ? getKeyValue(R, l, x, n[p].scope, f) : x;
                    }
                    A.set(v, p);
                    if (C.has(v)) {
                        i[C.get(v)] = p;
                    } else {
                        i.deletedIndices.push(p);
                        i.deletedItems.push(x);
                    }
                }
                for (p = T; p <= k; ++p) {
                    if (!A.has(R.get(h ? e[p] : ensureUnique(e[p], p)))) {
                        i[p] = -2;
                    }
                }
                A.clear();
                C.clear();
            }
        }
        if (i === void 0) {
            const e = t.onResolve(this.os(null), (() => this.rs(null)));
            if (isPromise(e)) {
                e.catch(rethrow);
            }
        } else {
            const e = s.applyMutationsToIndices(i);
            if (e.deletedIndices.length > 0) {
                const s = t.onResolve(this.cs(e), (() => this.us(r, e)));
                if (isPromise(s)) {
                    s.catch(rethrow);
                }
            } else {
                this.us(r, e);
            }
        }
    }
    es() {
        const t = this.$controller.scope;
        let e = this.ds;
        let i = this.Xe;
        let n;
        if (i) {
            e = this.ds = s.astEvaluate(this.Qe, t, this.ts, null) ?? null;
            i = this.Xe = !B(this.items, e);
        }
        const r = this.Ge;
        if (this.$controller.isActive) {
            n = this.Ge = s.getCollectionObserver(i ? e : this.items);
            if (r !== n) {
                r?.unsubscribe(this);
                n?.subscribe(this);
            }
        } else {
            r?.unsubscribe(this);
            this.Ge = undefined;
        }
    }
    ss() {
        const {items: t} = this;
        if (isArray(t)) {
            this.Ye = t;
            return;
        }
        const e = [];
        iterate(t, ((t, s) => {
            e[s] = t;
        }));
        this.Ye = e;
    }
    rs(t) {
        let e = void 0;
        let s;
        let i;
        let n;
        const {$controller: r, f: l, local: h, l: a, items: c, ze: u, ts: f, forOf: d, Ze: p} = this;
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
    os(t) {
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
    cs(t) {
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
    us(t, e) {
        let i = void 0;
        let n;
        let r;
        let l;
        let h = 0;
        const {$controller: a, f: c, local: u, Ye: f, l: d, views: p, Ze: m, ts: x, ze: g, forOf: v} = this;
        const b = e.length;
        for (;b > h; ++h) {
            if (e[h] === -2) {
                r = c.create();
                p.splice(h, 0, r);
            }
        }
        if (p.length !== b) {
            throw mismatchedLengthError(p.length, b);
        }
        const w = a.scope;
        const y = e.length;
        s.synchronizeIndices(p, e);
        const k = longestIncreasingSubsequence(e);
        const A = k.length;
        const C = v.declaration;
        let R;
        let B = A - 1;
        h = y - 1;
        for (;h >= 0; --h) {
            r = p[h];
            R = p[h + 1];
            r.nodes.link(R?.nodes ?? d);
            if (e[h] === -2) {
                l = getScope(g, f[h], v, w, x, u, m);
                setContextualProperties(l.overrideContext, h, y);
                r.setLocation(d);
                n = r.activate(r, a, l);
                if (isPromise(n)) {
                    (i ?? (i = [])).push(n);
                }
            } else if (B < 0 || A === 1 || h !== k[B]) {
                if (m) {
                    s.astAssign(C, r.scope, x, f[h]);
                } else {
                    r.scope.bindingContext[u] = f[h];
                }
                setContextualProperties(r.scope.overrideContext, h, y);
                r.nodes.insertBefore(r.location);
            } else {
                if (m) {
                    s.astAssign(C, r.scope, x, f[h]);
                } else {
                    r.scope.bindingContext[u] = f[h];
                }
                if (t !== y) {
                    setContextualProperties(r.scope.overrideContext, h, y);
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
            for (let s = 0, i = e.length; s < i; ++s) {
                if (e[s].accept(t) === true) {
                    return true;
                }
            }
        }
    }
}

Repeat.inject = [ Ht, s.IExpressionParser, Q, ie, $t ];

__decorate([ bindable ], Repeat.prototype, "items", void 0);

templateController("repeat")(Repeat);

let $e = 16;

let qe = new Int32Array($e);

let Ue = new Int32Array($e);

function longestIncreasingSubsequence(t) {
    const e = t.length;
    if (e > $e) {
        $e = e;
        qe = new Int32Array(e);
        Ue = new Int32Array(e);
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
            l = qe[s];
            n = t[l];
            if (n !== -2 && n < i) {
                Ue[r] = l;
                qe[++s] = r;
                continue;
            }
            h = 0;
            a = s;
            while (h < a) {
                c = h + a >> 1;
                n = t[qe[c]];
                if (n !== -2 && n < i) {
                    h = c + 1;
                } else {
                    a = c;
                }
            }
            n = t[qe[h]];
            if (i < n || n === -2) {
                if (h > 0) {
                    Ue[r] = qe[h - 1];
                }
                qe[h] = r;
            }
        }
    }
    r = ++s;
    const u = new Int32Array(r);
    i = qe[s - 1];
    while (s-- > 0) {
        u[s] = i;
        i = Ue[i];
    }
    while (r-- > 0) qe[r] = 0;
    return u;
}

const mismatchedLengthError = (t, e) => createError(`AUR0814:${t}!=${e}`);

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

const Fe = v.toString;

const getCount = t => {
    switch (Fe.call(t)) {
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
        throw createError(`Cannot count ${Fe.call(t)}`);
    }
};

const iterate = (t, e) => {
    switch (Fe.call(t)) {
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
        throw createError(`Cannot iterate over ${Fe.call(t)}`);
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
    constructor(t, e) {
        this.view = t.create().setLocation(e);
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

With.inject = [ $t, Q ];

__decorate([ bindable ], With.prototype, "value", void 0);

templateController("with")(With);

exports.Switch = class Switch {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.cases = [];
        this.activeCases = [];
        this.promise = void 0;
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
        this.queue((() => this.ps(t)));
    }
    ps(e) {
        const s = e.isMatch(this.value);
        const i = this.activeCases;
        const n = i.length;
        if (!s) {
            if (n > 0 && i[0].id === e.id) {
                return this.xs(null);
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
        return t.onResolve(this.xs(null, r), (() => {
            this.activeCases = r;
            return this.gs(null);
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
        return t.onResolve(this.activeCases.length > 0 ? this.xs(e, i) : void 0, (() => {
            this.activeCases = i;
            if (i.length === 0) {
                return;
            }
            return this.gs(e);
        }));
    }
    gs(e) {
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
        return t.resolveAll(...i.map((t => t.activate(e, r))));
    }
    xs(e, s = []) {
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
        return t.onResolve(t.resolveAll(...i.reduce(((t, i) => {
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

exports.Switch = __decorate([ templateController("switch"), __param(0, $t), __param(1, Q) ], exports.Switch);

let He = 0;

exports.Case = class Case {
    constructor(t, e, s, i) {
        this.f = t;
        this.vs = e;
        this.l = s;
        this.id = ++He;
        this.fallThrough = false;
        this.view = void 0;
        this.bs = i.config.level <= 1;
        this.ws = i.scopeTo(`${this.constructor.name}-#${this.id}`);
    }
    link(t, e, s, i) {
        const n = t.parent;
        const r = n?.viewModel;
        if (r instanceof exports.Switch) {
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
        this.ws.debug("isMatch()");
        const e = this.value;
        if (isArray(e)) {
            if (this.Ge === void 0) {
                this.Ge = this.ys(e);
            }
            return e.includes(t);
        }
        return e === t;
    }
    valueChanged(t, e) {
        if (isArray(t)) {
            this.Ge?.unsubscribe(this);
            this.Ge = this.ys(t);
        } else if (this.Ge !== void 0) {
            this.Ge.unsubscribe(this);
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
        this.Ge?.unsubscribe(this);
        this.view?.dispose();
        this.view = void 0;
    }
    linkToSwitch(t) {
        t.cases.push(this);
    }
    ys(t) {
        const e = this.vs.getArrayObserver(t);
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

exports.Case.inject = [ $t, s.IObserverLocator, Q, t.ILogger ];

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
            throw createError(`AUR0816`);
        }
        t.defaultCase = this;
    }
};

exports.DefaultCase = __decorate([ templateController("default-case") ], exports.DefaultCase);

exports.PromiseTemplateController = class PromiseTemplateController {
    constructor(t, e, s, i) {
        this.f = t;
        this.l = e;
        this.p = s;
        this.preSettledTask = null;
        this.postSettledTask = null;
        this.logger = i.scopeTo("promise.resolve");
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
            this.logger.warn(`The value '${g(s)}' is not a promise. No change will be done.`);
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
            void t.resolveAll(c = (this.preSettledTask = i.queueTask((() => t.resolveAll(r?.deactivate(e), l?.deactivate(e), h?.activate(e, a))), u)).result.catch((t => {
                if (!(t instanceof n.TaskAbortError)) throw t;
            })), s.then((n => {
                if (this.value !== s) {
                    return;
                }
                const fulfill = () => {
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => t.resolveAll(h?.deactivate(e), l?.deactivate(e), r?.activate(e, a, n))), u)).result;
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
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => t.resolveAll(h?.deactivate(e), r?.deactivate(e), l?.activate(e, a, n))), u)).result;
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

exports.PromiseTemplateController = __decorate([ templateController("promise"), __param(0, $t), __param(1, Q), __param(2, W), __param(3, t.ILogger) ], exports.PromiseTemplateController);

exports.PendingTemplateController = class PendingTemplateController {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.view = void 0;
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

exports.PendingTemplateController = __decorate([ templateController("pending"), __param(0, $t), __param(1, Q) ], exports.PendingTemplateController);

exports.FulfilledTemplateController = class FulfilledTemplateController {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.view = void 0;
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

exports.FulfilledTemplateController = __decorate([ templateController("then"), __param(0, $t), __param(1, Q) ], exports.FulfilledTemplateController);

exports.RejectedTemplateController = class RejectedTemplateController {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.view = void 0;
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

exports.RejectedTemplateController = __decorate([ templateController("catch"), __param(0, $t), __param(1, Q) ], exports.RejectedTemplateController);

function getPromiseController(t) {
    const e = t.parent;
    const s = e?.viewModel;
    if (s instanceof exports.PromiseTemplateController) {
        return s;
    }
    throw createError(`AUR0813`);
}

let Oe = class PromiseAttributePattern {
    "promise.resolve"(t, e, s) {
        return new AttrSyntax(t, e, "promise", "bind");
    }
};

Oe = __decorate([ attributePattern({
    pattern: "promise.resolve",
    symbols: ""
}) ], Oe);

let Ve = class FulfilledAttributePattern {
    then(t, e, s) {
        return new AttrSyntax(t, e, "then", "from-view");
    }
};

Ve = __decorate([ attributePattern({
    pattern: "then",
    symbols: ""
}) ], Ve);

let Ne = class RejectedAttributePattern {
    catch(t, e, s) {
        return new AttrSyntax(t, e, "catch", "from-view");
    }
};

Ne = __decorate([ attributePattern({
    pattern: "catch",
    symbols: ""
}) ], Ne);

class Focus {
    constructor(t, e) {
        this.ks = false;
        this.As = t;
        this.p = e;
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) {
            this.Cs();
        } else {
            this.ks = true;
        }
    }
    attached() {
        if (this.ks) {
            this.ks = false;
            this.Cs();
        }
        this.As.addEventListener("focus", this);
        this.As.addEventListener("blur", this);
    }
    detaching() {
        const t = this.As;
        t.removeEventListener("focus", this);
        t.removeEventListener("blur", this);
    }
    handleEvent(t) {
        if (t.type === "focus") {
            this.value = true;
        } else if (!this.Rs) {
            this.value = false;
        }
    }
    Cs() {
        const t = this.As;
        const e = this.Rs;
        const s = this.value;
        if (s && !e) {
            t.focus();
        } else if (!s && e) {
            t.blur();
        }
    }
    get Rs() {
        return this.As === this.p.document.activeElement;
    }
}

Focus.inject = [ X, W ];

__decorate([ bindable({
    mode: 6
}) ], Focus.prototype, "value", void 0);

customAttribute("focus")(Focus);

class Portal {
    constructor(t, e, s) {
        this.position = "beforeend";
        this.strict = false;
        this.p = s;
        this.Bs = s.document.createElement("div");
        (this.view = t.create()).setLocation(this.Ss = createLocation(s));
        setEffectiveParentNode(this.view.nodes, e);
    }
    attaching(t) {
        if (this.callbackContext == null) {
            this.callbackContext = this.$controller.scope.bindingContext;
        }
        const e = this.Bs = this._s();
        this.Ts(e, this.position);
        return this.Is(t, e);
    }
    detaching(t) {
        return this.Es(t, this.Bs);
    }
    targetChanged() {
        const {$controller: e} = this;
        if (!e.isActive) {
            return;
        }
        const s = this._s();
        if (this.Bs === s) {
            return;
        }
        this.Bs = s;
        const i = t.onResolve(this.Es(null, s), (() => {
            this.Ts(s, this.position);
            return this.Is(null, s);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    positionChanged() {
        const {$controller: e, Bs: s} = this;
        if (!e.isActive) {
            return;
        }
        const i = t.onResolve(this.Es(null, s), (() => {
            this.Ts(s, this.position);
            return this.Is(null, s);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    Is(e, s) {
        const {activating: i, callbackContext: n, view: r} = this;
        return t.onResolve(i?.call(n, s, r), (() => this.Ls(e, s)));
    }
    Ls(e, s) {
        const {$controller: i, view: n} = this;
        if (e === null) {
            n.nodes.insertBefore(this.Ss);
        } else {
            return t.onResolve(n.activate(e ?? n, i, i.scope), (() => this.Ps(s)));
        }
        return this.Ps(s);
    }
    Ps(t) {
        const {activated: e, callbackContext: s, view: i} = this;
        return e?.call(s, t, i);
    }
    Es(e, s) {
        const {deactivating: i, callbackContext: n, view: r} = this;
        return t.onResolve(i?.call(n, s, r), (() => this.Ms(e, s)));
    }
    Ms(e, s) {
        const {$controller: i, view: n} = this;
        if (e === null) {
            n.nodes.remove();
        } else {
            return t.onResolve(n.deactivate(e, i), (() => this.Ds(s)));
        }
        return this.Ds(s);
    }
    Ds(t) {
        const {deactivated: e, callbackContext: s, view: i} = this;
        return e?.call(s, t, i);
    }
    _s() {
        const t = this.p;
        const e = t.document;
        let s = this.target;
        let i = this.renderContext;
        if (s === "") {
            if (this.strict) {
                throw createError(`AUR0811`);
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
                throw createError(`AUR0812`);
            }
            return e.body;
        }
        return s;
    }
    Ts(t, e) {
        const s = this.Ss;
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

Portal.inject = [ $t, Q, W ];

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
    static get inject() {
        return [ Q, Ht, ne, Qt ];
    }
    constructor(e, s, i, n) {
        this.$s = null;
        this.qs = null;
        this.Us = false;
        this.expose = null;
        this.slotchange = null;
        this.Fs = new Set;
        this.Ge = null;
        let r;
        let l;
        const h = s.auSlot;
        const a = i.instruction?.projections?.[h.name];
        const c = i.controller;
        this.name = h.name;
        if (a == null) {
            r = n.getViewFactory(h.fallback, c.container);
            this.Hs = false;
        } else {
            l = i.parent.controller.container.createChild();
            registerResolver(l, c.definition.Type, new t.InstanceProvider(void 0, c.viewModel));
            r = n.getViewFactory(a, l);
            this.Hs = true;
            this.Os = c.container.getAll(Ut, false)?.filter((t => t.slotName === "*" || t.slotName === h.name)) ?? t.emptyArray;
        }
        this.Vs = (this.Os ?? (this.Os = t.emptyArray)).length > 0;
        this.Ns = i;
        this.view = r.create().setLocation(this.l = e);
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
        this.Fs.add(t);
    }
    unsubscribe(t) {
        this.Fs.delete(t);
    }
    binding(t, e) {
        this.$s = this.$controller.scope.parent;
        let i;
        if (this.Hs) {
            i = this.Ns.controller.scope.parent;
            (this.qs = s.Scope.fromParent(i, i.bindingContext)).overrideContext.$host = this.expose ?? this.$s.bindingContext;
        }
    }
    attaching(e, s) {
        return t.onResolve(this.view.activate(e, this.$controller, this.Hs ? this.qs : this.$s), (() => {
            if (this.Vs) {
                this.Os.forEach((t => t.watch(this)));
                this.Fe();
                this.js();
                this.Us = true;
            }
        }));
    }
    detaching(t, e) {
        this.Us = false;
        this.Ws();
        this.Os.forEach((t => t.unwatch(this)));
        return this.view.deactivate(t, this.$controller);
    }
    exposeChanged(t) {
        if (this.Hs && this.qs != null) {
            this.qs.overrideContext.$host = t;
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
    Fe() {
        if (this.Ge != null) {
            return;
        }
        const t = this.l;
        const e = t.parentElement;
        if (e == null) {
            return;
        }
        (this.Ge = createMutationObserver(e, (e => {
            if (isMutationWithinLocation(t, e)) {
                this.js();
            }
        }))).observe(e, {
            childList: true
        });
    }
    Ws() {
        this.Ge?.disconnect();
        this.Ge = null;
    }
    js() {
        const t = this.nodes;
        const e = new Set(this.Fs);
        let s;
        if (this.Us) {
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
    static get inject() {
        return [ t.IContainer, ie, X, Q, W, Ht, t.transient(CompositionContextFactory) ];
    }
    get pending() {
        return this.zs;
    }
    get composition() {
        return this.Gs;
    }
    constructor(t, e, s, i, n, r, l) {
        this.c = t;
        this.parent = e;
        this.host = s;
        this.l = i;
        this.p = n;
        this.scopeBehavior = "auto";
        this.Gs = void 0;
        this.r = t.get(Qt);
        this.Xs = r;
        this.Ks = l;
    }
    attaching(e, s) {
        return this.zs = t.onResolve(this.queue(new ChangeInfo(this.template, this.component, this.model, void 0), e), (t => {
            if (this.Ks.isCurrent(t)) {
                this.zs = void 0;
            }
        }));
    }
    detaching(e) {
        const s = this.Gs;
        const i = this.zs;
        this.Ks.invalidate();
        this.Gs = this.zs = void 0;
        return t.onResolve(i, (() => s?.deactivate(e)));
    }
    propertyChanged(e) {
        if (e === "model" && this.Gs != null) {
            this.Gs.update(this.model);
            return;
        }
        this.zs = t.onResolve(this.zs, (() => t.onResolve(this.queue(new ChangeInfo(this.template, this.component, this.model, e), void 0), (t => {
            if (this.Ks.isCurrent(t)) {
                this.zs = void 0;
            }
        }))));
    }
    queue(e, s) {
        const i = this.Ks;
        const n = this.Gs;
        return t.onResolve(i.create(e), (e => {
            if (i.isCurrent(e)) {
                return t.onResolve(this.compose(e), (r => {
                    if (i.isCurrent(e)) {
                        return t.onResolve(r.activate(s), (() => {
                            if (i.isCurrent(e)) {
                                this.Gs = r;
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
        let n;
        let r;
        const {Qs: l, Ys: h, Zs: a} = e.change;
        const {c: c, host: u, $controller: f, l: d} = this;
        const p = this.getDef(h);
        const m = c.createChild();
        const x = d == null ? u.parentNode : d.parentNode;
        if (p !== null) {
            if (p.containerless) {
                throw createError(`AUR0806`);
            }
            if (d == null) {
                n = u;
                r = () => {};
            } else {
                n = x.insertBefore(this.p.document.createElement(p.name), d);
                r = () => {
                    n.remove();
                };
            }
            i = this.Js(m, h, n);
        } else {
            n = d == null ? u : d;
            i = this.Js(m, h, n);
        }
        const compose = () => {
            if (p !== null) {
                const s = Controller.$el(m, i, n, {
                    projections: this.Xs.projections
                }, p);
                return new CompositionController(s, (t => s.activate(t ?? s, f, f.scope.parent)), (e => t.onResolve(s.deactivate(e ?? s, f), r)), (t => i.activate?.(t)), e);
            } else {
                const t = CustomElementDefinition.create({
                    name: ft.generateName(),
                    template: l
                });
                const r = this.r.getViewFactory(t, m);
                const h = Controller.$view(r, f);
                const a = this.scopeBehavior === "auto" ? s.Scope.fromParent(this.parent.scope, i) : s.Scope.create(i);
                if (isRenderLocation(n)) {
                    h.setLocation(n);
                } else {
                    h.setHost(n);
                }
                return new CompositionController(h, (t => h.activate(t ?? h, f, a)), (t => h.deactivate(t ?? h, f)), (t => i.activate?.(t)), e);
            }
        };
        if ("activate" in i) {
            return t.onResolve(i.activate(a), (() => compose()));
        } else {
            return compose();
        }
    }
    Js(e, s, i) {
        if (s == null) {
            return new EmptyComponent;
        }
        if (typeof s === "object") {
            return s;
        }
        const n = this.p;
        const r = isRenderLocation(i);
        registerHostNode(e, n, r ? null : i);
        registerResolver(e, Q, new t.InstanceProvider("IRenderLocation", r ? i : null));
        const l = e.invoke(s);
        registerResolver(e, s, new t.InstanceProvider("au-compose.component", l));
        return l;
    }
    getDef(t) {
        const e = isFunction(t) ? t : t?.constructor;
        return ft.isType(e) ? ft.getDefinition(e) : null;
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
    create(e) {
        return t.onResolve(e.load(), (t => new CompositionContext(++this.id, t)));
    }
    invalidate() {
        this.id++;
    }
}

class ChangeInfo {
    constructor(t, e, s, i) {
        this.Qs = t;
        this.Ys = e;
        this.Zs = s;
        this.ti = i;
    }
    load() {
        if (isPromise(this.Qs) || isPromise(this.Ys)) {
            return Promise.all([ this.Qs, this.Ys ]).then((([t, e]) => new LoadedChangeInfo(t, e, this.Zs, this.ti)));
        } else {
            return new LoadedChangeInfo(this.Qs, this.Ys, this.Zs, this.ti);
        }
    }
}

class LoadedChangeInfo {
    constructor(t, e, s, i) {
        this.Qs = t;
        this.Ys = e;
        this.Zs = s;
        this.ti = i;
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

const je = /*@__PURE__*/ E("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw createError('"sanitize" method not implemented');
    }
})));

exports.SanitizeValueConverter = class SanitizeValueConverter {
    constructor(t) {
        this.ei = t;
    }
    toView(t) {
        if (t == null) {
            return null;
        }
        return this.ei.sanitize(t);
    }
};

exports.SanitizeValueConverter = __decorate([ __param(0, je) ], exports.SanitizeValueConverter);

valueConverter("sanitize")(exports.SanitizeValueConverter);

const We = /*@__PURE__*/ E("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const ze = {};

class TemplateElementFactory {
    constructor(t) {
        this.p = t;
        this.Qs = createTemplate(this.p);
    }
    createTemplate(t) {
        if (isString(t)) {
            let e = ze[t];
            if (e === void 0) {
                const s = this.Qs;
                s.innerHTML = t;
                const i = s.content.firstElementChild;
                if (i == null || i.nodeName !== "TEMPLATE" || i.nextElementSibling != null) {
                    this.Qs = createTemplate(this.p);
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
            const e = createTemplate(this.p);
            e.content.appendChild(t);
            return e;
        }
        t.parentNode?.removeChild(t);
        return t.cloneNode(true);
    }
}

TemplateElementFactory.inject = [ W ];

const createTemplate = t => t.document.createElement("template");

class TemplateCompiler {
    constructor() {
        this.debug = false;
        this.resolveResources = true;
    }
    static register(t) {
        return L(Ot, this).register(t);
    }
    compile(e, s, i) {
        const n = CustomElementDefinition.getOrCreate(e);
        if (n.template === null || n.template === void 0) {
            return n;
        }
        if (n.needsCompile === false) {
            return n;
        }
        i ?? (i = Ze);
        const r = new CompilationContext(e, s, i, null, null, void 0);
        const l = isString(n.template) || !e.enhance ? r.si.createTemplate(n.template) : n.template;
        const h = l.nodeName === Ke && l.content != null;
        const a = h ? l.content : l;
        const c = s.get(allResources(os));
        const u = c.length;
        let f = 0;
        if (u > 0) {
            while (u > f) {
                c[f].compiling?.(l);
                ++f;
            }
        }
        if (l.hasAttribute(rs)) {
            throw createError(`AUR0701`);
        }
        this.ii(a, r);
        this.ni(a, r);
        return CustomElementDefinition.create({
            ...e,
            name: e.name || ct(),
            dependencies: (e.dependencies ?? t.emptyArray).concat(r.deps ?? t.emptyArray),
            instructions: r.rows,
            surrogates: h ? this.ri(l, r) : t.emptyArray,
            template: l,
            hasSlots: r.hasSlot,
            needsCompile: false
        });
    }
    compileSpread(e, s, i, n) {
        const r = new CompilationContext(e, i, Ze, null, null, void 0);
        const l = [];
        const h = r.oi(n.nodeName.toLowerCase());
        const a = h !== null;
        const c = r.ep;
        const u = s.length;
        let f = 0;
        let d;
        let p = null;
        let m;
        let x;
        let g;
        let v;
        let b;
        let w = null;
        let y;
        let k;
        let A;
        let C;
        for (;u > f; ++f) {
            d = s[f];
            A = d.target;
            C = d.rawValue;
            w = r.li(d);
            if (w !== null && (w.type & 1) > 0) {
                ts.node = n;
                ts.attr = d;
                ts.bindable = null;
                ts.def = null;
                l.push(w.build(ts, r.ep, r.m));
                continue;
            }
            p = r.hi(A);
            if (p !== null) {
                if (p.isTemplateController) {
                    throw createError(`AUR0703:${A}`);
                }
                g = BindablesInfo.from(p, true);
                k = p.noMultiBindings === false && w === null && hasInlineBindings(C);
                if (k) {
                    x = this.ai(n, C, p, r);
                } else {
                    b = g.primary;
                    if (w === null) {
                        y = c.parse(C, 1);
                        x = [ y === null ? new SetPropertyInstruction(C, b.property) : new InterpolationInstruction(y, b.property) ];
                    } else {
                        ts.node = n;
                        ts.attr = d;
                        ts.bindable = b;
                        ts.def = p;
                        x = [ w.build(ts, r.ep, r.m) ];
                    }
                }
                (m ?? (m = [])).push(new HydrateAttributeInstruction(this.resolveResources ? p : p.name, p.aliases != null && p.aliases.includes(A) ? A : void 0, x));
                continue;
            }
            if (w === null) {
                y = c.parse(C, 1);
                if (a) {
                    g = BindablesInfo.from(h, false);
                    v = g.attrs[A];
                    if (v !== void 0) {
                        y = c.parse(C, 1);
                        l.push(new SpreadElementPropBindingInstruction(y == null ? new SetPropertyInstruction(C, v.property) : new InterpolationInstruction(y, v.property)));
                        continue;
                    }
                }
                if (y != null) {
                    l.push(new InterpolationInstruction(y, r.m.map(n, A) ?? t.camelCase(A)));
                } else {
                    switch (A) {
                      case "class":
                        l.push(new SetClassAttributeInstruction(C));
                        break;

                      case "style":
                        l.push(new SetStyleAttributeInstruction(C));
                        break;

                      default:
                        l.push(new SetAttributeInstruction(C, A));
                    }
                }
            } else {
                if (a) {
                    g = BindablesInfo.from(h, false);
                    v = g.attrs[A];
                    if (v !== void 0) {
                        ts.node = n;
                        ts.attr = d;
                        ts.bindable = v;
                        ts.def = h;
                        l.push(new SpreadElementPropBindingInstruction(w.build(ts, r.ep, r.m)));
                        continue;
                    }
                }
                ts.node = n;
                ts.attr = d;
                ts.bindable = null;
                ts.def = null;
                l.push(w.build(ts, r.ep, r.m));
            }
        }
        resetCommandBuildInfo();
        if (m != null) {
            return m.concat(l);
        }
        return l;
    }
    ri(e, s) {
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
            f = s.be.parse(c, u);
            y = f.target;
            k = f.rawValue;
            if (es[y]) {
                throw createError(`AUR0702:${c}`);
            }
            v = s.li(f);
            if (v !== null && (v.type & 1) > 0) {
                ts.node = e;
                ts.attr = f;
                ts.bindable = null;
                ts.def = null;
                i.push(v.build(ts, s.ep, s.m));
                continue;
            }
            d = s.hi(y);
            if (d !== null) {
                if (d.isTemplateController) {
                    throw createError(`AUR0703:${y}`);
                }
                x = BindablesInfo.from(d, true);
                w = d.noMultiBindings === false && v === null && hasInlineBindings(k);
                if (w) {
                    m = this.ai(e, k, d, s);
                } else {
                    g = x.primary;
                    if (v === null) {
                        b = r.parse(k, 1);
                        m = [ b === null ? new SetPropertyInstruction(k, g.property) : new InterpolationInstruction(b, g.property) ];
                    } else {
                        ts.node = e;
                        ts.attr = f;
                        ts.bindable = g;
                        ts.def = d;
                        m = [ v.build(ts, s.ep, s.m) ];
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
                ts.node = e;
                ts.attr = f;
                ts.bindable = null;
                ts.def = null;
                i.push(v.build(ts, s.ep, s.m));
            }
        }
        resetCommandBuildInfo();
        if (p != null) {
            return p.concat(i);
        }
        return i;
    }
    ni(t, e) {
        switch (t.nodeType) {
          case 1:
            switch (t.nodeName) {
              case "LET":
                return this.ui(t, e);

              default:
                return this.fi(t, e);
            }

          case 3:
            return this.di(t, e);

          case 11:
            {
                let s = t.firstChild;
                while (s !== null) {
                    s = this.ni(s, e);
                }
                break;
            }
        }
        return t.nextSibling;
    }
    ui(e, i) {
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
            f = i.be.parse(d, p);
            x = f.target;
            g = f.rawValue;
            m = i.li(f);
            if (m !== null) {
                if (f.command === "bind") {
                    l.push(new LetBindingInstruction(h.parse(g, 16), t.camelCase(x)));
                } else {
                    throw createError(`AUR0704:${f.command}`);
                }
                continue;
            }
            v = h.parse(g, 1);
            l.push(new LetBindingInstruction(v === null ? new s.PrimitiveLiteralExpression(g) : v, t.camelCase(x)));
        }
        i.rows.push([ new HydrateLetElementInstruction(l, a) ]);
        return this.pi(e).nextSibling;
    }
    fi(e, s) {
        var i, n, r, l;
        const h = e.nextSibling;
        const a = (e.getAttribute("as-element") ?? e.nodeName).toLowerCase();
        const c = s.oi(a);
        const u = c !== null;
        const f = u && c.shadowOptions != null;
        const d = c?.capture;
        const p = d != null && typeof d !== "boolean";
        const m = d ? [] : t.emptyArray;
        const x = s.ep;
        const g = this.debug ? t.noop : () => {
            e.removeAttribute(A);
            --y;
            --w;
        };
        let v = e.attributes;
        let b;
        let w = v.length;
        let y = 0;
        let k;
        let A;
        let C;
        let R;
        let B;
        let S;
        let _ = null;
        let T = false;
        let I;
        let E;
        let L;
        let P;
        let M;
        let D;
        let $;
        let q = null;
        let U;
        let F;
        let H;
        let O;
        let V = true;
        let N = false;
        let j = false;
        if (a === "slot") {
            if (s.root.def.shadowOptions == null) {
                throw createError(`AUR0717:${s.root.def.name}`);
            }
            s.root.hasSlot = true;
        }
        if (u) {
            V = c.processContent?.call(c.Type, e, s.p);
            v = e.attributes;
            w = v.length;
        }
        if (s.root.def.enhance && e.classList.contains("au")) {
            throw createError(`AUR0705`);
        }
        for (;w > y; ++y) {
            k = v[y];
            A = k.name;
            C = k.value;
            switch (A) {
              case "as-element":
              case "containerless":
                g();
                if (!N) {
                    N = A === "containerless";
                }
                continue;
            }
            R = s.be.parse(A, C);
            q = s.li(R);
            H = R.target;
            O = R.rawValue;
            if (d && (!p || p && d(H))) {
                if (q != null && q.type & 1) {
                    g();
                    m.push(R);
                    continue;
                }
                j = H !== us && H !== "slot";
                if (j) {
                    U = BindablesInfo.from(c, false);
                    if (U.attrs[H] == null && !s.hi(H)?.isTemplateController) {
                        g();
                        m.push(R);
                        continue;
                    }
                }
            }
            if (q !== null && q.type & 1) {
                ts.node = e;
                ts.attr = R;
                ts.bindable = null;
                ts.def = null;
                (B ?? (B = [])).push(q.build(ts, s.ep, s.m));
                g();
                continue;
            }
            _ = s.hi(H);
            if (_ !== null) {
                U = BindablesInfo.from(_, true);
                T = _.noMultiBindings === false && q === null && hasInlineBindings(O);
                if (T) {
                    L = this.ai(e, O, _, s);
                } else {
                    F = U.primary;
                    if (q === null) {
                        D = x.parse(O, 1);
                        L = [ D === null ? new SetPropertyInstruction(O, F.property) : new InterpolationInstruction(D, F.property) ];
                    } else {
                        ts.node = e;
                        ts.attr = R;
                        ts.bindable = F;
                        ts.def = _;
                        L = [ q.build(ts, s.ep, s.m) ];
                    }
                }
                g();
                if (_.isTemplateController) {
                    (P ?? (P = [])).push(new HydrateTemplateController(Je, this.resolveResources ? _ : _.name, void 0, L));
                } else {
                    (E ?? (E = [])).push(new HydrateAttributeInstruction(this.resolveResources ? _ : _.name, _.aliases != null && _.aliases.includes(H) ? H : void 0, L));
                }
                continue;
            }
            if (q === null) {
                if (u) {
                    U = BindablesInfo.from(c, false);
                    I = U.attrs[H];
                    if (I !== void 0) {
                        D = x.parse(O, 1);
                        (S ?? (S = [])).push(D == null ? new SetPropertyInstruction(O, I.property) : new InterpolationInstruction(D, I.property));
                        g();
                        continue;
                    }
                }
                D = x.parse(O, 1);
                if (D != null) {
                    g();
                    (B ?? (B = [])).push(new InterpolationInstruction(D, s.m.map(e, H) ?? t.camelCase(H)));
                }
                continue;
            }
            g();
            if (u) {
                U = BindablesInfo.from(c, false);
                I = U.attrs[H];
                if (I !== void 0) {
                    ts.node = e;
                    ts.attr = R;
                    ts.bindable = I;
                    ts.def = c;
                    (S ?? (S = [])).push(q.build(ts, s.ep, s.m));
                    continue;
                }
            }
            ts.node = e;
            ts.attr = R;
            ts.bindable = null;
            ts.def = null;
            (B ?? (B = [])).push(q.build(ts, s.ep, s.m));
        }
        resetCommandBuildInfo();
        if (this.mi(e, B) && B != null && B.length > 1) {
            this.xi(e, B);
        }
        if (u) {
            $ = new HydrateElementInstruction(this.resolveResources ? c : c.name, void 0, S ?? t.emptyArray, null, N, m);
            if (a === us) {
                const t = e.getAttribute("name") || cs;
                const i = s.t();
                const n = s.gi();
                let r = e.firstChild;
                while (r !== null) {
                    if (r.nodeType === 1 && r.hasAttribute(us)) {
                        e.removeChild(r);
                    } else {
                        appendToTemplate(i, r);
                    }
                    r = e.firstChild;
                }
                this.ni(i.content, n);
                $.auSlot = {
                    name: t,
                    fallback: CustomElementDefinition.create({
                        name: ct(),
                        template: i,
                        instructions: n.rows,
                        needsCompile: false
                    })
                };
                e = this.vi(e, s);
            }
        }
        if (B != null || $ != null || E != null) {
            b = t.emptyArray.concat($ ?? t.emptyArray, E ?? t.emptyArray, B ?? t.emptyArray);
            this.pi(e);
        }
        let W;
        if (P != null) {
            w = P.length - 1;
            y = w;
            M = P[y];
            let t;
            if (isMarker(e)) {
                t = s.t();
                appendManyToTemplate(t, [ s.bi(Qe), s.bi(Ye), this.pi(s.h(Xe)) ]);
            } else {
                this.vi(e, s);
                if (e.nodeName === "TEMPLATE") {
                    t = e;
                } else {
                    t = s.t();
                    appendToTemplate(t, e);
                }
            }
            const r = t;
            const l = s.gi(b == null ? [] : [ b ]);
            let h;
            let d;
            let p;
            let m;
            let x;
            let g;
            let v;
            let k;
            let A = 0, C = 0;
            let R = e.firstChild;
            let B = false;
            if (V !== false) {
                while (R !== null) {
                    d = R.nodeType === 1 ? R.getAttribute(us) : null;
                    if (d !== null) {
                        R.removeAttribute(us);
                    }
                    if (u) {
                        h = R.nextSibling;
                        if (!f) {
                            B = R.nodeType === 3 && R.textContent.trim() === "";
                            if (!B) {
                                ((i = m ?? (m = {}))[n = d || cs] ?? (i[n] = [])).push(R);
                            }
                            e.removeChild(R);
                        }
                        R = h;
                    } else {
                        if (d !== null) {
                            d = d || cs;
                            throw createError(`AUR0706:${a}[${d}]`);
                        }
                        R = R.nextSibling;
                    }
                }
            }
            if (m != null) {
                p = {};
                for (d in m) {
                    t = s.t();
                    x = m[d];
                    for (A = 0, C = x.length; C > A; ++A) {
                        g = x[A];
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
                    k = s.gi();
                    this.ni(t.content, k);
                    p[d] = CustomElementDefinition.create({
                        name: ct(),
                        template: t,
                        instructions: k.rows,
                        needsCompile: false,
                        isStrictBinding: s.root.def.isStrictBinding
                    });
                }
                $.projections = p;
            }
            if (u && (N || c.containerless)) {
                this.vi(e, s);
            }
            W = !u || !c.containerless && !N && V !== false;
            if (W) {
                if (e.nodeName === Ke) {
                    this.ni(e.content, l);
                } else {
                    R = e.firstChild;
                    while (R !== null) {
                        R = this.ni(R, l);
                    }
                }
            }
            M.def = CustomElementDefinition.create({
                name: ct(),
                template: r,
                instructions: l.rows,
                needsCompile: false,
                isStrictBinding: s.root.def.isStrictBinding
            });
            while (y-- > 0) {
                M = P[y];
                t = s.t();
                v = this.pi(s.h(Xe));
                appendManyToTemplate(t, [ s.bi(Qe), s.bi(Ye), v ]);
                M.def = CustomElementDefinition.create({
                    name: ct(),
                    template: t,
                    needsCompile: false,
                    instructions: [ [ P[y + 1] ] ],
                    isStrictBinding: s.root.def.isStrictBinding
                });
            }
            s.rows.push([ M ]);
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
            if (V !== false) {
                while (t !== null) {
                    n = t.nodeType === 1 ? t.getAttribute(us) : null;
                    if (n !== null) {
                        t.removeAttribute(us);
                    }
                    if (u) {
                        i = t.nextSibling;
                        if (!f) {
                            v = t.nodeType === 3 && t.textContent.trim() === "";
                            if (!v) {
                                ((r = d ?? (d = {}))[l = n || cs] ?? (r[l] = [])).push(t);
                            }
                            e.removeChild(t);
                        }
                        t = i;
                    } else {
                        if (n !== null) {
                            n = n || cs;
                            throw createError(`AUR0706:${a}[${n}]`);
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
                        if (m.nodeName === Ke) {
                            if (m.attributes.length > 0) {
                                appendToTemplate(x, m);
                            } else {
                                appendToTemplate(x, m.content);
                            }
                        } else {
                            appendToTemplate(x, m);
                        }
                    }
                    g = s.gi();
                    this.ni(x.content, g);
                    h[n] = CustomElementDefinition.create({
                        name: ct(),
                        template: x,
                        instructions: g.rows,
                        needsCompile: false,
                        isStrictBinding: s.root.def.isStrictBinding
                    });
                }
                $.projections = h;
            }
            if (u && (N || c.containerless)) {
                this.vi(e, s);
            }
            W = !u || !c.containerless && !N && V !== false;
            if (W && e.childNodes.length > 0) {
                t = e.firstChild;
                while (t !== null) {
                    t = this.ni(t, s);
                }
            }
        }
        return h;
    }
    di(t, e) {
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
                insertBefore(s, e.wi(c), t);
            }
            for (h = 0, a = l.length; a > h; ++h) {
                insertManyBefore(s, t, [ e.bi(Qe), e.bi(Ye), this.pi(e.h(Xe)) ]);
                if (c = r[h + 1]) {
                    insertBefore(s, e.wi(c), t);
                }
                e.rows.push([ new TextBindingInstruction(l[h], e.root.def.isStrictBinding) ]);
            }
            s.removeChild(t);
        }
        return n;
    }
    ai(t, e, s, i) {
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
                d = i.be.parse(h, a);
                p = i.li(d);
                m = n.attrs[d.target];
                if (m == null) {
                    throw createError(`AUR0707:${s.name}.${d.target}`);
                }
                if (p === null) {
                    f = i.ep.parse(a, 1);
                    l.push(f === null ? new SetPropertyInstruction(a, m.property) : new InterpolationInstruction(f, m.property));
                } else {
                    ts.node = t;
                    ts.attr = d;
                    ts.bindable = m;
                    ts.def = s;
                    l.push(p.build(ts, i.ep, i.m));
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
    ii(e, s) {
        const i = e;
        const n = t.toArray(i.querySelectorAll("template[as-custom-element]"));
        const r = n.length;
        if (r === 0) {
            return;
        }
        if (r === i.childElementCount) {
            throw createError(`AUR0708`);
        }
        const l = new Set;
        const h = [];
        for (const e of n) {
            if (e.parentNode !== i) {
                throw createError(`AUR0709`);
            }
            const n = processTemplateName(e, l);
            const r = e.content;
            const a = t.toArray(r.querySelectorAll("bindable"));
            const c = new Set;
            const u = new Set;
            const f = a.reduce(((e, s) => {
                if (s.parentNode !== r) {
                    throw createError(`AUR0710`);
                }
                const i = s.getAttribute("property");
                if (i === null) {
                    throw createError(`AUR0711`);
                }
                const n = s.getAttribute("attribute");
                if (n !== null && u.has(n) || c.has(i)) {
                    throw createError(`AUR0712:${i}+${n}`);
                } else {
                    if (n !== null) {
                        u.add(n);
                    }
                    c.add(i);
                }
                const l = t.toArray(s.attributes).filter((t => !ns.includes(t.name)));
                if (l.length > 0) ;
                s.remove();
                e[i] = {
                    attribute: n ?? void 0,
                    mode: getBindingMode(s)
                };
                return e;
            }), {});
            class LocalTemplateType {}
            S(LocalTemplateType, "name", {
                value: n
            });
            h.push(LocalTemplateType);
            s.yi(defineElement({
                name: n,
                template: e,
                bindables: f
            }, LocalTemplateType));
            i.removeChild(e);
        }
        const a = [ ...s.def.dependencies ?? t.emptyArray, ...h ];
        for (const t of h) {
            getElementDefinition(t).dependencies.push(a.filter((e => e !== t)));
        }
    }
    mi(t, e) {
        const s = t.nodeName;
        return s === "INPUT" && ss[t.type] === 1 || s === "SELECT" && (t.hasAttribute("multiple") || e?.some((t => t.type === "rg" && t.to === "multiple")));
    }
    xi(t, e) {
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
    ki(t) {
        return t.nodeName === Xe && isComment(Ge = getPreviousSibling(t)) && Ge.textContent === Ye && isComment(Ge = getPreviousSibling(Ge)) && Ge.textContent === Qe;
    }
    pi(t) {
        t.classList.add("au");
        return t;
    }
    vi(t, e) {
        if (isMarker(t)) {
            return t;
        }
        const s = t.parentNode;
        const i = this.pi(e.h(Xe));
        insertManyBefore(s, t, [ e.bi(Qe), e.bi(Ye), i ]);
        s.removeChild(t);
        return i;
    }
}

let Ge;

const Xe = "AU-M";

const Ke = "TEMPLATE";

const Qe = "au-start";

const Ye = "au-end";

const isMarker = t => t.nodeName === Xe && isComment(Ge = getPreviousSibling(t)) && Ge.textContent === Ye && isComment(Ge = getPreviousSibling(Ge)) && Ge.textContent === Qe;

const isComment = t => t?.nodeType === 8;

class CompilationContext {
    constructor(e, i, n, r, l, h) {
        this.hasSlot = false;
        this.Ai = createLookup();
        const a = r !== null;
        this.c = i;
        this.root = l === null ? this : l;
        this.def = e;
        this.ci = n;
        this.parent = r;
        this.si = a ? r.si : i.get(We);
        this.be = a ? r.be : i.get(fe);
        this.ep = a ? r.ep : i.get(s.IExpressionParser);
        this.m = a ? r.m : i.get(ke);
        this.ws = a ? r.ws : i.get(t.ILogger);
        this.p = a ? r.p : i.get(W);
        this.localEls = a ? r.localEls : new Set;
        this.rows = h ?? [];
    }
    yi(t) {
        var e;
        ((e = this.root).deps ?? (e.deps = [])).push(t);
        this.root.c.register(t);
    }
    wi(t) {
        return createText(this.p, t);
    }
    bi(t) {
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
    oi(t) {
        return this.c.find(ft, t);
    }
    hi(t) {
        return this.c.find(it, t);
    }
    gi(t) {
        return new CompilationContext(this.def, this.c, this.ci, this, this.root, t);
    }
    li(t) {
        if (this.root !== this) {
            return this.root.li(t);
        }
        const e = t.command;
        if (e === null) {
            return null;
        }
        let s = this.Ai[e];
        if (s === void 0) {
            s = this.c.create(ve, e);
            if (s === null) {
                throw createError(`AUR0713:${e}`);
            }
            this.Ai[e] = s;
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
    ts.node = ts.attr = ts.bindable = ts.def = null;
};

const Ze = {
    projections: null
};

const Je = {
    name: "unnamed"
};

const ts = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const es = y(createLookup(), {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
});

const ss = {
    checkbox: 1,
    radio: 1
};

const is = new WeakMap;

class BindablesInfo {
    static from(t, e) {
        let s = is.get(t);
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
            is.set(t, s = new BindablesInfo(n, i, c));
        }
        return s;
    }
    constructor(t, e, s) {
        this.attrs = t;
        this.bindables = e;
        this.primary = s;
    }
}

const ns = w([ "property", "attribute", "mode" ]);

const rs = "as-custom-element";

const processTemplateName = (t, e) => {
    const s = t.getAttribute(rs);
    if (s === null || s === "") {
        throw createError(`AUR0715`);
    }
    if (e.has(s)) {
        throw createError(`AUR0716:${s}`);
    } else {
        e.add(s);
        t.removeAttribute(rs);
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

const os = /*@__PURE__*/ E("ITemplateCompilerHooks");

const ls = new WeakMap;

const hs = /*@__PURE__*/ f("compiler-hooks");

const as = w({
    name: hs,
    define(t) {
        let e = ls.get(t);
        if (e === void 0) {
            ls.set(t, e = new TemplateCompilerHooksDefinition(t));
            h(hs, e, t);
            d(t, hs);
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
        t.register(L(os, this.Type));
    }
}

const templateCompilerHooks = t => {
    return t === void 0 ? decorator : decorator(t);
    function decorator(t) {
        return as.define(t);
    }
};

const cs = "default";

const us = "au-slot";

let fs = class Show {
    constructor(t, e, s) {
        this.el = t;
        this.p = e;
        this.Ci = false;
        this.Y = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.Y = null;
            if (Boolean(this.value) !== this.Ri) {
                if (this.Ri === this.Bi) {
                    this.Ri = !this.Bi;
                    this.$val = this.el.style.getPropertyValue("display");
                    this.$prio = this.el.style.getPropertyPriority("display");
                    this.el.style.setProperty("display", "none", "important");
                } else {
                    this.Ri = this.Bi;
                    this.el.style.setProperty("display", this.$val, this.$prio);
                    if (this.el.getAttribute("style") === "") {
                        this.el.removeAttribute("style");
                    }
                }
            }
        };
        this.Ri = this.Bi = s.alias !== "hide";
    }
    binding() {
        this.Ci = true;
        this.update();
    }
    detaching() {
        this.Ci = false;
        this.Y?.cancel();
        this.Y = null;
    }
    valueChanged() {
        if (this.Ci && this.Y === null) {
            this.Y = this.p.domWriteQueue.queueTask(this.update);
        }
    }
};

__decorate([ bindable ], fs.prototype, "value", void 0);

fs = __decorate([ __param(0, X), __param(1, W), __param(2, Ht) ], fs);

alias("hide")(fs);

customAttribute("show")(fs);

const ds = [ TemplateCompiler, s.DirtyChecker, NodeObserverLocator ];

const ps = [ exports.RefAttributePattern, exports.DotSeparatedAttributePattern, xe ];

const ms = [ exports.AtPrefixedTriggerAttributePattern, exports.ColonPrefixedBindAttributePattern ];

const xs = [ exports.DefaultBindingCommand, exports.OneTimeBindingCommand, exports.FromViewBindingCommand, exports.ToViewBindingCommand, exports.TwoWayBindingCommand, exports.ForBindingCommand, be, exports.TriggerBindingCommand, exports.CaptureBindingCommand, exports.ClassBindingCommand, exports.StyleBindingCommand, exports.AttrBindingCommand, we ];

const gs = [ DebounceBindingBehavior, OneTimeBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, SignalBindingBehavior, ThrottleBindingBehavior, TwoWayBindingBehavior, exports.SanitizeValueConverter, If, Else, Repeat, With, exports.Switch, exports.Case, exports.DefaultCase, exports.PromiseTemplateController, exports.PendingTemplateController, exports.FulfilledTemplateController, exports.RejectedTemplateController, Oe, Ve, Ne, AttrBindingBehavior, SelfBindingBehavior, UpdateTriggerBindingBehavior, AuCompose, Portal, Focus, fs, exports.AuSlot ];

const vs = [ exports.PropertyBindingRenderer, exports.IteratorBindingRenderer, exports.RefBindingRenderer, exports.InterpolationBindingRenderer, exports.SetPropertyRenderer, exports.CustomElementRenderer, exports.CustomAttributeRenderer, exports.TemplateControllerRenderer, exports.LetElementRenderer, exports.ListenerBindingRenderer, exports.AttributeBindingRenderer, exports.SetAttributeRenderer, exports.SetClassAttributeRenderer, exports.SetStyleAttributeRenderer, exports.StylePropertyBindingRenderer, exports.TextBindingRenderer, exports.SpreadRenderer ];

const bs = /*@__PURE__*/ createConfiguration(t.noop);

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
            return e.register(M(s.ICoercionConfiguration, i.coercingOptions), ...ds, ...gs, ...ps, ...xs, ...vs);
        },
        customize(e) {
            return createConfiguration(e ?? t);
        }
    };
}

function children(t, e) {
    if (!ks) {
        ks = true;
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
            throw new Error(`Invalid usage. @children can only be used on a field`);
        }
        const r = t.constructor;
        let l = ft.getAnnotation(r, n);
        if (l == null) {
            ft.annotate(r, n, l = []);
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
    static create(t, e, s, i, n = defaultChildQuery, r = defaultChildFilter, l = defaultChildMap, h = ws) {
        const a = new ChildrenBinding(t, e, i, n, r, l, h);
        S(e, s, {
            enumerable: true,
            configurable: true,
            get: y((() => a.getValue()), {
                getObserver: () => a
            }),
            set: () => {}
        });
        return a;
    }
    constructor(t, e, s, i = defaultChildQuery, n = defaultChildFilter, r = defaultChildMap, l = ws) {
        this.Si = void 0;
        this.ct = defaultChildQuery;
        this._i = defaultChildFilter;
        this.Ti = defaultChildMap;
        this.isBound = false;
        this.Z = t;
        this.cb = (this.obj = e)[s];
        this.ct = i;
        this._i = n;
        this.Ti = r;
        this.nt = l;
        this.Ge = createMutationObserver(this.Ii = t.host, (() => {
            this.Ei();
        }));
    }
    getValue() {
        return this.isBound ? this.Si : this.Li();
    }
    setValue(t) {}
    bind() {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        this.Ge.observe(this.Ii, this.nt);
        this.Si = this.Li();
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.Ge.disconnect();
        this.Si = t.emptyArray;
    }
    Ei() {
        this.Si = this.Li();
        this.cb?.call(this.obj);
        this.subs.notify(this.Si, undefined);
    }
    get() {
        throw notImplemented("get");
    }
    Li() {
        return filterChildren(this.Z, this.ct, this._i, this.Ti);
    }
}

const ws = {
    childList: true
};

const notImplemented = t => createError(`Method "${t}": not implemented`);

const defaultChildQuery = t => t.host.childNodes;

const defaultChildFilter = (t, e, s) => !!s;

const defaultChildMap = (t, e, s) => s;

const ys = {
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
        a = findElementControllerFor(h, ys);
        c = a?.viewModel ?? null;
        if (s(h, a, c)) {
            l.push(i(h, a, c));
        }
    }
    return l;
};

class ChildrenLifecycleHooks {
    constructor(t) {
        this.def = t;
    }
    register(t) {
        M(St, this).register(t);
    }
    hydrating(t, e) {
        const s = this.def;
        e.addBinding(ChildrenBinding.create(e, e.viewModel, s.name, s.callback ?? `${g(s.name)}Changed`, s.query ?? defaultChildQuery, s.filter ?? defaultChildFilter, s.map ?? defaultChildMap, s.options ?? ws));
    }
}

let ks = false;

exports.AdoptedStyleSheetsStyles = AdoptedStyleSheetsStyles;

exports.AppRoot = AppRoot;

exports.AppTask = j;

exports.AttrBindingBehavior = AttrBindingBehavior;

exports.AttrSyntax = AttrSyntax;

exports.AttributeBinding = AttributeBinding;

exports.AttributeBindingInstruction = AttributeBindingInstruction;

exports.AttributeNSAccessor = AttributeNSAccessor;

exports.AttributePattern = me;

exports.AuCompose = AuCompose;

exports.AuSlotsInfo = AuSlotsInfo;

exports.Aurelia = Aurelia;

exports.Bindable = T;

exports.BindableDefinition = BindableDefinition;

exports.BindablesInfo = BindablesInfo;

exports.BindingBehavior = q;

exports.BindingBehaviorDefinition = BindingBehaviorDefinition;

exports.BindingCommand = ve;

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

exports.CustomAttribute = it;

exports.CustomAttributeDefinition = CustomAttributeDefinition;

exports.CustomElement = ft;

exports.CustomElementDefinition = CustomElementDefinition;

exports.DataAttributeAccessor = DataAttributeAccessor;

exports.DebounceBindingBehavior = DebounceBindingBehavior;

exports.DefaultBindingLanguage = xs;

exports.DefaultBindingSyntax = ps;

exports.DefaultComponents = ds;

exports.DefaultRenderers = vs;

exports.DefaultResources = gs;

exports.Else = Else;

exports.ExpressionWatcher = ExpressionWatcher;

exports.FlushQueue = FlushQueue;

exports.Focus = Focus;

exports.FragmentNodeSequence = FragmentNodeSequence;

exports.FromViewBindingBehavior = FromViewBindingBehavior;

exports.HooksDefinition = HooksDefinition;

exports.HydrateAttributeInstruction = HydrateAttributeInstruction;

exports.HydrateElementInstruction = HydrateElementInstruction;

exports.HydrateLetElementInstruction = HydrateLetElementInstruction;

exports.HydrateTemplateController = HydrateTemplateController;

exports.IAppRoot = he;

exports.IAppTask = N;

exports.IAttrMapper = ke;

exports.IAttributeParser = fe;

exports.IAttributePattern = ue;

exports.IAuSlotWatcher = Ut;

exports.IAuSlotsInfo = qt;

exports.IAurelia = ae;

exports.IController = ie;

exports.IEventTarget = K;

exports.IFlushQueue = yt;

exports.IHistory = et;

exports.IHydrationContext = ne;

exports.IInstruction = Ht;

exports.ILifecycleHooks = St;

exports.ILocation = tt;

exports.INode = X;

exports.IPlatform = W;

exports.IRenderLocation = Q;

exports.IRenderer = Vt;

exports.IRendering = Qt;

exports.ISVGAnalyzer = ye;

exports.ISanitizer = je;

exports.IShadowDOMGlobalStyles = xt;

exports.IShadowDOMStyles = mt;

exports.ISyntaxInterpreter = ce;

exports.ITemplateCompiler = Ot;

exports.ITemplateCompilerHooks = os;

exports.ITemplateElementFactory = We;

exports.IViewFactory = $t;

exports.IWindow = J;

exports.If = If;

exports.InterpolationBinding = InterpolationBinding;

exports.InterpolationInstruction = InterpolationInstruction;

exports.InterpolationPartBinding = InterpolationPartBinding;

exports.Interpretation = Interpretation;

exports.IteratorBindingInstruction = IteratorBindingInstruction;

exports.LetBinding = LetBinding;

exports.LetBindingInstruction = LetBindingInstruction;

exports.LifecycleHooks = It;

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

exports.SelectValueObserver = SelectValueObserver;

exports.SelfBindingBehavior = SelfBindingBehavior;

exports.SetAttributeInstruction = SetAttributeInstruction;

exports.SetClassAttributeInstruction = SetClassAttributeInstruction;

exports.SetPropertyInstruction = SetPropertyInstruction;

exports.SetStyleAttributeInstruction = SetStyleAttributeInstruction;

exports.ShadowDOMRegistry = ShadowDOMRegistry;

exports.ShortHandBindingSyntax = ms;

exports.SignalBindingBehavior = SignalBindingBehavior;

exports.SpreadBindingInstruction = SpreadBindingInstruction;

exports.SpreadElementPropBindingInstruction = SpreadElementPropBindingInstruction;

exports.StandardConfiguration = bs;

exports.StyleAttributeAccessor = StyleAttributeAccessor;

exports.StyleConfiguration = gt;

exports.StyleElementStyles = StyleElementStyles;

exports.StylePropertyBindingInstruction = StylePropertyBindingInstruction;

exports.TemplateCompiler = TemplateCompiler;

exports.TemplateCompilerHooks = as;

exports.TextBindingInstruction = TextBindingInstruction;

exports.ThrottleBindingBehavior = ThrottleBindingBehavior;

exports.ToViewBindingBehavior = ToViewBindingBehavior;

exports.TwoWayBindingBehavior = TwoWayBindingBehavior;

exports.UpdateTriggerBindingBehavior = UpdateTriggerBindingBehavior;

exports.ValueAttributeObserver = ValueAttributeObserver;

exports.ValueConverter = bt;

exports.ValueConverterDefinition = ValueConverterDefinition;

exports.ViewFactory = ViewFactory;

exports.Watch = ot;

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

exports.strict = strict;

exports.templateCompilerHooks = templateCompilerHooks;

exports.templateController = templateController;

exports.useShadowDOM = useShadowDOM;

exports.valueConverter = valueConverter;

exports.watch = watch;
//# sourceMappingURL=index.cjs.map
