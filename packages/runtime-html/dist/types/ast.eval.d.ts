import { CustomExpression, type IsExpressionOrStatement } from '@aurelia/expression-parser';
import { IConnectable } from '@aurelia/runtime';
import { Scope } from './binding/scope';
import { ISignaler } from './signaler';
import { BindingBehaviorInstance } from './resources/binding-behavior';
import { ValueConverterInstance } from './resources/value-converter';
import { IBinding } from './binding/interfaces-bindings';
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
    getConverter?<T extends {}>(name: string): ValueConverterInstance<T> | undefined;
    /** Allow an AST to retrieve a binding behavior that it needs */
    getBehavior?<T extends {}>(name: string): BindingBehaviorInstance<T> | undefined;
}
export declare const astAssign: (ast: CustomExpression | IsExpressionOrStatement, s: Scope, e: IAstEvaluator | null, val: unknown) => unknown, astEvaluate: (ast: CustomExpression | IsExpressionOrStatement, s: Scope, e: IAstEvaluator | null, c: IConnectable | null) => unknown, astBind: (ast: CustomExpression | IsExpressionOrStatement, s: Scope, b: IAstEvaluator & IConnectable & IBinding) => void, astUnbind: (ast: CustomExpression | IsExpressionOrStatement, s: Scope, b: IAstEvaluator & IConnectable & IBinding) => void;
//# sourceMappingURL=ast.eval.d.ts.map