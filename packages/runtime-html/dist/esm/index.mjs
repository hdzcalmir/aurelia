import { Protocol as t, getPrototypeChain as e, firstDefined as i, kebabCase as s, noop as n, DI as r, Registration as l, mergeArrays as h, IPlatform as a, emptyArray as c, fromDefinitionOrDefault as u, pascalCase as f, fromAnnotationOrTypeOrDefault as d, fromAnnotationOrDefinitionOrTypeOrDefault as m, IContainer as g, InstanceProvider as p, optional as v, resolveAll as b, onResolve as x, all as w, camelCase as y, emptyObject as k, IServiceLocator as A, ILogger as C, transient as R, toArray as B } from "@aurelia/kernel";

import { Metadata as S, isObject as _ } from "@aurelia/metadata";

import { subscriberCollection as I, ISignaler as T, astEvaluate as E, connectable as P, ConnectableSwitcher as L, ProxyObservable as M, astBind as D, astUnbind as $, astAssign as U, IExpressionParser as q, IObserverLocator as F, Scope as O, ICoercionConfiguration as H, AccessScopeExpression as V, PropertyAccessor as N, INodeObserverLocator as j, getObserverLookup as W, SetterObserver as z, IDirtyChecker as G, createIndexMap as X, applyMutationsToIndices as K, getCollectionObserver as Q, synchronizeIndices as Y, BindingContext as Z, PrimitiveLiteralExpression as J } from "@aurelia/runtime";

import { BrowserPlatform as tt } from "@aurelia/platform-browser";

import { TaskAbortError as et } from "@aurelia/platform";

function __decorate(t, e, i, s) {
    var n = arguments.length, r = n < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, i) : s, l;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(t, e, i, s); else for (var h = t.length - 1; h >= 0; h--) if (l = t[h]) r = (n < 3 ? l(r) : n > 3 ? l(e, i, r) : l(e, i)) || r;
    return n > 3 && r && Object.defineProperty(e, i, r), r;
}

function __param(t, e) {
    return function(i, s) {
        e(i, s, t);
    };
}

const it = S.getOwn;

const st = S.hasOwn;

const nt = S.define;

const {annotation: rt, resource: ot} = t;

const lt = rt.keyFor;

const ht = ot.keyFor;

const at = ot.appendTo;

const ct = rt.appendTo;

const ut = rt.getKeys;

const ft = Object;

const dt = String;

const mt = ft.prototype;

const createLookup = () => ft.create(null);

const createError = t => new Error(t);

const gt = mt.hasOwnProperty;

const pt = ft.freeze;

const vt = ft.assign;

const bt = ft.getOwnPropertyNames;

const xt = ft.keys;

const wt = createLookup();

const isDataAttribute = (t, e, i) => {
    if (wt[e] === true) {
        return true;
    }
    if (!isString(e)) {
        return false;
    }
    const s = e.slice(0, 5);
    return wt[e] = s === "aria-" || s === "data-" || i.isStandardSvgAttribute(t, e);
};

const isPromise = t => t instanceof Promise;

const isArray = t => t instanceof Array;

const isFunction = t => typeof t === "function";

const isString = t => typeof t === "string";

const yt = ft.defineProperty;

const rethrow = t => {
    throw t;
};

const kt = ft.is;

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
        nt(Ct, BindableDefinition.create(e, t, i), t.constructor, e);
        ct(t.constructor, Rt.keyFrom(e));
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
    return t.startsWith(Ct);
}

const Ct = lt("bindable");

const Rt = pt({
    name: Ct,
    keyFrom: t => `${Ct}:${t}`,
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
                xt(t).forEach((e => addDescription(e, t[e])));
            }
        }
        e.forEach(addList);
        return i;
    },
    for(t) {
        let e;
        const i = {
            add(s) {
                let n;
                let r;
                if (isString(s)) {
                    n = s;
                    r = {
                        property: n
                    };
                } else {
                    n = s.property;
                    r = s;
                }
                e = BindableDefinition.create(n, t, r);
                if (!st(Ct, t, n)) {
                    ct(t, Rt.keyFrom(n));
                }
                nt(Ct, e, t, n);
                return i;
            },
            mode(t) {
                e.mode = t;
                return i;
            },
            callback(t) {
                e.callback = t;
                return i;
            },
            attribute(t) {
                e.attribute = t;
                return i;
            },
            primary() {
                e.primary = true;
                return i;
            },
            set(t) {
                e.set = t;
                return i;
            }
        };
        return i;
    },
    getAll(t) {
        const i = Ct.length + 1;
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
            h = ut(c).filter(isBindableAnnotation);
            a = h.length;
            for (u = 0; u < a; ++u) {
                s[l++] = it(Ct, c, h[u].slice(i));
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
    static create(t, e, n = {}) {
        return new BindableDefinition(i(n.attribute, s(t)), i(n.callback, `${t}Changed`), i(n.mode, 2), i(n.primary, false), i(n.property, t), i(n.set, getInterceptor(t, e, n)));
    }
}

function coercer(t, e, i) {
    Bt.define(t, e);
}

const Bt = {
    key: lt("coercer"),
    define(t, e) {
        nt(Bt.key, t[e].bind(t), t);
    },
    for(t) {
        return it(Bt.key, t);
    }
};

function getInterceptor(t, e, i = {}) {
    const s = i.type ?? S.get("design:type", e, t) ?? null;
    if (s == null) {
        return n;
    }
    let r;
    switch (s) {
      case Number:
      case Boolean:
      case String:
      case BigInt:
        r = s;
        break;

      default:
        {
            const t = s.coerce;
            r = typeof t === "function" ? t.bind(s) : Bt.for(s) ?? n;
            break;
        }
    }
    return r === n ? r : createCoercer(r, i.nullable);
}

function createCoercer(t, e) {
    return function(i, s) {
        if (!s?.enableCoercion) return i;
        return (e ?? (s?.coerceNullish ?? false ? false : true)) && i == null ? i : t(i, s);
    };
}

class BindableObserver {
    get type() {
        return 1;
    }
    constructor(t, e, i, s, r, l) {
        this.set = s;
        this.$controller = r;
        this.i = l;
        this.v = void 0;
        this.ov = void 0;
        const h = t[i];
        const a = t.propertyChanged;
        const c = this.u = isFunction(h);
        const u = this.A = isFunction(a);
        const f = this.hs = s !== n;
        let d;
        this.o = t;
        this.k = e;
        this.C = u ? a : n;
        this.cb = c ? h : n;
        if (this.cb === void 0 && !u && !f) {
            this.iO = false;
        } else {
            this.iO = true;
            d = t[e];
            this.v = f && d !== void 0 ? s(d, this.i) : d;
            this.R();
        }
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (this.hs) {
            t = this.set(t, this.i);
        }
        const e = this.v;
        if (this.iO) {
            if (kt(t, e)) {
                return;
            }
            this.v = t;
            this.ov = e;
            if (this.$controller == null || this.$controller.isBound) {
                if (this.u) {
                    this.cb.call(this.o, t, e);
                }
                if (this.A) {
                    this.C.call(this.o, this.k, t, e);
                }
            }
            this.subs.notify(this.v, this.ov);
        } else {
            this.o[this.k] = t;
        }
    }
    subscribe(t) {
        if (!this.iO === false) {
            this.iO = true;
            this.v = this.hs ? this.set(this.o[this.k], this.i) : this.o[this.k];
            this.R();
        }
        this.subs.add(t);
    }
    R() {
        Reflect.defineProperty(this.o, this.k, {
            enumerable: true,
            configurable: true,
            get: () => this.v,
            set: t => {
                this.setValue(t);
            }
        });
    }
}

I(BindableObserver);

const resource = function(t) {
    function Resolver(t, e, i) {
        r.inject(Resolver)(t, e, i);
    }
    Resolver.$isResolver = true;
    Resolver.resolve = function(e, i) {
        if (i.root === i) {
            return i.get(t);
        }
        return i.has(t, false) ? i.get(t) : i.root.get(t);
    };
    return Resolver;
};

const allResources = t => {
    function Resolver(t, e, i) {
        r.inject(Resolver)(t, e, i);
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

const St = r.createInterface;

const _t = l.singleton;

const It = l.aliasTo;

const Tt = l.instance;

l.callback;

const Et = l.transient;

const registerResolver = (t, e, i) => t.registerResolver(e, i);

function alias(...t) {
    return function(e) {
        const i = lt("aliases");
        const s = it(i, e);
        if (s === void 0) {
            nt(i, t, e);
        } else {
            s.push(...t);
        }
    };
}

function registerAliases(t, e, i, s) {
    for (let n = 0, r = t.length; n < r; ++n) {
        l.aliasTo(i, e.keyFrom(t[n])).register(s);
    }
}

function bindingBehavior(t) {
    return function(e) {
        return Lt.define(t, e);
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
        let s;
        let n;
        if (isString(t)) {
            s = t;
            n = {
                name: s
            };
        } else {
            s = t.name;
            n = t;
        }
        return new BindingBehaviorDefinition(e, i(getBehaviorAnnotation(e, "name"), s), h(getBehaviorAnnotation(e, "aliases"), n.aliases, e.aliases), Lt.keyFrom(s));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        _t(i, e).register(t);
        It(i, e).register(t);
        registerAliases(s, Lt, i, t);
    }
}

const Pt = ht("binding-behavior");

const getBehaviorAnnotation = (t, e) => it(lt(e), t);

const Lt = pt({
    name: Pt,
    keyFrom(t) {
        return `${Pt}:${t}`;
    },
    isType(t) {
        return isFunction(t) && st(Pt, t);
    },
    define(t, e) {
        const i = BindingBehaviorDefinition.create(t, e);
        nt(Pt, i, i.Type);
        nt(Pt, i, i);
        at(e, Pt);
        return i.Type;
    },
    getDefinition(t) {
        const e = it(Pt, t);
        if (e === void 0) {
            throw createError(`AUR0151:${t.name}`);
        }
        return e;
    },
    annotate(t, e, i) {
        nt(lt(e), i, t);
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

const Dt = new WeakMap;

const $t = 200;

class DebounceBindingBehavior {
    constructor(t) {
        this.p = t;
    }
    bind(t, e, i, s) {
        const n = {
            type: "debounce",
            delay: i ?? $t,
            now: this.p.performanceNow,
            queue: this.p.taskQueue,
            signals: isString(s) ? [ s ] : s ?? c
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

DebounceBindingBehavior.inject = [ a ];

bindingBehavior("debounce")(DebounceBindingBehavior);

class SignalBindingBehavior {
    constructor(t) {
        this.B = new Map;
        this._ = t;
    }
    bind(t, e, ...i) {
        if (!("handleChange" in e)) {
            throw createError(`AUR0817`);
        }
        if (i.length === 0) {
            throw createError(`AUR0818`);
        }
        this.B.set(e, i);
        let s;
        for (s of i) {
            addSignalListener(this._, s, e);
        }
    }
    unbind(t, e) {
        const i = this.B.get(e);
        this.B.delete(e);
        let s;
        for (s of i) {
            removeSignalListener(this._, s, e);
        }
    }
}

SignalBindingBehavior.inject = [ T ];

bindingBehavior("signal")(SignalBindingBehavior);

const Ut = new WeakMap;

const qt = 200;

class ThrottleBindingBehavior {
    constructor(t) {
        this.I = t.performanceNow;
        this.T = t.taskQueue;
    }
    bind(t, e, i, s) {
        const n = {
            type: "throttle",
            delay: i ?? qt,
            now: this.I,
            queue: this.T,
            signals: isString(s) ? [ s ] : s ?? c
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

ThrottleBindingBehavior.inject = [ a ];

bindingBehavior("throttle")(ThrottleBindingBehavior);

const Ft = a;

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
        let s;
        let n;
        if (isString(t)) {
            s = t;
            n = {
                name: s
            };
        } else {
            s = t.name;
            n = t;
        }
        return new CustomAttributeDefinition(e, i(getAttributeAnnotation(e, "name"), s), h(getAttributeAnnotation(e, "aliases"), n.aliases, e.aliases), getAttributeKeyFrom(s), i(getAttributeAnnotation(e, "defaultBindingMode"), n.defaultBindingMode, e.defaultBindingMode, 2), i(getAttributeAnnotation(e, "isTemplateController"), n.isTemplateController, e.isTemplateController, false), Rt.from(e, ...Rt.getAll(e), getAttributeAnnotation(e, "bindables"), e.bindables, n.bindables), i(getAttributeAnnotation(e, "noMultiBindings"), n.noMultiBindings, e.noMultiBindings, false), h(jt.getAnnotation(e), e.watches), h(getAttributeAnnotation(e, "dependencies"), n.dependencies, e.dependencies));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        Et(i, e).register(t);
        It(i, e).register(t);
        registerAliases(s, Ht, i, t);
    }
}

const Ot = ht("custom-attribute");

const getAttributeKeyFrom = t => `${Ot}:${t}`;

const getAttributeAnnotation = (t, e) => it(lt(e), t);

const isAttributeType = t => isFunction(t) && st(Ot, t);

const findAttributeControllerFor = (t, e) => getRef(t, getAttributeKeyFrom(e)) ?? void 0;

const defineAttribute = (t, e) => {
    const i = CustomAttributeDefinition.create(t, e);
    nt(Ot, i, i.Type);
    nt(Ot, i, i);
    at(e, Ot);
    return i.Type;
};

const getAttributeDefinition = t => {
    const e = it(Ot, t);
    if (e === void 0) {
        throw createError(`AUR0759:${t.name}`);
    }
    return e;
};

const Ht = pt({
    name: Ot,
    keyFrom: getAttributeKeyFrom,
    isType: isAttributeType,
    for: findAttributeControllerFor,
    define: defineAttribute,
    getDefinition: getAttributeDefinition,
    annotate(t, e, i) {
        nt(lt(e), i, t);
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
                throw createError(`AUR0773:${dt(e)}@${l.name}}`);
            }
        } else if (!isFunction(n?.value)) {
            throw createError(`AUR0774:${dt(s)}`);
        }
        jt.add(l, h);
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

const Vt = c;

const Nt = lt("watch");

const jt = pt({
    name: Nt,
    add(t, e) {
        let i = it(Nt, t);
        if (i == null) {
            nt(Nt, i = [], t);
        }
        i.push(e);
    },
    getAnnotation(t) {
        return it(Nt, t) ?? Vt;
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
    const e = it(Gt, t);
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

const Wt = new WeakMap;

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
            const s = u("name", i, Xt);
            if (isFunction(i.Type)) {
                e = i.Type;
            } else {
                e = Kt(f(s));
            }
            return new CustomElementDefinition(e, s, h(i.aliases), u("key", i, (() => getElementKeyFrom(s))), u("cache", i, returnZero), u("capture", i, returnFalse), u("template", i, returnNull), h(i.instructions), h(i.dependencies), u("injectable", i, returnNull), u("needsCompile", i, returnTrue), h(i.surrogates), Rt.from(e, i.bindables), u("containerless", i, returnFalse), u("isStrictBinding", i, returnFalse), u("shadowOptions", i, returnNull), u("hasSlots", i, returnFalse), u("enhance", i, returnFalse), u("watches", i, returnEmptyArray), d("processContent", e, returnNull));
        }
        if (isString(t)) {
            return new CustomElementDefinition(e, t, h(getElementAnnotation(e, "aliases"), e.aliases), getElementKeyFrom(t), d("cache", e, returnZero), d("capture", e, returnFalse), d("template", e, returnNull), h(getElementAnnotation(e, "instructions"), e.instructions), h(getElementAnnotation(e, "dependencies"), e.dependencies), d("injectable", e, returnNull), d("needsCompile", e, returnTrue), h(getElementAnnotation(e, "surrogates"), e.surrogates), Rt.from(e, ...Rt.getAll(e), getElementAnnotation(e, "bindables"), e.bindables), d("containerless", e, returnFalse), d("isStrictBinding", e, returnFalse), d("shadowOptions", e, returnNull), d("hasSlots", e, returnFalse), d("enhance", e, returnFalse), h(jt.getAnnotation(e), e.watches), d("processContent", e, returnNull));
        }
        const i = u("name", t, Xt);
        return new CustomElementDefinition(e, i, h(getElementAnnotation(e, "aliases"), t.aliases, e.aliases), getElementKeyFrom(i), m("cache", t, e, returnZero), m("capture", t, e, returnFalse), m("template", t, e, returnNull), h(getElementAnnotation(e, "instructions"), t.instructions, e.instructions), h(getElementAnnotation(e, "dependencies"), t.dependencies, e.dependencies), m("injectable", t, e, returnNull), m("needsCompile", t, e, returnTrue), h(getElementAnnotation(e, "surrogates"), t.surrogates, e.surrogates), Rt.from(e, ...Rt.getAll(e), getElementAnnotation(e, "bindables"), e.bindables, t.bindables), m("containerless", t, e, returnFalse), m("isStrictBinding", t, e, returnFalse), m("shadowOptions", t, e, returnNull), m("hasSlots", t, e, returnFalse), m("enhance", t, e, returnFalse), h(t.watches, jt.getAnnotation(e), e.watches), m("processContent", t, e, returnNull));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) {
            return t;
        }
        if (Wt.has(t)) {
            return Wt.get(t);
        }
        const e = CustomElementDefinition.create(t);
        Wt.set(t, e);
        nt(Gt, e, e.Type);
        return e;
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        if (!t.has(i, false)) {
            Et(i, e).register(t);
            It(i, e).register(t);
            registerAliases(s, Qt, i, t);
        }
    }
}

const zt = {
    name: undefined,
    searchParents: false,
    optional: false
};

const returnZero = () => 0;

const returnNull = () => null;

const returnFalse = () => false;

const returnTrue = () => true;

const returnEmptyArray = () => c;

const Gt = ht("custom-element");

const getElementKeyFrom = t => `${Gt}:${t}`;

const Xt = (() => {
    let t = 0;
    return () => `unnamed-${++t}`;
})();

const annotateElementMetadata = (t, e, i) => {
    nt(lt(e), i, t);
};

const defineElement = (t, e) => {
    const i = CustomElementDefinition.create(t, e);
    nt(Gt, i, i.Type);
    nt(Gt, i, i);
    at(i.Type, Gt);
    return i.Type;
};

const isElementType = t => isFunction(t) && st(Gt, t);

const findElementControllerFor = (t, e = zt) => {
    if (e.name === void 0 && e.searchParents !== true) {
        const i = getRef(t, Gt);
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
            const i = getRef(t, Gt);
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
            const t = getRef(i, Gt);
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
        const t = getRef(i, Gt);
        if (t !== null) {
            return t;
        }
        i = getEffectiveParentNode(i);
    }
    throw createError(`AUR0765`);
};

const getElementAnnotation = (t, e) => it(lt(e), t);

const getElementDefinition = t => {
    const e = it(Gt, t);
    if (e === void 0) {
        throw createError(`AUR0760:${t.name}`);
    }
    return e;
};

const createElementInjectable = () => {
    const $injectable = function(t, e, i) {
        const s = r.getOrCreateAnnotationParamTypes(t);
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

const Kt = function() {
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
        Reflect.defineProperty(n, "name", t);
        if (s !== e) {
            vt(n.prototype, s);
        }
        return n;
    };
}();

const Qt = pt({
    name: Gt,
    keyFrom: getElementKeyFrom,
    isType: isElementType,
    for: findElementControllerFor,
    define: defineElement,
    getDefinition: getElementDefinition,
    annotate: annotateElementMetadata,
    getAnnotation: getElementAnnotation,
    generateName: Xt,
    createInjectable: createElementInjectable,
    generateType: Kt
});

const Yt = lt("processContent");

function processContent(t) {
    return t === void 0 ? function(t, e, i) {
        nt(Yt, ensureHook(t, e), t);
    } : function(e) {
        t = ensureHook(e, t);
        const i = it(Gt, e);
        if (i !== void 0) {
            i.processContent = t;
        } else {
            nt(Yt, t, e);
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

const Zt = "au-start";

const Jt = "au-end";

const createElement = (t, e) => t.document.createElement(e);

const createComment = (t, e) => t.document.createComment(e);

const createLocation = t => {
    const e = createComment(t, Jt);
    e.$start = createComment(t, Zt);
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

const getPreviousSibling = t => t.previousSibling;

const appendToTemplate = (t, e) => t.content.appendChild(e);

const appendManyToTemplate = (t, e) => {
    const i = e.length;
    let s = 0;
    while (i > s) {
        t.content.appendChild(e[s]);
        ++s;
    }
};

const markerToLocation = t => {
    const e = t.previousSibling;
    let i;
    if (e?.nodeType === 8 && e.textContent === "au-end") {
        i = e;
        if ((i.$start = i.previousSibling) == null) {
            throw markerMalformedError();
        }
        t.parentNode?.removeChild(t);
        return i;
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

function setRef(t, e, i) {
    var s;
    ((s = t).$au ?? (s.$au = new Refs))[e] = i;
}

const te = /*@__PURE__*/ St("INode");

const ee = /*@__PURE__*/ St("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(Ai, true)) {
        return t.get(Ai).host;
    }
    return t.get(Ft).document;
}))));

const ie = /*@__PURE__*/ St("IRenderLocation");

const se = /*@__PURE__*/ St("CssModules");

const ne = new WeakMap;

function getEffectiveParentNode(t) {
    if (ne.has(t)) {
        return ne.get(t);
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
            ne.set(i[t], e);
        }
    } else {
        ne.set(t, e);
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
        return this.P;
    }
    get lastChild() {
        return this.L;
    }
    constructor(t, e) {
        this.platform = t;
        this.next = void 0;
        this.M = false;
        this.$ = false;
        this.ref = null;
        this.f = e;
        const i = e.querySelectorAll(".au");
        let s = 0;
        let n = i.length;
        let r;
        let l = this.t = Array(n);
        while (n > s) {
            r = i[s];
            if (r.nodeName === "AU-M") {
                l[s] = markerToLocation(r);
            } else {
                l[s] = r;
            }
            ++s;
        }
        const h = e.childNodes;
        const a = this.childNodes = Array(n = h.length);
        s = 0;
        while (n > s) {
            a[s] = h[s];
            ++s;
        }
        this.P = e.firstChild;
        this.L = e.lastChild;
    }
    findTargets() {
        return this.t;
    }
    insertBefore(t) {
        if (this.$ && !!this.ref) {
            this.addToLinked();
        } else {
            const e = t.parentNode;
            if (this.M) {
                let i = this.P;
                let s;
                const n = this.L;
                while (i != null) {
                    s = i.nextSibling;
                    e.insertBefore(i, t);
                    if (i === n) {
                        break;
                    }
                    i = s;
                }
            } else {
                this.M = true;
                t.parentNode.insertBefore(this.f, t);
            }
        }
    }
    appendTo(t, e = false) {
        if (this.M) {
            let e = this.P;
            let i;
            const s = this.L;
            while (e != null) {
                i = e.nextSibling;
                t.appendChild(e);
                if (e === s) {
                    break;
                }
                e = i;
            }
        } else {
            this.M = true;
            if (!e) {
                t.appendChild(this.f);
            }
        }
    }
    remove() {
        if (this.M) {
            this.M = false;
            const t = this.f;
            const e = this.L;
            let i;
            let s = this.P;
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
        if (this.M) {
            let i = this.P;
            let s;
            const n = this.L;
            while (i != null) {
                s = i.nextSibling;
                e.insertBefore(i, t);
                if (i === n) {
                    break;
                }
                i = s;
            }
        } else {
            this.M = true;
            e.insertBefore(this.f, t);
        }
    }
    unlink() {
        this.$ = false;
        this.next = void 0;
        this.ref = void 0;
    }
    link(t) {
        this.$ = true;
        if (isRenderLocation(t)) {
            this.ref = t;
        } else {
            this.next = t;
            this.U();
        }
    }
    U() {
        if (this.next !== void 0) {
            this.ref = this.next.firstChild;
        } else {
            this.ref = void 0;
        }
    }
}

const re = /*@__PURE__*/ St("IWindow", (t => t.callback((t => t.get(Ft).window))));

const oe = /*@__PURE__*/ St("ILocation", (t => t.callback((t => t.get(re).location))));

const le = /*@__PURE__*/ St("IHistory", (t => t.callback((t => t.get(re).history))));

const he = /*@__PURE__*/ St("IAppTask");

class $AppTask {
    constructor(t, e, i) {
        this.c = void 0;
        this.slot = t;
        this.k = e;
        this.cb = i;
    }
    register(t) {
        return this.c = t.register(Tt(he, this));
    }
    run() {
        const t = this.k;
        const e = this.cb;
        return t === null ? e() : e(this.c.get(t));
    }
}

const ae = pt({
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
                addListener(this.q, e, this);
            }
            this.F = true;
            this.O?.();
        }
    }));
    defineHiddenProp(i, "unsubscribe", (function(t) {
        if (this.subs.remove(t) && this.subs.count === 0) {
            for (e of this.cf.events) {
                removeListener(this.q, e, this);
            }
            this.F = false;
            this.H?.();
        }
    }));
    defineHiddenProp(i, "useConfig", (function(t) {
        this.cf = t;
        if (this.F) {
            for (e of this.cf.events) {
                removeListener(this.q, e, this);
            }
            for (e of this.cf.events) {
                addListener(this.q, e, this);
            }
        }
    }));
};

const mixinNoopSubscribable = t => {
    defineHiddenProp(t.prototype, "subscribe", n);
    defineHiddenProp(t.prototype, "unsubscribe", n);
};

class ClassAttributeAccessor {
    get doNotCache() {
        return true;
    }
    constructor(t) {
        this.obj = t;
        this.type = 2 | 4;
        this.value = "";
        this.ov = "";
        this.V = {};
        this.N = 0;
        this.j = false;
    }
    getValue() {
        return this.value;
    }
    setValue(t) {
        this.value = t;
        this.j = t !== this.ov;
        this.W();
    }
    W() {
        if (this.j) {
            this.j = false;
            const t = this.value;
            const e = this.V;
            const i = getClassesToAdd(t);
            let s = this.N;
            this.ov = t;
            if (i.length > 0) {
                this.G(i);
            }
            this.N += 1;
            if (s === 0) {
                return;
            }
            s -= 1;
            for (const t in e) {
                if (!gt.call(e, t) || e[t] !== s) {
                    continue;
                }
                this.obj.classList.remove(t);
            }
        }
    }
    G(t) {
        const e = this.obj;
        const i = t.length;
        let s = 0;
        let n;
        for (;s < i; s++) {
            n = t[s];
            if (n.length === 0) {
                continue;
            }
            this.V[n] = this.N;
            e.classList.add(n);
        }
    }
}

function getClassesToAdd(t) {
    if (isString(t)) {
        return splitClassString(t);
    }
    if (typeof t !== "object") {
        return c;
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
            return c;
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
        return c;
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
        const i = vt({}, ...this.modules);
        const s = defineAttribute({
            name: "class",
            bindables: [ "value" ],
            noMultiBindings: true
        }, (e = class CustomAttributeClass {
            constructor(t) {
                this.X = new ClassAttributeAccessor(t);
            }
            binding() {
                this.valueChanged();
            }
            valueChanged() {
                this.X.setValue(this.value?.split(/\s+/g).map((t => i[t] || t)) ?? "");
            }
        }, e.inject = [ te ], e));
        t.register(s, Tt(se, i));
    }
}

function shadowCSS(...t) {
    return new ShadowDOMRegistry(t);
}

const ce = /*@__PURE__*/ St("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
    if (AdoptedStyleSheetsStyles.supported(t.get(Ft))) {
        return t.get(AdoptedStyleSheetsStylesFactory);
    }
    return t.get(StyleElementStylesFactory);
}))));

class ShadowDOMRegistry {
    constructor(t) {
        this.css = t;
    }
    register(t) {
        const e = t.get(fe);
        const i = t.get(ce);
        t.register(Tt(ue, i.createStyles(this.css, e)));
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

AdoptedStyleSheetsStylesFactory.inject = [ Ft ];

class StyleElementStylesFactory {
    constructor(t) {
        this.p = t;
    }
    createStyles(t, e) {
        return new StyleElementStyles(this.p, t, e);
    }
}

StyleElementStylesFactory.inject = [ Ft ];

const ue = /*@__PURE__*/ St("IShadowDOMStyles");

const fe = /*@__PURE__*/ St("IShadowDOMGlobalStyles", (t => t.instance({
    applyTo: n
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

const de = {
    shadowDOM(t) {
        return ae.creating(g, (e => {
            if (t.sharedStyles != null) {
                const i = e.get(ce);
                e.register(Tt(fe, i.createStyles(t.sharedStyles, null)));
            }
        }));
    }
};

function valueConverter(t) {
    return function(e) {
        return ge.define(t, e);
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
        let s;
        let n;
        if (isString(t)) {
            s = t;
            n = {
                name: s
            };
        } else {
            s = t.name;
            n = t;
        }
        return new ValueConverterDefinition(e, i(getConverterAnnotation(e, "name"), s), h(getConverterAnnotation(e, "aliases"), n.aliases, e.aliases), ge.keyFrom(s));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        l.singleton(i, e).register(t);
        l.aliasTo(i, e).register(t);
        registerAliases(s, ge, i, t);
    }
}

const me = ht("value-converter");

const getConverterAnnotation = (t, e) => it(lt(e), t);

const ge = pt({
    name: me,
    keyFrom: t => `${me}:${t}`,
    isType(t) {
        return isFunction(t) && st(me, t);
    },
    define(t, e) {
        const i = ValueConverterDefinition.create(t, e);
        nt(me, i, i.Type);
        nt(me, i, i);
        at(e, me);
        return i.Type;
    },
    getDefinition(t) {
        const e = it(me, t);
        if (e === void 0) {
            throw createError(`AUR0152:${t.name}`);
        }
        return e;
    },
    annotate(t, e, i) {
        nt(lt(e), i, t);
    },
    getAnnotation: getConverterAnnotation
});

class BindingTargetSubscriber {
    constructor(t, e) {
        this.v = void 0;
        this.b = t;
        this.K = e;
    }
    flush() {
        this.b.updateSource(this.v);
    }
    handleChange(t, e) {
        const i = this.b;
        if (t !== E(i.ast, i.s, i, null)) {
            this.v = t;
            this.K.add(this);
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
        return this.l.root.get(T);
    }));
    defineHiddenProp(s, "getConverter", (function(t) {
        const e = ge.keyFrom(t);
        let i = pe.get(this);
        if (i == null) {
            pe.set(this, i = new ResourceLookup);
        }
        return i[e] ?? (i[e] = this.l.get(resource(e)));
    }));
    defineHiddenProp(s, "getBehavior", (function(t) {
        const e = Lt.keyFrom(t);
        let i = pe.get(this);
        if (i == null) {
            pe.set(this, i = new ResourceLookup);
        }
        return i[e] ?? (i[e] = this.l.get(resource(e)));
    }));
};

const pe = new WeakMap;

class ResourceLookup {}

const ve = /*@__PURE__*/ St("IFlushQueue", (t => t.singleton(FlushQueue)));

class FlushQueue {
    constructor() {
        this.Y = false;
        this.Z = new Set;
    }
    get count() {
        return this.Z.size;
    }
    add(t) {
        this.Z.add(t);
        if (this.Y) {
            return;
        }
        this.Y = true;
        try {
            this.Z.forEach(flushItem);
        } finally {
            this.Y = false;
        }
    }
    clear() {
        this.Z.clear();
        this.Y = false;
    }
}

function flushItem(t, e, i) {
    i.delete(t);
    t.flush();
}

const be = new WeakSet;

const mixingBindingLimited = (t, e) => {
    defineHiddenProp(t.prototype, "limit", (function(t) {
        if (be.has(this)) {
            throw createError(`AURXXXX: a rate limit has already been applied.`);
        }
        be.add(this);
        const i = e(this, t);
        const s = t.signals;
        const n = s.length > 0 ? this.get(T) : null;
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

const {enter: xe, exit: we} = L;

const {wrap: ye, unwrap: ke} = M;

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
        if (!kt(i, e)) {
            this.cb.call(t, i, e, t);
        }
    }
    compute() {
        this.running = true;
        this.obs.version++;
        try {
            xe(this);
            return this.v = ke(this.$get.call(void 0, this.useProxy ? ye(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            we(this);
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
        this.J = s;
        this.cb = n;
    }
    handleChange(t) {
        const e = this.J;
        const i = this.obj;
        const s = this.v;
        const n = e.$kind === 1 && this.obs.count === 1;
        if (!n) {
            this.obs.version++;
            t = E(e, this.scope, this, this);
            this.obs.clear();
        }
        if (!kt(t, s)) {
            this.v = t;
            this.cb.call(i, t, s, i);
        }
    }
    bind() {
        if (this.isBound) {
            return;
        }
        this.obs.version++;
        this.v = E(this.J, this.scope, this, this);
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

const Ae = /*@__PURE__*/ St("ILifecycleHooks");

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
        while (s !== mt) {
            for (const t of bt(s)) {
                if (t !== "constructor" && !t.startsWith("_")) {
                    i.add(t);
                }
            }
            s = Object.getPrototypeOf(s);
        }
        return new LifecycleHooksDefinition(e, i);
    }
    register(t) {
        _t(Ae, this.Type).register(t);
    }
}

const Ce = new WeakMap;

const Re = lt("lifecycle-hooks");

const Be = pt({
    name: Re,
    define(t, e) {
        const i = LifecycleHooksDefinition.create(t, e);
        nt(Re, i, e);
        at(e, Re);
        return i.Type;
    },
    resolve(t) {
        let e = Ce.get(t);
        if (e === void 0) {
            Ce.set(t, e = new LifecycleHooksLookupImpl);
            const i = t.root;
            const s = i.id === t.id ? t.getAll(Ae) : t.has(Ae, false) ? i.getAll(Ae).concat(t.getAll(Ae)) : i.getAll(Ae);
            let n;
            let r;
            let l;
            let h;
            let a;
            for (n of s) {
                r = it(Re, n.constructor);
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
        this.j = false;
        this.o = t;
        this.tt = e;
        this.et = i;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        this.v = t;
        this.j = t !== this.ov;
        this.W();
    }
    W() {
        if (this.j) {
            this.j = false;
            this.ov = this.v;
            switch (this.et) {
              case "class":
                {
                    this.o.classList.toggle(this.tt, !!this.v);
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
                    this.o.style.setProperty(this.tt, e, t);
                    break;
                }

              default:
                {
                    if (this.v == null) {
                        this.o.removeAttribute(this.et);
                    } else {
                        this.o.setAttribute(this.et, dt(this.v));
                    }
                }
            }
        }
    }
    handleMutation(t) {
        let e = false;
        for (let i = 0, s = t.length; s > i; ++i) {
            const s = t[i];
            if (s.type === "attributes" && s.attributeName === this.tt) {
                e = true;
                break;
            }
        }
        if (e) {
            let t;
            switch (this.et) {
              case "class":
                t = this.o.classList.contains(this.tt);
                break;

              case "style":
                t = this.o.style.getPropertyValue(this.tt);
                break;

              default:
                throw createError(`AUR0651:${this.et}`);
            }
            if (t !== this.v) {
                this.ov = this.v;
                this.v = t;
                this.j = false;
                this.it();
            }
        }
    }
    subscribe(t) {
        if (this.subs.add(t) && this.subs.count === 1) {
            this.v = this.ov = this.o.getAttribute(this.tt);
            startObservation(this.o, this);
        }
    }
    unsubscribe(t) {
        if (this.subs.remove(t) && this.subs.count === 0) {
            stopObservation(this.o, this);
        }
    }
    it() {
        Se = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Se);
    }
}

I(AttributeObserver);

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

let Se = void 0;

const _e = {
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
        this.st = null;
        this.v = void 0;
        this.boundFn = false;
        this.l = e;
        this.ast = n;
        this.nt = t;
        this.target = r;
        this.oL = i;
        this.T = s;
    }
    updateTarget(t) {
        this.rt.setValue(t, this.target, this.targetProperty);
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
            const i = this.nt.state !== 1 && (this.rt.type & 4) > 0;
            if (i) {
                t = this.st;
                this.st = this.T.queueTask((() => {
                    this.st = null;
                    this.updateTarget(e);
                }), _e);
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
        this.rt ?? (this.rt = new AttributeObserver(this.target, this.targetProperty, this.targetAttribute));
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
        $(this.ast, this.s, this);
        this.s = void 0;
        this.v = void 0;
        this.st?.cancel();
        this.st = null;
        this.obs.clearAll();
    }
}

mixinUseScope(AttributeBinding);

mixingBindingLimited(AttributeBinding, (() => "updateTarget"));

P(AttributeBinding);

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
        this.st = null;
        this.nt = t;
        this.oL = i;
        this.T = s;
        this.rt = i.getAccessor(r, l);
        const a = n.expressions;
        const c = this.partBindings = Array(a.length);
        const u = a.length;
        let f = 0;
        for (;u > f; ++f) {
            c[f] = new InterpolationPartBinding(a[f], r, l, e, i, this);
        }
    }
    ot() {
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
        const r = this.rt;
        const l = this.nt.state !== 1 && (r.type & 4) > 0;
        let h;
        if (l) {
            h = this.st;
            this.st = this.T.queueTask((() => {
                this.st = null;
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
        this.st?.cancel();
        this.st = null;
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
        this.owner.ot();
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
        $(this.ast, this.s, this);
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
        this.st = null;
        this.v = "";
        this.boundFn = false;
        this.l = e;
        this.nt = t;
        this.oL = i;
        this.T = s;
    }
    updateTarget(t) {
        const e = this.target;
        const i = this.p.Node;
        const s = this.v;
        this.v = t;
        if (s instanceof i) {
            s.parentNode?.removeChild(s);
        }
        if (t instanceof i) {
            e.textContent = "";
            e.parentNode?.insertBefore(t, e);
        } else {
            e.textContent = dt(t);
        }
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = E(this.ast, this.s, this, (this.mode & 2) > 0 ? this : null);
        this.obs.clear();
        if (t === this.v) {
            this.st?.cancel();
            this.st = null;
            return;
        }
        const e = this.nt.state !== 1;
        if (e) {
            this.lt(t);
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
        const e = this.nt.state !== 1;
        if (e) {
            this.lt(t);
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
        $(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
        this.st?.cancel();
        this.st = null;
    }
    lt(t) {
        const e = this.st;
        this.st = this.T.queueTask((() => {
            this.st = null;
            this.updateTarget(t);
        }), Ie);
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
        this.ht = n;
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
        this.target = this.ht ? t.bindingContext : t.overrideContext;
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
        $(this.ast, this.s, this);
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
        this.rt = void 0;
        this.st = null;
        this.ct = null;
        this.boundFn = false;
        this.l = e;
        this.nt = t;
        this.T = s;
        this.oL = i;
    }
    updateTarget(t) {
        this.rt.setValue(t, this.target, this.targetProperty);
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
        const e = this.nt.state !== 1 && (this.rt.type & 4) > 0;
        if (e) {
            Te = this.st;
            this.st = this.T.queueTask((() => {
                this.updateTarget(t);
                this.st = null;
            }), Ee);
            Te?.cancel();
            Te = null;
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
        let s = this.rt;
        if (!s) {
            if (i & 4) {
                s = e.getObserver(this.target, this.targetProperty);
            } else {
                s = e.getAccessor(this.target, this.targetProperty);
            }
            this.rt = s;
        }
        const n = (i & 2) > 0;
        if (i & (2 | 1)) {
            this.updateTarget(E(this.ast, this.s, this, n ? this : null));
        }
        if (i & 4) {
            s.subscribe(this.ct ?? (this.ct = new BindingTargetSubscriber(this, this.l.get(ve))));
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
        $(this.ast, this.s, this);
        this.s = void 0;
        if (this.ct) {
            this.rt.unsubscribe(this.ct);
            this.ct = null;
        }
        this.st?.cancel();
        this.st = null;
        this.obs.clearAll();
    }
    useTargetObserver(t) {
        this.rt?.unsubscribe(this);
        (this.rt = t).subscribe(this);
    }
    useTargetSubscriber(t) {
        if (this.ct != null) {
            throw createError(`AURxxxx: binding already has a target subscriber`);
        }
        this.ct = t;
    }
}

mixinUseScope(PropertyBinding);

mixingBindingLimited(PropertyBinding, (t => t.mode & 4 ? "updateSource" : "updateTarget"));

P(PropertyBinding);

mixinAstEvaluator(true, false)(PropertyBinding);

let Te = null;

const Ee = {
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
        $(this.ast, this.s, this);
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
        this.ut = n;
    }
    callSource(t) {
        const e = this.s.overrideContext;
        e.$event = t;
        let i = E(this.ast, this.s, this, null);
        delete e.$event;
        if (isFunction(i)) {
            i = i(t);
        }
        if (i !== true && this.ut.prevent) {
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
        this.target.addEventListener(this.targetEvent, this, this.ut);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        $(this.ast, this.s, this);
        this.s = void 0;
        this.target.removeEventListener(this.targetEvent, this, this.ut);
    }
}

mixinUseScope(ListenerBinding);

mixingBindingLimited(ListenerBinding, (() => "callSource"));

mixinAstEvaluator(true, true)(ListenerBinding);

const Pe = /*@__PURE__*/ St("IViewFactory");

class ViewFactory {
    constructor(t, e) {
        this.isCaching = false;
        this.ft = null;
        this.dt = -1;
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
            if (this.dt === -1 || !e) {
                this.dt = t;
            }
        }
        if (this.dt > 0) {
            this.ft = [];
        } else {
            this.ft = null;
        }
        this.isCaching = this.dt > 0;
    }
    canReturnToCache(t) {
        return this.ft != null && this.ft.length < this.dt;
    }
    tryReturnToCache(t) {
        if (this.canReturnToCache(t)) {
            this.ft.push(t);
            return true;
        }
        return false;
    }
    create(t) {
        const e = this.ft;
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

const Le = /*@__PURE__*/ St("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

const Me = /*@__PURE__*/ St("IAuSlotWatcher");

class AuSlotWatcherBinding {
    static create(t, e, i, s, n) {
        const r = t.viewModel;
        const l = new AuSlotWatcherBinding(r, i, s, n);
        At(r, e, {
            enumerable: true,
            configurable: true,
            get: vt((() => l.getValue()), {
                getObserver: () => l
            }),
            set: () => {}
        });
        return l;
    }
    constructor(t, e, i, s) {
        this.gt = new Set;
        this.vt = c;
        this.isBound = false;
        this.cb = (this.o = t)[e];
        this.slotName = i;
        this.bt = s;
    }
    bind() {
        this.isBound = true;
    }
    unbind() {
        this.isBound = false;
    }
    getValue() {
        return this.vt;
    }
    watch(t) {
        if (!this.gt.has(t)) {
            this.gt.add(t);
            t.subscribe(this);
        }
    }
    unwatch(t) {
        if (this.gt.delete(t)) {
            t.unsubscribe(this);
        }
    }
    handleSlotChange(t, e) {
        if (!this.isBound) {
            return;
        }
        const i = this.vt;
        const s = [];
        let n;
        let r;
        for (n of this.gt) {
            for (r of n === t ? e : n.nodes) {
                if (this.bt === "*" || r.nodeType === 1 && r.matches(this.bt)) {
                    s[s.length] = r;
                }
            }
        }
        if (s.length !== i.length || s.some(((t, e) => t !== i[e]))) {
            this.vt = s;
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
        this.def = t;
    }
    register(t) {
        Tt(Ae, this).register(t);
    }
    hydrating(t, e) {
        const i = this.def;
        const s = AuSlotWatcherBinding.create(e, i.name, i.callback ?? `${dt(i.name)}Changed`, i.slotName ?? "default", i.query ?? "*");
        Tt(Me, s).register(e.container);
        e.addBinding(s);
    }
}

function slotted(t, e) {
    if (!De) {
        De = true;
        I(AuSlotWatcherBinding);
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
        let a = Qt.getAnnotation(h, i);
        if (a == null) {
            Qt.annotate(h, i, a = []);
        }
        a.push(new SlottedLifecycleHooks(l));
    }
    return decorator;
}

let De = false;

var $e;

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
})($e || ($e = {}));

const Ue = /*@__PURE__*/ St("Instruction");

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

const qe = /*@__PURE__*/ St("ITemplateCompiler");

const Fe = /*@__PURE__*/ St("IRenderer");

function renderer(t) {
    return function decorator(e) {
        e.register = function(t) {
            _t(Fe, this).register(t);
        };
        yt(e.prototype, "target", {
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

let He = class CustomElementRenderer {
    static get inject() {
        return [ ci ];
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
        const f = i.projections;
        const d = t.container;
        switch (typeof u) {
          case "string":
            l = d.find(Qt, u);
            if (l == null) {
                throw createError(`AUR0752:${u}@${t["name"]}`);
            }
            break;

          default:
            l = u;
        }
        const m = i.containerless || l.containerless;
        const g = m ? convertToRenderLocation(e) : null;
        const v = createElementContainer(s, t, e, i, g, f == null ? void 0 : new AuSlotsInfo(xt(f)));
        h = l.Type;
        a = v.invoke(h);
        registerResolver(v, h, new p(l.key, a));
        c = Controller.$el(v, a, e, i, l, g);
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

He = __decorate([ renderer("ra") ], He);

let Ve = class CustomAttributeRenderer {
    static get inject() {
        return [ ci ];
    }
    constructor(t) {
        this.r = t;
    }
    render(t, e, i, s, n, r) {
        let l = t.container;
        let h;
        switch (typeof i.res) {
          case "string":
            h = l.find(Ht, i.res);
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

Ve = __decorate([ renderer("rb") ], Ve);

let Ne = class TemplateControllerRenderer {
    static get inject() {
        return [ ci, Ft ];
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
            h = l.find(Ht, i.res);
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

Ne = __decorate([ renderer("rc") ], Ne);

let je = class LetElementRenderer {
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

je = __decorate([ renderer("rd") ], je);

let We = class RefBindingRenderer {
    render(t, e, i, s, n) {
        t.addBinding(new RefBinding(t.container, ensureExpression(n, i.from, 16), getRefTarget(e, i.to)));
    }
};

We = __decorate([ renderer("rj") ], We);

let ze = class InterpolationBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new InterpolationBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, 1), getTarget(e), i.to, 2));
    }
};

ze = __decorate([ renderer("rf") ], ze);

let Ge = class PropertyBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, 16), getTarget(e), i.to, i.mode));
    }
};

Ge = __decorate([ renderer("rg") ], Ge);

let Xe = class IteratorBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.forOf, 2), getTarget(e), i.to, 2));
    }
};

Xe = __decorate([ renderer("rk") ], Xe);

let Ke = class TextBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, s.domWriteQueue, s, ensureExpression(n, i.from, 16), insertBefore(e.parentNode, createText(s, ""), e), i.strict));
    }
};

Ke = __decorate([ renderer("ha") ], Ke);

let Qe = class ListenerBindingRenderer {
    render(t, e, i, s, n) {
        t.addBinding(new ListenerBinding(t.container, ensureExpression(n, i.from, 8), e, i.to, new ListenerBindingOptions(i.preventDefault, i.capture)));
    }
};

Qe = __decorate([ renderer("hb") ], Qe);

let Ye = class SetAttributeRenderer {
    render(t, e, i) {
        e.setAttribute(i.to, i.value);
    }
};

Ye = __decorate([ renderer("he") ], Ye);

let Ze = class SetClassAttributeRenderer {
    render(t, e, i) {
        addClasses(e.classList, i.value);
    }
};

Ze = __decorate([ renderer("hf") ], Ze);

let Je = class SetStyleAttributeRenderer {
    render(t, e, i) {
        e.style.cssText += i.value;
    }
};

Je = __decorate([ renderer("hg") ], Je);

let ti = class StylePropertyBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, 16), e.style, i.to, 2));
    }
};

ti = __decorate([ renderer("hd") ], ti);

let ei = class AttributeBindingRenderer {
    render(t, e, i, s, n, r) {
        const l = t.container;
        const h = l.has(se, false) ? l.get(se) : null;
        t.addBinding(new AttributeBinding(t, l, r, s.domWriteQueue, ensureExpression(n, i.from, 16), e, i.attr, h == null ? i.to : i.to.split(/\s/g).map((t => h[t] ?? t)).join(" "), 2));
    }
};

ei = __decorate([ renderer("hc") ], ei);

let ii = class SpreadRenderer {
    static get inject() {
        return [ qe, ci ];
    }
    constructor(t, e) {
        this.xt = t;
        this.r = e;
    }
    render(t, e, i, s, n, r) {
        const l = t.container;
        const h = l.get(xi);
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
            const u = this.xt.compileSpread(l.controller.definition, l.instruction?.captures ?? c, l.controller.container, e);
            let f;
            for (f of u) {
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

ii = __decorate([ renderer("hs") ], ii);

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
        this.wt = t;
        this.yt = e;
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
        const e = this.scope = this.yt.controller.scope.parent ?? void 0;
        if (e == null) {
            throw createError("Invalid spreading. Context scope is null/undefined");
        }
        this.wt.forEach((t => t.bind(e)));
    }
    unbind() {
        this.wt.forEach((t => t.unbind()));
        this.isBound = false;
    }
    addBinding(t) {
        this.wt.push(t);
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

const si = "IController";

const ni = "IInstruction";

const ri = "IRenderLocation";

const oi = "ISlotsInfo";

function createElementContainer(t, e, i, s, n, r) {
    const l = e.container.createChild();
    registerResolver(l, t.HTMLElement, registerResolver(l, t.Element, registerResolver(l, te, new p("ElementResolver", i))));
    registerResolver(l, bi, new p(si, e));
    registerResolver(l, Ue, new p(ni, s));
    registerResolver(l, ie, n == null ? li : new RenderLocationProvider(n));
    registerResolver(l, Pe, hi);
    registerResolver(l, Le, r == null ? ai : new p(oi, r));
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
    registerResolver(a, t.HTMLElement, registerResolver(a, t.Element, registerResolver(a, te, new p("ElementResolver", s))));
    i = i instanceof Controller ? i : i.ctrl;
    registerResolver(a, bi, new p(si, i));
    registerResolver(a, Ue, new p(ni, n));
    registerResolver(a, ie, l == null ? li : new p(ri, l));
    registerResolver(a, Pe, r == null ? hi : new ViewFactoryProvider(r));
    registerResolver(a, Le, h == null ? ai : new p(oi, h));
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

const li = new RenderLocationProvider(null);

const hi = new ViewFactoryProvider(null);

const ai = new p(oi, new AuSlotsInfo(c));

const ci = /*@__PURE__*/ St("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.kt ?? (this.kt = this.At.getAll(Fe, false).reduce(((t, e) => {
            t[e.target] = e;
            return t;
        }), createLookup()));
    }
    constructor(t) {
        this.Ct = new WeakMap;
        this.Rt = new WeakMap;
        const e = t.root;
        this.p = (this.At = e).get(Ft);
        this.ep = e.get(q);
        this.oL = e.get(F);
        this.Bt = new FragmentNodeSequence(this.p, this.p.document.createDocumentFragment());
    }
    compile(t, e, i) {
        if (t.needsCompile !== false) {
            const s = this.Ct;
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
            return new FragmentNodeSequence(this.p, t.template);
        }
        let e;
        let i = false;
        const s = this.Rt;
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
        return e == null ? this.Bt : new FragmentNodeSequence(this.p, i ? r.importNode(e, true) : r.adoptNode(e.cloneNode(true)));
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

Rendering.inject = [ g ];

var ui;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["host"] = 1] = "host";
    t[t["shadowRoot"] = 2] = "shadowRoot";
    t[t["location"] = 3] = "location";
})(ui || (ui = {}));

const fi = {
    optional: true
};

const di = new WeakMap;

class Controller {
    get lifecycleHooks() {
        return this.St;
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
        return this._t;
    }
    get viewModel() {
        return this.It;
    }
    set viewModel(t) {
        this.It = t;
        this._t = t == null || this.vmKind === 2 ? HooksDefinition.none : new HooksDefinition(t);
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
        this.hostController = null;
        this.mountTarget = 0;
        this.shadowRoot = null;
        this.nodes = null;
        this.location = null;
        this.St = null;
        this.state = 0;
        this.Tt = false;
        this.$initiator = null;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this.Et = 0;
        this.Pt = 0;
        this.Lt = 0;
        this.It = n;
        this._t = e === 2 ? HooksDefinition.none : new HooksDefinition(n);
        this.location = l;
        this.r = t.root.get(ci);
    }
    static getCached(t) {
        return di.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (e === void 0) {
            throw createError(`AUR0500:${t}`);
        }
        return e;
    }
    static $el(t, e, i, s, n = void 0, r = null) {
        if (di.has(e)) {
            return di.get(e);
        }
        n = n ?? getElementDefinition(e.constructor);
        const l = new Controller(t, 0, n, null, e, i, r);
        const h = t.get(v(xi));
        if (n.dependencies.length > 0) {
            t.register(...n.dependencies);
        }
        registerResolver(t, xi, new p("IHydrationContext", new HydrationContext(l, s, h)));
        di.set(e, l);
        if (s == null || s.hydrate !== false) {
            l.hE(s, h);
        }
        return l;
    }
    static $attr(t, e, i, s) {
        if (di.has(e)) {
            return di.get(e);
        }
        s = s ?? getAttributeDefinition(e.constructor);
        const n = new Controller(t, 1, s, null, e, i, null);
        if (s.dependencies.length > 0) {
            t.register(...s.dependencies);
        }
        di.set(e, n);
        n.Mt();
        return n;
    }
    static $view(t, e = void 0) {
        const i = new Controller(t.container, 2, null, t, null, null, null);
        i.parent = e ?? null;
        i.Dt();
        return i;
    }
    hE(t, e) {
        const i = this.container;
        const s = this.It;
        let n = this.definition;
        this.scope = O.create(s, null, true);
        if (n.watches.length > 0) {
            createWatchers(this, i, n, s);
        }
        createObservers(this, n, s);
        if (this._t.hasDefine) {
            const t = s.define(this, e, n);
            if (t !== void 0 && t !== n) {
                n = CustomElementDefinition.getOrCreate(t);
            }
        }
        this.St = Be.resolve(i);
        n.register(i);
        if (n.injectable !== null) {
            registerResolver(i, n.injectable, new p("definition.injectable", s));
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
        if (this._t.hasHydrating) {
            this.It.hydrating(this);
        }
        const e = this.$t = this.r.compile(this.definition, this.container, t);
        const {shadowOptions: i, isStrictBinding: s, hasSlots: n, containerless: r} = e;
        let l = this.location;
        this.isStrictBinding = s;
        if ((this.hostController = findElementControllerFor(this.host, fi)) !== null) {
            this.host = this.container.root.get(Ft).document.createElement(this.definition.name);
            if (r && l == null) {
                l = this.location = convertToRenderLocation(this.host);
            }
        }
        setRef(this.host, Gt, this);
        setRef(this.host, this.definition.key, this);
        if (i !== null || n) {
            if (l != null) {
                throw createError(`AUR0501`);
            }
            setRef(this.shadowRoot = this.host.attachShadow(i ?? gi), Gt, this);
            setRef(this.shadowRoot, this.definition.key, this);
            this.mountTarget = 2;
        } else if (l != null) {
            setRef(l, Gt, this);
            setRef(l, this.definition.key, this);
            this.mountTarget = 3;
        } else {
            this.mountTarget = 1;
        }
        this.It.$controller = this;
        this.nodes = this.r.createNodes(e);
        if (this.St.hydrated !== void 0) {
            this.St.hydrated.forEach(callHydratedHook, this);
        }
        if (this._t.hasHydrated) {
            this.It.hydrated(this);
        }
    }
    hC() {
        this.r.render(this, this.nodes.findTargets(), this.$t, this.host);
        if (this.St.created !== void 0) {
            this.St.created.forEach(callCreatedHook, this);
        }
        if (this._t.hasCreated) {
            this.It.created(this);
        }
    }
    Mt() {
        const t = this.definition;
        const e = this.It;
        if (t.watches.length > 0) {
            createWatchers(this, this.container, t, e);
        }
        createObservers(this, t, e);
        e.$controller = this;
        this.St = Be.resolve(this.container);
        if (this.St.created !== void 0) {
            this.St.created.forEach(callCreatedHook, this);
        }
        if (this._t.hasCreated) {
            this.It.created(this);
        }
    }
    Dt() {
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
        if (this.vmKind !== 2 && this.St.binding != null) {
            s = b(...this.St.binding.map(callBindingHook, this));
        }
        if (this._t.hasBinding) {
            s = b(s, this.It.binding(this.$initiator, this.parent));
        }
        if (isPromise(s)) {
            this.qt();
            s.then((() => {
                this.bind();
            })).catch((t => {
                this.Ft(t);
            }));
            return this.$promise;
        }
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
        if (this.vmKind !== 2 && this.St.bound != null) {
            i = b(...this.St.bound.map(callBoundHook, this));
        }
        if (this._t.hasBound) {
            i = b(i, this.It.bound(this.$initiator, this.parent));
        }
        if (isPromise(i)) {
            this.qt();
            i.then((() => {
                this.isBound = true;
                this.Ot();
            })).catch((t => {
                this.Ft(t);
            }));
            return;
        }
        this.isBound = true;
        this.Ot();
    }
    Ht(...t) {
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
    Ot() {
        if (this.hostController !== null) {
            switch (this.mountTarget) {
              case 1:
              case 2:
                this.hostController.Ht(this.host);
                break;

              case 3:
                this.hostController.Ht(this.location.$start, this.location);
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
                const e = t.has(ue, false) ? t.get(ue) : t.get(fe);
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
        if (this.vmKind !== 2 && this.St.attaching != null) {
            e = b(...this.St.attaching.map(callAttachingHook, this));
        }
        if (this._t.hasAttaching) {
            e = b(e, this.It.attaching(this.$initiator, this.parent));
        }
        if (isPromise(e)) {
            this.qt();
            this.Ut();
            e.then((() => {
                this.Vt();
            })).catch((t => {
                this.Ft(t);
            }));
        }
        if (this.children !== null) {
            for (;t < this.children.length; ++t) {
                void this.children[t].activate(this.$initiator, this, this.scope);
            }
        }
        this.Vt();
    }
    deactivate(t, e) {
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
        this.$initiator = t;
        if (t === this) {
            this.Nt();
        }
        let i = 0;
        let s;
        if (this.children !== null) {
            for (i = 0; i < this.children.length; ++i) {
                void this.children[i].deactivate(t, this);
            }
        }
        if (this.vmKind !== 2 && this.St.detaching != null) {
            s = b(...this.St.detaching.map(callDetachingHook, this));
        }
        if (this._t.hasDetaching) {
            s = b(s, this.It.detaching(this.$initiator, this.parent));
        }
        if (isPromise(s)) {
            this.qt();
            t.Nt();
            s.then((() => {
                t.jt();
            })).catch((e => {
                t.Ft(e);
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
        this.jt();
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
        this.Wt();
    }
    qt() {
        if (this.$promise === void 0) {
            this.$promise = new Promise(((t, e) => {
                this.$resolve = t;
                this.$reject = e;
            }));
            if (this.$initiator !== this) {
                this.parent.qt();
            }
        }
    }
    Wt() {
        if (this.$promise !== void 0) {
            wi = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            wi();
            wi = void 0;
        }
    }
    Ft(t) {
        if (this.$promise !== void 0) {
            yi = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            yi(t);
            yi = void 0;
        }
        if (this.$initiator !== this) {
            this.parent.Ft(t);
        }
    }
    Ut() {
        ++this.Et;
        if (this.$initiator !== this) {
            this.parent.Ut();
        }
    }
    Vt() {
        if (--this.Et === 0) {
            if (this.vmKind !== 2 && this.St.attached != null) {
                ki = b(...this.St.attached.map(callAttachedHook, this));
            }
            if (this._t.hasAttached) {
                ki = b(ki, this.It.attached(this.$initiator));
            }
            if (isPromise(ki)) {
                this.qt();
                ki.then((() => {
                    this.state = 2;
                    this.Wt();
                    if (this.$initiator !== this) {
                        this.parent.Vt();
                    }
                })).catch((t => {
                    this.Ft(t);
                }));
                ki = void 0;
                return;
            }
            ki = void 0;
            this.state = 2;
            this.Wt();
        }
        if (this.$initiator !== this) {
            this.parent.Vt();
        }
    }
    Nt() {
        ++this.Pt;
    }
    jt() {
        if (--this.Pt === 0) {
            this.zt();
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
                if (t.vmKind !== 2 && t.St.unbinding != null) {
                    e = b(...t.St.unbinding.map(callUnbindingHook, this));
                }
                if (t._t.hasUnbinding) {
                    if (t.debug) {
                        t.logger.trace("unbinding()");
                    }
                    e = b(e, t.viewModel.unbinding(t.$initiator, t.parent));
                }
                if (isPromise(e)) {
                    this.qt();
                    this.zt();
                    e.then((() => {
                        this.Gt();
                    })).catch((t => {
                        this.Ft(t);
                    }));
                }
                e = void 0;
                t = t.next;
            }
            this.Gt();
        }
    }
    zt() {
        ++this.Lt;
    }
    Gt() {
        if (--this.Lt === 0) {
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
                return getAttributeDefinition(this.It.constructor).name === t;
            }

          case 0:
            {
                return getElementDefinition(this.It.constructor).name === t;
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
            setRef(t, Gt, this);
            setRef(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = 1;
        return this;
    }
    setShadowRoot(t) {
        if (this.vmKind === 0) {
            setRef(t, Gt, this);
            setRef(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = 2;
        return this;
    }
    setLocation(t) {
        if (this.vmKind === 0) {
            setRef(t, Gt, this);
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
        if (this._t.hasDispose) {
            this.It.dispose();
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
        if (this.It !== null) {
            di.delete(this.It);
            this.It = null;
        }
        this.It = null;
        this.host = null;
        this.shadowRoot = null;
        this.container.disposeResolvers();
    }
    accept(t) {
        if (t(this) === true) {
            return true;
        }
        if (this._t.hasAccept && this.It.accept(t) === true) {
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

function getLookup(t) {
    let e = t.$observers;
    if (e === void 0) {
        Reflect.defineProperty(t, "$observers", {
            enumerable: false,
            value: e = {}
        });
    }
    return e;
}

function createObservers(t, e, i) {
    const s = e.bindables;
    const n = bt(s);
    const r = n.length;
    if (r > 0) {
        let e;
        let l;
        let h = 0;
        const a = getLookup(i);
        const c = t.container;
        const u = c.has(H, true) ? c.get(H) : null;
        for (;h < r; ++h) {
            e = n[h];
            if (a[e] === void 0) {
                l = s[e];
                a[e] = new BindableObserver(i, e, l.callback, l.set, t, u);
            }
        }
    }
}

const mi = new Map;

const getAccessScopeAst = t => {
    let e = mi.get(t);
    if (e == null) {
        e = new V(t, 0);
        mi.set(t, e);
    }
    return e;
};

function createWatchers(t, e, i, s) {
    const n = e.get(F);
    const r = e.get(q);
    const l = i.watches;
    const h = t.vmKind === 0 ? t.scope : O.create(s, null, true);
    const a = l.length;
    let c;
    let u;
    let f;
    let d = 0;
    for (;a > d; ++d) {
        ({expression: c, callback: u} = l[d]);
        u = isFunction(u) ? u : Reflect.get(s, u);
        if (!isFunction(u)) {
            throw createError(`AUR0506:${dt(u)}`);
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
    return _(t) && isElementType(t.constructor);
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

const gi = {
    mode: "open"
};

var pi;

(function(t) {
    t[t["customElement"] = 0] = "customElement";
    t[t["customAttribute"] = 1] = "customAttribute";
    t[t["synthetic"] = 2] = "synthetic";
})(pi || (pi = {}));

var vi;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["activating"] = 1] = "activating";
    t[t["activated"] = 2] = "activated";
    t[t["deactivating"] = 4] = "deactivating";
    t[t["deactivated"] = 8] = "deactivated";
    t[t["released"] = 16] = "released";
    t[t["disposed"] = 32] = "disposed";
})(vi || (vi = {}));

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

const bi = /*@__PURE__*/ St("IController");

const xi = /*@__PURE__*/ St("IHydrationContext");

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
    t.instance.created(this.It, this);
}

function callHydratingHook(t) {
    t.instance.hydrating(this.It, this);
}

function callHydratedHook(t) {
    t.instance.hydrated(this.It, this);
}

function callBindingHook(t) {
    return t.instance.binding(this.It, this["$initiator"], this.parent);
}

function callBoundHook(t) {
    return t.instance.bound(this.It, this["$initiator"], this.parent);
}

function callAttachingHook(t) {
    return t.instance.attaching(this.It, this["$initiator"], this.parent);
}

function callAttachedHook(t) {
    return t.instance.attached(this.It, this["$initiator"]);
}

function callDetachingHook(t) {
    return t.instance.detaching(this.It, this["$initiator"], this.parent);
}

function callUnbindingHook(t) {
    return t.instance.unbinding(this.It, this["$initiator"], this.parent);
}

let wi;

let yi;

let ki;

const Ai = /*@__PURE__*/ St("IAppRoot");

class AppRoot {
    constructor(t, e, i, s) {
        this.config = t;
        this.platform = e;
        this.container = i;
        this.controller = void 0;
        this.Xt = void 0;
        this.host = t.host;
        s.prepare(this);
        registerResolver(i, e.HTMLElement, registerResolver(i, e.Element, registerResolver(i, te, new p("ElementResolver", t.host))));
        this.Xt = x(this.Kt("creating"), (() => {
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
            return x(this.Kt("hydrating"), (() => {
                l.hS(null);
                return x(this.Kt("hydrated"), (() => {
                    l.hC();
                    this.Xt = void 0;
                }));
            }));
        }));
    }
    activate() {
        return x(this.Xt, (() => x(this.Kt("activating"), (() => x(this.controller.activate(this.controller, null, void 0), (() => this.Kt("activated")))))));
    }
    deactivate() {
        return x(this.Kt("deactivating"), (() => x(this.controller.deactivate(this.controller, null), (() => this.Kt("deactivated")))));
    }
    Kt(t) {
        return b(...this.container.getAll(he).reduce(((e, i) => {
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

const Ci = /*@__PURE__*/ St("IAurelia");

class Aurelia {
    get isRunning() {
        return this.ir;
    }
    get isStarting() {
        return this.Qt;
    }
    get isStopping() {
        return this.Yt;
    }
    get root() {
        if (this.Zt == null) {
            if (this.next == null) {
                throw createError(`AUR0767`);
            }
            return this.next;
        }
        return this.Zt;
    }
    constructor(t = r.createContainer()) {
        this.container = t;
        this.ir = false;
        this.Qt = false;
        this.Yt = false;
        this.Zt = void 0;
        this.next = void 0;
        this.Jt = void 0;
        this.te = void 0;
        if (t.has(Ci, true)) {
            throw createError(`AUR0768`);
        }
        registerResolver(t, Ci, new p("IAurelia", this));
        registerResolver(t, Ai, this.ee = new p("IAppRoot"));
    }
    register(...t) {
        this.container.register(...t);
        return this;
    }
    app(t) {
        this.next = new AppRoot(t, this.ie(t.host), this.container, this.ee);
        return this;
    }
    enhance(t, e) {
        const i = t.container ?? this.container.createChild();
        const s = t.host;
        const n = this.ie(s);
        const r = t.component;
        let l;
        if (isFunction(r)) {
            registerResolver(i, n.HTMLElement, registerResolver(i, n.Element, registerResolver(i, te, new p("ElementResolver", s))));
            l = i.invoke(r);
        } else {
            l = r;
        }
        registerResolver(i, ee, new p("IEventTarget", s));
        e = e ?? null;
        const h = Controller.$el(i, l, s, null, CustomElementDefinition.create({
            name: Xt(),
            template: s,
            enhance: true
        }));
        return x(h.activate(h, e), (() => h));
    }
    async waitForIdle() {
        const t = this.root.platform;
        await t.domWriteQueue.yield();
        await t.domReadQueue.yield();
        await t.taskQueue.yield();
    }
    ie(t) {
        let e;
        if (!this.container.has(Ft, false)) {
            if (t.ownerDocument.defaultView === null) {
                throw createError(`AUR0769`);
            }
            e = new tt(t.ownerDocument.defaultView);
            this.container.register(Tt(Ft, e));
        } else {
            e = this.container.get(Ft);
        }
        return e;
    }
    start(t = this.next) {
        if (t == null) {
            throw createError(`AUR0770`);
        }
        if (isPromise(this.Jt)) {
            return this.Jt;
        }
        return this.Jt = x(this.stop(), (() => {
            Reflect.set(t.host, "$aurelia", this);
            this.ee.prepare(this.Zt = t);
            this.Qt = true;
            return x(t.activate(), (() => {
                this.ir = true;
                this.Qt = false;
                this.Jt = void 0;
                this.se(t, "au-started", t.host);
            }));
        }));
    }
    stop(t = false) {
        if (isPromise(this.te)) {
            return this.te;
        }
        if (this.ir === true) {
            const e = this.Zt;
            this.ir = false;
            this.Yt = true;
            return this.te = x(e.deactivate(), (() => {
                Reflect.deleteProperty(e.host, "$aurelia");
                if (t) {
                    e.dispose();
                }
                this.Zt = void 0;
                this.ee.dispose();
                this.Yt = false;
                this.se(e, "au-stopped", e.host);
            }));
        }
    }
    dispose() {
        if (this.ir || this.Yt) {
            throw createError(`AUR0771`);
        }
        this.container.dispose();
    }
    se(t, e, i) {
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
                this.has = this.ne;
                break;

              case 1:
                this.has = this.re;
                break;

              default:
                this.has = this.oe;
            }
        } else {
            switch (t.length) {
              case 0:
                this.has = this.le;
                break;

              case 1:
                this.has = this.he;
                break;

              default:
                this.has = this.ae;
            }
        }
    }
    equals(t) {
        return this.chars === t.chars && this.repeat === t.repeat && this.isSymbol === t.isSymbol && this.isInverted === t.isInverted;
    }
    ae(t) {
        return this.chars.includes(t);
    }
    he(t) {
        return this.chars === t;
    }
    le(t) {
        return false;
    }
    oe(t) {
        return !this.chars.includes(t);
    }
    re(t) {
        return this.chars !== t;
    }
    ne(t) {
        return true;
    }
}

class Interpretation {
    constructor() {
        this.parts = c;
        this.ce = "";
        this.ue = {};
        this.fe = {};
    }
    get pattern() {
        const t = this.ce;
        if (t === "") {
            return null;
        } else {
            return t;
        }
    }
    set pattern(t) {
        if (t == null) {
            this.ce = "";
            this.parts = c;
        } else {
            this.ce = t;
            this.parts = this.fe[t];
        }
    }
    append(t, e) {
        const i = this.ue;
        if (i[t] === undefined) {
            i[t] = e;
        } else {
            i[t] += e;
        }
    }
    next(t) {
        const e = this.ue;
        let i;
        if (e[t] !== undefined) {
            i = this.fe;
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
    get ce() {
        return this.de ? this.me[0] : null;
    }
    constructor(t, ...e) {
        this.charSpec = t;
        this.ge = [];
        this.pe = null;
        this.de = false;
        this.me = e;
    }
    findChild(t) {
        const e = this.ge;
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
        const i = this.me;
        if (!i.includes(e)) {
            i.push(e);
        }
        let s = this.findChild(t);
        if (s == null) {
            s = new AttrParsingState(t, e);
            this.ge.push(s);
            if (t.repeat) {
                s.ge.push(s);
            }
        }
        return s;
    }
    findMatches(t, e) {
        const i = [];
        const s = this.ge;
        const n = s.length;
        let r = 0;
        let l = null;
        let h = 0;
        let a = 0;
        for (;h < n; ++h) {
            l = s[h];
            if (l.charSpec.has(t)) {
                i.push(l);
                r = l.me.length;
                a = 0;
                if (l.charSpec.isSymbol) {
                    for (;a < r; ++a) {
                        e.next(l.me[a]);
                    }
                } else {
                    for (;a < r; ++a) {
                        e.append(l.me[a], t);
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
        const e = this.ve = t.length;
        const i = this.be = [];
        let s = 0;
        for (;e > s; ++s) {
            i.push(new CharSpec(t[s], false, false, false));
        }
    }
    eachChar(t) {
        const e = this.ve;
        const i = this.be;
        let s = 0;
        for (;e > s; ++s) {
            t(i[s]);
        }
    }
}

class DynamicSegment {
    constructor(t) {
        this.text = "PART";
        this.xe = new CharSpec(t, true, false, true);
    }
    eachChar(t) {
        t(this.xe);
    }
}

class SymbolSegment {
    constructor(t) {
        this.text = t;
        this.xe = new CharSpec(t, false, true, false);
    }
    eachChar(t) {
        t(this.xe);
    }
}

class SegmentTypes {
    constructor() {
        this.statics = 0;
        this.dynamics = 0;
        this.symbols = 0;
    }
}

const Ri = /*@__PURE__*/ St("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

class SyntaxInterpreter {
    constructor() {
        this.we = new AttrParsingState(null);
        this.ye = [ this.we ];
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
            i = this.we;
            s = t[c];
            n = s.pattern;
            r = new SegmentTypes;
            l = this.ke(s, r);
            h = l.length;
            a = t => i = i.append(t, n);
            for (u = 0; h > u; ++u) {
                l[u].eachChar(a);
            }
            i.pe = r;
            i.de = true;
            ++c;
        }
    }
    interpret(t) {
        const e = new Interpretation;
        const i = t.length;
        let s = this.ye;
        let n = 0;
        let r;
        for (;n < i; ++n) {
            s = this.Ae(s, t.charAt(n), e);
            if (s.length === 0) {
                break;
            }
        }
        s = s.filter(isEndpoint);
        if (s.length > 0) {
            s.sort(sortEndpoint);
            r = s[0];
            if (!r.charSpec.isSymbol) {
                e.next(r.ce);
            }
            e.pattern = r.ce;
        }
        return e;
    }
    Ae(t, e, i) {
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
    ke(t, e) {
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
    return t.de;
}

function sortEndpoint(t, e) {
    const i = t.pe;
    const s = e.pe;
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

const Bi = /*@__PURE__*/ St("IAttributePattern");

const Si = /*@__PURE__*/ St("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor(t, e) {
        this.ft = {};
        this.Ce = t;
        const i = this.me = {};
        const s = e.reduce(((t, e) => {
            const s = getAllPatternDefinitions(e.constructor);
            s.forEach((t => i[t.pattern] = e));
            return t.concat(s);
        }), c);
        t.add(s);
    }
    parse(t, e) {
        let i = this.ft[t];
        if (i == null) {
            i = this.ft[t] = this.Ce.interpret(t);
        }
        const s = i.pattern;
        if (s == null) {
            return new AttrSyntax(t, e, t, null);
        } else {
            return this.me[s][s](t, e, i.parts);
        }
    }
}

AttributeParser.inject = [ Ri, w(Bi) ];

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
        _t(Bi, this.Type).register(t);
    }
}

const _i = ht("attribute-pattern");

const Ii = "attribute-pattern-definitions";

const getAllPatternDefinitions = e => t.annotation.get(e, Ii);

const Ti = pt({
    name: _i,
    definitionAnnotationKey: Ii,
    define(e, i) {
        const s = new AttributePatternResourceDefinition(i);
        nt(_i, s, i);
        at(i, _i);
        t.annotation.set(i, Ii, e);
        ct(i, Ii);
        return i;
    },
    getPatternDefinitions: getAllPatternDefinitions
});

let Ei = class DotSeparatedAttributePattern {
    "PART.PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], i[1]);
    }
    "PART.PART.PART"(t, e, i) {
        return new AttrSyntax(t, e, `${i[0]}.${i[1]}`, i[2]);
    }
};

Ei = __decorate([ attributePattern({
    pattern: "PART.PART",
    symbols: "."
}, {
    pattern: "PART.PART.PART",
    symbols: "."
}) ], Ei);

let Pi = class RefAttributePattern {
    ref(t, e, i) {
        return new AttrSyntax(t, e, "element", "ref");
    }
    "PART.ref"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "ref");
    }
};

Pi = __decorate([ attributePattern({
    pattern: "ref",
    symbols: ""
}, {
    pattern: "PART.ref",
    symbols: "."
}) ], Pi);

let Li = class ColonPrefixedBindAttributePattern {
    ":PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "bind");
    }
};

Li = __decorate([ attributePattern({
    pattern: ":PART",
    symbols: ":"
}) ], Li);

let Mi = class AtPrefixedTriggerAttributePattern {
    "@PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "trigger");
    }
};

Mi = __decorate([ attributePattern({
    pattern: "@PART",
    symbols: "@"
}) ], Mi);

let Di = class SpreadAttributePattern {
    "...$attrs"(t, e, i) {
        return new AttrSyntax(t, e, "", "...$attrs");
    }
};

Di = __decorate([ attributePattern({
    pattern: "...$attrs",
    symbols: ""
}) ], Di);

var $i;

(function(t) {
    t[t["None"] = 0] = "None";
    t[t["IgnoreAttr"] = 1] = "IgnoreAttr";
})($i || ($i = {}));

function bindingCommand(t) {
    return function(e) {
        return qi.define(t, e);
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
        let s;
        let n;
        if (isString(t)) {
            s = t;
            n = {
                name: s
            };
        } else {
            s = t.name;
            n = t;
        }
        return new BindingCommandDefinition(e, i(getCommandAnnotation(e, "name"), s), h(getCommandAnnotation(e, "aliases"), n.aliases, e.aliases), getCommandKeyFrom(s), i(getCommandAnnotation(e, "type"), n.type, e.type, null));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        _t(i, e).register(t);
        It(i, e).register(t);
        registerAliases(s, qi, i, t);
    }
}

const Ui = ht("binding-command");

const getCommandKeyFrom = t => `${Ui}:${t}`;

const getCommandAnnotation = (t, e) => it(lt(e), t);

const qi = pt({
    name: Ui,
    keyFrom: getCommandKeyFrom,
    define(t, e) {
        const i = BindingCommandDefinition.create(t, e);
        nt(Ui, i, i.Type);
        nt(Ui, i, i);
        at(e, Ui);
        return i.Type;
    },
    getAnnotation: getCommandAnnotation
});

let Fi = class OneTimeBindingCommand {
    get type() {
        return 0;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = t.attr.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? y(n);
        } else {
            if (r === "" && t.def.type === 1) {
                r = y(n);
            }
            n = t.bindable.property;
        }
        return new PropertyBindingInstruction(e.parse(r, 16), n, 1);
    }
};

Fi = __decorate([ bindingCommand("one-time") ], Fi);

let Oi = class ToViewBindingCommand {
    get type() {
        return 0;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = t.attr.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? y(n);
        } else {
            if (r === "" && t.def.type === 1) {
                r = y(n);
            }
            n = t.bindable.property;
        }
        return new PropertyBindingInstruction(e.parse(r, 16), n, 2);
    }
};

Oi = __decorate([ bindingCommand("to-view") ], Oi);

let Hi = class FromViewBindingCommand {
    get type() {
        return 0;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = s.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? y(n);
        } else {
            if (r === "" && t.def.type === 1) {
                r = y(n);
            }
            n = t.bindable.property;
        }
        return new PropertyBindingInstruction(e.parse(r, 16), n, 4);
    }
};

Hi = __decorate([ bindingCommand("from-view") ], Hi);

let Vi = class TwoWayBindingCommand {
    get type() {
        return 0;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = s.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? y(n);
        } else {
            if (r === "" && t.def.type === 1) {
                r = y(n);
            }
            n = t.bindable.property;
        }
        return new PropertyBindingInstruction(e.parse(r, 16), n, 6);
    }
};

Vi = __decorate([ bindingCommand("two-way") ], Vi);

let Ni = class DefaultBindingCommand {
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
            h = i.map(t.node, h) ?? y(h);
        } else {
            if (a === "" && t.def.type === 1) {
                a = y(h);
            }
            r = t.def.defaultBindingMode;
            l = n.mode === 8 || n.mode == null ? r == null || r === 8 ? 2 : r : n.mode;
            h = n.property;
        }
        return new PropertyBindingInstruction(e.parse(a, 16), h, l);
    }
};

Ni = __decorate([ bindingCommand("bind") ], Ni);

let ji = class ForBindingCommand {
    get type() {
        return 0;
    }
    static get inject() {
        return [ Si ];
    }
    constructor(t) {
        this.Re = t;
    }
    build(t, e) {
        const i = t.bindable === null ? y(t.attr.target) : t.bindable.property;
        const s = e.parse(t.attr.rawValue, 2);
        let n = c;
        if (s.semiIdx > -1) {
            const e = t.attr.rawValue.slice(s.semiIdx + 1);
            const i = e.indexOf(":");
            if (i > -1) {
                const t = e.slice(0, i).trim();
                const s = e.slice(i + 1).trim();
                const r = this.Re.parse(t, s);
                n = [ new MultiAttrInstruction(s, r.target, r.command) ];
            }
        }
        return new IteratorBindingInstruction(s, i, n);
    }
};

ji = __decorate([ bindingCommand("for") ], ji);

let Wi = class TriggerBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, 8), t.attr.target, true, false);
    }
};

Wi = __decorate([ bindingCommand("trigger") ], Wi);

let zi = class CaptureBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, 8), t.attr.target, false, true);
    }
};

zi = __decorate([ bindingCommand("capture") ], zi);

let Gi = class AttrBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction(t.attr.target, e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

Gi = __decorate([ bindingCommand("attr") ], Gi);

let Xi = class StyleBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction("style", e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

Xi = __decorate([ bindingCommand("style") ], Xi);

let Ki = class ClassBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction("class", e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

Ki = __decorate([ bindingCommand("class") ], Ki);

let Qi = class RefBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new RefBindingInstruction(e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

Qi = __decorate([ bindingCommand("ref") ], Qi);

let Yi = class SpreadBindingCommand {
    get type() {
        return 1;
    }
    build(t) {
        return new SpreadBindingInstruction;
    }
};

Yi = __decorate([ bindingCommand("...$attrs") ], Yi);

const Zi = /*@__PURE__*/ St("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

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
        return _t(Zi, this).register(t);
    }
    constructor(t) {
        this.Be = vt(createLookup(), {
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
        this.Se = o("a altGlyph animate animateColor circle clipPath defs ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feFlood feGaussianBlur feImage feMerge feMorphology feOffset feSpecularLighting feTile feTurbulence filter font foreignObject g glyph glyphRef image line linearGradient marker mask missing-glyph path pattern polygon polyline radialGradient rect stop svg switch symbol text textPath tref tspan use");
        this._e = o("alignment-baseline baseline-shift clip-path clip-rule clip color-interpolation-filters color-interpolation color-profile color-rendering color cursor direction display dominant-baseline enable-background fill-opacity fill-rule fill filter flood-color flood-opacity font-family font-size-adjust font-size font-stretch font-style font-variant font-weight glyph-orientation-horizontal glyph-orientation-vertical image-rendering kerning letter-spacing lighting-color marker-end marker-mid marker-start mask opacity overflow pointer-events shape-rendering stop-color stop-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width stroke text-anchor text-decoration text-rendering unicode-bidi visibility word-spacing writing-mode");
        this.SVGElement = t.globalThis.SVGElement;
        const e = t.document.createElement("div");
        e.innerHTML = "<svg><altGlyph /></svg>";
        if (e.firstElementChild.nodeName === "altglyph") {
            const t = this.Be;
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
        return this.Se[t.nodeName] === true && this._e[e] === true || this.Be[t.nodeName]?.[e] === true;
    }
}

SVGAnalyzer.inject = [ Ft ];

const Ji = /*@__PURE__*/ St("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    static get inject() {
        return [ Zi ];
    }
    constructor(t) {
        this.svg = t;
        this.fns = [];
        this.Ie = createLookup();
        this.Te = createLookup();
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
            s = (e = this.Ie)[n] ?? (e[n] = createLookup());
            for (r in i) {
                if (s[r] !== void 0) {
                    throw createMappedError(r, n);
                }
                s[r] = i[r];
            }
        }
    }
    useGlobalMapping(t) {
        const e = this.Te;
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
        return this.Ie[t.nodeName]?.[e] ?? this.Te[e] ?? (isDataAttribute(t, e, this.svg) ? e : null);
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

var ts;

(function(t) {
    t[t["oneTime"] = 1] = "oneTime";
    t[t["toView"] = 2] = "toView";
    t[t["fromView"] = 4] = "fromView";
    t[t["twoWay"] = 6] = "twoWay";
    t[t["default"] = 8] = "default";
})(ts || (ts = {}));

const es = createLookup();

class AttributeNSAccessor {
    static forNs(t) {
        return es[t] ?? (es[t] = new AttributeNSAccessor(t));
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

const is = new DataAttributeAccessor;

const ss = {
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
        this.j = false;
        this.Ee = void 0;
        this.Pe = void 0;
        this.iO = false;
        this.F = false;
        this.q = t;
        this.oL = s;
        this.cf = i;
    }
    getValue() {
        return this.iO ? this.v : this.q.multiple ? getSelectedOptions(this.q.options) : this.q.value;
    }
    setValue(t) {
        this.ov = this.v;
        this.v = t;
        this.j = t !== this.ov;
        this.Le(t instanceof Array ? t : null);
        this.W();
    }
    W() {
        if (this.j) {
            this.j = false;
            this.syncOptions();
        }
    }
    handleCollectionChange() {
        this.syncOptions();
    }
    syncOptions() {
        const t = this.v;
        const e = this.q;
        const i = isArray(t);
        const s = e.matcher ?? defaultMatcher$1;
        const n = e.options;
        let r = n.length;
        while (r-- > 0) {
            const e = n[r];
            const l = gt.call(e, "model") ? e.model : e.value;
            if (i) {
                e.selected = t.findIndex((t => !!s(l, t))) !== -1;
                continue;
            }
            e.selected = !!s(l, t);
        }
    }
    syncValue() {
        const t = this.q;
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
                    h.push(gt.call(r, "model") ? r.model : r.value);
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
                r = gt.call(l, "model") ? l.model : l.value;
                break;
            }
            ++n;
        }
        this.ov = this.v;
        this.v = r;
        return true;
    }
    O() {
        (this.Pe = createMutationObserver(this.q, this.Me.bind(this))).observe(this.q, ss);
        this.Le(this.v instanceof Array ? this.v : null);
        this.iO = true;
    }
    H() {
        this.Pe.disconnect();
        this.Ee?.unsubscribe(this);
        this.Pe = this.Ee = void 0;
        this.iO = false;
    }
    Le(t) {
        this.Ee?.unsubscribe(this);
        this.Ee = void 0;
        if (t != null) {
            if (!this.q.multiple) {
                throw createError(`AUR0654`);
            }
            (this.Ee = this.oL.getArrayObserver(t)).subscribe(this);
        }
    }
    handleEvent() {
        const t = this.syncValue();
        if (t) {
            this.it();
        }
    }
    Me(t) {
        this.syncOptions();
        const e = this.syncValue();
        if (e) {
            this.it();
        }
    }
    it() {
        ns = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, ns);
    }
}

mixinNodeObserverUseConfig(SelectValueObserver);

I(SelectValueObserver);

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
            e[e.length] = gt.call(n, "model") ? n.model : n.value;
        }
        ++s;
    }
    return e;
}

let ns = void 0;

const rs = "--";

class StyleAttributeAccessor {
    constructor(t) {
        this.obj = t;
        this.type = 2 | 4;
        this.v = "";
        this.ov = "";
        this.styles = {};
        this.version = 0;
        this.j = false;
    }
    getValue() {
        return this.obj.style.cssText;
    }
    setValue(t) {
        this.v = t;
        this.j = t !== this.ov;
        this.W();
    }
    De(t) {
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
    $e(t) {
        let e;
        let i;
        const n = [];
        for (i in t) {
            e = t[i];
            if (e == null) {
                continue;
            }
            if (isString(e)) {
                if (i.startsWith(rs)) {
                    n.push([ i, e ]);
                    continue;
                }
                n.push([ s(i), e ]);
                continue;
            }
            n.push(...this.Ue(e));
        }
        return n;
    }
    qe(t) {
        const e = t.length;
        if (e > 0) {
            const i = [];
            let s = 0;
            for (;e > s; ++s) {
                i.push(...this.Ue(t[s]));
            }
            return i;
        }
        return c;
    }
    Ue(t) {
        if (isString(t)) {
            return this.De(t);
        }
        if (t instanceof Array) {
            return this.qe(t);
        }
        if (t instanceof Object) {
            return this.$e(t);
        }
        return c;
    }
    W() {
        if (this.j) {
            this.j = false;
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
                if (!gt.call(e, s) || e[s] !== n) {
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
        this.j = false;
        this.F = false;
        this.q = t;
        this.k = e;
        this.cf = i;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (kt(t, this.v)) {
            return;
        }
        this.ov = this.v;
        this.v = t;
        this.j = true;
        if (!this.cf.readonly) {
            this.W();
        }
    }
    W() {
        if (this.j) {
            this.j = false;
            this.q[this.k] = this.v ?? this.cf.default;
            this.it();
        }
    }
    handleEvent() {
        this.ov = this.v;
        this.v = this.q[this.k];
        if (this.ov !== this.v) {
            this.j = false;
            this.it();
        }
    }
    O() {
        this.v = this.ov = this.q[this.k];
    }
    it() {
        os = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, os);
    }
}

mixinNodeObserverUseConfig(ValueAttributeObserver);

I(ValueAttributeObserver);

let os = void 0;

const ls = "http://www.w3.org/1999/xlink";

const hs = "http://www.w3.org/XML/1998/namespace";

const as = "http://www.w3.org/2000/xmlns/";

const cs = vt(createLookup(), {
    "xlink:actuate": [ "actuate", ls ],
    "xlink:arcrole": [ "arcrole", ls ],
    "xlink:href": [ "href", ls ],
    "xlink:role": [ "role", ls ],
    "xlink:show": [ "show", ls ],
    "xlink:title": [ "title", ls ],
    "xlink:type": [ "type", ls ],
    "xml:lang": [ "lang", hs ],
    "xml:space": [ "space", hs ],
    xmlns: [ "xmlns", as ],
    "xmlns:xlink": [ "xlink", as ]
});

const us = new N;

us.type = 2 | 4;

class NodeObserverLocator {
    constructor(t, e, i, s) {
        this.locator = t;
        this.platform = e;
        this.dirtyChecker = i;
        this.svgAnalyzer = s;
        this.allowDirtyCheck = true;
        this.Fe = createLookup();
        this.Oe = createLookup();
        this.He = createLookup();
        this.Ve = createLookup();
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
        It(j, NodeObserverLocator).register(t);
        _t(j, NodeObserverLocator).register(t);
    }
    handles(t, e) {
        return t instanceof this.platform.Node;
    }
    useConfig(t, e, i) {
        const s = this.Fe;
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
        const i = this.Oe;
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
        if (e in this.Ve || e in (this.He[t.tagName] ?? k)) {
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
            return is;

          default:
            {
                const i = cs[e];
                if (i !== undefined) {
                    return AttributeNSAccessor.forNs(i[1]);
                }
                if (isDataAttribute(t, e, this.svgAnalyzer)) {
                    return is;
                }
                return us;
            }
        }
    }
    overrideAccessor(t, e) {
        var i, s;
        let n;
        if (isString(t)) {
            n = (i = this.He)[t] ?? (i[t] = createLookup());
            n[e] = true;
        } else {
            for (const e in t) {
                for (const i of t[e]) {
                    n = (s = this.He)[e] ?? (s[e] = createLookup());
                    n[i] = true;
                }
            }
        }
    }
    overrideAccessorGlobal(...t) {
        for (const e of t) {
            this.Ve[e] = true;
        }
    }
    getNodeObserverConfig(t, e) {
        return this.Fe[t.tagName]?.[e] ?? this.Oe[e];
    }
    getNodeObserver(t, e, i) {
        const s = this.Fe[t.tagName]?.[e] ?? this.Oe[e];
        let n;
        if (s != null) {
            n = new (s.type ?? ValueAttributeObserver)(t, e, s, i, this.locator);
            if (!n.doNotCache) {
                W(t)[e] = n;
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
        const n = cs[e];
        if (n !== undefined) {
            return AttributeNSAccessor.forNs(n[1]);
        }
        if (isDataAttribute(t, e, this.svgAnalyzer)) {
            return is;
        }
        if (e in t.constructor.prototype) {
            if (this.allowDirtyCheck) {
                return this.dirtyChecker.createProperty(t, e);
            }
            throw createError(`AUR0652:${dt(e)}`);
        } else {
            return new z(t, e);
        }
    }
}

NodeObserverLocator.inject = [ A, Ft, G, Zi ];

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
    throw createError(`AUR0653:${dt(e)}@${t}`);
}

function defaultMatcher(t, e) {
    return t === e;
}

class CheckedObserver {
    constructor(t, e, i, s) {
        this.type = 2 | 1 | 4;
        this.v = void 0;
        this.ov = void 0;
        this.Ne = void 0;
        this.je = void 0;
        this.F = false;
        this.q = t;
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
        this.We();
        this.ze();
        this.it();
    }
    handleCollectionChange() {
        this.ze();
    }
    handleChange(t, e) {
        this.ze();
    }
    ze() {
        const t = this.v;
        const e = this.q;
        const i = gt.call(e, "model") ? e.model : e.value;
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
        const e = this.q;
        const i = gt.call(e, "model") ? e.model : e.value;
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
        this.it();
    }
    O() {
        this.We();
    }
    H() {
        this.Ne?.unsubscribe(this);
        this.je?.unsubscribe(this);
        this.Ne = this.je = void 0;
    }
    it() {
        fs = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, fs);
    }
    We() {
        const t = this.q;
        (this.je ?? (this.je = t.$observers?.model ?? t.$observers?.value))?.subscribe(this);
        this.Ne?.unsubscribe(this);
        this.Ne = void 0;
        if (t.type === "checkbox") {
            (this.Ne = getCollectionObserver(this.v, this.oL))?.subscribe(this);
        }
    }
}

mixinNodeObserverUseConfig(CheckedObserver);

I(CheckedObserver);

let fs = void 0;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) {
            throw createError(`AURxxxx`);
        }
        e.useTargetObserver(is);
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
        this.Ge = e;
    }
    bind(t, e, ...i) {
        if (i.length === 0) {
            throw createError(`AUR0802`);
        }
        if (!(e instanceof PropertyBinding) || !(e.mode & 4)) {
            throw createError(`AUR0803`);
        }
        const s = this.Ge.getNodeObserverConfig(e.target, e.targetProperty);
        if (s == null) {
            {
                throw createError(`AURxxxx`);
            }
        }
        const n = this.Ge.getNodeObserver(e.target, e.targetProperty, this.oL);
        n.useConfig({
            readonly: s.readonly,
            default: s.default,
            events: i
        });
        e.useTargetObserver(n);
    }
}

UpdateTriggerBindingBehavior.inject = [ F, j ];

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
        this.Xe = false;
        this.Ke = 0;
        this.Qe = t;
        this.l = e;
    }
    attaching(t, e) {
        let i;
        const s = this.$controller;
        const n = this.Ke++;
        const isCurrent = () => !this.Xe && this.Ke === n + 1;
        return x(this.pending, (() => {
            if (!isCurrent()) {
                return;
            }
            this.pending = void 0;
            if (this.value) {
                i = this.view = this.ifView = this.cache && this.ifView != null ? this.ifView : this.Qe.create();
            } else {
                i = this.view = this.elseView = this.cache && this.elseView != null ? this.elseView : this.elseFactory?.create();
            }
            if (i == null) {
                return;
            }
            i.setLocation(this.l);
            this.pending = x(i.activate(t, s, s.scope), (() => {
                if (isCurrent()) {
                    this.pending = void 0;
                }
            }));
        }));
    }
    detaching(t, e) {
        this.Xe = true;
        return x(this.pending, (() => {
            this.Xe = false;
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
        const n = this.Ke++;
        const isCurrent = () => !this.Xe && this.Ke === n + 1;
        let r;
        return x(this.pending, (() => this.pending = x(i?.deactivate(i, s), (() => {
            if (!isCurrent()) {
                return;
            }
            if (t) {
                r = this.view = this.ifView = this.cache && this.ifView != null ? this.ifView : this.Qe.create();
            } else {
                r = this.view = this.elseView = this.cache && this.elseView != null ? this.elseView : this.elseFactory?.create();
            }
            if (r == null) {
                return;
            }
            r.setLocation(this.l);
            return x(r.activate(r, s, s.scope), (() => {
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

If.inject = [ Pe, ie ];

__decorate([ bindable ], If.prototype, "value", void 0);

__decorate([ bindable({
    set: t => t === "" || !!t && t !== "false"
}) ], If.prototype, "cache", void 0);

templateController("if")(If);

class Else {
    constructor(t) {
        this.f = t;
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

Else.inject = [ Pe ];

templateController({
    name: "else"
})(Else);

function dispose(t) {
    t.dispose();
}

const ds = [ 18, 17 ];

class Repeat {
    constructor(t, e, i, s, n) {
        this.views = [];
        this.key = null;
        this.Ye = new Map;
        this.Ze = new Map;
        this.Je = void 0;
        this.ti = false;
        this.ei = false;
        this.ii = null;
        this.si = void 0;
        this.ni = false;
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
        this.ri = s;
        this.f = n;
    }
    binding(t, e) {
        const i = this.ri.bindings;
        const s = i.length;
        let n = void 0;
        let r;
        let l = 0;
        for (;s > l; ++l) {
            n = i[l];
            if (n.target === this && n.targetProperty === "items") {
                r = this.forOf = n.ast;
                this.oi = n;
                let t = r.iterable;
                while (t != null && ds.includes(t.$kind)) {
                    t = t.expression;
                    this.ti = true;
                }
                this.ii = t;
                break;
            }
        }
        this.li();
        const h = r.declaration;
        if (!(this.ni = h.$kind === 24 || h.$kind === 25)) {
            this.local = E(h, this.$controller.scope, n, null);
        }
    }
    attaching(t, e) {
        this.hi();
        return this.ai(t);
    }
    detaching(t, e) {
        this.li();
        return this.ui(t);
    }
    unbinding(t, e) {
        this.Ze.clear();
        this.Ye.clear();
    }
    itemsChanged() {
        if (!this.$controller.isActive) {
            return;
        }
        this.li();
        this.hi();
        this.fi(this.items, void 0);
    }
    handleCollectionChange(t, e) {
        const i = this.$controller;
        if (!i.isActive) {
            return;
        }
        if (this.ti) {
            if (this.ei) {
                return;
            }
            this.ei = true;
            this.items = E(this.forOf.iterable, i.scope, this.oi, null);
            this.ei = false;
            return;
        }
        this.hi();
        this.fi(t, e);
    }
    fi(t, e) {
        const i = this.views;
        const s = i.length;
        const n = this.key;
        const r = n !== null;
        if (r || e === void 0) {
            const t = this.local;
            const l = this.si;
            const h = l.length;
            const a = this.forOf;
            const c = a.declaration;
            const u = this.oi;
            const f = this.ni;
            e = X(h);
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
                const C = this.Ye;
                const R = this.Ze;
                const B = this.$controller.scope;
                d = 0;
                t: {
                    while (true) {
                        if (r) {
                            g = m[d];
                            p = l[d];
                            v = getKeyValue(C, n, g, getScope(R, g, a, B, u, t, f), u);
                            b = getKeyValue(C, n, p, getScope(R, p, a, B, u, t, f), u);
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
                            v = getKeyValue(C, n, g, getScope(R, g, a, B, u, t, f), u);
                            b = getKeyValue(C, n, p, getScope(R, p, a, B, u, t, f), u);
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
                const S = d;
                const _ = d;
                for (d = _; d <= y; ++d) {
                    if (C.has(p = r ? l[d] : ensureUnique(l[d], d))) {
                        b = C.get(p);
                    } else {
                        b = r ? getKeyValue(C, n, p, getScope(R, p, a, B, u, t, f), u) : p;
                        C.set(p, b);
                    }
                    A.set(b, d);
                }
                for (d = S; d <= w; ++d) {
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
            const t = x(this.ui(null), (() => this.ai(null)));
            if (isPromise(t)) {
                t.catch(rethrow);
            }
        } else {
            const t = K(e);
            if (t.deletedIndices.length > 0) {
                const e = x(this.di(t), (() => this.mi(s, t)));
                if (isPromise(e)) {
                    e.catch(rethrow);
                }
            } else {
                this.mi(s, t);
            }
        }
    }
    li() {
        const t = this.$controller.scope;
        let e = this.gi;
        let i = this.ti;
        let s;
        if (i) {
            e = this.gi = E(this.ii, t, this.oi, null) ?? null;
            i = this.ti = !kt(this.items, e);
        }
        const n = this.Je;
        if (this.$controller.isActive) {
            s = this.Je = Q(i ? e : this.items);
            if (n !== s) {
                n?.unsubscribe(this);
                s?.subscribe(this);
            }
        } else {
            n?.unsubscribe(this);
            this.Je = undefined;
        }
    }
    hi() {
        const {items: t} = this;
        if (isArray(t)) {
            this.si = t;
            return;
        }
        const e = [];
        iterate(t, ((t, i) => {
            e[i] = t;
        }));
        this.si = e;
    }
    ai(t) {
        let e = void 0;
        let i;
        let s;
        let n;
        const {$controller: r, f: l, local: h, l: a, items: c, Ze: u, oi: f, forOf: d, ni: m} = this;
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
    ui(t) {
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
    di(t) {
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
    mi(t, e) {
        let i = void 0;
        let s;
        let n;
        let r;
        let l = 0;
        const {$controller: h, f: a, local: c, si: u, l: f, views: d, ni: m, oi: g, Ze: p, forOf: v} = this;
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
        Y(d, e);
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

Repeat.inject = [ Ue, q, ie, bi, Pe ];

__decorate([ bindable ], Repeat.prototype, "items", void 0);

templateController("repeat")(Repeat);

let ms = 16;

let gs = new Int32Array(ms);

let ps = new Int32Array(ms);

function longestIncreasingSubsequence(t) {
    const e = t.length;
    if (e > ms) {
        ms = e;
        gs = new Int32Array(e);
        ps = new Int32Array(e);
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
            l = gs[i];
            n = t[l];
            if (n !== -2 && n < s) {
                ps[r] = l;
                gs[++i] = r;
                continue;
            }
            h = 0;
            a = i;
            while (h < a) {
                c = h + a >> 1;
                n = t[gs[c]];
                if (n !== -2 && n < s) {
                    h = c + 1;
                } else {
                    a = c;
                }
            }
            n = t[gs[h]];
            if (s < n || n === -2) {
                if (h > 0) {
                    ps[r] = gs[h - 1];
                }
                gs[h] = r;
            }
        }
    }
    r = ++i;
    const u = new Int32Array(r);
    s = gs[i - 1];
    while (i-- > 0) {
        u[i] = s;
        s = ps[s];
    }
    while (r-- > 0) gs[r] = 0;
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

const vs = mt.toString;

const getCount = t => {
    switch (vs.call(t)) {
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
        throw createError(`Cannot count ${vs.call(t)}`);
    }
};

const iterate = (t, e) => {
    switch (vs.call(t)) {
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
        throw createError(`Cannot iterate over ${vs.call(t)}`);
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
            U(i.declaration, h = O.fromParent(s, new Z), n, e);
        } else {
            h = O.fromParent(s, new Z(r, e));
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
    constructor(t, e) {
        this.view = t.create().setLocation(e);
    }
    valueChanged(t, e) {
        const i = this.$controller;
        const s = this.view.bindings;
        let n;
        let r = 0, l = 0;
        if (i.isActive && s != null) {
            n = O.fromParent(i.scope, t === void 0 ? {} : t);
            for (l = s.length; l > r; ++r) {
                s[r].bind(n);
            }
        }
    }
    attaching(t, e) {
        const {$controller: i, value: s} = this;
        const n = O.fromParent(i.scope, s === void 0 ? {} : s);
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

With.inject = [ Pe, ie ];

__decorate([ bindable ], With.prototype, "value", void 0);

templateController("with")(With);

let bs = class Switch {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.cases = [];
        this.activeCases = [];
        this.promise = void 0;
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
        this.queue((() => this.pi(t)));
    }
    pi(t) {
        const e = t.isMatch(this.value);
        const i = this.activeCases;
        const s = i.length;
        if (!e) {
            if (s > 0 && i[0].id === t.id) {
                return this.vi(null);
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
        return x(this.vi(null, n), (() => {
            this.activeCases = n;
            return this.bi(null);
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
        return x(this.activeCases.length > 0 ? this.vi(t, i) : void 0, (() => {
            this.activeCases = i;
            if (i.length === 0) {
                return;
            }
            return this.bi(t);
        }));
    }
    bi(t) {
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
        return b(...i.map((e => e.activate(t, n))));
    }
    vi(t, e = []) {
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
        return x(b(...i.reduce(((i, s) => {
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
        i = this.promise = x(x(e, t), (() => {
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

__decorate([ bindable ], bs.prototype, "value", void 0);

bs = __decorate([ templateController("switch"), __param(0, Pe), __param(1, ie) ], bs);

let xs = 0;

let ws = class Case {
    constructor(t, e, i, s) {
        this.f = t;
        this.xi = e;
        this.l = i;
        this.id = ++xs;
        this.fallThrough = false;
        this.view = void 0;
        this.wi = s.config.level <= 1;
        this.yi = s.scopeTo(`${this.constructor.name}-#${this.id}`);
    }
    link(t, e, i, s) {
        const n = t.parent;
        const r = n?.viewModel;
        if (r instanceof bs) {
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
        this.yi.debug("isMatch()");
        const e = this.value;
        if (isArray(e)) {
            if (this.Je === void 0) {
                this.Je = this.ki(e);
            }
            return e.includes(t);
        }
        return e === t;
    }
    valueChanged(t, e) {
        if (isArray(t)) {
            this.Je?.unsubscribe(this);
            this.Je = this.ki(t);
        } else if (this.Je !== void 0) {
            this.Je.unsubscribe(this);
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
        this.Je?.unsubscribe(this);
        this.view?.dispose();
        this.view = void 0;
    }
    linkToSwitch(t) {
        t.cases.push(this);
    }
    ki(t) {
        const e = this.xi.getArrayObserver(t);
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

ws.inject = [ Pe, F, ie, C ];

__decorate([ bindable ], ws.prototype, "value", void 0);

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
}) ], ws.prototype, "fallThrough", void 0);

ws = __decorate([ templateController("case") ], ws);

let ys = class DefaultCase extends ws {
    linkToSwitch(t) {
        if (t.defaultCase !== void 0) {
            throw createError(`AUR0816`);
        }
        t.defaultCase = this;
    }
};

ys = __decorate([ templateController("default-case") ], ys);

let ks = class PromiseTemplateController {
    constructor(t, e, i, s) {
        this.f = t;
        this.l = e;
        this.p = i;
        this.preSettledTask = null;
        this.postSettledTask = null;
        this.logger = s.scopeTo("promise.resolve");
    }
    link(t, e, i, s) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(t, e) {
        const i = this.view;
        const s = this.$controller;
        return x(i.activate(t, s, this.viewScope = O.fromParent(s.scope, {})), (() => this.swap(t)));
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
            this.logger.warn(`The value '${dt(e)}' is not a promise. No change will be done.`);
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
            void b(h = (this.preSettledTask = i.queueTask((() => b(s?.deactivate(t), n?.deactivate(t), r?.activate(t, l))), a)).result.catch((t => {
                if (!(t instanceof et)) throw t;
            })), e.then((c => {
                if (this.value !== e) {
                    return;
                }
                const fulfill = () => {
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => b(r?.deactivate(t), n?.deactivate(t), s?.activate(t, l, c))), a)).result;
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
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => b(r?.deactivate(t), s?.deactivate(t), n?.activate(t, l, c))), a)).result;
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

__decorate([ bindable ], ks.prototype, "value", void 0);

ks = __decorate([ templateController("promise"), __param(0, Pe), __param(1, ie), __param(2, Ft), __param(3, C) ], ks);

let As = class PendingTemplateController {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.view = void 0;
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

As = __decorate([ templateController("pending"), __param(0, Pe), __param(1, ie) ], As);

let Cs = class FulfilledTemplateController {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.view = void 0;
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
}) ], Cs.prototype, "value", void 0);

Cs = __decorate([ templateController("then"), __param(0, Pe), __param(1, ie) ], Cs);

let Rs = class RejectedTemplateController {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.view = void 0;
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
}) ], Rs.prototype, "value", void 0);

Rs = __decorate([ templateController("catch"), __param(0, Pe), __param(1, ie) ], Rs);

function getPromiseController(t) {
    const e = t.parent;
    const i = e?.viewModel;
    if (i instanceof ks) {
        return i;
    }
    throw createError(`AUR0813`);
}

let Bs = class PromiseAttributePattern {
    "promise.resolve"(t, e, i) {
        return new AttrSyntax(t, e, "promise", "bind");
    }
};

Bs = __decorate([ attributePattern({
    pattern: "promise.resolve",
    symbols: ""
}) ], Bs);

let Ss = class FulfilledAttributePattern {
    then(t, e, i) {
        return new AttrSyntax(t, e, "then", "from-view");
    }
};

Ss = __decorate([ attributePattern({
    pattern: "then",
    symbols: ""
}) ], Ss);

let _s = class RejectedAttributePattern {
    catch(t, e, i) {
        return new AttrSyntax(t, e, "catch", "from-view");
    }
};

_s = __decorate([ attributePattern({
    pattern: "catch",
    symbols: ""
}) ], _s);

class Focus {
    constructor(t, e) {
        this.Ai = false;
        this.Ci = t;
        this.p = e;
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) {
            this.Ri();
        } else {
            this.Ai = true;
        }
    }
    attached() {
        if (this.Ai) {
            this.Ai = false;
            this.Ri();
        }
        this.Ci.addEventListener("focus", this);
        this.Ci.addEventListener("blur", this);
    }
    detaching() {
        const t = this.Ci;
        t.removeEventListener("focus", this);
        t.removeEventListener("blur", this);
    }
    handleEvent(t) {
        if (t.type === "focus") {
            this.value = true;
        } else if (!this.Bi) {
            this.value = false;
        }
    }
    Ri() {
        const t = this.Ci;
        const e = this.Bi;
        const i = this.value;
        if (i && !e) {
            t.focus();
        } else if (!i && e) {
            t.blur();
        }
    }
    get Bi() {
        return this.Ci === this.p.document.activeElement;
    }
}

Focus.inject = [ te, Ft ];

__decorate([ bindable({
    mode: 6
}) ], Focus.prototype, "value", void 0);

customAttribute("focus")(Focus);

class Portal {
    constructor(t, e, i) {
        this.position = "beforeend";
        this.strict = false;
        this.p = i;
        this.Si = i.document.createElement("div");
        (this.view = t.create()).setLocation(this._i = createLocation(i));
        setEffectiveParentNode(this.view.nodes, e);
    }
    attaching(t) {
        if (this.callbackContext == null) {
            this.callbackContext = this.$controller.scope.bindingContext;
        }
        const e = this.Si = this.Ii();
        this.Ti(e, this.position);
        return this.Ei(t, e);
    }
    detaching(t) {
        return this.Pi(t, this.Si);
    }
    targetChanged() {
        const {$controller: t} = this;
        if (!t.isActive) {
            return;
        }
        const e = this.Ii();
        if (this.Si === e) {
            return;
        }
        this.Si = e;
        const i = x(this.Pi(null, e), (() => {
            this.Ti(e, this.position);
            return this.Ei(null, e);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    positionChanged() {
        const {$controller: t, Si: e} = this;
        if (!t.isActive) {
            return;
        }
        const i = x(this.Pi(null, e), (() => {
            this.Ti(e, this.position);
            return this.Ei(null, e);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    Ei(t, e) {
        const {activating: i, callbackContext: s, view: n} = this;
        return x(i?.call(s, e, n), (() => this.Li(t, e)));
    }
    Li(t, e) {
        const {$controller: i, view: s} = this;
        if (t === null) {
            s.nodes.insertBefore(this._i);
        } else {
            return x(s.activate(t ?? s, i, i.scope), (() => this.Mi(e)));
        }
        return this.Mi(e);
    }
    Mi(t) {
        const {activated: e, callbackContext: i, view: s} = this;
        return e?.call(i, t, s);
    }
    Pi(t, e) {
        const {deactivating: i, callbackContext: s, view: n} = this;
        return x(i?.call(s, e, n), (() => this.Di(t, e)));
    }
    Di(t, e) {
        const {$controller: i, view: s} = this;
        if (t === null) {
            s.nodes.remove();
        } else {
            return x(s.deactivate(t, i), (() => this.$i(e)));
        }
        return this.$i(e);
    }
    $i(t) {
        const {deactivated: e, callbackContext: i, view: s} = this;
        return e?.call(i, t, s);
    }
    Ii() {
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
    Ti(t, e) {
        const i = this._i;
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

Portal.inject = [ Pe, ie, Ft ];

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
    static get inject() {
        return [ ie, Ue, xi, ci ];
    }
    constructor(t, e, i, s) {
        this.Ui = null;
        this.qi = null;
        this.Fi = false;
        this.expose = null;
        this.slotchange = null;
        this.Oi = new Set;
        this.Je = null;
        let n;
        let r;
        const l = e.auSlot;
        const h = i.instruction?.projections?.[l.name];
        const a = i.controller;
        this.name = l.name;
        if (h == null) {
            n = s.getViewFactory(l.fallback, a.container);
            this.Hi = false;
        } else {
            r = i.parent.controller.container.createChild();
            registerResolver(r, a.definition.Type, new p(void 0, a.viewModel));
            n = s.getViewFactory(h, r);
            this.Hi = true;
            this.Vi = a.container.getAll(Me, false)?.filter((t => t.slotName === "*" || t.slotName === l.name)) ?? c;
        }
        this.Ni = (this.Vi ?? (this.Vi = c)).length > 0;
        this.ji = i;
        this.view = n.create().setLocation(this.l = t);
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
        this.Oi.add(t);
    }
    unsubscribe(t) {
        this.Oi.delete(t);
    }
    binding(t, e) {
        this.Ui = this.$controller.scope.parent;
        let i;
        if (this.Hi) {
            i = this.ji.controller.scope.parent;
            (this.qi = O.fromParent(i, i.bindingContext)).overrideContext.$host = this.expose ?? this.Ui.bindingContext;
        }
    }
    attaching(t, e) {
        return x(this.view.activate(t, this.$controller, this.Hi ? this.qi : this.Ui), (() => {
            if (this.Ni) {
                this.Vi.forEach((t => t.watch(this)));
                this.We();
                this.Wi();
                this.Fi = true;
            }
        }));
    }
    detaching(t, e) {
        this.Fi = false;
        this.zi();
        this.Vi.forEach((t => t.unwatch(this)));
        return this.view.deactivate(t, this.$controller);
    }
    exposeChanged(t) {
        if (this.Hi && this.qi != null) {
            this.qi.overrideContext.$host = t;
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
    We() {
        if (this.Je != null) {
            return;
        }
        const t = this.l;
        const e = t.parentElement;
        if (e == null) {
            return;
        }
        (this.Je = createMutationObserver(e, (e => {
            if (isMutationWithinLocation(t, e)) {
                this.Wi();
            }
        }))).observe(e, {
            childList: true
        });
    }
    zi() {
        this.Je?.disconnect();
        this.Je = null;
    }
    Wi() {
        const t = this.nodes;
        const e = new Set(this.Oi);
        let i;
        if (this.Fi) {
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

var Ts;

(function(t) {
    t[t["Element"] = 1] = "Element";
    t[t["Attribute"] = 2] = "Attribute";
})(Ts || (Ts = {}));

class AuCompose {
    static get inject() {
        return [ g, bi, te, ie, Ft, Ue, R(CompositionContextFactory) ];
    }
    get pending() {
        return this.Gi;
    }
    get composition() {
        return this.Xi;
    }
    constructor(t, e, i, s, n, r, l) {
        this.c = t;
        this.parent = e;
        this.host = i;
        this.l = s;
        this.p = n;
        this.scopeBehavior = "auto";
        this.Xi = void 0;
        this.r = t.get(ci);
        this.Ki = r;
        this.Qi = l;
    }
    attaching(t, e) {
        return this.Gi = x(this.queue(new ChangeInfo(this.template, this.component, this.model, void 0), t), (t => {
            if (this.Qi.isCurrent(t)) {
                this.Gi = void 0;
            }
        }));
    }
    detaching(t) {
        const e = this.Xi;
        const i = this.Gi;
        this.Qi.invalidate();
        this.Xi = this.Gi = void 0;
        return x(i, (() => e?.deactivate(t)));
    }
    propertyChanged(t) {
        if (t === "model" && this.Xi != null) {
            this.Xi.update(this.model);
            return;
        }
        this.Gi = x(this.Gi, (() => x(this.queue(new ChangeInfo(this.template, this.component, this.model, t), void 0), (t => {
            if (this.Qi.isCurrent(t)) {
                this.Gi = void 0;
            }
        }))));
    }
    queue(t, e) {
        const i = this.Qi;
        const s = this.Xi;
        return x(i.create(t), (t => {
            if (i.isCurrent(t)) {
                return x(this.compose(t), (n => {
                    if (i.isCurrent(t)) {
                        return x(n.activate(e), (() => {
                            if (i.isCurrent(t)) {
                                this.Xi = n;
                                return x(s?.deactivate(e), (() => t));
                            } else {
                                return x(n.controller.deactivate(n.controller, this.$controller), (() => {
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
        const {Yi: n, Zi: r, Ji: l} = t.change;
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
            e = this.ts(d, r, i);
        } else {
            i = u == null ? a : u;
            e = this.ts(d, r, i);
        }
        const compose = () => {
            if (f !== null) {
                const n = Controller.$el(d, e, i, {
                    projections: this.Ki.projections
                }, f);
                return new CompositionController(n, (t => n.activate(t ?? n, c, c.scope.parent)), (t => x(n.deactivate(t ?? n, c), s)), (t => e.activate?.(t)), t);
            } else {
                const s = CustomElementDefinition.create({
                    name: Qt.generateName(),
                    template: n
                });
                const r = this.r.getViewFactory(s, d);
                const l = Controller.$view(r, c);
                const h = this.scopeBehavior === "auto" ? O.fromParent(this.parent.scope, e) : O.create(e);
                if (isRenderLocation(i)) {
                    l.setLocation(i);
                } else {
                    l.setHost(i);
                }
                return new CompositionController(l, (t => l.activate(t ?? l, c, h)), (t => l.deactivate(t ?? l, c)), (t => e.activate?.(t)), t);
            }
        };
        if ("activate" in e) {
            return x(e.activate(l), (() => compose()));
        } else {
            return compose();
        }
    }
    ts(t, e, i) {
        if (e == null) {
            return new EmptyComponent;
        }
        if (typeof e === "object") {
            return e;
        }
        const s = this.p;
        const n = isRenderLocation(i);
        registerResolver(t, s.Element, registerResolver(t, te, new p("ElementResolver", n ? null : i)));
        registerResolver(t, ie, new p("IRenderLocation", n ? i : null));
        const r = t.invoke(e);
        registerResolver(t, e, new p("au-compose.component", r));
        return r;
    }
    getDef(t) {
        const e = isFunction(t) ? t : t?.constructor;
        return Qt.isType(e) ? Qt.getDefinition(e) : null;
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
        return x(t.load(), (t => new CompositionContext(++this.id, t)));
    }
    invalidate() {
        this.id++;
    }
}

class ChangeInfo {
    constructor(t, e, i, s) {
        this.Yi = t;
        this.Zi = e;
        this.Ji = i;
        this.es = s;
    }
    load() {
        if (isPromise(this.Yi) || isPromise(this.Zi)) {
            return Promise.all([ this.Yi, this.Zi ]).then((([t, e]) => new LoadedChangeInfo(t, e, this.Ji, this.es)));
        } else {
            return new LoadedChangeInfo(this.Yi, this.Zi, this.Ji, this.es);
        }
    }
}

class LoadedChangeInfo {
    constructor(t, e, i, s) {
        this.Yi = t;
        this.Zi = e;
        this.Ji = i;
        this.es = s;
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

const Es = /*@__PURE__*/ St("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw createError('"sanitize" method not implemented');
    }
})));

let Ps = class SanitizeValueConverter {
    constructor(t) {
        this.ss = t;
    }
    toView(t) {
        if (t == null) {
            return null;
        }
        return this.ss.sanitize(t);
    }
};

Ps = __decorate([ __param(0, Es) ], Ps);

valueConverter("sanitize")(Ps);

const Ls = /*@__PURE__*/ St("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const Ms = {};

class TemplateElementFactory {
    constructor(t) {
        this.p = t;
        this.Yi = createTemplate(this.p);
    }
    createTemplate(t) {
        if (isString(t)) {
            let e = Ms[t];
            if (e === void 0) {
                const i = this.Yi;
                i.innerHTML = t;
                const s = i.content.firstElementChild;
                if (s == null || s.nodeName !== "TEMPLATE" || s.nextElementSibling != null) {
                    this.Yi = createTemplate(this.p);
                    e = i;
                } else {
                    i.content.removeChild(s);
                    e = s;
                }
                Ms[t] = e;
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

TemplateElementFactory.inject = [ Ft ];

const createTemplate = t => t.document.createElement("template");

class TemplateCompiler {
    constructor() {
        this.debug = false;
        this.resolveResources = true;
    }
    static register(t) {
        return _t(qe, this).register(t);
    }
    compile(t, e, i) {
        const s = CustomElementDefinition.getOrCreate(t);
        if (s.template === null || s.template === void 0) {
            return s;
        }
        if (s.needsCompile === false) {
            return s;
        }
        i ?? (i = Os);
        const n = new CompilationContext(t, e, i, null, null, void 0);
        const r = isString(s.template) || !t.enhance ? n.rs.createTemplate(s.template) : s.template;
        const l = r.nodeName === Us && r.content != null;
        const h = l ? r.content : r;
        const a = e.get(allResources(Xs));
        const u = a.length;
        let f = 0;
        if (u > 0) {
            while (u > f) {
                a[f].compiling?.(r);
                ++f;
            }
        }
        if (r.hasAttribute(Gs)) {
            throw createError(`AUR0701`);
        }
        this.os(h, n);
        this.ls(h, n);
        return CustomElementDefinition.create({
            ...t,
            name: t.name || Xt(),
            dependencies: (t.dependencies ?? c).concat(n.deps ?? c),
            instructions: n.rows,
            surrogates: l ? this.cs(r, n) : c,
            template: r,
            hasSlots: n.hasSlot,
            needsCompile: false
        });
    }
    compileSpread(t, e, i, s) {
        const n = new CompilationContext(t, i, Os, null, null, void 0);
        const r = [];
        const l = n.us(s.nodeName.toLowerCase());
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
        let k;
        let A;
        let C;
        for (;c > u; ++u) {
            f = e[u];
            A = f.target;
            C = f.rawValue;
            x = n.ds(f);
            if (x !== null && (x.type & 1) > 0) {
                Vs.node = s;
                Vs.attr = f;
                Vs.bindable = null;
                Vs.def = null;
                r.push(x.build(Vs, n.ep, n.m));
                continue;
            }
            d = n.gs(A);
            if (d !== null) {
                if (d.isTemplateController) {
                    throw createError(`AUR0703:${A}`);
                }
                p = BindablesInfo.from(d, true);
                k = d.noMultiBindings === false && x === null && hasInlineBindings(C);
                if (k) {
                    g = this.ps(s, C, d, n);
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
                    r.push(new InterpolationInstruction(w, n.m.map(s, A) ?? y(A)));
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
    cs(t, e) {
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
        let k;
        for (;r > l; ++l) {
            h = s[l];
            a = h.name;
            c = h.value;
            u = e.Re.parse(a, c);
            w = u.target;
            k = u.rawValue;
            if (Ns[w]) {
                throw createError(`AUR0702:${a}`);
            }
            v = e.ds(u);
            if (v !== null && (v.type & 1) > 0) {
                Vs.node = t;
                Vs.attr = u;
                Vs.bindable = null;
                Vs.def = null;
                i.push(v.build(Vs, e.ep, e.m));
                continue;
            }
            f = e.gs(w);
            if (f !== null) {
                if (f.isTemplateController) {
                    throw createError(`AUR0703:${w}`);
                }
                g = BindablesInfo.from(f, true);
                x = f.noMultiBindings === false && v === null && hasInlineBindings(k);
                if (x) {
                    m = this.ps(t, k, f, e);
                } else {
                    p = g.primary;
                    if (v === null) {
                        b = n.parse(k, 1);
                        m = [ b === null ? new SetPropertyInstruction(k, p.property) : new InterpolationInstruction(b, p.property) ];
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
                b = n.parse(k, 1);
                if (b != null) {
                    t.removeAttribute(a);
                    --l;
                    --r;
                    i.push(new InterpolationInstruction(b, e.m.map(t, w) ?? y(w)));
                } else {
                    switch (a) {
                      case "class":
                        i.push(new SetClassAttributeInstruction(k));
                        break;

                      case "style":
                        i.push(new SetStyleAttributeInstruction(k));
                        break;

                      default:
                        i.push(new SetAttributeInstruction(k, a));
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
    ls(t, e) {
        switch (t.nodeType) {
          case 1:
            switch (t.nodeName) {
              case "LET":
                return this.vs(t, e);

              default:
                return this.bs(t, e);
            }

          case 3:
            return this.xs(t, e);

          case 11:
            {
                let i = t.firstChild;
                while (i !== null) {
                    i = this.ls(i, e);
                }
                break;
            }
        }
        return t.nextSibling;
    }
    vs(t, e) {
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
            c = e.Re.parse(u, f);
            m = c.target;
            g = c.rawValue;
            d = e.ds(c);
            if (d !== null) {
                if (c.command === "bind") {
                    n.push(new LetBindingInstruction(r.parse(g, 16), y(m)));
                } else {
                    throw createError(`AUR0704:${c.command}`);
                }
                continue;
            }
            p = r.parse(g, 1);
            n.push(new LetBindingInstruction(p === null ? new J(g) : p, y(m)));
        }
        e.rows.push([ new HydrateLetElementInstruction(n, l) ]);
        return this.ws(t).nextSibling;
    }
    bs(t, e) {
        var i, s, r, l;
        const h = t.nextSibling;
        const a = (t.getAttribute("as-element") ?? t.nodeName).toLowerCase();
        const u = e.us(a);
        const f = u !== null;
        const d = f && u.shadowOptions != null;
        const m = u?.capture;
        const g = m != null && typeof m !== "boolean";
        const p = m ? [] : c;
        const v = e.ep;
        const b = this.debug ? n : () => {
            t.removeAttribute(R);
            --A;
            --k;
        };
        let x = t.attributes;
        let w;
        let k = x.length;
        let A = 0;
        let C;
        let R;
        let B;
        let S;
        let _;
        let I;
        let T = null;
        let E = false;
        let P;
        let L;
        let M;
        let D;
        let $;
        let U;
        let q;
        let F = null;
        let O;
        let H;
        let V;
        let N;
        let j = true;
        let W = false;
        let z = false;
        if (a === "slot") {
            if (e.root.def.shadowOptions == null) {
                throw createError(`AUR0717:${e.root.def.name}`);
            }
            e.root.hasSlot = true;
        }
        if (f) {
            j = u.processContent?.call(u.Type, t, e.p);
            x = t.attributes;
            k = x.length;
        }
        if (e.root.def.enhance && t.classList.contains("au")) {
            throw createError(`AUR0705`);
        }
        for (;k > A; ++A) {
            C = x[A];
            R = C.name;
            B = C.value;
            switch (R) {
              case "as-element":
              case "containerless":
                b();
                if (!W) {
                    W = R === "containerless";
                }
                continue;
            }
            S = e.Re.parse(R, B);
            F = e.ds(S);
            V = S.target;
            N = S.rawValue;
            if (m && (!g || g && m(V))) {
                if (F != null && F.type & 1) {
                    b();
                    p.push(S);
                    continue;
                }
                z = V !== Js && V !== "slot";
                if (z) {
                    O = BindablesInfo.from(u, false);
                    if (O.attrs[V] == null && !e.gs(V)?.isTemplateController) {
                        b();
                        p.push(S);
                        continue;
                    }
                }
            }
            if (F !== null && F.type & 1) {
                Vs.node = t;
                Vs.attr = S;
                Vs.bindable = null;
                Vs.def = null;
                (_ ?? (_ = [])).push(F.build(Vs, e.ep, e.m));
                b();
                continue;
            }
            T = e.gs(V);
            if (T !== null) {
                O = BindablesInfo.from(T, true);
                E = T.noMultiBindings === false && F === null && hasInlineBindings(N);
                if (E) {
                    M = this.ps(t, N, T, e);
                } else {
                    H = O.primary;
                    if (F === null) {
                        U = v.parse(N, 1);
                        M = [ U === null ? new SetPropertyInstruction(N, H.property) : new InterpolationInstruction(U, H.property) ];
                    } else {
                        Vs.node = t;
                        Vs.attr = S;
                        Vs.bindable = H;
                        Vs.def = T;
                        M = [ F.build(Vs, e.ep, e.m) ];
                    }
                }
                b();
                if (T.isTemplateController) {
                    (D ?? (D = [])).push(new HydrateTemplateController(Hs, this.resolveResources ? T : T.name, void 0, M));
                } else {
                    (L ?? (L = [])).push(new HydrateAttributeInstruction(this.resolveResources ? T : T.name, T.aliases != null && T.aliases.includes(V) ? V : void 0, M));
                }
                continue;
            }
            if (F === null) {
                if (f) {
                    O = BindablesInfo.from(u, false);
                    P = O.attrs[V];
                    if (P !== void 0) {
                        U = v.parse(N, 1);
                        (I ?? (I = [])).push(U == null ? new SetPropertyInstruction(N, P.property) : new InterpolationInstruction(U, P.property));
                        b();
                        continue;
                    }
                }
                U = v.parse(N, 1);
                if (U != null) {
                    b();
                    (_ ?? (_ = [])).push(new InterpolationInstruction(U, e.m.map(t, V) ?? y(V)));
                }
                continue;
            }
            b();
            if (f) {
                O = BindablesInfo.from(u, false);
                P = O.attrs[V];
                if (P !== void 0) {
                    Vs.node = t;
                    Vs.attr = S;
                    Vs.bindable = P;
                    Vs.def = u;
                    (I ?? (I = [])).push(F.build(Vs, e.ep, e.m));
                    continue;
                }
            }
            Vs.node = t;
            Vs.attr = S;
            Vs.bindable = null;
            Vs.def = null;
            (_ ?? (_ = [])).push(F.build(Vs, e.ep, e.m));
        }
        resetCommandBuildInfo();
        if (this.ys(t, _) && _ != null && _.length > 1) {
            this.ks(t, _);
        }
        if (f) {
            q = new HydrateElementInstruction(this.resolveResources ? u : u.name, void 0, I ?? c, null, W, p);
            if (a === Js) {
                const i = t.getAttribute("name") || Zs;
                const s = e.t();
                const n = e.As();
                let r = t.firstChild;
                while (r !== null) {
                    if (r.nodeType === 1 && r.hasAttribute(Js)) {
                        t.removeChild(r);
                    } else {
                        appendToTemplate(s, r);
                    }
                    r = t.firstChild;
                }
                this.ls(s.content, n);
                q.auSlot = {
                    name: i,
                    fallback: CustomElementDefinition.create({
                        name: Xt(),
                        template: s,
                        instructions: n.rows,
                        needsCompile: false
                    })
                };
                t = this.Cs(t, e);
            }
        }
        if (_ != null || q != null || L != null) {
            w = c.concat(q ?? c, L ?? c, _ ?? c);
            this.ws(t);
        }
        let G;
        if (D != null) {
            k = D.length - 1;
            A = k;
            $ = D[A];
            let n;
            if (isMarker(t)) {
                n = e.t();
                appendManyToTemplate(n, [ e.Rs(qs), e.Rs(Fs), this.ws(e.h($s)) ]);
            } else {
                this.Cs(t, e);
                if (t.nodeName === "TEMPLATE") {
                    n = t;
                } else {
                    n = e.t();
                    appendToTemplate(n, t);
                }
            }
            const r = n;
            const l = e.As(w == null ? [] : [ w ]);
            let h;
            let c;
            let m;
            let g;
            let p;
            let v;
            let b;
            let x;
            let y = 0, C = 0;
            let R = t.firstChild;
            let B = false;
            if (j !== false) {
                while (R !== null) {
                    c = R.nodeType === 1 ? R.getAttribute(Js) : null;
                    if (c !== null) {
                        R.removeAttribute(Js);
                    }
                    if (f) {
                        h = R.nextSibling;
                        if (!d) {
                            B = R.nodeType === 3 && R.textContent.trim() === "";
                            if (!B) {
                                ((i = g ?? (g = {}))[s = c || Zs] ?? (i[s] = [])).push(R);
                            }
                            t.removeChild(R);
                        }
                        R = h;
                    } else {
                        if (c !== null) {
                            c = c || Zs;
                            throw createError(`AUR0706:${a}[${c}]`);
                        }
                        R = R.nextSibling;
                    }
                }
            }
            if (g != null) {
                m = {};
                for (c in g) {
                    n = e.t();
                    p = g[c];
                    for (y = 0, C = p.length; C > y; ++y) {
                        v = p[y];
                        if (v.nodeName === "TEMPLATE") {
                            if (v.attributes.length > 0) {
                                appendToTemplate(n, v);
                            } else {
                                appendToTemplate(n, v.content);
                            }
                        } else {
                            appendToTemplate(n, v);
                        }
                    }
                    x = e.As();
                    this.ls(n.content, x);
                    m[c] = CustomElementDefinition.create({
                        name: Xt(),
                        template: n,
                        instructions: x.rows,
                        needsCompile: false,
                        isStrictBinding: e.root.def.isStrictBinding
                    });
                }
                q.projections = m;
            }
            if (f && (W || u.containerless)) {
                this.Cs(t, e);
            }
            G = !f || !u.containerless && !W && j !== false;
            if (G) {
                if (t.nodeName === Us) {
                    this.ls(t.content, l);
                } else {
                    R = t.firstChild;
                    while (R !== null) {
                        R = this.ls(R, l);
                    }
                }
            }
            $.def = CustomElementDefinition.create({
                name: Xt(),
                template: r,
                instructions: l.rows,
                needsCompile: false,
                isStrictBinding: e.root.def.isStrictBinding
            });
            while (A-- > 0) {
                $ = D[A];
                n = e.t();
                b = this.ws(e.h($s));
                appendManyToTemplate(n, [ e.Rs(qs), e.Rs(Fs), b ]);
                $.def = CustomElementDefinition.create({
                    name: Xt(),
                    template: n,
                    needsCompile: false,
                    instructions: [ [ D[A + 1] ] ],
                    isStrictBinding: e.root.def.isStrictBinding
                });
            }
            e.rows.push([ $ ]);
        } else {
            if (w != null) {
                e.rows.push(w);
            }
            let i = t.firstChild;
            let s;
            let n;
            let h = null;
            let c;
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
                                ((r = c ?? (c = {}))[l = n || Zs] ?? (r[l] = [])).push(i);
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
            if (c != null) {
                h = {};
                for (n in c) {
                    p = e.t();
                    m = c[n];
                    for (x = 0, y = m.length; y > x; ++x) {
                        g = m[x];
                        if (g.nodeName === Us) {
                            if (g.attributes.length > 0) {
                                appendToTemplate(p, g);
                            } else {
                                appendToTemplate(p, g.content);
                            }
                        } else {
                            appendToTemplate(p, g);
                        }
                    }
                    v = e.As();
                    this.ls(p.content, v);
                    h[n] = CustomElementDefinition.create({
                        name: Xt(),
                        template: p,
                        instructions: v.rows,
                        needsCompile: false,
                        isStrictBinding: e.root.def.isStrictBinding
                    });
                }
                q.projections = h;
            }
            if (f && (W || u.containerless)) {
                this.Cs(t, e);
            }
            G = !f || !u.containerless && !W && j !== false;
            if (G && t.childNodes.length > 0) {
                i = t.firstChild;
                while (i !== null) {
                    i = this.ls(i, e);
                }
            }
        }
        return h;
    }
    xs(t, e) {
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
                insertBefore(i, e.Bs(c), t);
            }
            for (h = 0, a = l.length; a > h; ++h) {
                insertManyBefore(i, t, [ e.Rs(qs), e.Rs(Fs), this.ws(e.h($s)) ]);
                if (c = r[h + 1]) {
                    insertBefore(i, e.Bs(c), t);
                }
                e.rows.push([ new TextBindingInstruction(l[h], e.root.def.isStrictBinding) ]);
            }
            i.removeChild(t);
        }
        return n;
    }
    ps(t, e, i, s) {
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
                d = s.Re.parse(h, a);
                m = s.ds(d);
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
    os(t, e) {
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
            const n = class LocalTemplate {};
            const h = t.content;
            const a = B(h.querySelectorAll("bindable"));
            const c = Rt.for(n);
            const u = new Set;
            const f = new Set;
            for (const t of a) {
                if (t.parentNode !== h) {
                    throw createError(`AUR0710`);
                }
                const e = t.getAttribute("property");
                if (e === null) {
                    throw createError(`AUR0711`);
                }
                const i = t.getAttribute("attribute");
                if (i !== null && f.has(i) || u.has(e)) {
                    throw createError(`AUR0712:${e}+${i}`);
                } else {
                    if (i !== null) {
                        f.add(i);
                    }
                    u.add(e);
                }
                c.add({
                    property: e,
                    attribute: i ?? void 0,
                    mode: getBindingMode(t)
                });
                const s = t.getAttributeNames().filter((t => !zs.includes(t)));
                if (s.length > 0) ;
                h.removeChild(t);
            }
            l.push(n);
            e.Ss(defineElement({
                name: s,
                template: t
            }, n));
            i.removeChild(t);
        }
        let h = 0;
        const a = l.length;
        for (;a > h; ++h) {
            getElementDefinition(l[h]).dependencies.push(...e.def.dependencies ?? c, ...e.deps ?? c);
        }
    }
    ys(t, e) {
        const i = t.nodeName;
        return i === "INPUT" && js[t.type] === 1 || i === "SELECT" && (t.hasAttribute("multiple") || e?.some((t => t.type === "rg" && t.to === "multiple")));
    }
    ks(t, e) {
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
    _s(t) {
        return t.nodeName === $s && isComment(Ds = getPreviousSibling(t)) && Ds.textContent === Fs && isComment(Ds = getPreviousSibling(Ds)) && Ds.textContent === qs;
    }
    ws(t) {
        t.classList.add("au");
        return t;
    }
    Cs(t, e) {
        if (isMarker(t)) {
            return t;
        }
        const i = t.parentNode;
        const s = this.ws(e.h($s));
        insertManyBefore(i, t, [ e.Rs(qs), e.Rs(Fs), s ]);
        i.removeChild(t);
        return s;
    }
}

let Ds;

const $s = "AU-M";

const Us = "TEMPLATE";

const qs = "au-start";

const Fs = "au-end";

const isMarker = t => t.nodeName === $s && isComment(Ds = getPreviousSibling(t)) && Ds.textContent === Fs && isComment(Ds = getPreviousSibling(Ds)) && Ds.textContent === qs;

const isComment = t => t?.nodeType === 8;

class CompilationContext {
    constructor(t, e, i, s, n, r) {
        this.hasSlot = false;
        this.Is = createLookup();
        const l = s !== null;
        this.c = e;
        this.root = n === null ? this : n;
        this.def = t;
        this.ci = i;
        this.parent = s;
        this.rs = l ? s.rs : e.get(Ls);
        this.Re = l ? s.Re : e.get(Si);
        this.ep = l ? s.ep : e.get(q);
        this.m = l ? s.m : e.get(Ji);
        this.yi = l ? s.yi : e.get(C);
        this.p = l ? s.p : e.get(Ft);
        this.localEls = l ? s.localEls : new Set;
        this.rows = r ?? [];
    }
    Ss(t) {
        var e;
        ((e = this.root).deps ?? (e.deps = [])).push(t);
        this.root.c.register(t);
    }
    Bs(t) {
        return createText(this.p, t);
    }
    Rs(t) {
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
    us(t) {
        return this.c.find(Qt, t);
    }
    gs(t) {
        return this.c.find(Ht, t);
    }
    As(t) {
        return new CompilationContext(this.def, this.c, this.ci, this, this.root, t);
    }
    ds(t) {
        if (this.root !== this) {
            return this.root.ds(t);
        }
        const e = t.command;
        if (e === null) {
            return null;
        }
        let i = this.Is[e];
        if (i === void 0) {
            i = this.c.create(qi, e);
            if (i === null) {
                throw createError(`AUR0713:${e}`);
            }
            this.Is[e] = i;
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

const Os = {
    projections: null
};

const Hs = {
    name: "unnamed"
};

const Vs = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const Ns = vt(createLookup(), {
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

const zs = pt([ "property", "attribute", "mode" ]);

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

const Xs = /*@__PURE__*/ St("ITemplateCompilerHooks");

const Ks = new WeakMap;

const Qs = ht("compiler-hooks");

const Ys = pt({
    name: Qs,
    define(t) {
        let e = Ks.get(t);
        if (e === void 0) {
            Ks.set(t, e = new TemplateCompilerHooksDefinition(t));
            nt(Qs, e, t);
            at(t, Qs);
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
        t.register(_t(Xs, this.Type));
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

let tn = class Show {
    constructor(t, e, i) {
        this.el = t;
        this.p = e;
        this.Ts = false;
        this.st = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.st = null;
            if (Boolean(this.value) !== this.Es) {
                if (this.Es === this.Ps) {
                    this.Es = !this.Ps;
                    this.$val = this.el.style.getPropertyValue("display");
                    this.$prio = this.el.style.getPropertyPriority("display");
                    this.el.style.setProperty("display", "none", "important");
                } else {
                    this.Es = this.Ps;
                    this.el.style.setProperty("display", this.$val, this.$prio);
                    if (this.el.getAttribute("style") === "") {
                        this.el.removeAttribute("style");
                    }
                }
            }
        };
        this.Es = this.Ps = i.alias !== "hide";
    }
    binding() {
        this.Ts = true;
        this.update();
    }
    detaching() {
        this.Ts = false;
        this.st?.cancel();
        this.st = null;
    }
    valueChanged() {
        if (this.Ts && this.st === null) {
            this.st = this.p.domWriteQueue.queueTask(this.update);
        }
    }
};

__decorate([ bindable ], tn.prototype, "value", void 0);

tn = __decorate([ __param(0, te), __param(1, Ft), __param(2, Ue) ], tn);

alias("hide")(tn);

customAttribute("show")(tn);

const en = [ TemplateCompiler, NodeObserverLocator ];

const sn = [ Pi, Ei, Di ];

const nn = [ Mi, Li ];

const rn = [ Ni, Fi, Hi, Oi, Vi, ji, Qi, Wi, zi, Ki, Xi, Gi, Yi ];

const on = [ DebounceBindingBehavior, OneTimeBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, SignalBindingBehavior, ThrottleBindingBehavior, TwoWayBindingBehavior, Ps, If, Else, Repeat, With, bs, ws, ys, ks, As, Cs, Rs, Bs, Ss, _s, AttrBindingBehavior, SelfBindingBehavior, UpdateTriggerBindingBehavior, AuCompose, Portal, Focus, tn, Is ];

const ln = [ Ge, Xe, We, ze, Oe, He, Ve, Ne, je, Qe, ei, Ye, Ze, Je, ti, Ke, ii ];

const hn = /*@__PURE__*/ createConfiguration(n);

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
            return e.register(Tt(H, i.coercingOptions), ...en, ...on, ...sn, ...rn, ...ln);
        },
        customize(e) {
            return createConfiguration(e ?? t);
        }
    };
}

function children(t, e) {
    if (!un) {
        un = true;
        I(ChildrenBinding);
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
        let l = Qt.getAnnotation(r, s);
        if (l == null) {
            Qt.annotate(r, s, l = []);
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
    static create(t, e, i, s, n = defaultChildQuery, r = defaultChildFilter, l = defaultChildMap, h = an) {
        const a = new ChildrenBinding(t, e, s, n, r, l, h);
        At(e, i, {
            enumerable: true,
            configurable: true,
            get: vt((() => a.getValue()), {
                getObserver: () => a
            }),
            set: () => {}
        });
        return a;
    }
    constructor(t, e, i, s = defaultChildQuery, n = defaultChildFilter, r = defaultChildMap, l = an) {
        this.Ls = void 0;
        this.bt = defaultChildQuery;
        this.Ms = defaultChildFilter;
        this.Ds = defaultChildMap;
        this.isBound = false;
        this.nt = t;
        this.cb = (this.obj = e)[i];
        this.bt = s;
        this.Ms = n;
        this.Ds = r;
        this.ut = l;
        this.Je = createMutationObserver(this.$s = t.host, (() => {
            this.Us();
        }));
    }
    getValue() {
        return this.isBound ? this.Ls : this.qs();
    }
    setValue(t) {}
    bind() {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        this.Je.observe(this.$s, this.ut);
        this.Ls = this.qs();
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.Je.disconnect();
        this.Ls = c;
    }
    Us() {
        this.Ls = this.qs();
        this.cb?.call(this.obj);
        this.subs.notify(this.Ls, undefined);
    }
    get() {
        throw notImplemented("get");
    }
    qs() {
        return filterChildren(this.nt, this.bt, this.Ms, this.Ds);
    }
}

const an = {
    childList: true
};

const notImplemented = t => createError(`Method "${t}": not implemented`);

const defaultChildQuery = t => t.host.childNodes;

const defaultChildFilter = (t, e, i) => !!i;

const defaultChildMap = (t, e, i) => i;

const cn = {
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
        a = findElementControllerFor(h, cn);
        c = a?.viewModel ?? null;
        if (i(h, a, c)) {
            l.push(s(h, a, c));
        }
    }
    return l;
};

class ChildrenLifecycleHooks {
    constructor(t) {
        this.def = t;
    }
    register(t) {
        Tt(Ae, this).register(t);
    }
    hydrating(t, e) {
        const i = this.def;
        e.addBinding(ChildrenBinding.create(e, e.viewModel, i.name, i.callback ?? `${dt(i.name)}Changed`, i.query ?? defaultChildQuery, i.filter ?? defaultChildFilter, i.map ?? defaultChildMap, i.options ?? an));
    }
}

let un = false;

export { AdoptedStyleSheetsStyles, AppRoot, ae as AppTask, Mi as AtPrefixedTriggerAttributePattern, AttrBindingBehavior, Gi as AttrBindingCommand, AttrSyntax, AttributeBinding, AttributeBindingInstruction, ei as AttributeBindingRenderer, AttributeNSAccessor, Ti as AttributePattern, AuCompose, Is as AuSlot, AuSlotsInfo, Aurelia, Rt as Bindable, BindableDefinition, BindableObserver, BindablesInfo, Lt as BindingBehavior, BindingBehaviorDefinition, qi as BindingCommand, BindingCommandDefinition, ts as BindingMode, BindingModeBehavior, BindingTargetSubscriber, CSSModulesProcessorRegistry, zi as CaptureBindingCommand, ws as Case, CheckedObserver, ChildrenBinding, ClassAttributeAccessor, Ki as ClassBindingCommand, Li as ColonPrefixedBindAttributePattern, $i as CommandType, ComputedWatcher, ContentBinding, Controller, Ht as CustomAttribute, CustomAttributeDefinition, Ve as CustomAttributeRenderer, Qt as CustomElement, CustomElementDefinition, He as CustomElementRenderer, DataAttributeAccessor, DebounceBindingBehavior, Ni as DefaultBindingCommand, rn as DefaultBindingLanguage, sn as DefaultBindingSyntax, ys as DefaultCase, en as DefaultComponents, ln as DefaultRenderers, on as DefaultResources, Ts as DefinitionType, Ei as DotSeparatedAttributePattern, Else, ExpressionWatcher, FlushQueue, Focus, ji as ForBindingCommand, FragmentNodeSequence, FromViewBindingBehavior, Hi as FromViewBindingCommand, Cs as FulfilledTemplateController, HooksDefinition, HydrateAttributeInstruction, HydrateElementInstruction, HydrateLetElementInstruction, HydrateTemplateController, Ai as IAppRoot, he as IAppTask, Ji as IAttrMapper, Si as IAttributeParser, Bi as IAttributePattern, Me as IAuSlotWatcher, Le as IAuSlotsInfo, Ci as IAurelia, bi as IController, ee as IEventTarget, ve as IFlushQueue, le as IHistory, xi as IHydrationContext, Ue as IInstruction, Ae as ILifecycleHooks, oe as ILocation, te as INode, Ft as IPlatform, ie as IRenderLocation, Fe as IRenderer, ci as IRendering, Zi as ISVGAnalyzer, Es as ISanitizer, fe as IShadowDOMGlobalStyles, ue as IShadowDOMStyles, Ri as ISyntaxInterpreter, qe as ITemplateCompiler, Xs as ITemplateCompilerHooks, Ls as ITemplateElementFactory, Pe as IViewFactory, re as IWindow, If, $e as InstructionType, InterpolationBinding, ze as InterpolationBindingRenderer, InterpolationInstruction, InterpolationPartBinding, Interpretation, IteratorBindingInstruction, Xe as IteratorBindingRenderer, LetBinding, LetBindingInstruction, je as LetElementRenderer, Be as LifecycleHooks, LifecycleHooksDefinition, LifecycleHooksEntry, ListenerBinding, ListenerBindingInstruction, ListenerBindingOptions, Qe as ListenerBindingRenderer, MultiAttrInstruction, NodeObserverLocator, NoopSVGAnalyzer, OneTimeBindingBehavior, Fi as OneTimeBindingCommand, As as PendingTemplateController, Portal, ks as PromiseTemplateController, PropertyBinding, PropertyBindingInstruction, Ge as PropertyBindingRenderer, Pi as RefAttributePattern, RefBinding, RefBindingInstruction, We as RefBindingRenderer, Rs as RejectedTemplateController, Rendering, Repeat, SVGAnalyzer, Ps as SanitizeValueConverter, SelectValueObserver, SelfBindingBehavior, SetAttributeInstruction, Ye as SetAttributeRenderer, SetClassAttributeInstruction, Ze as SetClassAttributeRenderer, SetPropertyInstruction, Oe as SetPropertyRenderer, SetStyleAttributeInstruction, Je as SetStyleAttributeRenderer, ShadowDOMRegistry, nn as ShortHandBindingSyntax, SignalBindingBehavior, SpreadBindingInstruction, SpreadElementPropBindingInstruction, ii as SpreadRenderer, hn as StandardConfiguration, vi as State, StyleAttributeAccessor, Xi as StyleBindingCommand, de as StyleConfiguration, StyleElementStyles, StylePropertyBindingInstruction, ti as StylePropertyBindingRenderer, bs as Switch, TemplateCompiler, Ys as TemplateCompilerHooks, Ne as TemplateControllerRenderer, TextBindingInstruction, Ke as TextBindingRenderer, ThrottleBindingBehavior, ToViewBindingBehavior, Oi as ToViewBindingCommand, Wi as TriggerBindingCommand, TwoWayBindingBehavior, Vi as TwoWayBindingCommand, UpdateTriggerBindingBehavior, ValueAttributeObserver, ge as ValueConverter, ValueConverterDefinition, ViewFactory, pi as ViewModelKind, jt as Watch, With, alias, allResources, attributePattern, bindable, bindingBehavior, bindingCommand, capture, children, coercer, containerless, convertToRenderLocation, cssModules, customAttribute, customElement, getEffectiveParentNode, getRef, isCustomElementController, isCustomElementViewModel, isInstruction, isRenderLocation, lifecycleHooks, mixinAstEvaluator, mixinUseScope, mixingBindingLimited, processContent, registerAliases, renderer, setEffectiveParentNode, setRef, shadowCSS, slotted, strict, templateCompilerHooks, templateController, useShadowDOM, valueConverter, watch };
//# sourceMappingURL=index.mjs.map
