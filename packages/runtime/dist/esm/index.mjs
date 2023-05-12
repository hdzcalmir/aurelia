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

const p = String;

const d = e.createInterface;

const createLookup = () => c.create(null);

const w = a.getOwn;

a.hasOwn;

const b = a.define;

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
        this.text += p(e.value);
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

var v;

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
})(v || (v = {}));

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

const x = Scope.getContext;

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
            const i = x(t, e.name, e.ancestor);
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
            const o = x(t, e.name, e.ancestor);
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
                if (isArray(i) && A.includes(e.name)) {
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
                i += p(astEvaluate(e.expressions[o], t, r, n));
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

function astAssign(e, t, r, i) {
    switch (e.$kind) {
      case 1:
        {
            if (e.name === "$host") {
                throw createError(`AUR0106`);
            }
            const r = x(t, e.name, e.ancestor);
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
            const o = n.length;
            let a;
            let c;
            for (a = 0; a < o; a++) {
                c = n[a];
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
                const o = e.indexOrProperties;
                let a;
                if (n(o)) {
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
                astAssign(e.target, t, r, a);
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

const A = "at map filter includes indexOf lastIndexOf findIndex find flat flatMap join reduce reduceRight slice every some sort".split(" ");

const E = /*@__PURE__*/ e.createInterface("ICoercionConfiguration");

var y;

(function(e) {
    e[e["indexed"] = 8] = "indexed";
    e[e["keyed"] = 4] = "keyed";
    e[e["array"] = 9] = "array";
    e[e["map"] = 6] = "map";
    e[e["set"] = 7] = "set";
})(y || (y = {}));

var C;

(function(e) {
    e[e["None"] = 0] = "None";
    e[e["Observer"] = 1] = "Observer";
    e[e["Node"] = 2] = "Node";
    e[e["Layout"] = 4] = "Layout";
})(C || (C = {}));

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

let m = new Map;

let k = false;

function batch(e) {
    const t = m;
    const r = m = new Map;
    k = true;
    try {
        e();
    } finally {
        m = null;
        k = false;
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
            m = t;
        }
    }
}

function addCollectionBatch(e, t, r) {
    if (!m.has(e)) {
        m.set(e, [ 2, t, r ]);
    }
}

function addValueBatch(e, t, r) {
    const n = m.get(e);
    if (n === void 0) {
        m.set(e, [ 1, t, r ]);
    } else {
        n[1] = t;
        n[2] = r;
    }
}

function subscriberCollection(e) {
    return e == null ? subscriberCollectionDeco : subscriberCollectionDeco(e);
}

const O = new WeakSet;

function subscriberCollectionDeco(e) {
    if (O.has(e)) {
        return;
    }
    O.add(e);
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
        if (k) {
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

const S = Symbol.for("__au_arr_obs__");

const R = Array[S] ?? defineHiddenProp(Array, S, new WeakMap);

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

const T = Array.prototype;

const P = T.push;

const $ = T.unshift;

const I = T.pop;

const U = T.shift;

const L = T.splice;

const M = T.reverse;

const _ = T.sort;

const B = {
    push: P,
    unshift: $,
    pop: I,
    shift: U,
    splice: L,
    reverse: M,
    sort: _
};

const D = [ "push", "unshift", "pop", "shift", "splice", "reverse", "sort" ];

const j = {
    push: function(...e) {
        const t = R.get(this);
        if (t === void 0) {
            return P.apply(this, e);
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
        const t = R.get(this);
        if (t === void 0) {
            return $.apply(this, e);
        }
        const r = e.length;
        const n = new Array(r);
        let i = 0;
        while (i < r) {
            n[i++] = -2;
        }
        $.apply(t.indexMap, n);
        const o = $.apply(this, e);
        t.notify();
        return o;
    },
    pop: function() {
        const e = R.get(this);
        if (e === void 0) {
            return I.call(this);
        }
        const t = e.indexMap;
        const r = I.call(this);
        const n = t.length - 1;
        if (t[n] > -1) {
            t.deletedIndices.push(t[n]);
            t.deletedItems.push(r);
        }
        I.call(t);
        e.notify();
        return r;
    },
    shift: function() {
        const e = R.get(this);
        if (e === void 0) {
            return U.call(this);
        }
        const t = e.indexMap;
        const r = U.call(this);
        if (t[0] > -1) {
            t.deletedIndices.push(t[0]);
            t.deletedItems.push(r);
        }
        U.call(t);
        e.notify();
        return r;
    },
    splice: function(...e) {
        const t = e[0];
        const r = e[1];
        const n = R.get(this);
        if (n === void 0) {
            return L.apply(this, e);
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
            L.call(c, t, r, ...n);
        } else {
            L.apply(c, e);
        }
        const f = L.apply(this, e);
        if (l > 0 || h > 0) {
            n.notify();
        }
        return f;
    },
    reverse: function() {
        const e = R.get(this);
        if (e === void 0) {
            M.call(this);
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
        const t = R.get(this);
        if (t === void 0) {
            _.call(this, e);
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

for (const e of D) {
    l(j[e], "observing", {
        value: true,
        writable: false,
        configurable: false,
        enumerable: false
    });
}

let F = false;

const N = "__au_arr_on__";

function enableArrayObservation() {
    if (!(w(N, Array) ?? false)) {
        b(N, true, Array);
        for (const e of D) {
            if (T[e].observing !== true) {
                defineHiddenProp(T, e, j[e]);
            }
        }
    }
}

function disableArrayObservation() {
    for (const e of D) {
        if (T[e].observing === true) {
            defineHiddenProp(T, e, B[e]);
        }
    }
}

class ArrayObserver {
    constructor(e) {
        this.type = 1;
        if (!F) {
            F = true;
            enableArrayObservation();
        }
        this.indexObservers = {};
        this.collection = e;
        this.indexMap = createIndexMap(e.length);
        this.lenObs = void 0;
        R.set(e, this);
    }
    notify() {
        const e = this.subs;
        const t = this.indexMap;
        if (k) {
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
    let t = R.get(e);
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

const V = Symbol.for("__au_set_obs__");

const H = Set[V] ?? defineHiddenProp(Set, V, new WeakMap);

const K = Set.prototype;

const z = K.add;

const W = K.clear;

const q = K.delete;

const J = {
    add: z,
    clear: W,
    delete: q
};

const G = [ "add", "clear", "delete" ];

const Q = {
    add: function(e) {
        const t = H.get(this);
        if (t === undefined) {
            z.call(this, e);
            return this;
        }
        const r = this.size;
        z.call(this, e);
        const n = this.size;
        if (n === r) {
            return this;
        }
        t.indexMap[r] = -2;
        t.notify();
        return this;
    },
    clear: function() {
        const e = H.get(this);
        if (e === undefined) {
            return W.call(this);
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
            W.call(this);
            t.length = 0;
            e.notify();
        }
        return undefined;
    },
    delete: function(e) {
        const t = H.get(this);
        if (t === undefined) {
            return q.call(this, e);
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
                const o = q.call(this, e);
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

const X = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const e of G) {
    l(Q[e], "observing", {
        value: true,
        writable: false,
        configurable: false,
        enumerable: false
    });
}

let Y = false;

const Z = "__au_set_on__";

function enableSetObservation() {
    if (!(w(Z, Set) ?? false)) {
        b(Z, true, Set);
        for (const e of G) {
            if (K[e].observing !== true) {
                l(K, e, {
                    ...X,
                    value: Q[e]
                });
            }
        }
    }
}

function disableSetObservation() {
    for (const e of G) {
        if (K[e].observing === true) {
            l(K, e, {
                ...X,
                value: J[e]
            });
        }
    }
}

class SetObserver {
    constructor(e) {
        this.type = 1;
        if (!Y) {
            Y = true;
            enableSetObservation();
        }
        this.collection = e;
        this.indexMap = createIndexMap(e.size);
        this.lenObs = void 0;
        H.set(e, this);
    }
    notify() {
        const e = this.subs;
        const t = this.indexMap;
        if (k) {
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
    let t = H.get(e);
    if (t === void 0) {
        t = new SetObserver(e);
    }
    return t;
}

const ee = Symbol.for("__au_map_obs__");

const te = Map[ee] ?? defineHiddenProp(Map, ee, new WeakMap);

const se = Map.prototype;

const re = se.set;

const ne = se.clear;

const ie = se.delete;

const oe = {
    set: re,
    clear: ne,
    delete: ie
};

const ae = [ "set", "clear", "delete" ];

const ce = {
    set: function(e, t) {
        const r = te.get(this);
        if (r === undefined) {
            re.call(this, e, t);
            return this;
        }
        const n = this.get(e);
        const i = this.size;
        re.call(this, e, t);
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
        const e = te.get(this);
        if (e === undefined) {
            return ne.call(this);
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
            ne.call(this);
            t.length = 0;
            e.notify();
        }
        return undefined;
    },
    delete: function(e) {
        const t = te.get(this);
        if (t === undefined) {
            return ie.call(this, e);
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
                const o = ie.call(this, e);
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

const ue = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const e of ae) {
    l(ce[e], "observing", {
        value: true,
        writable: false,
        configurable: false,
        enumerable: false
    });
}

let le = false;

const he = "__au_map_on__";

function enableMapObservation() {
    if (!(w(he, Map) ?? false)) {
        b(he, true, Map);
        for (const e of ae) {
            if (se[e].observing !== true) {
                l(se, e, {
                    ...ue,
                    value: ce[e]
                });
            }
        }
    }
}

function disableMapObservation() {
    for (const e of ae) {
        if (se[e].observing === true) {
            l(se, e, {
                ...ue,
                value: oe[e]
            });
        }
    }
}

class MapObserver {
    constructor(e) {
        this.type = 1;
        if (!le) {
            le = true;
            enableMapObservation();
        }
        this.collection = e;
        this.indexMap = createIndexMap(e.size);
        this.lenObs = void 0;
        te.set(e, this);
    }
    notify() {
        const e = this.subs;
        const t = this.indexMap;
        if (k) {
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
    let t = te.get(e);
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

const fe = d("IExpressionParser", (e => e.singleton(ExpressionParser)));

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
        Ae = e;
        Ee = 0;
        ye = e.length;
        Ce = 0;
        me = 0;
        ke = 6291456;
        Oe = "";
        Se = $charCodeAt(0);
        Re = true;
        Te = false;
        Pe = -1;
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

const pe = PrimitiveLiteralExpression.$false;

const de = PrimitiveLiteralExpression.$true;

const we = PrimitiveLiteralExpression.$null;

const be = PrimitiveLiteralExpression.$undefined;

const ve = AccessThisExpression.$this;

const ge = AccessThisExpression.$parent;

var xe;

(function(e) {
    e[e["None"] = 0] = "None";
    e[e["Interpolation"] = 1] = "Interpolation";
    e[e["IsIterator"] = 2] = "IsIterator";
    e[e["IsChainable"] = 4] = "IsChainable";
    e[e["IsFunction"] = 8] = "IsFunction";
    e[e["IsProperty"] = 16] = "IsProperty";
    e[e["IsCustom"] = 32] = "IsCustom";
})(xe || (xe = {}));

let Ae = "";

let Ee = 0;

let ye = 0;

let Ce = 0;

let me = 0;

let ke = 6291456;

let Oe = "";

let Se;

let Re = true;

let Te = false;

let Pe = -1;

const $e = String.fromCharCode;

const $charCodeAt = e => Ae.charCodeAt(e);

const $tokenRaw = () => Ae.slice(me, Ee);

function parseExpression(e, t) {
    Ae = e;
    Ee = 0;
    ye = e.length;
    Ce = 0;
    me = 0;
    ke = 6291456;
    Oe = "";
    Se = $charCodeAt(0);
    Re = true;
    Te = false;
    Pe = -1;
    return parse(61, t === void 0 ? 16 : t);
}

function parse(e, t) {
    if (t === 32) {
        return new CustomExpression(Ae);
    }
    if (Ee === 0) {
        if (t & 1) {
            return parseInterpolation();
        }
        nextToken();
        if (ke & 4194304) {
            throw invalidStartOfExpression();
        }
    }
    Re = 513 > e;
    Te = false;
    let r = false;
    let n = void 0;
    let i = 0;
    if (ke & 131072) {
        const e = Ie[ke & 63];
        nextToken();
        n = new UnaryExpression(e, parse(514, t));
        Re = false;
    } else {
        e: switch (ke) {
          case 12294:
            i = Ce;
            Re = false;
            do {
                nextToken();
                ++i;
                switch (ke) {
                  case 65545:
                    nextToken();
                    if ((ke & 12288) === 0) {
                        throw expectedIdentifier();
                    }
                    break;

                  case 10:
                  case 11:
                    throw expectedIdentifier();

                  case 2162700:
                    Te = true;
                    nextToken();
                    if ((ke & 12288) === 0) {
                        n = i === 0 ? ve : i === 1 ? ge : new AccessThisExpression(i);
                        r = true;
                        break e;
                    }
                    break;

                  default:
                    if (ke & 2097152) {
                        n = i === 0 ? ve : i === 1 ? ge : new AccessThisExpression(i);
                        break e;
                    }
                    throw invalidMemberExpression();
                }
            } while (ke === 12294);

          case 4096:
            {
                const e = Oe;
                if (t & 2) {
                    n = new BindingIdentifier(e);
                } else {
                    n = new AccessScopeExpression(e, i);
                }
                Re = !Te;
                nextToken();
                if (consumeOpt(50)) {
                    if (ke === 524296) {
                        throw functionBodyInArrowFN();
                    }
                    const t = Te;
                    const r = Ce;
                    ++Ce;
                    const i = parse(62, 0);
                    Te = t;
                    Ce = r;
                    Re = false;
                    n = new ArrowFunction([ new BindingIdentifier(e) ], i);
                }
                break;
            }

          case 10:
            throw unexpectedDoubleDot();

          case 11:
            throw invalidSpreadOp();

          case 12292:
            Re = false;
            nextToken();
            switch (Ce) {
              case 0:
                n = ve;
                break;

              case 1:
                n = ge;
                break;

              default:
                n = new AccessThisExpression(Ce);
                break;
            }
            break;

          case 2688007:
            n = parseCoverParenthesizedExpressionAndArrowParameterList(t);
            break;

          case 2688016:
            n = Ae.search(/\s+of\s+/) > Ee ? parseArrayDestructuring() : parseArrayLiteralExpression(t);
            break;

          case 524296:
            n = parseObjectLiteralExpression(t);
            break;

          case 2163759:
            n = new TemplateExpression([ Oe ]);
            Re = false;
            nextToken();
            break;

          case 2163760:
            n = parseTemplate(t, n, false);
            break;

          case 16384:
          case 32768:
            n = new PrimitiveLiteralExpression(Oe);
            Re = false;
            nextToken();
            break;

          case 8194:
          case 8195:
          case 8193:
          case 8192:
            n = Ie[ke & 63];
            Re = false;
            nextToken();
            break;

          default:
            if (Ee >= ye) {
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
        if (ke === 10 || ke === 11) {
            throw expectedIdentifier();
        }
        if (n.$kind === 0) {
            switch (ke) {
              case 2162700:
                Te = true;
                Re = false;
                nextToken();
                if ((ke & 13312) === 0) {
                    throw unexpectedTokenInOptionalChain();
                }
                if (ke & 12288) {
                    n = new AccessScopeExpression(Oe, n.ancestor);
                    nextToken();
                } else if (ke === 2688007) {
                    n = new CallFunctionExpression(n, parseArguments(), true);
                } else if (ke === 2688016) {
                    n = parseKeyedExpression(n, true);
                } else {
                    throw invalidTaggedTemplateOnOptionalChain();
                }
                break;

              case 65545:
                Re = !Te;
                nextToken();
                if ((ke & 12288) === 0) {
                    throw expectedIdentifier();
                }
                n = new AccessScopeExpression(Oe, n.ancestor);
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
        while ((ke & 65536) > 0) {
            switch (ke) {
              case 2162700:
                n = parseOptionalChainLHS(n);
                break;

              case 65545:
                nextToken();
                if ((ke & 12288) === 0) {
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
                if (Te) {
                    throw invalidTaggedTemplateOnOptionalChain();
                }
                n = createTemplateTail(n);
                break;

              case 2163760:
                if (Te) {
                    throw invalidTaggedTemplateOnOptionalChain();
                }
                n = parseTemplate(t, n, true);
                break;
            }
        }
    }
    if (ke === 10 || ke === 11) {
        throw expectedIdentifier();
    }
    if (513 < e) {
        return n;
    }
    while ((ke & 262144) > 0) {
        const r = ke;
        if ((r & 960) <= e) {
            break;
        }
        nextToken();
        n = new BinaryExpression(Ie[r & 63], n, parse(r & 960, t));
        Re = false;
    }
    if (63 < e) {
        return n;
    }
    if (consumeOpt(6291478)) {
        const e = parse(62, t);
        consume(6291476);
        n = new ConditionalExpression(n, e, parse(62, t));
        Re = false;
    }
    if (62 < e) {
        return n;
    }
    if (consumeOpt(4194349)) {
        if (!Re) {
            throw lhsNotAssignable();
        }
        n = new AssignExpression(n, parse(62, t));
    }
    if (61 < e) {
        return n;
    }
    while (consumeOpt(6291480)) {
        if (ke === 6291456) {
            throw expectedValueConverterIdentifier();
        }
        const e = Oe;
        nextToken();
        const r = new Array;
        while (consumeOpt(6291476)) {
            r.push(parse(62, t));
        }
        n = new ValueConverterExpression(n, e, r);
    }
    while (consumeOpt(6291479)) {
        if (ke === 6291456) {
            throw expectedBindingBehaviorIdentifier();
        }
        const e = Oe;
        nextToken();
        const r = new Array;
        while (consumeOpt(6291476)) {
            r.push(parse(62, t));
        }
        n = new BindingBehaviorExpression(n, e, r);
    }
    if (ke !== 6291456) {
        if ((t & 1) > 0 && ke === 7340045) {
            return n;
        }
        if ((t & 4) > 0 && ke === 6291477) {
            if (Ee === ye) {
                throw unconsumedToken();
            }
            Pe = Ee - 1;
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
        switch (ke) {
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
            e.push(new DestructuringAssignmentSingleExpression(new AccessMemberExpression(ve, r), new AccessKeyedExpression(ve, new PrimitiveLiteralExpression(i++)), void 0));
            r = "";
        } else {
            i++;
        }
    }
}

function parseArguments() {
    const e = Te;
    nextToken();
    const t = [];
    while (ke !== 7340046) {
        t.push(parse(62, 0));
        if (!consumeOpt(6291471)) {
            break;
        }
    }
    consume(7340046);
    Re = false;
    Te = e;
    return t;
}

function parseKeyedExpression(e, t) {
    const r = Te;
    nextToken();
    e = new AccessKeyedExpression(e, parse(62, 0), t);
    consume(7340051);
    Re = !r;
    Te = r;
    return e;
}

function parseOptionalChainLHS(e) {
    Te = true;
    Re = false;
    nextToken();
    if ((ke & 13312) === 0) {
        throw unexpectedTokenInOptionalChain();
    }
    if (ke & 12288) {
        return parseMemberExpressionLHS(e, true);
    }
    if (ke === 2688007) {
        if (e.$kind === 1) {
            return new CallScopeExpression(e.name, parseArguments(), e.ancestor, true);
        } else if (e.$kind === 10) {
            return new CallMemberExpression(e.object, e.name, parseArguments(), e.optional, true);
        } else {
            return new CallFunctionExpression(e, parseArguments(), true);
        }
    }
    if (ke === 2688016) {
        return parseKeyedExpression(e, true);
    }
    throw invalidTaggedTemplateOnOptionalChain();
}

function parseMemberExpressionLHS(e, t) {
    const r = Oe;
    switch (ke) {
      case 2162700:
        {
            Te = true;
            Re = false;
            const n = Ee;
            const i = me;
            const o = ke;
            const a = Se;
            const c = Oe;
            const u = Re;
            const l = Te;
            nextToken();
            if ((ke & 13312) === 0) {
                throw unexpectedTokenInOptionalChain();
            }
            if (ke === 2688007) {
                return new CallMemberExpression(e, r, parseArguments(), t, true);
            }
            Ee = n;
            me = i;
            ke = o;
            Se = a;
            Oe = c;
            Re = u;
            Te = l;
            return new AccessMemberExpression(e, r, t);
        }

      case 2688007:
        {
            Re = false;
            return new CallMemberExpression(e, r, parseArguments(), t, false);
        }

      default:
        {
            Re = !Te;
            nextToken();
            return new AccessMemberExpression(e, r, t);
        }
    }
}

function parseCoverParenthesizedExpressionAndArrowParameterList(e) {
    nextToken();
    const t = Ee;
    const r = me;
    const n = ke;
    const i = Se;
    const o = Oe;
    const a = Re;
    const c = Te;
    const u = [];
    let l = 1;
    let h = false;
    e: while (true) {
        if (ke === 11) {
            nextToken();
            if (ke !== 4096) {
                throw expectedIdentifier();
            }
            u.push(new BindingIdentifier(Oe));
            nextToken();
            if (ke === 6291471) {
                throw restParamsMustBeLastParam();
            }
            if (ke !== 7340046) {
                throw invalidSpreadOp();
            }
            nextToken();
            if (ke !== 50) {
                throw invalidSpreadOp();
            }
            nextToken();
            const e = Te;
            const t = Ce;
            ++Ce;
            const r = parse(62, 0);
            Te = e;
            Ce = t;
            Re = false;
            return new ArrowFunction(u, r, true);
        }
        switch (ke) {
          case 4096:
            u.push(new BindingIdentifier(Oe));
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
        switch (ke) {
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
    if (ke === 50) {
        if (l === 1) {
            nextToken();
            if (ke === 524296) {
                throw functionBodyInArrowFN();
            }
            const e = Te;
            const t = Ce;
            ++Ce;
            const r = parse(62, 0);
            Te = e;
            Ce = t;
            Re = false;
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
    Ee = t;
    me = r;
    ke = n;
    Se = i;
    Oe = o;
    Re = a;
    Te = c;
    const f = Te;
    const p = parse(62, e);
    Te = f;
    consume(7340046);
    if (ke === 50) {
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
    const t = Te;
    nextToken();
    const r = new Array;
    while (ke !== 7340051) {
        if (consumeOpt(6291471)) {
            r.push(be);
            if (ke === 7340051) {
                break;
            }
        } else {
            r.push(parse(62, e & ~2));
            if (consumeOpt(6291471)) {
                if (ke === 7340051) {
                    break;
                }
            } else {
                break;
            }
        }
    }
    Te = t;
    consume(7340051);
    if (e & 2) {
        return new ArrayBindingPattern(r);
    } else {
        Re = false;
        return new ArrayLiteralExpression(r);
    }
}

function parseForOfStatement(e) {
    if ((e.$kind & (19 | 20 | 21)) === 0) {
        throw invalidLHSBindingIdentifierInForOf();
    }
    if (ke !== 4204593) {
        throw invalidLHSBindingIdentifierInForOf();
    }
    nextToken();
    const t = e;
    const r = parse(61, 4);
    return new ForOfStatement(t, r, Pe);
}

function parseObjectLiteralExpression(e) {
    const t = Te;
    const r = new Array;
    const n = new Array;
    nextToken();
    while (ke !== 7340045) {
        r.push(Oe);
        if (ke & 49152) {
            nextToken();
            consume(6291476);
            n.push(parse(62, e & ~2));
        } else if (ke & 12288) {
            const t = Se;
            const r = ke;
            const i = Ee;
            nextToken();
            if (consumeOpt(6291476)) {
                n.push(parse(62, e & ~2));
            } else {
                Se = t;
                ke = r;
                Ee = i;
                n.push(parse(515, e & ~2));
            }
        } else {
            throw invalidPropDefInObjLiteral();
        }
        if (ke !== 7340045) {
            consume(6291471);
        }
    }
    Te = t;
    consume(7340045);
    if (e & 2) {
        return new ObjectBindingPattern(r, n);
    } else {
        Re = false;
        return new ObjectLiteralExpression(r, n);
    }
}

function parseInterpolation() {
    const e = [];
    const t = [];
    const r = ye;
    let n = "";
    while (Ee < r) {
        switch (Se) {
          case 36:
            if ($charCodeAt(Ee + 1) === 123) {
                e.push(n);
                n = "";
                Ee += 2;
                Se = $charCodeAt(Ee);
                nextToken();
                const r = parse(61, 1);
                t.push(r);
                continue;
            } else {
                n += "$";
            }
            break;

          case 92:
            n += $e(unescapeCode(nextChar()));
            break;

          default:
            n += $e(Se);
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
    const n = Te;
    const i = [ Oe ];
    consume(2163760);
    const o = [ parse(62, e) ];
    while ((ke = scanTemplateTail()) !== 2163759) {
        i.push(Oe);
        consume(2163760);
        o.push(parse(62, e));
    }
    i.push(Oe);
    Re = false;
    Te = n;
    if (r) {
        nextToken();
        return new TaggedTemplateExpression(i, i, t, o);
    } else {
        nextToken();
        return new TemplateExpression(i, o);
    }
}

function createTemplateTail(e) {
    Re = false;
    const t = [ Oe ];
    nextToken();
    return new TaggedTemplateExpression(t, t, e);
}

function nextToken() {
    while (Ee < ye) {
        me = Ee;
        if ((ke = Be[Se]()) != null) {
            return;
        }
    }
    ke = 6291456;
}

function nextChar() {
    return Se = $charCodeAt(++Ee);
}

function scanIdentifier() {
    while (_e[nextChar()]) ;
    const e = Ue[Oe = $tokenRaw()];
    return e === undefined ? 4096 : e;
}

function scanNumber(e) {
    let t = Se;
    if (e === false) {
        do {
            t = nextChar();
        } while (t <= 57 && t >= 48);
        if (t !== 46) {
            Oe = parseInt($tokenRaw(), 10);
            return 32768;
        }
        t = nextChar();
        if (Ee >= ye) {
            Oe = parseInt($tokenRaw().slice(0, -1), 10);
            return 32768;
        }
    }
    if (t <= 57 && t >= 48) {
        do {
            t = nextChar();
        } while (t <= 57 && t >= 48);
    } else {
        Se = $charCodeAt(--Ee);
    }
    Oe = parseFloat($tokenRaw());
    return 32768;
}

function scanString() {
    const e = Se;
    nextChar();
    let t = 0;
    const r = new Array;
    let n = Ee;
    while (Se !== e) {
        if (Se === 92) {
            r.push(Ae.slice(n, Ee));
            nextChar();
            t = unescapeCode(Se);
            nextChar();
            r.push($e(t));
            n = Ee;
        } else if (Ee >= ye) {
            throw unterminatedStringLiteral();
        } else {
            nextChar();
        }
    }
    const i = Ae.slice(n, Ee);
    nextChar();
    r.push(i);
    const o = r.join("");
    Oe = o;
    return 16384;
}

function scanTemplate() {
    let e = true;
    let t = "";
    while (nextChar() !== 96) {
        if (Se === 36) {
            if (Ee + 1 < ye && $charCodeAt(Ee + 1) === 123) {
                Ee++;
                e = false;
                break;
            } else {
                t += "$";
            }
        } else if (Se === 92) {
            t += $e(unescapeCode(nextChar()));
        } else {
            if (Ee >= ye) {
                throw unterminatedTemplateLiteral();
            }
            t += $e(Se);
        }
    }
    nextChar();
    Oe = t;
    if (e) {
        return 2163759;
    }
    return 2163760;
}

const scanTemplateTail = () => {
    if (Ee >= ye) {
        throw unterminatedTemplateLiteral();
    }
    Ee--;
    return scanTemplate();
};

const consumeOpt = e => {
    if (ke === e) {
        nextToken();
        return true;
    }
    return false;
};

const consume = e => {
    if (ke === e) {
        nextToken();
    } else {
        throw missingExpectedToken(e);
    }
};

const invalidStartOfExpression = () => {
    {
        return createError(`AUR0151:${Ae}`);
    }
};

const invalidSpreadOp = () => {
    {
        return createError(`AUR0152:${Ae}`);
    }
};

const expectedIdentifier = () => {
    {
        return createError(`AUR0153:${Ae}`);
    }
};

const invalidMemberExpression = () => {
    {
        return createError(`AUR0154:${Ae}`);
    }
};

const unexpectedEndOfExpression = () => {
    {
        return createError(`AUR0155:${Ae}`);
    }
};

const unconsumedToken = () => {
    {
        return createError(`AUR0156:${Ae}`);
    }
};

const invalidEmptyExpression = () => {
    {
        return createError(`AUR0157`);
    }
};

const lhsNotAssignable = () => {
    {
        return createError(`AUR0158:${Ae}`);
    }
};

const expectedValueConverterIdentifier = () => {
    {
        return createError(`AUR0159:${Ae}`);
    }
};

const expectedBindingBehaviorIdentifier = () => {
    {
        return createError(`AUR0160:${Ae}`);
    }
};

const unexpectedOfKeyword = () => {
    {
        return createError(`AUR0161:${Ae}`);
    }
};

const invalidLHSBindingIdentifierInForOf = () => {
    {
        return createError(`AUR0163:${Ae}`);
    }
};

const invalidPropDefInObjLiteral = () => {
    {
        return createError(`AUR0164:${Ae}`);
    }
};

const unterminatedStringLiteral = () => {
    {
        return createError(`AUR0165:${Ae}`);
    }
};

const unterminatedTemplateLiteral = () => {
    {
        return createError(`AUR0166:${Ae}`);
    }
};

const missingExpectedToken = e => {
    {
        return createError(`AUR0167:${Ae}<${Ie[e & 63]}`);
    }
};

const unexpectedCharacter = () => {
    {
        throw createError(`AUR0168:${Ae}`);
    }
};

unexpectedCharacter.notMapped = true;

const unexpectedTokenInDestructuring = () => {
    {
        return createError(`AUR0170:${Ae}`);
    }
};

const unexpectedTokenInOptionalChain = () => {
    {
        return createError(`AUR0171:${Ae}`);
    }
};

const invalidTaggedTemplateOnOptionalChain = () => {
    {
        return createError(`AUR0172:${Ae}`);
    }
};

const invalidArrowParameterList = () => {
    {
        return createError(`AUR0173:${Ae}`);
    }
};

const defaultParamsInArrowFn = () => {
    {
        return createError(`AUR0174:${Ae}`);
    }
};

const destructuringParamsInArrowFn = () => {
    {
        return createError(`AUR0175:${Ae}`);
    }
};

const restParamsMustBeLastParam = () => {
    {
        return createError(`AUR0176:${Ae}`);
    }
};

const functionBodyInArrowFN = () => {
    {
        return createError(`AUR0178:${Ae}`);
    }
};

const unexpectedDoubleDot = () => {
    {
        return createError(`AUR0179:${Ae}`);
    }
};

const Ie = [ pe, de, we, be, "$this", null, "$parent", "(", "{", ".", "..", "...", "?.", "}", ")", ",", "[", "]", ":", ";", "?", "'", '"', "&", "|", "??", "||", "&&", "==", "!=", "===", "!==", "<", ">", "<=", ">=", "in", "instanceof", "+", "-", "typeof", "void", "*", "%", "/", "=", "!", 2163759, 2163760, "of", "=>" ];

const Ue = f(Object.create(null), {
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

const Le = {
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

const Me = new Set;

decompress(null, Me, Le.AsciiIdPart, true);

const _e = new Uint8Array(65535);

decompress(_e, null, Le.IdStart, 1);

decompress(_e, null, Le.Digit, 1);

const Be = new Array(65535);

Be.fill(unexpectedCharacter, 0, 65535);

decompress(Be, null, Le.Skip, (() => {
    nextChar();
    return null;
}));

decompress(Be, null, Le.IdStart, scanIdentifier);

decompress(Be, null, Le.Digit, (() => scanNumber(false)));

Be[34] = Be[39] = () => scanString();

Be[96] = () => scanTemplate();

Be[33] = () => {
    if (nextChar() !== 61) {
        return 131118;
    }
    if (nextChar() !== 61) {
        return 6553949;
    }
    nextChar();
    return 6553951;
};

Be[61] = () => {
    if (nextChar() === 62) {
        nextChar();
        return 50;
    }
    if (Se !== 61) {
        return 4194349;
    }
    if (nextChar() !== 61) {
        return 6553948;
    }
    nextChar();
    return 6553950;
};

Be[38] = () => {
    if (nextChar() !== 38) {
        return 6291479;
    }
    nextChar();
    return 6553883;
};

Be[124] = () => {
    if (nextChar() !== 124) {
        return 6291480;
    }
    nextChar();
    return 6553818;
};

Be[63] = () => {
    if (nextChar() === 46) {
        const e = $charCodeAt(Ee + 1);
        if (e <= 48 || e >= 57) {
            nextChar();
            return 2162700;
        }
        return 6291478;
    }
    if (Se !== 63) {
        return 6291478;
    }
    nextChar();
    return 6553753;
};

Be[46] = () => {
    if (nextChar() <= 57 && Se >= 48) {
        return scanNumber(true);
    }
    if (Se === 46) {
        if (nextChar() !== 46) {
            return 10;
        }
        nextChar();
        return 11;
    }
    return 65545;
};

Be[60] = () => {
    if (nextChar() !== 61) {
        return 6554016;
    }
    nextChar();
    return 6554018;
};

Be[62] = () => {
    if (nextChar() !== 61) {
        return 6554017;
    }
    nextChar();
    return 6554019;
};

Be[37] = returnToken(6554155);

Be[40] = returnToken(2688007);

Be[41] = returnToken(7340046);

Be[42] = returnToken(6554154);

Be[43] = returnToken(2490854);

Be[44] = returnToken(6291471);

Be[45] = returnToken(2490855);

Be[47] = returnToken(6554156);

Be[58] = returnToken(6291476);

Be[59] = returnToken(6291477);

Be[91] = returnToken(2688016);

Be[93] = returnToken(7340051);

Be[123] = returnToken(524296);

Be[125] = returnToken(7340045);

let De = null;

const je = [];

let Fe = false;

function pauseConnecting() {
    Fe = false;
}

function resumeConnecting() {
    Fe = true;
}

function currentConnectable() {
    return De;
}

function enterConnectable(e) {
    if (e == null) {
        throw createError(`AUR0206`);
    }
    if (De == null) {
        De = e;
        je[0] = De;
        Fe = true;
        return;
    }
    if (De === e) {
        throw createError(`AUR0207`);
    }
    je.push(e);
    De = e;
    Fe = true;
}

function exitConnectable(e) {
    if (e == null) {
        throw createError(`AUR0208`);
    }
    if (De !== e) {
        throw createError(`AUR0209`);
    }
    je.pop();
    De = je.length > 0 ? je[je.length - 1] : null;
    Fe = De != null;
}

const Ne = Object.freeze({
    get current() {
        return De;
    },
    get connecting() {
        return Fe;
    },
    enter: enterConnectable,
    exit: exitConnectable,
    pause: pauseConnecting,
    resume: resumeConnecting
});

const Ve = Reflect.get;

const He = Object.prototype.toString;

const Ke = new WeakMap;

const ze = "__au_nw__";

const We = "__au_nw";

function canWrap(e) {
    switch (He.call(e)) {
      case "[object Object]":
        return e.constructor[ze] !== true;

      case "[object Array]":
      case "[object Map]":
      case "[object Set]":
        return true;

      default:
        return false;
    }
}

const qe = "__raw__";

function wrap(e) {
    return canWrap(e) ? getProxy(e) : e;
}

function getProxy(e) {
    return Ke.get(e) ?? createProxy(e);
}

function getRaw(e) {
    return e[qe] ?? e;
}

function unwrap(e) {
    return canWrap(e) && e[qe] || e;
}

function doNotCollect(e, t) {
    return t === "constructor" || t === "__proto__" || t === "$observers" || t === Symbol.toPrimitive || t === Symbol.toStringTag || e.constructor[`${We}_${p(t)}__`] === true;
}

function createProxy(e) {
    const t = isArray(e) ? Ge : isMap(e) || isSet(e) ? Qe : Je;
    const r = new Proxy(e, t);
    Ke.set(e, r);
    Ke.set(r, r);
    return r;
}

const Je = {
    get(e, t, r) {
        if (t === qe) {
            return e;
        }
        const n = currentConnectable();
        if (!Fe || doNotCollect(e, t) || n == null) {
            return Ve(e, t, r);
        }
        n.observe(e, t);
        return wrap(Ve(e, t, r));
    }
};

const Ge = {
    get(e, t, r) {
        if (t === qe) {
            return e;
        }
        if (!Fe || doNotCollect(e, t) || De == null) {
            return Ve(e, t, r);
        }
        switch (t) {
          case "length":
            De.observe(e, "length");
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
        De.observe(e, t);
        return wrap(Ve(e, t, r));
    },
    ownKeys(e) {
        currentConnectable()?.observe(e, "length");
        return Reflect.ownKeys(e);
    }
};

function wrappedArrayMap(e, t) {
    const r = getRaw(this);
    const n = r.map(((r, n) => unwrap(e.call(t, wrap(r), n, this))));
    observeCollection(De, r);
    return wrap(n);
}

function wrappedArrayEvery(e, t) {
    const r = getRaw(this);
    const n = r.every(((r, n) => e.call(t, wrap(r), n, this)));
    observeCollection(De, r);
    return n;
}

function wrappedArrayFilter(e, t) {
    const r = getRaw(this);
    const n = r.filter(((r, n) => unwrap(e.call(t, wrap(r), n, this))));
    observeCollection(De, r);
    return wrap(n);
}

function wrappedArrayIncludes(e) {
    const t = getRaw(this);
    const r = t.includes(unwrap(e));
    observeCollection(De, t);
    return r;
}

function wrappedArrayIndexOf(e) {
    const t = getRaw(this);
    const r = t.indexOf(unwrap(e));
    observeCollection(De, t);
    return r;
}

function wrappedArrayLastIndexOf(e) {
    const t = getRaw(this);
    const r = t.lastIndexOf(unwrap(e));
    observeCollection(De, t);
    return r;
}

function wrappedArrayFindIndex(e, t) {
    const r = getRaw(this);
    const n = r.findIndex(((r, n) => unwrap(e.call(t, wrap(r), n, this))));
    observeCollection(De, r);
    return n;
}

function wrappedArrayFind(e, t) {
    const r = getRaw(this);
    const n = r.find(((t, r) => e(wrap(t), r, this)), t);
    observeCollection(De, r);
    return wrap(n);
}

function wrappedArrayFlat() {
    const e = getRaw(this);
    observeCollection(De, e);
    return wrap(e.flat());
}

function wrappedArrayFlatMap(e, t) {
    const r = getRaw(this);
    observeCollection(De, r);
    return getProxy(r.flatMap(((r, n) => wrap(e.call(t, wrap(r), n, this)))));
}

function wrappedArrayJoin(e) {
    const t = getRaw(this);
    observeCollection(De, t);
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
    observeCollection(De, t);
    return wrap(r);
}

function wrappedArraySome(e, t) {
    const r = getRaw(this);
    const n = r.some(((r, n) => unwrap(e.call(t, wrap(r), n, this))));
    observeCollection(De, r);
    return n;
}

function wrappedArraySort(e) {
    const t = getRaw(this);
    const r = t.sort(e);
    observeCollection(De, t);
    return wrap(r);
}

function wrappedArraySlice(e, t) {
    const r = getRaw(this);
    observeCollection(De, r);
    return getProxy(r.slice(e, t));
}

function wrappedReduce(e, t) {
    const r = getRaw(this);
    const n = r.reduce(((t, r, n) => e(t, wrap(r), n, this)), t);
    observeCollection(De, r);
    return wrap(n);
}

function wrappedReduceRight(e, t) {
    const r = getRaw(this);
    const n = r.reduceRight(((t, r, n) => e(t, wrap(r), n, this)), t);
    observeCollection(De, r);
    return wrap(n);
}

const Qe = {
    get(e, t, r) {
        if (t === qe) {
            return e;
        }
        const n = currentConnectable();
        if (!Fe || doNotCollect(e, t) || n == null) {
            return Ve(e, t, r);
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
        return wrap(Ve(e, t, r));
    }
};

function wrappedForEach(e, t) {
    const r = getRaw(this);
    observeCollection(De, r);
    return r.forEach(((r, n) => {
        e.call(t, wrap(r), wrap(n), this);
    }));
}

function wrappedHas(e) {
    const t = getRaw(this);
    observeCollection(De, t);
    return t.has(unwrap(e));
}

function wrappedGet(e) {
    const t = getRaw(this);
    observeCollection(De, t);
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
    observeCollection(De, e);
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
    observeCollection(De, e);
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
    observeCollection(De, e);
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

const Xe = Object.freeze({
    getProxy: getProxy,
    getRaw: getRaw,
    wrap: wrap,
    unwrap: unwrap,
    rawKey: qe
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
            if (!h(e, this.v)) {
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

const Ye = /*@__PURE__*/ d("IDirtyChecker", void 0);

const Ze = {
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
        e.register(i.singleton(Ye, this), i.aliasTo(this, Ye));
    }
    constructor(e) {
        this.p = e;
        this.tracked = [];
        this.R = null;
        this.T = 0;
        this.check = () => {
            if (Ze.disabled) {
                return;
            }
            if (++this.T < Ze.timeoutsPerCheck) {
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
        if (Ze.throw) {
            throw createError(`AUR0222:${p(t)}`);
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

DirtyChecker.inject = [ o ];

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
        throw createError(`Trying to set value for property ${p(this.key)} in dirty checker`);
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
            if (h(e, this.v)) {
                return;
            }
            et = this.v;
            this.v = e;
            this.cb?.(e, et);
            this.subs.notify(e, et);
        } else {
            this.v = this.o[this.k] = e;
            this.cb?.(e, et);
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

let et = void 0;

const tt = new PropertyAccessor;

const st = /*@__PURE__*/ d("IObserverLocator", (e => e.singleton(ObserverLocator)));

const rt = /*@__PURE__*/ d("INodeObserverLocator", (e => e.cachedCallback((e => new DefaultNodeObserverLocator))));

class DefaultNodeObserverLocator {
    handles() {
        return false;
    }
    getObserver() {
        return tt;
    }
    getAccessor() {
        return tt;
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
            throw nullObjectError(p(t));
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
        return tt;
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
        if (this.I.handles(e, t, this)) {
            return this.I.getObserver(e, t, this);
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
        let r = it(e, t);
        if (r === void 0) {
            let n = nt(e);
            while (n !== null) {
                r = it(n, t);
                if (r === void 0) {
                    n = nt(n);
                } else {
                    break;
                }
            }
        }
        if (r !== void 0 && !u.call(r, "value")) {
            let n = this.U(e, t, r);
            if (n == null) {
                n = (r.get?.getObserver ?? r.set?.getObserver)?.(e, this);
            }
            return n == null ? r.configurable ? this.L(e, t, r, true) : this.P.createProperty(e, t) : n;
        }
        return new SetterObserver(e, t);
    }
    L(e, t, r, n) {
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

ObserverLocator.inject = [ Ye, rt ];

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

const nt = Object.getPrototypeOf;

const it = Object.getOwnPropertyDescriptor;

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

const nullObjectError = e => createError(`AUR0199:${p(e)}`);

const ot = /*@__PURE__*/ d("IObservation", (e => e.singleton(Observation)));

class Observation {
    static get inject() {
        return [ st ];
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
        l(e, "$observers", {
            value: {}
        });
    }
    return e.$observers;
}

const at = {};

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
            throw createError(`AUR0224`);
        }
        const o = n.callback || `${p(t)}Changed`;
        let a = at;
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
        a = new SetterNotifier(e, r, i, n === at ? void 0 : n);
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
            defineHiddenProp(e, ze, true);
        } else {
            defineHiddenProp(e.constructor, `${We}_${p(t)}__`, true);
        }
    }
}

const ct = d("ISignaler", (e => e.singleton(Signaler)));

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

export { AccessKeyedExpression, AccessMemberExpression, AccessScopeExpression, AccessThisExpression, C as AccessorType, ArrayBindingPattern, ArrayIndexObserver, ArrayLiteralExpression, ArrayObserver, ArrowFunction, AssignExpression, BinaryExpression, BindingBehaviorExpression, BindingContext, BindingIdentifier, BindingObserverRecord, CallFunctionExpression, CallMemberExpression, CallScopeExpression, y as CollectionKind, CollectionLengthObserver, CollectionSizeObserver, ComputedObserver, ConditionalExpression, Ne as ConnectableSwitcher, CustomExpression, DestructuringAssignmentExpression, DestructuringAssignmentRestExpression, DestructuringAssignmentSingleExpression, DirtyCheckProperty, Ze as DirtyCheckSettings, DirtyChecker, v as ExpressionKind, xe as ExpressionType, ForOfStatement, E as ICoercionConfiguration, Ye as IDirtyChecker, fe as IExpressionParser, rt as INodeObserverLocator, ot as IObservation, st as IObserverLocator, ct as ISignaler, Interpolation, MapObserver, ObjectBindingPattern, ObjectLiteralExpression, Observation, ObserverLocator, PrimitiveLiteralExpression, PrimitiveObserver, PropertyAccessor, Xe as ProxyObservable, Scope, SetObserver, SetterObserver, SubscriberRecord, TaggedTemplateExpression, TemplateExpression, UnaryExpression, Unparser, ValueConverterExpression, applyMutationsToIndices, astAssign, astBind, astEvaluate, astUnbind, astVisit, batch, cloneIndexMap, connectable, copyIndexMap, createIndexMap, disableArrayObservation, disableMapObservation, disableSetObservation, enableArrayObservation, enableMapObservation, enableSetObservation, getCollectionObserver, getObserverLookup, isIndexMap, nowrap, observable, parseExpression, subscriberCollection, synchronizeIndices };
//# sourceMappingURL=index.mjs.map
