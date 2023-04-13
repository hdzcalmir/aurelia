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

const b = Object.assign;

const d = String;

const v = t.DI.createInterface;

const x = () => s.create(null);

const g = e.Metadata.getOwn;

e.Metadata.hasOwn;

const A = e.Metadata.define;

t.Protocol.annotation.keyFor;

t.Protocol.resource.keyFor;

t.Protocol.resource.appendTo;

const y = (t, e) => {
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
        y(t, e);
        return e.text;
    }
    visitAccessMember(t) {
        y(t.object, this);
        this.text += `${t.optional ? "?" : ""}.${t.name}`;
    }
    visitAccessKeyed(t) {
        y(t.object, this);
        this.text += `${t.optional ? "?." : ""}[`;
        y(t.key, this);
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
            y(e[t], this);
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
        y(t.body, this);
    }
    visitObjectLiteral(t) {
        const e = t.keys;
        const s = t.values;
        this.text += "{";
        for (let t = 0, r = e.length; t < r; ++t) {
            if (0 !== t) this.text += ",";
            this.text += `'${e[t]}':`;
            y(s[t], this);
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
        y(t.func, this);
        this.text += t.optional ? "?." : "";
        this.writeArgs(t.args);
        this.text += ")";
    }
    visitCallMember(t) {
        this.text += "(";
        y(t.object, this);
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
            y(s[t], this);
            this.text += e[t + 1];
        }
        this.text += "`";
    }
    visitTaggedTemplate(t) {
        const {cooked: e, expressions: s} = t;
        const r = s.length;
        y(t.func, this);
        this.text += "`";
        this.text += e[0];
        for (let t = 0; t < r; t++) {
            y(s[t], this);
            this.text += e[t + 1];
        }
        this.text += "`";
    }
    visitUnary(t) {
        this.text += `(${t.operation}`;
        if (t.operation.charCodeAt(0) >= 97) this.text += " ";
        y(t.expression, this);
        this.text += ")";
    }
    visitBinary(t) {
        this.text += "(";
        y(t.left, this);
        if (105 === t.operation.charCodeAt(0)) this.text += ` ${t.operation} `; else this.text += t.operation;
        y(t.right, this);
        this.text += ")";
    }
    visitConditional(t) {
        this.text += "(";
        y(t.condition, this);
        this.text += "?";
        y(t.yes, this);
        this.text += ":";
        y(t.no, this);
        this.text += ")";
    }
    visitAssign(t) {
        this.text += "(";
        y(t.target, this);
        this.text += "=";
        y(t.value, this);
        this.text += ")";
    }
    visitValueConverter(t) {
        const e = t.args;
        y(t.expression, this);
        this.text += `|${t.name}`;
        for (let t = 0, s = e.length; t < s; ++t) {
            this.text += ":";
            y(e[t], this);
        }
    }
    visitBindingBehavior(t) {
        const e = t.args;
        y(t.expression, this);
        this.text += `&${t.name}`;
        for (let t = 0, s = e.length; t < s; ++t) {
            this.text += ":";
            y(e[t], this);
        }
    }
    visitArrayBindingPattern(t) {
        const e = t.elements;
        this.text += "[";
        for (let t = 0, s = e.length; t < s; ++t) {
            if (0 !== t) this.text += ",";
            y(e[t], this);
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
            y(s[t], this);
        }
        this.text += "}";
    }
    visitBindingIdentifier(t) {
        this.text += t.name;
    }
    visitForOfStatement(t) {
        y(t.declaration, this);
        this.text += " of ";
        y(t.iterable, this);
    }
    visitInterpolation(t) {
        const {parts: e, expressions: s} = t;
        const r = s.length;
        this.text += "${";
        this.text += e[0];
        for (let t = 0; t < r; t++) {
            y(s[t], this);
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
                y(o, this);
                break;

              case 24:
              case 25:
                {
                    const t = o.source;
                    if (t) {
                        y(t, this);
                        this.text += ":";
                    }
                    y(o, this);
                    break;
                }
            }
        }
        this.text += s ? "}" : "]";
    }
    visitDestructuringAssignmentSingleExpression(t) {
        y(t.source, this);
        this.text += ":";
        y(t.target, this);
        const e = t.initializer;
        if (void 0 !== e) {
            this.text += "=";
            y(e, this);
        }
    }
    visitDestructuringAssignmentRestExpression(t) {
        this.text += "...";
        y(t.target, this);
    }
    visitCustom(t) {
        this.text += d(t.value);
    }
    writeArgs(t) {
        this.text += "(";
        for (let e = 0, s = t.length; e < s; ++e) {
            if (0 !== e) this.text += ",";
            y(t[e], this);
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
        if (null == t) throw m();
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
        if (null == t) throw E();
        return new Scope(null, t, null == e ? new OverrideContext : e, s ?? false);
    }
    static fromParent(t, e) {
        if (null == t) throw m();
        return new Scope(t, e, new OverrideContext, false);
    }
}

const m = () => n(`AUR0203`);

const E = () => n("AUR0204");

class OverrideContext {}

const O = Scope.getContext;

function k(t, e, s, r) {
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
            const i = O(e, t.name, t.ancestor);
            if (null !== r) r.observe(i, t.name);
            const c = i[t.name];
            if (null == c && "$host" === t.name) throw n(`AUR0105`);
            if (s?.strict) return s?.boundFn && o(c) ? c.bind(i) : c;
            return null == c ? "" : s?.boundFn && o(c) ? c.bind(i) : c;
        }

      case 2:
        return t.elements.map((t => k(t, e, s, r)));

      case 3:
        {
            const i = {};
            for (let n = 0; n < t.keys.length; ++n) i[t.keys[n]] = k(t.values[n], e, s, r);
            return i;
        }

      case 4:
        return t.value;

      case 5:
        {
            let i = t.cooked[0];
            for (let n = 0; n < t.expressions.length; ++n) {
                i += String(k(t.expressions[n], e, s, r));
                i += t.cooked[n + 1];
            }
            return i;
        }

      case 6:
        switch (t.operation) {
          case "void":
            return void k(t.expression, e, s, r);

          case "typeof":
            return typeof k(t.expression, e, s, r);

          case "!":
            return !k(t.expression, e, s, r);

          case "-":
            return -k(t.expression, e, s, r);

          case "+":
            return +k(t.expression, e, s, r);

          default:
            throw n(`AUR0109:${t.operation}`);
        }

      case 7:
        {
            const i = t.args.map((t => k(t, e, s, r)));
            const n = O(e, t.name, t.ancestor);
            const o = L(s?.strictFnCall, n, t.name);
            if (o) return o.apply(n, i);
            return;
        }

      case 8:
        {
            const i = k(t.object, e, s, r);
            const n = t.args.map((t => k(t, e, s, r)));
            const o = L(s?.strictFnCall, i, t.name);
            let c;
            if (o) {
                c = o.apply(i, n);
                if (h(i) && M.includes(t.name)) r?.observeCollection(i);
            }
            return c;
        }

      case 9:
        {
            const i = k(t.func, e, s, r);
            if (o(i)) return i(...t.args.map((t => k(t, e, s, r))));
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
                return k(t.body, h, s, r);
            };
            return i;
        }

      case 10:
        {
            const i = k(t.object, e, s, r);
            let n;
            if (s?.strict) {
                if (null == i) return;
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
            const i = k(t.object, e, s, r);
            const n = k(t.key, e, s, r);
            if (u(i)) {
                if (null !== r) r.observe(i, n);
                return i[n];
            }
            return null == i ? void 0 : i[n];
        }

      case 12:
        {
            const i = t.expressions.map((t => k(t, e, s, r)));
            const c = k(t.func, e, s, r);
            if (!o(c)) throw n(`AUR0110`);
            return c(t.cooked, ...i);
        }

      case 13:
        {
            const i = t.left;
            const c = t.right;
            switch (t.operation) {
              case "&&":
                return k(i, e, s, r) && k(c, e, s, r);

              case "||":
                return k(i, e, s, r) || k(c, e, s, r);

              case "??":
                return k(i, e, s, r) ?? k(c, e, s, r);

              case "==":
                return k(i, e, s, r) == k(c, e, s, r);

              case "===":
                return k(i, e, s, r) === k(c, e, s, r);

              case "!=":
                return k(i, e, s, r) != k(c, e, s, r);

              case "!==":
                return k(i, e, s, r) !== k(c, e, s, r);

              case "instanceof":
                {
                    const t = k(c, e, s, r);
                    if (o(t)) return k(i, e, s, r) instanceof t;
                    return false;
                }

              case "in":
                {
                    const t = k(c, e, s, r);
                    if (u(t)) return k(i, e, s, r) in t;
                    return false;
                }

              case "+":
                {
                    const t = k(i, e, s, r);
                    const n = k(c, e, s, r);
                    if (s?.strict) return t + n;
                    if (!t || !n) {
                        if (P(t) || P(n)) return (t || 0) + (n || 0);
                        if (I(t) || I(n)) return (t || "") + (n || "");
                    }
                    return t + n;
                }

              case "-":
                return k(i, e, s, r) - k(c, e, s, r);

              case "*":
                return k(i, e, s, r) * k(c, e, s, r);

              case "/":
                return k(i, e, s, r) / k(c, e, s, r);

              case "%":
                return k(i, e, s, r) % k(c, e, s, r);

              case "<":
                return k(i, e, s, r) < k(c, e, s, r);

              case ">":
                return k(i, e, s, r) > k(c, e, s, r);

              case "<=":
                return k(i, e, s, r) <= k(c, e, s, r);

              case ">=":
                return k(i, e, s, r) >= k(c, e, s, r);

              default:
                throw n(`AUR0108:${t.operation}`);
            }
        }

      case 14:
        return k(t.condition, e, s, r) ? k(t.yes, e, s, r) : k(t.no, e, s, r);

      case 15:
        return C(t.target, e, s, k(t.value, e, s, r));

      case 17:
        {
            const i = s?.getConverter?.(t.name);
            if (null == i) throw n(`AUR0103:${t.name}`);
            if ("toView" in i) return i.toView(k(t.expression, e, s, r), ...t.args.map((t => k(t, e, s, r))));
            return k(t.expression, e, s, r);
        }

      case 18:
        return k(t.expression, e, s, r);

      case 21:
        return t.name;

      case 22:
        return k(t.iterable, e, s, r);

      case 23:
        if (t.isMulti) {
            let i = t.parts[0];
            let n = 0;
            for (;n < t.expressions.length; ++n) {
                i += d(k(t.expressions[n], e, s, r));
                i += t.parts[n + 1];
            }
            return i;
        } else return `${t.parts[0]}${k(t.firstExpression, e, s, r)}${t.parts[1]}`;

      case 26:
        return k(t.target, e, s, r);

      case 24:
        return t.list.map((t => k(t, e, s, r)));

      case 19:
      case 20:
      case 25:
      default:
        return;

      case 28:
        return t.evaluate(e, s, r);
    }
}

function C(e, s, r, i) {
    switch (e.$kind) {
      case 1:
        {
            if ("$host" === e.name) throw n(`AUR0106`);
            const t = O(s, e.name, e.ancestor);
            return t[e.name] = i;
        }

      case 10:
        {
            const t = k(e.object, s, r, null);
            if (u(t)) if ("length" === e.name && h(t) && !isNaN(i)) t.splice(i); else t[e.name] = i; else C(e.object, s, r, {
                [e.name]: i
            });
            return i;
        }

      case 11:
        {
            const n = k(e.object, s, r, null);
            const o = k(e.key, s, r, null);
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
        C(e.value, s, r, i);
        return C(e.target, s, r, i);

      case 17:
        {
            const t = r?.getConverter?.(e.name);
            if (null == t) throw _(e.name);
            if ("fromView" in t) i = t.fromView(i, ...e.args.map((t => k(t, s, r, null))));
            return C(e.expression, s, r, i);
        }

      case 18:
        return C(e.expression, s, r, i);

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
                    C(u, s, r, i);
                    break;

                  case 24:
                  case 25:
                    {
                        if ("object" !== typeof i || null === i) throw n(`AUR0112`);
                        let t = k(u.source, Scope.create(i), r, null);
                        if (void 0 === t && u.initializer) t = k(u.initializer, s, r, null);
                        C(u, s, r, t);
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
            let t = k(e.source, Scope.create(i), r, null);
            if (void 0 === t && e.initializer) t = k(e.initializer, s, r, null);
            C(e.target, s, r, t);
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
            C(e.target, s, r, c);
        }
        break;

      case 28:
        return e.assign(s, r, i);

      default:
        return;
    }
}

function S(t, e, s) {
    switch (t.$kind) {
      case 18:
        {
            const r = t.name;
            const i = t.key;
            const n = s.getBehavior?.(r);
            if (null == n) throw R(r);
            if (void 0 === s[i]) {
                s[i] = n;
                n.bind?.(e, s, ...t.args.map((t => k(t, e, s, null))));
            } else throw U(r);
            S(t.expression, e, s);
            return;
        }

      case 17:
        {
            const r = t.name;
            const i = s.getConverter?.(r);
            if (null == i) throw _(r);
            const n = i.signals;
            if (null != n) {
                const t = s.getSignaler?.();
                const e = n.length;
                let r = 0;
                for (;r < e; ++r) t?.addSignalListener(n[r], s);
            }
            S(t.expression, e, s);
            return;
        }

      case 22:
        S(t.iterable, e, s);
        break;

      case 28:
        t.bind?.(e, s);
    }
}

function $(t, e, s) {
    switch (t.$kind) {
      case 18:
        {
            const r = t.key;
            const i = s;
            if (void 0 !== i[r]) {
                i[r].unbind?.(e, s);
                i[r] = void 0;
            }
            $(t.expression, e, s);
            break;
        }

      case 17:
        {
            const r = s.getConverter?.(t.name);
            if (void 0 === r?.signals) return;
            const i = s.getSignaler?.();
            let n = 0;
            for (;n < r.signals.length; ++n) i?.removeSignalListener(r.signals[n], s);
            $(t.expression, e, s);
            break;
        }

      case 22:
        $(t.iterable, e, s);
        break;

      case 28:
        t.unbind?.(e, s);
    }
}

const R = t => n(`AUR0101:${t}`);

const U = t => n(`AUR0102:${t}`);

const _ = t => n(`AUR0103:${t}`);

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

const I = t => {
    switch (typeof t) {
      case "string":
        return true;

      case "object":
        return t instanceof Date;

      default:
        return false;
    }
};

const M = "at map filter includes indexOf lastIndexOf findIndex find flat flatMap join reduce reduceRight slice every some sort".split(" ");

const B = t.DI.createInterface("ICoercionConfiguration");

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

function j(t, e, s) {
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

function T(t = 0) {
    const e = Array(t);
    let s = 0;
    while (s < t) e[s] = s++;
    e.deletedIndices = [];
    e.deletedItems = [];
    e.isIndexMap = true;
    return e;
}

function D(t) {
    const e = t.slice();
    e.deletedIndices = t.deletedIndices.slice();
    e.deletedItems = t.deletedItems.slice();
    e.isIndexMap = true;
    return e;
}

function V(t) {
    return h(t) && true === t.isIndexMap;
}

let F = new Map;

let N = false;

function z(t) {
    const e = F;
    const s = F = new Map;
    N = true;
    try {
        t();
    } finally {
        F = null;
        N = false;
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
            F = e;
        }
    }
}

function K(t, e, s) {
    if (!F.has(t)) F.set(t, [ 2, e, s ]);
}

function W(t, e, s) {
    const r = F.get(t);
    if (void 0 === r) F.set(t, [ 1, e, s ]); else {
        r[1] = e;
        r[2] = s;
    }
}

function q(t) {
    return null == t ? J : J(t);
}

function J(t) {
    const e = t.prototype;
    i(e, "subs", {
        get: G
    });
    w(e, "subscribe", H);
    w(e, "unsubscribe", Q);
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
        if (N) {
            W(this, t, e);
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

function G() {
    return p(this, "subs", new SubscriberRecord);
}

function H(t) {
    return this.subs.add(t);
}

function Q(t) {
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

function X(t) {
    const e = t.prototype;
    w(e, "subscribe", Y);
    w(e, "unsubscribe", Z);
    q(t);
}

function Y(t) {
    if (this.subs.add(t) && 1 === this.subs.count) this.owner.subscribe(this);
}

function Z(t) {
    if (this.subs.remove(t) && 0 === this.subs.count) this.owner.subscribe(this);
}

X(CollectionLengthObserver);

X(CollectionSizeObserver);

const tt = Symbol.for("__au_arr_obs__");

const et = Array[tt] ?? p(Array, tt, new WeakMap);

function st(t, e) {
    if (t === e) return 0;
    t = null === t ? "null" : t.toString();
    e = null === e ? "null" : e.toString();
    return t < e ? -1 : 1;
}

function rt(t, e) {
    if (void 0 === t) if (void 0 === e) return 0; else return 1;
    if (void 0 === e) return -1;
    return 0;
}

function it(t, e, s, r, i) {
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

function nt(t, e, s, r, i) {
    let n = 0, o = 0;
    let c, u, h;
    let a, l, f;
    let p, w, b;
    let d, v;
    let x, g, A, y;
    let m, E, O, k;
    while (true) {
        if (r - s <= 10) {
            it(t, e, s, r, i);
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
            nt(t, e, y, r, i);
            r = A;
        } else {
            nt(t, e, s, A, i);
            s = y;
        }
    }
}

const ot = Array.prototype;

const ct = ot.push;

const ut = ot.unshift;

const ht = ot.pop;

const at = ot.shift;

const lt = ot.splice;

const ft = ot.reverse;

const pt = ot.sort;

const wt = {
    push: ct,
    unshift: ut,
    pop: ht,
    shift: at,
    splice: lt,
    reverse: ft,
    sort: pt
};

const bt = [ "push", "unshift", "pop", "shift", "splice", "reverse", "sort" ];

const dt = {
    push: function(...t) {
        const e = et.get(this);
        if (void 0 === e) return ct.apply(this, t);
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
        const e = et.get(this);
        if (void 0 === e) return ut.apply(this, t);
        const s = t.length;
        const r = new Array(s);
        let i = 0;
        while (i < s) r[i++] = -2;
        ut.apply(e.indexMap, r);
        const n = ut.apply(this, t);
        e.notify();
        return n;
    },
    pop: function() {
        const t = et.get(this);
        if (void 0 === t) return ht.call(this);
        const e = t.indexMap;
        const s = ht.call(this);
        const r = e.length - 1;
        if (e[r] > -1) {
            e.deletedIndices.push(e[r]);
            e.deletedItems.push(s);
        }
        ht.call(e);
        t.notify();
        return s;
    },
    shift: function() {
        const t = et.get(this);
        if (void 0 === t) return at.call(this);
        const e = t.indexMap;
        const s = at.call(this);
        if (e[0] > -1) {
            e.deletedIndices.push(e[0]);
            e.deletedItems.push(s);
        }
        at.call(e);
        t.notify();
        return s;
    },
    splice: function(...t) {
        const e = t[0];
        const s = t[1];
        const r = et.get(this);
        if (void 0 === r) return lt.apply(this, t);
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
            lt.call(c, e, s, ...r);
        } else lt.apply(c, t);
        const l = lt.apply(this, t);
        if (h > 0 || a > 0) r.notify();
        return l;
    },
    reverse: function() {
        const t = et.get(this);
        if (void 0 === t) {
            ft.call(this);
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
        const e = et.get(this);
        if (void 0 === e) {
            pt.call(this, t);
            return this;
        }
        let s = this.length;
        if (s < 2) return this;
        nt(this, e.indexMap, 0, s, rt);
        let r = 0;
        while (r < s) {
            if (void 0 === this[r]) break;
            r++;
        }
        if (void 0 === t || !o(t)) t = st;
        nt(this, e.indexMap, 0, r, t);
        let i = false;
        for (r = 0, s = e.indexMap.length; s > r; ++r) if (e.indexMap[r] !== r) {
            i = true;
            break;
        }
        if (i) e.notify();
        return this;
    }
};

for (const t of bt) i(dt[t], "observing", {
    value: true,
    writable: false,
    configurable: false,
    enumerable: false
});

let vt = false;

const xt = "__au_arr_on__";

function gt() {
    if (!(g(xt, Array) ?? false)) {
        A(xt, true, Array);
        for (const t of bt) if (true !== ot[t].observing) p(ot, t, dt[t]);
    }
}

function At() {
    for (const t of bt) if (true === ot[t].observing) p(ot, t, wt[t]);
}

class ArrayObserver {
    constructor(t) {
        this.type = 18;
        if (!vt) {
            vt = true;
            gt();
        }
        this.indexObservers = {};
        this.collection = t;
        this.indexMap = T(t.length);
        this.lenObs = void 0;
        et.set(t, this);
    }
    notify() {
        const t = this.subs;
        const e = this.indexMap;
        if (N) {
            K(t, this.collection, e);
            return;
        }
        const s = this.collection;
        const r = s.length;
        this.indexMap = T(r);
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

q(ArrayObserver);

q(ArrayIndexObserver);

function yt(t) {
    let e = et.get(t);
    if (void 0 === e) e = new ArrayObserver(t);
    return e;
}

const mt = (t, e) => t - e;

function Et(t) {
    let e = 0;
    let s = 0;
    let r = 0;
    const i = D(t);
    if (i.deletedIndices.length > 1) i.deletedIndices.sort(mt);
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

function Ot(t, e) {
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

const kt = Symbol.for("__au_set_obs__");

const Ct = Set[kt] ?? p(Set, kt, new WeakMap);

const St = Set.prototype;

const $t = St.add;

const Rt = St.clear;

const Ut = St.delete;

const _t = {
    add: $t,
    clear: Rt,
    delete: Ut
};

const Lt = [ "add", "clear", "delete" ];

const Pt = {
    add: function(t) {
        const e = Ct.get(this);
        if (void 0 === e) {
            $t.call(this, t);
            return this;
        }
        const s = this.size;
        $t.call(this, t);
        const r = this.size;
        if (r === s) return this;
        e.indexMap[s] = -2;
        e.notify();
        return this;
    },
    clear: function() {
        const t = Ct.get(this);
        if (void 0 === t) return Rt.call(this);
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
            Rt.call(this);
            e.length = 0;
            t.notify();
        }
        return;
    },
    delete: function(t) {
        const e = Ct.get(this);
        if (void 0 === e) return Ut.call(this, t);
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
                const n = Ut.call(this, t);
                if (true === n) e.notify();
                return n;
            }
            r++;
        }
        return false;
    }
};

const It = {
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

let Mt = false;

const Bt = "__au_set_on__";

function jt() {
    if (!(g(Bt, Set) ?? false)) {
        A(Bt, true, Set);
        for (const t of Lt) if (true !== St[t].observing) i(St, t, {
            ...It,
            value: Pt[t]
        });
    }
}

function Tt() {
    for (const t of Lt) if (true === St[t].observing) i(St, t, {
        ...It,
        value: _t[t]
    });
}

class SetObserver {
    constructor(t) {
        this.type = 34;
        if (!Mt) {
            Mt = true;
            jt();
        }
        this.collection = t;
        this.indexMap = T(t.size);
        this.lenObs = void 0;
        Ct.set(t, this);
    }
    notify() {
        const t = this.subs;
        const e = this.indexMap;
        if (N) {
            K(t, this.collection, e);
            return;
        }
        const s = this.collection;
        const r = s.size;
        this.indexMap = T(r);
        this.subs.notifyCollection(s, e);
    }
    getLengthObserver() {
        return this.lenObs ?? (this.lenObs = new CollectionSizeObserver(this));
    }
}

q(SetObserver);

function Dt(t) {
    let e = Ct.get(t);
    if (void 0 === e) e = new SetObserver(t);
    return e;
}

const Vt = Symbol.for("__au_map_obs__");

const Ft = Map[Vt] ?? p(Map, Vt, new WeakMap);

const Nt = Map.prototype;

const zt = Nt.set;

const Kt = Nt.clear;

const Wt = Nt.delete;

const qt = {
    set: zt,
    clear: Kt,
    delete: Wt
};

const Jt = [ "set", "clear", "delete" ];

const Gt = {
    set: function(t, e) {
        const s = Ft.get(this);
        if (void 0 === s) {
            zt.call(this, t, e);
            return this;
        }
        const r = this.get(t);
        const i = this.size;
        zt.call(this, t, e);
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
        const t = Ft.get(this);
        if (void 0 === t) return Kt.call(this);
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
            Kt.call(this);
            e.length = 0;
            t.notify();
        }
        return;
    },
    delete: function(t) {
        const e = Ft.get(this);
        if (void 0 === e) return Wt.call(this, t);
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
                const n = Wt.call(this, t);
                if (true === n) e.notify();
                return n;
            }
            ++r;
        }
        return false;
    }
};

const Ht = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const t of Jt) i(Gt[t], "observing", {
    value: true,
    writable: false,
    configurable: false,
    enumerable: false
});

let Qt = false;

const Xt = "__au_map_on__";

function Yt() {
    if (!(g(Xt, Map) ?? false)) {
        A(Xt, true, Map);
        for (const t of Jt) if (true !== Nt[t].observing) i(Nt, t, {
            ...Ht,
            value: Gt[t]
        });
    }
}

function Zt() {
    for (const t of Jt) if (true === Nt[t].observing) i(Nt, t, {
        ...Ht,
        value: qt[t]
    });
}

class MapObserver {
    constructor(t) {
        this.type = 66;
        if (!Qt) {
            Qt = true;
            Yt();
        }
        this.collection = t;
        this.indexMap = T(t.size);
        this.lenObs = void 0;
        Ft.set(t, this);
    }
    notify() {
        const t = this.subs;
        const e = this.indexMap;
        if (N) {
            K(t, this.collection, e);
            return;
        }
        const s = this.collection;
        const r = s.size;
        this.indexMap = T(r);
        t.notifyCollection(s, e);
    }
    getLengthObserver() {
        return this.lenObs ?? (this.lenObs = new CollectionSizeObserver(this));
    }
}

q(MapObserver);

function te(t) {
    let e = Ft.get(t);
    if (void 0 === e) e = new MapObserver(t);
    return e;
}

function ee() {
    return p(this, "obs", new BindingObserverRecord(this));
}

function se(t, e) {
    this.obs.add(this.oL.getObserver(t, e));
}

function re(t) {
    let e;
    if (h(t)) e = yt(t); else if (a(t)) e = Dt(t); else if (l(t)) e = te(t); else throw n(`AUR0210`);
    this.obs.add(e);
}

function ie(t) {
    this.obs.add(t);
}

function ne() {
    throw n(`AUR2011:handleChange`);
}

function oe() {
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
        this.o.forEach(ue, this);
        this.count = this.o.size;
    }
    clearAll() {
        this.o.forEach(ce, this);
        this.o.clear();
        this.count = 0;
    }
}

function ce(t, e) {
    e.unsubscribe(this.b);
}

function ue(t, e) {
    if (this.version !== t) {
        e.unsubscribe(this.b);
        this.o.delete(e);
    }
}

function he(t) {
    const e = t.prototype;
    w(e, "observe", se);
    w(e, "observeCollection", re);
    w(e, "subscribeTo", ie);
    i(e, "obs", {
        get: ee
    });
    w(e, "handleChange", ne);
    w(e, "handleCollectionChange", oe);
    return t;
}

function ae(t) {
    return null == t ? he : he(t);
}

const le = v("IExpressionParser", (t => t.singleton(ExpressionParser)));

class ExpressionParser {
    constructor() {
        this.i = x();
        this.u = x();
        this.h = x();
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
                throw us();
            }
            s = this.i[t];
            if (void 0 === s) s = this.i[t] = this.$parse(t, e);
            return s;
        }
    }
    $parse(t, e) {
        ge = t;
        Ae = 0;
        ye = t.length;
        me = 0;
        Ee = 0;
        Oe = 6291456;
        ke = "";
        Ce = _e(0);
        Se = true;
        $e = false;
        Re = -1;
        return Ie(61, void 0 === e ? 16 : e);
    }
}

function fe(t) {
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

const pe = PrimitiveLiteralExpression.$false;

const we = PrimitiveLiteralExpression.$true;

const be = PrimitiveLiteralExpression.$null;

const de = PrimitiveLiteralExpression.$undefined;

const ve = AccessThisExpression.$this;

const xe = AccessThisExpression.$parent;

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

let ge = "";

let Ae = 0;

let ye = 0;

let me = 0;

let Ee = 0;

let Oe = 6291456;

let ke = "";

let Ce;

let Se = true;

let $e = false;

let Re = -1;

const Ue = String.fromCharCode;

const _e = t => ge.charCodeAt(t);

const Le = () => ge.slice(Ee, Ae);

function Pe(t, e) {
    ge = t;
    Ae = 0;
    ye = t.length;
    me = 0;
    Ee = 0;
    Oe = 6291456;
    ke = "";
    Ce = _e(0);
    Se = true;
    $e = false;
    Re = -1;
    return Ie(61, void 0 === e ? 16 : e);
}

function Ie(t, e) {
    if (32 === e) return new CustomExpression(ge);
    if (0 === Ae) {
        if (1 & e) return Ke();
        Je();
        if (4194304 & Oe) throw ss();
    }
    Se = 513 > t;
    $e = false;
    let s = false;
    let r;
    let i = 0;
    if (131072 & Oe) {
        const t = $s[63 & Oe];
        Je();
        r = new UnaryExpression(t, Ie(514, e));
        Se = false;
    } else {
        t: switch (Oe) {
          case 12294:
            i = me;
            Se = false;
            do {
                Je();
                ++i;
                switch (Oe) {
                  case 65545:
                    Je();
                    if (0 === (12288 & Oe)) throw is();
                    break;

                  case 10:
                  case 11:
                    throw is();

                  case 2162700:
                    $e = true;
                    Je();
                    if (0 === (12288 & Oe)) {
                        r = 0 === i ? ve : 1 === i ? xe : new AccessThisExpression(i);
                        s = true;
                        break t;
                    }
                    break;

                  default:
                    if (2097152 & Oe) {
                        r = 0 === i ? ve : 1 === i ? xe : new AccessThisExpression(i);
                        break t;
                    }
                    throw ns();
                }
            } while (12294 === Oe);

          case 4096:
            {
                const t = ke;
                if (2 & e) r = new BindingIdentifier(t); else r = new AccessScopeExpression(t, i);
                Se = !$e;
                Je();
                if (ts(50)) {
                    if (524296 === Oe) throw Cs();
                    const e = $e;
                    const s = me;
                    ++me;
                    const i = Ie(62, 0);
                    $e = e;
                    me = s;
                    Se = false;
                    r = new ArrowFunction([ new BindingIdentifier(t) ], i);
                }
                break;
            }

          case 10:
            throw Ss();

          case 11:
            throw rs();

          case 12292:
            Se = false;
            Je();
            switch (me) {
              case 0:
                r = ve;
                break;

              case 1:
                r = xe;
                break;

              default:
                r = new AccessThisExpression(me);
                break;
            }
            break;

          case 2688007:
            r = Ve(e);
            break;

          case 2688016:
            r = ge.search(/\s+of\s+/) > Ae ? Me() : Fe(e);
            break;

          case 524296:
            r = ze(e);
            break;

          case 2163759:
            r = new TemplateExpression([ ke ]);
            Se = false;
            Je();
            break;

          case 2163760:
            r = We(e, r, false);
            break;

          case 16384:
          case 32768:
            r = new PrimitiveLiteralExpression(ke);
            Se = false;
            Je();
            break;

          case 8194:
          case 8195:
          case 8193:
          case 8192:
            r = $s[63 & Oe];
            Se = false;
            Je();
            break;

          default:
            if (Ae >= ye) throw os(); else throw cs();
        }
        if (2 & e) return Ne(r);
        if (514 < t) return r;
        if (10 === Oe || 11 === Oe) throw is();
        if (0 === r.$kind) switch (Oe) {
          case 2162700:
            $e = true;
            Se = false;
            Je();
            if (0 === (13312 & Oe)) throw As();
            if (12288 & Oe) {
                r = new AccessScopeExpression(ke, r.ancestor);
                Je();
            } else if (2688007 === Oe) r = new CallFunctionExpression(r, Be(), true); else if (2688016 === Oe) r = je(r, true); else throw ys();
            break;

          case 65545:
            Se = !$e;
            Je();
            if (0 === (12288 & Oe)) throw is();
            r = new AccessScopeExpression(ke, r.ancestor);
            Je();
            break;

          case 10:
          case 11:
            throw is();

          case 2688007:
            r = new CallFunctionExpression(r, Be(), s);
            break;

          case 2688016:
            r = je(r, s);
            break;

          case 2163759:
            r = qe(r);
            break;

          case 2163760:
            r = We(e, r, true);
            break;
        }
        while ((65536 & Oe) > 0) switch (Oe) {
          case 2162700:
            r = Te(r);
            break;

          case 65545:
            Je();
            if (0 === (12288 & Oe)) throw is();
            r = De(r, false);
            break;

          case 10:
          case 11:
            throw is();

          case 2688007:
            if (1 === r.$kind) r = new CallScopeExpression(r.name, Be(), r.ancestor, false); else if (10 === r.$kind) r = new CallMemberExpression(r.object, r.name, Be(), r.optional, false); else r = new CallFunctionExpression(r, Be(), false);
            break;

          case 2688016:
            r = je(r, false);
            break;

          case 2163759:
            if ($e) throw ys();
            r = qe(r);
            break;

          case 2163760:
            if ($e) throw ys();
            r = We(e, r, true);
            break;
        }
    }
    if (10 === Oe || 11 === Oe) throw is();
    if (513 < t) return r;
    while ((262144 & Oe) > 0) {
        const s = Oe;
        if ((960 & s) <= t) break;
        Je();
        r = new BinaryExpression($s[63 & s], r, Ie(960 & s, e));
        Se = false;
    }
    if (63 < t) return r;
    if (ts(6291478)) {
        const t = Ie(62, e);
        es(6291476);
        r = new ConditionalExpression(r, t, Ie(62, e));
        Se = false;
    }
    if (62 < t) return r;
    if (ts(4194349)) {
        if (!Se) throw hs();
        r = new AssignExpression(r, Ie(62, e));
    }
    if (61 < t) return r;
    while (ts(6291480)) {
        if (6291456 === Oe) throw as();
        const t = ke;
        Je();
        const s = new Array;
        while (ts(6291476)) s.push(Ie(62, e));
        r = new ValueConverterExpression(r, t, s);
    }
    while (ts(6291479)) {
        if (6291456 === Oe) throw ls();
        const t = ke;
        Je();
        const s = new Array;
        while (ts(6291476)) s.push(Ie(62, e));
        r = new BindingBehaviorExpression(r, t, s);
    }
    if (6291456 !== Oe) {
        if ((1 & e) > 0 && 7340045 === Oe) return r;
        if ((4 & e) > 0 && 6291477 === Oe) {
            if (Ae === ye) throw cs();
            Re = Ae - 1;
            return r;
        }
        if ("of" === Le()) throw fs();
        throw cs();
    }
    return r;
}

function Me() {
    const t = [];
    const e = new DestructuringAssignmentExpression(24, t, void 0, void 0);
    let s = "";
    let r = true;
    let i = 0;
    while (r) {
        Je();
        switch (Oe) {
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
            throw gs();
        }
    }
    es(7340051);
    return e;
    function n() {
        if ("" !== s) {
            t.push(new DestructuringAssignmentSingleExpression(new AccessMemberExpression(ve, s), new AccessKeyedExpression(ve, new PrimitiveLiteralExpression(i++)), void 0));
            s = "";
        } else i++;
    }
}

function Be() {
    const t = $e;
    Je();
    const e = [];
    while (7340046 !== Oe) {
        e.push(Ie(62, 0));
        if (!ts(6291471)) break;
    }
    es(7340046);
    Se = false;
    $e = t;
    return e;
}

function je(t, e) {
    const s = $e;
    Je();
    t = new AccessKeyedExpression(t, Ie(62, 0), e);
    es(7340051);
    Se = !s;
    $e = s;
    return t;
}

function Te(t) {
    $e = true;
    Se = false;
    Je();
    if (0 === (13312 & Oe)) throw As();
    if (12288 & Oe) return De(t, true);
    if (2688007 === Oe) if (1 === t.$kind) return new CallScopeExpression(t.name, Be(), t.ancestor, true); else if (10 === t.$kind) return new CallMemberExpression(t.object, t.name, Be(), t.optional, true); else return new CallFunctionExpression(t, Be(), true);
    if (2688016 === Oe) return je(t, true);
    throw ys();
}

function De(t, e) {
    const s = ke;
    switch (Oe) {
      case 2162700:
        {
            $e = true;
            Se = false;
            const r = Ae;
            const i = Ee;
            const n = Oe;
            const o = Ce;
            const c = ke;
            const u = Se;
            const h = $e;
            Je();
            if (0 === (13312 & Oe)) throw As();
            if (2688007 === Oe) return new CallMemberExpression(t, s, Be(), e, true);
            Ae = r;
            Ee = i;
            Oe = n;
            Ce = o;
            ke = c;
            Se = u;
            $e = h;
            return new AccessMemberExpression(t, s, e);
        }

      case 2688007:
        Se = false;
        return new CallMemberExpression(t, s, Be(), e, false);

      default:
        Se = !$e;
        Je();
        return new AccessMemberExpression(t, s, e);
    }
}

function Ve(t) {
    Je();
    const e = Ae;
    const s = Ee;
    const r = Oe;
    const i = Ce;
    const n = ke;
    const o = Se;
    const c = $e;
    const u = [];
    let h = 1;
    let a = false;
    t: while (true) {
        if (11 === Oe) {
            Je();
            if (4096 !== Oe) throw is();
            u.push(new BindingIdentifier(ke));
            Je();
            if (6291471 === Oe) throw ks();
            if (7340046 !== Oe) throw rs();
            Je();
            if (50 !== Oe) throw rs();
            Je();
            const t = $e;
            const e = me;
            ++me;
            const s = Ie(62, 0);
            $e = t;
            me = e;
            Se = false;
            return new ArrowFunction(u, s, true);
        }
        switch (Oe) {
          case 4096:
            u.push(new BindingIdentifier(ke));
            Je();
            break;

          case 7340046:
            Je();
            break t;

          case 524296:
          case 2688016:
            Je();
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
            Je();
            h = 2;
            break;
        }
        switch (Oe) {
          case 6291471:
            Je();
            a = true;
            if (1 === h) break;
            break t;

          case 7340046:
            Je();
            break t;

          case 4194349:
            if (1 === h) h = 3;
            break t;

          case 50:
            if (a) throw ms();
            Je();
            h = 2;
            break t;

          default:
            if (1 === h) h = 2;
            break t;
        }
    }
    if (50 === Oe) {
        if (1 === h) {
            Je();
            if (524296 === Oe) throw Cs();
            const t = $e;
            const e = me;
            ++me;
            const s = Ie(62, 0);
            $e = t;
            me = e;
            Se = false;
            return new ArrowFunction(u, s);
        }
        throw ms();
    } else if (1 === h && 0 === u.length) throw vs(50);
    if (a) switch (h) {
      case 2:
        throw ms();

      case 3:
        throw Es();

      case 4:
        throw Os();
    }
    Ae = e;
    Ee = s;
    Oe = r;
    Ce = i;
    ke = n;
    Se = o;
    $e = c;
    const l = $e;
    const f = Ie(62, t);
    $e = l;
    es(7340046);
    if (50 === Oe) switch (h) {
      case 2:
        throw ms();

      case 3:
        throw Es();

      case 4:
        throw Os();
    }
    return f;
}

function Fe(t) {
    const e = $e;
    Je();
    const s = new Array;
    while (7340051 !== Oe) if (ts(6291471)) {
        s.push(de);
        if (7340051 === Oe) break;
    } else {
        s.push(Ie(62, ~2 & t));
        if (ts(6291471)) {
            if (7340051 === Oe) break;
        } else break;
    }
    $e = e;
    es(7340051);
    if (2 & t) return new ArrayBindingPattern(s); else {
        Se = false;
        return new ArrayLiteralExpression(s);
    }
}

function Ne(t) {
    if (0 === (t.$kind & (19 | 20 | 21))) throw ps();
    if (4204593 !== Oe) throw ps();
    Je();
    const e = t;
    const s = Ie(61, 4);
    return new ForOfStatement(e, s, Re);
}

function ze(t) {
    const e = $e;
    const s = new Array;
    const r = new Array;
    Je();
    while (7340045 !== Oe) {
        s.push(ke);
        if (49152 & Oe) {
            Je();
            es(6291476);
            r.push(Ie(62, ~2 & t));
        } else if (12288 & Oe) {
            const e = Ce;
            const s = Oe;
            const i = Ae;
            Je();
            if (ts(6291476)) r.push(Ie(62, ~2 & t)); else {
                Ce = e;
                Oe = s;
                Ae = i;
                r.push(Ie(515, ~2 & t));
            }
        } else throw ws();
        if (7340045 !== Oe) es(6291471);
    }
    $e = e;
    es(7340045);
    if (2 & t) return new ObjectBindingPattern(s, r); else {
        Se = false;
        return new ObjectLiteralExpression(s, r);
    }
}

function Ke() {
    const t = [];
    const e = [];
    const s = ye;
    let r = "";
    while (Ae < s) {
        switch (Ce) {
          case 36:
            if (123 === _e(Ae + 1)) {
                t.push(r);
                r = "";
                Ae += 2;
                Ce = _e(Ae);
                Je();
                const s = Ie(61, 1);
                e.push(s);
                continue;
            } else r += "$";
            break;

          case 92:
            r += Ue(fe(Ge()));
            break;

          default:
            r += Ue(Ce);
        }
        Ge();
    }
    if (e.length) {
        t.push(r);
        return new Interpolation(t, e);
    }
    return null;
}

function We(t, e, s) {
    const r = $e;
    const i = [ ke ];
    es(2163760);
    const n = [ Ie(62, t) ];
    while (2163759 !== (Oe = Ze())) {
        i.push(ke);
        es(2163760);
        n.push(Ie(62, t));
    }
    i.push(ke);
    Se = false;
    $e = r;
    if (s) {
        Je();
        return new TaggedTemplateExpression(i, i, e, n);
    } else {
        Je();
        return new TemplateExpression(i, n);
    }
}

function qe(t) {
    Se = false;
    const e = [ ke ];
    Je();
    return new TaggedTemplateExpression(e, e, t);
}

function Je() {
    while (Ae < ye) {
        Ee = Ae;
        if (null != (Oe = Ms[Ce]())) return;
    }
    Oe = 6291456;
}

function Ge() {
    return Ce = _e(++Ae);
}

function He() {
    while (Is[Ge()]) ;
    const t = Rs[ke = Le()];
    return void 0 === t ? 4096 : t;
}

function Qe(t) {
    let e = Ce;
    if (false === t) {
        do {
            e = Ge();
        } while (e <= 57 && e >= 48);
        if (46 !== e) {
            ke = parseInt(Le(), 10);
            return 32768;
        }
        e = Ge();
        if (Ae >= ye) {
            ke = parseInt(Le().slice(0, -1), 10);
            return 32768;
        }
    }
    if (e <= 57 && e >= 48) do {
        e = Ge();
    } while (e <= 57 && e >= 48); else Ce = _e(--Ae);
    ke = parseFloat(Le());
    return 32768;
}

function Xe() {
    const t = Ce;
    Ge();
    let e = 0;
    const s = new Array;
    let r = Ae;
    while (Ce !== t) if (92 === Ce) {
        s.push(ge.slice(r, Ae));
        Ge();
        e = fe(Ce);
        Ge();
        s.push(Ue(e));
        r = Ae;
    } else if (Ae >= ye) throw bs(); else Ge();
    const i = ge.slice(r, Ae);
    Ge();
    s.push(i);
    const n = s.join("");
    ke = n;
    return 16384;
}

function Ye() {
    let t = true;
    let e = "";
    while (96 !== Ge()) if (36 === Ce) if (Ae + 1 < ye && 123 === _e(Ae + 1)) {
        Ae++;
        t = false;
        break;
    } else e += "$"; else if (92 === Ce) e += Ue(fe(Ge())); else {
        if (Ae >= ye) throw ds();
        e += Ue(Ce);
    }
    Ge();
    ke = e;
    if (t) return 2163759;
    return 2163760;
}

const Ze = () => {
    if (Ae >= ye) throw ds();
    Ae--;
    return Ye();
};

const ts = t => {
    if (Oe === t) {
        Je();
        return true;
    }
    return false;
};

const es = t => {
    if (Oe === t) Je(); else throw vs(t);
};

const ss = () => n(`AUR0151:${ge}`);

const rs = () => n(`AUR0152:${ge}`);

const is = () => n(`AUR0153:${ge}`);

const ns = () => n(`AUR0154:${ge}`);

const os = () => n(`AUR0155:${ge}`);

const cs = () => n(`AUR0156:${ge}`);

const us = () => n(`AUR0157`);

const hs = () => n(`AUR0158:${ge}`);

const as = () => n(`AUR0159:${ge}`);

const ls = () => n(`AUR0160:${ge}`);

const fs = () => n(`AUR0161:${ge}`);

const ps = () => n(`AUR0163:${ge}`);

const ws = () => n(`AUR0164:${ge}`);

const bs = () => n(`AUR0165:${ge}`);

const ds = () => n(`AUR0166:${ge}`);

const vs = t => n(`AUR0167:${ge}<${$s[63 & t]}`);

const xs = () => {
    throw n(`AUR0168:${ge}`);
};

xs.notMapped = true;

const gs = () => n(`AUR0170:${ge}`);

const As = () => n(`AUR0171:${ge}`);

const ys = () => n(`AUR0172:${ge}`);

const ms = () => n(`AUR0173:${ge}`);

const Es = () => n(`AUR0174:${ge}`);

const Os = () => n(`AUR0175:${ge}`);

const ks = () => n(`AUR0176:${ge}`);

const Cs = () => n(`AUR0178:${ge}`);

const Ss = () => n(`AUR0179:${ge}`);

const $s = [ pe, we, be, de, "$this", null, "$parent", "(", "{", ".", "..", "...", "?.", "}", ")", ",", "[", "]", ":", ";", "?", "'", '"', "&", "|", "??", "||", "&&", "==", "!=", "===", "!==", "<", ">", "<=", ">=", "in", "instanceof", "+", "-", "typeof", "void", "*", "%", "/", "=", "!", 2163759, 2163760, "of", "=>" ];

const Rs = b(Object.create(null), {
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

const Us = {
    AsciiIdPart: [ 36, 0, 48, 58, 65, 91, 95, 0, 97, 123 ],
    IdStart: [ 36, 0, 65, 91, 95, 0, 97, 123, 170, 0, 186, 0, 192, 215, 216, 247, 248, 697, 736, 741, 7424, 7462, 7468, 7517, 7522, 7526, 7531, 7544, 7545, 7615, 7680, 7936, 8305, 0, 8319, 0, 8336, 8349, 8490, 8492, 8498, 0, 8526, 0, 8544, 8585, 11360, 11392, 42786, 42888, 42891, 42927, 42928, 42936, 42999, 43008, 43824, 43867, 43868, 43877, 64256, 64263, 65313, 65339, 65345, 65371 ],
    Digit: [ 48, 58 ],
    Skip: [ 0, 33, 127, 161 ]
};

const _s = (t, e, s, r) => {
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
    Ge();
    return t;
};

const Ps = new Set;

_s(null, Ps, Us.AsciiIdPart, true);

const Is = new Uint8Array(65535);

_s(Is, null, Us.IdStart, 1);

_s(Is, null, Us.Digit, 1);

const Ms = new Array(65535);

Ms.fill(xs, 0, 65535);

_s(Ms, null, Us.Skip, (() => {
    Ge();
    return null;
}));

_s(Ms, null, Us.IdStart, He);

_s(Ms, null, Us.Digit, (() => Qe(false)));

Ms[34] = Ms[39] = () => Xe();

Ms[96] = () => Ye();

Ms[33] = () => {
    if (61 !== Ge()) return 131118;
    if (61 !== Ge()) return 6553949;
    Ge();
    return 6553951;
};

Ms[61] = () => {
    if (62 === Ge()) {
        Ge();
        return 50;
    }
    if (61 !== Ce) return 4194349;
    if (61 !== Ge()) return 6553948;
    Ge();
    return 6553950;
};

Ms[38] = () => {
    if (38 !== Ge()) return 6291479;
    Ge();
    return 6553883;
};

Ms[124] = () => {
    if (124 !== Ge()) return 6291480;
    Ge();
    return 6553818;
};

Ms[63] = () => {
    if (46 === Ge()) {
        const t = _e(Ae + 1);
        if (t <= 48 || t >= 57) {
            Ge();
            return 2162700;
        }
        return 6291478;
    }
    if (63 !== Ce) return 6291478;
    Ge();
    return 6553753;
};

Ms[46] = () => {
    if (Ge() <= 57 && Ce >= 48) return Qe(true);
    if (46 === Ce) {
        if (46 !== Ge()) return 10;
        Ge();
        return 11;
    }
    return 65545;
};

Ms[60] = () => {
    if (61 !== Ge()) return 6554016;
    Ge();
    return 6554018;
};

Ms[62] = () => {
    if (61 !== Ge()) return 6554017;
    Ge();
    return 6554019;
};

Ms[37] = Ls(6554155);

Ms[40] = Ls(2688007);

Ms[41] = Ls(7340046);

Ms[42] = Ls(6554154);

Ms[43] = Ls(2490854);

Ms[44] = Ls(6291471);

Ms[45] = Ls(2490855);

Ms[47] = Ls(6554156);

Ms[58] = Ls(6291476);

Ms[59] = Ls(6291477);

Ms[91] = Ls(2688016);

Ms[93] = Ls(7340051);

Ms[123] = Ls(524296);

Ms[125] = Ls(7340045);

let Bs = null;

const js = [];

let Ts = false;

function Ds() {
    Ts = false;
}

function Vs() {
    Ts = true;
}

function Fs() {
    return Bs;
}

function Ns(t) {
    if (null == t) throw n(`AUR0206`);
    if (null == Bs) {
        Bs = t;
        js[0] = Bs;
        Ts = true;
        return;
    }
    if (Bs === t) throw n(`AUR0207`);
    js.push(t);
    Bs = t;
    Ts = true;
}

function zs(t) {
    if (null == t) throw n(`AUR0208`);
    if (Bs !== t) throw n(`AUR0209`);
    js.pop();
    Bs = js.length > 0 ? js[js.length - 1] : null;
    Ts = null != Bs;
}

const Ks = Object.freeze({
    get current() {
        return Bs;
    },
    get connecting() {
        return Ts;
    },
    enter: Ns,
    exit: zs,
    pause: Ds,
    resume: Vs
});

const Ws = Reflect.get;

const qs = Object.prototype.toString;

const Js = new WeakMap;

const Gs = "__au_nw__";

const Hs = "__au_nw";

function Qs(t) {
    switch (qs.call(t)) {
      case "[object Object]":
        return true !== t.constructor[Gs];

      case "[object Array]":
      case "[object Map]":
      case "[object Set]":
        return true;

      default:
        return false;
    }
}

const Xs = "__raw__";

function Ys(t) {
    return Qs(t) ? Zs(t) : t;
}

function Zs(t) {
    return Js.get(t) ?? rr(t);
}

function tr(t) {
    return t[Xs] ?? t;
}

function er(t) {
    return Qs(t) && t[Xs] || t;
}

function sr(t, e) {
    return "constructor" === e || "__proto__" === e || "$observers" === e || e === Symbol.toPrimitive || e === Symbol.toStringTag || true === t.constructor[`${Hs}_${d(e)}__`];
}

function rr(t) {
    const e = h(t) ? nr : l(t) || a(t) ? $r : ir;
    const s = new Proxy(t, e);
    Js.set(t, s);
    Js.set(s, s);
    return s;
}

const ir = {
    get(t, e, s) {
        if (e === Xs) return t;
        const r = Fs();
        if (!Ts || sr(t, e) || null == r) return Ws(t, e, s);
        r.observe(t, e);
        return Ys(Ws(t, e, s));
    }
};

const nr = {
    get(t, e, s) {
        if (e === Xs) return t;
        if (!Ts || sr(t, e) || null == Bs) return Ws(t, e, s);
        switch (e) {
          case "length":
            Bs.observe(t, "length");
            return t.length;

          case "map":
            return or;

          case "includes":
            return hr;

          case "indexOf":
            return ar;

          case "lastIndexOf":
            return lr;

          case "every":
            return cr;

          case "filter":
            return ur;

          case "find":
            return pr;

          case "findIndex":
            return fr;

          case "flat":
            return wr;

          case "flatMap":
            return br;

          case "join":
            return dr;

          case "push":
            return xr;

          case "pop":
            return vr;

          case "reduce":
            return Cr;

          case "reduceRight":
            return Sr;

          case "reverse":
            return mr;

          case "shift":
            return gr;

          case "unshift":
            return Ar;

          case "slice":
            return kr;

          case "splice":
            return yr;

          case "some":
            return Er;

          case "sort":
            return Or;

          case "keys":
            return Br;

          case "values":
          case Symbol.iterator:
            return jr;

          case "entries":
            return Tr;
        }
        Bs.observe(t, e);
        return Ys(Ws(t, e, s));
    },
    ownKeys(t) {
        Fs()?.observe(t, "length");
        return Reflect.ownKeys(t);
    }
};

function or(t, e) {
    const s = tr(this);
    const r = s.map(((s, r) => er(t.call(e, Ys(s), r, this))));
    Dr(Bs, s);
    return Ys(r);
}

function cr(t, e) {
    const s = tr(this);
    const r = s.every(((s, r) => t.call(e, Ys(s), r, this)));
    Dr(Bs, s);
    return r;
}

function ur(t, e) {
    const s = tr(this);
    const r = s.filter(((s, r) => er(t.call(e, Ys(s), r, this))));
    Dr(Bs, s);
    return Ys(r);
}

function hr(t) {
    const e = tr(this);
    const s = e.includes(er(t));
    Dr(Bs, e);
    return s;
}

function ar(t) {
    const e = tr(this);
    const s = e.indexOf(er(t));
    Dr(Bs, e);
    return s;
}

function lr(t) {
    const e = tr(this);
    const s = e.lastIndexOf(er(t));
    Dr(Bs, e);
    return s;
}

function fr(t, e) {
    const s = tr(this);
    const r = s.findIndex(((s, r) => er(t.call(e, Ys(s), r, this))));
    Dr(Bs, s);
    return r;
}

function pr(t, e) {
    const s = tr(this);
    const r = s.find(((e, s) => t(Ys(e), s, this)), e);
    Dr(Bs, s);
    return Ys(r);
}

function wr() {
    const t = tr(this);
    Dr(Bs, t);
    return Ys(t.flat());
}

function br(t, e) {
    const s = tr(this);
    Dr(Bs, s);
    return Zs(s.flatMap(((s, r) => Ys(t.call(e, Ys(s), r, this)))));
}

function dr(t) {
    const e = tr(this);
    Dr(Bs, e);
    return e.join(t);
}

function vr() {
    return Ys(tr(this).pop());
}

function xr(...t) {
    return tr(this).push(...t);
}

function gr() {
    return Ys(tr(this).shift());
}

function Ar(...t) {
    return tr(this).unshift(...t);
}

function yr(...t) {
    return Ys(tr(this).splice(...t));
}

function mr(...t) {
    const e = tr(this);
    const s = e.reverse();
    Dr(Bs, e);
    return Ys(s);
}

function Er(t, e) {
    const s = tr(this);
    const r = s.some(((s, r) => er(t.call(e, Ys(s), r, this))));
    Dr(Bs, s);
    return r;
}

function Or(t) {
    const e = tr(this);
    const s = e.sort(t);
    Dr(Bs, e);
    return Ys(s);
}

function kr(t, e) {
    const s = tr(this);
    Dr(Bs, s);
    return Zs(s.slice(t, e));
}

function Cr(t, e) {
    const s = tr(this);
    const r = s.reduce(((e, s, r) => t(e, Ys(s), r, this)), e);
    Dr(Bs, s);
    return Ys(r);
}

function Sr(t, e) {
    const s = tr(this);
    const r = s.reduceRight(((e, s, r) => t(e, Ys(s), r, this)), e);
    Dr(Bs, s);
    return Ys(r);
}

const $r = {
    get(t, e, s) {
        if (e === Xs) return t;
        const r = Fs();
        if (!Ts || sr(t, e) || null == r) return Ws(t, e, s);
        switch (e) {
          case "size":
            r.observe(t, "size");
            return t.size;

          case "clear":
            return Ir;

          case "delete":
            return Mr;

          case "forEach":
            return Rr;

          case "add":
            if (a(t)) return Pr;
            break;

          case "get":
            if (l(t)) return _r;
            break;

          case "set":
            if (l(t)) return Lr;
            break;

          case "has":
            return Ur;

          case "keys":
            return Br;

          case "values":
            return jr;

          case "entries":
            return Tr;

          case Symbol.iterator:
            return l(t) ? Tr : jr;
        }
        return Ys(Ws(t, e, s));
    }
};

function Rr(t, e) {
    const s = tr(this);
    Dr(Bs, s);
    return s.forEach(((s, r) => {
        t.call(e, Ys(s), Ys(r), this);
    }));
}

function Ur(t) {
    const e = tr(this);
    Dr(Bs, e);
    return e.has(er(t));
}

function _r(t) {
    const e = tr(this);
    Dr(Bs, e);
    return Ys(e.get(er(t)));
}

function Lr(t, e) {
    return Ys(tr(this).set(er(t), er(e)));
}

function Pr(t) {
    return Ys(tr(this).add(er(t)));
}

function Ir() {
    return Ys(tr(this).clear());
}

function Mr(t) {
    return Ys(tr(this).delete(er(t)));
}

function Br() {
    const t = tr(this);
    Dr(Bs, t);
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
                value: Ys(s),
                done: r
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

function jr() {
    const t = tr(this);
    Dr(Bs, t);
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
                value: Ys(s),
                done: r
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

function Tr() {
    const t = tr(this);
    Dr(Bs, t);
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
                value: [ Ys(s[0]), Ys(s[1]) ],
                done: r
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

const Dr = (t, e) => t?.observeCollection(e);

const Vr = Object.freeze({
    getProxy: Zs,
    getRaw: tr,
    wrap: Ys,
    unwrap: er,
    rawKey: Xs
});

class ComputedObserver {
    static create(t, e, s, r, n) {
        const o = s.get;
        const c = s.set;
        const u = new ComputedObserver(t, o, c, n, r);
        i(t, e, {
            enumerable: s.enumerable,
            configurable: true,
            get: b((() => u.getValue()), {
                getObserver: () => u
            }),
            set: t => {
                u.setValue(t);
            }
        });
        return u;
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
            Fr = this.ov;
            this.ov = this.v;
            this.subs.notify(this.v, Fr);
        }
    }
    compute() {
        this.ir = true;
        this.obs.version++;
        try {
            Ns(this);
            return this.v = er(this.$get.call(this.up ? Ys(this.o) : this.o, this));
        } finally {
            this.obs.clear();
            this.ir = false;
            zs(this);
        }
    }
}

ae(ComputedObserver);

q(ComputedObserver);

let Fr;

const Nr = v("IDirtyChecker", (t => t.singleton(DirtyChecker)));

const zr = {
    timeoutsPerCheck: 25,
    disabled: false,
    throw: false,
    resetToDefault() {
        this.timeoutsPerCheck = 6;
        this.disabled = false;
        this.throw = false;
    }
};

const Kr = {
    persistent: true
};

class DirtyChecker {
    constructor(t) {
        this.p = t;
        this.tracked = [];
        this.A = null;
        this.O = 0;
        this.check = () => {
            if (zr.disabled) return;
            if (++this.O < zr.timeoutsPerCheck) return;
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
        if (zr.throw) throw n(`AUR0222:${d(e)}`);
        return new DirtyCheckProperty(this, t, e);
    }
    addProperty(t) {
        this.tracked.push(t);
        if (1 === this.tracked.length) this.A = this.p.taskQueue.queueTask(this.check, Kr);
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
        throw n(`Trying to set value for property ${d(this.key)} in dirty checker`);
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

q(DirtyCheckProperty);

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
            if (f(t, this.v)) return;
            Wr = this.v;
            this.v = t;
            this.subs.notify(t, Wr);
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
            Wr = this.ov;
            this.ov = this.v;
            this.subs.notify(this.v, Wr);
        }
    }
}

q(SetterObserver);

q(SetterNotifier);

let Wr;

const qr = new PropertyAccessor;

const Jr = v("IObserverLocator", (t => t.singleton(ObserverLocator)));

const Gr = v("INodeObserverLocator", (t => t.cachedCallback((t => new DefaultNodeObserverLocator))));

class DefaultNodeObserverLocator {
    handles() {
        return false;
    }
    getObserver() {
        return qr;
    }
    getAccessor() {
        return qr;
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
        if (null == t) throw Zr(e);
        if (!u(t)) return new PrimitiveObserver(t, e);
        const s = Yr(t);
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
        return qr;
    }
    getArrayObserver(t) {
        return yt(t);
    }
    getMapObserver(t) {
        return te(t);
    }
    getSetObserver(t) {
        return Dt(t);
    }
    createObserver(e, s) {
        if (this.R.handles(e, s, this)) return this.R.getObserver(e, s, this);
        switch (s) {
          case "length":
            if (h(e)) return yt(e).getLengthObserver();
            break;

          case "size":
            if (l(e)) return te(e).getLengthObserver(); else if (a(e)) return Dt(e).getLengthObserver();
            break;

          default:
            if (h(e) && t.isArrayIndex(s)) return yt(e).getIndexObserver(Number(s));
            break;
        }
        let i = Xr(e, s);
        if (void 0 === i) {
            let t = Qr(e);
            while (null !== t) {
                i = Xr(t, s);
                if (void 0 === i) t = Qr(t); else break;
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

ObserverLocator.inject = [ Nr, Gr ];

const Hr = t => {
    let e;
    if (h(t)) e = yt(t); else if (l(t)) e = te(t); else if (a(t)) e = Dt(t);
    return e;
};

const Qr = Object.getPrototypeOf;

const Xr = Object.getOwnPropertyDescriptor;

const Yr = t => {
    let e = t.$observers;
    if (void 0 === e) i(t, "$observers", {
        enumerable: false,
        value: e = x()
    });
    return e;
};

const Zr = t => n(`AUR0199:${d(t)}`);

const ti = v("IObservation", (t => t.singleton(Observation)));

class Observation {
    static get inject() {
        return [ Jr ];
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
        if (this.stopped) throw n(`AUR0225`);
        if (this.running) return;
        ++this.runCount;
        this.running = true;
        this.queued = false;
        ++this.obs.version;
        try {
            Ns(this);
            this.fn(this);
        } finally {
            this.obs.clear();
            this.running = false;
            zs(this);
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

ae(Effect);

function ei(t) {
    if (void 0 === t.$observers) i(t, "$observers", {
        value: {}
    });
    return t.$observers;
}

const si = {};

function ri(t, e, s) {
    if (null == e) return (e, s, i) => r(e, s, i, t);
    return r(t, e, s);
    function r(t, e, s, r) {
        const o = void 0 === e;
        r = "object" !== typeof r ? {
            name: r
        } : r || {};
        if (o) e = r.name;
        if (null == e || "" === e) throw n(`AUR0224`);
        const c = r.callback || `${d(e)}Changed`;
        let u = si;
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
            const s = ii(this, e, c, u, h);
            Fs()?.subscribeTo(s);
            return s.getValue();
        };
        s.set = function t(s) {
            ii(this, e, c, u, h).setValue(s);
        };
        s.get.getObserver = function t(s) {
            return ii(s, e, c, u, h);
        };
        if (o) i(t.prototype, e, s); else return s;
    }
}

function ii(t, e, s, r, i) {
    const n = ei(t);
    let o = n[e];
    if (null == o) {
        o = new SetterNotifier(t, s, i, r === si ? void 0 : r);
        n[e] = o;
    }
    return o;
}

function ni(t, e) {
    if (null == t) return (t, e) => s(t, e); else return s(t, e);
    function s(t, e) {
        const s = !e;
        if (s) p(t, Gs, true); else p(t.constructor, `${Hs}_${d(e)}__`, true);
    }
}

const oi = v("ISignaler", (t => t.singleton(Signaler)));

class Signaler {
    constructor() {
        this.signals = x();
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

exports.ConnectableSwitcher = Ks;

exports.CustomExpression = CustomExpression;

exports.DestructuringAssignmentExpression = DestructuringAssignmentExpression;

exports.DestructuringAssignmentRestExpression = DestructuringAssignmentRestExpression;

exports.DestructuringAssignmentSingleExpression = DestructuringAssignmentSingleExpression;

exports.DirtyCheckProperty = DirtyCheckProperty;

exports.DirtyCheckSettings = zr;

exports.ForOfStatement = ForOfStatement;

exports.ICoercionConfiguration = B;

exports.IDirtyChecker = Nr;

exports.IExpressionParser = le;

exports.INodeObserverLocator = Gr;

exports.IObservation = ti;

exports.IObserverLocator = Jr;

exports.ISignaler = oi;

exports.Interpolation = Interpolation;

exports.MapObserver = MapObserver;

exports.ObjectBindingPattern = ObjectBindingPattern;

exports.ObjectLiteralExpression = ObjectLiteralExpression;

exports.Observation = Observation;

exports.ObserverLocator = ObserverLocator;

exports.PrimitiveLiteralExpression = PrimitiveLiteralExpression;

exports.PrimitiveObserver = PrimitiveObserver;

exports.PropertyAccessor = PropertyAccessor;

exports.ProxyObservable = Vr;

exports.Scope = Scope;

exports.SetObserver = SetObserver;

exports.SetterObserver = SetterObserver;

exports.SubscriberRecord = SubscriberRecord;

exports.TaggedTemplateExpression = TaggedTemplateExpression;

exports.TemplateExpression = TemplateExpression;

exports.UnaryExpression = UnaryExpression;

exports.Unparser = Unparser;

exports.ValueConverterExpression = ValueConverterExpression;

exports.applyMutationsToIndices = Et;

exports.astAssign = C;

exports.astBind = S;

exports.astEvaluate = k;

exports.astUnbind = $;

exports.astVisit = y;

exports.batch = z;

exports.cloneIndexMap = D;

exports.connectable = ae;

exports.copyIndexMap = j;

exports.createIndexMap = T;

exports.disableArrayObservation = At;

exports.disableMapObservation = Zt;

exports.disableSetObservation = Tt;

exports.enableArrayObservation = gt;

exports.enableMapObservation = Yt;

exports.enableSetObservation = jt;

exports.getCollectionObserver = Hr;

exports.getObserverLookup = Yr;

exports.isIndexMap = V;

exports.nowrap = ni;

exports.observable = ri;

exports.parseExpression = Pe;

exports.subscriberCollection = q;

exports.synchronizeIndices = Ot;
//# sourceMappingURL=index.cjs.map
