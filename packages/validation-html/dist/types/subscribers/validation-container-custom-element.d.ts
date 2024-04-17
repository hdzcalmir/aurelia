import { PartialCustomElementDefinition } from '@aurelia/runtime-html';
import { IValidationController, ValidationEvent, ValidationResultTarget, ValidationResultsSubscriber } from '../validation-controller';
export declare const defaultContainerTemplate = "\n<slot></slot>\n<slot name='secondary'>\n  <span repeat.for=\"error of errors\">\n    ${error.result.message}\n  </span>\n</slot>\n";
export declare const defaultContainerDefinition: PartialCustomElementDefinition;
export declare class ValidationContainerCustomElement implements ValidationResultsSubscriber {
    controller: IValidationController;
    errors: ValidationResultTarget[];
    private readonly host;
    private readonly scopedController;
    handleValidationEvent(event: ValidationEvent): void;
    binding(): void;
    unbinding(): void;
}
//# sourceMappingURL=validation-container-custom-element.d.ts.map