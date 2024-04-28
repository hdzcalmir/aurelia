import { IServiceLocator, Key } from '@aurelia/kernel';
import { IExpressionParser } from '@aurelia/expression-parser';
import { IObserverLocator } from '@aurelia/runtime';
import { type Scope } from './scope';
import { CustomElementDefinition } from '../resources/custom-element';
import { ICustomElementController, IHydrationContext, IController } from '../templating/controller';
import { IHasController } from '../renderer';
import { ITemplateCompiler } from '@aurelia/template-compiler';
import { IRendering } from '../templating/rendering';
import { IPlatform } from '../platform';
import { IBinding } from './interfaces-bindings';
/**
 * The public methods of this binding emulates the necessary of an IHydratableController,
 * which mainly is the addBinding method since a spread binding
 * is a surrogate of other bindings created from the captured attrs
 */
export declare class SpreadBinding implements IBinding, IHasController {
    /**
     * Create a list of SpreadBinding by searching for captured attributes in HydrationContexts
     * from a container
     */
    static create(hydrationContext: IHydrationContext, target: HTMLElement, 
    /**
     * To be supplied to the compilation of spread' attrs
     * Sometimes in dynamic compilation scenario, this could be used to influence
     * what attributes can be compiled into (i.e bindable vs normal)
     */
    targetDef: CustomElementDefinition | undefined, rendering: IRendering, compiler: ITemplateCompiler, platform: IPlatform, exprParser: IExpressionParser, observerLocator: IObserverLocator): SpreadBinding[];
    scope?: Scope | undefined;
    isBound: boolean;
    readonly locator: IServiceLocator;
    readonly $controller: ICustomElementController;
    get container(): IServiceLocator;
    get definition(): CustomElementDefinition;
    get state(): import("../templating/controller").State;
    constructor(hydrationContext: IHydrationContext<object>);
    get(key: Key): any;
    bind(_scope: Scope): void;
    unbind(): void;
    addBinding(binding: IBinding): void;
    addChild(controller: IController): void;
}
//# sourceMappingURL=spread-binding.d.ts.map