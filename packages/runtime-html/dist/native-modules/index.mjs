import { DestructuringAssignmentSingleExpression as t, IExpressionParser as e, AccessScopeExpression as s } from "../../../expression-parser/dist/native-modules/index.mjs";

import { isArrayIndex as i, Protocol as n, getPrototypeChain as r, kebabCase as l, noop as a, DI as h, Registration as c, firstDefined as u, mergeArrays as f, resourceBaseName as d, resource as m, getResourceKeyFor as g, resolve as p, IPlatform as v, emptyArray as x, Registrable as b, all as w, InstanceProvider as y, IContainer as k, optionalResource as C, optional as B, onResolveAll as A, onResolve as S, fromDefinitionOrDefault as E, pascalCase as R, fromAnnotationOrDefinitionOrTypeOrDefault as T, fromAnnotationOrTypeOrDefault as L, createImplementationRegister as M, IServiceLocator as D, emptyObject as I, ILogger as q, transient as P } from "../../../kernel/dist/native-modules/index.mjs";

import { AccessorType as _, connectable as F, subscriberCollection as O, IObserverLocator as V, ConnectableSwitcher as H, ProxyObservable as N, ICoercionConfiguration as $, PropertyAccessor as j, INodeObserverLocator as W, IDirtyChecker as U, getObserverLookup as z, SetterObserver as G, createIndexMap as K, getCollectionObserver as X, DirtyChecker as Q } from "../../../runtime/dist/native-modules/index.mjs";

import { BindingMode as Y, InstructionType as Z, ITemplateCompiler as J, IInstruction as tt, IAttrMapper as et, IBindablesInfoResolver as st, IResourceResolver as it, TemplateCompiler as nt, BindingCommand as rt, AttributePattern as ot, AttrSyntax as lt, RefAttributePattern as at, DotSeparatedAttributePattern as ht, SpreadAttributePattern as ct, EventAttributePattern as ut, AtPrefixedTriggerAttributePattern as ft, ColonPrefixedBindAttributePattern as dt, DefaultBindingCommand as mt, OneTimeBindingCommand as gt, FromViewBindingCommand as pt, ToViewBindingCommand as vt, TwoWayBindingCommand as xt, ForBindingCommand as bt, RefBindingCommand as wt, TriggerBindingCommand as yt, CaptureBindingCommand as kt, ClassBindingCommand as Ct, StyleBindingCommand as Bt, AttrBindingCommand as At, SpreadBindingCommand as St } from "../../../template-compiler/dist/native-modules/index.mjs";

export { BindingCommand, BindingMode } from "../../../template-compiler/dist/native-modules/index.mjs";

import { Metadata as Et, isObject as Rt } from "../../../metadata/dist/native-modules/index.mjs";

import { BrowserPlatform as Tt } from "../../../platform-browser/dist/native-modules/index.mjs";

import { TaskAbortError as Lt } from "../../../platform/dist/native-modules/index.mjs";

const Mt = Object;

const Dt = String;

const It = Mt.prototype;

const createLookup = () => Mt.create(null);

const createError$1 = t => new Error(t);

const qt = It.hasOwnProperty;

const Pt = Mt.freeze;

const _t = Mt.assign;

const Ft = Mt.getOwnPropertyNames;

const Ot = Mt.keys;

const Vt = /*@__PURE__*/ createLookup();

const isDataAttribute = (t, e, s) => {
    if (Vt[e] === true) {
        return true;
    }
    if (!isString(e)) {
        return false;
    }
    const i = e.slice(0, 5);
    return Vt[e] = i === "aria-" || i === "data-" || s.isStandardSvgAttribute(t, e);
};

const isPromise = t => t instanceof Promise;

const isArray = t => t instanceof Array;

const isFunction = t => typeof t === "function";

const isObject = t => t instanceof Mt;

const isString = t => typeof t === "string";

const isSymbol = t => typeof t === "symbol";

const rethrow = t => {
    throw t;
};

const Ht = Mt.is;

const Nt = Reflect.defineProperty;

const defineHiddenProp = (t, e, s) => {
    Nt(t, e, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: s
    });
    return s;
};

const addSignalListener = (t, e, s) => t.addSignalListener(e, s);

const removeSignalListener = (t, e, s) => t.removeSignalListener(e, s);

const $t = "Interpolation";

const jt = "IsIterator";

const Wt = "IsFunction";

const Ut = "IsProperty";

const zt = "pending";

const Gt = "running";

const Kt = _.Observer;

const Xt = _.Node;

const Qt = _.Layout;

const createMappedError = (t, ...e) => new Error(`AUR${Dt(t).padStart(4, "0")}:${e.map(Dt)}`);

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

const {astAssign: Yt, astEvaluate: Zt, astBind: Jt, astUnbind: te} = /*@__PURE__*/ (() => {
    const e = "AccessThis";
    const s = "AccessBoundary";
    const n = "AccessGlobal";
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
    const x = "TaggedTemplate";
    const b = "Binary";
    const w = "Conditional";
    const y = "Assign";
    const k = "ArrowFunction";
    const C = "ValueConverter";
    const B = "BindingBehavior";
    const A = "ArrayBindingPattern";
    const S = "ObjectBindingPattern";
    const E = "BindingIdentifier";
    const R = "ForOfStatement";
    const T = "Interpolation";
    const L = "ArrayDestructuring";
    const M = "ObjectDestructuring";
    const D = "DestructuringAssignmentLeaf";
    const I = "Custom";
    const q = Scope.getContext;
    function astEvaluate(t, i, _, F) {
        switch (t.$kind) {
          case e:
            {
                let e = i.overrideContext;
                let s = i;
                let n = t.ancestor;
                while (n-- && e) {
                    s = s.parent;
                    e = s?.overrideContext ?? null;
                }
                return n < 1 && s ? s.bindingContext : void 0;
            }

          case s:
            {
                let t = i;
                while (t != null && !t.isBoundary) {
                    t = t.parent;
                }
                return t ? t.bindingContext : void 0;
            }

          case r:
            {
                const e = q(i, t.name, t.ancestor);
                if (F !== null) {
                    F.observe(e, t.name);
                }
                const s = e[t.name];
                if (s == null && t.name === "$host") {
                    throw createMappedError(105);
                }
                if (_?.strict) {
                    return _?.boundFn && isFunction(s) ? s.bind(e) : s;
                }
                return s == null ? "" : _?.boundFn && isFunction(s) ? s.bind(e) : s;
            }

          case n:
            return globalThis[t.name];

          case g:
            {
                const e = globalThis[t.name];
                if (isFunction(e)) {
                    return e(...t.args.map((t => astEvaluate(t, i, _, F))));
                }
                if (!_?.strictFnCall && e == null) {
                    return void 0;
                }
                throw createMappedError(107);
            }

          case l:
            return t.elements.map((t => astEvaluate(t, i, _, F)));

          case a:
            {
                const e = {};
                for (let s = 0; s < t.keys.length; ++s) {
                    e[t.keys[s]] = astEvaluate(t.values[s], i, _, F);
                }
                return e;
            }

          case h:
            return t.value;

          case c:
            {
                let e = t.cooked[0];
                for (let s = 0; s < t.expressions.length; ++s) {
                    e += String(astEvaluate(t.expressions[s], i, _, F));
                    e += t.cooked[s + 1];
                }
                return e;
            }

          case u:
            switch (t.operation) {
              case "void":
                return void astEvaluate(t.expression, i, _, F);

              case "typeof":
                return typeof astEvaluate(t.expression, i, _, F);

              case "!":
                return !astEvaluate(t.expression, i, _, F);

              case "-":
                return -astEvaluate(t.expression, i, _, F);

              case "+":
                return +astEvaluate(t.expression, i, _, F);

              default:
                throw createMappedError(109, t.operation);
            }

          case f:
            {
                const e = t.args.map((t => astEvaluate(t, i, _, F)));
                const s = q(i, t.name, t.ancestor);
                const n = getFunction(_?.strictFnCall, s, t.name);
                if (n) {
                    return n.apply(s, e);
                }
                return void 0;
            }

          case d:
            {
                const e = astEvaluate(t.object, i, _, F);
                const s = t.args.map((t => astEvaluate(t, i, _, F)));
                const n = getFunction(_?.strictFnCall, e, t.name);
                let r;
                if (n) {
                    r = n.apply(e, s);
                    if (isArray(e) && P.includes(t.name)) {
                        F?.observeCollection(e);
                    }
                }
                return r;
            }

          case m:
            {
                const e = astEvaluate(t.func, i, _, F);
                if (isFunction(e)) {
                    return e(...t.args.map((t => astEvaluate(t, i, _, F))));
                }
                if (!_?.strictFnCall && e == null) {
                    return void 0;
                }
                throw createMappedError(107);
            }

          case k:
            {
                const func = (...e) => {
                    const s = t.args;
                    const n = t.rest;
                    const r = s.length - 1;
                    const l = s.reduce(((t, s, i) => {
                        if (n && i === r) {
                            t[s.name] = e.slice(i);
                        } else {
                            t[s.name] = e[i];
                        }
                        return t;
                    }), {});
                    const a = Scope.fromParent(i, l);
                    return astEvaluate(t.body, a, _, F);
                };
                return func;
            }

          case p:
            {
                const e = astEvaluate(t.object, i, _, F);
                let s;
                if (_?.strict) {
                    if (e == null) {
                        return undefined;
                    }
                    if (F !== null && !t.accessGlobal) {
                        F.observe(e, t.name);
                    }
                    s = e[t.name];
                    if (_?.boundFn && isFunction(s)) {
                        return s.bind(e);
                    }
                    return s;
                }
                if (F !== null && isObject(e) && !t.accessGlobal) {
                    F.observe(e, t.name);
                }
                if (e) {
                    s = e[t.name];
                    if (_?.boundFn && isFunction(s)) {
                        return s.bind(e);
                    }
                    return s;
                }
                return "";
            }

          case v:
            {
                const e = astEvaluate(t.object, i, _, F);
                const s = astEvaluate(t.key, i, _, F);
                if (isObject(e)) {
                    if (F !== null && !t.accessGlobal) {
                        F.observe(e, s);
                    }
                    return e[s];
                }
                return e == null ? void 0 : e[s];
            }

          case x:
            {
                const e = t.expressions.map((t => astEvaluate(t, i, _, F)));
                const s = astEvaluate(t.func, i, _, F);
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
                    return astEvaluate(e, i, _, F) && astEvaluate(s, i, _, F);

                  case "||":
                    return astEvaluate(e, i, _, F) || astEvaluate(s, i, _, F);

                  case "??":
                    return astEvaluate(e, i, _, F) ?? astEvaluate(s, i, _, F);

                  case "==":
                    return astEvaluate(e, i, _, F) == astEvaluate(s, i, _, F);

                  case "===":
                    return astEvaluate(e, i, _, F) === astEvaluate(s, i, _, F);

                  case "!=":
                    return astEvaluate(e, i, _, F) != astEvaluate(s, i, _, F);

                  case "!==":
                    return astEvaluate(e, i, _, F) !== astEvaluate(s, i, _, F);

                  case "instanceof":
                    {
                        const t = astEvaluate(s, i, _, F);
                        if (isFunction(t)) {
                            return astEvaluate(e, i, _, F) instanceof t;
                        }
                        return false;
                    }

                  case "in":
                    {
                        const t = astEvaluate(s, i, _, F);
                        if (isObject(t)) {
                            return astEvaluate(e, i, _, F) in t;
                        }
                        return false;
                    }

                  case "+":
                    {
                        const t = astEvaluate(e, i, _, F);
                        const n = astEvaluate(s, i, _, F);
                        if (_?.strict) {
                            return t + n;
                        }
                        if (!t || !n) {
                            if (isNumberOrBigInt(t) || isNumberOrBigInt(n)) {
                                return (t || 0) + (n || 0);
                            }
                            if (isStringOrDate(t) || isStringOrDate(n)) {
                                return (t || "") + (n || "");
                            }
                        }
                        return t + n;
                    }

                  case "-":
                    return astEvaluate(e, i, _, F) - astEvaluate(s, i, _, F);

                  case "*":
                    return astEvaluate(e, i, _, F) * astEvaluate(s, i, _, F);

                  case "/":
                    return astEvaluate(e, i, _, F) / astEvaluate(s, i, _, F);

                  case "%":
                    return astEvaluate(e, i, _, F) % astEvaluate(s, i, _, F);

                  case "<":
                    return astEvaluate(e, i, _, F) < astEvaluate(s, i, _, F);

                  case ">":
                    return astEvaluate(e, i, _, F) > astEvaluate(s, i, _, F);

                  case "<=":
                    return astEvaluate(e, i, _, F) <= astEvaluate(s, i, _, F);

                  case ">=":
                    return astEvaluate(e, i, _, F) >= astEvaluate(s, i, _, F);

                  default:
                    throw createMappedError(108, t.operation);
                }
            }

          case w:
            return astEvaluate(t.condition, i, _, F) ? astEvaluate(t.yes, i, _, F) : astEvaluate(t.no, i, _, F);

          case y:
            return astAssign(t.target, i, _, astEvaluate(t.value, i, _, F));

          case C:
            {
                const e = _?.getConverter?.(t.name);
                if (e == null) {
                    throw createMappedError(103, t.name);
                }
                if ("toView" in e) {
                    return e.toView(astEvaluate(t.expression, i, _, F), ...t.args.map((t => astEvaluate(t, i, _, F))));
                }
                return astEvaluate(t.expression, i, _, F);
            }

          case B:
            return astEvaluate(t.expression, i, _, F);

          case E:
            return t.name;

          case R:
            return astEvaluate(t.iterable, i, _, F);

          case T:
            if (t.isMulti) {
                let e = t.parts[0];
                let s = 0;
                for (;s < t.expressions.length; ++s) {
                    e += Dt(astEvaluate(t.expressions[s], i, _, F));
                    e += t.parts[s + 1];
                }
                return e;
            } else {
                return `${t.parts[0]}${astEvaluate(t.firstExpression, i, _, F)}${t.parts[1]}`;
            }

          case D:
            return astEvaluate(t.target, i, _, F);

          case L:
            {
                return t.list.map((t => astEvaluate(t, i, _, F)));
            }

          case A:
          case S:
          case M:
          default:
            return void 0;

          case I:
            return t.evaluate(i, _, F);
        }
    }
    function astAssign(e, s, n, l) {
        switch (e.$kind) {
          case r:
            {
                if (e.name === "$host") {
                    throw createMappedError(106);
                }
                const t = q(s, e.name, e.ancestor);
                return t[e.name] = l;
            }

          case p:
            {
                const t = astEvaluate(e.object, s, n, null);
                if (isObject(t)) {
                    if (e.name === "length" && isArray(t) && !isNaN(l)) {
                        t.splice(l);
                    } else {
                        t[e.name] = l;
                    }
                } else {
                    astAssign(e.object, s, n, {
                        [e.name]: l
                    });
                }
                return l;
            }

          case v:
            {
                const t = astEvaluate(e.object, s, n, null);
                const r = astEvaluate(e.key, s, n, null);
                if (isArray(t)) {
                    if (r === "length" && !isNaN(l)) {
                        t.splice(l);
                        return l;
                    }
                    if (i(r)) {
                        t.splice(r, 1, l);
                        return l;
                    }
                }
                return t[r] = l;
            }

          case y:
            astAssign(e.value, s, n, l);
            return astAssign(e.target, s, n, l);

          case C:
            {
                const t = n?.getConverter?.(e.name);
                if (t == null) {
                    throw createMappedError(103, e.name);
                }
                if ("fromView" in t) {
                    l = t.fromView(l, ...e.args.map((t => astEvaluate(t, s, n, null))));
                }
                return astAssign(e.expression, s, n, l);
            }

          case B:
            return astAssign(e.expression, s, n, l);

          case L:
          case M:
            {
                const t = e.list;
                const i = t.length;
                let r;
                let a;
                for (r = 0; r < i; r++) {
                    a = t[r];
                    switch (a.$kind) {
                      case D:
                        astAssign(a, s, n, l);
                        break;

                      case L:
                      case M:
                        {
                            if (typeof l !== "object" || l === null) {
                                throw createMappedError(112);
                            }
                            let t = astEvaluate(a.source, Scope.create(l), n, null);
                            if (t === void 0 && a.initializer) {
                                t = astEvaluate(a.initializer, s, n, null);
                            }
                            astAssign(a, s, n, t);
                            break;
                        }
                    }
                }
                break;
            }

          case D:
            {
                if (e instanceof t) {
                    if (l == null) {
                        return;
                    }
                    if (typeof l !== "object") {
                        throw createMappedError(112);
                    }
                    let t = astEvaluate(e.source, Scope.create(l), n, null);
                    if (t === void 0 && e.initializer) {
                        t = astEvaluate(e.initializer, s, n, null);
                    }
                    astAssign(e.target, s, n, t);
                } else {
                    if (l == null) {
                        return;
                    }
                    if (typeof l !== "object") {
                        throw createMappedError(112);
                    }
                    const t = e.indexOrProperties;
                    let r;
                    if (i(t)) {
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
                    astAssign(e.target, s, n, r);
                }
                break;
            }

          case I:
            return e.assign(s, n, l);

          default:
            return void 0;
        }
    }
    function astBind(t, e, s) {
        switch (t.$kind) {
          case B:
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

          case R:
            {
                astBind(t.iterable, e, s);
                break;
            }

          case I:
            {
                t.bind?.(e, s);
            }
        }
    }
    function astUnbind(t, e, s) {
        switch (t.$kind) {
          case B:
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

          case R:
            {
                astUnbind(t.iterable, e, s);
                break;
            }

          case I:
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
    const P = "at map filter includes indexOf lastIndexOf findIndex find flat flatMap join reduce reduceRight slice every some sort".split(" ");
    return {
        astEvaluate: astEvaluate,
        astAssign: astAssign,
        astBind: astBind,
        astUnbind: astUnbind
    };
})();

const {default: ee, oneTime: se, toView: ie, fromView: ne, twoWay: re} = Y;

const oe = Et.get;

const le = Et.has;

const ae = Et.define;

const {annotation: he} = n;

const ce = he.keyFor;

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
        const r = e.metadata[ue] ??= createLookup();
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

const ue = /*@__PURE__*/ ce("bindables");

const fe = Pt({
    name: ue,
    keyFrom: t => `${ue}:${t}`,
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
                Ot(t).forEach((e => addDescription(e, t[e])));
            }
        }
        t.forEach(addList);
        return e;
    },
    getAll(t) {
        const e = [];
        const s = r(t);
        let i = s.length;
        let n;
        while (--i >= 0) {
            n = s[i];
            const t = oe(ue, n);
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
        const s = e.mode ?? ie;
        return new BindableDefinition(e.attribute ?? l(t), e.callback ?? `${t}Changed`, isString(s) ? Y[s] ?? ee : s, e.primary ?? false, e.name ?? t, e.set ?? getInterceptor(e));
    }
}

function coercer(t, e) {
    e.addInitializer((function() {
        de.define(this, e.name);
    }));
}

const de = {
    key: /*@__PURE__*/ ce("coercer"),
    define(t, e) {
        ae(t[e].bind(t), t, de.key);
    },
    for(t) {
        return oe(de.key, t);
    }
};

function getInterceptor(t = {}) {
    const e = t.type ?? null;
    if (e == null) {
        return a;
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
            s = typeof t === "function" ? t.bind(e) : de.for(e) ?? a;
            break;
        }
    }
    return s === a ? s : createCoercer(s, t.nullable);
}

function createCoercer(t, e) {
    return function(s, i) {
        if (!i?.enableCoercion) return s;
        return (e ?? (i?.coerceNullish ?? false ? false : true)) && s == null ? s : t(s, i);
    };
}

const me = h.createInterface;

const ge = c.singleton;

const pe = c.aliasTo;

const ve = c.instance;

c.callback;

c.transient;

const registerResolver = (t, e, s) => t.registerResolver(e, s);

function alias(...t) {
    return function(e, s) {
        s.addInitializer((function() {
            const e = ce("aliases");
            const s = oe(e, this);
            if (s === void 0) {
                ae(t, this, e);
            } else {
                s.push(...t);
            }
        }));
    };
}

function registerAliases(t, e, s, i) {
    for (let n = 0, r = t.length; n < r; ++n) {
        c.aliasTo(s, e.keyFrom(t[n])).register(i);
    }
}

const xe = "custom-element";

const be = "custom-attribute";

const getDefinitionFromStaticAu = (t, e, s, i = "__au_static_resource__") => {
    let n = oe(i, t);
    if (n == null) {
        if (t.$au?.type === e) {
            n = s(t.$au, t);
            ae(n, t, i);
        }
    }
    return n;
};

function bindingBehavior(t) {
    return function(e, s) {
        s.addInitializer((function() {
            ke.define(t, this);
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
        return new BindingBehaviorDefinition(e, u(getBehaviorAnnotation(e, "name"), s), f(getBehaviorAnnotation(e, "aliases"), i.aliases, e.aliases), ke.keyFrom(s));
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getBindingBehaviorKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : ge(s, s), pe(s, i), ...n.map((t => pe(s, getBindingBehaviorKeyFrom(t)))));
        }
    }
}

const we = "binding-behavior";

const ye = /*@__PURE__*/ g(we);

const getBehaviorAnnotation = (t, e) => oe(ce(e), t);

const getBindingBehaviorKeyFrom = t => `${ye}:${t}`;

const ke = /*@__PURE__*/ Pt({
    name: ye,
    keyFrom: getBindingBehaviorKeyFrom,
    isType(t) {
        return isFunction(t) && (le(ye, t) || t.$au?.type === we);
    },
    define(t, e) {
        const s = BindingBehaviorDefinition.create(t, e);
        const i = s.Type;
        ae(s, i, ye, d);
        return i;
    },
    getDefinition(t) {
        const e = oe(ye, t) ?? getDefinitionFromStaticAu(t, we, BindingBehaviorDefinition.create);
        if (e === void 0) {
            throw createMappedError(151, t);
        }
        return e;
    },
    find(t, e) {
        const s = t.find(we, e);
        return s == null ? null : oe(ye, s) ?? getDefinitionFromStaticAu(s, we, BindingBehaviorDefinition.create) ?? null;
    },
    get(t, e) {
        return t.get(m(getBindingBehaviorKeyFrom(e)));
    }
});

const Ce = new Map;

const createConfig = t => ({
    type: we,
    name: t
});

class BindingModeBehavior {
    bind(t, e) {
        Ce.set(e, e.mode);
        e.mode = this.mode;
    }
    unbind(t, e) {
        e.mode = Ce.get(e);
        Ce.delete(e);
    }
}

class OneTimeBindingBehavior extends BindingModeBehavior {
    get mode() {
        return se;
    }
}

OneTimeBindingBehavior.$au = createConfig("oneTime");

class ToViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return ie;
    }
}

ToViewBindingBehavior.$au = createConfig("toView");

class FromViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return ne;
    }
}

FromViewBindingBehavior.$au = createConfig("fromView");

class TwoWayBindingBehavior extends BindingModeBehavior {
    get mode() {
        return re;
    }
}

TwoWayBindingBehavior.$au = createConfig("twoWay");

const Be = new WeakMap;

const Ae = 200;

class DebounceBindingBehavior {
    constructor() {
        this.p = p(v);
    }
    bind(t, e, s, i) {
        const n = {
            type: "debounce",
            delay: s ?? Ae,
            now: this.p.performanceNow,
            queue: this.p.taskQueue,
            signals: isString(i) ? [ i ] : i ?? x
        };
        const r = e.limit?.(n);
        if (r == null) ; else {
            Be.set(e, r);
        }
    }
    unbind(t, e) {
        Be.get(e)?.dispose();
        Be.delete(e);
    }
}

DebounceBindingBehavior.$au = {
    type: we,
    name: "debounce"
};

const Se = /*@__PURE__*/ me("ISignaler", (t => t.singleton(Signaler)));

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
        this.h = p(Se);
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
            addSignalListener(this.h, i, e);
        }
    }
    unbind(t, e) {
        const s = this.i.get(e);
        this.i.delete(e);
        let i;
        for (i of s) {
            removeSignalListener(this.h, i, e);
        }
    }
}

SignalBindingBehavior.$au = {
    type: we,
    name: "signal"
};

const Ee = new WeakMap;

const Re = 200;

class ThrottleBindingBehavior {
    constructor() {
        ({performanceNow: this.u, taskQueue: this.C} = p(v));
    }
    bind(t, e, s, i) {
        const n = {
            type: "throttle",
            delay: s ?? Re,
            now: this.u,
            queue: this.C,
            signals: isString(i) ? [ i ] : i ?? x
        };
        const r = e.limit?.(n);
        if (r == null) ; else {
            Ee.set(e, r);
        }
    }
    unbind(t, e) {
        Ee.get(e)?.dispose();
        Ee.delete(e);
    }
}

ThrottleBindingBehavior.$au = {
    type: we,
    name: "throttle"
};

const Te = /*@__PURE__*/ me("IAppTask");

class $AppTask {
    constructor(t, e, s) {
        this.c = void 0;
        this.slot = t;
        this.k = e;
        this.cb = s;
    }
    register(t) {
        return this.c = t.register(ve(Te, this));
    }
    run() {
        const t = this.k;
        const e = this.cb;
        return t === null ? e() : e(this.c.get(t));
    }
}

const Le = Pt({
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

const Me = v;

function watch(t, e) {
    if (t == null) {
        throw createMappedError(772);
    }
    return function decorator(s, i) {
        const n = i.kind === "class";
        if (n) {
            if (!isFunction(e) && (e == null || !(e in s.prototype))) {
                throw createMappedError(773, `${Dt(e)}@${s.name}}`);
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
            De.add(t, r);
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

const De = /*@__PURE__*/ (() => {
    const t = new WeakMap;
    return Pt({
        add(e, s) {
            let i = t.get(e);
            if (i == null) {
                t.set(e, i = []);
            }
            i.push(s);
        },
        getDefinitions(e) {
            return t.get(e) ?? x;
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
    get type() {
        return be;
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
        const n = u(getAttributeAnnotation(e, "defaultBindingMode"), i.defaultBindingMode, e.defaultBindingMode, ie);
        return new CustomAttributeDefinition(e, u(getAttributeAnnotation(e, "name"), s), f(getAttributeAnnotation(e, "aliases"), i.aliases, e.aliases), getAttributeKeyFrom(s), isString(n) ? Y[n] ?? ee : n, u(getAttributeAnnotation(e, "isTemplateController"), i.isTemplateController, e.isTemplateController, false), fe.from(...fe.getAll(e), getAttributeAnnotation(e, "bindables"), e.bindables, i.bindables), u(getAttributeAnnotation(e, "noMultiBindings"), i.noMultiBindings, e.noMultiBindings, false), f(De.getDefinitions(e), e.watches), f(getAttributeAnnotation(e, "dependencies"), i.dependencies, e.dependencies), u(getAttributeAnnotation(e, "containerStrategy"), i.containerStrategy, e.containerStrategy, "reuse"));
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getAttributeKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : ge(s, s), pe(s, i), ...n.map((t => pe(s, getAttributeKeyFrom(t)))));
        }
    }
    toString() {
        return `au:ca:${this.name}`;
    }
}

const Ie = "custom-attribute";

const qe = /*@__PURE__*/ g(Ie);

const getAttributeKeyFrom = t => `${qe}:${t}`;

const getAttributeAnnotation = (t, e) => oe(ce(e), t);

const isAttributeType = t => isFunction(t) && (le(qe, t) || t.$au?.type === Ie);

const findAttributeControllerFor = (t, e) => getRef(t, getAttributeKeyFrom(e)) ?? void 0;

const defineAttribute = (t, e) => {
    const s = CustomAttributeDefinition.create(t, e);
    const i = s.Type;
    ae(s, i, qe, d);
    return i;
};

const getAttributeDefinition = t => {
    const e = oe(qe, t) ?? getDefinitionFromStaticAu(t, Ie, CustomAttributeDefinition.create);
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

const Pe = /*@__PURE__*/ Pt({
    name: qe,
    keyFrom: getAttributeKeyFrom,
    isType: isAttributeType,
    for: findAttributeControllerFor,
    closest: findClosestControllerByName,
    define: defineAttribute,
    getDefinition: getAttributeDefinition,
    annotate(t, e, s) {
        ae(s, t, ce(e));
    },
    getAnnotation: getAttributeAnnotation,
    find(t, e) {
        const s = t.find(Ie, e);
        return s === null ? null : oe(qe, s) ?? getDefinitionFromStaticAu(s, Ie, CustomAttributeDefinition.create) ?? null;
    }
});

const _e = /*@__PURE__*/ me("ILifecycleHooks");

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
        while (i !== It) {
            for (const t of Ft(i)) {
                if (t !== "constructor" && !t.startsWith("_")) {
                    s.add(t);
                }
            }
            i = Object.getPrototypeOf(i);
        }
        return new LifecycleHooksDefinition(e, s);
    }
}

const Fe = /*@__PURE__*/ (() => {
    const t = new WeakMap;
    const e = new WeakMap;
    return Pt({
        define(t, s) {
            const i = LifecycleHooksDefinition.create(t, s);
            const n = i.Type;
            e.set(n, i);
            return b.define(n, (t => {
                ge(_e, n).register(t);
            }));
        },
        resolve(s) {
            let i = t.get(s);
            if (i === void 0) {
                t.set(s, i = new LifecycleHooksLookupImpl);
                const n = s.root;
                const r = n === s ? s.getAll(_e) : s.has(_e, false) ? n.getAll(_e).concat(s.getAll(_e)) : n.getAll(_e);
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
        return Fe.define({}, t);
    }
    return t == null ? decorator : decorator(t);
}

function valueConverter(t) {
    return function(e, s) {
        s.addInitializer((function() {
            He.define(t, this);
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
        return new ValueConverterDefinition(e, u(getConverterAnnotation(e, "name"), s), f(getConverterAnnotation(e, "aliases"), i.aliases, e.aliases), He.keyFrom(s));
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getValueConverterKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : ge(s, s), pe(s, i), ...n.map((t => pe(s, getValueConverterKeyFrom(t)))));
        }
    }
}

const Oe = "value-converter";

const Ve = /*@__PURE__*/ g(Oe);

const getConverterAnnotation = (t, e) => oe(ce(e), t);

const getValueConverterKeyFrom = t => `${Ve}:${t}`;

const He = Pt({
    name: Ve,
    keyFrom: getValueConverterKeyFrom,
    isType(t) {
        return isFunction(t) && (le(Ve, t) || t.$au?.type === Oe);
    },
    define(t, e) {
        const s = ValueConverterDefinition.create(t, e);
        const i = s.Type;
        ae(s, i, Ve, d);
        return i;
    },
    getDefinition(t) {
        const e = oe(Ve, t) ?? getDefinitionFromStaticAu(t, Oe, ValueConverterDefinition.create);
        if (e === void 0) {
            throw createMappedError(152, t);
        }
        return e;
    },
    annotate(t, e, s) {
        ae(s, t, ce(e));
    },
    getAnnotation: getConverterAnnotation,
    find(t, e) {
        const s = t.find(Oe, e);
        return s == null ? null : oe(Ve, s) ?? getDefinitionFromStaticAu(s, Oe, ValueConverterDefinition.create) ?? null;
    },
    get(t, e) {
        return t.get(m(getValueConverterKeyFrom(e)));
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
        if (t !== Zt(s.ast, s.s, s, null)) {
            this.v = t;
            this.B.add(this);
        }
    }
}

const Ne = /*@__PURE__*/ (() => {
    function useScope(t) {
        this.s = t;
    }
    return t => {
        defineHiddenProp(t.prototype, "useScope", useScope);
    };
})();

const $e = /*@__PURE__*/ (() => {
    const t = new WeakMap;
    const e = new WeakMap;
    function evaluatorGet(t) {
        return this.l.get(t);
    }
    function evaluatorGetSignaler() {
        return this.l.root.get(Se);
    }
    function evaluatorGetConverter(e) {
        let s = t.get(this);
        if (s == null) {
            t.set(this, s = new ResourceLookup);
        }
        return s[e] ??= He.get(this.l, e);
    }
    function evaluatorGetBehavior(t) {
        let s = e.get(this);
        if (s == null) {
            e.set(this, s = new ResourceLookup);
        }
        return s[t] ??= ke.get(this.l, t);
    }
    return (t, e = true) => s => {
        const i = s.prototype;
        if (t != null) {
            Nt(i, "strict", {
                enumerable: true,
                get: function() {
                    return t;
                }
            });
        }
        Nt(i, "strictFnCall", {
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

const je = /*@__PURE__*/ me("IFlushQueue", (t => t.singleton(FlushQueue)));

class FlushQueue {
    constructor() {
        this.A = false;
        this.R = new Set;
    }
    get count() {
        return this.R.size;
    }
    add(t) {
        this.R.add(t);
        if (this.A) {
            return;
        }
        this.A = true;
        try {
            this.R.forEach(flushItem);
        } finally {
            this.A = false;
        }
    }
    clear() {
        this.R.clear();
        this.A = false;
    }
}

const flushItem = function(t, e, s) {
    s.delete(t);
    t.flush();
};

const We = /*@__PURE__*/ (() => {
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
            l = i?.status === zt;
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
            h = i?.status === zt;
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
            const r = n.length > 0 ? this.get(Se) : null;
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

const Ue = (() => {
    const t = new WeakSet;
    return e => function() {
        if (!t.has(this)) {
            t.add(this);
            e.call(this);
        }
    };
})();

const ze = {
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
        this.T = null;
        this.v = void 0;
        this.boundFn = false;
        this.l = e;
        this.ast = n;
        this.L = t;
        this.target = r;
        this.oL = s;
        this.C = i;
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
                let n = Dt(t);
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
                    e.setAttribute(s, Dt(t));
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
        const e = Zt(this.ast, this.s, this, (this.mode & ie) > 0 ? this : null);
        this.obs.clear();
        if (e !== this.v) {
            this.v = e;
            const s = this.L.state !== ni;
            if (s) {
                t = this.T;
                this.T = this.C.queueTask((() => {
                    this.T = null;
                    this.updateTarget(e);
                }), ze);
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
        Jt(this.ast, t, this);
        if (this.mode & (ie | se)) {
            this.updateTarget(this.v = Zt(this.ast, t, this, (this.mode & ie) > 0 ? this : null));
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        te(this.ast, this.s, this);
        this.s = void 0;
        this.v = void 0;
        this.T?.cancel();
        this.T = null;
        this.obs.clearAll();
    }
}

AttributeBinding.mix = Ue((() => {
    Ne(AttributeBinding);
    We(AttributeBinding, (() => "updateTarget"));
    F(AttributeBinding, null);
    $e(true)(AttributeBinding);
}));

const Ge = {
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
        this.T = null;
        this.L = t;
        this.oL = s;
        this.C = i;
        this.M = s.getAccessor(r, l);
        const h = n.expressions;
        const c = this.partBindings = Array(h.length);
        const u = h.length;
        let f = 0;
        for (;u > f; ++f) {
            c[f] = new InterpolationPartBinding(h[f], r, l, e, s, this);
        }
    }
    I() {
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
        const r = this.M;
        const l = this.L.state !== ni && (r.type & Qt) > 0;
        let a;
        if (l) {
            a = this.T;
            this.T = this.C.queueTask((() => {
                this.T = null;
                r.setValue(i, this.target, this.targetProperty);
            }), Ge);
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
        this.T?.cancel();
        this.T = null;
    }
}

class InterpolationPartBinding {
    constructor(t, e, s, i, n, r) {
        this.ast = t;
        this.target = e;
        this.targetProperty = s;
        this.owner = r;
        this.mode = ie;
        this.task = null;
        this.isBound = false;
        this.v = "";
        this.boundFn = false;
        this.l = i;
        this.oL = n;
    }
    updateTarget() {
        this.owner.I();
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = Zt(this.ast, this.s, this, (this.mode & ie) > 0 ? this : null);
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
        Jt(this.ast, t, this);
        this.v = Zt(this.ast, this.s, this, (this.mode & ie) > 0 ? this : null);
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
        te(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

InterpolationPartBinding.mix = Ue((() => {
    Ne(InterpolationPartBinding);
    We(InterpolationPartBinding, (() => "updateTarget"));
    F(InterpolationPartBinding, null);
    $e(true)(InterpolationPartBinding);
}));

const Ke = {
    reusable: false,
    preempt: true
};

class ContentBinding {
    constructor(t, e, s, i, n, r, l) {
        this.p = n;
        this.ast = r;
        this.target = l;
        this.isBound = false;
        this.mode = ie;
        this.T = null;
        this.v = "";
        this.q = false;
        this.boundFn = false;
        this.strict = true;
        this.l = e;
        this.L = t;
        this.oL = s;
        this.C = i;
    }
    updateTarget(t) {
        const e = this.target;
        const s = this.v;
        this.v = t;
        if (this.q) {
            s.parentNode?.removeChild(s);
            this.q = false;
        }
        if (t instanceof this.p.Node) {
            e.parentNode?.insertBefore(t, e);
            t = "";
            this.q = true;
        }
        e.textContent = Dt(t ?? "");
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = Zt(this.ast, this.s, this, (this.mode & ie) > 0 ? this : null);
        this.obs.clear();
        if (t === this.v) {
            this.T?.cancel();
            this.T = null;
            return;
        }
        const e = this.L.state !== ni;
        if (e) {
            this.P(t);
        } else {
            this.updateTarget(t);
        }
    }
    handleCollectionChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = this.v = Zt(this.ast, this.s, this, (this.mode & ie) > 0 ? this : null);
        this.obs.clear();
        if (isArray(t)) {
            this.observeCollection(t);
        }
        const e = this.L.state !== ni;
        if (e) {
            this.P(t);
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
        Jt(this.ast, t, this);
        const e = this.v = Zt(this.ast, this.s, this, (this.mode & ie) > 0 ? this : null);
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
        te(this.ast, this.s, this);
        if (this.q) {
            this.v.parentNode?.removeChild(this.v);
        }
        this.s = void 0;
        this.obs.clearAll();
        this.T?.cancel();
        this.T = null;
    }
    P(t) {
        const e = this.T;
        this.T = this.C.queueTask((() => {
            this.T = null;
            this.updateTarget(t);
        }), Ke);
        e?.cancel();
    }
}

ContentBinding.mix = Ue((() => {
    Ne(ContentBinding);
    We(ContentBinding, (() => "updateTarget"));
    F(ContentBinding, null);
    $e(void 0, false)(ContentBinding);
}));

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
        this._ = n;
    }
    updateTarget() {
        this.target[this.targetProperty] = this.v;
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        this.v = Zt(this.ast, this.s, this, this);
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
        this.target = this._ ? t.bindingContext : t.overrideContext;
        Jt(this.ast, t, this);
        this.v = Zt(this.ast, this.s, this, this);
        this.updateTarget();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        te(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

LetBinding.mix = Ue((() => {
    Ne(LetBinding);
    We(LetBinding, (() => "updateTarget"));
    F(LetBinding, null);
    $e(true)(LetBinding);
}));

class PropertyBinding {
    constructor(t, e, s, i, n, r, l, a) {
        this.ast = n;
        this.target = r;
        this.targetProperty = l;
        this.mode = a;
        this.isBound = false;
        this.s = void 0;
        this.M = void 0;
        this.T = null;
        this.F = null;
        this.boundFn = false;
        this.l = e;
        this.L = t;
        this.C = i;
        this.oL = s;
    }
    updateTarget(t) {
        this.M.setValue(t, this.target, this.targetProperty);
    }
    updateSource(t) {
        Yt(this.ast, this.s, this, t);
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = Zt(this.ast, this.s, this, (this.mode & ie) > 0 ? this : null);
        this.obs.clear();
        const e = this.L.state !== ni && (this.M.type & Qt) > 0;
        if (e) {
            Xe = this.T;
            this.T = this.C.queueTask((() => {
                this.updateTarget(t);
                this.T = null;
            }), Qe);
            Xe?.cancel();
            Xe = null;
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
        Jt(this.ast, t, this);
        const e = this.oL;
        const s = this.mode;
        let i = this.M;
        if (!i) {
            if (s & ne) {
                i = e.getObserver(this.target, this.targetProperty);
            } else {
                i = e.getAccessor(this.target, this.targetProperty);
            }
            this.M = i;
        }
        const n = (s & ie) > 0;
        if (s & (ie | se)) {
            this.updateTarget(Zt(this.ast, this.s, this, n ? this : null));
        }
        if (s & ne) {
            i.subscribe(this.F ??= new BindingTargetSubscriber(this, this.l.get(je)));
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
        te(this.ast, this.s, this);
        this.s = void 0;
        if (this.F) {
            this.M.unsubscribe(this.F);
            this.F = null;
        }
        this.T?.cancel();
        this.T = null;
        this.obs.clearAll();
    }
    useTargetObserver(t) {
        this.M?.unsubscribe(this);
        (this.M = t).subscribe(this);
    }
    useTargetSubscriber(t) {
        if (this.F != null) {
            throw createMappedError(9995);
        }
        this.F = t;
    }
}

PropertyBinding.mix = Ue((() => {
    Ne(PropertyBinding);
    We(PropertyBinding, (t => t.mode & ne ? "updateSource" : "updateTarget"));
    F(PropertyBinding, null);
    $e(true, false)(PropertyBinding);
}));

let Xe = null;

const Qe = {
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
        Jt(this.ast, t, this);
        Yt(this.ast, this.s, this, this.target);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        if (Zt(this.ast, this.s, this, null) === this.target) {
            Yt(this.ast, this.s, this, null);
        }
        te(this.ast, this.s, this);
        this.s = void 0;
    }
}

RefBinding.mix = Ue((() => {
    $e(false)(RefBinding);
}));

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
        let s = Zt(this.ast, this.s, this, null);
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
        Jt(this.ast, t, this);
        this.target.addEventListener(this.targetEvent, this, this.V);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        te(this.ast, this.s, this);
        this.s = void 0;
        this.target.removeEventListener(this.targetEvent, this, this.V);
    }
}

ListenerBinding.mix = Ue((function() {
    Ne(ListenerBinding);
    We(ListenerBinding, (() => "callSource"));
    $e(true, true)(ListenerBinding);
}));

const Ye = /*@__PURE__*/ me("IEventModifier");

const Ze = /*@__PURE__*/ me("IKeyMapping", (t => t.instance({
    meta: Pt([ "ctrl", "alt", "shift", "meta" ]),
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
        this.H = p(Ze);
        this.N = [ "left", "middle", "right" ];
    }
    static register(t) {
        t.register(ge(Ye, ModifiedMouseEventHandler));
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
                if (this.H.meta.includes(n) && t[`${n}Key`] !== true) {
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
        this.H = p(Ze);
        this.type = [ "keydown", "keyup" ];
    }
    static register(t) {
        t.register(ge(Ye, ModifiedKeyboardEventHandler));
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
                if (this.H.meta.includes(n)) {
                    if (t[`${n}Key`] !== true) {
                        return false;
                    }
                    continue;
                }
                const e = this.H.keys[n];
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

const Je = /*@__PURE__*/ me("IEventModifierHandler", (t => t.instance({
    getHandler: () => null
})));

class EventModifier {
    constructor() {
        this.$ = p(w(Ye)).reduce(((t, e) => {
            const s = isArray(e.type) ? e.type : [ e.type ];
            s.forEach((s => t[s] = e));
            return t;
        }), {});
    }
    static register(t) {
        t.register(ge(Je, EventModifier));
    }
    getHandler(t, e) {
        return isString(e) ? this.$[t]?.getHandler(e) ?? null : null;
    }
}

const ts = {
    register(t) {
        t.register(EventModifier, ModifiedMouseEventHandler, ModifiedKeyboardEventHandler);
    }
};

const es = /*@__PURE__*/ me("IViewFactory");

class ViewFactory {
    constructor(t, e) {
        this.isCaching = false;
        this.j = null;
        this.W = -1;
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
            if (this.W === -1 || !e) {
                this.W = t;
            }
        }
        if (this.W > 0) {
            this.j = [];
        } else {
            this.j = null;
        }
        this.isCaching = this.W > 0;
    }
    canReturnToCache(t) {
        return this.j != null && this.j.length < this.W;
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

const ss = "au-start";

const is = "au-end";

const createComment = (t, e) => t.document.createComment(e);

const createLocation = t => {
    const e = createComment(t, is);
    e.$start = createComment(t, ss);
    return e;
};

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

const createMutationObserver = (t, e) => new t.ownerDocument.defaultView.MutationObserver(e);

const isElement = t => t.nodeType === 1;

const ns = "default";

const rs = "au-slot";

const os = /*@__PURE__*/ me("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

const ls = /*@__PURE__*/ me("IAuSlotWatcher");

class AuSlotWatcherBinding {
    constructor(t, e, s, i) {
        this.U = new Set;
        this.G = x;
        this.isBound = false;
        this.cb = (this.o = t)[e];
        this.slotName = s;
        this.K = i;
    }
    bind() {
        this.isBound = true;
    }
    unbind() {
        this.isBound = false;
    }
    getValue() {
        return this.G;
    }
    watch(t) {
        if (!this.U.has(t)) {
            this.U.add(t);
            t.subscribe(this);
        }
    }
    unwatch(t) {
        if (this.U.delete(t)) {
            t.unsubscribe(this);
        }
    }
    handleSlotChange(t, e) {
        if (!this.isBound) {
            return;
        }
        const s = this.G;
        const i = [];
        let n;
        let r;
        for (n of this.U) {
            for (r of n === t ? e : n.nodes) {
                if (this.K === "*" || isElement(r) && r.matches(this.K)) {
                    i[i.length] = r;
                }
            }
        }
        if (i.length !== s.length || i.some(((t, e) => t !== s[e]))) {
            this.G = i;
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
        this.X = t;
    }
    register(t) {
        ve(_e, this).register(t);
    }
    hydrating(t, e) {
        const s = this.X;
        const i = new AuSlotWatcherBinding(t, s.callback ?? `${Dt(s.name)}Changed`, s.slotName ?? "default", s.query ?? "*");
        Nt(t, s.name, {
            enumerable: true,
            configurable: true,
            get: _t((() => i.getValue()), {
                getObserver: () => i
            }),
            set: () => {}
        });
        ve(ls, i).register(e.container);
        e.addBinding(i);
    }
}

function slotted(t, e) {
    if (!as) {
        as = true;
        O(AuSlotWatcherBinding, null);
        lifecycleHooks()(SlottedLifecycleHooks, null);
    }
    const s = ce("dependencies");
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

let as = false;

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
            const f = n.compileSpread(i.controller.definition, i.instruction?.captures ?? x, i.controller.container, e, s);
            let d;
            for (d of f) {
                switch (d.type) {
                  case Z.spreadBinding:
                    renderSpreadInstruction(t + 1);
                    break;

                  case Z.spreadElementProp:
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
        this.Y = [];
        this.locator = (this.$controller = (this.Z = t).controller).container;
    }
    get(t) {
        return this.locator.get(t);
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        const e = this.scope = this.Z.controller.scope.parent ?? void 0;
        if (e == null) {
            throw createMappedError(9999);
        }
        this.Y.forEach((t => t.bind(e)));
    }
    unbind() {
        this.Y.forEach((t => t.unbind()));
        this.isBound = false;
    }
    addBinding(t) {
        this.Y.push(t);
    }
    addChild(t) {
        if (t.vmKind !== ei) {
            throw createMappedError(9998);
        }
        this.$controller.addChild(t);
    }
}

const hs = /*@__PURE__*/ me("IRenderer");

function renderer(t, e) {
    return b.define(t, (function(t) {
        ge(hs, this).register(t);
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

const cs = /*@__PURE__*/ renderer(class SetPropertyRenderer {
    constructor() {
        this.target = Z.setProperty;
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

const us = /*@__PURE__*/ renderer(class CustomElementRenderer {
    constructor() {
        this.r = p(Ps);
        this.target = Z.hydrateElement;
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
            l = Li.find(f, c);
            if (l == null) {
                throw createMappedError(752, s, t);
            }
            break;

          default:
            l = c;
        }
        const d = s.containerless || l.containerless;
        const m = d ? convertToRenderLocation(e) : null;
        const g = createElementContainer(i, t, e, s, m, u == null ? void 0 : new AuSlotsInfo(Ot(u)));
        a = g.invoke(l.Type);
        h = Controller.$el(g, a, e, s, l, m);
        setRef(e, l.key, h);
        const p = this.r.renderers;
        const v = s.props;
        const x = v.length;
        let b = 0;
        let w;
        while (x > b) {
            w = v[b];
            p[w.type].render(t, h, w, i, n, r);
            ++b;
        }
        t.addChild(h);
    }
});

const fs = /*@__PURE__*/ renderer(class CustomAttributeRenderer {
    constructor() {
        this.r = p(Ps);
        this.target = Z.hydrateAttribute;
    }
    render(t, e, s, i, n, r) {
        let l = t.container;
        let a;
        switch (typeof s.res) {
          case "string":
            a = Pe.find(l, s.res);
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

const ds = /*@__PURE__*/ renderer(class TemplateControllerRenderer {
    constructor() {
        this.r = p(Ps);
        this.target = Z.hydrateTemplateController;
    }
    render(t, e, s, i, n, r) {
        let l = t.container;
        let a;
        switch (typeof s.res) {
          case "string":
            a = Pe.find(l, s.res);
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

const ms = /*@__PURE__*/ renderer(class LetElementRenderer {
    constructor() {
        this.target = Z.hydrateLetElement;
        LetBinding.mix();
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
            f = ensureExpression(n, u.from, Ut);
            t.addBinding(new LetBinding(h, r, f, u.to, a));
            ++d;
        }
    }
});

const gs = /*@__PURE__*/ renderer(class RefBindingRenderer {
    constructor() {
        this.target = Z.refBinding;
    }
    render(t, e, s, i, n) {
        t.addBinding(new RefBinding(t.container, ensureExpression(n, s.from, Ut), getRefTarget(e, s.to)));
    }
});

const ps = /*@__PURE__*/ renderer(class InterpolationBindingRenderer {
    constructor() {
        this.target = Z.interpolation;
        InterpolationPartBinding.mix();
    }
    render(t, e, s, i, n, r) {
        t.addBinding(new InterpolationBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, $t), getTarget(e), s.to, ie));
    }
});

const vs = /*@__PURE__*/ renderer(class PropertyBindingRenderer {
    constructor() {
        this.target = Z.propertyBinding;
        PropertyBinding.mix();
    }
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, Ut), getTarget(e), s.to, s.mode));
    }
});

const xs = /*@__PURE__*/ renderer(class IteratorBindingRenderer {
    constructor() {
        this.target = Z.iteratorBinding;
        PropertyBinding.mix();
    }
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.forOf, jt), getTarget(e), s.to, ie));
    }
});

const bs = /*@__PURE__*/ renderer(class TextBindingRenderer {
    constructor() {
        this.target = Z.textBinding;
        ContentBinding.mix();
    }
    render(t, e, s, i, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, i.domWriteQueue, i, ensureExpression(n, s.from, Ut), e));
    }
});

const ws = me("IListenerBindingOptions", (t => t.instance({
    prevent: false
})));

const ys = /*@__PURE__*/ renderer(class ListenerBindingRenderer {
    constructor() {
        this.target = Z.listenerBinding;
        this.J = p(Je);
        this.tt = p(ws);
        ListenerBinding.mix();
    }
    render(t, e, s, i, n) {
        t.addBinding(new ListenerBinding(t.container, ensureExpression(n, s.from, Wt), e, s.to, new ListenerBindingOptions(this.tt.prevent, s.capture), this.J.getHandler(s.to, s.modifier)));
    }
});

const ks = /*@__PURE__*/ renderer(class SetAttributeRenderer {
    constructor() {
        this.target = Z.setAttribute;
    }
    render(t, e, s) {
        e.setAttribute(s.to, s.value);
    }
});

const Cs = /*@__PURE__*/ renderer(class SetClassAttributeRenderer {
    constructor() {
        this.target = Z.setClassAttribute;
    }
    render(t, e, s) {
        addClasses(e.classList, s.value);
    }
});

const Bs = /*@__PURE__*/ renderer(class SetStyleAttributeRenderer {
    constructor() {
        this.target = Z.setStyleAttribute;
    }
    render(t, e, s) {
        e.style.cssText += s.value;
    }
});

const As = /*@__PURE__*/ renderer(class StylePropertyBindingRenderer {
    constructor() {
        this.target = Z.stylePropertyBinding;
        PropertyBinding.mix();
    }
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, Ut), e.style, s.to, ie));
    }
});

const Ss = /*@__PURE__*/ renderer(class AttributeBindingRenderer {
    constructor() {
        this.target = Z.attributeBinding;
        AttributeBinding.mix();
    }
    render(t, e, s, i, n, r) {
        const l = t.container;
        const a = l.has(bi, false) ? l.get(bi) : null;
        t.addBinding(new AttributeBinding(t, l, r, i.domWriteQueue, ensureExpression(n, s.from, Ut), e, s.attr, a == null ? s.to : s.to.split(/\s/g).map((t => a[t] ?? t)).join(" "), ie));
    }
});

const Es = /*@__PURE__*/ renderer(class SpreadRenderer {
    constructor() {
        this.et = p(J);
        this.r = p(Ps);
        this.target = Z.spreadBinding;
    }
    render(t, e, s, i, n, r) {
        SpreadBinding.create(t.container.get(fi), e, void 0, this.r, this.et, i, n, r).forEach((e => t.addBinding(e)));
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

const Rs = "IController";

const Ts = "IInstruction";

const Ls = "IRenderLocation";

const Ms = "ISlotsInfo";

function createElementContainer(t, e, s, i, n, r) {
    const l = e.container.createChild();
    registerHostNode(l, t, s);
    registerResolver(l, ui, new y(Rs, e));
    registerResolver(l, tt, new y(Ts, i));
    registerResolver(l, xi, n == null ? Ds : new RenderLocationProvider(n));
    registerResolver(l, es, Is);
    registerResolver(l, os, r == null ? qs : new y(Ms, r));
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
    registerResolver(c, ui, new y(Rs, h));
    registerResolver(c, tt, new y(Ts, n));
    registerResolver(c, xi, l == null ? Ds : new y(Ls, l));
    registerResolver(c, es, r == null ? Is : new ViewFactoryProvider(r));
    registerResolver(c, os, a == null ? qs : new y(Ms, a));
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

const Ds = new RenderLocationProvider(null);

const Is = new ViewFactoryProvider(null);

const qs = new y(Ms, new AuSlotsInfo(x));

const Ps = /*@__PURE__*/ me("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.st ??= this.it.getAll(hs, false).reduce(((t, e) => {
            t[e.target] ??= e;
            return t;
        }), createLookup());
    }
    constructor() {
        this.nt = new WeakMap;
        this.rt = new WeakMap;
        const t = this.it = p(k).root;
        this.p = t.get(Me);
        this.ep = t.get(e);
        this.oL = t.get(V);
        this.ot = new FragmentNodeSequence(this.p, this.p.document.createDocumentFragment());
    }
    compile(t, e) {
        const s = e.get(J);
        const i = this.nt;
        let n = i.get(t);
        if (n == null) {
            i.set(t, n = CustomElementDefinition.create(t.needsCompile ? s.compile(t, e) : t));
        }
        return n;
    }
    getViewFactory(t, e) {
        return new ViewFactory(e, CustomElementDefinition.getOrCreate(t));
    }
    createNodes(t) {
        if (t.enhance === true) {
            return new FragmentNodeSequence(this.p, this.lt(t.template));
        }
        let e;
        let s = false;
        const i = this.rt;
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
            this.lt(e);
            i.set(t, e);
        }
        return e == null ? this.ot : new FragmentNodeSequence(this.p, s ? r.importNode(e, true) : r.adoptNode(e.cloneNode(true)));
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
    ht() {
        return this.p.document.createElement("au-m");
    }
    lt(t) {
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
                e.insertBefore(this.ht(), i);
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
                addListener(this.ct, e, this);
            }
            this.ut = true;
            this.ft?.();
        }
    }));
    defineHiddenProp(s, "unsubscribe", (function(t) {
        if (this.subs.remove(t) && this.subs.count === 0) {
            for (e of this.cf.events) {
                removeListener(this.ct, e, this);
            }
            this.ut = false;
            this.dt?.();
        }
    }));
    defineHiddenProp(s, "useConfig", (function(t) {
        this.cf = t;
        if (this.ut) {
            for (e of this.cf.events) {
                removeListener(this.ct, e, this);
            }
            for (e of this.cf.events) {
                addListener(this.ct, e, this);
            }
        }
    }));
};

const mixinNoopSubscribable = t => {
    defineHiddenProp(t.prototype, "subscribe", a);
    defineHiddenProp(t.prototype, "unsubscribe", a);
};

class ClassAttributeAccessor {
    get doNotCache() {
        return true;
    }
    constructor(t) {
        this.obj = t;
        this.type = Xt | Qt;
        this.v = "";
        this.gt = {};
        this.vt = 0;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (t !== this.v) {
            this.v = t;
            this.xt();
        }
    }
    xt() {
        const t = this.gt;
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

(() => {
    mixinNoopSubscribable(ClassAttributeAccessor);
})();

function getClassesToAdd(t) {
    if (isString(t)) {
        return splitClassString(t);
    }
    if (typeof t !== "object") {
        return x;
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
            return x;
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
        return x;
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
        const e = _t({}, ...this.modules);
        const s = defineAttribute({
            name: "class",
            bindables: [ "value" ],
            noMultiBindings: true
        }, class CustomAttributeClass {
            constructor() {
                this.bt = new ClassAttributeAccessor(p(pi));
                this.value = "";
            }
            binding() {
                this.valueChanged();
            }
            valueChanged() {
                this.bt.setValue(this.value?.split(/\s+/g).map((t => e[t] || t)) ?? "");
            }
        });
        t.register(s, ve(bi, e));
    }
}

function shadowCSS(...t) {
    return new ShadowDOMRegistry(t);
}

const _s = /*@__PURE__*/ me("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
    if (AdoptedStyleSheetsStyles.supported(t.get(Me))) {
        return t.get(AdoptedStyleSheetsStylesFactory);
    }
    return t.get(StyleElementStylesFactory);
}))));

class ShadowDOMRegistry {
    constructor(t) {
        this.css = t;
    }
    register(t) {
        const e = t.get(Os);
        const s = t.get(_s);
        t.register(ve(Fs, s.createStyles(this.css, e)));
    }
}

class AdoptedStyleSheetsStylesFactory {
    constructor() {
        this.p = p(Me);
        this.cache = new Map;
    }
    createStyles(t, e) {
        return new AdoptedStyleSheetsStyles(this.p, t, this.cache, e);
    }
}

class StyleElementStylesFactory {
    constructor() {
        this.p = p(Me);
    }
    createStyles(t, e) {
        return new StyleElementStyles(this.p, t, e);
    }
}

const Fs = /*@__PURE__*/ me("IShadowDOMStyles");

const Os = /*@__PURE__*/ me("IShadowDOMGlobalStyles", (t => t.instance({
    applyTo: a
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

const Vs = {
    shadowDOM(t) {
        return Le.creating(k, (e => {
            if (t.sharedStyles != null) {
                const s = e.get(_s);
                e.register(ve(Os, s.createStyles(t.sharedStyles, null)));
            }
        }));
    }
};

const {enter: Hs, exit: Ns} = H;

const {wrap: $s, unwrap: js} = N;

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
        if (!Ht(s, e)) {
            this.cb.call(t, s, e, t);
        }
    }
    compute() {
        this.running = true;
        this.obs.version++;
        try {
            Hs(this);
            return this.v = js(this.$get.call(void 0, this.useProxy ? $s(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            Ns(this);
        }
    }
}

(() => {
    F(ComputedWatcher, null);
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
        this.wt = i;
        this.cb = n;
    }
    handleChange(t) {
        const e = this.wt;
        const s = this.obj;
        const i = this.v;
        const n = e.$kind === "AccessScope" && this.obs.count === 1;
        if (!n) {
            this.obs.version++;
            t = Zt(e, this.scope, this, this);
            this.obs.clear();
        }
        if (!Ht(t, i)) {
            this.v = t;
            this.cb.call(s, t, i, s);
        }
    }
    bind() {
        if (this.isBound) {
            return;
        }
        this.obs.version++;
        this.v = Zt(this.wt, this.scope, this, this);
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
    F(ExpressionWatcher, null);
    $e(true)(ExpressionWatcher);
})();

class Controller {
    get lifecycleHooks() {
        return this.yt;
    }
    get isActive() {
        return (this.state & (ni | ri)) > 0 && (this.state & oi) === 0;
    }
    get name() {
        if (this.parent === null) {
            switch (this.vmKind) {
              case ei:
                return `[${this.definition.name}]`;

              case ti:
                return this.definition.name;

              case si:
                return this.viewFactory.name;
            }
        }
        switch (this.vmKind) {
          case ei:
            return `${this.parent.name}>[${this.definition.name}]`;

          case ti:
            return `${this.parent.name}>${this.definition.name}`;

          case si:
            return this.viewFactory.name === this.parent.definition?.name ? `${this.parent.name}[view]` : `${this.parent.name}[view:${this.viewFactory.name}]`;
        }
    }
    get viewModel() {
        return this.kt;
    }
    set viewModel(t) {
        this.kt = t;
        this.Ct = t == null || this.vmKind === si ? HooksDefinition.none : new HooksDefinition(t);
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
        this.mountTarget = Us;
        this.shadowRoot = null;
        this.nodes = null;
        this.location = null;
        this.yt = null;
        this.state = ii;
        this.At = false;
        this.$initiator = null;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this.St = 0;
        this.Et = 0;
        this.Rt = 0;
        this.kt = n;
        this.Ct = e === si ? HooksDefinition.none : new HooksDefinition(n);
        this.location = l;
        this.r = t.root.get(Ps);
        this.coercion = e === si ? void 0 : t.get(Ys);
    }
    static getCached(t) {
        return Ws.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (e === void 0) {
            throw createMappedError(500, t);
        }
        return e;
    }
    static $el(t, e, s, i, n = void 0, r = null) {
        if (Ws.has(e)) {
            return Ws.get(e);
        }
        {
            n = n ?? getElementDefinition(e.constructor);
        }
        registerResolver(t, n.Type, new y(n.key, e, n.Type));
        const l = new Controller(t, ti, n, null, e, s, r);
        const a = t.get(B(fi));
        if (n.dependencies.length > 0) {
            t.register(...n.dependencies);
        }
        registerResolver(t, fi, new y("IHydrationContext", new HydrationContext(l, i, a)));
        Ws.set(e, l);
        if (i == null || i.hydrate !== false) {
            l.hE(i, a);
        }
        return l;
    }
    static $attr(t, e, s, i) {
        if (Ws.has(e)) {
            return Ws.get(e);
        }
        i = i ?? getAttributeDefinition(e.constructor);
        registerResolver(t, i.Type, new y(i.key, e, i.Type));
        const n = new Controller(t, ei, i, null, e, s, null);
        if (i.dependencies.length > 0) {
            t.register(...i.dependencies);
        }
        Ws.set(e, n);
        n.Tt();
        return n;
    }
    static $view(t, e = void 0) {
        const s = new Controller(t.container, si, null, t, null, null, null);
        s.parent = e ?? null;
        s.Lt();
        return s;
    }
    hE(t, e) {
        const s = this.container;
        const i = this.kt;
        const n = this.definition;
        this.scope = Scope.create(i, null, true);
        if (n.watches.length > 0) {
            createWatchers(this, s, n, i);
        }
        createObservers(this, n, i);
        this.yt = Fe.resolve(s);
        s.register(n.Type);
        if (n.injectable !== null) {
            registerResolver(s, n.injectable, new y("definition.injectable", i));
        }
        if (t == null || t.hydrate !== false) {
            this.hS();
            this.hC();
        }
    }
    hS() {
        if (this.yt.hydrating != null) {
            this.yt.hydrating.forEach(callHydratingHook, this);
        }
        if (this.Ct.Mt) {
            this.kt.hydrating(this);
        }
        const t = this.definition;
        const e = this.Dt = this.r.compile(t, this.container);
        const s = e.shadowOptions;
        const i = e.hasSlots;
        const n = e.containerless;
        let r = this.host;
        let l = this.location;
        if ((this.hostController = findElementControllerFor(r, Qs)) !== null) {
            r = this.host = this.container.root.get(Me).document.createElement(t.name);
            if (n && l == null) {
                l = this.location = convertToRenderLocation(r);
            }
        }
        setRef(r, Ei, this);
        setRef(r, t.key, this);
        if (s !== null || i) {
            if (l != null) {
                throw createMappedError(501);
            }
            setRef(this.shadowRoot = r.attachShadow(s ?? Js), Ei, this);
            setRef(this.shadowRoot, t.key, this);
            this.mountTarget = Gs;
        } else if (l != null) {
            setRef(l, Ei, this);
            setRef(l, t.key, this);
            this.mountTarget = Ks;
        } else {
            this.mountTarget = zs;
        }
        this.kt.$controller = this;
        this.nodes = this.r.createNodes(e);
        if (this.yt.hydrated !== void 0) {
            this.yt.hydrated.forEach(callHydratedHook, this);
        }
        if (this.Ct.It) {
            this.kt.hydrated(this);
        }
    }
    hC() {
        this.r.render(this, this.nodes.findTargets(), this.Dt, this.host);
        if (this.yt.created !== void 0) {
            this.yt.created.forEach(callCreatedHook, this);
        }
        if (this.Ct.qt) {
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
        this.yt = Fe.resolve(this.container);
        if (this.yt.created !== void 0) {
            this.yt.created.forEach(callCreatedHook, this);
        }
        if (this.Ct.qt) {
            this.kt.created(this);
        }
    }
    Lt() {
        this.Dt = this.r.compile(this.viewFactory.def, this.container);
        this.r.render(this, (this.nodes = this.r.createNodes(this.Dt)).findTargets(), this.Dt, void 0);
    }
    activate(t, e, s) {
        switch (this.state) {
          case ii:
          case li:
            if (!(e === null || e.isActive)) {
                return;
            }
            this.state = ni;
            break;

          case ri:
            return;

          case hi:
            throw createMappedError(502, this.name);

          default:
            throw createMappedError(503, this.name, stringifyState(this.state));
        }
        this.parent = e;
        switch (this.vmKind) {
          case ti:
            this.scope.parent = s ?? null;
            break;

          case ei:
            this.scope = s ?? null;
            break;

          case si:
            if (s === void 0 || s === null) {
                throw createMappedError(504, this.name);
            }
            if (!this.hasLockedScope) {
                this.scope = s;
            }
            break;
        }
        this.$initiator = t;
        this.Pt();
        let i = void 0;
        if (this.vmKind !== si && this.yt.binding != null) {
            i = A(...this.yt.binding.map(callBindingHook, this));
        }
        if (this.Ct._t) {
            i = A(i, this.kt.binding(this.$initiator, this.parent));
        }
        if (isPromise(i)) {
            this.Ft();
            i.then((() => {
                this.Bt = true;
                if (this.state !== ni) {
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
        if (this.vmKind !== si && this.yt.bound != null) {
            s = A(...this.yt.bound.map(callBoundHook, this));
        }
        if (this.Ct.Ht) {
            s = A(s, this.kt.bound(this.$initiator, this.parent));
        }
        if (isPromise(s)) {
            this.Ft();
            s.then((() => {
                this.isBound = true;
                if (this.state !== ni) {
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
    $t(...t) {
        switch (this.mountTarget) {
          case zs:
            this.host.append(...t);
            break;

          case Gs:
            this.shadowRoot.append(...t);
            break;

          case Ks:
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
              case zs:
              case Gs:
                this.hostController.$t(this.host);
                break;

              case Ks:
                this.hostController.$t(this.location.$start, this.location);
                break;
            }
        }
        switch (this.mountTarget) {
          case zs:
            this.nodes.appendTo(this.host, this.definition != null && this.definition.enhance);
            break;

          case Gs:
            {
                const t = this.container;
                const e = t.has(Fs, false) ? t.get(Fs) : t.get(Os);
                e.applyTo(this.shadowRoot);
                this.nodes.appendTo(this.shadowRoot);
                break;
            }

          case Ks:
            this.nodes.insertBefore(this.location);
            break;
        }
        let t = 0;
        let e = void 0;
        if (this.vmKind !== si && this.yt.attaching != null) {
            e = A(...this.yt.attaching.map(callAttachingHook, this));
        }
        if (this.Ct.jt) {
            e = A(e, this.kt.attaching(this.$initiator, this.parent));
        }
        if (isPromise(e)) {
            this.Ft();
            this.Pt();
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
        let s = void 0;
        switch (this.state & ~ai) {
          case ri:
            this.state = oi;
            break;

          case ni:
            this.state = oi;
            s = this.$promise?.catch(a);
            break;

          case ii:
          case li:
          case hi:
          case li | hi:
            return;

          default:
            throw createMappedError(505, this.name, this.state);
        }
        this.$initiator = t;
        if (t === this) {
            this.Wt();
        }
        let i = 0;
        let n;
        if (this.children !== null) {
            for (i = 0; i < this.children.length; ++i) {
                void this.children[i].deactivate(t, this);
            }
        }
        return S(s, (() => {
            if (this.isBound) {
                if (this.vmKind !== si && this.yt.detaching != null) {
                    n = A(...this.yt.detaching.map(callDetachingHook, this));
                }
                if (this.Ct.Ut) {
                    n = A(n, this.kt.detaching(this.$initiator, this.parent));
                }
            }
            if (isPromise(n)) {
                this.Ft();
                t.Wt();
                n.then((() => {
                    t.zt();
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
            this.zt();
            return this.$promise;
        }));
    }
    removeNodes() {
        switch (this.vmKind) {
          case ti:
          case si:
            this.nodes.remove();
            this.nodes.unlink();
        }
        if (this.hostController !== null) {
            switch (this.mountTarget) {
              case zs:
              case Gs:
                this.host.remove();
                break;

              case Ks:
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
          case ei:
            this.scope = null;
            break;

          case si:
            if (!this.hasLockedScope) {
                this.scope = null;
            }
            if ((this.state & ai) === ai && !this.viewFactory.tryReturnToCache(this) && this.$initiator === this) {
                this.dispose();
            }
            break;

          case ti:
            this.scope.parent = null;
            break;
        }
        this.state = li;
        this.$initiator = null;
        this.Gt();
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
    Gt() {
        if (this.$promise !== void 0) {
            di = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            di();
            di = void 0;
        }
    }
    Vt(t) {
        if (this.$promise !== void 0) {
            mi = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            mi(t);
            mi = void 0;
        }
        if (this.$initiator !== this) {
            this.parent.Vt(t);
        }
    }
    Pt() {
        ++this.St;
        if (this.$initiator !== this) {
            this.parent.Pt();
        }
    }
    Ot() {
        if (this.state !== ni) {
            --this.St;
            this.Gt();
            if (this.$initiator !== this) {
                this.parent.Ot();
            }
            return;
        }
        if (--this.St === 0) {
            if (this.vmKind !== si && this.yt.attached != null) {
                gi = A(...this.yt.attached.map(callAttachedHook, this));
            }
            if (this.Ct.Kt) {
                gi = A(gi, this.kt.attached(this.$initiator));
            }
            if (isPromise(gi)) {
                this.Ft();
                gi.then((() => {
                    this.state = ri;
                    this.Gt();
                    if (this.$initiator !== this) {
                        this.parent.Ot();
                    }
                })).catch((t => {
                    this.Vt(t);
                }));
                gi = void 0;
                return;
            }
            gi = void 0;
            this.state = ri;
            this.Gt();
        }
        if (this.$initiator !== this) {
            this.parent.Ot();
        }
    }
    Wt() {
        ++this.Et;
    }
    zt() {
        if (--this.Et === 0) {
            this.Xt();
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
                    if (t.vmKind !== si && t.yt.unbinding != null) {
                        e = A(...t.yt.unbinding.map(callUnbindingHook, t));
                    }
                    if (t.Ct.Qt) {
                        if (t.debug) {
                            t.logger.trace("unbinding()");
                        }
                        e = A(e, t.viewModel.unbinding(t.$initiator, t.parent));
                    }
                }
                if (isPromise(e)) {
                    this.Ft();
                    this.Xt();
                    e.then((() => {
                        this.Yt();
                    })).catch((t => {
                        this.Vt(t);
                    }));
                }
                e = void 0;
                t = t.next;
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
          case ei:
          case ti:
            {
                return this.definition.name === t;
            }

          case si:
            return this.viewFactory.name === t;
        }
    }
    lockScope(t) {
        this.scope = t;
        this.hasLockedScope = true;
    }
    setHost(t) {
        if (this.vmKind === ti) {
            setRef(t, Ei, this);
            setRef(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = zs;
        return this;
    }
    setShadowRoot(t) {
        if (this.vmKind === ti) {
            setRef(t, Ei, this);
            setRef(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = Gs;
        return this;
    }
    setLocation(t) {
        if (this.vmKind === ti) {
            setRef(t, Ei, this);
            setRef(t, this.definition.key, this);
        }
        this.location = t;
        this.mountTarget = Ks;
        return this;
    }
    release() {
        this.state |= ai;
    }
    dispose() {
        if ((this.state & hi) === hi) {
            return;
        }
        this.state |= hi;
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
            Ws.delete(this.kt);
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

const Ws = new WeakMap;

const Us = 0;

const zs = 1;

const Gs = 2;

const Ks = 3;

const Xs = Pt({
    none: Us,
    host: zs,
    shadowRoot: Gs,
    location: Ks
});

const Qs = {
    optional: true
};

const Ys = C($);

function createObservers(t, e, s) {
    const i = e.bindables;
    const n = Ft(i);
    const r = n.length;
    const l = t.container.get(V);
    if (r > 0) {
        for (let e = 0; e < r; ++e) {
            const r = n[e];
            const h = i[r];
            const c = h.callback;
            const u = l.getObserver(s, r);
            if (h.set !== a) {
                if (u.useCoercer?.(h.set, t.coercion) !== true) {
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

const Zs = new Map;

const getAccessScopeAst = t => {
    let e = Zs.get(t);
    if (e == null) {
        e = new s(t, 0);
        Zs.set(t, e);
    }
    return e;
};

function createWatchers(t, s, i, n) {
    const r = s.get(V);
    const l = s.get(e);
    const a = i.watches;
    const h = t.vmKind === ti ? t.scope : Scope.create(n, null, true);
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
            d = isString(u) ? l.parse(u, Ut) : getAccessScopeAst(u);
            t.addBinding(new ExpressionWatcher(h, s, r, d, f));
        }
    }
}

function isCustomElementController(t) {
    return t instanceof Controller && t.vmKind === ti;
}

function isCustomElementViewModel(t) {
    return Rt(t) && isElementType(t.constructor);
}

class HooksDefinition {
    constructor(t) {
        this.te = "define" in t;
        this.Mt = "hydrating" in t;
        this.It = "hydrated" in t;
        this.qt = "created" in t;
        this._t = "binding" in t;
        this.Ht = "bound" in t;
        this.jt = "attaching" in t;
        this.Kt = "attached" in t;
        this.Ut = "detaching" in t;
        this.Qt = "unbinding" in t;
        this.Zt = "dispose" in t;
        this.Jt = "accept" in t;
    }
}

HooksDefinition.none = new HooksDefinition({});

const Js = {
    mode: "open"
};

const ti = "customElement";

const ei = "customAttribute";

const si = "synthetic";

const ii = 0;

const ni = 1;

const ri = 2;

const oi = 4;

const li = 8;

const ai = 16;

const hi = 32;

const ci = /*@__PURE__*/ Pt({
    none: ii,
    activating: ni,
    activated: ri,
    deactivating: oi,
    deactivated: li,
    released: ai,
    disposed: hi
});

function stringifyState(t) {
    const e = [];
    if ((t & ni) === ni) {
        e.push("activating");
    }
    if ((t & ri) === ri) {
        e.push("activated");
    }
    if ((t & oi) === oi) {
        e.push("deactivating");
    }
    if ((t & li) === li) {
        e.push("deactivated");
    }
    if ((t & ai) === ai) {
        e.push("released");
    }
    if ((t & hi) === hi) {
        e.push("disposed");
    }
    return e.length === 0 ? "none" : e.join("|");
}

const ui = /*@__PURE__*/ me("IController");

const fi = /*@__PURE__*/ me("IHydrationContext");

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

let di;

let mi;

let gi;

class Refs {}

function getRef(t, e) {
    return t.$au?.[e] ?? null;
}

function setRef(t, e, s) {
    (t.$au ??= new Refs)[e] = s;
}

const pi = /*@__PURE__*/ me("INode");

const vi = /*@__PURE__*/ me("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(Di, true)) {
        return t.get(Di).host;
    }
    return t.get(Me).document;
}))));

const xi = /*@__PURE__*/ me("IRenderLocation");

const bi = /*@__PURE__*/ me("CssModules");

const wi = new WeakMap;

function getEffectiveParentNode(t) {
    if (wi.has(t)) {
        return wi.get(t);
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
        if (e.mountTarget === Xs.shadowRoot) {
            return getEffectiveParentNode(e.host);
        }
    }
    return t.parentNode;
}

function setEffectiveParentNode(t, e) {
    if (t.platform !== void 0 && !(t instanceof t.platform.Node)) {
        const s = t.childNodes;
        for (let t = 0, i = s.length; t < i; ++t) {
            wi.set(s[t], e);
        }
    } else {
        wi.set(t, e);
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

const yi = /*@__PURE__*/ me("IWindow", (t => t.callback((t => t.get(Me).window))));

const ki = /*@__PURE__*/ me("ILocation", (t => t.callback((t => t.get(yi).location))));

const Ci = /*@__PURE__*/ me("IHistory", (t => t.callback((t => t.get(yi).history))));

const registerHostNode = (t, e, s) => {
    registerResolver(t, e.HTMLElement, registerResolver(t, e.Element, registerResolver(t, pi, new y("ElementResolver", s))));
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
    const e = oe(Ei, t);
    if (e === void 0) {
        annotateElementMetadata(t, "containerless", true);
        return;
    }
    e.containerless = true;
}

const Bi = new WeakMap;

class CustomElementDefinition {
    get type() {
        return xe;
    }
    constructor(t, e, s, i, n, r, l, a, h, c, u, f, d, m, g, p, v, x) {
        this.Type = t;
        this.name = e;
        this.aliases = s;
        this.key = i;
        this.capture = n;
        this.template = r;
        this.instructions = l;
        this.dependencies = a;
        this.injectable = h;
        this.needsCompile = c;
        this.surrogates = u;
        this.bindables = f;
        this.containerless = d;
        this.shadowOptions = m;
        this.hasSlots = g;
        this.enhance = p;
        this.watches = v;
        this.processContent = x;
    }
    static create(t, e = null) {
        if (e === null) {
            const s = t;
            if (isString(s)) {
                throw createMappedError(761, t);
            }
            const i = E("name", s, Ri);
            if (isFunction(s.Type)) {
                e = s.Type;
            } else {
                e = Ti(R(i));
            }
            return new CustomElementDefinition(e, i, f(s.aliases), E("key", s, (() => getElementKeyFrom(i))), T("capture", s, e, returnFalse), E("template", s, returnNull), f(s.instructions), f(getElementAnnotation(e, "dependencies"), s.dependencies), E("injectable", s, returnNull), E("needsCompile", s, returnTrue), f(s.surrogates), fe.from(getElementAnnotation(e, "bindables"), s.bindables), T("containerless", s, e, returnFalse), E("shadowOptions", s, returnNull), E("hasSlots", s, returnFalse), E("enhance", s, returnFalse), E("watches", s, returnEmptyArray), L("processContent", e, returnNull));
        }
        if (isString(t)) {
            return new CustomElementDefinition(e, t, f(getElementAnnotation(e, "aliases"), e.aliases), getElementKeyFrom(t), L("capture", e, returnFalse), L("template", e, returnNull), f(getElementAnnotation(e, "instructions"), e.instructions), f(getElementAnnotation(e, "dependencies"), e.dependencies), L("injectable", e, returnNull), L("needsCompile", e, returnTrue), f(getElementAnnotation(e, "surrogates"), e.surrogates), fe.from(...fe.getAll(e), getElementAnnotation(e, "bindables"), e.bindables), L("containerless", e, returnFalse), L("shadowOptions", e, returnNull), L("hasSlots", e, returnFalse), L("enhance", e, returnFalse), f(De.getDefinitions(e), e.watches), L("processContent", e, returnNull));
        }
        const s = E("name", t, Ri);
        return new CustomElementDefinition(e, s, f(getElementAnnotation(e, "aliases"), t.aliases, e.aliases), getElementKeyFrom(s), T("capture", t, e, returnFalse), T("template", t, e, returnNull), f(getElementAnnotation(e, "instructions"), t.instructions, e.instructions), f(getElementAnnotation(e, "dependencies"), t.dependencies, e.dependencies), T("injectable", t, e, returnNull), T("needsCompile", t, e, returnTrue), f(getElementAnnotation(e, "surrogates"), t.surrogates, e.surrogates), fe.from(...fe.getAll(e), getElementAnnotation(e, "bindables"), e.bindables, t.bindables), T("containerless", t, e, returnFalse), T("shadowOptions", t, e, returnNull), T("hasSlots", t, e, returnFalse), T("enhance", t, e, returnFalse), f(t.watches, De.getDefinitions(e), e.watches), T("processContent", t, e, returnNull));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) {
            return t;
        }
        if (Bi.has(t)) {
            return Bi.get(t);
        }
        const e = CustomElementDefinition.create(t);
        Bi.set(t, e);
        ae(e, e.Type, Ei);
        return e;
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getElementKeyFrom(e) : this.key;
        const n = this.aliases;
        if (t.has(i, false)) {
            console.warn(createMappedError(153, this.name));
            return;
        }
        t.register(t.has(s, false) ? null : ge(s, s), pe(s, i), ...n.map((t => pe(s, getElementKeyFrom(t)))));
    }
    toString() {
        return `au:ce:${this.name}`;
    }
}

const Ai = {
    name: undefined,
    searchParents: false,
    optional: false
};

const returnNull = () => null;

const returnFalse = () => false;

const returnTrue = () => true;

const returnEmptyArray = () => x;

const Si = "custom-element";

const Ei = /*@__PURE__*/ g(Si);

const getElementKeyFrom = t => `${Ei}:${t}`;

const Ri = /*@__PURE__*/ (t => () => `unnamed-${++t}`)(0);

const annotateElementMetadata = (t, e, s) => {
    ae(s, t, ce(e));
};

const defineElement = (t, e) => {
    const s = CustomElementDefinition.create(t, e);
    const i = s.Type;
    ae(s, i, Ei, d);
    return i;
};

const isElementType = t => isFunction(t) && (le(Ei, t) || t.$au?.type === Si);

const findElementControllerFor = (t, e = Ai) => {
    if (e.name === void 0 && e.searchParents !== true) {
        const s = getRef(t, Ei);
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
            const s = getRef(t, Ei);
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
            const t = getRef(s, Ei);
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
        const t = getRef(s, Ei);
        if (t !== null) {
            return t;
        }
        s = getEffectiveParentNode(s);
    }
    throw createMappedError(765, t);
};

const getElementAnnotation = (t, e) => oe(ce(e), t);

const getElementDefinition = t => {
    const e = oe(Ei, t) ?? getDefinitionFromStaticAu(t, Si, CustomElementDefinition.create);
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

const Ti = /*@__PURE__*/ function() {
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
        Nt(n, "name", t);
        if (i !== e) {
            _t(n.prototype, i);
        }
        return n;
    };
}();

const Li = /*@__PURE__*/ Pt({
    name: Ei,
    keyFrom: getElementKeyFrom,
    isType: isElementType,
    for: findElementControllerFor,
    define: defineElement,
    getDefinition: getElementDefinition,
    annotate: annotateElementMetadata,
    getAnnotation: getElementAnnotation,
    generateName: Ri,
    createInjectable: createElementInjectable,
    generateType: Ti,
    find(t, e) {
        const s = t.find(Si, e);
        return s == null ? null : oe(Ei, s) ?? getDefinitionFromStaticAu(s, Si, CustomElementDefinition.create) ?? null;
    }
});

const Mi = /*@__PURE__*/ ce("processContent");

function processContent(t) {
    return t === void 0 ? function(t, e) {
        if (!e.static || e.kind !== "method") throw createMappedError(766, t);
        e.addInitializer((function() {
            ae(t, this, Mi);
        }));
    } : function(e, s) {
        s.addInitializer((function() {
            if (isString(t) || isSymbol(t)) {
                t = this[t];
            }
            if (!isFunction(t)) throw createMappedError(766, t);
            const e = oe(Ei, this);
            if (e !== void 0) {
                e.processContent = t;
            } else {
                ae(t, this, Mi);
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

const Di = /*@__PURE__*/ me("IAppRoot");

class AppRoot {
    get controller() {
        return this.L;
    }
    constructor(t, e, s, i = false) {
        this.config = t;
        this.container = e;
        this.oe = void 0;
        this.le = i;
        const n = this.host = t.host;
        s.prepare(this);
        registerResolver(e, vi, new y("IEventTarget", n));
        registerHostNode(e, this.platform = this.ae(e, n), n);
        this.oe = S(this.he("creating"), (() => {
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
                ve(r, l);
            } else {
                l = t.component;
            }
            const a = {
                hydrate: false,
                projections: null
            };
            const h = i ? CustomElementDefinition.create({
                name: Ri(),
                template: this.host,
                enhance: true
            }) : void 0;
            const c = this.L = Controller.$el(s, l, n, a, h);
            c.hE(a, null);
            return S(this.he("hydrating"), (() => {
                c.hS();
                return S(this.he("hydrated"), (() => {
                    c.hC();
                    this.oe = void 0;
                }));
            }));
        }));
    }
    activate() {
        return S(this.oe, (() => S(this.he("activating"), (() => S(this.L.activate(this.L, null, void 0), (() => this.he("activated")))))));
    }
    deactivate() {
        return S(this.he("deactivating"), (() => S(this.L.deactivate(this.L, null), (() => this.he("deactivated")))));
    }
    he(t) {
        const e = this.container;
        const s = this.le && !e.has(Te, false) ? [] : e.getAll(Te);
        return A(...s.reduce(((e, s) => {
            if (s.slot === t) {
                e.push(s.run());
            }
            return e;
        }), []));
    }
    ae(t, e) {
        let s;
        if (!t.has(Me, false)) {
            if (e.ownerDocument.defaultView === null) {
                throw createMappedError(769);
            }
            s = new Tt(e.ownerDocument.defaultView);
            t.register(ve(Me, s));
        } else {
            s = t.get(Me);
        }
        return s;
    }
    dispose() {
        this.L?.dispose();
    }
}

const Ii = /*@__PURE__*/ me("IAurelia");

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
    constructor(t = h.createContainer()) {
        this.container = t;
        this.ir = false;
        this.ce = false;
        this.ue = false;
        this.fe = void 0;
        this.next = void 0;
        this.de = void 0;
        this.me = void 0;
        if (t.has(Ii, true) || t.has(Aurelia, true)) {
            throw createMappedError(768);
        }
        registerResolver(t, Ii, new y("IAurelia", this));
        registerResolver(t, Aurelia, new y("Aurelia", this));
        registerResolver(t, Di, this.ge = new y("IAppRoot"));
    }
    register(...t) {
        this.container.register(...t);
        return this;
    }
    app(t) {
        this.next = new AppRoot(t, this.container, this.ge);
        return this;
    }
    enhance(t) {
        const e = t.container ?? this.container.createChild();
        const s = registerResolver(e, Di, new y("IAppRoot"));
        const i = new AppRoot({
            host: t.host,
            component: t.component
        }, e, s, true);
        return S(i.activate(), (() => i));
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
        if (isPromise(this.de)) {
            return this.de;
        }
        return this.de = S(this.stop(), (() => {
            Reflect.set(t.host, "$aurelia", this);
            this.ge.prepare(this.fe = t);
            this.ce = true;
            return S(t.activate(), (() => {
                this.ir = true;
                this.ce = false;
                this.de = void 0;
                this.pe(t, "au-started", t.host);
            }));
        }));
    }
    stop(t = false) {
        if (isPromise(this.me)) {
            return this.me;
        }
        if (this.ir === true) {
            const e = this.fe;
            this.ir = false;
            this.ue = true;
            return this.me = S(e.deactivate(), (() => {
                Reflect.deleteProperty(e.host, "$aurelia");
                if (t) {
                    e.dispose();
                }
                this.fe = void 0;
                this.ge.dispose();
                this.ue = false;
                this.pe(e, "au-stopped", e.host);
            }));
        }
    }
    dispose() {
        if (this.ir || this.ue) {
            throw createMappedError(771);
        }
        this.container.dispose();
    }
    pe(t, e, s) {
        const i = new t.platform.window.CustomEvent(e, {
            detail: this,
            bubbles: true,
            cancelable: true
        });
        s.dispatchEvent(i);
    }
}

const qi = /*@__PURE__*/ me("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

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
        t.register(ge(this, this), pe(this, qi));
    }
    constructor() {
        this.ve = _t(createLookup(), {
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
        this.xe = o("a altGlyph animate animateColor circle clipPath defs ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feFlood feGaussianBlur feImage feMerge feMorphology feOffset feSpecularLighting feTile feTurbulence filter font foreignObject g glyph glyphRef image line linearGradient marker mask missing-glyph path pattern polygon polyline radialGradient rect stop svg switch symbol text textPath tref tspan use");
        this.be = o("alignment-baseline baseline-shift clip-path clip-rule clip color-interpolation-filters color-interpolation color-profile color-rendering color cursor direction display dominant-baseline enable-background fill-opacity fill-rule fill filter flood-color flood-opacity font-family font-size-adjust font-size font-stretch font-style font-variant font-weight glyph-orientation-horizontal glyph-orientation-vertical image-rendering kerning letter-spacing lighting-color marker-end marker-mid marker-start mask opacity overflow pointer-events shape-rendering stop-color stop-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width stroke text-anchor text-decoration text-rendering unicode-bidi visibility word-spacing writing-mode");
        const t = p(Me);
        this.SVGElement = t.globalThis.SVGElement;
        const e = t.document.createElement("div");
        e.innerHTML = "<svg><altGlyph /></svg>";
        if (e.firstElementChild.nodeName === "altglyph") {
            const t = this.ve;
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
        return this.xe[t.nodeName] === true && this.be[e] === true || this.ve[t.nodeName]?.[e] === true;
    }
}

class AttrMapper {
    constructor() {
        this.fns = [];
        this.we = createLookup();
        this.ye = createLookup();
        this.svg = p(qi);
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
            s = this.we[i] ??= createLookup();
            for (n in e) {
                if (s[n] !== void 0) {
                    throw createError(n, i);
                }
                s[n] = e[n];
            }
        }
    }
    useGlobalMapping(t) {
        const e = this.ye;
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
        return this.we[t.nodeName]?.[e] ?? this.ye[e] ?? (isDataAttribute(t, e, this.svg) ? e : null);
    }
}

AttrMapper.register = M(et);

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

const Pi = {
    register(t) {
        t.register(nt, AttrMapper, BindablesInfoResolver, ResourceResolver);
    }
};

class BindablesInfoResolver {
    constructor() {
        this.j = new WeakMap;
    }
    get(t) {
        let e = this.j.get(t);
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
            if (n == null && t.type === "custom-attribute") {
                a = i.value = BindableDefinition.create("value", {
                    mode: t.defaultBindingMode ?? ee
                });
            }
            this.j.set(t, e = new BindablesInfo(i, s, a ?? null));
        }
        return e;
    }
}

BindablesInfoResolver.register = M(st);

class BindablesInfo {
    constructor(t, e, s) {
        this.attrs = t;
        this.bindables = e;
        this.primary = s;
    }
}

class ResourceResolver {
    constructor() {
        this.ke = new WeakMap;
        this.Ce = new WeakMap;
    }
    el(t, e) {
        let s = this.ke.get(t);
        if (s == null) {
            this.ke.set(t, s = new RecordCache);
        }
        return e in s.element ? s.element[e] : s.element[e] = Li.find(t, e);
    }
    attr(t, e) {
        let s = this.ke.get(t);
        if (s == null) {
            this.ke.set(t, s = new RecordCache);
        }
        return e in s.attr ? s.attr[e] : s.attr[e] = Pe.find(t, e);
    }
    command(t, e) {
        let s = this.Ce.get(t);
        if (s == null) {
            this.Ce.set(t, s = createLookup());
        }
        let i = s[e];
        if (i === void 0) {
            let n = this.ke.get(t);
            if (n == null) {
                this.ke.set(t, n = new RecordCache);
            }
            const r = e in n.command ? n.command[e] : n.command[e] = rt.find(t, e);
            if (r == null) {
                throw createMappedError(713, e);
            }
            s[e] = i = rt.get(t, e);
        }
        return i;
    }
}

ResourceResolver.register = M(it);

class RecordCache {
    constructor() {
        this.element = createLookup();
        this.attr = createLookup();
        this.command = createLookup();
    }
}

const _i = createLookup();

class AttributeNSAccessor {
    static forNs(t) {
        return _i[t] ??= new AttributeNSAccessor(t);
    }
    constructor(t) {
        this.ns = t;
        this.type = Xt | Qt;
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
        this.type = Xt | Qt;
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

const Fi = /*@__PURE__*/ new DataAttributeAccessor;

class SelectValueObserver {
    static Be(t) {
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
                e[e.length] = qt.call(n, "model") ? n.model : n.value;
            }
            ++i;
        }
        return e;
    }
    static Ae(t, e) {
        return t === e;
    }
    constructor(t, e, s, i) {
        this.type = Xt | Kt | Qt;
        this.v = void 0;
        this.ov = void 0;
        this.Se = false;
        this.Ee = void 0;
        this.Re = void 0;
        this.iO = false;
        this.ut = false;
        this.ct = t;
        this.oL = i;
        this.cf = s;
    }
    getValue() {
        return this.iO ? this.v : this.ct.multiple ? SelectValueObserver.Be(this.ct.options) : this.ct.value;
    }
    setValue(t) {
        this.ov = this.v;
        this.v = t;
        this.Se = t !== this.ov;
        this.Te(t instanceof Array ? t : null);
        this.xt();
    }
    xt() {
        if (this.Se) {
            this.Se = false;
            this.syncOptions();
        }
    }
    handleCollectionChange() {
        this.syncOptions();
    }
    syncOptions() {
        const t = this.v;
        const e = this.ct;
        const s = isArray(t);
        const i = e.matcher ?? SelectValueObserver.Ae;
        const n = e.options;
        let r = n.length;
        while (r-- > 0) {
            const e = n[r];
            const l = qt.call(e, "model") ? e.model : e.value;
            if (s) {
                e.selected = t.findIndex((t => !!i(l, t))) !== -1;
                continue;
            }
            e.selected = !!i(l, t);
        }
    }
    syncValue() {
        const t = this.ct;
        const e = t.options;
        const s = e.length;
        const i = this.v;
        let n = 0;
        if (t.multiple) {
            if (!(i instanceof Array)) {
                return true;
            }
            let r;
            const l = t.matcher || SelectValueObserver.Ae;
            const a = [];
            while (n < s) {
                r = e[n];
                if (r.selected) {
                    a.push(qt.call(r, "model") ? r.model : r.value);
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
                r = qt.call(l, "model") ? l.model : l.value;
                break;
            }
            ++n;
        }
        this.ov = this.v;
        this.v = r;
        return true;
    }
    ft() {
        (this.Re = createMutationObserver(this.ct, this.Le.bind(this))).observe(this.ct, {
            childList: true,
            subtree: true,
            characterData: true
        });
        this.Te(this.v instanceof Array ? this.v : null);
        this.iO = true;
    }
    dt() {
        this.Re.disconnect();
        this.Ee?.unsubscribe(this);
        this.Re = this.Ee = void 0;
        this.iO = false;
    }
    Te(t) {
        this.Ee?.unsubscribe(this);
        this.Ee = void 0;
        if (t != null) {
            if (!this.ct.multiple) {
                throw createError$1(`AUR0654`);
            }
            (this.Ee = this.oL.getArrayObserver(t)).subscribe(this);
        }
    }
    handleEvent() {
        const t = this.syncValue();
        if (t) {
            this.Me();
        }
    }
    Le(t) {
        this.syncOptions();
        const e = this.syncValue();
        if (e) {
            this.Me();
        }
    }
    Me() {
        const t = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, t);
    }
}

(() => {
    mixinNodeObserverUseConfig(SelectValueObserver);
    O(SelectValueObserver, null);
})();

const Oi = "--";

class StyleAttributeAccessor {
    constructor(t) {
        this.obj = t;
        this.type = Xt | Qt;
        this.v = "";
        this.ov = "";
        this.styles = {};
        this.version = 0;
        this.Se = false;
    }
    getValue() {
        return this.obj.style.cssText;
    }
    setValue(t) {
        this.v = t;
        this.Se = t !== this.ov;
        this.xt();
    }
    De(t) {
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
    Ie(t) {
        let e;
        let s;
        const i = [];
        for (s in t) {
            e = t[s];
            if (e == null) {
                continue;
            }
            if (isString(e)) {
                if (s.startsWith(Oi)) {
                    i.push([ s, e ]);
                    continue;
                }
                i.push([ l(s), e ]);
                continue;
            }
            i.push(...this.qe(e));
        }
        return i;
    }
    Pe(t) {
        const e = t.length;
        if (e > 0) {
            const s = [];
            let i = 0;
            for (;e > i; ++i) {
                s.push(...this.qe(t[i]));
            }
            return s;
        }
        return x;
    }
    qe(t) {
        if (isString(t)) {
            return this.De(t);
        }
        if (t instanceof Array) {
            return this.Pe(t);
        }
        if (t instanceof Object) {
            return this.Ie(t);
        }
        return x;
    }
    xt() {
        if (this.Se) {
            this.Se = false;
            const t = this.v;
            const e = this.styles;
            const s = this.qe(t);
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
                if (!qt.call(e, i) || e[i] !== n) {
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
        this.type = Xt | Kt | Qt;
        this.v = "";
        this.ov = "";
        this.Se = false;
        this.ut = false;
        this.ct = t;
        this.k = e;
        this.cf = s;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (Ht(t, this.v)) {
            return;
        }
        this.ov = this.v;
        this.v = t;
        this.Se = true;
        if (!this.cf.readonly) {
            this.xt();
        }
    }
    xt() {
        if (this.Se) {
            this.Se = false;
            this.ct[this.k] = this.v ?? this.cf.default;
            this.Me();
        }
    }
    handleEvent() {
        this.ov = this.v;
        this.v = this.ct[this.k];
        if (this.ov !== this.v) {
            this.Se = false;
            this.Me();
        }
    }
    ft() {
        this.v = this.ov = this.ct[this.k];
    }
    Me() {
        const t = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, t);
    }
}

(() => {
    mixinNodeObserverUseConfig(ValueAttributeObserver);
    O(ValueAttributeObserver, null);
})();

const Vi = (() => {
    const t = "http://www.w3.org/1999/xlink";
    const e = "http://www.w3.org/XML/1998/namespace";
    const s = "http://www.w3.org/2000/xmlns/";
    return _t(createLookup(), {
        "xlink:actuate": [ "actuate", t ],
        "xlink:arcrole": [ "arcrole", t ],
        "xlink:href": [ "href", t ],
        "xlink:role": [ "role", t ],
        "xlink:show": [ "show", t ],
        "xlink:title": [ "title", t ],
        "xlink:type": [ "type", t ],
        "xml:lang": [ "lang", e ],
        "xml:space": [ "space", e ],
        xmlns: [ "xmlns", s ],
        "xmlns:xlink": [ "xlink", s ]
    });
})();

const Hi = new j;

Hi.type = Xt | Qt;

class NodeObserverLocator {
    constructor() {
        this.allowDirtyCheck = true;
        this._e = createLookup();
        this.Fe = createLookup();
        this.Oe = createLookup();
        this.Ve = createLookup();
        this.He = p(D);
        this.p = p(Me);
        this.Ne = p(U);
        this.svg = p(qi);
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
        const i = this._e;
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
        const s = this.Fe;
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
        if (e in this.Ve || e in (this.Oe[t.tagName] ?? I)) {
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
            return Fi;

          default:
            {
                const s = Vi[e];
                if (s !== undefined) {
                    return AttributeNSAccessor.forNs(s[1]);
                }
                if (isDataAttribute(t, e, this.svg)) {
                    return Fi;
                }
                return Hi;
            }
        }
    }
    overrideAccessor(t, e) {
        let s;
        if (isString(t)) {
            s = this.Oe[t] ??= createLookup();
            s[e] = true;
        } else {
            for (const e in t) {
                for (const i of t[e]) {
                    s = this.Oe[e] ??= createLookup();
                    s[i] = true;
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
        return this._e[t.tagName]?.[e] ?? this.Fe[e];
    }
    getNodeObserver(t, e, s) {
        const i = this._e[t.tagName]?.[e] ?? this.Fe[e];
        let n;
        if (i != null) {
            n = new (i.type ?? ValueAttributeObserver)(t, e, i, s, this.He);
            if (!n.doNotCache) {
                z(t)[e] = n;
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
        const n = Vi[e];
        if (n !== undefined) {
            return AttributeNSAccessor.forNs(n[1]);
        }
        if (isDataAttribute(t, e, this.svg)) {
            return Fi;
        }
        if (e in t.constructor.prototype) {
            if (this.allowDirtyCheck) {
                return this.Ne.createProperty(t, e);
            }
            throw createMappedError(652, e);
        } else {
            return new G(t, e);
        }
    }
}

NodeObserverLocator.register = M(W);

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
        this.type = Xt | Kt | Qt;
        this.v = void 0;
        this.ov = void 0;
        this.$e = void 0;
        this.je = void 0;
        this.ut = false;
        this.ct = t;
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
        this.We();
        this.Ue();
        this.Me();
    }
    handleCollectionChange() {
        this.Ue();
    }
    handleChange(t, e) {
        this.Ue();
    }
    Ue() {
        const t = this.v;
        const e = this.ct;
        const s = qt.call(e, "model") ? e.model : e.value;
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
        const e = this.ct;
        const s = qt.call(e, "model") ? e.model : e.value;
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
        this.Me();
    }
    ft() {
        this.We();
    }
    dt() {
        this.$e?.unsubscribe(this);
        this.je?.unsubscribe(this);
        this.$e = this.je = void 0;
    }
    Me() {
        Ni = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Ni);
    }
    We() {
        const t = this.ct;
        (this.je ??= t.$observers?.model ?? t.$observers?.value)?.subscribe(this);
        this.$e?.unsubscribe(this);
        this.$e = void 0;
        if (t.type === "checkbox") {
            (this.$e = getCollectionObserver(this.v, this.oL))?.subscribe(this);
        }
    }
}

(() => {
    mixinNodeObserverUseConfig(CheckedObserver);
    O(CheckedObserver, null);
})();

let Ni = void 0;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) {
            throw createMappedError(9994, e);
        }
        e.useTargetObserver(Fi);
    }
}

AttrBindingBehavior.$au = {
    type: we,
    name: "attr"
};

class SelfBindingBehavior {
    bind(t, e) {
        if (!("handleEvent" in e)) {
            throw createMappedError(801);
        }
        e.self = true;
    }
    unbind(t, e) {
        e.self = false;
    }
}

SelfBindingBehavior.$au = {
    type: we,
    name: "self"
};

class UpdateTriggerBindingBehavior {
    constructor() {
        this.oL = p(V);
        this.ze = p(W);
    }
    bind(t, e, ...s) {
        if (!(this.ze instanceof NodeObserverLocator)) {
            throw createMappedError(9993);
        }
        if (s.length === 0) {
            throw createMappedError(802);
        }
        if (!(e instanceof PropertyBinding) || !(e.mode & ne)) {
            throw createMappedError(803);
        }
        const i = this.ze.getNodeObserverConfig(e.target, e.targetProperty);
        if (i == null) {
            throw createMappedError(9992, e);
        }
        const n = this.ze.getNodeObserver(e.target, e.targetProperty, this.oL);
        n.useConfig({
            readonly: i.readonly,
            default: i.default,
            events: s
        });
        e.useTargetObserver(n);
    }
}

UpdateTriggerBindingBehavior.$au = {
    type: we,
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
        this.Ge = false;
        this.Ke = 0;
        this.Xe = p(es);
        this.l = p(xi);
    }
    attaching(t, e) {
        return this.Qe(this.value);
    }
    detaching(t, e) {
        this.Ge = true;
        return S(this.pending, (() => {
            this.Ge = false;
            this.pending = void 0;
            void this.view?.deactivate(t, this.$controller);
        }));
    }
    valueChanged(t, e) {
        if (!this.$controller.isActive) return;
        t = !!t;
        e = !!e;
        if (t !== e) return this.Qe(t);
    }
    Qe(t) {
        const e = this.view;
        const s = this.$controller;
        const i = this.Ke++;
        const isCurrent = () => !this.Ge && this.Ke === i + 1;
        let n;
        return S(this.pending, (() => this.pending = S(e?.deactivate(e, s), (() => {
            if (!isCurrent()) {
                return;
            }
            if (t) {
                n = this.view = this.ifView = this.cache && this.ifView != null ? this.ifView : this.Xe.create();
            } else {
                n = this.view = this.elseView = this.cache && this.elseView != null ? this.elseView : this.elseFactory?.create();
            }
            if (n == null) {
                return;
            }
            n.setLocation(this.l);
            return S(n.activate(n, s, s.scope), (() => {
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
    type: Ie,
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
        this.f = p(es);
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

const $i = [ "BindingBehavior", "ValueConverter" ];

class Repeat {
    constructor(t, e, s, i, n) {
        this.views = [];
        this.Ye = [];
        this.key = null;
        this.Ze = new Map;
        this.Je = new Map;
        this.ts = void 0;
        this.es = false;
        this.ss = false;
        this.rs = null;
        this.os = void 0;
        this.ls = false;
        const r = t.props[0].props[0];
        if (r !== void 0) {
            const {to: t, value: s, command: i} = r;
            if (t === "key") {
                if (i === null) {
                    this.key = s;
                } else if (i === "bind") {
                    this.key = e.parse(s, Ut);
                } else {
                    throw createMappedError(775, i);
                }
            } else {
                throw createMappedError(776, t);
            }
        }
        this.l = s;
        this.cs = i;
        this.f = n;
    }
    binding(t, e) {
        const s = this.cs.bindings;
        const i = s.length;
        let n = void 0;
        let r;
        let l = 0;
        for (;i > l; ++l) {
            n = s[l];
            if (n.target === this && n.targetProperty === "items") {
                r = this.forOf = n.ast;
                this.us = n;
                let t = r.iterable;
                while (t != null && $i.includes(t.$kind)) {
                    t = t.expression;
                    this.es = true;
                }
                this.rs = t;
                break;
            }
        }
        this.ds();
        const a = r.declaration;
        if (!(this.ls = a.$kind === "ArrayDestructuring" || a.$kind === "ObjectDestructuring")) {
            this.local = Zt(a, this.$controller.scope, n, null);
        }
    }
    attaching(t, e) {
        this.gs();
        return this.ps(t);
    }
    detaching(t, e) {
        this.ds();
        return this.xs(t);
    }
    unbinding(t, e) {
        this.Je.clear();
        this.Ze.clear();
    }
    itemsChanged() {
        if (!this.$controller.isActive) {
            return;
        }
        this.ds();
        this.gs();
        this.bs(this.items, void 0);
    }
    handleCollectionChange(t, e) {
        const s = this.$controller;
        if (!s.isActive) {
            return;
        }
        if (this.es) {
            if (this.ss) {
                return;
            }
            this.ss = true;
            this.items = Zt(this.forOf.iterable, s.scope, this.us, null);
            this.ss = false;
            return;
        }
        this.gs();
        this.bs(t, e);
    }
    bs(t, e) {
        const s = this.views;
        this.Ye = s.slice();
        const i = s.length;
        const n = this.key;
        const r = n !== null;
        if (r || e === void 0) {
            const t = this.local;
            const l = this.os;
            const a = l.length;
            const h = this.forOf;
            const c = h.declaration;
            const u = this.us;
            const f = this.ls;
            e = K(a);
            let d = 0;
            if (i === 0) {
                for (;d < a; ++d) {
                    e[d] = -2;
                }
            } else if (a === 0) {
                if (f) {
                    for (d = 0; d < i; ++d) {
                        e.deletedIndices.push(d);
                        e.deletedItems.push(Zt(c, s[d].scope, u, null));
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
                        m[d] = Zt(c, s[d].scope, u, null);
                    }
                } else {
                    for (d = 0; d < i; ++d) {
                        m[d] = s[d].scope.bindingContext[t];
                    }
                }
                let g;
                let p;
                let v;
                let x;
                let b = 0;
                const w = i - 1;
                const y = a - 1;
                const k = new Map;
                const C = new Map;
                const B = this.Ze;
                const A = this.Je;
                const S = this.$controller.scope;
                d = 0;
                t: {
                    while (true) {
                        if (r) {
                            g = m[d];
                            p = l[d];
                            v = getKeyValue(B, n, g, getScope(A, g, h, S, u, t, f), u);
                            x = getKeyValue(B, n, p, getScope(A, p, h, S, u, t, f), u);
                        } else {
                            g = v = ensureUnique(m[d], d);
                            p = x = ensureUnique(l[d], d);
                        }
                        if (v !== x) {
                            B.set(g, v);
                            B.set(p, x);
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
                    b = y;
                    while (true) {
                        if (r) {
                            g = m[b];
                            p = l[b];
                            v = getKeyValue(B, n, g, getScope(A, g, h, S, u, t, f), u);
                            x = getKeyValue(B, n, p, getScope(A, p, h, S, u, t, f), u);
                        } else {
                            g = v = ensureUnique(m[d], d);
                            p = x = ensureUnique(l[d], d);
                        }
                        if (v !== x) {
                            B.set(g, v);
                            B.set(p, x);
                            break;
                        }
                        --b;
                        if (d > b) {
                            break t;
                        }
                    }
                }
                const E = d;
                const R = d;
                for (d = R; d <= y; ++d) {
                    if (B.has(p = r ? l[d] : ensureUnique(l[d], d))) {
                        x = B.get(p);
                    } else {
                        x = r ? getKeyValue(B, n, p, getScope(A, p, h, S, u, t, f), u) : p;
                        B.set(p, x);
                    }
                    C.set(x, d);
                }
                for (d = E; d <= w; ++d) {
                    if (B.has(g = r ? m[d] : ensureUnique(m[d], d))) {
                        v = B.get(g);
                    } else {
                        v = r ? getKeyValue(B, n, g, s[d].scope, u) : g;
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
                    if (!k.has(B.get(r ? l[d] : ensureUnique(l[d], d)))) {
                        e[d] = -2;
                    }
                }
                k.clear();
                C.clear();
            }
        }
        if (e === void 0) {
            const t = S(this.xs(null), (() => this.ps(null)));
            if (isPromise(t)) {
                t.catch(rethrow);
            }
        } else {
            if (e.deletedIndices.length > 0) {
                const t = S(this.ws(e), (() => this.ys(i, e)));
                if (isPromise(t)) {
                    t.catch(rethrow);
                }
            } else {
                this.ys(i, e);
            }
        }
    }
    ds() {
        const t = this.$controller.scope;
        let e = this.ks;
        let s = this.es;
        let i;
        if (s) {
            e = this.ks = Zt(this.rs, t, this.us, null) ?? null;
            s = this.es = !Ht(this.items, e);
        }
        const n = this.ts;
        if (this.$controller.isActive) {
            i = this.ts = X(s ? e : this.items);
            if (n !== i) {
                n?.unsubscribe(this);
                i?.subscribe(this);
            }
        } else {
            n?.unsubscribe(this);
            this.ts = undefined;
        }
    }
    gs() {
        const {items: t} = this;
        if (isArray(t)) {
            this.os = t;
            return;
        }
        const e = [];
        iterate(t, ((t, s) => {
            e[s] = t;
        }));
        this.os = e;
    }
    ps(t) {
        let e = void 0;
        let s;
        let i;
        let n;
        const {$controller: r, f: l, local: a, l: h, items: c, Je: u, us: f, forOf: d, ls: m} = this;
        const g = r.scope;
        const p = getCount(c);
        const v = this.views = Array(p);
        iterate(c, ((c, x) => {
            i = v[x] = l.create().setLocation(h);
            i.nodes.unlink();
            n = getScope(u, c, d, g, f, a, m);
            setContextualProperties(n.overrideContext, x, p);
            s = i.activate(t ?? i, r, n);
            if (isPromise(s)) {
                (e ?? (e = [])).push(s);
            }
        }));
        if (e !== void 0) {
            return e.length === 1 ? e[0] : Promise.all(e);
        }
    }
    xs(t) {
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
    ws(t) {
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
    ys(t, e) {
        let s = void 0;
        let i;
        let n;
        let r;
        let l = 0;
        const {$controller: a, f: h, local: c, os: u, l: f, views: d, ls: m, us: g, Je: p, Ye: v, forOf: x} = this;
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
        const w = a.scope;
        const y = e.length;
        let k = 0;
        l = 0;
        for (;l < e.length; ++l) {
            if ((k = e[l]) !== -2) {
                d[l] = v[k];
            }
        }
        const C = longestIncreasingSubsequence(e);
        const B = C.length;
        const A = x.declaration;
        let S;
        let E = B - 1;
        l = y - 1;
        for (;l >= 0; --l) {
            n = d[l];
            S = d[l + 1];
            n.nodes.link(S?.nodes ?? f);
            if (e[l] === -2) {
                r = getScope(p, u[l], x, w, g, c, m);
                setContextualProperties(r.overrideContext, l, y);
                n.setLocation(f);
                i = n.activate(n, a, r);
                if (isPromise(i)) {
                    (s ?? (s = [])).push(i);
                }
            } else if (E < 0 || B === 1 || l !== C[E]) {
                if (m) {
                    Yt(A, n.scope, g, u[l]);
                } else {
                    n.scope.bindingContext[c] = u[l];
                }
                setContextualProperties(n.scope.overrideContext, l, y);
                n.nodes.insertBefore(n.location);
            } else {
                if (m) {
                    Yt(A, n.scope, g, u[l]);
                } else {
                    n.scope.bindingContext[c] = u[l];
                }
                if (t !== y) {
                    setContextualProperties(n.scope.overrideContext, l, y);
                }
                --E;
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
    type: Ie,
    name: "repeat",
    isTemplateController: true,
    bindables: [ "items" ]
};

Repeat.inject = [ tt, e, xi, ui, es ];

let ji = 16;

let Wi = new Int32Array(ji);

let Ui = new Int32Array(ji);

function longestIncreasingSubsequence(t) {
    const e = t.length;
    if (e > ji) {
        ji = e;
        Wi = new Int32Array(e);
        Ui = new Int32Array(e);
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
            l = Wi[s];
            n = t[l];
            if (n !== -2 && n < i) {
                Ui[r] = l;
                Wi[++s] = r;
                continue;
            }
            a = 0;
            h = s;
            while (a < h) {
                c = a + h >> 1;
                n = t[Wi[c]];
                if (n !== -2 && n < i) {
                    a = c + 1;
                } else {
                    h = c;
                }
            }
            n = t[Wi[a]];
            if (i < n || n === -2) {
                if (a > 0) {
                    Ui[r] = Wi[a - 1];
                }
                Wi[a] = r;
            }
        }
    }
    r = ++s;
    const u = new Int32Array(r);
    i = Wi[s - 1];
    while (s-- > 0) {
        u[s] = i;
        i = Ui[i];
    }
    while (r-- > 0) Wi[r] = 0;
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

const zi = It.toString;

const getCount = t => {
    switch (zi.call(t)) {
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
    switch (zi.call(t)) {
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
            r = Zt(e, i, n, null);
        }
        t.set(s, r);
    }
    return r;
};

const getScope = (t, e, s, i, n, r, l) => {
    let a = t.get(e);
    if (a === void 0) {
        if (l) {
            Yt(s.declaration, a = Scope.fromParent(i, new BindingContext), n, e);
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
        this.view = p(es).create().setLocation(p(xi));
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
    type: Ie,
    name: "with",
    isTemplateController: true,
    bindables: [ "value" ]
};

class Switch {
    constructor() {
        this.cases = [];
        this.activeCases = [];
        this.promise = void 0;
        this.f = p(es);
        this.l = p(xi);
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
        this.queue((() => this.Cs(t)));
    }
    Cs(t) {
        const e = t.isMatch(this.value);
        const s = this.activeCases;
        const i = s.length;
        if (!e) {
            if (i > 0 && s[0].id === t.id) {
                return this.Bs(null);
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
        return S(this.Bs(null, n), (() => {
            this.activeCases = n;
            return this.As(null);
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
        return S(this.activeCases.length > 0 ? this.Bs(t, s) : void 0, (() => {
            this.activeCases = s;
            if (s.length === 0) {
                return;
            }
            return this.As(t);
        }));
    }
    As(t) {
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
        return A(...s.map((e => e.activate(t, n))));
    }
    Bs(t, e = []) {
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
        return S(A(...s.reduce(((s, i) => {
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
        s = this.promise = S(S(e, t), (() => {
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
    type: Ie,
    name: "switch",
    isTemplateController: true,
    bindables: [ "value" ]
};

let Gi = 0;

class Case {
    constructor() {
        this.id = ++Gi;
        this.fallThrough = false;
        this.view = void 0;
        this.f = p(es);
        this.He = p(V);
        this.l = p(xi);
        this.Ss = p(q).scopeTo(`${this.constructor.name}-#${this.id}`);
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
        this.Ss.debug("isMatch()");
        const e = this.value;
        if (isArray(e)) {
            if (this.ts === void 0) {
                this.ts = this.Es(e);
            }
            return e.includes(t);
        }
        return e === t;
    }
    valueChanged(t, e) {
        if (isArray(t)) {
            this.ts?.unsubscribe(this);
            this.ts = this.Es(t);
        } else if (this.ts !== void 0) {
            this.ts.unsubscribe(this);
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
        this.ts?.unsubscribe(this);
        this.view?.dispose();
        this.view = void 0;
    }
    linkToSwitch(t) {
        t.cases.push(this);
    }
    Es(t) {
        const e = this.He.getArrayObserver(t);
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
        mode: se,
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
        this.f = p(es);
        this.l = p(xi);
        this.p = p(Me);
        this.logger = p(q).scopeTo("promise.resolve");
    }
    link(t, e, s, i) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(t, e) {
        const s = this.view;
        const i = this.$controller;
        return S(s.activate(t, i, this.viewScope = Scope.fromParent(i.scope, {})), (() => this.swap(t)));
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
            void A(a = (this.preSettledTask = s.queueTask((() => A(i?.deactivate(t), n?.deactivate(t), r?.activate(t, l))), h)).result.catch((t => {
                if (!(t instanceof Lt)) throw t;
            })), e.then((c => {
                if (this.value !== e) {
                    return;
                }
                const fulfill = () => {
                    this.postSettlePromise = (this.postSettledTask = s.queueTask((() => A(r?.deactivate(t), n?.deactivate(t), i?.activate(t, l, c))), h)).result;
                };
                if (this.preSettledTask.status === Gt) {
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
                    this.postSettlePromise = (this.postSettledTask = s.queueTask((() => A(r?.deactivate(t), i?.deactivate(t), n?.activate(t, l, c))), h)).result;
                };
                if (this.preSettledTask.status === Gt) {
                    void a.then(reject);
                } else {
                    this.preSettledTask.cancel();
                    reject();
                }
            })));
        };
        if (this.postSettledTask?.status === Gt) {
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
    type: Ie,
    name: "promise",
    isTemplateController: true,
    bindables: [ "value" ]
};

class PendingTemplateController {
    constructor() {
        this.view = void 0;
        this.f = p(es);
        this.l = p(xi);
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
    type: Ie,
    name: "pending",
    isTemplateController: true,
    bindables: {
        value: {
            mode: ie
        }
    }
};

class FulfilledTemplateController {
    constructor() {
        this.view = void 0;
        this.f = p(es);
        this.l = p(xi);
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
    type: Ie,
    name: "then",
    isTemplateController: true,
    bindables: {
        value: {
            mode: ne
        }
    }
};

class RejectedTemplateController {
    constructor() {
        this.view = void 0;
        this.f = p(es);
        this.l = p(xi);
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
    type: Ie,
    name: "catch",
    isTemplateController: true,
    bindables: {
        value: {
            mode: ne
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
        return new lt(t, e, "promise", "bind");
    }
}

ot.define([ {
    pattern: "promise.resolve",
    symbols: ""
} ], PromiseAttributePattern);

class FulfilledAttributePattern {
    then(t, e) {
        return new lt(t, e, "then", "from-view");
    }
}

ot.define([ {
    pattern: "then",
    symbols: ""
} ], FulfilledAttributePattern);

class RejectedAttributePattern {
    catch(t, e) {
        return new lt(t, e, "catch", "from-view");
    }
}

ot.define([ {
    pattern: "catch",
    symbols: ""
} ], RejectedAttributePattern);

class Focus {
    constructor() {
        this.Rs = false;
        this.Ts = p(pi);
        this.p = p(Me);
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) {
            this.Ls();
        } else {
            this.Rs = true;
        }
    }
    attached() {
        if (this.Rs) {
            this.Rs = false;
            this.Ls();
        }
        this.Ts.addEventListener("focus", this);
        this.Ts.addEventListener("blur", this);
    }
    detaching() {
        const t = this.Ts;
        t.removeEventListener("focus", this);
        t.removeEventListener("blur", this);
    }
    handleEvent(t) {
        if (t.type === "focus") {
            this.value = true;
        } else if (!this.Ms) {
            this.value = false;
        }
    }
    Ls() {
        const t = this.Ts;
        const e = this.Ms;
        const s = this.value;
        if (s && !e) {
            t.focus();
        } else if (!s && e) {
            t.blur();
        }
    }
    get Ms() {
        return this.Ts === this.p.document.activeElement;
    }
}

Focus.$au = {
    type: Ie,
    name: "focus",
    bindables: {
        value: {
            mode: re
        }
    }
};

class Portal {
    constructor() {
        this.position = "beforeend";
        this.strict = false;
        const t = p(es);
        const e = p(xi);
        const s = p(Me);
        this.p = s;
        this.Ds = s.document.createElement("div");
        (this.view = t.create()).setLocation(this.Is = createLocation(s));
        setEffectiveParentNode(this.view.nodes, e);
    }
    attaching(t) {
        if (this.callbackContext == null) {
            this.callbackContext = this.$controller.scope.bindingContext;
        }
        const e = this.Ds = this.qs();
        this.Ps(e, this.position);
        return this._s(t, e);
    }
    detaching(t) {
        return this.Fs(t, this.Ds);
    }
    targetChanged() {
        const {$controller: t} = this;
        if (!t.isActive) {
            return;
        }
        const e = this.qs();
        if (this.Ds === e) {
            return;
        }
        this.Ds = e;
        const s = S(this.Fs(null, e), (() => {
            this.Ps(e, this.position);
            return this._s(null, e);
        }));
        if (isPromise(s)) {
            s.catch(rethrow);
        }
    }
    positionChanged() {
        const {$controller: t, Ds: e} = this;
        if (!t.isActive) {
            return;
        }
        const s = S(this.Fs(null, e), (() => {
            this.Ps(e, this.position);
            return this._s(null, e);
        }));
        if (isPromise(s)) {
            s.catch(rethrow);
        }
    }
    _s(t, e) {
        const {activating: s, callbackContext: i, view: n} = this;
        return S(s?.call(i, e, n), (() => this.Os(t, e)));
    }
    Os(t, e) {
        const {$controller: s, view: i} = this;
        if (t === null) {
            i.nodes.insertBefore(this.Is);
        } else {
            return S(i.activate(t ?? i, s, s.scope), (() => this.Vs(e)));
        }
        return this.Vs(e);
    }
    Vs(t) {
        const {activated: e, callbackContext: s, view: i} = this;
        return e?.call(s, t, i);
    }
    Fs(t, e) {
        const {deactivating: s, callbackContext: i, view: n} = this;
        return S(s?.call(i, e, n), (() => this.Hs(t, e)));
    }
    Hs(t, e) {
        const {$controller: s, view: i} = this;
        if (t === null) {
            i.nodes.remove();
        } else {
            return S(i.deactivate(t, s), (() => this.Ns(e)));
        }
        return this.Ns(e);
    }
    Ns(t) {
        const {deactivated: e, callbackContext: s, view: i} = this;
        return S(e?.call(s, t, i), (() => this.$s()));
    }
    qs() {
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
    $s() {
        this.Is.remove();
        this.Is.$start.remove();
    }
    Ps(t, e) {
        const s = this.Is;
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
    type: Ie,
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

let Ki;

class AuSlot {
    constructor() {
        this.js = null;
        this.Ws = null;
        this.Kt = false;
        this.expose = null;
        this.slotchange = null;
        this.Us = new Set;
        this.ts = null;
        const t = p(fi);
        const e = p(xi);
        const s = p(tt);
        const i = p(Ps);
        const n = this.name = s.data.name;
        const r = s.projections?.[ns];
        const l = t.instruction?.projections?.[n];
        const a = t.controller.container;
        let h;
        let c;
        if (l == null) {
            c = a.createChild({
                inheritParentResources: true
            });
            h = i.getViewFactory(r ?? (Ki ??= CustomElementDefinition.create({
                name: "au-slot-empty-template",
                template: "",
                needsCompile: false
            })), c);
            this.zs = false;
        } else {
            c = a.createChild();
            c.useResources(t.parent.controller.container);
            registerResolver(c, fi, new y(void 0, t.parent));
            h = i.getViewFactory(l, c);
            this.zs = true;
            this.Gs = a.getAll(ls, false)?.filter((t => t.slotName === "*" || t.slotName === n)) ?? x;
        }
        this.Ks = (this.Gs ??= x).length > 0;
        this.Xs = t;
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
        this.Us.add(t);
    }
    unsubscribe(t) {
        this.Us.delete(t);
    }
    binding(t, e) {
        while (e.vmKind === "synthetic" && e.parent?.viewModel instanceof AuSlot) {
            e = e.parent.parent;
        }
        this.js = e.scope;
        let s;
        if (this.zs) {
            s = this.Xs.controller.scope.parent;
            (this.Ws = Scope.fromParent(s, s.bindingContext)).overrideContext.$host = this.expose ?? this.js.bindingContext;
        }
    }
    attaching(t, e) {
        return S(this.view.activate(t, this.$controller, this.zs ? this.Ws : this.js), (() => {
            if (this.Ks) {
                this.Gs.forEach((t => t.watch(this)));
                this.We();
                this.Qs();
                this.Kt = true;
            }
        }));
    }
    detaching(t, e) {
        this.Kt = false;
        this.Ys();
        this.Gs.forEach((t => t.unwatch(this)));
        return this.view.deactivate(t, this.$controller);
    }
    exposeChanged(t) {
        if (this.zs && this.Ws != null) {
            this.Ws.overrideContext.$host = t;
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
        if (this.ts != null) {
            return;
        }
        const t = this.l;
        const e = t.parentElement;
        if (e == null) {
            return;
        }
        (this.ts = createMutationObserver(e, (e => {
            if (isMutationWithinLocation(t, e)) {
                this.Qs();
            }
        }))).observe(e, {
            childList: true
        });
    }
    Ys() {
        this.ts?.disconnect();
        this.ts = null;
    }
    Qs() {
        const t = this.nodes;
        const e = new Set(this.Us);
        let s;
        if (this.Kt) {
            this.slotchange?.call(void 0, this.name, t);
        }
        for (s of e) {
            s.handleSlotChange(this, t);
        }
    }
}

AuSlot.$au = {
    type: Si,
    name: "au-slot",
    template: null,
    containerless: true,
    processContent(t, e, s) {
        s.name = t.getAttribute("name") ?? ns;
        let i = t.firstChild;
        let n = null;
        while (i !== null) {
            n = i.nextSibling;
            if (isElement(i) && i.hasAttribute(rs)) {
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
        this.Zs = void 0;
        this.tag = null;
        this.c = p(k);
        this.parent = p(ui);
        this.Js = p(pi);
        this.l = p(xi);
        this.p = p(Me);
        this.r = p(Ps);
        this.ti = p(tt);
        this.ei = p(P(CompositionContextFactory, null));
        this.et = p(J);
        this.Z = p(fi);
        this.ep = p(e);
        this.oL = p(V);
    }
    get composing() {
        return this.si;
    }
    get composition() {
        return this.Zs;
    }
    attaching(t, e) {
        return this.si = S(this.queue(new ChangeInfo(this.template, this.component, this.model, void 0), t), (t => {
            if (this.ei.ii(t)) {
                this.si = void 0;
            }
        }));
    }
    detaching(t) {
        const e = this.Zs;
        const s = this.si;
        this.ei.invalidate();
        this.Zs = this.si = void 0;
        return S(s, (() => e?.deactivate(t)));
    }
    propertyChanged(t) {
        if (t === "composing" || t === "composition") return;
        if (t === "model" && this.Zs != null) {
            this.Zs.update(this.model);
            return;
        }
        if (t === "tag" && this.Zs?.controller.vmKind === ti) {
            return;
        }
        this.si = S(this.si, (() => S(this.queue(new ChangeInfo(this.template, this.component, this.model, t), void 0), (t => {
            if (this.ei.ii(t)) {
                this.si = void 0;
            }
        }))));
    }
    queue(t, e) {
        const s = this.ei;
        const i = this.Zs;
        return S(s.create(t), (t => {
            if (s.ii(t)) {
                return S(this.compose(t), (n => {
                    if (s.ii(t)) {
                        return S(n.activate(e), (() => {
                            if (s.ii(t)) {
                                this.Zs = n;
                                return S(i?.deactivate(e), (() => t));
                            } else {
                                return S(n.controller.deactivate(n.controller, this.$controller), (() => {
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
        const {ni: e, ri: s, oi: i} = t.change;
        const {c: n, $controller: r, l: l, ti: a} = this;
        const h = this.li(this.Z.controller.container, s);
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
        const d = this.ai(c, typeof s === "string" ? h.Type : s, u, f);
        const compose = () => {
            const s = a.captures ?? x;
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
                this.hi(u, h, n).forEach((t => l.addBinding(t)));
                return new CompositionController(l, (t => l.activate(t ?? l, r, r.scope.parent)), (t => S(l.deactivate(t ?? l, r), removeCompositionHost)), (t => d.activate?.(t)), t);
            } else {
                const i = CustomElementDefinition.create({
                    name: Li.generateName(),
                    template: e
                });
                const n = this.r.getViewFactory(i, c);
                const l = Controller.$view(n, r);
                const a = this.scopeBehavior === "auto" ? Scope.fromParent(this.parent.scope, d) : Scope.create(d);
                l.setHost(u);
                if (f == null) {
                    this.hi(u, i, s).forEach((t => l.addBinding(t)));
                } else {
                    l.setLocation(f);
                }
                return new CompositionController(l, (t => l.activate(t ?? l, r, a)), (t => S(l.deactivate(t ?? l, r), removeCompositionHost)), (t => d.activate?.(t)), t);
            }
        };
        if ("activate" in d) {
            return S(d.activate(i), (() => compose()));
        } else {
            return compose();
        }
    }
    ai(t, e, s, i) {
        if (e == null) {
            return new EmptyComponent;
        }
        if (typeof e === "object") {
            return e;
        }
        const n = this.p;
        registerHostNode(t, n, s);
        registerResolver(t, xi, new y("IRenderLocation", i));
        const r = t.invoke(e);
        registerResolver(t, e, new y("au-compose.component", r));
        return r;
    }
    li(t, e) {
        if (typeof e === "string") {
            const s = Li.find(t, e);
            if (s == null) {
                throw createMappedError(806, e);
            }
            return s;
        }
        const s = isFunction(e) ? e : e?.constructor;
        return Li.isType(s, void 0) ? Li.getDefinition(s, null) : null;
    }
    hi(t, e, s) {
        const i = new HydrationContext(this.$controller, {
            projections: null,
            captures: s
        }, this.Z.parent);
        return SpreadBinding.create(i, t, e, this.r, this.et, this.p, this.ep, this.oL);
    }
}

AuCompose.$au = {
    type: Si,
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
        mode: ne
    }, {
        name: "composition",
        mode: ne
    }, "tag" ]
};

class EmptyComponent {}

class CompositionContextFactory {
    constructor() {
        this.id = 0;
    }
    ii(t) {
        return t.id === this.id;
    }
    create(t) {
        return S(t.load(), (t => new CompositionContext(++this.id, t)));
    }
    invalidate() {
        this.id++;
    }
}

class ChangeInfo {
    constructor(t, e, s, i) {
        this.ni = t;
        this.ri = e;
        this.oi = s;
        this.ci = i;
    }
    load() {
        if (isPromise(this.ni) || isPromise(this.ri)) {
            return Promise.all([ this.ni, this.ri ]).then((([t, e]) => new LoadedChangeInfo(t, e, this.oi, this.ci)));
        } else {
            return new LoadedChangeInfo(this.ni, this.ri, this.oi, this.ci);
        }
    }
}

class LoadedChangeInfo {
    constructor(t, e, s, i) {
        this.ni = t;
        this.ri = e;
        this.oi = s;
        this.ci = i;
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

const Xi = /*@__PURE__*/ me("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw createMappedError(99, "sanitize");
    }
})));

class SanitizeValueConverter {
    constructor() {
        this.ui = p(Xi);
    }
    toView(t) {
        if (t == null) {
            return null;
        }
        return this.ui.sanitize(t);
    }
}

SanitizeValueConverter.$au = {
    type: Oe,
    name: "sanitize"
};

class Show {
    constructor() {
        this.el = p(pi);
        this.p = p(Me);
        this.fi = false;
        this.T = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.T = null;
            if (Boolean(this.value) !== this.di) {
                if (this.di === this.mi) {
                    this.di = !this.mi;
                    this.$val = this.el.style.getPropertyValue("display");
                    this.$prio = this.el.style.getPropertyPriority("display");
                    this.el.style.setProperty("display", "none", "important");
                } else {
                    this.di = this.mi;
                    this.el.style.setProperty("display", this.$val, this.$prio);
                    if (this.el.getAttribute("style") === "") {
                        this.el.removeAttribute("style");
                    }
                }
            }
        };
        const t = p(tt);
        this.di = this.mi = t.alias !== "hide";
    }
    binding() {
        this.fi = true;
        this.update();
    }
    detaching() {
        this.fi = false;
        this.T?.cancel();
        this.T = null;
    }
    valueChanged() {
        if (this.fi && this.T === null) {
            this.T = this.p.domWriteQueue.queueTask(this.update);
        }
    }
}

Show.$au = {
    type: Ie,
    name: "show",
    bindables: [ "value" ],
    aliases: [ "hide" ]
};

const Qi = [ Pi, Q, NodeObserverLocator ];

const Yi = [ at, ht, ct, ut, ts ];

const Zi = [ ft, dt ];

const Ji = [ mt, gt, pt, vt, xt, bt, wt, yt, kt, Ct, Bt, At, St ];

const tn = [ DebounceBindingBehavior, OneTimeBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, SignalBindingBehavior, ThrottleBindingBehavior, TwoWayBindingBehavior, SanitizeValueConverter, If, Else, Repeat, With, Switch, Case, DefaultCase, PromiseTemplateController, PendingTemplateController, FulfilledTemplateController, RejectedTemplateController, PromiseAttributePattern, FulfilledAttributePattern, RejectedAttributePattern, AttrBindingBehavior, SelfBindingBehavior, UpdateTriggerBindingBehavior, AuCompose, Portal, Focus, Show, AuSlot ];

const en = [ vs, xs, gs, ps, cs, us, fs, ds, ms, ys, Ss, ks, Cs, Bs, As, bs, Es ];

const sn = /*@__PURE__*/ createConfiguration(a);

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
            return e.register(ve($, s.coercingOptions), ...Qi, ...tn, ...Yi, ...Ji, ...en);
        },
        customize(e) {
            return createConfiguration(e ?? t);
        }
    };
}

function children(t, e) {
    if (!on) {
        on = true;
        O(ChildrenBinding, null);
        lifecycleHooks()(ChildrenLifecycleHooks, null);
    }
    let s;
    const i = ce("dependencies");
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
    constructor(t, e, s, i = defaultChildQuery, n = defaultChildFilter, r = defaultChildMap, l = nn) {
        this.gi = void 0;
        this.K = defaultChildQuery;
        this.pi = defaultChildFilter;
        this.vi = defaultChildMap;
        this.isBound = false;
        this.L = t;
        this.obj = e;
        this.cb = s;
        this.K = i;
        this.pi = n;
        this.vi = r;
        this.V = l;
        this.ts = createMutationObserver(this.Js = t.host, (() => {
            this.xi();
        }));
    }
    getValue() {
        return this.isBound ? this.gi : this.bi();
    }
    setValue(t) {}
    bind() {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        this.ts.observe(this.Js, this.V);
        this.gi = this.bi();
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.ts.disconnect();
        this.gi = x;
    }
    xi() {
        this.gi = this.bi();
        this.cb?.call(this.obj);
        this.subs.notify(this.gi, undefined);
    }
    get() {
        throw createMappedError(99, "get");
    }
    bi() {
        return filterChildren(this.L, this.K, this.pi, this.vi);
    }
}

const nn = {
    childList: true
};

const defaultChildQuery = t => t.host.childNodes;

const defaultChildFilter = (t, e, s) => !!s;

const defaultChildMap = (t, e, s) => s;

const rn = {
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
        h = findElementControllerFor(a, rn);
        c = h?.viewModel ?? null;
        if (s(a, h, c)) {
            l.push(i(a, h, c));
        }
    }
    return l;
};

class ChildrenLifecycleHooks {
    constructor(t) {
        this.X = t;
    }
    register(t) {
        ve(_e, this).register(t);
    }
    hydrating(t, e) {
        const s = this.X;
        const i = new ChildrenBinding(e, t, t[s.callback ?? `${Dt(s.name)}Changed`], s.query ?? defaultChildQuery, s.filter ?? defaultChildFilter, s.map ?? defaultChildMap, s.options ?? nn);
        Nt(t, s.name, {
            enumerable: true,
            configurable: true,
            get: _t((() => i.getValue()), {
                getObserver: () => i
            }),
            set: () => {}
        });
        e.addBinding(i);
    }
}

let on = false;

export { AdoptedStyleSheetsStyles, AppRoot, Le as AppTask, AttrBindingBehavior, AttrMapper, AttributeBinding, Ss as AttributeBindingRenderer, AttributeNSAccessor, AuCompose, AuSlot, AuSlotsInfo, Aurelia, fe as Bindable, BindableDefinition, ke as BindingBehavior, BindingBehaviorDefinition, BindingContext, BindingModeBehavior, BindingTargetSubscriber, CSSModulesProcessorRegistry, Case, CheckedObserver, ChildrenBinding, ClassAttributeAccessor, ComputedWatcher, ContentBinding, Controller, Pe as CustomAttribute, CustomAttributeDefinition, fs as CustomAttributeRenderer, Li as CustomElement, CustomElementDefinition, us as CustomElementRenderer, DataAttributeAccessor, DebounceBindingBehavior, Ji as DefaultBindingLanguage, Yi as DefaultBindingSyntax, DefaultCase, Qi as DefaultComponents, en as DefaultRenderers, tn as DefaultResources, Else, EventModifier, ts as EventModifierRegistration, ExpressionWatcher, FlushQueue, Focus, FragmentNodeSequence, FromViewBindingBehavior, FulfilledTemplateController, Di as IAppRoot, Te as IAppTask, ls as IAuSlotWatcher, os as IAuSlotsInfo, Ii as IAurelia, ui as IController, Je as IEventModifier, vi as IEventTarget, je as IFlushQueue, Ci as IHistory, fi as IHydrationContext, Ze as IKeyMapping, _e as ILifecycleHooks, ws as IListenerBindingOptions, ki as ILocation, Ye as IModifiedEventHandlerCreator, pi as INode, Me as IPlatform, xi as IRenderLocation, hs as IRenderer, Ps as IRendering, qi as ISVGAnalyzer, Xi as ISanitizer, Os as IShadowDOMGlobalStyles, _s as IShadowDOMStyleFactory, Fs as IShadowDOMStyles, Se as ISignaler, es as IViewFactory, yi as IWindow, If, InterpolationBinding, ps as InterpolationBindingRenderer, InterpolationPartBinding, xs as IteratorBindingRenderer, LetBinding, ms as LetElementRenderer, Fe as LifecycleHooks, LifecycleHooksDefinition, LifecycleHooksEntry, ListenerBinding, ListenerBindingOptions, ys as ListenerBindingRenderer, NodeObserverLocator, NoopSVGAnalyzer, OneTimeBindingBehavior, PendingTemplateController, Portal, PromiseTemplateController, PropertyBinding, vs as PropertyBindingRenderer, RefBinding, gs as RefBindingRenderer, RejectedTemplateController, Rendering, Repeat, Pi as RuntimeTemplateCompilerImplementation, SVGAnalyzer, SanitizeValueConverter, Scope, SelectValueObserver, SelfBindingBehavior, ks as SetAttributeRenderer, Cs as SetClassAttributeRenderer, cs as SetPropertyRenderer, Bs as SetStyleAttributeRenderer, ShadowDOMRegistry, Zi as ShortHandBindingSyntax, SignalBindingBehavior, Es as SpreadRenderer, sn as StandardConfiguration, ci as State, StyleAttributeAccessor, Vs as StyleConfiguration, StyleElementStyles, As as StylePropertyBindingRenderer, Switch, ds as TemplateControllerRenderer, bs as TextBindingRenderer, ThrottleBindingBehavior, ToViewBindingBehavior, TwoWayBindingBehavior, UpdateTriggerBindingBehavior, ValueAttributeObserver, He as ValueConverter, ValueConverterDefinition, ViewFactory, De as Watch, With, alias, Yt as astAssign, Jt as astBind, Zt as astEvaluate, te as astUnbind, bindable, bindingBehavior, capture, children, coercer, containerless, convertToRenderLocation, cssModules, customAttribute, customElement, getEffectiveParentNode, getRef, isCustomElementController, isCustomElementViewModel, isRenderLocation, lifecycleHooks, $e as mixinAstEvaluator, Ne as mixinUseScope, We as mixingBindingLimited, processContent, registerAliases, renderer, setEffectiveParentNode, setRef, shadowCSS, slotted, templateController, useShadowDOM, valueConverter, watch };

