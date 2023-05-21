import { Protocol as t, IEventAggregator as i, IContainer as e, DI as n, Registration as s } from "../kernel/dist/native-modules/index.mjs";

import { CustomElement as r, isCustomElementViewModel as o, Controller as h, IPlatform as u, IWindow as a, IHistory as l, ILocation as c, IAppRoot as f, CustomAttribute as d, customElement as p, bindable as g, INode as v, IInstruction as m, IController as w, customAttribute as R, AppTask as y } from "../runtime-html/dist/native-modules/index.mjs";

import { Metadata as I } from "../metadata/dist/native-modules/index.mjs";

import { RouteRecognizer as E, ConfigurableRoute as C, RecognizedRoute as S, Endpoint as N } from "../route-recognizer/dist/native-modules/index.mjs";

class Endpoint$1 {
    constructor(t, i, e, n = {}) {
        this.router = t;
        this.name = i;
        this.connectedCE = e;
        this.options = n;
        this.contents = [];
        this.transitionAction = "";
        this.path = null;
    }
    getContent() {
        return this.contents[0];
    }
    getNextContent() {
        return this.contents.length > 1 ? this.contents[this.contents.length - 1] : null;
    }
    getTimeContent(t = Infinity) {
        return this.getContent();
    }
    getNavigationContent(t) {
        if (t instanceof NavigationCoordinator) {
            t = t.navigation;
        }
        if (t instanceof Navigation) {
            return this.contents.find((i => i.navigation === t)) ?? null;
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
    setNextContent(t, i) {
        throw new Error(`Method 'setNextContent' needs to be implemented in all endpoints!`);
    }
    setConnectedCE(t, i) {
        throw new Error(`Method 'setConnectedCE' needs to be implemented in all endpoints!`);
    }
    transition(t) {
        throw new Error(`Method 'transition' needs to be implemented in all endpoints!`);
    }
    finalizeContentChange(t, i) {
        throw new Error(`Method 'finalizeContentChange' needs to be implemented in all endpoints!`);
    }
    cancelContentChange(t, i = null) {
        throw new Error(`Method 'cancelContentChange' needs to be implemented in all endpoints!`);
    }
    getRoutes() {
        throw new Error(`Method 'getRoutes' needs to be implemented in all endpoints!`);
    }
    getTitle(t) {
        throw new Error(`Method 'getTitle' needs to be implemented in all endpoints!`);
    }
    removeEndpoint(t, i) {
        this.contents.forEach((t => t.delete()));
        return true;
    }
    canUnload(t, i) {
        return true;
    }
    canLoad(t, i) {
        return true;
    }
    unload(t, i) {
        return;
    }
    load(t, i) {
        return;
    }
}

class EndpointContent {
    constructor(t, i, e, n, s = RoutingInstruction.create(""), r = Navigation.create({
        instruction: "",
        fullStateInstruction: ""
    })) {
        this.router = t;
        this.endpoint = i;
        this.instruction = s;
        this.navigation = r;
        this.completed = false;
        this.connectedScope = new RoutingScope(t, n, e, this);
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
    constructor(t = null, i = "", e = [], n = "", s = {}) {
        this.match = t;
        this.matching = i;
        this.instructions = e;
        this.remaining = n;
        this.params = s;
    }
    get foundConfiguration() {
        return this.match !== null;
    }
    get foundInstructions() {
        return this.instructions.some((t => !t.component.none));
    }
    get hasRemaining() {
        return this.instructions.some((t => t.hasNextScopeInstructions));
    }
}

function __decorate(t, i, e, n) {
    var s = arguments.length, r = s < 3 ? i : n === null ? n = Object.getOwnPropertyDescriptor(i, e) : n, o;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(t, i, e, n); else for (var h = t.length - 1; h >= 0; h--) if (o = t[h]) r = (s < 3 ? o(r) : s > 3 ? o(i, e, r) : o(i, e)) || r;
    return s > 3 && r && Object.defineProperty(i, e, r), r;
}

function __param(t, i) {
    return function(e, n) {
        i(e, n, t);
    };
}

class InstructionParser {
    static parse(t, i, e, n) {
        if (!i) {
            return {
                instructions: [],
                remaining: ""
            };
        }
        if (i.startsWith(t.sibling) && !InstructionParser.isAdd(t, i)) {
            throw new Error(`Instruction parser error: Unnecessary siblings separator ${t.sibling} in beginning of instruction part "${i}".`);
        }
        const s = [];
        let r = 1e3;
        while (i.length && r) {
            r--;
            if (i.startsWith(t.scope)) {
                if (s.length === 0) {
                    throw new Error(`Instruction parser error: Children without parent in instruction part "(${i}" is not allowed.`);
                }
                n = false;
                i = i.slice(t.scope.length);
                const r = i.startsWith(t.groupStart);
                if (r) {
                    i = i.slice(t.groupStart.length);
                    e = true;
                }
                const {instructions: o, remaining: h} = InstructionParser.parse(t, i, r, false);
                s[s.length - 1].nextScopeInstructions = o;
                i = h;
            } else if (i.startsWith(t.groupStart)) {
                i = i.slice(t.groupStart.length);
                const {instructions: e, remaining: r} = InstructionParser.parse(t, i, true, n);
                s.push(...e);
                i = r;
            } else if (i.startsWith(t.groupEnd)) {
                if (e) {
                    i = i.slice(t.groupEnd.length);
                }
                let n = 0;
                const r = i.length;
                for (;n < r; n++) {
                    if (i.slice(n, n + t.sibling.length) === t.sibling) {
                        return {
                            instructions: s,
                            remaining: i
                        };
                    }
                    if (i.slice(n, n + t.groupEnd.length) !== t.groupEnd) {
                        if (s.length > 1) {
                            throw new Error(`Instruction parser error: Children below scope ${t.groupStart}${t.groupEnd} in instruction part "(${i}" is not allowed.`);
                        } else {
                            i = i.slice(n);
                            break;
                        }
                    }
                }
                if (n >= r) {
                    return {
                        instructions: s,
                        remaining: i
                    };
                }
            } else if (i.startsWith(t.sibling) && !InstructionParser.isAdd(t, i)) {
                if (!e) {
                    return {
                        instructions: s,
                        remaining: i
                    };
                }
                i = i.slice(t.sibling.length);
            } else {
                const {instruction: e, remaining: n} = InstructionParser.parseOne(t, i);
                s.push(e);
                i = n;
            }
        }
        return {
            instructions: s,
            remaining: i
        };
    }
    static isAdd(t, i) {
        return i === t.add || i.startsWith(`${t.add}${t.viewport}`);
    }
    static parseOne(t, i) {
        const e = [ t.parameters, t.viewport, t.noScope, t.groupEnd, t.scope, t.sibling ];
        let n = void 0;
        let s = void 0;
        let r = void 0;
        let o = true;
        let h;
        let u;
        const a = i;
        const l = [ t.add, t.clear ];
        for (const s of l) {
            if (i === s) {
                n = i;
                i = "";
                e.shift();
                e.shift();
                h = t.viewport;
                break;
            }
        }
        if (n === void 0) {
            for (const s of l) {
                if (i.startsWith(`${s}${t.viewport}`)) {
                    n = s;
                    i = i.slice(`${s}${t.viewport}`.length);
                    e.shift();
                    e.shift();
                    h = t.viewport;
                    break;
                }
            }
        }
        if (n === void 0) {
            ({token: h, pos: u} = InstructionParser.findNextToken(i, e));
            n = u !== -1 ? i.slice(0, u) : i;
            i = u !== -1 ? i.slice(u + h.length) : "";
            e.shift();
            if (h === t.parameters) {
                ({token: h, pos: u} = InstructionParser.findNextToken(i, [ t.parametersEnd ]));
                s = i.slice(0, u);
                i = i.slice(u + h.length);
                ({token: h} = InstructionParser.findNextToken(i, e));
                i = i.slice(h.length);
            }
            e.shift();
        }
        if (h === t.viewport) {
            ({token: h, pos: u} = InstructionParser.findNextToken(i, e));
            r = u !== -1 ? i.slice(0, u) : i;
            i = u !== -1 ? i.slice(u + h.length) : "";
        }
        e.shift();
        if (h === t.noScope) {
            o = false;
        }
        if (h === t.groupEnd || h === t.scope || h === t.sibling) {
            i = `${h}${i}`;
        }
        if ((n ?? "") === "") {
            throw new Error(`Instruction parser error: No component specified in instruction part "${i}".`);
        }
        const c = RoutingInstruction.create(n, r, s, o);
        c.unparsed = a;
        return {
            instruction: c,
            remaining: i
        };
    }
    static findNextToken(t, i) {
        const e = {};
        for (const n of i) {
            const i = t.indexOf(n);
            if (i > -1) {
                e[n] = t.indexOf(n);
            }
        }
        const n = Math.min(...Object.values(e));
        for (const t in e) {
            if (e[t] === n) {
                return {
                    token: t,
                    pos: n
                };
            }
        }
        return {
            token: "",
            pos: -1
        };
    }
}

class TitleOptions {
    constructor(t = "${componentTitles}${appTitleSeparator}Aurelia", i = " | ", e = "top-down", n = " > ", s = true, r = "app-", o) {
        this.appTitle = t;
        this.appTitleSeparator = i;
        this.componentTitleOrder = e;
        this.componentTitleSeparator = n;
        this.useComponentNames = s;
        this.componentPrefix = r;
        this.transformTitle = o;
    }
    static create(t = {}) {
        t = typeof t === "string" ? {
            appTitle: t
        } : t;
        return new TitleOptions(t.appTitle, t.appTitleSeparator, t.componentTitleOrder, t.componentTitleSeparator, t.useComponentNames, t.componentPrefix, t.transformTitle);
    }
    static for(t) {
        return RouterOptions.for(t).title;
    }
    apply(t = {}) {
        t = typeof t === "string" ? {
            appTitle: t
        } : t;
        this.appTitle = t.appTitle ?? this.appTitle;
        this.appTitleSeparator = t.appTitleSeparator ?? this.appTitleSeparator;
        this.componentTitleOrder = t.componentTitleOrder ?? this.componentTitleOrder;
        this.componentTitleSeparator = t.componentTitleSeparator ?? this.componentTitleSeparator;
        this.useComponentNames = t.useComponentNames ?? this.useComponentNames;
        this.componentPrefix = t.componentPrefix ?? this.componentPrefix;
        this.transformTitle = "transformTitle" in t ? t.transformTitle : this.transformTitle;
    }
}

class Separators {
    constructor(t = "@", i = "+", e = "/", n = "(", s = ")", r = "!", o = "(", h = ")", u = ",", a = "=", l = "+", c = "-", f = ".") {
        this.viewport = t;
        this.sibling = i;
        this.scope = e;
        this.groupStart = n;
        this.groupEnd = s;
        this.noScope = r;
        this.parameters = o;
        this.parametersEnd = h;
        this.parameterSeparator = u;
        this.parameterKeySeparator = a;
        this.add = l;
        this.clear = c;
        this.action = f;
    }
    static create(t = {}) {
        return new Separators(t.viewport, t.sibling, t.scope, t.groupStart, t.groupEnd, t.noScope, t.parameters, t.parametersEnd, t.parameterSeparator, t.parameterKeySeparator, t.add, t.clear, t.action);
    }
    static for(t) {
        return RouterOptions.for(t).separators;
    }
    apply(t = {}) {
        this.viewport = t.viewport ?? this.viewport;
        this.sibling = t.sibling ?? this.sibling;
        this.scope = t.scope ?? this.scope;
        this.groupStart = t.groupStart ?? this.groupStart;
        this.groupEnd = t.groupEnd ?? this.groupEnd;
        this.noScope = t.noScope ?? this.noScope;
        this.parameters = t.parameters ?? this.parameters;
        this.parametersEnd = t.parametersEnd ?? this.parametersEnd;
        this.parameterSeparator = t.parameterSeparator ?? this.parameterSeparator;
        this.parameterKeySeparator = t.parameterKeySeparator ?? this.parameterKeySeparator;
        this.add = t.add ?? this.add;
        this.clear = t.clear ?? this.clear;
        this.action = t.action ?? this.action;
    }
}

class Indicators {
    constructor(t = "active", i = "navigating") {
        this.loadActive = t;
        this.viewportNavigating = i;
    }
    static create(t = {}) {
        return new Indicators(t.loadActive, t.viewportNavigating);
    }
    static for(t) {
        return RouterOptions.for(t).indicators;
    }
    apply(t = {}) {
        this.loadActive = t.loadActive ?? this.loadActive;
        this.viewportNavigating = t.viewportNavigating ?? this.viewportNavigating;
    }
}

class RouterOptions {
    constructor(t = Separators.create(), i = Indicators.create(), e = true, n = null, s = true, r = 0, o = true, h = true, u = true, a = TitleOptions.create(), l = [ "guardedUnload", "swapped", "completed" ], c = "attach-next-detach-current", f = "", d = "abort") {
        this.separators = t;
        this.indicators = i;
        this.useUrlFragmentHash = e;
        this.basePath = n;
        this.useHref = s;
        this.statefulHistoryLength = r;
        this.useDirectRouting = o;
        this.useConfiguredRoutes = h;
        this.additiveInstructionDefault = u;
        this.title = a;
        this.navigationSyncStates = l;
        this.swapOrder = c;
        this.fallback = f;
        this.fallbackAction = d;
        this.registrationHooks = [];
    }
    static create(t = {}) {
        return new RouterOptions(Separators.create(t.separators), Indicators.create(t.indicators), t.useUrlFragmentHash, t.basePath, t.useHref, t.statefulHistoryLength, t.useDirectRouting, t.useConfiguredRoutes, t.additiveInstructionDefault, TitleOptions.create(t.title), t.navigationSyncStates, t.swapOrder, t.fallback, t.fallbackAction);
    }
    static for(t) {
        if (t instanceof RouterConfiguration) {
            return t.options;
        }
        if (t instanceof Router) {
            t = t.configuration;
        } else {
            t = t.get(D);
        }
        return t.options;
    }
    apply(t) {
        t = t ?? {};
        this.separators.apply(t.separators);
        this.indicators.apply(t.indicators);
        this.useUrlFragmentHash = t.useUrlFragmentHash ?? this.useUrlFragmentHash;
        this.basePath = t.basePath ?? this.basePath;
        this.useHref = t.useHref ?? this.useHref;
        this.statefulHistoryLength = t.statefulHistoryLength ?? this.statefulHistoryLength;
        this.useDirectRouting = t.useDirectRouting ?? this.useDirectRouting;
        this.useConfiguredRoutes = t.useConfiguredRoutes ?? this.useConfiguredRoutes;
        this.additiveInstructionDefault = t.additiveInstructionDefault ?? this.additiveInstructionDefault;
        this.title.apply(t.title);
        this.navigationSyncStates = t.navigationSyncStates ?? this.navigationSyncStates;
        this.swapOrder = t.swapOrder ?? this.swapOrder;
        this.fallback = t.fallback ?? this.fallback;
        this.fallbackAction = t.fallbackAction ?? this.fallbackAction;
        if (Array.isArray(t.hooks)) {
            if (this.routerConfiguration !== void 0) {
                t.hooks.forEach((t => this.routerConfiguration.addHook(t.hook, t.options)));
            } else {
                this.registrationHooks = t.hooks;
            }
        }
    }
    setRouterConfiguration(t) {
        this.routerConfiguration = t;
        this.registrationHooks.forEach((t => this.routerConfiguration.addHook(t.hook, t.options)));
        this.registrationHooks.length = 0;
    }
}

var b;

(function(t) {
    t["none"] = "none";
    t["string"] = "string";
    t["array"] = "array";
    t["object"] = "object";
})(b || (b = {}));

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
    static create(t) {
        const i = new InstructionParameters;
        i.set(t);
        return i;
    }
    static parse(t, i, e = false) {
        if (i == null || i.length === 0) {
            return [];
        }
        const n = Separators.for(t);
        const s = n.parameterSeparator;
        const r = n.parameterKeySeparator;
        if (typeof i === "string") {
            const t = [];
            const n = i.split(s);
            for (const i of n) {
                let n;
                let s;
                [n, s] = i.split(r);
                if (s === void 0) {
                    s = e ? decodeURIComponent(n) : n;
                    n = void 0;
                } else if (e) {
                    n = decodeURIComponent(n);
                    s = decodeURIComponent(s);
                }
                t.push({
                    key: n,
                    value: s
                });
            }
            return t;
        }
        if (Array.isArray(i)) {
            return i.map((t => ({
                key: void 0,
                value: t
            })));
        }
        const o = Object.keys(i);
        o.sort();
        return o.map((t => ({
            key: t,
            value: i[t]
        })));
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
    static stringify(t, i, e = false) {
        if (!Array.isArray(i) || i.length === 0) {
            return "";
        }
        const n = Separators.for(t);
        return i.map((t => {
            const i = t.key !== void 0 && e ? encodeURIComponent(t.key) : t.key;
            const s = e ? encodeURIComponent(t.value) : t.value;
            return i !== void 0 && i !== s ? i + n.parameterKeySeparator + s : s;
        })).join(n.parameterSeparator);
    }
    static contains(t, i) {
        return Object.keys(i).every((e => i[e] === t[e]));
    }
    parameters(t) {
        return InstructionParameters.parse(t, this.typedParameters);
    }
    set(t) {
        this.parametersString = null;
        this.parametersList = null;
        this.parametersRecord = null;
        if (t == null || t === "") {
            this.parametersType = "none";
            t = null;
        } else if (typeof t === "string") {
            this.parametersType = "string";
            this.parametersString = t;
        } else if (Array.isArray(t)) {
            this.parametersType = "array";
            this.parametersList = t;
        } else {
            this.parametersType = "object";
            this.parametersRecord = t;
        }
    }
    get(t, i) {
        if (i === void 0) {
            return this.parameters(t);
        }
        const e = this.parameters(t).filter((t => t.key === i)).map((t => t.value));
        if (e.length === 0) {
            return;
        }
        return e.length === 1 ? e[0] : e;
    }
    addParameters(t) {
        if (this.parametersType === "none") {
            return this.set(t);
        }
        if (this.parametersType !== "object") {
            throw new Error("Can't add object parameters to existing non-object parameters!");
        }
        this.set({
            ...this.parametersRecord,
            ...t
        });
    }
    toSpecifiedParameters(t, i) {
        i = i ?? [];
        const e = this.parameters(t);
        const n = {};
        for (const t of i) {
            let i = e.findIndex((i => i.key === t));
            if (i >= 0) {
                const [s] = e.splice(i, 1);
                n[t] = s.value;
            } else {
                i = e.findIndex((t => t.key === void 0));
                if (i >= 0) {
                    const [s] = e.splice(i, 1);
                    n[t] = s.value;
                }
            }
        }
        for (const t of e.filter((t => t.key !== void 0))) {
            n[t.key] = t.value;
        }
        let s = i.length;
        for (const t of e.filter((t => t.key === void 0))) {
            n[s++] = t.value;
        }
        return n;
    }
    toSortedParameters(t, i) {
        i = i || [];
        const e = this.parameters(t);
        const n = [];
        for (const t of i) {
            let i = e.findIndex((i => i.key === t));
            if (i >= 0) {
                const t = {
                    ...e.splice(i, 1)[0]
                };
                t.key = void 0;
                n.push(t);
            } else {
                i = e.findIndex((t => t.key === void 0));
                if (i >= 0) {
                    const t = {
                        ...e.splice(i, 1)[0]
                    };
                    n.push(t);
                } else {
                    n.push({
                        value: void 0
                    });
                }
            }
        }
        const s = e.filter((t => t.key !== void 0));
        s.sort(((t, i) => (t.key || "") < (i.key || "") ? 1 : (i.key || "") < (t.key || "") ? -1 : 0));
        n.push(...s);
        n.push(...e.filter((t => t.key === void 0)));
        return n;
    }
    same(t, i, e) {
        const n = e !== null ? e.parameters : [];
        const s = this.toSpecifiedParameters(t, n);
        const r = i.toSpecifiedParameters(t, n);
        return Object.keys(s).every((t => s[t] === r[t])) && Object.keys(r).every((t => r[t] === s[t]));
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
    static create(t) {
        const i = new InstructionComponent;
        i.set(t);
        return i;
    }
    static isName(t) {
        return typeof t === "string";
    }
    static isDefinition(t) {
        return r.isType(t.Type);
    }
    static isType(t) {
        return r.isType(t);
    }
    static isInstance(t) {
        return o(t);
    }
    static isAppelation(t) {
        return InstructionComponent.isName(t) || InstructionComponent.isType(t) || InstructionComponent.isInstance(t);
    }
    static getName(t) {
        if (InstructionComponent.isName(t)) {
            return t;
        } else if (InstructionComponent.isType(t)) {
            return r.getDefinition(t).name;
        } else {
            return InstructionComponent.getName(t.constructor);
        }
    }
    static getType(t) {
        if (InstructionComponent.isName(t)) {
            return null;
        } else if (InstructionComponent.isType(t)) {
            return t;
        } else {
            return t.constructor;
        }
    }
    static getInstance(t) {
        if (InstructionComponent.isName(t) || InstructionComponent.isType(t)) {
            return null;
        } else {
            return t;
        }
    }
    set(t) {
        let i = null;
        let e = null;
        let n = null;
        let s = null;
        let r = null;
        if (t instanceof Promise) {
            s = t;
        } else if (InstructionComponent.isName(t)) {
            i = InstructionComponent.getName(t);
        } else if (InstructionComponent.isType(t)) {
            i = this.getNewName(t);
            e = InstructionComponent.getType(t);
        } else if (InstructionComponent.isInstance(t)) {
            i = this.getNewName(InstructionComponent.getType(t));
            e = InstructionComponent.getType(t);
            n = InstructionComponent.getInstance(t);
        } else if (typeof t === "function") {
            r = t;
        }
        this.name = i;
        this.type = e;
        this.instance = n;
        this.promise = s;
        this.func = r;
    }
    resolve(t) {
        if (this.func !== null) {
            this.set(this.func(t));
        }
        if (!(this.promise instanceof Promise)) {
            return;
        }
        return this.promise.then((t => {
            if (InstructionComponent.isAppelation(t)) {
                this.set(t);
                return;
            }
            if (t.default != null) {
                this.set(t.default);
                return;
            }
            const i = Object.keys(t).filter((t => !t.startsWith("__")));
            if (i.length === 0) {
                throw new Error(`Failed to load component Type from resolved Promise since no export was specified.`);
            }
            if (i.length > 1) {
                throw new Error(`Failed to load component Type from resolved Promise since no 'default' export was specified when having multiple exports.`);
            }
            const e = i[0];
            this.set(t[e]);
        }));
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
    toType(t, i) {
        void this.resolve(i);
        if (this.type !== null) {
            return this.type;
        }
        if (this.name !== null && typeof this.name === "string") {
            if (t === null) {
                throw new Error(`No container available when trying to resolve component '${this.name}'!`);
            }
            if (t.has(r.keyFrom(this.name), true)) {
                const i = t.getResolver(r.keyFrom(this.name));
                if (i !== null && i.getFactory !== void 0) {
                    const e = i.getFactory(t);
                    if (e) {
                        return e.Type;
                    }
                }
            }
        }
        return null;
    }
    toInstance(t, i, e, n) {
        void this.resolve(n);
        if (this.instance !== null) {
            return this.instance;
        }
        if (t == null) {
            return null;
        }
        const s = t.createChild();
        const r = this.isType() ? s.get(this.type) : s.get(routerComponentResolver(this.name));
        if (r == null) {
            throw new Error(`Failed to create instance when trying to resolve component '${this.name}'!`);
        }
        const o = h.$el(s, r, e, null);
        o.parent = i;
        return r;
    }
    same(t, i = false) {
        return i ? this.type === t.type : this.name === t.name;
    }
    getNewName(t) {
        if (this.name === null) {
            return InstructionComponent.getName(t);
        }
        return this.name;
    }
}

function routerComponentResolver(t) {
    const i = r.keyFrom(t);
    return {
        $isResolver: true,
        resolve(e, n) {
            if (n.has(i, false)) {
                return n.get(i);
            }
            if (n.root.has(i, false)) {
                return n.root.get(i);
            }
            console.warn(`Detected resource traversal behavior. A custom element "${t}" is neither` + ` registered locally nor globally. This is not a supported behavior and will be removed in a future release`);
            return n.get(i);
        }
    };
}

function arrayRemove(t, i) {
    const e = [];
    let n = t.findIndex(i);
    while (n >= 0) {
        e.push(t.splice(n, 1)[0]);
        n = t.findIndex(i);
    }
    return e;
}

function arrayUnique(t, i = false) {
    return t.filter(((t, e, n) => (i || t != null) && n.indexOf(t) === e));
}

class OpenPromise {
    constructor() {
        this.isPending = true;
        this.promise = new Promise(((t, i) => {
            this.t = t;
            this.i = i;
        }));
    }
    resolve(t) {
        this.t(t);
        this.isPending = false;
    }
    reject(t) {
        this.i(t);
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
    static run(t, ...i) {
        if ((i?.length ?? 0) === 0) {
            return i?.[0];
        }
        let e = false;
        if (t === null) {
            t = new Step;
            e = true;
        }
        const n = new Step(i.shift());
        Runner.connect(t, n, (t?.runParallel ?? false) || e);
        if (i.length > 0) {
            Runner.add(n, false, ...i);
        }
        if (e) {
            Runner.process(t);
            if (t.result instanceof Promise) {
                this.runners.set(t.result, t);
            }
            return t.result;
        }
        return n;
    }
    static runParallel(t, ...i) {
        if ((i?.length ?? 0) === 0) {
            return [];
        }
        let e = false;
        if (t === null) {
            t = new Step;
            e = true;
        } else {
            t = Runner.connect(t, new Step, true);
        }
        Runner.add(t, true, ...i);
        if (e) {
            Runner.process(t);
        }
        if (t.result instanceof Promise) {
            this.runners.set(t.result, t);
        }
        return e ? t.result ?? [] : t;
    }
    static step(t) {
        if (t instanceof Promise) {
            return Runner.runners.get(t);
        }
    }
    static cancel(t) {
        const i = Runner.step(t);
        if (i !== void 0) {
            i.cancel();
        }
    }
    static add(t, i, ...e) {
        let n = new Step(e.shift(), i);
        if (t !== null) {
            n = Runner.connect(t, n, i);
        }
        const s = n;
        while (e.length > 0) {
            n = Runner.connect(n, new Step(e.shift(), i), false);
        }
        return s;
    }
    static connect(t, i, e) {
        if (!e) {
            const e = t.next;
            t.next = i;
            i.previous = t;
            i.next = e;
            if (e !== null) {
                e.previous = i;
                e.parent = null;
            }
        } else {
            const e = t.child;
            t.child = i;
            i.parent = t;
            i.next = e;
            if (e !== null) {
                e.parent = null;
                e.previous = i;
            }
        }
        return i;
    }
    static process(t) {
        const i = t.root;
        while (t !== null && !t.isDoing && !t.isDone) {
            i.current = t;
            if (t.isParallelParent) {
                t.isDone = true;
                let i = t.child;
                while (i !== null) {
                    Runner.process(i);
                    i = i.next;
                }
            } else {
                t.isDoing = true;
                t.value = t.step;
                while (t.value instanceof Function && !t.isCancelled && !t.isExited && !t.isDone) {
                    t.value = t.value(t);
                }
                if (!t.isCancelled) {
                    if (t.value instanceof Promise) {
                        const e = t.value;
                        Runner.ensurePromise(i);
                        ((t, i) => {
                            i.then((i => {
                                t.value = i;
                                Runner.settlePromise(t);
                                t.isDone = true;
                                t.isDoing = false;
                                const e = t.nextToDo();
                                if (e !== null && !t.isExited) {
                                    Runner.process(e);
                                } else {
                                    if (t.root.doneAll || t.isExited) {
                                        Runner.settlePromise(t.root);
                                    }
                                }
                            })).catch((t => {
                                throw t;
                            }));
                        })(t, e);
                    } else {
                        t.isDone = true;
                        t.isDoing = false;
                        if (!t.isExited) {
                            t = t.nextToDo();
                        } else {
                            t = null;
                        }
                    }
                }
            }
        }
        if (i.isCancelled) {
            Runner.settlePromise(i, "reject");
        } else if (i.doneAll || i.isExited) {
            Runner.settlePromise(i);
        }
    }
    static ensurePromise(t) {
        if (t.finally === null) {
            t.finally = new OpenPromise;
            t.promise = t.finally.promise;
            return true;
        }
        return false;
    }
    static settlePromise(t, i = "resolve") {
        if (t.finally?.isPending ?? false) {
            t.promise = null;
            switch (i) {
              case "resolve":
                t.finally?.resolve(t.result);
                break;

              case "reject":
                t.finally?.reject(t.result);
                break;
            }
        }
    }
}

Runner.runners = new WeakMap;

Runner.roots = {};

class Step {
    constructor(t = void 0, i = false) {
        this.step = t;
        this.runParallel = i;
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
        this.id = "-1";
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
                const t = [];
                let i = this.child;
                while (i !== null) {
                    t.push(i.result);
                    i = i.next;
                }
                return t;
            } else {
                return this === this.root && this.exited !== null ? this.exited.result : this.child?.tail?.result;
            }
        }
        let t = this.value;
        while (t instanceof Step) {
            t = t.result;
        }
        return t;
    }
    get asValue() {
        return this.result;
    }
    get previousValue() {
        return this.runParallel ? this.head.parent?.parent?.previous?.result : this.previous?.result;
    }
    get name() {
        let t = `${this.id}`;
        if (this.runParallel) {
            t = `:${t}`;
        }
        if (this.value instanceof Promise || this.promise instanceof Promise) {
            t = `${t}*`;
        }
        if (this.finally !== null) {
            t = `${t}*`;
        }
        if (this.child !== null) {
            t = `${t}>`;
        }
        if (this.isDone) {
            t = `(${t})`;
        }
        return t;
    }
    get root() {
        let t = this.head;
        while (t.parent !== null) {
            t = t.parent.head;
        }
        return t;
    }
    get head() {
        let t = this;
        while (t.previous !== null) {
            t = t.previous;
        }
        return t;
    }
    get tail() {
        let t = this;
        while (t.next !== null) {
            t = t.next;
        }
        return t;
    }
    get done() {
        if (!this.isDone) {
            return false;
        }
        let t = this.child;
        while (t !== null) {
            if (!t.done) {
                return false;
            }
            t = t.next;
        }
        return true;
    }
    get doneAll() {
        if (!this.isDone || this.child !== null && !this.child.doneAll || this.next !== null && !this.next.doneAll) {
            return false;
        }
        return true;
    }
    cancel(t = true) {
        if (t) {
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
    exit(t = true) {
        if (t) {
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
        let t = this.next;
        while (t !== null) {
            if (!t.isDoing && !t.isDone) {
                return t;
            }
            t = t.next;
        }
        const i = this.head.parent ?? null;
        if (i === null || !i.done) {
            return null;
        }
        return i.nextOrUp();
    }
    get path() {
        return `${this.head.parent?.path ?? ""}/${this.name}`;
    }
    get tree() {
        let t = "";
        let i = this.head;
        let e = i.parent;
        let n = "";
        while (e !== null) {
            n = `${e.path}${n}`;
            e = e.head.parent;
        }
        do {
            t += `${n}/${i.name}\n`;
            if (i === this) {
                break;
            }
            i = i.next;
        } while (i !== null);
        return t;
    }
    get report() {
        let t = `${this.path}\n`;
        t += this.child?.report ?? "";
        t += this.next?.report ?? "";
        return t;
    }
}

Step.id = 0;

class Route {
    constructor(t, i, e, n, s, r, o, h) {
        this.path = t;
        this.id = i;
        this.redirectTo = e;
        this.instructions = n;
        this.caseSensitive = s;
        this.title = r;
        this.reloadBehavior = o;
        this.data = h;
    }
    static isConfigured(t) {
        return I.hasOwn(Route.resourceKey, t) || "parameters" in t || "title" in t;
    }
    static configure(t, i) {
        const e = Route.create(t, i);
        I.define(Route.resourceKey, e, i);
        return i;
    }
    static getConfiguration(t) {
        const i = I.getOwn(Route.resourceKey, t) ?? {};
        if (Array.isArray(t.parameters)) {
            i.parameters = t.parameters;
        }
        if ("title" in t) {
            i.title = t.title;
        }
        return i instanceof Route ? i : Route.create(i, t);
    }
    static create(t, i = null) {
        if (i !== null) {
            t = Route.transferTypeToComponent(t, i);
        }
        if (r.isType(t)) {
            t = Route.getConfiguration(t);
        } else if (i === null) {
            t = {
                ...t
            };
        }
        const e = Route.transferIndividualIntoInstructions(t);
        Route.validateRouteConfiguration(e);
        let n = e.path;
        if (Array.isArray(n)) {
            n = n.join(",");
        }
        return new Route(e.path ?? "", e.id ?? n ?? null, e.redirectTo ?? null, e.instructions ?? null, e.caseSensitive ?? false, e.title ?? null, e.reloadBehavior ?? null, e.data ?? null);
    }
    static transferTypeToComponent(t, i) {
        if (r.isType(t)) {
            throw new Error(`Invalid route configuration: A component ` + `can't be specified in a component route configuration.`);
        }
        const e = {
            ...t
        } ?? {};
        if ("component" in e || "instructions" in e) {
            throw new Error(`Invalid route configuration: The 'component' and 'instructions' properties ` + `can't be specified in a component route configuration.`);
        }
        if (!("redirectTo" in e)) {
            e.component = i;
        }
        if (!("path" in e) && !("redirectTo" in e)) {
            e.path = r.getDefinition(i).name;
        }
        return e;
    }
    static transferIndividualIntoInstructions(t) {
        if (t === null || t === void 0) {
            throw new Error(`Invalid route configuration: expected an object.`);
        }
        if ((t.component ?? null) !== null || (t.viewport ?? null) !== null || (t.parameters ?? null) !== null || (t.children ?? null) !== null) {
            if (t.instructions != null) {
                throw new Error(`Invalid route configuration: The 'instructions' property can't be used together with ` + `the 'component', 'viewport', 'parameters' or 'children' properties.`);
            }
            t.instructions = [ {
                component: t.component,
                viewport: t.viewport,
                parameters: t.parameters,
                children: t.children
            } ];
        }
        return t;
    }
    static validateRouteConfiguration(t) {
        if (t.redirectTo === null && t.instructions === null) {
            throw new Error(`Invalid route configuration: either 'redirectTo' or 'instructions' ` + `need to be specified.`);
        }
    }
}

Route.resourceKey = t.resource.keyFor("route");

const _ = {
    name: t.resource.keyFor("routes"),
    isConfigured(t) {
        return I.hasOwn(_.name, t) || "routes" in t;
    },
    configure(t, i) {
        const e = t.map((t => Route.create(t)));
        I.define(_.name, e, i);
        return i;
    },
    getConfiguration(t) {
        const i = t;
        const e = [];
        const n = I.getOwn(_.name, t);
        if (Array.isArray(n)) {
            e.push(...n);
        }
        if (Array.isArray(i.routes)) {
            e.push(...i.routes);
        }
        return e.map((t => t instanceof Route ? t : Route.create(t)));
    }
};

function routes(t) {
    return function(i) {
        return _.configure(t, i);
    };
}

class ViewportScopeContent extends EndpointContent {}

class ViewportScope extends Endpoint$1 {
    constructor(t, i, e, n, s, r = null, o = {
        catches: [],
        source: null
    }) {
        super(t, i, e);
        this.rootComponentType = r;
        this.options = o;
        this.instruction = null;
        this.available = true;
        this.sourceItem = null;
        this.sourceItemIndex = -1;
        this.remove = false;
        this.add = false;
        this.contents.push(new ViewportScopeContent(t, this, n, s));
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
        const t = this.connectedScope.parent;
        if (t === null) {
            return [ this ];
        }
        return t.enabledChildren.filter((t => t.isViewportScope && t.endpoint.name === this.name)).map((t => t.endpoint));
    }
    get source() {
        return this.options.source ?? null;
    }
    get catches() {
        let t = this.options.catches ?? [];
        if (typeof t === "string") {
            t = t.split(",");
        }
        return t;
    }
    get default() {
        if (this.catches.length > 0) {
            return this.catches[0];
        }
    }
    toString() {
        const t = this.instruction?.component.name ?? "";
        const i = this.getNextContent()?.instruction.component.name ?? "";
        return `vs:${this.name}[${t}->${i}]`;
    }
    setNextContent(t, i) {
        t.endpoint.set(this);
        this.remove = t.isClear(this.router) || t.isClearAll(this.router);
        this.add = t.isAdd(this.router) && Array.isArray(this.source);
        if (this.add) {
            t.component.name = null;
        }
        if (this.default !== void 0 && t.component.name === null) {
            t.component.name = this.default;
        }
        this.contents.push(new ViewportScopeContent(this.router, this, this.owningScope, this.scope.hasScope, t, i));
        return "swap";
    }
    transition(t) {
        Runner.run(null, (i => t.setEndpointStep(this, i.root)), (() => t.addEndpointState(this, "guardedUnload")), (() => t.addEndpointState(this, "guardedLoad")), (() => t.addEndpointState(this, "guarded")), (() => t.addEndpointState(this, "loaded")), (() => t.addEndpointState(this, "unloaded")), (() => t.addEndpointState(this, "routed")), (() => t.addEndpointState(this, "swapped")), (() => t.addEndpointState(this, "completed")));
    }
    finalizeContentChange(t, i) {
        const e = this.contents.findIndex((i => i.navigation === t.navigation));
        let n = this.contents[e];
        if (this.remove) {
            const t = new ViewportScopeContent(this.router, this, this.owningScope, this.scope.hasScope);
            this.contents.splice(e, 1, t);
            n.delete();
            n = t;
        }
        n.completed = true;
        let s = 0;
        for (let t = 0, i = e; t < i; t++) {
            if (!(this.contents[0].navigation.completed ?? false)) {
                break;
            }
            s++;
        }
        this.contents.splice(0, s);
        if (this.remove && Array.isArray(this.source)) {
            this.removeSourceItem();
        }
    }
    cancelContentChange(t, i = null) {
        [ ...new Set(this.scope.children.map((t => t.endpoint))) ].forEach((e => e.cancelContentChange(t, i)));
        const e = this.contents.findIndex((i => i.navigation === t.navigation));
        if (e < 0) {
            return;
        }
        this.contents.splice(e, 1);
        if (this.add) {
            const t = this.source.indexOf(this.sourceItem);
            this.source.splice(t, 1);
            this.sourceItem = null;
        }
    }
    acceptSegment(t) {
        if (t === null && t === void 0 || t.length === 0) {
            return true;
        }
        if (t === RoutingInstruction.clear(this.router) || t === RoutingInstruction.add(this.router) || t === this.name) {
            return true;
        }
        if (this.catches.length === 0) {
            return true;
        }
        if (this.catches.includes(t)) {
            return true;
        }
        if (this.catches.filter((t => t.includes("*"))).length) {
            return true;
        }
        return false;
    }
    binding() {
        const t = this.source || [];
        if (t.length > 0 && this.sourceItem === null) {
            this.sourceItem = this.getAvailableSourceItem();
        }
    }
    unbinding() {
        if (this.sourceItem !== null && this.source !== null) {
            arrayRemove(this.source, (t => t === this.sourceItem));
        }
        this.sourceItem = null;
    }
    getAvailableSourceItem() {
        if (this.source === null) {
            return null;
        }
        const t = this.siblings;
        for (const i of this.source) {
            if (t.every((t => t.sourceItem !== i))) {
                return i;
            }
        }
        return null;
    }
    addSourceItem() {
        const t = {};
        this.source.push(t);
        return t;
    }
    removeSourceItem() {
        this.sourceItemIndex = this.source.indexOf(this.sourceItem);
        if (this.sourceItemIndex >= 0) {
            this.source.splice(this.sourceItemIndex, 1);
        }
    }
    getRoutes() {
        const t = [];
        if (this.rootComponentType !== null) {
            const i = this.rootComponentType.constructor === this.rootComponentType.constructor.constructor ? this.rootComponentType : this.rootComponentType.constructor;
            t.push(..._.getConfiguration(i) ?? []);
        }
        return t;
    }
}

class StoredNavigation {
    constructor(t = {
        instruction: "",
        fullStateInstruction: ""
    }) {
        this.instruction = t.instruction;
        this.fullStateInstruction = t.fullStateInstruction;
        this.scope = t.scope;
        this.index = t.index;
        this.firstEntry = t.firstEntry;
        this.path = t.path;
        this.title = t.title;
        this.query = t.query;
        this.fragment = t.fragment;
        this.parameters = t.parameters;
        this.data = t.data;
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
            data: this.data
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
    constructor(t = {
        instruction: "",
        fullStateInstruction: ""
    }) {
        super(t);
        this.navigation = new NavigationFlags;
        this.repeating = false;
        this.previous = null;
        this.fromBrowser = false;
        this.origin = null;
        this.replacing = false;
        this.refreshing = false;
        this.untracked = false;
        this.process = null;
        this.completed = true;
        this.fromBrowser = t.fromBrowser ?? this.fromBrowser;
        this.origin = t.origin ?? this.origin;
        this.replacing = t.replacing ?? this.replacing;
        this.refreshing = t.refreshing ?? this.refreshing;
        this.untracked = t.untracked ?? this.untracked;
        this.historyMovement = t.historyMovement ?? this.historyMovement;
        this.process = null;
        this.timestamp = Date.now();
    }
    get useFullStateInstruction() {
        return (this.navigation.back ?? false) || (this.navigation.forward ?? false) || (this.navigation.refresh ?? false);
    }
    static create(t = {
        instruction: "",
        fullStateInstruction: ""
    }) {
        return new Navigation(t);
    }
}

class AwaitableMap {
    constructor() {
        this.map = new Map;
    }
    set(t, i) {
        const e = this.map.get(t);
        if (e instanceof OpenPromise) {
            e.resolve(i);
        }
        this.map.set(t, i);
    }
    delete(t) {
        const i = this.map.get(t);
        if (i instanceof OpenPromise) {
            i.reject();
        }
        this.map.delete(t);
    }
    await(t) {
        if (!this.map.has(t)) {
            const i = new OpenPromise;
            this.map.set(t, i);
            return i.promise;
        }
        const i = this.map.get(t);
        if (i instanceof OpenPromise) {
            return i.promise;
        }
        return i;
    }
    has(t) {
        return this.map.has(t) && !(this.map.get(t) instanceof OpenPromise);
    }
    clone() {
        const t = new AwaitableMap;
        t.map = new Map(this.map);
        return t;
    }
}

class ViewportContent extends EndpointContent {
    constructor(t, i, e, n, s = RoutingInstruction.create(""), r = Navigation.create({
        instruction: "",
        fullStateInstruction: ""
    }), o = null) {
        super(t, i, e, n, s, r);
        this.router = t;
        this.instruction = s;
        this.navigation = r;
        this.contentStates = new AwaitableMap;
        this.fromCache = false;
        this.fromHistory = false;
        this.reload = false;
        this.activatedResolve = null;
        if (!this.instruction.component.isType() && o?.container != null) {
            this.instruction.component.type = this.toComponentType(o.container);
        }
    }
    get componentInstance() {
        return this.instruction.component.instance;
    }
    get reloadBehavior() {
        if (this.instruction.route instanceof FoundRoute && this.instruction.route.match?.reloadBehavior !== null) {
            return this.instruction.route.match?.reloadBehavior;
        }
        return this.instruction.component.instance !== null && "reloadBehavior" in this.instruction.component.instance && this.instruction.component.instance.reloadBehavior !== void 0 ? this.instruction.component.instance.reloadBehavior : "default";
    }
    get controller() {
        return this.instruction.component.instance?.$controller;
    }
    equalComponent(t) {
        return this.instruction.sameComponent(this.router, t.instruction);
    }
    equalParameters(t) {
        return this.instruction.sameComponent(this.router, t.instruction, true) && (this.navigation.query ?? "") === (t.navigation.query ?? "");
    }
    isCacheEqual(t) {
        return this.instruction.sameComponent(this.router, t.instruction, true);
    }
    contentController(t) {
        return h.$el(t.container.createChild(), this.instruction.component.instance, t.element, null);
    }
    createComponent(t, i, e) {
        if (this.contentStates.has("created")) {
            return;
        }
        if (!this.fromCache && !this.fromHistory) {
            try {
                this.instruction.component.set(this.toComponentInstance(t.container, t.controller, t.element));
            } catch (n) {
                if (!n.message.startsWith("AUR0009:")) {
                    throw n;
                }
                if ((i ?? "") !== "") {
                    if (e === "process-children") {
                        this.instruction.parameters.set([ this.instruction.component.name ]);
                    } else {
                        this.instruction.parameters.set([ this.instruction.unparsed ?? this.instruction.component.name ]);
                        this.instruction.nextScopeInstructions = null;
                    }
                    this.instruction.component.set(i);
                    try {
                        this.instruction.component.set(this.toComponentInstance(t.container, t.controller, t.element));
                    } catch (t) {
                        if (!t.message.startsWith("AUR0009:")) {
                            throw t;
                        }
                        throw new Error(`'${this.instruction.component.name}' did not match any configured route or registered component name - did you forget to add the component '${this.instruction.component.name}' to the dependencies or to register it as a global dependency?`);
                    }
                } else {
                    throw new Error(`'${this.instruction.component.name}' did not match any configured route or registered component name - did you forget to add the component '${this.instruction.component.name}' to the dependencies or to register it as a global dependency?`);
                }
            }
        }
        this.contentStates.set("created", void 0);
    }
    canLoad() {
        if (!this.contentStates.has("created") || this.contentStates.has("checkedLoad") && !this.reload) {
            return true;
        }
        const t = this.instruction.component.instance;
        if (t == null) {
            return true;
        }
        this.contentStates.set("checkedLoad", void 0);
        const i = this.endpoint.parentViewport?.getTimeContent(this.navigation.timestamp)?.instruction?.typeParameters(this.router);
        const e = this.instruction.typeParameters(this.router);
        const n = {
            ...this.navigation.parameters,
            ...i,
            ...e
        };
        const s = this.getLifecycleHooks(t, "canLoad").map((i => e => {
            const s = i(t, n, this.instruction, this.navigation);
            if (typeof s === "boolean") {
                if (s === false) {
                    e.exit();
                }
                return s;
            }
            if (typeof s === "string") {
                e.exit();
                return s;
            }
            return s;
        }));
        if (s.length !== 0) {
            const t = Runner.run(null, ...s);
            if (t !== true) {
                if (t === false) {
                    return false;
                }
                if (typeof t === "string") {
                    return t;
                }
                return t;
            }
        }
        if (t.canLoad == null) {
            return true;
        }
        const r = t.canLoad(n, this.instruction, this.navigation);
        if (typeof r === "boolean" || typeof r === "string") {
            return r;
        }
        return r;
    }
    canUnload(t) {
        if (this.contentStates.has("checkedUnload") && !this.reload) {
            return true;
        }
        this.contentStates.set("checkedUnload", void 0);
        if (!this.contentStates.has("loaded")) {
            return true;
        }
        const i = this.instruction.component.instance;
        if (t === null) {
            t = Navigation.create({
                instruction: "",
                fullStateInstruction: "",
                previous: this.navigation
            });
        }
        const e = this.getLifecycleHooks(i, "canUnload").map((e => n => {
            const s = e(i, this.instruction, t);
            if (typeof s === "boolean") {
                if (s === false) {
                    n.exit();
                }
                return s;
            }
            return s;
        }));
        if (e.length !== 0) {
            const t = Runner.run(null, ...e);
            if (t !== true) {
                if (t === false) {
                    return false;
                }
                return t;
            }
        }
        if (!i.canUnload) {
            return true;
        }
        const n = i.canUnload(this.instruction, t);
        if (typeof n !== "boolean" && !(n instanceof Promise)) {
            throw new Error(`Method 'canUnload' in component "${this.instruction.component.name}" needs to return true or false or a Promise resolving to true or false.`);
        }
        return n;
    }
    load(t) {
        return Runner.run(t, (() => this.contentStates.await("checkedLoad")), (() => {
            if (!this.contentStates.has("created") || this.contentStates.has("loaded") && !this.reload) {
                return;
            }
            this.reload = false;
            this.contentStates.set("loaded", void 0);
            const t = this.instruction.component.instance;
            const i = this.endpoint.parentViewport?.getTimeContent(this.navigation.timestamp)?.instruction?.typeParameters(this.router);
            const e = this.instruction.typeParameters(this.router);
            const n = {
                ...this.navigation.parameters,
                ...i,
                ...e
            };
            const s = this.getLifecycleHooks(t, "loading").map((i => () => i(t, n, this.instruction, this.navigation)));
            s.push(...this.getLifecycleHooks(t, "load").map((i => () => {
                console.warn(`[Deprecated] Found deprecated hook name "load" in ${this.instruction.component.name}. Please use the new name "loading" instead.`);
                return i(t, n, this.instruction, this.navigation);
            })));
            if (s.length !== 0) {
                if (typeof t.loading === "function") {
                    s.push((() => t.loading(n, this.instruction, this.navigation)));
                }
                if (typeof t.load === "function") {
                    console.warn(`[Deprecated] Found deprecated hook name "load" in ${this.instruction.component.name}. Please use the new name "loading" instead.`);
                    s.push((() => t.load(n, this.instruction, this.navigation)));
                }
                return Runner.run(null, ...s);
            }
            if (typeof t.loading === "function") {
                return t.loading(n, this.instruction, this.navigation);
            }
            if (typeof t.load === "function") {
                console.warn(`[Deprecated] Found deprecated hook name "load" in ${this.instruction.component.name}. Please use the new name "loading" instead.`);
                return t.load(n, this.instruction, this.navigation);
            }
        }));
    }
    unload(t) {
        if (!this.contentStates.has("loaded")) {
            return;
        }
        this.contentStates.delete("loaded");
        const i = this.instruction.component.instance;
        if (t === null) {
            t = Navigation.create({
                instruction: "",
                fullStateInstruction: "",
                previous: this.navigation
            });
        }
        const e = this.getLifecycleHooks(i, "unloading").map((e => () => e(i, this.instruction, t)));
        e.push(...this.getLifecycleHooks(i, "unload").map((e => () => {
            console.warn(`[Deprecated] Found deprecated hook name "unload" in ${this.instruction.component.name}. Please use the new name "unloading" instead.`);
            return e(i, this.instruction, t);
        })));
        if (e.length !== 0) {
            if (typeof i.unloading === "function") {
                e.push((() => i.unloading(this.instruction, t)));
            }
            if (typeof i.unload === "function") {
                console.warn(`[Deprecated] Found deprecated hook name "unload" in ${this.instruction.component.name}. Please use the new name "unloading" instead.`);
                e.push((() => i.unload(this.instruction, t)));
            }
            return Runner.run(null, ...e);
        }
        if (typeof i.unloading === "function") {
            return i.unloading(this.instruction, t);
        }
        if (typeof i.unload === "function") {
            console.warn(`[Deprecated] Found deprecated hook name "unload" in ${this.instruction.component.name}. Please use the new name "unloading" instead.`);
            return i.unload(this.instruction, t);
        }
    }
    activateComponent(t, i, e, n, s, r) {
        return Runner.run(t, (() => this.contentStates.await("loaded")), (() => this.waitForParent(e)), (() => {
            if (this.contentStates.has("activating") || this.contentStates.has("activated")) {
                return;
            }
            this.contentStates.set("activating", void 0);
            return this.controller?.activate(i ?? this.controller, e, void 0);
        }), (() => {
            this.contentStates.set("activated", void 0);
        }));
    }
    deactivateComponent(t, i, e, n, s = false) {
        if (!this.contentStates.has("activated") && !this.contentStates.has("activating")) {
            return;
        }
        return Runner.run(t, (() => {
            if (s && n.element !== null) {
                const t = Array.from(n.element.getElementsByTagName("*"));
                for (const i of t) {
                    if (i.scrollTop > 0 || i.scrollLeft) {
                        i.setAttribute("au-element-scroll", `${i.scrollTop},${i.scrollLeft}`);
                    }
                }
            }
            this.contentStates.delete("activated");
            this.contentStates.delete("activating");
            return this.controller?.deactivate(i ?? this.controller, e);
        }));
    }
    disposeComponent(t, i, e = false) {
        if (!this.contentStates.has("created") || this.instruction.component.instance == null) {
            return;
        }
        if (!e) {
            this.contentStates.delete("created");
            return this.controller?.dispose();
        } else {
            i.push(this);
        }
    }
    freeContent(t, i, e, n, s = false) {
        return Runner.run(t, (() => this.unload(e)), (t => this.deactivateComponent(t, null, i.controller, i, s)), (() => this.disposeComponent(i, n, s)));
    }
    toComponentName() {
        return this.instruction.component.name;
    }
    toComponentType(t) {
        if (this.instruction.component.none) {
            return null;
        }
        return this.instruction.component.toType(t, this.instruction);
    }
    toComponentInstance(t, i, e) {
        if (this.instruction.component.none) {
            return null;
        }
        return this.instruction.component.toInstance(t, i, e, this.instruction);
    }
    waitForParent(t) {
        if (t === null) {
            return;
        }
        if (!t.isActive) {
            return new Promise((t => {
                this.endpoint.activeResolve = t;
            }));
        }
    }
    getLifecycleHooks(t, i) {
        const e = t.$controller.lifecycleHooks[i] ?? [];
        return e.map((t => t.instance[i].bind(t.instance)));
    }
}

class ViewportOptions {
    constructor(t = true, i = [], e = "", n = "", s = "", r = false, o = false, h = false, u = false, a = false) {
        this.scope = t;
        this.usedBy = i;
        this.fallback = n;
        this.fallbackAction = s;
        this.noLink = r;
        this.noTitle = o;
        this.stateful = h;
        this.forceDescription = u;
        this.noHistory = a;
        this.default = undefined;
        this.default = e;
    }
    static create(t) {
        const i = new ViewportOptions;
        if (t !== void 0) {
            i.apply(t);
        }
        return i;
    }
    apply(t) {
        this.scope = t.scope ?? this.scope;
        this.usedBy = (typeof t.usedBy === "string" ? t.usedBy.split(",").filter((t => t.length > 0)) : t.usedBy) ?? this.usedBy;
        this.default = t.default ?? this.default;
        this.fallback = t.fallback ?? this.fallback;
        this.fallbackAction = t.fallbackAction ?? this.fallbackAction;
        this.noLink = t.noLink ?? this.noLink;
        this.noTitle = t.noTitle ?? this.noTitle;
        this.stateful = t.stateful ?? this.stateful;
        this.forceDescription = t.forceDescription ?? this.forceDescription;
        this.noHistory = t.noHistory ?? this.noHistory;
    }
}

class Viewport extends Endpoint$1 {
    constructor(t, i, e, n, s, r) {
        super(t, i, e);
        this.contents = [];
        this.forceRemove = false;
        this.options = new ViewportOptions;
        this.activeResolve = null;
        this.connectionResolve = null;
        this.clear = false;
        this.coordinators = [];
        this.previousViewportState = null;
        this.cache = [];
        this.historyCache = [];
        this.contents.push(new ViewportContent(t, this, n, s));
        this.contents[0].completed = true;
        if (r !== void 0) {
            this.options.apply(r);
        }
    }
    getContent() {
        if (this.contents.length === 1) {
            return this.contents[0];
        }
        let t;
        for (let i = 0, e = this.contents.length; i < e; i++) {
            if (this.contents[i].completed ?? false) {
                t = this.contents[i];
            } else {
                break;
            }
        }
        return t;
    }
    getNextContent() {
        if (this.contents.length === 1) {
            return null;
        }
        const t = this.contents.indexOf(this.getContent());
        return this.contents.length > t ? this.contents[t + 1] : null;
    }
    getTimeContent(t) {
        let i = null;
        for (let e = 0, n = this.contents.length; e < n; e++) {
            if (this.contents[e].navigation.timestamp > t) {
                break;
            }
            i = this.contents[e];
        }
        return i;
    }
    getNavigationContent(t) {
        return super.getNavigationContent(t);
    }
    get parentViewport() {
        let t = this.connectedScope;
        while (t?.parent != null) {
            t = t.parent;
            if (t.endpoint.isViewport) {
                return t.endpoint;
            }
        }
        return null;
    }
    get isEmpty() {
        return this.getContent().componentInstance === null;
    }
    get doForceRemove() {
        let t = this.connectedScope;
        while (t !== null) {
            if (t.isViewport && t.endpoint.forceRemove) {
                return true;
            }
            t = t.parent;
        }
        return false;
    }
    isActiveNavigation(t) {
        return this.coordinators[this.coordinators.length - 1] === t;
    }
    toString() {
        const t = this.getContent()?.instruction.component.name ?? "";
        const i = this.getNextContent()?.instruction.component.name ?? "";
        return `v:${this.name}[${t}->${i}]`;
    }
    setNextContent(t, i) {
        t.endpoint.set(this);
        this.clear = t.isClear(this.router);
        const e = this.getContent();
        const n = new ViewportContent(this.router, this, this.owningScope, this.scope.hasScope, !this.clear ? t : void 0, i, this.connectedCE ?? null);
        this.contents.push(n);
        n.fromHistory = n.componentInstance !== null && i.navigation ? !!i.navigation.back || !!i.navigation.forward : false;
        if (this.options.stateful) {
            const t = this.cache.find((t => n.isCacheEqual(t)));
            if (t !== void 0) {
                this.contents.splice(this.contents.indexOf(n), 1, t);
                n.fromCache = true;
            } else {
                this.cache.push(n);
            }
        }
        if (n.componentInstance !== null && e.componentInstance === n.componentInstance) {
            n.delete();
            this.contents.splice(this.contents.indexOf(n), 1);
            return this.transitionAction = "skip";
        }
        if (!e.equalComponent(n) || i.navigation.refresh || e.reloadBehavior === "refresh") {
            return this.transitionAction = "swap";
        }
        if (e.reloadBehavior === "disallow") {
            n.delete();
            this.contents.splice(this.contents.indexOf(n), 1);
            return this.transitionAction = "skip";
        }
        if (e.reloadBehavior === "reload") {
            e.reload = true;
            n.instruction.component.set(e.componentInstance);
            n.contentStates = e.contentStates.clone();
            n.reload = e.reload;
            return this.transitionAction = "reload";
        }
        if (this.options.stateful && e.equalParameters(n)) {
            n.delete();
            this.contents.splice(this.contents.indexOf(n), 1);
            return this.transitionAction = "skip";
        }
        if (!e.equalParameters(n)) {
            {
                return this.transitionAction = "swap";
            }
        }
        n.delete();
        this.contents.splice(this.contents.indexOf(n), 1);
        return this.transitionAction = "skip";
    }
    setConnectedCE(t, i) {
        i = i ?? {};
        if (this.connectedCE !== t) {
            this.previousViewportState = {
                ...this
            };
            this.clearState();
            this.connectedCE = t;
            this.options.apply(i);
            if (this.connectionResolve != null) {
                this.connectionResolve();
            }
        }
        const e = (this.scope.parent?.endpoint.getRoutes() ?? []).filter((t => (Array.isArray(t.path) ? t.path : [ t.path ]).includes(""))).length > 0;
        if (this.getContent().componentInstance === null && this.getNextContent()?.componentInstance == null && (this.options.default || e)) {
            const t = RoutingInstruction.parse(this.router, this.options.default ?? "");
            if (t.length === 0 && e) {
                const i = this.scope.parent?.findInstructions([ RoutingInstruction.create("") ], false, this.router.configuration.options.useConfiguredRoutes);
                if (i?.foundConfiguration) {
                    t.push(...i.instructions);
                }
            }
            for (const i of t) {
                i.endpoint.set(this);
                i.scope = this.owningScope;
                i.default = true;
            }
            this.router.load(t, {
                append: true
            }).catch((t => {
                throw t;
            }));
        }
    }
    remove(t, i) {
        if (this.connectedCE === i) {
            return Runner.run(t, (t => {
                if (this.getContent().componentInstance !== null) {
                    return this.getContent().freeContent(t, this.connectedCE, this.getNextContent()?.navigation ?? null, this.historyCache, this.doForceRemove ? false : this.router.statefulHistory || this.options.stateful);
                }
            }), (t => {
                if (this.doForceRemove) {
                    const i = [];
                    for (const t of this.historyCache) {
                        i.push((i => t.freeContent(i, null, null, this.historyCache, false)));
                    }
                    i.push((() => {
                        this.historyCache = [];
                    }));
                    return Runner.run(t, ...i);
                }
                return true;
            }));
        }
        return false;
    }
    async transition(t) {
        const i = this.router.configuration.options.indicators.viewportNavigating;
        this.coordinators.push(t);
        while (this.coordinators[0] !== t) {
            await this.coordinators[0].waitForSyncState("completed");
        }
        let e = this.parentViewport;
        if (e !== null && e.transitionAction !== "reload" && e.transitionAction !== "swap") {
            e = null;
        }
        const n = [ i => {
            if (this.isActiveNavigation(t)) {
                return this.canUnload(t, i);
            }
        }, i => {
            if (this.isActiveNavigation(t)) {
                if (!i.previousValue) {
                    t.cancel();
                } else {
                    if (this.router.isRestrictedNavigation) {
                        const i = this.router.configuration.options;
                        this.getNavigationContent(t).createComponent(this.connectedCE, this.options.fallback || i.fallback, this.options.fallbackAction || i.fallbackAction);
                    }
                }
            }
            t.addEndpointState(this, "guardedUnload");
        }, () => t.waitForSyncState("guardedUnload", this), () => e !== null ? t.waitForEndpointState(e, "guardedLoad") : void 0, i => {
            if (this.isActiveNavigation(t)) {
                return this.canLoad(t, i);
            }
        }, i => {
            if (this.isActiveNavigation(t)) {
                let e = i.previousValue;
                if (typeof e === "boolean") {
                    if (!e) {
                        i.cancel();
                        t.cancel();
                        this.getNavigationContent(t).instruction.nextScopeInstructions = null;
                        return;
                    }
                } else {
                    this.getNavigationContent(t).instruction.nextScopeInstructions = null;
                    if (typeof e === "string") {
                        const t = this.scope;
                        const i = this.router.configuration.options;
                        let n = RoutingInstruction.parse(this.router, e);
                        const s = t.parent?.findInstructions(n, i.useDirectRouting, i.useConfiguredRoutes);
                        if (s?.foundConfiguration || s?.foundInstructions) {
                            n = s.instructions;
                        }
                        for (const i of n) {
                            i.endpoint.set(this);
                            i.scope = t.owningScope;
                        }
                        e = n;
                    }
                    return Runner.run(i, (i => this.cancelContentChange(t, i)), (t => {
                        void this.router.load(e, {
                            append: true
                        });
                        return t.exit();
                    }));
                }
            }
            t.addEndpointState(this, "guardedLoad");
            t.addEndpointState(this, "guarded");
        } ];
        const s = [ () => t.waitForSyncState("guarded", this), i => {
            if (this.isActiveNavigation(t)) {
                return this.unload(t, i);
            }
        }, () => t.addEndpointState(this, "unloaded"), () => t.waitForSyncState("unloaded", this), () => e !== null ? t.waitForEndpointState(e, "loaded") : void 0, i => {
            if (this.isActiveNavigation(t)) {
                return this.load(t, i);
            }
        }, () => t.addEndpointState(this, "loaded"), () => t.addEndpointState(this, "routed") ];
        const r = [ () => t.waitForSyncState("routed", this), () => t.waitForEndpointState(this, "routed") ];
        const o = this.router.configuration.options.swapOrder;
        switch (o) {
          case "detach-current-attach-next":
            r.push((i => {
                if (this.isActiveNavigation(t)) {
                    return this.removeContent(i, t);
                }
            }), (i => {
                if (this.isActiveNavigation(t)) {
                    return this.addContent(i, t);
                }
            }));
            break;

          case "attach-next-detach-current":
            r.push((i => {
                if (this.isActiveNavigation(t)) {
                    return this.addContent(i, t);
                }
            }), (i => {
                if (this.isActiveNavigation(t)) {
                    return this.removeContent(i, t);
                }
            }));
            break;

          case "detach-attach-simultaneously":
            r.push((i => Runner.runParallel(i, (i => {
                if (this.isActiveNavigation(t)) {
                    return this.removeContent(i, t);
                }
            }), (i => {
                if (this.isActiveNavigation(t)) {
                    return this.addContent(i, t);
                }
            }))));
            break;

          case "attach-detach-simultaneously":
            r.push((i => Runner.runParallel(i, (i => {
                if (this.isActiveNavigation(t)) {
                    return this.addContent(i, t);
                }
            }), (i => {
                if (this.isActiveNavigation(t)) {
                    return this.removeContent(i, t);
                }
            }))));
            break;
        }
        r.push((() => t.addEndpointState(this, "swapped")));
        this.connectedCE?.setActivity?.(i, true);
        this.connectedCE?.setActivity?.(t.navigation.navigation, true);
        const h = Runner.run(null, (i => t.setEndpointStep(this, i.root)), ...n, ...s, ...r, (() => t.addEndpointState(this, "completed")), (() => t.waitForSyncState("bound")), (() => {
            this.connectedCE?.setActivity?.(i, false);
            this.connectedCE?.setActivity?.(t.navigation.navigation, false);
        }));
        if (h instanceof Promise) {
            h.catch((t => {}));
        }
    }
    canUnload(t, i) {
        return Runner.run(i, (i => this.getContent().connectedScope.canUnload(t, i)), (i => {
            if (!i.previousValue) {
                return false;
            }
            return this.getContent().canUnload(t.navigation);
        }));
    }
    canLoad(t, i) {
        if (this.clear) {
            return true;
        }
        return Runner.run(i, (() => this.waitForConnected()), (() => {
            const i = this.router.configuration.options;
            const e = this.getNavigationContent(t);
            e.createComponent(this.connectedCE, this.options.fallback || i.fallback, this.options.fallbackAction || i.fallbackAction);
            return e.canLoad();
        }));
    }
    load(t, i) {
        if (this.clear) {
            return;
        }
        return this.getNavigationContent(t).load(i);
    }
    addContent(t, i) {
        return this.activate(t, null, this.connectedController, i);
    }
    removeContent(t, i) {
        if (this.isEmpty) {
            return;
        }
        const e = this.router.statefulHistory || (this.options.stateful ?? false);
        return Runner.run(t, (() => i.addEndpointState(this, "bound")), (() => i.waitForSyncState("bound")), (t => this.deactivate(t, null, this.connectedController)), (() => e ? this.dispose() : void 0));
    }
    activate(t, i, e, n) {
        if (this.activeContent.componentInstance !== null) {
            return Runner.run(t, (() => this.activeContent.canLoad()), (t => this.activeContent.load(t)), (t => this.activeContent.activateComponent(t, i, e, this.connectedCE, (() => n?.addEndpointState(this, "bound")), n?.waitForSyncState("bound"))));
        }
    }
    deactivate(t, i, e) {
        const n = this.getContent();
        if (n?.componentInstance != null && !n.reload && n.componentInstance !== this.getNextContent()?.componentInstance) {
            return n.deactivateComponent(t, i, e, this.connectedCE, this.router.statefulHistory || this.options.stateful);
        }
    }
    unload(t, i) {
        return Runner.run(i, (i => this.getContent().connectedScope.unload(t, i)), (() => this.getContent().componentInstance != null ? this.getContent().unload(t.navigation ?? null) : void 0));
    }
    dispose() {
        if (this.getContent().componentInstance !== null && !this.getContent().reload && this.getContent().componentInstance !== this.getNextContent()?.componentInstance) {
            this.getContent().disposeComponent(this.connectedCE, this.historyCache, this.router.statefulHistory || this.options.stateful);
        }
    }
    finalizeContentChange(t, i) {
        const e = this.contents.findIndex((i => i.navigation === t.navigation));
        let n = this.contents[e];
        const s = this.contents[e - 1];
        if (this.clear) {
            const t = new ViewportContent(this.router, this, this.owningScope, this.scope.hasScope, void 0, n.navigation);
            this.contents.splice(e, 1, t);
            n.delete();
            n = t;
        } else {
            n.reload = false;
        }
        s.delete();
        n.completed = true;
        this.transitionAction = "";
        n.contentStates.delete("checkedUnload");
        n.contentStates.delete("checkedLoad");
        this.previousViewportState = null;
        const r = this.router.configuration.options.indicators.viewportNavigating;
        this.connectedCE?.setActivity?.(r, false);
        this.connectedCE?.setActivity?.(t.navigation.navigation, false);
        let o = 0;
        for (let t = 0, i = e; t < i; t++) {
            if (!(this.contents[0].navigation.completed ?? false)) {
                break;
            }
            o++;
        }
        this.contents.splice(0, o);
        arrayRemove(this.coordinators, (i => i === t));
    }
    cancelContentChange(t, i = null) {
        [ ...new Set(this.scope.children.map((t => t.endpoint))) ].forEach((e => e.cancelContentChange(t, i)));
        const e = this.contents.findIndex((i => i.navigation === t.navigation));
        if (e < 0) {
            return;
        }
        const n = t.getEndpointStep(this)?.current ?? null;
        const s = this.contents[e];
        const r = this.contents[e - 1];
        s.instruction.cancelled = true;
        return Runner.run(n, (t => s.freeContent(t, this.connectedCE, s.navigation, this.historyCache, this.router.statefulHistory || this.options.stateful)), (() => {
            if (this.previousViewportState) {
                Object.assign(this, this.previousViewportState);
            }
            s?.delete();
            if (s !== null) {
                this.contents.splice(this.contents.indexOf(s), 1);
            }
            this.transitionAction = "";
            r?.contentStates.delete("checkedUnload");
            r?.contentStates.delete("checkedLoad");
            const i = this.router.configuration.options.indicators.viewportNavigating;
            this.connectedCE?.setActivity?.(i, false);
            this.connectedCE?.setActivity?.(t.navigation.navigation, false);
            t.removeEndpoint(this);
            arrayRemove(this.coordinators, (i => i === t));
        }), (() => {
            if (n !== i) {
                return n?.exit();
            }
        }));
    }
    wantComponent(t) {
        return this.options.usedBy.includes(t);
    }
    acceptComponent(t) {
        if (t === "-" || t === null) {
            return true;
        }
        const i = this.options.usedBy;
        if (i.length === 0) {
            return true;
        }
        if (i.includes(t)) {
            return true;
        }
        if (i.filter((t => t.includes("*"))).length) {
            return true;
        }
        return false;
    }
    freeContent(t, i) {
        const e = this.historyCache.find((t => t.componentInstance === i));
        if (e !== void 0) {
            return Runner.run(t, (t => {
                this.forceRemove = true;
                return e.freeContent(t, null, null, this.historyCache, false);
            }), (() => {
                this.forceRemove = false;
                arrayRemove(this.historyCache, (t => t === e));
            }));
        }
    }
    getRoutes() {
        const t = [];
        let i = this.getComponentType();
        if (i != null) {
            i = i.constructor === i.constructor.constructor ? i : i.constructor;
            t.push(..._.getConfiguration(i) ?? []);
        }
        return t;
    }
    getTitle(t) {
        if (this.options.noTitle) {
            return "";
        }
        const i = this.getComponentType();
        if (i === null) {
            return "";
        }
        let e = "";
        const n = i.title;
        if (n !== void 0) {
            if (typeof n === "string") {
                e = n;
            } else {
                const i = this.getComponentInstance();
                e = n.call(i, i, t);
            }
        } else if (this.router.configuration.options.title.useComponentNames) {
            let t = this.getContentInstruction().component.name ?? "";
            const i = this.router.configuration.options.title.componentPrefix ?? "";
            if (t.startsWith(i)) {
                t = t.slice(i.length);
            }
            t = t.replace("-", " ");
            e = t.slice(0, 1).toLocaleUpperCase() + t.slice(1);
        }
        return e;
    }
    getComponentType() {
        let t = this.getContentInstruction().component.type ?? null;
        if (t === null) {
            const i = r.for(this.connectedCE.element);
            t = i.container.componentType;
        }
        return t ?? null;
    }
    getComponentInstance() {
        return this.getContentInstruction().component.instance ?? null;
    }
    getContentInstruction() {
        return this.getNextContent()?.instruction ?? this.getContent().instruction ?? null;
    }
    clearState() {
        this.options = ViewportOptions.create();
        const t = this.owningScope;
        const i = this.scope.hasScope;
        this.getContent().delete();
        this.contents.shift();
        if (this.contents.length < 1) {
            throw new Error("no content!");
        }
        this.contents.push(new ViewportContent(this.router, this, t, i));
        this.cache = [];
    }
    waitForConnected() {
        if (this.connectedCE === null) {
            return new Promise((t => {
                this.connectionResolve = t;
            }));
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
            return "Viewport";
        }
        if (this.instance instanceof ViewportScope) {
            return "ViewportScope";
        }
        return null;
    }
    static create(t) {
        const i = new InstructionEndpoint;
        i.set(t);
        return i;
    }
    static isName(t) {
        return typeof t === "string";
    }
    static isInstance(t) {
        return t instanceof Endpoint$1;
    }
    static getName(t) {
        if (InstructionEndpoint.isName(t)) {
            return t;
        } else {
            return t ? t.name : null;
        }
    }
    static getInstance(t) {
        if (InstructionEndpoint.isName(t)) {
            return null;
        } else {
            return t;
        }
    }
    set(t) {
        if (t === undefined || t === "") {
            t = null;
        }
        if (typeof t === "string") {
            this.name = t;
            this.instance = null;
        } else {
            this.instance = t;
            if (t !== null) {
                this.name = t.name;
                this.scope = t.owningScope;
            }
        }
    }
    toInstance(t) {
        if (this.instance !== null) {
            return this.instance;
        }
        return t.getEndpoint(this.endpointType, this.name);
    }
    same(t, i) {
        if (this.instance !== null && t.instance !== null) {
            return this.instance === t.instance;
        }
        return (this.endpointType === null || t.endpointType === null || this.endpointType === t.endpointType) && (!i || this.scope === t.scope) && (this.instance !== null ? this.instance.name : this.name) === (t.instance !== null ? t.instance.name : t.name);
    }
}

class RoutingInstruction {
    constructor(t, i, e) {
        this.ownsScope = true;
        this.nextScopeInstructions = null;
        this.scope = null;
        this.scopeModifier = "";
        this.needsEndpointDescribed = false;
        this.route = null;
        this.routeStart = false;
        this.default = false;
        this.topInstruction = false;
        this.unparsed = null;
        this.cancelled = false;
        this.component = InstructionComponent.create(t);
        this.endpoint = InstructionEndpoint.create(i);
        this.parameters = InstructionParameters.create(e);
    }
    static create(t, i, e, n = true, s = null) {
        const r = new RoutingInstruction(t, i, e);
        r.ownsScope = n;
        r.nextScopeInstructions = s;
        return r;
    }
    static createClear(t, i) {
        return RoutingInstruction.create(RoutingInstruction.clear(t), i);
    }
    static from(t, i) {
        if (!Array.isArray(i)) {
            i = [ i ];
        }
        const e = [];
        for (const n of i) {
            if (typeof n === "string") {
                e.push(...RoutingInstruction.parse(t, n));
            } else if (n instanceof RoutingInstruction) {
                e.push(n);
            } else if (n instanceof Promise) {
                e.push(RoutingInstruction.create(n));
            } else if (InstructionComponent.isAppelation(n)) {
                e.push(RoutingInstruction.create(n));
            } else if (InstructionComponent.isDefinition(n)) {
                e.push(RoutingInstruction.create(n.Type));
            } else if ("component" in n || "id" in n) {
                const i = n;
                const s = RoutingInstruction.create(i.component, i.viewport, i.parameters);
                s.route = n.id ?? null;
                if (i.children !== void 0 && i.children !== null) {
                    s.nextScopeInstructions = RoutingInstruction.from(t, i.children);
                }
                e.push(s);
            } else if (typeof n === "object" && n !== null) {
                const t = r.define(n);
                e.push(RoutingInstruction.create(t));
            } else {
                e.push(RoutingInstruction.create(n));
            }
        }
        return e;
    }
    static clear(t) {
        return Separators.for(t).clear;
    }
    static add(t) {
        return Separators.for(t).add;
    }
    static parse(t, i) {
        const e = Separators.for(t);
        let n = "";
        const s = /^[./]+/.exec(i);
        if (Array.isArray(s) && s.length > 0) {
            n = s[0];
            i = i.slice(n.length);
        }
        const r = InstructionParser.parse(e, i, true, true).instructions;
        for (const t of r) {
            t.scopeModifier = n;
        }
        return r;
    }
    static stringify(t, i, e = false, n = false) {
        return typeof i === "string" ? i : i.map((i => i.stringify(t, e, n))).filter((t => t.length > 0)).join(Separators.for(t).sibling);
    }
    static resolve(t) {
        const i = t.filter((t => t.isUnresolved)).map((t => t.resolve())).filter((t => t instanceof Promise));
        if (i.length > 0) {
            return Promise.all(i);
        }
    }
    static containsSiblings(t, i) {
        if (i === null) {
            return false;
        }
        if (i.filter((i => !i.isClear(t) && !i.isClearAll(t))).length > 1) {
            return true;
        }
        return i.some((i => RoutingInstruction.containsSiblings(t, i.nextScopeInstructions)));
    }
    static flat(t) {
        const i = [];
        for (const e of t) {
            i.push(e);
            if (e.hasNextScopeInstructions) {
                i.push(...RoutingInstruction.flat(e.nextScopeInstructions));
            }
        }
        return i;
    }
    static clone(t, i = false, e = false) {
        return t.map((t => t.clone(i, e)));
    }
    static contains(t, i, e, n) {
        return e.every((e => e.isIn(t, i, n)));
    }
    get viewport() {
        return this.endpoint.instance instanceof Viewport || this.endpoint.endpointType === null ? this.endpoint : null;
    }
    get viewportScope() {
        return this.endpoint.instance instanceof ViewportScope || this.endpoint.endpointType === null ? this.endpoint : null;
    }
    get previous() {
        return this.endpoint.instance?.getContent()?.instruction;
    }
    isAdd(t) {
        return this.component.name === Separators.for(t).add;
    }
    isClear(t) {
        return this.component.name === Separators.for(t).clear;
    }
    isAddAll(t) {
        return this.isAdd(t) && (this.endpoint.name?.length ?? 0) === 0;
    }
    isClearAll(t) {
        return this.isClear(t) && (this.endpoint.name?.length ?? 0) === 0;
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
    typeParameters(t) {
        return this.parameters.toSpecifiedParameters(t, this.component.type?.parameters ?? []);
    }
    sameRoute(t) {
        const i = this.route?.match;
        const e = t.route?.match;
        if (i == null || e == null) {
            return false;
        }
        if (typeof i === "string" || typeof e === "string") {
            return i === e;
        }
        return i.id === e.id;
    }
    sameComponent(t, i, e = false, n = false) {
        if (e && !this.sameParameters(t, i, n)) {
            return false;
        }
        return this.component.same(i.component, n);
    }
    sameEndpoint(t, i) {
        return this.endpoint.same(t.endpoint, i);
    }
    sameParameters(t, i, e = false) {
        if (!this.component.same(i.component, e)) {
            return false;
        }
        return this.parameters.same(t, i.parameters, this.component.type);
    }
    stringify(t, i = false, e = false, n = false) {
        const s = Separators.for(t);
        let r = i;
        let o = false;
        if (e) {
            const t = this.viewport?.instance ?? null;
            if (t?.options.noLink ?? false) {
                return "";
            }
            if (!this.needsEndpointDescribed && (!(t?.options.forceDescription ?? false) || this.viewportScope?.instance != null)) {
                r = true;
            }
            if (t?.options.fallback === this.component.name) {
                o = true;
            }
            if (t?.options.default === this.component.name) {
                o = true;
            }
        }
        const h = this.nextScopeInstructions;
        let u = this.scopeModifier;
        if (this.route instanceof FoundRoute && !this.routeStart) {
            return !n && Array.isArray(h) ? RoutingInstruction.stringify(t, h, i, e) : "";
        }
        const a = this.stringifyShallow(t, r, o);
        u += a.endsWith(s.scope) ? a.slice(0, -s.scope.length) : a;
        if (!n && Array.isArray(h) && h.length > 0) {
            const n = RoutingInstruction.stringify(t, h, i, e);
            if (n.length > 0) {
                u += s.scope;
                u += h.length === 1 ? n : `${s.groupStart}${n}${s.groupEnd}`;
            }
        }
        return u;
    }
    clone(t = false, i = false, e = false) {
        const n = RoutingInstruction.create(this.component.func ?? this.component.promise ?? this.component.type ?? this.component.name, this.endpoint.name, this.parameters.typedParameters !== null ? this.parameters.typedParameters : void 0);
        if (t) {
            n.component.set(this.component.instance ?? this.component.type ?? this.component.name);
            n.endpoint.set(this.endpoint.instance ?? this.endpoint.name);
        }
        n.component.name = this.component.name;
        n.needsEndpointDescribed = this.needsEndpointDescribed;
        n.route = this.route;
        n.routeStart = this.routeStart;
        n.default = this.default;
        if (i) {
            n.scopeModifier = this.scopeModifier;
        }
        n.scope = t ? this.scope : null;
        if (this.hasNextScopeInstructions && !e) {
            n.nextScopeInstructions = RoutingInstruction.clone(this.nextScopeInstructions, t, i);
        }
        return n;
    }
    isIn(t, i, e) {
        const n = i.filter((i => {
            if (this.route != null || i.route != null) {
                if (!i.sameRoute(this)) {
                    return false;
                }
            } else {
                if (!i.sameComponent(t, this)) {
                    return false;
                }
            }
            const e = i.component.type ?? this.component.type;
            const n = this.component.type ?? i.component.type;
            const s = i.parameters.toSpecifiedParameters(t, e?.parameters);
            const r = this.parameters.toSpecifiedParameters(t, n?.parameters);
            if (!InstructionParameters.contains(s, r)) {
                return false;
            }
            return this.endpoint.none || i.sameEndpoint(this, false);
        }));
        if (n.length === 0) {
            return false;
        }
        if (!e || !this.hasNextScopeInstructions) {
            return true;
        }
        if (n.some((i => RoutingInstruction.contains(t, i.nextScopeInstructions ?? [], this.nextScopeInstructions, e)))) {
            return true;
        }
        return false;
    }
    getTitle(t) {
        if (this.route instanceof FoundRoute) {
            const i = this.route.match?.title;
            if (i != null) {
                if (this.routeStart) {
                    return typeof i === "string" ? i : i(this, t);
                } else {
                    return "";
                }
            }
        }
        return this.endpoint.instance.getTitle(t);
    }
    toJSON() {
        return {
            component: this.component.name ?? undefined,
            viewport: this.endpoint.name ?? undefined,
            parameters: this.parameters.parametersRecord ?? undefined,
            children: this.hasNextScopeInstructions ? this.nextScopeInstructions : undefined
        };
    }
    stringifyShallow(t, i = false, e = false) {
        if (this.route != null) {
            const i = this.route instanceof FoundRoute ? this.route.matching : this.route;
            return i.split("/").map((i => i.startsWith(":") ? this.parameters.get(t, i.slice(1)) : i)).join("/");
        }
        const n = Separators.for(t);
        let s = !e ? this.component.name ?? "" : "";
        const r = this.component.type ? this.component.type.parameters : null;
        const o = InstructionParameters.stringify(t, this.parameters.toSortedParameters(t, r));
        if (o.length > 0) {
            s += !e ? `${n.parameters}${o}${n.parametersEnd}` : o;
        }
        if (this.endpoint.name != null && !i) {
            s += `${n.viewport}${this.endpoint.name}`;
        }
        if (!this.ownsScope) {
            s += n.noScope;
        }
        return s || "";
    }
}

class NavigatorNavigateEvent {
    constructor(t, i) {
        this.eventName = t;
        this.navigation = i;
    }
    static create(t) {
        return new NavigatorNavigateEvent(NavigatorNavigateEvent.eventName, t);
    }
}

NavigatorNavigateEvent.eventName = "au:router:navigation-navigate";

let k = class Navigator {
    constructor(t, i) {
        this.ea = t;
        this.container = i;
        this.lastNavigationIndex = -1;
        this.navigations = [];
        this.options = {
            statefulHistoryLength: 0
        };
        this.isActive = false;
        this.uninitializedNavigation = Navigation.create({
            instruction: "NAVIGATOR UNINITIALIZED",
            fullStateInstruction: "",
            index: 0,
            completed: true
        });
        this.lastNavigationIndex = -1;
    }
    start(t) {
        if (this.isActive) {
            throw new Error("Navigator has already been started");
        }
        this.isActive = true;
        this.options = {
            ...t
        };
    }
    stop() {
        if (!this.isActive) {
            throw new Error("Navigator has not been started");
        }
        this.isActive = false;
    }
    navigate(t) {
        if (!(t instanceof Navigation)) {
            t = Navigation.create(t);
        }
        const i = new NavigationFlags;
        if (this.lastNavigationIndex === -1) {
            this.loadState();
            if (this.lastNavigationIndex !== -1) {
                i.refresh = true;
            } else {
                i.first = true;
                i.new = true;
                this.lastNavigationIndex = 0;
                this.navigations = [ Navigation.create({
                    index: 0,
                    instruction: "",
                    fullStateInstruction: ""
                }) ];
            }
        }
        if (t.index !== void 0 && !(t.replacing ?? false) && !(t.refreshing ?? false)) {
            t.historyMovement = t.index - Math.max(this.lastNavigationIndex, 0);
            t.instruction = this.navigations[t.index] != null ? this.navigations[t.index].fullStateInstruction : t.fullStateInstruction;
            t.replacing = true;
            if (t.historyMovement > 0) {
                i.forward = true;
            } else if (t.historyMovement < 0) {
                i.back = true;
            }
        } else if ((t.refreshing ?? false) || i.refresh) {
            t = this.navigations[this.lastNavigationIndex];
            t.replacing = true;
            t.refreshing = true;
        } else if (t.replacing ?? false) {
            i.replace = true;
            i.new = true;
            t.index = this.lastNavigationIndex;
        } else {
            i.new = true;
            t.index = this.lastNavigationIndex + 1;
            this.navigations[t.index] = t;
        }
        t.navigation = i;
        t.previous = this.navigations[Math.max(this.lastNavigationIndex, 0)];
        t.process = new OpenPromise;
        this.lastNavigationIndex = t.index;
        this.notifySubscribers(t);
        return t.process.promise;
    }
    async finalize(t, i) {
        if (t.untracked ?? false) {
            if ((t.fromBrowser ?? false) && this.options.store != null) {
                await this.options.store.popNavigatorState();
            }
        } else if (t.replacing ?? false) {
            if ((t.historyMovement ?? 0) === 0) {
                this.navigations[t.previous.index] = t;
            }
            await this.saveState(t.index, false);
        } else {
            const e = t.index;
            if (i) {
                this.navigations = this.navigations.slice(0, e);
            }
            this.navigations[e] = t;
            if ((this.options.statefulHistoryLength ?? 0) > 0) {
                const t = this.navigations.length - (this.options.statefulHistoryLength ?? 0);
                for (const i of this.navigations.slice(e)) {
                    if (typeof i.instruction !== "string" || typeof i.fullStateInstruction !== "string") {
                        await this.serializeNavigation(i, this.navigations.slice(t, e));
                    }
                }
            }
            await this.saveState(t.index, !(t.fromBrowser ?? false));
        }
    }
    async cancel(t) {
        if (this.options.store != null) {
            if (t.navigation?.new) {
                if (t.fromBrowser ?? false) {
                    await this.options.store.popNavigatorState();
                }
            } else if ((t.historyMovement ?? 0) !== 0) {
                await this.options.store.go(-t.historyMovement, true);
            }
        }
    }
    async go(t) {
        let i = this.lastNavigationIndex + t;
        i = Math.min(i, this.navigations.length - 1);
        await this.options.store.go(t, true);
        const e = this.navigations[i];
        return this.navigate(e);
    }
    getState() {
        const t = this.options.store != null ? {
            ...this.options.store.state
        } : {};
        const i = t?.navigations ?? [];
        const e = t?.navigationIndex ?? -1;
        return {
            navigations: i,
            navigationIndex: e
        };
    }
    loadState() {
        const {navigations: t, navigationIndex: i} = this.getState();
        this.navigations = t.map((t => Navigation.create(t)));
        this.lastNavigationIndex = i;
    }
    async saveState(t, i) {
        for (let t = 0; t < this.navigations.length; t++) {
            this.navigations[t] = Navigation.create(this.navigations[t].toStoredNavigation());
        }
        if ((this.options.statefulHistoryLength ?? 0) > 0) {
            const t = this.navigations.length - (this.options.statefulHistoryLength ?? 0);
            for (let i = 0; i < t; i++) {
                const e = this.navigations[i];
                if (typeof e.instruction !== "string" || typeof e.fullStateInstruction !== "string") {
                    await this.serializeNavigation(e, this.navigations.slice(t));
                }
            }
        }
        if (this.options.store == null) {
            return Promise.resolve();
        }
        const e = {
            navigations: (this.navigations ?? []).map((t => this.toStoreableNavigation(t))),
            navigationIndex: t
        };
        if (i) {
            return this.options?.store?.pushNavigatorState(e);
        } else {
            return this.options.store.replaceNavigatorState(e);
        }
    }
    async refresh() {
        if (this.lastNavigationIndex === -1) {
            return Promise.reject();
        }
        const t = this.navigations[this.lastNavigationIndex];
        t.replacing = true;
        t.refreshing = true;
        return this.navigate(t);
    }
    notifySubscribers(t) {
        this.ea.publish(NavigatorNavigateEvent.eventName, NavigatorNavigateEvent.create(t));
    }
    toStoreableNavigation(t) {
        const i = t instanceof Navigation ? t.toStoredNavigation() : t;
        i.instruction = RoutingInstruction.stringify(this.container, i.instruction);
        i.fullStateInstruction = RoutingInstruction.stringify(this.container, i.fullStateInstruction, false, true);
        if (typeof i.scope !== "string") {
            i.scope = null;
        }
        return i;
    }
    async serializeNavigation(t, i) {
        let e = [];
        for (const t of i) {
            if (typeof t.instruction !== "string") {
                e.push(...RoutingInstruction.flat(t.instruction).filter((t => t.endpoint.instance !== null)).map((t => t.component.instance)));
            }
            if (typeof t.fullStateInstruction !== "string") {
                e.push(...RoutingInstruction.flat(t.fullStateInstruction).filter((t => t.endpoint.instance !== null)).map((t => t.component.instance)));
            }
        }
        e = arrayUnique(e);
        let n = [];
        if (typeof t.fullStateInstruction !== "string") {
            n.push(...t.fullStateInstruction);
            t.fullStateInstruction = RoutingInstruction.stringify(this.container, t.fullStateInstruction, false, true);
        }
        if (typeof t.instruction !== "string") {
            n.push(...t.instruction);
            t.instruction = RoutingInstruction.stringify(this.container, t.instruction);
        }
        n = n.filter(((t, i, e) => t.component.instance != null && e.indexOf(t) === i));
        const s = [];
        for (const t of n) {
            await this.freeInstructionComponents(t, e, s);
        }
    }
    freeInstructionComponents(t, i, e) {
        const n = t.component.instance;
        const s = t.viewport?.instance ?? null;
        if (n === null || s === null || e.some((t => t === n))) {
            return;
        }
        if (!i.some((t => t === n))) {
            return Runner.run(null, (t => s.freeContent(t, n)), (() => {
                e.push(n);
            }));
        }
        if (t.hasNextScopeInstructions) {
            for (const n of t.nextScopeInstructions) {
                return this.freeInstructionComponents(n, i, e);
            }
        }
    }
};

k = __decorate([ __param(0, i), __param(1, e) ], k);

const $ = E;

const P = C;

const A = S;

const V = N;

class Collection extends Array {
    constructor() {
        super(...arguments);
        this.currentIndex = -1;
    }
    next() {
        if (this.length > this.currentIndex + 1) {
            return this[++this.currentIndex];
        } else {
            this.currentIndex = -1;
            return null;
        }
    }
    removeCurrent() {
        this.splice(this.currentIndex--, 1);
    }
    remove(t) {
        arrayRemove(this, (i => i === t));
    }
}

class EndpointMatcher {
    static matchEndpoints(t, i, e, n = false) {
        const s = [];
        const r = t.getOwnedRoutingScopes(Infinity);
        const o = r.map((t => t.endpoint));
        const h = o.filter((t => t !== null && !e.some((i => t === i.endpoint.instance && !i.cancelled))));
        const u = new Collection(...i.slice());
        let a = null;
        EndpointMatcher.matchKnownEndpoints(t.router, "ViewportScope", u, h, s, false);
        if (!n) {
            EndpointMatcher.matchKnownEndpoints(t.router, "Viewport", u, h, s, false);
        }
        EndpointMatcher.matchViewportScopeSegment(t.router, t, u, h, s);
        while ((a = u.next()) !== null) {
            a.needsEndpointDescribed = true;
        }
        EndpointMatcher.matchViewportConfiguration(u, h, s);
        if (!n) {
            EndpointMatcher.matchSpecifiedViewport(u, h, s, false);
        }
        EndpointMatcher.matchLastViewport(u, h, s);
        if (n) {
            EndpointMatcher.matchSpecifiedViewport(u, h, s, false);
        }
        return {
            matchedInstructions: s,
            remainingInstructions: [ ...u ]
        };
    }
    static matchKnownEndpoints(t, i, e, n, s, r = false) {
        let o;
        while ((o = e.next()) !== null) {
            if (o.endpoint.instance !== null && !o.isAdd(t) && o.endpoint.endpointType === i) {
                EndpointMatcher.matchEndpoint(o, o.endpoint.instance, r);
                s.push(o);
                arrayRemove(n, (t => t === o.endpoint.instance));
                e.removeCurrent();
            }
        }
    }
    static matchViewportScopeSegment(t, i, e, n, s) {
        let r;
        while ((r = e.next()) !== null) {
            for (let o of n) {
                if (!(o instanceof ViewportScope)) {
                    continue;
                }
                if (o.acceptSegment(r.component.name)) {
                    if (Array.isArray(o.source)) {
                        let e = n.find((t => t instanceof ViewportScope && t.name === o.name));
                        if (e === void 0 || r.isAdd(t)) {
                            const t = o.addSourceItem();
                            e = i.getOwnedScopes().filter((t => t.isViewportScope)).map((t => t.endpoint)).find((i => i.sourceItem === t));
                        }
                        o = e;
                    }
                    EndpointMatcher.matchEndpoint(r, o, false);
                    s.push(r);
                    arrayRemove(n, (t => t === r.endpoint.instance));
                    e.removeCurrent();
                    break;
                }
            }
        }
    }
    static matchViewportConfiguration(t, i, e) {
        let n;
        while ((n = t.next()) !== null) {
            for (const s of i) {
                if (!(s instanceof Viewport)) {
                    continue;
                }
                if (s?.wantComponent(n.component.name)) {
                    EndpointMatcher.matchEndpoint(n, s, true);
                    e.push(n);
                    arrayRemove(i, (t => t === n.endpoint.instance));
                    t.removeCurrent();
                    break;
                }
            }
        }
    }
    static matchSpecifiedViewport(t, i, e, n) {
        let s;
        while ((s = t.next()) !== null) {
            let r = s.endpoint.instance;
            if (r == null) {
                const t = s.endpoint.name;
                if ((t?.length ?? 0) === 0) {
                    continue;
                }
                for (const e of i) {
                    if (!(e instanceof Viewport)) {
                        continue;
                    }
                    if (t === e.name) {
                        r = e;
                        break;
                    }
                }
            }
            if (r?.acceptComponent(s.component.name)) {
                EndpointMatcher.matchEndpoint(s, r, n);
                e.push(s);
                arrayRemove(i, (t => t === s.endpoint.instance));
                t.removeCurrent();
            }
        }
    }
    static matchLastViewport(t, i, e) {
        let n;
        while ((n = t.next()) !== null) {
            const s = [];
            for (const t of i) {
                if (!(t instanceof Viewport)) {
                    continue;
                }
                if (t.acceptComponent(n.component.name)) {
                    s.push(t);
                }
            }
            if (s.length === 1) {
                const r = s[0];
                EndpointMatcher.matchEndpoint(n, r, true);
                e.push(n);
                arrayRemove(i, (t => t === n.endpoint.instance));
                t.removeCurrent();
            }
        }
    }
    static matchEndpoint(t, i, e) {
        t.endpoint.set(i);
        if (e) {
            t.needsEndpointDescribed = false;
        }
        if (t.hasNextScopeInstructions) {
            t.nextScopeInstructions.forEach((t => {
                if (t.scope === null) {
                    t.scope = i instanceof Viewport ? i.scope : i.scope.scope;
                }
            }));
        }
    }
}

class RoutingScope {
    constructor(t, i, e, n) {
        this.router = t;
        this.hasScope = i;
        this.owningScope = e;
        this.endpointContent = n;
        this.id = -1;
        this.parent = null;
        this.children = [];
        this.id = ++RoutingScope.lastId;
        this.owningScope = e ?? this;
    }
    static for(t, i) {
        if (t == null) {
            return {
                scope: null,
                instruction: i
            };
        }
        if (t instanceof RoutingScope || t instanceof Viewport || t instanceof ViewportScope) {
            return {
                scope: t.scope,
                instruction: i
            };
        }
        let e;
        if ("res" in t) {
            e = t;
        } else {
            if ("container" in t) {
                e = t.container;
            } else if ("$controller" in t) {
                e = t.$controller.container;
            } else {
                const i = r.for(t, {
                    searchParents: true
                });
                e = i?.container;
            }
        }
        if (e == null) {
            return {
                scope: null,
                instruction: i
            };
        }
        const n = e.has(Router.closestEndpointKey, true) ? e.get(Router.closestEndpointKey) : null;
        let s = n?.scope ?? null;
        if (s === null || i === undefined) {
            const t = i ?? "";
            return {
                scope: s,
                instruction: t.startsWith("/") ? t.slice(1) : i
            };
        }
        if (i.startsWith("/")) {
            return {
                scope: null,
                instruction: i.slice(1)
            };
        }
        while (i.startsWith(".")) {
            if (i.startsWith("./")) {
                i = i.slice(2);
            } else if (i.startsWith("../")) {
                s = s.parent ?? s;
                i = i.slice(3);
            } else {
                break;
            }
        }
        return {
            scope: s,
            instruction: i
        };
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
        return this.isViewport ? "Viewport" : "ViewportScope";
    }
    get enabled() {
        return this.endpointContent.isActive;
    }
    get passThroughScope() {
        return this.isViewportScope && this.endpoint.passThroughScope;
    }
    get pathname() {
        return `${this.owningScope !== this ? this.owningScope.pathname : ""}/${this.endpoint.name}`;
    }
    get path() {
        const t = this.parent?.path ?? "";
        const i = this.routingInstruction?.stringify(this.router, false, true, true) ?? "";
        const e = this.routingInstruction ? Separators.for(this.router).scope : "";
        return `${t}${i}${e}`;
    }
    toString(t = false) {
        return `${this.owningScope !== this ? this.owningScope.toString() : ""}/${!this.enabled ? "(" : ""}${this.endpoint.toString()}#${this.id}${!this.enabled ? ")" : ""}` + `${t ? `\n` + this.children.map((t => t.toString(true))).join("") : ""}`;
    }
    toStringOwning(t = false) {
        return `${this.owningScope !== this ? this.owningScope.toString() : ""}/${!this.enabled ? "(" : ""}${this.endpoint.toString()}#${this.id}${!this.enabled ? ")" : ""}` + `${t ? `\n` + this.ownedScopes.map((t => t.toStringOwning(true))).join("") : ""}`;
    }
    get enabledChildren() {
        return this.children.filter((t => t.enabled));
    }
    get hoistedChildren() {
        const t = this.enabledChildren;
        while (t.some((t => t.passThroughScope))) {
            for (const i of t.slice()) {
                if (i.passThroughScope) {
                    const e = t.indexOf(i);
                    t.splice(e, 1, ...i.enabledChildren);
                }
            }
        }
        return t;
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
    getOwnedScopes(t = false) {
        const i = this.allScopes(t).filter((t => t.owningScope === this));
        for (const t of i.slice()) {
            if (t.passThroughScope) {
                const e = i.indexOf(t);
                i.splice(e, 1, ...t.getOwnedScopes());
            }
        }
        return i;
    }
    async processInstructions(t, i, e, n, s = "") {
        const r = this.router;
        const o = r.configuration.options;
        const h = t.filter((t => !(t.route instanceof Route)));
        if (h.length > 0) {
            const i = this.findInstructions(h, o.useDirectRouting, o.useConfiguredRoutes);
            if (h.some((t => !t.component.none || t.route != null)) && !i.foundConfiguration && !i.foundInstructions) {
                this.unknownRoute(h);
            }
            t = [ ...t.filter((t => t.route instanceof Route)), ...i.instructions ];
            if (t.some((t => t.scope !== this))) {
                console.warn("Not the current scope for instruction(s)!", this, t);
            }
            if (i.foundConfiguration) {
                s = (s ?? "") + i.matching;
            }
        }
        const u = RoutingInstruction.resolve(t);
        if (u instanceof Promise) {
            await u;
        }
        if (!o.additiveInstructionDefault) {
            t = this.ensureClearStateInstruction(t);
        }
        let a = [];
        ({clearEndpoints: a, instructions: t} = this.getClearAllEndpoints(t));
        for (const i of t.filter((t => t.isAddAll(r)))) {
            i.endpoint.set(i.scope.endpoint.name);
            i.scope = i.scope.owningScope;
        }
        let l = [];
        let {matchedInstructions: c, remainingInstructions: f} = this.matchEndpoints(t, i);
        let d = 100;
        do {
            if (!d--) {
                r.unresolvedInstructionsError(e, f);
            }
            const o = [];
            const h = c.map((t => t.endpoint.instance));
            c.push(...a.filter((t => !h.includes(t))).map((t => RoutingInstruction.createClear(r, t))));
            const u = await RoutingHook.invokeBeforeNavigation(c, e);
            if (u === false) {
                r.cancelNavigation(e, n);
                return [];
            } else if (u !== true && u !== c) {
                const t = RoutingInstruction.flat(c);
                f = f.filter((i => !t.includes(i)));
                c = u;
            }
            for (const t of c) {
                const h = t.endpoint.instance;
                if (h !== null) {
                    const u = h.setNextContent(t, e);
                    if (u !== "skip") {
                        o.push(h);
                        n.addEndpoint(h);
                    }
                    const f = [ h ];
                    if (u === "swap") {
                        f.push(...h.getContent().connectedScope.allScopes(true).map((t => t.endpoint)));
                    }
                    arrayRemove(a, (t => f.includes(t)));
                    arrayRemove(c, (i => i !== t && i.isClear(r) && f.includes(i.endpoint.instance)));
                    if (!t.isClear(r) && t.scope?.parent?.isViewportScope) {
                        arrayRemove(a, (i => i === t.scope.parent.endpoint));
                        arrayRemove(c, (i => i !== t && i.isClear(r) && i.endpoint.instance === t.scope.parent.endpoint));
                    }
                    if (u !== "skip" && t.hasNextScopeInstructions) {
                        for (const i of t.nextScopeInstructions) {
                            i.scope = h.scope;
                            i.endpoint.instance = null;
                        }
                    }
                    if (u === "skip" && !t.hasNextScopeInstructions) {
                        l.push(...await h.scope.processInstructions([], i, e, n, s));
                    }
                }
            }
            const p = c.filter((t => t.endpoint.instance?.transitionAction === "skip"));
            const g = p.filter((t => t.hasNextScopeInstructions));
            if (p.length === 0 || g.length === 0) {
                if (!r.isRestrictedNavigation) {
                    n.finalEndpoint();
                }
                n.run();
                if (n.hasAllEndpoints) {
                    const t = n.waitForSyncState("guardedUnload");
                    if (t instanceof Promise) {
                        await t;
                    }
                }
            }
            if (n.cancelled) {
                r.cancelNavigation(e, n);
                return [];
            }
            for (const t of o) {
                if (l.every((i => i !== t))) {
                    l.push(t);
                }
            }
            i.push(...c.splice(0));
            if (f.length > 0) {
                ({matchedInstructions: c, remainingInstructions: f} = this.matchEndpoints(f, i));
            }
            if (!r.isRestrictedNavigation && (c.length > 0 || f.length > 0) && n.running) {
                const t = n.waitForSyncState("swapped");
                if (t instanceof Promise) {
                    await t;
                }
            }
            if (c.length === 0 && f.length === 0) {
                const r = [];
                for (const o of t) {
                    if (!o.hasNextScopeInstructions) {
                        continue;
                    }
                    const t = o.endpoint.instance?.scope ?? o.endpoint.scope;
                    r.push(t.processInstructions(o.nextScopeInstructions, i, e, n, s));
                }
                l.push(...(await Promise.all(r)).flat());
            }
            ({matchedInstructions: c, remainingInstructions: f} = n.dequeueAppendedInstructions(c, i, f));
            if (c.length === 0 && f.length === 0) {
                const t = i.map((t => t.endpoint.instance?.connectedCE.pendingPromise?.promise)).filter((t => t != null));
                if (t.length > 0) {
                    await Promise.any(t);
                    ({matchedInstructions: c, remainingInstructions: f} = n.dequeueAppendedInstructions(c, i, f));
                } else {
                    c = a.map((t => RoutingInstruction.createClear(r, t)));
                }
            }
            const v = RoutingInstruction.resolve(c);
            if (v instanceof Promise) {
                await v;
            }
            l = l.filter((t => !([ ...i ].reverse().find((i => i.endpoint.instance === t))?.cancelled ?? false)));
        } while (c.length > 0 || f.length > 0);
        return l;
    }
    unknownRoute(t) {
        const i = this.router.configuration.options;
        const e = RoutingInstruction.stringify(this.router, t);
        if (t[0].route != null) {
            if (!i.useConfiguredRoutes) {
                throw new Error("Can not match '" + e + "' since the router is configured to not use configured routes.");
            } else {
                throw new Error("No matching configured route found for '" + e + "'.");
            }
        } else if (i.useConfiguredRoutes && i.useDirectRouting) {
            throw new Error("No matching configured route or component found for '" + e + "'.");
        } else if (i.useConfiguredRoutes) {
            throw new Error("No matching configured route found for '" + e + "'.");
        } else {
            throw new Error("No matching route/component found for '" + e + "'.");
        }
    }
    ensureClearStateInstruction(t) {
        const i = this.router;
        if (!t.some((t => t.isClearAll(i)))) {
            const e = RoutingInstruction.create(RoutingInstruction.clear(i));
            e.scope = this;
            return [ e, ...t ];
        }
        return t;
    }
    getClearAllEndpoints(t) {
        const i = this.router;
        let e = [];
        if (t.some((t => (t.scope ?? this) === this && t.isClearAll(i)))) {
            e = this.enabledChildren.filter((t => !t.endpoint.isEmpty)).map((t => t.endpoint));
            t = t.filter((t => !((t.scope ?? this) === this && t.isClearAll(i))));
        }
        return {
            clearEndpoints: e,
            instructions: t
        };
    }
    findInstructions(t, i, e) {
        const n = this.router;
        let s = new FoundRoute;
        if (e && !RoutingInstruction.containsSiblings(n, t)) {
            let e = t.filter((t => t.isClear(n) || t.isClearAll(n)));
            const r = t.filter((t => !t.isClear(n) && !t.isClearAll(n)));
            if (r.length > 0) {
                for (const o of r) {
                    const r = typeof o.route === "string" ? o.route : o.unparsed ?? RoutingInstruction.stringify(n, [ o ]);
                    const h = this.findMatchingRoute(r, o.parameters.parametersRecord ?? {});
                    if (h.foundConfiguration) {
                        s = h;
                        s.instructions = [ ...e, ...s.instructions ];
                        e = [];
                    } else if (i) {
                        s.instructions = [ ...e, ...s.instructions, o ];
                        e = [];
                        s.remaining = RoutingInstruction.stringify(n, o.nextScopeInstructions ?? []);
                    } else {
                        throw new Error(`No route found for: ${RoutingInstruction.stringify(n, t)}!`);
                    }
                }
            } else {
                s.instructions = [ ...e ];
            }
        } else if (i) {
            s.instructions.push(...t);
        } else {
            throw new Error(`No way to process sibling viewport routes with direct routing disabled: ${RoutingInstruction.stringify(n, t)}!`);
        }
        s.instructions = s.instructions.filter((t => t.component.name !== ""));
        for (const t of s.instructions) {
            if (t.scope === null) {
                t.scope = this;
            }
        }
        return s;
    }
    matchEndpoints(t, i, e = false) {
        const n = [];
        const s = t.filter((t => (t.scope ?? this) === this));
        const r = t.filter((t => (t.scope ?? this) !== this));
        const {matchedInstructions: o, remainingInstructions: h} = EndpointMatcher.matchEndpoints(this, s, i, e);
        n.push(...o);
        r.push(...h);
        return {
            matchedInstructions: n,
            remainingInstructions: r
        };
    }
    addEndpoint(t, i, e, n = {}) {
        let s = this.getOwnedScopes().find((e => e.type === t && e.endpoint.name === i))?.endpoint ?? null;
        if (e != null && s?.connectedCE != null && s.connectedCE !== e) {
            s = this.getOwnedScopes(true).find((n => n.type === t && n.endpoint.name === i && n.endpoint.connectedCE === e))?.endpoint ?? null;
        }
        if (s == null) {
            s = t === "Viewport" ? new Viewport(this.router, i, e, this.scope, !!n.scope, n) : new ViewportScope(this.router, i, e, this.scope, true, null, n);
            this.addChild(s.connectedScope);
        }
        if (e != null) {
            s.setConnectedCE(e, n);
        }
        return s;
    }
    removeEndpoint(t, i, e) {
        if ((e ?? null) !== null || i.removeEndpoint(t, e)) {
            this.removeChild(i.connectedScope);
            return true;
        }
        return false;
    }
    addChild(t) {
        if (!this.children.some((i => i === t))) {
            if (t.parent !== null) {
                t.parent.removeChild(t);
            }
            this.children.push(t);
            t.parent = this;
        }
    }
    removeChild(t) {
        const i = this.children.indexOf(t);
        if (i >= 0) {
            this.children.splice(i, 1);
            t.parent = null;
        }
    }
    allScopes(t = false) {
        const i = t ? this.children.slice() : this.enabledChildren;
        for (const e of i.slice()) {
            i.push(...e.allScopes(t));
        }
        return i;
    }
    reparentRoutingInstructions() {
        const t = this.hoistedChildren.filter((t => t.routingInstruction !== null && t.routingInstruction.component.name));
        if (!t.length) {
            return null;
        }
        for (const i of t) {
            const t = i.reparentRoutingInstructions();
            i.routingInstruction.nextScopeInstructions = t !== null && t.length > 0 ? t : null;
        }
        return t.map((t => t.routingInstruction));
    }
    getChildren(t) {
        const i = this.children.map((i => i.endpoint.getTimeContent(t))).filter((t => t !== null));
        return i.map((t => t.connectedScope));
    }
    getAllRoutingScopes(t) {
        const i = this.getChildren(t);
        for (const e of i.slice()) {
            i.push(...e.getAllRoutingScopes(t));
        }
        return i;
    }
    getOwnedRoutingScopes(t) {
        const i = this.getAllRoutingScopes(t).filter((t => t.owningScope === this));
        for (const e of i.slice()) {
            if (e.passThroughScope) {
                const n = i.indexOf(e);
                i.splice(n, 1, ...e.getOwnedRoutingScopes(t));
            }
        }
        return arrayUnique(i);
    }
    getRoutingInstructions(t) {
        const i = arrayUnique(this.getOwnedRoutingScopes(t).map((t => t.endpoint))).map((i => i.getTimeContent(t))).filter((t => t !== null));
        const e = [];
        for (const n of i) {
            const i = n.instruction.clone(true, false, false);
            if ((i.component.name ?? "") !== "") {
                i.nextScopeInstructions = n.connectedScope.getRoutingInstructions(t);
                e.push(i);
            }
        }
        return e;
    }
    canUnload(t, i) {
        return Runner.run(i, (i => Runner.runParallel(i, ...this.children.map((i => i.endpoint !== null ? e => i.endpoint.canUnload(t, e) : e => i.canUnload(t, e))))), (t => t.previousValue.every((t => t))));
    }
    unload(t, i) {
        return Runner.runParallel(i, ...this.children.map((i => i.endpoint !== null ? e => i.endpoint.unload(t, e) : e => i.unload(t, e))));
    }
    matchScope(t, i = false) {
        const e = [];
        for (const n of t) {
            if (n.scope === this) {
                e.push(n);
            } else if (i && n.hasNextScopeInstructions) {
                e.push(...this.matchScope(n.nextScopeInstructions, i));
            }
        }
        return e;
    }
    findMatchingRoute(t, i) {
        let e = new FoundRoute;
        if (this.isViewportScope && !this.passThroughScope) {
            e = this.findMatchingRouteInRoutes(t, this.endpoint.getRoutes(), i);
        } else if (this.isViewport) {
            e = this.findMatchingRouteInRoutes(t, this.endpoint.getRoutes(), i);
        } else {
            for (const n of this.enabledChildren) {
                e = n.findMatchingRoute(t, i);
                if (e.foundConfiguration) {
                    break;
                }
            }
        }
        if (e.foundConfiguration) {
            return e;
        }
        if (this.parent != null) {
            return this.parent.findMatchingRoute(t, i);
        }
        return e;
    }
    findMatchingRouteInRoutes(t, i, e) {
        const n = new FoundRoute;
        if (i.length === 0) {
            return n;
        }
        i = i.map((t => this.ensureProperRoute(t)));
        const s = [];
        for (const t of i) {
            const i = Array.isArray(t.path) ? t.path : [ t.path ];
            for (const e of i) {
                s.push({
                    ...t,
                    path: e,
                    handler: t
                });
                if (e !== "") {
                    s.push({
                        ...t,
                        path: `${e}/*remainingPath`,
                        handler: t
                    });
                }
            }
        }
        if (t.startsWith("/") || t.startsWith("+")) {
            t = t.slice(1);
        }
        const r = i.find((i => i.id === t));
        let o = {
            params: {},
            endpoint: {}
        };
        if (r != null) {
            o.endpoint = {
                route: {
                    handler: r
                }
            };
            t = Array.isArray(r.path) ? r.path[0] : r.path;
            const i = t.split("/").map((t => {
                if (t.startsWith(":")) {
                    const i = t.slice(1).replace(/\?$/, "");
                    const n = e[i];
                    o.params[i] = n;
                    return n;
                } else {
                    return t;
                }
            }));
            t = i.join("/");
        } else {
            const i = new $;
            i.add(s);
            o = i.recognize(t);
        }
        if (o != null) {
            n.match = o.endpoint.route.handler;
            n.matching = t;
            const s = {
                ...o.params
            };
            if (s.remainingPath != null) {
                n.remaining = s.remainingPath;
                Reflect.deleteProperty(s, "remainingPath");
                n.matching = n.matching.slice(0, n.matching.indexOf(n.remaining));
            }
            n.params = s;
            if (n.match?.redirectTo != null) {
                let t = n.match?.redirectTo;
                if ((n.remaining ?? "").length > 0) {
                    t += `/${n.remaining}`;
                }
                return this.findMatchingRouteInRoutes(t, i, e);
            }
        }
        if (n.foundConfiguration) {
            n.instructions = RoutingInstruction.clone(n.match.instructions, false, true);
            const t = n.instructions.slice();
            while (t.length > 0) {
                const i = t.shift();
                i.parameters.addParameters(n.params);
                i.route = n;
                if (i.hasNextScopeInstructions) {
                    t.unshift(...i.nextScopeInstructions);
                }
            }
            if (n.instructions.length > 0) {
                n.instructions[0].routeStart = true;
            }
            const i = RoutingInstruction.parse(this.router, n.remaining);
            if (i.length > 0) {
                let t = n.instructions[0];
                while (t.hasNextScopeInstructions) {
                    t = t.nextScopeInstructions[0];
                }
                t.nextScopeInstructions = i;
            }
        }
        return n;
    }
    ensureProperRoute(t) {
        if (t.id === void 0) {
            t.id = Array.isArray(t.path) ? t.path.join(",") : t.path;
        }
        if (t.instructions === void 0) {
            t.instructions = [ {
                component: t.component,
                viewport: t.viewport,
                parameters: t.parameters,
                children: t.children
            } ];
        }
        if (t.redirectTo === null) {
            t.instructions = RoutingInstruction.from(this.router, t.instructions);
        }
        return t;
    }
}

RoutingScope.lastId = 0;

class QueueTask {
    constructor(t, i, e = 0) {
        this.taskQueue = t;
        this.item = i;
        this.cost = e;
        this.done = false;
        this.promise = new Promise(((t, i) => {
            this.resolve = () => {
                this.taskQueue.resolve(this, t);
            };
            this.reject = t => {
                this.taskQueue.reject(this, i, t);
            };
        }));
    }
    async execute() {
        if ("execute" in this.item) {
            await this.item.execute(this);
        } else {
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
    constructor(t) {
        this.callback = t;
        this.pending = [];
        this.processing = null;
        this.allowedExecutionCostWithinTick = null;
        this.currentExecutionCostInCurrentTick = 0;
        this.platform = null;
        this.task = null;
        this.dequeue = t => {
            if (this.processing !== null) {
                return;
            }
            if (t !== undefined) {
                this.currentExecutionCostInCurrentTick = 0;
            }
            if (this.pending.length === 0) {
                return;
            }
            if (this.allowedExecutionCostWithinTick !== null && t === undefined && this.currentExecutionCostInCurrentTick + (this.pending[0].cost || 0) > this.allowedExecutionCostWithinTick) {
                return;
            }
            this.processing = this.pending.shift() || null;
            if (this.processing) {
                this.currentExecutionCostInCurrentTick += this.processing.cost ?? 0;
                if (this.callback !== void 0) {
                    this.callback(this.processing);
                } else {
                    this.processing.execute().catch((t => {
                        throw t;
                    }));
                }
            }
        };
    }
    get length() {
        return this.pending.length;
    }
    start(t) {
        this.platform = t.platform;
        this.allowedExecutionCostWithinTick = t.allowedExecutionCostWithinTick;
        this.task = this.platform.domWriteQueue.queueTask(this.dequeue, {
            persistent: true
        });
    }
    stop() {
        this.task.cancel();
        this.task = null;
        this.allowedExecutionCostWithinTick = null;
        this.clear();
    }
    enqueue(t, i) {
        const e = Array.isArray(t);
        const n = e ? t : [ t ];
        const s = n.map(((t, e) => !Array.isArray(i) ? i : i[e])).map((t => t !== undefined ? t : 1));
        const r = [];
        for (const t of n) {
            r.push(t instanceof QueueTask ? t : this.createQueueTask(t, s.shift()));
        }
        this.pending.push(...r);
        this.dequeue();
        return e ? r : r[0];
    }
    createQueueTask(t, i) {
        return new QueueTask(this, t, i);
    }
    clear() {
        this.pending.length = 0;
    }
    resolve(t, i) {
        i();
        this.processing = null;
        this.dequeue();
    }
    reject(t, i, e) {
        i(e);
        this.processing = null;
        this.dequeue();
    }
}

let T = class BrowserViewerStore {
    constructor(t, i, e, n, s) {
        this.platform = t;
        this.window = i;
        this.history = e;
        this.location = n;
        this.ea = s;
        this.allowedExecutionCostWithinTick = 2;
        this.isActive = false;
        this.options = {
            useUrlFragmentHash: true
        };
        this.forwardedState = {
            eventTask: null,
            suppressPopstate: false
        };
        this.pendingCalls = new TaskQueue;
    }
    start(t) {
        if (this.isActive) {
            throw new Error("Browser navigation has already been started");
        }
        this.isActive = true;
        if (t.useUrlFragmentHash != void 0) {
            this.options.useUrlFragmentHash = t.useUrlFragmentHash;
        }
        this.pendingCalls.start({
            platform: this.platform,
            allowedExecutionCostWithinTick: this.allowedExecutionCostWithinTick
        });
        this.window.addEventListener("popstate", this);
    }
    stop() {
        if (!this.isActive) {
            throw new Error("Browser navigation has not been started");
        }
        this.window.removeEventListener("popstate", this);
        this.pendingCalls.stop();
        this.options = {
            useUrlFragmentHash: true
        };
        this.isActive = false;
    }
    get length() {
        return this.history.length;
    }
    get state() {
        return this.history.state;
    }
    get viewerState() {
        const {pathname: t, search: i, hash: e} = this.location;
        const n = this.options.useUrlFragmentHash ?? false ? e.slice(1) : `${t}${i}`;
        const s = this.options.useUrlFragmentHash ?? false ? e.slice(1).includes("#") ? e.slice(e.slice(1).indexOf("#", 1)) : "" : e.slice(1);
        return new NavigatorViewerState(t, i.slice(1), s, n);
    }
    async go(t, i = false) {
        const e = this.pendingCalls.createQueueTask((t => t.resolve()), 1);
        this.pendingCalls.enqueue([ t => {
            const n = e;
            const s = i;
            this.forwardState({
                eventTask: n,
                suppressPopstate: s
            });
            t.resolve();
        }, i => {
            const e = this.history;
            const n = t;
            e.go(n);
            i.resolve();
        } ], [ 0, 1 ]);
        return e.wait();
    }
    async pushNavigatorState(t) {
        const {title: i, path: e} = t.navigations[t.navigationIndex];
        const n = this.options.useUrlFragmentHash ? "#/" : "";
        return this.pendingCalls.enqueue((s => {
            const r = this.history;
            const o = t;
            const h = i || "";
            const u = `${n}${e}`;
            try {
                r.pushState(o, h, u);
                this.setTitle(h);
            } catch (t) {
                const i = this.tryCleanState(o, "push", t);
                r.pushState(i, h, u);
                this.setTitle(h);
            }
            s.resolve();
        }), 1).wait();
    }
    async replaceNavigatorState(t, i, e) {
        const n = t.navigations[t.navigationIndex];
        i ?? (i = n.title);
        e ?? (e = n.path);
        const s = this.options.useUrlFragmentHash ? "#/" : "";
        return this.pendingCalls.enqueue((n => {
            const r = this.history;
            const o = t;
            const h = i || "";
            const u = `${s}${e}`;
            try {
                r.replaceState(o, h, u);
                this.setTitle(h);
            } catch (t) {
                const i = this.tryCleanState(o, "replace", t);
                r.replaceState(i, h, u);
                this.setTitle(h);
            }
            n.resolve();
        }), 1).wait();
    }
    async popNavigatorState() {
        const t = this.pendingCalls.createQueueTask((t => t.resolve()), 1);
        this.pendingCalls.enqueue((async i => {
            const e = t;
            await this.popState(e);
            i.resolve();
        }), 1);
        return t.wait();
    }
    setTitle(t) {
        this.window.document.title = t;
    }
    handleEvent(t) {
        this.handlePopStateEvent(t);
    }
    handlePopStateEvent(t) {
        const {eventTask: i, suppressPopstate: e} = this.forwardedState;
        this.forwardedState = {
            eventTask: null,
            suppressPopstate: false
        };
        this.pendingCalls.enqueue((async n => {
            if (!e) {
                this.notifySubscribers(t);
            }
            if (i !== null) {
                await i.execute();
            }
            n.resolve();
        }), 1);
    }
    notifySubscribers(t) {
        this.ea.publish(NavigatorStateChangeEvent.eventName, NavigatorStateChangeEvent.create(this.viewerState, t, this.history.state));
    }
    async popState(t) {
        await this.go(-1, true);
        const i = this.history.state;
        const e = i?.navigations?.[i?.navigationIndex ?? 0];
        if (e != null && !e.firstEntry) {
            await this.go(-1, true);
            await this.pushNavigatorState(i);
        }
        await t.execute();
    }
    forwardState(t) {
        this.forwardedState = t;
    }
    tryCleanState(t, i, e) {
        try {
            return JSON.parse(JSON.stringify(t));
        } catch (t) {
            throw new Error(`Failed to ${i} state, probably due to unserializable data and/or parameters: ${t}${e}`);
        }
    }
};

T = __decorate([ __param(0, u), __param(1, a), __param(2, l), __param(3, c), __param(4, i) ], T);

class NavigatorViewerState {
    constructor(t, i, e, n) {
        this.path = t;
        this.query = i;
        this.hash = e;
        this.instruction = n;
    }
}

class NavigatorStateChangeEvent {
    constructor(t, i, e, n) {
        this.eventName = t;
        this.viewerState = i;
        this.event = e;
        this.state = n;
    }
    static create(t, i, e) {
        return new NavigatorStateChangeEvent(NavigatorStateChangeEvent.eventName, t, i, e);
    }
}

NavigatorStateChangeEvent.eventName = "au:router:navigation-state-change";

class Entity {
    constructor(t) {
        this.endpoint = t;
        this.running = false;
        this.states = new Map;
        this.checkedStates = [];
        this.syncingState = null;
        this.syncPromise = null;
        this.step = null;
    }
    hasReachedState(t) {
        return this.states.has(t) && this.states.get(t) === null;
    }
}

class NavigationCoordinator {
    constructor(t, i) {
        this.router = t;
        this.navigation = i;
        this.running = false;
        this.completed = false;
        this.cancelled = false;
        this.hasAllEndpoints = false;
        this.appendedInstructions = [];
        this.entities = [];
        this.syncStates = new Map;
        this.checkedSyncStates = new Set;
    }
    static create(t, i, e) {
        const n = new NavigationCoordinator(t, i);
        e.syncStates.forEach((t => n.addSyncState(t)));
        return n;
    }
    run() {
        if (!this.running) {
            this.running = true;
            for (const t of this.entities) {
                if (!t.running) {
                    t.running = true;
                    t.endpoint.transition(this);
                }
            }
        }
    }
    addSyncState(t) {
        const i = new OpenPromise;
        this.syncStates.set(t, i);
    }
    addEndpoint(t) {
        const i = new Entity(t);
        this.entities.push(i);
        this.recheckSyncStates();
        if (this.running) {
            i.endpoint.transition(this);
        }
        return i;
    }
    removeEndpoint(t) {
        const i = this.entities.find((i => i.endpoint === t));
        if (i !== void 0) {
            arrayRemove(this.entities, (t => t === i));
        }
    }
    setEndpointStep(t, i) {
        let e = this.entities.find((i => i.endpoint === t));
        if (e === void 0) {
            e = this.addEndpoint(t);
        }
        e.step = i;
    }
    getEndpointStep(t) {
        const i = this.entities.find((i => i.endpoint === t));
        return i?.step ?? null;
    }
    addEndpointState(t, i) {
        let e = this.entities.find((i => i.endpoint === t));
        if (e === void 0) {
            e = this.addEndpoint(t);
        }
        const n = e.states.get(i);
        if (n instanceof OpenPromise) {
            n.resolve();
        }
        e.states.set(i, null);
        this.checkSyncState(i);
    }
    waitForSyncState(t, i = null) {
        if (this.entities.length === 0) {
            return;
        }
        const e = this.syncStates.get(t);
        if (e === void 0) {
            return;
        }
        if (i !== null) {
            const n = this.entities.find((t => t.endpoint === i));
            if (n?.syncPromise === null && e.isPending) {
                n.syncingState = t;
                n.syncPromise = new OpenPromise;
                n.checkedStates.push(t);
                this.checkedSyncStates.add(t);
                Promise.resolve().then((() => {
                    this.checkSyncState(t);
                })).catch((t => {
                    throw t;
                }));
                return n.syncPromise.promise;
            }
        }
        return e.isPending ? e.promise : void 0;
    }
    waitForEndpointState(t, i) {
        if (!this.syncStates.has(i)) {
            return;
        }
        let e = this.entities.find((i => i.endpoint === t));
        if (e == null) {
            e = this.addEndpoint(t);
        }
        if (e.hasReachedState(i)) {
            return;
        }
        let n = e.states.get(i);
        if (n == null) {
            n = new OpenPromise;
            e.states.set(i, n);
        }
        return n.promise;
    }
    finalEndpoint() {
        this.hasAllEndpoints = true;
        this.syncStates.forEach(((t, i) => this.checkSyncState(i)));
    }
    finalize() {
        this.entities.forEach((t => t.endpoint.finalizeContentChange(this, null)));
        this.completed = true;
        this.navigation.completed = true;
    }
    cancel() {
        this.cancelled = true;
        this.entities.forEach((t => {
            const i = t.endpoint.cancelContentChange(this);
            if (i instanceof Promise) {
                i.catch((t => {
                    throw t;
                }));
            }
        }));
        this.router.navigator.cancel(this.navigation).then((() => {
            this.navigation.process?.resolve(false);
        })).catch((t => {
            throw t;
        }));
        this.completed = true;
        this.navigation.completed = true;
    }
    enqueueAppendedInstructions(t) {
        this.appendedInstructions.push(...t);
    }
    dequeueAppendedInstructions(t, i, e) {
        let n = [ ...this.appendedInstructions ];
        t = [ ...t ];
        e = [ ...e ];
        const s = n.filter((t => !t.default));
        const r = n.filter((t => t.default));
        n = s.length > 0 ? [ ...s ] : [ ...r ];
        while (n.length > 0) {
            const s = n.shift();
            arrayRemove(this.appendedInstructions, (t => t === s));
            const r = i.some((t => !t.cancelled && t.sameEndpoint(s, true)));
            const o = t.find((t => t.sameEndpoint(s, true)));
            const h = e.find((t => t.sameEndpoint(s, true)));
            if (s.default && (r || o !== void 0 && !o.default || h !== void 0 && !h.default)) {
                continue;
            }
            if (o !== void 0) {
                arrayRemove(t, (t => t === o));
            }
            if (h !== void 0) {
                arrayRemove(e, (t => t === h));
            }
            if (s.endpoint.instance !== null) {
                t.push(s);
            } else {
                e.push(s);
            }
        }
        return {
            matchedInstructions: t,
            remainingInstructions: e
        };
    }
    checkSyncState(t) {
        const i = this.syncStates.get(t);
        if (i === void 0) {
            return;
        }
        if (this.hasAllEndpoints && i.isPending && this.entities.every((i => i.hasReachedState(t))) && (!this.checkedSyncStates.has(t) || this.entities.every((i => i.checkedStates.includes(t))))) {
            for (const i of this.entities) {
                if (i.syncingState === t) {
                    i.syncPromise?.resolve();
                    i.syncPromise = null;
                    i.syncingState = null;
                }
            }
            i.resolve();
        }
    }
    recheckSyncStates() {
        this.syncStates.forEach(((t, i) => {
            if (!t.isPending && !this.entities.every((t => t.hasReachedState(i)))) {
                this.addSyncState(i);
            }
        }));
    }
}

class RoutingHook {
    constructor(t, i, e) {
        this.hook = t;
        this.id = e;
        this.type = "beforeNavigation";
        this.includeTargets = [];
        this.excludeTargets = [];
        if (i.type !== void 0) {
            this.type = i.type;
        }
        for (const t of i.include ?? []) {
            this.includeTargets.push(new Target(t));
        }
        for (const t of i.exclude ?? []) {
            this.excludeTargets.push(new Target(t));
        }
    }
    static add(t, i) {
        const e = new RoutingHook(t, i ?? {}, ++this.lastIdentity);
        this.hooks[e.type].push(e);
        return this.lastIdentity;
    }
    static remove(t) {
        for (const i in this.hooks) {
            if (Object.prototype.hasOwnProperty.call(this.hooks, i)) {
                const e = this.hooks[i].findIndex((i => i.id === t));
                if (e >= 0) {
                    this.hooks[i].splice(e, 1);
                }
            }
        }
    }
    static removeAll() {
        for (const t in this.hooks) {
            this.hooks[t] = [];
        }
    }
    static async invokeBeforeNavigation(t, i) {
        return this.invoke("beforeNavigation", i, t);
    }
    static async invokeTransformFromUrl(t, i) {
        return this.invoke("transformFromUrl", i, t);
    }
    static async invokeTransformToUrl(t, i) {
        return this.invoke("transformToUrl", i, t);
    }
    static async invokeTransformTitle(t, i) {
        return this.invoke("transformTitle", i, t);
    }
    static async invoke(t, i, e) {
        let n = e;
        for (const s of this.hooks[t]) {
            if (!s.wantsMatch || s.matches(e)) {
                n = await s.invoke(i, e);
                if (typeof n === "boolean") {
                    if (!n) {
                        return false;
                    }
                } else {
                    e = n;
                }
            }
        }
        return n;
    }
    get wantsMatch() {
        return this.includeTargets.length > 0 || this.excludeTargets.length > 0;
    }
    matches(t) {
        if (this.includeTargets.length && !this.includeTargets.some((i => i.matches(t)))) {
            return false;
        }
        if (this.excludeTargets.length && this.excludeTargets.some((i => i.matches(t)))) {
            return false;
        }
        return true;
    }
    invoke(t, i) {
        return this.hook(i, t);
    }
}

RoutingHook.hooks = {
    beforeNavigation: [],
    transformFromUrl: [],
    transformToUrl: [],
    transformTitle: []
};

RoutingHook.lastIdentity = 0;

class Target {
    constructor(t) {
        this.componentType = null;
        this.componentName = null;
        this.viewport = null;
        this.viewportName = null;
        if (typeof t === "string") {
            this.componentName = t;
        } else if (InstructionComponent.isType(t)) {
            this.componentType = t;
            this.componentName = InstructionComponent.getName(t);
        } else {
            const i = t;
            if (i.component != null) {
                this.componentType = InstructionComponent.isType(i.component) ? InstructionComponent.getType(i.component) : null;
                this.componentName = InstructionComponent.getName(i.component);
            }
            if (i.viewport != null) {
                this.viewport = InstructionEndpoint.isInstance(i.viewport) ? i.viewport : null;
                this.viewportName = InstructionEndpoint.getName(i.viewport);
            }
        }
    }
    matches(t) {
        const i = t.slice();
        if (!i.length) {
            i.push(RoutingInstruction.create(""));
        }
        for (const t of i) {
            if (this.componentName !== null && this.componentName === t.component.name || this.componentType !== null && this.componentType === t.component.type || this.viewportName !== null && this.viewportName === t.endpoint.name || this.viewport !== null && this.viewport === t.endpoint.instance) {
                return true;
            }
        }
        return false;
    }
}

class Title {
    static async getTitle(t, i, e) {
        let n = await RoutingHook.invokeTransformTitle(t, i);
        if (typeof n !== "string") {
            const t = Title.stringifyTitles(n, i, e);
            n = e.appTitle;
            n = n.replace(/\${componentTitles}/g, t);
            n = n.replace(/\${appTitleSeparator}/g, t !== "" ? e.appTitleSeparator : "");
        }
        n = await RoutingHook.invokeTransformTitle(n, i);
        return n;
    }
    static stringifyTitles(t, i, e) {
        const n = t.map((t => Title.stringifyTitle(t, i, e))).filter((t => (t?.length ?? 0) > 0));
        return n.join(" + ");
    }
    static stringifyTitle(t, i, e) {
        const n = t.nextScopeInstructions;
        let s = Title.resolveTitle(t, i, e);
        if (Array.isArray(n) && n.length > 0) {
            let t = Title.stringifyTitles(n, i, e);
            if (t.length > 0) {
                if (n.length !== 1) {
                    t = `[ ${t} ]`;
                }
                if (s.length > 0) {
                    s = e.componentTitleOrder === "top-down" ? s + e.componentTitleSeparator + t : t + e.componentTitleSeparator + s;
                } else {
                    s = t;
                }
            }
        }
        return s;
    }
    static resolveTitle(t, i, e) {
        let n = t.getTitle(i);
        if (e.transformTitle != null) {
            n = e.transformTitle(n, t, i);
        }
        return n;
    }
}

const O = /*@__PURE__*/ n.createInterface("IRouter", (t => t.singleton(Router)));

class Router {
    static get inject() {
        return [ e, i, k, T, T, D ];
    }
    constructor(t, i, e, n, s, r) {
        this.container = t;
        this.ea = i;
        this.navigator = e;
        this.viewer = n;
        this.store = s;
        this.configuration = r;
        this.rootScope = null;
        this.activeComponents = [];
        this.appendedInstructions = [];
        this.isActive = false;
        this.coordinators = [];
        this.loadedFirst = false;
        this.handleNavigatorNavigateEvent = t => {
            this.processNavigation(t.navigation).catch((t => {
                throw t;
            }));
        };
        this.handleNavigatorStateChangeEvent = t => {
            if (t.state?.navigationIndex != null) {
                const i = Navigation.create(t.state.navigations[t.state.navigationIndex]);
                i.instruction = t.viewerState.instruction;
                i.fromBrowser = true;
                this.navigator.navigate(i).catch((t => {
                    throw t;
                }));
            } else {
                this.load(t.viewerState.instruction, {
                    fromBrowser: true
                }).catch((t => {
                    throw t;
                }));
            }
        };
        this.processNavigation = async t => {
            this.loadedFirst = true;
            const i = this.configuration.options;
            const e = NavigationCoordinator.create(this, t, {
                syncStates: this.configuration.options.navigationSyncStates
            });
            this.coordinators.push(e);
            e.appendedInstructions.push(...this.appendedInstructions.splice(0));
            this.ea.publish(RouterNavigationStartEvent.eventName, RouterNavigationStartEvent.create(t));
            let n = typeof t.instruction === "string" && !t.useFullStateInstruction ? await RoutingHook.invokeTransformFromUrl(t.instruction, e.navigation) : t.useFullStateInstruction ? t.fullStateInstruction : t.instruction;
            const s = i.basePath;
            if (s !== null && typeof n === "string" && n.startsWith(s) && !i.useUrlFragmentHash) {
                n = n.slice(s.length);
            }
            if (n === "/") {
                n = "";
            }
            if (typeof n === "string") {
                n = n === "" ? [ new RoutingInstruction("") ] : RoutingInstruction.parse(this, n);
            }
            t.scope ?? (t.scope = this.rootScope.scope);
            const r = await t.scope.processInstructions(n, [], t, e);
            return Runner.run(null, (() => {
                e.finalEndpoint();
                return e.waitForSyncState("completed");
            }), (() => {
                e.finalize();
                return this.updateNavigation(t);
            }), (() => {
                if (t.navigation.new && !t.navigation.first && !t.repeating && r.every((t => t.options.noHistory))) {
                    t.untracked = true;
                }
            }), (async () => {
                while (this.coordinators.length > 0 && this.coordinators[0].completed) {
                    const t = this.coordinators.shift();
                    await this.navigator.finalize(t.navigation, false);
                    this.ea.publish(RouterNavigationCompleteEvent.eventName, RouterNavigationCompleteEvent.create(t.navigation));
                    this.ea.publish(RouterNavigationEndEvent.eventName, RouterNavigationEndEvent.create(t.navigation));
                    t.navigation.process?.resolve(true);
                }
            }));
        };
    }
    get isNavigating() {
        return this.coordinators.length > 0;
    }
    get isRestrictedNavigation() {
        const t = this.configuration.options.navigationSyncStates;
        return t.includes("guardedLoad") || t.includes("unloaded") || t.includes("loaded") || t.includes("guarded") || t.includes("routed");
    }
    get statefulHistory() {
        return this.configuration.options.statefulHistoryLength !== void 0 && this.configuration.options.statefulHistoryLength > 0;
    }
    start() {
        if (this.isActive) {
            throw new Error("Router has already been started");
        }
        this.isActive = true;
        const t = this.container.get(f);
        this.rootScope = new ViewportScope(this, "rootScope", t.controller.viewModel, null, true, t.config.component);
        const i = this.configuration.options;
        if (i.basePath === null) {
            const e = new URL(t.host.baseURI);
            i.basePath = e.pathname;
        }
        if (i.basePath.endsWith("/")) {
            i.basePath = i.basePath.slice(0, -1);
        }
        this.navigator.start({
            store: this.store,
            viewer: this.viewer,
            statefulHistoryLength: this.configuration.options.statefulHistoryLength
        });
        this.navigatorStateChangeEventSubscription = this.ea.subscribe(NavigatorStateChangeEvent.eventName, this.handleNavigatorStateChangeEvent);
        this.navigatorNavigateEventSubscription = this.ea.subscribe(NavigatorNavigateEvent.eventName, this.handleNavigatorNavigateEvent);
        this.viewer.start({
            useUrlFragmentHash: this.configuration.options.useUrlFragmentHash
        });
        this.ea.publish(RouterStartEvent.eventName, RouterStartEvent.create());
    }
    stop() {
        if (!this.isActive) {
            throw new Error("Router has not been started");
        }
        this.ea.publish(RouterStopEvent.eventName, RouterStopEvent.create());
        this.navigator.stop();
        this.viewer.stop();
        this.navigatorStateChangeEventSubscription.dispose();
        this.navigatorNavigateEventSubscription.dispose();
    }
    async initialLoad() {
        const {instruction: t, hash: i} = this.viewer.viewerState;
        const e = this.load(t, {
            fragment: i,
            replacing: true,
            fromBrowser: false
        });
        this.loadedFirst = true;
        return e;
    }
    getEndpoint(t, i) {
        return this.allEndpoints(t).find((t => t.name === i)) ?? null;
    }
    allEndpoints(t, i = false) {
        return this.rootScope.scope.allScopes(i).filter((i => t === null || i.type === t)).map((t => t.endpoint));
    }
    addEndpoint(t, ...i) {
        throw new Error("Not implemented");
    }
    connectEndpoint(t, i, e, n, r) {
        const o = e.container;
        const h = o.has(Router.closestEndpointKey, true) ? o.get(Router.closestEndpointKey) : this.rootScope;
        const u = h.connectedScope;
        if (t === null) {
            t = u.addEndpoint(i, n, e, r);
            s.instance(Router.closestEndpointKey, t).register(o);
        }
        return t;
    }
    disconnectEndpoint(t, i, e) {
        if (!i.connectedScope.parent.removeEndpoint(t, i, e)) {
            throw new Error("Router failed to remove endpoint: " + i.name);
        }
    }
    async load(t, i) {
        i = i ?? {};
        t = this.extractFragment(t, i);
        t = this.extractQuery(t, i);
        let e = null;
        ({instructions: t, scope: e} = this.applyLoadOptions(t, i));
        if ((i.append ?? false) && (!this.loadedFirst || this.isNavigating)) {
            t = RoutingInstruction.from(this, t);
            this.appendInstructions(t, e);
            return Promise.resolve();
        }
        const n = Navigation.create({
            instruction: t,
            fullStateInstruction: "",
            scope: e,
            title: i.title,
            data: i.data,
            query: i.query,
            fragment: i.fragment,
            parameters: i.parameters,
            replacing: (i.replacing ?? false) || i.replace,
            repeating: i.append,
            fromBrowser: i.fromBrowser ?? false,
            origin: i.origin,
            completed: false
        });
        return this.navigator.navigate(n);
    }
    applyLoadOptions(t, i, e = true) {
        i = i ?? {};
        if ("origin" in i && !("context" in i)) {
            i.context = i.origin;
        }
        const {scope: n, instruction: s} = RoutingScope.for(i.context ?? null, typeof t === "string" ? t : undefined);
        if (typeof t === "string") {
            if (!e) {
                t = RoutingInstruction.from(this, s);
                for (const i of t) {
                    if (i.scope === null) {
                        i.scope = n;
                    }
                }
            } else {
                t = s;
            }
        } else {
            t = RoutingInstruction.from(this, t);
            for (const i of t) {
                if (i.scope === null) {
                    i.scope = n;
                }
            }
        }
        return {
            instructions: t,
            scope: n
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
    go(t) {
        return this.navigator.go(t);
    }
    checkActive(t, i) {
        if (typeof t === "string") {
            throw new Error(`Parameter instructions to checkActivate can not be a string ('${t}')!`);
        }
        i = i ?? {};
        ({instructions: t} = this.applyLoadOptions(t, i));
        t.forEach((t => t.scope ?? (t.scope = this.rootScope.scope)));
        const e = arrayUnique(t.map((t => t.scope)));
        for (const i of e) {
            const e = i.matchScope(t, false);
            const n = i.matchScope(this.activeComponents, true);
            if (!RoutingInstruction.contains(this, n, e, true)) {
                return false;
            }
        }
        return true;
    }
    unresolvedInstructionsError(t, i) {
        this.ea.publish(RouterNavigationErrorEvent.eventName, RouterNavigationErrorEvent.create(t));
        this.ea.publish(RouterNavigationEndEvent.eventName, RouterNavigationEndEvent.create(t));
        throw createUnresolvedinstructionsError(i);
    }
    cancelNavigation(t, i) {
        i.cancel();
        this.ea.publish(RouterNavigationCancelEvent.eventName, RouterNavigationCancelEvent.create(t));
        this.ea.publish(RouterNavigationEndEvent.eventName, RouterNavigationEndEvent.create(t));
    }
    appendInstructions(t, i = null) {
        if (i === null) {
            i = this.rootScope.scope;
        }
        for (const e of t) {
            if (e.scope === null) {
                e.scope = i;
            }
        }
        let e = null;
        for (let t = this.coordinators.length - 1; t >= 0; t--) {
            if (!this.coordinators[t].completed) {
                e = this.coordinators[t];
                break;
            }
        }
        if (e === null) {
            if (!this.loadedFirst) {
                this.appendedInstructions.push(...t);
            } else {
                throw Error("Router failed to append routing instructions to coordinator");
            }
        }
        e?.enqueueAppendedInstructions(t);
    }
    async updateNavigation(t) {
        this.rootScope.scope.reparentRoutingInstructions();
        const i = this.rootScope.scope.getRoutingInstructions(t.timestamp);
        let {matchedInstructions: e} = this.rootScope.scope.matchEndpoints(i, [], true);
        let n = 100;
        while (e.length > 0) {
            if (n-- === 0) {
                throw new Error("Router failed to find viewport when updating viewer paths.");
            }
            e = e.map((t => {
                const {matchedInstructions: i} = t.endpoint.instance.scope.matchEndpoints(t.nextScopeInstructions ?? [], [], true);
                return i;
            })).flat();
        }
        if (t.timestamp >= (this.activeNavigation?.timestamp ?? 0)) {
            this.activeNavigation = t;
            this.activeComponents = i;
        }
        let s = await RoutingHook.invokeTransformToUrl(i, t);
        if (typeof s !== "string") {
            s = RoutingInstruction.stringify(this, s, false, true);
        }
        s = await RoutingHook.invokeTransformToUrl(s, t);
        if (t.query == null && t.parameters != null) {
            const i = new URLSearchParams;
            for (let [e, n] of Object.entries(t.parameters)) {
                e = encodeURIComponent(e);
                if (!Array.isArray(n)) {
                    n = [ n ];
                }
                for (const t of n) {
                    i.append(e, encodeURIComponent(t));
                }
            }
            t.query = i.toString();
        }
        let r = `${this.configuration.options.basePath}/`;
        if (r === null || s !== "" && s[0] === "/" || this.configuration.options.useUrlFragmentHash) {
            r = "";
        }
        const o = (t.query?.length ?? 0) > 0 ? "?" + t.query : "";
        const h = (t.fragment?.length ?? 0) > 0 ? "#" + t.fragment : "";
        t.path = r + s + o + h;
        const u = [ RoutingInstruction.create(RoutingInstruction.clear(this)) ];
        u.push(...RoutingInstruction.clone(i, this.statefulHistory));
        t.fullStateInstruction = u;
        if ((t.title ?? null) === null) {
            const e = await Title.getTitle(i, t, this.configuration.options.title);
            if (e !== null) {
                t.title = e;
            }
        }
        return Promise.resolve();
    }
    extractFragment(t, i) {
        if (typeof t === "string" && i.fragment == null) {
            const [e, n] = t.split("#");
            t = e;
            i.fragment = n;
        }
        return t;
    }
    extractQuery(t, i) {
        if (typeof t === "string" && i.query == null) {
            const [e, n] = t.split("?");
            t = e;
            i.query = n;
        }
        if (typeof i.parameters === "string" && i.query == null) {
            i.query = i.parameters;
            i.parameters = void 0;
        }
        if (typeof i.query === "string" && i.query.length > 0) {
            i.parameters ?? (i.parameters = {});
            const t = new URLSearchParams(i.query);
            t.forEach(((t, e) => {
                e = decodeURIComponent(e);
                t = decodeURIComponent(t);
                if (e in i.parameters) {
                    if (!Array.isArray(i.parameters[e])) {
                        i.parameters[e] = [ i.parameters[e] ];
                    }
                    i.parameters[e].push(t);
                } else {
                    i.parameters[e] = t;
                }
            }));
        }
        return t;
    }
}

Router.closestEndpointKey = t.annotation.keyFor("closest-endpoint");

function createUnresolvedinstructionsError(t) {
    const i = new Error(`${t.length} remaining instructions after 100 iterations; there is likely an infinite loop.`);
    i.remainingInstructions = t;
    console.log(i, i.remainingInstructions);
    return i;
}

class RouterEvent {
    constructor(t) {
        this.eventName = t;
    }
}

class RouterStartEvent extends RouterEvent {
    static create() {
        return new RouterStartEvent(this.eventName);
    }
}

RouterStartEvent.eventName = "au:router:router-start";

class RouterStopEvent extends RouterEvent {
    static create() {
        return new RouterStopEvent(this.eventName);
    }
}

RouterStopEvent.eventName = "au:router:router-stop";

class RouterNavigationEvent {
    constructor(t, i) {
        this.eventName = t;
        this.navigation = i;
    }
}

class RouterNavigationStartEvent extends RouterNavigationEvent {
    static create(t) {
        return new RouterNavigationStartEvent(this.eventName, t);
    }
}

RouterNavigationStartEvent.eventName = "au:router:navigation-start";

class RouterNavigationEndEvent extends RouterNavigationEvent {
    static create(t) {
        return new RouterNavigationEndEvent(this.eventName, t);
    }
}

RouterNavigationEndEvent.eventName = "au:router:navigation-end";

class RouterNavigationCancelEvent extends RouterNavigationEvent {
    static create(t) {
        return new RouterNavigationCancelEvent(this.eventName, t);
    }
}

RouterNavigationCancelEvent.eventName = "au:router:navigation-cancel";

class RouterNavigationCompleteEvent extends RouterNavigationEvent {
    static create(t) {
        return new RouterNavigationCompleteEvent(this.eventName, t);
    }
}

RouterNavigationCompleteEvent.eventName = "au:router:navigation-complete";

class RouterNavigationErrorEvent extends RouterNavigationEvent {
    static create(t) {
        return new RouterNavigationErrorEvent(this.eventName, t);
    }
}

RouterNavigationErrorEvent.eventName = "au:router:navigation-error";

const x = /*@__PURE__*/ n.createInterface("ILinkHandler", (t => t.singleton(U)));

let U = class LinkHandler {
    constructor(t, i) {
        this.window = t;
        this.router = i;
    }
    handleEvent(t) {
        this.handleClick(t);
    }
    handleClick(t) {
        if (t.button !== 0 || t.altKey || t.ctrlKey || t.metaKey || t.shiftKey) {
            return;
        }
        const i = t.currentTarget;
        if (i.hasAttribute("external")) {
            return;
        }
        const e = i.getAttribute("target") ?? "";
        if (e.length > 0 && e !== this.window.name && e !== "_self") {
            return;
        }
        const n = d.for(i, "load");
        const s = n !== void 0 ? n.viewModel.value : null;
        const r = this.router.configuration.options.useHref && i.hasAttribute("href") ? i.getAttribute("href") : null;
        if ((s === null || s.length === 0) && (r === null || r.length === 0)) {
            return;
        }
        t.preventDefault();
        let o = s ?? r ?? "";
        if (typeof o === "string" && o.startsWith("#")) {
            o = o.slice(1);
            if (!o.startsWith("/")) {
                o = `/${o}`;
            }
        }
        this.router.load(o, {
            origin: i
        }).catch((t => {
            throw t;
        }));
    }
};

U = __decorate([ __param(0, a), __param(1, O) ], U);

var F;

(function(t) {
    t["default"] = "default";
    t["disallow"] = "disallow";
    t["reload"] = "reload";
    t["refresh"] = "refresh";
})(F || (F = {}));

function route(t) {
    return function(i) {
        return Route.configure(t, i);
    };
}

function getValueOrAttribute(t, i, e, n, s = false) {
    if (s) {
        return i === "";
    }
    if (e) {
        return i;
    }
    const r = n.getAttribute(t) ?? "";
    return r.length > 0 ? r : i;
}

function waitForRouterStart(t, i) {
    if (t.isActive) {
        return;
    }
    return new Promise((t => {
        const e = i.subscribe(RouterStartEvent.eventName, (() => {
            t();
            e.dispose();
        }));
    }));
}

function getConsideredActiveInstructions(t, i, e, n) {
    let s = d.for(e, "considered-active")?.viewModel?.value;
    if (s === void 0) {
        s = n;
    }
    const r = t.applyLoadOptions(s, {
        context: i
    });
    const o = RoutingInstruction.from(t, r.instructions);
    for (const t of o) {
        if (t.scope === null) {
            t.scope = r.scope;
        }
    }
    return o;
}

function getLoadIndicator(t) {
    let i = t.parentElement;
    while (i != null) {
        if (i.tagName === "AU-VIEWPORT") {
            i = null;
            break;
        }
        if (i.hasAttribute("load-active")) {
            break;
        }
        i = i.parentElement;
    }
    i ?? (i = t);
    return i;
}

const M = r.createInjectable();

let L = class ViewportCustomElement {
    constructor(t, i, e, n, s, r) {
        this.router = t;
        this.element = i;
        this.container = e;
        this.ea = n;
        this.parentViewport = s;
        this.instruction = r;
        this.name = "default";
        this.usedBy = "";
        this.default = "";
        this.fallback = "";
        this.fallbackAction = "";
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
    hydrated(t) {
        this.controller = t;
        this.container = t.container;
        const i = this.instruction.props.filter((t => t.to === "default")).length > 0;
        if (i && this.parentViewport != null) {
            this.parentViewport.pendingChildren.push(this);
            if (this.parentViewport.pendingPromise === null) {
                this.parentViewport.pendingPromise = new OpenPromise;
            }
        }
        return Runner.run(null, (() => waitForRouterStart(this.router, this.ea)), (() => {
            if (this.router.isRestrictedNavigation) {
                this.connect();
            }
        }));
    }
    binding(t, i) {
        this.isBound = true;
        return Runner.run(null, (() => waitForRouterStart(this.router, this.ea)), (() => {
            if (!this.router.isRestrictedNavigation) {
                this.connect();
            }
        }), (() => {
            if (this.endpoint?.activeResolve != null) {
                this.endpoint.activeResolve();
                this.endpoint.activeResolve = null;
            }
        }), (() => {
            if (this.endpoint !== null && this.endpoint.getNextContent() === null) {
                return this.endpoint.activate(null, t, this.controller, void 0)?.asValue;
            }
        }));
    }
    detaching(t, i) {
        if (this.endpoint !== null) {
            this.isBound = false;
            return this.endpoint.deactivate(null, t, i);
        }
    }
    unbinding(t, i) {
        if (this.endpoint !== null) {
            return this.disconnect(null);
        }
    }
    dispose() {
        this.endpoint?.dispose();
        this.endpoint = null;
    }
    connect() {
        const {isBound: t, element: i} = this;
        const e = getValueOrAttribute("name", this.name, t, i);
        const n = {};
        n.scope = !getValueOrAttribute("no-scope", this.noScope, false, i, true);
        n.usedBy = getValueOrAttribute("used-by", this.usedBy, t, i);
        n.default = getValueOrAttribute("default", this.default, t, i);
        n.fallback = getValueOrAttribute("fallback", this.fallback, t, i);
        n.fallbackAction = getValueOrAttribute("fallback-action", this.fallbackAction, t, i);
        n.noLink = getValueOrAttribute("no-link", this.noLink, t, i, true);
        n.noTitle = getValueOrAttribute("no-title", this.noTitle, t, i, true);
        n.noHistory = getValueOrAttribute("no-history", this.noHistory, t, i, true);
        n.stateful = getValueOrAttribute("stateful", this.stateful, t, i, true);
        Object.keys(n).forEach((t => {
            if (n[t] === undefined) {
                delete n[t];
            }
        }));
        this.endpoint = this.router.connectEndpoint(this.endpoint, "Viewport", this, e, n);
        const s = this.parentViewport;
        if (s != null) {
            arrayRemove(s.pendingChildren, (t => t === this));
            if (s.pendingChildren.length === 0 && s.pendingPromise !== null) {
                s.pendingPromise.resolve();
                s.pendingPromise = null;
            }
        }
    }
    disconnect(t) {
        if (this.endpoint !== null) {
            this.router.disconnectEndpoint(t, this.endpoint, this);
        }
    }
    setActivity(t, i) {
        const e = this.router.configuration.options.indicators.viewportNavigating;
        if (typeof t === "string") {
            this.element.classList.toggle(t, i);
        } else {
            for (const n in t) {
                this.element.classList.toggle(`${e}-${n}`, i && t[n]);
            }
        }
    }
};

__decorate([ g ], L.prototype, "name", void 0);

__decorate([ g ], L.prototype, "usedBy", void 0);

__decorate([ g ], L.prototype, "default", void 0);

__decorate([ g ], L.prototype, "fallback", void 0);

__decorate([ g ], L.prototype, "fallbackAction", void 0);

__decorate([ g ], L.prototype, "noScope", void 0);

__decorate([ g ], L.prototype, "noLink", void 0);

__decorate([ g ], L.prototype, "noTitle", void 0);

__decorate([ g ], L.prototype, "noHistory", void 0);

__decorate([ g ], L.prototype, "stateful", void 0);

L = __decorate([ p({
    name: "au-viewport",
    injectable: M
}), __param(0, O), __param(1, v), __param(2, e), __param(3, i), __param(4, M), __param(5, m) ], L);

const j = r.createInjectable();

let H = class ViewportScopeCustomElement {
    constructor(t, i, e, n, s) {
        this.router = t;
        this.element = i;
        this.container = e;
        this.parent = n;
        this.parentController = s;
        this.name = "default";
        this.catches = "";
        this.collection = false;
        this.source = null;
        this.viewportScope = null;
        this.isBound = false;
    }
    hydrated(t) {
        this.controller = t;
    }
    bound(t, i) {
        this.isBound = true;
        this.$controller.scope = this.parentController.scope;
        this.connect();
        if (this.viewportScope !== null) {
            this.viewportScope.binding();
        }
    }
    unbinding(t, i) {
        if (this.viewportScope !== null) {
            this.viewportScope.unbinding();
        }
        return Promise.resolve();
    }
    connect() {
        if (this.router.rootScope === null) {
            return;
        }
        const t = this.getAttribute("name", this.name);
        const i = {};
        let e = this.getAttribute("catches", this.catches);
        if (e !== void 0) {
            i.catches = e;
        }
        e = this.getAttribute("collection", this.collection, true);
        if (e !== void 0) {
            i.collection = e;
        }
        i.source = this.source || null;
        this.viewportScope = this.router.connectEndpoint(this.viewportScope, "ViewportScope", this, t, i);
    }
    disconnect() {
        if (this.viewportScope) {
            this.router.disconnectEndpoint(null, this.viewportScope, this);
        }
        this.viewportScope = null;
    }
    getAttribute(t, i, e = false) {
        if (this.isBound) {
            return i;
        } else {
            if (this.element.hasAttribute(t)) {
                if (e) {
                    return true;
                } else {
                    i = this.element.getAttribute(t);
                    if (i.length > 0) {
                        return i;
                    }
                }
            }
        }
        return void 0;
    }
};

__decorate([ g ], H.prototype, "name", void 0);

__decorate([ g ], H.prototype, "catches", void 0);

__decorate([ g ], H.prototype, "collection", void 0);

__decorate([ g ], H.prototype, "source", void 0);

H = __decorate([ p({
    name: "au-viewport-scope",
    template: "<template></template>",
    containerless: false,
    injectable: j
}), __param(0, O), __param(1, v), __param(2, e), __param(3, j), __param(4, w) ], H);

let q = class LoadCustomAttribute {
    constructor(t, i, e, n) {
        this.element = t;
        this.router = i;
        this.linkHandler = e;
        this.ea = n;
        this.h = false;
        this.hasHref = null;
        this.navigationEndHandler = t => {
            void this.updateActive();
        };
        this.activeClass = this.router.configuration.options.indicators.loadActive;
    }
    binding() {
        if (this.value == null) {
            this.h = true;
        }
        this.element.addEventListener("click", this.linkHandler);
        this.updateValue();
        void this.updateActive();
        this.routerNavigationSubscription = this.ea.subscribe(RouterNavigationEndEvent.eventName, this.navigationEndHandler);
    }
    unbinding() {
        this.element.removeEventListener("click", this.linkHandler);
        this.routerNavigationSubscription.dispose();
    }
    valueChanged(t) {
        this.updateValue();
        void this.updateActive();
    }
    updateValue() {
        if (this.h) {
            this.value = {
                component: this.component,
                parameters: this.parameters,
                viewport: this.viewport,
                id: this.id
            };
        }
        if (this.hasHref === null) {
            this.hasHref = this.element.hasAttribute("href");
        }
        if (!this.hasHref) {
            let t = this.value;
            if (typeof t !== "string") {
                const i = RoutingInstruction.from(this.router, t).shift();
                const e = this.u(t);
                if (e.foundConfiguration) {
                    i.route = e.matching;
                }
                t = RoutingInstruction.stringify(this.router, [ i ]);
            }
            const {scope: i, instruction: e} = RoutingScope.for(this.element, t);
            const n = i?.path ?? "";
            t = `${n}${e ?? ""}`;
            if (this.router.configuration.options.useUrlFragmentHash && !t.startsWith("#")) {
                t = `#/${t}`;
            }
            this.element.setAttribute("href", t);
        }
    }
    async updateActive() {
        const t = d.for(this.element, "load").parent;
        const i = typeof this.value === "string" ? {
            id: this.value,
            path: this.value
        } : this.value;
        const e = this.u(i);
        const n = e.foundConfiguration ? e.instructions : getConsideredActiveInstructions(this.router, t, this.element, this.value);
        const s = getLoadIndicator(this.element);
        s.classList.toggle(this.activeClass, this.router.checkActive(n, {
            context: t
        }));
    }
    u(t) {
        if (typeof t === "string") {
            return new FoundRoute;
        }
        const i = RoutingScope.for(this.element).scope ?? this.router.rootScope.scope;
        if (t.id != null) {
            return i.findMatchingRoute(t.id, t.parameters ?? {});
        }
        const e = t.path;
        if (e != null) {
            return i.findMatchingRoute(e, t.parameters ?? {});
        }
        return new FoundRoute;
    }
};

__decorate([ g({
    mode: 2
}) ], q.prototype, "value", void 0);

__decorate([ g ], q.prototype, "component", void 0);

__decorate([ g ], q.prototype, "parameters", void 0);

__decorate([ g ], q.prototype, "viewport", void 0);

__decorate([ g ], q.prototype, "id", void 0);

q = __decorate([ R("load"), __param(0, v), __param(1, O), __param(2, x), __param(3, i) ], q);

let z = class HrefCustomAttribute {
    constructor(t, i, e, n) {
        this.element = t;
        this.router = i;
        this.linkHandler = e;
        this.ea = n;
        this.navigationEndHandler = t => {
            this.updateActive();
        };
        this.activeClass = this.router.configuration.options.indicators.loadActive;
    }
    binding() {
        if (this.router.configuration.options.useHref && !this.hasLoad() && !this.element.hasAttribute("external")) {
            this.element.addEventListener("click", this.linkHandler);
            this.routerNavigationSubscription = this.ea.subscribe(RouterNavigationEndEvent.eventName, this.navigationEndHandler);
        }
        this.updateValue();
        this.updateActive();
    }
    unbinding() {
        this.element.removeEventListener("click", this.linkHandler);
        this.routerNavigationSubscription?.dispose();
    }
    valueChanged() {
        this.updateValue();
        this.updateActive();
    }
    updateValue() {
        this.element.setAttribute("href", this.value);
    }
    updateActive() {
        if (this.router.configuration.options.useHref && !this.hasLoad() && !this.element.hasAttribute("external")) {
            const t = d.for(this.element, "href").parent;
            const i = getConsideredActiveInstructions(this.router, t, this.element, this.value);
            const e = getLoadIndicator(this.element);
            e.classList.toggle(this.activeClass, this.router.checkActive(i, {
                context: t
            }));
        }
    }
    hasLoad() {
        const t = this.$controller.parent;
        const i = t.children;
        return i?.some((t => t.vmKind === 1 && t.viewModel instanceof q)) ?? false;
    }
};

__decorate([ g({
    mode: 2
}) ], z.prototype, "value", void 0);

z = __decorate([ R({
    name: "href",
    noMultiBindings: true
}), __param(0, v), __param(1, O), __param(2, x), __param(3, i) ], z);

let B = class ConsideredActiveCustomAttribute {};

__decorate([ g({
    mode: 2
}) ], B.prototype, "value", void 0);

B = __decorate([ R("considered-active") ], B);

const D = /*@__PURE__*/ n.createInterface("IRouterConfiguration", (t => t.singleton(RouterConfiguration)));

const Q = O;

const J = [ Q ];

const W = L;

const G = H;

const K = q;

const Z = z;

const X = [ L, H, q, z, B ];

class RouterConfiguration {
    static register(t) {
        const i = t.get(D);
        i.options = RouterConfiguration.options;
        i.options.setRouterConfiguration(i);
        RouterConfiguration.options = RouterOptions.create();
        return t.register(...J, ...X, y.activating(O, RouterConfiguration.configurationCall), y.activated(O, (t => t.initialLoad())), y.deactivated(O, (t => t.stop())));
    }
    static customize(t) {
        if (t === undefined) {
            RouterConfiguration.options = RouterOptions.create();
            RouterConfiguration.configurationCall = t => {
                t.start();
            };
        } else if (t instanceof Function) {
            RouterConfiguration.configurationCall = t;
        } else {
            RouterConfiguration.options = RouterOptions.create();
            RouterConfiguration.options.apply(t);
        }
        return RouterConfiguration;
    }
    static createContainer() {
        return this.register(n.createContainer());
    }
    static for(t) {
        if (t instanceof Router) {
            return t.configuration;
        }
        return t.get(D);
    }
    apply(t, i = false) {
        if (i) {
            this.options = RouterOptions.create();
        }
        this.options.apply(t);
    }
    addHook(t, i) {
        return RoutingHook.add(t, i);
    }
    removeHook(t) {
        return RoutingHook.remove(t);
    }
    removeAllHooks() {
        return RoutingHook.removeAll();
    }
}

RouterConfiguration.options = RouterOptions.create();

RouterConfiguration.configurationCall = t => {
    t.start();
};

export { P as ConfigurableRoute, B as ConsideredActiveCustomAttribute, J as DefaultComponents, X as DefaultResources, Endpoint$1 as Endpoint, EndpointContent, FoundRoute, z as HrefCustomAttribute, Z as HrefCustomAttributeRegistration, x as ILinkHandler, O as IRouter, D as IRouterConfiguration, InstructionParameters, U as LinkHandler, q as LoadCustomAttribute, K as LoadCustomAttributeRegistration, Navigation, NavigationCoordinator, NavigationFlags, k as Navigator, A as RecognizedRoute, V as RecognizerEndpoint, F as ReloadBehavior, Route, $ as RouteRecognizer, Router, RouterConfiguration, RouterNavigationCancelEvent, RouterNavigationCompleteEvent, RouterNavigationEndEvent, RouterNavigationErrorEvent, RouterNavigationStartEvent, RouterOptions, Q as RouterRegistration, RouterStartEvent, RouterStopEvent, _ as Routes, RoutingHook, RoutingInstruction, RoutingScope, Runner, Step, Viewport, ViewportContent, L as ViewportCustomElement, W as ViewportCustomElementRegistration, ViewportOptions, ViewportScope, ViewportScopeContent, H as ViewportScopeCustomElement, G as ViewportScopeCustomElementRegistration, route, routes };

