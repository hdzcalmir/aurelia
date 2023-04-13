import { DI as t, Protocol as e, emptyArray as s, isArrayIndex as r, IPlatform as i } from "@aurelia/kernel";

import { Metadata as n } from "@aurelia/metadata";

const o = Object;

const c = o.prototype.hasOwnProperty;

const u = Reflect.defineProperty;

const h = t => new Error(t);

const a = t => "function" === typeof t;

const l = t => "string" === typeof t;

const f = t => t instanceof o;

const w = t => t instanceof Array;

const b = t => t instanceof Set;

const p = t => t instanceof Map;

const d = o.is;

function v(t, e, s) {
    u(t, e, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: s
    });
    return s;
}

function g(t, e, s) {
    if (!(e in t)) v(t, e, s);
}

const A = Object.assign;

const x = String;

const m = t.createInterface;

const y = () => o.create(null);

const E = n.getOwn;

n.hasOwn;

const O = n.define;

e.annotation.keyFor;

e.resource.keyFor;

e.resource.appendTo;

const k = (t, e) => {
    switch (t.$kind) {
      case 11:
        return e.visitAccessKeyed(t);

      case 10:
        return e.visitAccessMember(t);

      case 1:
        return e.visitAccessScope(t);

      case 0:
        return e.visitAccessThis(t);

      case 19:
        return e.visitArrayBindingPattern(t);

      case 24:
        return e.visitDestructuringAssignmentExpression(t);

      case 2:
        return e.visitArrayLiteral(t);

      case 16:
        return e.visitArrowFunction(t);

      case 15:
        return e.visitAssign(t);

      case 13:
        return e.visitBinary(t);

      case 18:
        return e.visitBindingBehavior(t);

      case 21:
        return e.visitBindingIdentifier(t);

      case 9:
        return e.visitCallFunction(t);

      case 8:
        return e.visitCallMember(t);

      case 7:
        return e.visitCallScope(t);

      case 14:
        return e.visitConditional(t);

      case 26:
        return e.visitDestructuringAssignmentSingleExpression(t);

      case 22:
        return e.visitForOfStatement(t);

      case 23:
        return e.visitInterpolation(t);

      case 20:
        return e.visitObjectBindingPattern(t);

      case 25:
        return e.visitDestructuringAssignmentExpression(t);

      case 3:
        return e.visitObjectLiteral(t);

      case 4:
        return e.visitPrimitiveLiteral(t);

      case 12:
        return e.visitTaggedTemplate(t);

      case 5:
        return e.visitTemplate(t);

      case 6:
        return e.visitUnary(t);

      case 17:
        return e.visitValueConverter(t);

      case 28:
        return e.visitCustom(t);

      default:
        throw h(`Unknown ast node ${JSON.stringify(t)}`);
    }
};

class Unparser {
    constructor() {
        this.text = "";
    }
    static unparse(t) {
        const e = new Unparser;
        k(t, e);
        return e.text;
    }
    visitAccessMember(t) {
        k(t.object, this);
        this.text += `${t.optional ? "?" : ""}.${t.name}`;
    }
    visitAccessKeyed(t) {
        k(t.object, this);
        this.text += `${t.optional ? "?." : ""}[`;
        k(t.key, this);
        this.text += "]";
    }
    visitAccessThis(t) {
        if (0 === t.ancestor) {
            this.text += "$this";
            return;
        }
        this.text += "$parent";
        let e = t.ancestor - 1;
        while (e--) this.text += ".$parent";
    }
    visitAccessScope(t) {
        let e = t.ancestor;
        while (e--) this.text += "$parent.";
        this.text += t.name;
    }
    visitArrayLiteral(t) {
        const e = t.elements;
        this.text += "[";
        for (let t = 0, s = e.length; t < s; ++t) {
            if (0 !== t) this.text += ",";
            k(e[t], this);
        }
        this.text += "]";
    }
    visitArrowFunction(t) {
        const e = t.args;
        const s = e.length;
        let r = 0;
        let i = "(";
        let n;
        for (;r < s; ++r) {
            n = e[r].name;
            if (r > 0) i += ", ";
            if (r < s - 1) i += n; else i += t.rest ? `...${n}` : n;
        }
        this.text += `${i}) => `;
        k(t.body, this);
    }
    visitObjectLiteral(t) {
        const e = t.keys;
        const s = t.values;
        this.text += "{";
        for (let t = 0, r = e.length; t < r; ++t) {
            if (0 !== t) this.text += ",";
            this.text += `'${e[t]}':`;
            k(s[t], this);
        }
        this.text += "}";
    }
    visitPrimitiveLiteral(t) {
        this.text += "(";
        if (l(t.value)) {
            const e = t.value.replace(/'/g, "\\'");
            this.text += `'${e}'`;
        } else this.text += `${t.value}`;
        this.text += ")";
    }
    visitCallFunction(t) {
        this.text += "(";
        k(t.func, this);
        this.text += t.optional ? "?." : "";
        this.writeArgs(t.args);
        this.text += ")";
    }
    visitCallMember(t) {
        this.text += "(";
        k(t.object, this);
        this.text += `${t.optionalMember ? "?." : ""}.${t.name}${t.optionalCall ? "?." : ""}`;
        this.writeArgs(t.args);
        this.text += ")";
    }
    visitCallScope(t) {
        this.text += "(";
        let e = t.ancestor;
        while (e--) this.text += "$parent.";
        this.text += `${t.name}${t.optional ? "?." : ""}`;
        this.writeArgs(t.args);
        this.text += ")";
    }
    visitTemplate(t) {
        const {cooked: e, expressions: s} = t;
        const r = s.length;
        this.text += "`";
        this.text += e[0];
        for (let t = 0; t < r; t++) {
            k(s[t], this);
            this.text += e[t + 1];
        }
        this.text += "`";
    }
    visitTaggedTemplate(t) {
        const {cooked: e, expressions: s} = t;
        const r = s.length;
        k(t.func, this);
        this.text += "`";
        this.text += e[0];
        for (let t = 0; t < r; t++) {
            k(s[t], this);
            this.text += e[t + 1];
        }
        this.text += "`";
    }
    visitUnary(t) {
        this.text += `(${t.operation}`;
        if (t.operation.charCodeAt(0) >= 97) this.text += " ";
        k(t.expression, this);
        this.text += ")";
    }
    visitBinary(t) {
        this.text += "(";
        k(t.left, this);
        if (105 === t.operation.charCodeAt(0)) this.text += ` ${t.operation} `; else this.text += t.operation;
        k(t.right, this);
        this.text += ")";
    }
    visitConditional(t) {
        this.text += "(";
        k(t.condition, this);
        this.text += "?";
        k(t.yes, this);
        this.text += ":";
        k(t.no, this);
        this.text += ")";
    }
    visitAssign(t) {
        this.text += "(";
        k(t.target, this);
        this.text += "=";
        k(t.value, this);
        this.text += ")";
    }
    visitValueConverter(t) {
        const e = t.args;
        k(t.expression, this);
        this.text += `|${t.name}`;
        for (let t = 0, s = e.length; t < s; ++t) {
            this.text += ":";
            k(e[t], this);
        }
    }
    visitBindingBehavior(t) {
        const e = t.args;
        k(t.expression, this);
        this.text += `&${t.name}`;
        for (let t = 0, s = e.length; t < s; ++t) {
            this.text += ":";
            k(e[t], this);
        }
    }
    visitArrayBindingPattern(t) {
        const e = t.elements;
        this.text += "[";
        for (let t = 0, s = e.length; t < s; ++t) {
            if (0 !== t) this.text += ",";
            k(e[t], this);
        }
        this.text += "]";
    }
    visitObjectBindingPattern(t) {
        const e = t.keys;
        const s = t.values;
        this.text += "{";
        for (let t = 0, r = e.length; t < r; ++t) {
            if (0 !== t) this.text += ",";
            this.text += `'${e[t]}':`;
            k(s[t], this);
        }
        this.text += "}";
    }
    visitBindingIdentifier(t) {
        this.text += t.name;
    }
    visitForOfStatement(t) {
        k(t.declaration, this);
        this.text += " of ";
        k(t.iterable, this);
    }
    visitInterpolation(t) {
        const {parts: e, expressions: s} = t;
        const r = s.length;
        this.text += "${";
        this.text += e[0];
        for (let t = 0; t < r; t++) {
            k(s[t], this);
            this.text += e[t + 1];
        }
        this.text += "}";
    }
    visitDestructuringAssignmentExpression(t) {
        const e = t.$kind;
        const s = 25 === e;
        this.text += s ? "{" : "[";
        const r = t.list;
        const i = r.length;
        let n;
        let o;
        for (n = 0; n < i; n++) {
            o = r[n];
            switch (o.$kind) {
              case 26:
                k(o, this);
                break;

              case 24:
              case 25:
                {
                    const t = o.source;
                    if (t) {
                        k(t, this);
                        this.text += ":";
                    }
                    k(o, this);
                    break;
                }
            }
        }
        this.text += s ? "}" : "]";
    }
    visitDestructuringAssignmentSingleExpression(t) {
        k(t.source, this);
        this.text += ":";
        k(t.target, this);
        const e = t.initializer;
        if (void 0 !== e) {
            this.text += "=";
            k(e, this);
        }
    }
    visitDestructuringAssignmentRestExpression(t) {
        this.text += "...";
        k(t.target, this);
    }
    visitCustom(t) {
        this.text += x(t.value);
    }
    writeArgs(t) {
        this.text += "(";
        for (let e = 0, s = t.length; e < s; ++e) {
            if (0 !== e) this.text += ",";
            k(t[e], this);
        }
        this.text += ")";
    }
}

var C;

(function(t) {
    t[t["AccessThis"] = 0] = "AccessThis";
    t[t["AccessScope"] = 1] = "AccessScope";
    t[t["ArrayLiteral"] = 2] = "ArrayLiteral";
    t[t["ObjectLiteral"] = 3] = "ObjectLiteral";
    t[t["PrimitiveLiteral"] = 4] = "PrimitiveLiteral";
    t[t["Template"] = 5] = "Template";
    t[t["Unary"] = 6] = "Unary";
    t[t["CallScope"] = 7] = "CallScope";
    t[t["CallMember"] = 8] = "CallMember";
    t[t["CallFunction"] = 9] = "CallFunction";
    t[t["AccessMember"] = 10] = "AccessMember";
    t[t["AccessKeyed"] = 11] = "AccessKeyed";
    t[t["TaggedTemplate"] = 12] = "TaggedTemplate";
    t[t["Binary"] = 13] = "Binary";
    t[t["Conditional"] = 14] = "Conditional";
    t[t["Assign"] = 15] = "Assign";
    t[t["ArrowFunction"] = 16] = "ArrowFunction";
    t[t["ValueConverter"] = 17] = "ValueConverter";
    t[t["BindingBehavior"] = 18] = "BindingBehavior";
    t[t["ArrayBindingPattern"] = 19] = "ArrayBindingPattern";
    t[t["ObjectBindingPattern"] = 20] = "ObjectBindingPattern";
    t[t["BindingIdentifier"] = 21] = "BindingIdentifier";
    t[t["ForOfStatement"] = 22] = "ForOfStatement";
    t[t["Interpolation"] = 23] = "Interpolation";
    t[t["ArrayDestructuring"] = 24] = "ArrayDestructuring";
    t[t["ObjectDestructuring"] = 25] = "ObjectDestructuring";
    t[t["DestructuringAssignmentLeaf"] = 26] = "DestructuringAssignmentLeaf";
    t[t["DestructuringAssignmentRestLeaf"] = 27] = "DestructuringAssignmentRestLeaf";
    t[t["Custom"] = 28] = "Custom";
})(C || (C = {}));

class CustomExpression {
    constructor(t) {
        this.value = t;
        this.$kind = 28;
    }
    evaluate(t, e, s) {
        return this.value;
    }
    assign(t, e, s) {
        return s;
    }
    bind(t, e) {}
    unbind(t, e) {}
    accept(t) {
        return;
    }
}

class BindingBehaviorExpression {
    constructor(t, e, s) {
        this.expression = t;
        this.name = e;
        this.args = s;
        this.$kind = 18;
        this.key = `_bb_${e}`;
    }
}

class ValueConverterExpression {
    constructor(t, e, s) {
        this.expression = t;
        this.name = e;
        this.args = s;
        this.$kind = 17;
    }
}

class AssignExpression {
    constructor(t, e) {
        this.target = t;
        this.value = e;
        this.$kind = 15;
    }
}

class ConditionalExpression {
    constructor(t, e, s) {
        this.condition = t;
        this.yes = e;
        this.no = s;
        this.$kind = 14;
    }
}

class AccessThisExpression {
    constructor(t = 0) {
        this.ancestor = t;
        this.$kind = 0;
    }
}

AccessThisExpression.$this = new AccessThisExpression(0);

AccessThisExpression.$parent = new AccessThisExpression(1);

class AccessScopeExpression {
    constructor(t, e = 0) {
        this.name = t;
        this.ancestor = e;
        this.$kind = 1;
    }
}

class AccessMemberExpression {
    constructor(t, e, s = false) {
        this.object = t;
        this.name = e;
        this.optional = s;
        this.$kind = 10;
    }
}

class AccessKeyedExpression {
    constructor(t, e, s = false) {
        this.object = t;
        this.key = e;
        this.optional = s;
        this.$kind = 11;
    }
}

class CallScopeExpression {
    constructor(t, e, s = 0, r = false) {
        this.name = t;
        this.args = e;
        this.ancestor = s;
        this.optional = r;
        this.$kind = 7;
    }
}

class CallMemberExpression {
    constructor(t, e, s, r = false, i = false) {
        this.object = t;
        this.name = e;
        this.args = s;
        this.optionalMember = r;
        this.optionalCall = i;
        this.$kind = 8;
    }
}

class CallFunctionExpression {
    constructor(t, e, s = false) {
        this.func = t;
        this.args = e;
        this.optional = s;
        this.$kind = 9;
    }
}

class BinaryExpression {
    constructor(t, e, s) {
        this.operation = t;
        this.left = e;
        this.right = s;
        this.$kind = 13;
    }
}

class UnaryExpression {
    constructor(t, e) {
        this.operation = t;
        this.expression = e;
        this.$kind = 6;
    }
}

class PrimitiveLiteralExpression {
    constructor(t) {
        this.value = t;
        this.$kind = 4;
    }
}

PrimitiveLiteralExpression.$undefined = new PrimitiveLiteralExpression(void 0);

PrimitiveLiteralExpression.$null = new PrimitiveLiteralExpression(null);

PrimitiveLiteralExpression.$true = new PrimitiveLiteralExpression(true);

PrimitiveLiteralExpression.$false = new PrimitiveLiteralExpression(false);

PrimitiveLiteralExpression.$empty = new PrimitiveLiteralExpression("");

class ArrayLiteralExpression {
    constructor(t) {
        this.elements = t;
        this.$kind = 2;
    }
}

ArrayLiteralExpression.$empty = new ArrayLiteralExpression(s);

class ObjectLiteralExpression {
    constructor(t, e) {
        this.keys = t;
        this.values = e;
        this.$kind = 3;
    }
}

ObjectLiteralExpression.$empty = new ObjectLiteralExpression(s, s);

class TemplateExpression {
    constructor(t, e = s) {
        this.cooked = t;
        this.expressions = e;
        this.$kind = 5;
    }
}

TemplateExpression.$empty = new TemplateExpression([ "" ]);

class TaggedTemplateExpression {
    constructor(t, e, r, i = s) {
        this.cooked = t;
        this.func = r;
        this.expressions = i;
        this.$kind = 12;
        t.raw = e;
    }
}

class ArrayBindingPattern {
    constructor(t) {
        this.elements = t;
        this.$kind = 19;
    }
}

class ObjectBindingPattern {
    constructor(t, e) {
        this.keys = t;
        this.values = e;
        this.$kind = 20;
    }
}

class BindingIdentifier {
    constructor(t) {
        this.name = t;
        this.$kind = 21;
    }
}

class ForOfStatement {
    constructor(t, e, s) {
        this.declaration = t;
        this.iterable = e;
        this.semiIdx = s;
        this.$kind = 22;
    }
}

class Interpolation {
    constructor(t, e = s) {
        this.parts = t;
        this.expressions = e;
        this.$kind = 23;
        this.isMulti = e.length > 1;
        this.firstExpression = e[0];
    }
}

class DestructuringAssignmentExpression {
    constructor(t, e, s, r) {
        this.$kind = t;
        this.list = e;
        this.source = s;
        this.initializer = r;
    }
}

class DestructuringAssignmentSingleExpression {
    constructor(t, e, s) {
        this.target = t;
        this.source = e;
        this.initializer = s;
        this.$kind = 26;
    }
}

class DestructuringAssignmentRestExpression {
    constructor(t, e) {
        this.target = t;
        this.indexOrProperties = e;
        this.$kind = 26;
    }
}

class ArrowFunction {
    constructor(t, e, s = false) {
        this.args = t;
        this.body = e;
        this.rest = s;
        this.$kind = 16;
    }
}

class BindingContext {
    constructor(t, e) {
        if (void 0 !== t) this[t] = e;
    }
}

class Scope {
    constructor(t, e, s, r) {
        this.parent = t;
        this.bindingContext = e;
        this.overrideContext = s;
        this.isBoundary = r;
    }
    static getContext(t, e, s) {
        if (null == t) throw S();
        let r = t.overrideContext;
        let i = t;
        if (s > 0) {
            while (s > 0) {
                s--;
                i = i.parent;
                if (null == i) return;
            }
            r = i.overrideContext;
            return e in r ? r : i.bindingContext;
        }
        while (null != i && !i.isBoundary && !(e in i.overrideContext) && !(e in i.bindingContext)) i = i.parent;
        if (null == i) return t.bindingContext;
        r = i.overrideContext;
        return e in r ? r : i.bindingContext;
    }
    static create(t, e, s) {
        if (null == t) throw $();
        return new Scope(null, t, null == e ? new OverrideContext : e, s ?? false);
    }
    static fromParent(t, e) {
        if (null == t) throw S();
        return new Scope(t, e, new OverrideContext, false);
    }
}

const S = () => h(`AUR0203`);

const $ = () => h("AUR0204");

class OverrideContext {}

const R = Scope.getContext;

function U(t, e, s, r) {
    switch (t.$kind) {
      case 0:
        {
            let s = e.overrideContext;
            let r = e;
            let i = t.ancestor;
            while (i-- && s) {
                r = r.parent;
                s = r?.overrideContext ?? null;
            }
            return i < 1 && r ? r.bindingContext : void 0;
        }

      case 1:
        {
            const i = R(e, t.name, t.ancestor);
            if (null !== r) r.observe(i, t.name);
            const n = i[t.name];
            if (null == n && "$host" === t.name) throw h(`AUR0105`);
            if (s?.strict) return s?.boundFn && a(n) ? n.bind(i) : n;
            return null == n ? "" : s?.boundFn && a(n) ? n.bind(i) : n;
        }

      case 2:
        return t.elements.map((t => U(t, e, s, r)));

      case 3:
        {
            const i = {};
            for (let n = 0; n < t.keys.length; ++n) i[t.keys[n]] = U(t.values[n], e, s, r);
            return i;
        }

      case 4:
        return t.value;

      case 5:
        {
            let i = t.cooked[0];
            for (let n = 0; n < t.expressions.length; ++n) {
                i += String(U(t.expressions[n], e, s, r));
                i += t.cooked[n + 1];
            }
            return i;
        }

      case 6:
        switch (t.operation) {
          case "void":
            return void U(t.expression, e, s, r);

          case "typeof":
            return typeof U(t.expression, e, s, r);

          case "!":
            return !U(t.expression, e, s, r);

          case "-":
            return -U(t.expression, e, s, r);

          case "+":
            return +U(t.expression, e, s, r);

          default:
            throw h(`AUR0109:${t.operation}`);
        }

      case 7:
        {
            const i = t.args.map((t => U(t, e, s, r)));
            const n = R(e, t.name, t.ancestor);
            const o = T(s?.strictFnCall, n, t.name);
            if (o) return o.apply(n, i);
            return;
        }

      case 8:
        {
            const i = U(t.object, e, s, r);
            const n = t.args.map((t => U(t, e, s, r)));
            const o = T(s?.strictFnCall, i, t.name);
            let c;
            if (o) {
                c = o.apply(i, n);
                if (w(i) && V.includes(t.name)) r?.observeCollection(i);
            }
            return c;
        }

      case 9:
        {
            const i = U(t.func, e, s, r);
            if (a(i)) return i(...t.args.map((t => U(t, e, s, r))));
            if (!s?.strictFnCall && null == i) return;
            throw h(`AUR0107`);
        }

      case 16:
        {
            const i = (...i) => {
                const n = t.args;
                const o = t.rest;
                const c = n.length - 1;
                const u = n.reduce(((t, e, s) => {
                    if (o && s === c) t[e.name] = i.slice(s); else t[e.name] = i[s];
                    return t;
                }), {});
                const h = Scope.fromParent(e, u);
                return U(t.body, h, s, r);
            };
            return i;
        }

      case 10:
        {
            const i = U(t.object, e, s, r);
            let n;
            if (s?.strict) {
                if (null == i) return;
                if (null !== r) r.observe(i, t.name);
                n = i[t.name];
                if (s?.boundFn && a(n)) return n.bind(i);
                return n;
            }
            if (null !== r && f(i)) r.observe(i, t.name);
            if (i) {
                n = i[t.name];
                if (s?.boundFn && a(n)) return n.bind(i);
                return n;
            }
            return "";
        }

      case 11:
        {
            const i = U(t.object, e, s, r);
            const n = U(t.key, e, s, r);
            if (f(i)) {
                if (null !== r) r.observe(i, n);
                return i[n];
            }
            return null == i ? void 0 : i[n];
        }

      case 12:
        {
            const i = t.expressions.map((t => U(t, e, s, r)));
            const n = U(t.func, e, s, r);
            if (!a(n)) throw h(`AUR0110`);
            return n(t.cooked, ...i);
        }

      case 13:
        {
            const i = t.left;
            const n = t.right;
            switch (t.operation) {
              case "&&":
                return U(i, e, s, r) && U(n, e, s, r);

              case "||":
                return U(i, e, s, r) || U(n, e, s, r);

              case "??":
                return U(i, e, s, r) ?? U(n, e, s, r);

              case "==":
                return U(i, e, s, r) == U(n, e, s, r);

              case "===":
                return U(i, e, s, r) === U(n, e, s, r);

              case "!=":
                return U(i, e, s, r) != U(n, e, s, r);

              case "!==":
                return U(i, e, s, r) !== U(n, e, s, r);

              case "instanceof":
                {
                    const t = U(n, e, s, r);
                    if (a(t)) return U(i, e, s, r) instanceof t;
                    return false;
                }

              case "in":
                {
                    const t = U(n, e, s, r);
                    if (f(t)) return U(i, e, s, r) in t;
                    return false;
                }

              case "+":
                {
                    const t = U(i, e, s, r);
                    const o = U(n, e, s, r);
                    if (s?.strict) return t + o;
                    if (!t || !o) {
                        if (j(t) || j(o)) return (t || 0) + (o || 0);
                        if (D(t) || D(o)) return (t || "") + (o || "");
                    }
                    return t + o;
                }

              case "-":
                return U(i, e, s, r) - U(n, e, s, r);

              case "*":
                return U(i, e, s, r) * U(n, e, s, r);

              case "/":
                return U(i, e, s, r) / U(n, e, s, r);

              case "%":
                return U(i, e, s, r) % U(n, e, s, r);

              case "<":
                return U(i, e, s, r) < U(n, e, s, r);

              case ">":
                return U(i, e, s, r) > U(n, e, s, r);

              case "<=":
                return U(i, e, s, r) <= U(n, e, s, r);

              case ">=":
                return U(i, e, s, r) >= U(n, e, s, r);

              default:
                throw h(`AUR0108:${t.operation}`);
            }
        }

      case 14:
        return U(t.condition, e, s, r) ? U(t.yes, e, s, r) : U(t.no, e, s, r);

      case 15:
        return _(t.target, e, s, U(t.value, e, s, r));

      case 17:
        {
            const i = s?.getConverter?.(t.name);
            if (null == i) throw h(`AUR0103:${t.name}`);
            if ("toView" in i) return i.toView(U(t.expression, e, s, r), ...t.args.map((t => U(t, e, s, r))));
            return U(t.expression, e, s, r);
        }

      case 18:
        return U(t.expression, e, s, r);

      case 21:
        return t.name;

      case 22:
        return U(t.iterable, e, s, r);

      case 23:
        if (t.isMulti) {
            let i = t.parts[0];
            let n = 0;
            for (;n < t.expressions.length; ++n) {
                i += x(U(t.expressions[n], e, s, r));
                i += t.parts[n + 1];
            }
            return i;
        } else return `${t.parts[0]}${U(t.firstExpression, e, s, r)}${t.parts[1]}`;

      case 26:
        return U(t.target, e, s, r);

      case 24:
        return t.list.map((t => U(t, e, s, r)));

      case 19:
      case 20:
      case 25:
      default:
        return;

      case 28:
        return t.evaluate(e, s, r);
    }
}

function _(t, e, s, i) {
    switch (t.$kind) {
      case 1:
        {
            if ("$host" === t.name) throw h(`AUR0106`);
            const s = R(e, t.name, t.ancestor);
            return s[t.name] = i;
        }

      case 10:
        {
            const r = U(t.object, e, s, null);
            if (f(r)) if ("length" === t.name && w(r) && !isNaN(i)) r.splice(i); else r[t.name] = i; else _(t.object, e, s, {
                [t.name]: i
            });
            return i;
        }

      case 11:
        {
            const n = U(t.object, e, s, null);
            const o = U(t.key, e, s, null);
            if (w(n)) {
                if ("length" === o && !isNaN(i)) {
                    n.splice(i);
                    return i;
                }
                if (r(o)) {
                    n.splice(o, 1, i);
                    return i;
                }
            }
            return n[o] = i;
        }

      case 15:
        _(t.value, e, s, i);
        return _(t.target, e, s, i);

      case 17:
        {
            const r = s?.getConverter?.(t.name);
            if (null == r) throw B(t.name);
            if ("fromView" in r) i = r.fromView(i, ...t.args.map((t => U(t, e, s, null))));
            return _(t.expression, e, s, i);
        }

      case 18:
        return _(t.expression, e, s, i);

      case 24:
      case 25:
        {
            const r = t.list;
            const n = r.length;
            let o;
            let c;
            for (o = 0; o < n; o++) {
                c = r[o];
                switch (c.$kind) {
                  case 26:
                    _(c, e, s, i);
                    break;

                  case 24:
                  case 25:
                    {
                        if ("object" !== typeof i || null === i) throw h(`AUR0112`);
                        let t = U(c.source, Scope.create(i), s, null);
                        if (void 0 === t && c.initializer) t = U(c.initializer, e, s, null);
                        _(c, e, s, t);
                        break;
                    }
                }
            }
            break;
        }

      case 26:
        if (t instanceof DestructuringAssignmentSingleExpression) {
            if (null == i) return;
            if ("object" !== typeof i) throw h(`AUR0112`);
            let r = U(t.source, Scope.create(i), s, null);
            if (void 0 === r && t.initializer) r = U(t.initializer, e, s, null);
            _(t.target, e, s, r);
        } else {
            if (null == i) return;
            if ("object" !== typeof i) throw h(`AUR0112`);
            const n = t.indexOrProperties;
            let o;
            if (r(n)) {
                if (!Array.isArray(i)) throw h(`AUR0112`);
                o = i.slice(n);
            } else o = Object.entries(i).reduce(((t, [e, s]) => {
                if (!n.includes(e)) t[e] = s;
                return t;
            }), {});
            _(t.target, e, s, o);
        }
        break;

      case 28:
        return t.assign(e, s, i);

      default:
        return;
    }
}

function L(t, e, s) {
    switch (t.$kind) {
      case 18:
        {
            const r = t.name;
            const i = t.key;
            const n = s.getBehavior?.(r);
            if (null == n) throw I(r);
            if (void 0 === s[i]) {
                s[i] = n;
                n.bind?.(e, s, ...t.args.map((t => U(t, e, s, null))));
            } else throw M(r);
            L(t.expression, e, s);
            return;
        }

      case 17:
        {
            const r = t.name;
            const i = s.getConverter?.(r);
            if (null == i) throw B(r);
            const n = i.signals;
            if (null != n) {
                const t = s.getSignaler?.();
                const e = n.length;
                let r = 0;
                for (;r < e; ++r) t?.addSignalListener(n[r], s);
            }
            L(t.expression, e, s);
            return;
        }

      case 22:
        L(t.iterable, e, s);
        break;

      case 28:
        t.bind?.(e, s);
    }
}

function P(t, e, s) {
    switch (t.$kind) {
      case 18:
        {
            const r = t.key;
            const i = s;
            if (void 0 !== i[r]) {
                i[r].unbind?.(e, s);
                i[r] = void 0;
            }
            P(t.expression, e, s);
            break;
        }

      case 17:
        {
            const r = s.getConverter?.(t.name);
            if (void 0 === r?.signals) return;
            const i = s.getSignaler?.();
            let n = 0;
            for (;n < r.signals.length; ++n) i?.removeSignalListener(r.signals[n], s);
            P(t.expression, e, s);
            break;
        }

      case 22:
        P(t.iterable, e, s);
        break;

      case 28:
        t.unbind?.(e, s);
    }
}

const I = t => h(`AUR0101:${t}`);

const M = t => h(`AUR0102:${t}`);

const B = t => h(`AUR0103:${t}`);

const T = (t, e, s) => {
    const r = null == e ? null : e[s];
    if (a(r)) return r;
    if (!t && null == r) return null;
    throw h(`AUR0111:${s}`);
};

const j = t => {
    switch (typeof t) {
      case "number":
      case "bigint":
        return true;

      default:
        return false;
    }
};

const D = t => {
    switch (typeof t) {
      case "string":
        return true;

      case "object":
        return t instanceof Date;

      default:
        return false;
    }
};

const V = "at map filter includes indexOf lastIndexOf findIndex find flat flatMap join reduce reduceRight slice every some sort".split(" ");

const F = t.createInterface("ICoercionConfiguration");

var N;

(function(t) {
    t[t["indexed"] = 8] = "indexed";
    t[t["keyed"] = 4] = "keyed";
    t[t["array"] = 9] = "array";
    t[t["map"] = 6] = "map";
    t[t["set"] = 7] = "set";
})(N || (N = {}));

var z;

(function(t) {
    t[t["None"] = 0] = "None";
    t[t["Observer"] = 1] = "Observer";
    t[t["Node"] = 2] = "Node";
    t[t["Layout"] = 4] = "Layout";
    t[t["Primtive"] = 8] = "Primtive";
    t[t["Array"] = 18] = "Array";
    t[t["Set"] = 34] = "Set";
    t[t["Map"] = 66] = "Map";
})(z || (z = {}));

function K(t, e, s) {
    const {length: r} = t;
    const i = Array(r);
    let n = 0;
    while (n < r) {
        i[n] = t[n];
        ++n;
    }
    if (void 0 !== e) i.deletedIndices = e.slice(0); else if (void 0 !== t.deletedIndices) i.deletedIndices = t.deletedIndices.slice(0); else i.deletedIndices = [];
    if (void 0 !== s) i.deletedItems = s.slice(0); else if (void 0 !== t.deletedItems) i.deletedItems = t.deletedItems.slice(0); else i.deletedItems = [];
    i.isIndexMap = true;
    return i;
}

function W(t = 0) {
    const e = Array(t);
    let s = 0;
    while (s < t) e[s] = s++;
    e.deletedIndices = [];
    e.deletedItems = [];
    e.isIndexMap = true;
    return e;
}

function J(t) {
    const e = t.slice();
    e.deletedIndices = t.deletedIndices.slice();
    e.deletedItems = t.deletedItems.slice();
    e.isIndexMap = true;
    return e;
}

function q(t) {
    return w(t) && true === t.isIndexMap;
}

let G = new Map;

let H = false;

function Q(t) {
    const e = G;
    const s = G = new Map;
    H = true;
    try {
        t();
    } finally {
        G = null;
        H = false;
        try {
            let t;
            let r;
            let i;
            let n;
            let o;
            let c = false;
            let u;
            let h;
            for (t of s) {
                r = t[0];
                i = t[1];
                if (e?.has(r)) e.set(r, i);
                if (1 === i[0]) r.notify(i[1], i[2]); else {
                    n = i[1];
                    o = i[2];
                    c = false;
                    if (o.deletedIndices.length > 0) c = true; else for (u = 0, h = o.length; u < h; ++u) if (o[u] !== u) {
                        c = true;
                        break;
                    }
                    if (c) r.notifyCollection(n, o);
                }
            }
        } finally {
            G = e;
        }
    }
}

function X(t, e, s) {
    if (!G.has(t)) G.set(t, [ 2, e, s ]);
}

function Y(t, e, s) {
    const r = G.get(t);
    if (void 0 === r) G.set(t, [ 1, e, s ]); else {
        r[1] = e;
        r[2] = s;
    }
}

function Z(t) {
    return null == t ? tt : tt(t);
}

function tt(t) {
    const e = t.prototype;
    u(e, "subs", {
        get: et
    });
    g(e, "subscribe", st);
    g(e, "unsubscribe", rt);
}

class SubscriberRecord {
    constructor() {
        this.count = 0;
        this.t = [];
    }
    add(t) {
        if (this.t.includes(t)) return false;
        this.t[this.t.length] = t;
        ++this.count;
        return true;
    }
    remove(t) {
        const e = this.t.indexOf(t);
        if (-1 !== e) {
            this.t.splice(e, 1);
            --this.count;
            return true;
        }
        return false;
    }
    notify(t, e) {
        if (H) {
            Y(this, t, e);
            return;
        }
        const s = this.t.slice(0);
        const r = s.length;
        let i = 0;
        for (;i < r; ++i) s[i].handleChange(t, e);
        return;
    }
    notifyCollection(t, e) {
        const s = this.t.slice(0);
        const r = s.length;
        let i = 0;
        for (;i < r; ++i) s[i].handleCollectionChange(t, e);
        return;
    }
}

function et() {
    return v(this, "subs", new SubscriberRecord);
}

function st(t) {
    return this.subs.add(t);
}

function rt(t) {
    return this.subs.remove(t);
}

class CollectionLengthObserver {
    constructor(t) {
        this.owner = t;
        this.type = 18;
        this.v = (this.o = t.collection).length;
    }
    getValue() {
        return this.o.length;
    }
    setValue(t) {
        if (t !== this.v) if (!Number.isNaN(t)) {
            this.o.splice(t);
            this.v = this.o.length;
        }
    }
    handleCollectionChange(t, e) {
        const s = this.v;
        const r = this.o.length;
        if ((this.v = r) !== s) this.subs.notify(this.v, s);
    }
}

class CollectionSizeObserver {
    constructor(t) {
        this.owner = t;
        this.v = (this.o = t.collection).size;
        this.type = p(this.o) ? 66 : 34;
    }
    getValue() {
        return this.o.size;
    }
    setValue() {
        throw h(`AUR02`);
    }
    handleCollectionChange(t, e) {
        const s = this.v;
        const r = this.o.size;
        if ((this.v = r) !== s) this.subs.notify(this.v, s);
    }
}

function it(t) {
    const e = t.prototype;
    g(e, "subscribe", nt);
    g(e, "unsubscribe", ot);
    Z(t);
}

function nt(t) {
    if (this.subs.add(t) && 1 === this.subs.count) this.owner.subscribe(this);
}

function ot(t) {
    if (this.subs.remove(t) && 0 === this.subs.count) this.owner.subscribe(this);
}

it(CollectionLengthObserver);

it(CollectionSizeObserver);

const ct = Symbol.for("__au_arr_obs__");

const ut = Array[ct] ?? v(Array, ct, new WeakMap);

function ht(t, e) {
    if (t === e) return 0;
    t = null === t ? "null" : t.toString();
    e = null === e ? "null" : e.toString();
    return t < e ? -1 : 1;
}

function at(t, e) {
    if (void 0 === t) if (void 0 === e) return 0; else return 1;
    if (void 0 === e) return -1;
    return 0;
}

function lt(t, e, s, r, i) {
    let n, o, c, u, h;
    let a, l;
    for (a = s + 1; a < r; a++) {
        n = t[a];
        o = e[a];
        for (l = a - 1; l >= s; l--) {
            c = t[l];
            u = e[l];
            h = i(c, n);
            if (h > 0) {
                t[l + 1] = c;
                e[l + 1] = u;
            } else break;
        }
        t[l + 1] = n;
        e[l + 1] = o;
    }
}

function ft(t, e, s, r, i) {
    let n = 0, o = 0;
    let c, u, h;
    let a, l, f;
    let w, b, p;
    let d, v;
    let g, A, x, m;
    let y, E, O, k;
    while (true) {
        if (r - s <= 10) {
            lt(t, e, s, r, i);
            return;
        }
        n = s + (r - s >> 1);
        c = t[s];
        a = e[s];
        u = t[r - 1];
        l = e[r - 1];
        h = t[n];
        f = e[n];
        w = i(c, u);
        if (w > 0) {
            d = c;
            v = a;
            c = u;
            a = l;
            u = d;
            l = v;
        }
        b = i(c, h);
        if (b >= 0) {
            d = c;
            v = a;
            c = h;
            a = f;
            h = u;
            f = l;
            u = d;
            l = v;
        } else {
            p = i(u, h);
            if (p > 0) {
                d = u;
                v = l;
                u = h;
                l = f;
                h = d;
                f = v;
            }
        }
        t[s] = c;
        e[s] = a;
        t[r - 1] = h;
        e[r - 1] = f;
        g = u;
        A = l;
        x = s + 1;
        m = r - 1;
        t[n] = t[x];
        e[n] = e[x];
        t[x] = g;
        e[x] = A;
        t: for (o = x + 1; o < m; o++) {
            y = t[o];
            E = e[o];
            O = i(y, g);
            if (O < 0) {
                t[o] = t[x];
                e[o] = e[x];
                t[x] = y;
                e[x] = E;
                x++;
            } else if (O > 0) {
                do {
                    m--;
                    if (m == o) break t;
                    k = t[m];
                    O = i(k, g);
                } while (O > 0);
                t[o] = t[m];
                e[o] = e[m];
                t[m] = y;
                e[m] = E;
                if (O < 0) {
                    y = t[o];
                    E = e[o];
                    t[o] = t[x];
                    e[o] = e[x];
                    t[x] = y;
                    e[x] = E;
                    x++;
                }
            }
        }
        if (r - m < x - s) {
            ft(t, e, m, r, i);
            r = x;
        } else {
            ft(t, e, s, x, i);
            s = m;
        }
    }
}

const wt = Array.prototype;

const bt = wt.push;

const pt = wt.unshift;

const dt = wt.pop;

const vt = wt.shift;

const gt = wt.splice;

const At = wt.reverse;

const xt = wt.sort;

const mt = {
    push: bt,
    unshift: pt,
    pop: dt,
    shift: vt,
    splice: gt,
    reverse: At,
    sort: xt
};

const yt = [ "push", "unshift", "pop", "shift", "splice", "reverse", "sort" ];

const Et = {
    push: function(...t) {
        const e = ut.get(this);
        if (void 0 === e) return bt.apply(this, t);
        const s = this.length;
        const r = t.length;
        if (0 === r) return s;
        this.length = e.indexMap.length = s + r;
        let i = s;
        while (i < this.length) {
            this[i] = t[i - s];
            e.indexMap[i] = -2;
            i++;
        }
        e.notify();
        return this.length;
    },
    unshift: function(...t) {
        const e = ut.get(this);
        if (void 0 === e) return pt.apply(this, t);
        const s = t.length;
        const r = new Array(s);
        let i = 0;
        while (i < s) r[i++] = -2;
        pt.apply(e.indexMap, r);
        const n = pt.apply(this, t);
        e.notify();
        return n;
    },
    pop: function() {
        const t = ut.get(this);
        if (void 0 === t) return dt.call(this);
        const e = t.indexMap;
        const s = dt.call(this);
        const r = e.length - 1;
        if (e[r] > -1) {
            e.deletedIndices.push(e[r]);
            e.deletedItems.push(s);
        }
        dt.call(e);
        t.notify();
        return s;
    },
    shift: function() {
        const t = ut.get(this);
        if (void 0 === t) return vt.call(this);
        const e = t.indexMap;
        const s = vt.call(this);
        if (e[0] > -1) {
            e.deletedIndices.push(e[0]);
            e.deletedItems.push(s);
        }
        vt.call(e);
        t.notify();
        return s;
    },
    splice: function(...t) {
        const e = t[0];
        const s = t[1];
        const r = ut.get(this);
        if (void 0 === r) return gt.apply(this, t);
        const i = this.length;
        const n = 0 | e;
        const o = n < 0 ? Math.max(i + n, 0) : Math.min(n, i);
        const c = r.indexMap;
        const u = t.length;
        const h = 0 === u ? 0 : 1 === u ? i - o : s;
        let a = o;
        if (h > 0) {
            const t = a + h;
            while (a < t) {
                if (c[a] > -1) {
                    c.deletedIndices.push(c[a]);
                    c.deletedItems.push(this[a]);
                }
                a++;
            }
        }
        a = 0;
        if (u > 2) {
            const t = u - 2;
            const r = new Array(t);
            while (a < t) r[a++] = -2;
            gt.call(c, e, s, ...r);
        } else gt.apply(c, t);
        const l = gt.apply(this, t);
        if (h > 0 || a > 0) r.notify();
        return l;
    },
    reverse: function() {
        const t = ut.get(this);
        if (void 0 === t) {
            At.call(this);
            return this;
        }
        const e = this.length;
        const s = e / 2 | 0;
        let r = 0;
        while (r !== s) {
            const s = e - r - 1;
            const i = this[r];
            const n = t.indexMap[r];
            const o = this[s];
            const c = t.indexMap[s];
            this[r] = o;
            t.indexMap[r] = c;
            this[s] = i;
            t.indexMap[s] = n;
            r++;
        }
        t.notify();
        return this;
    },
    sort: function(t) {
        const e = ut.get(this);
        if (void 0 === e) {
            xt.call(this, t);
            return this;
        }
        let s = this.length;
        if (s < 2) return this;
        ft(this, e.indexMap, 0, s, at);
        let r = 0;
        while (r < s) {
            if (void 0 === this[r]) break;
            r++;
        }
        if (void 0 === t || !a(t)) t = ht;
        ft(this, e.indexMap, 0, r, t);
        let i = false;
        for (r = 0, s = e.indexMap.length; s > r; ++r) if (e.indexMap[r] !== r) {
            i = true;
            break;
        }
        if (i) e.notify();
        return this;
    }
};

for (const t of yt) u(Et[t], "observing", {
    value: true,
    writable: false,
    configurable: false,
    enumerable: false
});

let Ot = false;

const kt = "__au_arr_on__";

function Ct() {
    if (!(E(kt, Array) ?? false)) {
        O(kt, true, Array);
        for (const t of yt) if (true !== wt[t].observing) v(wt, t, Et[t]);
    }
}

function St() {
    for (const t of yt) if (true === wt[t].observing) v(wt, t, mt[t]);
}

class ArrayObserver {
    constructor(t) {
        this.type = 18;
        if (!Ot) {
            Ot = true;
            Ct();
        }
        this.indexObservers = {};
        this.collection = t;
        this.indexMap = W(t.length);
        this.lenObs = void 0;
        ut.set(t, this);
    }
    notify() {
        const t = this.subs;
        const e = this.indexMap;
        if (H) {
            X(t, this.collection, e);
            return;
        }
        const s = this.collection;
        const r = s.length;
        this.indexMap = W(r);
        this.subs.notifyCollection(s, e);
    }
    getLengthObserver() {
        return this.lenObs ?? (this.lenObs = new CollectionLengthObserver(this));
    }
    getIndexObserver(t) {
        var e;
        return (e = this.indexObservers)[t] ?? (e[t] = new ArrayIndexObserver(this, t));
    }
}

class ArrayIndexObserver {
    constructor(t, e) {
        this.owner = t;
        this.index = e;
        this.doNotCache = true;
        this.value = this.getValue();
    }
    getValue() {
        return this.owner.collection[this.index];
    }
    setValue(t) {
        if (t === this.getValue()) return;
        const e = this.owner;
        const s = this.index;
        const r = e.indexMap;
        if (r[s] > -1) r.deletedIndices.push(r[s]);
        r[s] = -2;
        e.collection[s] = t;
        e.notify();
    }
    handleCollectionChange(t, e) {
        const s = this.index;
        const r = e[s] === s;
        if (r) return;
        const i = this.value;
        const n = this.value = this.getValue();
        if (i !== n) this.subs.notify(n, i);
    }
    subscribe(t) {
        if (this.subs.add(t) && 1 === this.subs.count) this.owner.subscribe(this);
    }
    unsubscribe(t) {
        if (this.subs.remove(t) && 0 === this.subs.count) this.owner.unsubscribe(this);
    }
}

Z(ArrayObserver);

Z(ArrayIndexObserver);

function $t(t) {
    let e = ut.get(t);
    if (void 0 === e) e = new ArrayObserver(t);
    return e;
}

const Rt = (t, e) => t - e;

function Ut(t) {
    let e = 0;
    let s = 0;
    let r = 0;
    const i = J(t);
    if (i.deletedIndices.length > 1) i.deletedIndices.sort(Rt);
    const n = i.length;
    for (;r < n; ++r) {
        while (i.deletedIndices[s] <= r - e) {
            ++s;
            --e;
        }
        if (-2 === i[r]) ++e; else i[r] += e;
    }
    return i;
}

function _t(t, e) {
    const s = t.slice();
    const r = e.length;
    let i = 0;
    let n = 0;
    while (i < r) {
        n = e[i];
        if (-2 !== n) t[i] = s[n];
        ++i;
    }
}

const Lt = Symbol.for("__au_set_obs__");

const Pt = Set[Lt] ?? v(Set, Lt, new WeakMap);

const It = Set.prototype;

const Mt = It.add;

const Bt = It.clear;

const Tt = It.delete;

const jt = {
    add: Mt,
    clear: Bt,
    delete: Tt
};

const Dt = [ "add", "clear", "delete" ];

const Vt = {
    add: function(t) {
        const e = Pt.get(this);
        if (void 0 === e) {
            Mt.call(this, t);
            return this;
        }
        const s = this.size;
        Mt.call(this, t);
        const r = this.size;
        if (r === s) return this;
        e.indexMap[s] = -2;
        e.notify();
        return this;
    },
    clear: function() {
        const t = Pt.get(this);
        if (void 0 === t) return Bt.call(this);
        const e = this.size;
        if (e > 0) {
            const e = t.indexMap;
            let s = 0;
            for (const t of this.keys()) {
                if (e[s] > -1) {
                    e.deletedIndices.push(e[s]);
                    e.deletedItems.push(t);
                }
                s++;
            }
            Bt.call(this);
            e.length = 0;
            t.notify();
        }
        return;
    },
    delete: function(t) {
        const e = Pt.get(this);
        if (void 0 === e) return Tt.call(this, t);
        const s = this.size;
        if (0 === s) return false;
        let r = 0;
        const i = e.indexMap;
        for (const s of this.keys()) {
            if (s === t) {
                if (i[r] > -1) {
                    i.deletedIndices.push(i[r]);
                    i.deletedItems.push(s);
                }
                i.splice(r, 1);
                const n = Tt.call(this, t);
                if (true === n) e.notify();
                return n;
            }
            r++;
        }
        return false;
    }
};

const Ft = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const t of Dt) u(Vt[t], "observing", {
    value: true,
    writable: false,
    configurable: false,
    enumerable: false
});

let Nt = false;

const zt = "__au_set_on__";

function Kt() {
    if (!(E(zt, Set) ?? false)) {
        O(zt, true, Set);
        for (const t of Dt) if (true !== It[t].observing) u(It, t, {
            ...Ft,
            value: Vt[t]
        });
    }
}

function Wt() {
    for (const t of Dt) if (true === It[t].observing) u(It, t, {
        ...Ft,
        value: jt[t]
    });
}

class SetObserver {
    constructor(t) {
        this.type = 34;
        if (!Nt) {
            Nt = true;
            Kt();
        }
        this.collection = t;
        this.indexMap = W(t.size);
        this.lenObs = void 0;
        Pt.set(t, this);
    }
    notify() {
        const t = this.subs;
        const e = this.indexMap;
        if (H) {
            X(t, this.collection, e);
            return;
        }
        const s = this.collection;
        const r = s.size;
        this.indexMap = W(r);
        this.subs.notifyCollection(s, e);
    }
    getLengthObserver() {
        return this.lenObs ?? (this.lenObs = new CollectionSizeObserver(this));
    }
}

Z(SetObserver);

function Jt(t) {
    let e = Pt.get(t);
    if (void 0 === e) e = new SetObserver(t);
    return e;
}

const qt = Symbol.for("__au_map_obs__");

const Gt = Map[qt] ?? v(Map, qt, new WeakMap);

const Ht = Map.prototype;

const Qt = Ht.set;

const Xt = Ht.clear;

const Yt = Ht.delete;

const Zt = {
    set: Qt,
    clear: Xt,
    delete: Yt
};

const te = [ "set", "clear", "delete" ];

const ee = {
    set: function(t, e) {
        const s = Gt.get(this);
        if (void 0 === s) {
            Qt.call(this, t, e);
            return this;
        }
        const r = this.get(t);
        const i = this.size;
        Qt.call(this, t, e);
        const n = this.size;
        if (n === i) {
            let e = 0;
            for (const i of this.entries()) {
                if (i[0] === t) {
                    if (i[1] !== r) {
                        s.indexMap.deletedIndices.push(s.indexMap[e]);
                        s.indexMap.deletedItems.push(i);
                        s.indexMap[e] = -2;
                        s.notify();
                    }
                    return this;
                }
                e++;
            }
            return this;
        }
        s.indexMap[i] = -2;
        s.notify();
        return this;
    },
    clear: function() {
        const t = Gt.get(this);
        if (void 0 === t) return Xt.call(this);
        const e = this.size;
        if (e > 0) {
            const e = t.indexMap;
            let s = 0;
            for (const t of this.keys()) {
                if (e[s] > -1) {
                    e.deletedIndices.push(e[s]);
                    e.deletedItems.push(t);
                }
                s++;
            }
            Xt.call(this);
            e.length = 0;
            t.notify();
        }
        return;
    },
    delete: function(t) {
        const e = Gt.get(this);
        if (void 0 === e) return Yt.call(this, t);
        const s = this.size;
        if (0 === s) return false;
        let r = 0;
        const i = e.indexMap;
        for (const s of this.keys()) {
            if (s === t) {
                if (i[r] > -1) {
                    i.deletedIndices.push(i[r]);
                    i.deletedItems.push(s);
                }
                i.splice(r, 1);
                const n = Yt.call(this, t);
                if (true === n) e.notify();
                return n;
            }
            ++r;
        }
        return false;
    }
};

const se = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const t of te) u(ee[t], "observing", {
    value: true,
    writable: false,
    configurable: false,
    enumerable: false
});

let re = false;

const ie = "__au_map_on__";

function ne() {
    if (!(E(ie, Map) ?? false)) {
        O(ie, true, Map);
        for (const t of te) if (true !== Ht[t].observing) u(Ht, t, {
            ...se,
            value: ee[t]
        });
    }
}

function oe() {
    for (const t of te) if (true === Ht[t].observing) u(Ht, t, {
        ...se,
        value: Zt[t]
    });
}

class MapObserver {
    constructor(t) {
        this.type = 66;
        if (!re) {
            re = true;
            ne();
        }
        this.collection = t;
        this.indexMap = W(t.size);
        this.lenObs = void 0;
        Gt.set(t, this);
    }
    notify() {
        const t = this.subs;
        const e = this.indexMap;
        if (H) {
            X(t, this.collection, e);
            return;
        }
        const s = this.collection;
        const r = s.size;
        this.indexMap = W(r);
        t.notifyCollection(s, e);
    }
    getLengthObserver() {
        return this.lenObs ?? (this.lenObs = new CollectionSizeObserver(this));
    }
}

Z(MapObserver);

function ce(t) {
    let e = Gt.get(t);
    if (void 0 === e) e = new MapObserver(t);
    return e;
}

function ue() {
    return v(this, "obs", new BindingObserverRecord(this));
}

function he(t, e) {
    this.obs.add(this.oL.getObserver(t, e));
}

function ae(t) {
    let e;
    if (w(t)) e = $t(t); else if (b(t)) e = Jt(t); else if (p(t)) e = ce(t); else throw h(`AUR0210`);
    this.obs.add(e);
}

function le(t) {
    this.obs.add(t);
}

function fe() {
    throw h(`AUR2011:handleChange`);
}

function we() {
    throw h(`AUR2011:handleCollectionChange`);
}

class BindingObserverRecord {
    constructor(t) {
        this.version = 0;
        this.count = 0;
        this.o = new Map;
        this.b = t;
    }
    add(t) {
        if (!this.o.has(t)) {
            t.subscribe(this.b);
            ++this.count;
        }
        this.o.set(t, this.version);
    }
    clear() {
        this.o.forEach(pe, this);
        this.count = this.o.size;
    }
    clearAll() {
        this.o.forEach(be, this);
        this.o.clear();
        this.count = 0;
    }
}

function be(t, e) {
    e.unsubscribe(this.b);
}

function pe(t, e) {
    if (this.version !== t) {
        e.unsubscribe(this.b);
        this.o.delete(e);
    }
}

function de(t) {
    const e = t.prototype;
    g(e, "observe", he);
    g(e, "observeCollection", ae);
    g(e, "subscribeTo", le);
    u(e, "obs", {
        get: ue
    });
    g(e, "handleChange", fe);
    g(e, "handleCollectionChange", we);
    return t;
}

function ve(t) {
    return null == t ? de : de(t);
}

const ge = m("IExpressionParser", (t => t.singleton(ExpressionParser)));

class ExpressionParser {
    constructor() {
        this.i = y();
        this.u = y();
        this.h = y();
    }
    parse(t, e) {
        let s;
        switch (e) {
          case 32:
            return new CustomExpression(t);

          case 1:
            s = this.h[t];
            if (void 0 === s) s = this.h[t] = this.$parse(t, e);
            return s;

          case 2:
            s = this.u[t];
            if (void 0 === s) s = this.u[t] = this.$parse(t, e);
            return s;

          default:
            if (0 === t.length) {
                if ((e & (8 | 16)) > 0) return PrimitiveLiteralExpression.$empty;
                throw ds();
            }
            s = this.i[t];
            if (void 0 === s) s = this.i[t] = this.$parse(t, e);
            return s;
        }
    }
    $parse(t, e) {
        Se = t;
        $e = 0;
        Re = t.length;
        Ue = 0;
        _e = 0;
        Le = 6291456;
        Pe = "";
        Ie = De(0);
        Me = true;
        Be = false;
        Te = -1;
        return Ne(61, void 0 === e ? 16 : e);
    }
}

function Ae(t) {
    switch (t) {
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
        return t;
    }
}

const xe = PrimitiveLiteralExpression.$false;

const me = PrimitiveLiteralExpression.$true;

const ye = PrimitiveLiteralExpression.$null;

const Ee = PrimitiveLiteralExpression.$undefined;

const Oe = AccessThisExpression.$this;

const ke = AccessThisExpression.$parent;

var Ce;

(function(t) {
    t[t["None"] = 0] = "None";
    t[t["Interpolation"] = 1] = "Interpolation";
    t[t["IsIterator"] = 2] = "IsIterator";
    t[t["IsChainable"] = 4] = "IsChainable";
    t[t["IsFunction"] = 8] = "IsFunction";
    t[t["IsProperty"] = 16] = "IsProperty";
    t[t["IsCustom"] = 32] = "IsCustom";
})(Ce || (Ce = {}));

let Se = "";

let $e = 0;

let Re = 0;

let Ue = 0;

let _e = 0;

let Le = 6291456;

let Pe = "";

let Ie;

let Me = true;

let Be = false;

let Te = -1;

const je = String.fromCharCode;

const De = t => Se.charCodeAt(t);

const Ve = () => Se.slice(_e, $e);

function Fe(t, e) {
    Se = t;
    $e = 0;
    Re = t.length;
    Ue = 0;
    _e = 0;
    Le = 6291456;
    Pe = "";
    Ie = De(0);
    Me = true;
    Be = false;
    Te = -1;
    return Ne(61, void 0 === e ? 16 : e);
}

function Ne(t, e) {
    if (32 === e) return new CustomExpression(Se);
    if (0 === $e) {
        if (1 & e) return Ye();
        es();
        if (4194304 & Le) throw as();
    }
    Me = 513 > t;
    Be = false;
    let s = false;
    let r;
    let i = 0;
    if (131072 & Le) {
        const t = Bs[63 & Le];
        es();
        r = new UnaryExpression(t, Ne(514, e));
        Me = false;
    } else {
        t: switch (Le) {
          case 12294:
            i = Ue;
            Me = false;
            do {
                es();
                ++i;
                switch (Le) {
                  case 65545:
                    es();
                    if (0 === (12288 & Le)) throw fs();
                    break;

                  case 10:
                  case 11:
                    throw fs();

                  case 2162700:
                    Be = true;
                    es();
                    if (0 === (12288 & Le)) {
                        r = 0 === i ? Oe : 1 === i ? ke : new AccessThisExpression(i);
                        s = true;
                        break t;
                    }
                    break;

                  default:
                    if (2097152 & Le) {
                        r = 0 === i ? Oe : 1 === i ? ke : new AccessThisExpression(i);
                        break t;
                    }
                    throw ws();
                }
            } while (12294 === Le);

          case 4096:
            {
                const t = Pe;
                if (2 & e) r = new BindingIdentifier(t); else r = new AccessScopeExpression(t, i);
                Me = !Be;
                es();
                if (us(50)) {
                    if (524296 === Le) throw Is();
                    const e = Be;
                    const s = Ue;
                    ++Ue;
                    const i = Ne(62, 0);
                    Be = e;
                    Ue = s;
                    Me = false;
                    r = new ArrowFunction([ new BindingIdentifier(t) ], i);
                }
                break;
            }

          case 10:
            throw Ms();

          case 11:
            throw ls();

          case 12292:
            Me = false;
            es();
            switch (Ue) {
              case 0:
                r = Oe;
                break;

              case 1:
                r = ke;
                break;

              default:
                r = new AccessThisExpression(Ue);
                break;
            }
            break;

          case 2688007:
            r = Ge(e);
            break;

          case 2688016:
            r = Se.search(/\s+of\s+/) > $e ? ze() : He(e);
            break;

          case 524296:
            r = Xe(e);
            break;

          case 2163759:
            r = new TemplateExpression([ Pe ]);
            Me = false;
            es();
            break;

          case 2163760:
            r = Ze(e, r, false);
            break;

          case 16384:
          case 32768:
            r = new PrimitiveLiteralExpression(Pe);
            Me = false;
            es();
            break;

          case 8194:
          case 8195:
          case 8193:
          case 8192:
            r = Bs[63 & Le];
            Me = false;
            es();
            break;

          default:
            if ($e >= Re) throw bs(); else throw ps();
        }
        if (2 & e) return Qe(r);
        if (514 < t) return r;
        if (10 === Le || 11 === Le) throw fs();
        if (0 === r.$kind) switch (Le) {
          case 2162700:
            Be = true;
            Me = false;
            es();
            if (0 === (13312 & Le)) throw $s();
            if (12288 & Le) {
                r = new AccessScopeExpression(Pe, r.ancestor);
                es();
            } else if (2688007 === Le) r = new CallFunctionExpression(r, Ke(), true); else if (2688016 === Le) r = We(r, true); else throw Rs();
            break;

          case 65545:
            Me = !Be;
            es();
            if (0 === (12288 & Le)) throw fs();
            r = new AccessScopeExpression(Pe, r.ancestor);
            es();
            break;

          case 10:
          case 11:
            throw fs();

          case 2688007:
            r = new CallFunctionExpression(r, Ke(), s);
            break;

          case 2688016:
            r = We(r, s);
            break;

          case 2163759:
            r = ts(r);
            break;

          case 2163760:
            r = Ze(e, r, true);
            break;
        }
        while ((65536 & Le) > 0) switch (Le) {
          case 2162700:
            r = Je(r);
            break;

          case 65545:
            es();
            if (0 === (12288 & Le)) throw fs();
            r = qe(r, false);
            break;

          case 10:
          case 11:
            throw fs();

          case 2688007:
            if (1 === r.$kind) r = new CallScopeExpression(r.name, Ke(), r.ancestor, false); else if (10 === r.$kind) r = new CallMemberExpression(r.object, r.name, Ke(), r.optional, false); else r = new CallFunctionExpression(r, Ke(), false);
            break;

          case 2688016:
            r = We(r, false);
            break;

          case 2163759:
            if (Be) throw Rs();
            r = ts(r);
            break;

          case 2163760:
            if (Be) throw Rs();
            r = Ze(e, r, true);
            break;
        }
    }
    if (10 === Le || 11 === Le) throw fs();
    if (513 < t) return r;
    while ((262144 & Le) > 0) {
        const s = Le;
        if ((960 & s) <= t) break;
        es();
        r = new BinaryExpression(Bs[63 & s], r, Ne(960 & s, e));
        Me = false;
    }
    if (63 < t) return r;
    if (us(6291478)) {
        const t = Ne(62, e);
        hs(6291476);
        r = new ConditionalExpression(r, t, Ne(62, e));
        Me = false;
    }
    if (62 < t) return r;
    if (us(4194349)) {
        if (!Me) throw vs();
        r = new AssignExpression(r, Ne(62, e));
    }
    if (61 < t) return r;
    while (us(6291480)) {
        if (6291456 === Le) throw gs();
        const t = Pe;
        es();
        const s = new Array;
        while (us(6291476)) s.push(Ne(62, e));
        r = new ValueConverterExpression(r, t, s);
    }
    while (us(6291479)) {
        if (6291456 === Le) throw As();
        const t = Pe;
        es();
        const s = new Array;
        while (us(6291476)) s.push(Ne(62, e));
        r = new BindingBehaviorExpression(r, t, s);
    }
    if (6291456 !== Le) {
        if ((1 & e) > 0 && 7340045 === Le) return r;
        if ((4 & e) > 0 && 6291477 === Le) {
            if ($e === Re) throw ps();
            Te = $e - 1;
            return r;
        }
        if ("of" === Ve()) throw xs();
        throw ps();
    }
    return r;
}

function ze() {
    const t = [];
    const e = new DestructuringAssignmentExpression(24, t, void 0, void 0);
    let s = "";
    let r = true;
    let i = 0;
    while (r) {
        es();
        switch (Le) {
          case 7340051:
            r = false;
            n();
            break;

          case 6291471:
            n();
            break;

          case 4096:
            s = Ve();
            break;

          default:
            throw Ss();
        }
    }
    hs(7340051);
    return e;
    function n() {
        if ("" !== s) {
            t.push(new DestructuringAssignmentSingleExpression(new AccessMemberExpression(Oe, s), new AccessKeyedExpression(Oe, new PrimitiveLiteralExpression(i++)), void 0));
            s = "";
        } else i++;
    }
}

function Ke() {
    const t = Be;
    es();
    const e = [];
    while (7340046 !== Le) {
        e.push(Ne(62, 0));
        if (!us(6291471)) break;
    }
    hs(7340046);
    Me = false;
    Be = t;
    return e;
}

function We(t, e) {
    const s = Be;
    es();
    t = new AccessKeyedExpression(t, Ne(62, 0), e);
    hs(7340051);
    Me = !s;
    Be = s;
    return t;
}

function Je(t) {
    Be = true;
    Me = false;
    es();
    if (0 === (13312 & Le)) throw $s();
    if (12288 & Le) return qe(t, true);
    if (2688007 === Le) if (1 === t.$kind) return new CallScopeExpression(t.name, Ke(), t.ancestor, true); else if (10 === t.$kind) return new CallMemberExpression(t.object, t.name, Ke(), t.optional, true); else return new CallFunctionExpression(t, Ke(), true);
    if (2688016 === Le) return We(t, true);
    throw Rs();
}

function qe(t, e) {
    const s = Pe;
    switch (Le) {
      case 2162700:
        {
            Be = true;
            Me = false;
            const r = $e;
            const i = _e;
            const n = Le;
            const o = Ie;
            const c = Pe;
            const u = Me;
            const h = Be;
            es();
            if (0 === (13312 & Le)) throw $s();
            if (2688007 === Le) return new CallMemberExpression(t, s, Ke(), e, true);
            $e = r;
            _e = i;
            Le = n;
            Ie = o;
            Pe = c;
            Me = u;
            Be = h;
            return new AccessMemberExpression(t, s, e);
        }

      case 2688007:
        Me = false;
        return new CallMemberExpression(t, s, Ke(), e, false);

      default:
        Me = !Be;
        es();
        return new AccessMemberExpression(t, s, e);
    }
}

function Ge(t) {
    es();
    const e = $e;
    const s = _e;
    const r = Le;
    const i = Ie;
    const n = Pe;
    const o = Me;
    const c = Be;
    const u = [];
    let h = 1;
    let a = false;
    t: while (true) {
        if (11 === Le) {
            es();
            if (4096 !== Le) throw fs();
            u.push(new BindingIdentifier(Pe));
            es();
            if (6291471 === Le) throw Ps();
            if (7340046 !== Le) throw ls();
            es();
            if (50 !== Le) throw ls();
            es();
            const t = Be;
            const e = Ue;
            ++Ue;
            const s = Ne(62, 0);
            Be = t;
            Ue = e;
            Me = false;
            return new ArrowFunction(u, s, true);
        }
        switch (Le) {
          case 4096:
            u.push(new BindingIdentifier(Pe));
            es();
            break;

          case 7340046:
            es();
            break t;

          case 524296:
          case 2688016:
            es();
            h = 4;
            break;

          case 6291471:
            h = 2;
            a = true;
            break t;

          case 2688007:
            h = 2;
            break t;

          default:
            es();
            h = 2;
            break;
        }
        switch (Le) {
          case 6291471:
            es();
            a = true;
            if (1 === h) break;
            break t;

          case 7340046:
            es();
            break t;

          case 4194349:
            if (1 === h) h = 3;
            break t;

          case 50:
            if (a) throw Us();
            es();
            h = 2;
            break t;

          default:
            if (1 === h) h = 2;
            break t;
        }
    }
    if (50 === Le) {
        if (1 === h) {
            es();
            if (524296 === Le) throw Is();
            const t = Be;
            const e = Ue;
            ++Ue;
            const s = Ne(62, 0);
            Be = t;
            Ue = e;
            Me = false;
            return new ArrowFunction(u, s);
        }
        throw Us();
    } else if (1 === h && 0 === u.length) throw ks(50);
    if (a) switch (h) {
      case 2:
        throw Us();

      case 3:
        throw _s();

      case 4:
        throw Ls();
    }
    $e = e;
    _e = s;
    Le = r;
    Ie = i;
    Pe = n;
    Me = o;
    Be = c;
    const l = Be;
    const f = Ne(62, t);
    Be = l;
    hs(7340046);
    if (50 === Le) switch (h) {
      case 2:
        throw Us();

      case 3:
        throw _s();

      case 4:
        throw Ls();
    }
    return f;
}

function He(t) {
    const e = Be;
    es();
    const s = new Array;
    while (7340051 !== Le) if (us(6291471)) {
        s.push(Ee);
        if (7340051 === Le) break;
    } else {
        s.push(Ne(62, ~2 & t));
        if (us(6291471)) {
            if (7340051 === Le) break;
        } else break;
    }
    Be = e;
    hs(7340051);
    if (2 & t) return new ArrayBindingPattern(s); else {
        Me = false;
        return new ArrayLiteralExpression(s);
    }
}

function Qe(t) {
    if (0 === (t.$kind & (19 | 20 | 21))) throw ms();
    if (4204593 !== Le) throw ms();
    es();
    const e = t;
    const s = Ne(61, 4);
    return new ForOfStatement(e, s, Te);
}

function Xe(t) {
    const e = Be;
    const s = new Array;
    const r = new Array;
    es();
    while (7340045 !== Le) {
        s.push(Pe);
        if (49152 & Le) {
            es();
            hs(6291476);
            r.push(Ne(62, ~2 & t));
        } else if (12288 & Le) {
            const e = Ie;
            const s = Le;
            const i = $e;
            es();
            if (us(6291476)) r.push(Ne(62, ~2 & t)); else {
                Ie = e;
                Le = s;
                $e = i;
                r.push(Ne(515, ~2 & t));
            }
        } else throw ys();
        if (7340045 !== Le) hs(6291471);
    }
    Be = e;
    hs(7340045);
    if (2 & t) return new ObjectBindingPattern(s, r); else {
        Me = false;
        return new ObjectLiteralExpression(s, r);
    }
}

function Ye() {
    const t = [];
    const e = [];
    const s = Re;
    let r = "";
    while ($e < s) {
        switch (Ie) {
          case 36:
            if (123 === De($e + 1)) {
                t.push(r);
                r = "";
                $e += 2;
                Ie = De($e);
                es();
                const s = Ne(61, 1);
                e.push(s);
                continue;
            } else r += "$";
            break;

          case 92:
            r += je(Ae(ss()));
            break;

          default:
            r += je(Ie);
        }
        ss();
    }
    if (e.length) {
        t.push(r);
        return new Interpolation(t, e);
    }
    return null;
}

function Ze(t, e, s) {
    const r = Be;
    const i = [ Pe ];
    hs(2163760);
    const n = [ Ne(62, t) ];
    while (2163759 !== (Le = cs())) {
        i.push(Pe);
        hs(2163760);
        n.push(Ne(62, t));
    }
    i.push(Pe);
    Me = false;
    Be = r;
    if (s) {
        es();
        return new TaggedTemplateExpression(i, i, e, n);
    } else {
        es();
        return new TemplateExpression(i, n);
    }
}

function ts(t) {
    Me = false;
    const e = [ Pe ];
    es();
    return new TaggedTemplateExpression(e, e, t);
}

function es() {
    while ($e < Re) {
        _e = $e;
        if (null != (Le = zs[Ie]())) return;
    }
    Le = 6291456;
}

function ss() {
    return Ie = De(++$e);
}

function rs() {
    while (Ns[ss()]) ;
    const t = Ts[Pe = Ve()];
    return void 0 === t ? 4096 : t;
}

function is(t) {
    let e = Ie;
    if (false === t) {
        do {
            e = ss();
        } while (e <= 57 && e >= 48);
        if (46 !== e) {
            Pe = parseInt(Ve(), 10);
            return 32768;
        }
        e = ss();
        if ($e >= Re) {
            Pe = parseInt(Ve().slice(0, -1), 10);
            return 32768;
        }
    }
    if (e <= 57 && e >= 48) do {
        e = ss();
    } while (e <= 57 && e >= 48); else Ie = De(--$e);
    Pe = parseFloat(Ve());
    return 32768;
}

function ns() {
    const t = Ie;
    ss();
    let e = 0;
    const s = new Array;
    let r = $e;
    while (Ie !== t) if (92 === Ie) {
        s.push(Se.slice(r, $e));
        ss();
        e = Ae(Ie);
        ss();
        s.push(je(e));
        r = $e;
    } else if ($e >= Re) throw Es(); else ss();
    const i = Se.slice(r, $e);
    ss();
    s.push(i);
    const n = s.join("");
    Pe = n;
    return 16384;
}

function os() {
    let t = true;
    let e = "";
    while (96 !== ss()) if (36 === Ie) if ($e + 1 < Re && 123 === De($e + 1)) {
        $e++;
        t = false;
        break;
    } else e += "$"; else if (92 === Ie) e += je(Ae(ss())); else {
        if ($e >= Re) throw Os();
        e += je(Ie);
    }
    ss();
    Pe = e;
    if (t) return 2163759;
    return 2163760;
}

const cs = () => {
    if ($e >= Re) throw Os();
    $e--;
    return os();
};

const us = t => {
    if (Le === t) {
        es();
        return true;
    }
    return false;
};

const hs = t => {
    if (Le === t) es(); else throw ks(t);
};

const as = () => h(`AUR0151:${Se}`);

const ls = () => h(`AUR0152:${Se}`);

const fs = () => h(`AUR0153:${Se}`);

const ws = () => h(`AUR0154:${Se}`);

const bs = () => h(`AUR0155:${Se}`);

const ps = () => h(`AUR0156:${Se}`);

const ds = () => h(`AUR0157`);

const vs = () => h(`AUR0158:${Se}`);

const gs = () => h(`AUR0159:${Se}`);

const As = () => h(`AUR0160:${Se}`);

const xs = () => h(`AUR0161:${Se}`);

const ms = () => h(`AUR0163:${Se}`);

const ys = () => h(`AUR0164:${Se}`);

const Es = () => h(`AUR0165:${Se}`);

const Os = () => h(`AUR0166:${Se}`);

const ks = t => h(`AUR0167:${Se}<${Bs[63 & t]}`);

const Cs = () => {
    throw h(`AUR0168:${Se}`);
};

Cs.notMapped = true;

const Ss = () => h(`AUR0170:${Se}`);

const $s = () => h(`AUR0171:${Se}`);

const Rs = () => h(`AUR0172:${Se}`);

const Us = () => h(`AUR0173:${Se}`);

const _s = () => h(`AUR0174:${Se}`);

const Ls = () => h(`AUR0175:${Se}`);

const Ps = () => h(`AUR0176:${Se}`);

const Is = () => h(`AUR0178:${Se}`);

const Ms = () => h(`AUR0179:${Se}`);

const Bs = [ xe, me, ye, Ee, "$this", null, "$parent", "(", "{", ".", "..", "...", "?.", "}", ")", ",", "[", "]", ":", ";", "?", "'", '"', "&", "|", "??", "||", "&&", "==", "!=", "===", "!==", "<", ">", "<=", ">=", "in", "instanceof", "+", "-", "typeof", "void", "*", "%", "/", "=", "!", 2163759, 2163760, "of", "=>" ];

const Ts = A(Object.create(null), {
    true: 8193,
    null: 8194,
    false: 8192,
    undefined: 8195,
    $this: 12292,
    $parent: 12294,
    in: 6562212,
    instanceof: 6562213,
    typeof: 139304,
    void: 139305,
    of: 4204593
});

const js = {
    AsciiIdPart: [ 36, 0, 48, 58, 65, 91, 95, 0, 97, 123 ],
    IdStart: [ 36, 0, 65, 91, 95, 0, 97, 123, 170, 0, 186, 0, 192, 215, 216, 247, 248, 697, 736, 741, 7424, 7462, 7468, 7517, 7522, 7526, 7531, 7544, 7545, 7615, 7680, 7936, 8305, 0, 8319, 0, 8336, 8349, 8490, 8492, 8498, 0, 8526, 0, 8544, 8585, 11360, 11392, 42786, 42888, 42891, 42927, 42928, 42936, 42999, 43008, 43824, 43867, 43868, 43877, 64256, 64263, 65313, 65339, 65345, 65371 ],
    Digit: [ 48, 58 ],
    Skip: [ 0, 33, 127, 161 ]
};

const Ds = (t, e, s, r) => {
    const i = s.length;
    for (let n = 0; n < i; n += 2) {
        const i = s[n];
        let o = s[n + 1];
        o = o > 0 ? o : i + 1;
        if (t) t.fill(r, i, o);
        if (e) for (let t = i; t < o; t++) e.add(t);
    }
};

const Vs = t => () => {
    ss();
    return t;
};

const Fs = new Set;

Ds(null, Fs, js.AsciiIdPart, true);

const Ns = new Uint8Array(65535);

Ds(Ns, null, js.IdStart, 1);

Ds(Ns, null, js.Digit, 1);

const zs = new Array(65535);

zs.fill(Cs, 0, 65535);

Ds(zs, null, js.Skip, (() => {
    ss();
    return null;
}));

Ds(zs, null, js.IdStart, rs);

Ds(zs, null, js.Digit, (() => is(false)));

zs[34] = zs[39] = () => ns();

zs[96] = () => os();

zs[33] = () => {
    if (61 !== ss()) return 131118;
    if (61 !== ss()) return 6553949;
    ss();
    return 6553951;
};

zs[61] = () => {
    if (62 === ss()) {
        ss();
        return 50;
    }
    if (61 !== Ie) return 4194349;
    if (61 !== ss()) return 6553948;
    ss();
    return 6553950;
};

zs[38] = () => {
    if (38 !== ss()) return 6291479;
    ss();
    return 6553883;
};

zs[124] = () => {
    if (124 !== ss()) return 6291480;
    ss();
    return 6553818;
};

zs[63] = () => {
    if (46 === ss()) {
        const t = De($e + 1);
        if (t <= 48 || t >= 57) {
            ss();
            return 2162700;
        }
        return 6291478;
    }
    if (63 !== Ie) return 6291478;
    ss();
    return 6553753;
};

zs[46] = () => {
    if (ss() <= 57 && Ie >= 48) return is(true);
    if (46 === Ie) {
        if (46 !== ss()) return 10;
        ss();
        return 11;
    }
    return 65545;
};

zs[60] = () => {
    if (61 !== ss()) return 6554016;
    ss();
    return 6554018;
};

zs[62] = () => {
    if (61 !== ss()) return 6554017;
    ss();
    return 6554019;
};

zs[37] = Vs(6554155);

zs[40] = Vs(2688007);

zs[41] = Vs(7340046);

zs[42] = Vs(6554154);

zs[43] = Vs(2490854);

zs[44] = Vs(6291471);

zs[45] = Vs(2490855);

zs[47] = Vs(6554156);

zs[58] = Vs(6291476);

zs[59] = Vs(6291477);

zs[91] = Vs(2688016);

zs[93] = Vs(7340051);

zs[123] = Vs(524296);

zs[125] = Vs(7340045);

let Ks = null;

const Ws = [];

let Js = false;

function qs() {
    Js = false;
}

function Gs() {
    Js = true;
}

function Hs() {
    return Ks;
}

function Qs(t) {
    if (null == t) throw h(`AUR0206`);
    if (null == Ks) {
        Ks = t;
        Ws[0] = Ks;
        Js = true;
        return;
    }
    if (Ks === t) throw h(`AUR0207`);
    Ws.push(t);
    Ks = t;
    Js = true;
}

function Xs(t) {
    if (null == t) throw h(`AUR0208`);
    if (Ks !== t) throw h(`AUR0209`);
    Ws.pop();
    Ks = Ws.length > 0 ? Ws[Ws.length - 1] : null;
    Js = null != Ks;
}

const Ys = Object.freeze({
    get current() {
        return Ks;
    },
    get connecting() {
        return Js;
    },
    enter: Qs,
    exit: Xs,
    pause: qs,
    resume: Gs
});

const Zs = Reflect.get;

const tr = Object.prototype.toString;

const er = new WeakMap;

const sr = "__au_nw__";

const rr = "__au_nw";

function ir(t) {
    switch (tr.call(t)) {
      case "[object Object]":
        return true !== t.constructor[sr];

      case "[object Array]":
      case "[object Map]":
      case "[object Set]":
        return true;

      default:
        return false;
    }
}

const nr = "__raw__";

function or(t) {
    return ir(t) ? cr(t) : t;
}

function cr(t) {
    return er.get(t) ?? lr(t);
}

function ur(t) {
    return t[nr] ?? t;
}

function hr(t) {
    return ir(t) && t[nr] || t;
}

function ar(t, e) {
    return "constructor" === e || "__proto__" === e || "$observers" === e || e === Symbol.toPrimitive || e === Symbol.toStringTag || true === t.constructor[`${rr}_${x(e)}__`];
}

function lr(t) {
    const e = w(t) ? wr : p(t) || b(t) ? Br : fr;
    const s = new Proxy(t, e);
    er.set(t, s);
    er.set(s, s);
    return s;
}

const fr = {
    get(t, e, s) {
        if (e === nr) return t;
        const r = Hs();
        if (!Js || ar(t, e) || null == r) return Zs(t, e, s);
        r.observe(t, e);
        return or(Zs(t, e, s));
    }
};

const wr = {
    get(t, e, s) {
        if (e === nr) return t;
        if (!Js || ar(t, e) || null == Ks) return Zs(t, e, s);
        switch (e) {
          case "length":
            Ks.observe(t, "length");
            return t.length;

          case "map":
            return br;

          case "includes":
            return vr;

          case "indexOf":
            return gr;

          case "lastIndexOf":
            return Ar;

          case "every":
            return pr;

          case "filter":
            return dr;

          case "find":
            return mr;

          case "findIndex":
            return xr;

          case "flat":
            return yr;

          case "flatMap":
            return Er;

          case "join":
            return Or;

          case "push":
            return Cr;

          case "pop":
            return kr;

          case "reduce":
            return Ir;

          case "reduceRight":
            return Mr;

          case "reverse":
            return Ur;

          case "shift":
            return Sr;

          case "unshift":
            return $r;

          case "slice":
            return Pr;

          case "splice":
            return Rr;

          case "some":
            return _r;

          case "sort":
            return Lr;

          case "keys":
            return Kr;

          case "values":
          case Symbol.iterator:
            return Wr;

          case "entries":
            return Jr;
        }
        Ks.observe(t, e);
        return or(Zs(t, e, s));
    },
    ownKeys(t) {
        Hs()?.observe(t, "length");
        return Reflect.ownKeys(t);
    }
};

function br(t, e) {
    const s = ur(this);
    const r = s.map(((s, r) => hr(t.call(e, or(s), r, this))));
    qr(Ks, s);
    return or(r);
}

function pr(t, e) {
    const s = ur(this);
    const r = s.every(((s, r) => t.call(e, or(s), r, this)));
    qr(Ks, s);
    return r;
}

function dr(t, e) {
    const s = ur(this);
    const r = s.filter(((s, r) => hr(t.call(e, or(s), r, this))));
    qr(Ks, s);
    return or(r);
}

function vr(t) {
    const e = ur(this);
    const s = e.includes(hr(t));
    qr(Ks, e);
    return s;
}

function gr(t) {
    const e = ur(this);
    const s = e.indexOf(hr(t));
    qr(Ks, e);
    return s;
}

function Ar(t) {
    const e = ur(this);
    const s = e.lastIndexOf(hr(t));
    qr(Ks, e);
    return s;
}

function xr(t, e) {
    const s = ur(this);
    const r = s.findIndex(((s, r) => hr(t.call(e, or(s), r, this))));
    qr(Ks, s);
    return r;
}

function mr(t, e) {
    const s = ur(this);
    const r = s.find(((e, s) => t(or(e), s, this)), e);
    qr(Ks, s);
    return or(r);
}

function yr() {
    const t = ur(this);
    qr(Ks, t);
    return or(t.flat());
}

function Er(t, e) {
    const s = ur(this);
    qr(Ks, s);
    return cr(s.flatMap(((s, r) => or(t.call(e, or(s), r, this)))));
}

function Or(t) {
    const e = ur(this);
    qr(Ks, e);
    return e.join(t);
}

function kr() {
    return or(ur(this).pop());
}

function Cr(...t) {
    return ur(this).push(...t);
}

function Sr() {
    return or(ur(this).shift());
}

function $r(...t) {
    return ur(this).unshift(...t);
}

function Rr(...t) {
    return or(ur(this).splice(...t));
}

function Ur(...t) {
    const e = ur(this);
    const s = e.reverse();
    qr(Ks, e);
    return or(s);
}

function _r(t, e) {
    const s = ur(this);
    const r = s.some(((s, r) => hr(t.call(e, or(s), r, this))));
    qr(Ks, s);
    return r;
}

function Lr(t) {
    const e = ur(this);
    const s = e.sort(t);
    qr(Ks, e);
    return or(s);
}

function Pr(t, e) {
    const s = ur(this);
    qr(Ks, s);
    return cr(s.slice(t, e));
}

function Ir(t, e) {
    const s = ur(this);
    const r = s.reduce(((e, s, r) => t(e, or(s), r, this)), e);
    qr(Ks, s);
    return or(r);
}

function Mr(t, e) {
    const s = ur(this);
    const r = s.reduceRight(((e, s, r) => t(e, or(s), r, this)), e);
    qr(Ks, s);
    return or(r);
}

const Br = {
    get(t, e, s) {
        if (e === nr) return t;
        const r = Hs();
        if (!Js || ar(t, e) || null == r) return Zs(t, e, s);
        switch (e) {
          case "size":
            r.observe(t, "size");
            return t.size;

          case "clear":
            return Nr;

          case "delete":
            return zr;

          case "forEach":
            return Tr;

          case "add":
            if (b(t)) return Fr;
            break;

          case "get":
            if (p(t)) return Dr;
            break;

          case "set":
            if (p(t)) return Vr;
            break;

          case "has":
            return jr;

          case "keys":
            return Kr;

          case "values":
            return Wr;

          case "entries":
            return Jr;

          case Symbol.iterator:
            return p(t) ? Jr : Wr;
        }
        return or(Zs(t, e, s));
    }
};

function Tr(t, e) {
    const s = ur(this);
    qr(Ks, s);
    return s.forEach(((s, r) => {
        t.call(e, or(s), or(r), this);
    }));
}

function jr(t) {
    const e = ur(this);
    qr(Ks, e);
    return e.has(hr(t));
}

function Dr(t) {
    const e = ur(this);
    qr(Ks, e);
    return or(e.get(hr(t)));
}

function Vr(t, e) {
    return or(ur(this).set(hr(t), hr(e)));
}

function Fr(t) {
    return or(ur(this).add(hr(t)));
}

function Nr() {
    return or(ur(this).clear());
}

function zr(t) {
    return or(ur(this).delete(hr(t)));
}

function Kr() {
    const t = ur(this);
    qr(Ks, t);
    const e = t.keys();
    return {
        next() {
            const t = e.next();
            const s = t.value;
            const r = t.done;
            return r ? {
                value: void 0,
                done: r
            } : {
                value: or(s),
                done: r
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

function Wr() {
    const t = ur(this);
    qr(Ks, t);
    const e = t.values();
    return {
        next() {
            const t = e.next();
            const s = t.value;
            const r = t.done;
            return r ? {
                value: void 0,
                done: r
            } : {
                value: or(s),
                done: r
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

function Jr() {
    const t = ur(this);
    qr(Ks, t);
    const e = t.entries();
    return {
        next() {
            const t = e.next();
            const s = t.value;
            const r = t.done;
            return r ? {
                value: void 0,
                done: r
            } : {
                value: [ or(s[0]), or(s[1]) ],
                done: r
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

const qr = (t, e) => t?.observeCollection(e);

const Gr = Object.freeze({
    getProxy: cr,
    getRaw: ur,
    wrap: or,
    unwrap: hr,
    rawKey: nr
});

class ComputedObserver {
    static create(t, e, s, r, i) {
        const n = s.get;
        const o = s.set;
        const c = new ComputedObserver(t, n, o, i, r);
        u(t, e, {
            enumerable: s.enumerable,
            configurable: true,
            get: A((() => c.getValue()), {
                getObserver: () => c
            }),
            set: t => {
                c.setValue(t);
            }
        });
        return c;
    }
    constructor(t, e, s, r, i) {
        this.type = 1;
        this.v = void 0;
        this.ov = void 0;
        this.ir = false;
        this.D = false;
        this.o = t;
        this.$get = e;
        this.$set = s;
        this.up = r;
        this.oL = i;
    }
    getValue() {
        if (0 === this.subs.count) return this.$get.call(this.o, this);
        if (this.D) {
            this.compute();
            this.D = false;
        }
        return this.v;
    }
    setValue(t) {
        if (a(this.$set)) {
            if (t !== this.v) {
                this.ir = true;
                this.$set.call(this.o, t);
                this.ir = false;
                this.run();
            }
        } else throw h(`AUR0221`);
    }
    handleChange() {
        this.D = true;
        if (this.subs.count > 0) this.run();
    }
    handleCollectionChange() {
        this.D = true;
        if (this.subs.count > 0) this.run();
    }
    subscribe(t) {
        if (this.subs.add(t) && 1 === this.subs.count) {
            this.compute();
            this.D = false;
        }
    }
    unsubscribe(t) {
        if (this.subs.remove(t) && 0 === this.subs.count) {
            this.D = true;
            this.obs.clearAll();
        }
    }
    run() {
        if (this.ir) return;
        const t = this.v;
        const e = this.compute();
        this.D = false;
        if (!d(e, t)) {
            this.ov = t;
            Hr = this.ov;
            this.ov = this.v;
            this.subs.notify(this.v, Hr);
        }
    }
    compute() {
        this.ir = true;
        this.obs.version++;
        try {
            Qs(this);
            return this.v = hr(this.$get.call(this.up ? or(this.o) : this.o, this));
        } finally {
            this.obs.clear();
            this.ir = false;
            Xs(this);
        }
    }
}

ve(ComputedObserver);

Z(ComputedObserver);

let Hr;

const Qr = m("IDirtyChecker", (t => t.singleton(DirtyChecker)));

const Xr = {
    timeoutsPerCheck: 25,
    disabled: false,
    throw: false,
    resetToDefault() {
        this.timeoutsPerCheck = 6;
        this.disabled = false;
        this.throw = false;
    }
};

const Yr = {
    persistent: true
};

class DirtyChecker {
    constructor(t) {
        this.p = t;
        this.tracked = [];
        this.A = null;
        this.O = 0;
        this.check = () => {
            if (Xr.disabled) return;
            if (++this.O < Xr.timeoutsPerCheck) return;
            this.O = 0;
            const t = this.tracked;
            const e = t.length;
            let s;
            let r = 0;
            for (;r < e; ++r) {
                s = t[r];
                if (s.isDirty()) s.flush();
            }
        };
    }
    createProperty(t, e) {
        if (Xr.throw) throw h(`AUR0222:${x(e)}`);
        return new DirtyCheckProperty(this, t, e);
    }
    addProperty(t) {
        this.tracked.push(t);
        if (1 === this.tracked.length) this.A = this.p.taskQueue.queueTask(this.check, Yr);
    }
    removeProperty(t) {
        this.tracked.splice(this.tracked.indexOf(t), 1);
        if (0 === this.tracked.length) {
            this.A.cancel();
            this.A = null;
        }
    }
}

DirtyChecker.inject = [ i ];

class DirtyCheckProperty {
    constructor(t, e, s) {
        this.obj = e;
        this.key = s;
        this.type = 0;
        this.ov = void 0;
        this.C = t;
    }
    getValue() {
        return this.obj[this.key];
    }
    setValue(t) {
        throw h(`Trying to set value for property ${x(this.key)} in dirty checker`);
    }
    isDirty() {
        return this.ov !== this.obj[this.key];
    }
    flush() {
        const t = this.ov;
        const e = this.getValue();
        this.ov = e;
        this.subs.notify(e, t);
    }
    subscribe(t) {
        if (this.subs.add(t) && 1 === this.subs.count) {
            this.ov = this.obj[this.key];
            this.C.addProperty(this);
        }
    }
    unsubscribe(t) {
        if (this.subs.remove(t) && 0 === this.subs.count) this.C.removeProperty(this);
    }
}

Z(DirtyCheckProperty);

class PrimitiveObserver {
    get doNotCache() {
        return true;
    }
    constructor(t, e) {
        this.type = 0;
        this.o = t;
        this.k = e;
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
        this.type = 0;
    }
    getValue(t, e) {
        return t[e];
    }
    setValue(t, e, s) {
        e[s] = t;
    }
}

class SetterObserver {
    constructor(t, e) {
        this.type = 1;
        this.v = void 0;
        this.iO = false;
        this.o = t;
        this.k = e;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (this.iO) {
            if (d(t, this.v)) return;
            Zr = this.v;
            this.v = t;
            this.subs.notify(t, Zr);
        } else this.o[this.k] = t;
    }
    subscribe(t) {
        if (false === this.iO) this.start();
        this.subs.add(t);
    }
    start() {
        if (false === this.iO) {
            this.iO = true;
            this.v = this.o[this.k];
            u(this.o, this.k, {
                enumerable: true,
                configurable: true,
                get: () => this.getValue(),
                set: t => {
                    this.setValue(t);
                }
            });
        }
        return this;
    }
    stop() {
        if (this.iO) {
            u(this.o, this.k, {
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

class SetterNotifier {
    constructor(t, e, s, r) {
        this.type = 1;
        this.v = void 0;
        this.ov = void 0;
        this.o = t;
        this.S = s;
        this.hs = a(s);
        const i = t[e];
        this.cb = a(i) ? i : void 0;
        this.v = r;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (this.hs) t = this.S(t, null);
        if (!d(t, this.v)) {
            this.ov = this.v;
            this.v = t;
            this.cb?.call(this.o, this.v, this.ov);
            Zr = this.ov;
            this.ov = this.v;
            this.subs.notify(this.v, Zr);
        }
    }
}

Z(SetterObserver);

Z(SetterNotifier);

let Zr;

const ti = new PropertyAccessor;

const ei = m("IObserverLocator", (t => t.singleton(ObserverLocator)));

const si = m("INodeObserverLocator", (t => t.cachedCallback((t => new DefaultNodeObserverLocator))));

class DefaultNodeObserverLocator {
    handles() {
        return false;
    }
    getObserver() {
        return ti;
    }
    getAccessor() {
        return ti;
    }
}

class ObserverLocator {
    constructor(t, e) {
        this.$ = [];
        this.C = t;
        this.R = e;
    }
    addAdapter(t) {
        this.$.push(t);
    }
    getObserver(t, e) {
        if (null == t) throw ci(e);
        if (!f(t)) return new PrimitiveObserver(t, e);
        const s = oi(t);
        let r = s[e];
        if (void 0 === r) {
            r = this.createObserver(t, e);
            if (!r.doNotCache) s[e] = r;
        }
        return r;
    }
    getAccessor(t, e) {
        const s = t.$observers?.[e];
        if (void 0 !== s) return s;
        if (this.R.handles(t, e, this)) return this.R.getAccessor(t, e, this);
        return ti;
    }
    getArrayObserver(t) {
        return $t(t);
    }
    getMapObserver(t) {
        return ce(t);
    }
    getSetObserver(t) {
        return Jt(t);
    }
    createObserver(t, e) {
        if (this.R.handles(t, e, this)) return this.R.getObserver(t, e, this);
        switch (e) {
          case "length":
            if (w(t)) return $t(t).getLengthObserver();
            break;

          case "size":
            if (p(t)) return ce(t).getLengthObserver(); else if (b(t)) return Jt(t).getLengthObserver();
            break;

          default:
            if (w(t) && r(e)) return $t(t).getIndexObserver(Number(e));
            break;
        }
        let s = ni(t, e);
        if (void 0 === s) {
            let r = ii(t);
            while (null !== r) {
                s = ni(r, e);
                if (void 0 === s) r = ii(r); else break;
            }
        }
        if (void 0 !== s && !c.call(s, "value")) {
            let r = this.U(t, e, s);
            if (null == r) r = (s.get?.getObserver ?? s.set?.getObserver)?.(t, this);
            return null == r ? s.configurable ? ComputedObserver.create(t, e, s, this, true) : this.C.createProperty(t, e) : r;
        }
        return new SetterObserver(t, e);
    }
    U(t, e, s) {
        if (this.$.length > 0) for (const r of this.$) {
            const i = r.getObserver(t, e, s, this);
            if (null != i) return i;
        }
        return null;
    }
}

ObserverLocator.inject = [ Qr, si ];

const ri = t => {
    let e;
    if (w(t)) e = $t(t); else if (p(t)) e = ce(t); else if (b(t)) e = Jt(t);
    return e;
};

const ii = Object.getPrototypeOf;

const ni = Object.getOwnPropertyDescriptor;

const oi = t => {
    let e = t.$observers;
    if (void 0 === e) u(t, "$observers", {
        enumerable: false,
        value: e = y()
    });
    return e;
};

const ci = t => h(`AUR0199:${x(t)}`);

const ui = m("IObservation", (t => t.singleton(Observation)));

class Observation {
    static get inject() {
        return [ ei ];
    }
    constructor(t) {
        this.oL = t;
    }
    run(t) {
        const e = new Effect(this.oL, t);
        e.run();
        return e;
    }
}

class Effect {
    constructor(t, e) {
        this.oL = t;
        this.fn = e;
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
        if (this.stopped) throw h(`AUR0225`);
        if (this.running) return;
        ++this.runCount;
        this.running = true;
        this.queued = false;
        ++this.obs.version;
        try {
            Qs(this);
            this.fn(this);
        } finally {
            this.obs.clear();
            this.running = false;
            Xs(this);
        }
        if (this.queued) {
            if (this.runCount > this.maxRunCount) {
                this.runCount = 0;
                throw h(`AUR0226`);
            }
            this.run();
        } else this.runCount = 0;
    }
    stop() {
        this.stopped = true;
        this.obs.clearAll();
    }
}

ve(Effect);

function hi(t) {
    if (void 0 === t.$observers) u(t, "$observers", {
        value: {}
    });
    return t.$observers;
}

const ai = {};

function li(t, e, s) {
    if (null == e) return (e, s, i) => r(e, s, i, t);
    return r(t, e, s);
    function r(t, e, s, r) {
        const i = void 0 === e;
        r = "object" !== typeof r ? {
            name: r
        } : r || {};
        if (i) e = r.name;
        if (null == e || "" === e) throw h(`AUR0224`);
        const n = r.callback || `${x(e)}Changed`;
        let o = ai;
        if (s) {
            delete s.value;
            delete s.writable;
            o = s.initializer?.();
            delete s.initializer;
        } else s = {
            configurable: true
        };
        if (!("enumerable" in s)) s.enumerable = true;
        const c = r.set;
        s.get = function t() {
            const s = fi(this, e, n, o, c);
            Hs()?.subscribeTo(s);
            return s.getValue();
        };
        s.set = function t(s) {
            fi(this, e, n, o, c).setValue(s);
        };
        s.get.getObserver = function t(s) {
            return fi(s, e, n, o, c);
        };
        if (i) u(t.prototype, e, s); else return s;
    }
}

function fi(t, e, s, r, i) {
    const n = hi(t);
    let o = n[e];
    if (null == o) {
        o = new SetterNotifier(t, s, i, r === ai ? void 0 : r);
        n[e] = o;
    }
    return o;
}

function wi(t, e) {
    if (null == t) return (t, e) => s(t, e); else return s(t, e);
    function s(t, e) {
        const s = !e;
        if (s) v(t, sr, true); else v(t.constructor, `${rr}_${x(e)}__`, true);
    }
}

const bi = m("ISignaler", (t => t.singleton(Signaler)));

class Signaler {
    constructor() {
        this.signals = y();
    }
    dispatchSignal(t) {
        const e = this.signals[t];
        if (void 0 === e) return;
        let s;
        for (s of e.keys()) s.handleChange(void 0, void 0);
    }
    addSignalListener(t, e) {
        const s = this.signals;
        const r = s[t];
        if (void 0 === r) s[t] = new Set([ e ]); else r.add(e);
    }
    removeSignalListener(t, e) {
        this.signals[t]?.delete(e);
    }
}

export { AccessKeyedExpression, AccessMemberExpression, AccessScopeExpression, AccessThisExpression, z as AccessorType, ArrayBindingPattern, ArrayIndexObserver, ArrayLiteralExpression, ArrayObserver, ArrowFunction, AssignExpression, BinaryExpression, BindingBehaviorExpression, BindingContext, BindingIdentifier, BindingObserverRecord, CallFunctionExpression, CallMemberExpression, CallScopeExpression, N as CollectionKind, CollectionLengthObserver, CollectionSizeObserver, ComputedObserver, ConditionalExpression, Ys as ConnectableSwitcher, CustomExpression, DestructuringAssignmentExpression, DestructuringAssignmentRestExpression, DestructuringAssignmentSingleExpression, DirtyCheckProperty, Xr as DirtyCheckSettings, C as ExpressionKind, Ce as ExpressionType, ForOfStatement, F as ICoercionConfiguration, Qr as IDirtyChecker, ge as IExpressionParser, si as INodeObserverLocator, ui as IObservation, ei as IObserverLocator, bi as ISignaler, Interpolation, MapObserver, ObjectBindingPattern, ObjectLiteralExpression, Observation, ObserverLocator, PrimitiveLiteralExpression, PrimitiveObserver, PropertyAccessor, Gr as ProxyObservable, Scope, SetObserver, SetterObserver, SubscriberRecord, TaggedTemplateExpression, TemplateExpression, UnaryExpression, Unparser, ValueConverterExpression, Ut as applyMutationsToIndices, _ as astAssign, L as astBind, U as astEvaluate, P as astUnbind, k as astVisit, Q as batch, J as cloneIndexMap, ve as connectable, K as copyIndexMap, W as createIndexMap, St as disableArrayObservation, oe as disableMapObservation, Wt as disableSetObservation, Ct as enableArrayObservation, ne as enableMapObservation, Kt as enableSetObservation, ri as getCollectionObserver, oi as getObserverLookup, q as isIndexMap, wi as nowrap, li as observable, Fe as parseExpression, Z as subscriberCollection, _t as synchronizeIndices };
//# sourceMappingURL=index.mjs.map
