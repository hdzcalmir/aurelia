import { AccessorType } from '@aurelia/runtime';
import type { IAccessor } from '@aurelia/runtime';
export declare class ClassAttributeAccessor implements IAccessor {
    readonly obj: HTMLElement;
    get doNotCache(): true;
    type: AccessorType;
    constructor(obj: HTMLElement);
    getValue(): unknown;
    setValue(newValue: unknown): void;
}
//# sourceMappingURL=class-attribute-accessor.d.ts.map