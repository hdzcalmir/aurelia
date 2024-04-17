import { DestructuringAssignmentSingleExpression as t, IExpressionParser as e, AccessScopeExpression as i, PrimitiveLiteralExpression as s } from "@aurelia/expression-parser";

import { isArrayIndex as n, Protocol as r, getPrototypeChain as l, kebabCase as a, noop as h, DI as c, Registration as u, firstDefined as f, mergeArrays as d, resourceBaseName as m, resource as g, getResourceKeyFor as p, resolve as v, IPlatform as b, emptyArray as w, Registrable as y, all as x, InstanceProvider as C, IContainer as k, optionalResource as A, optional as B, onResolveAll as S, onResolve as R, fromDefinitionOrDefault as T, pascalCase as E, fromAnnotationOrDefinitionOrTypeOrDefault as I, fromAnnotationOrTypeOrDefault as P, camelCase as L, IServiceLocator as D, emptyObject as M, ILogger as _, transient as q, toArray as F, allResources as O } from "@aurelia/kernel";

import { AccessorType as H, Scope as V, connectable as $, subscriberCollection as N, IObserverLocator as j, ConnectableSwitcher as W, ProxyObservable as U, ICoercionConfiguration as z, PropertyAccessor as G, INodeObserverLocator as K, IDirtyChecker as X, getObserverLookup as Q, SetterObserver as Y, createIndexMap as Z, getCollectionObserver as J, BindingContext as tt, DirtyChecker as et } from "@aurelia/runtime";

import { Metadata as it, isObject as st } from "@aurelia/metadata";

import { BrowserPlatform as nt } from "@aurelia/platform-browser";

import { TaskAbortError as rt } from "@aurelia/platform";

const ot = Object;

const lt = String;

const at = ot.prototype;

const createLookup = () => ot.create(null);

const createError$1 = t => new Error(t);

const ht = at.hasOwnProperty;

const ct = ot.freeze;

const ut = ot.assign;

const ft = ot.getOwnPropertyNames;

const dt = ot.keys;

const mt = /*@__PURE__*/ createLookup();

const isDataAttribute = (t, e, i) => {
    if (mt[e] === true) {
        return true;
    }
    if (!isString(e)) {
        return false;
    }
    const s = e.slice(0, 5);
    return mt[e] = s === "aria-" || s === "data-" || i.isStandardSvgAttribute(t, e);
};

const isPromise = t => t instanceof Promise;

const isArray = t => t instanceof Array;

const isFunction = t => typeof t === "function";

const isObject = t => t instanceof ot;

const isString = t => typeof t === "string";

const isSymbol = t => typeof t === "symbol";

const rethrow = t => {
    throw t;
};

const gt = ot.is;

const pt = Reflect.defineProperty;

const defineHiddenProp = (t, e, i) => {
    pt(t, e, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: i
    });
    return i;
};

const addSignalListener = (t, e, i) => t.addSignalListener(e, i);

const removeSignalListener = (t, e, i) => t.removeSignalListener(e, i);

const vt = "Interpolation";

const bt = "IsIterator";

const wt = "IsFunction";

const yt = "IsProperty";

const xt = "pending";

const Ct = "running";

const kt = H.Observer;

const At = H.Node;

const Bt = H.Layout;

const createMappedError = (t, ...e) => new Error(`AUR${lt(t).padStart(4, "0")}:${e.map(lt)}`);

const {astAssign: St, astEvaluate: Rt, astBind: Tt, astUnbind: Et} = (() => {
    const e = "AccessThis";
    const i = "AccessBoundary";
    const s = "AccessGlobal";
    const r = "AccessScope";
    const l = "ArrayLiteral";
    const a = "ObjectLiteral";
    const h = "PrimitiveLiteral";
    const c = "Template";
    const u = "Unary";
    const f = "CallScope";
    const d = "CallMember";
    const m = "CallFunction";
    const g = "CallGlobal";
    const p = "AccessMember";
    const v = "AccessKeyed";
    const b = "TaggedTemplate";
    const w = "Binary";
    const y = "Conditional";
    const x = "Assign";
    const C = "ArrowFunction";
    const k = "ValueConverter";
    const A = "BindingBehavior";
    const B = "ArrayBindingPattern";
    const S = "ObjectBindingPattern";
    const R = "BindingIdentifier";
    const T = "ForOfStatement";
    const E = "Interpolation";
    const I = "ArrayDestructuring";
    const P = "ObjectDestructuring";
    const L = "DestructuringAssignmentLeaf";
    const D = "Custom";
    const M = V.getContext;
    function astEvaluate(t, n, q, F) {
        switch (t.$kind) {
          case e:
            {
                let e = n.overrideContext;
                let i = n;
                let s = t.ancestor;
                while (s-- && e) {
                    i = i.parent;
                    e = i?.overrideContext ?? null;
                }
                return s < 1 && i ? i.bindingContext : void 0;
            }

          case i:
            {
                let t = n;
                while (t != null && !t.isBoundary) {
                    t = t.parent;
                }
                return t ? t.bindingContext : void 0;
            }

          case r:
            {
                const e = M(n, t.name, t.ancestor);
                if (F !== null) {
                    F.observe(e, t.name);
                }
                const i = e[t.name];
                if (i == null && t.name === "$host") {
                    throw createMappedError(105);
                }
                if (q?.strict) {
                    return q?.boundFn && isFunction(i) ? i.bind(e) : i;
                }
                return i == null ? "" : q?.boundFn && isFunction(i) ? i.bind(e) : i;
            }

          case s:
            return globalThis[t.name];

          case g:
            {
                const e = globalThis[t.name];
                if (isFunction(e)) {
                    return e(...t.args.map((t => astEvaluate(t, n, q, F))));
                }
                if (!q?.strictFnCall && e == null) {
                    return void 0;
                }
                throw createMappedError(107);
            }

          case l:
            return t.elements.map((t => astEvaluate(t, n, q, F)));

          case a:
            {
                const e = {};
                for (let i = 0; i < t.keys.length; ++i) {
                    e[t.keys[i]] = astEvaluate(t.values[i], n, q, F);
                }
                return e;
            }

          case h:
            return t.value;

          case c:
            {
                let e = t.cooked[0];
                for (let i = 0; i < t.expressions.length; ++i) {
                    e += String(astEvaluate(t.expressions[i], n, q, F));
                    e += t.cooked[i + 1];
                }
                return e;
            }

          case u:
            switch (t.operation) {
              case "void":
                return void astEvaluate(t.expression, n, q, F);

              case "typeof":
                return typeof astEvaluate(t.expression, n, q, F);

              case "!":
                return !astEvaluate(t.expression, n, q, F);

              case "-":
                return -astEvaluate(t.expression, n, q, F);

              case "+":
                return +astEvaluate(t.expression, n, q, F);

              default:
                throw createMappedError(109, t.operation);
            }

          case f:
            {
                const e = t.args.map((t => astEvaluate(t, n, q, F)));
                const i = M(n, t.name, t.ancestor);
                const s = getFunction(q?.strictFnCall, i, t.name);
                if (s) {
                    return s.apply(i, e);
                }
                return void 0;
            }

          case d:
            {
                const e = astEvaluate(t.object, n, q, F);
                const i = t.args.map((t => astEvaluate(t, n, q, F)));
                const s = getFunction(q?.strictFnCall, e, t.name);
                let r;
                if (s) {
                    r = s.apply(e, i);
                    if (isArray(e) && _.includes(t.name)) {
                        F?.observeCollection(e);
                    }
                }
                return r;
            }

          case m:
            {
                const e = astEvaluate(t.func, n, q, F);
                if (isFunction(e)) {
                    return e(...t.args.map((t => astEvaluate(t, n, q, F))));
                }
                if (!q?.strictFnCall && e == null) {
                    return void 0;
                }
                throw createMappedError(107);
            }

          case C:
            {
                const func = (...e) => {
                    const i = t.args;
                    const s = t.rest;
                    const r = i.length - 1;
                    const l = i.reduce(((t, i, n) => {
                        if (s && n === r) {
                            t[i.name] = e.slice(n);
                        } else {
                            t[i.name] = e[n];
                        }
                        return t;
                    }), {});
                    const a = V.fromParent(n, l);
                    return astEvaluate(t.body, a, q, F);
                };
                return func;
            }

          case p:
            {
                const e = astEvaluate(t.object, n, q, F);
                let i;
                if (q?.strict) {
                    if (e == null) {
                        return undefined;
                    }
                    if (F !== null && !t.accessGlobal) {
                        F.observe(e, t.name);
                    }
                    i = e[t.name];
                    if (q?.boundFn && isFunction(i)) {
                        return i.bind(e);
                    }
                    return i;
                }
                if (F !== null && isObject(e) && !t.accessGlobal) {
                    F.observe(e, t.name);
                }
                if (e) {
                    i = e[t.name];
                    if (q?.boundFn && isFunction(i)) {
                        return i.bind(e);
                    }
                    return i;
                }
                return "";
            }

          case v:
            {
                const e = astEvaluate(t.object, n, q, F);
                const i = astEvaluate(t.key, n, q, F);
                if (isObject(e)) {
                    if (F !== null && !t.accessGlobal) {
                        F.observe(e, i);
                    }
                    return e[i];
                }
                return e == null ? void 0 : e[i];
            }

          case b:
            {
                const e = t.expressions.map((t => astEvaluate(t, n, q, F)));
                const i = astEvaluate(t.func, n, q, F);
                if (!isFunction(i)) {
                    throw createMappedError(110);
                }
                return i(t.cooked, ...e);
            }

          case w:
            {
                const e = t.left;
                const i = t.right;
                switch (t.operation) {
                  case "&&":
                    return astEvaluate(e, n, q, F) && astEvaluate(i, n, q, F);

                  case "||":
                    return astEvaluate(e, n, q, F) || astEvaluate(i, n, q, F);

                  case "??":
                    return astEvaluate(e, n, q, F) ?? astEvaluate(i, n, q, F);

                  case "==":
                    return astEvaluate(e, n, q, F) == astEvaluate(i, n, q, F);

                  case "===":
                    return astEvaluate(e, n, q, F) === astEvaluate(i, n, q, F);

                  case "!=":
                    return astEvaluate(e, n, q, F) != astEvaluate(i, n, q, F);

                  case "!==":
                    return astEvaluate(e, n, q, F) !== astEvaluate(i, n, q, F);

                  case "instanceof":
                    {
                        const t = astEvaluate(i, n, q, F);
                        if (isFunction(t)) {
                            return astEvaluate(e, n, q, F) instanceof t;
                        }
                        return false;
                    }

                  case "in":
                    {
                        const t = astEvaluate(i, n, q, F);
                        if (isObject(t)) {
                            return astEvaluate(e, n, q, F) in t;
                        }
                        return false;
                    }

                  case "+":
                    {
                        const t = astEvaluate(e, n, q, F);
                        const s = astEvaluate(i, n, q, F);
                        if (q?.strict) {
                            return t + s;
                        }
                        if (!t || !s) {
                            if (isNumberOrBigInt(t) || isNumberOrBigInt(s)) {
                                return (t || 0) + (s || 0);
                            }
                            if (isStringOrDate(t) || isStringOrDate(s)) {
                                return (t || "") + (s || "");
                            }
                        }
                        return t + s;
                    }

                  case "-":
                    return astEvaluate(e, n, q, F) - astEvaluate(i, n, q, F);

                  case "*":
                    return astEvaluate(e, n, q, F) * astEvaluate(i, n, q, F);

                  case "/":
                    return astEvaluate(e, n, q, F) / astEvaluate(i, n, q, F);

                  case "%":
                    return astEvaluate(e, n, q, F) % astEvaluate(i, n, q, F);

                  case "<":
                    return astEvaluate(e, n, q, F) < astEvaluate(i, n, q, F);

                  case ">":
                    return astEvaluate(e, n, q, F) > astEvaluate(i, n, q, F);

                  case "<=":
                    return astEvaluate(e, n, q, F) <= astEvaluate(i, n, q, F);

                  case ">=":
                    return astEvaluate(e, n, q, F) >= astEvaluate(i, n, q, F);

                  default:
                    throw createMappedError(108, t.operation);
                }
            }

          case y:
            return astEvaluate(t.condition, n, q, F) ? astEvaluate(t.yes, n, q, F) : astEvaluate(t.no, n, q, F);

          case x:
            return astAssign(t.target, n, q, astEvaluate(t.value, n, q, F));

          case k:
            {
                const e = q?.getConverter?.(t.name);
                if (e == null) {
                    throw createMappedError(103, t.name);
                }
                if ("toView" in e) {
                    return e.toView(astEvaluate(t.expression, n, q, F), ...t.args.map((t => astEvaluate(t, n, q, F))));
                }
                return astEvaluate(t.expression, n, q, F);
            }

          case A:
            return astEvaluate(t.expression, n, q, F);

          case R:
            return t.name;

          case T:
            return astEvaluate(t.iterable, n, q, F);

          case E:
            if (t.isMulti) {
                let e = t.parts[0];
                let i = 0;
                for (;i < t.expressions.length; ++i) {
                    e += lt(astEvaluate(t.expressions[i], n, q, F));
                    e += t.parts[i + 1];
                }
                return e;
            } else {
                return `${t.parts[0]}${astEvaluate(t.firstExpression, n, q, F)}${t.parts[1]}`;
            }

          case L:
            return astEvaluate(t.target, n, q, F);

          case I:
            {
                return t.list.map((t => astEvaluate(t, n, q, F)));
            }

          case B:
          case S:
          case P:
          default:
            return void 0;

          case D:
            return t.evaluate(n, q, F);
        }
    }
    function astAssign(e, i, s, l) {
        switch (e.$kind) {
          case r:
            {
                if (e.name === "$host") {
                    throw createMappedError(106);
                }
                const t = M(i, e.name, e.ancestor);
                return t[e.name] = l;
            }

          case p:
            {
                const t = astEvaluate(e.object, i, s, null);
                if (isObject(t)) {
                    if (e.name === "length" && isArray(t) && !isNaN(l)) {
                        t.splice(l);
                    } else {
                        t[e.name] = l;
                    }
                } else {
                    astAssign(e.object, i, s, {
                        [e.name]: l
                    });
                }
                return l;
            }

          case v:
            {
                const t = astEvaluate(e.object, i, s, null);
                const r = astEvaluate(e.key, i, s, null);
                if (isArray(t)) {
                    if (r === "length" && !isNaN(l)) {
                        t.splice(l);
                        return l;
                    }
                    if (n(r)) {
                        t.splice(r, 1, l);
                        return l;
                    }
                }
                return t[r] = l;
            }

          case x:
            astAssign(e.value, i, s, l);
            return astAssign(e.target, i, s, l);

          case k:
            {
                const t = s?.getConverter?.(e.name);
                if (t == null) {
                    throw createMappedError(103, e.name);
                }
                if ("fromView" in t) {
                    l = t.fromView(l, ...e.args.map((t => astEvaluate(t, i, s, null))));
                }
                return astAssign(e.expression, i, s, l);
            }

          case A:
            return astAssign(e.expression, i, s, l);

          case I:
          case P:
            {
                const t = e.list;
                const n = t.length;
                let r;
                let a;
                for (r = 0; r < n; r++) {
                    a = t[r];
                    switch (a.$kind) {
                      case L:
                        astAssign(a, i, s, l);
                        break;

                      case I:
                      case P:
                        {
                            if (typeof l !== "object" || l === null) {
                                throw createMappedError(112);
                            }
                            let t = astEvaluate(a.source, V.create(l), s, null);
                            if (t === void 0 && a.initializer) {
                                t = astEvaluate(a.initializer, i, s, null);
                            }
                            astAssign(a, i, s, t);
                            break;
                        }
                    }
                }
                break;
            }

          case L:
            {
                if (e instanceof t) {
                    if (l == null) {
                        return;
                    }
                    if (typeof l !== "object") {
                        throw createMappedError(112);
                    }
                    let t = astEvaluate(e.source, V.create(l), s, null);
                    if (t === void 0 && e.initializer) {
                        t = astEvaluate(e.initializer, i, s, null);
                    }
                    astAssign(e.target, i, s, t);
                } else {
                    if (l == null) {
                        return;
                    }
                    if (typeof l !== "object") {
                        throw createMappedError(112);
                    }
                    const t = e.indexOrProperties;
                    let r;
                    if (n(t)) {
                        if (!Array.isArray(l)) {
                            throw createMappedError(112);
                        }
                        r = l.slice(t);
                    } else {
                        r = Object.entries(l).reduce(((e, [i, s]) => {
                            if (!t.includes(i)) {
                                e[i] = s;
                            }
                            return e;
                        }), {});
                    }
                    astAssign(e.target, i, s, r);
                }
                break;
            }

          case D:
            return e.assign(i, s, l);

          default:
            return void 0;
        }
    }
    function astBind(t, e, i) {
        switch (t.$kind) {
          case A:
            {
                const s = t.name;
                const n = t.key;
                const r = i.getBehavior?.(s);
                if (r == null) {
                    throw createMappedError(101, s);
                }
                if (i[n] === void 0) {
                    i[n] = r;
                    r.bind?.(e, i, ...t.args.map((t => astEvaluate(t, e, i, null))));
                } else {
                    throw createMappedError(102, s);
                }
                astBind(t.expression, e, i);
                return;
            }

          case k:
            {
                const s = t.name;
                const n = i.getConverter?.(s);
                if (n == null) {
                    throw createMappedError(103, s);
                }
                const r = n.signals;
                if (r != null) {
                    const t = i.getSignaler?.();
                    const e = r.length;
                    let s = 0;
                    for (;s < e; ++s) {
                        t?.addSignalListener(r[s], i);
                    }
                }
                astBind(t.expression, e, i);
                return;
            }

          case T:
            {
                astBind(t.iterable, e, i);
                break;
            }

          case D:
            {
                t.bind?.(e, i);
            }
        }
    }
    function astUnbind(t, e, i) {
        switch (t.$kind) {
          case A:
            {
                const s = t.key;
                const n = i;
                if (n[s] !== void 0) {
                    n[s].unbind?.(e, i);
                    n[s] = void 0;
                }
                astUnbind(t.expression, e, i);
                break;
            }

          case k:
            {
                const s = i.getConverter?.(t.name);
                if (s?.signals === void 0) {
                    return;
                }
                const n = i.getSignaler?.();
                let r = 0;
                for (;r < s.signals.length; ++r) {
                    n?.removeSignalListener(s.signals[r], i);
                }
                astUnbind(t.expression, e, i);
                break;
            }

          case T:
            {
                astUnbind(t.iterable, e, i);
                break;
            }

          case D:
            {
                t.unbind?.(e, i);
            }
        }
    }
    const getFunction = (t, e, i) => {
        const s = e == null ? null : e[i];
        if (isFunction(s)) {
            return s;
        }
        if (!t && s == null) {
            return null;
        }
        throw createMappedError(111, i);
    };
    const isNumberOrBigInt = t => {
        switch (typeof t) {
          case "number":
          case "bigint":
            return true;

          default:
            return false;
        }
    };
    const isStringOrDate = t => {
        switch (typeof t) {
          case "string":
            return true;

          case "object":
            return t instanceof Date;

          default:
            return false;
        }
    };
    const _ = "at map filter includes indexOf lastIndexOf findIndex find flat flatMap join reduce reduceRight slice every some sort".split(" ");
    return {
        astEvaluate: astEvaluate,
        astAssign: astAssign,
        astBind: astBind,
        astUnbind: astUnbind
    };
})();

const It = 1;

const Pt = 2;

const Lt = 4;

const Dt = 6;

const Mt = 8;

const _t = /*@__PURE__*/ ct({
    oneTime: It,
    toView: Pt,
    fromView: Lt,
    twoWay: Dt,
    default: Mt
});

const qt = it.get;

const Ft = it.has;

const Ot = it.define;

const {annotation: Ht} = r;

const Vt = Ht.keyFor;

function bindable(t, e) {
    let i = void 0;
    function decorator(t, e) {
        let s;
        switch (e.kind) {
          case "getter":
          case "field":
            {
                const t = e.name;
                if (typeof t !== "string") throw createMappedError(227);
                s = t;
                break;
            }

          case "class":
            if (i == null) throw createMappedError(228);
            if (typeof i == "string") {
                s = i;
            } else {
                const t = i.name;
                if (!t) throw createMappedError(229);
                if (typeof t !== "string") throw createMappedError(227);
                s = t;
            }
            break;
        }
        const n = i == null || typeof i === "string" ? {
            name: s
        } : i;
        const r = e.metadata[$t] ??= createLookup();
        r[s] = BindableDefinition.create(s, n);
    }
    if (arguments.length > 1) {
        i = {};
        decorator(t, e);
        return;
    } else if (isString(t)) {
        i = t;
        return decorator;
    }
    i = t === void 0 ? {} : t;
    return decorator;
}

const $t = /*@__PURE__*/ Vt("bindables");

const Nt = ct({
    name: $t,
    keyFrom: t => `${$t}:${t}`,
    from(...t) {
        const e = {};
        const i = Array.isArray;
        function addName(t) {
            e[t] = BindableDefinition.create(t);
        }
        function addDescription(t, i) {
            e[t] = i instanceof BindableDefinition ? i : BindableDefinition.create(t, i === true ? {} : i);
        }
        function addList(t) {
            if (i(t)) {
                t.forEach((t => isString(t) ? addName(t) : addDescription(t.name, t)));
            } else if (t instanceof BindableDefinition) {
                e[t.name] = t;
            } else if (t !== void 0) {
                dt(t).forEach((e => addDescription(e, t[e])));
            }
        }
        t.forEach(addList);
        return e;
    },
    getAll(t) {
        const e = [];
        const i = l(t);
        let s = i.length;
        let n;
        while (--s >= 0) {
            n = i[s];
            const t = qt($t, n);
            if (t == null) continue;
            e.push(...Object.values(t));
        }
        return e;
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
    static create(t, e = {}) {
        return new BindableDefinition(e.attribute ?? a(t), e.callback ?? `${t}Changed`, e.mode ?? Pt, e.primary ?? false, e.name ?? t, e.set ?? getInterceptor(e));
    }
}

function coercer(t, e) {
    e.addInitializer((function() {
        jt.define(this, e.name);
    }));
}

const jt = {
    key: /*@__PURE__*/ Vt("coercer"),
    define(t, e) {
        Ot(t[e].bind(t), t, jt.key);
    },
    for(t) {
        return qt(jt.key, t);
    }
};

function getInterceptor(t = {}) {
    const e = t.type ?? null;
    if (e == null) {
        return h;
    }
    let i;
    switch (e) {
      case Number:
      case Boolean:
      case String:
      case BigInt:
        i = e;
        break;

      default:
        {
            const t = e.coerce;
            i = typeof t === "function" ? t.bind(e) : jt.for(e) ?? h;
            break;
        }
    }
    return i === h ? i : createCoercer(i, t.nullable);
}

function createCoercer(t, e) {
    return function(i, s) {
        if (!s?.enableCoercion) return i;
        return (e ?? (s?.coerceNullish ?? false ? false : true)) && i == null ? i : t(i, s);
    };
}

const Wt = c.createInterface;

const Ut = u.singleton;

const zt = u.aliasTo;

const Gt = u.instance;

u.callback;

u.transient;

const registerResolver = (t, e, i) => t.registerResolver(e, i);

function alias(...t) {
    return function(e, i) {
        i.addInitializer((function() {
            const e = Vt("aliases");
            const i = qt(e, this);
            if (i === void 0) {
                Ot(t, this, e);
            } else {
                i.push(...t);
            }
        }));
    };
}

function registerAliases(t, e, i, s) {
    for (let n = 0, r = t.length; n < r; ++n) {
        u.aliasTo(i, e.keyFrom(t[n])).register(s);
    }
}

const Kt = "element";

const Xt = "attribute";

const Qt = "__au_static_resource__";

const getDefinitionFromStaticAu = (t, e, i) => {
    let s = qt(Qt, t);
    if (s == null) {
        if (t.$au?.type === e) {
            s = i(t.$au, t);
            Ot(s, t, Qt);
        }
    }
    return s;
};

function bindingBehavior(t) {
    return function(e, i) {
        i.addInitializer((function() {
            Jt.define(t, this);
        }));
        return e;
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
        return new BindingBehaviorDefinition(e, f(getBehaviorAnnotation(e, "name"), i), d(getBehaviorAnnotation(e, "aliases"), s.aliases, e.aliases), Jt.keyFrom(i));
    }
    register(t, e) {
        const i = this.Type;
        const s = typeof e === "string" ? getBindingBehaviorKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(s, false)) {
            t.register(t.has(i, false) ? null : Ut(i, i), zt(i, s), ...n.map((t => zt(i, getBindingBehaviorKeyFrom(t)))));
        }
    }
}

const Yt = "binding-behavior";

const Zt = /*@__PURE__*/ p(Yt);

const getBehaviorAnnotation = (t, e) => qt(Vt(e), t);

const getBindingBehaviorKeyFrom = t => `${Zt}:${t}`;

const Jt = ct({
    name: Zt,
    keyFrom: getBindingBehaviorKeyFrom,
    isType(t) {
        return isFunction(t) && (Ft(Zt, t) || t.$au?.type === Yt);
    },
    define(t, e) {
        const i = BindingBehaviorDefinition.create(t, e);
        const s = i.Type;
        Ot(i, s, Zt, m);
        return s;
    },
    getDefinition(t) {
        const e = qt(Zt, t) ?? getDefinitionFromStaticAu(t, Yt, BindingBehaviorDefinition.create);
        if (e === void 0) {
            throw createMappedError(151, t);
        }
        return e;
    },
    find(t, e) {
        const i = t.find(Yt, e);
        return i == null ? null : qt(Zt, i) ?? getDefinitionFromStaticAu(i, Yt, BindingBehaviorDefinition.create) ?? null;
    },
    get(t, e) {
        return t.get(g(getBindingBehaviorKeyFrom(e)));
    }
});

const te = new Map;

const createConfig = t => ({
    type: Yt,
    name: t
});

class BindingModeBehavior {
    bind(t, e) {
        te.set(e, e.mode);
        e.mode = this.mode;
    }
    unbind(t, e) {
        e.mode = te.get(e);
        te.delete(e);
    }
}

class OneTimeBindingBehavior extends BindingModeBehavior {
    get mode() {
        return It;
    }
}

OneTimeBindingBehavior.$au = createConfig("oneTime");

class ToViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return Pt;
    }
}

ToViewBindingBehavior.$au = createConfig("toView");

class FromViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return Lt;
    }
}

FromViewBindingBehavior.$au = createConfig("fromView");

class TwoWayBindingBehavior extends BindingModeBehavior {
    get mode() {
        return Dt;
    }
}

TwoWayBindingBehavior.$au = createConfig("twoWay");

const ee = new WeakMap;

const ie = 200;

class DebounceBindingBehavior {
    constructor() {
        this.p = v(b);
    }
    bind(t, e, i, s) {
        const n = {
            type: "debounce",
            delay: i ?? ie,
            now: this.p.performanceNow,
            queue: this.p.taskQueue,
            signals: isString(s) ? [ s ] : s ?? w
        };
        const r = e.limit?.(n);
        if (r == null) ; else {
            ee.set(e, r);
        }
    }
    unbind(t, e) {
        ee.get(e)?.dispose();
        ee.delete(e);
    }
}

DebounceBindingBehavior.$au = {
    type: Yt,
    name: "debounce"
};

const se = /*@__PURE__*/ Wt("ISignaler", (t => t.singleton(Signaler)));

class Signaler {
    constructor() {
        this.signals = createLookup();
    }
    dispatchSignal(t) {
        const e = this.signals[t];
        if (e === undefined) {
            return;
        }
        let i;
        for (i of e.keys()) {
            i.handleChange(undefined, undefined);
        }
    }
    addSignalListener(t, e) {
        (this.signals[t] ??= new Set).add(e);
    }
    removeSignalListener(t, e) {
        this.signals[t]?.delete(e);
    }
}

class SignalBindingBehavior {
    constructor() {
        this.i = new Map;
        this.u = v(se);
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

SignalBindingBehavior.$au = {
    type: Yt,
    name: "signal"
};

const ne = new WeakMap;

const re = 200;

class ThrottleBindingBehavior {
    constructor() {
        ({performanceNow: this.C, taskQueue: this.A} = v(b));
    }
    bind(t, e, i, s) {
        const n = {
            type: "throttle",
            delay: i ?? re,
            now: this.C,
            queue: this.A,
            signals: isString(s) ? [ s ] : s ?? w
        };
        const r = e.limit?.(n);
        if (r == null) ; else {
            ne.set(e, r);
        }
    }
    unbind(t, e) {
        ne.get(e)?.dispose();
        ne.delete(e);
    }
}

ThrottleBindingBehavior.$au = {
    type: Yt,
    name: "throttle"
};

const oe = /*@__PURE__*/ Wt("IAppTask");

class $AppTask {
    constructor(t, e, i) {
        this.c = void 0;
        this.slot = t;
        this.k = e;
        this.cb = i;
    }
    register(t) {
        return this.c = t.register(Gt(oe, this));
    }
    run() {
        const t = this.k;
        const e = this.cb;
        return t === null ? e() : e(this.c.get(t));
    }
}

const le = ct({
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

const ae = b;

function watch(t, e) {
    if (t == null) {
        throw createMappedError(772);
    }
    return function decorator(i, s) {
        const n = s.kind === "class";
        if (n) {
            if (!isFunction(e) && (e == null || !(e in i.prototype))) {
                throw createMappedError(773, `${lt(e)}@${i.name}}`);
            }
        } else if (!isFunction(i)) {
            throw createMappedError(774, s.name);
        }
        const r = new WatchDefinition(t, n ? e : i);
        if (n) {
            addDefinition(i);
        } else {
            s.addInitializer((function() {
                addDefinition(this.constructor);
            }));
        }
        function addDefinition(t) {
            he.add(t, r);
            if (isAttributeType(t)) {
                getAttributeDefinition(t).watches.push(r);
            }
            if (isElementType(t)) {
                getElementDefinition(t).watches.push(r);
            }
        }
    };
}

class WatchDefinition {
    constructor(t, e) {
        this.expression = t;
        this.callback = e;
    }
}

const he = /*@__PURE__*/ (() => {
    const t = new WeakMap;
    return ct({
        add(e, i) {
            let s = t.get(e);
            if (s == null) {
                t.set(e, s = []);
            }
            s.push(i);
        },
        getDefinitions(e) {
            return t.get(e) ?? w;
        }
    });
})();

function customAttribute(t) {
    return function(e, i) {
        i.addInitializer((function() {
            defineAttribute(t, this);
        }));
        return e;
    };
}

function templateController(t) {
    return function(e, i) {
        i.addInitializer((function() {
            defineAttribute(isString(t) ? {
                isTemplateController: true,
                name: t
            } : {
                isTemplateController: true,
                ...t
            }, this);
        }));
        return e;
    };
}

class CustomAttributeDefinition {
    get kind() {
        return Xt;
    }
    constructor(t, e, i, s, n, r, l, a, h, c, u) {
        this.Type = t;
        this.name = e;
        this.aliases = i;
        this.key = s;
        this.defaultBindingMode = n;
        this.isTemplateController = r;
        this.bindables = l;
        this.noMultiBindings = a;
        this.watches = h;
        this.dependencies = c;
        this.containerStrategy = u;
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
        return new CustomAttributeDefinition(e, f(getAttributeAnnotation(e, "name"), i), d(getAttributeAnnotation(e, "aliases"), s.aliases, e.aliases), getAttributeKeyFrom(i), f(getAttributeAnnotation(e, "defaultBindingMode"), s.defaultBindingMode, e.defaultBindingMode, Pt), f(getAttributeAnnotation(e, "isTemplateController"), s.isTemplateController, e.isTemplateController, false), Nt.from(...Nt.getAll(e), getAttributeAnnotation(e, "bindables"), e.bindables, s.bindables), f(getAttributeAnnotation(e, "noMultiBindings"), s.noMultiBindings, e.noMultiBindings, false), d(he.getDefinitions(e), e.watches), d(getAttributeAnnotation(e, "dependencies"), s.dependencies, e.dependencies), f(getAttributeAnnotation(e, "containerStrategy"), s.containerStrategy, e.containerStrategy, "reuse"));
    }
    register(t, e) {
        const i = this.Type;
        const s = typeof e === "string" ? getAttributeKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(s, false)) {
            t.register(t.has(i, false) ? null : Ut(i, i), zt(i, s), ...n.map((t => zt(i, getAttributeKeyFrom(t)))));
        }
    }
    toString() {
        return `au:ca:${this.name}`;
    }
}

const ce = "custom-attribute";

const ue = /*@__PURE__*/ p(ce);

const getAttributeKeyFrom = t => `${ue}:${t}`;

const getAttributeAnnotation = (t, e) => qt(Vt(e), t);

const isAttributeType = t => isFunction(t) && (Ft(ue, t) || t.$au?.type === ce);

const findAttributeControllerFor = (t, e) => getRef(t, getAttributeKeyFrom(e)) ?? void 0;

const defineAttribute = (t, e) => {
    const i = CustomAttributeDefinition.create(t, e);
    const s = i.Type;
    Ot(i, s, ue, m);
    return s;
};

const getAttributeDefinition = t => {
    const e = qt(ue, t) ?? getDefinitionFromStaticAu(t, ce, CustomAttributeDefinition.create);
    if (e === void 0) {
        throw createMappedError(759, t);
    }
    return e;
};

const findClosestControllerByName = (t, e) => {
    let i = "";
    let s = "";
    if (isString(e)) {
        i = getAttributeKeyFrom(e);
        s = e;
    } else {
        const t = getAttributeDefinition(e);
        i = t.key;
        s = t.name;
    }
    let n = t;
    while (n !== null) {
        const t = getRef(n, i);
        if (t?.is(s)) {
            return t;
        }
        n = getEffectiveParentNode(n);
    }
    return null;
};

const fe = ct({
    name: ue,
    keyFrom: getAttributeKeyFrom,
    isType: isAttributeType,
    for: findAttributeControllerFor,
    closest: findClosestControllerByName,
    define: defineAttribute,
    getDefinition: getAttributeDefinition,
    annotate(t, e, i) {
        Ot(i, t, Vt(e));
    },
    getAnnotation: getAttributeAnnotation,
    find(t, e) {
        const i = t.find(ce, e);
        return i === null ? null : qt(ue, i) ?? getDefinitionFromStaticAu(i, ce, CustomAttributeDefinition.create) ?? null;
    }
});

const de = /*@__PURE__*/ Wt("ILifecycleHooks");

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
        while (s !== at) {
            for (const t of ft(s)) {
                if (t !== "constructor" && !t.startsWith("_")) {
                    i.add(t);
                }
            }
            s = Object.getPrototypeOf(s);
        }
        return new LifecycleHooksDefinition(e, i);
    }
}

const me = /*@__PURE__*/ (() => {
    const t = new WeakMap;
    const e = new WeakMap;
    return ct({
        define(t, i) {
            const s = LifecycleHooksDefinition.create(t, i);
            const n = s.Type;
            e.set(n, s);
            return y.define(n, (t => {
                Ut(de, n).register(t);
            }));
        },
        resolve(i) {
            let s = t.get(i);
            if (s === void 0) {
                t.set(i, s = new LifecycleHooksLookupImpl);
                const n = i.root;
                const r = n === i ? i.getAll(de) : i.has(de, false) ? n.getAll(de).concat(i.getAll(de)) : n.getAll(de);
                let l;
                let a;
                let h;
                let c;
                let u;
                for (l of r) {
                    a = e.get(l.constructor);
                    h = new LifecycleHooksEntry(a, l);
                    for (c of a.propertyNames) {
                        u = s[c];
                        if (u === void 0) {
                            s[c] = [ h ];
                        } else {
                            u.push(h);
                        }
                    }
                }
            }
            return s;
        }
    });
})();

class LifecycleHooksLookupImpl {}

function lifecycleHooks() {
    return function decorator(t, e) {
        return me.define({}, t);
    };
}

function valueConverter(t) {
    return function(e, i) {
        i.addInitializer((function() {
            ve.define(t, this);
        }));
        return e;
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
        return new ValueConverterDefinition(e, f(getConverterAnnotation(e, "name"), i), d(getConverterAnnotation(e, "aliases"), s.aliases, e.aliases), ve.keyFrom(i));
    }
    register(t, e) {
        const i = this.Type;
        const s = typeof e === "string" ? getValueConverterKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(s, false)) {
            t.register(t.has(i, false) ? null : Ut(i, i), zt(i, s), ...n.map((t => zt(i, getValueConverterKeyFrom(t)))));
        }
    }
}

const ge = "value-converter";

const pe = /*@__PURE__*/ p(ge);

const getConverterAnnotation = (t, e) => qt(Vt(e), t);

const getValueConverterKeyFrom = t => `${pe}:${t}`;

const ve = ct({
    name: pe,
    keyFrom: getValueConverterKeyFrom,
    isType(t) {
        return isFunction(t) && (Ft(pe, t) || t.$au?.type === ge);
    },
    define(t, e) {
        const i = ValueConverterDefinition.create(t, e);
        const s = i.Type;
        Ot(i, s, pe, m);
        return s;
    },
    getDefinition(t) {
        const e = qt(pe, t) ?? getDefinitionFromStaticAu(t, ge, ValueConverterDefinition.create);
        if (e === void 0) {
            throw createMappedError(152, t);
        }
        return e;
    },
    annotate(t, e, i) {
        Ot(i, t, Vt(e));
    },
    getAnnotation: getConverterAnnotation,
    find(t, e) {
        const i = t.find(ge, e);
        return i == null ? null : qt(pe, i) ?? getDefinitionFromStaticAu(i, ge, ValueConverterDefinition.create) ?? null;
    },
    get(t, e) {
        return t.get(g(getValueConverterKeyFrom(e)));
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
        if (t !== Rt(i.ast, i.s, i, null)) {
            this.v = t;
            this.B.add(this);
        }
    }
}

const mixinUseScope = t => {
    defineHiddenProp(t.prototype, "useScope", useScope);
};

const mixinAstEvaluator = (t, e = true) => i => {
    const s = i.prototype;
    if (t != null) {
        pt(s, "strict", {
            enumerable: true,
            get: function() {
                return t;
            }
        });
    }
    pt(s, "strictFnCall", {
        enumerable: true,
        get: function() {
            return e;
        }
    });
    defineHiddenProp(s, "get", evaluatorGet);
    defineHiddenProp(s, "getSignaler", evaluatorGetSignaler);
    defineHiddenProp(s, "getConverter", evaluatorGetConverter);
    defineHiddenProp(s, "getBehavior", evaluatorGetBehavior);
};

const be = new WeakMap;

const we = new WeakMap;

class ResourceLookup {}

const ye = /*@__PURE__*/ Wt("IFlushQueue", (t => t.singleton(FlushQueue)));

class FlushQueue {
    constructor() {
        this.R = false;
        this.T = new Set;
    }
    get count() {
        return this.T.size;
    }
    add(t) {
        this.T.add(t);
        if (this.R) {
            return;
        }
        this.R = true;
        try {
            this.T.forEach(flushItem);
        } finally {
            this.R = false;
        }
    }
    clear() {
        this.T.clear();
        this.R = false;
    }
}

function useScope(t) {
    this.s = t;
}

function evaluatorGet(t) {
    return this.l.get(t);
}

function evaluatorGetSignaler() {
    return this.l.root.get(se);
}

function evaluatorGetConverter(t) {
    let e = be.get(this);
    if (e == null) {
        be.set(this, e = new ResourceLookup);
    }
    return e[t] ??= ve.get(this.l, t);
}

function evaluatorGetBehavior(t) {
    let e = we.get(this);
    if (e == null) {
        we.set(this, e = new ResourceLookup);
    }
    return e[t] ??= Jt.get(this.l, t);
}

function flushItem(t, e, i) {
    i.delete(t);
    t.flush();
}

const xe = new WeakSet;

const mixingBindingLimited = (t, e) => {
    defineHiddenProp(t.prototype, "limit", (function(t) {
        if (xe.has(this)) {
            throw createMappedError(9996);
        }
        xe.add(this);
        const i = e(this, t);
        const s = t.signals;
        const n = s.length > 0 ? this.get(se) : null;
        const r = this[i];
        const callOriginal = (...t) => r.call(this, ...t);
        const l = t.type === "debounce" ? debounced(t, callOriginal, this) : throttled(t, callOriginal, this);
        const a = n ? {
            handleChange: l.flush
        } : null;
        this[i] = l;
        if (n) {
            s.forEach((t => addSignalListener(n, t, a)));
        }
        return {
            dispose: () => {
                if (n) {
                    s.forEach((t => removeSignalListener(n, t, a)));
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
    const a = t.queue;
    const callOriginalCallback = () => e(r);
    const fn = e => {
        r = e;
        if (i.isBound) {
            n = s;
            s = a.queueTask(callOriginalCallback, {
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
        s?.cancel();
        n = s = void 0;
    };
    fn.flush = () => {
        l = s?.status === xt;
        h();
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
    let a;
    let h = false;
    const c = t.queue;
    const now = () => t.now();
    const callOriginalCallback = () => e(a);
    const fn = e => {
        a = e;
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
        h = s?.status === xt;
        u();
        if (h) {
            callOriginalCallback();
        }
    };
    return fn;
};

const Ce = {
    reusable: false,
    preempt: true
};

class AttributeBinding {
    constructor(t, e, i, s, n, r, l, a, h) {
        this.targetAttribute = l;
        this.targetProperty = a;
        this.mode = h;
        this.isBound = false;
        this.s = void 0;
        this.I = null;
        this.v = void 0;
        this.boundFn = false;
        this.l = e;
        this.ast = n;
        this.P = t;
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
                let n = lt(t);
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
                    e.setAttribute(i, lt(t));
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
        const e = Rt(this.ast, this.s, this, (this.mode & Pt) > 0 ? this : null);
        this.obs.clear();
        if (e !== this.v) {
            this.v = e;
            const i = this.P.state !== Vi;
            if (i) {
                t = this.I;
                this.I = this.A.queueTask((() => {
                    this.I = null;
                    this.updateTarget(e);
                }), Ce);
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
        Tt(this.ast, t, this);
        if (this.mode & (Pt | It)) {
            this.updateTarget(this.v = Rt(this.ast, t, this, (this.mode & Pt) > 0 ? this : null));
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        Et(this.ast, this.s, this);
        this.s = void 0;
        this.v = void 0;
        this.I?.cancel();
        this.I = null;
        this.obs.clearAll();
    }
}

mixinUseScope(AttributeBinding);

mixingBindingLimited(AttributeBinding, (() => "updateTarget"));

$(AttributeBinding, null);

mixinAstEvaluator(true)(AttributeBinding);

const ke = {
    reusable: false,
    preempt: true
};

class InterpolationBinding {
    constructor(t, e, i, s, n, r, l, a) {
        this.ast = n;
        this.target = r;
        this.targetProperty = l;
        this.mode = a;
        this.isBound = false;
        this.s = void 0;
        this.I = null;
        this.P = t;
        this.oL = i;
        this.A = s;
        this.L = i.getAccessor(r, l);
        const h = n.expressions;
        const c = this.partBindings = Array(h.length);
        const u = h.length;
        let f = 0;
        for (;u > f; ++f) {
            c[f] = new InterpolationPartBinding(h[f], r, l, e, i, this);
        }
    }
    M() {
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
        const r = this.L;
        const l = this.P.state !== Vi && (r.type & Bt) > 0;
        let a;
        if (l) {
            a = this.I;
            this.I = this.A.queueTask((() => {
                this.I = null;
                r.setValue(s, this.target, this.targetProperty);
            }), ke);
            a?.cancel();
            a = null;
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
        this.I?.cancel();
        this.I = null;
    }
}

class InterpolationPartBinding {
    constructor(t, e, i, s, n, r) {
        this.ast = t;
        this.target = e;
        this.targetProperty = i;
        this.owner = r;
        this.mode = Pt;
        this.task = null;
        this.isBound = false;
        this.v = "";
        this.boundFn = false;
        this.l = s;
        this.oL = n;
    }
    updateTarget() {
        this.owner.M();
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = Rt(this.ast, this.s, this, (this.mode & Pt) > 0 ? this : null);
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
        Tt(this.ast, t, this);
        this.v = Rt(this.ast, this.s, this, (this.mode & Pt) > 0 ? this : null);
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
        Et(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

mixinUseScope(InterpolationPartBinding);

mixingBindingLimited(InterpolationPartBinding, (() => "updateTarget"));

$(InterpolationPartBinding, null);

mixinAstEvaluator(true)(InterpolationPartBinding);

const Ae = {
    reusable: false,
    preempt: true
};

class ContentBinding {
    constructor(t, e, i, s, n, r, l) {
        this.p = n;
        this.ast = r;
        this.target = l;
        this.isBound = false;
        this.mode = Pt;
        this.I = null;
        this.v = "";
        this._ = false;
        this.boundFn = false;
        this.strict = true;
        this.l = e;
        this.P = t;
        this.oL = i;
        this.A = s;
    }
    updateTarget(t) {
        const e = this.target;
        const i = this.v;
        this.v = t;
        if (this._) {
            i.parentNode?.removeChild(i);
            this._ = false;
        }
        if (t instanceof this.p.Node) {
            e.parentNode?.insertBefore(t, e);
            t = "";
            this._ = true;
        }
        e.textContent = lt(t ?? "");
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = Rt(this.ast, this.s, this, (this.mode & Pt) > 0 ? this : null);
        this.obs.clear();
        if (t === this.v) {
            this.I?.cancel();
            this.I = null;
            return;
        }
        const e = this.P.state !== Vi;
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
        const t = this.v = Rt(this.ast, this.s, this, (this.mode & Pt) > 0 ? this : null);
        this.obs.clear();
        if (isArray(t)) {
            this.observeCollection(t);
        }
        const e = this.P.state !== Vi;
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
        Tt(this.ast, t, this);
        const e = this.v = Rt(this.ast, this.s, this, (this.mode & Pt) > 0 ? this : null);
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
        Et(this.ast, this.s, this);
        if (this._) {
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
        }), Ae);
        e?.cancel();
    }
}

mixinUseScope(ContentBinding);

mixingBindingLimited(ContentBinding, (() => "updateTarget"));

$(ContentBinding, null);

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
        this.F = n;
    }
    updateTarget() {
        this.target[this.targetProperty] = this.v;
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        this.v = Rt(this.ast, this.s, this, this);
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
        this.target = this.F ? t.bindingContext : t.overrideContext;
        Tt(this.ast, t, this);
        this.v = Rt(this.ast, this.s, this, this);
        this.updateTarget();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        Et(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

mixinUseScope(LetBinding);

mixingBindingLimited(LetBinding, (() => "updateTarget"));

$(LetBinding, null);

mixinAstEvaluator(true)(LetBinding);

class PropertyBinding {
    constructor(t, e, i, s, n, r, l, a) {
        this.ast = n;
        this.target = r;
        this.targetProperty = l;
        this.mode = a;
        this.isBound = false;
        this.s = void 0;
        this.L = void 0;
        this.I = null;
        this.O = null;
        this.boundFn = false;
        this.l = e;
        this.P = t;
        this.A = s;
        this.oL = i;
    }
    updateTarget(t) {
        this.L.setValue(t, this.target, this.targetProperty);
    }
    updateSource(t) {
        St(this.ast, this.s, this, t);
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = Rt(this.ast, this.s, this, (this.mode & Pt) > 0 ? this : null);
        this.obs.clear();
        const e = this.P.state !== Vi && (this.L.type & Bt) > 0;
        if (e) {
            Be = this.I;
            this.I = this.A.queueTask((() => {
                this.updateTarget(t);
                this.I = null;
            }), Se);
            Be?.cancel();
            Be = null;
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
        Tt(this.ast, t, this);
        const e = this.oL;
        const i = this.mode;
        let s = this.L;
        if (!s) {
            if (i & Lt) {
                s = e.getObserver(this.target, this.targetProperty);
            } else {
                s = e.getAccessor(this.target, this.targetProperty);
            }
            this.L = s;
        }
        const n = (i & Pt) > 0;
        if (i & (Pt | It)) {
            this.updateTarget(Rt(this.ast, this.s, this, n ? this : null));
        }
        if (i & Lt) {
            s.subscribe(this.O ??= new BindingTargetSubscriber(this, this.l.get(ye)));
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
        Et(this.ast, this.s, this);
        this.s = void 0;
        if (this.O) {
            this.L.unsubscribe(this.O);
            this.O = null;
        }
        this.I?.cancel();
        this.I = null;
        this.obs.clearAll();
    }
    useTargetObserver(t) {
        this.L?.unsubscribe(this);
        (this.L = t).subscribe(this);
    }
    useTargetSubscriber(t) {
        if (this.O != null) {
            throw createMappedError(9995);
        }
        this.O = t;
    }
}

mixinUseScope(PropertyBinding);

mixingBindingLimited(PropertyBinding, (t => t.mode & Lt ? "updateSource" : "updateTarget"));

$(PropertyBinding, null);

mixinAstEvaluator(true, false)(PropertyBinding);

let Be = null;

const Se = {
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
        Tt(this.ast, t, this);
        St(this.ast, this.s, this, this.target);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        if (Rt(this.ast, this.s, this, null) === this.target) {
            St(this.ast, this.s, this, null);
        }
        Et(this.ast, this.s, this);
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
        this.H = null;
        this.l = t;
        this.V = n;
        this.H = r;
    }
    callSource(t) {
        const e = this.s.overrideContext;
        e.$event = t;
        let i = Rt(this.ast, this.s, this, null);
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
        if (this.H?.(t) !== false) {
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
        Tt(this.ast, t, this);
        this.target.addEventListener(this.targetEvent, this, this.V);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        Et(this.ast, this.s, this);
        this.s = void 0;
        this.target.removeEventListener(this.targetEvent, this, this.V);
    }
}

mixinUseScope(ListenerBinding);

mixingBindingLimited(ListenerBinding, (() => "callSource"));

mixinAstEvaluator(true, true)(ListenerBinding);

const Re = /*@__PURE__*/ Wt("IEventModifier");

const Te = /*@__PURE__*/ Wt("IKeyMapping", (t => t.instance({
    meta: ct([ "ctrl", "alt", "shift", "meta" ]),
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
        this.$ = v(Te);
        this.N = [ "left", "middle", "right" ];
    }
    static register(t) {
        t.register(Ut(Re, ModifiedMouseEventHandler));
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
                    if (t.button !== this.N.indexOf(n)) return false;
                    continue;
                }
                if (this.$.meta.includes(n) && t[`${n}Key`] !== true) {
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
        this.$ = v(Te);
        this.type = [ "keydown", "keyup" ];
    }
    static register(t) {
        t.register(Ut(Re, ModifiedKeyboardEventHandler));
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
            if (i) t.preventDefault();
            if (s) t.stopPropagation();
            return true;
        };
    }
}

const Ee = /*@__PURE__*/ Wt("IEventModifierHandler", (t => t.instance({
    getHandler: () => null
})));

class EventModifier {
    constructor() {
        this.j = v(x(Re)).reduce(((t, e) => {
            const i = isArray(e.type) ? e.type : [ e.type ];
            i.forEach((i => t[i] = e));
            return t;
        }), {});
    }
    static register(t) {
        t.register(Ut(Ee, EventModifier));
    }
    getHandler(t, e) {
        return isString(e) ? this.j[t]?.getHandler(e) ?? null : null;
    }
}

const Ie = {
    register(t) {
        t.register(EventModifier, ModifiedMouseEventHandler, ModifiedKeyboardEventHandler);
    }
};

const Pe = /*@__PURE__*/ Wt("IViewFactory");

class ViewFactory {
    constructor(t, e) {
        this.isCaching = false;
        this.W = null;
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
            this.W = [];
        } else {
            this.W = null;
        }
        this.isCaching = this.U > 0;
    }
    canReturnToCache(t) {
        return this.W != null && this.W.length < this.U;
    }
    tryReturnToCache(t) {
        if (this.canReturnToCache(t)) {
            this.W.push(t);
            return true;
        }
        return false;
    }
    create(t) {
        const e = this.W;
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

const Le = "au-start";

const De = "au-end";

const createElement = (t, e) => t.document.createElement(e);

const createComment = (t, e) => t.document.createComment(e);

const createLocation = t => {
    const e = createComment(t, De);
    e.$start = createComment(t, Le);
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

const Me = "default";

const _e = "au-slot";

const qe = /*@__PURE__*/ Wt("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

const Fe = /*@__PURE__*/ Wt("IAuSlotWatcher");

class AuSlotWatcherBinding {
    constructor(t, e, i, s) {
        this.G = new Set;
        this.K = w;
        this.isBound = false;
        this.cb = (this.o = t)[e];
        this.slotName = i;
        this.X = s;
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
        const i = this.K;
        const s = [];
        let n;
        let r;
        for (n of this.G) {
            for (r of n === t ? e : n.nodes) {
                if (this.X === "*" || isElement(r) && r.matches(this.X)) {
                    s[s.length] = r;
                }
            }
        }
        if (s.length !== i.length || s.some(((t, e) => t !== i[e]))) {
            this.K = s;
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
        this.Y = t;
    }
    register(t) {
        Gt(de, this).register(t);
    }
    hydrating(t, e) {
        const i = this.Y;
        const s = new AuSlotWatcherBinding(t, i.callback ?? `${lt(i.name)}Changed`, i.slotName ?? "default", i.query ?? "*");
        pt(t, i.name, {
            enumerable: true,
            configurable: true,
            get: ut((() => s.getValue()), {
                getObserver: () => s
            }),
            set: () => {}
        });
        Gt(Fe, s).register(e.container);
        e.addBinding(s);
    }
}

function slotted(t, e) {
    if (!Oe) {
        Oe = true;
        N(AuSlotWatcherBinding);
        lifecycleHooks()(SlottedLifecycleHooks, null);
    }
    const i = Vt("dependencies");
    function decorator(s, n) {
        if (n.kind !== "field") throw createMappedError(9990);
        const r = typeof t === "object" ? t : {
            query: t,
            slotName: e,
            name: ""
        };
        r.name = n.name;
        const l = n.metadata[i] ??= [];
        l.push(new SlottedLifecycleHooks(r));
    }
    return decorator;
}

let Oe = false;

class SpreadBinding {
    static create(t, e, i, s, n, r, l, a) {
        const h = [];
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
            const f = n.compileSpread(s.controller.definition, s.instruction?.captures ?? w, s.controller.container, e, i);
            let d;
            for (d of f) {
                switch (d.type) {
                  case si:
                    renderSpreadInstruction(t + 1);
                    break;

                  case ni:
                    c[d.instructions.type].render(u, findElementControllerFor(e), d.instructions, r, l, a);
                    break;

                  default:
                    c[d.type].render(u, e, d, r, l, a);
                }
            }
            h.push(u);
        };
        renderSpreadInstruction(0);
        return h;
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
        if (t.vmKind !== Fi) {
            throw createMappedError(9998);
        }
        this.$controller.addChild(t);
    }
}

const He = "ra";

const Ve = "rb";

const $e = "rc";

const Ne = "rd";

const je = "re";

const We = "rf";

const Ue = "rg";

const ze = "ri";

const Ge = "rj";

const Ke = "rk";

const Xe = "rl";

const Qe = "ha";

const Ye = "hb";

const Ze = "hc";

const Je = "hd";

const ti = "he";

const ei = "hf";

const ii = "hg";

const si = "hs";

const ni = "hp";

const ri = /*@__PURE__*/ ct({
    hydrateElement: He,
    hydrateAttribute: Ve,
    hydrateTemplateController: $e,
    hydrateLetElement: Ne,
    setProperty: je,
    interpolation: We,
    propertyBinding: Ue,
    letBinding: ze,
    refBinding: Ge,
    iteratorBinding: Ke,
    multiAttr: Xe,
    textBinding: Qe,
    listenerBinding: Ye,
    attributeBinding: Ze,
    stylePropertyBinding: Je,
    setAttribute: ti,
    setClassAttribute: ei,
    setStyleAttribute: ii,
    spreadBinding: si,
    spreadElementProp: ni
});

const oi = /*@__PURE__*/ Wt("Instruction");

function isInstruction(t) {
    const e = t.type;
    return isString(e) && e.length === 2;
}

class InterpolationInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = We;
    }
}

class PropertyBindingInstruction {
    constructor(t, e, i) {
        this.from = t;
        this.to = e;
        this.mode = i;
        this.type = Ue;
    }
}

class IteratorBindingInstruction {
    constructor(t, e, i) {
        this.forOf = t;
        this.to = e;
        this.props = i;
        this.type = Ke;
    }
}

class RefBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Ge;
    }
}

class SetPropertyInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = je;
    }
}

class MultiAttrInstruction {
    constructor(t, e, i) {
        this.value = t;
        this.to = e;
        this.command = i;
        this.type = Xe;
    }
}

class HydrateElementInstruction {
    constructor(t, e, i, s, n, r) {
        this.res = t;
        this.props = e;
        this.projections = i;
        this.containerless = s;
        this.captures = n;
        this.data = r;
        this.type = He;
    }
}

class HydrateAttributeInstruction {
    constructor(t, e, i) {
        this.res = t;
        this.alias = e;
        this.props = i;
        this.type = Ve;
    }
}

class HydrateTemplateController {
    constructor(t, e, i, s) {
        this.def = t;
        this.res = e;
        this.alias = i;
        this.props = s;
        this.type = $e;
    }
}

class HydrateLetElementInstruction {
    constructor(t, e) {
        this.instructions = t;
        this.toBindingContext = e;
        this.type = Ne;
    }
}

class LetBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = ze;
    }
}

class TextBindingInstruction {
    constructor(t) {
        this.from = t;
        this.type = Qe;
    }
}

class ListenerBindingInstruction {
    constructor(t, e, i, s) {
        this.from = t;
        this.to = e;
        this.capture = i;
        this.modifier = s;
        this.type = Ye;
    }
}

class StylePropertyBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Je;
    }
}

class SetAttributeInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = ti;
    }
}

class SetClassAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = ei;
    }
}

class SetStyleAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = ii;
    }
}

class AttributeBindingInstruction {
    constructor(t, e, i) {
        this.attr = t;
        this.from = e;
        this.to = i;
        this.type = Ze;
    }
}

class SpreadBindingInstruction {
    constructor() {
        this.type = si;
    }
}

class SpreadElementPropBindingInstruction {
    constructor(t) {
        this.instructions = t;
        this.type = ni;
    }
}

const li = /*@__PURE__*/ Wt("ITemplateCompiler");

const ai = /*@__PURE__*/ Wt("IRenderer");

function renderer(t) {
    return function decorator(e) {
        pt(e.prototype, "target", {
            configurable: true,
            get() {
                return t;
            }
        });
        return y.define(e, (function(t) {
            Ut(ai, this).register(t);
        }));
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

class SetPropertyRenderer {
    render(t, e, i) {
        const s = getTarget(e);
        if (s.$observers?.[i.to] !== void 0) {
            s.$observers[i.to].setValue(i.value);
        } else {
            s[i.to] = i.value;
        }
    }
}

renderer(je)(SetPropertyRenderer, null);

class CustomElementRenderer {
    constructor() {
        this.r = v(vi);
    }
    render(t, e, i, s, n, r) {
        let l;
        let a;
        let h;
        const c = i.res;
        const u = i.projections;
        const f = t.container;
        switch (typeof c) {
          case "string":
            l = fs.find(f, c);
            if (l == null) {
                throw createMappedError(752, i, t);
            }
            break;

          default:
            l = c;
        }
        const d = i.containerless || l.containerless;
        const m = d ? convertToRenderLocation(e) : null;
        const g = createElementContainer(s, t, e, i, m, u == null ? void 0 : new AuSlotsInfo(dt(u)));
        a = g.invoke(l.Type);
        h = Controller.$el(g, a, e, i, l, m);
        setRef(e, l.key, h);
        const p = this.r.renderers;
        const v = i.props;
        const b = v.length;
        let w = 0;
        let y;
        while (b > w) {
            y = v[w];
            p[y.type].render(t, h, y, s, n, r);
            ++w;
        }
        t.addChild(h);
    }
}

renderer(He)(CustomElementRenderer, null);

class CustomAttributeRenderer {
    constructor() {
        this.r = v(vi);
    }
    render(t, e, i, s, n, r) {
        let l = t.container;
        let a;
        switch (typeof i.res) {
          case "string":
            a = fe.find(l, i.res);
            if (a == null) {
                throw createMappedError(753, i, t);
            }
            break;

          default:
            a = i.res;
        }
        const h = invokeAttribute(s, a, t, e, i, void 0, void 0);
        const c = Controller.$attr(h.ctn, h.vm, e, a);
        setRef(e, a.key, c);
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
}

renderer(Ve)(CustomAttributeRenderer, null);

class TemplateControllerRenderer {
    constructor() {
        this.r = v(vi);
    }
    render(t, e, i, s, n, r) {
        let l = t.container;
        let a;
        switch (typeof i.res) {
          case "string":
            a = fe.find(l, i.res);
            if (a == null) {
                throw createMappedError(754, i, t);
            }
            break;

          default:
            a = i.res;
        }
        const h = this.r.getViewFactory(i.def, a.containerStrategy === "new" ? l.createChild({
            inheritParentResources: true
        }) : l);
        const c = convertToRenderLocation(e);
        const u = invokeAttribute(s, a, t, e, i, h, c);
        const f = Controller.$attr(u.ctn, u.vm, e, a);
        setRef(c, a.key, f);
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
}

renderer($e)(TemplateControllerRenderer, null);

class LetElementRenderer {
    render(t, e, i, s, n, r) {
        e.remove();
        const l = i.instructions;
        const a = i.toBindingContext;
        const h = t.container;
        const c = l.length;
        let u;
        let f;
        let d = 0;
        while (c > d) {
            u = l[d];
            f = ensureExpression(n, u.from, yt);
            t.addBinding(new LetBinding(h, r, f, u.to, a));
            ++d;
        }
    }
}

renderer(Ne)(LetElementRenderer, null);

class RefBindingRenderer {
    render(t, e, i, s, n) {
        t.addBinding(new RefBinding(t.container, ensureExpression(n, i.from, yt), getRefTarget(e, i.to)));
    }
}

renderer(Ge)(RefBindingRenderer, null);

class InterpolationBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new InterpolationBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, vt), getTarget(e), i.to, Pt));
    }
}

renderer(We)(InterpolationBindingRenderer, null);

class PropertyBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, yt), getTarget(e), i.to, i.mode));
    }
}

renderer(Ue)(PropertyBindingRenderer, null);

class IteratorBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.forOf, bt), getTarget(e), i.to, Pt));
    }
}

renderer(Ke)(IteratorBindingRenderer, null);

class TextBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, s.domWriteQueue, s, ensureExpression(n, i.from, yt), e));
    }
}

renderer(Qe)(TextBindingRenderer, null);

const hi = Wt("IListenerBindingOptions", (t => t.instance({
    prevent: false
})));

class ListenerBindingRenderer {
    constructor() {
        this.tt = v(Ee);
        this.et = v(hi);
    }
    render(t, e, i, s, n) {
        t.addBinding(new ListenerBinding(t.container, ensureExpression(n, i.from, wt), e, i.to, new ListenerBindingOptions(this.et.prevent, i.capture), this.tt.getHandler(i.to, i.modifier)));
    }
}

renderer(Ye)(ListenerBindingRenderer, null);

class SetAttributeRenderer {
    render(t, e, i) {
        e.setAttribute(i.to, i.value);
    }
}

renderer(ti)(SetAttributeRenderer, null);

class SetClassAttributeRenderer {
    render(t, e, i) {
        addClasses(e.classList, i.value);
    }
}

renderer(ei)(SetClassAttributeRenderer, null);

class SetStyleAttributeRenderer {
    render(t, e, i) {
        e.style.cssText += i.value;
    }
}

renderer(ii)(SetStyleAttributeRenderer, null);

class StylePropertyBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, ensureExpression(n, i.from, yt), e.style, i.to, Pt));
    }
}

renderer(Je)(StylePropertyBindingRenderer, null);

class AttributeBindingRenderer {
    render(t, e, i, s, n, r) {
        const l = t.container;
        const a = l.has(es, false) ? l.get(es) : null;
        t.addBinding(new AttributeBinding(t, l, r, s.domWriteQueue, ensureExpression(n, i.from, yt), e, i.attr, a == null ? i.to : i.to.split(/\s/g).map((t => a[t] ?? t)).join(" "), Pt));
    }
}

renderer(Ze)(AttributeBindingRenderer, null);

class SpreadRenderer {
    constructor() {
        this.it = v(li);
        this.r = v(vi);
    }
    render(t, e, i, s, n, r) {
        SpreadBinding.create(t.container.get(Ki), e, void 0, this.r, this.it, s, n, r).forEach((e => t.addBinding(e)));
    }
}

renderer(si)(SpreadRenderer, null);

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

const ci = "IController";

const ui = "IInstruction";

const fi = "IRenderLocation";

const di = "ISlotsInfo";

function createElementContainer(t, e, i, s, n, r) {
    const l = e.container.createChild();
    registerHostNode(l, t, i);
    registerResolver(l, Gi, new C(ci, e));
    registerResolver(l, oi, new C(ui, s));
    registerResolver(l, ts, n == null ? mi : new RenderLocationProvider(n));
    registerResolver(l, Pe, gi);
    registerResolver(l, qe, r == null ? pi : new C(di, r));
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

function invokeAttribute(t, e, i, s, n, r, l, a) {
    const h = i instanceof Controller ? i : i.$controller;
    const c = h.container.createChild();
    registerHostNode(c, t, s);
    registerResolver(c, Gi, new C(ci, h));
    registerResolver(c, oi, new C(ui, n));
    registerResolver(c, ts, l == null ? mi : new C(fi, l));
    registerResolver(c, Pe, r == null ? gi : new ViewFactoryProvider(r));
    registerResolver(c, qe, a == null ? pi : new C(di, a));
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

const mi = new RenderLocationProvider(null);

const gi = new ViewFactoryProvider(null);

const pi = new C(di, new AuSlotsInfo(w));

const vi = /*@__PURE__*/ Wt("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.st ??= this.nt.getAll(ai, false).reduce(((t, e) => {
            t[e.target] = e;
            return t;
        }), createLookup());
    }
    constructor() {
        this.rt = new WeakMap;
        this.ot = new WeakMap;
        const t = this.nt = v(k).root;
        this.p = t.get(ae);
        this.ep = t.get(e);
        this.oL = t.get(j);
        this.lt = new FragmentNodeSequence(this.p, this.p.document.createDocumentFragment());
    }
    compile(t, e, i) {
        if (t.needsCompile !== false) {
            const s = this.rt;
            const n = e.get(li);
            let r = s.get(t);
            if (r == null) {
                s.set(t, r = n.compile(CustomElementDefinition.getOrCreate(t), e, i));
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
        let i = false;
        const s = this.ot;
        const n = this.p;
        const r = n.document;
        if (s.has(t)) {
            e = s.get(t);
        } else {
            const l = t.template;
            let a;
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
                a = r.createElement("template");
                if (isString(l)) {
                    a.innerHTML = l;
                }
                e = a.content;
                i = true;
            }
            this.ht(e);
            s.set(t, e);
        }
        return e == null ? this.lt : new FragmentNodeSequence(this.p, i ? r.importNode(e, true) : r.adoptNode(e.cloneNode(true)));
    }
    render(t, e, i, s) {
        const n = i.instructions;
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
        if (s != null) {
            u = i.surrogates;
            if ((c = u.length) > 0) {
                h = 0;
                while (c > h) {
                    f = u[h];
                    r[f.type].render(t, s, f, this.p, this.ep, this.oL);
                    ++h;
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
        let i = e.firstChild;
        let s = null;
        while (i != null) {
            if (i.nodeType === 8 && i.nodeValue === "au*") {
                s = i.nextSibling;
                e.removeChild(i);
                e.insertBefore(this.ct(), s);
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
                addListener(this.ut, e, this);
            }
            this.ft = true;
            this.dt?.();
        }
    }));
    defineHiddenProp(i, "unsubscribe", (function(t) {
        if (this.subs.remove(t) && this.subs.count === 0) {
            for (e of this.cf.events) {
                removeListener(this.ut, e, this);
            }
            this.ft = false;
            this.gt?.();
        }
    }));
    defineHiddenProp(i, "useConfig", (function(t) {
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

const mixinNoopSubscribable = t => {
    defineHiddenProp(t.prototype, "subscribe", h);
    defineHiddenProp(t.prototype, "unsubscribe", h);
};

class ClassAttributeAccessor {
    get doNotCache() {
        return true;
    }
    constructor(t) {
        this.obj = t;
        this.type = At | Bt;
        this.v = "";
        this.vt = {};
        this.bt = 0;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (t !== this.v) {
            this.v = t;
            this.wt();
        }
    }
    wt() {
        const t = this.vt;
        const e = ++this.bt;
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
                t[l] = this.bt;
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
        return w;
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
            return w;
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
        return w;
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
        const e = ut({}, ...this.modules);
        const i = defineAttribute({
            name: "class",
            bindables: [ "value" ],
            noMultiBindings: true
        }, class CustomAttributeClass {
            constructor() {
                this.yt = new ClassAttributeAccessor(v(Zi));
                this.value = "";
            }
            binding() {
                this.valueChanged();
            }
            valueChanged() {
                this.yt.setValue(this.value?.split(/\s+/g).map((t => e[t] || t)) ?? "");
            }
        });
        t.register(i, Gt(es, e));
    }
}

function shadowCSS(...t) {
    return new ShadowDOMRegistry(t);
}

const bi = /*@__PURE__*/ Wt("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
    if (AdoptedStyleSheetsStyles.supported(t.get(ae))) {
        return t.get(AdoptedStyleSheetsStylesFactory);
    }
    return t.get(StyleElementStylesFactory);
}))));

class ShadowDOMRegistry {
    constructor(t) {
        this.css = t;
    }
    register(t) {
        const e = t.get(yi);
        const i = t.get(bi);
        t.register(Gt(wi, i.createStyles(this.css, e)));
    }
}

class AdoptedStyleSheetsStylesFactory {
    constructor() {
        this.p = v(ae);
        this.cache = new Map;
    }
    createStyles(t, e) {
        return new AdoptedStyleSheetsStyles(this.p, t, this.cache, e);
    }
}

class StyleElementStylesFactory {
    constructor() {
        this.p = v(ae);
    }
    createStyles(t, e) {
        return new StyleElementStyles(this.p, t, e);
    }
}

const wi = /*@__PURE__*/ Wt("IShadowDOMStyles");

const yi = /*@__PURE__*/ Wt("IShadowDOMGlobalStyles", (t => t.instance({
    applyTo: h
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

const xi = {
    shadowDOM(t) {
        return le.creating(k, (e => {
            if (t.sharedStyles != null) {
                const i = e.get(bi);
                e.register(Gt(yi, i.createStyles(t.sharedStyles, null)));
            }
        }));
    }
};

const {enter: Ci, exit: ki} = W;

const {wrap: Ai, unwrap: Bi} = U;

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
        if (!gt(i, e)) {
            this.cb.call(t, i, e, t);
        }
    }
    compute() {
        this.running = true;
        this.obs.version++;
        try {
            Ci(this);
            return this.v = Bi(this.$get.call(void 0, this.useProxy ? Ai(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            ki(this);
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
        this.xt = s;
        this.cb = n;
    }
    handleChange(t) {
        const e = this.xt;
        const i = this.obj;
        const s = this.v;
        const n = e.$kind === "AccessScope" && this.obs.count === 1;
        if (!n) {
            this.obs.version++;
            t = Rt(e, this.scope, this, this);
            this.obs.clear();
        }
        if (!gt(t, s)) {
            this.v = t;
            this.cb.call(i, t, s, i);
        }
    }
    bind() {
        if (this.isBound) {
            return;
        }
        this.obs.version++;
        this.v = Rt(this.xt, this.scope, this, this);
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

$(ComputedWatcher, null);

$(ExpressionWatcher, null);

mixinAstEvaluator(true)(ExpressionWatcher);

class Controller {
    get lifecycleHooks() {
        return this.Ct;
    }
    get isActive() {
        return (this.state & (Vi | $i)) > 0 && (this.state & Ni) === 0;
    }
    get name() {
        if (this.parent === null) {
            switch (this.vmKind) {
              case Fi:
                return `[${this.definition.name}]`;

              case qi:
                return this.definition.name;

              case Oi:
                return this.viewFactory.name;
            }
        }
        switch (this.vmKind) {
          case Fi:
            return `${this.parent.name}>[${this.definition.name}]`;

          case qi:
            return `${this.parent.name}>${this.definition.name}`;

          case Oi:
            return this.viewFactory.name === this.parent.definition?.name ? `${this.parent.name}[view]` : `${this.parent.name}[view:${this.viewFactory.name}]`;
        }
    }
    get viewModel() {
        return this.kt;
    }
    set viewModel(t) {
        this.kt = t;
        this.At = t == null || this.vmKind === Oi ? HooksDefinition.none : new HooksDefinition(t);
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
        this.Bt = false;
        this.hostController = null;
        this.mountTarget = Ri;
        this.shadowRoot = null;
        this.nodes = null;
        this.location = null;
        this.Ct = null;
        this.state = Hi;
        this.St = false;
        this.$initiator = null;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this.Rt = 0;
        this.Tt = 0;
        this.Et = 0;
        this.kt = n;
        this.At = e === Oi ? HooksDefinition.none : new HooksDefinition(n);
        this.location = l;
        this.r = t.root.get(vi);
        this.coercion = e === Oi ? void 0 : t.get(Di);
    }
    static getCached(t) {
        return Si.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (e === void 0) {
            throw createMappedError(500, t);
        }
        return e;
    }
    static $el(t, e, i, s, n = void 0, r = null) {
        if (Si.has(e)) {
            return Si.get(e);
        }
        {
            n = n ?? getElementDefinition(e.constructor);
        }
        registerResolver(t, n.Type, new C(n.key, e, n.Type));
        const l = new Controller(t, qi, n, null, e, i, r);
        const a = t.get(B(Ki));
        if (n.dependencies.length > 0) {
            t.register(...n.dependencies);
        }
        registerResolver(t, Ki, new C("IHydrationContext", new HydrationContext(l, s, a)));
        Si.set(e, l);
        if (s == null || s.hydrate !== false) {
            l.hE(s, a);
        }
        return l;
    }
    static $attr(t, e, i, s) {
        if (Si.has(e)) {
            return Si.get(e);
        }
        s = s ?? getAttributeDefinition(e.constructor);
        registerResolver(t, s.Type, new C(s.key, e, s.Type));
        const n = new Controller(t, Fi, s, null, e, i, null);
        if (s.dependencies.length > 0) {
            t.register(...s.dependencies);
        }
        Si.set(e, n);
        n.It();
        return n;
    }
    static $view(t, e = void 0) {
        const i = new Controller(t.container, Oi, null, t, null, null, null);
        i.parent = e ?? null;
        i.Pt();
        return i;
    }
    hE(t, e) {
        const i = this.container;
        const s = this.kt;
        const n = this.definition;
        this.scope = V.create(s, null, true);
        if (n.watches.length > 0) {
            createWatchers(this, i, n, s);
        }
        createObservers(this, n, s);
        this.Ct = me.resolve(i);
        i.register(n.Type);
        if (n.injectable !== null) {
            registerResolver(i, n.injectable, new C("definition.injectable", s));
        }
        if (t == null || t.hydrate !== false) {
            this.hS(t);
            this.hC();
        }
    }
    hS(t) {
        if (this.Ct.hydrating != null) {
            this.Ct.hydrating.forEach(callHydratingHook, this);
        }
        if (this.At.Lt) {
            this.kt.hydrating(this);
        }
        const e = this.definition;
        const i = this.Dt = this.r.compile(e, this.container, t);
        const s = i.shadowOptions;
        const n = i.hasSlots;
        const r = i.containerless;
        let l = this.host;
        let a = this.location;
        if ((this.hostController = findElementControllerFor(l, Li)) !== null) {
            l = this.host = this.container.root.get(ae).document.createElement(e.name);
            if (r && a == null) {
                a = this.location = convertToRenderLocation(l);
            }
        }
        setRef(l, hs, this);
        setRef(l, e.key, this);
        if (s !== null || n) {
            if (a != null) {
                throw createMappedError(501);
            }
            setRef(this.shadowRoot = l.attachShadow(s ?? _i), hs, this);
            setRef(this.shadowRoot, e.key, this);
            this.mountTarget = Ei;
        } else if (a != null) {
            setRef(a, hs, this);
            setRef(a, e.key, this);
            this.mountTarget = Ii;
        } else {
            this.mountTarget = Ti;
        }
        this.kt.$controller = this;
        this.nodes = this.r.createNodes(i);
        if (this.Ct.hydrated !== void 0) {
            this.Ct.hydrated.forEach(callHydratedHook, this);
        }
        if (this.At.Mt) {
            this.kt.hydrated(this);
        }
    }
    hC() {
        this.r.render(this, this.nodes.findTargets(), this.Dt, this.host);
        if (this.Ct.created !== void 0) {
            this.Ct.created.forEach(callCreatedHook, this);
        }
        if (this.At._t) {
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
        this.Ct = me.resolve(this.container);
        if (this.Ct.created !== void 0) {
            this.Ct.created.forEach(callCreatedHook, this);
        }
        if (this.At._t) {
            this.kt.created(this);
        }
    }
    Pt() {
        this.Dt = this.r.compile(this.viewFactory.def, this.container, null);
        this.r.render(this, (this.nodes = this.r.createNodes(this.Dt)).findTargets(), this.Dt, void 0);
    }
    activate(t, e, i) {
        switch (this.state) {
          case Hi:
          case ji:
            if (!(e === null || e.isActive)) {
                return;
            }
            this.state = Vi;
            break;

          case $i:
            return;

          case Ui:
            throw createMappedError(502, this.name);

          default:
            throw createMappedError(503, this.name, stringifyState(this.state));
        }
        this.parent = e;
        switch (this.vmKind) {
          case qi:
            this.scope.parent = i ?? null;
            break;

          case Fi:
            this.scope = i ?? null;
            break;

          case Oi:
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
        if (this.vmKind !== Oi && this.Ct.binding != null) {
            s = S(...this.Ct.binding.map(callBindingHook, this));
        }
        if (this.At.Ft) {
            s = S(s, this.kt.binding(this.$initiator, this.parent));
        }
        if (isPromise(s)) {
            this.Ot();
            s.then((() => {
                this.Bt = true;
                if (this.state !== Vi) {
                    this.Ht();
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
        if (this.vmKind !== Oi && this.Ct.bound != null) {
            i = S(...this.Ct.bound.map(callBoundHook, this));
        }
        if (this.At.$t) {
            i = S(i, this.kt.bound(this.$initiator, this.parent));
        }
        if (isPromise(i)) {
            this.Ot();
            i.then((() => {
                this.isBound = true;
                if (this.state !== Vi) {
                    this.Ht();
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
    jt(...t) {
        switch (this.mountTarget) {
          case Ti:
            this.host.append(...t);
            break;

          case Ei:
            this.shadowRoot.append(...t);
            break;

          case Ii:
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
              case Ti:
              case Ei:
                this.hostController.jt(this.host);
                break;

              case Ii:
                this.hostController.jt(this.location.$start, this.location);
                break;
            }
        }
        switch (this.mountTarget) {
          case Ti:
            this.nodes.appendTo(this.host, this.definition != null && this.definition.enhance);
            break;

          case Ei:
            {
                const t = this.container;
                const e = t.has(wi, false) ? t.get(wi) : t.get(yi);
                e.applyTo(this.shadowRoot);
                this.nodes.appendTo(this.shadowRoot);
                break;
            }

          case Ii:
            this.nodes.insertBefore(this.location);
            break;
        }
        let t = 0;
        let e = void 0;
        if (this.vmKind !== Oi && this.Ct.attaching != null) {
            e = S(...this.Ct.attaching.map(callAttachingHook, this));
        }
        if (this.At.Wt) {
            e = S(e, this.kt.attaching(this.$initiator, this.parent));
        }
        if (isPromise(e)) {
            this.Ot();
            this.qt();
            e.then((() => {
                this.Ht();
            })).catch((t => {
                this.Vt(t);
            }));
        }
        if (this.children !== null) {
            for (;t < this.children.length; ++t) {
                void this.children[t].activate(this.$initiator, this, this.scope);
            }
        }
        this.Ht();
    }
    deactivate(t, e) {
        let i = void 0;
        switch (this.state & ~Wi) {
          case $i:
            this.state = Ni;
            break;

          case Vi:
            this.state = Ni;
            i = this.$promise?.catch(h);
            break;

          case Hi:
          case ji:
          case Ui:
          case ji | Ui:
            return;

          default:
            throw createMappedError(505, this.name, this.state);
        }
        this.$initiator = t;
        if (t === this) {
            this.Ut();
        }
        let s = 0;
        let n;
        if (this.children !== null) {
            for (s = 0; s < this.children.length; ++s) {
                void this.children[s].deactivate(t, this);
            }
        }
        return R(i, (() => {
            if (this.isBound) {
                if (this.vmKind !== Oi && this.Ct.detaching != null) {
                    n = S(...this.Ct.detaching.map(callDetachingHook, this));
                }
                if (this.At.zt) {
                    n = S(n, this.kt.detaching(this.$initiator, this.parent));
                }
            }
            if (isPromise(n)) {
                this.Ot();
                t.Ut();
                n.then((() => {
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
          case qi:
          case Oi:
            this.nodes.remove();
            this.nodes.unlink();
        }
        if (this.hostController !== null) {
            switch (this.mountTarget) {
              case Ti:
              case Ei:
                this.host.remove();
                break;

              case Ii:
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
          case Fi:
            this.scope = null;
            break;

          case Oi:
            if (!this.hasLockedScope) {
                this.scope = null;
            }
            if ((this.state & Wi) === Wi && !this.viewFactory.tryReturnToCache(this) && this.$initiator === this) {
                this.dispose();
            }
            break;

          case qi:
            this.scope.parent = null;
            break;
        }
        this.state = ji;
        this.$initiator = null;
        this.Kt();
    }
    Ot() {
        if (this.$promise === void 0) {
            this.$promise = new Promise(((t, e) => {
                this.$resolve = t;
                this.$reject = e;
            }));
            if (this.$initiator !== this) {
                this.parent.Ot();
            }
        }
    }
    Kt() {
        if (this.$promise !== void 0) {
            Xi = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            Xi();
            Xi = void 0;
        }
    }
    Vt(t) {
        if (this.$promise !== void 0) {
            Qi = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            Qi(t);
            Qi = void 0;
        }
        if (this.$initiator !== this) {
            this.parent.Vt(t);
        }
    }
    qt() {
        ++this.Rt;
        if (this.$initiator !== this) {
            this.parent.qt();
        }
    }
    Ht() {
        if (this.state !== Vi) {
            --this.Rt;
            this.Kt();
            if (this.$initiator !== this) {
                this.parent.Ht();
            }
            return;
        }
        if (--this.Rt === 0) {
            if (this.vmKind !== Oi && this.Ct.attached != null) {
                Yi = S(...this.Ct.attached.map(callAttachedHook, this));
            }
            if (this.At.Xt) {
                Yi = S(Yi, this.kt.attached(this.$initiator));
            }
            if (isPromise(Yi)) {
                this.Ot();
                Yi.then((() => {
                    this.state = $i;
                    this.Kt();
                    if (this.$initiator !== this) {
                        this.parent.Ht();
                    }
                })).catch((t => {
                    this.Vt(t);
                }));
                Yi = void 0;
                return;
            }
            Yi = void 0;
            this.state = $i;
            this.Kt();
        }
        if (this.$initiator !== this) {
            this.parent.Ht();
        }
    }
    Ut() {
        ++this.Tt;
    }
    Gt() {
        if (--this.Tt === 0) {
            this.Qt();
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
                if (t.Bt) {
                    if (t.vmKind !== Oi && t.Ct.unbinding != null) {
                        e = S(...t.Ct.unbinding.map(callUnbindingHook, t));
                    }
                    if (t.At.Yt) {
                        if (t.debug) {
                            t.logger.trace("unbinding()");
                        }
                        e = S(e, t.viewModel.unbinding(t.$initiator, t.parent));
                    }
                }
                if (isPromise(e)) {
                    this.Ot();
                    this.Qt();
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
    Qt() {
        ++this.Et;
    }
    Zt() {
        if (--this.Et === 0) {
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
          case Fi:
          case qi:
            {
                return this.definition.name === t;
            }

          case Oi:
            return this.viewFactory.name === t;
        }
    }
    lockScope(t) {
        this.scope = t;
        this.hasLockedScope = true;
    }
    setHost(t) {
        if (this.vmKind === qi) {
            setRef(t, hs, this);
            setRef(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = Ti;
        return this;
    }
    setShadowRoot(t) {
        if (this.vmKind === qi) {
            setRef(t, hs, this);
            setRef(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = Ei;
        return this;
    }
    setLocation(t) {
        if (this.vmKind === qi) {
            setRef(t, hs, this);
            setRef(t, this.definition.key, this);
        }
        this.location = t;
        this.mountTarget = Ii;
        return this;
    }
    release() {
        this.state |= Wi;
    }
    dispose() {
        if ((this.state & Ui) === Ui) {
            return;
        }
        this.state |= Ui;
        if (this.At.Jt) {
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
            Si.delete(this.kt);
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
        if (this.At.te && this.kt.accept(t) === true) {
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

const Si = new WeakMap;

const Ri = 0;

const Ti = 1;

const Ei = 2;

const Ii = 3;

const Pi = ct({
    none: Ri,
    host: Ti,
    shadowRoot: Ei,
    location: Ii
});

const Li = {
    optional: true
};

const Di = A(z);

function createObservers(t, e, i) {
    const s = e.bindables;
    const n = ft(s);
    const r = n.length;
    const l = t.container.get(j);
    if (r > 0) {
        for (let e = 0; e < r; ++e) {
            const r = n[e];
            const a = s[r];
            const c = a.callback;
            const u = l.getObserver(i, r);
            if (a.set !== h) {
                if (u.useCoercer?.(a.set, t.coercion) !== true) {
                    throw createMappedError(507, r);
                }
            }
            if (i[c] != null || i.propertyChanged != null) {
                const callback = (e, s) => {
                    if (t.isBound) {
                        i[c]?.(e, s);
                        i.propertyChanged?.(r, e, s);
                    }
                };
                if (u.useCallback?.(callback) !== true) {
                    throw createMappedError(508, r);
                }
            }
        }
    }
}

const Mi = new Map;

const getAccessScopeAst = t => {
    let e = Mi.get(t);
    if (e == null) {
        e = new i(t, 0);
        Mi.set(t, e);
    }
    return e;
};

function createWatchers(t, i, s, n) {
    const r = i.get(j);
    const l = i.get(e);
    const a = s.watches;
    const h = t.vmKind === qi ? t.scope : V.create(n, null, true);
    const c = a.length;
    let u;
    let f;
    let d;
    let m = 0;
    for (;c > m; ++m) {
        ({expression: u, callback: f} = a[m]);
        f = isFunction(f) ? f : Reflect.get(n, f);
        if (!isFunction(f)) {
            throw createMappedError(506, f);
        }
        if (isFunction(u)) {
            t.addBinding(new ComputedWatcher(n, r, u, f, true));
        } else {
            d = isString(u) ? l.parse(u, yt) : getAccessScopeAst(u);
            t.addBinding(new ExpressionWatcher(h, i, r, d, f));
        }
    }
}

function isCustomElementController(t) {
    return t instanceof Controller && t.vmKind === qi;
}

function isCustomElementViewModel(t) {
    return st(t) && isElementType(t.constructor);
}

class HooksDefinition {
    constructor(t) {
        this.ee = "define" in t;
        this.Lt = "hydrating" in t;
        this.Mt = "hydrated" in t;
        this._t = "created" in t;
        this.Ft = "binding" in t;
        this.$t = "bound" in t;
        this.Wt = "attaching" in t;
        this.Xt = "attached" in t;
        this.zt = "detaching" in t;
        this.Yt = "unbinding" in t;
        this.Jt = "dispose" in t;
        this.te = "accept" in t;
    }
}

HooksDefinition.none = new HooksDefinition({});

const _i = {
    mode: "open"
};

const qi = "customElement";

const Fi = "customAttribute";

const Oi = "synthetic";

const Hi = 0;

const Vi = 1;

const $i = 2;

const Ni = 4;

const ji = 8;

const Wi = 16;

const Ui = 32;

const zi = /*@__PURE__*/ ct({
    none: Hi,
    activating: Vi,
    activated: $i,
    deactivating: Ni,
    deactivated: ji,
    released: Wi,
    disposed: Ui
});

function stringifyState(t) {
    const e = [];
    if ((t & Vi) === Vi) {
        e.push("activating");
    }
    if ((t & $i) === $i) {
        e.push("activated");
    }
    if ((t & Ni) === Ni) {
        e.push("deactivating");
    }
    if ((t & ji) === ji) {
        e.push("deactivated");
    }
    if ((t & Wi) === Wi) {
        e.push("released");
    }
    if ((t & Ui) === Ui) {
        e.push("disposed");
    }
    return e.length === 0 ? "none" : e.join("|");
}

const Gi = /*@__PURE__*/ Wt("IController");

const Ki = /*@__PURE__*/ Wt("IHydrationContext");

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

let Xi;

let Qi;

let Yi;

class Refs {}

function getRef(t, e) {
    return t.$au?.[e] ?? null;
}

function setRef(t, e, i) {
    (t.$au ??= new Refs)[e] = i;
}

const Zi = /*@__PURE__*/ Wt("INode");

const Ji = /*@__PURE__*/ Wt("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(ms, true)) {
        return t.get(ms).host;
    }
    return t.get(ae).document;
}))));

const ts = /*@__PURE__*/ Wt("IRenderLocation");

const es = /*@__PURE__*/ Wt("CssModules");

const is = new WeakMap;

function getEffectiveParentNode(t) {
    if (is.has(t)) {
        return is.get(t);
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
        const e = findElementControllerFor(t, {
            optional: true
        });
        if (e == null) {
            return null;
        }
        if (e.mountTarget === Pi.shadowRoot) {
            return getEffectiveParentNode(e.host);
        }
    }
    return t.parentNode;
}

function setEffectiveParentNode(t, e) {
    if (t.platform !== void 0 && !(t instanceof t.platform.Node)) {
        const i = t.childNodes;
        for (let t = 0, s = i.length; t < s; ++t) {
            is.set(i[t], e);
        }
    } else {
        is.set(t, e);
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
        return this.ie;
    }
    get lastChild() {
        return this.se;
    }
    constructor(t, e) {
        this.platform = t;
        this.next = void 0;
        this.ne = false;
        this.re = false;
        this.ref = null;
        const i = (this.f = e).querySelectorAll("au-m");
        let s = 0;
        let n = i.length;
        let r = this.t = Array(n);
        let l;
        let a;
        while (n > s) {
            a = i[s];
            l = a.nextSibling;
            a.remove();
            if (l.nodeType === 8) {
                a = l;
                (l = l.nextSibling).$start = a;
            }
            r[s] = l;
            ++s;
        }
        const h = e.childNodes;
        const c = this.childNodes = Array(n = h.length);
        s = 0;
        while (n > s) {
            c[s] = h[s];
            ++s;
        }
        this.ie = e.firstChild;
        this.se = e.lastChild;
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
                let i = this.ie;
                let s;
                const n = this.se;
                while (i != null) {
                    s = i.nextSibling;
                    e.insertBefore(i, t);
                    if (i === n) {
                        break;
                    }
                    i = s;
                }
            } else {
                this.ne = true;
                t.parentNode.insertBefore(this.f, t);
            }
        }
    }
    appendTo(t, e = false) {
        if (this.ne) {
            let e = this.ie;
            let i;
            const s = this.se;
            while (e != null) {
                i = e.nextSibling;
                t.appendChild(e);
                if (e === s) {
                    break;
                }
                e = i;
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
            const e = this.se;
            let i;
            let s = this.ie;
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
        if (this.ne) {
            let i = this.ie;
            let s;
            const n = this.se;
            while (i != null) {
                s = i.nextSibling;
                e.insertBefore(i, t);
                if (i === n) {
                    break;
                }
                i = s;
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

const ss = /*@__PURE__*/ Wt("IWindow", (t => t.callback((t => t.get(ae).window))));

const ns = /*@__PURE__*/ Wt("ILocation", (t => t.callback((t => t.get(ss).location))));

const rs = /*@__PURE__*/ Wt("IHistory", (t => t.callback((t => t.get(ss).history))));

const registerHostNode = (t, e, i) => {
    registerResolver(t, e.HTMLElement, registerResolver(t, e.Element, registerResolver(t, Zi, new C("ElementResolver", i))));
    return t;
};

function customElement(t) {
    return function(e, i) {
        i.addInitializer((function() {
            defineElement(t, this);
        }));
        return e;
    };
}

function useShadowDOM(t, e) {
    if (t === void 0) {
        return function(t, e) {
            e.addInitializer((function() {
                annotateElementMetadata(this, "shadowOptions", {
                    mode: "open"
                });
            }));
        };
    }
    if (!isFunction(t)) {
        return function(e, i) {
            i.addInitializer((function() {
                annotateElementMetadata(this, "shadowOptions", t);
            }));
        };
    }
    e.addInitializer((function() {
        annotateElementMetadata(this, "shadowOptions", {
            mode: "open"
        });
    }));
}

function containerless(t, e) {
    if (t === void 0) {
        return function(t, e) {
            e.addInitializer((function() {
                markContainerless(t);
            }));
        };
    }
    e.addInitializer((function() {
        markContainerless(t);
    }));
}

function markContainerless(t) {
    const e = qt(hs, t);
    if (e === void 0) {
        annotateElementMetadata(t, "containerless", true);
        return;
    }
    e.containerless = true;
}

const os = new WeakMap;

class CustomElementDefinition {
    get kind() {
        return Kt;
    }
    constructor(t, e, i, s, n, r, l, a, h, c, u, f, d, m, g, p, v, b, w) {
        this.Type = t;
        this.name = e;
        this.aliases = i;
        this.key = s;
        this.cache = n;
        this.capture = r;
        this.template = l;
        this.instructions = a;
        this.dependencies = h;
        this.injectable = c;
        this.needsCompile = u;
        this.surrogates = f;
        this.bindables = d;
        this.containerless = m;
        this.shadowOptions = g;
        this.hasSlots = p;
        this.enhance = v;
        this.watches = b;
        this.processContent = w;
    }
    static create(t, e = null) {
        if (e === null) {
            const i = t;
            if (isString(i)) {
                throw createMappedError(761, t);
            }
            const s = T("name", i, cs);
            if (isFunction(i.Type)) {
                e = i.Type;
            } else {
                e = us(E(s));
            }
            return new CustomElementDefinition(e, s, d(i.aliases), T("key", i, (() => getElementKeyFrom(s))), T("cache", i, returnZero), I("capture", i, e, returnFalse), T("template", i, returnNull), d(i.instructions), d(getElementAnnotation(e, "dependencies"), i.dependencies), T("injectable", i, returnNull), T("needsCompile", i, returnTrue), d(i.surrogates), Nt.from(getElementAnnotation(e, "bindables"), i.bindables), I("containerless", i, e, returnFalse), T("shadowOptions", i, returnNull), T("hasSlots", i, returnFalse), T("enhance", i, returnFalse), T("watches", i, returnEmptyArray), P("processContent", e, returnNull));
        }
        if (isString(t)) {
            return new CustomElementDefinition(e, t, d(getElementAnnotation(e, "aliases"), e.aliases), getElementKeyFrom(t), P("cache", e, returnZero), P("capture", e, returnFalse), P("template", e, returnNull), d(getElementAnnotation(e, "instructions"), e.instructions), d(getElementAnnotation(e, "dependencies"), e.dependencies), P("injectable", e, returnNull), P("needsCompile", e, returnTrue), d(getElementAnnotation(e, "surrogates"), e.surrogates), Nt.from(...Nt.getAll(e), getElementAnnotation(e, "bindables"), e.bindables), P("containerless", e, returnFalse), P("shadowOptions", e, returnNull), P("hasSlots", e, returnFalse), P("enhance", e, returnFalse), d(he.getDefinitions(e), e.watches), P("processContent", e, returnNull));
        }
        const i = T("name", t, cs);
        return new CustomElementDefinition(e, i, d(getElementAnnotation(e, "aliases"), t.aliases, e.aliases), getElementKeyFrom(i), I("cache", t, e, returnZero), I("capture", t, e, returnFalse), I("template", t, e, returnNull), d(getElementAnnotation(e, "instructions"), t.instructions, e.instructions), d(getElementAnnotation(e, "dependencies"), t.dependencies, e.dependencies), I("injectable", t, e, returnNull), I("needsCompile", t, e, returnTrue), d(getElementAnnotation(e, "surrogates"), t.surrogates, e.surrogates), Nt.from(...Nt.getAll(e), getElementAnnotation(e, "bindables"), e.bindables, t.bindables), I("containerless", t, e, returnFalse), I("shadowOptions", t, e, returnNull), I("hasSlots", t, e, returnFalse), I("enhance", t, e, returnFalse), d(t.watches, he.getDefinitions(e), e.watches), I("processContent", t, e, returnNull));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) {
            return t;
        }
        if (os.has(t)) {
            return os.get(t);
        }
        const e = CustomElementDefinition.create(t);
        os.set(t, e);
        Ot(e, e.Type, hs);
        return e;
    }
    register(t, e) {
        const i = this.Type;
        const s = typeof e === "string" ? getElementKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(s, false)) {
            t.register(t.has(i, false) ? null : Ut(i, i), zt(i, s), ...n.map((t => zt(i, getElementKeyFrom(t)))));
        }
    }
    toString() {
        return `au:ce:${this.name}`;
    }
}

const ls = {
    name: undefined,
    searchParents: false,
    optional: false
};

const returnZero = () => 0;

const returnNull = () => null;

const returnFalse = () => false;

const returnTrue = () => true;

const returnEmptyArray = () => w;

const as = "custom-element";

const hs = /*@__PURE__*/ p(as);

const getElementKeyFrom = t => `${hs}:${t}`;

const cs = /*@__PURE__*/ (t => () => `unnamed-${++t}`)(0);

const annotateElementMetadata = (t, e, i) => {
    Ot(i, t, Vt(e));
};

const defineElement = (t, e) => {
    const i = CustomElementDefinition.create(t, e);
    const s = i.Type;
    Ot(i, s, hs, m);
    return s;
};

const isElementType = t => isFunction(t) && (Ft(hs, t) || t.$au?.type === as);

const findElementControllerFor = (t, e = ls) => {
    if (e.name === void 0 && e.searchParents !== true) {
        const i = getRef(t, hs);
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
            const i = getRef(t, hs);
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
            const t = getRef(i, hs);
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
        const t = getRef(i, hs);
        if (t !== null) {
            return t;
        }
        i = getEffectiveParentNode(i);
    }
    throw createMappedError(765, t);
};

const getElementAnnotation = (t, e) => qt(Vt(e), t);

const getElementDefinition = t => {
    const e = qt(hs, t) ?? getDefinitionFromStaticAu(t, as, CustomElementDefinition.create);
    if (e == null) {
        throw createMappedError(760, t);
    }
    return e;
};

const createElementInjectable = () => {
    const t = {
        $isInterface: false,
        register() {
            return {
                $isResolver: true,
                resolve(e, i) {
                    if (i.has(t, true)) {
                        return i.get(t);
                    } else {
                        return null;
                    }
                }
            };
        }
    };
    return t;
};

const us = /*@__PURE__*/ function() {
    const t = {
        value: "",
        writable: false,
        enumerable: false,
        configurable: true
    };
    const e = {};
    return function(i, s = e) {
        const n = class Anonymous {};
        t.value = i;
        pt(n, "name", t);
        if (s !== e) {
            ut(n.prototype, s);
        }
        return n;
    };
}();

const fs = ct({
    name: hs,
    keyFrom: getElementKeyFrom,
    isType: isElementType,
    for: findElementControllerFor,
    define: defineElement,
    getDefinition: getElementDefinition,
    annotate: annotateElementMetadata,
    getAnnotation: getElementAnnotation,
    generateName: cs,
    createInjectable: createElementInjectable,
    generateType: us,
    find(t, e) {
        const i = t.find(as, e);
        return i == null ? null : qt(hs, i) ?? getDefinitionFromStaticAu(i, as, CustomElementDefinition.create) ?? null;
    }
});

const ds = /*@__PURE__*/ Vt("processContent");

function processContent(t) {
    return t === void 0 ? function(t, e) {
        if (!e.static || e.kind !== "method") throw createMappedError(766, t);
        e.addInitializer((function() {
            Ot(t, this, ds);
        }));
    } : function(e, i) {
        i.addInitializer((function() {
            if (isString(t) || isSymbol(t)) {
                t = this[t];
            }
            if (!isFunction(t)) throw createMappedError(766, t);
            const e = qt(hs, this);
            if (e !== void 0) {
                e.processContent = t;
            } else {
                Ot(t, this, ds);
            }
        }));
        return e;
    };
}

function capture(t) {
    return function(e, i) {
        const s = isFunction(t) ? t : true;
        i.addInitializer((function() {
            annotateElementMetadata(this, "capture", s);
            if (isElementType(this)) {
                getElementDefinition(this).capture = s;
            }
        }));
    };
}

const ms = /*@__PURE__*/ Wt("IAppRoot");

class AppRoot {
    get controller() {
        return this.P;
    }
    constructor(t, e, i, s = false) {
        this.config = t;
        this.container = e;
        this.le = void 0;
        this.ae = s;
        const n = this.host = t.host;
        i.prepare(this);
        registerHostNode(e, this.platform = this.he(e, n), n);
        this.le = R(this.ce("creating"), (() => {
            if (!t.allowActionlessForm !== false) {
                n.addEventListener("submit", (t => {
                    const e = t.target;
                    const i = (e.getAttribute("action")?.length ?? 0) > 0;
                    if (e.tagName === "FORM" && !i) {
                        t.preventDefault();
                    }
                }), false);
            }
            const i = s ? e : e.createChild();
            const r = t.component;
            let l;
            if (isFunction(r)) {
                l = i.invoke(r);
                Gt(r, l);
            } else {
                l = t.component;
            }
            const a = {
                hydrate: false,
                projections: null
            };
            const h = s ? CustomElementDefinition.create({
                name: cs(),
                template: this.host,
                enhance: true
            }) : void 0;
            const c = this.P = Controller.$el(i, l, n, a, h);
            c.hE(a, null);
            return R(this.ce("hydrating"), (() => {
                c.hS(null);
                return R(this.ce("hydrated"), (() => {
                    c.hC();
                    this.le = void 0;
                }));
            }));
        }));
    }
    activate() {
        return R(this.le, (() => R(this.ce("activating"), (() => R(this.P.activate(this.P, null, void 0), (() => this.ce("activated")))))));
    }
    deactivate() {
        return R(this.ce("deactivating"), (() => R(this.P.deactivate(this.P, null), (() => this.ce("deactivated")))));
    }
    ce(t) {
        const e = this.container;
        const i = this.ae && !e.has(oe, false) ? [] : e.getAll(oe);
        return S(...i.reduce(((e, i) => {
            if (i.slot === t) {
                e.push(i.run());
            }
            return e;
        }), []));
    }
    he(t, e) {
        let i;
        if (!t.has(ae, false)) {
            if (e.ownerDocument.defaultView === null) {
                throw createMappedError(769);
            }
            i = new nt(e.ownerDocument.defaultView);
            t.register(Gt(ae, i));
        } else {
            i = t.get(ae);
        }
        return i;
    }
    dispose() {
        this.P?.dispose();
    }
}

const gs = /*@__PURE__*/ Wt("IAurelia");

class Aurelia {
    get isRunning() {
        return this.ir;
    }
    get isStarting() {
        return this.ue;
    }
    get isStopping() {
        return this.fe;
    }
    get root() {
        if (this.de == null) {
            if (this.next == null) {
                throw createMappedError(767);
            }
            return this.next;
        }
        return this.de;
    }
    constructor(t = c.createContainer()) {
        this.container = t;
        this.ir = false;
        this.ue = false;
        this.fe = false;
        this.de = void 0;
        this.next = void 0;
        this.me = void 0;
        this.ge = void 0;
        if (t.has(gs, true) || t.has(Aurelia, true)) {
            throw createMappedError(768);
        }
        registerResolver(t, gs, new C("IAurelia", this));
        registerResolver(t, Aurelia, new C("Aurelia", this));
        registerResolver(t, ms, this.pe = new C("IAppRoot"));
    }
    register(...t) {
        this.container.register(...t);
        return this;
    }
    app(t) {
        this.next = new AppRoot(t, this.container, this.pe);
        return this;
    }
    enhance(t) {
        const e = new AppRoot({
            host: t.host,
            component: t.component
        }, t.container ?? this.container.createChild(), new C("IAppRoot"), true);
        return R(e.activate(), (() => e));
    }
    async waitForIdle() {
        const t = this.root.platform;
        await t.domWriteQueue.yield();
        await t.domReadQueue.yield();
        await t.taskQueue.yield();
    }
    start(t = this.next) {
        if (t == null) {
            throw createMappedError(770);
        }
        if (isPromise(this.me)) {
            return this.me;
        }
        return this.me = R(this.stop(), (() => {
            Reflect.set(t.host, "$aurelia", this);
            this.pe.prepare(this.de = t);
            this.ue = true;
            return R(t.activate(), (() => {
                this.ir = true;
                this.ue = false;
                this.me = void 0;
                this.ve(t, "au-started", t.host);
            }));
        }));
    }
    stop(t = false) {
        if (isPromise(this.ge)) {
            return this.ge;
        }
        if (this.ir === true) {
            const e = this.de;
            this.ir = false;
            this.fe = true;
            return this.ge = R(e.deactivate(), (() => {
                Reflect.deleteProperty(e.host, "$aurelia");
                if (t) {
                    e.dispose();
                }
                this.de = void 0;
                this.pe.dispose();
                this.fe = false;
                this.ve(e, "au-stopped", e.host);
            }));
        }
    }
    dispose() {
        if (this.ir || this.fe) {
            throw createMappedError(771);
        }
        this.container.dispose();
    }
    ve(t, e, i) {
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
                this.has = this.be;
                break;

              case 1:
                this.has = this.we;
                break;

              default:
                this.has = this.ye;
            }
        } else {
            switch (t.length) {
              case 0:
                this.has = this.xe;
                break;

              case 1:
                this.has = this.Ce;
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
    Ce(t) {
        return this.chars === t;
    }
    xe(t) {
        return false;
    }
    ye(t) {
        return !this.chars.includes(t);
    }
    we(t) {
        return this.chars !== t;
    }
    be(t) {
        return true;
    }
}

class Interpretation {
    constructor() {
        this.parts = w;
        this.Ae = "";
        this.Be = {};
        this.Se = {};
    }
    get pattern() {
        const t = this.Ae;
        if (t === "") {
            return null;
        } else {
            return t;
        }
    }
    set pattern(t) {
        if (t == null) {
            this.Ae = "";
            this.parts = w;
        } else {
            this.Ae = t;
            this.parts = this.Se[t];
        }
    }
    append(t, e) {
        const i = this.Be;
        if (i[t] === undefined) {
            i[t] = e;
        } else {
            i[t] += e;
        }
    }
    next(t) {
        const e = this.Be;
        let i;
        if (e[t] !== undefined) {
            i = this.Se;
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
    get Ae() {
        return this.Re ? this.Te[0] : null;
    }
    constructor(t, ...e) {
        this.charSpec = t;
        this.Ee = [];
        this.Ie = null;
        this.Re = false;
        this.Te = e;
    }
    findChild(t) {
        const e = this.Ee;
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
        const i = this.Te;
        if (!i.includes(e)) {
            i.push(e);
        }
        let s = this.findChild(t);
        if (s == null) {
            s = new AttrParsingState(t, e);
            this.Ee.push(s);
            if (t.repeat) {
                s.Ee.push(s);
            }
        }
        return s;
    }
    findMatches(t, e) {
        const i = [];
        const s = this.Ee;
        const n = s.length;
        let r = 0;
        let l = null;
        let a = 0;
        let h = 0;
        for (;a < n; ++a) {
            l = s[a];
            if (l.charSpec.has(t)) {
                i.push(l);
                r = l.Te.length;
                h = 0;
                if (l.charSpec.isSymbol) {
                    for (;h < r; ++h) {
                        e.next(l.Te[h]);
                    }
                } else {
                    for (;h < r; ++h) {
                        e.append(l.Te[h], t);
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
        const e = this.Pe = t.length;
        const i = this.Le = [];
        let s = 0;
        for (;e > s; ++s) {
            i.push(new CharSpec(t[s], false, false, false));
        }
    }
    eachChar(t) {
        const e = this.Pe;
        const i = this.Le;
        let s = 0;
        for (;e > s; ++s) {
            t(i[s]);
        }
    }
}

class DynamicSegment {
    constructor(t) {
        this.text = "PART";
        this.De = new CharSpec(t, true, false, true);
    }
    eachChar(t) {
        t(this.De);
    }
}

class SymbolSegment {
    constructor(t) {
        this.text = t;
        this.De = new CharSpec(t, false, true, false);
    }
    eachChar(t) {
        t(this.De);
    }
}

class SegmentTypes {
    constructor() {
        this.statics = 0;
        this.dynamics = 0;
        this.symbols = 0;
    }
}

const ps = /*@__PURE__*/ Wt("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

class SyntaxInterpreter {
    constructor() {
        this.Me = new AttrParsingState(null);
        this._e = [ this.Me ];
    }
    add(t) {
        t = t.slice(0).sort(((t, e) => t.pattern > e.pattern ? 1 : -1));
        const e = t.length;
        let i;
        let s;
        let n;
        let r;
        let l;
        let a;
        let h;
        let c = 0;
        let u;
        while (e > c) {
            i = this.Me;
            s = t[c];
            n = s.pattern;
            r = new SegmentTypes;
            l = this.qe(s, r);
            a = l.length;
            h = t => i = i.append(t, n);
            for (u = 0; a > u; ++u) {
                l[u].eachChar(h);
            }
            i.Ie = r;
            i.Re = true;
            ++c;
        }
    }
    interpret(t) {
        const e = new Interpretation;
        const i = t.length;
        let s = this._e;
        let n = 0;
        let r;
        for (;n < i; ++n) {
            s = this.Fe(s, t.charAt(n), e);
            if (s.length === 0) {
                break;
            }
        }
        s = s.filter(isEndpoint);
        if (s.length > 0) {
            s.sort(sortEndpoint);
            r = s[0];
            if (!r.charSpec.isSymbol) {
                e.next(r.Ae);
            }
            e.pattern = r.Ae;
        }
        return e;
    }
    Fe(t, e, i) {
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
    qe(t, e) {
        const i = [];
        const s = t.pattern;
        const n = s.length;
        const r = t.symbols;
        let l = 0;
        let a = 0;
        let h = "";
        while (l < n) {
            h = s.charAt(l);
            if (r.length === 0 || !r.includes(h)) {
                if (l === a) {
                    if (h === "P" && s.slice(l, l + 4) === "PART") {
                        a = l = l + 4;
                        i.push(new DynamicSegment(r));
                        ++e.dynamics;
                    } else {
                        ++l;
                    }
                } else {
                    ++l;
                }
            } else if (l !== a) {
                i.push(new StaticSegment(s.slice(a, l)));
                ++e.statics;
                a = l;
            } else {
                i.push(new SymbolSegment(s.slice(a, l + 1)));
                ++e.symbols;
                a = ++l;
            }
        }
        if (a !== l) {
            i.push(new StaticSegment(s.slice(a, l)));
            ++e.statics;
        }
        return i;
    }
}

function isEndpoint(t) {
    return t.Re;
}

function sortEndpoint(t, e) {
    const i = t.Ie;
    const s = e.Ie;
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

const vs = /*@__PURE__*/ Wt("IAttributePattern");

const bs = /*@__PURE__*/ Wt("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor() {
        this.W = {};
        const t = this.Oe = v(ps);
        const e = ys.findAll(v(k));
        const i = this.Te = {};
        const s = e.reduce(((t, e) => {
            const s = getAllPatternDefinitions(e.constructor);
            s.forEach((t => i[t.pattern] = e));
            return t.concat(s);
        }), w);
        t.add(s);
    }
    parse(t, e) {
        let i = this.W[t];
        if (i == null) {
            i = this.W[t] = this.Oe.interpret(t);
        }
        const s = i.pattern;
        if (s == null) {
            return new AttrSyntax(t, e, t, null, null);
        } else {
            return this.Te[s][s](t, e, i.parts);
        }
    }
}

function attributePattern(...t) {
    return function decorator(e) {
        return ys.define(t, e);
    };
}

const getAllPatternDefinitions = t => ws.get(t) ?? w;

const ws = new WeakMap;

const ys = ct({
    name: p("attribute-pattern"),
    define(t, e) {
        ws.set(e, t);
        return y.define(e, (t => {
            Ut(vs, e).register(t);
        }));
    },
    getPatternDefinitions: getAllPatternDefinitions,
    findAll: t => t.root.getAll(vs)
});

class DotSeparatedAttributePattern {
    "PART.PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], i[1]);
    }
    "PART.PART.PART"(t, e, i) {
        return new AttrSyntax(t, e, `${i[0]}.${i[1]}`, i[2]);
    }
}

ys.define([ {
    pattern: "PART.PART",
    symbols: "."
}, {
    pattern: "PART.PART.PART",
    symbols: "."
} ], DotSeparatedAttributePattern);

class RefAttributePattern {
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
}

ys.define([ {
    pattern: "ref",
    symbols: ""
}, {
    pattern: "PART.ref",
    symbols: "."
} ], RefAttributePattern);

class EventAttributePattern {
    "PART.trigger:PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "trigger", i);
    }
    "PART.capture:PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "capture", i);
    }
}

ys.define([ {
    pattern: "PART.trigger:PART",
    symbols: ".:"
}, {
    pattern: "PART.capture:PART",
    symbols: ".:"
} ], EventAttributePattern);

class ColonPrefixedBindAttributePattern {
    ":PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "bind");
    }
}

ys.define([ {
    pattern: ":PART",
    symbols: ":"
} ], ColonPrefixedBindAttributePattern);

class AtPrefixedTriggerAttributePattern {
    "@PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "trigger");
    }
    "@PART:PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "trigger", [ i[0], "trigger", ...i.slice(1) ]);
    }
}

ys.define([ {
    pattern: "@PART",
    symbols: "@"
}, {
    pattern: "@PART:PART",
    symbols: "@:"
} ], AtPrefixedTriggerAttributePattern);

class SpreadAttributePattern {
    "...$attrs"(t, e, i) {
        return new AttrSyntax(t, e, "", "...$attrs");
    }
}

ys.define([ {
    pattern: "...$attrs",
    symbols: ""
} ], SpreadAttributePattern);

function bindingCommand(t) {
    return function(e, i) {
        i.addInitializer((function() {
            ks.define(t, e);
        }));
        return e;
    };
}

class BindingCommandDefinition {
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
        return new BindingCommandDefinition(e, f(getCommandAnnotation(e, "name"), i), d(getCommandAnnotation(e, "aliases"), s.aliases, e.aliases), getCommandKeyFrom(i));
    }
    register(t, e) {
        const i = this.Type;
        const s = typeof e === "string" ? getCommandKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(s, false)) {
            t.register(t.has(i, false) ? null : Ut(i, i), zt(i, s), ...n.map((t => zt(i, getCommandKeyFrom(t)))));
        }
    }
}

const xs = "binding-command";

const Cs = /*@__PURE__*/ p(xs);

const getCommandKeyFrom = t => `${Cs}:${t}`;

const getCommandAnnotation = (t, e) => qt(Vt(e), t);

const ks = ct({
    name: Cs,
    keyFrom: getCommandKeyFrom,
    define(t, e) {
        const i = BindingCommandDefinition.create(t, e);
        const s = i.Type;
        Ot(i, s, Cs, m);
        return s;
    },
    getAnnotation: getCommandAnnotation,
    find(t, e) {
        const i = t.find(xs, e);
        return i == null ? null : qt(Cs, i) ?? getDefinitionFromStaticAu(i, xs, BindingCommandDefinition.create) ?? null;
    },
    get(t, e) {
        return t.get(g(getCommandKeyFrom(e)));
    }
});

class OneTimeBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = t.attr.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? L(n);
        } else {
            if (r === "" && t.def.kind === Kt) {
                r = L(n);
            }
            n = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, yt), n, It);
    }
}

OneTimeBindingCommand.$au = {
    type: xs,
    name: "one-time"
};

class ToViewBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = t.attr.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? L(n);
        } else {
            if (r === "" && t.def.kind === Kt) {
                r = L(n);
            }
            n = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, yt), n, Pt);
    }
}

ToViewBindingCommand.$au = {
    type: xs,
    name: "to-view"
};

class FromViewBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = s.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? L(n);
        } else {
            if (r === "" && t.def.kind === Kt) {
                r = L(n);
            }
            n = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, yt), n, Lt);
    }
}

FromViewBindingCommand.$au = {
    type: xs,
    name: "from-view"
};

class TwoWayBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = s.rawValue;
        if (t.bindable == null) {
            n = i.map(t.node, n) ?? L(n);
        } else {
            if (r === "" && t.def.kind === Kt) {
                r = L(n);
            }
            n = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, yt), n, Dt);
    }
}

TwoWayBindingCommand.$au = {
    type: xs,
    name: "two-way"
};

class DefaultBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, e, i) {
        const s = t.attr;
        const n = t.bindable;
        let r;
        let l;
        let a = s.target;
        let h = s.rawValue;
        if (n == null) {
            l = i.isTwoWay(t.node, a) ? Dt : Pt;
            a = i.map(t.node, a) ?? L(a);
        } else {
            if (h === "" && t.def.kind === Kt) {
                h = L(a);
            }
            r = t.def.defaultBindingMode;
            l = n.mode === Mt || n.mode == null ? r == null || r === Mt ? Pt : r : n.mode;
            a = n.name;
        }
        return new PropertyBindingInstruction(e.parse(h, yt), a, l);
    }
}

DefaultBindingCommand.$au = {
    type: xs,
    name: "bind"
};

class ForBindingCommand {
    constructor() {
        this.He = v(bs);
    }
    get ignoreAttr() {
        return false;
    }
    build(t, e) {
        const i = t.bindable === null ? L(t.attr.target) : t.bindable.name;
        const s = e.parse(t.attr.rawValue, bt);
        let n = w;
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
}

ForBindingCommand.$au = {
    type: xs,
    name: "for"
};

class TriggerBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, wt), t.attr.target, false, t.attr.parts?.[2] ?? null);
    }
}

TriggerBindingCommand.$au = {
    type: xs,
    name: "trigger"
};

class CaptureBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, wt), t.attr.target, true, t.attr.parts?.[2] ?? null);
    }
}

CaptureBindingCommand.$au = {
    type: xs,
    name: "capture"
};

class AttrBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new AttributeBindingInstruction(t.attr.target, e.parse(t.attr.rawValue, yt), t.attr.target);
    }
}

AttrBindingCommand.$au = {
    type: xs,
    name: "attr"
};

class StyleBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new AttributeBindingInstruction("style", e.parse(t.attr.rawValue, yt), t.attr.target);
    }
}

StyleBindingCommand.$au = {
    type: xs,
    name: "style"
};

class ClassBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new AttributeBindingInstruction("class", e.parse(t.attr.rawValue, yt), t.attr.target);
    }
}

ClassBindingCommand.$au = {
    type: xs,
    name: "class"
};

class RefBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new RefBindingInstruction(e.parse(t.attr.rawValue, yt), t.attr.target);
    }
}

RefBindingCommand.$au = {
    type: xs,
    name: "ref"
};

class SpreadBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t) {
        return new SpreadBindingInstruction;
    }
}

SpreadBindingCommand.$au = {
    type: xs,
    name: "...$attrs"
};

const As = /*@__PURE__*/ Wt("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

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
        t.register(Ut(this, this), zt(this, As));
    }
    constructor() {
        this.Ve = ut(createLookup(), {
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
        this.$e = o("a altGlyph animate animateColor circle clipPath defs ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feFlood feGaussianBlur feImage feMerge feMorphology feOffset feSpecularLighting feTile feTurbulence filter font foreignObject g glyph glyphRef image line linearGradient marker mask missing-glyph path pattern polygon polyline radialGradient rect stop svg switch symbol text textPath tref tspan use");
        this.Ne = o("alignment-baseline baseline-shift clip-path clip-rule clip color-interpolation-filters color-interpolation color-profile color-rendering color cursor direction display dominant-baseline enable-background fill-opacity fill-rule fill filter flood-color flood-opacity font-family font-size-adjust font-size font-stretch font-style font-variant font-weight glyph-orientation-horizontal glyph-orientation-vertical image-rendering kerning letter-spacing lighting-color marker-end marker-mid marker-start mask opacity overflow pointer-events shape-rendering stop-color stop-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width stroke text-anchor text-decoration text-rendering unicode-bidi visibility word-spacing writing-mode");
        const t = v(ae);
        this.SVGElement = t.globalThis.SVGElement;
        const e = t.document.createElement("div");
        e.innerHTML = "<svg><altGlyph /></svg>";
        if (e.firstElementChild.nodeName === "altglyph") {
            const t = this.Ve;
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
        return this.$e[t.nodeName] === true && this.Ne[e] === true || this.Ve[t.nodeName]?.[e] === true;
    }
}

const Bs = /*@__PURE__*/ Wt("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    constructor() {
        this.fns = [];
        this.je = createLookup();
        this.We = createLookup();
        this.svg = v(As);
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
        let i;
        let s;
        let n;
        for (s in t) {
            e = t[s];
            i = this.je[s] ??= createLookup();
            for (n in e) {
                if (i[n] !== void 0) {
                    throw createError(n, s);
                }
                i[n] = e[n];
            }
        }
    }
    useGlobalMapping(t) {
        const e = this.We;
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
        return this.je[t.nodeName]?.[e] ?? this.We[e] ?? (isDataAttribute(t, e, this.svg) ? e : null);
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

const Ss = createLookup();

class AttributeNSAccessor {
    static forNs(t) {
        return Ss[t] ??= new AttributeNSAccessor(t);
    }
    constructor(t) {
        this.ns = t;
        this.type = At | Bt;
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
        this.type = At | Bt;
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

const Rs = new DataAttributeAccessor;

const Ts = {
    childList: true,
    subtree: true,
    characterData: true
};

function defaultMatcher$1(t, e) {
    return t === e;
}

class SelectValueObserver {
    constructor(t, e, i, s) {
        this.type = At | kt | Bt;
        this.v = void 0;
        this.ov = void 0;
        this.Ue = false;
        this.ze = void 0;
        this.Ge = void 0;
        this.iO = false;
        this.ft = false;
        this.ut = t;
        this.oL = s;
        this.cf = i;
    }
    getValue() {
        return this.iO ? this.v : this.ut.multiple ? getSelectedOptions(this.ut.options) : this.ut.value;
    }
    setValue(t) {
        this.ov = this.v;
        this.v = t;
        this.Ue = t !== this.ov;
        this.Ke(t instanceof Array ? t : null);
        this.wt();
    }
    wt() {
        if (this.Ue) {
            this.Ue = false;
            this.syncOptions();
        }
    }
    handleCollectionChange() {
        this.syncOptions();
    }
    syncOptions() {
        const t = this.v;
        const e = this.ut;
        const i = isArray(t);
        const s = e.matcher ?? defaultMatcher$1;
        const n = e.options;
        let r = n.length;
        while (r-- > 0) {
            const e = n[r];
            const l = ht.call(e, "model") ? e.model : e.value;
            if (i) {
                e.selected = t.findIndex((t => !!s(l, t))) !== -1;
                continue;
            }
            e.selected = !!s(l, t);
        }
    }
    syncValue() {
        const t = this.ut;
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
            const a = [];
            while (n < i) {
                r = e[n];
                if (r.selected) {
                    a.push(ht.call(r, "model") ? r.model : r.value);
                }
                ++n;
            }
            let h;
            n = 0;
            while (n < s.length) {
                h = s[n];
                if (a.findIndex((t => !!l(h, t))) === -1) {
                    s.splice(n, 1);
                } else {
                    ++n;
                }
            }
            n = 0;
            while (n < a.length) {
                h = a[n];
                if (s.findIndex((t => !!l(h, t))) === -1) {
                    s.push(h);
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
                r = ht.call(l, "model") ? l.model : l.value;
                break;
            }
            ++n;
        }
        this.ov = this.v;
        this.v = r;
        return true;
    }
    dt() {
        (this.Ge = createMutationObserver(this.ut, this.Xe.bind(this))).observe(this.ut, Ts);
        this.Ke(this.v instanceof Array ? this.v : null);
        this.iO = true;
    }
    gt() {
        this.Ge.disconnect();
        this.ze?.unsubscribe(this);
        this.Ge = this.ze = void 0;
        this.iO = false;
    }
    Ke(t) {
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
            this.Qe();
        }
    }
    Xe(t) {
        this.syncOptions();
        const e = this.syncValue();
        if (e) {
            this.Qe();
        }
    }
    Qe() {
        Es = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Es);
    }
}

mixinNodeObserverUseConfig(SelectValueObserver);

N(SelectValueObserver);

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
            e[e.length] = ht.call(n, "model") ? n.model : n.value;
        }
        ++s;
    }
    return e;
}

let Es = void 0;

const Is = "--";

class StyleAttributeAccessor {
    constructor(t) {
        this.obj = t;
        this.type = At | Bt;
        this.v = "";
        this.ov = "";
        this.styles = {};
        this.version = 0;
        this.Ue = false;
    }
    getValue() {
        return this.obj.style.cssText;
    }
    setValue(t) {
        this.v = t;
        this.Ue = t !== this.ov;
        this.wt();
    }
    Ye(t) {
        const e = [];
        const i = /url\([^)]+$/;
        let s = 0;
        let n = "";
        let r;
        let l;
        let a;
        let h;
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
            a = n.substring(0, l).trim();
            h = n.substring(l + 1).trim();
            e.push([ a, h ]);
            n = "";
        }
        return e;
    }
    Ze(t) {
        let e;
        let i;
        const s = [];
        for (i in t) {
            e = t[i];
            if (e == null) {
                continue;
            }
            if (isString(e)) {
                if (i.startsWith(Is)) {
                    s.push([ i, e ]);
                    continue;
                }
                s.push([ a(i), e ]);
                continue;
            }
            s.push(...this.Je(e));
        }
        return s;
    }
    ti(t) {
        const e = t.length;
        if (e > 0) {
            const i = [];
            let s = 0;
            for (;e > s; ++s) {
                i.push(...this.Je(t[s]));
            }
            return i;
        }
        return w;
    }
    Je(t) {
        if (isString(t)) {
            return this.Ye(t);
        }
        if (t instanceof Array) {
            return this.ti(t);
        }
        if (t instanceof Object) {
            return this.Ze(t);
        }
        return w;
    }
    wt() {
        if (this.Ue) {
            this.Ue = false;
            const t = this.v;
            const e = this.styles;
            const i = this.Je(t);
            let s;
            let n = this.version;
            this.ov = t;
            let r;
            let l;
            let a;
            let h = 0;
            const c = i.length;
            for (;h < c; ++h) {
                r = i[h];
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
            for (s in e) {
                if (!ht.call(e, s) || e[s] !== n) {
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
        this.type = At | kt | Bt;
        this.v = "";
        this.ov = "";
        this.Ue = false;
        this.ft = false;
        this.ut = t;
        this.k = e;
        this.cf = i;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (gt(t, this.v)) {
            return;
        }
        this.ov = this.v;
        this.v = t;
        this.Ue = true;
        if (!this.cf.readonly) {
            this.wt();
        }
    }
    wt() {
        if (this.Ue) {
            this.Ue = false;
            this.ut[this.k] = this.v ?? this.cf.default;
            this.Qe();
        }
    }
    handleEvent() {
        this.ov = this.v;
        this.v = this.ut[this.k];
        if (this.ov !== this.v) {
            this.Ue = false;
            this.Qe();
        }
    }
    dt() {
        this.v = this.ov = this.ut[this.k];
    }
    Qe() {
        Ps = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Ps);
    }
}

mixinNodeObserverUseConfig(ValueAttributeObserver);

N(ValueAttributeObserver);

let Ps = void 0;

const Ls = "http://www.w3.org/1999/xlink";

const Ds = "http://www.w3.org/XML/1998/namespace";

const Ms = "http://www.w3.org/2000/xmlns/";

const _s = ut(createLookup(), {
    "xlink:actuate": [ "actuate", Ls ],
    "xlink:arcrole": [ "arcrole", Ls ],
    "xlink:href": [ "href", Ls ],
    "xlink:role": [ "role", Ls ],
    "xlink:show": [ "show", Ls ],
    "xlink:title": [ "title", Ls ],
    "xlink:type": [ "type", Ls ],
    "xml:lang": [ "lang", Ds ],
    "xml:space": [ "space", Ds ],
    xmlns: [ "xmlns", Ms ],
    "xmlns:xlink": [ "xlink", Ms ]
});

const qs = new G;

qs.type = At | Bt;

class NodeObserverLocator {
    static register(t) {
        t.register(Ut(this, this), zt(this, K));
    }
    constructor() {
        this.allowDirtyCheck = true;
        this.ei = createLookup();
        this.ii = createLookup();
        this.si = createLookup();
        this.ni = createLookup();
        this.ri = v(D);
        this.p = v(ae);
        this.oi = v(X);
        this.svg = v(As);
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
    handles(t, e) {
        return t instanceof this.p.Node;
    }
    useConfig(t, e, i) {
        const s = this.ei;
        let n;
        if (isString(t)) {
            n = s[t] ??= createLookup();
            if (n[e] == null) {
                n[e] = i;
            } else {
                throwMappingExisted(t, e);
            }
        } else {
            for (const i in t) {
                n = s[i] ??= createLookup();
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
        const i = this.ii;
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
        if (e in this.ni || e in (this.si[t.tagName] ?? M)) {
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
            return Rs;

          default:
            {
                const i = _s[e];
                if (i !== undefined) {
                    return AttributeNSAccessor.forNs(i[1]);
                }
                if (isDataAttribute(t, e, this.svg)) {
                    return Rs;
                }
                return qs;
            }
        }
    }
    overrideAccessor(t, e) {
        let i;
        if (isString(t)) {
            i = this.si[t] ??= createLookup();
            i[e] = true;
        } else {
            for (const e in t) {
                for (const s of t[e]) {
                    i = this.si[e] ??= createLookup();
                    i[s] = true;
                }
            }
        }
    }
    overrideAccessorGlobal(...t) {
        for (const e of t) {
            this.ni[e] = true;
        }
    }
    getNodeObserverConfig(t, e) {
        return this.ei[t.tagName]?.[e] ?? this.ii[e];
    }
    getNodeObserver(t, e, i) {
        const s = this.ei[t.tagName]?.[e] ?? this.ii[e];
        let n;
        if (s != null) {
            n = new (s.type ?? ValueAttributeObserver)(t, e, s, i, this.ri);
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
        const n = _s[e];
        if (n !== undefined) {
            return AttributeNSAccessor.forNs(n[1]);
        }
        if (isDataAttribute(t, e, this.svg)) {
            return Rs;
        }
        if (e in t.constructor.prototype) {
            if (this.allowDirtyCheck) {
                return this.oi.createProperty(t, e);
            }
            throw createMappedError(652, e);
        } else {
            return new Y(t, e);
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
    constructor(t, e, i, s) {
        this.type = At | kt | Bt;
        this.v = void 0;
        this.ov = void 0;
        this.li = void 0;
        this.ai = void 0;
        this.ft = false;
        this.ut = t;
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
        this.hi();
        this.ui();
        this.Qe();
    }
    handleCollectionChange() {
        this.ui();
    }
    handleChange(t, e) {
        this.ui();
    }
    ui() {
        const t = this.v;
        const e = this.ut;
        const i = ht.call(e, "model") ? e.model : e.value;
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
        const e = this.ut;
        const i = ht.call(e, "model") ? e.model : e.value;
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
        this.Qe();
    }
    dt() {
        this.hi();
    }
    gt() {
        this.li?.unsubscribe(this);
        this.ai?.unsubscribe(this);
        this.li = this.ai = void 0;
    }
    Qe() {
        Fs = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Fs);
    }
    hi() {
        const t = this.ut;
        (this.ai ??= t.$observers?.model ?? t.$observers?.value)?.subscribe(this);
        this.li?.unsubscribe(this);
        this.li = void 0;
        if (t.type === "checkbox") {
            (this.li = getCollectionObserver(this.v, this.oL))?.subscribe(this);
        }
    }
}

mixinNodeObserverUseConfig(CheckedObserver);

N(CheckedObserver);

let Fs = void 0;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) {
            throw createMappedError(9994, e);
        }
        e.useTargetObserver(Rs);
    }
}

AttrBindingBehavior.$au = {
    type: Yt,
    name: "attr"
};

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

SelfBindingBehavior.$au = {
    type: Yt,
    name: "self"
};

class UpdateTriggerBindingBehavior {
    constructor() {
        this.oL = v(j);
        this.fi = v(K);
    }
    bind(t, e, ...i) {
        if (!(this.fi instanceof NodeObserverLocator)) {
            throw createMappedError(9993);
        }
        if (i.length === 0) {
            throw createMappedError(802);
        }
        if (!(e instanceof PropertyBinding) || !(e.mode & Lt)) {
            throw createMappedError(803);
        }
        const s = this.fi.getNodeObserverConfig(e.target, e.targetProperty);
        if (s == null) {
            throw createMappedError(9992, e);
        }
        const n = this.fi.getNodeObserver(e.target, e.targetProperty, this.oL);
        n.useConfig({
            readonly: s.readonly,
            default: s.default,
            events: i
        });
        e.useTargetObserver(n);
    }
}

UpdateTriggerBindingBehavior.$au = {
    type: Yt,
    name: "updateTrigger"
};

class If {
    constructor() {
        this.elseFactory = void 0;
        this.elseView = void 0;
        this.ifView = void 0;
        this.view = void 0;
        this.value = false;
        this.cache = true;
        this.pending = void 0;
        this.di = false;
        this.mi = 0;
        this.gi = v(Pe);
        this.l = v(ts);
    }
    attaching(t, e) {
        return this.pi(this.value);
    }
    detaching(t, e) {
        this.di = true;
        return R(this.pending, (() => {
            this.di = false;
            this.pending = void 0;
            void this.view?.deactivate(t, this.$controller);
        }));
    }
    valueChanged(t, e) {
        if (!this.$controller.isActive) return;
        t = !!t;
        e = !!e;
        if (t !== e) return this.pi(t);
    }
    pi(t) {
        const e = this.view;
        const i = this.$controller;
        const s = this.mi++;
        const isCurrent = () => !this.di && this.mi === s + 1;
        let n;
        return R(this.pending, (() => this.pending = R(e?.deactivate(e, i), (() => {
            if (!isCurrent()) {
                return;
            }
            if (t) {
                n = this.view = this.ifView = this.cache && this.ifView != null ? this.ifView : this.gi.create();
            } else {
                n = this.view = this.elseView = this.cache && this.elseView != null ? this.elseView : this.elseFactory?.create();
            }
            if (n == null) {
                return;
            }
            n.setLocation(this.l);
            return R(n.activate(n, i, i.scope), (() => {
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

If.$au = {
    type: ce,
    name: "if",
    isTemplateController: true,
    bindables: {
        value: true,
        cache: {
            set: t => t === "" || !!t && t !== "false"
        }
    }
};

class Else {
    constructor() {
        this.f = v(Pe);
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

Else.$au = {
    type: "custom-attribute",
    name: "else",
    isTemplateController: true
};

function dispose(t) {
    t.dispose();
}

const Os = [ "BindingBehavior", "ValueConverter" ];

class Repeat {
    constructor(t, e, i, s, n) {
        this.views = [];
        this.vi = [];
        this.key = null;
        this.bi = new Map;
        this.wi = new Map;
        this.yi = void 0;
        this.xi = false;
        this.Ci = false;
        this.ki = null;
        this.Ai = void 0;
        this.Bi = false;
        const r = t.props[0].props[0];
        if (r !== void 0) {
            const {to: t, value: i, command: s} = r;
            if (t === "key") {
                if (s === null) {
                    this.key = i;
                } else if (s === "bind") {
                    this.key = e.parse(i, yt);
                } else {
                    throw createMappedError(775, s);
                }
            } else {
                throw createMappedError(776, t);
            }
        }
        this.l = i;
        this.Si = s;
        this.f = n;
    }
    binding(t, e) {
        const i = this.Si.bindings;
        const s = i.length;
        let n = void 0;
        let r;
        let l = 0;
        for (;s > l; ++l) {
            n = i[l];
            if (n.target === this && n.targetProperty === "items") {
                r = this.forOf = n.ast;
                this.Ri = n;
                let t = r.iterable;
                while (t != null && Os.includes(t.$kind)) {
                    t = t.expression;
                    this.xi = true;
                }
                this.ki = t;
                break;
            }
        }
        this.Ti();
        const a = r.declaration;
        if (!(this.Bi = a.$kind === "ArrayDestructuring" || a.$kind === "ObjectDestructuring")) {
            this.local = Rt(a, this.$controller.scope, n, null);
        }
    }
    attaching(t, e) {
        this.Ei();
        return this.Ii(t);
    }
    detaching(t, e) {
        this.Ti();
        return this.Pi(t);
    }
    unbinding(t, e) {
        this.wi.clear();
        this.bi.clear();
    }
    itemsChanged() {
        if (!this.$controller.isActive) {
            return;
        }
        this.Ti();
        this.Ei();
        this.Li(this.items, void 0);
    }
    handleCollectionChange(t, e) {
        const i = this.$controller;
        if (!i.isActive) {
            return;
        }
        if (this.xi) {
            if (this.Ci) {
                return;
            }
            this.Ci = true;
            this.items = Rt(this.forOf.iterable, i.scope, this.Ri, null);
            this.Ci = false;
            return;
        }
        this.Ei();
        this.Li(t, e);
    }
    Li(t, e) {
        const i = this.views;
        this.vi = i.slice();
        const s = i.length;
        const n = this.key;
        const r = n !== null;
        if (r || e === void 0) {
            const t = this.local;
            const l = this.Ai;
            const a = l.length;
            const h = this.forOf;
            const c = h.declaration;
            const u = this.Ri;
            const f = this.Bi;
            e = Z(a);
            let d = 0;
            if (s === 0) {
                for (;d < a; ++d) {
                    e[d] = -2;
                }
            } else if (a === 0) {
                if (f) {
                    for (d = 0; d < s; ++d) {
                        e.deletedIndices.push(d);
                        e.deletedItems.push(Rt(c, i[d].scope, u, null));
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
                        m[d] = Rt(c, i[d].scope, u, null);
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
                let w = 0;
                const y = s - 1;
                const x = a - 1;
                const C = new Map;
                const k = new Map;
                const A = this.bi;
                const B = this.wi;
                const S = this.$controller.scope;
                d = 0;
                t: {
                    while (true) {
                        if (r) {
                            g = m[d];
                            p = l[d];
                            v = getKeyValue(A, n, g, getScope(B, g, h, S, u, t, f), u);
                            b = getKeyValue(A, n, p, getScope(B, p, h, S, u, t, f), u);
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
                        if (d > y || d > x) {
                            break t;
                        }
                    }
                    if (y !== x) {
                        break t;
                    }
                    w = x;
                    while (true) {
                        if (r) {
                            g = m[w];
                            p = l[w];
                            v = getKeyValue(A, n, g, getScope(B, g, h, S, u, t, f), u);
                            b = getKeyValue(A, n, p, getScope(B, p, h, S, u, t, f), u);
                        } else {
                            g = v = ensureUnique(m[d], d);
                            p = b = ensureUnique(l[d], d);
                        }
                        if (v !== b) {
                            A.set(g, v);
                            A.set(p, b);
                            break;
                        }
                        --w;
                        if (d > w) {
                            break t;
                        }
                    }
                }
                const R = d;
                const T = d;
                for (d = T; d <= x; ++d) {
                    if (A.has(p = r ? l[d] : ensureUnique(l[d], d))) {
                        b = A.get(p);
                    } else {
                        b = r ? getKeyValue(A, n, p, getScope(B, p, h, S, u, t, f), u) : p;
                        A.set(p, b);
                    }
                    k.set(b, d);
                }
                for (d = R; d <= y; ++d) {
                    if (A.has(g = r ? m[d] : ensureUnique(m[d], d))) {
                        v = A.get(g);
                    } else {
                        v = r ? getKeyValue(A, n, g, i[d].scope, u) : g;
                    }
                    C.set(v, d);
                    if (k.has(v)) {
                        e[k.get(v)] = d;
                    } else {
                        e.deletedIndices.push(d);
                        e.deletedItems.push(g);
                    }
                }
                for (d = T; d <= x; ++d) {
                    if (!C.has(A.get(r ? l[d] : ensureUnique(l[d], d)))) {
                        e[d] = -2;
                    }
                }
                C.clear();
                k.clear();
            }
        }
        if (e === void 0) {
            const t = R(this.Pi(null), (() => this.Ii(null)));
            if (isPromise(t)) {
                t.catch(rethrow);
            }
        } else {
            if (e.deletedIndices.length > 0) {
                const t = R(this.Di(e), (() => this.Mi(s, e)));
                if (isPromise(t)) {
                    t.catch(rethrow);
                }
            } else {
                this.Mi(s, e);
            }
        }
    }
    Ti() {
        const t = this.$controller.scope;
        let e = this._i;
        let i = this.xi;
        let s;
        if (i) {
            e = this._i = Rt(this.ki, t, this.Ri, null) ?? null;
            i = this.xi = !gt(this.items, e);
        }
        const n = this.yi;
        if (this.$controller.isActive) {
            s = this.yi = J(i ? e : this.items);
            if (n !== s) {
                n?.unsubscribe(this);
                s?.subscribe(this);
            }
        } else {
            n?.unsubscribe(this);
            this.yi = undefined;
        }
    }
    Ei() {
        const {items: t} = this;
        if (isArray(t)) {
            this.Ai = t;
            return;
        }
        const e = [];
        iterate(t, ((t, i) => {
            e[i] = t;
        }));
        this.Ai = e;
    }
    Ii(t) {
        let e = void 0;
        let i;
        let s;
        let n;
        const {$controller: r, f: l, local: a, l: h, items: c, wi: u, Ri: f, forOf: d, Bi: m} = this;
        const g = r.scope;
        const p = getCount(c);
        const v = this.views = Array(p);
        iterate(c, ((c, b) => {
            s = v[b] = l.create().setLocation(h);
            s.nodes.unlink();
            n = getScope(u, c, d, g, f, a, m);
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
    Pi(t) {
        let e = void 0;
        let i;
        let s;
        let n = 0;
        const {views: r, $controller: l} = this;
        const a = r.length;
        for (;a > n; ++n) {
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
    Di(t) {
        let e = void 0;
        let i;
        let s;
        const {$controller: n, views: r} = this;
        const l = t.deletedIndices.slice().sort(compareNumber);
        const a = l.length;
        let h = 0;
        for (;a > h; ++h) {
            s = r[l[h]];
            s.release();
            i = s.deactivate(s, n);
            if (isPromise(i)) {
                (e ?? (e = [])).push(i);
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
    Mi(t, e) {
        let i = void 0;
        let s;
        let n;
        let r;
        let l = 0;
        const {$controller: a, f: h, local: c, Ai: u, l: f, views: d, Bi: m, Ri: g, wi: p, vi: v, forOf: b} = this;
        const w = e.length;
        for (;w > l; ++l) {
            if (e[l] === -2) {
                n = h.create();
                d.splice(l, 0, n);
            }
        }
        if (d.length !== w) {
            throw createMappedError(814, [ d.length, w ]);
        }
        const y = a.scope;
        const x = e.length;
        let C = 0;
        l = 0;
        for (;l < e.length; ++l) {
            if ((C = e[l]) !== -2) {
                d[l] = v[C];
            }
        }
        const k = longestIncreasingSubsequence(e);
        const A = k.length;
        const B = b.declaration;
        let S;
        let R = A - 1;
        l = x - 1;
        for (;l >= 0; --l) {
            n = d[l];
            S = d[l + 1];
            n.nodes.link(S?.nodes ?? f);
            if (e[l] === -2) {
                r = getScope(p, u[l], b, y, g, c, m);
                setContextualProperties(r.overrideContext, l, x);
                n.setLocation(f);
                s = n.activate(n, a, r);
                if (isPromise(s)) {
                    (i ?? (i = [])).push(s);
                }
            } else if (R < 0 || A === 1 || l !== k[R]) {
                if (m) {
                    St(B, n.scope, g, u[l]);
                } else {
                    n.scope.bindingContext[c] = u[l];
                }
                setContextualProperties(n.scope.overrideContext, l, x);
                n.nodes.insertBefore(n.location);
            } else {
                if (m) {
                    St(B, n.scope, g, u[l]);
                } else {
                    n.scope.bindingContext[c] = u[l];
                }
                if (t !== x) {
                    setContextualProperties(n.scope.overrideContext, l, x);
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

Repeat.$au = {
    type: ce,
    name: "repeat",
    isTemplateController: true,
    bindables: [ "items" ]
};

Repeat.inject = [ oi, e, ts, Gi, Pe ];

let Hs = 16;

let Vs = new Int32Array(Hs);

let $s = new Int32Array(Hs);

function longestIncreasingSubsequence(t) {
    const e = t.length;
    if (e > Hs) {
        Hs = e;
        Vs = new Int32Array(e);
        $s = new Int32Array(e);
    }
    let i = 0;
    let s = 0;
    let n = 0;
    let r = 0;
    let l = 0;
    let a = 0;
    let h = 0;
    let c = 0;
    for (;r < e; r++) {
        s = t[r];
        if (s !== -2) {
            l = Vs[i];
            n = t[l];
            if (n !== -2 && n < s) {
                $s[r] = l;
                Vs[++i] = r;
                continue;
            }
            a = 0;
            h = i;
            while (a < h) {
                c = a + h >> 1;
                n = t[Vs[c]];
                if (n !== -2 && n < s) {
                    a = c + 1;
                } else {
                    h = c;
                }
            }
            n = t[Vs[a]];
            if (s < n || n === -2) {
                if (a > 0) {
                    $s[r] = Vs[a - 1];
                }
                Vs[a] = r;
            }
        }
    }
    r = ++i;
    const u = new Int32Array(r);
    s = Vs[i - 1];
    while (i-- > 0) {
        u[i] = s;
        s = $s[s];
    }
    while (r-- > 0) Vs[r] = 0;
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

const Ns = at.toString;

const getCount = t => {
    switch (Ns.call(t)) {
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
    switch (Ns.call(t)) {
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
            r = Rt(e, s, n, null);
        }
        t.set(i, r);
    }
    return r;
};

const getScope = (t, e, i, s, n, r, l) => {
    let a = t.get(e);
    if (a === void 0) {
        if (l) {
            St(i.declaration, a = V.fromParent(s, new tt), n, e);
        } else {
            a = V.fromParent(s, new tt(r, e));
        }
        t.set(e, a);
    }
    return a;
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
        this.view = v(Pe).create().setLocation(v(ts));
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

With.$au = {
    type: ce,
    name: "with",
    isTemplateController: true,
    bindables: [ "value" ]
};

class Switch {
    constructor() {
        this.cases = [];
        this.activeCases = [];
        this.promise = void 0;
        this.f = v(Pe);
        this.l = v(ts);
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
        this.queue((() => this.qi(t)));
    }
    qi(t) {
        const e = t.isMatch(this.value);
        const i = this.activeCases;
        const s = i.length;
        if (!e) {
            if (s > 0 && i[0].id === t.id) {
                return this.Fi(null);
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
        return R(this.Fi(null, n), (() => {
            this.activeCases = n;
            return this.Oi(null);
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
        return R(this.activeCases.length > 0 ? this.Fi(t, i) : void 0, (() => {
            this.activeCases = i;
            if (i.length === 0) {
                return;
            }
            return this.Oi(t);
        }));
    }
    Oi(t) {
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
        return S(...i.map((e => e.activate(t, n))));
    }
    Fi(t, e = []) {
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
        return R(S(...i.reduce(((i, s) => {
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
        i = this.promise = R(R(e, t), (() => {
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
}

Switch.$au = {
    type: ce,
    name: "switch",
    isTemplateController: true,
    bindables: [ "value" ]
};

let js = 0;

class Case {
    constructor() {
        this.id = ++js;
        this.fallThrough = false;
        this.view = void 0;
        this.f = v(Pe);
        this.ri = v(j);
        this.l = v(ts);
        this.Hi = v(_).scopeTo(`${this.constructor.name}-#${this.id}`);
    }
    link(t, e, i, s) {
        const n = t.parent;
        const r = n?.viewModel;
        if (r instanceof Switch) {
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
            if (this.yi === void 0) {
                this.yi = this.Vi(e);
            }
            return e.includes(t);
        }
        return e === t;
    }
    valueChanged(t, e) {
        if (isArray(t)) {
            this.yi?.unsubscribe(this);
            this.yi = this.Vi(t);
        } else if (this.yi !== void 0) {
            this.yi.unsubscribe(this);
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
        this.yi?.unsubscribe(this);
        this.view?.dispose();
        this.view = void 0;
    }
    linkToSwitch(t) {
        t.cases.push(this);
    }
    Vi(t) {
        const e = this.ri.getArrayObserver(t);
        e.subscribe(this);
        return e;
    }
    accept(t) {
        if (this.$controller.accept(t) === true) {
            return true;
        }
        return this.view?.accept(t);
    }
}

class DefaultCase extends Case {
    linkToSwitch(t) {
        if (t.defaultCase !== void 0) {
            throw createMappedError(816);
        }
        t.defaultCase = this;
    }
}

const Ws = [ "value", {
    name: "fallThrough",
    mode: It,
    set(t) {
        switch (t) {
          case "true":
            return true;

          case "false":
            return false;

          default:
            return !!t;
        }
    }
} ];

defineAttribute({
    name: "default-case",
    bindables: Ws,
    isTemplateController: true
}, DefaultCase);

defineAttribute({
    name: "case",
    bindables: Ws,
    isTemplateController: true
}, Case);

class PromiseTemplateController {
    constructor() {
        this.preSettledTask = null;
        this.postSettledTask = null;
        this.f = v(Pe);
        this.l = v(ts);
        this.p = v(ae);
        this.logger = v(_).scopeTo("promise.resolve");
    }
    link(t, e, i, s) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(t, e) {
        const i = this.view;
        const s = this.$controller;
        return R(i.activate(t, s, this.viewScope = V.fromParent(s.scope, {})), (() => this.swap(t)));
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
        let a;
        const h = {
            reusable: false
        };
        const $swap = () => {
            void S(a = (this.preSettledTask = i.queueTask((() => S(s?.deactivate(t), n?.deactivate(t), r?.activate(t, l))), h)).result.catch((t => {
                if (!(t instanceof rt)) throw t;
            })), e.then((c => {
                if (this.value !== e) {
                    return;
                }
                const fulfill = () => {
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => S(r?.deactivate(t), n?.deactivate(t), s?.activate(t, l, c))), h)).result;
                };
                if (this.preSettledTask.status === Ct) {
                    void a.then(fulfill);
                } else {
                    this.preSettledTask.cancel();
                    fulfill();
                }
            }), (c => {
                if (this.value !== e) {
                    return;
                }
                const reject = () => {
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => S(r?.deactivate(t), s?.deactivate(t), n?.activate(t, l, c))), h)).result;
                };
                if (this.preSettledTask.status === Ct) {
                    void a.then(reject);
                } else {
                    this.preSettledTask.cancel();
                    reject();
                }
            })));
        };
        if (this.postSettledTask?.status === Ct) {
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
}

PromiseTemplateController.$au = {
    type: ce,
    name: "promise",
    isTemplateController: true,
    bindables: [ "value" ]
};

class PendingTemplateController {
    constructor() {
        this.view = void 0;
        this.f = v(Pe);
        this.l = v(ts);
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
}

PendingTemplateController.$au = {
    type: ce,
    name: "pending",
    isTemplateController: true,
    bindables: {
        value: {
            mode: Pt
        }
    }
};

class FulfilledTemplateController {
    constructor() {
        this.view = void 0;
        this.f = v(Pe);
        this.l = v(ts);
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
}

FulfilledTemplateController.$au = {
    type: ce,
    name: "then",
    isTemplateController: true,
    bindables: {
        value: {
            mode: Lt
        }
    }
};

class RejectedTemplateController {
    constructor() {
        this.view = void 0;
        this.f = v(Pe);
        this.l = v(ts);
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
}

RejectedTemplateController.$au = {
    type: ce,
    name: "catch",
    isTemplateController: true,
    bindables: {
        value: {
            mode: Lt
        }
    }
};

function getPromiseController(t) {
    const e = t.parent;
    const i = e?.viewModel;
    if (i instanceof PromiseTemplateController) {
        return i;
    }
    throw createMappedError(813);
}

class PromiseAttributePattern {
    "promise.resolve"(t, e) {
        return new AttrSyntax(t, e, "promise", "bind");
    }
}

ys.define([ {
    pattern: "promise.resolve",
    symbols: ""
} ], PromiseAttributePattern);

class FulfilledAttributePattern {
    then(t, e) {
        return new AttrSyntax(t, e, "then", "from-view");
    }
}

ys.define([ {
    pattern: "then",
    symbols: ""
} ], FulfilledAttributePattern);

class RejectedAttributePattern {
    catch(t, e) {
        return new AttrSyntax(t, e, "catch", "from-view");
    }
}

ys.define([ {
    pattern: "catch",
    symbols: ""
} ], RejectedAttributePattern);

class Focus {
    constructor() {
        this.$i = false;
        this.Ni = v(Zi);
        this.p = v(ae);
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) {
            this.ji();
        } else {
            this.$i = true;
        }
    }
    attached() {
        if (this.$i) {
            this.$i = false;
            this.ji();
        }
        this.Ni.addEventListener("focus", this);
        this.Ni.addEventListener("blur", this);
    }
    detaching() {
        const t = this.Ni;
        t.removeEventListener("focus", this);
        t.removeEventListener("blur", this);
    }
    handleEvent(t) {
        if (t.type === "focus") {
            this.value = true;
        } else if (!this.Wi) {
            this.value = false;
        }
    }
    ji() {
        const t = this.Ni;
        const e = this.Wi;
        const i = this.value;
        if (i && !e) {
            t.focus();
        } else if (!i && e) {
            t.blur();
        }
    }
    get Wi() {
        return this.Ni === this.p.document.activeElement;
    }
}

Focus.$au = {
    type: ce,
    name: "focus",
    bindables: {
        value: {
            mode: Dt
        }
    }
};

class Portal {
    constructor() {
        this.position = "beforeend";
        this.strict = false;
        const t = v(Pe);
        const e = v(ts);
        const i = v(ae);
        this.p = i;
        this.Ui = i.document.createElement("div");
        (this.view = t.create()).setLocation(this.zi = createLocation(i));
        setEffectiveParentNode(this.view.nodes, e);
    }
    attaching(t) {
        if (this.callbackContext == null) {
            this.callbackContext = this.$controller.scope.bindingContext;
        }
        const e = this.Ui = this.Gi();
        this.Ki(e, this.position);
        return this.Xi(t, e);
    }
    detaching(t) {
        return this.Qi(t, this.Ui);
    }
    targetChanged() {
        const {$controller: t} = this;
        if (!t.isActive) {
            return;
        }
        const e = this.Gi();
        if (this.Ui === e) {
            return;
        }
        this.Ui = e;
        const i = R(this.Qi(null, e), (() => {
            this.Ki(e, this.position);
            return this.Xi(null, e);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    positionChanged() {
        const {$controller: t, Ui: e} = this;
        if (!t.isActive) {
            return;
        }
        const i = R(this.Qi(null, e), (() => {
            this.Ki(e, this.position);
            return this.Xi(null, e);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    Xi(t, e) {
        const {activating: i, callbackContext: s, view: n} = this;
        return R(i?.call(s, e, n), (() => this.Yi(t, e)));
    }
    Yi(t, e) {
        const {$controller: i, view: s} = this;
        if (t === null) {
            s.nodes.insertBefore(this.zi);
        } else {
            return R(s.activate(t ?? s, i, i.scope), (() => this.Zi(e)));
        }
        return this.Zi(e);
    }
    Zi(t) {
        const {activated: e, callbackContext: i, view: s} = this;
        return e?.call(i, t, s);
    }
    Qi(t, e) {
        const {deactivating: i, callbackContext: s, view: n} = this;
        return R(i?.call(s, e, n), (() => this.Ji(t, e)));
    }
    Ji(t, e) {
        const {$controller: i, view: s} = this;
        if (t === null) {
            s.nodes.remove();
        } else {
            return R(s.deactivate(t, i), (() => this.ts(e)));
        }
        return this.ts(e);
    }
    ts(t) {
        const {deactivated: e, callbackContext: i, view: s} = this;
        return R(e?.call(i, t, s), (() => this.es()));
    }
    Gi() {
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
    es() {
        this.zi.remove();
        this.zi.$start.remove();
    }
    Ki(t, e) {
        const i = this.zi;
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

Portal.$au = {
    type: ce,
    name: "portal",
    isTemplateController: true,
    bindables: [ {
        name: "target",
        primary: true
    }, "position", "activated", "activating", "callbackContext", {
        name: "renderContext",
        callback: "targetChanged"
    }, "strict", "deactivated", "deactivating" ]
};

let Us;

class AuSlot {
    constructor() {
        this.ss = null;
        this.rs = null;
        this.Xt = false;
        this.expose = null;
        this.slotchange = null;
        this.os = new Set;
        this.yi = null;
        const t = v(Ki);
        const e = v(ts);
        const i = v(oi);
        const s = v(vi);
        const n = this.name = i.data.name;
        const r = i.projections?.[Me];
        const l = t.instruction?.projections?.[n];
        const a = t.controller.container;
        let h;
        let c;
        if (l == null) {
            c = a.createChild({
                inheritParentResources: true
            });
            h = s.getViewFactory(r ?? (Us ??= CustomElementDefinition.create({
                name: "au-slot-empty-template",
                template: "",
                needsCompile: false
            })), c);
            this.ls = false;
        } else {
            c = a.createChild();
            c.useResources(t.parent.controller.container);
            registerResolver(c, Ki, new C(void 0, t.parent));
            h = s.getViewFactory(l, c);
            this.ls = true;
            this.cs = a.getAll(Fe, false)?.filter((t => t.slotName === "*" || t.slotName === n)) ?? w;
        }
        this.us = (this.cs ??= w).length > 0;
        this.ds = t;
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
        this.os.add(t);
    }
    unsubscribe(t) {
        this.os.delete(t);
    }
    binding(t, e) {
        this.ss = this.$controller.scope.parent;
        let i;
        if (this.ls) {
            i = this.ds.controller.scope.parent;
            (this.rs = V.fromParent(i, i.bindingContext)).overrideContext.$host = this.expose ?? this.ss.bindingContext;
        }
    }
    attaching(t, e) {
        return R(this.view.activate(t, this.$controller, this.ls ? this.rs : this.ss), (() => {
            if (this.us) {
                this.cs.forEach((t => t.watch(this)));
                this.hi();
                this.gs();
                this.Xt = true;
            }
        }));
    }
    detaching(t, e) {
        this.Xt = false;
        this.ps();
        this.cs.forEach((t => t.unwatch(this)));
        return this.view.deactivate(t, this.$controller);
    }
    exposeChanged(t) {
        if (this.ls && this.rs != null) {
            this.rs.overrideContext.$host = t;
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
    hi() {
        if (this.yi != null) {
            return;
        }
        const t = this.l;
        const e = t.parentElement;
        if (e == null) {
            return;
        }
        (this.yi = createMutationObserver(e, (e => {
            if (isMutationWithinLocation(t, e)) {
                this.gs();
            }
        }))).observe(e, {
            childList: true
        });
    }
    ps() {
        this.yi?.disconnect();
        this.yi = null;
    }
    gs() {
        const t = this.nodes;
        const e = new Set(this.os);
        let i;
        if (this.Xt) {
            this.slotchange?.call(void 0, this.name, t);
        }
        for (i of e) {
            i.handleSlotChange(this, t);
        }
    }
}

AuSlot.$au = {
    type: as,
    name: "au-slot",
    template: null,
    containerless: true,
    processContent(t, e, i) {
        i.name = t.getAttribute("name") ?? Me;
        let s = t.firstChild;
        let n = null;
        while (s !== null) {
            n = s.nextSibling;
            if (isElement(s) && s.hasAttribute(_e)) {
                t.removeChild(s);
            }
            s = n;
        }
    },
    bindables: [ "expose", "slotchange" ]
};

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
        this.bs = void 0;
        this.tag = null;
        this.c = v(k);
        this.parent = v(Gi);
        this.ws = v(Zi);
        this.l = v(ts);
        this.p = v(ae);
        this.r = v(vi);
        this.ys = v(oi);
        this.xs = v(q(CompositionContextFactory, null));
        this.it = v(li);
        this.J = v(Ki);
        this.ep = v(e);
        this.oL = v(j);
    }
    get composing() {
        return this.Cs;
    }
    get composition() {
        return this.bs;
    }
    attaching(t, e) {
        return this.Cs = R(this.queue(new ChangeInfo(this.template, this.component, this.model, void 0), t), (t => {
            if (this.xs.ks(t)) {
                this.Cs = void 0;
            }
        }));
    }
    detaching(t) {
        const e = this.bs;
        const i = this.Cs;
        this.xs.invalidate();
        this.bs = this.Cs = void 0;
        return R(i, (() => e?.deactivate(t)));
    }
    propertyChanged(t) {
        if (t === "composing" || t === "composition") return;
        if (t === "model" && this.bs != null) {
            this.bs.update(this.model);
            return;
        }
        if (t === "tag" && this.bs?.controller.vmKind === qi) {
            return;
        }
        this.Cs = R(this.Cs, (() => R(this.queue(new ChangeInfo(this.template, this.component, this.model, t), void 0), (t => {
            if (this.xs.ks(t)) {
                this.Cs = void 0;
            }
        }))));
    }
    queue(t, e) {
        const i = this.xs;
        const s = this.bs;
        return R(i.create(t), (t => {
            if (i.ks(t)) {
                return R(this.compose(t), (n => {
                    if (i.ks(t)) {
                        return R(n.activate(e), (() => {
                            if (i.ks(t)) {
                                this.bs = n;
                                return R(s?.deactivate(e), (() => t));
                            } else {
                                return R(n.controller.deactivate(n.controller, this.$controller), (() => {
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
        const {As: e, Bs: i, Ss: s} = t.change;
        const {c: n, $controller: r, l: l, ys: a} = this;
        const h = this.Rs(this.J.controller.container, i);
        const c = n.createChild();
        const u = this.p.document.createElement(h == null ? this.tag ?? "div" : h.name);
        l.parentNode.insertBefore(u, l);
        let f;
        if (h == null) {
            f = this.tag == null ? convertToRenderLocation(u) : null;
        } else {
            f = h.containerless ? convertToRenderLocation(u) : null;
        }
        const removeCompositionHost = () => {
            u.remove();
            if (f != null) {
                let t = f.$start.nextSibling;
                let e = null;
                while (t !== null && t !== f) {
                    e = t.nextSibling;
                    t.remove();
                    t = e;
                }
                f.$start?.remove();
                f.remove();
            }
        };
        const d = this.Ts(c, typeof i === "string" ? h.Type : i, u, f);
        const compose = () => {
            const i = a.captures ?? w;
            if (h !== null) {
                const e = h.capture;
                const [s, n] = i.reduce(((t, i) => {
                    const s = !(i.target in h.bindables) && (e === true || isFunction(e) && !!e(i.target));
                    t[s ? 0 : 1].push(i);
                    return t;
                }), [ [], [] ]);
                const l = Controller.$el(c, d, u, {
                    projections: a.projections,
                    captures: s
                }, h, f);
                this.Es(u, h, n).forEach((t => l.addBinding(t)));
                return new CompositionController(l, (t => l.activate(t ?? l, r, r.scope.parent)), (t => R(l.deactivate(t ?? l, r), removeCompositionHost)), (t => d.activate?.(t)), t);
            } else {
                const s = CustomElementDefinition.create({
                    name: fs.generateName(),
                    template: e
                });
                const n = this.r.getViewFactory(s, c);
                const l = Controller.$view(n, r);
                const a = this.scopeBehavior === "auto" ? V.fromParent(this.parent.scope, d) : V.create(d);
                l.setHost(u);
                if (f == null) {
                    this.Es(u, s, i).forEach((t => l.addBinding(t)));
                } else {
                    l.setLocation(f);
                }
                return new CompositionController(l, (t => l.activate(t ?? l, r, a)), (t => R(l.deactivate(t ?? l, r), removeCompositionHost)), (t => d.activate?.(t)), t);
            }
        };
        if ("activate" in d) {
            return R(d.activate(s), (() => compose()));
        } else {
            return compose();
        }
    }
    Ts(t, e, i, s) {
        if (e == null) {
            return new EmptyComponent;
        }
        if (typeof e === "object") {
            return e;
        }
        const n = this.p;
        registerHostNode(t, n, i);
        registerResolver(t, ts, new C("IRenderLocation", s));
        const r = t.invoke(e);
        registerResolver(t, e, new C("au-compose.component", r));
        return r;
    }
    Rs(t, e) {
        if (typeof e === "string") {
            const i = fs.find(t, e);
            if (i == null) {
                throw createMappedError(806, e);
            }
            return i;
        }
        const i = isFunction(e) ? e : e?.constructor;
        return fs.isType(i, void 0) ? fs.getDefinition(i, null) : null;
    }
    Es(t, e, i) {
        const s = new HydrationContext(this.$controller, {
            projections: null,
            captures: i
        }, this.J.parent);
        return SpreadBinding.create(s, t, e, this.r, this.it, this.p, this.ep, this.oL);
    }
}

AuCompose.$au = {
    type: as,
    name: "au-compose",
    capture: true,
    containerless: true,
    bindables: [ "template", "component", "model", {
        name: "scopeBehavior",
        set: t => {
            if (t === "scoped" || t === "auto") {
                return t;
            }
            throw createMappedError(805, t);
        }
    }, {
        name: "composing",
        mode: Lt
    }, {
        name: "composition",
        mode: Lt
    }, "tag" ]
};

class EmptyComponent {}

class CompositionContextFactory {
    constructor() {
        this.id = 0;
    }
    ks(t) {
        return t.id === this.id;
    }
    create(t) {
        return R(t.load(), (t => new CompositionContext(++this.id, t)));
    }
    invalidate() {
        this.id++;
    }
}

class ChangeInfo {
    constructor(t, e, i, s) {
        this.As = t;
        this.Bs = e;
        this.Ss = i;
        this.Is = s;
    }
    load() {
        if (isPromise(this.As) || isPromise(this.Bs)) {
            return Promise.all([ this.As, this.Bs ]).then((([t, e]) => new LoadedChangeInfo(t, e, this.Ss, this.Is)));
        } else {
            return new LoadedChangeInfo(this.As, this.Bs, this.Ss, this.Is);
        }
    }
}

class LoadedChangeInfo {
    constructor(t, e, i, s) {
        this.As = t;
        this.Bs = e;
        this.Ss = i;
        this.Is = s;
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

const zs = /*@__PURE__*/ Wt("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw createMappedError(99, "sanitize");
    }
})));

class SanitizeValueConverter {
    constructor() {
        this.Ps = v(zs);
    }
    toView(t) {
        if (t == null) {
            return null;
        }
        return this.Ps.sanitize(t);
    }
}

SanitizeValueConverter.$au = {
    type: ge,
    name: "sanitize"
};

const Gs = /*@__PURE__*/ Wt("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const Ks = {};

class TemplateElementFactory {
    constructor() {
        this.p = v(ae);
        this.As = this.t();
    }
    t() {
        return this.p.document.createElement("template");
    }
    createTemplate(t) {
        if (isString(t)) {
            let e = Ks[t];
            if (e === void 0) {
                const i = this.As;
                i.innerHTML = t;
                const s = i.content.firstElementChild;
                if (needsWrapping(s)) {
                    this.As = this.t();
                    e = i;
                } else {
                    i.content.removeChild(s);
                    e = s;
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
        this.Ls = v(nn);
        this.debug = false;
        this.resolveResources = true;
    }
    static register(t) {
        t.register(Ut(this, this), zt(this, li));
    }
    compile(t, e, i) {
        if (t.template == null || t.needsCompile === false) {
            return t;
        }
        i ??= Zs;
        const s = new CompilationContext(t, e, i, null, null, void 0);
        const n = isString(t.template) || !t.enhance ? s.Ds.createTemplate(t.template) : t.template;
        const r = n.nodeName === Xs && n.content != null;
        const l = r ? n.content : n;
        const a = hn.findAll(e);
        const h = a.length;
        let c = 0;
        if (h > 0) {
            while (h > c) {
                a[c].compiling?.(n);
                ++c;
            }
        }
        if (n.hasAttribute(ln)) {
            throw createMappedError(701, t);
        }
        this.Ms(l, s);
        this._s(l, s);
        const u = CustomElementDefinition.create({
            ...t,
            name: t.name || cs(),
            dependencies: (t.dependencies ?? w).concat(s.deps ?? w),
            instructions: s.rows,
            surrogates: r ? this.qs(n, s) : w,
            template: n,
            hasSlots: s.hasSlot,
            needsCompile: false
        });
        if (s.deps != null) {
            const t = [ u.Type, ...u.dependencies, ...s.deps ];
            for (const e of s.deps) {
                getElementDefinition(e).dependencies.push(...t.filter((t => t !== e)));
            }
        }
        return u;
    }
    compileSpread(t, e, i, s, n) {
        const r = new CompilationContext(t, i, Zs, null, null, void 0);
        const l = [];
        const a = n ?? r.Fs(s.nodeName.toLowerCase());
        const h = a !== null;
        const c = r.ep;
        const u = e.length;
        let f = 0;
        let d;
        let m = null;
        let g;
        let p;
        let v;
        let b;
        let w;
        let y = null;
        let x;
        let C;
        let k;
        let A;
        for (;u > f; ++f) {
            d = e[f];
            k = d.target;
            A = d.rawValue;
            y = r.Os(d);
            if (y !== null && y.ignoreAttr) {
                tn.node = s;
                tn.attr = d;
                tn.bindable = null;
                tn.def = null;
                l.push(y.build(tn, r.ep, r.m));
                continue;
            }
            m = r.Hs(k);
            if (m !== null) {
                if (m.isTemplateController) {
                    throw createMappedError(9998, k);
                }
                v = this.Ls.get(m);
                C = m.noMultiBindings === false && y === null && hasInlineBindings(A);
                if (C) {
                    p = this.Vs(s, A, m, r);
                } else {
                    w = v.primary;
                    if (y === null) {
                        x = c.parse(A, vt);
                        p = [ x === null ? new SetPropertyInstruction(A, w.name) : new InterpolationInstruction(x, w.name) ];
                    } else {
                        tn.node = s;
                        tn.attr = d;
                        tn.bindable = w;
                        tn.def = m;
                        p = [ y.build(tn, r.ep, r.m) ];
                    }
                }
                (g ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? m : m.name, m.aliases != null && m.aliases.includes(k) ? k : void 0, p));
                continue;
            }
            if (y === null) {
                x = c.parse(A, vt);
                if (h) {
                    v = this.Ls.get(a);
                    b = v.attrs[k];
                    if (b !== void 0) {
                        x = c.parse(A, vt);
                        l.push(new SpreadElementPropBindingInstruction(x == null ? new SetPropertyInstruction(A, b.name) : new InterpolationInstruction(x, b.name)));
                        continue;
                    }
                }
                if (x != null) {
                    l.push(new InterpolationInstruction(x, r.m.map(s, k) ?? L(k)));
                } else {
                    switch (k) {
                      case "class":
                        l.push(new SetClassAttributeInstruction(A));
                        break;

                      case "style":
                        l.push(new SetStyleAttributeInstruction(A));
                        break;

                      default:
                        l.push(new SetAttributeInstruction(A, k));
                    }
                }
            } else {
                if (h) {
                    v = this.Ls.get(a);
                    b = v.attrs[k];
                    if (b !== void 0) {
                        tn.node = s;
                        tn.attr = d;
                        tn.bindable = b;
                        tn.def = a;
                        l.push(new SpreadElementPropBindingInstruction(y.build(tn, r.ep, r.m)));
                        continue;
                    }
                }
                tn.node = s;
                tn.attr = d;
                tn.bindable = null;
                tn.def = null;
                l.push(y.build(tn, r.ep, r.m));
            }
        }
        resetCommandBuildInfo();
        if (g != null) {
            return g.concat(l);
        }
        return l;
    }
    qs(t, e) {
        const i = [];
        const s = t.attributes;
        const n = e.ep;
        let r = s.length;
        let l = 0;
        let a;
        let h;
        let c;
        let u;
        let f = null;
        let d;
        let m;
        let g;
        let p;
        let v = null;
        let b;
        let w;
        let y;
        let x;
        for (;r > l; ++l) {
            a = s[l];
            h = a.name;
            c = a.value;
            u = e.He.parse(h, c);
            y = u.target;
            x = u.rawValue;
            if (en[y]) {
                throw createMappedError(702, h);
            }
            v = e.Os(u);
            if (v !== null && v.ignoreAttr) {
                tn.node = t;
                tn.attr = u;
                tn.bindable = null;
                tn.def = null;
                i.push(v.build(tn, e.ep, e.m));
                continue;
            }
            f = e.Hs(y);
            if (f !== null) {
                if (f.isTemplateController) {
                    throw createMappedError(703, y);
                }
                g = this.Ls.get(f);
                w = f.noMultiBindings === false && v === null && hasInlineBindings(x);
                if (w) {
                    m = this.Vs(t, x, f, e);
                } else {
                    p = g.primary;
                    if (v === null) {
                        b = n.parse(x, vt);
                        m = b === null ? x === "" ? [] : [ new SetPropertyInstruction(x, p.name) ] : [ new InterpolationInstruction(b, p.name) ];
                    } else {
                        tn.node = t;
                        tn.attr = u;
                        tn.bindable = p;
                        tn.def = f;
                        m = [ v.build(tn, e.ep, e.m) ];
                    }
                }
                t.removeAttribute(h);
                --l;
                --r;
                (d ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? f : f.name, f.aliases != null && f.aliases.includes(y) ? y : void 0, m));
                continue;
            }
            if (v === null) {
                b = n.parse(x, vt);
                if (b != null) {
                    t.removeAttribute(h);
                    --l;
                    --r;
                    i.push(new InterpolationInstruction(b, e.m.map(t, y) ?? L(y)));
                } else {
                    switch (h) {
                      case "class":
                        i.push(new SetClassAttributeInstruction(x));
                        break;

                      case "style":
                        i.push(new SetStyleAttributeInstruction(x));
                        break;

                      default:
                        i.push(new SetAttributeInstruction(x, h));
                    }
                }
            } else {
                tn.node = t;
                tn.attr = u;
                tn.bindable = null;
                tn.def = null;
                i.push(v.build(tn, e.ep, e.m));
            }
        }
        resetCommandBuildInfo();
        if (d != null) {
            return d.concat(i);
        }
        return i;
    }
    _s(t, e) {
        switch (t.nodeType) {
          case 1:
            switch (t.nodeName) {
              case "LET":
                return this.$s(t, e);

              default:
                return this.Ns(t, e);
            }

          case 3:
            return this.js(t, e);

          case 11:
            {
                let i = t.firstChild;
                while (i !== null) {
                    i = this._s(i, e);
                }
                break;
            }
        }
        return t.nextSibling;
    }
    $s(t, e) {
        const i = t.attributes;
        const n = i.length;
        const r = [];
        const l = e.ep;
        let a = false;
        let h = 0;
        let c;
        let u;
        let f;
        let d;
        let m;
        let g;
        let p;
        let v;
        for (;n > h; ++h) {
            c = i[h];
            f = c.name;
            d = c.value;
            if (f === "to-binding-context") {
                a = true;
                continue;
            }
            u = e.He.parse(f, d);
            g = u.target;
            p = u.rawValue;
            m = e.Os(u);
            if (m !== null) {
                if (u.command === "bind") {
                    r.push(new LetBindingInstruction(l.parse(p, yt), L(g)));
                } else {
                    throw createMappedError(704, u);
                }
                continue;
            }
            v = l.parse(p, vt);
            r.push(new LetBindingInstruction(v === null ? new s(p) : v, L(g)));
        }
        e.rows.push([ new HydrateLetElementInstruction(r, a) ]);
        return this.Ws(t, e).nextSibling;
    }
    Ns(t, e) {
        const i = t.nextSibling;
        const s = (t.getAttribute("as-element") ?? t.nodeName).toLowerCase();
        const n = e.Fs(s);
        const r = n !== null;
        const l = r && n.shadowOptions != null;
        const a = n?.capture;
        const c = a != null && typeof a !== "boolean";
        const u = a ? [] : w;
        const f = e.ep;
        const d = this.debug ? h : () => {
            t.removeAttribute(y);
            --v;
            --p;
        };
        let m = t.attributes;
        let g;
        let p = m.length;
        let v = 0;
        let b;
        let y;
        let x;
        let C;
        let k;
        let A;
        let B = null;
        let S = false;
        let R;
        let T;
        let E;
        let I;
        let P;
        let D;
        let M;
        let _ = null;
        let q;
        let F;
        let O;
        let H;
        let V = true;
        let $ = false;
        let N = false;
        let j = false;
        let W;
        if (s === "slot") {
            if (e.root.def.shadowOptions == null) {
                throw createMappedError(717, e.root.def.name);
            }
            e.root.hasSlot = true;
        }
        if (r) {
            W = {};
            V = n.processContent?.call(n.Type, t, e.p, W);
            m = t.attributes;
            p = m.length;
        }
        for (;p > v; ++v) {
            b = m[v];
            y = b.name;
            x = b.value;
            switch (y) {
              case "as-element":
              case "containerless":
                d();
                if (!$) {
                    $ = y === "containerless";
                }
                continue;
            }
            C = e.He.parse(y, x);
            _ = e.Os(C);
            O = C.target;
            H = C.rawValue;
            if (a && (!c || c && a(O))) {
                if (_ != null && _.ignoreAttr) {
                    d();
                    u.push(C);
                    continue;
                }
                N = O !== _e && O !== "slot";
                if (N) {
                    q = this.Ls.get(n);
                    if (q.attrs[O] == null && !e.Hs(O)?.isTemplateController) {
                        d();
                        u.push(C);
                        continue;
                    }
                }
            }
            if (_?.ignoreAttr) {
                tn.node = t;
                tn.attr = C;
                tn.bindable = null;
                tn.def = null;
                (k ??= []).push(_.build(tn, e.ep, e.m));
                d();
                continue;
            }
            if (r) {
                q = this.Ls.get(n);
                R = q.attrs[O];
                if (R !== void 0) {
                    if (_ === null) {
                        D = f.parse(H, vt);
                        (A ??= []).push(D == null ? new SetPropertyInstruction(H, R.name) : new InterpolationInstruction(D, R.name));
                    } else {
                        tn.node = t;
                        tn.attr = C;
                        tn.bindable = R;
                        tn.def = n;
                        (A ??= []).push(_.build(tn, e.ep, e.m));
                    }
                    d();
                    continue;
                }
            }
            B = e.Hs(O);
            if (B !== null) {
                q = this.Ls.get(B);
                S = B.noMultiBindings === false && _ === null && hasInlineBindings(H);
                if (S) {
                    E = this.Vs(t, H, B, e);
                } else {
                    F = q.primary;
                    if (_ === null) {
                        D = f.parse(H, vt);
                        E = D === null ? H === "" ? [] : [ new SetPropertyInstruction(H, F.name) ] : [ new InterpolationInstruction(D, F.name) ];
                    } else {
                        tn.node = t;
                        tn.attr = C;
                        tn.bindable = F;
                        tn.def = B;
                        E = [ _.build(tn, e.ep, e.m) ];
                    }
                }
                d();
                if (B.isTemplateController) {
                    (I ??= []).push(new HydrateTemplateController(Js, this.resolveResources ? B : B.name, void 0, E));
                } else {
                    (T ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? B : B.name, B.aliases != null && B.aliases.includes(O) ? O : void 0, E));
                }
                continue;
            }
            if (_ === null) {
                D = f.parse(H, vt);
                if (D != null) {
                    d();
                    (k ??= []).push(new InterpolationInstruction(D, e.m.map(t, O) ?? L(O)));
                }
                continue;
            }
            tn.node = t;
            tn.attr = C;
            tn.bindable = null;
            tn.def = null;
            (k ??= []).push(_.build(tn, e.ep, e.m));
            d();
        }
        resetCommandBuildInfo();
        if (this.Us(t, k) && k != null && k.length > 1) {
            this.zs(t, k);
        }
        if (r) {
            M = new HydrateElementInstruction(this.resolveResources ? n : n.name, A ?? w, null, $, u, W);
        }
        if (k != null || M != null || T != null) {
            g = w.concat(M ?? w, T ?? w, k ?? w);
            j = true;
        }
        let U;
        if (I != null) {
            p = I.length - 1;
            v = p;
            P = I[v];
            let i;
            if (isMarker(t)) {
                i = e.t();
                appendManyToTemplate(i, [ e.ct(), e.Gs(Qs), e.Gs(Ys) ]);
            } else {
                this.Ks(t, e);
                if (t.nodeName === "TEMPLATE") {
                    i = t;
                } else {
                    i = e.t();
                    appendToTemplate(i, t);
                }
            }
            const a = i;
            const h = e.Xs(g == null ? [] : [ g ]);
            let c;
            let u;
            let f = false;
            let d;
            let m;
            let b;
            let w;
            let y;
            let x;
            let C = 0, k = 0;
            let A = t.firstChild;
            let B = false;
            if (V !== false) {
                while (A !== null) {
                    u = isElement(A) ? A.getAttribute(_e) : null;
                    f = u !== null || r && !l;
                    c = A.nextSibling;
                    if (f) {
                        if (!r) {
                            throw createMappedError(706, u, s);
                        }
                        A.removeAttribute?.(_e);
                        B = isTextNode(A) && A.textContent.trim() === "";
                        if (!B) {
                            ((m ??= {})[u || Me] ??= []).push(A);
                        }
                        t.removeChild(A);
                    }
                    A = c;
                }
            }
            if (m != null) {
                d = {};
                for (u in m) {
                    i = e.t();
                    b = m[u];
                    for (C = 0, k = b.length; k > C; ++C) {
                        w = b[C];
                        if (w.nodeName === "TEMPLATE") {
                            if (w.attributes.length > 0) {
                                appendToTemplate(i, w);
                            } else {
                                appendToTemplate(i, w.content);
                            }
                        } else {
                            appendToTemplate(i, w);
                        }
                    }
                    x = e.Xs();
                    this._s(i.content, x);
                    d[u] = CustomElementDefinition.create({
                        name: cs(),
                        template: i,
                        instructions: x.rows,
                        needsCompile: false
                    });
                }
                M.projections = d;
            }
            if (j) {
                if (r && ($ || n.containerless)) {
                    this.Ks(t, e);
                } else {
                    this.Ws(t, e);
                }
            }
            U = !r || !n.containerless && !$ && V !== false;
            if (U) {
                if (t.nodeName === Xs) {
                    this._s(t.content, h);
                } else {
                    A = t.firstChild;
                    while (A !== null) {
                        A = this._s(A, h);
                    }
                }
            }
            P.def = CustomElementDefinition.create({
                name: cs(),
                template: a,
                instructions: h.rows,
                needsCompile: false
            });
            while (v-- > 0) {
                P = I[v];
                i = e.t();
                y = e.ct();
                appendManyToTemplate(i, [ y, e.Gs(Qs), e.Gs(Ys) ]);
                P.def = CustomElementDefinition.create({
                    name: cs(),
                    template: i,
                    needsCompile: false,
                    instructions: [ [ I[v + 1] ] ]
                });
            }
            e.rows.push([ P ]);
        } else {
            if (g != null) {
                e.rows.push(g);
            }
            let i = t.firstChild;
            let a;
            let h;
            let c = false;
            let u = null;
            let f;
            let d;
            let m;
            let p;
            let v;
            let b = false;
            let w = 0, y = 0;
            if (V !== false) {
                while (i !== null) {
                    h = isElement(i) ? i.getAttribute(_e) : null;
                    c = h !== null || r && !l;
                    a = i.nextSibling;
                    if (c) {
                        if (!r) {
                            throw createMappedError(706, h, s);
                        }
                        i.removeAttribute?.(_e);
                        b = isTextNode(i) && i.textContent.trim() === "";
                        if (!b) {
                            ((f ??= {})[h || Me] ??= []).push(i);
                        }
                        t.removeChild(i);
                    }
                    i = a;
                }
            }
            if (f != null) {
                u = {};
                for (h in f) {
                    p = e.t();
                    d = f[h];
                    for (w = 0, y = d.length; y > w; ++w) {
                        m = d[w];
                        if (m.nodeName === Xs) {
                            if (m.attributes.length > 0) {
                                appendToTemplate(p, m);
                            } else {
                                appendToTemplate(p, m.content);
                            }
                        } else {
                            appendToTemplate(p, m);
                        }
                    }
                    v = e.Xs();
                    this._s(p.content, v);
                    u[h] = CustomElementDefinition.create({
                        name: cs(),
                        template: p,
                        instructions: v.rows,
                        needsCompile: false
                    });
                }
                M.projections = u;
            }
            if (j) {
                if (r && ($ || n.containerless)) {
                    this.Ks(t, e);
                } else {
                    this.Ws(t, e);
                }
            }
            U = !r || !n.containerless && !$ && V !== false;
            if (U && t.childNodes.length > 0) {
                i = t.firstChild;
                while (i !== null) {
                    i = this._s(i, e);
                }
            }
        }
        return i;
    }
    js(t, e) {
        const i = t.parentNode;
        const s = e.ep.parse(t.textContent, vt);
        const n = t.nextSibling;
        let r;
        let l;
        let a;
        let h;
        let c;
        if (s !== null) {
            ({parts: r, expressions: l} = s);
            if (c = r[0]) {
                insertBefore(i, e.Qs(c), t);
            }
            for (a = 0, h = l.length; h > a; ++a) {
                insertManyBefore(i, t, [ e.ct(), e.Qs(" ") ]);
                if (c = r[a + 1]) {
                    insertBefore(i, e.Qs(c), t);
                }
                e.rows.push([ new TextBindingInstruction(l[a]) ]);
            }
            i.removeChild(t);
        }
        return n;
    }
    Vs(t, e, i, s) {
        const n = this.Ls.get(i);
        const r = e.length;
        const l = [];
        let a = void 0;
        let h = void 0;
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
                a = e.slice(c, p);
                while (e.charCodeAt(++p) <= 32) ;
                c = p;
                for (;p < r; ++p) {
                    u = e.charCodeAt(p);
                    if (u === 92) {
                        ++p;
                    } else if (u === 59) {
                        h = e.slice(c, p);
                        break;
                    }
                }
                if (h === void 0) {
                    h = e.slice(c);
                }
                d = s.He.parse(a, h);
                m = s.Os(d);
                g = n.attrs[d.target];
                if (g == null) {
                    throw createMappedError(707, d.target, i.name);
                }
                if (m === null) {
                    f = s.ep.parse(h, vt);
                    l.push(f === null ? new SetPropertyInstruction(h, g.name) : new InterpolationInstruction(f, g.name));
                } else {
                    tn.node = t;
                    tn.attr = d;
                    tn.bindable = g;
                    tn.def = i;
                    l.push(m.build(tn, s.ep, s.m));
                }
                while (p < r && e.charCodeAt(++p) <= 32) ;
                c = p;
                a = void 0;
                h = void 0;
            }
        }
        resetCommandBuildInfo();
        return l;
    }
    Ms(t, e) {
        const i = e.root.def.name;
        const s = t;
        const n = F(s.querySelectorAll("template[as-custom-element]"));
        const r = n.length;
        if (r === 0) {
            return;
        }
        if (r === s.childElementCount) {
            throw createMappedError(708, i);
        }
        const l = new Set;
        for (const t of n) {
            if (t.parentNode !== s) {
                throw createMappedError(709, i);
            }
            const n = processTemplateName(i, t, l);
            const r = t.content;
            const a = F(r.querySelectorAll("bindable"));
            const h = new Set;
            const c = new Set;
            const u = a.reduce(((t, e) => {
                if (e.parentNode !== r) {
                    throw createMappedError(710, n);
                }
                const i = e.getAttribute("name");
                if (i === null) {
                    throw createMappedError(711, e, n);
                }
                const s = e.getAttribute("attribute");
                if (s !== null && c.has(s) || h.has(i)) {
                    throw createMappedError(712, h, s);
                } else {
                    if (s !== null) {
                        c.add(s);
                    }
                    h.add(i);
                }
                const l = F(e.attributes).filter((t => !on.includes(t.name)));
                if (l.length > 0) ;
                e.remove();
                t[i] = {
                    attribute: s ?? void 0,
                    mode: getBindingMode(e)
                };
                return t;
            }), {});
            class LocalTemplateType {}
            pt(LocalTemplateType, "name", {
                value: n
            });
            e.Ys(defineElement({
                name: n,
                template: t,
                bindables: u
            }, LocalTemplateType));
            s.removeChild(t);
        }
    }
    Us(t, e) {
        const i = t.nodeName;
        return i === "INPUT" && sn[t.type] === 1 || i === "SELECT" && (t.hasAttribute("multiple") || e?.some((t => t.type === Ue && t.to === "multiple")));
    }
    zs(t, e) {
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
    Ws(t, e) {
        insertBefore(t.parentNode, e.Gs("au*"), t);
        return t;
    }
    Ks(t, e) {
        if (isMarker(t)) {
            return t;
        }
        const i = t.parentNode;
        const s = e.ct();
        insertManyBefore(i, t, [ s, e.Gs(Qs), e.Gs(Ys) ]);
        i.removeChild(t);
        return s;
    }
}

const Xs = "TEMPLATE";

const Qs = "au-start";

const Ys = "au-end";

const isMarker = t => t.nodeValue === "au*";

class CompilationContext {
    constructor(t, i, s, n, r, l) {
        this.hasSlot = false;
        const a = n !== null;
        this.c = i;
        this.root = r === null ? this : r;
        this.def = t;
        this.ci = s;
        this.parent = n;
        this.Zs = a ? n.Zs : i.get(rn);
        this.Ds = a ? n.Ds : i.get(Gs);
        this.He = a ? n.He : i.get(bs);
        this.ep = a ? n.ep : i.get(e);
        this.m = a ? n.m : i.get(Bs);
        this.Hi = a ? n.Hi : i.get(_);
        this.p = a ? n.p : i.get(ae);
        this.localEls = a ? n.localEls : new Set;
        this.rows = l ?? [];
    }
    Ys(t) {
        (this.root.deps ??= []).push(t);
        this.root.c.register(t);
        return t;
    }
    Qs(t) {
        return createText(this.p, t);
    }
    Gs(t) {
        return createComment(this.p, t);
    }
    ct() {
        return this.Gs("au*");
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
    Fs(t) {
        return this.Zs.el(this.c, t);
    }
    Hs(t) {
        return this.Zs.attr(this.c, t);
    }
    Xs(t) {
        return new CompilationContext(this.def, this.c, this.ci, this, this.root, t);
    }
    Os(t) {
        const e = t.command;
        if (e === null) {
            return null;
        }
        return this.Zs.command(this.c, e);
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
    tn.node = tn.attr = tn.bindable = tn.def = null;
};

const Zs = {
    projections: null
};

const Js = {
    name: "unnamed"
};

const tn = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const en = ut(createLookup(), {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
});

const sn = {
    checkbox: 1,
    radio: 1
};

const nn = /*@__PURE__*/ Wt("IBindablesInfoResolver", (t => {
    class BindablesInfoResolver {
        constructor() {
            this.W = new WeakMap;
        }
        get(t) {
            let e = this.W.get(t);
            if (e == null) {
                const i = t.bindables;
                const s = createLookup();
                let n;
                let r;
                let l = false;
                let a;
                let h;
                for (r in i) {
                    n = i[r];
                    h = n.attribute;
                    if (n.primary === true) {
                        if (l) {
                            throw createMappedError(714, t);
                        }
                        l = true;
                        a = n;
                    } else if (!l && a == null) {
                        a = n;
                    }
                    s[h] = BindableDefinition.create(r, n);
                }
                if (n == null && t.kind === "attribute") {
                    a = s.value = BindableDefinition.create("value", {
                        mode: t.defaultBindingMode != null ? t.defaultBindingMode : Mt
                    });
                }
                this.W.set(t, e = new BindablesInfo(s, i, a ?? null));
            }
            return e;
        }
    }
    class BindablesInfo {
        constructor(t, e, i) {
            this.attrs = t;
            this.bindables = e;
            this.primary = i;
        }
    }
    return t.singleton(BindablesInfoResolver);
}));

const rn = /*@__PURE__*/ Wt("IResourceResolver", (t => t.singleton(ResourceResolver)));

class ResourceResolver {
    constructor() {
        this.Js = new WeakMap;
        this.tn = new WeakMap;
    }
    el(t, e) {
        let i = this.Js.get(t);
        if (i == null) {
            this.Js.set(t, i = new RecordCache);
        }
        return e in i.element ? i.element[e] : i.element[e] = fs.find(t, e);
    }
    attr(t, e) {
        let i = this.Js.get(t);
        if (i == null) {
            this.Js.set(t, i = new RecordCache);
        }
        return e in i.attr ? i.attr[e] : i.attr[e] = fe.find(t, e);
    }
    command(t, e) {
        let i = this.tn.get(t);
        if (i == null) {
            this.tn.set(t, i = createLookup());
        }
        let s = i[e];
        if (s === void 0) {
            let n = this.Js.get(t);
            if (n == null) {
                this.Js.set(t, n = new RecordCache);
            }
            const r = e in n.command ? n.command[e] : n.command[e] = ks.find(t, e);
            if (r == null) {
                throw createMappedError(713, e);
            }
            i[e] = s = ks.get(t, e);
        }
        return s;
    }
}

class RecordCache {
    constructor() {
        this.element = createLookup();
        this.attr = createLookup();
        this.command = createLookup();
    }
}

const on = ct([ "name", "attribute", "mode" ]);

const ln = "as-custom-element";

const processTemplateName = (t, e, i) => {
    const s = e.getAttribute(ln);
    if (s === null || s === "") {
        throw createMappedError(715, t);
    }
    if (i.has(s)) {
        throw createMappedError(716, s, t);
    } else {
        i.add(s);
        e.removeAttribute(ln);
    }
    return s;
};

const getBindingMode = t => {
    switch (t.getAttribute("mode")) {
      case "oneTime":
        return It;

      case "toView":
        return Pt;

      case "fromView":
        return Lt;

      case "twoWay":
        return Dt;

      case "default":
      default:
        return Mt;
    }
};

const an = /*@__PURE__*/ Wt("ITemplateCompilerHooks");

const hn = ct({
    name: /*@__PURE__*/ p("compiler-hooks"),
    define(t) {
        return y.define(t, (function(t) {
            Ut(an, this).register(t);
        }));
    },
    findAll(t) {
        return t.get(O(an));
    }
});

const templateCompilerHooks = (t, e) => {
    return t === void 0 ? decorator : decorator(t);
    function decorator(t) {
        return hn.define(t);
    }
};

class Show {
    constructor() {
        this.el = v(Zi);
        this.p = v(ae);
        this.en = false;
        this.I = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.I = null;
            if (Boolean(this.value) !== this.sn) {
                if (this.sn === this.nn) {
                    this.sn = !this.nn;
                    this.$val = this.el.style.getPropertyValue("display");
                    this.$prio = this.el.style.getPropertyPriority("display");
                    this.el.style.setProperty("display", "none", "important");
                } else {
                    this.sn = this.nn;
                    this.el.style.setProperty("display", this.$val, this.$prio);
                    if (this.el.getAttribute("style") === "") {
                        this.el.removeAttribute("style");
                    }
                }
            }
        };
        const t = v(oi);
        this.sn = this.nn = t.alias !== "hide";
    }
    binding() {
        this.en = true;
        this.update();
    }
    detaching() {
        this.en = false;
        this.I?.cancel();
        this.I = null;
    }
    valueChanged() {
        if (this.en && this.I === null) {
            this.I = this.p.domWriteQueue.queueTask(this.update);
        }
    }
}

Show.$au = {
    type: ce,
    name: "show",
    bindables: [ "value" ],
    aliases: [ "hide" ]
};

const cn = [ TemplateCompiler, et, NodeObserverLocator ];

const un = [ RefAttributePattern, DotSeparatedAttributePattern, SpreadAttributePattern, EventAttributePattern, Ie ];

const dn = [ AtPrefixedTriggerAttributePattern, ColonPrefixedBindAttributePattern ];

const mn = [ DefaultBindingCommand, OneTimeBindingCommand, FromViewBindingCommand, ToViewBindingCommand, TwoWayBindingCommand, ForBindingCommand, RefBindingCommand, TriggerBindingCommand, CaptureBindingCommand, ClassBindingCommand, StyleBindingCommand, AttrBindingCommand, SpreadBindingCommand ];

const gn = [ DebounceBindingBehavior, OneTimeBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, SignalBindingBehavior, ThrottleBindingBehavior, TwoWayBindingBehavior, SanitizeValueConverter, If, Else, Repeat, With, Switch, Case, DefaultCase, PromiseTemplateController, PendingTemplateController, FulfilledTemplateController, RejectedTemplateController, PromiseAttributePattern, FulfilledAttributePattern, RejectedAttributePattern, AttrBindingBehavior, SelfBindingBehavior, UpdateTriggerBindingBehavior, AuCompose, Portal, Focus, Show, AuSlot ];

const pn = [ PropertyBindingRenderer, IteratorBindingRenderer, RefBindingRenderer, InterpolationBindingRenderer, SetPropertyRenderer, CustomElementRenderer, CustomAttributeRenderer, TemplateControllerRenderer, LetElementRenderer, ListenerBindingRenderer, AttributeBindingRenderer, SetAttributeRenderer, SetClassAttributeRenderer, SetStyleAttributeRenderer, StylePropertyBindingRenderer, TextBindingRenderer, SpreadRenderer ];

const vn = /*@__PURE__*/ createConfiguration(h);

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
            return e.register(Gt(z, i.coercingOptions), ...cn, ...gn, ...un, ...mn, ...pn);
        },
        customize(e) {
            return createConfiguration(e ?? t);
        }
    };
}

function children(t, e) {
    if (!yn) {
        yn = true;
        N(ChildrenBinding);
        lifecycleHooks()(ChildrenLifecycleHooks, null);
    }
    let i;
    const s = Vt("dependencies");
    function decorator(t, e) {
        switch (e.kind) {
          case "field":
            i.name = e.name;
            break;
        }
        const n = e.metadata[s] ??= [];
        n.push(new ChildrenLifecycleHooks(i));
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
    constructor(t, e, i, s = defaultChildQuery, n = defaultChildFilter, r = defaultChildMap, l = bn) {
        this.rn = void 0;
        this.X = defaultChildQuery;
        this.on = defaultChildFilter;
        this.ln = defaultChildMap;
        this.isBound = false;
        this.P = t;
        this.obj = e;
        this.cb = i;
        this.X = s;
        this.on = n;
        this.ln = r;
        this.V = l;
        this.yi = createMutationObserver(this.ws = t.host, (() => {
            this.an();
        }));
    }
    getValue() {
        return this.isBound ? this.rn : this.hn();
    }
    setValue(t) {}
    bind() {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        this.yi.observe(this.ws, this.V);
        this.rn = this.hn();
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.yi.disconnect();
        this.rn = w;
    }
    an() {
        this.rn = this.hn();
        this.cb?.call(this.obj);
        this.subs.notify(this.rn, undefined);
    }
    get() {
        throw createMappedError(99, "get");
    }
    hn() {
        return filterChildren(this.P, this.X, this.on, this.ln);
    }
}

const bn = {
    childList: true
};

const defaultChildQuery = t => t.host.childNodes;

const defaultChildFilter = (t, e, i) => !!i;

const defaultChildMap = (t, e, i) => i;

const wn = {
    optional: true
};

const filterChildren = (t, e, i, s) => {
    const n = e(t);
    const r = n.length;
    const l = [];
    let a;
    let h;
    let c;
    let u = 0;
    for (;u < r; ++u) {
        a = n[u];
        h = findElementControllerFor(a, wn);
        c = h?.viewModel ?? null;
        if (i(a, h, c)) {
            l.push(s(a, h, c));
        }
    }
    return l;
};

class ChildrenLifecycleHooks {
    constructor(t) {
        this.Y = t;
    }
    register(t) {
        Gt(de, this).register(t);
    }
    hydrating(t, e) {
        const i = this.Y;
        const s = new ChildrenBinding(e, t, t[i.callback ?? `${lt(i.name)}Changed`], i.query ?? defaultChildQuery, i.filter ?? defaultChildFilter, i.map ?? defaultChildMap, i.options ?? bn);
        pt(t, i.name, {
            enumerable: true,
            configurable: true,
            get: ut((() => s.getValue()), {
                getObserver: () => s
            }),
            set: () => {}
        });
        e.addBinding(s);
    }
}

let yn = false;

export { AdoptedStyleSheetsStyles, AppRoot, le as AppTask, AtPrefixedTriggerAttributePattern, AttrBindingBehavior, AttrBindingCommand, AttrSyntax, AttributeBinding, AttributeBindingInstruction, AttributeBindingRenderer, AttributeNSAccessor, ys as AttributePattern, AuCompose, AuSlot, AuSlotsInfo, Aurelia, Nt as Bindable, BindableDefinition, Jt as BindingBehavior, BindingBehaviorDefinition, ks as BindingCommand, BindingCommandDefinition, _t as BindingMode, BindingModeBehavior, BindingTargetSubscriber, CSSModulesProcessorRegistry, CaptureBindingCommand, Case, CheckedObserver, ChildrenBinding, ClassAttributeAccessor, ClassBindingCommand, ColonPrefixedBindAttributePattern, ComputedWatcher, ContentBinding, Controller, fe as CustomAttribute, CustomAttributeDefinition, CustomAttributeRenderer, fs as CustomElement, CustomElementDefinition, CustomElementRenderer, DataAttributeAccessor, DebounceBindingBehavior, DefaultBindingCommand, mn as DefaultBindingLanguage, un as DefaultBindingSyntax, DefaultCase, cn as DefaultComponents, pn as DefaultRenderers, gn as DefaultResources, DotSeparatedAttributePattern, Else, EventModifier, Ie as EventModifierRegistration, ExpressionWatcher, FlushQueue, Focus, ForBindingCommand, FragmentNodeSequence, FromViewBindingBehavior, FromViewBindingCommand, FulfilledTemplateController, HydrateAttributeInstruction, HydrateElementInstruction, HydrateLetElementInstruction, HydrateTemplateController, ms as IAppRoot, oe as IAppTask, Bs as IAttrMapper, bs as IAttributeParser, vs as IAttributePattern, Fe as IAuSlotWatcher, qe as IAuSlotsInfo, gs as IAurelia, nn as IBindablesInfoResolver, Gi as IController, Ee as IEventModifier, Ji as IEventTarget, ye as IFlushQueue, rs as IHistory, Ki as IHydrationContext, oi as IInstruction, Te as IKeyMapping, de as ILifecycleHooks, hi as IListenerBindingOptions, ns as ILocation, Re as IModifiedEventHandlerCreator, Zi as INode, ae as IPlatform, ts as IRenderLocation, ai as IRenderer, vi as IRendering, As as ISVGAnalyzer, zs as ISanitizer, yi as IShadowDOMGlobalStyles, bi as IShadowDOMStyleFactory, wi as IShadowDOMStyles, se as ISignaler, ps as ISyntaxInterpreter, li as ITemplateCompiler, an as ITemplateCompilerHooks, Gs as ITemplateElementFactory, Pe as IViewFactory, ss as IWindow, If, ri as InstructionType, InterpolationBinding, InterpolationBindingRenderer, InterpolationInstruction, InterpolationPartBinding, Interpretation, IteratorBindingInstruction, IteratorBindingRenderer, LetBinding, LetBindingInstruction, LetElementRenderer, me as LifecycleHooks, LifecycleHooksDefinition, LifecycleHooksEntry, ListenerBinding, ListenerBindingInstruction, ListenerBindingOptions, ListenerBindingRenderer, MultiAttrInstruction, NodeObserverLocator, NoopSVGAnalyzer, OneTimeBindingBehavior, OneTimeBindingCommand, PendingTemplateController, Portal, PromiseTemplateController, PropertyBinding, PropertyBindingInstruction, PropertyBindingRenderer, RefAttributePattern, RefBinding, RefBindingInstruction, RefBindingRenderer, RejectedTemplateController, Rendering, Repeat, SVGAnalyzer, SanitizeValueConverter, SelectValueObserver, SelfBindingBehavior, SetAttributeInstruction, SetAttributeRenderer, SetClassAttributeInstruction, SetClassAttributeRenderer, SetPropertyInstruction, SetPropertyRenderer, SetStyleAttributeInstruction, SetStyleAttributeRenderer, ShadowDOMRegistry, dn as ShortHandBindingSyntax, SignalBindingBehavior, SpreadBindingInstruction, SpreadElementPropBindingInstruction, SpreadRenderer, vn as StandardConfiguration, zi as State, StyleAttributeAccessor, StyleBindingCommand, xi as StyleConfiguration, StyleElementStyles, StylePropertyBindingInstruction, StylePropertyBindingRenderer, Switch, TemplateCompiler, hn as TemplateCompilerHooks, TemplateControllerRenderer, TextBindingInstruction, TextBindingRenderer, ThrottleBindingBehavior, ToViewBindingBehavior, ToViewBindingCommand, TriggerBindingCommand, TwoWayBindingBehavior, TwoWayBindingCommand, UpdateTriggerBindingBehavior, ValueAttributeObserver, ve as ValueConverter, ValueConverterDefinition, ViewFactory, he as Watch, With, alias, St as astAssign, Tt as astBind, Rt as astEvaluate, Et as astUnbind, attributePattern, bindable, bindingBehavior, bindingCommand, capture, children, coercer, containerless, convertToRenderLocation, cssModules, customAttribute, customElement, getEffectiveParentNode, getRef, isCustomElementController, isCustomElementViewModel, isInstruction, isRenderLocation, lifecycleHooks, mixinAstEvaluator, mixinUseScope, mixingBindingLimited, processContent, registerAliases, renderer, setEffectiveParentNode, setRef, shadowCSS, slotted, templateCompilerHooks, templateController, useShadowDOM, valueConverter, watch };
//# sourceMappingURL=index.mjs.map
