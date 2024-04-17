import { Collection } from '@aurelia/runtime';
import { HydrateTemplateController, IHydratedComponentController, ICustomAttributeViewModel, ISyntheticView, IRenderLocation, CustomAttributeStaticAuDefinition } from '@aurelia/runtime-html';
import type { IScrollerInfo, IScrollerSubscriber, IVirtualRepeater } from "./interfaces";
export interface VirtualRepeat extends ICustomAttributeViewModel {
}
export declare class VirtualRepeat implements IScrollerSubscriber, IVirtualRepeater {
    static readonly $au: CustomAttributeStaticAuDefinition;
    local: string;
    items: Collection | null | undefined;
    private itemHeight;
    private minViewsRequired;
    private collectionStrategy?;
    private dom;
    private scrollerObserver;
    readonly location: IRenderLocation<ChildNode>;
    readonly instruction: HydrateTemplateController;
    readonly parent: IHydratedComponentController;
    constructor();
    handleScrollerChange(scrollerInfo: IScrollerInfo): void;
    getDistances(): [top: number, bottom: number];
    getViews(): readonly ISyntheticView[];
}
//# sourceMappingURL=virtual-repeat.d.ts.map