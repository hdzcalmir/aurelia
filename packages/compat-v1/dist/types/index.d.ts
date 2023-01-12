import { IRegistry } from '@aurelia/kernel';
import { PreventFormActionlessSubmit } from './compat-form';
/**
 * Register all services/functionalities necessary for a v1 app to work with Aurelia v2.
 *
 * Ideally should only be used for migration as there maybe be perf penalties to application doing it this way.
 */
export declare const compatRegistration: IRegistry;
export { PreventFormActionlessSubmit, };
export { CallBinding, CallBindingCommand, CallBindingInstruction, CallBindingRenderer, callSyntax, } from './compat-call';
export { DelegateBindingCommand, DelegateBindingInstruction, DelegateListenerBinding, DelegateListenerOptions, EventDelegator, IEventDelegator, ListenerBindingRenderer, delegateSyntax, } from './compat-delegate';
//# sourceMappingURL=index.d.ts.map