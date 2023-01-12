import { Constructable, IContainer, ILogger } from '@aurelia/kernel';
import { IObserverLocator } from '@aurelia/runtime';
import { Aurelia, IPlatform, type ICustomElementViewModel } from '@aurelia/runtime-html';
import { TestContext } from './test-context';
export declare const onFixtureCreated: <T>(callback: (fixture: IFixture<T>) => unknown) => import("@aurelia/kernel").IDisposable;
export declare type ObjectType<T> = T extends Constructable<infer U> ? U : T;
export declare function createFixture<T extends object>(template: string | Node, $class?: T, registrations?: unknown[], autoStart?: boolean, ctx?: TestContext): IFixture<ICustomElementViewModel & ObjectType<T>>;
export declare namespace createFixture {
    var html: <T = Record<PropertyKey, any>>(html: string | TemplateStringsArray, ...values: TemplateValues<T>[]) => CreateBuilder<T, "component" | "deps">;
    var component: <T, K extends ObjectType<T>>(component: T) => {
        html: {
            (html: string): CreateBuilder<K, "deps">;
            (html: TemplateStringsArray, ...values: TemplateValues<K>[]): CreateBuilder<K, "deps">;
        };
        deps: (...args: unknown[]) => {
            html: {
                (html: string): CreateBuilder<K, never>;
                (html: TemplateStringsArray, ...values: TemplateValues<K>[]): CreateBuilder<K, never>;
            };
        };
    };
    var deps: <T = Record<PropertyKey, any>>(...deps: unknown[]) => {
        html: {
            (html: string): CreateBuilder<T, "component">;
            (html: TemplateStringsArray, ...values: TemplateValues<T>[]): CreateBuilder<T, "component">;
        };
        component: (comp: T) => {
            html: {
                (html: string): CreateBuilder<T, never>;
                (html: TemplateStringsArray, ...values: TemplateValues<T>[]): CreateBuilder<T, never>;
            };
        };
    };
}
export interface IFixture<T> {
    readonly startPromise: void | Promise<void>;
    readonly ctx: TestContext;
    readonly container: IContainer;
    readonly platform: IPlatform;
    readonly testHost: HTMLElement;
    readonly appHost: HTMLElement;
    readonly au: Aurelia;
    readonly component: ICustomElementViewModel & T;
    readonly observerLocator: IObserverLocator;
    readonly logger: ILogger;
    readonly torn: boolean;
    start(): void | Promise<void>;
    tearDown(): void | Promise<void>;
    readonly started: Promise<IFixture<T>>;
    /**
     * Returns the first element that is a descendant of node that matches selectors, and throw if there is more than one, or none found
     */
    getBy<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K];
    getBy<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K];
    getBy<E extends HTMLElement = HTMLElement>(selectors: string): E | null;
    /**
     * Returns all element descendants of node that match selectors.
     */
    getAllBy<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K][];
    getAllBy<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K][];
    getAllBy<E extends HTMLElement = HTMLElement>(selectors: string): E[];
    /**
     * Returns the first element that is a descendant of node that matches selectors, and null if none found
     */
    queryBy<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
    queryBy<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
    queryBy<E extends HTMLElement = HTMLElement>(selectors: string): E | null;
    /**
     * Assert the text content of the current application host equals to a given string
     */
    assertText(text: string): void;
    /**
     * Assert the text content of an element matching the given selector inside the application host equals to a given string.
     *
     * Will throw if there' more than one elements with matching selector
     */
    assertText(selector: string, text: string): void;
    /**
     * Assert the inner html of the current application host equals to the given html string
     */
    assertHtml(html: string): void;
    /**
     * Assert the inner html of an element matching the selector inside the current application host equals to the given html string.
     *
     * Will throw if there' more than one elements with matching selector
     */
    assertHtml(selector: string, html: string): void;
    /**
     * Assert the attribute value of an element matching the given selector inside the application host equals to a given string.
     *
     * Will throw if there' more than one elements with matching selector
     */
    assertAttr(selector: string, name: string, value: string): void;
    /**
     * Assert the attribute value of an element matching the given selector inside the application host equals to a given string.
     *
     * Will throw if there' more than one elements with matching selector
     */
    assertAttrNS(selector: string, namespace: string, name: string, value: string): void;
    /**
     * Assert the value of an element matching the given selector inside the application host equals to a given value.
     *
     * Will throw if there' more than one elements with matching selector
     */
    assertValue(selector: string, value: unknown): void;
    /**
     * Create a custom event by the given name and init for the current platform
     */
    createEvent<T>(name: string, init?: CustomEventInit<T>): CustomEvent;
    /**
     * Find an input or text area by the selector and emulate a keyboard event with the given value
     */
    type(selector: string | Element, value: string): void;
    hJsx(name: string, attrs: Record<string, string> | null, ...children: (Node | string | (Node | string)[])[]): HTMLElement;
    trigger: ITrigger;
    /**
     * A helper to scroll and trigger a scroll even on an element matching the given selector
     */
    scrollBy(selector: string, options: number | ScrollToOptions): void;
    flush(): void;
}
export declare type ITrigger = ((selector: string, event: string, init?: CustomEventInit) => void) & {
    click(selector: string, init?: CustomEventInit): void;
    change(selector: string, init?: CustomEventInit): void;
    input(selector: string, init?: CustomEventInit): void;
    scroll(selector: string, init?: CustomEventInit): void;
};
export interface IFixtureBuilderBase<T, E = {}> {
    html(html: string): this & E;
    html<M>(html: TemplateStringsArray, ...values: TemplateValues<M>[]): this & E;
    component(comp: T): this & E;
    deps(...args: unknown[]): this & E;
}
declare type BuilderMethodNames = 'html' | 'component' | 'deps';
declare type CreateBuilder<T, Availables extends BuilderMethodNames> = {
    [key in Availables]: key extends 'html' ? {
        (html: string): CreateBuilder<T, Exclude<Availables, 'html'>>;
        (html: TemplateStringsArray, ...values: TemplateValues<T>[]): CreateBuilder<T, Exclude<Availables, 'html'>>;
    } : (...args: Parameters<IFixtureBuilderBase<T>[key]>) => CreateBuilder<T, Exclude<Availables, key>>;
} & ('html' extends Availables ? {} : {
    build(): IFixture<T>;
});
declare type TaggedTemplateLambda<M> = (vm: M) => unknown;
declare type TemplateValues<M> = string | number | TaggedTemplateLambda<M>;
export {};
//# sourceMappingURL=startup.d.ts.map