import { Metadata, isObject } from '@aurelia/metadata';
import { DI, IEventAggregator, ILogger, Protocol, emptyArray, onResolve, onResolveAll, emptyObject, Registration, IContainer, isArrayIndex, IModuleLoader, InstanceProvider, noop } from '@aurelia/kernel';
import { isCustomElementViewModel, IHistory, ILocation, IWindow, CustomElement, Controller, IPlatform, CustomElementDefinition, IController, IAppRoot, isCustomElementController, customElement, bindable, customAttribute, INode, getRef, CustomAttribute, AppTask } from '@aurelia/runtime-html';
import { RecognizedRoute, Endpoint, ConfigurableRoute, RESIDUE, RouteRecognizer } from '@aurelia/route-recognizer';

class Batch {
    constructor(stack, cb, head) {
        this.stack = stack;
        this.cb = cb;
        this.done = false;
        this.next = null;
        this.head = head ?? this;
    }
    static start(cb) {
        return new Batch(0, cb, null);
    }
    push() {
        let cur = this;
        do {
            ++cur.stack;
            cur = cur.next;
        } while (cur !== null);
    }
    pop() {
        let cur = this;
        do {
            if (--cur.stack === 0) {
                cur.invoke();
            }
            cur = cur.next;
        } while (cur !== null);
    }
    invoke() {
        const cb = this.cb;
        if (cb !== null) {
            this.cb = null;
            cb(this);
            this.done = true;
        }
    }
    continueWith(cb) {
        if (this.next === null) {
            return this.next = new Batch(this.stack, cb, this.head);
        }
        else {
            return this.next.continueWith(cb);
        }
    }
    start() {
        this.head.push();
        this.head.pop();
        return this;
    }
}
function mergeDistinct(prev, next) {
    prev = prev.slice();
    next = next.slice();
    const merged = [];
    while (prev.length > 0) {
        const p = prev.shift();
        const prevVpa = p.context.vpa;
        if (merged.every(m => m.context.vpa !== prevVpa)) {
            const i = next.findIndex(n => n.context.vpa === prevVpa);
            if (i >= 0) {
                merged.push(...next.splice(0, i + 1));
            }
            else {
                merged.push(p);
            }
        }
    }
    merged.push(...next);
    return merged;
}
function tryStringify(value) {
    try {
        return JSON.stringify(value);
    }
    catch {
        return Object.prototype.toString.call(value);
    }
}
function ensureArrayOfStrings(value) {
    return typeof value === 'string' ? [value] : value;
}
function ensureString(value) {
    return typeof value === 'string' ? value : value[0];
}
function mergeURLSearchParams(source, other, clone) {
    const query = clone ? new URLSearchParams(source) : source;
    if (other == null)
        return query;
    for (const [key, value] of Object.entries(other)) {
        query.append(key, value);
    }
    return query;
}

/**
 * @returns `true` if the given `value` is an non-null, non-undefined, and non-CustomElement object.
 */
function isNotNullishOrTypeOrViewModel(value) {
    return (typeof value === 'object' &&
        value !== null &&
        !isCustomElementViewModel(value));
}
function isPartialCustomElementDefinition(value) {
    // 'name' is the only mandatory property of a CustomElementDefinition.
    // It overlaps with RouteType and may overlap with CustomElementViewModel, so this ducktype check is only valid when those are ruled out *first*
    return (isNotNullishOrTypeOrViewModel(value) &&
        Object.prototype.hasOwnProperty.call(value, 'name') === true);
}
function isPartialChildRouteConfig(value) {
    // 'component' is the only mandatory property of a ChildRouteConfig
    // It may overlap with RouteType and CustomElementViewModel, so this ducktype check is only valid when those are ruled out *first*
    return (isNotNullishOrTypeOrViewModel(value) &&
        Object.prototype.hasOwnProperty.call(value, 'component') === true);
}
function isPartialRedirectRouteConfig(value) {
    // 'redirectTo' and 'path' are mandatory properties of a RedirectRouteConfig
    // It may overlap with RouteType and CustomElementViewModel, so this ducktype check is only valid when those are ruled out *first*
    return (isNotNullishOrTypeOrViewModel(value) &&
        Object.prototype.hasOwnProperty.call(value, 'redirectTo') === true);
}
// Yes, `isPartialChildRouteConfig` and `isPartialViewportInstruction` have identical logic but since that is coincidental,
// and the two are intended to be used in specific contexts, we keep these as two separate functions for now.
function isPartialViewportInstruction(value) {
    // 'component' is the only mandatory property of a INavigationInstruction
    // It may overlap with RouteType and CustomElementViewModel, so this ducktype check is only valid when those are ruled out *first*
    return (isNotNullishOrTypeOrViewModel(value) &&
        Object.prototype.hasOwnProperty.call(value, 'component') === true);
}
function expectType(expected, prop, value) {
    throw new Error(`Invalid route config property: "${prop}". Expected ${expected}, but got ${tryStringify(value)}.`);
}
/**
 * Validate a `IRouteConfig` or `IChildRouteConfig`.
 *
 * The validation of these types is the same, except that `component` is a mandatory property of `IChildRouteConfig`.
 * This property is checked for in `validateComponent`.
 */
function validateRouteConfig(config, parentPath) {
    if (config === null || config === void 0) {
        throw new Error(`Invalid route config: expected an object or string, but got: ${String(config)}.`);
    }
    const keys = Object.keys(config);
    for (const key of keys) {
        const value = config[key];
        const path = [parentPath, key].join('.');
        switch (key) {
            case 'id':
            case 'viewport':
            case 'redirectTo':
                if (typeof value !== 'string') {
                    expectType('string', path, value);
                }
                break;
            case 'caseSensitive':
            case 'nav':
                if (typeof value !== 'boolean') {
                    expectType('boolean', path, value);
                }
                break;
            case 'data':
                if (typeof value !== 'object' || value === null) {
                    expectType('object', path, value);
                }
                break;
            case 'title':
                switch (typeof value) {
                    case 'string':
                    case 'function':
                        break;
                    default:
                        expectType('string or function', path, value);
                }
                break;
            case 'path':
                if (value instanceof Array) {
                    for (let i = 0; i < value.length; ++i) {
                        if (typeof value[i] !== 'string') {
                            expectType('string', `${path}[${i}]`, value[i]);
                        }
                    }
                }
                else if (typeof value !== 'string') {
                    expectType('string or Array of strings', path, value);
                }
                break;
            case 'component':
                validateComponent(value, path, 'component');
                break;
            case 'routes': {
                if (!(value instanceof Array)) {
                    expectType('Array', path, value);
                }
                for (const route of value) {
                    const childPath = `${path}[${value.indexOf(route)}]`;
                    validateComponent(route, childPath, 'component');
                }
                break;
            }
            case 'transitionPlan':
                switch (typeof value) {
                    case 'string':
                        switch (value) {
                            case 'none':
                            case 'replace':
                            case 'invoke-lifecycles':
                                break;
                            default:
                                expectType('string(\'none\'|\'replace\'|\'invoke-lifecycles\') or function', path, value);
                        }
                        break;
                    case 'function':
                        break;
                    default:
                        expectType('string(\'none\'|\'replace\'|\'invoke-lifecycles\') or function', path, value);
                }
                break;
            case 'fallback':
                validateComponent(value, path, 'fallback');
                break;
            default:
                // We don't *have* to throw here, but let's be as strict as possible until someone gives a valid reason for not doing so.
                throw new Error(`Unknown route config property: "${parentPath}.${key}". Please specify known properties only.`);
        }
    }
}
function validateRedirectRouteConfig(config, parentPath) {
    if (config === null || config === void 0) {
        throw new Error(`Invalid route config: expected an object or string, but got: ${String(config)}.`);
    }
    const keys = Object.keys(config);
    for (const key of keys) {
        const value = config[key];
        const path = [parentPath, key].join('.');
        switch (key) {
            case 'path':
                if (value instanceof Array) {
                    for (let i = 0; i < value.length; ++i) {
                        if (typeof value[i] !== 'string') {
                            expectType('string', `${path}[${i}]`, value[i]);
                        }
                    }
                }
                else if (typeof value !== 'string') {
                    expectType('string or Array of strings', path, value);
                }
                break;
            case 'redirectTo':
                if (typeof value !== 'string') {
                    expectType('string', path, value);
                }
                break;
            default:
                // We don't *have* to throw here, but let's be as strict as possible until someone gives a valid reason for not doing so.
                throw new Error(`Unknown redirect config property: "${parentPath}.${key}". Only 'path' and 'redirectTo' should be specified for redirects.`);
        }
    }
}
function validateComponent(component, parentPath, property) {
    switch (typeof component) {
        case 'function':
            break;
        case 'object':
            if (component instanceof Promise) {
                break;
            }
            if (isPartialRedirectRouteConfig(component)) {
                validateRedirectRouteConfig(component, parentPath);
                break;
            }
            if (isPartialChildRouteConfig(component)) {
                validateRouteConfig(component, parentPath);
                break;
            }
            if (!isCustomElementViewModel(component) &&
                !isPartialCustomElementDefinition(component)) {
                expectType(`an object with at least a '${property}' property (see Routeable)`, parentPath, component);
            }
            break;
        case 'string':
            break;
        default:
            expectType('function, object or string (see Routeable)', parentPath, component);
    }
}
// This function is intentionally restricted to Params type as it is used only for Params.
// Feel free to extends the typings as per need.
function shallowEquals(a, b) {
    if (a === b) {
        return true;
    }
    if (typeof a !== typeof b) {
        return false;
    }
    if (a === null || b === null) {
        return false;
    }
    if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
        return false;
    }
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) {
        return false;
    }
    for (let i = 0, ii = aKeys.length; i < ii; ++i) {
        const key = aKeys[i];
        if (key !== bKeys[i]) {
            return false;
        }
        if (a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}

function valueOrFuncToValue(instructions, valueOrFunc) {
    if (typeof valueOrFunc === 'function') {
        return valueOrFunc(instructions);
    }
    return valueOrFunc;
}
const IRouterOptions = /*@__PURE__*/ DI.createInterface('RouterOptions');
class RouterOptions {
    constructor(useUrlFragmentHash, useHref, 
    /**
     * The strategy to use for interacting with the browser's `history` object (if applicable).
     *
     * - `none`: do not interact with the `history` object at all.
     * - `replace`: replace the current state in history
     * - `push`: push a new state onto the history (default)
     * - A function that returns one of the 3 above values based on the navigation.
     *
     * Default: `push`
     */
    historyStrategy, 
    /**
     * An optional handler to build the title.
     * When configured, the work of building the title string is completely handed over to this function.
     * If this function returns `null`, the title is not updated.
     */
    buildTitle, 
    /**
     * When set to `false`, the navigation model won't be generated.
     * The default value is `true`.
     */
    useNavigationModel, 
    /**
     * The class that is added to the element by the `load` custom attribute, if the associated instruction is active.
     * If no value is provided while configuring router, no class will be added.
     * The default value is `null`.
     */
    activeClass) {
        this.useUrlFragmentHash = useUrlFragmentHash;
        this.useHref = useHref;
        this.historyStrategy = historyStrategy;
        this.buildTitle = buildTitle;
        this.useNavigationModel = useNavigationModel;
        this.activeClass = activeClass;
    }
    static create(input) {
        return new RouterOptions(input.useUrlFragmentHash ?? false, input.useHref ?? true, input.historyStrategy ?? 'push', input.buildTitle ?? null, input.useNavigationModel ?? true, input.activeClass ?? null);
    }
    /** @internal */
    _stringifyProperties() {
        return [
            ['historyStrategy', 'history'],
        ].map(([key, name]) => {
            const value = this[key];
            return `${name}:${typeof value === 'function' ? value : `'${value}'`}`;
        }).join(',');
    }
    toString() {
        return `RO(${this._stringifyProperties()})`;
    }
}
class NavigationOptions {
    constructor(
    /**
     * Same as `RouterOptions#historyStrategy`.
     */
    historyStrategy, title, titleSeparator, 
    /**
     * Specify a context to use for relative navigation.
     *
     * - `null` (or empty): navigate relative to the root (absolute navigation)
     * - `IRouteContext`: navigate relative to specifically this RouteContext (advanced users).
     * - `HTMLElement`: navigate relative to the routeable component (page) that directly or indirectly contains this element.
     * - `ICustomElementViewModel` (the `this` object when working from inside a view model): navigate relative to this component (if it was loaded as a route), or the routeable component (page) directly or indirectly containing it.
     * - `ICustomElementController`: same as `ICustomElementViewModel`, but using the controller object instead of the view model object (advanced users).
     */
    context, 
    /**
     * Specify an object to be serialized to a query string, and then set to the query string of the new URL.
     */
    queryParams, 
    /**
     * Specify the hash fragment for the new URL.
     */
    fragment, 
    /**
     * Specify any kind of state to be stored together with the history entry for this navigation.
     */
    state, transitionPlan) {
        this.historyStrategy = historyStrategy;
        this.title = title;
        this.titleSeparator = titleSeparator;
        this.context = context;
        this.queryParams = queryParams;
        this.fragment = fragment;
        this.state = state;
        this.transitionPlan = transitionPlan;
    }
    static create(routerOptions, input) {
        return new NavigationOptions(input.historyStrategy ?? routerOptions.historyStrategy, input.title ?? null, input.titleSeparator ?? ' | ', input.context ?? null, input.queryParams ?? null, input.fragment ?? '', input.state ?? null, input.transitionPlan ?? null);
    }
    clone() {
        return new NavigationOptions(this.historyStrategy, this.title, this.titleSeparator, this.context, { ...this.queryParams }, this.fragment, this.state === null ? null : { ...this.state }, this.transitionPlan);
    }
    /** @internal */
    _getHistoryStrategy(instructions) {
        return valueOrFuncToValue(instructions, this.historyStrategy);
    }
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

const AuNavId = 'au-nav-id';
class Subscription {
    constructor(events, 
    /**
     * A unique serial number that makes individual subscribers more easily distinguishable in chronological order.
     *
     * Mainly for debugging purposes.
     */
    serial, inner) {
        this.events = events;
        this.serial = serial;
        this.inner = inner;
        this.disposed = false;
    }
    dispose() {
        if (!this.disposed) {
            this.disposed = true;
            this.inner.dispose();
            const subscriptions = this.events['subscriptions'];
            subscriptions.splice(subscriptions.indexOf(this), 1);
        }
    }
}
const IRouterEvents = /*@__PURE__*/ DI.createInterface('IRouterEvents', x => x.singleton(RouterEvents));
let RouterEvents = class RouterEvents {
    constructor(ea, logger) {
        this.ea = ea;
        this.logger = logger;
        this.subscriptionSerial = 0;
        this.subscriptions = [];
        this.logger = logger.scopeTo('RouterEvents');
    }
    publish(event) {
        this.logger.trace(`publishing %s`, event);
        this.ea.publish(event.name, event);
    }
    subscribe(event, callback) {
        const subscription = new Subscription(this, ++this.subscriptionSerial, this.ea.subscribe(event, (message) => {
            this.logger.trace(`handling %s for subscription #${subscription.serial}`, event);
            callback(message);
        }));
        this.subscriptions.push(subscription);
        return subscription;
    }
};
RouterEvents = __decorate([
    __param(0, IEventAggregator),
    __param(1, ILogger)
], RouterEvents);
class LocationChangeEvent {
    get name() { return 'au:router:location-change'; }
    constructor(id, url, trigger, state) {
        this.id = id;
        this.url = url;
        this.trigger = trigger;
        this.state = state;
    }
    toString() {
        return `LocationChangeEvent(id:${this.id},url:'${this.url}',trigger:'${this.trigger}')`;
    }
}
class NavigationStartEvent {
    get name() { return 'au:router:navigation-start'; }
    constructor(id, instructions, trigger, managedState) {
        this.id = id;
        this.instructions = instructions;
        this.trigger = trigger;
        this.managedState = managedState;
    }
    toString() {
        return `NavigationStartEvent(id:${this.id},instructions:'${this.instructions}',trigger:'${this.trigger}')`;
    }
}
class NavigationEndEvent {
    get name() { return 'au:router:navigation-end'; }
    constructor(id, instructions, finalInstructions) {
        this.id = id;
        this.instructions = instructions;
        this.finalInstructions = finalInstructions;
    }
    toString() {
        return `NavigationEndEvent(id:${this.id},instructions:'${this.instructions}',finalInstructions:'${this.finalInstructions}')`;
    }
}
class NavigationCancelEvent {
    get name() { return 'au:router:navigation-cancel'; }
    constructor(id, instructions, reason) {
        this.id = id;
        this.instructions = instructions;
        this.reason = reason;
    }
    toString() {
        return `NavigationCancelEvent(id:${this.id},instructions:'${this.instructions}',reason:${String(this.reason)})`;
    }
}
class NavigationErrorEvent {
    get name() { return 'au:router:navigation-error'; }
    constructor(id, instructions, error) {
        this.id = id;
        this.instructions = instructions;
        this.error = error;
    }
    toString() {
        return `NavigationErrorEvent(id:${this.id},instructions:'${this.instructions}',error:${String(this.error)})`;
    }
}

const IBaseHref = /*@__PURE__*/ DI.createInterface('IBaseHref');
const ILocationManager = /*@__PURE__*/ DI.createInterface('ILocationManager', x => x.singleton(BrowserLocationManager));
/**
 * Default browser location manager.
 *
 * Encapsulates all DOM interactions (`window`, `location` and `history` apis) and exposes them in an environment-agnostic manner.
 *
 * This is internal API for the moment. The shape of this API (as well as in which package it resides) is also likely temporary.
 */
let BrowserLocationManager = class BrowserLocationManager {
    constructor(logger, events, history, location, window, baseHref, routerOptions) {
        this.logger = logger;
        this.events = events;
        this.history = history;
        this.location = location;
        this.window = window;
        this.baseHref = baseHref;
        this.eventId = 0;
        logger = this.logger = logger.root.scopeTo('LocationManager');
        logger.debug(`baseHref set to path: ${baseHref.href}`);
        this._event = routerOptions.useUrlFragmentHash ? 'hashchange' : 'popstate';
    }
    startListening() {
        this.logger.trace(`startListening()`);
        this.window.addEventListener(this._event, this, false);
    }
    stopListening() {
        this.logger.trace(`stopListening()`);
        this.window.removeEventListener(this._event, this, false);
    }
    handleEvent(event) {
        this.events.publish(new LocationChangeEvent(++this.eventId, this.getPath(), this._event, 'state' in event ? event.state : null));
    }
    pushState(state, title, url) {
        url = this.addBaseHref(url);
        try {
            const stateString = JSON.stringify(state);
            this.logger.trace(`pushState(state:${stateString},title:'${title}',url:'${url}')`);
        }
        catch (err) {
            this.logger.warn(`pushState(state:NOT_SERIALIZABLE,title:'${title}',url:'${url}')`);
        }
        this.history.pushState(state, title, url);
    }
    replaceState(state, title, url) {
        url = this.addBaseHref(url);
        try {
            const stateString = JSON.stringify(state);
            this.logger.trace(`replaceState(state:${stateString},title:'${title}',url:'${url}')`);
        }
        catch (err) {
            this.logger.warn(`replaceState(state:NOT_SERIALIZABLE,title:'${title}',url:'${url}')`);
        }
        this.history.replaceState(state, title, url);
    }
    getPath() {
        const { pathname, search, hash } = this.location;
        const path = this.removeBaseHref(`${pathname}${normalizeQuery(search)}${hash}`);
        this.logger.trace(`getPath() -> '${path}'`);
        return path;
    }
    currentPathEquals(path) {
        const equals = this.getPath() === this.removeBaseHref(path);
        this.logger.trace(`currentPathEquals(path:'${path}') -> ${equals}`);
        return equals;
    }
    addBaseHref(path) {
        const initialPath = path;
        let fullPath;
        let base = this.baseHref.href;
        if (base.endsWith('/')) {
            base = base.slice(0, -1);
        }
        if (base.length === 0) {
            fullPath = path;
        }
        else {
            if (path.startsWith('/')) {
                path = path.slice(1);
            }
            fullPath = `${base}/${path}`;
        }
        this.logger.trace(`addBaseHref(path:'${initialPath}') -> '${fullPath}'`);
        return fullPath;
    }
    removeBaseHref(path) {
        const $path = path;
        const basePath = this.baseHref.pathname;
        if (path.startsWith(basePath)) {
            path = path.slice(basePath.length);
        }
        path = normalizePath(path);
        this.logger.trace(`removeBaseHref(path:'${$path}') -> '${path}'`);
        return path;
    }
};
BrowserLocationManager = __decorate([
    __param(0, ILogger),
    __param(1, IRouterEvents),
    __param(2, IHistory),
    __param(3, ILocation),
    __param(4, IWindow),
    __param(5, IBaseHref),
    __param(6, IRouterOptions)
], BrowserLocationManager);
/**
 * Strip trailing `/index.html` and trailing `/` from the path, if present.
 */
function normalizePath(path) {
    let start;
    let end;
    let index;
    if ((index = path.indexOf('?')) >= 0 || (index = path.indexOf('#')) >= 0) {
        start = path.slice(0, index);
        end = path.slice(index);
    }
    else {
        start = path;
        end = '';
    }
    if (start.endsWith('/')) {
        start = start.slice(0, -1);
    }
    else if (start.endsWith('/index.html')) {
        start = start.slice(0, -11 /* '/index.html'.length */);
    }
    return `${start}${end}`;
}
function normalizeQuery(query) {
    return query.length > 0 && !query.startsWith('?') ? `?${query}` : query;
}

const noRoutes = emptyArray;
function defaultReentryBehavior(current, next) {
    if (!shallowEquals(current.params, next.params)) {
        return 'replace';
    }
    return 'none';
}
// Every kind of route configurations are normalized to this `RouteConfig` class.
class RouteConfig {
    get path() {
        const path = this._path;
        if (path.length > 0)
            return path;
        const ceDfn = CustomElement.getDefinition(this.component);
        return this._path = [ceDfn.name, ...ceDfn.aliases];
    }
    constructor(id, 
    /** @internal */
    _path, title, redirectTo, caseSensitive, transitionPlan, viewport, data, routes, fallback, component, nav) {
        this.id = id;
        this._path = _path;
        this.title = title;
        this.redirectTo = redirectTo;
        this.caseSensitive = caseSensitive;
        this.transitionPlan = transitionPlan;
        this.viewport = viewport;
        this.data = data;
        this.routes = routes;
        this.fallback = fallback;
        this.component = component;
        this.nav = nav;
        /** @internal */
        this._configurationFromHookApplied = false;
    }
    /** @internal */
    static _create(configOrPath, Type) {
        if (typeof configOrPath === 'string' || configOrPath instanceof Array) {
            const path = ensureArrayOfStrings(configOrPath);
            const redirectTo = Type?.redirectTo ?? null;
            const caseSensitive = Type?.caseSensitive ?? false;
            const id = ensureString(Type?.id ?? (path instanceof Array ? path[0] : path));
            const title = Type?.title ?? null;
            const reentryBehavior = Type?.transitionPlan ?? null;
            const viewport = Type?.viewport ?? defaultViewportName;
            const data = Type?.data ?? {};
            const children = Type?.routes ?? noRoutes;
            return new RouteConfig(id, path, title, redirectTo, caseSensitive, reentryBehavior, viewport, data, children, Type?.fallback ?? null, Type, Type?.nav ?? true);
        }
        else if (typeof configOrPath === 'object') {
            const config = configOrPath;
            validateRouteConfig(config, '');
            const path = ensureArrayOfStrings(config.path ?? Type?.path ?? emptyArray);
            const title = config.title ?? Type?.title ?? null;
            const redirectTo = config.redirectTo ?? Type?.redirectTo ?? null;
            const caseSensitive = config.caseSensitive ?? Type?.caseSensitive ?? false;
            const id = config.id ?? Type?.id ?? (path instanceof Array ? path[0] : path);
            const reentryBehavior = config.transitionPlan ?? Type?.transitionPlan ?? null;
            const viewport = config.viewport ?? Type?.viewport ?? defaultViewportName;
            const data = {
                ...Type?.data,
                ...config.data,
            };
            const children = [
                ...(config.routes ?? noRoutes),
                ...(Type?.routes ?? noRoutes),
            ];
            return new RouteConfig(id, path, title, redirectTo, caseSensitive, reentryBehavior, viewport, data, children, config.fallback ?? Type?.fallback ?? null, config.component ?? Type ?? null, config.nav ?? true);
        }
        else {
            expectType('string, function/class or object', '', configOrPath);
        }
    }
    /**
     * Invoked when this component is used as a child under another parent.
     * Creates a new route config applying the child route config.
     * Note that the current rote config is not mutated.
     *
     * @internal
     */
    applyChildRouteConfig(config, parentConfig) {
        validateRouteConfig(config, this.path[0] ?? '');
        const path = ensureArrayOfStrings(config.path ?? this.path);
        return new RouteConfig(ensureString(config.id ?? this.id ?? path), path, config.title ?? this.title, config.redirectTo ?? this.redirectTo, config.caseSensitive ?? this.caseSensitive, config.transitionPlan ?? this.transitionPlan ?? parentConfig?.transitionPlan ?? null, config.viewport ?? this.viewport, config.data ?? this.data, config.routes ?? this.routes, config.fallback ?? this.fallback ?? parentConfig?.fallback ?? null, this.component, // The RouteConfig is created using a definitive Type as component; do not overwrite it.
        config.nav ?? this.nav);
    }
    getTransitionPlan(cur, next) {
        const plan = this.transitionPlan ?? defaultReentryBehavior;
        return typeof plan === 'function' ? plan(cur, next) : plan;
    }
    /** @internal */
    _applyFromConfigurationHook(instance, parent, routeNode) {
        // start strict
        if (this._configurationFromHookApplied)
            throw new Error('Invalid operation, the configuration from the get hook is already applied.');
        if (typeof instance.getRouteConfig !== 'function')
            return;
        return onResolve(instance.getRouteConfig(parent, routeNode), value => {
            this._configurationFromHookApplied = true;
            if (value == null)
                return;
            let parentPath = parent?.path ?? '';
            if (typeof parentPath !== 'string') {
                parentPath = parentPath[0];
            }
            validateRouteConfig(value, parentPath);
            // the value from the hook takes precedence
            this.id = value.id ?? this.id;
            this._path = ensureArrayOfStrings(value.path ?? this.path);
            this.title = value.title ?? this.title;
            this.redirectTo = value.redirectTo ?? this.redirectTo;
            this.caseSensitive = value.caseSensitive ?? this.caseSensitive;
            this.transitionPlan = value.transitionPlan ?? this.transitionPlan;
            this.viewport = value.viewport ?? this.viewport;
            this.data = value.data ?? this.data;
            this.routes = value.routes ?? this.routes;
            this.fallback = value.fallback ?? this.fallback;
            this.nav = value.nav ?? this.nav;
        });
    }
    /** @internal */
    _clone() {
        return new RouteConfig(this.id, this.path, this.title, this.redirectTo, this.caseSensitive, this.transitionPlan, this.viewport, this.data, this.routes, this.fallback, this.component, this.nav);
    }
    /** @internal */
    _getFallback(viewportInstruction, routeNode, context) {
        const fallback = this.fallback;
        return typeof fallback === 'function'
            && !CustomElement.isType(fallback)
            ? fallback(viewportInstruction, routeNode, context)
            : fallback;
    }
    register(container) {
        /**
         * When an instance of the RouteConfig is created, via the static `_create` and `resolveRouteConfiguration`, the component is always resolved to a custom element.
         * This makes the process to registering to registering the custom element to the DI.
         * The component can only be null for redirection configurations and that is ignored here.
         */
        const component = this.component;
        if (component == null)
            return;
        container.register(component);
    }
}
const Route = {
    name: Protocol.resource.keyFor('route-configuration'),
    /**
     * Returns `true` if the specified type has any static route configuration (either via static properties or a &#64;route decorator)
     */
    isConfigured(Type) {
        return Metadata.hasOwn(Route.name, Type);
    },
    /**
     * Apply the specified configuration to the specified type, overwriting any existing configuration.
     */
    configure(configOrPath, Type) {
        const config = RouteConfig._create(configOrPath, Type);
        Metadata.define(Route.name, config, Type);
        return Type;
    },
    /**
     * Get the `RouteConfig` associated with the specified type, creating a new one if it does not yet exist.
     */
    getConfig(Type) {
        if (!Route.isConfigured(Type)) {
            // This means there was no @route decorator on the class.
            // However there might still be static properties, and this API provides a unified way of accessing those.
            Route.configure({}, Type /* , false */);
        }
        return Metadata.getOwn(Route.name, Type);
    },
};
function route(configOrPath) {
    return function (target) {
        return Route.configure(configOrPath, target /* , true */);
    };
}
/** @internal */
function resolveRouteConfiguration(routeable, isChild, parent, routeNode, context) {
    if (isPartialRedirectRouteConfig(routeable))
        return RouteConfig._create(routeable, null /* , false */);
    const [instruction, ceDef] = resolveCustomElementDefinition(routeable, context);
    return onResolve(ceDef, $ceDef => {
        const type = $ceDef.Type;
        const routeConfig = Route.getConfig(type);
        // If the component is used as a child, then apply the child configuration (comping from parent) and return a new RouteConfig with the configuration applied.
        if (isPartialChildRouteConfig(routeable))
            return routeConfig.applyChildRouteConfig(routeable, parent);
        // If the component is used as a child, then return a clone.
        // Rationale: as this component can be used multiple times as child (either under same parent or different parents), we don't want to mutate the original route config for the type.
        if (isChild)
            return routeConfig._clone();
        if (!routeConfig._configurationFromHookApplied
            && instruction.type === 4 /* NavigationInstructionType.IRouteViewModel */
            && typeof routeable.getRouteConfig === 'function') {
            return onResolve(routeConfig._applyFromConfigurationHook(routeable, parent, routeNode), () => routeConfig);
        }
        return routeConfig;
    });
}
/** @internal */
function resolveCustomElementDefinition(routeable, context) {
    const instruction = createNavigationInstruction(routeable);
    let ceDef;
    switch (instruction.type) {
        case 0 /* NavigationInstructionType.string */: {
            if (context == null)
                throw new Error(`When retrieving the RouteConfig for a component name, a RouteContext (that can resolve it) must be provided`);
            const component = context.container.find(CustomElement, instruction.value);
            if (component === null)
                throw new Error(`Could not find a CustomElement named '${instruction.value}' in the current container scope of ${context}. This means the component is neither registered at Aurelia startup nor via the 'dependencies' decorator or static property.`);
            ceDef = component;
            break;
        }
        case 2 /* NavigationInstructionType.CustomElementDefinition */:
            ceDef = instruction.value;
            break;
        case 4 /* NavigationInstructionType.IRouteViewModel */:
            // Get the class from the constructor property. There might be static properties on it.
            ceDef = CustomElement.getDefinition(instruction.value.constructor);
            break;
        case 3 /* NavigationInstructionType.Promise */:
            if (context == null)
                throw new Error(`RouteContext must be provided when resolving an imported module`);
            ceDef = context.resolveLazy(instruction.value);
            break;
    }
    return [instruction, ceDef];
}
function createNavigationInstruction(routeable) {
    return isPartialChildRouteConfig(routeable)
        ? createNavigationInstruction(routeable.component)
        : TypedNavigationInstruction.create(routeable);
}

// No-fallthrough disabled due to large numbers of false positives
class ViewportRequest {
    constructor(viewportName, componentName) {
        this.viewportName = viewportName;
        this.componentName = componentName;
    }
    toString() {
        return `VR(viewport:'${this.viewportName}',component:'${this.componentName}')`;
    }
}
const viewportAgentLookup = new WeakMap();
class ViewportAgent {
    get $state() { return $state(this.state); }
    get currState() { return this.state & 16256 /* State.curr */; }
    set currState(state) { this.state = (this.state & 127 /* State.next */) | state; }
    get nextState() { return this.state & 127 /* State.next */; }
    set nextState(state) { this.state = (this.state & 16256 /* State.curr */) | state; }
    constructor(viewport, hostController, ctx) {
        this.viewport = viewport;
        this.hostController = hostController;
        this.ctx = ctx;
        this.isActive = false;
        this.curCA = null;
        this.nextCA = null;
        this.state = 8256 /* State.bothAreEmpty */;
        this.$plan = 'replace';
        this.currNode = null;
        this.nextNode = null;
        this.currTransition = null;
        /** @internal */
        this._cancellationPromise = null;
        this.logger = ctx.container.get(ILogger).scopeTo(`ViewportAgent<${ctx.friendlyPath}>`);
        this.logger.trace(`constructor()`);
    }
    static for(viewport, ctx) {
        let viewportAgent = viewportAgentLookup.get(viewport);
        if (viewportAgent === void 0) {
            const controller = Controller.getCachedOrThrow(viewport);
            viewportAgentLookup.set(viewport, viewportAgent = new ViewportAgent(viewport, controller, ctx));
        }
        return viewportAgent;
    }
    /** @internal */
    _activateFromViewport(initiator, parent) {
        const tr = this.currTransition;
        if (tr !== null) {
            ensureTransitionHasNotErrored(tr);
        }
        this.isActive = true;
        switch (this.nextState) {
            case 64 /* State.nextIsEmpty */:
                switch (this.currState) {
                    case 8192 /* State.currIsEmpty */:
                        this.logger.trace(`activateFromViewport() - nothing to activate at %s`, this);
                        return;
                    case 4096 /* State.currIsActive */:
                        this.logger.trace(`activateFromViewport() - activating existing componentAgent at %s`, this);
                        return this.curCA._activate(initiator, parent);
                    default:
                        this._unexpectedState('activateFromViewport 1');
                }
            case 2 /* State.nextLoadDone */: {
                if (this.currTransition === null) {
                    throw new Error(`Unexpected viewport activation outside of a transition context at ${this}`);
                }
                this.logger.trace(`activateFromViewport() - running ordinary activate at %s`, this);
                const b = Batch.start(b1 => { this._activate(initiator, this.currTransition, b1); });
                const p = new Promise(resolve => { b.continueWith(() => { resolve(); }); });
                return b.start().done ? void 0 : p;
            }
            default:
                this._unexpectedState('activateFromViewport 2');
        }
    }
    /** @internal */
    _deactivateFromViewport(initiator, parent) {
        const tr = this.currTransition;
        if (tr !== null) {
            ensureTransitionHasNotErrored(tr);
        }
        this.isActive = false;
        switch (this.currState) {
            case 8192 /* State.currIsEmpty */:
                this.logger.trace(`deactivateFromViewport() - nothing to deactivate at %s`, this);
                return;
            case 4096 /* State.currIsActive */:
                this.logger.trace(`deactivateFromViewport() - deactivating existing componentAgent at %s`, this);
                return this.curCA._deactivate(initiator, parent);
            case 128 /* State.currDeactivate */:
                // This will happen with bottom-up deactivation because the child is already deactivated, the parent
                // again tries to deactivate the child (that would be this viewport) but the router hasn't finalized the transition yet.
                // Since this is viewport was already deactivated, and we know the precise circumstance under which that happens, we can safely ignore the call.
                this.logger.trace(`deactivateFromViewport() - already deactivating at %s`, this);
                return;
            default: {
                if (this.currTransition === null) {
                    throw new Error(`Unexpected viewport deactivation outside of a transition context at ${this}`);
                }
                this.logger.trace(`deactivateFromViewport() - running ordinary deactivate at %s`, this);
                const b = Batch.start(b1 => { this._deactivate(initiator, this.currTransition, b1); });
                const p = new Promise(resolve => { b.continueWith(() => { resolve(); }); });
                return b.start().done ? void 0 : p;
            }
        }
    }
    /** @internal */
    _handles(req) {
        if (!this._isAvailable()) {
            return false;
        }
        const $vp = this.viewport;
        const reqVp = req.viewportName;
        const vp = $vp.name;
        /*
                         Name from viewport request
    
                         D (default)         N (Non-default)
    
              Name from  +-------------------------------------------+
         viewport agent  |                   |                       |
                         |        DD         |          DN           |
                         |    can handle     |      can't handle     |
              D (default)|                   |                       |
                         |                   |                       |
                         +-------------------------------------------+
                         |                   |                       |
         N (Non-default) |        DD         |          DD           |
                         |    can handle     |   can handle only     |
                         |                   |   if the names match  |
                         |                   |                       |
                         +-------------------------------------------+
        */
        if (reqVp !== defaultViewportName && vp !== reqVp) {
            this.logger.trace(`handles(req:%s) -> false (viewport names don't match '%s')`, req, vp);
            return false;
        }
        const usedBy = $vp.usedBy;
        if (usedBy.length > 0 && !usedBy.split(',').includes(req.componentName)) {
            this.logger.trace(`handles(req:%s) -> false (componentName not included in usedBy)`, req);
            return false;
        }
        this.logger.trace(`viewport '%s' handles(req:%s) -> true`, vp, req);
        return true;
    }
    /** @internal */
    _isAvailable() {
        if (!this.isActive) {
            this.logger.trace(`isAvailable -> false (viewport is not active)`);
            return false;
        }
        if (this.nextState !== 64 /* State.nextIsEmpty */) {
            this.logger.trace(`isAvailable -> false (update already scheduled for %s)`, this.nextNode);
            return false;
        }
        return true;
    }
    /** @internal */
    _canUnload(tr, b) {
        if (this.currTransition === null) {
            this.currTransition = tr;
        }
        ensureTransitionHasNotErrored(tr);
        if (tr.guardsResult !== true) {
            return;
        }
        b.push();
        void onResolve(this._cancellationPromise, () => {
            // run canUnload bottom-up
            Batch.start(b1 => {
                this.logger.trace(`canUnload() - invoking on children at %s`, this);
                for (const node of this.currNode.children) {
                    node.context.vpa._canUnload(tr, b1);
                }
            }).continueWith(b1 => {
                switch (this.currState) {
                    case 4096 /* State.currIsActive */:
                        this.logger.trace(`canUnload() - invoking on existing component at %s`, this);
                        switch (this.$plan) {
                            case 'none':
                                this.currState = 1024 /* State.currCanUnloadDone */;
                                return;
                            case 'invoke-lifecycles':
                            case 'replace':
                                this.currState = 2048 /* State.currCanUnload */;
                                b1.push();
                                Batch.start(b2 => {
                                    this.logger.trace(`canUnload() - finished invoking on children, now invoking on own component at %s`, this);
                                    this.curCA._canUnload(tr, this.nextNode, b2);
                                }).continueWith(() => {
                                    this.logger.trace(`canUnload() - finished at %s`, this);
                                    this.currState = 1024 /* State.currCanUnloadDone */;
                                    b1.pop();
                                }).start();
                                return;
                        }
                    case 8192 /* State.currIsEmpty */:
                        this.logger.trace(`canUnload() - nothing to unload at %s`, this);
                        return;
                    default:
                        tr.handleError(new Error(`Unexpected state at canUnload of ${this}`));
                }
            }).continueWith(() => {
                b.pop();
            }).start();
        });
    }
    /** @internal */
    _canLoad(tr, b) {
        if (this.currTransition === null) {
            this.currTransition = tr;
        }
        ensureTransitionHasNotErrored(tr);
        if (tr.guardsResult !== true) {
            return;
        }
        b.push();
        // run canLoad top-down
        Batch.start(b1 => {
            switch (this.nextState) {
                case 32 /* State.nextIsScheduled */:
                    this.logger.trace(`canLoad() - invoking on new component at %s`, this);
                    this.nextState = 16 /* State.nextCanLoad */;
                    switch (this.$plan) {
                        case 'none':
                            return;
                        case 'invoke-lifecycles':
                            return this.curCA._canLoad(tr, this.nextNode, b1);
                        case 'replace':
                            b1.push();
                            void onResolve(this.nextNode.context.createComponentAgent(this.hostController, this.nextNode), ca => {
                                (this.nextCA = ca)._canLoad(tr, this.nextNode, b1);
                                b1.pop();
                            });
                    }
                case 64 /* State.nextIsEmpty */:
                    this.logger.trace(`canLoad() - nothing to load at %s`, this);
                    return;
                default:
                    this._unexpectedState('canLoad');
            }
        }).continueWith(b1 => {
            const next = this.nextNode;
            switch (this.$plan) {
                case 'none':
                case 'invoke-lifecycles': {
                    this.logger.trace(`canLoad(next:%s) - plan set to '%s', compiling residue`, next, this.$plan);
                    // These plans can only occur if there is already a current component active in this viewport,
                    // and it is the same component as `next`.
                    // This means the RouteContext of `next` was created during a previous transition and might contain
                    // already-active children. If that is the case, we want to eagerly call the router hooks on them during the
                    // first pass of activation, instead of lazily in a later pass after `processResidue`.
                    // By calling `compileResidue` here on the current context, we're ensuring that such nodes are created and
                    // their target viewports have the appropriate updates scheduled.
                    b1.push();
                    const ctx = next.context;
                    void onResolve(ctx.resolved, () => onResolve(onResolve(onResolveAll(...next.residue.splice(0).map(vi => createAndAppendNodes(this.logger, next, vi))), () => onResolveAll(...ctx.getAvailableViewportAgents().reduce((acc, vpa) => {
                        const vp = vpa.viewport;
                        const component = vp.default;
                        if (component === null)
                            return acc;
                        acc.push(createAndAppendNodes(this.logger, next, ViewportInstruction.create({ component, viewport: vp.name, })));
                        return acc;
                    }, []))), () => { b1.pop(); }));
                    return;
                }
                case 'replace':
                    this.logger.trace(`canLoad(next:%s), delaying residue compilation until activate`, next, this.$plan);
                    return;
            }
        }).continueWith(b1 => {
            switch (this.nextState) {
                case 16 /* State.nextCanLoad */:
                    this.logger.trace(`canLoad() - finished own component, now invoking on children at %s`, this);
                    this.nextState = 8 /* State.nextCanLoadDone */;
                    for (const node of this.nextNode.children) {
                        node.context.vpa._canLoad(tr, b1);
                    }
                    return;
                case 64 /* State.nextIsEmpty */:
                    return;
                default:
                    this._unexpectedState('canLoad');
            }
        }).continueWith(() => {
            this.logger.trace(`canLoad() - finished at %s`, this);
            b.pop();
        }).start();
    }
    /** @internal */
    _unloading(tr, b) {
        ensureTransitionHasNotErrored(tr);
        ensureGuardsResultIsTrue(this, tr);
        b.push();
        // run unloading bottom-up
        Batch.start(b1 => {
            this.logger.trace(`unloading() - invoking on children at %s`, this);
            for (const node of this.currNode.children) {
                node.context.vpa._unloading(tr, b1);
            }
        }).continueWith(b1 => {
            switch (this.currState) {
                case 1024 /* State.currCanUnloadDone */:
                    this.logger.trace(`unloading() - invoking on existing component at %s`, this);
                    switch (this.$plan) {
                        case 'none':
                            this.currState = 256 /* State.currUnloadDone */;
                            return;
                        case 'invoke-lifecycles':
                        case 'replace':
                            this.currState = 512 /* State.currUnload */;
                            b1.push();
                            Batch.start(b2 => {
                                this.logger.trace(`unloading() - finished invoking on children, now invoking on own component at %s`, this);
                                this.curCA._unloading(tr, this.nextNode, b2);
                            }).continueWith(() => {
                                this.logger.trace(`unloading() - finished at %s`, this);
                                this.currState = 256 /* State.currUnloadDone */;
                                b1.pop();
                            }).start();
                            return;
                    }
                case 8192 /* State.currIsEmpty */:
                    this.logger.trace(`unloading() - nothing to unload at %s`, this);
                    for (const node of this.currNode.children) {
                        node.context.vpa._unloading(tr, b);
                    }
                    return;
                default:
                    this._unexpectedState('unloading');
            }
        }).continueWith(() => {
            b.pop();
        }).start();
    }
    /** @internal */
    _loading(tr, b) {
        ensureTransitionHasNotErrored(tr);
        ensureGuardsResultIsTrue(this, tr);
        b.push();
        // run load top-down
        Batch.start(b1 => {
            switch (this.nextState) {
                case 8 /* State.nextCanLoadDone */: {
                    this.logger.trace(`loading() - invoking on new component at %s`, this);
                    this.nextState = 4 /* State.nextLoad */;
                    switch (this.$plan) {
                        case 'none':
                            return;
                        case 'invoke-lifecycles':
                            return this.curCA._loading(tr, this.nextNode, b1);
                        case 'replace':
                            return this.nextCA._loading(tr, this.nextNode, b1);
                    }
                }
                case 64 /* State.nextIsEmpty */:
                    this.logger.trace(`loading() - nothing to load at %s`, this);
                    return;
                default:
                    this._unexpectedState('loading');
            }
        }).continueWith(b1 => {
            switch (this.nextState) {
                case 4 /* State.nextLoad */:
                    this.logger.trace(`loading() - finished own component, now invoking on children at %s`, this);
                    this.nextState = 2 /* State.nextLoadDone */;
                    for (const node of this.nextNode.children) {
                        node.context.vpa._loading(tr, b1);
                    }
                    return;
                case 64 /* State.nextIsEmpty */:
                    return;
                default:
                    this._unexpectedState('loading');
            }
        }).continueWith(() => {
            this.logger.trace(`loading() - finished at %s`, this);
            b.pop();
        }).start();
    }
    /** @internal */
    _deactivate(initiator, tr, b) {
        ensureTransitionHasNotErrored(tr);
        ensureGuardsResultIsTrue(this, tr);
        b.push();
        switch (this.currState) {
            case 256 /* State.currUnloadDone */:
                this.logger.trace(`deactivate() - invoking on existing component at %s`, this);
                this.currState = 128 /* State.currDeactivate */;
                switch (this.$plan) {
                    case 'none':
                    case 'invoke-lifecycles':
                        b.pop();
                        return;
                    case 'replace': {
                        const controller = this.hostController;
                        const curCa = this.curCA;
                        tr.run(() => {
                            return onResolve(curCa._deactivate(initiator, controller), () => {
                                // Call dispose if initiator is null. If there is an initiator present, then the curCa will be disposed when the initiator is disposed.
                                if (initiator === null) {
                                    curCa._dispose();
                                }
                            });
                        }, () => {
                            b.pop();
                        });
                    }
                }
                return;
            case 8192 /* State.currIsEmpty */:
                this.logger.trace(`deactivate() - nothing to deactivate at %s`, this);
                b.pop();
                return;
            case 128 /* State.currDeactivate */:
                this.logger.trace(`deactivate() - already deactivating at %s`, this);
                b.pop();
                return;
            default:
                this._unexpectedState('deactivate');
        }
    }
    /** @internal */
    _activate(initiator, tr, b) {
        ensureTransitionHasNotErrored(tr);
        ensureGuardsResultIsTrue(this, tr);
        b.push();
        if (this.nextState === 32 /* State.nextIsScheduled */) {
            this.logger.trace(`activate() - invoking canLoad(), loading() and activate() on new component due to resolution 'dynamic' at %s`, this);
            // This is the default v2 mode "lazy loading" situation
            Batch.start(b1 => {
                this._canLoad(tr, b1);
            }).continueWith(b1 => {
                this._loading(tr, b1);
            }).continueWith(b1 => {
                this._activate(initiator, tr, b1);
            }).continueWith(() => {
                b.pop();
            }).start();
            return;
        }
        switch (this.nextState) {
            case 2 /* State.nextLoadDone */:
                this.logger.trace(`activate() - invoking on existing component at %s`, this);
                this.nextState = 1 /* State.nextActivate */;
                // run activate top-down
                Batch.start(b1 => {
                    switch (this.$plan) {
                        case 'none':
                        case 'invoke-lifecycles':
                            return;
                        case 'replace': {
                            const controller = this.hostController;
                            tr.run(() => {
                                b1.push();
                                return this.nextCA._activate(initiator, controller);
                            }, () => {
                                b1.pop();
                            });
                        }
                    }
                }).continueWith(b1 => {
                    this._processDynamicChildren(tr, b1);
                }).continueWith(() => {
                    b.pop();
                }).start();
                return;
            case 64 /* State.nextIsEmpty */:
                this.logger.trace(`activate() - nothing to activate at %s`, this);
                b.pop();
                return;
            default:
                this._unexpectedState('activate');
        }
    }
    /** @internal */
    _swap(tr, b) {
        if (this.currState === 8192 /* State.currIsEmpty */) {
            this.logger.trace(`swap() - running activate on next instead, because there is nothing to deactivate at %s`, this);
            this._activate(null, tr, b);
            return;
        }
        if (this.nextState === 64 /* State.nextIsEmpty */) {
            this.logger.trace(`swap() - running deactivate on current instead, because there is nothing to activate at %s`, this);
            this._deactivate(null, tr, b);
            return;
        }
        ensureTransitionHasNotErrored(tr);
        ensureGuardsResultIsTrue(this, tr);
        if (!(this.currState === 256 /* State.currUnloadDone */ &&
            this.nextState === 2 /* State.nextLoadDone */)) {
            this._unexpectedState('swap');
        }
        this.currState = 128 /* State.currDeactivate */;
        this.nextState = 1 /* State.nextActivate */;
        switch (this.$plan) {
            case 'none':
            case 'invoke-lifecycles': {
                this.logger.trace(`swap() - skipping this level and swapping children instead at %s`, this);
                const nodes = mergeDistinct(this.nextNode.children, this.currNode.children);
                for (const node of nodes) {
                    node.context.vpa._swap(tr, b);
                }
                return;
            }
            case 'replace': {
                this.logger.trace(`swap() - running normally at %s`, this);
                const controller = this.hostController;
                const curCA = this.curCA;
                const nextCA = this.nextCA;
                b.push();
                Batch.start(b1 => {
                    tr.run(() => {
                        b1.push();
                        return onResolve(curCA._deactivate(null, controller), () => curCA._dispose());
                    }, () => {
                        b1.pop();
                    });
                }).continueWith(b1 => {
                    tr.run(() => {
                        b1.push();
                        return nextCA._activate(null, controller);
                    }, () => {
                        b1.pop();
                    });
                }).continueWith(b1 => {
                    this._processDynamicChildren(tr, b1);
                }).continueWith(() => {
                    b.pop();
                }).start();
                return;
            }
        }
    }
    /** @internal */
    _processDynamicChildren(tr, b) {
        this.logger.trace(`processDynamicChildren() - %s`, this);
        const next = this.nextNode;
        tr.run(() => {
            b.push();
            const ctx = next.context;
            return onResolve(ctx.resolved, () => {
                const existingChildren = next.children.slice();
                return onResolve(onResolveAll(...next
                    .residue
                    .splice(0)
                    .map(vi => createAndAppendNodes(this.logger, next, vi))), () => onResolve(onResolveAll(...ctx
                    .getAvailableViewportAgents()
                    .reduce((acc, vpa) => {
                    const vp = vpa.viewport;
                    const component = vp.default;
                    if (component === null)
                        return acc;
                    acc.push(createAndAppendNodes(this.logger, next, ViewportInstruction.create({ component, viewport: vp.name, })));
                    return acc;
                }, [])), () => next.children.filter(x => !existingChildren.includes(x))));
            });
        }, newChildren => {
            Batch.start(b1 => {
                for (const node of newChildren) {
                    tr.run(() => {
                        b1.push();
                        return node.context.vpa._canLoad(tr, b1);
                    }, () => {
                        b1.pop();
                    });
                }
            }).continueWith(b1 => {
                for (const node of newChildren) {
                    tr.run(() => {
                        b1.push();
                        return node.context.vpa._loading(tr, b1);
                    }, () => {
                        b1.pop();
                    });
                }
            }).continueWith(b1 => {
                for (const node of newChildren) {
                    tr.run(() => {
                        b1.push();
                        return node.context.vpa._activate(null, tr, b1);
                    }, () => {
                        b1.pop();
                    });
                }
            }).continueWith(() => {
                b.pop();
            }).start();
        });
    }
    /** @internal */
    _scheduleUpdate(options, next) {
        switch (this.nextState) {
            case 64 /* State.nextIsEmpty */:
                this.nextNode = next;
                this.nextState = 32 /* State.nextIsScheduled */;
                break;
            default:
                this._unexpectedState('scheduleUpdate 1');
        }
        switch (this.currState) {
            case 8192 /* State.currIsEmpty */:
            case 4096 /* State.currIsActive */:
            case 1024 /* State.currCanUnloadDone */:
                break;
            default:
                this._unexpectedState('scheduleUpdate 2');
        }
        const cur = this.curCA?.routeNode ?? null;
        if (cur === null || cur.component !== next.component) {
            // Component changed (or is cleared), so set to 'replace'
            this.$plan = 'replace';
        }
        else {
            // Component is the same, so determine plan based on config and/or convention
            this.$plan = options.transitionPlan ?? next.context.config.getTransitionPlan(cur, next);
        }
        this.logger.trace(`scheduleUpdate(next:%s) - plan set to '%s'`, next, this.$plan);
    }
    /** @internal */
    _cancelUpdate() {
        if (this.currNode !== null) {
            this.currNode.children.forEach(function (node) {
                node.context.vpa._cancelUpdate();
            });
        }
        if (this.nextNode !== null) {
            this.nextNode.children.forEach(function (node) {
                node.context.vpa._cancelUpdate();
            });
        }
        this.logger.trace(`cancelUpdate(nextNode:%s)`, this.nextNode);
        switch (this.currState) {
            case 8192 /* State.currIsEmpty */:
            case 4096 /* State.currIsActive */:
                break;
            case 2048 /* State.currCanUnload */:
            case 1024 /* State.currCanUnloadDone */:
                this.currState = 4096 /* State.currIsActive */;
                break;
            case 512 /* State.currUnload */:
            case 128 /* State.currDeactivate */:
                this.currState = 8192 /* State.currIsEmpty */;
                this.curCA = null;
                this.currTransition = null;
                break;
        }
        switch (this.nextState) {
            case 64 /* State.nextIsEmpty */:
            case 32 /* State.nextIsScheduled */:
            case 16 /* State.nextCanLoad */:
            case 8 /* State.nextCanLoadDone */:
                this.nextNode = null;
                this.nextState = 64 /* State.nextIsEmpty */;
                break;
            case 4 /* State.nextLoad */:
            case 1 /* State.nextActivate */: {
                this._cancellationPromise = onResolve(this.nextCA?._deactivate(null, this.hostController), () => {
                    this.nextCA?._dispose();
                    this.$plan = 'replace';
                    this.nextState = 64 /* State.nextIsEmpty */;
                    this.nextCA = null;
                    this.nextNode = null;
                    this.currTransition = null;
                    this._cancellationPromise = null;
                });
                break;
            }
        }
    }
    /** @internal */
    _endTransition() {
        if (this.currNode !== null) {
            this.currNode.children.forEach(function (node) {
                node.context.vpa._endTransition();
            });
        }
        if (this.nextNode !== null) {
            this.nextNode.children.forEach(function (node) {
                node.context.vpa._endTransition();
            });
        }
        if (this.currTransition !== null) {
            ensureTransitionHasNotErrored(this.currTransition);
            switch (this.nextState) {
                case 64 /* State.nextIsEmpty */:
                    switch (this.currState) {
                        case 8192 /* State.currIsEmpty */:
                        case 128 /* State.currDeactivate */:
                            this.logger.trace(`endTransition() - setting currState to State.nextIsEmpty at %s`, this);
                            this.currState = 8192 /* State.currIsEmpty */;
                            this.curCA = null;
                            break;
                        default:
                            this._unexpectedState('endTransition 1');
                    }
                    break;
                case 1 /* State.nextActivate */:
                    switch (this.currState) {
                        case 8192 /* State.currIsEmpty */:
                        case 128 /* State.currDeactivate */:
                            switch (this.$plan) {
                                case 'none':
                                case 'invoke-lifecycles':
                                    this.logger.trace(`endTransition() - setting currState to State.currIsActive at %s`, this);
                                    this.currState = 4096 /* State.currIsActive */;
                                    break;
                                case 'replace':
                                    this.logger.trace(`endTransition() - setting currState to State.currIsActive and reassigning curCA at %s`, this);
                                    this.currState = 4096 /* State.currIsActive */;
                                    this.curCA = this.nextCA;
                                    break;
                            }
                            this.currNode = this.nextNode;
                            break;
                        default:
                            this._unexpectedState('endTransition 2');
                    }
                    break;
                default:
                    this._unexpectedState('endTransition 3');
            }
            this.$plan = 'replace';
            this.nextState = 64 /* State.nextIsEmpty */;
            this.nextNode = null;
            this.nextCA = null;
            this.currTransition = null;
        }
    }
    toString() {
        return `VPA(state:${this.$state},plan:'${this.$plan}',n:${this.nextNode},c:${this.currNode},viewport:${this.viewport})`;
    }
    /** @internal */
    _dispose() {
        this.logger.trace(`dispose() - disposing %s`, this);
        this.curCA?._dispose();
    }
    /** @internal */
    _unexpectedState(label) {
        throw new Error(`Unexpected state at ${label} of ${this}`);
    }
}
function ensureGuardsResultIsTrue(vpa, tr) {
    if (tr.guardsResult !== true) {
        throw new Error(`Unexpected guardsResult ${tr.guardsResult} at ${vpa}`);
    }
}
function ensureTransitionHasNotErrored(tr) {
    if (tr.error !== void 0 && !tr.erredWithUnknownRoute)
        throw tr.error;
}
var State;
(function (State) {
    State[State["curr"] = 16256] = "curr";
    State[State["currIsEmpty"] = 8192] = "currIsEmpty";
    State[State["currIsActive"] = 4096] = "currIsActive";
    State[State["currCanUnload"] = 2048] = "currCanUnload";
    State[State["currCanUnloadDone"] = 1024] = "currCanUnloadDone";
    State[State["currUnload"] = 512] = "currUnload";
    State[State["currUnloadDone"] = 256] = "currUnloadDone";
    State[State["currDeactivate"] = 128] = "currDeactivate";
    State[State["next"] = 127] = "next";
    State[State["nextIsEmpty"] = 64] = "nextIsEmpty";
    State[State["nextIsScheduled"] = 32] = "nextIsScheduled";
    State[State["nextCanLoad"] = 16] = "nextCanLoad";
    State[State["nextCanLoadDone"] = 8] = "nextCanLoadDone";
    State[State["nextLoad"] = 4] = "nextLoad";
    State[State["nextLoadDone"] = 2] = "nextLoadDone";
    State[State["nextActivate"] = 1] = "nextActivate";
    State[State["bothAreEmpty"] = 8256] = "bothAreEmpty";
})(State || (State = {}));
// Stringifying uses arrays and does not have a negligible cost, so cache the results to not let trace logging
// in and of its own slow things down too much.
const $stateCache = new Map();
function $state(state) {
    let str = $stateCache.get(state);
    if (str === void 0) {
        $stateCache.set(state, str = stringifyState(state));
    }
    return str;
}
function stringifyState(state) {
    const flags = [];
    if ((state & 8192 /* State.currIsEmpty */) === 8192 /* State.currIsEmpty */) {
        flags.push('currIsEmpty');
    }
    if ((state & 4096 /* State.currIsActive */) === 4096 /* State.currIsActive */) {
        flags.push('currIsActive');
    }
    if ((state & 2048 /* State.currCanUnload */) === 2048 /* State.currCanUnload */) {
        flags.push('currCanUnload');
    }
    if ((state & 1024 /* State.currCanUnloadDone */) === 1024 /* State.currCanUnloadDone */) {
        flags.push('currCanUnloadDone');
    }
    if ((state & 512 /* State.currUnload */) === 512 /* State.currUnload */) {
        flags.push('currUnload');
    }
    if ((state & 256 /* State.currUnloadDone */) === 256 /* State.currUnloadDone */) {
        flags.push('currUnloadDone');
    }
    if ((state & 128 /* State.currDeactivate */) === 128 /* State.currDeactivate */) {
        flags.push('currDeactivate');
    }
    if ((state & 64 /* State.nextIsEmpty */) === 64 /* State.nextIsEmpty */) {
        flags.push('nextIsEmpty');
    }
    if ((state & 32 /* State.nextIsScheduled */) === 32 /* State.nextIsScheduled */) {
        flags.push('nextIsScheduled');
    }
    if ((state & 16 /* State.nextCanLoad */) === 16 /* State.nextCanLoad */) {
        flags.push('nextCanLoad');
    }
    if ((state & 8 /* State.nextCanLoadDone */) === 8 /* State.nextCanLoadDone */) {
        flags.push('nextCanLoadDone');
    }
    if ((state & 4 /* State.nextLoad */) === 4 /* State.nextLoad */) {
        flags.push('nextLoad');
    }
    if ((state & 2 /* State.nextLoadDone */) === 2 /* State.nextLoadDone */) {
        flags.push('nextLoadDone');
    }
    if ((state & 1 /* State.nextActivate */) === 1 /* State.nextActivate */) {
        flags.push('nextActivate');
    }
    return flags.join('|');
}

let nodeId = 0;
class RouteNode {
    get root() {
        return this.tree.root;
    }
    constructor(
    /** @internal */
    id, 
    /**
     * The original configured path pattern that was matched.
     */
    path, 
    /**
     * If one or more redirects have occurred, then this is the final path match, in all other cases this is identical to `path`
     */
    finalPath, 
    /**
     * The `RouteContext` associated with this route.
     *
     * Child route components will be created by this context.
     *
     * Viewports that live underneath the component associated with this route, will be registered to this context.
     */
    context, 
    /** @internal */
    originalInstruction, 
    /** Can only be `null` for the composition root */
    instruction, params, queryParams, fragment, data, 
    /**
     * The viewport is always `null` for the root `RouteNode`.
     *
     * NOTE: It might make sense to have a `null` viewport mean other things as well (such as, don't load this component)
     * but that is currently not a deliberately implemented feature and we might want to explicitly validate against it
     * if we decide not to implement that.
     */
    viewport, title, component, children, 
    /**
     * Not-yet-resolved viewport instructions.
     *
     * Instructions need an `IRouteContext` to be resolved into complete `RouteNode`s.
     *
     * Resolved instructions are removed from this array, such that a `RouteNode` can be considered
     * "fully resolved" when it has `residue.length === 0` and `children.length >= 0`
     */
    residue) {
        this.id = id;
        this.path = path;
        this.finalPath = finalPath;
        this.context = context;
        this.originalInstruction = originalInstruction;
        this.instruction = instruction;
        this.params = params;
        this.queryParams = queryParams;
        this.fragment = fragment;
        this.data = data;
        this.viewport = viewport;
        this.title = title;
        this.component = component;
        this.children = children;
        this.residue = residue;
        /** @internal */
        this.version = 1;
        this.originalInstruction ?? (this.originalInstruction = instruction);
    }
    static create(input) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [RESIDUE]: _, ...params } = input.params ?? {};
        return new RouteNode(
        /*          id */ ++nodeId, 
        /*        path */ input.path, 
        /*   finalPath */ input.finalPath, 
        /*     context */ input.context, 
        /* originalIns */ input.originalInstruction ?? input.instruction, 
        /* instruction */ input.instruction, 
        /*      params */ params, 
        /* queryParams */ input.queryParams ?? emptyQuery, 
        /*    fragment */ input.fragment ?? null, 
        /*        data */ input.data ?? {}, 
        /*    viewport */ input.viewport ?? null, 
        /*       title */ input.title ?? null, 
        /*   component */ input.component, 
        /*    children */ input.children ?? [], 
        /*     residue */ input.residue ?? []);
    }
    contains(instructions, preferEndpointMatch) {
        if (this.context === instructions.options.context) {
            const nodeChildren = this.children;
            const instructionChildren = instructions.children;
            for (let i = 0, ii = nodeChildren.length; i < ii; ++i) {
                for (let j = 0, jj = instructionChildren.length; j < jj; ++j) {
                    const instructionChild = instructionChildren[j];
                    const instructionEndpoint = preferEndpointMatch ? instructionChild.recognizedRoute?.route.endpoint : null;
                    const nodeChild = nodeChildren[i + j];
                    if (i + j < ii
                        && ((instructionEndpoint != null && nodeChild.instruction?.recognizedRoute?.route.endpoint === instructionEndpoint)
                            || (nodeChild.originalInstruction?.contains(instructionChild) ?? false))) {
                        if (j + 1 === jj) {
                            return true;
                        }
                    }
                    else {
                        break;
                    }
                }
            }
        }
        return this.children.some(function (x) {
            return x.contains(instructions, preferEndpointMatch);
        });
    }
    appendChild(child) {
        this.children.push(child);
        child.setTree(this.tree);
    }
    clearChildren() {
        for (const c of this.children) {
            c.clearChildren();
            c.context.vpa._cancelUpdate();
        }
        this.children.length = 0;
    }
    getTitle(separator) {
        const titleParts = [
            ...this.children.map(x => x.getTitle(separator)),
            this.getTitlePart(),
        ].filter(x => x !== null);
        if (titleParts.length === 0) {
            return null;
        }
        return titleParts.join(separator);
    }
    getTitlePart() {
        if (typeof this.title === 'function') {
            return this.title.call(void 0, this);
        }
        return this.title;
    }
    computeAbsolutePath() {
        if (this.context.isRoot) {
            return '';
        }
        const parentPath = this.context.parent.node.computeAbsolutePath();
        const thisPath = this.instruction.toUrlComponent(false);
        if (parentPath.length > 0) {
            if (thisPath.length > 0) {
                return [parentPath, thisPath].join('/');
            }
            return parentPath;
        }
        return thisPath;
    }
    /** @internal */
    setTree(tree) {
        this.tree = tree;
        for (const child of this.children) {
            child.setTree(tree);
        }
    }
    /** @internal */
    finalizeInstruction() {
        const children = this.children.map(x => x.finalizeInstruction());
        const instruction = this.instruction.clone();
        instruction.children.splice(0, instruction.children.length, ...children);
        return this.instruction = instruction;
    }
    /** @internal */
    clone() {
        const clone = new RouteNode(this.id, this.path, this.finalPath, this.context, this.originalInstruction, this.instruction, { ...this.params }, new URLSearchParams(this.queryParams), this.fragment, { ...this.data }, this.viewport, this.title, this.component, this.children.map(x => x.clone()), [...this.residue]);
        clone.version = this.version + 1;
        if (clone.context.node === this) {
            clone.context.node = clone;
        }
        return clone;
    }
    toString() {
        const props = [];
        const component = this.context?.config.component?.name ?? '';
        if (component.length > 0) {
            props.push(`c:'${component}'`);
        }
        const path = this.context?.config.path ?? '';
        if (path.length > 0) {
            props.push(`path:'${path}'`);
        }
        if (this.children.length > 0) {
            props.push(`children:[${this.children.map(String).join(',')}]`);
        }
        if (this.residue.length > 0) {
            props.push(`residue:${this.residue.map(function (r) {
                if (typeof r === 'string') {
                    return `'${r}'`;
                }
                return String(r);
            }).join(',')}`);
        }
        return `RN(ctx:'${this.context?.friendlyPath}',${props.join(',')})`;
    }
}
class RouteTree {
    constructor(options, queryParams, fragment, root) {
        this.options = options;
        this.queryParams = queryParams;
        this.fragment = fragment;
        this.root = root;
    }
    contains(instructions, preferEndpointMatch) {
        return this.root.contains(instructions, preferEndpointMatch);
    }
    clone() {
        const clone = new RouteTree(this.options.clone(), new URLSearchParams(this.queryParams), this.fragment, this.root.clone());
        clone.root.setTree(this);
        return clone;
    }
    finalizeInstructions() {
        return new ViewportInstructionTree(this.options, true, this.root.children.map(x => x.finalizeInstruction()), this.queryParams, this.fragment);
    }
    toString() {
        return this.root.toString();
    }
}
function createAndAppendNodes(log, node, vi) {
    log.trace(`createAndAppendNodes(node:%s,vi:%s`, node, vi);
    switch (vi.component.type) {
        case 0 /* NavigationInstructionType.string */:
            switch (vi.component.value) {
                case '..':
                    // Allow going "too far up" just like directory command `cd..`, simply clamp it to the root
                    node = node.context.parent?.node ?? node;
                    node.clearChildren();
                // falls through
                case '.':
                    return onResolveAll(...vi.children.map(childVI => {
                        return createAndAppendNodes(log, node, childVI);
                    }));
                default: {
                    log.trace(`createAndAppendNodes invoking createNode`);
                    const ctx = node.context;
                    const originalInstruction = vi.clone();
                    let rr = vi.recognizedRoute;
                    // early return; we already have a recognized route, don't bother with the rest.
                    if (rr !== null)
                        return appendNode(log, node, createConfiguredNode(log, node, vi, rr, originalInstruction));
                    // if there are children, then then it might be the case that the parameters are put in the children, and that case it is best to go the default flow.
                    // However, when that's not the case, then we perhaps try to lookup the route-id.
                    // This is another early termination.
                    if (vi.children.length === 0) {
                        const result = ctx.generateViewportInstruction(vi);
                        if (result !== null) {
                            node.tree.queryParams = mergeURLSearchParams(node.tree.queryParams, result.query, true);
                            const newVi = result.vi;
                            newVi.children.push(...vi.children);
                            return appendNode(log, node, createConfiguredNode(log, node, newVi, newVi.recognizedRoute, vi));
                        }
                    }
                    let collapse = 0;
                    let path = vi.component.value;
                    let cur = vi;
                    while (cur.children.length === 1) {
                        cur = cur.children[0];
                        if (cur.component.type === 0 /* NavigationInstructionType.string */) {
                            ++collapse;
                            path = `${path}/${cur.component.value}`;
                        }
                        else {
                            break;
                        }
                    }
                    rr = ctx.recognize(path);
                    log.trace('createNode recognized route: %s', rr);
                    const residue = rr?.residue ?? null;
                    log.trace('createNode residue:', residue);
                    const noResidue = residue === null;
                    // If the residue matches the whole path it means that empty route is configured, but the path in itself is not configured.
                    // Therefore the path matches the configured empty route and puts the whole path into residue.
                    if (rr === null || residue === path) {
                        // check if a route-id is used
                        const eagerResult = ctx.generateViewportInstruction({
                            component: vi.component.value,
                            params: vi.params ?? emptyObject,
                            open: vi.open,
                            close: vi.close,
                            viewport: vi.viewport,
                            children: vi.children.slice(),
                        });
                        if (eagerResult !== null) {
                            node.tree.queryParams = mergeURLSearchParams(node.tree.queryParams, eagerResult.query, true);
                            return appendNode(log, node, createConfiguredNode(log, node, eagerResult.vi, eagerResult.vi.recognizedRoute, vi));
                        }
                        // fallback
                        const name = vi.component.value;
                        if (name === '')
                            return;
                        let vp = vi.viewport;
                        if (vp === null || vp.length === 0)
                            vp = defaultViewportName;
                        const vpa = ctx.getFallbackViewportAgent(vp);
                        const fallback = vpa !== null
                            ? vpa.viewport._getFallback(vi, node, ctx)
                            : ctx.config._getFallback(vi, node, ctx);
                        if (fallback === null)
                            throw new UnknownRouteError(`Neither the route '${name}' matched any configured route at '${ctx.friendlyPath}' nor a fallback is configured for the viewport '${vp}' - did you forget to add '${name}' to the routes list of the route decorator of '${ctx.component.name}'?`);
                        if (typeof fallback === 'string') {
                            // fallback: id -> route -> CEDefn (Route configuration)
                            // look for a route first
                            log.trace(`Fallback is set to '${fallback}'. Looking for a recognized route.`);
                            const rd = ctx.childRoutes.find(x => x.id === fallback);
                            if (rd !== void 0)
                                return appendNode(log, node, createFallbackNode(log, rd, node, vi));
                            log.trace(`No route configuration for the fallback '${fallback}' is found; trying to recognize the route.`);
                            const rr = ctx.recognize(fallback, true);
                            if (rr !== null && rr.residue !== fallback)
                                return appendNode(log, node, createConfiguredNode(log, node, vi, rr, null));
                        }
                        // fallback is not recognized as a configured route; treat as CE and look for a route configuration.
                        log.trace(`The fallback '${fallback}' is not recognized as a route; treating as custom element name.`);
                        return onResolve(resolveRouteConfiguration(fallback, false, ctx.config, null, ctx), rc => appendNode(log, node, createFallbackNode(log, rc, node, vi)));
                    }
                    // readjust the children wrt. the residue
                    rr.residue = null;
                    vi.component.value = noResidue
                        ? path
                        : path.slice(0, -(residue.length + 1));
                    for (let i = 0; i < collapse; ++i) {
                        const child = vi.children[0];
                        if (residue?.startsWith(child.component.value) ?? false)
                            break;
                        vi.viewport = child.viewport;
                        vi.children = child.children;
                    }
                    vi.recognizedRoute = rr;
                    log.trace('createNode after adjustment vi:%s', vi);
                    return appendNode(log, node, createConfiguredNode(log, node, vi, rr, originalInstruction));
                }
            }
        case 3 /* NavigationInstructionType.Promise */:
        case 4 /* NavigationInstructionType.IRouteViewModel */:
        case 2 /* NavigationInstructionType.CustomElementDefinition */: {
            const rc = node.context;
            return onResolve(resolveCustomElementDefinition(vi.component.value, rc)[1], ced => {
                const { vi: newVi, query } = rc.generateViewportInstruction({
                    component: ced,
                    params: vi.params ?? emptyObject,
                    open: vi.open,
                    close: vi.close,
                    viewport: vi.viewport,
                    children: vi.children.slice(),
                });
                node.tree.queryParams = mergeURLSearchParams(node.tree.queryParams, query, true);
                return appendNode(log, node, createConfiguredNode(log, node, newVi, newVi.recognizedRoute, vi));
            });
        }
    }
}
function createConfiguredNode(log, node, vi, rr, originalVi, route = rr.route.endpoint.route) {
    const ctx = node.context;
    const rt = node.tree;
    return onResolve(route.handler, $handler => {
        route.handler = $handler;
        log.trace(`creatingConfiguredNode(rdc:%s, vi:%s)`, $handler, vi);
        if ($handler.redirectTo === null) {
            const vpName = ((vi.viewport?.length ?? 0) > 0 ? vi.viewport : $handler.viewport);
            return onResolve(resolveCustomElementDefinition($handler.component, ctx)[1], ced => {
                const vpa = ctx.resolveViewportAgent(new ViewportRequest(vpName, ced.name));
                const router = ctx.container.get(IRouter);
                return onResolve(router.getRouteContext(vpa, ced, null, vpa.hostController.container, ctx.config, ctx, $handler), childCtx => {
                    log.trace('createConfiguredNode setting the context node');
                    const $node = childCtx.node = RouteNode.create({
                        path: rr.route.endpoint.route.path,
                        finalPath: route.path,
                        context: childCtx,
                        instruction: vi,
                        originalInstruction: originalVi,
                        params: {
                            ...rr.route.params,
                        },
                        queryParams: rt.queryParams,
                        fragment: rt.fragment,
                        data: $handler.data,
                        viewport: vpName,
                        component: ced,
                        title: $handler.title,
                        residue: [
                            // TODO(sayan): this can be removed; need to inspect more.
                            ...(rr.residue === null ? [] : [ViewportInstruction.create(rr.residue)]),
                            ...vi.children,
                        ],
                    });
                    $node.setTree(node.tree);
                    log.trace(`createConfiguredNode(vi:%s) -> %s`, vi, $node);
                    return $node;
                });
            });
        }
        // Migrate parameters to the redirect
        const origPath = RouteExpression.parse(route.path, false);
        const redirPath = RouteExpression.parse($handler.redirectTo, false);
        let origCur;
        let redirCur;
        const newSegs = [];
        switch (origPath.root.kind) {
            case 2 /* ExpressionKind.ScopedSegment */:
            case 4 /* ExpressionKind.Segment */:
                origCur = origPath.root;
                break;
            default:
                throw new Error(`Unexpected expression kind ${origPath.root.kind}`);
        }
        switch (redirPath.root.kind) {
            case 2 /* ExpressionKind.ScopedSegment */:
            case 4 /* ExpressionKind.Segment */:
                redirCur = redirPath.root;
                break;
            default:
                throw new Error(`Unexpected expression kind ${redirPath.root.kind}`);
        }
        let origSeg;
        let redirSeg;
        let origDone = false;
        let redirDone = false;
        while (!(origDone && redirDone)) {
            if (origDone) {
                origSeg = null;
            }
            else if (origCur.kind === 4 /* ExpressionKind.Segment */) {
                origSeg = origCur;
                origDone = true;
            }
            else if (origCur.left.kind === 4 /* ExpressionKind.Segment */) {
                origSeg = origCur.left;
                switch (origCur.right.kind) {
                    case 2 /* ExpressionKind.ScopedSegment */:
                    case 4 /* ExpressionKind.Segment */:
                        origCur = origCur.right;
                        break;
                    default:
                        throw new Error(`Unexpected expression kind ${origCur.right.kind}`);
                }
            }
            else {
                throw new Error(`Unexpected expression kind ${origCur.left.kind}`);
            }
            if (redirDone) {
                redirSeg = null;
            }
            else if (redirCur.kind === 4 /* ExpressionKind.Segment */) {
                redirSeg = redirCur;
                redirDone = true;
            }
            else if (redirCur.left.kind === 4 /* ExpressionKind.Segment */) {
                redirSeg = redirCur.left;
                switch (redirCur.right.kind) {
                    case 2 /* ExpressionKind.ScopedSegment */:
                    case 4 /* ExpressionKind.Segment */:
                        redirCur = redirCur.right;
                        break;
                    default:
                        throw new Error(`Unexpected expression kind ${redirCur.right.kind}`);
                }
            }
            else {
                throw new Error(`Unexpected expression kind ${redirCur.left.kind}`);
            }
            if (redirSeg !== null) {
                if (redirSeg.component.isDynamic && (origSeg?.component.isDynamic ?? false)) {
                    newSegs.push(rr.route.params[redirSeg.component.parameterName]);
                }
                else {
                    newSegs.push(redirSeg.raw);
                }
            }
        }
        const newPath = newSegs.filter(Boolean).join('/');
        const redirRR = ctx.recognize(newPath);
        if (redirRR === null)
            throw new UnknownRouteError(`'${newPath}' did not match any configured route or registered component name at '${ctx.friendlyPath}' - did you forget to add '${newPath}' to the routes list of the route decorator of '${ctx.component.name}'?`);
        return createConfiguredNode(log, node, ViewportInstruction.create({
            recognizedRoute: redirRR,
            component: newPath,
            children: vi.children,
            viewport: vi.viewport,
            open: vi.open,
            close: vi.close,
        }), redirRR, originalVi);
    });
}
function appendNode(log, node, childNode) {
    return onResolve(childNode, $childNode => {
        log.trace(`appendNode($childNode:%s)`, $childNode);
        node.appendChild($childNode);
        return $childNode.context.vpa._scheduleUpdate(node.tree.options, $childNode);
    });
}
/**
 * Creates route node from the given RouteConfig `rc` for a unknown path (non-configured route).
 */
function createFallbackNode(log, rc, node, vi) {
    // we aren't migrating the parameters for missing route
    const rr = new $RecognizedRoute(new RecognizedRoute(new Endpoint(new ConfigurableRoute(rc.path[0], rc.caseSensitive, rc), []), emptyObject), null);
    // Do not pass on any residue. That is if the current path is unconfigured/what/ever ignore the rest after we hit an unconfigured route.
    // If need be later a special parameter can be created for this.
    vi.children.length = 0;
    return createConfiguredNode(log, node, vi, rr, null);
}

/** @internal */
const emptyQuery = Object.freeze(new URLSearchParams());
function isManagedState(state) {
    return isObject(state) && Object.prototype.hasOwnProperty.call(state, AuNavId) === true;
}
function toManagedState(state, navId) {
    return { ...state, [AuNavId]: navId };
}
/** @internal */
class UnknownRouteError extends Error {
}
class Transition {
    get erredWithUnknownRoute() { return this._erredWithUnknownRoute; }
    constructor(id, prevInstructions, instructions, finalInstructions, instructionsChanged, trigger, options, managedState, previousRouteTree, routeTree, promise, resolve, reject, guardsResult, error) {
        this.id = id;
        this.prevInstructions = prevInstructions;
        this.instructions = instructions;
        this.finalInstructions = finalInstructions;
        this.instructionsChanged = instructionsChanged;
        this.trigger = trigger;
        this.options = options;
        this.managedState = managedState;
        this.previousRouteTree = previousRouteTree;
        this.routeTree = routeTree;
        this.promise = promise;
        this.resolve = resolve;
        this.reject = reject;
        this.guardsResult = guardsResult;
        this.error = error;
        /** @internal */
        this._erredWithUnknownRoute = false;
    }
    static create(input) {
        return new Transition(input.id, input.prevInstructions, input.instructions, input.finalInstructions, input.instructionsChanged, input.trigger, input.options, input.managedState, input.previousRouteTree, input.routeTree, input.promise, input.resolve, input.reject, input.guardsResult, void 0);
    }
    run(cb, next) {
        if (this.guardsResult !== true) {
            return;
        }
        try {
            const ret = cb();
            if (ret instanceof Promise) {
                ret.then(next).catch(err => {
                    this.handleError(err);
                });
            }
            else {
                next(ret);
            }
        }
        catch (err) {
            this.handleError(err);
        }
    }
    handleError(err) {
        this._erredWithUnknownRoute = err instanceof UnknownRouteError;
        this.reject(this.error = err);
    }
    toString() {
        return `T(id:${this.id},trigger:'${this.trigger}',instructions:${this.instructions},options:${this.options})`;
    }
}
const IRouter = /*@__PURE__*/ DI.createInterface('IRouter', x => x.singleton(Router));
let Router = class Router {
    get ctx() {
        let ctx = this._ctx;
        if (ctx === null) {
            if (!this.container.has(IRouteContext, true)) {
                throw new Error(`Root RouteContext is not set. Did you forget to register RouteConfiguration, or try to navigate before calling Aurelia.start()?`);
            }
            ctx = this._ctx = this.container.get(IRouteContext);
        }
        return ctx;
    }
    get routeTree() {
        let routeTree = this._routeTree;
        if (routeTree === null) {
            // Lazy instantiation for only the very first (synthetic) tree.
            // Doing it here instead of in the constructor to delay it until we have the context.
            const ctx = this.ctx;
            routeTree = this._routeTree = new RouteTree(NavigationOptions.create(this.options, {}), emptyQuery, null, RouteNode.create({
                path: '',
                finalPath: '',
                context: ctx,
                instruction: null,
                component: CustomElement.getDefinition(ctx.config.component),
                title: ctx.config.title,
            }));
        }
        return routeTree;
    }
    get currentTr() {
        let currentTr = this._currentTr;
        if (currentTr === null) {
            currentTr = this._currentTr = Transition.create({
                id: 0,
                prevInstructions: this.instructions,
                instructions: this.instructions,
                finalInstructions: this.instructions,
                instructionsChanged: true,
                trigger: 'api',
                options: NavigationOptions.create(this.options, {}),
                managedState: null,
                previousRouteTree: this.routeTree.clone(),
                routeTree: this.routeTree,
                resolve: null,
                reject: null,
                promise: null,
                guardsResult: true,
                error: void 0,
            });
        }
        return currentTr;
    }
    set currentTr(value) {
        this._currentTr = value;
    }
    get isNavigating() {
        return this._isNavigating;
    }
    constructor(container, p, logger, events, locationMgr, options) {
        this.container = container;
        this.p = p;
        this.logger = logger;
        this.events = events;
        this.locationMgr = locationMgr;
        this.options = options;
        this._ctx = null;
        this._routeTree = null;
        this._currentTr = null;
        this.navigated = false;
        this.navigationId = 0;
        this.nextTr = null;
        this.locationChangeSubscription = null;
        /** @internal */
        this._hasTitleBuilder = false;
        this._isNavigating = false;
        this.vpaLookup = new Map();
        this.logger = logger.root.scopeTo('Router');
        this.instructions = ViewportInstructionTree.create('', options);
        container.registerResolver(Router, Registration.instance(Router, this));
    }
    /**
     * Get the closest RouteContext relative to the provided component, controller or node.
     *
     * @param context - The object from which to resolve the closest RouteContext.
     *
     * @returns when the value is:
     * - `null`: the root
     * - `IRouteContext`: the provided value (no-op)
     * - `HTMLElement`: the context of the routeable component (page) that directly or indirectly contains this element.
     * - `ICustomElementViewModel` (the `this` object when working from inside a view model): the context of this component (if it was loaded as a route), or the routeable component (page) directly or indirectly containing it.
     * - `ICustomElementController`: same as `ICustomElementViewModel`, but using the controller object instead of the view model object (advanced users).
     */
    resolveContext(context) {
        return RouteContext.resolve(this.ctx, context);
    }
    start(performInitialNavigation) {
        this._hasTitleBuilder = typeof this.options.buildTitle === 'function';
        this.locationMgr.startListening();
        this.locationChangeSubscription = this.events.subscribe('au:router:location-change', e => {
            // TODO(fkleuver): add a throttle config.
            // At the time of writing, chromium throttles popstate events at a maximum of ~100 per second.
            // While macroTasks run up to 250 times per second, it is extremely unlikely that more than ~100 per second of these will run due to the double queueing.
            // However, this throttle limit could theoretically be hit by e.g. integration tests that don't mock Location/History.
            this.p.taskQueue.queueTask(() => {
                // Don't try to restore state that might not have anything to do with the Aurelia app
                const state = isManagedState(e.state) ? e.state : null;
                const routerOptions = this.options;
                const options = NavigationOptions.create(routerOptions, { historyStrategy: 'replace' });
                const instructions = ViewportInstructionTree.create(e.url, routerOptions, options, this.ctx);
                // The promise will be stored in the transition. However, unlike `load()`, `start()` does not return this promise in any way.
                // The router merely guarantees that it will be awaited (or canceled) before the next transition, so a race condition is impossible either way.
                // However, it is possible to get floating promises lingering during non-awaited unit tests, which could have unpredictable side-effects.
                // So we do want to solve this at some point.
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                this.enqueue(instructions, e.trigger, state, null);
            });
        });
        if (!this.navigated && performInitialNavigation) {
            return this.load(this.locationMgr.getPath(), { historyStrategy: 'replace' });
        }
    }
    stop() {
        this.locationMgr.stopListening();
        this.locationChangeSubscription?.dispose();
    }
    load(instructionOrInstructions, options) {
        const instructions = this.createViewportInstructions(instructionOrInstructions, options);
        this.logger.trace('load(instructions:%s)', instructions);
        return this.enqueue(instructions, 'api', null, null);
    }
    isActive(instructionOrInstructions, context) {
        const ctx = this.resolveContext(context);
        const instructions = instructionOrInstructions instanceof ViewportInstructionTree
            ? instructionOrInstructions
            : this.createViewportInstructions(instructionOrInstructions, { context: ctx, historyStrategy: this.options.historyStrategy });
        this.logger.trace('isActive(instructions:%s,ctx:%s)', instructions, ctx);
        // TODO: incorporate potential context offset by `../` etc in the instructions
        return this.routeTree.contains(instructions, false);
    }
    /**
     * Retrieve the RouteContext, which contains statically configured routes combined with the customElement metadata associated with a type.
     *
     * The customElement metadata is lazily associated with a type via the RouteContext the first time `getOrCreate` is called.
     *
     * @param viewportAgent - The ViewportAgent hosting the component associated with this RouteContext. If the RouteContext for the component+viewport combination already exists, the ViewportAgent will be updated in case it changed.
     * @param componentDefinition - The custom element definition.
     * @param container - The `controller.container` of the component hosting the viewport that the route will be loaded into.
     *
     */
    getRouteContext(viewportAgent, componentDefinition, componentInstance, container, parentRouteConfig, parentContext, $rdConfig) {
        const logger = container.get(ILogger).scopeTo('RouteContext');
        // getRouteConfig is prioritized over the statically configured routes via @route decorator.
        return onResolve($rdConfig instanceof RouteConfig
            ? $rdConfig
            : resolveRouteConfiguration(typeof componentInstance?.getRouteConfig === 'function' ? componentInstance : componentDefinition.Type, false, parentRouteConfig, null, parentContext), rdConfig => {
            let routeConfigLookup = this.vpaLookup.get(viewportAgent);
            if (routeConfigLookup === void 0) {
                this.vpaLookup.set(viewportAgent, routeConfigLookup = new WeakMap());
            }
            let routeContext = routeConfigLookup.get(rdConfig);
            if (routeContext !== void 0) {
                logger.trace(`returning existing RouteContext for %s`, rdConfig);
                return routeContext;
            }
            logger.trace(`creating new RouteContext for %s`, rdConfig);
            const parent = container.has(IRouteContext, true) ? container.get(IRouteContext) : null;
            routeConfigLookup.set(rdConfig, routeContext = new RouteContext(viewportAgent, parent, componentDefinition, rdConfig, container, this));
            return routeContext;
        });
    }
    createViewportInstructions(instructionOrInstructions, options) {
        if (instructionOrInstructions instanceof ViewportInstructionTree)
            return instructionOrInstructions;
        let context = (options?.context ?? null);
        if (typeof instructionOrInstructions === 'string') {
            instructionOrInstructions = this.locationMgr.removeBaseHref(instructionOrInstructions);
        }
        const isVpInstr = typeof instructionOrInstructions !== 'string' && 'component' in instructionOrInstructions;
        let $instruction = isVpInstr ? instructionOrInstructions.component : instructionOrInstructions;
        if (typeof $instruction === 'string' && $instruction.startsWith('../') && context !== null) {
            context = this.resolveContext(context);
            while ($instruction.startsWith('../') && (context?.parent ?? null) !== null) {
                $instruction = $instruction.slice(3);
                context = context.parent;
            }
        }
        if (isVpInstr) {
            instructionOrInstructions.component = $instruction;
        }
        else {
            instructionOrInstructions = $instruction;
        }
        const routerOptions = this.options;
        return ViewportInstructionTree.create(instructionOrInstructions, routerOptions, NavigationOptions.create(routerOptions, { ...options, context }), this.ctx);
    }
    /**
     * Enqueue an instruction tree to be processed as soon as possible.
     *
     * Will wait for any existing in-flight transition to finish, otherwise starts immediately.
     *
     * @param instructions - The instruction tree that determines the transition
     * @param trigger - `'popstate'` or `'hashchange'` if initiated by a browser event, or `'api'` for manually initiated transitions via the `load` api.
     * @param state - The state to restore, if any.
     * @param failedTr - If this is a redirect / fallback from a failed transition, the previous transition is passed forward to ensure the original promise resolves with the latest result.
     */
    enqueue(instructions, trigger, state, failedTr) {
        const lastTr = this.currentTr;
        const logger = this.logger;
        if (trigger !== 'api' && lastTr.trigger === 'api' && lastTr.instructions.equals(instructions)) {
            // User-triggered navigation that results in `replaceState` with the same URL. The API call already triggered the navigation; event is ignored.
            logger.debug(`Ignoring navigation triggered by '%s' because it is the same URL as the previous navigation which was triggered by 'api'.`, trigger);
            return true;
        }
        let resolve = (void 0); // Need this initializer because TS doesn't know the promise executor will run synchronously
        let reject = (void 0);
        let promise;
        if (failedTr === null || failedTr.erredWithUnknownRoute) {
            promise = new Promise(function ($resolve, $reject) { resolve = $resolve; reject = $reject; });
        }
        else {
            // Ensure that `await router.load` only resolves when the transition truly finished, so chain forward on top of
            // any previously failed transition that caused a recovering backwards navigation.
            logger.debug(`Reusing promise/resolve/reject from the previously failed transition %s`, failedTr);
            promise = failedTr.promise;
            resolve = failedTr.resolve;
            reject = failedTr.reject;
        }
        // This is an intentional overwrite: if a new transition is scheduled while the currently scheduled transition hasn't even started yet,
        // then the currently scheduled transition is effectively canceled/ignored.
        // This is consistent with the runtime's controller behavior, where if you rapidly call async activate -> deactivate -> activate (for example), then the deactivate is canceled.
        const nextTr = this.nextTr = Transition.create({
            id: ++this.navigationId,
            trigger,
            managedState: state,
            prevInstructions: lastTr.finalInstructions,
            finalInstructions: instructions,
            instructionsChanged: !lastTr.finalInstructions.equals(instructions),
            instructions,
            options: instructions.options,
            promise,
            resolve,
            reject,
            previousRouteTree: this.routeTree,
            routeTree: this._routeTree = this.routeTree.clone(),
            guardsResult: true,
            error: void 0,
        });
        logger.debug(`Scheduling transition: %s`, nextTr);
        if (!this._isNavigating) {
            // Catch any errors that might be thrown by `run` and reject the original promise which is awaited down below
            try {
                this.run(nextTr);
            }
            catch (err) {
                nextTr.handleError(err);
            }
        }
        return nextTr.promise.then(ret => {
            logger.debug(`Transition succeeded: %s`, nextTr);
            return ret;
        }).catch(err => {
            logger.error(`Transition %s failed: %s`, nextTr, err);
            if (nextTr.erredWithUnknownRoute) {
                this.cancelNavigation(nextTr);
            }
            else {
                this._isNavigating = false;
                this.events.publish(new NavigationErrorEvent(nextTr.id, nextTr.instructions, err));
                const $nextTr = this.nextTr;
                // because the navigation failed it makes sense to restore the previous route-tree so that with next navigation, lifecycle hooks are correctly invoked.
                if ($nextTr !== null) {
                    $nextTr.previousRouteTree = nextTr.previousRouteTree;
                }
                else {
                    this._routeTree = nextTr.previousRouteTree;
                }
            }
            throw err;
        });
    }
    run(tr) {
        this.currentTr = tr;
        this.nextTr = null;
        /**
         * Future optimization scope:
         * Can we devise a plan to ignore a transition?
         * The idea is to deterministically identify that the given transition is already active.
         * In that case, we only choose to execute the transition if the transitionPlan is set to replace. (this check is currently done in the viewport agent).
         *
         * Solution idea:
         * The root RouteNode needs to be consistently updated, even when children nodes are lazily added.
         * When done, the instruction can be compared starting with the root node.
         */
        this._isNavigating = true;
        let navigationContext = this.resolveContext(tr.options.context);
        this.logger.trace(`run(tr:%s) - processing route`, tr);
        this.events.publish(new NavigationStartEvent(tr.id, tr.instructions, tr.trigger, tr.managedState));
        // If user triggered a new transition in response to the NavigationStartEvent
        // (in which case `this.nextTransition` will NOT be null), we short-circuit here and go straight to processing the next one.
        if (this.nextTr !== null) {
            this.logger.debug(`run(tr:%s) - aborting because a new transition was queued in response to the NavigationStartEvent`, tr);
            return this.run(this.nextTr);
        }
        // TODO: run global guards
        //
        //
        // ---
        tr.run(() => {
            const vit = tr.finalInstructions;
            this.logger.trace(`run() - compiling route tree: %s`, vit);
            /**
             * Updating route tree:
             * Returns a stateful `RouteTree` based on the provided context and transition.
             *
             * This process will always start from the root context and build a new complete tree, up until (and including)
             * the context that was passed-in.
             *
             * If there are any additional child navigations to be resolved lazily, those will be added to the leaf
             * `RouteNode`s `residue` property which is then resolved by the router after the leaf node is loaded.
             *
             * This means that a `RouteTree` can (and often will) be built incrementally during the loading process.
             */
            // The root of the routing tree is always the CompositionRoot of the Aurelia app.
            // From a routing perspective it's simply a "marker": it does not need to be loaded,
            // nor put in a viewport, have its hooks invoked, or any of that. The router does not touch it,
            // other than by reading (deps, optional route config, owned viewports) from it.
            const rootCtx = this.ctx;
            const rt = tr.routeTree;
            rt.options = vit.options;
            rt.queryParams = rootCtx.node.tree.queryParams = vit.queryParams;
            rt.fragment = rootCtx.node.tree.fragment = vit.fragment;
            const log = navigationContext.container.get(ILogger).scopeTo('RouteTree');
            if (vit.isAbsolute) {
                navigationContext = rootCtx;
            }
            if (navigationContext === rootCtx) {
                rt.root.setTree(rt);
                rootCtx.node = rt.root;
            }
            const suffix = navigationContext.resolved instanceof Promise ? ' - awaiting promise' : '';
            log.trace(`updateRouteTree(rootCtx:%s,rt:%s,vit:%s)${suffix}`, rootCtx, rt, vit);
            // Wait till the promises to resolve the child routes are resolved.
            // Note that a route configuration can be a promise.
            return onResolve(navigationContext.resolved, () => updateNode(log, vit, navigationContext, rootCtx.node));
        }, () => {
            const prev = tr.previousRouteTree.root.children;
            const next = tr.routeTree.root.children;
            const all = mergeDistinct(prev, next);
            Batch.start(b => {
                this.logger.trace(`run() - invoking canUnload on ${prev.length} nodes`);
                for (const node of prev) {
                    node.context.vpa._canUnload(tr, b);
                }
            }).continueWith(b => {
                if (tr.guardsResult !== true) {
                    b.push(); // prevent the next step in the batch from running
                    this.cancelNavigation(tr);
                }
            }).continueWith(b => {
                this.logger.trace(`run() - invoking canLoad on ${next.length} nodes`);
                for (const node of next) {
                    node.context.vpa._canLoad(tr, b);
                }
            }).continueWith(b => {
                if (tr.guardsResult !== true) {
                    b.push();
                    this.cancelNavigation(tr);
                }
            }).continueWith(b => {
                this.logger.trace(`run() - invoking unloading on ${prev.length} nodes`);
                for (const node of prev) {
                    node.context.vpa._unloading(tr, b);
                }
            }).continueWith(b => {
                this.logger.trace(`run() - invoking loading on ${next.length} nodes`);
                for (const node of next) {
                    node.context.vpa._loading(tr, b);
                }
            }).continueWith(b => {
                this.logger.trace(`run() - invoking swap on ${all.length} nodes`);
                for (const node of all) {
                    node.context.vpa._swap(tr, b);
                }
            }).continueWith(() => {
                this.logger.trace(`run() - finalizing transition`);
                // order doesn't matter for this operation
                all.forEach(function (node) {
                    node.context.vpa._endTransition();
                });
                this.navigated = true;
                this.instructions = tr.finalInstructions = tr.routeTree.finalizeInstructions();
                this._isNavigating = false;
                // apply history state
                const newUrl = tr.finalInstructions.toUrl(this.options.useUrlFragmentHash);
                switch (tr.options._getHistoryStrategy(this.instructions)) {
                    case 'none':
                        // do nothing
                        break;
                    case 'push':
                        this.locationMgr.pushState(toManagedState(tr.options.state, tr.id), this.updateTitle(tr), newUrl);
                        break;
                    case 'replace':
                        this.locationMgr.replaceState(toManagedState(tr.options.state, tr.id), this.updateTitle(tr), newUrl);
                        break;
                }
                this.events.publish(new NavigationEndEvent(tr.id, tr.instructions, this.instructions));
                tr.resolve(true);
                this.runNextTransition();
            }).start();
        });
    }
    updateTitle(tr = this.currentTr) {
        let title;
        if (this._hasTitleBuilder) {
            title = this.options.buildTitle(tr) ?? '';
        }
        else {
            switch (typeof tr.options.title) {
                case 'function':
                    title = tr.options.title.call(void 0, tr.routeTree.root) ?? '';
                    break;
                case 'string':
                    title = tr.options.title;
                    break;
                default:
                    title = tr.routeTree.root.getTitle(tr.options.titleSeparator) ?? '';
                    break;
            }
        }
        if (title.length > 0) {
            this.p.document.title = title;
        }
        return this.p.document.title;
    }
    cancelNavigation(tr) {
        this.logger.trace(`cancelNavigation(tr:%s)`, tr);
        const prev = tr.previousRouteTree.root.children;
        const next = tr.routeTree.root.children;
        const all = mergeDistinct(prev, next);
        // order doesn't matter for this operation
        all.forEach(function (node) {
            node.context.vpa._cancelUpdate();
        });
        this.instructions = tr.prevInstructions;
        this._routeTree = tr.previousRouteTree;
        this._isNavigating = false;
        const guardsResult = tr.guardsResult;
        this.events.publish(new NavigationCancelEvent(tr.id, tr.instructions, `guardsResult is ${guardsResult}`));
        if (guardsResult === false) {
            tr.resolve(false);
            // In case a new navigation was requested in the meantime, immediately start processing it
            this.runNextTransition();
        }
        else {
            const instructions = tr.erredWithUnknownRoute ? tr.prevInstructions : guardsResult;
            void onResolve(this.enqueue(instructions, 'api', tr.managedState, tr), () => {
                this.logger.trace(`cancelNavigation(tr:%s) - finished redirect`, tr);
            });
        }
    }
    runNextTransition() {
        if (this.nextTr === null)
            return;
        this.logger.trace(`scheduling nextTransition: %s`, this.nextTr);
        this.p.taskQueue.queueTask(() => {
            // nextTransition is allowed to change up until the point when it's actually time to process it,
            // so we need to check it for null again when the scheduled task runs.
            const nextTr = this.nextTr;
            if (nextTr === null)
                return;
            try {
                this.run(nextTr);
            }
            catch (err) {
                nextTr.handleError(err);
            }
        });
    }
};
Router = __decorate([
    __param(0, IContainer),
    __param(1, IPlatform),
    __param(2, ILogger),
    __param(3, IRouterEvents),
    __param(4, ILocationManager),
    __param(5, IRouterOptions)
], Router);
function updateNode(log, vit, ctx, node) {
    log.trace(`updateNode(ctx:%s,node:%s)`, ctx, node);
    node.queryParams = vit.queryParams;
    node.fragment = vit.fragment;
    if (!node.context.isRoot) {
        node.context.vpa._scheduleUpdate(node.tree.options, node);
    }
    if (node.context === ctx) {
        // Do an in-place update (remove children and re-add them by compiling the instructions into nodes)
        node.clearChildren();
        // - first append the nodes as children, compiling the viewport instructions.
        // - if afterward, any viewports are still available
        //   - look at the default value of those viewports
        //   - create instructions, and
        //   - add the compiled nodes from those to children of the node.
        return onResolve(onResolveAll(...vit.children.map(vi => createAndAppendNodes(log, node, vi))), () => onResolveAll(...ctx.getAvailableViewportAgents().reduce((acc, vpa) => {
            const vp = vpa.viewport;
            const component = vp.default;
            if (component === null)
                return acc;
            acc.push(createAndAppendNodes(log, node, ViewportInstruction.create({ component, viewport: vp.name, })));
            return acc;
        }, [])));
    }
    // Drill down until we're at the node whose context matches the provided navigation context
    return onResolveAll(...node.children.map(child => {
        return updateNode(log, vit, ctx, child);
    }));
}

// The commented-out terminal symbols below are for reference / potential future need (should there be use cases to loosen up the syntax)
// These are the currently used terminal symbols.
// We're deliberately having every "special" (including the not-in-use '&', ''', '~', ';') as a terminal symbol,
// so as to make the syntax maximally restrictive for consistency and to minimize the risk of us having to introduce breaking changes in the future.
const terminal = ['?', '#', '/', '+', '(', ')', '.', '@', '!', '=', ',', '&', '\'', '~', ';'];
class ParserState {
    get done() {
        return this.rest.length === 0;
    }
    constructor(input) {
        this.input = input;
        this.buffers = [];
        this.bufferIndex = 0;
        this.index = 0;
        this.rest = input;
    }
    startsWith(...values) {
        const rest = this.rest;
        return values.some(function (value) {
            return rest.startsWith(value);
        });
    }
    consumeOptional(str) {
        if (this.startsWith(str)) {
            this.rest = this.rest.slice(str.length);
            this.index += str.length;
            this.append(str);
            return true;
        }
        return false;
    }
    consume(str) {
        if (!this.consumeOptional(str)) {
            this.expect(`'${str}'`);
        }
    }
    expect(msg) {
        throw new Error(`Expected ${msg} at index ${this.index} of '${this.input}', but got: '${this.rest}' (rest='${this.rest}')`);
    }
    ensureDone() {
        if (!this.done) {
            throw new Error(`Unexpected '${this.rest}' at index ${this.index} of '${this.input}'`);
        }
    }
    advance() {
        const char = this.rest[0];
        this.rest = this.rest.slice(1);
        ++this.index;
        this.append(char);
    }
    record() {
        this.buffers[this.bufferIndex++] = '';
    }
    playback() {
        const bufferIndex = --this.bufferIndex;
        const buffers = this.buffers;
        const buffer = buffers[bufferIndex];
        buffers[bufferIndex] = '';
        return buffer;
    }
    discard() {
        this.buffers[--this.bufferIndex] = '';
    }
    append(str) {
        const bufferIndex = this.bufferIndex;
        const buffers = this.buffers;
        for (let i = 0; i < bufferIndex; ++i) {
            buffers[i] += str;
        }
    }
}
var ExpressionKind;
(function (ExpressionKind) {
    ExpressionKind[ExpressionKind["Route"] = 0] = "Route";
    ExpressionKind[ExpressionKind["CompositeSegment"] = 1] = "CompositeSegment";
    ExpressionKind[ExpressionKind["ScopedSegment"] = 2] = "ScopedSegment";
    ExpressionKind[ExpressionKind["SegmentGroup"] = 3] = "SegmentGroup";
    ExpressionKind[ExpressionKind["Segment"] = 4] = "Segment";
    ExpressionKind[ExpressionKind["Component"] = 5] = "Component";
    ExpressionKind[ExpressionKind["Action"] = 6] = "Action";
    ExpressionKind[ExpressionKind["Viewport"] = 7] = "Viewport";
    ExpressionKind[ExpressionKind["ParameterList"] = 8] = "ParameterList";
    ExpressionKind[ExpressionKind["Parameter"] = 9] = "Parameter";
})(ExpressionKind || (ExpressionKind = {}));
const fragmentRouteExpressionCache = new Map();
const routeExpressionCache = new Map();
class RouteExpression {
    get kind() { return 0 /* ExpressionKind.Route */; }
    constructor(raw, isAbsolute, root, queryParams, fragment, fragmentIsRoute) {
        this.raw = raw;
        this.isAbsolute = isAbsolute;
        this.root = root;
        this.queryParams = queryParams;
        this.fragment = fragment;
        this.fragmentIsRoute = fragmentIsRoute;
    }
    static parse(path, fragmentIsRoute) {
        const cache = fragmentIsRoute ? fragmentRouteExpressionCache : routeExpressionCache;
        let result = cache.get(path);
        if (result === void 0) {
            cache.set(path, result = RouteExpression.$parse(path, fragmentIsRoute));
        }
        return result;
    }
    static $parse(path, fragmentIsRoute) {
        // First strip off the fragment (and if fragment should be used as route, set it as the path)
        let fragment = null;
        const fragmentStart = path.indexOf('#');
        if (fragmentStart >= 0) {
            const rawFragment = path.slice(fragmentStart + 1);
            fragment = decodeURIComponent(rawFragment);
            if (fragmentIsRoute) {
                path = fragment;
            }
            else {
                path = path.slice(0, fragmentStart);
            }
        }
        // Strip off and parse the query string using built-in URLSearchParams.
        let queryParams = null;
        const queryStart = path.indexOf('?');
        if (queryStart >= 0) {
            const queryString = path.slice(queryStart + 1);
            path = path.slice(0, queryStart);
            queryParams = new URLSearchParams(queryString);
        }
        if (path === '') {
            return new RouteExpression('', false, SegmentExpression.EMPTY, queryParams != null ? Object.freeze(queryParams) : emptyQuery, fragment, fragmentIsRoute);
        }
        /*
         * Now parse the actual route
         *
         * Notes:
         * A NT-Name as per DOM level 2: https://www.w3.org/TR/1998/REC-xml-19980210#NT-Name
         *  [4]  NameChar ::= Letter | Digit | '.' | '-' | '_' | ':' | CombiningChar | Extender
         *  [5]  Name     ::= (Letter | '_' | ':') (NameChar)*
         *
         * As per https://url.spec.whatwg.org/#url-code-points - URL code points (from the ASCII range) are:
         * a-zA-Z0-9!$&'()*+,-./:;=?@_~
         * The other valid option is a % followed by two ASCII hex digits
         * Anything else is invalid.
         */
        const state = new ParserState(path);
        state.record();
        const isAbsolute = state.consumeOptional('/');
        const root = CompositeSegmentExpression.parse(state);
        state.ensureDone();
        const raw = state.playback();
        return new RouteExpression(raw, isAbsolute, root, queryParams != null ? Object.freeze(queryParams) : emptyQuery, fragment, fragmentIsRoute);
    }
    toInstructionTree(options) {
        return new ViewportInstructionTree(options, this.isAbsolute, this.root.toInstructions(0, 0), mergeURLSearchParams(this.queryParams, options.queryParams, true), this.fragment ?? options.fragment);
    }
    toString() {
        return this.raw;
    }
}
/**
 * A single 'traditional' (slash-separated) segment consisting of one or more sibling segments.
 *
 * ### Variations:
 *
 * 1: `a+b`
 * - siblings: [`a`, `b`]
 * - append: `false`
 *
 * 2: `+a`
 * - siblings: [`a`]
 * - append: `true`
 *
 * 3: `+a+a`
 * - siblings: [`a`, `b`]
 * - append: `true`
 *
 * Where
 * - a = `CompositeSegmentExpressionOrHigher` (`SegmentExpression | SegmentGroupExpression | ScopedSegmentExpression | CompositeSegmentExpression`)
 * - b = `CompositeSegmentExpressionOrHigher` (`SegmentExpression | SegmentGroupExpression | ScopedSegmentExpression | CompositeSegmentExpression`)
 */
class CompositeSegmentExpression {
    get kind() { return 1 /* ExpressionKind.CompositeSegment */; }
    constructor(raw, siblings) {
        this.raw = raw;
        this.siblings = siblings;
    }
    static parse(state) {
        state.record();
        // If a segment starts with '+', e.g. '/+a' / '/+a@vp' / '/a/+b' / '/+a+b' etc, then its siblings
        // are considered to be "append"
        const append = state.consumeOptional('+');
        const siblings = [];
        do {
            siblings.push(ScopedSegmentExpression.parse(state));
        } while (state.consumeOptional('+'));
        if (!append && siblings.length === 1) {
            state.discard();
            return siblings[0];
        }
        const raw = state.playback();
        return new CompositeSegmentExpression(raw, siblings);
    }
    toInstructions(open, close) {
        switch (this.siblings.length) {
            case 0:
                return [];
            case 1:
                return this.siblings[0].toInstructions(open, close);
            case 2:
                return [
                    ...this.siblings[0].toInstructions(open, 0),
                    ...this.siblings[1].toInstructions(0, close),
                ];
            default:
                return [
                    ...this.siblings[0].toInstructions(open, 0),
                    ...this.siblings.slice(1, -1).flatMap(function (x) {
                        return x.toInstructions(0, 0);
                    }),
                    ...this.siblings[this.siblings.length - 1].toInstructions(0, close),
                ];
        }
    }
    toString() {
        return this.raw;
    }
}
/**
 * The (single) left-hand side and the (one or more) right-hand side of a slash-separated segment.
 *
 * Variations:
 *
 * 1: `a/b`
 * - left: `a`
 * - right: `b`
 *
 * Where
 * - a = `SegmentGroupExpressionOrHigher` (`SegmentExpression | SegmentGroupExpression`)
 * - b = `ScopedSegmentExpressionOrHigher` (`SegmentExpression | SegmentGroupExpression | ScopedSegmentExpression`)
 */
class ScopedSegmentExpression {
    get kind() { return 2 /* ExpressionKind.ScopedSegment */; }
    constructor(raw, left, right) {
        this.raw = raw;
        this.left = left;
        this.right = right;
    }
    static parse(state) {
        state.record();
        const left = SegmentGroupExpression.parse(state);
        if (state.consumeOptional('/')) {
            const right = ScopedSegmentExpression.parse(state);
            const raw = state.playback();
            return new ScopedSegmentExpression(raw, left, right);
        }
        state.discard();
        return left;
    }
    toInstructions(open, close) {
        const leftInstructions = this.left.toInstructions(open, 0);
        const rightInstructions = this.right.toInstructions(0, close);
        let cur = leftInstructions[leftInstructions.length - 1];
        while (cur.children.length > 0) {
            cur = cur.children[cur.children.length - 1];
        }
        cur.children.push(...rightInstructions);
        return leftInstructions;
    }
    toString() {
        return this.raw;
    }
}
/**
 * Any kind of segment wrapped in parentheses, increasing its precedence.
 * Specifically, the parentheses are needed to deeply specify scoped siblings.
 * The precedence is intentionally similar to the familiar mathematical `/` and `+` operators.
 *
 * For example, consider this viewport structure:
 * - viewport-a
 * - - viewport-a1
 * - - viewport-a2
 * - viewport-b
 * - - viewport-b1
 *
 * This can only be deeply specified by using the grouping operator: `a/(a1+a2)+b/b1`
 *
 * Because `a/a1+a2+b/b1` would be interpreted differently:
 * - viewport-a
 * - - viewport-a1
 * - viewport-a2
 * - viewport-b
 * - - viewport-b1
 *
 * ### Variations:
 *
 * 1: `(a)`
 * - expression: `a`
 *
 * Where
 * - a = `CompositeSegmentExpressionOrHigher` (`SegmentExpression | SegmentGroupExpression | ScopedSegmentExpression | CompositeSegmentExpression`)
 */
class SegmentGroupExpression {
    get kind() { return 3 /* ExpressionKind.SegmentGroup */; }
    constructor(raw, expression) {
        this.raw = raw;
        this.expression = expression;
    }
    static parse(state) {
        state.record();
        if (state.consumeOptional('(')) {
            const expression = CompositeSegmentExpression.parse(state);
            state.consume(')');
            const raw = state.playback();
            return new SegmentGroupExpression(raw, expression);
        }
        state.discard();
        return SegmentExpression.parse(state);
    }
    toInstructions(open, close) {
        return this.expression.toInstructions(open + 1, close + 1);
    }
    toString() {
        return this.raw;
    }
}
/**
 * A (non-composite) segment specifying a single component and (optional) viewport / action.
 */
class SegmentExpression {
    get kind() { return 4 /* ExpressionKind.Segment */; }
    static get EMPTY() { return new SegmentExpression('', ComponentExpression.EMPTY, ActionExpression.EMPTY, ViewportExpression.EMPTY, true); }
    constructor(raw, component, action, viewport, scoped) {
        this.raw = raw;
        this.component = component;
        this.action = action;
        this.viewport = viewport;
        this.scoped = scoped;
    }
    static parse(state) {
        state.record();
        const component = ComponentExpression.parse(state);
        const action = ActionExpression.parse(state);
        const viewport = ViewportExpression.parse(state);
        const scoped = !state.consumeOptional('!');
        const raw = state.playback();
        return new SegmentExpression(raw, component, action, viewport, scoped);
    }
    toInstructions(open, close) {
        return [
            ViewportInstruction.create({
                component: this.component.name,
                params: this.component.parameterList.toObject(),
                viewport: this.viewport.name,
                open,
                close,
            }),
        ];
    }
    toString() {
        return this.raw;
    }
}
class ComponentExpression {
    get kind() { return 5 /* ExpressionKind.Component */; }
    static get EMPTY() { return new ComponentExpression('', '', ParameterListExpression.EMPTY); }
    constructor(raw, name, parameterList) {
        this.raw = raw;
        this.name = name;
        this.parameterList = parameterList;
        switch (name.charAt(0)) {
            case ':':
                this.isParameter = true;
                this.isStar = false;
                this.isDynamic = true;
                this.parameterName = name.slice(1);
                break;
            case '*':
                this.isParameter = false;
                this.isStar = true;
                this.isDynamic = true;
                this.parameterName = name.slice(1);
                break;
            default:
                this.isParameter = false;
                this.isStar = false;
                this.isDynamic = false;
                this.parameterName = name;
                break;
        }
    }
    static parse(state) {
        state.record();
        state.record();
        if (!state.done) {
            if (state.startsWith('./')) {
                state.advance();
            }
            else if (state.startsWith('../')) {
                state.advance();
                state.advance();
            }
            else {
                while (!state.done && !state.startsWith(...terminal)) {
                    state.advance();
                }
            }
        }
        const name = decodeURIComponent(state.playback());
        if (name.length === 0) {
            state.expect('component name');
        }
        const parameterList = ParameterListExpression.parse(state);
        const raw = state.playback();
        return new ComponentExpression(raw, name, parameterList);
    }
    toString() {
        return this.raw;
    }
}
class ActionExpression {
    get kind() { return 6 /* ExpressionKind.Action */; }
    static get EMPTY() { return new ActionExpression('', '', ParameterListExpression.EMPTY); }
    constructor(raw, name, parameterList) {
        this.raw = raw;
        this.name = name;
        this.parameterList = parameterList;
    }
    static parse(state) {
        state.record();
        let name = '';
        if (state.consumeOptional('.')) {
            state.record();
            while (!state.done && !state.startsWith(...terminal)) {
                state.advance();
            }
            name = decodeURIComponent(state.playback());
            if (name.length === 0) {
                state.expect('method name');
            }
        }
        const parameterList = ParameterListExpression.parse(state);
        const raw = state.playback();
        return new ActionExpression(raw, name, parameterList);
    }
    toString() {
        return this.raw;
    }
}
class ViewportExpression {
    get kind() { return 7 /* ExpressionKind.Viewport */; }
    static get EMPTY() { return new ViewportExpression('', ''); }
    constructor(raw, name) {
        this.raw = raw;
        this.name = name;
    }
    static parse(state) {
        state.record();
        let name = '';
        if (state.consumeOptional('@')) {
            state.record();
            while (!state.done && !state.startsWith(...terminal)) {
                state.advance();
            }
            name = decodeURIComponent(state.playback());
            if (name.length === 0) {
                state.expect('viewport name');
            }
        }
        const raw = state.playback();
        return new ViewportExpression(raw, name);
    }
    toString() {
        return this.raw;
    }
}
class ParameterListExpression {
    get kind() { return 8 /* ExpressionKind.ParameterList */; }
    static get EMPTY() { return new ParameterListExpression('', []); }
    constructor(raw, expressions) {
        this.raw = raw;
        this.expressions = expressions;
    }
    static parse(state) {
        state.record();
        const expressions = [];
        if (state.consumeOptional('(')) {
            do {
                expressions.push(ParameterExpression.parse(state, expressions.length));
                if (!state.consumeOptional(',')) {
                    break;
                }
            } while (!state.done && !state.startsWith(')'));
            state.consume(')');
        }
        const raw = state.playback();
        return new ParameterListExpression(raw, expressions);
    }
    toObject() {
        const params = {};
        for (const expr of this.expressions) {
            params[expr.key] = expr.value;
        }
        return params;
    }
    toString() {
        return this.raw;
    }
}
class ParameterExpression {
    get kind() { return 9 /* ExpressionKind.Parameter */; }
    static get EMPTY() { return new ParameterExpression('', '', ''); }
    constructor(raw, key, value) {
        this.raw = raw;
        this.key = key;
        this.value = value;
    }
    static parse(state, index) {
        state.record();
        state.record();
        while (!state.done && !state.startsWith(...terminal)) {
            state.advance();
        }
        let key = decodeURIComponent(state.playback());
        if (key.length === 0) {
            state.expect('parameter key');
        }
        let value;
        if (state.consumeOptional('=')) {
            state.record();
            while (!state.done && !state.startsWith(...terminal)) {
                state.advance();
            }
            value = decodeURIComponent(state.playback());
            if (value.length === 0) {
                state.expect('parameter value');
            }
        }
        else {
            value = key;
            key = index.toString();
        }
        const raw = state.playback();
        return new ParameterExpression(raw, key, value);
    }
    toString() {
        return this.raw;
    }
}
const AST = Object.freeze({
    RouteExpression,
    CompositeSegmentExpression,
    ScopedSegmentExpression,
    SegmentGroupExpression,
    SegmentExpression,
    ComponentExpression,
    ActionExpression,
    ViewportExpression,
    ParameterListExpression,
    ParameterExpression,
});

const defaultViewportName = 'default';
class ViewportInstruction {
    constructor(open, close, recognizedRoute, component, viewport, params, children) {
        this.open = open;
        this.close = close;
        this.recognizedRoute = recognizedRoute;
        this.component = component;
        this.viewport = viewport;
        this.params = params;
        this.children = children;
    }
    static create(instruction) {
        if (instruction instanceof ViewportInstruction)
            return instruction; // eslint is being really weird here
        if (isPartialViewportInstruction(instruction)) {
            const component = TypedNavigationInstruction.create(instruction.component);
            const children = instruction.children?.map(ViewportInstruction.create) ?? [];
            return new ViewportInstruction(instruction.open ?? 0, instruction.close ?? 0, instruction.recognizedRoute ?? null, component, instruction.viewport ?? null, instruction.params ?? null, children);
        }
        const typedInstruction = TypedNavigationInstruction.create(instruction);
        return new ViewportInstruction(0, 0, null, typedInstruction, null, null, []);
    }
    contains(other) {
        const thisChildren = this.children;
        const otherChildren = other.children;
        if (thisChildren.length < otherChildren.length) {
            return false;
        }
        // TODO(fkleuver): incorporate viewports when null / '' descrepancies are fixed,
        // as well as params when inheritance is fully fixed
        if (!this.component.equals(other.component)) {
            return false;
        }
        for (let i = 0, ii = otherChildren.length; i < ii; ++i) {
            if (!thisChildren[i].contains(otherChildren[i])) {
                return false;
            }
        }
        return true;
    }
    equals(other) {
        const thisChildren = this.children;
        const otherChildren = other.children;
        if (thisChildren.length !== otherChildren.length) {
            return false;
        }
        if (
        // TODO(fkleuver): decide if we really need to include `context` in this comparison
        !this.component.equals(other.component) ||
            this.viewport !== other.viewport ||
            !shallowEquals(this.params, other.params)) {
            return false;
        }
        for (let i = 0, ii = thisChildren.length; i < ii; ++i) {
            if (!thisChildren[i].equals(otherChildren[i])) {
                return false;
            }
        }
        return true;
    }
    clone() {
        return new ViewportInstruction(this.open, this.close, this.recognizedRoute, this.component.clone(), this.viewport, this.params === null ? null : { ...this.params }, [...this.children]);
    }
    toUrlComponent(recursive = true) {
        // TODO(fkleuver): use the context to determine create full tree
        const component = this.component.toUrlComponent();
        const params = this.params === null || Object.keys(this.params).length === 0 ? '' : `(${stringifyParams(this.params)})`; /** TODO(sayan): review the path generation usage and correct this stringifyParams artefact. */
        const vp = this.viewport;
        const viewport = component.length === 0 || vp === null || vp.length === 0 || vp === defaultViewportName ? '' : `@${vp}`;
        const thisPart = `${'('.repeat(this.open)}${component}${params}${viewport}${')'.repeat(this.close)}`;
        const childPart = recursive ? this.children.map(x => x.toUrlComponent()).join('+') : '';
        if (thisPart.length > 0) {
            if (childPart.length > 0) {
                return [thisPart, childPart].join('/');
            }
            return thisPart;
        }
        return childPart;
    }
    toString() {
        const component = `c:${this.component}`;
        const viewport = this.viewport === null || this.viewport.length === 0 ? '' : `viewport:${this.viewport}`;
        const children = this.children.length === 0 ? '' : `children:[${this.children.map(String).join(',')}]`;
        const props = [component, viewport, children].filter(Boolean).join(',');
        return `VPI(${props})`;
    }
}
function stringifyParams(params) {
    const keys = Object.keys(params);
    const values = Array(keys.length);
    const indexKeys = [];
    const namedKeys = [];
    for (const key of keys) {
        if (isArrayIndex(key)) {
            indexKeys.push(Number(key));
        }
        else {
            namedKeys.push(key);
        }
    }
    for (let i = 0; i < keys.length; ++i) {
        const indexKeyIdx = indexKeys.indexOf(i);
        if (indexKeyIdx > -1) {
            values[i] = params[i];
            indexKeys.splice(indexKeyIdx, 1);
        }
        else {
            const namedKey = namedKeys.shift();
            values[i] = `${namedKey}=${params[namedKey]}`;
        }
    }
    return values.join(',');
}
/**
 * Associate the object with an id so it can be stored in history as a serialized url segment.
 *
 * WARNING: As the implementation is right now, this is a memory leak disaster.
 * This is really a placeholder implementation at the moment and should NOT be used / advertised for production until a leak-free solution is made.
 */
const getObjectId = (function () {
    let lastId = 0;
    const objectIdMap = new Map();
    return function (obj) {
        let id = objectIdMap.get(obj);
        if (id === void 0) {
            objectIdMap.set(obj, id = ++lastId);
        }
        return id;
    };
})();
class ViewportInstructionTree {
    constructor(options, isAbsolute, children, queryParams, fragment) {
        this.options = options;
        this.isAbsolute = isAbsolute;
        this.children = children;
        this.queryParams = queryParams;
        this.fragment = fragment;
    }
    static create(instructionOrInstructions, routerOptions, options, rootCtx) {
        const $options = NavigationOptions.create(routerOptions, { ...options });
        let context = $options.context;
        if (!(context instanceof RouteContext) && rootCtx != null) {
            context = RouteContext.resolve(rootCtx, context);
        }
        const hasContext = context != null;
        if (instructionOrInstructions instanceof Array) {
            const len = instructionOrInstructions.length;
            const children = new Array(len);
            const query = new URLSearchParams($options.queryParams ?? emptyObject);
            for (let i = 0; i < len; i++) {
                const instruction = instructionOrInstructions[i];
                const eagerVi = hasContext ? context.generateViewportInstruction(instruction) : null;
                if (eagerVi !== null) {
                    children[i] = eagerVi.vi;
                    mergeURLSearchParams(query, eagerVi.query, false);
                }
                else {
                    children[i] = ViewportInstruction.create(instruction);
                }
            }
            return new ViewportInstructionTree($options, false, children, query, $options.fragment);
        }
        if (typeof instructionOrInstructions === 'string') {
            const expr = RouteExpression.parse(instructionOrInstructions, routerOptions.useUrlFragmentHash);
            return expr.toInstructionTree($options);
        }
        const eagerVi = hasContext ? context.generateViewportInstruction(instructionOrInstructions) : null;
        const query = new URLSearchParams($options.queryParams ?? emptyObject);
        return eagerVi !== null
            ? new ViewportInstructionTree($options, false, [eagerVi.vi], mergeURLSearchParams(query, eagerVi.query, false), $options.fragment)
            : new ViewportInstructionTree($options, false, [ViewportInstruction.create(instructionOrInstructions)], query, $options.fragment);
    }
    equals(other) {
        const thisChildren = this.children;
        const otherChildren = other.children;
        if (thisChildren.length !== otherChildren.length) {
            return false;
        }
        for (let i = 0, ii = thisChildren.length; i < ii; ++i) {
            if (!thisChildren[i].equals(otherChildren[i])) {
                return false;
            }
        }
        return true;
    }
    toUrl(useUrlFragmentHash = false) {
        let pathname;
        let hash;
        if (useUrlFragmentHash) {
            pathname = '';
            hash = `#${this.toPath()}`;
        }
        else {
            pathname = this.toPath();
            const fragment = this.fragment;
            hash = fragment !== null && fragment.length > 0 ? `#${fragment}` : '';
        }
        let search = this.queryParams.toString();
        search = search === '' ? '' : `?${search}`;
        return `${pathname}${search}${hash}`;
    }
    toPath() {
        return this.children.map(x => x.toUrlComponent()).join('+');
    }
    toString() {
        return `[${this.children.map(String).join(',')}]`;
    }
}
var NavigationInstructionType;
(function (NavigationInstructionType) {
    NavigationInstructionType[NavigationInstructionType["string"] = 0] = "string";
    NavigationInstructionType[NavigationInstructionType["ViewportInstruction"] = 1] = "ViewportInstruction";
    NavigationInstructionType[NavigationInstructionType["CustomElementDefinition"] = 2] = "CustomElementDefinition";
    NavigationInstructionType[NavigationInstructionType["Promise"] = 3] = "Promise";
    NavigationInstructionType[NavigationInstructionType["IRouteViewModel"] = 4] = "IRouteViewModel";
})(NavigationInstructionType || (NavigationInstructionType = {}));
class TypedNavigationInstruction {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
    static create(instruction) {
        if (instruction instanceof TypedNavigationInstruction) {
            return instruction;
        }
        if (typeof instruction === 'string')
            return new TypedNavigationInstruction(0 /* NavigationInstructionType.string */, instruction);
        // Typings prevent this from happening, but guard it anyway due to `as any` and the sorts being a thing in userland code and tests.
        if (!isObject(instruction))
            expectType('function/class or object', '', instruction);
        if (typeof instruction === 'function') {
            if (CustomElement.isType(instruction)) {
                // This is the class itself
                // CustomElement.getDefinition will throw if the type is not a custom element
                const definition = CustomElement.getDefinition(instruction);
                return new TypedNavigationInstruction(2 /* NavigationInstructionType.CustomElementDefinition */, definition);
            }
            else {
                return TypedNavigationInstruction.create(instruction());
            }
        }
        if (instruction instanceof Promise)
            return new TypedNavigationInstruction(3 /* NavigationInstructionType.Promise */, instruction);
        if (isPartialViewportInstruction(instruction)) {
            const viewportInstruction = ViewportInstruction.create(instruction);
            return new TypedNavigationInstruction(1 /* NavigationInstructionType.ViewportInstruction */, viewportInstruction);
        }
        if (isCustomElementViewModel(instruction))
            return new TypedNavigationInstruction(4 /* NavigationInstructionType.IRouteViewModel */, instruction);
        // We might have gotten a complete definition. In that case use it as-is.
        if (instruction instanceof CustomElementDefinition)
            return new TypedNavigationInstruction(2 /* NavigationInstructionType.CustomElementDefinition */, instruction);
        throw new Error(`Invalid component ${tryStringify(instruction)}: must be either a class, a custom element ViewModel, or a (partial) custom element definition`);
    }
    equals(other) {
        switch (this.type) {
            case 2 /* NavigationInstructionType.CustomElementDefinition */:
            case 4 /* NavigationInstructionType.IRouteViewModel */:
            case 3 /* NavigationInstructionType.Promise */:
            case 0 /* NavigationInstructionType.string */:
                return this.type === other.type && this.value === other.value;
            case 1 /* NavigationInstructionType.ViewportInstruction */:
                return this.type === other.type && this.value.equals(other.value);
        }
    }
    clone() {
        return new TypedNavigationInstruction(this.type, this.value);
    }
    toUrlComponent() {
        switch (this.type) {
            case 2 /* NavigationInstructionType.CustomElementDefinition */:
                return this.value.name;
            case 4 /* NavigationInstructionType.IRouteViewModel */:
            case 3 /* NavigationInstructionType.Promise */:
                return `au$obj${getObjectId(this.value)}`;
            case 1 /* NavigationInstructionType.ViewportInstruction */:
                return this.value.toUrlComponent();
            case 0 /* NavigationInstructionType.string */:
                return this.value;
        }
    }
    toString() {
        switch (this.type) {
            case 2 /* NavigationInstructionType.CustomElementDefinition */:
                return `CEDef(name:'${this.value.name}')`;
            case 3 /* NavigationInstructionType.Promise */:
                return `Promise`;
            case 4 /* NavigationInstructionType.IRouteViewModel */:
                return `VM(name:'${CustomElement.getDefinition(this.value.constructor).name}')`;
            case 1 /* NavigationInstructionType.ViewportInstruction */:
                return this.value.toString();
            case 0 /* NavigationInstructionType.string */:
                return `'${this.value}'`;
        }
    }
}

// type IHooksFn<T, Fn extends (...args: any[]) => unknown> = (vm: T, ...args: Parameters<Fn>) => ReturnType<Fn>;
/**
 * A component agent handles an instance of a routed view-model (a component).
 * It deals with invoking the hooks (`canLoad`, `loading`, `canUnload`, `unloading`),
 * and activating, deactivating, and disposing the component (via the associated controller).
 */
class ComponentAgent {
    constructor(instance, controller, routeNode, ctx, routerOptions) {
        this.instance = instance;
        this.controller = controller;
        this.routeNode = routeNode;
        this.ctx = ctx;
        this.routerOptions = routerOptions;
        this._logger = ctx.container.get(ILogger).scopeTo(`ComponentAgent<${ctx.friendlyPath}>`);
        this._logger.trace(`constructor()`);
        const lifecycleHooks = controller.lifecycleHooks;
        this._canLoadHooks = (lifecycleHooks.canLoad ?? []).map(x => x.instance);
        this._loadHooks = (lifecycleHooks.loading ?? []).map(x => x.instance);
        this._canUnloadHooks = (lifecycleHooks.canUnload ?? []).map(x => x.instance);
        this._unloadHooks = (lifecycleHooks.unloading ?? []).map(x => x.instance);
        this._hasCanLoad = 'canLoad' in instance;
        this._hasLoad = 'loading' in instance;
        this._hasCanUnload = 'canUnload' in instance;
        this._hasUnload = 'unloading' in instance;
    }
    /** @internal */
    _activate(initiator, parent) {
        if (initiator === null) {
            this._logger.trace(`activate() - initial`);
            return this.controller.activate(this.controller, parent);
        }
        this._logger.trace(`activate()`);
        // Promise return values from user VM hooks are awaited by the initiator
        void this.controller.activate(initiator, parent);
    }
    /** @internal */
    _deactivate(initiator, parent) {
        if (initiator === null) {
            this._logger.trace(`deactivate() - initial`);
            return this.controller.deactivate(this.controller, parent);
        }
        this._logger.trace(`deactivate()`);
        // Promise return values from user VM hooks are awaited by the initiator
        void this.controller.deactivate(initiator, parent);
    }
    /** @internal */
    _dispose() {
        this._logger.trace(`dispose()`);
        this.controller.dispose();
    }
    /** @internal */
    _canUnload(tr, next, b) {
        this._logger.trace(`canUnload(next:%s) - invoking ${this._canUnloadHooks.length} hooks`, next);
        b.push();
        let promise = Promise.resolve();
        for (const hook of this._canUnloadHooks) {
            b.push();
            promise = promise.then(() => new Promise((res) => {
                if (tr.guardsResult !== true) {
                    b.pop();
                    res();
                    return;
                }
                tr.run(() => {
                    return hook.canUnload(this.instance, next, this.routeNode);
                }, ret => {
                    if (tr.guardsResult === true && ret !== true) {
                        tr.guardsResult = false;
                    }
                    b.pop();
                    res();
                });
            }));
        }
        if (this._hasCanUnload) {
            b.push();
            // deepscan-disable-next-line UNUSED_VAR_ASSIGN
            promise = promise.then(() => {
                if (tr.guardsResult !== true) {
                    b.pop();
                    return;
                }
                tr.run(() => {
                    return this.instance.canUnload(next, this.routeNode);
                }, ret => {
                    if (tr.guardsResult === true && ret !== true) {
                        tr.guardsResult = false;
                    }
                    b.pop();
                });
            });
        }
        b.pop();
    }
    /** @internal */
    _canLoad(tr, next, b) {
        this._logger.trace(`canLoad(next:%s) - invoking ${this._canLoadHooks.length} hooks`, next);
        const rootCtx = this.ctx.root;
        b.push();
        let promise = Promise.resolve();
        for (const hook of this._canLoadHooks) {
            b.push();
            promise = promise.then(() => new Promise((res) => {
                if (tr.guardsResult !== true) {
                    b.pop();
                    res();
                    return;
                }
                tr.run(() => {
                    return hook.canLoad(this.instance, next.params, next, this.routeNode);
                }, ret => {
                    if (tr.guardsResult === true && ret !== true) {
                        tr.guardsResult = ret === false ? false : ViewportInstructionTree.create(ret, this.routerOptions, void 0, rootCtx);
                    }
                    b.pop();
                    res();
                });
            }));
        }
        if (this._hasCanLoad) {
            b.push();
            // deepscan-disable-next-line UNUSED_VAR_ASSIGN
            promise = promise.then(() => {
                if (tr.guardsResult !== true) {
                    b.pop();
                    return;
                }
                tr.run(() => {
                    return this.instance.canLoad(next.params, next, this.routeNode);
                }, ret => {
                    if (tr.guardsResult === true && ret !== true) {
                        tr.guardsResult = ret === false ? false : ViewportInstructionTree.create(ret, this.routerOptions, void 0, rootCtx);
                    }
                    b.pop();
                });
            });
        }
        b.pop();
    }
    /** @internal */
    _unloading(tr, next, b) {
        this._logger.trace(`unloading(next:%s) - invoking ${this._unloadHooks.length} hooks`, next);
        b.push();
        for (const hook of this._unloadHooks) {
            tr.run(() => {
                b.push();
                return hook.unloading(this.instance, next, this.routeNode);
            }, () => {
                b.pop();
            });
        }
        if (this._hasUnload) {
            tr.run(() => {
                b.push();
                return this.instance.unloading(next, this.routeNode);
            }, () => {
                b.pop();
            });
        }
        b.pop();
    }
    /** @internal */
    _loading(tr, next, b) {
        this._logger.trace(`loading(next:%s) - invoking ${this._loadHooks.length} hooks`, next);
        b.push();
        for (const hook of this._loadHooks) {
            tr.run(() => {
                b.push();
                return hook.loading(this.instance, next.params, next, this.routeNode);
            }, () => {
                b.pop();
            });
        }
        if (this._hasLoad) {
            tr.run(() => {
                b.push();
                return this.instance.loading(next.params, next, this.routeNode);
            }, () => {
                b.pop();
            });
        }
        b.pop();
    }
}

const IRouteContext = /*@__PURE__*/ DI.createInterface('IRouteContext');
const allowedEagerComponentTypes = Object.freeze(['string', 'object', 'function']);
function isEagerInstruction(val) {
    // don't try to resolve an instruction with children eagerly, as the children are essentially resolved lazily, for now.
    if (val == null)
        return false;
    const params = val.params;
    const component = val.component;
    return typeof params === 'object'
        && params !== null
        && component != null
        && allowedEagerComponentTypes.includes(typeof component)
        && !(component instanceof Promise) // a promise component is inherently meant to be lazy-loaded
    ;
}
/**
 * Holds the information of a component in the context of a specific container.
 *
 * The `RouteContext` is cached using a 3-part composite key consisting of the CustomElementDefinition, the RouteConfig and the RenderContext.
 *
 * This means there can be more than one `RouteContext` per component type if either:
 * - The `RouteConfig` for a type is overridden manually via `Route.configure`
 * - Different components (with different `RenderContext`s) reference the same component via a child route config
 */
class RouteContext {
    get isRoot() {
        return this.parent === null;
    }
    get depth() {
        return this.path.length - 1;
    }
    get resolved() {
        return this._resolved;
    }
    get allResolved() {
        return this._allResolved;
    }
    get node() {
        const node = this._node;
        if (node === null) {
            throw new Error(`Invariant violation: RouteNode should be set immediately after the RouteContext is created. Context: ${this}`);
        }
        return node;
    }
    set node(value) {
        const prev = this.prevNode = this._node;
        if (prev !== value) {
            this._node = value;
            this.logger.trace(`Node changed from %s to %s`, this.prevNode, value);
        }
    }
    /**
     * The viewport hosting the component associated with this RouteContext.
     * The root RouteContext has no ViewportAgent and will throw when attempting to access this property.
     */
    get vpa() {
        const vpa = this._vpa;
        if (vpa === null) {
            throw new Error(`RouteContext has no ViewportAgent: ${this}`);
        }
        return vpa;
    }
    get navigationModel() {
        return this._navigationModel;
    }
    constructor(viewportAgent, parent, component, config, parentContainer, _router) {
        this.parent = parent;
        this.component = component;
        this.config = config;
        this._router = _router;
        this.childViewportAgents = [];
        /**
         * The (fully resolved) configured child routes of this context's `RouteConfig`
         */
        this.childRoutes = [];
        /** @internal */
        this._resolved = null;
        /** @internal */
        this._allResolved = null;
        this.prevNode = null;
        /** @internal */
        this._node = null;
        this._childRoutesConfigured = false;
        this._vpa = viewportAgent;
        if (parent === null) {
            this.root = this;
            this.path = [this];
            this.friendlyPath = component.name;
        }
        else {
            this.root = parent.root;
            this.path = [...parent.path, this];
            this.friendlyPath = `${parent.friendlyPath}/${component.name}`;
        }
        this.logger = parentContainer.get(ILogger).scopeTo(`RouteContext<${this.friendlyPath}>`);
        this.logger.trace('constructor()');
        this.moduleLoader = parentContainer.get(IModuleLoader);
        const container = this.container = parentContainer.createChild();
        container.registerResolver(IController, this.hostControllerProvider = new InstanceProvider(), true);
        const ctxProvider = new InstanceProvider('IRouteContext', this);
        container.registerResolver(IRouteContext, ctxProvider);
        container.registerResolver(RouteContext, ctxProvider);
        container.register(config);
        this._recognizer = new RouteRecognizer();
        if (_router.options.useNavigationModel) {
            const navModel = this._navigationModel = new NavigationModel([]);
            // Note that routing-contexts have the same lifetime as the app itself; therefore, an attempt to dispose the subscription is kind of useless.
            // Also considering that in a realistic app the number of configured routes are limited in number, this subscription and keeping the routes' active property in sync should not create much issue.
            // If need be we can optimize it later.
            container
                .get(IRouterEvents)
                .subscribe('au:router:navigation-end', () => navModel.setIsActive(_router, this));
        }
        else {
            this._navigationModel = null;
        }
        this._processConfig(config);
    }
    _processConfig(config) {
        const promises = [];
        const allPromises = [];
        const childrenRoutes = config.routes ?? noRoutes;
        const len = childrenRoutes.length;
        if (len === 0) {
            const getRouteConfig = config.component.prototype?.getRouteConfig;
            this._childRoutesConfigured = getRouteConfig == null ? true : typeof getRouteConfig !== 'function';
            return;
        }
        const navModel = this._navigationModel;
        const hasNavModel = navModel !== null;
        let i = 0;
        for (; i < len; i++) {
            const childRoute = childrenRoutes[i];
            if (childRoute instanceof Promise) {
                const p = this.addRoute(childRoute);
                promises.push(p);
                allPromises.push(p);
            }
            else {
                const rdResolution = resolveRouteConfiguration(childRoute, true, config, null, this);
                if (rdResolution instanceof Promise) {
                    if (!isPartialChildRouteConfig(childRoute) || childRoute.path == null)
                        throw new Error(`Invalid route config. When the component property is a lazy import, the path must be specified.`);
                    for (const path of ensureArrayOfStrings(childRoute.path)) {
                        this.$addRoute(path, childRoute.caseSensitive ?? false, rdResolution);
                    }
                    const idx = this.childRoutes.length;
                    const p = rdResolution.then((rdConfig) => {
                        return this.childRoutes[idx] = rdConfig;
                    });
                    this.childRoutes.push(p);
                    if (hasNavModel) {
                        navModel.addRoute(p);
                    }
                    allPromises.push(p.then(noop));
                }
                else {
                    for (const path of rdResolution.path ?? emptyArray) {
                        this.$addRoute(path, rdResolution.caseSensitive, rdResolution);
                    }
                    this.childRoutes.push(rdResolution);
                    if (hasNavModel) {
                        navModel.addRoute(rdResolution);
                    }
                }
            }
        }
        this._childRoutesConfigured = true;
        if (promises.length > 0) {
            this._resolved = Promise.all(promises).then(() => {
                this._resolved = null;
            });
        }
        if (allPromises.length > 0) {
            this._allResolved = Promise.all(allPromises).then(() => {
                this._allResolved = null;
            });
        }
    }
    /**
     * Create a new `RouteContext` and register it in the provided container.
     *
     * Uses the `RenderContext` of the registered `IAppRoot` as the root context.
     *
     * @param container - The container from which to resolve the `IAppRoot` and in which to register the `RouteContext`
     */
    static setRoot(container) {
        const logger = container.get(ILogger).scopeTo('RouteContext');
        if (!container.has(IAppRoot, true)) {
            logAndThrow(new Error(`The provided container has no registered IAppRoot. RouteContext.setRoot can only be used after Aurelia.app was called, on a container that is within that app's component tree.`), logger);
        }
        if (container.has(IRouteContext, true)) {
            logAndThrow(new Error(`A root RouteContext is already registered. A possible cause is the RouterConfiguration being registered more than once in the same container tree. If you have a multi-rooted app, make sure you register RouterConfiguration only in the "forked" containers and not in the common root.`), logger);
        }
        const { controller } = container.get(IAppRoot);
        if (controller === void 0) {
            logAndThrow(new Error(`The provided IAppRoot does not (yet) have a controller. A possible cause is calling this API manually before Aurelia.start() is called`), logger);
        }
        const router = container.get(IRouter);
        return onResolve(router.getRouteContext(null, controller.definition, controller.viewModel, controller.container, null, null, null), routeContext => {
            container.register(Registration.instance(IRouteContext, routeContext));
            routeContext.node = router.routeTree.root;
        });
    }
    static resolve(root, context) {
        const rootContainer = root.container;
        const logger = rootContainer.get(ILogger).scopeTo('RouteContext');
        if (context === null || context === void 0) {
            logger.trace(`resolve(context:%s) - returning root RouteContext`, context);
            return root;
        }
        if (isRouteContext(context)) {
            logger.trace(`resolve(context:%s) - returning provided RouteContext`, context);
            return context;
        }
        if (context instanceof rootContainer.get(IPlatform).Node) {
            try {
                // CustomElement.for can theoretically throw in (as of yet) unknown situations.
                // If that happens, we want to know about the situation and *not* just fall back to the root context, as that might make
                // some already convoluted issues impossible to troubleshoot.
                // That's why we catch, log and re-throw instead of just letting the error bubble up.
                // This also gives us a set point in the future to potentially handle supported scenarios where this could occur.
                const controller = CustomElement.for(context, { searchParents: true });
                logger.trace(`resolve(context:Node(nodeName:'${context.nodeName}'),controller:'${controller.definition.name}') - resolving RouteContext from controller's RenderContext`);
                return controller.container.get(IRouteContext);
            }
            catch (err) {
                logger.error(`Failed to resolve RouteContext from Node(nodeName:'${context.nodeName}')`, err);
                throw err;
            }
        }
        if (isCustomElementViewModel(context)) {
            const controller = context.$controller;
            logger.trace(`resolve(context:CustomElementViewModel(name:'${controller.definition.name}')) - resolving RouteContext from controller's RenderContext`);
            return controller.container.get(IRouteContext);
        }
        if (isCustomElementController(context)) {
            const controller = context;
            logger.trace(`resolve(context:CustomElementController(name:'${controller.definition.name}')) - resolving RouteContext from controller's RenderContext`);
            return controller.container.get(IRouteContext);
        }
        logAndThrow(new Error(`Invalid context type: ${Object.prototype.toString.call(context)}`), logger);
    }
    dispose() {
        this.container.dispose();
    }
    resolveViewportAgent(req) {
        this.logger.trace(`resolveViewportAgent(req:%s)`, req);
        const agent = this.childViewportAgents.find(x => { return x._handles(req); });
        if (agent === void 0) {
            throw new Error(`Failed to resolve ${req} at:\n${this.printTree()}`);
        }
        return agent;
    }
    getAvailableViewportAgents() {
        return this.childViewportAgents.filter(x => x._isAvailable());
    }
    getFallbackViewportAgent(name) {
        return this.childViewportAgents.find(x => x._isAvailable() && x.viewport.name === name && x.viewport.fallback !== '') ?? null;
    }
    /**
     * Create a component based on the provided viewportInstruction.
     *
     * @param hostController - The `ICustomElementController` whose component (typically `au-viewport`) will host this component.
     * @param routeNode - The routeNode that describes the component + state.
     */
    createComponentAgent(hostController, routeNode) {
        this.logger.trace(`createComponentAgent(routeNode:%s)`, routeNode);
        this.hostControllerProvider.prepare(hostController);
        const container = this.container;
        const componentInstance = container.get(routeNode.component.key);
        // this is the point where we can load the delayed (non-static) child route configuration by calling the getRouteConfig
        const task = this._childRoutesConfigured
            ? void 0
            : onResolve(resolveRouteConfiguration(componentInstance, false, this.config, routeNode, null), config => this._processConfig(config));
        return onResolve(task, () => {
            const controller = Controller.$el(container, componentInstance, hostController.host, null);
            const componentAgent = new ComponentAgent(componentInstance, controller, routeNode, this, this._router.options);
            this.hostControllerProvider.dispose();
            return componentAgent;
        });
    }
    registerViewport(viewport) {
        const agent = ViewportAgent.for(viewport, this);
        if (this.childViewportAgents.includes(agent)) {
            this.logger.trace(`registerViewport(agent:%s) -> already registered, so skipping`, agent);
        }
        else {
            this.logger.trace(`registerViewport(agent:%s) -> adding`, agent);
            this.childViewportAgents.push(agent);
        }
        return agent;
    }
    unregisterViewport(viewport) {
        const agent = ViewportAgent.for(viewport, this);
        if (this.childViewportAgents.includes(agent)) {
            this.logger.trace(`unregisterViewport(agent:%s) -> unregistering`, agent);
            this.childViewportAgents.splice(this.childViewportAgents.indexOf(agent), 1);
        }
        else {
            this.logger.trace(`unregisterViewport(agent:%s) -> not registered, so skipping`, agent);
        }
    }
    recognize(path, searchAncestor = false) {
        this.logger.trace(`recognize(path:'${path}')`);
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let _current = this;
        let _continue = true;
        let result = null;
        while (_continue) {
            result = _current._recognizer.recognize(path);
            if (result === null) {
                if (!searchAncestor || _current.isRoot)
                    return null;
                _current = _current.parent;
            }
            else {
                _continue = false;
            }
        }
        return new $RecognizedRoute(result, Reflect.has(result.params, RESIDUE)
            ? (result.params[RESIDUE] ?? null)
            : null);
    }
    addRoute(routeable) {
        this.logger.trace(`addRoute(routeable:'${routeable}')`);
        return onResolve(resolveRouteConfiguration(routeable, true, this.config, null, this), rdConfig => {
            for (const path of rdConfig.path ?? emptyArray) {
                this.$addRoute(path, rdConfig.caseSensitive, rdConfig);
            }
            this._navigationModel?.addRoute(rdConfig);
            this.childRoutes.push(rdConfig);
        });
    }
    $addRoute(path, caseSensitive, handler) {
        this._recognizer.add({
            path,
            caseSensitive,
            handler,
        }, true);
    }
    resolveLazy(promise) {
        return this.moduleLoader.load(promise, m => {
            // when we have import('./some-path').then(x => x.somethingSpecific)
            const raw = m.raw;
            if (typeof raw === 'function') {
                const def = Protocol.resource.getAll(raw).find(isCustomElementDefinition);
                if (def !== void 0)
                    return def;
            }
            let defaultExport = void 0;
            let firstNonDefaultExport = void 0;
            for (const item of m.items) {
                if (item.isConstructable) {
                    const def = item.definitions.find(isCustomElementDefinition);
                    if (def !== void 0) {
                        if (item.key === 'default') {
                            defaultExport = def;
                        }
                        else if (firstNonDefaultExport === void 0) {
                            firstNonDefaultExport = def;
                        }
                    }
                }
            }
            if (defaultExport === void 0) {
                if (firstNonDefaultExport === void 0) {
                    // TODO: make error more accurate and add potential causes/solutions
                    throw new Error(`${promise} does not appear to be a component or CustomElement recognizable by Aurelia`);
                }
                return firstNonDefaultExport;
            }
            return defaultExport;
        });
    }
    generateViewportInstruction(instruction) {
        if (!isEagerInstruction(instruction))
            return null;
        const component = instruction.component;
        let paths;
        let throwError = false;
        if (component instanceof RouteConfig) {
            paths = component.path;
            throwError = true;
        }
        else if (typeof component === 'string') {
            const $rdConfig = this.childRoutes.find(x => x.id === component);
            if ($rdConfig === void 0)
                return null;
            paths = $rdConfig.path;
        }
        else if (component.type === 0 /* NavigationInstructionType.string */) {
            const $rdConfig = this.childRoutes.find(x => x.id === component.value);
            if ($rdConfig === void 0)
                return null;
            paths = $rdConfig.path;
        }
        else {
            // as the component is ensured not to be a promise in here, the resolution should also be synchronous
            const ced = resolveCustomElementDefinition(component, this)[1];
            paths = this.childRoutes.reduce((acc, x) => {
                if (x.component === ced.Type) {
                    acc.push(...x.path);
                }
                return acc;
            }, []);
            throwError = true;
        }
        if (paths === void 0)
            return null;
        const params = instruction.params;
        const recognizer = this._recognizer;
        const numPaths = paths.length;
        const errors = [];
        let result = null;
        if (numPaths === 1) {
            const result = core(paths[0]);
            if (result === null) {
                const message = `Unable to eagerly generate path for ${instruction}. Reasons: ${errors}.`;
                if (throwError)
                    throw new Error(message);
                this.logger.debug(message);
                return null;
            }
            return {
                vi: ViewportInstruction.create({
                    recognizedRoute: new $RecognizedRoute(new RecognizedRoute(result.endpoint, result.consumed), null),
                    component: result.path,
                    children: instruction.children,
                    viewport: instruction.viewport,
                    open: instruction.open,
                    close: instruction.close,
                }),
                query: result.query,
            };
        }
        let maxScore = 0;
        for (let i = 0; i < numPaths; i++) {
            const res = core(paths[i]);
            if (res === null)
                continue;
            if (result === null) {
                result = res;
                maxScore = Object.keys(res.consumed).length;
            }
            else if (Object.keys(res.consumed).length > maxScore) { // ignore anything other than monotonically increasing consumption
                result = res;
            }
        }
        if (result === null) {
            const message = `Unable to eagerly generate path for ${instruction}. Reasons: ${errors}.`;
            if (throwError)
                throw new Error(message);
            this.logger.debug(message);
            return null;
        }
        return {
            vi: ViewportInstruction.create({
                recognizedRoute: new $RecognizedRoute(new RecognizedRoute(result.endpoint, result.consumed), null),
                component: result.path,
                children: instruction.children,
                viewport: instruction.viewport,
                open: instruction.open,
                close: instruction.close,
            }),
            query: result.query,
        };
        function core(path) {
            const endpoint = recognizer.getEndpoint(path);
            if (endpoint === null) {
                errors.push(`No endpoint found for the path: '${path}'.`);
                return null;
            }
            const consumed = Object.create(null);
            for (const param of endpoint.params) {
                const key = param.name;
                let value = params[key];
                if (value == null || String(value).length === 0) {
                    if (!param.isOptional) {
                        errors.push(`No value for the required parameter '${key}' is provided for the path: '${path}'.`);
                        return null;
                    }
                    value = '';
                }
                else {
                    consumed[key] = value;
                }
                const pattern = param.isStar
                    ? `*${key}`
                    : param.isOptional
                        ? `:${key}?`
                        : `:${key}`;
                path = path.replace(pattern, value);
            }
            const consumedKeys = Object.keys(consumed);
            const query = Object.fromEntries(Object.entries(params).filter(([key]) => !consumedKeys.includes(key)));
            return { path: path.replace(/\/\//g, '/'), endpoint, consumed, query };
        }
    }
    toString() {
        const vpAgents = this.childViewportAgents;
        const viewports = vpAgents.map(String).join(',');
        return `RC(path:'${this.friendlyPath}',viewports:[${viewports}])`;
    }
    printTree() {
        const tree = [];
        for (let i = 0; i < this.path.length; ++i) {
            tree.push(`${' '.repeat(i)}${this.path[i]}`);
        }
        return tree.join('\n');
    }
}
function isRouteContext(value) {
    return value instanceof RouteContext;
}
function logAndThrow(err, logger) {
    logger.error(err);
    throw err;
}
function isCustomElementDefinition(value) {
    return CustomElement.isType(value.Type);
}
class $RecognizedRoute {
    constructor(route, residue) {
        this.route = route;
        this.residue = residue;
    }
    toString() {
        const route = this.route;
        const cr = route.endpoint.route;
        return `RR(route:(endpoint:(route:(path:${cr.path},handler:${cr.handler})),params:${JSON.stringify(route.params)}),residue:${this.residue})`;
    }
}
// Usage of classical interface pattern is intentional.
class NavigationModel {
    constructor(routes) {
        this.routes = routes;
        this._promise = void 0;
    }
    resolve() {
        return onResolve(this._promise, noop);
    }
    /** @internal */
    setIsActive(router, context) {
        void onResolve(this._promise, () => {
            for (const route of this.routes) {
                route.setIsActive(router, context);
            }
        });
    }
    /** @internal */
    addRoute(route) {
        const routes = this.routes;
        if (!(route instanceof Promise)) {
            if (route.nav ?? false) {
                routes.push(NavigationRoute.create(route));
            }
            return;
        }
        const index = routes.length;
        routes.push((void 0)); // reserve the slot
        let promise = void 0;
        promise = this._promise = onResolve(this._promise, () => onResolve(route, rdConfig => {
            if (rdConfig.nav) {
                routes[index] = NavigationRoute.create(rdConfig);
            }
            else {
                routes.splice(index, 1);
            }
            if (this._promise === promise) {
                this._promise = void 0;
            }
        }));
    }
}
// Usage of classical interface pattern is intentional.
class NavigationRoute {
    constructor(id, path, redirectTo, title, data) {
        this.id = id;
        this.path = path;
        this.redirectTo = redirectTo;
        this.title = title;
        this.data = data;
        this._trees = null;
    }
    /** @internal */
    static create(rdConfig) {
        return new NavigationRoute(rdConfig.id, ensureArrayOfStrings(rdConfig.path ?? emptyArray), rdConfig.redirectTo, rdConfig.title, rdConfig.data);
    }
    get isActive() {
        return this._isActive;
    }
    /** @internal */
    setIsActive(router, context) {
        let trees = this._trees;
        if (trees === null) {
            const routerOptions = router.options;
            trees = this._trees = this.path.map(p => {
                const ep = context._recognizer.getEndpoint(p);
                if (ep === null)
                    throw new Error(`No endpoint found for path '${p}'`);
                return new ViewportInstructionTree(NavigationOptions.create(routerOptions, { context }), false, [
                    ViewportInstruction.create({
                        recognizedRoute: new $RecognizedRoute(new RecognizedRoute(ep, emptyObject), null),
                        component: p,
                    })
                ], emptyQuery, null);
            });
        }
        this._isActive = trees.some(vit => router.routeTree.contains(vit, true));
    }
}

let ViewportCustomElement = class ViewportCustomElement {
    constructor(logger, ctx) {
        this.logger = logger;
        this.ctx = ctx;
        this.name = defaultViewportName;
        this.usedBy = '';
        this.default = '';
        this.fallback = '';
        this.agent = (void 0);
        this.controller = (void 0);
        this.logger = logger.scopeTo(`au-viewport<${ctx.friendlyPath}>`);
        this.logger.trace('constructor()');
    }
    /** @internal */
    _getFallback(viewportInstruction, routeNode, context) {
        const fallback = this.fallback;
        return typeof fallback === 'function'
            && !CustomElement.isType(fallback)
            ? fallback(viewportInstruction, routeNode, context)
            : fallback;
    }
    hydrated(controller) {
        this.logger.trace('hydrated()');
        this.controller = controller;
        this.agent = this.ctx.registerViewport(this);
    }
    attaching(initiator, _parent) {
        this.logger.trace('attaching()');
        return this.agent._activateFromViewport(initiator, this.controller);
    }
    detaching(initiator, _parent) {
        this.logger.trace('detaching()');
        return this.agent._deactivateFromViewport(initiator, this.controller);
    }
    dispose() {
        this.logger.trace('dispose()');
        this.ctx.unregisterViewport(this);
        this.agent._dispose();
        this.agent = (void 0);
    }
    toString() {
        const propStrings = [];
        for (const prop of props) {
            const value = this[prop];
            // Only report props that don't have default values (but always report name)
            // This is a bit naive and dirty right now, but it's mostly for debugging purposes anyway. Can clean up later. Maybe put it in a serializer
            switch (typeof value) {
                case 'string':
                    if (value !== '') {
                        propStrings.push(`${prop}:'${value}'`);
                    }
                    break;
                case 'boolean':
                    if (value) {
                        propStrings.push(`${prop}:${value}`);
                    }
                    break;
                default: {
                    propStrings.push(`${prop}:${String(value)}`);
                }
            }
        }
        return `VP(ctx:'${this.ctx.friendlyPath}',${propStrings.join(',')})`;
    }
};
__decorate([
    bindable
], ViewportCustomElement.prototype, "name", void 0);
__decorate([
    bindable
], ViewportCustomElement.prototype, "usedBy", void 0);
__decorate([
    bindable
], ViewportCustomElement.prototype, "default", void 0);
__decorate([
    bindable
], ViewportCustomElement.prototype, "fallback", void 0);
ViewportCustomElement = __decorate([
    customElement({ name: 'au-viewport' }),
    __param(0, ILogger),
    __param(1, IRouteContext)
], ViewportCustomElement);
const props = [
    'name',
    'usedBy',
    'default',
    'fallback',
];

let LoadCustomAttribute = class LoadCustomAttribute {
    constructor(el, router, events, ctx, locationMgr) {
        this.el = el;
        this.router = router;
        this.events = events;
        this.ctx = ctx;
        this.locationMgr = locationMgr;
        this.attribute = 'href';
        this.active = false;
        this.href = null;
        this.instructions = null;
        this.navigationEndListener = null;
        this.onClick = (e) => {
            if (this.instructions === null) {
                return;
            }
            // Ensure this is an ordinary left-button click.
            if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey || e.button !== 0) {
                return;
            }
            e.preventDefault();
            // Floating promises from `Router#load` are ok because the router keeps track of state and handles the errors, etc.
            void this.router.load(this.instructions, { context: this.context });
        };
        // Ensure the element is not explicitly marked as external.
        this.isEnabled = !el.hasAttribute('external') && !el.hasAttribute('data-external');
        this.activeClass = router.options.activeClass;
    }
    binding() {
        if (this.isEnabled) {
            this.el.addEventListener('click', this.onClick);
        }
        this.valueChanged();
        this.navigationEndListener = this.events.subscribe('au:router:navigation-end', _e => {
            this.valueChanged();
            const active = this.active = this.instructions !== null && this.router.isActive(this.instructions, this.context);
            const activeClass = this.activeClass;
            if (activeClass === null)
                return;
            this.el.classList.toggle(activeClass, active);
        });
    }
    attaching() {
        const ctx = this.context;
        const promise = ctx.allResolved;
        if (promise !== null) {
            return promise.then(() => {
                this.valueChanged();
            });
        }
    }
    unbinding() {
        if (this.isEnabled) {
            this.el.removeEventListener('click', this.onClick);
        }
        this.navigationEndListener.dispose();
    }
    valueChanged() {
        const router = this.router;
        const useHash = router.options.useUrlFragmentHash;
        const component = this.route;
        // this allows binding context to null for navigation from root; unbound vs explicit null binding
        let ctx = this.context;
        if (ctx === void 0) {
            ctx = this.context = this.ctx;
        }
        else if (ctx === null) {
            ctx = this.context = this.ctx.root;
        }
        if (component != null && ctx.allResolved === null) {
            const params = this.params;
            const instructions = this.instructions = router.createViewportInstructions(typeof params === 'object' && params !== null
                ? { component, params }
                : component, { context: ctx });
            this.href = instructions.toUrl(useHash);
        }
        else {
            this.instructions = null;
            this.href = null;
        }
        const controller = CustomElement.for(this.el, { optional: true });
        if (controller !== null) {
            controller.viewModel[this.attribute] = this.instructions;
        }
        else {
            if (this.href === null) {
                this.el.removeAttribute(this.attribute);
            }
            else {
                const value = useHash ? this.href : this.locationMgr.addBaseHref(this.href);
                this.el.setAttribute(this.attribute, value);
            }
        }
    }
};
__decorate([
    bindable({ mode: 2 /* BindingMode.toView */, primary: true, callback: 'valueChanged' })
], LoadCustomAttribute.prototype, "route", void 0);
__decorate([
    bindable({ mode: 2 /* BindingMode.toView */, callback: 'valueChanged' })
], LoadCustomAttribute.prototype, "params", void 0);
__decorate([
    bindable({ mode: 2 /* BindingMode.toView */ })
], LoadCustomAttribute.prototype, "attribute", void 0);
__decorate([
    bindable({ mode: 4 /* BindingMode.fromView */ })
], LoadCustomAttribute.prototype, "active", void 0);
__decorate([
    bindable({ mode: 2 /* BindingMode.toView */, callback: 'valueChanged' })
], LoadCustomAttribute.prototype, "context", void 0);
LoadCustomAttribute = __decorate([
    customAttribute('load'),
    __param(0, INode),
    __param(1, IRouter),
    __param(2, IRouterEvents),
    __param(3, IRouteContext),
    __param(4, ILocationManager)
], LoadCustomAttribute);

/*
 * Note: Intentionally, there is no bindable `context` here.
 * Otherwise this CA needs to be turned into a multi-binding CA.
 * Which means that the following simplest case won't work any longer:
 *
 * ```html
 * <a href="https://bla.bla.com/bla" data-external>bla</a>
 * ```
 * Because the template compiler will think that `https` is a bindable property in this CA,
 * and will fail as it won't find a bindable property `https` here in this CA.
 * Therefore, till the template compiler can handle that correctly, introduction of a bindable context is intentionally omitted.
 */
let HrefCustomAttribute = class HrefCustomAttribute {
    get isExternal() {
        return this.el.hasAttribute('external') || this.el.hasAttribute('data-external');
    }
    constructor(el, router, ctx, w) {
        this.el = el;
        this.router = router;
        this.ctx = ctx;
        this.isInitialized = false;
        if (router.options.useHref &&
            // Ensure the element is an anchor
            el.nodeName === 'A') {
            // Ensure the anchor targets the current window.
            switch (el.getAttribute('target')) {
                case null:
                case w.name:
                case '_self':
                    this.isEnabled = true;
                    break;
                default:
                    this.isEnabled = false;
                    break;
            }
        }
        else {
            this.isEnabled = false;
        }
    }
    binding() {
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.isEnabled = this.isEnabled && getRef(this.el, CustomAttribute.getDefinition(LoadCustomAttribute).key) === null;
        }
        this.valueChanged(this.value);
        this.el.addEventListener('click', this);
        // this.eventListener = this.delegator.addEventListener(this.target, this.el, 'click', this);
    }
    unbinding() {
        // this.eventListener.dispose();
        this.el.removeEventListener('click', this);
    }
    valueChanged(newValue) {
        if (newValue == null) {
            this.el.removeAttribute('href');
        }
        else {
            if (this.router.options.useUrlFragmentHash
                && this.ctx.isRoot
                && !/^[.#]/.test(newValue)) {
                newValue = `#${newValue}`;
            }
            this.el.setAttribute('href', newValue);
        }
    }
    handleEvent(e) {
        this._onClick(e);
    }
    /** @internal */
    _onClick(e) {
        // Ensure this is an ordinary left-button click
        if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey || e.button !== 0
            // on an internally managed link
            || this.isExternal
            || !this.isEnabled) {
            return;
        }
        // Use the normalized attribute instead of this.value to ensure consistency.
        const href = this.el.getAttribute('href');
        if (href !== null) {
            e.preventDefault();
            // Floating promises from `Router#load` are ok because the router keeps track of state and handles the errors, etc.
            void this.router.load(href, { context: this.ctx });
        }
    }
};
__decorate([
    bindable({ mode: 2 /* BindingMode.toView */ })
], HrefCustomAttribute.prototype, "value", void 0);
HrefCustomAttribute = __decorate([
    customAttribute({ name: 'href', noMultiBindings: true }),
    __param(0, INode),
    __param(1, IRouter),
    __param(2, IRouteContext),
    __param(3, IWindow)
], HrefCustomAttribute);

const RouterRegistration = IRouter;
/**
 * Default runtime/environment-agnostic implementations for the following interfaces:
 * - `IRouter`
 */
const DefaultComponents = [
    RouterRegistration,
];
const ViewportCustomElementRegistration = ViewportCustomElement;
const LoadCustomAttributeRegistration = LoadCustomAttribute;
const HrefCustomAttributeRegistration = HrefCustomAttribute;
/**
 * Default router resources:
 * - Custom Elements: `au-viewport`
 * - Custom Attributes: `load`, `href`
 */
const DefaultResources = [
    ViewportCustomElement,
    LoadCustomAttribute,
    HrefCustomAttribute,
];
function configure(container, options) {
    let basePath = null;
    if (isObject(options)) {
        basePath = options.basePath ?? null;
    }
    else {
        options = {};
    }
    const routerOptions = RouterOptions.create(options);
    return container.register(Registration.cachedCallback(IBaseHref, (handler, _, __) => {
        const window = handler.get(IWindow);
        const url = new URL(window.document.baseURI);
        url.pathname = normalizePath(basePath ?? url.pathname);
        return url;
    }), Registration.instance(IRouterOptions, routerOptions), Registration.instance(RouterOptions, routerOptions), AppTask.hydrated(IContainer, RouteContext.setRoot), AppTask.activated(IRouter, router => router.start(true)), AppTask.deactivated(IRouter, router => {
        router.stop();
    }), ...DefaultComponents, ...DefaultResources);
}
const RouterConfiguration = {
    register(container) {
        return configure(container);
    },
    /**
     * Make it possible to specify options to Router activation.
     * Parameter is either a config object that's passed to Router's activate
     * or a config function that's called instead of Router's activate.
     */
    customize(options) {
        return {
            register(container) {
                return configure(container, options);
            },
        };
    },
};

class ScrollState {
    constructor(el) {
        this.el = el;
        this.top = el.scrollTop;
        this.left = el.scrollLeft;
    }
    static has(el) {
        return el.scrollTop > 0 || el.scrollLeft > 0;
    }
    restore() {
        this.el.scrollTo(this.left, this.top);
        this.el = null;
    }
}
function restoreState(state) {
    state.restore();
}
class HostElementState {
    constructor(host) {
        this.scrollStates = [];
        this.save(host.children);
    }
    save(elements) {
        let el;
        for (let i = 0, ii = elements.length; i < ii; ++i) {
            el = elements[i];
            if (ScrollState.has(el)) {
                this.scrollStates.push(new ScrollState(el));
            }
            this.save(el.children);
        }
    }
    restore() {
        this.scrollStates.forEach(restoreState);
        this.scrollStates = null;
    }
}
const IStateManager = /*@__PURE__*/ DI.createInterface('IStateManager', x => x.singleton(ScrollStateManager));
class ScrollStateManager {
    constructor() {
        this.cache = new WeakMap();
    }
    saveState(controller) {
        this.cache.set(controller.host, new HostElementState(controller.host));
    }
    restoreState(controller) {
        const state = this.cache.get(controller.host);
        if (state !== void 0) {
            state.restore();
            this.cache.delete(controller.host);
        }
    }
}

export { AST, ActionExpression, AuNavId, ComponentAgent, ComponentExpression, CompositeSegmentExpression, DefaultComponents, DefaultResources, ExpressionKind, HrefCustomAttribute, HrefCustomAttributeRegistration, ILocationManager, IRouteContext, IRouter, IRouterEvents, IRouterOptions, IStateManager, LoadCustomAttribute, LoadCustomAttributeRegistration, LocationChangeEvent, NavigationCancelEvent, NavigationEndEvent, NavigationErrorEvent, NavigationOptions, NavigationStartEvent, ParameterExpression, ParameterListExpression, Route, RouteConfig, RouteContext, RouteExpression, RouteNode, RouteTree, Router, RouterConfiguration, RouterOptions, RouterRegistration, ScopedSegmentExpression, SegmentExpression, SegmentGroupExpression, Transition, ViewportAgent, ViewportCustomElement, ViewportCustomElementRegistration, ViewportExpression, isManagedState, route, toManagedState };
//# sourceMappingURL=index.dev.mjs.map
