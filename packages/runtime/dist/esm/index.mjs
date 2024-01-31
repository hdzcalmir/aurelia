import { DI as e, Protocol as t, emptyArray as r, isArrayIndex as n, Registration as i, IPlatform as o } from "@aurelia/kernel";

import { Metadata as a } from "@aurelia/metadata";

const c = Object;

const u = c.prototype.hasOwnProperty;

const l = Reflect.defineProperty;

const createError = e => new Error(e);

const isFunction = e => typeof e === "function";

const isString = e => typeof e === "string";

const isObject = e => e instanceof c;

const isArray = e => e instanceof Array;

const isSet = e => e instanceof Set;

const isMap = e => e instanceof Map;

const h = c.is;

function defineHiddenProp(e, t, r) {
    l(e, t, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: r
    });
    return r;
}

function ensureProto(e, t, r) {
    if (!(t in e)) {
        defineHiddenProp(e, t, r);
    }
}

const f = Object.assign;

const p = Object.freeze;

const d = String;

const b = e.createInterface;

const createLookup = () => c.create(null);

const w = a.getOwn;

a.hasOwn;

const v = a.define;

t.annotation.keyFor;

t.resource.keyFor;

t.resource.appendTo;

const astVisit = (e, t) => {
    switch (e.$kind) {
      case R:
        return t.visitAccessKeyed(e);

      case M:
        return t.visitAccessMember(e);

      case A:
        return t.visitAccessScope(e);

      case x:
        return t.visitAccessThis(e);

      case E:
        return t.visitAccessBoundary(e);

      case V:
        return t.visitArrayBindingPattern(e);

      case G:
        return t.visitDestructuringAssignmentExpression(e);

      case C:
        return t.visitArrayLiteral(e);

      case F:
        return t.visitArrowFunction(e);

      case D:
        return t.visitAssign(e);

      case B:
        return t.visitBinary(e);

      case N:
        return t.visitBindingBehavior(e);

      case H:
        return t.visitBindingIdentifier(e);

      case I:
        return t.visitCallFunction(e);

      case P:
        return t.visitCallMember(e);

      case T:
        return t.visitCallScope(e);

      case $:
        return t.visitConditional(e);

      case q:
        return t.visitDestructuringAssignmentSingleExpression(e);

      case K:
        return t.visitForOfStatement(e);

      case z:
        return t.visitInterpolation(e);

      case U:
        return t.visitObjectBindingPattern(e);

      case W:
        return t.visitDestructuringAssignmentExpression(e);

      case m:
        return t.visitObjectLiteral(e);

      case k:
        return t.visitPrimitiveLiteral(e);

      case _:
        return t.visitTaggedTemplate(e);

      case O:
        return t.visitTemplate(e);

      case S:
        return t.visitUnary(e);

      case j:
        return t.visitValueConverter(e);

      case J:
        return t.visitCustom(e);

      default:
        {
            throw createError(`Unknown ast node ${JSON.stringify(e)}`);
        }
    }
};

class Unparser {
    constructor() {
        this.text = "";
    }
    static unparse(e) {
        const t = new Unparser;
        astVisit(e, t);
        return t.text;
    }
    visitAccessMember(e) {
        astVisit(e.object, this);
        this.text += `${e.optional ? "?" : ""}.${e.name}`;
    }
    visitAccessKeyed(e) {
        astVisit(e.object, this);
        this.text += `${e.optional ? "?." : ""}[`;
        astVisit(e.key, this);
        this.text += "]";
    }
    visitAccessThis(e) {
        if (e.ancestor === 0) {
            this.text += "$this";
            return;
        }
        this.text += "$parent";
        let t = e.ancestor - 1;
        while (t--) {
            this.text += ".$parent";
        }
    }
    visitAccessBoundary(e) {
        this.text += "this";
    }
    visitAccessScope(e) {
        let t = e.ancestor;
        while (t--) {
            this.text += "$parent.";
        }
        this.text += e.name;
    }
    visitArrayLiteral(e) {
        const t = e.elements;
        this.text += "[";
        for (let e = 0, r = t.length; e < r; ++e) {
            if (e !== 0) {
                this.text += ",";
            }
            astVisit(t[e], this);
        }
        this.text += "]";
    }
    visitArrowFunction(e) {
        const t = e.args;
        const r = t.length;
        let n = 0;
        let i = "(";
        let o;
        for (;n < r; ++n) {
            o = t[n].name;
            if (n > 0) {
                i += ", ";
            }
            if (n < r - 1) {
                i += o;
            } else {
                i += e.rest ? `...${o}` : o;
            }
        }
        this.text += `${i}) => `;
        astVisit(e.body, this);
    }
    visitObjectLiteral(e) {
        const t = e.keys;
        const r = e.values;
        this.text += "{";
        for (let e = 0, n = t.length; e < n; ++e) {
            if (e !== 0) {
                this.text += ",";
            }
            this.text += `'${t[e]}':`;
            astVisit(r[e], this);
        }
        this.text += "}";
    }
    visitPrimitiveLiteral(e) {
        this.text += "(";
        if (isString(e.value)) {
            const t = e.value.replace(/'/g, "\\'");
            this.text += `'${t}'`;
        } else {
            this.text += `${e.value}`;
        }
        this.text += ")";
    }
    visitCallFunction(e) {
        this.text += "(";
        astVisit(e.func, this);
        this.text += e.optional ? "?." : "";
        this.writeArgs(e.args);
        this.text += ")";
    }
    visitCallMember(e) {
        this.text += "(";
        astVisit(e.object, this);
        this.text += `${e.optionalMember ? "?." : ""}.${e.name}${e.optionalCall ? "?." : ""}`;
        this.writeArgs(e.args);
        this.text += ")";
    }
    visitCallScope(e) {
        this.text += "(";
        let t = e.ancestor;
        while (t--) {
            this.text += "$parent.";
        }
        this.text += `${e.name}${e.optional ? "?." : ""}`;
        this.writeArgs(e.args);
        this.text += ")";
    }
    visitTemplate(e) {
        const {cooked: t, expressions: r} = e;
        const n = r.length;
        this.text += "`";
        this.text += t[0];
        for (let e = 0; e < n; e++) {
            astVisit(r[e], this);
            this.text += t[e + 1];
        }
        this.text += "`";
    }
    visitTaggedTemplate(e) {
        const {cooked: t, expressions: r} = e;
        const n = r.length;
        astVisit(e.func, this);
        this.text += "`";
        this.text += t[0];
        for (let e = 0; e < n; e++) {
            astVisit(r[e], this);
            this.text += t[e + 1];
        }
        this.text += "`";
    }
    visitUnary(e) {
        this.text += `(${e.operation}`;
        if (e.operation.charCodeAt(0) >= 97) {
            this.text += " ";
        }
        astVisit(e.expression, this);
        this.text += ")";
    }
    visitBinary(e) {
        this.text += "(";
        astVisit(e.left, this);
        if (e.operation.charCodeAt(0) === 105) {
            this.text += ` ${e.operation} `;
        } else {
            this.text += e.operation;
        }
        astVisit(e.right, this);
        this.text += ")";
    }
    visitConditional(e) {
        this.text += "(";
        astVisit(e.condition, this);
        this.text += "?";
        astVisit(e.yes, this);
        this.text += ":";
        astVisit(e.no, this);
        this.text += ")";
    }
    visitAssign(e) {
        this.text += "(";
        astVisit(e.target, this);
        this.text += "=";
        astVisit(e.value, this);
        this.text += ")";
    }
    visitValueConverter(e) {
        const t = e.args;
        astVisit(e.expression, this);
        this.text += `|${e.name}`;
        for (let e = 0, r = t.length; e < r; ++e) {
            this.text += ":";
            astVisit(t[e], this);
        }
    }
    visitBindingBehavior(e) {
        const t = e.args;
        astVisit(e.expression, this);
        this.text += `&${e.name}`;
        for (let e = 0, r = t.length; e < r; ++e) {
            this.text += ":";
            astVisit(t[e], this);
        }
    }
    visitArrayBindingPattern(e) {
        const t = e.elements;
        this.text += "[";
        for (let e = 0, r = t.length; e < r; ++e) {
            if (e !== 0) {
                this.text += ",";
            }
            astVisit(t[e], this);
        }
        this.text += "]";
    }
    visitObjectBindingPattern(e) {
        const t = e.keys;
        const r = e.values;
        this.text += "{";
        for (let e = 0, n = t.length; e < n; ++e) {
            if (e !== 0) {
                this.text += ",";
            }
            this.text += `'${t[e]}':`;
            astVisit(r[e], this);
        }
        this.text += "}";
    }
    visitBindingIdentifier(e) {
        this.text += e.name;
    }
    visitForOfStatement(e) {
        astVisit(e.declaration, this);
        this.text += " of ";
        astVisit(e.iterable, this);
    }
    visitInterpolation(e) {
        const {parts: t, expressions: r} = e;
        const n = r.length;
        this.text += "${";
        this.text += t[0];
        for (let e = 0; e < n; e++) {
            astVisit(r[e], this);
            this.text += t[e + 1];
        }
        this.text += "}";
    }
    visitDestructuringAssignmentExpression(e) {
        const t = e.$kind;
        const r = t === W;
        this.text += r ? "{" : "[";
        const n = e.list;
        const i = n.length;
        let o;
        let a;
        for (o = 0; o < i; o++) {
            a = n[o];
            switch (a.$kind) {
              case q:
                astVisit(a, this);
                break;

              case G:
              case W:
                {
                    const e = a.source;
                    if (e) {
                        astVisit(e, this);
                        this.text += ":";
                    }
                    astVisit(a, this);
                    break;
                }
            }
        }
        this.text += r ? "}" : "]";
    }
    visitDestructuringAssignmentSingleExpression(e) {
        astVisit(e.source, this);
        this.text += ":";
        astVisit(e.target, this);
        const t = e.initializer;
        if (t !== void 0) {
            this.text += "=";
            astVisit(t, this);
        }
    }
    visitDestructuringAssignmentRestExpression(e) {
        this.text += "...";
        astVisit(e.target, this);
    }
    visitCustom(e) {
        this.text += d(e.value);
    }
    writeArgs(e) {
        this.text += "(";
        for (let t = 0, r = e.length; t < r; ++t) {
            if (t !== 0) {
                this.text += ",";
            }
            astVisit(e[t], this);
        }
        this.text += ")";
    }
}

const x = "AccessThis";

const E = "AccessBoundary";

const y = "AccessGlobal";

const A = "AccessScope";

const C = "ArrayLiteral";

const m = "ObjectLiteral";

const k = "PrimitiveLiteral";

const O = "Template";

const S = "Unary";

const T = "CallScope";

const P = "CallMember";

const I = "CallFunction";

const L = "CallGlobal";

const M = "AccessMember";

const R = "AccessKeyed";

const _ = "TaggedTemplate";

const B = "Binary";

const $ = "Conditional";

const D = "Assign";

const F = "ArrowFunction";

const j = "ValueConverter";

const N = "BindingBehavior";

const V = "ArrayBindingPattern";

const U = "ObjectBindingPattern";

const H = "BindingIdentifier";

const K = "ForOfStatement";

const z = "Interpolation";

const G = "ArrayDestructuring";

const W = "ObjectDestructuring";

const q = "DestructuringAssignmentLeaf";

const J = "Custom";

class CustomExpression {
    constructor(e) {
        this.value = e;
        this.$kind = J;
    }
    evaluate(e, t, r) {
        return this.value;
    }
    assign(e, t, r) {
        return r;
    }
    bind(e, t) {}
    unbind(e, t) {}
    accept(e) {
        return void 0;
    }
}

class BindingBehaviorExpression {
    constructor(e, t, r) {
        this.expression = e;
        this.name = t;
        this.args = r;
        this.$kind = N;
        this.key = `_bb_${t}`;
    }
}

class ValueConverterExpression {
    constructor(e, t, r) {
        this.expression = e;
        this.name = t;
        this.args = r;
        this.$kind = j;
    }
}

class AssignExpression {
    constructor(e, t) {
        this.target = e;
        this.value = t;
        this.$kind = D;
    }
}

class ConditionalExpression {
    constructor(e, t, r) {
        this.condition = e;
        this.yes = t;
        this.no = r;
        this.$kind = $;
    }
}

class AccessGlobalExpression {
    constructor(e) {
        this.name = e;
        this.$kind = y;
    }
}

class AccessThisExpression {
    constructor(e = 0) {
        this.ancestor = e;
        this.$kind = x;
    }
}

class AccessBoundaryExpression {
    constructor() {
        this.$kind = E;
    }
}

class AccessScopeExpression {
    constructor(e, t = 0) {
        this.name = e;
        this.ancestor = t;
        this.$kind = A;
    }
}

const isAccessGlobal = e => e.$kind === y || (e.$kind === M || e.$kind === R) && e.accessGlobal;

class AccessMemberExpression {
    constructor(e, t, r = false) {
        this.object = e;
        this.name = t;
        this.optional = r;
        this.$kind = M;
        this.accessGlobal = isAccessGlobal(e);
    }
}

class AccessKeyedExpression {
    constructor(e, t, r = false) {
        this.object = e;
        this.key = t;
        this.optional = r;
        this.$kind = R;
        this.accessGlobal = isAccessGlobal(e);
    }
}

class CallScopeExpression {
    constructor(e, t, r = 0, n = false) {
        this.name = e;
        this.args = t;
        this.ancestor = r;
        this.optional = n;
        this.$kind = T;
    }
}

class CallMemberExpression {
    constructor(e, t, r, n = false, i = false) {
        this.object = e;
        this.name = t;
        this.args = r;
        this.optionalMember = n;
        this.optionalCall = i;
        this.$kind = P;
    }
}

class CallFunctionExpression {
    constructor(e, t, r = false) {
        this.func = e;
        this.args = t;
        this.optional = r;
        this.$kind = I;
    }
}

class CallGlobalExpression {
    constructor(e, t) {
        this.name = e;
        this.args = t;
        this.$kind = L;
    }
}

class BinaryExpression {
    constructor(e, t, r) {
        this.operation = e;
        this.left = t;
        this.right = r;
        this.$kind = B;
    }
}

class UnaryExpression {
    constructor(e, t) {
        this.operation = e;
        this.expression = t;
        this.$kind = S;
    }
}

class PrimitiveLiteralExpression {
    constructor(e) {
        this.value = e;
        this.$kind = k;
    }
}

PrimitiveLiteralExpression.$undefined = new PrimitiveLiteralExpression(void 0);

PrimitiveLiteralExpression.$null = new PrimitiveLiteralExpression(null);

PrimitiveLiteralExpression.$true = new PrimitiveLiteralExpression(true);

PrimitiveLiteralExpression.$false = new PrimitiveLiteralExpression(false);

PrimitiveLiteralExpression.$empty = new PrimitiveLiteralExpression("");

class ArrayLiteralExpression {
    constructor(e) {
        this.elements = e;
        this.$kind = C;
    }
}

ArrayLiteralExpression.$empty = new ArrayLiteralExpression(r);

class ObjectLiteralExpression {
    constructor(e, t) {
        this.keys = e;
        this.values = t;
        this.$kind = m;
    }
}

ObjectLiteralExpression.$empty = new ObjectLiteralExpression(r, r);

class TemplateExpression {
    constructor(e, t = r) {
        this.cooked = e;
        this.expressions = t;
        this.$kind = O;
    }
}

TemplateExpression.$empty = new TemplateExpression([ "" ]);

class TaggedTemplateExpression {
    constructor(e, t, n, i = r) {
        this.cooked = e;
        this.func = n;
        this.expressions = i;
        this.$kind = _;
        e.raw = t;
    }
}

class ArrayBindingPattern {
    constructor(e) {
        this.elements = e;
        this.$kind = V;
    }
}

class ObjectBindingPattern {
    constructor(e, t) {
        this.keys = e;
        this.values = t;
        this.$kind = U;
    }
}

class BindingIdentifier {
    constructor(e) {
        this.name = e;
        this.$kind = H;
    }
}

class ForOfStatement {
    constructor(e, t, r) {
        this.declaration = e;
        this.iterable = t;
        this.semiIdx = r;
        this.$kind = K;
    }
}

class Interpolation {
    constructor(e, t = r) {
        this.parts = e;
        this.expressions = t;
        this.$kind = z;
        this.isMulti = t.length > 1;
        this.firstExpression = t[0];
    }
}

class DestructuringAssignmentExpression {
    constructor(e, t, r, n) {
        this.$kind = e;
        this.list = t;
        this.source = r;
        this.initializer = n;
    }
}

class DestructuringAssignmentSingleExpression {
    constructor(e, t, r) {
        this.target = e;
        this.source = t;
        this.initializer = r;
        this.$kind = q;
    }
}

class DestructuringAssignmentRestExpression {
    constructor(e, t) {
        this.target = e;
        this.indexOrProperties = t;
        this.$kind = q;
    }
}

class ArrowFunction {
    constructor(e, t, r = false) {
        this.args = e;
        this.body = t;
        this.rest = r;
        this.$kind = F;
    }
}

const createMappedError = (e, ...t) => new Error(`AUR${d(e).padStart(4, "0")}:${t.map(d)}`);

class BindingContext {
    constructor(e, t) {
        if (e !== void 0) {
            this[e] = t;
        }
    }
}

class Scope {
    constructor(e, t, r, n) {
        this.parent = e;
        this.bindingContext = t;
        this.overrideContext = r;
        this.isBoundary = n;
    }
    static getContext(e, t, r) {
        if (e == null) {
            throw createMappedError(203);
        }
        let n = e.overrideContext;
        let i = e;
        if (r > 0) {
            while (r > 0) {
                r--;
                i = i.parent;
                if (i == null) {
                    return void 0;
                }
            }
            n = i.overrideContext;
            return t in n ? n : i.bindingContext;
        }
        while (i != null && !i.isBoundary && !(t in i.overrideContext) && !(t in i.bindingContext)) {
            i = i.parent;
        }
        if (i == null) {
            return e.bindingContext;
        }
        n = i.overrideContext;
        return t in n ? n : i.bindingContext;
    }
    static create(e, t, r) {
        if (e == null) {
            throw createMappedError(204);
        }
        return new Scope(null, e, t == null ? new OverrideContext : t, r ?? false);
    }
    static fromParent(e, t) {
        if (e == null) {
            throw createMappedError(203);
        }
        return new Scope(e, t, new OverrideContext, false);
    }
}

class OverrideContext {}

const Q = Scope.getContext;

function astEvaluate(e, t, r, n) {
    switch (e.$kind) {
      case x:
        {
            let r = t.overrideContext;
            let n = t;
            let i = e.ancestor;
            while (i-- && r) {
                n = n.parent;
                r = n?.overrideContext ?? null;
            }
            return i < 1 && n ? n.bindingContext : void 0;
        }

      case E:
        {
            let e = t;
            while (e != null && !e.isBoundary) {
                e = e.parent;
            }
            return e ? e.bindingContext : void 0;
        }

      case A:
        {
            const i = Q(t, e.name, e.ancestor);
            if (n !== null) {
                n.observe(i, e.name);
            }
            const o = i[e.name];
            if (o == null && e.name === "$host") {
                throw createMappedError(105);
            }
            if (r?.strict) {
                return r?.boundFn && isFunction(o) ? o.bind(i) : o;
            }
            return o == null ? "" : r?.boundFn && isFunction(o) ? o.bind(i) : o;
        }

      case y:
        return globalThis[e.name];

      case L:
        {
            const i = globalThis[e.name];
            if (isFunction(i)) {
                return i(...e.args.map((e => astEvaluate(e, t, r, n))));
            }
            if (!r?.strictFnCall && i == null) {
                return void 0;
            }
            throw createMappedError(107);
        }

      case C:
        return e.elements.map((e => astEvaluate(e, t, r, n)));

      case m:
        {
            const i = {};
            for (let o = 0; o < e.keys.length; ++o) {
                i[e.keys[o]] = astEvaluate(e.values[o], t, r, n);
            }
            return i;
        }

      case k:
        return e.value;

      case O:
        {
            let i = e.cooked[0];
            for (let o = 0; o < e.expressions.length; ++o) {
                i += String(astEvaluate(e.expressions[o], t, r, n));
                i += e.cooked[o + 1];
            }
            return i;
        }

      case S:
        switch (e.operation) {
          case "void":
            return void astEvaluate(e.expression, t, r, n);

          case "typeof":
            return typeof astEvaluate(e.expression, t, r, n);

          case "!":
            return !astEvaluate(e.expression, t, r, n);

          case "-":
            return -astEvaluate(e.expression, t, r, n);

          case "+":
            return +astEvaluate(e.expression, t, r, n);

          default:
            throw createMappedError(109, e.operation);
        }

      case T:
        {
            const i = e.args.map((e => astEvaluate(e, t, r, n)));
            const o = Q(t, e.name, e.ancestor);
            const a = getFunction(r?.strictFnCall, o, e.name);
            if (a) {
                return a.apply(o, i);
            }
            return void 0;
        }

      case P:
        {
            const i = astEvaluate(e.object, t, r, n);
            const o = e.args.map((e => astEvaluate(e, t, r, n)));
            const a = getFunction(r?.strictFnCall, i, e.name);
            let c;
            if (a) {
                c = a.apply(i, o);
                if (isArray(i) && X.includes(e.name)) {
                    n?.observeCollection(i);
                }
            }
            return c;
        }

      case I:
        {
            const i = astEvaluate(e.func, t, r, n);
            if (isFunction(i)) {
                return i(...e.args.map((e => astEvaluate(e, t, r, n))));
            }
            if (!r?.strictFnCall && i == null) {
                return void 0;
            }
            throw createMappedError(107);
        }

      case F:
        {
            const func = (...i) => {
                const o = e.args;
                const a = e.rest;
                const c = o.length - 1;
                const u = o.reduce(((e, t, r) => {
                    if (a && r === c) {
                        e[t.name] = i.slice(r);
                    } else {
                        e[t.name] = i[r];
                    }
                    return e;
                }), {});
                const l = Scope.fromParent(t, u);
                return astEvaluate(e.body, l, r, n);
            };
            return func;
        }

      case M:
        {
            const i = astEvaluate(e.object, t, r, n);
            let o;
            if (r?.strict) {
                if (i == null) {
                    return undefined;
                }
                if (n !== null && !e.accessGlobal) {
                    n.observe(i, e.name);
                }
                o = i[e.name];
                if (r?.boundFn && isFunction(o)) {
                    return o.bind(i);
                }
                return o;
            }
            if (n !== null && isObject(i) && !e.accessGlobal) {
                n.observe(i, e.name);
            }
            if (i) {
                o = i[e.name];
                if (r?.boundFn && isFunction(o)) {
                    return o.bind(i);
                }
                return o;
            }
            return "";
        }

      case R:
        {
            const i = astEvaluate(e.object, t, r, n);
            const o = astEvaluate(e.key, t, r, n);
            if (isObject(i)) {
                if (n !== null && !e.accessGlobal) {
                    n.observe(i, o);
                }
                return i[o];
            }
            return i == null ? void 0 : i[o];
        }

      case _:
        {
            const i = e.expressions.map((e => astEvaluate(e, t, r, n)));
            const o = astEvaluate(e.func, t, r, n);
            if (!isFunction(o)) {
                throw createMappedError(110);
            }
            return o(e.cooked, ...i);
        }

      case B:
        {
            const i = e.left;
            const o = e.right;
            switch (e.operation) {
              case "&&":
                return astEvaluate(i, t, r, n) && astEvaluate(o, t, r, n);

              case "||":
                return astEvaluate(i, t, r, n) || astEvaluate(o, t, r, n);

              case "??":
                return astEvaluate(i, t, r, n) ?? astEvaluate(o, t, r, n);

              case "==":
                return astEvaluate(i, t, r, n) == astEvaluate(o, t, r, n);

              case "===":
                return astEvaluate(i, t, r, n) === astEvaluate(o, t, r, n);

              case "!=":
                return astEvaluate(i, t, r, n) != astEvaluate(o, t, r, n);

              case "!==":
                return astEvaluate(i, t, r, n) !== astEvaluate(o, t, r, n);

              case "instanceof":
                {
                    const e = astEvaluate(o, t, r, n);
                    if (isFunction(e)) {
                        return astEvaluate(i, t, r, n) instanceof e;
                    }
                    return false;
                }

              case "in":
                {
                    const e = astEvaluate(o, t, r, n);
                    if (isObject(e)) {
                        return astEvaluate(i, t, r, n) in e;
                    }
                    return false;
                }

              case "+":
                {
                    const e = astEvaluate(i, t, r, n);
                    const a = astEvaluate(o, t, r, n);
                    if (r?.strict) {
                        return e + a;
                    }
                    if (!e || !a) {
                        if (isNumberOrBigInt(e) || isNumberOrBigInt(a)) {
                            return (e || 0) + (a || 0);
                        }
                        if (isStringOrDate(e) || isStringOrDate(a)) {
                            return (e || "") + (a || "");
                        }
                    }
                    return e + a;
                }

              case "-":
                return astEvaluate(i, t, r, n) - astEvaluate(o, t, r, n);

              case "*":
                return astEvaluate(i, t, r, n) * astEvaluate(o, t, r, n);

              case "/":
                return astEvaluate(i, t, r, n) / astEvaluate(o, t, r, n);

              case "%":
                return astEvaluate(i, t, r, n) % astEvaluate(o, t, r, n);

              case "<":
                return astEvaluate(i, t, r, n) < astEvaluate(o, t, r, n);

              case ">":
                return astEvaluate(i, t, r, n) > astEvaluate(o, t, r, n);

              case "<=":
                return astEvaluate(i, t, r, n) <= astEvaluate(o, t, r, n);

              case ">=":
                return astEvaluate(i, t, r, n) >= astEvaluate(o, t, r, n);

              default:
                throw createMappedError(108, e.operation);
            }
        }

      case $:
        return astEvaluate(e.condition, t, r, n) ? astEvaluate(e.yes, t, r, n) : astEvaluate(e.no, t, r, n);

      case D:
        return astAssign(e.target, t, r, astEvaluate(e.value, t, r, n));

      case j:
        {
            const i = r?.getConverter?.(e.name);
            if (i == null) {
                throw createMappedError(103, e.name);
            }
            if ("toView" in i) {
                return i.toView(astEvaluate(e.expression, t, r, n), ...e.args.map((e => astEvaluate(e, t, r, n))));
            }
            return astEvaluate(e.expression, t, r, n);
        }

      case N:
        return astEvaluate(e.expression, t, r, n);

      case H:
        return e.name;

      case K:
        return astEvaluate(e.iterable, t, r, n);

      case z:
        if (e.isMulti) {
            let i = e.parts[0];
            let o = 0;
            for (;o < e.expressions.length; ++o) {
                i += d(astEvaluate(e.expressions[o], t, r, n));
                i += e.parts[o + 1];
            }
            return i;
        } else {
            return `${e.parts[0]}${astEvaluate(e.firstExpression, t, r, n)}${e.parts[1]}`;
        }

      case q:
        return astEvaluate(e.target, t, r, n);

      case G:
        {
            return e.list.map((e => astEvaluate(e, t, r, n)));
        }

      case V:
      case U:
      case W:
      default:
        return void 0;

      case J:
        return e.evaluate(t, r, n);
    }
}

function astAssign(e, t, r, i) {
    switch (e.$kind) {
      case A:
        {
            if (e.name === "$host") {
                throw createMappedError(106);
            }
            const r = Q(t, e.name, e.ancestor);
            return r[e.name] = i;
        }

      case M:
        {
            const n = astEvaluate(e.object, t, r, null);
            if (isObject(n)) {
                if (e.name === "length" && isArray(n) && !isNaN(i)) {
                    n.splice(i);
                } else {
                    n[e.name] = i;
                }
            } else {
                astAssign(e.object, t, r, {
                    [e.name]: i
                });
            }
            return i;
        }

      case R:
        {
            const o = astEvaluate(e.object, t, r, null);
            const a = astEvaluate(e.key, t, r, null);
            if (isArray(o)) {
                if (a === "length" && !isNaN(i)) {
                    o.splice(i);
                    return i;
                }
                if (n(a)) {
                    o.splice(a, 1, i);
                    return i;
                }
            }
            return o[a] = i;
        }

      case D:
        astAssign(e.value, t, r, i);
        return astAssign(e.target, t, r, i);

      case j:
        {
            const n = r?.getConverter?.(e.name);
            if (n == null) {
                throw createMappedError(103, e.name);
            }
            if ("fromView" in n) {
                i = n.fromView(i, ...e.args.map((e => astEvaluate(e, t, r, null))));
            }
            return astAssign(e.expression, t, r, i);
        }

      case N:
        return astAssign(e.expression, t, r, i);

      case G:
      case W:
        {
            const n = e.list;
            const o = n.length;
            let a;
            let c;
            for (a = 0; a < o; a++) {
                c = n[a];
                switch (c.$kind) {
                  case q:
                    astAssign(c, t, r, i);
                    break;

                  case G:
                  case W:
                    {
                        if (typeof i !== "object" || i === null) {
                            throw createMappedError(112);
                        }
                        let e = astEvaluate(c.source, Scope.create(i), r, null);
                        if (e === void 0 && c.initializer) {
                            e = astEvaluate(c.initializer, t, r, null);
                        }
                        astAssign(c, t, r, e);
                        break;
                    }
                }
            }
            break;
        }

      case q:
        {
            if (e instanceof DestructuringAssignmentSingleExpression) {
                if (i == null) {
                    return;
                }
                if (typeof i !== "object") {
                    throw createMappedError(112);
                }
                let n = astEvaluate(e.source, Scope.create(i), r, null);
                if (n === void 0 && e.initializer) {
                    n = astEvaluate(e.initializer, t, r, null);
                }
                astAssign(e.target, t, r, n);
            } else {
                if (i == null) {
                    return;
                }
                if (typeof i !== "object") {
                    throw createMappedError(112);
                }
                const o = e.indexOrProperties;
                let a;
                if (n(o)) {
                    if (!Array.isArray(i)) {
                        throw createMappedError(112);
                    }
                    a = i.slice(o);
                } else {
                    a = Object.entries(i).reduce(((e, [t, r]) => {
                        if (!o.includes(t)) {
                            e[t] = r;
                        }
                        return e;
                    }), {});
                }
                astAssign(e.target, t, r, a);
            }
            break;
        }

      case J:
        return e.assign(t, r, i);

      default:
        return void 0;
    }
}

function astBind(e, t, r) {
    switch (e.$kind) {
      case N:
        {
            const n = e.name;
            const i = e.key;
            const o = r.getBehavior?.(n);
            if (o == null) {
                throw createMappedError(101, n);
            }
            if (r[i] === void 0) {
                r[i] = o;
                o.bind?.(t, r, ...e.args.map((e => astEvaluate(e, t, r, null))));
            } else {
                throw createMappedError(102, n);
            }
            astBind(e.expression, t, r);
            return;
        }

      case j:
        {
            const n = e.name;
            const i = r.getConverter?.(n);
            if (i == null) {
                throw createMappedError(103, n);
            }
            const o = i.signals;
            if (o != null) {
                const e = r.getSignaler?.();
                const t = o.length;
                let n = 0;
                for (;n < t; ++n) {
                    e?.addSignalListener(o[n], r);
                }
            }
            astBind(e.expression, t, r);
            return;
        }

      case K:
        {
            astBind(e.iterable, t, r);
            break;
        }

      case J:
        {
            e.bind?.(t, r);
        }
    }
}

function astUnbind(e, t, r) {
    switch (e.$kind) {
      case N:
        {
            const n = e.key;
            const i = r;
            if (i[n] !== void 0) {
                i[n].unbind?.(t, r);
                i[n] = void 0;
            }
            astUnbind(e.expression, t, r);
            break;
        }

      case j:
        {
            const n = r.getConverter?.(e.name);
            if (n?.signals === void 0) {
                return;
            }
            const i = r.getSignaler?.();
            let o = 0;
            for (;o < n.signals.length; ++o) {
                i?.removeSignalListener(n.signals[o], r);
            }
            astUnbind(e.expression, t, r);
            break;
        }

      case K:
        {
            astUnbind(e.iterable, t, r);
            break;
        }

      case J:
        {
            e.unbind?.(t, r);
        }
    }
}

const getFunction = (e, t, r) => {
    const n = t == null ? null : t[r];
    if (isFunction(n)) {
        return n;
    }
    if (!e && n == null) {
        return null;
    }
    throw createMappedError(111, r);
};

const isNumberOrBigInt = e => {
    switch (typeof e) {
      case "number":
      case "bigint":
        return true;

      default:
        return false;
    }
};

const isStringOrDate = e => {
    switch (typeof e) {
      case "string":
        return true;

      case "object":
        return e instanceof Date;

      default:
        return false;
    }
};

const X = "at map filter includes indexOf lastIndexOf findIndex find flat flatMap join reduce reduceRight slice every some sort".split(" ");

const Y = /*@__PURE__*/ e.createInterface("ICoercionConfiguration");

const Z = 0;

const ee = 1;

const te = 2;

const se = 4;

const re = /*@__PURE__*/ p({
    None: Z,
    Observer: ee,
    Node: te,
    Layout: se
});

function copyIndexMap(e, t, r) {
    const {length: n} = e;
    const i = Array(n);
    let o = 0;
    while (o < n) {
        i[o] = e[o];
        ++o;
    }
    if (t !== void 0) {
        i.deletedIndices = t.slice(0);
    } else if (e.deletedIndices !== void 0) {
        i.deletedIndices = e.deletedIndices.slice(0);
    } else {
        i.deletedIndices = [];
    }
    if (r !== void 0) {
        i.deletedItems = r.slice(0);
    } else if (e.deletedItems !== void 0) {
        i.deletedItems = e.deletedItems.slice(0);
    } else {
        i.deletedItems = [];
    }
    i.isIndexMap = true;
    return i;
}

function createIndexMap(e = 0) {
    const t = Array(e);
    let r = 0;
    while (r < e) {
        t[r] = r++;
    }
    t.deletedIndices = [];
    t.deletedItems = [];
    t.isIndexMap = true;
    return t;
}

function cloneIndexMap(e) {
    const t = e.slice();
    t.deletedIndices = e.deletedIndices.slice();
    t.deletedItems = e.deletedItems.slice();
    t.isIndexMap = true;
    return t;
}

function isIndexMap(e) {
    return isArray(e) && e.isIndexMap === true;
}

let ne = new Map;

let ie = false;

function batch(e) {
    const t = ne;
    const r = ne = new Map;
    ie = true;
    try {
        e();
    } finally {
        ne = null;
        ie = false;
        try {
            let e;
            let n;
            let i;
            let o;
            let a;
            let c = false;
            let u;
            let l;
            for (e of r) {
                n = e[0];
                i = e[1];
                if (t?.has(n)) {
                    t.set(n, i);
                }
                if (i[0] === 1) {
                    n.notify(i[1], i[2]);
                } else {
                    o = i[1];
                    a = i[2];
                    c = false;
                    if (a.deletedIndices.length > 0) {
                        c = true;
                    } else {
                        for (u = 0, l = a.length; u < l; ++u) {
                            if (a[u] !== u) {
                                c = true;
                                break;
                            }
                        }
                    }
                    if (c) {
                        n.notifyCollection(o, a);
                    }
                }
            }
        } finally {
            ne = t;
        }
    }
}

function addCollectionBatch(e, t, r) {
    if (!ne.has(e)) {
        ne.set(e, [ 2, t, r ]);
    } else {
        ne.get(e)[2] = r;
    }
}

function addValueBatch(e, t, r) {
    const n = ne.get(e);
    if (n === void 0) {
        ne.set(e, [ 1, t, r ]);
    } else {
        n[1] = t;
        n[2] = r;
    }
}

function subscriberCollection(e) {
    return e == null ? subscriberCollectionDeco : subscriberCollectionDeco(e);
}

const oe = new WeakSet;

function subscriberCollectionDeco(e) {
    if (oe.has(e)) {
        return;
    }
    oe.add(e);
    const t = e.prototype;
    l(t, "subs", {
        get: getSubscriberRecord
    });
    ensureProto(t, "subscribe", addSubscriber);
    ensureProto(t, "unsubscribe", removeSubscriber);
}

class SubscriberRecord {
    constructor() {
        this.count = 0;
        this.t = [];
    }
    add(e) {
        if (this.t.includes(e)) {
            return false;
        }
        this.t[this.t.length] = e;
        ++this.count;
        return true;
    }
    remove(e) {
        const t = this.t.indexOf(e);
        if (t !== -1) {
            this.t.splice(t, 1);
            --this.count;
            return true;
        }
        return false;
    }
    notify(e, t) {
        if (ie) {
            addValueBatch(this, e, t);
            return;
        }
        const r = this.t.slice(0);
        const n = r.length;
        let i = 0;
        for (;i < n; ++i) {
            r[i].handleChange(e, t);
        }
        return;
    }
    notifyCollection(e, t) {
        const r = this.t.slice(0);
        const n = r.length;
        let i = 0;
        for (;i < n; ++i) {
            r[i].handleCollectionChange(e, t);
        }
        return;
    }
}

function getSubscriberRecord() {
    return defineHiddenProp(this, "subs", new SubscriberRecord);
}

function addSubscriber(e) {
    return this.subs.add(e);
}

function removeSubscriber(e) {
    return this.subs.remove(e);
}

class CollectionLengthObserver {
    constructor(e) {
        this.owner = e;
        this.type = ee;
        this.v = (this.o = e.collection).length;
    }
    getValue() {
        return this.o.length;
    }
    setValue(e) {
        if (e !== this.v) {
            if (!Number.isNaN(e)) {
                this.o.splice(e);
                this.v = this.o.length;
            }
        }
    }
    handleCollectionChange(e, t) {
        const r = this.v;
        const n = this.o.length;
        if ((this.v = n) !== r) {
            this.subs.notify(this.v, r);
        }
    }
}

class CollectionSizeObserver {
    constructor(e) {
        this.owner = e;
        this.type = ee;
        this.v = (this.o = e.collection).size;
    }
    getValue() {
        return this.o.size;
    }
    setValue() {
        throw createMappedError(220);
    }
    handleCollectionChange(e, t) {
        const r = this.v;
        const n = this.o.size;
        if ((this.v = n) !== r) {
            this.subs.notify(this.v, r);
        }
    }
}

function implementLengthObserver(e) {
    const t = e.prototype;
    ensureProto(t, "subscribe", subscribe);
    ensureProto(t, "unsubscribe", unsubscribe);
    subscriberCollection(e);
}

function subscribe(e) {
    if (this.subs.add(e) && this.subs.count === 1) {
        this.owner.subscribe(this);
    }
}

function unsubscribe(e) {
    if (this.subs.remove(e) && this.subs.count === 0) {
        this.owner.subscribe(this);
    }
}

implementLengthObserver(CollectionLengthObserver);

implementLengthObserver(CollectionSizeObserver);

const ae = Symbol.for("__au_arr_obs__");

const ce = Array[ae] ?? defineHiddenProp(Array, ae, new WeakMap);

function sortCompare(e, t) {
    if (e === t) {
        return 0;
    }
    e = e === null ? "null" : e.toString();
    t = t === null ? "null" : t.toString();
    return e < t ? -1 : 1;
}

function preSortCompare(e, t) {
    if (e === void 0) {
        if (t === void 0) {
            return 0;
        } else {
            return 1;
        }
    }
    if (t === void 0) {
        return -1;
    }
    return 0;
}

function insertionSort(e, t, r, n, i) {
    let o, a, c, u, l;
    let h, f;
    for (h = r + 1; h < n; h++) {
        o = e[h];
        a = t[h];
        for (f = h - 1; f >= r; f--) {
            c = e[f];
            u = t[f];
            l = i(c, o);
            if (l > 0) {
                e[f + 1] = c;
                t[f + 1] = u;
            } else {
                break;
            }
        }
        e[f + 1] = o;
        t[f + 1] = a;
    }
}

function quickSort(e, t, r, n, i) {
    let o = 0, a = 0;
    let c, u, l;
    let h, f, p;
    let d, b, w;
    let v, x;
    let E, y, A, C;
    let m, k, O, S;
    while (true) {
        if (n - r <= 10) {
            insertionSort(e, t, r, n, i);
            return;
        }
        o = r + (n - r >> 1);
        c = e[r];
        h = t[r];
        u = e[n - 1];
        f = t[n - 1];
        l = e[o];
        p = t[o];
        d = i(c, u);
        if (d > 0) {
            v = c;
            x = h;
            c = u;
            h = f;
            u = v;
            f = x;
        }
        b = i(c, l);
        if (b >= 0) {
            v = c;
            x = h;
            c = l;
            h = p;
            l = u;
            p = f;
            u = v;
            f = x;
        } else {
            w = i(u, l);
            if (w > 0) {
                v = u;
                x = f;
                u = l;
                f = p;
                l = v;
                p = x;
            }
        }
        e[r] = c;
        t[r] = h;
        e[n - 1] = l;
        t[n - 1] = p;
        E = u;
        y = f;
        A = r + 1;
        C = n - 1;
        e[o] = e[A];
        t[o] = t[A];
        e[A] = E;
        t[A] = y;
        e: for (a = A + 1; a < C; a++) {
            m = e[a];
            k = t[a];
            O = i(m, E);
            if (O < 0) {
                e[a] = e[A];
                t[a] = t[A];
                e[A] = m;
                t[A] = k;
                A++;
            } else if (O > 0) {
                do {
                    C--;
                    if (C == a) {
                        break e;
                    }
                    S = e[C];
                    O = i(S, E);
                } while (O > 0);
                e[a] = e[C];
                t[a] = t[C];
                e[C] = m;
                t[C] = k;
                if (O < 0) {
                    m = e[a];
                    k = t[a];
                    e[a] = e[A];
                    t[a] = t[A];
                    e[A] = m;
                    t[A] = k;
                    A++;
                }
            }
        }
        if (n - C < A - r) {
            quickSort(e, t, C, n, i);
            n = A;
        } else {
            quickSort(e, t, r, A, i);
            r = C;
        }
    }
}

const ue = Array.prototype;

const le = ue.push;

const he = ue.unshift;

const fe = ue.pop;

const pe = ue.shift;

const de = ue.splice;

const be = ue.reverse;

const we = ue.sort;

const ve = {
    push: le,
    unshift: he,
    pop: fe,
    shift: pe,
    splice: de,
    reverse: be,
    sort: we
};

const ge = [ "push", "unshift", "pop", "shift", "splice", "reverse", "sort" ];

const xe = {
    push: function(...e) {
        const t = ce.get(this);
        if (t === void 0) {
            return le.apply(this, e);
        }
        const r = this.length;
        const n = e.length;
        if (n === 0) {
            return r;
        }
        this.length = t.indexMap.length = r + n;
        let i = r;
        while (i < this.length) {
            this[i] = e[i - r];
            t.indexMap[i] = -2;
            i++;
        }
        t.notify();
        return this.length;
    },
    unshift: function(...e) {
        const t = ce.get(this);
        if (t === void 0) {
            return he.apply(this, e);
        }
        const r = e.length;
        const n = new Array(r);
        let i = 0;
        while (i < r) {
            n[i++] = -2;
        }
        he.apply(t.indexMap, n);
        const o = he.apply(this, e);
        t.notify();
        return o;
    },
    pop: function() {
        const e = ce.get(this);
        if (e === void 0) {
            return fe.call(this);
        }
        const t = e.indexMap;
        const r = fe.call(this);
        const n = t.length - 1;
        if (t[n] > -1) {
            t.deletedIndices.push(t[n]);
            t.deletedItems.push(r);
        }
        fe.call(t);
        e.notify();
        return r;
    },
    shift: function() {
        const e = ce.get(this);
        if (e === void 0) {
            return pe.call(this);
        }
        const t = e.indexMap;
        const r = pe.call(this);
        if (t[0] > -1) {
            t.deletedIndices.push(t[0]);
            t.deletedItems.push(r);
        }
        pe.call(t);
        e.notify();
        return r;
    },
    splice: function(...e) {
        const t = e[0];
        const r = e[1];
        const n = ce.get(this);
        if (n === void 0) {
            return de.apply(this, e);
        }
        const i = this.length;
        const o = t | 0;
        const a = o < 0 ? Math.max(i + o, 0) : Math.min(o, i);
        const c = n.indexMap;
        const u = e.length;
        const l = u === 0 ? 0 : u === 1 ? i - a : r;
        let h = a;
        if (l > 0) {
            const e = h + l;
            while (h < e) {
                if (c[h] > -1) {
                    c.deletedIndices.push(c[h]);
                    c.deletedItems.push(this[h]);
                }
                h++;
            }
        }
        h = 0;
        if (u > 2) {
            const e = u - 2;
            const n = new Array(e);
            while (h < e) {
                n[h++] = -2;
            }
            de.call(c, t, r, ...n);
        } else {
            de.apply(c, e);
        }
        const f = de.apply(this, e);
        if (l > 0 || h > 0) {
            n.notify();
        }
        return f;
    },
    reverse: function() {
        const e = ce.get(this);
        if (e === void 0) {
            be.call(this);
            return this;
        }
        const t = this.length;
        const r = t / 2 | 0;
        let n = 0;
        while (n !== r) {
            const r = t - n - 1;
            const i = this[n];
            const o = e.indexMap[n];
            const a = this[r];
            const c = e.indexMap[r];
            this[n] = a;
            e.indexMap[n] = c;
            this[r] = i;
            e.indexMap[r] = o;
            n++;
        }
        e.notify();
        return this;
    },
    sort: function(e) {
        const t = ce.get(this);
        if (t === void 0) {
            we.call(this, e);
            return this;
        }
        let r = this.length;
        if (r < 2) {
            return this;
        }
        quickSort(this, t.indexMap, 0, r, preSortCompare);
        let n = 0;
        while (n < r) {
            if (this[n] === void 0) {
                break;
            }
            n++;
        }
        if (e === void 0 || !isFunction(e)) {
            e = sortCompare;
        }
        quickSort(this, t.indexMap, 0, n, e);
        let i = false;
        for (n = 0, r = t.indexMap.length; r > n; ++n) {
            if (t.indexMap[n] !== n) {
                i = true;
                break;
            }
        }
        if (i || ie) {
            t.notify();
        }
        return this;
    }
};

for (const e of ge) {
    l(xe[e], "observing", {
        value: true,
        writable: false,
        configurable: false,
        enumerable: false
    });
}

let Ee = false;

const ye = "__au_arr_on__";

function enableArrayObservation() {
    if (!(w(ye, Array) ?? false)) {
        v(ye, true, Array);
        for (const e of ge) {
            if (ue[e].observing !== true) {
                defineHiddenProp(ue, e, xe[e]);
            }
        }
    }
}

function disableArrayObservation() {
    for (const e of ge) {
        if (ue[e].observing === true) {
            defineHiddenProp(ue, e, ve[e]);
        }
    }
}

class ArrayObserver {
    constructor(e) {
        this.type = ee;
        if (!Ee) {
            Ee = true;
            enableArrayObservation();
        }
        this.indexObservers = {};
        this.collection = e;
        this.indexMap = createIndexMap(e.length);
        this.lenObs = void 0;
        ce.set(e, this);
    }
    notify() {
        const e = this.subs;
        const t = this.indexMap;
        if (ie) {
            addCollectionBatch(e, this.collection, t);
            return;
        }
        const r = this.collection;
        const n = r.length;
        this.indexMap = createIndexMap(n);
        this.subs.notifyCollection(r, t);
    }
    getLengthObserver() {
        return this.lenObs ?? (this.lenObs = new CollectionLengthObserver(this));
    }
    getIndexObserver(e) {
        var t;
        return (t = this.indexObservers)[e] ?? (t[e] = new ArrayIndexObserver(this, e));
    }
}

class ArrayIndexObserver {
    constructor(e, t) {
        this.owner = e;
        this.index = t;
        this.doNotCache = true;
        this.value = this.getValue();
    }
    getValue() {
        return this.owner.collection[this.index];
    }
    setValue(e) {
        if (e === this.getValue()) {
            return;
        }
        const t = this.owner;
        const r = this.index;
        const n = t.indexMap;
        if (n[r] > -1) {
            n.deletedIndices.push(n[r]);
        }
        n[r] = -2;
        t.collection[r] = e;
        t.notify();
    }
    handleCollectionChange(e, t) {
        const r = this.index;
        const n = t[r] === r;
        if (n) {
            return;
        }
        const i = this.value;
        const o = this.value = this.getValue();
        if (i !== o) {
            this.subs.notify(o, i);
        }
    }
    subscribe(e) {
        if (this.subs.add(e) && this.subs.count === 1) {
            this.owner.subscribe(this);
        }
    }
    unsubscribe(e) {
        if (this.subs.remove(e) && this.subs.count === 0) {
            this.owner.unsubscribe(this);
        }
    }
}

subscriberCollection(ArrayObserver);

subscriberCollection(ArrayIndexObserver);

function getArrayObserver(e) {
    let t = ce.get(e);
    if (t === void 0) {
        t = new ArrayObserver(e);
    }
    return t;
}

const Ae = Symbol.for("__au_set_obs__");

const Ce = Set[Ae] ?? defineHiddenProp(Set, Ae, new WeakMap);

const me = Set.prototype;

const ke = me.add;

const Oe = me.clear;

const Se = me.delete;

const Te = {
    add: ke,
    clear: Oe,
    delete: Se
};

const Pe = [ "add", "clear", "delete" ];

const Ie = {
    add: function(e) {
        const t = Ce.get(this);
        if (t === undefined) {
            ke.call(this, e);
            return this;
        }
        const r = this.size;
        ke.call(this, e);
        const n = this.size;
        if (n === r) {
            return this;
        }
        t.indexMap[r] = -2;
        t.notify();
        return this;
    },
    clear: function() {
        const e = Ce.get(this);
        if (e === undefined) {
            return Oe.call(this);
        }
        const t = this.size;
        if (t > 0) {
            const t = e.indexMap;
            let r = 0;
            for (const e of this.keys()) {
                if (t[r] > -1) {
                    t.deletedIndices.push(t[r]);
                    t.deletedItems.push(e);
                }
                r++;
            }
            Oe.call(this);
            t.length = 0;
            e.notify();
        }
        return undefined;
    },
    delete: function(e) {
        const t = Ce.get(this);
        if (t === undefined) {
            return Se.call(this, e);
        }
        const r = this.size;
        if (r === 0) {
            return false;
        }
        let n = 0;
        const i = t.indexMap;
        for (const r of this.keys()) {
            if (r === e) {
                if (i[n] > -1) {
                    i.deletedIndices.push(i[n]);
                    i.deletedItems.push(r);
                }
                i.splice(n, 1);
                const o = Se.call(this, e);
                if (o === true) {
                    t.notify();
                }
                return o;
            }
            n++;
        }
        return false;
    }
};

const Le = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const e of Pe) {
    l(Ie[e], "observing", {
        value: true,
        writable: false,
        configurable: false,
        enumerable: false
    });
}

let Me = false;

const Re = "__au_set_on__";

function enableSetObservation() {
    if (!(w(Re, Set) ?? false)) {
        v(Re, true, Set);
        for (const e of Pe) {
            if (me[e].observing !== true) {
                l(me, e, {
                    ...Le,
                    value: Ie[e]
                });
            }
        }
    }
}

function disableSetObservation() {
    for (const e of Pe) {
        if (me[e].observing === true) {
            l(me, e, {
                ...Le,
                value: Te[e]
            });
        }
    }
}

class SetObserver {
    constructor(e) {
        this.type = ee;
        if (!Me) {
            Me = true;
            enableSetObservation();
        }
        this.collection = e;
        this.indexMap = createIndexMap(e.size);
        this.lenObs = void 0;
        Ce.set(e, this);
    }
    notify() {
        const e = this.subs;
        const t = this.indexMap;
        if (ie) {
            addCollectionBatch(e, this.collection, t);
            return;
        }
        const r = this.collection;
        const n = r.size;
        this.indexMap = createIndexMap(n);
        this.subs.notifyCollection(r, t);
    }
    getLengthObserver() {
        return this.lenObs ?? (this.lenObs = new CollectionSizeObserver(this));
    }
}

subscriberCollection(SetObserver);

function getSetObserver(e) {
    let t = Ce.get(e);
    if (t === void 0) {
        t = new SetObserver(e);
    }
    return t;
}

const _e = Symbol.for("__au_map_obs__");

const Be = Map[_e] ?? defineHiddenProp(Map, _e, new WeakMap);

const $e = Map.prototype;

const De = $e.set;

const Fe = $e.clear;

const je = $e.delete;

const Ne = {
    set: De,
    clear: Fe,
    delete: je
};

const Ve = [ "set", "clear", "delete" ];

const Ue = {
    set: function(e, t) {
        const r = Be.get(this);
        if (r === undefined) {
            De.call(this, e, t);
            return this;
        }
        const n = this.get(e);
        const i = this.size;
        De.call(this, e, t);
        const o = this.size;
        if (o === i) {
            let t = 0;
            for (const i of this.entries()) {
                if (i[0] === e) {
                    if (i[1] !== n) {
                        r.indexMap.deletedIndices.push(r.indexMap[t]);
                        r.indexMap.deletedItems.push(i);
                        r.indexMap[t] = -2;
                        r.notify();
                    }
                    return this;
                }
                t++;
            }
            return this;
        }
        r.indexMap[i] = -2;
        r.notify();
        return this;
    },
    clear: function() {
        const e = Be.get(this);
        if (e === undefined) {
            return Fe.call(this);
        }
        const t = this.size;
        if (t > 0) {
            const t = e.indexMap;
            let r = 0;
            for (const e of this.keys()) {
                if (t[r] > -1) {
                    t.deletedIndices.push(t[r]);
                    t.deletedItems.push(e);
                }
                r++;
            }
            Fe.call(this);
            t.length = 0;
            e.notify();
        }
        return undefined;
    },
    delete: function(e) {
        const t = Be.get(this);
        if (t === undefined) {
            return je.call(this, e);
        }
        const r = this.size;
        if (r === 0) {
            return false;
        }
        let n = 0;
        const i = t.indexMap;
        for (const r of this.keys()) {
            if (r === e) {
                if (i[n] > -1) {
                    i.deletedIndices.push(i[n]);
                    i.deletedItems.push(r);
                }
                i.splice(n, 1);
                const o = je.call(this, e);
                if (o === true) {
                    t.notify();
                }
                return o;
            }
            ++n;
        }
        return false;
    }
};

const He = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const e of Ve) {
    l(Ue[e], "observing", {
        value: true,
        writable: false,
        configurable: false,
        enumerable: false
    });
}

let Ke = false;

const ze = "__au_map_on__";

function enableMapObservation() {
    if (!(w(ze, Map) ?? false)) {
        v(ze, true, Map);
        for (const e of Ve) {
            if ($e[e].observing !== true) {
                l($e, e, {
                    ...He,
                    value: Ue[e]
                });
            }
        }
    }
}

function disableMapObservation() {
    for (const e of Ve) {
        if ($e[e].observing === true) {
            l($e, e, {
                ...He,
                value: Ne[e]
            });
        }
    }
}

class MapObserver {
    constructor(e) {
        this.type = ee;
        if (!Ke) {
            Ke = true;
            enableMapObservation();
        }
        this.collection = e;
        this.indexMap = createIndexMap(e.size);
        this.lenObs = void 0;
        Be.set(e, this);
    }
    notify() {
        const e = this.subs;
        const t = this.indexMap;
        if (ie) {
            addCollectionBatch(e, this.collection, t);
            return;
        }
        const r = this.collection;
        const n = r.size;
        this.indexMap = createIndexMap(n);
        e.notifyCollection(r, t);
    }
    getLengthObserver() {
        return this.lenObs ?? (this.lenObs = new CollectionSizeObserver(this));
    }
}

subscriberCollection(MapObserver);

function getMapObserver(e) {
    let t = Be.get(e);
    if (t === void 0) {
        t = new MapObserver(e);
    }
    return t;
}

function getObserverRecord() {
    return defineHiddenProp(this, "obs", new BindingObserverRecord(this));
}

function observe(e, t) {
    this.obs.add(this.oL.getObserver(e, t));
}

function observeCollection$1(e) {
    let t;
    if (isArray(e)) {
        t = getArrayObserver(e);
    } else if (isSet(e)) {
        t = getSetObserver(e);
    } else if (isMap(e)) {
        t = getMapObserver(e);
    } else {
        throw createMappedError(210, e);
    }
    this.obs.add(t);
}

function subscribeTo(e) {
    this.obs.add(e);
}

function noopHandleChange() {
    throw createMappedError(99, "handleChange");
}

function noopHandleCollectionChange() {
    throw createMappedError(99, "handleCollectionChange");
}

class BindingObserverRecord {
    constructor(e) {
        this.version = 0;
        this.count = 0;
        this.o = new Map;
        this.b = e;
    }
    add(e) {
        if (!this.o.has(e)) {
            e.subscribe(this.b);
            ++this.count;
        }
        this.o.set(e, this.version);
    }
    clear() {
        this.o.forEach(unsubscribeStale, this);
        this.count = this.o.size;
    }
    clearAll() {
        this.o.forEach(unsubscribeAll, this);
        this.o.clear();
        this.count = 0;
    }
}

function unsubscribeAll(e, t) {
    t.unsubscribe(this.b);
}

function unsubscribeStale(e, t) {
    if (this.version !== e) {
        t.unsubscribe(this.b);
        this.o.delete(t);
    }
}

function connectableDecorator(e) {
    const t = e.prototype;
    ensureProto(t, "observe", observe);
    ensureProto(t, "observeCollection", observeCollection$1);
    ensureProto(t, "subscribeTo", subscribeTo);
    l(t, "obs", {
        get: getObserverRecord
    });
    ensureProto(t, "handleChange", noopHandleChange);
    ensureProto(t, "handleCollectionChange", noopHandleCollectionChange);
    return e;
}

function connectable(e) {
    return e == null ? connectableDecorator : connectableDecorator(e);
}

const Ge = b("IExpressionParser", (e => e.singleton(ExpressionParser)));

class ExpressionParser {
    constructor() {
        this.i = createLookup();
        this.u = createLookup();
        this.h = createLookup();
    }
    parse(e, t) {
        let r;
        switch (t) {
          case ot:
            return new CustomExpression(e);

          case tt:
            r = this.h[e];
            if (r === void 0) {
                r = this.h[e] = this.$parse(e, t);
            }
            return r;

          case st:
            r = this.u[e];
            if (r === void 0) {
                r = this.u[e] = this.$parse(e, t);
            }
            return r;

          default:
            {
                if (e.length === 0) {
                    if (t === nt || t === it) {
                        return PrimitiveLiteralExpression.$empty;
                    }
                    throw invalidEmptyExpression();
                }
                r = this.i[e];
                if (r === void 0) {
                    r = this.i[e] = this.$parse(e, t);
                }
                return r;
            }
        }
    }
    $parse(e, t) {
        at = e;
        ct = 0;
        ut = e.length;
        lt = 0;
        ht = 0;
        ft = 6291456;
        pt = "";
        dt = $charCodeAt(0);
        bt = true;
        wt = false;
        vt = true;
        gt = -1;
        return parse(61, t === void 0 ? it : t);
    }
}

function unescapeCode(e) {
    switch (e) {
      case 98:
        return 8;

      case 116:
        return 9;

      case 110:
        return 10;

      case 118:
        return 11;

      case 102:
        return 12;

      case 114:
        return 13;

      case 34:
        return 34;

      case 39:
        return 39;

      case 92:
        return 92;

      default:
        return e;
    }
}

const We = PrimitiveLiteralExpression.$false;

const qe = PrimitiveLiteralExpression.$true;

const Je = PrimitiveLiteralExpression.$null;

const Qe = PrimitiveLiteralExpression.$undefined;

const Xe = new AccessThisExpression(0);

const Ye = new AccessThisExpression(1);

const Ze = new AccessBoundaryExpression;

const et = "None";

const tt = "Interpolation";

const st = "IsIterator";

const rt = "IsChainable";

const nt = "IsFunction";

const it = "IsProperty";

const ot = "IsCustom";

let at = "";

let ct = 0;

let ut = 0;

let lt = 0;

let ht = 0;

let ft = 6291456;

let pt = "";

let dt;

let bt = true;

let wt = false;

let vt = true;

let gt = -1;

const xt = String.fromCharCode;

const $charCodeAt = e => at.charCodeAt(e);

const $tokenRaw = () => at.slice(ht, ct);

const Et = ("Infinity NaN isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent" + " Array BigInt Boolean Date Map Number Object RegExp Set String JSON Math Intl").split(" ");

function parseExpression(e, t) {
    at = e;
    ct = 0;
    ut = e.length;
    lt = 0;
    ht = 0;
    ft = 6291456;
    pt = "";
    dt = $charCodeAt(0);
    bt = true;
    wt = false;
    vt = true;
    gt = -1;
    return parse(61, t === void 0 ? it : t);
}

function parse(e, t) {
    if (t === ot) {
        return new CustomExpression(at);
    }
    if (ct === 0) {
        if (t === tt) {
            return parseInterpolation();
        }
        nextToken();
        if (ft & 4194304) {
            throw invalidStartOfExpression();
        }
    }
    bt = 513 > e;
    wt = false;
    vt = 514 > e;
    let r = false;
    let n = void 0;
    let i = 0;
    if (ft & 131072) {
        const e = At[ft & 63];
        nextToken();
        n = new UnaryExpression(e, parse(514, t));
        bt = false;
    } else {
        e: switch (ft) {
          case 12295:
            i = lt;
            bt = false;
            vt = false;
            do {
                nextToken();
                ++i;
                switch (ft) {
                  case 65546:
                    nextToken();
                    if ((ft & 12288) === 0) {
                        throw expectedIdentifier();
                    }
                    break;

                  case 11:
                  case 12:
                    throw expectedIdentifier();

                  case 2162701:
                    wt = true;
                    nextToken();
                    if ((ft & 12288) === 0) {
                        n = i === 0 ? Xe : i === 1 ? Ye : new AccessThisExpression(i);
                        r = true;
                        break e;
                    }
                    break;

                  default:
                    if (ft & 2097152) {
                        n = i === 0 ? Xe : i === 1 ? Ye : new AccessThisExpression(i);
                        break e;
                    }
                    throw invalidMemberExpression();
                }
            } while (ft === 12295);

          case 4096:
            {
                const e = pt;
                if (t === st) {
                    n = new BindingIdentifier(e);
                } else if (vt && Et.includes(e)) {
                    n = new AccessGlobalExpression(e);
                } else if (vt && e === "import") {
                    throw unexpectedImportKeyword();
                } else {
                    n = new AccessScopeExpression(e, i);
                }
                bt = !wt;
                nextToken();
                if (consumeOpt(51)) {
                    if (ft === 524297) {
                        throw functionBodyInArrowFn();
                    }
                    const t = wt;
                    const r = lt;
                    ++lt;
                    const i = parse(62, et);
                    wt = t;
                    lt = r;
                    bt = false;
                    n = new ArrowFunction([ new BindingIdentifier(e) ], i);
                }
                break;
            }

          case 11:
            throw unexpectedDoubleDot();

          case 12:
            throw invalidSpreadOp();

          case 12292:
            bt = false;
            nextToken();
            switch (lt) {
              case 0:
                n = Xe;
                break;

              case 1:
                n = Ye;
                break;

              default:
                n = new AccessThisExpression(lt);
                break;
            }
            break;

          case 12293:
            bt = false;
            nextToken();
            n = Ze;
            break;

          case 2688008:
            n = parseCoverParenthesizedExpressionAndArrowParameterList(t);
            break;

          case 2688019:
            n = at.search(/\s+of\s+/) > ct ? parseArrayDestructuring() : parseArrayLiteralExpression(t);
            break;

          case 524297:
            n = parseObjectLiteralExpression(t);
            break;

          case 2163760:
            n = new TemplateExpression([ pt ]);
            bt = false;
            nextToken();
            break;

          case 2163761:
            n = parseTemplate(t, n, false);
            break;

          case 16384:
          case 32768:
            n = new PrimitiveLiteralExpression(pt);
            bt = false;
            nextToken();
            break;

          case 8194:
          case 8195:
          case 8193:
          case 8192:
            n = At[ft & 63];
            bt = false;
            nextToken();
            break;

          default:
            if (ct >= ut) {
                throw unexpectedEndOfExpression();
            } else {
                throw unconsumedToken();
            }
        }
        if (t === st) {
            return parseForOfStatement(n);
        }
        if (514 < e) {
            return n;
        }
        if (ft === 11 || ft === 12) {
            throw expectedIdentifier();
        }
        if (n.$kind === x) {
            switch (ft) {
              case 2162701:
                wt = true;
                bt = false;
                nextToken();
                if ((ft & 13312) === 0) {
                    throw unexpectedTokenInOptionalChain();
                }
                if (ft & 12288) {
                    n = new AccessScopeExpression(pt, n.ancestor);
                    nextToken();
                } else if (ft === 2688008) {
                    n = new CallFunctionExpression(n, parseArguments(), true);
                } else if (ft === 2688019) {
                    n = parseKeyedExpression(n, true);
                } else {
                    throw invalidTaggedTemplateOnOptionalChain();
                }
                break;

              case 65546:
                bt = !wt;
                nextToken();
                if ((ft & 12288) === 0) {
                    throw expectedIdentifier();
                }
                n = new AccessScopeExpression(pt, n.ancestor);
                nextToken();
                break;

              case 11:
              case 12:
                throw expectedIdentifier();

              case 2688008:
                n = new CallFunctionExpression(n, parseArguments(), r);
                break;

              case 2688019:
                n = parseKeyedExpression(n, r);
                break;

              case 2163760:
                n = createTemplateTail(n);
                break;

              case 2163761:
                n = parseTemplate(t, n, true);
                break;
            }
        }
        while ((ft & 65536) > 0) {
            switch (ft) {
              case 2162701:
                n = parseOptionalChainLHS(n);
                break;

              case 65546:
                nextToken();
                if ((ft & 12288) === 0) {
                    throw expectedIdentifier();
                }
                n = parseMemberExpressionLHS(n, false);
                break;

              case 11:
              case 12:
                throw expectedIdentifier();

              case 2688008:
                if (n.$kind === A) {
                    n = new CallScopeExpression(n.name, parseArguments(), n.ancestor, false);
                } else if (n.$kind === M) {
                    n = new CallMemberExpression(n.object, n.name, parseArguments(), n.optional, false);
                } else if (n.$kind === y) {
                    n = new CallGlobalExpression(n.name, parseArguments());
                } else {
                    n = new CallFunctionExpression(n, parseArguments(), false);
                }
                break;

              case 2688019:
                n = parseKeyedExpression(n, false);
                break;

              case 2163760:
                if (wt) {
                    throw invalidTaggedTemplateOnOptionalChain();
                }
                n = createTemplateTail(n);
                break;

              case 2163761:
                if (wt) {
                    throw invalidTaggedTemplateOnOptionalChain();
                }
                n = parseTemplate(t, n, true);
                break;
            }
        }
    }
    if (ft === 11 || ft === 12) {
        throw expectedIdentifier();
    }
    if (513 < e) {
        return n;
    }
    while ((ft & 262144) > 0) {
        const r = ft;
        if ((r & 960) <= e) {
            break;
        }
        nextToken();
        n = new BinaryExpression(At[r & 63], n, parse(r & 960, t));
        bt = false;
    }
    if (63 < e) {
        return n;
    }
    if (consumeOpt(6291479)) {
        const e = parse(62, t);
        consume(6291477);
        n = new ConditionalExpression(n, e, parse(62, t));
        bt = false;
    }
    if (62 < e) {
        return n;
    }
    if (consumeOpt(4194350)) {
        if (!bt) {
            throw lhsNotAssignable();
        }
        n = new AssignExpression(n, parse(62, t));
    }
    if (61 < e) {
        return n;
    }
    while (consumeOpt(6291481)) {
        if (ft === 6291456) {
            throw expectedValueConverterIdentifier();
        }
        const e = pt;
        nextToken();
        const r = new Array;
        while (consumeOpt(6291477)) {
            r.push(parse(62, t));
        }
        n = new ValueConverterExpression(n, e, r);
    }
    while (consumeOpt(6291480)) {
        if (ft === 6291456) {
            throw expectedBindingBehaviorIdentifier();
        }
        const e = pt;
        nextToken();
        const r = new Array;
        while (consumeOpt(6291477)) {
            r.push(parse(62, t));
        }
        n = new BindingBehaviorExpression(n, e, r);
    }
    if (ft !== 6291456) {
        if (t === tt && ft === 7340046) {
            return n;
        }
        if (t === rt && ft === 6291478) {
            if (ct === ut) {
                throw unconsumedToken();
            }
            gt = ct - 1;
            return n;
        }
        if ($tokenRaw() === "of") {
            throw unexpectedOfKeyword();
        }
        throw unconsumedToken();
    }
    return n;
}

function parseArrayDestructuring() {
    const e = [];
    const t = new DestructuringAssignmentExpression(G, e, void 0, void 0);
    let r = "";
    let n = true;
    let i = 0;
    while (n) {
        nextToken();
        switch (ft) {
          case 7340052:
            n = false;
            addItem();
            break;

          case 6291472:
            addItem();
            break;

          case 4096:
            r = $tokenRaw();
            break;

          default:
            throw unexpectedTokenInDestructuring();
        }
    }
    consume(7340052);
    return t;
    function addItem() {
        if (r !== "") {
            e.push(new DestructuringAssignmentSingleExpression(new AccessMemberExpression(Xe, r), new AccessKeyedExpression(Xe, new PrimitiveLiteralExpression(i++)), void 0));
            r = "";
        } else {
            i++;
        }
    }
}

function parseArguments() {
    const e = wt;
    nextToken();
    const t = [];
    while (ft !== 7340047) {
        t.push(parse(62, et));
        if (!consumeOpt(6291472)) {
            break;
        }
    }
    consume(7340047);
    bt = false;
    wt = e;
    return t;
}

function parseKeyedExpression(e, t) {
    const r = wt;
    nextToken();
    e = new AccessKeyedExpression(e, parse(62, et), t);
    consume(7340052);
    bt = !r;
    wt = r;
    return e;
}

function parseOptionalChainLHS(e) {
    wt = true;
    bt = false;
    nextToken();
    if ((ft & 13312) === 0) {
        throw unexpectedTokenInOptionalChain();
    }
    if (ft & 12288) {
        return parseMemberExpressionLHS(e, true);
    }
    if (ft === 2688008) {
        if (e.$kind === A) {
            return new CallScopeExpression(e.name, parseArguments(), e.ancestor, true);
        } else if (e.$kind === M) {
            return new CallMemberExpression(e.object, e.name, parseArguments(), e.optional, true);
        } else {
            return new CallFunctionExpression(e, parseArguments(), true);
        }
    }
    if (ft === 2688019) {
        return parseKeyedExpression(e, true);
    }
    throw invalidTaggedTemplateOnOptionalChain();
}

function parseMemberExpressionLHS(e, t) {
    const r = pt;
    switch (ft) {
      case 2162701:
        {
            wt = true;
            bt = false;
            const n = ct;
            const i = ht;
            const o = ft;
            const a = dt;
            const c = pt;
            const u = bt;
            const l = wt;
            nextToken();
            if ((ft & 13312) === 0) {
                throw unexpectedTokenInOptionalChain();
            }
            if (ft === 2688008) {
                return new CallMemberExpression(e, r, parseArguments(), t, true);
            }
            ct = n;
            ht = i;
            ft = o;
            dt = a;
            pt = c;
            bt = u;
            wt = l;
            return new AccessMemberExpression(e, r, t);
        }

      case 2688008:
        {
            bt = false;
            return new CallMemberExpression(e, r, parseArguments(), t, false);
        }

      default:
        {
            bt = !wt;
            nextToken();
            return new AccessMemberExpression(e, r, t);
        }
    }
}

function parseCoverParenthesizedExpressionAndArrowParameterList(e) {
    nextToken();
    const t = ct;
    const r = ht;
    const n = ft;
    const i = dt;
    const o = pt;
    const a = bt;
    const c = wt;
    const u = [];
    let l = 1;
    let h = false;
    e: while (true) {
        if (ft === 12) {
            nextToken();
            if (ft !== 4096) {
                throw expectedIdentifier();
            }
            u.push(new BindingIdentifier(pt));
            nextToken();
            if (ft === 6291472) {
                throw restParamsMustBeLastParam();
            }
            if (ft !== 7340047) {
                throw invalidSpreadOp();
            }
            nextToken();
            if (ft !== 51) {
                throw invalidSpreadOp();
            }
            nextToken();
            const e = wt;
            const t = lt;
            ++lt;
            const r = parse(62, et);
            wt = e;
            lt = t;
            bt = false;
            return new ArrowFunction(u, r, true);
        }
        switch (ft) {
          case 4096:
            u.push(new BindingIdentifier(pt));
            nextToken();
            break;

          case 7340047:
            nextToken();
            break e;

          case 524297:
          case 2688019:
            nextToken();
            l = 4;
            break;

          case 6291472:
            l = 2;
            h = true;
            break e;

          case 2688008:
            l = 2;
            break e;

          default:
            nextToken();
            l = 2;
            break;
        }
        switch (ft) {
          case 6291472:
            nextToken();
            h = true;
            if (l === 1) {
                break;
            }
            break e;

          case 7340047:
            nextToken();
            break e;

          case 4194350:
            if (l === 1) {
                l = 3;
            }
            break e;

          case 51:
            if (h) {
                throw invalidArrowParameterList();
            }
            nextToken();
            l = 2;
            break e;

          default:
            if (l === 1) {
                l = 2;
            }
            break e;
        }
    }
    if (ft === 51) {
        if (l === 1) {
            nextToken();
            if (ft === 524297) {
                throw functionBodyInArrowFn();
            }
            const e = wt;
            const t = lt;
            ++lt;
            const r = parse(62, et);
            wt = e;
            lt = t;
            bt = false;
            return new ArrowFunction(u, r);
        }
        throw invalidArrowParameterList();
    } else if (l === 1 && u.length === 0) {
        throw missingExpectedToken();
    }
    if (h) {
        switch (l) {
          case 2:
            throw invalidArrowParameterList();

          case 3:
            throw defaultParamsInArrowFn();

          case 4:
            throw destructuringParamsInArrowFn();
        }
    }
    ct = t;
    ht = r;
    ft = n;
    dt = i;
    pt = o;
    bt = a;
    wt = c;
    const f = wt;
    const p = parse(62, e);
    wt = f;
    consume(7340047);
    if (ft === 51) {
        switch (l) {
          case 2:
            throw invalidArrowParameterList();

          case 3:
            throw defaultParamsInArrowFn();

          case 4:
            throw destructuringParamsInArrowFn();
        }
    }
    return p;
}

function parseArrayLiteralExpression(e) {
    const t = wt;
    nextToken();
    const r = new Array;
    while (ft !== 7340052) {
        if (consumeOpt(6291472)) {
            r.push(Qe);
            if (ft === 7340052) {
                break;
            }
        } else {
            r.push(parse(62, e === st ? et : e));
            if (consumeOpt(6291472)) {
                if (ft === 7340052) {
                    break;
                }
            } else {
                break;
            }
        }
    }
    wt = t;
    consume(7340052);
    if (e === st) {
        return new ArrayBindingPattern(r);
    } else {
        bt = false;
        return new ArrayLiteralExpression(r);
    }
}

const yt = [ V, U, H, G, W ];

function parseForOfStatement(e) {
    if (!yt.includes(e.$kind)) {
        throw invalidLHSBindingIdentifierInForOf(e.$kind);
    }
    if (ft !== 4204594) {
        throw invalidLHSBindingIdentifierInForOf(e.$kind);
    }
    nextToken();
    const t = e;
    const r = parse(61, rt);
    return new ForOfStatement(t, r, gt);
}

function parseObjectLiteralExpression(e) {
    const t = wt;
    const r = new Array;
    const n = new Array;
    nextToken();
    while (ft !== 7340046) {
        r.push(pt);
        if (ft & 49152) {
            nextToken();
            consume(6291477);
            n.push(parse(62, e === st ? et : e));
        } else if (ft & 12288) {
            const t = dt;
            const r = ft;
            const i = ct;
            nextToken();
            if (consumeOpt(6291477)) {
                n.push(parse(62, e === st ? et : e));
            } else {
                dt = t;
                ft = r;
                ct = i;
                n.push(parse(515, e === st ? et : e));
            }
        } else {
            throw invalidPropDefInObjLiteral();
        }
        if (ft !== 7340046) {
            consume(6291472);
        }
    }
    wt = t;
    consume(7340046);
    if (e === st) {
        return new ObjectBindingPattern(r, n);
    } else {
        bt = false;
        return new ObjectLiteralExpression(r, n);
    }
}

function parseInterpolation() {
    const e = [];
    const t = [];
    const r = ut;
    let n = "";
    while (ct < r) {
        switch (dt) {
          case 36:
            if ($charCodeAt(ct + 1) === 123) {
                e.push(n);
                n = "";
                ct += 2;
                dt = $charCodeAt(ct);
                nextToken();
                const r = parse(61, tt);
                t.push(r);
                continue;
            } else {
                n += "$";
            }
            break;

          case 92:
            n += xt(unescapeCode(nextChar()));
            break;

          default:
            n += xt(dt);
        }
        nextChar();
    }
    if (t.length) {
        e.push(n);
        return new Interpolation(e, t);
    }
    return null;
}

function parseTemplate(e, t, r) {
    const n = wt;
    const i = [ pt ];
    consume(2163761);
    const o = [ parse(62, e) ];
    while ((ft = scanTemplateTail()) !== 2163760) {
        i.push(pt);
        consume(2163761);
        o.push(parse(62, e));
    }
    i.push(pt);
    bt = false;
    wt = n;
    if (r) {
        nextToken();
        return new TaggedTemplateExpression(i, i, t, o);
    } else {
        nextToken();
        return new TemplateExpression(i, o);
    }
}

function createTemplateTail(e) {
    bt = false;
    const t = [ pt ];
    nextToken();
    return new TaggedTemplateExpression(t, t, e);
}

function nextToken() {
    while (ct < ut) {
        ht = ct;
        if ((ft = St[dt]()) != null) {
            return;
        }
    }
    ft = 6291456;
}

function nextChar() {
    return dt = $charCodeAt(++ct);
}

function scanIdentifier() {
    while (Ot[nextChar()]) ;
    const e = Ct[pt = $tokenRaw()];
    return e === undefined ? 4096 : e;
}

function scanNumber(e) {
    let t = dt;
    if (e === false) {
        do {
            t = nextChar();
        } while (t <= 57 && t >= 48);
        if (t !== 46) {
            pt = parseInt($tokenRaw(), 10);
            return 32768;
        }
        t = nextChar();
        if (ct >= ut) {
            pt = parseInt($tokenRaw().slice(0, -1), 10);
            return 32768;
        }
    }
    if (t <= 57 && t >= 48) {
        do {
            t = nextChar();
        } while (t <= 57 && t >= 48);
    } else {
        dt = $charCodeAt(--ct);
    }
    pt = parseFloat($tokenRaw());
    return 32768;
}

function scanString() {
    const e = dt;
    nextChar();
    let t = 0;
    const r = new Array;
    let n = ct;
    while (dt !== e) {
        if (dt === 92) {
            r.push(at.slice(n, ct));
            nextChar();
            t = unescapeCode(dt);
            nextChar();
            r.push(xt(t));
            n = ct;
        } else if (ct >= ut) {
            throw unterminatedStringLiteral();
        } else {
            nextChar();
        }
    }
    const i = at.slice(n, ct);
    nextChar();
    r.push(i);
    const o = r.join("");
    pt = o;
    return 16384;
}

function scanTemplate() {
    let e = true;
    let t = "";
    while (nextChar() !== 96) {
        if (dt === 36) {
            if (ct + 1 < ut && $charCodeAt(ct + 1) === 123) {
                ct++;
                e = false;
                break;
            } else {
                t += "$";
            }
        } else if (dt === 92) {
            t += xt(unescapeCode(nextChar()));
        } else {
            if (ct >= ut) {
                throw unterminatedTemplateLiteral();
            }
            t += xt(dt);
        }
    }
    nextChar();
    pt = t;
    if (e) {
        return 2163760;
    }
    return 2163761;
}

const scanTemplateTail = () => {
    if (ct >= ut) {
        throw unterminatedTemplateLiteral();
    }
    ct--;
    return scanTemplate();
};

const consumeOpt = e => {
    if (ft === e) {
        nextToken();
        return true;
    }
    return false;
};

const consume = e => {
    if (ft === e) {
        nextToken();
    } else {
        throw missingExpectedToken();
    }
};

const invalidStartOfExpression = () => createMappedError(151, at);

const invalidSpreadOp = () => createMappedError(152, at);

const expectedIdentifier = () => createMappedError(153, at);

const invalidMemberExpression = () => createMappedError(154, at);

const unexpectedEndOfExpression = () => createMappedError(155, at);

const unconsumedToken = () => createMappedError(156, $tokenRaw(), ct, at);

const invalidEmptyExpression = () => createMappedError(157);

const lhsNotAssignable = () => createMappedError(158, at);

const expectedValueConverterIdentifier = () => createMappedError(159, at);

const expectedBindingBehaviorIdentifier = () => createMappedError(160, at);

const unexpectedOfKeyword = () => createMappedError(161, at);

const unexpectedImportKeyword = () => createMappedError(162, at);

const invalidLHSBindingIdentifierInForOf = e => createMappedError(163, at, e);

const invalidPropDefInObjLiteral = () => createMappedError(164, at);

const unterminatedStringLiteral = () => createMappedError(165, at);

const unterminatedTemplateLiteral = () => createMappedError(166, at);

const missingExpectedToken = e => createMappedError(167, at);

const unexpectedCharacter = () => {
    throw createMappedError(168, at);
};

unexpectedCharacter.notMapped = true;

const unexpectedTokenInDestructuring = () => createMappedError(170, at);

const unexpectedTokenInOptionalChain = () => createMappedError(171, at);

const invalidTaggedTemplateOnOptionalChain = () => createMappedError(172, at);

const invalidArrowParameterList = () => createMappedError(173, at);

const defaultParamsInArrowFn = () => createMappedError(174, at);

const destructuringParamsInArrowFn = () => createMappedError(175, at);

const restParamsMustBeLastParam = () => createMappedError(176, at);

const functionBodyInArrowFn = () => createMappedError(178, at);

const unexpectedDoubleDot = () => createMappedError(179, at);

const At = [ We, qe, Je, Qe, "this", "$this", null, "$parent", "(", "{", ".", "..", "...", "?.", "}", ")", ",", "[", "]", ":", ";", "?", "'", '"', "&", "|", "??", "||", "&&", "==", "!=", "===", "!==", "<", ">", "<=", ">=", "in", "instanceof", "+", "-", "typeof", "void", "*", "%", "/", "=", "!", 2163760, 2163761, "of", "=>" ];

const Ct = f(Object.create(null), {
    true: 8193,
    null: 8194,
    false: 8192,
    undefined: 8195,
    this: 12293,
    $this: 12292,
    $parent: 12295,
    in: 6562213,
    instanceof: 6562214,
    typeof: 139305,
    void: 139306,
    of: 4204594
});

const mt = {
    AsciiIdPart: [ 36, 0, 48, 58, 65, 91, 95, 0, 97, 123 ],
    IdStart: [ 36, 0, 65, 91, 95, 0, 97, 123, 170, 0, 186, 0, 192, 215, 216, 247, 248, 697, 736, 741, 7424, 7462, 7468, 7517, 7522, 7526, 7531, 7544, 7545, 7615, 7680, 7936, 8305, 0, 8319, 0, 8336, 8349, 8490, 8492, 8498, 0, 8526, 0, 8544, 8585, 11360, 11392, 42786, 42888, 42891, 42927, 42928, 42936, 42999, 43008, 43824, 43867, 43868, 43877, 64256, 64263, 65313, 65339, 65345, 65371 ],
    Digit: [ 48, 58 ],
    Skip: [ 0, 33, 127, 161 ]
};

const decompress = (e, t, r, n) => {
    const i = r.length;
    for (let o = 0; o < i; o += 2) {
        const i = r[o];
        let a = r[o + 1];
        a = a > 0 ? a : i + 1;
        if (e) {
            e.fill(n, i, a);
        }
        if (t) {
            for (let e = i; e < a; e++) {
                t.add(e);
            }
        }
    }
};

const returnToken = e => () => {
    nextChar();
    return e;
};

const kt = new Set;

decompress(null, kt, mt.AsciiIdPart, true);

const Ot = new Uint8Array(65535);

decompress(Ot, null, mt.IdStart, 1);

decompress(Ot, null, mt.Digit, 1);

const St = new Array(65535);

St.fill(unexpectedCharacter, 0, 65535);

decompress(St, null, mt.Skip, (() => {
    nextChar();
    return null;
}));

decompress(St, null, mt.IdStart, scanIdentifier);

decompress(St, null, mt.Digit, (() => scanNumber(false)));

St[34] = St[39] = () => scanString();

St[96] = () => scanTemplate();

St[33] = () => {
    if (nextChar() !== 61) {
        return 131119;
    }
    if (nextChar() !== 61) {
        return 6553950;
    }
    nextChar();
    return 6553952;
};

St[61] = () => {
    if (nextChar() === 62) {
        nextChar();
        return 51;
    }
    if (dt !== 61) {
        return 4194350;
    }
    if (nextChar() !== 61) {
        return 6553949;
    }
    nextChar();
    return 6553951;
};

St[38] = () => {
    if (nextChar() !== 38) {
        return 6291480;
    }
    nextChar();
    return 6553884;
};

St[124] = () => {
    if (nextChar() !== 124) {
        return 6291481;
    }
    nextChar();
    return 6553819;
};

St[63] = () => {
    if (nextChar() === 46) {
        const e = $charCodeAt(ct + 1);
        if (e <= 48 || e >= 57) {
            nextChar();
            return 2162701;
        }
        return 6291479;
    }
    if (dt !== 63) {
        return 6291479;
    }
    nextChar();
    return 6553754;
};

St[46] = () => {
    if (nextChar() <= 57 && dt >= 48) {
        return scanNumber(true);
    }
    if (dt === 46) {
        if (nextChar() !== 46) {
            return 11;
        }
        nextChar();
        return 12;
    }
    return 65546;
};

St[60] = () => {
    if (nextChar() !== 61) {
        return 6554017;
    }
    nextChar();
    return 6554019;
};

St[62] = () => {
    if (nextChar() !== 61) {
        return 6554018;
    }
    nextChar();
    return 6554020;
};

St[37] = returnToken(6554156);

St[40] = returnToken(2688008);

St[41] = returnToken(7340047);

St[42] = returnToken(6554155);

St[43] = returnToken(2490855);

St[44] = returnToken(6291472);

St[45] = returnToken(2490856);

St[47] = returnToken(6554157);

St[58] = returnToken(6291477);

St[59] = returnToken(6291478);

St[91] = returnToken(2688019);

St[93] = returnToken(7340052);

St[123] = returnToken(524297);

St[125] = returnToken(7340046);

let Tt = null;

const Pt = [];

let It = false;

function pauseConnecting() {
    It = false;
}

function resumeConnecting() {
    It = true;
}

function currentConnectable() {
    return Tt;
}

function enterConnectable(e) {
    if (e == null) {
        throw createMappedError(206);
    }
    if (Tt == null) {
        Tt = e;
        Pt[0] = Tt;
        It = true;
        return;
    }
    if (Tt === e) {
        throw createMappedError(207);
    }
    Pt.push(e);
    Tt = e;
    It = true;
}

function exitConnectable(e) {
    if (e == null) {
        throw createMappedError(208);
    }
    if (Tt !== e) {
        throw createMappedError(209);
    }
    Pt.pop();
    Tt = Pt.length > 0 ? Pt[Pt.length - 1] : null;
    It = Tt != null;
}

const Lt = /*@__PURE__*/ p({
    get current() {
        return Tt;
    },
    get connecting() {
        return It;
    },
    enter: enterConnectable,
    exit: exitConnectable,
    pause: pauseConnecting,
    resume: resumeConnecting
});

const Mt = Reflect.get;

const Rt = Object.prototype.toString;

const _t = new WeakMap;

const Bt = "__au_nw__";

const $t = "__au_nw";

function canWrap(e) {
    switch (Rt.call(e)) {
      case "[object Object]":
        return e.constructor[Bt] !== true;

      case "[object Array]":
      case "[object Map]":
      case "[object Set]":
        return true;

      default:
        return false;
    }
}

const Dt = "__raw__";

function wrap(e) {
    return canWrap(e) ? getProxy(e) : e;
}

function getProxy(e) {
    return _t.get(e) ?? createProxy(e);
}

function getRaw(e) {
    return e[Dt] ?? e;
}

function unwrap(e) {
    return canWrap(e) && e[Dt] || e;
}

function doNotCollect(e, t) {
    return t === "constructor" || t === "__proto__" || t === "$observers" || t === Symbol.toPrimitive || t === Symbol.toStringTag || e.constructor[`${$t}_${d(t)}__`] === true;
}

function createProxy(e) {
    const t = isArray(e) ? jt : isMap(e) || isSet(e) ? Nt : Ft;
    const r = new Proxy(e, t);
    _t.set(e, r);
    _t.set(r, r);
    return r;
}

const Ft = {
    get(e, t, r) {
        if (t === Dt) {
            return e;
        }
        const n = currentConnectable();
        if (!It || doNotCollect(e, t) || n == null) {
            return Mt(e, t, r);
        }
        n.observe(e, t);
        return wrap(Mt(e, t, r));
    }
};

const jt = {
    get(e, t, r) {
        if (t === Dt) {
            return e;
        }
        if (!It || doNotCollect(e, t) || Tt == null) {
            return Mt(e, t, r);
        }
        switch (t) {
          case "length":
            Tt.observe(e, "length");
            return e.length;

          case "map":
            return wrappedArrayMap;

          case "includes":
            return wrappedArrayIncludes;

          case "indexOf":
            return wrappedArrayIndexOf;

          case "lastIndexOf":
            return wrappedArrayLastIndexOf;

          case "every":
            return wrappedArrayEvery;

          case "filter":
            return wrappedArrayFilter;

          case "find":
            return wrappedArrayFind;

          case "findIndex":
            return wrappedArrayFindIndex;

          case "flat":
            return wrappedArrayFlat;

          case "flatMap":
            return wrappedArrayFlatMap;

          case "join":
            return wrappedArrayJoin;

          case "push":
            return wrappedArrayPush;

          case "pop":
            return wrappedArrayPop;

          case "reduce":
            return wrappedReduce;

          case "reduceRight":
            return wrappedReduceRight;

          case "reverse":
            return wrappedArrayReverse;

          case "shift":
            return wrappedArrayShift;

          case "unshift":
            return wrappedArrayUnshift;

          case "slice":
            return wrappedArraySlice;

          case "splice":
            return wrappedArraySplice;

          case "some":
            return wrappedArraySome;

          case "sort":
            return wrappedArraySort;

          case "keys":
            return wrappedKeys;

          case "values":
          case Symbol.iterator:
            return wrappedValues;

          case "entries":
            return wrappedEntries;
        }
        Tt.observe(e, t);
        return wrap(Mt(e, t, r));
    },
    ownKeys(e) {
        currentConnectable()?.observe(e, "length");
        return Reflect.ownKeys(e);
    }
};

function wrappedArrayMap(e, t) {
    const r = getRaw(this);
    const n = r.map(((r, n) => unwrap(e.call(t, wrap(r), n, this))));
    observeCollection(Tt, r);
    return wrap(n);
}

function wrappedArrayEvery(e, t) {
    const r = getRaw(this);
    const n = r.every(((r, n) => e.call(t, wrap(r), n, this)));
    observeCollection(Tt, r);
    return n;
}

function wrappedArrayFilter(e, t) {
    const r = getRaw(this);
    const n = r.filter(((r, n) => unwrap(e.call(t, wrap(r), n, this))));
    observeCollection(Tt, r);
    return wrap(n);
}

function wrappedArrayIncludes(e) {
    const t = getRaw(this);
    const r = t.includes(unwrap(e));
    observeCollection(Tt, t);
    return r;
}

function wrappedArrayIndexOf(e) {
    const t = getRaw(this);
    const r = t.indexOf(unwrap(e));
    observeCollection(Tt, t);
    return r;
}

function wrappedArrayLastIndexOf(e) {
    const t = getRaw(this);
    const r = t.lastIndexOf(unwrap(e));
    observeCollection(Tt, t);
    return r;
}

function wrappedArrayFindIndex(e, t) {
    const r = getRaw(this);
    const n = r.findIndex(((r, n) => unwrap(e.call(t, wrap(r), n, this))));
    observeCollection(Tt, r);
    return n;
}

function wrappedArrayFind(e, t) {
    const r = getRaw(this);
    const n = r.find(((t, r) => e(wrap(t), r, this)), t);
    observeCollection(Tt, r);
    return wrap(n);
}

function wrappedArrayFlat() {
    const e = getRaw(this);
    observeCollection(Tt, e);
    return wrap(e.flat());
}

function wrappedArrayFlatMap(e, t) {
    const r = getRaw(this);
    observeCollection(Tt, r);
    return getProxy(r.flatMap(((r, n) => wrap(e.call(t, wrap(r), n, this)))));
}

function wrappedArrayJoin(e) {
    const t = getRaw(this);
    observeCollection(Tt, t);
    return t.join(e);
}

function wrappedArrayPop() {
    return wrap(getRaw(this).pop());
}

function wrappedArrayPush(...e) {
    return getRaw(this).push(...e);
}

function wrappedArrayShift() {
    return wrap(getRaw(this).shift());
}

function wrappedArrayUnshift(...e) {
    return getRaw(this).unshift(...e);
}

function wrappedArraySplice(...e) {
    return wrap(getRaw(this).splice(...e));
}

function wrappedArrayReverse(...e) {
    const t = getRaw(this);
    const r = t.reverse();
    observeCollection(Tt, t);
    return wrap(r);
}

function wrappedArraySome(e, t) {
    const r = getRaw(this);
    const n = r.some(((r, n) => unwrap(e.call(t, wrap(r), n, this))));
    observeCollection(Tt, r);
    return n;
}

function wrappedArraySort(e) {
    const t = getRaw(this);
    const r = t.sort(e);
    observeCollection(Tt, t);
    return wrap(r);
}

function wrappedArraySlice(e, t) {
    const r = getRaw(this);
    observeCollection(Tt, r);
    return getProxy(r.slice(e, t));
}

function wrappedReduce(e, t) {
    const r = getRaw(this);
    const n = r.reduce(((t, r, n) => e(t, wrap(r), n, this)), t);
    observeCollection(Tt, r);
    return wrap(n);
}

function wrappedReduceRight(e, t) {
    const r = getRaw(this);
    const n = r.reduceRight(((t, r, n) => e(t, wrap(r), n, this)), t);
    observeCollection(Tt, r);
    return wrap(n);
}

const Nt = {
    get(e, t, r) {
        if (t === Dt) {
            return e;
        }
        const n = currentConnectable();
        if (!It || doNotCollect(e, t) || n == null) {
            return Mt(e, t, r);
        }
        switch (t) {
          case "size":
            n.observe(e, "size");
            return e.size;

          case "clear":
            return wrappedClear;

          case "delete":
            return wrappedDelete;

          case "forEach":
            return wrappedForEach;

          case "add":
            if (isSet(e)) {
                return wrappedAdd;
            }
            break;

          case "get":
            if (isMap(e)) {
                return wrappedGet;
            }
            break;

          case "set":
            if (isMap(e)) {
                return wrappedSet;
            }
            break;

          case "has":
            return wrappedHas;

          case "keys":
            return wrappedKeys;

          case "values":
            return wrappedValues;

          case "entries":
            return wrappedEntries;

          case Symbol.iterator:
            return isMap(e) ? wrappedEntries : wrappedValues;
        }
        return wrap(Mt(e, t, r));
    }
};

function wrappedForEach(e, t) {
    const r = getRaw(this);
    observeCollection(Tt, r);
    return r.forEach(((r, n) => {
        e.call(t, wrap(r), wrap(n), this);
    }));
}

function wrappedHas(e) {
    const t = getRaw(this);
    observeCollection(Tt, t);
    return t.has(unwrap(e));
}

function wrappedGet(e) {
    const t = getRaw(this);
    observeCollection(Tt, t);
    return wrap(t.get(unwrap(e)));
}

function wrappedSet(e, t) {
    return wrap(getRaw(this).set(unwrap(e), unwrap(t)));
}

function wrappedAdd(e) {
    return wrap(getRaw(this).add(unwrap(e)));
}

function wrappedClear() {
    return wrap(getRaw(this).clear());
}

function wrappedDelete(e) {
    return wrap(getRaw(this).delete(unwrap(e)));
}

function wrappedKeys() {
    const e = getRaw(this);
    observeCollection(Tt, e);
    const t = e.keys();
    return {
        next() {
            const e = t.next();
            const r = e.value;
            const n = e.done;
            return n ? {
                value: void 0,
                done: n
            } : {
                value: wrap(r),
                done: n
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

function wrappedValues() {
    const e = getRaw(this);
    observeCollection(Tt, e);
    const t = e.values();
    return {
        next() {
            const e = t.next();
            const r = e.value;
            const n = e.done;
            return n ? {
                value: void 0,
                done: n
            } : {
                value: wrap(r),
                done: n
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

function wrappedEntries() {
    const e = getRaw(this);
    observeCollection(Tt, e);
    const t = e.entries();
    return {
        next() {
            const e = t.next();
            const r = e.value;
            const n = e.done;
            return n ? {
                value: void 0,
                done: n
            } : {
                value: [ wrap(r[0]), wrap(r[1]) ],
                done: n
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

const observeCollection = (e, t) => e?.observeCollection(t);

const Vt = /*@__PURE__*/ p({
    getProxy: getProxy,
    getRaw: getRaw,
    wrap: wrap,
    unwrap: unwrap,
    rawKey: Dt
});

class ComputedObserver {
    constructor(e, t, r, n, i) {
        this.type = ee;
        this.v = void 0;
        this.ir = false;
        this.D = false;
        this.cb = void 0;
        this.A = void 0;
        this.C = void 0;
        this.o = e;
        this.O = i ? wrap(e) : e;
        this.$get = t;
        this.$set = r;
        this.oL = n;
    }
    init(e) {
        this.v = e;
        this.D = false;
    }
    getValue() {
        if (this.subs.count === 0) {
            return this.$get.call(this.o, this.o, this);
        }
        if (this.D) {
            this.compute();
            this.D = false;
        }
        return this.v;
    }
    setValue(e) {
        if (isFunction(this.$set)) {
            if (this.A !== void 0) {
                e = this.A.call(null, e, this.C);
            }
            if (!h(e, this.v)) {
                this.ir = true;
                this.$set.call(this.o, e);
                this.ir = false;
                this.run();
            }
        } else {
            throw createMappedError(221);
        }
    }
    useCoercer(e, t) {
        this.A = e;
        this.C = t;
        return true;
    }
    useCallback(e) {
        this.cb = e;
        return true;
    }
    handleChange() {
        this.D = true;
        if (this.subs.count > 0) {
            this.run();
        }
    }
    handleCollectionChange() {
        this.D = true;
        if (this.subs.count > 0) {
            this.run();
        }
    }
    subscribe(e) {
        if (this.subs.add(e) && this.subs.count === 1) {
            this.compute();
            this.D = false;
        }
    }
    unsubscribe(e) {
        if (this.subs.remove(e) && this.subs.count === 0) {
            this.D = true;
            this.obs.clearAll();
        }
    }
    run() {
        if (this.ir) {
            return;
        }
        const e = this.v;
        const t = this.compute();
        this.D = false;
        if (!h(t, e)) {
            this.cb?.(t, e);
            this.subs.notify(this.v, e);
        }
    }
    compute() {
        this.ir = true;
        this.obs.version++;
        try {
            enterConnectable(this);
            return this.v = unwrap(this.$get.call(this.O, this.O, this));
        } finally {
            this.obs.clear();
            this.ir = false;
            exitConnectable(this);
        }
    }
}

connectable(ComputedObserver);

subscriberCollection(ComputedObserver);

const Ut = /*@__PURE__*/ b("IDirtyChecker", void 0);

const Ht = {
    timeoutsPerCheck: 25,
    disabled: false,
    throw: false,
    resetToDefault() {
        this.timeoutsPerCheck = 6;
        this.disabled = false;
        this.throw = false;
    }
};

class DirtyChecker {
    static register(e) {
        e.register(i.singleton(this, this), i.aliasTo(this, Ut));
    }
    constructor(e) {
        this.p = e;
        this.tracked = [];
        this.T = null;
        this.P = 0;
        this.check = () => {
            if (Ht.disabled) {
                return;
            }
            if (++this.P < Ht.timeoutsPerCheck) {
                return;
            }
            this.P = 0;
            const e = this.tracked;
            const t = e.length;
            let r;
            let n = 0;
            for (;n < t; ++n) {
                r = e[n];
                if (r.isDirty()) {
                    r.flush();
                }
            }
        };
        subscriberCollection(DirtyCheckProperty);
    }
    createProperty(e, t) {
        if (Ht.throw) {
            throw createError(`AUR0222:${d(t)}`);
        }
        return new DirtyCheckProperty(this, e, t);
    }
    addProperty(e) {
        this.tracked.push(e);
        if (this.tracked.length === 1) {
            this.T = this.p.taskQueue.queueTask(this.check, {
                persistent: true
            });
        }
    }
    removeProperty(e) {
        this.tracked.splice(this.tracked.indexOf(e), 1);
        if (this.tracked.length === 0) {
            this.T.cancel();
            this.T = null;
        }
    }
}

DirtyChecker.inject = [ o ];

class DirtyCheckProperty {
    constructor(e, t, r) {
        this.obj = t;
        this.key = r;
        this.type = Z;
        this.ov = void 0;
        this.I = e;
    }
    getValue() {
        return this.obj[this.key];
    }
    setValue(e) {
        throw createError(`Trying to set value for property ${d(this.key)} in dirty checker`);
    }
    isDirty() {
        return this.ov !== this.obj[this.key];
    }
    flush() {
        const e = this.ov;
        const t = this.getValue();
        this.ov = t;
        this.subs.notify(t, e);
    }
    subscribe(e) {
        if (this.subs.add(e) && this.subs.count === 1) {
            this.ov = this.obj[this.key];
            this.I.addProperty(this);
        }
    }
    unsubscribe(e) {
        if (this.subs.remove(e) && this.subs.count === 0) {
            this.I.removeProperty(this);
        }
    }
}

class PrimitiveObserver {
    get doNotCache() {
        return true;
    }
    constructor(e, t) {
        this.type = Z;
        this.o = e;
        this.k = t;
    }
    getValue() {
        return this.o[this.k];
    }
    setValue() {}
    subscribe() {}
    unsubscribe() {}
}

class PropertyAccessor {
    constructor() {
        this.type = Z;
    }
    getValue(e, t) {
        return e[t];
    }
    setValue(e, t, r) {
        t[r] = e;
    }
}

class SetterObserver {
    constructor(e, t) {
        this.type = ee;
        this.v = void 0;
        this.iO = false;
        this.cb = void 0;
        this.A = void 0;
        this.C = void 0;
        this.o = e;
        this.k = t;
    }
    getValue() {
        return this.v;
    }
    setValue(e) {
        if (this.A !== void 0) {
            e = this.A.call(void 0, e, this.C);
        }
        if (this.iO) {
            if (h(e, this.v)) {
                return;
            }
            Kt = this.v;
            this.v = e;
            this.cb?.(e, Kt);
            this.subs.notify(e, Kt);
        } else {
            this.v = this.o[this.k] = e;
            this.cb?.(e, Kt);
        }
    }
    useCallback(e) {
        this.cb = e;
        this.start();
        return true;
    }
    useCoercer(e, t) {
        this.A = e;
        this.C = t;
        this.start();
        return true;
    }
    subscribe(e) {
        if (this.iO === false) {
            this.start();
        }
        this.subs.add(e);
    }
    start() {
        if (this.iO === false) {
            this.iO = true;
            this.v = this.o[this.k];
            l(this.o, this.k, {
                enumerable: true,
                configurable: true,
                get: f((() => this.getValue()), {
                    getObserver: () => this
                }),
                set: e => {
                    this.setValue(e);
                }
            });
        }
        return this;
    }
    stop() {
        if (this.iO) {
            l(this.o, this.k, {
                enumerable: true,
                configurable: true,
                writable: true,
                value: this.v
            });
            this.iO = false;
        }
        return this;
    }
}

subscriberCollection(SetterObserver);

let Kt = void 0;

const zt = new PropertyAccessor;

const Gt = /*@__PURE__*/ b("IObserverLocator", (e => e.singleton(ObserverLocator)));

const Wt = /*@__PURE__*/ b("INodeObserverLocator", (e => e.cachedCallback((e => new DefaultNodeObserverLocator))));

class DefaultNodeObserverLocator {
    handles() {
        return false;
    }
    getObserver() {
        return zt;
    }
    getAccessor() {
        return zt;
    }
}

class ObserverLocator {
    constructor(e, t) {
        this.L = [];
        this.I = e;
        this.M = t;
    }
    addAdapter(e) {
        this.L.push(e);
    }
    getObserver(e, t) {
        if (e == null) {
            throw createMappedError(199, t);
        }
        if (!isObject(e)) {
            return new PrimitiveObserver(e, isFunction(t) ? "" : t);
        }
        if (isFunction(t)) {
            return new ComputedObserver(e, t, void 0, this, true);
        }
        const r = getObserverLookup(e);
        let n = r[t];
        if (n === void 0) {
            n = this.createObserver(e, t);
            if (!n.doNotCache) {
                r[t] = n;
            }
        }
        return n;
    }
    getAccessor(e, t) {
        const r = e.$observers?.[t];
        if (r !== void 0) {
            return r;
        }
        if (this.M.handles(e, t, this)) {
            return this.M.getAccessor(e, t, this);
        }
        return zt;
    }
    getArrayObserver(e) {
        return getArrayObserver(e);
    }
    getMapObserver(e) {
        return getMapObserver(e);
    }
    getSetObserver(e) {
        return getSetObserver(e);
    }
    createObserver(e, t) {
        if (this.M.handles(e, t, this)) {
            return this.M.getObserver(e, t, this);
        }
        switch (t) {
          case "length":
            if (isArray(e)) {
                return getArrayObserver(e).getLengthObserver();
            }
            break;

          case "size":
            if (isMap(e)) {
                return getMapObserver(e).getLengthObserver();
            } else if (isSet(e)) {
                return getSetObserver(e).getLengthObserver();
            }
            break;

          default:
            if (isArray(e) && n(t)) {
                return getArrayObserver(e).getIndexObserver(Number(t));
            }
            break;
        }
        let r = Jt(e, t);
        if (r === void 0) {
            let n = qt(e);
            while (n !== null) {
                r = Jt(n, t);
                if (r === void 0) {
                    n = qt(n);
                } else {
                    break;
                }
            }
        }
        if (r !== void 0 && !u.call(r, "value")) {
            let n = this.R(e, t, r);
            if (n == null) {
                n = (r.get?.getObserver ?? r.set?.getObserver)?.(e, this);
            }
            return n == null ? r.configurable ? this._(e, t, r, true) : this.I.createProperty(e, t) : n;
        }
        return new SetterObserver(e, t);
    }
    _(e, t, r, n) {
        const i = new ComputedObserver(e, r.get, r.set, this, !!n);
        l(e, t, {
            enumerable: r.enumerable,
            configurable: true,
            get: f((() => i.getValue()), {
                getObserver: () => i
            }),
            set: e => {
                i.setValue(e);
            }
        });
        return i;
    }
    R(e, t, r) {
        if (this.L.length > 0) {
            for (const n of this.L) {
                const i = n.getObserver(e, t, r, this);
                if (i != null) {
                    return i;
                }
            }
        }
        return null;
    }
}

ObserverLocator.inject = [ Ut, Wt ];

const getCollectionObserver = e => {
    let t;
    if (isArray(e)) {
        t = getArrayObserver(e);
    } else if (isMap(e)) {
        t = getMapObserver(e);
    } else if (isSet(e)) {
        t = getSetObserver(e);
    }
    return t;
};

const qt = Object.getPrototypeOf;

const Jt = Object.getOwnPropertyDescriptor;

const getObserverLookup = e => {
    let t = e.$observers;
    if (t === void 0) {
        l(e, "$observers", {
            enumerable: false,
            value: t = createLookup()
        });
    }
    return t;
};

const Qt = /*@__PURE__*/ b("IObservation", (e => e.singleton(Observation)));

class Observation {
    static get inject() {
        return [ Gt ];
    }
    constructor(e) {
        this.oL = e;
        this.B = {
            immediate: true
        };
    }
    run(e) {
        const t = new RunEffect(this.oL, e);
        t.run();
        return t;
    }
    watch(e, t, r, n = this.B) {
        let i = undefined;
        let o = false;
        const a = this.oL.getObserver(e, t);
        const c = {
            handleChange: (e, t) => r(e, i = t)
        };
        const run = () => {
            if (o) return;
            r(a.getValue(), i);
        };
        const stop = () => {
            o = true;
            a.unsubscribe(c);
        };
        a.subscribe(c);
        if (n.immediate) {
            run();
        }
        return {
            run: run,
            stop: stop
        };
    }
}

class RunEffect {
    constructor(e, t) {
        this.oL = e;
        this.fn = t;
        this.maxRunCount = 10;
        this.queued = false;
        this.running = false;
        this.runCount = 0;
        this.stopped = false;
    }
    handleChange() {
        this.queued = true;
        this.run();
    }
    handleCollectionChange() {
        this.queued = true;
        this.run();
    }
    run() {
        if (this.stopped) {
            throw createMappedError(225);
        }
        if (this.running) {
            return;
        }
        ++this.runCount;
        this.running = true;
        this.queued = false;
        ++this.obs.version;
        try {
            enterConnectable(this);
            this.fn(this);
        } finally {
            this.obs.clear();
            this.running = false;
            exitConnectable(this);
        }
        if (this.queued) {
            if (this.runCount > this.maxRunCount) {
                this.runCount = 0;
                throw createMappedError(226);
            }
            this.run();
        } else {
            this.runCount = 0;
        }
    }
    stop() {
        this.stopped = true;
        this.obs.clearAll();
    }
}

connectable(RunEffect);

function getObserversLookup(e) {
    if (e.$observers === void 0) {
        l(e, "$observers", {
            value: {}
        });
    }
    return e.$observers;
}

const Xt = {};

function observable(e, t, r) {
    if (!SetterNotifier.mixed) {
        SetterNotifier.mixed = true;
        subscriberCollection(SetterNotifier);
    }
    if (t == null) {
        return (t, r, n) => deco(t, r, n, e);
    }
    return deco(e, t, r);
    function deco(e, t, r, n) {
        const i = t === void 0;
        n = typeof n !== "object" ? {
            name: n
        } : n || {};
        if (i) {
            t = n.name;
        }
        if (t == null || t === "") {
            throw createMappedError(224);
        }
        const o = n.callback || `${d(t)}Changed`;
        let a = Xt;
        if (r) {
            delete r.value;
            delete r.writable;
            a = r.initializer?.();
            delete r.initializer;
        } else {
            r = {
                configurable: true
            };
        }
        if (!("enumerable" in r)) {
            r.enumerable = true;
        }
        const c = n.set;
        r.get = function g() {
            const e = getNotifier(this, t, o, a, c);
            currentConnectable()?.subscribeTo(e);
            return e.getValue();
        };
        r.set = function s(e) {
            getNotifier(this, t, o, a, c).setValue(e);
        };
        r.get.getObserver = function gO(e) {
            return getNotifier(e, t, o, a, c);
        };
        if (i) {
            l(e.prototype, t, r);
        } else {
            return r;
        }
    }
}

function getNotifier(e, t, r, n, i) {
    const o = getObserversLookup(e);
    let a = o[t];
    if (a == null) {
        a = new SetterNotifier(e, r, i, n === Xt ? void 0 : n);
        o[t] = a;
    }
    return a;
}

class SetterNotifier {
    constructor(e, t, r, n) {
        this.type = ee;
        this.v = void 0;
        this.ov = void 0;
        this.o = e;
        this.S = r;
        this.hs = isFunction(r);
        const i = e[t];
        this.cb = isFunction(i) ? i : void 0;
        this.v = n;
    }
    getValue() {
        return this.v;
    }
    setValue(e) {
        if (this.hs) {
            e = this.S(e);
        }
        if (!h(e, this.v)) {
            this.ov = this.v;
            this.v = e;
            this.cb?.call(this.o, this.v, this.ov);
            e = this.ov;
            this.ov = this.v;
            this.subs.notify(this.v, e);
        }
    }
}

SetterNotifier.mixed = false;

function nowrap(e, t) {
    if (e == null) {
        return (e, t) => deco(e, t);
    } else {
        return deco(e, t);
    }
    function deco(e, t) {
        const r = !t;
        if (r) {
            defineHiddenProp(e, Bt, true);
        } else {
            defineHiddenProp(e.constructor, `${$t}_${d(t)}__`, true);
        }
    }
}

const Yt = b("ISignaler", (e => e.singleton(Signaler)));

class Signaler {
    constructor() {
        this.signals = createLookup();
    }
    dispatchSignal(e) {
        const t = this.signals[e];
        if (t === undefined) {
            return;
        }
        let r;
        for (r of t.keys()) {
            r.handleChange(undefined, undefined);
        }
    }
    addSignalListener(e, t) {
        const r = this.signals;
        const n = r[e];
        if (n === undefined) {
            r[e] = new Set([ t ]);
        } else {
            n.add(t);
        }
    }
    removeSignalListener(e, t) {
        this.signals[e]?.delete(t);
    }
}

export { AccessBoundaryExpression, AccessGlobalExpression, AccessKeyedExpression, AccessMemberExpression, AccessScopeExpression, AccessThisExpression, re as AccessorType, ArrayBindingPattern, ArrayIndexObserver, ArrayLiteralExpression, ArrayObserver, ArrowFunction, AssignExpression, BinaryExpression, BindingBehaviorExpression, BindingContext, BindingIdentifier, BindingObserverRecord, CallFunctionExpression, CallMemberExpression, CallScopeExpression, CollectionLengthObserver, CollectionSizeObserver, ComputedObserver, ConditionalExpression, Lt as ConnectableSwitcher, CustomExpression, DestructuringAssignmentExpression, DestructuringAssignmentRestExpression, DestructuringAssignmentSingleExpression, DirtyCheckProperty, Ht as DirtyCheckSettings, DirtyChecker, ForOfStatement, Y as ICoercionConfiguration, Ut as IDirtyChecker, Ge as IExpressionParser, Wt as INodeObserverLocator, Qt as IObservation, Gt as IObserverLocator, Yt as ISignaler, Interpolation, MapObserver, ObjectBindingPattern, ObjectLiteralExpression, Observation, ObserverLocator, PrimitiveLiteralExpression, PrimitiveObserver, PropertyAccessor, Vt as ProxyObservable, Scope, SetObserver, SetterObserver, SubscriberRecord, TaggedTemplateExpression, TemplateExpression, UnaryExpression, Unparser, ValueConverterExpression, astAssign, astBind, astEvaluate, astUnbind, astVisit, batch, cloneIndexMap, connectable, copyIndexMap, createIndexMap, disableArrayObservation, disableMapObservation, disableSetObservation, enableArrayObservation, enableMapObservation, enableSetObservation, getCollectionObserver, getObserverLookup, isIndexMap, nowrap, observable, parseExpression, subscriberCollection };
//# sourceMappingURL=index.mjs.map
