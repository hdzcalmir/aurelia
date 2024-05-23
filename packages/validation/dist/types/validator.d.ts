import { ValidationResult, PropertyRule } from './rule-provider';
import { IValidateable } from './rule-interfaces';
/**
 * IInstruction for the validation controller's validate method.
 */
export declare class ValidateInstruction<TObject extends IValidateable = IValidateable> {
    object: TObject;
    propertyName: keyof TObject | string;
    rules: PropertyRule[];
    objectTag: string;
    propertyTag: string;
    /**
     * @param object - The object to validate.
     * @param propertyName - The property name to validate.
     * @param rules - The rules to validate.
     * @param objectTag - The tag indicating the ruleset defined for the object.
     * @param propertyTag - The tag indicating the ruleset for the property.
     */
    constructor(object?: TObject, propertyName?: keyof TObject | string, rules?: PropertyRule[], objectTag?: string, propertyTag?: string);
}
export declare const IValidator: import("@aurelia/kernel").InterfaceSymbol<IValidator>;
/**
 * The core validator contract.
 */
export interface IValidator {
    /**
     * Core validate function that works with a validate instruction.
     *
     * @template T
     * @param {ValidateInstruction<T>} instruction - The instruction on how to perform the validation.
     * - case `{object}` - the default ruleset defined on the instance or the class are used.
     * - case `{object, propertyName}` - only the rules defined for the particular property are validated.
     * - case `{object, rules}`  or `{object, propertyName, rules}` - only the specified rules are used for validation.
     * - case `{object, objectTag}` - only the tagged ruleset are used for validation.
     * - case `{object, objectTag, propertyName}` - only the rules for the property in the tagged ruleset are used for validation.
     * - case `{object, objectTag, propertyName, propertyTag}` - only the tagged rules for the property in the tagged ruleset for the object are validated
     */
    validate<TObject extends IValidateable = IValidateable>(instruction: ValidateInstruction<TObject>): Promise<ValidationResult[]>;
}
/**
 * Standard implementation of `IValidator`.
 */
export declare class StandardValidator implements IValidator {
    validate<TObject extends IValidateable = IValidateable>(instruction: ValidateInstruction<TObject>): Promise<ValidationResult[]>;
}
//# sourceMappingURL=validator.d.ts.map