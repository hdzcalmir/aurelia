import { IContainer, IRegistration, IRegistry } from '@aurelia/kernel';
import { IObserverLocator } from '@aurelia/runtime';
import { IPlatform } from '@aurelia/runtime-html';
import { ITemplateCompiler } from '@aurelia/template-compiler';
export declare class TestContext {
    static readonly ambient: TestContext;
    get wnd(): Window & typeof globalThis;
    get doc(): Document;
    get userAgent(): string;
    get UIEvent(): {
        new (type: string, eventInitDict?: UIEventInit): UIEvent;
        prototype: UIEvent;
    };
    get Event(): {
        new (type: string, eventInitDict?: EventInit): Event;
        prototype: Event;
        readonly NONE: 0;
        readonly CAPTURING_PHASE: 1;
        readonly AT_TARGET: 2;
        readonly BUBBLING_PHASE: 3;
    };
    get CustomEvent(): {
        new <T>(type: string, eventInitDict?: CustomEventInit<T>): CustomEvent<T>;
        prototype: CustomEvent;
    };
    get KeyboardEvent(): {
        new (type: string, eventInitDict?: KeyboardEventInit): KeyboardEvent;
        prototype: KeyboardEvent;
        readonly DOM_KEY_LOCATION_STANDARD: 0;
        readonly DOM_KEY_LOCATION_LEFT: 1;
        readonly DOM_KEY_LOCATION_RIGHT: 2;
        readonly DOM_KEY_LOCATION_NUMPAD: 3;
    };
    get MouseEvent(): {
        new (type: string, eventInitDict?: MouseEventInit): MouseEvent;
        prototype: MouseEvent;
    };
    get SubmitEvent(): {
        new (type: string, eventInitDict?: SubmitEventInit): SubmitEvent;
        prototype: SubmitEvent;
    };
    get Node(): {
        new (): Node;
        prototype: Node;
        readonly ELEMENT_NODE: 1;
        readonly ATTRIBUTE_NODE: 2;
        readonly TEXT_NODE: 3;
        readonly CDATA_SECTION_NODE: 4;
        readonly ENTITY_REFERENCE_NODE: 5;
        readonly ENTITY_NODE: 6;
        readonly PROCESSING_INSTRUCTION_NODE: 7;
        readonly COMMENT_NODE: 8;
        readonly DOCUMENT_NODE: 9;
        readonly DOCUMENT_TYPE_NODE: 10;
        readonly DOCUMENT_FRAGMENT_NODE: 11;
        readonly NOTATION_NODE: 12;
        readonly DOCUMENT_POSITION_DISCONNECTED: 1;
        readonly DOCUMENT_POSITION_PRECEDING: 2;
        readonly DOCUMENT_POSITION_FOLLOWING: 4;
        readonly DOCUMENT_POSITION_CONTAINS: 8;
        readonly DOCUMENT_POSITION_CONTAINED_BY: 16;
        readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: 32;
    };
    get Element(): {
        new (): Element;
        prototype: Element;
    };
    get HTMLElement(): {
        new (): HTMLElement;
        prototype: HTMLElement;
    };
    get HTMLDivElement(): {
        new (): HTMLDivElement;
        prototype: HTMLDivElement;
    };
    get Text(): {
        new (data?: string): Text;
        prototype: Text;
    };
    get Comment(): {
        new (data?: string): Comment;
        prototype: Comment;
    };
    get DOMParser(): {
        new (): DOMParser;
        prototype: DOMParser;
    };
    get container(): IContainer;
    get platform(): IPlatform;
    get templateCompiler(): ITemplateCompiler;
    private oL;
    get observerLocator(): IObserverLocator;
    get domParser(): HTMLDivElement;
    private constructor();
    static create(): TestContext;
    createElementFromMarkup(markup: string): HTMLElement;
    createElement<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K];
    createElement<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K];
    createElement<E extends HTMLElement = HTMLElement>(selectors: string): E;
    createAttribute(name: string, value: string): Attr;
    type(host: HTMLElement, selector: string, value: string): void;
}
export declare let PLATFORM: IPlatform;
export declare let PLATFORMRegistration: IRegistration<IPlatform>;
export declare function setPlatform(p: IPlatform): void;
export declare function createContainer(...registries: IRegistry[]): IContainer;
//# sourceMappingURL=test-context.d.ts.map