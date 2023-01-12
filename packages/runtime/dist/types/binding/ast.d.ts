import type { IBinding, IConnectable } from '../observation';
import type { Scope } from '../observation/scope';
import type { IConnectableBinding } from './connectable';
import type { ISignaler } from '../observation/signaler';
import type { IVisitor } from './ast.visitor';
export { astVisit, IVisitor, Unparser } from './ast.visitor';
export declare const enum ExpressionKind {
    AccessThis = 0,
    AccessScope = 1,
    ArrayLiteral = 2,
    ObjectLiteral = 3,
    PrimitiveLiteral = 4,
    Template = 5,
    Unary = 6,
    CallScope = 7,
    CallMember = 8,
    CallFunction = 9,
    AccessMember = 10,
    AccessKeyed = 11,
    TaggedTemplate = 12,
    Binary = 13,
    Conditional = 14,
    Assign = 15,
    ArrowFunction = 16,
    ValueConverter = 17,
    BindingBehavior = 18,
    ArrayBindingPattern = 19,
    ObjectBindingPattern = 20,
    BindingIdentifier = 21,
    ForOfStatement = 22,
    Interpolation = 23,
    ArrayDestructuring = 24,
    ObjectDestructuring = 25,
    DestructuringAssignmentLeaf = 26,
    DestructuringAssignmentRestLeaf = 27,
    Custom = 28
}
export declare type UnaryOperator = 'void' | 'typeof' | '!' | '-' | '+';
export declare type BinaryOperator = '??' | '&&' | '||' | '==' | '===' | '!=' | '!==' | 'instanceof' | 'in' | '+' | '-' | '*' | '/' | '%' | '<' | '>' | '<=' | '>=';
export declare type IsPrimary = AccessThisExpression | AccessScopeExpression | ArrayLiteralExpression | ObjectLiteralExpression | PrimitiveLiteralExpression | TemplateExpression;
export declare type IsLiteral = ArrayLiteralExpression | ObjectLiteralExpression | PrimitiveLiteralExpression | TemplateExpression;
export declare type IsLeftHandSide = IsPrimary | CallFunctionExpression | CallMemberExpression | CallScopeExpression | AccessMemberExpression | AccessKeyedExpression | TaggedTemplateExpression;
export declare type IsUnary = IsLeftHandSide | UnaryExpression;
export declare type IsBinary = IsUnary | BinaryExpression;
export declare type IsConditional = IsBinary | ConditionalExpression;
export declare type IsAssign = IsConditional | AssignExpression | ArrowFunction;
export declare type IsValueConverter = CustomExpression | IsAssign | ValueConverterExpression;
export declare type IsBindingBehavior = IsValueConverter | BindingBehaviorExpression;
export declare type IsAssignable = AccessScopeExpression | AccessKeyedExpression | AccessMemberExpression | AssignExpression;
export declare type IsExpression = IsBindingBehavior | Interpolation;
export declare type BindingIdentifierOrPattern = BindingIdentifier | ArrayBindingPattern | ObjectBindingPattern;
export declare type IsExpressionOrStatement = IsExpression | ForOfStatement | BindingIdentifierOrPattern | DestructuringAssignmentExpression | DestructuringAssignmentSingleExpression | DestructuringAssignmentRestExpression;
export declare type AnyBindingExpression = Interpolation | ForOfStatement | IsBindingBehavior;
export declare class CustomExpression {
    readonly value: unknown;
    readonly $kind = ExpressionKind.Custom;
    constructor(value: unknown);
    evaluate(_s: Scope, _e: IAstEvaluator | null, _c: IConnectable | null): unknown;
    assign(s: Scope, e: IAstEvaluator | null, val: unknown): unknown;
    bind(s: Scope, b: IAstEvaluator & IConnectableBinding): void;
    unbind(s: Scope, b: IAstEvaluator & IConnectableBinding): void;
    accept<T>(_visitor: IVisitor<T>): T;
}
export declare type BindingBehaviorInstance<T extends {} = {}> = {
    type?: 'instance' | 'factory';
    bind?(scope: Scope, binding: IBinding, ...args: unknown[]): void;
    unbind?(scope: Scope, binding: IBinding, ...args: unknown[]): void;
} & T;
export declare class BindingBehaviorExpression {
    readonly expression: IsBindingBehavior;
    readonly name: string;
    readonly args: readonly IsAssign[];
    readonly $kind = ExpressionKind.BindingBehavior;
    /**
     * The name of the property to store a binding behavior on the binding when binding
     */
    readonly key: string;
    constructor(expression: IsBindingBehavior, name: string, args: readonly IsAssign[]);
}
export declare type ValueConverterInstance<T extends {} = {}> = {
    signals?: string[];
    toView(input: unknown, ...args: unknown[]): unknown;
    fromView?(input: unknown, ...args: unknown[]): unknown;
} & T;
export declare class ValueConverterExpression {
    readonly expression: IsValueConverter;
    readonly name: string;
    readonly args: readonly IsAssign[];
    readonly $kind = ExpressionKind.ValueConverter;
    constructor(expression: IsValueConverter, name: string, args: readonly IsAssign[]);
}
export declare class AssignExpression {
    readonly target: IsAssignable;
    readonly value: IsAssign;
    readonly $kind = ExpressionKind.Assign;
    constructor(target: IsAssignable, value: IsAssign);
}
export declare class ConditionalExpression {
    readonly condition: IsBinary;
    readonly yes: IsAssign;
    readonly no: IsAssign;
    readonly $kind = ExpressionKind.Conditional;
    constructor(condition: IsBinary, yes: IsAssign, no: IsAssign);
}
export declare class AccessThisExpression {
    readonly ancestor: number;
    static readonly $this: AccessThisExpression;
    static readonly $parent: AccessThisExpression;
    readonly $kind: ExpressionKind.AccessThis;
    constructor(ancestor?: number);
}
export declare class AccessScopeExpression {
    readonly name: string;
    readonly ancestor: number;
    readonly $kind = ExpressionKind.AccessScope;
    constructor(name: string, ancestor?: number);
}
export declare class AccessMemberExpression {
    readonly object: IsLeftHandSide;
    readonly name: string;
    readonly optional: boolean;
    readonly $kind: ExpressionKind.AccessMember;
    constructor(object: IsLeftHandSide, name: string, optional?: boolean);
}
export declare class AccessKeyedExpression {
    readonly object: IsLeftHandSide;
    readonly key: IsAssign;
    readonly optional: boolean;
    readonly $kind = ExpressionKind.AccessKeyed;
    constructor(object: IsLeftHandSide, key: IsAssign, optional?: boolean);
}
export declare class CallScopeExpression {
    readonly name: string;
    readonly args: readonly IsAssign[];
    readonly ancestor: number;
    readonly optional: boolean;
    readonly $kind = ExpressionKind.CallScope;
    constructor(name: string, args: readonly IsAssign[], ancestor?: number, optional?: boolean);
}
export declare class CallMemberExpression {
    readonly object: IsLeftHandSide;
    readonly name: string;
    readonly args: readonly IsAssign[];
    readonly optionalMember: boolean;
    readonly optionalCall: boolean;
    readonly $kind = ExpressionKind.CallMember;
    constructor(object: IsLeftHandSide, name: string, args: readonly IsAssign[], optionalMember?: boolean, optionalCall?: boolean);
}
export declare class CallFunctionExpression {
    readonly func: IsLeftHandSide;
    readonly args: readonly IsAssign[];
    readonly optional: boolean;
    readonly $kind = ExpressionKind.CallFunction;
    constructor(func: IsLeftHandSide, args: readonly IsAssign[], optional?: boolean);
}
export declare class BinaryExpression {
    readonly operation: BinaryOperator;
    readonly left: IsBinary;
    readonly right: IsBinary;
    readonly $kind: ExpressionKind.Binary;
    constructor(operation: BinaryOperator, left: IsBinary, right: IsBinary);
}
export declare class UnaryExpression {
    readonly operation: UnaryOperator;
    readonly expression: IsLeftHandSide;
    readonly $kind = ExpressionKind.Unary;
    constructor(operation: UnaryOperator, expression: IsLeftHandSide);
}
export declare class PrimitiveLiteralExpression<TValue extends null | undefined | number | boolean | string = null | undefined | number | boolean | string> {
    readonly value: TValue;
    static readonly $undefined: PrimitiveLiteralExpression<undefined>;
    static readonly $null: PrimitiveLiteralExpression<null>;
    static readonly $true: PrimitiveLiteralExpression<true>;
    static readonly $false: PrimitiveLiteralExpression<false>;
    static readonly $empty: PrimitiveLiteralExpression<string>;
    readonly $kind = ExpressionKind.PrimitiveLiteral;
    constructor(value: TValue);
}
export declare class ArrayLiteralExpression {
    readonly elements: readonly IsAssign[];
    static readonly $empty: ArrayLiteralExpression;
    readonly $kind = ExpressionKind.ArrayLiteral;
    constructor(elements: readonly IsAssign[]);
}
export declare class ObjectLiteralExpression {
    readonly keys: readonly (number | string)[];
    readonly values: readonly IsAssign[];
    static readonly $empty: ObjectLiteralExpression;
    readonly $kind = ExpressionKind.ObjectLiteral;
    constructor(keys: readonly (number | string)[], values: readonly IsAssign[]);
}
export declare class TemplateExpression {
    readonly cooked: readonly string[];
    readonly expressions: readonly IsAssign[];
    static readonly $empty: TemplateExpression;
    readonly $kind = ExpressionKind.Template;
    constructor(cooked: readonly string[], expressions?: readonly IsAssign[]);
}
export declare class TaggedTemplateExpression {
    readonly cooked: readonly string[] & {
        raw?: readonly string[];
    };
    readonly func: IsLeftHandSide;
    readonly expressions: readonly IsAssign[];
    readonly $kind = ExpressionKind.TaggedTemplate;
    constructor(cooked: readonly string[] & {
        raw?: readonly string[];
    }, raw: readonly string[], func: IsLeftHandSide, expressions?: readonly IsAssign[]);
}
export declare class ArrayBindingPattern {
    readonly elements: readonly IsAssign[];
    readonly $kind = ExpressionKind.ArrayBindingPattern;
    constructor(elements: readonly IsAssign[]);
}
export declare class ObjectBindingPattern {
    readonly keys: readonly (string | number)[];
    readonly values: readonly IsAssign[];
    readonly $kind = ExpressionKind.ObjectBindingPattern;
    constructor(keys: readonly (string | number)[], values: readonly IsAssign[]);
}
export declare class BindingIdentifier {
    readonly name: string;
    readonly $kind = ExpressionKind.BindingIdentifier;
    constructor(name: string);
}
export declare class ForOfStatement {
    readonly declaration: BindingIdentifierOrPattern | DestructuringAssignmentExpression;
    readonly iterable: IsBindingBehavior;
    readonly semiIdx: number;
    readonly $kind = ExpressionKind.ForOfStatement;
    constructor(declaration: BindingIdentifierOrPattern | DestructuringAssignmentExpression, iterable: IsBindingBehavior, semiIdx: number);
}
export declare class Interpolation {
    readonly parts: readonly string[];
    readonly expressions: readonly IsBindingBehavior[];
    readonly $kind = ExpressionKind.Interpolation;
    readonly isMulti: boolean;
    readonly firstExpression: IsBindingBehavior;
    constructor(parts: readonly string[], expressions?: readonly IsBindingBehavior[]);
}
/** This is an internal API */
export declare class DestructuringAssignmentExpression {
    readonly $kind: ExpressionKind.ArrayDestructuring | ExpressionKind.ObjectDestructuring;
    readonly list: readonly (DestructuringAssignmentExpression | DestructuringAssignmentSingleExpression | DestructuringAssignmentRestExpression)[];
    readonly source: AccessMemberExpression | AccessKeyedExpression | undefined;
    readonly initializer: IsBindingBehavior | undefined;
    constructor($kind: ExpressionKind.ArrayDestructuring | ExpressionKind.ObjectDestructuring, list: readonly (DestructuringAssignmentExpression | DestructuringAssignmentSingleExpression | DestructuringAssignmentRestExpression)[], source: AccessMemberExpression | AccessKeyedExpression | undefined, initializer: IsBindingBehavior | undefined);
}
/** This is an internal API */
export declare class DestructuringAssignmentSingleExpression {
    readonly target: AccessMemberExpression;
    readonly source: AccessMemberExpression | AccessKeyedExpression;
    readonly initializer: IsBindingBehavior | undefined;
    readonly $kind = ExpressionKind.DestructuringAssignmentLeaf;
    constructor(target: AccessMemberExpression, source: AccessMemberExpression | AccessKeyedExpression, initializer: IsBindingBehavior | undefined);
}
/** This is an internal API */
export declare class DestructuringAssignmentRestExpression {
    readonly target: AccessMemberExpression;
    readonly indexOrProperties: string[] | number;
    readonly $kind = ExpressionKind.DestructuringAssignmentLeaf;
    constructor(target: AccessMemberExpression, indexOrProperties: string[] | number);
}
export declare class ArrowFunction {
    args: BindingIdentifier[];
    body: IsAssign;
    rest: boolean;
    readonly $kind = ExpressionKind.ArrowFunction;
    constructor(args: BindingIdentifier[], body: IsAssign, rest?: boolean);
}
/**
 * An interface describing the object that can evaluate Aurelia AST
 */
export interface IAstEvaluator {
    /** describe whether the evaluator wants to evaluate in strict mode */
    strict?: boolean;
    /** describe whether the evaluator wants a bound function to be returned, in case the returned value is a function */
    boundFn?: boolean;
    /** describe whether the evaluator wants to evaluate the function call in strict mode */
    strictFnCall?: boolean;
    /** Allow an AST to retrieve a signaler instance for connecting/disconnecting */
    getSignaler?(): ISignaler;
    /** Allow an AST to retrieve a value converter that it needs */
    getConverter?<T>(name: string): ValueConverterInstance<T> | undefined;
    /** Allow an AST to retrieve a binding behavior that it needs */
    getBehavior?<T>(name: string): BindingBehaviorInstance<T> | undefined;
}
//# sourceMappingURL=ast.d.ts.map