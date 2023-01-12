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

const A = String;

const x = t.createInterface;

const m = () => o.create(null);

const y = n.getOwn;

n.hasOwn;

const E = n.define;

e.annotation.keyFor;

e.resource.keyFor;

e.resource.appendTo;

const O = (t, e) => {
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
        O(t, e);
        return e.text;
    }
    visitAccessMember(t) {
        O(t.object, this);
        this.text += `${t.optional ? "?" : ""}.${t.name}`;
    }
    visitAccessKeyed(t) {
        O(t.object, this);
        this.text += `${t.optional ? "?." : ""}[`;
        O(t.key, this);
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
            O(e[t], this);
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
        O(t.body, this);
    }
    visitObjectLiteral(t) {
        const e = t.keys;
        const s = t.values;
        this.text += "{";
        for (let t = 0, r = e.length; t < r; ++t) {
            if (0 !== t) this.text += ",";
            this.text += `'${e[t]}':`;
            O(s[t], this);
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
        O(t.func, this);
        this.text += t.optional ? "?." : "";
        this.writeArgs(t.args);
        this.text += ")";
    }
    visitCallMember(t) {
        this.text += "(";
        O(t.object, this);
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
            O(s[t], this);
            this.text += e[t + 1];
        }
        this.text += "`";
    }
    visitTaggedTemplate(t) {
        const {cooked: e, expressions: s} = t;
        const r = s.length;
        O(t.func, this);
        this.text += "`";
        this.text += e[0];
        for (let t = 0; t < r; t++) {
            O(s[t], this);
            this.text += e[t + 1];
        }
        this.text += "`";
    }
    visitUnary(t) {
        this.text += `(${t.operation}`;
        if (t.operation.charCodeAt(0) >= 97) this.text += " ";
        O(t.expression, this);
        this.text += ")";
    }
    visitBinary(t) {
        this.text += "(";
        O(t.left, this);
        if (105 === t.operation.charCodeAt(0)) this.text += ` ${t.operation} `; else this.text += t.operation;
        O(t.right, this);
        this.text += ")";
    }
    visitConditional(t) {
        this.text += "(";
        O(t.condition, this);
        this.text += "?";
        O(t.yes, this);
        this.text += ":";
        O(t.no, this);
        this.text += ")";
    }
    visitAssign(t) {
        this.text += "(";
        O(t.target, this);
        this.text += "=";
        O(t.value, this);
        this.text += ")";
    }
    visitValueConverter(t) {
        const e = t.args;
        O(t.expression, this);
        this.text += `|${t.name}`;
        for (let t = 0, s = e.length; t < s; ++t) {
            this.text += ":";
            O(e[t], this);
        }
    }
    visitBindingBehavior(t) {
        const e = t.args;
        O(t.expression, this);
        this.text += `&${t.name}`;
        for (let t = 0, s = e.length; t < s; ++t) {
            this.text += ":";
            O(e[t], this);
        }
    }
    visitArrayBindingPattern(t) {
        const e = t.elements;
        this.text += "[";
        for (let t = 0, s = e.length; t < s; ++t) {
            if (0 !== t) this.text += ",";
            O(e[t], this);
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
            O(s[t], this);
        }
        this.text += "}";
    }
    visitBindingIdentifier(t) {
        this.text += t.name;
    }
    visitForOfStatement(t) {
        O(t.declaration, this);
        this.text += " of ";
        O(t.iterable, this);
    }
    visitInterpolation(t) {
        const {parts: e, expressions: s} = t;
        const r = s.length;
        this.text += "${";
        this.text += e[0];
        for (let t = 0; t < r; t++) {
            O(s[t], this);
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
                O(o, this);
                break;

              case 24:
              case 25:
                {
                    const t = o.source;
                    if (t) {
                        O(t, this);
                        this.text += ":";
                    }
                    O(o, this);
                    break;
                }
            }
        }
        this.text += s ? "}" : "]";
    }
    visitDestructuringAssignmentSingleExpression(t) {
        O(t.source, this);
        this.text += ":";
        O(t.target, this);
        const e = t.initializer;
        if (void 0 !== e) {
            this.text += "=";
            O(e, this);
        }
    }
    visitDestructuringAssignmentRestExpression(t) {
        this.text += "...";
        O(t.target, this);
    }
    visitCustom(t) {
        this.text += A(t.value);
    }
    writeArgs(t) {
        this.text += "(";
        for (let e = 0, s = t.length; e < s; ++e) {
            if (0 !== e) this.text += ",";
            O(t[e], this);
        }
        this.text += ")";
    }
}

var k;

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
})(k || (k = {}));

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
        if (null == t) throw C();
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
        if (null == t) throw S();
        return new Scope(null, t, null == e ? new OverrideContext : e, s ?? false);
    }
    static fromParent(t, e) {
        if (null == t) throw C();
        return new Scope(t, e, new OverrideContext, false);
    }
}

const C = () => h(`AUR0203`);

const S = () => h("AUR0204");

class OverrideContext {}

const $ = Scope.getContext;

function R(t, e, s, r) {
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
            const i = $(e, t.name, t.ancestor);
            if (null !== r) r.observe(i, t.name);
            const n = i[t.name];
            if (null == n && "$host" === t.name) throw h(`AUR0105`);
            if (s?.strict) return s?.boundFn && a(n) ? n.bind(i) : n;
            return null == n ? "" : s?.boundFn && a(n) ? n.bind(i) : n;
        }

      case 2:
        return t.elements.map((t => R(t, e, s, r)));

      case 3:
        {
            const i = {};
            for (let n = 0; n < t.keys.length; ++n) i[t.keys[n]] = R(t.values[n], e, s, r);
            return i;
        }

      case 4:
        return t.value;

      case 5:
        {
            let i = t.cooked[0];
            for (let n = 0; n < t.expressions.length; ++n) {
                i += String(R(t.expressions[n], e, s, r));
                i += t.cooked[n + 1];
            }
            return i;
        }

      case 6:
        switch (t.operation) {
          case "void":
            return void R(t.expression, e, s, r);

          case "typeof":
            return typeof R(t.expression, e, s, r);

          case "!":
            return !R(t.expression, e, s, r);

          case "-":
            return -R(t.expression, e, s, r);

          case "+":
            return +R(t.expression, e, s, r);

          default:
            throw h(`AUR0109:${t.operation}`);
        }

      case 7:
        {
            const i = t.args.map((t => R(t, e, s, r)));
            const n = $(e, t.name, t.ancestor);
            const o = B(s?.strictFnCall, n, t.name);
            if (o) return o.apply(n, i);
            return;
        }

      case 8:
        {
            const i = R(t.object, e, s, r);
            const n = t.args.map((t => R(t, e, s, r)));
            const o = B(s?.strictFnCall, i, t.name);
            let c;
            if (o) {
                c = o.apply(i, n);
                if (w(i) && D.includes(t.name)) r?.observeCollection(i);
            }
            return c;
        }

      case 9:
        {
            const i = R(t.func, e, s, r);
            if (a(i)) return i(...t.args.map((t => R(t, e, s, r))));
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
                return R(t.body, h, s, r);
            };
            return i;
        }

      case 10:
        {
            const i = R(t.object, e, s, r);
            let n;
            if (s?.strict) {
                if (null == i) return i;
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
            const i = R(t.object, e, s, r);
            if (f(i)) {
                const n = R(t.key, e, s, r);
                if (null !== r) r.observe(i, n);
                return i[n];
            }
            return;
        }

      case 12:
        {
            const i = t.expressions.map((t => R(t, e, s, r)));
            const n = R(t.func, e, s, r);
            if (!a(n)) throw h(`AUR0110`);
            return n(t.cooked, ...i);
        }

      case 13:
        {
            const i = t.left;
            const n = t.right;
            switch (t.operation) {
              case "&&":
                return R(i, e, s, r) && R(n, e, s, r);

              case "||":
                return R(i, e, s, r) || R(n, e, s, r);

              case "??":
                return R(i, e, s, r) ?? R(n, e, s, r);

              case "==":
                return R(i, e, s, r) == R(n, e, s, r);

              case "===":
                return R(i, e, s, r) === R(n, e, s, r);

              case "!=":
                return R(i, e, s, r) != R(n, e, s, r);

              case "!==":
                return R(i, e, s, r) !== R(n, e, s, r);

              case "instanceof":
                {
                    const t = R(n, e, s, r);
                    if (a(t)) return R(i, e, s, r) instanceof t;
                    return false;
                }

              case "in":
                {
                    const t = R(n, e, s, r);
                    if (f(t)) return R(i, e, s, r) in t;
                    return false;
                }

              case "+":
                {
                    const t = R(i, e, s, r);
                    const o = R(n, e, s, r);
                    if (s?.strict) return t + o;
                    if (!t || !o) {
                        if (T(t) || T(o)) return (t || 0) + (o || 0);
                        if (j(t) || j(o)) return (t || "") + (o || "");
                    }
                    return t + o;
                }

              case "-":
                return R(i, e, s, r) - R(n, e, s, r);

              case "*":
                return R(i, e, s, r) * R(n, e, s, r);

              case "/":
                return R(i, e, s, r) / R(n, e, s, r);

              case "%":
                return R(i, e, s, r) % R(n, e, s, r);

              case "<":
                return R(i, e, s, r) < R(n, e, s, r);

              case ">":
                return R(i, e, s, r) > R(n, e, s, r);

              case "<=":
                return R(i, e, s, r) <= R(n, e, s, r);

              case ">=":
                return R(i, e, s, r) >= R(n, e, s, r);

              default:
                throw h(`AUR0108:${t.operation}`);
            }
        }

      case 14:
        return R(t.condition, e, s, r) ? R(t.yes, e, s, r) : R(t.no, e, s, r);

      case 15:
        return U(t.target, e, s, R(t.value, e, s, r));

      case 17:
        {
            const i = s?.getConverter?.(t.name);
            if (null == i) throw h(`AUR0103:${t.name}`);
            if ("toView" in i) return i.toView(R(t.expression, e, s, r), ...t.args.map((t => R(t, e, s, r))));
            return R(t.expression, e, s, r);
        }

      case 18:
        return R(t.expression, e, s, r);

      case 21:
        return t.name;

      case 22:
        return R(t.iterable, e, s, r);

      case 23:
        if (t.isMulti) {
            let i = t.parts[0];
            let n = 0;
            for (;n < t.expressions.length; ++n) {
                i += A(R(t.expressions[n], e, s, r));
                i += t.parts[n + 1];
            }
            return i;
        } else return `${t.parts[0]}${R(t.firstExpression, e, s, r)}${t.parts[1]}`;

      case 26:
        return R(t.target, e, s, r);

      case 24:
        return t.list.map((t => R(t, e, s, r)));

      case 19:
      case 20:
      case 25:
      default:
        return;

      case 28:
        return t.evaluate(e, s, r);
    }
}

function U(t, e, s, i) {
    switch (t.$kind) {
      case 1:
        {
            if ("$host" === t.name) throw h(`AUR0106`);
            const s = $(e, t.name, t.ancestor);
            return s[t.name] = i;
        }

      case 10:
        {
            const r = R(t.object, e, s, null);
            if (f(r)) if ("length" === t.name && w(r) && !isNaN(i)) r.splice(i); else r[t.name] = i; else U(t.object, e, s, {
                [t.name]: i
            });
            return i;
        }

      case 11:
        {
            const n = R(t.object, e, s, null);
            const o = R(t.key, e, s, null);
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
        U(t.value, e, s, i);
        return U(t.target, e, s, i);

      case 17:
        {
            const r = s?.getConverter?.(t.name);
            if (null == r) throw M(t.name);
            if ("fromView" in r) i = r.fromView(i, ...t.args.map((t => R(t, e, s, null))));
            return U(t.expression, e, s, i);
        }

      case 18:
        return U(t.expression, e, s, i);

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
                    U(c, e, s, i);
                    break;

                  case 24:
                  case 25:
                    {
                        if ("object" !== typeof i || null === i) throw h(`AUR0112`);
                        let t = R(c.source, Scope.create(i), s, null);
                        if (void 0 === t && c.initializer) t = R(c.initializer, e, s, null);
                        U(c, e, s, t);
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
            let r = R(t.source, Scope.create(i), s, null);
            if (void 0 === r && t.initializer) r = R(t.initializer, e, s, null);
            U(t.target, e, s, r);
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
            U(t.target, e, s, o);
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
            if (null == n) throw _(r);
            if (void 0 === s[i]) {
                s[i] = n;
                n.bind?.(e, s, ...t.args.map((t => R(t, e, s, null))));
            } else throw I(r);
            L(t.expression, e, s);
            return;
        }

      case 17:
        {
            const r = t.name;
            const i = s.getConverter?.(r);
            if (null == i) throw M(r);
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

const _ = t => h(`AUR0101:${t}`);

const I = t => h(`AUR0102:${t}`);

const M = t => h(`AUR0103:${t}`);

const B = (t, e, s) => {
    const r = null == e ? null : e[s];
    if (a(r)) return r;
    if (!t && null == r) return null;
    throw h(`AUR0111:${s}`);
};

const T = t => {
    switch (typeof t) {
      case "number":
      case "bigint":
        return true;

      default:
        return false;
    }
};

const j = t => {
    switch (typeof t) {
      case "string":
        return true;

      case "object":
        return t instanceof Date;

      default:
        return false;
    }
};

const D = "at map filter includes indexOf lastIndexOf findIndex find flat flatMap join reduce reduceRight slice every some sort".split(" ");

const V = t.createInterface("ICoercionConfiguration");

var F;

(function(t) {
    t[t["indexed"] = 8] = "indexed";
    t[t["keyed"] = 4] = "keyed";
    t[t["array"] = 9] = "array";
    t[t["map"] = 6] = "map";
    t[t["set"] = 7] = "set";
})(F || (F = {}));

var N;

(function(t) {
    t[t["None"] = 0] = "None";
    t[t["Observer"] = 1] = "Observer";
    t[t["Node"] = 2] = "Node";
    t[t["Layout"] = 4] = "Layout";
    t[t["Primtive"] = 8] = "Primtive";
    t[t["Array"] = 18] = "Array";
    t[t["Set"] = 34] = "Set";
    t[t["Map"] = 66] = "Map";
})(N || (N = {}));

function z(t, e, s) {
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

function K(t = 0) {
    const e = Array(t);
    let s = 0;
    while (s < t) e[s] = s++;
    e.deletedIndices = [];
    e.deletedItems = [];
    e.isIndexMap = true;
    return e;
}

function W(t) {
    const e = t.slice();
    e.deletedIndices = t.deletedIndices.slice();
    e.deletedItems = t.deletedItems.slice();
    e.isIndexMap = true;
    return e;
}

function J(t) {
    return w(t) && true === t.isIndexMap;
}

let q = new Map;

let G = false;

function H(t) {
    const e = q;
    const s = q = new Map;
    G = true;
    try {
        t();
    } finally {
        q = null;
        G = false;
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
            q = e;
        }
    }
}

function Q(t, e, s) {
    if (!q.has(t)) q.set(t, [ 2, e, s ]);
}

function X(t, e, s) {
    const r = q.get(t);
    if (void 0 === r) q.set(t, [ 1, e, s ]); else {
        r[1] = e;
        r[2] = s;
    }
}

function Y(t) {
    return null == t ? Z : Z(t);
}

function Z(t) {
    const e = t.prototype;
    u(e, "subs", {
        get: tt
    });
    g(e, "subscribe", et);
    g(e, "unsubscribe", st);
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
        if (G) {
            X(this, t, e);
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

function tt() {
    return v(this, "subs", new SubscriberRecord);
}

function et(t) {
    return this.subs.add(t);
}

function st(t) {
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

function rt(t) {
    const e = t.prototype;
    g(e, "subscribe", it);
    g(e, "unsubscribe", nt);
    Y(t);
}

function it(t) {
    if (this.subs.add(t) && 1 === this.subs.count) this.owner.subscribe(this);
}

function nt(t) {
    if (this.subs.remove(t) && 0 === this.subs.count) this.owner.subscribe(this);
}

rt(CollectionLengthObserver);

rt(CollectionSizeObserver);

const ot = "__au_array_obs__";

const ct = (() => {
    let t = y(ot, Array);
    if (null == t) E(ot, t = new WeakMap, Array);
    return t;
})();

function ut(t, e) {
    if (t === e) return 0;
    t = null === t ? "null" : t.toString();
    e = null === e ? "null" : e.toString();
    return t < e ? -1 : 1;
}

function ht(t, e) {
    if (void 0 === t) if (void 0 === e) return 0; else return 1;
    if (void 0 === e) return -1;
    return 0;
}

function at(t, e, s, r, i) {
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

function lt(t, e, s, r, i) {
    let n = 0, o = 0;
    let c, u, h;
    let a, l, f;
    let w, b, p;
    let d, v;
    let g, A, x, m;
    let y, E, O, k;
    while (true) {
        if (r - s <= 10) {
            at(t, e, s, r, i);
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
            lt(t, e, m, r, i);
            r = x;
        } else {
            lt(t, e, s, x, i);
            s = m;
        }
    }
}

const ft = Array.prototype;

const wt = ft.push;

const bt = ft.unshift;

const pt = ft.pop;

const dt = ft.shift;

const vt = ft.splice;

const gt = ft.reverse;

const At = ft.sort;

const xt = {
    push: wt,
    unshift: bt,
    pop: pt,
    shift: dt,
    splice: vt,
    reverse: gt,
    sort: At
};

const mt = [ "push", "unshift", "pop", "shift", "splice", "reverse", "sort" ];

const yt = {
    push: function(...t) {
        const e = ct.get(this);
        if (void 0 === e) return wt.apply(this, t);
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
        const e = ct.get(this);
        if (void 0 === e) return bt.apply(this, t);
        const s = t.length;
        const r = new Array(s);
        let i = 0;
        while (i < s) r[i++] = -2;
        bt.apply(e.indexMap, r);
        const n = bt.apply(this, t);
        e.notify();
        return n;
    },
    pop: function() {
        const t = ct.get(this);
        if (void 0 === t) return pt.call(this);
        const e = t.indexMap;
        const s = pt.call(this);
        const r = e.length - 1;
        if (e[r] > -1) {
            e.deletedIndices.push(e[r]);
            e.deletedItems.push(s);
        }
        pt.call(e);
        t.notify();
        return s;
    },
    shift: function() {
        const t = ct.get(this);
        if (void 0 === t) return dt.call(this);
        const e = t.indexMap;
        const s = dt.call(this);
        if (e[0] > -1) {
            e.deletedIndices.push(e[0]);
            e.deletedItems.push(s);
        }
        dt.call(e);
        t.notify();
        return s;
    },
    splice: function(...t) {
        const e = t[0];
        const s = t[1];
        const r = ct.get(this);
        if (void 0 === r) return vt.apply(this, t);
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
            vt.call(c, e, s, ...r);
        } else vt.apply(c, t);
        const l = vt.apply(this, t);
        if (h > 0 || a > 0) r.notify();
        return l;
    },
    reverse: function() {
        const t = ct.get(this);
        if (void 0 === t) {
            gt.call(this);
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
        const e = ct.get(this);
        if (void 0 === e) {
            At.call(this, t);
            return this;
        }
        let s = this.length;
        if (s < 2) return this;
        lt(this, e.indexMap, 0, s, ht);
        let r = 0;
        while (r < s) {
            if (void 0 === this[r]) break;
            r++;
        }
        if (void 0 === t || !a(t)) t = ut;
        lt(this, e.indexMap, 0, r, t);
        let i = false;
        for (r = 0, s = e.indexMap.length; s > r; ++r) if (e.indexMap[r] !== r) {
            i = true;
            break;
        }
        if (i) e.notify();
        return this;
    }
};

for (const t of mt) u(yt[t], "observing", {
    value: true,
    writable: false,
    configurable: false,
    enumerable: false
});

let Et = false;

const Ot = "__au_arr_on__";

function kt() {
    if (!(y(Ot, Array) ?? false)) {
        E(Ot, true, Array);
        for (const t of mt) if (true !== ft[t].observing) v(ft, t, yt[t]);
    }
}

function Ct() {
    for (const t of mt) if (true === ft[t].observing) v(ft, t, xt[t]);
}

class ArrayObserver {
    constructor(t) {
        this.type = 18;
        if (!Et) {
            Et = true;
            kt();
        }
        this.indexObservers = {};
        this.collection = t;
        this.indexMap = K(t.length);
        this.lenObs = void 0;
        ct.set(t, this);
    }
    notify() {
        const t = this.subs;
        const e = this.indexMap;
        if (G) {
            Q(t, this.collection, e);
            return;
        }
        const s = this.collection;
        const r = s.length;
        this.indexMap = K(r);
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

Y(ArrayObserver);

Y(ArrayIndexObserver);

function St(t) {
    let e = ct.get(t);
    if (void 0 === e) e = new ArrayObserver(t);
    return e;
}

const $t = (t, e) => t - e;

function Rt(t) {
    let e = 0;
    let s = 0;
    let r = 0;
    const i = W(t);
    if (i.deletedIndices.length > 1) i.deletedIndices.sort($t);
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

function Ut(t, e) {
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

const Lt = "__au_set_obs__";

const Pt = (() => {
    let t = y(Lt, Set);
    if (null == t) E(Lt, t = new WeakMap, Set);
    return t;
})();

const _t = Set.prototype;

const It = _t.add;

const Mt = _t.clear;

const Bt = _t.delete;

const Tt = {
    add: It,
    clear: Mt,
    delete: Bt
};

const jt = [ "add", "clear", "delete" ];

const Dt = {
    add: function(t) {
        const e = Pt.get(this);
        if (void 0 === e) {
            It.call(this, t);
            return this;
        }
        const s = this.size;
        It.call(this, t);
        const r = this.size;
        if (r === s) return this;
        e.indexMap[s] = -2;
        e.notify();
        return this;
    },
    clear: function() {
        const t = Pt.get(this);
        if (void 0 === t) return Mt.call(this);
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
            Mt.call(this);
            e.length = 0;
            t.notify();
        }
        return;
    },
    delete: function(t) {
        const e = Pt.get(this);
        if (void 0 === e) return Bt.call(this, t);
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
                const n = Bt.call(this, t);
                if (true === n) e.notify();
                return n;
            }
            r++;
        }
        return false;
    }
};

const Vt = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const t of jt) u(Dt[t], "observing", {
    value: true,
    writable: false,
    configurable: false,
    enumerable: false
});

let Ft = false;

const Nt = "__au_set_on__";

function zt() {
    if (!(y(Nt, Set) ?? false)) {
        E(Nt, true, Set);
        for (const t of jt) if (true !== _t[t].observing) u(_t, t, {
            ...Vt,
            value: Dt[t]
        });
    }
}

function Kt() {
    for (const t of jt) if (true === _t[t].observing) u(_t, t, {
        ...Vt,
        value: Tt[t]
    });
}

class SetObserver {
    constructor(t) {
        this.type = 34;
        if (!Ft) {
            Ft = true;
            zt();
        }
        this.collection = t;
        this.indexMap = K(t.size);
        this.lenObs = void 0;
        Pt.set(t, this);
    }
    notify() {
        const t = this.subs;
        const e = this.indexMap;
        if (G) {
            Q(t, this.collection, e);
            return;
        }
        const s = this.collection;
        const r = s.size;
        this.indexMap = K(r);
        this.subs.notifyCollection(s, e);
    }
    getLengthObserver() {
        return this.lenObs ?? (this.lenObs = new CollectionSizeObserver(this));
    }
}

Y(SetObserver);

function Wt(t) {
    let e = Pt.get(t);
    if (void 0 === e) e = new SetObserver(t);
    return e;
}

const Jt = "__au_map_obs__";

const qt = (() => {
    let t = y(Jt, Map);
    if (null == t) E(Jt, t = new WeakMap, Map);
    return t;
})();

const Gt = Map.prototype;

const Ht = Gt.set;

const Qt = Gt.clear;

const Xt = Gt.delete;

const Yt = {
    set: Ht,
    clear: Qt,
    delete: Xt
};

const Zt = [ "set", "clear", "delete" ];

const te = {
    set: function(t, e) {
        const s = qt.get(this);
        if (void 0 === s) {
            Ht.call(this, t, e);
            return this;
        }
        const r = this.get(t);
        const i = this.size;
        Ht.call(this, t, e);
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
        const t = qt.get(this);
        if (void 0 === t) return Qt.call(this);
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
            Qt.call(this);
            e.length = 0;
            t.notify();
        }
        return;
    },
    delete: function(t) {
        const e = qt.get(this);
        if (void 0 === e) return Xt.call(this, t);
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
                const n = Xt.call(this, t);
                if (true === n) e.notify();
                return n;
            }
            ++r;
        }
        return false;
    }
};

const ee = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const t of Zt) u(te[t], "observing", {
    value: true,
    writable: false,
    configurable: false,
    enumerable: false
});

let se = false;

const re = "__au_map_on__";

function ie() {
    if (!(y(re, Map) ?? false)) {
        E(re, true, Map);
        for (const t of Zt) if (true !== Gt[t].observing) u(Gt, t, {
            ...ee,
            value: te[t]
        });
    }
}

function ne() {
    for (const t of Zt) if (true === Gt[t].observing) u(Gt, t, {
        ...ee,
        value: Yt[t]
    });
}

class MapObserver {
    constructor(t) {
        this.type = 66;
        if (!se) {
            se = true;
            ie();
        }
        this.collection = t;
        this.indexMap = K(t.size);
        this.lenObs = void 0;
        qt.set(t, this);
    }
    notify() {
        const t = this.subs;
        const e = this.indexMap;
        if (G) {
            Q(t, this.collection, e);
            return;
        }
        const s = this.collection;
        const r = s.size;
        this.indexMap = K(r);
        t.notifyCollection(s, e);
    }
    getLengthObserver() {
        return this.lenObs ?? (this.lenObs = new CollectionSizeObserver(this));
    }
}

Y(MapObserver);

function oe(t) {
    let e = qt.get(t);
    if (void 0 === e) e = new MapObserver(t);
    return e;
}

function ce() {
    return v(this, "obs", new BindingObserverRecord(this));
}

function ue(t, e) {
    this.obs.add(this.oL.getObserver(t, e));
}

function he(t) {
    let e;
    if (w(t)) e = St(t); else if (b(t)) e = Wt(t); else if (p(t)) e = oe(t); else throw h(`AUR0210`);
    this.obs.add(e);
}

function ae(t) {
    this.obs.add(t);
}

function le() {
    throw h(`AUR2011:handleChange`);
}

function fe() {
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
        this.o.forEach(be, this);
        this.count = this.o.size;
    }
    clearAll() {
        this.o.forEach(we, this);
        this.o.clear();
        this.count = 0;
    }
}

function we(t, e) {
    e.unsubscribe(this.b);
}

function be(t, e) {
    if (this.version !== t) {
        e.unsubscribe(this.b);
        this.o.delete(e);
    }
}

function pe(t) {
    const e = t.prototype;
    g(e, "observe", ue);
    g(e, "observeCollection", he);
    g(e, "subscribeTo", ae);
    u(e, "obs", {
        get: ce
    });
    g(e, "handleChange", le);
    g(e, "handleCollectionChange", fe);
    return t;
}

function de(t) {
    return null == t ? pe : pe(t);
}

const ve = x("IExpressionParser", (t => t.singleton(ExpressionParser)));

class ExpressionParser {
    constructor() {
        this.i = m();
        this.u = m();
        this.h = m();
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
                throw ps();
            }
            s = this.i[t];
            if (void 0 === s) s = this.i[t] = this.$parse(t, e);
            return s;
        }
    }
    $parse(t, e) {
        Ce = t;
        Se = 0;
        $e = t.length;
        Re = 0;
        Ue = 0;
        Le = 6291456;
        Pe = "";
        _e = je(0);
        Ie = true;
        Me = false;
        Be = -1;
        return Fe(61, void 0 === e ? 16 : e);
    }
}

function ge(t) {
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

const Ae = PrimitiveLiteralExpression.$false;

const xe = PrimitiveLiteralExpression.$true;

const me = PrimitiveLiteralExpression.$null;

const ye = PrimitiveLiteralExpression.$undefined;

const Ee = AccessThisExpression.$this;

const Oe = AccessThisExpression.$parent;

var ke;

(function(t) {
    t[t["None"] = 0] = "None";
    t[t["Interpolation"] = 1] = "Interpolation";
    t[t["IsIterator"] = 2] = "IsIterator";
    t[t["IsChainable"] = 4] = "IsChainable";
    t[t["IsFunction"] = 8] = "IsFunction";
    t[t["IsProperty"] = 16] = "IsProperty";
    t[t["IsCustom"] = 32] = "IsCustom";
})(ke || (ke = {}));

let Ce = "";

let Se = 0;

let $e = 0;

let Re = 0;

let Ue = 0;

let Le = 6291456;

let Pe = "";

let _e;

let Ie = true;

let Me = false;

let Be = -1;

const Te = String.fromCharCode;

const je = t => Ce.charCodeAt(t);

const De = () => Ce.slice(Ue, Se);

function Ve(t, e) {
    Ce = t;
    Se = 0;
    $e = t.length;
    Re = 0;
    Ue = 0;
    Le = 6291456;
    Pe = "";
    _e = je(0);
    Ie = true;
    Me = false;
    Be = -1;
    return Fe(61, void 0 === e ? 16 : e);
}

function Fe(t, e) {
    if (32 === e) return new CustomExpression(Ce);
    if (0 === Se) {
        if (1 & e) return Xe();
        ts();
        if (4194304 & Le) throw hs();
    }
    Ie = 513 > t;
    Me = false;
    let s = false;
    let r;
    let i = 0;
    if (131072 & Le) {
        const t = Ms[63 & Le];
        ts();
        r = new UnaryExpression(t, Fe(514, e));
        Ie = false;
    } else {
        t: switch (Le) {
          case 12294:
            i = Re;
            Ie = false;
            do {
                ts();
                ++i;
                switch (Le) {
                  case 65545:
                    ts();
                    if (0 === (12288 & Le)) throw ls();
                    break;

                  case 10:
                  case 11:
                    throw ls();

                  case 2162700:
                    Me = true;
                    ts();
                    if (0 === (12288 & Le)) {
                        r = 0 === i ? Ee : 1 === i ? Oe : new AccessThisExpression(i);
                        s = true;
                        break t;
                    }
                    break;

                  default:
                    if (2097152 & Le) {
                        r = 0 === i ? Ee : 1 === i ? Oe : new AccessThisExpression(i);
                        break t;
                    }
                    throw fs();
                }
            } while (12294 === Le);

          case 4096:
            {
                const t = Pe;
                if (2 & e) r = new BindingIdentifier(t); else r = new AccessScopeExpression(t, i);
                Ie = !Me;
                ts();
                if (cs(50)) {
                    if (524296 === Le) throw _s();
                    const e = Me;
                    const s = Re;
                    ++Re;
                    const i = Fe(62, 0);
                    Me = e;
                    Re = s;
                    Ie = false;
                    r = new ArrowFunction([ new BindingIdentifier(t) ], i);
                }
                break;
            }

          case 10:
            throw Is();

          case 11:
            throw as();

          case 12292:
            Ie = false;
            ts();
            switch (Re) {
              case 0:
                r = Ee;
                break;

              case 1:
                r = Oe;
                break;

              default:
                r = new AccessThisExpression(Re);
                break;
            }
            break;

          case 2688007:
            r = qe(e);
            break;

          case 2688016:
            r = Ce.search(/\s+of\s+/) > Se ? Ne() : Ge(e);
            break;

          case 524296:
            r = Qe(e);
            break;

          case 2163759:
            r = new TemplateExpression([ Pe ]);
            Ie = false;
            ts();
            break;

          case 2163760:
            r = Ye(e, r, false);
            break;

          case 16384:
          case 32768:
            r = new PrimitiveLiteralExpression(Pe);
            Ie = false;
            ts();
            break;

          case 8194:
          case 8195:
          case 8193:
          case 8192:
            r = Ms[63 & Le];
            Ie = false;
            ts();
            break;

          default:
            if (Se >= $e) throw ws(); else throw bs();
        }
        if (2 & e) return He(r);
        if (514 < t) return r;
        if (10 === Le || 11 === Le) throw ls();
        if (0 === r.$kind) switch (Le) {
          case 2162700:
            Me = true;
            Ie = false;
            ts();
            if (0 === (13312 & Le)) throw Ss();
            if (12288 & Le) {
                r = new AccessScopeExpression(Pe, r.ancestor);
                ts();
            } else if (2688007 === Le) r = new CallFunctionExpression(r, ze(), true); else if (2688016 === Le) r = Ke(r, true); else throw $s();
            break;

          case 65545:
            Ie = !Me;
            ts();
            if (0 === (12288 & Le)) throw ls();
            r = new AccessScopeExpression(Pe, r.ancestor);
            ts();
            break;

          case 10:
          case 11:
            throw ls();

          case 2688007:
            r = new CallFunctionExpression(r, ze(), s);
            break;

          case 2688016:
            r = Ke(r, s);
            break;

          case 2163759:
            r = Ze(r);
            break;

          case 2163760:
            r = Ye(e, r, true);
            break;
        }
        while ((65536 & Le) > 0) switch (Le) {
          case 2162700:
            r = We(r);
            break;

          case 65545:
            ts();
            if (0 === (12288 & Le)) throw ls();
            r = Je(r, false);
            break;

          case 10:
          case 11:
            throw ls();

          case 2688007:
            if (1 === r.$kind) r = new CallScopeExpression(r.name, ze(), r.ancestor, false); else if (10 === r.$kind) r = new CallMemberExpression(r.object, r.name, ze(), r.optional, false); else r = new CallFunctionExpression(r, ze(), false);
            break;

          case 2688016:
            r = Ke(r, false);
            break;

          case 2163759:
            if (Me) throw $s();
            r = Ze(r);
            break;

          case 2163760:
            if (Me) throw $s();
            r = Ye(e, r, true);
            break;
        }
    }
    if (10 === Le || 11 === Le) throw ls();
    if (513 < t) return r;
    while ((262144 & Le) > 0) {
        const s = Le;
        if ((960 & s) <= t) break;
        ts();
        r = new BinaryExpression(Ms[63 & s], r, Fe(960 & s, e));
        Ie = false;
    }
    if (63 < t) return r;
    if (cs(6291478)) {
        const t = Fe(62, e);
        us(6291476);
        r = new ConditionalExpression(r, t, Fe(62, e));
        Ie = false;
    }
    if (62 < t) return r;
    if (cs(4194349)) {
        if (!Ie) throw ds();
        r = new AssignExpression(r, Fe(62, e));
    }
    if (61 < t) return r;
    while (cs(6291480)) {
        if (6291456 === Le) throw vs();
        const t = Pe;
        ts();
        const s = new Array;
        while (cs(6291476)) s.push(Fe(62, e));
        r = new ValueConverterExpression(r, t, s);
    }
    while (cs(6291479)) {
        if (6291456 === Le) throw gs();
        const t = Pe;
        ts();
        const s = new Array;
        while (cs(6291476)) s.push(Fe(62, e));
        r = new BindingBehaviorExpression(r, t, s);
    }
    if (6291456 !== Le) {
        if ((1 & e) > 0 && 7340045 === Le) return r;
        if ((4 & e) > 0 && 6291477 === Le) {
            if (Se === $e) throw bs();
            Be = Se - 1;
            return r;
        }
        if ("of" === De()) throw As();
        throw bs();
    }
    return r;
}

function Ne() {
    const t = [];
    const e = new DestructuringAssignmentExpression(24, t, void 0, void 0);
    let s = "";
    let r = true;
    let i = 0;
    while (r) {
        ts();
        switch (Le) {
          case 7340051:
            r = false;
            n();
            break;

          case 6291471:
            n();
            break;

          case 4096:
            s = De();
            break;

          default:
            throw Cs();
        }
    }
    us(7340051);
    return e;
    function n() {
        if ("" !== s) {
            t.push(new DestructuringAssignmentSingleExpression(new AccessMemberExpression(Ee, s), new AccessKeyedExpression(Ee, new PrimitiveLiteralExpression(i++)), void 0));
            s = "";
        } else i++;
    }
}

function ze() {
    const t = Me;
    ts();
    const e = [];
    while (7340046 !== Le) {
        e.push(Fe(62, 0));
        if (!cs(6291471)) break;
    }
    us(7340046);
    Ie = false;
    Me = t;
    return e;
}

function Ke(t, e) {
    const s = Me;
    ts();
    t = new AccessKeyedExpression(t, Fe(62, 0), e);
    us(7340051);
    Ie = !s;
    Me = s;
    return t;
}

function We(t) {
    Me = true;
    Ie = false;
    ts();
    if (0 === (13312 & Le)) throw Ss();
    if (12288 & Le) return Je(t, true);
    if (2688007 === Le) if (1 === t.$kind) return new CallScopeExpression(t.name, ze(), t.ancestor, true); else if (10 === t.$kind) return new CallMemberExpression(t.object, t.name, ze(), t.optional, true); else return new CallFunctionExpression(t, ze(), true);
    if (2688016 === Le) return Ke(t, true);
    throw $s();
}

function Je(t, e) {
    const s = Pe;
    switch (Le) {
      case 2162700:
        {
            Me = true;
            Ie = false;
            const r = Se;
            const i = Ue;
            const n = Le;
            const o = _e;
            const c = Pe;
            const u = Ie;
            const h = Me;
            ts();
            if (0 === (13312 & Le)) throw Ss();
            if (2688007 === Le) return new CallMemberExpression(t, s, ze(), e, true);
            Se = r;
            Ue = i;
            Le = n;
            _e = o;
            Pe = c;
            Ie = u;
            Me = h;
            return new AccessMemberExpression(t, s, e);
        }

      case 2688007:
        Ie = false;
        return new CallMemberExpression(t, s, ze(), e, false);

      default:
        Ie = !Me;
        ts();
        return new AccessMemberExpression(t, s, e);
    }
}

function qe(t) {
    ts();
    const e = Se;
    const s = Ue;
    const r = Le;
    const i = _e;
    const n = Pe;
    const o = Ie;
    const c = Me;
    const u = [];
    let h = 1;
    let a = false;
    t: while (true) {
        if (11 === Le) {
            ts();
            if (4096 !== Le) throw ls();
            u.push(new BindingIdentifier(Pe));
            ts();
            if (6291471 === Le) throw Ps();
            if (7340046 !== Le) throw as();
            ts();
            if (50 !== Le) throw as();
            ts();
            const t = Me;
            const e = Re;
            ++Re;
            const s = Fe(62, 0);
            Me = t;
            Re = e;
            Ie = false;
            return new ArrowFunction(u, s, true);
        }
        switch (Le) {
          case 4096:
            u.push(new BindingIdentifier(Pe));
            ts();
            break;

          case 7340046:
            ts();
            break t;

          case 524296:
          case 2688016:
            ts();
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
            ts();
            h = 2;
            break;
        }
        switch (Le) {
          case 6291471:
            ts();
            a = true;
            if (1 === h) break;
            break t;

          case 7340046:
            ts();
            break t;

          case 4194349:
            if (1 === h) h = 3;
            break t;

          case 50:
            if (a) throw Rs();
            ts();
            h = 2;
            break t;

          default:
            if (1 === h) h = 2;
            break t;
        }
    }
    if (50 === Le) {
        if (1 === h) {
            ts();
            if (524296 === Le) throw _s();
            const t = Me;
            const e = Re;
            ++Re;
            const s = Fe(62, 0);
            Me = t;
            Re = e;
            Ie = false;
            return new ArrowFunction(u, s);
        }
        throw Rs();
    } else if (1 === h && 0 === u.length) throw Os(50);
    if (a) switch (h) {
      case 2:
        throw Rs();

      case 3:
        throw Us();

      case 4:
        throw Ls();
    }
    Se = e;
    Ue = s;
    Le = r;
    _e = i;
    Pe = n;
    Ie = o;
    Me = c;
    const l = Me;
    const f = Fe(62, t);
    Me = l;
    us(7340046);
    if (50 === Le) switch (h) {
      case 2:
        throw Rs();

      case 3:
        throw Us();

      case 4:
        throw Ls();
    }
    return f;
}

function Ge(t) {
    const e = Me;
    ts();
    const s = new Array;
    while (7340051 !== Le) if (cs(6291471)) {
        s.push(ye);
        if (7340051 === Le) break;
    } else {
        s.push(Fe(62, ~2 & t));
        if (cs(6291471)) {
            if (7340051 === Le) break;
        } else break;
    }
    Me = e;
    us(7340051);
    if (2 & t) return new ArrayBindingPattern(s); else {
        Ie = false;
        return new ArrayLiteralExpression(s);
    }
}

function He(t) {
    if (0 === (t.$kind & (19 | 20 | 21))) throw xs();
    if (4204593 !== Le) throw xs();
    ts();
    const e = t;
    const s = Fe(61, 4);
    return new ForOfStatement(e, s, Be);
}

function Qe(t) {
    const e = Me;
    const s = new Array;
    const r = new Array;
    ts();
    while (7340045 !== Le) {
        s.push(Pe);
        if (49152 & Le) {
            ts();
            us(6291476);
            r.push(Fe(62, ~2 & t));
        } else if (12288 & Le) {
            const e = _e;
            const s = Le;
            const i = Se;
            ts();
            if (cs(6291476)) r.push(Fe(62, ~2 & t)); else {
                _e = e;
                Le = s;
                Se = i;
                r.push(Fe(515, ~2 & t));
            }
        } else throw ms();
        if (7340045 !== Le) us(6291471);
    }
    Me = e;
    us(7340045);
    if (2 & t) return new ObjectBindingPattern(s, r); else {
        Ie = false;
        return new ObjectLiteralExpression(s, r);
    }
}

function Xe() {
    const t = [];
    const e = [];
    const s = $e;
    let r = "";
    while (Se < s) {
        switch (_e) {
          case 36:
            if (123 === je(Se + 1)) {
                t.push(r);
                r = "";
                Se += 2;
                _e = je(Se);
                ts();
                const s = Fe(61, 1);
                e.push(s);
                continue;
            } else r += "$";
            break;

          case 92:
            r += Te(ge(es()));
            break;

          default:
            r += Te(_e);
        }
        es();
    }
    if (e.length) {
        t.push(r);
        return new Interpolation(t, e);
    }
    return null;
}

function Ye(t, e, s) {
    const r = Me;
    const i = [ Pe ];
    us(2163760);
    const n = [ Fe(62, t) ];
    while (2163759 !== (Le = os())) {
        i.push(Pe);
        us(2163760);
        n.push(Fe(62, t));
    }
    i.push(Pe);
    Ie = false;
    Me = r;
    if (s) {
        ts();
        return new TaggedTemplateExpression(i, i, e, n);
    } else {
        ts();
        return new TemplateExpression(i, n);
    }
}

function Ze(t) {
    Ie = false;
    const e = [ Pe ];
    ts();
    return new TaggedTemplateExpression(e, e, t);
}

function ts() {
    while (Se < $e) {
        Ue = Se;
        if (null != (Le = Ns[_e]())) return;
    }
    Le = 6291456;
}

function es() {
    return _e = je(++Se);
}

function ss() {
    while (Fs[es()]) ;
    const t = Bs[Pe = De()];
    return void 0 === t ? 4096 : t;
}

function rs(t) {
    let e = _e;
    if (false === t) {
        do {
            e = es();
        } while (e <= 57 && e >= 48);
        if (46 !== e) {
            Pe = parseInt(De(), 10);
            return 32768;
        }
        e = es();
        if (Se >= $e) {
            Pe = parseInt(De().slice(0, -1), 10);
            return 32768;
        }
    }
    if (e <= 57 && e >= 48) do {
        e = es();
    } while (e <= 57 && e >= 48); else _e = je(--Se);
    Pe = parseFloat(De());
    return 32768;
}

function is() {
    const t = _e;
    es();
    let e = 0;
    const s = new Array;
    let r = Se;
    while (_e !== t) if (92 === _e) {
        s.push(Ce.slice(r, Se));
        es();
        e = ge(_e);
        es();
        s.push(Te(e));
        r = Se;
    } else if (Se >= $e) throw ys(); else es();
    const i = Ce.slice(r, Se);
    es();
    s.push(i);
    const n = s.join("");
    Pe = n;
    return 16384;
}

function ns() {
    let t = true;
    let e = "";
    while (96 !== es()) if (36 === _e) if (Se + 1 < $e && 123 === je(Se + 1)) {
        Se++;
        t = false;
        break;
    } else e += "$"; else if (92 === _e) e += Te(ge(es())); else {
        if (Se >= $e) throw Es();
        e += Te(_e);
    }
    es();
    Pe = e;
    if (t) return 2163759;
    return 2163760;
}

const os = () => {
    if (Se >= $e) throw Es();
    Se--;
    return ns();
};

const cs = t => {
    if (Le === t) {
        ts();
        return true;
    }
    return false;
};

const us = t => {
    if (Le === t) ts(); else throw Os(t);
};

const hs = () => h(`AUR0151:${Ce}`);

const as = () => h(`AUR0152:${Ce}`);

const ls = () => h(`AUR0153:${Ce}`);

const fs = () => h(`AUR0154:${Ce}`);

const ws = () => h(`AUR0155:${Ce}`);

const bs = () => h(`AUR0156:${Ce}`);

const ps = () => h(`AUR0157`);

const ds = () => h(`AUR0158:${Ce}`);

const vs = () => h(`AUR0159:${Ce}`);

const gs = () => h(`AUR0160:${Ce}`);

const As = () => h(`AUR0161:${Ce}`);

const xs = () => h(`AUR0163:${Ce}`);

const ms = () => h(`AUR0164:${Ce}`);

const ys = () => h(`AUR0165:${Ce}`);

const Es = () => h(`AUR0166:${Ce}`);

const Os = t => h(`AUR0167:${Ce}<${Ms[63 & t]}`);

const ks = () => {
    throw h(`AUR0168:${Ce}`);
};

ks.notMapped = true;

const Cs = () => h(`AUR0170:${Ce}`);

const Ss = () => h(`AUR0171:${Ce}`);

const $s = () => h(`AUR0172:${Ce}`);

const Rs = () => h(`AUR0173:${Ce}`);

const Us = () => h(`AUR0174:${Ce}`);

const Ls = () => h(`AUR0175:${Ce}`);

const Ps = () => h(`AUR0176:${Ce}`);

const _s = () => h(`AUR0178:${Ce}`);

const Is = () => h(`AUR0179:${Ce}`);

const Ms = [ Ae, xe, me, ye, "$this", null, "$parent", "(", "{", ".", "..", "...", "?.", "}", ")", ",", "[", "]", ":", ";", "?", "'", '"', "&", "|", "??", "||", "&&", "==", "!=", "===", "!==", "<", ">", "<=", ">=", "in", "instanceof", "+", "-", "typeof", "void", "*", "%", "/", "=", "!", 2163759, 2163760, "of", "=>" ];

const Bs = Object.assign(Object.create(null), {
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

const Ts = {
    AsciiIdPart: [ 36, 0, 48, 58, 65, 91, 95, 0, 97, 123 ],
    IdStart: [ 36, 0, 65, 91, 95, 0, 97, 123, 170, 0, 186, 0, 192, 215, 216, 247, 248, 697, 736, 741, 7424, 7462, 7468, 7517, 7522, 7526, 7531, 7544, 7545, 7615, 7680, 7936, 8305, 0, 8319, 0, 8336, 8349, 8490, 8492, 8498, 0, 8526, 0, 8544, 8585, 11360, 11392, 42786, 42888, 42891, 42927, 42928, 42936, 42999, 43008, 43824, 43867, 43868, 43877, 64256, 64263, 65313, 65339, 65345, 65371 ],
    Digit: [ 48, 58 ],
    Skip: [ 0, 33, 127, 161 ]
};

const js = (t, e, s, r) => {
    const i = s.length;
    for (let n = 0; n < i; n += 2) {
        const i = s[n];
        let o = s[n + 1];
        o = o > 0 ? o : i + 1;
        if (t) t.fill(r, i, o);
        if (e) for (let t = i; t < o; t++) e.add(t);
    }
};

const Ds = t => () => {
    es();
    return t;
};

const Vs = new Set;

js(null, Vs, Ts.AsciiIdPart, true);

const Fs = new Uint8Array(65535);

js(Fs, null, Ts.IdStart, 1);

js(Fs, null, Ts.Digit, 1);

const Ns = new Array(65535);

Ns.fill(ks, 0, 65535);

js(Ns, null, Ts.Skip, (() => {
    es();
    return null;
}));

js(Ns, null, Ts.IdStart, ss);

js(Ns, null, Ts.Digit, (() => rs(false)));

Ns[34] = Ns[39] = () => is();

Ns[96] = () => ns();

Ns[33] = () => {
    if (61 !== es()) return 131118;
    if (61 !== es()) return 6553949;
    es();
    return 6553951;
};

Ns[61] = () => {
    if (62 === es()) {
        es();
        return 50;
    }
    if (61 !== _e) return 4194349;
    if (61 !== es()) return 6553948;
    es();
    return 6553950;
};

Ns[38] = () => {
    if (38 !== es()) return 6291479;
    es();
    return 6553883;
};

Ns[124] = () => {
    if (124 !== es()) return 6291480;
    es();
    return 6553818;
};

Ns[63] = () => {
    if (46 === es()) {
        const t = je(Se + 1);
        if (t <= 48 || t >= 57) {
            es();
            return 2162700;
        }
        return 6291478;
    }
    if (63 !== _e) return 6291478;
    es();
    return 6553753;
};

Ns[46] = () => {
    if (es() <= 57 && _e >= 48) return rs(true);
    if (46 === _e) {
        if (46 !== es()) return 10;
        es();
        return 11;
    }
    return 65545;
};

Ns[60] = () => {
    if (61 !== es()) return 6554016;
    es();
    return 6554018;
};

Ns[62] = () => {
    if (61 !== es()) return 6554017;
    es();
    return 6554019;
};

Ns[37] = Ds(6554155);

Ns[40] = Ds(2688007);

Ns[41] = Ds(7340046);

Ns[42] = Ds(6554154);

Ns[43] = Ds(2490854);

Ns[44] = Ds(6291471);

Ns[45] = Ds(2490855);

Ns[47] = Ds(6554156);

Ns[58] = Ds(6291476);

Ns[59] = Ds(6291477);

Ns[91] = Ds(2688016);

Ns[93] = Ds(7340051);

Ns[123] = Ds(524296);

Ns[125] = Ds(7340045);

let zs = null;

const Ks = [];

let Ws = false;

function Js() {
    Ws = false;
}

function qs() {
    Ws = true;
}

function Gs() {
    return zs;
}

function Hs(t) {
    if (null == t) throw h(`AUR0206`);
    if (null == zs) {
        zs = t;
        Ks[0] = zs;
        Ws = true;
        return;
    }
    if (zs === t) throw h(`AUR0207`);
    Ks.push(t);
    zs = t;
    Ws = true;
}

function Qs(t) {
    if (null == t) throw h(`AUR0208`);
    if (zs !== t) throw h(`AUR0209`);
    Ks.pop();
    zs = Ks.length > 0 ? Ks[Ks.length - 1] : null;
    Ws = null != zs;
}

const Xs = Object.freeze({
    get current() {
        return zs;
    },
    get connecting() {
        return Ws;
    },
    enter: Hs,
    exit: Qs,
    pause: Js,
    resume: qs
});

const Ys = Reflect.get;

const Zs = Object.prototype.toString;

const tr = new WeakMap;

function er(t) {
    switch (Zs.call(t)) {
      case "[object Object]":
      case "[object Array]":
      case "[object Map]":
      case "[object Set]":
        return true;

      default:
        return false;
    }
}

const sr = "__raw__";

function rr(t) {
    return er(t) ? ir(t) : t;
}

function ir(t) {
    return tr.get(t) ?? ur(t);
}

function nr(t) {
    return t[sr] ?? t;
}

function or(t) {
    return er(t) && t[sr] || t;
}

function cr(t) {
    return "constructor" === t || "__proto__" === t || "$observers" === t || t === Symbol.toPrimitive || t === Symbol.toStringTag;
}

function ur(t) {
    const e = w(t) ? ar : p(t) || b(t) ? _r : hr;
    const s = new Proxy(t, e);
    tr.set(t, s);
    return s;
}

const hr = {
    get(t, e, s) {
        if (e === sr) return t;
        const r = Gs();
        if (!Ws || cr(e) || null == r) return Ys(t, e, s);
        r.observe(t, e);
        return rr(Ys(t, e, s));
    }
};

const ar = {
    get(t, e, s) {
        if (e === sr) return t;
        if (!Ws || cr(e) || null == zs) return Ys(t, e, s);
        switch (e) {
          case "length":
            zs.observe(t, "length");
            return t.length;

          case "map":
            return lr;

          case "includes":
            return br;

          case "indexOf":
            return pr;

          case "lastIndexOf":
            return dr;

          case "every":
            return fr;

          case "filter":
            return wr;

          case "find":
            return gr;

          case "findIndex":
            return vr;

          case "flat":
            return Ar;

          case "flatMap":
            return xr;

          case "join":
            return mr;

          case "push":
            return Er;

          case "pop":
            return yr;

          case "reduce":
            return Lr;

          case "reduceRight":
            return Pr;

          case "reverse":
            return Sr;

          case "shift":
            return Or;

          case "unshift":
            return kr;

          case "slice":
            return Ur;

          case "splice":
            return Cr;

          case "some":
            return $r;

          case "sort":
            return Rr;

          case "keys":
            return Fr;

          case "values":
          case Symbol.iterator:
            return Nr;

          case "entries":
            return zr;
        }
        zs.observe(t, e);
        return rr(Ys(t, e, s));
    },
    ownKeys(t) {
        Gs()?.observe(t, "length");
        return Reflect.ownKeys(t);
    }
};

function lr(t, e) {
    const s = nr(this);
    const r = s.map(((s, r) => or(t.call(e, rr(s), r, this))));
    Kr(zs, s);
    return rr(r);
}

function fr(t, e) {
    const s = nr(this);
    const r = s.every(((s, r) => t.call(e, rr(s), r, this)));
    Kr(zs, s);
    return r;
}

function wr(t, e) {
    const s = nr(this);
    const r = s.filter(((s, r) => or(t.call(e, rr(s), r, this))));
    Kr(zs, s);
    return rr(r);
}

function br(t) {
    const e = nr(this);
    const s = e.includes(or(t));
    Kr(zs, e);
    return s;
}

function pr(t) {
    const e = nr(this);
    const s = e.indexOf(or(t));
    Kr(zs, e);
    return s;
}

function dr(t) {
    const e = nr(this);
    const s = e.lastIndexOf(or(t));
    Kr(zs, e);
    return s;
}

function vr(t, e) {
    const s = nr(this);
    const r = s.findIndex(((s, r) => or(t.call(e, rr(s), r, this))));
    Kr(zs, s);
    return r;
}

function gr(t, e) {
    const s = nr(this);
    const r = s.find(((e, s) => t(rr(e), s, this)), e);
    Kr(zs, s);
    return rr(r);
}

function Ar() {
    const t = nr(this);
    Kr(zs, t);
    return rr(t.flat());
}

function xr(t, e) {
    const s = nr(this);
    Kr(zs, s);
    return ir(s.flatMap(((s, r) => rr(t.call(e, rr(s), r, this)))));
}

function mr(t) {
    const e = nr(this);
    Kr(zs, e);
    return e.join(t);
}

function yr() {
    return rr(nr(this).pop());
}

function Er(...t) {
    return nr(this).push(...t);
}

function Or() {
    return rr(nr(this).shift());
}

function kr(...t) {
    return nr(this).unshift(...t);
}

function Cr(...t) {
    return rr(nr(this).splice(...t));
}

function Sr(...t) {
    const e = nr(this);
    const s = e.reverse();
    Kr(zs, e);
    return rr(s);
}

function $r(t, e) {
    const s = nr(this);
    const r = s.some(((s, r) => or(t.call(e, rr(s), r, this))));
    Kr(zs, s);
    return r;
}

function Rr(t) {
    const e = nr(this);
    const s = e.sort(t);
    Kr(zs, e);
    return rr(s);
}

function Ur(t, e) {
    const s = nr(this);
    Kr(zs, s);
    return ir(s.slice(t, e));
}

function Lr(t, e) {
    const s = nr(this);
    const r = s.reduce(((e, s, r) => t(e, rr(s), r, this)), e);
    Kr(zs, s);
    return rr(r);
}

function Pr(t, e) {
    const s = nr(this);
    const r = s.reduceRight(((e, s, r) => t(e, rr(s), r, this)), e);
    Kr(zs, s);
    return rr(r);
}

const _r = {
    get(t, e, s) {
        if (e === sr) return t;
        const r = Gs();
        if (!Ws || cr(e) || null == r) return Ys(t, e, s);
        switch (e) {
          case "size":
            r.observe(t, "size");
            return t.size;

          case "clear":
            return Dr;

          case "delete":
            return Vr;

          case "forEach":
            return Ir;

          case "add":
            if (b(t)) return jr;
            break;

          case "get":
            if (p(t)) return Br;
            break;

          case "set":
            if (p(t)) return Tr;
            break;

          case "has":
            return Mr;

          case "keys":
            return Fr;

          case "values":
            return Nr;

          case "entries":
            return zr;

          case Symbol.iterator:
            return p(t) ? zr : Nr;
        }
        return rr(Ys(t, e, s));
    }
};

function Ir(t, e) {
    const s = nr(this);
    Kr(zs, s);
    return s.forEach(((s, r) => {
        t.call(e, rr(s), rr(r), this);
    }));
}

function Mr(t) {
    const e = nr(this);
    Kr(zs, e);
    return e.has(or(t));
}

function Br(t) {
    const e = nr(this);
    Kr(zs, e);
    return rr(e.get(or(t)));
}

function Tr(t, e) {
    return rr(nr(this).set(or(t), or(e)));
}

function jr(t) {
    return rr(nr(this).add(or(t)));
}

function Dr() {
    return rr(nr(this).clear());
}

function Vr(t) {
    return rr(nr(this).delete(or(t)));
}

function Fr() {
    const t = nr(this);
    Kr(zs, t);
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
                value: rr(s),
                done: r
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

function Nr() {
    const t = nr(this);
    Kr(zs, t);
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
                value: rr(s),
                done: r
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

function zr() {
    const t = nr(this);
    Kr(zs, t);
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
                value: [ rr(s[0]), rr(s[1]) ],
                done: r
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

const Kr = (t, e) => t?.observeCollection(e);

const Wr = Object.freeze({
    getProxy: ir,
    getRaw: nr,
    wrap: rr,
    unwrap: or,
    rawKey: sr
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
    static create(t, e, s, r, i) {
        const n = s.get;
        const o = s.set;
        const c = new ComputedObserver(t, n, o, i, r);
        const h = () => c.getValue();
        h.getObserver = () => c;
        u(t, e, {
            enumerable: s.enumerable,
            configurable: true,
            get: h,
            set: t => {
                c.setValue(t);
            }
        });
        return c;
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
            Jr = this.ov;
            this.ov = this.v;
            this.subs.notify(this.v, Jr);
        }
    }
    compute() {
        this.ir = true;
        this.obs.version++;
        try {
            Hs(this);
            return this.v = or(this.$get.call(this.up ? rr(this.o) : this.o, this));
        } finally {
            this.obs.clear();
            this.ir = false;
            Qs(this);
        }
    }
}

de(ComputedObserver);

Y(ComputedObserver);

let Jr;

const qr = x("IDirtyChecker", (t => t.singleton(DirtyChecker)));

const Gr = {
    timeoutsPerCheck: 25,
    disabled: false,
    throw: false,
    resetToDefault() {
        this.timeoutsPerCheck = 6;
        this.disabled = false;
        this.throw = false;
    }
};

const Hr = {
    persistent: true
};

class DirtyChecker {
    constructor(t) {
        this.p = t;
        this.tracked = [];
        this.A = null;
        this.O = 0;
        this.check = () => {
            if (Gr.disabled) return;
            if (++this.O < Gr.timeoutsPerCheck) return;
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
        if (Gr.throw) throw h(`AUR0222:${A(e)}`);
        return new DirtyCheckProperty(this, t, e);
    }
    addProperty(t) {
        this.tracked.push(t);
        if (1 === this.tracked.length) this.A = this.p.taskQueue.queueTask(this.check, Hr);
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
        throw h(`Trying to set value for property ${A(this.key)} in dirty checker`);
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

Y(DirtyCheckProperty);

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
            if (d(t, this.v)) return;
            Qr = this.v;
            this.v = t;
            this.subs.notify(t, Qr);
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
            Qr = this.ov;
            this.ov = this.v;
            this.subs.notify(this.v, Qr);
        }
    }
}

Y(SetterObserver);

Y(SetterNotifier);

let Qr;

const Xr = new PropertyAccessor;

const Yr = x("IObserverLocator", (t => t.singleton(ObserverLocator)));

const Zr = x("INodeObserverLocator", (t => t.cachedCallback((t => new DefaultNodeObserverLocator))));

class DefaultNodeObserverLocator {
    handles() {
        return false;
    }
    getObserver() {
        return Xr;
    }
    getAccessor() {
        return Xr;
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
        if (null == t) throw ii(e);
        if (!f(t)) return new PrimitiveObserver(t, e);
        const s = ri(t);
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
        return Xr;
    }
    getArrayObserver(t) {
        return St(t);
    }
    getMapObserver(t) {
        return oe(t);
    }
    getSetObserver(t) {
        return Wt(t);
    }
    createObserver(t, e) {
        if (this.R.handles(t, e, this)) return this.R.getObserver(t, e, this);
        switch (e) {
          case "length":
            if (w(t)) return St(t).getLengthObserver();
            break;

          case "size":
            if (p(t)) return oe(t).getLengthObserver(); else if (b(t)) return Wt(t).getLengthObserver();
            break;

          default:
            if (w(t) && r(e)) return St(t).getIndexObserver(Number(e));
            break;
        }
        let s = si(t, e);
        if (void 0 === s) {
            let r = ei(t);
            while (null !== r) {
                s = si(r, e);
                if (void 0 === s) r = ei(r); else break;
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

ObserverLocator.inject = [ qr, Zr ];

const ti = t => {
    let e;
    if (w(t)) e = St(t); else if (p(t)) e = oe(t); else if (b(t)) e = Wt(t);
    return e;
};

const ei = Object.getPrototypeOf;

const si = Object.getOwnPropertyDescriptor;

const ri = t => {
    let e = t.$observers;
    if (void 0 === e) u(t, "$observers", {
        enumerable: false,
        value: e = m()
    });
    return e;
};

const ii = t => h(`AUR0199:${A(t)}`);

const ni = x("IObservation", (t => t.singleton(Observation)));

class Observation {
    constructor(t) {
        this.oL = t;
    }
    static get inject() {
        return [ Yr ];
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
            Hs(this);
            this.fn(this);
        } finally {
            this.obs.clear();
            this.running = false;
            Qs(this);
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

de(Effect);

function oi(t) {
    if (void 0 === t.$observers) u(t, "$observers", {
        value: {}
    });
    return t.$observers;
}

const ci = {};

function ui(t, e, s) {
    if (null == e) return (e, s, i) => r(e, s, i, t);
    return r(t, e, s);
    function r(t, e, s, r) {
        const i = void 0 === e;
        r = "object" !== typeof r ? {
            name: r
        } : r || {};
        if (i) e = r.name;
        if (null == e || "" === e) throw h(`AUR0224`);
        const n = r.callback || `${A(e)}Changed`;
        let o = ci;
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
            const s = hi(this, e, n, o, c);
            Gs()?.subscribeTo(s);
            return s.getValue();
        };
        s.set = function t(s) {
            hi(this, e, n, o, c).setValue(s);
        };
        s.get.getObserver = function t(s) {
            return hi(s, e, n, o, c);
        };
        if (i) u(t.prototype, e, s); else return s;
    }
}

function hi(t, e, s, r, i) {
    const n = oi(t);
    let o = n[e];
    if (null == o) {
        o = new SetterNotifier(t, s, i, r === ci ? void 0 : r);
        n[e] = o;
    }
    return o;
}

const ai = x("ISignaler", (t => t.singleton(Signaler)));

class Signaler {
    constructor() {
        this.signals = m();
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

export { AccessKeyedExpression, AccessMemberExpression, AccessScopeExpression, AccessThisExpression, N as AccessorType, ArrayBindingPattern, ArrayIndexObserver, ArrayLiteralExpression, ArrayObserver, ArrowFunction, AssignExpression, BinaryExpression, BindingBehaviorExpression, BindingContext, BindingIdentifier, BindingObserverRecord, CallFunctionExpression, CallMemberExpression, CallScopeExpression, F as CollectionKind, CollectionLengthObserver, CollectionSizeObserver, ComputedObserver, ConditionalExpression, Xs as ConnectableSwitcher, CustomExpression, DestructuringAssignmentExpression, DestructuringAssignmentRestExpression, DestructuringAssignmentSingleExpression, DirtyCheckProperty, Gr as DirtyCheckSettings, k as ExpressionKind, ke as ExpressionType, ForOfStatement, V as ICoercionConfiguration, qr as IDirtyChecker, ve as IExpressionParser, Zr as INodeObserverLocator, ni as IObservation, Yr as IObserverLocator, ai as ISignaler, Interpolation, MapObserver, ObjectBindingPattern, ObjectLiteralExpression, Observation, ObserverLocator, PrimitiveLiteralExpression, PrimitiveObserver, PropertyAccessor, Wr as ProxyObservable, Scope, SetObserver, SetterObserver, SubscriberRecord, TaggedTemplateExpression, TemplateExpression, UnaryExpression, Unparser, ValueConverterExpression, Rt as applyMutationsToIndices, U as astAssign, L as astBind, R as astEvaluate, P as astUnbind, O as astVisit, H as batch, W as cloneIndexMap, de as connectable, z as copyIndexMap, K as createIndexMap, Ct as disableArrayObservation, ne as disableMapObservation, Kt as disableSetObservation, kt as enableArrayObservation, ie as enableMapObservation, zt as enableSetObservation, ti as getCollectionObserver, ri as getObserverLookup, J as isIndexMap, ui as observable, Ve as parseExpression, Y as subscriberCollection, Ut as synchronizeIndices };
//# sourceMappingURL=index.mjs.map
