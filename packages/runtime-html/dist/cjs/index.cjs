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

const w = "IsProperty";

const y = "pending";

const k = "running";

const C = s.AccessorType.Observer;

const A = s.AccessorType.Node;

const B = s.AccessorType.Layout;

const S = 1;

const _ = 2;

const R = 4;

const I = 6;

const T = 8;

const E = /*@__PURE__*/ c({
    oneTime: S,
    toView: _,
    fromView: R,
    twoWay: I,
    default: T
});

const P = e.Metadata.getOwn;

const L = e.Metadata.hasOwn;

const M = e.Metadata.define;

const {annotation: q} = t.Protocol;

const D = q.keyFor;

const H = q.appendTo;

const F = q.getKeys;

function bindable(t, e) {
    let s;
    function decorator(t, e) {
        if (arguments.length > 1) {
            s.name = e;
        }
        M(O, BindableDefinition.create(e, t, s), t.constructor, e);
        H(t.constructor, V.keyFrom(e));
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
    return t.startsWith(O);
}

const O = /*@__PURE__*/ D("bindable");

const V = c({
    name: O,
    keyFrom: t => `${O}:${t}`,
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
        const s = O.length + 1;
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
            h = F(c).filter(isBindableAnnotation);
            a = h.length;
            for (u = 0; u < a; ++u) {
                i[l++] = P(O, c, h[u].slice(s));
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
    $.define(t, e);
}

const $ = {
    key: /*@__PURE__*/ D("coercer"),
    define(t, e) {
        M($.key, t[e].bind(t), t);
    },
    for(t) {
        return P($.key, t);
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
            l = typeof e === "function" ? e.bind(r) : $.for(r) ?? t.noop;
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

const N = t.DI.createInterface;

const W = t.Registration.singleton;

const j = t.Registration.aliasTo;

const z = t.Registration.instance;

t.Registration.callback;

const U = t.Registration.transient;

const registerResolver = (t, e, s) => t.registerResolver(e, s);

function alias(...t) {
    return function(e) {
        const s = D("aliases");
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
        return K.define(t, e);
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
        return new BindingBehaviorDefinition(s, t.firstDefined(getBehaviorAnnotation(s, "name"), i), t.mergeArrays(getBehaviorAnnotation(s, "aliases"), n.aliases, s.aliases), K.keyFrom(i));
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getBindingBehaviorKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : W(s, s), j(s, i), ...n.map((t => j(s, getBindingBehaviorKeyFrom(t)))));
        }
    }
}

const G = /*@__PURE__*/ t.getResourceKeyFor("binding-behavior");

const getBehaviorAnnotation = (t, e) => P(D(e), t);

const getBindingBehaviorKeyFrom = t => `${G}:${t}`;

const K = c({
    name: G,
    keyFrom: getBindingBehaviorKeyFrom,
    isType(t) {
        return isFunction(t) && L(G, t);
    },
    define(e, s) {
        const i = BindingBehaviorDefinition.create(e, s);
        const n = i.Type;
        M(G, i, n);
        M(t.resourceBaseName, i, n);
        return n;
    },
    getDefinition(t) {
        const e = P(G, t);
        if (e === void 0) {
            throw createMappedError(151, t);
        }
        return e;
    },
    find(t, e) {
        const s = getBindingBehaviorKeyFrom(e);
        const i = t.find(s);
        return i == null ? null : P(G, i) ?? null;
    },
    get(e, s) {
        return e.get(t.resource(getBindingBehaviorKeyFrom(s)));
    }
});

const X = new Map;

class BindingModeBehavior {
    bind(t, e) {
        X.set(e, e.mode);
        e.mode = this.mode;
    }
    unbind(t, e) {
        e.mode = X.get(e);
        X.delete(e);
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
        return I;
    }
}

bindingBehavior("oneTime")(OneTimeBindingBehavior);

bindingBehavior("toView")(ToViewBindingBehavior);

bindingBehavior("fromView")(FromViewBindingBehavior);

bindingBehavior("twoWay")(TwoWayBindingBehavior);

const Q = new WeakMap;

const Y = 200;

class DebounceBindingBehavior {
    constructor() {
        this.p = t.resolve(t.IPlatform);
    }
    bind(e, s, i, n) {
        const r = {
            type: "debounce",
            delay: i ?? Y,
            now: this.p.performanceNow,
            queue: this.p.taskQueue,
            signals: isString(n) ? [ n ] : n ?? t.emptyArray
        };
        const l = s.limit?.(r);
        if (l == null) ; else {
            Q.set(s, l);
        }
    }
    unbind(t, e) {
        Q.get(e)?.dispose();
        Q.delete(e);
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

const Z = new WeakMap;

const J = 200;

class ThrottleBindingBehavior {
    constructor() {
        ({performanceNow: this.C, taskQueue: this.A} = t.resolve(t.IPlatform));
    }
    bind(e, s, i, n) {
        const r = {
            type: "throttle",
            delay: i ?? J,
            now: this.C,
            queue: this.A,
            signals: isString(n) ? [ n ] : n ?? t.emptyArray
        };
        const l = s.limit?.(r);
        if (l == null) ; else {
            Z.set(s, l);
        }
    }
    unbind(t, e) {
        Z.get(e)?.dispose();
        Z.delete(e);
    }
}

bindingBehavior("throttle")(ThrottleBindingBehavior);

const tt = /*@__PURE__*/ N("IAppTask");

class $AppTask {
    constructor(t, e, s) {
        this.c = void 0;
        this.slot = t;
        this.k = e;
        this.cb = s;
    }
    register(t) {
        return this.c = t.register(z(tt, this));
    }
    run() {
        const t = this.k;
        const e = this.cb;
        return t === null ? e() : e(this.c.get(t));
    }
}

const et = c({
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

const st = t.IPlatform;

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
        it.add(h, a);
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

const it = /*@__PURE__*/ (() => {
    const e = new WeakMap;
    return c({
        add(t, s) {
            let i = e.get(t);
            if (i == null) {
                e.set(t, i = []);
            }
            i.push(s);
        },
        getDefinitions(s) {
            return e.get(s) ?? t.emptyArray;
        }
    });
})();

const nt = "element";

const rt = "attribute";

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
        return rt;
    }
    constructor(t, e, s, i, n, r, l, h, a, c, u) {
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
        this.containerStrategy = u;
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
        return new CustomAttributeDefinition(s, t.firstDefined(getAttributeAnnotation(s, "name"), i), t.mergeArrays(getAttributeAnnotation(s, "aliases"), n.aliases, s.aliases), getAttributeKeyFrom(i), t.firstDefined(getAttributeAnnotation(s, "defaultBindingMode"), n.defaultBindingMode, s.defaultBindingMode, _), t.firstDefined(getAttributeAnnotation(s, "isTemplateController"), n.isTemplateController, s.isTemplateController, false), V.from(s, ...V.getAll(s), getAttributeAnnotation(s, "bindables"), s.bindables, n.bindables), t.firstDefined(getAttributeAnnotation(s, "noMultiBindings"), n.noMultiBindings, s.noMultiBindings, false), t.mergeArrays(it.getDefinitions(s), s.watches), t.mergeArrays(getAttributeAnnotation(s, "dependencies"), n.dependencies, s.dependencies), t.firstDefined(getAttributeAnnotation(s, "containerStrategy"), n.containerStrategy, s.containerStrategy, "reuse"));
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getAttributeKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : U(s, s), j(s, i), ...n.map((t => j(s, getAttributeKeyFrom(t)))));
        }
    }
    toString() {
        return `au:ca:${this.name}`;
    }
}

const ot = /*@__PURE__*/ t.getResourceKeyFor("custom-attribute");

const getAttributeKeyFrom = t => `${ot}:${t}`;

const getAttributeAnnotation = (t, e) => P(D(e), t);

const isAttributeType = t => isFunction(t) && L(ot, t);

const findAttributeControllerFor = (t, e) => getRef(t, getAttributeKeyFrom(e)) ?? void 0;

const defineAttribute = (e, s) => {
    const i = CustomAttributeDefinition.create(e, s);
    const n = i.Type;
    M(ot, i, n);
    M(t.resourceBaseName, i, n);
    return n;
};

const getAttributeDefinition = t => {
    const e = P(ot, t);
    if (e === void 0) {
        throw createMappedError(759, t);
    }
    return e;
};

const lt = c({
    name: ot,
    keyFrom: getAttributeKeyFrom,
    isType: isAttributeType,
    for: findAttributeControllerFor,
    define: defineAttribute,
    getDefinition: getAttributeDefinition,
    annotate(t, e, s) {
        M(D(e), s, t);
    },
    getAnnotation: getAttributeAnnotation,
    find(t, e) {
        const s = getAttributeKeyFrom(e);
        const i = t.find(s);
        return i === null ? null : P(ot, i) ?? null;
    }
});

const ht = /*@__PURE__*/ N("ILifecycleHooks");

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
}

const at = /*@__PURE__*/ (() => {
    const e = new WeakMap;
    const s = new WeakMap;
    return c({
        define(e, i) {
            const n = LifecycleHooksDefinition.create(e, i);
            const r = n.Type;
            s.set(r, n);
            return t.Registrable.define(r, (t => {
                W(ht, r).register(t);
            }));
        },
        resolve(t) {
            let i = e.get(t);
            if (i === void 0) {
                e.set(t, i = new LifecycleHooksLookupImpl);
                const n = t.root;
                const r = n === t ? t.getAll(ht) : t.has(ht, false) ? n.getAll(ht).concat(t.getAll(ht)) : n.getAll(ht);
                let l;
                let h;
                let a;
                let c;
                let u;
                for (l of r) {
                    h = s.get(l.constructor);
                    a = new LifecycleHooksEntry(h, l);
                    for (c of h.propertyNames) {
                        u = i[c];
                        if (u === void 0) {
                            i[c] = [ a ];
                        } else {
                            u.push(a);
                        }
                    }
                }
            }
            return i;
        }
    });
})();

class LifecycleHooksLookupImpl {}

function lifecycleHooks() {
    return function decorator(t) {
        return at.define({}, t);
    };
}

function valueConverter(t) {
    return function(e) {
        return ut.define(t, e);
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
        return new ValueConverterDefinition(s, t.firstDefined(getConverterAnnotation(s, "name"), i), t.mergeArrays(getConverterAnnotation(s, "aliases"), n.aliases, s.aliases), ut.keyFrom(i));
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getValueConverterKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : W(s, s), j(s, i), ...n.map((t => j(s, getValueConverterKeyFrom(t)))));
        }
    }
}

const ct = /*@__PURE__*/ t.getResourceKeyFor("value-converter");

const getConverterAnnotation = (t, e) => P(D(e), t);

const getValueConverterKeyFrom = t => `${ct}:${t}`;

const ut = c({
    name: ct,
    keyFrom: getValueConverterKeyFrom,
    isType(t) {
        return isFunction(t) && L(ct, t);
    },
    define(e, s) {
        const i = ValueConverterDefinition.create(e, s);
        const n = i.Type;
        M(ct, i, n);
        M(t.resourceBaseName, i, n);
        return n;
    },
    getDefinition(t) {
        const e = P(ct, t);
        if (e === void 0) {
            throw createMappedError(152, t);
        }
        return e;
    },
    annotate(t, e, s) {
        M(D(e), s, t);
    },
    getAnnotation: getConverterAnnotation,
    find(t, e) {
        const s = getValueConverterKeyFrom(e);
        const i = t.find(s);
        return i == null ? null : P(ct, i) ?? null;
    },
    get(e, s) {
        return e.get(t.resource(getValueConverterKeyFrom(s)));
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
        if (t !== s.astEvaluate(i.ast, i.s, i, null)) {
            this.v = t;
            this.B.add(this);
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

const ft = new WeakMap;

const dt = new WeakMap;

class ResourceLookup {}

const pt = /*@__PURE__*/ N("IFlushQueue", (t => t.singleton(FlushQueue)));

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
    return this.l.root.get(s.ISignaler);
}

function evaluatorGetConverter(t) {
    let e = ft.get(this);
    if (e == null) {
        ft.set(this, e = new ResourceLookup);
    }
    return e[t] ??= ut.get(this.l, t);
}

function evaluatorGetBehavior(t) {
    let e = dt.get(this);
    if (e == null) {
        dt.set(this, e = new ResourceLookup);
    }
    return e[t] ??= K.get(this.l, t);
}

function flushItem(t, e, s) {
    s.delete(t);
    t.flush();
}

const mt = new WeakSet;

const mixingBindingLimited = (t, e) => {
    defineHiddenProp(t.prototype, "limit", (function(t) {
        if (mt.has(this)) {
            throw createMappedError(9996);
        }
        mt.add(this);
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
                mt.delete(this);
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
        l = i?.status === y;
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
        a = i?.status === y;
        u();
        if (a) {
            callOriginalCallback();
        }
    };
    return fn;
};

const gt = {
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
        this.I = null;
        this.v = void 0;
        this.boundFn = false;
        this.l = e;
        this.ast = n;
        this.T = t;
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
            const s = this.T.state !== Me;
            if (s) {
                t = this.I;
                this.I = this.A.queueTask((() => {
                    this.I = null;
                    this.updateTarget(e);
                }), gt);
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
        this.I?.cancel();
        this.I = null;
        this.obs.clearAll();
    }
}

mixinUseScope(AttributeBinding);

mixingBindingLimited(AttributeBinding, (() => "updateTarget"));

s.connectable(AttributeBinding);

mixinAstEvaluator(true)(AttributeBinding);

const xt = {
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
        this.I = null;
        this.T = t;
        this.oL = s;
        this.A = i;
        this.P = s.getAccessor(r, l);
        const a = n.expressions;
        const c = this.partBindings = Array(a.length);
        const u = a.length;
        let f = 0;
        for (;u > f; ++f) {
            c[f] = new InterpolationPartBinding(a[f], r, l, e, s, this);
        }
    }
    L() {
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
        const r = this.P;
        const l = this.T.state !== Me && (r.type & B) > 0;
        let h;
        if (l) {
            h = this.I;
            this.I = this.A.queueTask((() => {
                this.I = null;
                r.setValue(i, this.target, this.targetProperty);
            }), xt);
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
        this.I?.cancel();
        this.I = null;
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
        this.owner.L();
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

const vt = {
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
        this.I = null;
        this.v = "";
        this.M = false;
        this.boundFn = false;
        this.strict = true;
        this.l = e;
        this.T = t;
        this.oL = s;
        this.A = i;
    }
    updateTarget(t) {
        const e = this.target;
        const s = this.v;
        this.v = t;
        if (this.M) {
            s.parentNode?.removeChild(s);
            this.M = false;
        }
        if (t instanceof this.p.Node) {
            e.parentNode?.insertBefore(t, e);
            t = "";
            this.M = true;
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
            this.I?.cancel();
            this.I = null;
            return;
        }
        const e = this.T.state !== Me;
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
        const t = this.v = s.astEvaluate(this.ast, this.s, this, (this.mode & _) > 0 ? this : null);
        this.obs.clear();
        if (isArray(t)) {
            this.observeCollection(t);
        }
        const e = this.T.state !== Me;
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
        }), vt);
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
        this.target = this.H ? t.bindingContext : t.overrideContext;
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
        this.P = void 0;
        this.I = null;
        this.F = null;
        this.boundFn = false;
        this.l = e;
        this.T = t;
        this.A = i;
        this.oL = s;
    }
    updateTarget(t) {
        this.P.setValue(t, this.target, this.targetProperty);
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
        const e = this.T.state !== Me && (this.P.type & B) > 0;
        if (e) {
            bt = this.I;
            this.I = this.A.queueTask((() => {
                this.updateTarget(t);
                this.I = null;
            }), wt);
            bt?.cancel();
            bt = null;
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
        let n = this.P;
        if (!n) {
            if (i & R) {
                n = e.getObserver(this.target, this.targetProperty);
            } else {
                n = e.getAccessor(this.target, this.targetProperty);
            }
            this.P = n;
        }
        const r = (i & _) > 0;
        if (i & (_ | S)) {
            this.updateTarget(s.astEvaluate(this.ast, this.s, this, r ? this : null));
        }
        if (i & R) {
            n.subscribe(this.F ??= new BindingTargetSubscriber(this, this.l.get(pt)));
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

mixingBindingLimited(PropertyBinding, (t => t.mode & R ? "updateSource" : "updateTarget"));

s.connectable(PropertyBinding);

mixinAstEvaluator(true, false)(PropertyBinding);

let bt = null;

const wt = {
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
        this.O = null;
        this.l = t;
        this.V = n;
        this.O = r;
    }
    callSource(t) {
        const e = this.s.overrideContext;
        e.$event = t;
        let i = s.astEvaluate(this.ast, this.s, this, null);
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
        s.astBind(this.ast, t, this);
        this.target.addEventListener(this.targetEvent, this, this.V);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        s.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.target.removeEventListener(this.targetEvent, this, this.V);
    }
}

mixinUseScope(ListenerBinding);

mixingBindingLimited(ListenerBinding, (() => "callSource"));

mixinAstEvaluator(true, true)(ListenerBinding);

const yt = /*@__PURE__*/ N("IEventModifier");

const kt = /*@__PURE__*/ N("IKeyMapping", (t => t.instance({
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
        this.$ = t.resolve(kt);
        this.N = [ "left", "middle", "right" ];
    }
    static register(t) {
        t.register(W(yt, ModifiedMouseEventHandler));
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
                    if (t.button !== this.N.indexOf(n)) return false;
                    continue;
                }
                if (this.$.meta.includes(n) && t[`${n}Key`] !== true) {
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
        this.$ = t.resolve(kt);
        this.type = [ "keydown", "keyup" ];
    }
    static register(t) {
        t.register(W(yt, ModifiedKeyboardEventHandler));
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
            if (s) t.preventDefault();
            if (i) t.stopPropagation();
            return true;
        };
    }
}

const Ct = /*@__PURE__*/ N("IEventModifierHandler", (t => t.instance({
    getHandler: () => null
})));

class EventModifier {
    constructor() {
        this.W = t.resolve(t.all(yt)).reduce(((t, e) => {
            const s = isArray(e.type) ? e.type : [ e.type ];
            s.forEach((s => t[s] = e));
            return t;
        }), {});
    }
    static register(t) {
        t.register(W(Ct, EventModifier));
    }
    getHandler(t, e) {
        return isString(e) ? this.W[t]?.getHandler(e) ?? null : null;
    }
}

const At = {
    register(t) {
        t.register(EventModifier, ModifiedMouseEventHandler, ModifiedKeyboardEventHandler);
    }
};

const Bt = /*@__PURE__*/ N("IViewFactory");

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

const St = "au-start";

const _t = "au-end";

const createElement = (t, e) => t.document.createElement(e);

const createComment = (t, e) => t.document.createComment(e);

const createLocation = t => {
    const e = createComment(t, _t);
    e.$start = createComment(t, St);
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

const Rt = "default";

const It = "au-slot";

const Tt = /*@__PURE__*/ N("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

const Et = /*@__PURE__*/ N("IAuSlotWatcher");

class AuSlotWatcherBinding {
    constructor(e, s, i, n) {
        this.G = new Set;
        this.K = t.emptyArray;
        this.isBound = false;
        this.cb = (this.o = e)[s];
        this.slotName = i;
        this.X = n;
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
        const s = this.K;
        const i = [];
        let n;
        let r;
        for (n of this.G) {
            for (r of n === t ? e : n.nodes) {
                if (this.X === "*" || isElement(r) && r.matches(this.X)) {
                    i[i.length] = r;
                }
            }
        }
        if (i.length !== s.length || i.some(((t, e) => t !== s[e]))) {
            this.K = i;
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
        this.Y = t;
    }
    register(t) {
        z(ht, this).register(t);
    }
    hydrating(t, e) {
        const s = this.Y;
        const i = new AuSlotWatcherBinding(t, s.callback ?? `${l(s.name)}Changed`, s.slotName ?? "default", s.query ?? "*");
        g(t, s.name, {
            enumerable: true,
            configurable: true,
            get: u((() => i.getValue()), {
                getObserver: () => i
            }),
            set: () => {}
        });
        z(Et, i).register(e.container);
        e.addBinding(i);
    }
}

function slotted(t, e) {
    if (!Pt) {
        Pt = true;
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
        let a = rs.getAnnotation(h, i);
        if (a == null) {
            rs.annotate(h, i, a = []);
        }
        a.push(new SlottedLifecycleHooks(l));
    }
    return decorator;
}

let Pt = false;

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
                  case Yt:
                    renderSpreadInstruction(e + 1);
                    break;

                  case Zt:
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
        if (t.vmKind !== Ee) {
            throw createMappedError(9998);
        }
        this.$controller.addChild(t);
    }
}

const Lt = "ra";

const Mt = "rb";

const qt = "rc";

const Dt = "rd";

const Ht = "re";

const Ft = "rf";

const Ot = "rg";

const Vt = "ri";

const $t = "rj";

const Nt = "rk";

const Wt = "rl";

const jt = "ha";

const zt = "hb";

const Ut = "hc";

const Gt = "hd";

const Kt = "he";

const Xt = "hf";

const Qt = "hg";

const Yt = "hs";

const Zt = "hp";

const Jt = /*@__PURE__*/ c({
    hydrateElement: Lt,
    hydrateAttribute: Mt,
    hydrateTemplateController: qt,
    hydrateLetElement: Dt,
    setProperty: Ht,
    interpolation: Ft,
    propertyBinding: Ot,
    letBinding: Vt,
    refBinding: $t,
    iteratorBinding: Nt,
    multiAttr: Wt,
    textBinding: jt,
    listenerBinding: zt,
    attributeBinding: Ut,
    stylePropertyBinding: Gt,
    setAttribute: Kt,
    setClassAttribute: Xt,
    setStyleAttribute: Qt,
    spreadBinding: Yt,
    spreadElementProp: Zt
});

const te = /*@__PURE__*/ N("Instruction");

function isInstruction(t) {
    const e = t.type;
    return isString(e) && e.length === 2;
}

class InterpolationInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Ft;
    }
}

class PropertyBindingInstruction {
    constructor(t, e, s) {
        this.from = t;
        this.to = e;
        this.mode = s;
        this.type = Ot;
    }
}

class IteratorBindingInstruction {
    constructor(t, e, s) {
        this.forOf = t;
        this.to = e;
        this.props = s;
        this.type = Nt;
    }
}

class RefBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = $t;
    }
}

class SetPropertyInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = Ht;
    }
}

class MultiAttrInstruction {
    constructor(t, e, s) {
        this.value = t;
        this.to = e;
        this.command = s;
        this.type = Wt;
    }
}

class HydrateElementInstruction {
    constructor(t, e, s, i, n, r) {
        this.res = t;
        this.props = e;
        this.projections = s;
        this.containerless = i;
        this.captures = n;
        this.data = r;
        this.type = Lt;
    }
}

class HydrateAttributeInstruction {
    constructor(t, e, s) {
        this.res = t;
        this.alias = e;
        this.props = s;
        this.type = Mt;
    }
}

class HydrateTemplateController {
    constructor(t, e, s, i) {
        this.def = t;
        this.res = e;
        this.alias = s;
        this.props = i;
        this.type = qt;
    }
}

class HydrateLetElementInstruction {
    constructor(t, e) {
        this.instructions = t;
        this.toBindingContext = e;
        this.type = Dt;
    }
}

class LetBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Vt;
    }
}

class TextBindingInstruction {
    constructor(t) {
        this.from = t;
        this.type = jt;
    }
}

class ListenerBindingInstruction {
    constructor(t, e, s, i) {
        this.from = t;
        this.to = e;
        this.capture = s;
        this.modifier = i;
        this.type = zt;
    }
}

class StylePropertyBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Gt;
    }
}

class SetAttributeInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = Kt;
    }
}

class SetClassAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = Xt;
    }
}

class SetStyleAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = Qt;
    }
}

class AttributeBindingInstruction {
    constructor(t, e, s) {
        this.attr = t;
        this.from = e;
        this.to = s;
        this.type = Ut;
    }
}

class SpreadBindingInstruction {
    constructor() {
        this.type = Yt;
    }
}

class SpreadElementPropBindingInstruction {
    constructor(t) {
        this.instructions = t;
        this.type = Zt;
    }
}

const ee = /*@__PURE__*/ N("ITemplateCompiler");

const se = /*@__PURE__*/ N("IRenderer");

function renderer(e) {
    return function decorator(s) {
        g(s.prototype, "target", {
            configurable: true,
            get() {
                return e;
            }
        });
        return t.Registrable.define(s, (function(t) {
            W(se, this).register(t);
        }));
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

exports.SetPropertyRenderer = __decorate([ renderer(Ht) ], exports.SetPropertyRenderer);

exports.CustomElementRenderer = class CustomElementRenderer {
    constructor() {
        this.r = t.resolve(ue);
    }
    render(t, e, s, i, n, r) {
        let l;
        let h;
        let a;
        const c = s.res;
        const u = s.projections;
        const f = t.container;
        switch (typeof c) {
          case "string":
            l = rs.find(f, c);
            if (l == null) {
                throw createMappedError(752, s, t);
            }
            break;

          default:
            l = c;
        }
        const p = s.containerless || l.containerless;
        const m = p ? convertToRenderLocation(e) : null;
        const g = createElementContainer(i, t, e, s, m, u == null ? void 0 : new AuSlotsInfo(d(u)));
        h = g.invoke(l.Type);
        a = Controller.$el(g, h, e, s, l, m);
        setRef(e, l.key, a);
        const x = this.r.renderers;
        const v = s.props;
        const b = v.length;
        let w = 0;
        let y;
        while (b > w) {
            y = v[w];
            x[y.type].render(t, a, y, i, n, r);
            ++w;
        }
        t.addChild(a);
    }
};

exports.CustomElementRenderer = __decorate([ renderer(Lt) ], exports.CustomElementRenderer);

exports.CustomAttributeRenderer = class CustomAttributeRenderer {
    constructor() {
        this.r = t.resolve(ue);
    }
    render(t, e, s, i, n, r) {
        let l = t.container;
        let h;
        switch (typeof s.res) {
          case "string":
            h = lt.find(l, s.res);
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

exports.CustomAttributeRenderer = __decorate([ renderer(Mt) ], exports.CustomAttributeRenderer);

exports.TemplateControllerRenderer = class TemplateControllerRenderer {
    constructor() {
        this.r = t.resolve(ue);
    }
    render(t, e, s, i, n, r) {
        let l = t.container;
        let h;
        switch (typeof s.res) {
          case "string":
            h = lt.find(l, s.res);
            if (h == null) {
                throw createMappedError(754, s, t);
            }
            break;

          default:
            h = s.res;
        }
        const a = this.r.getViewFactory(s.def, h.containerStrategy === "new" ? l.createChild({
            inheritParentResources: true
        }) : l);
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

exports.TemplateControllerRenderer = __decorate([ renderer(qt) ], exports.TemplateControllerRenderer);

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
            f = ensureExpression(n, u.from, w);
            t.addBinding(new LetBinding(a, r, f, u.to, h));
            ++d;
        }
    }
};

exports.LetElementRenderer = __decorate([ renderer(Dt) ], exports.LetElementRenderer);

exports.RefBindingRenderer = class RefBindingRenderer {
    render(t, e, s, i, n) {
        t.addBinding(new RefBinding(t.container, ensureExpression(n, s.from, w), getRefTarget(e, s.to)));
    }
};

exports.RefBindingRenderer = __decorate([ renderer($t) ], exports.RefBindingRenderer);

exports.InterpolationBindingRenderer = class InterpolationBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new InterpolationBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, x), getTarget(e), s.to, _));
    }
};

exports.InterpolationBindingRenderer = __decorate([ renderer(Ft) ], exports.InterpolationBindingRenderer);

exports.PropertyBindingRenderer = class PropertyBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, w), getTarget(e), s.to, s.mode));
    }
};

exports.PropertyBindingRenderer = __decorate([ renderer(Ot) ], exports.PropertyBindingRenderer);

exports.IteratorBindingRenderer = class IteratorBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.forOf, v), getTarget(e), s.to, _));
    }
};

exports.IteratorBindingRenderer = __decorate([ renderer(Nt) ], exports.IteratorBindingRenderer);

exports.TextBindingRenderer = class TextBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, i.domWriteQueue, i, ensureExpression(n, s.from, w), e));
    }
};

exports.TextBindingRenderer = __decorate([ renderer(jt) ], exports.TextBindingRenderer);

const ie = N("IListenerBindingOptions", (t => t.instance({
    prevent: false
})));

exports.ListenerBindingRenderer = class ListenerBindingRenderer {
    constructor() {
        this.tt = t.resolve(Ct);
        this.et = t.resolve(ie);
    }
    render(t, e, s, i, n) {
        t.addBinding(new ListenerBinding(t.container, ensureExpression(n, s.from, b), e, s.to, new ListenerBindingOptions(this.et.prevent, s.capture), this.tt.getHandler(s.to, s.modifier)));
    }
};

exports.ListenerBindingRenderer = __decorate([ renderer(zt) ], exports.ListenerBindingRenderer);

exports.SetAttributeRenderer = class SetAttributeRenderer {
    render(t, e, s) {
        e.setAttribute(s.to, s.value);
    }
};

exports.SetAttributeRenderer = __decorate([ renderer(Kt) ], exports.SetAttributeRenderer);

exports.SetClassAttributeRenderer = class SetClassAttributeRenderer {
    render(t, e, s) {
        addClasses(e.classList, s.value);
    }
};

exports.SetClassAttributeRenderer = __decorate([ renderer(Xt) ], exports.SetClassAttributeRenderer);

exports.SetStyleAttributeRenderer = class SetStyleAttributeRenderer {
    render(t, e, s) {
        e.style.cssText += s.value;
    }
};

exports.SetStyleAttributeRenderer = __decorate([ renderer(Qt) ], exports.SetStyleAttributeRenderer);

exports.StylePropertyBindingRenderer = class StylePropertyBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, w), e.style, s.to, _));
    }
};

exports.StylePropertyBindingRenderer = __decorate([ renderer(Gt) ], exports.StylePropertyBindingRenderer);

exports.AttributeBindingRenderer = class AttributeBindingRenderer {
    render(t, e, s, i, n, r) {
        const l = t.container;
        const h = l.has(Xe, false) ? l.get(Xe) : null;
        t.addBinding(new AttributeBinding(t, l, r, i.domWriteQueue, ensureExpression(n, s.from, w), e, s.attr, h == null ? s.to : s.to.split(/\s/g).map((t => h[t] ?? t)).join(" "), _));
    }
};

exports.AttributeBindingRenderer = __decorate([ renderer(Ut) ], exports.AttributeBindingRenderer);

exports.SpreadRenderer = class SpreadRenderer {
    constructor() {
        this.st = t.resolve(ee);
        this.r = t.resolve(ue);
    }
    render(t, e, s, i, n, r) {
        SpreadBinding.create(t.container.get(Ne), e, void 0, this.r, this.st, i, n, r).forEach((e => t.addBinding(e)));
    }
};

exports.SpreadRenderer = __decorate([ renderer(Yt) ], exports.SpreadRenderer);

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

const ne = "IController";

const re = "IInstruction";

const oe = "IRenderLocation";

const le = "ISlotsInfo";

function createElementContainer(e, s, i, n, r, l) {
    const h = s.container.createChild();
    registerHostNode(h, e, i);
    registerResolver(h, $e, new t.InstanceProvider(ne, s));
    registerResolver(h, te, new t.InstanceProvider(re, n));
    registerResolver(h, Ke, r == null ? he : new RenderLocationProvider(r));
    registerResolver(h, Bt, ae);
    registerResolver(h, Tt, l == null ? ce : new t.InstanceProvider(le, l));
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
    registerResolver(u, $e, new t.InstanceProvider(ne, c));
    registerResolver(u, te, new t.InstanceProvider(re, r));
    registerResolver(u, Ke, h == null ? he : new t.InstanceProvider(oe, h));
    registerResolver(u, Bt, l == null ? ae : new ViewFactoryProvider(l));
    registerResolver(u, Tt, a == null ? ce : new t.InstanceProvider(le, a));
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

const he = new RenderLocationProvider(null);

const ae = new ViewFactoryProvider(null);

const ce = new t.InstanceProvider(le, new AuSlotsInfo(t.emptyArray));

const ue = /*@__PURE__*/ N("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.it ??= this.nt.getAll(se, false).reduce(((t, e) => {
            t[e.target] = e;
            return t;
        }), createLookup());
    }
    constructor() {
        this.rt = new WeakMap;
        this.ot = new WeakMap;
        const e = this.nt = t.resolve(t.IContainer).root;
        this.p = e.get(st);
        this.ep = e.get(s.IExpressionParser);
        this.oL = e.get(s.IObserverLocator);
        this.lt = new FragmentNodeSequence(this.p, this.p.document.createDocumentFragment());
    }
    compile(t, e, s) {
        if (t.needsCompile !== false) {
            const i = this.rt;
            const n = e.get(ee);
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
            return new FragmentNodeSequence(this.p, this.ht(t.template));
        }
        let e;
        let s = false;
        const i = this.ot;
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
            this.ht(e);
            i.set(t, e);
        }
        return e == null ? this.lt : new FragmentNodeSequence(this.p, s ? r.importNode(e, true) : r.adoptNode(e.cloneNode(true)));
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
    ct() {
        return this.p.document.createElement("au-m");
    }
    ht(t) {
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
                e.insertBefore(this.ct(), i);
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
                addListener(this.ut, e, this);
            }
            this.ft = true;
            this.dt?.();
        }
    }));
    defineHiddenProp(s, "unsubscribe", (function(t) {
        if (this.subs.remove(t) && this.subs.count === 0) {
            for (e of this.cf.events) {
                removeListener(this.ut, e, this);
            }
            this.ft = false;
            this.gt?.();
        }
    }));
    defineHiddenProp(s, "useConfig", (function(t) {
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
        this.xt = {};
        this.vt = 0;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (t !== this.v) {
            this.v = t;
            this.bt();
        }
    }
    bt() {
        const t = this.xt;
        const e = ++this.vt;
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
                t[l] = this.vt;
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
    register(e) {
        const s = u({}, ...this.modules);
        const i = defineAttribute({
            name: "class",
            bindables: [ "value" ],
            noMultiBindings: true
        }, class CustomAttributeClass {
            constructor() {
                this.wt = new ClassAttributeAccessor(t.resolve(Ue));
                this.value = "";
            }
            binding() {
                this.valueChanged();
            }
            valueChanged() {
                this.wt.setValue(this.value?.split(/\s+/g).map((t => s[t] || t)) ?? "");
            }
        });
        e.register(i, z(Xe, s));
    }
}

function shadowCSS(...t) {
    return new ShadowDOMRegistry(t);
}

const fe = /*@__PURE__*/ N("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
    if (AdoptedStyleSheetsStyles.supported(t.get(st))) {
        return t.get(AdoptedStyleSheetsStylesFactory);
    }
    return t.get(StyleElementStylesFactory);
}))));

class ShadowDOMRegistry {
    constructor(t) {
        this.css = t;
    }
    register(t) {
        const e = t.get(pe);
        const s = t.get(fe);
        t.register(z(de, s.createStyles(this.css, e)));
    }
}

class AdoptedStyleSheetsStylesFactory {
    constructor() {
        this.p = t.resolve(st);
        this.cache = new Map;
    }
    createStyles(t, e) {
        return new AdoptedStyleSheetsStyles(this.p, t, this.cache, e);
    }
}

class StyleElementStylesFactory {
    constructor() {
        this.p = t.resolve(st);
    }
    createStyles(t, e) {
        return new StyleElementStyles(this.p, t, e);
    }
}

const de = /*@__PURE__*/ N("IShadowDOMStyles");

const pe = /*@__PURE__*/ N("IShadowDOMGlobalStyles", (e => e.instance({
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

const me = {
    shadowDOM(e) {
        return et.creating(t.IContainer, (t => {
            if (e.sharedStyles != null) {
                const s = t.get(fe);
                t.register(z(pe, s.createStyles(e.sharedStyles, null)));
            }
        }));
    }
};

const {enter: ge, exit: xe} = s.ConnectableSwitcher;

const {wrap: ve, unwrap: be} = s.ProxyObservable;

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
            ge(this);
            return this.v = be(this.$get.call(void 0, this.useProxy ? ve(this.obj) : this.obj, this));
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
    constructor(t, e, s, i, n) {
        this.scope = t;
        this.l = e;
        this.oL = s;
        this.isBound = false;
        this.boundFn = false;
        this.obj = t.bindingContext;
        this.yt = i;
        this.cb = n;
    }
    handleChange(t) {
        const e = this.yt;
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
        this.v = s.astEvaluate(this.yt, this.scope, this, this);
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

class Controller {
    get lifecycleHooks() {
        return this.kt;
    }
    get isActive() {
        return (this.state & (Me | qe)) > 0 && (this.state & De) === 0;
    }
    get name() {
        if (this.parent === null) {
            switch (this.vmKind) {
              case Ee:
                return `[${this.definition.name}]`;

              case Te:
                return this.definition.name;

              case Pe:
                return this.viewFactory.name;
            }
        }
        switch (this.vmKind) {
          case Ee:
            return `${this.parent.name}>[${this.definition.name}]`;

          case Te:
            return `${this.parent.name}>${this.definition.name}`;

          case Pe:
            return this.viewFactory.name === this.parent.definition?.name ? `${this.parent.name}[view]` : `${this.parent.name}[view:${this.viewFactory.name}]`;
        }
    }
    get viewModel() {
        return this.Ct;
    }
    set viewModel(t) {
        this.Ct = t;
        this.At = t == null || this.vmKind === Pe ? HooksDefinition.none : new HooksDefinition(t);
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
        this.Bt = false;
        this.hostController = null;
        this.mountTarget = ye;
        this.shadowRoot = null;
        this.nodes = null;
        this.location = null;
        this.kt = null;
        this.state = Le;
        this.St = false;
        this.$initiator = null;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this._t = 0;
        this.Rt = 0;
        this.It = 0;
        this.Ct = n;
        this.At = e === Pe ? HooksDefinition.none : new HooksDefinition(n);
        this.location = l;
        this.r = t.root.get(ue);
        this.coercion = e === Pe ? void 0 : t.get(_e);
    }
    static getCached(t) {
        return we.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (e === void 0) {
            throw createMappedError(500, t);
        }
        return e;
    }
    static $el(e, s, i, n, r = void 0, l = null) {
        if (we.has(s)) {
            return we.get(s);
        }
        {
            r = r ?? getElementDefinition(s.constructor);
        }
        registerResolver(e, r.Type, new t.InstanceProvider(r.key, s, r.Type));
        const h = new Controller(e, Te, r, null, s, i, l);
        const a = e.get(t.optional(Ne));
        if (r.dependencies.length > 0) {
            e.register(...r.dependencies);
        }
        registerResolver(e, Ne, new t.InstanceProvider("IHydrationContext", new HydrationContext(h, n, a)));
        we.set(s, h);
        if (n == null || n.hydrate !== false) {
            h.hE(n, a);
        }
        return h;
    }
    static $attr(e, s, i, n) {
        if (we.has(s)) {
            return we.get(s);
        }
        n = n ?? getAttributeDefinition(s.constructor);
        registerResolver(e, n.Type, new t.InstanceProvider(n.key, s, n.Type));
        const r = new Controller(e, Ee, n, null, s, i, null);
        if (n.dependencies.length > 0) {
            e.register(...n.dependencies);
        }
        we.set(s, r);
        r.Tt();
        return r;
    }
    static $view(t, e = void 0) {
        const s = new Controller(t.container, Pe, null, t, null, null, null);
        s.parent = e ?? null;
        s.Et();
        return s;
    }
    hE(e, i) {
        const n = this.container;
        const r = this.Ct;
        const l = this.definition;
        this.scope = s.Scope.create(r, null, true);
        if (l.watches.length > 0) {
            createWatchers(this, n, l, r);
        }
        createObservers(this, l, r);
        this.kt = at.resolve(n);
        n.register(l.Type);
        if (l.injectable !== null) {
            registerResolver(n, l.injectable, new t.InstanceProvider("definition.injectable", r));
        }
        if (e == null || e.hydrate !== false) {
            this.hS(e);
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
        const e = this.Lt = this.r.compile(this.definition, this.container, t);
        const {shadowOptions: s, hasSlots: i, containerless: n} = e;
        let r = this.location;
        if ((this.hostController = findElementControllerFor(this.host, Se)) !== null) {
            this.host = this.container.root.get(st).document.createElement(this.definition.name);
            if (n && r == null) {
                r = this.location = convertToRenderLocation(this.host);
            }
        }
        setRef(this.host, ss, this);
        setRef(this.host, this.definition.key, this);
        if (s !== null || i) {
            if (r != null) {
                throw createMappedError(501);
            }
            setRef(this.shadowRoot = this.host.attachShadow(s ?? Ie), ss, this);
            setRef(this.shadowRoot, this.definition.key, this);
            this.mountTarget = Ce;
        } else if (r != null) {
            setRef(r, ss, this);
            setRef(r, this.definition.key, this);
            this.mountTarget = Ae;
        } else {
            this.mountTarget = ke;
        }
        this.Ct.$controller = this;
        this.nodes = this.r.createNodes(e);
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
        if (this.At.qt) {
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
        this.kt = at.resolve(this.container);
        if (this.kt.created !== void 0) {
            this.kt.created.forEach(callCreatedHook, this);
        }
        if (this.At.qt) {
            this.Ct.created(this);
        }
    }
    Et() {
        this.Lt = this.r.compile(this.viewFactory.def, this.container, null);
        this.r.render(this, (this.nodes = this.r.createNodes(this.Lt)).findTargets(), this.Lt, void 0);
    }
    activate(e, s, i) {
        switch (this.state) {
          case Le:
          case He:
            if (!(s === null || s.isActive)) {
                return;
            }
            this.state = Me;
            break;

          case qe:
            return;

          case Oe:
            throw createMappedError(502, this.name);

          default:
            throw createMappedError(503, this.name, stringifyState(this.state));
        }
        this.parent = s;
        switch (this.vmKind) {
          case Te:
            this.scope.parent = i ?? null;
            break;

          case Ee:
            this.scope = i ?? null;
            break;

          case Pe:
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
        if (this.vmKind !== Pe && this.kt.binding != null) {
            n = t.onResolveAll(...this.kt.binding.map(callBindingHook, this));
        }
        if (this.At.Ht) {
            n = t.onResolveAll(n, this.Ct.binding(this.$initiator, this.parent));
        }
        if (isPromise(n)) {
            this.Ft();
            n.then((() => {
                this.Bt = true;
                if (this.state !== Me) {
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
        if (this.vmKind !== Pe && this.kt.bound != null) {
            i = t.onResolveAll(...this.kt.bound.map(callBoundHook, this));
        }
        if (this.At.$t) {
            i = t.onResolveAll(i, this.Ct.bound(this.$initiator, this.parent));
        }
        if (isPromise(i)) {
            this.Ft();
            i.then((() => {
                this.isBound = true;
                if (this.state !== Me) {
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
          case ke:
            this.host.append(...t);
            break;

          case Ce:
            this.shadowRoot.append(...t);
            break;

          case Ae:
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
              case ke:
              case Ce:
                this.hostController.Wt(this.host);
                break;

              case Ae:
                this.hostController.Wt(this.location.$start, this.location);
                break;
            }
        }
        switch (this.mountTarget) {
          case ke:
            this.nodes.appendTo(this.host, this.definition != null && this.definition.enhance);
            break;

          case Ce:
            {
                const t = this.container;
                const e = t.has(de, false) ? t.get(de) : t.get(pe);
                e.applyTo(this.shadowRoot);
                this.nodes.appendTo(this.shadowRoot);
                break;
            }

          case Ae:
            this.nodes.insertBefore(this.location);
            break;
        }
        let e = 0;
        let s = void 0;
        if (this.vmKind !== Pe && this.kt.attaching != null) {
            s = t.onResolveAll(...this.kt.attaching.map(callAttachingHook, this));
        }
        if (this.At.jt) {
            s = t.onResolveAll(s, this.Ct.attaching(this.$initiator, this.parent));
        }
        if (isPromise(s)) {
            this.Ft();
            this.Dt();
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
        switch (this.state & ~Fe) {
          case qe:
            this.state = De;
            break;

          case Me:
            this.state = De;
            i = this.$promise?.catch(t.noop);
            break;

          case Le:
          case He:
          case Oe:
          case He | Oe:
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
                if (this.vmKind !== Pe && this.kt.detaching != null) {
                    r = t.onResolveAll(...this.kt.detaching.map(callDetachingHook, this));
                }
                if (this.At.Ut) {
                    r = t.onResolveAll(r, this.Ct.detaching(this.$initiator, this.parent));
                }
            }
            if (isPromise(r)) {
                this.Ft();
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
          case Te:
          case Pe:
            this.nodes.remove();
            this.nodes.unlink();
        }
        if (this.hostController !== null) {
            switch (this.mountTarget) {
              case ke:
              case Ce:
                this.host.remove();
                break;

              case Ae:
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
          case Ee:
            this.scope = null;
            break;

          case Pe:
            if (!this.hasLockedScope) {
                this.scope = null;
            }
            if ((this.state & Fe) === Fe && !this.viewFactory.tryReturnToCache(this) && this.$initiator === this) {
                this.dispose();
            }
            break;

          case Te:
            this.scope.parent = null;
            break;
        }
        this.state = He;
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
            We = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            We();
            We = void 0;
        }
    }
    Vt(t) {
        if (this.$promise !== void 0) {
            je = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            je(t);
            je = void 0;
        }
        if (this.$initiator !== this) {
            this.parent.Vt(t);
        }
    }
    Dt() {
        ++this._t;
        if (this.$initiator !== this) {
            this.parent.Dt();
        }
    }
    Ot() {
        if (this.state !== Me) {
            --this._t;
            this.Kt();
            if (this.$initiator !== this) {
                this.parent.Ot();
            }
            return;
        }
        if (--this._t === 0) {
            if (this.vmKind !== Pe && this.kt.attached != null) {
                ze = t.onResolveAll(...this.kt.attached.map(callAttachedHook, this));
            }
            if (this.At.Xt) {
                ze = t.onResolveAll(ze, this.Ct.attached(this.$initiator));
            }
            if (isPromise(ze)) {
                this.Ft();
                ze.then((() => {
                    this.state = qe;
                    this.Kt();
                    if (this.$initiator !== this) {
                        this.parent.Ot();
                    }
                })).catch((t => {
                    this.Vt(t);
                }));
                ze = void 0;
                return;
            }
            ze = void 0;
            this.state = qe;
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
            let e = this.$initiator.head;
            let s = void 0;
            while (e !== null) {
                if (e !== this) {
                    if (e.debug) {
                        e.logger.trace(`detach()`);
                    }
                    e.removeNodes();
                }
                if (e.Bt) {
                    if (e.vmKind !== Pe && e.kt.unbinding != null) {
                        s = t.onResolveAll(...e.kt.unbinding.map(callUnbindingHook, e));
                    }
                    if (e.At.Yt) {
                        if (e.debug) {
                            e.logger.trace("unbinding()");
                        }
                        s = t.onResolveAll(s, e.viewModel.unbinding(e.$initiator, e.parent));
                    }
                }
                if (isPromise(s)) {
                    this.Ft();
                    this.Qt();
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
          case Ee:
            {
                return getAttributeDefinition(this.Ct.constructor).name === t;
            }

          case Te:
            {
                return getElementDefinition(this.Ct.constructor).name === t;
            }

          case Pe:
            return this.viewFactory.name === t;
        }
    }
    lockScope(t) {
        this.scope = t;
        this.hasLockedScope = true;
    }
    setHost(t) {
        if (this.vmKind === Te) {
            setRef(t, ss, this);
            setRef(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = ke;
        return this;
    }
    setShadowRoot(t) {
        if (this.vmKind === Te) {
            setRef(t, ss, this);
            setRef(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = Ce;
        return this;
    }
    setLocation(t) {
        if (this.vmKind === Te) {
            setRef(t, ss, this);
            setRef(t, this.definition.key, this);
        }
        this.location = t;
        this.mountTarget = Ae;
        return this;
    }
    release() {
        this.state |= Fe;
    }
    dispose() {
        if ((this.state & Oe) === Oe) {
            return;
        }
        this.state |= Oe;
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
            we.delete(this.Ct);
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
            for (let s = 0, i = e.length; s < i; ++s) {
                if (e[s].accept(t) === true) {
                    return true;
                }
            }
        }
    }
}

const we = new WeakMap;

const ye = 0;

const ke = 1;

const Ce = 2;

const Ae = 3;

const Be = c({
    none: ye,
    host: ke,
    shadowRoot: Ce,
    location: Ae
});

const Se = {
    optional: true
};

const _e = t.optionalResource(s.ICoercionConfiguration);

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

const Re = new Map;

const getAccessScopeAst = t => {
    let e = Re.get(t);
    if (e == null) {
        e = new s.AccessScopeExpression(t, 0);
        Re.set(t, e);
    }
    return e;
};

function createWatchers(t, e, i, n) {
    const r = e.get(s.IObserverLocator);
    const l = e.get(s.IExpressionParser);
    const h = i.watches;
    const a = t.vmKind === Te ? t.scope : s.Scope.create(n, null, true);
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
            d = isString(u) ? l.parse(u, w) : getAccessScopeAst(u);
            t.addBinding(new ExpressionWatcher(a, e, r, d, f));
        }
    }
}

function isCustomElementController(t) {
    return t instanceof Controller && t.vmKind === Te;
}

function isCustomElementViewModel(t) {
    return e.isObject(t) && isElementType(t.constructor);
}

class HooksDefinition {
    constructor(t) {
        this.ee = "define" in t;
        this.Pt = "hydrating" in t;
        this.Mt = "hydrated" in t;
        this.qt = "created" in t;
        this.Ht = "binding" in t;
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

const Ie = {
    mode: "open"
};

const Te = "customElement";

const Ee = "customAttribute";

const Pe = "synthetic";

const Le = 0;

const Me = 1;

const qe = 2;

const De = 4;

const He = 8;

const Fe = 16;

const Oe = 32;

const Ve = /*@__PURE__*/ c({
    none: Le,
    activating: Me,
    activated: qe,
    deactivating: De,
    deactivated: He,
    released: Fe,
    disposed: Oe
});

function stringifyState(t) {
    const e = [];
    if ((t & Me) === Me) {
        e.push("activating");
    }
    if ((t & qe) === qe) {
        e.push("activated");
    }
    if ((t & De) === De) {
        e.push("deactivating");
    }
    if ((t & He) === He) {
        e.push("deactivated");
    }
    if ((t & Fe) === Fe) {
        e.push("released");
    }
    if ((t & Oe) === Oe) {
        e.push("disposed");
    }
    return e.length === 0 ? "none" : e.join("|");
}

const $e = /*@__PURE__*/ N("IController");

const Ne = /*@__PURE__*/ N("IHydrationContext");

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

let We;

let je;

let ze;

class Refs {}

function getRef(t, e) {
    return t.$au?.[e] ?? null;
}

function setRef(t, e, s) {
    (t.$au ??= new Refs)[e] = s;
}

const Ue = /*@__PURE__*/ N("INode");

const Ge = /*@__PURE__*/ N("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(ls, true)) {
        return t.get(ls).host;
    }
    return t.get(st).document;
}))));

const Ke = /*@__PURE__*/ N("IRenderLocation");

const Xe = /*@__PURE__*/ N("CssModules");

const Qe = new WeakMap;

function getEffectiveParentNode(t) {
    if (Qe.has(t)) {
        return Qe.get(t);
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
        if (e.mountTarget === Be.shadowRoot) {
            return getEffectiveParentNode(e.host);
        }
    }
    return t.parentNode;
}

function setEffectiveParentNode(t, e) {
    if (t.platform !== void 0 && !(t instanceof t.platform.Node)) {
        const s = t.childNodes;
        for (let t = 0, i = s.length; t < i; ++t) {
            Qe.set(s[t], e);
        }
    } else {
        Qe.set(t, e);
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
        return this.se;
    }
    get lastChild() {
        return this.ie;
    }
    constructor(t, e) {
        this.platform = t;
        this.next = void 0;
        this.ne = false;
        this.re = false;
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
        this.se = e.firstChild;
        this.ie = e.lastChild;
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
                let s = this.se;
                let i;
                const n = this.ie;
                while (s != null) {
                    i = s.nextSibling;
                    e.insertBefore(s, t);
                    if (s === n) {
                        break;
                    }
                    s = i;
                }
            } else {
                this.ne = true;
                t.parentNode.insertBefore(this.f, t);
            }
        }
    }
    appendTo(t, e = false) {
        if (this.ne) {
            let e = this.se;
            let s;
            const i = this.ie;
            while (e != null) {
                s = e.nextSibling;
                t.appendChild(e);
                if (e === i) {
                    break;
                }
                e = s;
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
            const e = this.ie;
            let s;
            let i = this.se;
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
        if (this.ne) {
            let s = this.se;
            let i;
            const n = this.ie;
            while (s != null) {
                i = s.nextSibling;
                e.insertBefore(s, t);
                if (s === n) {
                    break;
                }
                s = i;
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

const Ye = /*@__PURE__*/ N("IWindow", (t => t.callback((t => t.get(st).window))));

const Ze = /*@__PURE__*/ N("ILocation", (t => t.callback((t => t.get(Ye).location))));

const Je = /*@__PURE__*/ N("IHistory", (t => t.callback((t => t.get(Ye).history))));

const registerHostNode = (e, s, i) => {
    registerResolver(e, s.HTMLElement, registerResolver(e, s.Element, registerResolver(e, Ue, new t.InstanceProvider("ElementResolver", i))));
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
    const e = P(ss, t);
    if (e === void 0) {
        annotateElementMetadata(t, "containerless", true);
        return;
    }
    e.containerless = true;
}

const ts = new WeakMap;

class CustomElementDefinition {
    get type() {
        return nt;
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
            const n = t.fromDefinitionOrDefault("name", i, is);
            if (isFunction(i.Type)) {
                s = i.Type;
            } else {
                s = ns(t.pascalCase(n));
            }
            return new CustomElementDefinition(s, n, t.mergeArrays(i.aliases), t.fromDefinitionOrDefault("key", i, (() => getElementKeyFrom(n))), t.fromDefinitionOrDefault("cache", i, returnZero), t.fromDefinitionOrDefault("capture", i, returnFalse), t.fromDefinitionOrDefault("template", i, returnNull), t.mergeArrays(i.instructions), t.mergeArrays(i.dependencies), t.fromDefinitionOrDefault("injectable", i, returnNull), t.fromDefinitionOrDefault("needsCompile", i, returnTrue), t.mergeArrays(i.surrogates), V.from(s, i.bindables), t.fromDefinitionOrDefault("containerless", i, returnFalse), t.fromDefinitionOrDefault("shadowOptions", i, returnNull), t.fromDefinitionOrDefault("hasSlots", i, returnFalse), t.fromDefinitionOrDefault("enhance", i, returnFalse), t.fromDefinitionOrDefault("watches", i, returnEmptyArray), t.fromAnnotationOrTypeOrDefault("processContent", s, returnNull));
        }
        if (isString(e)) {
            return new CustomElementDefinition(s, e, t.mergeArrays(getElementAnnotation(s, "aliases"), s.aliases), getElementKeyFrom(e), t.fromAnnotationOrTypeOrDefault("cache", s, returnZero), t.fromAnnotationOrTypeOrDefault("capture", s, returnFalse), t.fromAnnotationOrTypeOrDefault("template", s, returnNull), t.mergeArrays(getElementAnnotation(s, "instructions"), s.instructions), t.mergeArrays(getElementAnnotation(s, "dependencies"), s.dependencies), t.fromAnnotationOrTypeOrDefault("injectable", s, returnNull), t.fromAnnotationOrTypeOrDefault("needsCompile", s, returnTrue), t.mergeArrays(getElementAnnotation(s, "surrogates"), s.surrogates), V.from(s, ...V.getAll(s), getElementAnnotation(s, "bindables"), s.bindables), t.fromAnnotationOrTypeOrDefault("containerless", s, returnFalse), t.fromAnnotationOrTypeOrDefault("shadowOptions", s, returnNull), t.fromAnnotationOrTypeOrDefault("hasSlots", s, returnFalse), t.fromAnnotationOrTypeOrDefault("enhance", s, returnFalse), t.mergeArrays(it.getDefinitions(s), s.watches), t.fromAnnotationOrTypeOrDefault("processContent", s, returnNull));
        }
        const i = t.fromDefinitionOrDefault("name", e, is);
        return new CustomElementDefinition(s, i, t.mergeArrays(getElementAnnotation(s, "aliases"), e.aliases, s.aliases), getElementKeyFrom(i), t.fromAnnotationOrDefinitionOrTypeOrDefault("cache", e, s, returnZero), t.fromAnnotationOrDefinitionOrTypeOrDefault("capture", e, s, returnFalse), t.fromAnnotationOrDefinitionOrTypeOrDefault("template", e, s, returnNull), t.mergeArrays(getElementAnnotation(s, "instructions"), e.instructions, s.instructions), t.mergeArrays(getElementAnnotation(s, "dependencies"), e.dependencies, s.dependencies), t.fromAnnotationOrDefinitionOrTypeOrDefault("injectable", e, s, returnNull), t.fromAnnotationOrDefinitionOrTypeOrDefault("needsCompile", e, s, returnTrue), t.mergeArrays(getElementAnnotation(s, "surrogates"), e.surrogates, s.surrogates), V.from(s, ...V.getAll(s), getElementAnnotation(s, "bindables"), s.bindables, e.bindables), t.fromAnnotationOrDefinitionOrTypeOrDefault("containerless", e, s, returnFalse), t.fromAnnotationOrDefinitionOrTypeOrDefault("shadowOptions", e, s, returnNull), t.fromAnnotationOrDefinitionOrTypeOrDefault("hasSlots", e, s, returnFalse), t.fromAnnotationOrDefinitionOrTypeOrDefault("enhance", e, s, returnFalse), t.mergeArrays(e.watches, it.getDefinitions(s), s.watches), t.fromAnnotationOrDefinitionOrTypeOrDefault("processContent", e, s, returnNull));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) {
            return t;
        }
        if (ts.has(t)) {
            return ts.get(t);
        }
        const e = CustomElementDefinition.create(t);
        ts.set(t, e);
        M(ss, e, e.Type);
        return e;
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getElementKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : U(s, s), j(s, i), ...n.map((t => j(s, getElementKeyFrom(t)))));
        }
    }
    toString() {
        return `au:ce:${this.name}`;
    }
}

const es = {
    name: undefined,
    searchParents: false,
    optional: false
};

const returnZero = () => 0;

const returnNull = () => null;

const returnFalse = () => false;

const returnTrue = () => true;

const returnEmptyArray = () => t.emptyArray;

const ss = /*@__PURE__*/ t.getResourceKeyFor("custom-element");

const getElementKeyFrom = t => `${ss}:${t}`;

const is = /*@__PURE__*/ (() => {
    let t = 0;
    return () => `unnamed-${++t}`;
})();

const annotateElementMetadata = (t, e, s) => {
    M(D(e), s, t);
};

const defineElement = (e, s) => {
    const i = CustomElementDefinition.create(e, s);
    const n = i.Type;
    M(ss, i, n);
    M(t.resourceBaseName, i, n);
    return n;
};

const isElementType = t => isFunction(t) && L(ss, t);

const findElementControllerFor = (t, e = es) => {
    if (e.name === void 0 && e.searchParents !== true) {
        const s = getRef(t, ss);
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
            const s = getRef(t, ss);
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
            const t = getRef(s, ss);
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
        const t = getRef(s, ss);
        if (t !== null) {
            return t;
        }
        s = getEffectiveParentNode(s);
    }
    throw createMappedError(765, t);
};

const getElementAnnotation = (t, e) => P(D(e), t);

const getElementDefinition = t => {
    const e = P(ss, t);
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

const ns = /*@__PURE__*/ function() {
    const t = {
        value: "",
        writable: false,
        enumerable: false,
        configurable: true
    };
    const e = {};
    return function(s, i = e) {
        const n = class Anonymous {};
        t.value = s;
        g(n, "name", t);
        if (i !== e) {
            u(n.prototype, i);
        }
        return n;
    };
}();

const rs = c({
    name: ss,
    keyFrom: getElementKeyFrom,
    isType: isElementType,
    for: findElementControllerFor,
    define: defineElement,
    getDefinition: getElementDefinition,
    annotate: annotateElementMetadata,
    getAnnotation: getElementAnnotation,
    generateName: is,
    createInjectable: createElementInjectable,
    generateType: ns,
    find(t, e) {
        const s = getElementKeyFrom(e);
        const i = t.find(s);
        return i == null ? null : P(ss, i) ?? null;
    }
});

const os = /*@__PURE__*/ D("processContent");

function processContent(t) {
    return t === void 0 ? function(t, e, s) {
        M(os, ensureHook(t, e), t);
    } : function(e) {
        t = ensureHook(e, t);
        const s = P(ss, e);
        if (s !== void 0) {
            s.processContent = t;
        } else {
            M(os, t, e);
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

const ls = /*@__PURE__*/ N("IAppRoot");

class AppRoot {
    get controller() {
        return this.T;
    }
    constructor(e, s, i, n) {
        this.config = e;
        this.container = s;
        this.le = void 0;
        const r = this.host = e.host;
        i.prepare(this);
        registerHostNode(s, this.platform = this.he(s, r), r);
        this.le = t.onResolve(this.ae("creating"), (() => {
            const i = n ? s : s.createChild();
            const l = e.component;
            let h;
            if (isFunction(l)) {
                h = i.invoke(l);
                z(l, h);
            } else {
                h = e.component;
            }
            const a = {
                hydrate: false,
                projections: null
            };
            const c = n ? CustomElementDefinition.create({
                name: is(),
                template: this.host,
                enhance: true
            }) : void 0;
            const u = this.T = Controller.$el(i, h, r, a, c);
            u.hE(a, null);
            return t.onResolve(this.ae("hydrating"), (() => {
                u.hS(null);
                return t.onResolve(this.ae("hydrated"), (() => {
                    u.hC();
                    this.le = void 0;
                }));
            }));
        }));
    }
    activate() {
        return t.onResolve(this.le, (() => t.onResolve(this.ae("activating"), (() => t.onResolve(this.T.activate(this.T, null, void 0), (() => this.ae("activated")))))));
    }
    deactivate() {
        return t.onResolve(this.ae("deactivating"), (() => t.onResolve(this.T.deactivate(this.T, null), (() => this.ae("deactivated")))));
    }
    ae(e) {
        return t.onResolveAll(...this.container.getAll(tt).reduce(((t, s) => {
            if (s.slot === e) {
                t.push(s.run());
            }
            return t;
        }), []));
    }
    he(t, e) {
        let s;
        if (!t.has(st, false)) {
            if (e.ownerDocument.defaultView === null) {
                throw createMappedError(769);
            }
            s = new i.BrowserPlatform(e.ownerDocument.defaultView);
            t.register(z(st, s));
        } else {
            s = t.get(st);
        }
        return s;
    }
    dispose() {
        this.T?.dispose();
    }
}

const hs = /*@__PURE__*/ N("IAurelia");

class Aurelia {
    get isRunning() {
        return this.ir;
    }
    get isStarting() {
        return this.ce;
    }
    get isStopping() {
        return this.ue;
    }
    get root() {
        if (this.fe == null) {
            if (this.next == null) {
                throw createMappedError(767);
            }
            return this.next;
        }
        return this.fe;
    }
    constructor(e = t.DI.createContainer()) {
        this.container = e;
        this.ir = false;
        this.ce = false;
        this.ue = false;
        this.fe = void 0;
        this.next = void 0;
        this.de = void 0;
        this.pe = void 0;
        if (e.has(hs, true) || e.has(Aurelia, true)) {
            throw createMappedError(768);
        }
        registerResolver(e, hs, new t.InstanceProvider("IAurelia", this));
        registerResolver(e, Aurelia, new t.InstanceProvider("Aurelia", this));
        registerResolver(e, ls, this.me = new t.InstanceProvider("IAppRoot"));
    }
    register(...t) {
        this.container.register(...t);
        return this;
    }
    app(t) {
        this.next = new AppRoot(t, this.container, this.me);
        return this;
    }
    enhance(e) {
        const s = new AppRoot({
            host: e.host,
            component: e.component
        }, e.container ?? this.container.createChild(), new t.InstanceProvider("IAppRoot"), true);
        return t.onResolve(s.activate(), (() => s));
    }
    async waitForIdle() {
        const t = this.root.platform;
        await t.domWriteQueue.yield();
        await t.domReadQueue.yield();
        await t.taskQueue.yield();
    }
    start(e = this.next) {
        if (e == null) {
            throw createMappedError(770);
        }
        if (isPromise(this.de)) {
            return this.de;
        }
        return this.de = t.onResolve(this.stop(), (() => {
            Reflect.set(e.host, "$aurelia", this);
            this.me.prepare(this.fe = e);
            this.ce = true;
            return t.onResolve(e.activate(), (() => {
                this.ir = true;
                this.ce = false;
                this.de = void 0;
                this.ge(e, "au-started", e.host);
            }));
        }));
    }
    stop(e = false) {
        if (isPromise(this.pe)) {
            return this.pe;
        }
        if (this.ir === true) {
            const s = this.fe;
            this.ir = false;
            this.ue = true;
            return this.pe = t.onResolve(s.deactivate(), (() => {
                Reflect.deleteProperty(s.host, "$aurelia");
                if (e) {
                    s.dispose();
                }
                this.fe = void 0;
                this.me.dispose();
                this.ue = false;
                this.ge(s, "au-stopped", s.host);
            }));
        }
    }
    dispose() {
        if (this.ir || this.ue) {
            throw createMappedError(771);
        }
        this.container.dispose();
    }
    ge(t, e, s) {
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
                this.has = this.xe;
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
                this.has = this.we;
                break;

              case 1:
                this.has = this.ye;
                break;

              default:
                this.has = this.ke;
            }
        }
    }
    equals(t) {
        return this.chars === t.chars && this.repeat === t.repeat && this.isSymbol === t.isSymbol && this.isInverted === t.isInverted;
    }
    ke(t) {
        return this.chars.includes(t);
    }
    ye(t) {
        return this.chars === t;
    }
    we(t) {
        return false;
    }
    be(t) {
        return !this.chars.includes(t);
    }
    ve(t) {
        return this.chars !== t;
    }
    xe(t) {
        return true;
    }
}

class Interpretation {
    constructor() {
        this.parts = t.emptyArray;
        this.Ce = "";
        this.Ae = {};
        this.Be = {};
    }
    get pattern() {
        const t = this.Ce;
        if (t === "") {
            return null;
        } else {
            return t;
        }
    }
    set pattern(e) {
        if (e == null) {
            this.Ce = "";
            this.parts = t.emptyArray;
        } else {
            this.Ce = e;
            this.parts = this.Be[e];
        }
    }
    append(t, e) {
        const s = this.Ae;
        if (s[t] === undefined) {
            s[t] = e;
        } else {
            s[t] += e;
        }
    }
    next(t) {
        const e = this.Ae;
        let s;
        if (e[t] !== undefined) {
            s = this.Be;
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
    get Ce() {
        return this.Se ? this._e[0] : null;
    }
    constructor(t, ...e) {
        this.charSpec = t;
        this.Re = [];
        this.Ie = null;
        this.Se = false;
        this._e = e;
    }
    findChild(t) {
        const e = this.Re;
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
        const s = this._e;
        if (!s.includes(e)) {
            s.push(e);
        }
        let i = this.findChild(t);
        if (i == null) {
            i = new AttrParsingState(t, e);
            this.Re.push(i);
            if (t.repeat) {
                i.Re.push(i);
            }
        }
        return i;
    }
    findMatches(t, e) {
        const s = [];
        const i = this.Re;
        const n = i.length;
        let r = 0;
        let l = null;
        let h = 0;
        let a = 0;
        for (;h < n; ++h) {
            l = i[h];
            if (l.charSpec.has(t)) {
                s.push(l);
                r = l._e.length;
                a = 0;
                if (l.charSpec.isSymbol) {
                    for (;a < r; ++a) {
                        e.next(l._e[a]);
                    }
                } else {
                    for (;a < r; ++a) {
                        e.append(l._e[a], t);
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
        const s = this.Ee = [];
        let i = 0;
        for (;e > i; ++i) {
            s.push(new CharSpec(t[i], false, false, false));
        }
    }
    eachChar(t) {
        const e = this.Te;
        const s = this.Ee;
        let i = 0;
        for (;e > i; ++i) {
            t(s[i]);
        }
    }
}

class DynamicSegment {
    constructor(t) {
        this.text = "PART";
        this.Pe = new CharSpec(t, true, false, true);
    }
    eachChar(t) {
        t(this.Pe);
    }
}

class SymbolSegment {
    constructor(t) {
        this.text = t;
        this.Pe = new CharSpec(t, false, true, false);
    }
    eachChar(t) {
        t(this.Pe);
    }
}

class SegmentTypes {
    constructor() {
        this.statics = 0;
        this.dynamics = 0;
        this.symbols = 0;
    }
}

const as = /*@__PURE__*/ N("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

class SyntaxInterpreter {
    constructor() {
        this.Le = new AttrParsingState(null);
        this.Me = [ this.Le ];
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
            s = this.Le;
            i = t[c];
            n = i.pattern;
            r = new SegmentTypes;
            l = this.qe(i, r);
            h = l.length;
            a = t => s = s.append(t, n);
            for (u = 0; h > u; ++u) {
                l[u].eachChar(a);
            }
            s.Ie = r;
            s.Se = true;
            ++c;
        }
    }
    interpret(t) {
        const e = new Interpretation;
        const s = t.length;
        let i = this.Me;
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
                e.next(r.Ce);
            }
            e.pattern = r.Ce;
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
    qe(t, e) {
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
    return t.Se;
}

function sortEndpoint(t, e) {
    const s = t.Ie;
    const i = e.Ie;
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

const cs = /*@__PURE__*/ N("IAttributePattern");

const us = /*@__PURE__*/ N("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor() {
        this.j = {};
        const e = this.He = t.resolve(as);
        const s = ds.findAll(t.resolve(t.IContainer));
        const i = this._e = {};
        const n = s.reduce(((t, e) => {
            const s = getAllPatternDefinitions(e.constructor);
            s.forEach((t => i[t.pattern] = e));
            return t.concat(s);
        }), t.emptyArray);
        e.add(n);
    }
    parse(t, e) {
        let s = this.j[t];
        if (s == null) {
            s = this.j[t] = this.He.interpret(t);
        }
        const i = s.pattern;
        if (i == null) {
            return new AttrSyntax(t, e, t, null, null);
        } else {
            return this._e[i][i](t, e, s.parts);
        }
    }
}

function attributePattern(...t) {
    return function decorator(e) {
        return ds.define(t, e);
    };
}

const getAllPatternDefinitions = e => fs.get(e) ?? t.emptyArray;

const fs = new WeakMap;

const ds = c({
    name: t.getResourceKeyFor("attribute-pattern"),
    define(e, s) {
        fs.set(s, e);
        return t.Registrable.define(s, (t => {
            W(cs, s).register(t);
        }));
    },
    getPatternDefinitions: getAllPatternDefinitions,
    findAll: t => t.root.getAll(cs)
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
        return new AttrSyntax(t, e, s[0], "trigger", [ s[0], "trigger", ...s.slice(1) ]);
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
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getCommandKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : W(s, s), j(s, i), ...n.map((t => j(s, getCommandKeyFrom(t)))));
        }
    }
}

const vs = /*@__PURE__*/ t.getResourceKeyFor("binding-command");

const getCommandKeyFrom = t => `${vs}:${t}`;

const getCommandAnnotation = (t, e) => P(D(e), t);

const bs = c({
    name: vs,
    keyFrom: getCommandKeyFrom,
    define(e, s) {
        const i = BindingCommandDefinition.create(e, s);
        const n = i.Type;
        M(vs, i, n);
        M(t.resourceBaseName, i, n);
        return n;
    },
    getAnnotation: getCommandAnnotation,
    find(t, e) {
        const s = getCommandKeyFrom(e);
        const i = t.find(s);
        return i == null ? null : P(vs, i) ?? null;
    },
    get(e, s) {
        return e.get(t.resource(getCommandKeyFrom(s)));
    }
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
            if (l === "" && e.def.type === nt) {
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
        return gs;
    }
    build(e, s, i) {
        const n = e.attr;
        let r = n.target;
        let l = e.attr.rawValue;
        if (e.bindable == null) {
            r = i.map(e.node, r) ?? t.camelCase(r);
        } else {
            if (l === "" && e.def.type === nt) {
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
        return gs;
    }
    build(e, s, i) {
        const n = e.attr;
        let r = n.target;
        let l = n.rawValue;
        if (e.bindable == null) {
            r = i.map(e.node, r) ?? t.camelCase(r);
        } else {
            if (l === "" && e.def.type === nt) {
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
        return gs;
    }
    build(e, s, i) {
        const n = e.attr;
        let r = n.target;
        let l = n.rawValue;
        if (e.bindable == null) {
            r = i.map(e.node, r) ?? t.camelCase(r);
        } else {
            if (l === "" && e.def.type === nt) {
                l = t.camelCase(r);
            }
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(s.parse(l, w), r, I);
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
            h = i.isTwoWay(e.node, a) ? I : _;
            a = i.map(e.node, a) ?? t.camelCase(a);
        } else {
            if (c === "" && e.def.type === nt) {
                c = t.camelCase(a);
            }
            l = e.def.defaultBindingMode;
            h = r.mode === T || r.mode == null ? l == null || l === T ? _ : l : r.mode;
            a = r.name;
        }
        return new PropertyBindingInstruction(s.parse(c, w), a, h);
    }
};

exports.DefaultBindingCommand = __decorate([ bindingCommand("bind") ], exports.DefaultBindingCommand);

exports.ForBindingCommand = class ForBindingCommand {
    get type() {
        return gs;
    }
    static get inject() {
        return [ us ];
    }
    constructor(t) {
        this.Fe = t;
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
                const n = this.Fe.parse(e, i);
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
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, b), t.attr.target, false, t.attr.parts?.[2] ?? null);
    }
};

exports.TriggerBindingCommand = __decorate([ bindingCommand("trigger") ], exports.TriggerBindingCommand);

exports.CaptureBindingCommand = class CaptureBindingCommand {
    get type() {
        return xs;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, b), t.attr.target, true, t.attr.parts?.[2] ?? null);
    }
};

exports.CaptureBindingCommand = __decorate([ bindingCommand("capture") ], exports.CaptureBindingCommand);

exports.AttrBindingCommand = class AttrBindingCommand {
    get type() {
        return xs;
    }
    build(t, e) {
        return new AttributeBindingInstruction(t.attr.target, e.parse(t.attr.rawValue, w), t.attr.target);
    }
};

exports.AttrBindingCommand = __decorate([ bindingCommand("attr") ], exports.AttrBindingCommand);

exports.StyleBindingCommand = class StyleBindingCommand {
    get type() {
        return xs;
    }
    build(t, e) {
        return new AttributeBindingInstruction("style", e.parse(t.attr.rawValue, w), t.attr.target);
    }
};

exports.StyleBindingCommand = __decorate([ bindingCommand("style") ], exports.StyleBindingCommand);

exports.ClassBindingCommand = class ClassBindingCommand {
    get type() {
        return xs;
    }
    build(t, e) {
        return new AttributeBindingInstruction("class", e.parse(t.attr.rawValue, w), t.attr.target);
    }
};

exports.ClassBindingCommand = __decorate([ bindingCommand("class") ], exports.ClassBindingCommand);

let ws = class RefBindingCommand {
    get type() {
        return xs;
    }
    build(t, e) {
        return new RefBindingInstruction(e.parse(t.attr.rawValue, w), t.attr.target);
    }
};

ws = __decorate([ bindingCommand("ref") ], ws);

let ys = class SpreadBindingCommand {
    get type() {
        return xs;
    }
    build(t) {
        return new SpreadBindingInstruction;
    }
};

ys = __decorate([ bindingCommand("...$attrs") ], ys);

const ks = /*@__PURE__*/ N("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

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
        t.register(W(this, this), j(this, ks));
    }
    constructor() {
        this.Oe = u(createLookup(), {
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
        this.Ve = o("a altGlyph animate animateColor circle clipPath defs ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feFlood feGaussianBlur feImage feMerge feMorphology feOffset feSpecularLighting feTile feTurbulence filter font foreignObject g glyph glyphRef image line linearGradient marker mask missing-glyph path pattern polygon polyline radialGradient rect stop svg switch symbol text textPath tref tspan use");
        this.$e = o("alignment-baseline baseline-shift clip-path clip-rule clip color-interpolation-filters color-interpolation color-profile color-rendering color cursor direction display dominant-baseline enable-background fill-opacity fill-rule fill filter flood-color flood-opacity font-family font-size-adjust font-size font-stretch font-style font-variant font-weight glyph-orientation-horizontal glyph-orientation-vertical image-rendering kerning letter-spacing lighting-color marker-end marker-mid marker-start mask opacity overflow pointer-events shape-rendering stop-color stop-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width stroke text-anchor text-decoration text-rendering unicode-bidi visibility word-spacing writing-mode");
        const e = t.resolve(st);
        this.SVGElement = e.globalThis.SVGElement;
        const s = e.document.createElement("div");
        s.innerHTML = "<svg><altGlyph /></svg>";
        if (s.firstElementChild.nodeName === "altglyph") {
            const t = this.Oe;
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
        return this.Ve[t.nodeName] === true && this.$e[e] === true || this.Oe[t.nodeName]?.[e] === true;
    }
}

const Cs = /*@__PURE__*/ N("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    constructor() {
        this.fns = [];
        this.Ne = createLookup();
        this.We = createLookup();
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
        let e;
        let s;
        let i;
        let n;
        for (i in t) {
            e = t[i];
            s = this.Ne[i] ??= createLookup();
            for (n in e) {
                if (s[n] !== void 0) {
                    throw createError(n, i);
                }
                s[n] = e[n];
            }
        }
    }
    useGlobalMapping(t) {
        const e = this.We;
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
        return this.Ne[t.nodeName]?.[e] ?? this.We[e] ?? (isDataAttribute(t, e, this.svg) ? e : null);
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
        return As[t] ??= new AttributeNSAccessor(t);
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
        this.je = false;
        this.ze = void 0;
        this.Ue = void 0;
        this.iO = false;
        this.ft = false;
        this.ut = t;
        this.oL = i;
        this.cf = s;
    }
    getValue() {
        return this.iO ? this.v : this.ut.multiple ? getSelectedOptions(this.ut.options) : this.ut.value;
    }
    setValue(t) {
        this.ov = this.v;
        this.v = t;
        this.je = t !== this.ov;
        this.Ge(t instanceof Array ? t : null);
        this.bt();
    }
    bt() {
        if (this.je) {
            this.je = false;
            this.syncOptions();
        }
    }
    handleCollectionChange() {
        this.syncOptions();
    }
    syncOptions() {
        const t = this.v;
        const e = this.ut;
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
        const t = this.ut;
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
    dt() {
        (this.Ue = createMutationObserver(this.ut, this.Ke.bind(this))).observe(this.ut, Ss);
        this.Ge(this.v instanceof Array ? this.v : null);
        this.iO = true;
    }
    gt() {
        this.Ue.disconnect();
        this.ze?.unsubscribe(this);
        this.Ue = this.ze = void 0;
        this.iO = false;
    }
    Ge(t) {
        this.ze?.unsubscribe(this);
        this.ze = void 0;
        if (t != null) {
            if (!this.ut.multiple) {
                throw createError$1(`AUR0654`);
            }
            (this.ze = this.oL.getArrayObserver(t)).subscribe(this);
        }
    }
    handleEvent() {
        const t = this.syncValue();
        if (t) {
            this.Xe();
        }
    }
    Ke(t) {
        this.syncOptions();
        const e = this.syncValue();
        if (e) {
            this.Xe();
        }
    }
    Xe() {
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
        this.je = false;
    }
    getValue() {
        return this.obj.style.cssText;
    }
    setValue(t) {
        this.v = t;
        this.je = t !== this.ov;
        this.bt();
    }
    Qe(t) {
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
    Ye(e) {
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
            n.push(...this.Ze(s));
        }
        return n;
    }
    Je(e) {
        const s = e.length;
        if (s > 0) {
            const t = [];
            let i = 0;
            for (;s > i; ++i) {
                t.push(...this.Ze(e[i]));
            }
            return t;
        }
        return t.emptyArray;
    }
    Ze(e) {
        if (isString(e)) {
            return this.Qe(e);
        }
        if (e instanceof Array) {
            return this.Je(e);
        }
        if (e instanceof Object) {
            return this.Ye(e);
        }
        return t.emptyArray;
    }
    bt() {
        if (this.je) {
            this.je = false;
            const t = this.v;
            const e = this.styles;
            const s = this.Ze(t);
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
        this.je = false;
        this.ft = false;
        this.ut = t;
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
        this.je = true;
        if (!this.cf.readonly) {
            this.bt();
        }
    }
    bt() {
        if (this.je) {
            this.je = false;
            this.ut[this.k] = this.v ?? this.cf.default;
            this.Xe();
        }
    }
    handleEvent() {
        this.ov = this.v;
        this.v = this.ut[this.k];
        if (this.ov !== this.v) {
            this.je = false;
            this.Xe();
        }
    }
    dt() {
        this.v = this.ov = this.ut[this.k];
    }
    Xe() {
        Is = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Is);
    }
}

mixinNodeObserverUseConfig(ValueAttributeObserver);

s.subscriberCollection(ValueAttributeObserver);

let Is = void 0;

const Ts = "http://www.w3.org/1999/xlink";

const Es = "http://www.w3.org/XML/1998/namespace";

const Ps = "http://www.w3.org/2000/xmlns/";

const Ls = u(createLookup(), {
    "xlink:actuate": [ "actuate", Ts ],
    "xlink:arcrole": [ "arcrole", Ts ],
    "xlink:href": [ "href", Ts ],
    "xlink:role": [ "role", Ts ],
    "xlink:show": [ "show", Ts ],
    "xlink:title": [ "title", Ts ],
    "xlink:type": [ "type", Ts ],
    "xml:lang": [ "lang", Es ],
    "xml:space": [ "space", Es ],
    xmlns: [ "xmlns", Ps ],
    "xmlns:xlink": [ "xlink", Ps ]
});

const Ms = new s.PropertyAccessor;

Ms.type = A | B;

class NodeObserverLocator {
    static register(t) {
        t.register(W(this, this), j(this, s.INodeObserverLocator));
    }
    constructor() {
        this.allowDirtyCheck = true;
        this.ts = createLookup();
        this.es = createLookup();
        this.ss = createLookup();
        this.rs = createLookup();
        this.os = t.resolve(t.IServiceLocator);
        this.p = t.resolve(st);
        this.ls = t.resolve(s.IDirtyChecker);
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
    handles(t, e) {
        return t instanceof this.p.Node;
    }
    useConfig(t, e, s) {
        const i = this.ts;
        let n;
        if (isString(t)) {
            n = i[t] ??= createLookup();
            if (n[e] == null) {
                n[e] = s;
            } else {
                throwMappingExisted(t, e);
            }
        } else {
            for (const s in t) {
                n = i[s] ??= createLookup();
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
        const s = this.es;
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
        if (s in this.rs || s in (this.ss[e.tagName] ?? t.emptyObject)) {
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
        let s;
        if (isString(t)) {
            s = this.ss[t] ??= createLookup();
            s[e] = true;
        } else {
            for (const e in t) {
                for (const i of t[e]) {
                    s = this.ss[e] ??= createLookup();
                    s[i] = true;
                }
            }
        }
    }
    overrideAccessorGlobal(...t) {
        for (const e of t) {
            this.rs[e] = true;
        }
    }
    getNodeObserverConfig(t, e) {
        return this.ts[t.tagName]?.[e] ?? this.es[e];
    }
    getNodeObserver(t, e, i) {
        const n = this.ts[t.tagName]?.[e] ?? this.es[e];
        let r;
        if (n != null) {
            r = new (n.type ?? ValueAttributeObserver)(t, e, n, i, this.os);
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
                return this.ls.createProperty(t, e);
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
        this.cs = void 0;
        this.us = void 0;
        this.ft = false;
        this.ut = t;
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
        this.ds();
        this.ps();
        this.Xe();
    }
    handleCollectionChange() {
        this.ps();
    }
    handleChange(t, e) {
        this.ps();
    }
    ps() {
        const t = this.v;
        const e = this.ut;
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
        const e = this.ut;
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
        this.Xe();
    }
    dt() {
        this.ds();
    }
    gt() {
        this.cs?.unsubscribe(this);
        this.us?.unsubscribe(this);
        this.cs = this.us = void 0;
    }
    Xe() {
        qs = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, qs);
    }
    ds() {
        const t = this.ut;
        (this.us ??= t.$observers?.model ?? t.$observers?.value)?.subscribe(this);
        this.cs?.unsubscribe(this);
        this.cs = void 0;
        if (t.type === "checkbox") {
            (this.cs = getCollectionObserver(this.v, this.oL))?.subscribe(this);
        }
    }
}

mixinNodeObserverUseConfig(CheckedObserver);

s.subscriberCollection(CheckedObserver);

let qs = void 0;

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
        this.gs = t.resolve(s.INodeObserverLocator);
    }
    bind(t, e, ...s) {
        if (!(this.gs instanceof NodeObserverLocator)) {
            throw createMappedError(9993);
        }
        if (s.length === 0) {
            throw createMappedError(802);
        }
        if (!(e instanceof PropertyBinding) || !(e.mode & R)) {
            throw createMappedError(803);
        }
        const i = this.gs.getNodeObserverConfig(e.target, e.targetProperty);
        if (i == null) {
            throw createMappedError(9992, e);
        }
        const n = this.gs.getNodeObserver(e.target, e.targetProperty, this.oL);
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
        this.xs = false;
        this.vs = 0;
        this.bs = t.resolve(Bt);
        this.l = t.resolve(Ke);
    }
    attaching(t, e) {
        return this.ws(this.value);
    }
    detaching(e, s) {
        this.xs = true;
        return t.onResolve(this.pending, (() => {
            this.xs = false;
            this.pending = void 0;
            void this.view?.deactivate(e, this.$controller);
        }));
    }
    valueChanged(t, e) {
        if (!this.$controller.isActive) return;
        t = !!t;
        e = !!e;
        if (t !== e) return this.ws(t);
    }
    ws(e) {
        const s = this.view;
        const i = this.$controller;
        const n = this.vs++;
        const isCurrent = () => !this.xs && this.vs === n + 1;
        let r;
        return t.onResolve(this.pending, (() => this.pending = t.onResolve(s?.deactivate(s, i), (() => {
            if (!isCurrent()) {
                return;
            }
            if (e) {
                r = this.view = this.ifView = this.cache && this.ifView != null ? this.ifView : this.bs.create();
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
        this.f = t.resolve(Bt);
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

const Ds = [ "BindingBehavior", "ValueConverter" ];

class Repeat {
    constructor(t, e, s, i, n) {
        this.views = [];
        this.ys = [];
        this.key = null;
        this.ks = new Map;
        this.Cs = new Map;
        this.As = void 0;
        this.Bs = false;
        this.Ss = false;
        this._s = null;
        this.Rs = void 0;
        this.Is = false;
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
        let h = 0;
        for (;n > h; ++h) {
            r = i[h];
            if (r.target === this && r.targetProperty === "items") {
                l = this.forOf = r.ast;
                this.Es = r;
                let t = l.iterable;
                while (t != null && Ds.includes(t.$kind)) {
                    t = t.expression;
                    this.Bs = true;
                }
                this._s = t;
                break;
            }
        }
        this.Ps();
        const a = l.declaration;
        if (!(this.Is = a.$kind === "ArrayDestructuring" || a.$kind === "ObjectDestructuring")) {
            this.local = s.astEvaluate(a, this.$controller.scope, r, null);
        }
    }
    attaching(t, e) {
        this.Ls();
        return this.Ms(t);
    }
    detaching(t, e) {
        this.Ps();
        return this.qs(t);
    }
    unbinding(t, e) {
        this.Cs.clear();
        this.ks.clear();
    }
    itemsChanged() {
        if (!this.$controller.isActive) {
            return;
        }
        this.Ps();
        this.Ls();
        this.Ds(this.items, void 0);
    }
    handleCollectionChange(t, e) {
        const i = this.$controller;
        if (!i.isActive) {
            return;
        }
        if (this.Bs) {
            if (this.Ss) {
                return;
            }
            this.Ss = true;
            this.items = s.astEvaluate(this.forOf.iterable, i.scope, this.Es, null);
            this.Ss = false;
            return;
        }
        this.Ls();
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
            const e = this.Rs;
            const a = e.length;
            const c = this.forOf;
            const u = c.declaration;
            const f = this.Es;
            const d = this.Is;
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
                let w = 0;
                const y = r - 1;
                const k = a - 1;
                const C = new Map;
                const A = new Map;
                const B = this.ks;
                const S = this.Cs;
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
                const I = p;
                for (p = I; p <= k; ++p) {
                    if (B.has(x = h ? e[p] : ensureUnique(e[p], p))) {
                        b = B.get(x);
                    } else {
                        b = h ? getKeyValue(B, l, x, getScope(S, x, c, _, f, t, d), f) : x;
                        B.set(x, b);
                    }
                    A.set(b, p);
                }
                for (p = R; p <= y; ++p) {
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
                for (p = I; p <= k; ++p) {
                    if (!C.has(B.get(h ? e[p] : ensureUnique(e[p], p)))) {
                        i[p] = -2;
                    }
                }
                C.clear();
                A.clear();
            }
        }
        if (i === void 0) {
            const e = t.onResolve(this.qs(null), (() => this.Ms(null)));
            if (isPromise(e)) {
                e.catch(rethrow);
            }
        } else {
            if (i.deletedIndices.length > 0) {
                const e = t.onResolve(this.Hs(i), (() => this.Fs(r, i)));
                if (isPromise(e)) {
                    e.catch(rethrow);
                }
            } else {
                this.Fs(r, i);
            }
        }
    }
    Ps() {
        const t = this.$controller.scope;
        let e = this.Os;
        let i = this.Bs;
        let n;
        if (i) {
            e = this.Os = s.astEvaluate(this._s, t, this.Es, null) ?? null;
            i = this.Bs = !m(this.items, e);
        }
        const r = this.As;
        if (this.$controller.isActive) {
            n = this.As = s.getCollectionObserver(i ? e : this.items);
            if (r !== n) {
                r?.unsubscribe(this);
                n?.subscribe(this);
            }
        } else {
            r?.unsubscribe(this);
            this.As = undefined;
        }
    }
    Ls() {
        const {items: t} = this;
        if (isArray(t)) {
            this.Rs = t;
            return;
        }
        const e = [];
        iterate(t, ((t, s) => {
            e[s] = t;
        }));
        this.Rs = e;
    }
    Ms(t) {
        let e = void 0;
        let s;
        let i;
        let n;
        const {$controller: r, f: l, local: h, l: a, items: c, Cs: u, Es: f, forOf: d, Is: p} = this;
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
    qs(t) {
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
    Hs(t) {
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
    Fs(t, e) {
        let i = void 0;
        let n;
        let r;
        let l;
        let h = 0;
        const {$controller: a, f: c, local: u, Rs: f, l: d, views: p, Is: m, Es: g, Cs: x, ys: v, forOf: b} = this;
        const w = e.length;
        for (;w > h; ++h) {
            if (e[h] === -2) {
                r = c.create();
                p.splice(h, 0, r);
            }
        }
        if (p.length !== w) {
            throw createMappedError(814, [ p.length, w ]);
        }
        const y = a.scope;
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
                l = getScope(x, f[h], b, y, g, u, m);
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

Repeat.inject = [ te, s.IExpressionParser, Ke, $e, Bt ];

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
        this.view = t.resolve(Bt).create().setLocation(t.resolve(Ke));
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
        this.f = t.resolve(Bt);
        this.l = t.resolve(Ke);
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
        this.queue((() => this.Vs(t)));
    }
    Vs(e) {
        const s = e.isMatch(this.value);
        const i = this.activeCases;
        const n = i.length;
        if (!s) {
            if (n > 0 && i[0].id === e.id) {
                return this.$s(null);
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
        return t.onResolve(this.$s(null, r), (() => {
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
        return t.onResolve(this.activeCases.length > 0 ? this.$s(e, i) : void 0, (() => {
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
    $s(e, s = []) {
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

let $s = 0;

exports.Case = class Case {
    constructor() {
        this.id = ++$s;
        this.fallThrough = false;
        this.view = void 0;
        this.f = t.resolve(Bt);
        this.os = t.resolve(s.IObserverLocator);
        this.l = t.resolve(Ke);
        this.Ws = t.resolve(t.ILogger).scopeTo(`${this.constructor.name}-#${this.id}`);
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
        this.Ws.debug("isMatch()");
        const e = this.value;
        if (isArray(e)) {
            if (this.As === void 0) {
                this.As = this.js(e);
            }
            return e.includes(t);
        }
        return e === t;
    }
    valueChanged(t, e) {
        if (isArray(t)) {
            this.As?.unsubscribe(this);
            this.As = this.js(t);
        } else if (this.As !== void 0) {
            this.As.unsubscribe(this);
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
        this.As?.unsubscribe(this);
        this.view?.dispose();
        this.view = void 0;
    }
    linkToSwitch(t) {
        t.cases.push(this);
    }
    js(t) {
        const e = this.os.getArrayObserver(t);
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
        this.f = t.resolve(Bt);
        this.l = t.resolve(Ke);
        this.p = t.resolve(st);
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
        this.f = t.resolve(Bt);
        this.l = t.resolve(Ke);
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
        this.f = t.resolve(Bt);
        this.l = t.resolve(Ke);
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
        this.f = t.resolve(Bt);
        this.l = t.resolve(Ke);
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

let Ns = class PromiseAttributePattern {
    "promise.resolve"(t, e) {
        return new AttrSyntax(t, e, "promise", "bind");
    }
};

Ns = __decorate([ attributePattern({
    pattern: "promise.resolve",
    symbols: ""
}) ], Ns);

let Ws = class FulfilledAttributePattern {
    then(t, e) {
        return new AttrSyntax(t, e, "then", "from-view");
    }
};

Ws = __decorate([ attributePattern({
    pattern: "then",
    symbols: ""
}) ], Ws);

let js = class RejectedAttributePattern {
    catch(t, e) {
        return new AttrSyntax(t, e, "catch", "from-view");
    }
};

js = __decorate([ attributePattern({
    pattern: "catch",
    symbols: ""
}) ], js);

class Focus {
    constructor() {
        this.zs = false;
        this.Us = t.resolve(Ue);
        this.p = t.resolve(st);
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) {
            this.Gs();
        } else {
            this.zs = true;
        }
    }
    attached() {
        if (this.zs) {
            this.zs = false;
            this.Gs();
        }
        this.Us.addEventListener("focus", this);
        this.Us.addEventListener("blur", this);
    }
    detaching() {
        const t = this.Us;
        t.removeEventListener("focus", this);
        t.removeEventListener("blur", this);
    }
    handleEvent(t) {
        if (t.type === "focus") {
            this.value = true;
        } else if (!this.Ks) {
            this.value = false;
        }
    }
    Gs() {
        const t = this.Us;
        const e = this.Ks;
        const s = this.value;
        if (s && !e) {
            t.focus();
        } else if (!s && e) {
            t.blur();
        }
    }
    get Ks() {
        return this.Us === this.p.document.activeElement;
    }
}

__decorate([ bindable({
    mode: I
}) ], Focus.prototype, "value", void 0);

customAttribute("focus")(Focus);

class Portal {
    constructor() {
        this.position = "beforeend";
        this.strict = false;
        const e = t.resolve(Bt);
        const s = t.resolve(Ke);
        const i = t.resolve(st);
        this.p = i;
        this.Xs = i.document.createElement("div");
        (this.view = e.create()).setLocation(this.Qs = createLocation(i));
        setEffectiveParentNode(this.view.nodes, s);
    }
    attaching(t) {
        if (this.callbackContext == null) {
            this.callbackContext = this.$controller.scope.bindingContext;
        }
        const e = this.Xs = this.Ys();
        this.Zs(e, this.position);
        return this.Js(t, e);
    }
    detaching(t) {
        return this.ti(t, this.Xs);
    }
    targetChanged() {
        const {$controller: e} = this;
        if (!e.isActive) {
            return;
        }
        const s = this.Ys();
        if (this.Xs === s) {
            return;
        }
        this.Xs = s;
        const i = t.onResolve(this.ti(null, s), (() => {
            this.Zs(s, this.position);
            return this.Js(null, s);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    positionChanged() {
        const {$controller: e, Xs: s} = this;
        if (!e.isActive) {
            return;
        }
        const i = t.onResolve(this.ti(null, s), (() => {
            this.Zs(s, this.position);
            return this.Js(null, s);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    Js(e, s) {
        const {activating: i, callbackContext: n, view: r} = this;
        return t.onResolve(i?.call(n, s, r), (() => this.ei(e, s)));
    }
    ei(e, s) {
        const {$controller: i, view: n} = this;
        if (e === null) {
            n.nodes.insertBefore(this.Qs);
        } else {
            return t.onResolve(n.activate(e ?? n, i, i.scope), (() => this.si(s)));
        }
        return this.si(s);
    }
    si(t) {
        const {activated: e, callbackContext: s, view: i} = this;
        return e?.call(s, t, i);
    }
    ti(e, s) {
        const {deactivating: i, callbackContext: n, view: r} = this;
        return t.onResolve(i?.call(n, s, r), (() => this.ii(e, s)));
    }
    ii(e, s) {
        const {$controller: i, view: n} = this;
        if (e === null) {
            n.nodes.remove();
        } else {
            return t.onResolve(n.deactivate(e, i), (() => this.ni(s)));
        }
        return this.ni(s);
    }
    ni(e) {
        const {deactivated: s, callbackContext: i, view: n} = this;
        return t.onResolve(s?.call(i, e, n), (() => this.ri()));
    }
    Ys() {
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
    ri() {
        this.Qs.remove();
        this.Qs.$start.remove();
    }
    Zs(t, e) {
        const s = this.Qs;
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

let zs;

exports.AuSlot = class AuSlot {
    constructor() {
        this.oi = null;
        this.li = null;
        this.Xt = false;
        this.expose = null;
        this.slotchange = null;
        this.hi = new Set;
        this.As = null;
        const e = t.resolve(Ne);
        const s = t.resolve(Ke);
        const i = t.resolve(te);
        const n = t.resolve(ue);
        const r = this.name = i.data.name;
        const l = i.projections?.[Rt];
        const h = e.instruction?.projections?.[r];
        const a = e.controller.container;
        let c;
        let u;
        if (h == null) {
            u = a.createChild({
                inheritParentResources: true
            });
            c = n.getViewFactory(l ?? (zs ??= CustomElementDefinition.create({
                name: "au-slot-empty-template",
                template: "",
                needsCompile: false
            })), u);
            this.ai = false;
        } else {
            u = a.createChild();
            u.useResources(e.parent.controller.container);
            registerResolver(u, Ne, new t.InstanceProvider(void 0, e.parent));
            c = n.getViewFactory(h, u);
            this.ai = true;
            this.ui = a.getAll(Et, false)?.filter((t => t.slotName === "*" || t.slotName === r)) ?? t.emptyArray;
        }
        this.fi = (this.ui ??= t.emptyArray).length > 0;
        this.di = e;
        this.view = c.create().setLocation(this.l = s);
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
        this.hi.add(t);
    }
    unsubscribe(t) {
        this.hi.delete(t);
    }
    binding(t, e) {
        this.oi = this.$controller.scope.parent;
        let i;
        if (this.ai) {
            i = this.di.controller.scope.parent;
            (this.li = s.Scope.fromParent(i, i.bindingContext)).overrideContext.$host = this.expose ?? this.oi.bindingContext;
        }
    }
    attaching(e, s) {
        return t.onResolve(this.view.activate(e, this.$controller, this.ai ? this.li : this.oi), (() => {
            if (this.fi) {
                this.ui.forEach((t => t.watch(this)));
                this.ds();
                this.pi();
                this.Xt = true;
            }
        }));
    }
    detaching(t, e) {
        this.Xt = false;
        this.mi();
        this.ui.forEach((t => t.unwatch(this)));
        return this.view.deactivate(t, this.$controller);
    }
    exposeChanged(t) {
        if (this.ai && this.li != null) {
            this.li.overrideContext.$host = t;
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
    ds() {
        if (this.As != null) {
            return;
        }
        const t = this.l;
        const e = t.parentElement;
        if (e == null) {
            return;
        }
        (this.As = createMutationObserver(e, (e => {
            if (isMutationWithinLocation(t, e)) {
                this.pi();
            }
        }))).observe(e, {
            childList: true
        });
    }
    mi() {
        this.As?.disconnect();
        this.As = null;
    }
    pi() {
        const t = this.nodes;
        const e = new Set(this.hi);
        let s;
        if (this.Xt) {
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
    containerless: true,
    processContent(t, e, s) {
        s.name = t.getAttribute("name") ?? Rt;
        let i = t.firstChild;
        let n = null;
        while (i !== null) {
            n = i.nextSibling;
            if (isElement(i) && i.hasAttribute(It)) {
                t.removeChild(i);
            }
            i = n;
        }
    }
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
        this.gi = void 0;
        this.tag = null;
        this.c = t.resolve(t.IContainer);
        this.parent = t.resolve($e);
        this.xi = t.resolve(Ue);
        this.l = t.resolve(Ke);
        this.p = t.resolve(st);
        this.r = t.resolve(ue);
        this.vi = t.resolve(te);
        this.bi = t.resolve(t.transient(CompositionContextFactory));
        this.st = t.resolve(ee);
        this.J = t.resolve(Ne);
        this.ep = t.resolve(s.IExpressionParser);
        this.oL = t.resolve(s.IObserverLocator);
    }
    get composing() {
        return this.wi;
    }
    get composition() {
        return this.gi;
    }
    attaching(e, s) {
        return this.wi = t.onResolve(this.queue(new ChangeInfo(this.template, this.component, this.model, void 0), e), (t => {
            if (this.bi.yi(t)) {
                this.wi = void 0;
            }
        }));
    }
    detaching(e) {
        const s = this.gi;
        const i = this.wi;
        this.bi.invalidate();
        this.gi = this.wi = void 0;
        return t.onResolve(i, (() => s?.deactivate(e)));
    }
    propertyChanged(e) {
        if (e === "composing" || e === "composition") return;
        if (e === "model" && this.gi != null) {
            this.gi.update(this.model);
            return;
        }
        if (e === "tag" && this.gi?.controller.vmKind === Te) {
            return;
        }
        this.wi = t.onResolve(this.wi, (() => t.onResolve(this.queue(new ChangeInfo(this.template, this.component, this.model, e), void 0), (t => {
            if (this.bi.yi(t)) {
                this.wi = void 0;
            }
        }))));
    }
    queue(e, s) {
        const i = this.bi;
        const n = this.gi;
        return t.onResolve(i.create(e), (e => {
            if (i.yi(e)) {
                return t.onResolve(this.compose(e), (r => {
                    if (i.yi(e)) {
                        return t.onResolve(r.activate(s), (() => {
                            if (i.yi(e)) {
                                this.gi = r;
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
        const {ki: i, Ci: n, Ai: r} = e.change;
        const {c: l, $controller: h, l: a, vi: c} = this;
        const u = this.Bi(this.J.controller.container, n);
        const f = l.createChild();
        const d = this.p.document.createElement(u == null ? this.tag ?? "div" : u.name);
        a.parentNode.insertBefore(d, a);
        let p;
        if (u == null) {
            p = this.tag == null ? convertToRenderLocation(d) : null;
        } else {
            p = u.containerless ? convertToRenderLocation(d) : null;
        }
        const removeCompositionHost = () => {
            d.remove();
            if (p != null) {
                let t = p.$start.nextSibling;
                let e = null;
                while (t !== null && t !== p) {
                    e = t.nextSibling;
                    t.remove();
                    t = e;
                }
                p.$start?.remove();
                p.remove();
            }
        };
        const m = this.Si(f, typeof n === "string" ? u.Type : n, d, p);
        const compose = () => {
            const n = c.captures ?? t.emptyArray;
            if (u !== null) {
                const s = u.capture;
                const [i, r] = n.reduce(((t, e) => {
                    const i = !(e.target in u.bindables) && (s === true || isFunction(s) && !!s(e.target));
                    t[i ? 0 : 1].push(e);
                    return t;
                }), [ [], [] ]);
                const l = Controller.$el(f, m, d, {
                    projections: c.projections,
                    captures: i
                }, u, p);
                this._i(d, u, r).forEach((t => l.addBinding(t)));
                return new CompositionController(l, (t => l.activate(t ?? l, h, h.scope.parent)), (e => t.onResolve(l.deactivate(e ?? l, h), removeCompositionHost)), (t => m.activate?.(t)), e);
            } else {
                const r = CustomElementDefinition.create({
                    name: rs.generateName(),
                    template: i
                });
                const l = this.r.getViewFactory(r, f);
                const a = Controller.$view(l, h);
                const c = this.scopeBehavior === "auto" ? s.Scope.fromParent(this.parent.scope, m) : s.Scope.create(m);
                a.setHost(d);
                if (p == null) {
                    this._i(d, r, n).forEach((t => a.addBinding(t)));
                } else {
                    a.setLocation(p);
                }
                return new CompositionController(a, (t => a.activate(t ?? a, h, c)), (e => t.onResolve(a.deactivate(e ?? a, h), removeCompositionHost)), (t => m.activate?.(t)), e);
            }
        };
        if ("activate" in m) {
            return t.onResolve(m.activate(r), (() => compose()));
        } else {
            return compose();
        }
    }
    Si(e, s, i, n) {
        if (s == null) {
            return new EmptyComponent;
        }
        if (typeof s === "object") {
            return s;
        }
        const r = this.p;
        registerHostNode(e, r, i);
        registerResolver(e, Ke, new t.InstanceProvider("IRenderLocation", n));
        const l = e.invoke(s);
        registerResolver(e, s, new t.InstanceProvider("au-compose.component", l));
        return l;
    }
    Bi(t, e) {
        if (typeof e === "string") {
            const s = rs.find(t, e);
            if (s == null) {
                throw createMappedError(806, e);
            }
            return s;
        }
        const s = isFunction(e) ? e : e?.constructor;
        return rs.isType(s) ? rs.getDefinition(s) : null;
    }
    _i(t, e, s) {
        const i = new HydrationContext(this.$controller, {
            projections: null,
            captures: s
        }, this.J.parent);
        return SpreadBinding.create(i, t, e, this.r, this.st, this.p, this.ep, this.oL);
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
    yi(t) {
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
        this.ki = t;
        this.Ci = e;
        this.Ai = s;
        this.Ri = i;
    }
    load() {
        if (isPromise(this.ki) || isPromise(this.Ci)) {
            return Promise.all([ this.ki, this.Ci ]).then((([t, e]) => new LoadedChangeInfo(t, e, this.Ai, this.Ri)));
        } else {
            return new LoadedChangeInfo(this.ki, this.Ci, this.Ai, this.Ri);
        }
    }
}

class LoadedChangeInfo {
    constructor(t, e, s, i) {
        this.ki = t;
        this.Ci = e;
        this.Ai = s;
        this.Ri = i;
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

const Us = /*@__PURE__*/ N("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw createMappedError(99, "sanitize");
    }
})));

class SanitizeValueConverter {
    constructor() {
        this.Ii = t.resolve(Us);
    }
    toView(t) {
        if (t == null) {
            return null;
        }
        return this.Ii.sanitize(t);
    }
}

valueConverter("sanitize")(SanitizeValueConverter);

const Gs = /*@__PURE__*/ N("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const Ks = {};

class TemplateElementFactory {
    constructor() {
        this.p = t.resolve(st);
        this.ki = this.t();
    }
    t() {
        return this.p.document.createElement("template");
    }
    createTemplate(t) {
        if (isString(t)) {
            let e = Ks[t];
            if (e === void 0) {
                const s = this.ki;
                s.innerHTML = t;
                const i = s.content.firstElementChild;
                if (needsWrapping(i)) {
                    this.ki = this.t();
                    e = s;
                } else {
                    s.content.removeChild(i);
                    e = i;
                }
                Ks[t] = e;
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
        t.register(W(this, this), j(this, ee));
    }
    compile(e, s, i) {
        const n = CustomElementDefinition.getOrCreate(e);
        if (n.template === null || n.template === void 0) {
            return n;
        }
        if (n.needsCompile === false) {
            return n;
        }
        i ??= Zs;
        const r = new CompilationContext(e, s, i, null, null, void 0);
        const l = isString(n.template) || !e.enhance ? r.Ti.createTemplate(n.template) : n.template;
        const h = l.nodeName === Xs && l.content != null;
        const a = h ? l.content : l;
        const c = li.findAll(s);
        const u = c.length;
        let f = 0;
        if (u > 0) {
            while (u > f) {
                c[f].compiling?.(l);
                ++f;
            }
        }
        if (l.hasAttribute(ri)) {
            throw createMappedError(701, n);
        }
        this.Ei(a, r);
        this.Pi(a, r);
        const d = CustomElementDefinition.create({
            ...e,
            name: e.name || is(),
            dependencies: (e.dependencies ?? t.emptyArray).concat(r.deps ?? t.emptyArray),
            instructions: r.rows,
            surrogates: h ? this.Li(l, r) : t.emptyArray,
            template: l,
            hasSlots: r.hasSlot,
            needsCompile: false
        });
        if (r.deps != null) {
            const t = [ d.Type, ...d.dependencies, ...r.deps ];
            for (const e of r.deps) {
                getElementDefinition(e).dependencies.push(...t.filter((t => t !== e)));
            }
        }
        return d;
    }
    compileSpread(e, s, i, n, r) {
        const l = new CompilationContext(e, i, Zs, null, null, void 0);
        const h = [];
        const a = r ?? l.Mi(n.nodeName.toLowerCase());
        const c = a !== null;
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
            k = l.qi(p);
            if (k !== null && k.type === xs) {
                ti.node = n;
                ti.attr = p;
                ti.bindable = null;
                ti.def = null;
                h.push(k.build(ti, l.ep, l.m));
                continue;
            }
            m = l.Di(B);
            if (m !== null) {
                if (m.isTemplateController) {
                    throw createMappedError(9998, B);
                }
                b = BindablesInfo.from(m, true);
                A = m.noMultiBindings === false && k === null && hasInlineBindings(S);
                if (A) {
                    v = this.Hi(n, S, m, l);
                } else {
                    y = b.primary;
                    if (k === null) {
                        C = u.parse(S, x);
                        v = [ C === null ? new SetPropertyInstruction(S, y.name) : new InterpolationInstruction(C, y.name) ];
                    } else {
                        ti.node = n;
                        ti.attr = p;
                        ti.bindable = y;
                        ti.def = m;
                        v = [ k.build(ti, l.ep, l.m) ];
                    }
                }
                (g ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? m : m.name, m.aliases != null && m.aliases.includes(B) ? B : void 0, v));
                continue;
            }
            if (k === null) {
                C = u.parse(S, x);
                if (c) {
                    b = BindablesInfo.from(a, false);
                    w = b.attrs[B];
                    if (w !== void 0) {
                        C = u.parse(S, x);
                        h.push(new SpreadElementPropBindingInstruction(C == null ? new SetPropertyInstruction(S, w.name) : new InterpolationInstruction(C, w.name)));
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
                    w = b.attrs[B];
                    if (w !== void 0) {
                        ti.node = n;
                        ti.attr = p;
                        ti.bindable = w;
                        ti.def = a;
                        h.push(new SpreadElementPropBindingInstruction(k.build(ti, l.ep, l.m)));
                        continue;
                    }
                }
                ti.node = n;
                ti.attr = p;
                ti.bindable = null;
                ti.def = null;
                h.push(k.build(ti, l.ep, l.m));
            }
        }
        resetCommandBuildInfo();
        if (g != null) {
            return g.concat(h);
        }
        return h;
    }
    Li(e, s) {
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
        let w;
        let y;
        let k;
        let C;
        for (;l > h; ++h) {
            a = n[h];
            c = a.name;
            u = a.value;
            f = s.Fe.parse(c, u);
            k = f.target;
            C = f.rawValue;
            if (ei[k]) {
                throw createMappedError(702, c);
            }
            b = s.qi(f);
            if (b !== null && b.type === xs) {
                ti.node = e;
                ti.attr = f;
                ti.bindable = null;
                ti.def = null;
                i.push(b.build(ti, s.ep, s.m));
                continue;
            }
            d = s.Di(k);
            if (d !== null) {
                if (d.isTemplateController) {
                    throw createMappedError(703, k);
                }
                g = BindablesInfo.from(d, true);
                y = d.noMultiBindings === false && b === null && hasInlineBindings(C);
                if (y) {
                    m = this.Hi(e, C, d, s);
                } else {
                    v = g.primary;
                    if (b === null) {
                        w = r.parse(C, x);
                        m = [ w === null ? new SetPropertyInstruction(C, v.name) : new InterpolationInstruction(w, v.name) ];
                    } else {
                        ti.node = e;
                        ti.attr = f;
                        ti.bindable = v;
                        ti.def = d;
                        m = [ b.build(ti, s.ep, s.m) ];
                    }
                }
                e.removeAttribute(c);
                --h;
                --l;
                (p ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? d : d.name, d.aliases != null && d.aliases.includes(k) ? k : void 0, m));
                continue;
            }
            if (b === null) {
                w = r.parse(C, x);
                if (w != null) {
                    e.removeAttribute(c);
                    --h;
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
                ti.node = e;
                ti.attr = f;
                ti.bindable = null;
                ti.def = null;
                i.push(b.build(ti, s.ep, s.m));
            }
        }
        resetCommandBuildInfo();
        if (p != null) {
            return p.concat(i);
        }
        return i;
    }
    Pi(t, e) {
        switch (t.nodeType) {
          case 1:
            switch (t.nodeName) {
              case "LET":
                return this.Fi(t, e);

              default:
                return this.Oi(t, e);
            }

          case 3:
            return this.Vi(t, e);

          case 11:
            {
                let s = t.firstChild;
                while (s !== null) {
                    s = this.Pi(s, e);
                }
                break;
            }
        }
        return t.nextSibling;
    }
    Fi(e, i) {
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
            f = i.Fe.parse(d, p);
            g = f.target;
            v = f.rawValue;
            m = i.qi(f);
            if (m !== null) {
                if (f.command === "bind") {
                    l.push(new LetBindingInstruction(h.parse(v, w), t.camelCase(g)));
                } else {
                    throw createMappedError(704, f);
                }
                continue;
            }
            b = h.parse(v, x);
            l.push(new LetBindingInstruction(b === null ? new s.PrimitiveLiteralExpression(v) : b, t.camelCase(g)));
        }
        i.rows.push([ new HydrateLetElementInstruction(l, a) ]);
        return this.$i(e, i).nextSibling;
    }
    Oi(e, s) {
        const i = e.nextSibling;
        const n = (e.getAttribute("as-element") ?? e.nodeName).toLowerCase();
        const r = s.Mi(n);
        const l = r !== null;
        const h = l && r.shadowOptions != null;
        const a = r?.capture;
        const c = a != null && typeof a !== "boolean";
        const u = a ? [] : t.emptyArray;
        const f = s.ep;
        const d = this.debug ? t.noop : () => {
            e.removeAttribute(w);
            --v;
            --g;
        };
        let p = e.attributes;
        let m;
        let g = p.length;
        let v = 0;
        let b;
        let w;
        let y;
        let k;
        let C;
        let A;
        let B = null;
        let S = false;
        let _;
        let R;
        let I;
        let T;
        let E;
        let P;
        let L;
        let M = null;
        let q;
        let D;
        let H;
        let F;
        let O = true;
        let V = false;
        let $ = false;
        let N = false;
        let W;
        if (n === "slot") {
            if (s.root.def.shadowOptions == null) {
                throw createMappedError(717, s.root.def.name);
            }
            s.root.hasSlot = true;
        }
        if (l) {
            W = {};
            O = r.processContent?.call(r.Type, e, s.p, W);
            p = e.attributes;
            g = p.length;
        }
        for (;g > v; ++v) {
            b = p[v];
            w = b.name;
            y = b.value;
            switch (w) {
              case "as-element":
              case "containerless":
                d();
                if (!V) {
                    V = w === "containerless";
                }
                continue;
            }
            k = s.Fe.parse(w, y);
            M = s.qi(k);
            H = k.target;
            F = k.rawValue;
            if (a && (!c || c && a(H))) {
                if (M != null && M.type === xs) {
                    d();
                    u.push(k);
                    continue;
                }
                $ = H !== It && H !== "slot";
                if ($) {
                    q = BindablesInfo.from(r, false);
                    if (q.attrs[H] == null && !s.Di(H)?.isTemplateController) {
                        d();
                        u.push(k);
                        continue;
                    }
                }
            }
            if (M?.type === xs) {
                ti.node = e;
                ti.attr = k;
                ti.bindable = null;
                ti.def = null;
                (C ??= []).push(M.build(ti, s.ep, s.m));
                d();
                continue;
            }
            if (l) {
                q = BindablesInfo.from(r, false);
                _ = q.attrs[H];
                if (_ !== void 0) {
                    if (M === null) {
                        P = f.parse(F, x);
                        (A ??= []).push(P == null ? new SetPropertyInstruction(F, _.name) : new InterpolationInstruction(P, _.name));
                    } else {
                        ti.node = e;
                        ti.attr = k;
                        ti.bindable = _;
                        ti.def = r;
                        (A ??= []).push(M.build(ti, s.ep, s.m));
                    }
                    d();
                    continue;
                }
            }
            B = s.Di(H);
            if (B !== null) {
                q = BindablesInfo.from(B, true);
                S = B.noMultiBindings === false && M === null && hasInlineBindings(F);
                if (S) {
                    I = this.Hi(e, F, B, s);
                } else {
                    D = q.primary;
                    if (M === null) {
                        P = f.parse(F, x);
                        I = [ P === null ? new SetPropertyInstruction(F, D.name) : new InterpolationInstruction(P, D.name) ];
                    } else {
                        ti.node = e;
                        ti.attr = k;
                        ti.bindable = D;
                        ti.def = B;
                        I = [ M.build(ti, s.ep, s.m) ];
                    }
                }
                d();
                if (B.isTemplateController) {
                    (T ??= []).push(new HydrateTemplateController(Js, this.resolveResources ? B : B.name, void 0, I));
                } else {
                    (R ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? B : B.name, B.aliases != null && B.aliases.includes(H) ? H : void 0, I));
                }
                continue;
            }
            if (M === null) {
                P = f.parse(F, x);
                if (P != null) {
                    d();
                    (C ??= []).push(new InterpolationInstruction(P, s.m.map(e, H) ?? t.camelCase(H)));
                }
                continue;
            }
            ti.node = e;
            ti.attr = k;
            ti.bindable = null;
            ti.def = null;
            (C ??= []).push(M.build(ti, s.ep, s.m));
            d();
        }
        resetCommandBuildInfo();
        if (this.Ni(e, C) && C != null && C.length > 1) {
            this.Wi(e, C);
        }
        if (l) {
            L = new HydrateElementInstruction(this.resolveResources ? r : r.name, A ?? t.emptyArray, null, V, u, W);
        }
        if (C != null || L != null || R != null) {
            m = t.emptyArray.concat(L ?? t.emptyArray, R ?? t.emptyArray, C ?? t.emptyArray);
            N = true;
        }
        let j;
        if (T != null) {
            g = T.length - 1;
            v = g;
            E = T[v];
            let t;
            if (isMarker(e)) {
                t = s.t();
                appendManyToTemplate(t, [ s.ct(), s.ji(Qs), s.ji(Ys) ]);
            } else {
                this.zi(e, s);
                if (e.nodeName === "TEMPLATE") {
                    t = e;
                } else {
                    t = s.t();
                    appendToTemplate(t, e);
                }
            }
            const i = t;
            const a = s.Ui(m == null ? [] : [ m ]);
            let c;
            let u;
            let f = false;
            let d;
            let p;
            let x;
            let b;
            let w;
            let y;
            let k = 0, C = 0;
            let A = e.firstChild;
            let B = false;
            if (O !== false) {
                while (A !== null) {
                    u = isElement(A) ? A.getAttribute(It) : null;
                    f = u !== null || l && !h;
                    c = A.nextSibling;
                    if (f) {
                        if (!l) {
                            throw createMappedError(706, u, n);
                        }
                        A.removeAttribute?.(It);
                        B = isTextNode(A) && A.textContent.trim() === "";
                        if (!B) {
                            ((p ??= {})[u || Rt] ??= []).push(A);
                        }
                        e.removeChild(A);
                    }
                    A = c;
                }
            }
            if (p != null) {
                d = {};
                for (u in p) {
                    t = s.t();
                    x = p[u];
                    for (k = 0, C = x.length; C > k; ++k) {
                        b = x[k];
                        if (b.nodeName === "TEMPLATE") {
                            if (b.attributes.length > 0) {
                                appendToTemplate(t, b);
                            } else {
                                appendToTemplate(t, b.content);
                            }
                        } else {
                            appendToTemplate(t, b);
                        }
                    }
                    y = s.Ui();
                    this.Pi(t.content, y);
                    d[u] = CustomElementDefinition.create({
                        name: is(),
                        template: t,
                        instructions: y.rows,
                        needsCompile: false
                    });
                }
                L.projections = d;
            }
            if (N) {
                if (l && (V || r.containerless)) {
                    this.zi(e, s);
                } else {
                    this.$i(e, s);
                }
            }
            j = !l || !r.containerless && !V && O !== false;
            if (j) {
                if (e.nodeName === Xs) {
                    this.Pi(e.content, a);
                } else {
                    A = e.firstChild;
                    while (A !== null) {
                        A = this.Pi(A, a);
                    }
                }
            }
            E.def = CustomElementDefinition.create({
                name: is(),
                template: i,
                instructions: a.rows,
                needsCompile: false
            });
            while (v-- > 0) {
                E = T[v];
                t = s.t();
                w = s.ct();
                appendManyToTemplate(t, [ w, s.ji(Qs), s.ji(Ys) ]);
                E.def = CustomElementDefinition.create({
                    name: is(),
                    template: t,
                    needsCompile: false,
                    instructions: [ [ T[v + 1] ] ]
                });
            }
            s.rows.push([ E ]);
        } else {
            if (m != null) {
                s.rows.push(m);
            }
            let t = e.firstChild;
            let i;
            let a;
            let c = false;
            let u = null;
            let f;
            let d;
            let p;
            let g;
            let x;
            let v = false;
            let b = 0, w = 0;
            if (O !== false) {
                while (t !== null) {
                    a = isElement(t) ? t.getAttribute(It) : null;
                    c = a !== null || l && !h;
                    i = t.nextSibling;
                    if (c) {
                        if (!l) {
                            throw createMappedError(706, a, n);
                        }
                        t.removeAttribute?.(It);
                        v = isTextNode(t) && t.textContent.trim() === "";
                        if (!v) {
                            ((f ??= {})[a || Rt] ??= []).push(t);
                        }
                        e.removeChild(t);
                    }
                    t = i;
                }
            }
            if (f != null) {
                u = {};
                for (a in f) {
                    g = s.t();
                    d = f[a];
                    for (b = 0, w = d.length; w > b; ++b) {
                        p = d[b];
                        if (p.nodeName === Xs) {
                            if (p.attributes.length > 0) {
                                appendToTemplate(g, p);
                            } else {
                                appendToTemplate(g, p.content);
                            }
                        } else {
                            appendToTemplate(g, p);
                        }
                    }
                    x = s.Ui();
                    this.Pi(g.content, x);
                    u[a] = CustomElementDefinition.create({
                        name: is(),
                        template: g,
                        instructions: x.rows,
                        needsCompile: false
                    });
                }
                L.projections = u;
            }
            if (N) {
                if (l && (V || r.containerless)) {
                    this.zi(e, s);
                } else {
                    this.$i(e, s);
                }
            }
            j = !l || !r.containerless && !V && O !== false;
            if (j && e.childNodes.length > 0) {
                t = e.firstChild;
                while (t !== null) {
                    t = this.Pi(t, s);
                }
            }
        }
        return i;
    }
    Vi(t, e) {
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
                insertBefore(s, e.Gi(c), t);
            }
            for (h = 0, a = l.length; a > h; ++h) {
                insertManyBefore(s, t, [ e.ct(), e.Gi(" ") ]);
                if (c = r[h + 1]) {
                    insertBefore(s, e.Gi(c), t);
                }
                e.rows.push([ new TextBindingInstruction(l[h]) ]);
            }
            s.removeChild(t);
        }
        return n;
    }
    Hi(t, e, s, i) {
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
                d = i.Fe.parse(h, a);
                p = i.qi(d);
                m = n.attrs[d.target];
                if (m == null) {
                    throw createMappedError(707, d.target, s.name);
                }
                if (p === null) {
                    f = i.ep.parse(a, x);
                    l.push(f === null ? new SetPropertyInstruction(a, m.name) : new InterpolationInstruction(f, m.name));
                } else {
                    ti.node = t;
                    ti.attr = d;
                    ti.bindable = m;
                    ti.def = s;
                    l.push(p.build(ti, i.ep, i.m));
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
    Ei(e, s) {
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
        for (const e of r) {
            if (e.parentNode !== n) {
                throw createMappedError(709, i);
            }
            const r = processTemplateName(i, e, h);
            const l = e.content;
            const a = t.toArray(l.querySelectorAll("bindable"));
            const c = new Set;
            const u = new Set;
            const f = a.reduce(((e, s) => {
                if (s.parentNode !== l) {
                    throw createMappedError(710, r);
                }
                const i = s.getAttribute("name");
                if (i === null) {
                    throw createMappedError(711, s, r);
                }
                const n = s.getAttribute("attribute");
                if (n !== null && u.has(n) || c.has(i)) {
                    throw createMappedError(712, c, n);
                } else {
                    if (n !== null) {
                        u.add(n);
                    }
                    c.add(i);
                }
                const h = t.toArray(s.attributes).filter((t => !ni.includes(t.name)));
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
            s.Ki(defineElement({
                name: r,
                template: e,
                bindables: f
            }, LocalTemplateType));
            n.removeChild(e);
        }
    }
    Ni(t, e) {
        const s = t.nodeName;
        return s === "INPUT" && si[t.type] === 1 || s === "SELECT" && (t.hasAttribute("multiple") || e?.some((t => t.type === Ot && t.to === "multiple")));
    }
    Wi(t, e) {
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
    $i(t, e) {
        insertBefore(t.parentNode, e.ji("au*"), t);
        return t;
    }
    zi(t, e) {
        if (isMarker(t)) {
            return t;
        }
        const s = t.parentNode;
        const i = e.ct();
        insertManyBefore(s, t, [ i, e.ji(Qs), e.ji(Ys) ]);
        s.removeChild(t);
        return i;
    }
}

const Xs = "TEMPLATE";

const Qs = "au-start";

const Ys = "au-end";

const isMarker = t => t.nodeValue === "au*";

class CompilationContext {
    constructor(e, i, n, r, l, h) {
        this.hasSlot = false;
        this.Xi = createLookup();
        const a = r !== null;
        this.c = i;
        this.root = l === null ? this : l;
        this.def = e;
        this.ci = n;
        this.parent = r;
        this.Ti = a ? r.Ti : i.get(Gs);
        this.Fe = a ? r.Fe : i.get(us);
        this.ep = a ? r.ep : i.get(s.IExpressionParser);
        this.m = a ? r.m : i.get(Cs);
        this.Ws = a ? r.Ws : i.get(t.ILogger);
        this.p = a ? r.p : i.get(st);
        this.localEls = a ? r.localEls : new Set;
        this.rows = h ?? [];
    }
    Ki(t) {
        (this.root.deps ??= []).push(t);
        this.root.c.register(t);
        return t;
    }
    Gi(t) {
        return createText(this.p, t);
    }
    ji(t) {
        return createComment(this.p, t);
    }
    ct() {
        return this.ji("au*");
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
    Mi(t) {
        return rs.find(this.c, t);
    }
    Di(t) {
        return lt.find(this.c, t);
    }
    Ui(t) {
        return new CompilationContext(this.def, this.c, this.ci, this, this.root, t);
    }
    qi(t) {
        if (this.root !== this) {
            return this.root.qi(t);
        }
        const e = t.command;
        if (e === null) {
            return null;
        }
        let s = this.Xi[e];
        let i;
        if (s === void 0) {
            i = bs.find(this.c, e);
            if (i == null) {
                throw createMappedError(713, e);
            }
            this.Xi[e] = s = bs.get(this.c, e);
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
    ti.node = ti.attr = ti.bindable = ti.def = null;
};

const Zs = {
    projections: null
};

const Js = {
    name: "unnamed"
};

const ti = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const ei = u(createLookup(), {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
});

const si = {
    checkbox: 1,
    radio: 1
};

const ii = new WeakMap;

class BindablesInfo {
    static from(t, e) {
        let s = ii.get(t);
        if (s == null) {
            const i = t.bindables;
            const n = createLookup();
            const r = e ? t.defaultBindingMode === void 0 ? T : t.defaultBindingMode : T;
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
            ii.set(t, s = new BindablesInfo(n, i, c));
        }
        return s;
    }
    constructor(t, e, s) {
        this.attrs = t;
        this.bindables = e;
        this.primary = s;
    }
}

const ni = c([ "name", "attribute", "mode" ]);

const ri = "as-custom-element";

const processTemplateName = (t, e, s) => {
    const i = e.getAttribute(ri);
    if (i === null || i === "") {
        throw createMappedError(715, t);
    }
    if (s.has(i)) {
        throw createMappedError(716, i, t);
    } else {
        s.add(i);
        e.removeAttribute(ri);
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
        return I;

      case "default":
      default:
        return T;
    }
};

const oi = /*@__PURE__*/ N("ITemplateCompilerHooks");

const li = c({
    name: /*@__PURE__*/ t.getResourceKeyFor("compiler-hooks"),
    define(e) {
        return t.Registrable.define(e, (function(t) {
            W(oi, this).register(t);
        }));
    },
    findAll(e) {
        return e.get(t.allResources(oi));
    }
});

const templateCompilerHooks = t => {
    return t === void 0 ? decorator : decorator(t);
    function decorator(t) {
        return li.define(t);
    }
};

class Show {
    constructor() {
        this.el = t.resolve(Ue);
        this.p = t.resolve(st);
        this.Qi = false;
        this.I = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.I = null;
            if (Boolean(this.value) !== this.Yi) {
                if (this.Yi === this.Zi) {
                    this.Yi = !this.Zi;
                    this.$val = this.el.style.getPropertyValue("display");
                    this.$prio = this.el.style.getPropertyPriority("display");
                    this.el.style.setProperty("display", "none", "important");
                } else {
                    this.Yi = this.Zi;
                    this.el.style.setProperty("display", this.$val, this.$prio);
                    if (this.el.getAttribute("style") === "") {
                        this.el.removeAttribute("style");
                    }
                }
            }
        };
        const e = t.resolve(te);
        this.Yi = this.Zi = e.alias !== "hide";
    }
    binding() {
        this.Qi = true;
        this.update();
    }
    detaching() {
        this.Qi = false;
        this.I?.cancel();
        this.I = null;
    }
    valueChanged() {
        if (this.Qi && this.I === null) {
            this.I = this.p.domWriteQueue.queueTask(this.update);
        }
    }
}

__decorate([ bindable ], Show.prototype, "value", void 0);

alias("hide")(Show);

customAttribute("show")(Show);

const hi = [ TemplateCompiler, s.DirtyChecker, NodeObserverLocator ];

const ai = [ exports.RefAttributePattern, exports.DotSeparatedAttributePattern, ms, ps, At ];

const ci = [ exports.AtPrefixedTriggerAttributePattern, exports.ColonPrefixedBindAttributePattern ];

const ui = [ exports.DefaultBindingCommand, exports.OneTimeBindingCommand, exports.FromViewBindingCommand, exports.ToViewBindingCommand, exports.TwoWayBindingCommand, exports.ForBindingCommand, ws, exports.TriggerBindingCommand, exports.CaptureBindingCommand, exports.ClassBindingCommand, exports.StyleBindingCommand, exports.AttrBindingCommand, ys ];

const fi = [ DebounceBindingBehavior, OneTimeBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, SignalBindingBehavior, ThrottleBindingBehavior, TwoWayBindingBehavior, SanitizeValueConverter, If, Else, Repeat, With, exports.Switch, exports.Case, exports.DefaultCase, exports.PromiseTemplateController, exports.PendingTemplateController, exports.FulfilledTemplateController, exports.RejectedTemplateController, Ns, Ws, js, AttrBindingBehavior, SelfBindingBehavior, UpdateTriggerBindingBehavior, AuCompose, Portal, Focus, Show, exports.AuSlot ];

const di = [ exports.PropertyBindingRenderer, exports.IteratorBindingRenderer, exports.RefBindingRenderer, exports.InterpolationBindingRenderer, exports.SetPropertyRenderer, exports.CustomElementRenderer, exports.CustomAttributeRenderer, exports.TemplateControllerRenderer, exports.LetElementRenderer, exports.ListenerBindingRenderer, exports.AttributeBindingRenderer, exports.SetAttributeRenderer, exports.SetClassAttributeRenderer, exports.SetStyleAttributeRenderer, exports.StylePropertyBindingRenderer, exports.TextBindingRenderer, exports.SpreadRenderer ];

const pi = /*@__PURE__*/ createConfiguration(t.noop);

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
            return e.register(z(s.ICoercionConfiguration, i.coercingOptions), ...hi, ...fi, ...ai, ...ui, ...di);
        },
        customize(e) {
            return createConfiguration(e ?? t);
        }
    };
}

function children(t, e) {
    if (!xi) {
        xi = true;
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
        let l = rs.getAnnotation(r, n);
        if (l == null) {
            rs.annotate(r, n, l = []);
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
    constructor(t, e, s, i = defaultChildQuery, n = defaultChildFilter, r = defaultChildMap, l = mi) {
        this.Ji = void 0;
        this.X = defaultChildQuery;
        this.tn = defaultChildFilter;
        this.en = defaultChildMap;
        this.isBound = false;
        this.T = t;
        this.obj = e;
        this.cb = s;
        this.X = i;
        this.tn = n;
        this.en = r;
        this.V = l;
        this.As = createMutationObserver(this.xi = t.host, (() => {
            this.sn();
        }));
    }
    getValue() {
        return this.isBound ? this.Ji : this.nn();
    }
    setValue(t) {}
    bind() {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        this.As.observe(this.xi, this.V);
        this.Ji = this.nn();
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.As.disconnect();
        this.Ji = t.emptyArray;
    }
    sn() {
        this.Ji = this.nn();
        this.cb?.call(this.obj);
        this.subs.notify(this.Ji, undefined);
    }
    get() {
        throw createMappedError(99, "get");
    }
    nn() {
        return filterChildren(this.T, this.X, this.tn, this.en);
    }
}

const mi = {
    childList: true
};

const defaultChildQuery = t => t.host.childNodes;

const defaultChildFilter = (t, e, s) => !!s;

const defaultChildMap = (t, e, s) => s;

const gi = {
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
        a = findElementControllerFor(h, gi);
        c = a?.viewModel ?? null;
        if (s(h, a, c)) {
            l.push(i(h, a, c));
        }
    }
    return l;
};

class ChildrenLifecycleHooks {
    constructor(t) {
        this.Y = t;
    }
    register(t) {
        z(ht, this).register(t);
    }
    hydrating(t, e) {
        const s = this.Y;
        const i = new ChildrenBinding(e, t, t[s.callback ?? `${l(s.name)}Changed`], s.query ?? defaultChildQuery, s.filter ?? defaultChildFilter, s.map ?? defaultChildMap, s.options ?? mi);
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

let xi = false;

exports.AdoptedStyleSheetsStyles = AdoptedStyleSheetsStyles;

exports.AppRoot = AppRoot;

exports.AppTask = et;

exports.AttrBindingBehavior = AttrBindingBehavior;

exports.AttrSyntax = AttrSyntax;

exports.AttributeBinding = AttributeBinding;

exports.AttributeBindingInstruction = AttributeBindingInstruction;

exports.AttributeNSAccessor = AttributeNSAccessor;

exports.AttributePattern = ds;

exports.AuCompose = AuCompose;

exports.AuSlotsInfo = AuSlotsInfo;

exports.Aurelia = Aurelia;

exports.Bindable = V;

exports.BindableDefinition = BindableDefinition;

exports.BindablesInfo = BindablesInfo;

exports.BindingBehavior = K;

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

exports.CustomAttribute = lt;

exports.CustomAttributeDefinition = CustomAttributeDefinition;

exports.CustomElement = rs;

exports.CustomElementDefinition = CustomElementDefinition;

exports.DataAttributeAccessor = DataAttributeAccessor;

exports.DebounceBindingBehavior = DebounceBindingBehavior;

exports.DefaultBindingLanguage = ui;

exports.DefaultBindingSyntax = ai;

exports.DefaultComponents = hi;

exports.DefaultRenderers = di;

exports.DefaultResources = fi;

exports.Else = Else;

exports.EventModifier = EventModifier;

exports.EventModifierRegistration = At;

exports.ExpressionWatcher = ExpressionWatcher;

exports.FlushQueue = FlushQueue;

exports.Focus = Focus;

exports.FragmentNodeSequence = FragmentNodeSequence;

exports.FromViewBindingBehavior = FromViewBindingBehavior;

exports.HydrateAttributeInstruction = HydrateAttributeInstruction;

exports.HydrateElementInstruction = HydrateElementInstruction;

exports.HydrateLetElementInstruction = HydrateLetElementInstruction;

exports.HydrateTemplateController = HydrateTemplateController;

exports.IAppRoot = ls;

exports.IAppTask = tt;

exports.IAttrMapper = Cs;

exports.IAttributeParser = us;

exports.IAttributePattern = cs;

exports.IAuSlotWatcher = Et;

exports.IAuSlotsInfo = Tt;

exports.IAurelia = hs;

exports.IController = $e;

exports.IEventModifier = Ct;

exports.IEventTarget = Ge;

exports.IFlushQueue = pt;

exports.IHistory = Je;

exports.IHydrationContext = Ne;

exports.IInstruction = te;

exports.IKeyMapping = kt;

exports.ILifecycleHooks = ht;

exports.IListenerBindingOptions = ie;

exports.ILocation = Ze;

exports.IModifiedEventHandlerCreator = yt;

exports.INode = Ue;

exports.IPlatform = st;

exports.IRenderLocation = Ke;

exports.IRenderer = se;

exports.IRendering = ue;

exports.ISVGAnalyzer = ks;

exports.ISanitizer = Us;

exports.IShadowDOMGlobalStyles = pe;

exports.IShadowDOMStyles = de;

exports.ISyntaxInterpreter = as;

exports.ITemplateCompiler = ee;

exports.ITemplateCompilerHooks = oi;

exports.ITemplateElementFactory = Gs;

exports.IViewFactory = Bt;

exports.IWindow = Ye;

exports.If = If;

exports.InstructionType = Jt;

exports.InterpolationBinding = InterpolationBinding;

exports.InterpolationInstruction = InterpolationInstruction;

exports.InterpolationPartBinding = InterpolationPartBinding;

exports.Interpretation = Interpretation;

exports.IteratorBindingInstruction = IteratorBindingInstruction;

exports.LetBinding = LetBinding;

exports.LetBindingInstruction = LetBindingInstruction;

exports.LifecycleHooks = at;

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

exports.ShortHandBindingSyntax = ci;

exports.SignalBindingBehavior = SignalBindingBehavior;

exports.SpreadBindingInstruction = SpreadBindingInstruction;

exports.SpreadElementPropBindingInstruction = SpreadElementPropBindingInstruction;

exports.StandardConfiguration = pi;

exports.State = Ve;

exports.StyleAttributeAccessor = StyleAttributeAccessor;

exports.StyleConfiguration = me;

exports.StyleElementStyles = StyleElementStyles;

exports.StylePropertyBindingInstruction = StylePropertyBindingInstruction;

exports.TemplateCompiler = TemplateCompiler;

exports.TemplateCompilerHooks = li;

exports.TextBindingInstruction = TextBindingInstruction;

exports.ThrottleBindingBehavior = ThrottleBindingBehavior;

exports.ToViewBindingBehavior = ToViewBindingBehavior;

exports.TwoWayBindingBehavior = TwoWayBindingBehavior;

exports.UpdateTriggerBindingBehavior = UpdateTriggerBindingBehavior;

exports.ValueAttributeObserver = ValueAttributeObserver;

exports.ValueConverter = ut;

exports.ValueConverterDefinition = ValueConverterDefinition;

exports.ViewFactory = ViewFactory;

exports.Watch = it;

exports.With = With;

exports.alias = alias;

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
