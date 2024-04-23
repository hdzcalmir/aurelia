import { DestructuringAssignmentSingleExpression as t, IExpressionParser as e, AccessScopeExpression as s, PrimitiveLiteralExpression as i } from "@aurelia/expression-parser";

import { isArrayIndex as n, Protocol as r, getPrototypeChain as l, kebabCase as a, noop as h, DI as c, Registration as u, firstDefined as f, mergeArrays as d, resourceBaseName as m, resource as g, getResourceKeyFor as p, resolve as v, IPlatform as w, emptyArray as b, Registrable as x, all as y, InstanceProvider as k, IContainer as C, optionalResource as A, optional as B, onResolveAll as S, onResolve as T, fromDefinitionOrDefault as E, pascalCase as R, fromAnnotationOrDefinitionOrTypeOrDefault as I, fromAnnotationOrTypeOrDefault as P, camelCase as L, IServiceLocator as M, emptyObject as D, ILogger as _, transient as q, toArray as F, allResources as O } from "@aurelia/kernel";

import { AccessorType as H, connectable as V, subscriberCollection as N, IObserverLocator as $, ConnectableSwitcher as j, ProxyObservable as W, ICoercionConfiguration as U, PropertyAccessor as z, INodeObserverLocator as G, IDirtyChecker as K, getObserverLookup as X, SetterObserver as Q, createIndexMap as Y, getCollectionObserver as Z, DirtyChecker as J } from "@aurelia/runtime";

import { Metadata as tt, isObject as et } from "@aurelia/metadata";

import { BrowserPlatform as st } from "@aurelia/platform-browser";

import { TaskAbortError as it } from "@aurelia/platform";

const nt = Object;

const rt = String;

const ot = nt.prototype;

const createLookup = () => nt.create(null);

const createError$1 = t => new Error(t);

const lt = ot.hasOwnProperty;

const at = nt.freeze;

const ht = nt.assign;

const ct = nt.getOwnPropertyNames;

const ut = nt.keys;

const ft = /*@__PURE__*/ createLookup();

const isDataAttribute = (t, e, s) => {
    if (ft[e] === true) {
        return true;
    }
    if (!isString(e)) {
        return false;
    }
    const i = e.slice(0, 5);
    return ft[e] = i === "aria-" || i === "data-" || s.isStandardSvgAttribute(t, e);
};

const isPromise = t => t instanceof Promise;

const isArray = t => t instanceof Array;

const isFunction = t => typeof t === "function";

const isObject = t => t instanceof nt;

const isString = t => typeof t === "string";

const isSymbol = t => typeof t === "symbol";

const rethrow = t => {
    throw t;
};

const dt = nt.is;

const mt = Reflect.defineProperty;

const defineHiddenProp = (t, e, s) => {
    mt(t, e, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: s
    });
    return s;
};

const addSignalListener = (t, e, s) => t.addSignalListener(e, s);

const removeSignalListener = (t, e, s) => t.removeSignalListener(e, s);

const gt = "Interpolation";

const pt = "IsIterator";

const vt = "IsFunction";

const wt = "IsProperty";

const bt = "pending";

const xt = "running";

const yt = H.Observer;

const kt = H.Node;

const Ct = H.Layout;

const createMappedError = (t, ...e) => new Error(`AUR${rt(t).padStart(4, "0")}:${e.map(rt)}`);

class Scope {
    constructor(t, e, s, i) {
        this.parent = t;
        this.bindingContext = e;
        this.overrideContext = s;
        this.isBoundary = i;
    }
    static getContext(t, e, s) {
        if (t == null) {
            throw createMappedError(203);
        }
        let i = t.overrideContext;
        let n = t;
        if (s > 0) {
            while (s > 0) {
                s--;
                n = n.parent;
                if (n == null) {
                    return void 0;
                }
            }
            i = n.overrideContext;
            return e in i ? i : n.bindingContext;
        }
        while (n != null && !n.isBoundary && !(e in n.overrideContext) && !(e in n.bindingContext)) {
            n = n.parent;
        }
        if (n == null) {
            return t.bindingContext;
        }
        i = n.overrideContext;
        return e in i ? i : n.bindingContext;
    }
    static create(t, e, s) {
        if (t == null) {
            throw createMappedError(204);
        }
        return new Scope(null, t, e ?? new OverrideContext, s ?? false);
    }
    static fromParent(t, e) {
        if (t == null) {
            throw createMappedError(203);
        }
        return new Scope(t, e, new OverrideContext, false);
    }
}

class BindingContext {
    constructor(t, e) {
        if (t !== void 0) {
            this[t] = e;
        }
    }
}

class OverrideContext {}

const {astAssign: At, astEvaluate: Bt, astBind: St, astUnbind: Tt} = /*@__PURE__*/ (() => {
    const e = "AccessThis";
    const s = "AccessBoundary";
    const i = "AccessGlobal";
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
    const w = "TaggedTemplate";
    const b = "Binary";
    const x = "Conditional";
    const y = "Assign";
    const k = "ArrowFunction";
    const C = "ValueConverter";
    const A = "BindingBehavior";
    const B = "ArrayBindingPattern";
    const S = "ObjectBindingPattern";
    const T = "BindingIdentifier";
    const E = "ForOfStatement";
    const R = "Interpolation";
    const I = "ArrayDestructuring";
    const P = "ObjectDestructuring";
    const L = "DestructuringAssignmentLeaf";
    const M = "Custom";
    const D = Scope.getContext;
    function astEvaluate(t, n, q, F) {
        switch (t.$kind) {
          case e:
            {
                let e = n.overrideContext;
                let s = n;
                let i = t.ancestor;
                while (i-- && e) {
                    s = s.parent;
                    e = s?.overrideContext ?? null;
                }
                return i < 1 && s ? s.bindingContext : void 0;
            }

          case s:
            {
                let t = n;
                while (t != null && !t.isBoundary) {
                    t = t.parent;
                }
                return t ? t.bindingContext : void 0;
            }

          case r:
            {
                const e = D(n, t.name, t.ancestor);
                if (F !== null) {
                    F.observe(e, t.name);
                }
                const s = e[t.name];
                if (s == null && t.name === "$host") {
                    throw createMappedError(105);
                }
                if (q?.strict) {
                    return q?.boundFn && isFunction(s) ? s.bind(e) : s;
                }
                return s == null ? "" : q?.boundFn && isFunction(s) ? s.bind(e) : s;
            }

          case i:
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
                for (let s = 0; s < t.keys.length; ++s) {
                    e[t.keys[s]] = astEvaluate(t.values[s], n, q, F);
                }
                return e;
            }

          case h:
            return t.value;

          case c:
            {
                let e = t.cooked[0];
                for (let s = 0; s < t.expressions.length; ++s) {
                    e += String(astEvaluate(t.expressions[s], n, q, F));
                    e += t.cooked[s + 1];
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
                const s = D(n, t.name, t.ancestor);
                const i = getFunction(q?.strictFnCall, s, t.name);
                if (i) {
                    return i.apply(s, e);
                }
                return void 0;
            }

          case d:
            {
                const e = astEvaluate(t.object, n, q, F);
                const s = t.args.map((t => astEvaluate(t, n, q, F)));
                const i = getFunction(q?.strictFnCall, e, t.name);
                let r;
                if (i) {
                    r = i.apply(e, s);
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

          case k:
            {
                const func = (...e) => {
                    const s = t.args;
                    const i = t.rest;
                    const r = s.length - 1;
                    const l = s.reduce(((t, s, n) => {
                        if (i && n === r) {
                            t[s.name] = e.slice(n);
                        } else {
                            t[s.name] = e[n];
                        }
                        return t;
                    }), {});
                    const a = Scope.fromParent(n, l);
                    return astEvaluate(t.body, a, q, F);
                };
                return func;
            }

          case p:
            {
                const e = astEvaluate(t.object, n, q, F);
                let s;
                if (q?.strict) {
                    if (e == null) {
                        return undefined;
                    }
                    if (F !== null && !t.accessGlobal) {
                        F.observe(e, t.name);
                    }
                    s = e[t.name];
                    if (q?.boundFn && isFunction(s)) {
                        return s.bind(e);
                    }
                    return s;
                }
                if (F !== null && isObject(e) && !t.accessGlobal) {
                    F.observe(e, t.name);
                }
                if (e) {
                    s = e[t.name];
                    if (q?.boundFn && isFunction(s)) {
                        return s.bind(e);
                    }
                    return s;
                }
                return "";
            }

          case v:
            {
                const e = astEvaluate(t.object, n, q, F);
                const s = astEvaluate(t.key, n, q, F);
                if (isObject(e)) {
                    if (F !== null && !t.accessGlobal) {
                        F.observe(e, s);
                    }
                    return e[s];
                }
                return e == null ? void 0 : e[s];
            }

          case w:
            {
                const e = t.expressions.map((t => astEvaluate(t, n, q, F)));
                const s = astEvaluate(t.func, n, q, F);
                if (!isFunction(s)) {
                    throw createMappedError(110);
                }
                return s(t.cooked, ...e);
            }

          case b:
            {
                const e = t.left;
                const s = t.right;
                switch (t.operation) {
                  case "&&":
                    return astEvaluate(e, n, q, F) && astEvaluate(s, n, q, F);

                  case "||":
                    return astEvaluate(e, n, q, F) || astEvaluate(s, n, q, F);

                  case "??":
                    return astEvaluate(e, n, q, F) ?? astEvaluate(s, n, q, F);

                  case "==":
                    return astEvaluate(e, n, q, F) == astEvaluate(s, n, q, F);

                  case "===":
                    return astEvaluate(e, n, q, F) === astEvaluate(s, n, q, F);

                  case "!=":
                    return astEvaluate(e, n, q, F) != astEvaluate(s, n, q, F);

                  case "!==":
                    return astEvaluate(e, n, q, F) !== astEvaluate(s, n, q, F);

                  case "instanceof":
                    {
                        const t = astEvaluate(s, n, q, F);
                        if (isFunction(t)) {
                            return astEvaluate(e, n, q, F) instanceof t;
                        }
                        return false;
                    }

                  case "in":
                    {
                        const t = astEvaluate(s, n, q, F);
                        if (isObject(t)) {
                            return astEvaluate(e, n, q, F) in t;
                        }
                        return false;
                    }

                  case "+":
                    {
                        const t = astEvaluate(e, n, q, F);
                        const i = astEvaluate(s, n, q, F);
                        if (q?.strict) {
                            return t + i;
                        }
                        if (!t || !i) {
                            if (isNumberOrBigInt(t) || isNumberOrBigInt(i)) {
                                return (t || 0) + (i || 0);
                            }
                            if (isStringOrDate(t) || isStringOrDate(i)) {
                                return (t || "") + (i || "");
                            }
                        }
                        return t + i;
                    }

                  case "-":
                    return astEvaluate(e, n, q, F) - astEvaluate(s, n, q, F);

                  case "*":
                    return astEvaluate(e, n, q, F) * astEvaluate(s, n, q, F);

                  case "/":
                    return astEvaluate(e, n, q, F) / astEvaluate(s, n, q, F);

                  case "%":
                    return astEvaluate(e, n, q, F) % astEvaluate(s, n, q, F);

                  case "<":
                    return astEvaluate(e, n, q, F) < astEvaluate(s, n, q, F);

                  case ">":
                    return astEvaluate(e, n, q, F) > astEvaluate(s, n, q, F);

                  case "<=":
                    return astEvaluate(e, n, q, F) <= astEvaluate(s, n, q, F);

                  case ">=":
                    return astEvaluate(e, n, q, F) >= astEvaluate(s, n, q, F);

                  default:
                    throw createMappedError(108, t.operation);
                }
            }

          case x:
            return astEvaluate(t.condition, n, q, F) ? astEvaluate(t.yes, n, q, F) : astEvaluate(t.no, n, q, F);

          case y:
            return astAssign(t.target, n, q, astEvaluate(t.value, n, q, F));

          case C:
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

          case T:
            return t.name;

          case E:
            return astEvaluate(t.iterable, n, q, F);

          case R:
            if (t.isMulti) {
                let e = t.parts[0];
                let s = 0;
                for (;s < t.expressions.length; ++s) {
                    e += rt(astEvaluate(t.expressions[s], n, q, F));
                    e += t.parts[s + 1];
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

          case M:
            return t.evaluate(n, q, F);
        }
    }
    function astAssign(e, s, i, l) {
        switch (e.$kind) {
          case r:
            {
                if (e.name === "$host") {
                    throw createMappedError(106);
                }
                const t = D(s, e.name, e.ancestor);
                return t[e.name] = l;
            }

          case p:
            {
                const t = astEvaluate(e.object, s, i, null);
                if (isObject(t)) {
                    if (e.name === "length" && isArray(t) && !isNaN(l)) {
                        t.splice(l);
                    } else {
                        t[e.name] = l;
                    }
                } else {
                    astAssign(e.object, s, i, {
                        [e.name]: l
                    });
                }
                return l;
            }

          case v:
            {
                const t = astEvaluate(e.object, s, i, null);
                const r = astEvaluate(e.key, s, i, null);
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

          case y:
            astAssign(e.value, s, i, l);
            return astAssign(e.target, s, i, l);

          case C:
            {
                const t = i?.getConverter?.(e.name);
                if (t == null) {
                    throw createMappedError(103, e.name);
                }
                if ("fromView" in t) {
                    l = t.fromView(l, ...e.args.map((t => astEvaluate(t, s, i, null))));
                }
                return astAssign(e.expression, s, i, l);
            }

          case A:
            return astAssign(e.expression, s, i, l);

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
                        astAssign(a, s, i, l);
                        break;

                      case I:
                      case P:
                        {
                            if (typeof l !== "object" || l === null) {
                                throw createMappedError(112);
                            }
                            let t = astEvaluate(a.source, Scope.create(l), i, null);
                            if (t === void 0 && a.initializer) {
                                t = astEvaluate(a.initializer, s, i, null);
                            }
                            astAssign(a, s, i, t);
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
                    let t = astEvaluate(e.source, Scope.create(l), i, null);
                    if (t === void 0 && e.initializer) {
                        t = astEvaluate(e.initializer, s, i, null);
                    }
                    astAssign(e.target, s, i, t);
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
                        r = Object.entries(l).reduce(((e, [s, i]) => {
                            if (!t.includes(s)) {
                                e[s] = i;
                            }
                            return e;
                        }), {});
                    }
                    astAssign(e.target, s, i, r);
                }
                break;
            }

          case M:
            return e.assign(s, i, l);

          default:
            return void 0;
        }
    }
    function astBind(t, e, s) {
        switch (t.$kind) {
          case A:
            {
                const i = t.name;
                const n = t.key;
                const r = s.getBehavior?.(i);
                if (r == null) {
                    throw createMappedError(101, i);
                }
                if (s[n] === void 0) {
                    s[n] = r;
                    r.bind?.(e, s, ...t.args.map((t => astEvaluate(t, e, s, null))));
                } else {
                    throw createMappedError(102, i);
                }
                astBind(t.expression, e, s);
                return;
            }

          case C:
            {
                const i = t.name;
                const n = s.getConverter?.(i);
                if (n == null) {
                    throw createMappedError(103, i);
                }
                const r = n.signals;
                if (r != null) {
                    const t = s.getSignaler?.();
                    const e = r.length;
                    let i = 0;
                    for (;i < e; ++i) {
                        t?.addSignalListener(r[i], s);
                    }
                }
                astBind(t.expression, e, s);
                return;
            }

          case E:
            {
                astBind(t.iterable, e, s);
                break;
            }

          case M:
            {
                t.bind?.(e, s);
            }
        }
    }
    function astUnbind(t, e, s) {
        switch (t.$kind) {
          case A:
            {
                const i = t.key;
                const n = s;
                if (n[i] !== void 0) {
                    n[i].unbind?.(e, s);
                    n[i] = void 0;
                }
                astUnbind(t.expression, e, s);
                break;
            }

          case C:
            {
                const i = s.getConverter?.(t.name);
                if (i?.signals === void 0) {
                    return;
                }
                const n = s.getSignaler?.();
                let r = 0;
                for (;r < i.signals.length; ++r) {
                    n?.removeSignalListener(i.signals[r], s);
                }
                astUnbind(t.expression, e, s);
                break;
            }

          case E:
            {
                astUnbind(t.iterable, e, s);
                break;
            }

          case M:
            {
                t.unbind?.(e, s);
            }
        }
    }
    const getFunction = (t, e, s) => {
        const i = e == null ? null : e[s];
        if (isFunction(i)) {
            return i;
        }
        if (!t && i == null) {
            return null;
        }
        throw createMappedError(111, s);
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

const Et = 0;

const Rt = 1;

const It = 2;

const Pt = 4;

const Lt = 6;

const Mt = /*@__PURE__*/ at({
    oneTime: Rt,
    toView: It,
    fromView: Pt,
    twoWay: Lt,
    default: Et
});

const Dt = tt.get;

const _t = tt.has;

const qt = tt.define;

const {annotation: Ft} = r;

const Ot = Ft.keyFor;

function bindable(t, e) {
    let s = void 0;
    function decorator(t, e) {
        let i;
        switch (e.kind) {
          case "getter":
          case "field":
            {
                const t = e.name;
                if (typeof t !== "string") throw createMappedError(227);
                i = t;
                break;
            }

          case "class":
            if (s == null) throw createMappedError(228);
            if (typeof s == "string") {
                i = s;
            } else {
                const t = s.name;
                if (!t) throw createMappedError(229);
                if (typeof t !== "string") throw createMappedError(227);
                i = t;
            }
            break;
        }
        const n = s == null || typeof s === "string" ? {
            name: i
        } : s;
        const r = e.metadata[Ht] ??= createLookup();
        r[i] = BindableDefinition.create(i, n);
    }
    if (arguments.length > 1) {
        s = {};
        decorator(t, e);
        return;
    } else if (isString(t)) {
        s = t;
        return decorator;
    }
    s = t === void 0 ? {} : t;
    return decorator;
}

const Ht = /*@__PURE__*/ Ot("bindables");

const Vt = at({
    name: Ht,
    keyFrom: t => `${Ht}:${t}`,
    from(...t) {
        const e = {};
        const s = Array.isArray;
        function addName(t) {
            e[t] = BindableDefinition.create(t);
        }
        function addDescription(t, s) {
            e[t] = s instanceof BindableDefinition ? s : BindableDefinition.create(t, s === true ? {} : s);
        }
        function addList(t) {
            if (s(t)) {
                t.forEach((t => isString(t) ? addName(t) : addDescription(t.name, t)));
            } else if (t instanceof BindableDefinition) {
                e[t.name] = t;
            } else if (t !== void 0) {
                ut(t).forEach((e => addDescription(e, t[e])));
            }
        }
        t.forEach(addList);
        return e;
    },
    getAll(t) {
        const e = [];
        const s = l(t);
        let i = s.length;
        let n;
        while (--i >= 0) {
            n = s[i];
            const t = Dt(Ht, n);
            if (t == null) continue;
            e.push(...Object.values(t));
        }
        return e;
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
    static create(t, e = {}) {
        return new BindableDefinition(e.attribute ?? a(t), e.callback ?? `${t}Changed`, e.mode ?? It, e.primary ?? false, e.name ?? t, e.set ?? getInterceptor(e));
    }
}

function coercer(t, e) {
    e.addInitializer((function() {
        Nt.define(this, e.name);
    }));
}

const Nt = {
    key: /*@__PURE__*/ Ot("coercer"),
    define(t, e) {
        qt(t[e].bind(t), t, Nt.key);
    },
    for(t) {
        return Dt(Nt.key, t);
    }
};

function getInterceptor(t = {}) {
    const e = t.type ?? null;
    if (e == null) {
        return h;
    }
    let s;
    switch (e) {
      case Number:
      case Boolean:
      case String:
      case BigInt:
        s = e;
        break;

      default:
        {
            const t = e.coerce;
            s = typeof t === "function" ? t.bind(e) : Nt.for(e) ?? h;
            break;
        }
    }
    return s === h ? s : createCoercer(s, t.nullable);
}

function createCoercer(t, e) {
    return function(s, i) {
        if (!i?.enableCoercion) return s;
        return (e ?? (i?.coerceNullish ?? false ? false : true)) && s == null ? s : t(s, i);
    };
}

const $t = c.createInterface;

const jt = u.singleton;

const Wt = u.aliasTo;

const Ut = u.instance;

u.callback;

u.transient;

const registerResolver = (t, e, s) => t.registerResolver(e, s);

function alias(...t) {
    return function(e, s) {
        s.addInitializer((function() {
            const e = Ot("aliases");
            const s = Dt(e, this);
            if (s === void 0) {
                qt(t, this, e);
            } else {
                s.push(...t);
            }
        }));
    };
}

function registerAliases(t, e, s, i) {
    for (let n = 0, r = t.length; n < r; ++n) {
        u.aliasTo(s, e.keyFrom(t[n])).register(i);
    }
}

const zt = "element";

const Gt = "attribute";

const Kt = "__au_static_resource__";

const getDefinitionFromStaticAu = (t, e, s) => {
    let i = Dt(Kt, t);
    if (i == null) {
        if (t.$au?.type === e) {
            i = s(t.$au, t);
            qt(i, t, Kt);
        }
    }
    return i;
};

function bindingBehavior(t) {
    return function(e, s) {
        s.addInitializer((function() {
            Yt.define(t, this);
        }));
        return e;
    };
}

class BindingBehaviorDefinition {
    constructor(t, e, s, i) {
        this.Type = t;
        this.name = e;
        this.aliases = s;
        this.key = i;
    }
    static create(t, e) {
        let s;
        let i;
        if (isString(t)) {
            s = t;
            i = {
                name: s
            };
        } else {
            s = t.name;
            i = t;
        }
        return new BindingBehaviorDefinition(e, f(getBehaviorAnnotation(e, "name"), s), d(getBehaviorAnnotation(e, "aliases"), i.aliases, e.aliases), Yt.keyFrom(s));
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getBindingBehaviorKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : jt(s, s), Wt(s, i), ...n.map((t => Wt(s, getBindingBehaviorKeyFrom(t)))));
        }
    }
}

const Xt = "binding-behavior";

const Qt = /*@__PURE__*/ p(Xt);

const getBehaviorAnnotation = (t, e) => Dt(Ot(e), t);

const getBindingBehaviorKeyFrom = t => `${Qt}:${t}`;

const Yt = at({
    name: Qt,
    keyFrom: getBindingBehaviorKeyFrom,
    isType(t) {
        return isFunction(t) && (_t(Qt, t) || t.$au?.type === Xt);
    },
    define(t, e) {
        const s = BindingBehaviorDefinition.create(t, e);
        const i = s.Type;
        qt(s, i, Qt, m);
        return i;
    },
    getDefinition(t) {
        const e = Dt(Qt, t) ?? getDefinitionFromStaticAu(t, Xt, BindingBehaviorDefinition.create);
        if (e === void 0) {
            throw createMappedError(151, t);
        }
        return e;
    },
    find(t, e) {
        const s = t.find(Xt, e);
        return s == null ? null : Dt(Qt, s) ?? getDefinitionFromStaticAu(s, Xt, BindingBehaviorDefinition.create) ?? null;
    },
    get(t, e) {
        return t.get(g(getBindingBehaviorKeyFrom(e)));
    }
});

const Zt = new Map;

const createConfig = t => ({
    type: Xt,
    name: t
});

class BindingModeBehavior {
    bind(t, e) {
        Zt.set(e, e.mode);
        e.mode = this.mode;
    }
    unbind(t, e) {
        e.mode = Zt.get(e);
        Zt.delete(e);
    }
}

class OneTimeBindingBehavior extends BindingModeBehavior {
    get mode() {
        return Rt;
    }
}

OneTimeBindingBehavior.$au = createConfig("oneTime");

class ToViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return It;
    }
}

ToViewBindingBehavior.$au = createConfig("toView");

class FromViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return Pt;
    }
}

FromViewBindingBehavior.$au = createConfig("fromView");

class TwoWayBindingBehavior extends BindingModeBehavior {
    get mode() {
        return Lt;
    }
}

TwoWayBindingBehavior.$au = createConfig("twoWay");

const Jt = new WeakMap;

const te = 200;

class DebounceBindingBehavior {
    constructor() {
        this.p = v(w);
    }
    bind(t, e, s, i) {
        const n = {
            type: "debounce",
            delay: s ?? te,
            now: this.p.performanceNow,
            queue: this.p.taskQueue,
            signals: isString(i) ? [ i ] : i ?? b
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

DebounceBindingBehavior.$au = {
    type: Xt,
    name: "debounce"
};

const ee = /*@__PURE__*/ $t("ISignaler", (t => t.singleton(Signaler)));

class Signaler {
    constructor() {
        this.signals = createLookup();
    }
    dispatchSignal(t) {
        const e = this.signals[t];
        if (e === undefined) {
            return;
        }
        let s;
        for (s of e.keys()) {
            s.handleChange(undefined, undefined);
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
        this.u = v(ee);
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

SignalBindingBehavior.$au = {
    type: Xt,
    name: "signal"
};

const se = new WeakMap;

const ie = 200;

class ThrottleBindingBehavior {
    constructor() {
        ({performanceNow: this.C, taskQueue: this.A} = v(w));
    }
    bind(t, e, s, i) {
        const n = {
            type: "throttle",
            delay: s ?? ie,
            now: this.C,
            queue: this.A,
            signals: isString(i) ? [ i ] : i ?? b
        };
        const r = e.limit?.(n);
        if (r == null) ; else {
            se.set(e, r);
        }
    }
    unbind(t, e) {
        se.get(e)?.dispose();
        se.delete(e);
    }
}

ThrottleBindingBehavior.$au = {
    type: Xt,
    name: "throttle"
};

const ne = /*@__PURE__*/ $t("IAppTask");

class $AppTask {
    constructor(t, e, s) {
        this.c = void 0;
        this.slot = t;
        this.k = e;
        this.cb = s;
    }
    register(t) {
        return this.c = t.register(Ut(ne, this));
    }
    run() {
        const t = this.k;
        const e = this.cb;
        return t === null ? e() : e(this.c.get(t));
    }
}

const re = at({
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

const oe = w;

function watch(t, e) {
    if (t == null) {
        throw createMappedError(772);
    }
    return function decorator(s, i) {
        const n = i.kind === "class";
        if (n) {
            if (!isFunction(e) && (e == null || !(e in s.prototype))) {
                throw createMappedError(773, `${rt(e)}@${s.name}}`);
            }
        } else if (!isFunction(s)) {
            throw createMappedError(774, i.name);
        }
        const r = new WatchDefinition(t, n ? e : s);
        if (n) {
            addDefinition(s);
        } else {
            i.addInitializer((function() {
                addDefinition(this.constructor);
            }));
        }
        function addDefinition(t) {
            le.add(t, r);
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

const le = /*@__PURE__*/ (() => {
    const t = new WeakMap;
    return at({
        add(e, s) {
            let i = t.get(e);
            if (i == null) {
                t.set(e, i = []);
            }
            i.push(s);
        },
        getDefinitions(e) {
            return t.get(e) ?? b;
        }
    });
})();

function customAttribute(t) {
    return function(e, s) {
        s.addInitializer((function() {
            defineAttribute(t, this);
        }));
        return e;
    };
}

function templateController(t) {
    return function(e, s) {
        s.addInitializer((function() {
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
        return Gt;
    }
    constructor(t, e, s, i, n, r, l, a, h, c, u) {
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
        this.containerStrategy = u;
    }
    static create(t, e) {
        let s;
        let i;
        if (isString(t)) {
            s = t;
            i = {
                name: s
            };
        } else {
            s = t.name;
            i = t;
        }
        return new CustomAttributeDefinition(e, f(getAttributeAnnotation(e, "name"), s), d(getAttributeAnnotation(e, "aliases"), i.aliases, e.aliases), getAttributeKeyFrom(s), f(getAttributeAnnotation(e, "defaultBindingMode"), i.defaultBindingMode, e.defaultBindingMode, It), f(getAttributeAnnotation(e, "isTemplateController"), i.isTemplateController, e.isTemplateController, false), Vt.from(...Vt.getAll(e), getAttributeAnnotation(e, "bindables"), e.bindables, i.bindables), f(getAttributeAnnotation(e, "noMultiBindings"), i.noMultiBindings, e.noMultiBindings, false), d(le.getDefinitions(e), e.watches), d(getAttributeAnnotation(e, "dependencies"), i.dependencies, e.dependencies), f(getAttributeAnnotation(e, "containerStrategy"), i.containerStrategy, e.containerStrategy, "reuse"));
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getAttributeKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : jt(s, s), Wt(s, i), ...n.map((t => Wt(s, getAttributeKeyFrom(t)))));
        }
    }
    toString() {
        return `au:ca:${this.name}`;
    }
}

const ae = "custom-attribute";

const he = /*@__PURE__*/ p(ae);

const getAttributeKeyFrom = t => `${he}:${t}`;

const getAttributeAnnotation = (t, e) => Dt(Ot(e), t);

const isAttributeType = t => isFunction(t) && (_t(he, t) || t.$au?.type === ae);

const findAttributeControllerFor = (t, e) => getRef(t, getAttributeKeyFrom(e)) ?? void 0;

const defineAttribute = (t, e) => {
    const s = CustomAttributeDefinition.create(t, e);
    const i = s.Type;
    qt(s, i, he, m);
    return i;
};

const getAttributeDefinition = t => {
    const e = Dt(he, t) ?? getDefinitionFromStaticAu(t, ae, CustomAttributeDefinition.create);
    if (e === void 0) {
        throw createMappedError(759, t);
    }
    return e;
};

const findClosestControllerByName = (t, e) => {
    let s = "";
    let i = "";
    if (isString(e)) {
        s = getAttributeKeyFrom(e);
        i = e;
    } else {
        const t = getAttributeDefinition(e);
        s = t.key;
        i = t.name;
    }
    let n = t;
    while (n !== null) {
        const t = getRef(n, s);
        if (t?.is(i)) {
            return t;
        }
        n = getEffectiveParentNode(n);
    }
    return null;
};

const ce = at({
    name: he,
    keyFrom: getAttributeKeyFrom,
    isType: isAttributeType,
    for: findAttributeControllerFor,
    closest: findClosestControllerByName,
    define: defineAttribute,
    getDefinition: getAttributeDefinition,
    annotate(t, e, s) {
        qt(s, t, Ot(e));
    },
    getAnnotation: getAttributeAnnotation,
    find(t, e) {
        const s = t.find(ae, e);
        return s === null ? null : Dt(he, s) ?? getDefinitionFromStaticAu(s, ae, CustomAttributeDefinition.create) ?? null;
    }
});

const ue = /*@__PURE__*/ $t("ILifecycleHooks");

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
        while (i !== ot) {
            for (const t of ct(i)) {
                if (t !== "constructor" && !t.startsWith("_")) {
                    s.add(t);
                }
            }
            i = Object.getPrototypeOf(i);
        }
        return new LifecycleHooksDefinition(e, s);
    }
}

const fe = /*@__PURE__*/ (() => {
    const t = new WeakMap;
    const e = new WeakMap;
    return at({
        define(t, s) {
            const i = LifecycleHooksDefinition.create(t, s);
            const n = i.Type;
            e.set(n, i);
            return x.define(n, (t => {
                jt(ue, n).register(t);
            }));
        },
        resolve(s) {
            let i = t.get(s);
            if (i === void 0) {
                t.set(s, i = new LifecycleHooksLookupImpl);
                const n = s.root;
                const r = n === s ? s.getAll(ue) : s.has(ue, false) ? n.getAll(ue).concat(s.getAll(ue)) : n.getAll(ue);
                let l;
                let a;
                let h;
                let c;
                let u;
                for (l of r) {
                    a = e.get(l.constructor);
                    h = new LifecycleHooksEntry(a, l);
                    for (c of a.propertyNames) {
                        u = i[c];
                        if (u === void 0) {
                            i[c] = [ h ];
                        } else {
                            u.push(h);
                        }
                    }
                }
            }
            return i;
        }
    });
})();

class LifecycleHooksLookupImpl {}

function lifecycleHooks(t, e) {
    function decorator(t, e) {
        return fe.define({}, t);
    }
    return t == null ? decorator : decorator(t);
}

function valueConverter(t) {
    return function(e, s) {
        s.addInitializer((function() {
            ge.define(t, this);
        }));
        return e;
    };
}

class ValueConverterDefinition {
    constructor(t, e, s, i) {
        this.Type = t;
        this.name = e;
        this.aliases = s;
        this.key = i;
    }
    static create(t, e) {
        let s;
        let i;
        if (isString(t)) {
            s = t;
            i = {
                name: s
            };
        } else {
            s = t.name;
            i = t;
        }
        return new ValueConverterDefinition(e, f(getConverterAnnotation(e, "name"), s), d(getConverterAnnotation(e, "aliases"), i.aliases, e.aliases), ge.keyFrom(s));
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getValueConverterKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : jt(s, s), Wt(s, i), ...n.map((t => Wt(s, getValueConverterKeyFrom(t)))));
        }
    }
}

const de = "value-converter";

const me = /*@__PURE__*/ p(de);

const getConverterAnnotation = (t, e) => Dt(Ot(e), t);

const getValueConverterKeyFrom = t => `${me}:${t}`;

const ge = at({
    name: me,
    keyFrom: getValueConverterKeyFrom,
    isType(t) {
        return isFunction(t) && (_t(me, t) || t.$au?.type === de);
    },
    define(t, e) {
        const s = ValueConverterDefinition.create(t, e);
        const i = s.Type;
        qt(s, i, me, m);
        return i;
    },
    getDefinition(t) {
        const e = Dt(me, t) ?? getDefinitionFromStaticAu(t, de, ValueConverterDefinition.create);
        if (e === void 0) {
            throw createMappedError(152, t);
        }
        return e;
    },
    annotate(t, e, s) {
        qt(s, t, Ot(e));
    },
    getAnnotation: getConverterAnnotation,
    find(t, e) {
        const s = t.find(de, e);
        return s == null ? null : Dt(me, s) ?? getDefinitionFromStaticAu(s, de, ValueConverterDefinition.create) ?? null;
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
        const s = this.b;
        if (t !== Bt(s.ast, s.s, s, null)) {
            this.v = t;
            this.B.add(this);
        }
    }
}

const pe = /*@__PURE__*/ (() => {
    function useScope(t) {
        this.s = t;
    }
    return t => {
        defineHiddenProp(t.prototype, "useScope", useScope);
    };
})();

const ve = /*@__PURE__*/ (() => {
    const t = new WeakMap;
    const e = new WeakMap;
    function evaluatorGet(t) {
        return this.l.get(t);
    }
    function evaluatorGetSignaler() {
        return this.l.root.get(ee);
    }
    function evaluatorGetConverter(e) {
        let s = t.get(this);
        if (s == null) {
            t.set(this, s = new ResourceLookup);
        }
        return s[e] ??= ge.get(this.l, e);
    }
    function evaluatorGetBehavior(t) {
        let s = e.get(this);
        if (s == null) {
            e.set(this, s = new ResourceLookup);
        }
        return s[t] ??= Yt.get(this.l, t);
    }
    return (t, e = true) => s => {
        const i = s.prototype;
        if (t != null) {
            mt(i, "strict", {
                enumerable: true,
                get: function() {
                    return t;
                }
            });
        }
        mt(i, "strictFnCall", {
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
})();

class ResourceLookup {}

const we = /*@__PURE__*/ $t("IFlushQueue", (t => t.singleton(FlushQueue)));

class FlushQueue {
    constructor() {
        this.T = false;
        this.R = new Set;
    }
    get count() {
        return this.R.size;
    }
    add(t) {
        this.R.add(t);
        if (this.T) {
            return;
        }
        this.T = true;
        try {
            this.R.forEach(flushItem);
        } finally {
            this.T = false;
        }
    }
    clear() {
        this.R.clear();
        this.T = false;
    }
}

const flushItem = function(t, e, s) {
    s.delete(t);
    t.flush();
};

const be = /*@__PURE__*/ (() => {
    const t = new WeakSet;
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
            l = i?.status === bt;
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
            h = i?.status === bt;
            u();
            if (h) {
                callOriginalCallback();
            }
        };
        return fn;
    };
    return (e, s) => {
        defineHiddenProp(e.prototype, "limit", (function(e) {
            if (t.has(this)) {
                throw createMappedError(9996);
            }
            t.add(this);
            const i = s(this, e);
            const n = e.signals;
            const r = n.length > 0 ? this.get(ee) : null;
            const l = this[i];
            const callOriginal = (...t) => l.call(this, ...t);
            const a = e.type === "debounce" ? debounced(e, callOriginal, this) : throttled(e, callOriginal, this);
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
                    t.delete(this);
                    a.dispose();
                    delete this[i];
                }
            };
        }));
    };
})();

const xe = {
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
        this.I = null;
        this.v = void 0;
        this.boundFn = false;
        this.l = e;
        this.ast = n;
        this.P = t;
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
                let n = rt(t);
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
                    e.setAttribute(s, rt(t));
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
        const e = Bt(this.ast, this.s, this, (this.mode & It) > 0 ? this : null);
        this.obs.clear();
        if (e !== this.v) {
            this.v = e;
            const s = this.P.state !== ei;
            if (s) {
                t = this.I;
                this.I = this.A.queueTask((() => {
                    this.I = null;
                    this.updateTarget(e);
                }), xe);
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
        St(this.ast, t, this);
        if (this.mode & (It | Rt)) {
            this.updateTarget(this.v = Bt(this.ast, t, this, (this.mode & It) > 0 ? this : null));
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        Tt(this.ast, this.s, this);
        this.s = void 0;
        this.v = void 0;
        this.I?.cancel();
        this.I = null;
        this.obs.clearAll();
    }
}

(() => {
    pe(AttributeBinding);
    be(AttributeBinding, (() => "updateTarget"));
    V(AttributeBinding, null);
    ve(true)(AttributeBinding);
})();

const ye = {
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
        this.I = null;
        this.P = t;
        this.oL = s;
        this.A = i;
        this.L = s.getAccessor(r, l);
        const h = n.expressions;
        const c = this.partBindings = Array(h.length);
        const u = h.length;
        let f = 0;
        for (;u > f; ++f) {
            c[f] = new InterpolationPartBinding(h[f], r, l, e, s, this);
        }
    }
    M() {
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
        const r = this.L;
        const l = this.P.state !== ei && (r.type & Ct) > 0;
        let a;
        if (l) {
            a = this.I;
            this.I = this.A.queueTask((() => {
                this.I = null;
                r.setValue(i, this.target, this.targetProperty);
            }), ye);
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
        this.mode = It;
        this.task = null;
        this.isBound = false;
        this.v = "";
        this.boundFn = false;
        this.l = i;
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
        const t = Bt(this.ast, this.s, this, (this.mode & It) > 0 ? this : null);
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
        St(this.ast, t, this);
        this.v = Bt(this.ast, this.s, this, (this.mode & It) > 0 ? this : null);
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
        Tt(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

(() => {
    pe(InterpolationPartBinding);
    be(InterpolationPartBinding, (() => "updateTarget"));
    V(InterpolationPartBinding, null);
    ve(true)(InterpolationPartBinding);
})();

const ke = {
    reusable: false,
    preempt: true
};

class ContentBinding {
    constructor(t, e, s, i, n, r, l) {
        this.p = n;
        this.ast = r;
        this.target = l;
        this.isBound = false;
        this.mode = It;
        this.I = null;
        this.v = "";
        this._ = false;
        this.boundFn = false;
        this.strict = true;
        this.l = e;
        this.P = t;
        this.oL = s;
        this.A = i;
    }
    updateTarget(t) {
        const e = this.target;
        const s = this.v;
        this.v = t;
        if (this._) {
            s.parentNode?.removeChild(s);
            this._ = false;
        }
        if (t instanceof this.p.Node) {
            e.parentNode?.insertBefore(t, e);
            t = "";
            this._ = true;
        }
        e.textContent = rt(t ?? "");
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = Bt(this.ast, this.s, this, (this.mode & It) > 0 ? this : null);
        this.obs.clear();
        if (t === this.v) {
            this.I?.cancel();
            this.I = null;
            return;
        }
        const e = this.P.state !== ei;
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
        const t = this.v = Bt(this.ast, this.s, this, (this.mode & It) > 0 ? this : null);
        this.obs.clear();
        if (isArray(t)) {
            this.observeCollection(t);
        }
        const e = this.P.state !== ei;
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
        St(this.ast, t, this);
        const e = this.v = Bt(this.ast, this.s, this, (this.mode & It) > 0 ? this : null);
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
        Tt(this.ast, this.s, this);
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
        }), ke);
        e?.cancel();
    }
}

(() => {
    pe(ContentBinding);
    be(ContentBinding, (() => "updateTarget"));
    V(ContentBinding, null);
    ve(void 0, false)(ContentBinding);
})();

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
        this.v = Bt(this.ast, this.s, this, this);
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
        St(this.ast, t, this);
        this.v = Bt(this.ast, this.s, this, this);
        this.updateTarget();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        Tt(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

(() => {
    pe(LetBinding);
    be(LetBinding, (() => "updateTarget"));
    V(LetBinding, null);
    ve(true)(LetBinding);
})();

class PropertyBinding {
    constructor(t, e, s, i, n, r, l, a) {
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
        this.A = i;
        this.oL = s;
    }
    updateTarget(t) {
        this.L.setValue(t, this.target, this.targetProperty);
    }
    updateSource(t) {
        At(this.ast, this.s, this, t);
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = Bt(this.ast, this.s, this, (this.mode & It) > 0 ? this : null);
        this.obs.clear();
        const e = this.P.state !== ei && (this.L.type & Ct) > 0;
        if (e) {
            Ce = this.I;
            this.I = this.A.queueTask((() => {
                this.updateTarget(t);
                this.I = null;
            }), Ae);
            Ce?.cancel();
            Ce = null;
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
        St(this.ast, t, this);
        const e = this.oL;
        const s = this.mode;
        let i = this.L;
        if (!i) {
            if (s & Pt) {
                i = e.getObserver(this.target, this.targetProperty);
            } else {
                i = e.getAccessor(this.target, this.targetProperty);
            }
            this.L = i;
        }
        const n = (s & It) > 0;
        if (s & (It | Rt)) {
            this.updateTarget(Bt(this.ast, this.s, this, n ? this : null));
        }
        if (s & Pt) {
            i.subscribe(this.O ??= new BindingTargetSubscriber(this, this.l.get(we)));
            if (!n) {
                this.updateSource(i.getValue(this.target, this.targetProperty));
            }
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        Tt(this.ast, this.s, this);
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

(() => {
    pe(PropertyBinding);
    be(PropertyBinding, (t => t.mode & Pt ? "updateSource" : "updateTarget"));
    V(PropertyBinding, null);
    ve(true, false)(PropertyBinding);
})();

let Ce = null;

const Ae = {
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
        St(this.ast, t, this);
        At(this.ast, this.s, this, this.target);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        if (Bt(this.ast, this.s, this, null) === this.target) {
            At(this.ast, this.s, this, null);
        }
        Tt(this.ast, this.s, this);
        this.s = void 0;
    }
}

(() => {
    ve(false)(RefBinding);
})();

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
        this.H = null;
        this.l = t;
        this.V = n;
        this.H = r;
    }
    callSource(t) {
        const e = this.s.overrideContext;
        e.$event = t;
        let s = Bt(this.ast, this.s, this, null);
        delete e.$event;
        if (isFunction(s)) {
            s = s(t);
        }
        if (s !== true && this.V.prevent) {
            t.preventDefault();
        }
        return s;
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
        St(this.ast, t, this);
        this.target.addEventListener(this.targetEvent, this, this.V);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        Tt(this.ast, this.s, this);
        this.s = void 0;
        this.target.removeEventListener(this.targetEvent, this, this.V);
    }
}

(() => {
    pe(ListenerBinding);
    be(ListenerBinding, (() => "callSource"));
    ve(true, true)(ListenerBinding);
})();

const Be = /*@__PURE__*/ $t("IEventModifier");

const Se = /*@__PURE__*/ $t("IKeyMapping", (t => t.instance({
    meta: at([ "ctrl", "alt", "shift", "meta" ]),
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
        this.N = v(Se);
        this.$ = [ "left", "middle", "right" ];
    }
    static register(t) {
        t.register(jt(Be, ModifiedMouseEventHandler));
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
                    if (t.button !== this.$.indexOf(n)) return false;
                    continue;
                }
                if (this.N.meta.includes(n) && t[`${n}Key`] !== true) {
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
        this.N = v(Se);
        this.type = [ "keydown", "keyup" ];
    }
    static register(t) {
        t.register(jt(Be, ModifiedKeyboardEventHandler));
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
                if (this.N.meta.includes(n)) {
                    if (t[`${n}Key`] !== true) {
                        return false;
                    }
                    continue;
                }
                const e = this.N.keys[n];
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

const Te = /*@__PURE__*/ $t("IEventModifierHandler", (t => t.instance({
    getHandler: () => null
})));

class EventModifier {
    constructor() {
        this.j = v(y(Be)).reduce(((t, e) => {
            const s = isArray(e.type) ? e.type : [ e.type ];
            s.forEach((s => t[s] = e));
            return t;
        }), {});
    }
    static register(t) {
        t.register(jt(Te, EventModifier));
    }
    getHandler(t, e) {
        return isString(e) ? this.j[t]?.getHandler(e) ?? null : null;
    }
}

const Ee = {
    register(t) {
        t.register(EventModifier, ModifiedMouseEventHandler, ModifiedKeyboardEventHandler);
    }
};

const Re = /*@__PURE__*/ $t("IViewFactory");

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

const Ie = "au-start";

const Pe = "au-end";

const createElement = (t, e) => t.document.createElement(e);

const createComment = (t, e) => t.document.createComment(e);

const createLocation = t => {
    const e = createComment(t, Pe);
    e.$start = createComment(t, Ie);
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

const Le = "default";

const Me = "au-slot";

const De = /*@__PURE__*/ $t("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

const _e = /*@__PURE__*/ $t("IAuSlotWatcher");

class AuSlotWatcherBinding {
    constructor(t, e, s, i) {
        this.G = new Set;
        this.K = b;
        this.isBound = false;
        this.cb = (this.o = t)[e];
        this.slotName = s;
        this.X = i;
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
        Ut(ue, this).register(t);
    }
    hydrating(t, e) {
        const s = this.Y;
        const i = new AuSlotWatcherBinding(t, s.callback ?? `${rt(s.name)}Changed`, s.slotName ?? "default", s.query ?? "*");
        mt(t, s.name, {
            enumerable: true,
            configurable: true,
            get: ht((() => i.getValue()), {
                getObserver: () => i
            }),
            set: () => {}
        });
        Ut(_e, i).register(e.container);
        e.addBinding(i);
    }
}

function slotted(t, e) {
    if (!qe) {
        qe = true;
        N(AuSlotWatcherBinding, null);
        lifecycleHooks()(SlottedLifecycleHooks, null);
    }
    const s = Ot("dependencies");
    function decorator(i, n) {
        if (n.kind !== "field") throw createMappedError(9990);
        const r = typeof t === "object" ? t : {
            query: t,
            slotName: e,
            name: ""
        };
        r.name = n.name;
        const l = n.metadata[s] ??= [];
        l.push(new SlottedLifecycleHooks(r));
    }
    return decorator;
}

let qe = false;

class SpreadBinding {
    static create(t, e, s, i, n, r, l, a) {
        const h = [];
        const c = i.renderers;
        const getHydrationContext = e => {
            let s = e;
            let i = t;
            while (i != null && s > 0) {
                i = i.parent;
                --s;
            }
            if (i == null) {
                throw createMappedError(9999);
            }
            return i;
        };
        const renderSpreadInstruction = t => {
            const i = getHydrationContext(t);
            const u = new SpreadBinding(i);
            const f = n.compileSpread(i.controller.definition, i.instruction?.captures ?? b, i.controller.container, e, s);
            let d;
            for (d of f) {
                switch (d.type) {
                  case es:
                    renderSpreadInstruction(t + 1);
                    break;

                  case ss:
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
        if (t.vmKind !== Zs) {
            throw createMappedError(9998);
        }
        this.$controller.addChild(t);
    }
}

const Fe = "ra";

const Oe = "rb";

const He = "rc";

const Ve = "rd";

const Ne = "re";

const $e = "rf";

const je = "rg";

const We = "ri";

const Ue = "rj";

const ze = "rk";

const Ge = "rl";

const Ke = "ha";

const Xe = "hb";

const Qe = "hc";

const Ye = "hd";

const Ze = "he";

const Je = "hf";

const ts = "hg";

const es = "hs";

const ss = "hp";

const is = /*@__PURE__*/ at({
    hydrateElement: Fe,
    hydrateAttribute: Oe,
    hydrateTemplateController: He,
    hydrateLetElement: Ve,
    setProperty: Ne,
    interpolation: $e,
    propertyBinding: je,
    letBinding: We,
    refBinding: Ue,
    iteratorBinding: ze,
    multiAttr: Ge,
    textBinding: Ke,
    listenerBinding: Xe,
    attributeBinding: Qe,
    stylePropertyBinding: Ye,
    setAttribute: Ze,
    setClassAttribute: Je,
    setStyleAttribute: ts,
    spreadBinding: es,
    spreadElementProp: ss
});

const ns = /*@__PURE__*/ $t("Instruction");

function isInstruction(t) {
    const e = t.type;
    return isString(e) && e.length === 2;
}

class InterpolationInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = $e;
    }
}

class PropertyBindingInstruction {
    constructor(t, e, s) {
        this.from = t;
        this.to = e;
        this.mode = s;
        this.type = je;
    }
}

class IteratorBindingInstruction {
    constructor(t, e, s) {
        this.forOf = t;
        this.to = e;
        this.props = s;
        this.type = ze;
    }
}

class RefBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Ue;
    }
}

class SetPropertyInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = Ne;
    }
}

class MultiAttrInstruction {
    constructor(t, e, s) {
        this.value = t;
        this.to = e;
        this.command = s;
        this.type = Ge;
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
        this.type = Fe;
    }
}

class HydrateAttributeInstruction {
    constructor(t, e, s) {
        this.res = t;
        this.alias = e;
        this.props = s;
        this.type = Oe;
    }
}

class HydrateTemplateController {
    constructor(t, e, s, i) {
        this.def = t;
        this.res = e;
        this.alias = s;
        this.props = i;
        this.type = He;
    }
}

class HydrateLetElementInstruction {
    constructor(t, e) {
        this.instructions = t;
        this.toBindingContext = e;
        this.type = Ve;
    }
}

class LetBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = We;
    }
}

class TextBindingInstruction {
    constructor(t) {
        this.from = t;
        this.type = Ke;
    }
}

class ListenerBindingInstruction {
    constructor(t, e, s, i) {
        this.from = t;
        this.to = e;
        this.capture = s;
        this.modifier = i;
        this.type = Xe;
    }
}

class StylePropertyBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Ye;
    }
}

class SetAttributeInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = Ze;
    }
}

class SetClassAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = Je;
    }
}

class SetStyleAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = ts;
    }
}

class AttributeBindingInstruction {
    constructor(t, e, s) {
        this.attr = t;
        this.from = e;
        this.to = s;
        this.type = Qe;
    }
}

class SpreadBindingInstruction {
    constructor() {
        this.type = es;
    }
}

class SpreadElementPropBindingInstruction {
    constructor(t) {
        this.instructions = t;
        this.type = ss;
    }
}

const rs = /*@__PURE__*/ $t("ITemplateCompiler");

const os = /*@__PURE__*/ $t("IRenderer");

function renderer(t, e) {
    return x.define(t, (function(t) {
        jt(os, this).register(t);
    }));
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

const ls = /*@__PURE__*/ renderer(class SetPropertyRenderer {
    constructor() {
        this.target = Ne;
    }
    render(t, e, s) {
        const i = getTarget(e);
        if (i.$observers?.[s.to] !== void 0) {
            i.$observers[s.to].setValue(s.value);
        } else {
            i[s.to] = s.value;
        }
    }
});

const as = /*@__PURE__*/ renderer(class CustomElementRenderer {
    constructor() {
        this.r = v(Ls);
        this.target = Fe;
    }
    render(t, e, s, i, n, r) {
        let l;
        let a;
        let h;
        const c = s.res;
        const u = s.projections;
        const f = t.container;
        switch (typeof c) {
          case "string":
            l = Ti.find(f, c);
            if (l == null) {
                throw createMappedError(752, s, t);
            }
            break;

          default:
            l = c;
        }
        const d = s.containerless || l.containerless;
        const m = d ? convertToRenderLocation(e) : null;
        const g = createElementContainer(i, t, e, s, m, u == null ? void 0 : new AuSlotsInfo(ut(u)));
        a = g.invoke(l.Type);
        h = Controller.$el(g, a, e, s, l, m);
        setRef(e, l.key, h);
        const p = this.r.renderers;
        const v = s.props;
        const w = v.length;
        let b = 0;
        let x;
        while (w > b) {
            x = v[b];
            p[x.type].render(t, h, x, i, n, r);
            ++b;
        }
        t.addChild(h);
    }
});

const hs = /*@__PURE__*/ renderer(class CustomAttributeRenderer {
    constructor() {
        this.r = v(Ls);
        this.target = Oe;
    }
    render(t, e, s, i, n, r) {
        let l = t.container;
        let a;
        switch (typeof s.res) {
          case "string":
            a = ce.find(l, s.res);
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
        let m = 0;
        let g;
        while (d > m) {
            g = f[m];
            u[g.type].render(t, c, g, i, n, r);
            ++m;
        }
        t.addChild(c);
    }
});

const cs = /*@__PURE__*/ renderer(class TemplateControllerRenderer {
    constructor() {
        this.r = v(Ls);
        this.target = He;
    }
    render(t, e, s, i, n, r) {
        let l = t.container;
        let a;
        switch (typeof s.res) {
          case "string":
            a = ce.find(l, s.res);
            if (a == null) {
                throw createMappedError(754, s, t);
            }
            break;

          default:
            a = s.res;
        }
        const h = this.r.getViewFactory(s.def, a.containerStrategy === "new" ? l.createChild({
            inheritParentResources: true
        }) : l);
        const c = convertToRenderLocation(e);
        const u = invokeAttribute(i, a, t, e, s, h, c);
        const f = Controller.$attr(u.ctn, u.vm, e, a);
        setRef(c, a.key, f);
        u.vm.link?.(t, f, e, s);
        const d = this.r.renderers;
        const m = s.props;
        const g = m.length;
        let p = 0;
        let v;
        while (g > p) {
            v = m[p];
            d[v.type].render(t, f, v, i, n, r);
            ++p;
        }
        t.addChild(f);
    }
});

const us = /*@__PURE__*/ renderer(class LetElementRenderer {
    constructor() {
        this.target = Ve;
    }
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
            f = ensureExpression(n, u.from, wt);
            t.addBinding(new LetBinding(h, r, f, u.to, a));
            ++d;
        }
    }
});

const fs = /*@__PURE__*/ renderer(class RefBindingRenderer {
    constructor() {
        this.target = Ue;
    }
    render(t, e, s, i, n) {
        t.addBinding(new RefBinding(t.container, ensureExpression(n, s.from, wt), getRefTarget(e, s.to)));
    }
});

const ds = /*@__PURE__*/ renderer(class InterpolationBindingRenderer {
    constructor() {
        this.target = $e;
    }
    render(t, e, s, i, n, r) {
        t.addBinding(new InterpolationBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, gt), getTarget(e), s.to, It));
    }
});

const ms = /*@__PURE__*/ renderer(class PropertyBindingRenderer {
    constructor() {
        this.target = je;
    }
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, wt), getTarget(e), s.to, s.mode));
    }
});

const gs = /*@__PURE__*/ renderer(class IteratorBindingRenderer {
    constructor() {
        this.target = ze;
    }
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.forOf, pt), getTarget(e), s.to, It));
    }
});

const ps = /*@__PURE__*/ renderer(class TextBindingRenderer {
    constructor() {
        this.target = Ke;
    }
    render(t, e, s, i, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, i.domWriteQueue, i, ensureExpression(n, s.from, wt), e));
    }
});

const vs = $t("IListenerBindingOptions", (t => t.instance({
    prevent: false
})));

const ws = /*@__PURE__*/ renderer(class ListenerBindingRenderer {
    constructor() {
        this.target = Xe;
        this.tt = v(Te);
        this.et = v(vs);
    }
    render(t, e, s, i, n) {
        t.addBinding(new ListenerBinding(t.container, ensureExpression(n, s.from, vt), e, s.to, new ListenerBindingOptions(this.et.prevent, s.capture), this.tt.getHandler(s.to, s.modifier)));
    }
});

const bs = /*@__PURE__*/ renderer(class SetAttributeRenderer {
    constructor() {
        this.target = Ze;
    }
    render(t, e, s) {
        e.setAttribute(s.to, s.value);
    }
});

const xs = /*@__PURE__*/ renderer(class SetClassAttributeRenderer {
    constructor() {
        this.target = Je;
    }
    render(t, e, s) {
        addClasses(e.classList, s.value);
    }
});

const ys = /*@__PURE__*/ renderer(class SetStyleAttributeRenderer {
    constructor() {
        this.target = ts;
    }
    render(t, e, s) {
        e.style.cssText += s.value;
    }
});

const ks = /*@__PURE__*/ renderer(class StylePropertyBindingRenderer {
    constructor() {
        this.target = Ye;
    }
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, wt), e.style, s.to, It));
    }
});

const Cs = /*@__PURE__*/ renderer(class AttributeBindingRenderer {
    constructor() {
        this.target = Qe;
    }
    render(t, e, s, i, n, r) {
        const l = t.container;
        const a = l.has(pi, false) ? l.get(pi) : null;
        t.addBinding(new AttributeBinding(t, l, r, i.domWriteQueue, ensureExpression(n, s.from, wt), e, s.attr, a == null ? s.to : s.to.split(/\s/g).map((t => a[t] ?? t)).join(" "), It));
    }
});

const As = /*@__PURE__*/ renderer(class SpreadRenderer {
    constructor() {
        this.st = v(rs);
        this.r = v(Ls);
        this.target = es;
    }
    render(t, e, s, i, n, r) {
        SpreadBinding.create(t.container.get(hi), e, void 0, this.r, this.st, i, n, r).forEach((e => t.addBinding(e)));
    }
});

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

const Bs = "IController";

const Ss = "IInstruction";

const Ts = "IRenderLocation";

const Es = "ISlotsInfo";

function createElementContainer(t, e, s, i, n, r) {
    const l = e.container.createChild();
    registerHostNode(l, t, s);
    registerResolver(l, ai, new k(Bs, e));
    registerResolver(l, ns, new k(Ss, i));
    registerResolver(l, gi, n == null ? Rs : new RenderLocationProvider(n));
    registerResolver(l, Re, Is);
    registerResolver(l, De, r == null ? Ps : new k(Es, r));
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

function invokeAttribute(t, e, s, i, n, r, l, a) {
    const h = s instanceof Controller ? s : s.$controller;
    const c = h.container.createChild();
    registerHostNode(c, t, i);
    registerResolver(c, ai, new k(Bs, h));
    registerResolver(c, ns, new k(Ss, n));
    registerResolver(c, gi, l == null ? Rs : new k(Ts, l));
    registerResolver(c, Re, r == null ? Is : new ViewFactoryProvider(r));
    registerResolver(c, De, a == null ? Ps : new k(Es, a));
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

const Rs = new RenderLocationProvider(null);

const Is = new ViewFactoryProvider(null);

const Ps = new k(Es, new AuSlotsInfo(b));

const Ls = /*@__PURE__*/ $t("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.it ??= this.nt.getAll(os, false).reduce(((t, e) => {
            t[e.target] = e;
            return t;
        }), createLookup());
    }
    constructor() {
        this.rt = new WeakMap;
        this.ot = new WeakMap;
        const t = this.nt = v(C).root;
        this.p = t.get(oe);
        this.ep = t.get(e);
        this.oL = t.get($);
        this.lt = new FragmentNodeSequence(this.p, this.p.document.createDocumentFragment());
    }
    compile(t, e, s) {
        const i = e.get(rs);
        const n = this.rt;
        let r = n.get(t);
        if (t.needsCompile !== false) {
            if (r == null) {
                n.set(t, r = CustomElementDefinition.create(i.compile(t, e, s)));
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
            let a;
            if (l == null) {
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
            this.ht(e);
            i.set(t, e);
        }
        return e == null ? this.lt : new FragmentNodeSequence(this.p, s ? r.importNode(e, true) : r.adoptNode(e.cloneNode(true)));
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
        this.type = kt | Ct;
        this.v = "";
        this.vt = {};
        this.wt = 0;
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
        const t = this.vt;
        const e = ++this.wt;
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
                t[l] = this.wt;
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

(() => {
    mixinNoopSubscribable(ClassAttributeAccessor);
})();

function getClassesToAdd(t) {
    if (isString(t)) {
        return splitClassString(t);
    }
    if (typeof t !== "object") {
        return b;
    }
    if (isArray(t)) {
        const e = t.length;
        if (e > 0) {
            const s = [];
            let i = 0;
            for (;e > i; ++i) {
                s.push(...getClassesToAdd(t[i]));
            }
            return s;
        } else {
            return b;
        }
    }
    const e = [];
    let s;
    for (s in t) {
        if (Boolean(t[s])) {
            if (s.includes(" ")) {
                e.push(...splitClassString(s));
            } else {
                e.push(s);
            }
        }
    }
    return e;
}

function splitClassString(t) {
    const e = t.match(/\S+/g);
    if (e === null) {
        return b;
    }
    return e;
}

function cssModules(...t) {
    return new CSSModulesProcessorRegistry(t);
}

class CSSModulesProcessorRegistry {
    constructor(t) {
        this.modules = t;
    }
    register(t) {
        const e = ht({}, ...this.modules);
        const s = defineAttribute({
            name: "class",
            bindables: [ "value" ],
            noMultiBindings: true
        }, class CustomAttributeClass {
            constructor() {
                this.xt = new ClassAttributeAccessor(v(di));
                this.value = "";
            }
            binding() {
                this.valueChanged();
            }
            valueChanged() {
                this.xt.setValue(this.value?.split(/\s+/g).map((t => e[t] || t)) ?? "");
            }
        });
        t.register(s, Ut(pi, e));
    }
}

function shadowCSS(...t) {
    return new ShadowDOMRegistry(t);
}

const Ms = /*@__PURE__*/ $t("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
    if (AdoptedStyleSheetsStyles.supported(t.get(oe))) {
        return t.get(AdoptedStyleSheetsStylesFactory);
    }
    return t.get(StyleElementStylesFactory);
}))));

class ShadowDOMRegistry {
    constructor(t) {
        this.css = t;
    }
    register(t) {
        const e = t.get(_s);
        const s = t.get(Ms);
        t.register(Ut(Ds, s.createStyles(this.css, e)));
    }
}

class AdoptedStyleSheetsStylesFactory {
    constructor() {
        this.p = v(oe);
        this.cache = new Map;
    }
    createStyles(t, e) {
        return new AdoptedStyleSheetsStyles(this.p, t, this.cache, e);
    }
}

class StyleElementStylesFactory {
    constructor() {
        this.p = v(oe);
    }
    createStyles(t, e) {
        return new StyleElementStyles(this.p, t, e);
    }
}

const Ds = /*@__PURE__*/ $t("IShadowDOMStyles");

const _s = /*@__PURE__*/ $t("IShadowDOMGlobalStyles", (t => t.instance({
    applyTo: h
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

const qs = {
    shadowDOM(t) {
        return re.creating(C, (e => {
            if (t.sharedStyles != null) {
                const s = e.get(Ms);
                e.register(Ut(_s, s.createStyles(t.sharedStyles, null)));
            }
        }));
    }
};

const {enter: Fs, exit: Os} = j;

const {wrap: Hs, unwrap: Vs} = W;

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
        if (!dt(s, e)) {
            this.cb.call(t, s, e, t);
        }
    }
    compute() {
        this.running = true;
        this.obs.version++;
        try {
            Fs(this);
            return this.v = Vs(this.$get.call(void 0, this.useProxy ? Hs(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            Os(this);
        }
    }
}

(() => {
    V(ComputedWatcher, null);
})();

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
        const s = this.obj;
        const i = this.v;
        const n = e.$kind === "AccessScope" && this.obs.count === 1;
        if (!n) {
            this.obs.version++;
            t = Bt(e, this.scope, this, this);
            this.obs.clear();
        }
        if (!dt(t, i)) {
            this.v = t;
            this.cb.call(s, t, i, s);
        }
    }
    bind() {
        if (this.isBound) {
            return;
        }
        this.obs.version++;
        this.v = Bt(this.yt, this.scope, this, this);
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

(() => {
    V(ExpressionWatcher, null);
    ve(true)(ExpressionWatcher);
})();

class Controller {
    get lifecycleHooks() {
        return this.kt;
    }
    get isActive() {
        return (this.state & (ei | si)) > 0 && (this.state & ii) === 0;
    }
    get name() {
        if (this.parent === null) {
            switch (this.vmKind) {
              case Zs:
                return `[${this.definition.name}]`;

              case Ys:
                return this.definition.name;

              case Js:
                return this.viewFactory.name;
            }
        }
        switch (this.vmKind) {
          case Zs:
            return `${this.parent.name}>[${this.definition.name}]`;

          case Ys:
            return `${this.parent.name}>${this.definition.name}`;

          case Js:
            return this.viewFactory.name === this.parent.definition?.name ? `${this.parent.name}[view]` : `${this.parent.name}[view:${this.viewFactory.name}]`;
        }
    }
    get viewModel() {
        return this.Ct;
    }
    set viewModel(t) {
        this.Ct = t;
        this.At = t == null || this.vmKind === Js ? HooksDefinition.none : new HooksDefinition(t);
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
        this.mountTarget = $s;
        this.shadowRoot = null;
        this.nodes = null;
        this.location = null;
        this.kt = null;
        this.state = ti;
        this.St = false;
        this.$initiator = null;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this.Tt = 0;
        this.Et = 0;
        this.Rt = 0;
        this.Ct = n;
        this.At = e === Js ? HooksDefinition.none : new HooksDefinition(n);
        this.location = l;
        this.r = t.root.get(Ls);
        this.coercion = e === Js ? void 0 : t.get(Ks);
    }
    static getCached(t) {
        return Ns.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (e === void 0) {
            throw createMappedError(500, t);
        }
        return e;
    }
    static $el(t, e, s, i, n = void 0, r = null) {
        if (Ns.has(e)) {
            return Ns.get(e);
        }
        {
            n = n ?? getElementDefinition(e.constructor);
        }
        registerResolver(t, n.Type, new k(n.key, e, n.Type));
        const l = new Controller(t, Ys, n, null, e, s, r);
        const a = t.get(B(hi));
        if (n.dependencies.length > 0) {
            t.register(...n.dependencies);
        }
        registerResolver(t, hi, new k("IHydrationContext", new HydrationContext(l, i, a)));
        Ns.set(e, l);
        if (i == null || i.hydrate !== false) {
            l.hE(i, a);
        }
        return l;
    }
    static $attr(t, e, s, i) {
        if (Ns.has(e)) {
            return Ns.get(e);
        }
        i = i ?? getAttributeDefinition(e.constructor);
        registerResolver(t, i.Type, new k(i.key, e, i.Type));
        const n = new Controller(t, Zs, i, null, e, s, null);
        if (i.dependencies.length > 0) {
            t.register(...i.dependencies);
        }
        Ns.set(e, n);
        n.It();
        return n;
    }
    static $view(t, e = void 0) {
        const s = new Controller(t.container, Js, null, t, null, null, null);
        s.parent = e ?? null;
        s.Pt();
        return s;
    }
    hE(t, e) {
        const s = this.container;
        const i = this.Ct;
        const n = this.definition;
        this.scope = Scope.create(i, null, true);
        if (n.watches.length > 0) {
            createWatchers(this, s, n, i);
        }
        createObservers(this, n, i);
        this.kt = fe.resolve(s);
        s.register(n.Type);
        if (n.injectable !== null) {
            registerResolver(s, n.injectable, new k("definition.injectable", i));
        }
        if (t == null || t.hydrate !== false) {
            this.hS(t);
            this.hC();
        }
    }
    hS(t) {
        if (this.kt.hydrating != null) {
            this.kt.hydrating.forEach(callHydratingHook, this);
        }
        if (this.At.Lt) {
            this.Ct.hydrating(this);
        }
        const e = this.definition;
        const s = this.Mt = this.r.compile(e, this.container, t);
        const i = s.shadowOptions;
        const n = s.hasSlots;
        const r = s.containerless;
        let l = this.host;
        let a = this.location;
        if ((this.hostController = findElementControllerFor(l, Gs)) !== null) {
            l = this.host = this.container.root.get(oe).document.createElement(e.name);
            if (r && a == null) {
                a = this.location = convertToRenderLocation(l);
            }
        }
        setRef(l, Ai, this);
        setRef(l, e.key, this);
        if (i !== null || n) {
            if (a != null) {
                throw createMappedError(501);
            }
            setRef(this.shadowRoot = l.attachShadow(i ?? Qs), Ai, this);
            setRef(this.shadowRoot, e.key, this);
            this.mountTarget = Ws;
        } else if (a != null) {
            setRef(a, Ai, this);
            setRef(a, e.key, this);
            this.mountTarget = Us;
        } else {
            this.mountTarget = js;
        }
        this.Ct.$controller = this;
        this.nodes = this.r.createNodes(s);
        if (this.kt.hydrated !== void 0) {
            this.kt.hydrated.forEach(callHydratedHook, this);
        }
        if (this.At.Dt) {
            this.Ct.hydrated(this);
        }
    }
    hC() {
        this.r.render(this, this.nodes.findTargets(), this.Mt, this.host);
        if (this.kt.created !== void 0) {
            this.kt.created.forEach(callCreatedHook, this);
        }
        if (this.At._t) {
            this.Ct.created(this);
        }
    }
    It() {
        const t = this.definition;
        const e = this.Ct;
        if (t.watches.length > 0) {
            createWatchers(this, this.container, t, e);
        }
        createObservers(this, t, e);
        e.$controller = this;
        this.kt = fe.resolve(this.container);
        if (this.kt.created !== void 0) {
            this.kt.created.forEach(callCreatedHook, this);
        }
        if (this.At._t) {
            this.Ct.created(this);
        }
    }
    Pt() {
        this.Mt = this.r.compile(this.viewFactory.def, this.container, null);
        this.r.render(this, (this.nodes = this.r.createNodes(this.Mt)).findTargets(), this.Mt, void 0);
    }
    activate(t, e, s) {
        switch (this.state) {
          case ti:
          case ni:
            if (!(e === null || e.isActive)) {
                return;
            }
            this.state = ei;
            break;

          case si:
            return;

          case oi:
            throw createMappedError(502, this.name);

          default:
            throw createMappedError(503, this.name, stringifyState(this.state));
        }
        this.parent = e;
        switch (this.vmKind) {
          case Ys:
            this.scope.parent = s ?? null;
            break;

          case Zs:
            this.scope = s ?? null;
            break;

          case Js:
            if (s === void 0 || s === null) {
                throw createMappedError(504, this.name);
            }
            if (!this.hasLockedScope) {
                this.scope = s;
            }
            break;
        }
        this.$initiator = t;
        this.qt();
        let i = void 0;
        if (this.vmKind !== Js && this.kt.binding != null) {
            i = S(...this.kt.binding.map(callBindingHook, this));
        }
        if (this.At.Ft) {
            i = S(i, this.Ct.binding(this.$initiator, this.parent));
        }
        if (isPromise(i)) {
            this.Ot();
            i.then((() => {
                this.Bt = true;
                if (this.state !== ei) {
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
        let s = void 0;
        if (this.bindings !== null) {
            t = 0;
            e = this.bindings.length;
            while (e > t) {
                this.bindings[t].bind(this.scope);
                ++t;
            }
        }
        if (this.vmKind !== Js && this.kt.bound != null) {
            s = S(...this.kt.bound.map(callBoundHook, this));
        }
        if (this.At.Nt) {
            s = S(s, this.Ct.bound(this.$initiator, this.parent));
        }
        if (isPromise(s)) {
            this.Ot();
            s.then((() => {
                this.isBound = true;
                if (this.state !== ei) {
                    this.Ht();
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
          case js:
            this.host.append(...t);
            break;

          case Ws:
            this.shadowRoot.append(...t);
            break;

          case Us:
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
              case js:
              case Ws:
                this.hostController.jt(this.host);
                break;

              case Us:
                this.hostController.jt(this.location.$start, this.location);
                break;
            }
        }
        switch (this.mountTarget) {
          case js:
            this.nodes.appendTo(this.host, this.definition != null && this.definition.enhance);
            break;

          case Ws:
            {
                const t = this.container;
                const e = t.has(Ds, false) ? t.get(Ds) : t.get(_s);
                e.applyTo(this.shadowRoot);
                this.nodes.appendTo(this.shadowRoot);
                break;
            }

          case Us:
            this.nodes.insertBefore(this.location);
            break;
        }
        let t = 0;
        let e = void 0;
        if (this.vmKind !== Js && this.kt.attaching != null) {
            e = S(...this.kt.attaching.map(callAttachingHook, this));
        }
        if (this.At.Wt) {
            e = S(e, this.Ct.attaching(this.$initiator, this.parent));
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
        let s = void 0;
        switch (this.state & ~ri) {
          case si:
            this.state = ii;
            break;

          case ei:
            this.state = ii;
            s = this.$promise?.catch(h);
            break;

          case ti:
          case ni:
          case oi:
          case ni | oi:
            return;

          default:
            throw createMappedError(505, this.name, this.state);
        }
        this.$initiator = t;
        if (t === this) {
            this.Ut();
        }
        let i = 0;
        let n;
        if (this.children !== null) {
            for (i = 0; i < this.children.length; ++i) {
                void this.children[i].deactivate(t, this);
            }
        }
        return T(s, (() => {
            if (this.isBound) {
                if (this.vmKind !== Js && this.kt.detaching != null) {
                    n = S(...this.kt.detaching.map(callDetachingHook, this));
                }
                if (this.At.zt) {
                    n = S(n, this.Ct.detaching(this.$initiator, this.parent));
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
          case Ys:
          case Js:
            this.nodes.remove();
            this.nodes.unlink();
        }
        if (this.hostController !== null) {
            switch (this.mountTarget) {
              case js:
              case Ws:
                this.host.remove();
                break;

              case Us:
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
          case Zs:
            this.scope = null;
            break;

          case Js:
            if (!this.hasLockedScope) {
                this.scope = null;
            }
            if ((this.state & ri) === ri && !this.viewFactory.tryReturnToCache(this) && this.$initiator === this) {
                this.dispose();
            }
            break;

          case Ys:
            this.scope.parent = null;
            break;
        }
        this.state = ni;
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
            ci = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            ci();
            ci = void 0;
        }
    }
    Vt(t) {
        if (this.$promise !== void 0) {
            ui = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            ui(t);
            ui = void 0;
        }
        if (this.$initiator !== this) {
            this.parent.Vt(t);
        }
    }
    qt() {
        ++this.Tt;
        if (this.$initiator !== this) {
            this.parent.qt();
        }
    }
    Ht() {
        if (this.state !== ei) {
            --this.Tt;
            this.Kt();
            if (this.$initiator !== this) {
                this.parent.Ht();
            }
            return;
        }
        if (--this.Tt === 0) {
            if (this.vmKind !== Js && this.kt.attached != null) {
                fi = S(...this.kt.attached.map(callAttachedHook, this));
            }
            if (this.At.Xt) {
                fi = S(fi, this.Ct.attached(this.$initiator));
            }
            if (isPromise(fi)) {
                this.Ot();
                fi.then((() => {
                    this.state = si;
                    this.Kt();
                    if (this.$initiator !== this) {
                        this.parent.Ht();
                    }
                })).catch((t => {
                    this.Vt(t);
                }));
                fi = void 0;
                return;
            }
            fi = void 0;
            this.state = si;
            this.Kt();
        }
        if (this.$initiator !== this) {
            this.parent.Ht();
        }
    }
    Ut() {
        ++this.Et;
    }
    Gt() {
        if (--this.Et === 0) {
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
                    if (t.vmKind !== Js && t.kt.unbinding != null) {
                        e = S(...t.kt.unbinding.map(callUnbindingHook, t));
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
        ++this.Rt;
    }
    Zt() {
        if (--this.Rt === 0) {
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
          case Zs:
          case Ys:
            {
                return this.definition.name === t;
            }

          case Js:
            return this.viewFactory.name === t;
        }
    }
    lockScope(t) {
        this.scope = t;
        this.hasLockedScope = true;
    }
    setHost(t) {
        if (this.vmKind === Ys) {
            setRef(t, Ai, this);
            setRef(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = js;
        return this;
    }
    setShadowRoot(t) {
        if (this.vmKind === Ys) {
            setRef(t, Ai, this);
            setRef(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = Ws;
        return this;
    }
    setLocation(t) {
        if (this.vmKind === Ys) {
            setRef(t, Ai, this);
            setRef(t, this.definition.key, this);
        }
        this.location = t;
        this.mountTarget = Us;
        return this;
    }
    release() {
        this.state |= ri;
    }
    dispose() {
        if ((this.state & oi) === oi) {
            return;
        }
        this.state |= oi;
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
            Ns.delete(this.Ct);
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

const Ns = new WeakMap;

const $s = 0;

const js = 1;

const Ws = 2;

const Us = 3;

const zs = at({
    none: $s,
    host: js,
    shadowRoot: Ws,
    location: Us
});

const Gs = {
    optional: true
};

const Ks = A(U);

function createObservers(t, e, s) {
    const i = e.bindables;
    const n = ct(i);
    const r = n.length;
    const l = t.container.get($);
    if (r > 0) {
        for (let e = 0; e < r; ++e) {
            const r = n[e];
            const a = i[r];
            const c = a.callback;
            const u = l.getObserver(s, r);
            if (a.set !== h) {
                if (u.useCoercer?.(a.set, t.coercion) !== true) {
                    throw createMappedError(507, r);
                }
            }
            if (s[c] != null || s.propertyChanged != null) {
                const callback = (e, i) => {
                    if (t.isBound) {
                        s[c]?.(e, i);
                        s.propertyChanged?.(r, e, i);
                    }
                };
                if (u.useCallback?.(callback) !== true) {
                    throw createMappedError(508, r);
                }
            }
        }
    }
}

const Xs = new Map;

const getAccessScopeAst = t => {
    let e = Xs.get(t);
    if (e == null) {
        e = new s(t, 0);
        Xs.set(t, e);
    }
    return e;
};

function createWatchers(t, s, i, n) {
    const r = s.get($);
    const l = s.get(e);
    const a = i.watches;
    const h = t.vmKind === Ys ? t.scope : Scope.create(n, null, true);
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
            d = isString(u) ? l.parse(u, wt) : getAccessScopeAst(u);
            t.addBinding(new ExpressionWatcher(h, s, r, d, f));
        }
    }
}

function isCustomElementController(t) {
    return t instanceof Controller && t.vmKind === Ys;
}

function isCustomElementViewModel(t) {
    return et(t) && isElementType(t.constructor);
}

class HooksDefinition {
    constructor(t) {
        this.ee = "define" in t;
        this.Lt = "hydrating" in t;
        this.Dt = "hydrated" in t;
        this._t = "created" in t;
        this.Ft = "binding" in t;
        this.Nt = "bound" in t;
        this.Wt = "attaching" in t;
        this.Xt = "attached" in t;
        this.zt = "detaching" in t;
        this.Yt = "unbinding" in t;
        this.Jt = "dispose" in t;
        this.te = "accept" in t;
    }
}

HooksDefinition.none = new HooksDefinition({});

const Qs = {
    mode: "open"
};

const Ys = "customElement";

const Zs = "customAttribute";

const Js = "synthetic";

const ti = 0;

const ei = 1;

const si = 2;

const ii = 4;

const ni = 8;

const ri = 16;

const oi = 32;

const li = /*@__PURE__*/ at({
    none: ti,
    activating: ei,
    activated: si,
    deactivating: ii,
    deactivated: ni,
    released: ri,
    disposed: oi
});

function stringifyState(t) {
    const e = [];
    if ((t & ei) === ei) {
        e.push("activating");
    }
    if ((t & si) === si) {
        e.push("activated");
    }
    if ((t & ii) === ii) {
        e.push("deactivating");
    }
    if ((t & ni) === ni) {
        e.push("deactivated");
    }
    if ((t & ri) === ri) {
        e.push("released");
    }
    if ((t & oi) === oi) {
        e.push("disposed");
    }
    return e.length === 0 ? "none" : e.join("|");
}

const ai = /*@__PURE__*/ $t("IController");

const hi = /*@__PURE__*/ $t("IHydrationContext");

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

let ci;

let ui;

let fi;

class Refs {}

function getRef(t, e) {
    return t.$au?.[e] ?? null;
}

function setRef(t, e, s) {
    (t.$au ??= new Refs)[e] = s;
}

const di = /*@__PURE__*/ $t("INode");

const mi = /*@__PURE__*/ $t("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(Ri, true)) {
        return t.get(Ri).host;
    }
    return t.get(oe).document;
}))));

const gi = /*@__PURE__*/ $t("IRenderLocation");

const pi = /*@__PURE__*/ $t("CssModules");

const vi = new WeakMap;

function getEffectiveParentNode(t) {
    if (vi.has(t)) {
        return vi.get(t);
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
        const e = findElementControllerFor(t, {
            optional: true
        });
        if (e == null) {
            return null;
        }
        if (e.mountTarget === zs.shadowRoot) {
            return getEffectiveParentNode(e.host);
        }
    }
    return t.parentNode;
}

function setEffectiveParentNode(t, e) {
    if (t.platform !== void 0 && !(t instanceof t.platform.Node)) {
        const s = t.childNodes;
        for (let t = 0, i = s.length; t < i; ++t) {
            vi.set(s[t], e);
        }
    } else {
        vi.set(t, e);
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

const wi = /*@__PURE__*/ $t("IWindow", (t => t.callback((t => t.get(oe).window))));

const bi = /*@__PURE__*/ $t("ILocation", (t => t.callback((t => t.get(wi).location))));

const xi = /*@__PURE__*/ $t("IHistory", (t => t.callback((t => t.get(wi).history))));

const registerHostNode = (t, e, s) => {
    registerResolver(t, e.HTMLElement, registerResolver(t, e.Element, registerResolver(t, di, new k("ElementResolver", s))));
    return t;
};

function customElement(t) {
    return function(e, s) {
        s.addInitializer((function() {
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
        return function(e, s) {
            s.addInitializer((function() {
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
    const e = Dt(Ai, t);
    if (e === void 0) {
        annotateElementMetadata(t, "containerless", true);
        return;
    }
    e.containerless = true;
}

const yi = new WeakMap;

class CustomElementDefinition {
    get kind() {
        return zt;
    }
    constructor(t, e, s, i, n, r, l, a, h, c, u, f, d, m, g, p, v, w, b) {
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
        this.containerless = m;
        this.shadowOptions = g;
        this.hasSlots = p;
        this.enhance = v;
        this.watches = w;
        this.processContent = b;
    }
    static create(t, e = null) {
        if (e === null) {
            const s = t;
            if (isString(s)) {
                throw createMappedError(761, t);
            }
            const i = E("name", s, Bi);
            if (isFunction(s.Type)) {
                e = s.Type;
            } else {
                e = Si(R(i));
            }
            return new CustomElementDefinition(e, i, d(s.aliases), E("key", s, (() => getElementKeyFrom(i))), E("cache", s, returnZero), I("capture", s, e, returnFalse), E("template", s, returnNull), d(s.instructions), d(getElementAnnotation(e, "dependencies"), s.dependencies), E("injectable", s, returnNull), E("needsCompile", s, returnTrue), d(s.surrogates), Vt.from(getElementAnnotation(e, "bindables"), s.bindables), I("containerless", s, e, returnFalse), E("shadowOptions", s, returnNull), E("hasSlots", s, returnFalse), E("enhance", s, returnFalse), E("watches", s, returnEmptyArray), P("processContent", e, returnNull));
        }
        if (isString(t)) {
            return new CustomElementDefinition(e, t, d(getElementAnnotation(e, "aliases"), e.aliases), getElementKeyFrom(t), P("cache", e, returnZero), P("capture", e, returnFalse), P("template", e, returnNull), d(getElementAnnotation(e, "instructions"), e.instructions), d(getElementAnnotation(e, "dependencies"), e.dependencies), P("injectable", e, returnNull), P("needsCompile", e, returnTrue), d(getElementAnnotation(e, "surrogates"), e.surrogates), Vt.from(...Vt.getAll(e), getElementAnnotation(e, "bindables"), e.bindables), P("containerless", e, returnFalse), P("shadowOptions", e, returnNull), P("hasSlots", e, returnFalse), P("enhance", e, returnFalse), d(le.getDefinitions(e), e.watches), P("processContent", e, returnNull));
        }
        const s = E("name", t, Bi);
        return new CustomElementDefinition(e, s, d(getElementAnnotation(e, "aliases"), t.aliases, e.aliases), getElementKeyFrom(s), I("cache", t, e, returnZero), I("capture", t, e, returnFalse), I("template", t, e, returnNull), d(getElementAnnotation(e, "instructions"), t.instructions, e.instructions), d(getElementAnnotation(e, "dependencies"), t.dependencies, e.dependencies), I("injectable", t, e, returnNull), I("needsCompile", t, e, returnTrue), d(getElementAnnotation(e, "surrogates"), t.surrogates, e.surrogates), Vt.from(...Vt.getAll(e), getElementAnnotation(e, "bindables"), e.bindables, t.bindables), I("containerless", t, e, returnFalse), I("shadowOptions", t, e, returnNull), I("hasSlots", t, e, returnFalse), I("enhance", t, e, returnFalse), d(t.watches, le.getDefinitions(e), e.watches), I("processContent", t, e, returnNull));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) {
            return t;
        }
        if (yi.has(t)) {
            return yi.get(t);
        }
        const e = CustomElementDefinition.create(t);
        yi.set(t, e);
        qt(e, e.Type, Ai);
        return e;
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getElementKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : jt(s, s), Wt(s, i), ...n.map((t => Wt(s, getElementKeyFrom(t)))));
        }
    }
    toString() {
        return `au:ce:${this.name}`;
    }
}

const ki = {
    name: undefined,
    searchParents: false,
    optional: false
};

const returnZero = () => 0;

const returnNull = () => null;

const returnFalse = () => false;

const returnTrue = () => true;

const returnEmptyArray = () => b;

const Ci = "custom-element";

const Ai = /*@__PURE__*/ p(Ci);

const getElementKeyFrom = t => `${Ai}:${t}`;

const Bi = /*@__PURE__*/ (t => () => `unnamed-${++t}`)(0);

const annotateElementMetadata = (t, e, s) => {
    qt(s, t, Ot(e));
};

const defineElement = (t, e) => {
    const s = CustomElementDefinition.create(t, e);
    const i = s.Type;
    qt(s, i, Ai, m);
    return i;
};

const isElementType = t => isFunction(t) && (_t(Ai, t) || t.$au?.type === Ci);

const findElementControllerFor = (t, e = ki) => {
    if (e.name === void 0 && e.searchParents !== true) {
        const s = getRef(t, Ai);
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
            const s = getRef(t, Ai);
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
            const t = getRef(s, Ai);
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
        const t = getRef(s, Ai);
        if (t !== null) {
            return t;
        }
        s = getEffectiveParentNode(s);
    }
    throw createMappedError(765, t);
};

const getElementAnnotation = (t, e) => Dt(Ot(e), t);

const getElementDefinition = t => {
    const e = Dt(Ai, t) ?? getDefinitionFromStaticAu(t, Ci, CustomElementDefinition.create);
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
                resolve(e, s) {
                    if (s.has(t, true)) {
                        return s.get(t);
                    } else {
                        return null;
                    }
                }
            };
        }
    };
    return t;
};

const Si = /*@__PURE__*/ function() {
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
        mt(n, "name", t);
        if (i !== e) {
            ht(n.prototype, i);
        }
        return n;
    };
}();

const Ti = at({
    name: Ai,
    keyFrom: getElementKeyFrom,
    isType: isElementType,
    for: findElementControllerFor,
    define: defineElement,
    getDefinition: getElementDefinition,
    annotate: annotateElementMetadata,
    getAnnotation: getElementAnnotation,
    generateName: Bi,
    createInjectable: createElementInjectable,
    generateType: Si,
    find(t, e) {
        const s = t.find(Ci, e);
        return s == null ? null : Dt(Ai, s) ?? getDefinitionFromStaticAu(s, Ci, CustomElementDefinition.create) ?? null;
    }
});

const Ei = /*@__PURE__*/ Ot("processContent");

function processContent(t) {
    return t === void 0 ? function(t, e) {
        if (!e.static || e.kind !== "method") throw createMappedError(766, t);
        e.addInitializer((function() {
            qt(t, this, Ei);
        }));
    } : function(e, s) {
        s.addInitializer((function() {
            if (isString(t) || isSymbol(t)) {
                t = this[t];
            }
            if (!isFunction(t)) throw createMappedError(766, t);
            const e = Dt(Ai, this);
            if (e !== void 0) {
                e.processContent = t;
            } else {
                qt(t, this, Ei);
            }
        }));
        return e;
    };
}

function capture(t) {
    return function(e, s) {
        const i = isFunction(t) ? t : true;
        s.addInitializer((function() {
            annotateElementMetadata(this, "capture", i);
            if (isElementType(this)) {
                getElementDefinition(this).capture = i;
            }
        }));
    };
}

const Ri = /*@__PURE__*/ $t("IAppRoot");

class AppRoot {
    get controller() {
        return this.P;
    }
    constructor(t, e, s, i = false) {
        this.config = t;
        this.container = e;
        this.le = void 0;
        this.ae = i;
        const n = this.host = t.host;
        s.prepare(this);
        registerHostNode(e, this.platform = this.he(e, n), n);
        this.le = T(this.ce("creating"), (() => {
            if (!t.allowActionlessForm !== false) {
                n.addEventListener("submit", (t => {
                    const e = t.target;
                    const s = (e.getAttribute("action")?.length ?? 0) > 0;
                    if (e.tagName === "FORM" && !s) {
                        t.preventDefault();
                    }
                }), false);
            }
            const s = i ? e : e.createChild();
            const r = t.component;
            let l;
            if (isFunction(r)) {
                l = s.invoke(r);
                Ut(r, l);
            } else {
                l = t.component;
            }
            const a = {
                hydrate: false,
                projections: null
            };
            const h = i ? CustomElementDefinition.create({
                name: Bi(),
                template: this.host,
                enhance: true
            }) : void 0;
            const c = this.P = Controller.$el(s, l, n, a, h);
            c.hE(a, null);
            return T(this.ce("hydrating"), (() => {
                c.hS(null);
                return T(this.ce("hydrated"), (() => {
                    c.hC();
                    this.le = void 0;
                }));
            }));
        }));
    }
    activate() {
        return T(this.le, (() => T(this.ce("activating"), (() => T(this.P.activate(this.P, null, void 0), (() => this.ce("activated")))))));
    }
    deactivate() {
        return T(this.ce("deactivating"), (() => T(this.P.deactivate(this.P, null), (() => this.ce("deactivated")))));
    }
    ce(t) {
        const e = this.container;
        const s = this.ae && !e.has(ne, false) ? [] : e.getAll(ne);
        return S(...s.reduce(((e, s) => {
            if (s.slot === t) {
                e.push(s.run());
            }
            return e;
        }), []));
    }
    he(t, e) {
        let s;
        if (!t.has(oe, false)) {
            if (e.ownerDocument.defaultView === null) {
                throw createMappedError(769);
            }
            s = new st(e.ownerDocument.defaultView);
            t.register(Ut(oe, s));
        } else {
            s = t.get(oe);
        }
        return s;
    }
    dispose() {
        this.P?.dispose();
    }
}

const Ii = /*@__PURE__*/ $t("IAurelia");

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
        if (t.has(Ii, true) || t.has(Aurelia, true)) {
            throw createMappedError(768);
        }
        registerResolver(t, Ii, new k("IAurelia", this));
        registerResolver(t, Aurelia, new k("Aurelia", this));
        registerResolver(t, Ri, this.pe = new k("IAppRoot"));
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
        }, t.container ?? this.container.createChild(), new k("IAppRoot"), true);
        return T(e.activate(), (() => e));
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
        return this.me = T(this.stop(), (() => {
            Reflect.set(t.host, "$aurelia", this);
            this.pe.prepare(this.de = t);
            this.ue = true;
            return T(t.activate(), (() => {
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
            return this.ge = T(e.deactivate(), (() => {
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
    ve(t, e, s) {
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
                this.has = this.we;
                break;

              case 1:
                this.has = this.be;
                break;

              default:
                this.has = this.xe;
            }
        } else {
            switch (t.length) {
              case 0:
                this.has = this.ye;
                break;

              case 1:
                this.has = this.ke;
                break;

              default:
                this.has = this.Ce;
            }
        }
    }
    equals(t) {
        return this.chars === t.chars && this.repeat === t.repeat && this.isSymbol === t.isSymbol && this.isInverted === t.isInverted;
    }
    Ce(t) {
        return this.chars.includes(t);
    }
    ke(t) {
        return this.chars === t;
    }
    ye(t) {
        return false;
    }
    xe(t) {
        return !this.chars.includes(t);
    }
    be(t) {
        return this.chars !== t;
    }
    we(t) {
        return true;
    }
}

class Interpretation {
    constructor() {
        this.parts = b;
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
            this.parts = b;
        } else {
            this.Ae = t;
            this.parts = this.Se[t];
        }
    }
    append(t, e) {
        const s = this.Be;
        if (s[t] === undefined) {
            s[t] = e;
        } else {
            s[t] += e;
        }
    }
    next(t) {
        const e = this.Be;
        let s;
        if (e[t] !== undefined) {
            s = this.Se;
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
    get Ae() {
        return this.Te ? this.Ee[0] : null;
    }
    constructor(t, ...e) {
        this.charSpec = t;
        this.Re = [];
        this.Ie = null;
        this.Te = false;
        this.Ee = e;
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
        const s = this.Ee;
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
        let a = 0;
        let h = 0;
        for (;a < n; ++a) {
            l = i[a];
            if (l.charSpec.has(t)) {
                s.push(l);
                r = l.Ee.length;
                h = 0;
                if (l.charSpec.isSymbol) {
                    for (;h < r; ++h) {
                        e.next(l.Ee[h]);
                    }
                } else {
                    for (;h < r; ++h) {
                        e.append(l.Ee[h], t);
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
        const e = this.Pe = t.length;
        const s = this.Le = [];
        let i = 0;
        for (;e > i; ++i) {
            s.push(new CharSpec(t[i], false, false, false));
        }
    }
    eachChar(t) {
        const e = this.Pe;
        const s = this.Le;
        let i = 0;
        for (;e > i; ++i) {
            t(s[i]);
        }
    }
}

class DynamicSegment {
    constructor(t) {
        this.text = "PART";
        this.Me = new CharSpec(t, true, false, true);
    }
    eachChar(t) {
        t(this.Me);
    }
}

class SymbolSegment {
    constructor(t) {
        this.text = t;
        this.Me = new CharSpec(t, false, true, false);
    }
    eachChar(t) {
        t(this.Me);
    }
}

class SegmentTypes {
    constructor() {
        this.statics = 0;
        this.dynamics = 0;
        this.symbols = 0;
    }
}

const Pi = /*@__PURE__*/ $t("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

class SyntaxInterpreter {
    constructor() {
        this.De = new AttrParsingState(null);
        this._e = [ this.De ];
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
            s = this.De;
            i = t[c];
            n = i.pattern;
            r = new SegmentTypes;
            l = this.qe(i, r);
            a = l.length;
            h = t => s = s.append(t, n);
            for (u = 0; a > u; ++u) {
                l[u].eachChar(h);
            }
            s.Ie = r;
            s.Te = true;
            ++c;
        }
    }
    interpret(t) {
        const e = new Interpretation;
        const s = t.length;
        let i = this._e;
        let n = 0;
        let r;
        for (;n < s; ++n) {
            i = this.Fe(i, t.charAt(n), e);
            if (i.length === 0) {
                break;
            }
        }
        i = i.filter(isEndpoint);
        if (i.length > 0) {
            i.sort(sortEndpoint);
            r = i[0];
            if (!r.charSpec.isSymbol) {
                e.next(r.Ae);
            }
            e.pattern = r.Ae;
        }
        return e;
    }
    Fe(t, e, s) {
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
    return t.Te;
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

const Li = /*@__PURE__*/ $t("IAttributePattern");

const Mi = /*@__PURE__*/ $t("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor() {
        this.W = {};
        const t = this.Oe = v(Pi);
        const e = _i.findAll(v(C));
        const s = this.Ee = {};
        const i = e.reduce(((t, e) => {
            const i = getAllPatternDefinitions(e.constructor);
            i.forEach((t => s[t.pattern] = e));
            return t.concat(i);
        }), b);
        t.add(i);
    }
    parse(t, e) {
        let s = this.W[t];
        if (s == null) {
            s = this.W[t] = this.Oe.interpret(t);
        }
        const i = s.pattern;
        if (i == null) {
            return new AttrSyntax(t, e, t, null, null);
        } else {
            return this.Ee[i][i](t, e, s.parts);
        }
    }
}

function attributePattern(...t) {
    return function decorator(e) {
        return _i.define(t, e);
    };
}

const getAllPatternDefinitions = t => Di.get(t) ?? b;

const Di = new WeakMap;

const _i = at({
    name: p("attribute-pattern"),
    define(t, e) {
        Di.set(e, t);
        return x.define(e, (t => {
            jt(Li, e).register(t);
        }));
    },
    getPatternDefinitions: getAllPatternDefinitions,
    findAll: t => t.root.getAll(Li)
});

const qi = /*@__PURE__*/ _i.define([ {
    pattern: "PART.PART",
    symbols: "."
}, {
    pattern: "PART.PART.PART",
    symbols: "."
} ], class DotSeparatedAttributePattern {
    "PART.PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], s[1]);
    }
    "PART.PART.PART"(t, e, s) {
        return new AttrSyntax(t, e, `${s[0]}.${s[1]}`, s[2]);
    }
});

const Fi = /*@__PURE__*/ _i.define([ {
    pattern: "ref",
    symbols: ""
}, {
    pattern: "PART.ref",
    symbols: "."
} ], class RefAttributePattern {
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
});

const Oi = /*@__PURE__*/ _i.define([ {
    pattern: "PART.trigger:PART",
    symbols: ".:"
}, {
    pattern: "PART.capture:PART",
    symbols: ".:"
} ], class EventAttributePattern {
    "PART.trigger:PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "trigger", s);
    }
    "PART.capture:PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "capture", s);
    }
});

const Hi = /*@__PURE__*/ _i.define([ {
    pattern: ":PART",
    symbols: ":"
} ], class ColonPrefixedBindAttributePattern {
    ":PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "bind");
    }
});

const Vi = /*@__PURE__*/ _i.define([ {
    pattern: "@PART",
    symbols: "@"
}, {
    pattern: "@PART:PART",
    symbols: "@:"
} ], class AtPrefixedTriggerAttributePattern {
    "@PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "trigger");
    }
    "@PART:PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "trigger", [ s[0], "trigger", ...s.slice(1) ]);
    }
});

const Ni = /*@__PURE__*/ _i.define([ {
    pattern: "...$attrs",
    symbols: ""
} ], class SpreadAttributePattern {
    "...$attrs"(t, e, s) {
        return new AttrSyntax(t, e, "", "...$attrs");
    }
});

function bindingCommand(t) {
    return function(e, s) {
        s.addInitializer((function() {
            Wi.define(t, e);
        }));
        return e;
    };
}

class BindingCommandDefinition {
    constructor(t, e, s, i) {
        this.Type = t;
        this.name = e;
        this.aliases = s;
        this.key = i;
    }
    static create(t, e) {
        let s;
        let i;
        if (isString(t)) {
            s = t;
            i = {
                name: s
            };
        } else {
            s = t.name;
            i = t;
        }
        return new BindingCommandDefinition(e, f(getCommandAnnotation(e, "name"), s), d(getCommandAnnotation(e, "aliases"), i.aliases, e.aliases), getCommandKeyFrom(s));
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getCommandKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : jt(s, s), Wt(s, i), ...n.map((t => Wt(s, getCommandKeyFrom(t)))));
        }
    }
}

const $i = "binding-command";

const ji = /*@__PURE__*/ p($i);

const getCommandKeyFrom = t => `${ji}:${t}`;

const getCommandAnnotation = (t, e) => Dt(Ot(e), t);

const Wi = at({
    name: ji,
    keyFrom: getCommandKeyFrom,
    define(t, e) {
        const s = BindingCommandDefinition.create(t, e);
        const i = s.Type;
        qt(s, i, ji, m);
        return i;
    },
    getAnnotation: getCommandAnnotation,
    find(t, e) {
        const s = t.find($i, e);
        return s == null ? null : Dt(ji, s) ?? getDefinitionFromStaticAu(s, $i, BindingCommandDefinition.create) ?? null;
    },
    get(t, e) {
        return t.get(g(getCommandKeyFrom(e)));
    }
});

class OneTimeBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, e, s) {
        const i = t.attr;
        let n = i.target;
        let r = t.attr.rawValue;
        if (t.bindable == null) {
            n = s.map(t.node, n) ?? L(n);
        } else {
            if (r === "" && t.def.kind === zt) {
                r = L(n);
            }
            n = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, wt), n, Rt);
    }
}

OneTimeBindingCommand.$au = {
    type: $i,
    name: "one-time"
};

class ToViewBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, e, s) {
        const i = t.attr;
        let n = i.target;
        let r = t.attr.rawValue;
        if (t.bindable == null) {
            n = s.map(t.node, n) ?? L(n);
        } else {
            if (r === "" && t.def.kind === zt) {
                r = L(n);
            }
            n = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, wt), n, It);
    }
}

ToViewBindingCommand.$au = {
    type: $i,
    name: "to-view"
};

class FromViewBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, e, s) {
        const i = t.attr;
        let n = i.target;
        let r = i.rawValue;
        if (t.bindable == null) {
            n = s.map(t.node, n) ?? L(n);
        } else {
            if (r === "" && t.def.kind === zt) {
                r = L(n);
            }
            n = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, wt), n, Pt);
    }
}

FromViewBindingCommand.$au = {
    type: $i,
    name: "from-view"
};

class TwoWayBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, e, s) {
        const i = t.attr;
        let n = i.target;
        let r = i.rawValue;
        if (t.bindable == null) {
            n = s.map(t.node, n) ?? L(n);
        } else {
            if (r === "" && t.def.kind === zt) {
                r = L(n);
            }
            n = t.bindable.name;
        }
        return new PropertyBindingInstruction(e.parse(r, wt), n, Lt);
    }
}

TwoWayBindingCommand.$au = {
    type: $i,
    name: "two-way"
};

class DefaultBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, e, s) {
        const i = t.attr;
        const n = t.bindable;
        let r;
        let l;
        let a = i.target;
        let h = i.rawValue;
        if (n == null) {
            l = s.isTwoWay(t.node, a) ? Lt : It;
            a = s.map(t.node, a) ?? L(a);
        } else {
            if (h === "" && t.def.kind === zt) {
                h = L(a);
            }
            r = t.def.defaultBindingMode;
            l = n.mode === Et || n.mode == null ? r == null || r === Et ? It : r : n.mode;
            a = n.name;
        }
        return new PropertyBindingInstruction(e.parse(h, wt), a, l);
    }
}

DefaultBindingCommand.$au = {
    type: $i,
    name: "bind"
};

class ForBindingCommand {
    constructor() {
        this.He = v(Mi);
    }
    get ignoreAttr() {
        return false;
    }
    build(t, e) {
        const s = t.bindable === null ? L(t.attr.target) : t.bindable.name;
        const i = e.parse(t.attr.rawValue, pt);
        let n = b;
        if (i.semiIdx > -1) {
            const e = t.attr.rawValue.slice(i.semiIdx + 1);
            const s = e.indexOf(":");
            if (s > -1) {
                const t = e.slice(0, s).trim();
                const i = e.slice(s + 1).trim();
                const r = this.He.parse(t, i);
                n = [ new MultiAttrInstruction(i, r.target, r.command) ];
            }
        }
        return new IteratorBindingInstruction(i, s, n);
    }
}

ForBindingCommand.$au = {
    type: $i,
    name: "for"
};

class TriggerBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, vt), t.attr.target, false, t.attr.parts?.[2] ?? null);
    }
}

TriggerBindingCommand.$au = {
    type: $i,
    name: "trigger"
};

class CaptureBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, vt), t.attr.target, true, t.attr.parts?.[2] ?? null);
    }
}

CaptureBindingCommand.$au = {
    type: $i,
    name: "capture"
};

class AttrBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new AttributeBindingInstruction(t.attr.target, e.parse(t.attr.rawValue, wt), t.attr.target);
    }
}

AttrBindingCommand.$au = {
    type: $i,
    name: "attr"
};

class StyleBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new AttributeBindingInstruction("style", e.parse(t.attr.rawValue, wt), t.attr.target);
    }
}

StyleBindingCommand.$au = {
    type: $i,
    name: "style"
};

class ClassBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new AttributeBindingInstruction("class", e.parse(t.attr.rawValue, wt), t.attr.target);
    }
}

ClassBindingCommand.$au = {
    type: $i,
    name: "class"
};

class RefBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new RefBindingInstruction(e.parse(t.attr.rawValue, wt), t.attr.target);
    }
}

RefBindingCommand.$au = {
    type: $i,
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
    type: $i,
    name: "...$attrs"
};

const Ui = /*@__PURE__*/ $t("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

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
        t.register(jt(this, this), Wt(this, Ui));
    }
    constructor() {
        this.Ve = ht(createLookup(), {
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
        this.Ne = o("a altGlyph animate animateColor circle clipPath defs ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feFlood feGaussianBlur feImage feMerge feMorphology feOffset feSpecularLighting feTile feTurbulence filter font foreignObject g glyph glyphRef image line linearGradient marker mask missing-glyph path pattern polygon polyline radialGradient rect stop svg switch symbol text textPath tref tspan use");
        this.$e = o("alignment-baseline baseline-shift clip-path clip-rule clip color-interpolation-filters color-interpolation color-profile color-rendering color cursor direction display dominant-baseline enable-background fill-opacity fill-rule fill filter flood-color flood-opacity font-family font-size-adjust font-size font-stretch font-style font-variant font-weight glyph-orientation-horizontal glyph-orientation-vertical image-rendering kerning letter-spacing lighting-color marker-end marker-mid marker-start mask opacity overflow pointer-events shape-rendering stop-color stop-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width stroke text-anchor text-decoration text-rendering unicode-bidi visibility word-spacing writing-mode");
        const t = v(oe);
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
        return this.Ne[t.nodeName] === true && this.$e[e] === true || this.Ve[t.nodeName]?.[e] === true;
    }
}

const zi = /*@__PURE__*/ $t("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    constructor() {
        this.fns = [];
        this.je = createLookup();
        this.We = createLookup();
        this.svg = v(Ui);
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
            s = this.je[i] ??= createLookup();
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

const Gi = createLookup();

class AttributeNSAccessor {
    static forNs(t) {
        return Gi[t] ??= new AttributeNSAccessor(t);
    }
    constructor(t) {
        this.ns = t;
        this.type = kt | Ct;
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

(() => {
    mixinNoopSubscribable(AttributeNSAccessor);
})();

class DataAttributeAccessor {
    constructor() {
        this.type = kt | Ct;
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

(() => {
    mixinNoopSubscribable(DataAttributeAccessor);
})();

const Ki = /*@__PURE__*/ new DataAttributeAccessor;

class SelectValueObserver {
    static Ue(t) {
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
                e[e.length] = lt.call(n, "model") ? n.model : n.value;
            }
            ++i;
        }
        return e;
    }
    static ze(t, e) {
        return t === e;
    }
    constructor(t, e, s, i) {
        this.type = kt | yt | Ct;
        this.v = void 0;
        this.ov = void 0;
        this.Ge = false;
        this.Ke = void 0;
        this.Xe = void 0;
        this.iO = false;
        this.ft = false;
        this.ut = t;
        this.oL = i;
        this.cf = s;
    }
    getValue() {
        return this.iO ? this.v : this.ut.multiple ? SelectValueObserver.Ue(this.ut.options) : this.ut.value;
    }
    setValue(t) {
        this.ov = this.v;
        this.v = t;
        this.Ge = t !== this.ov;
        this.Qe(t instanceof Array ? t : null);
        this.bt();
    }
    bt() {
        if (this.Ge) {
            this.Ge = false;
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
        const i = e.matcher ?? SelectValueObserver.ze;
        const n = e.options;
        let r = n.length;
        while (r-- > 0) {
            const e = n[r];
            const l = lt.call(e, "model") ? e.model : e.value;
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
            const l = t.matcher || SelectValueObserver.ze;
            const a = [];
            while (n < s) {
                r = e[n];
                if (r.selected) {
                    a.push(lt.call(r, "model") ? r.model : r.value);
                }
                ++n;
            }
            let h;
            n = 0;
            while (n < i.length) {
                h = i[n];
                if (a.findIndex((t => !!l(h, t))) === -1) {
                    i.splice(n, 1);
                } else {
                    ++n;
                }
            }
            n = 0;
            while (n < a.length) {
                h = a[n];
                if (i.findIndex((t => !!l(h, t))) === -1) {
                    i.push(h);
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
                r = lt.call(l, "model") ? l.model : l.value;
                break;
            }
            ++n;
        }
        this.ov = this.v;
        this.v = r;
        return true;
    }
    dt() {
        (this.Xe = createMutationObserver(this.ut, this.Ye.bind(this))).observe(this.ut, {
            childList: true,
            subtree: true,
            characterData: true
        });
        this.Qe(this.v instanceof Array ? this.v : null);
        this.iO = true;
    }
    gt() {
        this.Xe.disconnect();
        this.Ke?.unsubscribe(this);
        this.Xe = this.Ke = void 0;
        this.iO = false;
    }
    Qe(t) {
        this.Ke?.unsubscribe(this);
        this.Ke = void 0;
        if (t != null) {
            if (!this.ut.multiple) {
                throw createError$1(`AUR0654`);
            }
            (this.Ke = this.oL.getArrayObserver(t)).subscribe(this);
        }
    }
    handleEvent() {
        const t = this.syncValue();
        if (t) {
            this.Ze();
        }
    }
    Ye(t) {
        this.syncOptions();
        const e = this.syncValue();
        if (e) {
            this.Ze();
        }
    }
    Ze() {
        const t = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, t);
    }
}

(() => {
    mixinNodeObserverUseConfig(SelectValueObserver);
    N(SelectValueObserver, null);
})();

const Xi = "--";

class StyleAttributeAccessor {
    constructor(t) {
        this.obj = t;
        this.type = kt | Ct;
        this.v = "";
        this.ov = "";
        this.styles = {};
        this.version = 0;
        this.Ge = false;
    }
    getValue() {
        return this.obj.style.cssText;
    }
    setValue(t) {
        this.v = t;
        this.Ge = t !== this.ov;
        this.bt();
    }
    Je(t) {
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
    ts(t) {
        let e;
        let s;
        const i = [];
        for (s in t) {
            e = t[s];
            if (e == null) {
                continue;
            }
            if (isString(e)) {
                if (s.startsWith(Xi)) {
                    i.push([ s, e ]);
                    continue;
                }
                i.push([ a(s), e ]);
                continue;
            }
            i.push(...this.es(e));
        }
        return i;
    }
    ss(t) {
        const e = t.length;
        if (e > 0) {
            const s = [];
            let i = 0;
            for (;e > i; ++i) {
                s.push(...this.es(t[i]));
            }
            return s;
        }
        return b;
    }
    es(t) {
        if (isString(t)) {
            return this.Je(t);
        }
        if (t instanceof Array) {
            return this.ss(t);
        }
        if (t instanceof Object) {
            return this.ts(t);
        }
        return b;
    }
    bt() {
        if (this.Ge) {
            this.Ge = false;
            const t = this.v;
            const e = this.styles;
            const s = this.es(t);
            let i;
            let n = this.version;
            this.ov = t;
            let r;
            let l;
            let a;
            let h = 0;
            const c = s.length;
            for (;h < c; ++h) {
                r = s[h];
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
                if (!lt.call(e, i) || e[i] !== n) {
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

(() => {
    mixinNoopSubscribable(StyleAttributeAccessor);
})();

class ValueAttributeObserver {
    constructor(t, e, s) {
        this.type = kt | yt | Ct;
        this.v = "";
        this.ov = "";
        this.Ge = false;
        this.ft = false;
        this.ut = t;
        this.k = e;
        this.cf = s;
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
        this.Ge = true;
        if (!this.cf.readonly) {
            this.bt();
        }
    }
    bt() {
        if (this.Ge) {
            this.Ge = false;
            this.ut[this.k] = this.v ?? this.cf.default;
            this.Ze();
        }
    }
    handleEvent() {
        this.ov = this.v;
        this.v = this.ut[this.k];
        if (this.ov !== this.v) {
            this.Ge = false;
            this.Ze();
        }
    }
    dt() {
        this.v = this.ov = this.ut[this.k];
    }
    Ze() {
        const t = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, t);
    }
}

(() => {
    mixinNodeObserverUseConfig(ValueAttributeObserver);
    N(ValueAttributeObserver, null);
})();

const Qi = "http://www.w3.org/1999/xlink";

const Yi = "http://www.w3.org/XML/1998/namespace";

const Zi = "http://www.w3.org/2000/xmlns/";

const Ji = ht(createLookup(), {
    "xlink:actuate": [ "actuate", Qi ],
    "xlink:arcrole": [ "arcrole", Qi ],
    "xlink:href": [ "href", Qi ],
    "xlink:role": [ "role", Qi ],
    "xlink:show": [ "show", Qi ],
    "xlink:title": [ "title", Qi ],
    "xlink:type": [ "type", Qi ],
    "xml:lang": [ "lang", Yi ],
    "xml:space": [ "space", Yi ],
    xmlns: [ "xmlns", Zi ],
    "xmlns:xlink": [ "xlink", Zi ]
});

const tn = new z;

tn.type = kt | Ct;

class NodeObserverLocator {
    static register(t) {
        t.register(jt(this, this), Wt(this, G));
    }
    constructor() {
        this.allowDirtyCheck = true;
        this.rs = createLookup();
        this.os = createLookup();
        this.ls = createLookup();
        this.cs = createLookup();
        this.us = v(M);
        this.p = v(oe);
        this.ds = v(K);
        this.svg = v(Ui);
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
        const s = {
            events: [ "change", "input", "blur", "keyup", "paste" ],
            default: ""
        };
        const i = {
            events: [ "scroll" ],
            default: 0
        };
        this.useConfigGlobal({
            scrollTop: i,
            scrollLeft: i,
            textContent: s,
            innerHTML: s
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
        const i = this.rs;
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
        const s = this.os;
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
    getAccessor(t, e, s) {
        if (e in this.cs || e in (this.ls[t.tagName] ?? D)) {
            return this.getObserver(t, e, s);
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
            return Ki;

          default:
            {
                const s = Ji[e];
                if (s !== undefined) {
                    return AttributeNSAccessor.forNs(s[1]);
                }
                if (isDataAttribute(t, e, this.svg)) {
                    return Ki;
                }
                return tn;
            }
        }
    }
    overrideAccessor(t, e) {
        let s;
        if (isString(t)) {
            s = this.ls[t] ??= createLookup();
            s[e] = true;
        } else {
            for (const e in t) {
                for (const i of t[e]) {
                    s = this.ls[e] ??= createLookup();
                    s[i] = true;
                }
            }
        }
    }
    overrideAccessorGlobal(...t) {
        for (const e of t) {
            this.cs[e] = true;
        }
    }
    getNodeObserverConfig(t, e) {
        return this.rs[t.tagName]?.[e] ?? this.os[e];
    }
    getNodeObserver(t, e, s) {
        const i = this.rs[t.tagName]?.[e] ?? this.os[e];
        let n;
        if (i != null) {
            n = new (i.type ?? ValueAttributeObserver)(t, e, i, s, this.us);
            if (!n.doNotCache) {
                X(t)[e] = n;
            }
            return n;
        }
        return null;
    }
    getObserver(t, e, s) {
        switch (e) {
          case "class":
            return new ClassAttributeAccessor(t);

          case "css":
          case "style":
            return new StyleAttributeAccessor(t);
        }
        const i = this.getNodeObserver(t, e, s);
        if (i != null) {
            return i;
        }
        const n = Ji[e];
        if (n !== undefined) {
            return AttributeNSAccessor.forNs(n[1]);
        }
        if (isDataAttribute(t, e, this.svg)) {
            return Ki;
        }
        if (e in t.constructor.prototype) {
            if (this.allowDirtyCheck) {
                return this.ds.createProperty(t, e);
            }
            throw createMappedError(652, e);
        } else {
            return new Q(t, e);
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
        this.type = kt | yt | Ct;
        this.v = void 0;
        this.ov = void 0;
        this.gs = void 0;
        this.ps = void 0;
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
        this.ws();
        this.bs();
        this.Ze();
    }
    handleCollectionChange() {
        this.bs();
    }
    handleChange(t, e) {
        this.bs();
    }
    bs() {
        const t = this.v;
        const e = this.ut;
        const s = lt.call(e, "model") ? e.model : e.value;
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
        const s = lt.call(e, "model") ? e.model : e.value;
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
        this.Ze();
    }
    dt() {
        this.ws();
    }
    gt() {
        this.gs?.unsubscribe(this);
        this.ps?.unsubscribe(this);
        this.gs = this.ps = void 0;
    }
    Ze() {
        en = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, en);
    }
    ws() {
        const t = this.ut;
        (this.ps ??= t.$observers?.model ?? t.$observers?.value)?.subscribe(this);
        this.gs?.unsubscribe(this);
        this.gs = void 0;
        if (t.type === "checkbox") {
            (this.gs = getCollectionObserver(this.v, this.oL))?.subscribe(this);
        }
    }
}

(() => {
    mixinNodeObserverUseConfig(CheckedObserver);
    N(CheckedObserver, null);
})();

let en = void 0;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) {
            throw createMappedError(9994, e);
        }
        e.useTargetObserver(Ki);
    }
}

AttrBindingBehavior.$au = {
    type: Xt,
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
    type: Xt,
    name: "self"
};

class UpdateTriggerBindingBehavior {
    constructor() {
        this.oL = v($);
        this.xs = v(G);
    }
    bind(t, e, ...s) {
        if (!(this.xs instanceof NodeObserverLocator)) {
            throw createMappedError(9993);
        }
        if (s.length === 0) {
            throw createMappedError(802);
        }
        if (!(e instanceof PropertyBinding) || !(e.mode & Pt)) {
            throw createMappedError(803);
        }
        const i = this.xs.getNodeObserverConfig(e.target, e.targetProperty);
        if (i == null) {
            throw createMappedError(9992, e);
        }
        const n = this.xs.getNodeObserver(e.target, e.targetProperty, this.oL);
        n.useConfig({
            readonly: i.readonly,
            default: i.default,
            events: s
        });
        e.useTargetObserver(n);
    }
}

UpdateTriggerBindingBehavior.$au = {
    type: Xt,
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
        this.ys = false;
        this.ks = 0;
        this.Cs = v(Re);
        this.l = v(gi);
    }
    attaching(t, e) {
        return this.As(this.value);
    }
    detaching(t, e) {
        this.ys = true;
        return T(this.pending, (() => {
            this.ys = false;
            this.pending = void 0;
            void this.view?.deactivate(t, this.$controller);
        }));
    }
    valueChanged(t, e) {
        if (!this.$controller.isActive) return;
        t = !!t;
        e = !!e;
        if (t !== e) return this.As(t);
    }
    As(t) {
        const e = this.view;
        const s = this.$controller;
        const i = this.ks++;
        const isCurrent = () => !this.ys && this.ks === i + 1;
        let n;
        return T(this.pending, (() => this.pending = T(e?.deactivate(e, s), (() => {
            if (!isCurrent()) {
                return;
            }
            if (t) {
                n = this.view = this.ifView = this.cache && this.ifView != null ? this.ifView : this.Cs.create();
            } else {
                n = this.view = this.elseView = this.cache && this.elseView != null ? this.elseView : this.elseFactory?.create();
            }
            if (n == null) {
                return;
            }
            n.setLocation(this.l);
            return T(n.activate(n, s, s.scope), (() => {
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
    type: ae,
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
        this.f = v(Re);
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

Else.$au = {
    type: "custom-attribute",
    name: "else",
    isTemplateController: true
};

function dispose(t) {
    t.dispose();
}

const sn = [ "BindingBehavior", "ValueConverter" ];

class Repeat {
    constructor(t, e, s, i, n) {
        this.views = [];
        this.Bs = [];
        this.key = null;
        this.Ss = new Map;
        this.Ts = new Map;
        this.Es = void 0;
        this.Rs = false;
        this.Is = false;
        this.Ps = null;
        this.Ls = void 0;
        this.Ms = false;
        const r = t.props[0].props[0];
        if (r !== void 0) {
            const {to: t, value: s, command: i} = r;
            if (t === "key") {
                if (i === null) {
                    this.key = s;
                } else if (i === "bind") {
                    this.key = e.parse(s, wt);
                } else {
                    throw createMappedError(775, i);
                }
            } else {
                throw createMappedError(776, t);
            }
        }
        this.l = s;
        this.Ds = i;
        this.f = n;
    }
    binding(t, e) {
        const s = this.Ds.bindings;
        const i = s.length;
        let n = void 0;
        let r;
        let l = 0;
        for (;i > l; ++l) {
            n = s[l];
            if (n.target === this && n.targetProperty === "items") {
                r = this.forOf = n.ast;
                this._s = n;
                let t = r.iterable;
                while (t != null && sn.includes(t.$kind)) {
                    t = t.expression;
                    this.Rs = true;
                }
                this.Ps = t;
                break;
            }
        }
        this.qs();
        const a = r.declaration;
        if (!(this.Ms = a.$kind === "ArrayDestructuring" || a.$kind === "ObjectDestructuring")) {
            this.local = Bt(a, this.$controller.scope, n, null);
        }
    }
    attaching(t, e) {
        this.Fs();
        return this.Os(t);
    }
    detaching(t, e) {
        this.qs();
        return this.Hs(t);
    }
    unbinding(t, e) {
        this.Ts.clear();
        this.Ss.clear();
    }
    itemsChanged() {
        if (!this.$controller.isActive) {
            return;
        }
        this.qs();
        this.Fs();
        this.Vs(this.items, void 0);
    }
    handleCollectionChange(t, e) {
        const s = this.$controller;
        if (!s.isActive) {
            return;
        }
        if (this.Rs) {
            if (this.Is) {
                return;
            }
            this.Is = true;
            this.items = Bt(this.forOf.iterable, s.scope, this._s, null);
            this.Is = false;
            return;
        }
        this.Fs();
        this.Vs(t, e);
    }
    Vs(t, e) {
        const s = this.views;
        this.Bs = s.slice();
        const i = s.length;
        const n = this.key;
        const r = n !== null;
        if (r || e === void 0) {
            const t = this.local;
            const l = this.Ls;
            const a = l.length;
            const h = this.forOf;
            const c = h.declaration;
            const u = this._s;
            const f = this.Ms;
            e = Y(a);
            let d = 0;
            if (i === 0) {
                for (;d < a; ++d) {
                    e[d] = -2;
                }
            } else if (a === 0) {
                if (f) {
                    for (d = 0; d < i; ++d) {
                        e.deletedIndices.push(d);
                        e.deletedItems.push(Bt(c, s[d].scope, u, null));
                    }
                } else {
                    for (d = 0; d < i; ++d) {
                        e.deletedIndices.push(d);
                        e.deletedItems.push(s[d].scope.bindingContext[t]);
                    }
                }
            } else {
                const m = Array(i);
                if (f) {
                    for (d = 0; d < i; ++d) {
                        m[d] = Bt(c, s[d].scope, u, null);
                    }
                } else {
                    for (d = 0; d < i; ++d) {
                        m[d] = s[d].scope.bindingContext[t];
                    }
                }
                let g;
                let p;
                let v;
                let w;
                let b = 0;
                const x = i - 1;
                const y = a - 1;
                const k = new Map;
                const C = new Map;
                const A = this.Ss;
                const B = this.Ts;
                const S = this.$controller.scope;
                d = 0;
                t: {
                    while (true) {
                        if (r) {
                            g = m[d];
                            p = l[d];
                            v = getKeyValue(A, n, g, getScope(B, g, h, S, u, t, f), u);
                            w = getKeyValue(A, n, p, getScope(B, p, h, S, u, t, f), u);
                        } else {
                            g = v = ensureUnique(m[d], d);
                            p = w = ensureUnique(l[d], d);
                        }
                        if (v !== w) {
                            A.set(g, v);
                            A.set(p, w);
                            break;
                        }
                        ++d;
                        if (d > x || d > y) {
                            break t;
                        }
                    }
                    if (x !== y) {
                        break t;
                    }
                    b = y;
                    while (true) {
                        if (r) {
                            g = m[b];
                            p = l[b];
                            v = getKeyValue(A, n, g, getScope(B, g, h, S, u, t, f), u);
                            w = getKeyValue(A, n, p, getScope(B, p, h, S, u, t, f), u);
                        } else {
                            g = v = ensureUnique(m[d], d);
                            p = w = ensureUnique(l[d], d);
                        }
                        if (v !== w) {
                            A.set(g, v);
                            A.set(p, w);
                            break;
                        }
                        --b;
                        if (d > b) {
                            break t;
                        }
                    }
                }
                const T = d;
                const E = d;
                for (d = E; d <= y; ++d) {
                    if (A.has(p = r ? l[d] : ensureUnique(l[d], d))) {
                        w = A.get(p);
                    } else {
                        w = r ? getKeyValue(A, n, p, getScope(B, p, h, S, u, t, f), u) : p;
                        A.set(p, w);
                    }
                    C.set(w, d);
                }
                for (d = T; d <= x; ++d) {
                    if (A.has(g = r ? m[d] : ensureUnique(m[d], d))) {
                        v = A.get(g);
                    } else {
                        v = r ? getKeyValue(A, n, g, s[d].scope, u) : g;
                    }
                    k.set(v, d);
                    if (C.has(v)) {
                        e[C.get(v)] = d;
                    } else {
                        e.deletedIndices.push(d);
                        e.deletedItems.push(g);
                    }
                }
                for (d = E; d <= y; ++d) {
                    if (!k.has(A.get(r ? l[d] : ensureUnique(l[d], d)))) {
                        e[d] = -2;
                    }
                }
                k.clear();
                C.clear();
            }
        }
        if (e === void 0) {
            const t = T(this.Hs(null), (() => this.Os(null)));
            if (isPromise(t)) {
                t.catch(rethrow);
            }
        } else {
            if (e.deletedIndices.length > 0) {
                const t = T(this.Ns(e), (() => this.$s(i, e)));
                if (isPromise(t)) {
                    t.catch(rethrow);
                }
            } else {
                this.$s(i, e);
            }
        }
    }
    qs() {
        const t = this.$controller.scope;
        let e = this.js;
        let s = this.Rs;
        let i;
        if (s) {
            e = this.js = Bt(this.Ps, t, this._s, null) ?? null;
            s = this.Rs = !dt(this.items, e);
        }
        const n = this.Es;
        if (this.$controller.isActive) {
            i = this.Es = Z(s ? e : this.items);
            if (n !== i) {
                n?.unsubscribe(this);
                i?.subscribe(this);
            }
        } else {
            n?.unsubscribe(this);
            this.Es = undefined;
        }
    }
    Fs() {
        const {items: t} = this;
        if (isArray(t)) {
            this.Ls = t;
            return;
        }
        const e = [];
        iterate(t, ((t, s) => {
            e[s] = t;
        }));
        this.Ls = e;
    }
    Os(t) {
        let e = void 0;
        let s;
        let i;
        let n;
        const {$controller: r, f: l, local: a, l: h, items: c, Ts: u, _s: f, forOf: d, Ms: m} = this;
        const g = r.scope;
        const p = getCount(c);
        const v = this.views = Array(p);
        iterate(c, ((c, w) => {
            i = v[w] = l.create().setLocation(h);
            i.nodes.unlink();
            n = getScope(u, c, d, g, f, a, m);
            setContextualProperties(n.overrideContext, w, p);
            s = i.activate(t ?? i, r, n);
            if (isPromise(s)) {
                (e ?? (e = [])).push(s);
            }
        }));
        if (e !== void 0) {
            return e.length === 1 ? e[0] : Promise.all(e);
        }
    }
    Hs(t) {
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
    Ns(t) {
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
    $s(t, e) {
        let s = void 0;
        let i;
        let n;
        let r;
        let l = 0;
        const {$controller: a, f: h, local: c, Ls: u, l: f, views: d, Ms: m, _s: g, Ts: p, Bs: v, forOf: w} = this;
        const b = e.length;
        for (;b > l; ++l) {
            if (e[l] === -2) {
                n = h.create();
                d.splice(l, 0, n);
            }
        }
        if (d.length !== b) {
            throw createMappedError(814, [ d.length, b ]);
        }
        const x = a.scope;
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
        const B = w.declaration;
        let S;
        let T = A - 1;
        l = y - 1;
        for (;l >= 0; --l) {
            n = d[l];
            S = d[l + 1];
            n.nodes.link(S?.nodes ?? f);
            if (e[l] === -2) {
                r = getScope(p, u[l], w, x, g, c, m);
                setContextualProperties(r.overrideContext, l, y);
                n.setLocation(f);
                i = n.activate(n, a, r);
                if (isPromise(i)) {
                    (s ?? (s = [])).push(i);
                }
            } else if (T < 0 || A === 1 || l !== C[T]) {
                if (m) {
                    At(B, n.scope, g, u[l]);
                } else {
                    n.scope.bindingContext[c] = u[l];
                }
                setContextualProperties(n.scope.overrideContext, l, y);
                n.nodes.insertBefore(n.location);
            } else {
                if (m) {
                    At(B, n.scope, g, u[l]);
                } else {
                    n.scope.bindingContext[c] = u[l];
                }
                if (t !== y) {
                    setContextualProperties(n.scope.overrideContext, l, y);
                }
                --T;
            }
        }
        if (s !== void 0) {
            return s.length === 1 ? s[0] : Promise.all(s);
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

Repeat.$au = {
    type: ae,
    name: "repeat",
    isTemplateController: true,
    bindables: [ "items" ]
};

Repeat.inject = [ ns, e, gi, ai, Re ];

let nn = 16;

let rn = new Int32Array(nn);

let on = new Int32Array(nn);

function longestIncreasingSubsequence(t) {
    const e = t.length;
    if (e > nn) {
        nn = e;
        rn = new Int32Array(e);
        on = new Int32Array(e);
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
            l = rn[s];
            n = t[l];
            if (n !== -2 && n < i) {
                on[r] = l;
                rn[++s] = r;
                continue;
            }
            a = 0;
            h = s;
            while (a < h) {
                c = a + h >> 1;
                n = t[rn[c]];
                if (n !== -2 && n < i) {
                    a = c + 1;
                } else {
                    h = c;
                }
            }
            n = t[rn[a]];
            if (i < n || n === -2) {
                if (a > 0) {
                    on[r] = rn[a - 1];
                }
                rn[a] = r;
            }
        }
    }
    r = ++s;
    const u = new Int32Array(r);
    i = rn[s - 1];
    while (s-- > 0) {
        u[s] = i;
        i = on[i];
    }
    while (r-- > 0) rn[r] = 0;
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

const ln = ot.toString;

const getCount = t => {
    switch (ln.call(t)) {
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
    switch (ln.call(t)) {
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

const getKeyValue = (t, e, s, i, n) => {
    let r = t.get(s);
    if (r === void 0) {
        if (typeof e === "string") {
            r = s[e];
        } else {
            r = Bt(e, i, n, null);
        }
        t.set(s, r);
    }
    return r;
};

const getScope = (t, e, s, i, n, r, l) => {
    let a = t.get(e);
    if (a === void 0) {
        if (l) {
            At(s.declaration, a = Scope.fromParent(i, new BindingContext), n, e);
        } else {
            a = Scope.fromParent(i, new BindingContext(r, e));
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
        this.view = v(Re).create().setLocation(v(gi));
    }
    valueChanged(t, e) {
        const s = this.$controller;
        const i = this.view.bindings;
        let n;
        let r = 0, l = 0;
        if (s.isActive && i != null) {
            n = Scope.fromParent(s.scope, t === void 0 ? {} : t);
            for (l = i.length; l > r; ++r) {
                i[r].bind(n);
            }
        }
    }
    attaching(t, e) {
        const {$controller: s, value: i} = this;
        const n = Scope.fromParent(s.scope, i === void 0 ? {} : i);
        return this.view.activate(t, s, n);
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
    type: ae,
    name: "with",
    isTemplateController: true,
    bindables: [ "value" ]
};

class Switch {
    constructor() {
        this.cases = [];
        this.activeCases = [];
        this.promise = void 0;
        this.f = v(Re);
        this.l = v(gi);
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
        this.queue((() => this.Ws(t)));
    }
    Ws(t) {
        const e = t.isMatch(this.value);
        const s = this.activeCases;
        const i = s.length;
        if (!e) {
            if (i > 0 && s[0].id === t.id) {
                return this.Us(null);
            }
            return;
        }
        if (i > 0 && s[0].id < t.id) {
            return;
        }
        const n = [];
        let r = t.fallThrough;
        if (!r) {
            n.push(t);
        } else {
            const e = this.cases;
            const s = e.indexOf(t);
            for (let t = s, i = e.length; t < i && r; t++) {
                const s = e[t];
                n.push(s);
                r = s.fallThrough;
            }
        }
        return T(this.Us(null, n), (() => {
            this.activeCases = n;
            return this.zs(null);
        }));
    }
    swap(t, e) {
        const s = [];
        let i = false;
        for (const t of this.cases) {
            if (i || t.isMatch(e)) {
                s.push(t);
                i = t.fallThrough;
            }
            if (s.length > 0 && !i) {
                break;
            }
        }
        const n = this.defaultCase;
        if (s.length === 0 && n !== void 0) {
            s.push(n);
        }
        return T(this.activeCases.length > 0 ? this.Us(t, s) : void 0, (() => {
            this.activeCases = s;
            if (s.length === 0) {
                return;
            }
            return this.zs(t);
        }));
    }
    zs(t) {
        const e = this.$controller;
        if (!e.isActive) {
            return;
        }
        const s = this.activeCases;
        const i = s.length;
        if (i === 0) {
            return;
        }
        const n = e.scope;
        if (i === 1) {
            return s[0].activate(t, n);
        }
        return S(...s.map((e => e.activate(t, n))));
    }
    Us(t, e = []) {
        const s = this.activeCases;
        const i = s.length;
        if (i === 0) {
            return;
        }
        if (i === 1) {
            const i = s[0];
            if (!e.includes(i)) {
                s.length = 0;
                return i.deactivate(t);
            }
            return;
        }
        return T(S(...s.reduce(((s, i) => {
            if (!e.includes(i)) {
                s.push(i.deactivate(t));
            }
            return s;
        }), [])), (() => {
            s.length = 0;
        }));
    }
    queue(t) {
        const e = this.promise;
        let s = void 0;
        s = this.promise = T(T(e, t), (() => {
            if (this.promise === s) {
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
    type: ae,
    name: "switch",
    isTemplateController: true,
    bindables: [ "value" ]
};

let an = 0;

class Case {
    constructor() {
        this.id = ++an;
        this.fallThrough = false;
        this.view = void 0;
        this.f = v(Re);
        this.us = v($);
        this.l = v(gi);
        this.Gs = v(_).scopeTo(`${this.constructor.name}-#${this.id}`);
    }
    link(t, e, s, i) {
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
        this.Gs.debug("isMatch()");
        const e = this.value;
        if (isArray(e)) {
            if (this.Es === void 0) {
                this.Es = this.Ks(e);
            }
            return e.includes(t);
        }
        return e === t;
    }
    valueChanged(t, e) {
        if (isArray(t)) {
            this.Es?.unsubscribe(this);
            this.Es = this.Ks(t);
        } else if (this.Es !== void 0) {
            this.Es.unsubscribe(this);
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
        this.Es?.unsubscribe(this);
        this.view?.dispose();
        this.view = void 0;
    }
    linkToSwitch(t) {
        t.cases.push(this);
    }
    Ks(t) {
        const e = this.us.getArrayObserver(t);
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

(() => {
    const t = [ "value", {
        name: "fallThrough",
        mode: Rt,
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
        bindables: t,
        isTemplateController: true
    }, DefaultCase);
    defineAttribute({
        name: "case",
        bindables: t,
        isTemplateController: true
    }, Case);
})();

class PromiseTemplateController {
    constructor() {
        this.preSettledTask = null;
        this.postSettledTask = null;
        this.f = v(Re);
        this.l = v(gi);
        this.p = v(oe);
        this.logger = v(_).scopeTo("promise.resolve");
    }
    link(t, e, s, i) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(t, e) {
        const s = this.view;
        const i = this.$controller;
        return T(s.activate(t, i, this.viewScope = Scope.fromParent(i.scope, {})), (() => this.swap(t)));
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
        const s = this.p.domWriteQueue;
        const i = this.fulfilled;
        const n = this.rejected;
        const r = this.pending;
        const l = this.viewScope;
        let a;
        const h = {
            reusable: false
        };
        const $swap = () => {
            void S(a = (this.preSettledTask = s.queueTask((() => S(i?.deactivate(t), n?.deactivate(t), r?.activate(t, l))), h)).result.catch((t => {
                if (!(t instanceof it)) throw t;
            })), e.then((c => {
                if (this.value !== e) {
                    return;
                }
                const fulfill = () => {
                    this.postSettlePromise = (this.postSettledTask = s.queueTask((() => S(r?.deactivate(t), n?.deactivate(t), i?.activate(t, l, c))), h)).result;
                };
                if (this.preSettledTask.status === xt) {
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
                    this.postSettlePromise = (this.postSettledTask = s.queueTask((() => S(r?.deactivate(t), i?.deactivate(t), n?.activate(t, l, c))), h)).result;
                };
                if (this.preSettledTask.status === xt) {
                    void a.then(reject);
                } else {
                    this.preSettledTask.cancel();
                    reject();
                }
            })));
        };
        if (this.postSettledTask?.status === xt) {
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
    type: ae,
    name: "promise",
    isTemplateController: true,
    bindables: [ "value" ]
};

class PendingTemplateController {
    constructor() {
        this.view = void 0;
        this.f = v(Re);
        this.l = v(gi);
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
}

PendingTemplateController.$au = {
    type: ae,
    name: "pending",
    isTemplateController: true,
    bindables: {
        value: {
            mode: It
        }
    }
};

class FulfilledTemplateController {
    constructor() {
        this.view = void 0;
        this.f = v(Re);
        this.l = v(gi);
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
}

FulfilledTemplateController.$au = {
    type: ae,
    name: "then",
    isTemplateController: true,
    bindables: {
        value: {
            mode: Pt
        }
    }
};

class RejectedTemplateController {
    constructor() {
        this.view = void 0;
        this.f = v(Re);
        this.l = v(gi);
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
}

RejectedTemplateController.$au = {
    type: ae,
    name: "catch",
    isTemplateController: true,
    bindables: {
        value: {
            mode: Pt
        }
    }
};

function getPromiseController(t) {
    const e = t.parent;
    const s = e?.viewModel;
    if (s instanceof PromiseTemplateController) {
        return s;
    }
    throw createMappedError(813);
}

class PromiseAttributePattern {
    "promise.resolve"(t, e) {
        return new AttrSyntax(t, e, "promise", "bind");
    }
}

_i.define([ {
    pattern: "promise.resolve",
    symbols: ""
} ], PromiseAttributePattern);

class FulfilledAttributePattern {
    then(t, e) {
        return new AttrSyntax(t, e, "then", "from-view");
    }
}

_i.define([ {
    pattern: "then",
    symbols: ""
} ], FulfilledAttributePattern);

class RejectedAttributePattern {
    catch(t, e) {
        return new AttrSyntax(t, e, "catch", "from-view");
    }
}

_i.define([ {
    pattern: "catch",
    symbols: ""
} ], RejectedAttributePattern);

class Focus {
    constructor() {
        this.Xs = false;
        this.Qs = v(di);
        this.p = v(oe);
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) {
            this.Ys();
        } else {
            this.Xs = true;
        }
    }
    attached() {
        if (this.Xs) {
            this.Xs = false;
            this.Ys();
        }
        this.Qs.addEventListener("focus", this);
        this.Qs.addEventListener("blur", this);
    }
    detaching() {
        const t = this.Qs;
        t.removeEventListener("focus", this);
        t.removeEventListener("blur", this);
    }
    handleEvent(t) {
        if (t.type === "focus") {
            this.value = true;
        } else if (!this.Zs) {
            this.value = false;
        }
    }
    Ys() {
        const t = this.Qs;
        const e = this.Zs;
        const s = this.value;
        if (s && !e) {
            t.focus();
        } else if (!s && e) {
            t.blur();
        }
    }
    get Zs() {
        return this.Qs === this.p.document.activeElement;
    }
}

Focus.$au = {
    type: ae,
    name: "focus",
    bindables: {
        value: {
            mode: Lt
        }
    }
};

class Portal {
    constructor() {
        this.position = "beforeend";
        this.strict = false;
        const t = v(Re);
        const e = v(gi);
        const s = v(oe);
        this.p = s;
        this.Js = s.document.createElement("div");
        (this.view = t.create()).setLocation(this.ti = createLocation(s));
        setEffectiveParentNode(this.view.nodes, e);
    }
    attaching(t) {
        if (this.callbackContext == null) {
            this.callbackContext = this.$controller.scope.bindingContext;
        }
        const e = this.Js = this.ei();
        this.si(e, this.position);
        return this.ii(t, e);
    }
    detaching(t) {
        return this.ni(t, this.Js);
    }
    targetChanged() {
        const {$controller: t} = this;
        if (!t.isActive) {
            return;
        }
        const e = this.ei();
        if (this.Js === e) {
            return;
        }
        this.Js = e;
        const s = T(this.ni(null, e), (() => {
            this.si(e, this.position);
            return this.ii(null, e);
        }));
        if (isPromise(s)) {
            s.catch(rethrow);
        }
    }
    positionChanged() {
        const {$controller: t, Js: e} = this;
        if (!t.isActive) {
            return;
        }
        const s = T(this.ni(null, e), (() => {
            this.si(e, this.position);
            return this.ii(null, e);
        }));
        if (isPromise(s)) {
            s.catch(rethrow);
        }
    }
    ii(t, e) {
        const {activating: s, callbackContext: i, view: n} = this;
        return T(s?.call(i, e, n), (() => this.ri(t, e)));
    }
    ri(t, e) {
        const {$controller: s, view: i} = this;
        if (t === null) {
            i.nodes.insertBefore(this.ti);
        } else {
            return T(i.activate(t ?? i, s, s.scope), (() => this.oi(e)));
        }
        return this.oi(e);
    }
    oi(t) {
        const {activated: e, callbackContext: s, view: i} = this;
        return e?.call(s, t, i);
    }
    ni(t, e) {
        const {deactivating: s, callbackContext: i, view: n} = this;
        return T(s?.call(i, e, n), (() => this.li(t, e)));
    }
    li(t, e) {
        const {$controller: s, view: i} = this;
        if (t === null) {
            i.nodes.remove();
        } else {
            return T(i.deactivate(t, s), (() => this.ai(e)));
        }
        return this.ai(e);
    }
    ai(t) {
        const {deactivated: e, callbackContext: s, view: i} = this;
        return T(e?.call(s, t, i), (() => this.hi()));
    }
    ei() {
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
    hi() {
        this.ti.remove();
        this.ti.$start.remove();
    }
    si(t, e) {
        const s = this.ti;
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

Portal.$au = {
    type: ae,
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

let hn;

class AuSlot {
    constructor() {
        this.ui = null;
        this.fi = null;
        this.Xt = false;
        this.expose = null;
        this.slotchange = null;
        this.di = new Set;
        this.Es = null;
        const t = v(hi);
        const e = v(gi);
        const s = v(ns);
        const i = v(Ls);
        const n = this.name = s.data.name;
        const r = s.projections?.[Le];
        const l = t.instruction?.projections?.[n];
        const a = t.controller.container;
        let h;
        let c;
        if (l == null) {
            c = a.createChild({
                inheritParentResources: true
            });
            h = i.getViewFactory(r ?? (hn ??= CustomElementDefinition.create({
                name: "au-slot-empty-template",
                template: "",
                needsCompile: false
            })), c);
            this.mi = false;
        } else {
            c = a.createChild();
            c.useResources(t.parent.controller.container);
            registerResolver(c, hi, new k(void 0, t.parent));
            h = i.getViewFactory(l, c);
            this.mi = true;
            this.gi = a.getAll(_e, false)?.filter((t => t.slotName === "*" || t.slotName === n)) ?? b;
        }
        this.pi = (this.gi ??= b).length > 0;
        this.vi = t;
        this.view = h.create().setLocation(this.l = e);
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
        this.di.add(t);
    }
    unsubscribe(t) {
        this.di.delete(t);
    }
    binding(t, e) {
        this.ui = this.$controller.scope.parent;
        let s;
        if (this.mi) {
            s = this.vi.controller.scope.parent;
            (this.fi = Scope.fromParent(s, s.bindingContext)).overrideContext.$host = this.expose ?? this.ui.bindingContext;
        }
    }
    attaching(t, e) {
        return T(this.view.activate(t, this.$controller, this.mi ? this.fi : this.ui), (() => {
            if (this.pi) {
                this.gi.forEach((t => t.watch(this)));
                this.ws();
                this.wi();
                this.Xt = true;
            }
        }));
    }
    detaching(t, e) {
        this.Xt = false;
        this.bi();
        this.gi.forEach((t => t.unwatch(this)));
        return this.view.deactivate(t, this.$controller);
    }
    exposeChanged(t) {
        if (this.mi && this.fi != null) {
            this.fi.overrideContext.$host = t;
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
    ws() {
        if (this.Es != null) {
            return;
        }
        const t = this.l;
        const e = t.parentElement;
        if (e == null) {
            return;
        }
        (this.Es = createMutationObserver(e, (e => {
            if (isMutationWithinLocation(t, e)) {
                this.wi();
            }
        }))).observe(e, {
            childList: true
        });
    }
    bi() {
        this.Es?.disconnect();
        this.Es = null;
    }
    wi() {
        const t = this.nodes;
        const e = new Set(this.di);
        let s;
        if (this.Xt) {
            this.slotchange?.call(void 0, this.name, t);
        }
        for (s of e) {
            s.handleSlotChange(this, t);
        }
    }
}

AuSlot.$au = {
    type: Ci,
    name: "au-slot",
    template: null,
    containerless: true,
    processContent(t, e, s) {
        s.name = t.getAttribute("name") ?? Le;
        let i = t.firstChild;
        let n = null;
        while (i !== null) {
            n = i.nextSibling;
            if (isElement(i) && i.hasAttribute(Me)) {
                t.removeChild(i);
            }
            i = n;
        }
    },
    bindables: [ "expose", "slotchange" ]
};

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
        this.xi = void 0;
        this.tag = null;
        this.c = v(C);
        this.parent = v(ai);
        this.yi = v(di);
        this.l = v(gi);
        this.p = v(oe);
        this.r = v(Ls);
        this.ki = v(ns);
        this.Ci = v(q(CompositionContextFactory, null));
        this.st = v(rs);
        this.J = v(hi);
        this.ep = v(e);
        this.oL = v($);
    }
    get composing() {
        return this.Ai;
    }
    get composition() {
        return this.xi;
    }
    attaching(t, e) {
        return this.Ai = T(this.queue(new ChangeInfo(this.template, this.component, this.model, void 0), t), (t => {
            if (this.Ci.Bi(t)) {
                this.Ai = void 0;
            }
        }));
    }
    detaching(t) {
        const e = this.xi;
        const s = this.Ai;
        this.Ci.invalidate();
        this.xi = this.Ai = void 0;
        return T(s, (() => e?.deactivate(t)));
    }
    propertyChanged(t) {
        if (t === "composing" || t === "composition") return;
        if (t === "model" && this.xi != null) {
            this.xi.update(this.model);
            return;
        }
        if (t === "tag" && this.xi?.controller.vmKind === Ys) {
            return;
        }
        this.Ai = T(this.Ai, (() => T(this.queue(new ChangeInfo(this.template, this.component, this.model, t), void 0), (t => {
            if (this.Ci.Bi(t)) {
                this.Ai = void 0;
            }
        }))));
    }
    queue(t, e) {
        const s = this.Ci;
        const i = this.xi;
        return T(s.create(t), (t => {
            if (s.Bi(t)) {
                return T(this.compose(t), (n => {
                    if (s.Bi(t)) {
                        return T(n.activate(e), (() => {
                            if (s.Bi(t)) {
                                this.xi = n;
                                return T(i?.deactivate(e), (() => t));
                            } else {
                                return T(n.controller.deactivate(n.controller, this.$controller), (() => {
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
        const {Si: e, Ti: s, Ei: i} = t.change;
        const {c: n, $controller: r, l: l, ki: a} = this;
        const h = this.Ri(this.J.controller.container, s);
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
        const d = this.Ii(c, typeof s === "string" ? h.Type : s, u, f);
        const compose = () => {
            const s = a.captures ?? b;
            if (h !== null) {
                const e = h.capture;
                const [i, n] = s.reduce(((t, s) => {
                    const i = !(s.target in h.bindables) && (e === true || isFunction(e) && !!e(s.target));
                    t[i ? 0 : 1].push(s);
                    return t;
                }), [ [], [] ]);
                const l = Controller.$el(c, d, u, {
                    projections: a.projections,
                    captures: i
                }, h, f);
                this.Pi(u, h, n).forEach((t => l.addBinding(t)));
                return new CompositionController(l, (t => l.activate(t ?? l, r, r.scope.parent)), (t => T(l.deactivate(t ?? l, r), removeCompositionHost)), (t => d.activate?.(t)), t);
            } else {
                const i = CustomElementDefinition.create({
                    name: Ti.generateName(),
                    template: e
                });
                const n = this.r.getViewFactory(i, c);
                const l = Controller.$view(n, r);
                const a = this.scopeBehavior === "auto" ? Scope.fromParent(this.parent.scope, d) : Scope.create(d);
                l.setHost(u);
                if (f == null) {
                    this.Pi(u, i, s).forEach((t => l.addBinding(t)));
                } else {
                    l.setLocation(f);
                }
                return new CompositionController(l, (t => l.activate(t ?? l, r, a)), (t => T(l.deactivate(t ?? l, r), removeCompositionHost)), (t => d.activate?.(t)), t);
            }
        };
        if ("activate" in d) {
            return T(d.activate(i), (() => compose()));
        } else {
            return compose();
        }
    }
    Ii(t, e, s, i) {
        if (e == null) {
            return new EmptyComponent;
        }
        if (typeof e === "object") {
            return e;
        }
        const n = this.p;
        registerHostNode(t, n, s);
        registerResolver(t, gi, new k("IRenderLocation", i));
        const r = t.invoke(e);
        registerResolver(t, e, new k("au-compose.component", r));
        return r;
    }
    Ri(t, e) {
        if (typeof e === "string") {
            const s = Ti.find(t, e);
            if (s == null) {
                throw createMappedError(806, e);
            }
            return s;
        }
        const s = isFunction(e) ? e : e?.constructor;
        return Ti.isType(s, void 0) ? Ti.getDefinition(s, null) : null;
    }
    Pi(t, e, s) {
        const i = new HydrationContext(this.$controller, {
            projections: null,
            captures: s
        }, this.J.parent);
        return SpreadBinding.create(i, t, e, this.r, this.st, this.p, this.ep, this.oL);
    }
}

AuCompose.$au = {
    type: Ci,
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
        mode: Pt
    }, {
        name: "composition",
        mode: Pt
    }, "tag" ]
};

class EmptyComponent {}

class CompositionContextFactory {
    constructor() {
        this.id = 0;
    }
    Bi(t) {
        return t.id === this.id;
    }
    create(t) {
        return T(t.load(), (t => new CompositionContext(++this.id, t)));
    }
    invalidate() {
        this.id++;
    }
}

class ChangeInfo {
    constructor(t, e, s, i) {
        this.Si = t;
        this.Ti = e;
        this.Ei = s;
        this.Li = i;
    }
    load() {
        if (isPromise(this.Si) || isPromise(this.Ti)) {
            return Promise.all([ this.Si, this.Ti ]).then((([t, e]) => new LoadedChangeInfo(t, e, this.Ei, this.Li)));
        } else {
            return new LoadedChangeInfo(this.Si, this.Ti, this.Ei, this.Li);
        }
    }
}

class LoadedChangeInfo {
    constructor(t, e, s, i) {
        this.Si = t;
        this.Ti = e;
        this.Ei = s;
        this.Li = i;
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

const cn = /*@__PURE__*/ $t("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw createMappedError(99, "sanitize");
    }
})));

class SanitizeValueConverter {
    constructor() {
        this.Mi = v(cn);
    }
    toView(t) {
        if (t == null) {
            return null;
        }
        return this.Mi.sanitize(t);
    }
}

SanitizeValueConverter.$au = {
    type: de,
    name: "sanitize"
};

const un = /*@__PURE__*/ $t("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const dn = {};

class TemplateElementFactory {
    constructor() {
        this.p = v(oe);
        this.Si = this.t();
    }
    t() {
        return this.p.document.createElement("template");
    }
    createTemplate(t) {
        if (isString(t)) {
            let e = dn[t];
            if (e === void 0) {
                const s = this.Si;
                s.innerHTML = t;
                const i = s.content.firstElementChild;
                if (needsWrapping(i)) {
                    this.Si = this.t();
                    e = s;
                } else {
                    s.content.removeChild(i);
                    e = i;
                }
                dn[t] = e;
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
        this.Di = v(kn);
        this.debug = false;
        this.resolveResources = true;
    }
    static register(t) {
        t.register(jt(this, this), Wt(this, rs));
    }
    compile(t, e, s) {
        if (t.template == null || t.needsCompile === false) {
            return t;
        }
        s ??= vn;
        const i = new CompilationContext(t, e, s, null, null, void 0);
        const n = isString(t.template) || !t.enhance ? i._i.createTemplate(t.template) : t.template;
        const r = n.nodeName === mn && n.content != null;
        const l = r ? n.content : n;
        const a = Tn.findAll(e);
        const h = a.length;
        let c = 0;
        if (h > 0) {
            while (h > c) {
                a[c].compiling?.(n);
                ++c;
            }
        }
        if (n.hasAttribute(Bn)) {
            throw createMappedError(701, t);
        }
        this.qi(l, i);
        this.Fi(l, i);
        const u = {
            ...t,
            name: t.name || Bi(),
            dependencies: (t.dependencies ?? b).concat(i.deps ?? b),
            instructions: i.rows,
            surrogates: r ? this.Oi(n, i) : b,
            template: n,
            hasSlots: i.hasSlot,
            needsCompile: false
        };
        if (i.deps != null) {
            const t = [ u.Type, ...u.dependencies ?? [], ...i.deps ].filter((t => t));
            for (const e of i.deps) {
                getElementDefinition(e).dependencies.push(...t.filter((t => t !== e)));
            }
        }
        return u;
    }
    compileSpread(t, e, s, i, n) {
        const r = new CompilationContext(t, s, vn, null, null, void 0);
        const l = [];
        const a = n ?? r.Hi(i.nodeName.toLowerCase());
        const h = a !== null;
        const c = r.ep;
        const u = e.length;
        let f = 0;
        let d;
        let m = null;
        let g;
        let p;
        let v;
        let w;
        let b;
        let x = null;
        let y;
        let k;
        let C;
        let A;
        for (;u > f; ++f) {
            d = e[f];
            C = d.target;
            A = d.rawValue;
            x = r.Vi(d);
            if (x !== null && x.ignoreAttr) {
                bn.node = i;
                bn.attr = d;
                bn.bindable = null;
                bn.def = null;
                l.push(x.build(bn, r.ep, r.m));
                continue;
            }
            m = r.Ni(C);
            if (m !== null) {
                if (m.isTemplateController) {
                    throw createMappedError(9998, C);
                }
                v = this.Di.get(m);
                k = m.noMultiBindings === false && x === null && hasInlineBindings(A);
                if (k) {
                    p = this.$i(i, A, m, r);
                } else {
                    b = v.primary;
                    if (x === null) {
                        y = c.parse(A, gt);
                        p = [ y === null ? new SetPropertyInstruction(A, b.name) : new InterpolationInstruction(y, b.name) ];
                    } else {
                        bn.node = i;
                        bn.attr = d;
                        bn.bindable = b;
                        bn.def = m;
                        p = [ x.build(bn, r.ep, r.m) ];
                    }
                }
                (g ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? m : m.name, m.aliases != null && m.aliases.includes(C) ? C : void 0, p));
                continue;
            }
            if (x === null) {
                y = c.parse(A, gt);
                if (h) {
                    v = this.Di.get(a);
                    w = v.attrs[C];
                    if (w !== void 0) {
                        y = c.parse(A, gt);
                        l.push(new SpreadElementPropBindingInstruction(y == null ? new SetPropertyInstruction(A, w.name) : new InterpolationInstruction(y, w.name)));
                        continue;
                    }
                }
                if (y != null) {
                    l.push(new InterpolationInstruction(y, r.m.map(i, C) ?? L(C)));
                } else {
                    switch (C) {
                      case "class":
                        l.push(new SetClassAttributeInstruction(A));
                        break;

                      case "style":
                        l.push(new SetStyleAttributeInstruction(A));
                        break;

                      default:
                        l.push(new SetAttributeInstruction(A, C));
                    }
                }
            } else {
                if (h) {
                    v = this.Di.get(a);
                    w = v.attrs[C];
                    if (w !== void 0) {
                        bn.node = i;
                        bn.attr = d;
                        bn.bindable = w;
                        bn.def = a;
                        l.push(new SpreadElementPropBindingInstruction(x.build(bn, r.ep, r.m)));
                        continue;
                    }
                }
                bn.node = i;
                bn.attr = d;
                bn.bindable = null;
                bn.def = null;
                l.push(x.build(bn, r.ep, r.m));
            }
        }
        resetCommandBuildInfo();
        if (g != null) {
            return g.concat(l);
        }
        return l;
    }
    Oi(t, e) {
        const s = [];
        const i = t.attributes;
        const n = e.ep;
        let r = i.length;
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
        let w;
        let b;
        let x;
        let y;
        for (;r > l; ++l) {
            a = i[l];
            h = a.name;
            c = a.value;
            u = e.He.parse(h, c);
            x = u.target;
            y = u.rawValue;
            if (xn[x]) {
                throw createMappedError(702, h);
            }
            v = e.Vi(u);
            if (v !== null && v.ignoreAttr) {
                bn.node = t;
                bn.attr = u;
                bn.bindable = null;
                bn.def = null;
                s.push(v.build(bn, e.ep, e.m));
                continue;
            }
            f = e.Ni(x);
            if (f !== null) {
                if (f.isTemplateController) {
                    throw createMappedError(703, x);
                }
                g = this.Di.get(f);
                b = f.noMultiBindings === false && v === null && hasInlineBindings(y);
                if (b) {
                    m = this.$i(t, y, f, e);
                } else {
                    p = g.primary;
                    if (v === null) {
                        w = n.parse(y, gt);
                        m = w === null ? y === "" ? [] : [ new SetPropertyInstruction(y, p.name) ] : [ new InterpolationInstruction(w, p.name) ];
                    } else {
                        bn.node = t;
                        bn.attr = u;
                        bn.bindable = p;
                        bn.def = f;
                        m = [ v.build(bn, e.ep, e.m) ];
                    }
                }
                t.removeAttribute(h);
                --l;
                --r;
                (d ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? f : f.name, f.aliases != null && f.aliases.includes(x) ? x : void 0, m));
                continue;
            }
            if (v === null) {
                w = n.parse(y, gt);
                if (w != null) {
                    t.removeAttribute(h);
                    --l;
                    --r;
                    s.push(new InterpolationInstruction(w, e.m.map(t, x) ?? L(x)));
                } else {
                    switch (h) {
                      case "class":
                        s.push(new SetClassAttributeInstruction(y));
                        break;

                      case "style":
                        s.push(new SetStyleAttributeInstruction(y));
                        break;

                      default:
                        s.push(new SetAttributeInstruction(y, h));
                    }
                }
            } else {
                bn.node = t;
                bn.attr = u;
                bn.bindable = null;
                bn.def = null;
                s.push(v.build(bn, e.ep, e.m));
            }
        }
        resetCommandBuildInfo();
        if (d != null) {
            return d.concat(s);
        }
        return s;
    }
    Fi(t, e) {
        switch (t.nodeType) {
          case 1:
            switch (t.nodeName) {
              case "LET":
                return this.ji(t, e);

              default:
                return this.Wi(t, e);
            }

          case 3:
            return this.Ui(t, e);

          case 11:
            {
                let s = t.firstChild;
                while (s !== null) {
                    s = this.Fi(s, e);
                }
                break;
            }
        }
        return t.nextSibling;
    }
    ji(t, e) {
        const s = t.attributes;
        const n = s.length;
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
            c = s[h];
            f = c.name;
            d = c.value;
            if (f === "to-binding-context") {
                a = true;
                continue;
            }
            u = e.He.parse(f, d);
            g = u.target;
            p = u.rawValue;
            m = e.Vi(u);
            if (m !== null) {
                if (u.command === "bind") {
                    r.push(new LetBindingInstruction(l.parse(p, wt), L(g)));
                } else {
                    throw createMappedError(704, u);
                }
                continue;
            }
            v = l.parse(p, gt);
            r.push(new LetBindingInstruction(v === null ? new i(p) : v, L(g)));
        }
        e.rows.push([ new HydrateLetElementInstruction(r, a) ]);
        return this.zi(t, e).nextSibling;
    }
    Wi(t, e) {
        const s = t.nextSibling;
        const i = (t.getAttribute("as-element") ?? t.nodeName).toLowerCase();
        const n = e.Hi(i);
        const r = n !== null;
        const l = r && n.shadowOptions != null;
        const a = n?.capture;
        const c = a != null && typeof a !== "boolean";
        const u = a ? [] : b;
        const f = e.ep;
        const d = this.debug ? h : () => {
            t.removeAttribute(x);
            --v;
            --p;
        };
        let m = t.attributes;
        let g;
        let p = m.length;
        let v = 0;
        let w;
        let x;
        let y;
        let k;
        let C;
        let A;
        let B = null;
        let S = false;
        let T;
        let E;
        let R;
        let I;
        let P;
        let M;
        let D;
        let _ = null;
        let q;
        let F;
        let O;
        let H;
        let V = true;
        let N = false;
        let $ = false;
        let j = false;
        let W;
        if (i === "slot") {
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
            w = m[v];
            x = w.name;
            y = w.value;
            switch (x) {
              case "as-element":
              case "containerless":
                d();
                if (!N) {
                    N = x === "containerless";
                }
                continue;
            }
            k = e.He.parse(x, y);
            _ = e.Vi(k);
            O = k.target;
            H = k.rawValue;
            if (a && (!c || c && a(O))) {
                if (_ != null && _.ignoreAttr) {
                    d();
                    u.push(k);
                    continue;
                }
                $ = O !== Me && O !== "slot";
                if ($) {
                    q = this.Di.get(n);
                    if (q.attrs[O] == null && !e.Ni(O)?.isTemplateController) {
                        d();
                        u.push(k);
                        continue;
                    }
                }
            }
            if (_?.ignoreAttr) {
                bn.node = t;
                bn.attr = k;
                bn.bindable = null;
                bn.def = null;
                (C ??= []).push(_.build(bn, e.ep, e.m));
                d();
                continue;
            }
            if (r) {
                q = this.Di.get(n);
                T = q.attrs[O];
                if (T !== void 0) {
                    if (_ === null) {
                        M = f.parse(H, gt);
                        (A ??= []).push(M == null ? new SetPropertyInstruction(H, T.name) : new InterpolationInstruction(M, T.name));
                    } else {
                        bn.node = t;
                        bn.attr = k;
                        bn.bindable = T;
                        bn.def = n;
                        (A ??= []).push(_.build(bn, e.ep, e.m));
                    }
                    d();
                    continue;
                }
            }
            B = e.Ni(O);
            if (B !== null) {
                q = this.Di.get(B);
                S = B.noMultiBindings === false && _ === null && hasInlineBindings(H);
                if (S) {
                    R = this.$i(t, H, B, e);
                } else {
                    F = q.primary;
                    if (_ === null) {
                        M = f.parse(H, gt);
                        R = M === null ? H === "" ? [] : [ new SetPropertyInstruction(H, F.name) ] : [ new InterpolationInstruction(M, F.name) ];
                    } else {
                        bn.node = t;
                        bn.attr = k;
                        bn.bindable = F;
                        bn.def = B;
                        R = [ _.build(bn, e.ep, e.m) ];
                    }
                }
                d();
                if (B.isTemplateController) {
                    (I ??= []).push(new HydrateTemplateController(wn, this.resolveResources ? B : B.name, void 0, R));
                } else {
                    (E ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? B : B.name, B.aliases != null && B.aliases.includes(O) ? O : void 0, R));
                }
                continue;
            }
            if (_ === null) {
                M = f.parse(H, gt);
                if (M != null) {
                    d();
                    (C ??= []).push(new InterpolationInstruction(M, e.m.map(t, O) ?? L(O)));
                }
                continue;
            }
            bn.node = t;
            bn.attr = k;
            bn.bindable = null;
            bn.def = null;
            (C ??= []).push(_.build(bn, e.ep, e.m));
            d();
        }
        resetCommandBuildInfo();
        if (this.Gi(t, C) && C != null && C.length > 1) {
            this.Ki(t, C);
        }
        if (r) {
            D = new HydrateElementInstruction(this.resolveResources ? n : n.name, A ?? b, null, N, u, W);
        }
        if (C != null || D != null || E != null) {
            g = b.concat(D ?? b, E ?? b, C ?? b);
            j = true;
        }
        let U;
        if (I != null) {
            p = I.length - 1;
            v = p;
            P = I[v];
            let s;
            if (isMarker(t)) {
                s = e.t();
                appendManyToTemplate(s, [ e.ct(), e.Xi(gn), e.Xi(pn) ]);
            } else {
                this.Qi(t, e);
                if (t.nodeName === "TEMPLATE") {
                    s = t;
                } else {
                    s = e.t();
                    appendToTemplate(s, t);
                }
            }
            const a = s;
            const h = e.Yi(g == null ? [] : [ g ]);
            let c;
            let u;
            let f = false;
            let d;
            let m;
            let w;
            let b;
            let x;
            let y;
            let k = 0, C = 0;
            let A = t.firstChild;
            let B = false;
            if (V !== false) {
                while (A !== null) {
                    u = isElement(A) ? A.getAttribute(Me) : null;
                    f = u !== null || r && !l;
                    c = A.nextSibling;
                    if (f) {
                        if (!r) {
                            throw createMappedError(706, u, i);
                        }
                        A.removeAttribute?.(Me);
                        B = isTextNode(A) && A.textContent.trim() === "";
                        if (!B) {
                            ((m ??= {})[u || Le] ??= []).push(A);
                        }
                        t.removeChild(A);
                    }
                    A = c;
                }
            }
            if (m != null) {
                d = {};
                for (u in m) {
                    s = e.t();
                    w = m[u];
                    for (k = 0, C = w.length; C > k; ++k) {
                        b = w[k];
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
                    y = e.Yi();
                    this.Fi(s.content, y);
                    d[u] = {
                        name: Bi(),
                        template: s,
                        instructions: y.rows,
                        needsCompile: false
                    };
                }
                D.projections = d;
            }
            if (j) {
                if (r && (N || n.containerless)) {
                    this.Qi(t, e);
                } else {
                    this.zi(t, e);
                }
            }
            U = !r || !n.containerless && !N && V !== false;
            if (U) {
                if (t.nodeName === mn) {
                    this.Fi(t.content, h);
                } else {
                    A = t.firstChild;
                    while (A !== null) {
                        A = this.Fi(A, h);
                    }
                }
            }
            P.def = {
                name: Bi(),
                template: a,
                instructions: h.rows,
                needsCompile: false
            };
            while (v-- > 0) {
                P = I[v];
                s = e.t();
                x = e.ct();
                appendManyToTemplate(s, [ x, e.Xi(gn), e.Xi(pn) ]);
                P.def = {
                    name: Bi(),
                    template: s,
                    needsCompile: false,
                    instructions: [ [ I[v + 1] ] ]
                };
            }
            e.rows.push([ P ]);
        } else {
            if (g != null) {
                e.rows.push(g);
            }
            let s = t.firstChild;
            let a;
            let h;
            let c = false;
            let u = null;
            let f;
            let d;
            let m;
            let p;
            let v;
            let w = false;
            let b = 0, x = 0;
            if (V !== false) {
                while (s !== null) {
                    h = isElement(s) ? s.getAttribute(Me) : null;
                    c = h !== null || r && !l;
                    a = s.nextSibling;
                    if (c) {
                        if (!r) {
                            throw createMappedError(706, h, i);
                        }
                        s.removeAttribute?.(Me);
                        w = isTextNode(s) && s.textContent.trim() === "";
                        if (!w) {
                            ((f ??= {})[h || Le] ??= []).push(s);
                        }
                        t.removeChild(s);
                    }
                    s = a;
                }
            }
            if (f != null) {
                u = {};
                for (h in f) {
                    p = e.t();
                    d = f[h];
                    for (b = 0, x = d.length; x > b; ++b) {
                        m = d[b];
                        if (m.nodeName === mn) {
                            if (m.attributes.length > 0) {
                                appendToTemplate(p, m);
                            } else {
                                appendToTemplate(p, m.content);
                            }
                        } else {
                            appendToTemplate(p, m);
                        }
                    }
                    v = e.Yi();
                    this.Fi(p.content, v);
                    u[h] = {
                        name: Bi(),
                        template: p,
                        instructions: v.rows,
                        needsCompile: false
                    };
                }
                D.projections = u;
            }
            if (j) {
                if (r && (N || n.containerless)) {
                    this.Qi(t, e);
                } else {
                    this.zi(t, e);
                }
            }
            U = !r || !n.containerless && !N && V !== false;
            if (U && t.childNodes.length > 0) {
                s = t.firstChild;
                while (s !== null) {
                    s = this.Fi(s, e);
                }
            }
        }
        return s;
    }
    Ui(t, e) {
        const s = t.parentNode;
        const i = e.ep.parse(t.textContent, gt);
        const n = t.nextSibling;
        let r;
        let l;
        let a;
        let h;
        let c;
        if (i !== null) {
            ({parts: r, expressions: l} = i);
            if (c = r[0]) {
                insertBefore(s, e.Zi(c), t);
            }
            for (a = 0, h = l.length; h > a; ++a) {
                insertManyBefore(s, t, [ e.ct(), e.Zi(" ") ]);
                if (c = r[a + 1]) {
                    insertBefore(s, e.Zi(c), t);
                }
                e.rows.push([ new TextBindingInstruction(l[a]) ]);
            }
            s.removeChild(t);
        }
        return n;
    }
    $i(t, e, s, i) {
        const n = this.Di.get(s);
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
                d = i.He.parse(a, h);
                m = i.Vi(d);
                g = n.attrs[d.target];
                if (g == null) {
                    throw createMappedError(707, d.target, s.name);
                }
                if (m === null) {
                    f = i.ep.parse(h, gt);
                    l.push(f === null ? new SetPropertyInstruction(h, g.name) : new InterpolationInstruction(f, g.name));
                } else {
                    bn.node = t;
                    bn.attr = d;
                    bn.bindable = g;
                    bn.def = s;
                    l.push(m.build(bn, i.ep, i.m));
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
    qi(t, e) {
        const s = e.root.def.name;
        const i = t;
        const n = F(i.querySelectorAll("template[as-custom-element]"));
        const r = n.length;
        if (r === 0) {
            return;
        }
        if (r === i.childElementCount) {
            throw createMappedError(708, s);
        }
        const l = new Set;
        for (const t of n) {
            if (t.parentNode !== i) {
                throw createMappedError(709, s);
            }
            const n = processTemplateName(s, t, l);
            const r = t.content;
            const a = F(r.querySelectorAll("bindable"));
            const h = new Set;
            const c = new Set;
            const u = a.reduce(((t, e) => {
                if (e.parentNode !== r) {
                    throw createMappedError(710, n);
                }
                const s = e.getAttribute("name");
                if (s === null) {
                    throw createMappedError(711, e, n);
                }
                const i = e.getAttribute("attribute");
                if (i !== null && c.has(i) || h.has(s)) {
                    throw createMappedError(712, h, i);
                } else {
                    if (i !== null) {
                        c.add(i);
                    }
                    h.add(s);
                }
                const l = F(e.attributes).filter((t => !An.includes(t.name)));
                if (l.length > 0) ;
                e.remove();
                t[s] = {
                    attribute: i ?? void 0,
                    mode: getBindingMode(e)
                };
                return t;
            }), {});
            class LocalTemplateType {}
            mt(LocalTemplateType, "name", {
                value: n
            });
            e.Ji(defineElement({
                name: n,
                template: t,
                bindables: u
            }, LocalTemplateType));
            i.removeChild(t);
        }
    }
    Gi(t, e) {
        const s = t.nodeName;
        return s === "INPUT" && yn[t.type] === 1 || s === "SELECT" && (t.hasAttribute("multiple") || e?.some((t => t.type === je && t.to === "multiple")));
    }
    Ki(t, e) {
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
    zi(t, e) {
        insertBefore(t.parentNode, e.Xi("au*"), t);
        return t;
    }
    Qi(t, e) {
        if (isMarker(t)) {
            return t;
        }
        const s = t.parentNode;
        const i = e.ct();
        insertManyBefore(s, t, [ i, e.Xi(gn), e.Xi(pn) ]);
        s.removeChild(t);
        return i;
    }
}

const mn = "TEMPLATE";

const gn = "au-start";

const pn = "au-end";

const isMarker = t => t.nodeValue === "au*";

class CompilationContext {
    constructor(t, s, i, n, r, l) {
        this.hasSlot = false;
        const a = n !== null;
        this.c = s;
        this.root = r === null ? this : r;
        this.def = t;
        this.ci = i;
        this.parent = n;
        this.tn = a ? n.tn : s.get(Cn);
        this._i = a ? n._i : s.get(un);
        this.He = a ? n.He : s.get(Mi);
        this.ep = a ? n.ep : s.get(e);
        this.m = a ? n.m : s.get(zi);
        this.Gs = a ? n.Gs : s.get(_);
        this.p = a ? n.p : s.get(oe);
        this.localEls = a ? n.localEls : new Set;
        this.rows = l ?? [];
    }
    Ji(t) {
        (this.root.deps ??= []).push(t);
        this.root.c.register(t);
        return t;
    }
    Zi(t) {
        return createText(this.p, t);
    }
    Xi(t) {
        return createComment(this.p, t);
    }
    ct() {
        return this.Xi("au*");
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
    Hi(t) {
        return this.tn.el(this.c, t);
    }
    Ni(t) {
        return this.tn.attr(this.c, t);
    }
    Yi(t) {
        return new CompilationContext(this.def, this.c, this.ci, this, this.root, t);
    }
    Vi(t) {
        const e = t.command;
        if (e === null) {
            return null;
        }
        return this.tn.command(this.c, e);
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
    bn.node = bn.attr = bn.bindable = bn.def = null;
};

const vn = {
    projections: null
};

const wn = {
    name: "unnamed"
};

const bn = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const xn = ht(createLookup(), {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
});

const yn = {
    checkbox: 1,
    radio: 1
};

const kn = /*@__PURE__*/ $t("IBindablesInfoResolver", (t => {
    class BindablesInfoResolver {
        constructor() {
            this.W = new WeakMap;
        }
        get(t) {
            let e = this.W.get(t);
            if (e == null) {
                const s = t.bindables;
                const i = createLookup();
                let n;
                let r;
                let l = false;
                let a;
                let h;
                for (r in s) {
                    n = s[r];
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
                    i[h] = BindableDefinition.create(r, n);
                }
                if (n == null && t.kind === "attribute") {
                    a = i.value = BindableDefinition.create("value", {
                        mode: t.defaultBindingMode != null ? t.defaultBindingMode : Et
                    });
                }
                this.W.set(t, e = new BindablesInfo(i, s, a ?? null));
            }
            return e;
        }
    }
    class BindablesInfo {
        constructor(t, e, s) {
            this.attrs = t;
            this.bindables = e;
            this.primary = s;
        }
    }
    return t.singleton(BindablesInfoResolver);
}));

const Cn = /*@__PURE__*/ $t("IResourceResolver", (t => t.singleton(ResourceResolver)));

class ResourceResolver {
    constructor() {
        this.en = new WeakMap;
        this.sn = new WeakMap;
    }
    el(t, e) {
        let s = this.en.get(t);
        if (s == null) {
            this.en.set(t, s = new RecordCache);
        }
        return e in s.element ? s.element[e] : s.element[e] = Ti.find(t, e);
    }
    attr(t, e) {
        let s = this.en.get(t);
        if (s == null) {
            this.en.set(t, s = new RecordCache);
        }
        return e in s.attr ? s.attr[e] : s.attr[e] = ce.find(t, e);
    }
    command(t, e) {
        let s = this.sn.get(t);
        if (s == null) {
            this.sn.set(t, s = createLookup());
        }
        let i = s[e];
        if (i === void 0) {
            let n = this.en.get(t);
            if (n == null) {
                this.en.set(t, n = new RecordCache);
            }
            const r = e in n.command ? n.command[e] : n.command[e] = Wi.find(t, e);
            if (r == null) {
                throw createMappedError(713, e);
            }
            s[e] = i = Wi.get(t, e);
        }
        return i;
    }
}

class RecordCache {
    constructor() {
        this.element = createLookup();
        this.attr = createLookup();
        this.command = createLookup();
    }
}

const An = at([ "name", "attribute", "mode" ]);

const Bn = "as-custom-element";

const processTemplateName = (t, e, s) => {
    const i = e.getAttribute(Bn);
    if (i === null || i === "") {
        throw createMappedError(715, t);
    }
    if (s.has(i)) {
        throw createMappedError(716, i, t);
    } else {
        s.add(i);
        e.removeAttribute(Bn);
    }
    return i;
};

const getBindingMode = t => {
    switch (t.getAttribute("mode")) {
      case "oneTime":
        return Rt;

      case "toView":
        return It;

      case "fromView":
        return Pt;

      case "twoWay":
        return Lt;

      case "default":
      default:
        return Et;
    }
};

const Sn = /*@__PURE__*/ $t("ITemplateCompilerHooks");

const Tn = at({
    name: /*@__PURE__*/ p("compiler-hooks"),
    define(t) {
        return x.define(t, (function(t) {
            jt(Sn, this).register(t);
        }));
    },
    findAll(t) {
        return t.get(O(Sn));
    }
});

const templateCompilerHooks = (t, e) => {
    return t === void 0 ? decorator : decorator(t);
    function decorator(t) {
        return Tn.define(t);
    }
};

class Show {
    constructor() {
        this.el = v(di);
        this.p = v(oe);
        this.nn = false;
        this.I = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.I = null;
            if (Boolean(this.value) !== this.rn) {
                if (this.rn === this.on) {
                    this.rn = !this.on;
                    this.$val = this.el.style.getPropertyValue("display");
                    this.$prio = this.el.style.getPropertyPriority("display");
                    this.el.style.setProperty("display", "none", "important");
                } else {
                    this.rn = this.on;
                    this.el.style.setProperty("display", this.$val, this.$prio);
                    if (this.el.getAttribute("style") === "") {
                        this.el.removeAttribute("style");
                    }
                }
            }
        };
        const t = v(ns);
        this.rn = this.on = t.alias !== "hide";
    }
    binding() {
        this.nn = true;
        this.update();
    }
    detaching() {
        this.nn = false;
        this.I?.cancel();
        this.I = null;
    }
    valueChanged() {
        if (this.nn && this.I === null) {
            this.I = this.p.domWriteQueue.queueTask(this.update);
        }
    }
}

Show.$au = {
    type: ae,
    name: "show",
    bindables: [ "value" ],
    aliases: [ "hide" ]
};

const En = [ TemplateCompiler, J, NodeObserverLocator ];

const Rn = [ Fi, qi, Ni, Oi, Ee ];

const In = [ Vi, Hi ];

const Pn = [ DefaultBindingCommand, OneTimeBindingCommand, FromViewBindingCommand, ToViewBindingCommand, TwoWayBindingCommand, ForBindingCommand, RefBindingCommand, TriggerBindingCommand, CaptureBindingCommand, ClassBindingCommand, StyleBindingCommand, AttrBindingCommand, SpreadBindingCommand ];

const Ln = [ DebounceBindingBehavior, OneTimeBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, SignalBindingBehavior, ThrottleBindingBehavior, TwoWayBindingBehavior, SanitizeValueConverter, If, Else, Repeat, With, Switch, Case, DefaultCase, PromiseTemplateController, PendingTemplateController, FulfilledTemplateController, RejectedTemplateController, PromiseAttributePattern, FulfilledAttributePattern, RejectedAttributePattern, AttrBindingBehavior, SelfBindingBehavior, UpdateTriggerBindingBehavior, AuCompose, Portal, Focus, Show, AuSlot ];

const Mn = [ ms, gs, fs, ds, ls, as, hs, cs, us, ws, Cs, bs, xs, ys, ks, ps, As ];

const Dn = /*@__PURE__*/ createConfiguration(h);

function createConfiguration(t) {
    return {
        optionsProvider: t,
        register(e) {
            const s = {
                coercingOptions: {
                    enableCoercion: false,
                    coerceNullish: false
                }
            };
            t(s);
            return e.register(Ut(U, s.coercingOptions), ...En, ...Ln, ...Rn, ...Pn, ...Mn);
        },
        customize(e) {
            return createConfiguration(e ?? t);
        }
    };
}

function children(t, e) {
    if (!Fn) {
        Fn = true;
        N(ChildrenBinding, null);
        lifecycleHooks()(ChildrenLifecycleHooks, null);
    }
    let s;
    const i = Ot("dependencies");
    function decorator(t, e) {
        switch (e.kind) {
          case "field":
            s.name = e.name;
            break;
        }
        const n = e.metadata[i] ??= [];
        n.push(new ChildrenLifecycleHooks(s));
    }
    if (arguments.length > 1) {
        s = {};
        decorator(t, e);
        return;
    } else if (isString(t)) {
        s = {
            filter: e => isElement(e) && e.matches(t),
            map: t => t
        };
        return decorator;
    }
    s = t === void 0 ? {} : t;
    return decorator;
}

class ChildrenBinding {
    constructor(t, e, s, i = defaultChildQuery, n = defaultChildFilter, r = defaultChildMap, l = _n) {
        this.ln = void 0;
        this.X = defaultChildQuery;
        this.an = defaultChildFilter;
        this.hn = defaultChildMap;
        this.isBound = false;
        this.P = t;
        this.obj = e;
        this.cb = s;
        this.X = i;
        this.an = n;
        this.hn = r;
        this.V = l;
        this.Es = createMutationObserver(this.yi = t.host, (() => {
            this.cn();
        }));
    }
    getValue() {
        return this.isBound ? this.ln : this.un();
    }
    setValue(t) {}
    bind() {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        this.Es.observe(this.yi, this.V);
        this.ln = this.un();
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.Es.disconnect();
        this.ln = b;
    }
    cn() {
        this.ln = this.un();
        this.cb?.call(this.obj);
        this.subs.notify(this.ln, undefined);
    }
    get() {
        throw createMappedError(99, "get");
    }
    un() {
        return filterChildren(this.P, this.X, this.an, this.hn);
    }
}

const _n = {
    childList: true
};

const defaultChildQuery = t => t.host.childNodes;

const defaultChildFilter = (t, e, s) => !!s;

const defaultChildMap = (t, e, s) => s;

const qn = {
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
        h = findElementControllerFor(a, qn);
        c = h?.viewModel ?? null;
        if (s(a, h, c)) {
            l.push(i(a, h, c));
        }
    }
    return l;
};

class ChildrenLifecycleHooks {
    constructor(t) {
        this.Y = t;
    }
    register(t) {
        Ut(ue, this).register(t);
    }
    hydrating(t, e) {
        const s = this.Y;
        const i = new ChildrenBinding(e, t, t[s.callback ?? `${rt(s.name)}Changed`], s.query ?? defaultChildQuery, s.filter ?? defaultChildFilter, s.map ?? defaultChildMap, s.options ?? _n);
        mt(t, s.name, {
            enumerable: true,
            configurable: true,
            get: ht((() => i.getValue()), {
                getObserver: () => i
            }),
            set: () => {}
        });
        e.addBinding(i);
    }
}

let Fn = false;

export { AdoptedStyleSheetsStyles, AppRoot, re as AppTask, Vi as AtPrefixedTriggerAttributePattern, AttrBindingBehavior, AttrBindingCommand, AttrSyntax, AttributeBinding, AttributeBindingInstruction, Cs as AttributeBindingRenderer, AttributeNSAccessor, _i as AttributePattern, AuCompose, AuSlot, AuSlotsInfo, Aurelia, Vt as Bindable, BindableDefinition, Yt as BindingBehavior, BindingBehaviorDefinition, Wi as BindingCommand, BindingCommandDefinition, BindingContext, Mt as BindingMode, BindingModeBehavior, BindingTargetSubscriber, CSSModulesProcessorRegistry, CaptureBindingCommand, Case, CheckedObserver, ChildrenBinding, ClassAttributeAccessor, ClassBindingCommand, Hi as ColonPrefixedBindAttributePattern, ComputedWatcher, ContentBinding, Controller, ce as CustomAttribute, CustomAttributeDefinition, hs as CustomAttributeRenderer, Ti as CustomElement, CustomElementDefinition, as as CustomElementRenderer, DataAttributeAccessor, DebounceBindingBehavior, DefaultBindingCommand, Pn as DefaultBindingLanguage, Rn as DefaultBindingSyntax, DefaultCase, En as DefaultComponents, Mn as DefaultRenderers, Ln as DefaultResources, qi as DotSeparatedAttributePattern, Else, EventModifier, Ee as EventModifierRegistration, ExpressionWatcher, FlushQueue, Focus, ForBindingCommand, FragmentNodeSequence, FromViewBindingBehavior, FromViewBindingCommand, FulfilledTemplateController, HydrateAttributeInstruction, HydrateElementInstruction, HydrateLetElementInstruction, HydrateTemplateController, Ri as IAppRoot, ne as IAppTask, zi as IAttrMapper, Mi as IAttributeParser, Li as IAttributePattern, _e as IAuSlotWatcher, De as IAuSlotsInfo, Ii as IAurelia, kn as IBindablesInfoResolver, ai as IController, Te as IEventModifier, mi as IEventTarget, we as IFlushQueue, xi as IHistory, hi as IHydrationContext, ns as IInstruction, Se as IKeyMapping, ue as ILifecycleHooks, vs as IListenerBindingOptions, bi as ILocation, Be as IModifiedEventHandlerCreator, di as INode, oe as IPlatform, gi as IRenderLocation, os as IRenderer, Ls as IRendering, Ui as ISVGAnalyzer, cn as ISanitizer, _s as IShadowDOMGlobalStyles, Ms as IShadowDOMStyleFactory, Ds as IShadowDOMStyles, ee as ISignaler, Pi as ISyntaxInterpreter, rs as ITemplateCompiler, Sn as ITemplateCompilerHooks, un as ITemplateElementFactory, Re as IViewFactory, wi as IWindow, If, is as InstructionType, InterpolationBinding, ds as InterpolationBindingRenderer, InterpolationInstruction, InterpolationPartBinding, Interpretation, IteratorBindingInstruction, gs as IteratorBindingRenderer, LetBinding, LetBindingInstruction, us as LetElementRenderer, fe as LifecycleHooks, LifecycleHooksDefinition, LifecycleHooksEntry, ListenerBinding, ListenerBindingInstruction, ListenerBindingOptions, ws as ListenerBindingRenderer, MultiAttrInstruction, NodeObserverLocator, NoopSVGAnalyzer, OneTimeBindingBehavior, OneTimeBindingCommand, PendingTemplateController, Portal, PromiseTemplateController, PropertyBinding, PropertyBindingInstruction, ms as PropertyBindingRenderer, Fi as RefAttributePattern, RefBinding, RefBindingInstruction, fs as RefBindingRenderer, RejectedTemplateController, Rendering, Repeat, SVGAnalyzer, SanitizeValueConverter, Scope, SelectValueObserver, SelfBindingBehavior, SetAttributeInstruction, bs as SetAttributeRenderer, SetClassAttributeInstruction, xs as SetClassAttributeRenderer, SetPropertyInstruction, ls as SetPropertyRenderer, SetStyleAttributeInstruction, ys as SetStyleAttributeRenderer, ShadowDOMRegistry, In as ShortHandBindingSyntax, SignalBindingBehavior, SpreadBindingInstruction, SpreadElementPropBindingInstruction, As as SpreadRenderer, Dn as StandardConfiguration, li as State, StyleAttributeAccessor, StyleBindingCommand, qs as StyleConfiguration, StyleElementStyles, StylePropertyBindingInstruction, ks as StylePropertyBindingRenderer, Switch, TemplateCompiler, Tn as TemplateCompilerHooks, cs as TemplateControllerRenderer, TextBindingInstruction, ps as TextBindingRenderer, ThrottleBindingBehavior, ToViewBindingBehavior, ToViewBindingCommand, TriggerBindingCommand, TwoWayBindingBehavior, TwoWayBindingCommand, UpdateTriggerBindingBehavior, ValueAttributeObserver, ge as ValueConverter, ValueConverterDefinition, ViewFactory, le as Watch, With, alias, At as astAssign, St as astBind, Bt as astEvaluate, Tt as astUnbind, attributePattern, bindable, bindingBehavior, bindingCommand, capture, children, coercer, containerless, convertToRenderLocation, cssModules, customAttribute, customElement, getEffectiveParentNode, getRef, isCustomElementController, isCustomElementViewModel, isInstruction, isRenderLocation, lifecycleHooks, ve as mixinAstEvaluator, pe as mixinUseScope, be as mixingBindingLimited, processContent, registerAliases, renderer, setEffectiveParentNode, setRef, shadowCSS, slotted, templateCompilerHooks, templateController, useShadowDOM, valueConverter, watch };
//# sourceMappingURL=index.mjs.map
