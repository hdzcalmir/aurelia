"use strict";

var t = require("@aurelia/expression-parser");

var e = require("@aurelia/kernel");

var s = require("@aurelia/runtime");

var i = require("@aurelia/template-compiler");

var n = require("@aurelia/metadata");

var r = require("@aurelia/platform-browser");

var l = require("@aurelia/platform");

const a = Object;

const h = String;

const c = a.prototype;

const createLookup = () => a.create(null);

const createError$1 = t => new Error(t);

const u = c.hasOwnProperty;

const f = a.freeze;

const d = a.assign;

const p = a.getOwnPropertyNames;

const g = a.keys;

const m = /*@__PURE__*/ createLookup();

const isDataAttribute = (t, e, s) => {
    if (m[e] === true) {
        return true;
    }
    if (!isString(e)) {
        return false;
    }
    const i = e.slice(0, 5);
    return m[e] = i === "aria-" || i === "data-" || s.isStandardSvgAttribute(t, e);
};

const isPromise = t => t instanceof Promise;

const isArray = t => t instanceof Array;

const isSet = t => t instanceof Set;

const isMap = t => t instanceof Map;

const isFunction = t => typeof t === "function";

const isObject = t => t instanceof a;

const isString = t => typeof t === "string";

const isSymbol = t => typeof t === "symbol";

const isNumber = t => typeof t === "number";

const rethrow = t => {
    throw t;
};

const x = a.is;

const v = Reflect.defineProperty;

const defineHiddenProp = (t, e, s) => {
    v(t, e, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: s
    });
    return s;
};

const addSignalListener = (t, e, s) => t.addSignalListener(e, s);

const removeSignalListener = (t, e, s) => t.removeSignalListener(e, s);

const b = "Interpolation";

const w = "IsIterator";

const y = "IsFunction";

const k = "IsProperty";

const C = "pending";

const B = "running";

const S = s.AccessorType.Observer;

const A = s.AccessorType.Node;

const R = s.AccessorType.Layout;

const createMappedError = (t, ...e) => new Error(`AUR${h(t).padStart(4, "0")}:${e.map(h)}`);

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

const {astAssign: E, astEvaluate: T, astBind: L, astUnbind: M} = /*@__PURE__*/ (() => {
    const s = "AccessThis";
    const i = "AccessBoundary";
    const n = "AccessGlobal";
    const r = "AccessScope";
    const l = "ArrayLiteral";
    const a = "ObjectLiteral";
    const c = "PrimitiveLiteral";
    const u = "Template";
    const f = "Unary";
    const d = "CallScope";
    const p = "CallMember";
    const g = "CallFunction";
    const m = "CallGlobal";
    const x = "AccessMember";
    const v = "AccessKeyed";
    const b = "TaggedTemplate";
    const w = "Binary";
    const y = "Conditional";
    const k = "Assign";
    const C = "ArrowFunction";
    const B = "ValueConverter";
    const S = "BindingBehavior";
    const A = "ArrayBindingPattern";
    const R = "ObjectBindingPattern";
    const E = "BindingIdentifier";
    const T = "ForOfStatement";
    const L = "Interpolation";
    const M = "ArrayDestructuring";
    const D = "ObjectDestructuring";
    const q = "DestructuringAssignmentLeaf";
    const I = "Custom";
    const P = Scope.getContext;
    function astEvaluate(t, e, V, F) {
        switch (t.$kind) {
          case s:
            {
                let s = e.overrideContext;
                let i = e;
                let n = t.ancestor;
                while (n-- && s) {
                    i = i.parent;
                    s = i?.overrideContext ?? null;
                }
                return n < 1 && i ? i.bindingContext : void 0;
            }

          case i:
            {
                let t = e;
                while (t != null && !t.isBoundary) {
                    t = t.parent;
                }
                return t ? t.bindingContext : void 0;
            }

          case r:
            {
                const s = P(e, t.name, t.ancestor);
                if (F !== null) {
                    F.observe(s, t.name);
                }
                const i = s[t.name];
                if (i == null && t.name === "$host") {
                    throw createMappedError(105);
                }
                if (V?.strict) {
                    return V?.boundFn && isFunction(i) ? i.bind(s) : i;
                }
                return i == null ? "" : V?.boundFn && isFunction(i) ? i.bind(s) : i;
            }

          case n:
            return globalThis[t.name];

          case m:
            {
                const s = globalThis[t.name];
                if (isFunction(s)) {
                    return s(...t.args.map((t => astEvaluate(t, e, V, F))));
                }
                if (!V?.strictFnCall && s == null) {
                    return void 0;
                }
                throw createMappedError(107);
            }

          case l:
            return t.elements.map((t => astEvaluate(t, e, V, F)));

          case a:
            {
                const s = {};
                for (let i = 0; i < t.keys.length; ++i) {
                    s[t.keys[i]] = astEvaluate(t.values[i], e, V, F);
                }
                return s;
            }

          case c:
            return t.value;

          case u:
            {
                let s = t.cooked[0];
                for (let i = 0; i < t.expressions.length; ++i) {
                    s += String(astEvaluate(t.expressions[i], e, V, F));
                    s += t.cooked[i + 1];
                }
                return s;
            }

          case f:
            switch (t.operation) {
              case "void":
                return void astEvaluate(t.expression, e, V, F);

              case "typeof":
                return typeof astEvaluate(t.expression, e, V, F);

              case "!":
                return !astEvaluate(t.expression, e, V, F);

              case "-":
                return -astEvaluate(t.expression, e, V, F);

              case "+":
                return +astEvaluate(t.expression, e, V, F);

              default:
                throw createMappedError(109, t.operation);
            }

          case d:
            {
                const s = t.args.map((t => astEvaluate(t, e, V, F)));
                const i = P(e, t.name, t.ancestor);
                const n = getFunction(V?.strictFnCall, i, t.name);
                if (n) {
                    return n.apply(i, s);
                }
                return void 0;
            }

          case p:
            {
                const s = astEvaluate(t.object, e, V, F);
                const i = t.args.map((t => astEvaluate(t, e, V, F)));
                const n = getFunction(V?.strictFnCall, s, t.name);
                let r;
                if (n) {
                    r = n.apply(s, i);
                    if (isArray(s) && _.includes(t.name)) {
                        F?.observeCollection(s);
                    }
                }
                return r;
            }

          case g:
            {
                const s = astEvaluate(t.func, e, V, F);
                if (isFunction(s)) {
                    return s(...t.args.map((t => astEvaluate(t, e, V, F))));
                }
                if (!V?.strictFnCall && s == null) {
                    return void 0;
                }
                throw createMappedError(107);
            }

          case C:
            {
                const func = (...s) => {
                    const i = t.args;
                    const n = t.rest;
                    const r = i.length - 1;
                    const l = i.reduce(((t, e, i) => {
                        if (n && i === r) {
                            t[e.name] = s.slice(i);
                        } else {
                            t[e.name] = s[i];
                        }
                        return t;
                    }), {});
                    const a = Scope.fromParent(e, l);
                    return astEvaluate(t.body, a, V, F);
                };
                return func;
            }

          case x:
            {
                const s = astEvaluate(t.object, e, V, F);
                let i;
                if (V?.strict) {
                    if (s == null) {
                        return undefined;
                    }
                    if (F !== null && !t.accessGlobal) {
                        F.observe(s, t.name);
                    }
                    i = s[t.name];
                    if (V?.boundFn && isFunction(i)) {
                        return i.bind(s);
                    }
                    return i;
                }
                if (F !== null && isObject(s) && !t.accessGlobal) {
                    F.observe(s, t.name);
                }
                if (s) {
                    i = s[t.name];
                    if (V?.boundFn && isFunction(i)) {
                        return i.bind(s);
                    }
                    return i;
                }
                return "";
            }

          case v:
            {
                const s = astEvaluate(t.object, e, V, F);
                const i = astEvaluate(t.key, e, V, F);
                if (isObject(s)) {
                    if (F !== null && !t.accessGlobal) {
                        F.observe(s, i);
                    }
                    return s[i];
                }
                return s == null ? void 0 : s[i];
            }

          case b:
            {
                const s = t.expressions.map((t => astEvaluate(t, e, V, F)));
                const i = astEvaluate(t.func, e, V, F);
                if (!isFunction(i)) {
                    throw createMappedError(110);
                }
                return i(t.cooked, ...s);
            }

          case w:
            {
                const s = t.left;
                const i = t.right;
                switch (t.operation) {
                  case "&&":
                    return astEvaluate(s, e, V, F) && astEvaluate(i, e, V, F);

                  case "||":
                    return astEvaluate(s, e, V, F) || astEvaluate(i, e, V, F);

                  case "??":
                    return astEvaluate(s, e, V, F) ?? astEvaluate(i, e, V, F);

                  case "==":
                    return astEvaluate(s, e, V, F) == astEvaluate(i, e, V, F);

                  case "===":
                    return astEvaluate(s, e, V, F) === astEvaluate(i, e, V, F);

                  case "!=":
                    return astEvaluate(s, e, V, F) != astEvaluate(i, e, V, F);

                  case "!==":
                    return astEvaluate(s, e, V, F) !== astEvaluate(i, e, V, F);

                  case "instanceof":
                    {
                        const t = astEvaluate(i, e, V, F);
                        if (isFunction(t)) {
                            return astEvaluate(s, e, V, F) instanceof t;
                        }
                        return false;
                    }

                  case "in":
                    {
                        const t = astEvaluate(i, e, V, F);
                        if (isObject(t)) {
                            return astEvaluate(s, e, V, F) in t;
                        }
                        return false;
                    }

                  case "+":
                    {
                        const t = astEvaluate(s, e, V, F);
                        const n = astEvaluate(i, e, V, F);
                        if (V?.strict) {
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
                    return astEvaluate(s, e, V, F) - astEvaluate(i, e, V, F);

                  case "*":
                    return astEvaluate(s, e, V, F) * astEvaluate(i, e, V, F);

                  case "/":
                    return astEvaluate(s, e, V, F) / astEvaluate(i, e, V, F);

                  case "%":
                    return astEvaluate(s, e, V, F) % astEvaluate(i, e, V, F);

                  case "<":
                    return astEvaluate(s, e, V, F) < astEvaluate(i, e, V, F);

                  case ">":
                    return astEvaluate(s, e, V, F) > astEvaluate(i, e, V, F);

                  case "<=":
                    return astEvaluate(s, e, V, F) <= astEvaluate(i, e, V, F);

                  case ">=":
                    return astEvaluate(s, e, V, F) >= astEvaluate(i, e, V, F);

                  default:
                    throw createMappedError(108, t.operation);
                }
            }

          case y:
            return astEvaluate(t.condition, e, V, F) ? astEvaluate(t.yes, e, V, F) : astEvaluate(t.no, e, V, F);

          case k:
            return astAssign(t.target, e, V, astEvaluate(t.value, e, V, F));

          case B:
            {
                const s = V?.getConverter?.(t.name);
                if (s == null) {
                    throw createMappedError(103, t.name);
                }
                if ("toView" in s) {
                    return s.toView(astEvaluate(t.expression, e, V, F), ...t.args.map((t => astEvaluate(t, e, V, F))));
                }
                return astEvaluate(t.expression, e, V, F);
            }

          case S:
            return astEvaluate(t.expression, e, V, F);

          case E:
            return t.name;

          case T:
            return astEvaluate(t.iterable, e, V, F);

          case L:
            if (t.isMulti) {
                let s = t.parts[0];
                let i = 0;
                for (;i < t.expressions.length; ++i) {
                    s += h(astEvaluate(t.expressions[i], e, V, F));
                    s += t.parts[i + 1];
                }
                return s;
            } else {
                return `${t.parts[0]}${astEvaluate(t.firstExpression, e, V, F)}${t.parts[1]}`;
            }

          case q:
            return astEvaluate(t.target, e, V, F);

          case M:
            {
                return t.list.map((t => astEvaluate(t, e, V, F)));
            }

          case A:
          case R:
          case D:
          default:
            return void 0;

          case I:
            return t.evaluate(e, V, F);
        }
    }
    function astAssign(s, i, n, l) {
        switch (s.$kind) {
          case r:
            {
                if (s.name === "$host") {
                    throw createMappedError(106);
                }
                const t = P(i, s.name, s.ancestor);
                return t[s.name] = l;
            }

          case x:
            {
                const t = astEvaluate(s.object, i, n, null);
                if (isObject(t)) {
                    if (s.name === "length" && isArray(t) && !isNaN(l)) {
                        t.splice(l);
                    } else {
                        t[s.name] = l;
                    }
                } else {
                    astAssign(s.object, i, n, {
                        [s.name]: l
                    });
                }
                return l;
            }

          case v:
            {
                const t = astEvaluate(s.object, i, n, null);
                const r = astEvaluate(s.key, i, n, null);
                if (isArray(t)) {
                    if (r === "length" && !isNaN(l)) {
                        t.splice(l);
                        return l;
                    }
                    if (e.isArrayIndex(r)) {
                        t.splice(r, 1, l);
                        return l;
                    }
                }
                return t[r] = l;
            }

          case k:
            astAssign(s.value, i, n, l);
            return astAssign(s.target, i, n, l);

          case B:
            {
                const t = n?.getConverter?.(s.name);
                if (t == null) {
                    throw createMappedError(103, s.name);
                }
                if ("fromView" in t) {
                    l = t.fromView(l, ...s.args.map((t => astEvaluate(t, i, n, null))));
                }
                return astAssign(s.expression, i, n, l);
            }

          case S:
            return astAssign(s.expression, i, n, l);

          case M:
          case D:
            {
                const t = s.list;
                const e = t.length;
                let r;
                let a;
                for (r = 0; r < e; r++) {
                    a = t[r];
                    switch (a.$kind) {
                      case q:
                        astAssign(a, i, n, l);
                        break;

                      case M:
                      case D:
                        {
                            if (typeof l !== "object" || l === null) {
                                throw createMappedError(112);
                            }
                            let t = astEvaluate(a.source, Scope.create(l), n, null);
                            if (t === void 0 && a.initializer) {
                                t = astEvaluate(a.initializer, i, n, null);
                            }
                            astAssign(a, i, n, t);
                            break;
                        }
                    }
                }
                break;
            }

          case q:
            {
                if (s instanceof t.DestructuringAssignmentSingleExpression) {
                    if (l == null) {
                        return;
                    }
                    if (typeof l !== "object") {
                        throw createMappedError(112);
                    }
                    let t = astEvaluate(s.source, Scope.create(l), n, null);
                    if (t === void 0 && s.initializer) {
                        t = astEvaluate(s.initializer, i, n, null);
                    }
                    astAssign(s.target, i, n, t);
                } else {
                    if (l == null) {
                        return;
                    }
                    if (typeof l !== "object") {
                        throw createMappedError(112);
                    }
                    const t = s.indexOrProperties;
                    let r;
                    if (e.isArrayIndex(t)) {
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
                    astAssign(s.target, i, n, r);
                }
                break;
            }

          case I:
            return s.assign(i, n, l);

          default:
            return void 0;
        }
    }
    function astBind(t, e, s) {
        switch (t.$kind) {
          case S:
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

          case B:
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

          case T:
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
          case S:
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

          case B:
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

          case T:
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
    const _ = "at map filter includes indexOf lastIndexOf findIndex find flat flatMap join reduce reduceRight slice every some sort".split(" ");
    return {
        astEvaluate: astEvaluate,
        astAssign: astAssign,
        astBind: astBind,
        astUnbind: astUnbind
    };
})();

const {default: D, oneTime: q, toView: I, fromView: P, twoWay: _} = i.BindingMode;

const V = n.Metadata.get;

const F = n.Metadata.has;

const O = n.Metadata.define;

const {annotation: H} = e.Protocol;

const $ = H.keyFor;

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
        const r = e.metadata[N] ??= createLookup();
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

const N = /*@__PURE__*/ $("bindables");

const W = f({
    name: N,
    keyFrom: t => `${N}:${t}`,
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
                g(t).forEach((e => addDescription(e, t[e])));
            }
        }
        t.forEach(addList);
        return e;
    },
    getAll(t) {
        const s = [];
        const i = e.getPrototypeChain(t);
        let n = i.length;
        let r;
        while (--n >= 0) {
            r = i[n];
            const t = V(N, r);
            if (t == null) continue;
            s.push(...Object.values(t));
        }
        return s;
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
    static create(t, s = {}) {
        const n = s.mode ?? I;
        return new BindableDefinition(s.attribute ?? e.kebabCase(t), s.callback ?? `${t}Changed`, isString(n) ? i.BindingMode[n] ?? D : n, s.primary ?? false, s.name ?? t, s.set ?? getInterceptor(s));
    }
}

function coercer(t, e) {
    e.addInitializer((function() {
        j.define(this, e.name);
    }));
}

const j = {
    key: /*@__PURE__*/ $("coercer"),
    define(t, e) {
        O(t[e].bind(t), t, j.key);
    },
    for(t) {
        return V(j.key, t);
    }
};

function getInterceptor(t = {}) {
    const s = t.type ?? null;
    if (s == null) {
        return e.noop;
    }
    let i;
    switch (s) {
      case Number:
      case Boolean:
      case String:
      case BigInt:
        i = s;
        break;

      default:
        {
            const t = s.coerce;
            i = typeof t === "function" ? t.bind(s) : j.for(s) ?? e.noop;
            break;
        }
    }
    return i === e.noop ? i : createCoercer(i, t.nullable);
}

function createCoercer(t, e) {
    return function(s, i) {
        if (!i?.enableCoercion) return s;
        return (e ?? (i?.coerceNullish ?? false ? false : true)) && s == null ? s : t(s, i);
    };
}

const z = e.DI.createInterface;

const U = e.Registration.singleton;

const G = e.Registration.aliasTo;

const K = e.Registration.instance;

e.Registration.callback;

e.Registration.transient;

const registerResolver = (t, e, s) => t.registerResolver(e, s);

function alias(...t) {
    return function(e, s) {
        s.addInitializer((function() {
            const e = $("aliases");
            const s = V(e, this);
            if (s === void 0) {
                O(t, this, e);
            } else {
                s.push(...t);
            }
        }));
    };
}

function registerAliases(t, s, i, n) {
    for (let r = 0, l = t.length; r < l; ++r) {
        e.Registration.aliasTo(i, s.keyFrom(t[r])).register(n);
    }
}

const X = "custom-element";

const Q = "custom-attribute";

const getDefinitionFromStaticAu = (t, e, s, i = "__au_static_resource__") => {
    let n = V(i, t);
    if (n == null) {
        if (t.$au?.type === e) {
            n = s(t.$au, t);
            O(n, t, i);
        }
    }
    return n;
};

function bindingBehavior(t) {
    return function(e, s) {
        s.addInitializer((function() {
            J.define(t, this);
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
    static create(t, s) {
        let i;
        let n;
        if (isString(t)) {
            i = t;
            n = {
                name: i
            };
        } else {
            i = t.name;
            n = t;
        }
        return new BindingBehaviorDefinition(s, e.firstDefined(getBehaviorAnnotation(s, "name"), i), e.mergeArrays(getBehaviorAnnotation(s, "aliases"), n.aliases, s.aliases), J.keyFrom(i));
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getBindingBehaviorKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : U(s, s), G(s, i), ...n.map((t => G(s, getBindingBehaviorKeyFrom(t)))));
        }
    }
}

const Y = "binding-behavior";

const Z = /*@__PURE__*/ e.getResourceKeyFor(Y);

const getBehaviorAnnotation = (t, e) => V($(e), t);

const getBindingBehaviorKeyFrom = t => `${Z}:${t}`;

const J = /*@__PURE__*/ f({
    name: Z,
    keyFrom: getBindingBehaviorKeyFrom,
    isType(t) {
        return isFunction(t) && (F(Z, t) || t.$au?.type === Y);
    },
    define(t, s) {
        const i = BindingBehaviorDefinition.create(t, s);
        const n = i.Type;
        O(i, n, Z, e.resourceBaseName);
        return n;
    },
    getDefinition(t) {
        const e = V(Z, t) ?? getDefinitionFromStaticAu(t, Y, BindingBehaviorDefinition.create);
        if (e === void 0) {
            throw createMappedError(151, t);
        }
        return e;
    },
    find(t, e) {
        const s = t.find(Y, e);
        return s == null ? null : V(Z, s) ?? getDefinitionFromStaticAu(s, Y, BindingBehaviorDefinition.create) ?? null;
    },
    get(t, s) {
        return t.get(e.resource(getBindingBehaviorKeyFrom(s)));
    }
});

const tt = new Map;

const createConfig = t => ({
    type: Y,
    name: t
});

class BindingModeBehavior {
    bind(t, e) {
        tt.set(e, e.mode);
        e.mode = this.mode;
    }
    unbind(t, e) {
        e.mode = tt.get(e);
        tt.delete(e);
    }
}

class OneTimeBindingBehavior extends BindingModeBehavior {
    get mode() {
        return q;
    }
}

OneTimeBindingBehavior.$au = createConfig("oneTime");

class ToViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return I;
    }
}

ToViewBindingBehavior.$au = createConfig("toView");

class FromViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return P;
    }
}

FromViewBindingBehavior.$au = createConfig("fromView");

class TwoWayBindingBehavior extends BindingModeBehavior {
    get mode() {
        return _;
    }
}

TwoWayBindingBehavior.$au = createConfig("twoWay");

const et = new WeakMap;

const st = 200;

class DebounceBindingBehavior {
    constructor() {
        this.p = e.resolve(e.IPlatform);
    }
    bind(t, s, i, n) {
        const r = {
            type: "debounce",
            delay: i ?? st,
            now: this.p.performanceNow,
            queue: this.p.taskQueue,
            signals: isString(n) ? [ n ] : n ?? e.emptyArray
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

DebounceBindingBehavior.$au = {
    type: Y,
    name: "debounce"
};

const it = /*@__PURE__*/ z("ISignaler", (t => t.singleton(Signaler)));

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
        this.h = e.resolve(it);
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
    type: Y,
    name: "signal"
};

const nt = new WeakMap;

const rt = 200;

class ThrottleBindingBehavior {
    constructor() {
        ({performanceNow: this.u, taskQueue: this.C} = e.resolve(e.IPlatform));
    }
    bind(t, s, i, n) {
        const r = {
            type: "throttle",
            delay: i ?? rt,
            now: this.u,
            queue: this.C,
            signals: isString(n) ? [ n ] : n ?? e.emptyArray
        };
        const l = s.limit?.(r);
        if (l == null) ; else {
            nt.set(s, l);
        }
    }
    unbind(t, e) {
        nt.get(e)?.dispose();
        nt.delete(e);
    }
}

ThrottleBindingBehavior.$au = {
    type: Y,
    name: "throttle"
};

const ot = /*@__PURE__*/ z("IAppTask");

class $AppTask {
    constructor(t, e, s) {
        this.c = void 0;
        this.slot = t;
        this.k = e;
        this.cb = s;
    }
    register(t) {
        return this.c = t.register(K(ot, this));
    }
    run() {
        const t = this.k;
        const e = this.cb;
        return t === null ? e() : e(this.c.get(t));
    }
}

const lt = f({
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

const at = e.IPlatform;

function watch(t, e) {
    if (t == null) {
        throw createMappedError(772);
    }
    return function decorator(s, i) {
        const n = i.kind === "class";
        if (n) {
            if (!isFunction(e) && (e == null || !(e in s.prototype))) {
                throw createMappedError(773, `${h(e)}@${s.name}}`);
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
            ht.add(t, r);
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

const ht = /*@__PURE__*/ (() => {
    const t = new WeakMap;
    return f({
        add(e, s) {
            let i = t.get(e);
            if (i == null) {
                t.set(e, i = []);
            }
            i.push(s);
        },
        getDefinitions(s) {
            return t.get(s) ?? e.emptyArray;
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
        return Q;
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
    static create(t, s) {
        let n;
        let r;
        if (isString(t)) {
            n = t;
            r = {
                name: n
            };
        } else {
            n = t.name;
            r = t;
        }
        const l = e.firstDefined(getAttributeAnnotation(s, "defaultBindingMode"), r.defaultBindingMode, s.defaultBindingMode, I);
        return new CustomAttributeDefinition(s, e.firstDefined(getAttributeAnnotation(s, "name"), n), e.mergeArrays(getAttributeAnnotation(s, "aliases"), r.aliases, s.aliases), getAttributeKeyFrom(n), isString(l) ? i.BindingMode[l] ?? D : l, e.firstDefined(getAttributeAnnotation(s, "isTemplateController"), r.isTemplateController, s.isTemplateController, false), W.from(...W.getAll(s), getAttributeAnnotation(s, "bindables"), s.bindables, r.bindables), e.firstDefined(getAttributeAnnotation(s, "noMultiBindings"), r.noMultiBindings, s.noMultiBindings, false), e.mergeArrays(ht.getDefinitions(s), s.watches), e.mergeArrays(getAttributeAnnotation(s, "dependencies"), r.dependencies, s.dependencies), e.firstDefined(getAttributeAnnotation(s, "containerStrategy"), r.containerStrategy, s.containerStrategy, "reuse"));
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getAttributeKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : U(s, s), G(s, i), ...n.map((t => G(s, getAttributeKeyFrom(t)))));
        }
    }
    toString() {
        return `au:ca:${this.name}`;
    }
}

const ct = "custom-attribute";

const ut = /*@__PURE__*/ e.getResourceKeyFor(ct);

const getAttributeKeyFrom = t => `${ut}:${t}`;

const getAttributeAnnotation = (t, e) => V($(e), t);

const isAttributeType = t => isFunction(t) && (F(ut, t) || t.$au?.type === ct);

const findAttributeControllerFor = (t, e) => getRef(t, getAttributeKeyFrom(e)) ?? void 0;

const defineAttribute = (t, s) => {
    const i = CustomAttributeDefinition.create(t, s);
    const n = i.Type;
    O(i, n, ut, e.resourceBaseName);
    return n;
};

const getAttributeDefinition = t => {
    const e = V(ut, t) ?? getDefinitionFromStaticAu(t, ct, CustomAttributeDefinition.create);
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

const ft = /*@__PURE__*/ f({
    name: ut,
    keyFrom: getAttributeKeyFrom,
    isType: isAttributeType,
    for: findAttributeControllerFor,
    closest: findClosestControllerByName,
    define: defineAttribute,
    getDefinition: getAttributeDefinition,
    annotate(t, e, s) {
        O(s, t, $(e));
    },
    getAnnotation: getAttributeAnnotation,
    find(t, e) {
        const s = t.find(ct, e);
        return s === null ? null : V(ut, s) ?? getDefinitionFromStaticAu(s, ct, CustomAttributeDefinition.create) ?? null;
    }
});

const dt = /*@__PURE__*/ z("ILifecycleHooks");

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
        while (i !== c) {
            for (const t of p(i)) {
                if (t !== "constructor" && !t.startsWith("_")) {
                    s.add(t);
                }
            }
            i = Object.getPrototypeOf(i);
        }
        return new LifecycleHooksDefinition(e, s);
    }
}

const pt = /*@__PURE__*/ (() => {
    const t = new WeakMap;
    const s = new WeakMap;
    return f({
        define(t, i) {
            const n = LifecycleHooksDefinition.create(t, i);
            const r = n.Type;
            s.set(r, n);
            return e.Registrable.define(r, (t => {
                U(dt, r).register(t);
            }));
        },
        resolve(e) {
            let i = t.get(e);
            if (i === void 0) {
                t.set(e, i = new LifecycleHooksLookupImpl);
                const n = e.root;
                const r = n === e ? e.getAll(dt) : e.has(dt, false) ? n.getAll(dt).concat(e.getAll(dt)) : n.getAll(dt);
                let l;
                let a;
                let h;
                let c;
                let u;
                for (l of r) {
                    a = s.get(l.constructor);
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
        return pt.define({}, t);
    }
    return t == null ? decorator : decorator(t);
}

function valueConverter(t) {
    return function(e, s) {
        s.addInitializer((function() {
            xt.define(t, this);
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
    static create(t, s) {
        let i;
        let n;
        if (isString(t)) {
            i = t;
            n = {
                name: i
            };
        } else {
            i = t.name;
            n = t;
        }
        return new ValueConverterDefinition(s, e.firstDefined(getConverterAnnotation(s, "name"), i), e.mergeArrays(getConverterAnnotation(s, "aliases"), n.aliases, s.aliases), xt.keyFrom(i));
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getValueConverterKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : U(s, s), G(s, i), ...n.map((t => G(s, getValueConverterKeyFrom(t)))));
        }
    }
}

const gt = "value-converter";

const mt = /*@__PURE__*/ e.getResourceKeyFor(gt);

const getConverterAnnotation = (t, e) => V($(e), t);

const getValueConverterKeyFrom = t => `${mt}:${t}`;

const xt = f({
    name: mt,
    keyFrom: getValueConverterKeyFrom,
    isType(t) {
        return isFunction(t) && (F(mt, t) || t.$au?.type === gt);
    },
    define(t, s) {
        const i = ValueConverterDefinition.create(t, s);
        const n = i.Type;
        O(i, n, mt, e.resourceBaseName);
        return n;
    },
    getDefinition(t) {
        const e = V(mt, t) ?? getDefinitionFromStaticAu(t, gt, ValueConverterDefinition.create);
        if (e === void 0) {
            throw createMappedError(152, t);
        }
        return e;
    },
    annotate(t, e, s) {
        O(s, t, $(e));
    },
    getAnnotation: getConverterAnnotation,
    find(t, e) {
        const s = t.find(gt, e);
        return s == null ? null : V(mt, s) ?? getDefinitionFromStaticAu(s, gt, ValueConverterDefinition.create) ?? null;
    },
    get(t, s) {
        return t.get(e.resource(getValueConverterKeyFrom(s)));
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
        if (t !== T(s.ast, s.s, s, null)) {
            this.v = t;
            this.B.add(this);
        }
    }
}

const vt = /*@__PURE__*/ (() => {
    function useScope(t) {
        this.s = t;
    }
    return t => {
        defineHiddenProp(t.prototype, "useScope", useScope);
    };
})();

const bt = /*@__PURE__*/ (() => {
    const t = new WeakMap;
    const e = new WeakMap;
    function evaluatorGet(t) {
        return this.l.get(t);
    }
    function evaluatorGetSignaler() {
        return this.l.root.get(it);
    }
    function evaluatorGetConverter(e) {
        let s = t.get(this);
        if (s == null) {
            t.set(this, s = new ResourceLookup);
        }
        return s[e] ??= xt.get(this.l, e);
    }
    function evaluatorGetBehavior(t) {
        let s = e.get(this);
        if (s == null) {
            e.set(this, s = new ResourceLookup);
        }
        return s[t] ??= J.get(this.l, t);
    }
    return (t, e = true) => s => {
        const i = s.prototype;
        if (t != null) {
            v(i, "strict", {
                enumerable: true,
                get: function() {
                    return t;
                }
            });
        }
        v(i, "strictFnCall", {
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

const wt = /*@__PURE__*/ z("IFlushQueue", (t => t.singleton(FlushQueue)));

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

const yt = /*@__PURE__*/ (() => {
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
            l = i?.status === C;
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
            h = i?.status === C;
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
            const r = n.length > 0 ? this.get(it) : null;
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

const kt = ((t = new WeakSet) => e => function() {
    if (!t.has(this)) {
        t.add(this);
        e.call(this);
    }
})();

const Ct = {
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
                let n = h(t);
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
                    e.setAttribute(s, h(t));
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
        const e = T(this.ast, this.s, this, (this.mode & I) > 0 ? this : null);
        this.obs.clear();
        if (e !== this.v) {
            this.v = e;
            const s = this.L.state !== Pe;
            if (s) {
                t = this.T;
                this.T = this.C.queueTask((() => {
                    this.T = null;
                    this.updateTarget(e);
                }), Ct);
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
        L(this.ast, t, this);
        if (this.mode & (I | q)) {
            this.updateTarget(this.v = T(this.ast, t, this, (this.mode & I) > 0 ? this : null));
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        M(this.ast, this.s, this);
        this.s = void 0;
        this.v = void 0;
        this.T?.cancel();
        this.T = null;
        this.obs.clearAll();
    }
}

AttributeBinding.mix = kt((() => {
    vt(AttributeBinding);
    yt(AttributeBinding, (() => "updateTarget"));
    s.connectable(AttributeBinding, null);
    bt(true)(AttributeBinding);
}));

const Bt = {
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
    q() {
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
        const l = this.L.state !== Pe && (r.type & R) > 0;
        let a;
        if (l) {
            a = this.T;
            this.T = this.C.queueTask((() => {
                this.T = null;
                r.setValue(i, this.target, this.targetProperty);
            }), Bt);
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
        this.mode = I;
        this.task = null;
        this.isBound = false;
        this.v = "";
        this.boundFn = false;
        this.l = i;
        this.oL = n;
    }
    updateTarget() {
        this.owner.q();
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = T(this.ast, this.s, this, (this.mode & I) > 0 ? this : null);
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
        L(this.ast, t, this);
        this.v = T(this.ast, this.s, this, (this.mode & I) > 0 ? this : null);
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
        M(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

InterpolationPartBinding.mix = kt((() => {
    vt(InterpolationPartBinding);
    yt(InterpolationPartBinding, (() => "updateTarget"));
    s.connectable(InterpolationPartBinding, null);
    bt(true)(InterpolationPartBinding);
}));

const St = {
    reusable: false,
    preempt: true
};

class ContentBinding {
    constructor(t, e, s, i, n, r, l) {
        this.p = n;
        this.ast = r;
        this.target = l;
        this.isBound = false;
        this.mode = I;
        this.T = null;
        this.v = "";
        this.I = false;
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
        if (this.I) {
            s.parentNode?.removeChild(s);
            this.I = false;
        }
        if (t instanceof this.p.Node) {
            e.parentNode?.insertBefore(t, e);
            t = "";
            this.I = true;
        }
        e.textContent = h(t ?? "");
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = T(this.ast, this.s, this, (this.mode & I) > 0 ? this : null);
        this.obs.clear();
        if (t === this.v) {
            this.T?.cancel();
            this.T = null;
            return;
        }
        const e = this.L.state !== Pe;
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
        const t = this.v = T(this.ast, this.s, this, (this.mode & I) > 0 ? this : null);
        this.obs.clear();
        if (isArray(t)) {
            this.observeCollection(t);
        }
        const e = this.L.state !== Pe;
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
        L(this.ast, t, this);
        const e = this.v = T(this.ast, this.s, this, (this.mode & I) > 0 ? this : null);
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
        M(this.ast, this.s, this);
        if (this.I) {
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
        }), St);
        e?.cancel();
    }
}

ContentBinding.mix = kt((() => {
    vt(ContentBinding);
    yt(ContentBinding, (() => "updateTarget"));
    s.connectable(ContentBinding, null);
    bt(void 0, false)(ContentBinding);
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
        this.v = T(this.ast, this.s, this, this);
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
        L(this.ast, t, this);
        this.v = T(this.ast, this.s, this, this);
        this.updateTarget();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        M(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

LetBinding.mix = kt((() => {
    vt(LetBinding);
    yt(LetBinding, (() => "updateTarget"));
    s.connectable(LetBinding, null);
    bt(true)(LetBinding);
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
        this.V = null;
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
        E(this.ast, this.s, this, t);
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = T(this.ast, this.s, this, (this.mode & I) > 0 ? this : null);
        this.obs.clear();
        const e = this.L.state !== Pe && (this.M.type & R) > 0;
        if (e) {
            At = this.T;
            this.T = this.C.queueTask((() => {
                this.updateTarget(t);
                this.T = null;
            }), Rt);
            At?.cancel();
            At = null;
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
        L(this.ast, t, this);
        const e = this.oL;
        const s = this.mode;
        let i = this.M;
        if (!i) {
            if (s & P) {
                i = e.getObserver(this.target, this.targetProperty);
            } else {
                i = e.getAccessor(this.target, this.targetProperty);
            }
            this.M = i;
        }
        const n = (s & I) > 0;
        if (s & (I | q)) {
            this.updateTarget(T(this.ast, this.s, this, n ? this : null));
        }
        if (s & P) {
            i.subscribe(this.V ??= new BindingTargetSubscriber(this, this.l.get(wt)));
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
        M(this.ast, this.s, this);
        this.s = void 0;
        if (this.V) {
            this.M.unsubscribe(this.V);
            this.V = null;
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
        if (this.V != null) {
            throw createMappedError(9995);
        }
        this.V = t;
    }
}

PropertyBinding.mix = kt((() => {
    vt(PropertyBinding);
    yt(PropertyBinding, (t => t.mode & P ? "updateSource" : "updateTarget"));
    s.connectable(PropertyBinding, null);
    bt(true, false)(PropertyBinding);
}));

let At = null;

const Rt = {
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
        L(this.ast, t, this);
        E(this.ast, this.s, this, this.target);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        if (T(this.ast, this.s, this, null) === this.target) {
            E(this.ast, this.s, this, null);
        }
        M(this.ast, this.s, this);
        this.s = void 0;
    }
}

RefBinding.mix = kt((() => {
    bt(false)(RefBinding);
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
        this.F = null;
        this.l = t;
        this.O = n;
        this.F = r;
    }
    callSource(t) {
        const e = this.s.overrideContext;
        e.$event = t;
        let s = T(this.ast, this.s, this, null);
        delete e.$event;
        if (isFunction(s)) {
            s = s(t);
        }
        if (s !== true && this.O.prevent) {
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
        if (this.F?.(t) !== false) {
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
        L(this.ast, t, this);
        this.target.addEventListener(this.targetEvent, this, this.O);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        M(this.ast, this.s, this);
        this.s = void 0;
        this.target.removeEventListener(this.targetEvent, this, this.O);
    }
}

ListenerBinding.mix = kt((function() {
    vt(ListenerBinding);
    yt(ListenerBinding, (() => "callSource"));
    bt(true, true)(ListenerBinding);
}));

const Et = /*@__PURE__*/ z("IEventModifier");

const Tt = /*@__PURE__*/ z("IKeyMapping", (t => t.instance({
    meta: f([ "ctrl", "alt", "shift", "meta" ]),
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
        this.H = e.resolve(Tt);
        this.$ = [ "left", "middle", "right" ];
    }
    static register(t) {
        t.register(U(Et, ModifiedMouseEventHandler));
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
        this.H = e.resolve(Tt);
        this.type = [ "keydown", "keyup" ];
    }
    static register(t) {
        t.register(U(Et, ModifiedKeyboardEventHandler));
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

const Lt = /*@__PURE__*/ z("IEventModifierHandler", (t => t.instance({
    getHandler: () => null
})));

class EventModifier {
    constructor() {
        this.N = e.resolve(e.all(Et)).reduce(((t, e) => {
            const s = isArray(e.type) ? e.type : [ e.type ];
            s.forEach((s => t[s] = e));
            return t;
        }), {});
    }
    static register(t) {
        t.register(U(Lt, EventModifier));
    }
    getHandler(t, e) {
        return isString(e) ? this.N[t]?.getHandler(e) ?? null : null;
    }
}

const Mt = {
    register(t) {
        t.register(EventModifier, ModifiedMouseEventHandler, ModifiedKeyboardEventHandler);
    }
};

const Dt = /*@__PURE__*/ z("IViewFactory");

class ViewFactory {
    constructor(t, e) {
        this.isCaching = false;
        this.W = null;
        this.j = -1;
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
            if (this.j === -1 || !e) {
                this.j = t;
            }
        }
        if (this.j > 0) {
            this.W = [];
        } else {
            this.W = null;
        }
        this.isCaching = this.j > 0;
    }
    canReturnToCache(t) {
        return this.W != null && this.W.length < this.j;
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

const qt = /*@__PURE__*/ (() => {
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

const It = "default";

const Pt = "au-slot";

const _t = /*@__PURE__*/ z("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

const Vt = /*@__PURE__*/ z("IAuSlotWatcher");

class AuSlotWatcherBinding {
    constructor(t, s, i, n) {
        this.U = new Set;
        this.G = e.emptyArray;
        this.isBound = false;
        this.cb = (this.o = t)[s];
        this.slotName = i;
        this.K = n;
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
        K(dt, this).register(t);
    }
    hydrating(t, e) {
        const s = this.X;
        const i = new AuSlotWatcherBinding(t, s.callback ?? `${h(s.name)}Changed`, s.slotName ?? "default", s.query ?? "*");
        v(t, s.name, {
            enumerable: true,
            configurable: true,
            get: d((() => i.getValue()), {
                getObserver: () => i
            }),
            set: () => {}
        });
        K(Vt, i).register(e.container);
        e.addBinding(i);
    }
}

function slotted(t, e) {
    if (!Ft) {
        Ft = true;
        s.subscriberCollection(AuSlotWatcherBinding, null);
        lifecycleHooks()(SlottedLifecycleHooks, null);
    }
    const i = $("dependencies");
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

let Ft = false;

class SpreadBinding {
    static create(t, s, n, r, l, a, h, c) {
        const u = [];
        const f = r.renderers;
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
            const r = getHydrationContext(t);
            const d = new SpreadBinding(r);
            const p = l.compileSpread(r.controller.definition, r.instruction?.captures ?? e.emptyArray, r.controller.container, s, n);
            let g;
            for (g of p) {
                switch (g.type) {
                  case i.InstructionType.spreadTransferedBinding:
                    renderSpreadInstruction(t + 1);
                    break;

                  case i.InstructionType.spreadElementProp:
                    f[g.instruction.type].render(d, findElementControllerFor(s), g.instruction, a, h, c);
                    break;

                  default:
                    f[g.type].render(d, s, g, a, h, c);
                }
            }
            u.push(d);
        };
        renderSpreadInstruction(0);
        return u;
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
        if (t.vmKind !== De) {
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
        this.J = {};
        this.tt = new WeakMap;
        this.L = t;
        this.oL = n;
        this.l = r;
        this.C = l;
    }
    updateTarget() {
        this.obs.version++;
        const t = T(this.ast, this.s, this, this);
        this.obs.clear();
        this.et(t, true);
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
        }
        this.isBound = true;
        this.s = t;
        L(this.ast, t, this);
        const e = T(this.ast, t, this, this);
        this.et(e, false);
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        M(this.ast, this.s, this);
        this.s = void 0;
        let t;
        for (t in this.J) {
            this.J[t].unbind();
        }
    }
    et(e, s) {
        if (e == null) {
            e = {};
        } else if (!isObject(e)) {
            e = {};
        }
        let n;
        let r;
        let l = this.tt.get(e);
        if (l == null) {
            this.tt.set(e, l = Scope.fromParent(this.s, e));
        }
        for (n of this.targetKeys) {
            r = this.J[n];
            if (n in e) {
                if (r == null) {
                    r = this.J[n] = new PropertyBinding(this.L, this.l, this.oL, this.C, SpreadValueBinding.st[n] ??= new t.AccessScopeExpression(n, 0), this.target, n, i.BindingMode.toView);
                }
                r.bind(l);
            } else if (s) {
                r?.unbind();
            }
        }
    }
}

SpreadValueBinding.mix = kt((() => {
    vt(SpreadValueBinding);
    yt(SpreadValueBinding, (() => "updateTarget"));
    s.connectable(SpreadValueBinding, null);
    bt(true, false)(SpreadValueBinding);
}));

SpreadValueBinding.st = {};

const Ot = /*@__PURE__*/ z("IRenderer");

function renderer(t, s) {
    return e.Registrable.define(t, (function(t) {
        U(Ot, this).register(t);
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

const Ht = /*@__PURE__*/ renderer(class SetPropertyRenderer {
    constructor() {
        this.target = i.InstructionType.setProperty;
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

const $t = /*@__PURE__*/ renderer(class CustomElementRenderer {
    constructor() {
        this.r = e.resolve(fe);
        this.target = i.InstructionType.hydrateElement;
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
            l = ls.find(f, c);
            if (l == null) {
                throw createMappedError(752, s, t);
            }
            break;

          default:
            l = c;
        }
        const d = s.containerless || l.containerless;
        const p = d ? convertToRenderLocation(e) : null;
        const m = createElementContainer(i, t, e, s, p, u == null ? void 0 : new AuSlotsInfo(g(u)));
        a = m.invoke(l.Type);
        h = Controller.$el(m, a, e, s, l, p);
        setRef(e, l.key, h);
        const x = this.r.renderers;
        const v = s.props;
        const b = v.length;
        let w = 0;
        let y;
        while (b > w) {
            y = v[w];
            x[y.type].render(t, h, y, i, n, r);
            ++w;
        }
        t.addChild(h);
    }
});

const Nt = /*@__PURE__*/ renderer(class CustomAttributeRenderer {
    constructor() {
        this.r = e.resolve(fe);
        this.target = i.InstructionType.hydrateAttribute;
    }
    render(t, e, s, i, n, r) {
        let l = t.container;
        let a;
        switch (typeof s.res) {
          case "string":
            a = ft.find(l, s.res);
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
        let g;
        while (d > p) {
            g = f[p];
            u[g.type].render(t, c, g, i, n, r);
            ++p;
        }
        t.addChild(c);
    }
});

const Wt = /*@__PURE__*/ renderer(class TemplateControllerRenderer {
    constructor() {
        this.r = e.resolve(fe);
        this.target = i.InstructionType.hydrateTemplateController;
    }
    render(t, e, s, i, n, r) {
        let l = t.container;
        let a;
        switch (typeof s.res) {
          case "string":
            a = ft.find(l, s.res);
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
        const p = s.props;
        const g = p.length;
        let m = 0;
        let x;
        while (g > m) {
            x = p[m];
            d[x.type].render(t, f, x, i, n, r);
            ++m;
        }
        t.addChild(f);
    }
});

const jt = /*@__PURE__*/ renderer(class LetElementRenderer {
    constructor() {
        this.target = i.InstructionType.hydrateLetElement;
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
            f = ensureExpression(n, u.from, k);
            t.addBinding(new LetBinding(h, r, f, u.to, a));
            ++d;
        }
    }
});

const zt = /*@__PURE__*/ renderer(class RefBindingRenderer {
    constructor() {
        this.target = i.InstructionType.refBinding;
    }
    render(t, e, s, i, n) {
        t.addBinding(new RefBinding(t.container, ensureExpression(n, s.from, k), getRefTarget(e, s.to)));
    }
});

const Ut = /*@__PURE__*/ renderer(class InterpolationBindingRenderer {
    constructor() {
        this.target = i.InstructionType.interpolation;
        InterpolationPartBinding.mix();
    }
    render(t, e, s, i, n, r) {
        t.addBinding(new InterpolationBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, b), getTarget(e), s.to, I));
    }
});

const Gt = /*@__PURE__*/ renderer(class PropertyBindingRenderer {
    constructor() {
        this.target = i.InstructionType.propertyBinding;
        PropertyBinding.mix();
    }
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, k), getTarget(e), s.to, s.mode));
    }
});

const Kt = /*@__PURE__*/ renderer(class IteratorBindingRenderer {
    constructor() {
        this.target = i.InstructionType.iteratorBinding;
        PropertyBinding.mix();
    }
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.forOf, w), getTarget(e), s.to, I));
    }
});

const Xt = /*@__PURE__*/ renderer(class TextBindingRenderer {
    constructor() {
        this.target = i.InstructionType.textBinding;
        ContentBinding.mix();
    }
    render(t, e, s, i, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, i.domWriteQueue, i, ensureExpression(n, s.from, k), e));
    }
});

const Qt = z("IListenerBindingOptions", (t => t.instance({
    prevent: false
})));

const Yt = /*@__PURE__*/ renderer(class ListenerBindingRenderer {
    constructor() {
        this.target = i.InstructionType.listenerBinding;
        this.it = e.resolve(Lt);
        this.nt = e.resolve(Qt);
        ListenerBinding.mix();
    }
    render(t, e, s, i, n) {
        t.addBinding(new ListenerBinding(t.container, ensureExpression(n, s.from, y), e, s.to, new ListenerBindingOptions(this.nt.prevent, s.capture), this.it.getHandler(s.to, s.modifier)));
    }
});

const Zt = /*@__PURE__*/ renderer(class SetAttributeRenderer {
    constructor() {
        this.target = i.InstructionType.setAttribute;
    }
    render(t, e, s) {
        e.setAttribute(s.to, s.value);
    }
});

const Jt = /*@__PURE__*/ renderer(class SetClassAttributeRenderer {
    constructor() {
        this.target = i.InstructionType.setClassAttribute;
    }
    render(t, e, s) {
        addClasses(e.classList, s.value);
    }
});

const te = /*@__PURE__*/ renderer(class SetStyleAttributeRenderer {
    constructor() {
        this.target = i.InstructionType.setStyleAttribute;
    }
    render(t, e, s) {
        e.style.cssText += s.value;
    }
});

const ee = /*@__PURE__*/ renderer(class StylePropertyBindingRenderer {
    constructor() {
        this.target = i.InstructionType.stylePropertyBinding;
        PropertyBinding.mix();
    }
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, k), e.style, s.to, I));
    }
});

const se = /*@__PURE__*/ renderer(class AttributeBindingRenderer {
    constructor() {
        this.target = i.InstructionType.attributeBinding;
        AttributeBinding.mix();
    }
    render(t, e, s, i, n, r) {
        const l = t.container;
        const a = l.has(Qe, false) ? l.get(Qe) : null;
        t.addBinding(new AttributeBinding(t, l, r, i.domWriteQueue, ensureExpression(n, s.from, k), e, s.attr, a == null ? s.to : s.to.split(/\s/g).map((t => a[t] ?? t)).join(" "), I));
    }
});

const ie = /*@__PURE__*/ renderer(class SpreadRenderer {
    constructor() {
        this.rt = e.resolve(i.ITemplateCompiler);
        this.r = e.resolve(fe);
        this.target = i.InstructionType.spreadTransferedBinding;
    }
    render(t, e, s, i, n, r) {
        SpreadBinding.create(t.container.get(We), e, void 0, this.r, this.rt, i, n, r).forEach((e => t.addBinding(e)));
    }
});

const ne = /*@__PURE__*/ renderer(class SpreadValueRenderer {
    constructor() {
        this.target = i.InstructionType.spreadValueBinding;
        SpreadValueBinding.mix();
    }
    render(t, e, s, i, n, r) {
        const l = s.target;
        if (l === "$bindables") {
            t.addBinding(new SpreadValueBinding(t, e.viewModel, g(e.definition.bindables), n.parse(s.from, k), r, t.container, i.domWriteQueue));
        } else {
            throw createMappedError(820, l);
        }
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

const re = "IController";

const oe = "IInstruction";

const le = "IRenderLocation";

const ae = "ISlotsInfo";

function createElementContainer(t, s, n, r, l, a) {
    const h = s.container.createChild();
    registerHostNode(h, t, n);
    registerResolver(h, Ne, new e.InstanceProvider(re, s));
    registerResolver(h, i.IInstruction, new e.InstanceProvider(oe, r));
    registerResolver(h, Xe, l == null ? he : new RenderLocationProvider(l));
    registerResolver(h, Dt, ce);
    registerResolver(h, _t, a == null ? ue : new e.InstanceProvider(ae, a));
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

function invokeAttribute(t, s, n, r, l, a, h, c) {
    const u = n instanceof Controller ? n : n.$controller;
    const f = u.container.createChild();
    registerHostNode(f, t, r);
    registerResolver(f, Ne, new e.InstanceProvider(re, u));
    registerResolver(f, i.IInstruction, new e.InstanceProvider(oe, l));
    registerResolver(f, Xe, h == null ? he : new e.InstanceProvider(le, h));
    registerResolver(f, Dt, a == null ? ce : new ViewFactoryProvider(a));
    registerResolver(f, _t, c == null ? ue : new e.InstanceProvider(ae, c));
    return {
        vm: f.invoke(s.Type),
        ctn: f
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

const ce = new ViewFactoryProvider(null);

const ue = new e.InstanceProvider(ae, new AuSlotsInfo(e.emptyArray));

const fe = /*@__PURE__*/ z("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.ot ??= this.lt.getAll(Ot, false).reduce(((t, e) => {
            t[e.target] ??= e;
            return t;
        }), createLookup());
    }
    constructor() {
        this.ht = new WeakMap;
        this.ct = new WeakMap;
        const i = this.lt = e.resolve(e.IContainer).root;
        const n = this.p = i.get(at);
        this.ep = i.get(t.IExpressionParser);
        this.oL = i.get(s.IObserverLocator);
        this.ut = n.document.createElement("au-m");
        this.ft = new FragmentNodeSequence(n, n.document.createDocumentFragment());
    }
    compile(t, e) {
        const s = e.get(i.ITemplateCompiler);
        const n = this.ht;
        let r = n.get(t);
        if (r == null) {
            n.set(t, r = CustomElementDefinition.create(t.needsCompile ? s.compile(t, e) : t));
        }
        return r;
    }
    getViewFactory(t, e) {
        return new ViewFactory(e, CustomElementDefinition.getOrCreate(t));
    }
    createNodes(t) {
        if (t.enhance === true) {
            return new FragmentNodeSequence(this.p, this.dt(t.template));
        }
        let e;
        let s = false;
        const i = this.ct;
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
            this.dt(e);
            i.set(t, e);
        }
        return e == null ? this.ft : new FragmentNodeSequence(this.p, s ? r.importNode(e, true) : r.adoptNode(e.cloneNode(true)));
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
    dt(t) {
        if (t == null) {
            return null;
        }
        const e = this.p.document.createTreeWalker(t, 128);
        let s;
        while ((s = e.nextNode()) != null) {
            if (s.nodeValue === "au*") {
                s.parentNode.replaceChild(e.currentNode = this.ut.cloneNode(), s);
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
                addListener(this.gt, e, this);
            }
            this.xt = true;
            this.vt?.();
        }
    }));
    defineHiddenProp(s, "unsubscribe", (function(t) {
        if (this.subs.remove(t) && this.subs.count === 0) {
            for (e of this.cf.events) {
                removeListener(this.gt, e, this);
            }
            this.xt = false;
            this.bt?.();
        }
    }));
    defineHiddenProp(s, "useConfig", (function(t) {
        this.cf = t;
        if (this.xt) {
            for (e of this.cf.events) {
                removeListener(this.gt, e, this);
            }
            for (e of this.cf.events) {
                addListener(this.gt, e, this);
            }
        }
    }));
};

const mixinNoopSubscribable = t => {
    defineHiddenProp(t.prototype, "subscribe", e.noop);
    defineHiddenProp(t.prototype, "unsubscribe", e.noop);
};

class ClassAttributeAccessor {
    get doNotCache() {
        return true;
    }
    constructor(t) {
        this.obj = t;
        this.type = A | R;
        this.v = "";
        this.wt = {};
        this.yt = 0;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (t !== this.v) {
            this.v = t;
            this.kt();
        }
    }
    kt() {
        const t = this.wt;
        const e = ++this.yt;
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
                t[l] = this.yt;
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
        return e.emptyArray;
    }
    if (isArray(t)) {
        const s = t.length;
        if (s > 0) {
            const e = [];
            let i = 0;
            for (;s > i; ++i) {
                e.push(...getClassesToAdd(t[i]));
            }
            return e;
        } else {
            return e.emptyArray;
        }
    }
    const s = [];
    let i;
    for (i in t) {
        if (Boolean(t[i])) {
            if (i.includes(" ")) {
                s.push(...splitClassString(i));
            } else {
                s.push(i);
            }
        }
    }
    return s;
}

function splitClassString(t) {
    const s = t.match(/\S+/g);
    if (s === null) {
        return e.emptyArray;
    }
    return s;
}

function cssModules(...t) {
    return new CSSModulesProcessorRegistry(t);
}

class CSSModulesProcessorRegistry {
    constructor(t) {
        this.modules = t;
    }
    register(t) {
        const s = d({}, ...this.modules);
        const i = defineAttribute({
            name: "class",
            bindables: [ "value" ],
            noMultiBindings: true
        }, class CustomAttributeClass {
            constructor() {
                this.Ct = new ClassAttributeAccessor(e.resolve(Ge));
                this.value = "";
            }
            binding() {
                this.valueChanged();
            }
            valueChanged() {
                this.Ct.setValue(this.value?.split(/\s+/g).map((t => s[t] || t)) ?? "");
            }
        });
        t.register(i, K(Qe, s));
    }
}

function shadowCSS(...t) {
    return new ShadowDOMRegistry(t);
}

const de = /*@__PURE__*/ z("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
    if (AdoptedStyleSheetsStyles.supported(t.get(at))) {
        return t.get(AdoptedStyleSheetsStylesFactory);
    }
    return t.get(StyleElementStylesFactory);
}))));

class ShadowDOMRegistry {
    constructor(t) {
        this.css = t;
    }
    register(t) {
        const e = t.get(ge);
        const s = t.get(de);
        t.register(K(pe, s.createStyles(this.css, e)));
    }
}

class AdoptedStyleSheetsStylesFactory {
    constructor() {
        this.p = e.resolve(at);
        this.cache = new Map;
    }
    createStyles(t, e) {
        return new AdoptedStyleSheetsStyles(this.p, t, this.cache, e);
    }
}

class StyleElementStylesFactory {
    constructor() {
        this.p = e.resolve(at);
    }
    createStyles(t, e) {
        return new StyleElementStyles(this.p, t, e);
    }
}

const pe = /*@__PURE__*/ z("IShadowDOMStyles");

const ge = /*@__PURE__*/ z("IShadowDOMGlobalStyles", (t => t.instance({
    applyTo: e.noop
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
    shadowDOM(t) {
        return lt.creating(e.IContainer, (e => {
            if (t.sharedStyles != null) {
                const s = e.get(de);
                e.register(K(ge, s.createStyles(t.sharedStyles, null)));
            }
        }));
    }
};

const {enter: xe, exit: ve} = s.ConnectableSwitcher;

const {wrap: be, unwrap: we} = s.ProxyObservable;

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
        if (!x(s, e)) {
            this.cb.call(t, s, e, t);
        }
    }
    compute() {
        this.running = true;
        this.obs.version++;
        try {
            xe(this);
            return this.v = we(this.$get.call(void 0, this.useProxy ? be(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            ve(this);
        }
    }
}

(() => {
    s.connectable(ComputedWatcher, null);
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
            t = T(e, this.scope, this, this);
            this.obs.clear();
        }
        if (!x(t, i)) {
            this.v = t;
            this.cb.call(s, t, i, s);
        }
    }
    bind() {
        if (this.isBound) {
            return;
        }
        this.obs.version++;
        this.v = T(this.Bt, this.scope, this, this);
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
    s.connectable(ExpressionWatcher, null);
    bt(true)(ExpressionWatcher);
})();

class Controller {
    get lifecycleHooks() {
        return this.St;
    }
    get isActive() {
        return (this.state & (Pe | _e)) > 0 && (this.state & Ve) === 0;
    }
    get name() {
        if (this.parent === null) {
            switch (this.vmKind) {
              case De:
                return `[${this.definition.name}]`;

              case Me:
                return this.definition.name;

              case qe:
                return this.viewFactory.name;
            }
        }
        switch (this.vmKind) {
          case De:
            return `${this.parent.name}>[${this.definition.name}]`;

          case Me:
            return `${this.parent.name}>${this.definition.name}`;

          case qe:
            return this.viewFactory.name === this.parent.definition?.name ? `${this.parent.name}[view]` : `${this.parent.name}[view:${this.viewFactory.name}]`;
        }
    }
    get viewModel() {
        return this.At;
    }
    set viewModel(t) {
        this.At = t;
        this.Rt = t == null || this.vmKind === qe ? HooksDefinition.none : new HooksDefinition(t);
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
        this.Et = false;
        this.hostController = null;
        this.mountTarget = ke;
        this.shadowRoot = null;
        this.nodes = null;
        this.location = null;
        this.St = null;
        this.state = Ie;
        this.Tt = false;
        this.$initiator = null;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this.Lt = 0;
        this.Mt = 0;
        this.Dt = 0;
        this.At = n;
        this.Rt = e === qe ? HooksDefinition.none : new HooksDefinition(n);
        this.location = l;
        this.r = t.root.get(fe);
        this.coercion = e === qe ? void 0 : t.get(Ee);
    }
    static getCached(t) {
        return ye.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (e === void 0) {
            throw createMappedError(500, t);
        }
        return e;
    }
    static $el(t, s, i, n, r = void 0, l = null) {
        if (ye.has(s)) {
            return ye.get(s);
        }
        {
            r = r ?? getElementDefinition(s.constructor);
        }
        registerResolver(t, r.Type, new e.InstanceProvider(r.key, s, r.Type));
        const a = new Controller(t, Me, r, null, s, i, l);
        const h = t.get(e.optional(We));
        if (r.dependencies.length > 0) {
            t.register(...r.dependencies);
        }
        registerResolver(t, We, new e.InstanceProvider("IHydrationContext", new HydrationContext(a, n, h)));
        ye.set(s, a);
        if (n == null || n.hydrate !== false) {
            a.hE(n, h);
        }
        return a;
    }
    static $attr(t, s, i, n) {
        if (ye.has(s)) {
            return ye.get(s);
        }
        n = n ?? getAttributeDefinition(s.constructor);
        registerResolver(t, n.Type, new e.InstanceProvider(n.key, s, n.Type));
        const r = new Controller(t, De, n, null, s, i, null);
        if (n.dependencies.length > 0) {
            t.register(...n.dependencies);
        }
        ye.set(s, r);
        r.qt();
        return r;
    }
    static $view(t, e = void 0) {
        const s = new Controller(t.container, qe, null, t, null, null, null);
        s.parent = e ?? null;
        s.It();
        return s;
    }
    hE(t, s) {
        const i = this.container;
        const n = this.At;
        const r = this.definition;
        this.scope = Scope.create(n, null, true);
        if (r.watches.length > 0) {
            createWatchers(this, i, r, n);
        }
        createObservers(this, r, n);
        this.St = pt.resolve(i);
        i.register(r.Type);
        if (r.injectable !== null) {
            registerResolver(i, r.injectable, new e.InstanceProvider("definition.injectable", n));
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
        if (this.Rt.Pt) {
            this.At.hydrating(this);
        }
        const t = this.definition;
        const e = this._t = this.r.compile(t, this.container);
        const s = e.shadowOptions;
        const i = e.hasSlots;
        const n = e.containerless;
        let r = this.host;
        let l = this.location;
        if ((this.hostController = findElementControllerFor(r, Re)) !== null) {
            r = this.host = this.container.root.get(at).document.createElement(t.name);
            if (n && l == null) {
                l = this.location = convertToRenderLocation(r);
            }
        }
        setRef(r, ns, this);
        setRef(r, t.key, this);
        if (s !== null || i) {
            if (l != null) {
                throw createMappedError(501);
            }
            setRef(this.shadowRoot = r.attachShadow(s ?? Le), ns, this);
            setRef(this.shadowRoot, t.key, this);
            this.mountTarget = Be;
        } else if (l != null) {
            setRef(l, ns, this);
            setRef(l, t.key, this);
            this.mountTarget = Se;
        } else {
            this.mountTarget = Ce;
        }
        this.At.$controller = this;
        this.nodes = this.r.createNodes(e);
        if (this.St.hydrated !== void 0) {
            this.St.hydrated.forEach(callHydratedHook, this);
        }
        if (this.Rt.Vt) {
            this.At.hydrated(this);
        }
    }
    hC() {
        this.r.render(this, this.nodes.findTargets(), this._t, this.host);
        if (this.St.created !== void 0) {
            this.St.created.forEach(callCreatedHook, this);
        }
        if (this.Rt.Ft) {
            this.At.created(this);
        }
    }
    qt() {
        const t = this.definition;
        const e = this.At;
        if (t.watches.length > 0) {
            createWatchers(this, this.container, t, e);
        }
        createObservers(this, t, e);
        e.$controller = this;
        this.St = pt.resolve(this.container);
        if (this.St.created !== void 0) {
            this.St.created.forEach(callCreatedHook, this);
        }
        if (this.Rt.Ft) {
            this.At.created(this);
        }
    }
    It() {
        this._t = this.r.compile(this.viewFactory.def, this.container);
        this.r.render(this, (this.nodes = this.r.createNodes(this._t)).findTargets(), this._t, void 0);
    }
    activate(t, s, i) {
        switch (this.state) {
          case Ie:
          case Fe:
            if (!(s === null || s.isActive)) {
                return;
            }
            this.state = Pe;
            break;

          case _e:
            return;

          case He:
            throw createMappedError(502, this.name);

          default:
            throw createMappedError(503, this.name, stringifyState(this.state));
        }
        this.parent = s;
        switch (this.vmKind) {
          case Me:
            this.scope.parent = i ?? null;
            break;

          case De:
            this.scope = i ?? null;
            break;

          case qe:
            if (i === void 0 || i === null) {
                throw createMappedError(504, this.name);
            }
            if (!this.hasLockedScope) {
                this.scope = i;
            }
            break;
        }
        this.$initiator = t;
        this.Ot();
        let n = void 0;
        if (this.vmKind !== qe && this.St.binding != null) {
            n = e.onResolveAll(...this.St.binding.map(callBindingHook, this));
        }
        if (this.Rt.Ht) {
            n = e.onResolveAll(n, this.At.binding(this.$initiator, this.parent));
        }
        if (isPromise(n)) {
            this.$t();
            n.then((() => {
                this.Et = true;
                if (this.state !== Pe) {
                    this.Nt();
                } else {
                    this.bind();
                }
            })).catch((t => {
                this.Wt(t);
            }));
            return this.$promise;
        }
        this.Et = true;
        this.bind();
        return this.$promise;
    }
    bind() {
        let t = 0;
        let s = 0;
        let i = void 0;
        if (this.bindings !== null) {
            t = 0;
            s = this.bindings.length;
            while (s > t) {
                this.bindings[t].bind(this.scope);
                ++t;
            }
        }
        if (this.vmKind !== qe && this.St.bound != null) {
            i = e.onResolveAll(...this.St.bound.map(callBoundHook, this));
        }
        if (this.Rt.jt) {
            i = e.onResolveAll(i, this.At.bound(this.$initiator, this.parent));
        }
        if (isPromise(i)) {
            this.$t();
            i.then((() => {
                this.isBound = true;
                if (this.state !== Pe) {
                    this.Nt();
                } else {
                    this.zt();
                }
            })).catch((t => {
                this.Wt(t);
            }));
            return;
        }
        this.isBound = true;
        this.zt();
    }
    Ut(...t) {
        switch (this.mountTarget) {
          case Ce:
            this.host.append(...t);
            break;

          case Be:
            this.shadowRoot.append(...t);
            break;

          case Se:
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
              case Ce:
              case Be:
                this.hostController.Ut(this.host);
                break;

              case Se:
                this.hostController.Ut(this.location.$start, this.location);
                break;
            }
        }
        switch (this.mountTarget) {
          case Ce:
            this.nodes.appendTo(this.host, this.definition != null && this.definition.enhance);
            break;

          case Be:
            {
                const t = this.container;
                const e = t.has(pe, false) ? t.get(pe) : t.get(ge);
                e.applyTo(this.shadowRoot);
                this.nodes.appendTo(this.shadowRoot);
                break;
            }

          case Se:
            this.nodes.insertBefore(this.location);
            break;
        }
        let t = 0;
        let s = void 0;
        if (this.vmKind !== qe && this.St.attaching != null) {
            s = e.onResolveAll(...this.St.attaching.map(callAttachingHook, this));
        }
        if (this.Rt.Gt) {
            s = e.onResolveAll(s, this.At.attaching(this.$initiator, this.parent));
        }
        if (isPromise(s)) {
            this.$t();
            this.Ot();
            s.then((() => {
                this.Nt();
            })).catch((t => {
                this.Wt(t);
            }));
        }
        if (this.children !== null) {
            for (;t < this.children.length; ++t) {
                void this.children[t].activate(this.$initiator, this, this.scope);
            }
        }
        this.Nt();
    }
    deactivate(t, s) {
        let i = void 0;
        switch (this.state & ~Oe) {
          case _e:
            this.state = Ve;
            break;

          case Pe:
            this.state = Ve;
            i = this.$promise?.catch(e.noop);
            break;

          case Ie:
          case Fe:
          case He:
          case Fe | He:
            return;

          default:
            throw createMappedError(505, this.name, this.state);
        }
        this.$initiator = t;
        if (t === this) {
            this.Kt();
        }
        let n = 0;
        let r;
        if (this.children !== null) {
            for (n = 0; n < this.children.length; ++n) {
                void this.children[n].deactivate(t, this);
            }
        }
        return e.onResolve(i, (() => {
            if (this.isBound) {
                if (this.vmKind !== qe && this.St.detaching != null) {
                    r = e.onResolveAll(...this.St.detaching.map(callDetachingHook, this));
                }
                if (this.Rt.Xt) {
                    r = e.onResolveAll(r, this.At.detaching(this.$initiator, this.parent));
                }
            }
            if (isPromise(r)) {
                this.$t();
                t.Kt();
                r.then((() => {
                    t.Qt();
                })).catch((e => {
                    t.Wt(e);
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
          case Me:
          case qe:
            this.nodes.remove();
            this.nodes.unlink();
        }
        if (this.hostController !== null) {
            switch (this.mountTarget) {
              case Ce:
              case Be:
                this.host.remove();
                break;

              case Se:
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
          case De:
            this.scope = null;
            break;

          case qe:
            if (!this.hasLockedScope) {
                this.scope = null;
            }
            if ((this.state & Oe) === Oe && !this.viewFactory.tryReturnToCache(this) && this.$initiator === this) {
                this.dispose();
            }
            break;

          case Me:
            this.scope.parent = null;
            break;
        }
        this.state = Fe;
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
            je = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            je();
            je = void 0;
        }
    }
    Wt(t) {
        if (this.$promise !== void 0) {
            ze = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            ze(t);
            ze = void 0;
        }
        if (this.$initiator !== this) {
            this.parent.Wt(t);
        }
    }
    Ot() {
        ++this.Lt;
        if (this.$initiator !== this) {
            this.parent.Ot();
        }
    }
    Nt() {
        if (this.state !== Pe) {
            --this.Lt;
            this.Yt();
            if (this.$initiator !== this) {
                this.parent.Nt();
            }
            return;
        }
        if (--this.Lt === 0) {
            if (this.vmKind !== qe && this.St.attached != null) {
                Ue = e.onResolveAll(...this.St.attached.map(callAttachedHook, this));
            }
            if (this.Rt.Zt) {
                Ue = e.onResolveAll(Ue, this.At.attached(this.$initiator));
            }
            if (isPromise(Ue)) {
                this.$t();
                Ue.then((() => {
                    this.state = _e;
                    this.Yt();
                    if (this.$initiator !== this) {
                        this.parent.Nt();
                    }
                })).catch((t => {
                    this.Wt(t);
                }));
                Ue = void 0;
                return;
            }
            Ue = void 0;
            this.state = _e;
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
            let s = void 0;
            while (t !== null) {
                if (t !== this) {
                    if (t.debug) {
                        t.logger.trace(`detach()`);
                    }
                    t.removeNodes();
                }
                if (t.Et) {
                    if (t.vmKind !== qe && t.St.unbinding != null) {
                        s = e.onResolveAll(...t.St.unbinding.map(callUnbindingHook, t));
                    }
                    if (t.Rt.te) {
                        if (t.debug) {
                            t.logger.trace("unbinding()");
                        }
                        s = e.onResolveAll(s, t.viewModel.unbinding(t.$initiator, t.parent));
                    }
                }
                if (isPromise(s)) {
                    this.$t();
                    this.Jt();
                    s.then((() => {
                        this.ee();
                    })).catch((t => {
                        this.Wt(t);
                    }));
                }
                s = void 0;
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
                    t.Et = false;
                    t.isBound = false;
                    t.unbind();
                }
                e = t.next;
                t.next = null;
                t = e;
            }
            this.head = this.tail = null;
            this.Et = false;
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
          case De:
          case Me:
            {
                return this.definition.name === t;
            }

          case qe:
            return this.viewFactory.name === t;
        }
    }
    lockScope(t) {
        this.scope = t;
        this.hasLockedScope = true;
    }
    setHost(t) {
        if (this.vmKind === Me) {
            setRef(t, ns, this);
            setRef(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = Ce;
        return this;
    }
    setShadowRoot(t) {
        if (this.vmKind === Me) {
            setRef(t, ns, this);
            setRef(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = Be;
        return this;
    }
    setLocation(t) {
        if (this.vmKind === Me) {
            setRef(t, ns, this);
            setRef(t, this.definition.key, this);
        }
        this.location = t;
        this.mountTarget = Se;
        return this;
    }
    release() {
        this.state |= Oe;
    }
    dispose() {
        if ((this.state & He) === He) {
            return;
        }
        this.state |= He;
        if (this.Rt.se) {
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
            ye.delete(this.At);
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
        if (this.Rt.ie && this.At.accept(t) === true) {
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

const ye = new WeakMap;

const ke = 0;

const Ce = 1;

const Be = 2;

const Se = 3;

const Ae = f({
    none: ke,
    host: Ce,
    shadowRoot: Be,
    location: Se
});

const Re = {
    optional: true
};

const Ee = e.optionalResource(s.ICoercionConfiguration);

function createObservers(t, i, n) {
    const r = i.bindables;
    const l = p(r);
    const a = l.length;
    const h = t.container.get(s.IObserverLocator);
    if (a > 0) {
        for (let s = 0; s < a; ++s) {
            const i = l[s];
            const a = r[i];
            const c = a.callback;
            const u = h.getObserver(n, i);
            if (a.set !== e.noop) {
                if (u.useCoercer?.(a.set, t.coercion) !== true) {
                    throw createMappedError(507, i);
                }
            }
            if (n[c] != null || n.propertyChanged != null) {
                const callback = (e, s) => {
                    if (t.isBound) {
                        n[c]?.(e, s);
                        n.propertyChanged?.(i, e, s);
                    }
                };
                if (u.useCallback?.(callback) !== true) {
                    throw createMappedError(508, i);
                }
            }
        }
    }
}

const Te = new Map;

const getAccessScopeAst = e => {
    let s = Te.get(e);
    if (s == null) {
        s = new t.AccessScopeExpression(e, 0);
        Te.set(e, s);
    }
    return s;
};

function createWatchers(e, i, n, r) {
    const l = i.get(s.IObserverLocator);
    const a = i.get(t.IExpressionParser);
    const h = n.watches;
    const c = e.vmKind === Me ? e.scope : Scope.create(r, null, true);
    const u = h.length;
    let f;
    let d;
    let p;
    let g = 0;
    for (;u > g; ++g) {
        ({expression: f, callback: d} = h[g]);
        d = isFunction(d) ? d : Reflect.get(r, d);
        if (!isFunction(d)) {
            throw createMappedError(506, d);
        }
        if (isFunction(f)) {
            e.addBinding(new ComputedWatcher(r, l, f, d, true));
        } else {
            p = isString(f) ? a.parse(f, k) : getAccessScopeAst(f);
            e.addBinding(new ExpressionWatcher(c, i, l, p, d));
        }
    }
}

function isCustomElementController(t) {
    return t instanceof Controller && t.vmKind === Me;
}

function isCustomElementViewModel(t) {
    return n.isObject(t) && isElementType(t.constructor);
}

class HooksDefinition {
    constructor(t) {
        this.ne = "define" in t;
        this.Pt = "hydrating" in t;
        this.Vt = "hydrated" in t;
        this.Ft = "created" in t;
        this.Ht = "binding" in t;
        this.jt = "bound" in t;
        this.Gt = "attaching" in t;
        this.Zt = "attached" in t;
        this.Xt = "detaching" in t;
        this.te = "unbinding" in t;
        this.se = "dispose" in t;
        this.ie = "accept" in t;
    }
}

HooksDefinition.none = new HooksDefinition({});

const Le = {
    mode: "open"
};

const Me = "customElement";

const De = "customAttribute";

const qe = "synthetic";

const Ie = 0;

const Pe = 1;

const _e = 2;

const Ve = 4;

const Fe = 8;

const Oe = 16;

const He = 32;

const $e = /*@__PURE__*/ f({
    none: Ie,
    activating: Pe,
    activated: _e,
    deactivating: Ve,
    deactivated: Fe,
    released: Oe,
    disposed: He
});

function stringifyState(t) {
    const e = [];
    if ((t & Pe) === Pe) {
        e.push("activating");
    }
    if ((t & _e) === _e) {
        e.push("activated");
    }
    if ((t & Ve) === Ve) {
        e.push("deactivating");
    }
    if ((t & Fe) === Fe) {
        e.push("deactivated");
    }
    if ((t & Oe) === Oe) {
        e.push("released");
    }
    if ((t & He) === He) {
        e.push("disposed");
    }
    return e.length === 0 ? "none" : e.join("|");
}

const Ne = /*@__PURE__*/ z("IController");

const We = /*@__PURE__*/ z("IHydrationContext");

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

let je;

let ze;

let Ue;

class Refs {}

function getRef(t, e) {
    return t.$au?.[e] ?? null;
}

function setRef(t, e, s) {
    (t.$au ??= new Refs)[e] = s;
}

const Ge = /*@__PURE__*/ z("INode");

const Ke = /*@__PURE__*/ z("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(hs, true)) {
        return t.get(hs).host;
    }
    return t.get(at).document;
}))));

const Xe = /*@__PURE__*/ z("IRenderLocation");

const Qe = /*@__PURE__*/ z("CssModules");

const Ye = new WeakMap;

function getEffectiveParentNode(t) {
    if (Ye.has(t)) {
        return Ye.get(t);
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
        if (e.mountTarget === Ae.shadowRoot) {
            return getEffectiveParentNode(e.host);
        }
    }
    return t.parentNode;
}

function setEffectiveParentNode(t, e) {
    if (t.platform !== void 0 && !(t instanceof t.platform.Node)) {
        const s = t.childNodes;
        for (let t = 0, i = s.length; t < i; ++t) {
            Ye.set(s[t], e);
        }
    } else {
        Ye.set(t, e);
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

const Ze = /*@__PURE__*/ z("IWindow", (t => t.callback((t => t.get(at).window))));

const Je = /*@__PURE__*/ z("ILocation", (t => t.callback((t => t.get(Ze).location))));

const ts = /*@__PURE__*/ z("IHistory", (t => t.callback((t => t.get(Ze).history))));

const registerHostNode = (t, s, i) => {
    registerResolver(t, s.HTMLElement, registerResolver(t, s.Element, registerResolver(t, Ge, new e.InstanceProvider("ElementResolver", i))));
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
    const e = V(ns, t);
    if (e === void 0) {
        annotateElementMetadata(t, "containerless", true);
        return;
    }
    e.containerless = true;
}

const es = new WeakMap;

class CustomElementDefinition {
    get type() {
        return X;
    }
    constructor(t, e, s, i, n, r, l, a, h, c, u, f, d, p, g, m, x, v) {
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
        this.shadowOptions = p;
        this.hasSlots = g;
        this.enhance = m;
        this.watches = x;
        this.processContent = v;
    }
    static create(t, s = null) {
        if (s === null) {
            const i = t;
            if (isString(i)) {
                throw createMappedError(761, t);
            }
            const n = e.fromDefinitionOrDefault("name", i, rs);
            if (isFunction(i.Type)) {
                s = i.Type;
            } else {
                s = os(e.pascalCase(n));
            }
            return new CustomElementDefinition(s, n, e.mergeArrays(i.aliases), e.fromDefinitionOrDefault("key", i, (() => getElementKeyFrom(n))), e.fromAnnotationOrDefinitionOrTypeOrDefault("capture", i, s, returnFalse), e.fromDefinitionOrDefault("template", i, returnNull), e.mergeArrays(i.instructions), e.mergeArrays(getElementAnnotation(s, "dependencies"), i.dependencies), e.fromDefinitionOrDefault("injectable", i, returnNull), e.fromDefinitionOrDefault("needsCompile", i, returnTrue), e.mergeArrays(i.surrogates), W.from(getElementAnnotation(s, "bindables"), i.bindables), e.fromAnnotationOrDefinitionOrTypeOrDefault("containerless", i, s, returnFalse), e.fromDefinitionOrDefault("shadowOptions", i, returnNull), e.fromDefinitionOrDefault("hasSlots", i, returnFalse), e.fromDefinitionOrDefault("enhance", i, returnFalse), e.fromDefinitionOrDefault("watches", i, returnEmptyArray), e.fromAnnotationOrTypeOrDefault("processContent", s, returnNull));
        }
        if (isString(t)) {
            return new CustomElementDefinition(s, t, e.mergeArrays(getElementAnnotation(s, "aliases"), s.aliases), getElementKeyFrom(t), e.fromAnnotationOrTypeOrDefault("capture", s, returnFalse), e.fromAnnotationOrTypeOrDefault("template", s, returnNull), e.mergeArrays(getElementAnnotation(s, "instructions"), s.instructions), e.mergeArrays(getElementAnnotation(s, "dependencies"), s.dependencies), e.fromAnnotationOrTypeOrDefault("injectable", s, returnNull), e.fromAnnotationOrTypeOrDefault("needsCompile", s, returnTrue), e.mergeArrays(getElementAnnotation(s, "surrogates"), s.surrogates), W.from(...W.getAll(s), getElementAnnotation(s, "bindables"), s.bindables), e.fromAnnotationOrTypeOrDefault("containerless", s, returnFalse), e.fromAnnotationOrTypeOrDefault("shadowOptions", s, returnNull), e.fromAnnotationOrTypeOrDefault("hasSlots", s, returnFalse), e.fromAnnotationOrTypeOrDefault("enhance", s, returnFalse), e.mergeArrays(ht.getDefinitions(s), s.watches), e.fromAnnotationOrTypeOrDefault("processContent", s, returnNull));
        }
        const i = e.fromDefinitionOrDefault("name", t, rs);
        return new CustomElementDefinition(s, i, e.mergeArrays(getElementAnnotation(s, "aliases"), t.aliases, s.aliases), getElementKeyFrom(i), e.fromAnnotationOrDefinitionOrTypeOrDefault("capture", t, s, returnFalse), e.fromAnnotationOrDefinitionOrTypeOrDefault("template", t, s, returnNull), e.mergeArrays(getElementAnnotation(s, "instructions"), t.instructions, s.instructions), e.mergeArrays(getElementAnnotation(s, "dependencies"), t.dependencies, s.dependencies), e.fromAnnotationOrDefinitionOrTypeOrDefault("injectable", t, s, returnNull), e.fromAnnotationOrDefinitionOrTypeOrDefault("needsCompile", t, s, returnTrue), e.mergeArrays(getElementAnnotation(s, "surrogates"), t.surrogates, s.surrogates), W.from(...W.getAll(s), getElementAnnotation(s, "bindables"), s.bindables, t.bindables), e.fromAnnotationOrDefinitionOrTypeOrDefault("containerless", t, s, returnFalse), e.fromAnnotationOrDefinitionOrTypeOrDefault("shadowOptions", t, s, returnNull), e.fromAnnotationOrDefinitionOrTypeOrDefault("hasSlots", t, s, returnFalse), e.fromAnnotationOrDefinitionOrTypeOrDefault("enhance", t, s, returnFalse), e.mergeArrays(t.watches, ht.getDefinitions(s), s.watches), e.fromAnnotationOrDefinitionOrTypeOrDefault("processContent", t, s, returnNull));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) {
            return t;
        }
        if (es.has(t)) {
            return es.get(t);
        }
        const e = CustomElementDefinition.create(t);
        es.set(t, e);
        O(e, e.Type, ns);
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
        t.register(t.has(s, false) ? null : U(s, s), G(s, i), ...n.map((t => G(s, getElementKeyFrom(t)))));
    }
    toString() {
        return `au:ce:${this.name}`;
    }
}

const ss = {
    name: undefined,
    searchParents: false,
    optional: false
};

const returnNull = () => null;

const returnFalse = () => false;

const returnTrue = () => true;

const returnEmptyArray = () => e.emptyArray;

const is = "custom-element";

const ns = /*@__PURE__*/ e.getResourceKeyFor(is);

const getElementKeyFrom = t => `${ns}:${t}`;

const rs = /*@__PURE__*/ (t => () => `unnamed-${++t}`)(0);

const annotateElementMetadata = (t, e, s) => {
    O(s, t, $(e));
};

const defineElement = (t, s) => {
    const i = CustomElementDefinition.create(t, s);
    const n = i.Type;
    O(i, n, ns, e.resourceBaseName);
    return n;
};

const isElementType = t => isFunction(t) && (F(ns, t) || t.$au?.type === is);

const findElementControllerFor = (t, e = ss) => {
    if (e.name === void 0 && e.searchParents !== true) {
        const s = getRef(t, ns);
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
            const s = getRef(t, ns);
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
            const t = getRef(s, ns);
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
        const t = getRef(s, ns);
        if (t !== null) {
            return t;
        }
        s = getEffectiveParentNode(s);
    }
    throw createMappedError(765, t);
};

const getElementAnnotation = (t, e) => V($(e), t);

const getElementDefinition = t => {
    const e = V(ns, t) ?? getDefinitionFromStaticAu(t, is, CustomElementDefinition.create);
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

const os = /*@__PURE__*/ function() {
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
        v(n, "name", t);
        if (i !== e) {
            d(n.prototype, i);
        }
        return n;
    };
}();

const ls = /*@__PURE__*/ f({
    name: ns,
    keyFrom: getElementKeyFrom,
    isType: isElementType,
    for: findElementControllerFor,
    define: defineElement,
    getDefinition: getElementDefinition,
    annotate: annotateElementMetadata,
    getAnnotation: getElementAnnotation,
    generateName: rs,
    createInjectable: createElementInjectable,
    generateType: os,
    find(t, e) {
        const s = t.find(is, e);
        return s == null ? null : V(ns, s) ?? getDefinitionFromStaticAu(s, is, CustomElementDefinition.create) ?? null;
    }
});

const as = /*@__PURE__*/ $("processContent");

function processContent(t) {
    return t === void 0 ? function(t, e) {
        if (!e.static || e.kind !== "method") throw createMappedError(766, t);
        e.addInitializer((function() {
            O(t, this, as);
        }));
    } : function(e, s) {
        s.addInitializer((function() {
            if (isString(t) || isSymbol(t)) {
                t = this[t];
            }
            if (!isFunction(t)) throw createMappedError(766, t);
            const e = V(ns, this);
            if (e !== void 0) {
                e.processContent = t;
            } else {
                O(t, this, as);
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

const hs = /*@__PURE__*/ z("IAppRoot");

class AppRoot {
    get controller() {
        return this.L;
    }
    constructor(t, s, i, n = false) {
        this.config = t;
        this.container = s;
        this.ce = void 0;
        this.ue = n;
        const r = this.host = t.host;
        i.prepare(this);
        registerResolver(s, Ke, new e.InstanceProvider("IEventTarget", r));
        registerHostNode(s, this.platform = this.fe(s, r), r);
        this.ce = e.onResolve(this.de("creating"), (() => {
            if (!t.allowActionlessForm !== false) {
                r.addEventListener("submit", (t => {
                    const e = t.target;
                    const s = !e.getAttribute("action");
                    if (e.tagName === "FORM" && s) {
                        t.preventDefault();
                    }
                }), false);
            }
            const i = n ? s : s.createChild();
            const l = t.component;
            let a;
            if (isFunction(l)) {
                a = i.invoke(l);
                K(l, a);
            } else {
                a = t.component;
            }
            const h = {
                hydrate: false,
                projections: null
            };
            const c = n ? CustomElementDefinition.create({
                name: rs(),
                template: this.host,
                enhance: true
            }) : void 0;
            const u = this.L = Controller.$el(i, a, r, h, c);
            u.hE(h, null);
            return e.onResolve(this.de("hydrating"), (() => {
                u.hS();
                return e.onResolve(this.de("hydrated"), (() => {
                    u.hC();
                    this.ce = void 0;
                }));
            }));
        }));
    }
    activate() {
        return e.onResolve(this.ce, (() => e.onResolve(this.de("activating"), (() => e.onResolve(this.L.activate(this.L, null, void 0), (() => this.de("activated")))))));
    }
    deactivate() {
        return e.onResolve(this.de("deactivating"), (() => e.onResolve(this.L.deactivate(this.L, null), (() => this.de("deactivated")))));
    }
    de(t) {
        const s = this.container;
        const i = this.ue && !s.has(ot, false) ? [] : s.getAll(ot);
        return e.onResolveAll(...i.reduce(((e, s) => {
            if (s.slot === t) {
                e.push(s.run());
            }
            return e;
        }), []));
    }
    fe(t, e) {
        let s;
        if (!t.has(at, false)) {
            if (e.ownerDocument.defaultView === null) {
                throw createMappedError(769);
            }
            s = new r.BrowserPlatform(e.ownerDocument.defaultView);
            t.register(K(at, s));
        } else {
            s = t.get(at);
        }
        return s;
    }
    dispose() {
        this.L?.dispose();
    }
}

const cs = /*@__PURE__*/ z("IAurelia");

class Aurelia {
    get isRunning() {
        return this.ir;
    }
    get isStarting() {
        return this.pe;
    }
    get isStopping() {
        return this.ge;
    }
    get root() {
        if (this.me == null) {
            if (this.next == null) {
                throw createMappedError(767);
            }
            return this.next;
        }
        return this.me;
    }
    constructor(t = e.DI.createContainer()) {
        this.container = t;
        this.ir = false;
        this.pe = false;
        this.ge = false;
        this.me = void 0;
        this.next = void 0;
        this.xe = void 0;
        this.ve = void 0;
        if (t.has(cs, true) || t.has(Aurelia, true)) {
            throw createMappedError(768);
        }
        registerResolver(t, cs, new e.InstanceProvider("IAurelia", this));
        registerResolver(t, Aurelia, new e.InstanceProvider("Aurelia", this));
        registerResolver(t, hs, this.be = new e.InstanceProvider("IAppRoot"));
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
        const s = t.container ?? this.container.createChild();
        const i = registerResolver(s, hs, new e.InstanceProvider("IAppRoot"));
        const n = new AppRoot({
            host: t.host,
            component: t.component
        }, s, i, true);
        return e.onResolve(n.activate(), (() => n));
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
        if (isPromise(this.xe)) {
            return this.xe;
        }
        return this.xe = e.onResolve(this.stop(), (() => {
            Reflect.set(t.host, "$aurelia", this);
            this.be.prepare(this.me = t);
            this.pe = true;
            return e.onResolve(t.activate(), (() => {
                this.ir = true;
                this.pe = false;
                this.xe = void 0;
                this.we(t, "au-started", t.host);
            }));
        }));
    }
    stop(t = false) {
        if (isPromise(this.ve)) {
            return this.ve;
        }
        if (this.ir === true) {
            const s = this.me;
            this.ir = false;
            this.ge = true;
            return this.ve = e.onResolve(s.deactivate(), (() => {
                Reflect.deleteProperty(s.host, "$aurelia");
                if (t) {
                    s.dispose();
                }
                this.me = void 0;
                this.be.dispose();
                this.ge = false;
                this.we(s, "au-stopped", s.host);
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

const us = /*@__PURE__*/ z("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

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
        t.register(U(this, this), G(this, us));
    }
    constructor() {
        this.ye = d(createLookup(), {
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
        this.ke = o("a altGlyph animate animateColor circle clipPath defs ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feFlood feGaussianBlur feImage feMerge feMorphology feOffset feSpecularLighting feTile feTurbulence filter font foreignObject g glyph glyphRef image line linearGradient marker mask missing-glyph path pattern polygon polyline radialGradient rect stop svg switch symbol text textPath tref tspan use");
        this.Ce = o("alignment-baseline baseline-shift clip-path clip-rule clip color-interpolation-filters color-interpolation color-profile color-rendering color cursor direction display dominant-baseline enable-background fill-opacity fill-rule fill filter flood-color flood-opacity font-family font-size-adjust font-size font-stretch font-style font-variant font-weight glyph-orientation-horizontal glyph-orientation-vertical image-rendering kerning letter-spacing lighting-color marker-end marker-mid marker-start mask opacity overflow pointer-events shape-rendering stop-color stop-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width stroke text-anchor text-decoration text-rendering unicode-bidi visibility word-spacing writing-mode");
        const t = e.resolve(at);
        this.SVGElement = t.globalThis.SVGElement;
        const s = t.document.createElement("div");
        s.innerHTML = "<svg><altGlyph /></svg>";
        if (s.firstElementChild.nodeName === "altglyph") {
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
        this.Be = createLookup();
        this.Se = createLookup();
        this.svg = e.resolve(us);
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
            s = this.Be[i] ??= createLookup();
            for (n in e) {
                if (s[n] !== void 0) {
                    throw createError(n, i);
                }
                s[n] = e[n];
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

AttrMapper.register = e.createImplementationRegister(i.IAttrMapper);

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

const fs = {
    register(t) {
        t.register(i.TemplateCompiler, AttrMapper, ResourceResolver);
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
        this.Re = new WeakMap;
    }
    el(t, e) {
        let s = this.Ae.get(t);
        if (s == null) {
            this.Ae.set(t, s = new RecordCache);
        }
        return e in s.Ee ? s.Ee[e] : s.Ee[e] = ls.find(t, e);
    }
    attr(t, e) {
        let s = this.Ae.get(t);
        if (s == null) {
            this.Ae.set(t, s = new RecordCache);
        }
        return e in s.Te ? s.Te[e] : s.Te[e] = ft.find(t, e);
    }
    bindables(t) {
        let e = this.Re.get(t);
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
                    mode: t.defaultBindingMode ?? D
                });
            }
            this.Re.set(t, e = new BindablesInfo(i, s, a ?? null));
        }
        return e;
    }
}

ResourceResolver.register = e.createImplementationRegister(i.IResourceResolver);

class RecordCache {
    constructor() {
        this.Ee = createLookup();
        this.Te = createLookup();
    }
}

const ds = createLookup();

class AttributeNSAccessor {
    static forNs(t) {
        return ds[t] ??= new AttributeNSAccessor(t);
    }
    constructor(t) {
        this.ns = t;
        this.type = A | R;
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
        this.type = A | R;
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

const ps = /*@__PURE__*/ new DataAttributeAccessor;

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
                e[e.length] = u.call(n, "model") ? n.model : n.value;
            }
            ++i;
        }
        return e;
    }
    static Me(t, e) {
        return t === e;
    }
    constructor(t, e, s, i) {
        this.type = A | S | R;
        this.v = void 0;
        this.ov = void 0;
        this.De = false;
        this.qe = void 0;
        this.Ie = void 0;
        this.iO = false;
        this.xt = false;
        this.gt = t;
        this.oL = i;
        this.cf = s;
    }
    getValue() {
        return this.iO ? this.v : this.gt.multiple ? SelectValueObserver.Le(this.gt.options) : this.gt.value;
    }
    setValue(t) {
        this.ov = this.v;
        this.v = t;
        this.De = t !== this.ov;
        this.Pe(t instanceof Array ? t : null);
        this.kt();
    }
    kt() {
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
        const e = this.gt;
        const s = isArray(t);
        const i = e.matcher ?? SelectValueObserver.Me;
        const n = e.options;
        let r = n.length;
        while (r-- > 0) {
            const e = n[r];
            const l = u.call(e, "model") ? e.model : e.value;
            if (s) {
                e.selected = t.findIndex((t => !!i(l, t))) !== -1;
                continue;
            }
            e.selected = !!i(l, t);
        }
    }
    syncValue() {
        const t = this.gt;
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
                    a.push(u.call(r, "model") ? r.model : r.value);
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
                r = u.call(l, "model") ? l.model : l.value;
                break;
            }
            ++n;
        }
        this.ov = this.v;
        this.v = r;
        return true;
    }
    vt() {
        (this.Ie = createMutationObserver(this.gt, this._e.bind(this))).observe(this.gt, {
            childList: true,
            subtree: true,
            characterData: true
        });
        this.Pe(this.v instanceof Array ? this.v : null);
        this.iO = true;
    }
    bt() {
        this.Ie.disconnect();
        this.qe?.unsubscribe(this);
        this.Ie = this.qe = void 0;
        this.iO = false;
    }
    Pe(t) {
        this.qe?.unsubscribe(this);
        this.qe = void 0;
        if (t != null) {
            if (!this.gt.multiple) {
                throw createError$1(`AUR0654`);
            }
            (this.qe = this.oL.getArrayObserver(t)).subscribe(this);
        }
    }
    handleEvent() {
        const t = this.syncValue();
        if (t) {
            this.Ve();
        }
    }
    _e(t) {
        this.syncOptions();
        const e = this.syncValue();
        if (e) {
            this.Ve();
        }
    }
    Ve() {
        const t = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, t);
    }
}

(() => {
    mixinNodeObserverUseConfig(SelectValueObserver);
    s.subscriberCollection(SelectValueObserver, null);
})();

const gs = "--";

class StyleAttributeAccessor {
    constructor(t) {
        this.obj = t;
        this.type = A | R;
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
        this.kt();
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
    Oe(t) {
        let s;
        let i;
        const n = [];
        for (i in t) {
            s = t[i];
            if (s == null) {
                continue;
            }
            if (isString(s)) {
                if (i.startsWith(gs)) {
                    n.push([ i, s ]);
                    continue;
                }
                n.push([ e.kebabCase(i), s ]);
                continue;
            }
            n.push(...this.He(s));
        }
        return n;
    }
    $e(t) {
        const s = t.length;
        if (s > 0) {
            const e = [];
            let i = 0;
            for (;s > i; ++i) {
                e.push(...this.He(t[i]));
            }
            return e;
        }
        return e.emptyArray;
    }
    He(t) {
        if (isString(t)) {
            return this.Fe(t);
        }
        if (t instanceof Array) {
            return this.$e(t);
        }
        if (t instanceof Object) {
            return this.Oe(t);
        }
        return e.emptyArray;
    }
    kt() {
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
                if (!u.call(e, i) || e[i] !== n) {
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
        this.type = A | S | R;
        this.v = "";
        this.ov = "";
        this.De = false;
        this.xt = false;
        this.gt = t;
        this.k = e;
        this.cf = s;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (x(t, this.v)) {
            return;
        }
        this.ov = this.v;
        this.v = t;
        this.De = true;
        if (!this.cf.readonly) {
            this.kt();
        }
    }
    kt() {
        if (this.De) {
            this.De = false;
            this.gt[this.k] = this.v ?? this.cf.default;
            this.Ve();
        }
    }
    handleEvent() {
        this.ov = this.v;
        this.v = this.gt[this.k];
        if (this.ov !== this.v) {
            this.De = false;
            this.Ve();
        }
    }
    vt() {
        this.v = this.ov = this.gt[this.k];
    }
    Ve() {
        const t = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, t);
    }
}

(() => {
    mixinNodeObserverUseConfig(ValueAttributeObserver);
    s.subscriberCollection(ValueAttributeObserver, null);
})();

const ms = (() => {
    const t = "http://www.w3.org/1999/xlink";
    const e = "http://www.w3.org/XML/1998/namespace";
    const s = "http://www.w3.org/2000/xmlns/";
    return d(createLookup(), {
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

const xs = new s.PropertyAccessor;

xs.type = A | R;

class NodeObserverLocator {
    constructor() {
        this.allowDirtyCheck = true;
        this.Ne = createLookup();
        this.We = createLookup();
        this.je = createLookup();
        this.ze = createLookup();
        this.Ue = e.resolve(e.IServiceLocator);
        this.p = e.resolve(at);
        this.Ge = e.resolve(s.IDirtyChecker);
        this.svg = e.resolve(us);
        const t = [ "change", "input" ];
        const i = {
            events: t,
            default: ""
        };
        this.useConfig({
            INPUT: {
                value: i,
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
        const i = this.Ne;
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
        const s = this.We;
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
    getAccessor(t, s, i) {
        if (s in this.ze || s in (this.je[t.tagName] ?? e.emptyObject)) {
            return this.getObserver(t, s, i);
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
            return ps;

          default:
            {
                const e = ms[s];
                if (e !== undefined) {
                    return AttributeNSAccessor.forNs(e[1]);
                }
                if (isDataAttribute(t, s, this.svg)) {
                    return ps;
                }
                return xs;
            }
        }
    }
    overrideAccessor(t, e) {
        let s;
        if (isString(t)) {
            s = this.je[t] ??= createLookup();
            s[e] = true;
        } else {
            for (const e in t) {
                for (const i of t[e]) {
                    s = this.je[e] ??= createLookup();
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
        return this.Ne[t.tagName]?.[e] ?? this.We[e];
    }
    getNodeObserver(t, e, i) {
        const n = this.Ne[t.tagName]?.[e] ?? this.We[e];
        let r;
        if (n != null) {
            r = new (n.type ?? ValueAttributeObserver)(t, e, n, i, this.Ue);
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
        const r = ms[e];
        if (r !== undefined) {
            return AttributeNSAccessor.forNs(r[1]);
        }
        if (isDataAttribute(t, e, this.svg)) {
            return ps;
        }
        if (e in t.constructor.prototype) {
            if (this.allowDirtyCheck) {
                return this.Ge.createProperty(t, e);
            }
            throw createMappedError(652, e);
        } else {
            return new s.SetterObserver(t, e);
        }
    }
}

NodeObserverLocator.register = e.createImplementationRegister(s.INodeObserverLocator);

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
        this.type = A | S | R;
        this.v = void 0;
        this.ov = void 0;
        this.Ke = void 0;
        this.Xe = void 0;
        this.xt = false;
        this.gt = t;
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
        this.Ve();
    }
    handleCollectionChange() {
        this.Ye();
    }
    handleChange(t, e) {
        this.Ye();
    }
    Ye() {
        const t = this.v;
        const e = this.gt;
        const s = u.call(e, "model") ? e.model : e.value;
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
        const e = this.gt;
        const s = u.call(e, "model") ? e.model : e.value;
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
        this.Ve();
    }
    vt() {
        this.Qe();
    }
    bt() {
        this.Ke?.unsubscribe(this);
        this.Xe?.unsubscribe(this);
        this.Ke = this.Xe = void 0;
    }
    Ve() {
        vs = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, vs);
    }
    Qe() {
        const t = this.gt;
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
    s.subscriberCollection(CheckedObserver, null);
})();

let vs = void 0;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) {
            throw createMappedError(9994, e);
        }
        e.useTargetObserver(ps);
    }
}

AttrBindingBehavior.$au = {
    type: Y,
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
    type: Y,
    name: "self"
};

class UpdateTriggerBindingBehavior {
    constructor() {
        this.oL = e.resolve(s.IObserverLocator);
        this.Ze = e.resolve(s.INodeObserverLocator);
    }
    bind(t, e, ...s) {
        if (!(this.Ze instanceof NodeObserverLocator)) {
            throw createMappedError(9993);
        }
        if (s.length === 0) {
            throw createMappedError(802);
        }
        if (!(e instanceof PropertyBinding) || !(e.mode & P)) {
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
    type: Y,
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
        this.es = e.resolve(Dt);
        this.l = e.resolve(Xe);
    }
    attaching(t, e) {
        return this.ss(this.value);
    }
    detaching(t, s) {
        this.Je = true;
        return e.onResolve(this.pending, (() => {
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
        const s = this.view;
        const i = this.$controller;
        const n = this.ts++;
        const isCurrent = () => !this.Je && this.ts === n + 1;
        let r;
        return e.onResolve(this.pending, (() => this.pending = e.onResolve(s?.deactivate(s, i), (() => {
            if (!isCurrent()) {
                return;
            }
            if (t) {
                r = this.view = this.ifView = this.cache && this.ifView != null ? this.ifView : this.es.create();
            } else {
                r = this.view = this.elseView = this.cache && this.elseView != null ? this.elseView : this.elseFactory?.create();
            }
            if (r == null) {
                return;
            }
            r.setLocation(this.l);
            return e.onResolve(r.activate(r, i, i.scope), (() => {
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
    type: ct,
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
        this.f = e.resolve(Dt);
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

const bs = [ "BindingBehavior", "ValueConverter" ];

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
        this.ps = null;
        this.gs = void 0;
        this.xs = false;
        this.l = e.resolve(Xe);
        this.bs = e.resolve(Ne);
        this.f = e.resolve(Dt);
        this.ws = e.resolve(Cs);
        const s = e.resolve(i.IInstruction);
        const n = s.props[0].props[0];
        if (n !== void 0) {
            const {to: s, value: i, command: r} = n;
            if (s === "key") {
                if (r === null) {
                    this.key = i;
                } else if (r === "bind") {
                    this.key = e.resolve(t.IExpressionParser).parse(i, k);
                } else {
                    throw createMappedError(775, r);
                }
            } else {
                throw createMappedError(776, s);
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
                while (t != null && bs.includes(t.$kind)) {
                    t = t.expression;
                    this.us = true;
                }
                this.ps = t;
                break;
            }
        }
        this.ks();
        const a = r.declaration;
        if (!(this.xs = a.$kind === "ArrayDestructuring" || a.$kind === "ObjectDestructuring")) {
            this.local = T(a, this.$controller.scope, n, null);
        }
    }
    attaching(t, s) {
        this.Cs();
        return this.Bs(t, this.gs ?? e.emptyArray);
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
            this.items = T(this.forOf.iterable, s.scope, this.ys, null);
            this.ds = false;
            return;
        }
        this.Cs();
        this.As(t, e);
    }
    As(t, i) {
        const n = this.views;
        this.rs = n.slice();
        const r = n.length;
        const l = this.key;
        const a = l !== null;
        if (a || i === void 0) {
            const t = this.local;
            const e = this.gs;
            const h = e.length;
            const c = this.forOf;
            const u = c.declaration;
            const f = this.ys;
            const d = this.xs;
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
                        i.deletedItems.push(T(u, n[p].scope, f, null));
                    }
                } else {
                    for (p = 0; p < r; ++p) {
                        i.deletedIndices.push(p);
                        i.deletedItems.push(n[p].scope.bindingContext[t]);
                    }
                }
            } else {
                const s = Array(r);
                if (d) {
                    for (p = 0; p < r; ++p) {
                        s[p] = T(u, n[p].scope, f, null);
                    }
                } else {
                    for (p = 0; p < r; ++p) {
                        s[p] = n[p].scope.bindingContext[t];
                    }
                }
                let g;
                let m;
                let x;
                let v;
                let b = 0;
                const w = r - 1;
                const y = h - 1;
                const k = new Map;
                const C = new Map;
                const B = this.os;
                const S = this.ls;
                const A = this.$controller.scope;
                p = 0;
                t: {
                    while (true) {
                        if (a) {
                            g = s[p];
                            m = e[p];
                            x = getKeyValue(B, l, g, getScope(S, g, c, A, f, t, d), f);
                            v = getKeyValue(B, l, m, getScope(S, m, c, A, f, t, d), f);
                        } else {
                            g = x = ensureUnique(s[p], p);
                            m = v = ensureUnique(e[p], p);
                        }
                        if (x !== v) {
                            B.set(g, x);
                            B.set(m, v);
                            break;
                        }
                        ++p;
                        if (p > w || p > y) {
                            break t;
                        }
                    }
                    if (w !== y) {
                        break t;
                    }
                    b = y;
                    while (true) {
                        if (a) {
                            g = s[b];
                            m = e[b];
                            x = getKeyValue(B, l, g, getScope(S, g, c, A, f, t, d), f);
                            v = getKeyValue(B, l, m, getScope(S, m, c, A, f, t, d), f);
                        } else {
                            g = x = ensureUnique(s[p], p);
                            m = v = ensureUnique(e[p], p);
                        }
                        if (x !== v) {
                            B.set(g, x);
                            B.set(m, v);
                            break;
                        }
                        --b;
                        if (p > b) {
                            break t;
                        }
                    }
                }
                const R = p;
                const E = p;
                for (p = E; p <= y; ++p) {
                    if (B.has(m = a ? e[p] : ensureUnique(e[p], p))) {
                        v = B.get(m);
                    } else {
                        v = a ? getKeyValue(B, l, m, getScope(S, m, c, A, f, t, d), f) : m;
                        B.set(m, v);
                    }
                    C.set(v, p);
                }
                for (p = R; p <= w; ++p) {
                    if (B.has(g = a ? s[p] : ensureUnique(s[p], p))) {
                        x = B.get(g);
                    } else {
                        x = a ? getKeyValue(B, l, g, n[p].scope, f) : g;
                    }
                    k.set(x, p);
                    if (C.has(x)) {
                        i[C.get(x)] = p;
                    } else {
                        i.deletedIndices.push(p);
                        i.deletedItems.push(g);
                    }
                }
                for (p = E; p <= y; ++p) {
                    if (!k.has(B.get(a ? e[p] : ensureUnique(e[p], p)))) {
                        i[p] = -2;
                    }
                }
                k.clear();
                C.clear();
            }
        }
        if (i === void 0) {
            const t = e.onResolve(this.Ss(null), (() => this.Bs(null, this.gs ?? e.emptyArray)));
            if (isPromise(t)) {
                t.catch(rethrow);
            }
        } else {
            if (i.deletedIndices.length > 0) {
                const t = e.onResolve(this.Rs(i), (() => this.Es(r, i)));
                if (isPromise(t)) {
                    t.catch(rethrow);
                }
            } else {
                this.Es(r, i);
            }
        }
    }
    ks() {
        const t = this.$controller.scope;
        let e = this.Ts;
        let s = this.us;
        let i;
        if (s) {
            e = this.Ts = T(this.ps, t, this.ys, null) ?? null;
            s = this.us = !x(this.items, e);
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
        if (isArray(t)) {
            this.gs = t.slice(0);
            return;
        }
        const e = [];
        this.ws.resolve(t).iterate(t, ((t, s) => {
            e[s] = t;
        }));
        this.gs = e;
    }
    Bs(t, e) {
        let s = void 0;
        let i;
        let n;
        let r;
        const {$controller: l, f: a, local: h, l: c, ls: u, ys: f, forOf: d, xs: p} = this;
        const g = l.scope;
        const m = e.length;
        const x = this.views = Array(m);
        e.forEach(((e, v) => {
            n = x[v] = a.create().setLocation(c);
            n.nodes.unlink();
            r = getScope(u, e, d, g, f, h, p);
            setContextualProperties(r.overrideContext, v, m);
            i = n.activate(t ?? n, l, r);
            if (isPromise(i)) {
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
            if (isPromise(s)) {
                (e ?? (e = [])).push(s);
            }
        }
        if (e !== void 0) {
            return e.length === 1 ? e[0] : Promise.all(e);
        }
    }
    Rs(t) {
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
    Es(t, e) {
        let s = void 0;
        let i;
        let n;
        let r;
        let l = 0;
        const {$controller: a, f: h, local: c, gs: u, l: f, views: d, xs: p, ys: g, ls: m, rs: x, forOf: v} = this;
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
                d[l] = x[k];
            }
        }
        const C = longestIncreasingSubsequence(e);
        const B = C.length;
        const S = v.declaration;
        let A;
        let R = B - 1;
        l = y - 1;
        for (;l >= 0; --l) {
            n = d[l];
            A = d[l + 1];
            n.nodes.link(A?.nodes ?? f);
            if (e[l] === -2) {
                r = getScope(m, u[l], v, w, g, c, p);
                setContextualProperties(r.overrideContext, l, y);
                n.setLocation(f);
                i = n.activate(n, a, r);
                if (isPromise(i)) {
                    (s ?? (s = [])).push(i);
                }
            } else if (R < 0 || B === 1 || l !== C[R]) {
                if (p) {
                    E(S, n.scope, g, u[l]);
                } else {
                    n.scope.bindingContext[c] = u[l];
                }
                setContextualProperties(n.scope.overrideContext, l, y);
                n.nodes.insertBefore(n.location);
            } else {
                if (p) {
                    E(S, n.scope, g, u[l]);
                } else {
                    n.scope.bindingContext[c] = u[l];
                }
                if (t !== y) {
                    setContextualProperties(n.scope.overrideContext, l, y);
                }
                --R;
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
    type: ct,
    name: "repeat",
    isTemplateController: true,
    bindables: [ "items" ]
};

let ws = 16;

let ys = new Int32Array(ws);

let ks = new Int32Array(ws);

function longestIncreasingSubsequence(t) {
    const e = t.length;
    if (e > ws) {
        ws = e;
        ys = new Int32Array(e);
        ks = new Int32Array(e);
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
            l = ys[s];
            n = t[l];
            if (n !== -2 && n < i) {
                ks[r] = l;
                ys[++s] = r;
                continue;
            }
            a = 0;
            h = s;
            while (a < h) {
                c = a + h >> 1;
                n = t[ys[c]];
                if (n !== -2 && n < i) {
                    a = c + 1;
                } else {
                    h = c;
                }
            }
            n = t[ys[a]];
            if (i < n || n === -2) {
                if (a > 0) {
                    ks[r] = ys[a - 1];
                }
                ys[a] = r;
            }
        }
    }
    r = ++s;
    const u = new Int32Array(r);
    i = ys[s - 1];
    while (s-- > 0) {
        u[s] = i;
        i = ks[i];
    }
    while (r-- > 0) ys[r] = 0;
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

const Cs = /*@__PURE__*/ z("IRepeatableHandlerResolver", (t => t.singleton(RepeatableHandlerResolver)));

class RepeatableHandlerResolver {
    constructor() {
        this.Ls = e.resolve(e.all(Bs));
    }
    resolve(t) {
        if (Ss.handles(t)) {
            return Ss;
        }
        if (As.handles(t)) {
            return As;
        }
        if (Rs.handles(t)) {
            return Rs;
        }
        if (Es.handles(t)) {
            return Es;
        }
        if (Ts.handles(t)) {
            return Ts;
        }
        const e = this.Ls.find((e => e.handles(t)));
        if (e !== void 0) {
            return e;
        }
        return Ls;
    }
}

class ArrayLikeHandler {
    static register(t) {
        t.register(U(Bs, this));
    }
    handles(t) {
        return "length" in t && isNumber(t.length);
    }
    iterate(t, e) {
        for (let s = 0, i = t.length; s < i; ++s) {
            e(t[s], s, t);
        }
    }
}

const Bs = /*@__PURE__*/ z("IRepeatableHandler");

const Ss = {
    handles: isArray,
    getObserver: s.getCollectionObserver,
    iterate(t, e) {
        const s = t.length;
        let i = 0;
        for (;i < s; ++i) {
            e(t[i], i, t);
        }
    }
};

const As = {
    handles: isSet,
    getObserver: s.getCollectionObserver,
    iterate(t, e) {
        let s = 0;
        let i;
        for (i of t.keys()) {
            e(i, s++, t);
        }
    }
};

const Rs = {
    handles: isMap,
    getObserver: s.getCollectionObserver,
    iterate(t, e) {
        let s = 0;
        let i;
        for (i of t.entries()) {
            e(i, s++, t);
        }
    }
};

const Es = {
    handles: isNumber,
    iterate(t, e) {
        let s = 0;
        for (;s < t; ++s) {
            e(s, s, t);
        }
    }
};

const Ts = {
    handles: t => t == null,
    iterate() {}
};

const Ls = {
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
            r = T(e, i, n, null);
        }
        t.set(s, r);
    }
    return r;
};

const getScope = (t, e, s, i, n, r, l) => {
    let a = t.get(e);
    if (a === void 0) {
        if (l) {
            E(s.declaration, a = Scope.fromParent(i, new BindingContext), n, e);
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
        this.view = e.resolve(Dt).create().setLocation(e.resolve(Xe));
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
    type: ct,
    name: "with",
    isTemplateController: true,
    bindables: [ "value" ]
};

class Switch {
    constructor() {
        this.cases = [];
        this.activeCases = [];
        this.promise = void 0;
        this.f = e.resolve(Dt);
        this.l = e.resolve(Xe);
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
        const s = t.isMatch(this.value);
        const i = this.activeCases;
        const n = i.length;
        if (!s) {
            if (n > 0 && i[0].id === t.id) {
                return this.Ds(null);
            }
            return;
        }
        if (n > 0 && i[0].id < t.id) {
            return;
        }
        const r = [];
        let l = t.fallThrough;
        if (!l) {
            r.push(t);
        } else {
            const e = this.cases;
            const s = e.indexOf(t);
            for (let t = s, i = e.length; t < i && l; t++) {
                const s = e[t];
                r.push(s);
                l = s.fallThrough;
            }
        }
        return e.onResolve(this.Ds(null, r), (() => {
            this.activeCases = r;
            return this.qs(null);
        }));
    }
    swap(t, s) {
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
        return e.onResolve(this.activeCases.length > 0 ? this.Ds(t, i) : void 0, (() => {
            this.activeCases = i;
            if (i.length === 0) {
                return;
            }
            return this.qs(t);
        }));
    }
    qs(t) {
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
            return i[0].activate(t, r);
        }
        return e.onResolveAll(...i.map((e => e.activate(t, r))));
    }
    Ds(t, s = []) {
        const i = this.activeCases;
        const n = i.length;
        if (n === 0) {
            return;
        }
        if (n === 1) {
            const e = i[0];
            if (!s.includes(e)) {
                i.length = 0;
                return e.deactivate(t);
            }
            return;
        }
        return e.onResolve(e.onResolveAll(...i.reduce(((e, i) => {
            if (!s.includes(i)) {
                e.push(i.deactivate(t));
            }
            return e;
        }), [])), (() => {
            i.length = 0;
        }));
    }
    queue(t) {
        const s = this.promise;
        let i = void 0;
        i = this.promise = e.onResolve(e.onResolve(s, t), (() => {
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
    type: ct,
    name: "switch",
    isTemplateController: true,
    bindables: [ "value" ]
};

let Ms = 0;

class Case {
    constructor() {
        this.id = ++Ms;
        this.fallThrough = false;
        this.view = void 0;
        this.f = e.resolve(Dt);
        this.Ue = e.resolve(s.IObserverLocator);
        this.l = e.resolve(Xe);
        this.Is = e.resolve(e.ILogger).scopeTo(`${this.constructor.name}-#${this.id}`);
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
        this.Is.debug("isMatch()");
        const e = this.value;
        if (isArray(e)) {
            if (this.cs === void 0) {
                this.cs = this.Ps(e);
            }
            return e.includes(t);
        }
        return e === t;
    }
    valueChanged(t, e) {
        if (isArray(t)) {
            this.cs?.unsubscribe(this);
            this.cs = this.Ps(t);
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
    Ps(t) {
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
        mode: q,
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
        this.f = e.resolve(Dt);
        this.l = e.resolve(Xe);
        this.p = e.resolve(at);
        this.logger = e.resolve(e.ILogger).scopeTo("promise.resolve");
    }
    link(t, e, s, i) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(t, s) {
        const i = this.view;
        const n = this.$controller;
        return e.onResolve(i.activate(t, n, this.viewScope = Scope.fromParent(n.scope, {})), (() => this.swap(t)));
    }
    valueChanged(t, e) {
        if (!this.$controller.isActive) {
            return;
        }
        this.swap(null);
    }
    swap(t) {
        const s = this.value;
        if (!isPromise(s)) {
            return;
        }
        const i = this.p.domWriteQueue;
        const n = this.fulfilled;
        const r = this.rejected;
        const a = this.pending;
        const h = this.viewScope;
        let c;
        const u = {
            reusable: false
        };
        const $swap = () => {
            void e.onResolveAll(c = (this.preSettledTask = i.queueTask((() => e.onResolveAll(n?.deactivate(t), r?.deactivate(t), a?.activate(t, h))), u)).result.catch((t => {
                if (!(t instanceof l.TaskAbortError)) throw t;
            })), s.then((l => {
                if (this.value !== s) {
                    return;
                }
                const fulfill = () => {
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => e.onResolveAll(a?.deactivate(t), r?.deactivate(t), n?.activate(t, h, l))), u)).result;
                };
                if (this.preSettledTask.status === B) {
                    void c.then(fulfill);
                } else {
                    this.preSettledTask.cancel();
                    fulfill();
                }
            }), (l => {
                if (this.value !== s) {
                    return;
                }
                const reject = () => {
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => e.onResolveAll(a?.deactivate(t), n?.deactivate(t), r?.activate(t, h, l))), u)).result;
                };
                if (this.preSettledTask.status === B) {
                    void c.then(reject);
                } else {
                    this.preSettledTask.cancel();
                    reject();
                }
            })));
        };
        if (this.postSettledTask?.status === B) {
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
    type: ct,
    name: "promise",
    isTemplateController: true,
    bindables: [ "value" ]
};

class PendingTemplateController {
    constructor() {
        this.view = void 0;
        this.f = e.resolve(Dt);
        this.l = e.resolve(Xe);
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
    type: ct,
    name: "pending",
    isTemplateController: true,
    bindables: {
        value: {
            mode: I
        }
    }
};

class FulfilledTemplateController {
    constructor() {
        this.view = void 0;
        this.f = e.resolve(Dt);
        this.l = e.resolve(Xe);
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
    type: ct,
    name: "then",
    isTemplateController: true,
    bindables: {
        value: {
            mode: P
        }
    }
};

class RejectedTemplateController {
    constructor() {
        this.view = void 0;
        this.f = e.resolve(Dt);
        this.l = e.resolve(Xe);
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
    type: ct,
    name: "catch",
    isTemplateController: true,
    bindables: {
        value: {
            mode: P
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
        return new i.AttrSyntax(t, e, "promise", "bind");
    }
}

i.AttributePattern.define([ {
    pattern: "promise.resolve",
    symbols: ""
} ], PromiseAttributePattern);

class FulfilledAttributePattern {
    then(t, e) {
        return new i.AttrSyntax(t, e, "then", "from-view");
    }
}

i.AttributePattern.define([ {
    pattern: "then",
    symbols: ""
} ], FulfilledAttributePattern);

class RejectedAttributePattern {
    catch(t, e) {
        return new i.AttrSyntax(t, e, "catch", "from-view");
    }
}

i.AttributePattern.define([ {
    pattern: "catch",
    symbols: ""
} ], RejectedAttributePattern);

class Focus {
    constructor() {
        this._s = false;
        this.Ee = e.resolve(Ge);
        this.p = e.resolve(at);
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) {
            this.Vs();
        } else {
            this._s = true;
        }
    }
    attached() {
        if (this._s) {
            this._s = false;
            this.Vs();
        }
        this.Ee.addEventListener("focus", this);
        this.Ee.addEventListener("blur", this);
    }
    detaching() {
        const t = this.Ee;
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
    Vs() {
        const t = this.Ee;
        const e = this.Fs;
        const s = this.value;
        if (s && !e) {
            t.focus();
        } else if (!s && e) {
            t.blur();
        }
    }
    get Fs() {
        return this.Ee === this.p.document.activeElement;
    }
}

Focus.$au = {
    type: ct,
    name: "focus",
    bindables: {
        value: {
            mode: _
        }
    }
};

class Portal {
    constructor() {
        this.position = "beforeend";
        this.strict = false;
        const t = e.resolve(Dt);
        const s = e.resolve(Xe);
        const i = e.resolve(at);
        this.p = i;
        this.Os = i.document.createElement("div");
        (this.view = t.create()).setLocation(this.Hs = qt(i));
        setEffectiveParentNode(this.view.nodes, s);
    }
    attaching(t) {
        if (this.callbackContext == null) {
            this.callbackContext = this.$controller.scope.bindingContext;
        }
        const e = this.Os = this.$s();
        this.Ns(e, this.position);
        return this.Ws(t, e);
    }
    detaching(t) {
        return this.js(t, this.Os);
    }
    targetChanged() {
        const {$controller: t} = this;
        if (!t.isActive) {
            return;
        }
        const s = this.$s();
        if (this.Os === s) {
            return;
        }
        this.Os = s;
        const i = e.onResolve(this.js(null, s), (() => {
            this.Ns(s, this.position);
            return this.Ws(null, s);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    positionChanged() {
        const {$controller: t, Os: s} = this;
        if (!t.isActive) {
            return;
        }
        const i = e.onResolve(this.js(null, s), (() => {
            this.Ns(s, this.position);
            return this.Ws(null, s);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    Ws(t, s) {
        const {activating: i, callbackContext: n, view: r} = this;
        return e.onResolve(i?.call(n, s, r), (() => this.zs(t, s)));
    }
    zs(t, s) {
        const {$controller: i, view: n} = this;
        if (t === null) {
            n.nodes.insertBefore(this.Hs);
        } else {
            return e.onResolve(n.activate(t ?? n, i, i.scope), (() => this.Us(s)));
        }
        return this.Us(s);
    }
    Us(t) {
        const {activated: e, callbackContext: s, view: i} = this;
        return e?.call(s, t, i);
    }
    js(t, s) {
        const {deactivating: i, callbackContext: n, view: r} = this;
        return e.onResolve(i?.call(n, s, r), (() => this.Gs(t, s)));
    }
    Gs(t, s) {
        const {$controller: i, view: n} = this;
        if (t === null) {
            n.nodes.remove();
        } else {
            return e.onResolve(n.deactivate(t, i), (() => this.Ks(s)));
        }
        return this.Ks(s);
    }
    Ks(t) {
        const {deactivated: s, callbackContext: i, view: n} = this;
        return e.onResolve(s?.call(i, t, n), (() => this.Xs()));
    }
    $s() {
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
    type: ct,
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

let Ds;

class AuSlot {
    constructor() {
        this.Qs = null;
        this.Ys = null;
        this.Zt = false;
        this.expose = null;
        this.slotchange = null;
        this.Zs = new Set;
        this.cs = null;
        const t = e.resolve(We);
        const s = e.resolve(Xe);
        const n = e.resolve(i.IInstruction);
        const r = e.resolve(fe);
        const l = this.name = n.data.name;
        const a = n.projections?.[It];
        const h = t.instruction?.projections?.[l];
        const c = t.controller.container;
        let u;
        let f;
        if (h == null) {
            f = c.createChild({
                inheritParentResources: true
            });
            u = r.getViewFactory(a ?? (Ds ??= CustomElementDefinition.create({
                name: "au-slot-empty-template",
                template: "",
                needsCompile: false
            })), f);
            this.Js = false;
        } else {
            f = c.createChild();
            f.useResources(t.parent.controller.container);
            registerResolver(f, We, new e.InstanceProvider(void 0, t.parent));
            u = r.getViewFactory(h, f);
            this.Js = true;
            this.ti = c.getAll(Vt, false)?.filter((t => t.slotName === "*" || t.slotName === l)) ?? e.emptyArray;
        }
        this.ei = (this.ti ??= e.emptyArray).length > 0;
        this.si = t;
        this.view = u.create().setLocation(this.l = s);
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
    attaching(t, s) {
        return e.onResolve(this.view.activate(t, this.$controller, this.Js ? this.Ys : this.Qs), (() => {
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
    type: is,
    name: "au-slot",
    template: null,
    containerless: true,
    processContent(t, e, s) {
        s.name = t.getAttribute("name") ?? It;
        let i = t.firstChild;
        let n = null;
        while (i !== null) {
            n = i.nextSibling;
            if (isElement(i) && i.hasAttribute(Pt)) {
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
        this.c = e.resolve(e.IContainer);
        this.parent = e.resolve(Ne);
        this.oi = e.resolve(Ge);
        this.l = e.resolve(Xe);
        this.p = e.resolve(at);
        this.r = e.resolve(fe);
        this.li = e.resolve(i.IInstruction);
        this.ai = e.resolve(e.transient(CompositionContextFactory, null));
        this.rt = e.resolve(i.ITemplateCompiler);
        this.Z = e.resolve(We);
        this.ep = e.resolve(t.IExpressionParser);
        this.oL = e.resolve(s.IObserverLocator);
    }
    get composing() {
        return this.hi;
    }
    get composition() {
        return this.ri;
    }
    attaching(t, s) {
        return this.hi = e.onResolve(this.queue(new ChangeInfo(this.template, this.component, this.model, void 0), t), (t => {
            if (this.ai.ci(t)) {
                this.hi = void 0;
            }
        }));
    }
    detaching(t) {
        const s = this.ri;
        const i = this.hi;
        this.ai.invalidate();
        this.ri = this.hi = void 0;
        return e.onResolve(i, (() => s?.deactivate(t)));
    }
    propertyChanged(t) {
        if (t === "composing" || t === "composition") return;
        if (t === "model" && this.ri != null) {
            this.ri.update(this.model);
            return;
        }
        if (t === "tag" && this.ri?.controller.vmKind === Me) {
            return;
        }
        this.hi = e.onResolve(this.hi, (() => e.onResolve(this.queue(new ChangeInfo(this.template, this.component, this.model, t), void 0), (t => {
            if (this.ai.ci(t)) {
                this.hi = void 0;
            }
        }))));
    }
    queue(t, s) {
        const i = this.ai;
        const n = this.ri;
        return e.onResolve(i.create(t), (t => {
            if (i.ci(t)) {
                return e.onResolve(this.compose(t), (r => {
                    if (i.ci(t)) {
                        return e.onResolve(r.activate(s), (() => {
                            if (i.ci(t)) {
                                this.ri = r;
                                return e.onResolve(n?.deactivate(s), (() => t));
                            } else {
                                return e.onResolve(r.controller.deactivate(r.controller, this.$controller), (() => {
                                    r.controller.dispose();
                                    return t;
                                }));
                            }
                        }));
                    }
                    r.controller.dispose();
                    return t;
                }));
            }
            return t;
        }));
    }
    compose(t) {
        const {ui: s, fi: i, di: n} = t.change;
        const {c: r, $controller: l, l: a, li: h} = this;
        const c = this.pi(this.Z.controller.container, i);
        const u = r.createChild();
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
        const p = this.gi(u, typeof i === "string" ? c.Type : i, f, d);
        const compose = () => {
            const i = h.captures ?? e.emptyArray;
            if (c !== null) {
                const s = c.capture;
                const [n, r] = i.reduce(((t, e) => {
                    const i = !(e.target in c.bindables) && (s === true || isFunction(s) && !!s(e.target));
                    t[i ? 0 : 1].push(e);
                    return t;
                }), [ [], [] ]);
                const a = Controller.$el(u, p, f, {
                    projections: h.projections,
                    captures: n
                }, c, d);
                this.mi(f, c, r).forEach((t => a.addBinding(t)));
                return new CompositionController(a, (t => a.activate(t ?? a, l, l.scope.parent)), (t => e.onResolve(a.deactivate(t ?? a, l), removeCompositionHost)), (t => p.activate?.(t)), t);
            } else {
                const n = CustomElementDefinition.create({
                    name: ls.generateName(),
                    template: s
                });
                const r = this.r.getViewFactory(n, u);
                const a = Controller.$view(r, l);
                const h = this.scopeBehavior === "auto" ? Scope.fromParent(this.parent.scope, p) : Scope.create(p);
                a.setHost(f);
                if (d == null) {
                    this.mi(f, n, i).forEach((t => a.addBinding(t)));
                } else {
                    a.setLocation(d);
                }
                return new CompositionController(a, (t => a.activate(t ?? a, l, h)), (t => e.onResolve(a.deactivate(t ?? a, l), removeCompositionHost)), (t => p.activate?.(t)), t);
            }
        };
        if ("activate" in p) {
            return e.onResolve(p.activate(n), (() => compose()));
        } else {
            return compose();
        }
    }
    gi(t, s, i, n) {
        if (s == null) {
            return new EmptyComponent;
        }
        if (typeof s === "object") {
            return s;
        }
        const r = this.p;
        registerHostNode(t, r, i);
        registerResolver(t, Xe, new e.InstanceProvider("IRenderLocation", n));
        const l = t.invoke(s);
        registerResolver(t, s, new e.InstanceProvider("au-compose.component", l));
        return l;
    }
    pi(t, e) {
        if (typeof e === "string") {
            const s = ls.find(t, e);
            if (s == null) {
                throw createMappedError(806, e);
            }
            return s;
        }
        const s = isFunction(e) ? e : e?.constructor;
        return ls.isType(s, void 0) ? ls.getDefinition(s, null) : null;
    }
    mi(t, e, s) {
        const i = new HydrationContext(this.$controller, {
            projections: null,
            captures: s
        }, this.Z.parent);
        return SpreadBinding.create(i, t, e, this.r, this.rt, this.p, this.ep, this.oL);
    }
}

AuCompose.$au = {
    type: is,
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
        mode: P
    }, {
        name: "composition",
        mode: P
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
        return e.onResolve(t.load(), (t => new CompositionContext(++this.id, t)));
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
        this.xi = i;
    }
    load() {
        if (isPromise(this.ui) || isPromise(this.fi)) {
            return Promise.all([ this.ui, this.fi ]).then((([t, e]) => new LoadedChangeInfo(t, e, this.di, this.xi)));
        } else {
            return new LoadedChangeInfo(this.ui, this.fi, this.di, this.xi);
        }
    }
}

class LoadedChangeInfo {
    constructor(t, e, s, i) {
        this.ui = t;
        this.fi = e;
        this.di = s;
        this.xi = i;
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

const qs = /*@__PURE__*/ z("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw createMappedError(99, "sanitize");
    }
})));

class SanitizeValueConverter {
    constructor() {
        this.vi = e.resolve(qs);
    }
    toView(t) {
        if (t == null) {
            return null;
        }
        return this.vi.sanitize(t);
    }
}

SanitizeValueConverter.$au = {
    type: gt,
    name: "sanitize"
};

class Show {
    constructor() {
        this.el = e.resolve(Ge);
        this.p = e.resolve(at);
        this.bi = false;
        this.T = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.T = null;
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
        const t = e.resolve(i.IInstruction);
        this.wi = this.yi = t.alias !== "hide";
    }
    binding() {
        this.bi = true;
        this.update();
    }
    detaching() {
        this.bi = false;
        this.T?.cancel();
        this.T = null;
    }
    valueChanged() {
        if (this.bi && this.T === null) {
            this.T = this.p.domWriteQueue.queueTask(this.update);
        }
    }
}

Show.$au = {
    type: ct,
    name: "show",
    bindables: [ "value" ],
    aliases: [ "hide" ]
};

const Is = [ fs, s.DirtyChecker, NodeObserverLocator ];

const Ps = [ i.RefAttributePattern, i.DotSeparatedAttributePattern, i.EventAttributePattern, Mt ];

const _s = [ i.AtPrefixedTriggerAttributePattern, i.ColonPrefixedBindAttributePattern ];

const Vs = [ i.DefaultBindingCommand, i.OneTimeBindingCommand, i.FromViewBindingCommand, i.ToViewBindingCommand, i.TwoWayBindingCommand, i.ForBindingCommand, i.RefBindingCommand, i.TriggerBindingCommand, i.CaptureBindingCommand, i.ClassBindingCommand, i.StyleBindingCommand, i.AttrBindingCommand, i.SpreadValueBindingCommand ];

const Fs = [ DebounceBindingBehavior, OneTimeBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, SignalBindingBehavior, ThrottleBindingBehavior, TwoWayBindingBehavior, SanitizeValueConverter, If, Else, Repeat, With, Switch, Case, DefaultCase, PromiseTemplateController, PendingTemplateController, FulfilledTemplateController, RejectedTemplateController, PromiseAttributePattern, FulfilledAttributePattern, RejectedAttributePattern, AttrBindingBehavior, SelfBindingBehavior, UpdateTriggerBindingBehavior, AuCompose, Portal, Focus, Show, AuSlot ];

const Os = [ Gt, Kt, zt, Ut, Ht, $t, Nt, Wt, jt, Yt, se, Zt, Jt, te, ee, Xt, ie, ne ];

const Hs = /*@__PURE__*/ createConfiguration(e.noop);

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
            return e.register(K(s.ICoercionConfiguration, i.coercingOptions), ...Is, ...Fs, ...Ps, ...Vs, ...Os);
        },
        customize(e) {
            return createConfiguration(e ?? t);
        }
    };
}

function children(t, e) {
    if (!Ws) {
        Ws = true;
        s.subscriberCollection(ChildrenBinding, null);
        lifecycleHooks()(ChildrenLifecycleHooks, null);
    }
    let i;
    const n = $("dependencies");
    function decorator(t, e) {
        switch (e.kind) {
          case "field":
            i.name = e.name;
            break;
        }
        const s = e.metadata[n] ??= [];
        s.push(new ChildrenLifecycleHooks(i));
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
    constructor(t, e, s, i = defaultChildQuery, n = defaultChildFilter, r = defaultChildMap, l = $s) {
        this.ki = void 0;
        this.K = defaultChildQuery;
        this.Ci = defaultChildFilter;
        this.Bi = defaultChildMap;
        this.isBound = false;
        this.L = t;
        this.obj = e;
        this.cb = s;
        this.K = i;
        this.Ci = n;
        this.Bi = r;
        this.O = l;
        this.cs = createMutationObserver(this.oi = t.host, (() => {
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
        this.cs.observe(this.oi, this.O);
        this.ki = this.Ai();
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.cs.disconnect();
        this.ki = e.emptyArray;
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
        return filterChildren(this.L, this.K, this.Ci, this.Bi);
    }
}

const $s = {
    childList: true
};

const defaultChildQuery = t => t.host.childNodes;

const defaultChildFilter = (t, e, s) => !!s;

const defaultChildMap = (t, e, s) => s;

const Ns = {
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
        h = findElementControllerFor(a, Ns);
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
        K(dt, this).register(t);
    }
    hydrating(t, e) {
        const s = this.X;
        const i = new ChildrenBinding(e, t, t[s.callback ?? `${h(s.name)}Changed`], s.query ?? defaultChildQuery, s.filter ?? defaultChildFilter, s.map ?? defaultChildMap, s.options ?? $s);
        v(t, s.name, {
            enumerable: true,
            configurable: true,
            get: d((() => i.getValue()), {
                getObserver: () => i
            }),
            set: () => {}
        });
        e.addBinding(i);
    }
}

let Ws = false;

exports.BindingCommand = i.BindingCommand;

exports.BindingMode = i.BindingMode;

exports.AdoptedStyleSheetsStyles = AdoptedStyleSheetsStyles;

exports.AppRoot = AppRoot;

exports.AppTask = lt;

exports.ArrayLikeHandler = ArrayLikeHandler;

exports.AttrBindingBehavior = AttrBindingBehavior;

exports.AttrMapper = AttrMapper;

exports.AttributeBinding = AttributeBinding;

exports.AttributeBindingRenderer = se;

exports.AttributeNSAccessor = AttributeNSAccessor;

exports.AuCompose = AuCompose;

exports.AuSlot = AuSlot;

exports.AuSlotsInfo = AuSlotsInfo;

exports.Aurelia = Aurelia;

exports.Bindable = W;

exports.BindableDefinition = BindableDefinition;

exports.BindingBehavior = J;

exports.BindingBehaviorDefinition = BindingBehaviorDefinition;

exports.BindingContext = BindingContext;

exports.BindingModeBehavior = BindingModeBehavior;

exports.BindingTargetSubscriber = BindingTargetSubscriber;

exports.CSSModulesProcessorRegistry = CSSModulesProcessorRegistry;

exports.Case = Case;

exports.CheckedObserver = CheckedObserver;

exports.ChildrenBinding = ChildrenBinding;

exports.ClassAttributeAccessor = ClassAttributeAccessor;

exports.ComputedWatcher = ComputedWatcher;

exports.ContentBinding = ContentBinding;

exports.Controller = Controller;

exports.CustomAttribute = ft;

exports.CustomAttributeDefinition = CustomAttributeDefinition;

exports.CustomAttributeRenderer = Nt;

exports.CustomElement = ls;

exports.CustomElementDefinition = CustomElementDefinition;

exports.CustomElementRenderer = $t;

exports.DataAttributeAccessor = DataAttributeAccessor;

exports.DebounceBindingBehavior = DebounceBindingBehavior;

exports.DefaultBindingLanguage = Vs;

exports.DefaultBindingSyntax = Ps;

exports.DefaultCase = DefaultCase;

exports.DefaultComponents = Is;

exports.DefaultRenderers = Os;

exports.DefaultResources = Fs;

exports.Else = Else;

exports.EventModifier = EventModifier;

exports.EventModifierRegistration = Mt;

exports.ExpressionWatcher = ExpressionWatcher;

exports.FlushQueue = FlushQueue;

exports.Focus = Focus;

exports.FragmentNodeSequence = FragmentNodeSequence;

exports.FromViewBindingBehavior = FromViewBindingBehavior;

exports.FulfilledTemplateController = FulfilledTemplateController;

exports.IAppRoot = hs;

exports.IAppTask = ot;

exports.IAuSlotWatcher = Vt;

exports.IAuSlotsInfo = _t;

exports.IAurelia = cs;

exports.IController = Ne;

exports.IEventModifier = Lt;

exports.IEventTarget = Ke;

exports.IFlushQueue = wt;

exports.IHistory = ts;

exports.IHydrationContext = We;

exports.IKeyMapping = Tt;

exports.ILifecycleHooks = dt;

exports.IListenerBindingOptions = Qt;

exports.ILocation = Je;

exports.IModifiedEventHandlerCreator = Et;

exports.INode = Ge;

exports.IPlatform = at;

exports.IRenderLocation = Xe;

exports.IRenderer = Ot;

exports.IRendering = fe;

exports.IRepeatableHandler = Bs;

exports.IRepeatableHandlerResolver = Cs;

exports.ISVGAnalyzer = us;

exports.ISanitizer = qs;

exports.IShadowDOMGlobalStyles = ge;

exports.IShadowDOMStyleFactory = de;

exports.IShadowDOMStyles = pe;

exports.ISignaler = it;

exports.IViewFactory = Dt;

exports.IWindow = Ze;

exports.If = If;

exports.InterpolationBinding = InterpolationBinding;

exports.InterpolationBindingRenderer = Ut;

exports.InterpolationPartBinding = InterpolationPartBinding;

exports.IteratorBindingRenderer = Kt;

exports.LetBinding = LetBinding;

exports.LetElementRenderer = jt;

exports.LifecycleHooks = pt;

exports.LifecycleHooksDefinition = LifecycleHooksDefinition;

exports.LifecycleHooksEntry = LifecycleHooksEntry;

exports.ListenerBinding = ListenerBinding;

exports.ListenerBindingOptions = ListenerBindingOptions;

exports.ListenerBindingRenderer = Yt;

exports.NodeObserverLocator = NodeObserverLocator;

exports.NoopSVGAnalyzer = NoopSVGAnalyzer;

exports.OneTimeBindingBehavior = OneTimeBindingBehavior;

exports.PendingTemplateController = PendingTemplateController;

exports.Portal = Portal;

exports.PromiseTemplateController = PromiseTemplateController;

exports.PropertyBinding = PropertyBinding;

exports.PropertyBindingRenderer = Gt;

exports.RefBinding = RefBinding;

exports.RefBindingRenderer = zt;

exports.RejectedTemplateController = RejectedTemplateController;

exports.Rendering = Rendering;

exports.Repeat = Repeat;

exports.RuntimeTemplateCompilerImplementation = fs;

exports.SVGAnalyzer = SVGAnalyzer;

exports.SanitizeValueConverter = SanitizeValueConverter;

exports.Scope = Scope;

exports.SelectValueObserver = SelectValueObserver;

exports.SelfBindingBehavior = SelfBindingBehavior;

exports.SetAttributeRenderer = Zt;

exports.SetClassAttributeRenderer = Jt;

exports.SetPropertyRenderer = Ht;

exports.SetStyleAttributeRenderer = te;

exports.ShadowDOMRegistry = ShadowDOMRegistry;

exports.ShortHandBindingSyntax = _s;

exports.SignalBindingBehavior = SignalBindingBehavior;

exports.SpreadRenderer = ie;

exports.StandardConfiguration = Hs;

exports.State = $e;

exports.StyleAttributeAccessor = StyleAttributeAccessor;

exports.StyleConfiguration = me;

exports.StyleElementStyles = StyleElementStyles;

exports.StylePropertyBindingRenderer = ee;

exports.Switch = Switch;

exports.TemplateControllerRenderer = Wt;

exports.TextBindingRenderer = Xt;

exports.ThrottleBindingBehavior = ThrottleBindingBehavior;

exports.ToViewBindingBehavior = ToViewBindingBehavior;

exports.TwoWayBindingBehavior = TwoWayBindingBehavior;

exports.UpdateTriggerBindingBehavior = UpdateTriggerBindingBehavior;

exports.ValueAttributeObserver = ValueAttributeObserver;

exports.ValueConverter = xt;

exports.ValueConverterDefinition = ValueConverterDefinition;

exports.ViewFactory = ViewFactory;

exports.Watch = ht;

exports.With = With;

exports.alias = alias;

exports.astAssign = E;

exports.astBind = L;

exports.astEvaluate = T;

exports.astUnbind = M;

exports.bindable = bindable;

exports.bindingBehavior = bindingBehavior;

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

exports.isRenderLocation = isRenderLocation;

exports.lifecycleHooks = lifecycleHooks;

exports.mixinAstEvaluator = bt;

exports.mixinUseScope = vt;

exports.mixingBindingLimited = yt;

exports.processContent = processContent;

exports.registerAliases = registerAliases;

exports.renderer = renderer;

exports.setEffectiveParentNode = setEffectiveParentNode;

exports.setRef = setRef;

exports.shadowCSS = shadowCSS;

exports.slotted = slotted;

exports.templateController = templateController;

exports.useShadowDOM = useShadowDOM;

exports.valueConverter = valueConverter;

exports.watch = watch;
//# sourceMappingURL=index.cjs.map
