import { CustomElementType } from '@aurelia/runtime-html';
export interface Card {
    header: string;
    details: string;
    imgSrc?: string;
}
/**
 * Potential coverage target
 * - `runtime-html`
 *    - `css-modules-registry`
 *    - `class-attribute-accessor`
 *    - `style-attribute-accessor`
 *    - `data-attribute-accessor`
 */
export declare class Cards {
    static customize(useCSSModule: boolean): CustomElementType;
    items: Card[];
    selected: Card;
    styleStr: string;
    styleObj: any;
    styleArray: any[];
    select(card: Card): void;
}
//# sourceMappingURL=cards.d.ts.map