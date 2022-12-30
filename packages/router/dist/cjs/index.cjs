"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var t = require("@aurelia/kernel");

var i = require("@aurelia/runtime-html");

var s = require("@aurelia/metadata");

var n = require("@aurelia/route-recognizer");

class Endpoint$1 {
    constructor(t, i, s, n = {}) {
        this.router = t;
        this.name = i;
        this.connectedCE = s;
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
    getTimeContent(t = 1 / 0) {
        return this.getContent();
    }
    getNavigationContent(t) {
        if (t instanceof NavigationCoordinator) t = t.navigation;
        if (t instanceof Navigation) return this.contents.find((i => i.navigation === t)) ?? null;
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
    constructor(t, i, s, n, e = RoutingInstruction.create(""), r = Navigation.create({
        instruction: "",
        fullStateInstruction: ""
    })) {
        this.router = t;
        this.endpoint = i;
        this.instruction = e;
        this.navigation = r;
        this.completed = false;
        this.connectedScope = new RoutingScope(t, n, s, this);
        if (null !== this.router.rootScope) (this.endpoint.connectedScope?.parent ?? this.router.rootScope.scope).addChild(this.connectedScope);
    }
    get isActive() {
        return this.endpoint.activeContent === this;
    }
    delete() {
        this.connectedScope.parent?.removeChild(this.connectedScope);
    }
}

class FoundRoute {
    constructor(t = null, i = "", s = [], n = "", e = {}) {
        this.match = t;
        this.matching = i;
        this.instructions = s;
        this.remaining = n;
        this.params = e;
    }
    get foundConfiguration() {
        return null !== this.match;
    }
    get foundInstructions() {
        return this.instructions.some((t => !t.component.none));
    }
    get hasRemaining() {
        return this.instructions.some((t => t.hasNextScopeInstructions));
    }
}

function e(t, i, s, n) {
    var e = arguments.length, r = e < 3 ? i : null === n ? n = Object.getOwnPropertyDescriptor(i, s) : n, o;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(t, i, s, n); else for (var h = t.length - 1; h >= 0; h--) if (o = t[h]) r = (e < 3 ? o(r) : e > 3 ? o(i, s, r) : o(i, s)) || r;
    return e > 3 && r && Object.defineProperty(i, s, r), r;
}

function r(t, i) {
    return function(s, n) {
        i(s, n, t);
    };
}

class InstructionParser {
    static parse(t, i, s, n) {
        if (!i) return {
            instructions: [],
            remaining: ""
        };
        if (i.startsWith(t.sibling) && !InstructionParser.isAdd(t, i)) throw new Error(`Instruction parser error: Unnecessary siblings separator ${t.sibling} in beginning of instruction part "${i}".`);
        const e = [];
        let r = 1e3;
        while (i.length && r) {
            r--;
            if (i.startsWith(t.scope)) {
                if (0 === e.length) throw new Error(`Instruction parser error: Children without parent in instruction part "(${i}" is not allowed.`);
                n = false;
                i = i.slice(t.scope.length);
                const r = i.startsWith(t.groupStart);
                if (r) {
                    i = i.slice(t.groupStart.length);
                    s = true;
                }
                const {instructions: o, remaining: h} = InstructionParser.parse(t, i, r, false);
                e[e.length - 1].nextScopeInstructions = o;
                i = h;
            } else if (i.startsWith(t.groupStart)) {
                i = i.slice(t.groupStart.length);
                const {instructions: s, remaining: r} = InstructionParser.parse(t, i, true, n);
                e.push(...s);
                i = r;
            } else if (i.startsWith(t.groupEnd)) {
                if (s) i = i.slice(t.groupEnd.length);
                let n = 0;
                const r = i.length;
                for (;n < r; n++) {
                    if (i.slice(n, n + t.sibling.length) === t.sibling) return {
                        instructions: e,
                        remaining: i
                    };
                    if (i.slice(n, n + t.groupEnd.length) !== t.groupEnd) if (e.length > 1) throw new Error(`Instruction parser error: Children below scope ${t.groupStart}${t.groupEnd} in instruction part "(${i}" is not allowed.`); else {
                        i = i.slice(n);
                        break;
                    }
                }
                if (n >= r) return {
                    instructions: e,
                    remaining: i
                };
            } else if (i.startsWith(t.sibling) && !InstructionParser.isAdd(t, i)) {
                if (!s) return {
                    instructions: e,
                    remaining: i
                };
                i = i.slice(t.sibling.length);
            } else {
                const {instruction: s, remaining: n} = InstructionParser.parseOne(t, i);
                e.push(s);
                i = n;
            }
        }
        return {
            instructions: e,
            remaining: i
        };
    }
    static isAdd(t, i) {
        return i === t.add || i.startsWith(`${t.add}${t.viewport}`);
    }
    static parseOne(t, i) {
        const s = [ t.parameters, t.viewport, t.noScope, t.groupEnd, t.scope, t.sibling ];
        let n;
        let e;
        let r;
        let o = true;
        let h;
        let u;
        const l = i;
        const a = [ t.add, t.clear ];
        for (const e of a) if (i === e) {
            n = i;
            i = "";
            s.shift();
            s.shift();
            h = t.viewport;
            break;
        }
        if (void 0 === n) for (const e of a) if (i.startsWith(`${e}${t.viewport}`)) {
            n = e;
            i = i.slice(`${e}${t.viewport}`.length);
            s.shift();
            s.shift();
            h = t.viewport;
            break;
        }
        if (void 0 === n) {
            ({token: h, pos: u} = InstructionParser.findNextToken(i, s));
            n = -1 !== u ? i.slice(0, u) : i;
            i = -1 !== u ? i.slice(u + h.length) : "";
            s.shift();
            if (h === t.parameters) {
                ({token: h, pos: u} = InstructionParser.findNextToken(i, [ t.parametersEnd ]));
                e = i.slice(0, u);
                i = i.slice(u + h.length);
                ({token: h} = InstructionParser.findNextToken(i, s));
                i = i.slice(h.length);
            }
            s.shift();
        }
        if (h === t.viewport) {
            ({token: h, pos: u} = InstructionParser.findNextToken(i, s));
            r = -1 !== u ? i.slice(0, u) : i;
            i = -1 !== u ? i.slice(u + h.length) : "";
        }
        s.shift();
        if (h === t.noScope) o = false;
        if (h === t.groupEnd || h === t.scope || h === t.sibling) i = `${h}${i}`;
        if ("" === (n ?? "")) throw new Error(`Instruction parser error: No component specified in instruction part "${i}".`);
        const c = RoutingInstruction.create(n, r, e, o);
        c.unparsed = l;
        return {
            instruction: c,
            remaining: i
        };
    }
    static findNextToken(t, i) {
        const s = {};
        for (const n of i) {
            const i = t.indexOf(n);
            if (i > -1) s[n] = t.indexOf(n);
        }
        const n = Math.min(...Object.values(s));
        for (const t in s) if (s[t] === n) return {
            token: t,
            pos: n
        };
        return {
            token: "",
            pos: -1
        };
    }
}

class TitleOptions {
    constructor(t = "${componentTitles}${appTitleSeparator}Aurelia", i = " | ", s = "top-down", n = " > ", e = true, r = "app-", o) {
        this.appTitle = t;
        this.appTitleSeparator = i;
        this.componentTitleOrder = s;
        this.componentTitleSeparator = n;
        this.useComponentNames = e;
        this.componentPrefix = r;
        this.transformTitle = o;
    }
    static create(t = {}) {
        t = "string" === typeof t ? {
            appTitle: t
        } : t;
        return new TitleOptions(t.appTitle, t.appTitleSeparator, t.componentTitleOrder, t.componentTitleSeparator, t.useComponentNames, t.componentPrefix, t.transformTitle);
    }
    static for(t) {
        return RouterOptions.for(t).title;
    }
    apply(t = {}) {
        t = "string" === typeof t ? {
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
    constructor(t = "@", i = "+", s = "/", n = "(", e = ")", r = "!", o = "(", h = ")", u = ",", l = "=", a = "+", c = "-", f = ".") {
        this.viewport = t;
        this.sibling = i;
        this.scope = s;
        this.groupStart = n;
        this.groupEnd = e;
        this.noScope = r;
        this.parameters = o;
        this.parametersEnd = h;
        this.parameterSeparator = u;
        this.parameterKeySeparator = l;
        this.add = a;
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
    constructor(t = Separators.create(), i = Indicators.create(), s = true, n = null, e = true, r = 0, o = true, h = true, u = true, l = TitleOptions.create(), a = [ "guardedUnload", "swapped", "completed" ], c = "attach-next-detach-current", f = "", p = "abort") {
        this.separators = t;
        this.indicators = i;
        this.useUrlFragmentHash = s;
        this.basePath = n;
        this.useHref = e;
        this.statefulHistoryLength = r;
        this.useDirectRouting = o;
        this.useConfiguredRoutes = h;
        this.additiveInstructionDefault = u;
        this.title = l;
        this.navigationSyncStates = a;
        this.swapOrder = c;
        this.fallback = f;
        this.fallbackAction = p;
        this.registrationHooks = [];
    }
    static create(t = {}) {
        return new RouterOptions(Separators.create(t.separators), Indicators.create(t.indicators), t.useUrlFragmentHash, t.basePath, t.useHref, t.statefulHistoryLength, t.useDirectRouting, t.useConfiguredRoutes, t.additiveInstructionDefault, TitleOptions.create(t.title), t.navigationSyncStates, t.swapOrder, t.fallback, t.fallbackAction);
    }
    static for(t) {
        if (t instanceof RouterConfiguration) return t.options;
        if (t instanceof Router) t = t.configuration; else t = t.get(N);
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
        if (Array.isArray(t.hooks)) if (void 0 !== this.routerConfiguration) t.hooks.forEach((t => this.routerConfiguration.addHook(t.hook, t.options))); else this.registrationHooks = t.hooks;
    }
    setRouterConfiguration(t) {
        this.routerConfiguration = t;
        this.registrationHooks.forEach((t => this.routerConfiguration.addHook(t.hook, t.options)));
        this.registrationHooks.length = 0;
    }
}

var o;

(function(t) {
    t["none"] = "none";
    t["string"] = "string";
    t["array"] = "array";
    t["object"] = "object";
})(o || (o = {}));

class InstructionParameters {
    constructor() {
        this.parametersString = null;
        this.parametersRecord = null;
        this.parametersList = null;
        this.parametersType = "none";
    }
    get none() {
        return "none" === this.parametersType;
    }
    static create(t) {
        const i = new InstructionParameters;
        i.set(t);
        return i;
    }
    static parse(t, i, s = false) {
        if (null == i || 0 === i.length) return [];
        const n = Separators.for(t);
        const e = n.parameterSeparator;
        const r = n.parameterKeySeparator;
        if ("string" === typeof i) {
            const t = [];
            const n = i.split(e);
            for (const i of n) {
                let n;
                let e;
                [n, e] = i.split(r);
                if (void 0 === e) {
                    e = s ? decodeURIComponent(n) : n;
                    n = void 0;
                } else if (s) {
                    n = decodeURIComponent(n);
                    e = decodeURIComponent(e);
                }
                t.push({
                    key: n,
                    value: e
                });
            }
            return t;
        }
        if (Array.isArray(i)) return i.map((t => ({
            key: void 0,
            value: t
        })));
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
    static stringify(t, i, s = false) {
        if (!Array.isArray(i) || 0 === i.length) return "";
        const n = Separators.for(t);
        return i.map((t => {
            const i = void 0 !== t.key && s ? encodeURIComponent(t.key) : t.key;
            const e = s ? encodeURIComponent(t.value) : t.value;
            return void 0 !== i && i !== e ? i + n.parameterKeySeparator + e : e;
        })).join(n.parameterSeparator);
    }
    static contains(t, i) {
        return Object.keys(i).every((s => i[s] === t[s]));
    }
    parameters(t) {
        return InstructionParameters.parse(t, this.typedParameters);
    }
    set(t) {
        this.parametersString = null;
        this.parametersList = null;
        this.parametersRecord = null;
        if (null == t || "" === t) {
            this.parametersType = "none";
            t = null;
        } else if ("string" === typeof t) {
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
        if (void 0 === i) return this.parameters(t);
        const s = this.parameters(t).filter((t => t.key === i)).map((t => t.value));
        if (0 === s.length) return;
        return 1 === s.length ? s[0] : s;
    }
    addParameters(t) {
        if ("none" === this.parametersType) return this.set(t);
        if ("object" !== this.parametersType) throw new Error("Can't add object parameters to existing non-object parameters!");
        this.set({
            ...this.parametersRecord,
            ...t
        });
    }
    toSpecifiedParameters(t, i) {
        i = i ?? [];
        const s = this.parameters(t);
        const n = {};
        for (const t of i) {
            let i = s.findIndex((i => i.key === t));
            if (i >= 0) {
                const [e] = s.splice(i, 1);
                n[t] = e.value;
            } else {
                i = s.findIndex((t => void 0 === t.key));
                if (i >= 0) {
                    const [e] = s.splice(i, 1);
                    n[t] = e.value;
                }
            }
        }
        for (const t of s.filter((t => void 0 !== t.key))) n[t.key] = t.value;
        let e = i.length;
        for (const t of s.filter((t => void 0 === t.key))) n[e++] = t.value;
        return n;
    }
    toSortedParameters(t, i) {
        i = i || [];
        const s = this.parameters(t);
        const n = [];
        for (const t of i) {
            let i = s.findIndex((i => i.key === t));
            if (i >= 0) {
                const t = {
                    ...s.splice(i, 1)[0]
                };
                t.key = void 0;
                n.push(t);
            } else {
                i = s.findIndex((t => void 0 === t.key));
                if (i >= 0) {
                    const t = {
                        ...s.splice(i, 1)[0]
                    };
                    n.push(t);
                } else n.push({
                    value: void 0
                });
            }
        }
        const e = s.filter((t => void 0 !== t.key));
        e.sort(((t, i) => (t.key || "") < (i.key || "") ? 1 : (i.key || "") < (t.key || "") ? -1 : 0));
        n.push(...e);
        n.push(...s.filter((t => void 0 === t.key)));
        return n;
    }
    same(t, i, s) {
        const n = null !== s ? s.parameters : [];
        const e = this.toSpecifiedParameters(t, n);
        const r = i.toSpecifiedParameters(t, n);
        return Object.keys(e).every((t => e[t] === r[t])) && Object.keys(r).every((t => r[t] === e[t]));
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
        return "string" === typeof t;
    }
    static isDefinition(t) {
        return i.CustomElement.isType(t.Type);
    }
    static isType(t) {
        return i.CustomElement.isType(t);
    }
    static isInstance(t) {
        return i.isCustomElementViewModel(t);
    }
    static isAppelation(t) {
        return InstructionComponent.isName(t) || InstructionComponent.isType(t) || InstructionComponent.isInstance(t);
    }
    static getName(t) {
        if (InstructionComponent.isName(t)) return t; else if (InstructionComponent.isType(t)) return i.CustomElement.getDefinition(t).name; else return InstructionComponent.getName(t.constructor);
    }
    static getType(t) {
        if (InstructionComponent.isName(t)) return null; else if (InstructionComponent.isType(t)) return t; else return t.constructor;
    }
    static getInstance(t) {
        if (InstructionComponent.isName(t) || InstructionComponent.isType(t)) return null; else return t;
    }
    set(t) {
        let i = null;
        let s = null;
        let n = null;
        let e = null;
        let r = null;
        if (t instanceof Promise) e = t; else if (InstructionComponent.isName(t)) i = InstructionComponent.getName(t); else if (InstructionComponent.isType(t)) {
            i = this.getNewName(t);
            s = InstructionComponent.getType(t);
        } else if (InstructionComponent.isInstance(t)) {
            i = this.getNewName(InstructionComponent.getType(t));
            s = InstructionComponent.getType(t);
            n = InstructionComponent.getInstance(t);
        } else if ("function" === typeof t) r = t;
        this.name = i;
        this.type = s;
        this.instance = n;
        this.promise = e;
        this.func = r;
    }
    resolve(t) {
        if (null !== this.func) this.set(this.func(t));
        if (!(this.promise instanceof Promise)) return;
        return this.promise.then((t => {
            if (InstructionComponent.isAppelation(t)) {
                this.set(t);
                return;
            }
            if (null != t.default) {
                this.set(t.default);
                return;
            }
            const i = Object.keys(t).filter((t => !t.startsWith("__")));
            if (0 === i.length) throw new Error(`Failed to load component Type from resolved Promise since no export was specified.`);
            if (i.length > 1) throw new Error(`Failed to load component Type from resolved Promise since no 'default' export was specified when having multiple exports.`);
            const s = i[0];
            this.set(t[s]);
        }));
    }
    get none() {
        return !this.isName() && !this.isType() && !this.isInstance() && !this.isFunction() && !this.isPromise();
    }
    isName() {
        return !!this.name && !this.isType() && !this.isInstance();
    }
    isType() {
        return null !== this.type && !this.isInstance();
    }
    isInstance() {
        return null !== this.instance;
    }
    isPromise() {
        return null !== this.promise;
    }
    isFunction() {
        return null !== this.func;
    }
    toType(t, s) {
        void this.resolve(s);
        if (null !== this.type) return this.type;
        if (null !== this.name && "string" === typeof this.name) {
            if (null === t) throw new Error(`No container available when trying to resolve component '${this.name}'!`);
            if (t.has(i.CustomElement.keyFrom(this.name), true)) {
                const s = t.getResolver(i.CustomElement.keyFrom(this.name));
                if (null !== s && void 0 !== s.getFactory) {
                    const i = s.getFactory(t);
                    if (i) return i.Type;
                }
            }
        }
        return null;
    }
    toInstance(t, s, n, e) {
        void this.resolve(e);
        if (null !== this.instance) return this.instance;
        if (null == t) return null;
        const r = t.createChild();
        const o = this.isType() ? r.get(this.type) : r.get(i.CustomElement.keyFrom(this.name));
        if (null == o) {
            console.warn("Failed to create instance when trying to resolve component", this.name, this.type, "=>", o);
            throw new Error(`Failed to create instance when trying to resolve component '${this.name}'!`);
        }
        const h = i.Controller.$el(r, o, n, null);
        h.parent = s;
        return o;
    }
    same(t, i = false) {
        return i ? this.type === t.type : this.name === t.name;
    }
    getNewName(t) {
        if (null === this.name) return InstructionComponent.getName(t);
        return this.name;
    }
}

function h(t, i) {
    const s = [];
    let n = t.findIndex(i);
    while (n >= 0) {
        s.push(t.splice(n, 1)[0]);
        n = t.findIndex(i);
    }
    return s;
}

function u(t, i = false) {
    return t.filter(((t, s, n) => (i || null != t) && n.indexOf(t) === s));
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
        if (0 === (i?.length ?? 0)) return i?.[0];
        let s = false;
        if (null === t) {
            t = new Step;
            s = true;
        }
        const n = new Step(i.shift());
        Runner.connect(t, n, (t?.runParallel ?? false) || s);
        if (i.length > 0) Runner.add(n, false, ...i);
        if (s) {
            Runner.process(t);
            if (t.result instanceof Promise) this.runners.set(t.result, t);
            return t.result;
        }
        return n;
    }
    static runParallel(t, ...i) {
        if (0 === (i?.length ?? 0)) return [];
        let s = false;
        if (null === t) {
            t = new Step;
            s = true;
        } else t = Runner.connect(t, new Step, true);
        Runner.add(t, true, ...i);
        if (s) Runner.process(t);
        if (t.result instanceof Promise) this.runners.set(t.result, t);
        return s ? t.result ?? [] : t;
    }
    static step(t) {
        if (t instanceof Promise) return Runner.runners.get(t);
    }
    static cancel(t) {
        const i = Runner.step(t);
        if (void 0 !== i) i.cancel();
    }
    static add(t, i, ...s) {
        let n = new Step(s.shift(), i);
        if (null !== t) n = Runner.connect(t, n, i);
        const e = n;
        while (s.length > 0) n = Runner.connect(n, new Step(s.shift(), i), false);
        return e;
    }
    static connect(t, i, s) {
        if (!s) {
            const s = t.next;
            t.next = i;
            i.previous = t;
            i.next = s;
            if (null !== s) {
                s.previous = i;
                s.parent = null;
            }
        } else {
            const s = t.child;
            t.child = i;
            i.parent = t;
            i.next = s;
            if (null !== s) {
                s.parent = null;
                s.previous = i;
            }
        }
        return i;
    }
    static process(t) {
        const i = t.root;
        while (null !== t && !t.isDoing && !t.isDone) {
            i.current = t;
            if (t.isParallelParent) {
                t.isDone = true;
                let i = t.child;
                while (null !== i) {
                    Runner.process(i);
                    i = i.next;
                }
            } else {
                t.isDoing = true;
                t.value = t.step;
                while (t.value instanceof Function && !t.isCancelled && !t.isExited && !t.isDone) t.value = t.value(t);
                if (!t.isCancelled) if (t.value instanceof Promise) {
                    const s = t.value;
                    Runner.ensurePromise(i);
                    ((t, i) => {
                        i.then((i => {
                            t.value = i;
                            Runner.settlePromise(t);
                            t.isDone = true;
                            t.isDoing = false;
                            const s = t.nextToDo();
                            if (null !== s && !t.isExited) Runner.process(s); else if (t.root.doneAll || t.isExited) Runner.settlePromise(t.root);
                        })).catch((t => {
                            throw t;
                        }));
                    })(t, s);
                } else {
                    t.isDone = true;
                    t.isDoing = false;
                    if (!t.isExited) t = t.nextToDo(); else t = null;
                }
            }
        }
        if (i.isCancelled) Runner.settlePromise(i, "reject"); else if (i.doneAll || i.isExited) Runner.settlePromise(i);
    }
    static ensurePromise(t) {
        if (null === t.finally) {
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
        if (null !== this.promise) return this.promise;
        if (null !== this.child) if (this.isParallelParent) {
            const t = [];
            let i = this.child;
            while (null !== i) {
                t.push(i.result);
                i = i.next;
            }
            return t;
        } else return this === this.root && null !== this.exited ? this.exited.result : this.child?.tail?.result;
        let t = this.value;
        while (t instanceof Step) t = t.result;
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
        if (this.runParallel) t = `:${t}`;
        if (this.value instanceof Promise || this.promise instanceof Promise) t = `${t}*`;
        if (null !== this.finally) t = `${t}*`;
        if (null !== this.child) t = `${t}>`;
        if (this.isDone) t = `(${t})`;
        return t;
    }
    get root() {
        let t = this.head;
        while (null !== t.parent) t = t.parent.head;
        return t;
    }
    get head() {
        let t = this;
        while (null !== t.previous) t = t.previous;
        return t;
    }
    get tail() {
        let t = this;
        while (null !== t.next) t = t.next;
        return t;
    }
    get done() {
        if (!this.isDone) return false;
        let t = this.child;
        while (null !== t) {
            if (!t.done) return false;
            t = t.next;
        }
        return true;
    }
    get doneAll() {
        if (!this.isDone || null !== this.child && !this.child.doneAll || null !== this.next && !this.next.doneAll) return false;
        return true;
    }
    cancel(t = true) {
        if (t) return this.root.cancel(false);
        if (this.isCancelled) return false;
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
        if (this.isExited) return false;
        this.isExited = true;
        this.child?.exit(false);
        this.next?.exit(false);
        return true;
    }
    nextToDo() {
        if (null !== this.child && !this.child.isDoing && !this.child.isDone) return this.child;
        if (this.runParallel && !this.head.parent.done) return null;
        return this.nextOrUp();
    }
    nextOrUp() {
        let t = this.next;
        while (null !== t) {
            if (!t.isDoing && !t.isDone) return t;
            t = t.next;
        }
        const i = this.head.parent ?? null;
        if (null === i || !i.done) return null;
        return i.nextOrUp();
    }
    get path() {
        return `${this.head.parent?.path ?? ""}/${this.name}`;
    }
    get tree() {
        let t = "";
        let i = this.head;
        let s = i.parent;
        let n = "";
        while (null !== s) {
            n = `${s.path}${n}`;
            s = s.head.parent;
        }
        do {
            t += `${n}/${i.name}\n`;
            if (i === this) break;
            i = i.next;
        } while (null !== i);
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
    constructor(t, i, s, n, e, r, o, h) {
        this.path = t;
        this.id = i;
        this.redirectTo = s;
        this.instructions = n;
        this.caseSensitive = e;
        this.title = r;
        this.reloadBehavior = o;
        this.data = h;
    }
    static isConfigured(t) {
        return s.Metadata.hasOwn(Route.resourceKey, t) || "parameters" in t || "title" in t;
    }
    static configure(t, i) {
        const n = Route.create(t, i);
        s.Metadata.define(Route.resourceKey, n, i);
        return i;
    }
    static getConfiguration(t) {
        const i = s.Metadata.getOwn(Route.resourceKey, t) ?? {};
        if (Array.isArray(t.parameters)) i.parameters = t.parameters;
        if ("title" in t) i.title = t.title;
        return i instanceof Route ? i : Route.create(i, t);
    }
    static create(t, s = null) {
        if (null !== s) t = Route.transferTypeToComponent(t, s);
        if (i.CustomElement.isType(t)) t = Route.getConfiguration(t); else if (null === s) t = {
            ...t
        };
        const n = Route.transferIndividualIntoInstructions(t);
        Route.validateRouteConfiguration(n);
        let e = n.path;
        if (Array.isArray(e)) e = e.join(",");
        return new Route(n.path ?? "", n.id ?? e ?? null, n.redirectTo ?? null, n.instructions ?? null, n.caseSensitive ?? false, n.title ?? null, n.reloadBehavior ?? null, n.data ?? null);
    }
    static transferTypeToComponent(t, s) {
        if (i.CustomElement.isType(t)) throw new Error(`Invalid route configuration: A component ` + `can't be specified in a component route configuration.`);
        const n = {
            ...t
        } ?? {};
        if ("component" in n || "instructions" in n) throw new Error(`Invalid route configuration: The 'component' and 'instructions' properties ` + `can't be specified in a component route configuration.`);
        if (!("redirectTo" in n)) n.component = s;
        if (!("path" in n) && !("redirectTo" in n)) n.path = i.CustomElement.getDefinition(s).name;
        return n;
    }
    static transferIndividualIntoInstructions(t) {
        if (null === t || void 0 === t) throw new Error(`Invalid route configuration: expected an object.`);
        if (null !== (t.component ?? null) || null !== (t.viewport ?? null) || null !== (t.parameters ?? null) || null !== (t.children ?? null)) {
            if (null != t.instructions) throw new Error(`Invalid route configuration: The 'instructions' property can't be used together with ` + `the 'component', 'viewport', 'parameters' or 'children' properties.`);
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
        if (null === t.redirectTo && null === t.instructions) throw new Error(`Invalid route configuration: either 'redirectTo' or 'instructions' ` + `need to be specified.`);
    }
}

Route.resourceKey = t.Protocol.resource.keyFor("route");

const l = {
    name: t.Protocol.resource.keyFor("routes"),
    isConfigured(t) {
        return s.Metadata.hasOwn(l.name, t) || "routes" in t;
    },
    configure(t, i) {
        const n = t.map((t => Route.create(t)));
        s.Metadata.define(l.name, n, i);
        return i;
    },
    getConfiguration(t) {
        const i = t;
        const n = [];
        const e = s.Metadata.getOwn(l.name, t);
        if (Array.isArray(e)) n.push(...e);
        if (Array.isArray(i.routes)) n.push(...i.routes);
        return n.map((t => t instanceof Route ? t : Route.create(t)));
    }
};

function a(t) {
    return function(i) {
        return l.configure(t, i);
    };
}

class ViewportScopeContent extends EndpointContent {}

class ViewportScope extends Endpoint$1 {
    constructor(t, i, s, n, e, r = null, o = {
        catches: [],
        source: null
    }) {
        super(t, i, s);
        this.rootComponentType = r;
        this.options = o;
        this.instruction = null;
        this.available = true;
        this.sourceItem = null;
        this.sourceItemIndex = -1;
        this.remove = false;
        this.add = false;
        this.contents.push(new ViewportScopeContent(t, this, n, e));
        if (this.catches.length > 0) this.instruction = RoutingInstruction.create(this.catches[0], this.name);
    }
    get isEmpty() {
        return null === this.instruction;
    }
    get passThroughScope() {
        return null === this.rootComponentType && 0 === this.catches.length;
    }
    get siblings() {
        const t = this.connectedScope.parent;
        if (null === t) return [ this ];
        return t.enabledChildren.filter((t => t.isViewportScope && t.endpoint.name === this.name)).map((t => t.endpoint));
    }
    get source() {
        return this.options.source ?? null;
    }
    get catches() {
        let t = this.options.catches ?? [];
        if ("string" === typeof t) t = t.split(",");
        return t;
    }
    get default() {
        if (this.catches.length > 0) return this.catches[0];
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
        if (this.add) t.component.name = null;
        if (void 0 !== this.default && null === t.component.name) t.component.name = this.default;
        this.contents.push(new ViewportScopeContent(this.router, this, this.owningScope, this.scope.hasScope, t, i));
        return "swap";
    }
    transition(t) {
        Runner.run(null, (i => t.setEndpointStep(this, i.root)), (() => t.addEndpointState(this, "guardedUnload")), (() => t.addEndpointState(this, "guardedLoad")), (() => t.addEndpointState(this, "guarded")), (() => t.addEndpointState(this, "loaded")), (() => t.addEndpointState(this, "unloaded")), (() => t.addEndpointState(this, "routed")), (() => t.addEndpointState(this, "swapped")), (() => t.addEndpointState(this, "completed")));
    }
    finalizeContentChange(t, i) {
        const s = this.contents.findIndex((i => i.navigation === t.navigation));
        let n = this.contents[s];
        if (this.remove) {
            const t = new ViewportScopeContent(this.router, this, this.owningScope, this.scope.hasScope);
            this.contents.splice(s, 1, t);
            n.delete();
            n = t;
        }
        n.completed = true;
        let e = 0;
        for (let t = 0, i = s; t < i; t++) {
            if (!(this.contents[0].navigation.completed ?? false)) break;
            e++;
        }
        this.contents.splice(0, e);
        if (this.remove && Array.isArray(this.source)) this.removeSourceItem();
    }
    cancelContentChange(t, i = null) {
        [ ...new Set(this.scope.children.map((t => t.endpoint))) ].forEach((s => s.cancelContentChange(t, i)));
        const s = this.contents.findIndex((i => i.navigation === t.navigation));
        if (s < 0) return;
        this.contents.splice(s, 1);
        if (this.add) {
            const t = this.source.indexOf(this.sourceItem);
            this.source.splice(t, 1);
            this.sourceItem = null;
        }
    }
    acceptSegment(t) {
        if (null === t && void 0 === t || 0 === t.length) return true;
        if (t === RoutingInstruction.clear(this.router) || t === RoutingInstruction.add(this.router) || t === this.name) return true;
        if (0 === this.catches.length) return true;
        if (this.catches.includes(t)) return true;
        if (this.catches.filter((t => t.includes("*"))).length) return true;
        return false;
    }
    binding() {
        const t = this.source || [];
        if (t.length > 0 && null === this.sourceItem) this.sourceItem = this.getAvailableSourceItem();
    }
    unbinding() {
        if (null !== this.sourceItem && null !== this.source) h(this.source, (t => t === this.sourceItem));
        this.sourceItem = null;
    }
    getAvailableSourceItem() {
        if (null === this.source) return null;
        const t = this.siblings;
        for (const i of this.source) if (t.every((t => t.sourceItem !== i))) return i;
        return null;
    }
    addSourceItem() {
        const t = {};
        this.source.push(t);
        return t;
    }
    removeSourceItem() {
        this.sourceItemIndex = this.source.indexOf(this.sourceItem);
        if (this.sourceItemIndex >= 0) this.source.splice(this.sourceItemIndex, 1);
    }
    getRoutes() {
        const t = [];
        if (null !== this.rootComponentType) {
            const i = this.rootComponentType.constructor === this.rootComponentType.constructor.constructor ? this.rootComponentType : this.rootComponentType.constructor;
            t.push(...l.getConfiguration(i) ?? []);
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
        const s = this.map.get(t);
        if (s instanceof OpenPromise) s.resolve(i);
        this.map.set(t, i);
    }
    delete(t) {
        const i = this.map.get(t);
        if (i instanceof OpenPromise) i.reject();
        this.map.delete(t);
    }
    await(t) {
        if (!this.map.has(t)) {
            const i = new OpenPromise;
            this.map.set(t, i);
            return i.promise;
        }
        const i = this.map.get(t);
        if (i instanceof OpenPromise) return i.promise;
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
    constructor(t, i, s, n, e = RoutingInstruction.create(""), r = Navigation.create({
        instruction: "",
        fullStateInstruction: ""
    }), o = null) {
        super(t, i, s, n, e, r);
        this.router = t;
        this.instruction = e;
        this.navigation = r;
        this.contentStates = new AwaitableMap;
        this.fromCache = false;
        this.fromHistory = false;
        this.reload = false;
        this.activatedResolve = null;
        if (!this.instruction.component.isType() && null != o?.container) this.instruction.component.type = this.toComponentType(o.container);
    }
    get componentInstance() {
        return this.instruction.component.instance;
    }
    get reloadBehavior() {
        if (this.instruction.route instanceof FoundRoute && null !== this.instruction.route.match?.reloadBehavior) return this.instruction.route.match?.reloadBehavior;
        return null !== this.instruction.component.instance && "reloadBehavior" in this.instruction.component.instance && void 0 !== this.instruction.component.instance.reloadBehavior ? this.instruction.component.instance.reloadBehavior : "default";
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
        return i.Controller.$el(t.container.createChild(), this.instruction.component.instance, t.element, null);
    }
    createComponent(t, i, s) {
        if (this.contentStates.has("created")) return;
        if (!this.fromCache && !this.fromHistory) try {
            this.instruction.component.set(this.toComponentInstance(t.container, t.controller, t.element));
        } catch (n) {
            if (!n.message.startsWith("AUR0009:")) throw n;
            if ("" !== (i ?? "")) {
                if ("process-children" === s) this.instruction.parameters.set([ this.instruction.component.name ]); else {
                    this.instruction.parameters.set([ this.instruction.unparsed ?? this.instruction.component.name ]);
                    this.instruction.nextScopeInstructions = null;
                }
                this.instruction.component.set(i);
                try {
                    this.instruction.component.set(this.toComponentInstance(t.container, t.controller, t.element));
                } catch (t) {
                    if (!t.message.startsWith("AUR0009:")) throw t;
                    throw new Error(`'${this.instruction.component.name}' did not match any configured route or registered component name - did you forget to add the component '${this.instruction.component.name}' to the dependencies or to register it as a global dependency?`);
                }
            } else throw new Error(`'${this.instruction.component.name}' did not match any configured route or registered component name - did you forget to add the component '${this.instruction.component.name}' to the dependencies or to register it as a global dependency?`);
        }
        this.contentStates.set("created", void 0);
    }
    canLoad() {
        if (!this.contentStates.has("created") || this.contentStates.has("checkedLoad") && !this.reload) return true;
        const t = this.instruction.component.instance;
        if (null == t) return true;
        this.contentStates.set("checkedLoad", void 0);
        const i = this.endpoint.parentViewport?.getTimeContent(this.navigation.timestamp)?.instruction?.typeParameters(this.router);
        const s = this.instruction.typeParameters(this.router);
        const n = {
            ...this.navigation.parameters,
            ...i,
            ...s
        };
        const e = this.getLifecycleHooks(t, "canLoad").map((i => s => {
            const e = i(t, n, this.instruction, this.navigation);
            if ("boolean" === typeof e) {
                if (false === e) s.exit();
                return e;
            }
            if ("string" === typeof e) {
                s.exit();
                return e;
            }
            return e;
        }));
        if (0 !== e.length) {
            const t = Runner.run(null, ...e);
            if (true !== t) {
                if (false === t) return false;
                if ("string" === typeof t) return t;
                return t;
            }
        }
        if (null == t.canLoad) return true;
        const r = t.canLoad(n, this.instruction, this.navigation);
        if ("boolean" === typeof r || "string" === typeof r) return r;
        return r;
    }
    canUnload(t) {
        if (this.contentStates.has("checkedUnload") && !this.reload) return true;
        this.contentStates.set("checkedUnload", void 0);
        if (!this.contentStates.has("loaded")) return true;
        const i = this.instruction.component.instance;
        if (null === t) t = Navigation.create({
            instruction: "",
            fullStateInstruction: "",
            previous: this.navigation
        });
        const s = this.getLifecycleHooks(i, "canUnload").map((s => n => {
            const e = s(i, this.instruction, t);
            if ("boolean" === typeof e) {
                if (false === e) n.exit();
                return e;
            }
            return e;
        }));
        if (0 !== s.length) {
            const t = Runner.run(null, ...s);
            if (true !== t) {
                if (false === t) return false;
                return t;
            }
        }
        if (!i.canUnload) return true;
        const n = i.canUnload(this.instruction, t);
        if ("boolean" !== typeof n && !(n instanceof Promise)) throw new Error(`Method 'canUnload' in component "${this.instruction.component.name}" needs to return true or false or a Promise resolving to true or false.`);
        return n;
    }
    load(t) {
        return Runner.run(t, (() => this.contentStates.await("checkedLoad")), (() => {
            if (!this.contentStates.has("created") || this.contentStates.has("loaded") && !this.reload) return;
            this.reload = false;
            this.contentStates.set("loaded", void 0);
            const t = this.instruction.component.instance;
            const i = this.endpoint.parentViewport?.getTimeContent(this.navigation.timestamp)?.instruction?.typeParameters(this.router);
            const s = this.instruction.typeParameters(this.router);
            const n = {
                ...this.navigation.parameters,
                ...i,
                ...s
            };
            const e = this.getLifecycleHooks(t, "loading").map((i => () => i(t, n, this.instruction, this.navigation)));
            e.push(...this.getLifecycleHooks(t, "load").map((i => () => {
                console.warn(`[Deprecated] Found deprecated hook name "load" in ${this.instruction.component.name}. Please use the new name "loading" instead.`);
                return i(t, n, this.instruction, this.navigation);
            })));
            if (0 !== e.length) {
                if ("function" === typeof t.loading) e.push((() => t.loading(n, this.instruction, this.navigation)));
                if ("function" === typeof t.load) {
                    console.warn(`[Deprecated] Found deprecated hook name "load" in ${this.instruction.component.name}. Please use the new name "loading" instead.`);
                    e.push((() => t.load(n, this.instruction, this.navigation)));
                }
                return Runner.run(null, ...e);
            }
            if ("function" === typeof t.loading) return t.loading(n, this.instruction, this.navigation);
            if ("function" === typeof t.load) {
                console.warn(`[Deprecated] Found deprecated hook name "load" in ${this.instruction.component.name}. Please use the new name "loading" instead.`);
                return t.load(n, this.instruction, this.navigation);
            }
        }));
    }
    unload(t) {
        if (!this.contentStates.has("loaded")) return;
        this.contentStates.delete("loaded");
        const i = this.instruction.component.instance;
        if (null === t) t = Navigation.create({
            instruction: "",
            fullStateInstruction: "",
            previous: this.navigation
        });
        const s = this.getLifecycleHooks(i, "unloading").map((s => () => s(i, this.instruction, t)));
        s.push(...this.getLifecycleHooks(i, "unload").map((s => () => {
            console.warn(`[Deprecated] Found deprecated hook name "unload" in ${this.instruction.component.name}. Please use the new name "unloading" instead.`);
            return s(i, this.instruction, t);
        })));
        if (0 !== s.length) {
            if ("function" === typeof i.unloading) s.push((() => i.unloading(this.instruction, t)));
            if ("function" === typeof i.unload) {
                console.warn(`[Deprecated] Found deprecated hook name "unload" in ${this.instruction.component.name}. Please use the new name "unloading" instead.`);
                s.push((() => i.unload(this.instruction, t)));
            }
            return Runner.run(null, ...s);
        }
        if ("function" === typeof i.unloading) return i.unloading(this.instruction, t);
        if ("function" === typeof i.unload) {
            console.warn(`[Deprecated] Found deprecated hook name "unload" in ${this.instruction.component.name}. Please use the new name "unloading" instead.`);
            return i.unload(this.instruction, t);
        }
    }
    activateComponent(t, i, s, n, e, r, o) {
        return Runner.run(t, (() => this.contentStates.await("loaded")), (() => this.waitForParent(s)), (() => {
            if (this.contentStates.has("activating") || this.contentStates.has("activated")) return;
            this.contentStates.set("activating", void 0);
            return this.controller?.activate(i ?? this.controller, s, n, void 0);
        }), (() => {
            this.contentStates.set("activated", void 0);
        }));
    }
    deactivateComponent(t, i, s, n, e, r = false) {
        if (!this.contentStates.has("activated") && !this.contentStates.has("activating")) return;
        return Runner.run(t, (() => {
            if (r && null !== e.element) {
                const t = Array.from(e.element.getElementsByTagName("*"));
                for (const i of t) if (i.scrollTop > 0 || i.scrollLeft) i.setAttribute("au-element-scroll", `${i.scrollTop},${i.scrollLeft}`);
            }
            this.contentStates.delete("activated");
            this.contentStates.delete("activating");
            return this.controller?.deactivate(i ?? this.controller, s, n);
        }));
    }
    disposeComponent(t, i, s = false) {
        if (!this.contentStates.has("created") || null == this.instruction.component.instance) return;
        if (!s) {
            this.contentStates.delete("created");
            return this.controller?.dispose();
        } else i.push(this);
    }
    freeContent(t, i, s, n, e = false) {
        return Runner.run(t, (() => this.unload(s)), (t => this.deactivateComponent(t, null, i.controller, 0, i, e)), (() => this.disposeComponent(i, n, e)));
    }
    toComponentName() {
        return this.instruction.component.name;
    }
    toComponentType(t) {
        if (this.instruction.component.none) return null;
        return this.instruction.component.toType(t, this.instruction);
    }
    toComponentInstance(t, i, s) {
        if (this.instruction.component.none) return null;
        return this.instruction.component.toInstance(t, i, s, this.instruction);
    }
    waitForParent(t) {
        if (null === t) return;
        if (!t.isActive) return new Promise((t => {
            this.endpoint.activeResolve = t;
        }));
    }
    getLifecycleHooks(t, i) {
        const s = t.$controller.lifecycleHooks[i] ?? [];
        return s.map((t => t.instance[i].bind(t.instance)));
    }
}

class ViewportOptions {
    constructor(t = true, i = [], s = "", n = "", e = "", r = false, o = false, h = false, u = false, l = false) {
        this.scope = t;
        this.usedBy = i;
        this.fallback = n;
        this.fallbackAction = e;
        this.noLink = r;
        this.noTitle = o;
        this.stateful = h;
        this.forceDescription = u;
        this.noHistory = l;
        this.default = void 0;
        this.default = s;
    }
    static create(t) {
        const i = new ViewportOptions;
        if (void 0 !== t) i.apply(t);
        return i;
    }
    apply(t) {
        this.scope = t.scope ?? this.scope;
        this.usedBy = ("string" === typeof t.usedBy ? t.usedBy.split(",").filter((t => t.length > 0)) : t.usedBy) ?? this.usedBy;
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
    constructor(t, i, s, n, e, r) {
        super(t, i, s);
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
        this.contents.push(new ViewportContent(t, this, n, e));
        this.contents[0].completed = true;
        if (void 0 !== r) this.options.apply(r);
    }
    getContent() {
        if (1 === this.contents.length) return this.contents[0];
        let t;
        for (let i = 0, s = this.contents.length; i < s; i++) if (this.contents[i].completed ?? false) t = this.contents[i]; else break;
        return t;
    }
    getNextContent() {
        if (1 === this.contents.length) return null;
        const t = this.contents.indexOf(this.getContent());
        return this.contents.length > t ? this.contents[t + 1] : null;
    }
    getTimeContent(t) {
        let i = null;
        for (let s = 0, n = this.contents.length; s < n; s++) {
            if (this.contents[s].navigation.timestamp > t) break;
            i = this.contents[s];
        }
        return i;
    }
    getNavigationContent(t) {
        return super.getNavigationContent(t);
    }
    get parentViewport() {
        let t = this.connectedScope;
        while (null != t?.parent) {
            t = t.parent;
            if (t.endpoint.isViewport) return t.endpoint;
        }
        return null;
    }
    get isEmpty() {
        return null === this.getContent().componentInstance;
    }
    get doForceRemove() {
        let t = this.connectedScope;
        while (null !== t) {
            if (t.isViewport && t.endpoint.forceRemove) return true;
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
        const s = this.getContent();
        const n = new ViewportContent(this.router, this, this.owningScope, this.scope.hasScope, !this.clear ? t : void 0, i, this.connectedCE ?? null);
        this.contents.push(n);
        n.fromHistory = null !== n.componentInstance && i.navigation ? !!i.navigation.back || !!i.navigation.forward : false;
        if (this.options.stateful) {
            const t = this.cache.find((t => n.isCacheEqual(t)));
            if (void 0 !== t) {
                this.contents.splice(this.contents.indexOf(n), 1, t);
                n.fromCache = true;
            } else this.cache.push(n);
        }
        if (null !== n.componentInstance && s.componentInstance === n.componentInstance) {
            n.delete();
            this.contents.splice(this.contents.indexOf(n), 1);
            return this.transitionAction = "skip";
        }
        if (!s.equalComponent(n) || i.navigation.refresh || "refresh" === s.reloadBehavior) return this.transitionAction = "swap";
        if ("disallow" === s.reloadBehavior) {
            n.delete();
            this.contents.splice(this.contents.indexOf(n), 1);
            return this.transitionAction = "skip";
        }
        if ("reload" === s.reloadBehavior) {
            s.reload = true;
            n.instruction.component.set(s.componentInstance);
            n.contentStates = s.contentStates.clone();
            n.reload = s.reload;
            return this.transitionAction = "reload";
        }
        if (this.options.stateful && s.equalParameters(n)) {
            n.delete();
            this.contents.splice(this.contents.indexOf(n), 1);
            return this.transitionAction = "skip";
        }
        if (!s.equalParameters(n)) return this.transitionAction = "swap";
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
            if (null != this.connectionResolve) this.connectionResolve();
        }
        const s = (this.scope.parent?.endpoint.getRoutes() ?? []).filter((t => (Array.isArray(t.path) ? t.path : [ t.path ]).includes(""))).length > 0;
        if (null === this.getContent().componentInstance && null == this.getNextContent()?.componentInstance && (this.options.default || s)) {
            const t = RoutingInstruction.parse(this.router, this.options.default ?? "");
            if (0 === t.length && s) {
                const i = this.scope.parent?.findInstructions([ RoutingInstruction.create("") ], false, this.router.configuration.options.useConfiguredRoutes);
                if (i?.foundConfiguration) t.push(...i.instructions);
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
        if (this.connectedCE === i) return Runner.run(t, (t => {
            if (null !== this.getContent().componentInstance) return this.getContent().freeContent(t, this.connectedCE, this.getNextContent()?.navigation ?? null, this.historyCache, this.doForceRemove ? false : this.router.statefulHistory || this.options.stateful);
        }), (t => {
            if (this.doForceRemove) {
                const i = [];
                for (const t of this.historyCache) i.push((i => t.freeContent(i, null, null, this.historyCache, false)));
                i.push((() => {
                    this.historyCache = [];
                }));
                return Runner.run(t, ...i);
            }
            return true;
        }));
        return false;
    }
    async transition(t) {
        const i = this.router.configuration.options.indicators.viewportNavigating;
        this.coordinators.push(t);
        while (this.coordinators[0] !== t) await this.coordinators[0].waitForSyncState("completed");
        let s = this.parentViewport;
        if (null !== s && "reload" !== s.transitionAction && "swap" !== s.transitionAction) s = null;
        const n = [ i => {
            if (this.isActiveNavigation(t)) return this.canUnload(t, i);
        }, i => {
            if (this.isActiveNavigation(t)) if (!i.previousValue) t.cancel(); else if (this.router.isRestrictedNavigation) {
                const i = this.router.configuration.options;
                this.getNavigationContent(t).createComponent(this.connectedCE, this.options.fallback || i.fallback, this.options.fallbackAction || i.fallbackAction);
            }
            t.addEndpointState(this, "guardedUnload");
        }, () => t.waitForSyncState("guardedUnload", this), () => null !== s ? t.waitForEndpointState(s, "guardedLoad") : void 0, i => {
            if (this.isActiveNavigation(t)) return this.canLoad(t, i);
        }, i => {
            if (this.isActiveNavigation(t)) {
                let s = i.previousValue;
                if ("boolean" === typeof s) {
                    if (!s) {
                        i.cancel();
                        t.cancel();
                        this.getNavigationContent(t).instruction.nextScopeInstructions = null;
                        return;
                    }
                } else {
                    this.getNavigationContent(t).instruction.nextScopeInstructions = null;
                    if ("string" === typeof s) {
                        const t = this.scope;
                        const i = this.router.configuration.options;
                        let n = RoutingInstruction.parse(this.router, s);
                        const e = t.parent?.findInstructions(n, i.useDirectRouting, i.useConfiguredRoutes);
                        if (e?.foundConfiguration || e?.foundInstructions) n = e.instructions;
                        for (const i of n) {
                            i.endpoint.set(this);
                            i.scope = t.owningScope;
                        }
                        s = n;
                    }
                    return Runner.run(i, (i => this.cancelContentChange(t, i)), (t => {
                        void this.router.load(s, {
                            append: true
                        });
                        return t.exit();
                    }));
                }
            }
            t.addEndpointState(this, "guardedLoad");
            t.addEndpointState(this, "guarded");
        } ];
        const e = [ () => t.waitForSyncState("guarded", this), i => {
            if (this.isActiveNavigation(t)) return this.unload(t, i);
        }, () => t.addEndpointState(this, "unloaded"), () => t.waitForSyncState("unloaded", this), () => null !== s ? t.waitForEndpointState(s, "loaded") : void 0, i => {
            if (this.isActiveNavigation(t)) return this.load(t, i);
        }, () => t.addEndpointState(this, "loaded"), () => t.addEndpointState(this, "routed") ];
        const r = [ () => t.waitForSyncState("routed", this), () => t.waitForEndpointState(this, "routed") ];
        const o = this.router.configuration.options.swapOrder;
        switch (o) {
          case "detach-current-attach-next":
            r.push((i => {
                if (this.isActiveNavigation(t)) return this.removeContent(i, t);
            }), (i => {
                if (this.isActiveNavigation(t)) return this.addContent(i, t);
            }));
            break;

          case "attach-next-detach-current":
            r.push((i => {
                if (this.isActiveNavigation(t)) return this.addContent(i, t);
            }), (i => {
                if (this.isActiveNavigation(t)) return this.removeContent(i, t);
            }));
            break;

          case "detach-attach-simultaneously":
            r.push((i => Runner.runParallel(i, (i => {
                if (this.isActiveNavigation(t)) return this.removeContent(i, t);
            }), (i => {
                if (this.isActiveNavigation(t)) return this.addContent(i, t);
            }))));
            break;

          case "attach-detach-simultaneously":
            r.push((i => Runner.runParallel(i, (i => {
                if (this.isActiveNavigation(t)) return this.addContent(i, t);
            }), (i => {
                if (this.isActiveNavigation(t)) return this.removeContent(i, t);
            }))));
            break;
        }
        r.push((() => t.addEndpointState(this, "swapped")));
        this.connectedCE?.setActivity?.(i, true);
        this.connectedCE?.setActivity?.(t.navigation.navigation, true);
        const h = Runner.run(null, (i => t.setEndpointStep(this, i.root)), ...n, ...e, ...r, (() => t.addEndpointState(this, "completed")), (() => t.waitForSyncState("bound")), (() => {
            this.connectedCE?.setActivity?.(i, false);
            this.connectedCE?.setActivity?.(t.navigation.navigation, false);
        }));
        if (h instanceof Promise) h.catch((t => {}));
    }
    canUnload(t, i) {
        return Runner.run(i, (i => this.getContent().connectedScope.canUnload(t, i)), (i => {
            if (!i.previousValue) return false;
            return this.getContent().canUnload(t.navigation);
        }));
    }
    canLoad(t, i) {
        if (this.clear) return true;
        return Runner.run(i, (() => this.waitForConnected()), (() => {
            const i = this.router.configuration.options;
            const s = this.getNavigationContent(t);
            s.createComponent(this.connectedCE, this.options.fallback || i.fallback, this.options.fallbackAction || i.fallbackAction);
            return s.canLoad();
        }));
    }
    load(t, i) {
        if (this.clear) return;
        return this.getNavigationContent(t).load(i);
    }
    addContent(t, i) {
        return this.activate(t, null, this.connectedController, 0, i);
    }
    removeContent(t, i) {
        if (this.isEmpty) return;
        const s = this.router.statefulHistory || (this.options.stateful ?? false);
        return Runner.run(t, (() => i.addEndpointState(this, "bound")), (() => i.waitForSyncState("bound")), (t => this.deactivate(t, null, this.connectedController, s ? 0 : 4)), (() => s ? this.dispose() : void 0));
    }
    activate(t, i, s, n, e) {
        if (null !== this.activeContent.componentInstance) return Runner.run(t, (() => this.activeContent.canLoad()), (t => this.activeContent.load(t)), (t => this.activeContent.activateComponent(t, i, s, n, this.connectedCE, (() => e?.addEndpointState(this, "bound")), e?.waitForSyncState("bound"))));
    }
    deactivate(t, i, s, n) {
        const e = this.getContent();
        if (null != e?.componentInstance && !e.reload && e.componentInstance !== this.getNextContent()?.componentInstance) return e.deactivateComponent(t, i, s, n, this.connectedCE, this.router.statefulHistory || this.options.stateful);
    }
    unload(t, i) {
        return Runner.run(i, (i => this.getContent().connectedScope.unload(t, i)), (() => null != this.getContent().componentInstance ? this.getContent().unload(t.navigation ?? null) : void 0));
    }
    dispose() {
        if (null !== this.getContent().componentInstance && !this.getContent().reload && this.getContent().componentInstance !== this.getNextContent()?.componentInstance) this.getContent().disposeComponent(this.connectedCE, this.historyCache, this.router.statefulHistory || this.options.stateful);
    }
    finalizeContentChange(t, i) {
        const s = this.contents.findIndex((i => i.navigation === t.navigation));
        let n = this.contents[s];
        const e = this.contents[s - 1];
        if (this.clear) {
            const t = new ViewportContent(this.router, this, this.owningScope, this.scope.hasScope, void 0, n.navigation);
            this.contents.splice(s, 1, t);
            n.delete();
            n = t;
        } else n.reload = false;
        e.delete();
        n.completed = true;
        this.transitionAction = "";
        n.contentStates.delete("checkedUnload");
        n.contentStates.delete("checkedLoad");
        this.previousViewportState = null;
        const r = this.router.configuration.options.indicators.viewportNavigating;
        this.connectedCE?.setActivity?.(r, false);
        this.connectedCE?.setActivity?.(t.navigation.navigation, false);
        let o = 0;
        for (let t = 0, i = s; t < i; t++) {
            if (!(this.contents[0].navigation.completed ?? false)) break;
            o++;
        }
        this.contents.splice(0, o);
        h(this.coordinators, (i => i === t));
    }
    cancelContentChange(t, i = null) {
        [ ...new Set(this.scope.children.map((t => t.endpoint))) ].forEach((s => s.cancelContentChange(t, i)));
        const s = this.contents.findIndex((i => i.navigation === t.navigation));
        if (s < 0) return;
        const n = t.getEndpointStep(this)?.current ?? null;
        const e = this.contents[s];
        const r = this.contents[s - 1];
        e.instruction.cancelled = true;
        return Runner.run(n, (t => e.freeContent(t, this.connectedCE, e.navigation, this.historyCache, this.router.statefulHistory || this.options.stateful)), (() => {
            if (this.previousViewportState) Object.assign(this, this.previousViewportState);
            e?.delete();
            if (null !== e) this.contents.splice(this.contents.indexOf(e), 1);
            this.transitionAction = "";
            r?.contentStates.delete("checkedUnload");
            r?.contentStates.delete("checkedLoad");
            const i = this.router.configuration.options.indicators.viewportNavigating;
            this.connectedCE?.setActivity?.(i, false);
            this.connectedCE?.setActivity?.(t.navigation.navigation, false);
            t.removeEndpoint(this);
            h(this.coordinators, (i => i === t));
        }), (() => {
            if (n !== i) return n?.exit();
        }));
    }
    wantComponent(t) {
        return this.options.usedBy.includes(t);
    }
    acceptComponent(t) {
        if ("-" === t || null === t) return true;
        const i = this.options.usedBy;
        if (0 === i.length) return true;
        if (i.includes(t)) return true;
        if (i.filter((t => t.includes("*"))).length) return true;
        return false;
    }
    freeContent(t, i) {
        const s = this.historyCache.find((t => t.componentInstance === i));
        if (void 0 !== s) return Runner.run(t, (t => {
            this.forceRemove = true;
            return s.freeContent(t, null, null, this.historyCache, false);
        }), (() => {
            this.forceRemove = false;
            h(this.historyCache, (t => t === s));
        }));
    }
    getRoutes() {
        const t = [];
        let i = this.getComponentType();
        if (null != i) {
            i = i.constructor === i.constructor.constructor ? i : i.constructor;
            t.push(...l.getConfiguration(i) ?? []);
        }
        return t;
    }
    getTitle(t) {
        if (this.options.noTitle) return "";
        const i = this.getComponentType();
        if (null === i) return "";
        let s = "";
        const n = i.title;
        if (void 0 !== n) if ("string" === typeof n) s = n; else {
            const i = this.getComponentInstance();
            s = n.call(i, i, t);
        } else if (this.router.configuration.options.title.useComponentNames) {
            let t = this.getContentInstruction().component.name ?? "";
            const i = this.router.configuration.options.title.componentPrefix ?? "";
            if (t.startsWith(i)) t = t.slice(i.length);
            t = t.replace("-", " ");
            s = t.slice(0, 1).toLocaleUpperCase() + t.slice(1);
        }
        return s;
    }
    getComponentType() {
        let t = this.getContentInstruction().component.type ?? null;
        if (null === t) {
            const s = i.CustomElement.for(this.connectedCE.element);
            t = s.container.componentType;
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
        if (this.contents.length < 1) throw new Error("no content!");
        this.contents.push(new ViewportContent(this.router, this, t, i));
        this.cache = [];
    }
    waitForConnected() {
        if (null === this.connectedCE) return new Promise((t => {
            this.connectionResolve = t;
        }));
    }
}

class InstructionEndpoint {
    constructor() {
        this.name = null;
        this.instance = null;
        this.scope = null;
    }
    get none() {
        return null === this.name && null === this.instance;
    }
    get endpointType() {
        if (this.instance instanceof Viewport) return "Viewport";
        if (this.instance instanceof ViewportScope) return "ViewportScope";
        return null;
    }
    static create(t) {
        const i = new InstructionEndpoint;
        i.set(t);
        return i;
    }
    static isName(t) {
        return "string" === typeof t;
    }
    static isInstance(t) {
        return t instanceof Endpoint$1;
    }
    static getName(t) {
        if (InstructionEndpoint.isName(t)) return t; else return t ? t.name : null;
    }
    static getInstance(t) {
        if (InstructionEndpoint.isName(t)) return null; else return t;
    }
    set(t) {
        if (void 0 === t || "" === t) t = null;
        if ("string" === typeof t) {
            this.name = t;
            this.instance = null;
        } else {
            this.instance = t;
            if (null !== t) {
                this.name = t.name;
                this.scope = t.owningScope;
            }
        }
    }
    toInstance(t) {
        if (null !== this.instance) return this.instance;
        return t.getEndpoint(this.endpointType, this.name);
    }
    same(t, i) {
        if (null !== this.instance && null !== t.instance) return this.instance === t.instance;
        return (null === this.endpointType || null === t.endpointType || this.endpointType === t.endpointType) && (!i || this.scope === t.scope) && (null !== this.instance ? this.instance.name : this.name) === (null !== t.instance ? t.instance.name : t.name);
    }
}

class RoutingInstruction {
    constructor(t, i, s) {
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
        this.parameters = InstructionParameters.create(s);
    }
    static create(t, i, s, n = true, e = null) {
        const r = new RoutingInstruction(t, i, s);
        r.ownsScope = n;
        r.nextScopeInstructions = e;
        return r;
    }
    static createClear(t, i) {
        return RoutingInstruction.create(RoutingInstruction.clear(t), i);
    }
    static from(t, s) {
        if (!Array.isArray(s)) s = [ s ];
        const n = [];
        for (const e of s) if ("string" === typeof e) n.push(...RoutingInstruction.parse(t, e)); else if (e instanceof RoutingInstruction) n.push(e); else if (e instanceof Promise) n.push(RoutingInstruction.create(e)); else if (InstructionComponent.isAppelation(e)) n.push(RoutingInstruction.create(e)); else if (InstructionComponent.isDefinition(e)) n.push(RoutingInstruction.create(e.Type)); else if ("component" in e || "id" in e) {
            const i = e;
            const s = RoutingInstruction.create(i.component, i.viewport, i.parameters);
            s.route = e.id ?? null;
            if (void 0 !== i.children && null !== i.children) s.nextScopeInstructions = RoutingInstruction.from(t, i.children);
            n.push(s);
        } else if ("object" === typeof e && null !== e) {
            const t = i.CustomElement.define(e);
            n.push(RoutingInstruction.create(t));
        } else n.push(RoutingInstruction.create(e));
        return n;
    }
    static clear(t) {
        return Separators.for(t).clear;
    }
    static add(t) {
        return Separators.for(t).add;
    }
    static parse(t, i) {
        const s = Separators.for(t);
        let n = "";
        const e = /^[./]+/.exec(i);
        if (Array.isArray(e) && e.length > 0) {
            n = e[0];
            i = i.slice(n.length);
        }
        const r = InstructionParser.parse(s, i, true, true).instructions;
        for (const t of r) t.scopeModifier = n;
        return r;
    }
    static stringify(t, i, s = false, n = false) {
        return "string" === typeof i ? i : i.map((i => i.stringify(t, s, n))).filter((t => t.length > 0)).join(Separators.for(t).sibling);
    }
    static resolve(t) {
        const i = t.filter((t => t.isUnresolved)).map((t => t.resolve())).filter((t => t instanceof Promise));
        if (i.length > 0) return Promise.all(i);
    }
    static containsSiblings(t, i) {
        if (null === i) return false;
        if (i.filter((i => !i.isClear(t) && !i.isClearAll(t))).length > 1) return true;
        return i.some((i => RoutingInstruction.containsSiblings(t, i.nextScopeInstructions)));
    }
    static flat(t) {
        const i = [];
        for (const s of t) {
            i.push(s);
            if (s.hasNextScopeInstructions) i.push(...RoutingInstruction.flat(s.nextScopeInstructions));
        }
        return i;
    }
    static clone(t, i = false, s = false) {
        return t.map((t => t.clone(i, s)));
    }
    static contains(t, i, s, n) {
        return s.every((s => s.isIn(t, i, n)));
    }
    get viewport() {
        return this.endpoint.instance instanceof Viewport || null === this.endpoint.endpointType ? this.endpoint : null;
    }
    get viewportScope() {
        return this.endpoint.instance instanceof ViewportScope || null === this.endpoint.endpointType ? this.endpoint : null;
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
        return this.isAdd(t) && 0 === (this.endpoint.name?.length ?? 0);
    }
    isClearAll(t) {
        return this.isClear(t) && 0 === (this.endpoint.name?.length ?? 0);
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
        const s = t.route?.match;
        if (null == i || null == s) return false;
        if ("string" === typeof i || "string" === typeof s) return i === s;
        return i.id === s.id;
    }
    sameComponent(t, i, s = false, n = false) {
        if (s && !this.sameParameters(t, i, n)) return false;
        return this.component.same(i.component, n);
    }
    sameEndpoint(t, i) {
        return this.endpoint.same(t.endpoint, i);
    }
    sameParameters(t, i, s = false) {
        if (!this.component.same(i.component, s)) return false;
        return this.parameters.same(t, i.parameters, this.component.type);
    }
    stringify(t, i = false, s = false, n = false) {
        const e = Separators.for(t);
        let r = i;
        let o = false;
        if (s) {
            const t = this.viewport?.instance ?? null;
            if (t?.options.noLink ?? false) return "";
            if (!this.needsEndpointDescribed && (!(t?.options.forceDescription ?? false) || null != this.viewportScope?.instance)) r = true;
            if (t?.options.fallback === this.component.name) o = true;
            if (t?.options.default === this.component.name) o = true;
        }
        const h = this.nextScopeInstructions;
        let u = this.scopeModifier;
        if (this.route instanceof FoundRoute && !this.routeStart) return !n && Array.isArray(h) ? RoutingInstruction.stringify(t, h, i, s) : "";
        const l = this.stringifyShallow(t, r, o);
        u += l.endsWith(e.scope) ? l.slice(0, -e.scope.length) : l;
        if (!n && Array.isArray(h) && h.length > 0) {
            const n = RoutingInstruction.stringify(t, h, i, s);
            if (n.length > 0) {
                u += e.scope;
                u += 1 === h.length ? n : `${e.groupStart}${n}${e.groupEnd}`;
            }
        }
        return u;
    }
    clone(t = false, i = false, s = false) {
        const n = RoutingInstruction.create(this.component.func ?? this.component.promise ?? this.component.type ?? this.component.name, this.endpoint.name, null !== this.parameters.typedParameters ? this.parameters.typedParameters : void 0);
        if (t) {
            n.component.set(this.component.instance ?? this.component.type ?? this.component.name);
            n.endpoint.set(this.endpoint.instance ?? this.endpoint.name);
        }
        n.component.name = this.component.name;
        n.needsEndpointDescribed = this.needsEndpointDescribed;
        n.route = this.route;
        n.routeStart = this.routeStart;
        n.default = this.default;
        if (i) n.scopeModifier = this.scopeModifier;
        n.scope = t ? this.scope : null;
        if (this.hasNextScopeInstructions && !s) n.nextScopeInstructions = RoutingInstruction.clone(this.nextScopeInstructions, t, i);
        return n;
    }
    isIn(t, i, s) {
        const n = i.filter((i => {
            if (null != this.route || null != i.route) {
                if (!i.sameRoute(this)) return false;
            } else if (!i.sameComponent(t, this)) return false;
            const s = i.component.type ?? this.component.type;
            const n = this.component.type ?? i.component.type;
            const e = i.parameters.toSpecifiedParameters(t, s?.parameters);
            const r = this.parameters.toSpecifiedParameters(t, n?.parameters);
            if (!InstructionParameters.contains(e, r)) return false;
            return this.endpoint.none || i.sameEndpoint(this, false);
        }));
        if (0 === n.length) return false;
        if (!s || !this.hasNextScopeInstructions) return true;
        if (n.some((i => RoutingInstruction.contains(t, i.nextScopeInstructions ?? [], this.nextScopeInstructions, s)))) return true;
        return false;
    }
    getTitle(t) {
        if (this.route instanceof FoundRoute) {
            const i = this.route.match?.title;
            if (null != i) if (this.routeStart) return "string" === typeof i ? i : i(this, t); else return "";
        }
        return this.endpoint.instance.getTitle(t);
    }
    toJSON() {
        return {
            component: this.component.name ?? void 0,
            viewport: this.endpoint.name ?? void 0,
            parameters: this.parameters.parametersRecord ?? void 0,
            children: this.hasNextScopeInstructions ? this.nextScopeInstructions : void 0
        };
    }
    stringifyShallow(t, i = false, s = false) {
        if (null != this.route) {
            const i = this.route instanceof FoundRoute ? this.route.matching : this.route;
            return i.split("/").map((i => i.startsWith(":") ? this.parameters.get(t, i.slice(1)) : i)).join("/");
        }
        const n = Separators.for(t);
        let e = !s ? this.component.name ?? "" : "";
        const r = this.component.type ? this.component.type.parameters : null;
        const o = InstructionParameters.stringify(t, this.parameters.toSortedParameters(t, r));
        if (o.length > 0) e += !s ? `${n.parameters}${o}${n.parametersEnd}` : o;
        if (null != this.endpoint.name && !i) e += `${n.viewport}${this.endpoint.name}`;
        if (!this.ownsScope) e += n.noScope;
        return e || "";
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

exports.Navigator = class Navigator {
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
        if (this.isActive) throw new Error("Navigator has already been started");
        this.isActive = true;
        this.options = {
            ...t
        };
    }
    stop() {
        if (!this.isActive) throw new Error("Navigator has not been started");
        this.isActive = false;
    }
    navigate(t) {
        if (!(t instanceof Navigation)) t = Navigation.create(t);
        const i = new NavigationFlags;
        if (-1 === this.lastNavigationIndex) {
            this.loadState();
            if (-1 !== this.lastNavigationIndex) i.refresh = true; else {
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
        if (void 0 !== t.index && !(t.replacing ?? false) && !(t.refreshing ?? false)) {
            t.historyMovement = t.index - Math.max(this.lastNavigationIndex, 0);
            t.instruction = null != this.navigations[t.index] ? this.navigations[t.index].fullStateInstruction : t.fullStateInstruction;
            t.replacing = true;
            if (t.historyMovement > 0) i.forward = true; else if (t.historyMovement < 0) i.back = true;
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
            if ((t.fromBrowser ?? false) && null != this.options.store) await this.options.store.popNavigatorState();
        } else if (t.replacing ?? false) {
            if (0 === (t.historyMovement ?? 0)) this.navigations[t.previous.index] = t;
            await this.saveState(t.index, false);
        } else {
            const s = t.index;
            if (i) this.navigations = this.navigations.slice(0, s);
            this.navigations[s] = t;
            if ((this.options.statefulHistoryLength ?? 0) > 0) {
                const t = this.navigations.length - (this.options.statefulHistoryLength ?? 0);
                for (const i of this.navigations.slice(s)) if ("string" !== typeof i.instruction || "string" !== typeof i.fullStateInstruction) await this.serializeNavigation(i, this.navigations.slice(t, s));
            }
            await this.saveState(t.index, !(t.fromBrowser ?? false));
        }
    }
    async cancel(t) {
        if (null != this.options.store) if (t.navigation?.new) {
            if (t.fromBrowser ?? false) await this.options.store.popNavigatorState();
        } else if (0 !== (t.historyMovement ?? 0)) await this.options.store.go(-t.historyMovement, true);
    }
    async go(t) {
        let i = this.lastNavigationIndex + t;
        i = Math.min(i, this.navigations.length - 1);
        await this.options.store.go(t, true);
        const s = this.navigations[i];
        return this.navigate(s);
    }
    getState() {
        const t = null != this.options.store ? {
            ...this.options.store.state
        } : {};
        const i = t?.navigations ?? [];
        const s = t?.navigationIndex ?? -1;
        return {
            navigations: i,
            navigationIndex: s
        };
    }
    loadState() {
        const {navigations: t, navigationIndex: i} = this.getState();
        this.navigations = t.map((t => Navigation.create(t)));
        this.lastNavigationIndex = i;
    }
    async saveState(t, i) {
        for (let t = 0; t < this.navigations.length; t++) this.navigations[t] = Navigation.create(this.navigations[t].toStoredNavigation());
        if ((this.options.statefulHistoryLength ?? 0) > 0) {
            const t = this.navigations.length - (this.options.statefulHistoryLength ?? 0);
            for (let i = 0; i < t; i++) {
                const s = this.navigations[i];
                if ("string" !== typeof s.instruction || "string" !== typeof s.fullStateInstruction) await this.serializeNavigation(s, this.navigations.slice(t));
            }
        }
        if (null == this.options.store) return Promise.resolve();
        const s = {
            navigations: (this.navigations ?? []).map((t => this.toStoreableNavigation(t))),
            navigationIndex: t
        };
        if (i) return this.options?.store?.pushNavigatorState(s); else return this.options.store.replaceNavigatorState(s);
    }
    async refresh() {
        if (-1 === this.lastNavigationIndex) return Promise.reject();
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
        if ("string" !== typeof i.scope) i.scope = null;
        return i;
    }
    async serializeNavigation(t, i) {
        let s = [];
        for (const t of i) {
            if ("string" !== typeof t.instruction) s.push(...RoutingInstruction.flat(t.instruction).filter((t => null !== t.endpoint.instance)).map((t => t.component.instance)));
            if ("string" !== typeof t.fullStateInstruction) s.push(...RoutingInstruction.flat(t.fullStateInstruction).filter((t => null !== t.endpoint.instance)).map((t => t.component.instance)));
        }
        s = u(s);
        let n = [];
        if ("string" !== typeof t.fullStateInstruction) {
            n.push(...t.fullStateInstruction);
            t.fullStateInstruction = RoutingInstruction.stringify(this.container, t.fullStateInstruction, false, true);
        }
        if ("string" !== typeof t.instruction) {
            n.push(...t.instruction);
            t.instruction = RoutingInstruction.stringify(this.container, t.instruction);
        }
        n = n.filter(((t, i, s) => null != t.component.instance && s.indexOf(t) === i));
        const e = [];
        for (const t of n) await this.freeInstructionComponents(t, s, e);
    }
    freeInstructionComponents(t, i, s) {
        const n = t.component.instance;
        const e = t.viewport?.instance ?? null;
        if (null === n || null === e || s.some((t => t === n))) return;
        if (!i.some((t => t === n))) return Runner.run(null, (t => e.freeContent(t, n)), (() => {
            s.push(n);
        }));
        if (t.hasNextScopeInstructions) for (const n of t.nextScopeInstructions) return this.freeInstructionComponents(n, i, s);
    }
};

exports.Navigator = e([ r(0, t.IEventAggregator), r(1, t.IContainer) ], exports.Navigator);

const c = n.RouteRecognizer;

const f = n.ConfigurableRoute;

const p = n.RecognizedRoute;

const d = n.Endpoint;

class Collection extends Array {
    constructor() {
        super(...arguments);
        this.currentIndex = -1;
    }
    next() {
        if (this.length > this.currentIndex + 1) return this[++this.currentIndex]; else {
            this.currentIndex = -1;
            return null;
        }
    }
    removeCurrent() {
        this.splice(this.currentIndex--, 1);
    }
    remove(t) {
        h(this, (i => i === t));
    }
}

class EndpointMatcher {
    static matchEndpoints(t, i, s, n = false) {
        const e = [];
        const r = t.getOwnedRoutingScopes(1 / 0);
        const o = r.map((t => t.endpoint));
        const h = o.filter((t => null !== t && !s.some((i => t === i.endpoint.instance && !i.cancelled))));
        const u = new Collection(...i.slice());
        let l = null;
        EndpointMatcher.matchKnownEndpoints(t.router, "ViewportScope", u, h, e, false);
        if (!n) EndpointMatcher.matchKnownEndpoints(t.router, "Viewport", u, h, e, false);
        EndpointMatcher.matchViewportScopeSegment(t.router, t, u, h, e);
        while (null !== (l = u.next())) l.needsEndpointDescribed = true;
        EndpointMatcher.matchViewportConfiguration(u, h, e);
        if (!n) EndpointMatcher.matchSpecifiedViewport(u, h, e, false);
        EndpointMatcher.matchLastViewport(u, h, e);
        if (n) EndpointMatcher.matchSpecifiedViewport(u, h, e, false);
        return {
            matchedInstructions: e,
            remainingInstructions: [ ...u ]
        };
    }
    static matchKnownEndpoints(t, i, s, n, e, r = false) {
        let o;
        while (null !== (o = s.next())) if (null !== o.endpoint.instance && !o.isAdd(t) && o.endpoint.endpointType === i) {
            EndpointMatcher.matchEndpoint(o, o.endpoint.instance, r);
            e.push(o);
            h(n, (t => t === o.endpoint.instance));
            s.removeCurrent();
        }
    }
    static matchViewportScopeSegment(t, i, s, n, e) {
        let r;
        while (null !== (r = s.next())) for (let o of n) {
            if (!(o instanceof ViewportScope)) continue;
            if (o.acceptSegment(r.component.name)) {
                if (Array.isArray(o.source)) {
                    let s = n.find((t => t instanceof ViewportScope && t.name === o.name));
                    if (void 0 === s || r.isAdd(t)) {
                        const t = o.addSourceItem();
                        s = i.getOwnedScopes().filter((t => t.isViewportScope)).map((t => t.endpoint)).find((i => i.sourceItem === t));
                    }
                    o = s;
                }
                EndpointMatcher.matchEndpoint(r, o, false);
                e.push(r);
                h(n, (t => t === r.endpoint.instance));
                s.removeCurrent();
                break;
            }
        }
    }
    static matchViewportConfiguration(t, i, s) {
        let n;
        while (null !== (n = t.next())) for (const e of i) {
            if (!(e instanceof Viewport)) continue;
            if (e?.wantComponent(n.component.name)) {
                EndpointMatcher.matchEndpoint(n, e, true);
                s.push(n);
                h(i, (t => t === n.endpoint.instance));
                t.removeCurrent();
                break;
            }
        }
    }
    static matchSpecifiedViewport(t, i, s, n) {
        let e;
        while (null !== (e = t.next())) {
            let r = e.endpoint.instance;
            if (null == r) {
                const t = e.endpoint.name;
                if (0 === (t?.length ?? 0)) continue;
                for (const s of i) {
                    if (!(s instanceof Viewport)) continue;
                    if (t === s.name) {
                        r = s;
                        break;
                    }
                }
            }
            if (r?.acceptComponent(e.component.name)) {
                EndpointMatcher.matchEndpoint(e, r, n);
                s.push(e);
                h(i, (t => t === e.endpoint.instance));
                t.removeCurrent();
            }
        }
    }
    static matchLastViewport(t, i, s) {
        let n;
        while (null !== (n = t.next())) {
            const e = [];
            for (const t of i) {
                if (!(t instanceof Viewport)) continue;
                if (t.acceptComponent(n.component.name)) e.push(t);
            }
            if (1 === e.length) {
                const r = e[0];
                EndpointMatcher.matchEndpoint(n, r, true);
                s.push(n);
                h(i, (t => t === n.endpoint.instance));
                t.removeCurrent();
            }
        }
    }
    static matchEndpoint(t, i, s) {
        t.endpoint.set(i);
        if (s) t.needsEndpointDescribed = false;
        if (t.hasNextScopeInstructions) t.nextScopeInstructions.forEach((t => {
            if (null === t.scope) t.scope = i instanceof Viewport ? i.scope : i.scope.scope;
        }));
    }
}

class RoutingScope {
    constructor(t, i, s, n) {
        this.router = t;
        this.hasScope = i;
        this.owningScope = s;
        this.endpointContent = n;
        this.id = -1;
        this.parent = null;
        this.children = [];
        this.id = ++RoutingScope.lastId;
        this.owningScope = s ?? this;
    }
    static for(t, s) {
        if (null == t) return {
            scope: null,
            instruction: s
        };
        if (t instanceof RoutingScope || t instanceof Viewport || t instanceof ViewportScope) return {
            scope: t.scope,
            instruction: s
        };
        let n;
        if ("res" in t) n = t; else if ("container" in t) n = t.container; else if ("$controller" in t) n = t.$controller.container; else {
            const s = i.CustomElement.for(t, {
                searchParents: true
            });
            n = s?.container;
        }
        if (null == n) return {
            scope: null,
            instruction: s
        };
        const e = n.has(Router.closestEndpointKey, true) ? n.get(Router.closestEndpointKey) : null;
        let r = e?.scope ?? null;
        if (null === r || void 0 === s) {
            const t = s ?? "";
            return {
                scope: r,
                instruction: t.startsWith("/") ? t.slice(1) : s
            };
        }
        if (s.startsWith("/")) return {
            scope: null,
            instruction: s.slice(1)
        };
        while (s.startsWith(".")) if (s.startsWith("./")) s = s.slice(2); else if (s.startsWith("../")) {
            r = r.parent ?? r;
            s = s.slice(3);
        } else break;
        return {
            scope: r,
            instruction: s
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
        const s = this.routingInstruction ? Separators.for(this.router).scope : "";
        return `${t}${i}${s}`;
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
        while (t.some((t => t.passThroughScope))) for (const i of t.slice()) if (i.passThroughScope) {
            const s = t.indexOf(i);
            t.splice(s, 1, ...i.enabledChildren);
        }
        return t;
    }
    get ownedScopes() {
        return this.getOwnedScopes();
    }
    get routingInstruction() {
        if (this.endpoint.isViewportScope) return this.endpoint.instruction;
        if (this.isViewport) return this.endpoint.activeContent.instruction;
        return null;
    }
    getOwnedScopes(t = false) {
        const i = this.allScopes(t).filter((t => t.owningScope === this));
        for (const t of i.slice()) if (t.passThroughScope) {
            const s = i.indexOf(t);
            i.splice(s, 1, ...t.getOwnedScopes());
        }
        return i;
    }
    async processInstructions(t, i, s, n, e = "") {
        const r = this.router;
        const o = r.configuration.options;
        const u = t.filter((t => !(t.route instanceof Route)));
        if (u.length > 0) {
            const i = this.findInstructions(u, o.useDirectRouting, o.useConfiguredRoutes);
            if (u.some((t => !t.component.none || null != t.route)) && !i.foundConfiguration && !i.foundInstructions) this.unknownRoute(u);
            t = [ ...t.filter((t => t.route instanceof Route)), ...i.instructions ];
            if (t.some((t => t.scope !== this))) console.warn("Not the current scope for instruction(s)!", this, t);
            if (i.foundConfiguration) e = (e ?? "") + i.matching;
        }
        const l = RoutingInstruction.resolve(t);
        if (l instanceof Promise) await l;
        if (!o.additiveInstructionDefault) t = this.ensureClearStateInstruction(t);
        let a = [];
        ({clearEndpoints: a, instructions: t} = this.getClearAllEndpoints(t));
        for (const i of t.filter((t => t.isAddAll(r)))) {
            i.endpoint.set(i.scope.endpoint.name);
            i.scope = i.scope.owningScope;
        }
        let c = [];
        let {matchedInstructions: f, remainingInstructions: p} = this.matchEndpoints(t, i);
        let d = 100;
        do {
            if (!d--) r.unresolvedInstructionsError(s, p);
            const o = [];
            const u = f.map((t => t.endpoint.instance));
            f.push(...a.filter((t => !u.includes(t))).map((t => RoutingInstruction.createClear(r, t))));
            const l = await RoutingHook.invokeBeforeNavigation(f, s);
            if (false === l) {
                r.cancelNavigation(s, n);
                return [];
            } else if (true !== l && l !== f) {
                const t = RoutingInstruction.flat(f);
                p = p.filter((i => !t.includes(i)));
                f = l;
            }
            for (const t of f) {
                const u = t.endpoint.instance;
                if (null !== u) {
                    const l = u.setNextContent(t, s);
                    if ("skip" !== l) {
                        o.push(u);
                        n.addEndpoint(u);
                    }
                    const p = [ u ];
                    if ("swap" === l) p.push(...u.getContent().connectedScope.allScopes(true).map((t => t.endpoint)));
                    h(a, (t => p.includes(t)));
                    h(f, (i => i !== t && i.isClear(r) && p.includes(i.endpoint.instance)));
                    if (!t.isClear(r) && t.scope?.parent?.isViewportScope) {
                        h(a, (i => i === t.scope.parent.endpoint));
                        h(f, (i => i !== t && i.isClear(r) && i.endpoint.instance === t.scope.parent.endpoint));
                    }
                    if ("skip" !== l && t.hasNextScopeInstructions) for (const i of t.nextScopeInstructions) {
                        i.scope = u.scope;
                        i.endpoint.instance = null;
                    }
                    if ("skip" === l && !t.hasNextScopeInstructions) c.push(...await u.scope.processInstructions([], i, s, n, e));
                }
            }
            const g = f.filter((t => "skip" === t.endpoint.instance?.transitionAction));
            const v = g.filter((t => t.hasNextScopeInstructions));
            if (0 === g.length || 0 === v.length) {
                if (!r.isRestrictedNavigation) n.finalEndpoint();
                n.run();
                if (n.hasAllEndpoints) {
                    const t = n.waitForSyncState("guardedUnload");
                    if (t instanceof Promise) await t;
                }
            }
            if (n.cancelled) {
                r.cancelNavigation(s, n);
                return [];
            }
            for (const t of o) if (c.every((i => i !== t))) c.push(t);
            i.push(...f.splice(0));
            if (p.length > 0) ({matchedInstructions: f, remainingInstructions: p} = this.matchEndpoints(p, i));
            if (!r.isRestrictedNavigation && (f.length > 0 || p.length > 0) && n.running) {
                const t = n.waitForSyncState("swapped");
                if (t instanceof Promise) await t;
            }
            if (0 === f.length && 0 === p.length) {
                const r = [];
                for (const o of t) {
                    if (!o.hasNextScopeInstructions) continue;
                    const t = o.endpoint.instance?.scope ?? o.endpoint.scope;
                    r.push(t.processInstructions(o.nextScopeInstructions, i, s, n, e));
                }
                c.push(...(await Promise.all(r)).flat());
            }
            ({matchedInstructions: f, remainingInstructions: p} = n.dequeueAppendedInstructions(f, i, p));
            if (0 === f.length && 0 === p.length) {
                const t = i.map((t => t.endpoint.instance?.connectedCE.pendingPromise?.promise)).filter((t => null != t));
                if (t.length > 0) {
                    await Promise.any(t);
                    ({matchedInstructions: f, remainingInstructions: p} = n.dequeueAppendedInstructions(f, i, p));
                } else f = a.map((t => RoutingInstruction.createClear(r, t)));
            }
            const w = RoutingInstruction.resolve(f);
            if (w instanceof Promise) await w;
            c = c.filter((t => !([ ...i ].reverse().find((i => i.endpoint.instance === t))?.cancelled ?? false)));
        } while (f.length > 0 || p.length > 0);
        return c;
    }
    unknownRoute(t) {
        const i = this.router.configuration.options;
        const s = RoutingInstruction.stringify(this.router, t);
        if (null != t[0].route) if (!i.useConfiguredRoutes) throw new Error("Can not match '" + s + "' since the router is configured to not use configured routes."); else throw new Error("No matching configured route found for '" + s + "'."); else if (i.useConfiguredRoutes && i.useDirectRouting) throw new Error("No matching configured route or component found for '" + s + "'."); else if (i.useConfiguredRoutes) throw new Error("No matching configured route found for '" + s + "'."); else throw new Error("No matching route/component found for '" + s + "'.");
    }
    ensureClearStateInstruction(t) {
        const i = this.router;
        if (!t.some((t => t.isClearAll(i)))) {
            const s = RoutingInstruction.create(RoutingInstruction.clear(i));
            s.scope = this;
            return [ s, ...t ];
        }
        return t;
    }
    getClearAllEndpoints(t) {
        const i = this.router;
        let s = [];
        if (t.some((t => (t.scope ?? this) === this && t.isClearAll(i)))) {
            s = this.enabledChildren.filter((t => !t.endpoint.isEmpty)).map((t => t.endpoint));
            t = t.filter((t => !((t.scope ?? this) === this && t.isClearAll(i))));
        }
        return {
            clearEndpoints: s,
            instructions: t
        };
    }
    findInstructions(t, i, s) {
        const n = this.router;
        let e = new FoundRoute;
        if (s && !RoutingInstruction.containsSiblings(n, t)) {
            let s = t.filter((t => t.isClear(n) || t.isClearAll(n)));
            const r = t.filter((t => !t.isClear(n) && !t.isClearAll(n)));
            if (r.length > 0) for (const o of r) {
                const r = "string" === typeof o.route ? o.route : o.unparsed ?? RoutingInstruction.stringify(n, [ o ]);
                const h = this.findMatchingRoute(r, o.parameters.parametersRecord ?? {});
                if (h.foundConfiguration) {
                    e = h;
                    e.instructions = [ ...s, ...e.instructions ];
                    s = [];
                } else if (i) {
                    e.instructions = [ ...s, ...e.instructions, o ];
                    s = [];
                    e.remaining = RoutingInstruction.stringify(n, o.nextScopeInstructions ?? []);
                } else throw new Error(`No route found for: ${RoutingInstruction.stringify(n, t)}!`);
            } else e.instructions = [ ...s ];
        } else if (i) e.instructions.push(...t); else throw new Error(`No way to process sibling viewport routes with direct routing disabled: ${RoutingInstruction.stringify(n, t)}!`);
        e.instructions = e.instructions.filter((t => "" !== t.component.name));
        for (const t of e.instructions) if (null === t.scope) t.scope = this;
        return e;
    }
    matchEndpoints(t, i, s = false) {
        const n = [];
        const e = t.filter((t => (t.scope ?? this) === this));
        const r = t.filter((t => (t.scope ?? this) !== this));
        const {matchedInstructions: o, remainingInstructions: h} = EndpointMatcher.matchEndpoints(this, e, i, s);
        n.push(...o);
        r.push(...h);
        return {
            matchedInstructions: n,
            remainingInstructions: r
        };
    }
    addEndpoint(t, i, s, n = {}) {
        let e = this.getOwnedScopes().find((s => s.type === t && s.endpoint.name === i))?.endpoint ?? null;
        if (null != s && null != e?.connectedCE && e.connectedCE !== s) e = this.getOwnedScopes(true).find((n => n.type === t && n.endpoint.name === i && n.endpoint.connectedCE === s))?.endpoint ?? null;
        if (null == e) {
            e = "Viewport" === t ? new Viewport(this.router, i, s, this.scope, !!n.scope, n) : new ViewportScope(this.router, i, s, this.scope, true, null, n);
            this.addChild(e.connectedScope);
        }
        if (null != s) e.setConnectedCE(s, n);
        return e;
    }
    removeEndpoint(t, i, s) {
        if (null !== (s ?? null) || i.removeEndpoint(t, s)) {
            this.removeChild(i.connectedScope);
            return true;
        }
        return false;
    }
    addChild(t) {
        if (!this.children.some((i => i === t))) {
            if (null !== t.parent) t.parent.removeChild(t);
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
        for (const s of i.slice()) i.push(...s.allScopes(t));
        return i;
    }
    reparentRoutingInstructions() {
        const t = this.hoistedChildren.filter((t => null !== t.routingInstruction && t.routingInstruction.component.name));
        if (!t.length) return null;
        for (const i of t) {
            const t = i.reparentRoutingInstructions();
            i.routingInstruction.nextScopeInstructions = null !== t && t.length > 0 ? t : null;
        }
        return t.map((t => t.routingInstruction));
    }
    getChildren(t) {
        const i = this.children.map((i => i.endpoint.getTimeContent(t))).filter((t => null !== t));
        return i.map((t => t.connectedScope));
    }
    getAllRoutingScopes(t) {
        const i = this.getChildren(t);
        for (const s of i.slice()) i.push(...s.getAllRoutingScopes(t));
        return i;
    }
    getOwnedRoutingScopes(t) {
        const i = this.getAllRoutingScopes(t).filter((t => t.owningScope === this));
        for (const s of i.slice()) if (s.passThroughScope) {
            const n = i.indexOf(s);
            i.splice(n, 1, ...s.getOwnedRoutingScopes(t));
        }
        return u(i);
    }
    getRoutingInstructions(t) {
        const i = u(this.getOwnedRoutingScopes(t).map((t => t.endpoint))).map((i => i.getTimeContent(t))).filter((t => null !== t));
        const s = [];
        for (const n of i) {
            const i = n.instruction.clone(true, false, false);
            if ("" !== (i.component.name ?? "")) {
                i.nextScopeInstructions = n.connectedScope.getRoutingInstructions(t);
                s.push(i);
            }
        }
        return s;
    }
    canUnload(t, i) {
        return Runner.run(i, (i => Runner.runParallel(i, ...this.children.map((i => null !== i.endpoint ? s => i.endpoint.canUnload(t, s) : s => i.canUnload(t, s))))), (t => t.previousValue.every((t => t))));
    }
    unload(t, i) {
        return Runner.runParallel(i, ...this.children.map((i => null !== i.endpoint ? s => i.endpoint.unload(t, s) : s => i.unload(t, s))));
    }
    matchScope(t, i = false) {
        const s = [];
        for (const n of t) if (n.scope === this) s.push(n); else if (i && n.hasNextScopeInstructions) s.push(...this.matchScope(n.nextScopeInstructions, i));
        return s;
    }
    findMatchingRoute(t, i) {
        let s = new FoundRoute;
        if (this.isViewportScope && !this.passThroughScope) s = this.findMatchingRouteInRoutes(t, this.endpoint.getRoutes(), i); else if (this.isViewport) s = this.findMatchingRouteInRoutes(t, this.endpoint.getRoutes(), i); else for (const n of this.enabledChildren) {
            s = n.findMatchingRoute(t, i);
            if (s.foundConfiguration) break;
        }
        if (s.foundConfiguration) return s;
        if (null != this.parent) return this.parent.findMatchingRoute(t, i);
        return s;
    }
    findMatchingRouteInRoutes(t, i, s) {
        const n = new FoundRoute;
        if (0 === i.length) return n;
        i = i.map((t => this.ensureProperRoute(t)));
        const e = [];
        for (const t of i) {
            const i = Array.isArray(t.path) ? t.path : [ t.path ];
            for (const s of i) {
                e.push({
                    ...t,
                    path: s,
                    handler: t
                });
                if ("" !== s) e.push({
                    ...t,
                    path: `${s}/*remainingPath`,
                    handler: t
                });
            }
        }
        if (t.startsWith("/") || t.startsWith("+")) t = t.slice(1);
        const r = i.find((i => i.id === t));
        let o = {
            params: {},
            endpoint: {}
        };
        if (null != r) {
            o.endpoint = {
                route: {
                    handler: r
                }
            };
            t = Array.isArray(r.path) ? r.path[0] : r.path;
            const i = t.split("/").map((t => {
                if (t.startsWith(":")) {
                    const i = t.slice(1).replace(/\?$/, "");
                    const n = s[i];
                    o.params[i] = n;
                    return n;
                } else return t;
            }));
            t = i.join("/");
        } else {
            const i = new c;
            i.add(e);
            o = i.recognize(t);
        }
        if (null != o) {
            n.match = o.endpoint.route.handler;
            n.matching = t;
            const e = {
                ...o.params
            };
            if (null != e.remainingPath) {
                n.remaining = e.remainingPath;
                Reflect.deleteProperty(e, "remainingPath");
                n.matching = n.matching.slice(0, n.matching.indexOf(n.remaining));
            }
            n.params = e;
            if (null != n.match?.redirectTo) {
                let t = n.match?.redirectTo;
                if ((n.remaining ?? "").length > 0) t += `/${n.remaining}`;
                return this.findMatchingRouteInRoutes(t, i, s);
            }
        }
        if (n.foundConfiguration) {
            n.instructions = RoutingInstruction.clone(n.match.instructions, false, true);
            const t = n.instructions.slice();
            while (t.length > 0) {
                const i = t.shift();
                i.parameters.addParameters(n.params);
                i.route = n;
                if (i.hasNextScopeInstructions) t.unshift(...i.nextScopeInstructions);
            }
            if (n.instructions.length > 0) n.instructions[0].routeStart = true;
            const i = RoutingInstruction.parse(this.router, n.remaining);
            if (i.length > 0) {
                let t = n.instructions[0];
                while (t.hasNextScopeInstructions) t = t.nextScopeInstructions[0];
                t.nextScopeInstructions = i;
            }
        }
        return n;
    }
    ensureProperRoute(t) {
        if (void 0 === t.id) t.id = Array.isArray(t.path) ? t.path.join(",") : t.path;
        if (void 0 === t.instructions) t.instructions = [ {
            component: t.component,
            viewport: t.viewport,
            parameters: t.parameters,
            children: t.children
        } ];
        if (null === t.redirectTo) t.instructions = RoutingInstruction.from(this.router, t.instructions);
        return t;
    }
}

RoutingScope.lastId = 0;

class QueueTask {
    constructor(t, i, s = 0) {
        this.taskQueue = t;
        this.item = i;
        this.cost = s;
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
        if ("execute" in this.item) await this.item.execute(this); else await this.item(this);
    }
    wait() {
        return this.promise;
    }
}

class TaskQueue {
    constructor(t) {
        this.callback = t;
        this.pending = [];
        this.processing = null;
        this.allowedExecutionCostWithinTick = null;
        this.currentExecutionCostInCurrentTick = 0;
        this.platform = null;
        this.task = null;
        this.dequeue = t => {
            if (null !== this.processing) return;
            if (void 0 !== t) this.currentExecutionCostInCurrentTick = 0;
            if (0 === this.pending.length) return;
            if (null !== this.allowedExecutionCostWithinTick && void 0 === t && this.currentExecutionCostInCurrentTick + (this.pending[0].cost || 0) > this.allowedExecutionCostWithinTick) return;
            this.processing = this.pending.shift() || null;
            if (this.processing) {
                this.currentExecutionCostInCurrentTick += this.processing.cost ?? 0;
                if (void 0 !== this.callback) this.callback(this.processing); else this.processing.execute().catch((t => {
                    throw t;
                }));
            }
        };
    }
    get isActive() {
        return null !== this.task;
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
        const s = Array.isArray(t);
        const n = s ? t : [ t ];
        const e = n.map(((t, s) => !Array.isArray(i) ? i : i[s])).map((t => void 0 !== t ? t : 1));
        const r = [];
        for (const t of n) r.push(t instanceof QueueTask ? t : this.createQueueTask(t, e.shift()));
        this.pending.push(...r);
        this.dequeue();
        return s ? r : r[0];
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
    reject(t, i, s) {
        i(s);
        this.processing = null;
        this.dequeue();
    }
}

let g = class BrowserViewerStore {
    constructor(t, i, s, n, e) {
        this.platform = t;
        this.window = i;
        this.history = s;
        this.location = n;
        this.ea = e;
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
        if (this.isActive) throw new Error("Browser navigation has already been started");
        this.isActive = true;
        if (void 0 != t.useUrlFragmentHash) this.options.useUrlFragmentHash = t.useUrlFragmentHash;
        this.pendingCalls.start({
            platform: this.platform,
            allowedExecutionCostWithinTick: this.allowedExecutionCostWithinTick
        });
        this.window.addEventListener("popstate", this);
    }
    stop() {
        if (!this.isActive) throw new Error("Browser navigation has not been started");
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
        const {pathname: t, search: i, hash: s} = this.location;
        const n = this.options.useUrlFragmentHash ?? false ? s.slice(1) : `${t}${i}`;
        const e = this.options.useUrlFragmentHash ?? false ? s.slice(1).includes("#") ? s.slice(s.slice(1).indexOf("#", 1)) : "" : s.slice(1);
        return new NavigatorViewerState(t, i.slice(1), e, n);
    }
    async go(t, i = false) {
        const s = this.pendingCalls.createQueueTask((t => t.resolve()), 1);
        this.pendingCalls.enqueue([ t => {
            const n = s;
            const e = i;
            this.forwardState({
                eventTask: n,
                suppressPopstate: e
            });
            t.resolve();
        }, i => {
            const s = this.history;
            const n = t;
            s.go(n);
            i.resolve();
        } ], [ 0, 1 ]);
        return s.wait();
    }
    async pushNavigatorState(t) {
        const {title: i, path: s} = t.navigations[t.navigationIndex];
        const n = this.options.useUrlFragmentHash ? "#/" : "";
        return this.pendingCalls.enqueue((e => {
            const r = this.history;
            const o = t;
            const h = i || "";
            const u = `${n}${s}`;
            try {
                r.pushState(o, h, u);
                this.setTitle(h);
            } catch (t) {
                const i = this.tryCleanState(o, "push", t);
                r.pushState(i, h, u);
                this.setTitle(h);
            }
            e.resolve();
        }), 1).wait();
    }
    async replaceNavigatorState(t, i, s) {
        const n = t.navigations[t.navigationIndex];
        i ?? (i = n.title);
        s ?? (s = n.path);
        const e = this.options.useUrlFragmentHash ? "#/" : "";
        return this.pendingCalls.enqueue((n => {
            const r = this.history;
            const o = t;
            const h = i || "";
            const u = `${e}${s}`;
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
            const s = t;
            await this.popState(s);
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
        const {eventTask: i, suppressPopstate: s} = this.forwardedState;
        this.forwardedState = {
            eventTask: null,
            suppressPopstate: false
        };
        this.pendingCalls.enqueue((async n => {
            if (!s) this.notifySubscribers(t);
            if (null !== i) await i.execute();
            n.resolve();
        }), 1);
    }
    notifySubscribers(t) {
        this.ea.publish(NavigatorStateChangeEvent.eventName, NavigatorStateChangeEvent.create(this.viewerState, t, this.history.state));
    }
    async popState(t) {
        await this.go(-1, true);
        const i = this.history.state;
        const s = i?.navigations?.[i?.navigationIndex ?? 0];
        if (null != s && !s.firstEntry) {
            await this.go(-1, true);
            await this.pushNavigatorState(i);
        }
        await t.execute();
    }
    forwardState(t) {
        this.forwardedState = t;
    }
    tryCleanState(t, i, s) {
        try {
            return JSON.parse(JSON.stringify(t));
        } catch (t) {
            throw new Error(`Failed to ${i} state, probably due to unserializable data and/or parameters: ${t}${s}`);
        }
    }
};

g = e([ r(0, i.IPlatform), r(1, i.IWindow), r(2, i.IHistory), r(3, i.ILocation), r(4, t.IEventAggregator) ], g);

class NavigatorViewerState {
    constructor(t, i, s, n) {
        this.path = t;
        this.query = i;
        this.hash = s;
        this.instruction = n;
    }
}

class NavigatorStateChangeEvent {
    constructor(t, i, s, n) {
        this.eventName = t;
        this.viewerState = i;
        this.event = s;
        this.state = n;
    }
    static create(t, i, s) {
        return new NavigatorStateChangeEvent(NavigatorStateChangeEvent.eventName, t, i, s);
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
        return this.states.has(t) && null === this.states.get(t);
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
    static create(t, i, s) {
        const n = new NavigationCoordinator(t, i);
        s.syncStates.forEach((t => n.addSyncState(t)));
        return n;
    }
    run() {
        if (!this.running) {
            this.running = true;
            for (const t of this.entities) if (!t.running) {
                t.running = true;
                t.endpoint.transition(this);
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
        if (this.running) i.endpoint.transition(this);
        return i;
    }
    removeEndpoint(t) {
        const i = this.entities.find((i => i.endpoint === t));
        if (void 0 !== i) h(this.entities, (t => t === i));
    }
    setEndpointStep(t, i) {
        let s = this.entities.find((i => i.endpoint === t));
        if (void 0 === s) s = this.addEndpoint(t);
        s.step = i;
    }
    getEndpointStep(t) {
        const i = this.entities.find((i => i.endpoint === t));
        return i?.step ?? null;
    }
    addEndpointState(t, i) {
        let s = this.entities.find((i => i.endpoint === t));
        if (void 0 === s) s = this.addEndpoint(t);
        const n = s.states.get(i);
        if (n instanceof OpenPromise) n.resolve();
        s.states.set(i, null);
        this.checkSyncState(i);
    }
    waitForSyncState(t, i = null) {
        if (0 === this.entities.length) return;
        const s = this.syncStates.get(t);
        if (void 0 === s) return;
        if (null !== i) {
            const n = this.entities.find((t => t.endpoint === i));
            if (null === n?.syncPromise && s.isPending) {
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
        return s.isPending ? s.promise : void 0;
    }
    waitForEndpointState(t, i) {
        if (!this.syncStates.has(i)) return;
        let s = this.entities.find((i => i.endpoint === t));
        if (null == s) s = this.addEndpoint(t);
        if (s.hasReachedState(i)) return;
        let n = s.states.get(i);
        if (null == n) {
            n = new OpenPromise;
            s.states.set(i, n);
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
            if (i instanceof Promise) i.catch((t => {
                throw t;
            }));
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
    dequeueAppendedInstructions(t, i, s) {
        let n = [ ...this.appendedInstructions ];
        t = [ ...t ];
        s = [ ...s ];
        const e = n.filter((t => !t.default));
        const r = n.filter((t => t.default));
        n = e.length > 0 ? [ ...e ] : [ ...r ];
        while (n.length > 0) {
            const e = n.shift();
            h(this.appendedInstructions, (t => t === e));
            const r = i.some((t => !t.cancelled && t.sameEndpoint(e, true)));
            const o = t.find((t => t.sameEndpoint(e, true)));
            const u = s.find((t => t.sameEndpoint(e, true)));
            if (e.default && (r || void 0 !== o && !o.default || void 0 !== u && !u.default)) continue;
            if (void 0 !== o) h(t, (t => t === o));
            if (void 0 !== u) h(s, (t => t === u));
            if (null !== e.endpoint.instance) t.push(e); else s.push(e);
        }
        return {
            matchedInstructions: t,
            remainingInstructions: s
        };
    }
    checkSyncState(t) {
        const i = this.syncStates.get(t);
        if (void 0 === i) return;
        if (this.hasAllEndpoints && i.isPending && this.entities.every((i => i.hasReachedState(t))) && (!this.checkedSyncStates.has(t) || this.entities.every((i => i.checkedStates.includes(t))))) {
            for (const i of this.entities) if (i.syncingState === t) {
                i.syncPromise?.resolve();
                i.syncPromise = null;
                i.syncingState = null;
            }
            i.resolve();
        }
    }
    recheckSyncStates() {
        this.syncStates.forEach(((t, i) => {
            if (!t.isPending && !this.entities.every((t => t.hasReachedState(i)))) this.addSyncState(i);
        }));
    }
}

class RoutingHook {
    constructor(t, i, s) {
        this.hook = t;
        this.id = s;
        this.type = "beforeNavigation";
        this.includeTargets = [];
        this.excludeTargets = [];
        if (void 0 !== i.type) this.type = i.type;
        for (const t of i.include ?? []) this.includeTargets.push(new Target(t));
        for (const t of i.exclude ?? []) this.excludeTargets.push(new Target(t));
    }
    static add(t, i) {
        const s = new RoutingHook(t, i ?? {}, ++this.lastIdentity);
        this.hooks[s.type].push(s);
        return this.lastIdentity;
    }
    static remove(t) {
        for (const i in this.hooks) if (Object.prototype.hasOwnProperty.call(this.hooks, i)) {
            const s = this.hooks[i].findIndex((i => i.id === t));
            if (s >= 0) this.hooks[i].splice(s, 1);
        }
    }
    static removeAll() {
        for (const t in this.hooks) this.hooks[t] = [];
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
    static async invoke(t, i, s) {
        let n = s;
        for (const e of this.hooks[t]) if (!e.wantsMatch || e.matches(s)) {
            n = await e.invoke(i, s);
            if ("boolean" === typeof n) {
                if (!n) return false;
            } else s = n;
        }
        return n;
    }
    get wantsMatch() {
        return this.includeTargets.length > 0 || this.excludeTargets.length > 0;
    }
    matches(t) {
        if (this.includeTargets.length && !this.includeTargets.some((i => i.matches(t)))) return false;
        if (this.excludeTargets.length && this.excludeTargets.some((i => i.matches(t)))) return false;
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
        if ("string" === typeof t) this.componentName = t; else if (InstructionComponent.isType(t)) {
            this.componentType = t;
            this.componentName = InstructionComponent.getName(t);
        } else {
            const i = t;
            if (null != i.component) {
                this.componentType = InstructionComponent.isType(i.component) ? InstructionComponent.getType(i.component) : null;
                this.componentName = InstructionComponent.getName(i.component);
            }
            if (null != i.viewport) {
                this.viewport = InstructionEndpoint.isInstance(i.viewport) ? i.viewport : null;
                this.viewportName = InstructionEndpoint.getName(i.viewport);
            }
        }
    }
    matches(t) {
        const i = t.slice();
        if (!i.length) i.push(RoutingInstruction.create(""));
        for (const t of i) if (null !== this.componentName && this.componentName === t.component.name || null !== this.componentType && this.componentType === t.component.type || null !== this.viewportName && this.viewportName === t.endpoint.name || null !== this.viewport && this.viewport === t.endpoint.instance) return true;
        return false;
    }
}

class Title {
    static async getTitle(t, i, s) {
        let n = await RoutingHook.invokeTransformTitle(t, i);
        if ("string" !== typeof n) {
            const t = Title.stringifyTitles(n, i, s);
            n = s.appTitle;
            n = n.replace(/\${componentTitles}/g, t);
            n = n.replace(/\${appTitleSeparator}/g, "" !== t ? s.appTitleSeparator : "");
        }
        n = await RoutingHook.invokeTransformTitle(n, i);
        return n;
    }
    static stringifyTitles(t, i, s) {
        const n = t.map((t => Title.stringifyTitle(t, i, s))).filter((t => (t?.length ?? 0) > 0));
        return n.join(" + ");
    }
    static stringifyTitle(t, i, s) {
        const n = t.nextScopeInstructions;
        let e = Title.resolveTitle(t, i, s);
        if (Array.isArray(n) && n.length > 0) {
            let t = Title.stringifyTitles(n, i, s);
            if (t.length > 0) {
                if (1 !== n.length) t = `[ ${t} ]`;
                if (e.length > 0) e = "top-down" === s.componentTitleOrder ? e + s.componentTitleSeparator + t : t + s.componentTitleSeparator + e; else e = t;
            }
        }
        return e;
    }
    static resolveTitle(t, i, s) {
        let n = t.getTitle(i);
        if (null != s.transformTitle) n = s.transformTitle(n, t, i);
        return n;
    }
}

const v = t.DI.createInterface("IRouter", (t => t.singleton(Router)));

class Router {
    constructor(t, i, s, n, e, r) {
        this.container = t;
        this.ea = i;
        this.navigator = s;
        this.viewer = n;
        this.store = e;
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
            if (null != t.state?.navigationIndex) {
                const i = Navigation.create(t.state.navigations[t.state.navigationIndex]);
                i.instruction = t.viewerState.instruction;
                i.fromBrowser = true;
                this.navigator.navigate(i).catch((t => {
                    throw t;
                }));
            } else this.load(t.viewerState.instruction, {
                fromBrowser: true
            }).catch((t => {
                throw t;
            }));
        };
        this.processNavigation = async t => {
            this.loadedFirst = true;
            const i = this.configuration.options;
            const s = NavigationCoordinator.create(this, t, {
                syncStates: this.configuration.options.navigationSyncStates
            });
            this.coordinators.push(s);
            s.appendedInstructions.push(...this.appendedInstructions.splice(0));
            this.ea.publish(RouterNavigationStartEvent.eventName, RouterNavigationStartEvent.create(t));
            let n = "string" === typeof t.instruction && !t.useFullStateInstruction ? await RoutingHook.invokeTransformFromUrl(t.instruction, s.navigation) : t.useFullStateInstruction ? t.fullStateInstruction : t.instruction;
            const e = i.basePath;
            if (null !== e && "string" === typeof n && n.startsWith(e) && !i.useUrlFragmentHash) n = n.slice(e.length);
            if ("/" === n) n = "";
            if ("string" === typeof n) n = "" === n ? [ new RoutingInstruction("") ] : RoutingInstruction.parse(this, n);
            t.scope ?? (t.scope = this.rootScope.scope);
            const r = await t.scope.processInstructions(n, [], t, s);
            return Runner.run(null, (() => {
                s.finalEndpoint();
                return s.waitForSyncState("completed");
            }), (() => {
                s.finalize();
                return this.updateNavigation(t);
            }), (() => {
                if (t.navigation.new && !t.navigation.first && !t.repeating && r.every((t => t.options.noHistory))) t.untracked = true;
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
    static get inject() {
        return [ t.IContainer, t.IEventAggregator, exports.Navigator, g, g, N ];
    }
    get isNavigating() {
        return this.coordinators.length > 0;
    }
    get isRestrictedNavigation() {
        const t = this.configuration.options.navigationSyncStates;
        return t.includes("guardedLoad") || t.includes("unloaded") || t.includes("loaded") || t.includes("guarded") || t.includes("routed");
    }
    get statefulHistory() {
        return void 0 !== this.configuration.options.statefulHistoryLength && this.configuration.options.statefulHistoryLength > 0;
    }
    start() {
        if (this.isActive) throw new Error("Router has already been started");
        this.isActive = true;
        const t = this.container.get(i.IAppRoot);
        this.rootScope = new ViewportScope(this, "rootScope", t.controller.viewModel, null, true, t.config.component);
        const s = this.configuration.options;
        if (null === s.basePath) {
            const i = new URL(t.host.baseURI);
            s.basePath = i.pathname;
        }
        if (s.basePath.endsWith("/")) s.basePath = s.basePath.slice(0, -1);
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
        if (!this.isActive) throw new Error("Router has not been started");
        this.ea.publish(RouterStopEvent.eventName, RouterStopEvent.create());
        this.navigator.stop();
        this.viewer.stop();
        this.navigatorStateChangeEventSubscription.dispose();
        this.navigatorNavigateEventSubscription.dispose();
    }
    async initialLoad() {
        const {instruction: t, hash: i} = this.viewer.viewerState;
        const s = this.load(t, {
            fragment: i,
            replacing: true,
            fromBrowser: false
        });
        this.loadedFirst = true;
        return s;
    }
    getEndpoint(t, i) {
        return this.allEndpoints(t).find((t => t.name === i)) ?? null;
    }
    allEndpoints(t, i = false) {
        return this.rootScope.scope.allScopes(i).filter((i => null === t || i.type === t)).map((t => t.endpoint));
    }
    addEndpoint(t, ...i) {
        throw new Error("Not implemented");
    }
    connectEndpoint(i, s, n, e, r) {
        const o = n.container;
        const h = o.has(Router.closestEndpointKey, true) ? o.get(Router.closestEndpointKey) : this.rootScope;
        const u = h.connectedScope;
        if (null === i) {
            i = u.addEndpoint(s, e, n, r);
            t.Registration.instance(Router.closestEndpointKey, i).register(o);
        }
        return i;
    }
    disconnectEndpoint(t, i, s) {
        if (!i.connectedScope.parent.removeEndpoint(t, i, s)) throw new Error("Router failed to remove endpoint: " + i.name);
    }
    async load(t, i) {
        i = i ?? {};
        t = this.extractFragment(t, i);
        t = this.extractQuery(t, i);
        let s = null;
        ({instructions: t, scope: s} = this.applyLoadOptions(t, i));
        if ((i.append ?? false) && (!this.loadedFirst || this.isNavigating)) {
            t = RoutingInstruction.from(this, t);
            this.appendInstructions(t, s);
            return Promise.resolve();
        }
        const n = Navigation.create({
            instruction: t,
            fullStateInstruction: "",
            scope: s,
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
    applyLoadOptions(t, i, s = true) {
        i = i ?? {};
        if ("origin" in i && !("context" in i)) i.context = i.origin;
        const {scope: n, instruction: e} = RoutingScope.for(i.context ?? null, "string" === typeof t ? t : void 0);
        if ("string" === typeof t) if (!s) {
            t = RoutingInstruction.from(this, e);
            for (const i of t) if (null === i.scope) i.scope = n;
        } else t = e; else {
            t = RoutingInstruction.from(this, t);
            for (const i of t) if (null === i.scope) i.scope = n;
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
        if ("string" === typeof t) throw new Error(`Parameter instructions to checkActivate can not be a string ('${t}')!`);
        i = i ?? {};
        ({instructions: t} = this.applyLoadOptions(t, i));
        t.forEach((t => t.scope ?? (t.scope = this.rootScope.scope)));
        const s = u(t.map((t => t.scope)));
        for (const i of s) {
            const s = i.matchScope(t, false);
            const n = i.matchScope(this.activeComponents, true);
            if (!RoutingInstruction.contains(this, n, s, true)) return false;
        }
        return true;
    }
    unresolvedInstructionsError(t, i) {
        this.ea.publish(RouterNavigationErrorEvent.eventName, RouterNavigationErrorEvent.create(t));
        this.ea.publish(RouterNavigationEndEvent.eventName, RouterNavigationEndEvent.create(t));
        throw w(i);
    }
    cancelNavigation(t, i) {
        i.cancel();
        this.ea.publish(RouterNavigationCancelEvent.eventName, RouterNavigationCancelEvent.create(t));
        this.ea.publish(RouterNavigationEndEvent.eventName, RouterNavigationEndEvent.create(t));
    }
    appendInstructions(t, i = null) {
        if (null === i) i = this.rootScope.scope;
        for (const s of t) if (null === s.scope) s.scope = i;
        let s = null;
        for (let t = this.coordinators.length - 1; t >= 0; t--) if (!this.coordinators[t].completed) {
            s = this.coordinators[t];
            break;
        }
        if (null === s) if (!this.loadedFirst) this.appendedInstructions.push(...t); else throw Error("Router failed to append routing instructions to coordinator");
        s?.enqueueAppendedInstructions(t);
    }
    async updateNavigation(t) {
        this.rootScope.scope.reparentRoutingInstructions();
        const i = this.rootScope.scope.getRoutingInstructions(t.timestamp);
        let {matchedInstructions: s} = this.rootScope.scope.matchEndpoints(i, [], true);
        let n = 100;
        while (s.length > 0) {
            if (0 === n--) throw new Error("Router failed to find viewport when updating viewer paths.");
            s = s.map((t => {
                const {matchedInstructions: i} = t.endpoint.instance.scope.matchEndpoints(t.nextScopeInstructions ?? [], [], true);
                return i;
            })).flat();
        }
        if (t.timestamp >= (this.activeNavigation?.timestamp ?? 0)) {
            this.activeNavigation = t;
            this.activeComponents = i;
        }
        let e = await RoutingHook.invokeTransformToUrl(i, t);
        if ("string" !== typeof e) e = RoutingInstruction.stringify(this, e, false, true);
        e = await RoutingHook.invokeTransformToUrl(e, t);
        if (null == t.query && null != t.parameters) {
            const i = new URLSearchParams;
            for (let [s, n] of Object.entries(t.parameters)) {
                s = encodeURIComponent(s);
                if (!Array.isArray(n)) n = [ n ];
                for (const t of n) i.append(s, encodeURIComponent(t));
            }
            t.query = i.toString();
        }
        let r = `${this.configuration.options.basePath}/`;
        if (null === r || "" !== e && "/" === e[0] || this.configuration.options.useUrlFragmentHash) r = "";
        const o = (t.query?.length ?? 0) > 0 ? "?" + t.query : "";
        const h = (t.fragment?.length ?? 0) > 0 ? "#" + t.fragment : "";
        t.path = r + e + o + h;
        const u = [ RoutingInstruction.create(RoutingInstruction.clear(this)) ];
        u.push(...RoutingInstruction.clone(i, this.statefulHistory));
        t.fullStateInstruction = u;
        if (null === (t.title ?? null)) {
            const s = await Title.getTitle(i, t, this.configuration.options.title);
            if (null !== s) t.title = s;
        }
        return Promise.resolve();
    }
    extractFragment(t, i) {
        if ("string" === typeof t && null == i.fragment) {
            const [s, n] = t.split("#");
            t = s;
            i.fragment = n;
        }
        return t;
    }
    extractQuery(t, i) {
        if ("string" === typeof t && null == i.query) {
            const [s, n] = t.split("?");
            t = s;
            i.query = n;
        }
        if ("string" === typeof i.parameters && null == i.query) {
            i.query = i.parameters;
            i.parameters = void 0;
        }
        if ("string" === typeof i.query && i.query.length > 0) {
            i.parameters ?? (i.parameters = {});
            const t = new URLSearchParams(i.query);
            t.forEach(((t, s) => {
                s = decodeURIComponent(s);
                t = decodeURIComponent(t);
                if (s in i.parameters) {
                    if (!Array.isArray(i.parameters[s])) i.parameters[s] = [ i.parameters[s] ];
                    i.parameters[s].push(t);
                } else i.parameters[s] = t;
            }));
        }
        return t;
    }
}

Router.closestEndpointKey = t.Protocol.annotation.keyFor("closest-endpoint");

function w(t) {
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

const m = t.DI.createInterface("ILinkHandler", (t => t.singleton(exports.LinkHandler)));

exports.LinkHandler = class LinkHandler {
    constructor(t, i) {
        this.window = t;
        this.router = i;
    }
    handleEvent(t) {
        this.handleClick(t);
    }
    handleClick(t) {
        if (0 !== t.button || t.altKey || t.ctrlKey || t.metaKey || t.shiftKey) return;
        const s = t.currentTarget;
        if (s.hasAttribute("external")) return;
        const n = s.getAttribute("target") ?? "";
        if (n.length > 0 && n !== this.window.name && "_self" !== n) return;
        const e = i.CustomAttribute.for(s, "load");
        const r = void 0 !== e ? e.viewModel.value : null;
        const o = this.router.configuration.options.useHref && s.hasAttribute("href") ? s.getAttribute("href") : null;
        if ((null === r || 0 === r.length) && (null === o || 0 === o.length)) return;
        t.preventDefault();
        let h = r ?? o ?? "";
        if ("string" === typeof h && h.startsWith("#")) {
            h = h.slice(1);
            if (!h.startsWith("/")) h = `/${h}`;
        }
        this.router.load(h, {
            origin: s
        }).catch((t => {
            throw t;
        }));
    }
};

exports.LinkHandler = e([ r(0, i.IWindow), r(1, v) ], exports.LinkHandler);

exports.ReloadBehavior = void 0;

(function(t) {
    t["default"] = "default";
    t["disallow"] = "disallow";
    t["reload"] = "reload";
    t["refresh"] = "refresh";
})(exports.ReloadBehavior || (exports.ReloadBehavior = {}));

function R(t) {
    return function(i) {
        return Route.configure(t, i);
    };
}

function I(t, i, s, n, e = false) {
    if (e) return "" === i;
    if (s) return i;
    const r = n.getAttribute(t) ?? "";
    return r.length > 0 ? r : i;
}

function E(t, i) {
    if (t.isActive) return;
    return new Promise((t => {
        const s = i.subscribe(RouterStartEvent.eventName, (() => {
            t();
            s.dispose();
        }));
    }));
}

function y(t, s, n, e) {
    let r = i.CustomAttribute.for(n, "considered-active")?.viewModel?.value;
    if (void 0 === r) r = e;
    const o = t.applyLoadOptions(r, {
        context: s
    });
    const h = RoutingInstruction.from(t, o.instructions);
    for (const t of h) if (null === t.scope) t.scope = o.scope;
    return h;
}

function C(t) {
    let i = t.parentElement;
    while (null != i) {
        if ("AU-VIEWPORT" === i.tagName) {
            i = null;
            break;
        }
        if (i.hasAttribute("load-active")) break;
        i = i.parentElement;
    }
    i ?? (i = t);
    return i;
}

const S = i.CustomElement.createInjectable();

exports.ViewportCustomElement = class ViewportCustomElement {
    constructor(t, i, s, n, e, r) {
        this.router = t;
        this.element = i;
        this.container = s;
        this.ea = n;
        this.parentViewport = e;
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
        const i = this.instruction.props.filter((t => "default" === t.to)).length > 0;
        if (i && null != this.parentViewport) {
            this.parentViewport.pendingChildren.push(this);
            if (null === this.parentViewport.pendingPromise) this.parentViewport.pendingPromise = new OpenPromise;
        }
        return Runner.run(null, (() => E(this.router, this.ea)), (() => {
            if (this.router.isRestrictedNavigation) this.connect();
        }));
    }
    binding(t, i, s) {
        this.isBound = true;
        return Runner.run(null, (() => E(this.router, this.ea)), (() => {
            if (!this.router.isRestrictedNavigation) this.connect();
        }), (() => {
            if (null != this.endpoint?.activeResolve) {
                this.endpoint.activeResolve();
                this.endpoint.activeResolve = null;
            }
        }), (() => {
            if (null !== this.endpoint && null === this.endpoint.getNextContent()) return this.endpoint.activate(null, t, this.controller, s, void 0)?.asValue;
        }));
    }
    detaching(t, i, s) {
        if (null !== this.endpoint) {
            this.isBound = false;
            return this.endpoint.deactivate(null, t, i, s);
        }
    }
    unbinding(t, i, s) {
        if (null !== this.endpoint) return this.disconnect(null);
    }
    dispose() {
        this.endpoint?.dispose();
        this.endpoint = null;
    }
    connect() {
        const {isBound: t, element: i} = this;
        const s = I("name", this.name, t, i);
        const n = {};
        n.scope = !I("no-scope", this.noScope, false, i, true);
        n.usedBy = I("used-by", this.usedBy, t, i);
        n.default = I("default", this.default, t, i);
        n.fallback = I("fallback", this.fallback, t, i);
        n.fallbackAction = I("fallback-action", this.fallbackAction, t, i);
        n.noLink = I("no-link", this.noLink, t, i, true);
        n.noTitle = I("no-title", this.noTitle, t, i, true);
        n.noHistory = I("no-history", this.noHistory, t, i, true);
        n.stateful = I("stateful", this.stateful, t, i, true);
        Object.keys(n).forEach((t => {
            if (void 0 === n[t]) delete n[t];
        }));
        this.endpoint = this.router.connectEndpoint(this.endpoint, "Viewport", this, s, n);
        const e = this.parentViewport;
        if (null != e) {
            h(e.pendingChildren, (t => t === this));
            if (0 === e.pendingChildren.length && null !== e.pendingPromise) {
                e.pendingPromise.resolve();
                e.pendingPromise = null;
            }
        }
    }
    disconnect(t) {
        if (null !== this.endpoint) this.router.disconnectEndpoint(t, this.endpoint, this);
    }
    setActivity(t, i) {
        const s = this.router.configuration.options.indicators.viewportNavigating;
        if ("string" === typeof t) this.element.classList.toggle(t, i); else for (const n in t) this.element.classList.toggle(`${s}-${n}`, i && t[n]);
    }
};

e([ i.bindable ], exports.ViewportCustomElement.prototype, "name", void 0);

e([ i.bindable ], exports.ViewportCustomElement.prototype, "usedBy", void 0);

e([ i.bindable ], exports.ViewportCustomElement.prototype, "default", void 0);

e([ i.bindable ], exports.ViewportCustomElement.prototype, "fallback", void 0);

e([ i.bindable ], exports.ViewportCustomElement.prototype, "fallbackAction", void 0);

e([ i.bindable ], exports.ViewportCustomElement.prototype, "noScope", void 0);

e([ i.bindable ], exports.ViewportCustomElement.prototype, "noLink", void 0);

e([ i.bindable ], exports.ViewportCustomElement.prototype, "noTitle", void 0);

e([ i.bindable ], exports.ViewportCustomElement.prototype, "noHistory", void 0);

e([ i.bindable ], exports.ViewportCustomElement.prototype, "stateful", void 0);

exports.ViewportCustomElement = e([ i.customElement({
    name: "au-viewport",
    injectable: S
}), r(0, v), r(1, i.INode), r(2, t.IContainer), r(3, t.IEventAggregator), r(4, S), r(5, i.IInstruction) ], exports.ViewportCustomElement);

const x = i.CustomElement.createInjectable();

exports.ViewportScopeCustomElement = class ViewportScopeCustomElement {
    constructor(t, i, s, n, e) {
        this.router = t;
        this.element = i;
        this.container = s;
        this.parent = n;
        this.parentController = e;
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
    bound(t, i, s) {
        this.isBound = true;
        this.$controller.scope = this.parentController.scope;
        this.connect();
        if (null !== this.viewportScope) this.viewportScope.binding();
    }
    unbinding(t, i, s) {
        if (null !== this.viewportScope) this.viewportScope.unbinding();
        return Promise.resolve();
    }
    connect() {
        if (null === this.router.rootScope) return;
        const t = this.getAttribute("name", this.name);
        const i = {};
        let s = this.getAttribute("catches", this.catches);
        if (void 0 !== s) i.catches = s;
        s = this.getAttribute("collection", this.collection, true);
        if (void 0 !== s) i.collection = s;
        i.source = this.source || null;
        this.viewportScope = this.router.connectEndpoint(this.viewportScope, "ViewportScope", this, t, i);
    }
    disconnect() {
        if (this.viewportScope) this.router.disconnectEndpoint(null, this.viewportScope, this);
        this.viewportScope = null;
    }
    getAttribute(t, i, s = false) {
        if (this.isBound) return i; else if (this.element.hasAttribute(t)) if (s) return true; else {
            i = this.element.getAttribute(t);
            if (i.length > 0) return i;
        }
        return;
    }
};

e([ i.bindable ], exports.ViewportScopeCustomElement.prototype, "name", void 0);

e([ i.bindable ], exports.ViewportScopeCustomElement.prototype, "catches", void 0);

e([ i.bindable ], exports.ViewportScopeCustomElement.prototype, "collection", void 0);

e([ i.bindable ], exports.ViewportScopeCustomElement.prototype, "source", void 0);

exports.ViewportScopeCustomElement = e([ i.customElement({
    name: "au-viewport-scope",
    template: "<template></template>",
    containerless: false,
    injectable: x
}), r(0, v), r(1, i.INode), r(2, t.IContainer), r(3, x), r(4, i.IController) ], exports.ViewportScopeCustomElement);

exports.LoadCustomAttribute = class LoadCustomAttribute {
    constructor(t, i, s, n) {
        this.element = t;
        this.router = i;
        this.linkHandler = s;
        this.ea = n;
        this.h = false;
        this.hasHref = null;
        this.navigationEndHandler = t => {
            void this.updateActive();
        };
        this.activeClass = this.router.configuration.options.indicators.loadActive;
    }
    binding() {
        if (null == this.value) this.h = true;
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
        if (this.h) this.value = {
            component: this.component,
            parameters: this.parameters,
            viewport: this.viewport,
            id: this.id
        };
        if (null === this.hasHref) this.hasHref = this.element.hasAttribute("href");
        if (!this.hasHref) {
            let t = this.value;
            if ("string" !== typeof t) {
                const i = RoutingInstruction.from(this.router, t).shift();
                const s = this.u(t);
                if (s.foundConfiguration) i.route = s.matching;
                t = RoutingInstruction.stringify(this.router, [ i ]);
            }
            const {scope: i, instruction: s} = RoutingScope.for(this.element, t);
            const n = i?.path ?? "";
            t = `${n}${s ?? ""}`;
            if (this.router.configuration.options.useUrlFragmentHash && !t.startsWith("#")) t = `#/${t}`;
            this.element.setAttribute("href", t);
        }
    }
    async updateActive() {
        const t = i.CustomAttribute.for(this.element, "load").parent;
        const s = "string" === typeof this.value ? {
            id: this.value,
            path: this.value
        } : this.value;
        const n = this.u(s);
        const e = n.foundConfiguration ? n.instructions : y(this.router, t, this.element, this.value);
        const r = C(this.element);
        r.classList.toggle(this.activeClass, this.router.checkActive(e, {
            context: t
        }));
    }
    u(t) {
        if ("string" === typeof t) return new FoundRoute;
        const i = RoutingScope.for(this.element).scope ?? this.router.rootScope.scope;
        if (null != t.id) return i.findMatchingRoute(t.id, t.parameters ?? {});
        const s = t.path;
        if (null != s) return i.findMatchingRoute(s, t.parameters ?? {});
        return new FoundRoute;
    }
};

e([ i.bindable({
    mode: 2
}) ], exports.LoadCustomAttribute.prototype, "value", void 0);

e([ i.bindable ], exports.LoadCustomAttribute.prototype, "component", void 0);

e([ i.bindable ], exports.LoadCustomAttribute.prototype, "parameters", void 0);

e([ i.bindable ], exports.LoadCustomAttribute.prototype, "viewport", void 0);

e([ i.bindable ], exports.LoadCustomAttribute.prototype, "id", void 0);

exports.LoadCustomAttribute = e([ i.customAttribute("load"), r(0, i.INode), r(1, v), r(2, m), r(3, t.IEventAggregator) ], exports.LoadCustomAttribute);

exports.HrefCustomAttribute = class HrefCustomAttribute {
    constructor(t, i, s, n) {
        this.element = t;
        this.router = i;
        this.linkHandler = s;
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
            const t = i.CustomAttribute.for(this.element, "href").parent;
            const s = y(this.router, t, this.element, this.value);
            const n = C(this.element);
            n.classList.toggle(this.activeClass, this.router.checkActive(s, {
                context: t
            }));
        }
    }
    hasLoad() {
        const t = this.$controller.parent;
        const i = t.children;
        return i?.some((t => 1 === t.vmKind && t.viewModel instanceof exports.LoadCustomAttribute)) ?? false;
    }
};

e([ i.bindable({
    mode: 2
}) ], exports.HrefCustomAttribute.prototype, "value", void 0);

exports.HrefCustomAttribute = e([ i.customAttribute({
    name: "href",
    noMultiBindings: true
}), r(0, i.INode), r(1, v), r(2, m), r(3, t.IEventAggregator) ], exports.HrefCustomAttribute);

exports.ConsideredActiveCustomAttribute = class ConsideredActiveCustomAttribute {};

e([ i.bindable({
    mode: 2
}) ], exports.ConsideredActiveCustomAttribute.prototype, "value", void 0);

exports.ConsideredActiveCustomAttribute = e([ i.customAttribute("considered-active") ], exports.ConsideredActiveCustomAttribute);

const N = t.DI.createInterface("IRouterConfiguration", (t => t.singleton(RouterConfiguration)));

const b = v;

const k = [ b ];

const $ = exports.ViewportCustomElement;

const P = exports.ViewportScopeCustomElement;

const T = exports.LoadCustomAttribute;

const V = exports.HrefCustomAttribute;

const A = [ exports.ViewportCustomElement, exports.ViewportScopeCustomElement, exports.LoadCustomAttribute, exports.HrefCustomAttribute, exports.ConsideredActiveCustomAttribute ];

class RouterConfiguration {
    static register(t) {
        const s = t.get(N);
        s.options = RouterConfiguration.options;
        s.options.setRouterConfiguration(s);
        RouterConfiguration.options = RouterOptions.create();
        return t.register(...k, ...A, i.AppTask.activating(v, RouterConfiguration.configurationCall), i.AppTask.activated(v, (t => t.initialLoad())), i.AppTask.deactivated(v, (t => t.stop())));
    }
    static customize(t) {
        if (void 0 === t) {
            RouterConfiguration.options = RouterOptions.create();
            RouterConfiguration.configurationCall = t => {
                t.start();
            };
        } else if (t instanceof Function) RouterConfiguration.configurationCall = t; else {
            RouterConfiguration.options = RouterOptions.create();
            RouterConfiguration.options.apply(t);
        }
        return RouterConfiguration;
    }
    static createContainer() {
        return this.register(t.DI.createContainer());
    }
    static for(t) {
        if (t instanceof Router) return t.configuration;
        return t.get(N);
    }
    apply(t, i = false) {
        if (i) this.options = RouterOptions.create();
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

exports.ConfigurableRoute = f;

exports.DefaultComponents = k;

exports.DefaultResources = A;

exports.Endpoint = Endpoint$1;

exports.EndpointContent = EndpointContent;

exports.FoundRoute = FoundRoute;

exports.HrefCustomAttributeRegistration = V;

exports.ILinkHandler = m;

exports.IRouter = v;

exports.IRouterConfiguration = N;

exports.InstructionParameters = InstructionParameters;

exports.LoadCustomAttributeRegistration = T;

exports.Navigation = Navigation;

exports.NavigationCoordinator = NavigationCoordinator;

exports.NavigationFlags = NavigationFlags;

exports.RecognizedRoute = p;

exports.RecognizerEndpoint = d;

exports.Route = Route;

exports.RouteRecognizer = c;

exports.Router = Router;

exports.RouterConfiguration = RouterConfiguration;

exports.RouterNavigationCancelEvent = RouterNavigationCancelEvent;

exports.RouterNavigationCompleteEvent = RouterNavigationCompleteEvent;

exports.RouterNavigationEndEvent = RouterNavigationEndEvent;

exports.RouterNavigationErrorEvent = RouterNavigationErrorEvent;

exports.RouterNavigationStartEvent = RouterNavigationStartEvent;

exports.RouterOptions = RouterOptions;

exports.RouterRegistration = b;

exports.RouterStartEvent = RouterStartEvent;

exports.RouterStopEvent = RouterStopEvent;

exports.Routes = l;

exports.RoutingHook = RoutingHook;

exports.RoutingInstruction = RoutingInstruction;

exports.RoutingScope = RoutingScope;

exports.Runner = Runner;

exports.Step = Step;

exports.Viewport = Viewport;

exports.ViewportContent = ViewportContent;

exports.ViewportCustomElementRegistration = $;

exports.ViewportOptions = ViewportOptions;

exports.ViewportScope = ViewportScope;

exports.ViewportScopeContent = ViewportScopeContent;

exports.ViewportScopeCustomElementRegistration = P;

exports.route = R;

exports.routes = a;
//# sourceMappingURL=index.cjs.map
