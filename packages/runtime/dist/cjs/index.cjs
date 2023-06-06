"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

const c = String;

const u = e.DI.createInterface;

const createLookup = () => r.create(null);

const l = t.Metadata.getOwn;

t.Metadata.hasOwn;

const h = t.Metadata.define;

e.Protocol.annotation.keyFor;

e.Protocol.resource.keyFor;

e.Protocol.resource.appendTo;

const astVisit = (e, t) => {
    switch (e.$kind) {
      case 11:
        return t.visitAccessKeyed(e);

      case 10:
        return t.visitAccessMember(e);

      case 1:
        return t.visitAccessScope(e);

      case 0:
        return t.visitAccessThis(e);

      case 19:
        return t.visitArrayBindingPattern(e);

      case 24:
        return t.visitDestructuringAssignmentExpression(e);

      case 2:
        return t.visitArrayLiteral(e);

      case 16:
        return t.visitArrowFunction(e);

      case 15:
        return t.visitAssign(e);

      case 13:
        return t.visitBinary(e);

      case 18:
        return t.visitBindingBehavior(e);

      case 21:
        return t.visitBindingIdentifier(e);

      case 9:
        return t.visitCallFunction(e);

      case 8:
        return t.visitCallMember(e);

      case 7:
        return t.visitCallScope(e);

      case 14:
        return t.visitConditional(e);

      case 26:
        return t.visitDestructuringAssignmentSingleExpression(e);

      case 22:
        return t.visitForOfStatement(e);

      case 23:
        return t.visitInterpolation(e);

      case 20:
        return t.visitObjectBindingPattern(e);

      case 25:
        return t.visitDestructuringAssignmentExpression(e);

      case 3:
        return t.visitObjectLiteral(e);

      case 4:
        return t.visitPrimitiveLiteral(e);

      case 12:
        return t.visitTaggedTemplate(e);

      case 5:
        return t.visitTemplate(e);

      case 6:
        return t.visitUnary(e);

      case 17:
        return t.visitValueConverter(e);

      case 28:
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
        const r = t === 25;
        this.text += r ? "{" : "[";
        const n = e.list;
        const i = n.length;
        let o;
        let a;
        for (o = 0; o < i; o++) {
            a = n[o];
            switch (a.$kind) {
              case 26:
                astVisit(a, this);
                break;

              case 24:
              case 25:
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
        this.text += c(e.value);
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

exports.ExpressionKind = void 0;

(function(e) {
    e[e["AccessThis"] = 0] = "AccessThis";
    e[e["AccessScope"] = 1] = "AccessScope";
    e[e["ArrayLiteral"] = 2] = "ArrayLiteral";
    e[e["ObjectLiteral"] = 3] = "ObjectLiteral";
    e[e["PrimitiveLiteral"] = 4] = "PrimitiveLiteral";
    e[e["Template"] = 5] = "Template";
    e[e["Unary"] = 6] = "Unary";
    e[e["CallScope"] = 7] = "CallScope";
    e[e["CallMember"] = 8] = "CallMember";
    e[e["CallFunction"] = 9] = "CallFunction";
    e[e["AccessMember"] = 10] = "AccessMember";
    e[e["AccessKeyed"] = 11] = "AccessKeyed";
    e[e["TaggedTemplate"] = 12] = "TaggedTemplate";
    e[e["Binary"] = 13] = "Binary";
    e[e["Conditional"] = 14] = "Conditional";
    e[e["Assign"] = 15] = "Assign";
    e[e["ArrowFunction"] = 16] = "ArrowFunction";
    e[e["ValueConverter"] = 17] = "ValueConverter";
    e[e["BindingBehavior"] = 18] = "BindingBehavior";
    e[e["ArrayBindingPattern"] = 19] = "ArrayBindingPattern";
    e[e["ObjectBindingPattern"] = 20] = "ObjectBindingPattern";
    e[e["BindingIdentifier"] = 21] = "BindingIdentifier";
    e[e["ForOfStatement"] = 22] = "ForOfStatement";
    e[e["Interpolation"] = 23] = "Interpolation";
    e[e["ArrayDestructuring"] = 24] = "ArrayDestructuring";
    e[e["ObjectDestructuring"] = 25] = "ObjectDestructuring";
    e[e["DestructuringAssignmentLeaf"] = 26] = "DestructuringAssignmentLeaf";
    e[e["DestructuringAssignmentRestLeaf"] = 27] = "DestructuringAssignmentRestLeaf";
    e[e["Custom"] = 28] = "Custom";
})(exports.ExpressionKind || (exports.ExpressionKind = {}));

class CustomExpression {
    constructor(e) {
        this.value = e;
        this.$kind = 28;
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
        this.$kind = 18;
        this.key = `_bb_${t}`;
    }
}

class ValueConverterExpression {
    constructor(e, t, r) {
        this.expression = e;
        this.name = t;
        this.args = r;
        this.$kind = 17;
    }
}

class AssignExpression {
    constructor(e, t) {
        this.target = e;
        this.value = t;
        this.$kind = 15;
    }
}

class ConditionalExpression {
    constructor(e, t, r) {
        this.condition = e;
        this.yes = t;
        this.no = r;
        this.$kind = 14;
    }
}

class AccessThisExpression {
    constructor(e = 0) {
        this.ancestor = e;
        this.$kind = 0;
    }
}

AccessThisExpression.$this = new AccessThisExpression(0);

AccessThisExpression.$parent = new AccessThisExpression(1);

class AccessScopeExpression {
    constructor(e, t = 0) {
        this.name = e;
        this.ancestor = t;
        this.$kind = 1;
    }
}

class AccessMemberExpression {
    constructor(e, t, r = false) {
        this.object = e;
        this.name = t;
        this.optional = r;
        this.$kind = 10;
    }
}

class AccessKeyedExpression {
    constructor(e, t, r = false) {
        this.object = e;
        this.key = t;
        this.optional = r;
        this.$kind = 11;
    }
}

class CallScopeExpression {
    constructor(e, t, r = 0, n = false) {
        this.name = e;
        this.args = t;
        this.ancestor = r;
        this.optional = n;
        this.$kind = 7;
    }
}

class CallMemberExpression {
    constructor(e, t, r, n = false, i = false) {
        this.object = e;
        this.name = t;
        this.args = r;
        this.optionalMember = n;
        this.optionalCall = i;
        this.$kind = 8;
    }
}

class CallFunctionExpression {
    constructor(e, t, r = false) {
        this.func = e;
        this.args = t;
        this.optional = r;
        this.$kind = 9;
    }
}

class BinaryExpression {
    constructor(e, t, r) {
        this.operation = e;
        this.left = t;
        this.right = r;
        this.$kind = 13;
    }
}

class UnaryExpression {
    constructor(e, t) {
        this.operation = e;
        this.expression = t;
        this.$kind = 6;
    }
}

class PrimitiveLiteralExpression {
    constructor(e) {
        this.value = e;
        this.$kind = 4;
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
        this.$kind = 2;
    }
}

ArrayLiteralExpression.$empty = new ArrayLiteralExpression(e.emptyArray);

class ObjectLiteralExpression {
    constructor(e, t) {
        this.keys = e;
        this.values = t;
        this.$kind = 3;
    }
}

ObjectLiteralExpression.$empty = new ObjectLiteralExpression(e.emptyArray, e.emptyArray);

class TemplateExpression {
    constructor(t, r = e.emptyArray) {
        this.cooked = t;
        this.expressions = r;
        this.$kind = 5;
    }
}

TemplateExpression.$empty = new TemplateExpression([ "" ]);

class TaggedTemplateExpression {
    constructor(t, r, n, i = e.emptyArray) {
        this.cooked = t;
        this.func = n;
        this.expressions = i;
        this.$kind = 12;
        t.raw = r;
    }
}

class ArrayBindingPattern {
    constructor(e) {
        this.elements = e;
        this.$kind = 19;
    }
}

class ObjectBindingPattern {
    constructor(e, t) {
        this.keys = e;
        this.values = t;
        this.$kind = 20;
    }
}

class BindingIdentifier {
    constructor(e) {
        this.name = e;
        this.$kind = 21;
    }
}

class ForOfStatement {
    constructor(e, t, r) {
        this.declaration = e;
        this.iterable = t;
        this.semiIdx = r;
        this.$kind = 22;
    }
}

class Interpolation {
    constructor(t, r = e.emptyArray) {
        this.parts = t;
        this.expressions = r;
        this.$kind = 23;
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
        this.$kind = 26;
    }
}

class DestructuringAssignmentRestExpression {
    constructor(e, t) {
        this.target = e;
        this.indexOrProperties = t;
        this.$kind = 26;
    }
}

class ArrowFunction {
    constructor(e, t, r = false) {
        this.args = e;
        this.body = t;
        this.rest = r;
        this.$kind = 16;
    }
}

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
            throw nullScopeError();
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
            throw nullContextError();
        }
        return new Scope(null, e, t == null ? new OverrideContext : t, r ?? false);
    }
    static fromParent(e, t) {
        if (e == null) {
            throw nullScopeError();
        }
        return new Scope(e, t, new OverrideContext, false);
    }
}

const nullScopeError = () => createError(`AUR0203`);

const nullContextError = () => createError("AUR0204");

class OverrideContext {}

const f = Scope.getContext;

function astEvaluate(e, t, r, n) {
    switch (e.$kind) {
      case 0:
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

      case 1:
        {
            const i = f(t, e.name, e.ancestor);
            if (n !== null) {
                n.observe(i, e.name);
            }
            const o = i[e.name];
            if (o == null && e.name === "$host") {
                throw createError(`AUR0105`);
            }
            if (r?.strict) {
                return r?.boundFn && isFunction(o) ? o.bind(i) : o;
            }
            return o == null ? "" : r?.boundFn && isFunction(o) ? o.bind(i) : o;
        }

      case 2:
        return e.elements.map((e => astEvaluate(e, t, r, n)));

      case 3:
        {
            const i = {};
            for (let o = 0; o < e.keys.length; ++o) {
                i[e.keys[o]] = astEvaluate(e.values[o], t, r, n);
            }
            return i;
        }

      case 4:
        return e.value;

      case 5:
        {
            let i = e.cooked[0];
            for (let o = 0; o < e.expressions.length; ++o) {
                i += String(astEvaluate(e.expressions[o], t, r, n));
                i += e.cooked[o + 1];
            }
            return i;
        }

      case 6:
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
            throw createError(`AUR0109:${e.operation}`);
        }

      case 7:
        {
            const i = e.args.map((e => astEvaluate(e, t, r, n)));
            const o = f(t, e.name, e.ancestor);
            const a = getFunction(r?.strictFnCall, o, e.name);
            if (a) {
                return a.apply(o, i);
            }
            return void 0;
        }

      case 8:
        {
            const i = astEvaluate(e.object, t, r, n);
            const o = e.args.map((e => astEvaluate(e, t, r, n)));
            const a = getFunction(r?.strictFnCall, i, e.name);
            let c;
            if (a) {
                c = a.apply(i, o);
                if (isArray(i) && p.includes(e.name)) {
                    n?.observeCollection(i);
                }
            }
            return c;
        }

      case 9:
        {
            const i = astEvaluate(e.func, t, r, n);
            if (isFunction(i)) {
                return i(...e.args.map((e => astEvaluate(e, t, r, n))));
            }
            if (!r?.strictFnCall && i == null) {
                return void 0;
            }
            throw createError(`AUR0107`);
        }

      case 16:
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

      case 10:
        {
            const i = astEvaluate(e.object, t, r, n);
            let o;
            if (r?.strict) {
                if (i == null) {
                    return undefined;
                }
                if (n !== null) {
                    n.observe(i, e.name);
                }
                o = i[e.name];
                if (r?.boundFn && isFunction(o)) {
                    return o.bind(i);
                }
                return o;
            }
            if (n !== null && isObject(i)) {
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

      case 11:
        {
            const i = astEvaluate(e.object, t, r, n);
            const o = astEvaluate(e.key, t, r, n);
            if (isObject(i)) {
                if (n !== null) {
                    n.observe(i, o);
                }
                return i[o];
            }
            return i == null ? void 0 : i[o];
        }

      case 12:
        {
            const i = e.expressions.map((e => astEvaluate(e, t, r, n)));
            const o = astEvaluate(e.func, t, r, n);
            if (!isFunction(o)) {
                throw createError(`AUR0110`);
            }
            return o(e.cooked, ...i);
        }

      case 13:
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
                throw createError(`AUR0108:${e.operation}`);
            }
        }

      case 14:
        return astEvaluate(e.condition, t, r, n) ? astEvaluate(e.yes, t, r, n) : astEvaluate(e.no, t, r, n);

      case 15:
        return astAssign(e.target, t, r, astEvaluate(e.value, t, r, n));

      case 17:
        {
            const i = r?.getConverter?.(e.name);
            if (i == null) {
                throw createError(`AUR0103:${e.name}`);
            }
            if ("toView" in i) {
                return i.toView(astEvaluate(e.expression, t, r, n), ...e.args.map((e => astEvaluate(e, t, r, n))));
            }
            return astEvaluate(e.expression, t, r, n);
        }

      case 18:
        return astEvaluate(e.expression, t, r, n);

      case 21:
        return e.name;

      case 22:
        return astEvaluate(e.iterable, t, r, n);

      case 23:
        if (e.isMulti) {
            let i = e.parts[0];
            let o = 0;
            for (;o < e.expressions.length; ++o) {
                i += c(astEvaluate(e.expressions[o], t, r, n));
                i += e.parts[o + 1];
            }
            return i;
        } else {
            return `${e.parts[0]}${astEvaluate(e.firstExpression, t, r, n)}${e.parts[1]}`;
        }

      case 26:
        return astEvaluate(e.target, t, r, n);

      case 24:
        {
            return e.list.map((e => astEvaluate(e, t, r, n)));
        }

      case 19:
      case 20:
      case 25:
      default:
        return void 0;

      case 28:
        return e.evaluate(t, r, n);
    }
}

function astAssign(t, r, n, i) {
    switch (t.$kind) {
      case 1:
        {
            if (t.name === "$host") {
                throw createError(`AUR0106`);
            }
            const e = f(r, t.name, t.ancestor);
            return e[t.name] = i;
        }

      case 10:
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

      case 11:
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

      case 15:
        astAssign(t.value, r, n, i);
        return astAssign(t.target, r, n, i);

      case 17:
        {
            const e = n?.getConverter?.(t.name);
            if (e == null) {
                throw converterNotFoundError(t.name);
            }
            if ("fromView" in e) {
                i = e.fromView(i, ...t.args.map((e => astEvaluate(e, r, n, null))));
            }
            return astAssign(t.expression, r, n, i);
        }

      case 18:
        return astAssign(t.expression, r, n, i);

      case 24:
      case 25:
        {
            const e = t.list;
            const o = e.length;
            let a;
            let c;
            for (a = 0; a < o; a++) {
                c = e[a];
                switch (c.$kind) {
                  case 26:
                    astAssign(c, r, n, i);
                    break;

                  case 24:
                  case 25:
                    {
                        if (typeof i !== "object" || i === null) {
                            {
                                throw createError(`AUR0112`);
                            }
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

      case 26:
        {
            if (t instanceof DestructuringAssignmentSingleExpression) {
                if (i == null) {
                    return;
                }
                if (typeof i !== "object") {
                    {
                        throw createError(`AUR0112`);
                    }
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
                    {
                        throw createError(`AUR0112`);
                    }
                }
                const o = t.indexOrProperties;
                let a;
                if (e.isArrayIndex(o)) {
                    if (!Array.isArray(i)) {
                        {
                            throw createError(`AUR0112`);
                        }
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

      case 28:
        return t.assign(r, n, i);

      default:
        return void 0;
    }
}

function astBind(e, t, r) {
    switch (e.$kind) {
      case 18:
        {
            const n = e.name;
            const i = e.key;
            const o = r.getBehavior?.(n);
            if (o == null) {
                throw behaviorNotFoundError(n);
            }
            if (r[i] === void 0) {
                r[i] = o;
                o.bind?.(t, r, ...e.args.map((e => astEvaluate(e, t, r, null))));
            } else {
                throw duplicateBehaviorAppliedError(n);
            }
            astBind(e.expression, t, r);
            return;
        }

      case 17:
        {
            const n = e.name;
            const i = r.getConverter?.(n);
            if (i == null) {
                throw converterNotFoundError(n);
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

      case 22:
        {
            astBind(e.iterable, t, r);
            break;
        }

      case 28:
        {
            e.bind?.(t, r);
        }
    }
}

function astUnbind(e, t, r) {
    switch (e.$kind) {
      case 18:
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

      case 17:
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

      case 22:
        {
            astUnbind(e.iterable, t, r);
            break;
        }

      case 28:
        {
            e.unbind?.(t, r);
        }
    }
}

const behaviorNotFoundError = e => createError(`AUR0101:${e}`);

const duplicateBehaviorAppliedError = e => createError(`AUR0102:${e}`);

const converterNotFoundError = e => createError(`AUR0103:${e}`);

const getFunction = (e, t, r) => {
    const n = t == null ? null : t[r];
    if (isFunction(n)) {
        return n;
    }
    if (!e && n == null) {
        return null;
    }
    throw createError(`AUR0111:${r}`);
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

const p = "at map filter includes indexOf lastIndexOf findIndex find flat flatMap join reduce reduceRight slice every some sort".split(" ");

const d = /*@__PURE__*/ e.DI.createInterface("ICoercionConfiguration");

exports.CollectionKind = void 0;

(function(e) {
    e[e["indexed"] = 8] = "indexed";
    e[e["keyed"] = 4] = "keyed";
    e[e["array"] = 9] = "array";
    e[e["map"] = 6] = "map";
    e[e["set"] = 7] = "set";
})(exports.CollectionKind || (exports.CollectionKind = {}));

exports.AccessorType = void 0;

(function(e) {
    e[e["None"] = 0] = "None";
    e[e["Observer"] = 1] = "Observer";
    e[e["Node"] = 2] = "Node";
    e[e["Layout"] = 4] = "Layout";
})(exports.AccessorType || (exports.AccessorType = {}));

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

let w = new Map;

let b = false;

function batch(e) {
    const t = w;
    const r = w = new Map;
    b = true;
    try {
        e();
    } finally {
        w = null;
        b = false;
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
            w = t;
        }
    }
}

function addCollectionBatch(e, t, r) {
    if (!w.has(e)) {
        w.set(e, [ 2, t, r ]);
    }
}

function addValueBatch(e, t, r) {
    const n = w.get(e);
    if (n === void 0) {
        w.set(e, [ 1, t, r ]);
    } else {
        n[1] = t;
        n[2] = r;
    }
}

function subscriberCollection(e) {
    return e == null ? subscriberCollectionDeco : subscriberCollectionDeco(e);
}

const v = new WeakSet;

function subscriberCollectionDeco(e) {
    if (v.has(e)) {
        return;
    }
    v.add(e);
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
        if (b) {
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
        this.type = 1;
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
        this.type = 1;
        this.v = (this.o = e.collection).size;
    }
    getValue() {
        return this.o.size;
    }
    setValue() {
        throw createError(`AUR02`);
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

const x = Symbol.for("__au_arr_obs__");

const A = Array[x] ?? defineHiddenProp(Array, x, new WeakMap);

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
    let A, E, y, C;
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
        A = u;
        E = f;
        y = r + 1;
        C = n - 1;
        e[o] = e[y];
        t[o] = t[y];
        e[y] = A;
        t[y] = E;
        e: for (a = y + 1; a < C; a++) {
            m = e[a];
            k = t[a];
            O = i(m, A);
            if (O < 0) {
                e[a] = e[y];
                t[a] = t[y];
                e[y] = m;
                t[y] = k;
                y++;
            } else if (O > 0) {
                do {
                    C--;
                    if (C == a) {
                        break e;
                    }
                    S = e[C];
                    O = i(S, A);
                } while (O > 0);
                e[a] = e[C];
                t[a] = t[C];
                e[C] = m;
                t[C] = k;
                if (O < 0) {
                    m = e[a];
                    k = t[a];
                    e[a] = e[y];
                    t[a] = t[y];
                    e[y] = m;
                    t[y] = k;
                    y++;
                }
            }
        }
        if (n - C < y - r) {
            quickSort(e, t, C, n, i);
            n = y;
        } else {
            quickSort(e, t, r, y, i);
            r = C;
        }
    }
}

const E = Array.prototype;

const y = E.push;

const C = E.unshift;

const m = E.pop;

const k = E.shift;

const O = E.splice;

const S = E.reverse;

const R = E.sort;

const T = {
    push: y,
    unshift: C,
    pop: m,
    shift: k,
    splice: O,
    reverse: S,
    sort: R
};

const P = [ "push", "unshift", "pop", "shift", "splice", "reverse", "sort" ];

const $ = {
    push: function(...e) {
        const t = A.get(this);
        if (t === void 0) {
            return y.apply(this, e);
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
        const t = A.get(this);
        if (t === void 0) {
            return C.apply(this, e);
        }
        const r = e.length;
        const n = new Array(r);
        let i = 0;
        while (i < r) {
            n[i++] = -2;
        }
        C.apply(t.indexMap, n);
        const o = C.apply(this, e);
        t.notify();
        return o;
    },
    pop: function() {
        const e = A.get(this);
        if (e === void 0) {
            return m.call(this);
        }
        const t = e.indexMap;
        const r = m.call(this);
        const n = t.length - 1;
        if (t[n] > -1) {
            t.deletedIndices.push(t[n]);
            t.deletedItems.push(r);
        }
        m.call(t);
        e.notify();
        return r;
    },
    shift: function() {
        const e = A.get(this);
        if (e === void 0) {
            return k.call(this);
        }
        const t = e.indexMap;
        const r = k.call(this);
        if (t[0] > -1) {
            t.deletedIndices.push(t[0]);
            t.deletedItems.push(r);
        }
        k.call(t);
        e.notify();
        return r;
    },
    splice: function(...e) {
        const t = e[0];
        const r = e[1];
        const n = A.get(this);
        if (n === void 0) {
            return O.apply(this, e);
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
            O.call(c, t, r, ...n);
        } else {
            O.apply(c, e);
        }
        const f = O.apply(this, e);
        if (l > 0 || h > 0) {
            n.notify();
        }
        return f;
    },
    reverse: function() {
        const e = A.get(this);
        if (e === void 0) {
            S.call(this);
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
        const t = A.get(this);
        if (t === void 0) {
            R.call(this, e);
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
        if (i) {
            t.notify();
        }
        return this;
    }
};

for (const e of P) {
    i($[e], "observing", {
        value: true,
        writable: false,
        configurable: false,
        enumerable: false
    });
}

let I = false;

const U = "__au_arr_on__";

function enableArrayObservation() {
    if (!(l(U, Array) ?? false)) {
        h(U, true, Array);
        for (const e of P) {
            if (E[e].observing !== true) {
                defineHiddenProp(E, e, $[e]);
            }
        }
    }
}

function disableArrayObservation() {
    for (const e of P) {
        if (E[e].observing === true) {
            defineHiddenProp(E, e, T[e]);
        }
    }
}

class ArrayObserver {
    constructor(e) {
        this.type = 1;
        if (!I) {
            I = true;
            enableArrayObservation();
        }
        this.indexObservers = {};
        this.collection = e;
        this.indexMap = createIndexMap(e.length);
        this.lenObs = void 0;
        A.set(e, this);
    }
    notify() {
        const e = this.subs;
        const t = this.indexMap;
        if (b) {
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
    let t = A.get(e);
    if (t === void 0) {
        t = new ArrayObserver(e);
    }
    return t;
}

const compareNumber = (e, t) => e - t;

function applyMutationsToIndices(e) {
    let t = 0;
    let r = 0;
    let n = 0;
    const i = cloneIndexMap(e);
    if (i.deletedIndices.length > 1) {
        i.deletedIndices.sort(compareNumber);
    }
    const o = i.length;
    for (;n < o; ++n) {
        while (i.deletedIndices[r] <= n - t) {
            ++r;
            --t;
        }
        if (i[n] === -2) {
            ++t;
        } else {
            i[n] += t;
        }
    }
    return i;
}

function synchronizeIndices(e, t) {
    const r = e.slice();
    const n = t.length;
    let i = 0;
    let o = 0;
    while (i < n) {
        o = t[i];
        if (o !== -2) {
            e[i] = r[o];
        }
        ++i;
    }
}

const L = Symbol.for("__au_set_obs__");

const M = Set[L] ?? defineHiddenProp(Set, L, new WeakMap);

const _ = Set.prototype;

const B = _.add;

const D = _.clear;

const j = _.delete;

const F = {
    add: B,
    clear: D,
    delete: j
};

const N = [ "add", "clear", "delete" ];

const V = {
    add: function(e) {
        const t = M.get(this);
        if (t === undefined) {
            B.call(this, e);
            return this;
        }
        const r = this.size;
        B.call(this, e);
        const n = this.size;
        if (n === r) {
            return this;
        }
        t.indexMap[r] = -2;
        t.notify();
        return this;
    },
    clear: function() {
        const e = M.get(this);
        if (e === undefined) {
            return D.call(this);
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
            D.call(this);
            t.length = 0;
            e.notify();
        }
        return undefined;
    },
    delete: function(e) {
        const t = M.get(this);
        if (t === undefined) {
            return j.call(this, e);
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
                const o = j.call(this, e);
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

const H = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const e of N) {
    i(V[e], "observing", {
        value: true,
        writable: false,
        configurable: false,
        enumerable: false
    });
}

let K = false;

const z = "__au_set_on__";

function enableSetObservation() {
    if (!(l(z, Set) ?? false)) {
        h(z, true, Set);
        for (const e of N) {
            if (_[e].observing !== true) {
                i(_, e, {
                    ...H,
                    value: V[e]
                });
            }
        }
    }
}

function disableSetObservation() {
    for (const e of N) {
        if (_[e].observing === true) {
            i(_, e, {
                ...H,
                value: F[e]
            });
        }
    }
}

class SetObserver {
    constructor(e) {
        this.type = 1;
        if (!K) {
            K = true;
            enableSetObservation();
        }
        this.collection = e;
        this.indexMap = createIndexMap(e.size);
        this.lenObs = void 0;
        M.set(e, this);
    }
    notify() {
        const e = this.subs;
        const t = this.indexMap;
        if (b) {
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
    let t = M.get(e);
    if (t === void 0) {
        t = new SetObserver(e);
    }
    return t;
}

const W = Symbol.for("__au_map_obs__");

const q = Map[W] ?? defineHiddenProp(Map, W, new WeakMap);

const J = Map.prototype;

const G = J.set;

const Q = J.clear;

const X = J.delete;

const Y = {
    set: G,
    clear: Q,
    delete: X
};

const Z = [ "set", "clear", "delete" ];

const ee = {
    set: function(e, t) {
        const r = q.get(this);
        if (r === undefined) {
            G.call(this, e, t);
            return this;
        }
        const n = this.get(e);
        const i = this.size;
        G.call(this, e, t);
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
        const e = q.get(this);
        if (e === undefined) {
            return Q.call(this);
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
            Q.call(this);
            t.length = 0;
            e.notify();
        }
        return undefined;
    },
    delete: function(e) {
        const t = q.get(this);
        if (t === undefined) {
            return X.call(this, e);
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
                const o = X.call(this, e);
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

const te = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const e of Z) {
    i(ee[e], "observing", {
        value: true,
        writable: false,
        configurable: false,
        enumerable: false
    });
}

let se = false;

const re = "__au_map_on__";

function enableMapObservation() {
    if (!(l(re, Map) ?? false)) {
        h(re, true, Map);
        for (const e of Z) {
            if (J[e].observing !== true) {
                i(J, e, {
                    ...te,
                    value: ee[e]
                });
            }
        }
    }
}

function disableMapObservation() {
    for (const e of Z) {
        if (J[e].observing === true) {
            i(J, e, {
                ...te,
                value: Y[e]
            });
        }
    }
}

class MapObserver {
    constructor(e) {
        this.type = 1;
        if (!se) {
            se = true;
            enableMapObservation();
        }
        this.collection = e;
        this.indexMap = createIndexMap(e.size);
        this.lenObs = void 0;
        q.set(e, this);
    }
    notify() {
        const e = this.subs;
        const t = this.indexMap;
        if (b) {
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
    let t = q.get(e);
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
        throw createError(`AUR0210`);
    }
    this.obs.add(t);
}

function subscribeTo(e) {
    this.obs.add(e);
}

function noopHandleChange() {
    throw createError(`AUR2011:handleChange`);
}

function noopHandleCollectionChange() {
    throw createError(`AUR2011:handleCollectionChange`);
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

const ne = u("IExpressionParser", (e => e.singleton(ExpressionParser)));

class ExpressionParser {
    constructor() {
        this.i = createLookup();
        this.u = createLookup();
        this.h = createLookup();
    }
    parse(e, t) {
        let r;
        switch (t) {
          case 32:
            return new CustomExpression(e);

          case 1:
            r = this.h[e];
            if (r === void 0) {
                r = this.h[e] = this.$parse(e, t);
            }
            return r;

          case 2:
            r = this.u[e];
            if (r === void 0) {
                r = this.u[e] = this.$parse(e, t);
            }
            return r;

          default:
            {
                if (e.length === 0) {
                    if ((t & (8 | 16)) > 0) {
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
        he = e;
        fe = 0;
        pe = e.length;
        de = 0;
        we = 0;
        be = 6291456;
        ve = "";
        xe = $charCodeAt(0);
        ge = true;
        Ae = false;
        Ee = -1;
        return parse(61, t === void 0 ? 16 : t);
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

const ie = PrimitiveLiteralExpression.$false;

const oe = PrimitiveLiteralExpression.$true;

const ae = PrimitiveLiteralExpression.$null;

const ce = PrimitiveLiteralExpression.$undefined;

const ue = AccessThisExpression.$this;

const le = AccessThisExpression.$parent;

exports.ExpressionType = void 0;

(function(e) {
    e[e["None"] = 0] = "None";
    e[e["Interpolation"] = 1] = "Interpolation";
    e[e["IsIterator"] = 2] = "IsIterator";
    e[e["IsChainable"] = 4] = "IsChainable";
    e[e["IsFunction"] = 8] = "IsFunction";
    e[e["IsProperty"] = 16] = "IsProperty";
    e[e["IsCustom"] = 32] = "IsCustom";
})(exports.ExpressionType || (exports.ExpressionType = {}));

let he = "";

let fe = 0;

let pe = 0;

let de = 0;

let we = 0;

let be = 6291456;

let ve = "";

let xe;

let ge = true;

let Ae = false;

let Ee = -1;

const ye = String.fromCharCode;

const $charCodeAt = e => he.charCodeAt(e);

const $tokenRaw = () => he.slice(we, fe);

function parseExpression(e, t) {
    he = e;
    fe = 0;
    pe = e.length;
    de = 0;
    we = 0;
    be = 6291456;
    ve = "";
    xe = $charCodeAt(0);
    ge = true;
    Ae = false;
    Ee = -1;
    return parse(61, t === void 0 ? 16 : t);
}

function parse(e, t) {
    if (t === 32) {
        return new CustomExpression(he);
    }
    if (fe === 0) {
        if (t & 1) {
            return parseInterpolation();
        }
        nextToken();
        if (be & 4194304) {
            throw invalidStartOfExpression();
        }
    }
    ge = 513 > e;
    Ae = false;
    let r = false;
    let n = void 0;
    let i = 0;
    if (be & 131072) {
        const e = Ce[be & 63];
        nextToken();
        n = new UnaryExpression(e, parse(514, t));
        ge = false;
    } else {
        e: switch (be) {
          case 12294:
            i = de;
            ge = false;
            do {
                nextToken();
                ++i;
                switch (be) {
                  case 65545:
                    nextToken();
                    if ((be & 12288) === 0) {
                        throw expectedIdentifier();
                    }
                    break;

                  case 10:
                  case 11:
                    throw expectedIdentifier();

                  case 2162700:
                    Ae = true;
                    nextToken();
                    if ((be & 12288) === 0) {
                        n = i === 0 ? ue : i === 1 ? le : new AccessThisExpression(i);
                        r = true;
                        break e;
                    }
                    break;

                  default:
                    if (be & 2097152) {
                        n = i === 0 ? ue : i === 1 ? le : new AccessThisExpression(i);
                        break e;
                    }
                    throw invalidMemberExpression();
                }
            } while (be === 12294);

          case 4096:
            {
                const e = ve;
                if (t & 2) {
                    n = new BindingIdentifier(e);
                } else {
                    n = new AccessScopeExpression(e, i);
                }
                ge = !Ae;
                nextToken();
                if (consumeOpt(50)) {
                    if (be === 524296) {
                        throw functionBodyInArrowFN();
                    }
                    const t = Ae;
                    const r = de;
                    ++de;
                    const i = parse(62, 0);
                    Ae = t;
                    de = r;
                    ge = false;
                    n = new ArrowFunction([ new BindingIdentifier(e) ], i);
                }
                break;
            }

          case 10:
            throw unexpectedDoubleDot();

          case 11:
            throw invalidSpreadOp();

          case 12292:
            ge = false;
            nextToken();
            switch (de) {
              case 0:
                n = ue;
                break;

              case 1:
                n = le;
                break;

              default:
                n = new AccessThisExpression(de);
                break;
            }
            break;

          case 2688007:
            n = parseCoverParenthesizedExpressionAndArrowParameterList(t);
            break;

          case 2688016:
            n = he.search(/\s+of\s+/) > fe ? parseArrayDestructuring() : parseArrayLiteralExpression(t);
            break;

          case 524296:
            n = parseObjectLiteralExpression(t);
            break;

          case 2163759:
            n = new TemplateExpression([ ve ]);
            ge = false;
            nextToken();
            break;

          case 2163760:
            n = parseTemplate(t, n, false);
            break;

          case 16384:
          case 32768:
            n = new PrimitiveLiteralExpression(ve);
            ge = false;
            nextToken();
            break;

          case 8194:
          case 8195:
          case 8193:
          case 8192:
            n = Ce[be & 63];
            ge = false;
            nextToken();
            break;

          default:
            if (fe >= pe) {
                throw unexpectedEndOfExpression();
            } else {
                throw unconsumedToken();
            }
        }
        if (t & 2) {
            return parseForOfStatement(n);
        }
        if (514 < e) {
            return n;
        }
        if (be === 10 || be === 11) {
            throw expectedIdentifier();
        }
        if (n.$kind === 0) {
            switch (be) {
              case 2162700:
                Ae = true;
                ge = false;
                nextToken();
                if ((be & 13312) === 0) {
                    throw unexpectedTokenInOptionalChain();
                }
                if (be & 12288) {
                    n = new AccessScopeExpression(ve, n.ancestor);
                    nextToken();
                } else if (be === 2688007) {
                    n = new CallFunctionExpression(n, parseArguments(), true);
                } else if (be === 2688016) {
                    n = parseKeyedExpression(n, true);
                } else {
                    throw invalidTaggedTemplateOnOptionalChain();
                }
                break;

              case 65545:
                ge = !Ae;
                nextToken();
                if ((be & 12288) === 0) {
                    throw expectedIdentifier();
                }
                n = new AccessScopeExpression(ve, n.ancestor);
                nextToken();
                break;

              case 10:
              case 11:
                throw expectedIdentifier();

              case 2688007:
                n = new CallFunctionExpression(n, parseArguments(), r);
                break;

              case 2688016:
                n = parseKeyedExpression(n, r);
                break;

              case 2163759:
                n = createTemplateTail(n);
                break;

              case 2163760:
                n = parseTemplate(t, n, true);
                break;
            }
        }
        while ((be & 65536) > 0) {
            switch (be) {
              case 2162700:
                n = parseOptionalChainLHS(n);
                break;

              case 65545:
                nextToken();
                if ((be & 12288) === 0) {
                    throw expectedIdentifier();
                }
                n = parseMemberExpressionLHS(n, false);
                break;

              case 10:
              case 11:
                throw expectedIdentifier();

              case 2688007:
                if (n.$kind === 1) {
                    n = new CallScopeExpression(n.name, parseArguments(), n.ancestor, false);
                } else if (n.$kind === 10) {
                    n = new CallMemberExpression(n.object, n.name, parseArguments(), n.optional, false);
                } else {
                    n = new CallFunctionExpression(n, parseArguments(), false);
                }
                break;

              case 2688016:
                n = parseKeyedExpression(n, false);
                break;

              case 2163759:
                if (Ae) {
                    throw invalidTaggedTemplateOnOptionalChain();
                }
                n = createTemplateTail(n);
                break;

              case 2163760:
                if (Ae) {
                    throw invalidTaggedTemplateOnOptionalChain();
                }
                n = parseTemplate(t, n, true);
                break;
            }
        }
    }
    if (be === 10 || be === 11) {
        throw expectedIdentifier();
    }
    if (513 < e) {
        return n;
    }
    while ((be & 262144) > 0) {
        const r = be;
        if ((r & 960) <= e) {
            break;
        }
        nextToken();
        n = new BinaryExpression(Ce[r & 63], n, parse(r & 960, t));
        ge = false;
    }
    if (63 < e) {
        return n;
    }
    if (consumeOpt(6291478)) {
        const e = parse(62, t);
        consume(6291476);
        n = new ConditionalExpression(n, e, parse(62, t));
        ge = false;
    }
    if (62 < e) {
        return n;
    }
    if (consumeOpt(4194349)) {
        if (!ge) {
            throw lhsNotAssignable();
        }
        n = new AssignExpression(n, parse(62, t));
    }
    if (61 < e) {
        return n;
    }
    while (consumeOpt(6291480)) {
        if (be === 6291456) {
            throw expectedValueConverterIdentifier();
        }
        const e = ve;
        nextToken();
        const r = new Array;
        while (consumeOpt(6291476)) {
            r.push(parse(62, t));
        }
        n = new ValueConverterExpression(n, e, r);
    }
    while (consumeOpt(6291479)) {
        if (be === 6291456) {
            throw expectedBindingBehaviorIdentifier();
        }
        const e = ve;
        nextToken();
        const r = new Array;
        while (consumeOpt(6291476)) {
            r.push(parse(62, t));
        }
        n = new BindingBehaviorExpression(n, e, r);
    }
    if (be !== 6291456) {
        if ((t & 1) > 0 && be === 7340045) {
            return n;
        }
        if ((t & 4) > 0 && be === 6291477) {
            if (fe === pe) {
                throw unconsumedToken();
            }
            Ee = fe - 1;
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
    const t = new DestructuringAssignmentExpression(24, e, void 0, void 0);
    let r = "";
    let n = true;
    let i = 0;
    while (n) {
        nextToken();
        switch (be) {
          case 7340051:
            n = false;
            addItem();
            break;

          case 6291471:
            addItem();
            break;

          case 4096:
            r = $tokenRaw();
            break;

          default:
            throw unexpectedTokenInDestructuring();
        }
    }
    consume(7340051);
    return t;
    function addItem() {
        if (r !== "") {
            e.push(new DestructuringAssignmentSingleExpression(new AccessMemberExpression(ue, r), new AccessKeyedExpression(ue, new PrimitiveLiteralExpression(i++)), void 0));
            r = "";
        } else {
            i++;
        }
    }
}

function parseArguments() {
    const e = Ae;
    nextToken();
    const t = [];
    while (be !== 7340046) {
        t.push(parse(62, 0));
        if (!consumeOpt(6291471)) {
            break;
        }
    }
    consume(7340046);
    ge = false;
    Ae = e;
    return t;
}

function parseKeyedExpression(e, t) {
    const r = Ae;
    nextToken();
    e = new AccessKeyedExpression(e, parse(62, 0), t);
    consume(7340051);
    ge = !r;
    Ae = r;
    return e;
}

function parseOptionalChainLHS(e) {
    Ae = true;
    ge = false;
    nextToken();
    if ((be & 13312) === 0) {
        throw unexpectedTokenInOptionalChain();
    }
    if (be & 12288) {
        return parseMemberExpressionLHS(e, true);
    }
    if (be === 2688007) {
        if (e.$kind === 1) {
            return new CallScopeExpression(e.name, parseArguments(), e.ancestor, true);
        } else if (e.$kind === 10) {
            return new CallMemberExpression(e.object, e.name, parseArguments(), e.optional, true);
        } else {
            return new CallFunctionExpression(e, parseArguments(), true);
        }
    }
    if (be === 2688016) {
        return parseKeyedExpression(e, true);
    }
    throw invalidTaggedTemplateOnOptionalChain();
}

function parseMemberExpressionLHS(e, t) {
    const r = ve;
    switch (be) {
      case 2162700:
        {
            Ae = true;
            ge = false;
            const n = fe;
            const i = we;
            const o = be;
            const a = xe;
            const c = ve;
            const u = ge;
            const l = Ae;
            nextToken();
            if ((be & 13312) === 0) {
                throw unexpectedTokenInOptionalChain();
            }
            if (be === 2688007) {
                return new CallMemberExpression(e, r, parseArguments(), t, true);
            }
            fe = n;
            we = i;
            be = o;
            xe = a;
            ve = c;
            ge = u;
            Ae = l;
            return new AccessMemberExpression(e, r, t);
        }

      case 2688007:
        {
            ge = false;
            return new CallMemberExpression(e, r, parseArguments(), t, false);
        }

      default:
        {
            ge = !Ae;
            nextToken();
            return new AccessMemberExpression(e, r, t);
        }
    }
}

function parseCoverParenthesizedExpressionAndArrowParameterList(e) {
    nextToken();
    const t = fe;
    const r = we;
    const n = be;
    const i = xe;
    const o = ve;
    const a = ge;
    const c = Ae;
    const u = [];
    let l = 1;
    let h = false;
    e: while (true) {
        if (be === 11) {
            nextToken();
            if (be !== 4096) {
                throw expectedIdentifier();
            }
            u.push(new BindingIdentifier(ve));
            nextToken();
            if (be === 6291471) {
                throw restParamsMustBeLastParam();
            }
            if (be !== 7340046) {
                throw invalidSpreadOp();
            }
            nextToken();
            if (be !== 50) {
                throw invalidSpreadOp();
            }
            nextToken();
            const e = Ae;
            const t = de;
            ++de;
            const r = parse(62, 0);
            Ae = e;
            de = t;
            ge = false;
            return new ArrowFunction(u, r, true);
        }
        switch (be) {
          case 4096:
            u.push(new BindingIdentifier(ve));
            nextToken();
            break;

          case 7340046:
            nextToken();
            break e;

          case 524296:
          case 2688016:
            nextToken();
            l = 4;
            break;

          case 6291471:
            l = 2;
            h = true;
            break e;

          case 2688007:
            l = 2;
            break e;

          default:
            nextToken();
            l = 2;
            break;
        }
        switch (be) {
          case 6291471:
            nextToken();
            h = true;
            if (l === 1) {
                break;
            }
            break e;

          case 7340046:
            nextToken();
            break e;

          case 4194349:
            if (l === 1) {
                l = 3;
            }
            break e;

          case 50:
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
    if (be === 50) {
        if (l === 1) {
            nextToken();
            if (be === 524296) {
                throw functionBodyInArrowFN();
            }
            const e = Ae;
            const t = de;
            ++de;
            const r = parse(62, 0);
            Ae = e;
            de = t;
            ge = false;
            return new ArrowFunction(u, r);
        }
        throw invalidArrowParameterList();
    } else if (l === 1 && u.length === 0) {
        throw missingExpectedToken(50);
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
    fe = t;
    we = r;
    be = n;
    xe = i;
    ve = o;
    ge = a;
    Ae = c;
    const f = Ae;
    const p = parse(62, e);
    Ae = f;
    consume(7340046);
    if (be === 50) {
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
    const t = Ae;
    nextToken();
    const r = new Array;
    while (be !== 7340051) {
        if (consumeOpt(6291471)) {
            r.push(ce);
            if (be === 7340051) {
                break;
            }
        } else {
            r.push(parse(62, e & ~2));
            if (consumeOpt(6291471)) {
                if (be === 7340051) {
                    break;
                }
            } else {
                break;
            }
        }
    }
    Ae = t;
    consume(7340051);
    if (e & 2) {
        return new ArrayBindingPattern(r);
    } else {
        ge = false;
        return new ArrayLiteralExpression(r);
    }
}

function parseForOfStatement(e) {
    if ((e.$kind & (19 | 20 | 21)) === 0) {
        throw invalidLHSBindingIdentifierInForOf();
    }
    if (be !== 4204593) {
        throw invalidLHSBindingIdentifierInForOf();
    }
    nextToken();
    const t = e;
    const r = parse(61, 4);
    return new ForOfStatement(t, r, Ee);
}

function parseObjectLiteralExpression(e) {
    const t = Ae;
    const r = new Array;
    const n = new Array;
    nextToken();
    while (be !== 7340045) {
        r.push(ve);
        if (be & 49152) {
            nextToken();
            consume(6291476);
            n.push(parse(62, e & ~2));
        } else if (be & 12288) {
            const t = xe;
            const r = be;
            const i = fe;
            nextToken();
            if (consumeOpt(6291476)) {
                n.push(parse(62, e & ~2));
            } else {
                xe = t;
                be = r;
                fe = i;
                n.push(parse(515, e & ~2));
            }
        } else {
            throw invalidPropDefInObjLiteral();
        }
        if (be !== 7340045) {
            consume(6291471);
        }
    }
    Ae = t;
    consume(7340045);
    if (e & 2) {
        return new ObjectBindingPattern(r, n);
    } else {
        ge = false;
        return new ObjectLiteralExpression(r, n);
    }
}

function parseInterpolation() {
    const e = [];
    const t = [];
    const r = pe;
    let n = "";
    while (fe < r) {
        switch (xe) {
          case 36:
            if ($charCodeAt(fe + 1) === 123) {
                e.push(n);
                n = "";
                fe += 2;
                xe = $charCodeAt(fe);
                nextToken();
                const r = parse(61, 1);
                t.push(r);
                continue;
            } else {
                n += "$";
            }
            break;

          case 92:
            n += ye(unescapeCode(nextChar()));
            break;

          default:
            n += ye(xe);
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
    const n = Ae;
    const i = [ ve ];
    consume(2163760);
    const o = [ parse(62, e) ];
    while ((be = scanTemplateTail()) !== 2163759) {
        i.push(ve);
        consume(2163760);
        o.push(parse(62, e));
    }
    i.push(ve);
    ge = false;
    Ae = n;
    if (r) {
        nextToken();
        return new TaggedTemplateExpression(i, i, t, o);
    } else {
        nextToken();
        return new TemplateExpression(i, o);
    }
}

function createTemplateTail(e) {
    ge = false;
    const t = [ ve ];
    nextToken();
    return new TaggedTemplateExpression(t, t, e);
}

function nextToken() {
    while (fe < pe) {
        we = fe;
        if ((be = Re[xe]()) != null) {
            return;
        }
    }
    be = 6291456;
}

function nextChar() {
    return xe = $charCodeAt(++fe);
}

function scanIdentifier() {
    while (Se[nextChar()]) ;
    const e = me[ve = $tokenRaw()];
    return e === undefined ? 4096 : e;
}

function scanNumber(e) {
    let t = xe;
    if (e === false) {
        do {
            t = nextChar();
        } while (t <= 57 && t >= 48);
        if (t !== 46) {
            ve = parseInt($tokenRaw(), 10);
            return 32768;
        }
        t = nextChar();
        if (fe >= pe) {
            ve = parseInt($tokenRaw().slice(0, -1), 10);
            return 32768;
        }
    }
    if (t <= 57 && t >= 48) {
        do {
            t = nextChar();
        } while (t <= 57 && t >= 48);
    } else {
        xe = $charCodeAt(--fe);
    }
    ve = parseFloat($tokenRaw());
    return 32768;
}

function scanString() {
    const e = xe;
    nextChar();
    let t = 0;
    const r = new Array;
    let n = fe;
    while (xe !== e) {
        if (xe === 92) {
            r.push(he.slice(n, fe));
            nextChar();
            t = unescapeCode(xe);
            nextChar();
            r.push(ye(t));
            n = fe;
        } else if (fe >= pe) {
            throw unterminatedStringLiteral();
        } else {
            nextChar();
        }
    }
    const i = he.slice(n, fe);
    nextChar();
    r.push(i);
    const o = r.join("");
    ve = o;
    return 16384;
}

function scanTemplate() {
    let e = true;
    let t = "";
    while (nextChar() !== 96) {
        if (xe === 36) {
            if (fe + 1 < pe && $charCodeAt(fe + 1) === 123) {
                fe++;
                e = false;
                break;
            } else {
                t += "$";
            }
        } else if (xe === 92) {
            t += ye(unescapeCode(nextChar()));
        } else {
            if (fe >= pe) {
                throw unterminatedTemplateLiteral();
            }
            t += ye(xe);
        }
    }
    nextChar();
    ve = t;
    if (e) {
        return 2163759;
    }
    return 2163760;
}

const scanTemplateTail = () => {
    if (fe >= pe) {
        throw unterminatedTemplateLiteral();
    }
    fe--;
    return scanTemplate();
};

const consumeOpt = e => {
    if (be === e) {
        nextToken();
        return true;
    }
    return false;
};

const consume = e => {
    if (be === e) {
        nextToken();
    } else {
        throw missingExpectedToken(e);
    }
};

const invalidStartOfExpression = () => {
    {
        return createError(`AUR0151:${he}`);
    }
};

const invalidSpreadOp = () => {
    {
        return createError(`AUR0152:${he}`);
    }
};

const expectedIdentifier = () => {
    {
        return createError(`AUR0153:${he}`);
    }
};

const invalidMemberExpression = () => {
    {
        return createError(`AUR0154:${he}`);
    }
};

const unexpectedEndOfExpression = () => {
    {
        return createError(`AUR0155:${he}`);
    }
};

const unconsumedToken = () => {
    {
        return createError(`AUR0156:${he}`);
    }
};

const invalidEmptyExpression = () => {
    {
        return createError(`AUR0157`);
    }
};

const lhsNotAssignable = () => {
    {
        return createError(`AUR0158:${he}`);
    }
};

const expectedValueConverterIdentifier = () => {
    {
        return createError(`AUR0159:${he}`);
    }
};

const expectedBindingBehaviorIdentifier = () => {
    {
        return createError(`AUR0160:${he}`);
    }
};

const unexpectedOfKeyword = () => {
    {
        return createError(`AUR0161:${he}`);
    }
};

const invalidLHSBindingIdentifierInForOf = () => {
    {
        return createError(`AUR0163:${he}`);
    }
};

const invalidPropDefInObjLiteral = () => {
    {
        return createError(`AUR0164:${he}`);
    }
};

const unterminatedStringLiteral = () => {
    {
        return createError(`AUR0165:${he}`);
    }
};

const unterminatedTemplateLiteral = () => {
    {
        return createError(`AUR0166:${he}`);
    }
};

const missingExpectedToken = e => {
    {
        return createError(`AUR0167:${he}<${Ce[e & 63]}`);
    }
};

const unexpectedCharacter = () => {
    {
        throw createError(`AUR0168:${he}`);
    }
};

unexpectedCharacter.notMapped = true;

const unexpectedTokenInDestructuring = () => {
    {
        return createError(`AUR0170:${he}`);
    }
};

const unexpectedTokenInOptionalChain = () => {
    {
        return createError(`AUR0171:${he}`);
    }
};

const invalidTaggedTemplateOnOptionalChain = () => {
    {
        return createError(`AUR0172:${he}`);
    }
};

const invalidArrowParameterList = () => {
    {
        return createError(`AUR0173:${he}`);
    }
};

const defaultParamsInArrowFn = () => {
    {
        return createError(`AUR0174:${he}`);
    }
};

const destructuringParamsInArrowFn = () => {
    {
        return createError(`AUR0175:${he}`);
    }
};

const restParamsMustBeLastParam = () => {
    {
        return createError(`AUR0176:${he}`);
    }
};

const functionBodyInArrowFN = () => {
    {
        return createError(`AUR0178:${he}`);
    }
};

const unexpectedDoubleDot = () => {
    {
        return createError(`AUR0179:${he}`);
    }
};

const Ce = [ ie, oe, ae, ce, "$this", null, "$parent", "(", "{", ".", "..", "...", "?.", "}", ")", ",", "[", "]", ":", ";", "?", "'", '"', "&", "|", "??", "||", "&&", "==", "!=", "===", "!==", "<", ">", "<=", ">=", "in", "instanceof", "+", "-", "typeof", "void", "*", "%", "/", "=", "!", 2163759, 2163760, "of", "=>" ];

const me = a(Object.create(null), {
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

const ke = {
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

const Oe = new Set;

decompress(null, Oe, ke.AsciiIdPart, true);

const Se = new Uint8Array(65535);

decompress(Se, null, ke.IdStart, 1);

decompress(Se, null, ke.Digit, 1);

const Re = new Array(65535);

Re.fill(unexpectedCharacter, 0, 65535);

decompress(Re, null, ke.Skip, (() => {
    nextChar();
    return null;
}));

decompress(Re, null, ke.IdStart, scanIdentifier);

decompress(Re, null, ke.Digit, (() => scanNumber(false)));

Re[34] = Re[39] = () => scanString();

Re[96] = () => scanTemplate();

Re[33] = () => {
    if (nextChar() !== 61) {
        return 131118;
    }
    if (nextChar() !== 61) {
        return 6553949;
    }
    nextChar();
    return 6553951;
};

Re[61] = () => {
    if (nextChar() === 62) {
        nextChar();
        return 50;
    }
    if (xe !== 61) {
        return 4194349;
    }
    if (nextChar() !== 61) {
        return 6553948;
    }
    nextChar();
    return 6553950;
};

Re[38] = () => {
    if (nextChar() !== 38) {
        return 6291479;
    }
    nextChar();
    return 6553883;
};

Re[124] = () => {
    if (nextChar() !== 124) {
        return 6291480;
    }
    nextChar();
    return 6553818;
};

Re[63] = () => {
    if (nextChar() === 46) {
        const e = $charCodeAt(fe + 1);
        if (e <= 48 || e >= 57) {
            nextChar();
            return 2162700;
        }
        return 6291478;
    }
    if (xe !== 63) {
        return 6291478;
    }
    nextChar();
    return 6553753;
};

Re[46] = () => {
    if (nextChar() <= 57 && xe >= 48) {
        return scanNumber(true);
    }
    if (xe === 46) {
        if (nextChar() !== 46) {
            return 10;
        }
        nextChar();
        return 11;
    }
    return 65545;
};

Re[60] = () => {
    if (nextChar() !== 61) {
        return 6554016;
    }
    nextChar();
    return 6554018;
};

Re[62] = () => {
    if (nextChar() !== 61) {
        return 6554017;
    }
    nextChar();
    return 6554019;
};

Re[37] = returnToken(6554155);

Re[40] = returnToken(2688007);

Re[41] = returnToken(7340046);

Re[42] = returnToken(6554154);

Re[43] = returnToken(2490854);

Re[44] = returnToken(6291471);

Re[45] = returnToken(2490855);

Re[47] = returnToken(6554156);

Re[58] = returnToken(6291476);

Re[59] = returnToken(6291477);

Re[91] = returnToken(2688016);

Re[93] = returnToken(7340051);

Re[123] = returnToken(524296);

Re[125] = returnToken(7340045);

let Te = null;

const Pe = [];

let $e = false;

function pauseConnecting() {
    $e = false;
}

function resumeConnecting() {
    $e = true;
}

function currentConnectable() {
    return Te;
}

function enterConnectable(e) {
    if (e == null) {
        throw createError(`AUR0206`);
    }
    if (Te == null) {
        Te = e;
        Pe[0] = Te;
        $e = true;
        return;
    }
    if (Te === e) {
        throw createError(`AUR0207`);
    }
    Pe.push(e);
    Te = e;
    $e = true;
}

function exitConnectable(e) {
    if (e == null) {
        throw createError(`AUR0208`);
    }
    if (Te !== e) {
        throw createError(`AUR0209`);
    }
    Pe.pop();
    Te = Pe.length > 0 ? Pe[Pe.length - 1] : null;
    $e = Te != null;
}

const Ie = Object.freeze({
    get current() {
        return Te;
    },
    get connecting() {
        return $e;
    },
    enter: enterConnectable,
    exit: exitConnectable,
    pause: pauseConnecting,
    resume: resumeConnecting
});

const Ue = Reflect.get;

const Le = Object.prototype.toString;

const Me = new WeakMap;

const _e = "__au_nw__";

const Be = "__au_nw";

function canWrap(e) {
    switch (Le.call(e)) {
      case "[object Object]":
        return e.constructor[_e] !== true;

      case "[object Array]":
      case "[object Map]":
      case "[object Set]":
        return true;

      default:
        return false;
    }
}

const De = "__raw__";

function wrap(e) {
    return canWrap(e) ? getProxy(e) : e;
}

function getProxy(e) {
    return Me.get(e) ?? createProxy(e);
}

function getRaw(e) {
    return e[De] ?? e;
}

function unwrap(e) {
    return canWrap(e) && e[De] || e;
}

function doNotCollect(e, t) {
    return t === "constructor" || t === "__proto__" || t === "$observers" || t === Symbol.toPrimitive || t === Symbol.toStringTag || e.constructor[`${Be}_${c(t)}__`] === true;
}

function createProxy(e) {
    const t = isArray(e) ? Fe : isMap(e) || isSet(e) ? Ne : je;
    const r = new Proxy(e, t);
    Me.set(e, r);
    Me.set(r, r);
    return r;
}

const je = {
    get(e, t, r) {
        if (t === De) {
            return e;
        }
        const n = currentConnectable();
        if (!$e || doNotCollect(e, t) || n == null) {
            return Ue(e, t, r);
        }
        n.observe(e, t);
        return wrap(Ue(e, t, r));
    }
};

const Fe = {
    get(e, t, r) {
        if (t === De) {
            return e;
        }
        if (!$e || doNotCollect(e, t) || Te == null) {
            return Ue(e, t, r);
        }
        switch (t) {
          case "length":
            Te.observe(e, "length");
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
        Te.observe(e, t);
        return wrap(Ue(e, t, r));
    },
    ownKeys(e) {
        currentConnectable()?.observe(e, "length");
        return Reflect.ownKeys(e);
    }
};

function wrappedArrayMap(e, t) {
    const r = getRaw(this);
    const n = r.map(((r, n) => unwrap(e.call(t, wrap(r), n, this))));
    observeCollection(Te, r);
    return wrap(n);
}

function wrappedArrayEvery(e, t) {
    const r = getRaw(this);
    const n = r.every(((r, n) => e.call(t, wrap(r), n, this)));
    observeCollection(Te, r);
    return n;
}

function wrappedArrayFilter(e, t) {
    const r = getRaw(this);
    const n = r.filter(((r, n) => unwrap(e.call(t, wrap(r), n, this))));
    observeCollection(Te, r);
    return wrap(n);
}

function wrappedArrayIncludes(e) {
    const t = getRaw(this);
    const r = t.includes(unwrap(e));
    observeCollection(Te, t);
    return r;
}

function wrappedArrayIndexOf(e) {
    const t = getRaw(this);
    const r = t.indexOf(unwrap(e));
    observeCollection(Te, t);
    return r;
}

function wrappedArrayLastIndexOf(e) {
    const t = getRaw(this);
    const r = t.lastIndexOf(unwrap(e));
    observeCollection(Te, t);
    return r;
}

function wrappedArrayFindIndex(e, t) {
    const r = getRaw(this);
    const n = r.findIndex(((r, n) => unwrap(e.call(t, wrap(r), n, this))));
    observeCollection(Te, r);
    return n;
}

function wrappedArrayFind(e, t) {
    const r = getRaw(this);
    const n = r.find(((t, r) => e(wrap(t), r, this)), t);
    observeCollection(Te, r);
    return wrap(n);
}

function wrappedArrayFlat() {
    const e = getRaw(this);
    observeCollection(Te, e);
    return wrap(e.flat());
}

function wrappedArrayFlatMap(e, t) {
    const r = getRaw(this);
    observeCollection(Te, r);
    return getProxy(r.flatMap(((r, n) => wrap(e.call(t, wrap(r), n, this)))));
}

function wrappedArrayJoin(e) {
    const t = getRaw(this);
    observeCollection(Te, t);
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
    observeCollection(Te, t);
    return wrap(r);
}

function wrappedArraySome(e, t) {
    const r = getRaw(this);
    const n = r.some(((r, n) => unwrap(e.call(t, wrap(r), n, this))));
    observeCollection(Te, r);
    return n;
}

function wrappedArraySort(e) {
    const t = getRaw(this);
    const r = t.sort(e);
    observeCollection(Te, t);
    return wrap(r);
}

function wrappedArraySlice(e, t) {
    const r = getRaw(this);
    observeCollection(Te, r);
    return getProxy(r.slice(e, t));
}

function wrappedReduce(e, t) {
    const r = getRaw(this);
    const n = r.reduce(((t, r, n) => e(t, wrap(r), n, this)), t);
    observeCollection(Te, r);
    return wrap(n);
}

function wrappedReduceRight(e, t) {
    const r = getRaw(this);
    const n = r.reduceRight(((t, r, n) => e(t, wrap(r), n, this)), t);
    observeCollection(Te, r);
    return wrap(n);
}

const Ne = {
    get(e, t, r) {
        if (t === De) {
            return e;
        }
        const n = currentConnectable();
        if (!$e || doNotCollect(e, t) || n == null) {
            return Ue(e, t, r);
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
        return wrap(Ue(e, t, r));
    }
};

function wrappedForEach(e, t) {
    const r = getRaw(this);
    observeCollection(Te, r);
    return r.forEach(((r, n) => {
        e.call(t, wrap(r), wrap(n), this);
    }));
}

function wrappedHas(e) {
    const t = getRaw(this);
    observeCollection(Te, t);
    return t.has(unwrap(e));
}

function wrappedGet(e) {
    const t = getRaw(this);
    observeCollection(Te, t);
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
    observeCollection(Te, e);
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
    observeCollection(Te, e);
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
    observeCollection(Te, e);
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

const Ve = Object.freeze({
    getProxy: getProxy,
    getRaw: getRaw,
    wrap: wrap,
    unwrap: unwrap,
    rawKey: De
});

class ComputedObserver {
    constructor(e, t, r, n, i) {
        this.type = 1;
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
            throw createError(`AUR0221`);
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

const He = /*@__PURE__*/ u("IDirtyChecker", void 0);

const Ke = {
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
        t.register(e.Registration.singleton(this, this), e.Registration.aliasTo(this, He));
    }
    constructor(e) {
        this.p = e;
        this.tracked = [];
        this.R = null;
        this.T = 0;
        this.check = () => {
            if (Ke.disabled) {
                return;
            }
            if (++this.T < Ke.timeoutsPerCheck) {
                return;
            }
            this.T = 0;
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
        if (Ke.throw) {
            throw createError(`AUR0222:${c(t)}`);
        }
        return new DirtyCheckProperty(this, e, t);
    }
    addProperty(e) {
        this.tracked.push(e);
        if (this.tracked.length === 1) {
            this.R = this.p.taskQueue.queueTask(this.check, {
                persistent: true
            });
        }
    }
    removeProperty(e) {
        this.tracked.splice(this.tracked.indexOf(e), 1);
        if (this.tracked.length === 0) {
            this.R.cancel();
            this.R = null;
        }
    }
}

DirtyChecker.inject = [ e.IPlatform ];

class DirtyCheckProperty {
    constructor(e, t, r) {
        this.obj = t;
        this.key = r;
        this.type = 0;
        this.ov = void 0;
        this.P = e;
    }
    getValue() {
        return this.obj[this.key];
    }
    setValue(e) {
        throw createError(`Trying to set value for property ${c(this.key)} in dirty checker`);
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
            this.P.addProperty(this);
        }
    }
    unsubscribe(e) {
        if (this.subs.remove(e) && this.subs.count === 0) {
            this.P.removeProperty(this);
        }
    }
}

class PrimitiveObserver {
    get doNotCache() {
        return true;
    }
    constructor(e, t) {
        this.type = 0;
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
        this.type = 0;
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
        this.type = 1;
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
            ze = this.v;
            this.v = e;
            this.cb?.(e, ze);
            this.subs.notify(e, ze);
        } else {
            this.v = this.o[this.k] = e;
            this.cb?.(e, ze);
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

let ze = void 0;

const We = new PropertyAccessor;

const qe = /*@__PURE__*/ u("IObserverLocator", (e => e.singleton(ObserverLocator)));

const Je = /*@__PURE__*/ u("INodeObserverLocator", (e => e.cachedCallback((e => new DefaultNodeObserverLocator))));

class DefaultNodeObserverLocator {
    handles() {
        return false;
    }
    getObserver() {
        return We;
    }
    getAccessor() {
        return We;
    }
}

class ObserverLocator {
    constructor(e, t) {
        this.$ = [];
        this.P = e;
        this.I = t;
    }
    addAdapter(e) {
        this.$.push(e);
    }
    getObserver(e, t) {
        if (e == null) {
            throw nullObjectError(c(t));
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
        if (this.I.handles(e, t, this)) {
            return this.I.getAccessor(e, t, this);
        }
        return We;
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
        if (this.I.handles(t, r, this)) {
            return this.I.getObserver(t, r, this);
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
        let i = Qe(t, r);
        if (i === void 0) {
            let e = Ge(t);
            while (e !== null) {
                i = Qe(e, r);
                if (i === void 0) {
                    e = Ge(e);
                } else {
                    break;
                }
            }
        }
        if (i !== void 0 && !n.call(i, "value")) {
            let e = this.U(t, r, i);
            if (e == null) {
                e = (i.get?.getObserver ?? i.set?.getObserver)?.(t, this);
            }
            return e == null ? i.configurable ? this.L(t, r, i, true) : this.P.createProperty(t, r) : e;
        }
        return new SetterObserver(t, r);
    }
    L(e, t, r, n) {
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
    U(e, t, r) {
        if (this.$.length > 0) {
            for (const n of this.$) {
                const i = n.getObserver(e, t, r, this);
                if (i != null) {
                    return i;
                }
            }
        }
        return null;
    }
}

ObserverLocator.inject = [ He, Je ];

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

const Ge = Object.getPrototypeOf;

const Qe = Object.getOwnPropertyDescriptor;

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

const nullObjectError = e => createError(`AUR0199:${c(e)}`);

const Xe = /*@__PURE__*/ u("IObservation", (e => e.singleton(Observation)));

class Observation {
    static get inject() {
        return [ qe ];
    }
    constructor(e) {
        this.oL = e;
        this.M = {
            immediate: true
        };
    }
    run(e) {
        const t = new RunEffect(this.oL, e);
        t.run();
        return t;
    }
    watch(e, t, r, n = this.M) {
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
            throw createError(`AUR0225`);
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
                throw createError(`AUR0226`);
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

const Ye = {};

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
            throw createError(`AUR0224`);
        }
        const a = n.callback || `${c(t)}Changed`;
        let u = Ye;
        if (r) {
            delete r.value;
            delete r.writable;
            u = r.initializer?.();
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
            const e = getNotifier(this, t, a, u, l);
            currentConnectable()?.subscribeTo(e);
            return e.getValue();
        };
        r.set = function s(e) {
            getNotifier(this, t, a, u, l).setValue(e);
        };
        r.get.getObserver = function gO(e) {
            return getNotifier(e, t, a, u, l);
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
        a = new SetterNotifier(e, r, i, n === Ye ? void 0 : n);
        o[t] = a;
    }
    return a;
}

class SetterNotifier {
    constructor(e, t, r, n) {
        this.type = 1;
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
            defineHiddenProp(e, _e, true);
        } else {
            defineHiddenProp(e.constructor, `${Be}_${c(t)}__`, true);
        }
    }
}

const Ze = u("ISignaler", (e => e.singleton(Signaler)));

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

exports.ConnectableSwitcher = Ie;

exports.CustomExpression = CustomExpression;

exports.DestructuringAssignmentExpression = DestructuringAssignmentExpression;

exports.DestructuringAssignmentRestExpression = DestructuringAssignmentRestExpression;

exports.DestructuringAssignmentSingleExpression = DestructuringAssignmentSingleExpression;

exports.DirtyCheckProperty = DirtyCheckProperty;

exports.DirtyCheckSettings = Ke;

exports.DirtyChecker = DirtyChecker;

exports.ForOfStatement = ForOfStatement;

exports.ICoercionConfiguration = d;

exports.IDirtyChecker = He;

exports.IExpressionParser = ne;

exports.INodeObserverLocator = Je;

exports.IObservation = Xe;

exports.IObserverLocator = qe;

exports.ISignaler = Ze;

exports.Interpolation = Interpolation;

exports.MapObserver = MapObserver;

exports.ObjectBindingPattern = ObjectBindingPattern;

exports.ObjectLiteralExpression = ObjectLiteralExpression;

exports.Observation = Observation;

exports.ObserverLocator = ObserverLocator;

exports.PrimitiveLiteralExpression = PrimitiveLiteralExpression;

exports.PrimitiveObserver = PrimitiveObserver;

exports.PropertyAccessor = PropertyAccessor;

exports.ProxyObservable = Ve;

exports.Scope = Scope;

exports.SetObserver = SetObserver;

exports.SetterObserver = SetterObserver;

exports.SubscriberRecord = SubscriberRecord;

exports.TaggedTemplateExpression = TaggedTemplateExpression;

exports.TemplateExpression = TemplateExpression;

exports.UnaryExpression = UnaryExpression;

exports.Unparser = Unparser;

exports.ValueConverterExpression = ValueConverterExpression;

exports.applyMutationsToIndices = applyMutationsToIndices;

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

exports.synchronizeIndices = synchronizeIndices;
//# sourceMappingURL=index.cjs.map
