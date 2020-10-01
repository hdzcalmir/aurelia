import { IContainer, IResolver } from '@aurelia/kernel';
import { IDOM, INode, INodeSequence, IRenderLocation } from '@aurelia/runtime';
export declare const enum NodeType {
    Element = 1,
    Attr = 2,
    Text = 3,
    CDATASection = 4,
    EntityReference = 5,
    Entity = 6,
    ProcessingInstruction = 7,
    Comment = 8,
    Document = 9,
    DocumentType = 10,
    DocumentFragment = 11,
    Notation = 12
}
/**
 * IDOM implementation for Html.
 */
export declare class HTMLDOM implements IDOM {
    readonly window: Window;
    readonly document: Document;
    readonly Node: typeof Node;
    readonly Element: typeof Element;
    readonly HTMLElement: typeof HTMLElement;
    readonly CustomEvent: typeof CustomEvent;
    readonly CSSStyleSheet: typeof CSSStyleSheet;
    readonly ShadowRoot: typeof ShadowRoot;
    private readonly emptyNodes;
    constructor(window: Window, document: Document, TNode: typeof Node, TElement: typeof Element, THTMLElement: typeof HTMLElement, TCustomEvent: typeof CustomEvent, TCSSStyleSheet: typeof CSSStyleSheet, TShadowRoot: typeof ShadowRoot);
    static register(container: IContainer): IResolver<IDOM>;
    addEventListener(eventName: string, subscriber: EventListenerOrEventListenerObject, publisher?: Node, options?: boolean | AddEventListenerOptions): void;
    appendChild(parent: Node, child: Node): void;
    cloneNode<T>(node: T, deep?: boolean): T;
    convertToRenderLocation(node: Node): IRenderLocation;
    createDocumentFragment(markupOrNode?: string | Node): DocumentFragment;
    createNodeSequence(fragment: DocumentFragment | null, cloneNode?: boolean): FragmentNodeSequence;
    createElement(name: string): HTMLElement;
    fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;
    createCustomEvent<T = any>(eventType: string, options?: CustomEventInit<T>): CustomEvent<T>;
    dispatchEvent(evt: Event): void;
    createNodeObserver(node: Node, cb: MutationCallback, init: MutationObserverInit): MutationObserver;
    createTemplate(markup?: unknown): HTMLTemplateElement;
    createTextNode(text: string): Text;
    /**
     * Returns the effective parentNode according to Aurelia's component hierarchy.
     *
     * Used by Aurelia to find the closest parent controller relative to a node.
     *
     * This method supports 3 additional scenarios that `node.parentNode` does not support:
     * - Containerless elements. The parentNode in this case is a comment precending the element under specific conditions, rather than a node wrapping the element.
     * - ShadowDOM. If a `ShadowRoot` is encountered, this method retrieves the associated controller via the metadata api to locate the original host.
     * - Portals. If the provided node was moved to a different location in the DOM by a `portal` attribute, then the original parent of the node will be returned.
     *
     * @param node - The node to get the parent for.
     * @returns Either the closest parent node, the closest `IRenderLocation` (comment node that is the containerless host), original portal host, or `null` if this is either the absolute document root or a disconnected node.
     */
    getEffectiveParentNode(node: Node): Node | null;
    /**
     * Set the effective parentNode, overriding the DOM-based structure that `getEffectiveParentNode` otherwise defaults to.
     *
     * Used by Aurelia's `portal` template controller to retain the linkage between the portaled nodes (after they are moved to the portal target) and the original `portal` host.
     *
     * @param nodeSequence - The node sequence whose children that, when `getEffectiveParentNode` is called on, return the supplied `parentNode`.
     * @param parentNode - The node to return when `getEffectiveParentNode` is called on any child of the supplied `nodeSequence`.
     */
    setEffectiveParentNode(nodeSequence: INodeSequence, parentNode: Node): void;
    /**
     * Set the effective parentNode, overriding the DOM-based structure that `getEffectiveParentNode` otherwise defaults to.
     *
     * Used by Aurelia's `portal` template controller to retain the linkage between the portaled nodes (after they are moved to the portal target) and the original `portal` host.
     *
     * @param childNode - The node that, when `getEffectiveParentNode` is called on, returns the supplied `parentNode`.
     * @param parentNode - The node to return when `getEffectiveParentNode` is called on the supplied `childNode`.
     */
    setEffectiveParentNode(childNode: Node, parentNode: Node): void;
    insertBefore(nodeToInsert: Node, referenceNode: Node): void;
    isMarker(node: unknown): node is HTMLElement;
    isNodeInstance(potentialNode: unknown): potentialNode is Node;
    isRenderLocation(node: unknown): node is IRenderLocation;
    makeTarget(node: unknown): void;
    registerElementResolver(container: IContainer, resolver: IResolver): void;
    remove(node: Node): void;
    removeEventListener(eventName: string, subscriber: EventListenerOrEventListenerObject, publisher?: Node, options?: boolean | EventListenerOptions): void;
    setAttribute(node: Element, name: string, value: unknown): void;
}
declare const $DOM: HTMLDOM;
export { $DOM as DOM };
export interface AuMarker extends INode {
}
export declare const IWindow: import("@aurelia/kernel").InterfaceSymbol<IWindow>;
export interface IWindow extends Window {
}
export declare const ILocation: import("@aurelia/kernel").InterfaceSymbol<ILocation>;
export interface ILocation extends Location {
}
export declare const IHistory: import("@aurelia/kernel").InterfaceSymbol<IHistory>;
/**
 * https://developer.mozilla.org/en-US/docs/Web/API/History
 *
 * A convenience interface that (unless explicitly overridden in DI) resolves directly to the native browser `history` object.
 *
 * Allows manipulation of the browser session history, that is the pages visited in the tab or frame that the current page is loaded in.
 */
export interface IHistory extends History {
    /**
     * Returns an integer representing the number of elements in the session history, including the currently loaded page.
     * For example, for a page loaded in a new tab this property returns 1.
     */
    readonly length: number;
    /**
     * Allows web applications to explicitly set default scroll restoration behavior on history navigation.
     *
     * - `auto` The location on the page to which the user has scrolled will be restored.
     * - `manual` The location on the page is not restored. The user will have to scroll to the location manually.
     */
    scrollRestoration: ScrollRestoration;
    /**
     * Returns a value representing the state at the top of the history stack.
     * This is a way to look at the state without having to wait for a popstate event
     */
    readonly state: unknown;
    /**
     * Causes the browser to move back one page in the session history.
     * It has the same effect as calling history.go(-1).
     * If there is no previous page, this method call does nothing.
     *
     * This method is asynchronous.
     * Add a listener for the `popstate` event in order to determine when the navigation has completed.
     */
    back(): void;
    /**
     * Causes the browser to move forward one page in the session history.
     * It has the same effect as calling `history.go(1)`.
     *
     * This method is asynchronous.
     * Add a listener for the `popstate` event in order to determine when the navigation has completed.
     */
    forward(): void;
    /**
     * https://developer.mozilla.org/en-US/docs/Web/API/History/go
     *
     * Loads a specific page from the session history.
     * You can use it to move forwards and backwards through the history depending on the value of a parameter.
     *
     * This method is asynchronous.
     * Add a listener for the `popstate` event in order to determine when the navigation has completed.
     *
     * @param delta - The position in the history to which you want to move, relative to the current page.
     * A negative value moves backwards, a positive value moves forwards.
     * So, for example, `history.go(2)` moves forward two pages and `history.go(-2)` moves back two pages.
     * If no value is passed or if `delta` equals 0, it has the same result as calling `location.reload()`.
     */
    go(delta?: number): void;
    /**
     * https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
     *
     * Adds a state to the browser's session history stack.
     *
     * @param state - An object which is associated with the new history entry created by `pushState`.
     * Whenever the user navigates to the new state, a `popstate` event is fired, and the state property of the event contains a copy of the history entry's state object.
     * The state object can be anything that can be serialized.
     * @param title - Most browsers currently ignores this parameter, although they may use it in the future.
     * Passing the empty string here should be safe against future changes to the method.
     * Alternatively, you could pass a short title for the state.
     * @param url - The new history entry's URL is given by this parameter.
     * Note that the browser won't attempt to load this URL after a call to pushState(), but it might attempt to load the URL later, for instance after the user restarts the browser.
     * The new URL does not need to be absolute; if it's relative, it's resolved relative to the current URL.
     * The new URL must be of the same origin as the current URL; otherwise, pushState() will throw an exception.
     * If this parameter isn't specified, it's set to the document's current URL.
     */
    pushState(state: {} | null, title: string, url?: string | null): void;
    /**
     * https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
     *
     * Modifies the current history entry, replacing it with the stateObj, title, and URL passed in the method parameters.
     *
     * This method is particularly useful when you want to update the state object or URL of the current history entry in response to some user action.
     *
     * @param state - An object which is associated with the history entry passed to the `replaceState` method.
     * @param title - Most browsers currently ignores this parameter, although they may use it in the future.
     * Passing the empty string here should be safe against future changes to the method.
     * Alternatively, you could pass a short title for the state.
     * @param url - The URL of the history entry.
     * The new URL must be of the same origin as the current URL; otherwise `replaceState` throws an exception.
     */
    replaceState(state: {} | null, title: string, url?: string | null): void;
}
//# sourceMappingURL=dom.d.ts.map