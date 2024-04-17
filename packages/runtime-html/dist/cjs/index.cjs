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

const b = "IsIterator";

const w = "IsFunction";

const y = "IsProperty";

const C = "pending";

const k = "running";

const A = s.AccessorType.Observer;

const B = s.AccessorType.Node;

const S = s.AccessorType.Layout;

const createMappedError = (t, ...e) => new Error(`AUR${a(t).padStart(4, "0")}:${e.map(a)}`);

const {astAssign: R, astEvaluate: T, astBind: E, astUnbind: I} = (() => {
    const i = "AccessThis";
    const n = "AccessBoundary";
    const r = "AccessGlobal";
    const l = "AccessScope";
    const h = "ArrayLiteral";
    const c = "ObjectLiteral";
    const u = "PrimitiveLiteral";
    const f = "Template";
    const d = "Unary";
    const p = "CallScope";
    const m = "CallMember";
    const g = "CallFunction";
    const x = "CallGlobal";
    const v = "AccessMember";
    const b = "AccessKeyed";
    const w = "TaggedTemplate";
    const y = "Binary";
    const C = "Conditional";
    const k = "Assign";
    const A = "ArrowFunction";
    const B = "ValueConverter";
    const S = "BindingBehavior";
    const R = "ArrayBindingPattern";
    const T = "ObjectBindingPattern";
    const E = "BindingIdentifier";
    const I = "ForOfStatement";
    const P = "Interpolation";
    const L = "ArrayDestructuring";
    const D = "ObjectDestructuring";
    const M = "DestructuringAssignmentLeaf";
    const _ = "Custom";
    const q = s.Scope.getContext;
    function astEvaluate(t, e, H, O) {
        switch (t.$kind) {
          case i:
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

          case n:
            {
                let t = e;
                while (t != null && !t.isBoundary) {
                    t = t.parent;
                }
                return t ? t.bindingContext : void 0;
            }

          case l:
            {
                const s = q(e, t.name, t.ancestor);
                if (O !== null) {
                    O.observe(s, t.name);
                }
                const i = s[t.name];
                if (i == null && t.name === "$host") {
                    throw createMappedError(105);
                }
                if (H?.strict) {
                    return H?.boundFn && isFunction(i) ? i.bind(s) : i;
                }
                return i == null ? "" : H?.boundFn && isFunction(i) ? i.bind(s) : i;
            }

          case r:
            return globalThis[t.name];

          case x:
            {
                const s = globalThis[t.name];
                if (isFunction(s)) {
                    return s(...t.args.map((t => astEvaluate(t, e, H, O))));
                }
                if (!H?.strictFnCall && s == null) {
                    return void 0;
                }
                throw createMappedError(107);
            }

          case h:
            return t.elements.map((t => astEvaluate(t, e, H, O)));

          case c:
            {
                const s = {};
                for (let i = 0; i < t.keys.length; ++i) {
                    s[t.keys[i]] = astEvaluate(t.values[i], e, H, O);
                }
                return s;
            }

          case u:
            return t.value;

          case f:
            {
                let s = t.cooked[0];
                for (let i = 0; i < t.expressions.length; ++i) {
                    s += String(astEvaluate(t.expressions[i], e, H, O));
                    s += t.cooked[i + 1];
                }
                return s;
            }

          case d:
            switch (t.operation) {
              case "void":
                return void astEvaluate(t.expression, e, H, O);

              case "typeof":
                return typeof astEvaluate(t.expression, e, H, O);

              case "!":
                return !astEvaluate(t.expression, e, H, O);

              case "-":
                return -astEvaluate(t.expression, e, H, O);

              case "+":
                return +astEvaluate(t.expression, e, H, O);

              default:
                throw createMappedError(109, t.operation);
            }

          case p:
            {
                const s = t.args.map((t => astEvaluate(t, e, H, O)));
                const i = q(e, t.name, t.ancestor);
                const n = getFunction(H?.strictFnCall, i, t.name);
                if (n) {
                    return n.apply(i, s);
                }
                return void 0;
            }

          case m:
            {
                const s = astEvaluate(t.object, e, H, O);
                const i = t.args.map((t => astEvaluate(t, e, H, O)));
                const n = getFunction(H?.strictFnCall, s, t.name);
                let r;
                if (n) {
                    r = n.apply(s, i);
                    if (isArray(s) && F.includes(t.name)) {
                        O?.observeCollection(s);
                    }
                }
                return r;
            }

          case g:
            {
                const s = astEvaluate(t.func, e, H, O);
                if (isFunction(s)) {
                    return s(...t.args.map((t => astEvaluate(t, e, H, O))));
                }
                if (!H?.strictFnCall && s == null) {
                    return void 0;
                }
                throw createMappedError(107);
            }

          case A:
            {
                const func = (...i) => {
                    const n = t.args;
                    const r = t.rest;
                    const l = n.length - 1;
                    const a = n.reduce(((t, e, s) => {
                        if (r && s === l) {
                            t[e.name] = i.slice(s);
                        } else {
                            t[e.name] = i[s];
                        }
                        return t;
                    }), {});
                    const h = s.Scope.fromParent(e, a);
                    return astEvaluate(t.body, h, H, O);
                };
                return func;
            }

          case v:
            {
                const s = astEvaluate(t.object, e, H, O);
                let i;
                if (H?.strict) {
                    if (s == null) {
                        return undefined;
                    }
                    if (O !== null && !t.accessGlobal) {
                        O.observe(s, t.name);
                    }
                    i = s[t.name];
                    if (H?.boundFn && isFunction(i)) {
                        return i.bind(s);
                    }
                    return i;
                }
                if (O !== null && isObject(s) && !t.accessGlobal) {
                    O.observe(s, t.name);
                }
                if (s) {
                    i = s[t.name];
                    if (H?.boundFn && isFunction(i)) {
                        return i.bind(s);
                    }
                    return i;
                }
                return "";
            }

          case b:
            {
                const s = astEvaluate(t.object, e, H, O);
                const i = astEvaluate(t.key, e, H, O);
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
                const s = t.expressions.map((t => astEvaluate(t, e, H, O)));
                const i = astEvaluate(t.func, e, H, O);
                if (!isFunction(i)) {
                    throw createMappedError(110);
                }
                return i(t.cooked, ...s);
            }

          case y:
            {
                const s = t.left;
                const i = t.right;
                switch (t.operation) {
                  case "&&":
                    return astEvaluate(s, e, H, O) && astEvaluate(i, e, H, O);

                  case "||":
                    return astEvaluate(s, e, H, O) || astEvaluate(i, e, H, O);

                  case "??":
                    return astEvaluate(s, e, H, O) ?? astEvaluate(i, e, H, O);

                  case "==":
                    return astEvaluate(s, e, H, O) == astEvaluate(i, e, H, O);

                  case "===":
                    return astEvaluate(s, e, H, O) === astEvaluate(i, e, H, O);

                  case "!=":
                    return astEvaluate(s, e, H, O) != astEvaluate(i, e, H, O);

                  case "!==":
                    return astEvaluate(s, e, H, O) !== astEvaluate(i, e, H, O);

                  case "instanceof":
                    {
                        const t = astEvaluate(i, e, H, O);
                        if (isFunction(t)) {
                            return astEvaluate(s, e, H, O) instanceof t;
                        }
                        return false;
                    }

                  case "in":
                    {
                        const t = astEvaluate(i, e, H, O);
                        if (isObject(t)) {
                            return astEvaluate(s, e, H, O) in t;
                        }
                        return false;
                    }

                  case "+":
                    {
                        const t = astEvaluate(s, e, H, O);
                        const n = astEvaluate(i, e, H, O);
                        if (H?.strict) {
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
                    return astEvaluate(s, e, H, O) - astEvaluate(i, e, H, O);

                  case "*":
                    return astEvaluate(s, e, H, O) * astEvaluate(i, e, H, O);

                  case "/":
                    return astEvaluate(s, e, H, O) / astEvaluate(i, e, H, O);

                  case "%":
                    return astEvaluate(s, e, H, O) % astEvaluate(i, e, H, O);

                  case "<":
                    return astEvaluate(s, e, H, O) < astEvaluate(i, e, H, O);

                  case ">":
                    return astEvaluate(s, e, H, O) > astEvaluate(i, e, H, O);

                  case "<=":
                    return astEvaluate(s, e, H, O) <= astEvaluate(i, e, H, O);

                  case ">=":
                    return astEvaluate(s, e, H, O) >= astEvaluate(i, e, H, O);

                  default:
                    throw createMappedError(108, t.operation);
                }
            }

          case C:
            return astEvaluate(t.condition, e, H, O) ? astEvaluate(t.yes, e, H, O) : astEvaluate(t.no, e, H, O);

          case k:
            return astAssign(t.target, e, H, astEvaluate(t.value, e, H, O));

          case B:
            {
                const s = H?.getConverter?.(t.name);
                if (s == null) {
                    throw createMappedError(103, t.name);
                }
                if ("toView" in s) {
                    return s.toView(astEvaluate(t.expression, e, H, O), ...t.args.map((t => astEvaluate(t, e, H, O))));
                }
                return astEvaluate(t.expression, e, H, O);
            }

          case S:
            return astEvaluate(t.expression, e, H, O);

          case E:
            return t.name;

          case I:
            return astEvaluate(t.iterable, e, H, O);

          case P:
            if (t.isMulti) {
                let s = t.parts[0];
                let i = 0;
                for (;i < t.expressions.length; ++i) {
                    s += a(astEvaluate(t.expressions[i], e, H, O));
                    s += t.parts[i + 1];
                }
                return s;
            } else {
                return `${t.parts[0]}${astEvaluate(t.firstExpression, e, H, O)}${t.parts[1]}`;
            }

          case M:
            return astEvaluate(t.target, e, H, O);

          case L:
            {
                return t.list.map((t => astEvaluate(t, e, H, O)));
            }

          case R:
          case T:
          case D:
          default:
            return void 0;

          case _:
            return t.evaluate(e, H, O);
        }
    }
    function astAssign(i, n, r, a) {
        switch (i.$kind) {
          case l:
            {
                if (i.name === "$host") {
                    throw createMappedError(106);
                }
                const t = q(n, i.name, i.ancestor);
                return t[i.name] = a;
            }

          case v:
            {
                const t = astEvaluate(i.object, n, r, null);
                if (isObject(t)) {
                    if (i.name === "length" && isArray(t) && !isNaN(a)) {
                        t.splice(a);
                    } else {
                        t[i.name] = a;
                    }
                } else {
                    astAssign(i.object, n, r, {
                        [i.name]: a
                    });
                }
                return a;
            }

          case b:
            {
                const t = astEvaluate(i.object, n, r, null);
                const s = astEvaluate(i.key, n, r, null);
                if (isArray(t)) {
                    if (s === "length" && !isNaN(a)) {
                        t.splice(a);
                        return a;
                    }
                    if (e.isArrayIndex(s)) {
                        t.splice(s, 1, a);
                        return a;
                    }
                }
                return t[s] = a;
            }

          case k:
            astAssign(i.value, n, r, a);
            return astAssign(i.target, n, r, a);

          case B:
            {
                const t = r?.getConverter?.(i.name);
                if (t == null) {
                    throw createMappedError(103, i.name);
                }
                if ("fromView" in t) {
                    a = t.fromView(a, ...i.args.map((t => astEvaluate(t, n, r, null))));
                }
                return astAssign(i.expression, n, r, a);
            }

          case S:
            return astAssign(i.expression, n, r, a);

          case L:
          case D:
            {
                const t = i.list;
                const e = t.length;
                let l;
                let h;
                for (l = 0; l < e; l++) {
                    h = t[l];
                    switch (h.$kind) {
                      case M:
                        astAssign(h, n, r, a);
                        break;

                      case L:
                      case D:
                        {
                            if (typeof a !== "object" || a === null) {
                                throw createMappedError(112);
                            }
                            let t = astEvaluate(h.source, s.Scope.create(a), r, null);
                            if (t === void 0 && h.initializer) {
                                t = astEvaluate(h.initializer, n, r, null);
                            }
                            astAssign(h, n, r, t);
                            break;
                        }
                    }
                }
                break;
            }

          case M:
            {
                if (i instanceof t.DestructuringAssignmentSingleExpression) {
                    if (a == null) {
                        return;
                    }
                    if (typeof a !== "object") {
                        throw createMappedError(112);
                    }
                    let t = astEvaluate(i.source, s.Scope.create(a), r, null);
                    if (t === void 0 && i.initializer) {
                        t = astEvaluate(i.initializer, n, r, null);
                    }
                    astAssign(i.target, n, r, t);
                } else {
                    if (a == null) {
                        return;
                    }
                    if (typeof a !== "object") {
                        throw createMappedError(112);
                    }
                    const t = i.indexOrProperties;
                    let s;
                    if (e.isArrayIndex(t)) {
                        if (!Array.isArray(a)) {
                            throw createMappedError(112);
                        }
                        s = a.slice(t);
                    } else {
                        s = Object.entries(a).reduce(((e, [s, i]) => {
                            if (!t.includes(s)) {
                                e[s] = i;
                            }
                            return e;
                        }), {});
                    }
                    astAssign(i.target, n, r, s);
                }
                break;
            }

          case _:
            return i.assign(n, r, a);

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

          case I:
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

          case I:
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
    const F = "at map filter includes indexOf lastIndexOf findIndex find flat flatMap join reduce reduceRight slice every some sort".split(" ");
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

const H = i.Metadata.has;

const O = i.Metadata.define;

const {annotation: V} = e.Protocol;

const $ = V.keyFor;

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

const j = u({
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
            const t = F(N, r);
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
    key: /*@__PURE__*/ $("coercer"),
    define(t, e) {
        O(t[e].bind(t), t, W.key);
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
            const e = $("aliases");
            const s = F(e, this);
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

const X = "element";

const Q = "attribute";

const Y = "__au_static_resource__";

const getDefinitionFromStaticAu = (t, e, s) => {
    let i = F(Y, t);
    if (i == null) {
        if (t.$au?.type === e) {
            i = s(t.$au, t);
            O(i, t, Y);
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

const getBehaviorAnnotation = (t, e) => F($(e), t);

const getBindingBehaviorKeyFrom = t => `${J}:${t}`;

const tt = u({
    name: J,
    keyFrom: getBindingBehaviorKeyFrom,
    isType(t) {
        return isFunction(t) && (H(J, t) || t.$au?.type === Z);
    },
    define(t, s) {
        const i = BindingBehaviorDefinition.create(t, s);
        const n = i.Type;
        O(i, n, J, e.resourceBaseName);
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

const getAttributeAnnotation = (t, e) => F($(e), t);

const isAttributeType = t => isFunction(t) && (H(ft, t) || t.$au?.type === ut);

const findAttributeControllerFor = (t, e) => getRef(t, getAttributeKeyFrom(e)) ?? void 0;

const defineAttribute = (t, s) => {
    const i = CustomAttributeDefinition.create(t, s);
    const n = i.Type;
    O(i, n, ft, e.resourceBaseName);
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
        O(s, t, $(e));
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

function lifecycleHooks() {
    return function decorator(t, e) {
        return mt.define({}, t);
    };
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

const getConverterAnnotation = (t, e) => F($(e), t);

const getValueConverterKeyFrom = t => `${xt}:${t}`;

const vt = u({
    name: xt,
    keyFrom: getValueConverterKeyFrom,
    isType(t) {
        return isFunction(t) && (H(xt, t) || t.$au?.type === gt);
    },
    define(t, s) {
        const i = ValueConverterDefinition.create(t, s);
        const n = i.Type;
        O(i, n, xt, e.resourceBaseName);
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
        O(s, t, $(e));
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
        if (t !== T(s.ast, s.s, s, null)) {
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

const bt = new WeakMap;

const wt = new WeakMap;

class ResourceLookup {}

const yt = /*@__PURE__*/ U("IFlushQueue", (t => t.singleton(FlushQueue)));

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
    return this.l.root.get(nt);
}

function evaluatorGetConverter(t) {
    let e = bt.get(this);
    if (e == null) {
        bt.set(this, e = new ResourceLookup);
    }
    return e[t] ??= vt.get(this.l, t);
}

function evaluatorGetBehavior(t) {
    let e = wt.get(this);
    if (e == null) {
        wt.set(this, e = new ResourceLookup);
    }
    return e[t] ??= tt.get(this.l, t);
}

function flushItem(t, e, s) {
    s.delete(t);
    t.flush();
}

const Ct = new WeakSet;

const mixingBindingLimited = (t, e) => {
    defineHiddenProp(t.prototype, "limit", (function(t) {
        if (Ct.has(this)) {
            throw createMappedError(9996);
        }
        Ct.add(this);
        const s = e(this, t);
        const i = t.signals;
        const n = i.length > 0 ? this.get(nt) : null;
        const r = this[s];
        const callOriginal = (...t) => r.call(this, ...t);
        const l = t.type === "debounce" ? debounced(t, callOriginal, this) : throttled(t, callOriginal, this);
        const a = n ? {
            handleChange: l.flush
        } : null;
        this[s] = l;
        if (n) {
            i.forEach((t => addSignalListener(n, t, a)));
        }
        return {
            dispose: () => {
                if (n) {
                    i.forEach((t => removeSignalListener(n, t, a)));
                }
                Ct.delete(this);
                l.dispose();
                delete this[s];
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

const kt = {
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
        const e = T(this.ast, this.s, this, (this.mode & L) > 0 ? this : null);
        this.obs.clear();
        if (e !== this.v) {
            this.v = e;
            const s = this.P.state !== $e;
            if (s) {
                t = this.I;
                this.I = this.A.queueTask((() => {
                    this.I = null;
                    this.updateTarget(e);
                }), kt);
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
        E(this.ast, t, this);
        if (this.mode & (L | P)) {
            this.updateTarget(this.v = T(this.ast, t, this, (this.mode & L) > 0 ? this : null));
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

mixinUseScope(AttributeBinding);

mixingBindingLimited(AttributeBinding, (() => "updateTarget"));

s.connectable(AttributeBinding, null);

mixinAstEvaluator(true)(AttributeBinding);

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
        const l = this.P.state !== $e && (r.type & S) > 0;
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
        const t = T(this.ast, this.s, this, (this.mode & L) > 0 ? this : null);
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
        E(this.ast, t, this);
        this.v = T(this.ast, this.s, this, (this.mode & L) > 0 ? this : null);
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

mixinUseScope(InterpolationPartBinding);

mixingBindingLimited(InterpolationPartBinding, (() => "updateTarget"));

s.connectable(InterpolationPartBinding, null);

mixinAstEvaluator(true)(InterpolationPartBinding);

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
        const t = T(this.ast, this.s, this, (this.mode & L) > 0 ? this : null);
        this.obs.clear();
        if (t === this.v) {
            this.I?.cancel();
            this.I = null;
            return;
        }
        const e = this.P.state !== $e;
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
        const t = this.v = T(this.ast, this.s, this, (this.mode & L) > 0 ? this : null);
        this.obs.clear();
        if (isArray(t)) {
            this.observeCollection(t);
        }
        const e = this.P.state !== $e;
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
        E(this.ast, t, this);
        const e = this.v = T(this.ast, this.s, this, (this.mode & L) > 0 ? this : null);
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

mixinUseScope(ContentBinding);

mixingBindingLimited(ContentBinding, (() => "updateTarget"));

s.connectable(ContentBinding, null);

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
        this.target = this.F ? t.bindingContext : t.overrideContext;
        E(this.ast, t, this);
        this.v = T(this.ast, this.s, this, this);
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

mixinUseScope(LetBinding);

mixingBindingLimited(LetBinding, (() => "updateTarget"));

s.connectable(LetBinding, null);

mixinAstEvaluator(true)(LetBinding);

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
        this.H = null;
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
        R(this.ast, this.s, this, t);
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = T(this.ast, this.s, this, (this.mode & L) > 0 ? this : null);
        this.obs.clear();
        const e = this.P.state !== $e && (this.L.type & S) > 0;
        if (e) {
            St = this.I;
            this.I = this.A.queueTask((() => {
                this.updateTarget(t);
                this.I = null;
            }), Rt);
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
        E(this.ast, t, this);
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
            this.updateTarget(T(this.ast, this.s, this, n ? this : null));
        }
        if (s & D) {
            i.subscribe(this.H ??= new BindingTargetSubscriber(this, this.l.get(yt)));
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
        if (this.H) {
            this.L.unsubscribe(this.H);
            this.H = null;
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
        if (this.H != null) {
            throw createMappedError(9995);
        }
        this.H = t;
    }
}

mixinUseScope(PropertyBinding);

mixingBindingLimited(PropertyBinding, (t => t.mode & D ? "updateSource" : "updateTarget"));

s.connectable(PropertyBinding, null);

mixinAstEvaluator(true, false)(PropertyBinding);

let St = null;

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
        E(this.ast, t, this);
        R(this.ast, this.s, this, this.target);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        if (T(this.ast, this.s, this, null) === this.target) {
            R(this.ast, this.s, this, null);
        }
        I(this.ast, this.s, this);
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
        let s = T(this.ast, this.s, this, null);
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
        E(this.ast, t, this);
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

mixinUseScope(ListenerBinding);

mixingBindingLimited(ListenerBinding, (() => "callSource"));

mixinAstEvaluator(true, true)(ListenerBinding);

const Tt = /*@__PURE__*/ U("IEventModifier");

const Et = /*@__PURE__*/ U("IKeyMapping", (t => t.instance({
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
        this.$ = e.resolve(Et);
        this.N = [ "left", "middle", "right" ];
    }
    static register(t) {
        t.register(z(Tt, ModifiedMouseEventHandler));
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
        this.$ = e.resolve(Et);
        this.type = [ "keydown", "keyup" ];
    }
    static register(t) {
        t.register(z(Tt, ModifiedKeyboardEventHandler));
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

const It = /*@__PURE__*/ U("IEventModifierHandler", (t => t.instance({
    getHandler: () => null
})));

class EventModifier {
    constructor() {
        this.j = e.resolve(e.all(Tt)).reduce(((t, e) => {
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

const Ht = /*@__PURE__*/ U("IAuSlotWatcher");

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
        K(Ht, i).register(e.container);
        e.addBinding(i);
    }
}

function slotted(t, e) {
    if (!Ot) {
        Ot = true;
        s.subscriberCollection(AuSlotWatcherBinding);
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

let Ot = false;

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
        if (t.vmKind !== He) {
            throw createMappedError(9998);
        }
        this.$controller.addChild(t);
    }
}

const Vt = "ra";

const $t = "rb";

const Nt = "rc";

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
    hydrateAttribute: $t,
    hydrateTemplateController: Nt,
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
        this.type = $t;
    }
}

class HydrateTemplateController {
    constructor(t, e, s, i) {
        this.def = t;
        this.res = e;
        this.alias = s;
        this.props = i;
        this.type = Nt;
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

function renderer(t) {
    return function decorator(s) {
        x(s.prototype, "target", {
            configurable: true,
            get() {
                return t;
            }
        });
        return e.Registrable.define(s, (function(t) {
            z(he, this).register(t);
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

class SetPropertyRenderer {
    render(t, e, s) {
        const i = getTarget(e);
        if (i.$observers?.[s.to] !== void 0) {
            i.$observers[s.to].setValue(s.value);
        } else {
            i[s.to] = s.value;
        }
    }
}

renderer(Wt)(SetPropertyRenderer, null);

class CustomElementRenderer {
    constructor() {
        this.r = e.resolve(ve);
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
            l = ds.find(f, c);
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
}

renderer(Vt)(CustomElementRenderer, null);

class CustomAttributeRenderer {
    constructor() {
        this.r = e.resolve(ve);
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
}

renderer($t)(CustomAttributeRenderer, null);

class TemplateControllerRenderer {
    constructor() {
        this.r = e.resolve(ve);
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
}

renderer(Nt)(TemplateControllerRenderer, null);

class LetElementRenderer {
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
}

renderer(jt)(LetElementRenderer, null);

class RefBindingRenderer {
    render(t, e, s, i, n) {
        t.addBinding(new RefBinding(t.container, ensureExpression(n, s.from, y), getRefTarget(e, s.to)));
    }
}

renderer(Kt)(RefBindingRenderer, null);

class InterpolationBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new InterpolationBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, v), getTarget(e), s.to, L));
    }
}

renderer(Ut)(InterpolationBindingRenderer, null);

class PropertyBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, y), getTarget(e), s.to, s.mode));
    }
}

renderer(zt)(PropertyBindingRenderer, null);

class IteratorBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.forOf, b), getTarget(e), s.to, L));
    }
}

renderer(Xt)(IteratorBindingRenderer, null);

class TextBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, i.domWriteQueue, i, ensureExpression(n, s.from, y), e));
    }
}

renderer(Yt)(TextBindingRenderer, null);

const ce = U("IListenerBindingOptions", (t => t.instance({
    prevent: false
})));

class ListenerBindingRenderer {
    constructor() {
        this.tt = e.resolve(It);
        this.et = e.resolve(ce);
    }
    render(t, e, s, i, n) {
        t.addBinding(new ListenerBinding(t.container, ensureExpression(n, s.from, w), e, s.to, new ListenerBindingOptions(this.et.prevent, s.capture), this.tt.getHandler(s.to, s.modifier)));
    }
}

renderer(Zt)(ListenerBindingRenderer, null);

class SetAttributeRenderer {
    render(t, e, s) {
        e.setAttribute(s.to, s.value);
    }
}

renderer(ee)(SetAttributeRenderer, null);

class SetClassAttributeRenderer {
    render(t, e, s) {
        addClasses(e.classList, s.value);
    }
}

renderer(se)(SetClassAttributeRenderer, null);

class SetStyleAttributeRenderer {
    render(t, e, s) {
        e.style.cssText += s.value;
    }
}

renderer(ie)(SetStyleAttributeRenderer, null);

class StylePropertyBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, y), e.style, s.to, L));
    }
}

renderer(te)(StylePropertyBindingRenderer, null);

class AttributeBindingRenderer {
    render(t, e, s, i, n, r) {
        const l = t.container;
        const a = l.has(ss, false) ? l.get(ss) : null;
        t.addBinding(new AttributeBinding(t, l, r, i.domWriteQueue, ensureExpression(n, s.from, y), e, s.attr, a == null ? s.to : s.to.split(/\s/g).map((t => a[t] ?? t)).join(" "), L));
    }
}

renderer(Jt)(AttributeBindingRenderer, null);

class SpreadRenderer {
    constructor() {
        this.st = e.resolve(ae);
        this.r = e.resolve(ve);
    }
    render(t, e, s, i, n, r) {
        SpreadBinding.create(t.container.get(Xe), e, void 0, this.r, this.st, i, n, r).forEach((e => t.addBinding(e)));
    }
}

renderer(ne)(SpreadRenderer, null);

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

const ue = "IController";

const fe = "IInstruction";

const de = "IRenderLocation";

const pe = "ISlotsInfo";

function createElementContainer(t, s, i, n, r, l) {
    const a = s.container.createChild();
    registerHostNode(a, t, i);
    registerResolver(a, Ke, new e.InstanceProvider(ue, s));
    registerResolver(a, le, new e.InstanceProvider(fe, n));
    registerResolver(a, es, r == null ? me : new RenderLocationProvider(r));
    registerResolver(a, Lt, ge);
    registerResolver(a, Ft, l == null ? xe : new e.InstanceProvider(pe, l));
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
    registerResolver(u, Ke, new e.InstanceProvider(ue, c));
    registerResolver(u, le, new e.InstanceProvider(fe, r));
    registerResolver(u, es, a == null ? me : new e.InstanceProvider(de, a));
    registerResolver(u, Lt, l == null ? ge : new ViewFactoryProvider(l));
    registerResolver(u, Ft, h == null ? xe : new e.InstanceProvider(pe, h));
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

const me = new RenderLocationProvider(null);

const ge = new ViewFactoryProvider(null);

const xe = new e.InstanceProvider(pe, new AuSlotsInfo(e.emptyArray));

const ve = /*@__PURE__*/ U("IRendering", (t => t.singleton(Rendering)));

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

function getClassesToAdd(t) {
    if (isString(t)) {
        return splitClassString(t);
    }
    if (typeof t !== "object") {
        return e.emptyArray;
    }
    if (t instanceof Array) {
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

mixinNoopSubscribable(ClassAttributeAccessor);

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
                this.wt = new ClassAttributeAccessor(e.resolve(Je));
                this.value = "";
            }
            binding() {
                this.valueChanged();
            }
            valueChanged() {
                this.wt.setValue(this.value?.split(/\s+/g).map((t => s[t] || t)) ?? "");
            }
        });
        t.register(i, K(ss, s));
    }
}

function shadowCSS(...t) {
    return new ShadowDOMRegistry(t);
}

const be = /*@__PURE__*/ U("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
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
        const e = t.get(ye);
        const s = t.get(be);
        t.register(K(we, s.createStyles(this.css, e)));
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

const we = /*@__PURE__*/ U("IShadowDOMStyles");

const ye = /*@__PURE__*/ U("IShadowDOMGlobalStyles", (t => t.instance({
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

const Ce = {
    shadowDOM(t) {
        return at.creating(e.IContainer, (e => {
            if (t.sharedStyles != null) {
                const s = e.get(be);
                e.register(K(ye, s.createStyles(t.sharedStyles, null)));
            }
        }));
    }
};

const {enter: ke, exit: Ae} = s.ConnectableSwitcher;

const {wrap: Be, unwrap: Se} = s.ProxyObservable;

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
            ke(this);
            return this.v = Se(this.$get.call(void 0, this.useProxy ? Be(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            Ae(this);
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
        const s = this.obj;
        const i = this.v;
        const n = e.$kind === "AccessScope" && this.obs.count === 1;
        if (!n) {
            this.obs.version++;
            t = T(e, this.scope, this, this);
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
        this.v = T(this.yt, this.scope, this, this);
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

s.connectable(ComputedWatcher, null);

s.connectable(ExpressionWatcher, null);

mixinAstEvaluator(true)(ExpressionWatcher);

class Controller {
    get lifecycleHooks() {
        return this.Ct;
    }
    get isActive() {
        return (this.state & ($e | Ne)) > 0 && (this.state & je) === 0;
    }
    get name() {
        if (this.parent === null) {
            switch (this.vmKind) {
              case He:
                return `[${this.definition.name}]`;

              case Fe:
                return this.definition.name;

              case Oe:
                return this.viewFactory.name;
            }
        }
        switch (this.vmKind) {
          case He:
            return `${this.parent.name}>[${this.definition.name}]`;

          case Fe:
            return `${this.parent.name}>${this.definition.name}`;

          case Oe:
            return this.viewFactory.name === this.parent.definition?.name ? `${this.parent.name}[view]` : `${this.parent.name}[view:${this.viewFactory.name}]`;
        }
    }
    get viewModel() {
        return this.kt;
    }
    set viewModel(t) {
        this.kt = t;
        this.At = t == null || this.vmKind === Oe ? HooksDefinition.none : new HooksDefinition(t);
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
        this.mountTarget = Te;
        this.shadowRoot = null;
        this.nodes = null;
        this.location = null;
        this.Ct = null;
        this.state = Ve;
        this.St = false;
        this.$initiator = null;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this.Rt = 0;
        this.Tt = 0;
        this.Et = 0;
        this.kt = n;
        this.At = e === Oe ? HooksDefinition.none : new HooksDefinition(n);
        this.location = l;
        this.r = t.root.get(ve);
        this.coercion = e === Oe ? void 0 : t.get(Me);
    }
    static getCached(t) {
        return Re.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (e === void 0) {
            throw createMappedError(500, t);
        }
        return e;
    }
    static $el(t, s, i, n, r = void 0, l = null) {
        if (Re.has(s)) {
            return Re.get(s);
        }
        {
            r = r ?? getElementDefinition(s.constructor);
        }
        registerResolver(t, r.Type, new e.InstanceProvider(r.key, s, r.Type));
        const a = new Controller(t, Fe, r, null, s, i, l);
        const h = t.get(e.optional(Xe));
        if (r.dependencies.length > 0) {
            t.register(...r.dependencies);
        }
        registerResolver(t, Xe, new e.InstanceProvider("IHydrationContext", new HydrationContext(a, n, h)));
        Re.set(s, a);
        if (n == null || n.hydrate !== false) {
            a.hE(n, h);
        }
        return a;
    }
    static $attr(t, s, i, n) {
        if (Re.has(s)) {
            return Re.get(s);
        }
        n = n ?? getAttributeDefinition(s.constructor);
        registerResolver(t, n.Type, new e.InstanceProvider(n.key, s, n.Type));
        const r = new Controller(t, He, n, null, s, i, null);
        if (n.dependencies.length > 0) {
            t.register(...n.dependencies);
        }
        Re.set(s, r);
        r.It();
        return r;
    }
    static $view(t, e = void 0) {
        const s = new Controller(t.container, Oe, null, t, null, null, null);
        s.parent = e ?? null;
        s.Pt();
        return s;
    }
    hE(t, i) {
        const n = this.container;
        const r = this.kt;
        const l = this.definition;
        this.scope = s.Scope.create(r, null, true);
        if (l.watches.length > 0) {
            createWatchers(this, n, l, r);
        }
        createObservers(this, l, r);
        this.Ct = mt.resolve(n);
        n.register(l.Type);
        if (l.injectable !== null) {
            registerResolver(n, l.injectable, new e.InstanceProvider("definition.injectable", r));
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
        const s = this.Dt = this.r.compile(e, this.container, t);
        const i = s.shadowOptions;
        const n = s.hasSlots;
        const r = s.containerless;
        let l = this.host;
        let a = this.location;
        if ((this.hostController = findElementControllerFor(l, De)) !== null) {
            l = this.host = this.container.root.get(ht).document.createElement(e.name);
            if (r && a == null) {
                a = this.location = convertToRenderLocation(l);
            }
        }
        setRef(l, cs, this);
        setRef(l, e.key, this);
        if (i !== null || n) {
            if (a != null) {
                throw createMappedError(501);
            }
            setRef(this.shadowRoot = l.attachShadow(i ?? qe), cs, this);
            setRef(this.shadowRoot, e.key, this);
            this.mountTarget = Ie;
        } else if (a != null) {
            setRef(a, cs, this);
            setRef(a, e.key, this);
            this.mountTarget = Pe;
        } else {
            this.mountTarget = Ee;
        }
        this.kt.$controller = this;
        this.nodes = this.r.createNodes(s);
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
        this.Ct = mt.resolve(this.container);
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
    activate(t, s, i) {
        switch (this.state) {
          case Ve:
          case We:
            if (!(s === null || s.isActive)) {
                return;
            }
            this.state = $e;
            break;

          case Ne:
            return;

          case ze:
            throw createMappedError(502, this.name);

          default:
            throw createMappedError(503, this.name, stringifyState(this.state));
        }
        this.parent = s;
        switch (this.vmKind) {
          case Fe:
            this.scope.parent = i ?? null;
            break;

          case He:
            this.scope = i ?? null;
            break;

          case Oe:
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
        if (this.vmKind !== Oe && this.Ct.binding != null) {
            n = e.onResolveAll(...this.Ct.binding.map(callBindingHook, this));
        }
        if (this.At.Ft) {
            n = e.onResolveAll(n, this.kt.binding(this.$initiator, this.parent));
        }
        if (isPromise(n)) {
            this.Ht();
            n.then((() => {
                this.Bt = true;
                if (this.state !== $e) {
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
        if (this.vmKind !== Oe && this.Ct.bound != null) {
            i = e.onResolveAll(...this.Ct.bound.map(callBoundHook, this));
        }
        if (this.At.$t) {
            i = e.onResolveAll(i, this.kt.bound(this.$initiator, this.parent));
        }
        if (isPromise(i)) {
            this.Ht();
            i.then((() => {
                this.isBound = true;
                if (this.state !== $e) {
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
    jt(...t) {
        switch (this.mountTarget) {
          case Ee:
            this.host.append(...t);
            break;

          case Ie:
            this.shadowRoot.append(...t);
            break;

          case Pe:
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
              case Ee:
              case Ie:
                this.hostController.jt(this.host);
                break;

              case Pe:
                this.hostController.jt(this.location.$start, this.location);
                break;
            }
        }
        switch (this.mountTarget) {
          case Ee:
            this.nodes.appendTo(this.host, this.definition != null && this.definition.enhance);
            break;

          case Ie:
            {
                const t = this.container;
                const e = t.has(we, false) ? t.get(we) : t.get(ye);
                e.applyTo(this.shadowRoot);
                this.nodes.appendTo(this.shadowRoot);
                break;
            }

          case Pe:
            this.nodes.insertBefore(this.location);
            break;
        }
        let t = 0;
        let s = void 0;
        if (this.vmKind !== Oe && this.Ct.attaching != null) {
            s = e.onResolveAll(...this.Ct.attaching.map(callAttachingHook, this));
        }
        if (this.At.Wt) {
            s = e.onResolveAll(s, this.kt.attaching(this.$initiator, this.parent));
        }
        if (isPromise(s)) {
            this.Ht();
            this.qt();
            s.then((() => {
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
    deactivate(t, s) {
        let i = void 0;
        switch (this.state & ~Ue) {
          case Ne:
            this.state = je;
            break;

          case $e:
            this.state = je;
            i = this.$promise?.catch(e.noop);
            break;

          case Ve:
          case We:
          case ze:
          case We | ze:
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
                if (this.vmKind !== Oe && this.Ct.detaching != null) {
                    r = e.onResolveAll(...this.Ct.detaching.map(callDetachingHook, this));
                }
                if (this.At.zt) {
                    r = e.onResolveAll(r, this.kt.detaching(this.$initiator, this.parent));
                }
            }
            if (isPromise(r)) {
                this.Ht();
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
          case Fe:
          case Oe:
            this.nodes.remove();
            this.nodes.unlink();
        }
        if (this.hostController !== null) {
            switch (this.mountTarget) {
              case Ee:
              case Ie:
                this.host.remove();
                break;

              case Pe:
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
          case He:
            this.scope = null;
            break;

          case Oe:
            if (!this.hasLockedScope) {
                this.scope = null;
            }
            if ((this.state & Ue) === Ue && !this.viewFactory.tryReturnToCache(this) && this.$initiator === this) {
                this.dispose();
            }
            break;

          case Fe:
            this.scope.parent = null;
            break;
        }
        this.state = We;
        this.$initiator = null;
        this.Kt();
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
    Kt() {
        if (this.$promise !== void 0) {
            Qe = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            Qe();
            Qe = void 0;
        }
    }
    Vt(t) {
        if (this.$promise !== void 0) {
            Ye = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            Ye(t);
            Ye = void 0;
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
    Ot() {
        if (this.state !== $e) {
            --this.Rt;
            this.Kt();
            if (this.$initiator !== this) {
                this.parent.Ot();
            }
            return;
        }
        if (--this.Rt === 0) {
            if (this.vmKind !== Oe && this.Ct.attached != null) {
                Ze = e.onResolveAll(...this.Ct.attached.map(callAttachedHook, this));
            }
            if (this.At.Xt) {
                Ze = e.onResolveAll(Ze, this.kt.attached(this.$initiator));
            }
            if (isPromise(Ze)) {
                this.Ht();
                Ze.then((() => {
                    this.state = Ne;
                    this.Kt();
                    if (this.$initiator !== this) {
                        this.parent.Ot();
                    }
                })).catch((t => {
                    this.Vt(t);
                }));
                Ze = void 0;
                return;
            }
            Ze = void 0;
            this.state = Ne;
            this.Kt();
        }
        if (this.$initiator !== this) {
            this.parent.Ot();
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
            let s = void 0;
            while (t !== null) {
                if (t !== this) {
                    if (t.debug) {
                        t.logger.trace(`detach()`);
                    }
                    t.removeNodes();
                }
                if (t.Bt) {
                    if (t.vmKind !== Oe && t.Ct.unbinding != null) {
                        s = e.onResolveAll(...t.Ct.unbinding.map(callUnbindingHook, t));
                    }
                    if (t.At.Yt) {
                        if (t.debug) {
                            t.logger.trace("unbinding()");
                        }
                        s = e.onResolveAll(s, t.viewModel.unbinding(t.$initiator, t.parent));
                    }
                }
                if (isPromise(s)) {
                    this.Ht();
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
          case He:
          case Fe:
            {
                return this.definition.name === t;
            }

          case Oe:
            return this.viewFactory.name === t;
        }
    }
    lockScope(t) {
        this.scope = t;
        this.hasLockedScope = true;
    }
    setHost(t) {
        if (this.vmKind === Fe) {
            setRef(t, cs, this);
            setRef(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = Ee;
        return this;
    }
    setShadowRoot(t) {
        if (this.vmKind === Fe) {
            setRef(t, cs, this);
            setRef(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = Ie;
        return this;
    }
    setLocation(t) {
        if (this.vmKind === Fe) {
            setRef(t, cs, this);
            setRef(t, this.definition.key, this);
        }
        this.location = t;
        this.mountTarget = Pe;
        return this;
    }
    release() {
        this.state |= Ue;
    }
    dispose() {
        if ((this.state & ze) === ze) {
            return;
        }
        this.state |= ze;
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
            Re.delete(this.kt);
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
            for (let s = 0, i = e.length; s < i; ++s) {
                if (e[s].accept(t) === true) {
                    return true;
                }
            }
        }
    }
}

const Re = new WeakMap;

const Te = 0;

const Ee = 1;

const Ie = 2;

const Pe = 3;

const Le = u({
    none: Te,
    host: Ee,
    shadowRoot: Ie,
    location: Pe
});

const De = {
    optional: true
};

const Me = e.optionalResource(s.ICoercionConfiguration);

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

const _e = new Map;

const getAccessScopeAst = e => {
    let s = _e.get(e);
    if (s == null) {
        s = new t.AccessScopeExpression(e, 0);
        _e.set(e, s);
    }
    return s;
};

function createWatchers(e, i, n, r) {
    const l = i.get(s.IObserverLocator);
    const a = i.get(t.IExpressionParser);
    const h = n.watches;
    const c = e.vmKind === Fe ? e.scope : s.Scope.create(r, null, true);
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
    return t instanceof Controller && t.vmKind === Fe;
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

const qe = {
    mode: "open"
};

const Fe = "customElement";

const He = "customAttribute";

const Oe = "synthetic";

const Ve = 0;

const $e = 1;

const Ne = 2;

const je = 4;

const We = 8;

const Ue = 16;

const ze = 32;

const Ge = /*@__PURE__*/ u({
    none: Ve,
    activating: $e,
    activated: Ne,
    deactivating: je,
    deactivated: We,
    released: Ue,
    disposed: ze
});

function stringifyState(t) {
    const e = [];
    if ((t & $e) === $e) {
        e.push("activating");
    }
    if ((t & Ne) === Ne) {
        e.push("activated");
    }
    if ((t & je) === je) {
        e.push("deactivating");
    }
    if ((t & We) === We) {
        e.push("deactivated");
    }
    if ((t & Ue) === Ue) {
        e.push("released");
    }
    if ((t & ze) === ze) {
        e.push("disposed");
    }
    return e.length === 0 ? "none" : e.join("|");
}

const Ke = /*@__PURE__*/ U("IController");

const Xe = /*@__PURE__*/ U("IHydrationContext");

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

let Qe;

let Ye;

let Ze;

class Refs {}

function getRef(t, e) {
    return t.$au?.[e] ?? null;
}

function setRef(t, e, s) {
    (t.$au ??= new Refs)[e] = s;
}

const Je = /*@__PURE__*/ U("INode");

const ts = /*@__PURE__*/ U("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(ms, true)) {
        return t.get(ms).host;
    }
    return t.get(ht).document;
}))));

const es = /*@__PURE__*/ U("IRenderLocation");

const ss = /*@__PURE__*/ U("CssModules");

const is = new WeakMap;

function getEffectiveParentNode(t) {
    if (is.has(t)) {
        return is.get(t);
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
        if (e.mountTarget === Le.shadowRoot) {
            return getEffectiveParentNode(e.host);
        }
    }
    return t.parentNode;
}

function setEffectiveParentNode(t, e) {
    if (t.platform !== void 0 && !(t instanceof t.platform.Node)) {
        const s = t.childNodes;
        for (let t = 0, i = s.length; t < i; ++t) {
            is.set(s[t], e);
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

const ns = /*@__PURE__*/ U("IWindow", (t => t.callback((t => t.get(ht).window))));

const rs = /*@__PURE__*/ U("ILocation", (t => t.callback((t => t.get(ns).location))));

const os = /*@__PURE__*/ U("IHistory", (t => t.callback((t => t.get(ns).history))));

const registerHostNode = (t, s, i) => {
    registerResolver(t, s.HTMLElement, registerResolver(t, s.Element, registerResolver(t, Je, new e.InstanceProvider("ElementResolver", i))));
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
    const e = F(cs, t);
    if (e === void 0) {
        annotateElementMetadata(t, "containerless", true);
        return;
    }
    e.containerless = true;
}

const ls = new WeakMap;

class CustomElementDefinition {
    get kind() {
        return X;
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
    static create(t, s = null) {
        if (s === null) {
            const i = t;
            if (isString(i)) {
                throw createMappedError(761, t);
            }
            const n = e.fromDefinitionOrDefault("name", i, us);
            if (isFunction(i.Type)) {
                s = i.Type;
            } else {
                s = fs(e.pascalCase(n));
            }
            return new CustomElementDefinition(s, n, e.mergeArrays(i.aliases), e.fromDefinitionOrDefault("key", i, (() => getElementKeyFrom(n))), e.fromDefinitionOrDefault("cache", i, returnZero), e.fromAnnotationOrDefinitionOrTypeOrDefault("capture", i, s, returnFalse), e.fromDefinitionOrDefault("template", i, returnNull), e.mergeArrays(i.instructions), e.mergeArrays(getElementAnnotation(s, "dependencies"), i.dependencies), e.fromDefinitionOrDefault("injectable", i, returnNull), e.fromDefinitionOrDefault("needsCompile", i, returnTrue), e.mergeArrays(i.surrogates), j.from(getElementAnnotation(s, "bindables"), i.bindables), e.fromAnnotationOrDefinitionOrTypeOrDefault("containerless", i, s, returnFalse), e.fromDefinitionOrDefault("shadowOptions", i, returnNull), e.fromDefinitionOrDefault("hasSlots", i, returnFalse), e.fromDefinitionOrDefault("enhance", i, returnFalse), e.fromDefinitionOrDefault("watches", i, returnEmptyArray), e.fromAnnotationOrTypeOrDefault("processContent", s, returnNull));
        }
        if (isString(t)) {
            return new CustomElementDefinition(s, t, e.mergeArrays(getElementAnnotation(s, "aliases"), s.aliases), getElementKeyFrom(t), e.fromAnnotationOrTypeOrDefault("cache", s, returnZero), e.fromAnnotationOrTypeOrDefault("capture", s, returnFalse), e.fromAnnotationOrTypeOrDefault("template", s, returnNull), e.mergeArrays(getElementAnnotation(s, "instructions"), s.instructions), e.mergeArrays(getElementAnnotation(s, "dependencies"), s.dependencies), e.fromAnnotationOrTypeOrDefault("injectable", s, returnNull), e.fromAnnotationOrTypeOrDefault("needsCompile", s, returnTrue), e.mergeArrays(getElementAnnotation(s, "surrogates"), s.surrogates), j.from(...j.getAll(s), getElementAnnotation(s, "bindables"), s.bindables), e.fromAnnotationOrTypeOrDefault("containerless", s, returnFalse), e.fromAnnotationOrTypeOrDefault("shadowOptions", s, returnNull), e.fromAnnotationOrTypeOrDefault("hasSlots", s, returnFalse), e.fromAnnotationOrTypeOrDefault("enhance", s, returnFalse), e.mergeArrays(ct.getDefinitions(s), s.watches), e.fromAnnotationOrTypeOrDefault("processContent", s, returnNull));
        }
        const i = e.fromDefinitionOrDefault("name", t, us);
        return new CustomElementDefinition(s, i, e.mergeArrays(getElementAnnotation(s, "aliases"), t.aliases, s.aliases), getElementKeyFrom(i), e.fromAnnotationOrDefinitionOrTypeOrDefault("cache", t, s, returnZero), e.fromAnnotationOrDefinitionOrTypeOrDefault("capture", t, s, returnFalse), e.fromAnnotationOrDefinitionOrTypeOrDefault("template", t, s, returnNull), e.mergeArrays(getElementAnnotation(s, "instructions"), t.instructions, s.instructions), e.mergeArrays(getElementAnnotation(s, "dependencies"), t.dependencies, s.dependencies), e.fromAnnotationOrDefinitionOrTypeOrDefault("injectable", t, s, returnNull), e.fromAnnotationOrDefinitionOrTypeOrDefault("needsCompile", t, s, returnTrue), e.mergeArrays(getElementAnnotation(s, "surrogates"), t.surrogates, s.surrogates), j.from(...j.getAll(s), getElementAnnotation(s, "bindables"), s.bindables, t.bindables), e.fromAnnotationOrDefinitionOrTypeOrDefault("containerless", t, s, returnFalse), e.fromAnnotationOrDefinitionOrTypeOrDefault("shadowOptions", t, s, returnNull), e.fromAnnotationOrDefinitionOrTypeOrDefault("hasSlots", t, s, returnFalse), e.fromAnnotationOrDefinitionOrTypeOrDefault("enhance", t, s, returnFalse), e.mergeArrays(t.watches, ct.getDefinitions(s), s.watches), e.fromAnnotationOrDefinitionOrTypeOrDefault("processContent", t, s, returnNull));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) {
            return t;
        }
        if (ls.has(t)) {
            return ls.get(t);
        }
        const e = CustomElementDefinition.create(t);
        ls.set(t, e);
        O(e, e.Type, cs);
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

const as = {
    name: undefined,
    searchParents: false,
    optional: false
};

const returnZero = () => 0;

const returnNull = () => null;

const returnFalse = () => false;

const returnTrue = () => true;

const returnEmptyArray = () => e.emptyArray;

const hs = "custom-element";

const cs = /*@__PURE__*/ e.getResourceKeyFor(hs);

const getElementKeyFrom = t => `${cs}:${t}`;

const us = /*@__PURE__*/ (t => () => `unnamed-${++t}`)(0);

const annotateElementMetadata = (t, e, s) => {
    O(s, t, $(e));
};

const defineElement = (t, s) => {
    const i = CustomElementDefinition.create(t, s);
    const n = i.Type;
    O(i, n, cs, e.resourceBaseName);
    return n;
};

const isElementType = t => isFunction(t) && (H(cs, t) || t.$au?.type === hs);

const findElementControllerFor = (t, e = as) => {
    if (e.name === void 0 && e.searchParents !== true) {
        const s = getRef(t, cs);
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
            const s = getRef(t, cs);
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
            const t = getRef(s, cs);
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
        const t = getRef(s, cs);
        if (t !== null) {
            return t;
        }
        s = getEffectiveParentNode(s);
    }
    throw createMappedError(765, t);
};

const getElementAnnotation = (t, e) => F($(e), t);

const getElementDefinition = t => {
    const e = F(cs, t) ?? getDefinitionFromStaticAu(t, hs, CustomElementDefinition.create);
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

const fs = /*@__PURE__*/ function() {
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

const ds = u({
    name: cs,
    keyFrom: getElementKeyFrom,
    isType: isElementType,
    for: findElementControllerFor,
    define: defineElement,
    getDefinition: getElementDefinition,
    annotate: annotateElementMetadata,
    getAnnotation: getElementAnnotation,
    generateName: us,
    createInjectable: createElementInjectable,
    generateType: fs,
    find(t, e) {
        const s = t.find(hs, e);
        return s == null ? null : F(cs, s) ?? getDefinitionFromStaticAu(s, hs, CustomElementDefinition.create) ?? null;
    }
});

const ps = /*@__PURE__*/ $("processContent");

function processContent(t) {
    return t === void 0 ? function(t, e) {
        if (!e.static || e.kind !== "method") throw createMappedError(766, t);
        e.addInitializer((function() {
            O(t, this, ps);
        }));
    } : function(e, s) {
        s.addInitializer((function() {
            if (isString(t) || isSymbol(t)) {
                t = this[t];
            }
            if (!isFunction(t)) throw createMappedError(766, t);
            const e = F(cs, this);
            if (e !== void 0) {
                e.processContent = t;
            } else {
                O(t, this, ps);
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

const ms = /*@__PURE__*/ U("IAppRoot");

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
                name: us(),
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

const gs = /*@__PURE__*/ U("IAurelia");

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
        if (t.has(gs, true) || t.has(Aurelia, true)) {
            throw createMappedError(768);
        }
        registerResolver(t, gs, new e.InstanceProvider("IAurelia", this));
        registerResolver(t, Aurelia, new e.InstanceProvider("Aurelia", this));
        registerResolver(t, ms, this.ge = new e.InstanceProvider("IAppRoot"));
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
                this.has = this.be;
                break;

              default:
                this.has = this.we;
            }
        } else {
            switch (t.length) {
              case 0:
                this.has = this.ye;
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
    ye(t) {
        return false;
    }
    we(t) {
        return !this.chars.includes(t);
    }
    be(t) {
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
        const s = this.Te;
        if (!s.includes(e)) {
            s.push(e);
        }
        let i = this.findChild(t);
        if (i == null) {
            i = new AttrParsingState(t, e);
            this.Ee.push(i);
            if (t.repeat) {
                i.Ee.push(i);
            }
        }
        return i;
    }
    findMatches(t, e) {
        const s = [];
        const i = this.Ee;
        const n = i.length;
        let r = 0;
        let l = null;
        let a = 0;
        let h = 0;
        for (;a < n; ++a) {
            l = i[a];
            if (l.charSpec.has(t)) {
                s.push(l);
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

const xs = /*@__PURE__*/ U("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

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
            s.Re = true;
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
    return t.Re;
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

const vs = /*@__PURE__*/ U("IAttributePattern");

const bs = /*@__PURE__*/ U("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor() {
        this.W = {};
        const t = this.He = e.resolve(xs);
        const s = ys.findAll(e.resolve(e.IContainer));
        const i = this.Te = {};
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
            s = this.W[t] = this.He.interpret(t);
        }
        const i = s.pattern;
        if (i == null) {
            return new AttrSyntax(t, e, t, null, null);
        } else {
            return this.Te[i][i](t, e, s.parts);
        }
    }
}

function attributePattern(...t) {
    return function decorator(e) {
        return ys.define(t, e);
    };
}

const getAllPatternDefinitions = t => ws.get(t) ?? e.emptyArray;

const ws = new WeakMap;

const ys = u({
    name: e.getResourceKeyFor("attribute-pattern"),
    define(t, s) {
        ws.set(s, t);
        return e.Registrable.define(s, (t => {
            z(vs, s).register(t);
        }));
    },
    getPatternDefinitions: getAllPatternDefinitions,
    findAll: t => t.root.getAll(vs)
});

class DotSeparatedAttributePattern {
    "PART.PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], s[1]);
    }
    "PART.PART.PART"(t, e, s) {
        return new AttrSyntax(t, e, `${s[0]}.${s[1]}`, s[2]);
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
}

ys.define([ {
    pattern: "ref",
    symbols: ""
}, {
    pattern: "PART.ref",
    symbols: "."
} ], RefAttributePattern);

class EventAttributePattern {
    "PART.trigger:PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "trigger", s);
    }
    "PART.capture:PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "capture", s);
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
    ":PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "bind");
    }
}

ys.define([ {
    pattern: ":PART",
    symbols: ":"
} ], ColonPrefixedBindAttributePattern);

class AtPrefixedTriggerAttributePattern {
    "@PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "trigger");
    }
    "@PART:PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "trigger", [ s[0], "trigger", ...s.slice(1) ]);
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
    "...$attrs"(t, e, s) {
        return new AttrSyntax(t, e, "", "...$attrs");
    }
}

ys.define([ {
    pattern: "...$attrs",
    symbols: ""
} ], SpreadAttributePattern);

function bindingCommand(t) {
    return function(e, s) {
        s.addInitializer((function() {
            As.define(t, e);
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

const Cs = "binding-command";

const ks = /*@__PURE__*/ e.getResourceKeyFor(Cs);

const getCommandKeyFrom = t => `${ks}:${t}`;

const getCommandAnnotation = (t, e) => F($(e), t);

const As = u({
    name: ks,
    keyFrom: getCommandKeyFrom,
    define(t, s) {
        const i = BindingCommandDefinition.create(t, s);
        const n = i.Type;
        O(i, n, ks, e.resourceBaseName);
        return n;
    },
    getAnnotation: getCommandAnnotation,
    find(t, e) {
        const s = t.find(Cs, e);
        return s == null ? null : F(ks, s) ?? getDefinitionFromStaticAu(s, Cs, BindingCommandDefinition.create) ?? null;
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
    type: Cs,
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
    type: Cs,
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
    type: Cs,
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
    type: Cs,
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
    type: Cs,
    name: "bind"
};

class ForBindingCommand {
    constructor() {
        this.Oe = e.resolve(bs);
    }
    get ignoreAttr() {
        return false;
    }
    build(t, s) {
        const i = t.bindable === null ? e.camelCase(t.attr.target) : t.bindable.name;
        const n = s.parse(t.attr.rawValue, b);
        let r = e.emptyArray;
        if (n.semiIdx > -1) {
            const e = t.attr.rawValue.slice(n.semiIdx + 1);
            const s = e.indexOf(":");
            if (s > -1) {
                const t = e.slice(0, s).trim();
                const i = e.slice(s + 1).trim();
                const n = this.Oe.parse(t, i);
                r = [ new MultiAttrInstruction(i, n.target, n.command) ];
            }
        }
        return new IteratorBindingInstruction(n, i, r);
    }
}

ForBindingCommand.$au = {
    type: Cs,
    name: "for"
};

class TriggerBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, w), t.attr.target, false, t.attr.parts?.[2] ?? null);
    }
}

TriggerBindingCommand.$au = {
    type: Cs,
    name: "trigger"
};

class CaptureBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, w), t.attr.target, true, t.attr.parts?.[2] ?? null);
    }
}

CaptureBindingCommand.$au = {
    type: Cs,
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
    type: Cs,
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
    type: Cs,
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
    type: Cs,
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
    type: Cs,
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
    type: Cs,
    name: "...$attrs"
};

const Bs = /*@__PURE__*/ U("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

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
        t.register(z(this, this), G(this, Bs));
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
        this.$e = o("a altGlyph animate animateColor circle clipPath defs ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feFlood feGaussianBlur feImage feMerge feMorphology feOffset feSpecularLighting feTile feTurbulence filter font foreignObject g glyph glyphRef image line linearGradient marker mask missing-glyph path pattern polygon polyline radialGradient rect stop svg switch symbol text textPath tref tspan use");
        this.Ne = o("alignment-baseline baseline-shift clip-path clip-rule clip color-interpolation-filters color-interpolation color-profile color-rendering color cursor direction display dominant-baseline enable-background fill-opacity fill-rule fill filter flood-color flood-opacity font-family font-size-adjust font-size font-stretch font-style font-variant font-weight glyph-orientation-horizontal glyph-orientation-vertical image-rendering kerning letter-spacing lighting-color marker-end marker-mid marker-start mask opacity overflow pointer-events shape-rendering stop-color stop-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width stroke text-anchor text-decoration text-rendering unicode-bidi visibility word-spacing writing-mode");
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
        return this.$e[t.nodeName] === true && this.Ne[e] === true || this.Ve[t.nodeName]?.[e] === true;
    }
}

const Ss = /*@__PURE__*/ U("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    constructor() {
        this.fns = [];
        this.je = createLookup();
        this.We = createLookup();
        this.svg = e.resolve(Bs);
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

const Rs = createLookup();

class AttributeNSAccessor {
    static forNs(t) {
        return Rs[t] ??= new AttributeNSAccessor(t);
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

mixinNoopSubscribable(AttributeNSAccessor);

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

mixinNoopSubscribable(DataAttributeAccessor);

const Ts = new DataAttributeAccessor;

const Es = {
    childList: true,
    subtree: true,
    characterData: true
};

function defaultMatcher$1(t, e) {
    return t === e;
}

class SelectValueObserver {
    constructor(t, e, s, i) {
        this.type = B | A | S;
        this.v = void 0;
        this.ov = void 0;
        this.Ue = false;
        this.ze = void 0;
        this.Ge = void 0;
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
        this.Ue = t !== this.ov;
        this.Ke(t instanceof Array ? t : null);
        this.bt();
    }
    bt() {
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
        const s = isArray(t);
        const i = e.matcher ?? defaultMatcher$1;
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
            const l = t.matcher || defaultMatcher$1;
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
        (this.Ge = createMutationObserver(this.ut, this.Xe.bind(this))).observe(this.ut, Es);
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
        Is = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Is);
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
            e[e.length] = c.call(n, "model") ? n.model : n.value;
        }
        ++i;
    }
    return e;
}

let Is = void 0;

const Ps = "--";

class StyleAttributeAccessor {
    constructor(t) {
        this.obj = t;
        this.type = B | S;
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
        this.bt();
    }
    Ye(t) {
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
    Ze(t) {
        let s;
        let i;
        const n = [];
        for (i in t) {
            s = t[i];
            if (s == null) {
                continue;
            }
            if (isString(s)) {
                if (i.startsWith(Ps)) {
                    n.push([ i, s ]);
                    continue;
                }
                n.push([ e.kebabCase(i), s ]);
                continue;
            }
            n.push(...this.Je(s));
        }
        return n;
    }
    ts(t) {
        const s = t.length;
        if (s > 0) {
            const e = [];
            let i = 0;
            for (;s > i; ++i) {
                e.push(...this.Je(t[i]));
            }
            return e;
        }
        return e.emptyArray;
    }
    Je(t) {
        if (isString(t)) {
            return this.Ye(t);
        }
        if (t instanceof Array) {
            return this.ts(t);
        }
        if (t instanceof Object) {
            return this.Ze(t);
        }
        return e.emptyArray;
    }
    bt() {
        if (this.Ue) {
            this.Ue = false;
            const t = this.v;
            const e = this.styles;
            const s = this.Je(t);
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

mixinNoopSubscribable(StyleAttributeAccessor);

class ValueAttributeObserver {
    constructor(t, e, s) {
        this.type = B | A | S;
        this.v = "";
        this.ov = "";
        this.Ue = false;
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
        this.Ue = true;
        if (!this.cf.readonly) {
            this.bt();
        }
    }
    bt() {
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
        Ls = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Ls);
    }
}

mixinNodeObserverUseConfig(ValueAttributeObserver);

s.subscriberCollection(ValueAttributeObserver);

let Ls = void 0;

const Ds = "http://www.w3.org/1999/xlink";

const Ms = "http://www.w3.org/XML/1998/namespace";

const _s = "http://www.w3.org/2000/xmlns/";

const qs = f(createLookup(), {
    "xlink:actuate": [ "actuate", Ds ],
    "xlink:arcrole": [ "arcrole", Ds ],
    "xlink:href": [ "href", Ds ],
    "xlink:role": [ "role", Ds ],
    "xlink:show": [ "show", Ds ],
    "xlink:title": [ "title", Ds ],
    "xlink:type": [ "type", Ds ],
    "xml:lang": [ "lang", Ms ],
    "xml:space": [ "space", Ms ],
    xmlns: [ "xmlns", _s ],
    "xmlns:xlink": [ "xlink", _s ]
});

const Fs = new s.PropertyAccessor;

Fs.type = B | S;

class NodeObserverLocator {
    static register(t) {
        t.register(z(this, this), G(this, s.INodeObserverLocator));
    }
    constructor() {
        this.allowDirtyCheck = true;
        this.es = createLookup();
        this.ss = createLookup();
        this.rs = createLookup();
        this.os = createLookup();
        this.ls = e.resolve(e.IServiceLocator);
        this.p = e.resolve(ht);
        this.cs = e.resolve(s.IDirtyChecker);
        this.svg = e.resolve(Bs);
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
        const i = this.es;
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
        const s = this.ss;
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
        if (s in this.os || s in (this.rs[t.tagName] ?? e.emptyObject)) {
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
            return Ts;

          default:
            {
                const e = qs[s];
                if (e !== undefined) {
                    return AttributeNSAccessor.forNs(e[1]);
                }
                if (isDataAttribute(t, s, this.svg)) {
                    return Ts;
                }
                return Fs;
            }
        }
    }
    overrideAccessor(t, e) {
        let s;
        if (isString(t)) {
            s = this.rs[t] ??= createLookup();
            s[e] = true;
        } else {
            for (const e in t) {
                for (const i of t[e]) {
                    s = this.rs[e] ??= createLookup();
                    s[i] = true;
                }
            }
        }
    }
    overrideAccessorGlobal(...t) {
        for (const e of t) {
            this.os[e] = true;
        }
    }
    getNodeObserverConfig(t, e) {
        return this.es[t.tagName]?.[e] ?? this.ss[e];
    }
    getNodeObserver(t, e, i) {
        const n = this.es[t.tagName]?.[e] ?? this.ss[e];
        let r;
        if (n != null) {
            r = new (n.type ?? ValueAttributeObserver)(t, e, n, i, this.ls);
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
        const r = qs[e];
        if (r !== undefined) {
            return AttributeNSAccessor.forNs(r[1]);
        }
        if (isDataAttribute(t, e, this.svg)) {
            return Ts;
        }
        if (e in t.constructor.prototype) {
            if (this.allowDirtyCheck) {
                return this.cs.createProperty(t, e);
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
        this.us = void 0;
        this.ds = void 0;
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
        this.ps();
        this.gs();
        this.Qe();
    }
    handleCollectionChange() {
        this.gs();
    }
    handleChange(t, e) {
        this.gs();
    }
    gs() {
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
        this.Qe();
    }
    dt() {
        this.ps();
    }
    gt() {
        this.us?.unsubscribe(this);
        this.ds?.unsubscribe(this);
        this.us = this.ds = void 0;
    }
    Qe() {
        Hs = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Hs);
    }
    ps() {
        const t = this.ut;
        (this.ds ??= t.$observers?.model ?? t.$observers?.value)?.subscribe(this);
        this.us?.unsubscribe(this);
        this.us = void 0;
        if (t.type === "checkbox") {
            (this.us = getCollectionObserver(this.v, this.oL))?.subscribe(this);
        }
    }
}

mixinNodeObserverUseConfig(CheckedObserver);

s.subscriberCollection(CheckedObserver);

let Hs = void 0;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) {
            throw createMappedError(9994, e);
        }
        e.useTargetObserver(Ts);
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
        this.xs = e.resolve(s.INodeObserverLocator);
    }
    bind(t, e, ...s) {
        if (!(this.xs instanceof NodeObserverLocator)) {
            throw createMappedError(9993);
        }
        if (s.length === 0) {
            throw createMappedError(802);
        }
        if (!(e instanceof PropertyBinding) || !(e.mode & D)) {
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
        this.bs = false;
        this.ws = 0;
        this.ys = e.resolve(Lt);
        this.l = e.resolve(es);
    }
    attaching(t, e) {
        return this.Cs(this.value);
    }
    detaching(t, s) {
        this.bs = true;
        return e.onResolve(this.pending, (() => {
            this.bs = false;
            this.pending = void 0;
            void this.view?.deactivate(t, this.$controller);
        }));
    }
    valueChanged(t, e) {
        if (!this.$controller.isActive) return;
        t = !!t;
        e = !!e;
        if (t !== e) return this.Cs(t);
    }
    Cs(t) {
        const s = this.view;
        const i = this.$controller;
        const n = this.ws++;
        const isCurrent = () => !this.bs && this.ws === n + 1;
        let r;
        return e.onResolve(this.pending, (() => this.pending = e.onResolve(s?.deactivate(s, i), (() => {
            if (!isCurrent()) {
                return;
            }
            if (t) {
                r = this.view = this.ifView = this.cache && this.ifView != null ? this.ifView : this.ys.create();
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

const Os = [ "BindingBehavior", "ValueConverter" ];

class Repeat {
    constructor(t, e, s, i, n) {
        this.views = [];
        this.ks = [];
        this.key = null;
        this.As = new Map;
        this.Bs = new Map;
        this.Ss = void 0;
        this.Rs = false;
        this.Ts = false;
        this.Es = null;
        this.Is = void 0;
        this.Ps = false;
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
        this.Ls = i;
        this.f = n;
    }
    binding(t, e) {
        const s = this.Ls.bindings;
        const i = s.length;
        let n = void 0;
        let r;
        let l = 0;
        for (;i > l; ++l) {
            n = s[l];
            if (n.target === this && n.targetProperty === "items") {
                r = this.forOf = n.ast;
                this.Ds = n;
                let t = r.iterable;
                while (t != null && Os.includes(t.$kind)) {
                    t = t.expression;
                    this.Rs = true;
                }
                this.Es = t;
                break;
            }
        }
        this.Ms();
        const a = r.declaration;
        if (!(this.Ps = a.$kind === "ArrayDestructuring" || a.$kind === "ObjectDestructuring")) {
            this.local = T(a, this.$controller.scope, n, null);
        }
    }
    attaching(t, e) {
        this._s();
        return this.qs(t);
    }
    detaching(t, e) {
        this.Ms();
        return this.Fs(t);
    }
    unbinding(t, e) {
        this.Bs.clear();
        this.As.clear();
    }
    itemsChanged() {
        if (!this.$controller.isActive) {
            return;
        }
        this.Ms();
        this._s();
        this.Hs(this.items, void 0);
    }
    handleCollectionChange(t, e) {
        const s = this.$controller;
        if (!s.isActive) {
            return;
        }
        if (this.Rs) {
            if (this.Ts) {
                return;
            }
            this.Ts = true;
            this.items = T(this.forOf.iterable, s.scope, this.Ds, null);
            this.Ts = false;
            return;
        }
        this._s();
        this.Hs(t, e);
    }
    Hs(t, i) {
        const n = this.views;
        this.ks = n.slice();
        const r = n.length;
        const l = this.key;
        const a = l !== null;
        if (a || i === void 0) {
            const t = this.local;
            const e = this.Is;
            const h = e.length;
            const c = this.forOf;
            const u = c.declaration;
            const f = this.Ds;
            const d = this.Ps;
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
                let m;
                let g;
                let x;
                let v;
                let b = 0;
                const w = r - 1;
                const y = h - 1;
                const C = new Map;
                const k = new Map;
                const A = this.As;
                const B = this.Bs;
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
                            m = s[b];
                            g = e[b];
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
                        --b;
                        if (p > b) {
                            break t;
                        }
                    }
                }
                const R = p;
                const E = p;
                for (p = E; p <= y; ++p) {
                    if (A.has(g = a ? e[p] : ensureUnique(e[p], p))) {
                        v = A.get(g);
                    } else {
                        v = a ? getKeyValue(A, l, g, getScope(B, g, c, S, f, t, d), f) : g;
                        A.set(g, v);
                    }
                    k.set(v, p);
                }
                for (p = R; p <= w; ++p) {
                    if (A.has(m = a ? s[p] : ensureUnique(s[p], p))) {
                        x = A.get(m);
                    } else {
                        x = a ? getKeyValue(A, l, m, n[p].scope, f) : m;
                    }
                    C.set(x, p);
                    if (k.has(x)) {
                        i[k.get(x)] = p;
                    } else {
                        i.deletedIndices.push(p);
                        i.deletedItems.push(m);
                    }
                }
                for (p = E; p <= y; ++p) {
                    if (!C.has(A.get(a ? e[p] : ensureUnique(e[p], p)))) {
                        i[p] = -2;
                    }
                }
                C.clear();
                k.clear();
            }
        }
        if (i === void 0) {
            const t = e.onResolve(this.Fs(null), (() => this.qs(null)));
            if (isPromise(t)) {
                t.catch(rethrow);
            }
        } else {
            if (i.deletedIndices.length > 0) {
                const t = e.onResolve(this.Os(i), (() => this.Vs(r, i)));
                if (isPromise(t)) {
                    t.catch(rethrow);
                }
            } else {
                this.Vs(r, i);
            }
        }
    }
    Ms() {
        const t = this.$controller.scope;
        let e = this.$s;
        let i = this.Rs;
        let n;
        if (i) {
            e = this.$s = T(this.Es, t, this.Ds, null) ?? null;
            i = this.Rs = !g(this.items, e);
        }
        const r = this.Ss;
        if (this.$controller.isActive) {
            n = this.Ss = s.getCollectionObserver(i ? e : this.items);
            if (r !== n) {
                r?.unsubscribe(this);
                n?.subscribe(this);
            }
        } else {
            r?.unsubscribe(this);
            this.Ss = undefined;
        }
    }
    _s() {
        const {items: t} = this;
        if (isArray(t)) {
            this.Is = t;
            return;
        }
        const e = [];
        iterate(t, ((t, s) => {
            e[s] = t;
        }));
        this.Is = e;
    }
    qs(t) {
        let e = void 0;
        let s;
        let i;
        let n;
        const {$controller: r, f: l, local: a, l: h, items: c, Bs: u, Ds: f, forOf: d, Ps: p} = this;
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
    Fs(t) {
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
    Os(t) {
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
    Vs(t, e) {
        let s = void 0;
        let i;
        let n;
        let r;
        let l = 0;
        const {$controller: a, f: h, local: c, Is: u, l: f, views: d, Ps: p, Ds: m, Bs: g, ks: x, forOf: v} = this;
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
        let C = 0;
        l = 0;
        for (;l < e.length; ++l) {
            if ((C = e[l]) !== -2) {
                d[l] = x[C];
            }
        }
        const k = longestIncreasingSubsequence(e);
        const A = k.length;
        const B = v.declaration;
        let S;
        let T = A - 1;
        l = y - 1;
        for (;l >= 0; --l) {
            n = d[l];
            S = d[l + 1];
            n.nodes.link(S?.nodes ?? f);
            if (e[l] === -2) {
                r = getScope(g, u[l], v, w, m, c, p);
                setContextualProperties(r.overrideContext, l, y);
                n.setLocation(f);
                i = n.activate(n, a, r);
                if (isPromise(i)) {
                    (s ?? (s = [])).push(i);
                }
            } else if (T < 0 || A === 1 || l !== k[T]) {
                if (p) {
                    R(B, n.scope, m, u[l]);
                } else {
                    n.scope.bindingContext[c] = u[l];
                }
                setContextualProperties(n.scope.overrideContext, l, y);
                n.nodes.insertBefore(n.location);
            } else {
                if (p) {
                    R(B, n.scope, m, u[l]);
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
    type: ut,
    name: "repeat",
    isTemplateController: true,
    bindables: [ "items" ]
};

Repeat.inject = [ le, t.IExpressionParser, es, Ke, Lt ];

let Vs = 16;

let $s = new Int32Array(Vs);

let Ns = new Int32Array(Vs);

function longestIncreasingSubsequence(t) {
    const e = t.length;
    if (e > Vs) {
        Vs = e;
        $s = new Int32Array(e);
        Ns = new Int32Array(e);
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
                Ns[r] = l;
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
                    Ns[r] = $s[a - 1];
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
        i = Ns[i];
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

const js = h.toString;

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

const getScope = (t, e, i, n, r, l, a) => {
    let h = t.get(e);
    if (h === void 0) {
        if (a) {
            R(i.declaration, h = s.Scope.fromParent(n, new s.BindingContext), r, e);
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
        this.view = e.resolve(Lt).create().setLocation(e.resolve(es));
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
        this.l = e.resolve(es);
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
        this.queue((() => this.Ns(t)));
    }
    Ns(t) {
        const s = t.isMatch(this.value);
        const i = this.activeCases;
        const n = i.length;
        if (!s) {
            if (n > 0 && i[0].id === t.id) {
                return this.js(null);
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
        return e.onResolve(this.js(null, r), (() => {
            this.activeCases = r;
            return this.Ws(null);
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
        return e.onResolve(this.activeCases.length > 0 ? this.js(t, i) : void 0, (() => {
            this.activeCases = i;
            if (i.length === 0) {
                return;
            }
            return this.Ws(t);
        }));
    }
    Ws(t) {
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
    js(t, s = []) {
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

let Ws = 0;

class Case {
    constructor() {
        this.id = ++Ws;
        this.fallThrough = false;
        this.view = void 0;
        this.f = e.resolve(Lt);
        this.ls = e.resolve(s.IObserverLocator);
        this.l = e.resolve(es);
        this.Us = e.resolve(e.ILogger).scopeTo(`${this.constructor.name}-#${this.id}`);
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
        this.Us.debug("isMatch()");
        const e = this.value;
        if (isArray(e)) {
            if (this.Ss === void 0) {
                this.Ss = this.zs(e);
            }
            return e.includes(t);
        }
        return e === t;
    }
    valueChanged(t, e) {
        if (isArray(t)) {
            this.Ss?.unsubscribe(this);
            this.Ss = this.zs(t);
        } else if (this.Ss !== void 0) {
            this.Ss.unsubscribe(this);
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
        this.Ss?.unsubscribe(this);
        this.view?.dispose();
        this.view = void 0;
    }
    linkToSwitch(t) {
        t.cases.push(this);
    }
    zs(t) {
        const e = this.ls.getArrayObserver(t);
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

const Us = [ "value", {
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
    bindables: Us,
    isTemplateController: true
}, DefaultCase);

defineAttribute({
    name: "case",
    bindables: Us,
    isTemplateController: true
}, Case);

class PromiseTemplateController {
    constructor() {
        this.preSettledTask = null;
        this.postSettledTask = null;
        this.f = e.resolve(Lt);
        this.l = e.resolve(es);
        this.p = e.resolve(ht);
        this.logger = e.resolve(e.ILogger).scopeTo("promise.resolve");
    }
    link(t, e, s, i) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(t, i) {
        const n = this.view;
        const r = this.$controller;
        return e.onResolve(n.activate(t, r, this.viewScope = s.Scope.fromParent(r.scope, {})), (() => this.swap(t)));
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
                if (this.preSettledTask.status === k) {
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
        this.l = e.resolve(es);
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
        this.l = e.resolve(es);
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
        this.l = e.resolve(es);
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
        this.Gs = false;
        this.Ks = e.resolve(Je);
        this.p = e.resolve(ht);
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) {
            this.Xs();
        } else {
            this.Gs = true;
        }
    }
    attached() {
        if (this.Gs) {
            this.Gs = false;
            this.Xs();
        }
        this.Ks.addEventListener("focus", this);
        this.Ks.addEventListener("blur", this);
    }
    detaching() {
        const t = this.Ks;
        t.removeEventListener("focus", this);
        t.removeEventListener("blur", this);
    }
    handleEvent(t) {
        if (t.type === "focus") {
            this.value = true;
        } else if (!this.Qs) {
            this.value = false;
        }
    }
    Xs() {
        const t = this.Ks;
        const e = this.Qs;
        const s = this.value;
        if (s && !e) {
            t.focus();
        } else if (!s && e) {
            t.blur();
        }
    }
    get Qs() {
        return this.Ks === this.p.document.activeElement;
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
        const s = e.resolve(es);
        const i = e.resolve(ht);
        this.p = i;
        this.Ys = i.document.createElement("div");
        (this.view = t.create()).setLocation(this.Zs = createLocation(i));
        setEffectiveParentNode(this.view.nodes, s);
    }
    attaching(t) {
        if (this.callbackContext == null) {
            this.callbackContext = this.$controller.scope.bindingContext;
        }
        const e = this.Ys = this.Js();
        this.ti(e, this.position);
        return this.ei(t, e);
    }
    detaching(t) {
        return this.si(t, this.Ys);
    }
    targetChanged() {
        const {$controller: t} = this;
        if (!t.isActive) {
            return;
        }
        const s = this.Js();
        if (this.Ys === s) {
            return;
        }
        this.Ys = s;
        const i = e.onResolve(this.si(null, s), (() => {
            this.ti(s, this.position);
            return this.ei(null, s);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    positionChanged() {
        const {$controller: t, Ys: s} = this;
        if (!t.isActive) {
            return;
        }
        const i = e.onResolve(this.si(null, s), (() => {
            this.ti(s, this.position);
            return this.ei(null, s);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    ei(t, s) {
        const {activating: i, callbackContext: n, view: r} = this;
        return e.onResolve(i?.call(n, s, r), (() => this.ii(t, s)));
    }
    ii(t, s) {
        const {$controller: i, view: n} = this;
        if (t === null) {
            n.nodes.insertBefore(this.Zs);
        } else {
            return e.onResolve(n.activate(t ?? n, i, i.scope), (() => this.ni(s)));
        }
        return this.ni(s);
    }
    ni(t) {
        const {activated: e, callbackContext: s, view: i} = this;
        return e?.call(s, t, i);
    }
    si(t, s) {
        const {deactivating: i, callbackContext: n, view: r} = this;
        return e.onResolve(i?.call(n, s, r), (() => this.ri(t, s)));
    }
    ri(t, s) {
        const {$controller: i, view: n} = this;
        if (t === null) {
            n.nodes.remove();
        } else {
            return e.onResolve(n.deactivate(t, i), (() => this.oi(s)));
        }
        return this.oi(s);
    }
    oi(t) {
        const {deactivated: s, callbackContext: i, view: n} = this;
        return e.onResolve(s?.call(i, t, n), (() => this.li()));
    }
    Js() {
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
    li() {
        this.Zs.remove();
        this.Zs.$start.remove();
    }
    ti(t, e) {
        const s = this.Zs;
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

let zs;

class AuSlot {
    constructor() {
        this.ai = null;
        this.hi = null;
        this.Xt = false;
        this.expose = null;
        this.slotchange = null;
        this.ui = new Set;
        this.Ss = null;
        const t = e.resolve(Xe);
        const s = e.resolve(es);
        const i = e.resolve(le);
        const n = e.resolve(ve);
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
            c = n.getViewFactory(l ?? (zs ??= CustomElementDefinition.create({
                name: "au-slot-empty-template",
                template: "",
                needsCompile: false
            })), u);
            this.fi = false;
        } else {
            u = h.createChild();
            u.useResources(t.parent.controller.container);
            registerResolver(u, Xe, new e.InstanceProvider(void 0, t.parent));
            c = n.getViewFactory(a, u);
            this.fi = true;
            this.di = h.getAll(Ht, false)?.filter((t => t.slotName === "*" || t.slotName === r)) ?? e.emptyArray;
        }
        this.pi = (this.di ??= e.emptyArray).length > 0;
        this.mi = t;
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
        this.ui.add(t);
    }
    unsubscribe(t) {
        this.ui.delete(t);
    }
    binding(t, e) {
        this.ai = this.$controller.scope.parent;
        let i;
        if (this.fi) {
            i = this.mi.controller.scope.parent;
            (this.hi = s.Scope.fromParent(i, i.bindingContext)).overrideContext.$host = this.expose ?? this.ai.bindingContext;
        }
    }
    attaching(t, s) {
        return e.onResolve(this.view.activate(t, this.$controller, this.fi ? this.hi : this.ai), (() => {
            if (this.pi) {
                this.di.forEach((t => t.watch(this)));
                this.ps();
                this.gi();
                this.Xt = true;
            }
        }));
    }
    detaching(t, e) {
        this.Xt = false;
        this.xi();
        this.di.forEach((t => t.unwatch(this)));
        return this.view.deactivate(t, this.$controller);
    }
    exposeChanged(t) {
        if (this.fi && this.hi != null) {
            this.hi.overrideContext.$host = t;
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
    ps() {
        if (this.Ss != null) {
            return;
        }
        const t = this.l;
        const e = t.parentElement;
        if (e == null) {
            return;
        }
        (this.Ss = createMutationObserver(e, (e => {
            if (isMutationWithinLocation(t, e)) {
                this.gi();
            }
        }))).observe(e, {
            childList: true
        });
    }
    xi() {
        this.Ss?.disconnect();
        this.Ss = null;
    }
    gi() {
        const t = this.nodes;
        const e = new Set(this.ui);
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
    type: hs,
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
        this.vi = void 0;
        this.tag = null;
        this.c = e.resolve(e.IContainer);
        this.parent = e.resolve(Ke);
        this.bi = e.resolve(Je);
        this.l = e.resolve(es);
        this.p = e.resolve(ht);
        this.r = e.resolve(ve);
        this.wi = e.resolve(le);
        this.yi = e.resolve(e.transient(CompositionContextFactory, null));
        this.st = e.resolve(ae);
        this.J = e.resolve(Xe);
        this.ep = e.resolve(t.IExpressionParser);
        this.oL = e.resolve(s.IObserverLocator);
    }
    get composing() {
        return this.Ci;
    }
    get composition() {
        return this.vi;
    }
    attaching(t, s) {
        return this.Ci = e.onResolve(this.queue(new ChangeInfo(this.template, this.component, this.model, void 0), t), (t => {
            if (this.yi.ki(t)) {
                this.Ci = void 0;
            }
        }));
    }
    detaching(t) {
        const s = this.vi;
        const i = this.Ci;
        this.yi.invalidate();
        this.vi = this.Ci = void 0;
        return e.onResolve(i, (() => s?.deactivate(t)));
    }
    propertyChanged(t) {
        if (t === "composing" || t === "composition") return;
        if (t === "model" && this.vi != null) {
            this.vi.update(this.model);
            return;
        }
        if (t === "tag" && this.vi?.controller.vmKind === Fe) {
            return;
        }
        this.Ci = e.onResolve(this.Ci, (() => e.onResolve(this.queue(new ChangeInfo(this.template, this.component, this.model, t), void 0), (t => {
            if (this.yi.ki(t)) {
                this.Ci = void 0;
            }
        }))));
    }
    queue(t, s) {
        const i = this.yi;
        const n = this.vi;
        return e.onResolve(i.create(t), (t => {
            if (i.ki(t)) {
                return e.onResolve(this.compose(t), (r => {
                    if (i.ki(t)) {
                        return e.onResolve(r.activate(s), (() => {
                            if (i.ki(t)) {
                                this.vi = r;
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
        const {Ai: i, Bi: n, Si: r} = t.change;
        const {c: l, $controller: a, l: h, wi: c} = this;
        const u = this.Ri(this.J.controller.container, n);
        const f = l.createChild();
        const d = this.p.document.createElement(u == null ? this.tag ?? "div" : u.name);
        h.parentNode.insertBefore(d, h);
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
        const m = this.Ti(f, typeof n === "string" ? u.Type : n, d, p);
        const compose = () => {
            const n = c.captures ?? e.emptyArray;
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
                this.Ei(d, u, r).forEach((t => l.addBinding(t)));
                return new CompositionController(l, (t => l.activate(t ?? l, a, a.scope.parent)), (t => e.onResolve(l.deactivate(t ?? l, a), removeCompositionHost)), (t => m.activate?.(t)), t);
            } else {
                const r = CustomElementDefinition.create({
                    name: ds.generateName(),
                    template: i
                });
                const l = this.r.getViewFactory(r, f);
                const h = Controller.$view(l, a);
                const c = this.scopeBehavior === "auto" ? s.Scope.fromParent(this.parent.scope, m) : s.Scope.create(m);
                h.setHost(d);
                if (p == null) {
                    this.Ei(d, r, n).forEach((t => h.addBinding(t)));
                } else {
                    h.setLocation(p);
                }
                return new CompositionController(h, (t => h.activate(t ?? h, a, c)), (t => e.onResolve(h.deactivate(t ?? h, a), removeCompositionHost)), (t => m.activate?.(t)), t);
            }
        };
        if ("activate" in m) {
            return e.onResolve(m.activate(r), (() => compose()));
        } else {
            return compose();
        }
    }
    Ti(t, s, i, n) {
        if (s == null) {
            return new EmptyComponent;
        }
        if (typeof s === "object") {
            return s;
        }
        const r = this.p;
        registerHostNode(t, r, i);
        registerResolver(t, es, new e.InstanceProvider("IRenderLocation", n));
        const l = t.invoke(s);
        registerResolver(t, s, new e.InstanceProvider("au-compose.component", l));
        return l;
    }
    Ri(t, e) {
        if (typeof e === "string") {
            const s = ds.find(t, e);
            if (s == null) {
                throw createMappedError(806, e);
            }
            return s;
        }
        const s = isFunction(e) ? e : e?.constructor;
        return ds.isType(s, void 0) ? ds.getDefinition(s, null) : null;
    }
    Ei(t, e, s) {
        const i = new HydrationContext(this.$controller, {
            projections: null,
            captures: s
        }, this.J.parent);
        return SpreadBinding.create(i, t, e, this.r, this.st, this.p, this.ep, this.oL);
    }
}

AuCompose.$au = {
    type: hs,
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
    ki(t) {
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
        this.Ai = t;
        this.Bi = e;
        this.Si = s;
        this.Ii = i;
    }
    load() {
        if (isPromise(this.Ai) || isPromise(this.Bi)) {
            return Promise.all([ this.Ai, this.Bi ]).then((([t, e]) => new LoadedChangeInfo(t, e, this.Si, this.Ii)));
        } else {
            return new LoadedChangeInfo(this.Ai, this.Bi, this.Si, this.Ii);
        }
    }
}

class LoadedChangeInfo {
    constructor(t, e, s, i) {
        this.Ai = t;
        this.Bi = e;
        this.Si = s;
        this.Ii = i;
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

const Gs = /*@__PURE__*/ U("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw createMappedError(99, "sanitize");
    }
})));

class SanitizeValueConverter {
    constructor() {
        this.Pi = e.resolve(Gs);
    }
    toView(t) {
        if (t == null) {
            return null;
        }
        return this.Pi.sanitize(t);
    }
}

SanitizeValueConverter.$au = {
    type: gt,
    name: "sanitize"
};

const Ks = /*@__PURE__*/ U("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const Xs = {};

class TemplateElementFactory {
    constructor() {
        this.p = e.resolve(ht);
        this.Ai = this.t();
    }
    t() {
        return this.p.document.createElement("template");
    }
    createTemplate(t) {
        if (isString(t)) {
            let e = Xs[t];
            if (e === void 0) {
                const s = this.Ai;
                s.innerHTML = t;
                const i = s.content.firstElementChild;
                if (needsWrapping(i)) {
                    this.Ai = this.t();
                    e = s;
                } else {
                    s.content.removeChild(i);
                    e = i;
                }
                Xs[t] = e;
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
        this.Li = e.resolve(ni);
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
        i ??= Js;
        const n = new CompilationContext(t, s, i, null, null, void 0);
        const r = isString(t.template) || !t.enhance ? n.Di.createTemplate(t.template) : t.template;
        const l = r.nodeName === Qs && r.content != null;
        const a = l ? r.content : r;
        const h = hi.findAll(s);
        const c = h.length;
        let u = 0;
        if (c > 0) {
            while (c > u) {
                h[u].compiling?.(r);
                ++u;
            }
        }
        if (r.hasAttribute(li)) {
            throw createMappedError(701, t);
        }
        this.Mi(a, n);
        this._i(a, n);
        const f = CustomElementDefinition.create({
            ...t,
            name: t.name || us(),
            dependencies: (t.dependencies ?? e.emptyArray).concat(n.deps ?? e.emptyArray),
            instructions: n.rows,
            surrogates: l ? this.qi(r, n) : e.emptyArray,
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
        const l = new CompilationContext(t, i, Js, null, null, void 0);
        const a = [];
        const h = r ?? l.Fi(n.nodeName.toLowerCase());
        const c = h !== null;
        const u = l.ep;
        const f = s.length;
        let d = 0;
        let p;
        let m = null;
        let g;
        let x;
        let b;
        let w;
        let y;
        let C = null;
        let k;
        let A;
        let B;
        let S;
        for (;f > d; ++d) {
            p = s[d];
            B = p.target;
            S = p.rawValue;
            C = l.Hi(p);
            if (C !== null && C.ignoreAttr) {
                ei.node = n;
                ei.attr = p;
                ei.bindable = null;
                ei.def = null;
                a.push(C.build(ei, l.ep, l.m));
                continue;
            }
            m = l.Oi(B);
            if (m !== null) {
                if (m.isTemplateController) {
                    throw createMappedError(9998, B);
                }
                b = this.Li.get(m);
                A = m.noMultiBindings === false && C === null && hasInlineBindings(S);
                if (A) {
                    x = this.Vi(n, S, m, l);
                } else {
                    y = b.primary;
                    if (C === null) {
                        k = u.parse(S, v);
                        x = [ k === null ? new SetPropertyInstruction(S, y.name) : new InterpolationInstruction(k, y.name) ];
                    } else {
                        ei.node = n;
                        ei.attr = p;
                        ei.bindable = y;
                        ei.def = m;
                        x = [ C.build(ei, l.ep, l.m) ];
                    }
                }
                (g ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? m : m.name, m.aliases != null && m.aliases.includes(B) ? B : void 0, x));
                continue;
            }
            if (C === null) {
                k = u.parse(S, v);
                if (c) {
                    b = this.Li.get(h);
                    w = b.attrs[B];
                    if (w !== void 0) {
                        k = u.parse(S, v);
                        a.push(new SpreadElementPropBindingInstruction(k == null ? new SetPropertyInstruction(S, w.name) : new InterpolationInstruction(k, w.name)));
                        continue;
                    }
                }
                if (k != null) {
                    a.push(new InterpolationInstruction(k, l.m.map(n, B) ?? e.camelCase(B)));
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
                    b = this.Li.get(h);
                    w = b.attrs[B];
                    if (w !== void 0) {
                        ei.node = n;
                        ei.attr = p;
                        ei.bindable = w;
                        ei.def = h;
                        a.push(new SpreadElementPropBindingInstruction(C.build(ei, l.ep, l.m)));
                        continue;
                    }
                }
                ei.node = n;
                ei.attr = p;
                ei.bindable = null;
                ei.def = null;
                a.push(C.build(ei, l.ep, l.m));
            }
        }
        resetCommandBuildInfo();
        if (g != null) {
            return g.concat(a);
        }
        return a;
    }
    qi(t, s) {
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
        let b = null;
        let w;
        let y;
        let C;
        let k;
        for (;l > a; ++a) {
            h = n[a];
            c = h.name;
            u = h.value;
            f = s.Oe.parse(c, u);
            C = f.target;
            k = f.rawValue;
            if (si[C]) {
                throw createMappedError(702, c);
            }
            b = s.Hi(f);
            if (b !== null && b.ignoreAttr) {
                ei.node = t;
                ei.attr = f;
                ei.bindable = null;
                ei.def = null;
                i.push(b.build(ei, s.ep, s.m));
                continue;
            }
            d = s.Oi(C);
            if (d !== null) {
                if (d.isTemplateController) {
                    throw createMappedError(703, C);
                }
                g = this.Li.get(d);
                y = d.noMultiBindings === false && b === null && hasInlineBindings(k);
                if (y) {
                    m = this.Vi(t, k, d, s);
                } else {
                    x = g.primary;
                    if (b === null) {
                        w = r.parse(k, v);
                        m = w === null ? k === "" ? [] : [ new SetPropertyInstruction(k, x.name) ] : [ new InterpolationInstruction(w, x.name) ];
                    } else {
                        ei.node = t;
                        ei.attr = f;
                        ei.bindable = x;
                        ei.def = d;
                        m = [ b.build(ei, s.ep, s.m) ];
                    }
                }
                t.removeAttribute(c);
                --a;
                --l;
                (p ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? d : d.name, d.aliases != null && d.aliases.includes(C) ? C : void 0, m));
                continue;
            }
            if (b === null) {
                w = r.parse(k, v);
                if (w != null) {
                    t.removeAttribute(c);
                    --a;
                    --l;
                    i.push(new InterpolationInstruction(w, s.m.map(t, C) ?? e.camelCase(C)));
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
                ei.node = t;
                ei.attr = f;
                ei.bindable = null;
                ei.def = null;
                i.push(b.build(ei, s.ep, s.m));
            }
        }
        resetCommandBuildInfo();
        if (p != null) {
            return p.concat(i);
        }
        return i;
    }
    _i(t, e) {
        switch (t.nodeType) {
          case 1:
            switch (t.nodeName) {
              case "LET":
                return this.$i(t, e);

              default:
                return this.Ni(t, e);
            }

          case 3:
            return this.ji(t, e);

          case 11:
            {
                let s = t.firstChild;
                while (s !== null) {
                    s = this._i(s, e);
                }
                break;
            }
        }
        return t.nextSibling;
    }
    $i(s, i) {
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
        let b;
        for (;r > c; ++c) {
            u = n[c];
            d = u.name;
            p = u.value;
            if (d === "to-binding-context") {
                h = true;
                continue;
            }
            f = i.Oe.parse(d, p);
            g = f.target;
            x = f.rawValue;
            m = i.Hi(f);
            if (m !== null) {
                if (f.command === "bind") {
                    l.push(new LetBindingInstruction(a.parse(x, y), e.camelCase(g)));
                } else {
                    throw createMappedError(704, f);
                }
                continue;
            }
            b = a.parse(x, v);
            l.push(new LetBindingInstruction(b === null ? new t.PrimitiveLiteralExpression(x) : b, e.camelCase(g)));
        }
        i.rows.push([ new HydrateLetElementInstruction(l, h) ]);
        return this.Wi(s, i).nextSibling;
    }
    Ni(t, s) {
        const i = t.nextSibling;
        const n = (t.getAttribute("as-element") ?? t.nodeName).toLowerCase();
        const r = s.Fi(n);
        const l = r !== null;
        const a = l && r.shadowOptions != null;
        const h = r?.capture;
        const c = h != null && typeof h !== "boolean";
        const u = h ? [] : e.emptyArray;
        const f = s.ep;
        const d = this.debug ? e.noop : () => {
            t.removeAttribute(w);
            --x;
            --g;
        };
        let p = t.attributes;
        let m;
        let g = p.length;
        let x = 0;
        let b;
        let w;
        let y;
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
        let L;
        let D;
        let M = null;
        let _;
        let q;
        let F;
        let H;
        let O = true;
        let V = false;
        let $ = false;
        let N = false;
        let j;
        if (n === "slot") {
            if (s.root.def.shadowOptions == null) {
                throw createMappedError(717, s.root.def.name);
            }
            s.root.hasSlot = true;
        }
        if (l) {
            j = {};
            O = r.processContent?.call(r.Type, t, s.p, j);
            p = t.attributes;
            g = p.length;
        }
        for (;g > x; ++x) {
            b = p[x];
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
            C = s.Oe.parse(w, y);
            M = s.Hi(C);
            F = C.target;
            H = C.rawValue;
            if (h && (!c || c && h(F))) {
                if (M != null && M.ignoreAttr) {
                    d();
                    u.push(C);
                    continue;
                }
                $ = F !== qt && F !== "slot";
                if ($) {
                    _ = this.Li.get(r);
                    if (_.attrs[F] == null && !s.Oi(F)?.isTemplateController) {
                        d();
                        u.push(C);
                        continue;
                    }
                }
            }
            if (M?.ignoreAttr) {
                ei.node = t;
                ei.attr = C;
                ei.bindable = null;
                ei.def = null;
                (k ??= []).push(M.build(ei, s.ep, s.m));
                d();
                continue;
            }
            if (l) {
                _ = this.Li.get(r);
                R = _.attrs[F];
                if (R !== void 0) {
                    if (M === null) {
                        L = f.parse(H, v);
                        (A ??= []).push(L == null ? new SetPropertyInstruction(H, R.name) : new InterpolationInstruction(L, R.name));
                    } else {
                        ei.node = t;
                        ei.attr = C;
                        ei.bindable = R;
                        ei.def = r;
                        (A ??= []).push(M.build(ei, s.ep, s.m));
                    }
                    d();
                    continue;
                }
            }
            B = s.Oi(F);
            if (B !== null) {
                _ = this.Li.get(B);
                S = B.noMultiBindings === false && M === null && hasInlineBindings(H);
                if (S) {
                    E = this.Vi(t, H, B, s);
                } else {
                    q = _.primary;
                    if (M === null) {
                        L = f.parse(H, v);
                        E = L === null ? H === "" ? [] : [ new SetPropertyInstruction(H, q.name) ] : [ new InterpolationInstruction(L, q.name) ];
                    } else {
                        ei.node = t;
                        ei.attr = C;
                        ei.bindable = q;
                        ei.def = B;
                        E = [ M.build(ei, s.ep, s.m) ];
                    }
                }
                d();
                if (B.isTemplateController) {
                    (I ??= []).push(new HydrateTemplateController(ti, this.resolveResources ? B : B.name, void 0, E));
                } else {
                    (T ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? B : B.name, B.aliases != null && B.aliases.includes(F) ? F : void 0, E));
                }
                continue;
            }
            if (M === null) {
                L = f.parse(H, v);
                if (L != null) {
                    d();
                    (k ??= []).push(new InterpolationInstruction(L, s.m.map(t, F) ?? e.camelCase(F)));
                }
                continue;
            }
            ei.node = t;
            ei.attr = C;
            ei.bindable = null;
            ei.def = null;
            (k ??= []).push(M.build(ei, s.ep, s.m));
            d();
        }
        resetCommandBuildInfo();
        if (this.Ui(t, k) && k != null && k.length > 1) {
            this.zi(t, k);
        }
        if (l) {
            D = new HydrateElementInstruction(this.resolveResources ? r : r.name, A ?? e.emptyArray, null, V, u, j);
        }
        if (k != null || D != null || T != null) {
            m = e.emptyArray.concat(D ?? e.emptyArray, T ?? e.emptyArray, k ?? e.emptyArray);
            N = true;
        }
        let W;
        if (I != null) {
            g = I.length - 1;
            x = g;
            P = I[x];
            let e;
            if (isMarker(t)) {
                e = s.t();
                appendManyToTemplate(e, [ s.ct(), s.Gi(Ys), s.Gi(Zs) ]);
            } else {
                this.Ki(t, s);
                if (t.nodeName === "TEMPLATE") {
                    e = t;
                } else {
                    e = s.t();
                    appendToTemplate(e, t);
                }
            }
            const i = e;
            const h = s.Xi(m == null ? [] : [ m ]);
            let c;
            let u;
            let f = false;
            let d;
            let p;
            let v;
            let b;
            let w;
            let y;
            let C = 0, k = 0;
            let A = t.firstChild;
            let B = false;
            if (O !== false) {
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
                    for (C = 0, k = v.length; k > C; ++C) {
                        b = v[C];
                        if (b.nodeName === "TEMPLATE") {
                            if (b.attributes.length > 0) {
                                appendToTemplate(e, b);
                            } else {
                                appendToTemplate(e, b.content);
                            }
                        } else {
                            appendToTemplate(e, b);
                        }
                    }
                    y = s.Xi();
                    this._i(e.content, y);
                    d[u] = CustomElementDefinition.create({
                        name: us(),
                        template: e,
                        instructions: y.rows,
                        needsCompile: false
                    });
                }
                D.projections = d;
            }
            if (N) {
                if (l && (V || r.containerless)) {
                    this.Ki(t, s);
                } else {
                    this.Wi(t, s);
                }
            }
            W = !l || !r.containerless && !V && O !== false;
            if (W) {
                if (t.nodeName === Qs) {
                    this._i(t.content, h);
                } else {
                    A = t.firstChild;
                    while (A !== null) {
                        A = this._i(A, h);
                    }
                }
            }
            P.def = CustomElementDefinition.create({
                name: us(),
                template: i,
                instructions: h.rows,
                needsCompile: false
            });
            while (x-- > 0) {
                P = I[x];
                e = s.t();
                w = s.ct();
                appendManyToTemplate(e, [ w, s.Gi(Ys), s.Gi(Zs) ]);
                P.def = CustomElementDefinition.create({
                    name: us(),
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
            let b = 0, w = 0;
            if (O !== false) {
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
                    for (b = 0, w = d.length; w > b; ++b) {
                        p = d[b];
                        if (p.nodeName === Qs) {
                            if (p.attributes.length > 0) {
                                appendToTemplate(g, p);
                            } else {
                                appendToTemplate(g, p.content);
                            }
                        } else {
                            appendToTemplate(g, p);
                        }
                    }
                    x = s.Xi();
                    this._i(g.content, x);
                    u[h] = CustomElementDefinition.create({
                        name: us(),
                        template: g,
                        instructions: x.rows,
                        needsCompile: false
                    });
                }
                D.projections = u;
            }
            if (N) {
                if (l && (V || r.containerless)) {
                    this.Ki(t, s);
                } else {
                    this.Wi(t, s);
                }
            }
            W = !l || !r.containerless && !V && O !== false;
            if (W && t.childNodes.length > 0) {
                e = t.firstChild;
                while (e !== null) {
                    e = this._i(e, s);
                }
            }
        }
        return i;
    }
    ji(t, e) {
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
                insertBefore(s, e.Qi(c), t);
            }
            for (a = 0, h = l.length; h > a; ++a) {
                insertManyBefore(s, t, [ e.ct(), e.Qi(" ") ]);
                if (c = r[a + 1]) {
                    insertBefore(s, e.Qi(c), t);
                }
                e.rows.push([ new TextBindingInstruction(l[a]) ]);
            }
            s.removeChild(t);
        }
        return n;
    }
    Vi(t, e, s, i) {
        const n = this.Li.get(s);
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
                d = i.Oe.parse(a, h);
                p = i.Hi(d);
                m = n.attrs[d.target];
                if (m == null) {
                    throw createMappedError(707, d.target, s.name);
                }
                if (p === null) {
                    f = i.ep.parse(h, v);
                    l.push(f === null ? new SetPropertyInstruction(h, m.name) : new InterpolationInstruction(f, m.name));
                } else {
                    ei.node = t;
                    ei.attr = d;
                    ei.bindable = m;
                    ei.def = s;
                    l.push(p.build(ei, i.ep, i.m));
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
    Mi(t, s) {
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
                const a = e.toArray(s.attributes).filter((t => !oi.includes(t.name)));
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
            s.Yi(defineElement({
                name: r,
                template: t,
                bindables: f
            }, LocalTemplateType));
            n.removeChild(t);
        }
    }
    Ui(t, e) {
        const s = t.nodeName;
        return s === "INPUT" && ii[t.type] === 1 || s === "SELECT" && (t.hasAttribute("multiple") || e?.some((t => t.type === zt && t.to === "multiple")));
    }
    zi(t, e) {
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
    Wi(t, e) {
        insertBefore(t.parentNode, e.Gi("au*"), t);
        return t;
    }
    Ki(t, e) {
        if (isMarker(t)) {
            return t;
        }
        const s = t.parentNode;
        const i = e.ct();
        insertManyBefore(s, t, [ i, e.Gi(Ys), e.Gi(Zs) ]);
        s.removeChild(t);
        return i;
    }
}

const Qs = "TEMPLATE";

const Ys = "au-start";

const Zs = "au-end";

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
        this.Zi = h ? r.Zi : i.get(ri);
        this.Di = h ? r.Di : i.get(Ks);
        this.Oe = h ? r.Oe : i.get(bs);
        this.ep = h ? r.ep : i.get(t.IExpressionParser);
        this.m = h ? r.m : i.get(Ss);
        this.Us = h ? r.Us : i.get(e.ILogger);
        this.p = h ? r.p : i.get(ht);
        this.localEls = h ? r.localEls : new Set;
        this.rows = a ?? [];
    }
    Yi(t) {
        (this.root.deps ??= []).push(t);
        this.root.c.register(t);
        return t;
    }
    Qi(t) {
        return createText(this.p, t);
    }
    Gi(t) {
        return createComment(this.p, t);
    }
    ct() {
        return this.Gi("au*");
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
    Fi(t) {
        return this.Zi.el(this.c, t);
    }
    Oi(t) {
        return this.Zi.attr(this.c, t);
    }
    Xi(t) {
        return new CompilationContext(this.def, this.c, this.ci, this, this.root, t);
    }
    Hi(t) {
        const e = t.command;
        if (e === null) {
            return null;
        }
        return this.Zi.command(this.c, e);
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
    ei.node = ei.attr = ei.bindable = ei.def = null;
};

const Js = {
    projections: null
};

const ti = {
    name: "unnamed"
};

const ei = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const si = f(createLookup(), {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
});

const ii = {
    checkbox: 1,
    radio: 1
};

const ni = /*@__PURE__*/ U("IBindablesInfoResolver", (t => {
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

const ri = /*@__PURE__*/ U("IResourceResolver", (t => t.singleton(ResourceResolver)));

class ResourceResolver {
    constructor() {
        this.Ji = new WeakMap;
        this.tn = new WeakMap;
    }
    el(t, e) {
        let s = this.Ji.get(t);
        if (s == null) {
            this.Ji.set(t, s = new RecordCache);
        }
        return e in s.element ? s.element[e] : s.element[e] = ds.find(t, e);
    }
    attr(t, e) {
        let s = this.Ji.get(t);
        if (s == null) {
            this.Ji.set(t, s = new RecordCache);
        }
        return e in s.attr ? s.attr[e] : s.attr[e] = dt.find(t, e);
    }
    command(t, e) {
        let s = this.tn.get(t);
        if (s == null) {
            this.tn.set(t, s = createLookup());
        }
        let i = s[e];
        if (i === void 0) {
            let n = this.Ji.get(t);
            if (n == null) {
                this.Ji.set(t, n = new RecordCache);
            }
            const r = e in n.command ? n.command[e] : n.command[e] = As.find(t, e);
            if (r == null) {
                throw createMappedError(713, e);
            }
            s[e] = i = As.get(t, e);
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

const oi = u([ "name", "attribute", "mode" ]);

const li = "as-custom-element";

const processTemplateName = (t, e, s) => {
    const i = e.getAttribute(li);
    if (i === null || i === "") {
        throw createMappedError(715, t);
    }
    if (s.has(i)) {
        throw createMappedError(716, i, t);
    } else {
        s.add(i);
        e.removeAttribute(li);
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

const ai = /*@__PURE__*/ U("ITemplateCompilerHooks");

const hi = u({
    name: /*@__PURE__*/ e.getResourceKeyFor("compiler-hooks"),
    define(t) {
        return e.Registrable.define(t, (function(t) {
            z(ai, this).register(t);
        }));
    },
    findAll(t) {
        return t.get(e.allResources(ai));
    }
});

const templateCompilerHooks = (t, e) => {
    return t === void 0 ? decorator : decorator(t);
    function decorator(t) {
        return hi.define(t);
    }
};

class Show {
    constructor() {
        this.el = e.resolve(Je);
        this.p = e.resolve(ht);
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
        const t = e.resolve(le);
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
    type: ut,
    name: "show",
    bindables: [ "value" ],
    aliases: [ "hide" ]
};

const ci = [ TemplateCompiler, s.DirtyChecker, NodeObserverLocator ];

const ui = [ RefAttributePattern, DotSeparatedAttributePattern, SpreadAttributePattern, EventAttributePattern, Pt ];

const fi = [ AtPrefixedTriggerAttributePattern, ColonPrefixedBindAttributePattern ];

const di = [ DefaultBindingCommand, OneTimeBindingCommand, FromViewBindingCommand, ToViewBindingCommand, TwoWayBindingCommand, ForBindingCommand, RefBindingCommand, TriggerBindingCommand, CaptureBindingCommand, ClassBindingCommand, StyleBindingCommand, AttrBindingCommand, SpreadBindingCommand ];

const pi = [ DebounceBindingBehavior, OneTimeBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, SignalBindingBehavior, ThrottleBindingBehavior, TwoWayBindingBehavior, SanitizeValueConverter, If, Else, Repeat, With, Switch, Case, DefaultCase, PromiseTemplateController, PendingTemplateController, FulfilledTemplateController, RejectedTemplateController, PromiseAttributePattern, FulfilledAttributePattern, RejectedAttributePattern, AttrBindingBehavior, SelfBindingBehavior, UpdateTriggerBindingBehavior, AuCompose, Portal, Focus, Show, AuSlot ];

const mi = [ PropertyBindingRenderer, IteratorBindingRenderer, RefBindingRenderer, InterpolationBindingRenderer, SetPropertyRenderer, CustomElementRenderer, CustomAttributeRenderer, TemplateControllerRenderer, LetElementRenderer, ListenerBindingRenderer, AttributeBindingRenderer, SetAttributeRenderer, SetClassAttributeRenderer, SetStyleAttributeRenderer, StylePropertyBindingRenderer, TextBindingRenderer, SpreadRenderer ];

const gi = /*@__PURE__*/ createConfiguration(e.noop);

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
            return e.register(K(s.ICoercionConfiguration, i.coercingOptions), ...ci, ...pi, ...ui, ...di, ...mi);
        },
        customize(e) {
            return createConfiguration(e ?? t);
        }
    };
}

function children(t, e) {
    if (!bi) {
        bi = true;
        s.subscriberCollection(ChildrenBinding);
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
    constructor(t, e, s, i = defaultChildQuery, n = defaultChildFilter, r = defaultChildMap, l = xi) {
        this.rn = void 0;
        this.X = defaultChildQuery;
        this.on = defaultChildFilter;
        this.ln = defaultChildMap;
        this.isBound = false;
        this.P = t;
        this.obj = e;
        this.cb = s;
        this.X = i;
        this.on = n;
        this.ln = r;
        this.V = l;
        this.Ss = createMutationObserver(this.bi = t.host, (() => {
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
        this.Ss.observe(this.bi, this.V);
        this.rn = this.hn();
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.Ss.disconnect();
        this.rn = e.emptyArray;
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

const xi = {
    childList: true
};

const defaultChildQuery = t => t.host.childNodes;

const defaultChildFilter = (t, e, s) => !!s;

const defaultChildMap = (t, e, s) => s;

const vi = {
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
        h = findElementControllerFor(a, vi);
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
        const i = new ChildrenBinding(e, t, t[s.callback ?? `${a(s.name)}Changed`], s.query ?? defaultChildQuery, s.filter ?? defaultChildFilter, s.map ?? defaultChildMap, s.options ?? xi);
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

let bi = false;

exports.AdoptedStyleSheetsStyles = AdoptedStyleSheetsStyles;

exports.AppRoot = AppRoot;

exports.AppTask = at;

exports.AtPrefixedTriggerAttributePattern = AtPrefixedTriggerAttributePattern;

exports.AttrBindingBehavior = AttrBindingBehavior;

exports.AttrBindingCommand = AttrBindingCommand;

exports.AttrSyntax = AttrSyntax;

exports.AttributeBinding = AttributeBinding;

exports.AttributeBindingInstruction = AttributeBindingInstruction;

exports.AttributeBindingRenderer = AttributeBindingRenderer;

exports.AttributeNSAccessor = AttributeNSAccessor;

exports.AttributePattern = ys;

exports.AuCompose = AuCompose;

exports.AuSlot = AuSlot;

exports.AuSlotsInfo = AuSlotsInfo;

exports.Aurelia = Aurelia;

exports.Bindable = j;

exports.BindableDefinition = BindableDefinition;

exports.BindingBehavior = tt;

exports.BindingBehaviorDefinition = BindingBehaviorDefinition;

exports.BindingCommand = As;

exports.BindingCommandDefinition = BindingCommandDefinition;

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

exports.ColonPrefixedBindAttributePattern = ColonPrefixedBindAttributePattern;

exports.ComputedWatcher = ComputedWatcher;

exports.ContentBinding = ContentBinding;

exports.Controller = Controller;

exports.CustomAttribute = dt;

exports.CustomAttributeDefinition = CustomAttributeDefinition;

exports.CustomAttributeRenderer = CustomAttributeRenderer;

exports.CustomElement = ds;

exports.CustomElementDefinition = CustomElementDefinition;

exports.CustomElementRenderer = CustomElementRenderer;

exports.DataAttributeAccessor = DataAttributeAccessor;

exports.DebounceBindingBehavior = DebounceBindingBehavior;

exports.DefaultBindingCommand = DefaultBindingCommand;

exports.DefaultBindingLanguage = di;

exports.DefaultBindingSyntax = ui;

exports.DefaultCase = DefaultCase;

exports.DefaultComponents = ci;

exports.DefaultRenderers = mi;

exports.DefaultResources = pi;

exports.DotSeparatedAttributePattern = DotSeparatedAttributePattern;

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

exports.IAppRoot = ms;

exports.IAppTask = lt;

exports.IAttrMapper = Ss;

exports.IAttributeParser = bs;

exports.IAttributePattern = vs;

exports.IAuSlotWatcher = Ht;

exports.IAuSlotsInfo = Ft;

exports.IAurelia = gs;

exports.IBindablesInfoResolver = ni;

exports.IController = Ke;

exports.IEventModifier = It;

exports.IEventTarget = ts;

exports.IFlushQueue = yt;

exports.IHistory = os;

exports.IHydrationContext = Xe;

exports.IInstruction = le;

exports.IKeyMapping = Et;

exports.ILifecycleHooks = pt;

exports.IListenerBindingOptions = ce;

exports.ILocation = rs;

exports.IModifiedEventHandlerCreator = Tt;

exports.INode = Je;

exports.IPlatform = ht;

exports.IRenderLocation = es;

exports.IRenderer = he;

exports.IRendering = ve;

exports.ISVGAnalyzer = Bs;

exports.ISanitizer = Gs;

exports.IShadowDOMGlobalStyles = ye;

exports.IShadowDOMStyleFactory = be;

exports.IShadowDOMStyles = we;

exports.ISignaler = nt;

exports.ISyntaxInterpreter = xs;

exports.ITemplateCompiler = ae;

exports.ITemplateCompilerHooks = ai;

exports.ITemplateElementFactory = Ks;

exports.IViewFactory = Lt;

exports.IWindow = ns;

exports.If = If;

exports.InstructionType = oe;

exports.InterpolationBinding = InterpolationBinding;

exports.InterpolationBindingRenderer = InterpolationBindingRenderer;

exports.InterpolationInstruction = InterpolationInstruction;

exports.InterpolationPartBinding = InterpolationPartBinding;

exports.Interpretation = Interpretation;

exports.IteratorBindingInstruction = IteratorBindingInstruction;

exports.IteratorBindingRenderer = IteratorBindingRenderer;

exports.LetBinding = LetBinding;

exports.LetBindingInstruction = LetBindingInstruction;

exports.LetElementRenderer = LetElementRenderer;

exports.LifecycleHooks = mt;

exports.LifecycleHooksDefinition = LifecycleHooksDefinition;

exports.LifecycleHooksEntry = LifecycleHooksEntry;

exports.ListenerBinding = ListenerBinding;

exports.ListenerBindingInstruction = ListenerBindingInstruction;

exports.ListenerBindingOptions = ListenerBindingOptions;

exports.ListenerBindingRenderer = ListenerBindingRenderer;

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

exports.PropertyBindingRenderer = PropertyBindingRenderer;

exports.RefAttributePattern = RefAttributePattern;

exports.RefBinding = RefBinding;

exports.RefBindingInstruction = RefBindingInstruction;

exports.RefBindingRenderer = RefBindingRenderer;

exports.RejectedTemplateController = RejectedTemplateController;

exports.Rendering = Rendering;

exports.Repeat = Repeat;

exports.SVGAnalyzer = SVGAnalyzer;

exports.SanitizeValueConverter = SanitizeValueConverter;

exports.SelectValueObserver = SelectValueObserver;

exports.SelfBindingBehavior = SelfBindingBehavior;

exports.SetAttributeInstruction = SetAttributeInstruction;

exports.SetAttributeRenderer = SetAttributeRenderer;

exports.SetClassAttributeInstruction = SetClassAttributeInstruction;

exports.SetClassAttributeRenderer = SetClassAttributeRenderer;

exports.SetPropertyInstruction = SetPropertyInstruction;

exports.SetPropertyRenderer = SetPropertyRenderer;

exports.SetStyleAttributeInstruction = SetStyleAttributeInstruction;

exports.SetStyleAttributeRenderer = SetStyleAttributeRenderer;

exports.ShadowDOMRegistry = ShadowDOMRegistry;

exports.ShortHandBindingSyntax = fi;

exports.SignalBindingBehavior = SignalBindingBehavior;

exports.SpreadBindingInstruction = SpreadBindingInstruction;

exports.SpreadElementPropBindingInstruction = SpreadElementPropBindingInstruction;

exports.SpreadRenderer = SpreadRenderer;

exports.StandardConfiguration = gi;

exports.State = Ge;

exports.StyleAttributeAccessor = StyleAttributeAccessor;

exports.StyleBindingCommand = StyleBindingCommand;

exports.StyleConfiguration = Ce;

exports.StyleElementStyles = StyleElementStyles;

exports.StylePropertyBindingInstruction = StylePropertyBindingInstruction;

exports.StylePropertyBindingRenderer = StylePropertyBindingRenderer;

exports.Switch = Switch;

exports.TemplateCompiler = TemplateCompiler;

exports.TemplateCompilerHooks = hi;

exports.TemplateControllerRenderer = TemplateControllerRenderer;

exports.TextBindingInstruction = TextBindingInstruction;

exports.TextBindingRenderer = TextBindingRenderer;

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

exports.astAssign = R;

exports.astBind = E;

exports.astEvaluate = T;

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
