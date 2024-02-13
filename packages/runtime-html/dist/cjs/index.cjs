"use strict";

var t = require("@aurelia/kernel");

var e = require("@aurelia/metadata");

var s = require("@aurelia/runtime");

var i = require("@aurelia/platform-browser");

var n = require("@aurelia/platform");

function __decorate(t, e, s, i) {
    var n = arguments.length, r = n < 3 ? e : i === null ? i = Object.getOwnPropertyDescriptor(e, s) : i, l;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(t, e, s, i); else for (var a = t.length - 1; a >= 0; a--) if (l = t[a]) r = (n < 3 ? l(r) : n > 3 ? l(e, s, r) : l(e, s)) || r;
    return n > 3 && r && Object.defineProperty(e, s, r), r;
}

const r = Object;

const l = String;

const a = r.prototype;

const createLookup = () => r.create(null);

const createError$1 = t => new Error(t);

const h = a.hasOwnProperty;

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

const w = "IsProperty";

const y = "pending";

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
        let a;
        let h;
        let c;
        let u;
        while (--r >= 0) {
            c = n[r];
            a = N(c).filter(isBindableAnnotation);
            h = a.length;
            for (u = 0; u < h; ++u) {
                i[l++] = P($, c, a[u].slice(s));
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

function watch(t, e) {
    if (t == null) {
        throw createMappedError(772);
    }
    return function decorator(s, i, n) {
        const r = i == null;
        const a = r ? s : s.constructor;
        const h = new WatchDefinition(t, r ? e : n.value);
        if (r) {
            if (!isFunction(e) && (e == null || !(e in a.prototype))) {
                throw createMappedError(773, `${l(e)}@${a.name}}`);
            }
        } else if (!isFunction(n?.value)) {
            throw createMappedError(774, i);
        }
        at.add(a, h);
        if (isAttributeType(a)) {
            getAttributeDefinition(a).watches.push(h);
        }
        if (isElementType(a)) {
            getElementDefinition(a).watches.push(h);
        }
    };
}

class WatchDefinition {
    constructor(t, e) {
        this.expression = t;
        this.callback = e;
    }
}

const ot = t.emptyArray;

const lt = H("watch");

const at = c({
    name: lt,
    add(t, e) {
        let s = P(lt, t);
        if (s == null) {
            M(lt, s = [], t);
        }
        s.push(e);
    },
    getAnnotation(t) {
        return P(lt, t) ?? ot;
    }
});

const ht = "Element";

const ct = "Attribute";

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
        return ct;
    }
    constructor(t, e, s, i, n, r, l, a, h, c) {
        this.Type = t;
        this.name = e;
        this.aliases = s;
        this.key = i;
        this.defaultBindingMode = n;
        this.isTemplateController = r;
        this.bindables = l;
        this.noMultiBindings = a;
        this.watches = h;
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
        return new CustomAttributeDefinition(s, t.firstDefined(getAttributeAnnotation(s, "name"), i), t.mergeArrays(getAttributeAnnotation(s, "aliases"), n.aliases, s.aliases), getAttributeKeyFrom(i), t.firstDefined(getAttributeAnnotation(s, "defaultBindingMode"), n.defaultBindingMode, s.defaultBindingMode, _), t.firstDefined(getAttributeAnnotation(s, "isTemplateController"), n.isTemplateController, s.isTemplateController, false), W.from(s, ...W.getAll(s), getAttributeAnnotation(s, "bindables"), s.bindables, n.bindables), t.firstDefined(getAttributeAnnotation(s, "noMultiBindings"), n.noMultiBindings, s.noMultiBindings, false), t.mergeArrays(at.getAnnotation(s), s.watches), t.mergeArrays(getAttributeAnnotation(s, "dependencies"), n.dependencies, s.dependencies));
    }
    register(t) {
        const {Type: e, key: s, aliases: i} = this;
        X(s, e).register(t);
        G(s, e).register(t);
        registerAliases(i, ft, s, t);
    }
    toString() {
        return `au:ca:${this.name}`;
    }
}

const ut = F("custom-attribute");

const getAttributeKeyFrom = t => `${ut}:${t}`;

const getAttributeAnnotation = (t, e) => P(H(e), t);

const isAttributeType = t => isFunction(t) && L(ut, t);

const findAttributeControllerFor = (t, e) => getRef(t, getAttributeKeyFrom(e)) ?? void 0;

const defineAttribute = (t, e) => {
    const s = CustomAttributeDefinition.create(t, e);
    M(ut, s, s.Type);
    M(ut, s, s);
    O(e, ut);
    return s.Type;
};

const getAttributeDefinition = t => {
    const e = P(ut, t);
    if (e === void 0) {
        throw createMappedError(759, t);
    }
    return e;
};

const ft = c({
    name: ut,
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
                addListener(this.B, e, this);
            }
            this._ = true;
            this.R?.();
        }
    }));
    defineHiddenProp(s, "unsubscribe", (function(t) {
        if (this.subs.remove(t) && this.subs.count === 0) {
            for (e of this.cf.events) {
                removeListener(this.B, e, this);
            }
            this._ = false;
            this.T?.();
        }
    }));
    defineHiddenProp(s, "useConfig", (function(t) {
        this.cf = t;
        if (this._) {
            for (e of this.cf.events) {
                removeListener(this.B, e, this);
            }
            for (e of this.cf.events) {
                addListener(this.B, e, this);
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
        this.I = {};
        this.P = 0;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (t !== this.v) {
            this.v = t;
            this.L();
        }
    }
    L() {
        const t = this.I;
        const e = ++this.P;
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
                t[l] = this.P;
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
                this.M = new ClassAttributeAccessor(t);
            }
            binding() {
                this.valueChanged();
            }
            valueChanged() {
                this.M.setValue(this.value?.split(/\s+/g).map((t => s[t] || t)) ?? "");
            }
        }, e.inject = [ Xe ], e));
        t.register(i, K(Ze, s));
    }
}

function shadowCSS(...t) {
    return new ShadowDOMRegistry(t);
}

const dt = /*@__PURE__*/ z("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
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
        const e = t.get(mt);
        const s = t.get(dt);
        t.register(K(pt, s.createStyles(this.css, e)));
    }
}

class AdoptedStyleSheetsStylesFactory {
    constructor() {
        this.p = t.resolve(rt);
        this.cache = new Map;
    }
    createStyles(t, e) {
        return new AdoptedStyleSheetsStyles(this.p, t, this.cache, e);
    }
}

class StyleElementStylesFactory {
    constructor() {
        this.p = t.resolve(rt);
    }
    createStyles(t, e) {
        return new StyleElementStyles(this.p, t, e);
    }
}

const pt = /*@__PURE__*/ z("IShadowDOMStyles");

const mt = /*@__PURE__*/ z("IShadowDOMGlobalStyles", (e => e.instance({
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
        return nt.creating(t.IContainer, (t => {
            if (e.sharedStyles != null) {
                const s = t.get(dt);
                t.register(K(mt, s.createStyles(e.sharedStyles, null)));
            }
        }));
    }
};

function valueConverter(t) {
    return function(e) {
        return vt.define(t, e);
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
        return new ValueConverterDefinition(s, t.firstDefined(getConverterAnnotation(s, "name"), i), t.mergeArrays(getConverterAnnotation(s, "aliases"), n.aliases, s.aliases), vt.keyFrom(i));
    }
    register(e) {
        const {Type: s, key: i, aliases: n} = this;
        t.Registration.singleton(i, s).register(e);
        t.Registration.aliasTo(i, s).register(e);
        registerAliases(n, vt, i, e);
    }
}

const xt = F("value-converter");

const getConverterAnnotation = (t, e) => P(H(e), t);

const vt = c({
    name: xt,
    keyFrom: t => `${xt}:${t}`,
    isType(t) {
        return isFunction(t) && L(xt, t);
    },
    define(t, e) {
        const s = ValueConverterDefinition.create(t, e);
        M(xt, s, s.Type);
        M(xt, s, s);
        O(e, xt);
        return s.Type;
    },
    getDefinition(t) {
        const e = P(xt, t);
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
        this.q = e;
    }
    flush() {
        this.b.updateSource(this.v);
    }
    handleChange(t, e) {
        const i = this.b;
        if (t !== s.astEvaluate(i.ast, i.s, i, null)) {
            this.v = t;
            this.q.add(this);
        }
    }
}

const mixinUseScope = t => {
    defineHiddenProp(t.prototype, "useScope", useScope);
};

const mixinAstEvaluator = (t, e = true) => s => {
    const i = s.prototype;
    if (t != null) {
        g(i, "strict", {
            enumerable: true,
            get: function() {
                return t;
            }
        });
    }
    g(i, "strictFnCall", {
        enumerable: true,
        get: function() {
            return e;
        }
    });
    defineHiddenProp(i, "get", evaluatorGet);
    defineHiddenProp(i, "getSignaler", evaluatorGetSignaler);
    defineHiddenProp(i, "getConverter", evaluatorGetConverter);
    defineHiddenProp(i, "getBehavior", evaluatorGetBehavior);
};

const bt = new WeakMap;

class ResourceLookup {}

const wt = /*@__PURE__*/ z("IFlushQueue", (t => t.singleton(FlushQueue)));

class FlushQueue {
    constructor() {
        this.H = false;
        this.F = new Set;
    }
    get count() {
        return this.F.size;
    }
    add(t) {
        this.F.add(t);
        if (this.H) {
            return;
        }
        this.H = true;
        try {
            this.F.forEach(flushItem);
        } finally {
            this.H = false;
        }
    }
    clear() {
        this.F.clear();
        this.H = false;
    }
}

function useScope(t) {
    this.s = t;
}

function evaluatorGet(t) {
    return this.l.get(t);
}

function evaluatorGetSignaler() {
    return this.l.root.get(s.ISignaler);
}

function evaluatorGetConverter(t) {
    const e = vt.keyFrom(t);
    let s = bt.get(this);
    if (s == null) {
        bt.set(this, s = new ResourceLookup);
    }
    return s[e] ?? (s[e] = this.l.get(resource(e)));
}

function evaluatorGetBehavior(t) {
    const e = Y.keyFrom(t);
    let s = bt.get(this);
    if (s == null) {
        bt.set(this, s = new ResourceLookup);
    }
    return s[e] ?? (s[e] = this.l.get(resource(e)));
}

function flushItem(t, e, s) {
    s.delete(t);
    t.flush();
}

const yt = new WeakSet;

const mixingBindingLimited = (t, e) => {
    defineHiddenProp(t.prototype, "limit", (function(t) {
        if (yt.has(this)) {
            throw createMappedError(9996);
        }
        yt.add(this);
        const i = e(this, t);
        const n = t.signals;
        const r = n.length > 0 ? this.get(s.ISignaler) : null;
        const l = this[i];
        const callOriginal = (...t) => l.call(this, ...t);
        const a = t.type === "debounce" ? debounced(t, callOriginal, this) : throttled(t, callOriginal, this);
        const h = r ? {
            handleChange: a.flush
        } : null;
        this[i] = a;
        if (r) {
            n.forEach((t => addSignalListener(r, t, h)));
        }
        return {
            dispose: () => {
                if (r) {
                    n.forEach((t => removeSignalListener(r, t, h)));
                }
                yt.delete(this);
                a.dispose();
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
    const a = t.queue;
    const callOriginalCallback = () => e(r);
    const fn = e => {
        r = e;
        if (s.isBound) {
            n = i;
            i = a.queueTask(callOriginalCallback, {
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
        i?.cancel();
        n = i = void 0;
    };
    fn.flush = () => {
        l = i?.status === y;
        h();
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
    let a;
    let h = false;
    const c = t.queue;
    const now = () => t.now();
    const callOriginalCallback = () => e(a);
    const fn = e => {
        a = e;
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
        h = i?.status === y;
        u();
        if (h) {
            callOriginalCallback();
        }
    };
    return fn;
};

const {enter: kt, exit: Ct} = s.ConnectableSwitcher;

const {wrap: At, unwrap: Bt} = s.ProxyObservable;

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
            kt(this);
            return this.v = Bt(this.$get.call(void 0, this.useProxy ? At(this.obj) : this.obj, this));
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
        this.O = i;
        this.cb = n;
    }
    handleChange(t) {
        const e = this.O;
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
        this.v = s.astEvaluate(this.O, this.scope, this, this);
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

const St = /*@__PURE__*/ z("ILifecycleHooks");

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
        while (i !== a) {
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
        U(St, this.Type).register(t);
    }
}

const _t = new WeakMap;

const Rt = H("lifecycle-hooks");

const Tt = c({
    name: Rt,
    define(t, e) {
        const s = LifecycleHooksDefinition.create(t, e);
        M(Rt, s, e);
        O(e, Rt);
        return s.Type;
    },
    resolve(t) {
        let e = _t.get(t);
        if (e === void 0) {
            _t.set(t, e = new LifecycleHooksLookupImpl);
            const s = t.root;
            const i = s.id === t.id ? t.getAll(St) : t.has(St, false) ? s.getAll(St).concat(t.getAll(St)) : s.getAll(St);
            let n;
            let r;
            let l;
            let a;
            let h;
            for (n of i) {
                r = P(Rt, n.constructor);
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
        return Tt.define({}, t);
    };
}

const It = {
    reusable: false,
    preempt: true
};

class AttributeBinding {
    constructor(t, e, s, i, n, r, l, a, h) {
        this.targetAttribute = l;
        this.targetProperty = a;
        this.mode = h;
        this.isBound = false;
        this.s = void 0;
        this.V = null;
        this.v = void 0;
        this.boundFn = false;
        this.l = e;
        this.ast = n;
        this.N = t;
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
            const s = this.N.state !== He;
            if (s) {
                t = this.V;
                this.V = this.A.queueTask((() => {
                    this.V = null;
                    this.updateTarget(e);
                }), It);
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
        this.V?.cancel();
        this.V = null;
        this.obs.clearAll();
    }
}

mixinUseScope(AttributeBinding);

mixingBindingLimited(AttributeBinding, (() => "updateTarget"));

s.connectable(AttributeBinding);

mixinAstEvaluator(true)(AttributeBinding);

const Et = {
    reusable: false,
    preempt: true
};

class InterpolationBinding {
    constructor(t, e, s, i, n, r, l, a) {
        this.ast = n;
        this.target = r;
        this.targetProperty = l;
        this.mode = a;
        this.isBound = false;
        this.s = void 0;
        this.V = null;
        this.N = t;
        this.oL = s;
        this.A = i;
        this.$ = s.getAccessor(r, l);
        const h = n.expressions;
        const c = this.partBindings = Array(h.length);
        const u = h.length;
        let f = 0;
        for (;u > f; ++f) {
            c[f] = new InterpolationPartBinding(h[f], r, l, e, s, this);
        }
    }
    W() {
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
        const r = this.$;
        const l = this.N.state !== He && (r.type & B) > 0;
        let a;
        if (l) {
            a = this.V;
            this.V = this.A.queueTask((() => {
                this.V = null;
                r.setValue(i, this.target, this.targetProperty);
            }), Et);
            a?.cancel();
            a = null;
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
        this.V?.cancel();
        this.V = null;
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
        this.owner.W();
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

const Pt = {
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
        this.V = null;
        this.v = "";
        this.j = false;
        this.boundFn = false;
        this.strict = true;
        this.l = e;
        this.N = t;
        this.oL = s;
        this.A = i;
    }
    updateTarget(t) {
        const e = this.target;
        const s = this.v;
        this.v = t;
        if (this.j) {
            s.parentNode?.removeChild(s);
            this.j = false;
        }
        if (t instanceof this.p.Node) {
            e.parentNode?.insertBefore(t, e);
            t = "";
            this.j = true;
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
            this.V?.cancel();
            this.V = null;
            return;
        }
        const e = this.N.state !== He;
        if (e) {
            this.U(t);
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
        const e = this.N.state !== He;
        if (e) {
            this.U(t);
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
        if (this.j) {
            this.v.parentNode?.removeChild(this.v);
        }
        this.s = void 0;
        this.obs.clearAll();
        this.V?.cancel();
        this.V = null;
    }
    U(t) {
        const e = this.V;
        this.V = this.A.queueTask((() => {
            this.V = null;
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
        this.G = n;
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
        this.target = this.G ? t.bindingContext : t.overrideContext;
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
    constructor(t, e, s, i, n, r, l, a) {
        this.ast = n;
        this.target = r;
        this.targetProperty = l;
        this.mode = a;
        this.isBound = false;
        this.s = void 0;
        this.$ = void 0;
        this.V = null;
        this.K = null;
        this.boundFn = false;
        this.l = e;
        this.N = t;
        this.A = i;
        this.oL = s;
    }
    updateTarget(t) {
        this.$.setValue(t, this.target, this.targetProperty);
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
        const e = this.N.state !== He && (this.$.type & B) > 0;
        if (e) {
            Lt = this.V;
            this.V = this.A.queueTask((() => {
                this.updateTarget(t);
                this.V = null;
            }), Mt);
            Lt?.cancel();
            Lt = null;
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
        let n = this.$;
        if (!n) {
            if (i & R) {
                n = e.getObserver(this.target, this.targetProperty);
            } else {
                n = e.getAccessor(this.target, this.targetProperty);
            }
            this.$ = n;
        }
        const r = (i & _) > 0;
        if (i & (_ | S)) {
            this.updateTarget(s.astEvaluate(this.ast, this.s, this, r ? this : null));
        }
        if (i & R) {
            n.subscribe(this.K ?? (this.K = new BindingTargetSubscriber(this, this.l.get(wt))));
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
        if (this.K) {
            this.$.unsubscribe(this.K);
            this.K = null;
        }
        this.V?.cancel();
        this.V = null;
        this.obs.clearAll();
    }
    useTargetObserver(t) {
        this.$?.unsubscribe(this);
        (this.$ = t).subscribe(this);
    }
    useTargetSubscriber(t) {
        if (this.K != null) {
            throw createMappedError(9995);
        }
        this.K = t;
    }
}

mixinUseScope(PropertyBinding);

mixingBindingLimited(PropertyBinding, (t => t.mode & R ? "updateSource" : "updateTarget"));

s.connectable(PropertyBinding);

mixinAstEvaluator(true, false)(PropertyBinding);

let Lt = null;

const Mt = {
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
        this.X = null;
        this.l = t;
        this.Y = n;
        this.X = r;
    }
    callSource(t) {
        const e = this.s.overrideContext;
        e.$event = t;
        let i = s.astEvaluate(this.ast, this.s, this, null);
        delete e.$event;
        if (isFunction(i)) {
            i = i(t);
        }
        if (i !== true && this.Y.prevent) {
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
        if (this.X?.(t) !== false) {
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
        this.target.addEventListener(this.targetEvent, this, this.Y);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        s.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.target.removeEventListener(this.targetEvent, this, this.Y);
    }
}

mixinUseScope(ListenerBinding);

mixingBindingLimited(ListenerBinding, (() => "callSource"));

mixinAstEvaluator(true, true)(ListenerBinding);

const Dt = /*@__PURE__*/ z("IEventModifier");

const qt = /*@__PURE__*/ z("IKeyMapping", (t => t.instance({
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
        this.Z = t.resolve(qt);
        this.J = [ "left", "middle", "right" ];
    }
    static register(t) {
        t.register(U(Dt, ModifiedMouseEventHandler));
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
                    if (t.button !== this.J.indexOf(n)) return false;
                    continue;
                }
                if (this.Z.meta.includes(n) && t[`${n}Key`] !== true) {
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
        this.Z = t.resolve(qt);
        this.type = [ "keydown", "keyup" ];
    }
    static register(t) {
        t.register(U(Dt, ModifiedKeyboardEventHandler));
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
                if (this.Z.meta.includes(n)) {
                    if (t[`${n}Key`] !== true) {
                        return false;
                    }
                    continue;
                }
                const e = this.Z.keys[n];
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

const Ht = /*@__PURE__*/ z("IEventModifierHandler", (t => t.instance({
    getHandler: () => null
})));

class EventModifier {
    constructor() {
        this.tt = t.resolve(t.all(Dt)).reduce(((t, e) => {
            const s = isArray(e.type) ? e.type : [ e.type ];
            s.forEach((s => t[s] = e));
            return t;
        }), {});
    }
    static register(t) {
        t.register(U(Ht, EventModifier));
    }
    getHandler(t, e) {
        return isString(e) ? this.tt[t]?.getHandler(e) ?? null : null;
    }
}

const Ft = {
    register(t) {
        t.register(EventModifier, ModifiedMouseEventHandler, ModifiedKeyboardEventHandler);
    }
};

const Ot = /*@__PURE__*/ z("IViewFactory");

class ViewFactory {
    constructor(t, e) {
        this.isCaching = false;
        this.et = null;
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
            this.et = [];
        } else {
            this.et = null;
        }
        this.isCaching = this.st > 0;
    }
    canReturnToCache(t) {
        return this.et != null && this.et.length < this.st;
    }
    tryReturnToCache(t) {
        if (this.canReturnToCache(t)) {
            this.et.push(t);
            return true;
        }
        return false;
    }
    create(t) {
        const e = this.et;
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

const Vt = "au-start";

const Nt = "au-end";

const createElement = (t, e) => t.document.createElement(e);

const createComment = (t, e) => t.document.createComment(e);

const createLocation = t => {
    const e = createComment(t, Nt);
    e.$start = createComment(t, Vt);
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

const $t = /*@__PURE__*/ z("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

const Wt = /*@__PURE__*/ z("IAuSlotWatcher");

class AuSlotWatcherBinding {
    constructor(e, s, i, n) {
        this.it = new Set;
        this.nt = t.emptyArray;
        this.isBound = false;
        this.cb = (this.o = e)[s];
        this.slotName = i;
        this.rt = n;
    }
    bind() {
        this.isBound = true;
    }
    unbind() {
        this.isBound = false;
    }
    getValue() {
        return this.nt;
    }
    watch(t) {
        if (!this.it.has(t)) {
            this.it.add(t);
            t.subscribe(this);
        }
    }
    unwatch(t) {
        if (this.it.delete(t)) {
            t.unsubscribe(this);
        }
    }
    handleSlotChange(t, e) {
        if (!this.isBound) {
            return;
        }
        const s = this.nt;
        const i = [];
        let n;
        let r;
        for (n of this.it) {
            for (r of n === t ? e : n.nodes) {
                if (this.rt === "*" || isElement(r) && r.matches(this.rt)) {
                    i[i.length] = r;
                }
            }
        }
        if (i.length !== s.length || i.some(((t, e) => t !== s[e]))) {
            this.nt = i;
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
        this.ot = t;
    }
    register(t) {
        K(St, this).register(t);
    }
    hydrating(t, e) {
        const s = this.ot;
        const i = new AuSlotWatcherBinding(t, s.callback ?? `${l(s.name)}Changed`, s.slotName ?? "default", s.query ?? "*");
        g(t, s.name, {
            enumerable: true,
            configurable: true,
            get: u((() => i.getValue()), {
                getObserver: () => i
            }),
            set: () => {}
        });
        K(Wt, i).register(e.container);
        e.addBinding(i);
    }
}

function slotted(t, e) {
    if (!jt) {
        jt = true;
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
        const a = s.constructor;
        let h = as.getAnnotation(a, i);
        if (h == null) {
            as.annotate(a, i, h = []);
        }
        h.push(new SlottedLifecycleHooks(l));
    }
    return decorator;
}

let jt = false;

class SpreadBinding {
    static create(e, s, i, n, r, l, a, h) {
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
                  case he:
                    renderSpreadInstruction(e + 1);
                    break;

                  case ce:
                    u[p.instructions.type].render(f, findElementControllerFor(s), p.instructions, l, a, h);
                    break;

                  default:
                    u[p.type].render(f, s, p, l, a, h);
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
        this.lt = t;
        this.isBound = false;
        this.ht = [];
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
        const e = this.scope = this.lt.controller.scope.parent ?? void 0;
        if (e == null) {
            throw createMappedError(9999);
        }
        this.ht.forEach((t => t.bind(e)));
    }
    unbind() {
        this.ht.forEach((t => t.unbind()));
        this.isBound = false;
    }
    addBinding(t) {
        this.ht.push(t);
    }
    addChild(t) {
        if (t.vmKind !== Me) {
            throw createMappedError(9998);
        }
        this.$controller.addChild(t);
    }
}

const zt = "ra";

const Ut = "rb";

const Gt = "rc";

const Kt = "rd";

const Xt = "re";

const Qt = "rf";

const Yt = "rg";

const Zt = "ri";

const Jt = "rj";

const te = "rk";

const ee = "rl";

const se = "ha";

const ie = "hb";

const ne = "hc";

const re = "hd";

const oe = "he";

const le = "hf";

const ae = "hg";

const he = "hs";

const ce = "hp";

const ue = /*@__PURE__*/ c({
    hydrateElement: zt,
    hydrateAttribute: Ut,
    hydrateTemplateController: Gt,
    hydrateLetElement: Kt,
    setProperty: Xt,
    interpolation: Qt,
    propertyBinding: Yt,
    letBinding: Zt,
    refBinding: Jt,
    iteratorBinding: te,
    multiAttr: ee,
    textBinding: se,
    listenerBinding: ie,
    attributeBinding: ne,
    stylePropertyBinding: re,
    setAttribute: oe,
    setClassAttribute: le,
    setStyleAttribute: ae,
    spreadBinding: he,
    spreadElementProp: ce
});

const fe = /*@__PURE__*/ z("Instruction");

function isInstruction(t) {
    const e = t.type;
    return isString(e) && e.length === 2;
}

class InterpolationInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Qt;
    }
}

class PropertyBindingInstruction {
    constructor(t, e, s) {
        this.from = t;
        this.to = e;
        this.mode = s;
        this.type = Yt;
    }
}

class IteratorBindingInstruction {
    constructor(t, e, s) {
        this.forOf = t;
        this.to = e;
        this.props = s;
        this.type = te;
    }
}

class RefBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Jt;
    }
}

class SetPropertyInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = Xt;
    }
}

class MultiAttrInstruction {
    constructor(t, e, s) {
        this.value = t;
        this.to = e;
        this.command = s;
        this.type = ee;
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
        this.type = zt;
        this.auSlot = null;
    }
}

class HydrateAttributeInstruction {
    constructor(t, e, s) {
        this.res = t;
        this.alias = e;
        this.props = s;
        this.type = Ut;
    }
}

class HydrateTemplateController {
    constructor(t, e, s, i) {
        this.def = t;
        this.res = e;
        this.alias = s;
        this.props = i;
        this.type = Gt;
    }
}

class HydrateLetElementInstruction {
    constructor(t, e) {
        this.instructions = t;
        this.toBindingContext = e;
        this.type = Kt;
    }
}

class LetBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Zt;
    }
}

class TextBindingInstruction {
    constructor(t) {
        this.from = t;
        this.type = se;
    }
}

class ListenerBindingInstruction {
    constructor(t, e, s, i, n) {
        this.from = t;
        this.to = e;
        this.preventDefault = s;
        this.capture = i;
        this.modifier = n;
        this.type = ie;
    }
}

class StylePropertyBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = re;
    }
}

class SetAttributeInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = oe;
    }
}

class SetClassAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = le;
    }
}

class SetStyleAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = ae;
    }
}

class AttributeBindingInstruction {
    constructor(t, e, s) {
        this.attr = t;
        this.from = e;
        this.to = s;
        this.type = ne;
    }
}

class SpreadBindingInstruction {
    constructor() {
        this.type = he;
    }
}

class SpreadElementPropBindingInstruction {
    constructor(t) {
        this.instructions = t;
        this.type = ce;
    }
}

const de = /*@__PURE__*/ z("ITemplateCompiler");

const pe = /*@__PURE__*/ z("IRenderer");

function renderer(t) {
    return function decorator(e) {
        e.register = function(t) {
            U(pe, this).register(t);
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

exports.SetPropertyRenderer = __decorate([ renderer(Xt) ], exports.SetPropertyRenderer);

exports.CustomElementRenderer = class CustomElementRenderer {
    constructor() {
        this.r = t.resolve(ke);
    }
    render(e, s, i, n, r, l) {
        let a;
        let h;
        let c;
        let u;
        const f = i.res;
        const p = i.projections;
        const m = e.container;
        switch (typeof f) {
          case "string":
            a = m.find(as, f);
            if (a == null) {
                throw createMappedError(752, i, e);
            }
            break;

          default:
            a = f;
        }
        const g = i.containerless || a.containerless;
        const x = g ? convertToRenderLocation(s) : null;
        const v = createElementContainer(n, e, s, i, x, p == null ? void 0 : new AuSlotsInfo(d(p)));
        h = a.Type;
        c = v.invoke(h);
        registerResolver(v, h, new t.InstanceProvider(a.key, c));
        u = Controller.$el(v, c, s, i, a, x);
        setRef(s, a.key, u);
        const b = this.r.renderers;
        const w = i.props;
        const y = w.length;
        let k = 0;
        let C;
        while (y > k) {
            C = w[k];
            b[C.type].render(e, u, C, n, r, l);
            ++k;
        }
        e.addChild(u);
    }
};

exports.CustomElementRenderer = __decorate([ renderer(zt) ], exports.CustomElementRenderer);

exports.CustomAttributeRenderer = class CustomAttributeRenderer {
    constructor() {
        this.r = t.resolve(ke);
    }
    render(t, e, s, i, n, r) {
        let l = t.container;
        let a;
        switch (typeof s.res) {
          case "string":
            a = l.find(ft, s.res);
            if (a == null) {
                throw createMappedError(753, s, t);
            }
            break;

          default:
            a = s.res;
        }
        const h = invokeAttribute(i, a, t, e, s, void 0, void 0);
        const c = Controller.$attr(h.ctn, h.vm, e, a);
        setRef(e, a.key, c);
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

exports.CustomAttributeRenderer = __decorate([ renderer(Ut) ], exports.CustomAttributeRenderer);

exports.TemplateControllerRenderer = class TemplateControllerRenderer {
    constructor() {
        this.r = t.resolve(ke);
    }
    render(t, e, s, i, n, r) {
        let l = t.container;
        let a;
        switch (typeof s.res) {
          case "string":
            a = l.find(ft, s.res);
            if (a == null) {
                throw createMappedError(754, s, t);
            }
            break;

          default:
            a = s.res;
        }
        const h = this.r.getViewFactory(s.def, l);
        const c = convertToRenderLocation(e);
        const u = invokeAttribute(i, a, t, e, s, h, c);
        const f = Controller.$attr(u.ctn, u.vm, e, a);
        setRef(c, a.key, f);
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

exports.TemplateControllerRenderer = __decorate([ renderer(Gt) ], exports.TemplateControllerRenderer);

exports.LetElementRenderer = class LetElementRenderer {
    render(t, e, s, i, n, r) {
        e.remove();
        const l = s.instructions;
        const a = s.toBindingContext;
        const h = t.container;
        const c = l.length;
        let u;
        let f;
        let d = 0;
        while (c > d) {
            u = l[d];
            f = ensureExpression(n, u.from, w);
            t.addBinding(new LetBinding(h, r, f, u.to, a));
            ++d;
        }
    }
};

exports.LetElementRenderer = __decorate([ renderer(Kt) ], exports.LetElementRenderer);

exports.RefBindingRenderer = class RefBindingRenderer {
    render(t, e, s, i, n) {
        t.addBinding(new RefBinding(t.container, ensureExpression(n, s.from, w), getRefTarget(e, s.to)));
    }
};

exports.RefBindingRenderer = __decorate([ renderer(Jt) ], exports.RefBindingRenderer);

exports.InterpolationBindingRenderer = class InterpolationBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new InterpolationBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, x), getTarget(e), s.to, _));
    }
};

exports.InterpolationBindingRenderer = __decorate([ renderer(Qt) ], exports.InterpolationBindingRenderer);

exports.PropertyBindingRenderer = class PropertyBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, w), getTarget(e), s.to, s.mode));
    }
};

exports.PropertyBindingRenderer = __decorate([ renderer(Yt) ], exports.PropertyBindingRenderer);

exports.IteratorBindingRenderer = class IteratorBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.forOf, v), getTarget(e), s.to, _));
    }
};

exports.IteratorBindingRenderer = __decorate([ renderer(te) ], exports.IteratorBindingRenderer);

exports.TextBindingRenderer = class TextBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, i.domWriteQueue, i, ensureExpression(n, s.from, w), e));
    }
};

exports.TextBindingRenderer = __decorate([ renderer(se) ], exports.TextBindingRenderer);

exports.ListenerBindingRenderer = class ListenerBindingRenderer {
    constructor() {
        this.ct = t.resolve(Ht);
    }
    render(t, e, s, i, n) {
        t.addBinding(new ListenerBinding(t.container, ensureExpression(n, s.from, b), e, s.to, new ListenerBindingOptions(s.preventDefault, s.capture), this.ct.getHandler(s.to, s.modifier)));
    }
};

exports.ListenerBindingRenderer = __decorate([ renderer(ie) ], exports.ListenerBindingRenderer);

exports.SetAttributeRenderer = class SetAttributeRenderer {
    render(t, e, s) {
        e.setAttribute(s.to, s.value);
    }
};

exports.SetAttributeRenderer = __decorate([ renderer(oe) ], exports.SetAttributeRenderer);

exports.SetClassAttributeRenderer = class SetClassAttributeRenderer {
    render(t, e, s) {
        addClasses(e.classList, s.value);
    }
};

exports.SetClassAttributeRenderer = __decorate([ renderer(le) ], exports.SetClassAttributeRenderer);

exports.SetStyleAttributeRenderer = class SetStyleAttributeRenderer {
    render(t, e, s) {
        e.style.cssText += s.value;
    }
};

exports.SetStyleAttributeRenderer = __decorate([ renderer(ae) ], exports.SetStyleAttributeRenderer);

exports.StylePropertyBindingRenderer = class StylePropertyBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, w), e.style, s.to, _));
    }
};

exports.StylePropertyBindingRenderer = __decorate([ renderer(re) ], exports.StylePropertyBindingRenderer);

exports.AttributeBindingRenderer = class AttributeBindingRenderer {
    render(t, e, s, i, n, r) {
        const l = t.container;
        const a = l.has(Ze, false) ? l.get(Ze) : null;
        t.addBinding(new AttributeBinding(t, l, r, i.domWriteQueue, ensureExpression(n, s.from, w), e, s.attr, a == null ? s.to : s.to.split(/\s/g).map((t => a[t] ?? t)).join(" "), _));
    }
};

exports.AttributeBindingRenderer = __decorate([ renderer(ne) ], exports.AttributeBindingRenderer);

exports.SpreadRenderer = class SpreadRenderer {
    constructor() {
        this.ut = t.resolve(de);
        this.r = t.resolve(ke);
    }
    render(t, e, s, i, n, r) {
        SpreadBinding.create(t.container.get(ze), e, void 0, this.r, this.ut, i, n, r).forEach((e => t.addBinding(e)));
    }
};

exports.SpreadRenderer = __decorate([ renderer(he) ], exports.SpreadRenderer);

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

const me = "IController";

const ge = "IInstruction";

const xe = "IRenderLocation";

const ve = "ISlotsInfo";

function createElementContainer(e, s, i, n, r, l) {
    const a = s.container.createChild();
    registerHostNode(a, e, i);
    registerResolver(a, je, new t.InstanceProvider(me, s));
    registerResolver(a, fe, new t.InstanceProvider(ge, n));
    registerResolver(a, Ye, r == null ? be : new RenderLocationProvider(r));
    registerResolver(a, Ot, we);
    registerResolver(a, $t, l == null ? ye : new t.InstanceProvider(ve, l));
    return a;
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

function invokeAttribute(e, s, i, n, r, l, a, h) {
    const c = i instanceof Controller ? i : i.$controller;
    const u = c.container.createChild();
    registerHostNode(u, e, n);
    registerResolver(u, je, new t.InstanceProvider(me, c));
    registerResolver(u, fe, new t.InstanceProvider(ge, r));
    registerResolver(u, Ye, a == null ? be : new t.InstanceProvider(xe, a));
    registerResolver(u, Ot, l == null ? we : new ViewFactoryProvider(l));
    registerResolver(u, $t, h == null ? ye : new t.InstanceProvider(ve, h));
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

const be = new RenderLocationProvider(null);

const we = new ViewFactoryProvider(null);

const ye = new t.InstanceProvider(ve, new AuSlotsInfo(t.emptyArray));

const ke = /*@__PURE__*/ z("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.ft ?? (this.ft = this.dt.getAll(pe, false).reduce(((t, e) => {
            t[e.target] = e;
            return t;
        }), createLookup()));
    }
    constructor() {
        this.gt = new WeakMap;
        this.xt = new WeakMap;
        const e = this.dt = t.resolve(t.IContainer).root;
        this.p = e.get(rt);
        this.ep = e.get(s.IExpressionParser);
        this.oL = e.get(s.IObserverLocator);
        this.vt = new FragmentNodeSequence(this.p, this.p.document.createDocumentFragment());
    }
    compile(t, e, s) {
        if (t.needsCompile !== false) {
            const i = this.gt;
            const n = e.get(de);
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
        const i = this.xt;
        const n = this.p;
        const r = n.document;
        if (i.has(t)) {
            e = i.get(t);
        } else {
            const l = t.template;
            let a;
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
                a = r.createElement("template");
                if (isString(l)) {
                    a.innerHTML = l;
                }
                e = a.content;
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
        if (i != null) {
            u = s.surrogates;
            if ((c = u.length) > 0) {
                h = 0;
                while (c > h) {
                    f = u[h];
                    r[f.type].render(t, i, f, this.p, this.ep, this.oL);
                    ++h;
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

class Controller {
    get lifecycleHooks() {
        return this.yt;
    }
    get isActive() {
        return (this.state & (He | Fe)) > 0 && (this.state & Oe) === 0;
    }
    get name() {
        if (this.parent === null) {
            switch (this.vmKind) {
              case Me:
                return `[${this.definition.name}]`;

              case Le:
                return this.definition.name;

              case De:
                return this.viewFactory.name;
            }
        }
        switch (this.vmKind) {
          case Me:
            return `${this.parent.name}>[${this.definition.name}]`;

          case Le:
            return `${this.parent.name}>${this.definition.name}`;

          case De:
            return this.viewFactory.name === this.parent.definition?.name ? `${this.parent.name}[view]` : `${this.parent.name}[view:${this.viewFactory.name}]`;
        }
    }
    get viewModel() {
        return this.kt;
    }
    set viewModel(t) {
        this.kt = t;
        this.Ct = t == null || this.vmKind === De ? HooksDefinition.none : new HooksDefinition(t);
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
        this.mountTarget = Ae;
        this.shadowRoot = null;
        this.nodes = null;
        this.location = null;
        this.yt = null;
        this.state = qe;
        this.Bt = false;
        this.$initiator = null;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this.St = 0;
        this._t = 0;
        this.Rt = 0;
        this.kt = n;
        this.Ct = e === De ? HooksDefinition.none : new HooksDefinition(n);
        this.location = l;
        this.r = t.root.get(ke);
        this.coercion = e === De ? void 0 : t.get(Ie);
    }
    static getCached(t) {
        return Ce.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (e === void 0) {
            throw createMappedError(500, t);
        }
        return e;
    }
    static $el(e, s, i, n, r = void 0, l = null) {
        if (Ce.has(s)) {
            return Ce.get(s);
        }
        r = r ?? getElementDefinition(s.constructor);
        const a = new Controller(e, Le, r, null, s, i, l);
        const h = e.get(t.optional(ze));
        if (r.dependencies.length > 0) {
            e.register(...r.dependencies);
        }
        registerResolver(e, ze, new t.InstanceProvider("IHydrationContext", new HydrationContext(a, n, h)));
        Ce.set(s, a);
        if (n == null || n.hydrate !== false) {
            a.hE(n, h);
        }
        return a;
    }
    static $attr(t, e, s, i) {
        if (Ce.has(e)) {
            return Ce.get(e);
        }
        i = i ?? getAttributeDefinition(e.constructor);
        const n = new Controller(t, Me, i, null, e, s, null);
        if (i.dependencies.length > 0) {
            t.register(...i.dependencies);
        }
        Ce.set(e, n);
        n.Tt();
        return n;
    }
    static $view(t, e = void 0) {
        const s = new Controller(t.container, De, null, t, null, null, null);
        s.parent = e ?? null;
        s.It();
        return s;
    }
    hE(e, i) {
        const n = this.container;
        const r = this.kt;
        const l = this.definition;
        this.scope = s.Scope.create(r, null, true);
        if (l.watches.length > 0) {
            createWatchers(this, n, l, r);
        }
        createObservers(this, l, r);
        this.yt = Tt.resolve(n);
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
        if (this.Ct.Et) {
            this.kt.hydrating(this);
        }
        const e = this.Pt = this.r.compile(this.definition, this.container, t);
        const {shadowOptions: s, hasSlots: i, containerless: n} = e;
        let r = this.location;
        if ((this.hostController = findElementControllerFor(this.host, Te)) !== null) {
            this.host = this.container.root.get(rt).document.createElement(this.definition.name);
            if (n && r == null) {
                r = this.location = convertToRenderLocation(this.host);
            }
        }
        setRef(this.host, rs, this);
        setRef(this.host, this.definition.key, this);
        if (s !== null || i) {
            if (r != null) {
                throw createMappedError(501);
            }
            setRef(this.shadowRoot = this.host.attachShadow(s ?? Pe), rs, this);
            setRef(this.shadowRoot, this.definition.key, this);
            this.mountTarget = Se;
        } else if (r != null) {
            setRef(r, rs, this);
            setRef(r, this.definition.key, this);
            this.mountTarget = _e;
        } else {
            this.mountTarget = Be;
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
        this.yt = Tt.resolve(this.container);
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
    activate(e, s, i) {
        switch (this.state) {
          case qe:
          case Ve:
            if (!(s === null || s.isActive)) {
                return;
            }
            this.state = He;
            break;

          case Fe:
            return;

          case $e:
            throw createMappedError(502, this.name);

          default:
            throw createMappedError(503, this.name, stringifyState(this.state));
        }
        this.parent = s;
        switch (this.vmKind) {
          case Le:
            this.scope.parent = i ?? null;
            break;

          case Me:
            this.scope = i ?? null;
            break;

          case De:
            if (i === void 0 || i === null) {
                throw createMappedError(504, this.name);
            }
            if (!this.hasLockedScope) {
                this.scope = i;
            }
            break;
        }
        this.$initiator = e;
        this.Dt();
        let n = void 0;
        if (this.vmKind !== De && this.yt.binding != null) {
            n = t.onResolveAll(...this.yt.binding.map(callBindingHook, this));
        }
        if (this.Ct.qt) {
            n = t.onResolveAll(n, this.kt.binding(this.$initiator, this.parent));
        }
        if (isPromise(n)) {
            this.Ht();
            n.then((() => {
                this.At = true;
                if (this.state !== He) {
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
        if (this.vmKind !== De && this.yt.bound != null) {
            i = t.onResolveAll(...this.yt.bound.map(callBoundHook, this));
        }
        if (this.Ct.Vt) {
            i = t.onResolveAll(i, this.kt.bound(this.$initiator, this.parent));
        }
        if (isPromise(i)) {
            this.Ht();
            i.then((() => {
                this.isBound = true;
                if (this.state !== He) {
                    this.Ft();
                } else {
                    this.Nt();
                }
            })).catch((t => {
                this.Ot(t);
            }));
            return;
        }
        this.isBound = true;
        this.Nt();
    }
    $t(...t) {
        switch (this.mountTarget) {
          case Be:
            this.host.append(...t);
            break;

          case Se:
            this.shadowRoot.append(...t);
            break;

          case _e:
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
              case Be:
              case Se:
                this.hostController.$t(this.host);
                break;

              case _e:
                this.hostController.$t(this.location.$start, this.location);
                break;
            }
        }
        switch (this.mountTarget) {
          case Be:
            this.nodes.appendTo(this.host, this.definition != null && this.definition.enhance);
            break;

          case Se:
            {
                const t = this.container;
                const e = t.has(pt, false) ? t.get(pt) : t.get(mt);
                e.applyTo(this.shadowRoot);
                this.nodes.appendTo(this.shadowRoot);
                break;
            }

          case _e:
            this.nodes.insertBefore(this.location);
            break;
        }
        let e = 0;
        let s = void 0;
        if (this.vmKind !== De && this.yt.attaching != null) {
            s = t.onResolveAll(...this.yt.attaching.map(callAttachingHook, this));
        }
        if (this.Ct.Wt) {
            s = t.onResolveAll(s, this.kt.attaching(this.$initiator, this.parent));
        }
        if (isPromise(s)) {
            this.Ht();
            this.Dt();
            s.then((() => {
                this.Ft();
            })).catch((t => {
                this.Ot(t);
            }));
        }
        if (this.children !== null) {
            for (;e < this.children.length; ++e) {
                void this.children[e].activate(this.$initiator, this, this.scope);
            }
        }
        this.Ft();
    }
    deactivate(e, s) {
        let i = void 0;
        switch (this.state & ~Ne) {
          case Fe:
            this.state = Oe;
            break;

          case He:
            this.state = Oe;
            i = this.$promise?.catch(t.noop);
            break;

          case qe:
          case Ve:
          case $e:
          case Ve | $e:
            return;

          default:
            throw createMappedError(505, this.name, this.state);
        }
        this.$initiator = e;
        if (e === this) {
            this.jt();
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
                if (this.vmKind !== De && this.yt.detaching != null) {
                    r = t.onResolveAll(...this.yt.detaching.map(callDetachingHook, this));
                }
                if (this.Ct.zt) {
                    r = t.onResolveAll(r, this.kt.detaching(this.$initiator, this.parent));
                }
            }
            if (isPromise(r)) {
                this.Ht();
                e.jt();
                r.then((() => {
                    e.Ut();
                })).catch((t => {
                    e.Ot(t);
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
        }));
    }
    removeNodes() {
        switch (this.vmKind) {
          case Le:
          case De:
            this.nodes.remove();
            this.nodes.unlink();
        }
        if (this.hostController !== null) {
            switch (this.mountTarget) {
              case Be:
              case Se:
                this.host.remove();
                break;

              case _e:
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
          case Me:
            this.scope = null;
            break;

          case De:
            if (!this.hasLockedScope) {
                this.scope = null;
            }
            if ((this.state & Ne) === Ne && !this.viewFactory.tryReturnToCache(this) && this.$initiator === this) {
                this.dispose();
            }
            break;

          case Le:
            this.scope.parent = null;
            break;
        }
        this.state = Ve;
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
            Ue = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            Ue();
            Ue = void 0;
        }
    }
    Ot(t) {
        if (this.$promise !== void 0) {
            Ge = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            Ge(t);
            Ge = void 0;
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
        if (this.state !== He) {
            --this.St;
            this.Gt();
            if (this.$initiator !== this) {
                this.parent.Ft();
            }
            return;
        }
        if (--this.St === 0) {
            if (this.vmKind !== De && this.yt.attached != null) {
                Ke = t.onResolveAll(...this.yt.attached.map(callAttachedHook, this));
            }
            if (this.Ct.Kt) {
                Ke = t.onResolveAll(Ke, this.kt.attached(this.$initiator));
            }
            if (isPromise(Ke)) {
                this.Ht();
                Ke.then((() => {
                    this.state = Fe;
                    this.Gt();
                    if (this.$initiator !== this) {
                        this.parent.Ft();
                    }
                })).catch((t => {
                    this.Ot(t);
                }));
                Ke = void 0;
                return;
            }
            Ke = void 0;
            this.state = Fe;
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
                    if (e.vmKind !== De && e.yt.unbinding != null) {
                        s = t.onResolveAll(...e.yt.unbinding.map(callUnbindingHook, e));
                    }
                    if (e.Ct.Qt) {
                        if (e.debug) {
                            e.logger.trace("unbinding()");
                        }
                        s = t.onResolveAll(s, e.viewModel.unbinding(e.$initiator, e.parent));
                    }
                }
                if (isPromise(s)) {
                    this.Ht();
                    this.Xt();
                    s.then((() => {
                        this.Yt();
                    })).catch((t => {
                        this.Ot(t);
                    }));
                }
                s = void 0;
                e = e.next;
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
          case Me:
            {
                return getAttributeDefinition(this.kt.constructor).name === t;
            }

          case Le:
            {
                return getElementDefinition(this.kt.constructor).name === t;
            }

          case De:
            return this.viewFactory.name === t;
        }
    }
    lockScope(t) {
        this.scope = t;
        this.hasLockedScope = true;
    }
    setHost(t) {
        if (this.vmKind === Le) {
            setRef(t, rs, this);
            setRef(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = Be;
        return this;
    }
    setShadowRoot(t) {
        if (this.vmKind === Le) {
            setRef(t, rs, this);
            setRef(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = Se;
        return this;
    }
    setLocation(t) {
        if (this.vmKind === Le) {
            setRef(t, rs, this);
            setRef(t, this.definition.key, this);
        }
        this.location = t;
        this.mountTarget = _e;
        return this;
    }
    release() {
        this.state |= Ne;
    }
    dispose() {
        if ((this.state & $e) === $e) {
            return;
        }
        this.state |= $e;
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
            Ce.delete(this.kt);
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
            for (let s = 0, i = e.length; s < i; ++s) {
                if (e[s].accept(t) === true) {
                    return true;
                }
            }
        }
    }
}

const Ce = new WeakMap;

const Ae = 0;

const Be = 1;

const Se = 2;

const _e = 3;

const Re = c({
    none: Ae,
    host: Be,
    shadowRoot: Se,
    location: _e
});

const Te = {
    optional: true
};

const Ie = optionalResource(s.ICoercionConfiguration);

function createObservers(e, i, n) {
    const r = i.bindables;
    const l = f(r);
    const a = l.length;
    const h = e.container.get(s.IObserverLocator);
    if (a > 0) {
        for (let s = 0; s < a; ++s) {
            const i = l[s];
            const a = r[i];
            const c = a.callback;
            const u = h.getObserver(n, i);
            if (a.set !== t.noop) {
                if (u.useCoercer?.(a.set, e.coercion) !== true) {
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

const Ee = new Map;

const getAccessScopeAst = t => {
    let e = Ee.get(t);
    if (e == null) {
        e = new s.AccessScopeExpression(t, 0);
        Ee.set(t, e);
    }
    return e;
};

function createWatchers(t, e, i, n) {
    const r = e.get(s.IObserverLocator);
    const l = e.get(s.IExpressionParser);
    const a = i.watches;
    const h = t.vmKind === Le ? t.scope : s.Scope.create(n, null, true);
    const c = a.length;
    let u;
    let f;
    let d;
    let p = 0;
    for (;c > p; ++p) {
        ({expression: u, callback: f} = a[p]);
        f = isFunction(f) ? f : Reflect.get(n, f);
        if (!isFunction(f)) {
            throw createMappedError(506, f);
        }
        if (isFunction(u)) {
            t.addBinding(new ComputedWatcher(n, r, u, f, true));
        } else {
            d = isString(u) ? l.parse(u, w) : getAccessScopeAst(u);
            t.addBinding(new ExpressionWatcher(h, e, r, d, f));
        }
    }
}

function isCustomElementController(t) {
    return t instanceof Controller && t.vmKind === Le;
}

function isCustomElementViewModel(t) {
    return e.isObject(t) && isElementType(t.constructor);
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

const Pe = {
    mode: "open"
};

const Le = "customElement";

const Me = "customAttribute";

const De = "synthetic";

const qe = 0;

const He = 1;

const Fe = 2;

const Oe = 4;

const Ve = 8;

const Ne = 16;

const $e = 32;

const We = /*@__PURE__*/ c({
    none: qe,
    activating: He,
    activated: Fe,
    deactivating: Oe,
    deactivated: Ve,
    released: Ne,
    disposed: $e
});

function stringifyState(t) {
    const e = [];
    if ((t & He) === He) {
        e.push("activating");
    }
    if ((t & Fe) === Fe) {
        e.push("activated");
    }
    if ((t & Oe) === Oe) {
        e.push("deactivating");
    }
    if ((t & Ve) === Ve) {
        e.push("deactivated");
    }
    if ((t & Ne) === Ne) {
        e.push("released");
    }
    if ((t & $e) === $e) {
        e.push("disposed");
    }
    return e.length === 0 ? "none" : e.join("|");
}

const je = /*@__PURE__*/ z("IController");

const ze = /*@__PURE__*/ z("IHydrationContext");

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

let Ue;

let Ge;

let Ke;

class Refs {}

function getRef(t, e) {
    return t.$au?.[e] ?? null;
}

function setRef(t, e, s) {
    var i;
    ((i = t).$au ?? (i.$au = new Refs))[e] = s;
}

const Xe = /*@__PURE__*/ z("INode");

const Qe = /*@__PURE__*/ z("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(cs, true)) {
        return t.get(cs).host;
    }
    return t.get(rt).document;
}))));

const Ye = /*@__PURE__*/ z("IRenderLocation");

const Ze = /*@__PURE__*/ z("CssModules");

const Je = new WeakMap;

function getEffectiveParentNode(t) {
    if (Je.has(t)) {
        return Je.get(t);
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
        if (e.mountTarget === Re.shadowRoot) {
            return getEffectiveParentNode(e.host);
        }
    }
    return t.parentNode;
}

function setEffectiveParentNode(t, e) {
    if (t.platform !== void 0 && !(t instanceof t.platform.Node)) {
        const s = t.childNodes;
        for (let t = 0, i = s.length; t < i; ++t) {
            Je.set(s[t], e);
        }
    } else {
        Je.set(t, e);
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
        return this.ee;
    }
    get lastChild() {
        return this.se;
    }
    constructor(t, e) {
        this.platform = t;
        this.next = void 0;
        this.ie = false;
        this.ne = false;
        this.ref = null;
        const s = (this.f = e).querySelectorAll("au-m");
        let i = 0;
        let n = s.length;
        let r = this.t = Array(n);
        let l;
        let a;
        while (n > i) {
            a = s[i];
            l = a.nextSibling;
            a.remove();
            if (l.nodeType === 8) {
                a = l;
                (l = l.nextSibling).$start = a;
            }
            r[i] = l;
            ++i;
        }
        const h = e.childNodes;
        const c = this.childNodes = Array(n = h.length);
        i = 0;
        while (n > i) {
            c[i] = h[i];
            ++i;
        }
        this.ee = e.firstChild;
        this.se = e.lastChild;
    }
    findTargets() {
        return this.t;
    }
    insertBefore(t) {
        if (this.ne && !!this.ref) {
            this.addToLinked();
        } else {
            const e = t.parentNode;
            if (this.ie) {
                let s = this.ee;
                let i;
                const n = this.se;
                while (s != null) {
                    i = s.nextSibling;
                    e.insertBefore(s, t);
                    if (s === n) {
                        break;
                    }
                    s = i;
                }
            } else {
                this.ie = true;
                t.parentNode.insertBefore(this.f, t);
            }
        }
    }
    appendTo(t, e = false) {
        if (this.ie) {
            let e = this.ee;
            let s;
            const i = this.se;
            while (e != null) {
                s = e.nextSibling;
                t.appendChild(e);
                if (e === i) {
                    break;
                }
                e = s;
            }
        } else {
            this.ie = true;
            if (!e) {
                t.appendChild(this.f);
            }
        }
    }
    remove() {
        if (this.ie) {
            this.ie = false;
            const t = this.f;
            const e = this.se;
            let s;
            let i = this.ee;
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
        if (this.ie) {
            let s = this.ee;
            let i;
            const n = this.se;
            while (s != null) {
                i = s.nextSibling;
                e.insertBefore(s, t);
                if (s === n) {
                    break;
                }
                s = i;
            }
        } else {
            this.ie = true;
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

const ts = /*@__PURE__*/ z("IWindow", (t => t.callback((t => t.get(rt).window))));

const es = /*@__PURE__*/ z("ILocation", (t => t.callback((t => t.get(ts).location))));

const ss = /*@__PURE__*/ z("IHistory", (t => t.callback((t => t.get(ts).history))));

const registerHostNode = (e, s, i) => {
    registerResolver(e, s.HTMLElement, registerResolver(e, s.Element, registerResolver(e, Xe, new t.InstanceProvider("ElementResolver", i))));
    return e;
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
    const e = P(rs, t);
    if (e === void 0) {
        annotateElementMetadata(t, "containerless", true);
        return;
    }
    e.containerless = true;
}

const is = new WeakMap;

class CustomElementDefinition {
    get type() {
        return ht;
    }
    constructor(t, e, s, i, n, r, l, a, h, c, u, f, d, p, m, g, x, v, b) {
        this.Type = t;
        this.name = e;
        this.aliases = s;
        this.key = i;
        this.cache = n;
        this.capture = r;
        this.template = l;
        this.instructions = a;
        this.dependencies = h;
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
            const n = t.fromDefinitionOrDefault("name", i, os);
            if (isFunction(i.Type)) {
                s = i.Type;
            } else {
                s = ls(t.pascalCase(n));
            }
            return new CustomElementDefinition(s, n, t.mergeArrays(i.aliases), t.fromDefinitionOrDefault("key", i, (() => getElementKeyFrom(n))), t.fromDefinitionOrDefault("cache", i, returnZero), t.fromDefinitionOrDefault("capture", i, returnFalse), t.fromDefinitionOrDefault("template", i, returnNull), t.mergeArrays(i.instructions), t.mergeArrays(i.dependencies), t.fromDefinitionOrDefault("injectable", i, returnNull), t.fromDefinitionOrDefault("needsCompile", i, returnTrue), t.mergeArrays(i.surrogates), W.from(s, i.bindables), t.fromDefinitionOrDefault("containerless", i, returnFalse), t.fromDefinitionOrDefault("shadowOptions", i, returnNull), t.fromDefinitionOrDefault("hasSlots", i, returnFalse), t.fromDefinitionOrDefault("enhance", i, returnFalse), t.fromDefinitionOrDefault("watches", i, returnEmptyArray), t.fromAnnotationOrTypeOrDefault("processContent", s, returnNull));
        }
        if (isString(e)) {
            return new CustomElementDefinition(s, e, t.mergeArrays(getElementAnnotation(s, "aliases"), s.aliases), getElementKeyFrom(e), t.fromAnnotationOrTypeOrDefault("cache", s, returnZero), t.fromAnnotationOrTypeOrDefault("capture", s, returnFalse), t.fromAnnotationOrTypeOrDefault("template", s, returnNull), t.mergeArrays(getElementAnnotation(s, "instructions"), s.instructions), t.mergeArrays(getElementAnnotation(s, "dependencies"), s.dependencies), t.fromAnnotationOrTypeOrDefault("injectable", s, returnNull), t.fromAnnotationOrTypeOrDefault("needsCompile", s, returnTrue), t.mergeArrays(getElementAnnotation(s, "surrogates"), s.surrogates), W.from(s, ...W.getAll(s), getElementAnnotation(s, "bindables"), s.bindables), t.fromAnnotationOrTypeOrDefault("containerless", s, returnFalse), t.fromAnnotationOrTypeOrDefault("shadowOptions", s, returnNull), t.fromAnnotationOrTypeOrDefault("hasSlots", s, returnFalse), t.fromAnnotationOrTypeOrDefault("enhance", s, returnFalse), t.mergeArrays(at.getAnnotation(s), s.watches), t.fromAnnotationOrTypeOrDefault("processContent", s, returnNull));
        }
        const i = t.fromDefinitionOrDefault("name", e, os);
        return new CustomElementDefinition(s, i, t.mergeArrays(getElementAnnotation(s, "aliases"), e.aliases, s.aliases), getElementKeyFrom(i), t.fromAnnotationOrDefinitionOrTypeOrDefault("cache", e, s, returnZero), t.fromAnnotationOrDefinitionOrTypeOrDefault("capture", e, s, returnFalse), t.fromAnnotationOrDefinitionOrTypeOrDefault("template", e, s, returnNull), t.mergeArrays(getElementAnnotation(s, "instructions"), e.instructions, s.instructions), t.mergeArrays(getElementAnnotation(s, "dependencies"), e.dependencies, s.dependencies), t.fromAnnotationOrDefinitionOrTypeOrDefault("injectable", e, s, returnNull), t.fromAnnotationOrDefinitionOrTypeOrDefault("needsCompile", e, s, returnTrue), t.mergeArrays(getElementAnnotation(s, "surrogates"), e.surrogates, s.surrogates), W.from(s, ...W.getAll(s), getElementAnnotation(s, "bindables"), s.bindables, e.bindables), t.fromAnnotationOrDefinitionOrTypeOrDefault("containerless", e, s, returnFalse), t.fromAnnotationOrDefinitionOrTypeOrDefault("shadowOptions", e, s, returnNull), t.fromAnnotationOrDefinitionOrTypeOrDefault("hasSlots", e, s, returnFalse), t.fromAnnotationOrDefinitionOrTypeOrDefault("enhance", e, s, returnFalse), t.mergeArrays(e.watches, at.getAnnotation(s), s.watches), t.fromAnnotationOrDefinitionOrTypeOrDefault("processContent", e, s, returnNull));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) {
            return t;
        }
        if (is.has(t)) {
            return is.get(t);
        }
        const e = CustomElementDefinition.create(t);
        is.set(t, e);
        M(rs, e, e.Type);
        return e;
    }
    register(t) {
        const {Type: e, key: s, aliases: i} = this;
        if (!t.has(s, false)) {
            X(s, e).register(t);
            G(s, e).register(t);
            registerAliases(i, as, s, t);
        }
    }
    toString() {
        return `au:ce:${this.name}`;
    }
}

const ns = {
    name: undefined,
    searchParents: false,
    optional: false
};

const returnZero = () => 0;

const returnNull = () => null;

const returnFalse = () => false;

const returnTrue = () => true;

const returnEmptyArray = () => t.emptyArray;

const rs = /*@__PURE__*/ F("custom-element");

const getElementKeyFrom = t => `${rs}:${t}`;

const os = /*@__PURE__*/ (() => {
    let t = 0;
    return () => `unnamed-${++t}`;
})();

const annotateElementMetadata = (t, e, s) => {
    M(H(e), s, t);
};

const defineElement = (t, e) => {
    const s = CustomElementDefinition.create(t, e);
    M(rs, s, s.Type);
    M(rs, s, s);
    O(s.Type, rs);
    return s.Type;
};

const isElementType = t => isFunction(t) && L(rs, t);

const findElementControllerFor = (t, e = ns) => {
    if (e.name === void 0 && e.searchParents !== true) {
        const s = getRef(t, rs);
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
            const s = getRef(t, rs);
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
            const t = getRef(s, rs);
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
        const t = getRef(s, rs);
        if (t !== null) {
            return t;
        }
        s = getEffectiveParentNode(s);
    }
    throw createMappedError(765, t);
};

const getElementAnnotation = (t, e) => P(H(e), t);

const getElementDefinition = t => {
    const e = P(rs, t);
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

const ls = /*@__PURE__*/ function() {
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

const as = c({
    name: rs,
    keyFrom: getElementKeyFrom,
    isType: isElementType,
    for: findElementControllerFor,
    define: defineElement,
    getDefinition: getElementDefinition,
    annotate: annotateElementMetadata,
    getAnnotation: getElementAnnotation,
    generateName: os,
    createInjectable: createElementInjectable,
    generateType: ls
});

const hs = /*@__PURE__*/ H("processContent");

function processContent(t) {
    return t === void 0 ? function(t, e, s) {
        M(hs, ensureHook(t, e), t);
    } : function(e) {
        t = ensureHook(e, t);
        const s = P(rs, e);
        if (s !== void 0) {
            s.processContent = t;
        } else {
            M(hs, t, e);
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

const cs = /*@__PURE__*/ z("IAppRoot");

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
            const a = this.controller = Controller.$el(n, r, this.host, l);
            a.hE(l, null);
            return t.onResolve(this.le("hydrating"), (() => {
                a.hS(null);
                return t.onResolve(this.le("hydrated"), (() => {
                    a.hC();
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

const us = /*@__PURE__*/ z("IAurelia");

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
    constructor(e = t.DI.createContainer()) {
        this.container = e;
        this.ir = false;
        this.ae = false;
        this.he = false;
        this.ce = void 0;
        this.next = void 0;
        this.ue = void 0;
        this.fe = void 0;
        if (e.has(us, true) || e.has(Aurelia, true)) {
            throw createMappedError(768);
        }
        registerResolver(e, us, new t.InstanceProvider("IAurelia", this));
        registerResolver(e, Aurelia, new t.InstanceProvider("Aurelia", this));
        registerResolver(e, cs, this.de = new t.InstanceProvider("IAppRoot"));
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
        let a;
        if (isFunction(l)) {
            registerHostNode(i, r, n);
            a = i.invoke(l);
        } else {
            a = l;
        }
        registerResolver(i, Qe, new t.InstanceProvider("IEventTarget", n));
        s = s ?? null;
        const h = Controller.$el(i, a, n, null, CustomElementDefinition.create({
            name: os(),
            template: n,
            enhance: true
        }));
        return t.onResolve(h.activate(h, s), (() => h));
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
            this.ae = true;
            return t.onResolve(e.activate(), (() => {
                this.ir = true;
                this.ae = false;
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
            this.he = true;
            return this.fe = t.onResolve(s.deactivate(), (() => {
                Reflect.deleteProperty(s.host, "$aurelia");
                if (e) {
                    s.dispose();
                }
                this.ce = void 0;
                this.de.dispose();
                this.he = false;
                this.me(s, "au-stopped", s.host);
            }));
        }
    }
    dispose() {
        if (this.ir || this.he) {
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
        let a = 0;
        let h = 0;
        for (;a < n; ++a) {
            l = i[a];
            if (l.charSpec.has(t)) {
                s.push(l);
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

const fs = /*@__PURE__*/ z("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

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
        let a;
        let h;
        let c = 0;
        let u;
        while (e > c) {
            s = this.Pe;
            i = t[c];
            n = i.pattern;
            r = new SegmentTypes;
            l = this.Me(i, r);
            a = l.length;
            h = t => s = s.append(t, n);
            for (u = 0; a > u; ++u) {
                l[u].eachChar(h);
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
        let a = 0;
        let h = "";
        while (l < n) {
            h = i.charAt(l);
            if (r.length === 0 || !r.includes(h)) {
                if (l === a) {
                    if (h === "P" && i.slice(l, l + 4) === "PART") {
                        a = l = l + 4;
                        s.push(new DynamicSegment(r));
                        ++e.dynamics;
                    } else {
                        ++l;
                    }
                } else {
                    ++l;
                }
            } else if (l !== a) {
                s.push(new StaticSegment(i.slice(a, l)));
                ++e.statics;
                a = l;
            } else {
                s.push(new SymbolSegment(i.slice(a, l + 1)));
                ++e.symbols;
                a = ++l;
            }
        }
        if (a !== l) {
            s.push(new StaticSegment(i.slice(a, l)));
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

const ds = /*@__PURE__*/ z("IAttributePattern");

const ps = /*@__PURE__*/ z("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor() {
        this.et = {};
        const e = this.qe = t.resolve(fs);
        const s = t.resolve(t.all(ds));
        const i = this.Se = {};
        const n = s.reduce(((t, e) => {
            const s = getAllPatternDefinitions(e.constructor);
            s.forEach((t => i[t.pattern] = e));
            return t.concat(s);
        }), t.emptyArray);
        e.add(n);
    }
    parse(t, e) {
        let s = this.et[t];
        if (s == null) {
            s = this.et[t] = this.qe.interpret(t);
        }
        const i = s.pattern;
        if (i == null) {
            return new AttrSyntax(t, e, t, null, null);
        } else {
            return this.Se[i][i](t, e, s.parts);
        }
    }
}

function attributePattern(...t) {
    return function decorator(e) {
        return xs.define(t, e);
    };
}

class AttributePatternResourceDefinition {
    constructor(t) {
        this.Type = t;
        this.name = void 0;
    }
    register(t) {
        U(ds, this.Type).register(t);
    }
}

const ms = F("attribute-pattern");

const gs = "attribute-pattern-definitions";

const getAllPatternDefinitions = e => t.Protocol.annotation.get(e, gs);

const xs = c({
    name: ms,
    definitionAnnotationKey: gs,
    define(e, s) {
        const i = new AttributePatternResourceDefinition(s);
        M(ms, i, s);
        O(s, ms);
        t.Protocol.annotation.set(s, gs, e);
        V(s, gs);
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

let vs = class EventAttributePattern {
    "PART.trigger:PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "trigger", s);
    }
    "PART.capture:PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "capture", s);
    }
};

vs = __decorate([ attributePattern({
    pattern: "PART.trigger:PART",
    symbols: ".:"
}, {
    pattern: "PART.capture:PART",
    symbols: ".:"
}) ], vs);

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

let bs = class SpreadAttributePattern {
    "...$attrs"(t, e, s) {
        return new AttrSyntax(t, e, "", "...$attrs");
    }
};

bs = __decorate([ attributePattern({
    pattern: "...$attrs",
    symbols: ""
}) ], bs);

const ws = "None";

const ys = "IgnoreAttr";

function bindingCommand(t) {
    return function(e) {
        return Cs.define(t, e);
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
        registerAliases(i, Cs, s, t);
    }
}

const ks = /*@__PURE__*/ F("binding-command");

const getCommandKeyFrom = t => `${ks}:${t}`;

const getCommandAnnotation = (t, e) => P(H(e), t);

const Cs = c({
    name: ks,
    keyFrom: getCommandKeyFrom,
    define(t, e) {
        const s = BindingCommandDefinition.create(t, e);
        M(ks, s, s.Type);
        M(ks, s, s);
        O(e, ks);
        return s.Type;
    },
    getAnnotation: getCommandAnnotation
});

exports.OneTimeBindingCommand = class OneTimeBindingCommand {
    get type() {
        return ws;
    }
    build(e, s, i) {
        const n = e.attr;
        let r = n.target;
        let l = e.attr.rawValue;
        if (e.bindable == null) {
            r = i.map(e.node, r) ?? t.camelCase(r);
        } else {
            if (l === "" && e.def.type === ht) {
                l = t.camelCase(r);
            }
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(s.parse(l, w), r, S);
    }
};

exports.OneTimeBindingCommand = __decorate([ bindingCommand("one-time") ], exports.OneTimeBindingCommand);

exports.ToViewBindingCommand = class ToViewBindingCommand {
    get type() {
        return ws;
    }
    build(e, s, i) {
        const n = e.attr;
        let r = n.target;
        let l = e.attr.rawValue;
        if (e.bindable == null) {
            r = i.map(e.node, r) ?? t.camelCase(r);
        } else {
            if (l === "" && e.def.type === ht) {
                l = t.camelCase(r);
            }
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(s.parse(l, w), r, _);
    }
};

exports.ToViewBindingCommand = __decorate([ bindingCommand("to-view") ], exports.ToViewBindingCommand);

exports.FromViewBindingCommand = class FromViewBindingCommand {
    get type() {
        return ws;
    }
    build(e, s, i) {
        const n = e.attr;
        let r = n.target;
        let l = n.rawValue;
        if (e.bindable == null) {
            r = i.map(e.node, r) ?? t.camelCase(r);
        } else {
            if (l === "" && e.def.type === ht) {
                l = t.camelCase(r);
            }
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(s.parse(l, w), r, R);
    }
};

exports.FromViewBindingCommand = __decorate([ bindingCommand("from-view") ], exports.FromViewBindingCommand);

exports.TwoWayBindingCommand = class TwoWayBindingCommand {
    get type() {
        return ws;
    }
    build(e, s, i) {
        const n = e.attr;
        let r = n.target;
        let l = n.rawValue;
        if (e.bindable == null) {
            r = i.map(e.node, r) ?? t.camelCase(r);
        } else {
            if (l === "" && e.def.type === ht) {
                l = t.camelCase(r);
            }
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(s.parse(l, w), r, T);
    }
};

exports.TwoWayBindingCommand = __decorate([ bindingCommand("two-way") ], exports.TwoWayBindingCommand);

exports.DefaultBindingCommand = class DefaultBindingCommand {
    get type() {
        return ws;
    }
    build(e, s, i) {
        const n = e.attr;
        const r = e.bindable;
        let l;
        let a;
        let h = n.target;
        let c = n.rawValue;
        if (r == null) {
            a = i.isTwoWay(e.node, h) ? T : _;
            h = i.map(e.node, h) ?? t.camelCase(h);
        } else {
            if (c === "" && e.def.type === ht) {
                c = t.camelCase(h);
            }
            l = e.def.defaultBindingMode;
            a = r.mode === I || r.mode == null ? l == null || l === I ? _ : l : r.mode;
            h = r.name;
        }
        return new PropertyBindingInstruction(s.parse(c, w), h, a);
    }
};

exports.DefaultBindingCommand = __decorate([ bindingCommand("bind") ], exports.DefaultBindingCommand);

exports.ForBindingCommand = class ForBindingCommand {
    get type() {
        return ws;
    }
    static get inject() {
        return [ ps ];
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
        return ys;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, b), t.attr.target, true, false, t.attr.parts?.[2] ?? null);
    }
};

exports.TriggerBindingCommand = __decorate([ bindingCommand("trigger") ], exports.TriggerBindingCommand);

exports.CaptureBindingCommand = class CaptureBindingCommand {
    get type() {
        return ys;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, b), t.attr.target, false, true, t.attr.parts?.[2] ?? null);
    }
};

exports.CaptureBindingCommand = __decorate([ bindingCommand("capture") ], exports.CaptureBindingCommand);

exports.AttrBindingCommand = class AttrBindingCommand {
    get type() {
        return ys;
    }
    build(t, e) {
        return new AttributeBindingInstruction(t.attr.target, e.parse(t.attr.rawValue, w), t.attr.target);
    }
};

exports.AttrBindingCommand = __decorate([ bindingCommand("attr") ], exports.AttrBindingCommand);

exports.StyleBindingCommand = class StyleBindingCommand {
    get type() {
        return ys;
    }
    build(t, e) {
        return new AttributeBindingInstruction("style", e.parse(t.attr.rawValue, w), t.attr.target);
    }
};

exports.StyleBindingCommand = __decorate([ bindingCommand("style") ], exports.StyleBindingCommand);

exports.ClassBindingCommand = class ClassBindingCommand {
    get type() {
        return ys;
    }
    build(t, e) {
        return new AttributeBindingInstruction("class", e.parse(t.attr.rawValue, w), t.attr.target);
    }
};

exports.ClassBindingCommand = __decorate([ bindingCommand("class") ], exports.ClassBindingCommand);

let As = class RefBindingCommand {
    get type() {
        return ys;
    }
    build(t, e) {
        return new RefBindingInstruction(e.parse(t.attr.rawValue, w), t.attr.target);
    }
};

As = __decorate([ bindingCommand("ref") ], As);

let Bs = class SpreadBindingCommand {
    get type() {
        return ys;
    }
    build(t) {
        return new SpreadBindingInstruction;
    }
};

Bs = __decorate([ bindingCommand("...$attrs") ], Bs);

const Ss = /*@__PURE__*/ z("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

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
        t.register(U(this, this), G(this, Ss));
    }
    constructor() {
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
        const e = t.resolve(rt);
        this.SVGElement = e.globalThis.SVGElement;
        const s = e.document.createElement("div");
        s.innerHTML = "<svg><altGlyph /></svg>";
        if (s.firstElementChild.nodeName === "altglyph") {
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

const _s = /*@__PURE__*/ z("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    constructor() {
        this.fns = [];
        this.Ne = createLookup();
        this.$e = createLookup();
        this.svg = t.resolve(Ss);
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

const Rs = createLookup();

class AttributeNSAccessor {
    static forNs(t) {
        return Rs[t] ?? (Rs[t] = new AttributeNSAccessor(t));
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

const Ts = new DataAttributeAccessor;

const Is = {
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
        this._ = false;
        this.B = t;
        this.oL = i;
        this.cf = s;
    }
    getValue() {
        return this.iO ? this.v : this.B.multiple ? getSelectedOptions(this.B.options) : this.B.value;
    }
    setValue(t) {
        this.ov = this.v;
        this.v = t;
        this.We = t !== this.ov;
        this.Ue(t instanceof Array ? t : null);
        this.L();
    }
    L() {
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
        const e = this.B;
        const s = isArray(t);
        const i = e.matcher ?? defaultMatcher$1;
        const n = e.options;
        let r = n.length;
        while (r-- > 0) {
            const e = n[r];
            const l = h.call(e, "model") ? e.model : e.value;
            if (s) {
                e.selected = t.findIndex((t => !!i(l, t))) !== -1;
                continue;
            }
            e.selected = !!i(l, t);
        }
    }
    syncValue() {
        const t = this.B;
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
            const a = [];
            while (n < s) {
                r = e[n];
                if (r.selected) {
                    a.push(h.call(r, "model") ? r.model : r.value);
                }
                ++n;
            }
            let c;
            n = 0;
            while (n < i.length) {
                c = i[n];
                if (a.findIndex((t => !!l(c, t))) === -1) {
                    i.splice(n, 1);
                } else {
                    ++n;
                }
            }
            n = 0;
            while (n < a.length) {
                c = a[n];
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
                r = h.call(l, "model") ? l.model : l.value;
                break;
            }
            ++n;
        }
        this.ov = this.v;
        this.v = r;
        return true;
    }
    R() {
        (this.ze = createMutationObserver(this.B, this.Ge.bind(this))).observe(this.B, Is);
        this.Ue(this.v instanceof Array ? this.v : null);
        this.iO = true;
    }
    T() {
        this.ze.disconnect();
        this.je?.unsubscribe(this);
        this.ze = this.je = void 0;
        this.iO = false;
    }
    Ue(t) {
        this.je?.unsubscribe(this);
        this.je = void 0;
        if (t != null) {
            if (!this.B.multiple) {
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
        Es = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Es);
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
            e[e.length] = h.call(n, "model") ? n.model : n.value;
        }
        ++i;
    }
    return e;
}

let Es = void 0;

const Ps = "--";

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
        this.L();
    }
    Xe(t) {
        const e = [];
        const s = /url\([^)]+$/;
        let i = 0;
        let n = "";
        let r;
        let l;
        let a;
        let h;
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
            a = n.substring(0, l).trim();
            h = n.substring(l + 1).trim();
            e.push([ a, h ]);
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
                if (i.startsWith(Ps)) {
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
    L() {
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
            let a;
            let c = 0;
            const u = s.length;
            for (;c < u; ++c) {
                r = s[c];
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
            for (i in e) {
                if (!h.call(e, i) || e[i] !== n) {
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
        this._ = false;
        this.B = t;
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
            this.L();
        }
    }
    L() {
        if (this.We) {
            this.We = false;
            this.B[this.k] = this.v ?? this.cf.default;
            this.Ke();
        }
    }
    handleEvent() {
        this.ov = this.v;
        this.v = this.B[this.k];
        if (this.ov !== this.v) {
            this.We = false;
            this.Ke();
        }
    }
    R() {
        this.v = this.ov = this.B[this.k];
    }
    Ke() {
        Ls = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Ls);
    }
}

mixinNodeObserverUseConfig(ValueAttributeObserver);

s.subscriberCollection(ValueAttributeObserver);

let Ls = void 0;

const Ms = "http://www.w3.org/1999/xlink";

const Ds = "http://www.w3.org/XML/1998/namespace";

const qs = "http://www.w3.org/2000/xmlns/";

const Hs = u(createLookup(), {
    "xlink:actuate": [ "actuate", Ms ],
    "xlink:arcrole": [ "arcrole", Ms ],
    "xlink:href": [ "href", Ms ],
    "xlink:role": [ "role", Ms ],
    "xlink:show": [ "show", Ms ],
    "xlink:title": [ "title", Ms ],
    "xlink:type": [ "type", Ms ],
    "xml:lang": [ "lang", Ds ],
    "xml:space": [ "space", Ds ],
    xmlns: [ "xmlns", qs ],
    "xmlns:xlink": [ "xlink", qs ]
});

const Fs = new s.PropertyAccessor;

Fs.type = A | B;

class NodeObserverLocator {
    static register(t) {
        t.register(U(this, this), G(this, s.INodeObserverLocator));
    }
    constructor() {
        this.allowDirtyCheck = true;
        this.Je = createLookup();
        this.ts = createLookup();
        this.es = createLookup();
        this.ss = createLookup();
        this.rs = t.resolve(t.IServiceLocator);
        this.p = t.resolve(rt);
        this.os = t.resolve(s.IDirtyChecker);
        this.svg = t.resolve(Ss);
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
            return Ts;

          default:
            {
                const t = Hs[s];
                if (t !== undefined) {
                    return AttributeNSAccessor.forNs(t[1]);
                }
                if (isDataAttribute(e, s, this.svg)) {
                    return Ts;
                }
                return Fs;
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
        const r = Hs[e];
        if (r !== undefined) {
            return AttributeNSAccessor.forNs(r[1]);
        }
        if (isDataAttribute(t, e, this.svg)) {
            return Ts;
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
        this._ = false;
        this.B = t;
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
        const e = this.B;
        const s = h.call(e, "model") ? e.model : e.value;
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
        const e = this.B;
        const s = h.call(e, "model") ? e.model : e.value;
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
    R() {
        this.us();
    }
    T() {
        this.ls?.unsubscribe(this);
        this.cs?.unsubscribe(this);
        this.ls = this.cs = void 0;
    }
    Ke() {
        Os = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Os);
    }
    us() {
        const t = this.B;
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

let Os = void 0;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) {
            throw createMappedError(9994, e);
        }
        e.useTargetObserver(Ts);
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
        this.vs = t.resolve(Ot);
        this.l = t.resolve(Ye);
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
        this.f = t.resolve(Ot);
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

const Vs = [ "BindingBehavior", "ValueConverter" ];

class Repeat {
    constructor(t, e, s, i, n) {
        this.views = [];
        this.ws = [];
        this.key = null;
        this.ys = new Map;
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
                    this.key = e.parse(s, w);
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
        let a = 0;
        for (;n > a; ++a) {
            r = i[a];
            if (r.target === this && r.targetProperty === "items") {
                l = this.forOf = r.ast;
                this.Is = r;
                let t = l.iterable;
                while (t != null && Vs.includes(t.$kind)) {
                    t = t.expression;
                    this.As = true;
                }
                this.Ss = t;
                break;
            }
        }
        this.Es();
        const h = l.declaration;
        if (!(this.Rs = h.$kind === "ArrayDestructuring" || h.$kind === "ObjectDestructuring")) {
            this.local = s.astEvaluate(h, this.$controller.scope, r, null);
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
        this.ys.clear();
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
        this.ws = n.slice();
        const r = n.length;
        const l = this.key;
        const a = l !== null;
        if (a || i === void 0) {
            const t = this.local;
            const e = this._s;
            const h = e.length;
            const c = this.forOf;
            const u = c.declaration;
            const f = this.Is;
            const d = this.Rs;
            i = s.createIndexMap(h);
            let p = 0;
            if (r === 0) {
                for (;p < h; ++p) {
                    i[p] = -2;
                }
            } else if (h === 0) {
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
                let w = 0;
                const y = r - 1;
                const k = h - 1;
                const C = new Map;
                const A = new Map;
                const B = this.ys;
                const S = this.ks;
                const _ = this.$controller.scope;
                p = 0;
                t: {
                    while (true) {
                        if (a) {
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
                        if (p > y || p > k) {
                            break t;
                        }
                    }
                    if (y !== k) {
                        break t;
                    }
                    w = k;
                    while (true) {
                        if (a) {
                            g = m[w];
                            x = e[w];
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
                        --w;
                        if (p > w) {
                            break t;
                        }
                    }
                }
                const R = p;
                const T = p;
                for (p = T; p <= k; ++p) {
                    if (B.has(x = a ? e[p] : ensureUnique(e[p], p))) {
                        b = B.get(x);
                    } else {
                        b = a ? getKeyValue(B, l, x, getScope(S, x, c, _, f, t, d), f) : x;
                        B.set(x, b);
                    }
                    A.set(b, p);
                }
                for (p = R; p <= y; ++p) {
                    if (B.has(g = a ? m[p] : ensureUnique(m[p], p))) {
                        v = B.get(g);
                    } else {
                        v = a ? getKeyValue(B, l, g, n[p].scope, f) : g;
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
                    if (!C.has(B.get(a ? e[p] : ensureUnique(e[p], p)))) {
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
        const {$controller: r, f: l, local: a, l: h, items: c, ks: u, Is: f, forOf: d, Rs: p} = this;
        const m = r.scope;
        const g = getCount(c);
        const x = this.views = Array(g);
        iterate(c, ((c, v) => {
            i = x[v] = l.create().setLocation(h);
            i.nodes.unlink();
            n = getScope(u, c, d, m, f, a, p);
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
        const a = r.length;
        for (;a > n; ++n) {
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
        const a = l.length;
        let h = 0;
        for (;a > h; ++h) {
            i = r[l[h]];
            i.release();
            s = i.deactivate(i, n);
            if (isPromise(s)) {
                (e ?? (e = [])).push(s);
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
    Hs(t, e) {
        let i = void 0;
        let n;
        let r;
        let l;
        let a = 0;
        const {$controller: h, f: c, local: u, _s: f, l: d, views: p, Rs: m, Is: g, ks: x, ws: v, forOf: b} = this;
        const w = e.length;
        for (;w > a; ++a) {
            if (e[a] === -2) {
                r = c.create();
                p.splice(a, 0, r);
            }
        }
        if (p.length !== w) {
            throw createMappedError(814, [ p.length, w ]);
        }
        const y = h.scope;
        const k = e.length;
        let C = 0;
        a = 0;
        for (;a < e.length; ++a) {
            if ((C = e[a]) !== -2) {
                p[a] = v[C];
            }
        }
        const A = longestIncreasingSubsequence(e);
        const B = A.length;
        const S = b.declaration;
        let _;
        let R = B - 1;
        a = k - 1;
        for (;a >= 0; --a) {
            r = p[a];
            _ = p[a + 1];
            r.nodes.link(_?.nodes ?? d);
            if (e[a] === -2) {
                l = getScope(x, f[a], b, y, g, u, m);
                setContextualProperties(l.overrideContext, a, k);
                r.setLocation(d);
                n = r.activate(r, h, l);
                if (isPromise(n)) {
                    (i ?? (i = [])).push(n);
                }
            } else if (R < 0 || B === 1 || a !== A[R]) {
                if (m) {
                    s.astAssign(S, r.scope, g, f[a]);
                } else {
                    r.scope.bindingContext[u] = f[a];
                }
                setContextualProperties(r.scope.overrideContext, a, k);
                r.nodes.insertBefore(r.location);
            } else {
                if (m) {
                    s.astAssign(S, r.scope, g, f[a]);
                } else {
                    r.scope.bindingContext[u] = f[a];
                }
                if (t !== k) {
                    setContextualProperties(r.scope.overrideContext, a, k);
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

Repeat.inject = [ fe, s.IExpressionParser, Ye, je, Ot ];

__decorate([ bindable ], Repeat.prototype, "items", void 0);

templateController("repeat")(Repeat);

let Ns = 16;

let $s = new Int32Array(Ns);

let Ws = new Int32Array(Ns);

function longestIncreasingSubsequence(t) {
    const e = t.length;
    if (e > Ns) {
        Ns = e;
        $s = new Int32Array(e);
        Ws = new Int32Array(e);
    }
    let s = 0;
    let i = 0;
    let n = 0;
    let r = 0;
    let l = 0;
    let a = 0;
    let h = 0;
    let c = 0;
    for (;r < e; r++) {
        i = t[r];
        if (i !== -2) {
            l = $s[s];
            n = t[l];
            if (n !== -2 && n < i) {
                Ws[r] = l;
                $s[++s] = r;
                continue;
            }
            a = 0;
            h = s;
            while (a < h) {
                c = a + h >> 1;
                n = t[$s[c]];
                if (n !== -2 && n < i) {
                    a = c + 1;
                } else {
                    h = c;
                }
            }
            n = t[$s[a]];
            if (i < n || n === -2) {
                if (a > 0) {
                    Ws[r] = $s[a - 1];
                }
                $s[a] = r;
            }
        }
    }
    r = ++s;
    const u = new Int32Array(r);
    i = $s[s - 1];
    while (s-- > 0) {
        u[s] = i;
        i = Ws[i];
    }
    while (r-- > 0) $s[r] = 0;
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

const js = a.toString;

const getCount = t => {
    switch (js.call(t)) {
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
    switch (js.call(t)) {
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

const getScope = (t, e, i, n, r, l, a) => {
    let h = t.get(e);
    if (h === void 0) {
        if (a) {
            s.astAssign(i.declaration, h = s.Scope.fromParent(n, new s.BindingContext), r, e);
        } else {
            h = s.Scope.fromParent(n, new s.BindingContext(l, e));
        }
        t.set(e, h);
    }
    return h;
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
        this.view = t.resolve(Ot).create().setLocation(t.resolve(Ye));
    }
    valueChanged(t, e) {
        const i = this.$controller;
        const n = this.view.bindings;
        let r;
        let l = 0, a = 0;
        if (i.isActive && n != null) {
            r = s.Scope.fromParent(i.scope, t === void 0 ? {} : t);
            for (a = n.length; a > l; ++l) {
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
        this.f = t.resolve(Ot);
        this.l = t.resolve(Ye);
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

let zs = 0;

exports.Case = class Case {
    constructor() {
        this.id = ++zs;
        this.fallThrough = false;
        this.view = void 0;
        this.f = t.resolve(Ot);
        this.rs = t.resolve(s.IObserverLocator);
        this.l = t.resolve(Ye);
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
        this.f = t.resolve(Ot);
        this.l = t.resolve(Ye);
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
        const a = this.pending;
        const h = this.viewScope;
        let c;
        const u = {
            reusable: false
        };
        const $swap = () => {
            void t.onResolveAll(c = (this.preSettledTask = i.queueTask((() => t.onResolveAll(r?.deactivate(e), l?.deactivate(e), a?.activate(e, h))), u)).result.catch((t => {
                if (!(t instanceof n.TaskAbortError)) throw t;
            })), s.then((n => {
                if (this.value !== s) {
                    return;
                }
                const fulfill = () => {
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => t.onResolveAll(a?.deactivate(e), l?.deactivate(e), r?.activate(e, h, n))), u)).result;
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
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => t.onResolveAll(a?.deactivate(e), r?.deactivate(e), l?.activate(e, h, n))), u)).result;
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
        this.f = t.resolve(Ot);
        this.l = t.resolve(Ye);
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

exports.PendingTemplateController = __decorate([ templateController(y) ], exports.PendingTemplateController);

exports.FulfilledTemplateController = class FulfilledTemplateController {
    constructor() {
        this.view = void 0;
        this.f = t.resolve(Ot);
        this.l = t.resolve(Ye);
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
        this.f = t.resolve(Ot);
        this.l = t.resolve(Ye);
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

let Us = class PromiseAttributePattern {
    "promise.resolve"(t, e, s) {
        return new AttrSyntax(t, e, "promise", "bind");
    }
};

Us = __decorate([ attributePattern({
    pattern: "promise.resolve",
    symbols: ""
}) ], Us);

let Gs = class FulfilledAttributePattern {
    then(t, e, s) {
        return new AttrSyntax(t, e, "then", "from-view");
    }
};

Gs = __decorate([ attributePattern({
    pattern: "then",
    symbols: ""
}) ], Gs);

let Ks = class RejectedAttributePattern {
    catch(t, e, s) {
        return new AttrSyntax(t, e, "catch", "from-view");
    }
};

Ks = __decorate([ attributePattern({
    pattern: "catch",
    symbols: ""
}) ], Ks);

class Focus {
    constructor() {
        this.js = false;
        this.zs = t.resolve(Xe);
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

__decorate([ bindable({
    mode: T
}) ], Focus.prototype, "value", void 0);

customAttribute("focus")(Focus);

class Portal {
    constructor() {
        this.position = "beforeend";
        this.strict = false;
        const e = t.resolve(Ot);
        const s = t.resolve(Ye);
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
        this.Kt = false;
        this.expose = null;
        this.slotchange = null;
        this.li = new Set;
        this.Cs = null;
        const e = t.resolve(ze);
        const s = t.resolve(Ye);
        const i = t.resolve(fe);
        const n = t.resolve(ke);
        const r = i.auSlot;
        const l = e.instruction?.projections?.[r.name];
        const a = e.controller.container;
        let h;
        let c;
        this.name = r.name;
        if (l == null) {
            c = a.createChild({
                inheritParentResources: true
            });
            h = n.getViewFactory(r.fallback, c);
            this.ai = false;
        } else {
            c = a.createChild();
            c.useResources(e.parent.controller.container);
            registerResolver(c, ze, new t.InstanceProvider(void 0, e.parent));
            h = n.getViewFactory(l, c);
            this.ai = true;
            this.hi = a.getAll(Wt, false)?.filter((t => t.slotName === "*" || t.slotName === r.name)) ?? t.emptyArray;
        }
        this.ui = (this.hi ?? (this.hi = t.emptyArray)).length > 0;
        this.fi = e;
        this.view = h.create().setLocation(this.l = s);
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
        if (this.ai) {
            i = this.fi.controller.scope.parent;
            (this.oi = s.Scope.fromParent(i, i.bindingContext)).overrideContext.$host = this.expose ?? this.ri.bindingContext;
        }
    }
    attaching(e, s) {
        return t.onResolve(this.view.activate(e, this.$controller, this.ai ? this.oi : this.ri), (() => {
            if (this.ui) {
                this.hi.forEach((t => t.watch(this)));
                this.us();
                this.di();
                this.Kt = true;
            }
        }));
    }
    detaching(t, e) {
        this.Kt = false;
        this.pi();
        this.hi.forEach((t => t.unwatch(this)));
        return this.view.deactivate(t, this.$controller);
    }
    exposeChanged(t) {
        if (this.ai && this.oi != null) {
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
        if (this.Kt) {
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
        this.parent = t.resolve(je);
        this.host = t.resolve(Xe);
        this.l = t.resolve(Ye);
        this.p = t.resolve(rt);
        this.r = t.resolve(ke);
        this.gi = t.resolve(fe);
        this.xi = t.resolve(t.transient(CompositionContextFactory));
        this.ut = t.resolve(de);
        this.lt = t.resolve(ze);
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
        const {wi: n, yi: r, ki: l} = e.change;
        const {c: a, host: h, $controller: c, l: u, gi: f} = this;
        const d = this.getDef(r);
        const p = a.createChild();
        let m;
        if (d !== null) {
            m = this.p.document.createElement(d.name);
            if (u == null) {
                h.appendChild(m);
            } else {
                u.parentNode.insertBefore(m, u);
            }
            i = this.Ci(p, r, m);
        } else {
            m = u ?? h;
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
                const a = d.containerless ? convertToRenderLocation(m) : null;
                const h = Controller.$el(p, i, m, {
                    projections: f.projections,
                    captures: r
                }, d, a);
                const u = new HydrationContext(c, {
                    projections: null,
                    captures: l
                }, this.lt.parent);
                const removeCompositionHost = () => {
                    if (a == null) {
                        m.remove();
                    } else {
                        let t = a.$start.nextSibling;
                        let e = null;
                        while (t !== null && t !== a) {
                            e = t.nextSibling;
                            t.remove();
                            t = e;
                        }
                        a.$start?.remove();
                        a.remove();
                    }
                };
                const g = SpreadBinding.create(u, m, d, this.r, this.ut, this.p, this.ep, this.oL);
                g.forEach((t => h.addBinding(t)));
                return new CompositionController(h, (t => h.activate(t ?? h, c, c.scope.parent)), (e => t.onResolve(h.deactivate(e ?? h, c), removeCompositionHost)), (t => i.activate?.(t)), e);
            } else {
                const t = CustomElementDefinition.create({
                    name: as.generateName(),
                    template: n
                });
                const r = this.r.getViewFactory(t, p);
                const l = Controller.$view(r, c);
                const a = this.scopeBehavior === "auto" ? s.Scope.fromParent(this.parent.scope, i) : s.Scope.create(i);
                if (isRenderLocation(m)) {
                    l.setLocation(m);
                } else {
                    l.setHost(m);
                }
                return new CompositionController(l, (t => l.activate(t ?? l, c, a)), (t => l.deactivate(t ?? l, c)), (t => i.activate?.(t)), e);
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
        registerResolver(e, Ye, new t.InstanceProvider("IRenderLocation", r ? i : null));
        const l = e.invoke(s);
        registerResolver(e, s, new t.InstanceProvider("au-compose.component", l));
        return l;
    }
    getDef(t) {
        const e = isFunction(t) ? t : t?.constructor;
        return as.isType(e) ? as.getDefinition(e) : null;
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
        this.wi = t;
        this.yi = e;
        this.ki = s;
        this.Ai = i;
    }
    load() {
        if (isPromise(this.wi) || isPromise(this.yi)) {
            return Promise.all([ this.wi, this.yi ]).then((([t, e]) => new LoadedChangeInfo(t, e, this.ki, this.Ai)));
        } else {
            return new LoadedChangeInfo(this.wi, this.yi, this.ki, this.Ai);
        }
    }
}

class LoadedChangeInfo {
    constructor(t, e, s, i) {
        this.wi = t;
        this.yi = e;
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

const Xs = /*@__PURE__*/ z("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw createMappedError(99, "sanitize");
    }
})));

class SanitizeValueConverter {
    constructor() {
        this.Bi = t.resolve(Xs);
    }
    toView(t) {
        if (t == null) {
            return null;
        }
        return this.Bi.sanitize(t);
    }
}

valueConverter("sanitize")(SanitizeValueConverter);

const Qs = /*@__PURE__*/ z("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const Ys = {};

class TemplateElementFactory {
    constructor() {
        this.p = t.resolve(rt);
        this.wi = this.t();
    }
    t() {
        return this.p.document.createElement("template");
    }
    createTemplate(t) {
        if (isString(t)) {
            let e = Ys[t];
            if (e === void 0) {
                const s = this.wi;
                s.innerHTML = t;
                const i = s.content.firstElementChild;
                if (needsWrapping(i)) {
                    this.wi = this.t();
                    e = s;
                } else {
                    s.content.removeChild(i);
                    e = i;
                }
                Ys[t] = e;
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
        t.register(U(this, this), G(this, de));
    }
    compile(e, s, i) {
        const n = CustomElementDefinition.getOrCreate(e);
        if (n.template === null || n.template === void 0) {
            return n;
        }
        if (n.needsCompile === false) {
            return n;
        }
        i ?? (i = ei);
        const r = new CompilationContext(e, s, i, null, null, void 0);
        const l = isString(n.template) || !e.enhance ? r.Si.createTemplate(n.template) : n.template;
        const a = l.nodeName === Zs && l.content != null;
        const h = a ? l.content : l;
        const c = s.get(allResources(hi));
        const u = c.length;
        let f = 0;
        if (u > 0) {
            while (u > f) {
                c[f].compiling?.(l);
                ++f;
            }
        }
        if (l.hasAttribute(ai)) {
            throw createMappedError(701, n);
        }
        this._i(h, r);
        this.Ri(h, r);
        return CustomElementDefinition.create({
            ...e,
            name: e.name || os(),
            dependencies: (e.dependencies ?? t.emptyArray).concat(r.deps ?? t.emptyArray),
            instructions: r.rows,
            surrogates: a ? this.Ti(l, r) : t.emptyArray,
            template: l,
            hasSlots: r.hasSlot,
            needsCompile: false
        });
    }
    compileSpread(e, s, i, n, r) {
        const l = new CompilationContext(e, i, ei, null, null, void 0);
        const a = [];
        const h = r ?? l.Ii(n.nodeName.toLowerCase());
        const c = h !== null;
        const u = l.ep;
        const f = s.length;
        let d = 0;
        let p;
        let m = null;
        let g;
        let v;
        let b;
        let w;
        let y;
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
            if (k !== null && k.type === ys) {
                ii.node = n;
                ii.attr = p;
                ii.bindable = null;
                ii.def = null;
                a.push(k.build(ii, l.ep, l.m));
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
                    y = b.primary;
                    if (k === null) {
                        C = u.parse(S, x);
                        v = [ C === null ? new SetPropertyInstruction(S, y.name) : new InterpolationInstruction(C, y.name) ];
                    } else {
                        ii.node = n;
                        ii.attr = p;
                        ii.bindable = y;
                        ii.def = m;
                        v = [ k.build(ii, l.ep, l.m) ];
                    }
                }
                (g ?? (g = [])).push(new HydrateAttributeInstruction(this.resolveResources ? m : m.name, m.aliases != null && m.aliases.includes(B) ? B : void 0, v));
                continue;
            }
            if (k === null) {
                C = u.parse(S, x);
                if (c) {
                    b = BindablesInfo.from(h, false);
                    w = b.attrs[B];
                    if (w !== void 0) {
                        C = u.parse(S, x);
                        a.push(new SpreadElementPropBindingInstruction(C == null ? new SetPropertyInstruction(S, w.name) : new InterpolationInstruction(C, w.name)));
                        continue;
                    }
                }
                if (C != null) {
                    a.push(new InterpolationInstruction(C, l.m.map(n, B) ?? t.camelCase(B)));
                } else {
                    switch (B) {
                      case "class":
                        a.push(new SetClassAttributeInstruction(S));
                        break;

                      case "style":
                        a.push(new SetStyleAttributeInstruction(S));
                        break;

                      default:
                        a.push(new SetAttributeInstruction(S, B));
                    }
                }
            } else {
                if (c) {
                    b = BindablesInfo.from(h, false);
                    w = b.attrs[B];
                    if (w !== void 0) {
                        ii.node = n;
                        ii.attr = p;
                        ii.bindable = w;
                        ii.def = h;
                        a.push(new SpreadElementPropBindingInstruction(k.build(ii, l.ep, l.m)));
                        continue;
                    }
                }
                ii.node = n;
                ii.attr = p;
                ii.bindable = null;
                ii.def = null;
                a.push(k.build(ii, l.ep, l.m));
            }
        }
        resetCommandBuildInfo();
        if (g != null) {
            return g.concat(a);
        }
        return a;
    }
    Ti(e, s) {
        const i = [];
        const n = e.attributes;
        const r = s.ep;
        let l = n.length;
        let a = 0;
        let h;
        let c;
        let u;
        let f;
        let d = null;
        let p;
        let m;
        let g;
        let v;
        let b = null;
        let w;
        let y;
        let k;
        let C;
        for (;l > a; ++a) {
            h = n[a];
            c = h.name;
            u = h.value;
            f = s.He.parse(c, u);
            k = f.target;
            C = f.rawValue;
            if (ni[k]) {
                throw createMappedError(702, c);
            }
            b = s.Ei(f);
            if (b !== null && b.type === ys) {
                ii.node = e;
                ii.attr = f;
                ii.bindable = null;
                ii.def = null;
                i.push(b.build(ii, s.ep, s.m));
                continue;
            }
            d = s.Pi(k);
            if (d !== null) {
                if (d.isTemplateController) {
                    throw createMappedError(703, k);
                }
                g = BindablesInfo.from(d, true);
                y = d.noMultiBindings === false && b === null && hasInlineBindings(C);
                if (y) {
                    m = this.Li(e, C, d, s);
                } else {
                    v = g.primary;
                    if (b === null) {
                        w = r.parse(C, x);
                        m = [ w === null ? new SetPropertyInstruction(C, v.name) : new InterpolationInstruction(w, v.name) ];
                    } else {
                        ii.node = e;
                        ii.attr = f;
                        ii.bindable = v;
                        ii.def = d;
                        m = [ b.build(ii, s.ep, s.m) ];
                    }
                }
                e.removeAttribute(c);
                --a;
                --l;
                (p ?? (p = [])).push(new HydrateAttributeInstruction(this.resolveResources ? d : d.name, d.aliases != null && d.aliases.includes(k) ? k : void 0, m));
                continue;
            }
            if (b === null) {
                w = r.parse(C, x);
                if (w != null) {
                    e.removeAttribute(c);
                    --a;
                    --l;
                    i.push(new InterpolationInstruction(w, s.m.map(e, k) ?? t.camelCase(k)));
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
                ii.node = e;
                ii.attr = f;
                ii.bindable = null;
                ii.def = null;
                i.push(b.build(ii, s.ep, s.m));
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
        const a = i.ep;
        let h = false;
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
                h = true;
                continue;
            }
            f = i.He.parse(d, p);
            g = f.target;
            v = f.rawValue;
            m = i.Ei(f);
            if (m !== null) {
                if (f.command === "bind") {
                    l.push(new LetBindingInstruction(a.parse(v, w), t.camelCase(g)));
                } else {
                    throw createMappedError(704, f);
                }
                continue;
            }
            b = a.parse(v, x);
            l.push(new LetBindingInstruction(b === null ? new s.PrimitiveLiteralExpression(v) : b, t.camelCase(g)));
        }
        i.rows.push([ new HydrateLetElementInstruction(l, h) ]);
        return this.Hi(e, i).nextSibling;
    }
    Di(e, s) {
        var i, n, r, l;
        const a = e.nextSibling;
        const h = (e.getAttribute("as-element") ?? e.nodeName).toLowerCase();
        const c = s.Ii(h);
        const u = c !== null;
        const f = u && c.shadowOptions != null;
        const d = c?.capture;
        const p = d != null && typeof d !== "boolean";
        const m = d ? [] : t.emptyArray;
        const g = s.ep;
        const v = this.debug ? t.noop : () => {
            e.removeAttribute(A);
            --k;
            --y;
        };
        let b = e.attributes;
        let w;
        let y = b.length;
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
        if (h === "slot") {
            if (s.root.def.shadowOptions == null) {
                throw createMappedError(717, s.root.def.name);
            }
            s.root.hasSlot = true;
        }
        if (u) {
            W = c.processContent?.call(c.Type, e, s.p);
            b = e.attributes;
            y = b.length;
        }
        for (;y > k; ++k) {
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
                if (F != null && F.type === ys) {
                    v();
                    m.push(S);
                    continue;
                }
                z = N !== pi && N !== "slot";
                if (z) {
                    O = BindablesInfo.from(c, false);
                    if (O.attrs[N] == null && !s.Pi(N)?.isTemplateController) {
                        v();
                        m.push(S);
                        continue;
                    }
                }
            }
            if (F?.type === ys) {
                ii.node = e;
                ii.attr = S;
                ii.bindable = null;
                ii.def = null;
                (_ ?? (_ = [])).push(F.build(ii, s.ep, s.m));
                v();
                continue;
            }
            if (u) {
                O = BindablesInfo.from(c, false);
                E = O.attrs[N];
                if (E !== void 0) {
                    if (F === null) {
                        q = g.parse($, x);
                        (R ?? (R = [])).push(q == null ? new SetPropertyInstruction($, E.name) : new InterpolationInstruction(q, E.name));
                    } else {
                        ii.node = e;
                        ii.attr = S;
                        ii.bindable = E;
                        ii.def = c;
                        (R ?? (R = [])).push(F.build(ii, s.ep, s.m));
                    }
                    v();
                    continue;
                }
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
                        ii.node = e;
                        ii.attr = S;
                        ii.bindable = V;
                        ii.def = T;
                        L = [ F.build(ii, s.ep, s.m) ];
                    }
                }
                v();
                if (T.isTemplateController) {
                    (M ?? (M = [])).push(new HydrateTemplateController(si, this.resolveResources ? T : T.name, void 0, L));
                } else {
                    (P ?? (P = [])).push(new HydrateAttributeInstruction(this.resolveResources ? T : T.name, T.aliases != null && T.aliases.includes(N) ? N : void 0, L));
                }
                continue;
            }
            if (F === null) {
                q = g.parse($, x);
                if (q != null) {
                    v();
                    (_ ?? (_ = [])).push(new InterpolationInstruction(q, s.m.map(e, N) ?? t.camelCase(N)));
                }
                continue;
            }
            ii.node = e;
            ii.attr = S;
            ii.bindable = null;
            ii.def = null;
            (_ ?? (_ = [])).push(F.build(ii, s.ep, s.m));
            v();
        }
        resetCommandBuildInfo();
        if (this.Fi(e, _) && _ != null && _.length > 1) {
            this.Oi(e, _);
        }
        if (u) {
            H = new HydrateElementInstruction(this.resolveResources ? c : c.name, void 0, R ?? t.emptyArray, null, j, m);
            if (h === pi) {
                const t = e.getAttribute("name") || di;
                const i = s.t();
                const n = s.Vi();
                let r = e.firstChild;
                let l = 0;
                while (r !== null) {
                    if (isElement(r) && r.hasAttribute(pi)) {
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
                        name: os(),
                        template: i,
                        instructions: n.rows,
                        needsCompile: false
                    })
                };
            }
        }
        if (_ != null || H != null || P != null) {
            w = t.emptyArray.concat(H ?? t.emptyArray, P ?? t.emptyArray, _ ?? t.emptyArray);
            U = true;
        }
        let G;
        if (M != null) {
            y = M.length - 1;
            k = y;
            D = M[k];
            let t;
            if (isMarker(e)) {
                t = s.t();
                appendManyToTemplate(t, [ s.wt(), s.Ni(Js), s.Ni(ti) ]);
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
            const l = s.Vi(w == null ? [] : [ w ]);
            let a;
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
                    d = isElement(S) ? S.getAttribute(pi) : null;
                    p = d !== null || u && !f;
                    a = S.nextSibling;
                    if (p) {
                        if (!u) {
                            throw createMappedError(706, d, h);
                        }
                        S.removeAttribute?.(pi);
                        _ = isTextNode(S) && S.textContent.trim() === "";
                        if (!_) {
                            ((i = g ?? (g = {}))[n = d || di] ?? (i[n] = [])).push(S);
                        }
                        e.removeChild(S);
                    }
                    S = a;
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
                        name: os(),
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
                if (e.nodeName === Zs) {
                    this.Ri(e.content, l);
                } else {
                    S = e.firstChild;
                    while (S !== null) {
                        S = this.Ri(S, l);
                    }
                }
            }
            D.def = CustomElementDefinition.create({
                name: os(),
                template: r,
                instructions: l.rows,
                needsCompile: false
            });
            while (k-- > 0) {
                D = M[k];
                t = s.t();
                b = s.wt();
                appendManyToTemplate(t, [ b, s.Ni(Js), s.Ni(ti) ]);
                D.def = CustomElementDefinition.create({
                    name: os(),
                    template: t,
                    needsCompile: false,
                    instructions: [ [ M[k + 1] ] ]
                });
            }
            s.rows.push([ D ]);
        } else {
            if (w != null) {
                s.rows.push(w);
            }
            let t = e.firstChild;
            let i;
            let n;
            let a = false;
            let d = null;
            let p;
            let m;
            let g;
            let x;
            let v;
            let b = false;
            let y = 0, k = 0;
            if (W !== false) {
                while (t !== null) {
                    n = isElement(t) ? t.getAttribute(pi) : null;
                    a = n !== null || u && !f;
                    i = t.nextSibling;
                    if (a) {
                        if (!u) {
                            throw createMappedError(706, n, h);
                        }
                        t.removeAttribute?.(pi);
                        b = isTextNode(t) && t.textContent.trim() === "";
                        if (!b) {
                            ((r = p ?? (p = {}))[l = n || di] ?? (r[l] = [])).push(t);
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
                    for (y = 0, k = m.length; k > y; ++y) {
                        g = m[y];
                        if (g.nodeName === Zs) {
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
                        name: os(),
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
        return a;
    }
    qi(t, e) {
        const s = t.parentNode;
        const i = e.ep.parse(t.textContent, x);
        const n = t.nextSibling;
        let r;
        let l;
        let a;
        let h;
        let c;
        if (i !== null) {
            ({parts: r, expressions: l} = i);
            if (c = r[0]) {
                insertBefore(s, e.Wi(c), t);
            }
            for (a = 0, h = l.length; h > a; ++a) {
                insertManyBefore(s, t, [ e.wt(), e.Wi(" ") ]);
                if (c = r[a + 1]) {
                    insertBefore(s, e.Wi(c), t);
                }
                e.rows.push([ new TextBindingInstruction(l[a]) ]);
            }
            s.removeChild(t);
        }
        return n;
    }
    Li(t, e, s, i) {
        const n = BindablesInfo.from(s, true);
        const r = e.length;
        const l = [];
        let a = void 0;
        let h = void 0;
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
                a = e.slice(c, g);
                while (e.charCodeAt(++g) <= 32) ;
                c = g;
                for (;g < r; ++g) {
                    u = e.charCodeAt(g);
                    if (u === 92) {
                        ++g;
                    } else if (u === 59) {
                        h = e.slice(c, g);
                        break;
                    }
                }
                if (h === void 0) {
                    h = e.slice(c);
                }
                d = i.He.parse(a, h);
                p = i.Ei(d);
                m = n.attrs[d.target];
                if (m == null) {
                    throw createMappedError(707, d.target, s.name);
                }
                if (p === null) {
                    f = i.ep.parse(h, x);
                    l.push(f === null ? new SetPropertyInstruction(h, m.name) : new InterpolationInstruction(f, m.name));
                } else {
                    ii.node = t;
                    ii.attr = d;
                    ii.bindable = m;
                    ii.def = s;
                    l.push(p.build(ii, i.ep, i.m));
                }
                while (g < r && e.charCodeAt(++g) <= 32) ;
                c = g;
                a = void 0;
                h = void 0;
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
        const a = new Set;
        const h = [];
        for (const e of r) {
            if (e.parentNode !== n) {
                throw createMappedError(709, i);
            }
            const r = processTemplateName(i, e, a);
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
                const a = t.toArray(s.attributes).filter((t => !li.includes(t.name)));
                if (a.length > 0) ;
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
            h.push(LocalTemplateType);
            s.ji(defineElement({
                name: r,
                template: e,
                bindables: d
            }, LocalTemplateType));
            n.removeChild(e);
        }
        const c = [ ...s.def.dependencies ?? t.emptyArray, ...h ];
        for (const t of h) {
            getElementDefinition(t).dependencies.push(c.filter((e => e !== t)));
        }
    }
    Fi(t, e) {
        const s = t.nodeName;
        return s === "INPUT" && ri[t.type] === 1 || s === "SELECT" && (t.hasAttribute("multiple") || e?.some((t => t.type === Yt && t.to === "multiple")));
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
        const i = e.wt();
        insertManyBefore(s, t, [ i, e.Ni(Js), e.Ni(ti) ]);
        s.removeChild(t);
        return i;
    }
}

const Zs = "TEMPLATE";

const Js = "au-start";

const ti = "au-end";

const isMarker = t => t.nodeValue === "au*";

class CompilationContext {
    constructor(e, i, n, r, l, a) {
        this.hasSlot = false;
        this.zi = createLookup();
        const h = r !== null;
        this.c = i;
        this.root = l === null ? this : l;
        this.def = e;
        this.ci = n;
        this.parent = r;
        this.Si = h ? r.Si : i.get(Qs);
        this.He = h ? r.He : i.get(ps);
        this.ep = h ? r.ep : i.get(s.IExpressionParser);
        this.m = h ? r.m : i.get(_s);
        this.$s = h ? r.$s : i.get(t.ILogger);
        this.p = h ? r.p : i.get(rt);
        this.localEls = h ? r.localEls : new Set;
        this.rows = a ?? [];
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
    wt() {
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
        return this.c.find(as, t);
    }
    Pi(t) {
        return this.c.find(ft, t);
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
            s = this.c.create(Cs, e);
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
    ii.node = ii.attr = ii.bindable = ii.def = null;
};

const ei = {
    projections: null
};

const si = {
    name: "unnamed"
};

const ii = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const ni = u(createLookup(), {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
});

const ri = {
    checkbox: 1,
    radio: 1
};

const oi = new WeakMap;

class BindablesInfo {
    static from(t, e) {
        let s = oi.get(t);
        if (s == null) {
            const i = t.bindables;
            const n = createLookup();
            const r = e ? t.defaultBindingMode === void 0 ? I : t.defaultBindingMode : I;
            let l;
            let a;
            let h = false;
            let c;
            let u;
            for (a in i) {
                l = i[a];
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
            oi.set(t, s = new BindablesInfo(n, i, c));
        }
        return s;
    }
    constructor(t, e, s) {
        this.attrs = t;
        this.bindables = e;
        this.primary = s;
    }
}

const li = c([ "name", "attribute", "mode" ]);

const ai = "as-custom-element";

const processTemplateName = (t, e, s) => {
    const i = e.getAttribute(ai);
    if (i === null || i === "") {
        throw createMappedError(715, t);
    }
    if (s.has(i)) {
        throw createMappedError(716, i, t);
    } else {
        s.add(i);
        e.removeAttribute(ai);
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

const hi = /*@__PURE__*/ z("ITemplateCompilerHooks");

const ci = new WeakMap;

const ui = /*@__PURE__*/ F("compiler-hooks");

const fi = c({
    name: ui,
    define(t) {
        let e = ci.get(t);
        if (e === void 0) {
            ci.set(t, e = new TemplateCompilerHooksDefinition(t));
            M(ui, e, t);
            O(t, ui);
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
        t.register(U(hi, this.Type));
    }
}

const templateCompilerHooks = t => {
    return t === void 0 ? decorator : decorator(t);
    function decorator(t) {
        return fi.define(t);
    }
};

const di = "default";

const pi = "au-slot";

class Show {
    constructor() {
        this.el = t.resolve(Xe);
        this.p = t.resolve(rt);
        this.Ui = false;
        this.V = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.V = null;
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
        const e = t.resolve(fe);
        this.Gi = this.Ki = e.alias !== "hide";
    }
    binding() {
        this.Ui = true;
        this.update();
    }
    detaching() {
        this.Ui = false;
        this.V?.cancel();
        this.V = null;
    }
    valueChanged() {
        if (this.Ui && this.V === null) {
            this.V = this.p.domWriteQueue.queueTask(this.update);
        }
    }
}

__decorate([ bindable ], Show.prototype, "value", void 0);

alias("hide")(Show);

customAttribute("show")(Show);

const mi = [ TemplateCompiler, s.DirtyChecker, NodeObserverLocator ];

const gi = [ exports.RefAttributePattern, exports.DotSeparatedAttributePattern, bs, vs, Ft ];

const xi = [ exports.AtPrefixedTriggerAttributePattern, exports.ColonPrefixedBindAttributePattern ];

const vi = [ exports.DefaultBindingCommand, exports.OneTimeBindingCommand, exports.FromViewBindingCommand, exports.ToViewBindingCommand, exports.TwoWayBindingCommand, exports.ForBindingCommand, As, exports.TriggerBindingCommand, exports.CaptureBindingCommand, exports.ClassBindingCommand, exports.StyleBindingCommand, exports.AttrBindingCommand, Bs ];

const bi = [ DebounceBindingBehavior, OneTimeBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, SignalBindingBehavior, ThrottleBindingBehavior, TwoWayBindingBehavior, SanitizeValueConverter, If, Else, Repeat, With, exports.Switch, exports.Case, exports.DefaultCase, exports.PromiseTemplateController, exports.PendingTemplateController, exports.FulfilledTemplateController, exports.RejectedTemplateController, Us, Gs, Ks, AttrBindingBehavior, SelfBindingBehavior, UpdateTriggerBindingBehavior, AuCompose, Portal, Focus, Show, exports.AuSlot ];

const wi = [ exports.PropertyBindingRenderer, exports.IteratorBindingRenderer, exports.RefBindingRenderer, exports.InterpolationBindingRenderer, exports.SetPropertyRenderer, exports.CustomElementRenderer, exports.CustomAttributeRenderer, exports.TemplateControllerRenderer, exports.LetElementRenderer, exports.ListenerBindingRenderer, exports.AttributeBindingRenderer, exports.SetAttributeRenderer, exports.SetClassAttributeRenderer, exports.SetStyleAttributeRenderer, exports.StylePropertyBindingRenderer, exports.TextBindingRenderer, exports.SpreadRenderer ];

const yi = /*@__PURE__*/ createConfiguration(t.noop);

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
            return e.register(K(s.ICoercionConfiguration, i.coercingOptions), ...mi, ...bi, ...gi, ...vi, ...wi);
        },
        customize(e) {
            return createConfiguration(e ?? t);
        }
    };
}

function children(t, e) {
    if (!Ai) {
        Ai = true;
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
        let l = as.getAnnotation(r, n);
        if (l == null) {
            as.annotate(r, n, l = []);
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
    constructor(t, e, s, i = defaultChildQuery, n = defaultChildFilter, r = defaultChildMap, l = ki) {
        this.Xi = void 0;
        this.rt = defaultChildQuery;
        this.Qi = defaultChildFilter;
        this.Yi = defaultChildMap;
        this.isBound = false;
        this.N = t;
        this.obj = e;
        this.cb = s;
        this.rt = i;
        this.Qi = n;
        this.Yi = r;
        this.Y = l;
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
        this.Cs.observe(this.Zi, this.Y);
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
        return filterChildren(this.N, this.rt, this.Qi, this.Yi);
    }
}

const ki = {
    childList: true
};

const defaultChildQuery = t => t.host.childNodes;

const defaultChildFilter = (t, e, s) => !!s;

const defaultChildMap = (t, e, s) => s;

const Ci = {
    optional: true
};

const filterChildren = (t, e, s, i) => {
    const n = e(t);
    const r = n.length;
    const l = [];
    let a;
    let h;
    let c;
    let u = 0;
    for (;u < r; ++u) {
        a = n[u];
        h = findElementControllerFor(a, Ci);
        c = h?.viewModel ?? null;
        if (s(a, h, c)) {
            l.push(i(a, h, c));
        }
    }
    return l;
};

class ChildrenLifecycleHooks {
    constructor(t) {
        this.ot = t;
    }
    register(t) {
        K(St, this).register(t);
    }
    hydrating(t, e) {
        const s = this.ot;
        const i = new ChildrenBinding(e, t, t[s.callback ?? `${l(s.name)}Changed`], s.query ?? defaultChildQuery, s.filter ?? defaultChildFilter, s.map ?? defaultChildMap, s.options ?? ki);
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

let Ai = false;

exports.AdoptedStyleSheetsStyles = AdoptedStyleSheetsStyles;

exports.AppRoot = AppRoot;

exports.AppTask = nt;

exports.AttrBindingBehavior = AttrBindingBehavior;

exports.AttrSyntax = AttrSyntax;

exports.AttributeBinding = AttributeBinding;

exports.AttributeBindingInstruction = AttributeBindingInstruction;

exports.AttributeNSAccessor = AttributeNSAccessor;

exports.AttributePattern = xs;

exports.AuCompose = AuCompose;

exports.AuSlotsInfo = AuSlotsInfo;

exports.Aurelia = Aurelia;

exports.Bindable = W;

exports.BindableDefinition = BindableDefinition;

exports.BindablesInfo = BindablesInfo;

exports.BindingBehavior = Y;

exports.BindingBehaviorDefinition = BindingBehaviorDefinition;

exports.BindingCommand = Cs;

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

exports.CustomAttribute = ft;

exports.CustomAttributeDefinition = CustomAttributeDefinition;

exports.CustomElement = as;

exports.CustomElementDefinition = CustomElementDefinition;

exports.DataAttributeAccessor = DataAttributeAccessor;

exports.DebounceBindingBehavior = DebounceBindingBehavior;

exports.DefaultBindingLanguage = vi;

exports.DefaultBindingSyntax = gi;

exports.DefaultComponents = mi;

exports.DefaultRenderers = wi;

exports.DefaultResources = bi;

exports.Else = Else;

exports.EventModifier = EventModifier;

exports.EventModifierRegistration = Ft;

exports.ExpressionWatcher = ExpressionWatcher;

exports.FlushQueue = FlushQueue;

exports.Focus = Focus;

exports.FragmentNodeSequence = FragmentNodeSequence;

exports.FromViewBindingBehavior = FromViewBindingBehavior;

exports.HydrateAttributeInstruction = HydrateAttributeInstruction;

exports.HydrateElementInstruction = HydrateElementInstruction;

exports.HydrateLetElementInstruction = HydrateLetElementInstruction;

exports.HydrateTemplateController = HydrateTemplateController;

exports.IAppRoot = cs;

exports.IAppTask = it;

exports.IAttrMapper = _s;

exports.IAttributeParser = ps;

exports.IAttributePattern = ds;

exports.IAuSlotWatcher = Wt;

exports.IAuSlotsInfo = $t;

exports.IAurelia = us;

exports.IController = je;

exports.IEventModifier = Ht;

exports.IEventTarget = Qe;

exports.IFlushQueue = wt;

exports.IHistory = ss;

exports.IHydrationContext = ze;

exports.IInstruction = fe;

exports.IKeyMapping = qt;

exports.ILifecycleHooks = St;

exports.ILocation = es;

exports.IModifiedEventHandlerCreator = Dt;

exports.INode = Xe;

exports.IPlatform = rt;

exports.IRenderLocation = Ye;

exports.IRenderer = pe;

exports.IRendering = ke;

exports.ISVGAnalyzer = Ss;

exports.ISanitizer = Xs;

exports.IShadowDOMGlobalStyles = mt;

exports.IShadowDOMStyles = pt;

exports.ISyntaxInterpreter = fs;

exports.ITemplateCompiler = de;

exports.ITemplateCompilerHooks = hi;

exports.ITemplateElementFactory = Qs;

exports.IViewFactory = Ot;

exports.IWindow = ts;

exports.If = If;

exports.InstructionType = ue;

exports.InterpolationBinding = InterpolationBinding;

exports.InterpolationInstruction = InterpolationInstruction;

exports.InterpolationPartBinding = InterpolationPartBinding;

exports.Interpretation = Interpretation;

exports.IteratorBindingInstruction = IteratorBindingInstruction;

exports.LetBinding = LetBinding;

exports.LetBindingInstruction = LetBindingInstruction;

exports.LifecycleHooks = Tt;

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

exports.ShortHandBindingSyntax = xi;

exports.SignalBindingBehavior = SignalBindingBehavior;

exports.SpreadBindingInstruction = SpreadBindingInstruction;

exports.SpreadElementPropBindingInstruction = SpreadElementPropBindingInstruction;

exports.StandardConfiguration = yi;

exports.State = We;

exports.StyleAttributeAccessor = StyleAttributeAccessor;

exports.StyleConfiguration = gt;

exports.StyleElementStyles = StyleElementStyles;

exports.StylePropertyBindingInstruction = StylePropertyBindingInstruction;

exports.TemplateCompiler = TemplateCompiler;

exports.TemplateCompilerHooks = fi;

exports.TextBindingInstruction = TextBindingInstruction;

exports.ThrottleBindingBehavior = ThrottleBindingBehavior;

exports.ToViewBindingBehavior = ToViewBindingBehavior;

exports.TwoWayBindingBehavior = TwoWayBindingBehavior;

exports.UpdateTriggerBindingBehavior = UpdateTriggerBindingBehavior;

exports.ValueAttributeObserver = ValueAttributeObserver;

exports.ValueConverter = vt;

exports.ValueConverterDefinition = ValueConverterDefinition;

exports.ViewFactory = ViewFactory;

exports.Watch = at;

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
