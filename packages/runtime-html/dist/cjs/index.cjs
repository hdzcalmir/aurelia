"use strict";

var t = require("@aurelia/expression-parser");

var e = require("@aurelia/kernel");

var s = require("@aurelia/runtime");

var i = require("@aurelia/metadata");

var n = require("@aurelia/platform-browser");

var r = require("@aurelia/platform");

const l = Object;

const a = String;

const h = l.prototype;

const createLookup = () => l.create(null);

const createError$1 = t => new Error(t);

const c = h.hasOwnProperty;

const u = l.freeze;

const f = l.assign;

const d = l.getOwnPropertyNames;

const p = l.keys;

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

const isFunction = t => typeof t === "function";

const isObject = t => t instanceof l;

const isString = t => typeof t === "string";

const isSymbol = t => typeof t === "symbol";

const rethrow = t => {
    throw t;
};

const g = l.is;

const x = Reflect.defineProperty;

const defineHiddenProp = (t, e, s) => {
    x(t, e, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: s
    });
    return s;
};

const addSignalListener = (t, e, s) => t.addSignalListener(e, s);

const removeSignalListener = (t, e, s) => t.removeSignalListener(e, s);

const v = "Interpolation";

const w = "IsIterator";

const b = "IsFunction";

const y = "IsProperty";

const k = "pending";

const C = "running";

const A = s.AccessorType.Observer;

const B = s.AccessorType.Node;

const S = s.AccessorType.Layout;

const createMappedError = (t, ...e) => new Error(`AUR${a(t).padStart(4, "0")}:${e.map(a)}`);

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

const {astAssign: T, astEvaluate: E, astBind: R, astUnbind: I} = /*@__PURE__*/ (() => {
    const s = "AccessThis";
    const i = "AccessBoundary";
    const n = "AccessGlobal";
    const r = "AccessScope";
    const l = "ArrayLiteral";
    const h = "ObjectLiteral";
    const c = "PrimitiveLiteral";
    const u = "Template";
    const f = "Unary";
    const d = "CallScope";
    const p = "CallMember";
    const m = "CallFunction";
    const g = "CallGlobal";
    const x = "AccessMember";
    const v = "AccessKeyed";
    const w = "TaggedTemplate";
    const b = "Binary";
    const y = "Conditional";
    const k = "Assign";
    const C = "ArrowFunction";
    const A = "ValueConverter";
    const B = "BindingBehavior";
    const S = "ArrayBindingPattern";
    const T = "ObjectBindingPattern";
    const E = "BindingIdentifier";
    const R = "ForOfStatement";
    const I = "Interpolation";
    const P = "ArrayDestructuring";
    const L = "ObjectDestructuring";
    const D = "DestructuringAssignmentLeaf";
    const M = "Custom";
    const _ = Scope.getContext;
    function astEvaluate(t, e, F, O) {
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
                const s = _(e, t.name, t.ancestor);
                if (O !== null) {
                    O.observe(s, t.name);
                }
                const i = s[t.name];
                if (i == null && t.name === "$host") {
                    throw createMappedError(105);
                }
                if (F?.strict) {
                    return F?.boundFn && isFunction(i) ? i.bind(s) : i;
                }
                return i == null ? "" : F?.boundFn && isFunction(i) ? i.bind(s) : i;
            }

          case n:
            return globalThis[t.name];

          case g:
            {
                const s = globalThis[t.name];
                if (isFunction(s)) {
                    return s(...t.args.map((t => astEvaluate(t, e, F, O))));
                }
                if (!F?.strictFnCall && s == null) {
                    return void 0;
                }
                throw createMappedError(107);
            }

          case l:
            return t.elements.map((t => astEvaluate(t, e, F, O)));

          case h:
            {
                const s = {};
                for (let i = 0; i < t.keys.length; ++i) {
                    s[t.keys[i]] = astEvaluate(t.values[i], e, F, O);
                }
                return s;
            }

          case c:
            return t.value;

          case u:
            {
                let s = t.cooked[0];
                for (let i = 0; i < t.expressions.length; ++i) {
                    s += String(astEvaluate(t.expressions[i], e, F, O));
                    s += t.cooked[i + 1];
                }
                return s;
            }

          case f:
            switch (t.operation) {
              case "void":
                return void astEvaluate(t.expression, e, F, O);

              case "typeof":
                return typeof astEvaluate(t.expression, e, F, O);

              case "!":
                return !astEvaluate(t.expression, e, F, O);

              case "-":
                return -astEvaluate(t.expression, e, F, O);

              case "+":
                return +astEvaluate(t.expression, e, F, O);

              default:
                throw createMappedError(109, t.operation);
            }

          case d:
            {
                const s = t.args.map((t => astEvaluate(t, e, F, O)));
                const i = _(e, t.name, t.ancestor);
                const n = getFunction(F?.strictFnCall, i, t.name);
                if (n) {
                    return n.apply(i, s);
                }
                return void 0;
            }

          case p:
            {
                const s = astEvaluate(t.object, e, F, O);
                const i = t.args.map((t => astEvaluate(t, e, F, O)));
                const n = getFunction(F?.strictFnCall, s, t.name);
                let r;
                if (n) {
                    r = n.apply(s, i);
                    if (isArray(s) && q.includes(t.name)) {
                        O?.observeCollection(s);
                    }
                }
                return r;
            }

          case m:
            {
                const s = astEvaluate(t.func, e, F, O);
                if (isFunction(s)) {
                    return s(...t.args.map((t => astEvaluate(t, e, F, O))));
                }
                if (!F?.strictFnCall && s == null) {
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
                    return astEvaluate(t.body, a, F, O);
                };
                return func;
            }

          case x:
            {
                const s = astEvaluate(t.object, e, F, O);
                let i;
                if (F?.strict) {
                    if (s == null) {
                        return undefined;
                    }
                    if (O !== null && !t.accessGlobal) {
                        O.observe(s, t.name);
                    }
                    i = s[t.name];
                    if (F?.boundFn && isFunction(i)) {
                        return i.bind(s);
                    }
                    return i;
                }
                if (O !== null && isObject(s) && !t.accessGlobal) {
                    O.observe(s, t.name);
                }
                if (s) {
                    i = s[t.name];
                    if (F?.boundFn && isFunction(i)) {
                        return i.bind(s);
                    }
                    return i;
                }
                return "";
            }

          case v:
            {
                const s = astEvaluate(t.object, e, F, O);
                const i = astEvaluate(t.key, e, F, O);
                if (isObject(s)) {
                    if (O !== null && !t.accessGlobal) {
                        O.observe(s, i);
                    }
                    return s[i];
                }
                return s == null ? void 0 : s[i];
            }

          case w:
            {
                const s = t.expressions.map((t => astEvaluate(t, e, F, O)));
                const i = astEvaluate(t.func, e, F, O);
                if (!isFunction(i)) {
                    throw createMappedError(110);
                }
                return i(t.cooked, ...s);
            }

          case b:
            {
                const s = t.left;
                const i = t.right;
                switch (t.operation) {
                  case "&&":
                    return astEvaluate(s, e, F, O) && astEvaluate(i, e, F, O);

                  case "||":
                    return astEvaluate(s, e, F, O) || astEvaluate(i, e, F, O);

                  case "??":
                    return astEvaluate(s, e, F, O) ?? astEvaluate(i, e, F, O);

                  case "==":
                    return astEvaluate(s, e, F, O) == astEvaluate(i, e, F, O);

                  case "===":
                    return astEvaluate(s, e, F, O) === astEvaluate(i, e, F, O);

                  case "!=":
                    return astEvaluate(s, e, F, O) != astEvaluate(i, e, F, O);

                  case "!==":
                    return astEvaluate(s, e, F, O) !== astEvaluate(i, e, F, O);

                  case "instanceof":
                    {
                        const t = astEvaluate(i, e, F, O);
                        if (isFunction(t)) {
                            return astEvaluate(s, e, F, O) instanceof t;
                        }
                        return false;
                    }

                  case "in":
                    {
                        const t = astEvaluate(i, e, F, O);
                        if (isObject(t)) {
                            return astEvaluate(s, e, F, O) in t;
                        }
                        return false;
                    }

                  case "+":
                    {
                        const t = astEvaluate(s, e, F, O);
                        const n = astEvaluate(i, e, F, O);
                        if (F?.strict) {
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
                    return astEvaluate(s, e, F, O) - astEvaluate(i, e, F, O);

                  case "*":
                    return astEvaluate(s, e, F, O) * astEvaluate(i, e, F, O);

                  case "/":
                    return astEvaluate(s, e, F, O) / astEvaluate(i, e, F, O);

                  case "%":
                    return astEvaluate(s, e, F, O) % astEvaluate(i, e, F, O);

                  case "<":
                    return astEvaluate(s, e, F, O) < astEvaluate(i, e, F, O);

                  case ">":
                    return astEvaluate(s, e, F, O) > astEvaluate(i, e, F, O);

                  case "<=":
                    return astEvaluate(s, e, F, O) <= astEvaluate(i, e, F, O);

                  case ">=":
                    return astEvaluate(s, e, F, O) >= astEvaluate(i, e, F, O);

                  default:
                    throw createMappedError(108, t.operation);
                }
            }

          case y:
            return astEvaluate(t.condition, e, F, O) ? astEvaluate(t.yes, e, F, O) : astEvaluate(t.no, e, F, O);

          case k:
            return astAssign(t.target, e, F, astEvaluate(t.value, e, F, O));

          case A:
            {
                const s = F?.getConverter?.(t.name);
                if (s == null) {
                    throw createMappedError(103, t.name);
                }
                if ("toView" in s) {
                    return s.toView(astEvaluate(t.expression, e, F, O), ...t.args.map((t => astEvaluate(t, e, F, O))));
                }
                return astEvaluate(t.expression, e, F, O);
            }

          case B:
            return astEvaluate(t.expression, e, F, O);

          case E:
            return t.name;

          case R:
            return astEvaluate(t.iterable, e, F, O);

          case I:
            if (t.isMulti) {
                let s = t.parts[0];
                let i = 0;
                for (;i < t.expressions.length; ++i) {
                    s += a(astEvaluate(t.expressions[i], e, F, O));
                    s += t.parts[i + 1];
                }
                return s;
            } else {
                return `${t.parts[0]}${astEvaluate(t.firstExpression, e, F, O)}${t.parts[1]}`;
            }

          case D:
            return astEvaluate(t.target, e, F, O);

          case P:
            {
                return t.list.map((t => astEvaluate(t, e, F, O)));
            }

          case S:
          case T:
          case L:
          default:
            return void 0;

          case M:
            return t.evaluate(e, F, O);
        }
    }
    function astAssign(s, i, n, l) {
        switch (s.$kind) {
          case r:
            {
                if (s.name === "$host") {
                    throw createMappedError(106);
                }
                const t = _(i, s.name, s.ancestor);
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

          case A:
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

          case B:
            return astAssign(s.expression, i, n, l);

          case P:
          case L:
            {
                const t = s.list;
                const e = t.length;
                let r;
                let a;
                for (r = 0; r < e; r++) {
                    a = t[r];
                    switch (a.$kind) {
                      case D:
                        astAssign(a, i, n, l);
                        break;

                      case P:
                      case L:
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

          case D:
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

          case M:
            return s.assign(i, n, l);

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

          case R:
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

          case R:
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
    const q = "at map filter includes indexOf lastIndexOf findIndex find flat flatMap join reduce reduceRight slice every some sort".split(" ");
    return {
        astEvaluate: astEvaluate,
        astAssign: astAssign,
        astBind: astBind,
        astUnbind: astUnbind
    };
})();

const P = 1;

const L = 2;

const D = 4;

const M = 6;

const _ = 8;

const q = /*@__PURE__*/ u({
    oneTime: P,
    toView: L,
    fromView: D,
    twoWay: M,
    default: _
});

const F = i.Metadata.get;

const O = i.Metadata.has;

const H = i.Metadata.define;

const {annotation: V} = e.Protocol;

const N = V.keyFor;

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
        const r = e.metadata[$] ??= createLookup();
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

const $ = /*@__PURE__*/ N("bindables");

const j = u({
    name: $,
    keyFrom: t => `${$}:${t}`,
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
                p(t).forEach((e => addDescription(e, t[e])));
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
            const t = F($, r);
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
        return new BindableDefinition(s.attribute ?? e.kebabCase(t), s.callback ?? `${t}Changed`, s.mode ?? L, s.primary ?? false, s.name ?? t, s.set ?? getInterceptor(s));
    }
}

function coercer(t, e) {
    e.addInitializer((function() {
        W.define(this, e.name);
    }));
}

const W = {
    key: /*@__PURE__*/ N("coercer"),
    define(t, e) {
        H(t[e].bind(t), t, W.key);
    },
    for(t) {
        return F(W.key, t);
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
            i = typeof t === "function" ? t.bind(s) : W.for(s) ?? e.noop;
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

const U = e.DI.createInterface;

const z = e.Registration.singleton;

const G = e.Registration.aliasTo;

const K = e.Registration.instance;

e.Registration.callback;

e.Registration.transient;

const registerResolver = (t, e, s) => t.registerResolver(e, s);

function alias(...t) {
    return function(e, s) {
        s.addInitializer((function() {
            const e = N("aliases");
            const s = F(e, this);
            if (s === void 0) {
                H(t, this, e);
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

const X = "element";

const Q = "attribute";

const Y = "__au_static_resource__";

const getDefinitionFromStaticAu = (t, e, s) => {
    let i = F(Y, t);
    if (i == null) {
        if (t.$au?.type === e) {
            i = s(t.$au, t);
            H(i, t, Y);
        }
    }
    return i;
};

function bindingBehavior(t) {
    return function(e, s) {
        s.addInitializer((function() {
            tt.define(t, this);
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
        return new BindingBehaviorDefinition(s, e.firstDefined(getBehaviorAnnotation(s, "name"), i), e.mergeArrays(getBehaviorAnnotation(s, "aliases"), n.aliases, s.aliases), tt.keyFrom(i));
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getBindingBehaviorKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : z(s, s), G(s, i), ...n.map((t => G(s, getBindingBehaviorKeyFrom(t)))));
        }
    }
}

const Z = "binding-behavior";

const J = /*@__PURE__*/ e.getResourceKeyFor(Z);

const getBehaviorAnnotation = (t, e) => F(N(e), t);

const getBindingBehaviorKeyFrom = t => `${J}:${t}`;

const tt = u({
    name: J,
    keyFrom: getBindingBehaviorKeyFrom,
    isType(t) {
        return isFunction(t) && (O(J, t) || t.$au?.type === Z);
    },
    define(t, s) {
        const i = BindingBehaviorDefinition.create(t, s);
        const n = i.Type;
        H(i, n, J, e.resourceBaseName);
        return n;
    },
    getDefinition(t) {
        const e = F(J, t) ?? getDefinitionFromStaticAu(t, Z, BindingBehaviorDefinition.create);
        if (e === void 0) {
            throw createMappedError(151, t);
        }
        return e;
    },
    find(t, e) {
        const s = t.find(Z, e);
        return s == null ? null : F(J, s) ?? getDefinitionFromStaticAu(s, Z, BindingBehaviorDefinition.create) ?? null;
    },
    get(t, s) {
        return t.get(e.resource(getBindingBehaviorKeyFrom(s)));
    }
});

const et = new Map;

const createConfig = t => ({
    type: Z,
    name: t
});

class BindingModeBehavior {
    bind(t, e) {
        et.set(e, e.mode);
        e.mode = this.mode;
    }
    unbind(t, e) {
        e.mode = et.get(e);
        et.delete(e);
    }
}

class OneTimeBindingBehavior extends BindingModeBehavior {
    get mode() {
        return P;
    }
}

OneTimeBindingBehavior.$au = createConfig("oneTime");

class ToViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return L;
    }
}

ToViewBindingBehavior.$au = createConfig("toView");

class FromViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return D;
    }
}

FromViewBindingBehavior.$au = createConfig("fromView");

class TwoWayBindingBehavior extends BindingModeBehavior {
    get mode() {
        return M;
    }
}

TwoWayBindingBehavior.$au = createConfig("twoWay");

const st = new WeakMap;

const it = 200;

class DebounceBindingBehavior {
    constructor() {
        this.p = e.resolve(e.IPlatform);
    }
    bind(t, s, i, n) {
        const r = {
            type: "debounce",
            delay: i ?? it,
            now: this.p.performanceNow,
            queue: this.p.taskQueue,
            signals: isString(n) ? [ n ] : n ?? e.emptyArray
        };
        const l = s.limit?.(r);
        if (l == null) ; else {
            st.set(s, l);
        }
    }
    unbind(t, e) {
        st.get(e)?.dispose();
        st.delete(e);
    }
}

DebounceBindingBehavior.$au = {
    type: Z,
    name: "debounce"
};

const nt = /*@__PURE__*/ U("ISignaler", (t => t.singleton(Signaler)));

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
        this.u = e.resolve(nt);
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
    type: Z,
    name: "signal"
};

const rt = new WeakMap;

const ot = 200;

class ThrottleBindingBehavior {
    constructor() {
        ({performanceNow: this.C, taskQueue: this.A} = e.resolve(e.IPlatform));
    }
    bind(t, s, i, n) {
        const r = {
            type: "throttle",
            delay: i ?? ot,
            now: this.C,
            queue: this.A,
            signals: isString(n) ? [ n ] : n ?? e.emptyArray
        };
        const l = s.limit?.(r);
        if (l == null) ; else {
            rt.set(s, l);
        }
    }
    unbind(t, e) {
        rt.get(e)?.dispose();
        rt.delete(e);
    }
}

ThrottleBindingBehavior.$au = {
    type: Z,
    name: "throttle"
};

const lt = /*@__PURE__*/ U("IAppTask");

class $AppTask {
    constructor(t, e, s) {
        this.c = void 0;
        this.slot = t;
        this.k = e;
        this.cb = s;
    }
    register(t) {
        return this.c = t.register(K(lt, this));
    }
    run() {
        const t = this.k;
        const e = this.cb;
        return t === null ? e() : e(this.c.get(t));
    }
}

const at = u({
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

const ht = e.IPlatform;

function watch(t, e) {
    if (t == null) {
        throw createMappedError(772);
    }
    return function decorator(s, i) {
        const n = i.kind === "class";
        if (n) {
            if (!isFunction(e) && (e == null || !(e in s.prototype))) {
                throw createMappedError(773, `${a(e)}@${s.name}}`);
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
            ct.add(t, r);
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

const ct = /*@__PURE__*/ (() => {
    const t = new WeakMap;
    return u({
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
    get kind() {
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
        return new CustomAttributeDefinition(s, e.firstDefined(getAttributeAnnotation(s, "name"), i), e.mergeArrays(getAttributeAnnotation(s, "aliases"), n.aliases, s.aliases), getAttributeKeyFrom(i), e.firstDefined(getAttributeAnnotation(s, "defaultBindingMode"), n.defaultBindingMode, s.defaultBindingMode, L), e.firstDefined(getAttributeAnnotation(s, "isTemplateController"), n.isTemplateController, s.isTemplateController, false), j.from(...j.getAll(s), getAttributeAnnotation(s, "bindables"), s.bindables, n.bindables), e.firstDefined(getAttributeAnnotation(s, "noMultiBindings"), n.noMultiBindings, s.noMultiBindings, false), e.mergeArrays(ct.getDefinitions(s), s.watches), e.mergeArrays(getAttributeAnnotation(s, "dependencies"), n.dependencies, s.dependencies), e.firstDefined(getAttributeAnnotation(s, "containerStrategy"), n.containerStrategy, s.containerStrategy, "reuse"));
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getAttributeKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : z(s, s), G(s, i), ...n.map((t => G(s, getAttributeKeyFrom(t)))));
        }
    }
    toString() {
        return `au:ca:${this.name}`;
    }
}

const ut = "custom-attribute";

const ft = /*@__PURE__*/ e.getResourceKeyFor(ut);

const getAttributeKeyFrom = t => `${ft}:${t}`;

const getAttributeAnnotation = (t, e) => F(N(e), t);

const isAttributeType = t => isFunction(t) && (O(ft, t) || t.$au?.type === ut);

const findAttributeControllerFor = (t, e) => getRef(t, getAttributeKeyFrom(e)) ?? void 0;

const defineAttribute = (t, s) => {
    const i = CustomAttributeDefinition.create(t, s);
    const n = i.Type;
    H(i, n, ft, e.resourceBaseName);
    return n;
};

const getAttributeDefinition = t => {
    const e = F(ft, t) ?? getDefinitionFromStaticAu(t, ut, CustomAttributeDefinition.create);
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

const dt = u({
    name: ft,
    keyFrom: getAttributeKeyFrom,
    isType: isAttributeType,
    for: findAttributeControllerFor,
    closest: findClosestControllerByName,
    define: defineAttribute,
    getDefinition: getAttributeDefinition,
    annotate(t, e, s) {
        H(s, t, N(e));
    },
    getAnnotation: getAttributeAnnotation,
    find(t, e) {
        const s = t.find(ut, e);
        return s === null ? null : F(ft, s) ?? getDefinitionFromStaticAu(s, ut, CustomAttributeDefinition.create) ?? null;
    }
});

const pt = /*@__PURE__*/ U("ILifecycleHooks");

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
            for (const t of d(i)) {
                if (t !== "constructor" && !t.startsWith("_")) {
                    s.add(t);
                }
            }
            i = Object.getPrototypeOf(i);
        }
        return new LifecycleHooksDefinition(e, s);
    }
}

const mt = /*@__PURE__*/ (() => {
    const t = new WeakMap;
    const s = new WeakMap;
    return u({
        define(t, i) {
            const n = LifecycleHooksDefinition.create(t, i);
            const r = n.Type;
            s.set(r, n);
            return e.Registrable.define(r, (t => {
                z(pt, r).register(t);
            }));
        },
        resolve(e) {
            let i = t.get(e);
            if (i === void 0) {
                t.set(e, i = new LifecycleHooksLookupImpl);
                const n = e.root;
                const r = n === e ? e.getAll(pt) : e.has(pt, false) ? n.getAll(pt).concat(e.getAll(pt)) : n.getAll(pt);
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
        return mt.define({}, t);
    }
    return t == null ? decorator : decorator(t);
}

function valueConverter(t) {
    return function(e, s) {
        s.addInitializer((function() {
            vt.define(t, this);
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
        return new ValueConverterDefinition(s, e.firstDefined(getConverterAnnotation(s, "name"), i), e.mergeArrays(getConverterAnnotation(s, "aliases"), n.aliases, s.aliases), vt.keyFrom(i));
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getValueConverterKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : z(s, s), G(s, i), ...n.map((t => G(s, getValueConverterKeyFrom(t)))));
        }
    }
}

const gt = "value-converter";

const xt = /*@__PURE__*/ e.getResourceKeyFor(gt);

const getConverterAnnotation = (t, e) => F(N(e), t);

const getValueConverterKeyFrom = t => `${xt}:${t}`;

const vt = u({
    name: xt,
    keyFrom: getValueConverterKeyFrom,
    isType(t) {
        return isFunction(t) && (O(xt, t) || t.$au?.type === gt);
    },
    define(t, s) {
        const i = ValueConverterDefinition.create(t, s);
        const n = i.Type;
        H(i, n, xt, e.resourceBaseName);
        return n;
    },
    getDefinition(t) {
        const e = F(xt, t) ?? getDefinitionFromStaticAu(t, gt, ValueConverterDefinition.create);
        if (e === void 0) {
            throw createMappedError(152, t);
        }
        return e;
    },
    annotate(t, e, s) {
        H(s, t, N(e));
    },
    getAnnotation: getConverterAnnotation,
    find(t, e) {
        const s = t.find(gt, e);
        return s == null ? null : F(xt, s) ?? getDefinitionFromStaticAu(s, gt, ValueConverterDefinition.create) ?? null;
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
        if (t !== E(s.ast, s.s, s, null)) {
            this.v = t;
            this.B.add(this);
        }
    }
}

const wt = /*@__PURE__*/ (() => {
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
        return this.l.root.get(nt);
    }
    function evaluatorGetConverter(e) {
        let s = t.get(this);
        if (s == null) {
            t.set(this, s = new ResourceLookup);
        }
        return s[e] ??= vt.get(this.l, e);
    }
    function evaluatorGetBehavior(t) {
        let s = e.get(this);
        if (s == null) {
            e.set(this, s = new ResourceLookup);
        }
        return s[t] ??= tt.get(this.l, t);
    }
    return (t, e = true) => s => {
        const i = s.prototype;
        if (t != null) {
            x(i, "strict", {
                enumerable: true,
                get: function() {
                    return t;
                }
            });
        }
        x(i, "strictFnCall", {
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

const yt = /*@__PURE__*/ U("IFlushQueue", (t => t.singleton(FlushQueue)));

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

const kt = /*@__PURE__*/ (() => {
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
            l = i?.status === k;
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
            h = i?.status === k;
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
            const r = n.length > 0 ? this.get(nt) : null;
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
                let n = a(t);
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
                    e.setAttribute(s, a(t));
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
        const e = E(this.ast, this.s, this, (this.mode & L) > 0 ? this : null);
        this.obs.clear();
        if (e !== this.v) {
            this.v = e;
            const s = this.P.state !== ns;
            if (s) {
                t = this.I;
                this.I = this.A.queueTask((() => {
                    this.I = null;
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
        R(this.ast, t, this);
        if (this.mode & (L | P)) {
            this.updateTarget(this.v = E(this.ast, t, this, (this.mode & L) > 0 ? this : null));
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        I(this.ast, this.s, this);
        this.s = void 0;
        this.v = void 0;
        this.I?.cancel();
        this.I = null;
        this.obs.clearAll();
    }
}

(() => {
    wt(AttributeBinding);
    kt(AttributeBinding, (() => "updateTarget"));
    s.connectable(AttributeBinding, null);
    bt(true)(AttributeBinding);
})();

const At = {
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
        const l = this.P.state !== ns && (r.type & S) > 0;
        let a;
        if (l) {
            a = this.I;
            this.I = this.A.queueTask((() => {
                this.I = null;
                r.setValue(i, this.target, this.targetProperty);
            }), At);
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
        this.mode = L;
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
        const t = E(this.ast, this.s, this, (this.mode & L) > 0 ? this : null);
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
        R(this.ast, t, this);
        this.v = E(this.ast, this.s, this, (this.mode & L) > 0 ? this : null);
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
        I(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

(() => {
    wt(InterpolationPartBinding);
    kt(InterpolationPartBinding, (() => "updateTarget"));
    s.connectable(InterpolationPartBinding, null);
    bt(true)(InterpolationPartBinding);
})();

const Bt = {
    reusable: false,
    preempt: true
};

class ContentBinding {
    constructor(t, e, s, i, n, r, l) {
        this.p = n;
        this.ast = r;
        this.target = l;
        this.isBound = false;
        this.mode = L;
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
        e.textContent = a(t ?? "");
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = E(this.ast, this.s, this, (this.mode & L) > 0 ? this : null);
        this.obs.clear();
        if (t === this.v) {
            this.I?.cancel();
            this.I = null;
            return;
        }
        const e = this.P.state !== ns;
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
        const t = this.v = E(this.ast, this.s, this, (this.mode & L) > 0 ? this : null);
        this.obs.clear();
        if (isArray(t)) {
            this.observeCollection(t);
        }
        const e = this.P.state !== ns;
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
        R(this.ast, t, this);
        const e = this.v = E(this.ast, this.s, this, (this.mode & L) > 0 ? this : null);
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
        I(this.ast, this.s, this);
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
        }), Bt);
        e?.cancel();
    }
}

(() => {
    wt(ContentBinding);
    kt(ContentBinding, (() => "updateTarget"));
    s.connectable(ContentBinding, null);
    bt(void 0, false)(ContentBinding);
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
        this.target = this.F ? t.bindingContext : t.overrideContext;
        R(this.ast, t, this);
        this.v = E(this.ast, this.s, this, this);
        this.updateTarget();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        I(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

(() => {
    wt(LetBinding);
    kt(LetBinding, (() => "updateTarget"));
    s.connectable(LetBinding, null);
    bt(true)(LetBinding);
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
        T(this.ast, this.s, this, t);
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = E(this.ast, this.s, this, (this.mode & L) > 0 ? this : null);
        this.obs.clear();
        const e = this.P.state !== ns && (this.L.type & S) > 0;
        if (e) {
            St = this.I;
            this.I = this.A.queueTask((() => {
                this.updateTarget(t);
                this.I = null;
            }), Tt);
            St?.cancel();
            St = null;
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
        R(this.ast, t, this);
        const e = this.oL;
        const s = this.mode;
        let i = this.L;
        if (!i) {
            if (s & D) {
                i = e.getObserver(this.target, this.targetProperty);
            } else {
                i = e.getAccessor(this.target, this.targetProperty);
            }
            this.L = i;
        }
        const n = (s & L) > 0;
        if (s & (L | P)) {
            this.updateTarget(E(this.ast, this.s, this, n ? this : null));
        }
        if (s & D) {
            i.subscribe(this.O ??= new BindingTargetSubscriber(this, this.l.get(yt)));
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
        I(this.ast, this.s, this);
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
    wt(PropertyBinding);
    kt(PropertyBinding, (t => t.mode & D ? "updateSource" : "updateTarget"));
    s.connectable(PropertyBinding, null);
    bt(true, false)(PropertyBinding);
})();

let St = null;

const Tt = {
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
        R(this.ast, t, this);
        T(this.ast, this.s, this, this.target);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        if (E(this.ast, this.s, this, null) === this.target) {
            T(this.ast, this.s, this, null);
        }
        I(this.ast, this.s, this);
        this.s = void 0;
    }
}

(() => {
    bt(false)(RefBinding);
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
        let s = E(this.ast, this.s, this, null);
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
        R(this.ast, t, this);
        this.target.addEventListener(this.targetEvent, this, this.V);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        I(this.ast, this.s, this);
        this.s = void 0;
        this.target.removeEventListener(this.targetEvent, this, this.V);
    }
}

(() => {
    wt(ListenerBinding);
    kt(ListenerBinding, (() => "callSource"));
    bt(true, true)(ListenerBinding);
})();

const Et = /*@__PURE__*/ U("IEventModifier");

const Rt = /*@__PURE__*/ U("IKeyMapping", (t => t.instance({
    meta: u([ "ctrl", "alt", "shift", "meta" ]),
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
        this.N = e.resolve(Rt);
        this.$ = [ "left", "middle", "right" ];
    }
    static register(t) {
        t.register(z(Et, ModifiedMouseEventHandler));
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
        this.N = e.resolve(Rt);
        this.type = [ "keydown", "keyup" ];
    }
    static register(t) {
        t.register(z(Et, ModifiedKeyboardEventHandler));
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

const It = /*@__PURE__*/ U("IEventModifierHandler", (t => t.instance({
    getHandler: () => null
})));

class EventModifier {
    constructor() {
        this.j = e.resolve(e.all(Et)).reduce(((t, e) => {
            const s = isArray(e.type) ? e.type : [ e.type ];
            s.forEach((s => t[s] = e));
            return t;
        }), {});
    }
    static register(t) {
        t.register(z(It, EventModifier));
    }
    getHandler(t, e) {
        return isString(e) ? this.j[t]?.getHandler(e) ?? null : null;
    }
}

const Pt = {
    register(t) {
        t.register(EventModifier, ModifiedMouseEventHandler, ModifiedKeyboardEventHandler);
    }
};

const Lt = /*@__PURE__*/ U("IViewFactory");

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

const Dt = "au-start";

const Mt = "au-end";

const createElement = (t, e) => t.document.createElement(e);

const createComment = (t, e) => t.document.createComment(e);

const createLocation = t => {
    const e = createComment(t, Mt);
    e.$start = createComment(t, Dt);
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

const _t = "default";

const qt = "au-slot";

const Ft = /*@__PURE__*/ U("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

const Ot = /*@__PURE__*/ U("IAuSlotWatcher");

class AuSlotWatcherBinding {
    constructor(t, s, i, n) {
        this.G = new Set;
        this.K = e.emptyArray;
        this.isBound = false;
        this.cb = (this.o = t)[s];
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
        K(pt, this).register(t);
    }
    hydrating(t, e) {
        const s = this.Y;
        const i = new AuSlotWatcherBinding(t, s.callback ?? `${a(s.name)}Changed`, s.slotName ?? "default", s.query ?? "*");
        x(t, s.name, {
            enumerable: true,
            configurable: true,
            get: f((() => i.getValue()), {
                getObserver: () => i
            }),
            set: () => {}
        });
        K(Ot, i).register(e.container);
        e.addBinding(i);
    }
}

function slotted(t, e) {
    if (!Ht) {
        Ht = true;
        s.subscriberCollection(AuSlotWatcherBinding, null);
        lifecycleHooks()(SlottedLifecycleHooks, null);
    }
    const i = N("dependencies");
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

let Ht = false;

class SpreadBinding {
    static create(t, s, i, n, r, l, a, h) {
        const c = [];
        const u = n.renderers;
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
            const n = getHydrationContext(t);
            const f = new SpreadBinding(n);
            const d = r.compileSpread(n.controller.definition, n.instruction?.captures ?? e.emptyArray, n.controller.container, s, i);
            let p;
            for (p of d) {
                switch (p.type) {
                  case ne:
                    renderSpreadInstruction(t + 1);
                    break;

                  case re:
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
        if (t.vmKind !== es) {
            throw createMappedError(9998);
        }
        this.$controller.addChild(t);
    }
}

const Vt = "ra";

const Nt = "rb";

const $t = "rc";

const jt = "rd";

const Wt = "re";

const Ut = "rf";

const zt = "rg";

const Gt = "ri";

const Kt = "rj";

const Xt = "rk";

const Qt = "rl";

const Yt = "ha";

const Zt = "hb";

const Jt = "hc";

const te = "hd";

const ee = "he";

const se = "hf";

const ie = "hg";

const ne = "hs";

const re = "hp";

const oe = /*@__PURE__*/ u({
    hydrateElement: Vt,
    hydrateAttribute: Nt,
    hydrateTemplateController: $t,
    hydrateLetElement: jt,
    setProperty: Wt,
    interpolation: Ut,
    propertyBinding: zt,
    letBinding: Gt,
    refBinding: Kt,
    iteratorBinding: Xt,
    multiAttr: Qt,
    textBinding: Yt,
    listenerBinding: Zt,
    attributeBinding: Jt,
    stylePropertyBinding: te,
    setAttribute: ee,
    setClassAttribute: se,
    setStyleAttribute: ie,
    spreadBinding: ne,
    spreadElementProp: re
});

const le = /*@__PURE__*/ U("Instruction");

function isInstruction(t) {
    const e = t.type;
    return isString(e) && e.length === 2;
}

class InterpolationInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Ut;
    }
}

class PropertyBindingInstruction {
    constructor(t, e, s) {
        this.from = t;
        this.to = e;
        this.mode = s;
        this.type = zt;
    }
}

class IteratorBindingInstruction {
    constructor(t, e, s) {
        this.forOf = t;
        this.to = e;
        this.props = s;
        this.type = Xt;
    }
}

class RefBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Kt;
    }
}

class SetPropertyInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = Wt;
    }
}

class MultiAttrInstruction {
    constructor(t, e, s) {
        this.value = t;
        this.to = e;
        this.command = s;
        this.type = Qt;
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
        this.type = Vt;
    }
}

class HydrateAttributeInstruction {
    constructor(t, e, s) {
        this.res = t;
        this.alias = e;
        this.props = s;
        this.type = Nt;
    }
}

class HydrateTemplateController {
    constructor(t, e, s, i) {
        this.def = t;
        this.res = e;
        this.alias = s;
        this.props = i;
        this.type = $t;
    }
}

class HydrateLetElementInstruction {
    constructor(t, e) {
        this.instructions = t;
        this.toBindingContext = e;
        this.type = jt;
    }
}

class LetBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Gt;
    }
}

class TextBindingInstruction {
    constructor(t) {
        this.from = t;
        this.type = Yt;
    }
}

class ListenerBindingInstruction {
    constructor(t, e, s, i) {
        this.from = t;
        this.to = e;
        this.capture = s;
        this.modifier = i;
        this.type = Zt;
    }
}

class StylePropertyBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = te;
    }
}

class SetAttributeInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = ee;
    }
}

class SetClassAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = se;
    }
}

class SetStyleAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = ie;
    }
}

class AttributeBindingInstruction {
    constructor(t, e, s) {
        this.attr = t;
        this.from = e;
        this.to = s;
        this.type = Jt;
    }
}

class SpreadBindingInstruction {
    constructor() {
        this.type = ne;
    }
}

class SpreadElementPropBindingInstruction {
    constructor(t) {
        this.instructions = t;
        this.type = re;
    }
}

const ae = /*@__PURE__*/ U("ITemplateCompiler");

const he = /*@__PURE__*/ U("IRenderer");

function renderer(t, s) {
    return e.Registrable.define(t, (function(t) {
        z(he, this).register(t);
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

const ce = /*@__PURE__*/ renderer(class SetPropertyRenderer {
    constructor() {
        this.target = Wt;
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

const ue = /*@__PURE__*/ renderer(class CustomElementRenderer {
    constructor() {
        this.r = e.resolve(_e);
        this.target = Vt;
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
            l = Is.find(f, c);
            if (l == null) {
                throw createMappedError(752, s, t);
            }
            break;

          default:
            l = c;
        }
        const d = s.containerless || l.containerless;
        const m = d ? convertToRenderLocation(e) : null;
        const g = createElementContainer(i, t, e, s, m, u == null ? void 0 : new AuSlotsInfo(p(u)));
        a = g.invoke(l.Type);
        h = Controller.$el(g, a, e, s, l, m);
        setRef(e, l.key, h);
        const x = this.r.renderers;
        const v = s.props;
        const w = v.length;
        let b = 0;
        let y;
        while (w > b) {
            y = v[b];
            x[y.type].render(t, h, y, i, n, r);
            ++b;
        }
        t.addChild(h);
    }
});

const fe = /*@__PURE__*/ renderer(class CustomAttributeRenderer {
    constructor() {
        this.r = e.resolve(_e);
        this.target = Nt;
    }
    render(t, e, s, i, n, r) {
        let l = t.container;
        let a;
        switch (typeof s.res) {
          case "string":
            a = dt.find(l, s.res);
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
});

const de = /*@__PURE__*/ renderer(class TemplateControllerRenderer {
    constructor() {
        this.r = e.resolve(_e);
        this.target = $t;
    }
    render(t, e, s, i, n, r) {
        let l = t.container;
        let a;
        switch (typeof s.res) {
          case "string":
            a = dt.find(l, s.res);
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
});

const pe = /*@__PURE__*/ renderer(class LetElementRenderer {
    constructor() {
        this.target = jt;
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
            f = ensureExpression(n, u.from, y);
            t.addBinding(new LetBinding(h, r, f, u.to, a));
            ++d;
        }
    }
});

const me = /*@__PURE__*/ renderer(class RefBindingRenderer {
    constructor() {
        this.target = Kt;
    }
    render(t, e, s, i, n) {
        t.addBinding(new RefBinding(t.container, ensureExpression(n, s.from, y), getRefTarget(e, s.to)));
    }
});

const ge = /*@__PURE__*/ renderer(class InterpolationBindingRenderer {
    constructor() {
        this.target = Ut;
    }
    render(t, e, s, i, n, r) {
        t.addBinding(new InterpolationBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, v), getTarget(e), s.to, L));
    }
});

const xe = /*@__PURE__*/ renderer(class PropertyBindingRenderer {
    constructor() {
        this.target = zt;
    }
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, y), getTarget(e), s.to, s.mode));
    }
});

const ve = /*@__PURE__*/ renderer(class IteratorBindingRenderer {
    constructor() {
        this.target = Xt;
    }
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.forOf, w), getTarget(e), s.to, L));
    }
});

const we = /*@__PURE__*/ renderer(class TextBindingRenderer {
    constructor() {
        this.target = Yt;
    }
    render(t, e, s, i, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, i.domWriteQueue, i, ensureExpression(n, s.from, y), e));
    }
});

const be = U("IListenerBindingOptions", (t => t.instance({
    prevent: false
})));

const ye = /*@__PURE__*/ renderer(class ListenerBindingRenderer {
    constructor() {
        this.target = Zt;
        this.tt = e.resolve(It);
        this.et = e.resolve(be);
    }
    render(t, e, s, i, n) {
        t.addBinding(new ListenerBinding(t.container, ensureExpression(n, s.from, b), e, s.to, new ListenerBindingOptions(this.et.prevent, s.capture), this.tt.getHandler(s.to, s.modifier)));
    }
});

const ke = /*@__PURE__*/ renderer(class SetAttributeRenderer {
    constructor() {
        this.target = ee;
    }
    render(t, e, s) {
        e.setAttribute(s.to, s.value);
    }
});

const Ce = /*@__PURE__*/ renderer(class SetClassAttributeRenderer {
    constructor() {
        this.target = se;
    }
    render(t, e, s) {
        addClasses(e.classList, s.value);
    }
});

const Ae = /*@__PURE__*/ renderer(class SetStyleAttributeRenderer {
    constructor() {
        this.target = ie;
    }
    render(t, e, s) {
        e.style.cssText += s.value;
    }
});

const Be = /*@__PURE__*/ renderer(class StylePropertyBindingRenderer {
    constructor() {
        this.target = te;
    }
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, y), e.style, s.to, L));
    }
});

const Se = /*@__PURE__*/ renderer(class AttributeBindingRenderer {
    constructor() {
        this.target = Jt;
    }
    render(t, e, s, i, n, r) {
        const l = t.container;
        const a = l.has(ws, false) ? l.get(ws) : null;
        t.addBinding(new AttributeBinding(t, l, r, i.domWriteQueue, ensureExpression(n, s.from, y), e, s.attr, a == null ? s.to : s.to.split(/\s/g).map((t => a[t] ?? t)).join(" "), L));
    }
});

const Te = /*@__PURE__*/ renderer(class SpreadRenderer {
    constructor() {
        this.st = e.resolve(ae);
        this.r = e.resolve(_e);
        this.target = ne;
    }
    render(t, e, s, i, n, r) {
        SpreadBinding.create(t.container.get(fs), e, void 0, this.r, this.st, i, n, r).forEach((e => t.addBinding(e)));
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

const Ee = "IController";

const Re = "IInstruction";

const Ie = "IRenderLocation";

const Pe = "ISlotsInfo";

function createElementContainer(t, s, i, n, r, l) {
    const a = s.container.createChild();
    registerHostNode(a, t, i);
    registerResolver(a, us, new e.InstanceProvider(Ee, s));
    registerResolver(a, le, new e.InstanceProvider(Re, n));
    registerResolver(a, vs, r == null ? Le : new RenderLocationProvider(r));
    registerResolver(a, Lt, De);
    registerResolver(a, Ft, l == null ? Me : new e.InstanceProvider(Pe, l));
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

function invokeAttribute(t, s, i, n, r, l, a, h) {
    const c = i instanceof Controller ? i : i.$controller;
    const u = c.container.createChild();
    registerHostNode(u, t, n);
    registerResolver(u, us, new e.InstanceProvider(Ee, c));
    registerResolver(u, le, new e.InstanceProvider(Re, r));
    registerResolver(u, vs, a == null ? Le : new e.InstanceProvider(Ie, a));
    registerResolver(u, Lt, l == null ? De : new ViewFactoryProvider(l));
    registerResolver(u, Ft, h == null ? Me : new e.InstanceProvider(Pe, h));
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

const Le = new RenderLocationProvider(null);

const De = new ViewFactoryProvider(null);

const Me = new e.InstanceProvider(Pe, new AuSlotsInfo(e.emptyArray));

const _e = /*@__PURE__*/ U("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.it ??= this.nt.getAll(he, false).reduce(((t, e) => {
            t[e.target] = e;
            return t;
        }), createLookup());
    }
    constructor() {
        this.rt = new WeakMap;
        this.ot = new WeakMap;
        const i = this.nt = e.resolve(e.IContainer).root;
        this.p = i.get(ht);
        this.ep = i.get(t.IExpressionParser);
        this.oL = i.get(s.IObserverLocator);
        this.lt = new FragmentNodeSequence(this.p, this.p.document.createDocumentFragment());
    }
    compile(t, e, s) {
        if (t.needsCompile !== false) {
            const i = this.rt;
            const n = e.get(ae);
            let r = i.get(t);
            if (r == null) {
                i.set(t, r = n.compile(CustomElementDefinition.getOrCreate(t), e, s));
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
    defineHiddenProp(t.prototype, "subscribe", e.noop);
    defineHiddenProp(t.prototype, "unsubscribe", e.noop);
};

class ClassAttributeAccessor {
    get doNotCache() {
        return true;
    }
    constructor(t) {
        this.obj = t;
        this.type = B | S;
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
            this.wt();
        }
    }
    wt() {
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
        const s = f({}, ...this.modules);
        const i = defineAttribute({
            name: "class",
            bindables: [ "value" ],
            noMultiBindings: true
        }, class CustomAttributeClass {
            constructor() {
                this.bt = new ClassAttributeAccessor(e.resolve(gs));
                this.value = "";
            }
            binding() {
                this.valueChanged();
            }
            valueChanged() {
                this.bt.setValue(this.value?.split(/\s+/g).map((t => s[t] || t)) ?? "");
            }
        });
        t.register(i, K(ws, s));
    }
}

function shadowCSS(...t) {
    return new ShadowDOMRegistry(t);
}

const qe = /*@__PURE__*/ U("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
    if (AdoptedStyleSheetsStyles.supported(t.get(ht))) {
        return t.get(AdoptedStyleSheetsStylesFactory);
    }
    return t.get(StyleElementStylesFactory);
}))));

class ShadowDOMRegistry {
    constructor(t) {
        this.css = t;
    }
    register(t) {
        const e = t.get(Oe);
        const s = t.get(qe);
        t.register(K(Fe, s.createStyles(this.css, e)));
    }
}

class AdoptedStyleSheetsStylesFactory {
    constructor() {
        this.p = e.resolve(ht);
        this.cache = new Map;
    }
    createStyles(t, e) {
        return new AdoptedStyleSheetsStyles(this.p, t, this.cache, e);
    }
}

class StyleElementStylesFactory {
    constructor() {
        this.p = e.resolve(ht);
    }
    createStyles(t, e) {
        return new StyleElementStyles(this.p, t, e);
    }
}

const Fe = /*@__PURE__*/ U("IShadowDOMStyles");

const Oe = /*@__PURE__*/ U("IShadowDOMGlobalStyles", (t => t.instance({
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

const He = {
    shadowDOM(t) {
        return at.creating(e.IContainer, (e => {
            if (t.sharedStyles != null) {
                const s = e.get(qe);
                e.register(K(Oe, s.createStyles(t.sharedStyles, null)));
            }
        }));
    }
};

const {enter: Ve, exit: Ne} = s.ConnectableSwitcher;

const {wrap: $e, unwrap: je} = s.ProxyObservable;

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
        if (!g(s, e)) {
            this.cb.call(t, s, e, t);
        }
    }
    compute() {
        this.running = true;
        this.obs.version++;
        try {
            Ve(this);
            return this.v = je(this.$get.call(void 0, this.useProxy ? $e(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            Ne(this);
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
            t = E(e, this.scope, this, this);
            this.obs.clear();
        }
        if (!g(t, i)) {
            this.v = t;
            this.cb.call(s, t, i, s);
        }
    }
    bind() {
        if (this.isBound) {
            return;
        }
        this.obs.version++;
        this.v = E(this.yt, this.scope, this, this);
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
        return this.kt;
    }
    get isActive() {
        return (this.state & (ns | rs)) > 0 && (this.state & os) === 0;
    }
    get name() {
        if (this.parent === null) {
            switch (this.vmKind) {
              case es:
                return `[${this.definition.name}]`;

              case ts:
                return this.definition.name;

              case ss:
                return this.viewFactory.name;
            }
        }
        switch (this.vmKind) {
          case es:
            return `${this.parent.name}>[${this.definition.name}]`;

          case ts:
            return `${this.parent.name}>${this.definition.name}`;

          case ss:
            return this.viewFactory.name === this.parent.definition?.name ? `${this.parent.name}[view]` : `${this.parent.name}[view:${this.viewFactory.name}]`;
        }
    }
    get viewModel() {
        return this.Ct;
    }
    set viewModel(t) {
        this.Ct = t;
        this.At = t == null || this.vmKind === ss ? HooksDefinition.none : new HooksDefinition(t);
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
        this.mountTarget = Ue;
        this.shadowRoot = null;
        this.nodes = null;
        this.location = null;
        this.kt = null;
        this.state = is;
        this.St = false;
        this.$initiator = null;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this.Tt = 0;
        this.Et = 0;
        this.Rt = 0;
        this.Ct = n;
        this.At = e === ss ? HooksDefinition.none : new HooksDefinition(n);
        this.location = l;
        this.r = t.root.get(_e);
        this.coercion = e === ss ? void 0 : t.get(Ye);
    }
    static getCached(t) {
        return We.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (e === void 0) {
            throw createMappedError(500, t);
        }
        return e;
    }
    static $el(t, s, i, n, r = void 0, l = null) {
        if (We.has(s)) {
            return We.get(s);
        }
        {
            r = r ?? getElementDefinition(s.constructor);
        }
        registerResolver(t, r.Type, new e.InstanceProvider(r.key, s, r.Type));
        const a = new Controller(t, ts, r, null, s, i, l);
        const h = t.get(e.optional(fs));
        if (r.dependencies.length > 0) {
            t.register(...r.dependencies);
        }
        registerResolver(t, fs, new e.InstanceProvider("IHydrationContext", new HydrationContext(a, n, h)));
        We.set(s, a);
        if (n == null || n.hydrate !== false) {
            a.hE(n, h);
        }
        return a;
    }
    static $attr(t, s, i, n) {
        if (We.has(s)) {
            return We.get(s);
        }
        n = n ?? getAttributeDefinition(s.constructor);
        registerResolver(t, n.Type, new e.InstanceProvider(n.key, s, n.Type));
        const r = new Controller(t, es, n, null, s, i, null);
        if (n.dependencies.length > 0) {
            t.register(...n.dependencies);
        }
        We.set(s, r);
        r.It();
        return r;
    }
    static $view(t, e = void 0) {
        const s = new Controller(t.container, ss, null, t, null, null, null);
        s.parent = e ?? null;
        s.Pt();
        return s;
    }
    hE(t, s) {
        const i = this.container;
        const n = this.Ct;
        const r = this.definition;
        this.scope = Scope.create(n, null, true);
        if (r.watches.length > 0) {
            createWatchers(this, i, r, n);
        }
        createObservers(this, r, n);
        this.kt = mt.resolve(i);
        i.register(r.Type);
        if (r.injectable !== null) {
            registerResolver(i, r.injectable, new e.InstanceProvider("definition.injectable", n));
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
        const s = this.Dt = this.r.compile(e, this.container, t);
        const i = s.shadowOptions;
        const n = s.hasSlots;
        const r = s.containerless;
        let l = this.host;
        let a = this.location;
        if ((this.hostController = findElementControllerFor(l, Qe)) !== null) {
            l = this.host = this.container.root.get(ht).document.createElement(e.name);
            if (r && a == null) {
                a = this.location = convertToRenderLocation(l);
            }
        }
        setRef(l, Ts, this);
        setRef(l, e.key, this);
        if (i !== null || n) {
            if (a != null) {
                throw createMappedError(501);
            }
            setRef(this.shadowRoot = l.attachShadow(i ?? Je), Ts, this);
            setRef(this.shadowRoot, e.key, this);
            this.mountTarget = Ge;
        } else if (a != null) {
            setRef(a, Ts, this);
            setRef(a, e.key, this);
            this.mountTarget = Ke;
        } else {
            this.mountTarget = ze;
        }
        this.Ct.$controller = this;
        this.nodes = this.r.createNodes(s);
        if (this.kt.hydrated !== void 0) {
            this.kt.hydrated.forEach(callHydratedHook, this);
        }
        if (this.At.Mt) {
            this.Ct.hydrated(this);
        }
    }
    hC() {
        this.r.render(this, this.nodes.findTargets(), this.Dt, this.host);
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
        this.kt = mt.resolve(this.container);
        if (this.kt.created !== void 0) {
            this.kt.created.forEach(callCreatedHook, this);
        }
        if (this.At._t) {
            this.Ct.created(this);
        }
    }
    Pt() {
        this.Dt = this.r.compile(this.viewFactory.def, this.container, null);
        this.r.render(this, (this.nodes = this.r.createNodes(this.Dt)).findTargets(), this.Dt, void 0);
    }
    activate(t, s, i) {
        switch (this.state) {
          case is:
          case ls:
            if (!(s === null || s.isActive)) {
                return;
            }
            this.state = ns;
            break;

          case rs:
            return;

          case hs:
            throw createMappedError(502, this.name);

          default:
            throw createMappedError(503, this.name, stringifyState(this.state));
        }
        this.parent = s;
        switch (this.vmKind) {
          case ts:
            this.scope.parent = i ?? null;
            break;

          case es:
            this.scope = i ?? null;
            break;

          case ss:
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
        let n = void 0;
        if (this.vmKind !== ss && this.kt.binding != null) {
            n = e.onResolveAll(...this.kt.binding.map(callBindingHook, this));
        }
        if (this.At.Ft) {
            n = e.onResolveAll(n, this.Ct.binding(this.$initiator, this.parent));
        }
        if (isPromise(n)) {
            this.Ot();
            n.then((() => {
                this.Bt = true;
                if (this.state !== ns) {
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
        if (this.vmKind !== ss && this.kt.bound != null) {
            i = e.onResolveAll(...this.kt.bound.map(callBoundHook, this));
        }
        if (this.At.Nt) {
            i = e.onResolveAll(i, this.Ct.bound(this.$initiator, this.parent));
        }
        if (isPromise(i)) {
            this.Ot();
            i.then((() => {
                this.isBound = true;
                if (this.state !== ns) {
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
          case ze:
            this.host.append(...t);
            break;

          case Ge:
            this.shadowRoot.append(...t);
            break;

          case Ke:
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
              case ze:
              case Ge:
                this.hostController.jt(this.host);
                break;

              case Ke:
                this.hostController.jt(this.location.$start, this.location);
                break;
            }
        }
        switch (this.mountTarget) {
          case ze:
            this.nodes.appendTo(this.host, this.definition != null && this.definition.enhance);
            break;

          case Ge:
            {
                const t = this.container;
                const e = t.has(Fe, false) ? t.get(Fe) : t.get(Oe);
                e.applyTo(this.shadowRoot);
                this.nodes.appendTo(this.shadowRoot);
                break;
            }

          case Ke:
            this.nodes.insertBefore(this.location);
            break;
        }
        let t = 0;
        let s = void 0;
        if (this.vmKind !== ss && this.kt.attaching != null) {
            s = e.onResolveAll(...this.kt.attaching.map(callAttachingHook, this));
        }
        if (this.At.Wt) {
            s = e.onResolveAll(s, this.Ct.attaching(this.$initiator, this.parent));
        }
        if (isPromise(s)) {
            this.Ot();
            this.qt();
            s.then((() => {
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
    deactivate(t, s) {
        let i = void 0;
        switch (this.state & ~as) {
          case rs:
            this.state = os;
            break;

          case ns:
            this.state = os;
            i = this.$promise?.catch(e.noop);
            break;

          case is:
          case ls:
          case hs:
          case ls | hs:
            return;

          default:
            throw createMappedError(505, this.name, this.state);
        }
        this.$initiator = t;
        if (t === this) {
            this.Ut();
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
                if (this.vmKind !== ss && this.kt.detaching != null) {
                    r = e.onResolveAll(...this.kt.detaching.map(callDetachingHook, this));
                }
                if (this.At.zt) {
                    r = e.onResolveAll(r, this.Ct.detaching(this.$initiator, this.parent));
                }
            }
            if (isPromise(r)) {
                this.Ot();
                t.Ut();
                r.then((() => {
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
          case ts:
          case ss:
            this.nodes.remove();
            this.nodes.unlink();
        }
        if (this.hostController !== null) {
            switch (this.mountTarget) {
              case ze:
              case Ge:
                this.host.remove();
                break;

              case Ke:
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
          case es:
            this.scope = null;
            break;

          case ss:
            if (!this.hasLockedScope) {
                this.scope = null;
            }
            if ((this.state & as) === as && !this.viewFactory.tryReturnToCache(this) && this.$initiator === this) {
                this.dispose();
            }
            break;

          case ts:
            this.scope.parent = null;
            break;
        }
        this.state = ls;
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
            ds = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            ds();
            ds = void 0;
        }
    }
    Vt(t) {
        if (this.$promise !== void 0) {
            ps = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            ps(t);
            ps = void 0;
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
        if (this.state !== ns) {
            --this.Tt;
            this.Kt();
            if (this.$initiator !== this) {
                this.parent.Ht();
            }
            return;
        }
        if (--this.Tt === 0) {
            if (this.vmKind !== ss && this.kt.attached != null) {
                ms = e.onResolveAll(...this.kt.attached.map(callAttachedHook, this));
            }
            if (this.At.Xt) {
                ms = e.onResolveAll(ms, this.Ct.attached(this.$initiator));
            }
            if (isPromise(ms)) {
                this.Ot();
                ms.then((() => {
                    this.state = rs;
                    this.Kt();
                    if (this.$initiator !== this) {
                        this.parent.Ht();
                    }
                })).catch((t => {
                    this.Vt(t);
                }));
                ms = void 0;
                return;
            }
            ms = void 0;
            this.state = rs;
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
            let s = void 0;
            while (t !== null) {
                if (t !== this) {
                    if (t.debug) {
                        t.logger.trace(`detach()`);
                    }
                    t.removeNodes();
                }
                if (t.Bt) {
                    if (t.vmKind !== ss && t.kt.unbinding != null) {
                        s = e.onResolveAll(...t.kt.unbinding.map(callUnbindingHook, t));
                    }
                    if (t.At.Yt) {
                        if (t.debug) {
                            t.logger.trace("unbinding()");
                        }
                        s = e.onResolveAll(s, t.viewModel.unbinding(t.$initiator, t.parent));
                    }
                }
                if (isPromise(s)) {
                    this.Ot();
                    this.Qt();
                    s.then((() => {
                        this.Zt();
                    })).catch((t => {
                        this.Vt(t);
                    }));
                }
                s = void 0;
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
          case es:
          case ts:
            {
                return this.definition.name === t;
            }

          case ss:
            return this.viewFactory.name === t;
        }
    }
    lockScope(t) {
        this.scope = t;
        this.hasLockedScope = true;
    }
    setHost(t) {
        if (this.vmKind === ts) {
            setRef(t, Ts, this);
            setRef(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = ze;
        return this;
    }
    setShadowRoot(t) {
        if (this.vmKind === ts) {
            setRef(t, Ts, this);
            setRef(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = Ge;
        return this;
    }
    setLocation(t) {
        if (this.vmKind === ts) {
            setRef(t, Ts, this);
            setRef(t, this.definition.key, this);
        }
        this.location = t;
        this.mountTarget = Ke;
        return this;
    }
    release() {
        this.state |= as;
    }
    dispose() {
        if ((this.state & hs) === hs) {
            return;
        }
        this.state |= hs;
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
            We.delete(this.Ct);
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

const We = new WeakMap;

const Ue = 0;

const ze = 1;

const Ge = 2;

const Ke = 3;

const Xe = u({
    none: Ue,
    host: ze,
    shadowRoot: Ge,
    location: Ke
});

const Qe = {
    optional: true
};

const Ye = e.optionalResource(s.ICoercionConfiguration);

function createObservers(t, i, n) {
    const r = i.bindables;
    const l = d(r);
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

const Ze = new Map;

const getAccessScopeAst = e => {
    let s = Ze.get(e);
    if (s == null) {
        s = new t.AccessScopeExpression(e, 0);
        Ze.set(e, s);
    }
    return s;
};

function createWatchers(e, i, n, r) {
    const l = i.get(s.IObserverLocator);
    const a = i.get(t.IExpressionParser);
    const h = n.watches;
    const c = e.vmKind === ts ? e.scope : Scope.create(r, null, true);
    const u = h.length;
    let f;
    let d;
    let p;
    let m = 0;
    for (;u > m; ++m) {
        ({expression: f, callback: d} = h[m]);
        d = isFunction(d) ? d : Reflect.get(r, d);
        if (!isFunction(d)) {
            throw createMappedError(506, d);
        }
        if (isFunction(f)) {
            e.addBinding(new ComputedWatcher(r, l, f, d, true));
        } else {
            p = isString(f) ? a.parse(f, y) : getAccessScopeAst(f);
            e.addBinding(new ExpressionWatcher(c, i, l, p, d));
        }
    }
}

function isCustomElementController(t) {
    return t instanceof Controller && t.vmKind === ts;
}

function isCustomElementViewModel(t) {
    return i.isObject(t) && isElementType(t.constructor);
}

class HooksDefinition {
    constructor(t) {
        this.ee = "define" in t;
        this.Lt = "hydrating" in t;
        this.Mt = "hydrated" in t;
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

const Je = {
    mode: "open"
};

const ts = "customElement";

const es = "customAttribute";

const ss = "synthetic";

const is = 0;

const ns = 1;

const rs = 2;

const os = 4;

const ls = 8;

const as = 16;

const hs = 32;

const cs = /*@__PURE__*/ u({
    none: is,
    activating: ns,
    activated: rs,
    deactivating: os,
    deactivated: ls,
    released: as,
    disposed: hs
});

function stringifyState(t) {
    const e = [];
    if ((t & ns) === ns) {
        e.push("activating");
    }
    if ((t & rs) === rs) {
        e.push("activated");
    }
    if ((t & os) === os) {
        e.push("deactivating");
    }
    if ((t & ls) === ls) {
        e.push("deactivated");
    }
    if ((t & as) === as) {
        e.push("released");
    }
    if ((t & hs) === hs) {
        e.push("disposed");
    }
    return e.length === 0 ? "none" : e.join("|");
}

const us = /*@__PURE__*/ U("IController");

const fs = /*@__PURE__*/ U("IHydrationContext");

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

let ds;

let ps;

let ms;

class Refs {}

function getRef(t, e) {
    return t.$au?.[e] ?? null;
}

function setRef(t, e, s) {
    (t.$au ??= new Refs)[e] = s;
}

const gs = /*@__PURE__*/ U("INode");

const xs = /*@__PURE__*/ U("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(Ls, true)) {
        return t.get(Ls).host;
    }
    return t.get(ht).document;
}))));

const vs = /*@__PURE__*/ U("IRenderLocation");

const ws = /*@__PURE__*/ U("CssModules");

const bs = new WeakMap;

function getEffectiveParentNode(t) {
    if (bs.has(t)) {
        return bs.get(t);
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
        if (e.mountTarget === Xe.shadowRoot) {
            return getEffectiveParentNode(e.host);
        }
    }
    return t.parentNode;
}

function setEffectiveParentNode(t, e) {
    if (t.platform !== void 0 && !(t instanceof t.platform.Node)) {
        const s = t.childNodes;
        for (let t = 0, i = s.length; t < i; ++t) {
            bs.set(s[t], e);
        }
    } else {
        bs.set(t, e);
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

const ys = /*@__PURE__*/ U("IWindow", (t => t.callback((t => t.get(ht).window))));

const ks = /*@__PURE__*/ U("ILocation", (t => t.callback((t => t.get(ys).location))));

const Cs = /*@__PURE__*/ U("IHistory", (t => t.callback((t => t.get(ys).history))));

const registerHostNode = (t, s, i) => {
    registerResolver(t, s.HTMLElement, registerResolver(t, s.Element, registerResolver(t, gs, new e.InstanceProvider("ElementResolver", i))));
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
    const e = F(Ts, t);
    if (e === void 0) {
        annotateElementMetadata(t, "containerless", true);
        return;
    }
    e.containerless = true;
}

const As = new WeakMap;

class CustomElementDefinition {
    get kind() {
        return X;
    }
    constructor(t, e, s, i, n, r, l, a, h, c, u, f, d, p, m, g, x, v, w) {
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
        this.processContent = w;
    }
    static create(t, s = null) {
        if (s === null) {
            const i = t;
            if (isString(i)) {
                throw createMappedError(761, t);
            }
            const n = e.fromDefinitionOrDefault("name", i, Es);
            if (isFunction(i.Type)) {
                s = i.Type;
            } else {
                s = Rs(e.pascalCase(n));
            }
            return new CustomElementDefinition(s, n, e.mergeArrays(i.aliases), e.fromDefinitionOrDefault("key", i, (() => getElementKeyFrom(n))), e.fromDefinitionOrDefault("cache", i, returnZero), e.fromAnnotationOrDefinitionOrTypeOrDefault("capture", i, s, returnFalse), e.fromDefinitionOrDefault("template", i, returnNull), e.mergeArrays(i.instructions), e.mergeArrays(getElementAnnotation(s, "dependencies"), i.dependencies), e.fromDefinitionOrDefault("injectable", i, returnNull), e.fromDefinitionOrDefault("needsCompile", i, returnTrue), e.mergeArrays(i.surrogates), j.from(getElementAnnotation(s, "bindables"), i.bindables), e.fromAnnotationOrDefinitionOrTypeOrDefault("containerless", i, s, returnFalse), e.fromDefinitionOrDefault("shadowOptions", i, returnNull), e.fromDefinitionOrDefault("hasSlots", i, returnFalse), e.fromDefinitionOrDefault("enhance", i, returnFalse), e.fromDefinitionOrDefault("watches", i, returnEmptyArray), e.fromAnnotationOrTypeOrDefault("processContent", s, returnNull));
        }
        if (isString(t)) {
            return new CustomElementDefinition(s, t, e.mergeArrays(getElementAnnotation(s, "aliases"), s.aliases), getElementKeyFrom(t), e.fromAnnotationOrTypeOrDefault("cache", s, returnZero), e.fromAnnotationOrTypeOrDefault("capture", s, returnFalse), e.fromAnnotationOrTypeOrDefault("template", s, returnNull), e.mergeArrays(getElementAnnotation(s, "instructions"), s.instructions), e.mergeArrays(getElementAnnotation(s, "dependencies"), s.dependencies), e.fromAnnotationOrTypeOrDefault("injectable", s, returnNull), e.fromAnnotationOrTypeOrDefault("needsCompile", s, returnTrue), e.mergeArrays(getElementAnnotation(s, "surrogates"), s.surrogates), j.from(...j.getAll(s), getElementAnnotation(s, "bindables"), s.bindables), e.fromAnnotationOrTypeOrDefault("containerless", s, returnFalse), e.fromAnnotationOrTypeOrDefault("shadowOptions", s, returnNull), e.fromAnnotationOrTypeOrDefault("hasSlots", s, returnFalse), e.fromAnnotationOrTypeOrDefault("enhance", s, returnFalse), e.mergeArrays(ct.getDefinitions(s), s.watches), e.fromAnnotationOrTypeOrDefault("processContent", s, returnNull));
        }
        const i = e.fromDefinitionOrDefault("name", t, Es);
        return new CustomElementDefinition(s, i, e.mergeArrays(getElementAnnotation(s, "aliases"), t.aliases, s.aliases), getElementKeyFrom(i), e.fromAnnotationOrDefinitionOrTypeOrDefault("cache", t, s, returnZero), e.fromAnnotationOrDefinitionOrTypeOrDefault("capture", t, s, returnFalse), e.fromAnnotationOrDefinitionOrTypeOrDefault("template", t, s, returnNull), e.mergeArrays(getElementAnnotation(s, "instructions"), t.instructions, s.instructions), e.mergeArrays(getElementAnnotation(s, "dependencies"), t.dependencies, s.dependencies), e.fromAnnotationOrDefinitionOrTypeOrDefault("injectable", t, s, returnNull), e.fromAnnotationOrDefinitionOrTypeOrDefault("needsCompile", t, s, returnTrue), e.mergeArrays(getElementAnnotation(s, "surrogates"), t.surrogates, s.surrogates), j.from(...j.getAll(s), getElementAnnotation(s, "bindables"), s.bindables, t.bindables), e.fromAnnotationOrDefinitionOrTypeOrDefault("containerless", t, s, returnFalse), e.fromAnnotationOrDefinitionOrTypeOrDefault("shadowOptions", t, s, returnNull), e.fromAnnotationOrDefinitionOrTypeOrDefault("hasSlots", t, s, returnFalse), e.fromAnnotationOrDefinitionOrTypeOrDefault("enhance", t, s, returnFalse), e.mergeArrays(t.watches, ct.getDefinitions(s), s.watches), e.fromAnnotationOrDefinitionOrTypeOrDefault("processContent", t, s, returnNull));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) {
            return t;
        }
        if (As.has(t)) {
            return As.get(t);
        }
        const e = CustomElementDefinition.create(t);
        As.set(t, e);
        H(e, e.Type, Ts);
        return e;
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getElementKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : z(s, s), G(s, i), ...n.map((t => G(s, getElementKeyFrom(t)))));
        }
    }
    toString() {
        return `au:ce:${this.name}`;
    }
}

const Bs = {
    name: undefined,
    searchParents: false,
    optional: false
};

const returnZero = () => 0;

const returnNull = () => null;

const returnFalse = () => false;

const returnTrue = () => true;

const returnEmptyArray = () => e.emptyArray;

const Ss = "custom-element";

const Ts = /*@__PURE__*/ e.getResourceKeyFor(Ss);

const getElementKeyFrom = t => `${Ts}:${t}`;

const Es = /*@__PURE__*/ (t => () => `unnamed-${++t}`)(0);

const annotateElementMetadata = (t, e, s) => {
    H(s, t, N(e));
};

const defineElement = (t, s) => {
    const i = CustomElementDefinition.create(t, s);
    const n = i.Type;
    H(i, n, Ts, e.resourceBaseName);
    return n;
};

const isElementType = t => isFunction(t) && (O(Ts, t) || t.$au?.type === Ss);

const findElementControllerFor = (t, e = Bs) => {
    if (e.name === void 0 && e.searchParents !== true) {
        const s = getRef(t, Ts);
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
            const s = getRef(t, Ts);
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
            const t = getRef(s, Ts);
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
        const t = getRef(s, Ts);
        if (t !== null) {
            return t;
        }
        s = getEffectiveParentNode(s);
    }
    throw createMappedError(765, t);
};

const getElementAnnotation = (t, e) => F(N(e), t);

const getElementDefinition = t => {
    const e = F(Ts, t) ?? getDefinitionFromStaticAu(t, Ss, CustomElementDefinition.create);
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

const Rs = /*@__PURE__*/ function() {
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
        x(n, "name", t);
        if (i !== e) {
            f(n.prototype, i);
        }
        return n;
    };
}();

const Is = u({
    name: Ts,
    keyFrom: getElementKeyFrom,
    isType: isElementType,
    for: findElementControllerFor,
    define: defineElement,
    getDefinition: getElementDefinition,
    annotate: annotateElementMetadata,
    getAnnotation: getElementAnnotation,
    generateName: Es,
    createInjectable: createElementInjectable,
    generateType: Rs,
    find(t, e) {
        const s = t.find(Ss, e);
        return s == null ? null : F(Ts, s) ?? getDefinitionFromStaticAu(s, Ss, CustomElementDefinition.create) ?? null;
    }
});

const Ps = /*@__PURE__*/ N("processContent");

function processContent(t) {
    return t === void 0 ? function(t, e) {
        if (!e.static || e.kind !== "method") throw createMappedError(766, t);
        e.addInitializer((function() {
            H(t, this, Ps);
        }));
    } : function(e, s) {
        s.addInitializer((function() {
            if (isString(t) || isSymbol(t)) {
                t = this[t];
            }
            if (!isFunction(t)) throw createMappedError(766, t);
            const e = F(Ts, this);
            if (e !== void 0) {
                e.processContent = t;
            } else {
                H(t, this, Ps);
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

const Ls = /*@__PURE__*/ U("IAppRoot");

class AppRoot {
    get controller() {
        return this.P;
    }
    constructor(t, s, i, n = false) {
        this.config = t;
        this.container = s;
        this.le = void 0;
        this.ae = n;
        const r = this.host = t.host;
        i.prepare(this);
        registerHostNode(s, this.platform = this.he(s, r), r);
        this.le = e.onResolve(this.ce("creating"), (() => {
            if (!t.allowActionlessForm !== false) {
                r.addEventListener("submit", (t => {
                    const e = t.target;
                    const s = (e.getAttribute("action")?.length ?? 0) > 0;
                    if (e.tagName === "FORM" && !s) {
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
                name: Es(),
                template: this.host,
                enhance: true
            }) : void 0;
            const u = this.P = Controller.$el(i, a, r, h, c);
            u.hE(h, null);
            return e.onResolve(this.ce("hydrating"), (() => {
                u.hS(null);
                return e.onResolve(this.ce("hydrated"), (() => {
                    u.hC();
                    this.le = void 0;
                }));
            }));
        }));
    }
    activate() {
        return e.onResolve(this.le, (() => e.onResolve(this.ce("activating"), (() => e.onResolve(this.P.activate(this.P, null, void 0), (() => this.ce("activated")))))));
    }
    deactivate() {
        return e.onResolve(this.ce("deactivating"), (() => e.onResolve(this.P.deactivate(this.P, null), (() => this.ce("deactivated")))));
    }
    ce(t) {
        const s = this.container;
        const i = this.ae && !s.has(lt, false) ? [] : s.getAll(lt);
        return e.onResolveAll(...i.reduce(((e, s) => {
            if (s.slot === t) {
                e.push(s.run());
            }
            return e;
        }), []));
    }
    he(t, e) {
        let s;
        if (!t.has(ht, false)) {
            if (e.ownerDocument.defaultView === null) {
                throw createMappedError(769);
            }
            s = new n.BrowserPlatform(e.ownerDocument.defaultView);
            t.register(K(ht, s));
        } else {
            s = t.get(ht);
        }
        return s;
    }
    dispose() {
        this.P?.dispose();
    }
}

const Ds = /*@__PURE__*/ U("IAurelia");

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
    constructor(t = e.DI.createContainer()) {
        this.container = t;
        this.ir = false;
        this.ue = false;
        this.fe = false;
        this.de = void 0;
        this.next = void 0;
        this.pe = void 0;
        this.me = void 0;
        if (t.has(Ds, true) || t.has(Aurelia, true)) {
            throw createMappedError(768);
        }
        registerResolver(t, Ds, new e.InstanceProvider("IAurelia", this));
        registerResolver(t, Aurelia, new e.InstanceProvider("Aurelia", this));
        registerResolver(t, Ls, this.ge = new e.InstanceProvider("IAppRoot"));
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
        const s = new AppRoot({
            host: t.host,
            component: t.component
        }, t.container ?? this.container.createChild(), new e.InstanceProvider("IAppRoot"), true);
        return e.onResolve(s.activate(), (() => s));
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
        if (isPromise(this.pe)) {
            return this.pe;
        }
        return this.pe = e.onResolve(this.stop(), (() => {
            Reflect.set(t.host, "$aurelia", this);
            this.ge.prepare(this.de = t);
            this.ue = true;
            return e.onResolve(t.activate(), (() => {
                this.ir = true;
                this.ue = false;
                this.pe = void 0;
                this.xe(t, "au-started", t.host);
            }));
        }));
    }
    stop(t = false) {
        if (isPromise(this.me)) {
            return this.me;
        }
        if (this.ir === true) {
            const s = this.de;
            this.ir = false;
            this.fe = true;
            return this.me = e.onResolve(s.deactivate(), (() => {
                Reflect.deleteProperty(s.host, "$aurelia");
                if (t) {
                    s.dispose();
                }
                this.de = void 0;
                this.ge.dispose();
                this.fe = false;
                this.xe(s, "au-stopped", s.host);
            }));
        }
    }
    dispose() {
        if (this.ir || this.fe) {
            throw createMappedError(771);
        }
        this.container.dispose();
    }
    xe(t, e, s) {
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
                this.has = this.ve;
                break;

              case 1:
                this.has = this.we;
                break;

              default:
                this.has = this.be;
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
    be(t) {
        return !this.chars.includes(t);
    }
    we(t) {
        return this.chars !== t;
    }
    ve(t) {
        return true;
    }
}

class Interpretation {
    constructor() {
        this.parts = e.emptyArray;
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
            this.parts = e.emptyArray;
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

const Ms = /*@__PURE__*/ U("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

class SyntaxInterpreter {
    constructor() {
        this.Me = new AttrParsingState(null);
        this._e = [ this.Me ];
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
            s = this.Me;
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

const _s = /*@__PURE__*/ U("IAttributePattern");

const qs = /*@__PURE__*/ U("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor() {
        this.W = {};
        const t = this.Oe = e.resolve(Ms);
        const s = Os.findAll(e.resolve(e.IContainer));
        const i = this.Ee = {};
        const n = s.reduce(((t, e) => {
            const s = getAllPatternDefinitions(e.constructor);
            s.forEach((t => i[t.pattern] = e));
            return t.concat(s);
        }), e.emptyArray);
        t.add(n);
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
        return Os.define(t, e);
    };
}

const getAllPatternDefinitions = t => Fs.get(t) ?? e.emptyArray;

const Fs = new WeakMap;

const Os = u({
    name: e.getResourceKeyFor("attribute-pattern"),
    define(t, s) {
        Fs.set(s, t);
        return e.Registrable.define(s, (t => {
            z(_s, s).register(t);
        }));
    },
    getPatternDefinitions: getAllPatternDefinitions,
    findAll: t => t.root.getAll(_s)
});

const Hs = /*@__PURE__*/ Os.define([ {
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

const Vs = /*@__PURE__*/ Os.define([ {
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

const Ns = /*@__PURE__*/ Os.define([ {
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

const $s = /*@__PURE__*/ Os.define([ {
    pattern: ":PART",
    symbols: ":"
} ], class ColonPrefixedBindAttributePattern {
    ":PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "bind");
    }
});

const js = /*@__PURE__*/ Os.define([ {
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

const Ws = /*@__PURE__*/ Os.define([ {
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
            Gs.define(t, e);
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
        return new BindingCommandDefinition(s, e.firstDefined(getCommandAnnotation(s, "name"), i), e.mergeArrays(getCommandAnnotation(s, "aliases"), n.aliases, s.aliases), getCommandKeyFrom(i));
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getCommandKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : z(s, s), G(s, i), ...n.map((t => G(s, getCommandKeyFrom(t)))));
        }
    }
}

const Us = "binding-command";

const zs = /*@__PURE__*/ e.getResourceKeyFor(Us);

const getCommandKeyFrom = t => `${zs}:${t}`;

const getCommandAnnotation = (t, e) => F(N(e), t);

const Gs = u({
    name: zs,
    keyFrom: getCommandKeyFrom,
    define(t, s) {
        const i = BindingCommandDefinition.create(t, s);
        const n = i.Type;
        H(i, n, zs, e.resourceBaseName);
        return n;
    },
    getAnnotation: getCommandAnnotation,
    find(t, e) {
        const s = t.find(Us, e);
        return s == null ? null : F(zs, s) ?? getDefinitionFromStaticAu(s, Us, BindingCommandDefinition.create) ?? null;
    },
    get(t, s) {
        return t.get(e.resource(getCommandKeyFrom(s)));
    }
});

class OneTimeBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, s, i) {
        const n = t.attr;
        let r = n.target;
        let l = t.attr.rawValue;
        if (t.bindable == null) {
            r = i.map(t.node, r) ?? e.camelCase(r);
        } else {
            if (l === "" && t.def.kind === X) {
                l = e.camelCase(r);
            }
            r = t.bindable.name;
        }
        return new PropertyBindingInstruction(s.parse(l, y), r, P);
    }
}

OneTimeBindingCommand.$au = {
    type: Us,
    name: "one-time"
};

class ToViewBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, s, i) {
        const n = t.attr;
        let r = n.target;
        let l = t.attr.rawValue;
        if (t.bindable == null) {
            r = i.map(t.node, r) ?? e.camelCase(r);
        } else {
            if (l === "" && t.def.kind === X) {
                l = e.camelCase(r);
            }
            r = t.bindable.name;
        }
        return new PropertyBindingInstruction(s.parse(l, y), r, L);
    }
}

ToViewBindingCommand.$au = {
    type: Us,
    name: "to-view"
};

class FromViewBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, s, i) {
        const n = t.attr;
        let r = n.target;
        let l = n.rawValue;
        if (t.bindable == null) {
            r = i.map(t.node, r) ?? e.camelCase(r);
        } else {
            if (l === "" && t.def.kind === X) {
                l = e.camelCase(r);
            }
            r = t.bindable.name;
        }
        return new PropertyBindingInstruction(s.parse(l, y), r, D);
    }
}

FromViewBindingCommand.$au = {
    type: Us,
    name: "from-view"
};

class TwoWayBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, s, i) {
        const n = t.attr;
        let r = n.target;
        let l = n.rawValue;
        if (t.bindable == null) {
            r = i.map(t.node, r) ?? e.camelCase(r);
        } else {
            if (l === "" && t.def.kind === X) {
                l = e.camelCase(r);
            }
            r = t.bindable.name;
        }
        return new PropertyBindingInstruction(s.parse(l, y), r, M);
    }
}

TwoWayBindingCommand.$au = {
    type: Us,
    name: "two-way"
};

class DefaultBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(t, s, i) {
        const n = t.attr;
        const r = t.bindable;
        let l;
        let a;
        let h = n.target;
        let c = n.rawValue;
        if (r == null) {
            a = i.isTwoWay(t.node, h) ? M : L;
            h = i.map(t.node, h) ?? e.camelCase(h);
        } else {
            if (c === "" && t.def.kind === X) {
                c = e.camelCase(h);
            }
            l = t.def.defaultBindingMode;
            a = r.mode === _ || r.mode == null ? l == null || l === _ ? L : l : r.mode;
            h = r.name;
        }
        return new PropertyBindingInstruction(s.parse(c, y), h, a);
    }
}

DefaultBindingCommand.$au = {
    type: Us,
    name: "bind"
};

class ForBindingCommand {
    constructor() {
        this.He = e.resolve(qs);
    }
    get ignoreAttr() {
        return false;
    }
    build(t, s) {
        const i = t.bindable === null ? e.camelCase(t.attr.target) : t.bindable.name;
        const n = s.parse(t.attr.rawValue, w);
        let r = e.emptyArray;
        if (n.semiIdx > -1) {
            const e = t.attr.rawValue.slice(n.semiIdx + 1);
            const s = e.indexOf(":");
            if (s > -1) {
                const t = e.slice(0, s).trim();
                const i = e.slice(s + 1).trim();
                const n = this.He.parse(t, i);
                r = [ new MultiAttrInstruction(i, n.target, n.command) ];
            }
        }
        return new IteratorBindingInstruction(n, i, r);
    }
}

ForBindingCommand.$au = {
    type: Us,
    name: "for"
};

class TriggerBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, b), t.attr.target, false, t.attr.parts?.[2] ?? null);
    }
}

TriggerBindingCommand.$au = {
    type: Us,
    name: "trigger"
};

class CaptureBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, b), t.attr.target, true, t.attr.parts?.[2] ?? null);
    }
}

CaptureBindingCommand.$au = {
    type: Us,
    name: "capture"
};

class AttrBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new AttributeBindingInstruction(t.attr.target, e.parse(t.attr.rawValue, y), t.attr.target);
    }
}

AttrBindingCommand.$au = {
    type: Us,
    name: "attr"
};

class StyleBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new AttributeBindingInstruction("style", e.parse(t.attr.rawValue, y), t.attr.target);
    }
}

StyleBindingCommand.$au = {
    type: Us,
    name: "style"
};

class ClassBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new AttributeBindingInstruction("class", e.parse(t.attr.rawValue, y), t.attr.target);
    }
}

ClassBindingCommand.$au = {
    type: Us,
    name: "class"
};

class RefBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new RefBindingInstruction(e.parse(t.attr.rawValue, y), t.attr.target);
    }
}

RefBindingCommand.$au = {
    type: Us,
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
    type: Us,
    name: "...$attrs"
};

const Ks = /*@__PURE__*/ U("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

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
        t.register(z(this, this), G(this, Ks));
    }
    constructor() {
        this.Ve = f(createLookup(), {
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
        const t = e.resolve(ht);
        this.SVGElement = t.globalThis.SVGElement;
        const s = t.document.createElement("div");
        s.innerHTML = "<svg><altGlyph /></svg>";
        if (s.firstElementChild.nodeName === "altglyph") {
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

const Xs = /*@__PURE__*/ U("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    constructor() {
        this.fns = [];
        this.je = createLookup();
        this.We = createLookup();
        this.svg = e.resolve(Ks);
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

const Qs = createLookup();

class AttributeNSAccessor {
    static forNs(t) {
        return Qs[t] ??= new AttributeNSAccessor(t);
    }
    constructor(t) {
        this.ns = t;
        this.type = B | S;
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
        this.type = B | S;
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

const Ys = /*@__PURE__*/ new DataAttributeAccessor;

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
                e[e.length] = c.call(n, "model") ? n.model : n.value;
            }
            ++i;
        }
        return e;
    }
    static ze(t, e) {
        return t === e;
    }
    constructor(t, e, s, i) {
        this.type = B | A | S;
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
        this.wt();
    }
    wt() {
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
            const l = c.call(e, "model") ? e.model : e.value;
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
                    a.push(c.call(r, "model") ? r.model : r.value);
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
                r = c.call(l, "model") ? l.model : l.value;
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
    s.subscriberCollection(SelectValueObserver, null);
})();

const Zs = "--";

class StyleAttributeAccessor {
    constructor(t) {
        this.obj = t;
        this.type = B | S;
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
        this.wt();
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
        let s;
        let i;
        const n = [];
        for (i in t) {
            s = t[i];
            if (s == null) {
                continue;
            }
            if (isString(s)) {
                if (i.startsWith(Zs)) {
                    n.push([ i, s ]);
                    continue;
                }
                n.push([ e.kebabCase(i), s ]);
                continue;
            }
            n.push(...this.es(s));
        }
        return n;
    }
    ss(t) {
        const s = t.length;
        if (s > 0) {
            const e = [];
            let i = 0;
            for (;s > i; ++i) {
                e.push(...this.es(t[i]));
            }
            return e;
        }
        return e.emptyArray;
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
        return e.emptyArray;
    }
    wt() {
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
            const u = s.length;
            for (;h < u; ++h) {
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
                if (!c.call(e, i) || e[i] !== n) {
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
        this.type = B | A | S;
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
        if (g(t, this.v)) {
            return;
        }
        this.ov = this.v;
        this.v = t;
        this.Ge = true;
        if (!this.cf.readonly) {
            this.wt();
        }
    }
    wt() {
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
    s.subscriberCollection(ValueAttributeObserver, null);
})();

const Js = "http://www.w3.org/1999/xlink";

const ti = "http://www.w3.org/XML/1998/namespace";

const ei = "http://www.w3.org/2000/xmlns/";

const si = f(createLookup(), {
    "xlink:actuate": [ "actuate", Js ],
    "xlink:arcrole": [ "arcrole", Js ],
    "xlink:href": [ "href", Js ],
    "xlink:role": [ "role", Js ],
    "xlink:show": [ "show", Js ],
    "xlink:title": [ "title", Js ],
    "xlink:type": [ "type", Js ],
    "xml:lang": [ "lang", ti ],
    "xml:space": [ "space", ti ],
    xmlns: [ "xmlns", ei ],
    "xmlns:xlink": [ "xlink", ei ]
});

const ii = new s.PropertyAccessor;

ii.type = B | S;

class NodeObserverLocator {
    static register(t) {
        t.register(z(this, this), G(this, s.INodeObserverLocator));
    }
    constructor() {
        this.allowDirtyCheck = true;
        this.rs = createLookup();
        this.os = createLookup();
        this.ls = createLookup();
        this.cs = createLookup();
        this.us = e.resolve(e.IServiceLocator);
        this.p = e.resolve(ht);
        this.ds = e.resolve(s.IDirtyChecker);
        this.svg = e.resolve(Ks);
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
    getAccessor(t, s, i) {
        if (s in this.cs || s in (this.ls[t.tagName] ?? e.emptyObject)) {
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
            return Ys;

          default:
            {
                const e = si[s];
                if (e !== undefined) {
                    return AttributeNSAccessor.forNs(e[1]);
                }
                if (isDataAttribute(t, s, this.svg)) {
                    return Ys;
                }
                return ii;
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
    getNodeObserver(t, e, i) {
        const n = this.rs[t.tagName]?.[e] ?? this.os[e];
        let r;
        if (n != null) {
            r = new (n.type ?? ValueAttributeObserver)(t, e, n, i, this.us);
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
        const r = si[e];
        if (r !== undefined) {
            return AttributeNSAccessor.forNs(r[1]);
        }
        if (isDataAttribute(t, e, this.svg)) {
            return Ys;
        }
        if (e in t.constructor.prototype) {
            if (this.allowDirtyCheck) {
                return this.ds.createProperty(t, e);
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
        this.type = B | A | S;
        this.v = void 0;
        this.ov = void 0;
        this.ps = void 0;
        this.gs = void 0;
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
        this.xs();
        this.ws();
        this.Ze();
    }
    handleCollectionChange() {
        this.ws();
    }
    handleChange(t, e) {
        this.ws();
    }
    ws() {
        const t = this.v;
        const e = this.ut;
        const s = c.call(e, "model") ? e.model : e.value;
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
        const s = c.call(e, "model") ? e.model : e.value;
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
        this.xs();
    }
    gt() {
        this.ps?.unsubscribe(this);
        this.gs?.unsubscribe(this);
        this.ps = this.gs = void 0;
    }
    Ze() {
        ni = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, ni);
    }
    xs() {
        const t = this.ut;
        (this.gs ??= t.$observers?.model ?? t.$observers?.value)?.subscribe(this);
        this.ps?.unsubscribe(this);
        this.ps = void 0;
        if (t.type === "checkbox") {
            (this.ps = getCollectionObserver(this.v, this.oL))?.subscribe(this);
        }
    }
}

(() => {
    mixinNodeObserverUseConfig(CheckedObserver);
    s.subscriberCollection(CheckedObserver, null);
})();

let ni = void 0;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) {
            throw createMappedError(9994, e);
        }
        e.useTargetObserver(Ys);
    }
}

AttrBindingBehavior.$au = {
    type: Z,
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
    type: Z,
    name: "self"
};

class UpdateTriggerBindingBehavior {
    constructor() {
        this.oL = e.resolve(s.IObserverLocator);
        this.bs = e.resolve(s.INodeObserverLocator);
    }
    bind(t, e, ...s) {
        if (!(this.bs instanceof NodeObserverLocator)) {
            throw createMappedError(9993);
        }
        if (s.length === 0) {
            throw createMappedError(802);
        }
        if (!(e instanceof PropertyBinding) || !(e.mode & D)) {
            throw createMappedError(803);
        }
        const i = this.bs.getNodeObserverConfig(e.target, e.targetProperty);
        if (i == null) {
            throw createMappedError(9992, e);
        }
        const n = this.bs.getNodeObserver(e.target, e.targetProperty, this.oL);
        n.useConfig({
            readonly: i.readonly,
            default: i.default,
            events: s
        });
        e.useTargetObserver(n);
    }
}

UpdateTriggerBindingBehavior.$au = {
    type: Z,
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
        this.Cs = e.resolve(Lt);
        this.l = e.resolve(vs);
    }
    attaching(t, e) {
        return this.As(this.value);
    }
    detaching(t, s) {
        this.ys = true;
        return e.onResolve(this.pending, (() => {
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
        const s = this.view;
        const i = this.$controller;
        const n = this.ks++;
        const isCurrent = () => !this.ys && this.ks === n + 1;
        let r;
        return e.onResolve(this.pending, (() => this.pending = e.onResolve(s?.deactivate(s, i), (() => {
            if (!isCurrent()) {
                return;
            }
            if (t) {
                r = this.view = this.ifView = this.cache && this.ifView != null ? this.ifView : this.Cs.create();
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
    type: ut,
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
        this.f = e.resolve(Lt);
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

const ri = [ "BindingBehavior", "ValueConverter" ];

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
        this.Ds = false;
        const r = t.props[0].props[0];
        if (r !== void 0) {
            const {to: t, value: s, command: i} = r;
            if (t === "key") {
                if (i === null) {
                    this.key = s;
                } else if (i === "bind") {
                    this.key = e.parse(s, y);
                } else {
                    throw createMappedError(775, i);
                }
            } else {
                throw createMappedError(776, t);
            }
        }
        this.l = s;
        this.Ms = i;
        this.f = n;
    }
    binding(t, e) {
        const s = this.Ms.bindings;
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
                while (t != null && ri.includes(t.$kind)) {
                    t = t.expression;
                    this.Rs = true;
                }
                this.Ps = t;
                break;
            }
        }
        this.qs();
        const a = r.declaration;
        if (!(this.Ds = a.$kind === "ArrayDestructuring" || a.$kind === "ObjectDestructuring")) {
            this.local = E(a, this.$controller.scope, n, null);
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
            this.items = E(this.forOf.iterable, s.scope, this._s, null);
            this.Is = false;
            return;
        }
        this.Fs();
        this.Vs(t, e);
    }
    Vs(t, i) {
        const n = this.views;
        this.Bs = n.slice();
        const r = n.length;
        const l = this.key;
        const a = l !== null;
        if (a || i === void 0) {
            const t = this.local;
            const e = this.Ls;
            const h = e.length;
            const c = this.forOf;
            const u = c.declaration;
            const f = this._s;
            const d = this.Ds;
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
                        i.deletedItems.push(E(u, n[p].scope, f, null));
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
                        s[p] = E(u, n[p].scope, f, null);
                    }
                } else {
                    for (p = 0; p < r; ++p) {
                        s[p] = n[p].scope.bindingContext[t];
                    }
                }
                let m;
                let g;
                let x;
                let v;
                let w = 0;
                const b = r - 1;
                const y = h - 1;
                const k = new Map;
                const C = new Map;
                const A = this.Ss;
                const B = this.Ts;
                const S = this.$controller.scope;
                p = 0;
                t: {
                    while (true) {
                        if (a) {
                            m = s[p];
                            g = e[p];
                            x = getKeyValue(A, l, m, getScope(B, m, c, S, f, t, d), f);
                            v = getKeyValue(A, l, g, getScope(B, g, c, S, f, t, d), f);
                        } else {
                            m = x = ensureUnique(s[p], p);
                            g = v = ensureUnique(e[p], p);
                        }
                        if (x !== v) {
                            A.set(m, x);
                            A.set(g, v);
                            break;
                        }
                        ++p;
                        if (p > b || p > y) {
                            break t;
                        }
                    }
                    if (b !== y) {
                        break t;
                    }
                    w = y;
                    while (true) {
                        if (a) {
                            m = s[w];
                            g = e[w];
                            x = getKeyValue(A, l, m, getScope(B, m, c, S, f, t, d), f);
                            v = getKeyValue(A, l, g, getScope(B, g, c, S, f, t, d), f);
                        } else {
                            m = x = ensureUnique(s[p], p);
                            g = v = ensureUnique(e[p], p);
                        }
                        if (x !== v) {
                            A.set(m, x);
                            A.set(g, v);
                            break;
                        }
                        --w;
                        if (p > w) {
                            break t;
                        }
                    }
                }
                const T = p;
                const R = p;
                for (p = R; p <= y; ++p) {
                    if (A.has(g = a ? e[p] : ensureUnique(e[p], p))) {
                        v = A.get(g);
                    } else {
                        v = a ? getKeyValue(A, l, g, getScope(B, g, c, S, f, t, d), f) : g;
                        A.set(g, v);
                    }
                    C.set(v, p);
                }
                for (p = T; p <= b; ++p) {
                    if (A.has(m = a ? s[p] : ensureUnique(s[p], p))) {
                        x = A.get(m);
                    } else {
                        x = a ? getKeyValue(A, l, m, n[p].scope, f) : m;
                    }
                    k.set(x, p);
                    if (C.has(x)) {
                        i[C.get(x)] = p;
                    } else {
                        i.deletedIndices.push(p);
                        i.deletedItems.push(m);
                    }
                }
                for (p = R; p <= y; ++p) {
                    if (!k.has(A.get(a ? e[p] : ensureUnique(e[p], p)))) {
                        i[p] = -2;
                    }
                }
                k.clear();
                C.clear();
            }
        }
        if (i === void 0) {
            const t = e.onResolve(this.Hs(null), (() => this.Os(null)));
            if (isPromise(t)) {
                t.catch(rethrow);
            }
        } else {
            if (i.deletedIndices.length > 0) {
                const t = e.onResolve(this.Ns(i), (() => this.$s(r, i)));
                if (isPromise(t)) {
                    t.catch(rethrow);
                }
            } else {
                this.$s(r, i);
            }
        }
    }
    qs() {
        const t = this.$controller.scope;
        let e = this.js;
        let i = this.Rs;
        let n;
        if (i) {
            e = this.js = E(this.Ps, t, this._s, null) ?? null;
            i = this.Rs = !g(this.items, e);
        }
        const r = this.Es;
        if (this.$controller.isActive) {
            n = this.Es = s.getCollectionObserver(i ? e : this.items);
            if (r !== n) {
                r?.unsubscribe(this);
                n?.subscribe(this);
            }
        } else {
            r?.unsubscribe(this);
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
        const {$controller: r, f: l, local: a, l: h, items: c, Ts: u, _s: f, forOf: d, Ds: p} = this;
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
        const {$controller: a, f: h, local: c, Ls: u, l: f, views: d, Ds: p, _s: m, Ts: g, Bs: x, forOf: v} = this;
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
        const b = a.scope;
        const y = e.length;
        let k = 0;
        l = 0;
        for (;l < e.length; ++l) {
            if ((k = e[l]) !== -2) {
                d[l] = x[k];
            }
        }
        const C = longestIncreasingSubsequence(e);
        const A = C.length;
        const B = v.declaration;
        let S;
        let E = A - 1;
        l = y - 1;
        for (;l >= 0; --l) {
            n = d[l];
            S = d[l + 1];
            n.nodes.link(S?.nodes ?? f);
            if (e[l] === -2) {
                r = getScope(g, u[l], v, b, m, c, p);
                setContextualProperties(r.overrideContext, l, y);
                n.setLocation(f);
                i = n.activate(n, a, r);
                if (isPromise(i)) {
                    (s ?? (s = [])).push(i);
                }
            } else if (E < 0 || A === 1 || l !== C[E]) {
                if (p) {
                    T(B, n.scope, m, u[l]);
                } else {
                    n.scope.bindingContext[c] = u[l];
                }
                setContextualProperties(n.scope.overrideContext, l, y);
                n.nodes.insertBefore(n.location);
            } else {
                if (p) {
                    T(B, n.scope, m, u[l]);
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
    type: ut,
    name: "repeat",
    isTemplateController: true,
    bindables: [ "items" ]
};

Repeat.inject = [ le, t.IExpressionParser, vs, us, Lt ];

let oi = 16;

let li = new Int32Array(oi);

let ai = new Int32Array(oi);

function longestIncreasingSubsequence(t) {
    const e = t.length;
    if (e > oi) {
        oi = e;
        li = new Int32Array(e);
        ai = new Int32Array(e);
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
            l = li[s];
            n = t[l];
            if (n !== -2 && n < i) {
                ai[r] = l;
                li[++s] = r;
                continue;
            }
            a = 0;
            h = s;
            while (a < h) {
                c = a + h >> 1;
                n = t[li[c]];
                if (n !== -2 && n < i) {
                    a = c + 1;
                } else {
                    h = c;
                }
            }
            n = t[li[a]];
            if (i < n || n === -2) {
                if (a > 0) {
                    ai[r] = li[a - 1];
                }
                li[a] = r;
            }
        }
    }
    r = ++s;
    const u = new Int32Array(r);
    i = li[s - 1];
    while (s-- > 0) {
        u[s] = i;
        i = ai[i];
    }
    while (r-- > 0) li[r] = 0;
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

const hi = h.toString;

const getCount = t => {
    switch (hi.call(t)) {
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
    switch (hi.call(t)) {
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
            r = E(e, i, n, null);
        }
        t.set(s, r);
    }
    return r;
};

const getScope = (t, e, s, i, n, r, l) => {
    let a = t.get(e);
    if (a === void 0) {
        if (l) {
            T(s.declaration, a = Scope.fromParent(i, new BindingContext), n, e);
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
        this.view = e.resolve(Lt).create().setLocation(e.resolve(vs));
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
    type: ut,
    name: "with",
    isTemplateController: true,
    bindables: [ "value" ]
};

class Switch {
    constructor() {
        this.cases = [];
        this.activeCases = [];
        this.promise = void 0;
        this.f = e.resolve(Lt);
        this.l = e.resolve(vs);
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
        const s = t.isMatch(this.value);
        const i = this.activeCases;
        const n = i.length;
        if (!s) {
            if (n > 0 && i[0].id === t.id) {
                return this.Us(null);
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
        return e.onResolve(this.Us(null, r), (() => {
            this.activeCases = r;
            return this.zs(null);
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
        return e.onResolve(this.activeCases.length > 0 ? this.Us(t, i) : void 0, (() => {
            this.activeCases = i;
            if (i.length === 0) {
                return;
            }
            return this.zs(t);
        }));
    }
    zs(t) {
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
    Us(t, s = []) {
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
    type: ut,
    name: "switch",
    isTemplateController: true,
    bindables: [ "value" ]
};

let ci = 0;

class Case {
    constructor() {
        this.id = ++ci;
        this.fallThrough = false;
        this.view = void 0;
        this.f = e.resolve(Lt);
        this.us = e.resolve(s.IObserverLocator);
        this.l = e.resolve(vs);
        this.Gs = e.resolve(e.ILogger).scopeTo(`${this.constructor.name}-#${this.id}`);
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
        mode: P,
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
        this.f = e.resolve(Lt);
        this.l = e.resolve(vs);
        this.p = e.resolve(ht);
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
        const l = this.rejected;
        const a = this.pending;
        const h = this.viewScope;
        let c;
        const u = {
            reusable: false
        };
        const $swap = () => {
            void e.onResolveAll(c = (this.preSettledTask = i.queueTask((() => e.onResolveAll(n?.deactivate(t), l?.deactivate(t), a?.activate(t, h))), u)).result.catch((t => {
                if (!(t instanceof r.TaskAbortError)) throw t;
            })), s.then((r => {
                if (this.value !== s) {
                    return;
                }
                const fulfill = () => {
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => e.onResolveAll(a?.deactivate(t), l?.deactivate(t), n?.activate(t, h, r))), u)).result;
                };
                if (this.preSettledTask.status === C) {
                    void c.then(fulfill);
                } else {
                    this.preSettledTask.cancel();
                    fulfill();
                }
            }), (r => {
                if (this.value !== s) {
                    return;
                }
                const reject = () => {
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => e.onResolveAll(a?.deactivate(t), n?.deactivate(t), l?.activate(t, h, r))), u)).result;
                };
                if (this.preSettledTask.status === C) {
                    void c.then(reject);
                } else {
                    this.preSettledTask.cancel();
                    reject();
                }
            })));
        };
        if (this.postSettledTask?.status === C) {
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
    type: ut,
    name: "promise",
    isTemplateController: true,
    bindables: [ "value" ]
};

class PendingTemplateController {
    constructor() {
        this.view = void 0;
        this.f = e.resolve(Lt);
        this.l = e.resolve(vs);
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
    type: ut,
    name: "pending",
    isTemplateController: true,
    bindables: {
        value: {
            mode: L
        }
    }
};

class FulfilledTemplateController {
    constructor() {
        this.view = void 0;
        this.f = e.resolve(Lt);
        this.l = e.resolve(vs);
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
    type: ut,
    name: "then",
    isTemplateController: true,
    bindables: {
        value: {
            mode: D
        }
    }
};

class RejectedTemplateController {
    constructor() {
        this.view = void 0;
        this.f = e.resolve(Lt);
        this.l = e.resolve(vs);
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
    type: ut,
    name: "catch",
    isTemplateController: true,
    bindables: {
        value: {
            mode: D
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

Os.define([ {
    pattern: "promise.resolve",
    symbols: ""
} ], PromiseAttributePattern);

class FulfilledAttributePattern {
    then(t, e) {
        return new AttrSyntax(t, e, "then", "from-view");
    }
}

Os.define([ {
    pattern: "then",
    symbols: ""
} ], FulfilledAttributePattern);

class RejectedAttributePattern {
    catch(t, e) {
        return new AttrSyntax(t, e, "catch", "from-view");
    }
}

Os.define([ {
    pattern: "catch",
    symbols: ""
} ], RejectedAttributePattern);

class Focus {
    constructor() {
        this.Xs = false;
        this.Qs = e.resolve(gs);
        this.p = e.resolve(ht);
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
    type: ut,
    name: "focus",
    bindables: {
        value: {
            mode: M
        }
    }
};

class Portal {
    constructor() {
        this.position = "beforeend";
        this.strict = false;
        const t = e.resolve(Lt);
        const s = e.resolve(vs);
        const i = e.resolve(ht);
        this.p = i;
        this.Js = i.document.createElement("div");
        (this.view = t.create()).setLocation(this.ti = createLocation(i));
        setEffectiveParentNode(this.view.nodes, s);
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
        const s = this.ei();
        if (this.Js === s) {
            return;
        }
        this.Js = s;
        const i = e.onResolve(this.ni(null, s), (() => {
            this.si(s, this.position);
            return this.ii(null, s);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    positionChanged() {
        const {$controller: t, Js: s} = this;
        if (!t.isActive) {
            return;
        }
        const i = e.onResolve(this.ni(null, s), (() => {
            this.si(s, this.position);
            return this.ii(null, s);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    ii(t, s) {
        const {activating: i, callbackContext: n, view: r} = this;
        return e.onResolve(i?.call(n, s, r), (() => this.ri(t, s)));
    }
    ri(t, s) {
        const {$controller: i, view: n} = this;
        if (t === null) {
            n.nodes.insertBefore(this.ti);
        } else {
            return e.onResolve(n.activate(t ?? n, i, i.scope), (() => this.oi(s)));
        }
        return this.oi(s);
    }
    oi(t) {
        const {activated: e, callbackContext: s, view: i} = this;
        return e?.call(s, t, i);
    }
    ni(t, s) {
        const {deactivating: i, callbackContext: n, view: r} = this;
        return e.onResolve(i?.call(n, s, r), (() => this.li(t, s)));
    }
    li(t, s) {
        const {$controller: i, view: n} = this;
        if (t === null) {
            n.nodes.remove();
        } else {
            return e.onResolve(n.deactivate(t, i), (() => this.ai(s)));
        }
        return this.ai(s);
    }
    ai(t) {
        const {deactivated: s, callbackContext: i, view: n} = this;
        return e.onResolve(s?.call(i, t, n), (() => this.hi()));
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
    type: ut,
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

let ui;

class AuSlot {
    constructor() {
        this.ui = null;
        this.fi = null;
        this.Xt = false;
        this.expose = null;
        this.slotchange = null;
        this.di = new Set;
        this.Es = null;
        const t = e.resolve(fs);
        const s = e.resolve(vs);
        const i = e.resolve(le);
        const n = e.resolve(_e);
        const r = this.name = i.data.name;
        const l = i.projections?.[_t];
        const a = t.instruction?.projections?.[r];
        const h = t.controller.container;
        let c;
        let u;
        if (a == null) {
            u = h.createChild({
                inheritParentResources: true
            });
            c = n.getViewFactory(l ?? (ui ??= CustomElementDefinition.create({
                name: "au-slot-empty-template",
                template: "",
                needsCompile: false
            })), u);
            this.pi = false;
        } else {
            u = h.createChild();
            u.useResources(t.parent.controller.container);
            registerResolver(u, fs, new e.InstanceProvider(void 0, t.parent));
            c = n.getViewFactory(a, u);
            this.pi = true;
            this.mi = h.getAll(Ot, false)?.filter((t => t.slotName === "*" || t.slotName === r)) ?? e.emptyArray;
        }
        this.gi = (this.mi ??= e.emptyArray).length > 0;
        this.xi = t;
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
        this.di.add(t);
    }
    unsubscribe(t) {
        this.di.delete(t);
    }
    binding(t, e) {
        this.ui = this.$controller.scope.parent;
        let s;
        if (this.pi) {
            s = this.xi.controller.scope.parent;
            (this.fi = Scope.fromParent(s, s.bindingContext)).overrideContext.$host = this.expose ?? this.ui.bindingContext;
        }
    }
    attaching(t, s) {
        return e.onResolve(this.view.activate(t, this.$controller, this.pi ? this.fi : this.ui), (() => {
            if (this.gi) {
                this.mi.forEach((t => t.watch(this)));
                this.xs();
                this.vi();
                this.Xt = true;
            }
        }));
    }
    detaching(t, e) {
        this.Xt = false;
        this.wi();
        this.mi.forEach((t => t.unwatch(this)));
        return this.view.deactivate(t, this.$controller);
    }
    exposeChanged(t) {
        if (this.pi && this.fi != null) {
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
    xs() {
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
                this.vi();
            }
        }))).observe(e, {
            childList: true
        });
    }
    wi() {
        this.Es?.disconnect();
        this.Es = null;
    }
    vi() {
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
    type: Ss,
    name: "au-slot",
    template: null,
    containerless: true,
    processContent(t, e, s) {
        s.name = t.getAttribute("name") ?? _t;
        let i = t.firstChild;
        let n = null;
        while (i !== null) {
            n = i.nextSibling;
            if (isElement(i) && i.hasAttribute(qt)) {
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
        this.bi = void 0;
        this.tag = null;
        this.c = e.resolve(e.IContainer);
        this.parent = e.resolve(us);
        this.yi = e.resolve(gs);
        this.l = e.resolve(vs);
        this.p = e.resolve(ht);
        this.r = e.resolve(_e);
        this.ki = e.resolve(le);
        this.Ci = e.resolve(e.transient(CompositionContextFactory, null));
        this.st = e.resolve(ae);
        this.J = e.resolve(fs);
        this.ep = e.resolve(t.IExpressionParser);
        this.oL = e.resolve(s.IObserverLocator);
    }
    get composing() {
        return this.Ai;
    }
    get composition() {
        return this.bi;
    }
    attaching(t, s) {
        return this.Ai = e.onResolve(this.queue(new ChangeInfo(this.template, this.component, this.model, void 0), t), (t => {
            if (this.Ci.Bi(t)) {
                this.Ai = void 0;
            }
        }));
    }
    detaching(t) {
        const s = this.bi;
        const i = this.Ai;
        this.Ci.invalidate();
        this.bi = this.Ai = void 0;
        return e.onResolve(i, (() => s?.deactivate(t)));
    }
    propertyChanged(t) {
        if (t === "composing" || t === "composition") return;
        if (t === "model" && this.bi != null) {
            this.bi.update(this.model);
            return;
        }
        if (t === "tag" && this.bi?.controller.vmKind === ts) {
            return;
        }
        this.Ai = e.onResolve(this.Ai, (() => e.onResolve(this.queue(new ChangeInfo(this.template, this.component, this.model, t), void 0), (t => {
            if (this.Ci.Bi(t)) {
                this.Ai = void 0;
            }
        }))));
    }
    queue(t, s) {
        const i = this.Ci;
        const n = this.bi;
        return e.onResolve(i.create(t), (t => {
            if (i.Bi(t)) {
                return e.onResolve(this.compose(t), (r => {
                    if (i.Bi(t)) {
                        return e.onResolve(r.activate(s), (() => {
                            if (i.Bi(t)) {
                                this.bi = r;
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
        const {Si: s, Ti: i, Ei: n} = t.change;
        const {c: r, $controller: l, l: a, ki: h} = this;
        const c = this.Ri(this.J.controller.container, i);
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
        const p = this.Ii(u, typeof i === "string" ? c.Type : i, f, d);
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
                this.Pi(f, c, r).forEach((t => a.addBinding(t)));
                return new CompositionController(a, (t => a.activate(t ?? a, l, l.scope.parent)), (t => e.onResolve(a.deactivate(t ?? a, l), removeCompositionHost)), (t => p.activate?.(t)), t);
            } else {
                const n = CustomElementDefinition.create({
                    name: Is.generateName(),
                    template: s
                });
                const r = this.r.getViewFactory(n, u);
                const a = Controller.$view(r, l);
                const h = this.scopeBehavior === "auto" ? Scope.fromParent(this.parent.scope, p) : Scope.create(p);
                a.setHost(f);
                if (d == null) {
                    this.Pi(f, n, i).forEach((t => a.addBinding(t)));
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
    Ii(t, s, i, n) {
        if (s == null) {
            return new EmptyComponent;
        }
        if (typeof s === "object") {
            return s;
        }
        const r = this.p;
        registerHostNode(t, r, i);
        registerResolver(t, vs, new e.InstanceProvider("IRenderLocation", n));
        const l = t.invoke(s);
        registerResolver(t, s, new e.InstanceProvider("au-compose.component", l));
        return l;
    }
    Ri(t, e) {
        if (typeof e === "string") {
            const s = Is.find(t, e);
            if (s == null) {
                throw createMappedError(806, e);
            }
            return s;
        }
        const s = isFunction(e) ? e : e?.constructor;
        return Is.isType(s, void 0) ? Is.getDefinition(s, null) : null;
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
    type: Ss,
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
        mode: D
    }, {
        name: "composition",
        mode: D
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
        return e.onResolve(t.load(), (t => new CompositionContext(++this.id, t)));
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

const fi = /*@__PURE__*/ U("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw createMappedError(99, "sanitize");
    }
})));

class SanitizeValueConverter {
    constructor() {
        this.Di = e.resolve(fi);
    }
    toView(t) {
        if (t == null) {
            return null;
        }
        return this.Di.sanitize(t);
    }
}

SanitizeValueConverter.$au = {
    type: gt,
    name: "sanitize"
};

const di = /*@__PURE__*/ U("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const pi = {};

class TemplateElementFactory {
    constructor() {
        this.p = e.resolve(ht);
        this.Si = this.t();
    }
    t() {
        return this.p.document.createElement("template");
    }
    createTemplate(t) {
        if (isString(t)) {
            let e = pi[t];
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
                pi[t] = e;
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
        this.Mi = e.resolve(Ci);
        this.debug = false;
        this.resolveResources = true;
    }
    static register(t) {
        t.register(z(this, this), G(this, ae));
    }
    compile(t, s, i) {
        if (t.template == null || t.needsCompile === false) {
            return t;
        }
        i ??= vi;
        const n = new CompilationContext(t, s, i, null, null, void 0);
        const r = isString(t.template) || !t.enhance ? n._i.createTemplate(t.template) : t.template;
        const l = r.nodeName === mi && r.content != null;
        const a = l ? r.content : r;
        const h = Ei.findAll(s);
        const c = h.length;
        let u = 0;
        if (c > 0) {
            while (c > u) {
                h[u].compiling?.(r);
                ++u;
            }
        }
        if (r.hasAttribute(Si)) {
            throw createMappedError(701, t);
        }
        this.qi(a, n);
        this.Fi(a, n);
        const f = CustomElementDefinition.create({
            ...t,
            name: t.name || Es(),
            dependencies: (t.dependencies ?? e.emptyArray).concat(n.deps ?? e.emptyArray),
            instructions: n.rows,
            surrogates: l ? this.Oi(r, n) : e.emptyArray,
            template: r,
            hasSlots: n.hasSlot,
            needsCompile: false
        });
        if (n.deps != null) {
            const t = [ f.Type, ...f.dependencies, ...n.deps ];
            for (const e of n.deps) {
                getElementDefinition(e).dependencies.push(...t.filter((t => t !== e)));
            }
        }
        return f;
    }
    compileSpread(t, s, i, n, r) {
        const l = new CompilationContext(t, i, vi, null, null, void 0);
        const a = [];
        const h = r ?? l.Hi(n.nodeName.toLowerCase());
        const c = h !== null;
        const u = l.ep;
        const f = s.length;
        let d = 0;
        let p;
        let m = null;
        let g;
        let x;
        let w;
        let b;
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
            k = l.Vi(p);
            if (k !== null && k.ignoreAttr) {
                bi.node = n;
                bi.attr = p;
                bi.bindable = null;
                bi.def = null;
                a.push(k.build(bi, l.ep, l.m));
                continue;
            }
            m = l.Ni(B);
            if (m !== null) {
                if (m.isTemplateController) {
                    throw createMappedError(9998, B);
                }
                w = this.Mi.get(m);
                A = m.noMultiBindings === false && k === null && hasInlineBindings(S);
                if (A) {
                    x = this.$i(n, S, m, l);
                } else {
                    y = w.primary;
                    if (k === null) {
                        C = u.parse(S, v);
                        x = [ C === null ? new SetPropertyInstruction(S, y.name) : new InterpolationInstruction(C, y.name) ];
                    } else {
                        bi.node = n;
                        bi.attr = p;
                        bi.bindable = y;
                        bi.def = m;
                        x = [ k.build(bi, l.ep, l.m) ];
                    }
                }
                (g ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? m : m.name, m.aliases != null && m.aliases.includes(B) ? B : void 0, x));
                continue;
            }
            if (k === null) {
                C = u.parse(S, v);
                if (c) {
                    w = this.Mi.get(h);
                    b = w.attrs[B];
                    if (b !== void 0) {
                        C = u.parse(S, v);
                        a.push(new SpreadElementPropBindingInstruction(C == null ? new SetPropertyInstruction(S, b.name) : new InterpolationInstruction(C, b.name)));
                        continue;
                    }
                }
                if (C != null) {
                    a.push(new InterpolationInstruction(C, l.m.map(n, B) ?? e.camelCase(B)));
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
                    w = this.Mi.get(h);
                    b = w.attrs[B];
                    if (b !== void 0) {
                        bi.node = n;
                        bi.attr = p;
                        bi.bindable = b;
                        bi.def = h;
                        a.push(new SpreadElementPropBindingInstruction(k.build(bi, l.ep, l.m)));
                        continue;
                    }
                }
                bi.node = n;
                bi.attr = p;
                bi.bindable = null;
                bi.def = null;
                a.push(k.build(bi, l.ep, l.m));
            }
        }
        resetCommandBuildInfo();
        if (g != null) {
            return g.concat(a);
        }
        return a;
    }
    Oi(t, s) {
        const i = [];
        const n = t.attributes;
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
        let x;
        let w = null;
        let b;
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
            if (yi[k]) {
                throw createMappedError(702, c);
            }
            w = s.Vi(f);
            if (w !== null && w.ignoreAttr) {
                bi.node = t;
                bi.attr = f;
                bi.bindable = null;
                bi.def = null;
                i.push(w.build(bi, s.ep, s.m));
                continue;
            }
            d = s.Ni(k);
            if (d !== null) {
                if (d.isTemplateController) {
                    throw createMappedError(703, k);
                }
                g = this.Mi.get(d);
                y = d.noMultiBindings === false && w === null && hasInlineBindings(C);
                if (y) {
                    m = this.$i(t, C, d, s);
                } else {
                    x = g.primary;
                    if (w === null) {
                        b = r.parse(C, v);
                        m = b === null ? C === "" ? [] : [ new SetPropertyInstruction(C, x.name) ] : [ new InterpolationInstruction(b, x.name) ];
                    } else {
                        bi.node = t;
                        bi.attr = f;
                        bi.bindable = x;
                        bi.def = d;
                        m = [ w.build(bi, s.ep, s.m) ];
                    }
                }
                t.removeAttribute(c);
                --a;
                --l;
                (p ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? d : d.name, d.aliases != null && d.aliases.includes(k) ? k : void 0, m));
                continue;
            }
            if (w === null) {
                b = r.parse(C, v);
                if (b != null) {
                    t.removeAttribute(c);
                    --a;
                    --l;
                    i.push(new InterpolationInstruction(b, s.m.map(t, k) ?? e.camelCase(k)));
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
                bi.node = t;
                bi.attr = f;
                bi.bindable = null;
                bi.def = null;
                i.push(w.build(bi, s.ep, s.m));
            }
        }
        resetCommandBuildInfo();
        if (p != null) {
            return p.concat(i);
        }
        return i;
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
    ji(s, i) {
        const n = s.attributes;
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
        let x;
        let w;
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
            x = f.rawValue;
            m = i.Vi(f);
            if (m !== null) {
                if (f.command === "bind") {
                    l.push(new LetBindingInstruction(a.parse(x, y), e.camelCase(g)));
                } else {
                    throw createMappedError(704, f);
                }
                continue;
            }
            w = a.parse(x, v);
            l.push(new LetBindingInstruction(w === null ? new t.PrimitiveLiteralExpression(x) : w, e.camelCase(g)));
        }
        i.rows.push([ new HydrateLetElementInstruction(l, h) ]);
        return this.zi(s, i).nextSibling;
    }
    Wi(t, s) {
        const i = t.nextSibling;
        const n = (t.getAttribute("as-element") ?? t.nodeName).toLowerCase();
        const r = s.Hi(n);
        const l = r !== null;
        const a = l && r.shadowOptions != null;
        const h = r?.capture;
        const c = h != null && typeof h !== "boolean";
        const u = h ? [] : e.emptyArray;
        const f = s.ep;
        const d = this.debug ? e.noop : () => {
            t.removeAttribute(b);
            --x;
            --g;
        };
        let p = t.attributes;
        let m;
        let g = p.length;
        let x = 0;
        let w;
        let b;
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
        let L;
        let D;
        let M = null;
        let _;
        let q;
        let F;
        let O;
        let H = true;
        let V = false;
        let N = false;
        let $ = false;
        let j;
        if (n === "slot") {
            if (s.root.def.shadowOptions == null) {
                throw createMappedError(717, s.root.def.name);
            }
            s.root.hasSlot = true;
        }
        if (l) {
            j = {};
            H = r.processContent?.call(r.Type, t, s.p, j);
            p = t.attributes;
            g = p.length;
        }
        for (;g > x; ++x) {
            w = p[x];
            b = w.name;
            y = w.value;
            switch (b) {
              case "as-element":
              case "containerless":
                d();
                if (!V) {
                    V = b === "containerless";
                }
                continue;
            }
            k = s.He.parse(b, y);
            M = s.Vi(k);
            F = k.target;
            O = k.rawValue;
            if (h && (!c || c && h(F))) {
                if (M != null && M.ignoreAttr) {
                    d();
                    u.push(k);
                    continue;
                }
                N = F !== qt && F !== "slot";
                if (N) {
                    _ = this.Mi.get(r);
                    if (_.attrs[F] == null && !s.Ni(F)?.isTemplateController) {
                        d();
                        u.push(k);
                        continue;
                    }
                }
            }
            if (M?.ignoreAttr) {
                bi.node = t;
                bi.attr = k;
                bi.bindable = null;
                bi.def = null;
                (C ??= []).push(M.build(bi, s.ep, s.m));
                d();
                continue;
            }
            if (l) {
                _ = this.Mi.get(r);
                T = _.attrs[F];
                if (T !== void 0) {
                    if (M === null) {
                        L = f.parse(O, v);
                        (A ??= []).push(L == null ? new SetPropertyInstruction(O, T.name) : new InterpolationInstruction(L, T.name));
                    } else {
                        bi.node = t;
                        bi.attr = k;
                        bi.bindable = T;
                        bi.def = r;
                        (A ??= []).push(M.build(bi, s.ep, s.m));
                    }
                    d();
                    continue;
                }
            }
            B = s.Ni(F);
            if (B !== null) {
                _ = this.Mi.get(B);
                S = B.noMultiBindings === false && M === null && hasInlineBindings(O);
                if (S) {
                    R = this.$i(t, O, B, s);
                } else {
                    q = _.primary;
                    if (M === null) {
                        L = f.parse(O, v);
                        R = L === null ? O === "" ? [] : [ new SetPropertyInstruction(O, q.name) ] : [ new InterpolationInstruction(L, q.name) ];
                    } else {
                        bi.node = t;
                        bi.attr = k;
                        bi.bindable = q;
                        bi.def = B;
                        R = [ M.build(bi, s.ep, s.m) ];
                    }
                }
                d();
                if (B.isTemplateController) {
                    (I ??= []).push(new HydrateTemplateController(wi, this.resolveResources ? B : B.name, void 0, R));
                } else {
                    (E ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? B : B.name, B.aliases != null && B.aliases.includes(F) ? F : void 0, R));
                }
                continue;
            }
            if (M === null) {
                L = f.parse(O, v);
                if (L != null) {
                    d();
                    (C ??= []).push(new InterpolationInstruction(L, s.m.map(t, F) ?? e.camelCase(F)));
                }
                continue;
            }
            bi.node = t;
            bi.attr = k;
            bi.bindable = null;
            bi.def = null;
            (C ??= []).push(M.build(bi, s.ep, s.m));
            d();
        }
        resetCommandBuildInfo();
        if (this.Gi(t, C) && C != null && C.length > 1) {
            this.Ki(t, C);
        }
        if (l) {
            D = new HydrateElementInstruction(this.resolveResources ? r : r.name, A ?? e.emptyArray, null, V, u, j);
        }
        if (C != null || D != null || E != null) {
            m = e.emptyArray.concat(D ?? e.emptyArray, E ?? e.emptyArray, C ?? e.emptyArray);
            $ = true;
        }
        let W;
        if (I != null) {
            g = I.length - 1;
            x = g;
            P = I[x];
            let e;
            if (isMarker(t)) {
                e = s.t();
                appendManyToTemplate(e, [ s.ct(), s.Xi(gi), s.Xi(xi) ]);
            } else {
                this.Qi(t, s);
                if (t.nodeName === "TEMPLATE") {
                    e = t;
                } else {
                    e = s.t();
                    appendToTemplate(e, t);
                }
            }
            const i = e;
            const h = s.Yi(m == null ? [] : [ m ]);
            let c;
            let u;
            let f = false;
            let d;
            let p;
            let v;
            let w;
            let b;
            let y;
            let k = 0, C = 0;
            let A = t.firstChild;
            let B = false;
            if (H !== false) {
                while (A !== null) {
                    u = isElement(A) ? A.getAttribute(qt) : null;
                    f = u !== null || l && !a;
                    c = A.nextSibling;
                    if (f) {
                        if (!l) {
                            throw createMappedError(706, u, n);
                        }
                        A.removeAttribute?.(qt);
                        B = isTextNode(A) && A.textContent.trim() === "";
                        if (!B) {
                            ((p ??= {})[u || _t] ??= []).push(A);
                        }
                        t.removeChild(A);
                    }
                    A = c;
                }
            }
            if (p != null) {
                d = {};
                for (u in p) {
                    e = s.t();
                    v = p[u];
                    for (k = 0, C = v.length; C > k; ++k) {
                        w = v[k];
                        if (w.nodeName === "TEMPLATE") {
                            if (w.attributes.length > 0) {
                                appendToTemplate(e, w);
                            } else {
                                appendToTemplate(e, w.content);
                            }
                        } else {
                            appendToTemplate(e, w);
                        }
                    }
                    y = s.Yi();
                    this.Fi(e.content, y);
                    d[u] = CustomElementDefinition.create({
                        name: Es(),
                        template: e,
                        instructions: y.rows,
                        needsCompile: false
                    });
                }
                D.projections = d;
            }
            if ($) {
                if (l && (V || r.containerless)) {
                    this.Qi(t, s);
                } else {
                    this.zi(t, s);
                }
            }
            W = !l || !r.containerless && !V && H !== false;
            if (W) {
                if (t.nodeName === mi) {
                    this.Fi(t.content, h);
                } else {
                    A = t.firstChild;
                    while (A !== null) {
                        A = this.Fi(A, h);
                    }
                }
            }
            P.def = CustomElementDefinition.create({
                name: Es(),
                template: i,
                instructions: h.rows,
                needsCompile: false
            });
            while (x-- > 0) {
                P = I[x];
                e = s.t();
                b = s.ct();
                appendManyToTemplate(e, [ b, s.Xi(gi), s.Xi(xi) ]);
                P.def = CustomElementDefinition.create({
                    name: Es(),
                    template: e,
                    needsCompile: false,
                    instructions: [ [ I[x + 1] ] ]
                });
            }
            s.rows.push([ P ]);
        } else {
            if (m != null) {
                s.rows.push(m);
            }
            let e = t.firstChild;
            let i;
            let h;
            let c = false;
            let u = null;
            let f;
            let d;
            let p;
            let g;
            let x;
            let v = false;
            let w = 0, b = 0;
            if (H !== false) {
                while (e !== null) {
                    h = isElement(e) ? e.getAttribute(qt) : null;
                    c = h !== null || l && !a;
                    i = e.nextSibling;
                    if (c) {
                        if (!l) {
                            throw createMappedError(706, h, n);
                        }
                        e.removeAttribute?.(qt);
                        v = isTextNode(e) && e.textContent.trim() === "";
                        if (!v) {
                            ((f ??= {})[h || _t] ??= []).push(e);
                        }
                        t.removeChild(e);
                    }
                    e = i;
                }
            }
            if (f != null) {
                u = {};
                for (h in f) {
                    g = s.t();
                    d = f[h];
                    for (w = 0, b = d.length; b > w; ++w) {
                        p = d[w];
                        if (p.nodeName === mi) {
                            if (p.attributes.length > 0) {
                                appendToTemplate(g, p);
                            } else {
                                appendToTemplate(g, p.content);
                            }
                        } else {
                            appendToTemplate(g, p);
                        }
                    }
                    x = s.Yi();
                    this.Fi(g.content, x);
                    u[h] = CustomElementDefinition.create({
                        name: Es(),
                        template: g,
                        instructions: x.rows,
                        needsCompile: false
                    });
                }
                D.projections = u;
            }
            if ($) {
                if (l && (V || r.containerless)) {
                    this.Qi(t, s);
                } else {
                    this.zi(t, s);
                }
            }
            W = !l || !r.containerless && !V && H !== false;
            if (W && t.childNodes.length > 0) {
                e = t.firstChild;
                while (e !== null) {
                    e = this.Fi(e, s);
                }
            }
        }
        return i;
    }
    Ui(t, e) {
        const s = t.parentNode;
        const i = e.ep.parse(t.textContent, v);
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
        const n = this.Mi.get(s);
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
                p = i.Vi(d);
                m = n.attrs[d.target];
                if (m == null) {
                    throw createMappedError(707, d.target, s.name);
                }
                if (p === null) {
                    f = i.ep.parse(h, v);
                    l.push(f === null ? new SetPropertyInstruction(h, m.name) : new InterpolationInstruction(f, m.name));
                } else {
                    bi.node = t;
                    bi.attr = d;
                    bi.bindable = m;
                    bi.def = s;
                    l.push(p.build(bi, i.ep, i.m));
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
    qi(t, s) {
        const i = s.root.def.name;
        const n = t;
        const r = e.toArray(n.querySelectorAll("template[as-custom-element]"));
        const l = r.length;
        if (l === 0) {
            return;
        }
        if (l === n.childElementCount) {
            throw createMappedError(708, i);
        }
        const a = new Set;
        for (const t of r) {
            if (t.parentNode !== n) {
                throw createMappedError(709, i);
            }
            const r = processTemplateName(i, t, a);
            const l = t.content;
            const h = e.toArray(l.querySelectorAll("bindable"));
            const c = new Set;
            const u = new Set;
            const f = h.reduce(((t, s) => {
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
                const a = e.toArray(s.attributes).filter((t => !Bi.includes(t.name)));
                if (a.length > 0) ;
                s.remove();
                t[i] = {
                    attribute: n ?? void 0,
                    mode: getBindingMode(s)
                };
                return t;
            }), {});
            class LocalTemplateType {}
            x(LocalTemplateType, "name", {
                value: r
            });
            s.Ji(defineElement({
                name: r,
                template: t,
                bindables: f
            }, LocalTemplateType));
            n.removeChild(t);
        }
    }
    Gi(t, e) {
        const s = t.nodeName;
        return s === "INPUT" && ki[t.type] === 1 || s === "SELECT" && (t.hasAttribute("multiple") || e?.some((t => t.type === zt && t.to === "multiple")));
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
        insertManyBefore(s, t, [ i, e.Xi(gi), e.Xi(xi) ]);
        s.removeChild(t);
        return i;
    }
}

const mi = "TEMPLATE";

const gi = "au-start";

const xi = "au-end";

const isMarker = t => t.nodeValue === "au*";

class CompilationContext {
    constructor(s, i, n, r, l, a) {
        this.hasSlot = false;
        const h = r !== null;
        this.c = i;
        this.root = l === null ? this : l;
        this.def = s;
        this.ci = n;
        this.parent = r;
        this.tn = h ? r.tn : i.get(Ai);
        this._i = h ? r._i : i.get(di);
        this.He = h ? r.He : i.get(qs);
        this.ep = h ? r.ep : i.get(t.IExpressionParser);
        this.m = h ? r.m : i.get(Xs);
        this.Gs = h ? r.Gs : i.get(e.ILogger);
        this.p = h ? r.p : i.get(ht);
        this.localEls = h ? r.localEls : new Set;
        this.rows = a ?? [];
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
    bi.node = bi.attr = bi.bindable = bi.def = null;
};

const vi = {
    projections: null
};

const wi = {
    name: "unnamed"
};

const bi = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const yi = f(createLookup(), {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
});

const ki = {
    checkbox: 1,
    radio: 1
};

const Ci = /*@__PURE__*/ U("IBindablesInfoResolver", (t => {
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
                        mode: t.defaultBindingMode != null ? t.defaultBindingMode : _
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

const Ai = /*@__PURE__*/ U("IResourceResolver", (t => t.singleton(ResourceResolver)));

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
        return e in s.element ? s.element[e] : s.element[e] = Is.find(t, e);
    }
    attr(t, e) {
        let s = this.en.get(t);
        if (s == null) {
            this.en.set(t, s = new RecordCache);
        }
        return e in s.attr ? s.attr[e] : s.attr[e] = dt.find(t, e);
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
            const r = e in n.command ? n.command[e] : n.command[e] = Gs.find(t, e);
            if (r == null) {
                throw createMappedError(713, e);
            }
            s[e] = i = Gs.get(t, e);
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

const Bi = u([ "name", "attribute", "mode" ]);

const Si = "as-custom-element";

const processTemplateName = (t, e, s) => {
    const i = e.getAttribute(Si);
    if (i === null || i === "") {
        throw createMappedError(715, t);
    }
    if (s.has(i)) {
        throw createMappedError(716, i, t);
    } else {
        s.add(i);
        e.removeAttribute(Si);
    }
    return i;
};

const getBindingMode = t => {
    switch (t.getAttribute("mode")) {
      case "oneTime":
        return P;

      case "toView":
        return L;

      case "fromView":
        return D;

      case "twoWay":
        return M;

      case "default":
      default:
        return _;
    }
};

const Ti = /*@__PURE__*/ U("ITemplateCompilerHooks");

const Ei = u({
    name: /*@__PURE__*/ e.getResourceKeyFor("compiler-hooks"),
    define(t) {
        return e.Registrable.define(t, (function(t) {
            z(Ti, this).register(t);
        }));
    },
    findAll(t) {
        return t.get(e.allResources(Ti));
    }
});

const templateCompilerHooks = (t, e) => {
    return t === void 0 ? decorator : decorator(t);
    function decorator(t) {
        return Ei.define(t);
    }
};

class Show {
    constructor() {
        this.el = e.resolve(gs);
        this.p = e.resolve(ht);
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
        const t = e.resolve(le);
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
    type: ut,
    name: "show",
    bindables: [ "value" ],
    aliases: [ "hide" ]
};

const Ri = [ TemplateCompiler, s.DirtyChecker, NodeObserverLocator ];

const Ii = [ Vs, Hs, Ws, Ns, Pt ];

const Pi = [ js, $s ];

const Li = [ DefaultBindingCommand, OneTimeBindingCommand, FromViewBindingCommand, ToViewBindingCommand, TwoWayBindingCommand, ForBindingCommand, RefBindingCommand, TriggerBindingCommand, CaptureBindingCommand, ClassBindingCommand, StyleBindingCommand, AttrBindingCommand, SpreadBindingCommand ];

const Di = [ DebounceBindingBehavior, OneTimeBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, SignalBindingBehavior, ThrottleBindingBehavior, TwoWayBindingBehavior, SanitizeValueConverter, If, Else, Repeat, With, Switch, Case, DefaultCase, PromiseTemplateController, PendingTemplateController, FulfilledTemplateController, RejectedTemplateController, PromiseAttributePattern, FulfilledAttributePattern, RejectedAttributePattern, AttrBindingBehavior, SelfBindingBehavior, UpdateTriggerBindingBehavior, AuCompose, Portal, Focus, Show, AuSlot ];

const Mi = [ xe, ve, me, ge, ce, ue, fe, de, pe, ye, Se, ke, Ce, Ae, Be, we, Te ];

const _i = /*@__PURE__*/ createConfiguration(e.noop);

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
            return e.register(K(s.ICoercionConfiguration, i.coercingOptions), ...Ri, ...Di, ...Ii, ...Li, ...Mi);
        },
        customize(e) {
            return createConfiguration(e ?? t);
        }
    };
}

function children(t, e) {
    if (!Oi) {
        Oi = true;
        s.subscriberCollection(ChildrenBinding, null);
        lifecycleHooks()(ChildrenLifecycleHooks, null);
    }
    let i;
    const n = N("dependencies");
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
    constructor(t, e, s, i = defaultChildQuery, n = defaultChildFilter, r = defaultChildMap, l = qi) {
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
        this.ln = e.emptyArray;
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

const qi = {
    childList: true
};

const defaultChildQuery = t => t.host.childNodes;

const defaultChildFilter = (t, e, s) => !!s;

const defaultChildMap = (t, e, s) => s;

const Fi = {
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
        h = findElementControllerFor(a, Fi);
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
        K(pt, this).register(t);
    }
    hydrating(t, e) {
        const s = this.Y;
        const i = new ChildrenBinding(e, t, t[s.callback ?? `${a(s.name)}Changed`], s.query ?? defaultChildQuery, s.filter ?? defaultChildFilter, s.map ?? defaultChildMap, s.options ?? qi);
        x(t, s.name, {
            enumerable: true,
            configurable: true,
            get: f((() => i.getValue()), {
                getObserver: () => i
            }),
            set: () => {}
        });
        e.addBinding(i);
    }
}

let Oi = false;

exports.AdoptedStyleSheetsStyles = AdoptedStyleSheetsStyles;

exports.AppRoot = AppRoot;

exports.AppTask = at;

exports.AtPrefixedTriggerAttributePattern = js;

exports.AttrBindingBehavior = AttrBindingBehavior;

exports.AttrBindingCommand = AttrBindingCommand;

exports.AttrSyntax = AttrSyntax;

exports.AttributeBinding = AttributeBinding;

exports.AttributeBindingInstruction = AttributeBindingInstruction;

exports.AttributeBindingRenderer = Se;

exports.AttributeNSAccessor = AttributeNSAccessor;

exports.AttributePattern = Os;

exports.AuCompose = AuCompose;

exports.AuSlot = AuSlot;

exports.AuSlotsInfo = AuSlotsInfo;

exports.Aurelia = Aurelia;

exports.Bindable = j;

exports.BindableDefinition = BindableDefinition;

exports.BindingBehavior = tt;

exports.BindingBehaviorDefinition = BindingBehaviorDefinition;

exports.BindingCommand = Gs;

exports.BindingCommandDefinition = BindingCommandDefinition;

exports.BindingContext = BindingContext;

exports.BindingMode = q;

exports.BindingModeBehavior = BindingModeBehavior;

exports.BindingTargetSubscriber = BindingTargetSubscriber;

exports.CSSModulesProcessorRegistry = CSSModulesProcessorRegistry;

exports.CaptureBindingCommand = CaptureBindingCommand;

exports.Case = Case;

exports.CheckedObserver = CheckedObserver;

exports.ChildrenBinding = ChildrenBinding;

exports.ClassAttributeAccessor = ClassAttributeAccessor;

exports.ClassBindingCommand = ClassBindingCommand;

exports.ColonPrefixedBindAttributePattern = $s;

exports.ComputedWatcher = ComputedWatcher;

exports.ContentBinding = ContentBinding;

exports.Controller = Controller;

exports.CustomAttribute = dt;

exports.CustomAttributeDefinition = CustomAttributeDefinition;

exports.CustomAttributeRenderer = fe;

exports.CustomElement = Is;

exports.CustomElementDefinition = CustomElementDefinition;

exports.CustomElementRenderer = ue;

exports.DataAttributeAccessor = DataAttributeAccessor;

exports.DebounceBindingBehavior = DebounceBindingBehavior;

exports.DefaultBindingCommand = DefaultBindingCommand;

exports.DefaultBindingLanguage = Li;

exports.DefaultBindingSyntax = Ii;

exports.DefaultCase = DefaultCase;

exports.DefaultComponents = Ri;

exports.DefaultRenderers = Mi;

exports.DefaultResources = Di;

exports.DotSeparatedAttributePattern = Hs;

exports.Else = Else;

exports.EventModifier = EventModifier;

exports.EventModifierRegistration = Pt;

exports.ExpressionWatcher = ExpressionWatcher;

exports.FlushQueue = FlushQueue;

exports.Focus = Focus;

exports.ForBindingCommand = ForBindingCommand;

exports.FragmentNodeSequence = FragmentNodeSequence;

exports.FromViewBindingBehavior = FromViewBindingBehavior;

exports.FromViewBindingCommand = FromViewBindingCommand;

exports.FulfilledTemplateController = FulfilledTemplateController;

exports.HydrateAttributeInstruction = HydrateAttributeInstruction;

exports.HydrateElementInstruction = HydrateElementInstruction;

exports.HydrateLetElementInstruction = HydrateLetElementInstruction;

exports.HydrateTemplateController = HydrateTemplateController;

exports.IAppRoot = Ls;

exports.IAppTask = lt;

exports.IAttrMapper = Xs;

exports.IAttributeParser = qs;

exports.IAttributePattern = _s;

exports.IAuSlotWatcher = Ot;

exports.IAuSlotsInfo = Ft;

exports.IAurelia = Ds;

exports.IBindablesInfoResolver = Ci;

exports.IController = us;

exports.IEventModifier = It;

exports.IEventTarget = xs;

exports.IFlushQueue = yt;

exports.IHistory = Cs;

exports.IHydrationContext = fs;

exports.IInstruction = le;

exports.IKeyMapping = Rt;

exports.ILifecycleHooks = pt;

exports.IListenerBindingOptions = be;

exports.ILocation = ks;

exports.IModifiedEventHandlerCreator = Et;

exports.INode = gs;

exports.IPlatform = ht;

exports.IRenderLocation = vs;

exports.IRenderer = he;

exports.IRendering = _e;

exports.ISVGAnalyzer = Ks;

exports.ISanitizer = fi;

exports.IShadowDOMGlobalStyles = Oe;

exports.IShadowDOMStyleFactory = qe;

exports.IShadowDOMStyles = Fe;

exports.ISignaler = nt;

exports.ISyntaxInterpreter = Ms;

exports.ITemplateCompiler = ae;

exports.ITemplateCompilerHooks = Ti;

exports.ITemplateElementFactory = di;

exports.IViewFactory = Lt;

exports.IWindow = ys;

exports.If = If;

exports.InstructionType = oe;

exports.InterpolationBinding = InterpolationBinding;

exports.InterpolationBindingRenderer = ge;

exports.InterpolationInstruction = InterpolationInstruction;

exports.InterpolationPartBinding = InterpolationPartBinding;

exports.Interpretation = Interpretation;

exports.IteratorBindingInstruction = IteratorBindingInstruction;

exports.IteratorBindingRenderer = ve;

exports.LetBinding = LetBinding;

exports.LetBindingInstruction = LetBindingInstruction;

exports.LetElementRenderer = pe;

exports.LifecycleHooks = mt;

exports.LifecycleHooksDefinition = LifecycleHooksDefinition;

exports.LifecycleHooksEntry = LifecycleHooksEntry;

exports.ListenerBinding = ListenerBinding;

exports.ListenerBindingInstruction = ListenerBindingInstruction;

exports.ListenerBindingOptions = ListenerBindingOptions;

exports.ListenerBindingRenderer = ye;

exports.MultiAttrInstruction = MultiAttrInstruction;

exports.NodeObserverLocator = NodeObserverLocator;

exports.NoopSVGAnalyzer = NoopSVGAnalyzer;

exports.OneTimeBindingBehavior = OneTimeBindingBehavior;

exports.OneTimeBindingCommand = OneTimeBindingCommand;

exports.PendingTemplateController = PendingTemplateController;

exports.Portal = Portal;

exports.PromiseTemplateController = PromiseTemplateController;

exports.PropertyBinding = PropertyBinding;

exports.PropertyBindingInstruction = PropertyBindingInstruction;

exports.PropertyBindingRenderer = xe;

exports.RefAttributePattern = Vs;

exports.RefBinding = RefBinding;

exports.RefBindingInstruction = RefBindingInstruction;

exports.RefBindingRenderer = me;

exports.RejectedTemplateController = RejectedTemplateController;

exports.Rendering = Rendering;

exports.Repeat = Repeat;

exports.SVGAnalyzer = SVGAnalyzer;

exports.SanitizeValueConverter = SanitizeValueConverter;

exports.Scope = Scope;

exports.SelectValueObserver = SelectValueObserver;

exports.SelfBindingBehavior = SelfBindingBehavior;

exports.SetAttributeInstruction = SetAttributeInstruction;

exports.SetAttributeRenderer = ke;

exports.SetClassAttributeInstruction = SetClassAttributeInstruction;

exports.SetClassAttributeRenderer = Ce;

exports.SetPropertyInstruction = SetPropertyInstruction;

exports.SetPropertyRenderer = ce;

exports.SetStyleAttributeInstruction = SetStyleAttributeInstruction;

exports.SetStyleAttributeRenderer = Ae;

exports.ShadowDOMRegistry = ShadowDOMRegistry;

exports.ShortHandBindingSyntax = Pi;

exports.SignalBindingBehavior = SignalBindingBehavior;

exports.SpreadBindingInstruction = SpreadBindingInstruction;

exports.SpreadElementPropBindingInstruction = SpreadElementPropBindingInstruction;

exports.SpreadRenderer = Te;

exports.StandardConfiguration = _i;

exports.State = cs;

exports.StyleAttributeAccessor = StyleAttributeAccessor;

exports.StyleBindingCommand = StyleBindingCommand;

exports.StyleConfiguration = He;

exports.StyleElementStyles = StyleElementStyles;

exports.StylePropertyBindingInstruction = StylePropertyBindingInstruction;

exports.StylePropertyBindingRenderer = Be;

exports.Switch = Switch;

exports.TemplateCompiler = TemplateCompiler;

exports.TemplateCompilerHooks = Ei;

exports.TemplateControllerRenderer = de;

exports.TextBindingInstruction = TextBindingInstruction;

exports.TextBindingRenderer = we;

exports.ThrottleBindingBehavior = ThrottleBindingBehavior;

exports.ToViewBindingBehavior = ToViewBindingBehavior;

exports.ToViewBindingCommand = ToViewBindingCommand;

exports.TriggerBindingCommand = TriggerBindingCommand;

exports.TwoWayBindingBehavior = TwoWayBindingBehavior;

exports.TwoWayBindingCommand = TwoWayBindingCommand;

exports.UpdateTriggerBindingBehavior = UpdateTriggerBindingBehavior;

exports.ValueAttributeObserver = ValueAttributeObserver;

exports.ValueConverter = vt;

exports.ValueConverterDefinition = ValueConverterDefinition;

exports.ViewFactory = ViewFactory;

exports.Watch = ct;

exports.With = With;

exports.alias = alias;

exports.astAssign = T;

exports.astBind = R;

exports.astEvaluate = E;

exports.astUnbind = I;

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

exports.mixinAstEvaluator = bt;

exports.mixinUseScope = wt;

exports.mixingBindingLimited = kt;

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
