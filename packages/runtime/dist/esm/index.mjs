import { DI as e, Protocol as t, emptyArray as r, isArrayIndex as n, IPlatform as i } from "@aurelia/kernel";

import { Metadata as a } from "@aurelia/metadata";

const o = Object;

const c = o.prototype.hasOwnProperty;

const u = Reflect.defineProperty;

const createError = e => new Error(e);

const isFunction = e => typeof e === "function";

const isString = e => typeof e === "string";

const isObject = e => e instanceof o;

const isArray = e => e instanceof Array;

const isSet = e => e instanceof Set;

const isMap = e => e instanceof Map;

const l = o.is;

function defineHiddenProp(e, t, r) {
    u(e, t, {
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

const h = Object.assign;

const f = String;

const p = e.createInterface;

const createLookup = () => o.create(null);

const d = a.getOwn;

a.hasOwn;

const w = a.define;

t.annotation.keyFor;

t.resource.keyFor;

t.resource.appendTo;

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
        let a;
        for (;n < r; ++n) {
            a = t[n].name;
            if (n > 0) {
                i += ", ";
            }
            if (n < r - 1) {
                i += a;
            } else {
                i += e.rest ? `...${a}` : a;
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
        let a;
        let o;
        for (a = 0; a < i; a++) {
            o = n[a];
            switch (o.$kind) {
              case 26:
                astVisit(o, this);
                break;

              case 24:
              case 25:
                {
                    const e = o.source;
                    if (e) {
                        astVisit(e, this);
                        this.text += ":";
                    }
                    astVisit(o, this);
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
        this.text += f(e.value);
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

var b;

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
})(b || (b = {}));

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

ArrayLiteralExpression.$empty = new ArrayLiteralExpression(r);

class ObjectLiteralExpression {
    constructor(e, t) {
        this.keys = e;
        this.values = t;
        this.$kind = 3;
    }
}

ObjectLiteralExpression.$empty = new ObjectLiteralExpression(r, r);

class TemplateExpression {
    constructor(e, t = r) {
        this.cooked = e;
        this.expressions = t;
        this.$kind = 5;
    }
}

TemplateExpression.$empty = new TemplateExpression([ "" ]);

class TaggedTemplateExpression {
    constructor(e, t, n, i = r) {
        this.cooked = e;
        this.func = n;
        this.expressions = i;
        this.$kind = 12;
        e.raw = t;
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
    constructor(e, t = r) {
        this.parts = e;
        this.expressions = t;
        this.$kind = 23;
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

const v = Scope.getContext;

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
            const i = v(t, e.name, e.ancestor);
            if (n !== null) {
                n.observe(i, e.name);
            }
            const a = i[e.name];
            if (a == null && e.name === "$host") {
                throw createError(`AUR0105`);
            }
            if (r?.strict) {
                return r?.boundFn && isFunction(a) ? a.bind(i) : a;
            }
            return a == null ? "" : r?.boundFn && isFunction(a) ? a.bind(i) : a;
        }

      case 2:
        return e.elements.map((e => astEvaluate(e, t, r, n)));

      case 3:
        {
            const i = {};
            for (let a = 0; a < e.keys.length; ++a) {
                i[e.keys[a]] = astEvaluate(e.values[a], t, r, n);
            }
            return i;
        }

      case 4:
        return e.value;

      case 5:
        {
            let i = e.cooked[0];
            for (let a = 0; a < e.expressions.length; ++a) {
                i += String(astEvaluate(e.expressions[a], t, r, n));
                i += e.cooked[a + 1];
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
            const a = v(t, e.name, e.ancestor);
            const o = getFunction(r?.strictFnCall, a, e.name);
            if (o) {
                return o.apply(a, i);
            }
            return void 0;
        }

      case 8:
        {
            const i = astEvaluate(e.object, t, r, n);
            const a = e.args.map((e => astEvaluate(e, t, r, n)));
            const o = getFunction(r?.strictFnCall, i, e.name);
            let c;
            if (o) {
                c = o.apply(i, a);
                if (isArray(i) && x.includes(e.name)) {
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
                const a = e.args;
                const o = e.rest;
                const c = a.length - 1;
                const u = a.reduce(((e, t, r) => {
                    if (o && r === c) {
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
            let a;
            if (r?.strict) {
                if (i == null) {
                    return undefined;
                }
                if (n !== null) {
                    n.observe(i, e.name);
                }
                a = i[e.name];
                if (r?.boundFn && isFunction(a)) {
                    return a.bind(i);
                }
                return a;
            }
            if (n !== null && isObject(i)) {
                n.observe(i, e.name);
            }
            if (i) {
                a = i[e.name];
                if (r?.boundFn && isFunction(a)) {
                    return a.bind(i);
                }
                return a;
            }
            return "";
        }

      case 11:
        {
            const i = astEvaluate(e.object, t, r, n);
            const a = astEvaluate(e.key, t, r, n);
            if (isObject(i)) {
                if (n !== null) {
                    n.observe(i, a);
                }
                return i[a];
            }
            return i == null ? void 0 : i[a];
        }

      case 12:
        {
            const i = e.expressions.map((e => astEvaluate(e, t, r, n)));
            const a = astEvaluate(e.func, t, r, n);
            if (!isFunction(a)) {
                throw createError(`AUR0110`);
            }
            return a(e.cooked, ...i);
        }

      case 13:
        {
            const i = e.left;
            const a = e.right;
            switch (e.operation) {
              case "&&":
                return astEvaluate(i, t, r, n) && astEvaluate(a, t, r, n);

              case "||":
                return astEvaluate(i, t, r, n) || astEvaluate(a, t, r, n);

              case "??":
                return astEvaluate(i, t, r, n) ?? astEvaluate(a, t, r, n);

              case "==":
                return astEvaluate(i, t, r, n) == astEvaluate(a, t, r, n);

              case "===":
                return astEvaluate(i, t, r, n) === astEvaluate(a, t, r, n);

              case "!=":
                return astEvaluate(i, t, r, n) != astEvaluate(a, t, r, n);

              case "!==":
                return astEvaluate(i, t, r, n) !== astEvaluate(a, t, r, n);

              case "instanceof":
                {
                    const e = astEvaluate(a, t, r, n);
                    if (isFunction(e)) {
                        return astEvaluate(i, t, r, n) instanceof e;
                    }
                    return false;
                }

              case "in":
                {
                    const e = astEvaluate(a, t, r, n);
                    if (isObject(e)) {
                        return astEvaluate(i, t, r, n) in e;
                    }
                    return false;
                }

              case "+":
                {
                    const e = astEvaluate(i, t, r, n);
                    const o = astEvaluate(a, t, r, n);
                    if (r?.strict) {
                        return e + o;
                    }
                    if (!e || !o) {
                        if (isNumberOrBigInt(e) || isNumberOrBigInt(o)) {
                            return (e || 0) + (o || 0);
                        }
                        if (isStringOrDate(e) || isStringOrDate(o)) {
                            return (e || "") + (o || "");
                        }
                    }
                    return e + o;
                }

              case "-":
                return astEvaluate(i, t, r, n) - astEvaluate(a, t, r, n);

              case "*":
                return astEvaluate(i, t, r, n) * astEvaluate(a, t, r, n);

              case "/":
                return astEvaluate(i, t, r, n) / astEvaluate(a, t, r, n);

              case "%":
                return astEvaluate(i, t, r, n) % astEvaluate(a, t, r, n);

              case "<":
                return astEvaluate(i, t, r, n) < astEvaluate(a, t, r, n);

              case ">":
                return astEvaluate(i, t, r, n) > astEvaluate(a, t, r, n);

              case "<=":
                return astEvaluate(i, t, r, n) <= astEvaluate(a, t, r, n);

              case ">=":
                return astEvaluate(i, t, r, n) >= astEvaluate(a, t, r, n);

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
            let a = 0;
            for (;a < e.expressions.length; ++a) {
                i += f(astEvaluate(e.expressions[a], t, r, n));
                i += e.parts[a + 1];
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

function astAssign(e, t, r, i) {
    switch (e.$kind) {
      case 1:
        {
            if (e.name === "$host") {
                throw createError(`AUR0106`);
            }
            const r = v(t, e.name, e.ancestor);
            return r[e.name] = i;
        }

      case 10:
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

      case 11:
        {
            const a = astEvaluate(e.object, t, r, null);
            const o = astEvaluate(e.key, t, r, null);
            if (isArray(a)) {
                if (o === "length" && !isNaN(i)) {
                    a.splice(i);
                    return i;
                }
                if (n(o)) {
                    a.splice(o, 1, i);
                    return i;
                }
            }
            return a[o] = i;
        }

      case 15:
        astAssign(e.value, t, r, i);
        return astAssign(e.target, t, r, i);

      case 17:
        {
            const n = r?.getConverter?.(e.name);
            if (n == null) {
                throw converterNotFoundError(e.name);
            }
            if ("fromView" in n) {
                i = n.fromView(i, ...e.args.map((e => astEvaluate(e, t, r, null))));
            }
            return astAssign(e.expression, t, r, i);
        }

      case 18:
        return astAssign(e.expression, t, r, i);

      case 24:
      case 25:
        {
            const n = e.list;
            const a = n.length;
            let o;
            let c;
            for (o = 0; o < a; o++) {
                c = n[o];
                switch (c.$kind) {
                  case 26:
                    astAssign(c, t, r, i);
                    break;

                  case 24:
                  case 25:
                    {
                        if (typeof i !== "object" || i === null) {
                            {
                                throw createError(`AUR0112`);
                            }
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

      case 26:
        {
            if (e instanceof DestructuringAssignmentSingleExpression) {
                if (i == null) {
                    return;
                }
                if (typeof i !== "object") {
                    {
                        throw createError(`AUR0112`);
                    }
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
                    {
                        throw createError(`AUR0112`);
                    }
                }
                const a = e.indexOrProperties;
                let o;
                if (n(a)) {
                    if (!Array.isArray(i)) {
                        {
                            throw createError(`AUR0112`);
                        }
                    }
                    o = i.slice(a);
                } else {
                    o = Object.entries(i).reduce(((e, [t, r]) => {
                        if (!a.includes(t)) {
                            e[t] = r;
                        }
                        return e;
                    }), {});
                }
                astAssign(e.target, t, r, o);
            }
            break;
        }

      case 28:
        return e.assign(t, r, i);

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
            const a = r.getBehavior?.(n);
            if (a == null) {
                throw behaviorNotFoundError(n);
            }
            if (r[i] === void 0) {
                r[i] = a;
                a.bind?.(t, r, ...e.args.map((e => astEvaluate(e, t, r, null))));
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
            const a = i.signals;
            if (a != null) {
                const e = r.getSignaler?.();
                const t = a.length;
                let n = 0;
                for (;n < t; ++n) {
                    e?.addSignalListener(a[n], r);
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
            let a = 0;
            for (;a < n.signals.length; ++a) {
                i?.removeSignalListener(n.signals[a], r);
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

const x = "at map filter includes indexOf lastIndexOf findIndex find flat flatMap join reduce reduceRight slice every some sort".split(" ");

const A = /*@__PURE__*/ e.createInterface("ICoercionConfiguration");

var E;

(function(e) {
    e[e["indexed"] = 8] = "indexed";
    e[e["keyed"] = 4] = "keyed";
    e[e["array"] = 9] = "array";
    e[e["map"] = 6] = "map";
    e[e["set"] = 7] = "set";
})(E || (E = {}));

var y;

(function(e) {
    e[e["None"] = 0] = "None";
    e[e["Observer"] = 1] = "Observer";
    e[e["Node"] = 2] = "Node";
    e[e["Layout"] = 4] = "Layout";
    e[e["Primtive"] = 8] = "Primtive";
    e[e["Array"] = 18] = "Array";
    e[e["Set"] = 34] = "Set";
    e[e["Map"] = 66] = "Map";
})(y || (y = {}));

function copyIndexMap(e, t, r) {
    const {length: n} = e;
    const i = Array(n);
    let a = 0;
    while (a < n) {
        i[a] = e[a];
        ++a;
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

let C = new Map;

let m = false;

function batch(e) {
    const t = C;
    const r = C = new Map;
    m = true;
    try {
        e();
    } finally {
        C = null;
        m = false;
        try {
            let e;
            let n;
            let i;
            let a;
            let o;
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
                    a = i[1];
                    o = i[2];
                    c = false;
                    if (o.deletedIndices.length > 0) {
                        c = true;
                    } else {
                        for (u = 0, l = o.length; u < l; ++u) {
                            if (o[u] !== u) {
                                c = true;
                                break;
                            }
                        }
                    }
                    if (c) {
                        n.notifyCollection(a, o);
                    }
                }
            }
        } finally {
            C = t;
        }
    }
}

function addCollectionBatch(e, t, r) {
    if (!C.has(e)) {
        C.set(e, [ 2, t, r ]);
    }
}

function addValueBatch(e, t, r) {
    const n = C.get(e);
    if (n === void 0) {
        C.set(e, [ 1, t, r ]);
    } else {
        n[1] = t;
        n[2] = r;
    }
}

function subscriberCollection(e) {
    return e == null ? subscriberCollectionDeco : subscriberCollectionDeco(e);
}

function subscriberCollectionDeco(e) {
    const t = e.prototype;
    u(t, "subs", {
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
        if (m) {
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
        this.type = 18;
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
        this.v = (this.o = e.collection).size;
        this.type = isMap(this.o) ? 66 : 34;
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

const O = Symbol.for("__au_arr_obs__");

const k = Array[O] ?? defineHiddenProp(Array, O, new WeakMap);

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
    let a, o, c, u, l;
    let h, f;
    for (h = r + 1; h < n; h++) {
        a = e[h];
        o = t[h];
        for (f = h - 1; f >= r; f--) {
            c = e[f];
            u = t[f];
            l = i(c, a);
            if (l > 0) {
                e[f + 1] = c;
                t[f + 1] = u;
            } else {
                break;
            }
        }
        e[f + 1] = a;
        t[f + 1] = o;
    }
}

function quickSort(e, t, r, n, i) {
    let a = 0, o = 0;
    let c, u, l;
    let h, f, p;
    let d, w, b;
    let v, x;
    let A, E, y, C;
    let m, O, k, S;
    while (true) {
        if (n - r <= 10) {
            insertionSort(e, t, r, n, i);
            return;
        }
        a = r + (n - r >> 1);
        c = e[r];
        h = t[r];
        u = e[n - 1];
        f = t[n - 1];
        l = e[a];
        p = t[a];
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
        e[a] = e[y];
        t[a] = t[y];
        e[y] = A;
        t[y] = E;
        e: for (o = y + 1; o < C; o++) {
            m = e[o];
            O = t[o];
            k = i(m, A);
            if (k < 0) {
                e[o] = e[y];
                t[o] = t[y];
                e[y] = m;
                t[y] = O;
                y++;
            } else if (k > 0) {
                do {
                    C--;
                    if (C == o) {
                        break e;
                    }
                    S = e[C];
                    k = i(S, A);
                } while (k > 0);
                e[o] = e[C];
                t[o] = t[C];
                e[C] = m;
                t[C] = O;
                if (k < 0) {
                    m = e[o];
                    O = t[o];
                    e[o] = e[y];
                    t[o] = t[y];
                    e[y] = m;
                    t[y] = O;
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

const S = Array.prototype;

const R = S.push;

const T = S.unshift;

const P = S.pop;

const $ = S.shift;

const I = S.splice;

const U = S.reverse;

const L = S.sort;

const M = {
    push: R,
    unshift: T,
    pop: P,
    shift: $,
    splice: I,
    reverse: U,
    sort: L
};

const _ = [ "push", "unshift", "pop", "shift", "splice", "reverse", "sort" ];

const B = {
    push: function(...e) {
        const t = k.get(this);
        if (t === void 0) {
            return R.apply(this, e);
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
        const t = k.get(this);
        if (t === void 0) {
            return T.apply(this, e);
        }
        const r = e.length;
        const n = new Array(r);
        let i = 0;
        while (i < r) {
            n[i++] = -2;
        }
        T.apply(t.indexMap, n);
        const a = T.apply(this, e);
        t.notify();
        return a;
    },
    pop: function() {
        const e = k.get(this);
        if (e === void 0) {
            return P.call(this);
        }
        const t = e.indexMap;
        const r = P.call(this);
        const n = t.length - 1;
        if (t[n] > -1) {
            t.deletedIndices.push(t[n]);
            t.deletedItems.push(r);
        }
        P.call(t);
        e.notify();
        return r;
    },
    shift: function() {
        const e = k.get(this);
        if (e === void 0) {
            return $.call(this);
        }
        const t = e.indexMap;
        const r = $.call(this);
        if (t[0] > -1) {
            t.deletedIndices.push(t[0]);
            t.deletedItems.push(r);
        }
        $.call(t);
        e.notify();
        return r;
    },
    splice: function(...e) {
        const t = e[0];
        const r = e[1];
        const n = k.get(this);
        if (n === void 0) {
            return I.apply(this, e);
        }
        const i = this.length;
        const a = t | 0;
        const o = a < 0 ? Math.max(i + a, 0) : Math.min(a, i);
        const c = n.indexMap;
        const u = e.length;
        const l = u === 0 ? 0 : u === 1 ? i - o : r;
        let h = o;
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
            I.call(c, t, r, ...n);
        } else {
            I.apply(c, e);
        }
        const f = I.apply(this, e);
        if (l > 0 || h > 0) {
            n.notify();
        }
        return f;
    },
    reverse: function() {
        const e = k.get(this);
        if (e === void 0) {
            U.call(this);
            return this;
        }
        const t = this.length;
        const r = t / 2 | 0;
        let n = 0;
        while (n !== r) {
            const r = t - n - 1;
            const i = this[n];
            const a = e.indexMap[n];
            const o = this[r];
            const c = e.indexMap[r];
            this[n] = o;
            e.indexMap[n] = c;
            this[r] = i;
            e.indexMap[r] = a;
            n++;
        }
        e.notify();
        return this;
    },
    sort: function(e) {
        const t = k.get(this);
        if (t === void 0) {
            L.call(this, e);
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

for (const e of _) {
    u(B[e], "observing", {
        value: true,
        writable: false,
        configurable: false,
        enumerable: false
    });
}

let D = false;

const j = "__au_arr_on__";

function enableArrayObservation() {
    if (!(d(j, Array) ?? false)) {
        w(j, true, Array);
        for (const e of _) {
            if (S[e].observing !== true) {
                defineHiddenProp(S, e, B[e]);
            }
        }
    }
}

function disableArrayObservation() {
    for (const e of _) {
        if (S[e].observing === true) {
            defineHiddenProp(S, e, M[e]);
        }
    }
}

class ArrayObserver {
    constructor(e) {
        this.type = 18;
        if (!D) {
            D = true;
            enableArrayObservation();
        }
        this.indexObservers = {};
        this.collection = e;
        this.indexMap = createIndexMap(e.length);
        this.lenObs = void 0;
        k.set(e, this);
    }
    notify() {
        const e = this.subs;
        const t = this.indexMap;
        if (m) {
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
        const a = this.value = this.getValue();
        if (i !== a) {
            this.subs.notify(a, i);
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
    let t = k.get(e);
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
    const a = i.length;
    for (;n < a; ++n) {
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
    let a = 0;
    while (i < n) {
        a = t[i];
        if (a !== -2) {
            e[i] = r[a];
        }
        ++i;
    }
}

const F = Symbol.for("__au_set_obs__");

const V = Set[F] ?? defineHiddenProp(Set, F, new WeakMap);

const N = Set.prototype;

const H = N.add;

const K = N.clear;

const z = N.delete;

const W = {
    add: H,
    clear: K,
    delete: z
};

const q = [ "add", "clear", "delete" ];

const J = {
    add: function(e) {
        const t = V.get(this);
        if (t === undefined) {
            H.call(this, e);
            return this;
        }
        const r = this.size;
        H.call(this, e);
        const n = this.size;
        if (n === r) {
            return this;
        }
        t.indexMap[r] = -2;
        t.notify();
        return this;
    },
    clear: function() {
        const e = V.get(this);
        if (e === undefined) {
            return K.call(this);
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
            K.call(this);
            t.length = 0;
            e.notify();
        }
        return undefined;
    },
    delete: function(e) {
        const t = V.get(this);
        if (t === undefined) {
            return z.call(this, e);
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
                const a = z.call(this, e);
                if (a === true) {
                    t.notify();
                }
                return a;
            }
            n++;
        }
        return false;
    }
};

const G = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const e of q) {
    u(J[e], "observing", {
        value: true,
        writable: false,
        configurable: false,
        enumerable: false
    });
}

let Q = false;

const X = "__au_set_on__";

function enableSetObservation() {
    if (!(d(X, Set) ?? false)) {
        w(X, true, Set);
        for (const e of q) {
            if (N[e].observing !== true) {
                u(N, e, {
                    ...G,
                    value: J[e]
                });
            }
        }
    }
}

function disableSetObservation() {
    for (const e of q) {
        if (N[e].observing === true) {
            u(N, e, {
                ...G,
                value: W[e]
            });
        }
    }
}

class SetObserver {
    constructor(e) {
        this.type = 34;
        if (!Q) {
            Q = true;
            enableSetObservation();
        }
        this.collection = e;
        this.indexMap = createIndexMap(e.size);
        this.lenObs = void 0;
        V.set(e, this);
    }
    notify() {
        const e = this.subs;
        const t = this.indexMap;
        if (m) {
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
    let t = V.get(e);
    if (t === void 0) {
        t = new SetObserver(e);
    }
    return t;
}

const Y = Symbol.for("__au_map_obs__");

const Z = Map[Y] ?? defineHiddenProp(Map, Y, new WeakMap);

const ee = Map.prototype;

const te = ee.set;

const se = ee.clear;

const re = ee.delete;

const ne = {
    set: te,
    clear: se,
    delete: re
};

const ie = [ "set", "clear", "delete" ];

const ae = {
    set: function(e, t) {
        const r = Z.get(this);
        if (r === undefined) {
            te.call(this, e, t);
            return this;
        }
        const n = this.get(e);
        const i = this.size;
        te.call(this, e, t);
        const a = this.size;
        if (a === i) {
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
        const e = Z.get(this);
        if (e === undefined) {
            return se.call(this);
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
            se.call(this);
            t.length = 0;
            e.notify();
        }
        return undefined;
    },
    delete: function(e) {
        const t = Z.get(this);
        if (t === undefined) {
            return re.call(this, e);
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
                const a = re.call(this, e);
                if (a === true) {
                    t.notify();
                }
                return a;
            }
            ++n;
        }
        return false;
    }
};

const oe = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const e of ie) {
    u(ae[e], "observing", {
        value: true,
        writable: false,
        configurable: false,
        enumerable: false
    });
}

let ce = false;

const ue = "__au_map_on__";

function enableMapObservation() {
    if (!(d(ue, Map) ?? false)) {
        w(ue, true, Map);
        for (const e of ie) {
            if (ee[e].observing !== true) {
                u(ee, e, {
                    ...oe,
                    value: ae[e]
                });
            }
        }
    }
}

function disableMapObservation() {
    for (const e of ie) {
        if (ee[e].observing === true) {
            u(ee, e, {
                ...oe,
                value: ne[e]
            });
        }
    }
}

class MapObserver {
    constructor(e) {
        this.type = 66;
        if (!ce) {
            ce = true;
            enableMapObservation();
        }
        this.collection = e;
        this.indexMap = createIndexMap(e.size);
        this.lenObs = void 0;
        Z.set(e, this);
    }
    notify() {
        const e = this.subs;
        const t = this.indexMap;
        if (m) {
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
    let t = Z.get(e);
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
    u(t, "obs", {
        get: getObserverRecord
    });
    ensureProto(t, "handleChange", noopHandleChange);
    ensureProto(t, "handleCollectionChange", noopHandleCollectionChange);
    return e;
}

function connectable(e) {
    return e == null ? connectableDecorator : connectableDecorator(e);
}

const le = p("IExpressionParser", (e => e.singleton(ExpressionParser)));

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
        ge = e;
        xe = 0;
        Ae = e.length;
        Ee = 0;
        ye = 0;
        Ce = 6291456;
        me = "";
        Oe = $charCodeAt(0);
        ke = true;
        Se = false;
        Re = -1;
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

const he = PrimitiveLiteralExpression.$false;

const fe = PrimitiveLiteralExpression.$true;

const pe = PrimitiveLiteralExpression.$null;

const de = PrimitiveLiteralExpression.$undefined;

const we = AccessThisExpression.$this;

const be = AccessThisExpression.$parent;

var ve;

(function(e) {
    e[e["None"] = 0] = "None";
    e[e["Interpolation"] = 1] = "Interpolation";
    e[e["IsIterator"] = 2] = "IsIterator";
    e[e["IsChainable"] = 4] = "IsChainable";
    e[e["IsFunction"] = 8] = "IsFunction";
    e[e["IsProperty"] = 16] = "IsProperty";
    e[e["IsCustom"] = 32] = "IsCustom";
})(ve || (ve = {}));

let ge = "";

let xe = 0;

let Ae = 0;

let Ee = 0;

let ye = 0;

let Ce = 6291456;

let me = "";

let Oe;

let ke = true;

let Se = false;

let Re = -1;

const Te = String.fromCharCode;

const $charCodeAt = e => ge.charCodeAt(e);

const $tokenRaw = () => ge.slice(ye, xe);

function parseExpression(e, t) {
    ge = e;
    xe = 0;
    Ae = e.length;
    Ee = 0;
    ye = 0;
    Ce = 6291456;
    me = "";
    Oe = $charCodeAt(0);
    ke = true;
    Se = false;
    Re = -1;
    return parse(61, t === void 0 ? 16 : t);
}

function parse(e, t) {
    if (t === 32) {
        return new CustomExpression(ge);
    }
    if (xe === 0) {
        if (t & 1) {
            return parseInterpolation();
        }
        nextToken();
        if (Ce & 4194304) {
            throw invalidStartOfExpression();
        }
    }
    ke = 513 > e;
    Se = false;
    let r = false;
    let n = void 0;
    let i = 0;
    if (Ce & 131072) {
        const e = Pe[Ce & 63];
        nextToken();
        n = new UnaryExpression(e, parse(514, t));
        ke = false;
    } else {
        e: switch (Ce) {
          case 12294:
            i = Ee;
            ke = false;
            do {
                nextToken();
                ++i;
                switch (Ce) {
                  case 65545:
                    nextToken();
                    if ((Ce & 12288) === 0) {
                        throw expectedIdentifier();
                    }
                    break;

                  case 10:
                  case 11:
                    throw expectedIdentifier();

                  case 2162700:
                    Se = true;
                    nextToken();
                    if ((Ce & 12288) === 0) {
                        n = i === 0 ? we : i === 1 ? be : new AccessThisExpression(i);
                        r = true;
                        break e;
                    }
                    break;

                  default:
                    if (Ce & 2097152) {
                        n = i === 0 ? we : i === 1 ? be : new AccessThisExpression(i);
                        break e;
                    }
                    throw invalidMemberExpression();
                }
            } while (Ce === 12294);

          case 4096:
            {
                const e = me;
                if (t & 2) {
                    n = new BindingIdentifier(e);
                } else {
                    n = new AccessScopeExpression(e, i);
                }
                ke = !Se;
                nextToken();
                if (consumeOpt(50)) {
                    if (Ce === 524296) {
                        throw functionBodyInArrowFN();
                    }
                    const t = Se;
                    const r = Ee;
                    ++Ee;
                    const i = parse(62, 0);
                    Se = t;
                    Ee = r;
                    ke = false;
                    n = new ArrowFunction([ new BindingIdentifier(e) ], i);
                }
                break;
            }

          case 10:
            throw unexpectedDoubleDot();

          case 11:
            throw invalidSpreadOp();

          case 12292:
            ke = false;
            nextToken();
            switch (Ee) {
              case 0:
                n = we;
                break;

              case 1:
                n = be;
                break;

              default:
                n = new AccessThisExpression(Ee);
                break;
            }
            break;

          case 2688007:
            n = parseCoverParenthesizedExpressionAndArrowParameterList(t);
            break;

          case 2688016:
            n = ge.search(/\s+of\s+/) > xe ? parseArrayDestructuring() : parseArrayLiteralExpression(t);
            break;

          case 524296:
            n = parseObjectLiteralExpression(t);
            break;

          case 2163759:
            n = new TemplateExpression([ me ]);
            ke = false;
            nextToken();
            break;

          case 2163760:
            n = parseTemplate(t, n, false);
            break;

          case 16384:
          case 32768:
            n = new PrimitiveLiteralExpression(me);
            ke = false;
            nextToken();
            break;

          case 8194:
          case 8195:
          case 8193:
          case 8192:
            n = Pe[Ce & 63];
            ke = false;
            nextToken();
            break;

          default:
            if (xe >= Ae) {
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
        if (Ce === 10 || Ce === 11) {
            throw expectedIdentifier();
        }
        if (n.$kind === 0) {
            switch (Ce) {
              case 2162700:
                Se = true;
                ke = false;
                nextToken();
                if ((Ce & 13312) === 0) {
                    throw unexpectedTokenInOptionalChain();
                }
                if (Ce & 12288) {
                    n = new AccessScopeExpression(me, n.ancestor);
                    nextToken();
                } else if (Ce === 2688007) {
                    n = new CallFunctionExpression(n, parseArguments(), true);
                } else if (Ce === 2688016) {
                    n = parseKeyedExpression(n, true);
                } else {
                    throw invalidTaggedTemplateOnOptionalChain();
                }
                break;

              case 65545:
                ke = !Se;
                nextToken();
                if ((Ce & 12288) === 0) {
                    throw expectedIdentifier();
                }
                n = new AccessScopeExpression(me, n.ancestor);
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
        while ((Ce & 65536) > 0) {
            switch (Ce) {
              case 2162700:
                n = parseOptionalChainLHS(n);
                break;

              case 65545:
                nextToken();
                if ((Ce & 12288) === 0) {
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
                if (Se) {
                    throw invalidTaggedTemplateOnOptionalChain();
                }
                n = createTemplateTail(n);
                break;

              case 2163760:
                if (Se) {
                    throw invalidTaggedTemplateOnOptionalChain();
                }
                n = parseTemplate(t, n, true);
                break;
            }
        }
    }
    if (Ce === 10 || Ce === 11) {
        throw expectedIdentifier();
    }
    if (513 < e) {
        return n;
    }
    while ((Ce & 262144) > 0) {
        const r = Ce;
        if ((r & 960) <= e) {
            break;
        }
        nextToken();
        n = new BinaryExpression(Pe[r & 63], n, parse(r & 960, t));
        ke = false;
    }
    if (63 < e) {
        return n;
    }
    if (consumeOpt(6291478)) {
        const e = parse(62, t);
        consume(6291476);
        n = new ConditionalExpression(n, e, parse(62, t));
        ke = false;
    }
    if (62 < e) {
        return n;
    }
    if (consumeOpt(4194349)) {
        if (!ke) {
            throw lhsNotAssignable();
        }
        n = new AssignExpression(n, parse(62, t));
    }
    if (61 < e) {
        return n;
    }
    while (consumeOpt(6291480)) {
        if (Ce === 6291456) {
            throw expectedValueConverterIdentifier();
        }
        const e = me;
        nextToken();
        const r = new Array;
        while (consumeOpt(6291476)) {
            r.push(parse(62, t));
        }
        n = new ValueConverterExpression(n, e, r);
    }
    while (consumeOpt(6291479)) {
        if (Ce === 6291456) {
            throw expectedBindingBehaviorIdentifier();
        }
        const e = me;
        nextToken();
        const r = new Array;
        while (consumeOpt(6291476)) {
            r.push(parse(62, t));
        }
        n = new BindingBehaviorExpression(n, e, r);
    }
    if (Ce !== 6291456) {
        if ((t & 1) > 0 && Ce === 7340045) {
            return n;
        }
        if ((t & 4) > 0 && Ce === 6291477) {
            if (xe === Ae) {
                throw unconsumedToken();
            }
            Re = xe - 1;
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
        switch (Ce) {
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
            e.push(new DestructuringAssignmentSingleExpression(new AccessMemberExpression(we, r), new AccessKeyedExpression(we, new PrimitiveLiteralExpression(i++)), void 0));
            r = "";
        } else {
            i++;
        }
    }
}

function parseArguments() {
    const e = Se;
    nextToken();
    const t = [];
    while (Ce !== 7340046) {
        t.push(parse(62, 0));
        if (!consumeOpt(6291471)) {
            break;
        }
    }
    consume(7340046);
    ke = false;
    Se = e;
    return t;
}

function parseKeyedExpression(e, t) {
    const r = Se;
    nextToken();
    e = new AccessKeyedExpression(e, parse(62, 0), t);
    consume(7340051);
    ke = !r;
    Se = r;
    return e;
}

function parseOptionalChainLHS(e) {
    Se = true;
    ke = false;
    nextToken();
    if ((Ce & 13312) === 0) {
        throw unexpectedTokenInOptionalChain();
    }
    if (Ce & 12288) {
        return parseMemberExpressionLHS(e, true);
    }
    if (Ce === 2688007) {
        if (e.$kind === 1) {
            return new CallScopeExpression(e.name, parseArguments(), e.ancestor, true);
        } else if (e.$kind === 10) {
            return new CallMemberExpression(e.object, e.name, parseArguments(), e.optional, true);
        } else {
            return new CallFunctionExpression(e, parseArguments(), true);
        }
    }
    if (Ce === 2688016) {
        return parseKeyedExpression(e, true);
    }
    throw invalidTaggedTemplateOnOptionalChain();
}

function parseMemberExpressionLHS(e, t) {
    const r = me;
    switch (Ce) {
      case 2162700:
        {
            Se = true;
            ke = false;
            const n = xe;
            const i = ye;
            const a = Ce;
            const o = Oe;
            const c = me;
            const u = ke;
            const l = Se;
            nextToken();
            if ((Ce & 13312) === 0) {
                throw unexpectedTokenInOptionalChain();
            }
            if (Ce === 2688007) {
                return new CallMemberExpression(e, r, parseArguments(), t, true);
            }
            xe = n;
            ye = i;
            Ce = a;
            Oe = o;
            me = c;
            ke = u;
            Se = l;
            return new AccessMemberExpression(e, r, t);
        }

      case 2688007:
        {
            ke = false;
            return new CallMemberExpression(e, r, parseArguments(), t, false);
        }

      default:
        {
            ke = !Se;
            nextToken();
            return new AccessMemberExpression(e, r, t);
        }
    }
}

function parseCoverParenthesizedExpressionAndArrowParameterList(e) {
    nextToken();
    const t = xe;
    const r = ye;
    const n = Ce;
    const i = Oe;
    const a = me;
    const o = ke;
    const c = Se;
    const u = [];
    let l = 1;
    let h = false;
    e: while (true) {
        if (Ce === 11) {
            nextToken();
            if (Ce !== 4096) {
                throw expectedIdentifier();
            }
            u.push(new BindingIdentifier(me));
            nextToken();
            if (Ce === 6291471) {
                throw restParamsMustBeLastParam();
            }
            if (Ce !== 7340046) {
                throw invalidSpreadOp();
            }
            nextToken();
            if (Ce !== 50) {
                throw invalidSpreadOp();
            }
            nextToken();
            const e = Se;
            const t = Ee;
            ++Ee;
            const r = parse(62, 0);
            Se = e;
            Ee = t;
            ke = false;
            return new ArrowFunction(u, r, true);
        }
        switch (Ce) {
          case 4096:
            u.push(new BindingIdentifier(me));
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
        switch (Ce) {
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
    if (Ce === 50) {
        if (l === 1) {
            nextToken();
            if (Ce === 524296) {
                throw functionBodyInArrowFN();
            }
            const e = Se;
            const t = Ee;
            ++Ee;
            const r = parse(62, 0);
            Se = e;
            Ee = t;
            ke = false;
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
    xe = t;
    ye = r;
    Ce = n;
    Oe = i;
    me = a;
    ke = o;
    Se = c;
    const f = Se;
    const p = parse(62, e);
    Se = f;
    consume(7340046);
    if (Ce === 50) {
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
    const t = Se;
    nextToken();
    const r = new Array;
    while (Ce !== 7340051) {
        if (consumeOpt(6291471)) {
            r.push(de);
            if (Ce === 7340051) {
                break;
            }
        } else {
            r.push(parse(62, e & ~2));
            if (consumeOpt(6291471)) {
                if (Ce === 7340051) {
                    break;
                }
            } else {
                break;
            }
        }
    }
    Se = t;
    consume(7340051);
    if (e & 2) {
        return new ArrayBindingPattern(r);
    } else {
        ke = false;
        return new ArrayLiteralExpression(r);
    }
}

function parseForOfStatement(e) {
    if ((e.$kind & (19 | 20 | 21)) === 0) {
        throw invalidLHSBindingIdentifierInForOf();
    }
    if (Ce !== 4204593) {
        throw invalidLHSBindingIdentifierInForOf();
    }
    nextToken();
    const t = e;
    const r = parse(61, 4);
    return new ForOfStatement(t, r, Re);
}

function parseObjectLiteralExpression(e) {
    const t = Se;
    const r = new Array;
    const n = new Array;
    nextToken();
    while (Ce !== 7340045) {
        r.push(me);
        if (Ce & 49152) {
            nextToken();
            consume(6291476);
            n.push(parse(62, e & ~2));
        } else if (Ce & 12288) {
            const t = Oe;
            const r = Ce;
            const i = xe;
            nextToken();
            if (consumeOpt(6291476)) {
                n.push(parse(62, e & ~2));
            } else {
                Oe = t;
                Ce = r;
                xe = i;
                n.push(parse(515, e & ~2));
            }
        } else {
            throw invalidPropDefInObjLiteral();
        }
        if (Ce !== 7340045) {
            consume(6291471);
        }
    }
    Se = t;
    consume(7340045);
    if (e & 2) {
        return new ObjectBindingPattern(r, n);
    } else {
        ke = false;
        return new ObjectLiteralExpression(r, n);
    }
}

function parseInterpolation() {
    const e = [];
    const t = [];
    const r = Ae;
    let n = "";
    while (xe < r) {
        switch (Oe) {
          case 36:
            if ($charCodeAt(xe + 1) === 123) {
                e.push(n);
                n = "";
                xe += 2;
                Oe = $charCodeAt(xe);
                nextToken();
                const r = parse(61, 1);
                t.push(r);
                continue;
            } else {
                n += "$";
            }
            break;

          case 92:
            n += Te(unescapeCode(nextChar()));
            break;

          default:
            n += Te(Oe);
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
    const n = Se;
    const i = [ me ];
    consume(2163760);
    const a = [ parse(62, e) ];
    while ((Ce = scanTemplateTail()) !== 2163759) {
        i.push(me);
        consume(2163760);
        a.push(parse(62, e));
    }
    i.push(me);
    ke = false;
    Se = n;
    if (r) {
        nextToken();
        return new TaggedTemplateExpression(i, i, t, a);
    } else {
        nextToken();
        return new TemplateExpression(i, a);
    }
}

function createTemplateTail(e) {
    ke = false;
    const t = [ me ];
    nextToken();
    return new TaggedTemplateExpression(t, t, e);
}

function nextToken() {
    while (xe < Ae) {
        ye = xe;
        if ((Ce = Me[Oe]()) != null) {
            return;
        }
    }
    Ce = 6291456;
}

function nextChar() {
    return Oe = $charCodeAt(++xe);
}

function scanIdentifier() {
    while (Le[nextChar()]) ;
    const e = $e[me = $tokenRaw()];
    return e === undefined ? 4096 : e;
}

function scanNumber(e) {
    let t = Oe;
    if (e === false) {
        do {
            t = nextChar();
        } while (t <= 57 && t >= 48);
        if (t !== 46) {
            me = parseInt($tokenRaw(), 10);
            return 32768;
        }
        t = nextChar();
        if (xe >= Ae) {
            me = parseInt($tokenRaw().slice(0, -1), 10);
            return 32768;
        }
    }
    if (t <= 57 && t >= 48) {
        do {
            t = nextChar();
        } while (t <= 57 && t >= 48);
    } else {
        Oe = $charCodeAt(--xe);
    }
    me = parseFloat($tokenRaw());
    return 32768;
}

function scanString() {
    const e = Oe;
    nextChar();
    let t = 0;
    const r = new Array;
    let n = xe;
    while (Oe !== e) {
        if (Oe === 92) {
            r.push(ge.slice(n, xe));
            nextChar();
            t = unescapeCode(Oe);
            nextChar();
            r.push(Te(t));
            n = xe;
        } else if (xe >= Ae) {
            throw unterminatedStringLiteral();
        } else {
            nextChar();
        }
    }
    const i = ge.slice(n, xe);
    nextChar();
    r.push(i);
    const a = r.join("");
    me = a;
    return 16384;
}

function scanTemplate() {
    let e = true;
    let t = "";
    while (nextChar() !== 96) {
        if (Oe === 36) {
            if (xe + 1 < Ae && $charCodeAt(xe + 1) === 123) {
                xe++;
                e = false;
                break;
            } else {
                t += "$";
            }
        } else if (Oe === 92) {
            t += Te(unescapeCode(nextChar()));
        } else {
            if (xe >= Ae) {
                throw unterminatedTemplateLiteral();
            }
            t += Te(Oe);
        }
    }
    nextChar();
    me = t;
    if (e) {
        return 2163759;
    }
    return 2163760;
}

const scanTemplateTail = () => {
    if (xe >= Ae) {
        throw unterminatedTemplateLiteral();
    }
    xe--;
    return scanTemplate();
};

const consumeOpt = e => {
    if (Ce === e) {
        nextToken();
        return true;
    }
    return false;
};

const consume = e => {
    if (Ce === e) {
        nextToken();
    } else {
        throw missingExpectedToken(e);
    }
};

const invalidStartOfExpression = () => {
    {
        return createError(`AUR0151:${ge}`);
    }
};

const invalidSpreadOp = () => {
    {
        return createError(`AUR0152:${ge}`);
    }
};

const expectedIdentifier = () => {
    {
        return createError(`AUR0153:${ge}`);
    }
};

const invalidMemberExpression = () => {
    {
        return createError(`AUR0154:${ge}`);
    }
};

const unexpectedEndOfExpression = () => {
    {
        return createError(`AUR0155:${ge}`);
    }
};

const unconsumedToken = () => {
    {
        return createError(`AUR0156:${ge}`);
    }
};

const invalidEmptyExpression = () => {
    {
        return createError(`AUR0157`);
    }
};

const lhsNotAssignable = () => {
    {
        return createError(`AUR0158:${ge}`);
    }
};

const expectedValueConverterIdentifier = () => {
    {
        return createError(`AUR0159:${ge}`);
    }
};

const expectedBindingBehaviorIdentifier = () => {
    {
        return createError(`AUR0160:${ge}`);
    }
};

const unexpectedOfKeyword = () => {
    {
        return createError(`AUR0161:${ge}`);
    }
};

const invalidLHSBindingIdentifierInForOf = () => {
    {
        return createError(`AUR0163:${ge}`);
    }
};

const invalidPropDefInObjLiteral = () => {
    {
        return createError(`AUR0164:${ge}`);
    }
};

const unterminatedStringLiteral = () => {
    {
        return createError(`AUR0165:${ge}`);
    }
};

const unterminatedTemplateLiteral = () => {
    {
        return createError(`AUR0166:${ge}`);
    }
};

const missingExpectedToken = e => {
    {
        return createError(`AUR0167:${ge}<${Pe[e & 63]}`);
    }
};

const unexpectedCharacter = () => {
    {
        throw createError(`AUR0168:${ge}`);
    }
};

unexpectedCharacter.notMapped = true;

const unexpectedTokenInDestructuring = () => {
    {
        return createError(`AUR0170:${ge}`);
    }
};

const unexpectedTokenInOptionalChain = () => {
    {
        return createError(`AUR0171:${ge}`);
    }
};

const invalidTaggedTemplateOnOptionalChain = () => {
    {
        return createError(`AUR0172:${ge}`);
    }
};

const invalidArrowParameterList = () => {
    {
        return createError(`AUR0173:${ge}`);
    }
};

const defaultParamsInArrowFn = () => {
    {
        return createError(`AUR0174:${ge}`);
    }
};

const destructuringParamsInArrowFn = () => {
    {
        return createError(`AUR0175:${ge}`);
    }
};

const restParamsMustBeLastParam = () => {
    {
        return createError(`AUR0176:${ge}`);
    }
};

const functionBodyInArrowFN = () => {
    {
        return createError(`AUR0178:${ge}`);
    }
};

const unexpectedDoubleDot = () => {
    {
        return createError(`AUR0179:${ge}`);
    }
};

const Pe = [ he, fe, pe, de, "$this", null, "$parent", "(", "{", ".", "..", "...", "?.", "}", ")", ",", "[", "]", ":", ";", "?", "'", '"', "&", "|", "??", "||", "&&", "==", "!=", "===", "!==", "<", ">", "<=", ">=", "in", "instanceof", "+", "-", "typeof", "void", "*", "%", "/", "=", "!", 2163759, 2163760, "of", "=>" ];

const $e = h(Object.create(null), {
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

const Ie = {
    AsciiIdPart: [ 36, 0, 48, 58, 65, 91, 95, 0, 97, 123 ],
    IdStart: [ 36, 0, 65, 91, 95, 0, 97, 123, 170, 0, 186, 0, 192, 215, 216, 247, 248, 697, 736, 741, 7424, 7462, 7468, 7517, 7522, 7526, 7531, 7544, 7545, 7615, 7680, 7936, 8305, 0, 8319, 0, 8336, 8349, 8490, 8492, 8498, 0, 8526, 0, 8544, 8585, 11360, 11392, 42786, 42888, 42891, 42927, 42928, 42936, 42999, 43008, 43824, 43867, 43868, 43877, 64256, 64263, 65313, 65339, 65345, 65371 ],
    Digit: [ 48, 58 ],
    Skip: [ 0, 33, 127, 161 ]
};

const decompress = (e, t, r, n) => {
    const i = r.length;
    for (let a = 0; a < i; a += 2) {
        const i = r[a];
        let o = r[a + 1];
        o = o > 0 ? o : i + 1;
        if (e) {
            e.fill(n, i, o);
        }
        if (t) {
            for (let e = i; e < o; e++) {
                t.add(e);
            }
        }
    }
};

const returnToken = e => () => {
    nextChar();
    return e;
};

const Ue = new Set;

decompress(null, Ue, Ie.AsciiIdPart, true);

const Le = new Uint8Array(65535);

decompress(Le, null, Ie.IdStart, 1);

decompress(Le, null, Ie.Digit, 1);

const Me = new Array(65535);

Me.fill(unexpectedCharacter, 0, 65535);

decompress(Me, null, Ie.Skip, (() => {
    nextChar();
    return null;
}));

decompress(Me, null, Ie.IdStart, scanIdentifier);

decompress(Me, null, Ie.Digit, (() => scanNumber(false)));

Me[34] = Me[39] = () => scanString();

Me[96] = () => scanTemplate();

Me[33] = () => {
    if (nextChar() !== 61) {
        return 131118;
    }
    if (nextChar() !== 61) {
        return 6553949;
    }
    nextChar();
    return 6553951;
};

Me[61] = () => {
    if (nextChar() === 62) {
        nextChar();
        return 50;
    }
    if (Oe !== 61) {
        return 4194349;
    }
    if (nextChar() !== 61) {
        return 6553948;
    }
    nextChar();
    return 6553950;
};

Me[38] = () => {
    if (nextChar() !== 38) {
        return 6291479;
    }
    nextChar();
    return 6553883;
};

Me[124] = () => {
    if (nextChar() !== 124) {
        return 6291480;
    }
    nextChar();
    return 6553818;
};

Me[63] = () => {
    if (nextChar() === 46) {
        const e = $charCodeAt(xe + 1);
        if (e <= 48 || e >= 57) {
            nextChar();
            return 2162700;
        }
        return 6291478;
    }
    if (Oe !== 63) {
        return 6291478;
    }
    nextChar();
    return 6553753;
};

Me[46] = () => {
    if (nextChar() <= 57 && Oe >= 48) {
        return scanNumber(true);
    }
    if (Oe === 46) {
        if (nextChar() !== 46) {
            return 10;
        }
        nextChar();
        return 11;
    }
    return 65545;
};

Me[60] = () => {
    if (nextChar() !== 61) {
        return 6554016;
    }
    nextChar();
    return 6554018;
};

Me[62] = () => {
    if (nextChar() !== 61) {
        return 6554017;
    }
    nextChar();
    return 6554019;
};

Me[37] = returnToken(6554155);

Me[40] = returnToken(2688007);

Me[41] = returnToken(7340046);

Me[42] = returnToken(6554154);

Me[43] = returnToken(2490854);

Me[44] = returnToken(6291471);

Me[45] = returnToken(2490855);

Me[47] = returnToken(6554156);

Me[58] = returnToken(6291476);

Me[59] = returnToken(6291477);

Me[91] = returnToken(2688016);

Me[93] = returnToken(7340051);

Me[123] = returnToken(524296);

Me[125] = returnToken(7340045);

let _e = null;

const Be = [];

let De = false;

function pauseConnecting() {
    De = false;
}

function resumeConnecting() {
    De = true;
}

function currentConnectable() {
    return _e;
}

function enterConnectable(e) {
    if (e == null) {
        throw createError(`AUR0206`);
    }
    if (_e == null) {
        _e = e;
        Be[0] = _e;
        De = true;
        return;
    }
    if (_e === e) {
        throw createError(`AUR0207`);
    }
    Be.push(e);
    _e = e;
    De = true;
}

function exitConnectable(e) {
    if (e == null) {
        throw createError(`AUR0208`);
    }
    if (_e !== e) {
        throw createError(`AUR0209`);
    }
    Be.pop();
    _e = Be.length > 0 ? Be[Be.length - 1] : null;
    De = _e != null;
}

const je = Object.freeze({
    get current() {
        return _e;
    },
    get connecting() {
        return De;
    },
    enter: enterConnectable,
    exit: exitConnectable,
    pause: pauseConnecting,
    resume: resumeConnecting
});

const Fe = Reflect.get;

const Ve = Object.prototype.toString;

const Ne = new WeakMap;

const He = "__au_nw__";

const Ke = "__au_nw";

function canWrap(e) {
    switch (Ve.call(e)) {
      case "[object Object]":
        return e.constructor[He] !== true;

      case "[object Array]":
      case "[object Map]":
      case "[object Set]":
        return true;

      default:
        return false;
    }
}

const ze = "__raw__";

function wrap(e) {
    return canWrap(e) ? getProxy(e) : e;
}

function getProxy(e) {
    return Ne.get(e) ?? createProxy(e);
}

function getRaw(e) {
    return e[ze] ?? e;
}

function unwrap(e) {
    return canWrap(e) && e[ze] || e;
}

function doNotCollect(e, t) {
    return t === "constructor" || t === "__proto__" || t === "$observers" || t === Symbol.toPrimitive || t === Symbol.toStringTag || e.constructor[`${Ke}_${f(t)}__`] === true;
}

function createProxy(e) {
    const t = isArray(e) ? qe : isMap(e) || isSet(e) ? Je : We;
    const r = new Proxy(e, t);
    Ne.set(e, r);
    Ne.set(r, r);
    return r;
}

const We = {
    get(e, t, r) {
        if (t === ze) {
            return e;
        }
        const n = currentConnectable();
        if (!De || doNotCollect(e, t) || n == null) {
            return Fe(e, t, r);
        }
        n.observe(e, t);
        return wrap(Fe(e, t, r));
    }
};

const qe = {
    get(e, t, r) {
        if (t === ze) {
            return e;
        }
        if (!De || doNotCollect(e, t) || _e == null) {
            return Fe(e, t, r);
        }
        switch (t) {
          case "length":
            _e.observe(e, "length");
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
        _e.observe(e, t);
        return wrap(Fe(e, t, r));
    },
    ownKeys(e) {
        currentConnectable()?.observe(e, "length");
        return Reflect.ownKeys(e);
    }
};

function wrappedArrayMap(e, t) {
    const r = getRaw(this);
    const n = r.map(((r, n) => unwrap(e.call(t, wrap(r), n, this))));
    observeCollection(_e, r);
    return wrap(n);
}

function wrappedArrayEvery(e, t) {
    const r = getRaw(this);
    const n = r.every(((r, n) => e.call(t, wrap(r), n, this)));
    observeCollection(_e, r);
    return n;
}

function wrappedArrayFilter(e, t) {
    const r = getRaw(this);
    const n = r.filter(((r, n) => unwrap(e.call(t, wrap(r), n, this))));
    observeCollection(_e, r);
    return wrap(n);
}

function wrappedArrayIncludes(e) {
    const t = getRaw(this);
    const r = t.includes(unwrap(e));
    observeCollection(_e, t);
    return r;
}

function wrappedArrayIndexOf(e) {
    const t = getRaw(this);
    const r = t.indexOf(unwrap(e));
    observeCollection(_e, t);
    return r;
}

function wrappedArrayLastIndexOf(e) {
    const t = getRaw(this);
    const r = t.lastIndexOf(unwrap(e));
    observeCollection(_e, t);
    return r;
}

function wrappedArrayFindIndex(e, t) {
    const r = getRaw(this);
    const n = r.findIndex(((r, n) => unwrap(e.call(t, wrap(r), n, this))));
    observeCollection(_e, r);
    return n;
}

function wrappedArrayFind(e, t) {
    const r = getRaw(this);
    const n = r.find(((t, r) => e(wrap(t), r, this)), t);
    observeCollection(_e, r);
    return wrap(n);
}

function wrappedArrayFlat() {
    const e = getRaw(this);
    observeCollection(_e, e);
    return wrap(e.flat());
}

function wrappedArrayFlatMap(e, t) {
    const r = getRaw(this);
    observeCollection(_e, r);
    return getProxy(r.flatMap(((r, n) => wrap(e.call(t, wrap(r), n, this)))));
}

function wrappedArrayJoin(e) {
    const t = getRaw(this);
    observeCollection(_e, t);
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
    observeCollection(_e, t);
    return wrap(r);
}

function wrappedArraySome(e, t) {
    const r = getRaw(this);
    const n = r.some(((r, n) => unwrap(e.call(t, wrap(r), n, this))));
    observeCollection(_e, r);
    return n;
}

function wrappedArraySort(e) {
    const t = getRaw(this);
    const r = t.sort(e);
    observeCollection(_e, t);
    return wrap(r);
}

function wrappedArraySlice(e, t) {
    const r = getRaw(this);
    observeCollection(_e, r);
    return getProxy(r.slice(e, t));
}

function wrappedReduce(e, t) {
    const r = getRaw(this);
    const n = r.reduce(((t, r, n) => e(t, wrap(r), n, this)), t);
    observeCollection(_e, r);
    return wrap(n);
}

function wrappedReduceRight(e, t) {
    const r = getRaw(this);
    const n = r.reduceRight(((t, r, n) => e(t, wrap(r), n, this)), t);
    observeCollection(_e, r);
    return wrap(n);
}

const Je = {
    get(e, t, r) {
        if (t === ze) {
            return e;
        }
        const n = currentConnectable();
        if (!De || doNotCollect(e, t) || n == null) {
            return Fe(e, t, r);
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
        return wrap(Fe(e, t, r));
    }
};

function wrappedForEach(e, t) {
    const r = getRaw(this);
    observeCollection(_e, r);
    return r.forEach(((r, n) => {
        e.call(t, wrap(r), wrap(n), this);
    }));
}

function wrappedHas(e) {
    const t = getRaw(this);
    observeCollection(_e, t);
    return t.has(unwrap(e));
}

function wrappedGet(e) {
    const t = getRaw(this);
    observeCollection(_e, t);
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
    observeCollection(_e, e);
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
    observeCollection(_e, e);
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
    observeCollection(_e, e);
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

const Ge = Object.freeze({
    getProxy: getProxy,
    getRaw: getRaw,
    wrap: wrap,
    unwrap: unwrap,
    rawKey: ze
});

class ComputedObserver {
    constructor(e, t, r, n, i) {
        this.type = 1;
        this.v = void 0;
        this.ir = false;
        this.D = false;
        this.o = e;
        this.A = i ? wrap(e) : e;
        this.$get = t;
        this.$set = r;
        this.oL = n;
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
            if (e !== this.v) {
                this.ir = true;
                this.$set.call(this.o, e);
                this.ir = false;
                this.run();
            }
        } else {
            throw createError(`AUR0221`);
        }
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
        if (!l(t, e)) {
            this.subs.notify(this.v, e);
        }
    }
    compute() {
        this.ir = true;
        this.obs.version++;
        try {
            enterConnectable(this);
            return this.v = unwrap(this.$get.call(this.A, this.A, this));
        } finally {
            this.obs.clear();
            this.ir = false;
            exitConnectable(this);
        }
    }
}

connectable(ComputedObserver);

subscriberCollection(ComputedObserver);

const Qe = p("IDirtyChecker", (e => e.singleton(DirtyChecker)));

const Xe = {
    timeoutsPerCheck: 25,
    disabled: false,
    throw: false,
    resetToDefault() {
        this.timeoutsPerCheck = 6;
        this.disabled = false;
        this.throw = false;
    }
};

const Ye = {
    persistent: true
};

class DirtyChecker {
    constructor(e) {
        this.p = e;
        this.tracked = [];
        this.C = null;
        this.O = 0;
        this.check = () => {
            if (Xe.disabled) {
                return;
            }
            if (++this.O < Xe.timeoutsPerCheck) {
                return;
            }
            this.O = 0;
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
    }
    createProperty(e, t) {
        if (Xe.throw) {
            throw createError(`AUR0222:${f(t)}`);
        }
        return new DirtyCheckProperty(this, e, t);
    }
    addProperty(e) {
        this.tracked.push(e);
        if (this.tracked.length === 1) {
            this.C = this.p.taskQueue.queueTask(this.check, Ye);
        }
    }
    removeProperty(e) {
        this.tracked.splice(this.tracked.indexOf(e), 1);
        if (this.tracked.length === 0) {
            this.C.cancel();
            this.C = null;
        }
    }
}

DirtyChecker.inject = [ i ];

class DirtyCheckProperty {
    constructor(e, t, r) {
        this.obj = t;
        this.key = r;
        this.type = 0;
        this.ov = void 0;
        this.R = e;
    }
    getValue() {
        return this.obj[this.key];
    }
    setValue(e) {
        throw createError(`Trying to set value for property ${f(this.key)} in dirty checker`);
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
            this.R.addProperty(this);
        }
    }
    unsubscribe(e) {
        if (this.subs.remove(e) && this.subs.count === 0) {
            this.R.removeProperty(this);
        }
    }
}

subscriberCollection(DirtyCheckProperty);

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
        this.o = e;
        this.k = t;
    }
    getValue() {
        return this.v;
    }
    setValue(e) {
        if (this.iO) {
            if (l(e, this.v)) {
                return;
            }
            Ze = this.v;
            this.v = e;
            this.subs.notify(e, Ze);
        } else {
            this.o[this.k] = e;
        }
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
            u(this.o, this.k, {
                enumerable: true,
                configurable: true,
                get: () => this.getValue(),
                set: e => {
                    this.setValue(e);
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
            e = this.S(e, null);
        }
        if (!l(e, this.v)) {
            this.ov = this.v;
            this.v = e;
            this.cb?.call(this.o, this.v, this.ov);
            Ze = this.ov;
            this.ov = this.v;
            this.subs.notify(this.v, Ze);
        }
    }
}

subscriberCollection(SetterObserver);

subscriberCollection(SetterNotifier);

let Ze = void 0;

const et = new PropertyAccessor;

const tt = /*@__PURE__*/ p("IObserverLocator", (e => e.singleton(ObserverLocator)));

const st = /*@__PURE__*/ p("INodeObserverLocator", (e => e.cachedCallback((e => new DefaultNodeObserverLocator))));

class DefaultNodeObserverLocator {
    handles() {
        return false;
    }
    getObserver() {
        return et;
    }
    getAccessor() {
        return et;
    }
}

class ObserverLocator {
    constructor(e, t) {
        this.T = [];
        this.R = e;
        this.P = t;
    }
    addAdapter(e) {
        this.T.push(e);
    }
    getObserver(e, t) {
        if (e == null) {
            throw nullObjectError(f(t));
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
        if (this.P.handles(e, t, this)) {
            return this.P.getAccessor(e, t, this);
        }
        return et;
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
        if (this.P.handles(e, t, this)) {
            return this.P.getObserver(e, t, this);
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
        let r = nt(e, t);
        if (r === void 0) {
            let n = rt(e);
            while (n !== null) {
                r = nt(n, t);
                if (r === void 0) {
                    n = rt(n);
                } else {
                    break;
                }
            }
        }
        if (r !== void 0 && !c.call(r, "value")) {
            let n = this.$(e, t, r);
            if (n == null) {
                n = (r.get?.getObserver ?? r.set?.getObserver)?.(e, this);
            }
            return n == null ? r.configurable ? this.I(e, t, r, true) : this.R.createProperty(e, t) : n;
        }
        return new SetterObserver(e, t);
    }
    I(e, t, r, n) {
        const i = new ComputedObserver(e, r.get, r.set, this, !!n);
        u(e, t, {
            enumerable: r.enumerable,
            configurable: true,
            get: h((() => i.getValue()), {
                getObserver: () => i
            }),
            set: e => {
                i.setValue(e);
            }
        });
        return i;
    }
    $(e, t, r) {
        if (this.T.length > 0) {
            for (const n of this.T) {
                const i = n.getObserver(e, t, r, this);
                if (i != null) {
                    return i;
                }
            }
        }
        return null;
    }
}

ObserverLocator.inject = [ Qe, st ];

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

const rt = Object.getPrototypeOf;

const nt = Object.getOwnPropertyDescriptor;

const getObserverLookup = e => {
    let t = e.$observers;
    if (t === void 0) {
        u(e, "$observers", {
            enumerable: false,
            value: t = createLookup()
        });
    }
    return t;
};

const nullObjectError = e => createError(`AUR0199:${f(e)}`);

const it = /*@__PURE__*/ p("IObservation", (e => e.singleton(Observation)));

class Observation {
    static get inject() {
        return [ tt ];
    }
    constructor(e) {
        this.oL = e;
        this.U = {
            immediate: true
        };
    }
    run(e) {
        const t = new RunEffect(this.oL, e);
        t.run();
        return t;
    }
    watch(e, t, r, n = this.U) {
        let i = undefined;
        let a = false;
        const o = this.oL.getObserver(e, t);
        const c = {
            handleChange: (e, t) => r(e, i = t)
        };
        const run = () => {
            if (a) return;
            r(o.getValue(), i);
        };
        const stop = () => {
            a = true;
            o.unsubscribe(c);
        };
        o.subscribe(c);
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
        u(e, "$observers", {
            value: {}
        });
    }
    return e.$observers;
}

const at = {};

function observable(e, t, r) {
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
            throw createError(`AUR0224`);
        }
        const a = n.callback || `${f(t)}Changed`;
        let o = at;
        if (r) {
            delete r.value;
            delete r.writable;
            o = r.initializer?.();
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
            const e = getNotifier(this, t, a, o, c);
            currentConnectable()?.subscribeTo(e);
            return e.getValue();
        };
        r.set = function s(e) {
            getNotifier(this, t, a, o, c).setValue(e);
        };
        r.get.getObserver = function gO(e) {
            return getNotifier(e, t, a, o, c);
        };
        if (i) {
            u(e.prototype, t, r);
        } else {
            return r;
        }
    }
}

function getNotifier(e, t, r, n, i) {
    const a = getObserversLookup(e);
    let o = a[t];
    if (o == null) {
        o = new SetterNotifier(e, r, i, n === at ? void 0 : n);
        a[t] = o;
    }
    return o;
}

function nowrap(e, t) {
    if (e == null) {
        return (e, t) => deco(e, t);
    } else {
        return deco(e, t);
    }
    function deco(e, t) {
        const r = !t;
        if (r) {
            defineHiddenProp(e, He, true);
        } else {
            defineHiddenProp(e.constructor, `${Ke}_${f(t)}__`, true);
        }
    }
}

const ot = p("ISignaler", (e => e.singleton(Signaler)));

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

export { AccessKeyedExpression, AccessMemberExpression, AccessScopeExpression, AccessThisExpression, y as AccessorType, ArrayBindingPattern, ArrayIndexObserver, ArrayLiteralExpression, ArrayObserver, ArrowFunction, AssignExpression, BinaryExpression, BindingBehaviorExpression, BindingContext, BindingIdentifier, BindingObserverRecord, CallFunctionExpression, CallMemberExpression, CallScopeExpression, E as CollectionKind, CollectionLengthObserver, CollectionSizeObserver, ComputedObserver, ConditionalExpression, je as ConnectableSwitcher, CustomExpression, DestructuringAssignmentExpression, DestructuringAssignmentRestExpression, DestructuringAssignmentSingleExpression, DirtyCheckProperty, Xe as DirtyCheckSettings, b as ExpressionKind, ve as ExpressionType, ForOfStatement, A as ICoercionConfiguration, Qe as IDirtyChecker, le as IExpressionParser, st as INodeObserverLocator, it as IObservation, tt as IObserverLocator, ot as ISignaler, Interpolation, MapObserver, ObjectBindingPattern, ObjectLiteralExpression, Observation, ObserverLocator, PrimitiveLiteralExpression, PrimitiveObserver, PropertyAccessor, Ge as ProxyObservable, Scope, SetObserver, SetterObserver, SubscriberRecord, TaggedTemplateExpression, TemplateExpression, UnaryExpression, Unparser, ValueConverterExpression, applyMutationsToIndices, astAssign, astBind, astEvaluate, astUnbind, astVisit, batch, cloneIndexMap, connectable, copyIndexMap, createIndexMap, disableArrayObservation, disableMapObservation, disableSetObservation, enableArrayObservation, enableMapObservation, enableSetObservation, getCollectionObserver, getObserverLookup, isIndexMap, nowrap, observable, parseExpression, subscriberCollection, synchronizeIndices };
//# sourceMappingURL=index.mjs.map
