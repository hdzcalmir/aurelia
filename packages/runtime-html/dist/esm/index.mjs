import { DestructuringAssignmentSingleExpression as t, AccessScopeExpression as e, IExpressionParser as s } from "@aurelia/expression-parser";

import { isString as i, createLookup as n, isObject as r, isFunction as l, isArray as a, isArrayIndex as h, Protocol as c, getPrototypeChain as u, kebabCase as f, noop as d, DI as m, Registration as g, firstDefined as p, mergeArrays as v, resourceBaseName as x, resource as b, getResourceKeyFor as w, resolve as y, IPlatform as k, emptyArray as C, ILogger as B, registrableMetadataKey as S, all as A, own as E, InstanceProvider as R, IContainer as T, toArray as L, areEqual as M, optionalResource as D, optional as I, onResolveAll as P, isPromise as q, onResolve as _, fromDefinitionOrDefault as O, pascalCase as F, fromAnnotationOrDefinitionOrTypeOrDefault as V, fromAnnotationOrTypeOrDefault as H, isSymbol as $, createImplementationRegister as N, IServiceLocator as j, emptyObject as W, isNumber as z, isSet as U, isMap as G, transient as K } from "@aurelia/kernel";

import { AccessorType as X, connectable as Q, subscriberCollection as Y, IObserverLocator as Z, ConnectableSwitcher as J, ProxyObservable as tt, ICoercionConfiguration as et, PropertyAccessor as st, INodeObserverLocator as it, IDirtyChecker as nt, getObserverLookup as rt, SetterObserver as ot, createIndexMap as lt, getCollectionObserver as at, DirtyChecker as ht } from "@aurelia/runtime";

import { BindingMode as ct, InstructionType as ut, ITemplateCompiler as ft, IInstruction as dt, TemplateCompilerHooks as mt, IAttrMapper as gt, IResourceResolver as pt, TemplateCompiler as vt, AttributePattern as xt, AttrSyntax as bt, RefAttributePattern as wt, DotSeparatedAttributePattern as yt, EventAttributePattern as kt, AtPrefixedTriggerAttributePattern as Ct, ColonPrefixedBindAttributePattern as Bt, DefaultBindingCommand as St, OneTimeBindingCommand as At, FromViewBindingCommand as Et, ToViewBindingCommand as Rt, TwoWayBindingCommand as Tt, ForBindingCommand as Lt, RefBindingCommand as Mt, TriggerBindingCommand as Dt, CaptureBindingCommand as It, ClassBindingCommand as Pt, StyleBindingCommand as qt, AttrBindingCommand as _t, SpreadValueBindingCommand as Ot } from "@aurelia/template-compiler";

export { BindingCommand, BindingMode } from "@aurelia/template-compiler";

import { Metadata as Ft, isObject as Vt } from "@aurelia/metadata";

import { BrowserPlatform as Ht } from "@aurelia/platform-browser";

import { TaskAbortError as $t } from "@aurelia/platform";

const Nt = Object;

const jt = String;

const Wt = Nt.prototype;

const zt = Wt.hasOwnProperty;

const Ut = Nt.freeze;

const Gt = Nt.assign;

const Kt = Nt.getOwnPropertyNames;

const Xt = Nt.keys;

const Qt = /*@__PURE__*/ n();

const isDataAttribute = (t, e, s) => {
    if (Qt[e] === true) {
        return true;
    }
    if (!i(e)) {
        return false;
    }
    const n = e.slice(0, 5);
    return Qt[e] = n === "aria-" || n === "data-" || s.isStandardSvgAttribute(t, e);
};

const rethrow = t => {
    throw t;
};

const Yt = Reflect.defineProperty;

const defineHiddenProp = (t, e, s) => {
    Yt(t, e, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: s
    });
    return s;
};

const addSignalListener = (t, e, s) => t.addSignalListener(e, s);

const removeSignalListener = (t, e, s) => t.removeSignalListener(e, s);

const Zt = "Interpolation";

const Jt = "IsIterator";

const te = "IsFunction";

const ee = "IsProperty";

const se = "pending";

const ie = "running";

const ne = X.Observer;

const re = X.Node;

const oe = X.Layout;

const createMappedError = (t, ...e) => new Error(`AUR${jt(t).padStart(4, "0")}:${e.map(jt)}`);

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

const {astAssign: le, astEvaluate: ae, astBind: he, astUnbind: ce} = /*@__PURE__*/ (() => {
    const e = "AccessThis";
    const s = "AccessBoundary";
    const i = "AccessGlobal";
    const n = "AccessScope";
    const c = "ArrayLiteral";
    const u = "ObjectLiteral";
    const f = "PrimitiveLiteral";
    const d = "Template";
    const m = "Unary";
    const g = "CallScope";
    const p = "CallMember";
    const v = "CallFunction";
    const x = "CallGlobal";
    const b = "AccessMember";
    const w = "AccessKeyed";
    const y = "TaggedTemplate";
    const k = "Binary";
    const C = "Conditional";
    const B = "Assign";
    const S = "ArrowFunction";
    const A = "ValueConverter";
    const E = "BindingBehavior";
    const R = "ArrayBindingPattern";
    const T = "ObjectBindingPattern";
    const L = "BindingIdentifier";
    const M = "ForOfStatement";
    const D = "Interpolation";
    const I = "ArrayDestructuring";
    const P = "ObjectDestructuring";
    const q = "DestructuringAssignmentLeaf";
    const _ = "Custom";
    const O = Scope.getContext;
    function astEvaluate(t, h, V, H) {
        switch (t.$kind) {
          case e:
            {
                let e = h.overrideContext;
                let s = h;
                let i = t.ancestor;
                while (i-- && e) {
                    s = s.parent;
                    e = s?.overrideContext ?? null;
                }
                return i < 1 && s ? s.bindingContext : void 0;
            }

          case s:
            {
                let t = h;
                while (t != null && !t.isBoundary) {
                    t = t.parent;
                }
                return t ? t.bindingContext : void 0;
            }

          case n:
            {
                const e = O(h, t.name, t.ancestor);
                if (H !== null) {
                    H.observe(e, t.name);
                }
                const s = e[t.name];
                if (s == null && t.name === "$host") {
                    throw createMappedError(105);
                }
                if (V?.strict) {
                    return V?.boundFn && l(s) ? s.bind(e) : s;
                }
                return s == null ? "" : V?.boundFn && l(s) ? s.bind(e) : s;
            }

          case i:
            return globalThis[t.name];

          case x:
            {
                const e = globalThis[t.name];
                if (l(e)) {
                    return e(...t.args.map((t => astEvaluate(t, h, V, H))));
                }
                if (!V?.strictFnCall && e == null) {
                    return void 0;
                }
                throw createMappedError(107);
            }

          case c:
            return t.elements.map((t => astEvaluate(t, h, V, H)));

          case u:
            {
                const e = {};
                for (let s = 0; s < t.keys.length; ++s) {
                    e[t.keys[s]] = astEvaluate(t.values[s], h, V, H);
                }
                return e;
            }

          case f:
            return t.value;

          case d:
            {
                let e = t.cooked[0];
                for (let s = 0; s < t.expressions.length; ++s) {
                    e += String(astEvaluate(t.expressions[s], h, V, H));
                    e += t.cooked[s + 1];
                }
                return e;
            }

          case m:
            switch (t.operation) {
              case "void":
                return void astEvaluate(t.expression, h, V, H);

              case "typeof":
                return typeof astEvaluate(t.expression, h, V, H);

              case "!":
                return !astEvaluate(t.expression, h, V, H);

              case "-":
                return -astEvaluate(t.expression, h, V, H);

              case "+":
                return +astEvaluate(t.expression, h, V, H);

              default:
                throw createMappedError(109, t.operation);
            }

          case g:
            {
                const e = t.args.map((t => astEvaluate(t, h, V, H)));
                const s = O(h, t.name, t.ancestor);
                const i = getFunction(V?.strictFnCall, s, t.name);
                if (i) {
                    return i.apply(s, e);
                }
                return void 0;
            }

          case p:
            {
                const e = astEvaluate(t.object, h, V, H);
                const s = t.args.map((t => astEvaluate(t, h, V, H)));
                const i = getFunction(V?.strictFnCall, e, t.name);
                let n;
                if (i) {
                    n = i.apply(e, s);
                    if (a(e) && F.includes(t.name)) {
                        H?.observeCollection(e);
                    }
                }
                return n;
            }

          case v:
            {
                const e = astEvaluate(t.func, h, V, H);
                if (l(e)) {
                    return e(...t.args.map((t => astEvaluate(t, h, V, H))));
                }
                if (!V?.strictFnCall && e == null) {
                    return void 0;
                }
                throw createMappedError(107);
            }

          case S:
            {
                const func = (...e) => {
                    const s = t.args;
                    const i = t.rest;
                    const n = s.length - 1;
                    const r = s.reduce(((t, s, r) => {
                        if (i && r === n) {
                            t[s.name] = e.slice(r);
                        } else {
                            t[s.name] = e[r];
                        }
                        return t;
                    }), {});
                    const l = Scope.fromParent(h, r);
                    return astEvaluate(t.body, l, V, H);
                };
                return func;
            }

          case b:
            {
                const e = astEvaluate(t.object, h, V, H);
                let s;
                if (V?.strict) {
                    if (e == null) {
                        return undefined;
                    }
                    if (H !== null && !t.accessGlobal) {
                        H.observe(e, t.name);
                    }
                    s = e[t.name];
                    if (V?.boundFn && l(s)) {
                        return s.bind(e);
                    }
                    return s;
                }
                if (H !== null && r(e) && !t.accessGlobal) {
                    H.observe(e, t.name);
                }
                if (e) {
                    s = e[t.name];
                    if (V?.boundFn && l(s)) {
                        return s.bind(e);
                    }
                    return s;
                }
                return "";
            }

          case w:
            {
                const e = astEvaluate(t.object, h, V, H);
                const s = astEvaluate(t.key, h, V, H);
                if (r(e)) {
                    if (H !== null && !t.accessGlobal) {
                        H.observe(e, s);
                    }
                    return e[s];
                }
                return e == null ? void 0 : e[s];
            }

          case y:
            {
                const e = t.expressions.map((t => astEvaluate(t, h, V, H)));
                const s = astEvaluate(t.func, h, V, H);
                if (!l(s)) {
                    throw createMappedError(110);
                }
                return s(t.cooked, ...e);
            }

          case k:
            {
                const e = t.left;
                const s = t.right;
                switch (t.operation) {
                  case "&&":
                    return astEvaluate(e, h, V, H) && astEvaluate(s, h, V, H);

                  case "||":
                    return astEvaluate(e, h, V, H) || astEvaluate(s, h, V, H);

                  case "??":
                    return astEvaluate(e, h, V, H) ?? astEvaluate(s, h, V, H);

                  case "==":
                    return astEvaluate(e, h, V, H) == astEvaluate(s, h, V, H);

                  case "===":
                    return astEvaluate(e, h, V, H) === astEvaluate(s, h, V, H);

                  case "!=":
                    return astEvaluate(e, h, V, H) != astEvaluate(s, h, V, H);

                  case "!==":
                    return astEvaluate(e, h, V, H) !== astEvaluate(s, h, V, H);

                  case "instanceof":
                    {
                        const t = astEvaluate(s, h, V, H);
                        if (l(t)) {
                            return astEvaluate(e, h, V, H) instanceof t;
                        }
                        return false;
                    }

                  case "in":
                    {
                        const t = astEvaluate(s, h, V, H);
                        if (r(t)) {
                            return astEvaluate(e, h, V, H) in t;
                        }
                        return false;
                    }

                  case "+":
                    {
                        const t = astEvaluate(e, h, V, H);
                        const i = astEvaluate(s, h, V, H);
                        if (V?.strict) {
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
                    return astEvaluate(e, h, V, H) - astEvaluate(s, h, V, H);

                  case "*":
                    return astEvaluate(e, h, V, H) * astEvaluate(s, h, V, H);

                  case "/":
                    return astEvaluate(e, h, V, H) / astEvaluate(s, h, V, H);

                  case "%":
                    return astEvaluate(e, h, V, H) % astEvaluate(s, h, V, H);

                  case "<":
                    return astEvaluate(e, h, V, H) < astEvaluate(s, h, V, H);

                  case ">":
                    return astEvaluate(e, h, V, H) > astEvaluate(s, h, V, H);

                  case "<=":
                    return astEvaluate(e, h, V, H) <= astEvaluate(s, h, V, H);

                  case ">=":
                    return astEvaluate(e, h, V, H) >= astEvaluate(s, h, V, H);

                  default:
                    throw createMappedError(108, t.operation);
                }
            }

          case C:
            return astEvaluate(t.condition, h, V, H) ? astEvaluate(t.yes, h, V, H) : astEvaluate(t.no, h, V, H);

          case B:
            return astAssign(t.target, h, V, astEvaluate(t.value, h, V, H));

          case A:
            {
                const e = V?.getConverter?.(t.name);
                if (e == null) {
                    throw createMappedError(103, t.name);
                }
                if ("toView" in e) {
                    return e.toView(astEvaluate(t.expression, h, V, H), ...t.args.map((t => astEvaluate(t, h, V, H))));
                }
                return astEvaluate(t.expression, h, V, H);
            }

          case E:
            return astEvaluate(t.expression, h, V, H);

          case L:
            return t.name;

          case M:
            return astEvaluate(t.iterable, h, V, H);

          case D:
            if (t.isMulti) {
                let e = t.parts[0];
                let s = 0;
                for (;s < t.expressions.length; ++s) {
                    e += jt(astEvaluate(t.expressions[s], h, V, H));
                    e += t.parts[s + 1];
                }
                return e;
            } else {
                return `${t.parts[0]}${astEvaluate(t.firstExpression, h, V, H)}${t.parts[1]}`;
            }

          case q:
            return astEvaluate(t.target, h, V, H);

          case I:
            {
                return t.list.map((t => astEvaluate(t, h, V, H)));
            }

          case R:
          case T:
          case P:
          default:
            return void 0;

          case _:
            return t.evaluate(h, V, H);
        }
    }
    function astAssign(e, s, i, l) {
        switch (e.$kind) {
          case n:
            {
                if (e.name === "$host") {
                    throw createMappedError(106);
                }
                const t = O(s, e.name, e.ancestor);
                return t[e.name] = l;
            }

          case b:
            {
                const t = astEvaluate(e.object, s, i, null);
                if (r(t)) {
                    if (e.name === "length" && a(t) && !isNaN(l)) {
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

          case w:
            {
                const t = astEvaluate(e.object, s, i, null);
                const n = astEvaluate(e.key, s, i, null);
                if (a(t)) {
                    if (n === "length" && !isNaN(l)) {
                        t.splice(l);
                        return l;
                    }
                    if (h(n)) {
                        t.splice(n, 1, l);
                        return l;
                    }
                }
                return t[n] = l;
            }

          case B:
            astAssign(e.value, s, i, l);
            return astAssign(e.target, s, i, l);

          case A:
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

          case E:
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
                      case q:
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

          case q:
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
                    let n;
                    if (h(t)) {
                        if (!Array.isArray(l)) {
                            throw createMappedError(112);
                        }
                        n = l.slice(t);
                    } else {
                        n = Object.entries(l).reduce(((e, [s, i]) => {
                            if (!t.includes(s)) {
                                e[s] = i;
                            }
                            return e;
                        }), {});
                    }
                    astAssign(e.target, s, i, n);
                }
                break;
            }

          case _:
            return e.assign(s, i, l);

          default:
            return void 0;
        }
    }
    function astBind(t, e, s) {
        switch (t.$kind) {
          case E:
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

          case A:
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

          case M:
            {
                astBind(t.iterable, e, s);
                break;
            }

          case _:
            {
                t.bind?.(e, s);
            }
        }
    }
    function astUnbind(t, e, s) {
        switch (t.$kind) {
          case E:
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

          case A:
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

          case M:
            {
                astUnbind(t.iterable, e, s);
                break;
            }

          case _:
            {
                t.unbind?.(e, s);
            }
        }
    }
    const getFunction = (t, e, s) => {
        const i = e == null ? null : e[s];
        if (l(i)) {
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
    const F = "at map filter includes indexOf lastIndexOf findIndex find flat flatMap join reduce reduceRight slice every some sort".split(" ");
    return {
        astEvaluate: astEvaluate,
        astAssign: astAssign,
        astBind: astBind,
        astUnbind: astUnbind
    };
})();

const {default: ue, oneTime: fe, toView: de, fromView: me, twoWay: ge} = ct;

const pe = Ft.get;

const ve = Ft.has;

const xe = Ft.define;

const {annotation: be} = c;

const we = be.keyFor;

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
        const r = s == null || typeof s === "string" ? {
            name: i
        } : s;
        const l = e.metadata[ye] ??= n();
        l[i] = BindableDefinition.create(i, r);
    }
    if (arguments.length > 1) {
        s = {};
        decorator(t, e);
        return;
    } else if (i(t)) {
        s = t;
        return decorator;
    }
    s = t === void 0 ? {} : t;
    return decorator;
}

const ye = /*@__PURE__*/ we("bindables");

const ke = Ut({
    name: ye,
    keyFrom: t => `${ye}:${t}`,
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
                t.forEach((t => i(t) ? addName(t) : addDescription(t.name, t)));
            } else if (t instanceof BindableDefinition) {
                e[t.name] = t;
            } else if (t !== void 0) {
                Xt(t).forEach((e => addDescription(e, t[e])));
            }
        }
        t.forEach(addList);
        return e;
    },
    getAll(t) {
        const e = [];
        const s = u(t);
        let i = s.length;
        let n;
        while (--i >= 0) {
            n = s[i];
            const t = pe(ye, n);
            if (t == null) continue;
            e.push(...Object.values(t));
        }
        return e;
    },
    i(t, e) {
        let s = pe(ye, e);
        if (s == null) {
            xe(s = n(), e, ye);
        }
        s[t.name] = t;
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
        const s = e.mode ?? de;
        return new BindableDefinition(e.attribute ?? f(t), e.callback ?? `${t}Changed`, i(s) ? ct[s] ?? ue : s, e.primary ?? false, e.name ?? t, e.set ?? getInterceptor(e));
    }
}

function coercer(t, e) {
    e.addInitializer((function() {
        Ce.define(this, e.name);
    }));
}

const Ce = {
    key: /*@__PURE__*/ we("coercer"),
    define(t, e) {
        xe(t[e].bind(t), t, Ce.key);
    },
    for(t) {
        return pe(Ce.key, t);
    }
};

function getInterceptor(t = {}) {
    const e = t.type ?? null;
    if (e == null) {
        return d;
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
            s = typeof t === "function" ? t.bind(e) : Ce.for(e) ?? d;
            break;
        }
    }
    return s === d ? s : createCoercer(s, t.nullable);
}

function createCoercer(t, e) {
    return function(s, i) {
        if (!i?.enableCoercion) return s;
        return (e ?? (i?.coerceNullish ?? false ? false : true)) && s == null ? s : t(s, i);
    };
}

const Be = m.createInterface;

const Se = g.singleton;

const Ae = g.aliasTo;

const Ee = g.instance;

g.callback;

g.transient;

const registerResolver = (t, e, s) => t.registerResolver(e, s);

function alias(...t) {
    return function(e, s) {
        s.addInitializer((function() {
            const e = we("aliases");
            const s = pe(e, this);
            if (s === void 0) {
                xe(t, this, e);
            } else {
                s.push(...t);
            }
        }));
    };
}

function registerAliases(t, e, s, i) {
    for (let n = 0, r = t.length; n < r; ++n) {
        g.aliasTo(s, e.keyFrom(t[n])).register(i);
    }
}

const Re = "custom-element";

const Te = "custom-attribute";

const getDefinitionFromStaticAu = (t, e, s, i = "__au_static_resource__") => {
    let n = pe(i, t);
    if (n == null) {
        if (t.$au?.type === e) {
            n = s(t.$au, t);
            xe(n, t, i);
        }
    }
    return n;
};

function bindingBehavior(t) {
    return function(e, s) {
        s.addInitializer((function() {
            De.define(t, this);
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
        let n;
        if (i(t)) {
            s = t;
            n = {
                name: s
            };
        } else {
            s = t.name;
            n = t;
        }
        return new BindingBehaviorDefinition(e, p(getBehaviorAnnotation(e, "name"), s), v(getBehaviorAnnotation(e, "aliases"), n.aliases, e.aliases), De.keyFrom(s));
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getBindingBehaviorKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : Se(s, s), Ae(s, i), ...n.map((t => Ae(s, getBindingBehaviorKeyFrom(t)))));
        }
    }
}

const Le = "binding-behavior";

const Me = /*@__PURE__*/ w(Le);

const getBehaviorAnnotation = (t, e) => pe(we(e), t);

const getBindingBehaviorKeyFrom = t => `${Me}:${t}`;

const De = /*@__PURE__*/ Ut({
    name: Me,
    keyFrom: getBindingBehaviorKeyFrom,
    isType(t) {
        return l(t) && (ve(Me, t) || t.$au?.type === Le);
    },
    define(t, e) {
        const s = BindingBehaviorDefinition.create(t, e);
        const i = s.Type;
        xe(s, i, Me, x);
        return i;
    },
    getDefinition(t) {
        const e = pe(Me, t) ?? getDefinitionFromStaticAu(t, Le, BindingBehaviorDefinition.create);
        if (e === void 0) {
            throw createMappedError(151, t);
        }
        return e;
    },
    find(t, e) {
        const s = t.find(Le, e);
        return s == null ? null : pe(Me, s) ?? getDefinitionFromStaticAu(s, Le, BindingBehaviorDefinition.create) ?? null;
    },
    get(t, e) {
        return t.get(b(getBindingBehaviorKeyFrom(e)));
    }
});

const Ie = new Map;

const createConfig = t => ({
    type: Le,
    name: t
});

class BindingModeBehavior {
    bind(t, e) {
        Ie.set(e, e.mode);
        e.mode = this.mode;
    }
    unbind(t, e) {
        e.mode = Ie.get(e);
        Ie.delete(e);
    }
}

class OneTimeBindingBehavior extends BindingModeBehavior {
    get mode() {
        return fe;
    }
}

OneTimeBindingBehavior.$au = createConfig("oneTime");

class ToViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return de;
    }
}

ToViewBindingBehavior.$au = createConfig("toView");

class FromViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return me;
    }
}

FromViewBindingBehavior.$au = createConfig("fromView");

class TwoWayBindingBehavior extends BindingModeBehavior {
    get mode() {
        return ge;
    }
}

TwoWayBindingBehavior.$au = createConfig("twoWay");

const Pe = new WeakMap;

const qe = 200;

class DebounceBindingBehavior {
    constructor() {
        this.p = y(k);
    }
    bind(t, e, s, n) {
        const r = {
            type: "debounce",
            delay: s ?? qe,
            now: this.p.performanceNow,
            queue: this.p.taskQueue,
            signals: i(n) ? [ n ] : n ?? C
        };
        const l = e.limit?.(r);
        if (l == null) ; else {
            Pe.set(e, l);
        }
    }
    unbind(t, e) {
        Pe.get(e)?.dispose();
        Pe.delete(e);
    }
}

DebounceBindingBehavior.$au = {
    type: Le,
    name: "debounce"
};

const _e = /*@__PURE__*/ Be("ISignaler", (t => t.singleton(Signaler)));

class Signaler {
    constructor() {
        this.signals = n();
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
        this.h = new Map;
        this.u = y(_e);
    }
    bind(t, e, ...s) {
        if (!("handleChange" in e)) {
            throw createMappedError(817);
        }
        if (s.length === 0) {
            throw createMappedError(818);
        }
        this.h.set(e, s);
        let i;
        for (i of s) {
            addSignalListener(this.u, i, e);
        }
    }
    unbind(t, e) {
        const s = this.h.get(e);
        this.h.delete(e);
        let i;
        for (i of s) {
            removeSignalListener(this.u, i, e);
        }
    }
}

SignalBindingBehavior.$au = {
    type: Le,
    name: "signal"
};

const Oe = new WeakMap;

const Fe = 200;

class ThrottleBindingBehavior {
    constructor() {
        ({performanceNow: this.C, taskQueue: this.B} = y(k));
    }
    bind(t, e, s, n) {
        const r = {
            type: "throttle",
            delay: s ?? Fe,
            now: this.C,
            queue: this.B,
            signals: i(n) ? [ n ] : n ?? C
        };
        const l = e.limit?.(r);
        if (l == null) ; else {
            Oe.set(e, l);
        }
    }
    unbind(t, e) {
        Oe.get(e)?.dispose();
        Oe.delete(e);
    }
}

ThrottleBindingBehavior.$au = {
    type: Le,
    name: "throttle"
};

const Ve = /*@__PURE__*/ Be("IAppTask");

class $AppTask {
    constructor(t, e, s) {
        this.c = void 0;
        this.slot = t;
        this.k = e;
        this.cb = s;
    }
    register(t) {
        return this.c = t.register(Ee(Ve, this));
    }
    run() {
        const t = this.k;
        const e = this.cb;
        return t === null ? e() : e(this.c.get(t));
    }
}

const He = Ut({
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
        if (l(s)) {
            return new $AppTask(t, e, s);
        }
        return new $AppTask(t, null, e);
    }
    return appTaskFactory;
}

const $e = k;

function watch(t, e) {
    if (t == null) {
        throw createMappedError(772);
    }
    return function decorator(s, i) {
        const n = i.kind === "class";
        if (n) {
            if (!l(e) && (e == null || !(e in s.prototype))) {
                throw createMappedError(773, `${jt(e)}@${s.name}}`);
            }
        } else if (!l(s)) {
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
            Ne.add(t, r);
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

const Ne = /*@__PURE__*/ (() => {
    const t = new WeakMap;
    return Ut({
        add(e, s) {
            let i = t.get(e);
            if (i == null) {
                t.set(e, i = []);
            }
            i.push(s);
        },
        getDefinitions(e) {
            return t.get(e) ?? C;
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
            defineAttribute(i(t) ? {
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
        return Te;
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
        let n;
        if (i(t)) {
            s = t;
            n = {
                name: s
            };
        } else {
            s = t.name;
            n = t;
        }
        const r = p(getAttributeAnnotation(e, "defaultBindingMode"), n.defaultBindingMode, e.defaultBindingMode, de);
        for (const t of Object.values(ke.from(n.bindables))) {
            ke.i(t, e);
        }
        return new CustomAttributeDefinition(e, p(getAttributeAnnotation(e, "name"), s), v(getAttributeAnnotation(e, "aliases"), n.aliases, e.aliases), getAttributeKeyFrom(s), i(r) ? ct[r] ?? ue : r, p(getAttributeAnnotation(e, "isTemplateController"), n.isTemplateController, e.isTemplateController, false), ke.from(...ke.getAll(e), getAttributeAnnotation(e, "bindables"), e.bindables, n.bindables), p(getAttributeAnnotation(e, "noMultiBindings"), n.noMultiBindings, e.noMultiBindings, false), v(Ne.getDefinitions(e), e.watches), v(getAttributeAnnotation(e, "dependencies"), n.dependencies, e.dependencies), p(getAttributeAnnotation(e, "containerStrategy"), n.containerStrategy, e.containerStrategy, "reuse"));
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getAttributeKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : Se(s, s), Ae(s, i), ...n.map((t => Ae(s, getAttributeKeyFrom(t)))));
        } else {
            if (CustomAttributeDefinition.warnDuplicate) {
                t.get(B).warn(createMappedError(154, this.name));
            }
        }
    }
    toString() {
        return `au:ca:${this.name}`;
    }
}

CustomAttributeDefinition.warnDuplicate = true;

const je = "custom-attribute";

const We = /*@__PURE__*/ w(je);

const getAttributeKeyFrom = t => `${We}:${t}`;

const getAttributeAnnotation = (t, e) => pe(we(e), t);

const isAttributeType = t => l(t) && (ve(We, t) || t.$au?.type === je);

const findAttributeControllerFor = (t, e) => getRef(t, getAttributeKeyFrom(e)) ?? void 0;

const defineAttribute = (t, e) => {
    const s = CustomAttributeDefinition.create(t, e);
    const i = s.Type;
    xe(s, i, We, x);
    return i;
};

const getAttributeDefinition = t => {
    const e = pe(We, t) ?? getDefinitionFromStaticAu(t, je, CustomAttributeDefinition.create);
    if (e === void 0) {
        throw createMappedError(759, t);
    }
    return e;
};

const findClosestControllerByName = (t, e) => {
    let s = "";
    let n = "";
    if (i(e)) {
        s = getAttributeKeyFrom(e);
        n = e;
    } else {
        const t = getAttributeDefinition(e);
        s = t.key;
        n = t.name;
    }
    let r = t;
    while (r !== null) {
        const t = getRef(r, s);
        if (t?.is(n)) {
            return t;
        }
        r = getEffectiveParentNode(r);
    }
    return null;
};

const ze = /*@__PURE__*/ Ut({
    name: We,
    keyFrom: getAttributeKeyFrom,
    isType: isAttributeType,
    for: findAttributeControllerFor,
    closest: findClosestControllerByName,
    define: defineAttribute,
    getDefinition: getAttributeDefinition,
    annotate(t, e, s) {
        xe(s, t, we(e));
    },
    getAnnotation: getAttributeAnnotation,
    find(t, e) {
        const s = t.find(je, e);
        return s === null ? null : pe(We, s) ?? getDefinitionFromStaticAu(s, je, CustomAttributeDefinition.create) ?? null;
    }
});

const Ue = /*@__PURE__*/ Be("ILifecycleHooks");

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
        while (i !== Wt) {
            for (const t of Kt(i)) {
                if (t !== "constructor" && !t.startsWith("_")) {
                    s.add(t);
                }
            }
            i = Object.getPrototypeOf(i);
        }
        return new LifecycleHooksDefinition(e, s);
    }
}

const Ge = /*@__PURE__*/ (() => {
    const t = new WeakMap;
    const e = new WeakMap;
    return Ut({
        define(t, s) {
            const i = LifecycleHooksDefinition.create(t, s);
            const n = i.Type;
            e.set(n, i);
            return {
                register(t) {
                    Se(Ue, n).register(t);
                }
            };
        },
        resolve(s) {
            let i = t.get(s);
            if (i === void 0) {
                t.set(s, i = new LifecycleHooksLookupImpl);
                const n = s.root;
                const r = n === s ? s.getAll(Ue) : s.has(Ue, false) ? n.getAll(Ue).concat(s.getAll(Ue)) : n.getAll(Ue);
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
        const s = e?.metadata ?? (t[Symbol.metadata] ??= Object.create(null));
        s[S] = Ge.define({}, t);
        return t;
    }
    return t == null ? decorator : decorator(t, e);
}

function valueConverter(t) {
    return function(e, s) {
        s.addInitializer((function() {
            Qe.define(t, this);
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
        let n;
        if (i(t)) {
            s = t;
            n = {
                name: s
            };
        } else {
            s = t.name;
            n = t;
        }
        return new ValueConverterDefinition(e, p(getConverterAnnotation(e, "name"), s), v(getConverterAnnotation(e, "aliases"), n.aliases, e.aliases), Qe.keyFrom(s));
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getValueConverterKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : Se(s, s), Ae(s, i), ...n.map((t => Ae(s, getValueConverterKeyFrom(t)))));
        }
    }
}

const Ke = "value-converter";

const Xe = /*@__PURE__*/ w(Ke);

const getConverterAnnotation = (t, e) => pe(we(e), t);

const getValueConverterKeyFrom = t => `${Xe}:${t}`;

const Qe = Ut({
    name: Xe,
    keyFrom: getValueConverterKeyFrom,
    isType(t) {
        return l(t) && (ve(Xe, t) || t.$au?.type === Ke);
    },
    define(t, e) {
        const s = ValueConverterDefinition.create(t, e);
        const i = s.Type;
        xe(s, i, Xe, x);
        return i;
    },
    getDefinition(t) {
        const e = pe(Xe, t) ?? getDefinitionFromStaticAu(t, Ke, ValueConverterDefinition.create);
        if (e === void 0) {
            throw createMappedError(152, t);
        }
        return e;
    },
    annotate(t, e, s) {
        xe(s, t, we(e));
    },
    getAnnotation: getConverterAnnotation,
    find(t, e) {
        const s = t.find(Ke, e);
        return s == null ? null : pe(Xe, s) ?? getDefinitionFromStaticAu(s, Ke, ValueConverterDefinition.create) ?? null;
    },
    get(t, e) {
        return t.get(b(getValueConverterKeyFrom(e)));
    }
});

class BindingTargetSubscriber {
    constructor(t, e) {
        this.v = void 0;
        this.b = t;
        this.A = e;
    }
    flush() {
        this.b.updateSource(this.v);
    }
    handleChange(t, e) {
        const s = this.b;
        if (t !== ae(s.ast, s.s, s, null)) {
            this.v = t;
            this.A.add(this);
        }
    }
}

const Ye = /*@__PURE__*/ (() => {
    function useScope(t) {
        this.s = t;
    }
    return t => {
        defineHiddenProp(t.prototype, "useScope", useScope);
    };
})();

const Ze = /*@__PURE__*/ (() => {
    const t = new WeakMap;
    const e = new WeakMap;
    function evaluatorGet(t) {
        return this.l.get(t);
    }
    function evaluatorGetSignaler() {
        return this.l.root.get(_e);
    }
    function evaluatorGetConverter(e) {
        let s = t.get(this);
        if (s == null) {
            t.set(this, s = new ResourceLookup);
        }
        return s[e] ??= Qe.get(this.l, e);
    }
    function evaluatorGetBehavior(t) {
        let s = e.get(this);
        if (s == null) {
            e.set(this, s = new ResourceLookup);
        }
        return s[t] ??= De.get(this.l, t);
    }
    return (t, e = true) => s => {
        const i = s.prototype;
        if (t != null) {
            Yt(i, "strict", {
                enumerable: true,
                get: function() {
                    return t;
                }
            });
        }
        Yt(i, "strictFnCall", {
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

const Je = /*@__PURE__*/ Be("IFlushQueue", (t => t.singleton(FlushQueue)));

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

const flushItem = function(t, e, s) {
    s.delete(t);
    t.flush();
};

const ts = /*@__PURE__*/ (() => {
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
            l = i?.status === se;
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
            h = i?.status === se;
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
            const r = n.length > 0 ? this.get(_e) : null;
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

const es = ((t = new WeakSet) => e => function() {
    if (!t.has(this)) {
        t.add(this);
        e.call(this);
    }
})();

const ss = {
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
        this.L = null;
        this.v = void 0;
        this.boundFn = false;
        this.l = e;
        this.ast = n;
        this.M = t;
        this.target = r;
        this.oL = s;
        this.B = i;
    }
    updateTarget(t) {
        const e = this.target;
        const s = this.targetAttribute;
        const n = this.targetProperty;
        switch (s) {
          case "class":
            e.classList.toggle(n, !!t);
            break;

          case "style":
            {
                let s = "";
                let r = jt(t);
                if (i(r) && r.includes("!important")) {
                    s = "important";
                    r = r.replace("!important", "");
                }
                e.style.setProperty(n, r, s);
                break;
            }

          default:
            {
                if (t == null) {
                    e.removeAttribute(s);
                } else {
                    e.setAttribute(s, jt(t));
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
        const e = ae(this.ast, this.s, this, (this.mode & de) > 0 ? this : null);
        this.obs.clear();
        if (e !== this.v) {
            this.v = e;
            const s = this.M.state !== mi;
            if (s) {
                t = this.L;
                this.L = this.B.queueTask((() => {
                    this.L = null;
                    this.updateTarget(e);
                }), ss);
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
        he(this.ast, t, this);
        if (this.mode & (de | fe)) {
            this.updateTarget(this.v = ae(this.ast, t, this, (this.mode & de) > 0 ? this : null));
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        ce(this.ast, this.s, this);
        this.s = void 0;
        this.v = void 0;
        this.L?.cancel();
        this.L = null;
        this.obs.clearAll();
    }
}

AttributeBinding.mix = es((() => {
    Ye(AttributeBinding);
    ts(AttributeBinding, (() => "updateTarget"));
    Q(AttributeBinding, null);
    Ze(true)(AttributeBinding);
}));

const is = {
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
        this.L = null;
        this.M = t;
        this.oL = s;
        this.B = i;
        this.I = s.getAccessor(r, l);
        const h = n.expressions;
        const c = this.partBindings = Array(h.length);
        const u = h.length;
        let f = 0;
        for (;u > f; ++f) {
            c[f] = new InterpolationPartBinding(h[f], r, l, e, s, this);
        }
    }
    P() {
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
        const r = this.I;
        const l = this.M.state !== mi && (r.type & oe) > 0;
        let a;
        if (l) {
            a = this.L;
            this.L = this.B.queueTask((() => {
                this.L = null;
                r.setValue(i, this.target, this.targetProperty);
            }), is);
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
        this.L?.cancel();
        this.L = null;
    }
    useAccessor(t) {
        this.I = t;
    }
}

class InterpolationPartBinding {
    constructor(t, e, s, i, n, r) {
        this.ast = t;
        this.target = e;
        this.targetProperty = s;
        this.owner = r;
        this.mode = de;
        this.task = null;
        this.isBound = false;
        this.v = "";
        this.boundFn = false;
        this.l = i;
        this.oL = n;
    }
    updateTarget() {
        this.owner.P();
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = ae(this.ast, this.s, this, (this.mode & de) > 0 ? this : null);
        this.obs.clear();
        if (t != this.v) {
            this.v = t;
            if (a(t)) {
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
        he(this.ast, t, this);
        this.v = ae(this.ast, this.s, this, (this.mode & de) > 0 ? this : null);
        if (a(this.v)) {
            this.observeCollection(this.v);
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        ce(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

InterpolationPartBinding.mix = es((() => {
    Ye(InterpolationPartBinding);
    ts(InterpolationPartBinding, (() => "updateTarget"));
    Q(InterpolationPartBinding, null);
    Ze(true)(InterpolationPartBinding);
}));

const ns = {
    reusable: false,
    preempt: true
};

class ContentBinding {
    constructor(t, e, s, i, n, r, l) {
        this.p = n;
        this.ast = r;
        this.target = l;
        this.isBound = false;
        this.mode = de;
        this.L = null;
        this.v = "";
        this.q = false;
        this.boundFn = false;
        this.strict = true;
        this.l = e;
        this.M = t;
        this.oL = s;
        this.B = i;
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
        e.textContent = jt(t ?? "");
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = ae(this.ast, this.s, this, (this.mode & de) > 0 ? this : null);
        this.obs.clear();
        if (t === this.v) {
            this.L?.cancel();
            this.L = null;
            return;
        }
        const e = this.M.state !== mi;
        if (e) {
            this._(t);
        } else {
            this.updateTarget(t);
        }
    }
    handleCollectionChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = this.v = ae(this.ast, this.s, this, (this.mode & de) > 0 ? this : null);
        this.obs.clear();
        if (a(t)) {
            this.observeCollection(t);
        }
        const e = this.M.state !== mi;
        if (e) {
            this._(t);
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
        he(this.ast, t, this);
        const e = this.v = ae(this.ast, this.s, this, (this.mode & de) > 0 ? this : null);
        if (a(e)) {
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
        ce(this.ast, this.s, this);
        if (this.q) {
            this.v.parentNode?.removeChild(this.v);
        }
        this.s = void 0;
        this.obs.clearAll();
        this.L?.cancel();
        this.L = null;
    }
    _(t) {
        const e = this.L;
        this.L = this.B.queueTask((() => {
            this.L = null;
            this.updateTarget(t);
        }), ns);
        e?.cancel();
    }
}

ContentBinding.mix = es((() => {
    Ye(ContentBinding);
    ts(ContentBinding, (() => "updateTarget"));
    Q(ContentBinding, null);
    Ze(void 0, false)(ContentBinding);
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
        this.O = n;
    }
    updateTarget() {
        this.target[this.targetProperty] = this.v;
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        this.v = ae(this.ast, this.s, this, this);
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
        this.target = this.O ? t.bindingContext : t.overrideContext;
        he(this.ast, t, this);
        this.v = ae(this.ast, this.s, this, this);
        this.updateTarget();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        ce(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

LetBinding.mix = es((() => {
    Ye(LetBinding);
    ts(LetBinding, (() => "updateTarget"));
    Q(LetBinding, null);
    Ze(true)(LetBinding);
}));

class PropertyBinding {
    constructor(t, e, s, i, n, r, l, a) {
        this.ast = n;
        this.target = r;
        this.targetProperty = l;
        this.mode = a;
        this.isBound = false;
        this.s = void 0;
        this.I = void 0;
        this.L = null;
        this.F = null;
        this.boundFn = false;
        this.l = e;
        this.M = t;
        this.B = i;
        this.oL = s;
    }
    updateTarget(t) {
        this.I.setValue(t, this.target, this.targetProperty);
    }
    updateSource(t) {
        le(this.ast, this.s, this, t);
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = ae(this.ast, this.s, this, (this.mode & de) > 0 ? this : null);
        this.obs.clear();
        const e = this.M.state !== mi && (this.I.type & oe) > 0;
        if (e) {
            rs = this.L;
            this.L = this.B.queueTask((() => {
                this.updateTarget(t);
                this.L = null;
            }), os);
            rs?.cancel();
            rs = null;
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
        he(this.ast, t, this);
        const e = this.oL;
        const s = this.mode;
        let i = this.I;
        if (!i) {
            if (s & me) {
                i = e.getObserver(this.target, this.targetProperty);
            } else {
                i = e.getAccessor(this.target, this.targetProperty);
            }
            this.I = i;
        }
        const n = (s & de) > 0;
        if (s & (de | fe)) {
            this.updateTarget(ae(this.ast, this.s, this, n ? this : null));
        }
        if (s & me) {
            i.subscribe(this.F ??= new BindingTargetSubscriber(this, this.l.get(Je)));
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
        ce(this.ast, this.s, this);
        this.s = void 0;
        if (this.F) {
            this.I.unsubscribe(this.F);
            this.F = null;
        }
        this.L?.cancel();
        this.L = null;
        this.obs.clearAll();
    }
    useTargetObserver(t) {
        this.I?.unsubscribe(this);
        (this.I = t).subscribe(this);
    }
    useTargetSubscriber(t) {
        if (this.F != null) {
            throw createMappedError(9995);
        }
        this.F = t;
    }
}

PropertyBinding.mix = es((() => {
    Ye(PropertyBinding);
    ts(PropertyBinding, (t => t.mode & me ? "updateSource" : "updateTarget"));
    Q(PropertyBinding, null);
    Ze(true, false)(PropertyBinding);
}));

let rs = null;

const os = {
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
        he(this.ast, t, this);
        le(this.ast, this.s, this, this.target);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        if (ae(this.ast, this.s, this, null) === this.target) {
            le(this.ast, this.s, this, null);
        }
        ce(this.ast, this.s, this);
        this.s = void 0;
    }
}

RefBinding.mix = es((() => {
    Ze(false)(RefBinding);
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
        this.V = null;
        this.l = t;
        this.H = n;
        this.V = r;
    }
    callSource(t) {
        const e = this.s.overrideContext;
        e.$event = t;
        let s = ae(this.ast, this.s, this, null);
        delete e.$event;
        if (l(s)) {
            s = s(t);
        }
        if (s !== true && this.H.prevent) {
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
        if (this.V?.(t) !== false) {
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
        he(this.ast, t, this);
        this.target.addEventListener(this.targetEvent, this, this.H);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        ce(this.ast, this.s, this);
        this.s = void 0;
        this.target.removeEventListener(this.targetEvent, this, this.H);
    }
}

ListenerBinding.mix = es((function() {
    Ye(ListenerBinding);
    ts(ListenerBinding, (() => "callSource"));
    Ze(true, true)(ListenerBinding);
}));

const ls = /*@__PURE__*/ Be("IEventModifier");

const as = /*@__PURE__*/ Be("IKeyMapping", (t => t.instance({
    meta: Ut([ "ctrl", "alt", "shift", "meta" ]),
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
        this.$ = y(as);
        this.N = [ "left", "middle", "right" ];
    }
    static register(t) {
        t.register(Se(ls, ModifiedMouseEventHandler));
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
        this.$ = y(as);
        this.type = [ "keydown", "keyup" ];
    }
    static register(t) {
        t.register(Se(ls, ModifiedKeyboardEventHandler));
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

class ModifiedEventHandler {
    constructor() {
        this.type = [ "$ALL" ];
    }
    static register(t) {
        t.register(Se(ls, ModifiedEventHandler));
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
            }
            if (s) t.preventDefault();
            if (i) t.stopPropagation();
            return true;
        };
    }
}

const hs = /*@__PURE__*/ Be("IEventModifierHandler", (t => t.instance({
    getHandler: () => null
})));

class EventModifier {
    constructor() {
        this.j = y(A(ls)).reduce(((t, e) => {
            const s = a(e.type) ? e.type : [ e.type ];
            s.forEach((s => t[s] = e));
            return t;
        }), {});
    }
    static register(t) {
        t.register(Se(hs, EventModifier));
    }
    getHandler(t, e) {
        return i(e) ? (this.j[t] ?? this.j.$ALL)?.getHandler(e) ?? null : null;
    }
}

const cs = {
    register(t) {
        t.register(EventModifier, ModifiedMouseEventHandler, ModifiedKeyboardEventHandler, ModifiedEventHandler);
    }
};

const us = /*@__PURE__*/ Be("IViewFactory");

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
            } else if (i(t)) {
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

const fs = /*@__PURE__*/ (() => {
    const createComment = (t, e) => t.document.createComment(e);
    return t => {
        const e = createComment(t, "au-end");
        e.$start = createComment(t, "au-start");
        return e;
    };
})();

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

const ds = "default";

const ms = "au-slot";

const gs = /*@__PURE__*/ Be("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

const ps = /*@__PURE__*/ Be("IAuSlotWatcher");

class AuSlotWatcherBinding {
    constructor(t, e, s, i) {
        this.G = new Set;
        this.K = C;
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
        const n = this.X;
        let r;
        let l;
        for (r of this.G) {
            for (l of r === t ? e : r.nodes) {
                if (n === "$all" || isElement(l) && (n === "*" || l.matches(n))) {
                    i[i.length] = l;
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
        Ee(Ue, this).register(t);
    }
    hydrating(t, e) {
        const s = this.Y;
        const i = new AuSlotWatcherBinding(t, s.callback ?? `${jt(s.name)}Changed`, s.slotName ?? "default", s.query ?? "*");
        Yt(t, s.name, {
            enumerable: true,
            configurable: true,
            get: Gt((() => i.getValue()), {
                getObserver: () => i
            }),
            set: () => {}
        });
        Ee(ps, i).register(e.container);
        e.addBinding(i);
    }
}

function slotted(t, e) {
    if (!vs) {
        vs = true;
        Y(AuSlotWatcherBinding, null);
        lifecycleHooks()(SlottedLifecycleHooks, null);
    }
    const s = we("dependencies");
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

let vs = false;

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
            const f = n.compileSpread(i.controller.definition, i.instruction?.captures ?? C, i.controller.container, e, s);
            let d;
            for (d of f) {
                switch (d.type) {
                  case ut.spreadTransferedBinding:
                    renderSpreadInstruction(t + 1);
                    break;

                  case ut.spreadElementProp:
                    c[d.instruction.type].render(u, findElementControllerFor(e), d.instruction, r, l, a);
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
        if (t.vmKind !== ui) {
            throw createMappedError(9998);
        }
        this.$controller.addChild(t);
    }
}

class SpreadValueBinding {
    constructor(t, e, s, i, n, r, l) {
        this.target = e;
        this.targetKeys = s;
        this.ast = i;
        this.isBound = false;
        this.s = void 0;
        this.boundFn = false;
        this.tt = {};
        this.et = new WeakMap;
        this.M = t;
        this.oL = n;
        this.l = r;
        this.B = l;
    }
    updateTarget() {
        this.obs.version++;
        const t = ae(this.ast, this.s, this, this);
        this.obs.clear();
        this.st(t, true);
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.updateTarget();
    }
    handleCollectionChange() {
        if (!this.isBound) {
            return;
        }
        this.updateTarget();
    }
    bind(t) {
        if (this.isBound) {
            if (t === this.s) {
                return;
            }
            this.unbind();
        }
        this.isBound = true;
        this.s = t;
        he(this.ast, t, this);
        const e = ae(this.ast, t, this, this);
        this.st(e, false);
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        ce(this.ast, this.s, this);
        this.s = void 0;
        let t;
        for (t in this.tt) {
            this.tt[t].unbind();
        }
    }
    st(t, s) {
        let i;
        if (!r(t)) {
            for (i in this.tt) {
                this.tt[i]?.unbind();
            }
            return;
        }
        let n;
        let l = this.et.get(t);
        if (l == null) {
            this.et.set(t, l = Scope.fromParent(this.s, t));
        }
        for (i of this.targetKeys) {
            n = this.tt[i];
            if (i in t) {
                if (n == null) {
                    n = this.tt[i] = new PropertyBinding(this.M, this.l, this.oL, this.B, SpreadValueBinding.it[i] ??= new e(i, 0), this.target, i, ct.toView);
                }
                n.bind(l);
            } else if (s) {
                n?.unbind();
            }
        }
    }
}

SpreadValueBinding.mix = es((() => {
    Ye(SpreadValueBinding);
    ts(SpreadValueBinding, (() => "updateTarget"));
    Q(SpreadValueBinding, null);
    Ze(true, false)(SpreadValueBinding);
}));

SpreadValueBinding.it = {};

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
                addListener(this.nt, e, this);
            }
            this.rt = true;
            this.ot?.();
        }
    }));
    defineHiddenProp(s, "unsubscribe", (function(t) {
        if (this.subs.remove(t) && this.subs.count === 0) {
            for (e of this.cf.events) {
                removeListener(this.nt, e, this);
            }
            this.rt = false;
            this.lt?.();
        }
    }));
    defineHiddenProp(s, "useConfig", (function(t) {
        this.cf = t;
        if (this.rt) {
            for (e of this.cf.events) {
                removeListener(this.nt, e, this);
            }
            for (e of this.cf.events) {
                addListener(this.nt, e, this);
            }
        }
    }));
};

const mixinNoopSubscribable = t => {
    defineHiddenProp(t.prototype, "subscribe", d);
    defineHiddenProp(t.prototype, "unsubscribe", d);
};

class ClassAttributeAccessor {
    get doNotCache() {
        return true;
    }
    constructor(t, e = {}) {
        this.obj = t;
        this.mapping = e;
        this.type = re | oe;
        this.v = "";
        this.ht = {};
        this.ct = 0;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (t !== this.v) {
            this.v = t;
            this.ut();
        }
    }
    ut() {
        const t = this.ht;
        const e = ++this.ct;
        const s = this.obj.classList;
        const i = getClassesToAdd(this.v);
        const n = i.length;
        let r = 0;
        let l;
        if (n > 0) {
            for (;r < n; r++) {
                l = i[r];
                l = this.mapping[l] || l;
                if (l.length === 0) {
                    continue;
                }
                t[l] = this.ct;
                s.add(l);
            }
        }
        if (e === 1) {
            return;
        }
        for (l in t) {
            l = this.mapping[l] || l;
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
    if (i(t)) {
        return splitClassString(t);
    }
    if (typeof t !== "object") {
        return C;
    }
    if (a(t)) {
        const e = t.length;
        if (e > 0) {
            const s = [];
            let i = 0;
            for (;e > i; ++i) {
                s.push(...getClassesToAdd(t[i]));
            }
            return s;
        } else {
            return C;
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
        return C;
    }
    return e;
}

const fromHydrationContext = t => ({
    $isResolver: true,
    resolve(e, s) {
        return s.get(ki).controller.container.get(E(t));
    }
});

const xs = /*@__PURE__*/ Be("IRenderer");

function renderer(t, e) {
    const s = e?.metadata ?? (t[Symbol.metadata] ??= Object.create(null));
    s[S] = {
        register(e) {
            Se(xs, t).register(e);
        }
    };
    return t;
}

function ensureExpression(t, e, s) {
    if (i(e)) {
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

const bs = /*@__PURE__*/ renderer(class SetPropertyRenderer {
    constructor() {
        this.target = ut.setProperty;
    }
    render(t, e, s) {
        const i = getTarget(e);
        if (i.$observers?.[s.to] !== void 0) {
            i.$observers[s.to].setValue(s.value);
        } else {
            i[s.to] = s.value;
        }
    }
}, null);

const ws = /*@__PURE__*/ renderer(class CustomElementRenderer {
    constructor() {
        this.r = y(zs);
        this.target = ut.hydrateElement;
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
            l = Hi.find(f, c);
            if (l == null) {
                throw createMappedError(752, s, t);
            }
            break;

          default:
            l = c;
        }
        const d = s.containerless || l.containerless;
        const m = d ? convertToRenderLocation(e) : null;
        const g = createElementContainer(i, t, e, s, m, u == null ? void 0 : new AuSlotsInfo(Xt(u)));
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
}, null);

const ys = /*@__PURE__*/ renderer(class CustomAttributeRenderer {
    constructor() {
        this.r = y(zs);
        this.target = ut.hydrateAttribute;
    }
    render(t, e, s, i, n, r) {
        let l = t.container;
        let a;
        switch (typeof s.res) {
          case "string":
            a = ze.find(l, s.res);
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
}, null);

const ks = /*@__PURE__*/ renderer(class TemplateControllerRenderer {
    constructor() {
        this.r = y(zs);
        this.target = ut.hydrateTemplateController;
    }
    render(t, e, s, i, n, r) {
        let l = t.container;
        let a;
        switch (typeof s.res) {
          case "string":
            a = ze.find(l, s.res);
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
}, null);

const Cs = /*@__PURE__*/ renderer(class LetElementRenderer {
    constructor() {
        this.target = ut.hydrateLetElement;
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
            f = ensureExpression(n, u.from, ee);
            t.addBinding(new LetBinding(h, r, f, u.to, a));
            ++d;
        }
    }
}, null);

const Bs = /*@__PURE__*/ renderer(class RefBindingRenderer {
    constructor() {
        this.target = ut.refBinding;
    }
    render(t, e, s, i, n) {
        t.addBinding(new RefBinding(t.container, ensureExpression(n, s.from, ee), getRefTarget(e, s.to)));
    }
}, null);

const Ss = /*@__PURE__*/ renderer(class InterpolationBindingRenderer {
    constructor() {
        this.target = ut.interpolation;
        InterpolationPartBinding.mix();
    }
    render(t, e, s, i, n, r) {
        const l = t.container;
        const a = new InterpolationBinding(t, l, r, i.domQueue, ensureExpression(n, s.from, Zt), getTarget(e), s.to, de);
        if (s.to === "class" && a.target.nodeType > 0) {
            const t = l.get(fromHydrationContext(Ti));
            a.useAccessor(new ClassAttributeAccessor(a.target, t));
        }
        t.addBinding(a);
    }
}, null);

const As = /*@__PURE__*/ renderer(class PropertyBindingRenderer {
    constructor() {
        this.target = ut.propertyBinding;
        PropertyBinding.mix();
    }
    render(t, e, s, i, n, r) {
        const l = t.container;
        const a = new PropertyBinding(t, l, r, i.domQueue, ensureExpression(n, s.from, ee), getTarget(e), s.to, s.mode);
        if (s.to === "class" && a.target.nodeType > 0) {
            const t = l.get(fromHydrationContext(Ti));
            a.useTargetObserver(new ClassAttributeAccessor(a.target, t));
        }
        t.addBinding(a);
    }
}, null);

const Es = /*@__PURE__*/ renderer(class IteratorBindingRenderer {
    constructor() {
        this.target = ut.iteratorBinding;
        PropertyBinding.mix();
    }
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domQueue, ensureExpression(n, s.forOf, Jt), getTarget(e), s.to, de));
    }
}, null);

const Rs = /*@__PURE__*/ renderer(class TextBindingRenderer {
    constructor() {
        this.target = ut.textBinding;
        ContentBinding.mix();
    }
    render(t, e, s, i, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, i.domQueue, i, ensureExpression(n, s.from, ee), e));
    }
}, null);

const Ts = Be("IListenerBindingOptions", (t => t.instance({
    prevent: false
})));

const Ls = /*@__PURE__*/ renderer(class ListenerBindingRenderer {
    constructor() {
        this.target = ut.listenerBinding;
        this.ft = y(hs);
        this.dt = y(Ts);
        ListenerBinding.mix();
    }
    render(t, e, s, i, n) {
        t.addBinding(new ListenerBinding(t.container, ensureExpression(n, s.from, te), e, s.to, new ListenerBindingOptions(this.dt.prevent, s.capture), this.ft.getHandler(s.to, s.modifier)));
    }
}, null);

const Ms = /*@__PURE__*/ renderer(class SetAttributeRenderer {
    constructor() {
        this.target = ut.setAttribute;
    }
    render(t, e, s) {
        e.setAttribute(s.to, s.value);
    }
}, null);

const Ds = /*@__PURE__*/ renderer(class SetClassAttributeRenderer {
    constructor() {
        this.target = ut.setClassAttribute;
    }
    render(t, e, s) {
        addClasses(e.classList, s.value);
    }
}, null);

const Is = /*@__PURE__*/ renderer(class SetStyleAttributeRenderer {
    constructor() {
        this.target = ut.setStyleAttribute;
    }
    render(t, e, s) {
        e.style.cssText += s.value;
    }
}, null);

const Ps = /*@__PURE__*/ renderer(class StylePropertyBindingRenderer {
    constructor() {
        this.target = ut.stylePropertyBinding;
        PropertyBinding.mix();
    }
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domQueue, ensureExpression(n, s.from, ee), e.style, s.to, de));
    }
}, null);

const qs = /*@__PURE__*/ renderer(class AttributeBindingRenderer {
    constructor() {
        this.target = ut.attributeBinding;
        AttributeBinding.mix();
    }
    render(t, e, s, i, n, r) {
        const l = t.container;
        const a = l.has(Ti, false) ? l.get(Ti) : null;
        t.addBinding(new AttributeBinding(t, l, r, i.domQueue, ensureExpression(n, s.from, ee), e, s.attr, a == null ? s.to : s.to.split(/\s/g).map((t => a[t] ?? t)).join(" "), de));
    }
}, null);

const _s = /*@__PURE__*/ renderer(class SpreadRenderer {
    constructor() {
        this.gt = y(ft);
        this.r = y(zs);
        this.target = ut.spreadTransferedBinding;
    }
    render(t, e, s, i, n, r) {
        SpreadBinding.create(t.container.get(ki), e, void 0, this.r, this.gt, i, n, r).forEach((e => t.addBinding(e)));
    }
}, null);

const Os = /*@__PURE__*/ renderer(class SpreadValueRenderer {
    constructor() {
        this.target = ut.spreadValueBinding;
        SpreadValueBinding.mix();
    }
    render(t, e, s, i, n, r) {
        const l = s.target;
        if (l === "$bindables") {
            t.addBinding(new SpreadValueBinding(t, e.viewModel, Xt(e.definition.bindables), n.parse(s.from, ee), r, t.container, i.domQueue));
        } else {
            throw createMappedError(820, l);
        }
    }
}, null);

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

const Fs = "IController";

const Vs = "IInstruction";

const Hs = "IRenderLocation";

const $s = "ISlotsInfo";

function createElementContainer(t, e, s, i, n, r) {
    const l = e.container.createChild();
    registerHostNode(l, s, t);
    registerResolver(l, yi, new R(Fs, e));
    registerResolver(l, dt, new R(Vs, i));
    registerResolver(l, Ri, n == null ? Ns : new RenderLocationProvider(n));
    registerResolver(l, us, js);
    registerResolver(l, gs, r == null ? Ws : new R($s, r));
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
        if (!i(t.name) || t.name.length === 0) {
            throw createMappedError(756);
        }
        return t;
    }
}

function invokeAttribute(t, e, s, i, n, r, l, a) {
    const h = s instanceof Controller ? s : s.$controller;
    const c = h.container.createChild();
    registerHostNode(c, i, t);
    registerResolver(c, yi, new R(Fs, h));
    registerResolver(c, dt, new R(Vs, n));
    registerResolver(c, Ri, l == null ? Ns : new R(Hs, l));
    registerResolver(c, us, r == null ? js : new ViewFactoryProvider(r));
    registerResolver(c, gs, a == null ? Ws : new R($s, a));
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

const Ns = new RenderLocationProvider(null);

const js = new ViewFactoryProvider(null);

const Ws = new R($s, new AuSlotsInfo(C));

const zs = /*@__PURE__*/ Be("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.vt ??= this.xt.getAll(xs, false).reduce(((t, e) => {
            t[e.target] ??= e;
            return t;
        }), n());
    }
    constructor() {
        this.bt = new WeakMap;
        this.wt = new WeakMap;
        const t = this.xt = y(T).root;
        const e = this.p = t.get($e);
        this.ep = t.get(s);
        this.oL = t.get(Z);
        this.yt = e.document.createElement("au-m");
        this.kt = new FragmentNodeSequence(e, e.document.createDocumentFragment());
    }
    compile(t, e) {
        const s = e.get(ft);
        const i = this.bt;
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
            return new FragmentNodeSequence(this.p, this.Ct(t.template));
        }
        let e;
        let s = false;
        const n = this.wt;
        const r = this.p;
        const l = r.document;
        if (n.has(t)) {
            e = n.get(t);
        } else {
            const a = t.template;
            let h;
            if (a == null) {
                e = null;
            } else if (a instanceof r.Node) {
                if (a.nodeName === "TEMPLATE") {
                    e = a.content;
                    s = true;
                } else {
                    (e = l.createDocumentFragment()).appendChild(a.cloneNode(true));
                }
            } else {
                h = l.createElement("template");
                if (i(a)) {
                    h.innerHTML = a;
                }
                e = h.content;
                s = true;
            }
            this.Ct(e);
            n.set(t, e);
        }
        return e == null ? this.kt : new FragmentNodeSequence(this.p, s ? l.importNode(e, true) : l.adoptNode(e.cloneNode(true)));
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
    Ct(t) {
        if (t == null) {
            return null;
        }
        const e = this.p.document.createTreeWalker(t, 128);
        let s;
        while ((s = e.nextNode()) != null) {
            if (s.nodeValue === "au*") {
                s.parentNode.replaceChild(e.currentNode = this.yt.cloneNode(), s);
            }
        }
        return t;
    }
}

function cssModules(...t) {
    return new CSSModulesProcessorRegistry(t);
}

class CSSModulesProcessorRegistry {
    constructor(t) {
        this.modules = t;
    }
    register(t) {
        let e = t.get(E(Ti));
        if (e == null) {
            t.register(Ee(Ti, e = n()));
        }
        {
            Gt(e, ...this.modules);
        }
        class CompilingHook {
            compiling(t) {
                const s = t.tagName === "TEMPLATE";
                const i = s ? t.content : t;
                const n = [ t, ...L(i.querySelectorAll("[class]")) ];
                for (const t of n) {
                    const s = t.getAttributeNode("class");
                    if (s == null) {
                        continue;
                    }
                    const i = s.value.split(/\s+/g).map((t => e[t] || t)).join(" ");
                    s.value = i;
                }
            }
        }
        t.register(mt.define(CompilingHook));
    }
}

function shadowCSS(...t) {
    return new ShadowDOMRegistry(t);
}

const Us = /*@__PURE__*/ Be("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
    if (AdoptedStyleSheetsStyles.supported(t.get($e))) {
        return t.get(AdoptedStyleSheetsStylesFactory);
    }
    return t.get(StyleElementStylesFactory);
}))));

class ShadowDOMRegistry {
    constructor(t) {
        this.css = t;
    }
    register(t) {
        const e = t.get(Ks);
        const s = t.get(Us);
        t.register(Ee(Gs, s.createStyles(this.css, e)));
    }
}

class AdoptedStyleSheetsStylesFactory {
    constructor() {
        this.p = y($e);
        this.cache = new Map;
    }
    createStyles(t, e) {
        return new AdoptedStyleSheetsStyles(this.p, t, this.cache, e);
    }
}

class StyleElementStylesFactory {
    constructor() {
        this.p = y($e);
    }
    createStyles(t, e) {
        return new StyleElementStyles(this.p, t, e);
    }
}

const Gs = /*@__PURE__*/ Be("IShadowDOMStyles");

const Ks = /*@__PURE__*/ Be("IShadowDOMGlobalStyles", (t => t.instance({
    applyTo: d
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

const Xs = {
    shadowDOM(t) {
        return He.creating(T, (e => {
            if (t.sharedStyles != null) {
                const s = e.get(Us);
                e.register(Ee(Ks, s.createStyles(t.sharedStyles, null)));
            }
        }));
    }
};

const {enter: Qs, exit: Ys} = J;

const {wrap: Zs, unwrap: Js} = tt;

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
        if (!M(s, e)) {
            this.cb.call(t, s, e, t);
        }
    }
    compute() {
        this.running = true;
        this.obs.version++;
        try {
            Qs(this);
            return this.v = Js(this.$get.call(void 0, this.useProxy ? Zs(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            Ys(this);
        }
    }
}

(() => {
    Q(ComputedWatcher, null);
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
        this.Bt = i;
        this.cb = n;
    }
    handleChange(t) {
        const e = this.Bt;
        const s = this.obj;
        const i = this.v;
        const n = e.$kind === "AccessScope" && this.obs.count === 1;
        if (!n) {
            this.obs.version++;
            t = ae(e, this.scope, this, this);
            this.obs.clear();
        }
        if (!M(t, i)) {
            this.v = t;
            this.cb.call(s, t, i, s);
        }
    }
    bind() {
        if (this.isBound) {
            return;
        }
        this.obs.version++;
        this.v = ae(this.Bt, this.scope, this, this);
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
    Q(ExpressionWatcher, null);
    Ze(true)(ExpressionWatcher);
})();

class Controller {
    get lifecycleHooks() {
        return this.St;
    }
    get isActive() {
        return (this.state & (mi | gi)) > 0 && (this.state & pi) === 0;
    }
    get name() {
        if (this.parent === null) {
            switch (this.vmKind) {
              case ui:
                return `[${this.definition.name}]`;

              case ci:
                return this.definition.name;

              case fi:
                return this.viewFactory.name;
            }
        }
        switch (this.vmKind) {
          case ui:
            return `${this.parent.name}>[${this.definition.name}]`;

          case ci:
            return `${this.parent.name}>${this.definition.name}`;

          case fi:
            return this.viewFactory.name === this.parent.definition?.name ? `${this.parent.name}[view]` : `${this.parent.name}[view:${this.viewFactory.name}]`;
        }
    }
    get viewModel() {
        return this.At;
    }
    set viewModel(t) {
        this.At = t;
        this.Et = t == null || this.vmKind === fi ? HooksDefinition.none : new HooksDefinition(t);
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
        this.Rt = false;
        this.hostController = null;
        this.mountTarget = ei;
        this.shadowRoot = null;
        this.nodes = null;
        this.location = null;
        this.St = null;
        this.state = di;
        this.Tt = false;
        this.$initiator = null;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this.Lt = 0;
        this.Mt = 0;
        this.Dt = 0;
        this.At = n;
        this.Et = e === fi ? HooksDefinition.none : new HooksDefinition(n);
        this.location = l;
        this.r = t.root.get(zs);
        this.coercion = e === fi ? void 0 : t.get(li);
    }
    static getCached(t) {
        return ti.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (e === void 0) {
            throw createMappedError(500, t);
        }
        return e;
    }
    static $el(t, e, s, i, n = void 0, r = null) {
        if (ti.has(e)) {
            return ti.get(e);
        }
        {
            n = n ?? getElementDefinition(e.constructor);
        }
        registerResolver(t, n.Type, new R(n.key, e, n.Type));
        const l = new Controller(t, ci, n, null, e, s, r);
        const a = t.get(I(ki));
        if (n.dependencies.length > 0) {
            t.register(...n.dependencies);
        }
        registerResolver(t, ki, new R("IHydrationContext", new HydrationContext(l, i, a)));
        ti.set(e, l);
        if (i == null || i.hydrate !== false) {
            l.hE(i, a);
        }
        return l;
    }
    static $attr(t, e, s, i) {
        if (ti.has(e)) {
            return ti.get(e);
        }
        i = i ?? getAttributeDefinition(e.constructor);
        registerResolver(t, i.Type, new R(i.key, e, i.Type));
        const n = new Controller(t, ui, i, null, e, s, null);
        if (i.dependencies.length > 0) {
            t.register(...i.dependencies);
        }
        ti.set(e, n);
        n.It();
        return n;
    }
    static $view(t, e = void 0) {
        const s = new Controller(t.container, fi, null, t, null, null, null);
        s.parent = e ?? null;
        s.Pt();
        return s;
    }
    hE(t, e) {
        const s = this.container;
        const i = this.At;
        const n = this.definition;
        this.scope = Scope.create(i, null, true);
        if (n.watches.length > 0) {
            createWatchers(this, s, n, i);
        }
        createObservers(this, n, i);
        this.St = Ge.resolve(s);
        s.register(n.Type);
        if (n.injectable !== null) {
            registerResolver(s, n.injectable, new R("definition.injectable", i));
        }
        if (t == null || t.hydrate !== false) {
            this.hS();
            this.hC();
        }
    }
    hS() {
        if (this.St.hydrating != null) {
            this.St.hydrating.forEach(callHydratingHook, this);
        }
        if (this.Et.qt) {
            this.At.hydrating(this);
        }
        const t = this.definition;
        const e = this._t = this.r.compile(t, this.container);
        const s = e.shadowOptions;
        const i = e.hasSlots;
        const n = e.containerless;
        let r = this.host;
        let l = this.location;
        if ((this.hostController = findElementControllerFor(r, oi)) !== null) {
            r = this.host = this.container.root.get($e).document.createElement(t.name);
            if (n && l == null) {
                l = this.location = convertToRenderLocation(r);
            }
        }
        setRef(r, Oi, this);
        setRef(r, t.key, this);
        if (s !== null || i) {
            if (l != null) {
                throw createMappedError(501);
            }
            setRef(this.shadowRoot = r.attachShadow(s ?? hi), Oi, this);
            setRef(this.shadowRoot, t.key, this);
            this.mountTarget = ii;
        } else if (l != null) {
            setRef(l, Oi, this);
            setRef(l, t.key, this);
            this.mountTarget = ni;
        } else {
            this.mountTarget = si;
        }
        this.At.$controller = this;
        this.nodes = this.r.createNodes(e);
        if (this.St.hydrated !== void 0) {
            this.St.hydrated.forEach(callHydratedHook, this);
        }
        if (this.Et.Ot) {
            this.At.hydrated(this);
        }
    }
    hC() {
        this.r.render(this, this.nodes.findTargets(), this._t, this.host);
        if (this.St.created !== void 0) {
            this.St.created.forEach(callCreatedHook, this);
        }
        if (this.Et.Ft) {
            this.At.created(this);
        }
    }
    It() {
        const t = this.definition;
        const e = this.At;
        if (t.watches.length > 0) {
            createWatchers(this, this.container, t, e);
        }
        createObservers(this, t, e);
        e.$controller = this;
        this.St = Ge.resolve(this.container);
        if (this.St.created !== void 0) {
            this.St.created.forEach(callCreatedHook, this);
        }
        if (this.Et.Ft) {
            this.At.created(this);
        }
    }
    Pt() {
        this._t = this.r.compile(this.viewFactory.def, this.container);
        this.r.render(this, (this.nodes = this.r.createNodes(this._t)).findTargets(), this._t, void 0);
    }
    activate(t, e, s) {
        switch (this.state) {
          case di:
          case vi:
            if (!(e === null || e.isActive)) {
                return;
            }
            this.state = mi;
            break;

          case gi:
            return;

          case bi:
            throw createMappedError(502, this.name);

          default:
            throw createMappedError(503, this.name, stringifyState(this.state));
        }
        this.parent = e;
        switch (this.vmKind) {
          case ci:
            this.scope.parent = s ?? null;
            break;

          case ui:
            this.scope = s ?? null;
            break;

          case fi:
            if (s === void 0 || s === null) {
                throw createMappedError(504, this.name);
            }
            if (!this.hasLockedScope) {
                this.scope = s;
            }
            break;
        }
        this.$initiator = t;
        this.Vt();
        let i = void 0;
        if (this.vmKind !== fi && this.St.binding != null) {
            i = P(...this.St.binding.map(callBindingHook, this));
        }
        if (this.Et.Ht) {
            i = P(i, this.At.binding(this.$initiator, this.parent));
        }
        if (q(i)) {
            this.$t();
            i.then((() => {
                this.Rt = true;
                if (this.state !== mi) {
                    this.Nt();
                } else {
                    this.bind();
                }
            })).catch((t => {
                this.jt(t);
            }));
            return this.$promise;
        }
        this.Rt = true;
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
        if (this.vmKind !== fi && this.St.bound != null) {
            s = P(...this.St.bound.map(callBoundHook, this));
        }
        if (this.Et.Wt) {
            s = P(s, this.At.bound(this.$initiator, this.parent));
        }
        if (q(s)) {
            this.$t();
            s.then((() => {
                this.isBound = true;
                if (this.state !== mi) {
                    this.Nt();
                } else {
                    this.zt();
                }
            })).catch((t => {
                this.jt(t);
            }));
            return;
        }
        this.isBound = true;
        this.zt();
    }
    Ut(...t) {
        switch (this.mountTarget) {
          case si:
            this.host.append(...t);
            break;

          case ii:
            this.shadowRoot.append(...t);
            break;

          case ni:
            {
                let e = 0;
                for (;e < t.length; ++e) {
                    this.location.parentNode.insertBefore(t[e], this.location);
                }
                break;
            }
        }
    }
    zt() {
        if (this.hostController !== null) {
            switch (this.mountTarget) {
              case si:
              case ii:
                this.hostController.Ut(this.host);
                break;

              case ni:
                this.hostController.Ut(this.location.$start, this.location);
                break;
            }
        }
        switch (this.mountTarget) {
          case si:
            this.nodes.appendTo(this.host, this.definition != null && this.definition.enhance);
            break;

          case ii:
            {
                const t = this.container;
                const e = t.has(Gs, false) ? t.get(Gs) : t.get(Ks);
                e.applyTo(this.shadowRoot);
                this.nodes.appendTo(this.shadowRoot);
                break;
            }

          case ni:
            this.nodes.insertBefore(this.location);
            break;
        }
        let t = 0;
        let e = void 0;
        if (this.vmKind !== fi && this.St.attaching != null) {
            e = P(...this.St.attaching.map(callAttachingHook, this));
        }
        if (this.Et.Gt) {
            e = P(e, this.At.attaching(this.$initiator, this.parent));
        }
        if (q(e)) {
            this.$t();
            this.Vt();
            e.then((() => {
                this.Nt();
            })).catch((t => {
                this.jt(t);
            }));
        }
        if (this.children !== null) {
            for (;t < this.children.length; ++t) {
                void this.children[t].activate(this.$initiator, this, this.scope);
            }
        }
        this.Nt();
    }
    deactivate(t, e) {
        let s = void 0;
        switch (this.state & ~xi) {
          case gi:
            this.state = pi;
            break;

          case mi:
            this.state = pi;
            s = this.$promise?.catch(d);
            break;

          case di:
          case vi:
          case bi:
          case vi | bi:
            return;

          default:
            throw createMappedError(505, this.name, this.state);
        }
        this.$initiator = t;
        if (t === this) {
            this.Kt();
        }
        let i = 0;
        let n;
        if (this.children !== null) {
            for (i = 0; i < this.children.length; ++i) {
                void this.children[i].deactivate(t, this);
            }
        }
        return _(s, (() => {
            if (this.isBound) {
                if (this.vmKind !== fi && this.St.detaching != null) {
                    n = P(...this.St.detaching.map(callDetachingHook, this));
                }
                if (this.Et.Xt) {
                    n = P(n, this.At.detaching(this.$initiator, this.parent));
                }
            }
            if (q(n)) {
                this.$t();
                t.Kt();
                n.then((() => {
                    t.Qt();
                })).catch((e => {
                    t.jt(e);
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
          case ci:
          case fi:
            this.nodes.remove();
            this.nodes.unlink();
        }
        if (this.hostController !== null) {
            switch (this.mountTarget) {
              case si:
              case ii:
                this.host.remove();
                break;

              case ni:
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
          case ui:
            this.scope = null;
            break;

          case fi:
            if (!this.hasLockedScope) {
                this.scope = null;
            }
            if ((this.state & xi) === xi && !this.viewFactory.tryReturnToCache(this) && this.$initiator === this) {
                this.dispose();
            }
            break;

          case ci:
            this.scope.parent = null;
            break;
        }
        this.state = vi;
        this.$initiator = null;
        this.Yt();
    }
    $t() {
        if (this.$promise === void 0) {
            this.$promise = new Promise(((t, e) => {
                this.$resolve = t;
                this.$reject = e;
            }));
            if (this.$initiator !== this) {
                this.parent.$t();
            }
        }
    }
    Yt() {
        if (this.$promise !== void 0) {
            Ci = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            Ci();
            Ci = void 0;
        }
    }
    jt(t) {
        if (this.$promise !== void 0) {
            Bi = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            Bi(t);
            Bi = void 0;
        }
        if (this.$initiator !== this) {
            this.parent.jt(t);
        }
    }
    Vt() {
        ++this.Lt;
        if (this.$initiator !== this) {
            this.parent.Vt();
        }
    }
    Nt() {
        if (this.state !== mi) {
            --this.Lt;
            this.Yt();
            if (this.$initiator !== this) {
                this.parent.Nt();
            }
            return;
        }
        if (--this.Lt === 0) {
            if (this.vmKind !== fi && this.St.attached != null) {
                Si = P(...this.St.attached.map(callAttachedHook, this));
            }
            if (this.Et.Zt) {
                Si = P(Si, this.At.attached(this.$initiator));
            }
            if (q(Si)) {
                this.$t();
                Si.then((() => {
                    this.state = gi;
                    this.Yt();
                    if (this.$initiator !== this) {
                        this.parent.Nt();
                    }
                })).catch((t => {
                    this.jt(t);
                }));
                Si = void 0;
                return;
            }
            Si = void 0;
            this.state = gi;
            this.Yt();
        }
        if (this.$initiator !== this) {
            this.parent.Nt();
        }
    }
    Kt() {
        ++this.Mt;
    }
    Qt() {
        if (--this.Mt === 0) {
            this.Jt();
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
                if (t.Rt) {
                    if (t.vmKind !== fi && t.St.unbinding != null) {
                        e = P(...t.St.unbinding.map(callUnbindingHook, t));
                    }
                    if (t.Et.te) {
                        if (t.debug) {
                            t.logger.trace("unbinding()");
                        }
                        e = P(e, t.viewModel.unbinding(t.$initiator, t.parent));
                    }
                }
                if (q(e)) {
                    this.$t();
                    this.Jt();
                    e.then((() => {
                        this.ee();
                    })).catch((t => {
                        this.jt(t);
                    }));
                }
                e = void 0;
                t = t.next;
            }
            this.ee();
        }
    }
    Jt() {
        ++this.Dt;
    }
    ee() {
        if (--this.Dt === 0) {
            let t = this.$initiator.head;
            let e = null;
            while (t !== null) {
                if (t !== this) {
                    t.Rt = false;
                    t.isBound = false;
                    t.unbind();
                }
                e = t.next;
                t.next = null;
                t = e;
            }
            this.head = this.tail = null;
            this.Rt = false;
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
          case ui:
          case ci:
            {
                return this.definition.name === t;
            }

          case fi:
            return this.viewFactory.name === t;
        }
    }
    lockScope(t) {
        this.scope = t;
        this.hasLockedScope = true;
    }
    setHost(t) {
        if (this.vmKind === ci) {
            setRef(t, Oi, this);
            setRef(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = si;
        return this;
    }
    setShadowRoot(t) {
        if (this.vmKind === ci) {
            setRef(t, Oi, this);
            setRef(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = ii;
        return this;
    }
    setLocation(t) {
        if (this.vmKind === ci) {
            setRef(t, Oi, this);
            setRef(t, this.definition.key, this);
        }
        this.location = t;
        this.mountTarget = ni;
        return this;
    }
    release() {
        this.state |= xi;
    }
    dispose() {
        if ((this.state & bi) === bi) {
            return;
        }
        this.state |= bi;
        if (this.Et.se) {
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
            ti.delete(this.At);
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
        if (this.Et.ie && this.At.accept(t) === true) {
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

const ti = new WeakMap;

const ei = 0;

const si = 1;

const ii = 2;

const ni = 3;

const ri = Ut({
    none: ei,
    host: si,
    shadowRoot: ii,
    location: ni
});

const oi = {
    optional: true
};

const li = D(et);

function createObservers(t, e, s) {
    const i = e.bindables;
    const n = Kt(i);
    const r = n.length;
    const l = t.container.get(Z);
    if (r > 0) {
        for (let e = 0; e < r; ++e) {
            const r = n[e];
            const a = i[r];
            const h = a.callback;
            const c = l.getObserver(s, r);
            if (a.set !== d) {
                if (c.useCoercer?.(a.set, t.coercion) !== true) {
                    throw createMappedError(507, r);
                }
            }
            if (s[h] != null || s.propertyChanged != null) {
                const callback = (e, i) => {
                    if (t.isBound) {
                        s[h]?.(e, i);
                        s.propertyChanged?.(r, e, i);
                    }
                };
                if (c.useCallback?.(callback) !== true) {
                    throw createMappedError(508, r);
                }
            }
        }
    }
}

const ai = new Map;

const getAccessScopeAst = t => {
    let s = ai.get(t);
    if (s == null) {
        s = new e(t, 0);
        ai.set(t, s);
    }
    return s;
};

function createWatchers(t, e, n, r) {
    const a = e.get(Z);
    const h = e.get(s);
    const c = n.watches;
    const u = t.vmKind === ci ? t.scope : Scope.create(r, null, true);
    const f = c.length;
    let d;
    let m;
    let g;
    let p = 0;
    for (;f > p; ++p) {
        ({expression: d, callback: m} = c[p]);
        m = l(m) ? m : Reflect.get(r, m);
        if (!l(m)) {
            throw createMappedError(506, m);
        }
        if (l(d)) {
            t.addBinding(new ComputedWatcher(r, a, d, m, true));
        } else {
            g = i(d) ? h.parse(d, ee) : getAccessScopeAst(d);
            t.addBinding(new ExpressionWatcher(u, e, a, g, m));
        }
    }
}

function isCustomElementController(t) {
    return t instanceof Controller && t.vmKind === ci;
}

function isCustomElementViewModel(t) {
    return Vt(t) && isElementType(t.constructor);
}

class HooksDefinition {
    constructor(t) {
        this.ne = "define" in t;
        this.qt = "hydrating" in t;
        this.Ot = "hydrated" in t;
        this.Ft = "created" in t;
        this.Ht = "binding" in t;
        this.Wt = "bound" in t;
        this.Gt = "attaching" in t;
        this.Zt = "attached" in t;
        this.Xt = "detaching" in t;
        this.te = "unbinding" in t;
        this.se = "dispose" in t;
        this.ie = "accept" in t;
    }
}

HooksDefinition.none = new HooksDefinition({});

const hi = {
    mode: "open"
};

const ci = "customElement";

const ui = "customAttribute";

const fi = "synthetic";

const di = 0;

const mi = 1;

const gi = 2;

const pi = 4;

const vi = 8;

const xi = 16;

const bi = 32;

const wi = /*@__PURE__*/ Ut({
    none: di,
    activating: mi,
    activated: gi,
    deactivating: pi,
    deactivated: vi,
    released: xi,
    disposed: bi
});

function stringifyState(t) {
    const e = [];
    if ((t & mi) === mi) {
        e.push("activating");
    }
    if ((t & gi) === gi) {
        e.push("activated");
    }
    if ((t & pi) === pi) {
        e.push("deactivating");
    }
    if ((t & vi) === vi) {
        e.push("deactivated");
    }
    if ((t & xi) === xi) {
        e.push("released");
    }
    if ((t & bi) === bi) {
        e.push("disposed");
    }
    return e.length === 0 ? "none" : e.join("|");
}

const yi = /*@__PURE__*/ Be("IController");

const ki = /*@__PURE__*/ Be("IHydrationContext");

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

let Ci;

let Bi;

let Si;

class Refs {}

function getRef(t, e) {
    return t.$au?.[e] ?? null;
}

function setRef(t, e, s) {
    (t.$au ??= new Refs)[e] = s;
}

const Ai = /*@__PURE__*/ Be("INode");

const Ei = /*@__PURE__*/ Be("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(Ni, true)) {
        return t.get(Ni).host;
    }
    return t.get($e).document;
}))));

const Ri = /*@__PURE__*/ Be("IRenderLocation");

const Ti = /*@__PURE__*/ Be("ICssClassMapping");

const Li = new WeakMap;

function getEffectiveParentNode(t) {
    if (Li.has(t)) {
        return Li.get(t);
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
        if (e.mountTarget === ri.shadowRoot) {
            return getEffectiveParentNode(e.host);
        }
    }
    return t.parentNode;
}

function setEffectiveParentNode(t, e) {
    if (t.platform !== void 0 && !(t instanceof t.platform.Node)) {
        const s = t.childNodes;
        for (let t = 0, i = s.length; t < i; ++t) {
            Li.set(s[t], e);
        }
    } else {
        Li.set(t, e);
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
        return this.re;
    }
    get lastChild() {
        return this.oe;
    }
    constructor(t, e) {
        this.platform = t;
        this.next = void 0;
        this.le = false;
        this.ae = false;
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
        this.re = e.firstChild;
        this.oe = e.lastChild;
    }
    findTargets() {
        return this.t;
    }
    insertBefore(t) {
        if (this.ae && !!this.ref) {
            this.addToLinked();
        } else {
            const e = t.parentNode;
            if (this.le) {
                let s = this.re;
                let i;
                const n = this.oe;
                while (s != null) {
                    i = s.nextSibling;
                    e.insertBefore(s, t);
                    if (s === n) {
                        break;
                    }
                    s = i;
                }
            } else {
                this.le = true;
                t.parentNode.insertBefore(this.f, t);
            }
        }
    }
    appendTo(t, e = false) {
        if (this.le) {
            let e = this.re;
            let s;
            const i = this.oe;
            while (e != null) {
                s = e.nextSibling;
                t.appendChild(e);
                if (e === i) {
                    break;
                }
                e = s;
            }
        } else {
            this.le = true;
            if (!e) {
                t.appendChild(this.f);
            }
        }
    }
    remove() {
        if (this.le) {
            this.le = false;
            const t = this.f;
            const e = this.oe;
            let s;
            let i = this.re;
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
        if (this.le) {
            let s = this.re;
            let i;
            const n = this.oe;
            while (s != null) {
                i = s.nextSibling;
                e.insertBefore(s, t);
                if (s === n) {
                    break;
                }
                s = i;
            }
        } else {
            this.le = true;
            e.insertBefore(this.f, t);
        }
    }
    unlink() {
        this.ae = false;
        this.next = void 0;
        this.ref = void 0;
    }
    link(t) {
        this.ae = true;
        if (isRenderLocation(t)) {
            this.ref = t;
        } else {
            this.next = t;
            this.he();
        }
    }
    he() {
        if (this.next !== void 0) {
            this.ref = this.next.firstChild;
        } else {
            this.ref = void 0;
        }
    }
}

const Mi = /*@__PURE__*/ Be("IWindow", (t => t.callback((t => t.get($e).window))));

const Di = /*@__PURE__*/ Be("ILocation", (t => t.callback((t => t.get(Mi).location))));

const Ii = /*@__PURE__*/ Be("IHistory", (t => t.callback((t => t.get(Mi).history))));

const registerHostNode = (t, e, s = t.get($e)) => {
    registerResolver(t, s.HTMLElement, registerResolver(t, s.Element, registerResolver(t, Ai, new R("ElementResolver", e))));
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
    if (!l(t)) {
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
    const e = pe(Oi, t);
    if (e === void 0) {
        annotateElementMetadata(t, "containerless", true);
        return;
    }
    e.containerless = true;
}

const Pi = new WeakMap;

class CustomElementDefinition {
    get type() {
        return Re;
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
            if (i(s)) {
                throw createMappedError(761, t);
            }
            const n = O("name", s, Fi);
            if (l(s.Type)) {
                e = s.Type;
            } else {
                e = Vi(F(n));
            }
            for (const t of Object.values(ke.from(s.bindables))) {
                ke.i(t, e);
            }
            return new CustomElementDefinition(e, n, v(s.aliases), O("key", s, (() => getElementKeyFrom(n))), V("capture", s, e, returnFalse), O("template", s, returnNull), v(s.instructions), v(getElementAnnotation(e, "dependencies"), s.dependencies), O("injectable", s, returnNull), O("needsCompile", s, returnTrue), v(s.surrogates), ke.from(getElementAnnotation(e, "bindables"), s.bindables), V("containerless", s, e, returnFalse), O("shadowOptions", s, returnNull), O("hasSlots", s, returnFalse), O("enhance", s, returnFalse), O("watches", s, returnEmptyArray), H("processContent", e, returnNull));
        }
        if (i(t)) {
            return new CustomElementDefinition(e, t, v(getElementAnnotation(e, "aliases"), e.aliases), getElementKeyFrom(t), H("capture", e, returnFalse), H("template", e, returnNull), v(getElementAnnotation(e, "instructions"), e.instructions), v(getElementAnnotation(e, "dependencies"), e.dependencies), H("injectable", e, returnNull), H("needsCompile", e, returnTrue), v(getElementAnnotation(e, "surrogates"), e.surrogates), ke.from(...ke.getAll(e), getElementAnnotation(e, "bindables"), e.bindables), H("containerless", e, returnFalse), H("shadowOptions", e, returnNull), H("hasSlots", e, returnFalse), H("enhance", e, returnFalse), v(Ne.getDefinitions(e), e.watches), H("processContent", e, returnNull));
        }
        const s = O("name", t, Fi);
        for (const s of Object.values(ke.from(t.bindables))) {
            ke.i(s, e);
        }
        return new CustomElementDefinition(e, s, v(getElementAnnotation(e, "aliases"), t.aliases, e.aliases), getElementKeyFrom(s), V("capture", t, e, returnFalse), V("template", t, e, returnNull), v(getElementAnnotation(e, "instructions"), t.instructions, e.instructions), v(getElementAnnotation(e, "dependencies"), t.dependencies, e.dependencies), V("injectable", t, e, returnNull), V("needsCompile", t, e, returnTrue), v(getElementAnnotation(e, "surrogates"), t.surrogates, e.surrogates), ke.from(...ke.getAll(e), getElementAnnotation(e, "bindables"), e.bindables, t.bindables), V("containerless", t, e, returnFalse), V("shadowOptions", t, e, returnNull), V("hasSlots", t, e, returnFalse), V("enhance", t, e, returnFalse), v(t.watches, Ne.getDefinitions(e), e.watches), V("processContent", t, e, returnNull));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) {
            return t;
        }
        if (Pi.has(t)) {
            return Pi.get(t);
        }
        const e = CustomElementDefinition.create(t);
        Pi.set(t, e);
        xe(e, e.Type, Oi);
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
        t.register(t.has(s, false) ? null : Se(s, s), Ae(s, i), ...n.map((t => Ae(s, getElementKeyFrom(t)))));
    }
    toString() {
        return `au:ce:${this.name}`;
    }
}

const qi = {
    name: undefined,
    searchParents: false,
    optional: false
};

const returnNull = () => null;

const returnFalse = () => false;

const returnTrue = () => true;

const returnEmptyArray = () => C;

const _i = "custom-element";

const Oi = /*@__PURE__*/ w(_i);

const getElementKeyFrom = t => `${Oi}:${t}`;

const Fi = /*@__PURE__*/ (t => () => `unnamed-${++t}`)(0);

const annotateElementMetadata = (t, e, s) => {
    xe(s, t, we(e));
};

const defineElement = (t, e) => {
    const s = CustomElementDefinition.create(t, e);
    const i = s.Type;
    xe(s, i, Oi, x);
    return i;
};

const isElementType = t => l(t) && (ve(Oi, t) || t.$au?.type === _i);

const findElementControllerFor = (t, e = qi) => {
    if (e.name === void 0 && e.searchParents !== true) {
        const s = getRef(t, Oi);
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
            const s = getRef(t, Oi);
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
            const t = getRef(s, Oi);
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
        const t = getRef(s, Oi);
        if (t !== null) {
            return t;
        }
        s = getEffectiveParentNode(s);
    }
    throw createMappedError(765, t);
};

const getElementAnnotation = (t, e) => pe(we(e), t);

const getElementDefinition = t => {
    const e = pe(Oi, t) ?? getDefinitionFromStaticAu(t, _i, CustomElementDefinition.create);
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

const Vi = /*@__PURE__*/ function() {
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
        Yt(n, "name", t);
        if (i !== e) {
            Gt(n.prototype, i);
        }
        return n;
    };
}();

const Hi = /*@__PURE__*/ Ut({
    name: Oi,
    keyFrom: getElementKeyFrom,
    isType: isElementType,
    for: findElementControllerFor,
    define: defineElement,
    getDefinition: getElementDefinition,
    annotate: annotateElementMetadata,
    getAnnotation: getElementAnnotation,
    generateName: Fi,
    createInjectable: createElementInjectable,
    generateType: Vi,
    find(t, e) {
        const s = t.find(_i, e);
        return s == null ? null : pe(Oi, s) ?? getDefinitionFromStaticAu(s, _i, CustomElementDefinition.create) ?? null;
    }
});

const $i = /*@__PURE__*/ we("processContent");

function processContent(t) {
    return t === void 0 ? function(t, e) {
        if (!e.static || e.kind !== "method") throw createMappedError(766, t);
        e.addInitializer((function() {
            xe(t, this, $i);
        }));
    } : function(e, s) {
        s.addInitializer((function() {
            if (i(t) || $(t)) {
                t = this[t];
            }
            if (!l(t)) throw createMappedError(766, t);
            const e = pe(Oi, this);
            if (e !== void 0) {
                e.processContent = t;
            } else {
                xe(t, this, $i);
            }
        }));
        return e;
    };
}

function capture(t) {
    return function(e, s) {
        const i = l(t) ? t : true;
        s.addInitializer((function() {
            annotateElementMetadata(this, "capture", i);
            if (isElementType(this)) {
                getElementDefinition(this).capture = i;
            }
        }));
    };
}

const Ni = /*@__PURE__*/ Be("IAppRoot");

class AppRoot {
    get controller() {
        return this.M;
    }
    constructor(t, e, s, i = false) {
        this.config = t;
        this.container = e;
        this.ce = void 0;
        this.ue = i;
        const n = this.host = t.host;
        s.prepare(this);
        registerResolver(e, Ei, new R("IEventTarget", n));
        registerHostNode(e, n, this.platform = this.fe(e, n));
        this.ce = _(this.de("creating"), (() => {
            if (!t.allowActionlessForm !== false) {
                n.addEventListener("submit", (t => {
                    const e = t.target;
                    const s = !e.getAttribute("action");
                    if (e.tagName === "FORM" && s) {
                        t.preventDefault();
                    }
                }), false);
            }
            const s = i ? e : e.createChild();
            const r = t.component;
            let a;
            if (l(r)) {
                a = s.invoke(r);
                Ee(r, a);
            } else {
                a = t.component;
            }
            const h = {
                hydrate: false,
                projections: null
            };
            const c = i ? CustomElementDefinition.create({
                name: Fi(),
                template: this.host,
                enhance: true
            }) : void 0;
            const u = this.M = Controller.$el(s, a, n, h, c);
            u.hE(h, null);
            return _(this.de("hydrating"), (() => {
                u.hS();
                return _(this.de("hydrated"), (() => {
                    u.hC();
                    this.ce = void 0;
                }));
            }));
        }));
    }
    activate() {
        return _(this.ce, (() => _(this.de("activating"), (() => _(this.M.activate(this.M, null, void 0), (() => this.de("activated")))))));
    }
    deactivate() {
        return _(this.de("deactivating"), (() => _(this.M.deactivate(this.M, null), (() => this.de("deactivated")))));
    }
    de(t) {
        const e = this.container;
        const s = this.ue && !e.has(Ve, false) ? [] : e.getAll(Ve);
        return P(...s.reduce(((e, s) => {
            if (s.slot === t) {
                e.push(s.run());
            }
            return e;
        }), []));
    }
    fe(t, e) {
        let s;
        if (!t.has($e, false)) {
            if (e.ownerDocument.defaultView === null) {
                throw createMappedError(769);
            }
            s = new Ht(e.ownerDocument.defaultView);
            t.register(Ee($e, s));
        } else {
            s = t.get($e);
        }
        return s;
    }
    dispose() {
        this.M?.dispose();
    }
}

const ji = /*@__PURE__*/ Be("IAurelia");

class Aurelia {
    get isRunning() {
        return this.ir;
    }
    get isStarting() {
        return this.me;
    }
    get isStopping() {
        return this.ge;
    }
    get root() {
        if (this.pe == null) {
            if (this.next == null) {
                throw createMappedError(767);
            }
            return this.next;
        }
        return this.pe;
    }
    constructor(t = m.createContainer()) {
        this.container = t;
        this.ir = false;
        this.me = false;
        this.ge = false;
        this.pe = void 0;
        this.next = void 0;
        this.ve = void 0;
        this.xe = void 0;
        if (t.has(ji, true) || t.has(Aurelia, true)) {
            throw createMappedError(768);
        }
        registerResolver(t, ji, new R("IAurelia", this));
        registerResolver(t, Aurelia, new R("Aurelia", this));
        registerResolver(t, Ni, this.be = new R("IAppRoot"));
    }
    register(...t) {
        this.container.register(...t);
        return this;
    }
    app(t) {
        this.next = new AppRoot(t, this.container, this.be);
        return this;
    }
    enhance(t) {
        const e = t.container ?? this.container.createChild();
        const s = registerResolver(e, Ni, new R("IAppRoot"));
        const i = new AppRoot({
            host: t.host,
            component: t.component
        }, e, s, true);
        return _(i.activate(), (() => i));
    }
    async waitForIdle() {
        const t = this.root.platform;
        await t.domQueue.yield();
        await t.taskQueue.yield();
    }
    start(t = this.next) {
        if (t == null) {
            throw createMappedError(770);
        }
        if (q(this.ve)) {
            return this.ve;
        }
        return this.ve = _(this.stop(), (() => {
            Reflect.set(t.host, "$aurelia", this);
            this.be.prepare(this.pe = t);
            this.me = true;
            return _(t.activate(), (() => {
                this.ir = true;
                this.me = false;
                this.ve = void 0;
                this.we(t, "au-started", t.host);
            }));
        }));
    }
    stop(t = false) {
        if (q(this.xe)) {
            return this.xe;
        }
        if (this.ir === true) {
            const e = this.pe;
            this.ir = false;
            this.ge = true;
            return this.xe = _(e.deactivate(), (() => {
                Reflect.deleteProperty(e.host, "$aurelia");
                if (t) {
                    e.dispose();
                }
                this.pe = void 0;
                this.be.dispose();
                this.ge = false;
                this.we(e, "au-stopped", e.host);
            }));
        }
    }
    dispose() {
        if (this.ir || this.ge) {
            throw createMappedError(771);
        }
        this.container.dispose();
    }
    we(t, e, s) {
        const i = new t.platform.window.CustomEvent(e, {
            detail: this,
            bubbles: true,
            cancelable: true
        });
        s.dispatchEvent(i);
    }
}

const Wi = /*@__PURE__*/ Be("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

const o = t => {
    const e = n();
    t = i(t) ? t.split(" ") : t;
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
        t.register(Se(this, this), Ae(this, Wi));
    }
    constructor() {
        this.ye = Gt(n(), {
            a: o("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage target transform xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            altGlyph: o("class dx dy externalResourcesRequired format glyphRef id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            altglyph: n(),
            altGlyphDef: o("id xml:base xml:lang xml:space"),
            altglyphdef: n(),
            altGlyphItem: o("id xml:base xml:lang xml:space"),
            altglyphitem: n(),
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
            glyphref: n(),
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
        this.ke = o("a altGlyph animate animateColor circle clipPath defs ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feFlood feGaussianBlur feImage feMerge feMorphology feOffset feSpecularLighting feTile feTurbulence filter font foreignObject g glyph glyphRef image line linearGradient marker mask missing-glyph path pattern polygon polyline radialGradient rect stop svg switch symbol text textPath tref tspan use");
        this.Ce = o("alignment-baseline baseline-shift clip-path clip-rule clip color-interpolation-filters color-interpolation color-profile color-rendering color cursor direction display dominant-baseline enable-background fill-opacity fill-rule fill filter flood-color flood-opacity font-family font-size-adjust font-size font-stretch font-style font-variant font-weight glyph-orientation-horizontal glyph-orientation-vertical image-rendering kerning letter-spacing lighting-color marker-end marker-mid marker-start mask opacity overflow pointer-events shape-rendering stop-color stop-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width stroke text-anchor text-decoration text-rendering unicode-bidi visibility word-spacing writing-mode");
        const t = y($e);
        this.SVGElement = t.globalThis.SVGElement;
        const e = t.document.createElement("div");
        e.innerHTML = "<svg><altGlyph /></svg>";
        if (e.firstElementChild.nodeName === "altglyph") {
            const t = this.ye;
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
        return this.ke[t.nodeName] === true && this.Ce[e] === true || this.ye[t.nodeName]?.[e] === true;
    }
}

class AttrMapper {
    constructor() {
        this.fns = [];
        this.Be = n();
        this.Se = n();
        this.svg = y(Wi);
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
        let r;
        for (i in t) {
            e = t[i];
            s = this.Be[i] ??= n();
            for (r in e) {
                if (s[r] !== void 0) {
                    throw createError(r, i);
                }
                s[r] = e[r];
            }
        }
    }
    useGlobalMapping(t) {
        const e = this.Se;
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
        return this.Be[t.nodeName]?.[e] ?? this.Se[e] ?? (isDataAttribute(t, e, this.svg) ? e : null);
    }
}

AttrMapper.register = N(gt);

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

const zi = {
    register(t) {
        t.register(vt, AttrMapper, ResourceResolver);
    }
};

class BindablesInfo {
    constructor(t, e, s) {
        this.attrs = t;
        this.bindables = e;
        this.primary = s;
    }
}

class ResourceResolver {
    constructor() {
        this.Ae = new WeakMap;
        this.Ee = new WeakMap;
    }
    el(t, e) {
        let s = this.Ae.get(t);
        if (s == null) {
            this.Ae.set(t, s = new RecordCache);
        }
        return e in s.Re ? s.Re[e] : s.Re[e] = Hi.find(t, e);
    }
    attr(t, e) {
        let s = this.Ae.get(t);
        if (s == null) {
            this.Ae.set(t, s = new RecordCache);
        }
        return e in s.Te ? s.Te[e] : s.Te[e] = ze.find(t, e);
    }
    bindables(t) {
        let e = this.Ee.get(t);
        if (e == null) {
            const s = t.bindables;
            const i = n();
            let r;
            let l;
            let a = false;
            let h;
            let c;
            for (l in s) {
                r = s[l];
                c = r.attribute;
                if (r.primary === true) {
                    if (a) {
                        throw createMappedError(714, t);
                    }
                    a = true;
                    h = r;
                } else if (!a && h == null) {
                    h = r;
                }
                i[c] = BindableDefinition.create(l, r);
            }
            if (r == null && t.type === "custom-attribute") {
                h = i.value = BindableDefinition.create("value", {
                    mode: t.defaultBindingMode ?? ue
                });
            }
            this.Ee.set(t, e = new BindablesInfo(i, s, h ?? null));
        }
        return e;
    }
}

ResourceResolver.register = N(pt);

class RecordCache {
    constructor() {
        this.Re = n();
        this.Te = n();
    }
}

const Ui = n();

class AttributeNSAccessor {
    static forNs(t) {
        return Ui[t] ??= new AttributeNSAccessor(t);
    }
    constructor(t) {
        this.ns = t;
        this.type = re | oe;
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
        this.type = re | oe;
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

const Gi = /*@__PURE__*/ new DataAttributeAccessor;

class SelectValueObserver {
    static Le(t) {
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
                e[e.length] = zt.call(n, "model") ? n.model : n.value;
            }
            ++i;
        }
        return e;
    }
    static Me(t, e) {
        return t === e;
    }
    constructor(t, e, s, i) {
        this.type = re | ne | oe;
        this.v = void 0;
        this.ov = void 0;
        this.De = false;
        this.Ie = void 0;
        this.Pe = void 0;
        this.iO = false;
        this.rt = false;
        this.nt = t;
        this.oL = i;
        this.cf = s;
    }
    getValue() {
        return this.iO ? this.v : this.nt.multiple ? SelectValueObserver.Le(this.nt.options) : this.nt.value;
    }
    setValue(t) {
        this.ov = this.v;
        this.v = t;
        this.De = t !== this.ov;
        this.qe(t instanceof Array ? t : null);
        this.ut();
    }
    ut() {
        if (this.De) {
            this.De = false;
            this.syncOptions();
        }
    }
    handleCollectionChange() {
        this.syncOptions();
    }
    syncOptions() {
        const t = this.v;
        const e = this.nt;
        const s = a(t);
        const i = e.matcher ?? SelectValueObserver.Me;
        const n = e.options;
        let r = n.length;
        while (r-- > 0) {
            const e = n[r];
            const l = zt.call(e, "model") ? e.model : e.value;
            if (s) {
                e.selected = t.findIndex((t => !!i(l, t))) !== -1;
                continue;
            }
            e.selected = !!i(l, t);
        }
    }
    syncValue() {
        const t = this.nt;
        const e = t.options;
        const s = e.length;
        const i = this.v;
        let n = 0;
        if (t.multiple) {
            if (!(i instanceof Array)) {
                return true;
            }
            let r;
            const l = t.matcher || SelectValueObserver.Me;
            const a = [];
            while (n < s) {
                r = e[n];
                if (r.selected) {
                    a.push(zt.call(r, "model") ? r.model : r.value);
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
                r = zt.call(l, "model") ? l.model : l.value;
                break;
            }
            ++n;
        }
        this.ov = this.v;
        this.v = r;
        return true;
    }
    ot() {
        (this.Pe = createMutationObserver(this.nt, this._e.bind(this))).observe(this.nt, {
            childList: true,
            subtree: true,
            characterData: true
        });
        this.qe(this.v instanceof Array ? this.v : null);
        this.iO = true;
    }
    lt() {
        this.Pe.disconnect();
        this.Ie?.unsubscribe(this);
        this.Pe = this.Ie = void 0;
        this.iO = false;
    }
    qe(t) {
        this.Ie?.unsubscribe(this);
        this.Ie = void 0;
        if (t != null) {
            if (!this.nt.multiple) {
                throw createMappedError(654);
            }
            (this.Ie = this.oL.getArrayObserver(t)).subscribe(this);
        }
    }
    handleEvent() {
        const t = this.syncValue();
        if (t) {
            this.Oe();
        }
    }
    _e(t) {
        this.syncOptions();
        const e = this.syncValue();
        if (e) {
            this.Oe();
        }
    }
    Oe() {
        const t = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, t);
    }
}

(() => {
    mixinNodeObserverUseConfig(SelectValueObserver);
    Y(SelectValueObserver, null);
})();

const Ki = "--";

class StyleAttributeAccessor {
    constructor(t) {
        this.obj = t;
        this.type = re | oe;
        this.v = "";
        this.ov = "";
        this.styles = {};
        this.version = 0;
        this.De = false;
    }
    getValue() {
        return this.obj.style.cssText;
    }
    setValue(t) {
        this.v = t;
        this.De = t !== this.ov;
        this.ut();
    }
    Fe(t) {
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
    Ve(t) {
        let e;
        let s;
        const n = [];
        for (s in t) {
            e = t[s];
            if (e == null) {
                continue;
            }
            if (i(e)) {
                if (s.startsWith(Ki)) {
                    n.push([ s, e ]);
                    continue;
                }
                n.push([ f(s), e ]);
                continue;
            }
            n.push(...this.He(e));
        }
        return n;
    }
    $e(t) {
        const e = t.length;
        if (e > 0) {
            const s = [];
            let i = 0;
            for (;e > i; ++i) {
                s.push(...this.He(t[i]));
            }
            return s;
        }
        return C;
    }
    He(t) {
        if (i(t)) {
            return this.Fe(t);
        }
        if (t instanceof Array) {
            return this.$e(t);
        }
        if (t instanceof Object) {
            return this.Ve(t);
        }
        return C;
    }
    ut() {
        if (this.De) {
            this.De = false;
            const t = this.v;
            const e = this.styles;
            const s = this.He(t);
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
                if (!zt.call(e, i) || e[i] !== n) {
                    continue;
                }
                this.obj.style.removeProperty(i);
            }
        }
    }
    setProperty(t, e) {
        let s = "";
        if (e != null && l(e.indexOf) && e.includes("!important")) {
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
        this.type = re | ne | oe;
        this.v = "";
        this.ov = "";
        this.De = false;
        this.rt = false;
        this.nt = t;
        this.k = e;
        this.cf = s;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (M(t, this.v)) {
            return;
        }
        this.ov = this.v;
        this.v = t;
        this.De = true;
        if (!this.cf.readonly) {
            this.ut();
        }
    }
    ut() {
        if (this.De) {
            this.De = false;
            this.nt[this.k] = this.v ?? this.cf.default;
            this.Oe();
        }
    }
    handleEvent() {
        this.ov = this.v;
        this.v = this.nt[this.k];
        if (this.ov !== this.v) {
            this.De = false;
            this.Oe();
        }
    }
    ot() {
        this.v = this.ov = this.nt[this.k];
    }
    Oe() {
        const t = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, t);
    }
}

(() => {
    mixinNodeObserverUseConfig(ValueAttributeObserver);
    Y(ValueAttributeObserver, null);
})();

const Xi = (() => {
    const t = "http://www.w3.org/1999/xlink";
    const e = "http://www.w3.org/XML/1998/namespace";
    const s = "http://www.w3.org/2000/xmlns/";
    return Gt(n(), {
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

const Qi = new st;

Qi.type = re | oe;

class NodeObserverLocator {
    constructor() {
        this.allowDirtyCheck = true;
        this.Ne = n();
        this.je = n();
        this.We = n();
        this.ze = n();
        this.Ue = y(j);
        this.p = y($e);
        this.Ge = y(nt);
        this.svg = y(Wi);
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
        const r = this.Ne;
        let l;
        if (i(t)) {
            l = r[t] ??= n();
            if (l[e] == null) {
                l[e] = s;
            } else {
                throwMappingExisted(t, e);
            }
        } else {
            for (const s in t) {
                l = r[s] ??= n();
                const i = t[s];
                for (e in i) {
                    if (l[e] == null) {
                        l[e] = i[e];
                    } else {
                        throwMappingExisted(s, e);
                    }
                }
            }
        }
    }
    useConfigGlobal(t, e) {
        const s = this.je;
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
        if (e in this.ze || e in (this.We[t.tagName] ?? W)) {
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
            return Gi;

          default:
            {
                const s = Xi[e];
                if (s !== undefined) {
                    return AttributeNSAccessor.forNs(s[1]);
                }
                if (isDataAttribute(t, e, this.svg)) {
                    return Gi;
                }
                return Qi;
            }
        }
    }
    overrideAccessor(t, e) {
        let s;
        if (i(t)) {
            s = this.We[t] ??= n();
            s[e] = true;
        } else {
            for (const e in t) {
                for (const i of t[e]) {
                    s = this.We[e] ??= n();
                    s[i] = true;
                }
            }
        }
    }
    overrideAccessorGlobal(...t) {
        for (const e of t) {
            this.ze[e] = true;
        }
    }
    getNodeObserverConfig(t, e) {
        return this.Ne[t.tagName]?.[e] ?? this.je[e];
    }
    getNodeObserver(t, e, s) {
        const i = this.Ne[t.tagName]?.[e] ?? this.je[e];
        let n;
        if (i != null) {
            n = new (i.type ?? ValueAttributeObserver)(t, e, i, s, this.Ue);
            if (!n.doNotCache) {
                rt(t)[e] = n;
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
        const n = Xi[e];
        if (n !== undefined) {
            return AttributeNSAccessor.forNs(n[1]);
        }
        if (isDataAttribute(t, e, this.svg)) {
            return Gi;
        }
        if (e in t.constructor.prototype) {
            if (this.allowDirtyCheck) {
                return this.Ge.createProperty(t, e);
            }
            throw createMappedError(652, e);
        } else {
            return new ot(t, e);
        }
    }
}

NodeObserverLocator.register = N(it);

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
        this.type = re | ne | oe;
        this.v = void 0;
        this.ov = void 0;
        this.Ke = void 0;
        this.Xe = void 0;
        this.rt = false;
        this.nt = t;
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
        this.Qe();
        this.Ye();
        this.Oe();
    }
    handleCollectionChange() {
        this.Ye();
    }
    handleChange(t, e) {
        this.Ye();
    }
    Ye() {
        const t = this.v;
        const e = this.nt;
        const s = zt.call(e, "model") ? e.model : e.value;
        const i = e.type === "radio";
        const n = e.matcher !== void 0 ? e.matcher : defaultMatcher;
        if (i) {
            e.checked = !!n(t, s);
        } else if (t === true) {
            e.checked = true;
        } else {
            let i = false;
            if (a(t)) {
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
        const e = this.nt;
        const s = zt.call(e, "model") ? e.model : e.value;
        const i = e.checked;
        const n = e.matcher !== void 0 ? e.matcher : defaultMatcher;
        if (e.type === "checkbox") {
            if (a(t)) {
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
        this.Oe();
    }
    ot() {
        this.Qe();
    }
    lt() {
        this.Ke?.unsubscribe(this);
        this.Xe?.unsubscribe(this);
        this.Ke = this.Xe = void 0;
    }
    Oe() {
        Yi = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Yi);
    }
    Qe() {
        const t = this.nt;
        (this.Xe ??= t.$observers?.model ?? t.$observers?.value)?.subscribe(this);
        this.Ke?.unsubscribe(this);
        this.Ke = void 0;
        if (t.type === "checkbox") {
            (this.Ke = getCollectionObserver(this.v, this.oL))?.subscribe(this);
        }
    }
}

(() => {
    mixinNodeObserverUseConfig(CheckedObserver);
    Y(CheckedObserver, null);
})();

let Yi = void 0;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) {
            throw createMappedError(9994, e);
        }
        e.useTargetObserver(Gi);
    }
}

AttrBindingBehavior.$au = {
    type: Le,
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
    type: Le,
    name: "self"
};

class UpdateTriggerBindingBehavior {
    constructor() {
        this.oL = y(Z);
        this.Ze = y(it);
    }
    bind(t, e, ...s) {
        if (!(this.Ze instanceof NodeObserverLocator)) {
            throw createMappedError(9993);
        }
        if (s.length === 0) {
            throw createMappedError(802);
        }
        if (!(e instanceof PropertyBinding) || !(e.mode & me)) {
            throw createMappedError(803);
        }
        const i = this.Ze.getNodeObserverConfig(e.target, e.targetProperty);
        if (i == null) {
            throw createMappedError(9992, e);
        }
        const n = this.Ze.getNodeObserver(e.target, e.targetProperty, this.oL);
        n.useConfig({
            readonly: i.readonly,
            default: i.default,
            events: s
        });
        e.useTargetObserver(n);
    }
}

UpdateTriggerBindingBehavior.$au = {
    type: Le,
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
        this.Je = false;
        this.ts = 0;
        this.es = y(us);
        this.l = y(Ri);
    }
    attaching(t, e) {
        return this.ss(this.value);
    }
    detaching(t, e) {
        this.Je = true;
        return _(this.pending, (() => {
            this.Je = false;
            this.pending = void 0;
            void this.view?.deactivate(t, this.$controller);
        }));
    }
    valueChanged(t, e) {
        if (!this.$controller.isActive) return;
        t = !!t;
        e = !!e;
        if (t !== e) return this.ss(t);
    }
    ss(t) {
        const e = this.view;
        const s = this.$controller;
        const i = this.ts++;
        const isCurrent = () => !this.Je && this.ts === i + 1;
        let n;
        return _(this.pending, (() => this.pending = _(e?.deactivate(e, s), (() => {
            if (!isCurrent()) {
                return;
            }
            if (t) {
                n = this.view = this.ifView = this.cache && this.ifView != null ? this.ifView : this.es.create();
            } else {
                n = this.view = this.elseView = this.cache && this.elseView != null ? this.elseView : this.elseFactory?.create();
            }
            if (n == null) {
                return;
            }
            n.setLocation(this.l);
            return _(n.activate(n, s, s.scope), (() => {
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
    type: je,
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
        this.f = y(us);
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

const Zi = [ "BindingBehavior", "ValueConverter" ];

class Repeat {
    constructor() {
        this.views = [];
        this.rs = [];
        this.key = null;
        this.os = new Map;
        this.ls = new Map;
        this.cs = void 0;
        this.us = false;
        this.ds = false;
        this.gs = null;
        this.ps = void 0;
        this.xs = false;
        this.l = y(Ri);
        this.bs = y(yi);
        this.f = y(us);
        this.ws = y(sn);
        const t = y(dt);
        const e = t.props[0].props[0];
        if (e !== void 0) {
            const {to: t, value: i, command: n} = e;
            if (t === "key") {
                if (n === null) {
                    this.key = i;
                } else if (n === "bind") {
                    this.key = y(s).parse(i, ee);
                } else {
                    throw createMappedError(775, n);
                }
            } else {
                throw createMappedError(776, t);
            }
        }
    }
    binding(t, e) {
        const s = this.bs.bindings;
        const i = s.length;
        let n = void 0;
        let r;
        let l = 0;
        for (;i > l; ++l) {
            n = s[l];
            if (n.target === this && n.targetProperty === "items") {
                r = this.forOf = n.ast;
                this.ys = n;
                let t = r.iterable;
                while (t != null && Zi.includes(t.$kind)) {
                    t = t.expression;
                    this.us = true;
                }
                this.gs = t;
                break;
            }
        }
        this.ks();
        const a = r.declaration;
        if (!(this.xs = a.$kind === "ArrayDestructuring" || a.$kind === "ObjectDestructuring")) {
            this.local = ae(a, this.$controller.scope, n, null);
        }
    }
    attaching(t, e) {
        this.Cs();
        return this.Bs(t, this.ps ?? C);
    }
    detaching(t, e) {
        this.ks();
        return this.Ss(t);
    }
    unbinding(t, e) {
        this.ls.clear();
        this.os.clear();
    }
    itemsChanged() {
        if (!this.$controller.isActive) {
            return;
        }
        this.ks();
        this.Cs();
        this.As(this.items, void 0);
    }
    handleCollectionChange(t, e) {
        const s = this.$controller;
        if (!s.isActive) {
            return;
        }
        if (this.us) {
            if (this.ds) {
                return;
            }
            this.ds = true;
            this.items = ae(this.forOf.iterable, s.scope, this.ys, null);
            this.ds = false;
            return;
        }
        this.Cs();
        this.As(t, e);
    }
    As(t, e) {
        const s = this.views;
        this.rs = s.slice();
        const i = s.length;
        const n = this.key;
        const r = n !== null;
        if (r || e === void 0) {
            const t = this.local;
            const l = this.ps;
            const a = l.length;
            const h = this.forOf;
            const c = h.declaration;
            const u = this.ys;
            const f = this.xs;
            e = lt(a);
            let d = 0;
            if (i === 0) {
                for (;d < a; ++d) {
                    e[d] = -2;
                }
            } else if (a === 0) {
                if (f) {
                    for (d = 0; d < i; ++d) {
                        e.deletedIndices.push(d);
                        e.deletedItems.push(ae(c, s[d].scope, u, null));
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
                        m[d] = ae(c, s[d].scope, u, null);
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
                const B = this.os;
                const S = this.ls;
                const A = this.$controller.scope;
                d = 0;
                t: {
                    while (true) {
                        if (r) {
                            g = m[d];
                            p = l[d];
                            v = getKeyValue(B, n, g, getScope(S, g, h, A, u, t, f), u);
                            x = getKeyValue(B, n, p, getScope(S, p, h, A, u, t, f), u);
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
                            v = getKeyValue(B, n, g, getScope(S, g, h, A, u, t, f), u);
                            x = getKeyValue(B, n, p, getScope(S, p, h, A, u, t, f), u);
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
                        x = r ? getKeyValue(B, n, p, getScope(S, p, h, A, u, t, f), u) : p;
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
            const t = _(this.Ss(null), (() => this.Bs(null, this.ps ?? C)));
            if (q(t)) {
                t.catch(rethrow);
            }
        } else {
            if (e.deletedIndices.length > 0) {
                const t = _(this.Es(e), (() => this.Rs(i, e)));
                if (q(t)) {
                    t.catch(rethrow);
                }
            } else {
                this.Rs(i, e);
            }
        }
    }
    ks() {
        const t = this.$controller.scope;
        let e = this.Ts;
        let s = this.us;
        let i;
        if (s) {
            e = this.Ts = ae(this.gs, t, this.ys, null) ?? null;
            s = this.us = !M(this.items, e);
        }
        const n = this.cs;
        if (this.$controller.isActive) {
            const t = s ? e : this.items;
            i = this.cs = this.ws.resolve(t).getObserver?.(t);
            if (n !== i) {
                n?.unsubscribe(this);
                i?.subscribe(this);
            }
        } else {
            n?.unsubscribe(this);
            this.cs = undefined;
        }
    }
    Cs() {
        const t = this.items;
        if (a(t)) {
            this.ps = t.slice(0);
            return;
        }
        const e = [];
        this.ws.resolve(t).iterate(t, ((t, s) => {
            e[s] = t;
        }));
        this.ps = e;
    }
    Bs(t, e) {
        let s = void 0;
        let i;
        let n;
        let r;
        const {$controller: l, f: a, local: h, l: c, ls: u, ys: f, forOf: d, xs: m} = this;
        const g = l.scope;
        const p = e.length;
        const v = this.views = Array(p);
        e.forEach(((e, x) => {
            n = v[x] = a.create().setLocation(c);
            n.nodes.unlink();
            r = getScope(u, e, d, g, f, h, m);
            setContextualProperties(r.overrideContext, x, p);
            i = n.activate(t ?? n, l, r);
            if (q(i)) {
                (s ??= []).push(i);
            }
        }));
        if (s !== void 0) {
            return s.length === 1 ? s[0] : Promise.all(s);
        }
    }
    Ss(t) {
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
            if (q(s)) {
                (e ?? (e = [])).push(s);
            }
        }
        if (e !== void 0) {
            return e.length === 1 ? e[0] : Promise.all(e);
        }
    }
    Es(t) {
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
            if (q(s)) {
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
    Rs(t, e) {
        let s = void 0;
        let i;
        let n;
        let r;
        let l = 0;
        const {$controller: a, f: h, local: c, ps: u, l: f, views: d, xs: m, ys: g, ls: p, rs: v, forOf: x} = this;
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
        const S = x.declaration;
        let A;
        let E = B - 1;
        l = y - 1;
        for (;l >= 0; --l) {
            n = d[l];
            A = d[l + 1];
            n.nodes.link(A?.nodes ?? f);
            if (e[l] === -2) {
                r = getScope(p, u[l], x, w, g, c, m);
                setContextualProperties(r.overrideContext, l, y);
                n.setLocation(f);
                i = n.activate(n, a, r);
                if (q(i)) {
                    (s ?? (s = [])).push(i);
                }
            } else if (E < 0 || B === 1 || l !== C[E]) {
                if (m) {
                    le(S, n.scope, g, u[l]);
                } else {
                    n.scope.bindingContext[c] = u[l];
                }
                setContextualProperties(n.scope.overrideContext, l, y);
                n.nodes.insertBefore(n.location);
            } else {
                if (m) {
                    le(S, n.scope, g, u[l]);
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
    type: je,
    name: "repeat",
    isTemplateController: true,
    bindables: [ "items" ]
};

let Ji = 16;

let tn = new Int32Array(Ji);

let en = new Int32Array(Ji);

function longestIncreasingSubsequence(t) {
    const e = t.length;
    if (e > Ji) {
        Ji = e;
        tn = new Int32Array(e);
        en = new Int32Array(e);
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
            l = tn[s];
            n = t[l];
            if (n !== -2 && n < i) {
                en[r] = l;
                tn[++s] = r;
                continue;
            }
            a = 0;
            h = s;
            while (a < h) {
                c = a + h >> 1;
                n = t[tn[c]];
                if (n !== -2 && n < i) {
                    a = c + 1;
                } else {
                    h = c;
                }
            }
            n = t[tn[a]];
            if (i < n || n === -2) {
                if (a > 0) {
                    en[r] = tn[a - 1];
                }
                tn[a] = r;
            }
        }
    }
    r = ++s;
    const u = new Int32Array(r);
    i = tn[s - 1];
    while (s-- > 0) {
        u[s] = i;
        i = en[i];
    }
    while (r-- > 0) tn[r] = 0;
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

const sn = /*@__PURE__*/ Be("IRepeatableHandlerResolver", (t => t.singleton(RepeatableHandlerResolver)));

class RepeatableHandlerResolver {
    constructor() {
        this.Ls = y(A(nn));
    }
    resolve(t) {
        if (rn.handles(t)) {
            return rn;
        }
        if (on.handles(t)) {
            return on;
        }
        if (ln.handles(t)) {
            return ln;
        }
        if (an.handles(t)) {
            return an;
        }
        if (hn.handles(t)) {
            return hn;
        }
        const e = this.Ls.find((e => e.handles(t)));
        if (e !== void 0) {
            return e;
        }
        return cn;
    }
}

class ArrayLikeHandler {
    static register(t) {
        t.register(Se(nn, this));
    }
    handles(t) {
        return "length" in t && z(t.length);
    }
    iterate(t, e) {
        for (let s = 0, i = t.length; s < i; ++s) {
            e(t[s], s, t);
        }
    }
}

const nn = /*@__PURE__*/ Be("IRepeatableHandler");

const rn = {
    handles: a,
    getObserver: at,
    iterate(t, e) {
        const s = t.length;
        let i = 0;
        for (;i < s; ++i) {
            e(t[i], i, t);
        }
    }
};

const on = {
    handles: U,
    getObserver: at,
    iterate(t, e) {
        let s = 0;
        let i;
        for (i of t.keys()) {
            e(i, s++, t);
        }
    }
};

const ln = {
    handles: G,
    getObserver: at,
    iterate(t, e) {
        let s = 0;
        let i;
        for (i of t.entries()) {
            e(i, s++, t);
        }
    }
};

const an = {
    handles: z,
    iterate(t, e) {
        let s = 0;
        for (;s < t; ++s) {
            e(s, s, t);
        }
    }
};

const hn = {
    handles: t => t == null,
    iterate() {}
};

const cn = {
    handles(t) {
        return false;
    },
    iterate(t, e) {
        throw createMappedError(777, t);
    }
};

const getKeyValue = (t, e, s, i, n) => {
    let r = t.get(s);
    if (r === void 0) {
        if (typeof e === "string") {
            r = s[e];
        } else {
            r = ae(e, i, n, null);
        }
        t.set(s, r);
    }
    return r;
};

const getScope = (t, e, s, i, n, r, l) => {
    let a = t.get(e);
    if (a === void 0) {
        if (l) {
            le(s.declaration, a = Scope.fromParent(i, new BindingContext), n, e);
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
        this.view = y(us).create().setLocation(y(Ri));
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
    type: je,
    name: "with",
    isTemplateController: true,
    bindables: [ "value" ]
};

class Switch {
    constructor() {
        this.cases = [];
        this.activeCases = [];
        this.promise = void 0;
        this.f = y(us);
        this.l = y(Ri);
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
        this.queue((() => this.Ms(t)));
    }
    Ms(t) {
        const e = t.isMatch(this.value);
        const s = this.activeCases;
        const i = s.length;
        if (!e) {
            if (i > 0 && s[0].id === t.id) {
                return this.Ds(null);
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
        return _(this.Ds(null, n), (() => {
            this.activeCases = n;
            return this.Is(null);
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
        return _(this.activeCases.length > 0 ? this.Ds(t, s) : void 0, (() => {
            this.activeCases = s;
            if (s.length === 0) {
                return;
            }
            return this.Is(t);
        }));
    }
    Is(t) {
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
        return P(...s.map((e => e.activate(t, n))));
    }
    Ds(t, e = []) {
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
        return _(P(...s.reduce(((s, i) => {
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
        s = this.promise = _(_(e, t), (() => {
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
    type: je,
    name: "switch",
    isTemplateController: true,
    bindables: [ "value" ]
};

let un = 0;

const dn = [ "value", {
    name: "fallThrough",
    mode: fe,
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

class Case {
    constructor() {
        this.id = ++un;
        this.fallThrough = false;
        this.view = void 0;
        this.f = y(us);
        this.Ue = y(Z);
        this.l = y(Ri);
        this.Ps = y(B).scopeTo(`${this.constructor.name}-#${this.id}`);
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
        this.Ps.debug("isMatch()");
        const e = this.value;
        if (a(e)) {
            if (this.cs === void 0) {
                this.cs = this.qs(e);
            }
            return e.includes(t);
        }
        return e === t;
    }
    valueChanged(t, e) {
        if (a(t)) {
            this.cs?.unsubscribe(this);
            this.cs = this.qs(t);
        } else if (this.cs !== void 0) {
            this.cs.unsubscribe(this);
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
        this.cs?.unsubscribe(this);
        this.view?.dispose();
        this.view = void 0;
    }
    linkToSwitch(t) {
        t.cases.push(this);
    }
    qs(t) {
        const e = this.Ue.getArrayObserver(t);
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

(() => {
    defineAttribute({
        name: "case",
        bindables: dn,
        isTemplateController: true
    }, Case);
})();

class DefaultCase extends Case {
    linkToSwitch(t) {
        if (t.defaultCase !== void 0) {
            throw createMappedError(816);
        }
        t.defaultCase = this;
    }
}

(() => {
    defineAttribute({
        name: "default-case",
        bindables: dn,
        isTemplateController: true
    }, DefaultCase);
})();

var mn, gn, pn;

class PromiseTemplateController {
    constructor() {
        this.preSettledTask = null;
        this.postSettledTask = null;
        this.f = y(us);
        this.l = y(Ri);
        this.p = y($e);
        this.logger = y(B).scopeTo("promise.resolve");
    }
    link(t, e, s, i) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(t, e) {
        const s = this.view;
        const i = this.$controller;
        return _(s.activate(t, i, this.viewScope = Scope.fromParent(i.scope, {})), (() => this.swap(t)));
    }
    valueChanged(t, e) {
        if (!this.$controller.isActive) {
            return;
        }
        this.swap(null);
    }
    swap(t) {
        const e = this.value;
        if (!q(e)) {
            return;
        }
        const s = this.p.domQueue;
        const i = this.fulfilled;
        const n = this.rejected;
        const r = this.pending;
        const l = this.viewScope;
        let a;
        const h = {
            reusable: false
        };
        const $swap = () => {
            void P(a = (this.preSettledTask = s.queueTask((() => P(i?.deactivate(t), n?.deactivate(t), r?.activate(t, l))), h)).result.catch((t => {
                if (!(t instanceof $t)) throw t;
            })), e.then((c => {
                if (this.value !== e) {
                    return;
                }
                const fulfill = () => {
                    this.postSettlePromise = (this.postSettledTask = s.queueTask((() => P(r?.deactivate(t), n?.deactivate(t), i?.activate(t, l, c))), h)).result;
                };
                if (this.preSettledTask.status === ie) {
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
                    this.postSettlePromise = (this.postSettledTask = s.queueTask((() => P(r?.deactivate(t), i?.deactivate(t), n?.activate(t, l, c))), h)).result;
                };
                if (this.preSettledTask.status === ie) {
                    void a.then(reject);
                } else {
                    this.preSettledTask.cancel();
                    reject();
                }
            })));
        };
        if (this.postSettledTask?.status === ie) {
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
    type: je,
    name: "promise",
    isTemplateController: true,
    bindables: [ "value" ]
};

class PendingTemplateController {
    constructor() {
        this.view = void 0;
        this.f = y(us);
        this.l = y(Ri);
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
    type: je,
    name: "pending",
    isTemplateController: true,
    bindables: {
        value: {
            mode: de
        }
    }
};

class FulfilledTemplateController {
    constructor() {
        this.view = void 0;
        this.f = y(us);
        this.l = y(Ri);
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
    type: je,
    name: "then",
    isTemplateController: true,
    bindables: {
        value: {
            mode: me
        }
    }
};

class RejectedTemplateController {
    constructor() {
        this.view = void 0;
        this.f = y(us);
        this.l = y(Ri);
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
    type: je,
    name: "catch",
    isTemplateController: true,
    bindables: {
        value: {
            mode: me
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
        return new bt(t, e, "promise", "bind");
    }
}

mn = Symbol.metadata;

PromiseAttributePattern[mn] = {
    [S]: xt.create([ {
        pattern: "promise.resolve",
        symbols: ""
    } ], PromiseAttributePattern)
};

class FulfilledAttributePattern {
    then(t, e) {
        return new bt(t, e, "then", "from-view");
    }
}

gn = Symbol.metadata;

FulfilledAttributePattern[gn] = {
    [S]: xt.create([ {
        pattern: "then",
        symbols: ""
    } ], FulfilledAttributePattern)
};

class RejectedAttributePattern {
    catch(t, e) {
        return new bt(t, e, "catch", "from-view");
    }
}

pn = Symbol.metadata;

RejectedAttributePattern[pn] = {
    [S]: xt.create([ {
        pattern: "catch",
        symbols: ""
    } ], RejectedAttributePattern)
};

class Focus {
    constructor() {
        this._s = false;
        this.Re = y(Ai);
        this.p = y($e);
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) {
            this.Os();
        } else {
            this._s = true;
        }
    }
    attached() {
        if (this._s) {
            this._s = false;
            this.Os();
        }
        this.Re.addEventListener("focus", this);
        this.Re.addEventListener("blur", this);
    }
    detaching() {
        const t = this.Re;
        t.removeEventListener("focus", this);
        t.removeEventListener("blur", this);
    }
    handleEvent(t) {
        if (t.type === "focus") {
            this.value = true;
        } else if (!this.Fs) {
            this.value = false;
        }
    }
    Os() {
        const t = this.Re;
        const e = this.Fs;
        const s = this.value;
        if (s && !e) {
            t.focus();
        } else if (!s && e) {
            t.blur();
        }
    }
    get Fs() {
        return this.Re === this.p.document.activeElement;
    }
}

Focus.$au = {
    type: je,
    name: "focus",
    bindables: {
        value: {
            mode: ge
        }
    }
};

class Portal {
    constructor() {
        this.position = "beforeend";
        this.strict = false;
        const t = y(us);
        const e = y(Ri);
        const s = y($e);
        this.p = s;
        this.Vs = s.document.createElement("div");
        (this.view = t.create()).setLocation(this.Hs = fs(s));
        setEffectiveParentNode(this.view.nodes, e);
    }
    attaching(t) {
        if (this.callbackContext == null) {
            this.callbackContext = this.$controller.scope.bindingContext;
        }
        const e = this.Vs = this.$s();
        this.Ns(e, this.position);
        return this.js(t, e);
    }
    detaching(t) {
        return this.Ws(t, this.Vs);
    }
    targetChanged() {
        const {$controller: t} = this;
        if (!t.isActive) {
            return;
        }
        const e = this.$s();
        if (this.Vs === e) {
            return;
        }
        this.Vs = e;
        const s = _(this.Ws(null, e), (() => {
            this.Ns(e, this.position);
            return this.js(null, e);
        }));
        if (q(s)) {
            s.catch(rethrow);
        }
    }
    positionChanged() {
        const {$controller: t, Vs: e} = this;
        if (!t.isActive) {
            return;
        }
        const s = _(this.Ws(null, e), (() => {
            this.Ns(e, this.position);
            return this.js(null, e);
        }));
        if (q(s)) {
            s.catch(rethrow);
        }
    }
    js(t, e) {
        const {activating: s, callbackContext: i, view: n} = this;
        return _(s?.call(i, e, n), (() => this.zs(t, e)));
    }
    zs(t, e) {
        const {$controller: s, view: i} = this;
        if (t === null) {
            i.nodes.insertBefore(this.Hs);
        } else {
            return _(i.activate(t ?? i, s, s.scope), (() => this.Us(e)));
        }
        return this.Us(e);
    }
    Us(t) {
        const {activated: e, callbackContext: s, view: i} = this;
        return e?.call(s, t, i);
    }
    Ws(t, e) {
        const {deactivating: s, callbackContext: i, view: n} = this;
        return _(s?.call(i, e, n), (() => this.Gs(t, e)));
    }
    Gs(t, e) {
        const {$controller: s, view: i} = this;
        if (t === null) {
            i.nodes.remove();
        } else {
            return _(i.deactivate(t, s), (() => this.Ks(e)));
        }
        return this.Ks(e);
    }
    Ks(t) {
        const {deactivated: e, callbackContext: s, view: i} = this;
        return _(e?.call(s, t, i), (() => this.Xs()));
    }
    $s() {
        const t = this.p;
        const e = t.document;
        let s = this.target;
        let n = this.renderContext;
        if (s === "") {
            if (this.strict) {
                throw createMappedError(811);
            }
            return e.body;
        }
        if (i(s)) {
            let r = e;
            if (i(n)) {
                n = e.querySelector(n);
            }
            if (n instanceof t.Node) {
                r = n;
            }
            s = r.querySelector(s);
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
    Xs() {
        this.Hs.remove();
        this.Hs.$start.remove();
    }
    Ns(t, e) {
        const s = this.Hs;
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
            throw createMappedError(779, e);
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
    type: je,
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

let vn;

class AuSlot {
    constructor() {
        this.Qs = null;
        this.Ys = null;
        this.Zt = false;
        this.expose = null;
        this.slotchange = null;
        this.Zs = new Set;
        this.cs = null;
        const t = y(ki);
        const e = y(Ri);
        const s = y(dt);
        const i = y(zs);
        const n = this.name = s.data.name;
        const r = s.projections?.[ds];
        const l = t.instruction?.projections?.[n];
        const a = t.controller.container;
        let h;
        let c;
        if (l == null) {
            c = a.createChild({
                inheritParentResources: true
            });
            h = i.getViewFactory(r ?? (vn ??= CustomElementDefinition.create({
                name: "au-slot-empty-template",
                template: "",
                needsCompile: false
            })), c);
            this.Js = false;
        } else {
            c = a.createChild();
            c.useResources(t.parent.controller.container);
            registerResolver(c, ki, new R(void 0, t.parent));
            h = i.getViewFactory(l, c);
            this.Js = true;
            this.ti = a.getAll(ps, false)?.filter((t => t.slotName === "*" || t.slotName === n)) ?? C;
        }
        this.ei = (this.ti ??= C).length > 0;
        this.si = t;
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
        this.Zs.add(t);
    }
    unsubscribe(t) {
        this.Zs.delete(t);
    }
    binding(t, e) {
        this.Qs = e.scope;
        while (e.vmKind === "synthetic" && e.parent?.viewModel instanceof AuSlot) {
            e = e.parent.parent;
        }
        const s = e.scope.bindingContext;
        let i;
        if (this.Js) {
            i = this.si.controller.scope.parent;
            (this.Ys = Scope.fromParent(i, i.bindingContext)).overrideContext.$host = this.expose ?? s;
        }
    }
    attaching(t, e) {
        return _(this.view.activate(t, this.$controller, this.Js ? this.Ys : this.Qs), (() => {
            if (this.ei) {
                this.ti.forEach((t => t.watch(this)));
                this.Qe();
                this.ii();
                this.Zt = true;
            }
        }));
    }
    detaching(t, e) {
        this.Zt = false;
        this.ni();
        this.ti.forEach((t => t.unwatch(this)));
        return this.view.deactivate(t, this.$controller);
    }
    exposeChanged(t) {
        if (this.Js && this.Ys != null) {
            this.Ys.overrideContext.$host = t;
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
    Qe() {
        if (this.cs != null) {
            return;
        }
        const t = this.l;
        const e = t.parentElement;
        if (e == null) {
            return;
        }
        (this.cs = createMutationObserver(e, (e => {
            if (isMutationWithinLocation(t, e)) {
                this.ii();
            }
        }))).observe(e, {
            childList: true
        });
    }
    ni() {
        this.cs?.disconnect();
        this.cs = null;
    }
    ii() {
        const t = this.nodes;
        const e = new Set(this.Zs);
        let s;
        if (this.Zt) {
            this.slotchange?.call(void 0, this.name, t);
        }
        for (s of e) {
            s.handleSlotChange(this, t);
        }
    }
}

AuSlot.$au = {
    type: _i,
    name: "au-slot",
    template: null,
    containerless: true,
    processContent(t, e, s) {
        s.name = t.getAttribute("name") ?? ds;
        let i = t.firstChild;
        let n = null;
        while (i !== null) {
            n = i.nextSibling;
            if (isElement(i) && i.hasAttribute(ms)) {
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
        this.ri = void 0;
        this.tag = null;
        this.c = y(T);
        this.parent = y(yi);
        this.oi = y(Ai);
        this.l = y(Ri);
        this.p = y($e);
        this.r = y(zs);
        this.li = y(dt);
        this.ai = y(K(CompositionContextFactory, null));
        this.gt = y(ft);
        this.J = y(ki);
        this.ep = y(s);
        this.oL = y(Z);
    }
    get composing() {
        return this.hi;
    }
    get composition() {
        return this.ri;
    }
    attaching(t, e) {
        return this.hi = _(this.queue(new ChangeInfo(this.template, this.component, this.model, void 0), t), (t => {
            if (this.ai.ci(t)) {
                this.hi = void 0;
            }
        }));
    }
    detaching(t) {
        const e = this.ri;
        const s = this.hi;
        this.ai.invalidate();
        this.ri = this.hi = void 0;
        return _(s, (() => e?.deactivate(t)));
    }
    propertyChanged(t) {
        if (t === "composing" || t === "composition") return;
        if (t === "model" && this.ri != null) {
            this.ri.update(this.model);
            return;
        }
        if (t === "tag" && this.ri?.controller.vmKind === ci) {
            return;
        }
        this.hi = _(this.hi, (() => _(this.queue(new ChangeInfo(this.template, this.component, this.model, t), void 0), (t => {
            if (this.ai.ci(t)) {
                this.hi = void 0;
            }
        }))));
    }
    queue(t, e) {
        const s = this.ai;
        const i = this.ri;
        return _(s.create(t), (t => {
            if (s.ci(t)) {
                return _(this.compose(t), (n => {
                    if (s.ci(t)) {
                        return _(n.activate(e), (() => {
                            if (s.ci(t)) {
                                this.ri = n;
                                return _(i?.deactivate(e), (() => t));
                            } else {
                                return _(n.controller.deactivate(n.controller, this.$controller), (() => {
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
        const {ui: e, fi: s, di: i} = t.change;
        const {c: n, $controller: r, l: a, li: h} = this;
        const c = this.mi(this.J.controller.container, s);
        const u = n.createChild();
        const f = this.p.document.createElement(c == null ? this.tag ?? "div" : c.name);
        a.parentNode.insertBefore(f, a);
        let d;
        if (c == null) {
            d = this.tag == null ? convertToRenderLocation(f) : null;
        } else {
            d = c.containerless ? convertToRenderLocation(f) : null;
        }
        const removeCompositionHost = () => {
            f.remove();
            if (d != null) {
                let t = d.$start.nextSibling;
                let e = null;
                while (t !== null && t !== d) {
                    e = t.nextSibling;
                    t.remove();
                    t = e;
                }
                d.$start?.remove();
                d.remove();
            }
        };
        const m = this.gi(u, typeof s === "string" ? c.Type : s, f, d);
        const compose = () => {
            const s = h.captures ?? C;
            if (c !== null) {
                const e = c.capture;
                const [i, n] = s.reduce(((t, s) => {
                    const i = !(s.target in c.bindables) && (e === true || l(e) && !!e(s.target));
                    t[i ? 0 : 1].push(s);
                    return t;
                }), [ [], [] ]);
                const a = Controller.$el(u, m, f, {
                    projections: h.projections,
                    captures: i
                }, c, d);
                this.pi(f, c, n).forEach((t => a.addBinding(t)));
                return new CompositionController(a, (t => a.activate(t ?? a, r, r.scope.parent)), (t => _(a.deactivate(t ?? a, r), removeCompositionHost)), (t => m.activate?.(t)), t);
            } else {
                const i = CustomElementDefinition.create({
                    name: Hi.generateName(),
                    template: e
                });
                const n = this.r.getViewFactory(i, u);
                const l = Controller.$view(n, r);
                const a = this.scopeBehavior === "auto" ? Scope.fromParent(this.parent.scope, m) : Scope.create(m);
                l.setHost(f);
                if (d == null) {
                    this.pi(f, i, s).forEach((t => l.addBinding(t)));
                } else {
                    l.setLocation(d);
                }
                return new CompositionController(l, (t => l.activate(t ?? l, r, a)), (t => _(l.deactivate(t ?? l, r), removeCompositionHost)), (t => m.activate?.(t)), t);
            }
        };
        if ("activate" in m) {
            return _(m.activate(i), (() => compose()));
        } else {
            return compose();
        }
    }
    gi(t, e, s, i) {
        if (e == null) {
            return new EmptyComponent;
        }
        if (typeof e === "object") {
            return e;
        }
        const n = this.p;
        registerHostNode(t, s, n);
        registerResolver(t, Ri, new R("IRenderLocation", i));
        const r = t.invoke(e);
        registerResolver(t, e, new R("au-compose.component", r));
        return r;
    }
    mi(t, e) {
        if (typeof e === "string") {
            const s = Hi.find(t, e);
            if (s == null) {
                throw createMappedError(806, e);
            }
            return s;
        }
        const s = l(e) ? e : e?.constructor;
        return Hi.isType(s, void 0) ? Hi.getDefinition(s, null) : null;
    }
    pi(t, e, s) {
        const i = new HydrationContext(this.$controller, {
            projections: null,
            captures: s
        }, this.J.parent);
        return SpreadBinding.create(i, t, e, this.r, this.gt, this.p, this.ep, this.oL);
    }
}

AuCompose.$au = {
    type: _i,
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
        mode: me
    }, {
        name: "composition",
        mode: me
    }, "tag" ]
};

class EmptyComponent {}

class CompositionContextFactory {
    constructor() {
        this.id = 0;
    }
    ci(t) {
        return t.id === this.id;
    }
    create(t) {
        return _(t.load(), (t => new CompositionContext(++this.id, t)));
    }
    invalidate() {
        this.id++;
    }
}

class ChangeInfo {
    constructor(t, e, s, i) {
        this.ui = t;
        this.fi = e;
        this.di = s;
        this.vi = i;
    }
    load() {
        if (q(this.ui) || q(this.fi)) {
            return Promise.all([ this.ui, this.fi ]).then((([t, e]) => new LoadedChangeInfo(t, e, this.di, this.vi)));
        } else {
            return new LoadedChangeInfo(this.ui, this.fi, this.di, this.vi);
        }
    }
}

class LoadedChangeInfo {
    constructor(t, e, s, i) {
        this.ui = t;
        this.fi = e;
        this.di = s;
        this.vi = i;
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

const xn = /*@__PURE__*/ Be("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw createMappedError(99, "sanitize");
    }
})));

class SanitizeValueConverter {
    constructor() {
        this.xi = y(xn);
    }
    toView(t) {
        if (t == null) {
            return null;
        }
        return this.xi.sanitize(t);
    }
}

SanitizeValueConverter.$au = {
    type: Ke,
    name: "sanitize"
};

class Show {
    constructor() {
        this.el = y(Ai);
        this.p = y($e);
        this.bi = false;
        this.L = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.L = null;
            if (Boolean(this.value) !== this.wi) {
                if (this.wi === this.yi) {
                    this.wi = !this.yi;
                    this.$val = this.el.style.getPropertyValue("display");
                    this.$prio = this.el.style.getPropertyPriority("display");
                    this.el.style.setProperty("display", "none", "important");
                } else {
                    this.wi = this.yi;
                    this.el.style.setProperty("display", this.$val, this.$prio);
                    if (this.el.getAttribute("style") === "") {
                        this.el.removeAttribute("style");
                    }
                }
            }
        };
        const t = y(dt);
        this.wi = this.yi = t.alias !== "hide";
    }
    binding() {
        this.bi = true;
        this.update();
    }
    detaching() {
        this.bi = false;
        this.L?.cancel();
        this.L = null;
    }
    valueChanged() {
        if (this.bi && this.L === null) {
            this.L = this.p.domQueue.queueTask(this.update);
        }
    }
}

Show.$au = {
    type: je,
    name: "show",
    bindables: [ "value" ],
    aliases: [ "hide" ]
};

const bn = [ zi, ht, NodeObserverLocator ];

const wn = [ wt, yt, kt, cs ];

const yn = [ Ct, Bt ];

const kn = [ St, At, Et, Rt, Tt, Lt, Mt, Dt, It, Pt, qt, _t, Ot ];

const Cn = [ DebounceBindingBehavior, OneTimeBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, SignalBindingBehavior, ThrottleBindingBehavior, TwoWayBindingBehavior, SanitizeValueConverter, If, Else, Repeat, With, Switch, Case, DefaultCase, PromiseTemplateController, PendingTemplateController, FulfilledTemplateController, RejectedTemplateController, PromiseAttributePattern, FulfilledAttributePattern, RejectedAttributePattern, AttrBindingBehavior, SelfBindingBehavior, UpdateTriggerBindingBehavior, AuCompose, Portal, Focus, Show, AuSlot ];

const Bn = [ As, Es, Bs, Ss, bs, ws, ys, ks, Cs, Ls, qs, Ms, Ds, Is, Ps, Rs, _s, Os ];

const Sn = /*@__PURE__*/ createConfiguration(d);

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
            return e.register(Ee(et, s.coercingOptions), ...bn, ...Cn, ...wn, ...kn, ...Bn);
        },
        customize(e) {
            return createConfiguration(e ?? t);
        }
    };
}

function children(t, e) {
    if (!children.mixed) {
        children.mixed = true;
        Y(ChildrenBinding, null);
        lifecycleHooks()(ChildrenLifecycleHooks, null);
    }
    let s;
    const n = we("dependencies");
    function decorator(t, e) {
        switch (e.kind) {
          case "field":
            s.name = e.name;
            break;
        }
        const i = e.metadata[n] ??= [];
        i.push(new ChildrenLifecycleHooks(s ?? {}));
    }
    if (arguments.length > 1) {
        s = {};
        decorator(t, e);
        return;
    } else if (i(t)) {
        s = {
            query: t
        };
        return decorator;
    }
    s = t === void 0 ? {} : t;
    return decorator;
}

children.mixed = false;

class ChildrenBinding {
    constructor(t, e, s, i, n, r) {
        this.ki = void 0;
        this.isBound = false;
        this.obj = e;
        this.cb = s;
        this.X = i;
        this.Ci = n;
        this.Bi = r;
        this.cs = createMutationObserver(this.oi = t, (() => {
            this.Si();
        }));
    }
    getValue() {
        return this.isBound ? this.ki : this.Ai();
    }
    setValue(t) {}
    bind() {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        this.cs.observe(this.oi, {
            childList: true
        });
        this.ki = this.Ai();
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.cs.takeRecords();
        this.cs.disconnect();
        this.ki = C;
    }
    Si() {
        this.ki = this.Ai();
        this.cb?.call(this.obj);
        this.subs.notify(this.ki, undefined);
    }
    get() {
        throw createMappedError(99, "get");
    }
    Ai() {
        const t = this.X;
        const e = this.Ci;
        const s = this.Bi;
        const i = t === "$all" ? this.oi.childNodes : this.oi.querySelectorAll(`:scope > ${t}`);
        const n = i.length;
        const r = [];
        const l = {
            optional: true
        };
        let a;
        let h;
        let c = 0;
        let u;
        while (n > c) {
            u = i[c];
            a = findElementControllerFor(u, l);
            h = a?.viewModel ?? null;
            if (e == null ? true : e(u, h)) {
                r.push(s == null ? h ?? u : s(u, h));
            }
            ++c;
        }
        return r;
    }
}

class ChildrenLifecycleHooks {
    constructor(t) {
        this.Y = t;
    }
    register(t) {
        Ee(Ue, this).register(t);
    }
    hydrating(t, e) {
        const s = this.Y;
        const i = s.query ?? "*";
        const n = new ChildrenBinding(e.host, t, t[s.callback ?? `${jt(s.name)}Changed`], i, s.filter, s.map);
        if (/[\s>]/.test(i)) {
            throw createMappedError(9989, i);
        }
        Yt(t, s.name, {
            enumerable: true,
            configurable: true,
            get: Gt((() => n.getValue()), {
                getObserver: () => n
            }),
            set: () => {}
        });
        e.addBinding(n);
    }
}

export { AdoptedStyleSheetsStyles, AppRoot, He as AppTask, ArrayLikeHandler, AttrBindingBehavior, AttrMapper, AttributeBinding, qs as AttributeBindingRenderer, AttributeNSAccessor, AuCompose, AuSlot, AuSlotsInfo, Aurelia, ke as Bindable, BindableDefinition, De as BindingBehavior, BindingBehaviorDefinition, BindingContext, BindingModeBehavior, BindingTargetSubscriber, CSSModulesProcessorRegistry, Case, CheckedObserver, ChildrenBinding, ClassAttributeAccessor, ComputedWatcher, ContentBinding, Controller, ze as CustomAttribute, CustomAttributeDefinition, ys as CustomAttributeRenderer, Hi as CustomElement, CustomElementDefinition, ws as CustomElementRenderer, DataAttributeAccessor, DebounceBindingBehavior, kn as DefaultBindingLanguage, wn as DefaultBindingSyntax, DefaultCase, bn as DefaultComponents, Bn as DefaultRenderers, Cn as DefaultResources, Else, EventModifier, cs as EventModifierRegistration, ExpressionWatcher, FlushQueue, Focus, FragmentNodeSequence, FromViewBindingBehavior, FulfilledTemplateController, Ni as IAppRoot, Ve as IAppTask, ps as IAuSlotWatcher, gs as IAuSlotsInfo, ji as IAurelia, yi as IController, hs as IEventModifier, Ei as IEventTarget, Je as IFlushQueue, Ii as IHistory, ki as IHydrationContext, as as IKeyMapping, Ue as ILifecycleHooks, Ts as IListenerBindingOptions, Di as ILocation, ls as IModifiedEventHandlerCreator, Ai as INode, $e as IPlatform, Ri as IRenderLocation, xs as IRenderer, zs as IRendering, nn as IRepeatableHandler, sn as IRepeatableHandlerResolver, Wi as ISVGAnalyzer, xn as ISanitizer, Ks as IShadowDOMGlobalStyles, Us as IShadowDOMStyleFactory, Gs as IShadowDOMStyles, _e as ISignaler, us as IViewFactory, Mi as IWindow, If, InterpolationBinding, Ss as InterpolationBindingRenderer, InterpolationPartBinding, Es as IteratorBindingRenderer, LetBinding, Cs as LetElementRenderer, Ge as LifecycleHooks, LifecycleHooksDefinition, LifecycleHooksEntry, ListenerBinding, ListenerBindingOptions, Ls as ListenerBindingRenderer, NodeObserverLocator, NoopSVGAnalyzer, OneTimeBindingBehavior, PendingTemplateController, Portal, PromiseTemplateController, PropertyBinding, As as PropertyBindingRenderer, RefBinding, Bs as RefBindingRenderer, RejectedTemplateController, Rendering, Repeat, zi as RuntimeTemplateCompilerImplementation, SVGAnalyzer, SanitizeValueConverter, Scope, SelectValueObserver, SelfBindingBehavior, Ms as SetAttributeRenderer, Ds as SetClassAttributeRenderer, bs as SetPropertyRenderer, Is as SetStyleAttributeRenderer, ShadowDOMRegistry, yn as ShortHandBindingSyntax, SignalBindingBehavior, _s as SpreadRenderer, Sn as StandardConfiguration, wi as State, StyleAttributeAccessor, Xs as StyleConfiguration, StyleElementStyles, Ps as StylePropertyBindingRenderer, Switch, ks as TemplateControllerRenderer, Rs as TextBindingRenderer, ThrottleBindingBehavior, ToViewBindingBehavior, TwoWayBindingBehavior, UpdateTriggerBindingBehavior, ValueAttributeObserver, Qe as ValueConverter, ValueConverterDefinition, ViewFactory, Ne as Watch, With, alias, le as astAssign, he as astBind, ae as astEvaluate, ce as astUnbind, bindable, bindingBehavior, capture, children, coercer, containerless, convertToRenderLocation, cssModules, customAttribute, customElement, getEffectiveParentNode, getRef, isCustomElementController, isCustomElementViewModel, isRenderLocation, lifecycleHooks, Ze as mixinAstEvaluator, Ye as mixinUseScope, ts as mixingBindingLimited, processContent, registerAliases, registerHostNode, renderer, setEffectiveParentNode, setRef, shadowCSS, slotted, templateController, useShadowDOM, valueConverter, watch };
//# sourceMappingURL=index.mjs.map
