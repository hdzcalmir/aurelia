'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var kernel = require('@aurelia/kernel');
var metadata = require('@aurelia/metadata');

const O = Object;
const hasOwnProp = O.prototype.hasOwnProperty;
const def = Reflect.defineProperty;
const createError = (message) => new Error(message);
const isFunction = (v) => typeof v === 'function';
const isString = (v) => typeof v === 'string';
const isObject = (v) => v instanceof O;
const isArray = (v) => v instanceof Array;
const isSet = (v) => v instanceof Set;
const isMap = (v) => v instanceof Map;
const areEqual = O.is;
function defineHiddenProp(obj, key, value) {
    def(obj, key, {
        enumerable: false,
        configurable: true,
        writable: true,
        value
    });
    return value;
}
function ensureProto(proto, key, defaultValue) {
    if (!(key in proto)) {
        defineHiddenProp(proto, key, defaultValue);
    }
}
const safeString = String;
const createInterface = kernel.DI.createInterface;
const createLookup = () => O.create(null);
const getOwnMetadata = metadata.Metadata.getOwn;
metadata.Metadata.hasOwn;
const defineMetadata = metadata.Metadata.define;
kernel.Protocol.annotation.keyFor;
kernel.Protocol.resource.keyFor;
kernel.Protocol.resource.appendTo;

const astVisit = (ast, visitor) => {
    switch (ast.$kind) {
        case 11: return visitor.visitAccessKeyed(ast);
        case 10: return visitor.visitAccessMember(ast);
        case 1: return visitor.visitAccessScope(ast);
        case 0: return visitor.visitAccessThis(ast);
        case 19: return visitor.visitArrayBindingPattern(ast);
        case 24: return visitor.visitDestructuringAssignmentExpression(ast);
        case 2: return visitor.visitArrayLiteral(ast);
        case 16: return visitor.visitArrowFunction(ast);
        case 15: return visitor.visitAssign(ast);
        case 13: return visitor.visitBinary(ast);
        case 18: return visitor.visitBindingBehavior(ast);
        case 21: return visitor.visitBindingIdentifier(ast);
        case 9: return visitor.visitCallFunction(ast);
        case 8: return visitor.visitCallMember(ast);
        case 7: return visitor.visitCallScope(ast);
        case 14: return visitor.visitConditional(ast);
        case 26: return visitor.visitDestructuringAssignmentSingleExpression(ast);
        case 22: return visitor.visitForOfStatement(ast);
        case 23: return visitor.visitInterpolation(ast);
        case 20: return visitor.visitObjectBindingPattern(ast);
        case 25: return visitor.visitDestructuringAssignmentExpression(ast);
        case 3: return visitor.visitObjectLiteral(ast);
        case 4: return visitor.visitPrimitiveLiteral(ast);
        case 12: return visitor.visitTaggedTemplate(ast);
        case 5: return visitor.visitTemplate(ast);
        case 6: return visitor.visitUnary(ast);
        case 17: return visitor.visitValueConverter(ast);
        case 28: return visitor.visitCustom(ast);
        default: {
            throw createError(`Unknown ast node ${JSON.stringify(ast)}`);
        }
    }
};
class Unparser {
    constructor() {
        this.text = '';
    }
    static unparse(expr) {
        const visitor = new Unparser();
        astVisit(expr, visitor);
        return visitor.text;
    }
    visitAccessMember(expr) {
        astVisit(expr.object, this);
        this.text += `${expr.optional ? '?' : ''}.${expr.name}`;
    }
    visitAccessKeyed(expr) {
        astVisit(expr.object, this);
        this.text += `${expr.optional ? '?.' : ''}[`;
        astVisit(expr.key, this);
        this.text += ']';
    }
    visitAccessThis(expr) {
        if (expr.ancestor === 0) {
            this.text += '$this';
            return;
        }
        this.text += '$parent';
        let i = expr.ancestor - 1;
        while (i--) {
            this.text += '.$parent';
        }
    }
    visitAccessScope(expr) {
        let i = expr.ancestor;
        while (i--) {
            this.text += '$parent.';
        }
        this.text += expr.name;
    }
    visitArrayLiteral(expr) {
        const elements = expr.elements;
        this.text += '[';
        for (let i = 0, length = elements.length; i < length; ++i) {
            if (i !== 0) {
                this.text += ',';
            }
            astVisit(elements[i], this);
        }
        this.text += ']';
    }
    visitArrowFunction(expr) {
        const args = expr.args;
        const ii = args.length;
        let i = 0;
        let text = '(';
        let name;
        for (; i < ii; ++i) {
            name = args[i].name;
            if (i > 0) {
                text += ', ';
            }
            if (i < ii - 1) {
                text += name;
            }
            else {
                text += expr.rest ? `...${name}` : name;
            }
        }
        this.text += `${text}) => `;
        astVisit(expr.body, this);
    }
    visitObjectLiteral(expr) {
        const keys = expr.keys;
        const values = expr.values;
        this.text += '{';
        for (let i = 0, length = keys.length; i < length; ++i) {
            if (i !== 0) {
                this.text += ',';
            }
            this.text += `'${keys[i]}':`;
            astVisit(values[i], this);
        }
        this.text += '}';
    }
    visitPrimitiveLiteral(expr) {
        this.text += '(';
        if (isString(expr.value)) {
            const escaped = expr.value.replace(/'/g, '\\\'');
            this.text += `'${escaped}'`;
        }
        else {
            this.text += `${expr.value}`;
        }
        this.text += ')';
    }
    visitCallFunction(expr) {
        this.text += '(';
        astVisit(expr.func, this);
        this.text += expr.optional ? '?.' : '';
        this.writeArgs(expr.args);
        this.text += ')';
    }
    visitCallMember(expr) {
        this.text += '(';
        astVisit(expr.object, this);
        this.text += `${expr.optionalMember ? '?.' : ''}.${expr.name}${expr.optionalCall ? '?.' : ''}`;
        this.writeArgs(expr.args);
        this.text += ')';
    }
    visitCallScope(expr) {
        this.text += '(';
        let i = expr.ancestor;
        while (i--) {
            this.text += '$parent.';
        }
        this.text += `${expr.name}${expr.optional ? '?.' : ''}`;
        this.writeArgs(expr.args);
        this.text += ')';
    }
    visitTemplate(expr) {
        const { cooked, expressions } = expr;
        const length = expressions.length;
        this.text += '`';
        this.text += cooked[0];
        for (let i = 0; i < length; i++) {
            astVisit(expressions[i], this);
            this.text += cooked[i + 1];
        }
        this.text += '`';
    }
    visitTaggedTemplate(expr) {
        const { cooked, expressions } = expr;
        const length = expressions.length;
        astVisit(expr.func, this);
        this.text += '`';
        this.text += cooked[0];
        for (let i = 0; i < length; i++) {
            astVisit(expressions[i], this);
            this.text += cooked[i + 1];
        }
        this.text += '`';
    }
    visitUnary(expr) {
        this.text += `(${expr.operation}`;
        if (expr.operation.charCodeAt(0) >= 97) {
            this.text += ' ';
        }
        astVisit(expr.expression, this);
        this.text += ')';
    }
    visitBinary(expr) {
        this.text += '(';
        astVisit(expr.left, this);
        if (expr.operation.charCodeAt(0) === 105) {
            this.text += ` ${expr.operation} `;
        }
        else {
            this.text += expr.operation;
        }
        astVisit(expr.right, this);
        this.text += ')';
    }
    visitConditional(expr) {
        this.text += '(';
        astVisit(expr.condition, this);
        this.text += '?';
        astVisit(expr.yes, this);
        this.text += ':';
        astVisit(expr.no, this);
        this.text += ')';
    }
    visitAssign(expr) {
        this.text += '(';
        astVisit(expr.target, this);
        this.text += '=';
        astVisit(expr.value, this);
        this.text += ')';
    }
    visitValueConverter(expr) {
        const args = expr.args;
        astVisit(expr.expression, this);
        this.text += `|${expr.name}`;
        for (let i = 0, length = args.length; i < length; ++i) {
            this.text += ':';
            astVisit(args[i], this);
        }
    }
    visitBindingBehavior(expr) {
        const args = expr.args;
        astVisit(expr.expression, this);
        this.text += `&${expr.name}`;
        for (let i = 0, length = args.length; i < length; ++i) {
            this.text += ':';
            astVisit(args[i], this);
        }
    }
    visitArrayBindingPattern(expr) {
        const elements = expr.elements;
        this.text += '[';
        for (let i = 0, length = elements.length; i < length; ++i) {
            if (i !== 0) {
                this.text += ',';
            }
            astVisit(elements[i], this);
        }
        this.text += ']';
    }
    visitObjectBindingPattern(expr) {
        const keys = expr.keys;
        const values = expr.values;
        this.text += '{';
        for (let i = 0, length = keys.length; i < length; ++i) {
            if (i !== 0) {
                this.text += ',';
            }
            this.text += `'${keys[i]}':`;
            astVisit(values[i], this);
        }
        this.text += '}';
    }
    visitBindingIdentifier(expr) {
        this.text += expr.name;
    }
    visitForOfStatement(expr) {
        astVisit(expr.declaration, this);
        this.text += ' of ';
        astVisit(expr.iterable, this);
    }
    visitInterpolation(expr) {
        const { parts, expressions } = expr;
        const length = expressions.length;
        this.text += '${';
        this.text += parts[0];
        for (let i = 0; i < length; i++) {
            astVisit(expressions[i], this);
            this.text += parts[i + 1];
        }
        this.text += '}';
    }
    visitDestructuringAssignmentExpression(expr) {
        const $kind = expr.$kind;
        const isObjDes = $kind === 25;
        this.text += isObjDes ? '{' : '[';
        const list = expr.list;
        const len = list.length;
        let i;
        let item;
        for (i = 0; i < len; i++) {
            item = list[i];
            switch (item.$kind) {
                case 26:
                    astVisit(item, this);
                    break;
                case 24:
                case 25: {
                    const source = item.source;
                    if (source) {
                        astVisit(source, this);
                        this.text += ':';
                    }
                    astVisit(item, this);
                    break;
                }
            }
        }
        this.text += isObjDes ? '}' : ']';
    }
    visitDestructuringAssignmentSingleExpression(expr) {
        astVisit(expr.source, this);
        this.text += ':';
        astVisit(expr.target, this);
        const initializer = expr.initializer;
        if (initializer !== void 0) {
            this.text += '=';
            astVisit(initializer, this);
        }
    }
    visitDestructuringAssignmentRestExpression(expr) {
        this.text += '...';
        astVisit(expr.target, this);
    }
    visitCustom(expr) {
        this.text += safeString(expr.value);
    }
    writeArgs(args) {
        this.text += '(';
        for (let i = 0, length = args.length; i < length; ++i) {
            if (i !== 0) {
                this.text += ',';
            }
            astVisit(args[i], this);
        }
        this.text += ')';
    }
}

exports.ExpressionKind = void 0;
(function (ExpressionKind) {
    ExpressionKind[ExpressionKind["AccessThis"] = 0] = "AccessThis";
    ExpressionKind[ExpressionKind["AccessScope"] = 1] = "AccessScope";
    ExpressionKind[ExpressionKind["ArrayLiteral"] = 2] = "ArrayLiteral";
    ExpressionKind[ExpressionKind["ObjectLiteral"] = 3] = "ObjectLiteral";
    ExpressionKind[ExpressionKind["PrimitiveLiteral"] = 4] = "PrimitiveLiteral";
    ExpressionKind[ExpressionKind["Template"] = 5] = "Template";
    ExpressionKind[ExpressionKind["Unary"] = 6] = "Unary";
    ExpressionKind[ExpressionKind["CallScope"] = 7] = "CallScope";
    ExpressionKind[ExpressionKind["CallMember"] = 8] = "CallMember";
    ExpressionKind[ExpressionKind["CallFunction"] = 9] = "CallFunction";
    ExpressionKind[ExpressionKind["AccessMember"] = 10] = "AccessMember";
    ExpressionKind[ExpressionKind["AccessKeyed"] = 11] = "AccessKeyed";
    ExpressionKind[ExpressionKind["TaggedTemplate"] = 12] = "TaggedTemplate";
    ExpressionKind[ExpressionKind["Binary"] = 13] = "Binary";
    ExpressionKind[ExpressionKind["Conditional"] = 14] = "Conditional";
    ExpressionKind[ExpressionKind["Assign"] = 15] = "Assign";
    ExpressionKind[ExpressionKind["ArrowFunction"] = 16] = "ArrowFunction";
    ExpressionKind[ExpressionKind["ValueConverter"] = 17] = "ValueConverter";
    ExpressionKind[ExpressionKind["BindingBehavior"] = 18] = "BindingBehavior";
    ExpressionKind[ExpressionKind["ArrayBindingPattern"] = 19] = "ArrayBindingPattern";
    ExpressionKind[ExpressionKind["ObjectBindingPattern"] = 20] = "ObjectBindingPattern";
    ExpressionKind[ExpressionKind["BindingIdentifier"] = 21] = "BindingIdentifier";
    ExpressionKind[ExpressionKind["ForOfStatement"] = 22] = "ForOfStatement";
    ExpressionKind[ExpressionKind["Interpolation"] = 23] = "Interpolation";
    ExpressionKind[ExpressionKind["ArrayDestructuring"] = 24] = "ArrayDestructuring";
    ExpressionKind[ExpressionKind["ObjectDestructuring"] = 25] = "ObjectDestructuring";
    ExpressionKind[ExpressionKind["DestructuringAssignmentLeaf"] = 26] = "DestructuringAssignmentLeaf";
    ExpressionKind[ExpressionKind["DestructuringAssignmentRestLeaf"] = 27] = "DestructuringAssignmentRestLeaf";
    ExpressionKind[ExpressionKind["Custom"] = 28] = "Custom";
})(exports.ExpressionKind || (exports.ExpressionKind = {}));
class CustomExpression {
    constructor(value) {
        this.value = value;
        this.$kind = 28;
    }
    evaluate(_s, _e, _c) {
        return this.value;
    }
    assign(s, e, val) {
        return val;
    }
    bind(s, b) {
    }
    unbind(s, b) {
    }
    accept(_visitor) {
        return (void 0);
    }
}
class BindingBehaviorExpression {
    constructor(expression, name, args) {
        this.expression = expression;
        this.name = name;
        this.args = args;
        this.$kind = 18;
        this.key = `_bb_${name}`;
    }
}
class ValueConverterExpression {
    constructor(expression, name, args) {
        this.expression = expression;
        this.name = name;
        this.args = args;
        this.$kind = 17;
    }
}
class AssignExpression {
    constructor(target, value) {
        this.target = target;
        this.value = value;
        this.$kind = 15;
    }
}
class ConditionalExpression {
    constructor(condition, yes, no) {
        this.condition = condition;
        this.yes = yes;
        this.no = no;
        this.$kind = 14;
    }
}
class AccessThisExpression {
    constructor(ancestor = 0) {
        this.ancestor = ancestor;
        this.$kind = 0;
    }
}
AccessThisExpression.$this = new AccessThisExpression(0);
AccessThisExpression.$parent = new AccessThisExpression(1);
class AccessScopeExpression {
    constructor(name, ancestor = 0) {
        this.name = name;
        this.ancestor = ancestor;
        this.$kind = 1;
    }
}
class AccessMemberExpression {
    constructor(object, name, optional = false) {
        this.object = object;
        this.name = name;
        this.optional = optional;
        this.$kind = 10;
    }
}
class AccessKeyedExpression {
    constructor(object, key, optional = false) {
        this.object = object;
        this.key = key;
        this.optional = optional;
        this.$kind = 11;
    }
}
class CallScopeExpression {
    constructor(name, args, ancestor = 0, optional = false) {
        this.name = name;
        this.args = args;
        this.ancestor = ancestor;
        this.optional = optional;
        this.$kind = 7;
    }
}
class CallMemberExpression {
    constructor(object, name, args, optionalMember = false, optionalCall = false) {
        this.object = object;
        this.name = name;
        this.args = args;
        this.optionalMember = optionalMember;
        this.optionalCall = optionalCall;
        this.$kind = 8;
    }
}
class CallFunctionExpression {
    constructor(func, args, optional = false) {
        this.func = func;
        this.args = args;
        this.optional = optional;
        this.$kind = 9;
    }
}
class BinaryExpression {
    constructor(operation, left, right) {
        this.operation = operation;
        this.left = left;
        this.right = right;
        this.$kind = 13;
    }
}
class UnaryExpression {
    constructor(operation, expression) {
        this.operation = operation;
        this.expression = expression;
        this.$kind = 6;
    }
}
class PrimitiveLiteralExpression {
    constructor(value) {
        this.value = value;
        this.$kind = 4;
    }
}
PrimitiveLiteralExpression.$undefined = new PrimitiveLiteralExpression(void 0);
PrimitiveLiteralExpression.$null = new PrimitiveLiteralExpression(null);
PrimitiveLiteralExpression.$true = new PrimitiveLiteralExpression(true);
PrimitiveLiteralExpression.$false = new PrimitiveLiteralExpression(false);
PrimitiveLiteralExpression.$empty = new PrimitiveLiteralExpression('');
class ArrayLiteralExpression {
    constructor(elements) {
        this.elements = elements;
        this.$kind = 2;
    }
}
ArrayLiteralExpression.$empty = new ArrayLiteralExpression(kernel.emptyArray);
class ObjectLiteralExpression {
    constructor(keys, values) {
        this.keys = keys;
        this.values = values;
        this.$kind = 3;
    }
}
ObjectLiteralExpression.$empty = new ObjectLiteralExpression(kernel.emptyArray, kernel.emptyArray);
class TemplateExpression {
    constructor(cooked, expressions = kernel.emptyArray) {
        this.cooked = cooked;
        this.expressions = expressions;
        this.$kind = 5;
    }
}
TemplateExpression.$empty = new TemplateExpression(['']);
class TaggedTemplateExpression {
    constructor(cooked, raw, func, expressions = kernel.emptyArray) {
        this.cooked = cooked;
        this.func = func;
        this.expressions = expressions;
        this.$kind = 12;
        cooked.raw = raw;
    }
}
class ArrayBindingPattern {
    constructor(elements) {
        this.elements = elements;
        this.$kind = 19;
    }
}
class ObjectBindingPattern {
    constructor(keys, values) {
        this.keys = keys;
        this.values = values;
        this.$kind = 20;
    }
}
class BindingIdentifier {
    constructor(name) {
        this.name = name;
        this.$kind = 21;
    }
}
class ForOfStatement {
    constructor(declaration, iterable, semiIdx) {
        this.declaration = declaration;
        this.iterable = iterable;
        this.semiIdx = semiIdx;
        this.$kind = 22;
    }
}
class Interpolation {
    constructor(parts, expressions = kernel.emptyArray) {
        this.parts = parts;
        this.expressions = expressions;
        this.$kind = 23;
        this.isMulti = expressions.length > 1;
        this.firstExpression = expressions[0];
    }
}
class DestructuringAssignmentExpression {
    constructor($kind, list, source, initializer) {
        this.$kind = $kind;
        this.list = list;
        this.source = source;
        this.initializer = initializer;
    }
}
class DestructuringAssignmentSingleExpression {
    constructor(target, source, initializer) {
        this.target = target;
        this.source = source;
        this.initializer = initializer;
        this.$kind = 26;
    }
}
class DestructuringAssignmentRestExpression {
    constructor(target, indexOrProperties) {
        this.target = target;
        this.indexOrProperties = indexOrProperties;
        this.$kind = 26;
    }
}
class ArrowFunction {
    constructor(args, body, rest = false) {
        this.args = args;
        this.body = body;
        this.rest = rest;
        this.$kind = 16;
    }
}

class BindingContext {
    constructor(key, value) {
        if (key !== void 0) {
            this[key] = value;
        }
    }
}
class Scope {
    constructor(parent, bindingContext, overrideContext, isBoundary) {
        this.parent = parent;
        this.bindingContext = bindingContext;
        this.overrideContext = overrideContext;
        this.isBoundary = isBoundary;
    }
    static getContext(scope, name, ancestor) {
        if (scope == null) {
            throw nullScopeError();
        }
        let overrideContext = scope.overrideContext;
        let currentScope = scope;
        if (ancestor > 0) {
            while (ancestor > 0) {
                ancestor--;
                currentScope = currentScope.parent;
                if (currentScope == null) {
                    return void 0;
                }
            }
            overrideContext = currentScope.overrideContext;
            return name in overrideContext ? overrideContext : currentScope.bindingContext;
        }
        while (currentScope != null
            && !currentScope.isBoundary
            && !(name in currentScope.overrideContext)
            && !(name in currentScope.bindingContext)) {
            currentScope = currentScope.parent;
        }
        if (currentScope == null) {
            return scope.bindingContext;
        }
        overrideContext = currentScope.overrideContext;
        return name in overrideContext ? overrideContext : currentScope.bindingContext;
    }
    static create(bc, oc, isBoundary) {
        if (bc == null) {
            throw nullContextError();
        }
        return new Scope(null, bc, oc == null ? new OverrideContext() : oc, isBoundary ?? false);
    }
    static fromParent(ps, bc) {
        if (ps == null) {
            throw nullScopeError();
        }
        return new Scope(ps, bc, new OverrideContext(), false);
    }
}
const nullScopeError = () => {
    return createError(`AUR0203: scope is null/undefined.`)
        ;
};
const nullContextError = () => {
    return createError('AUR0204: binding context is null/undefined')
        ;
};
class OverrideContext {
}

const getContext = Scope.getContext;
function astEvaluate(ast, s, e, c) {
    switch (ast.$kind) {
        case 0: {
            let oc = s.overrideContext;
            let currentScope = s;
            let i = ast.ancestor;
            while (i-- && oc) {
                currentScope = currentScope.parent;
                oc = currentScope?.overrideContext ?? null;
            }
            return i < 1 && currentScope ? currentScope.bindingContext : void 0;
        }
        case 1: {
            const obj = getContext(s, ast.name, ast.ancestor);
            if (c !== null) {
                c.observe(obj, ast.name);
            }
            const evaluatedValue = obj[ast.name];
            if (evaluatedValue == null && ast.name === '$host') {
                throw createError(`AUR0105: Unable to find $host context. Did you forget [au-slot] attribute?`);
            }
            if (e?.strict) {
                return e?.boundFn && isFunction(evaluatedValue)
                    ? evaluatedValue.bind(obj)
                    : evaluatedValue;
            }
            return evaluatedValue == null
                ? ''
                : e?.boundFn && isFunction(evaluatedValue)
                    ? evaluatedValue.bind(obj)
                    : evaluatedValue;
        }
        case 2:
            return ast.elements.map(expr => astEvaluate(expr, s, e, c));
        case 3: {
            const instance = {};
            for (let i = 0; i < ast.keys.length; ++i) {
                instance[ast.keys[i]] = astEvaluate(ast.values[i], s, e, c);
            }
            return instance;
        }
        case 4:
            return ast.value;
        case 5: {
            let result = ast.cooked[0];
            for (let i = 0; i < ast.expressions.length; ++i) {
                result += String(astEvaluate(ast.expressions[i], s, e, c));
                result += ast.cooked[i + 1];
            }
            return result;
        }
        case 6:
            switch (ast.operation) {
                case 'void':
                    return void astEvaluate(ast.expression, s, e, c);
                case 'typeof':
                    return typeof astEvaluate(ast.expression, s, e, c);
                case '!':
                    return !astEvaluate(ast.expression, s, e, c);
                case '-':
                    return -astEvaluate(ast.expression, s, e, c);
                case '+':
                    return +astEvaluate(ast.expression, s, e, c);
                default:
                    throw createError(`AUR0109: Unknown unary operator: '${ast.operation}'`);
            }
        case 7: {
            const args = ast.args.map(a => astEvaluate(a, s, e, c));
            const context = getContext(s, ast.name, ast.ancestor);
            const func = getFunction(e?.strictFnCall, context, ast.name);
            if (func) {
                return func.apply(context, args);
            }
            return void 0;
        }
        case 8: {
            const instance = astEvaluate(ast.object, s, e, c);
            const args = ast.args.map(a => astEvaluate(a, s, e, c));
            const func = getFunction(e?.strictFnCall, instance, ast.name);
            let ret;
            if (func) {
                ret = func.apply(instance, args);
                if (isArray(instance) && autoObserveArrayMethods.includes(ast.name)) {
                    c?.observeCollection(instance);
                }
            }
            return ret;
        }
        case 9: {
            const func = astEvaluate(ast.func, s, e, c);
            if (isFunction(func)) {
                return func(...ast.args.map(a => astEvaluate(a, s, e, c)));
            }
            if (!e?.strictFnCall && func == null) {
                return void 0;
            }
            throw createError(`AUR0107: Expression is not a function.`);
        }
        case 16: {
            const func = (...args) => {
                const params = ast.args;
                const rest = ast.rest;
                const lastIdx = params.length - 1;
                const context = params.reduce((map, param, i) => {
                    if (rest && i === lastIdx) {
                        map[param.name] = args.slice(i);
                    }
                    else {
                        map[param.name] = args[i];
                    }
                    return map;
                }, {});
                const functionScope = Scope.fromParent(s, context);
                return astEvaluate(ast.body, functionScope, e, c);
            };
            return func;
        }
        case 10: {
            const instance = astEvaluate(ast.object, s, e, c);
            let ret;
            if (e?.strict) {
                if (instance == null) {
                    return instance;
                }
                if (c !== null) {
                    c.observe(instance, ast.name);
                }
                ret = instance[ast.name];
                if (e?.boundFn && isFunction(ret)) {
                    return ret.bind(instance);
                }
                return ret;
            }
            if (c !== null && isObject(instance)) {
                c.observe(instance, ast.name);
            }
            if (instance) {
                ret = instance[ast.name];
                if (e?.boundFn && isFunction(ret)) {
                    return ret.bind(instance);
                }
                return ret;
            }
            return '';
        }
        case 11: {
            const instance = astEvaluate(ast.object, s, e, c);
            if (isObject(instance)) {
                const key = astEvaluate(ast.key, s, e, c);
                if (c !== null) {
                    c.observe(instance, key);
                }
                return instance[key];
            }
            return void 0;
        }
        case 12: {
            const results = ast.expressions.map(expr => astEvaluate(expr, s, e, c));
            const func = astEvaluate(ast.func, s, e, c);
            if (!isFunction(func)) {
                throw createError(`AUR0110: Left-hand side of tagged template expression is not a function.`);
            }
            return func(ast.cooked, ...results);
        }
        case 13: {
            const left = ast.left;
            const right = ast.right;
            switch (ast.operation) {
                case '&&':
                    return astEvaluate(left, s, e, c) && astEvaluate(right, s, e, c);
                case '||':
                    return astEvaluate(left, s, e, c) || astEvaluate(right, s, e, c);
                case '??':
                    return astEvaluate(left, s, e, c) ?? astEvaluate(right, s, e, c);
                case '==':
                    return astEvaluate(left, s, e, c) == astEvaluate(right, s, e, c);
                case '===':
                    return astEvaluate(left, s, e, c) === astEvaluate(right, s, e, c);
                case '!=':
                    return astEvaluate(left, s, e, c) != astEvaluate(right, s, e, c);
                case '!==':
                    return astEvaluate(left, s, e, c) !== astEvaluate(right, s, e, c);
                case 'instanceof': {
                    const $right = astEvaluate(right, s, e, c);
                    if (isFunction($right)) {
                        return astEvaluate(left, s, e, c) instanceof $right;
                    }
                    return false;
                }
                case 'in': {
                    const $right = astEvaluate(right, s, e, c);
                    if (isObject($right)) {
                        return astEvaluate(left, s, e, c) in $right;
                    }
                    return false;
                }
                case '+': {
                    const $left = astEvaluate(left, s, e, c);
                    const $right = astEvaluate(right, s, e, c);
                    if (e?.strict) {
                        return $left + $right;
                    }
                    if (!$left || !$right) {
                        if (isNumberOrBigInt($left) || isNumberOrBigInt($right)) {
                            return ($left || 0) + ($right || 0);
                        }
                        if (isStringOrDate($left) || isStringOrDate($right)) {
                            return ($left || '') + ($right || '');
                        }
                    }
                    return $left + $right;
                }
                case '-':
                    return astEvaluate(left, s, e, c) - astEvaluate(right, s, e, c);
                case '*':
                    return astEvaluate(left, s, e, c) * astEvaluate(right, s, e, c);
                case '/':
                    return astEvaluate(left, s, e, c) / astEvaluate(right, s, e, c);
                case '%':
                    return astEvaluate(left, s, e, c) % astEvaluate(right, s, e, c);
                case '<':
                    return astEvaluate(left, s, e, c) < astEvaluate(right, s, e, c);
                case '>':
                    return astEvaluate(left, s, e, c) > astEvaluate(right, s, e, c);
                case '<=':
                    return astEvaluate(left, s, e, c) <= astEvaluate(right, s, e, c);
                case '>=':
                    return astEvaluate(left, s, e, c) >= astEvaluate(right, s, e, c);
                default:
                    throw createError(`AUR0108: Unknown binary operator: '${ast.operation}'`);
            }
        }
        case 14:
            return astEvaluate(ast.condition, s, e, c) ? astEvaluate(ast.yes, s, e, c) : astEvaluate(ast.no, s, e, c);
        case 15:
            return astAssign(ast.target, s, e, astEvaluate(ast.value, s, e, c));
        case 17: {
            const vc = e?.getConverter?.(ast.name);
            if (vc == null) {
                throw createError(`AUR0103: ValueConverter named '${ast.name}' could not be found. Did you forget to register it as a dependency?`);
            }
            if ('toView' in vc) {
                return vc.toView(astEvaluate(ast.expression, s, e, c), ...ast.args.map(a => astEvaluate(a, s, e, c)));
            }
            return astEvaluate(ast.expression, s, e, c);
        }
        case 18:
            return astEvaluate(ast.expression, s, e, c);
        case 21:
            return ast.name;
        case 22:
            return astEvaluate(ast.iterable, s, e, c);
        case 23:
            if (ast.isMulti) {
                let result = ast.parts[0];
                let i = 0;
                for (; i < ast.expressions.length; ++i) {
                    result += safeString(astEvaluate(ast.expressions[i], s, e, c));
                    result += ast.parts[i + 1];
                }
                return result;
            }
            else {
                return `${ast.parts[0]}${astEvaluate(ast.firstExpression, s, e, c)}${ast.parts[1]}`;
            }
        case 26:
            return astEvaluate(ast.target, s, e, c);
        case 24: {
            return ast.list.map(x => astEvaluate(x, s, e, c));
        }
        case 19:
        case 20:
        case 25:
        default:
            return void 0;
        case 28:
            return ast.evaluate(s, e, c);
    }
}
function astAssign(ast, s, e, val) {
    switch (ast.$kind) {
        case 1: {
            if (ast.name === '$host') {
                throw createError(`AUR0106: Invalid assignment. $host is a reserved keyword.`);
            }
            const obj = getContext(s, ast.name, ast.ancestor);
            return obj[ast.name] = val;
        }
        case 10: {
            const obj = astEvaluate(ast.object, s, e, null);
            if (isObject(obj)) {
                if (ast.name === 'length' && isArray(obj) && !isNaN(val)) {
                    obj.splice(val);
                }
                else {
                    obj[ast.name] = val;
                }
            }
            else {
                astAssign(ast.object, s, e, { [ast.name]: val });
            }
            return val;
        }
        case 11: {
            const instance = astEvaluate(ast.object, s, e, null);
            const key = astEvaluate(ast.key, s, e, null);
            if (isArray(instance)) {
                if (key === 'length' && !isNaN(val)) {
                    instance.splice(val);
                    return val;
                }
                if (kernel.isArrayIndex(key)) {
                    instance.splice(key, 1, val);
                    return val;
                }
            }
            return instance[key] = val;
        }
        case 15:
            astAssign(ast.value, s, e, val);
            return astAssign(ast.target, s, e, val);
        case 17: {
            const vc = e?.getConverter?.(ast.name);
            if (vc == null) {
                throw converterNotFoundError(ast.name);
            }
            if ('fromView' in vc) {
                val = vc.fromView(val, ...ast.args.map(a => astEvaluate(a, s, e, null)));
            }
            return astAssign(ast.expression, s, e, val);
        }
        case 18:
            return astAssign(ast.expression, s, e, val);
        case 24:
        case 25: {
            const list = ast.list;
            const len = list.length;
            let i;
            let item;
            for (i = 0; i < len; i++) {
                item = list[i];
                switch (item.$kind) {
                    case 26:
                        astAssign(item, s, e, val);
                        break;
                    case 24:
                    case 25: {
                        if (typeof val !== 'object' || val === null) {
                            {
                                throw createError(`AUR0112: Cannot use non-object value for destructuring assignment.`);
                            }
                        }
                        let source = astEvaluate(item.source, Scope.create(val), e, null);
                        if (source === void 0 && item.initializer) {
                            source = astEvaluate(item.initializer, s, e, null);
                        }
                        astAssign(item, s, e, source);
                        break;
                    }
                }
            }
            break;
        }
        case 26: {
            if (ast instanceof DestructuringAssignmentSingleExpression) {
                if (val == null) {
                    return;
                }
                if (typeof val !== 'object') {
                    {
                        throw createError(`AUR0112: Cannot use non-object value for destructuring assignment.`);
                    }
                }
                let source = astEvaluate(ast.source, Scope.create(val), e, null);
                if (source === void 0 && ast.initializer) {
                    source = astEvaluate(ast.initializer, s, e, null);
                }
                astAssign(ast.target, s, e, source);
            }
            else {
                if (val == null) {
                    return;
                }
                if (typeof val !== 'object') {
                    {
                        throw createError(`AUR0112: Cannot use non-object value for destructuring assignment.`);
                    }
                }
                const indexOrProperties = ast.indexOrProperties;
                let restValue;
                if (kernel.isArrayIndex(indexOrProperties)) {
                    if (!Array.isArray(val)) {
                        {
                            throw createError(`AUR0112: Cannot use non-array value for array-destructuring assignment.`);
                        }
                    }
                    restValue = val.slice(indexOrProperties);
                }
                else {
                    restValue = Object
                        .entries(val)
                        .reduce((acc, [k, v]) => {
                        if (!indexOrProperties.includes(k)) {
                            acc[k] = v;
                        }
                        return acc;
                    }, {});
                }
                astAssign(ast.target, s, e, restValue);
            }
            break;
        }
        case 28:
            return ast.assign(s, e, val);
        default:
            return void 0;
    }
}
function astBind(ast, s, b) {
    switch (ast.$kind) {
        case 18: {
            const name = ast.name;
            const key = ast.key;
            const behavior = b.getBehavior?.(name);
            if (behavior == null) {
                throw behaviorNotFoundError(name);
            }
            if (b[key] === void 0) {
                b[key] = behavior;
                behavior.bind?.(s, b, ...ast.args.map(a => astEvaluate(a, s, b, null)));
            }
            else {
                throw duplicateBehaviorAppliedError(name);
            }
            astBind(ast.expression, s, b);
            return;
        }
        case 17: {
            const name = ast.name;
            const vc = b.getConverter?.(name);
            if (vc == null) {
                throw converterNotFoundError(name);
            }
            const signals = vc.signals;
            if (signals != null) {
                const signaler = b.getSignaler?.();
                const ii = signals.length;
                let i = 0;
                for (; i < ii; ++i) {
                    signaler?.addSignalListener(signals[i], b);
                }
            }
            astBind(ast.expression, s, b);
            return;
        }
        case 22: {
            astBind(ast.iterable, s, b);
            break;
        }
        case 28: {
            ast.bind?.(s, b);
        }
    }
}
function astUnbind(ast, s, b) {
    switch (ast.$kind) {
        case 18: {
            const key = ast.key;
            const $b = b;
            if ($b[key] !== void 0) {
                $b[key].unbind?.(s, b);
                $b[key] = void 0;
            }
            astUnbind(ast.expression, s, b);
            break;
        }
        case 17: {
            const vc = b.getConverter?.(ast.name);
            if (vc?.signals === void 0) {
                return;
            }
            const signaler = b.getSignaler?.();
            let i = 0;
            for (; i < vc.signals.length; ++i) {
                signaler?.removeSignalListener(vc.signals[i], b);
            }
            astUnbind(ast.expression, s, b);
            break;
        }
        case 22: {
            astUnbind(ast.iterable, s, b);
            break;
        }
        case 28: {
            ast.unbind?.(s, b);
        }
    }
}
const behaviorNotFoundError = (name) => createError(`AUR0101: BindingBehavior '${name}' could not be found. Did you forget to register it as a dependency?`)
    ;
const duplicateBehaviorAppliedError = (name) => createError(`AUR0102: BindingBehavior '${name}' already applied.`)
    ;
const converterNotFoundError = (name) => {
    return createError(`AUR0103: ValueConverter '${name}' could not be found. Did you forget to register it as a dependency?`);
};
const getFunction = (mustEvaluate, obj, name) => {
    const func = obj == null ? null : obj[name];
    if (isFunction(func)) {
        return func;
    }
    if (!mustEvaluate && func == null) {
        return null;
    }
    throw createError(`AUR0111: Expected '${name}' to be a function`);
};
const isNumberOrBigInt = (value) => {
    switch (typeof value) {
        case 'number':
        case 'bigint':
            return true;
        default:
            return false;
    }
};
const isStringOrDate = (value) => {
    switch (typeof value) {
        case 'string':
            return true;
        case 'object':
            return value instanceof Date;
        default:
            return false;
    }
};
const autoObserveArrayMethods = 'at map filter includes indexOf lastIndexOf findIndex find flat flatMap join reduce reduceRight slice every some sort'.split(' ');

const ICoercionConfiguration = kernel.DI.createInterface('ICoercionConfiguration');
exports.CollectionKind = void 0;
(function (CollectionKind) {
    CollectionKind[CollectionKind["indexed"] = 8] = "indexed";
    CollectionKind[CollectionKind["keyed"] = 4] = "keyed";
    CollectionKind[CollectionKind["array"] = 9] = "array";
    CollectionKind[CollectionKind["map"] = 6] = "map";
    CollectionKind[CollectionKind["set"] = 7] = "set";
})(exports.CollectionKind || (exports.CollectionKind = {}));
exports.AccessorType = void 0;
(function (AccessorType) {
    AccessorType[AccessorType["None"] = 0] = "None";
    AccessorType[AccessorType["Observer"] = 1] = "Observer";
    AccessorType[AccessorType["Node"] = 2] = "Node";
    AccessorType[AccessorType["Layout"] = 4] = "Layout";
    AccessorType[AccessorType["Primtive"] = 8] = "Primtive";
    AccessorType[AccessorType["Array"] = 18] = "Array";
    AccessorType[AccessorType["Set"] = 34] = "Set";
    AccessorType[AccessorType["Map"] = 66] = "Map";
})(exports.AccessorType || (exports.AccessorType = {}));
function copyIndexMap(existing, deletedIndices, deletedItems) {
    const { length } = existing;
    const arr = Array(length);
    let i = 0;
    while (i < length) {
        arr[i] = existing[i];
        ++i;
    }
    if (deletedIndices !== void 0) {
        arr.deletedIndices = deletedIndices.slice(0);
    }
    else if (existing.deletedIndices !== void 0) {
        arr.deletedIndices = existing.deletedIndices.slice(0);
    }
    else {
        arr.deletedIndices = [];
    }
    if (deletedItems !== void 0) {
        arr.deletedItems = deletedItems.slice(0);
    }
    else if (existing.deletedItems !== void 0) {
        arr.deletedItems = existing.deletedItems.slice(0);
    }
    else {
        arr.deletedItems = [];
    }
    arr.isIndexMap = true;
    return arr;
}
function createIndexMap(length = 0) {
    const arr = Array(length);
    let i = 0;
    while (i < length) {
        arr[i] = i++;
    }
    arr.deletedIndices = [];
    arr.deletedItems = [];
    arr.isIndexMap = true;
    return arr;
}
function cloneIndexMap(indexMap) {
    const clone = indexMap.slice();
    clone.deletedIndices = indexMap.deletedIndices.slice();
    clone.deletedItems = indexMap.deletedItems.slice();
    clone.isIndexMap = true;
    return clone;
}
function isIndexMap(value) {
    return isArray(value) && value.isIndexMap === true;
}

let currBatch = new Map();
let batching = false;
function batch(fn) {
    const prevBatch = currBatch;
    const newBatch = currBatch = new Map();
    batching = true;
    try {
        fn();
    }
    finally {
        currBatch = null;
        batching = false;
        try {
            let pair;
            let subs;
            let batchRecord;
            let col;
            let indexMap;
            let hasChanges = false;
            let i;
            let ii;
            for (pair of newBatch) {
                subs = pair[0];
                batchRecord = pair[1];
                if (prevBatch?.has(subs)) {
                    prevBatch.set(subs, batchRecord);
                }
                if (batchRecord[0] === 1) {
                    subs.notify(batchRecord[1], batchRecord[2]);
                }
                else {
                    col = batchRecord[1];
                    indexMap = batchRecord[2];
                    hasChanges = false;
                    if (indexMap.deletedIndices.length > 0) {
                        hasChanges = true;
                    }
                    else {
                        for (i = 0, ii = indexMap.length; i < ii; ++i) {
                            if (indexMap[i] !== i) {
                                hasChanges = true;
                                break;
                            }
                        }
                    }
                    if (hasChanges) {
                        subs.notifyCollection(col, indexMap);
                    }
                }
            }
        }
        finally {
            currBatch = prevBatch;
        }
    }
}
function addCollectionBatch(subs, collection, indexMap) {
    if (!currBatch.has(subs)) {
        currBatch.set(subs, [2, collection, indexMap]);
    }
}
function addValueBatch(subs, newValue, oldValue) {
    const batchRecord = currBatch.get(subs);
    if (batchRecord === void 0) {
        currBatch.set(subs, [1, newValue, oldValue]);
    }
    else {
        batchRecord[1] = newValue;
        batchRecord[2] = oldValue;
    }
}

function subscriberCollection(target) {
    return target == null ? subscriberCollectionDeco : subscriberCollectionDeco(target);
}
function subscriberCollectionDeco(target) {
    const proto = target.prototype;
    def(proto, 'subs', { get: getSubscriberRecord });
    ensureProto(proto, 'subscribe', addSubscriber);
    ensureProto(proto, 'unsubscribe', removeSubscriber);
}
class SubscriberRecord {
    constructor() {
        this.count = 0;
        this._subs = [];
    }
    add(subscriber) {
        if (this._subs.includes(subscriber)) {
            return false;
        }
        this._subs[this._subs.length] = subscriber;
        ++this.count;
        return true;
    }
    remove(subscriber) {
        const idx = this._subs.indexOf(subscriber);
        if (idx !== -1) {
            this._subs.splice(idx, 1);
            --this.count;
            return true;
        }
        return false;
    }
    notify(val, oldVal) {
        if (batching) {
            addValueBatch(this, val, oldVal);
            return;
        }
        const _subs = this._subs.slice(0);
        const len = _subs.length;
        let i = 0;
        for (; i < len; ++i) {
            _subs[i].handleChange(val, oldVal);
        }
        return;
    }
    notifyCollection(collection, indexMap) {
        const _subs = this._subs.slice(0);
        const len = _subs.length;
        let i = 0;
        for (; i < len; ++i) {
            _subs[i].handleCollectionChange(collection, indexMap);
        }
        return;
    }
}
function getSubscriberRecord() {
    return defineHiddenProp(this, 'subs', new SubscriberRecord());
}
function addSubscriber(subscriber) {
    return this.subs.add(subscriber);
}
function removeSubscriber(subscriber) {
    return this.subs.remove(subscriber);
}

class CollectionLengthObserver {
    constructor(owner) {
        this.owner = owner;
        this.type = 18;
        this._value = (this._obj = owner.collection).length;
    }
    getValue() {
        return this._obj.length;
    }
    setValue(newValue) {
        if (newValue !== this._value) {
            if (!Number.isNaN(newValue)) {
                this._obj.splice(newValue);
                this._value = this._obj.length;
            }
            else {
                console.warn(`Invalid value "${newValue}" for array length`);
            }
        }
    }
    handleCollectionChange(_arr, _) {
        const oldValue = this._value;
        const value = this._obj.length;
        if ((this._value = value) !== oldValue) {
            this.subs.notify(this._value, oldValue);
        }
    }
}
class CollectionSizeObserver {
    constructor(owner) {
        this.owner = owner;
        this._value = (this._obj = owner.collection).size;
        this.type = isMap(this._obj) ? 66 : 34;
    }
    getValue() {
        return this._obj.size;
    }
    setValue() {
        throw createError(`AUR02: Map/Set "size" is a readonly property`);
    }
    handleCollectionChange(_collection, _) {
        const oldValue = this._value;
        const value = this._obj.size;
        if ((this._value = value) !== oldValue) {
            this.subs.notify(this._value, oldValue);
        }
    }
}
function implementLengthObserver(klass) {
    const proto = klass.prototype;
    ensureProto(proto, 'subscribe', subscribe);
    ensureProto(proto, 'unsubscribe', unsubscribe);
    subscriberCollection(klass);
}
function subscribe(subscriber) {
    if (this.subs.add(subscriber) && this.subs.count === 1) {
        this.owner.subscribe(this);
    }
}
function unsubscribe(subscriber) {
    if (this.subs.remove(subscriber) && this.subs.count === 0) {
        this.owner.subscribe(this);
    }
}
implementLengthObserver(CollectionLengthObserver);
implementLengthObserver(CollectionSizeObserver);

const lookupMetadataKey$2 = '__au_array_obs__';
const observerLookup$2 = (() => {
    let lookup = getOwnMetadata(lookupMetadataKey$2, Array);
    if (lookup == null) {
        defineMetadata(lookupMetadataKey$2, lookup = new WeakMap(), Array);
    }
    return lookup;
})();
function sortCompare(x, y) {
    if (x === y) {
        return 0;
    }
    x = x === null ? 'null' : x.toString();
    y = y === null ? 'null' : y.toString();
    return x < y ? -1 : 1;
}
function preSortCompare(x, y) {
    if (x === void 0) {
        if (y === void 0) {
            return 0;
        }
        else {
            return 1;
        }
    }
    if (y === void 0) {
        return -1;
    }
    return 0;
}
function insertionSort(arr, indexMap, from, to, compareFn) {
    let velement, ielement, vtmp, itmp, order;
    let i, j;
    for (i = from + 1; i < to; i++) {
        velement = arr[i];
        ielement = indexMap[i];
        for (j = i - 1; j >= from; j--) {
            vtmp = arr[j];
            itmp = indexMap[j];
            order = compareFn(vtmp, velement);
            if (order > 0) {
                arr[j + 1] = vtmp;
                indexMap[j + 1] = itmp;
            }
            else {
                break;
            }
        }
        arr[j + 1] = velement;
        indexMap[j + 1] = ielement;
    }
}
function quickSort(arr, indexMap, from, to, compareFn) {
    let thirdIndex = 0, i = 0;
    let v0, v1, v2;
    let i0, i1, i2;
    let c01, c02, c12;
    let vtmp, itmp;
    let vpivot, ipivot, lowEnd, highStart;
    let velement, ielement, order, vtopElement;
    while (true) {
        if (to - from <= 10) {
            insertionSort(arr, indexMap, from, to, compareFn);
            return;
        }
        thirdIndex = from + ((to - from) >> 1);
        v0 = arr[from];
        i0 = indexMap[from];
        v1 = arr[to - 1];
        i1 = indexMap[to - 1];
        v2 = arr[thirdIndex];
        i2 = indexMap[thirdIndex];
        c01 = compareFn(v0, v1);
        if (c01 > 0) {
            vtmp = v0;
            itmp = i0;
            v0 = v1;
            i0 = i1;
            v1 = vtmp;
            i1 = itmp;
        }
        c02 = compareFn(v0, v2);
        if (c02 >= 0) {
            vtmp = v0;
            itmp = i0;
            v0 = v2;
            i0 = i2;
            v2 = v1;
            i2 = i1;
            v1 = vtmp;
            i1 = itmp;
        }
        else {
            c12 = compareFn(v1, v2);
            if (c12 > 0) {
                vtmp = v1;
                itmp = i1;
                v1 = v2;
                i1 = i2;
                v2 = vtmp;
                i2 = itmp;
            }
        }
        arr[from] = v0;
        indexMap[from] = i0;
        arr[to - 1] = v2;
        indexMap[to - 1] = i2;
        vpivot = v1;
        ipivot = i1;
        lowEnd = from + 1;
        highStart = to - 1;
        arr[thirdIndex] = arr[lowEnd];
        indexMap[thirdIndex] = indexMap[lowEnd];
        arr[lowEnd] = vpivot;
        indexMap[lowEnd] = ipivot;
        partition: for (i = lowEnd + 1; i < highStart; i++) {
            velement = arr[i];
            ielement = indexMap[i];
            order = compareFn(velement, vpivot);
            if (order < 0) {
                arr[i] = arr[lowEnd];
                indexMap[i] = indexMap[lowEnd];
                arr[lowEnd] = velement;
                indexMap[lowEnd] = ielement;
                lowEnd++;
            }
            else if (order > 0) {
                do {
                    highStart--;
                    if (highStart == i) {
                        break partition;
                    }
                    vtopElement = arr[highStart];
                    order = compareFn(vtopElement, vpivot);
                } while (order > 0);
                arr[i] = arr[highStart];
                indexMap[i] = indexMap[highStart];
                arr[highStart] = velement;
                indexMap[highStart] = ielement;
                if (order < 0) {
                    velement = arr[i];
                    ielement = indexMap[i];
                    arr[i] = arr[lowEnd];
                    indexMap[i] = indexMap[lowEnd];
                    arr[lowEnd] = velement;
                    indexMap[lowEnd] = ielement;
                    lowEnd++;
                }
            }
        }
        if (to - highStart < lowEnd - from) {
            quickSort(arr, indexMap, highStart, to, compareFn);
            to = lowEnd;
        }
        else {
            quickSort(arr, indexMap, from, lowEnd, compareFn);
            from = highStart;
        }
    }
}
const proto$2 = Array.prototype;
const $push = proto$2.push;
const $unshift = proto$2.unshift;
const $pop = proto$2.pop;
const $shift = proto$2.shift;
const $splice = proto$2.splice;
const $reverse = proto$2.reverse;
const $sort = proto$2.sort;
const native$2 = { push: $push, unshift: $unshift, pop: $pop, shift: $shift, splice: $splice, reverse: $reverse, sort: $sort };
const methods$2 = ['push', 'unshift', 'pop', 'shift', 'splice', 'reverse', 'sort'];
const observe$3 = {
    push: function (...args) {
        const o = observerLookup$2.get(this);
        if (o === void 0) {
            return $push.apply(this, args);
        }
        const len = this.length;
        const argCount = args.length;
        if (argCount === 0) {
            return len;
        }
        this.length = o.indexMap.length = len + argCount;
        let i = len;
        while (i < this.length) {
            this[i] = args[i - len];
            o.indexMap[i] = -2;
            i++;
        }
        o.notify();
        return this.length;
    },
    unshift: function (...args) {
        const o = observerLookup$2.get(this);
        if (o === void 0) {
            return $unshift.apply(this, args);
        }
        const argCount = args.length;
        const inserts = new Array(argCount);
        let i = 0;
        while (i < argCount) {
            inserts[i++] = -2;
        }
        $unshift.apply(o.indexMap, inserts);
        const len = $unshift.apply(this, args);
        o.notify();
        return len;
    },
    pop: function () {
        const o = observerLookup$2.get(this);
        if (o === void 0) {
            return $pop.call(this);
        }
        const indexMap = o.indexMap;
        const element = $pop.call(this);
        const index = indexMap.length - 1;
        if (indexMap[index] > -1) {
            indexMap.deletedIndices.push(indexMap[index]);
            indexMap.deletedItems.push(element);
        }
        $pop.call(indexMap);
        o.notify();
        return element;
    },
    shift: function () {
        const o = observerLookup$2.get(this);
        if (o === void 0) {
            return $shift.call(this);
        }
        const indexMap = o.indexMap;
        const element = $shift.call(this);
        if (indexMap[0] > -1) {
            indexMap.deletedIndices.push(indexMap[0]);
            indexMap.deletedItems.push(element);
        }
        $shift.call(indexMap);
        o.notify();
        return element;
    },
    splice: function (...args) {
        const start = args[0];
        const deleteCount = args[1];
        const o = observerLookup$2.get(this);
        if (o === void 0) {
            return $splice.apply(this, args);
        }
        const len = this.length;
        const relativeStart = start | 0;
        const actualStart = relativeStart < 0 ? Math.max((len + relativeStart), 0) : Math.min(relativeStart, len);
        const indexMap = o.indexMap;
        const argCount = args.length;
        const actualDeleteCount = argCount === 0 ? 0 : argCount === 1 ? len - actualStart : deleteCount;
        let i = actualStart;
        if (actualDeleteCount > 0) {
            const to = i + actualDeleteCount;
            while (i < to) {
                if (indexMap[i] > -1) {
                    indexMap.deletedIndices.push(indexMap[i]);
                    indexMap.deletedItems.push(this[i]);
                }
                i++;
            }
        }
        i = 0;
        if (argCount > 2) {
            const itemCount = argCount - 2;
            const inserts = new Array(itemCount);
            while (i < itemCount) {
                inserts[i++] = -2;
            }
            $splice.call(indexMap, start, deleteCount, ...inserts);
        }
        else {
            $splice.apply(indexMap, args);
        }
        const deleted = $splice.apply(this, args);
        if (actualDeleteCount > 0 || i > 0) {
            o.notify();
        }
        return deleted;
    },
    reverse: function () {
        const o = observerLookup$2.get(this);
        if (o === void 0) {
            $reverse.call(this);
            return this;
        }
        const len = this.length;
        const middle = (len / 2) | 0;
        let lower = 0;
        while (lower !== middle) {
            const upper = len - lower - 1;
            const lowerValue = this[lower];
            const lowerIndex = o.indexMap[lower];
            const upperValue = this[upper];
            const upperIndex = o.indexMap[upper];
            this[lower] = upperValue;
            o.indexMap[lower] = upperIndex;
            this[upper] = lowerValue;
            o.indexMap[upper] = lowerIndex;
            lower++;
        }
        o.notify();
        return this;
    },
    sort: function (compareFn) {
        const o = observerLookup$2.get(this);
        if (o === void 0) {
            $sort.call(this, compareFn);
            return this;
        }
        let len = this.length;
        if (len < 2) {
            return this;
        }
        quickSort(this, o.indexMap, 0, len, preSortCompare);
        let i = 0;
        while (i < len) {
            if (this[i] === void 0) {
                break;
            }
            i++;
        }
        if (compareFn === void 0 || !isFunction(compareFn)) {
            compareFn = sortCompare;
        }
        quickSort(this, o.indexMap, 0, i, compareFn);
        let shouldNotify = false;
        for (i = 0, len = o.indexMap.length; len > i; ++i) {
            if (o.indexMap[i] !== i) {
                shouldNotify = true;
                break;
            }
        }
        if (shouldNotify) {
            o.notify();
        }
        return this;
    }
};
for (const method of methods$2) {
    def(observe$3[method], 'observing', { value: true, writable: false, configurable: false, enumerable: false });
}
let enableArrayObservationCalled = false;
const observationEnabledKey$2 = '__au_arr_on__';
function enableArrayObservation() {
    if (!(getOwnMetadata(observationEnabledKey$2, Array) ?? false)) {
        defineMetadata(observationEnabledKey$2, true, Array);
        for (const method of methods$2) {
            if (proto$2[method].observing !== true) {
                defineHiddenProp(proto$2, method, observe$3[method]);
            }
        }
    }
}
function disableArrayObservation() {
    for (const method of methods$2) {
        if (proto$2[method].observing === true) {
            defineHiddenProp(proto$2, method, native$2[method]);
        }
    }
}
class ArrayObserver {
    constructor(array) {
        this.type = 18;
        if (!enableArrayObservationCalled) {
            enableArrayObservationCalled = true;
            enableArrayObservation();
        }
        this.indexObservers = {};
        this.collection = array;
        this.indexMap = createIndexMap(array.length);
        this.lenObs = void 0;
        observerLookup$2.set(array, this);
    }
    notify() {
        const subs = this.subs;
        const indexMap = this.indexMap;
        if (batching) {
            addCollectionBatch(subs, this.collection, indexMap);
            return;
        }
        const arr = this.collection;
        const length = arr.length;
        this.indexMap = createIndexMap(length);
        this.subs.notifyCollection(arr, indexMap);
    }
    getLengthObserver() {
        return this.lenObs ?? (this.lenObs = new CollectionLengthObserver(this));
    }
    getIndexObserver(index) {
        var _a;
        return (_a = this.indexObservers)[index] ?? (_a[index] = new ArrayIndexObserver(this, index));
    }
}
class ArrayIndexObserver {
    constructor(owner, index) {
        this.owner = owner;
        this.index = index;
        this.doNotCache = true;
        this.value = this.getValue();
    }
    getValue() {
        return this.owner.collection[this.index];
    }
    setValue(newValue) {
        if (newValue === this.getValue()) {
            return;
        }
        const arrayObserver = this.owner;
        const index = this.index;
        const indexMap = arrayObserver.indexMap;
        if (indexMap[index] > -1) {
            indexMap.deletedIndices.push(indexMap[index]);
        }
        indexMap[index] = -2;
        arrayObserver.collection[index] = newValue;
        arrayObserver.notify();
    }
    handleCollectionChange(_arr, indexMap) {
        const index = this.index;
        const noChange = indexMap[index] === index;
        if (noChange) {
            return;
        }
        const prevValue = this.value;
        const currValue = this.value = this.getValue();
        if (prevValue !== currValue) {
            this.subs.notify(currValue, prevValue);
        }
    }
    subscribe(subscriber) {
        if (this.subs.add(subscriber) && this.subs.count === 1) {
            this.owner.subscribe(this);
        }
    }
    unsubscribe(subscriber) {
        if (this.subs.remove(subscriber) && this.subs.count === 0) {
            this.owner.unsubscribe(this);
        }
    }
}
subscriberCollection(ArrayObserver);
subscriberCollection(ArrayIndexObserver);
function getArrayObserver(array) {
    let observer = observerLookup$2.get(array);
    if (observer === void 0) {
        observer = new ArrayObserver(array);
    }
    return observer;
}
const compareNumber = (a, b) => a - b;
function applyMutationsToIndices(indexMap) {
    let offset = 0;
    let j = 0;
    let i = 0;
    const $indexMap = cloneIndexMap(indexMap);
    if ($indexMap.deletedIndices.length > 1) {
        $indexMap.deletedIndices.sort(compareNumber);
    }
    const len = $indexMap.length;
    for (; i < len; ++i) {
        while ($indexMap.deletedIndices[j] <= i - offset) {
            ++j;
            --offset;
        }
        if ($indexMap[i] === -2) {
            ++offset;
        }
        else {
            $indexMap[i] += offset;
        }
    }
    return $indexMap;
}
function synchronizeIndices(items, indexMap) {
    const copy = items.slice();
    const len = indexMap.length;
    let to = 0;
    let from = 0;
    while (to < len) {
        from = indexMap[to];
        if (from !== -2) {
            items[to] = copy[from];
        }
        ++to;
    }
}

const lookupMetadataKey$1 = '__au_set_obs__';
const observerLookup$1 = (() => {
    let lookup = getOwnMetadata(lookupMetadataKey$1, Set);
    if (lookup == null) {
        defineMetadata(lookupMetadataKey$1, lookup = new WeakMap(), Set);
    }
    return lookup;
})();
const proto$1 = Set.prototype;
const $add = proto$1.add;
const $clear$1 = proto$1.clear;
const $delete$1 = proto$1.delete;
const native$1 = { add: $add, clear: $clear$1, delete: $delete$1 };
const methods$1 = ['add', 'clear', 'delete'];
const observe$2 = {
    add: function (value) {
        const o = observerLookup$1.get(this);
        if (o === undefined) {
            $add.call(this, value);
            return this;
        }
        const oldSize = this.size;
        $add.call(this, value);
        const newSize = this.size;
        if (newSize === oldSize) {
            return this;
        }
        o.indexMap[oldSize] = -2;
        o.notify();
        return this;
    },
    clear: function () {
        const o = observerLookup$1.get(this);
        if (o === undefined) {
            return $clear$1.call(this);
        }
        const size = this.size;
        if (size > 0) {
            const indexMap = o.indexMap;
            let i = 0;
            for (const key of this.keys()) {
                if (indexMap[i] > -1) {
                    indexMap.deletedIndices.push(indexMap[i]);
                    indexMap.deletedItems.push(key);
                }
                i++;
            }
            $clear$1.call(this);
            indexMap.length = 0;
            o.notify();
        }
        return undefined;
    },
    delete: function (value) {
        const o = observerLookup$1.get(this);
        if (o === undefined) {
            return $delete$1.call(this, value);
        }
        const size = this.size;
        if (size === 0) {
            return false;
        }
        let i = 0;
        const indexMap = o.indexMap;
        for (const entry of this.keys()) {
            if (entry === value) {
                if (indexMap[i] > -1) {
                    indexMap.deletedIndices.push(indexMap[i]);
                    indexMap.deletedItems.push(entry);
                }
                indexMap.splice(i, 1);
                const deleteResult = $delete$1.call(this, value);
                if (deleteResult === true) {
                    o.notify();
                }
                return deleteResult;
            }
            i++;
        }
        return false;
    }
};
const descriptorProps$1 = {
    writable: true,
    enumerable: false,
    configurable: true
};
for (const method of methods$1) {
    def(observe$2[method], 'observing', { value: true, writable: false, configurable: false, enumerable: false });
}
let enableSetObservationCalled = false;
const observationEnabledKey$1 = '__au_set_on__';
function enableSetObservation() {
    if (!(getOwnMetadata(observationEnabledKey$1, Set) ?? false)) {
        defineMetadata(observationEnabledKey$1, true, Set);
        for (const method of methods$1) {
            if (proto$1[method].observing !== true) {
                def(proto$1, method, { ...descriptorProps$1, value: observe$2[method] });
            }
        }
    }
}
function disableSetObservation() {
    for (const method of methods$1) {
        if (proto$1[method].observing === true) {
            def(proto$1, method, { ...descriptorProps$1, value: native$1[method] });
        }
    }
}
class SetObserver {
    constructor(observedSet) {
        this.type = 34;
        if (!enableSetObservationCalled) {
            enableSetObservationCalled = true;
            enableSetObservation();
        }
        this.collection = observedSet;
        this.indexMap = createIndexMap(observedSet.size);
        this.lenObs = void 0;
        observerLookup$1.set(observedSet, this);
    }
    notify() {
        const subs = this.subs;
        const indexMap = this.indexMap;
        if (batching) {
            addCollectionBatch(subs, this.collection, indexMap);
            return;
        }
        const set = this.collection;
        const size = set.size;
        this.indexMap = createIndexMap(size);
        this.subs.notifyCollection(set, indexMap);
    }
    getLengthObserver() {
        return this.lenObs ?? (this.lenObs = new CollectionSizeObserver(this));
    }
}
subscriberCollection(SetObserver);
function getSetObserver(observedSet) {
    let observer = observerLookup$1.get(observedSet);
    if (observer === void 0) {
        observer = new SetObserver(observedSet);
    }
    return observer;
}

const lookupMetadataKey = '__au_map_obs__';
const observerLookup = (() => {
    let lookup = getOwnMetadata(lookupMetadataKey, Map);
    if (lookup == null) {
        defineMetadata(lookupMetadataKey, lookup = new WeakMap(), Map);
    }
    return lookup;
})();
const proto = Map.prototype;
const $set = proto.set;
const $clear = proto.clear;
const $delete = proto.delete;
const native = { set: $set, clear: $clear, delete: $delete };
const methods = ['set', 'clear', 'delete'];
const observe$1 = {
    set: function (key, value) {
        const o = observerLookup.get(this);
        if (o === undefined) {
            $set.call(this, key, value);
            return this;
        }
        const oldValue = this.get(key);
        const oldSize = this.size;
        $set.call(this, key, value);
        const newSize = this.size;
        if (newSize === oldSize) {
            let i = 0;
            for (const entry of this.entries()) {
                if (entry[0] === key) {
                    if (entry[1] !== oldValue) {
                        o.indexMap.deletedIndices.push(o.indexMap[i]);
                        o.indexMap.deletedItems.push(entry);
                        o.indexMap[i] = -2;
                        o.notify();
                    }
                    return this;
                }
                i++;
            }
            return this;
        }
        o.indexMap[oldSize] = -2;
        o.notify();
        return this;
    },
    clear: function () {
        const o = observerLookup.get(this);
        if (o === undefined) {
            return $clear.call(this);
        }
        const size = this.size;
        if (size > 0) {
            const indexMap = o.indexMap;
            let i = 0;
            for (const key of this.keys()) {
                if (indexMap[i] > -1) {
                    indexMap.deletedIndices.push(indexMap[i]);
                    indexMap.deletedItems.push(key);
                }
                i++;
            }
            $clear.call(this);
            indexMap.length = 0;
            o.notify();
        }
        return undefined;
    },
    delete: function (value) {
        const o = observerLookup.get(this);
        if (o === undefined) {
            return $delete.call(this, value);
        }
        const size = this.size;
        if (size === 0) {
            return false;
        }
        let i = 0;
        const indexMap = o.indexMap;
        for (const entry of this.keys()) {
            if (entry === value) {
                if (indexMap[i] > -1) {
                    indexMap.deletedIndices.push(indexMap[i]);
                    indexMap.deletedItems.push(entry);
                }
                indexMap.splice(i, 1);
                const deleteResult = $delete.call(this, value);
                if (deleteResult === true) {
                    o.notify();
                }
                return deleteResult;
            }
            ++i;
        }
        return false;
    }
};
const descriptorProps = {
    writable: true,
    enumerable: false,
    configurable: true
};
for (const method of methods) {
    def(observe$1[method], 'observing', { value: true, writable: false, configurable: false, enumerable: false });
}
let enableMapObservationCalled = false;
const observationEnabledKey = '__au_map_on__';
function enableMapObservation() {
    if (!(getOwnMetadata(observationEnabledKey, Map) ?? false)) {
        defineMetadata(observationEnabledKey, true, Map);
        for (const method of methods) {
            if (proto[method].observing !== true) {
                def(proto, method, { ...descriptorProps, value: observe$1[method] });
            }
        }
    }
}
function disableMapObservation() {
    for (const method of methods) {
        if (proto[method].observing === true) {
            def(proto, method, { ...descriptorProps, value: native[method] });
        }
    }
}
class MapObserver {
    constructor(map) {
        this.type = 66;
        if (!enableMapObservationCalled) {
            enableMapObservationCalled = true;
            enableMapObservation();
        }
        this.collection = map;
        this.indexMap = createIndexMap(map.size);
        this.lenObs = void 0;
        observerLookup.set(map, this);
    }
    notify() {
        const subs = this.subs;
        const indexMap = this.indexMap;
        if (batching) {
            addCollectionBatch(subs, this.collection, indexMap);
            return;
        }
        const map = this.collection;
        const size = map.size;
        this.indexMap = createIndexMap(size);
        subs.notifyCollection(map, indexMap);
    }
    getLengthObserver() {
        return this.lenObs ?? (this.lenObs = new CollectionSizeObserver(this));
    }
}
subscriberCollection(MapObserver);
function getMapObserver(map) {
    let observer = observerLookup.get(map);
    if (observer === void 0) {
        observer = new MapObserver(map);
    }
    return observer;
}

function getObserverRecord() {
    return defineHiddenProp(this, 'obs', new BindingObserverRecord(this));
}
function observe(obj, key) {
    this.obs.add(this.oL.getObserver(obj, key));
}
function observeCollection$1(collection) {
    let obs;
    if (isArray(collection)) {
        obs = getArrayObserver(collection);
    }
    else if (isSet(collection)) {
        obs = getSetObserver(collection);
    }
    else if (isMap(collection)) {
        obs = getMapObserver(collection);
    }
    else {
        throw createError(`AUR0210: Unrecognised collection type.`);
    }
    this.obs.add(obs);
}
function subscribeTo(subscribable) {
    this.obs.add(subscribable);
}
function noopHandleChange() {
    throw createError(`AUR2011: method "handleChange" not implemented`);
}
function noopHandleCollectionChange() {
    throw createError(`AUR2011: method "handleCollectionChange" not implemented`);
}
class BindingObserverRecord {
    constructor(b) {
        this.version = 0;
        this.count = 0;
        this.o = new Map();
        this.b = b;
    }
    add(observer) {
        if (!this.o.has(observer)) {
            observer.subscribe(this.b);
            ++this.count;
        }
        this.o.set(observer, this.version);
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
function unsubscribeAll(version, subscribable) {
    subscribable.unsubscribe(this.b);
}
function unsubscribeStale(version, subscribable) {
    if (this.version !== version) {
        subscribable.unsubscribe(this.b);
        this.o.delete(subscribable);
    }
}
function connectableDecorator(target) {
    const proto = target.prototype;
    ensureProto(proto, 'observe', observe);
    ensureProto(proto, 'observeCollection', observeCollection$1);
    ensureProto(proto, 'subscribeTo', subscribeTo);
    def(proto, 'obs', { get: getObserverRecord });
    ensureProto(proto, 'handleChange', noopHandleChange);
    ensureProto(proto, 'handleCollectionChange', noopHandleCollectionChange);
    return target;
}
function connectable(target) {
    return target == null ? connectableDecorator : connectableDecorator(target);
}

const IExpressionParser = createInterface('IExpressionParser', x => x.singleton(ExpressionParser));
class ExpressionParser {
    constructor() {
        this._expressionLookup = createLookup();
        this._forOfLookup = createLookup();
        this._interpolationLookup = createLookup();
    }
    parse(expression, expressionType) {
        let found;
        switch (expressionType) {
            case 32:
                return new CustomExpression(expression);
            case 1:
                found = this._interpolationLookup[expression];
                if (found === void 0) {
                    found = this._interpolationLookup[expression] = this.$parse(expression, expressionType);
                }
                return found;
            case 2:
                found = this._forOfLookup[expression];
                if (found === void 0) {
                    found = this._forOfLookup[expression] = this.$parse(expression, expressionType);
                }
                return found;
            default: {
                if (expression.length === 0) {
                    if ((expressionType & (8 | 16)) > 0) {
                        return PrimitiveLiteralExpression.$empty;
                    }
                    throw invalidEmptyExpression();
                }
                found = this._expressionLookup[expression];
                if (found === void 0) {
                    found = this._expressionLookup[expression] = this.$parse(expression, expressionType);
                }
                return found;
            }
        }
    }
    $parse(expression, expressionType) {
        $input = expression;
        $index = 0;
        $length = expression.length;
        $scopeDepth = 0;
        $startIndex = 0;
        $currentToken = 6291456;
        $tokenValue = '';
        $currentChar = $charCodeAt(0);
        $assignable = true;
        $optional = false;
        $semicolonIndex = -1;
        return parse(61, expressionType === void 0 ? 16 : expressionType);
    }
}

function unescapeCode(code) {
    switch (code) {
        case 98: return 8;
        case 116: return 9;
        case 110: return 10;
        case 118: return 11;
        case 102: return 12;
        case 114: return 13;
        case 34: return 34;
        case 39: return 39;
        case 92: return 92;
        default: return code;
    }
}


const $false = PrimitiveLiteralExpression.$false;
const $true = PrimitiveLiteralExpression.$true;
const $null = PrimitiveLiteralExpression.$null;
const $undefined = PrimitiveLiteralExpression.$undefined;
const $this = AccessThisExpression.$this;
const $parent = AccessThisExpression.$parent;
exports.ExpressionType = void 0;
(function (ExpressionType) {
    ExpressionType[ExpressionType["None"] = 0] = "None";
    ExpressionType[ExpressionType["Interpolation"] = 1] = "Interpolation";
    ExpressionType[ExpressionType["IsIterator"] = 2] = "IsIterator";
    ExpressionType[ExpressionType["IsChainable"] = 4] = "IsChainable";
    ExpressionType[ExpressionType["IsFunction"] = 8] = "IsFunction";
    ExpressionType[ExpressionType["IsProperty"] = 16] = "IsProperty";
    ExpressionType[ExpressionType["IsCustom"] = 32] = "IsCustom";
})(exports.ExpressionType || (exports.ExpressionType = {}));
let $input = '';
let $index = 0;
let $length = 0;
let $scopeDepth = 0;
let $startIndex = 0;
let $currentToken = 6291456;
let $tokenValue = '';
let $currentChar;
let $assignable = true;
let $optional = false;
let $semicolonIndex = -1;
const stringFromCharCode = String.fromCharCode;
const $charCodeAt = (index) => $input.charCodeAt(index);
const $tokenRaw = () => $input.slice($startIndex, $index);
function parseExpression(input, expressionType) {
    $input = input;
    $index = 0;
    $length = input.length;
    $scopeDepth = 0;
    $startIndex = 0;
    $currentToken = 6291456;
    $tokenValue = '';
    $currentChar = $charCodeAt(0);
    $assignable = true;
    $optional = false;
    $semicolonIndex = -1;
    return parse(61, expressionType === void 0 ? 16 : expressionType);
}
function parse(minPrecedence, expressionType) {
    if (expressionType === 32) {
        return new CustomExpression($input);
    }
    if ($index === 0) {
        if (expressionType & 1) {
            return parseInterpolation();
        }
        nextToken();
        if ($currentToken & 4194304) {
            throw invalidStartOfExpression();
        }
    }
    $assignable = 513 > minPrecedence;
    $optional = false;
    let optionalThisTail = false;
    let result = void 0;
    let ancestor = 0;
    if ($currentToken & 131072) {
        const op = TokenValues[$currentToken & 63];
        nextToken();
        result = new UnaryExpression(op, parse(514, expressionType));
        $assignable = false;
    }
    else {
        primary: switch ($currentToken) {
            case 12294:
                ancestor = $scopeDepth;
                $assignable = false;
                do {
                    nextToken();
                    ++ancestor;
                    switch ($currentToken) {
                        case 65545:
                            nextToken();
                            if (($currentToken & 12288) === 0) {
                                throw expectedIdentifier();
                            }
                            break;
                        case 10:
                        case 11:
                            throw expectedIdentifier();
                        case 2162700:
                            $optional = true;
                            nextToken();
                            if (($currentToken & 12288) === 0) {
                                result = ancestor === 0 ? $this : ancestor === 1 ? $parent : new AccessThisExpression(ancestor);
                                optionalThisTail = true;
                                break primary;
                            }
                            break;
                        default:
                            if ($currentToken & 2097152) {
                                result = ancestor === 0 ? $this : ancestor === 1 ? $parent : new AccessThisExpression(ancestor);
                                break primary;
                            }
                            throw invalidMemberExpression();
                    }
                } while ($currentToken === 12294);
            case 4096: {
                const id = $tokenValue;
                if (expressionType & 2) {
                    result = new BindingIdentifier(id);
                }
                else {
                    result = new AccessScopeExpression(id, ancestor);
                }
                $assignable = !$optional;
                nextToken();
                if (consumeOpt(50)) {
                    if ($currentToken === 524296) {
                        throw functionBodyInArrowFN();
                    }
                    const _optional = $optional;
                    const _scopeDepth = $scopeDepth;
                    ++$scopeDepth;
                    const body = parse(62, 0);
                    $optional = _optional;
                    $scopeDepth = _scopeDepth;
                    $assignable = false;
                    result = new ArrowFunction([new BindingIdentifier(id)], body);
                }
                break;
            }
            case 10:
                throw unexpectedDoubleDot();
            case 11:
                throw invalidSpreadOp();
            case 12292:
                $assignable = false;
                nextToken();
                switch ($scopeDepth) {
                    case 0:
                        result = $this;
                        break;
                    case 1:
                        result = $parent;
                        break;
                    default:
                        result = new AccessThisExpression($scopeDepth);
                        break;
                }
                break;
            case 2688007:
                result = parseCoverParenthesizedExpressionAndArrowParameterList(expressionType);
                break;
            case 2688016:
                result = $input.search(/\s+of\s+/) > $index ? parseArrayDestructuring() : parseArrayLiteralExpression(expressionType);
                break;
            case 524296:
                result = parseObjectLiteralExpression(expressionType);
                break;
            case 2163759:
                result = new TemplateExpression([$tokenValue]);
                $assignable = false;
                nextToken();
                break;
            case 2163760:
                result = parseTemplate(expressionType, result, false);
                break;
            case 16384:
            case 32768:
                result = new PrimitiveLiteralExpression($tokenValue);
                $assignable = false;
                nextToken();
                break;
            case 8194:
            case 8195:
            case 8193:
            case 8192:
                result = TokenValues[$currentToken & 63];
                $assignable = false;
                nextToken();
                break;
            default:
                if ($index >= $length) {
                    throw unexpectedEndOfExpression();
                }
                else {
                    throw unconsumedToken();
                }
        }
        if (expressionType & 2) {
            return parseForOfStatement(result);
        }
        if (514 < minPrecedence) {
            return result;
        }
        if ($currentToken === 10 || $currentToken === 11) {
            throw expectedIdentifier();
        }
        if (result.$kind === 0) {
            switch ($currentToken) {
                case 2162700:
                    $optional = true;
                    $assignable = false;
                    nextToken();
                    if (($currentToken & 13312) === 0) {
                        throw unexpectedTokenInOptionalChain();
                    }
                    if ($currentToken & 12288) {
                        result = new AccessScopeExpression($tokenValue, result.ancestor);
                        nextToken();
                    }
                    else if ($currentToken === 2688007) {
                        result = new CallFunctionExpression(result, parseArguments(), true);
                    }
                    else if ($currentToken === 2688016) {
                        result = parseKeyedExpression(result, true);
                    }
                    else {
                        throw invalidTaggedTemplateOnOptionalChain();
                    }
                    break;
                case 65545:
                    $assignable = !$optional;
                    nextToken();
                    if (($currentToken & 12288) === 0) {
                        throw expectedIdentifier();
                    }
                    result = new AccessScopeExpression($tokenValue, result.ancestor);
                    nextToken();
                    break;
                case 10:
                case 11:
                    throw expectedIdentifier();
                case 2688007:
                    result = new CallFunctionExpression(result, parseArguments(), optionalThisTail);
                    break;
                case 2688016:
                    result = parseKeyedExpression(result, optionalThisTail);
                    break;
                case 2163759:
                    result = createTemplateTail(result);
                    break;
                case 2163760:
                    result = parseTemplate(expressionType, result, true);
                    break;
            }
        }
        while (($currentToken & 65536) > 0) {
            switch ($currentToken) {
                case 2162700:
                    result = parseOptionalChainLHS(result);
                    break;
                case 65545:
                    nextToken();
                    if (($currentToken & 12288) === 0) {
                        throw expectedIdentifier();
                    }
                    result = parseMemberExpressionLHS(result, false);
                    break;
                case 10:
                case 11:
                    throw expectedIdentifier();
                case 2688007:
                    if (result.$kind === 1) {
                        result = new CallScopeExpression(result.name, parseArguments(), result.ancestor, false);
                    }
                    else if (result.$kind === 10) {
                        result = new CallMemberExpression(result.object, result.name, parseArguments(), result.optional, false);
                    }
                    else {
                        result = new CallFunctionExpression(result, parseArguments(), false);
                    }
                    break;
                case 2688016:
                    result = parseKeyedExpression(result, false);
                    break;
                case 2163759:
                    if ($optional) {
                        throw invalidTaggedTemplateOnOptionalChain();
                    }
                    result = createTemplateTail(result);
                    break;
                case 2163760:
                    if ($optional) {
                        throw invalidTaggedTemplateOnOptionalChain();
                    }
                    result = parseTemplate(expressionType, result, true);
                    break;
            }
        }
    }
    if ($currentToken === 10 || $currentToken === 11) {
        throw expectedIdentifier();
    }
    if (513 < minPrecedence) {
        return result;
    }
    while (($currentToken & 262144) > 0) {
        const opToken = $currentToken;
        if ((opToken & 960) <= minPrecedence) {
            break;
        }
        nextToken();
        result = new BinaryExpression(TokenValues[opToken & 63], result, parse(opToken & 960, expressionType));
        $assignable = false;
    }
    if (63 < minPrecedence) {
        return result;
    }
    if (consumeOpt(6291478)) {
        const yes = parse(62, expressionType);
        consume(6291476);
        result = new ConditionalExpression(result, yes, parse(62, expressionType));
        $assignable = false;
    }
    if (62 < minPrecedence) {
        return result;
    }
    if (consumeOpt(4194349)) {
        if (!$assignable) {
            throw lhsNotAssignable();
        }
        result = new AssignExpression(result, parse(62, expressionType));
    }
    if (61 < minPrecedence) {
        return result;
    }
    while (consumeOpt(6291480)) {
        if ($currentToken === 6291456) {
            throw expectedValueConverterIdentifier();
        }
        const name = $tokenValue;
        nextToken();
        const args = new Array();
        while (consumeOpt(6291476)) {
            args.push(parse(62, expressionType));
        }
        result = new ValueConverterExpression(result, name, args);
    }
    while (consumeOpt(6291479)) {
        if ($currentToken === 6291456) {
            throw expectedBindingBehaviorIdentifier();
        }
        const name = $tokenValue;
        nextToken();
        const args = new Array();
        while (consumeOpt(6291476)) {
            args.push(parse(62, expressionType));
        }
        result = new BindingBehaviorExpression(result, name, args);
    }
    if ($currentToken !== 6291456) {
        if ((expressionType & 1) > 0 && $currentToken === 7340045) {
            return result;
        }
        if ((expressionType & 4) > 0 && $currentToken === 6291477) {
            if ($index === $length) {
                throw unconsumedToken();
            }
            $semicolonIndex = $index - 1;
            return result;
        }
        if ($tokenRaw() === 'of') {
            throw unexpectedOfKeyword();
        }
        throw unconsumedToken();
    }
    return result;
}
function parseArrayDestructuring() {
    const items = [];
    const dae = new DestructuringAssignmentExpression(24, items, void 0, void 0);
    let target = '';
    let $continue = true;
    let index = 0;
    while ($continue) {
        nextToken();
        switch ($currentToken) {
            case 7340051:
                $continue = false;
                addItem();
                break;
            case 6291471:
                addItem();
                break;
            case 4096:
                target = $tokenRaw();
                break;
            default:
                throw unexpectedTokenInDestructuring();
        }
    }
    consume(7340051);
    return dae;
    function addItem() {
        if (target !== '') {
            items.push(new DestructuringAssignmentSingleExpression(new AccessMemberExpression($this, target), new AccessKeyedExpression($this, new PrimitiveLiteralExpression(index++)), void 0));
            target = '';
        }
        else {
            index++;
        }
    }
}
function parseArguments() {
    const _optional = $optional;
    nextToken();
    const args = [];
    while ($currentToken !== 7340046) {
        args.push(parse(62, 0));
        if (!consumeOpt(6291471)) {
            break;
        }
    }
    consume(7340046);
    $assignable = false;
    $optional = _optional;
    return args;
}
function parseKeyedExpression(result, optional) {
    const _optional = $optional;
    nextToken();
    result = new AccessKeyedExpression(result, parse(62, 0), optional);
    consume(7340051);
    $assignable = !_optional;
    $optional = _optional;
    return result;
}
function parseOptionalChainLHS(lhs) {
    $optional = true;
    $assignable = false;
    nextToken();
    if (($currentToken & 13312) === 0) {
        throw unexpectedTokenInOptionalChain();
    }
    if ($currentToken & 12288) {
        return parseMemberExpressionLHS(lhs, true);
    }
    if ($currentToken === 2688007) {
        if (lhs.$kind === 1) {
            return new CallScopeExpression(lhs.name, parseArguments(), lhs.ancestor, true);
        }
        else if (lhs.$kind === 10) {
            return new CallMemberExpression(lhs.object, lhs.name, parseArguments(), lhs.optional, true);
        }
        else {
            return new CallFunctionExpression(lhs, parseArguments(), true);
        }
    }
    if ($currentToken === 2688016) {
        return parseKeyedExpression(lhs, true);
    }
    throw invalidTaggedTemplateOnOptionalChain();
}
function parseMemberExpressionLHS(lhs, optional) {
    const rhs = $tokenValue;
    switch ($currentToken) {
        case 2162700: {
            $optional = true;
            $assignable = false;
            const indexSave = $index;
            const startIndexSave = $startIndex;
            const currentTokenSave = $currentToken;
            const currentCharSave = $currentChar;
            const tokenValueSave = $tokenValue;
            const assignableSave = $assignable;
            const optionalSave = $optional;
            nextToken();
            if (($currentToken & 13312) === 0) {
                throw unexpectedTokenInOptionalChain();
            }
            if ($currentToken === 2688007) {
                return new CallMemberExpression(lhs, rhs, parseArguments(), optional, true);
            }
            $index = indexSave;
            $startIndex = startIndexSave;
            $currentToken = currentTokenSave;
            $currentChar = currentCharSave;
            $tokenValue = tokenValueSave;
            $assignable = assignableSave;
            $optional = optionalSave;
            return new AccessMemberExpression(lhs, rhs, optional);
        }
        case 2688007: {
            $assignable = false;
            return new CallMemberExpression(lhs, rhs, parseArguments(), optional, false);
        }
        default: {
            $assignable = !$optional;
            nextToken();
            return new AccessMemberExpression(lhs, rhs, optional);
        }
    }
}

function parseCoverParenthesizedExpressionAndArrowParameterList(expressionType) {
    nextToken();
    const indexSave = $index;
    const startIndexSave = $startIndex;
    const currentTokenSave = $currentToken;
    const currentCharSave = $currentChar;
    const tokenValueSave = $tokenValue;
    const assignableSave = $assignable;
    const optionalSave = $optional;
    const arrowParams = [];
    let paramsState = 1;
    let isParamList = false;
    loop: while (true) {
        if ($currentToken === 11) {
            nextToken();
            if ($currentToken !== 4096) {
                throw expectedIdentifier();
            }
            arrowParams.push(new BindingIdentifier($tokenValue));
            nextToken();
            if ($currentToken === 6291471) {
                throw restParamsMustBeLastParam();
            }
            if ($currentToken !== 7340046) {
                throw invalidSpreadOp();
            }
            nextToken();
            if ($currentToken !== 50) {
                throw invalidSpreadOp();
            }
            nextToken();
            const _optional = $optional;
            const _scopeDepth = $scopeDepth;
            ++$scopeDepth;
            const body = parse(62, 0);
            $optional = _optional;
            $scopeDepth = _scopeDepth;
            $assignable = false;
            return new ArrowFunction(arrowParams, body, true);
        }
        switch ($currentToken) {
            case 4096:
                arrowParams.push(new BindingIdentifier($tokenValue));
                nextToken();
                break;
            case 7340046:
                nextToken();
                break loop;
            case 524296:
            case 2688016:
                nextToken();
                paramsState = 4;
                break;
            case 6291471:
                paramsState = 2;
                isParamList = true;
                break loop;
            case 2688007:
                paramsState = 2;
                break loop;
            default:
                nextToken();
                paramsState = 2;
                break;
        }
        switch ($currentToken) {
            case 6291471:
                nextToken();
                isParamList = true;
                if (paramsState === 1) {
                    break;
                }
                break loop;
            case 7340046:
                nextToken();
                break loop;
            case 4194349:
                if (paramsState === 1) {
                    paramsState = 3;
                }
                break loop;
            case 50:
                if (isParamList) {
                    throw invalidArrowParameterList();
                }
                nextToken();
                paramsState = 2;
                break loop;
            default:
                if (paramsState === 1) {
                    paramsState = 2;
                }
                break loop;
        }
    }
    if ($currentToken === 50) {
        if (paramsState === 1) {
            nextToken();
            if ($currentToken === 524296) {
                throw functionBodyInArrowFN();
            }
            const _optional = $optional;
            const _scopeDepth = $scopeDepth;
            ++$scopeDepth;
            const body = parse(62, 0);
            $optional = _optional;
            $scopeDepth = _scopeDepth;
            $assignable = false;
            return new ArrowFunction(arrowParams, body);
        }
        throw invalidArrowParameterList();
    }
    else if (paramsState === 1 && arrowParams.length === 0) {
        throw missingExpectedToken(50);
    }
    if (isParamList) {
        switch (paramsState) {
            case 2:
                throw invalidArrowParameterList();
            case 3:
                throw defaultParamsInArrowFn();
            case 4:
                throw destructuringParamsInArrowFn();
        }
    }
    $index = indexSave;
    $startIndex = startIndexSave;
    $currentToken = currentTokenSave;
    $currentChar = currentCharSave;
    $tokenValue = tokenValueSave;
    $assignable = assignableSave;
    $optional = optionalSave;
    const _optional = $optional;
    const expr = parse(62, expressionType);
    $optional = _optional;
    consume(7340046);
    if ($currentToken === 50) {
        switch (paramsState) {
            case 2:
                throw invalidArrowParameterList();
            case 3:
                throw defaultParamsInArrowFn();
            case 4:
                throw destructuringParamsInArrowFn();
        }
    }
    return expr;
}
function parseArrayLiteralExpression(expressionType) {
    const _optional = $optional;
    nextToken();
    const elements = new Array();
    while ($currentToken !== 7340051) {
        if (consumeOpt(6291471)) {
            elements.push($undefined);
            if ($currentToken === 7340051) {
                break;
            }
        }
        else {
            elements.push(parse(62, expressionType & ~2));
            if (consumeOpt(6291471)) {
                if ($currentToken === 7340051) {
                    break;
                }
            }
            else {
                break;
            }
        }
    }
    $optional = _optional;
    consume(7340051);
    if (expressionType & 2) {
        return new ArrayBindingPattern(elements);
    }
    else {
        $assignable = false;
        return new ArrayLiteralExpression(elements);
    }
}
function parseForOfStatement(result) {
    if ((result.$kind & (19
        | 20
        | 21)) === 0) {
        throw invalidLHSBindingIdentifierInForOf();
    }
    if ($currentToken !== 4204593) {
        throw invalidLHSBindingIdentifierInForOf();
    }
    nextToken();
    const declaration = result;
    const statement = parse(61, 4);
    return new ForOfStatement(declaration, statement, $semicolonIndex);
}
function parseObjectLiteralExpression(expressionType) {
    const _optional = $optional;
    const keys = new Array();
    const values = new Array();
    nextToken();
    while ($currentToken !== 7340045) {
        keys.push($tokenValue);
        if ($currentToken & 49152) {
            nextToken();
            consume(6291476);
            values.push(parse(62, expressionType & ~2));
        }
        else if ($currentToken & 12288) {
            const currentChar = $currentChar;
            const currentToken = $currentToken;
            const index = $index;
            nextToken();
            if (consumeOpt(6291476)) {
                values.push(parse(62, expressionType & ~2));
            }
            else {
                $currentChar = currentChar;
                $currentToken = currentToken;
                $index = index;
                values.push(parse(515, expressionType & ~2));
            }
        }
        else {
            throw invalidPropDefInObjLiteral();
        }
        if ($currentToken !== 7340045) {
            consume(6291471);
        }
    }
    $optional = _optional;
    consume(7340045);
    if (expressionType & 2) {
        return new ObjectBindingPattern(keys, values);
    }
    else {
        $assignable = false;
        return new ObjectLiteralExpression(keys, values);
    }
}
function parseInterpolation() {
    const parts = [];
    const expressions = [];
    const length = $length;
    let result = '';
    while ($index < length) {
        switch ($currentChar) {
            case 36:
                if ($charCodeAt($index + 1) === 123) {
                    parts.push(result);
                    result = '';
                    $index += 2;
                    $currentChar = $charCodeAt($index);
                    nextToken();
                    const expression = parse(61, 1);
                    expressions.push(expression);
                    continue;
                }
                else {
                    result += '$';
                }
                break;
            case 92:
                result += stringFromCharCode(unescapeCode(nextChar()));
                break;
            default:
                result += stringFromCharCode($currentChar);
        }
        nextChar();
    }
    if (expressions.length) {
        parts.push(result);
        return new Interpolation(parts, expressions);
    }
    return null;
}
function parseTemplate(expressionType, result, tagged) {
    const _optional = $optional;
    const cooked = [$tokenValue];
    consume(2163760);
    const expressions = [parse(62, expressionType)];
    while (($currentToken = scanTemplateTail()) !== 2163759) {
        cooked.push($tokenValue);
        consume(2163760);
        expressions.push(parse(62, expressionType));
    }
    cooked.push($tokenValue);
    $assignable = false;
    $optional = _optional;
    if (tagged) {
        nextToken();
        return new TaggedTemplateExpression(cooked, cooked, result, expressions);
    }
    else {
        nextToken();
        return new TemplateExpression(cooked, expressions);
    }
}
function createTemplateTail(result) {
    $assignable = false;
    const strings = [$tokenValue];
    nextToken();
    return new TaggedTemplateExpression(strings, strings, result);
}
function nextToken() {
    while ($index < $length) {
        $startIndex = $index;
        if (($currentToken = (CharScanners[$currentChar]())) != null) {
            return;
        }
    }
    $currentToken = 6291456;
}
function nextChar() {
    return $currentChar = $charCodeAt(++$index);
}
function scanIdentifier() {
    while (IdParts[nextChar()])
        ;
    const token = KeywordLookup[$tokenValue = $tokenRaw()];
    return token === undefined ? 4096 : token;
}
function scanNumber(isFloat) {
    let char = $currentChar;
    if (isFloat === false) {
        do {
            char = nextChar();
        } while (char <= 57 && char >= 48);
        if (char !== 46) {
            $tokenValue = parseInt($tokenRaw(), 10);
            return 32768;
        }
        char = nextChar();
        if ($index >= $length) {
            $tokenValue = parseInt($tokenRaw().slice(0, -1), 10);
            return 32768;
        }
    }
    if (char <= 57 && char >= 48) {
        do {
            char = nextChar();
        } while (char <= 57 && char >= 48);
    }
    else {
        $currentChar = $charCodeAt(--$index);
    }
    $tokenValue = parseFloat($tokenRaw());
    return 32768;
}
function scanString() {
    const quote = $currentChar;
    nextChar();
    let unescaped = 0;
    const buffer = new Array();
    let marker = $index;
    while ($currentChar !== quote) {
        if ($currentChar === 92) {
            buffer.push($input.slice(marker, $index));
            nextChar();
            unescaped = unescapeCode($currentChar);
            nextChar();
            buffer.push(stringFromCharCode(unescaped));
            marker = $index;
        }
        else if ($index >= $length) {
            throw unterminatedStringLiteral();
        }
        else {
            nextChar();
        }
    }
    const last = $input.slice(marker, $index);
    nextChar();
    buffer.push(last);
    const unescapedStr = buffer.join('');
    $tokenValue = unescapedStr;
    return 16384;
}
function scanTemplate() {
    let tail = true;
    let result = '';
    while (nextChar() !== 96) {
        if ($currentChar === 36) {
            if (($index + 1) < $length && $charCodeAt($index + 1) === 123) {
                $index++;
                tail = false;
                break;
            }
            else {
                result += '$';
            }
        }
        else if ($currentChar === 92) {
            result += stringFromCharCode(unescapeCode(nextChar()));
        }
        else {
            if ($index >= $length) {
                throw unterminatedTemplateLiteral();
            }
            result += stringFromCharCode($currentChar);
        }
    }
    nextChar();
    $tokenValue = result;
    if (tail) {
        return 2163759;
    }
    return 2163760;
}
const scanTemplateTail = () => {
    if ($index >= $length) {
        throw unterminatedTemplateLiteral();
    }
    $index--;
    return scanTemplate();
};
const consumeOpt = (token) => {
    if ($currentToken === token) {
        nextToken();
        return true;
    }
    return false;
};
const consume = (token) => {
    if ($currentToken === token) {
        nextToken();
    }
    else {
        throw missingExpectedToken(token);
    }
};
const invalidStartOfExpression = () => {
    {
        return createError(`AUR0151: Invalid start of expression: '${$input}'`);
    }
};
const invalidSpreadOp = () => {
    {
        return createError(`AUR0152: Spread operator is not supported: '${$input}'`);
    }
};
const expectedIdentifier = () => {
    {
        return createError(`AUR0153: Expected identifier: '${$input}'`);
    }
};
const invalidMemberExpression = () => {
    {
        return createError(`AUR0154: Invalid member expression: '${$input}'`);
    }
};
const unexpectedEndOfExpression = () => {
    {
        return createError(`AUR0155: Unexpected end of expression: '${$input}'`);
    }
};
const unconsumedToken = () => {
    {
        return createError(`AUR0156: Unconsumed token: '${$tokenRaw()}' at position ${$index} of '${$input}'`);
    }
};
const invalidEmptyExpression = () => {
    {
        return createError(`AUR0157: Invalid expression. Empty expression is only valid in event bindings (trigger, delegate, capture etc...)`);
    }
};
const lhsNotAssignable = () => {
    {
        return createError(`AUR0158: Left hand side of expression is not assignable: '${$input}'`);
    }
};
const expectedValueConverterIdentifier = () => {
    {
        return createError(`AUR0159: Expected identifier to come after ValueConverter operator: '${$input}'`);
    }
};
const expectedBindingBehaviorIdentifier = () => {
    {
        return createError(`AUR0160: Expected identifier to come after BindingBehavior operator: '${$input}'`);
    }
};
const unexpectedOfKeyword = () => {
    {
        return createError(`AUR0161: Unexpected keyword "of": '${$input}'`);
    }
};
const invalidLHSBindingIdentifierInForOf = () => {
    {
        return createError(`AUR0163: Invalid BindingIdentifier at left hand side of "of": '${$input}'`);
    }
};
const invalidPropDefInObjLiteral = () => {
    {
        return createError(`AUR0164: Invalid or unsupported property definition in object literal: '${$input}'`);
    }
};
const unterminatedStringLiteral = () => {
    {
        return createError(`AUR0165: Unterminated quote in string literal: '${$input}'`);
    }
};
const unterminatedTemplateLiteral = () => {
    {
        return createError(`AUR0166: Unterminated template string: '${$input}'`);
    }
};
const missingExpectedToken = (token) => {
    {
        return createError(`AUR0167: Missing expected token '${TokenValues[token & 63]}' in '${$input}' `);
    }
};
const unexpectedCharacter = () => {
    {
        throw createError(`AUR0168: Unexpected character: '${$input}'`);
    }
};
unexpectedCharacter.notMapped = true;
const unexpectedTokenInDestructuring = () => {
    {
        return createError(`AUR0170: Unexpected '${$tokenRaw()}' at position ${$index - 1} for destructuring assignment in ${$input}`);
    }
};
const unexpectedTokenInOptionalChain = () => {
    {
        return createError(`AUR0171: Unexpected '${$tokenRaw()}' at position ${$index - 1} for optional chain in ${$input}`);
    }
};
const invalidTaggedTemplateOnOptionalChain = () => {
    {
        return createError(`AUR0172: Invalid tagged template on optional chain in ${$input}`);
    }
};
const invalidArrowParameterList = () => {
    {
        return createError(`AUR0173: Invalid arrow parameter list in ${$input}`);
    }
};
const defaultParamsInArrowFn = () => {
    {
        return createError(`AUR0174: Arrow function with default parameters is not supported: ${$input}`);
    }
};
const destructuringParamsInArrowFn = () => {
    {
        return createError(`AUR0175: Arrow function with destructuring parameters is not supported: ${$input}`);
    }
};
const restParamsMustBeLastParam = () => {
    {
        return createError(`AUR0176: Rest parameter must be last formal parameter in arrow function: ${$input}`);
    }
};
const functionBodyInArrowFN = () => {
    {
        return createError(`AUR0178: Arrow function with function body is not supported: ${$input}`);
    }
};
const unexpectedDoubleDot = () => {
    {
        return createError(`AUR0179: Unexpected token '.' at position ${$index - 1} in ${$input}`);
    }
};
const TokenValues = [
    $false, $true, $null, $undefined, '$this', null, '$parent',
    '(', '{', '.', '..', '...', '?.', '}', ')', ',', '[', ']', ':', ';', '?', '\'', '"',
    '&', '|', '??', '||', '&&', '==', '!=', '===', '!==', '<', '>',
    '<=', '>=', 'in', 'instanceof', '+', '-', 'typeof', 'void', '*', '%', '/', '=', '!',
    2163759, 2163760,
    'of', '=>'
];
const KeywordLookup = Object.assign(Object.create(null), {
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
    of: 4204593,
});
const codes = {
    AsciiIdPart: [0x24, 0, 0x30, 0x3A, 0x41, 0x5B, 0x5F, 0, 0x61, 0x7B],
    IdStart: [0x24, 0, 0x41, 0x5B, 0x5F, 0, 0x61, 0x7B, 0xAA, 0, 0xBA, 0, 0xC0, 0xD7, 0xD8, 0xF7, 0xF8, 0x2B9, 0x2E0, 0x2E5, 0x1D00, 0x1D26, 0x1D2C, 0x1D5D, 0x1D62, 0x1D66, 0x1D6B, 0x1D78, 0x1D79, 0x1DBF, 0x1E00, 0x1F00, 0x2071, 0, 0x207F, 0, 0x2090, 0x209D, 0x212A, 0x212C, 0x2132, 0, 0x214E, 0, 0x2160, 0x2189, 0x2C60, 0x2C80, 0xA722, 0xA788, 0xA78B, 0xA7AF, 0xA7B0, 0xA7B8, 0xA7F7, 0xA800, 0xAB30, 0xAB5B, 0xAB5C, 0xAB65, 0xFB00, 0xFB07, 0xFF21, 0xFF3B, 0xFF41, 0xFF5B],
    Digit: [0x30, 0x3A],
    Skip: [0, 0x21, 0x7F, 0xA1]
};
const decompress = (lookup, $set, compressed, value) => {
    const rangeCount = compressed.length;
    for (let i = 0; i < rangeCount; i += 2) {
        const start = compressed[i];
        let end = compressed[i + 1];
        end = end > 0 ? end : start + 1;
        if (lookup) {
            lookup.fill(value, start, end);
        }
        if ($set) {
            for (let ch = start; ch < end; ch++) {
                $set.add(ch);
            }
        }
    }
};
const returnToken = (token) => () => {
    nextChar();
    return token;
};
const AsciiIdParts = new Set();
decompress(null, AsciiIdParts, codes.AsciiIdPart, true);
const IdParts = new Uint8Array(0xFFFF);
decompress(IdParts, null, codes.IdStart, 1);
decompress(IdParts, null, codes.Digit, 1);
const CharScanners = new Array(0xFFFF);
CharScanners.fill(unexpectedCharacter, 0, 0xFFFF);
decompress(CharScanners, null, codes.Skip, () => {
    nextChar();
    return null;
});
decompress(CharScanners, null, codes.IdStart, scanIdentifier);
decompress(CharScanners, null, codes.Digit, () => scanNumber(false));
CharScanners[34] =
    CharScanners[39] = () => {
        return scanString();
    };
CharScanners[96] = () => {
    return scanTemplate();
};
CharScanners[33] = () => {
    if (nextChar() !== 61) {
        return 131118;
    }
    if (nextChar() !== 61) {
        return 6553949;
    }
    nextChar();
    return 6553951;
};
CharScanners[61] = () => {
    if (nextChar() === 62) {
        nextChar();
        return 50;
    }
    if ($currentChar !== 61) {
        return 4194349;
    }
    if (nextChar() !== 61) {
        return 6553948;
    }
    nextChar();
    return 6553950;
};
CharScanners[38] = () => {
    if (nextChar() !== 38) {
        return 6291479;
    }
    nextChar();
    return 6553883;
};
CharScanners[124] = () => {
    if (nextChar() !== 124) {
        return 6291480;
    }
    nextChar();
    return 6553818;
};
CharScanners[63] = () => {
    if (nextChar() === 46) {
        const peek = $charCodeAt($index + 1);
        if (peek <= 48 || peek >= 57) {
            nextChar();
            return 2162700;
        }
        return 6291478;
    }
    if ($currentChar !== 63) {
        return 6291478;
    }
    nextChar();
    return 6553753;
};
CharScanners[46] = () => {
    if (nextChar() <= 57 && $currentChar >= 48) {
        return scanNumber(true);
    }
    if ($currentChar === 46) {
        if (nextChar() !== 46) {
            return 10;
        }
        nextChar();
        return 11;
    }
    return 65545;
};
CharScanners[60] = () => {
    if (nextChar() !== 61) {
        return 6554016;
    }
    nextChar();
    return 6554018;
};
CharScanners[62] = () => {
    if (nextChar() !== 61) {
        return 6554017;
    }
    nextChar();
    return 6554019;
};
CharScanners[37] = returnToken(6554155);
CharScanners[40] = returnToken(2688007);
CharScanners[41] = returnToken(7340046);
CharScanners[42] = returnToken(6554154);
CharScanners[43] = returnToken(2490854);
CharScanners[44] = returnToken(6291471);
CharScanners[45] = returnToken(2490855);
CharScanners[47] = returnToken(6554156);
CharScanners[58] = returnToken(6291476);
CharScanners[59] = returnToken(6291477);
CharScanners[91] = returnToken(2688016);
CharScanners[93] = returnToken(7340051);
CharScanners[123] = returnToken(524296);
CharScanners[125] = returnToken(7340045);

let _connectable = null;
const connectables = [];
let connecting = false;
function pauseConnecting() {
    connecting = false;
}
function resumeConnecting() {
    connecting = true;
}
function currentConnectable() {
    return _connectable;
}
function enterConnectable(connectable) {
    if (connectable == null) {
        throw createError(`AUR0206: Connectable cannot be null/undefined`);
    }
    if (_connectable == null) {
        _connectable = connectable;
        connectables[0] = _connectable;
        connecting = true;
        return;
    }
    if (_connectable === connectable) {
        throw createError(`AUR0207: Trying to enter an active connectable`);
    }
    connectables.push(connectable);
    _connectable = connectable;
    connecting = true;
}
function exitConnectable(connectable) {
    if (connectable == null) {
        throw createError(`AUR0208: Connectable cannot be null/undefined`);
    }
    if (_connectable !== connectable) {
        throw createError(`AUR0209: Trying to exit an unactive connectable`);
    }
    connectables.pop();
    _connectable = connectables.length > 0 ? connectables[connectables.length - 1] : null;
    connecting = _connectable != null;
}
const ConnectableSwitcher = Object.freeze({
    get current() {
        return _connectable;
    },
    get connecting() {
        return connecting;
    },
    enter: enterConnectable,
    exit: exitConnectable,
    pause: pauseConnecting,
    resume: resumeConnecting,
});

const R$get = Reflect.get;
const toStringTag = Object.prototype.toString;
const proxyMap = new WeakMap();
function canWrap(obj) {
    switch (toStringTag.call(obj)) {
        case '[object Object]':
        case '[object Array]':
        case '[object Map]':
        case '[object Set]':
            return true;
        default:
            return false;
    }
}
const rawKey = '__raw__';
function wrap(v) {
    return canWrap(v) ? getProxy(v) : v;
}
function getProxy(obj) {
    return proxyMap.get(obj) ?? createProxy(obj);
}
function getRaw(obj) {
    return obj[rawKey] ?? obj;
}
function unwrap(v) {
    return canWrap(v) && v[rawKey] || v;
}
function doNotCollect(key) {
    return key === 'constructor'
        || key === '__proto__'
        || key === '$observers'
        || key === Symbol.toPrimitive
        || key === Symbol.toStringTag;
}
function createProxy(obj) {
    const handler = isArray(obj)
        ? arrayHandler
        : isMap(obj) || isSet(obj)
            ? collectionHandler
            : objectHandler;
    const proxiedObj = new Proxy(obj, handler);
    proxyMap.set(obj, proxiedObj);
    return proxiedObj;
}
const objectHandler = {
    get(target, key, receiver) {
        if (key === rawKey) {
            return target;
        }
        const connectable = currentConnectable();
        if (!connecting || doNotCollect(key) || connectable == null) {
            return R$get(target, key, receiver);
        }
        connectable.observe(target, key);
        return wrap(R$get(target, key, receiver));
    },
};
const arrayHandler = {
    get(target, key, receiver) {
        if (key === rawKey) {
            return target;
        }
        if (!connecting || doNotCollect(key) || _connectable == null) {
            return R$get(target, key, receiver);
        }
        switch (key) {
            case 'length':
                _connectable.observe(target, 'length');
                return target.length;
            case 'map':
                return wrappedArrayMap;
            case 'includes':
                return wrappedArrayIncludes;
            case 'indexOf':
                return wrappedArrayIndexOf;
            case 'lastIndexOf':
                return wrappedArrayLastIndexOf;
            case 'every':
                return wrappedArrayEvery;
            case 'filter':
                return wrappedArrayFilter;
            case 'find':
                return wrappedArrayFind;
            case 'findIndex':
                return wrappedArrayFindIndex;
            case 'flat':
                return wrappedArrayFlat;
            case 'flatMap':
                return wrappedArrayFlatMap;
            case 'join':
                return wrappedArrayJoin;
            case 'push':
                return wrappedArrayPush;
            case 'pop':
                return wrappedArrayPop;
            case 'reduce':
                return wrappedReduce;
            case 'reduceRight':
                return wrappedReduceRight;
            case 'reverse':
                return wrappedArrayReverse;
            case 'shift':
                return wrappedArrayShift;
            case 'unshift':
                return wrappedArrayUnshift;
            case 'slice':
                return wrappedArraySlice;
            case 'splice':
                return wrappedArraySplice;
            case 'some':
                return wrappedArraySome;
            case 'sort':
                return wrappedArraySort;
            case 'keys':
                return wrappedKeys;
            case 'values':
            case Symbol.iterator:
                return wrappedValues;
            case 'entries':
                return wrappedEntries;
        }
        _connectable.observe(target, key);
        return wrap(R$get(target, key, receiver));
    },
    ownKeys(target) {
        currentConnectable()?.observe(target, 'length');
        return Reflect.ownKeys(target);
    },
};
function wrappedArrayMap(cb, thisArg) {
    const raw = getRaw(this);
    const res = raw.map((v, i) => unwrap(cb.call(thisArg, wrap(v), i, this)));
    observeCollection(_connectable, raw);
    return wrap(res);
}
function wrappedArrayEvery(cb, thisArg) {
    const raw = getRaw(this);
    const res = raw.every((v, i) => cb.call(thisArg, wrap(v), i, this));
    observeCollection(_connectable, raw);
    return res;
}
function wrappedArrayFilter(cb, thisArg) {
    const raw = getRaw(this);
    const res = raw.filter((v, i) => unwrap(cb.call(thisArg, wrap(v), i, this)));
    observeCollection(_connectable, raw);
    return wrap(res);
}
function wrappedArrayIncludes(v) {
    const raw = getRaw(this);
    const res = raw.includes(unwrap(v));
    observeCollection(_connectable, raw);
    return res;
}
function wrappedArrayIndexOf(v) {
    const raw = getRaw(this);
    const res = raw.indexOf(unwrap(v));
    observeCollection(_connectable, raw);
    return res;
}
function wrappedArrayLastIndexOf(v) {
    const raw = getRaw(this);
    const res = raw.lastIndexOf(unwrap(v));
    observeCollection(_connectable, raw);
    return res;
}
function wrappedArrayFindIndex(cb, thisArg) {
    const raw = getRaw(this);
    const res = raw.findIndex((v, i) => unwrap(cb.call(thisArg, wrap(v), i, this)));
    observeCollection(_connectable, raw);
    return res;
}
function wrappedArrayFind(cb, thisArg) {
    const raw = getRaw(this);
    const res = raw.find((v, i) => cb(wrap(v), i, this), thisArg);
    observeCollection(_connectable, raw);
    return wrap(res);
}
function wrappedArrayFlat() {
    const raw = getRaw(this);
    observeCollection(_connectable, raw);
    return wrap(raw.flat());
}
function wrappedArrayFlatMap(cb, thisArg) {
    const raw = getRaw(this);
    observeCollection(_connectable, raw);
    return getProxy(raw.flatMap((v, i) => wrap(cb.call(thisArg, wrap(v), i, this))));
}
function wrappedArrayJoin(separator) {
    const raw = getRaw(this);
    observeCollection(_connectable, raw);
    return raw.join(separator);
}
function wrappedArrayPop() {
    return wrap(getRaw(this).pop());
}
function wrappedArrayPush(...args) {
    return getRaw(this).push(...args);
}
function wrappedArrayShift() {
    return wrap(getRaw(this).shift());
}
function wrappedArrayUnshift(...args) {
    return getRaw(this).unshift(...args);
}
function wrappedArraySplice(...args) {
    return wrap(getRaw(this).splice(...args));
}
function wrappedArrayReverse(..._args) {
    const raw = getRaw(this);
    const res = raw.reverse();
    observeCollection(_connectable, raw);
    return wrap(res);
}
function wrappedArraySome(cb, thisArg) {
    const raw = getRaw(this);
    const res = raw.some((v, i) => unwrap(cb.call(thisArg, wrap(v), i, this)));
    observeCollection(_connectable, raw);
    return res;
}
function wrappedArraySort(cb) {
    const raw = getRaw(this);
    const res = raw.sort(cb);
    observeCollection(_connectable, raw);
    return wrap(res);
}
function wrappedArraySlice(start, end) {
    const raw = getRaw(this);
    observeCollection(_connectable, raw);
    return getProxy(raw.slice(start, end));
}
function wrappedReduce(cb, initValue) {
    const raw = getRaw(this);
    const res = raw.reduce((curr, v, i) => cb(curr, wrap(v), i, this), initValue);
    observeCollection(_connectable, raw);
    return wrap(res);
}
function wrappedReduceRight(cb, initValue) {
    const raw = getRaw(this);
    const res = raw.reduceRight((curr, v, i) => cb(curr, wrap(v), i, this), initValue);
    observeCollection(_connectable, raw);
    return wrap(res);
}
const collectionHandler = {
    get(target, key, receiver) {
        if (key === rawKey) {
            return target;
        }
        const connectable = currentConnectable();
        if (!connecting || doNotCollect(key) || connectable == null) {
            return R$get(target, key, receiver);
        }
        switch (key) {
            case 'size':
                connectable.observe(target, 'size');
                return target.size;
            case 'clear':
                return wrappedClear;
            case 'delete':
                return wrappedDelete;
            case 'forEach':
                return wrappedForEach;
            case 'add':
                if (isSet(target)) {
                    return wrappedAdd;
                }
                break;
            case 'get':
                if (isMap(target)) {
                    return wrappedGet;
                }
                break;
            case 'set':
                if (isMap(target)) {
                    return wrappedSet;
                }
                break;
            case 'has':
                return wrappedHas;
            case 'keys':
                return wrappedKeys;
            case 'values':
                return wrappedValues;
            case 'entries':
                return wrappedEntries;
            case Symbol.iterator:
                return isMap(target) ? wrappedEntries : wrappedValues;
        }
        return wrap(R$get(target, key, receiver));
    },
};
function wrappedForEach(cb, thisArg) {
    const raw = getRaw(this);
    observeCollection(_connectable, raw);
    return raw.forEach((v, key) => {
        cb.call(thisArg, wrap(v), wrap(key), this);
    });
}
function wrappedHas(v) {
    const raw = getRaw(this);
    observeCollection(_connectable, raw);
    return raw.has(unwrap(v));
}
function wrappedGet(k) {
    const raw = getRaw(this);
    observeCollection(_connectable, raw);
    return wrap(raw.get(unwrap(k)));
}
function wrappedSet(k, v) {
    return wrap(getRaw(this).set(unwrap(k), unwrap(v)));
}
function wrappedAdd(v) {
    return wrap(getRaw(this).add(unwrap(v)));
}
function wrappedClear() {
    return wrap(getRaw(this).clear());
}
function wrappedDelete(k) {
    return wrap(getRaw(this).delete(unwrap(k)));
}
function wrappedKeys() {
    const raw = getRaw(this);
    observeCollection(_connectable, raw);
    const iterator = raw.keys();
    return {
        next() {
            const next = iterator.next();
            const value = next.value;
            const done = next.done;
            return done
                ? { value: void 0, done }
                : { value: wrap(value), done };
        },
        [Symbol.iterator]() {
            return this;
        },
    };
}
function wrappedValues() {
    const raw = getRaw(this);
    observeCollection(_connectable, raw);
    const iterator = raw.values();
    return {
        next() {
            const next = iterator.next();
            const value = next.value;
            const done = next.done;
            return done
                ? { value: void 0, done }
                : { value: wrap(value), done };
        },
        [Symbol.iterator]() {
            return this;
        },
    };
}
function wrappedEntries() {
    const raw = getRaw(this);
    observeCollection(_connectable, raw);
    const iterator = raw.entries();
    return {
        next() {
            const next = iterator.next();
            const value = next.value;
            const done = next.done;
            return done
                ? { value: void 0, done }
                : { value: [wrap(value[0]), wrap(value[1])], done };
        },
        [Symbol.iterator]() {
            return this;
        },
    };
}
const observeCollection = (connectable, collection) => connectable?.observeCollection(collection);
const ProxyObservable = Object.freeze({
    getProxy,
    getRaw,
    wrap,
    unwrap,
    rawKey,
});

class ComputedObserver {
    constructor(obj, get, set, useProxy, observerLocator) {
        this.type = 1;
        this._value = void 0;
        this._oldValue = void 0;
        this._isRunning = false;
        this._isDirty = false;
        this._obj = obj;
        this.$get = get;
        this.$set = set;
        this._useProxy = useProxy;
        this.oL = observerLocator;
    }
    static create(obj, key, descriptor, observerLocator, useProxy) {
        const getter = descriptor.get;
        const setter = descriptor.set;
        const observer = new ComputedObserver(obj, getter, setter, useProxy, observerLocator);
        const $get = (() => observer.getValue());
        $get.getObserver = () => observer;
        def(obj, key, {
            enumerable: descriptor.enumerable,
            configurable: true,
            get: $get,
            set: (v) => {
                observer.setValue(v);
            },
        });
        return observer;
    }
    getValue() {
        if (this.subs.count === 0) {
            return this.$get.call(this._obj, this);
        }
        if (this._isDirty) {
            this.compute();
            this._isDirty = false;
        }
        return this._value;
    }
    setValue(v) {
        if (isFunction(this.$set)) {
            if (v !== this._value) {
                this._isRunning = true;
                this.$set.call(this._obj, v);
                this._isRunning = false;
                this.run();
            }
        }
        else {
            throw createError(`AUR0221: Property is readonly`);
        }
    }
    handleChange() {
        this._isDirty = true;
        if (this.subs.count > 0) {
            this.run();
        }
    }
    handleCollectionChange() {
        this._isDirty = true;
        if (this.subs.count > 0) {
            this.run();
        }
    }
    subscribe(subscriber) {
        if (this.subs.add(subscriber) && this.subs.count === 1) {
            this.compute();
            this._isDirty = false;
        }
    }
    unsubscribe(subscriber) {
        if (this.subs.remove(subscriber) && this.subs.count === 0) {
            this._isDirty = true;
            this.obs.clearAll();
        }
    }
    run() {
        if (this._isRunning) {
            return;
        }
        const oldValue = this._value;
        const newValue = this.compute();
        this._isDirty = false;
        if (!areEqual(newValue, oldValue)) {
            this._oldValue = oldValue;
            oV$1 = this._oldValue;
            this._oldValue = this._value;
            this.subs.notify(this._value, oV$1);
        }
    }
    compute() {
        this._isRunning = true;
        this.obs.version++;
        try {
            enterConnectable(this);
            return this._value = unwrap(this.$get.call(this._useProxy ? wrap(this._obj) : this._obj, this));
        }
        finally {
            this.obs.clear();
            this._isRunning = false;
            exitConnectable(this);
        }
    }
}
connectable(ComputedObserver);
subscriberCollection(ComputedObserver);
let oV$1 = void 0;

const IDirtyChecker = createInterface('IDirtyChecker', x => x.singleton(DirtyChecker));
const DirtyCheckSettings = {
    timeoutsPerCheck: 25,
    disabled: false,
    throw: false,
    resetToDefault() {
        this.timeoutsPerCheck = 6;
        this.disabled = false;
        this.throw = false;
    }
};
const queueTaskOpts = {
    persistent: true,
};
class DirtyChecker {
    constructor(p) {
        this.p = p;
        this.tracked = [];
        this._task = null;
        this._elapsedFrames = 0;
        this.check = () => {
            if (DirtyCheckSettings.disabled) {
                return;
            }
            if (++this._elapsedFrames < DirtyCheckSettings.timeoutsPerCheck) {
                return;
            }
            this._elapsedFrames = 0;
            const tracked = this.tracked;
            const len = tracked.length;
            let current;
            let i = 0;
            for (; i < len; ++i) {
                current = tracked[i];
                if (current.isDirty()) {
                    current.flush();
                }
            }
        };
    }
    createProperty(obj, key) {
        if (DirtyCheckSettings.throw) {
            throw createError(`AUR0222: Property '${safeString(key)}' is being dirty-checked.`);
        }
        return new DirtyCheckProperty(this, obj, key);
    }
    addProperty(property) {
        this.tracked.push(property);
        if (this.tracked.length === 1) {
            this._task = this.p.taskQueue.queueTask(this.check, queueTaskOpts);
        }
    }
    removeProperty(property) {
        this.tracked.splice(this.tracked.indexOf(property), 1);
        if (this.tracked.length === 0) {
            this._task.cancel();
            this._task = null;
        }
    }
}
DirtyChecker.inject = [kernel.IPlatform];
class DirtyCheckProperty {
    constructor(dirtyChecker, obj, key) {
        this.obj = obj;
        this.key = key;
        this.type = 0;
        this._oldValue = void 0;
        this._dirtyChecker = dirtyChecker;
    }
    getValue() {
        return this.obj[this.key];
    }
    setValue(_v) {
        throw createError(`Trying to set value for property ${safeString(this.key)} in dirty checker`);
    }
    isDirty() {
        return this._oldValue !== this.obj[this.key];
    }
    flush() {
        const oldValue = this._oldValue;
        const newValue = this.getValue();
        this._oldValue = newValue;
        this.subs.notify(newValue, oldValue);
    }
    subscribe(subscriber) {
        if (this.subs.add(subscriber) && this.subs.count === 1) {
            this._oldValue = this.obj[this.key];
            this._dirtyChecker.addProperty(this);
        }
    }
    unsubscribe(subscriber) {
        if (this.subs.remove(subscriber) && this.subs.count === 0) {
            this._dirtyChecker.removeProperty(this);
        }
    }
}
subscriberCollection(DirtyCheckProperty);

class PrimitiveObserver {
    constructor(obj, key) {
        this.type = 0;
        this._obj = obj;
        this._key = key;
    }
    get doNotCache() { return true; }
    getValue() {
        return this._obj[this._key];
    }
    setValue() { }
    subscribe() { }
    unsubscribe() { }
}

class PropertyAccessor {
    constructor() {
        this.type = 0;
    }
    getValue(obj, key) {
        return obj[key];
    }
    setValue(value, obj, key) {
        obj[key] = value;
    }
}

class SetterObserver {
    constructor(obj, key) {
        this.type = 1;
        this._value = void 0;
        this._observing = false;
        this._obj = obj;
        this._key = key;
    }
    getValue() {
        return this._value;
    }
    setValue(newValue) {
        if (this._observing) {
            if (areEqual(newValue, this._value)) {
                return;
            }
            oV = this._value;
            this._value = newValue;
            this.subs.notify(newValue, oV);
        }
        else {
            this._obj[this._key] = newValue;
        }
    }
    subscribe(subscriber) {
        if (this._observing === false) {
            this.start();
        }
        this.subs.add(subscriber);
    }
    start() {
        if (this._observing === false) {
            this._observing = true;
            this._value = this._obj[this._key];
            def(this._obj, this._key, {
                enumerable: true,
                configurable: true,
                get: () => this.getValue(),
                set: (value) => {
                    this.setValue(value);
                },
            });
        }
        return this;
    }
    stop() {
        if (this._observing) {
            def(this._obj, this._key, {
                enumerable: true,
                configurable: true,
                writable: true,
                value: this._value,
            });
            this._observing = false;
        }
        return this;
    }
}
class SetterNotifier {
    constructor(obj, callbackKey, set, initialValue) {
        this.type = 1;
        this._value = void 0;
        this._oldValue = void 0;
        this._obj = obj;
        this._setter = set;
        this._hasSetter = isFunction(set);
        const callback = obj[callbackKey];
        this.cb = isFunction(callback) ? callback : void 0;
        this._value = initialValue;
    }
    getValue() {
        return this._value;
    }
    setValue(value) {
        if (this._hasSetter) {
            value = this._setter(value, null);
        }
        if (!areEqual(value, this._value)) {
            this._oldValue = this._value;
            this._value = value;
            this.cb?.call(this._obj, this._value, this._oldValue);
            oV = this._oldValue;
            this._oldValue = this._value;
            this.subs.notify(this._value, oV);
        }
    }
}
subscriberCollection(SetterObserver);
subscriberCollection(SetterNotifier);
let oV = void 0;

const propertyAccessor = new PropertyAccessor();
const IObserverLocator = createInterface('IObserverLocator', x => x.singleton(ObserverLocator));
const INodeObserverLocator = createInterface('INodeObserverLocator', x => x.cachedCallback(handler => {
    {
        handler.getAll(kernel.ILogger).forEach(logger => {
            logger.error('Using default INodeObserverLocator implementation. Will not be able to observe nodes (HTML etc...).');
        });
    }
    return new DefaultNodeObserverLocator();
}));
class DefaultNodeObserverLocator {
    handles() {
        return false;
    }
    getObserver() {
        return propertyAccessor;
    }
    getAccessor() {
        return propertyAccessor;
    }
}
class ObserverLocator {
    constructor(dirtyChecker, nodeObserverLocator) {
        this._adapters = [];
        this._dirtyChecker = dirtyChecker;
        this._nodeObserverLocator = nodeObserverLocator;
    }
    addAdapter(adapter) {
        this._adapters.push(adapter);
    }
    getObserver(obj, key) {
        if (obj == null) {
            throw nullObjectError(key);
        }
        if (!isObject(obj)) {
            return new PrimitiveObserver(obj, key);
        }
        const lookup = getObserverLookup(obj);
        let observer = lookup[key];
        if (observer === void 0) {
            observer = this.createObserver(obj, key);
            if (!observer.doNotCache) {
                lookup[key] = observer;
            }
        }
        return observer;
    }
    getAccessor(obj, key) {
        const cached = obj.$observers?.[key];
        if (cached !== void 0) {
            return cached;
        }
        if (this._nodeObserverLocator.handles(obj, key, this)) {
            return this._nodeObserverLocator.getAccessor(obj, key, this);
        }
        return propertyAccessor;
    }
    getArrayObserver(observedArray) {
        return getArrayObserver(observedArray);
    }
    getMapObserver(observedMap) {
        return getMapObserver(observedMap);
    }
    getSetObserver(observedSet) {
        return getSetObserver(observedSet);
    }
    createObserver(obj, key) {
        if (this._nodeObserverLocator.handles(obj, key, this)) {
            return this._nodeObserverLocator.getObserver(obj, key, this);
        }
        switch (key) {
            case 'length':
                if (isArray(obj)) {
                    return getArrayObserver(obj).getLengthObserver();
                }
                break;
            case 'size':
                if (isMap(obj)) {
                    return getMapObserver(obj).getLengthObserver();
                }
                else if (isSet(obj)) {
                    return getSetObserver(obj).getLengthObserver();
                }
                break;
            default:
                if (isArray(obj) && kernel.isArrayIndex(key)) {
                    return getArrayObserver(obj).getIndexObserver(Number(key));
                }
                break;
        }
        let pd = getOwnPropDesc(obj, key);
        if (pd === void 0) {
            let proto = getProto(obj);
            while (proto !== null) {
                pd = getOwnPropDesc(proto, key);
                if (pd === void 0) {
                    proto = getProto(proto);
                }
                else {
                    break;
                }
            }
        }
        if (pd !== void 0 && !hasOwnProp.call(pd, 'value')) {
            let obs = this._getAdapterObserver(obj, key, pd);
            if (obs == null) {
                obs = (pd.get?.getObserver ?? pd.set?.getObserver)?.(obj, this);
            }
            return obs == null
                ? pd.configurable
                    ? ComputedObserver.create(obj, key, pd, this, true)
                    : this._dirtyChecker.createProperty(obj, key)
                : obs;
        }
        return new SetterObserver(obj, key);
    }
    _getAdapterObserver(obj, key, pd) {
        if (this._adapters.length > 0) {
            for (const adapter of this._adapters) {
                const observer = adapter.getObserver(obj, key, pd, this);
                if (observer != null) {
                    return observer;
                }
            }
        }
        return null;
    }
}
ObserverLocator.inject = [IDirtyChecker, INodeObserverLocator];
const getCollectionObserver = (collection) => {
    let obs;
    if (isArray(collection)) {
        obs = getArrayObserver(collection);
    }
    else if (isMap(collection)) {
        obs = getMapObserver(collection);
    }
    else if (isSet(collection)) {
        obs = getSetObserver(collection);
    }
    return obs;
};
const getProto = Object.getPrototypeOf;
const getOwnPropDesc = Object.getOwnPropertyDescriptor;
const getObserverLookup = (instance) => {
    let lookup = instance.$observers;
    if (lookup === void 0) {
        def(instance, '$observers', {
            enumerable: false,
            value: lookup = createLookup(),
        });
    }
    return lookup;
};
const nullObjectError = (key) => createError(`AUR0199: trying to observe property ${safeString(key)} on null/undefined`)
    ;

const IObservation = createInterface('IObservation', x => x.singleton(Observation));
class Observation {
    constructor(oL) {
        this.oL = oL;
    }
    static get inject() { return [IObserverLocator]; }
    run(fn) {
        const effect = new Effect(this.oL, fn);
        effect.run();
        return effect;
    }
}
class Effect {
    constructor(oL, fn) {
        this.oL = oL;
        this.fn = fn;
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
            throw createError(`AUR0225: Effect has already been stopped`);
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
        }
        finally {
            this.obs.clear();
            this.running = false;
            exitConnectable(this);
        }
        if (this.queued) {
            if (this.runCount > this.maxRunCount) {
                this.runCount = 0;
                throw createError(`AUR0226: Maximum number of recursive effect run reached. Consider handle effect dependencies differently.`);
            }
            this.run();
        }
        else {
            this.runCount = 0;
        }
    }
    stop() {
        this.stopped = true;
        this.obs.clearAll();
    }
}
connectable(Effect);

function getObserversLookup(obj) {
    if (obj.$observers === void 0) {
        def(obj, '$observers', { value: {} });
    }
    return obj.$observers;
}
const noValue = {};
function observable(targetOrConfig, key, descriptor) {
    if (key == null) {
        return ((t, k, d) => deco(t, k, d, targetOrConfig));
    }
    return deco(targetOrConfig, key, descriptor);
    function deco(target, key, descriptor, config) {
        const isClassDecorator = key === void 0;
        config = typeof config !== 'object'
            ? { name: config }
            : (config || {});
        if (isClassDecorator) {
            key = config.name;
        }
        if (key == null || key === '') {
            throw createError(`AUR0224: Invalid usage, cannot determine property name for @observable`);
        }
        const callback = config.callback || `${safeString(key)}Changed`;
        let initialValue = noValue;
        if (descriptor) {
            delete descriptor.value;
            delete descriptor.writable;
            initialValue = descriptor.initializer?.();
            delete descriptor.initializer;
        }
        else {
            descriptor = { configurable: true };
        }
        if (!('enumerable' in descriptor)) {
            descriptor.enumerable = true;
        }
        const $set = config.set;
        descriptor.get = function g() {
            const notifier = getNotifier(this, key, callback, initialValue, $set);
            currentConnectable()?.subscribeTo(notifier);
            return notifier.getValue();
        };
        descriptor.set = function s(newValue) {
            getNotifier(this, key, callback, initialValue, $set).setValue(newValue);
        };
        descriptor.get.getObserver = function gO(obj) {
            return getNotifier(obj, key, callback, initialValue, $set);
        };
        if (isClassDecorator) {
            def(target.prototype, key, descriptor);
        }
        else {
            return descriptor;
        }
    }
}
function getNotifier(obj, key, callbackKey, initialValue, set) {
    const lookup = getObserversLookup(obj);
    let notifier = lookup[key];
    if (notifier == null) {
        notifier = new SetterNotifier(obj, callbackKey, set, initialValue === noValue ? void 0 : initialValue);
        lookup[key] = notifier;
    }
    return notifier;
}

const ISignaler = createInterface('ISignaler', x => x.singleton(Signaler));
class Signaler {
    constructor() {
        this.signals = createLookup();
    }
    dispatchSignal(name) {
        const listeners = this.signals[name];
        if (listeners === undefined) {
            return;
        }
        let listener;
        for (listener of listeners.keys()) {
            listener.handleChange(undefined, undefined);
        }
    }
    addSignalListener(name, listener) {
        const signals = this.signals;
        const listeners = signals[name];
        if (listeners === undefined) {
            signals[name] = new Set([listener]);
        }
        else {
            listeners.add(listener);
        }
    }
    removeSignalListener(name, listener) {
        this.signals[name]?.delete(listener);
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
exports.ConnectableSwitcher = ConnectableSwitcher;
exports.CustomExpression = CustomExpression;
exports.DestructuringAssignmentExpression = DestructuringAssignmentExpression;
exports.DestructuringAssignmentRestExpression = DestructuringAssignmentRestExpression;
exports.DestructuringAssignmentSingleExpression = DestructuringAssignmentSingleExpression;
exports.DirtyCheckProperty = DirtyCheckProperty;
exports.DirtyCheckSettings = DirtyCheckSettings;
exports.ForOfStatement = ForOfStatement;
exports.ICoercionConfiguration = ICoercionConfiguration;
exports.IDirtyChecker = IDirtyChecker;
exports.IExpressionParser = IExpressionParser;
exports.INodeObserverLocator = INodeObserverLocator;
exports.IObservation = IObservation;
exports.IObserverLocator = IObserverLocator;
exports.ISignaler = ISignaler;
exports.Interpolation = Interpolation;
exports.MapObserver = MapObserver;
exports.ObjectBindingPattern = ObjectBindingPattern;
exports.ObjectLiteralExpression = ObjectLiteralExpression;
exports.Observation = Observation;
exports.ObserverLocator = ObserverLocator;
exports.PrimitiveLiteralExpression = PrimitiveLiteralExpression;
exports.PrimitiveObserver = PrimitiveObserver;
exports.PropertyAccessor = PropertyAccessor;
exports.ProxyObservable = ProxyObservable;
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
exports.observable = observable;
exports.parseExpression = parseExpression;
exports.subscriberCollection = subscriberCollection;
exports.synchronizeIndices = synchronizeIndices;
//# sourceMappingURL=index.dev.cjs.map
