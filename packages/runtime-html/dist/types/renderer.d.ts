import { type IContainer, type Class, type IRegistry } from '@aurelia/kernel';
import { IExpressionParser, IObserverLocator, type Interpolation, type IsBindingBehavior, type ForOfStatement } from '@aurelia/runtime';
import { type BindingMode } from './binding/interfaces-bindings';
import { CustomElementDefinition } from './resources/custom-element';
import { CustomAttributeDefinition } from './resources/custom-attribute';
import { INode } from './dom';
import { IController } from './templating/controller';
import { IPlatform } from './platform';
import type { AttrSyntax } from './resources/attribute-pattern';
import { IAuSlotProjections } from './templating/controller.projection';
import type { IHydratableController } from './templating/controller';
import type { PartialCustomElementDefinition } from './resources/custom-element';
export declare const InstructionType: Readonly<{
    hydrateElement: "ra";
    hydrateAttribute: "rb";
    hydrateTemplateController: "rc";
    hydrateLetElement: "rd";
    setProperty: "re";
    interpolation: "rf";
    propertyBinding: "rg";
    letBinding: "ri";
    refBinding: "rj";
    iteratorBinding: "rk";
    multiAttr: "rl";
    textBinding: "ha";
    listenerBinding: "hb";
    attributeBinding: "hc";
    stylePropertyBinding: "hd";
    setAttribute: "he";
    setClassAttribute: "hf";
    setStyleAttribute: "hg";
    spreadBinding: "hs";
    spreadElementProp: "hp";
}>;
export type InstructionType = typeof InstructionType[keyof typeof InstructionType];
export type InstructionTypeName = string;
export interface IInstruction {
    readonly type: InstructionTypeName;
}
export declare const IInstruction: import("@aurelia/kernel").InterfaceSymbol<IInstruction>;
export declare function isInstruction(value: unknown): value is IInstruction;
export declare class InterpolationInstruction {
    from: string | Interpolation;
    to: string;
    readonly type = "rf";
    constructor(from: string | Interpolation, to: string);
}
export declare class PropertyBindingInstruction {
    from: string | IsBindingBehavior;
    to: string;
    mode: BindingMode;
    readonly type = "rg";
    constructor(from: string | IsBindingBehavior, to: string, mode: BindingMode);
}
export declare class IteratorBindingInstruction {
    forOf: string | ForOfStatement;
    to: string;
    props: MultiAttrInstruction[];
    readonly type = "rk";
    constructor(forOf: string | ForOfStatement, to: string, props: MultiAttrInstruction[]);
}
export declare class RefBindingInstruction {
    readonly from: string | IsBindingBehavior;
    readonly to: string;
    readonly type = "rj";
    constructor(from: string | IsBindingBehavior, to: string);
}
export declare class SetPropertyInstruction {
    value: unknown;
    to: string;
    readonly type = "re";
    constructor(value: unknown, to: string);
}
export declare class MultiAttrInstruction {
    value: string;
    to: string;
    command: string | null;
    readonly type = "rl";
    constructor(value: string, to: string, command: string | null);
}
export declare class HydrateElementInstruction {
    /**
     * The name of the custom element this instruction is associated with
     */
    res: string | /* Constructable |  */ CustomElementDefinition;
    alias: string | undefined;
    /**
     * Bindable instructions for the custom element instance
     */
    props: IInstruction[];
    /**
     * Indicates what projections are associated with the element usage
     */
    projections: Record<string, CustomElementDefinition> | null;
    /**
     * Indicates whether the usage of the custom element was with a containerless attribute or not
     */
    containerless: boolean;
    /**
     * A list of captured attr syntaxes
     */
    captures: AttrSyntax[] | undefined;
    readonly type = "ra";
    /**
     * A special property that can be used to store <au-slot/> usage information
     */
    auSlot: {
        name: string;
        fallback: CustomElementDefinition;
    } | null;
    constructor(
    /**
     * The name of the custom element this instruction is associated with
     */
    res: string | /* Constructable |  */ CustomElementDefinition, alias: string | undefined, 
    /**
     * Bindable instructions for the custom element instance
     */
    props: IInstruction[], 
    /**
     * Indicates what projections are associated with the element usage
     */
    projections: Record<string, CustomElementDefinition> | null, 
    /**
     * Indicates whether the usage of the custom element was with a containerless attribute or not
     */
    containerless: boolean, 
    /**
     * A list of captured attr syntaxes
     */
    captures: AttrSyntax[] | undefined);
}
export declare class HydrateAttributeInstruction {
    res: string | /* Constructable |  */ CustomAttributeDefinition;
    alias: string | undefined;
    /**
     * Bindable instructions for the custom attribute instance
     */
    props: IInstruction[];
    readonly type = "rb";
    constructor(res: string | /* Constructable |  */ CustomAttributeDefinition, alias: string | undefined, 
    /**
     * Bindable instructions for the custom attribute instance
     */
    props: IInstruction[]);
}
export declare class HydrateTemplateController {
    def: PartialCustomElementDefinition;
    res: string | /* Constructable |  */ CustomAttributeDefinition;
    alias: string | undefined;
    /**
     * Bindable instructions for the template controller instance
     */
    props: IInstruction[];
    readonly type = "rc";
    constructor(def: PartialCustomElementDefinition, res: string | /* Constructable |  */ CustomAttributeDefinition, alias: string | undefined, 
    /**
     * Bindable instructions for the template controller instance
     */
    props: IInstruction[]);
}
export declare class HydrateLetElementInstruction {
    instructions: LetBindingInstruction[];
    toBindingContext: boolean;
    readonly type = "rd";
    constructor(instructions: LetBindingInstruction[], toBindingContext: boolean);
}
export declare class LetBindingInstruction {
    from: string | IsBindingBehavior | Interpolation;
    to: string;
    readonly type = "ri";
    constructor(from: string | IsBindingBehavior | Interpolation, to: string);
}
export declare class TextBindingInstruction {
    from: string | IsBindingBehavior;
    readonly type = "ha";
    constructor(from: string | IsBindingBehavior);
}
export declare class ListenerBindingInstruction {
    from: string | IsBindingBehavior;
    to: string;
    preventDefault: boolean;
    capture: boolean;
    modifier: string | null;
    readonly type = "hb";
    constructor(from: string | IsBindingBehavior, to: string, preventDefault: boolean, capture: boolean, modifier: string | null);
}
export declare class StylePropertyBindingInstruction {
    from: string | IsBindingBehavior;
    to: string;
    readonly type = "hd";
    constructor(from: string | IsBindingBehavior, to: string);
}
export declare class SetAttributeInstruction {
    value: string;
    to: string;
    readonly type = "he";
    constructor(value: string, to: string);
}
export declare class SetClassAttributeInstruction {
    readonly value: string;
    readonly type: typeof InstructionType.setClassAttribute;
    constructor(value: string);
}
export declare class SetStyleAttributeInstruction {
    readonly value: string;
    readonly type: typeof InstructionType.setStyleAttribute;
    constructor(value: string);
}
export declare class AttributeBindingInstruction {
    /**
     * `attr` and `to` have the same value on a normal attribute
     * Will be different on `class` and `style`
     * on `class`: attr = `class` (from binding command), to = attribute name
     * on `style`: attr = `style` (from binding command), to = attribute name
     */
    attr: string;
    from: string | IsBindingBehavior;
    to: string;
    readonly type = "hc";
    constructor(
    /**
     * `attr` and `to` have the same value on a normal attribute
     * Will be different on `class` and `style`
     * on `class`: attr = `class` (from binding command), to = attribute name
     * on `style`: attr = `style` (from binding command), to = attribute name
     */
    attr: string, from: string | IsBindingBehavior, to: string);
}
export declare class SpreadBindingInstruction {
    readonly type = "hs";
}
export declare class SpreadElementPropBindingInstruction {
    readonly instructions: IInstruction;
    readonly type = "hp";
    constructor(instructions: IInstruction);
}
export declare const ITemplateCompiler: import("@aurelia/kernel").InterfaceSymbol<ITemplateCompiler>;
export interface ITemplateCompiler {
    /**
     * Indicates whether this compiler should compile template in debug mode
     *
     * For the default compiler, this means all expressions are kept as is on the template
     */
    debug: boolean;
    /**
     * Experimental API, for optimization.
     *
     * `true` to create CustomElement/CustomAttribute instructions
     * with resolved resources constructor during compilation, instead of name
     */
    resolveResources: boolean;
    compile(partialDefinition: PartialCustomElementDefinition, context: IContainer, compilationInstruction: ICompliationInstruction | null): CustomElementDefinition;
    /**
     * Compile a list of captured attributes as if they are declared in a template
     *
     * @param requestor - the context definition where the attributes is compiled
     * @param attrSyntaxes - the attributes captured
     * @param container - the container containing information for the compilation
     * @param host - the host element where the attributes are spreaded on
     */
    compileSpread(requestor: PartialCustomElementDefinition, attrSyntaxes: AttrSyntax[], container: IContainer, target: Element, 
    /**
     * An associated custom element definition for the target host element
     * Sometimes spread compilation may occur without the container having all necessary information
     * about the targeted element that is receiving the spread
     *
     * Caller of this method may want to provide this information dynamically instead
     */
    targetDef?: CustomElementDefinition): IInstruction[];
}
export interface ICompliationInstruction {
    /**
     * A record of projections available for compiling a template.
     * Where each key is the matching slot name for <au-slot/> inside,
     * and each value is the definition to render and project
     */
    projections: IAuSlotProjections | null;
}
export interface IInstructionTypeClassifier<TType extends string = string> {
    target: TType;
}
export interface IRenderer<TType extends InstructionTypeName = InstructionTypeName> extends IInstructionTypeClassifier<TType> {
    render(
    /**
     * The controller that is current invoking this renderer
     */
    renderingCtrl: IHydratableController, target: unknown, instruction: IInstruction, platform: IPlatform, exprParser: IExpressionParser, observerLocator: IObserverLocator): void;
}
export declare const IRenderer: import("@aurelia/kernel").InterfaceSymbol<IRenderer<string>>;
type DecoratableInstructionRenderer<TType extends string, TProto, TClass> = Class<TProto & Partial<IInstructionTypeClassifier<TType> & Pick<IRenderer, 'render'>>, TClass> & Partial<IRegistry>;
type DecoratedInstructionRenderer<TType extends string, TProto, TClass> = Class<TProto & IInstructionTypeClassifier<TType> & Pick<IRenderer, 'render'>, TClass> & IRegistry;
type InstructionRendererDecorator<TType extends string> = <TProto, TClass>(target: DecoratableInstructionRenderer<TType, TProto, TClass>) => DecoratedInstructionRenderer<TType, TProto, TClass>;
export declare function renderer<TType extends string>(targetType: TType): InstructionRendererDecorator<TType>;
export declare class SetPropertyRenderer implements IRenderer {
    target: typeof InstructionType.setProperty;
    render(renderingCtrl: IHydratableController, target: IController, instruction: SetPropertyInstruction): void;
}
export declare class CustomElementRenderer implements IRenderer {
    target: typeof InstructionType.hydrateElement;
    render(renderingCtrl: IHydratableController, target: HTMLElement, instruction: HydrateElementInstruction, platform: IPlatform, exprParser: IExpressionParser, observerLocator: IObserverLocator): void;
}
export declare class CustomAttributeRenderer implements IRenderer {
    target: typeof InstructionType.hydrateAttribute;
    render(
    /**
     * The cotroller that is currently invoking this renderer
     */
    renderingCtrl: IHydratableController, target: HTMLElement, instruction: HydrateAttributeInstruction, platform: IPlatform, exprParser: IExpressionParser, observerLocator: IObserverLocator): void;
}
export declare class TemplateControllerRenderer implements IRenderer {
    target: typeof InstructionType.hydrateTemplateController;
    render(renderingCtrl: IHydratableController, target: HTMLElement, instruction: HydrateTemplateController, platform: IPlatform, exprParser: IExpressionParser, observerLocator: IObserverLocator): void;
}
export declare class LetElementRenderer implements IRenderer {
    target: typeof InstructionType.hydrateLetElement;
    render(renderingCtrl: IHydratableController, target: Node & ChildNode, instruction: HydrateLetElementInstruction, platform: IPlatform, exprParser: IExpressionParser, observerLocator: IObserverLocator): void;
}
export declare class RefBindingRenderer implements IRenderer {
    target: typeof InstructionType.refBinding;
    render(renderingCtrl: IHydratableController, target: INode, instruction: RefBindingInstruction, platform: IPlatform, exprParser: IExpressionParser): void;
}
export declare class InterpolationBindingRenderer implements IRenderer {
    target: typeof InstructionType.interpolation;
    render(renderingCtrl: IHydratableController, target: IController, instruction: InterpolationInstruction, platform: IPlatform, exprParser: IExpressionParser, observerLocator: IObserverLocator): void;
}
export declare class PropertyBindingRenderer implements IRenderer {
    target: typeof InstructionType.propertyBinding;
    render(renderingCtrl: IHydratableController, target: IController, instruction: PropertyBindingInstruction, platform: IPlatform, exprParser: IExpressionParser, observerLocator: IObserverLocator): void;
}
export declare class IteratorBindingRenderer implements IRenderer {
    target: typeof InstructionType.iteratorBinding;
    render(renderingCtrl: IHydratableController, target: IController, instruction: IteratorBindingInstruction, platform: IPlatform, exprParser: IExpressionParser, observerLocator: IObserverLocator): void;
}
export declare class TextBindingRenderer implements IRenderer {
    target: typeof InstructionType.textBinding;
    render(renderingCtrl: IHydratableController, target: ChildNode, instruction: TextBindingInstruction, platform: IPlatform, exprParser: IExpressionParser, observerLocator: IObserverLocator): void;
}
export declare class ListenerBindingRenderer implements IRenderer {
    target: typeof InstructionType.listenerBinding;
    render(renderingCtrl: IHydratableController, target: HTMLElement, instruction: ListenerBindingInstruction, platform: IPlatform, exprParser: IExpressionParser): void;
}
export declare class SetAttributeRenderer implements IRenderer {
    target: typeof InstructionType.setAttribute;
    render(_: IHydratableController, target: HTMLElement, instruction: SetAttributeInstruction): void;
}
export declare class SetClassAttributeRenderer implements IRenderer {
    target: typeof InstructionType.setClassAttribute;
    render(_: IHydratableController, target: HTMLElement, instruction: SetClassAttributeInstruction): void;
}
export declare class SetStyleAttributeRenderer implements IRenderer {
    target: typeof InstructionType.setStyleAttribute;
    render(_: IHydratableController, target: HTMLElement, instruction: SetStyleAttributeInstruction): void;
}
export declare class StylePropertyBindingRenderer implements IRenderer {
    target: typeof InstructionType.stylePropertyBinding;
    render(renderingCtrl: IHydratableController, target: HTMLElement, instruction: StylePropertyBindingInstruction, platform: IPlatform, exprParser: IExpressionParser, observerLocator: IObserverLocator): void;
}
export declare class AttributeBindingRenderer implements IRenderer {
    target: typeof InstructionType.attributeBinding;
    render(renderingCtrl: IHydratableController, target: HTMLElement, instruction: AttributeBindingInstruction, platform: IPlatform, exprParser: IExpressionParser, observerLocator: IObserverLocator): void;
}
export declare class SpreadRenderer implements IRenderer {
    readonly target: typeof InstructionType.spreadBinding;
    render(renderingCtrl: IHydratableController, target: HTMLElement, _instruction: SpreadBindingInstruction, platform: IPlatform, exprParser: IExpressionParser, observerLocator: IObserverLocator): void;
}
export {};
//# sourceMappingURL=renderer.d.ts.map