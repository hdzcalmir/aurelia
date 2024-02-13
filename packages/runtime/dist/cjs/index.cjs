"use strict";

var e = require("@aurelia/kernel");

var t = require("@aurelia/metadata");

const r = Object;

const n = r.prototype.hasOwnProperty;

const i = Reflect.defineProperty;

const createError = e => new Error(e);

const isFunction = e => typeof e === "function";

const isString = e => typeof e === "string";

const isObject = e => e instanceof r;

const isArray = e => e instanceof Array;

const isSet = e => e instanceof Set;

const isMap = e => e instanceof Map;

const o = r.is;

function defineHiddenProp(e, t, r) {
    i(e, t, {
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

const a = Object.assign;

const c = Object.freeze;

const u = String;

const l = e.DI.createInterface;

const createLookup = () => r.create(null);

const h = t.Metadata.getOwn;

t.Metadata.hasOwn;

const f = t.Metadata.define;

e.Protocol.annotation.keyFor;

e.Protocol.resource.keyFor;

e.Protocol.resource.appendTo;

const astVisit = (e, t) => {
    switch (e.$kind) {
      case T:
        return t.visitAccessKeyed(e);

      case S:
        return t.visitAccessMember(e);

      case b:
        return t.visitAccessScope(e);

      case p:
        return t.visitAccessThis(e);

      case d:
        return t.visitAccessBoundary(e);

      case $:
        return t.visitArrayBindingPattern(e);

      case V:
        return t.visitDestructuringAssignmentExpression(e);

      case v:
        return t.visitArrayLiteral(e);

      case R:
        return t.visitArrowFunction(e);

      case M:
        return t.visitAssign(e);

      case I:
        return t.visitBinary(e);

      case B:
        return t.visitBindingBehavior(e);

      case F:
        return t.visitBindingIdentifier(e);

      case k:
        return t.visitCallFunction(e);

      case m:
        return t.visitCallMember(e);

      case C:
        return t.visitCallScope(e);

      case L:
        return t.visitConditional(e);

      case H:
        return t.visitDestructuringAssignmentSingleExpression(e);

      case j:
        return t.visitForOfStatement(e);

      case N:
        return t.visitInterpolation(e);

      case D:
        return t.visitObjectBindingPattern(e);

      case U:
        return t.visitDestructuringAssignmentExpression(e);

      case x:
        return t.visitObjectLiteral(e);

      case E:
        return t.visitPrimitiveLiteral(e);

      case P:
        return t.visitTaggedTemplate(e);

      case y:
        return t.visitTemplate(e);

      case A:
        return t.visitUnary(e);

      case _:
        return t.visitValueConverter(e);

      case K:
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
        const r = t === U;
        this.text += r ? "{" : "[";
        const n = e.list;
        const i = n.length;
        let o;
        let a;
        for (o = 0; o < i; o++) {
            a = n[o];
            switch (a.$kind) {
              case H:
                astVisit(a, this);
                break;

              case V:
              case U:
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
        this.text += u(e.value);
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

const p = "AccessThis";

const d = "AccessBoundary";

const w = "AccessGlobal";

const b = "AccessScope";

const v = "ArrayLiteral";

const x = "ObjectLiteral";

const E = "PrimitiveLiteral";

const y = "Template";

const A = "Unary";

const C = "CallScope";

const m = "CallMember";

const k = "CallFunction";

const O = "CallGlobal";

const S = "AccessMember";

const T = "AccessKeyed";

const P = "TaggedTemplate";

const I = "Binary";

const L = "Conditional";

const M = "Assign";

const R = "ArrowFunction";

const _ = "ValueConverter";

const B = "BindingBehavior";

const $ = "ArrayBindingPattern";

const D = "ObjectBindingPattern";

const F = "BindingIdentifier";

const j = "ForOfStatement";

const N = "Interpolation";

const V = "ArrayDestructuring";

const U = "ObjectDestructuring";

const H = "DestructuringAssignmentLeaf";

const K = "Custom";

class CustomExpression {
    constructor(e) {
        this.value = e;
        this.$kind = K;
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
        this.$kind = B;
        this.key = `_bb_${t}`;
    }
}

class ValueConverterExpression {
    constructor(e, t, r) {
        this.expression = e;
        this.name = t;
        this.args = r;
        this.$kind = _;
    }
}

class AssignExpression {
    constructor(e, t) {
        this.target = e;
        this.value = t;
        this.$kind = M;
    }
}

class ConditionalExpression {
    constructor(e, t, r) {
        this.condition = e;
        this.yes = t;
        this.no = r;
        this.$kind = L;
    }
}

class AccessGlobalExpression {
    constructor(e) {
        this.name = e;
        this.$kind = w;
    }
}

class AccessThisExpression {
    constructor(e = 0) {
        this.ancestor = e;
        this.$kind = p;
    }
}

class AccessBoundaryExpression {
    constructor() {
        this.$kind = d;
    }
}

class AccessScopeExpression {
    constructor(e, t = 0) {
        this.name = e;
        this.ancestor = t;
        this.$kind = b;
    }
}

const isAccessGlobal = e => e.$kind === w || (e.$kind === S || e.$kind === T) && e.accessGlobal;

class AccessMemberExpression {
    constructor(e, t, r = false) {
        this.object = e;
        this.name = t;
        this.optional = r;
        this.$kind = S;
        this.accessGlobal = isAccessGlobal(e);
    }
}

class AccessKeyedExpression {
    constructor(e, t, r = false) {
        this.object = e;
        this.key = t;
        this.optional = r;
        this.$kind = T;
        this.accessGlobal = isAccessGlobal(e);
    }
}

class CallScopeExpression {
    constructor(e, t, r = 0, n = false) {
        this.name = e;
        this.args = t;
        this.ancestor = r;
        this.optional = n;
        this.$kind = C;
    }
}

class CallMemberExpression {
    constructor(e, t, r, n = false, i = false) {
        this.object = e;
        this.name = t;
        this.args = r;
        this.optionalMember = n;
        this.optionalCall = i;
        this.$kind = m;
    }
}

class CallFunctionExpression {
    constructor(e, t, r = false) {
        this.func = e;
        this.args = t;
        this.optional = r;
        this.$kind = k;
    }
}

class CallGlobalExpression {
    constructor(e, t) {
        this.name = e;
        this.args = t;
        this.$kind = O;
    }
}

class BinaryExpression {
    constructor(e, t, r) {
        this.operation = e;
        this.left = t;
        this.right = r;
        this.$kind = I;
    }
}

class UnaryExpression {
    constructor(e, t) {
        this.operation = e;
        this.expression = t;
        this.$kind = A;
    }
}

class PrimitiveLiteralExpression {
    constructor(e) {
        this.value = e;
        this.$kind = E;
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
        this.$kind = v;
    }
}

ArrayLiteralExpression.$empty = new ArrayLiteralExpression(e.emptyArray);

class ObjectLiteralExpression {
    constructor(e, t) {
        this.keys = e;
        this.values = t;
        this.$kind = x;
    }
}

ObjectLiteralExpression.$empty = new ObjectLiteralExpression(e.emptyArray, e.emptyArray);

class TemplateExpression {
    constructor(t, r = e.emptyArray) {
        this.cooked = t;
        this.expressions = r;
        this.$kind = y;
    }
}

TemplateExpression.$empty = new TemplateExpression([ "" ]);

class TaggedTemplateExpression {
    constructor(t, r, n, i = e.emptyArray) {
        this.cooked = t;
        this.func = n;
        this.expressions = i;
        this.$kind = P;
        t.raw = r;
    }
}

class ArrayBindingPattern {
    constructor(e) {
        this.elements = e;
        this.$kind = $;
    }
}

class ObjectBindingPattern {
    constructor(e, t) {
        this.keys = e;
        this.values = t;
        this.$kind = D;
    }
}

class BindingIdentifier {
    constructor(e) {
        this.name = e;
        this.$kind = F;
    }
}

class ForOfStatement {
    constructor(e, t, r) {
        this.declaration = e;
        this.iterable = t;
        this.semiIdx = r;
        this.$kind = j;
    }
}

class Interpolation {
    constructor(t, r = e.emptyArray) {
        this.parts = t;
        this.expressions = r;
        this.$kind = N;
        this.isMulti = r.length > 1;
        this.firstExpression = r[0];
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
        this.$kind = H;
    }
}

class DestructuringAssignmentRestExpression {
    constructor(e, t) {
        this.target = e;
        this.indexOrProperties = t;
        this.$kind = H;
    }
}

class ArrowFunction {
    constructor(e, t, r = false) {
        this.args = e;
        this.body = t;
        this.rest = r;
        this.$kind = R;
    }
}

const createMappedError = (e, ...t) => new Error(`AUR${u(e).padStart(4, "0")}:${t.map(u)}`);

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
        return new Scope(null, e, t ?? new OverrideContext, r ?? false);
    }
    static fromParent(e, t) {
        if (e == null) {
            throw createMappedError(203);
        }
        return new Scope(e, t, new OverrideContext, false);
    }
}

class OverrideContext {}

const z = Scope.getContext;

function astEvaluate(e, t, r, n) {
    switch (e.$kind) {
      case p:
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

      case d:
        {
            let e = t;
            while (e != null && !e.isBoundary) {
                e = e.parent;
            }
            return e ? e.bindingContext : void 0;
        }

      case b:
        {
            const i = z(t, e.name, e.ancestor);
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

      case w:
        return globalThis[e.name];

      case O:
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

      case v:
        return e.elements.map((e => astEvaluate(e, t, r, n)));

      case x:
        {
            const i = {};
            for (let o = 0; o < e.keys.length; ++o) {
                i[e.keys[o]] = astEvaluate(e.values[o], t, r, n);
            }
            return i;
        }

      case E:
        return e.value;

      case y:
        {
            let i = e.cooked[0];
            for (let o = 0; o < e.expressions.length; ++o) {
                i += String(astEvaluate(e.expressions[o], t, r, n));
                i += e.cooked[o + 1];
            }
            return i;
        }

      case A:
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

      case C:
        {
            const i = e.args.map((e => astEvaluate(e, t, r, n)));
            const o = z(t, e.name, e.ancestor);
            const a = getFunction(r?.strictFnCall, o, e.name);
            if (a) {
                return a.apply(o, i);
            }
            return void 0;
        }

      case m:
        {
            const i = astEvaluate(e.object, t, r, n);
            const o = e.args.map((e => astEvaluate(e, t, r, n)));
            const a = getFunction(r?.strictFnCall, i, e.name);
            let c;
            if (a) {
                c = a.apply(i, o);
                if (isArray(i) && G.includes(e.name)) {
                    n?.observeCollection(i);
                }
            }
            return c;
        }

      case k:
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

      case R:
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

      case S:
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

      case T:
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

      case P:
        {
            const i = e.expressions.map((e => astEvaluate(e, t, r, n)));
            const o = astEvaluate(e.func, t, r, n);
            if (!isFunction(o)) {
                throw createMappedError(110);
            }
            return o(e.cooked, ...i);
        }

      case I:
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

      case L:
        return astEvaluate(e.condition, t, r, n) ? astEvaluate(e.yes, t, r, n) : astEvaluate(e.no, t, r, n);

      case M:
        return astAssign(e.target, t, r, astEvaluate(e.value, t, r, n));

      case _:
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

      case B:
        return astEvaluate(e.expression, t, r, n);

      case F:
        return e.name;

      case j:
        return astEvaluate(e.iterable, t, r, n);

      case N:
        if (e.isMulti) {
            let i = e.parts[0];
            let o = 0;
            for (;o < e.expressions.length; ++o) {
                i += u(astEvaluate(e.expressions[o], t, r, n));
                i += e.parts[o + 1];
            }
            return i;
        } else {
            return `${e.parts[0]}${astEvaluate(e.firstExpression, t, r, n)}${e.parts[1]}`;
        }

      case H:
        return astEvaluate(e.target, t, r, n);

      case V:
        {
            return e.list.map((e => astEvaluate(e, t, r, n)));
        }

      case $:
      case D:
      case U:
      default:
        return void 0;

      case K:
        return e.evaluate(t, r, n);
    }
}

function astAssign(t, r, n, i) {
    switch (t.$kind) {
      case b:
        {
            if (t.name === "$host") {
                throw createMappedError(106);
            }
            const e = z(r, t.name, t.ancestor);
            return e[t.name] = i;
        }

      case S:
        {
            const e = astEvaluate(t.object, r, n, null);
            if (isObject(e)) {
                if (t.name === "length" && isArray(e) && !isNaN(i)) {
                    e.splice(i);
                } else {
                    e[t.name] = i;
                }
            } else {
                astAssign(t.object, r, n, {
                    [t.name]: i
                });
            }
            return i;
        }

      case T:
        {
            const o = astEvaluate(t.object, r, n, null);
            const a = astEvaluate(t.key, r, n, null);
            if (isArray(o)) {
                if (a === "length" && !isNaN(i)) {
                    o.splice(i);
                    return i;
                }
                if (e.isArrayIndex(a)) {
                    o.splice(a, 1, i);
                    return i;
                }
            }
            return o[a] = i;
        }

      case M:
        astAssign(t.value, r, n, i);
        return astAssign(t.target, r, n, i);

      case _:
        {
            const e = n?.getConverter?.(t.name);
            if (e == null) {
                throw createMappedError(103, t.name);
            }
            if ("fromView" in e) {
                i = e.fromView(i, ...t.args.map((e => astEvaluate(e, r, n, null))));
            }
            return astAssign(t.expression, r, n, i);
        }

      case B:
        return astAssign(t.expression, r, n, i);

      case V:
      case U:
        {
            const e = t.list;
            const o = e.length;
            let a;
            let c;
            for (a = 0; a < o; a++) {
                c = e[a];
                switch (c.$kind) {
                  case H:
                    astAssign(c, r, n, i);
                    break;

                  case V:
                  case U:
                    {
                        if (typeof i !== "object" || i === null) {
                            throw createMappedError(112);
                        }
                        let e = astEvaluate(c.source, Scope.create(i), n, null);
                        if (e === void 0 && c.initializer) {
                            e = astEvaluate(c.initializer, r, n, null);
                        }
                        astAssign(c, r, n, e);
                        break;
                    }
                }
            }
            break;
        }

      case H:
        {
            if (t instanceof DestructuringAssignmentSingleExpression) {
                if (i == null) {
                    return;
                }
                if (typeof i !== "object") {
                    throw createMappedError(112);
                }
                let e = astEvaluate(t.source, Scope.create(i), n, null);
                if (e === void 0 && t.initializer) {
                    e = astEvaluate(t.initializer, r, n, null);
                }
                astAssign(t.target, r, n, e);
            } else {
                if (i == null) {
                    return;
                }
                if (typeof i !== "object") {
                    throw createMappedError(112);
                }
                const o = t.indexOrProperties;
                let a;
                if (e.isArrayIndex(o)) {
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
                astAssign(t.target, r, n, a);
            }
            break;
        }

      case K:
        return t.assign(r, n, i);

      default:
        return void 0;
    }
}

function astBind(e, t, r) {
    switch (e.$kind) {
      case B:
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

      case _:
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

      case j:
        {
            astBind(e.iterable, t, r);
            break;
        }

      case K:
        {
            e.bind?.(t, r);
        }
    }
}

function astUnbind(e, t, r) {
    switch (e.$kind) {
      case B:
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

      case _:
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

      case j:
        {
            astUnbind(e.iterable, t, r);
            break;
        }

      case K:
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

const G = "at map filter includes indexOf lastIndexOf findIndex find flat flatMap join reduce reduceRight slice every some sort".split(" ");

const W = /*@__PURE__*/ e.DI.createInterface("ICoercionConfiguration");

const q = 0;

const J = 1;

const Q = 2;

const X = 4;

const Y = /*@__PURE__*/ c({
    None: q,
    Observer: J,
    Node: Q,
    Layout: X
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

let Z = new Map;

let ee = false;

function batch(e) {
    const t = Z;
    const r = Z = new Map;
    ee = true;
    try {
        e();
    } finally {
        Z = null;
        ee = false;
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
            Z = t;
        }
    }
}

function addCollectionBatch(e, t, r) {
    if (!Z.has(e)) {
        Z.set(e, [ 2, t, r ]);
    } else {
        Z.get(e)[2] = r;
    }
}

function addValueBatch(e, t, r) {
    const n = Z.get(e);
    if (n === void 0) {
        Z.set(e, [ 1, t, r ]);
    } else {
        n[1] = t;
        n[2] = r;
    }
}

function subscriberCollection(e) {
    return e == null ? subscriberCollectionDeco : subscriberCollectionDeco(e);
}

const te = new WeakSet;

function subscriberCollectionDeco(e) {
    if (te.has(e)) {
        return;
    }
    te.add(e);
    const t = e.prototype;
    i(t, "subs", {
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
        if (ee) {
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
        this.type = J;
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
        this.type = J;
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

const se = Symbol.for("__au_arr_obs__");

const re = Array[se] ?? defineHiddenProp(Array, se, new WeakMap);

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
    let d, w, b;
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
        w = i(c, l);
        if (w >= 0) {
            v = c;
            x = h;
            c = l;
            h = p;
            l = u;
            p = f;
            u = v;
            f = x;
        } else {
            b = i(u, l);
            if (b > 0) {
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

const ne = Array.prototype;

const ie = ne.push;

const oe = ne.unshift;

const ae = ne.pop;

const ce = ne.shift;

const ue = ne.splice;

const le = ne.reverse;

const he = ne.sort;

const fe = {
    push: ie,
    unshift: oe,
    pop: ae,
    shift: ce,
    splice: ue,
    reverse: le,
    sort: he
};

const pe = [ "push", "unshift", "pop", "shift", "splice", "reverse", "sort" ];

const de = {
    push: function(...e) {
        const t = re.get(this);
        if (t === void 0) {
            return ie.apply(this, e);
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
        const t = re.get(this);
        if (t === void 0) {
            return oe.apply(this, e);
        }
        const r = e.length;
        const n = new Array(r);
        let i = 0;
        while (i < r) {
            n[i++] = -2;
        }
        oe.apply(t.indexMap, n);
        const o = oe.apply(this, e);
        t.notify();
        return o;
    },
    pop: function() {
        const e = re.get(this);
        if (e === void 0) {
            return ae.call(this);
        }
        const t = e.indexMap;
        const r = ae.call(this);
        const n = t.length - 1;
        if (t[n] > -1) {
            t.deletedIndices.push(t[n]);
            t.deletedItems.push(r);
        }
        ae.call(t);
        e.notify();
        return r;
    },
    shift: function() {
        const e = re.get(this);
        if (e === void 0) {
            return ce.call(this);
        }
        const t = e.indexMap;
        const r = ce.call(this);
        if (t[0] > -1) {
            t.deletedIndices.push(t[0]);
            t.deletedItems.push(r);
        }
        ce.call(t);
        e.notify();
        return r;
    },
    splice: function(...e) {
        const t = e[0];
        const r = e[1];
        const n = re.get(this);
        if (n === void 0) {
            return ue.apply(this, e);
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
            ue.call(c, t, r, ...n);
        } else {
            ue.apply(c, e);
        }
        const f = ue.apply(this, e);
        if (l > 0 || h > 0) {
            n.notify();
        }
        return f;
    },
    reverse: function() {
        const e = re.get(this);
        if (e === void 0) {
            le.call(this);
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
        const t = re.get(this);
        if (t === void 0) {
            he.call(this, e);
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
        if (i || ee) {
            t.notify();
        }
        return this;
    }
};

for (const e of pe) {
    i(de[e], "observing", {
        value: true,
        writable: false,
        configurable: false,
        enumerable: false
    });
}

let we = false;

const be = "__au_arr_on__";

function enableArrayObservation() {
    if (!(h(be, Array) ?? false)) {
        f(be, true, Array);
        for (const e of pe) {
            if (ne[e].observing !== true) {
                defineHiddenProp(ne, e, de[e]);
            }
        }
    }
}

function disableArrayObservation() {
    for (const e of pe) {
        if (ne[e].observing === true) {
            defineHiddenProp(ne, e, fe[e]);
        }
    }
}

class ArrayObserver {
    constructor(e) {
        this.type = J;
        if (!we) {
            we = true;
            enableArrayObservation();
        }
        this.indexObservers = {};
        this.collection = e;
        this.indexMap = createIndexMap(e.length);
        this.lenObs = void 0;
        re.set(e, this);
    }
    notify() {
        const e = this.subs;
        const t = this.indexMap;
        if (ee) {
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
    let t = re.get(e);
    if (t === void 0) {
        t = new ArrayObserver(e);
    }
    return t;
}

const ve = Symbol.for("__au_set_obs__");

const xe = Set[ve] ?? defineHiddenProp(Set, ve, new WeakMap);

const ge = Set.prototype;

const Ee = ge.add;

const ye = ge.clear;

const Ae = ge.delete;

const Ce = {
    add: Ee,
    clear: ye,
    delete: Ae
};

const me = [ "add", "clear", "delete" ];

const ke = {
    add: function(e) {
        const t = xe.get(this);
        if (t === undefined) {
            Ee.call(this, e);
            return this;
        }
        const r = this.size;
        Ee.call(this, e);
        const n = this.size;
        if (n === r) {
            return this;
        }
        t.indexMap[r] = -2;
        t.notify();
        return this;
    },
    clear: function() {
        const e = xe.get(this);
        if (e === undefined) {
            return ye.call(this);
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
            ye.call(this);
            t.length = 0;
            e.notify();
        }
        return undefined;
    },
    delete: function(e) {
        const t = xe.get(this);
        if (t === undefined) {
            return Ae.call(this, e);
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
                const o = Ae.call(this, e);
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

const Oe = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const e of me) {
    i(ke[e], "observing", {
        value: true,
        writable: false,
        configurable: false,
        enumerable: false
    });
}

let Se = false;

const Te = "__au_set_on__";

function enableSetObservation() {
    if (!(h(Te, Set) ?? false)) {
        f(Te, true, Set);
        for (const e of me) {
            if (ge[e].observing !== true) {
                i(ge, e, {
                    ...Oe,
                    value: ke[e]
                });
            }
        }
    }
}

function disableSetObservation() {
    for (const e of me) {
        if (ge[e].observing === true) {
            i(ge, e, {
                ...Oe,
                value: Ce[e]
            });
        }
    }
}

class SetObserver {
    constructor(e) {
        this.type = J;
        if (!Se) {
            Se = true;
            enableSetObservation();
        }
        this.collection = e;
        this.indexMap = createIndexMap(e.size);
        this.lenObs = void 0;
        xe.set(e, this);
    }
    notify() {
        const e = this.subs;
        const t = this.indexMap;
        if (ee) {
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
    let t = xe.get(e);
    if (t === void 0) {
        t = new SetObserver(e);
    }
    return t;
}

const Pe = Symbol.for("__au_map_obs__");

const Ie = Map[Pe] ?? defineHiddenProp(Map, Pe, new WeakMap);

const Le = Map.prototype;

const Me = Le.set;

const Re = Le.clear;

const _e = Le.delete;

const Be = {
    set: Me,
    clear: Re,
    delete: _e
};

const $e = [ "set", "clear", "delete" ];

const De = {
    set: function(e, t) {
        const r = Ie.get(this);
        if (r === undefined) {
            Me.call(this, e, t);
            return this;
        }
        const n = this.get(e);
        const i = this.size;
        Me.call(this, e, t);
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
        const e = Ie.get(this);
        if (e === undefined) {
            return Re.call(this);
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
            Re.call(this);
            t.length = 0;
            e.notify();
        }
        return undefined;
    },
    delete: function(e) {
        const t = Ie.get(this);
        if (t === undefined) {
            return _e.call(this, e);
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
                const o = _e.call(this, e);
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

const Fe = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const e of $e) {
    i(De[e], "observing", {
        value: true,
        writable: false,
        configurable: false,
        enumerable: false
    });
}

let je = false;

const Ne = "__au_map_on__";

function enableMapObservation() {
    if (!(h(Ne, Map) ?? false)) {
        f(Ne, true, Map);
        for (const e of $e) {
            if (Le[e].observing !== true) {
                i(Le, e, {
                    ...Fe,
                    value: De[e]
                });
            }
        }
    }
}

function disableMapObservation() {
    for (const e of $e) {
        if (Le[e].observing === true) {
            i(Le, e, {
                ...Fe,
                value: Be[e]
            });
        }
    }
}

class MapObserver {
    constructor(e) {
        this.type = J;
        if (!je) {
            je = true;
            enableMapObservation();
        }
        this.collection = e;
        this.indexMap = createIndexMap(e.size);
        this.lenObs = void 0;
        Ie.set(e, this);
    }
    notify() {
        const e = this.subs;
        const t = this.indexMap;
        if (ee) {
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
    let t = Ie.get(e);
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
    i(t, "obs", {
        get: getObserverRecord
    });
    ensureProto(t, "handleChange", noopHandleChange);
    ensureProto(t, "handleCollectionChange", noopHandleCollectionChange);
    return e;
}

function connectable(e) {
    return e == null ? connectableDecorator : connectableDecorator(e);
}

const Ve = l("IExpressionParser", (e => e.singleton(ExpressionParser)));

class ExpressionParser {
    constructor() {
        this.i = createLookup();
        this.u = createLookup();
        this.h = createLookup();
    }
    parse(e, t) {
        let r;
        switch (t) {
          case tt:
            return new CustomExpression(e);

          case Qe:
            r = this.h[e];
            if (r === void 0) {
                r = this.h[e] = this.$parse(e, t);
            }
            return r;

          case Xe:
            r = this.u[e];
            if (r === void 0) {
                r = this.u[e] = this.$parse(e, t);
            }
            return r;

          default:
            {
                if (e.length === 0) {
                    if (t === Ze || t === et) {
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
        st = e;
        rt = 0;
        nt = e.length;
        it = 0;
        ot = 0;
        at = 6291456;
        ct = "";
        ut = $charCodeAt(0);
        lt = true;
        ht = false;
        ft = true;
        pt = -1;
        return parse(61, t === void 0 ? et : t);
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

const Ue = PrimitiveLiteralExpression.$false;

const He = PrimitiveLiteralExpression.$true;

const Ke = PrimitiveLiteralExpression.$null;

const ze = PrimitiveLiteralExpression.$undefined;

const Ge = new AccessThisExpression(0);

const We = new AccessThisExpression(1);

const qe = new AccessBoundaryExpression;

const Je = "None";

const Qe = "Interpolation";

const Xe = "IsIterator";

const Ye = "IsChainable";

const Ze = "IsFunction";

const et = "IsProperty";

const tt = "IsCustom";

let st = "";

let rt = 0;

let nt = 0;

let it = 0;

let ot = 0;

let at = 6291456;

let ct = "";

let ut;

let lt = true;

let ht = false;

let ft = true;

let pt = -1;

const dt = String.fromCharCode;

const $charCodeAt = e => st.charCodeAt(e);

const $tokenRaw = () => st.slice(ot, rt);

const wt = ("Infinity NaN isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent" + " Array BigInt Boolean Date Map Number Object RegExp Set String JSON Math Intl").split(" ");

function parseExpression(e, t) {
    st = e;
    rt = 0;
    nt = e.length;
    it = 0;
    ot = 0;
    at = 6291456;
    ct = "";
    ut = $charCodeAt(0);
    lt = true;
    ht = false;
    ft = true;
    pt = -1;
    return parse(61, t === void 0 ? et : t);
}

function parse(e, t) {
    if (t === tt) {
        return new CustomExpression(st);
    }
    if (rt === 0) {
        if (t === Qe) {
            return parseInterpolation();
        }
        nextToken();
        if (at & 4194304) {
            throw invalidStartOfExpression();
        }
    }
    lt = 513 > e;
    ht = false;
    ft = 514 > e;
    let r = false;
    let n = void 0;
    let i = 0;
    if (at & 131072) {
        const e = vt[at & 63];
        nextToken();
        n = new UnaryExpression(e, parse(514, t));
        lt = false;
    } else {
        e: switch (at) {
          case 12295:
            i = it;
            lt = false;
            ft = false;
            do {
                nextToken();
                ++i;
                switch (at) {
                  case 65546:
                    nextToken();
                    if ((at & 12288) === 0) {
                        throw expectedIdentifier();
                    }
                    break;

                  case 11:
                  case 12:
                    throw expectedIdentifier();

                  case 2162701:
                    ht = true;
                    nextToken();
                    if ((at & 12288) === 0) {
                        n = i === 0 ? Ge : i === 1 ? We : new AccessThisExpression(i);
                        r = true;
                        break e;
                    }
                    break;

                  default:
                    if (at & 2097152) {
                        n = i === 0 ? Ge : i === 1 ? We : new AccessThisExpression(i);
                        break e;
                    }
                    throw invalidMemberExpression();
                }
            } while (at === 12295);

          case 4096:
            {
                const e = ct;
                if (t === Xe) {
                    n = new BindingIdentifier(e);
                } else if (ft && wt.includes(e)) {
                    n = new AccessGlobalExpression(e);
                } else if (ft && e === "import") {
                    throw unexpectedImportKeyword();
                } else {
                    n = new AccessScopeExpression(e, i);
                }
                lt = !ht;
                nextToken();
                if (consumeOpt(51)) {
                    if (at === 524297) {
                        throw functionBodyInArrowFn();
                    }
                    const t = ht;
                    const r = it;
                    ++it;
                    const i = parse(62, Je);
                    ht = t;
                    it = r;
                    lt = false;
                    n = new ArrowFunction([ new BindingIdentifier(e) ], i);
                }
                break;
            }

          case 11:
            throw unexpectedDoubleDot();

          case 12:
            throw invalidSpreadOp();

          case 12292:
            lt = false;
            nextToken();
            switch (it) {
              case 0:
                n = Ge;
                break;

              case 1:
                n = We;
                break;

              default:
                n = new AccessThisExpression(it);
                break;
            }
            break;

          case 12293:
            lt = false;
            nextToken();
            n = qe;
            break;

          case 2688008:
            n = parseCoverParenthesizedExpressionAndArrowParameterList(t);
            break;

          case 2688019:
            n = st.search(/\s+of\s+/) > rt ? parseArrayDestructuring() : parseArrayLiteralExpression(t);
            break;

          case 524297:
            n = parseObjectLiteralExpression(t);
            break;

          case 2163760:
            n = new TemplateExpression([ ct ]);
            lt = false;
            nextToken();
            break;

          case 2163761:
            n = parseTemplate(t, n, false);
            break;

          case 16384:
          case 32768:
            n = new PrimitiveLiteralExpression(ct);
            lt = false;
            nextToken();
            break;

          case 8194:
          case 8195:
          case 8193:
          case 8192:
            n = vt[at & 63];
            lt = false;
            nextToken();
            break;

          default:
            if (rt >= nt) {
                throw unexpectedEndOfExpression();
            } else {
                throw unconsumedToken();
            }
        }
        if (t === Xe) {
            return parseForOfStatement(n);
        }
        if (514 < e) {
            return n;
        }
        if (at === 11 || at === 12) {
            throw expectedIdentifier();
        }
        if (n.$kind === p) {
            switch (at) {
              case 2162701:
                ht = true;
                lt = false;
                nextToken();
                if ((at & 13312) === 0) {
                    throw unexpectedTokenInOptionalChain();
                }
                if (at & 12288) {
                    n = new AccessScopeExpression(ct, n.ancestor);
                    nextToken();
                } else if (at === 2688008) {
                    n = new CallFunctionExpression(n, parseArguments(), true);
                } else if (at === 2688019) {
                    n = parseKeyedExpression(n, true);
                } else {
                    throw invalidTaggedTemplateOnOptionalChain();
                }
                break;

              case 65546:
                lt = !ht;
                nextToken();
                if ((at & 12288) === 0) {
                    throw expectedIdentifier();
                }
                n = new AccessScopeExpression(ct, n.ancestor);
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
        while ((at & 65536) > 0) {
            switch (at) {
              case 2162701:
                n = parseOptionalChainLHS(n);
                break;

              case 65546:
                nextToken();
                if ((at & 12288) === 0) {
                    throw expectedIdentifier();
                }
                n = parseMemberExpressionLHS(n, false);
                break;

              case 11:
              case 12:
                throw expectedIdentifier();

              case 2688008:
                if (n.$kind === b) {
                    n = new CallScopeExpression(n.name, parseArguments(), n.ancestor, false);
                } else if (n.$kind === S) {
                    n = new CallMemberExpression(n.object, n.name, parseArguments(), n.optional, false);
                } else if (n.$kind === w) {
                    n = new CallGlobalExpression(n.name, parseArguments());
                } else {
                    n = new CallFunctionExpression(n, parseArguments(), false);
                }
                break;

              case 2688019:
                n = parseKeyedExpression(n, false);
                break;

              case 2163760:
                if (ht) {
                    throw invalidTaggedTemplateOnOptionalChain();
                }
                n = createTemplateTail(n);
                break;

              case 2163761:
                if (ht) {
                    throw invalidTaggedTemplateOnOptionalChain();
                }
                n = parseTemplate(t, n, true);
                break;
            }
        }
    }
    if (at === 11 || at === 12) {
        throw expectedIdentifier();
    }
    if (513 < e) {
        return n;
    }
    while ((at & 262144) > 0) {
        const r = at;
        if ((r & 960) <= e) {
            break;
        }
        nextToken();
        n = new BinaryExpression(vt[r & 63], n, parse(r & 960, t));
        lt = false;
    }
    if (63 < e) {
        return n;
    }
    if (consumeOpt(6291479)) {
        const e = parse(62, t);
        consume(6291477);
        n = new ConditionalExpression(n, e, parse(62, t));
        lt = false;
    }
    if (62 < e) {
        return n;
    }
    if (consumeOpt(4194350)) {
        if (!lt) {
            throw lhsNotAssignable();
        }
        n = new AssignExpression(n, parse(62, t));
    }
    if (61 < e) {
        return n;
    }
    while (consumeOpt(6291481)) {
        if (at === 6291456) {
            throw expectedValueConverterIdentifier();
        }
        const e = ct;
        nextToken();
        const r = new Array;
        while (consumeOpt(6291477)) {
            r.push(parse(62, t));
        }
        n = new ValueConverterExpression(n, e, r);
    }
    while (consumeOpt(6291480)) {
        if (at === 6291456) {
            throw expectedBindingBehaviorIdentifier();
        }
        const e = ct;
        nextToken();
        const r = new Array;
        while (consumeOpt(6291477)) {
            r.push(parse(62, t));
        }
        n = new BindingBehaviorExpression(n, e, r);
    }
    if (at !== 6291456) {
        if (t === Qe && at === 7340046) {
            return n;
        }
        if (t === Ye && at === 6291478) {
            if (rt === nt) {
                throw unconsumedToken();
            }
            pt = rt - 1;
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
    const t = new DestructuringAssignmentExpression(V, e, void 0, void 0);
    let r = "";
    let n = true;
    let i = 0;
    while (n) {
        nextToken();
        switch (at) {
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
            e.push(new DestructuringAssignmentSingleExpression(new AccessMemberExpression(Ge, r), new AccessKeyedExpression(Ge, new PrimitiveLiteralExpression(i++)), void 0));
            r = "";
        } else {
            i++;
        }
    }
}

function parseArguments() {
    const e = ht;
    nextToken();
    const t = [];
    while (at !== 7340047) {
        t.push(parse(62, Je));
        if (!consumeOpt(6291472)) {
            break;
        }
    }
    consume(7340047);
    lt = false;
    ht = e;
    return t;
}

function parseKeyedExpression(e, t) {
    const r = ht;
    nextToken();
    e = new AccessKeyedExpression(e, parse(62, Je), t);
    consume(7340052);
    lt = !r;
    ht = r;
    return e;
}

function parseOptionalChainLHS(e) {
    ht = true;
    lt = false;
    nextToken();
    if ((at & 13312) === 0) {
        throw unexpectedTokenInOptionalChain();
    }
    if (at & 12288) {
        return parseMemberExpressionLHS(e, true);
    }
    if (at === 2688008) {
        if (e.$kind === b) {
            return new CallScopeExpression(e.name, parseArguments(), e.ancestor, true);
        } else if (e.$kind === S) {
            return new CallMemberExpression(e.object, e.name, parseArguments(), e.optional, true);
        } else {
            return new CallFunctionExpression(e, parseArguments(), true);
        }
    }
    if (at === 2688019) {
        return parseKeyedExpression(e, true);
    }
    throw invalidTaggedTemplateOnOptionalChain();
}

function parseMemberExpressionLHS(e, t) {
    const r = ct;
    switch (at) {
      case 2162701:
        {
            ht = true;
            lt = false;
            const n = rt;
            const i = ot;
            const o = at;
            const a = ut;
            const c = ct;
            const u = lt;
            const l = ht;
            nextToken();
            if ((at & 13312) === 0) {
                throw unexpectedTokenInOptionalChain();
            }
            if (at === 2688008) {
                return new CallMemberExpression(e, r, parseArguments(), t, true);
            }
            rt = n;
            ot = i;
            at = o;
            ut = a;
            ct = c;
            lt = u;
            ht = l;
            return new AccessMemberExpression(e, r, t);
        }

      case 2688008:
        {
            lt = false;
            return new CallMemberExpression(e, r, parseArguments(), t, false);
        }

      default:
        {
            lt = !ht;
            nextToken();
            return new AccessMemberExpression(e, r, t);
        }
    }
}

function parseCoverParenthesizedExpressionAndArrowParameterList(e) {
    nextToken();
    const t = rt;
    const r = ot;
    const n = at;
    const i = ut;
    const o = ct;
    const a = lt;
    const c = ht;
    const u = [];
    let l = 1;
    let h = false;
    e: while (true) {
        if (at === 12) {
            nextToken();
            if (at !== 4096) {
                throw expectedIdentifier();
            }
            u.push(new BindingIdentifier(ct));
            nextToken();
            if (at === 6291472) {
                throw restParamsMustBeLastParam();
            }
            if (at !== 7340047) {
                throw invalidSpreadOp();
            }
            nextToken();
            if (at !== 51) {
                throw invalidSpreadOp();
            }
            nextToken();
            const e = ht;
            const t = it;
            ++it;
            const r = parse(62, Je);
            ht = e;
            it = t;
            lt = false;
            return new ArrowFunction(u, r, true);
        }
        switch (at) {
          case 4096:
            u.push(new BindingIdentifier(ct));
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
        switch (at) {
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
    if (at === 51) {
        if (l === 1) {
            nextToken();
            if (at === 524297) {
                throw functionBodyInArrowFn();
            }
            const e = ht;
            const t = it;
            ++it;
            const r = parse(62, Je);
            ht = e;
            it = t;
            lt = false;
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
    rt = t;
    ot = r;
    at = n;
    ut = i;
    ct = o;
    lt = a;
    ht = c;
    const f = ht;
    const p = parse(62, e);
    ht = f;
    consume(7340047);
    if (at === 51) {
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
    const t = ht;
    nextToken();
    const r = new Array;
    while (at !== 7340052) {
        if (consumeOpt(6291472)) {
            r.push(ze);
            if (at === 7340052) {
                break;
            }
        } else {
            r.push(parse(62, e === Xe ? Je : e));
            if (consumeOpt(6291472)) {
                if (at === 7340052) {
                    break;
                }
            } else {
                break;
            }
        }
    }
    ht = t;
    consume(7340052);
    if (e === Xe) {
        return new ArrayBindingPattern(r);
    } else {
        lt = false;
        return new ArrayLiteralExpression(r);
    }
}

const bt = [ $, D, F, V, U ];

function parseForOfStatement(e) {
    if (!bt.includes(e.$kind)) {
        throw invalidLHSBindingIdentifierInForOf(e.$kind);
    }
    if (at !== 4204594) {
        throw invalidLHSBindingIdentifierInForOf(e.$kind);
    }
    nextToken();
    const t = e;
    const r = parse(61, Ye);
    return new ForOfStatement(t, r, pt);
}

function parseObjectLiteralExpression(e) {
    const t = ht;
    const r = new Array;
    const n = new Array;
    nextToken();
    while (at !== 7340046) {
        r.push(ct);
        if (at & 49152) {
            nextToken();
            consume(6291477);
            n.push(parse(62, e === Xe ? Je : e));
        } else if (at & 12288) {
            const t = ut;
            const r = at;
            const i = rt;
            nextToken();
            if (consumeOpt(6291477)) {
                n.push(parse(62, e === Xe ? Je : e));
            } else {
                ut = t;
                at = r;
                rt = i;
                n.push(parse(515, e === Xe ? Je : e));
            }
        } else {
            throw invalidPropDefInObjLiteral();
        }
        if (at !== 7340046) {
            consume(6291472);
        }
    }
    ht = t;
    consume(7340046);
    if (e === Xe) {
        return new ObjectBindingPattern(r, n);
    } else {
        lt = false;
        return new ObjectLiteralExpression(r, n);
    }
}

function parseInterpolation() {
    const e = [];
    const t = [];
    const r = nt;
    let n = "";
    while (rt < r) {
        switch (ut) {
          case 36:
            if ($charCodeAt(rt + 1) === 123) {
                e.push(n);
                n = "";
                rt += 2;
                ut = $charCodeAt(rt);
                nextToken();
                const r = parse(61, Qe);
                t.push(r);
                continue;
            } else {
                n += "$";
            }
            break;

          case 92:
            n += dt(unescapeCode(nextChar()));
            break;

          default:
            n += dt(ut);
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
    const n = ht;
    const i = [ ct ];
    consume(2163761);
    const o = [ parse(62, e) ];
    while ((at = scanTemplateTail()) !== 2163760) {
        i.push(ct);
        consume(2163761);
        o.push(parse(62, e));
    }
    i.push(ct);
    lt = false;
    ht = n;
    if (r) {
        nextToken();
        return new TaggedTemplateExpression(i, i, t, o);
    } else {
        nextToken();
        return new TemplateExpression(i, o);
    }
}

function createTemplateTail(e) {
    lt = false;
    const t = [ ct ];
    nextToken();
    return new TaggedTemplateExpression(t, t, e);
}

function nextToken() {
    while (rt < nt) {
        ot = rt;
        if ((at = At[ut]()) != null) {
            return;
        }
    }
    at = 6291456;
}

function nextChar() {
    return ut = $charCodeAt(++rt);
}

function scanIdentifier() {
    while (yt[nextChar()]) ;
    const e = xt[ct = $tokenRaw()];
    return e === undefined ? 4096 : e;
}

function scanNumber(e) {
    let t = ut;
    if (e === false) {
        do {
            t = nextChar();
        } while (t <= 57 && t >= 48);
        if (t !== 46) {
            ct = parseInt($tokenRaw(), 10);
            return 32768;
        }
        t = nextChar();
        if (rt >= nt) {
            ct = parseInt($tokenRaw().slice(0, -1), 10);
            return 32768;
        }
    }
    if (t <= 57 && t >= 48) {
        do {
            t = nextChar();
        } while (t <= 57 && t >= 48);
    } else {
        ut = $charCodeAt(--rt);
    }
    ct = parseFloat($tokenRaw());
    return 32768;
}

function scanString() {
    const e = ut;
    nextChar();
    let t = 0;
    const r = new Array;
    let n = rt;
    while (ut !== e) {
        if (ut === 92) {
            r.push(st.slice(n, rt));
            nextChar();
            t = unescapeCode(ut);
            nextChar();
            r.push(dt(t));
            n = rt;
        } else if (rt >= nt) {
            throw unterminatedStringLiteral();
        } else {
            nextChar();
        }
    }
    const i = st.slice(n, rt);
    nextChar();
    r.push(i);
    const o = r.join("");
    ct = o;
    return 16384;
}

function scanTemplate() {
    let e = true;
    let t = "";
    while (nextChar() !== 96) {
        if (ut === 36) {
            if (rt + 1 < nt && $charCodeAt(rt + 1) === 123) {
                rt++;
                e = false;
                break;
            } else {
                t += "$";
            }
        } else if (ut === 92) {
            t += dt(unescapeCode(nextChar()));
        } else {
            if (rt >= nt) {
                throw unterminatedTemplateLiteral();
            }
            t += dt(ut);
        }
    }
    nextChar();
    ct = t;
    if (e) {
        return 2163760;
    }
    return 2163761;
}

const scanTemplateTail = () => {
    if (rt >= nt) {
        throw unterminatedTemplateLiteral();
    }
    rt--;
    return scanTemplate();
};

const consumeOpt = e => {
    if (at === e) {
        nextToken();
        return true;
    }
    return false;
};

const consume = e => {
    if (at === e) {
        nextToken();
    } else {
        throw missingExpectedToken();
    }
};

const invalidStartOfExpression = () => createMappedError(151, st);

const invalidSpreadOp = () => createMappedError(152, st);

const expectedIdentifier = () => createMappedError(153, st);

const invalidMemberExpression = () => createMappedError(154, st);

const unexpectedEndOfExpression = () => createMappedError(155, st);

const unconsumedToken = () => createMappedError(156, $tokenRaw(), rt, st);

const invalidEmptyExpression = () => createMappedError(157);

const lhsNotAssignable = () => createMappedError(158, st);

const expectedValueConverterIdentifier = () => createMappedError(159, st);

const expectedBindingBehaviorIdentifier = () => createMappedError(160, st);

const unexpectedOfKeyword = () => createMappedError(161, st);

const unexpectedImportKeyword = () => createMappedError(162, st);

const invalidLHSBindingIdentifierInForOf = e => createMappedError(163, st, e);

const invalidPropDefInObjLiteral = () => createMappedError(164, st);

const unterminatedStringLiteral = () => createMappedError(165, st);

const unterminatedTemplateLiteral = () => createMappedError(166, st);

const missingExpectedToken = e => createMappedError(167, st);

const unexpectedCharacter = () => {
    throw createMappedError(168, st);
};

unexpectedCharacter.notMapped = true;

const unexpectedTokenInDestructuring = () => createMappedError(170, st);

const unexpectedTokenInOptionalChain = () => createMappedError(171, st);

const invalidTaggedTemplateOnOptionalChain = () => createMappedError(172, st);

const invalidArrowParameterList = () => createMappedError(173, st);

const defaultParamsInArrowFn = () => createMappedError(174, st);

const destructuringParamsInArrowFn = () => createMappedError(175, st);

const restParamsMustBeLastParam = () => createMappedError(176, st);

const functionBodyInArrowFn = () => createMappedError(178, st);

const unexpectedDoubleDot = () => createMappedError(179, st);

const vt = [ Ue, He, Ke, ze, "this", "$this", null, "$parent", "(", "{", ".", "..", "...", "?.", "}", ")", ",", "[", "]", ":", ";", "?", "'", '"', "&", "|", "??", "||", "&&", "==", "!=", "===", "!==", "<", ">", "<=", ">=", "in", "instanceof", "+", "-", "typeof", "void", "*", "%", "/", "=", "!", 2163760, 2163761, "of", "=>" ];

const xt = a(Object.create(null), {
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

const gt = {
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

const Et = new Set;

decompress(null, Et, gt.AsciiIdPart, true);

const yt = new Uint8Array(65535);

decompress(yt, null, gt.IdStart, 1);

decompress(yt, null, gt.Digit, 1);

const At = new Array(65535);

At.fill(unexpectedCharacter, 0, 65535);

decompress(At, null, gt.Skip, (() => {
    nextChar();
    return null;
}));

decompress(At, null, gt.IdStart, scanIdentifier);

decompress(At, null, gt.Digit, (() => scanNumber(false)));

At[34] = At[39] = () => scanString();

At[96] = () => scanTemplate();

At[33] = () => {
    if (nextChar() !== 61) {
        return 131119;
    }
    if (nextChar() !== 61) {
        return 6553950;
    }
    nextChar();
    return 6553952;
};

At[61] = () => {
    if (nextChar() === 62) {
        nextChar();
        return 51;
    }
    if (ut !== 61) {
        return 4194350;
    }
    if (nextChar() !== 61) {
        return 6553949;
    }
    nextChar();
    return 6553951;
};

At[38] = () => {
    if (nextChar() !== 38) {
        return 6291480;
    }
    nextChar();
    return 6553884;
};

At[124] = () => {
    if (nextChar() !== 124) {
        return 6291481;
    }
    nextChar();
    return 6553819;
};

At[63] = () => {
    if (nextChar() === 46) {
        const e = $charCodeAt(rt + 1);
        if (e <= 48 || e >= 57) {
            nextChar();
            return 2162701;
        }
        return 6291479;
    }
    if (ut !== 63) {
        return 6291479;
    }
    nextChar();
    return 6553754;
};

At[46] = () => {
    if (nextChar() <= 57 && ut >= 48) {
        return scanNumber(true);
    }
    if (ut === 46) {
        if (nextChar() !== 46) {
            return 11;
        }
        nextChar();
        return 12;
    }
    return 65546;
};

At[60] = () => {
    if (nextChar() !== 61) {
        return 6554017;
    }
    nextChar();
    return 6554019;
};

At[62] = () => {
    if (nextChar() !== 61) {
        return 6554018;
    }
    nextChar();
    return 6554020;
};

At[37] = returnToken(6554156);

At[40] = returnToken(2688008);

At[41] = returnToken(7340047);

At[42] = returnToken(6554155);

At[43] = returnToken(2490855);

At[44] = returnToken(6291472);

At[45] = returnToken(2490856);

At[47] = returnToken(6554157);

At[58] = returnToken(6291477);

At[59] = returnToken(6291478);

At[91] = returnToken(2688019);

At[93] = returnToken(7340052);

At[123] = returnToken(524297);

At[125] = returnToken(7340046);

let Ct = null;

const mt = [];

let kt = false;

function pauseConnecting() {
    kt = false;
}

function resumeConnecting() {
    kt = true;
}

function currentConnectable() {
    return Ct;
}

function enterConnectable(e) {
    if (e == null) {
        throw createMappedError(206);
    }
    if (Ct == null) {
        Ct = e;
        mt[0] = Ct;
        kt = true;
        return;
    }
    if (Ct === e) {
        throw createMappedError(207);
    }
    mt.push(e);
    Ct = e;
    kt = true;
}

function exitConnectable(e) {
    if (e == null) {
        throw createMappedError(208);
    }
    if (Ct !== e) {
        throw createMappedError(209);
    }
    mt.pop();
    Ct = mt.length > 0 ? mt[mt.length - 1] : null;
    kt = Ct != null;
}

const Ot = /*@__PURE__*/ c({
    get current() {
        return Ct;
    },
    get connecting() {
        return kt;
    },
    enter: enterConnectable,
    exit: exitConnectable,
    pause: pauseConnecting,
    resume: resumeConnecting
});

const St = Reflect.get;

const Tt = Object.prototype.toString;

const Pt = new WeakMap;

const It = "__au_nw__";

const Lt = "__au_nw";

function canWrap(e) {
    switch (Tt.call(e)) {
      case "[object Object]":
        return e.constructor[It] !== true;

      case "[object Array]":
      case "[object Map]":
      case "[object Set]":
        return true;

      default:
        return false;
    }
}

const Mt = "__raw__";

function wrap(e) {
    return canWrap(e) ? getProxy(e) : e;
}

function getProxy(e) {
    return Pt.get(e) ?? createProxy(e);
}

function getRaw(e) {
    return e[Mt] ?? e;
}

function unwrap(e) {
    return canWrap(e) && e[Mt] || e;
}

function doNotCollect(e, t) {
    return t === "constructor" || t === "__proto__" || t === "$observers" || t === Symbol.toPrimitive || t === Symbol.toStringTag || e.constructor[`${Lt}_${u(t)}__`] === true;
}

function createProxy(e) {
    const t = isArray(e) ? _t : isMap(e) || isSet(e) ? Bt : Rt;
    const r = new Proxy(e, t);
    Pt.set(e, r);
    Pt.set(r, r);
    return r;
}

const Rt = {
    get(e, t, r) {
        if (t === Mt) {
            return e;
        }
        const n = currentConnectable();
        if (!kt || doNotCollect(e, t) || n == null) {
            return St(e, t, r);
        }
        n.observe(e, t);
        return wrap(St(e, t, r));
    }
};

const _t = {
    get(e, t, r) {
        if (t === Mt) {
            return e;
        }
        if (!kt || doNotCollect(e, t) || Ct == null) {
            return St(e, t, r);
        }
        switch (t) {
          case "length":
            Ct.observe(e, "length");
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
        Ct.observe(e, t);
        return wrap(St(e, t, r));
    },
    ownKeys(e) {
        currentConnectable()?.observe(e, "length");
        return Reflect.ownKeys(e);
    }
};

function wrappedArrayMap(e, t) {
    const r = getRaw(this);
    const n = r.map(((r, n) => unwrap(e.call(t, wrap(r), n, this))));
    observeCollection(Ct, r);
    return wrap(n);
}

function wrappedArrayEvery(e, t) {
    const r = getRaw(this);
    const n = r.every(((r, n) => e.call(t, wrap(r), n, this)));
    observeCollection(Ct, r);
    return n;
}

function wrappedArrayFilter(e, t) {
    const r = getRaw(this);
    const n = r.filter(((r, n) => unwrap(e.call(t, wrap(r), n, this))));
    observeCollection(Ct, r);
    return wrap(n);
}

function wrappedArrayIncludes(e) {
    const t = getRaw(this);
    const r = t.includes(unwrap(e));
    observeCollection(Ct, t);
    return r;
}

function wrappedArrayIndexOf(e) {
    const t = getRaw(this);
    const r = t.indexOf(unwrap(e));
    observeCollection(Ct, t);
    return r;
}

function wrappedArrayLastIndexOf(e) {
    const t = getRaw(this);
    const r = t.lastIndexOf(unwrap(e));
    observeCollection(Ct, t);
    return r;
}

function wrappedArrayFindIndex(e, t) {
    const r = getRaw(this);
    const n = r.findIndex(((r, n) => unwrap(e.call(t, wrap(r), n, this))));
    observeCollection(Ct, r);
    return n;
}

function wrappedArrayFind(e, t) {
    const r = getRaw(this);
    const n = r.find(((t, r) => e(wrap(t), r, this)), t);
    observeCollection(Ct, r);
    return wrap(n);
}

function wrappedArrayFlat() {
    const e = getRaw(this);
    observeCollection(Ct, e);
    return wrap(e.flat());
}

function wrappedArrayFlatMap(e, t) {
    const r = getRaw(this);
    observeCollection(Ct, r);
    return getProxy(r.flatMap(((r, n) => wrap(e.call(t, wrap(r), n, this)))));
}

function wrappedArrayJoin(e) {
    const t = getRaw(this);
    observeCollection(Ct, t);
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
    observeCollection(Ct, t);
    return wrap(r);
}

function wrappedArraySome(e, t) {
    const r = getRaw(this);
    const n = r.some(((r, n) => unwrap(e.call(t, wrap(r), n, this))));
    observeCollection(Ct, r);
    return n;
}

function wrappedArraySort(e) {
    const t = getRaw(this);
    const r = t.sort(e);
    observeCollection(Ct, t);
    return wrap(r);
}

function wrappedArraySlice(e, t) {
    const r = getRaw(this);
    observeCollection(Ct, r);
    return getProxy(r.slice(e, t));
}

function wrappedReduce(e, t) {
    const r = getRaw(this);
    const n = r.reduce(((t, r, n) => e(t, wrap(r), n, this)), t);
    observeCollection(Ct, r);
    return wrap(n);
}

function wrappedReduceRight(e, t) {
    const r = getRaw(this);
    const n = r.reduceRight(((t, r, n) => e(t, wrap(r), n, this)), t);
    observeCollection(Ct, r);
    return wrap(n);
}

const Bt = {
    get(e, t, r) {
        if (t === Mt) {
            return e;
        }
        const n = currentConnectable();
        if (!kt || doNotCollect(e, t) || n == null) {
            return St(e, t, r);
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
        return wrap(St(e, t, r));
    }
};

function wrappedForEach(e, t) {
    const r = getRaw(this);
    observeCollection(Ct, r);
    return r.forEach(((r, n) => {
        e.call(t, wrap(r), wrap(n), this);
    }));
}

function wrappedHas(e) {
    const t = getRaw(this);
    observeCollection(Ct, t);
    return t.has(unwrap(e));
}

function wrappedGet(e) {
    const t = getRaw(this);
    observeCollection(Ct, t);
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
    observeCollection(Ct, e);
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
    observeCollection(Ct, e);
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
    observeCollection(Ct, e);
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

const $t = /*@__PURE__*/ c({
    getProxy: getProxy,
    getRaw: getRaw,
    wrap: wrap,
    unwrap: unwrap,
    rawKey: Mt
});

class ComputedObserver {
    constructor(e, t, r, n, i) {
        this.type = J;
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
            if (!o(e, this.v)) {
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
        if (!o(t, e)) {
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

const Dt = /*@__PURE__*/ l("IDirtyChecker", void 0);

const Ft = {
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
    static register(t) {
        t.register(e.Registration.singleton(this, this), e.Registration.aliasTo(this, Dt));
    }
    constructor() {
        this.tracked = [];
        this.T = null;
        this.P = 0;
        this.p = e.resolve(e.IPlatform);
        this.check = () => {
            if (Ft.disabled) {
                return;
            }
            if (++this.P < Ft.timeoutsPerCheck) {
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
        if (Ft.throw) {
            throw createError(`AUR0222:${u(t)}`);
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

class DirtyCheckProperty {
    constructor(e, t, r) {
        this.obj = t;
        this.key = r;
        this.type = q;
        this.ov = void 0;
        this.I = e;
    }
    getValue() {
        return this.obj[this.key];
    }
    setValue(e) {
        throw createError(`Trying to set value for property ${u(this.key)} in dirty checker`);
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
        this.type = q;
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
        this.type = q;
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
        this.type = J;
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
            if (o(e, this.v)) {
                return;
            }
            jt = this.v;
            this.v = e;
            this.cb?.(e, jt);
            this.subs.notify(e, jt);
        } else {
            this.v = this.o[this.k] = e;
            this.cb?.(e, jt);
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
            i(this.o, this.k, {
                enumerable: true,
                configurable: true,
                get: a((() => this.getValue()), {
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
            i(this.o, this.k, {
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

let jt = void 0;

const Nt = new PropertyAccessor;

const Vt = /*@__PURE__*/ l("IObserverLocator", (e => e.singleton(ObserverLocator)));

const Ut = /*@__PURE__*/ l("INodeObserverLocator", (e => e.cachedCallback((e => new DefaultNodeObserverLocator))));

class DefaultNodeObserverLocator {
    handles() {
        return false;
    }
    getObserver() {
        return Nt;
    }
    getAccessor() {
        return Nt;
    }
}

class ObserverLocator {
    constructor() {
        this.L = [];
        this.I = e.resolve(Dt);
        this.M = e.resolve(Ut);
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
        return Nt;
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
    createObserver(t, r) {
        if (this.M.handles(t, r, this)) {
            return this.M.getObserver(t, r, this);
        }
        switch (r) {
          case "length":
            if (isArray(t)) {
                return getArrayObserver(t).getLengthObserver();
            }
            break;

          case "size":
            if (isMap(t)) {
                return getMapObserver(t).getLengthObserver();
            } else if (isSet(t)) {
                return getSetObserver(t).getLengthObserver();
            }
            break;

          default:
            if (isArray(t) && e.isArrayIndex(r)) {
                return getArrayObserver(t).getIndexObserver(Number(r));
            }
            break;
        }
        let i = Kt(t, r);
        if (i === void 0) {
            let e = Ht(t);
            while (e !== null) {
                i = Kt(e, r);
                if (i === void 0) {
                    e = Ht(e);
                } else {
                    break;
                }
            }
        }
        if (i !== void 0 && !n.call(i, "value")) {
            let e = this.R(t, r, i);
            if (e == null) {
                e = (i.get?.getObserver ?? i.set?.getObserver)?.(t, this);
            }
            return e == null ? i.configurable ? this._(t, r, i, true) : this.I.createProperty(t, r) : e;
        }
        return new SetterObserver(t, r);
    }
    _(e, t, r, n) {
        const o = new ComputedObserver(e, r.get, r.set, this, !!n);
        i(e, t, {
            enumerable: r.enumerable,
            configurable: true,
            get: a((() => o.getValue()), {
                getObserver: () => o
            }),
            set: e => {
                o.setValue(e);
            }
        });
        return o;
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

const Ht = Object.getPrototypeOf;

const Kt = Object.getOwnPropertyDescriptor;

const getObserverLookup = e => {
    let t = e.$observers;
    if (t === void 0) {
        i(e, "$observers", {
            enumerable: false,
            value: t = createLookup()
        });
    }
    return t;
};

const zt = /*@__PURE__*/ l("IObservation", (e => e.singleton(Observation)));

class Observation {
    static get inject() {
        return [ Vt ];
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
        i(e, "$observers", {
            value: {}
        });
    }
    return e.$observers;
}

const Gt = {};

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
        const o = t === void 0;
        n = typeof n !== "object" ? {
            name: n
        } : n || {};
        if (o) {
            t = n.name;
        }
        if (t == null || t === "") {
            throw createMappedError(224);
        }
        const a = n.callback || `${u(t)}Changed`;
        let c = Gt;
        if (r) {
            delete r.value;
            delete r.writable;
            c = r.initializer?.();
            delete r.initializer;
        } else {
            r = {
                configurable: true
            };
        }
        if (!("enumerable" in r)) {
            r.enumerable = true;
        }
        const l = n.set;
        r.get = function g() {
            const e = getNotifier(this, t, a, c, l);
            currentConnectable()?.subscribeTo(e);
            return e.getValue();
        };
        r.set = function s(e) {
            getNotifier(this, t, a, c, l).setValue(e);
        };
        r.get.getObserver = function gO(e) {
            return getNotifier(e, t, a, c, l);
        };
        if (o) {
            i(e.prototype, t, r);
        } else {
            return r;
        }
    }
}

function getNotifier(e, t, r, n, i) {
    const o = getObserversLookup(e);
    let a = o[t];
    if (a == null) {
        a = new SetterNotifier(e, r, i, n === Gt ? void 0 : n);
        o[t] = a;
    }
    return a;
}

class SetterNotifier {
    constructor(e, t, r, n) {
        this.type = J;
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
        if (!o(e, this.v)) {
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
            defineHiddenProp(e, It, true);
        } else {
            defineHiddenProp(e.constructor, `${Lt}_${u(t)}__`, true);
        }
    }
}

const Wt = l("ISignaler", (e => e.singleton(Signaler)));

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
        var r;
        ((r = this.signals)[e] ?? (r[e] = new Set)).add(t);
    }
    removeSignalListener(e, t) {
        this.signals[e]?.delete(t);
    }
}

exports.AccessBoundaryExpression = AccessBoundaryExpression;

exports.AccessGlobalExpression = AccessGlobalExpression;

exports.AccessKeyedExpression = AccessKeyedExpression;

exports.AccessMemberExpression = AccessMemberExpression;

exports.AccessScopeExpression = AccessScopeExpression;

exports.AccessThisExpression = AccessThisExpression;

exports.AccessorType = Y;

exports.ArrayBindingPattern = ArrayBindingPattern;

exports.ArrayIndexObserver = ArrayIndexObserver;

exports.ArrayLiteralExpression = ArrayLiteralExpression;

exports.ArrayObserver = ArrayObserver;

exports.ArrowFunction = ArrowFunction;

exports.AssignExpression = AssignExpression;

exports.BinaryExpression = BinaryExpression;

exports.BindingBehaviorExpression = BindingBehaviorExpression;

exports.BindingContext = BindingContext;

exports.BindingIdentifier = BindingIdentifier;

exports.BindingObserverRecord = BindingObserverRecord;

exports.CallFunctionExpression = CallFunctionExpression;

exports.CallMemberExpression = CallMemberExpression;

exports.CallScopeExpression = CallScopeExpression;

exports.CollectionLengthObserver = CollectionLengthObserver;

exports.CollectionSizeObserver = CollectionSizeObserver;

exports.ComputedObserver = ComputedObserver;

exports.ConditionalExpression = ConditionalExpression;

exports.ConnectableSwitcher = Ot;

exports.CustomExpression = CustomExpression;

exports.DestructuringAssignmentExpression = DestructuringAssignmentExpression;

exports.DestructuringAssignmentRestExpression = DestructuringAssignmentRestExpression;

exports.DestructuringAssignmentSingleExpression = DestructuringAssignmentSingleExpression;

exports.DirtyCheckProperty = DirtyCheckProperty;

exports.DirtyCheckSettings = Ft;

exports.DirtyChecker = DirtyChecker;

exports.ForOfStatement = ForOfStatement;

exports.ICoercionConfiguration = W;

exports.IDirtyChecker = Dt;

exports.IExpressionParser = Ve;

exports.INodeObserverLocator = Ut;

exports.IObservation = zt;

exports.IObserverLocator = Vt;

exports.ISignaler = Wt;

exports.Interpolation = Interpolation;

exports.MapObserver = MapObserver;

exports.ObjectBindingPattern = ObjectBindingPattern;

exports.ObjectLiteralExpression = ObjectLiteralExpression;

exports.Observation = Observation;

exports.ObserverLocator = ObserverLocator;

exports.PrimitiveLiteralExpression = PrimitiveLiteralExpression;

exports.PrimitiveObserver = PrimitiveObserver;

exports.PropertyAccessor = PropertyAccessor;

exports.ProxyObservable = $t;

exports.Scope = Scope;

exports.SetObserver = SetObserver;

exports.SetterObserver = SetterObserver;

exports.SubscriberRecord = SubscriberRecord;

exports.TaggedTemplateExpression = TaggedTemplateExpression;

exports.TemplateExpression = TemplateExpression;

exports.UnaryExpression = UnaryExpression;

exports.Unparser = Unparser;

exports.ValueConverterExpression = ValueConverterExpression;

exports.astAssign = astAssign;

exports.astBind = astBind;

exports.astEvaluate = astEvaluate;

exports.astUnbind = astUnbind;

exports.astVisit = astVisit;

exports.batch = batch;

exports.cloneIndexMap = cloneIndexMap;

exports.connectable = connectable;

exports.copyIndexMap = copyIndexMap;

exports.createIndexMap = createIndexMap;

exports.disableArrayObservation = disableArrayObservation;

exports.disableMapObservation = disableMapObservation;

exports.disableSetObservation = disableSetObservation;

exports.enableArrayObservation = enableArrayObservation;

exports.enableMapObservation = enableMapObservation;

exports.enableSetObservation = enableSetObservation;

exports.getCollectionObserver = getCollectionObserver;

exports.getObserverLookup = getObserverLookup;

exports.isIndexMap = isIndexMap;

exports.nowrap = nowrap;

exports.observable = observable;

exports.parseExpression = parseExpression;

exports.subscriberCollection = subscriberCollection;
//# sourceMappingURL=index.cjs.map
