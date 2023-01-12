"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var t = require("@aurelia/kernel");

var e = require("@aurelia/metadata");

const s = Object;

const r = s.prototype.hasOwnProperty;

const i = Reflect.defineProperty;

const n = t => new Error(t);

const o = t => "function" === typeof t;

const c = t => "string" === typeof t;

const u = t => t instanceof s;

const h = t => t instanceof Array;

const a = t => t instanceof Set;

const l = t => t instanceof Map;

const f = s.is;

function p(t, e, s) {
    i(t, e, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: s
    });
    return s;
}

function w(t, e, s) {
    if (!(e in t)) p(t, e, s);
}

const b = String;

const d = t.DI.createInterface;

const v = () => s.create(null);

const x = e.Metadata.getOwn;

e.Metadata.hasOwn;

const g = e.Metadata.define;

t.Protocol.annotation.keyFor;

t.Protocol.resource.keyFor;

t.Protocol.resource.appendTo;

const A = (t, e) => {
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
        throw n(`Unknown ast node ${JSON.stringify(t)}`);
    }
};

class Unparser {
    constructor() {
        this.text = "";
    }
    static unparse(t) {
        const e = new Unparser;
        A(t, e);
        return e.text;
    }
    visitAccessMember(t) {
        A(t.object, this);
        this.text += `${t.optional ? "?" : ""}.${t.name}`;
    }
    visitAccessKeyed(t) {
        A(t.object, this);
        this.text += `${t.optional ? "?." : ""}[`;
        A(t.key, this);
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
            A(e[t], this);
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
        A(t.body, this);
    }
    visitObjectLiteral(t) {
        const e = t.keys;
        const s = t.values;
        this.text += "{";
        for (let t = 0, r = e.length; t < r; ++t) {
            if (0 !== t) this.text += ",";
            this.text += `'${e[t]}':`;
            A(s[t], this);
        }
        this.text += "}";
    }
    visitPrimitiveLiteral(t) {
        this.text += "(";
        if (c(t.value)) {
            const e = t.value.replace(/'/g, "\\'");
            this.text += `'${e}'`;
        } else this.text += `${t.value}`;
        this.text += ")";
    }
    visitCallFunction(t) {
        this.text += "(";
        A(t.func, this);
        this.text += t.optional ? "?." : "";
        this.writeArgs(t.args);
        this.text += ")";
    }
    visitCallMember(t) {
        this.text += "(";
        A(t.object, this);
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
            A(s[t], this);
            this.text += e[t + 1];
        }
        this.text += "`";
    }
    visitTaggedTemplate(t) {
        const {cooked: e, expressions: s} = t;
        const r = s.length;
        A(t.func, this);
        this.text += "`";
        this.text += e[0];
        for (let t = 0; t < r; t++) {
            A(s[t], this);
            this.text += e[t + 1];
        }
        this.text += "`";
    }
    visitUnary(t) {
        this.text += `(${t.operation}`;
        if (t.operation.charCodeAt(0) >= 97) this.text += " ";
        A(t.expression, this);
        this.text += ")";
    }
    visitBinary(t) {
        this.text += "(";
        A(t.left, this);
        if (105 === t.operation.charCodeAt(0)) this.text += ` ${t.operation} `; else this.text += t.operation;
        A(t.right, this);
        this.text += ")";
    }
    visitConditional(t) {
        this.text += "(";
        A(t.condition, this);
        this.text += "?";
        A(t.yes, this);
        this.text += ":";
        A(t.no, this);
        this.text += ")";
    }
    visitAssign(t) {
        this.text += "(";
        A(t.target, this);
        this.text += "=";
        A(t.value, this);
        this.text += ")";
    }
    visitValueConverter(t) {
        const e = t.args;
        A(t.expression, this);
        this.text += `|${t.name}`;
        for (let t = 0, s = e.length; t < s; ++t) {
            this.text += ":";
            A(e[t], this);
        }
    }
    visitBindingBehavior(t) {
        const e = t.args;
        A(t.expression, this);
        this.text += `&${t.name}`;
        for (let t = 0, s = e.length; t < s; ++t) {
            this.text += ":";
            A(e[t], this);
        }
    }
    visitArrayBindingPattern(t) {
        const e = t.elements;
        this.text += "[";
        for (let t = 0, s = e.length; t < s; ++t) {
            if (0 !== t) this.text += ",";
            A(e[t], this);
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
            A(s[t], this);
        }
        this.text += "}";
    }
    visitBindingIdentifier(t) {
        this.text += t.name;
    }
    visitForOfStatement(t) {
        A(t.declaration, this);
        this.text += " of ";
        A(t.iterable, this);
    }
    visitInterpolation(t) {
        const {parts: e, expressions: s} = t;
        const r = s.length;
        this.text += "${";
        this.text += e[0];
        for (let t = 0; t < r; t++) {
            A(s[t], this);
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
                A(o, this);
                break;

              case 24:
              case 25:
                {
                    const t = o.source;
                    if (t) {
                        A(t, this);
                        this.text += ":";
                    }
                    A(o, this);
                    break;
                }
            }
        }
        this.text += s ? "}" : "]";
    }
    visitDestructuringAssignmentSingleExpression(t) {
        A(t.source, this);
        this.text += ":";
        A(t.target, this);
        const e = t.initializer;
        if (void 0 !== e) {
            this.text += "=";
            A(e, this);
        }
    }
    visitDestructuringAssignmentRestExpression(t) {
        this.text += "...";
        A(t.target, this);
    }
    visitCustom(t) {
        this.text += b(t.value);
    }
    writeArgs(t) {
        this.text += "(";
        for (let e = 0, s = t.length; e < s; ++e) {
            if (0 !== e) this.text += ",";
            A(t[e], this);
        }
        this.text += ")";
    }
}

exports.ExpressionKind = void 0;

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
})(exports.ExpressionKind || (exports.ExpressionKind = {}));

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

ArrayLiteralExpression.$empty = new ArrayLiteralExpression(t.emptyArray);

class ObjectLiteralExpression {
    constructor(t, e) {
        this.keys = t;
        this.values = e;
        this.$kind = 3;
    }
}

ObjectLiteralExpression.$empty = new ObjectLiteralExpression(t.emptyArray, t.emptyArray);

class TemplateExpression {
    constructor(e, s = t.emptyArray) {
        this.cooked = e;
        this.expressions = s;
        this.$kind = 5;
    }
}

TemplateExpression.$empty = new TemplateExpression([ "" ]);

class TaggedTemplateExpression {
    constructor(e, s, r, i = t.emptyArray) {
        this.cooked = e;
        this.func = r;
        this.expressions = i;
        this.$kind = 12;
        e.raw = s;
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
    constructor(e, s = t.emptyArray) {
        this.parts = e;
        this.expressions = s;
        this.$kind = 23;
        this.isMulti = s.length > 1;
        this.firstExpression = s[0];
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
        if (null == t) throw y();
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
        if (null == t) throw m();
        return new Scope(null, t, null == e ? new OverrideContext : e, s ?? false);
    }
    static fromParent(t, e) {
        if (null == t) throw y();
        return new Scope(t, e, new OverrideContext, false);
    }
}

const y = () => n(`AUR0203`);

const m = () => n("AUR0204");

class OverrideContext {}

const E = Scope.getContext;

function O(t, e, s, r) {
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
            const i = E(e, t.name, t.ancestor);
            if (null !== r) r.observe(i, t.name);
            const c = i[t.name];
            if (null == c && "$host" === t.name) throw n(`AUR0105`);
            if (s?.strict) return s?.boundFn && o(c) ? c.bind(i) : c;
            return null == c ? "" : s?.boundFn && o(c) ? c.bind(i) : c;
        }

      case 2:
        return t.elements.map((t => O(t, e, s, r)));

      case 3:
        {
            const i = {};
            for (let n = 0; n < t.keys.length; ++n) i[t.keys[n]] = O(t.values[n], e, s, r);
            return i;
        }

      case 4:
        return t.value;

      case 5:
        {
            let i = t.cooked[0];
            for (let n = 0; n < t.expressions.length; ++n) {
                i += String(O(t.expressions[n], e, s, r));
                i += t.cooked[n + 1];
            }
            return i;
        }

      case 6:
        switch (t.operation) {
          case "void":
            return void O(t.expression, e, s, r);

          case "typeof":
            return typeof O(t.expression, e, s, r);

          case "!":
            return !O(t.expression, e, s, r);

          case "-":
            return -O(t.expression, e, s, r);

          case "+":
            return +O(t.expression, e, s, r);

          default:
            throw n(`AUR0109:${t.operation}`);
        }

      case 7:
        {
            const i = t.args.map((t => O(t, e, s, r)));
            const n = E(e, t.name, t.ancestor);
            const o = L(s?.strictFnCall, n, t.name);
            if (o) return o.apply(n, i);
            return;
        }

      case 8:
        {
            const i = O(t.object, e, s, r);
            const n = t.args.map((t => O(t, e, s, r)));
            const o = L(s?.strictFnCall, i, t.name);
            let c;
            if (o) {
                c = o.apply(i, n);
                if (h(i) && I.includes(t.name)) r?.observeCollection(i);
            }
            return c;
        }

      case 9:
        {
            const i = O(t.func, e, s, r);
            if (o(i)) return i(...t.args.map((t => O(t, e, s, r))));
            if (!s?.strictFnCall && null == i) return;
            throw n(`AUR0107`);
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
                return O(t.body, h, s, r);
            };
            return i;
        }

      case 10:
        {
            const i = O(t.object, e, s, r);
            let n;
            if (s?.strict) {
                if (null == i) return i;
                if (null !== r) r.observe(i, t.name);
                n = i[t.name];
                if (s?.boundFn && o(n)) return n.bind(i);
                return n;
            }
            if (null !== r && u(i)) r.observe(i, t.name);
            if (i) {
                n = i[t.name];
                if (s?.boundFn && o(n)) return n.bind(i);
                return n;
            }
            return "";
        }

      case 11:
        {
            const i = O(t.object, e, s, r);
            if (u(i)) {
                const n = O(t.key, e, s, r);
                if (null !== r) r.observe(i, n);
                return i[n];
            }
            return;
        }

      case 12:
        {
            const i = t.expressions.map((t => O(t, e, s, r)));
            const c = O(t.func, e, s, r);
            if (!o(c)) throw n(`AUR0110`);
            return c(t.cooked, ...i);
        }

      case 13:
        {
            const i = t.left;
            const c = t.right;
            switch (t.operation) {
              case "&&":
                return O(i, e, s, r) && O(c, e, s, r);

              case "||":
                return O(i, e, s, r) || O(c, e, s, r);

              case "??":
                return O(i, e, s, r) ?? O(c, e, s, r);

              case "==":
                return O(i, e, s, r) == O(c, e, s, r);

              case "===":
                return O(i, e, s, r) === O(c, e, s, r);

              case "!=":
                return O(i, e, s, r) != O(c, e, s, r);

              case "!==":
                return O(i, e, s, r) !== O(c, e, s, r);

              case "instanceof":
                {
                    const t = O(c, e, s, r);
                    if (o(t)) return O(i, e, s, r) instanceof t;
                    return false;
                }

              case "in":
                {
                    const t = O(c, e, s, r);
                    if (u(t)) return O(i, e, s, r) in t;
                    return false;
                }

              case "+":
                {
                    const t = O(i, e, s, r);
                    const n = O(c, e, s, r);
                    if (s?.strict) return t + n;
                    if (!t || !n) {
                        if (P(t) || P(n)) return (t || 0) + (n || 0);
                        if (_(t) || _(n)) return (t || "") + (n || "");
                    }
                    return t + n;
                }

              case "-":
                return O(i, e, s, r) - O(c, e, s, r);

              case "*":
                return O(i, e, s, r) * O(c, e, s, r);

              case "/":
                return O(i, e, s, r) / O(c, e, s, r);

              case "%":
                return O(i, e, s, r) % O(c, e, s, r);

              case "<":
                return O(i, e, s, r) < O(c, e, s, r);

              case ">":
                return O(i, e, s, r) > O(c, e, s, r);

              case "<=":
                return O(i, e, s, r) <= O(c, e, s, r);

              case ">=":
                return O(i, e, s, r) >= O(c, e, s, r);

              default:
                throw n(`AUR0108:${t.operation}`);
            }
        }

      case 14:
        return O(t.condition, e, s, r) ? O(t.yes, e, s, r) : O(t.no, e, s, r);

      case 15:
        return k(t.target, e, s, O(t.value, e, s, r));

      case 17:
        {
            const i = s?.getConverter?.(t.name);
            if (null == i) throw n(`AUR0103:${t.name}`);
            if ("toView" in i) return i.toView(O(t.expression, e, s, r), ...t.args.map((t => O(t, e, s, r))));
            return O(t.expression, e, s, r);
        }

      case 18:
        return O(t.expression, e, s, r);

      case 21:
        return t.name;

      case 22:
        return O(t.iterable, e, s, r);

      case 23:
        if (t.isMulti) {
            let i = t.parts[0];
            let n = 0;
            for (;n < t.expressions.length; ++n) {
                i += b(O(t.expressions[n], e, s, r));
                i += t.parts[n + 1];
            }
            return i;
        } else return `${t.parts[0]}${O(t.firstExpression, e, s, r)}${t.parts[1]}`;

      case 26:
        return O(t.target, e, s, r);

      case 24:
        return t.list.map((t => O(t, e, s, r)));

      case 19:
      case 20:
      case 25:
      default:
        return;

      case 28:
        return t.evaluate(e, s, r);
    }
}

function k(e, s, r, i) {
    switch (e.$kind) {
      case 1:
        {
            if ("$host" === e.name) throw n(`AUR0106`);
            const t = E(s, e.name, e.ancestor);
            return t[e.name] = i;
        }

      case 10:
        {
            const t = O(e.object, s, r, null);
            if (u(t)) if ("length" === e.name && h(t) && !isNaN(i)) t.splice(i); else t[e.name] = i; else k(e.object, s, r, {
                [e.name]: i
            });
            return i;
        }

      case 11:
        {
            const n = O(e.object, s, r, null);
            const o = O(e.key, s, r, null);
            if (h(n)) {
                if ("length" === o && !isNaN(i)) {
                    n.splice(i);
                    return i;
                }
                if (t.isArrayIndex(o)) {
                    n.splice(o, 1, i);
                    return i;
                }
            }
            return n[o] = i;
        }

      case 15:
        k(e.value, s, r, i);
        return k(e.target, s, r, i);

      case 17:
        {
            const t = r?.getConverter?.(e.name);
            if (null == t) throw U(e.name);
            if ("fromView" in t) i = t.fromView(i, ...e.args.map((t => O(t, s, r, null))));
            return k(e.expression, s, r, i);
        }

      case 18:
        return k(e.expression, s, r, i);

      case 24:
      case 25:
        {
            const t = e.list;
            const o = t.length;
            let c;
            let u;
            for (c = 0; c < o; c++) {
                u = t[c];
                switch (u.$kind) {
                  case 26:
                    k(u, s, r, i);
                    break;

                  case 24:
                  case 25:
                    {
                        if ("object" !== typeof i || null === i) throw n(`AUR0112`);
                        let t = O(u.source, Scope.create(i), r, null);
                        if (void 0 === t && u.initializer) t = O(u.initializer, s, r, null);
                        k(u, s, r, t);
                        break;
                    }
                }
            }
            break;
        }

      case 26:
        if (e instanceof DestructuringAssignmentSingleExpression) {
            if (null == i) return;
            if ("object" !== typeof i) throw n(`AUR0112`);
            let t = O(e.source, Scope.create(i), r, null);
            if (void 0 === t && e.initializer) t = O(e.initializer, s, r, null);
            k(e.target, s, r, t);
        } else {
            if (null == i) return;
            if ("object" !== typeof i) throw n(`AUR0112`);
            const o = e.indexOrProperties;
            let c;
            if (t.isArrayIndex(o)) {
                if (!Array.isArray(i)) throw n(`AUR0112`);
                c = i.slice(o);
            } else c = Object.entries(i).reduce(((t, [e, s]) => {
                if (!o.includes(e)) t[e] = s;
                return t;
            }), {});
            k(e.target, s, r, c);
        }
        break;

      case 28:
        return e.assign(s, r, i);

      default:
        return;
    }
}

function C(t, e, s) {
    switch (t.$kind) {
      case 18:
        {
            const r = t.name;
            const i = t.key;
            const n = s.getBehavior?.(r);
            if (null == n) throw $(r);
            if (void 0 === s[i]) {
                s[i] = n;
                n.bind?.(e, s, ...t.args.map((t => O(t, e, s, null))));
            } else throw R(r);
            C(t.expression, e, s);
            return;
        }

      case 17:
        {
            const r = t.name;
            const i = s.getConverter?.(r);
            if (null == i) throw U(r);
            const n = i.signals;
            if (null != n) {
                const t = s.getSignaler?.();
                const e = n.length;
                let r = 0;
                for (;r < e; ++r) t?.addSignalListener(n[r], s);
            }
            C(t.expression, e, s);
            return;
        }

      case 22:
        C(t.iterable, e, s);
        break;

      case 28:
        t.bind?.(e, s);
    }
}

function S(t, e, s) {
    switch (t.$kind) {
      case 18:
        {
            const r = t.key;
            const i = s;
            if (void 0 !== i[r]) {
                i[r].unbind?.(e, s);
                i[r] = void 0;
            }
            S(t.expression, e, s);
            break;
        }

      case 17:
        {
            const r = s.getConverter?.(t.name);
            if (void 0 === r?.signals) return;
            const i = s.getSignaler?.();
            let n = 0;
            for (;n < r.signals.length; ++n) i?.removeSignalListener(r.signals[n], s);
            S(t.expression, e, s);
            break;
        }

      case 22:
        S(t.iterable, e, s);
        break;

      case 28:
        t.unbind?.(e, s);
    }
}

const $ = t => n(`AUR0101:${t}`);

const R = t => n(`AUR0102:${t}`);

const U = t => n(`AUR0103:${t}`);

const L = (t, e, s) => {
    const r = null == e ? null : e[s];
    if (o(r)) return r;
    if (!t && null == r) return null;
    throw n(`AUR0111:${s}`);
};

const P = t => {
    switch (typeof t) {
      case "number":
      case "bigint":
        return true;

      default:
        return false;
    }
};

const _ = t => {
    switch (typeof t) {
      case "string":
        return true;

      case "object":
        return t instanceof Date;

      default:
        return false;
    }
};

const I = "at map filter includes indexOf lastIndexOf findIndex find flat flatMap join reduce reduceRight slice every some sort".split(" ");

const M = t.DI.createInterface("ICoercionConfiguration");

exports.CollectionKind = void 0;

(function(t) {
    t[t["indexed"] = 8] = "indexed";
    t[t["keyed"] = 4] = "keyed";
    t[t["array"] = 9] = "array";
    t[t["map"] = 6] = "map";
    t[t["set"] = 7] = "set";
})(exports.CollectionKind || (exports.CollectionKind = {}));

exports.AccessorType = void 0;

(function(t) {
    t[t["None"] = 0] = "None";
    t[t["Observer"] = 1] = "Observer";
    t[t["Node"] = 2] = "Node";
    t[t["Layout"] = 4] = "Layout";
    t[t["Primtive"] = 8] = "Primtive";
    t[t["Array"] = 18] = "Array";
    t[t["Set"] = 34] = "Set";
    t[t["Map"] = 66] = "Map";
})(exports.AccessorType || (exports.AccessorType = {}));

function B(t, e, s) {
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

function j(t = 0) {
    const e = Array(t);
    let s = 0;
    while (s < t) e[s] = s++;
    e.deletedIndices = [];
    e.deletedItems = [];
    e.isIndexMap = true;
    return e;
}

function T(t) {
    const e = t.slice();
    e.deletedIndices = t.deletedIndices.slice();
    e.deletedItems = t.deletedItems.slice();
    e.isIndexMap = true;
    return e;
}

function D(t) {
    return h(t) && true === t.isIndexMap;
}

let V = new Map;

let F = false;

function N(t) {
    const e = V;
    const s = V = new Map;
    F = true;
    try {
        t();
    } finally {
        V = null;
        F = false;
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
            V = e;
        }
    }
}

function z(t, e, s) {
    if (!V.has(t)) V.set(t, [ 2, e, s ]);
}

function K(t, e, s) {
    const r = V.get(t);
    if (void 0 === r) V.set(t, [ 1, e, s ]); else {
        r[1] = e;
        r[2] = s;
    }
}

function W(t) {
    return null == t ? q : q(t);
}

function q(t) {
    const e = t.prototype;
    i(e, "subs", {
        get: J
    });
    w(e, "subscribe", G);
    w(e, "unsubscribe", H);
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
        if (F) {
            K(this, t, e);
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

function J() {
    return p(this, "subs", new SubscriberRecord);
}

function G(t) {
    return this.subs.add(t);
}

function H(t) {
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
        this.type = l(this.o) ? 66 : 34;
    }
    getValue() {
        return this.o.size;
    }
    setValue() {
        throw n(`AUR02`);
    }
    handleCollectionChange(t, e) {
        const s = this.v;
        const r = this.o.size;
        if ((this.v = r) !== s) this.subs.notify(this.v, s);
    }
}

function Q(t) {
    const e = t.prototype;
    w(e, "subscribe", X);
    w(e, "unsubscribe", Y);
    W(t);
}

function X(t) {
    if (this.subs.add(t) && 1 === this.subs.count) this.owner.subscribe(this);
}

function Y(t) {
    if (this.subs.remove(t) && 0 === this.subs.count) this.owner.subscribe(this);
}

Q(CollectionLengthObserver);

Q(CollectionSizeObserver);

const Z = "__au_array_obs__";

const tt = (() => {
    let t = x(Z, Array);
    if (null == t) g(Z, t = new WeakMap, Array);
    return t;
})();

function et(t, e) {
    if (t === e) return 0;
    t = null === t ? "null" : t.toString();
    e = null === e ? "null" : e.toString();
    return t < e ? -1 : 1;
}

function st(t, e) {
    if (void 0 === t) if (void 0 === e) return 0; else return 1;
    if (void 0 === e) return -1;
    return 0;
}

function rt(t, e, s, r, i) {
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

function it(t, e, s, r, i) {
    let n = 0, o = 0;
    let c, u, h;
    let a, l, f;
    let p, w, b;
    let d, v;
    let x, g, A, y;
    let m, E, O, k;
    while (true) {
        if (r - s <= 10) {
            rt(t, e, s, r, i);
            return;
        }
        n = s + (r - s >> 1);
        c = t[s];
        a = e[s];
        u = t[r - 1];
        l = e[r - 1];
        h = t[n];
        f = e[n];
        p = i(c, u);
        if (p > 0) {
            d = c;
            v = a;
            c = u;
            a = l;
            u = d;
            l = v;
        }
        w = i(c, h);
        if (w >= 0) {
            d = c;
            v = a;
            c = h;
            a = f;
            h = u;
            f = l;
            u = d;
            l = v;
        } else {
            b = i(u, h);
            if (b > 0) {
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
        x = u;
        g = l;
        A = s + 1;
        y = r - 1;
        t[n] = t[A];
        e[n] = e[A];
        t[A] = x;
        e[A] = g;
        t: for (o = A + 1; o < y; o++) {
            m = t[o];
            E = e[o];
            O = i(m, x);
            if (O < 0) {
                t[o] = t[A];
                e[o] = e[A];
                t[A] = m;
                e[A] = E;
                A++;
            } else if (O > 0) {
                do {
                    y--;
                    if (y == o) break t;
                    k = t[y];
                    O = i(k, x);
                } while (O > 0);
                t[o] = t[y];
                e[o] = e[y];
                t[y] = m;
                e[y] = E;
                if (O < 0) {
                    m = t[o];
                    E = e[o];
                    t[o] = t[A];
                    e[o] = e[A];
                    t[A] = m;
                    e[A] = E;
                    A++;
                }
            }
        }
        if (r - y < A - s) {
            it(t, e, y, r, i);
            r = A;
        } else {
            it(t, e, s, A, i);
            s = y;
        }
    }
}

const nt = Array.prototype;

const ot = nt.push;

const ct = nt.unshift;

const ut = nt.pop;

const ht = nt.shift;

const at = nt.splice;

const lt = nt.reverse;

const ft = nt.sort;

const pt = {
    push: ot,
    unshift: ct,
    pop: ut,
    shift: ht,
    splice: at,
    reverse: lt,
    sort: ft
};

const wt = [ "push", "unshift", "pop", "shift", "splice", "reverse", "sort" ];

const bt = {
    push: function(...t) {
        const e = tt.get(this);
        if (void 0 === e) return ot.apply(this, t);
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
        const e = tt.get(this);
        if (void 0 === e) return ct.apply(this, t);
        const s = t.length;
        const r = new Array(s);
        let i = 0;
        while (i < s) r[i++] = -2;
        ct.apply(e.indexMap, r);
        const n = ct.apply(this, t);
        e.notify();
        return n;
    },
    pop: function() {
        const t = tt.get(this);
        if (void 0 === t) return ut.call(this);
        const e = t.indexMap;
        const s = ut.call(this);
        const r = e.length - 1;
        if (e[r] > -1) {
            e.deletedIndices.push(e[r]);
            e.deletedItems.push(s);
        }
        ut.call(e);
        t.notify();
        return s;
    },
    shift: function() {
        const t = tt.get(this);
        if (void 0 === t) return ht.call(this);
        const e = t.indexMap;
        const s = ht.call(this);
        if (e[0] > -1) {
            e.deletedIndices.push(e[0]);
            e.deletedItems.push(s);
        }
        ht.call(e);
        t.notify();
        return s;
    },
    splice: function(...t) {
        const e = t[0];
        const s = t[1];
        const r = tt.get(this);
        if (void 0 === r) return at.apply(this, t);
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
            at.call(c, e, s, ...r);
        } else at.apply(c, t);
        const l = at.apply(this, t);
        if (h > 0 || a > 0) r.notify();
        return l;
    },
    reverse: function() {
        const t = tt.get(this);
        if (void 0 === t) {
            lt.call(this);
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
        const e = tt.get(this);
        if (void 0 === e) {
            ft.call(this, t);
            return this;
        }
        let s = this.length;
        if (s < 2) return this;
        it(this, e.indexMap, 0, s, st);
        let r = 0;
        while (r < s) {
            if (void 0 === this[r]) break;
            r++;
        }
        if (void 0 === t || !o(t)) t = et;
        it(this, e.indexMap, 0, r, t);
        let i = false;
        for (r = 0, s = e.indexMap.length; s > r; ++r) if (e.indexMap[r] !== r) {
            i = true;
            break;
        }
        if (i) e.notify();
        return this;
    }
};

for (const t of wt) i(bt[t], "observing", {
    value: true,
    writable: false,
    configurable: false,
    enumerable: false
});

let dt = false;

const vt = "__au_arr_on__";

function xt() {
    if (!(x(vt, Array) ?? false)) {
        g(vt, true, Array);
        for (const t of wt) if (true !== nt[t].observing) p(nt, t, bt[t]);
    }
}

function gt() {
    for (const t of wt) if (true === nt[t].observing) p(nt, t, pt[t]);
}

class ArrayObserver {
    constructor(t) {
        this.type = 18;
        if (!dt) {
            dt = true;
            xt();
        }
        this.indexObservers = {};
        this.collection = t;
        this.indexMap = j(t.length);
        this.lenObs = void 0;
        tt.set(t, this);
    }
    notify() {
        const t = this.subs;
        const e = this.indexMap;
        if (F) {
            z(t, this.collection, e);
            return;
        }
        const s = this.collection;
        const r = s.length;
        this.indexMap = j(r);
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

W(ArrayObserver);

W(ArrayIndexObserver);

function At(t) {
    let e = tt.get(t);
    if (void 0 === e) e = new ArrayObserver(t);
    return e;
}

const yt = (t, e) => t - e;

function mt(t) {
    let e = 0;
    let s = 0;
    let r = 0;
    const i = T(t);
    if (i.deletedIndices.length > 1) i.deletedIndices.sort(yt);
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

function Et(t, e) {
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

const Ot = "__au_set_obs__";

const kt = (() => {
    let t = x(Ot, Set);
    if (null == t) g(Ot, t = new WeakMap, Set);
    return t;
})();

const Ct = Set.prototype;

const St = Ct.add;

const $t = Ct.clear;

const Rt = Ct.delete;

const Ut = {
    add: St,
    clear: $t,
    delete: Rt
};

const Lt = [ "add", "clear", "delete" ];

const Pt = {
    add: function(t) {
        const e = kt.get(this);
        if (void 0 === e) {
            St.call(this, t);
            return this;
        }
        const s = this.size;
        St.call(this, t);
        const r = this.size;
        if (r === s) return this;
        e.indexMap[s] = -2;
        e.notify();
        return this;
    },
    clear: function() {
        const t = kt.get(this);
        if (void 0 === t) return $t.call(this);
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
            $t.call(this);
            e.length = 0;
            t.notify();
        }
        return;
    },
    delete: function(t) {
        const e = kt.get(this);
        if (void 0 === e) return Rt.call(this, t);
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
                const n = Rt.call(this, t);
                if (true === n) e.notify();
                return n;
            }
            r++;
        }
        return false;
    }
};

const _t = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const t of Lt) i(Pt[t], "observing", {
    value: true,
    writable: false,
    configurable: false,
    enumerable: false
});

let It = false;

const Mt = "__au_set_on__";

function Bt() {
    if (!(x(Mt, Set) ?? false)) {
        g(Mt, true, Set);
        for (const t of Lt) if (true !== Ct[t].observing) i(Ct, t, {
            ..._t,
            value: Pt[t]
        });
    }
}

function jt() {
    for (const t of Lt) if (true === Ct[t].observing) i(Ct, t, {
        ..._t,
        value: Ut[t]
    });
}

class SetObserver {
    constructor(t) {
        this.type = 34;
        if (!It) {
            It = true;
            Bt();
        }
        this.collection = t;
        this.indexMap = j(t.size);
        this.lenObs = void 0;
        kt.set(t, this);
    }
    notify() {
        const t = this.subs;
        const e = this.indexMap;
        if (F) {
            z(t, this.collection, e);
            return;
        }
        const s = this.collection;
        const r = s.size;
        this.indexMap = j(r);
        this.subs.notifyCollection(s, e);
    }
    getLengthObserver() {
        return this.lenObs ?? (this.lenObs = new CollectionSizeObserver(this));
    }
}

W(SetObserver);

function Tt(t) {
    let e = kt.get(t);
    if (void 0 === e) e = new SetObserver(t);
    return e;
}

const Dt = "__au_map_obs__";

const Vt = (() => {
    let t = x(Dt, Map);
    if (null == t) g(Dt, t = new WeakMap, Map);
    return t;
})();

const Ft = Map.prototype;

const Nt = Ft.set;

const zt = Ft.clear;

const Kt = Ft.delete;

const Wt = {
    set: Nt,
    clear: zt,
    delete: Kt
};

const qt = [ "set", "clear", "delete" ];

const Jt = {
    set: function(t, e) {
        const s = Vt.get(this);
        if (void 0 === s) {
            Nt.call(this, t, e);
            return this;
        }
        const r = this.get(t);
        const i = this.size;
        Nt.call(this, t, e);
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
        const t = Vt.get(this);
        if (void 0 === t) return zt.call(this);
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
            zt.call(this);
            e.length = 0;
            t.notify();
        }
        return;
    },
    delete: function(t) {
        const e = Vt.get(this);
        if (void 0 === e) return Kt.call(this, t);
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
                const n = Kt.call(this, t);
                if (true === n) e.notify();
                return n;
            }
            ++r;
        }
        return false;
    }
};

const Gt = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const t of qt) i(Jt[t], "observing", {
    value: true,
    writable: false,
    configurable: false,
    enumerable: false
});

let Ht = false;

const Qt = "__au_map_on__";

function Xt() {
    if (!(x(Qt, Map) ?? false)) {
        g(Qt, true, Map);
        for (const t of qt) if (true !== Ft[t].observing) i(Ft, t, {
            ...Gt,
            value: Jt[t]
        });
    }
}

function Yt() {
    for (const t of qt) if (true === Ft[t].observing) i(Ft, t, {
        ...Gt,
        value: Wt[t]
    });
}

class MapObserver {
    constructor(t) {
        this.type = 66;
        if (!Ht) {
            Ht = true;
            Xt();
        }
        this.collection = t;
        this.indexMap = j(t.size);
        this.lenObs = void 0;
        Vt.set(t, this);
    }
    notify() {
        const t = this.subs;
        const e = this.indexMap;
        if (F) {
            z(t, this.collection, e);
            return;
        }
        const s = this.collection;
        const r = s.size;
        this.indexMap = j(r);
        t.notifyCollection(s, e);
    }
    getLengthObserver() {
        return this.lenObs ?? (this.lenObs = new CollectionSizeObserver(this));
    }
}

W(MapObserver);

function Zt(t) {
    let e = Vt.get(t);
    if (void 0 === e) e = new MapObserver(t);
    return e;
}

function te() {
    return p(this, "obs", new BindingObserverRecord(this));
}

function ee(t, e) {
    this.obs.add(this.oL.getObserver(t, e));
}

function se(t) {
    let e;
    if (h(t)) e = At(t); else if (a(t)) e = Tt(t); else if (l(t)) e = Zt(t); else throw n(`AUR0210`);
    this.obs.add(e);
}

function re(t) {
    this.obs.add(t);
}

function ie() {
    throw n(`AUR2011:handleChange`);
}

function ne() {
    throw n(`AUR2011:handleCollectionChange`);
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
        this.o.forEach(ce, this);
        this.count = this.o.size;
    }
    clearAll() {
        this.o.forEach(oe, this);
        this.o.clear();
        this.count = 0;
    }
}

function oe(t, e) {
    e.unsubscribe(this.b);
}

function ce(t, e) {
    if (this.version !== t) {
        e.unsubscribe(this.b);
        this.o.delete(e);
    }
}

function ue(t) {
    const e = t.prototype;
    w(e, "observe", ee);
    w(e, "observeCollection", se);
    w(e, "subscribeTo", re);
    i(e, "obs", {
        get: te
    });
    w(e, "handleChange", ie);
    w(e, "handleCollectionChange", ne);
    return t;
}

function he(t) {
    return null == t ? ue : ue(t);
}

const ae = d("IExpressionParser", (t => t.singleton(ExpressionParser)));

class ExpressionParser {
    constructor() {
        this.i = v();
        this.u = v();
        this.h = v();
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
                throw cs();
            }
            s = this.i[t];
            if (void 0 === s) s = this.i[t] = this.$parse(t, e);
            return s;
        }
    }
    $parse(t, e) {
        xe = t;
        ge = 0;
        Ae = t.length;
        ye = 0;
        me = 0;
        Ee = 6291456;
        Oe = "";
        ke = Ue(0);
        Ce = true;
        Se = false;
        $e = -1;
        return _e(61, void 0 === e ? 16 : e);
    }
}

function le(t) {
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

const fe = PrimitiveLiteralExpression.$false;

const pe = PrimitiveLiteralExpression.$true;

const we = PrimitiveLiteralExpression.$null;

const be = PrimitiveLiteralExpression.$undefined;

const de = AccessThisExpression.$this;

const ve = AccessThisExpression.$parent;

exports.ExpressionType = void 0;

(function(t) {
    t[t["None"] = 0] = "None";
    t[t["Interpolation"] = 1] = "Interpolation";
    t[t["IsIterator"] = 2] = "IsIterator";
    t[t["IsChainable"] = 4] = "IsChainable";
    t[t["IsFunction"] = 8] = "IsFunction";
    t[t["IsProperty"] = 16] = "IsProperty";
    t[t["IsCustom"] = 32] = "IsCustom";
})(exports.ExpressionType || (exports.ExpressionType = {}));

let xe = "";

let ge = 0;

let Ae = 0;

let ye = 0;

let me = 0;

let Ee = 6291456;

let Oe = "";

let ke;

let Ce = true;

let Se = false;

let $e = -1;

const Re = String.fromCharCode;

const Ue = t => xe.charCodeAt(t);

const Le = () => xe.slice(me, ge);

function Pe(t, e) {
    xe = t;
    ge = 0;
    Ae = t.length;
    ye = 0;
    me = 0;
    Ee = 6291456;
    Oe = "";
    ke = Ue(0);
    Ce = true;
    Se = false;
    $e = -1;
    return _e(61, void 0 === e ? 16 : e);
}

function _e(t, e) {
    if (32 === e) return new CustomExpression(xe);
    if (0 === ge) {
        if (1 & e) return ze();
        qe();
        if (4194304 & Ee) throw es();
    }
    Ce = 513 > t;
    Se = false;
    let s = false;
    let r;
    let i = 0;
    if (131072 & Ee) {
        const t = Ss[63 & Ee];
        qe();
        r = new UnaryExpression(t, _e(514, e));
        Ce = false;
    } else {
        t: switch (Ee) {
          case 12294:
            i = ye;
            Ce = false;
            do {
                qe();
                ++i;
                switch (Ee) {
                  case 65545:
                    qe();
                    if (0 === (12288 & Ee)) throw rs();
                    break;

                  case 10:
                  case 11:
                    throw rs();

                  case 2162700:
                    Se = true;
                    qe();
                    if (0 === (12288 & Ee)) {
                        r = 0 === i ? de : 1 === i ? ve : new AccessThisExpression(i);
                        s = true;
                        break t;
                    }
                    break;

                  default:
                    if (2097152 & Ee) {
                        r = 0 === i ? de : 1 === i ? ve : new AccessThisExpression(i);
                        break t;
                    }
                    throw is();
                }
            } while (12294 === Ee);

          case 4096:
            {
                const t = Oe;
                if (2 & e) r = new BindingIdentifier(t); else r = new AccessScopeExpression(t, i);
                Ce = !Se;
                qe();
                if (Ze(50)) {
                    if (524296 === Ee) throw ks();
                    const e = Se;
                    const s = ye;
                    ++ye;
                    const i = _e(62, 0);
                    Se = e;
                    ye = s;
                    Ce = false;
                    r = new ArrowFunction([ new BindingIdentifier(t) ], i);
                }
                break;
            }

          case 10:
            throw Cs();

          case 11:
            throw ss();

          case 12292:
            Ce = false;
            qe();
            switch (ye) {
              case 0:
                r = de;
                break;

              case 1:
                r = ve;
                break;

              default:
                r = new AccessThisExpression(ye);
                break;
            }
            break;

          case 2688007:
            r = De(e);
            break;

          case 2688016:
            r = xe.search(/\s+of\s+/) > ge ? Ie() : Ve(e);
            break;

          case 524296:
            r = Ne(e);
            break;

          case 2163759:
            r = new TemplateExpression([ Oe ]);
            Ce = false;
            qe();
            break;

          case 2163760:
            r = Ke(e, r, false);
            break;

          case 16384:
          case 32768:
            r = new PrimitiveLiteralExpression(Oe);
            Ce = false;
            qe();
            break;

          case 8194:
          case 8195:
          case 8193:
          case 8192:
            r = Ss[63 & Ee];
            Ce = false;
            qe();
            break;

          default:
            if (ge >= Ae) throw ns(); else throw os();
        }
        if (2 & e) return Fe(r);
        if (514 < t) return r;
        if (10 === Ee || 11 === Ee) throw rs();
        if (0 === r.$kind) switch (Ee) {
          case 2162700:
            Se = true;
            Ce = false;
            qe();
            if (0 === (13312 & Ee)) throw gs();
            if (12288 & Ee) {
                r = new AccessScopeExpression(Oe, r.ancestor);
                qe();
            } else if (2688007 === Ee) r = new CallFunctionExpression(r, Me(), true); else if (2688016 === Ee) r = Be(r, true); else throw As();
            break;

          case 65545:
            Ce = !Se;
            qe();
            if (0 === (12288 & Ee)) throw rs();
            r = new AccessScopeExpression(Oe, r.ancestor);
            qe();
            break;

          case 10:
          case 11:
            throw rs();

          case 2688007:
            r = new CallFunctionExpression(r, Me(), s);
            break;

          case 2688016:
            r = Be(r, s);
            break;

          case 2163759:
            r = We(r);
            break;

          case 2163760:
            r = Ke(e, r, true);
            break;
        }
        while ((65536 & Ee) > 0) switch (Ee) {
          case 2162700:
            r = je(r);
            break;

          case 65545:
            qe();
            if (0 === (12288 & Ee)) throw rs();
            r = Te(r, false);
            break;

          case 10:
          case 11:
            throw rs();

          case 2688007:
            if (1 === r.$kind) r = new CallScopeExpression(r.name, Me(), r.ancestor, false); else if (10 === r.$kind) r = new CallMemberExpression(r.object, r.name, Me(), r.optional, false); else r = new CallFunctionExpression(r, Me(), false);
            break;

          case 2688016:
            r = Be(r, false);
            break;

          case 2163759:
            if (Se) throw As();
            r = We(r);
            break;

          case 2163760:
            if (Se) throw As();
            r = Ke(e, r, true);
            break;
        }
    }
    if (10 === Ee || 11 === Ee) throw rs();
    if (513 < t) return r;
    while ((262144 & Ee) > 0) {
        const s = Ee;
        if ((960 & s) <= t) break;
        qe();
        r = new BinaryExpression(Ss[63 & s], r, _e(960 & s, e));
        Ce = false;
    }
    if (63 < t) return r;
    if (Ze(6291478)) {
        const t = _e(62, e);
        ts(6291476);
        r = new ConditionalExpression(r, t, _e(62, e));
        Ce = false;
    }
    if (62 < t) return r;
    if (Ze(4194349)) {
        if (!Ce) throw us();
        r = new AssignExpression(r, _e(62, e));
    }
    if (61 < t) return r;
    while (Ze(6291480)) {
        if (6291456 === Ee) throw hs();
        const t = Oe;
        qe();
        const s = new Array;
        while (Ze(6291476)) s.push(_e(62, e));
        r = new ValueConverterExpression(r, t, s);
    }
    while (Ze(6291479)) {
        if (6291456 === Ee) throw as();
        const t = Oe;
        qe();
        const s = new Array;
        while (Ze(6291476)) s.push(_e(62, e));
        r = new BindingBehaviorExpression(r, t, s);
    }
    if (6291456 !== Ee) {
        if ((1 & e) > 0 && 7340045 === Ee) return r;
        if ((4 & e) > 0 && 6291477 === Ee) {
            if (ge === Ae) throw os();
            $e = ge - 1;
            return r;
        }
        if ("of" === Le()) throw ls();
        throw os();
    }
    return r;
}

function Ie() {
    const t = [];
    const e = new DestructuringAssignmentExpression(24, t, void 0, void 0);
    let s = "";
    let r = true;
    let i = 0;
    while (r) {
        qe();
        switch (Ee) {
          case 7340051:
            r = false;
            n();
            break;

          case 6291471:
            n();
            break;

          case 4096:
            s = Le();
            break;

          default:
            throw xs();
        }
    }
    ts(7340051);
    return e;
    function n() {
        if ("" !== s) {
            t.push(new DestructuringAssignmentSingleExpression(new AccessMemberExpression(de, s), new AccessKeyedExpression(de, new PrimitiveLiteralExpression(i++)), void 0));
            s = "";
        } else i++;
    }
}

function Me() {
    const t = Se;
    qe();
    const e = [];
    while (7340046 !== Ee) {
        e.push(_e(62, 0));
        if (!Ze(6291471)) break;
    }
    ts(7340046);
    Ce = false;
    Se = t;
    return e;
}

function Be(t, e) {
    const s = Se;
    qe();
    t = new AccessKeyedExpression(t, _e(62, 0), e);
    ts(7340051);
    Ce = !s;
    Se = s;
    return t;
}

function je(t) {
    Se = true;
    Ce = false;
    qe();
    if (0 === (13312 & Ee)) throw gs();
    if (12288 & Ee) return Te(t, true);
    if (2688007 === Ee) if (1 === t.$kind) return new CallScopeExpression(t.name, Me(), t.ancestor, true); else if (10 === t.$kind) return new CallMemberExpression(t.object, t.name, Me(), t.optional, true); else return new CallFunctionExpression(t, Me(), true);
    if (2688016 === Ee) return Be(t, true);
    throw As();
}

function Te(t, e) {
    const s = Oe;
    switch (Ee) {
      case 2162700:
        {
            Se = true;
            Ce = false;
            const r = ge;
            const i = me;
            const n = Ee;
            const o = ke;
            const c = Oe;
            const u = Ce;
            const h = Se;
            qe();
            if (0 === (13312 & Ee)) throw gs();
            if (2688007 === Ee) return new CallMemberExpression(t, s, Me(), e, true);
            ge = r;
            me = i;
            Ee = n;
            ke = o;
            Oe = c;
            Ce = u;
            Se = h;
            return new AccessMemberExpression(t, s, e);
        }

      case 2688007:
        Ce = false;
        return new CallMemberExpression(t, s, Me(), e, false);

      default:
        Ce = !Se;
        qe();
        return new AccessMemberExpression(t, s, e);
    }
}

function De(t) {
    qe();
    const e = ge;
    const s = me;
    const r = Ee;
    const i = ke;
    const n = Oe;
    const o = Ce;
    const c = Se;
    const u = [];
    let h = 1;
    let a = false;
    t: while (true) {
        if (11 === Ee) {
            qe();
            if (4096 !== Ee) throw rs();
            u.push(new BindingIdentifier(Oe));
            qe();
            if (6291471 === Ee) throw Os();
            if (7340046 !== Ee) throw ss();
            qe();
            if (50 !== Ee) throw ss();
            qe();
            const t = Se;
            const e = ye;
            ++ye;
            const s = _e(62, 0);
            Se = t;
            ye = e;
            Ce = false;
            return new ArrowFunction(u, s, true);
        }
        switch (Ee) {
          case 4096:
            u.push(new BindingIdentifier(Oe));
            qe();
            break;

          case 7340046:
            qe();
            break t;

          case 524296:
          case 2688016:
            qe();
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
            qe();
            h = 2;
            break;
        }
        switch (Ee) {
          case 6291471:
            qe();
            a = true;
            if (1 === h) break;
            break t;

          case 7340046:
            qe();
            break t;

          case 4194349:
            if (1 === h) h = 3;
            break t;

          case 50:
            if (a) throw ys();
            qe();
            h = 2;
            break t;

          default:
            if (1 === h) h = 2;
            break t;
        }
    }
    if (50 === Ee) {
        if (1 === h) {
            qe();
            if (524296 === Ee) throw ks();
            const t = Se;
            const e = ye;
            ++ye;
            const s = _e(62, 0);
            Se = t;
            ye = e;
            Ce = false;
            return new ArrowFunction(u, s);
        }
        throw ys();
    } else if (1 === h && 0 === u.length) throw ds(50);
    if (a) switch (h) {
      case 2:
        throw ys();

      case 3:
        throw ms();

      case 4:
        throw Es();
    }
    ge = e;
    me = s;
    Ee = r;
    ke = i;
    Oe = n;
    Ce = o;
    Se = c;
    const l = Se;
    const f = _e(62, t);
    Se = l;
    ts(7340046);
    if (50 === Ee) switch (h) {
      case 2:
        throw ys();

      case 3:
        throw ms();

      case 4:
        throw Es();
    }
    return f;
}

function Ve(t) {
    const e = Se;
    qe();
    const s = new Array;
    while (7340051 !== Ee) if (Ze(6291471)) {
        s.push(be);
        if (7340051 === Ee) break;
    } else {
        s.push(_e(62, ~2 & t));
        if (Ze(6291471)) {
            if (7340051 === Ee) break;
        } else break;
    }
    Se = e;
    ts(7340051);
    if (2 & t) return new ArrayBindingPattern(s); else {
        Ce = false;
        return new ArrayLiteralExpression(s);
    }
}

function Fe(t) {
    if (0 === (t.$kind & (19 | 20 | 21))) throw fs();
    if (4204593 !== Ee) throw fs();
    qe();
    const e = t;
    const s = _e(61, 4);
    return new ForOfStatement(e, s, $e);
}

function Ne(t) {
    const e = Se;
    const s = new Array;
    const r = new Array;
    qe();
    while (7340045 !== Ee) {
        s.push(Oe);
        if (49152 & Ee) {
            qe();
            ts(6291476);
            r.push(_e(62, ~2 & t));
        } else if (12288 & Ee) {
            const e = ke;
            const s = Ee;
            const i = ge;
            qe();
            if (Ze(6291476)) r.push(_e(62, ~2 & t)); else {
                ke = e;
                Ee = s;
                ge = i;
                r.push(_e(515, ~2 & t));
            }
        } else throw ps();
        if (7340045 !== Ee) ts(6291471);
    }
    Se = e;
    ts(7340045);
    if (2 & t) return new ObjectBindingPattern(s, r); else {
        Ce = false;
        return new ObjectLiteralExpression(s, r);
    }
}

function ze() {
    const t = [];
    const e = [];
    const s = Ae;
    let r = "";
    while (ge < s) {
        switch (ke) {
          case 36:
            if (123 === Ue(ge + 1)) {
                t.push(r);
                r = "";
                ge += 2;
                ke = Ue(ge);
                qe();
                const s = _e(61, 1);
                e.push(s);
                continue;
            } else r += "$";
            break;

          case 92:
            r += Re(le(Je()));
            break;

          default:
            r += Re(ke);
        }
        Je();
    }
    if (e.length) {
        t.push(r);
        return new Interpolation(t, e);
    }
    return null;
}

function Ke(t, e, s) {
    const r = Se;
    const i = [ Oe ];
    ts(2163760);
    const n = [ _e(62, t) ];
    while (2163759 !== (Ee = Ye())) {
        i.push(Oe);
        ts(2163760);
        n.push(_e(62, t));
    }
    i.push(Oe);
    Ce = false;
    Se = r;
    if (s) {
        qe();
        return new TaggedTemplateExpression(i, i, e, n);
    } else {
        qe();
        return new TemplateExpression(i, n);
    }
}

function We(t) {
    Ce = false;
    const e = [ Oe ];
    qe();
    return new TaggedTemplateExpression(e, e, t);
}

function qe() {
    while (ge < Ae) {
        me = ge;
        if (null != (Ee = Is[ke]())) return;
    }
    Ee = 6291456;
}

function Je() {
    return ke = Ue(++ge);
}

function Ge() {
    while (_s[Je()]) ;
    const t = $s[Oe = Le()];
    return void 0 === t ? 4096 : t;
}

function He(t) {
    let e = ke;
    if (false === t) {
        do {
            e = Je();
        } while (e <= 57 && e >= 48);
        if (46 !== e) {
            Oe = parseInt(Le(), 10);
            return 32768;
        }
        e = Je();
        if (ge >= Ae) {
            Oe = parseInt(Le().slice(0, -1), 10);
            return 32768;
        }
    }
    if (e <= 57 && e >= 48) do {
        e = Je();
    } while (e <= 57 && e >= 48); else ke = Ue(--ge);
    Oe = parseFloat(Le());
    return 32768;
}

function Qe() {
    const t = ke;
    Je();
    let e = 0;
    const s = new Array;
    let r = ge;
    while (ke !== t) if (92 === ke) {
        s.push(xe.slice(r, ge));
        Je();
        e = le(ke);
        Je();
        s.push(Re(e));
        r = ge;
    } else if (ge >= Ae) throw ws(); else Je();
    const i = xe.slice(r, ge);
    Je();
    s.push(i);
    const n = s.join("");
    Oe = n;
    return 16384;
}

function Xe() {
    let t = true;
    let e = "";
    while (96 !== Je()) if (36 === ke) if (ge + 1 < Ae && 123 === Ue(ge + 1)) {
        ge++;
        t = false;
        break;
    } else e += "$"; else if (92 === ke) e += Re(le(Je())); else {
        if (ge >= Ae) throw bs();
        e += Re(ke);
    }
    Je();
    Oe = e;
    if (t) return 2163759;
    return 2163760;
}

const Ye = () => {
    if (ge >= Ae) throw bs();
    ge--;
    return Xe();
};

const Ze = t => {
    if (Ee === t) {
        qe();
        return true;
    }
    return false;
};

const ts = t => {
    if (Ee === t) qe(); else throw ds(t);
};

const es = () => n(`AUR0151:${xe}`);

const ss = () => n(`AUR0152:${xe}`);

const rs = () => n(`AUR0153:${xe}`);

const is = () => n(`AUR0154:${xe}`);

const ns = () => n(`AUR0155:${xe}`);

const os = () => n(`AUR0156:${xe}`);

const cs = () => n(`AUR0157`);

const us = () => n(`AUR0158:${xe}`);

const hs = () => n(`AUR0159:${xe}`);

const as = () => n(`AUR0160:${xe}`);

const ls = () => n(`AUR0161:${xe}`);

const fs = () => n(`AUR0163:${xe}`);

const ps = () => n(`AUR0164:${xe}`);

const ws = () => n(`AUR0165:${xe}`);

const bs = () => n(`AUR0166:${xe}`);

const ds = t => n(`AUR0167:${xe}<${Ss[63 & t]}`);

const vs = () => {
    throw n(`AUR0168:${xe}`);
};

vs.notMapped = true;

const xs = () => n(`AUR0170:${xe}`);

const gs = () => n(`AUR0171:${xe}`);

const As = () => n(`AUR0172:${xe}`);

const ys = () => n(`AUR0173:${xe}`);

const ms = () => n(`AUR0174:${xe}`);

const Es = () => n(`AUR0175:${xe}`);

const Os = () => n(`AUR0176:${xe}`);

const ks = () => n(`AUR0178:${xe}`);

const Cs = () => n(`AUR0179:${xe}`);

const Ss = [ fe, pe, we, be, "$this", null, "$parent", "(", "{", ".", "..", "...", "?.", "}", ")", ",", "[", "]", ":", ";", "?", "'", '"', "&", "|", "??", "||", "&&", "==", "!=", "===", "!==", "<", ">", "<=", ">=", "in", "instanceof", "+", "-", "typeof", "void", "*", "%", "/", "=", "!", 2163759, 2163760, "of", "=>" ];

const $s = Object.assign(Object.create(null), {
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

const Rs = {
    AsciiIdPart: [ 36, 0, 48, 58, 65, 91, 95, 0, 97, 123 ],
    IdStart: [ 36, 0, 65, 91, 95, 0, 97, 123, 170, 0, 186, 0, 192, 215, 216, 247, 248, 697, 736, 741, 7424, 7462, 7468, 7517, 7522, 7526, 7531, 7544, 7545, 7615, 7680, 7936, 8305, 0, 8319, 0, 8336, 8349, 8490, 8492, 8498, 0, 8526, 0, 8544, 8585, 11360, 11392, 42786, 42888, 42891, 42927, 42928, 42936, 42999, 43008, 43824, 43867, 43868, 43877, 64256, 64263, 65313, 65339, 65345, 65371 ],
    Digit: [ 48, 58 ],
    Skip: [ 0, 33, 127, 161 ]
};

const Us = (t, e, s, r) => {
    const i = s.length;
    for (let n = 0; n < i; n += 2) {
        const i = s[n];
        let o = s[n + 1];
        o = o > 0 ? o : i + 1;
        if (t) t.fill(r, i, o);
        if (e) for (let t = i; t < o; t++) e.add(t);
    }
};

const Ls = t => () => {
    Je();
    return t;
};

const Ps = new Set;

Us(null, Ps, Rs.AsciiIdPart, true);

const _s = new Uint8Array(65535);

Us(_s, null, Rs.IdStart, 1);

Us(_s, null, Rs.Digit, 1);

const Is = new Array(65535);

Is.fill(vs, 0, 65535);

Us(Is, null, Rs.Skip, (() => {
    Je();
    return null;
}));

Us(Is, null, Rs.IdStart, Ge);

Us(Is, null, Rs.Digit, (() => He(false)));

Is[34] = Is[39] = () => Qe();

Is[96] = () => Xe();

Is[33] = () => {
    if (61 !== Je()) return 131118;
    if (61 !== Je()) return 6553949;
    Je();
    return 6553951;
};

Is[61] = () => {
    if (62 === Je()) {
        Je();
        return 50;
    }
    if (61 !== ke) return 4194349;
    if (61 !== Je()) return 6553948;
    Je();
    return 6553950;
};

Is[38] = () => {
    if (38 !== Je()) return 6291479;
    Je();
    return 6553883;
};

Is[124] = () => {
    if (124 !== Je()) return 6291480;
    Je();
    return 6553818;
};

Is[63] = () => {
    if (46 === Je()) {
        const t = Ue(ge + 1);
        if (t <= 48 || t >= 57) {
            Je();
            return 2162700;
        }
        return 6291478;
    }
    if (63 !== ke) return 6291478;
    Je();
    return 6553753;
};

Is[46] = () => {
    if (Je() <= 57 && ke >= 48) return He(true);
    if (46 === ke) {
        if (46 !== Je()) return 10;
        Je();
        return 11;
    }
    return 65545;
};

Is[60] = () => {
    if (61 !== Je()) return 6554016;
    Je();
    return 6554018;
};

Is[62] = () => {
    if (61 !== Je()) return 6554017;
    Je();
    return 6554019;
};

Is[37] = Ls(6554155);

Is[40] = Ls(2688007);

Is[41] = Ls(7340046);

Is[42] = Ls(6554154);

Is[43] = Ls(2490854);

Is[44] = Ls(6291471);

Is[45] = Ls(2490855);

Is[47] = Ls(6554156);

Is[58] = Ls(6291476);

Is[59] = Ls(6291477);

Is[91] = Ls(2688016);

Is[93] = Ls(7340051);

Is[123] = Ls(524296);

Is[125] = Ls(7340045);

let Ms = null;

const Bs = [];

let js = false;

function Ts() {
    js = false;
}

function Ds() {
    js = true;
}

function Vs() {
    return Ms;
}

function Fs(t) {
    if (null == t) throw n(`AUR0206`);
    if (null == Ms) {
        Ms = t;
        Bs[0] = Ms;
        js = true;
        return;
    }
    if (Ms === t) throw n(`AUR0207`);
    Bs.push(t);
    Ms = t;
    js = true;
}

function Ns(t) {
    if (null == t) throw n(`AUR0208`);
    if (Ms !== t) throw n(`AUR0209`);
    Bs.pop();
    Ms = Bs.length > 0 ? Bs[Bs.length - 1] : null;
    js = null != Ms;
}

const zs = Object.freeze({
    get current() {
        return Ms;
    },
    get connecting() {
        return js;
    },
    enter: Fs,
    exit: Ns,
    pause: Ts,
    resume: Ds
});

const Ks = Reflect.get;

const Ws = Object.prototype.toString;

const qs = new WeakMap;

function Js(t) {
    switch (Ws.call(t)) {
      case "[object Object]":
      case "[object Array]":
      case "[object Map]":
      case "[object Set]":
        return true;

      default:
        return false;
    }
}

const Gs = "__raw__";

function Hs(t) {
    return Js(t) ? Qs(t) : t;
}

function Qs(t) {
    return qs.get(t) ?? tr(t);
}

function Xs(t) {
    return t[Gs] ?? t;
}

function Ys(t) {
    return Js(t) && t[Gs] || t;
}

function Zs(t) {
    return "constructor" === t || "__proto__" === t || "$observers" === t || t === Symbol.toPrimitive || t === Symbol.toStringTag;
}

function tr(t) {
    const e = h(t) ? sr : l(t) || a(t) ? kr : er;
    const s = new Proxy(t, e);
    qs.set(t, s);
    return s;
}

const er = {
    get(t, e, s) {
        if (e === Gs) return t;
        const r = Vs();
        if (!js || Zs(e) || null == r) return Ks(t, e, s);
        r.observe(t, e);
        return Hs(Ks(t, e, s));
    }
};

const sr = {
    get(t, e, s) {
        if (e === Gs) return t;
        if (!js || Zs(e) || null == Ms) return Ks(t, e, s);
        switch (e) {
          case "length":
            Ms.observe(t, "length");
            return t.length;

          case "map":
            return rr;

          case "includes":
            return or;

          case "indexOf":
            return cr;

          case "lastIndexOf":
            return ur;

          case "every":
            return ir;

          case "filter":
            return nr;

          case "find":
            return ar;

          case "findIndex":
            return hr;

          case "flat":
            return lr;

          case "flatMap":
            return fr;

          case "join":
            return pr;

          case "push":
            return br;

          case "pop":
            return wr;

          case "reduce":
            return Er;

          case "reduceRight":
            return Or;

          case "reverse":
            return gr;

          case "shift":
            return dr;

          case "unshift":
            return vr;

          case "slice":
            return mr;

          case "splice":
            return xr;

          case "some":
            return Ar;

          case "sort":
            return yr;

          case "keys":
            return _r;

          case "values":
          case Symbol.iterator:
            return Ir;

          case "entries":
            return Mr;
        }
        Ms.observe(t, e);
        return Hs(Ks(t, e, s));
    },
    ownKeys(t) {
        Vs()?.observe(t, "length");
        return Reflect.ownKeys(t);
    }
};

function rr(t, e) {
    const s = Xs(this);
    const r = s.map(((s, r) => Ys(t.call(e, Hs(s), r, this))));
    Br(Ms, s);
    return Hs(r);
}

function ir(t, e) {
    const s = Xs(this);
    const r = s.every(((s, r) => t.call(e, Hs(s), r, this)));
    Br(Ms, s);
    return r;
}

function nr(t, e) {
    const s = Xs(this);
    const r = s.filter(((s, r) => Ys(t.call(e, Hs(s), r, this))));
    Br(Ms, s);
    return Hs(r);
}

function or(t) {
    const e = Xs(this);
    const s = e.includes(Ys(t));
    Br(Ms, e);
    return s;
}

function cr(t) {
    const e = Xs(this);
    const s = e.indexOf(Ys(t));
    Br(Ms, e);
    return s;
}

function ur(t) {
    const e = Xs(this);
    const s = e.lastIndexOf(Ys(t));
    Br(Ms, e);
    return s;
}

function hr(t, e) {
    const s = Xs(this);
    const r = s.findIndex(((s, r) => Ys(t.call(e, Hs(s), r, this))));
    Br(Ms, s);
    return r;
}

function ar(t, e) {
    const s = Xs(this);
    const r = s.find(((e, s) => t(Hs(e), s, this)), e);
    Br(Ms, s);
    return Hs(r);
}

function lr() {
    const t = Xs(this);
    Br(Ms, t);
    return Hs(t.flat());
}

function fr(t, e) {
    const s = Xs(this);
    Br(Ms, s);
    return Qs(s.flatMap(((s, r) => Hs(t.call(e, Hs(s), r, this)))));
}

function pr(t) {
    const e = Xs(this);
    Br(Ms, e);
    return e.join(t);
}

function wr() {
    return Hs(Xs(this).pop());
}

function br(...t) {
    return Xs(this).push(...t);
}

function dr() {
    return Hs(Xs(this).shift());
}

function vr(...t) {
    return Xs(this).unshift(...t);
}

function xr(...t) {
    return Hs(Xs(this).splice(...t));
}

function gr(...t) {
    const e = Xs(this);
    const s = e.reverse();
    Br(Ms, e);
    return Hs(s);
}

function Ar(t, e) {
    const s = Xs(this);
    const r = s.some(((s, r) => Ys(t.call(e, Hs(s), r, this))));
    Br(Ms, s);
    return r;
}

function yr(t) {
    const e = Xs(this);
    const s = e.sort(t);
    Br(Ms, e);
    return Hs(s);
}

function mr(t, e) {
    const s = Xs(this);
    Br(Ms, s);
    return Qs(s.slice(t, e));
}

function Er(t, e) {
    const s = Xs(this);
    const r = s.reduce(((e, s, r) => t(e, Hs(s), r, this)), e);
    Br(Ms, s);
    return Hs(r);
}

function Or(t, e) {
    const s = Xs(this);
    const r = s.reduceRight(((e, s, r) => t(e, Hs(s), r, this)), e);
    Br(Ms, s);
    return Hs(r);
}

const kr = {
    get(t, e, s) {
        if (e === Gs) return t;
        const r = Vs();
        if (!js || Zs(e) || null == r) return Ks(t, e, s);
        switch (e) {
          case "size":
            r.observe(t, "size");
            return t.size;

          case "clear":
            return Lr;

          case "delete":
            return Pr;

          case "forEach":
            return Cr;

          case "add":
            if (a(t)) return Ur;
            break;

          case "get":
            if (l(t)) return $r;
            break;

          case "set":
            if (l(t)) return Rr;
            break;

          case "has":
            return Sr;

          case "keys":
            return _r;

          case "values":
            return Ir;

          case "entries":
            return Mr;

          case Symbol.iterator:
            return l(t) ? Mr : Ir;
        }
        return Hs(Ks(t, e, s));
    }
};

function Cr(t, e) {
    const s = Xs(this);
    Br(Ms, s);
    return s.forEach(((s, r) => {
        t.call(e, Hs(s), Hs(r), this);
    }));
}

function Sr(t) {
    const e = Xs(this);
    Br(Ms, e);
    return e.has(Ys(t));
}

function $r(t) {
    const e = Xs(this);
    Br(Ms, e);
    return Hs(e.get(Ys(t)));
}

function Rr(t, e) {
    return Hs(Xs(this).set(Ys(t), Ys(e)));
}

function Ur(t) {
    return Hs(Xs(this).add(Ys(t)));
}

function Lr() {
    return Hs(Xs(this).clear());
}

function Pr(t) {
    return Hs(Xs(this).delete(Ys(t)));
}

function _r() {
    const t = Xs(this);
    Br(Ms, t);
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
                value: Hs(s),
                done: r
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

function Ir() {
    const t = Xs(this);
    Br(Ms, t);
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
                value: Hs(s),
                done: r
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

function Mr() {
    const t = Xs(this);
    Br(Ms, t);
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
                value: [ Hs(s[0]), Hs(s[1]) ],
                done: r
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

const Br = (t, e) => t?.observeCollection(e);

const jr = Object.freeze({
    getProxy: Qs,
    getRaw: Xs,
    wrap: Hs,
    unwrap: Ys,
    rawKey: Gs
});

class ComputedObserver {
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
    static create(t, e, s, r, n) {
        const o = s.get;
        const c = s.set;
        const u = new ComputedObserver(t, o, c, n, r);
        const h = () => u.getValue();
        h.getObserver = () => u;
        i(t, e, {
            enumerable: s.enumerable,
            configurable: true,
            get: h,
            set: t => {
                u.setValue(t);
            }
        });
        return u;
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
        if (o(this.$set)) {
            if (t !== this.v) {
                this.ir = true;
                this.$set.call(this.o, t);
                this.ir = false;
                this.run();
            }
        } else throw n(`AUR0221`);
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
        if (!f(e, t)) {
            this.ov = t;
            Tr = this.ov;
            this.ov = this.v;
            this.subs.notify(this.v, Tr);
        }
    }
    compute() {
        this.ir = true;
        this.obs.version++;
        try {
            Fs(this);
            return this.v = Ys(this.$get.call(this.up ? Hs(this.o) : this.o, this));
        } finally {
            this.obs.clear();
            this.ir = false;
            Ns(this);
        }
    }
}

he(ComputedObserver);

W(ComputedObserver);

let Tr;

const Dr = d("IDirtyChecker", (t => t.singleton(DirtyChecker)));

const Vr = {
    timeoutsPerCheck: 25,
    disabled: false,
    throw: false,
    resetToDefault() {
        this.timeoutsPerCheck = 6;
        this.disabled = false;
        this.throw = false;
    }
};

const Fr = {
    persistent: true
};

class DirtyChecker {
    constructor(t) {
        this.p = t;
        this.tracked = [];
        this.A = null;
        this.O = 0;
        this.check = () => {
            if (Vr.disabled) return;
            if (++this.O < Vr.timeoutsPerCheck) return;
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
        if (Vr.throw) throw n(`AUR0222:${b(e)}`);
        return new DirtyCheckProperty(this, t, e);
    }
    addProperty(t) {
        this.tracked.push(t);
        if (1 === this.tracked.length) this.A = this.p.taskQueue.queueTask(this.check, Fr);
    }
    removeProperty(t) {
        this.tracked.splice(this.tracked.indexOf(t), 1);
        if (0 === this.tracked.length) {
            this.A.cancel();
            this.A = null;
        }
    }
}

DirtyChecker.inject = [ t.IPlatform ];

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
        throw n(`Trying to set value for property ${b(this.key)} in dirty checker`);
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

W(DirtyCheckProperty);

class PrimitiveObserver {
    constructor(t, e) {
        this.type = 0;
        this.o = t;
        this.k = e;
    }
    get doNotCache() {
        return true;
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
            if (f(t, this.v)) return;
            Nr = this.v;
            this.v = t;
            this.subs.notify(t, Nr);
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
            i(this.o, this.k, {
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

class SetterNotifier {
    constructor(t, e, s, r) {
        this.type = 1;
        this.v = void 0;
        this.ov = void 0;
        this.o = t;
        this.S = s;
        this.hs = o(s);
        const i = t[e];
        this.cb = o(i) ? i : void 0;
        this.v = r;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (this.hs) t = this.S(t, null);
        if (!f(t, this.v)) {
            this.ov = this.v;
            this.v = t;
            this.cb?.call(this.o, this.v, this.ov);
            Nr = this.ov;
            this.ov = this.v;
            this.subs.notify(this.v, Nr);
        }
    }
}

W(SetterObserver);

W(SetterNotifier);

let Nr;

const zr = new PropertyAccessor;

const Kr = d("IObserverLocator", (t => t.singleton(ObserverLocator)));

const Wr = d("INodeObserverLocator", (t => t.cachedCallback((t => new DefaultNodeObserverLocator))));

class DefaultNodeObserverLocator {
    handles() {
        return false;
    }
    getObserver() {
        return zr;
    }
    getAccessor() {
        return zr;
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
        if (null == t) throw Qr(e);
        if (!u(t)) return new PrimitiveObserver(t, e);
        const s = Hr(t);
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
        return zr;
    }
    getArrayObserver(t) {
        return At(t);
    }
    getMapObserver(t) {
        return Zt(t);
    }
    getSetObserver(t) {
        return Tt(t);
    }
    createObserver(e, s) {
        if (this.R.handles(e, s, this)) return this.R.getObserver(e, s, this);
        switch (s) {
          case "length":
            if (h(e)) return At(e).getLengthObserver();
            break;

          case "size":
            if (l(e)) return Zt(e).getLengthObserver(); else if (a(e)) return Tt(e).getLengthObserver();
            break;

          default:
            if (h(e) && t.isArrayIndex(s)) return At(e).getIndexObserver(Number(s));
            break;
        }
        let i = Gr(e, s);
        if (void 0 === i) {
            let t = Jr(e);
            while (null !== t) {
                i = Gr(t, s);
                if (void 0 === i) t = Jr(t); else break;
            }
        }
        if (void 0 !== i && !r.call(i, "value")) {
            let t = this.U(e, s, i);
            if (null == t) t = (i.get?.getObserver ?? i.set?.getObserver)?.(e, this);
            return null == t ? i.configurable ? ComputedObserver.create(e, s, i, this, true) : this.C.createProperty(e, s) : t;
        }
        return new SetterObserver(e, s);
    }
    U(t, e, s) {
        if (this.$.length > 0) for (const r of this.$) {
            const i = r.getObserver(t, e, s, this);
            if (null != i) return i;
        }
        return null;
    }
}

ObserverLocator.inject = [ Dr, Wr ];

const qr = t => {
    let e;
    if (h(t)) e = At(t); else if (l(t)) e = Zt(t); else if (a(t)) e = Tt(t);
    return e;
};

const Jr = Object.getPrototypeOf;

const Gr = Object.getOwnPropertyDescriptor;

const Hr = t => {
    let e = t.$observers;
    if (void 0 === e) i(t, "$observers", {
        enumerable: false,
        value: e = v()
    });
    return e;
};

const Qr = t => n(`AUR0199:${b(t)}`);

const Xr = d("IObservation", (t => t.singleton(Observation)));

class Observation {
    constructor(t) {
        this.oL = t;
    }
    static get inject() {
        return [ Kr ];
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
        if (this.stopped) throw n(`AUR0225`);
        if (this.running) return;
        ++this.runCount;
        this.running = true;
        this.queued = false;
        ++this.obs.version;
        try {
            Fs(this);
            this.fn(this);
        } finally {
            this.obs.clear();
            this.running = false;
            Ns(this);
        }
        if (this.queued) {
            if (this.runCount > this.maxRunCount) {
                this.runCount = 0;
                throw n(`AUR0226`);
            }
            this.run();
        } else this.runCount = 0;
    }
    stop() {
        this.stopped = true;
        this.obs.clearAll();
    }
}

he(Effect);

function Yr(t) {
    if (void 0 === t.$observers) i(t, "$observers", {
        value: {}
    });
    return t.$observers;
}

const Zr = {};

function ti(t, e, s) {
    if (null == e) return (e, s, i) => r(e, s, i, t);
    return r(t, e, s);
    function r(t, e, s, r) {
        const o = void 0 === e;
        r = "object" !== typeof r ? {
            name: r
        } : r || {};
        if (o) e = r.name;
        if (null == e || "" === e) throw n(`AUR0224`);
        const c = r.callback || `${b(e)}Changed`;
        let u = Zr;
        if (s) {
            delete s.value;
            delete s.writable;
            u = s.initializer?.();
            delete s.initializer;
        } else s = {
            configurable: true
        };
        if (!("enumerable" in s)) s.enumerable = true;
        const h = r.set;
        s.get = function t() {
            const s = ei(this, e, c, u, h);
            Vs()?.subscribeTo(s);
            return s.getValue();
        };
        s.set = function t(s) {
            ei(this, e, c, u, h).setValue(s);
        };
        s.get.getObserver = function t(s) {
            return ei(s, e, c, u, h);
        };
        if (o) i(t.prototype, e, s); else return s;
    }
}

function ei(t, e, s, r, i) {
    const n = Yr(t);
    let o = n[e];
    if (null == o) {
        o = new SetterNotifier(t, s, i, r === Zr ? void 0 : r);
        n[e] = o;
    }
    return o;
}

const si = d("ISignaler", (t => t.singleton(Signaler)));

class Signaler {
    constructor() {
        this.signals = v();
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

exports.AccessKeyedExpression = AccessKeyedExpression;

exports.AccessMemberExpression = AccessMemberExpression;

exports.AccessScopeExpression = AccessScopeExpression;

exports.AccessThisExpression = AccessThisExpression;

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

exports.ConnectableSwitcher = zs;

exports.CustomExpression = CustomExpression;

exports.DestructuringAssignmentExpression = DestructuringAssignmentExpression;

exports.DestructuringAssignmentRestExpression = DestructuringAssignmentRestExpression;

exports.DestructuringAssignmentSingleExpression = DestructuringAssignmentSingleExpression;

exports.DirtyCheckProperty = DirtyCheckProperty;

exports.DirtyCheckSettings = Vr;

exports.ForOfStatement = ForOfStatement;

exports.ICoercionConfiguration = M;

exports.IDirtyChecker = Dr;

exports.IExpressionParser = ae;

exports.INodeObserverLocator = Wr;

exports.IObservation = Xr;

exports.IObserverLocator = Kr;

exports.ISignaler = si;

exports.Interpolation = Interpolation;

exports.MapObserver = MapObserver;

exports.ObjectBindingPattern = ObjectBindingPattern;

exports.ObjectLiteralExpression = ObjectLiteralExpression;

exports.Observation = Observation;

exports.ObserverLocator = ObserverLocator;

exports.PrimitiveLiteralExpression = PrimitiveLiteralExpression;

exports.PrimitiveObserver = PrimitiveObserver;

exports.PropertyAccessor = PropertyAccessor;

exports.ProxyObservable = jr;

exports.Scope = Scope;

exports.SetObserver = SetObserver;

exports.SetterObserver = SetterObserver;

exports.SubscriberRecord = SubscriberRecord;

exports.TaggedTemplateExpression = TaggedTemplateExpression;

exports.TemplateExpression = TemplateExpression;

exports.UnaryExpression = UnaryExpression;

exports.Unparser = Unparser;

exports.ValueConverterExpression = ValueConverterExpression;

exports.applyMutationsToIndices = mt;

exports.astAssign = k;

exports.astBind = C;

exports.astEvaluate = O;

exports.astUnbind = S;

exports.astVisit = A;

exports.batch = N;

exports.cloneIndexMap = T;

exports.connectable = he;

exports.copyIndexMap = B;

exports.createIndexMap = j;

exports.disableArrayObservation = gt;

exports.disableMapObservation = Yt;

exports.disableSetObservation = jt;

exports.enableArrayObservation = xt;

exports.enableMapObservation = Xt;

exports.enableSetObservation = Bt;

exports.getCollectionObserver = qr;

exports.getObserverLookup = Hr;

exports.isIndexMap = D;

exports.observable = ti;

exports.parseExpression = Pe;

exports.subscriberCollection = W;

exports.synchronizeIndices = Et;
//# sourceMappingURL=index.cjs.map
