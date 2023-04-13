import { INode } from '../../dom';
import { IPlatform } from '../../platform';
import type { ICustomAttributeController, ICustomAttributeViewModel } from '../../templating/controller';
/**
 * Focus attribute for element focus binding
 */
export declare class Focus implements ICustomAttributeViewModel {
    readonly $controller: ICustomAttributeController<this>;
    value: unknown;
    constructor(element: INode<HTMLElement>, platform: IPlatform);
    binding(): void;
    /**
     * Invoked everytime the bound value changes.
     *
     * @param newValue - The new value.
     */
    valueChanged(): void;
    /**
     * Invoked when the attribute is attached to the DOM.
     */
    attached(): void;
    /**
     * Invoked when the attribute is afterDetachChildren from the DOM.
     */
    detaching(): void;
    /**
     * EventTarget interface handler for better memory usage
     */
    handleEvent(e: FocusEvent): void;
}
//# sourceMappingURL=focus.d.ts.map