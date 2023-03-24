'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var kernel = require('@aurelia/kernel');
var runtimeHtml = require('@aurelia/runtime-html');
var metadata = require('@aurelia/metadata');
var routeRecognizer = require('@aurelia/route-recognizer');

class Endpoint$1 {
    constructor(router, name, connectedCE, options = {}) {
        this.router = router;
        this.name = name;
        this.connectedCE = connectedCE;
        this.options = options;
        this.contents = [];
        this.transitionAction = '';
        this.path = null;
    }
    getContent() {
        return this.contents[0];
    }
    getNextContent() {
        return this.contents.length > 1 ? this.contents[this.contents.length - 1] : null;
    }
    getTimeContent(_timestamp = Infinity) {
        return this.getContent();
    }
    getNavigationContent(navigation) {
        if (navigation instanceof NavigationCoordinator) {
            navigation = navigation.navigation;
        }
        if (navigation instanceof Navigation) {
            return this.contents.find(content => content.navigation === navigation) ?? null;
        }
        return null;
    }
    get activeContent() {
        return this.getNextContent() ?? this.getContent();
    }
    get connectedScope() {
        return this.activeContent?.connectedScope;
    }
    get scope() {
        return this.connectedScope.scope;
    }
    get owningScope() {
        return this.connectedScope.owningScope;
    }
    get connectedController() {
        return this.connectedCE?.$controller ?? null;
    }
    get isViewport() {
        return this instanceof Viewport;
    }
    get isViewportScope() {
        return this instanceof ViewportScope;
    }
    get isEmpty() {
        return false;
    }
    get pathname() {
        return this.connectedScope.pathname;
    }
    toString() {
        throw new Error(`Method 'toString' needs to be implemented in all endpoints!`);
    }
    setNextContent(_instruction, _navigation) {
        throw new Error(`Method 'setNextContent' needs to be implemented in all endpoints!`);
    }
    setConnectedCE(_connectedCE, _options) {
        throw new Error(`Method 'setConnectedCE' needs to be implemented in all endpoints!`);
    }
    transition(_coordinator) {
        throw new Error(`Method 'transition' needs to be implemented in all endpoints!`);
    }
    finalizeContentChange(_coordinator, _step) {
        throw new Error(`Method 'finalizeContentChange' needs to be implemented in all endpoints!`);
    }
    cancelContentChange(_coordinator, _noExitStep = null) {
        throw new Error(`Method 'cancelContentChange' needs to be implemented in all endpoints!`);
    }
    getRoutes() {
        throw new Error(`Method 'getRoutes' needs to be implemented in all endpoints!`);
    }
    getTitle(_navigation) {
        throw new Error(`Method 'getTitle' needs to be implemented in all endpoints!`);
    }
    removeEndpoint(_step, _connectedCE) {
        this.contents.forEach(content => content.delete());
        return true;
    }
    canUnload(_coordinator, _step) {
        return true;
    }
    canLoad(_coordinator, _step) {
        return true;
    }
    unload(_coordinator, _step) {
        return;
    }
    load(_coordinator, _step) {
        return;
    }
}

class EndpointContent {
    constructor(router, endpoint, owningScope, hasScope, instruction = RoutingInstruction.create(''), navigation = Navigation.create({
        instruction: '',
        fullStateInstruction: '',
    })) {
        this.router = router;
        this.endpoint = endpoint;
        this.instruction = instruction;
        this.navigation = navigation;
        this.completed = false;
        this.connectedScope = new RoutingScope(router, hasScope, owningScope, this);
        if (this.router.rootScope !== null) {
            (this.endpoint.connectedScope?.parent ?? this.router.rootScope.scope).addChild(this.connectedScope);
        }
    }
    get isActive() {
        return this.endpoint.activeContent === this;
    }
    delete() {
        this.connectedScope.parent?.removeChild(this.connectedScope);
    }
}

class FoundRoute {
    constructor(match = null, matching = '', instructions = [], remaining = '', params = {}) {
        this.match = match;
        this.matching = matching;
        this.instructions = instructions;
        this.remaining = remaining;
        this.params = params;
    }
    get foundConfiguration() {
        return this.match !== null;
    }
    get foundInstructions() {
        return this.instructions.some(instruction => !instruction.component.none);
    }
    get hasRemaining() {
        return this.instructions.some(instruction => instruction.hasNextScopeInstructions);
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

class InstructionParser {
    static parse(seps, instructions, grouped, topScope) {
        if (!instructions) {
            return { instructions: [], remaining: '' };
        }
        if (instructions.startsWith(seps.sibling) && !InstructionParser.isAdd(seps, instructions)) {
            throw new Error(`Instruction parser error: Unnecessary siblings separator ${seps.sibling} in beginning of instruction part "${instructions}".`);
        }
        const routingInstructions = [];
        let guard = 1000;
        while (instructions.length && guard) {
            guard--;
            if (instructions.startsWith(seps.scope)) {
                if (routingInstructions.length === 0) {
                    throw new Error(`Instruction parser error: Children without parent in instruction part "(${instructions}" is not allowed.`);
                }
                topScope = false;
                instructions = instructions.slice(seps.scope.length);
                const groupStart = instructions.startsWith(seps.groupStart);
                if (groupStart) {
                    instructions = instructions.slice(seps.groupStart.length);
                    grouped = true;
                }
                const { instructions: found, remaining } = InstructionParser.parse(seps, instructions, groupStart, false);
                routingInstructions[routingInstructions.length - 1].nextScopeInstructions = found;
                instructions = remaining;
            }
            else if (instructions.startsWith(seps.groupStart)) {
                instructions = instructions.slice(seps.groupStart.length);
                const { instructions: found, remaining } = InstructionParser.parse(seps, instructions, true, topScope);
                routingInstructions.push(...found);
                instructions = remaining;
            }
            else if (instructions.startsWith(seps.groupEnd)) {
                if (grouped) {
                    instructions = instructions.slice(seps.groupEnd.length);
                }
                let i = 0;
                const ii = instructions.length;
                for (; i < ii; i++) {
                    if (instructions.slice(i, i + seps.sibling.length) === seps.sibling) {
                        return { instructions: routingInstructions, remaining: instructions };
                    }
                    if (instructions.slice(i, i + seps.groupEnd.length) !== seps.groupEnd) {
                        if (routingInstructions.length > 1) {
                            throw new Error(`Instruction parser error: Children below scope ${seps.groupStart}${seps.groupEnd} in instruction part "(${instructions}" is not allowed.`);
                        }
                        else {
                            instructions = instructions.slice(i);
                            break;
                        }
                    }
                }
                if (i >= ii) {
                    return { instructions: routingInstructions, remaining: instructions };
                }
            }
            else if (instructions.startsWith(seps.sibling) && !InstructionParser.isAdd(seps, instructions)) {
                if (!grouped) {
                    return { instructions: routingInstructions, remaining: instructions };
                }
                instructions = instructions.slice(seps.sibling.length);
            }
            else {
                const { instruction: routingInstruction, remaining } = InstructionParser.parseOne(seps, instructions);
                routingInstructions.push(routingInstruction);
                instructions = remaining;
            }
        }
        return { instructions: routingInstructions, remaining: instructions };
    }
    static isAdd(seps, instruction) {
        return (instruction === seps.add || instruction.startsWith(`${seps.add}${seps.viewport}`));
    }
    static parseOne(seps, instruction) {
        const tokens = [seps.parameters, seps.viewport, seps.noScope, seps.groupEnd, seps.scope, seps.sibling];
        let component = void 0;
        let parametersString = void 0;
        let viewport = void 0;
        let scope = true;
        let token;
        let pos;
        const unparsed = instruction;
        const specials = [seps.add, seps.clear];
        for (const special of specials) {
            if (instruction === special) {
                component = instruction;
                instruction = '';
                tokens.shift();
                tokens.shift();
                token = seps.viewport;
                break;
            }
        }
        if (component === void 0) {
            for (const special of specials) {
                if (instruction.startsWith(`${special}${seps.viewport}`)) {
                    component = special;
                    instruction = instruction.slice(`${special}${seps.viewport}`.length);
                    tokens.shift();
                    tokens.shift();
                    token = seps.viewport;
                    break;
                }
            }
        }
        if (component === void 0) {
            ({ token, pos } = InstructionParser.findNextToken(instruction, tokens));
            component = pos !== -1 ? instruction.slice(0, pos) : instruction;
            instruction = pos !== -1 ? instruction.slice(pos + token.length) : '';
            tokens.shift();
            if (token === seps.parameters) {
                ({ token, pos } = InstructionParser.findNextToken(instruction, [seps.parametersEnd]));
                parametersString = instruction.slice(0, pos);
                instruction = instruction.slice(pos + token.length);
                ({ token } = InstructionParser.findNextToken(instruction, tokens));
                instruction = instruction.slice(token.length);
            }
            tokens.shift();
        }
        if (token === seps.viewport) {
            ({ token, pos } = InstructionParser.findNextToken(instruction, tokens));
            viewport = pos !== -1 ? instruction.slice(0, pos) : instruction;
            instruction = pos !== -1 ? instruction.slice(pos + token.length) : '';
        }
        tokens.shift();
        if (token === seps.noScope) {
            scope = false;
        }
        if (token === seps.groupEnd || token === seps.scope || token === seps.sibling) {
            instruction = `${token}${instruction}`;
        }
        if ((component ?? '') === '') {
            throw new Error(`Instruction parser error: No component specified in instruction part "${instruction}".`);
        }
        const routingInstruction = RoutingInstruction.create(component, viewport, parametersString, scope);
        routingInstruction.unparsed = unparsed;
        return { instruction: routingInstruction, remaining: instruction };
    }
    static findNextToken(instruction, tokens) {
        const matches = {};
        for (const token of tokens) {
            const tokenPos = instruction.indexOf(token);
            if (tokenPos > -1) {
                matches[token] = instruction.indexOf(token);
            }
        }
        const pos = Math.min(...Object.values(matches));
        for (const token in matches) {
            if (matches[token] === pos) {
                return { token, pos };
            }
        }
        return { token: '', pos: -1 };
    }
}

class TitleOptions {
    constructor(appTitle = '${componentTitles}\${appTitleSeparator}Aurelia', appTitleSeparator = ' | ', componentTitleOrder = 'top-down', componentTitleSeparator = ' > ', useComponentNames = true, componentPrefix = 'app-', transformTitle) {
        this.appTitle = appTitle;
        this.appTitleSeparator = appTitleSeparator;
        this.componentTitleOrder = componentTitleOrder;
        this.componentTitleSeparator = componentTitleSeparator;
        this.useComponentNames = useComponentNames;
        this.componentPrefix = componentPrefix;
        this.transformTitle = transformTitle;
    }
    static create(input = {}) {
        input = typeof input === 'string' ? { appTitle: input } : input;
        return new TitleOptions(input.appTitle, input.appTitleSeparator, input.componentTitleOrder, input.componentTitleSeparator, input.useComponentNames, input.componentPrefix, input.transformTitle);
    }
    static for(context) {
        return RouterOptions.for(context).title;
    }
    apply(input = {}) {
        input = typeof input === 'string' ? { appTitle: input } : input;
        this.appTitle = input.appTitle ?? this.appTitle;
        this.appTitleSeparator = input.appTitleSeparator ?? this.appTitleSeparator;
        this.componentTitleOrder = input.componentTitleOrder ?? this.componentTitleOrder;
        this.componentTitleSeparator = input.componentTitleSeparator ?? this.componentTitleSeparator;
        this.useComponentNames = input.useComponentNames ?? this.useComponentNames;
        this.componentPrefix = input.componentPrefix ?? this.componentPrefix;
        this.transformTitle = 'transformTitle' in input ? input.transformTitle : this.transformTitle;
    }
}
class Separators {
    constructor(viewport = '@', sibling = '+', scope = '/', groupStart = '(', groupEnd = ')', noScope = '!', parameters = '(', parametersEnd = ')', parameterSeparator = ',', parameterKeySeparator = '=', add = '+', clear = '-', action = '.') {
        this.viewport = viewport;
        this.sibling = sibling;
        this.scope = scope;
        this.groupStart = groupStart;
        this.groupEnd = groupEnd;
        this.noScope = noScope;
        this.parameters = parameters;
        this.parametersEnd = parametersEnd;
        this.parameterSeparator = parameterSeparator;
        this.parameterKeySeparator = parameterKeySeparator;
        this.add = add;
        this.clear = clear;
        this.action = action;
    }
    static create(input = {}) {
        return new Separators(input.viewport, input.sibling, input.scope, input.groupStart, input.groupEnd, input.noScope, input.parameters, input.parametersEnd, input.parameterSeparator, input.parameterKeySeparator, input.add, input.clear, input.action);
    }
    static for(context) {
        return RouterOptions.for(context).separators;
    }
    apply(input = {}) {
        this.viewport = input.viewport ?? this.viewport;
        this.sibling = input.sibling ?? this.sibling;
        this.scope = input.scope ?? this.scope;
        this.groupStart = input.groupStart ?? this.groupStart;
        this.groupEnd = input.groupEnd ?? this.groupEnd;
        this.noScope = input.noScope ?? this.noScope;
        this.parameters = input.parameters ?? this.parameters;
        this.parametersEnd = input.parametersEnd ?? this.parametersEnd;
        this.parameterSeparator = input.parameterSeparator ?? this.parameterSeparator;
        this.parameterKeySeparator = input.parameterKeySeparator ?? this.parameterKeySeparator;
        this.add = input.add ?? this.add;
        this.clear = input.clear ?? this.clear;
        this.action = input.action ?? this.action;
    }
}
class Indicators {
    constructor(loadActive = 'active', viewportNavigating = 'navigating') {
        this.loadActive = loadActive;
        this.viewportNavigating = viewportNavigating;
    }
    static create(input = {}) {
        return new Indicators(input.loadActive, input.viewportNavigating);
    }
    static for(context) {
        return RouterOptions.for(context).indicators;
    }
    apply(input = {}) {
        this.loadActive = input.loadActive ?? this.loadActive;
        this.viewportNavigating = input.viewportNavigating ?? this.viewportNavigating;
    }
}
class RouterOptions {
    constructor(separators = Separators.create(), indicators = Indicators.create(), useUrlFragmentHash = true, basePath = null, useHref = true, statefulHistoryLength = 0, useDirectRouting = true, useConfiguredRoutes = true, additiveInstructionDefault = true, title = TitleOptions.create(), navigationSyncStates = ['guardedUnload', 'swapped', 'completed'], swapOrder = 'attach-next-detach-current', fallback = '', fallbackAction = 'abort') {
        this.separators = separators;
        this.indicators = indicators;
        this.useUrlFragmentHash = useUrlFragmentHash;
        this.basePath = basePath;
        this.useHref = useHref;
        this.statefulHistoryLength = statefulHistoryLength;
        this.useDirectRouting = useDirectRouting;
        this.useConfiguredRoutes = useConfiguredRoutes;
        this.additiveInstructionDefault = additiveInstructionDefault;
        this.title = title;
        this.navigationSyncStates = navigationSyncStates;
        this.swapOrder = swapOrder;
        this.fallback = fallback;
        this.fallbackAction = fallbackAction;
        this.registrationHooks = [];
    }
    static create(input = {}) {
        return new RouterOptions(Separators.create(input.separators), Indicators.create(input.indicators), input.useUrlFragmentHash, input.basePath, input.useHref, input.statefulHistoryLength, input.useDirectRouting, input.useConfiguredRoutes, input.additiveInstructionDefault, TitleOptions.create(input.title), input.navigationSyncStates, input.swapOrder, input.fallback, input.fallbackAction);
    }
    static for(context) {
        if (context instanceof RouterConfiguration) {
            return context.options;
        }
        if (context instanceof Router) {
            context = context.configuration;
        }
        else {
            context = context.get(IRouterConfiguration);
        }
        return context.options;
    }
    apply(options) {
        options = options ?? {};
        this.separators.apply(options.separators);
        this.indicators.apply(options.indicators);
        this.useUrlFragmentHash = options.useUrlFragmentHash ?? this.useUrlFragmentHash;
        this.basePath = options.basePath ?? this.basePath;
        this.useHref = options.useHref ?? this.useHref;
        this.statefulHistoryLength = options.statefulHistoryLength ?? this.statefulHistoryLength;
        this.useDirectRouting = options.useDirectRouting ?? this.useDirectRouting;
        this.useConfiguredRoutes = options.useConfiguredRoutes ?? this.useConfiguredRoutes;
        this.additiveInstructionDefault = options.additiveInstructionDefault ?? this.additiveInstructionDefault;
        this.title.apply(options.title);
        this.navigationSyncStates = options.navigationSyncStates ?? this.navigationSyncStates;
        this.swapOrder = options.swapOrder ?? this.swapOrder;
        this.fallback = options.fallback ?? this.fallback;
        this.fallbackAction = options.fallbackAction ?? this.fallbackAction;
        if (Array.isArray(options.hooks)) {
            if (this.routerConfiguration !== void 0) {
                options.hooks.forEach(hook => this.routerConfiguration.addHook(hook.hook, hook.options));
            }
            else {
                this.registrationHooks = options.hooks;
            }
        }
    }
    setRouterConfiguration(routerConfiguration) {
        this.routerConfiguration = routerConfiguration;
        this.registrationHooks.forEach(hook => this.routerConfiguration.addHook(hook.hook, hook.options));
        this.registrationHooks.length = 0;
    }
}

var ParametersType;
(function (ParametersType) {
    ParametersType["none"] = "none";
    ParametersType["string"] = "string";
    ParametersType["array"] = "array";
    ParametersType["object"] = "object";
})(ParametersType || (ParametersType = {}));
class InstructionParameters {
    constructor() {
        this.parametersString = null;
        this.parametersRecord = null;
        this.parametersList = null;
        this.parametersType = "none";
    }
    get none() {
        return this.parametersType === "none";
    }
    static create(componentParameters) {
        const parameters = new InstructionParameters();
        parameters.set(componentParameters);
        return parameters;
    }
    static parse(context, parameters, uriComponent = false) {
        if (parameters == null || parameters.length === 0) {
            return [];
        }
        const seps = Separators.for(context);
        const parameterSeparator = seps.parameterSeparator;
        const parameterKeySeparator = seps.parameterKeySeparator;
        if (typeof parameters === 'string') {
            const list = [];
            const params = parameters.split(parameterSeparator);
            for (const param of params) {
                let key;
                let value;
                [key, value] = param.split(parameterKeySeparator);
                if (value === void 0) {
                    value = uriComponent ? decodeURIComponent(key) : key;
                    key = void 0;
                }
                else if (uriComponent) {
                    key = decodeURIComponent(key);
                    value = decodeURIComponent(value);
                }
                list.push({ key, value });
            }
            return list;
        }
        if (Array.isArray(parameters)) {
            return parameters.map(param => ({ key: void 0, value: param }));
        }
        const keys = Object.keys(parameters);
        keys.sort();
        return keys.map(key => ({ key, value: parameters[key] }));
    }
    get typedParameters() {
        switch (this.parametersType) {
            case "string":
                return this.parametersString;
            case "array":
                return this.parametersList;
            case "object":
                return this.parametersRecord;
            default:
                return null;
        }
    }
    static stringify(context, parameters, uriComponent = false) {
        if (!Array.isArray(parameters) || parameters.length === 0) {
            return '';
        }
        const seps = Separators.for(context);
        return parameters
            .map(param => {
            const key = param.key !== void 0 && uriComponent ? encodeURIComponent(param.key) : param.key;
            const value = uriComponent ? encodeURIComponent(param.value) : param.value;
            return key !== void 0 && key !== value ? key + seps.parameterKeySeparator + value : value;
        })
            .join(seps.parameterSeparator);
    }
    static contains(parametersToSearch, parametersToFind) {
        return Object.keys(parametersToFind).every(key => parametersToFind[key] === parametersToSearch[key]);
    }
    parameters(context) {
        return InstructionParameters.parse(context, this.typedParameters);
    }
    set(parameters) {
        this.parametersString = null;
        this.parametersList = null;
        this.parametersRecord = null;
        if (parameters == null || parameters === '') {
            this.parametersType = "none";
            parameters = null;
        }
        else if (typeof parameters === 'string') {
            this.parametersType = "string";
            this.parametersString = parameters;
        }
        else if (Array.isArray(parameters)) {
            this.parametersType = "array";
            this.parametersList = parameters;
        }
        else {
            this.parametersType = "object";
            this.parametersRecord = parameters;
        }
    }
    get(context, name) {
        if (name === void 0) {
            return this.parameters(context);
        }
        const params = this.parameters(context).filter(p => p.key === name).map(p => p.value);
        if (params.length === 0) {
            return;
        }
        return params.length === 1 ? params[0] : params;
    }
    addParameters(parameters) {
        if (this.parametersType === "none") {
            return this.set(parameters);
        }
        if (this.parametersType !== "object") {
            throw new Error('Can\'t add object parameters to existing non-object parameters!');
        }
        this.set({ ...this.parametersRecord, ...parameters });
    }
    toSpecifiedParameters(context, specifications) {
        specifications = specifications ?? [];
        const parameters = this.parameters(context);
        const specified = {};
        for (const spec of specifications) {
            let index = parameters.findIndex(param => param.key === spec);
            if (index >= 0) {
                const [parameter] = parameters.splice(index, 1);
                specified[spec] = parameter.value;
            }
            else {
                index = parameters.findIndex(param => param.key === void 0);
                if (index >= 0) {
                    const [parameter] = parameters.splice(index, 1);
                    specified[spec] = parameter.value;
                }
            }
        }
        for (const parameter of parameters.filter(param => param.key !== void 0)) {
            specified[parameter.key] = parameter.value;
        }
        let index = specifications.length;
        for (const parameter of parameters.filter(param => param.key === void 0)) {
            specified[index++] = parameter.value;
        }
        return specified;
    }
    toSortedParameters(context, specifications) {
        specifications = specifications || [];
        const parameters = this.parameters(context);
        const sorted = [];
        for (const spec of specifications) {
            let index = parameters.findIndex(param => param.key === spec);
            if (index >= 0) {
                const parameter = { ...parameters.splice(index, 1)[0] };
                parameter.key = void 0;
                sorted.push(parameter);
            }
            else {
                index = parameters.findIndex(param => param.key === void 0);
                if (index >= 0) {
                    const parameter = { ...parameters.splice(index, 1)[0] };
                    sorted.push(parameter);
                }
                else {
                    sorted.push({ value: void 0 });
                }
            }
        }
        const params = parameters.filter(param => param.key !== void 0);
        params.sort((a, b) => (a.key || '') < (b.key || '') ? 1 : (b.key || '') < (a.key || '') ? -1 : 0);
        sorted.push(...params);
        sorted.push(...parameters.filter(param => param.key === void 0));
        return sorted;
    }
    same(context, other, componentType) {
        const typeParameters = componentType !== null ? componentType.parameters : [];
        const mine = this.toSpecifiedParameters(context, typeParameters);
        const others = other.toSpecifiedParameters(context, typeParameters);
        return Object.keys(mine).every(key => mine[key] === others[key])
            && Object.keys(others).every(key => others[key] === mine[key]);
    }
}

class InstructionComponent {
    constructor() {
        this.name = null;
        this.type = null;
        this.instance = null;
        this.promise = null;
        this.func = null;
    }
    static create(componentAppelation) {
        const component = new InstructionComponent();
        component.set(componentAppelation);
        return component;
    }
    static isName(component) {
        return typeof component === 'string';
    }
    static isDefinition(component) {
        return runtimeHtml.CustomElement.isType(component.Type);
    }
    static isType(component) {
        return runtimeHtml.CustomElement.isType(component);
    }
    static isInstance(component) {
        return runtimeHtml.isCustomElementViewModel(component);
    }
    static isAppelation(component) {
        return InstructionComponent.isName(component)
            || InstructionComponent.isType(component)
            || InstructionComponent.isInstance(component);
    }
    static getName(component) {
        if (InstructionComponent.isName(component)) {
            return component;
        }
        else if (InstructionComponent.isType(component)) {
            return runtimeHtml.CustomElement.getDefinition(component).name;
        }
        else {
            return InstructionComponent.getName(component.constructor);
        }
    }
    static getType(component) {
        if (InstructionComponent.isName(component)) {
            return null;
        }
        else if (InstructionComponent.isType(component)) {
            return component;
        }
        else {
            return component.constructor;
        }
    }
    static getInstance(component) {
        if (InstructionComponent.isName(component) || InstructionComponent.isType(component)) {
            return null;
        }
        else {
            return component;
        }
    }
    set(component) {
        let name = null;
        let type = null;
        let instance = null;
        let promise = null;
        let func = null;
        if (component instanceof Promise) {
            promise = component;
        }
        else if (InstructionComponent.isName(component)) {
            name = InstructionComponent.getName(component);
        }
        else if (InstructionComponent.isType(component)) {
            name = this.getNewName(component);
            type = InstructionComponent.getType(component);
        }
        else if (InstructionComponent.isInstance(component)) {
            name = this.getNewName(InstructionComponent.getType(component));
            type = InstructionComponent.getType(component);
            instance = InstructionComponent.getInstance(component);
        }
        else if (typeof component === 'function') {
            func = component;
        }
        this.name = name;
        this.type = type;
        this.instance = instance;
        this.promise = promise;
        this.func = func;
    }
    resolve(instruction) {
        if (this.func !== null) {
            this.set(this.func(instruction));
        }
        if (!(this.promise instanceof Promise)) {
            return;
        }
        return this.promise.then((component) => {
            if (InstructionComponent.isAppelation(component)) {
                this.set(component);
                return;
            }
            if (component.default != null) {
                this.set(component.default);
                return;
            }
            const keys = Object.keys(component).filter(key => !key.startsWith('__'));
            if (keys.length === 0) {
                throw new Error(`Failed to load component Type from resolved Promise since no export was specified.`);
            }
            if (keys.length > 1) {
                throw new Error(`Failed to load component Type from resolved Promise since no 'default' export was specified when having multiple exports.`);
            }
            const key = keys[0];
            this.set(component[key]);
        });
    }
    get none() {
        return !this.isName() && !this.isType() && !this.isInstance() && !this.isFunction() && !this.isPromise();
    }
    isName() {
        return !!this.name && !this.isType() && !this.isInstance();
    }
    isType() {
        return this.type !== null && !this.isInstance();
    }
    isInstance() {
        return this.instance !== null;
    }
    isPromise() {
        return this.promise !== null;
    }
    isFunction() {
        return this.func !== null;
    }
    toType(container, instruction) {
        void this.resolve(instruction);
        if (this.type !== null) {
            return this.type;
        }
        if (this.name !== null
            && typeof this.name === 'string') {
            if (container === null) {
                throw new Error(`No container available when trying to resolve component '${this.name}'!`);
            }
            if (container.has(runtimeHtml.CustomElement.keyFrom(this.name), true)) {
                const resolver = container.getResolver(runtimeHtml.CustomElement.keyFrom(this.name));
                if (resolver !== null && resolver.getFactory !== void 0) {
                    const factory = resolver.getFactory(container);
                    if (factory) {
                        return factory.Type;
                    }
                }
            }
        }
        return null;
    }
    toInstance(parentContainer, parentController, parentElement, instruction) {
        void this.resolve(instruction);
        if (this.instance !== null) {
            return this.instance;
        }
        if (parentContainer == null) {
            return null;
        }
        const container = parentContainer.createChild();
        const instance = this.isType()
            ? container.get(this.type)
            : container.get(runtimeHtml.CustomElement.keyFrom(this.name));
        if (instance == null) {
            console.warn('Failed to create instance when trying to resolve component', this.name, this.type, '=>', instance);
            throw new Error(`Failed to create instance when trying to resolve component '${this.name}'!`);
        }
        const controller = runtimeHtml.Controller.$el(container, instance, parentElement, null);
        controller.parent = parentController;
        return instance;
    }
    same(other, compareType = false) {
        return compareType ? this.type === other.type : this.name === other.name;
    }
    getNewName(type) {
        if (this.name === null) {
            return InstructionComponent.getName(type);
        }
        return this.name;
    }
}

function arrayRemove(arr, func) {
    const removed = [];
    let arrIndex = arr.findIndex(func);
    while (arrIndex >= 0) {
        removed.push(arr.splice(arrIndex, 1)[0]);
        arrIndex = arr.findIndex(func);
    }
    return removed;
}
function arrayUnique(arr, includeNullish = false) {
    return arr.filter((item, i, arrAgain) => (includeNullish || item != null) && arrAgain.indexOf(item) === i);
}

class OpenPromise {
    constructor() {
        this.isPending = true;
        this.promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }
    resolve(value) {
        this._resolve(value);
        this.isPending = false;
    }
    reject(reason) {
        this._reject(reason);
        this.isPending = false;
    }
}

class Runner {
    constructor() {
        this.isDone = false;
        this.isCancelled = false;
        this.isResolved = false;
        this.isRejected = false;
        this.isAsync = false;
    }
    static run(predecessor, ...steps) {
        if ((steps?.length ?? 0) === 0) {
            return steps?.[0];
        }
        let newRoot = false;
        if (predecessor === null) {
            predecessor = new Step();
            newRoot = true;
        }
        const start = new Step(steps.shift());
        Runner.connect(predecessor, start, (predecessor?.runParallel ?? false) || newRoot);
        if (steps.length > 0) {
            Runner.add(start, false, ...steps);
        }
        if (newRoot) {
            Runner.process(predecessor);
            if (predecessor.result instanceof Promise) {
                this.runners.set(predecessor.result, predecessor);
            }
            return predecessor.result;
        }
        return start;
    }
    static runParallel(parent, ...steps) {
        if ((steps?.length ?? 0) === 0) {
            return [];
        }
        let newRoot = false;
        if (parent === null) {
            parent = new Step();
            newRoot = true;
        }
        else {
            parent = Runner.connect(parent, new Step(), true);
        }
        Runner.add(parent, true, ...steps);
        if (newRoot) {
            Runner.process(parent);
        }
        if (parent.result instanceof Promise) {
            this.runners.set(parent.result, parent);
        }
        return newRoot ? (parent.result ?? []) : parent;
    }
    static step(value) {
        if (value instanceof Promise) {
            return Runner.runners.get(value);
        }
    }
    static cancel(value) {
        const step = Runner.step(value);
        if (step !== void 0) {
            step.cancel();
        }
    }
    static add(predecessorOrParent, parallel, ...steps) {
        let step = new Step(steps.shift(), parallel);
        if (predecessorOrParent !== null) {
            step = Runner.connect(predecessorOrParent, step, parallel);
        }
        const start = step;
        while (steps.length > 0) {
            step = Runner.connect(step, new Step(steps.shift(), parallel), false);
        }
        return start;
    }
    static connect(predecessorOrParent, step, asChild) {
        if (!asChild) {
            const next = predecessorOrParent.next;
            predecessorOrParent.next = step;
            step.previous = predecessorOrParent;
            step.next = next;
            if (next !== null) {
                next.previous = step;
                next.parent = null;
            }
        }
        else {
            const child = predecessorOrParent.child;
            predecessorOrParent.child = step;
            step.parent = predecessorOrParent;
            step.next = child;
            if (child !== null) {
                child.parent = null;
                child.previous = step;
            }
        }
        return step;
    }
    static process(step) {
        const root = step.root;
        while (step !== null && !step.isDoing && !step.isDone) {
            root.current = step;
            if (step.isParallelParent) {
                step.isDone = true;
                let child = step.child;
                while (child !== null) {
                    Runner.process(child);
                    child = child.next;
                }
            }
            else {
                step.isDoing = true;
                step.value = step.step;
                while (step.value instanceof Function && !step.isCancelled && !step.isExited && !step.isDone) {
                    step.value = (step.value)(step);
                }
                if (!step.isCancelled) {
                    if (step.value instanceof Promise) {
                        const promise = step.value;
                        Runner.ensurePromise(root);
                        (($step, $promise) => {
                            $promise.then(result => {
                                $step.value = result;
                                Runner.settlePromise($step);
                                $step.isDone = true;
                                $step.isDoing = false;
                                const next = $step.nextToDo();
                                if (next !== null && !$step.isExited) {
                                    Runner.process(next);
                                }
                                else {
                                    if ($step.root.doneAll || $step.isExited) {
                                        Runner.settlePromise($step.root);
                                    }
                                }
                            }).catch(err => { throw err; });
                        })(step, promise);
                    }
                    else {
                        step.isDone = true;
                        step.isDoing = false;
                        if (!step.isExited) {
                            step = step.nextToDo();
                        }
                        else {
                            step = null;
                        }
                    }
                }
            }
        }
        if (root.isCancelled) {
            Runner.settlePromise(root, 'reject');
        }
        else if (root.doneAll || root.isExited) {
            Runner.settlePromise(root);
        }
    }
    static ensurePromise(step) {
        if (step.finally === null) {
            step.finally = new OpenPromise();
            step.promise = step.finally.promise;
            return true;
        }
        return false;
    }
    static settlePromise(step, outcome = 'resolve') {
        if (step.finally?.isPending ?? false) {
            step.promise = null;
            switch (outcome) {
                case 'resolve':
                    step.finally?.resolve(step.result);
                    break;
                case 'reject':
                    step.finally?.reject(step.result);
                    break;
            }
        }
    }
}
Runner.runners = new WeakMap();
Runner.roots = {};
class Step {
    constructor(step = void 0, runParallel = false) {
        this.step = step;
        this.runParallel = runParallel;
        this.promise = null;
        this.previous = null;
        this.next = null;
        this.parent = null;
        this.child = null;
        this.current = null;
        this.finally = null;
        this.isDoing = false;
        this.isDone = false;
        this.isCancelled = false;
        this.isExited = false;
        this.exited = null;
        this.id = '-1';
        this.id = `${Step.id++}`;
    }
    get isParallelParent() {
        return this.child?.runParallel ?? false;
    }
    get result() {
        if (this.promise !== null) {
            return this.promise;
        }
        if (this.child !== null) {
            if (this.isParallelParent) {
                const results = [];
                let child = this.child;
                while (child !== null) {
                    results.push(child.result);
                    child = child.next;
                }
                return results;
            }
            else {
                return this === this.root && this.exited !== null ? this.exited.result : this.child?.tail?.result;
            }
        }
        let value = this.value;
        while (value instanceof Step) {
            value = value.result;
        }
        return value;
    }
    get asValue() {
        return this.result;
    }
    get previousValue() {
        return this.runParallel
            ? this.head.parent?.parent?.previous?.result
            : this.previous?.result;
    }
    get name() {
        let name = `${this.id}`;
        if (this.runParallel) {
            name = `:${name}`;
        }
        if (this.value instanceof Promise || this.promise instanceof Promise) {
            name = `${name}*`;
        }
        if (this.finally !== null) {
            name = `${name}*`;
        }
        if (this.child !== null) {
            name = `${name}>`;
        }
        if (this.isDone) {
            name = `(${name})`;
        }
        return name;
    }
    get root() {
        let root = this.head;
        while (root.parent !== null) {
            root = root.parent.head;
        }
        return root;
    }
    get head() {
        let step = this;
        while (step.previous !== null) {
            step = step.previous;
        }
        return step;
    }
    get tail() {
        let step = this;
        while (step.next !== null) {
            step = step.next;
        }
        return step;
    }
    get done() {
        if (!this.isDone) {
            return false;
        }
        let step = this.child;
        while (step !== null) {
            if (!step.done) {
                return false;
            }
            step = step.next;
        }
        return true;
    }
    get doneAll() {
        if (!this.isDone
            || ((this.child !== null) && !this.child.doneAll)
            || ((this.next !== null) && !this.next.doneAll)) {
            return false;
        }
        return true;
    }
    cancel(all = true) {
        if (all) {
            return this.root.cancel(false);
        }
        if (this.isCancelled) {
            return false;
        }
        this.isCancelled = true;
        this.child?.cancel(false);
        this.next?.cancel(false);
        return true;
    }
    exit(all = true) {
        if (all) {
            this.root.exited = this;
            return this.root.exit(false);
        }
        if (this.isExited) {
            return false;
        }
        this.isExited = true;
        this.child?.exit(false);
        this.next?.exit(false);
        return true;
    }
    nextToDo() {
        if (this.child !== null && !this.child.isDoing && !this.child.isDone) {
            return this.child;
        }
        if (this.runParallel && !this.head.parent.done) {
            return null;
        }
        return this.nextOrUp();
    }
    nextOrUp() {
        let next = this.next;
        while (next !== null) {
            if (!next.isDoing && !next.isDone) {
                return next;
            }
            next = next.next;
        }
        const parent = this.head.parent ?? null;
        if (parent === null || !parent.done) {
            return null;
        }
        return parent.nextOrUp();
    }
    get path() {
        return `${this.head.parent?.path ?? ''}/${this.name}`;
    }
    get tree() {
        let result = '';
        let step = this.head;
        let parent = step.parent;
        let path = '';
        while (parent !== null) {
            path = `${parent.path}${path}`;
            parent = parent.head.parent;
        }
        do {
            result += `${path}/${step.name}\n`;
            if (step === this) {
                break;
            }
            step = step.next;
        } while (step !== null);
        return result;
    }
    get report() {
        let result = `${this.path}\n`;
        result += this.child?.report ?? '';
        result += this.next?.report ?? '';
        return result;
    }
}
Step.id = 0;

class Route {
    constructor(path, id, redirectTo, instructions, caseSensitive, title, reloadBehavior, data) {
        this.path = path;
        this.id = id;
        this.redirectTo = redirectTo;
        this.instructions = instructions;
        this.caseSensitive = caseSensitive;
        this.title = title;
        this.reloadBehavior = reloadBehavior;
        this.data = data;
    }
    static isConfigured(Type) {
        return metadata.Metadata.hasOwn(Route.resourceKey, Type)
            || 'parameters' in Type
            || 'title' in Type;
    }
    static configure(configOrPath, Type) {
        const config = Route.create(configOrPath, Type);
        metadata.Metadata.define(Route.resourceKey, config, Type);
        return Type;
    }
    static getConfiguration(Type) {
        const config = metadata.Metadata.getOwn(Route.resourceKey, Type) ?? {};
        if (Array.isArray(Type.parameters)) {
            config.parameters = Type.parameters;
        }
        if ('title' in Type) {
            config.title = Type.title;
        }
        return config instanceof Route ? config : Route.create(config, Type);
    }
    static create(configOrType, Type = null) {
        if (Type !== null) {
            configOrType = Route.transferTypeToComponent(configOrType, Type);
        }
        if (runtimeHtml.CustomElement.isType(configOrType)) {
            configOrType = Route.getConfiguration(configOrType);
        }
        else if (Type === null) {
            configOrType = { ...configOrType };
        }
        const config = Route.transferIndividualIntoInstructions(configOrType);
        Route.validateRouteConfiguration(config);
        let pathId = config.path;
        if (Array.isArray(pathId)) {
            pathId = pathId.join(',');
        }
        return new Route(config.path ?? '', config.id ?? pathId ?? null, config.redirectTo ?? null, config.instructions ?? null, config.caseSensitive ?? false, config.title ?? null, config.reloadBehavior ?? null, config.data ?? null);
    }
    static transferTypeToComponent(configOrType, Type) {
        if (runtimeHtml.CustomElement.isType(configOrType)) {
            throw new Error(`Invalid route configuration: A component ` +
                `can't be specified in a component route configuration.`);
        }
        const config = { ...configOrType } ?? {};
        if ('component' in config || 'instructions' in config) {
            throw new Error(`Invalid route configuration: The 'component' and 'instructions' properties ` +
                `can't be specified in a component route configuration.`);
        }
        if (!('redirectTo' in config)) {
            config.component = Type;
        }
        if (!('path' in config) && !('redirectTo' in config)) {
            config.path = runtimeHtml.CustomElement.getDefinition(Type).name;
        }
        return config;
    }
    static transferIndividualIntoInstructions(config) {
        if (config === null || config === void 0) {
            throw new Error(`Invalid route configuration: expected an object.`);
        }
        if ((config.component ?? null) !== null
            || (config.viewport ?? null) !== null
            || (config.parameters ?? null) !== null
            || (config.children ?? null) !== null) {
            if (config.instructions != null) {
                throw new Error(`Invalid route configuration: The 'instructions' property can't be used together with ` +
                    `the 'component', 'viewport', 'parameters' or 'children' properties.`);
            }
            config.instructions = [{
                    component: config.component,
                    viewport: config.viewport,
                    parameters: config.parameters,
                    children: config.children,
                }];
        }
        return config;
    }
    static validateRouteConfiguration(config) {
        if (config.redirectTo === null && config.instructions === null) {
            throw new Error(`Invalid route configuration: either 'redirectTo' or 'instructions' ` +
                `need to be specified.`);
        }
    }
}
Route.resourceKey = kernel.Protocol.resource.keyFor('route');

const Routes = {
    name: kernel.Protocol.resource.keyFor('routes'),
    isConfigured(Type) {
        return metadata.Metadata.hasOwn(Routes.name, Type) || 'routes' in Type;
    },
    configure(configurationsOrTypes, Type) {
        const configurations = configurationsOrTypes.map(configOrType => Route.create(configOrType));
        metadata.Metadata.define(Routes.name, configurations, Type);
        return Type;
    },
    getConfiguration(Type) {
        const type = Type;
        const routes = [];
        const metadata$1 = metadata.Metadata.getOwn(Routes.name, Type);
        if (Array.isArray(metadata$1)) {
            routes.push(...metadata$1);
        }
        if (Array.isArray(type.routes)) {
            routes.push(...type.routes);
        }
        return routes.map(route => route instanceof Route ? route : Route.create(route));
    },
};
function routes(configurationsOrTypes) {
    return function (target) {
        return Routes.configure(configurationsOrTypes, target);
    };
}

class ViewportScopeContent extends EndpointContent {
}

class ViewportScope extends Endpoint$1 {
    constructor(router, name, connectedCE, owningScope, scope, rootComponentType = null, options = {
        catches: [],
        source: null,
    }) {
        super(router, name, connectedCE);
        this.rootComponentType = rootComponentType;
        this.options = options;
        this.instruction = null;
        this.available = true;
        this.sourceItem = null;
        this.sourceItemIndex = -1;
        this.remove = false;
        this.add = false;
        this.contents.push(new ViewportScopeContent(router, this, owningScope, scope));
        if (this.catches.length > 0) {
            this.instruction = RoutingInstruction.create(this.catches[0], this.name);
        }
    }
    get isEmpty() {
        return this.instruction === null;
    }
    get passThroughScope() {
        return this.rootComponentType === null && this.catches.length === 0;
    }
    get siblings() {
        const parent = this.connectedScope.parent;
        if (parent === null) {
            return [this];
        }
        return parent.enabledChildren
            .filter(child => child.isViewportScope && child.endpoint.name === this.name)
            .map(child => child.endpoint);
    }
    get source() {
        return this.options.source ?? null;
    }
    get catches() {
        let catches = this.options.catches ?? [];
        if (typeof catches === 'string') {
            catches = catches.split(',');
        }
        return catches;
    }
    get default() {
        if (this.catches.length > 0) {
            return this.catches[0];
        }
    }
    toString() {
        const contentName = this.instruction?.component.name ?? '';
        const nextContentName = this.getNextContent()?.instruction.component.name ?? '';
        return `vs:${this.name}[${contentName}->${nextContentName}]`;
    }
    setNextContent(instruction, navigation) {
        instruction.endpoint.set(this);
        this.remove = instruction.isClear(this.router) || instruction.isClearAll(this.router);
        this.add = instruction.isAdd(this.router) && Array.isArray(this.source);
        if (this.add) {
            instruction.component.name = null;
        }
        if (this.default !== void 0 && instruction.component.name === null) {
            instruction.component.name = this.default;
        }
        this.contents.push(new ViewportScopeContent(this.router, this, this.owningScope, this.scope.hasScope, instruction, navigation));
        return 'swap';
    }
    transition(coordinator) {
        Runner.run(null, (step) => coordinator.setEndpointStep(this, step.root), () => coordinator.addEndpointState(this, 'guardedUnload'), () => coordinator.addEndpointState(this, 'guardedLoad'), () => coordinator.addEndpointState(this, 'guarded'), () => coordinator.addEndpointState(this, 'loaded'), () => coordinator.addEndpointState(this, 'unloaded'), () => coordinator.addEndpointState(this, 'routed'), () => coordinator.addEndpointState(this, 'swapped'), () => coordinator.addEndpointState(this, 'completed'));
    }
    finalizeContentChange(coordinator, _step) {
        const nextContentIndex = this.contents.findIndex(content => content.navigation === coordinator.navigation);
        let nextContent = this.contents[nextContentIndex];
        if (this.remove) {
            const emptyContent = new ViewportScopeContent(this.router, this, this.owningScope, this.scope.hasScope);
            this.contents.splice(nextContentIndex, 1, emptyContent);
            nextContent.delete();
            nextContent = emptyContent;
        }
        nextContent.completed = true;
        let removeable = 0;
        for (let i = 0, ii = nextContentIndex; i < ii; i++) {
            if (!(this.contents[0].navigation.completed ?? false)) {
                break;
            }
            removeable++;
        }
        this.contents.splice(0, removeable);
        if (this.remove && Array.isArray(this.source)) {
            this.removeSourceItem();
        }
    }
    cancelContentChange(coordinator, noExitStep = null) {
        [...new Set(this.scope.children.map(scope => scope.endpoint))].forEach(child => child.cancelContentChange(coordinator, noExitStep));
        const nextContentIndex = this.contents.findIndex(content => content.navigation === coordinator.navigation);
        if (nextContentIndex < 0) {
            return;
        }
        this.contents.splice(nextContentIndex, 1);
        if (this.add) {
            const index = this.source.indexOf(this.sourceItem);
            this.source.splice(index, 1);
            this.sourceItem = null;
        }
    }
    acceptSegment(segment) {
        if (segment === null && segment === void 0 || segment.length === 0) {
            return true;
        }
        if (segment === RoutingInstruction.clear(this.router)
            || segment === RoutingInstruction.add(this.router)
            || segment === this.name) {
            return true;
        }
        if (this.catches.length === 0) {
            return true;
        }
        if (this.catches.includes(segment)) {
            return true;
        }
        if (this.catches.filter((value) => value.includes('*')).length) {
            return true;
        }
        return false;
    }
    binding() {
        const source = this.source || [];
        if (source.length > 0 && this.sourceItem === null) {
            this.sourceItem = this.getAvailableSourceItem();
        }
    }
    unbinding() {
        if (this.sourceItem !== null && this.source !== null) {
            arrayRemove(this.source, (item) => item === this.sourceItem);
        }
        this.sourceItem = null;
    }
    getAvailableSourceItem() {
        if (this.source === null) {
            return null;
        }
        const siblings = this.siblings;
        for (const item of this.source) {
            if (siblings.every(sibling => sibling.sourceItem !== item)) {
                return item;
            }
        }
        return null;
    }
    addSourceItem() {
        const item = {};
        this.source.push(item);
        return item;
    }
    removeSourceItem() {
        this.sourceItemIndex = this.source.indexOf(this.sourceItem);
        if (this.sourceItemIndex >= 0) {
            this.source.splice(this.sourceItemIndex, 1);
        }
    }
    getRoutes() {
        const routes = [];
        if (this.rootComponentType !== null) {
            const Type = this.rootComponentType.constructor === this.rootComponentType.constructor.constructor
                ? this.rootComponentType
                : this.rootComponentType.constructor;
            routes.push(...(Routes.getConfiguration(Type) ?? []));
        }
        return routes;
    }
}

class StoredNavigation {
    constructor(entry = {
        instruction: '',
        fullStateInstruction: '',
    }) {
        this.instruction = entry.instruction;
        this.fullStateInstruction = entry.fullStateInstruction;
        this.scope = entry.scope;
        this.index = entry.index;
        this.firstEntry = entry.firstEntry;
        this.path = entry.path;
        this.title = entry.title;
        this.query = entry.query;
        this.fragment = entry.fragment;
        this.parameters = entry.parameters;
        this.data = entry.data;
    }
    toStoredNavigation() {
        return {
            instruction: this.instruction,
            fullStateInstruction: this.fullStateInstruction,
            scope: this.scope,
            index: this.index,
            firstEntry: this.firstEntry,
            path: this.path,
            title: this.title,
            query: this.query,
            fragment: this.fragment,
            parameters: this.parameters,
            data: this.data,
        };
    }
}
class NavigationFlags {
    constructor() {
        this.first = false;
        this.new = false;
        this.refresh = false;
        this.forward = false;
        this.back = false;
        this.replace = false;
    }
}
class Navigation extends StoredNavigation {
    constructor(entry = {
        instruction: '',
        fullStateInstruction: '',
    }) {
        super(entry);
        this.navigation = new NavigationFlags();
        this.repeating = false;
        this.previous = null;
        this.fromBrowser = false;
        this.origin = null;
        this.replacing = false;
        this.refreshing = false;
        this.untracked = false;
        this.process = null;
        this.completed = true;
        this.fromBrowser = entry.fromBrowser ?? this.fromBrowser;
        this.origin = entry.origin ?? this.origin;
        this.replacing = entry.replacing ?? this.replacing;
        this.refreshing = entry.refreshing ?? this.refreshing;
        this.untracked = entry.untracked ?? this.untracked;
        this.historyMovement = entry.historyMovement ?? this.historyMovement;
        this.process = null;
        this.timestamp = Date.now();
    }
    get useFullStateInstruction() {
        return (this.navigation.back ?? false) ||
            (this.navigation.forward ?? false) ||
            (this.navigation.refresh ?? false);
    }
    static create(entry = {
        instruction: '',
        fullStateInstruction: '',
    }) {
        return new Navigation(entry);
    }
}

class AwaitableMap {
    constructor() {
        this.map = new Map();
    }
    set(key, value) {
        const openPromise = this.map.get(key);
        if (openPromise instanceof OpenPromise) {
            openPromise.resolve(value);
        }
        this.map.set(key, value);
    }
    delete(key) {
        const current = this.map.get(key);
        if (current instanceof OpenPromise) {
            current.reject();
        }
        this.map.delete(key);
    }
    await(key) {
        if (!this.map.has(key)) {
            const openPromise = new OpenPromise();
            this.map.set(key, openPromise);
            return openPromise.promise;
        }
        const current = this.map.get(key);
        if (current instanceof OpenPromise) {
            return current.promise;
        }
        return current;
    }
    has(key) {
        return this.map.has(key) && !(this.map.get(key) instanceof OpenPromise);
    }
    clone() {
        const clone = new AwaitableMap();
        clone.map = new Map(this.map);
        return clone;
    }
}

class ViewportContent extends EndpointContent {
    constructor(router, viewport, owningScope, hasScope, instruction = RoutingInstruction.create(''), navigation = Navigation.create({
        instruction: '',
        fullStateInstruction: '',
    }), connectedCE = null) {
        super(router, viewport, owningScope, hasScope, instruction, navigation);
        this.router = router;
        this.instruction = instruction;
        this.navigation = navigation;
        this.contentStates = new AwaitableMap();
        this.fromCache = false;
        this.fromHistory = false;
        this.reload = false;
        this.activatedResolve = null;
        if (!this.instruction.component.isType() && connectedCE?.container != null) {
            this.instruction.component.type = this.toComponentType(connectedCE.container);
        }
    }
    get componentInstance() {
        return this.instruction.component.instance;
    }
    get reloadBehavior() {
        if (this.instruction.route instanceof FoundRoute
            && this.instruction.route.match?.reloadBehavior !== null) {
            return this.instruction.route.match?.reloadBehavior;
        }
        return (this.instruction.component.instance !== null &&
            'reloadBehavior' in this.instruction.component.instance &&
            this.instruction.component.instance.reloadBehavior !== void 0)
            ? this.instruction.component.instance.reloadBehavior
            : "default";
    }
    get controller() {
        return this.instruction.component.instance?.$controller;
    }
    equalComponent(other) {
        return this.instruction.sameComponent(this.router, other.instruction);
    }
    equalParameters(other) {
        return this.instruction.sameComponent(this.router, other.instruction, true) &&
            (this.navigation.query ?? '') === (other.navigation.query ?? '');
    }
    isCacheEqual(other) {
        return this.instruction.sameComponent(this.router, other.instruction, true);
    }
    contentController(connectedCE) {
        return runtimeHtml.Controller.$el(connectedCE.container.createChild(), this.instruction.component.instance, connectedCE.element, null);
    }
    createComponent(connectedCE, fallback, fallbackAction) {
        if (this.contentStates.has('created')) {
            return;
        }
        if (!this.fromCache && !this.fromHistory) {
            try {
                this.instruction.component.set(this.toComponentInstance(connectedCE.container, connectedCE.controller, connectedCE.element));
            }
            catch (e) {
                if (!e.message.startsWith('AUR0009:')) {
                    throw e;
                }
                {
                    console.warn(`'${this.instruction.component.name}' did not match any configured route or registered component name - did you forget to add the component '${this.instruction.component.name}' to the dependencies or to register it as a global dependency?`);
                }
                if ((fallback ?? '') !== '') {
                    if (fallbackAction === 'process-children') {
                        this.instruction.parameters.set([this.instruction.component.name]);
                    }
                    else {
                        this.instruction.parameters.set([this.instruction.unparsed ?? this.instruction.component.name]);
                        this.instruction.nextScopeInstructions = null;
                    }
                    this.instruction.component.set(fallback);
                    try {
                        this.instruction.component.set(this.toComponentInstance(connectedCE.container, connectedCE.controller, connectedCE.element));
                    }
                    catch (ee) {
                        if (!ee.message.startsWith('AUR0009:')) {
                            throw ee;
                        }
                        throw new Error(`'${this.instruction.component.name}' did not match any configured route or registered component name - did you forget to add the component '${this.instruction.component.name}' to the dependencies or to register it as a global dependency?`);
                    }
                }
                else {
                    throw new Error(`'${this.instruction.component.name}' did not match any configured route or registered component name - did you forget to add the component '${this.instruction.component.name}' to the dependencies or to register it as a global dependency?`);
                }
            }
        }
        this.contentStates.set('created', void 0);
    }
    canLoad() {
        if (!this.contentStates.has('created') || (this.contentStates.has('checkedLoad') && !this.reload)) {
            return true;
        }
        const instance = this.instruction.component.instance;
        if (instance == null) {
            return true;
        }
        this.contentStates.set('checkedLoad', void 0);
        const parentParameters = this.endpoint
            .parentViewport?.getTimeContent(this.navigation.timestamp)?.instruction?.typeParameters(this.router);
        const parameters = this.instruction.typeParameters(this.router);
        const merged = { ...this.navigation.parameters, ...parentParameters, ...parameters };
        const hooks = this.getLifecycleHooks(instance, 'canLoad').map(hook => ((innerStep) => {
            const result = hook(instance, merged, this.instruction, this.navigation);
            if (typeof result === 'boolean') {
                if (result === false) {
                    innerStep.exit();
                }
                return result;
            }
            if (typeof result === 'string') {
                innerStep.exit();
                return result;
            }
            return result;
        }));
        if (hooks.length !== 0) {
            const hooksResult = Runner.run(null, ...hooks);
            if (hooksResult !== true) {
                if (hooksResult === false) {
                    return false;
                }
                if (typeof hooksResult === 'string') {
                    return hooksResult;
                }
                return hooksResult;
            }
        }
        if (instance.canLoad == null) {
            return true;
        }
        const result = instance.canLoad(merged, this.instruction, this.navigation);
        if (typeof result === 'boolean' || typeof result === 'string') {
            return result;
        }
        return result;
    }
    canUnload(navigation) {
        if (this.contentStates.has('checkedUnload') && !this.reload) {
            return true;
        }
        this.contentStates.set('checkedUnload', void 0);
        if (!this.contentStates.has('loaded')) {
            return true;
        }
        const instance = this.instruction.component.instance;
        if (navigation === null) {
            navigation = Navigation.create({
                instruction: '',
                fullStateInstruction: '',
                previous: this.navigation,
            });
        }
        const hooks = this.getLifecycleHooks(instance, 'canUnload').map(hook => ((innerStep) => {
            const result = hook(instance, this.instruction, navigation);
            if (typeof result === 'boolean') {
                if (result === false) {
                    innerStep.exit();
                }
                return result;
            }
            return result;
        }));
        if (hooks.length !== 0) {
            const hooksResult = Runner.run(null, ...hooks);
            if (hooksResult !== true) {
                if (hooksResult === false) {
                    return false;
                }
                return hooksResult;
            }
        }
        if (!instance.canUnload) {
            return true;
        }
        const result = instance.canUnload(this.instruction, navigation);
        if (typeof result !== 'boolean' && !(result instanceof Promise)) {
            throw new Error(`Method 'canUnload' in component "${this.instruction.component.name}" needs to return true or false or a Promise resolving to true or false.`);
        }
        return result;
    }
    load(step) {
        return Runner.run(step, () => this.contentStates.await('checkedLoad'), () => {
            if (!this.contentStates.has('created') || (this.contentStates.has('loaded') && !this.reload)) {
                return;
            }
            this.reload = false;
            this.contentStates.set('loaded', void 0);
            const instance = this.instruction.component.instance;
            const parentParameters = this.endpoint
                .parentViewport?.getTimeContent(this.navigation.timestamp)?.instruction?.typeParameters(this.router);
            const parameters = this.instruction.typeParameters(this.router);
            const merged = { ...this.navigation.parameters, ...parentParameters, ...parameters };
            const hooks = this.getLifecycleHooks(instance, 'loading').map(hook => () => hook(instance, merged, this.instruction, this.navigation));
            hooks.push(...this.getLifecycleHooks(instance, 'load').map(hook => () => {
                console.warn(`[Deprecated] Found deprecated hook name "load" in ${this.instruction.component.name}. Please use the new name "loading" instead.`);
                return hook(instance, merged, this.instruction, this.navigation);
            }));
            if (hooks.length !== 0) {
                if (typeof instance.loading === 'function') {
                    hooks.push(() => instance.loading(merged, this.instruction, this.navigation));
                }
                if (typeof instance.load === 'function') {
                    console.warn(`[Deprecated] Found deprecated hook name "load" in ${this.instruction.component.name}. Please use the new name "loading" instead.`);
                    hooks.push(() => instance.load(merged, this.instruction, this.navigation));
                }
                return Runner.run(null, ...hooks);
            }
            if (typeof instance.loading === 'function') {
                return instance.loading(merged, this.instruction, this.navigation);
            }
            if (typeof instance.load === 'function') {
                console.warn(`[Deprecated] Found deprecated hook name "load" in ${this.instruction.component.name}. Please use the new name "loading" instead.`);
                return instance.load(merged, this.instruction, this.navigation);
            }
        });
    }
    unload(navigation) {
        if (!this.contentStates.has('loaded')) {
            return;
        }
        this.contentStates.delete('loaded');
        const instance = this.instruction.component.instance;
        if (navigation === null) {
            navigation = Navigation.create({
                instruction: '',
                fullStateInstruction: '',
                previous: this.navigation,
            });
        }
        const hooks = this.getLifecycleHooks(instance, 'unloading').map(hook => () => hook(instance, this.instruction, navigation));
        hooks.push(...this.getLifecycleHooks(instance, 'unload').map(hook => () => {
            console.warn(`[Deprecated] Found deprecated hook name "unload" in ${this.instruction.component.name}. Please use the new name "unloading" instead.`);
            return hook(instance, this.instruction, navigation);
        }));
        if (hooks.length !== 0) {
            if (typeof instance.unloading === 'function') {
                hooks.push(() => instance.unloading(this.instruction, navigation));
            }
            if (typeof instance.unload === 'function') {
                console.warn(`[Deprecated] Found deprecated hook name "unload" in ${this.instruction.component.name}. Please use the new name "unloading" instead.`);
                hooks.push(() => instance.unload(this.instruction, navigation));
            }
            return Runner.run(null, ...hooks);
        }
        if (typeof instance.unloading === 'function') {
            return instance.unloading(this.instruction, navigation);
        }
        if (typeof instance.unload === 'function') {
            console.warn(`[Deprecated] Found deprecated hook name "unload" in ${this.instruction.component.name}. Please use the new name "unloading" instead.`);
            return instance.unload(this.instruction, navigation);
        }
    }
    activateComponent(step, initiator, parent, connectedCE, boundCallback, attachPromise) {
        return Runner.run(step, () => this.contentStates.await('loaded'), () => this.waitForParent(parent), () => {
            if (this.contentStates.has('activating') || this.contentStates.has('activated')) {
                return;
            }
            this.contentStates.set('activating', void 0);
            return this.controller?.activate(initiator ?? this.controller, parent, void 0);
        }, () => {
            this.contentStates.set('activated', void 0);
        });
    }
    deactivateComponent(step, initiator, parent, connectedCE, stateful = false) {
        if (!this.contentStates.has('activated') && !this.contentStates.has('activating')) {
            return;
        }
        return Runner.run(step, () => {
            if (stateful && connectedCE.element !== null) {
                const elements = Array.from(connectedCE.element.getElementsByTagName('*'));
                for (const el of elements) {
                    if (el.scrollTop > 0 || el.scrollLeft) {
                        el.setAttribute('au-element-scroll', `${el.scrollTop},${el.scrollLeft}`);
                    }
                }
            }
            this.contentStates.delete('activated');
            this.contentStates.delete('activating');
            return this.controller?.deactivate(initiator ?? this.controller, parent);
        });
    }
    disposeComponent(connectedCE, cache, stateful = false) {
        if (!this.contentStates.has('created') || this.instruction.component.instance == null) {
            return;
        }
        if (!stateful) {
            this.contentStates.delete('created');
            return this.controller?.dispose();
        }
        else {
            cache.push(this);
        }
    }
    freeContent(step, connectedCE, navigation, cache, stateful = false) {
        return Runner.run(step, () => this.unload(navigation), (innerStep) => this.deactivateComponent(innerStep, null, connectedCE.controller, connectedCE, stateful), () => this.disposeComponent(connectedCE, cache, stateful));
    }
    toComponentName() {
        return this.instruction.component.name;
    }
    toComponentType(container) {
        if (this.instruction.component.none) {
            return null;
        }
        return this.instruction.component.toType(container, this.instruction);
    }
    toComponentInstance(parentContainer, parentController, parentElement) {
        if (this.instruction.component.none) {
            return null;
        }
        return this.instruction.component.toInstance(parentContainer, parentController, parentElement, this.instruction);
    }
    waitForParent(parent) {
        if (parent === null) {
            return;
        }
        if (!parent.isActive) {
            return new Promise((resolve) => {
                this.endpoint.activeResolve = resolve;
            });
        }
    }
    getLifecycleHooks(instance, name) {
        const hooks = (instance.$controller.lifecycleHooks[name] ?? []);
        return hooks.map(hook => hook.instance[name].bind(hook.instance));
    }
}

class ViewportOptions {
    constructor(scope = true, usedBy = [], _default = '', fallback = '', fallbackAction = '', noLink = false, noTitle = false, stateful = false, forceDescription = false, noHistory = false) {
        this.scope = scope;
        this.usedBy = usedBy;
        this.fallback = fallback;
        this.fallbackAction = fallbackAction;
        this.noLink = noLink;
        this.noTitle = noTitle;
        this.stateful = stateful;
        this.forceDescription = forceDescription;
        this.noHistory = noHistory;
        this.default = undefined;
        this.default = _default;
    }
    static create(options) {
        const created = new ViewportOptions();
        if (options !== void 0) {
            created.apply(options);
        }
        return created;
    }
    apply(options) {
        this.scope = options.scope ?? this.scope;
        this.usedBy = (typeof options.usedBy === 'string'
            ? options.usedBy.split(',').filter(str => str.length > 0)
            : options.usedBy)
            ?? this.usedBy;
        this.default = options.default ?? this.default;
        this.fallback = options.fallback ?? this.fallback;
        this.fallbackAction = options.fallbackAction ?? this.fallbackAction;
        this.noLink = options.noLink ?? this.noLink;
        this.noTitle = options.noTitle ?? this.noTitle;
        this.stateful = options.stateful ?? this.stateful;
        this.forceDescription = options.forceDescription ?? this.forceDescription;
        this.noHistory = options.noHistory ?? this.noHistory;
    }
}

class Viewport extends Endpoint$1 {
    constructor(router, name, connectedCE, owningScope, hasScope, options) {
        super(router, name, connectedCE);
        this.contents = [];
        this.forceRemove = false;
        this.options = new ViewportOptions();
        this.activeResolve = null;
        this.connectionResolve = null;
        this.clear = false;
        this.coordinators = [];
        this.previousViewportState = null;
        this.cache = [];
        this.historyCache = [];
        this.contents.push(new ViewportContent(router, this, owningScope, hasScope));
        this.contents[0].completed = true;
        if (options !== void 0) {
            this.options.apply(options);
        }
    }
    getContent() {
        if (this.contents.length === 1) {
            return this.contents[0];
        }
        let content;
        for (let i = 0, ii = this.contents.length; i < ii; i++) {
            if (this.contents[i].completed ?? false) {
                content = this.contents[i];
            }
            else {
                break;
            }
        }
        return content;
    }
    getNextContent() {
        if (this.contents.length === 1) {
            return null;
        }
        const lastCompleted = this.contents.indexOf(this.getContent());
        return this.contents.length > lastCompleted ? this.contents[lastCompleted + 1] : null;
    }
    getTimeContent(timestamp) {
        let content = null;
        for (let i = 0, ii = this.contents.length; i < ii; i++) {
            if (this.contents[i].navigation.timestamp > timestamp) {
                break;
            }
            content = this.contents[i];
        }
        return content;
    }
    getNavigationContent(navigation) {
        return super.getNavigationContent(navigation);
    }
    get parentViewport() {
        let scope = this.connectedScope;
        while (scope?.parent != null) {
            scope = scope.parent;
            if (scope.endpoint.isViewport) {
                return scope.endpoint;
            }
        }
        return null;
    }
    get isEmpty() {
        return this.getContent().componentInstance === null;
    }
    get doForceRemove() {
        let scope = this.connectedScope;
        while (scope !== null) {
            if (scope.isViewport && scope.endpoint.forceRemove) {
                return true;
            }
            scope = scope.parent;
        }
        return false;
    }
    isActiveNavigation(coordinator) {
        return this.coordinators[this.coordinators.length - 1] === coordinator;
    }
    toString() {
        const contentName = this.getContent()?.instruction.component.name ?? '';
        const nextContentName = this.getNextContent()?.instruction.component.name ?? '';
        return `v:${this.name}[${contentName}->${nextContentName}]`;
    }
    setNextContent(instruction, navigation) {
        instruction.endpoint.set(this);
        this.clear = instruction.isClear(this.router);
        const content = this.getContent();
        const nextContent = new ViewportContent(this.router, this, this.owningScope, this.scope.hasScope, !this.clear ? instruction : void 0, navigation, this.connectedCE ?? null);
        this.contents.push(nextContent);
        nextContent.fromHistory = nextContent.componentInstance !== null && navigation.navigation
            ? !!navigation.navigation.back || !!navigation.navigation.forward
            : false;
        if (this.options.stateful) {
            const cached = this.cache.find((item) => nextContent.isCacheEqual(item));
            if (cached !== void 0) {
                this.contents.splice(this.contents.indexOf(nextContent), 1, cached);
                nextContent.fromCache = true;
            }
            else {
                this.cache.push(nextContent);
            }
        }
        if (nextContent.componentInstance !== null && content.componentInstance === nextContent.componentInstance) {
            nextContent.delete();
            this.contents.splice(this.contents.indexOf(nextContent), 1);
            return this.transitionAction = 'skip';
        }
        if (!content.equalComponent(nextContent) ||
            navigation.navigation.refresh ||
            content.reloadBehavior === "refresh") {
            return this.transitionAction = 'swap';
        }
        if (content.reloadBehavior === "disallow") {
            nextContent.delete();
            this.contents.splice(this.contents.indexOf(nextContent), 1);
            return this.transitionAction = 'skip';
        }
        if (content.reloadBehavior === "reload") {
            content.reload = true;
            nextContent.instruction.component.set(content.componentInstance);
            nextContent.contentStates = content.contentStates.clone();
            nextContent.reload = content.reload;
            return this.transitionAction = 'reload';
        }
        if (this.options.stateful &&
            content.equalParameters(nextContent)) {
            nextContent.delete();
            this.contents.splice(this.contents.indexOf(nextContent), 1);
            return this.transitionAction = 'skip';
        }
        if (!content.equalParameters(nextContent)) {
            {
                return this.transitionAction = 'swap';
            }
        }
        nextContent.delete();
        this.contents.splice(this.contents.indexOf(nextContent), 1);
        return this.transitionAction = 'skip';
    }
    setConnectedCE(connectedCE, options) {
        options = options ?? {};
        if (this.connectedCE !== connectedCE) {
            this.previousViewportState = { ...this };
            this.clearState();
            this.connectedCE = connectedCE;
            this.options.apply(options);
            if (this.connectionResolve != null) {
                this.connectionResolve();
            }
        }
        const parentDefaultRoute = (this.scope.parent?.endpoint.getRoutes() ?? [])
            .filter(route => (Array.isArray(route.path) ? route.path : [route.path]).includes(''))
            .length > 0;
        if (this.getContent().componentInstance === null && this.getNextContent()?.componentInstance == null && (this.options.default || parentDefaultRoute)) {
            const instructions = RoutingInstruction.parse(this.router, this.options.default ?? '');
            if (instructions.length === 0 && parentDefaultRoute) {
                const foundRoute = this.scope.parent?.findInstructions([RoutingInstruction.create('')], false, this.router.configuration.options.useConfiguredRoutes);
                if (foundRoute?.foundConfiguration) {
                    instructions.push(...foundRoute.instructions);
                }
            }
            for (const instruction of instructions) {
                instruction.endpoint.set(this);
                instruction.scope = this.owningScope;
                instruction.default = true;
            }
            this.router.load(instructions, { append: true }).catch(error => { throw error; });
        }
    }
    remove(step, connectedCE) {
        if (this.connectedCE === connectedCE) {
            return Runner.run(step, (innerStep) => {
                if (this.getContent().componentInstance !== null) {
                    return this.getContent().freeContent(innerStep, this.connectedCE, (this.getNextContent()?.navigation ?? null), this.historyCache, this.doForceRemove ? false : this.router.statefulHistory || this.options.stateful);
                }
            }, (innerStep) => {
                if (this.doForceRemove) {
                    const removes = [];
                    for (const content of this.historyCache) {
                        removes.push((innerInnerStep) => content.freeContent(innerInnerStep, null, null, this.historyCache, false));
                    }
                    removes.push(() => { this.historyCache = []; });
                    return Runner.run(innerStep, ...removes);
                }
                return true;
            });
        }
        return false;
    }
    async transition(coordinator) {
        const navigatingPrefix = this.router.configuration.options.indicators.viewportNavigating;
        this.coordinators.push(coordinator);
        while (this.coordinators[0] !== coordinator) {
            await this.coordinators[0].waitForSyncState('completed');
        }
        let actingParentViewport = this.parentViewport;
        if (actingParentViewport !== null
            && actingParentViewport.transitionAction !== 'reload'
            && actingParentViewport.transitionAction !== 'swap') {
            actingParentViewport = null;
        }
        const guardSteps = [
            (step) => {
                if (this.isActiveNavigation(coordinator)) {
                    return this.canUnload(coordinator, step);
                }
            },
            (step) => {
                if (this.isActiveNavigation(coordinator)) {
                    if (!step.previousValue) {
                        coordinator.cancel();
                    }
                    else {
                        if (this.router.isRestrictedNavigation) {
                            const routerOptions = this.router.configuration.options;
                            this.getNavigationContent(coordinator).createComponent(this.connectedCE, this.options.fallback || routerOptions.fallback, this.options.fallbackAction || routerOptions.fallbackAction);
                        }
                    }
                }
                coordinator.addEndpointState(this, 'guardedUnload');
            },
            () => coordinator.waitForSyncState('guardedUnload', this),
            () => actingParentViewport !== null ? coordinator.waitForEndpointState(actingParentViewport, 'guardedLoad') : void 0,
            (step) => {
                if (this.isActiveNavigation(coordinator)) {
                    return this.canLoad(coordinator, step);
                }
            },
            (step) => {
                if (this.isActiveNavigation(coordinator)) {
                    let canLoadResult = step.previousValue;
                    if (typeof canLoadResult === 'boolean') {
                        if (!canLoadResult) {
                            step.cancel();
                            coordinator.cancel();
                            this.getNavigationContent(coordinator).instruction.nextScopeInstructions = null;
                            return;
                        }
                    }
                    else {
                        this.getNavigationContent(coordinator).instruction.nextScopeInstructions = null;
                        if (typeof canLoadResult === 'string') {
                            const scope = this.scope;
                            const options = this.router.configuration.options;
                            let instructions = RoutingInstruction.parse(this.router, canLoadResult);
                            const foundRoute = scope.parent?.findInstructions(instructions, options.useDirectRouting, options.useConfiguredRoutes);
                            if (foundRoute?.foundConfiguration || foundRoute?.foundInstructions) {
                                instructions = foundRoute.instructions;
                            }
                            for (const instruction of instructions) {
                                instruction.endpoint.set(this);
                                instruction.scope = scope.owningScope;
                            }
                            canLoadResult = instructions;
                        }
                        return Runner.run(step, (innerStep) => this.cancelContentChange(coordinator, innerStep), (innerStep) => {
                            void this.router.load(canLoadResult, { append: true });
                            return innerStep.exit();
                        });
                    }
                }
                coordinator.addEndpointState(this, 'guardedLoad');
                coordinator.addEndpointState(this, 'guarded');
            },
        ];
        const routingSteps = [
            () => coordinator.waitForSyncState('guarded', this),
            (step) => {
                if (this.isActiveNavigation(coordinator)) {
                    return this.unload(coordinator, step);
                }
            },
            () => coordinator.addEndpointState(this, 'unloaded'),
            () => coordinator.waitForSyncState('unloaded', this),
            () => actingParentViewport !== null ? coordinator.waitForEndpointState(actingParentViewport, 'loaded') : void 0,
            (step) => {
                if (this.isActiveNavigation(coordinator)) {
                    return this.load(coordinator, step);
                }
            },
            () => coordinator.addEndpointState(this, 'loaded'),
            () => coordinator.addEndpointState(this, 'routed'),
        ];
        const lifecycleSteps = [
            () => coordinator.waitForSyncState('routed', this),
            () => coordinator.waitForEndpointState(this, 'routed'),
        ];
        const swapOrder = this.router.configuration.options.swapOrder;
        switch (swapOrder) {
            case 'detach-current-attach-next':
                lifecycleSteps.push((step) => { if (this.isActiveNavigation(coordinator)) {
                    return this.removeContent(step, coordinator);
                } }, (step) => { if (this.isActiveNavigation(coordinator)) {
                    return this.addContent(step, coordinator);
                } });
                break;
            case 'attach-next-detach-current':
                lifecycleSteps.push((step) => { if (this.isActiveNavigation(coordinator)) {
                    return this.addContent(step, coordinator);
                } }, (step) => { if (this.isActiveNavigation(coordinator)) {
                    return this.removeContent(step, coordinator);
                } });
                break;
            case 'detach-attach-simultaneously':
                lifecycleSteps.push((step) => Runner.runParallel(step, (innerStep) => { if (this.isActiveNavigation(coordinator)) {
                    return this.removeContent(innerStep, coordinator);
                } }, (innerStep) => { if (this.isActiveNavigation(coordinator)) {
                    return this.addContent(innerStep, coordinator);
                } }));
                break;
            case 'attach-detach-simultaneously':
                lifecycleSteps.push((step) => Runner.runParallel(step, (innerStep) => { if (this.isActiveNavigation(coordinator)) {
                    return this.addContent(innerStep, coordinator);
                } }, (innerStep) => { if (this.isActiveNavigation(coordinator)) {
                    return this.removeContent(innerStep, coordinator);
                } }));
                break;
        }
        lifecycleSteps.push(() => coordinator.addEndpointState(this, 'swapped'));
        this.connectedCE?.setActivity?.(navigatingPrefix, true);
        this.connectedCE?.setActivity?.(coordinator.navigation.navigation, true);
        const result = Runner.run(null, (step) => coordinator.setEndpointStep(this, step.root), ...guardSteps, ...routingSteps, ...lifecycleSteps, () => coordinator.addEndpointState(this, 'completed'), () => coordinator.waitForSyncState('bound'), () => {
            this.connectedCE?.setActivity?.(navigatingPrefix, false);
            this.connectedCE?.setActivity?.(coordinator.navigation.navigation, false);
        });
        if (result instanceof Promise) {
            result.catch(_err => { });
        }
    }
    canUnload(coordinator, step) {
        return Runner.run(step, (innerStep) => {
            return this.getContent().connectedScope.canUnload(coordinator, innerStep);
        }, (innerStep) => {
            if (!innerStep.previousValue) {
                return false;
            }
            return this.getContent().canUnload(coordinator.navigation);
        });
    }
    canLoad(coordinator, step) {
        if (this.clear) {
            return true;
        }
        return Runner.run(step, () => this.waitForConnected(), () => {
            const routerOptions = this.router.configuration.options;
            const navigationContent = this.getNavigationContent(coordinator);
            navigationContent.createComponent(this.connectedCE, this.options.fallback || routerOptions.fallback, this.options.fallbackAction || routerOptions.fallbackAction);
            return navigationContent.canLoad();
        });
    }
    load(coordinator, step) {
        if (this.clear) {
            return;
        }
        return this.getNavigationContent(coordinator).load(step);
    }
    addContent(step, coordinator) {
        return this.activate(step, null, this.connectedController, coordinator);
    }
    removeContent(step, coordinator) {
        if (this.isEmpty) {
            return;
        }
        const manualDispose = this.router.statefulHistory || (this.options.stateful ?? false);
        return Runner.run(step, () => coordinator.addEndpointState(this, 'bound'), () => coordinator.waitForSyncState('bound'), (innerStep) => this.deactivate(innerStep, null, this.connectedController), () => manualDispose ? this.dispose() : void 0);
    }
    activate(step, initiator, parent, coordinator) {
        if (this.activeContent.componentInstance !== null) {
            return Runner.run(step, () => this.activeContent.canLoad(), (innerStep) => this.activeContent.load(innerStep), (innerStep) => this.activeContent.activateComponent(innerStep, initiator, parent, this.connectedCE, () => coordinator?.addEndpointState(this, 'bound'), coordinator?.waitForSyncState('bound')));
        }
    }
    deactivate(step, initiator, parent) {
        const content = this.getContent();
        if (content?.componentInstance != null &&
            !content.reload &&
            content.componentInstance !== this.getNextContent()?.componentInstance) {
            return content.deactivateComponent(step, initiator, parent, this.connectedCE, this.router.statefulHistory || this.options.stateful);
        }
    }
    unload(coordinator, step) {
        return Runner.run(step, (unloadStep) => this.getContent().connectedScope.unload(coordinator, unloadStep), () => this.getContent().componentInstance != null ? this.getContent().unload(coordinator.navigation ?? null) : void 0);
    }
    dispose() {
        if (this.getContent().componentInstance !== null &&
            !this.getContent().reload &&
            this.getContent().componentInstance !== this.getNextContent()?.componentInstance) {
            this.getContent().disposeComponent(this.connectedCE, this.historyCache, this.router.statefulHistory || this.options.stateful);
        }
    }
    finalizeContentChange(coordinator, step) {
        const nextContentIndex = this.contents.findIndex(content => content.navigation === coordinator.navigation);
        let nextContent = this.contents[nextContentIndex];
        const previousContent = this.contents[nextContentIndex - 1];
        if (this.clear) {
            const emptyContent = new ViewportContent(this.router, this, this.owningScope, this.scope.hasScope, void 0, nextContent.navigation);
            this.contents.splice(nextContentIndex, 1, emptyContent);
            nextContent.delete();
            nextContent = emptyContent;
        }
        else {
            nextContent.reload = false;
        }
        previousContent.delete();
        nextContent.completed = true;
        this.transitionAction = '';
        nextContent.contentStates.delete('checkedUnload');
        nextContent.contentStates.delete('checkedLoad');
        this.previousViewportState = null;
        const navigatingPrefix = this.router.configuration.options.indicators.viewportNavigating;
        this.connectedCE?.setActivity?.(navigatingPrefix, false);
        this.connectedCE?.setActivity?.(coordinator.navigation.navigation, false);
        let removeable = 0;
        for (let i = 0, ii = nextContentIndex; i < ii; i++) {
            if (!(this.contents[0].navigation.completed ?? false)) {
                break;
            }
            removeable++;
        }
        this.contents.splice(0, removeable);
        arrayRemove(this.coordinators, (coord => coord === coordinator));
    }
    cancelContentChange(coordinator, noExitStep = null) {
        [...new Set(this.scope.children.map(scope => scope.endpoint))].forEach(child => child.cancelContentChange(coordinator, noExitStep));
        const nextContentIndex = this.contents.findIndex(content => content.navigation === coordinator.navigation);
        if (nextContentIndex < 0) {
            return;
        }
        const step = coordinator.getEndpointStep(this)?.current ?? null;
        const nextContent = this.contents[nextContentIndex];
        const previousContent = this.contents[nextContentIndex - 1];
        nextContent.instruction.cancelled = true;
        return Runner.run(step, (innerStep) => {
            return nextContent.freeContent(innerStep, this.connectedCE, nextContent.navigation, this.historyCache, this.router.statefulHistory || this.options.stateful);
        }, () => {
            if (this.previousViewportState) {
                Object.assign(this, this.previousViewportState);
            }
            nextContent?.delete();
            if (nextContent !== null) {
                this.contents.splice(this.contents.indexOf(nextContent), 1);
            }
            this.transitionAction = '';
            previousContent?.contentStates.delete('checkedUnload');
            previousContent?.contentStates.delete('checkedLoad');
            const navigatingPrefix = this.router.configuration.options.indicators.viewportNavigating;
            this.connectedCE?.setActivity?.(navigatingPrefix, false);
            this.connectedCE?.setActivity?.(coordinator.navigation.navigation, false);
            coordinator.removeEndpoint(this);
            arrayRemove(this.coordinators, (coord => coord === coordinator));
        }, () => {
            if (step !== noExitStep) {
                return step?.exit();
            }
        });
    }
    wantComponent(component) {
        return this.options.usedBy.includes(component);
    }
    acceptComponent(component) {
        if (component === '-' || component === null) {
            return true;
        }
        const usedBy = this.options.usedBy;
        if (usedBy.length === 0) {
            return true;
        }
        if (usedBy.includes(component)) {
            return true;
        }
        if (usedBy.filter((value) => value.includes('*')).length) {
            return true;
        }
        return false;
    }
    freeContent(step, component) {
        const content = this.historyCache.find(cached => cached.componentInstance === component);
        if (content !== void 0) {
            return Runner.run(step, (innerStep) => {
                this.forceRemove = true;
                return content.freeContent(innerStep, null, null, this.historyCache, false);
            }, () => {
                this.forceRemove = false;
                arrayRemove(this.historyCache, (cached => cached === content));
            });
        }
    }
    getRoutes() {
        const routes = [];
        let componentType = this.getComponentType();
        if (componentType != null) {
            componentType = componentType.constructor === componentType.constructor.constructor
                ? componentType
                : componentType.constructor;
            routes.push(...(Routes.getConfiguration(componentType) ?? []));
        }
        return routes;
    }
    getTitle(navigation) {
        if (this.options.noTitle) {
            return '';
        }
        const componentType = this.getComponentType();
        if (componentType === null) {
            return '';
        }
        let title = '';
        const typeTitle = componentType.title;
        if (typeTitle !== void 0) {
            if (typeof typeTitle === 'string') {
                title = typeTitle;
            }
            else {
                const component = this.getComponentInstance();
                title = typeTitle.call(component, component, navigation);
            }
        }
        else if (this.router.configuration.options.title.useComponentNames) {
            let name = this.getContentInstruction().component.name ?? '';
            const prefix = (this.router.configuration.options.title.componentPrefix ?? '');
            if (name.startsWith(prefix)) {
                name = name.slice(prefix.length);
            }
            name = name.replace('-', ' ');
            title = name.slice(0, 1).toLocaleUpperCase() + name.slice(1);
        }
        return title;
    }
    getComponentType() {
        let componentType = this.getContentInstruction().component.type ?? null;
        if (componentType === null) {
            const controller = runtimeHtml.CustomElement.for(this.connectedCE.element);
            componentType = controller.container
                .componentType;
        }
        return componentType ?? null;
    }
    getComponentInstance() {
        return this.getContentInstruction().component.instance ?? null;
    }
    getContentInstruction() {
        return this.getNextContent()?.instruction ?? this.getContent().instruction ?? null;
    }
    clearState() {
        this.options = ViewportOptions.create();
        const owningScope = this.owningScope;
        const hasScope = this.scope.hasScope;
        this.getContent().delete();
        this.contents.shift();
        if (this.contents.length < 1) {
            throw new Error('no content!');
        }
        this.contents.push(new ViewportContent(this.router, this, owningScope, hasScope));
        this.cache = [];
    }
    waitForConnected() {
        if (this.connectedCE === null) {
            return new Promise((resolve) => {
                this.connectionResolve = resolve;
            });
        }
    }
}

class InstructionEndpoint {
    constructor() {
        this.name = null;
        this.instance = null;
        this.scope = null;
    }
    get none() {
        return this.name === null && this.instance === null;
    }
    get endpointType() {
        if (this.instance instanceof Viewport) {
            return 'Viewport';
        }
        if (this.instance instanceof ViewportScope) {
            return 'ViewportScope';
        }
        return null;
    }
    static create(endpointHandle) {
        const endpoint = new InstructionEndpoint();
        endpoint.set(endpointHandle);
        return endpoint;
    }
    static isName(endpoint) {
        return typeof endpoint === 'string';
    }
    static isInstance(endpoint) {
        return endpoint instanceof Endpoint$1;
    }
    static getName(endpoint) {
        if (InstructionEndpoint.isName(endpoint)) {
            return endpoint;
        }
        else {
            return endpoint ? (endpoint).name : null;
        }
    }
    static getInstance(endpoint) {
        if (InstructionEndpoint.isName(endpoint)) {
            return null;
        }
        else {
            return endpoint;
        }
    }
    set(endpoint) {
        if (endpoint === undefined || endpoint === '') {
            endpoint = null;
        }
        if (typeof endpoint === 'string') {
            this.name = endpoint;
            this.instance = null;
        }
        else {
            this.instance = endpoint;
            if (endpoint !== null) {
                this.name = endpoint.name;
                this.scope = endpoint.owningScope;
            }
        }
    }
    toInstance(router) {
        if (this.instance !== null) {
            return this.instance;
        }
        return router.getEndpoint(this.endpointType, this.name);
    }
    same(other, compareScope) {
        if (this.instance !== null && other.instance !== null) {
            return this.instance === other.instance;
        }
        return (this.endpointType === null ||
            other.endpointType === null ||
            this.endpointType === other.endpointType) &&
            (!compareScope || this.scope === other.scope) &&
            (this.instance !== null ? this.instance.name : this.name) ===
                (other.instance !== null ? other.instance.name : other.name);
    }
}

class RoutingInstruction {
    constructor(component, endpoint, parameters) {
        this.ownsScope = true;
        this.nextScopeInstructions = null;
        this.scope = null;
        this.scopeModifier = '';
        this.needsEndpointDescribed = false;
        this.route = null;
        this.routeStart = false;
        this.default = false;
        this.topInstruction = false;
        this.unparsed = null;
        this.cancelled = false;
        this.component = InstructionComponent.create(component);
        this.endpoint = InstructionEndpoint.create(endpoint);
        this.parameters = InstructionParameters.create(parameters);
    }
    static create(component, endpoint, parameters, ownsScope = true, nextScopeInstructions = null) {
        const instruction = new RoutingInstruction(component, endpoint, parameters);
        instruction.ownsScope = ownsScope;
        instruction.nextScopeInstructions = nextScopeInstructions;
        return instruction;
    }
    static createClear(context, endpoint) {
        return RoutingInstruction.create(RoutingInstruction.clear(context), endpoint);
    }
    static from(context, loadInstructions) {
        if (!Array.isArray(loadInstructions)) {
            loadInstructions = [loadInstructions];
        }
        const instructions = [];
        for (const instruction of loadInstructions) {
            if (typeof instruction === 'string') {
                instructions.push(...RoutingInstruction.parse(context, instruction));
            }
            else if (instruction instanceof RoutingInstruction) {
                instructions.push(instruction);
            }
            else if (instruction instanceof Promise) {
                instructions.push(RoutingInstruction.create(instruction));
            }
            else if (InstructionComponent.isAppelation(instruction)) {
                instructions.push(RoutingInstruction.create(instruction));
            }
            else if (InstructionComponent.isDefinition(instruction)) {
                instructions.push(RoutingInstruction.create(instruction.Type));
            }
            else if ('component' in instruction || 'id' in instruction) {
                const viewportComponent = instruction;
                const newInstruction = RoutingInstruction.create(viewportComponent.component, viewportComponent.viewport, viewportComponent.parameters);
                newInstruction.route = instruction.id ?? null;
                if (viewportComponent.children !== void 0 && viewportComponent.children !== null) {
                    newInstruction.nextScopeInstructions = RoutingInstruction.from(context, viewportComponent.children);
                }
                instructions.push(newInstruction);
            }
            else if (typeof instruction === 'object' && instruction !== null) {
                const type = runtimeHtml.CustomElement.define(instruction);
                instructions.push(RoutingInstruction.create(type));
            }
            else {
                instructions.push(RoutingInstruction.create(instruction));
            }
        }
        return instructions;
    }
    static clear(context) {
        return Separators.for(context).clear;
    }
    static add(context) {
        return Separators.for(context).add;
    }
    static parse(context, instructions) {
        const seps = Separators.for(context);
        let scopeModifier = '';
        const match = /^[./]+/.exec(instructions);
        if (Array.isArray(match) && match.length > 0) {
            scopeModifier = match[0];
            instructions = instructions.slice(scopeModifier.length);
        }
        const parsedInstructions = InstructionParser.parse(seps, instructions, true, true).instructions;
        for (const instruction of parsedInstructions) {
            instruction.scopeModifier = scopeModifier;
        }
        return parsedInstructions;
    }
    static stringify(context, instructions, excludeEndpoint = false, endpointContext = false) {
        return typeof (instructions) === 'string'
            ? instructions
            : instructions
                .map(instruction => instruction.stringify(context, excludeEndpoint, endpointContext))
                .filter(instruction => instruction.length > 0)
                .join(Separators.for(context).sibling);
    }
    static resolve(instructions) {
        const resolvePromises = instructions
            .filter(instr => instr.isUnresolved)
            .map(instr => instr.resolve())
            .filter(result => result instanceof Promise);
        if (resolvePromises.length > 0) {
            return Promise.all(resolvePromises);
        }
    }
    static containsSiblings(context, instructions) {
        if (instructions === null) {
            return false;
        }
        if (instructions
            .filter(instruction => !instruction.isClear(context) && !instruction.isClearAll(context))
            .length > 1) {
            return true;
        }
        return instructions.some(instruction => RoutingInstruction.containsSiblings(context, instruction.nextScopeInstructions));
    }
    static flat(instructions) {
        const flat = [];
        for (const instruction of instructions) {
            flat.push(instruction);
            if (instruction.hasNextScopeInstructions) {
                flat.push(...RoutingInstruction.flat(instruction.nextScopeInstructions));
            }
        }
        return flat;
    }
    static clone(instructions, keepInstances = false, scopeModifier = false) {
        return instructions.map(instruction => instruction.clone(keepInstances, scopeModifier));
    }
    static contains(context, instructionsToSearch, instructionsToFind, deep) {
        return instructionsToFind.every(find => find.isIn(context, instructionsToSearch, deep));
    }
    get viewport() {
        return this.endpoint.instance instanceof Viewport ||
            this.endpoint.endpointType === null
            ? this.endpoint
            : null;
    }
    get viewportScope() {
        return this.endpoint.instance instanceof ViewportScope ||
            this.endpoint.endpointType === null
            ? this.endpoint
            : null;
    }
    get previous() {
        return this.endpoint.instance?.getContent()?.instruction;
    }
    isAdd(context) {
        return this.component.name === Separators.for(context).add;
    }
    isClear(context) {
        return this.component.name === Separators.for(context).clear;
    }
    isAddAll(context) {
        return this.isAdd(context) && ((this.endpoint.name?.length ?? 0) === 0);
    }
    isClearAll(context) {
        return this.isClear(context) && ((this.endpoint.name?.length ?? 0) === 0);
    }
    get hasNextScopeInstructions() {
        return (this.nextScopeInstructions?.length ?? 0) > 0;
    }
    get isUnresolved() {
        return this.component.isFunction() || this.component.isPromise();
    }
    resolve() {
        return this.component.resolve(this);
    }
    typeParameters(context) {
        return this.parameters.toSpecifiedParameters(context, this.component.type?.parameters ?? []);
    }
    sameRoute(other) {
        const thisRoute = this.route?.match;
        const otherRoute = other.route?.match;
        if (thisRoute == null || otherRoute == null) {
            return false;
        }
        if (typeof thisRoute === 'string' || typeof otherRoute === 'string') {
            return thisRoute === otherRoute;
        }
        return thisRoute.id === otherRoute.id;
    }
    sameComponent(context, other, compareParameters = false, compareType = false) {
        if (compareParameters && !this.sameParameters(context, other, compareType)) {
            return false;
        }
        return this.component.same(other.component, compareType);
    }
    sameEndpoint(other, compareScope) {
        return this.endpoint.same(other.endpoint, compareScope);
    }
    sameParameters(context, other, compareType = false) {
        if (!this.component.same(other.component, compareType)) {
            return false;
        }
        return this.parameters.same(context, other.parameters, this.component.type);
    }
    stringify(context, excludeEndpoint = false, endpointContext = false, shallow = false) {
        const seps = Separators.for(context);
        let excludeCurrentEndpoint = excludeEndpoint;
        let excludeCurrentComponent = false;
        if (endpointContext) {
            const viewport = this.viewport?.instance ?? null;
            if (viewport?.options.noLink ?? false) {
                return '';
            }
            if (!this.needsEndpointDescribed &&
                (!(viewport?.options.forceDescription ?? false)
                    || (this.viewportScope?.instance != null))) {
                excludeCurrentEndpoint = true;
            }
            if (viewport?.options.fallback === this.component.name) {
                excludeCurrentComponent = true;
            }
            if (viewport?.options.default === this.component.name) {
                excludeCurrentComponent = true;
            }
        }
        const nextInstructions = this.nextScopeInstructions;
        let stringified = this.scopeModifier;
        if (this.route instanceof FoundRoute && !this.routeStart) {
            return !shallow && Array.isArray(nextInstructions)
                ? RoutingInstruction.stringify(context, nextInstructions, excludeEndpoint, endpointContext)
                : '';
        }
        const path = this.stringifyShallow(context, excludeCurrentEndpoint, excludeCurrentComponent);
        stringified += path.endsWith(seps.scope) ? path.slice(0, -seps.scope.length) : path;
        if (!shallow && Array.isArray(nextInstructions) && nextInstructions.length > 0) {
            const nextStringified = RoutingInstruction.stringify(context, nextInstructions, excludeEndpoint, endpointContext);
            if (nextStringified.length > 0) {
                stringified += seps.scope;
                stringified += nextInstructions.length === 1
                    ? nextStringified
                    : `${seps.groupStart}${nextStringified}${seps.groupEnd}`;
            }
        }
        return stringified;
    }
    clone(keepInstances = false, scopeModifier = false, shallow = false) {
        const clone = RoutingInstruction.create(this.component.func ?? this.component.promise ?? this.component.type ?? this.component.name, this.endpoint.name, this.parameters.typedParameters !== null ? this.parameters.typedParameters : void 0);
        if (keepInstances) {
            clone.component.set(this.component.instance ?? this.component.type ?? this.component.name);
            clone.endpoint.set(this.endpoint.instance ?? this.endpoint.name);
        }
        clone.component.name = this.component.name;
        clone.needsEndpointDescribed = this.needsEndpointDescribed;
        clone.route = this.route;
        clone.routeStart = this.routeStart;
        clone.default = this.default;
        if (scopeModifier) {
            clone.scopeModifier = this.scopeModifier;
        }
        clone.scope = keepInstances ? this.scope : null;
        if (this.hasNextScopeInstructions && !shallow) {
            clone.nextScopeInstructions = RoutingInstruction.clone(this.nextScopeInstructions, keepInstances, scopeModifier);
        }
        return clone;
    }
    isIn(context, searchIn, deep) {
        const matching = searchIn.filter(instruction => {
            if (this.route != null || instruction.route != null) {
                if (!instruction.sameRoute(this)) {
                    return false;
                }
            }
            else {
                if (!instruction.sameComponent(context, this)) {
                    return false;
                }
            }
            const instructionType = instruction.component.type ?? this.component.type;
            const thisType = this.component.type ?? instruction.component.type;
            const instructionParameters = instruction.parameters.toSpecifiedParameters(context, instructionType?.parameters);
            const thisParameters = this.parameters.toSpecifiedParameters(context, thisType?.parameters);
            if (!InstructionParameters.contains(instructionParameters, thisParameters)) {
                return false;
            }
            return (this.endpoint.none || instruction.sameEndpoint(this, false));
        });
        if (matching.length === 0) {
            return false;
        }
        if (!deep || !this.hasNextScopeInstructions) {
            return true;
        }
        if (matching.some(matched => RoutingInstruction.contains(context, matched.nextScopeInstructions ?? [], this.nextScopeInstructions, deep))) {
            return true;
        }
        return false;
    }
    getTitle(navigation) {
        if (this.route instanceof FoundRoute) {
            const routeTitle = this.route.match?.title;
            if (routeTitle != null) {
                if (this.routeStart) {
                    return typeof routeTitle === 'string' ? routeTitle : routeTitle(this, navigation);
                }
                else {
                    return '';
                }
            }
        }
        return this.endpoint.instance.getTitle(navigation);
    }
    toJSON() {
        return {
            component: this.component.name ?? undefined,
            viewport: this.endpoint.name ?? undefined,
            parameters: this.parameters.parametersRecord ?? undefined,
            children: this.hasNextScopeInstructions
                ? this.nextScopeInstructions
                : undefined,
        };
    }
    stringifyShallow(context, excludeEndpoint = false, excludeComponent = false) {
        if (this.route != null) {
            const path = this.route instanceof FoundRoute ? this.route.matching : this.route;
            return path
                .split('/')
                .map(part => part.startsWith(':')
                ? this.parameters.get(context, part.slice(1))
                : part)
                .join('/');
        }
        const seps = Separators.for(context);
        let instructionString = !excludeComponent ? this.component.name ?? '' : '';
        const specification = this.component.type ? this.component.type.parameters : null;
        const parameters = InstructionParameters.stringify(context, this.parameters.toSortedParameters(context, specification));
        if (parameters.length > 0) {
            instructionString += !excludeComponent
                ? `${seps.parameters}${parameters}${seps.parametersEnd}`
                : parameters;
        }
        if (this.endpoint.name != null && !excludeEndpoint) {
            instructionString += `${seps.viewport}${this.endpoint.name}`;
        }
        if (!this.ownsScope) {
            instructionString += seps.noScope;
        }
        return instructionString || '';
    }
}

class NavigatorNavigateEvent {
    constructor(eventName, navigation) {
        this.eventName = eventName;
        this.navigation = navigation;
    }
    static create(navigation) {
        return new NavigatorNavigateEvent(NavigatorNavigateEvent.eventName, navigation);
    }
}
NavigatorNavigateEvent.eventName = 'au:router:navigation-navigate';
exports.Navigator = class Navigator {
    constructor(ea, container) {
        this.ea = ea;
        this.container = container;
        this.lastNavigationIndex = -1;
        this.navigations = [];
        this.options = {
            statefulHistoryLength: 0,
        };
        this.isActive = false;
        this.uninitializedNavigation = Navigation.create({
            instruction: 'NAVIGATOR UNINITIALIZED',
            fullStateInstruction: '',
            index: 0,
            completed: true,
        });
        this.lastNavigationIndex = -1;
    }
    start(options) {
        if (this.isActive) {
            throw new Error('Navigator has already been started');
        }
        this.isActive = true;
        this.options = { ...options };
    }
    stop() {
        if (!this.isActive) {
            throw new Error('Navigator has not been started');
        }
        this.isActive = false;
    }
    navigate(navigation) {
        if (!(navigation instanceof Navigation)) {
            navigation = Navigation.create(navigation);
        }
        const navigationFlags = new NavigationFlags();
        if (this.lastNavigationIndex === -1) {
            this.loadState();
            if (this.lastNavigationIndex !== -1) {
                navigationFlags.refresh = true;
            }
            else {
                navigationFlags.first = true;
                navigationFlags.new = true;
                this.lastNavigationIndex = 0;
                this.navigations = [Navigation.create({
                        index: 0,
                        instruction: '',
                        fullStateInstruction: '',
                    })];
            }
        }
        if (navigation.index !== void 0 && !(navigation.replacing ?? false) && !(navigation.refreshing ?? false)) {
            navigation.historyMovement = navigation.index - Math.max(this.lastNavigationIndex, 0);
            navigation.instruction = this.navigations[navigation.index] != null ? this.navigations[navigation.index].fullStateInstruction : navigation.fullStateInstruction;
            navigation.replacing = true;
            if (navigation.historyMovement > 0) {
                navigationFlags.forward = true;
            }
            else if (navigation.historyMovement < 0) {
                navigationFlags.back = true;
            }
        }
        else if ((navigation.refreshing ?? false) || navigationFlags.refresh) {
            navigation = this.navigations[this.lastNavigationIndex];
            navigation.replacing = true;
            navigation.refreshing = true;
        }
        else if (navigation.replacing ?? false) {
            navigationFlags.replace = true;
            navigationFlags.new = true;
            navigation.index = this.lastNavigationIndex;
        }
        else {
            navigationFlags.new = true;
            navigation.index = this.lastNavigationIndex + 1;
            this.navigations[navigation.index] = navigation;
        }
        navigation.navigation = navigationFlags;
        navigation.previous = this.navigations[Math.max(this.lastNavigationIndex, 0)];
        navigation.process = new OpenPromise();
        this.lastNavigationIndex = navigation.index;
        this.notifySubscribers(navigation);
        return navigation.process.promise;
    }
    async finalize(navigation, isLast) {
        if (navigation.untracked ?? false) {
            if ((navigation.fromBrowser ?? false) && this.options.store != null) {
                await this.options.store.popNavigatorState();
            }
        }
        else if (navigation.replacing ?? false) {
            if ((navigation.historyMovement ?? 0) === 0) {
                this.navigations[navigation.previous.index] = navigation;
            }
            await this.saveState(navigation.index, false);
        }
        else {
            const index = navigation.index;
            if (isLast) {
                this.navigations = this.navigations.slice(0, index);
            }
            this.navigations[index] = navigation;
            if ((this.options.statefulHistoryLength ?? 0) > 0) {
                const indexPreserve = this.navigations.length - (this.options.statefulHistoryLength ?? 0);
                for (const navig of this.navigations.slice(index)) {
                    if (typeof navig.instruction !== 'string' || typeof navig.fullStateInstruction !== 'string') {
                        await this.serializeNavigation(navig, this.navigations.slice(indexPreserve, index));
                    }
                }
            }
            await this.saveState(navigation.index, !(navigation.fromBrowser ?? false));
        }
    }
    async cancel(navigation) {
        if (this.options.store != null) {
            if (navigation.navigation?.new) {
                if (navigation.fromBrowser ?? false) {
                    await this.options.store.popNavigatorState();
                }
            }
            else if ((navigation.historyMovement ?? 0) !== 0) {
                await this.options.store.go(-navigation.historyMovement, true);
            }
        }
    }
    async go(movement) {
        let newIndex = this.lastNavigationIndex + movement;
        newIndex = Math.min(newIndex, this.navigations.length - 1);
        await this.options.store.go(movement, true);
        const navigation = this.navigations[newIndex];
        return this.navigate(navigation);
    }
    getState() {
        const state = this.options.store != null ? { ...this.options.store.state } : {};
        const navigations = (state?.navigations ?? []);
        const navigationIndex = state?.navigationIndex ?? -1;
        return { navigations, navigationIndex };
    }
    loadState() {
        const { navigations, navigationIndex } = this.getState();
        this.navigations = navigations.map(navigation => Navigation.create(navigation));
        this.lastNavigationIndex = navigationIndex;
    }
    async saveState(index, push) {
        for (let i = 0; i < this.navigations.length; i++) {
            this.navigations[i] = Navigation.create(this.navigations[i].toStoredNavigation());
        }
        if ((this.options.statefulHistoryLength ?? 0) > 0) {
            const index = this.navigations.length - (this.options.statefulHistoryLength ?? 0);
            for (let i = 0; i < index; i++) {
                const navigation = this.navigations[i];
                if (typeof navigation.instruction !== 'string' || typeof navigation.fullStateInstruction !== 'string') {
                    await this.serializeNavigation(navigation, this.navigations.slice(index));
                }
            }
        }
        if (this.options.store == null) {
            return Promise.resolve();
        }
        const state = {
            navigations: (this.navigations ?? []).map((navigation) => this.toStoreableNavigation(navigation)),
            navigationIndex: index,
        };
        if (push) {
            return this.options?.store?.pushNavigatorState(state);
        }
        else {
            return this.options.store.replaceNavigatorState(state);
        }
    }
    async refresh() {
        if (this.lastNavigationIndex === -1) {
            return Promise.reject();
        }
        const navigation = this.navigations[this.lastNavigationIndex];
        navigation.replacing = true;
        navigation.refreshing = true;
        return this.navigate(navigation);
    }
    notifySubscribers(navigation) {
        this.ea.publish(NavigatorNavigateEvent.eventName, NavigatorNavigateEvent.create(navigation));
    }
    toStoreableNavigation(navigation) {
        const storeable = navigation instanceof Navigation ? navigation.toStoredNavigation() : navigation;
        storeable.instruction = RoutingInstruction.stringify(this.container, storeable.instruction);
        storeable.fullStateInstruction = RoutingInstruction.stringify(this.container, storeable.fullStateInstruction, false, true);
        if (typeof storeable.scope !== 'string') {
            storeable.scope = null;
        }
        return storeable;
    }
    async serializeNavigation(navigation, preservedNavigations) {
        let excludeComponents = [];
        for (const preservedNavigation of preservedNavigations) {
            if (typeof preservedNavigation.instruction !== 'string') {
                excludeComponents.push(...RoutingInstruction.flat(preservedNavigation.instruction)
                    .filter(instruction => instruction.endpoint.instance !== null)
                    .map(instruction => instruction.component.instance));
            }
            if (typeof preservedNavigation.fullStateInstruction !== 'string') {
                excludeComponents.push(...RoutingInstruction.flat(preservedNavigation.fullStateInstruction)
                    .filter(instruction => instruction.endpoint.instance !== null)
                    .map(instruction => instruction.component.instance));
            }
        }
        excludeComponents = arrayUnique(excludeComponents);
        let instructions = [];
        if (typeof navigation.fullStateInstruction !== 'string') {
            instructions.push(...navigation.fullStateInstruction);
            navigation.fullStateInstruction = RoutingInstruction.stringify(this.container, navigation.fullStateInstruction, false, true);
        }
        if (typeof navigation.instruction !== 'string') {
            instructions.push(...navigation.instruction);
            navigation.instruction = RoutingInstruction.stringify(this.container, navigation.instruction);
        }
        instructions = instructions.filter((instruction, i, arr) => instruction.component.instance != null
            && arr.indexOf(instruction) === i);
        const alreadyDone = [];
        for (const instruction of instructions) {
            await this.freeInstructionComponents(instruction, excludeComponents, alreadyDone);
        }
    }
    freeInstructionComponents(instruction, excludeComponents, alreadyDone) {
        const component = instruction.component.instance;
        const viewport = instruction.viewport?.instance ?? null;
        if (component === null || viewport === null || alreadyDone.some(done => done === component)) {
            return;
        }
        if (!excludeComponents.some(exclude => exclude === component)) {
            return Runner.run(null, (step) => viewport.freeContent(step, component), () => {
                alreadyDone.push(component);
            });
        }
        if (instruction.hasNextScopeInstructions) {
            for (const nextInstruction of instruction.nextScopeInstructions) {
                return this.freeInstructionComponents(nextInstruction, excludeComponents, alreadyDone);
            }
        }
    }
};
exports.Navigator = __decorate([
    __param(0, kernel.IEventAggregator),
    __param(1, kernel.IContainer)
], exports.Navigator);

const RouteRecognizer = routeRecognizer.RouteRecognizer;
const ConfigurableRoute = routeRecognizer.ConfigurableRoute;
const RecognizedRoute = routeRecognizer.RecognizedRoute;
const Endpoint = routeRecognizer.Endpoint;

class Collection extends Array {
    constructor() {
        super(...arguments);
        this.currentIndex = -1;
    }
    next() {
        if (this.length > this.currentIndex + 1) {
            return this[++this.currentIndex];
        }
        else {
            this.currentIndex = -1;
            return null;
        }
    }
    removeCurrent() {
        this.splice(this.currentIndex--, 1);
    }
    remove(instruction) {
        arrayRemove(this, value => value === instruction);
    }
}

class EndpointMatcher {
    static matchEndpoints(routingScope, instructions, alreadyMatched, disregardViewports = false) {
        const matchedInstructions = [];
        const ownedScopes = routingScope.getOwnedRoutingScopes(Infinity);
        const endpoints = ownedScopes.map(scope => scope.endpoint);
        const availableEndpoints = endpoints
            .filter(endpoint => endpoint !== null
            && !alreadyMatched.some(found => endpoint === found.endpoint.instance && !found.cancelled));
        const routingInstructions = new Collection(...instructions.slice());
        let instruction = null;
        EndpointMatcher.matchKnownEndpoints(routingScope.router, 'ViewportScope', routingInstructions, availableEndpoints, matchedInstructions, false);
        if (!disregardViewports) {
            EndpointMatcher.matchKnownEndpoints(routingScope.router, 'Viewport', routingInstructions, availableEndpoints, matchedInstructions, false);
        }
        EndpointMatcher.matchViewportScopeSegment(routingScope.router, routingScope, routingInstructions, availableEndpoints, matchedInstructions);
        while ((instruction = routingInstructions.next()) !== null) {
            instruction.needsEndpointDescribed = true;
        }
        EndpointMatcher.matchViewportConfiguration(routingInstructions, availableEndpoints, matchedInstructions);
        if (!disregardViewports) {
            EndpointMatcher.matchSpecifiedViewport(routingInstructions, availableEndpoints, matchedInstructions, false);
        }
        EndpointMatcher.matchLastViewport(routingInstructions, availableEndpoints, matchedInstructions);
        if (disregardViewports) {
            EndpointMatcher.matchSpecifiedViewport(routingInstructions, availableEndpoints, matchedInstructions, false);
        }
        return {
            matchedInstructions,
            remainingInstructions: [...routingInstructions],
        };
    }
    static matchKnownEndpoints(router, type, routingInstructions, availableEndpoints, matchedInstructions, doesntNeedViewportDescribed = false) {
        let instruction;
        while ((instruction = routingInstructions.next()) !== null) {
            if (instruction.endpoint.instance !== null && !instruction.isAdd(router) &&
                instruction.endpoint.endpointType === type) {
                EndpointMatcher.matchEndpoint(instruction, instruction.endpoint.instance, doesntNeedViewportDescribed);
                matchedInstructions.push(instruction);
                arrayRemove(availableEndpoints, available => available === instruction.endpoint.instance);
                routingInstructions.removeCurrent();
            }
        }
    }
    static matchViewportScopeSegment(router, routingScope, routingInstructions, availableEndpoints, matchedInstructions) {
        let instruction;
        while ((instruction = routingInstructions.next()) !== null) {
            for (let endpoint of availableEndpoints) {
                if (!(endpoint instanceof ViewportScope)) {
                    continue;
                }
                if (endpoint.acceptSegment(instruction.component.name)) {
                    if (Array.isArray(endpoint.source)) {
                        let available = availableEndpoints.find(available => available instanceof ViewportScope && available.name === endpoint.name);
                        if (available === void 0 || instruction.isAdd(router)) {
                            const item = endpoint.addSourceItem();
                            available = routingScope.getOwnedScopes()
                                .filter(scope => scope.isViewportScope)
                                .map(scope => scope.endpoint)
                                .find(viewportScope => viewportScope.sourceItem === item);
                        }
                        endpoint = available;
                    }
                    EndpointMatcher.matchEndpoint(instruction, endpoint, false);
                    matchedInstructions.push(instruction);
                    arrayRemove(availableEndpoints, available => available === instruction.endpoint.instance);
                    routingInstructions.removeCurrent();
                    break;
                }
            }
        }
    }
    static matchViewportConfiguration(routingInstructions, availableEndpoints, matchedInstructions) {
        let instruction;
        while ((instruction = routingInstructions.next()) !== null) {
            for (const endpoint of availableEndpoints) {
                if (!(endpoint instanceof Viewport)) {
                    continue;
                }
                if (endpoint?.wantComponent(instruction.component.name)) {
                    EndpointMatcher.matchEndpoint(instruction, endpoint, true);
                    matchedInstructions.push(instruction);
                    arrayRemove(availableEndpoints, available => available === instruction.endpoint.instance);
                    routingInstructions.removeCurrent();
                    break;
                }
            }
        }
    }
    static matchSpecifiedViewport(routingInstructions, availableEndpoints, matchedInstructions, disregardViewports) {
        let instruction;
        while ((instruction = routingInstructions.next()) !== null) {
            let viewport = instruction.endpoint.instance;
            if (viewport == null) {
                const name = instruction.endpoint.name;
                if ((name?.length ?? 0) === 0) {
                    continue;
                }
                for (const endpoint of availableEndpoints) {
                    if (!(endpoint instanceof Viewport)) {
                        continue;
                    }
                    if (name === endpoint.name) {
                        viewport = endpoint;
                        break;
                    }
                }
            }
            if (viewport?.acceptComponent(instruction.component.name)) {
                EndpointMatcher.matchEndpoint(instruction, viewport, disregardViewports);
                matchedInstructions.push(instruction);
                arrayRemove(availableEndpoints, available => available === instruction.endpoint.instance);
                routingInstructions.removeCurrent();
            }
        }
    }
    static matchLastViewport(routingInstructions, availableEndpoints, matchedInstructions) {
        let instruction;
        while ((instruction = routingInstructions.next()) !== null) {
            const availableViewports = [];
            for (const endpoint of availableEndpoints) {
                if (!(endpoint instanceof Viewport)) {
                    continue;
                }
                if (endpoint.acceptComponent(instruction.component.name)) {
                    availableViewports.push(endpoint);
                }
            }
            if (availableViewports.length === 1) {
                const viewport = availableViewports[0];
                EndpointMatcher.matchEndpoint(instruction, viewport, true);
                matchedInstructions.push(instruction);
                arrayRemove(availableEndpoints, available => available === instruction.endpoint.instance);
                routingInstructions.removeCurrent();
            }
        }
    }
    static matchEndpoint(instruction, endpoint, doesntNeedViewportDescribed) {
        instruction.endpoint.set(endpoint);
        if (doesntNeedViewportDescribed) {
            instruction.needsEndpointDescribed = false;
        }
        if (instruction.hasNextScopeInstructions) {
            instruction.nextScopeInstructions.forEach(next => {
                if (next.scope === null) {
                    next.scope = endpoint instanceof Viewport ? endpoint.scope : endpoint.scope.scope;
                }
            });
        }
    }
}

class RoutingScope {
    constructor(router, hasScope, owningScope, endpointContent) {
        this.router = router;
        this.hasScope = hasScope;
        this.owningScope = owningScope;
        this.endpointContent = endpointContent;
        this.id = -1;
        this.parent = null;
        this.children = [];
        this.id = ++RoutingScope.lastId;
        this.owningScope = owningScope ?? this;
    }
    static for(origin, instruction) {
        if (origin == null) {
            return { scope: null, instruction };
        }
        if (origin instanceof RoutingScope || origin instanceof Viewport || origin instanceof ViewportScope) {
            return { scope: origin.scope, instruction };
        }
        let container;
        if ('res' in origin) {
            container = origin;
        }
        else {
            if ('container' in origin) {
                container = origin.container;
            }
            else if ('$controller' in origin) {
                container = origin.$controller.container;
            }
            else {
                const controller = runtimeHtml.CustomElement.for(origin, { searchParents: true });
                container = controller?.container;
            }
        }
        if (container == null) {
            {
                console.warn("RoutingScope failed to find a container for provided origin", origin);
            }
            return { scope: null, instruction };
        }
        const closestEndpoint = (container.has(Router.closestEndpointKey, true)
            ? container.get(Router.closestEndpointKey)
            : null);
        let scope = closestEndpoint?.scope ?? null;
        if (scope === null || instruction === undefined) {
            const safeInstruction = instruction ?? '';
            return { scope, instruction: safeInstruction.startsWith('/') ? safeInstruction.slice(1) : instruction };
        }
        if (instruction.startsWith('/')) {
            return { scope: null, instruction: instruction.slice(1) };
        }
        while (instruction.startsWith('.')) {
            if (instruction.startsWith('./')) {
                instruction = instruction.slice(2);
            }
            else if (instruction.startsWith('../')) {
                scope = scope.parent ?? scope;
                instruction = instruction.slice(3);
            }
            else {
                break;
            }
        }
        return { scope, instruction };
    }
    get scope() {
        return this.hasScope ? this : this.owningScope.scope;
    }
    get endpoint() {
        return this.endpointContent.endpoint;
    }
    get isViewport() {
        return this.endpoint instanceof Viewport;
    }
    get isViewportScope() {
        return this.endpoint instanceof ViewportScope;
    }
    get type() {
        return this.isViewport ? 'Viewport' : 'ViewportScope';
    }
    get enabled() {
        return this.endpointContent.isActive;
    }
    get passThroughScope() {
        return this.isViewportScope && this.endpoint.passThroughScope;
    }
    get pathname() {
        return `${this.owningScope !== this ? this.owningScope.pathname : ''}/${this.endpoint.name}`;
    }
    get path() {
        const parentPath = this.parent?.path ?? '';
        const path = this.routingInstruction?.stringify(this.router, false, true, true) ?? '';
        const sep = this.routingInstruction ? Separators.for(this.router).scope : '';
        return `${parentPath}${path}${sep}`;
    }
    toString(recurse = false) {
        return `${this.owningScope !== this ? this.owningScope.toString() : ''}/${!this.enabled ? '(' : ''}${this.endpoint.toString()}#${this.id}${!this.enabled ? ')' : ''}` +
            `${recurse ? `\n` + this.children.map(child => child.toString(true)).join('') : ''}`;
    }
    toStringOwning(recurse = false) {
        return `${this.owningScope !== this ? this.owningScope.toString() : ''}/${!this.enabled ? '(' : ''}${this.endpoint.toString()}#${this.id}${!this.enabled ? ')' : ''}` +
            `${recurse ? `\n` + this.ownedScopes.map(child => child.toStringOwning(true)).join('') : ''}`;
    }
    get enabledChildren() {
        return this.children.filter(scope => scope.enabled);
    }
    get hoistedChildren() {
        const scopes = this.enabledChildren;
        while (scopes.some(scope => scope.passThroughScope)) {
            for (const scope of scopes.slice()) {
                if (scope.passThroughScope) {
                    const index = scopes.indexOf(scope);
                    scopes.splice(index, 1, ...scope.enabledChildren);
                }
            }
        }
        return scopes;
    }
    get ownedScopes() {
        return this.getOwnedScopes();
    }
    get routingInstruction() {
        if (this.endpoint.isViewportScope) {
            return this.endpoint.instruction;
        }
        if (this.isViewport) {
            return this.endpoint.activeContent.instruction;
        }
        return null;
    }
    getOwnedScopes(includeDisabled = false) {
        const scopes = this.allScopes(includeDisabled).filter(scope => scope.owningScope === this);
        for (const scope of scopes.slice()) {
            if (scope.passThroughScope) {
                const index = scopes.indexOf(scope);
                scopes.splice(index, 1, ...scope.getOwnedScopes());
            }
        }
        return scopes;
    }
    async processInstructions(instructions, earlierMatchedInstructions, navigation, coordinator, configuredRoutePath = '') {
        const router = this.router;
        const options = router.configuration.options;
        const nonRouteInstructions = instructions.filter(instruction => !(instruction.route instanceof Route));
        if (nonRouteInstructions.length > 0) {
            const foundRoute = this.findInstructions(nonRouteInstructions, options.useDirectRouting, options.useConfiguredRoutes);
            if (nonRouteInstructions.some(instr => !instr.component.none || instr.route != null)
                && !foundRoute.foundConfiguration
                && !foundRoute.foundInstructions) {
                this.unknownRoute(nonRouteInstructions);
            }
            instructions = [...instructions.filter(instruction => instruction.route instanceof Route), ...foundRoute.instructions];
            if (instructions.some(instr => instr.scope !== this)) {
                console.warn('Not the current scope for instruction(s)!', this, instructions);
            }
            if (foundRoute.foundConfiguration) {
                configuredRoutePath = (configuredRoutePath ?? '') + foundRoute.matching;
            }
        }
        const unresolvedPromise = RoutingInstruction.resolve(instructions);
        if (unresolvedPromise instanceof Promise) {
            await unresolvedPromise;
        }
        if (!options.additiveInstructionDefault) {
            instructions = this.ensureClearStateInstruction(instructions);
        }
        let clearEndpoints = [];
        ({ clearEndpoints, instructions } = this.getClearAllEndpoints(instructions));
        for (const addInstruction of instructions.filter(instr => instr.isAddAll(router))) {
            addInstruction.endpoint.set(addInstruction.scope.endpoint.name);
            addInstruction.scope = addInstruction.scope.owningScope;
        }
        let allChangedEndpoints = [];
        let { matchedInstructions, remainingInstructions } = this.matchEndpoints(instructions, earlierMatchedInstructions);
        let guard = 100;
        do {
            if (!guard--) {
                router.unresolvedInstructionsError(navigation, remainingInstructions);
            }
            const changedEndpoints = [];
            const matchedEndpoints = matchedInstructions.map(instr => instr.endpoint.instance);
            matchedInstructions.push(...clearEndpoints
                .filter(endpoint => !matchedEndpoints.includes(endpoint))
                .map(endpoint => RoutingInstruction.createClear(router, endpoint)));
            const hooked = await RoutingHook.invokeBeforeNavigation(matchedInstructions, navigation);
            if (hooked === false) {
                router.cancelNavigation(navigation, coordinator);
                return [];
            }
            else if (hooked !== true && hooked !== matchedInstructions) {
                const skipped = RoutingInstruction.flat(matchedInstructions);
                remainingInstructions = remainingInstructions.filter(instr => !skipped.includes(instr));
                matchedInstructions = hooked;
            }
            for (const matchedInstruction of matchedInstructions) {
                const endpoint = matchedInstruction.endpoint.instance;
                if (endpoint !== null) {
                    const action = endpoint.setNextContent(matchedInstruction, navigation);
                    if (action !== 'skip') {
                        changedEndpoints.push(endpoint);
                        coordinator.addEndpoint(endpoint);
                    }
                    const dontClear = [endpoint];
                    if (action === 'swap') {
                        dontClear.push(...endpoint.getContent().connectedScope.allScopes(true).map(scope => scope.endpoint));
                    }
                    arrayRemove(clearEndpoints, clear => dontClear.includes(clear));
                    arrayRemove(matchedInstructions, matched => matched !== matchedInstruction
                        && matched.isClear(router) && dontClear.includes(matched.endpoint.instance));
                    if (!matchedInstruction.isClear(router) && matchedInstruction.scope?.parent?.isViewportScope) {
                        arrayRemove(clearEndpoints, clear => clear === matchedInstruction.scope.parent.endpoint);
                        arrayRemove(matchedInstructions, matched => matched !== matchedInstruction
                            && matched.isClear(router) && matched.endpoint.instance === matchedInstruction.scope.parent.endpoint);
                    }
                    if (action !== 'skip' && matchedInstruction.hasNextScopeInstructions) {
                        for (const nextScopeInstruction of matchedInstruction.nextScopeInstructions) {
                            nextScopeInstruction.scope = endpoint.scope;
                            nextScopeInstruction.endpoint.instance = null;
                        }
                    }
                    if (action === 'skip' && !matchedInstruction.hasNextScopeInstructions) {
                        allChangedEndpoints.push(...(await endpoint.scope.processInstructions([], earlierMatchedInstructions, navigation, coordinator, configuredRoutePath)));
                    }
                }
            }
            const skipping = matchedInstructions.filter(instr => instr.endpoint.instance?.transitionAction === 'skip');
            const skippingWithMore = skipping.filter(instr => instr.hasNextScopeInstructions);
            if (skipping.length === 0 || (skippingWithMore.length === 0)) {
                if (!router.isRestrictedNavigation) {
                    coordinator.finalEndpoint();
                }
                coordinator.run();
                if (coordinator.hasAllEndpoints) {
                    const guardedUnload = coordinator.waitForSyncState('guardedUnload');
                    if (guardedUnload instanceof Promise) {
                        await guardedUnload;
                    }
                }
            }
            if (coordinator.cancelled) {
                router.cancelNavigation(navigation, coordinator);
                return [];
            }
            for (const changedEndpoint of changedEndpoints) {
                if (allChangedEndpoints.every(endpoint => endpoint !== changedEndpoint)) {
                    allChangedEndpoints.push(changedEndpoint);
                }
            }
            earlierMatchedInstructions.push(...matchedInstructions.splice(0));
            if (remainingInstructions.length > 0) {
                ({ matchedInstructions, remainingInstructions } = this.matchEndpoints(remainingInstructions, earlierMatchedInstructions));
            }
            if (!router.isRestrictedNavigation &&
                (matchedInstructions.length > 0 || remainingInstructions.length > 0) &&
                coordinator.running) {
                const waitForSwapped = coordinator.waitForSyncState('swapped');
                if (waitForSwapped instanceof Promise) {
                    await waitForSwapped;
                }
            }
            if (matchedInstructions.length === 0 && remainingInstructions.length === 0) {
                const nextProcesses = [];
                for (const instruction of instructions) {
                    if (!instruction.hasNextScopeInstructions) {
                        continue;
                    }
                    const nextScope = instruction.endpoint.instance?.scope ?? instruction.endpoint.scope;
                    nextProcesses.push(nextScope.processInstructions(instruction.nextScopeInstructions, earlierMatchedInstructions, navigation, coordinator, configuredRoutePath));
                }
                allChangedEndpoints.push(...(await Promise.all(nextProcesses)).flat());
            }
            ({ matchedInstructions, remainingInstructions } =
                coordinator.dequeueAppendedInstructions(matchedInstructions, earlierMatchedInstructions, remainingInstructions));
            if (matchedInstructions.length === 0 && remainingInstructions.length === 0) {
                const pendingEndpoints = earlierMatchedInstructions
                    .map(instr => (instr.endpoint.instance?.connectedCE).pendingPromise?.promise)
                    .filter(promise => promise != null);
                if (pendingEndpoints.length > 0) {
                    await Promise.any(pendingEndpoints);
                    ({ matchedInstructions, remainingInstructions } =
                        coordinator.dequeueAppendedInstructions(matchedInstructions, earlierMatchedInstructions, remainingInstructions));
                }
                else {
                    matchedInstructions = clearEndpoints.map(endpoint => RoutingInstruction.createClear(router, endpoint));
                }
            }
            const unresolvedPromise = RoutingInstruction.resolve(matchedInstructions);
            if (unresolvedPromise instanceof Promise) {
                await unresolvedPromise;
            }
            allChangedEndpoints = allChangedEndpoints.filter(endpoint => !([...earlierMatchedInstructions]
                .reverse()
                .find(instruction => instruction.endpoint.instance === endpoint)
                ?.cancelled ?? false));
        } while (matchedInstructions.length > 0 || remainingInstructions.length > 0);
        return allChangedEndpoints;
    }
    unknownRoute(instructions) {
        const options = this.router.configuration.options;
        const route = RoutingInstruction.stringify(this.router, instructions);
        if (instructions[0].route != null) {
            if (!options.useConfiguredRoutes) {
                throw new Error("Can not match '" + route + "' since the router is configured to not use configured routes.");
            }
            else {
                throw new Error("No matching configured route found for '" + route + "'.");
            }
        }
        else if (options.useConfiguredRoutes && options.useDirectRouting) {
            throw new Error("No matching configured route or component found for '" + route + "'.");
        }
        else if (options.useConfiguredRoutes) {
            throw new Error("No matching configured route found for '" + route + "'.");
        }
        else {
            throw new Error("No matching route/component found for '" + route + "'.");
        }
    }
    ensureClearStateInstruction(instructions) {
        const router = this.router;
        if (!instructions.some(instruction => instruction.isClearAll(router))) {
            const clearAll = RoutingInstruction.create(RoutingInstruction.clear(router));
            clearAll.scope = this;
            return [clearAll, ...instructions];
        }
        return instructions;
    }
    getClearAllEndpoints(instructions) {
        const router = this.router;
        let clearEndpoints = [];
        if (instructions.some(instruction => (instruction.scope ?? this) === this && instruction.isClearAll(router))) {
            clearEndpoints = this.enabledChildren
                .filter(scope => !scope.endpoint.isEmpty)
                .map(scope => scope.endpoint);
            instructions = instructions.filter(instruction => !((instruction.scope ?? this) === this && instruction.isClearAll(router)));
        }
        return { clearEndpoints, instructions };
    }
    findInstructions(instructions, useDirectRouting, useConfiguredRoutes) {
        const router = this.router;
        let route = new FoundRoute();
        if (useConfiguredRoutes && !RoutingInstruction.containsSiblings(router, instructions)) {
            let clearInstructions = instructions.filter(instruction => instruction.isClear(router) || instruction.isClearAll(router));
            const nonClearInstructions = instructions.filter(instruction => !instruction.isClear(router) && !instruction.isClearAll(router));
            if (nonClearInstructions.length > 0) {
                for (const instruction of nonClearInstructions) {
                    const idOrPath = typeof instruction.route === 'string'
                        ? instruction.route
                        : instruction.unparsed ?? RoutingInstruction.stringify(router, [instruction]);
                    const foundRoute = this.findMatchingRoute(idOrPath, instruction.parameters.parametersRecord ?? {});
                    if (foundRoute.foundConfiguration) {
                        route = foundRoute;
                        route.instructions = [...clearInstructions, ...route.instructions];
                        clearInstructions = [];
                    }
                    else if (useDirectRouting) {
                        route.instructions = [...clearInstructions, ...route.instructions, instruction];
                        clearInstructions = [];
                        route.remaining = RoutingInstruction.stringify(router, instruction.nextScopeInstructions ?? []);
                    }
                    else {
                        throw new Error(`No route found for: ${RoutingInstruction.stringify(router, instructions)}!`);
                    }
                }
            }
            else {
                route.instructions = [...clearInstructions];
            }
        }
        else if (useDirectRouting) {
            route.instructions.push(...instructions);
        }
        else {
            throw new Error(`No way to process sibling viewport routes with direct routing disabled: ${RoutingInstruction.stringify(router, instructions)}!`);
        }
        route.instructions = route.instructions.filter(instr => instr.component.name !== '');
        for (const instruction of route.instructions) {
            if (instruction.scope === null) {
                instruction.scope = this;
            }
        }
        return route;
    }
    matchEndpoints(instructions, alreadyFound, disregardViewports = false) {
        const allMatchedInstructions = [];
        const scopeInstructions = instructions.filter(instruction => (instruction.scope ?? this) === this);
        const allRemainingInstructions = instructions.filter(instruction => (instruction.scope ?? this) !== this);
        const { matchedInstructions, remainingInstructions } = EndpointMatcher.matchEndpoints(this, scopeInstructions, alreadyFound, disregardViewports);
        allMatchedInstructions.push(...matchedInstructions);
        allRemainingInstructions.push(...remainingInstructions);
        return { matchedInstructions: allMatchedInstructions, remainingInstructions: allRemainingInstructions };
    }
    addEndpoint(type, name, connectedCE, options = {}) {
        let endpoint = this.getOwnedScopes()
            .find(scope => scope.type === type &&
            scope.endpoint.name === name)?.endpoint ?? null;
        if (connectedCE != null && endpoint?.connectedCE != null && endpoint.connectedCE !== connectedCE) {
            endpoint = this.getOwnedScopes(true)
                .find(scope => scope.type === type &&
                scope.endpoint.name === name &&
                scope.endpoint.connectedCE === connectedCE)?.endpoint
                ?? null;
        }
        if (endpoint == null) {
            endpoint = type === 'Viewport'
                ? new Viewport(this.router, name, connectedCE, this.scope, !!options.scope, options)
                : new ViewportScope(this.router, name, connectedCE, this.scope, true, null, options);
            this.addChild(endpoint.connectedScope);
        }
        if (connectedCE != null) {
            endpoint.setConnectedCE(connectedCE, options);
        }
        return endpoint;
    }
    removeEndpoint(step, endpoint, connectedCE) {
        if (((connectedCE ?? null) !== null) || endpoint.removeEndpoint(step, connectedCE)) {
            this.removeChild(endpoint.connectedScope);
            return true;
        }
        return false;
    }
    addChild(scope) {
        if (!this.children.some(vp => vp === scope)) {
            if (scope.parent !== null) {
                scope.parent.removeChild(scope);
            }
            this.children.push(scope);
            scope.parent = this;
        }
    }
    removeChild(scope) {
        const index = this.children.indexOf(scope);
        if (index >= 0) {
            this.children.splice(index, 1);
            scope.parent = null;
        }
    }
    allScopes(includeDisabled = false) {
        const scopes = includeDisabled ? this.children.slice() : this.enabledChildren;
        for (const scope of scopes.slice()) {
            scopes.push(...scope.allScopes(includeDisabled));
        }
        return scopes;
    }
    reparentRoutingInstructions() {
        const scopes = this.hoistedChildren
            .filter(scope => scope.routingInstruction !== null && scope.routingInstruction.component.name);
        if (!scopes.length) {
            return null;
        }
        for (const scope of scopes) {
            const childInstructions = scope.reparentRoutingInstructions();
            scope.routingInstruction.nextScopeInstructions =
                childInstructions !== null && childInstructions.length > 0 ? childInstructions : null;
        }
        return scopes.map(scope => scope.routingInstruction);
    }
    getChildren(timestamp) {
        const contents = this.children
            .map(scope => scope.endpoint.getTimeContent(timestamp))
            .filter(content => content !== null);
        return contents.map(content => content.connectedScope);
    }
    getAllRoutingScopes(timestamp) {
        const scopes = this.getChildren(timestamp);
        for (const scope of scopes.slice()) {
            scopes.push(...scope.getAllRoutingScopes(timestamp));
        }
        return scopes;
    }
    getOwnedRoutingScopes(timestamp) {
        const scopes = this.getAllRoutingScopes(timestamp)
            .filter(scope => scope.owningScope === this);
        for (const scope of scopes.slice()) {
            if (scope.passThroughScope) {
                const passThrough = scopes.indexOf(scope);
                scopes.splice(passThrough, 1, ...scope.getOwnedRoutingScopes(timestamp));
            }
        }
        return arrayUnique(scopes);
    }
    getRoutingInstructions(timestamp) {
        const contents = arrayUnique(this.getOwnedRoutingScopes(timestamp)
            .map(scope => scope.endpoint))
            .map(endpoint => endpoint.getTimeContent(timestamp))
            .filter(content => content !== null);
        const instructions = [];
        for (const content of contents) {
            const instruction = content.instruction.clone(true, false, false);
            if ((instruction.component.name ?? '') !== '') {
                instruction.nextScopeInstructions = content.connectedScope.getRoutingInstructions(timestamp);
                instructions.push(instruction);
            }
        }
        return instructions;
    }
    canUnload(coordinator, step) {
        return Runner.run(step, (stepParallel) => {
            return Runner.runParallel(stepParallel, ...this.children.map(child => child.endpoint !== null
                ? (childStep) => child.endpoint.canUnload(coordinator, childStep)
                : (childStep) => child.canUnload(coordinator, childStep)));
        }, (step) => step.previousValue.every(result => result));
    }
    unload(coordinator, step) {
        return Runner.runParallel(step, ...this.children.map(child => child.endpoint !== null
            ? (childStep) => child.endpoint.unload(coordinator, childStep)
            : (childStep) => child.unload(coordinator, childStep)));
    }
    matchScope(instructions, deep = false) {
        const matching = [];
        for (const instruction of instructions) {
            if (instruction.scope === this) {
                matching.push(instruction);
            }
            else if (deep && instruction.hasNextScopeInstructions) {
                matching.push(...this.matchScope(instruction.nextScopeInstructions, deep));
            }
        }
        return matching;
    }
    findMatchingRoute(path, parameters) {
        let found = new FoundRoute();
        if (this.isViewportScope && !this.passThroughScope) {
            found = this.findMatchingRouteInRoutes(path, this.endpoint.getRoutes(), parameters);
        }
        else if (this.isViewport) {
            found = this.findMatchingRouteInRoutes(path, this.endpoint.getRoutes(), parameters);
        }
        else {
            for (const child of this.enabledChildren) {
                found = child.findMatchingRoute(path, parameters);
                if (found.foundConfiguration) {
                    break;
                }
            }
        }
        if (found.foundConfiguration) {
            return found;
        }
        if (this.parent != null) {
            return this.parent.findMatchingRoute(path, parameters);
        }
        return found;
    }
    findMatchingRouteInRoutes(path, routes, parameters) {
        const found = new FoundRoute();
        if (routes.length === 0) {
            return found;
        }
        routes = routes.map(route => this.ensureProperRoute(route));
        const cRoutes = [];
        for (const route of routes) {
            const paths = (Array.isArray(route.path) ? route.path : [route.path]);
            for (const path of paths) {
                cRoutes.push({
                    ...route,
                    path,
                    handler: route,
                });
                if (path !== '') {
                    cRoutes.push({
                        ...route,
                        path: `${path}/*remainingPath`,
                        handler: route,
                    });
                }
            }
        }
        if (path.startsWith('/') || path.startsWith('+')) {
            path = path.slice(1);
        }
        const idRoute = routes.find(route => route.id === path);
        let result = { params: {}, endpoint: {} };
        if (idRoute != null) {
            result.endpoint = { route: { handler: idRoute } };
            path = Array.isArray(idRoute.path) ? idRoute.path[0] : idRoute.path;
            const segments = path.split('/').map(segment => {
                if (segment.startsWith(':')) {
                    const name = segment.slice(1).replace(/\?$/, '');
                    const param = parameters[name];
                    result.params[name] = param;
                    return param;
                }
                else {
                    return segment;
                }
            });
            path = segments.join('/');
        }
        else {
            const recognizer = new RouteRecognizer();
            recognizer.add(cRoutes);
            result = recognizer.recognize(path);
        }
        if (result != null) {
            found.match = result.endpoint.route.handler;
            found.matching = path;
            const $params = { ...result.params };
            if ($params.remainingPath != null) {
                found.remaining = $params.remainingPath;
                Reflect.deleteProperty($params, 'remainingPath');
                found.matching = found.matching.slice(0, found.matching.indexOf(found.remaining));
            }
            found.params = $params;
            if (found.match?.redirectTo != null) {
                let redirectedTo = found.match?.redirectTo;
                if ((found.remaining ?? '').length > 0) {
                    redirectedTo += `/${found.remaining}`;
                }
                return this.findMatchingRouteInRoutes(redirectedTo, routes, parameters);
            }
        }
        if (found.foundConfiguration) {
            found.instructions = RoutingInstruction.clone(found.match.instructions, false, true);
            const instructions = found.instructions.slice();
            while (instructions.length > 0) {
                const instruction = instructions.shift();
                instruction.parameters.addParameters(found.params);
                instruction.route = found;
                if (instruction.hasNextScopeInstructions) {
                    instructions.unshift(...instruction.nextScopeInstructions);
                }
            }
            if (found.instructions.length > 0) {
                found.instructions[0].routeStart = true;
            }
            const remaining = RoutingInstruction.parse(this.router, found.remaining);
            if (remaining.length > 0) {
                let lastInstruction = found.instructions[0];
                while (lastInstruction.hasNextScopeInstructions) {
                    lastInstruction = lastInstruction.nextScopeInstructions[0];
                }
                lastInstruction.nextScopeInstructions = remaining;
            }
        }
        return found;
    }
    ensureProperRoute(route) {
        if (route.id === void 0) {
            route.id = Array.isArray(route.path) ? route.path.join(',') : route.path;
        }
        if (route.instructions === void 0) {
            route.instructions = [{
                    component: route.component,
                    viewport: route.viewport,
                    parameters: route.parameters,
                    children: route.children,
                }];
        }
        if (route.redirectTo === null) {
            route.instructions = RoutingInstruction.from(this.router, route.instructions);
        }
        return route;
    }
}
RoutingScope.lastId = 0;

class QueueTask {
    constructor(taskQueue, item, cost = 0) {
        this.taskQueue = taskQueue;
        this.item = item;
        this.cost = cost;
        this.done = false;
        this.promise = new Promise((resolve, reject) => {
            this.resolve = () => {
                this.taskQueue.resolve(this, resolve);
            };
            this.reject = (reason) => {
                this.taskQueue.reject(this, reject, reason);
            };
        });
    }
    async execute() {
        if ('execute' in this.item) {
            await this.item.execute(this);
        }
        else {
            await this.item(this);
        }
    }
    wait() {
        return this.promise;
    }
}
class TaskQueue {
    get isActive() {
        return this.task !== null;
    }
    constructor(callback) {
        this.callback = callback;
        this.pending = [];
        this.processing = null;
        this.allowedExecutionCostWithinTick = null;
        this.currentExecutionCostInCurrentTick = 0;
        this.platform = null;
        this.task = null;
        this.dequeue = (delta) => {
            if (this.processing !== null) {
                return;
            }
            if (delta !== undefined) {
                this.currentExecutionCostInCurrentTick = 0;
            }
            if (this.pending.length === 0) {
                return;
            }
            if (this.allowedExecutionCostWithinTick !== null && delta === undefined && this.currentExecutionCostInCurrentTick + (this.pending[0].cost || 0) > this.allowedExecutionCostWithinTick) {
                return;
            }
            this.processing = this.pending.shift() || null;
            if (this.processing) {
                this.currentExecutionCostInCurrentTick += this.processing.cost ?? 0;
                if (this.callback !== void 0) {
                    this.callback(this.processing);
                }
                else {
                    this.processing.execute().catch(error => { throw error; });
                }
            }
        };
    }
    get length() {
        return this.pending.length;
    }
    start(options) {
        this.platform = options.platform;
        this.allowedExecutionCostWithinTick = options.allowedExecutionCostWithinTick;
        this.task = this.platform.domWriteQueue.queueTask(this.dequeue, { persistent: true });
    }
    stop() {
        this.task.cancel();
        this.task = null;
        this.allowedExecutionCostWithinTick = null;
        this.clear();
    }
    enqueue(itemOrItems, costOrCosts) {
        const list = Array.isArray(itemOrItems);
        const items = (list ? itemOrItems : [itemOrItems]);
        const costs = items
            .map((value, index) => !Array.isArray(costOrCosts) ? costOrCosts : costOrCosts[index])
            .map((value) => value !== undefined ? value : 1);
        const tasks = [];
        for (const item of items) {
            tasks.push(item instanceof QueueTask
                ? item
                : this.createQueueTask(item, costs.shift()));
        }
        this.pending.push(...tasks);
        this.dequeue();
        return list ? tasks : tasks[0];
    }
    createQueueTask(item, cost) {
        return new QueueTask(this, item, cost);
    }
    clear() {
        this.pending.length = 0;
    }
    resolve(_task, resolve) {
        resolve();
        this.processing = null;
        this.dequeue();
    }
    reject(_task, reject, reason) {
        reject(reason);
        this.processing = null;
        this.dequeue();
    }
}

let BrowserViewerStore = class BrowserViewerStore {
    constructor(platform, window, history, location, ea) {
        this.platform = platform;
        this.window = window;
        this.history = history;
        this.location = location;
        this.ea = ea;
        this.allowedExecutionCostWithinTick = 2;
        this.isActive = false;
        this.options = {
            useUrlFragmentHash: true,
        };
        this.forwardedState = { eventTask: null, suppressPopstate: false };
        this.pendingCalls = new TaskQueue();
    }
    start(options) {
        if (this.isActive) {
            throw new Error('Browser navigation has already been started');
        }
        this.isActive = true;
        if (options.useUrlFragmentHash != void 0) {
            this.options.useUrlFragmentHash = options.useUrlFragmentHash;
        }
        this.pendingCalls.start({ platform: this.platform, allowedExecutionCostWithinTick: this.allowedExecutionCostWithinTick });
        this.window.addEventListener('popstate', this);
    }
    stop() {
        if (!this.isActive) {
            throw new Error('Browser navigation has not been started');
        }
        this.window.removeEventListener('popstate', this);
        this.pendingCalls.stop();
        this.options = { useUrlFragmentHash: true };
        this.isActive = false;
    }
    get length() {
        return this.history.length;
    }
    get state() {
        return this.history.state;
    }
    get viewerState() {
        const { pathname, search, hash } = this.location;
        const instruction = (this.options.useUrlFragmentHash ?? false)
            ? hash.slice(1)
            : `${pathname}${search}`;
        const fragment = (this.options.useUrlFragmentHash ?? false)
            ? (hash.slice(1).includes('#') ? hash.slice(hash.slice(1).indexOf('#', 1)) : '')
            : hash.slice(1);
        return new NavigatorViewerState(pathname, search.slice(1), fragment, instruction);
    }
    async go(delta, suppressEvent = false) {
        const doneTask = this.pendingCalls.createQueueTask((task) => task.resolve(), 1);
        this.pendingCalls.enqueue([
            (task) => {
                const eventTask = doneTask;
                const suppressPopstate = suppressEvent;
                this.forwardState({ eventTask, suppressPopstate });
                task.resolve();
            },
            (task) => {
                const history = this.history;
                const steps = delta;
                history.go(steps);
                task.resolve();
            },
        ], [0, 1]);
        return doneTask.wait();
    }
    async pushNavigatorState(state) {
        const { title, path } = state.navigations[state.navigationIndex];
        const fragment = this.options.useUrlFragmentHash ? '#/' : '';
        return this.pendingCalls.enqueue((task) => {
            const history = this.history;
            const data = state;
            const titleOrEmpty = title || '';
            const url = `${fragment}${path}`;
            try {
                history.pushState(data, titleOrEmpty, url);
                this.setTitle(titleOrEmpty);
            }
            catch (err) {
                const clean = this.tryCleanState(data, 'push', err);
                history.pushState(clean, titleOrEmpty, url);
                this.setTitle(titleOrEmpty);
            }
            task.resolve();
        }, 1).wait();
    }
    async replaceNavigatorState(state, title, path) {
        const lastNavigation = state.navigations[state.navigationIndex];
        title ?? (title = lastNavigation.title);
        path ?? (path = lastNavigation.path);
        const fragment = this.options.useUrlFragmentHash ? '#/' : '';
        return this.pendingCalls.enqueue((task) => {
            const history = this.history;
            const data = state;
            const titleOrEmpty = title || '';
            const url = `${fragment}${path}`;
            try {
                history.replaceState(data, titleOrEmpty, url);
                this.setTitle(titleOrEmpty);
            }
            catch (err) {
                const clean = this.tryCleanState(data, 'replace', err);
                history.replaceState(clean, titleOrEmpty, url);
                this.setTitle(titleOrEmpty);
            }
            task.resolve();
        }, 1).wait();
    }
    async popNavigatorState() {
        const doneTask = this.pendingCalls.createQueueTask((task) => task.resolve(), 1);
        this.pendingCalls.enqueue(async (task) => {
            const eventTask = doneTask;
            await this.popState(eventTask);
            task.resolve();
        }, 1);
        return doneTask.wait();
    }
    setTitle(title) {
        this.window.document.title = title;
    }
    handleEvent(e) {
        this.handlePopStateEvent(e);
    }
    handlePopStateEvent(event) {
        const { eventTask, suppressPopstate } = this.forwardedState;
        this.forwardedState = { eventTask: null, suppressPopstate: false };
        this.pendingCalls.enqueue(async (task) => {
            if (!suppressPopstate) {
                this.notifySubscribers(event);
            }
            if (eventTask !== null) {
                await eventTask.execute();
            }
            task.resolve();
        }, 1);
    }
    notifySubscribers(ev) {
        this.ea.publish(NavigatorStateChangeEvent.eventName, NavigatorStateChangeEvent.create(this.viewerState, ev, this.history.state));
    }
    async popState(doneTask) {
        await this.go(-1, true);
        const state = this.history.state;
        const lastNavigation = state?.navigations?.[state?.navigationIndex ?? 0];
        if (lastNavigation != null && !lastNavigation.firstEntry) {
            await this.go(-1, true);
            await this.pushNavigatorState(state);
        }
        await doneTask.execute();
    }
    forwardState(state) {
        this.forwardedState = state;
    }
    tryCleanState(data, type, originalError) {
        try {
            return JSON.parse(JSON.stringify(data));
        }
        catch (err) {
            throw new Error(`Failed to ${type} state, probably due to unserializable data and/or parameters: ${err}${originalError}`);
        }
    }
};
BrowserViewerStore = __decorate([
    __param(0, runtimeHtml.IPlatform),
    __param(1, runtimeHtml.IWindow),
    __param(2, runtimeHtml.IHistory),
    __param(3, runtimeHtml.ILocation),
    __param(4, kernel.IEventAggregator)
], BrowserViewerStore);
class NavigatorViewerState {
    constructor(path, query, hash, instruction) {
        this.path = path;
        this.query = query;
        this.hash = hash;
        this.instruction = instruction;
    }
}
class NavigatorStateChangeEvent {
    constructor(eventName, viewerState, event, state) {
        this.eventName = eventName;
        this.viewerState = viewerState;
        this.event = event;
        this.state = state;
    }
    static create(viewerState, ev, navigatorState) {
        return new NavigatorStateChangeEvent(NavigatorStateChangeEvent.eventName, viewerState, ev, navigatorState);
    }
}
NavigatorStateChangeEvent.eventName = 'au:router:navigation-state-change';

class Entity {
    constructor(endpoint) {
        this.endpoint = endpoint;
        this.running = false;
        this.states = new Map();
        this.checkedStates = [];
        this.syncingState = null;
        this.syncPromise = null;
        this.step = null;
    }
    hasReachedState(state) {
        return this.states.has(state) && this.states.get(state) === null;
    }
}
class NavigationCoordinator {
    constructor(router, navigation) {
        this.router = router;
        this.navigation = navigation;
        this.running = false;
        this.completed = false;
        this.cancelled = false;
        this.hasAllEndpoints = false;
        this.appendedInstructions = [];
        this.entities = [];
        this.syncStates = new Map();
        this.checkedSyncStates = new Set();
    }
    static create(router, navigation, options) {
        const coordinator = new NavigationCoordinator(router, navigation);
        options.syncStates.forEach((state) => coordinator.addSyncState(state));
        return coordinator;
    }
    run() {
        if (!this.running) {
            this.running = true;
            for (const entity of this.entities) {
                if (!entity.running) {
                    entity.running = true;
                    entity.endpoint.transition(this);
                }
            }
        }
    }
    addSyncState(state) {
        const openPromise = new OpenPromise();
        this.syncStates.set(state, openPromise);
    }
    addEndpoint(endpoint) {
        const entity = new Entity(endpoint);
        this.entities.push(entity);
        this.recheckSyncStates();
        if (this.running) {
            entity.endpoint.transition(this);
        }
        return entity;
    }
    removeEndpoint(endpoint) {
        const entity = this.entities.find(e => e.endpoint === endpoint);
        if (entity !== void 0) {
            arrayRemove(this.entities, ent => ent === entity);
        }
    }
    setEndpointStep(endpoint, step) {
        let entity = this.entities.find(e => e.endpoint === endpoint);
        if (entity === void 0) {
            entity = this.addEndpoint(endpoint);
        }
        entity.step = step;
    }
    getEndpointStep(endpoint) {
        const entity = this.entities.find(e => e.endpoint === endpoint);
        return entity?.step ?? null;
    }
    addEndpointState(endpoint, state) {
        let entity = this.entities.find(e => e.endpoint === endpoint);
        if (entity === void 0) {
            entity = this.addEndpoint(endpoint);
        }
        const openPromise = entity.states.get(state);
        if (openPromise instanceof OpenPromise) {
            openPromise.resolve();
        }
        entity.states.set(state, null);
        this.checkSyncState(state);
    }
    waitForSyncState(state, endpoint = null) {
        if (this.entities.length === 0) {
            return;
        }
        const openPromise = this.syncStates.get(state);
        if (openPromise === void 0) {
            return;
        }
        if (endpoint !== null) {
            const entity = this.entities.find(e => e.endpoint === endpoint);
            if (entity?.syncPromise === null && openPromise.isPending) {
                entity.syncingState = state;
                entity.syncPromise = new OpenPromise();
                entity.checkedStates.push(state);
                this.checkedSyncStates.add(state);
                Promise.resolve().then(() => {
                    this.checkSyncState(state);
                }).catch(err => { throw err; });
                return entity.syncPromise.promise;
            }
        }
        return openPromise.isPending ? openPromise.promise : void 0;
    }
    waitForEndpointState(endpoint, state) {
        if (!this.syncStates.has(state)) {
            return;
        }
        let entity = this.entities.find(e => e.endpoint === endpoint);
        if (entity == null) {
            entity = this.addEndpoint(endpoint);
        }
        if (entity.hasReachedState(state)) {
            return;
        }
        let openPromise = entity.states.get(state);
        if (openPromise == null) {
            openPromise = new OpenPromise();
            entity.states.set(state, openPromise);
        }
        return openPromise.promise;
    }
    finalEndpoint() {
        this.hasAllEndpoints = true;
        this.syncStates.forEach((_promise, state) => this.checkSyncState(state));
    }
    finalize() {
        this.entities.forEach(entity => entity.endpoint.finalizeContentChange(this, null));
        this.completed = true;
        this.navigation.completed = true;
    }
    cancel() {
        this.cancelled = true;
        this.entities.forEach(entity => {
            const abort = entity.endpoint.cancelContentChange(this);
            if (abort instanceof Promise) {
                abort.catch(error => { throw error; });
            }
        });
        this.router.navigator.cancel(this.navigation).then(() => {
            this.navigation.process?.resolve(false);
        }).catch(error => { throw error; });
        this.completed = true;
        this.navigation.completed = true;
    }
    enqueueAppendedInstructions(instructions) {
        this.appendedInstructions.push(...instructions);
    }
    dequeueAppendedInstructions(matchedInstructions, earlierMatchedInstructions, remainingInstructions) {
        let appendedInstructions = [...this.appendedInstructions];
        matchedInstructions = [...matchedInstructions];
        remainingInstructions = [...remainingInstructions];
        const nonDefaultInstructions = appendedInstructions.filter(instr => !instr.default);
        const defaultInstructions = appendedInstructions.filter(instr => instr.default);
        appendedInstructions = nonDefaultInstructions.length > 0
            ? [...nonDefaultInstructions]
            : [...defaultInstructions];
        while (appendedInstructions.length > 0) {
            const appendedInstruction = appendedInstructions.shift();
            arrayRemove(this.appendedInstructions, instr => instr === appendedInstruction);
            const foundEarlierExisting = earlierMatchedInstructions.some(instr => !instr.cancelled && instr.sameEndpoint(appendedInstruction, true));
            const existingMatched = matchedInstructions.find(instr => instr.sameEndpoint(appendedInstruction, true));
            const existingRemaining = remainingInstructions.find(instr => instr.sameEndpoint(appendedInstruction, true));
            if (appendedInstruction.default &&
                (foundEarlierExisting ||
                    (existingMatched !== void 0 && !existingMatched.default) ||
                    (existingRemaining !== void 0 && !existingRemaining.default))) {
                continue;
            }
            if (existingMatched !== void 0) {
                arrayRemove(matchedInstructions, value => value === existingMatched);
            }
            if (existingRemaining !== void 0) {
                arrayRemove(remainingInstructions, value => value === existingRemaining);
            }
            if (appendedInstruction.endpoint.instance !== null) {
                matchedInstructions.push(appendedInstruction);
            }
            else {
                remainingInstructions.push(appendedInstruction);
            }
        }
        return { matchedInstructions, remainingInstructions };
    }
    checkSyncState(state) {
        const openPromise = this.syncStates.get(state);
        if (openPromise === void 0) {
            return;
        }
        if (this.hasAllEndpoints &&
            openPromise.isPending &&
            this.entities.every(ent => ent.hasReachedState(state)) &&
            (!this.checkedSyncStates.has(state) || this.entities.every(ent => ent.checkedStates.includes(state)))) {
            for (const entity of this.entities) {
                if (entity.syncingState === state) {
                    entity.syncPromise?.resolve();
                    entity.syncPromise = null;
                    entity.syncingState = null;
                }
            }
            openPromise.resolve();
        }
    }
    recheckSyncStates() {
        this.syncStates.forEach((promise, state) => {
            if (!promise.isPending && !this.entities.every(ent => ent.hasReachedState(state))) {
                this.addSyncState(state);
            }
        });
    }
}

class RoutingHook {
    constructor(hook, options, id) {
        this.hook = hook;
        this.id = id;
        this.type = 'beforeNavigation';
        this.includeTargets = [];
        this.excludeTargets = [];
        if (options.type !== void 0) {
            this.type = options.type;
        }
        for (const target of options.include ?? []) {
            this.includeTargets.push(new Target(target));
        }
        for (const target of options.exclude ?? []) {
            this.excludeTargets.push(new Target(target));
        }
    }
    static add(hookFunction, options) {
        const hook = new RoutingHook(hookFunction, options ?? {}, ++this.lastIdentity);
        this.hooks[hook.type].push(hook);
        return this.lastIdentity;
    }
    static remove(id) {
        for (const type in this.hooks) {
            if (Object.prototype.hasOwnProperty.call(this.hooks, type)) {
                const index = this.hooks[type].findIndex(hook => hook.id === id);
                if (index >= 0) {
                    this.hooks[type].splice(index, 1);
                }
            }
        }
    }
    static removeAll() {
        for (const type in this.hooks) {
            this.hooks[type] = [];
        }
    }
    static async invokeBeforeNavigation(routingInstructions, navigationInstruction) {
        return this.invoke('beforeNavigation', navigationInstruction, routingInstructions);
    }
    static async invokeTransformFromUrl(url, navigationInstruction) {
        return this.invoke('transformFromUrl', navigationInstruction, url);
    }
    static async invokeTransformToUrl(state, navigationInstruction) {
        return this.invoke('transformToUrl', navigationInstruction, state);
    }
    static async invokeTransformTitle(title, navigationInstruction) {
        return this.invoke('transformTitle', navigationInstruction, title);
    }
    static async invoke(type, navigationInstruction, arg) {
        let outcome = arg;
        for (const hook of this.hooks[type]) {
            if (!hook.wantsMatch || hook.matches(arg)) {
                outcome = await hook.invoke(navigationInstruction, arg);
                if (typeof outcome === 'boolean') {
                    if (!outcome) {
                        return false;
                    }
                }
                else {
                    arg = outcome;
                }
            }
        }
        return outcome;
    }
    get wantsMatch() {
        return this.includeTargets.length > 0 || this.excludeTargets.length > 0;
    }
    matches(routingInstructions) {
        if (this.includeTargets.length && !this.includeTargets.some(target => target.matches(routingInstructions))) {
            return false;
        }
        if (this.excludeTargets.length && this.excludeTargets.some(target => target.matches(routingInstructions))) {
            return false;
        }
        return true;
    }
    invoke(navigationInstruction, arg) {
        return this.hook(arg, navigationInstruction);
    }
}
RoutingHook.hooks = {
    beforeNavigation: [],
    transformFromUrl: [],
    transformToUrl: [],
    transformTitle: [],
};
RoutingHook.lastIdentity = 0;
class Target {
    constructor(target) {
        this.componentType = null;
        this.componentName = null;
        this.viewport = null;
        this.viewportName = null;
        if (typeof target === 'string') {
            this.componentName = target;
        }
        else if (InstructionComponent.isType(target)) {
            this.componentType = target;
            this.componentName = InstructionComponent.getName(target);
        }
        else {
            const cvTarget = target;
            if (cvTarget.component != null) {
                this.componentType = InstructionComponent.isType(cvTarget.component)
                    ? InstructionComponent.getType(cvTarget.component)
                    : null;
                this.componentName = InstructionComponent.getName(cvTarget.component);
            }
            if (cvTarget.viewport != null) {
                this.viewport = InstructionEndpoint.isInstance(cvTarget.viewport) ? cvTarget.viewport : null;
                this.viewportName = InstructionEndpoint.getName(cvTarget.viewport);
            }
        }
    }
    matches(routingInstructions) {
        const instructions = routingInstructions.slice();
        if (!instructions.length) {
            instructions.push(RoutingInstruction.create(''));
        }
        for (const instruction of instructions) {
            if ((this.componentName !== null && this.componentName === instruction.component.name) ||
                (this.componentType !== null && this.componentType === instruction.component.type) ||
                (this.viewportName !== null && this.viewportName === instruction.endpoint.name) ||
                (this.viewport !== null && this.viewport === instruction.endpoint.instance)) {
                return true;
            }
        }
        return false;
    }
}

class Title {
    static async getTitle(instructions, navigation, titleOptions) {
        let title = await RoutingHook.invokeTransformTitle(instructions, navigation);
        if (typeof title !== 'string') {
            const componentTitles = Title.stringifyTitles(title, navigation, titleOptions);
            title = titleOptions.appTitle;
            title = title.replace(/\${componentTitles}/g, componentTitles);
            title = title.replace(/\${appTitleSeparator}/g, componentTitles !== '' ? titleOptions.appTitleSeparator : '');
        }
        title = await RoutingHook.invokeTransformTitle(title, navigation);
        return title;
    }
    static stringifyTitles(instructions, navigation, titleOptions) {
        const titles = instructions
            .map(instruction => Title.stringifyTitle(instruction, navigation, titleOptions))
            .filter(instruction => (instruction?.length ?? 0) > 0);
        return titles.join(' + ');
    }
    static stringifyTitle(instruction, navigation, titleOptions) {
        const nextInstructions = instruction.nextScopeInstructions;
        let stringified = Title.resolveTitle(instruction, navigation, titleOptions);
        if (Array.isArray(nextInstructions) && nextInstructions.length > 0) {
            let nextStringified = Title.stringifyTitles(nextInstructions, navigation, titleOptions);
            if (nextStringified.length > 0) {
                if (nextInstructions.length !== 1) {
                    nextStringified = `[ ${nextStringified} ]`;
                }
                if (stringified.length > 0) {
                    stringified = titleOptions.componentTitleOrder === 'top-down'
                        ? stringified + titleOptions.componentTitleSeparator + nextStringified
                        : nextStringified + titleOptions.componentTitleSeparator + stringified;
                }
                else {
                    stringified = nextStringified;
                }
            }
        }
        return stringified;
    }
    static resolveTitle(instruction, navigation, titleOptions) {
        let title = instruction.getTitle(navigation);
        if (titleOptions.transformTitle != null) {
            title = titleOptions.transformTitle(title, instruction, navigation);
        }
        return title;
    }
}

const IRouter = kernel.DI.createInterface('IRouter', x => x.singleton(Router));
class Router {
    static get inject() { return [kernel.IContainer, kernel.IEventAggregator, exports.Navigator, BrowserViewerStore, BrowserViewerStore, IRouterConfiguration]; }
    constructor(container, ea, navigator, viewer, store, configuration) {
        this.container = container;
        this.ea = ea;
        this.navigator = navigator;
        this.viewer = viewer;
        this.store = store;
        this.configuration = configuration;
        this.rootScope = null;
        this.activeComponents = [];
        this.appendedInstructions = [];
        this.isActive = false;
        this.coordinators = [];
        this.loadedFirst = false;
        this.handleNavigatorNavigateEvent = (event) => {
            this.processNavigation(event.navigation).catch(error => {
                throw error;
            });
        };
        this.handleNavigatorStateChangeEvent = (event) => {
            if (event.state?.navigationIndex != null) {
                const entry = Navigation.create(event.state.navigations[event.state.navigationIndex]);
                entry.instruction = event.viewerState.instruction;
                entry.fromBrowser = true;
                this.navigator.navigate(entry).catch(error => { throw error; });
            }
            else {
                this.load(event.viewerState.instruction, { fromBrowser: true }).catch(error => { throw error; });
            }
        };
        this.processNavigation = async (navigation) => {
            this.loadedFirst = true;
            const options = this.configuration.options;
            const coordinator = NavigationCoordinator.create(this, navigation, { syncStates: this.configuration.options.navigationSyncStates });
            this.coordinators.push(coordinator);
            coordinator.appendedInstructions.push(...this.appendedInstructions.splice(0));
            this.ea.publish(RouterNavigationStartEvent.eventName, RouterNavigationStartEvent.create(navigation));
            let transformedInstruction = typeof navigation.instruction === 'string' && !navigation.useFullStateInstruction
                ? await RoutingHook.invokeTransformFromUrl(navigation.instruction, coordinator.navigation)
                : (navigation.useFullStateInstruction ? navigation.fullStateInstruction : navigation.instruction);
            const basePath = options.basePath;
            if (basePath !== null &&
                typeof transformedInstruction === 'string' && transformedInstruction.startsWith(basePath) &&
                !options.useUrlFragmentHash) {
                transformedInstruction = transformedInstruction.slice(basePath.length);
            }
            if (transformedInstruction === '/') {
                transformedInstruction = '';
            }
            if (typeof transformedInstruction === 'string') {
                transformedInstruction = transformedInstruction === ''
                    ? [new RoutingInstruction('')]
                    : RoutingInstruction.parse(this, transformedInstruction);
            }
            navigation.scope ?? (navigation.scope = this.rootScope.scope);
            const allChangedEndpoints = await navigation.scope.processInstructions(transformedInstruction, [], navigation, coordinator);
            return Runner.run(null, () => {
                coordinator.finalEndpoint();
                return coordinator.waitForSyncState('completed');
            }, () => {
                coordinator.finalize();
                return this.updateNavigation(navigation);
            }, () => {
                if (navigation.navigation.new && !navigation.navigation.first && !navigation.repeating && allChangedEndpoints.every(endpoint => endpoint.options.noHistory)) {
                    navigation.untracked = true;
                }
            }, async () => {
                while (this.coordinators.length > 0 && this.coordinators[0].completed) {
                    const coord = this.coordinators.shift();
                    await this.navigator.finalize(coord.navigation, false);
                    this.ea.publish(RouterNavigationCompleteEvent.eventName, RouterNavigationCompleteEvent.create(coord.navigation));
                    this.ea.publish(RouterNavigationEndEvent.eventName, RouterNavigationEndEvent.create(coord.navigation));
                    coord.navigation.process?.resolve(true);
                }
            });
        };
    }
    get isNavigating() {
        return this.coordinators.length > 0;
    }
    get isRestrictedNavigation() {
        const syncStates = this.configuration.options.navigationSyncStates;
        return syncStates.includes('guardedLoad') ||
            syncStates.includes('unloaded') ||
            syncStates.includes('loaded') ||
            syncStates.includes('guarded') ||
            syncStates.includes('routed');
    }
    get statefulHistory() {
        return this.configuration.options.statefulHistoryLength !== void 0 && this.configuration.options.statefulHistoryLength > 0;
    }
    start() {
        if (this.isActive) {
            throw new Error('Router has already been started');
        }
        this.isActive = true;
        const root = this.container.get(runtimeHtml.IAppRoot);
        this.rootScope = new ViewportScope(this, 'rootScope', root.controller.viewModel, null, true, root.config.component);
        const options = this.configuration.options;
        if (options.basePath === null) {
            const url = new URL(root.host.baseURI);
            options.basePath = url.pathname;
        }
        if (options.basePath.endsWith('/')) {
            options.basePath = options.basePath.slice(0, -1);
        }
        this.navigator.start({
            store: this.store,
            viewer: this.viewer,
            statefulHistoryLength: this.configuration.options.statefulHistoryLength,
        });
        this.navigatorStateChangeEventSubscription = this.ea.subscribe(NavigatorStateChangeEvent.eventName, this.handleNavigatorStateChangeEvent);
        this.navigatorNavigateEventSubscription = this.ea.subscribe(NavigatorNavigateEvent.eventName, this.handleNavigatorNavigateEvent);
        this.viewer.start({ useUrlFragmentHash: this.configuration.options.useUrlFragmentHash });
        this.ea.publish(RouterStartEvent.eventName, RouterStartEvent.create());
    }
    stop() {
        if (!this.isActive) {
            throw new Error('Router has not been started');
        }
        this.ea.publish(RouterStopEvent.eventName, RouterStopEvent.create());
        this.navigator.stop();
        this.viewer.stop();
        this.navigatorStateChangeEventSubscription.dispose();
        this.navigatorNavigateEventSubscription.dispose();
    }
    async initialLoad() {
        const { instruction, hash } = this.viewer.viewerState;
        const result = this.load(instruction, {
            fragment: hash,
            replacing: true,
            fromBrowser: false
        });
        this.loadedFirst = true;
        return result;
    }
    getEndpoint(type, name) {
        return this.allEndpoints(type).find(endpoint => endpoint.name === name) ?? null;
    }
    allEndpoints(type, includeDisabled = false) {
        return this.rootScope.scope
            .allScopes(includeDisabled)
            .filter(scope => type === null || scope.type === type)
            .map(scope => scope.endpoint);
    }
    addEndpoint(_type, ..._args) {
        throw new Error('Not implemented');
    }
    connectEndpoint(endpoint, type, connectedCE, name, options) {
        const container = connectedCE.container;
        const closestEndpoint = (container.has(Router.closestEndpointKey, true) ? container.get(Router.closestEndpointKey) : this.rootScope);
        const parentScope = closestEndpoint.connectedScope;
        if (endpoint === null) {
            endpoint = parentScope.addEndpoint(type, name, connectedCE, options);
            kernel.Registration.instance(Router.closestEndpointKey, endpoint).register(container);
        }
        return endpoint;
    }
    disconnectEndpoint(step, endpoint, connectedCE) {
        if (!endpoint.connectedScope.parent.removeEndpoint(step, endpoint, connectedCE)) {
            throw new Error("Router failed to remove endpoint: " + endpoint.name);
        }
    }
    async load(instructions, options) {
        options = options ?? {};
        instructions = this.extractFragment(instructions, options);
        instructions = this.extractQuery(instructions, options);
        let scope = null;
        ({ instructions, scope } = this.applyLoadOptions(instructions, options));
        if ((options.append ?? false) && (!this.loadedFirst || this.isNavigating)) {
            instructions = RoutingInstruction.from(this, instructions);
            this.appendInstructions(instructions, scope);
            return Promise.resolve();
        }
        const entry = Navigation.create({
            instruction: instructions,
            fullStateInstruction: '',
            scope: scope,
            title: options.title,
            data: options.data,
            query: options.query,
            fragment: options.fragment,
            parameters: options.parameters,
            replacing: (options.replacing ?? false) || options.replace,
            repeating: options.append,
            fromBrowser: options.fromBrowser ?? false,
            origin: options.origin,
            completed: false,
        });
        return this.navigator.navigate(entry);
    }
    applyLoadOptions(loadInstructions, options, keepString = true) {
        options = options ?? {};
        if ('origin' in options && !('context' in options)) {
            options.context = options.origin;
        }
        const { scope, instruction } = RoutingScope.for(options.context ?? null, typeof loadInstructions === 'string' ? loadInstructions : undefined);
        if (typeof loadInstructions === 'string') {
            if (!keepString) {
                loadInstructions = RoutingInstruction.from(this, instruction);
                for (const loadInstruction of loadInstructions) {
                    if (loadInstruction.scope === null) {
                        loadInstruction.scope = scope;
                    }
                }
            }
            else {
                loadInstructions = instruction;
            }
        }
        else {
            loadInstructions = RoutingInstruction.from(this, loadInstructions);
            for (const loadInstruction of loadInstructions) {
                if (loadInstruction.scope === null) {
                    loadInstruction.scope = scope;
                }
            }
        }
        return {
            instructions: loadInstructions,
            scope,
        };
    }
    refresh() {
        return this.navigator.refresh();
    }
    back() {
        return this.navigator.go(-1);
    }
    forward() {
        return this.navigator.go(1);
    }
    go(delta) {
        return this.navigator.go(delta);
    }
    checkActive(instructions, options) {
        if (typeof instructions === 'string') {
            throw new Error(`Parameter instructions to checkActivate can not be a string ('${instructions}')!`);
        }
        options = options ?? {};
        ({ instructions } = this.applyLoadOptions(instructions, options));
        instructions.forEach((instruction) => instruction.scope ?? (instruction.scope = this.rootScope.scope));
        const scopes = arrayUnique(instructions.map(instruction => instruction.scope));
        for (const scope of scopes) {
            const scopeInstructions = scope.matchScope(instructions, false);
            const scopeActives = scope.matchScope(this.activeComponents, true);
            if (!RoutingInstruction.contains(this, scopeActives, scopeInstructions, true)) {
                return false;
            }
        }
        return true;
    }
    unresolvedInstructionsError(navigation, instructions) {
        this.ea.publish(RouterNavigationErrorEvent.eventName, RouterNavigationErrorEvent.create(navigation));
        this.ea.publish(RouterNavigationEndEvent.eventName, RouterNavigationEndEvent.create(navigation));
        throw createUnresolvedinstructionsError(instructions);
    }
    cancelNavigation(navigation, coordinator) {
        coordinator.cancel();
        this.ea.publish(RouterNavigationCancelEvent.eventName, RouterNavigationCancelEvent.create(navigation));
        this.ea.publish(RouterNavigationEndEvent.eventName, RouterNavigationEndEvent.create(navigation));
    }
    appendInstructions(instructions, scope = null) {
        if (scope === null) {
            scope = this.rootScope.scope;
        }
        for (const instruction of instructions) {
            if (instruction.scope === null) {
                instruction.scope = scope;
            }
        }
        let coordinator = null;
        for (let i = this.coordinators.length - 1; i >= 0; i--) {
            if (!this.coordinators[i].completed) {
                coordinator = this.coordinators[i];
                break;
            }
        }
        if (coordinator === null) {
            if (!this.loadedFirst) {
                this.appendedInstructions.push(...instructions);
            }
            else {
                throw Error('Router failed to append routing instructions to coordinator');
            }
        }
        coordinator?.enqueueAppendedInstructions(instructions);
    }
    async updateNavigation(navigation) {
        this.rootScope.scope.reparentRoutingInstructions();
        const instructions = this.rootScope.scope.getRoutingInstructions(navigation.timestamp);
        let { matchedInstructions } = this.rootScope.scope.matchEndpoints(instructions, [], true);
        let guard = 100;
        while (matchedInstructions.length > 0) {
            if (guard-- === 0) {
                throw new Error('Router failed to find viewport when updating viewer paths.');
            }
            matchedInstructions = matchedInstructions.map(instruction => {
                const { matchedInstructions } = instruction.endpoint.instance.scope.matchEndpoints(instruction.nextScopeInstructions ?? [], [], true);
                return matchedInstructions;
            }).flat();
        }
        if (navigation.timestamp >= (this.activeNavigation?.timestamp ?? 0)) {
            this.activeNavigation = navigation;
            this.activeComponents = instructions;
        }
        let state = await RoutingHook.invokeTransformToUrl(instructions, navigation);
        if (typeof state !== 'string') {
            state = RoutingInstruction.stringify(this, state, false, true);
        }
        state = await RoutingHook.invokeTransformToUrl(state, navigation);
        if (navigation.query == null && navigation.parameters != null) {
            const search = new URLSearchParams();
            for (let [key, values] of Object.entries(navigation.parameters)) {
                key = encodeURIComponent(key);
                if (!Array.isArray(values)) {
                    values = [values];
                }
                for (const value of values) {
                    search.append(key, encodeURIComponent(value));
                }
            }
            navigation.query = search.toString();
        }
        let basePath = `${this.configuration.options.basePath}/`;
        if (basePath === null || (state !== '' && state[0] === '/') ||
            this.configuration.options.useUrlFragmentHash) {
            basePath = '';
        }
        const query = ((navigation.query?.length ?? 0) > 0 ? "?" + navigation.query : '');
        const fragment = ((navigation.fragment?.length ?? 0) > 0 ? "#" + navigation.fragment : '');
        navigation.path = basePath + state + query + fragment;
        const fullViewportStates = [RoutingInstruction.create(RoutingInstruction.clear(this))];
        fullViewportStates.push(...RoutingInstruction.clone(instructions, this.statefulHistory));
        navigation.fullStateInstruction = fullViewportStates;
        if ((navigation.title ?? null) === null) {
            const title = await Title.getTitle(instructions, navigation, this.configuration.options.title);
            if (title !== null) {
                navigation.title = title;
            }
        }
        return Promise.resolve();
    }
    extractFragment(instructions, options) {
        if (typeof instructions === 'string' && options.fragment == null) {
            const [path, fragment] = instructions.split('#');
            instructions = path;
            options.fragment = fragment;
        }
        return instructions;
    }
    extractQuery(instructions, options) {
        if (typeof instructions === 'string' && options.query == null) {
            const [path, search] = instructions.split('?');
            instructions = path;
            options.query = search;
        }
        if (typeof options.parameters === 'string' && options.query == null) {
            options.query = options.parameters;
            options.parameters = void 0;
        }
        if (typeof (options.query) === 'string' && options.query.length > 0) {
            options.parameters ?? (options.parameters = {});
            const searchParams = new URLSearchParams(options.query);
            searchParams.forEach((value, key) => {
                key = decodeURIComponent(key);
                value = decodeURIComponent(value);
                if (key in options.parameters) {
                    if (!Array.isArray(options.parameters[key])) {
                        options.parameters[key] = [options.parameters[key]];
                    }
                    options.parameters[key].push(value);
                }
                else {
                    options.parameters[key] = value;
                }
            });
        }
        return instructions;
    }
}
Router.closestEndpointKey = kernel.Protocol.annotation.keyFor('closest-endpoint');
function createUnresolvedinstructionsError(remainingInstructions) {
    const error = new Error(`${remainingInstructions.length} remaining instructions after 100 iterations; there is likely an infinite loop.`);
    error.remainingInstructions = remainingInstructions;
    console.log(error, error.remainingInstructions);
    return error;
}
class RouterEvent {
    constructor(eventName) {
        this.eventName = eventName;
    }
}
class RouterStartEvent extends RouterEvent {
    static create() {
        return new RouterStartEvent(this.eventName);
    }
}
RouterStartEvent.eventName = 'au:router:router-start';
class RouterStopEvent extends RouterEvent {
    static create() {
        return new RouterStopEvent(this.eventName);
    }
}
RouterStopEvent.eventName = 'au:router:router-stop';
class RouterNavigationEvent {
    constructor(eventName, navigation) {
        this.eventName = eventName;
        this.navigation = navigation;
    }
}
class RouterNavigationStartEvent extends RouterNavigationEvent {
    static create(navigation) {
        return new RouterNavigationStartEvent(this.eventName, navigation);
    }
}
RouterNavigationStartEvent.eventName = 'au:router:navigation-start';
class RouterNavigationEndEvent extends RouterNavigationEvent {
    static create(navigation) {
        return new RouterNavigationEndEvent(this.eventName, navigation);
    }
}
RouterNavigationEndEvent.eventName = 'au:router:navigation-end';
class RouterNavigationCancelEvent extends RouterNavigationEvent {
    static create(navigation) {
        return new RouterNavigationCancelEvent(this.eventName, navigation);
    }
}
RouterNavigationCancelEvent.eventName = 'au:router:navigation-cancel';
class RouterNavigationCompleteEvent extends RouterNavigationEvent {
    static create(navigation) {
        return new RouterNavigationCompleteEvent(this.eventName, navigation);
    }
}
RouterNavigationCompleteEvent.eventName = 'au:router:navigation-complete';
class RouterNavigationErrorEvent extends RouterNavigationEvent {
    static create(navigation) {
        return new RouterNavigationErrorEvent(this.eventName, navigation);
    }
}
RouterNavigationErrorEvent.eventName = 'au:router:navigation-error';

const ILinkHandler = kernel.DI.createInterface('ILinkHandler', x => x.singleton(exports.LinkHandler));
exports.LinkHandler = class LinkHandler {
    constructor(window, router) {
        this.window = window;
        this.router = router;
    }
    handleEvent(e) {
        this.handleClick(e);
    }
    handleClick(event) {
        if (event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }
        const target = event.currentTarget;
        if (target.hasAttribute('external')) {
            return;
        }
        const targetWindow = target.getAttribute('target') ?? '';
        if (targetWindow.length > 0 && targetWindow !== this.window.name && targetWindow !== '_self') {
            return;
        }
        const loadAttr = runtimeHtml.CustomAttribute.for(target, 'load');
        const load = loadAttr !== void 0 ? loadAttr.viewModel.value : null;
        const href = this.router.configuration.options.useHref && target.hasAttribute('href') ? target.getAttribute('href') : null;
        if ((load === null || load.length === 0) && (href === null || href.length === 0)) {
            return;
        }
        event.preventDefault();
        let instruction = load ?? href ?? '';
        if (typeof instruction === 'string' && instruction.startsWith('#')) {
            instruction = instruction.slice(1);
            if (!instruction.startsWith('/')) {
                instruction = `/${instruction}`;
            }
        }
        this.router.load(instruction, { origin: target }).catch(error => { throw error; });
    }
};
exports.LinkHandler = __decorate([
    __param(0, runtimeHtml.IWindow),
    __param(1, IRouter)
], exports.LinkHandler);

exports.ReloadBehavior = void 0;
(function (ReloadBehavior) {
    ReloadBehavior["default"] = "default";
    ReloadBehavior["disallow"] = "disallow";
    ReloadBehavior["reload"] = "reload";
    ReloadBehavior["refresh"] = "refresh";
})(exports.ReloadBehavior || (exports.ReloadBehavior = {}));

function route(configOrPath) {
    return function (target) {
        return Route.configure(configOrPath, target);
    };
}

function getValueOrAttribute(name, value, useValue, element, doExistCheck = false) {
    if (doExistCheck) {
        return value === "";
    }
    if (useValue) {
        return value;
    }
    const attribute = element.getAttribute(name) ?? '';
    return attribute.length > 0 ? attribute : value;
}
function waitForRouterStart(router, ea) {
    if (router.isActive) {
        return;
    }
    return new Promise((resolve) => {
        const subscription = ea.subscribe(RouterStartEvent.eventName, () => {
            resolve();
            subscription.dispose();
        });
    });
}
function getConsideredActiveInstructions(router, controller, element, value) {
    let activeInstructions = runtimeHtml.CustomAttribute
        .for(element, 'considered-active')?.viewModel?.value;
    if (activeInstructions === void 0) {
        activeInstructions = value;
    }
    const created = router.applyLoadOptions(activeInstructions, { context: controller });
    const instructions = RoutingInstruction.from(router, created.instructions);
    for (const instruction of instructions) {
        if (instruction.scope === null) {
            instruction.scope = created.scope;
        }
    }
    return instructions;
}
function getLoadIndicator(element) {
    let indicator = element.parentElement;
    while (indicator != null) {
        if (indicator.tagName === 'AU-VIEWPORT') {
            indicator = null;
            break;
        }
        if (indicator.hasAttribute('load-active')) {
            break;
        }
        indicator = indicator.parentElement;
    }
    indicator ?? (indicator = element);
    return indicator;
}

const ParentViewport = runtimeHtml.CustomElement.createInjectable();
exports.ViewportCustomElement = class ViewportCustomElement {
    constructor(router, element, container, ea, parentViewport, instruction) {
        this.router = router;
        this.element = element;
        this.container = container;
        this.ea = ea;
        this.parentViewport = parentViewport;
        this.instruction = instruction;
        this.name = 'default';
        this.usedBy = '';
        this.default = '';
        this.fallback = '';
        this.fallbackAction = '';
        this.noScope = false;
        this.noLink = false;
        this.noTitle = false;
        this.noHistory = false;
        this.stateful = false;
        this.endpoint = null;
        this.pendingChildren = [];
        this.pendingPromise = null;
        this.isBound = false;
    }
    hydrated(controller) {
        this.controller = controller;
        this.container = controller.container;
        const hasDefault = this.instruction.props.filter((instr) => instr.to === 'default').length > 0;
        if (hasDefault && this.parentViewport != null) {
            this.parentViewport.pendingChildren.push(this);
            if (this.parentViewport.pendingPromise === null) {
                this.parentViewport.pendingPromise = new OpenPromise();
            }
        }
        return Runner.run(null, () => waitForRouterStart(this.router, this.ea), () => {
            if (this.router.isRestrictedNavigation) {
                this.connect();
            }
        });
    }
    binding(initiator, _parent) {
        this.isBound = true;
        return Runner.run(null, () => waitForRouterStart(this.router, this.ea), () => {
            if (!this.router.isRestrictedNavigation) {
                this.connect();
            }
        }, () => {
            if (this.endpoint?.activeResolve != null) {
                this.endpoint.activeResolve();
                this.endpoint.activeResolve = null;
            }
        }, () => {
            if (this.endpoint !== null && this.endpoint.getNextContent() === null) {
                return this.endpoint.activate(null, initiator, this.controller, void 0)?.asValue;
            }
        });
    }
    detaching(initiator, parent) {
        if (this.endpoint !== null) {
            this.isBound = false;
            return this.endpoint.deactivate(null, initiator, parent);
        }
    }
    unbinding(_initiator, _parent) {
        if (this.endpoint !== null) {
            return this.disconnect(null);
        }
    }
    dispose() {
        this.endpoint?.dispose();
        this.endpoint = null;
    }
    connect() {
        const { isBound, element } = this;
        const name = getValueOrAttribute('name', this.name, isBound, element);
        const options = {};
        options.scope = !getValueOrAttribute('no-scope', this.noScope, false, element, true);
        options.usedBy = getValueOrAttribute('used-by', this.usedBy, isBound, element);
        options.default = getValueOrAttribute('default', this.default, isBound, element);
        options.fallback = getValueOrAttribute('fallback', this.fallback, isBound, element);
        options.fallbackAction = getValueOrAttribute('fallback-action', this.fallbackAction, isBound, element);
        options.noLink = getValueOrAttribute('no-link', this.noLink, isBound, element, true);
        options.noTitle = getValueOrAttribute('no-title', this.noTitle, isBound, element, true);
        options.noHistory = getValueOrAttribute('no-history', this.noHistory, isBound, element, true);
        options.stateful = getValueOrAttribute('stateful', this.stateful, isBound, element, true);
        Object
            .keys(options)
            .forEach(key => {
            if (options[key] === undefined) {
                delete options[key];
            }
        });
        this.endpoint = this.router.connectEndpoint(this.endpoint, 'Viewport', this, name, options);
        const parentViewport = this.parentViewport;
        if (parentViewport != null) {
            arrayRemove(parentViewport.pendingChildren, child => child === this);
            if (parentViewport.pendingChildren.length === 0 && parentViewport.pendingPromise !== null) {
                parentViewport.pendingPromise.resolve();
                parentViewport.pendingPromise = null;
            }
        }
    }
    disconnect(step) {
        if (this.endpoint !== null) {
            this.router.disconnectEndpoint(step, this.endpoint, this);
        }
    }
    setActivity(state, active) {
        const prefix = this.router.configuration.options.indicators.viewportNavigating;
        if (typeof state === 'string') {
            this.element.classList.toggle(state, active);
        }
        else {
            for (const key in state) {
                this.element.classList.toggle(`${prefix}-${key}`, active && state[key]);
            }
        }
    }
};
__decorate([
    runtimeHtml.bindable
], exports.ViewportCustomElement.prototype, "name", void 0);
__decorate([
    runtimeHtml.bindable
], exports.ViewportCustomElement.prototype, "usedBy", void 0);
__decorate([
    runtimeHtml.bindable
], exports.ViewportCustomElement.prototype, "default", void 0);
__decorate([
    runtimeHtml.bindable
], exports.ViewportCustomElement.prototype, "fallback", void 0);
__decorate([
    runtimeHtml.bindable
], exports.ViewportCustomElement.prototype, "fallbackAction", void 0);
__decorate([
    runtimeHtml.bindable
], exports.ViewportCustomElement.prototype, "noScope", void 0);
__decorate([
    runtimeHtml.bindable
], exports.ViewportCustomElement.prototype, "noLink", void 0);
__decorate([
    runtimeHtml.bindable
], exports.ViewportCustomElement.prototype, "noTitle", void 0);
__decorate([
    runtimeHtml.bindable
], exports.ViewportCustomElement.prototype, "noHistory", void 0);
__decorate([
    runtimeHtml.bindable
], exports.ViewportCustomElement.prototype, "stateful", void 0);
exports.ViewportCustomElement = __decorate([
    runtimeHtml.customElement({
        name: 'au-viewport',
        injectable: ParentViewport
    }),
    __param(0, IRouter),
    __param(1, runtimeHtml.INode),
    __param(2, kernel.IContainer),
    __param(3, kernel.IEventAggregator),
    __param(4, ParentViewport),
    __param(5, runtimeHtml.IInstruction)
], exports.ViewportCustomElement);

const ParentViewportScope = runtimeHtml.CustomElement.createInjectable();
exports.ViewportScopeCustomElement = class ViewportScopeCustomElement {
    constructor(router, element, container, parent, parentController) {
        this.router = router;
        this.element = element;
        this.container = container;
        this.parent = parent;
        this.parentController = parentController;
        this.name = 'default';
        this.catches = '';
        this.collection = false;
        this.source = null;
        this.viewportScope = null;
        this.isBound = false;
    }
    hydrated(controller) {
        this.controller = controller;
    }
    bound(_initiator, _parent) {
        this.isBound = true;
        this.$controller.scope = this.parentController.scope;
        this.connect();
        if (this.viewportScope !== null) {
            this.viewportScope.binding();
        }
    }
    unbinding(_initiator, _parent) {
        if (this.viewportScope !== null) {
            this.viewportScope.unbinding();
        }
        return Promise.resolve();
    }
    connect() {
        if (this.router.rootScope === null) {
            return;
        }
        const name = this.getAttribute('name', this.name);
        const options = {};
        let value = this.getAttribute('catches', this.catches);
        if (value !== void 0) {
            options.catches = value;
        }
        value = this.getAttribute('collection', this.collection, true);
        if (value !== void 0) {
            options.collection = value;
        }
        options.source = this.source || null;
        this.viewportScope = this.router.connectEndpoint(this.viewportScope, 'ViewportScope', this, name, options);
    }
    disconnect() {
        if (this.viewportScope) {
            this.router.disconnectEndpoint(null, this.viewportScope, this);
        }
        this.viewportScope = null;
    }
    getAttribute(key, value, checkExists = false) {
        if (this.isBound) {
            return value;
        }
        else {
            if (this.element.hasAttribute(key)) {
                if (checkExists) {
                    return true;
                }
                else {
                    value = this.element.getAttribute(key);
                    if (value.length > 0) {
                        return value;
                    }
                }
            }
        }
        return void 0;
    }
};
__decorate([
    runtimeHtml.bindable
], exports.ViewportScopeCustomElement.prototype, "name", void 0);
__decorate([
    runtimeHtml.bindable
], exports.ViewportScopeCustomElement.prototype, "catches", void 0);
__decorate([
    runtimeHtml.bindable
], exports.ViewportScopeCustomElement.prototype, "collection", void 0);
__decorate([
    runtimeHtml.bindable
], exports.ViewportScopeCustomElement.prototype, "source", void 0);
exports.ViewportScopeCustomElement = __decorate([
    runtimeHtml.customElement({
        name: 'au-viewport-scope',
        template: '<template></template>',
        containerless: false,
        injectable: ParentViewportScope
    }),
    __param(0, IRouter),
    __param(1, runtimeHtml.INode),
    __param(2, kernel.IContainer),
    __param(3, ParentViewportScope),
    __param(4, runtimeHtml.IController)
], exports.ViewportScopeCustomElement);

exports.LoadCustomAttribute = class LoadCustomAttribute {
    constructor(element, router, linkHandler, ea) {
        this.element = element;
        this.router = router;
        this.linkHandler = linkHandler;
        this.ea = ea;
        this._separateProperties = false;
        this.hasHref = null;
        this.navigationEndHandler = (_navigation) => {
            void this.updateActive();
        };
        this.activeClass = this.router.configuration.options.indicators.loadActive;
    }
    binding() {
        if (this.value == null) {
            this._separateProperties = true;
        }
        this.element.addEventListener('click', this.linkHandler);
        this.updateValue();
        void this.updateActive();
        this.routerNavigationSubscription = this.ea.subscribe(RouterNavigationEndEvent.eventName, this.navigationEndHandler);
    }
    unbinding() {
        this.element.removeEventListener('click', this.linkHandler);
        this.routerNavigationSubscription.dispose();
    }
    valueChanged(_newValue) {
        this.updateValue();
        void this.updateActive();
    }
    updateValue() {
        if (this._separateProperties) {
            this.value = {
                component: this.component,
                parameters: this.parameters,
                viewport: this.viewport,
                id: this.id,
            };
        }
        if (this.hasHref === null) {
            this.hasHref = this.element.hasAttribute('href');
        }
        if (!this.hasHref) {
            let value = this.value;
            if (typeof value !== 'string') {
                const instruction = RoutingInstruction.from(this.router, value).shift();
                const found = this._findRoute(value);
                if (found.foundConfiguration) {
                    instruction.route = found.matching;
                }
                value = RoutingInstruction.stringify(this.router, [instruction]);
            }
            const { scope, instruction } = RoutingScope.for(this.element, value);
            const scopePath = scope?.path ?? '';
            value = `${scopePath}${instruction ?? ''}`;
            if (this.router.configuration.options.useUrlFragmentHash && !value.startsWith('#')) {
                value = `#/${value}`;
            }
            this.element.setAttribute('href', value);
        }
    }
    async updateActive() {
        const controller = runtimeHtml.CustomAttribute.for(this.element, 'load').parent;
        const routeValue = typeof this.value === 'string' ? { id: this.value, path: this.value } : this.value;
        const found = this._findRoute(routeValue);
        const instructions = found.foundConfiguration
            ? found.instructions
            : getConsideredActiveInstructions(this.router, controller, this.element, this.value);
        const element = getLoadIndicator(this.element);
        element.classList.toggle(this.activeClass, this.router.checkActive(instructions, { context: controller }));
    }
    _findRoute(value) {
        if (typeof value === 'string') {
            return new FoundRoute();
        }
        const scope = RoutingScope.for(this.element).scope ?? this.router.rootScope.scope;
        if (value.id != null) {
            return scope.findMatchingRoute(value.id, value.parameters ?? {});
        }
        const path = value.path;
        if (path != null) {
            return scope.findMatchingRoute(path, value.parameters ?? {});
        }
        return new FoundRoute();
    }
};
__decorate([
    runtimeHtml.bindable({ mode: 2 })
], exports.LoadCustomAttribute.prototype, "value", void 0);
__decorate([
    runtimeHtml.bindable
], exports.LoadCustomAttribute.prototype, "component", void 0);
__decorate([
    runtimeHtml.bindable
], exports.LoadCustomAttribute.prototype, "parameters", void 0);
__decorate([
    runtimeHtml.bindable
], exports.LoadCustomAttribute.prototype, "viewport", void 0);
__decorate([
    runtimeHtml.bindable
], exports.LoadCustomAttribute.prototype, "id", void 0);
exports.LoadCustomAttribute = __decorate([
    runtimeHtml.customAttribute('load'),
    __param(0, runtimeHtml.INode),
    __param(1, IRouter),
    __param(2, ILinkHandler),
    __param(3, kernel.IEventAggregator)
], exports.LoadCustomAttribute);

exports.HrefCustomAttribute = class HrefCustomAttribute {
    constructor(element, router, linkHandler, ea) {
        this.element = element;
        this.router = router;
        this.linkHandler = linkHandler;
        this.ea = ea;
        this.navigationEndHandler = (_navigation) => {
            this.updateActive();
        };
        this.activeClass = this.router.configuration.options.indicators.loadActive;
    }
    binding() {
        if (this.router.configuration.options.useHref && !this.hasLoad() && !this.element.hasAttribute('external')) {
            this.element.addEventListener('click', this.linkHandler);
            this.routerNavigationSubscription = this.ea.subscribe(RouterNavigationEndEvent.eventName, this.navigationEndHandler);
        }
        this.updateValue();
        this.updateActive();
    }
    unbinding() {
        this.element.removeEventListener('click', this.linkHandler);
        this.routerNavigationSubscription?.dispose();
    }
    valueChanged() {
        this.updateValue();
        this.updateActive();
    }
    updateValue() {
        this.element.setAttribute('href', this.value);
    }
    updateActive() {
        if (this.router.configuration.options.useHref && !this.hasLoad() && !this.element.hasAttribute('external')) {
            const controller = runtimeHtml.CustomAttribute.for(this.element, 'href').parent;
            const instructions = getConsideredActiveInstructions(this.router, controller, this.element, this.value);
            const element = getLoadIndicator(this.element);
            element.classList.toggle(this.activeClass, this.router.checkActive(instructions, { context: controller }));
        }
    }
    hasLoad() {
        const parent = this.$controller.parent;
        const siblings = parent.children;
        return siblings?.some(c => c.vmKind === 1 && c.viewModel instanceof exports.LoadCustomAttribute) ?? false;
    }
};
__decorate([
    runtimeHtml.bindable({ mode: 2 })
], exports.HrefCustomAttribute.prototype, "value", void 0);
exports.HrefCustomAttribute = __decorate([
    runtimeHtml.customAttribute({
        name: 'href',
        noMultiBindings: true
    }),
    __param(0, runtimeHtml.INode),
    __param(1, IRouter),
    __param(2, ILinkHandler),
    __param(3, kernel.IEventAggregator)
], exports.HrefCustomAttribute);

exports.ConsideredActiveCustomAttribute = class ConsideredActiveCustomAttribute {
};
__decorate([
    runtimeHtml.bindable({ mode: 2 })
], exports.ConsideredActiveCustomAttribute.prototype, "value", void 0);
exports.ConsideredActiveCustomAttribute = __decorate([
    runtimeHtml.customAttribute('considered-active')
], exports.ConsideredActiveCustomAttribute);

const IRouterConfiguration = kernel.DI.createInterface('IRouterConfiguration', x => x.singleton(RouterConfiguration));
const RouterRegistration = IRouter;
const DefaultComponents = [
    RouterRegistration,
];
const ViewportCustomElementRegistration = exports.ViewportCustomElement;
const ViewportScopeCustomElementRegistration = exports.ViewportScopeCustomElement;
const LoadCustomAttributeRegistration = exports.LoadCustomAttribute;
const HrefCustomAttributeRegistration = exports.HrefCustomAttribute;
const DefaultResources = [
    exports.ViewportCustomElement,
    exports.ViewportScopeCustomElement,
    exports.LoadCustomAttribute,
    exports.HrefCustomAttribute,
    exports.ConsideredActiveCustomAttribute,
];
class RouterConfiguration {
    static register(container) {
        const _this = container.get(IRouterConfiguration);
        _this.options = RouterConfiguration.options;
        _this.options.setRouterConfiguration(_this);
        RouterConfiguration.options = RouterOptions.create();
        return container.register(...DefaultComponents, ...DefaultResources, runtimeHtml.AppTask.activating(IRouter, RouterConfiguration.configurationCall), runtimeHtml.AppTask.activated(IRouter, (router) => router.initialLoad()), runtimeHtml.AppTask.deactivated(IRouter, (router) => router.stop()));
    }
    static customize(config) {
        if (config === undefined) {
            RouterConfiguration.options = RouterOptions.create();
            RouterConfiguration.configurationCall = (router) => {
                router.start();
            };
        }
        else if (config instanceof Function) {
            RouterConfiguration.configurationCall = config;
        }
        else {
            RouterConfiguration.options = RouterOptions.create();
            RouterConfiguration.options.apply(config);
        }
        return RouterConfiguration;
    }
    static createContainer() {
        return this.register(kernel.DI.createContainer());
    }
    static for(context) {
        if (context instanceof Router) {
            return context.configuration;
        }
        return context.get(IRouterConfiguration);
    }
    apply(options, firstResetDefaults = false) {
        if (firstResetDefaults) {
            this.options = RouterOptions.create();
        }
        this.options.apply(options);
    }
    addHook(hookFunction, options) {
        return RoutingHook.add(hookFunction, options);
    }
    removeHook(id) {
        return RoutingHook.remove(id);
    }
    removeAllHooks() {
        return RoutingHook.removeAll();
    }
}
RouterConfiguration.options = RouterOptions.create();
RouterConfiguration.configurationCall = (router) => {
    router.start();
};

exports.ConfigurableRoute = ConfigurableRoute;
exports.DefaultComponents = DefaultComponents;
exports.DefaultResources = DefaultResources;
exports.Endpoint = Endpoint$1;
exports.EndpointContent = EndpointContent;
exports.FoundRoute = FoundRoute;
exports.HrefCustomAttributeRegistration = HrefCustomAttributeRegistration;
exports.ILinkHandler = ILinkHandler;
exports.IRouter = IRouter;
exports.IRouterConfiguration = IRouterConfiguration;
exports.InstructionParameters = InstructionParameters;
exports.LoadCustomAttributeRegistration = LoadCustomAttributeRegistration;
exports.Navigation = Navigation;
exports.NavigationCoordinator = NavigationCoordinator;
exports.NavigationFlags = NavigationFlags;
exports.RecognizedRoute = RecognizedRoute;
exports.RecognizerEndpoint = Endpoint;
exports.Route = Route;
exports.RouteRecognizer = RouteRecognizer;
exports.Router = Router;
exports.RouterConfiguration = RouterConfiguration;
exports.RouterNavigationCancelEvent = RouterNavigationCancelEvent;
exports.RouterNavigationCompleteEvent = RouterNavigationCompleteEvent;
exports.RouterNavigationEndEvent = RouterNavigationEndEvent;
exports.RouterNavigationErrorEvent = RouterNavigationErrorEvent;
exports.RouterNavigationStartEvent = RouterNavigationStartEvent;
exports.RouterOptions = RouterOptions;
exports.RouterRegistration = RouterRegistration;
exports.RouterStartEvent = RouterStartEvent;
exports.RouterStopEvent = RouterStopEvent;
exports.Routes = Routes;
exports.RoutingHook = RoutingHook;
exports.RoutingInstruction = RoutingInstruction;
exports.RoutingScope = RoutingScope;
exports.Runner = Runner;
exports.Step = Step;
exports.Viewport = Viewport;
exports.ViewportContent = ViewportContent;
exports.ViewportCustomElementRegistration = ViewportCustomElementRegistration;
exports.ViewportOptions = ViewportOptions;
exports.ViewportScope = ViewportScope;
exports.ViewportScopeContent = ViewportScopeContent;
exports.ViewportScopeCustomElementRegistration = ViewportScopeCustomElementRegistration;
exports.route = route;
exports.routes = routes;
//# sourceMappingURL=index.dev.cjs.map
