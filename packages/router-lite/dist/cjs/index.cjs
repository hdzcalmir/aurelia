"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var t = require("@aurelia/metadata");

var e = require("@aurelia/kernel");

var s = require("@aurelia/runtime-html");

var i = require("@aurelia/route-recognizer");

function error(t, e, ...s) {
    {
        t.error(`AUR${e}`, ...s.map((t => String(t))));
    }
}

function getMessage(t, ...e) {
    return `AUR${t}:${e.map((t => String(t))).join(":")}`;
}

function logAndThrow(t, e) {
    e.error(t);
    throw t;
}

class Batch {
    constructor(t, e, s) {
        this.t = t;
        this.i = e;
        this.u = false;
        this.h = null;
        this.R = s ?? this;
    }
    static C(t) {
        return new Batch(0, t, null);
    }
    _() {
        let t = this;
        do {
            ++t.t;
            t = t.h;
        } while (t !== null);
    }
    N() {
        let t = this;
        do {
            if (--t.t === 0) {
                t.T();
            }
            t = t.h;
        } while (t !== null);
    }
    T() {
        const t = this.i;
        if (t !== null) {
            this.i = null;
            t(this);
            this.u = true;
        }
    }
    $(t) {
        if (this.h === null) {
            return this.h = new Batch(this.t, t, this.R);
        } else {
            return this.h.$(t);
        }
    }
    C() {
        this.R._();
        this.R.N();
        return this;
    }
}

function mergeDistinct(t, e) {
    t = t.slice();
    e = e.slice();
    const s = [];
    while (t.length > 0) {
        const i = t.shift();
        const n = i.context.vpa;
        if (s.every((t => t.context.vpa !== n))) {
            const t = e.findIndex((t => t.context.vpa === n));
            if (t >= 0) {
                s.push(...e.splice(0, t + 1));
            } else {
                s.push(i);
            }
        }
    }
    s.push(...e);
    return s;
}

function tryStringify(t) {
    try {
        return JSON.stringify(t);
    } catch {
        return Object.prototype.toString.call(t);
    }
}

function ensureArrayOfStrings(t) {
    return typeof t === "string" ? [ t ] : t;
}

function ensureString(t) {
    return typeof t === "string" ? t : t[0];
}

function mergeURLSearchParams(t, e, s) {
    const i = s ? new URLSearchParams(t) : t;
    if (e == null) return i;
    for (const [t, s] of Object.entries(e)) {
        i.append(t, s);
    }
    return i;
}

function isNotNullishOrTypeOrViewModel(t) {
    return typeof t === "object" && t !== null && !s.isCustomElementViewModel(t);
}

function isPartialCustomElementDefinition(t) {
    return isNotNullishOrTypeOrViewModel(t) && Object.prototype.hasOwnProperty.call(t, "name") === true;
}

function isPartialChildRouteConfig(t) {
    return isNotNullishOrTypeOrViewModel(t) && Object.prototype.hasOwnProperty.call(t, "component") === true;
}

function isPartialRedirectRouteConfig(t) {
    return isNotNullishOrTypeOrViewModel(t) && Object.prototype.hasOwnProperty.call(t, "redirectTo") === true;
}

function isPartialViewportInstruction(t) {
    return isNotNullishOrTypeOrViewModel(t) && Object.prototype.hasOwnProperty.call(t, "component") === true;
}

function expectType(t, e, s) {
    throw new Error(getMessage(3554, e, t, tryStringify(s)));
}

function validateRouteConfig(t, e) {
    if (t == null) throw new Error(getMessage(3555, t));
    const s = Object.keys(t);
    for (const i of s) {
        const s = t[i];
        const n = [ e, i ].join(".");
        switch (i) {
          case "id":
          case "viewport":
          case "redirectTo":
            if (typeof s !== "string") {
                expectType("string", n, s);
            }
            break;

          case "caseSensitive":
          case "nav":
            if (typeof s !== "boolean") {
                expectType("boolean", n, s);
            }
            break;

          case "data":
            if (typeof s !== "object" || s === null) {
                expectType("object", n, s);
            }
            break;

          case "title":
            switch (typeof s) {
              case "string":
              case "function":
                break;

              default:
                expectType("string or function", n, s);
            }
            break;

          case "path":
            if (s instanceof Array) {
                for (let t = 0; t < s.length; ++t) {
                    if (typeof s[t] !== "string") {
                        expectType("string", `${n}[${t}]`, s[t]);
                    }
                }
            } else if (typeof s !== "string") {
                expectType("string or Array of strings", n, s);
            }
            break;

          case "component":
            validateComponent(s, n, "component");
            break;

          case "routes":
            {
                if (!(s instanceof Array)) {
                    expectType("Array", n, s);
                }
                for (const t of s) {
                    const e = `${n}[${s.indexOf(t)}]`;
                    validateComponent(t, e, "component");
                }
                break;
            }

          case "transitionPlan":
            switch (typeof s) {
              case "string":
                switch (s) {
                  case "none":
                  case "replace":
                  case "invoke-lifecycles":
                    break;

                  default:
                    expectType("string('none'|'replace'|'invoke-lifecycles') or function", n, s);
                }
                break;

              case "function":
                break;

              default:
                expectType("string('none'|'replace'|'invoke-lifecycles') or function", n, s);
            }
            break;

          case "fallback":
            validateComponent(s, n, "fallback");
            break;

          default:
            throw new Error(getMessage(3556, e, i));
        }
    }
}

function validateRedirectRouteConfig(t, e) {
    if (t == null) throw new Error(getMessage(3555, t));
    const s = Object.keys(t);
    for (const i of s) {
        const s = t[i];
        const n = [ e, i ].join(".");
        switch (i) {
          case "path":
            if (s instanceof Array) {
                for (let t = 0; t < s.length; ++t) {
                    if (typeof s[t] !== "string") {
                        expectType("string", `${n}[${t}]`, s[t]);
                    }
                }
            } else if (typeof s !== "string") {
                expectType("string or Array of strings", n, s);
            }
            break;

          case "redirectTo":
            if (typeof s !== "string") {
                expectType("string", n, s);
            }
            break;

          default:
            throw new Error(getMessage(3557, e, i));
        }
    }
}

function validateComponent(t, e, i) {
    switch (typeof t) {
      case "function":
        break;

      case "object":
        if (t instanceof Promise) {
            break;
        }
        if (isPartialRedirectRouteConfig(t)) {
            validateRedirectRouteConfig(t, e);
            break;
        }
        if (isPartialChildRouteConfig(t)) {
            validateRouteConfig(t, e);
            break;
        }
        if (!s.isCustomElementViewModel(t) && !isPartialCustomElementDefinition(t)) {
            expectType(`an object with at least a '${i}' property (see Routeable)`, e, t);
        }
        break;

      case "string":
        break;

      default:
        expectType("function, object or string (see Routeable)", e, t);
    }
}

function shallowEquals(t, e) {
    if (t === e) {
        return true;
    }
    if (typeof t !== typeof e) {
        return false;
    }
    if (t === null || e === null) {
        return false;
    }
    if (Object.getPrototypeOf(t) !== Object.getPrototypeOf(e)) {
        return false;
    }
    const s = Object.keys(t);
    const i = Object.keys(e);
    if (s.length !== i.length) {
        return false;
    }
    for (let n = 0, r = s.length; n < r; ++n) {
        const r = s[n];
        if (r !== i[n]) {
            return false;
        }
        if (t[r] !== e[r]) {
            return false;
        }
    }
    return true;
}

function valueOrFuncToValue(t, e) {
    if (typeof e === "function") {
        return e(t);
    }
    return e;
}

const n = /*@__PURE__*/ e.DI.createInterface("RouterOptions");

class RouterOptions {
    constructor(t, e, s, i, n, r, o) {
        this.useUrlFragmentHash = t;
        this.useHref = e;
        this.historyStrategy = s;
        this.buildTitle = i;
        this.useNavigationModel = n;
        this.activeClass = r;
        this.restorePreviousRouteTreeOnError = o;
    }
    static create(t) {
        return new RouterOptions(t.useUrlFragmentHash ?? false, t.useHref ?? true, t.historyStrategy ?? "push", t.buildTitle ?? null, t.useNavigationModel ?? true, t.activeClass ?? null, t.restorePreviousRouteTreeOnError ?? true);
    }
    toString() {
        return "RO";
    }
}

class NavigationOptions {
    constructor(t, e, s, i, n, r, o, c) {
        this.historyStrategy = t;
        this.title = e;
        this.titleSeparator = s;
        this.context = i;
        this.queryParams = n;
        this.fragment = r;
        this.state = o;
        this.transitionPlan = c;
    }
    static create(t, e) {
        return new NavigationOptions(e.historyStrategy ?? t.historyStrategy, e.title ?? null, e.titleSeparator ?? " | ", e.context ?? null, e.queryParams ?? null, e.fragment ?? "", e.state ?? null, e.transitionPlan ?? null);
    }
    I() {
        return new NavigationOptions(this.historyStrategy, this.title, this.titleSeparator, this.context, {
            ...this.queryParams
        }, this.fragment, this.state === null ? null : {
            ...this.state
        }, this.transitionPlan);
    }
    P(t) {
        return valueOrFuncToValue(t, this.historyStrategy);
    }
}

const r = "au-nav-id";

class Subscription {
    constructor(t, e, s) {
        this.A = t;
        this.V = e;
        this.M = s;
        this.O = false;
    }
    dispose() {
        if (!this.O) {
            this.O = true;
            this.M.dispose();
            const t = this.A["L"];
            t.splice(t.indexOf(this), 1);
        }
    }
}

const o = /*@__PURE__*/ e.DI.createInterface("IRouterEvents", (t => t.singleton(RouterEvents)));

class RouterEvents {
    constructor() {
        this.j = 0;
        this.L = [];
        this.U = e.resolve(e.IEventAggregator);
        this.B = e.resolve(e.ILogger).scopeTo("RouterEvents");
    }
    publish(t) {
        this.U.publish(t.name, t);
    }
    subscribe(t, e) {
        const s = new Subscription(this, ++this.j, this.U.subscribe(t, (t => {
            e(t);
        })));
        this.L.push(s);
        return s;
    }
}

class LocationChangeEvent {
    get name() {
        return "au:router:location-change";
    }
    constructor(t, e, s, i) {
        this.id = t;
        this.url = e;
        this.trigger = s;
        this.state = i;
    }
    toString() {
        return `LocationChangeEvent`;
    }
}

class NavigationStartEvent {
    get name() {
        return "au:router:navigation-start";
    }
    constructor(t, e, s, i) {
        this.id = t;
        this.instructions = e;
        this.trigger = s;
        this.managedState = i;
    }
    toString() {
        return `NavigationStartEvent`;
    }
}

class NavigationEndEvent {
    get name() {
        return "au:router:navigation-end";
    }
    constructor(t, e, s) {
        this.id = t;
        this.instructions = e;
        this.finalInstructions = s;
    }
    toString() {
        return `NavigationEndEvent`;
    }
}

class NavigationCancelEvent {
    get name() {
        return "au:router:navigation-cancel";
    }
    constructor(t, e, s) {
        this.id = t;
        this.instructions = e;
        this.reason = s;
    }
    toString() {
        return `NavigationCancelEvent`;
    }
}

class NavigationErrorEvent {
    get name() {
        return "au:router:navigation-error";
    }
    constructor(t, e, s) {
        this.id = t;
        this.instructions = e;
        this.error = s;
    }
    toString() {
        return `NavigationErrorEvent`;
    }
}

const c = /*@__PURE__*/ e.DI.createInterface("IBaseHref");

const a = /*@__PURE__*/ e.DI.createInterface("ILocationManager", (t => t.singleton(BrowserLocationManager)));

class BrowserLocationManager {
    constructor() {
        this.q = 0;
        this.B = e.resolve(e.ILogger).root.scopeTo("LocationManager");
        this.A = e.resolve(o);
        this.H = e.resolve(s.IHistory);
        this.l = e.resolve(s.ILocation);
        this.F = e.resolve(s.IWindow);
        this.G = e.resolve(c);
        this.W = e.resolve(n).useUrlFragmentHash ? "hashchange" : "popstate";
    }
    startListening() {
        this.F.addEventListener(this.W, this, false);
    }
    stopListening() {
        this.F.removeEventListener(this.W, this, false);
    }
    handleEvent(t) {
        this.A.publish(new LocationChangeEvent(++this.q, this.getPath(), this.W, "state" in t ? t.state : null));
    }
    pushState(t, e, s) {
        s = this.addBaseHref(s);
        this.H.pushState(t, e, s);
    }
    replaceState(t, e, s) {
        s = this.addBaseHref(s);
        this.H.replaceState(t, e, s);
    }
    getPath() {
        const {pathname: t, search: e, hash: s} = this.l;
        return this.removeBaseHref(`${t}${normalizeQuery(e)}${s}`);
    }
    addBaseHref(t) {
        let e;
        let s = this.G.href;
        if (s.endsWith("/")) {
            s = s.slice(0, -1);
        }
        if (s.length === 0) {
            e = t;
        } else {
            if (t.startsWith("/")) {
                t = t.slice(1);
            }
            e = `${s}/${t}`;
        }
        return e;
    }
    removeBaseHref(t) {
        const e = this.G.pathname;
        if (t.startsWith(e)) {
            t = t.slice(e.length);
        }
        return normalizePath(t);
    }
}

function normalizePath(t) {
    let e;
    let s;
    let i;
    if ((i = t.indexOf("?")) >= 0 || (i = t.indexOf("#")) >= 0) {
        e = t.slice(0, i);
        s = t.slice(i);
    } else {
        e = t;
        s = "";
    }
    if (e.endsWith("/")) {
        e = e.slice(0, -1);
    } else if (e.endsWith("/index.html")) {
        e = e.slice(0, -11);
    }
    return `${e}${s}`;
}

function normalizeQuery(t) {
    return t.length > 0 && !t.startsWith("?") ? `?${t}` : t;
}

const u = e.emptyArray;

function defaultReentryBehavior(t, e) {
    if (!shallowEquals(t.params, e.params)) {
        return "replace";
    }
    return "none";
}

class RouteConfig {
    get path() {
        const t = this.Y;
        if (t.length > 0) return t;
        const e = s.CustomElement.getDefinition(this.component);
        return this.Y = [ e.name, ...e.aliases ];
    }
    constructor(t, e, s, i, n, r, o, c, a, u, h, l) {
        this.id = t;
        this.Y = e;
        this.title = s;
        this.redirectTo = i;
        this.caseSensitive = n;
        this.transitionPlan = r;
        this.viewport = o;
        this.data = c;
        this.routes = a;
        this.fallback = u;
        this.component = h;
        this.nav = l;
        this.J = false;
    }
    static K(t, s) {
        if (typeof t === "string" || t instanceof Array) {
            const e = ensureArrayOfStrings(t);
            const i = s?.redirectTo ?? null;
            const n = s?.caseSensitive ?? false;
            const r = ensureString(s?.id ?? (e instanceof Array ? e[0] : e));
            const o = s?.title ?? null;
            const c = s?.transitionPlan ?? null;
            const a = s?.viewport ?? E;
            const h = s?.data ?? {};
            const l = s?.routes ?? u;
            return new RouteConfig(r, e, o, i, n, c, a, h, l, s?.fallback ?? null, s, s?.nav ?? true);
        } else if (typeof t === "object") {
            const i = t;
            validateRouteConfig(i, "");
            const n = ensureArrayOfStrings(i.path ?? s?.path ?? e.emptyArray);
            const r = i.title ?? s?.title ?? null;
            const o = i.redirectTo ?? s?.redirectTo ?? null;
            const c = i.caseSensitive ?? s?.caseSensitive ?? false;
            const a = i.id ?? s?.id ?? (n instanceof Array ? n[0] : n);
            const h = i.transitionPlan ?? s?.transitionPlan ?? null;
            const l = i.viewport ?? s?.viewport ?? E;
            const f = {
                ...s?.data,
                ...i.data
            };
            const p = [ ...i.routes ?? u, ...s?.routes ?? u ];
            return new RouteConfig(a, n, r, o, c, h, l, f, p, i.fallback ?? s?.fallback ?? null, i.component ?? s ?? null, i.nav ?? true);
        } else {
            expectType("string, function/class or object", "", t);
        }
    }
    X(t, e) {
        validateRouteConfig(t, this.path[0] ?? "");
        const s = ensureArrayOfStrings(t.path ?? this.path);
        return new RouteConfig(ensureString(t.id ?? this.id ?? s), s, t.title ?? this.title, t.redirectTo ?? this.redirectTo, t.caseSensitive ?? this.caseSensitive, t.transitionPlan ?? this.transitionPlan ?? e?.transitionPlan ?? null, t.viewport ?? this.viewport, t.data ?? this.data, t.routes ?? this.routes, t.fallback ?? this.fallback ?? e?.fallback ?? null, this.component, t.nav ?? this.nav);
    }
    Z(t, e) {
        const s = this.transitionPlan ?? defaultReentryBehavior;
        return typeof s === "function" ? s(t, e) : s;
    }
    tt(t, s, i) {
        if (this.J) throw new Error(getMessage(3550));
        if (typeof t.getRouteConfig !== "function") return;
        return e.onResolve(t.getRouteConfig(s, i), (t => {
            this.J = true;
            if (t == null) return;
            let e = s?.path ?? "";
            if (typeof e !== "string") {
                e = e[0];
            }
            validateRouteConfig(t, e);
            this.id = t.id ?? this.id;
            this.Y = ensureArrayOfStrings(t.path ?? this.path);
            this.title = t.title ?? this.title;
            this.redirectTo = t.redirectTo ?? this.redirectTo;
            this.caseSensitive = t.caseSensitive ?? this.caseSensitive;
            this.transitionPlan = t.transitionPlan ?? this.transitionPlan;
            this.viewport = t.viewport ?? this.viewport;
            this.data = t.data ?? this.data;
            this.routes = t.routes ?? this.routes;
            this.fallback = t.fallback ?? this.fallback;
            this.nav = t.nav ?? this.nav;
        }));
    }
    I() {
        return new RouteConfig(this.id, this.path, this.title, this.redirectTo, this.caseSensitive, this.transitionPlan, this.viewport, this.data, this.routes, this.fallback, this.component, this.nav);
    }
    et(t, e, i) {
        const n = this.fallback;
        return typeof n === "function" && !s.CustomElement.isType(n) ? n(t, e, i) : n;
    }
    register(t) {
        const e = this.component;
        if (e == null) return;
        t.register(e);
    }
}

const h = {
    name: e.Protocol.resource.keyFor("route-configuration"),
    isConfigured(e) {
        return t.Metadata.hasOwn(h.name, e);
    },
    configure(e, s) {
        const i = RouteConfig.K(e, s);
        t.Metadata.define(h.name, i, s);
        return s;
    },
    getConfig(e) {
        if (!h.isConfigured(e)) {
            h.configure({}, e);
        }
        return t.Metadata.getOwn(h.name, e);
    }
};

function route(t) {
    return function(e) {
        return h.configure(t, e);
    };
}

function resolveRouteConfiguration(t, s, i, n, r) {
    if (isPartialRedirectRouteConfig(t)) return RouteConfig.K(t, null);
    const [o, c] = resolveCustomElementDefinition(t, r);
    return e.onResolve(c, (r => {
        const c = r.Type;
        const a = h.getConfig(c);
        if (isPartialChildRouteConfig(t)) return a.X(t, i);
        if (s) return a.I();
        if (!a.J && o.type === 4 && typeof t.getRouteConfig === "function") {
            return e.onResolve(a.tt(t, i, n), (() => a));
        }
        return a;
    }));
}

function resolveCustomElementDefinition(t, e) {
    const i = createNavigationInstruction(t);
    let n;
    switch (i.type) {
      case 0:
        {
            if (e == null) throw new Error(getMessage(3551));
            const t = e.container.find(s.CustomElement, i.value);
            if (t === null) throw new Error(getMessage(3552, i.value, e));
            n = t;
            break;
        }

      case 2:
        n = i.value;
        break;

      case 4:
        n = s.CustomElement.getDefinition(i.value.constructor);
        break;

      case 3:
        if (e == null) throw new Error(getMessage(3553));
        n = e.st(i.value);
        break;
    }
    return [ i, n ];
}

function createNavigationInstruction(t) {
    return isPartialChildRouteConfig(t) ? createNavigationInstruction(t.component) : TypedNavigationInstruction.create(t);
}

class ViewportRequest {
    constructor(t, e) {
        this.viewportName = t;
        this.componentName = e;
    }
    toString() {
        return `VR(viewport:'${this.viewportName}',component:'${this.componentName}')`;
    }
}

const l = new WeakMap;

class ViewportAgent {
    get it() {
        return this._state & 16256;
    }
    set it(t) {
        this._state = this._state & 127 | t;
    }
    get nt() {
        return this._state & 127;
    }
    set nt(t) {
        this._state = this._state & 16256 | t;
    }
    constructor(t, s, i) {
        this.viewport = t;
        this.hostController = s;
        this.rt = false;
        this.ot = null;
        this.ct = null;
        this._state = 8256;
        this.ut = "replace";
        this.ht = null;
        this.lt = null;
        this.ft = null;
        this.dt = null;
        this.B = i.container.get(e.ILogger).scopeTo(`ViewportAgent<${i.gt}>`);
    }
    static for(t, e) {
        let i = l.get(t);
        if (i === void 0) {
            const n = s.Controller.getCachedOrThrow(t);
            l.set(t, i = new ViewportAgent(t, n, e));
        }
        return i;
    }
    wt(t, e) {
        const s = this.ft;
        if (s !== null) {
            ensureTransitionHasNotErrored(s);
        }
        this.rt = true;
        switch (this.nt) {
          case 64:
            switch (this.it) {
              case 8192:
                return;

              case 4096:
                return this.ot.vt(t, e);

              default:
                this.xt("activateFromViewport 1");
            }

          case 2:
            {
                if (this.ft === null) throw new Error(getMessage(3350, this));
                const e = Batch.C((e => {
                    this.vt(t, this.ft, e);
                }));
                const s = new Promise((t => {
                    e.$((() => {
                        t();
                    }));
                }));
                return e.C().u ? void 0 : s;
            }

          default:
            this.xt("activateFromViewport 2");
        }
    }
    Et(t, e) {
        const s = this.ft;
        if (s !== null) {
            ensureTransitionHasNotErrored(s);
        }
        this.rt = false;
        switch (this.it) {
          case 8192:
            return;

          case 4096:
            return this.ot.Rt(t, e);

          case 128:
            return;

          default:
            {
                if (this.ft === null) throw new Error(getMessage(3351, this));
                const e = Batch.C((e => {
                    this.Rt(t, this.ft, e);
                }));
                const s = new Promise((t => {
                    e.$((() => {
                        t();
                    }));
                }));
                return e.C().u ? void 0 : s;
            }
        }
    }
    yt(t) {
        if (!this.St()) {
            return false;
        }
        const e = this.viewport;
        const s = t.viewportName;
        const i = e.name;
        if (s !== E && i !== s) {
            return false;
        }
        const n = e.usedBy;
        if (n.length > 0 && !n.split(",").includes(t.componentName)) {
            return false;
        }
        return true;
    }
    St() {
        if (!this.rt) {
            return false;
        }
        if (this.nt !== 64) {
            return false;
        }
        return true;
    }
    Ct(t, s) {
        if (this.ft === null) {
            this.ft = t;
        }
        ensureTransitionHasNotErrored(t);
        if (t.guardsResult !== true) {
            return;
        }
        s._();
        void e.onResolve(this.dt, (() => {
            Batch.C((e => {
                for (const s of this.ht.children) {
                    s.context.vpa.Ct(t, e);
                }
            })).$((e => {
                switch (this.it) {
                  case 4096:
                    switch (this.ut) {
                      case "none":
                        this.it = 1024;
                        return;

                      case "invoke-lifecycles":
                      case "replace":
                        this.it = 2048;
                        e._();
                        Batch.C((e => {
                            this.ot.Ct(t, this.lt, e);
                        })).$((() => {
                            this.it = 1024;
                            e.N();
                        })).C();
                        return;
                    }

                  case 8192:
                    return;

                  default:
                    t.bt(new Error(`Unexpected state at canUnload of ${this}`));
                }
            })).$((() => {
                s.N();
            })).C();
        }));
    }
    _t(t, s) {
        if (this.ft === null) {
            this.ft = t;
        }
        ensureTransitionHasNotErrored(t);
        if (t.guardsResult !== true) {
            return;
        }
        s._();
        Batch.C((s => {
            switch (this.nt) {
              case 32:
                this.nt = 16;
                switch (this.ut) {
                  case "none":
                    return;

                  case "invoke-lifecycles":
                    return this.ot._t(t, this.lt, s);

                  case "replace":
                    s._();
                    void e.onResolve(this.lt.context.Nt(this.hostController, this.lt), (e => {
                        (this.ct = e)._t(t, this.lt, s);
                        s.N();
                    }));
                }

              case 64:
                return;

              default:
                this.xt("canLoad");
            }
        })).$((t => {
            const s = this.lt;
            switch (this.ut) {
              case "none":
              case "invoke-lifecycles":
                {
                    t._();
                    const i = s.context;
                    void e.onResolve(i.allResolved, (() => e.onResolve(e.onResolve(e.onResolveAll(...s.residue.splice(0).map((t => createAndAppendNodes(this.B, s, t)))), (() => e.onResolveAll(...i.getAvailableViewportAgents().reduce(((t, e) => {
                        const i = e.viewport;
                        const n = i.default;
                        if (n === null) return t;
                        t.push(createAndAppendNodes(this.B, s, ViewportInstruction.create({
                            component: n,
                            viewport: i.name
                        })));
                        return t;
                    }), [])))), (() => {
                        t.N();
                    }))));
                    return;
                }

              case "replace":
                return;
            }
        })).$((e => {
            switch (this.nt) {
              case 16:
                this.nt = 8;
                for (const s of this.lt.children) {
                    s.context.vpa._t(t, e);
                }
                return;

              case 64:
                return;

              default:
                this.xt("canLoad");
            }
        })).$((() => {
            s.N();
        })).C();
    }
    kt(t, e) {
        ensureTransitionHasNotErrored(t);
        ensureGuardsResultIsTrue(this, t);
        e._();
        Batch.C((e => {
            for (const s of this.ht.children) {
                s.context.vpa.kt(t, e);
            }
        })).$((s => {
            switch (this.it) {
              case 1024:
                switch (this.ut) {
                  case "none":
                    this.it = 256;
                    return;

                  case "invoke-lifecycles":
                  case "replace":
                    this.it = 512;
                    s._();
                    Batch.C((e => {
                        this.ot.kt(t, this.lt, e);
                    })).$((() => {
                        this.it = 256;
                        s.N();
                    })).C();
                    return;
                }

              case 8192:
                for (const s of this.ht.children) {
                    s.context.vpa.kt(t, e);
                }
                return;

              default:
                this.xt("unloading");
            }
        })).$((() => {
            e.N();
        })).C();
    }
    Tt(t, e) {
        ensureTransitionHasNotErrored(t);
        ensureGuardsResultIsTrue(this, t);
        e._();
        Batch.C((e => {
            switch (this.nt) {
              case 8:
                {
                    this.nt = 4;
                    switch (this.ut) {
                      case "none":
                        return;

                      case "invoke-lifecycles":
                        return this.ot.Tt(t, this.lt, e);

                      case "replace":
                        return this.ct.Tt(t, this.lt, e);
                    }
                }

              case 64:
                return;

              default:
                this.xt("loading");
            }
        })).$((e => {
            switch (this.nt) {
              case 4:
                this.nt = 2;
                for (const s of this.lt.children) {
                    s.context.vpa.Tt(t, e);
                }
                return;

              case 64:
                return;

              default:
                this.xt("loading");
            }
        })).$((() => {
            e.N();
        })).C();
    }
    Rt(t, s, i) {
        ensureTransitionHasNotErrored(s);
        ensureGuardsResultIsTrue(this, s);
        i._();
        switch (this.it) {
          case 256:
            this.it = 128;
            switch (this.ut) {
              case "none":
              case "invoke-lifecycles":
                i.N();
                return;

              case "replace":
                {
                    const n = this.hostController;
                    const r = this.ot;
                    s.$t((() => e.onResolve(r.Rt(t, n), (() => {
                        if (t === null) {
                            r.It();
                        }
                    }))), (() => {
                        i.N();
                    }));
                }
            }
            return;

          case 8192:
            i.N();
            return;

          case 128:
            i.N();
            return;

          default:
            this.xt("deactivate");
        }
    }
    vt(t, e, s) {
        ensureTransitionHasNotErrored(e);
        ensureGuardsResultIsTrue(this, e);
        s._();
        if (this.nt === 32) {
            Batch.C((t => {
                this._t(e, t);
            })).$((t => {
                this.Tt(e, t);
            })).$((s => {
                this.vt(t, e, s);
            })).$((() => {
                s.N();
            })).C();
            return;
        }
        switch (this.nt) {
          case 2:
            this.nt = 1;
            Batch.C((s => {
                switch (this.ut) {
                  case "none":
                  case "invoke-lifecycles":
                    return;

                  case "replace":
                    {
                        const i = this.hostController;
                        e.$t((() => {
                            s._();
                            return this.ct.vt(t, i);
                        }), (() => {
                            s.N();
                        }));
                    }
                }
            })).$((t => {
                this.Pt(e, t);
            })).$((() => {
                s.N();
            })).C();
            return;

          case 64:
            s.N();
            return;

          default:
            this.xt("activate");
        }
    }
    At(t, s) {
        if (this.it === 8192) {
            this.vt(null, t, s);
            return;
        }
        if (this.nt === 64) {
            this.Rt(null, t, s);
            return;
        }
        ensureTransitionHasNotErrored(t);
        ensureGuardsResultIsTrue(this, t);
        if (!(this.it === 256 && this.nt === 2)) {
            this.xt("swap");
        }
        this.it = 128;
        this.nt = 1;
        switch (this.ut) {
          case "none":
          case "invoke-lifecycles":
            {
                const e = mergeDistinct(this.lt.children, this.ht.children);
                for (const i of e) {
                    i.context.vpa.At(t, s);
                }
                return;
            }

          case "replace":
            {
                const i = this.hostController;
                const n = this.ot;
                const r = this.ct;
                s._();
                Batch.C((s => {
                    t.$t((() => {
                        s._();
                        return e.onResolve(n.Rt(null, i), (() => n.It()));
                    }), (() => {
                        s.N();
                    }));
                })).$((e => {
                    t.$t((() => {
                        e._();
                        return r.vt(null, i);
                    }), (() => {
                        e.N();
                    }));
                })).$((e => {
                    this.Pt(t, e);
                })).$((() => {
                    s.N();
                })).C();
                return;
            }
        }
    }
    Pt(t, s) {
        const i = this.lt;
        t.$t((() => {
            s._();
            const t = i.context;
            return e.onResolve(t.allResolved, (() => {
                const s = i.children.slice();
                return e.onResolve(e.onResolveAll(...i.residue.splice(0).map((t => createAndAppendNodes(this.B, i, t)))), (() => e.onResolve(e.onResolveAll(...t.getAvailableViewportAgents().reduce(((t, e) => {
                    const s = e.viewport;
                    const n = s.default;
                    if (n === null) return t;
                    t.push(createAndAppendNodes(this.B, i, ViewportInstruction.create({
                        component: n,
                        viewport: s.name
                    })));
                    return t;
                }), [])), (() => i.children.filter((t => !s.includes(t)))))));
            }));
        }), (e => {
            Batch.C((s => {
                for (const i of e) {
                    t.$t((() => {
                        s._();
                        return i.context.vpa._t(t, s);
                    }), (() => {
                        s.N();
                    }));
                }
            })).$((s => {
                for (const i of e) {
                    t.$t((() => {
                        s._();
                        return i.context.vpa.Tt(t, s);
                    }), (() => {
                        s.N();
                    }));
                }
            })).$((s => {
                for (const i of e) {
                    t.$t((() => {
                        s._();
                        return i.context.vpa.vt(null, t, s);
                    }), (() => {
                        s.N();
                    }));
                }
            })).$((() => {
                s.N();
            })).C();
        }));
    }
    Vt(t, e) {
        switch (this.nt) {
          case 64:
            this.lt = e;
            this.nt = 32;
            break;

          default:
            this.xt("scheduleUpdate 1");
        }
        switch (this.it) {
          case 8192:
          case 4096:
          case 1024:
            break;

          default:
            this.xt("scheduleUpdate 2");
        }
        const s = this.ot?.Mt ?? null;
        if (s === null || s.component !== e.component) {
            this.ut = "replace";
        } else {
            this.ut = t.transitionPlan ?? e.context.config.Z(s, e);
        }
    }
    Ot() {
        if (this.ht !== null) {
            this.ht.children.forEach((function(t) {
                t.context.vpa.Ot();
            }));
        }
        if (this.lt !== null) {
            this.lt.children.forEach((function(t) {
                t.context.vpa.Ot();
            }));
        }
        let t = null;
        let s = null;
        switch (this.it) {
          case 8192:
          case 4096:
            this.ft = null;
            break;

          case 2048:
          case 1024:
            this.it = 4096;
            this.ft = null;
            break;

          case 512:
          case 256:
          case 128:
            t = e.onResolve(this.ot?.Rt(null, this.hostController), (() => {
                this.ot?.It();
                this.it = 8192;
                this.ot = null;
            }));
            break;
        }
        switch (this.nt) {
          case 64:
          case 32:
          case 16:
          case 8:
            this.lt = null;
            this.nt = 64;
            break;

          case 4:
          case 2:
          case 1:
            {
                s = e.onResolve(this.ct?.Rt(null, this.hostController), (() => {
                    this.ct?.It();
                    this.ut = "replace";
                    this.nt = 64;
                    this.ct = null;
                    this.lt = null;
                }));
                break;
            }
        }
        if (t !== null && s !== null) {
            this.dt = e.onResolve(e.onResolveAll(t, s), (() => {
                this.ft = null;
                this.dt = null;
            }));
        }
    }
    Lt() {
        if (this.ht !== null) {
            this.ht.children.forEach((function(t) {
                t.context.vpa.Lt();
            }));
        }
        if (this.lt !== null) {
            this.lt.children.forEach((function(t) {
                t.context.vpa.Lt();
            }));
        }
        if (this.ft !== null) {
            ensureTransitionHasNotErrored(this.ft);
            switch (this.nt) {
              case 64:
                switch (this.it) {
                  case 8192:
                  case 128:
                    this.it = 8192;
                    this.ot = null;
                    break;

                  default:
                    this.xt("endTransition 1");
                }
                break;

              case 1:
                switch (this.it) {
                  case 8192:
                  case 128:
                    switch (this.ut) {
                      case "none":
                      case "invoke-lifecycles":
                        this.it = 4096;
                        break;

                      case "replace":
                        this.it = 4096;
                        this.ot = this.ct;
                        break;
                    }
                    this.ht = this.lt;
                    break;

                  default:
                    this.xt("endTransition 2");
                }
                break;

              default:
                this.xt("endTransition 3");
            }
            this.ut = "replace";
            this.nt = 64;
            this.lt = null;
            this.ct = null;
            this.ft = null;
        }
    }
    toString() {
        return `VPA(state:${$state(this._state)},plan:'${this.ut}',n:${this.lt},c:${this.ht},viewport:${this.viewport})`;
    }
    It() {
        this.ot?.It();
    }
    xt(t) {
        throw new Error(getMessage(3352, t, this));
    }
}

function ensureGuardsResultIsTrue(t, e) {
    if (e.guardsResult !== true) throw new Error(getMessage(3353, e.guardsResult, t));
}

function ensureTransitionHasNotErrored(t) {
    if (t.error !== void 0 && !t.erredWithUnknownRoute) throw t.error;
}

var f;

(function(t) {
    t[t["curr"] = 16256] = "curr";
    t[t["currIsEmpty"] = 8192] = "currIsEmpty";
    t[t["currIsActive"] = 4096] = "currIsActive";
    t[t["currCanUnload"] = 2048] = "currCanUnload";
    t[t["currCanUnloadDone"] = 1024] = "currCanUnloadDone";
    t[t["currUnload"] = 512] = "currUnload";
    t[t["currUnloadDone"] = 256] = "currUnloadDone";
    t[t["currDeactivate"] = 128] = "currDeactivate";
    t[t["next"] = 127] = "next";
    t[t["nextIsEmpty"] = 64] = "nextIsEmpty";
    t[t["nextIsScheduled"] = 32] = "nextIsScheduled";
    t[t["nextCanLoad"] = 16] = "nextCanLoad";
    t[t["nextCanLoadDone"] = 8] = "nextCanLoadDone";
    t[t["nextLoad"] = 4] = "nextLoad";
    t[t["nextLoadDone"] = 2] = "nextLoadDone";
    t[t["nextActivate"] = 1] = "nextActivate";
    t[t["bothAreEmpty"] = 8256] = "bothAreEmpty";
})(f || (f = {}));

const p = new Map;

function $state(t) {
    let e = p.get(t);
    if (e === void 0) {
        p.set(t, e = stringifyState(t));
    }
    return e;
}

function stringifyState(t) {
    const e = [];
    if ((t & 8192) === 8192) {
        e.push("currIsEmpty");
    }
    if ((t & 4096) === 4096) {
        e.push("currIsActive");
    }
    if ((t & 2048) === 2048) {
        e.push("currCanUnload");
    }
    if ((t & 1024) === 1024) {
        e.push("currCanUnloadDone");
    }
    if ((t & 512) === 512) {
        e.push("currUnload");
    }
    if ((t & 256) === 256) {
        e.push("currUnloadDone");
    }
    if ((t & 128) === 128) {
        e.push("currDeactivate");
    }
    if ((t & 64) === 64) {
        e.push("nextIsEmpty");
    }
    if ((t & 32) === 32) {
        e.push("nextIsScheduled");
    }
    if ((t & 16) === 16) {
        e.push("nextCanLoad");
    }
    if ((t & 8) === 8) {
        e.push("nextCanLoadDone");
    }
    if ((t & 4) === 4) {
        e.push("nextLoad");
    }
    if ((t & 2) === 2) {
        e.push("nextLoadDone");
    }
    if ((t & 1) === 1) {
        e.push("nextActivate");
    }
    return e.join("|");
}

class RouteNode {
    get root() {
        return this.jt.root;
    }
    get isInstructionsFinalized() {
        return this.Ut;
    }
    constructor(t, e, s, i, n, r, o, c, a, u, h, l, f, p) {
        this.path = t;
        this.finalPath = e;
        this.context = s;
        this.Bt = i;
        this.instruction = n;
        this.params = r;
        this.queryParams = o;
        this.fragment = c;
        this.data = a;
        this.Dt = u;
        this.title = h;
        this.component = l;
        this.children = f;
        this.residue = p;
        this.zt = 1;
        this.Ut = false;
        this.Bt ?? (this.Bt = n);
    }
    static create(t) {
        const {[i.RESIDUE]: s, ...n} = t.params ?? {};
        return new RouteNode(t.path, t.finalPath, t.context, t.originalInstruction ?? t.instruction, t.instruction, Object.freeze(n), t.queryParams ?? d, t.fragment ?? null, Object.freeze(t.data ?? e.emptyObject), t.Dt ?? null, t.title ?? null, t.component, t.children ?? [], t.residue ?? []);
    }
    contains(t, e) {
        if (this.context === t.options.context) {
            const s = e.matchEndpoint ?? false;
            const i = e.matchOriginalInstruction ?? false;
            const n = this.children;
            const r = t.children;
            for (let t = 0, e = n.length; t < e; ++t) {
                for (let o = 0, c = r.length; o < c; ++o) {
                    const a = r[o];
                    const u = s ? a.recognizedRoute?.route.endpoint : null;
                    const h = n[t + o] ?? null;
                    const l = h !== null ? !i && h.isInstructionsFinalized ? h.instruction : h.Bt : null;
                    const f = l?.recognizedRoute?.route.endpoint;
                    if (t + o < e && ((u?.equalsOrResidual(f) ?? false) || (l?.contains(a) ?? false))) {
                        if (o + 1 === c) {
                            return true;
                        }
                    } else {
                        break;
                    }
                }
            }
        }
        return this.children.some((function(s) {
            return s.contains(t, e);
        }));
    }
    qt(t) {
        this.children.push(t);
        t.Ht(this.jt);
    }
    Ft() {
        for (const t of this.children) {
            t.Ft();
            t.context.vpa.Ot();
        }
        this.children.length = 0;
    }
    getTitle(t) {
        const e = [ ...this.children.map((e => e.getTitle(t))), typeof this.title === "function" ? this.title.call(void 0, this) : this.title ].filter((t => t !== null));
        return e.length === 0 ? null : e.join(t);
    }
    computeAbsolutePath() {
        if (this.context.isRoot) {
            return "";
        }
        const t = this.context.parent.node.computeAbsolutePath();
        const e = this.instruction.toUrlComponent(false);
        return t.length > 0 ? e.length > 0 ? `${t}/${e}` : t : e;
    }
    Ht(t) {
        this.jt = t;
        for (const e of this.children) {
            e.Ht(t);
        }
    }
    Gt() {
        this.Ut = true;
        const t = this.children.map((t => t.Gt()));
        const e = this.instruction.I();
        e.children.splice(0, e.children.length, ...t);
        return this.instruction = e;
    }
    I() {
        const t = new RouteNode(this.path, this.finalPath, this.context, this.Bt, this.instruction, {
            ...this.params
        }, new URLSearchParams(this.queryParams), this.fragment, {
            ...this.data
        }, this.Dt, this.title, this.component, this.children.map((t => t.I())), [ ...this.residue ]);
        t.zt = this.zt + 1;
        if (t.context.node === this) {
            t.context.node = t;
        }
        return t;
    }
    toString() {
        const t = [];
        const e = this.context?.config.component?.name ?? "";
        if (e.length > 0) {
            t.push(`c:'${e}'`);
        }
        const s = this.context?.config.path ?? "";
        if (s.length > 0) {
            t.push(`path:'${s}'`);
        }
        if (this.children.length > 0) {
            t.push(`children:[${this.children.map(String).join(",")}]`);
        }
        if (this.residue.length > 0) {
            t.push(`residue:${this.residue.map((function(t) {
                if (typeof t === "string") {
                    return `'${t}'`;
                }
                return String(t);
            })).join(",")}`);
        }
        return `RN(ctx:'${this.context?.gt}',${t.join(",")})`;
    }
}

class RouteTree {
    constructor(t, e, s, i) {
        this.options = t;
        this.queryParams = e;
        this.fragment = s;
        this.root = i;
    }
    contains(t, e) {
        return this.root.contains(t, e);
    }
    I() {
        const t = new RouteTree(this.options.I(), new URLSearchParams(this.queryParams), this.fragment, this.root.I());
        t.root.Ht(this);
        return t;
    }
    Wt() {
        return new ViewportInstructionTree(this.options, true, this.root.children.map((t => t.Gt())), this.queryParams, this.fragment);
    }
    toString() {
        return this.root.toString();
    }
}

function createAndAppendNodes(t, s, i) {
    t.trace(`createAndAppendNodes(node:%s,vi:%s`, s, i);
    switch (i.component.type) {
      case 0:
        switch (i.component.value) {
          case "..":
            s = s.context.parent?.node ?? s;
            s.Ft();

          case ".":
            return e.onResolveAll(...i.children.map((e => createAndAppendNodes(t, s, e))));

          default:
            {
                t.trace(`createAndAppendNodes invoking createNode`);
                const n = s.context;
                const r = i.I();
                let o = i.recognizedRoute;
                if (o !== null) return appendNode(t, s, createConfiguredNode(t, s, i, o, r));
                if (i.children.length === 0) {
                    const e = n.Yt(i);
                    if (e !== null) {
                        s.jt.queryParams = mergeURLSearchParams(s.jt.queryParams, e.query, true);
                        const n = e.vi;
                        n.children.push(...i.children);
                        return appendNode(t, s, createConfiguredNode(t, s, n, n.recognizedRoute, i));
                    }
                }
                let c = 0;
                let a = i.component.value;
                let u = i;
                while (u.children.length === 1) {
                    u = u.children[0];
                    if (u.component.type === 0) {
                        ++c;
                        a = `${a}/${u.component.value}`;
                    } else {
                        break;
                    }
                }
                o = n.recognize(a);
                t.trace("createNode recognized route: %s", o);
                const h = o?.residue ?? null;
                t.trace("createNode residue:", h);
                const l = h === null;
                if (o === null || h === a) {
                    const r = n.Yt({
                        component: i.component.value,
                        params: i.params ?? e.emptyObject,
                        open: i.open,
                        close: i.close,
                        viewport: i.viewport,
                        children: i.children.slice()
                    });
                    if (r !== null) {
                        s.jt.queryParams = mergeURLSearchParams(s.jt.queryParams, r.query, true);
                        return appendNode(t, s, createConfiguredNode(t, s, r.vi, r.vi.recognizedRoute, i));
                    }
                    const o = i.component.value;
                    if (o === "") return;
                    let c = i.viewport;
                    if (c === null || c.length === 0) c = E;
                    const a = n.getFallbackViewportAgent(c);
                    const u = a !== null ? a.viewport.et(i, s, n) : n.config.et(i, s, n);
                    if (u === null) throw new UnknownRouteError(getMessage(3401, o, n.gt, c, o, n.component.name));
                    if (typeof u === "string") {
                        t.trace(`Fallback is set to '${u}'. Looking for a recognized route.`);
                        const e = n.childRoutes.find((t => t.id === u));
                        if (e !== void 0) return appendNode(t, s, createFallbackNode(t, e, s, i));
                        t.trace(`No route configuration for the fallback '${u}' is found; trying to recognize the route.`);
                        const r = n.recognize(u, true);
                        if (r !== null && r.residue !== u) return appendNode(t, s, createConfiguredNode(t, s, i, r, null));
                    }
                    t.trace(`The fallback '${u}' is not recognized as a route; treating as custom element name.`);
                    return e.onResolve(resolveRouteConfiguration(u, false, n.config, null, n), (e => appendNode(t, s, createFallbackNode(t, e, s, i))));
                }
                o.residue = null;
                i.component.value = l ? a : a.slice(0, -(h.length + 1));
                let f = !l;
                for (let t = 0; t < c; ++t) {
                    const t = i.children[0];
                    if (h?.startsWith(t.component.value) ?? false) {
                        f = false;
                        break;
                    }
                    i.viewport = t.viewport;
                    i.children = t.children;
                }
                if (f) {
                    i.children.unshift(ViewportInstruction.create(h));
                }
                i.recognizedRoute = o;
                t.trace("createNode after adjustment vi:%s", i);
                return appendNode(t, s, createConfiguredNode(t, s, i, o, r));
            }
        }

      case 3:
      case 4:
      case 2:
        {
            const n = s.context;
            return e.onResolve(resolveCustomElementDefinition(i.component.value, n)[1], (r => {
                const {vi: o, query: c} = n.Yt({
                    component: r,
                    params: i.params ?? e.emptyObject,
                    open: i.open,
                    close: i.close,
                    viewport: i.viewport,
                    children: i.children.slice()
                });
                s.jt.queryParams = mergeURLSearchParams(s.jt.queryParams, c, true);
                return appendNode(t, s, createConfiguredNode(t, s, o, o.recognizedRoute, i));
            }));
        }
    }
}

function createConfiguredNode(t, s, i, n, r, o = n.route.endpoint.route) {
    const c = s.context;
    const a = s.jt;
    return e.onResolve(o.handler, (u => {
        o.handler = u;
        t.trace(`creatingConfiguredNode(rdc:%s, vi:%s)`, u, i);
        if (u.redirectTo === null) {
            const h = (i.viewport?.length ?? 0) > 0;
            const l = h ? i.viewport : u.viewport;
            return e.onResolve(resolveCustomElementDefinition(u.component, c)[1], (f => {
                const p = c.Qt(new ViewportRequest(l, f.name));
                if (!h) {
                    i.viewport = p.viewport.name;
                }
                const d = c.container.get(g);
                return e.onResolve(d.getRouteContext(p, f, null, p.hostController.container, c.config, c, u), (e => {
                    t.trace("createConfiguredNode setting the context node");
                    const c = e.node = RouteNode.create({
                        path: n.route.endpoint.route.path,
                        finalPath: o.path,
                        context: e,
                        instruction: i,
                        originalInstruction: r,
                        params: {
                            ...n.route.params
                        },
                        queryParams: a.queryParams,
                        fragment: a.fragment,
                        data: u.data,
                        Dt: l,
                        component: f,
                        title: u.title,
                        residue: i.children.slice()
                    });
                    c.Ht(s.jt);
                    t.trace(`createConfiguredNode(vi:%s) -> %s`, i, c);
                    return c;
                }));
            }));
        }
        const h = RouteExpression.parse(o.path, false);
        const l = RouteExpression.parse(u.redirectTo, false);
        let f;
        let p;
        const d = [];
        switch (h.root.kind) {
          case 2:
          case 4:
            f = h.root;
            break;

          default:
            throw new Error(getMessage(3502, h.root.kind));
        }
        switch (l.root.kind) {
          case 2:
          case 4:
            p = l.root;
            break;

          default:
            throw new Error(getMessage(3502, l.root.kind));
        }
        let w;
        let v;
        let m = false;
        let x = false;
        while (!(m && x)) {
            if (m) {
                w = null;
            } else if (f.kind === 4) {
                w = f;
                m = true;
            } else if (f.left.kind === 4) {
                w = f.left;
                switch (f.right.kind) {
                  case 2:
                  case 4:
                    f = f.right;
                    break;

                  default:
                    throw new Error(getMessage(3502, f.right.kind));
                }
            } else {
                throw new Error(getMessage(3502, f.left.kind));
            }
            if (x) {
                v = null;
            } else if (p.kind === 4) {
                v = p;
                x = true;
            } else if (p.left.kind === 4) {
                v = p.left;
                switch (p.right.kind) {
                  case 2:
                  case 4:
                    p = p.right;
                    break;

                  default:
                    throw new Error(getMessage(3502, p.right.kind));
                }
            } else {
                throw new Error(getMessage(3502, p.left.kind));
            }
            if (v !== null) {
                if (v.component.isDynamic && (w?.component.isDynamic ?? false)) {
                    d.push(n.route.params[v.component.parameterName]);
                } else {
                    d.push(v.raw);
                }
            }
        }
        const E = d.filter(Boolean).join("/");
        const R = c.recognize(E);
        if (R === null) throw new UnknownRouteError(getMessage(3402, E, c.gt, E, c.component.name));
        return createConfiguredNode(t, s, ViewportInstruction.create({
            recognizedRoute: R,
            component: E,
            children: i.children,
            viewport: i.viewport,
            open: i.open,
            close: i.close
        }), R, r);
    }));
}

function appendNode(t, s, i) {
    return e.onResolve(i, (e => {
        t.trace(`appendNode($childNode:%s)`, e);
        s.qt(e);
        return e.context.vpa.Vt(s.jt.options, e);
    }));
}

function createFallbackNode(t, s, n, r) {
    const o = new $RecognizedRoute(new i.RecognizedRoute(new i.Endpoint(new i.ConfigurableRoute(s.path[0], s.caseSensitive, s), []), e.emptyObject), null);
    r.children.length = 0;
    return createConfiguredNode(t, n, r, o, null);
}

const d = Object.freeze(new URLSearchParams);

function isManagedState(e) {
    return t.isObject(e) && Object.prototype.hasOwnProperty.call(e, r) === true;
}

function toManagedState(t, e) {
    return {
        ...t,
        [r]: e
    };
}

class UnknownRouteError extends Error {}

class Transition {
    get erredWithUnknownRoute() {
        return this.Jt;
    }
    constructor(t, e, s, i, n, r, o, c, a, u, h, l, f, p, d) {
        this.id = t;
        this.prevInstructions = e;
        this.instructions = s;
        this.finalInstructions = i;
        this.instructionsChanged = n;
        this.trigger = r;
        this.options = o;
        this.managedState = c;
        this.previousRouteTree = a;
        this.routeTree = u;
        this.promise = h;
        this.resolve = l;
        this.reject = f;
        this.guardsResult = p;
        this.error = d;
        this.Jt = false;
    }
    static K(t) {
        return new Transition(t.id, t.prevInstructions, t.instructions, t.finalInstructions, t.instructionsChanged, t.trigger, t.options, t.managedState, t.previousRouteTree, t.routeTree, t.promise, t.resolve, t.reject, t.guardsResult, void 0);
    }
    $t(t, e) {
        if (this.guardsResult !== true) {
            return;
        }
        try {
            const s = t();
            if (s instanceof Promise) {
                s.then(e).catch((t => {
                    this.bt(t);
                }));
            } else {
                e(s);
            }
        } catch (t) {
            this.bt(t);
        }
    }
    bt(t) {
        this.Jt = t instanceof UnknownRouteError;
        this.reject(this.error = t);
    }
    toString() {
        return `T(id:${this.id},trigger:'${this.trigger}',instructions:${this.instructions})`;
    }
}

const g = /*@__PURE__*/ e.DI.createInterface("IRouter", (t => t.singleton(Router)));

class Router {
    get Kt() {
        const t = this.Xt;
        if (t !== null) return t;
        if (!this.c.has(y, true)) throw new Error(getMessage(3271));
        return this.Xt = this.c.get(y);
    }
    get routeTree() {
        let t = this.Zt;
        if (t === null) {
            const e = this.Kt;
            t = this.Zt = new RouteTree(NavigationOptions.create(this.options, {}), d, null, RouteNode.create({
                path: "",
                finalPath: "",
                context: e,
                instruction: null,
                component: s.CustomElement.getDefinition(e.config.component),
                title: e.config.title
            }));
        }
        return t;
    }
    get currentTr() {
        let t = this.te;
        if (t === null) {
            t = this.te = Transition.K({
                id: 0,
                prevInstructions: this.ee,
                instructions: this.ee,
                finalInstructions: this.ee,
                instructionsChanged: true,
                trigger: "api",
                options: NavigationOptions.create(this.options, {}),
                managedState: null,
                previousRouteTree: this.routeTree.I(),
                routeTree: this.routeTree,
                resolve: null,
                reject: null,
                promise: null,
                guardsResult: true,
                error: void 0
            });
        }
        return t;
    }
    set currentTr(t) {
        this.te = t;
    }
    get isNavigating() {
        return this.se;
    }
    constructor() {
        this.Xt = null;
        this.Zt = null;
        this.te = null;
        this.ie = false;
        this.ne = 0;
        this.re = null;
        this.oe = null;
        this.ce = false;
        this.se = false;
        this.c = e.resolve(e.IContainer);
        this.ae = e.resolve(s.IPlatform);
        this.B = e.resolve(e.ILogger).root.scopeTo("Router");
        this.A = e.resolve(o);
        this.ue = e.resolve(a);
        this.options = e.resolve(n);
        this.he = new Map;
        this.ee = ViewportInstructionTree.create("", this.options);
        this.c.registerResolver(Router, e.Registration.instance(Router, this));
    }
    le(t) {
        return RouteContext.resolve(this.Kt, t);
    }
    start(t) {
        this.ce = typeof this.options.buildTitle === "function";
        this.ue.startListening();
        this.oe = this.A.subscribe("au:router:location-change", (t => {
            this.ae.taskQueue.queueTask((() => {
                const e = isManagedState(t.state) ? t.state : null;
                const s = this.options;
                const i = NavigationOptions.create(s, {
                    historyStrategy: "replace"
                });
                const n = ViewportInstructionTree.create(t.url, s, i, this.Kt);
                this.fe(n, t.trigger, e, null);
            }));
        }));
        if (!this.ie && t) {
            return this.load(this.ue.getPath(), {
                historyStrategy: "replace"
            });
        }
    }
    stop() {
        this.ue.stopListening();
        this.oe?.dispose();
    }
    load(t, e) {
        const s = this.createViewportInstructions(t, e);
        return this.fe(s, "api", null, null);
    }
    isActive(t, e) {
        const s = this.le(e);
        const i = t instanceof ViewportInstructionTree ? t : this.createViewportInstructions(t, {
            context: s,
            historyStrategy: this.options.historyStrategy
        });
        return this.routeTree.contains(i, {
            matchEndpoint: false
        });
    }
    getRouteContext(t, s, i, n, r, o, c) {
        return e.onResolve(c instanceof RouteConfig ? c : resolveRouteConfiguration(typeof i?.getRouteConfig === "function" ? i : s.Type, false, r, null, o), (e => {
            let i = this.he.get(t);
            if (i === void 0) {
                this.he.set(t, i = new WeakMap);
            }
            let r = i.get(e);
            if (r !== void 0) {
                return r;
            }
            const o = n.has(y, true) ? n.get(y) : null;
            i.set(e, r = new RouteContext(t, o, s, e, n, this));
            return r;
        }));
    }
    createViewportInstructions(t, e) {
        if (t instanceof ViewportInstructionTree) return t;
        let s = e?.context ?? null;
        if (typeof t === "string") {
            t = this.ue.removeBaseHref(t);
        }
        const i = isPartialViewportInstruction(t);
        let n = i ? t.component : t;
        if (typeof n === "string" && n.startsWith("../") && s !== null) {
            s = this.le(s);
            while (n.startsWith("../") && (s?.parent ?? null) !== null) {
                n = n.slice(3);
                s = s.parent;
            }
        }
        if (i) {
            t.component = n;
        } else {
            t = n;
        }
        const r = this.options;
        return ViewportInstructionTree.create(t, r, NavigationOptions.create(r, {
            ...e,
            context: s
        }), this.Kt);
    }
    fe(t, e, s, i) {
        const n = this.currentTr;
        const r = this.B;
        if (e !== "api" && n.trigger === "api" && n.instructions.equals(t)) {
            return true;
        }
        let o = void 0;
        let c = void 0;
        let a;
        const u = this.options.restorePreviousRouteTreeOnError;
        if (i === null || i.erredWithUnknownRoute || i.error != null && u) {
            a = new Promise((function(t, e) {
                o = t;
                c = e;
            }));
        } else {
            a = i.promise;
            o = i.resolve;
            c = i.reject;
        }
        const h = this.re = Transition.K({
            id: ++this.ne,
            trigger: e,
            managedState: s,
            prevInstructions: n.finalInstructions,
            finalInstructions: t,
            instructionsChanged: !n.finalInstructions.equals(t),
            instructions: t,
            options: t.options,
            promise: a,
            resolve: o,
            reject: c,
            previousRouteTree: this.routeTree,
            routeTree: this.Zt = this.routeTree.I(),
            guardsResult: true,
            error: void 0
        });
        if (!this.se) {
            try {
                this.$t(h);
            } catch (t) {
                h.bt(t);
            }
        }
        return h.promise.then((t => t)).catch((t => {
            error(r, 3270, h, t);
            if (h.erredWithUnknownRoute) {
                this.pe(h);
            } else {
                this.se = false;
                this.A.publish(new NavigationErrorEvent(h.id, h.instructions, t));
                if (u) {
                    this.pe(h);
                } else {
                    const t = this.re;
                    if (t !== null) {
                        t.previousRouteTree = h.previousRouteTree;
                    } else {
                        this.Zt = h.previousRouteTree;
                    }
                }
            }
            throw t;
        }));
    }
    $t(t) {
        this.currentTr = t;
        this.re = null;
        this.se = true;
        let s = this.le(t.options.context);
        this.A.publish(new NavigationStartEvent(t.id, t.instructions, t.trigger, t.managedState));
        if (this.re !== null) {
            return this.$t(this.re);
        }
        t.$t((() => {
            const i = t.finalInstructions;
            const n = this.Kt;
            const r = t.routeTree;
            r.options = i.options;
            r.queryParams = n.node.jt.queryParams = i.queryParams;
            r.fragment = n.node.jt.fragment = i.fragment;
            const o = /*@__PURE__*/ s.container.get(e.ILogger).scopeTo("RouteTree");
            if (i.isAbsolute) {
                s = n;
            }
            if (s === n) {
                r.root.Ht(r);
                n.node = r.root;
            }
            const c = s.allResolved instanceof Promise ? " - awaiting promise" : "";
            o.trace(`updateRouteTree(rootCtx:%s,rt:%s,vit:%s)${c}`, n, r, i);
            return e.onResolve(s.allResolved, (() => updateNode(o, i, s, n.node)));
        }), (() => {
            const e = t.previousRouteTree.root.children;
            const s = t.routeTree.root.children;
            const i = mergeDistinct(e, s);
            Batch.C((s => {
                for (const i of e) {
                    i.context.vpa.Ct(t, s);
                }
            })).$((e => {
                if (t.guardsResult !== true) {
                    e._();
                    this.pe(t);
                }
            })).$((e => {
                for (const i of s) {
                    i.context.vpa._t(t, e);
                }
            })).$((e => {
                if (t.guardsResult !== true) {
                    e._();
                    this.pe(t);
                }
            })).$((s => {
                for (const i of e) {
                    i.context.vpa.kt(t, s);
                }
            })).$((e => {
                for (const i of s) {
                    i.context.vpa.Tt(t, e);
                }
            })).$((e => {
                for (const s of i) {
                    s.context.vpa.At(t, e);
                }
            })).$((() => {
                i.forEach((function(t) {
                    t.context.vpa.Lt();
                }));
                this.ie = true;
                this.ee = t.finalInstructions = t.routeTree.Wt();
                this.se = false;
                const e = t.finalInstructions.toUrl(true, this.options.useUrlFragmentHash);
                switch (t.options.P(this.ee)) {
                  case "none":
                    break;

                  case "push":
                    this.ue.pushState(toManagedState(t.options.state, t.id), this.updateTitle(t), e);
                    break;

                  case "replace":
                    this.ue.replaceState(toManagedState(t.options.state, t.id), this.updateTitle(t), e);
                    break;
                }
                this.A.publish(new NavigationEndEvent(t.id, t.instructions, this.ee));
                t.resolve(true);
                this.de();
            })).C();
        }));
    }
    updateTitle(t = this.currentTr) {
        let e;
        if (this.ce) {
            e = this.options.buildTitle(t) ?? "";
        } else {
            switch (typeof t.options.title) {
              case "function":
                e = t.options.title.call(void 0, t.routeTree.root) ?? "";
                break;

              case "string":
                e = t.options.title;
                break;

              default:
                e = t.routeTree.root.getTitle(t.options.titleSeparator) ?? "";
                break;
            }
        }
        if (e.length > 0) {
            this.ae.document.title = e;
        }
        return this.ae.document.title;
    }
    pe(t) {
        const s = t.previousRouteTree.root.children;
        const i = t.routeTree.root.children;
        const n = mergeDistinct(s, i);
        n.forEach((function(t) {
            t.context.vpa.Ot();
        }));
        this.ee = t.prevInstructions;
        this.Zt = t.previousRouteTree;
        this.se = false;
        const r = t.guardsResult;
        this.A.publish(new NavigationCancelEvent(t.id, t.instructions, `guardsResult is ${r}`));
        if (r === false) {
            t.resolve(false);
            this.de();
        } else {
            let s;
            if (this.ie && (t.erredWithUnknownRoute || t.error != null && this.options.restorePreviousRouteTreeOnError)) s = t.prevInstructions; else if (r === true) return; else s = r;
            void e.onResolve(this.fe(s, "api", t.managedState, t), (() => {}));
        }
    }
    de() {
        if (this.re === null) return;
        this.ae.taskQueue.queueTask((() => {
            const t = this.re;
            if (t === null) return;
            try {
                this.$t(t);
            } catch (e) {
                t.bt(e);
            }
        }));
    }
}

function updateNode(t, s, i, n) {
    t.trace(`updateNode(ctx:%s,node:%s)`, i, n);
    n.queryParams = s.queryParams;
    n.fragment = s.fragment;
    if (!n.context.isRoot) {
        n.context.vpa.Vt(n.jt.options, n);
    }
    if (n.context === i) {
        n.Ft();
        return e.onResolve(e.onResolveAll(...s.children.map((e => createAndAppendNodes(t, n, e)))), (() => e.onResolveAll(...i.getAvailableViewportAgents().reduce(((e, s) => {
            const i = s.viewport;
            const r = i.default;
            if (r === null) return e;
            e.push(createAndAppendNodes(t, n, ViewportInstruction.create({
                component: r,
                viewport: i.name
            })));
            return e;
        }), []))));
    }
    return e.onResolveAll(...n.children.map((e => updateNode(t, s, i, e))));
}

const w = [ "?", "#", "/", "+", "(", ")", ".", "@", "!", "=", ",", "&", "'", "~", ";" ];

class ParserState {
    get u() {
        return this.ge.length === 0;
    }
    constructor(t) {
        this.we = t;
        this.ve = [];
        this.me = 0;
        this.xe = 0;
        this.ge = t;
    }
    Ee(...t) {
        const e = this.ge;
        return t.some((function(t) {
            return e.startsWith(t);
        }));
    }
    Re(t) {
        if (this.Ee(t)) {
            this.ge = this.ge.slice(t.length);
            this.xe += t.length;
            this.ye(t);
            return true;
        }
        return false;
    }
    Se(t) {
        if (!this.Re(t)) {
            this.Ce(`'${t}'`);
        }
    }
    Ce(t) {
        throw new Error(getMessage(3500, t, this.xe, this.we, this.ge, this.ge));
    }
    be() {
        if (!this.u) {
            throw new Error(getMessage(3501, this.ge, this.xe, this.we));
        }
    }
    _e() {
        const t = this.ge[0];
        this.ge = this.ge.slice(1);
        ++this.xe;
        this.ye(t);
    }
    Ne() {
        this.ve[this.me++] = "";
    }
    ke() {
        const t = --this.me;
        const e = this.ve;
        const s = e[t];
        e[t] = "";
        return s;
    }
    Te() {
        this.ve[--this.me] = "";
    }
    ye(t) {
        const e = this.me;
        const s = this.ve;
        for (let i = 0; i < e; ++i) {
            s[i] += t;
        }
    }
}

exports.ExpressionKind = void 0;

(function(t) {
    t[t["Route"] = 0] = "Route";
    t[t["CompositeSegment"] = 1] = "CompositeSegment";
    t[t["ScopedSegment"] = 2] = "ScopedSegment";
    t[t["SegmentGroup"] = 3] = "SegmentGroup";
    t[t["Segment"] = 4] = "Segment";
    t[t["Component"] = 5] = "Component";
    t[t["Action"] = 6] = "Action";
    t[t["Viewport"] = 7] = "Viewport";
    t[t["ParameterList"] = 8] = "ParameterList";
    t[t["Parameter"] = 9] = "Parameter";
})(exports.ExpressionKind || (exports.ExpressionKind = {}));

const v = new Map;

const m = new Map;

class RouteExpression {
    get kind() {
        return 0;
    }
    constructor(t, e, s, i, n, r) {
        this.raw = t;
        this.isAbsolute = e;
        this.root = s;
        this.queryParams = i;
        this.fragment = n;
        this.fragmentIsRoute = r;
    }
    static parse(t, e) {
        const s = e ? v : m;
        let i = s.get(t);
        if (i === void 0) {
            s.set(t, i = RouteExpression.$e(t, e));
        }
        return i;
    }
    static $e(t, e) {
        let s = null;
        const i = t.indexOf("#");
        if (i >= 0) {
            const n = t.slice(i + 1);
            s = decodeURIComponent(n);
            if (e) {
                t = s;
            } else {
                t = t.slice(0, i);
            }
        }
        let n = null;
        const r = t.indexOf("?");
        if (r >= 0) {
            const e = t.slice(r + 1);
            t = t.slice(0, r);
            n = new URLSearchParams(e);
        }
        if (t === "") {
            return new RouteExpression("", false, SegmentExpression.EMPTY, n != null ? Object.freeze(n) : d, s, e);
        }
        const o = new ParserState(t);
        o.Ne();
        const c = o.Re("/");
        const a = CompositeSegmentExpression.Ie(o);
        o.be();
        const u = o.ke();
        return new RouteExpression(u, c, a, n != null ? Object.freeze(n) : d, s, e);
    }
    toInstructionTree(t) {
        return new ViewportInstructionTree(t, this.isAbsolute, this.root.Pe(0, 0), mergeURLSearchParams(this.queryParams, t.queryParams, true), this.fragment ?? t.fragment);
    }
    toString() {
        return this.raw;
    }
}

class CompositeSegmentExpression {
    get kind() {
        return 1;
    }
    constructor(t, e) {
        this.raw = t;
        this.siblings = e;
    }
    static Ie(t) {
        t.Ne();
        const e = t.Re("+");
        const s = [];
        do {
            s.push(ScopedSegmentExpression.Ie(t));
        } while (t.Re("+"));
        if (!e && s.length === 1) {
            t.Te();
            return s[0];
        }
        const i = t.ke();
        return new CompositeSegmentExpression(i, s);
    }
    Pe(t, e) {
        switch (this.siblings.length) {
          case 0:
            return [];

          case 1:
            return this.siblings[0].Pe(t, e);

          case 2:
            return [ ...this.siblings[0].Pe(t, 0), ...this.siblings[1].Pe(0, e) ];

          default:
            return [ ...this.siblings[0].Pe(t, 0), ...this.siblings.slice(1, -1).flatMap((function(t) {
                return t.Pe(0, 0);
            })), ...this.siblings[this.siblings.length - 1].Pe(0, e) ];
        }
    }
    toString() {
        return this.raw;
    }
}

class ScopedSegmentExpression {
    get kind() {
        return 2;
    }
    constructor(t, e, s) {
        this.raw = t;
        this.left = e;
        this.right = s;
    }
    static Ie(t) {
        t.Ne();
        const e = SegmentGroupExpression.Ie(t);
        if (t.Re("/")) {
            const s = ScopedSegmentExpression.Ie(t);
            const i = t.ke();
            return new ScopedSegmentExpression(i, e, s);
        }
        t.Te();
        return e;
    }
    Pe(t, e) {
        const s = this.left.Pe(t, 0);
        const i = this.right.Pe(0, e);
        let n = s[s.length - 1];
        while (n.children.length > 0) {
            n = n.children[n.children.length - 1];
        }
        n.children.push(...i);
        return s;
    }
    toString() {
        return this.raw;
    }
}

class SegmentGroupExpression {
    get kind() {
        return 3;
    }
    constructor(t, e) {
        this.raw = t;
        this.expression = e;
    }
    static Ie(t) {
        t.Ne();
        if (t.Re("(")) {
            const e = CompositeSegmentExpression.Ie(t);
            t.Se(")");
            const s = t.ke();
            return new SegmentGroupExpression(s, e);
        }
        t.Te();
        return SegmentExpression.Ie(t);
    }
    Pe(t, e) {
        return this.expression.Pe(t + 1, e + 1);
    }
    toString() {
        return this.raw;
    }
}

class SegmentExpression {
    get kind() {
        return 4;
    }
    static get EMPTY() {
        return new SegmentExpression("", ComponentExpression.EMPTY, ActionExpression.EMPTY, ViewportExpression.EMPTY, true);
    }
    constructor(t, e, s, i, n) {
        this.raw = t;
        this.component = e;
        this.action = s;
        this.viewport = i;
        this.scoped = n;
    }
    static Ie(t) {
        t.Ne();
        const e = ComponentExpression.Ie(t);
        const s = ActionExpression.Ie(t);
        const i = ViewportExpression.Ie(t);
        const n = !t.Re("!");
        const r = t.ke();
        return new SegmentExpression(r, e, s, i, n);
    }
    Pe(t, e) {
        return [ ViewportInstruction.create({
            component: this.component.name,
            params: this.component.parameterList.Ae(),
            viewport: this.viewport.name,
            open: t,
            close: e
        }) ];
    }
    toString() {
        return this.raw;
    }
}

class ComponentExpression {
    get kind() {
        return 5;
    }
    static get EMPTY() {
        return new ComponentExpression("", "", ParameterListExpression.EMPTY);
    }
    constructor(t, e, s) {
        this.raw = t;
        this.name = e;
        this.parameterList = s;
        switch (e.charAt(0)) {
          case ":":
            this.isParameter = true;
            this.isStar = false;
            this.isDynamic = true;
            this.parameterName = e.slice(1);
            break;

          case "*":
            this.isParameter = false;
            this.isStar = true;
            this.isDynamic = true;
            this.parameterName = e.slice(1);
            break;

          default:
            this.isParameter = false;
            this.isStar = false;
            this.isDynamic = false;
            this.parameterName = e;
            break;
        }
    }
    static Ie(t) {
        t.Ne();
        t.Ne();
        if (!t.u) {
            if (t.Ee("./")) {
                t._e();
            } else if (t.Ee("../")) {
                t._e();
                t._e();
            } else {
                while (!t.u && !t.Ee(...w)) {
                    t._e();
                }
            }
        }
        const e = decodeURIComponent(t.ke());
        if (e.length === 0) {
            t.Ce("component name");
        }
        const s = ParameterListExpression.Ie(t);
        const i = t.ke();
        return new ComponentExpression(i, e, s);
    }
    toString() {
        return this.raw;
    }
}

class ActionExpression {
    get kind() {
        return 6;
    }
    static get EMPTY() {
        return new ActionExpression("", "", ParameterListExpression.EMPTY);
    }
    constructor(t, e, s) {
        this.raw = t;
        this.name = e;
        this.parameterList = s;
    }
    static Ie(t) {
        t.Ne();
        let e = "";
        if (t.Re(".")) {
            t.Ne();
            while (!t.u && !t.Ee(...w)) {
                t._e();
            }
            e = decodeURIComponent(t.ke());
            if (e.length === 0) {
                t.Ce("method name");
            }
        }
        const s = ParameterListExpression.Ie(t);
        const i = t.ke();
        return new ActionExpression(i, e, s);
    }
    toString() {
        return this.raw;
    }
}

class ViewportExpression {
    get kind() {
        return 7;
    }
    static get EMPTY() {
        return new ViewportExpression("", "");
    }
    constructor(t, e) {
        this.raw = t;
        this.name = e;
    }
    static Ie(t) {
        t.Ne();
        let e = null;
        if (t.Re("@")) {
            t.Ne();
            while (!t.u && !t.Ee(...w)) {
                t._e();
            }
            e = decodeURIComponent(t.ke());
            if (e.length === 0) {
                t.Ce("viewport name");
            }
        }
        const s = t.ke();
        return new ViewportExpression(s, e);
    }
    toString() {
        return this.raw;
    }
}

class ParameterListExpression {
    get kind() {
        return 8;
    }
    static get EMPTY() {
        return new ParameterListExpression("", []);
    }
    constructor(t, e) {
        this.raw = t;
        this.expressions = e;
    }
    static Ie(t) {
        t.Ne();
        const e = [];
        if (t.Re("(")) {
            do {
                e.push(ParameterExpression.Ie(t, e.length));
                if (!t.Re(",")) {
                    break;
                }
            } while (!t.u && !t.Ee(")"));
            t.Se(")");
        }
        const s = t.ke();
        return new ParameterListExpression(s, e);
    }
    Ae() {
        const t = {};
        for (const e of this.expressions) {
            t[e.key] = e.value;
        }
        return t;
    }
    toString() {
        return this.raw;
    }
}

class ParameterExpression {
    get kind() {
        return 9;
    }
    static get EMPTY() {
        return new ParameterExpression("", "", "");
    }
    constructor(t, e, s) {
        this.raw = t;
        this.key = e;
        this.value = s;
    }
    static Ie(t, e) {
        t.Ne();
        t.Ne();
        while (!t.u && !t.Ee(...w)) {
            t._e();
        }
        let s = decodeURIComponent(t.ke());
        if (s.length === 0) {
            t.Ce("parameter key");
        }
        let i;
        if (t.Re("=")) {
            t.Ne();
            while (!t.u && !t.Ee(...w)) {
                t._e();
            }
            i = decodeURIComponent(t.ke());
            if (i.length === 0) {
                t.Ce("parameter value");
            }
        } else {
            i = s;
            s = e.toString();
        }
        const n = t.ke();
        return new ParameterExpression(n, s, i);
    }
    toString() {
        return this.raw;
    }
}

const x = Object.freeze({
    RouteExpression: RouteExpression,
    CompositeSegmentExpression: CompositeSegmentExpression,
    ScopedSegmentExpression: ScopedSegmentExpression,
    SegmentGroupExpression: SegmentGroupExpression,
    SegmentExpression: SegmentExpression,
    ComponentExpression: ComponentExpression,
    ActionExpression: ActionExpression,
    ViewportExpression: ViewportExpression,
    ParameterListExpression: ParameterListExpression,
    ParameterExpression: ParameterExpression
});

const E = "default";

class ViewportInstruction {
    constructor(t, e, s, i, n, r, o) {
        this.open = t;
        this.close = e;
        this.recognizedRoute = s;
        this.component = i;
        this.viewport = n;
        this.params = r;
        this.children = o;
    }
    static create(t) {
        if (t instanceof ViewportInstruction) return t;
        if (isPartialViewportInstruction(t)) {
            const e = TypedNavigationInstruction.create(t.component);
            const s = t.children?.map(ViewportInstruction.create) ?? [];
            return new ViewportInstruction(t.open ?? 0, t.close ?? 0, t.recognizedRoute ?? null, e, t.viewport ?? null, t.params ?? null, s);
        }
        const e = TypedNavigationInstruction.create(t);
        return new ViewportInstruction(0, 0, null, e, null, null, []);
    }
    contains(t) {
        const e = this.children;
        const s = t.children;
        if (e.length < s.length) {
            return false;
        }
        if (!this.component.equals(t.component)) return false;
        const i = this.viewport ?? null;
        const n = t.viewport ?? null;
        if (i !== null && n !== null && i !== n) return false;
        for (let t = 0, i = s.length; t < i; ++t) {
            if (!e[t].contains(s[t])) {
                return false;
            }
        }
        return true;
    }
    equals(t) {
        const e = this.children;
        const s = t.children;
        if (e.length !== s.length) {
            return false;
        }
        if (!this.component.equals(t.component) || this.viewport !== t.viewport || !shallowEquals(this.params, t.params)) {
            return false;
        }
        for (let t = 0, i = e.length; t < i; ++t) {
            if (!e[t].equals(s[t])) {
                return false;
            }
        }
        return true;
    }
    I() {
        return new ViewportInstruction(this.open, this.close, this.recognizedRoute, this.component.I(), this.viewport, this.params === null ? null : {
            ...this.params
        }, [ ...this.children ]);
    }
    toUrlComponent(t = true) {
        const e = this.component.toUrlComponent();
        const s = this.params === null || Object.keys(this.params).length === 0 ? "" : `(${stringifyParams(this.params)})`;
        const i = this.viewport;
        const n = e.length === 0 || i === null || i.length === 0 || i === E ? "" : `@${i}`;
        const r = `${"(".repeat(this.open)}${e}${s}${n}${")".repeat(this.close)}`;
        const o = t ? this.children.map((t => t.toUrlComponent())).join("+") : "";
        if (r.length > 0) {
            if (o.length > 0) {
                return [ r, o ].join("/");
            }
            return r;
        }
        return o;
    }
    toString() {
        const t = `c:${this.component}`;
        const e = this.viewport === null || this.viewport.length === 0 ? "" : `viewport:${this.viewport}`;
        const s = this.children.length === 0 ? "" : `children:[${this.children.map(String).join(",")}]`;
        const i = [ t, e, s ].filter(Boolean).join(",");
        return `VPI(${i})`;
    }
}

function stringifyParams(t) {
    const s = Object.keys(t);
    const i = Array(s.length);
    const n = [];
    const r = [];
    for (const t of s) {
        if (e.isArrayIndex(t)) {
            n.push(Number(t));
        } else {
            r.push(t);
        }
    }
    for (let e = 0; e < s.length; ++e) {
        const s = n.indexOf(e);
        if (s > -1) {
            i[e] = t[e];
            n.splice(s, 1);
        } else {
            const s = r.shift();
            i[e] = `${s}=${t[s]}`;
        }
    }
    return i.join(",");
}

class ViewportInstructionTree {
    constructor(t, e, s, i, n) {
        this.options = t;
        this.isAbsolute = e;
        this.children = s;
        this.queryParams = i;
        this.fragment = n;
    }
    static create(t, s, i, n) {
        const r = NavigationOptions.create(s, {
            ...i
        });
        let o = r.context;
        if (!(o instanceof RouteContext) && n != null) {
            o = r.context = RouteContext.resolve(n, o);
        }
        const c = o != null;
        if (t instanceof Array) {
            const s = t.length;
            const i = new Array(s);
            const n = new URLSearchParams(r.queryParams ?? e.emptyObject);
            for (let e = 0; e < s; e++) {
                const s = t[e];
                const r = c ? o.Yt(s) : null;
                if (r !== null) {
                    i[e] = r.vi;
                    mergeURLSearchParams(n, r.query, false);
                } else {
                    i[e] = ViewportInstruction.create(s);
                }
            }
            return new ViewportInstructionTree(r, false, i, n, r.fragment);
        }
        if (typeof t === "string") {
            const e = RouteExpression.parse(t, s.useUrlFragmentHash);
            return e.toInstructionTree(r);
        }
        const a = c ? o.Yt(isPartialViewportInstruction(t) ? {
            ...t,
            params: t.params ?? e.emptyObject
        } : {
            component: t,
            params: e.emptyObject
        }) : null;
        const u = new URLSearchParams(r.queryParams ?? e.emptyObject);
        return a !== null ? new ViewportInstructionTree(r, false, [ a.vi ], mergeURLSearchParams(u, a.query, false), r.fragment) : new ViewportInstructionTree(r, false, [ ViewportInstruction.create(t) ], u, r.fragment);
    }
    equals(t) {
        const e = this.children;
        const s = t.children;
        if (e.length !== s.length) {
            return false;
        }
        for (let t = 0, i = e.length; t < i; ++t) {
            if (!e[t].equals(s[t])) {
                return false;
            }
        }
        return true;
    }
    toUrl(t, e) {
        let s;
        let i;
        let n = "";
        if (!t) {
            const t = [];
            let e = this.options.context;
            if (e != null && !(e instanceof RouteContext)) throw new Error("Invalid operation; incompatible navigation context.");
            while (e != null && !e.isRoot) {
                const s = e.vpa;
                const i = s.it === 4096 ? s.ht : s.lt;
                if (i == null) throw new Error("Invalid operation; nodes of the viewport agent are not set.");
                t.splice(0, 0, i.instruction.toUrlComponent());
                e = e.parent;
            }
            if (t[0] === "") {
                t.splice(0, 1);
            }
            n = t.join("/");
        }
        const r = this.toPath();
        if (e) {
            s = "";
            i = n.length > 0 ? `#${n}/${r}` : `#${r}`;
        } else {
            s = n.length > 0 ? `${n}/${r}` : r;
            const t = this.fragment;
            i = t !== null && t.length > 0 ? `#${t}` : "";
        }
        let o = this.queryParams.toString();
        o = o === "" ? "" : `?${o}`;
        return `${s}${o}${i}`;
    }
    toPath() {
        return this.children.map((t => t.toUrlComponent())).join("+");
    }
    toString() {
        return `[${this.children.map(String).join(",")}]`;
    }
}

var R;

(function(t) {
    t[t["string"] = 0] = "string";
    t[t["ViewportInstruction"] = 1] = "ViewportInstruction";
    t[t["CustomElementDefinition"] = 2] = "CustomElementDefinition";
    t[t["Promise"] = 3] = "Promise";
    t[t["IRouteViewModel"] = 4] = "IRouteViewModel";
})(R || (R = {}));

class TypedNavigationInstruction {
    constructor(t, e) {
        this.type = t;
        this.value = e;
    }
    static create(e) {
        if (e instanceof TypedNavigationInstruction) {
            return e;
        }
        if (typeof e === "string") return new TypedNavigationInstruction(0, e);
        if (!t.isObject(e)) expectType("function/class or object", "", e);
        if (typeof e === "function") {
            if (s.CustomElement.isType(e)) {
                const t = s.CustomElement.getDefinition(e);
                return new TypedNavigationInstruction(2, t);
            } else {
                return TypedNavigationInstruction.create(e());
            }
        }
        if (e instanceof Promise) return new TypedNavigationInstruction(3, e);
        if (isPartialViewportInstruction(e)) {
            const t = ViewportInstruction.create(e);
            return new TypedNavigationInstruction(1, t);
        }
        if (s.isCustomElementViewModel(e)) return new TypedNavigationInstruction(4, e);
        if (e instanceof s.CustomElementDefinition) return new TypedNavigationInstruction(2, e);
        throw new Error(getMessage(3400, tryStringify(e)));
    }
    equals(t) {
        switch (this.type) {
          case 2:
          case 4:
          case 3:
          case 0:
            return this.type === t.type && this.value === t.value;

          case 1:
            return this.type === t.type && this.value.equals(t.value);
        }
    }
    I() {
        return new TypedNavigationInstruction(this.type, this.value);
    }
    toUrlComponent() {
        switch (this.type) {
          case 2:
            return this.value.name;

          case 4:
          case 3:
            throw new Error(getMessage(3403, this.type));

          case 1:
            return this.value.toUrlComponent();

          case 0:
            return this.value;
        }
    }
    toString() {
        switch (this.type) {
          case 2:
            return `CEDef(name:'${this.value.name}')`;

          case 3:
            return `Promise`;

          case 4:
            return `VM(name:'${s.CustomElement.getDefinition(this.value.constructor).name}')`;

          case 1:
            return this.value.toString();

          case 0:
            return `'${this.value}'`;
        }
    }
}

class ComponentAgent {
    constructor(t, s, i, n, r) {
        this.Ve = t;
        this.Me = s;
        this.Mt = i;
        this.Kt = n;
        this.Oe = r;
        this.B = n.container.get(e.ILogger).scopeTo(`ComponentAgent<${n.gt}>`);
        const o = s.lifecycleHooks;
        this.Le = (o.canLoad ?? []).map((t => t.instance));
        this.je = (o.loading ?? []).map((t => t.instance));
        this.Ue = (o.canUnload ?? []).map((t => t.instance));
        this.Be = (o.unloading ?? []).map((t => t.instance));
        this.De = "canLoad" in t;
        this.ze = "loading" in t;
        this.qe = "canUnload" in t;
        this.He = "unloading" in t;
    }
    vt(t, e) {
        if (t === null) {
            return this.Me.activate(this.Me, e);
        }
        void this.Me.activate(t, e);
    }
    Rt(t, e) {
        if (t === null) {
            return this.Me.deactivate(this.Me, e);
        }
        void this.Me.deactivate(t, e);
    }
    It() {
        this.Me.dispose();
    }
    Ct(t, e, s) {
        s._();
        let i = Promise.resolve();
        for (const n of this.Ue) {
            s._();
            i = i.then((() => new Promise((i => {
                if (t.guardsResult !== true) {
                    s.N();
                    i();
                    return;
                }
                t.$t((() => n.canUnload(this.Ve, e, this.Mt)), (e => {
                    if (t.guardsResult === true && e !== true) {
                        t.guardsResult = false;
                    }
                    s.N();
                    i();
                }));
            }))));
        }
        if (this.qe) {
            s._();
            i = i.then((() => {
                if (t.guardsResult !== true) {
                    s.N();
                    return;
                }
                t.$t((() => this.Ve.canUnload(e, this.Mt)), (e => {
                    if (t.guardsResult === true && e !== true) {
                        t.guardsResult = false;
                    }
                    s.N();
                }));
            }));
        }
        s.N();
    }
    _t(t, e, s) {
        const i = this.Kt.root;
        s._();
        let n = Promise.resolve();
        for (const r of this.Le) {
            s._();
            n = n.then((() => new Promise((n => {
                if (t.guardsResult !== true) {
                    s.N();
                    n();
                    return;
                }
                t.$t((() => r.canLoad(this.Ve, e.params, e, this.Mt)), (e => {
                    if (t.guardsResult === true && e !== true) {
                        t.guardsResult = e === false ? false : ViewportInstructionTree.create(e, this.Oe, void 0, i);
                    }
                    s.N();
                    n();
                }));
            }))));
        }
        if (this.De) {
            s._();
            n = n.then((() => {
                if (t.guardsResult !== true) {
                    s.N();
                    return;
                }
                t.$t((() => this.Ve.canLoad(e.params, e, this.Mt)), (e => {
                    if (t.guardsResult === true && e !== true) {
                        t.guardsResult = e === false ? false : ViewportInstructionTree.create(e, this.Oe, void 0, i);
                    }
                    s.N();
                }));
            }));
        }
        s.N();
    }
    kt(t, e, s) {
        s._();
        for (const i of this.Be) {
            t.$t((() => {
                s._();
                return i.unloading(this.Ve, e, this.Mt);
            }), (() => {
                s.N();
            }));
        }
        if (this.He) {
            t.$t((() => {
                s._();
                return this.Ve.unloading(e, this.Mt);
            }), (() => {
                s.N();
            }));
        }
        s.N();
    }
    Tt(t, e, s) {
        s._();
        for (const i of this.je) {
            t.$t((() => {
                s._();
                return i.loading(this.Ve, e.params, e, this.Mt);
            }), (() => {
                s.N();
            }));
        }
        if (this.ze) {
            t.$t((() => {
                s._();
                return this.Ve.loading(e.params, e, this.Mt);
            }), (() => {
                s.N();
            }));
        }
        s.N();
    }
}

const y = /*@__PURE__*/ e.DI.createInterface("IRouteContext");

const S = Object.freeze([ "string", "object", "function" ]);

function isEagerInstruction(t) {
    if (t == null) return false;
    const e = t.params;
    const s = t.component;
    return typeof e === "object" && e !== null && s != null && S.includes(typeof s) && !(s instanceof Promise);
}

class RouteContext {
    get isRoot() {
        return this.parent === null;
    }
    get depth() {
        return this.path.length - 1;
    }
    get allResolved() {
        return this.Fe;
    }
    get node() {
        const t = this.Ge;
        if (t === null) throw new Error(getMessage(3171, this));
        return t;
    }
    set node(t) {
        const e = this.We = this.Ge;
        if (e !== t) {
            this.Ge = t;
        }
    }
    get vpa() {
        const t = this.Ye;
        if (t === null) throw new Error(getMessage(3172, this));
        return t;
    }
    get navigationModel() {
        return this.Qe;
    }
    constructor(t, n, r, c, a, u) {
        this.parent = n;
        this.component = r;
        this.config = c;
        this.Je = u;
        this.Ke = [];
        this.childRoutes = [];
        this.Fe = null;
        this.We = null;
        this.Ge = null;
        this.Xe = false;
        this.Ye = t;
        if (n === null) {
            this.root = this;
            this.path = [ this ];
            this.gt = r.name;
        } else {
            this.root = n.root;
            this.path = [ ...n.path, this ];
            this.gt = `${n.gt}/${r.name}`;
        }
        this.B = a.get(e.ILogger).scopeTo(`RouteContext<${this.gt}>`);
        this.Ze = a.get(e.IModuleLoader);
        const h = this.container = a.createChild();
        h.registerResolver(s.IController, this.ts = new e.InstanceProvider, true);
        const l = new e.InstanceProvider("IRouteContext", this);
        h.registerResolver(y, l);
        h.registerResolver(RouteContext, l);
        h.register(c);
        this.es = new i.RouteRecognizer;
        if (u.options.useNavigationModel) {
            const t = this.Qe = new NavigationModel([]);
            h.get(o).subscribe("au:router:navigation-end", (() => t.ss(u, this)));
        } else {
            this.Qe = null;
        }
        this.ns(c);
    }
    ns(t) {
        const s = [];
        const i = t.routes ?? u;
        const n = i.length;
        if (n === 0) {
            const e = t.component.prototype?.getRouteConfig;
            this.Xe = e == null ? true : typeof e !== "function";
            return;
        }
        const r = this.Qe;
        const o = r !== null;
        let c = 0;
        for (;c < n; c++) {
            const n = i[c];
            if (n instanceof Promise) {
                s.push(this.rs(n));
                continue;
            }
            const a = resolveRouteConfiguration(n, true, t, null, this);
            if (a instanceof Promise) {
                if (!isPartialChildRouteConfig(n) || n.path == null) throw new Error(getMessage(3173));
                for (const t of ensureArrayOfStrings(n.path)) {
                    this.os(t, n.caseSensitive ?? false, a);
                }
                const t = this.childRoutes.length;
                const i = a.then((e => this.childRoutes[t] = e));
                this.childRoutes.push(i);
                if (o) {
                    r.rs(i);
                }
                s.push(i.then(e.noop));
                continue;
            }
            for (const t of a.path ?? e.emptyArray) {
                this.os(t, a.caseSensitive, a);
            }
            this.childRoutes.push(a);
            if (o) {
                r.rs(a);
            }
        }
        this.Xe = true;
        if (s.length > 0) {
            this.Fe = Promise.all(s).then((() => {
                this.Fe = null;
            }));
        }
    }
    static setRoot(t) {
        const i = t.get(e.ILogger).scopeTo("RouteContext");
        if (!t.has(s.IAppRoot, true)) {
            logAndThrow(new Error(getMessage(3167)), i);
        }
        if (t.has(y, true)) {
            logAndThrow(new Error(getMessage(3168)), i);
        }
        const {controller: n} = t.get(s.IAppRoot);
        if (n === void 0) {
            logAndThrow(new Error(getMessage(3169)), i);
        }
        const r = t.get(g);
        return e.onResolve(r.getRouteContext(null, n.definition, n.viewModel, n.container, null, null, null), (s => {
            t.register(e.Registration.instance(y, s));
            s.node = r.routeTree.root;
        }));
    }
    static resolve(t, i) {
        const n = t.container;
        const r = n.get(e.ILogger).scopeTo("RouteContext");
        if (i == null) {
            return t;
        }
        if (i instanceof RouteContext) {
            return i;
        }
        if (i instanceof n.get(s.IPlatform).Node) {
            try {
                const t = s.CustomElement.for(i, {
                    searchParents: true
                });
                return t.container.get(y);
            } catch (t) {
                error(r, 3155, i.nodeName, t);
                throw t;
            }
        }
        if (s.isCustomElementViewModel(i)) {
            const t = i.$controller;
            return t.container.get(y);
        }
        if (s.isCustomElementController(i)) {
            const t = i;
            return t.container.get(y);
        }
        logAndThrow(new Error(getMessage(3170, Object.prototype.toString.call(i))), r);
    }
    dispose() {
        this.container.dispose();
    }
    Qt(t) {
        const e = this.Ke.find((e => e.yt(t)));
        if (e === void 0) throw new Error(getMessage(3174, t, this.cs()));
        return e;
    }
    getAvailableViewportAgents() {
        return this.Ke.filter((t => t.St()));
    }
    getFallbackViewportAgent(t) {
        return this.Ke.find((e => e.St() && e.viewport.name === t && e.viewport.fallback !== "")) ?? null;
    }
    Nt(t, i) {
        this.ts.prepare(t);
        const n = this.container;
        const r = n.get(i.component.key);
        const o = this.Xe ? void 0 : e.onResolve(resolveRouteConfiguration(r, false, this.config, i, null), (t => this.ns(t)));
        return e.onResolve(o, (() => {
            const e = s.Controller.$el(n, r, t.host, null);
            const o = new ComponentAgent(r, e, i, this, this.Je.options);
            this.ts.dispose();
            return o;
        }));
    }
    us(t) {
        const e = ViewportAgent.for(t, this);
        if (this.Ke.includes(e)) {
            return e;
        }
        this.Ke.push(e);
        return e;
    }
    ls(t) {
        const e = ViewportAgent.for(t, this);
        if (!this.Ke.includes(e)) {
            return;
        }
        this.Ke.splice(this.Ke.indexOf(e), 1);
    }
    recognize(t, e = false) {
        let s = this;
        let n = true;
        let r = null;
        while (n) {
            r = s.es.recognize(t);
            if (r === null) {
                if (!e || s.isRoot) return null;
                s = s.parent;
            } else {
                n = false;
            }
        }
        return new $RecognizedRoute(r, Reflect.has(r.params, i.RESIDUE) ? r.params[i.RESIDUE] ?? null : null);
    }
    rs(t) {
        return e.onResolve(resolveRouteConfiguration(t, true, this.config, null, this), (t => {
            for (const s of t.path ?? e.emptyArray) {
                this.os(s, t.caseSensitive, t);
            }
            this.Qe?.rs(t);
            this.childRoutes.push(t);
        }));
    }
    os(t, e, s) {
        this.es.add({
            path: t,
            caseSensitive: e,
            handler: s
        }, true);
    }
    st(t) {
        return this.Ze.load(t, (s => {
            const i = s.raw;
            if (typeof i === "function") {
                const t = e.Protocol.resource.getAll(i).find(isCustomElementDefinition);
                if (t !== void 0) return t;
            }
            let n = void 0;
            let r = void 0;
            for (const t of s.items) {
                if (t.isConstructable) {
                    const e = t.definitions.find(isCustomElementDefinition);
                    if (e !== void 0) {
                        if (t.key === "default") {
                            n = e;
                        } else if (r === void 0) {
                            r = e;
                        }
                    }
                }
            }
            if (n === void 0 && r === void 0) throw new Error(getMessage(3175, t));
            return r ?? n;
        }));
    }
    Yt(t) {
        if (!isEagerInstruction(t)) return null;
        const e = t.component;
        let s;
        let n = false;
        if (e instanceof RouteConfig) {
            s = e.path;
            n = true;
        } else if (typeof e === "string") {
            const t = this.childRoutes.find((t => t.id === e));
            if (t === void 0) return null;
            s = t.path;
        } else if (e.type === 0) {
            const t = this.childRoutes.find((t => t.id === e.value));
            if (t === void 0) return null;
            s = t.path;
        } else {
            const t = resolveCustomElementDefinition(e, this)[1];
            s = this.childRoutes.reduce(((e, s) => {
                if (s.component === t.Type) {
                    e.push(...s.path);
                }
                return e;
            }), []);
            n = true;
        }
        if (s === void 0) return null;
        const r = t.params;
        const o = this.es;
        const c = s.length;
        const a = [];
        let u = null;
        if (c === 1) {
            const e = core(s[0]);
            if (e === null) {
                if (n) throw new Error(getMessage(3166, t, a));
                return null;
            }
            return {
                vi: ViewportInstruction.create({
                    recognizedRoute: new $RecognizedRoute(new i.RecognizedRoute(e.endpoint, e.consumed), null),
                    component: e.path,
                    children: t.children,
                    viewport: t.viewport,
                    open: t.open,
                    close: t.close
                }),
                query: e.query
            };
        }
        let h = 0;
        for (let t = 0; t < c; t++) {
            const e = core(s[t]);
            if (e === null) continue;
            if (u === null) {
                u = e;
                h = Object.keys(e.consumed).length;
            } else if (Object.keys(e.consumed).length > h) {
                u = e;
            }
        }
        if (u === null) {
            if (n) throw new Error(getMessage(3166, t, a));
            return null;
        }
        return {
            vi: ViewportInstruction.create({
                recognizedRoute: new $RecognizedRoute(new i.RecognizedRoute(u.endpoint, u.consumed), null),
                component: u.path,
                children: t.children,
                viewport: t.viewport,
                open: t.open,
                close: t.close
            }),
            query: u.query
        };
        function core(t) {
            const e = o.getEndpoint(t);
            if (e === null) {
                a.push(`No endpoint found for the path: '${t}'.`);
                return null;
            }
            const s = Object.create(null);
            for (const i of e.params) {
                const e = i.name;
                let n = r[e];
                if (n == null || String(n).length === 0) {
                    if (!i.isOptional) {
                        a.push(`No value for the required parameter '${e}' is provided for the path: '${t}'.`);
                        return null;
                    }
                    n = "";
                } else {
                    s[e] = n;
                }
                const o = i.isStar ? `*${e}` : i.isOptional ? `:${e}?` : `:${e}`;
                t = t.replace(o, n);
            }
            const i = Object.keys(s);
            const n = Object.fromEntries(Object.entries(r).filter((([t]) => !i.includes(t))));
            return {
                path: t.replace(/\/\//g, "/"),
                endpoint: e,
                consumed: s,
                query: n
            };
        }
    }
    toString() {
        const t = this.Ke;
        const e = t.map(String).join(",");
        return `RC(path:'${this.gt}',viewports:[${e}])`;
    }
    cs() {
        const t = [];
        for (let e = 0; e < this.path.length; ++e) {
            t.push(`${" ".repeat(e)}${this.path[e]}`);
        }
        return t.join("\n");
    }
}

function isCustomElementDefinition(t) {
    return s.CustomElement.isType(t.Type);
}

class $RecognizedRoute {
    constructor(t, e) {
        this.route = t;
        this.residue = e;
    }
    toString() {
        return "RR";
    }
}

class NavigationModel {
    constructor(t) {
        this.routes = t;
        this.ps = void 0;
    }
    resolve() {
        return e.onResolve(this.ps, e.noop);
    }
    ss(t, s) {
        void e.onResolve(this.ps, (() => {
            for (const e of this.routes) {
                e.ss(t, s);
            }
        }));
    }
    rs(t) {
        const s = this.routes;
        if (!(t instanceof Promise)) {
            if (t.nav ?? false) {
                s.push(NavigationRoute.K(t));
            }
            return;
        }
        const i = s.length;
        s.push(void 0);
        let n = void 0;
        n = this.ps = e.onResolve(this.ps, (() => e.onResolve(t, (t => {
            if (t.nav) {
                s[i] = NavigationRoute.K(t);
            } else {
                s.splice(i, 1);
            }
            if (this.ps === n) {
                this.ps = void 0;
            }
        }))));
    }
}

class NavigationRoute {
    constructor(t, e, s, i, n) {
        this.id = t;
        this.path = e;
        this.redirectTo = s;
        this.title = i;
        this.data = n;
        this.ds = null;
    }
    static K(t) {
        return new NavigationRoute(t.id, ensureArrayOfStrings(t.path ?? e.emptyArray), t.redirectTo, t.title, t.data);
    }
    get isActive() {
        return this.rt;
    }
    ss(t, s) {
        let n = this.ds;
        if (n === null) {
            const r = t.options;
            n = this.ds = this.path.map((t => {
                const n = s.es.getEndpoint(t);
                if (n === null) throw new Error(getMessage(3450, t));
                return new ViewportInstructionTree(NavigationOptions.create(r, {
                    context: s
                }), false, [ ViewportInstruction.create({
                    recognizedRoute: new $RecognizedRoute(new i.RecognizedRoute(n, e.emptyObject), null),
                    component: t
                }) ], d, null);
            }));
        }
        this.rt = n.some((e => t.routeTree.contains(e, {
            matchEndpoint: true,
            matchOriginalInstruction: this.redirectTo !== null
        })));
    }
}

function __decorate(t, e, s, i) {
    var n = arguments.length, r = n < 3 ? e : i === null ? i = Object.getOwnPropertyDescriptor(e, s) : i, o;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(t, e, s, i); else for (var c = t.length - 1; c >= 0; c--) if (o = t[c]) r = (n < 3 ? o(r) : n > 3 ? o(e, s, r) : o(e, s)) || r;
    return n > 3 && r && Object.defineProperty(e, s, r), r;
}

exports.ViewportCustomElement = class ViewportCustomElement {
    constructor() {
        this.name = E;
        this.usedBy = "";
        this.default = "";
        this.fallback = "";
        this.gs = void 0;
        this.Me = void 0;
        this.Kt = e.resolve(y);
        this.B = e.resolve(e.ILogger).scopeTo(`au-viewport<${this.Kt.gt}>`);
    }
    et(t, e, i) {
        const n = this.fallback;
        return typeof n === "function" && !s.CustomElement.isType(n) ? n(t, e, i) : n;
    }
    hydrated(t) {
        this.Me = t;
        this.gs = this.Kt.us(this);
    }
    attaching(t, e) {
        return this.gs.wt(t, this.Me);
    }
    detaching(t, e) {
        return this.gs.Et(t, this.Me);
    }
    dispose() {
        this.Kt.ls(this);
        this.gs.It();
        this.gs = void 0;
    }
    toString() {
        const t = [];
        for (const e of C) {
            const s = this[e];
            switch (typeof s) {
              case "string":
                if (s !== "") {
                    t.push(`${e}:'${s}'`);
                }
                break;

              case "boolean":
                if (s) {
                    t.push(`${e}:${s}`);
                }
                break;

              default:
                {
                    t.push(`${e}:${String(s)}`);
                }
            }
        }
        return `VP(ctx:'${this.Kt.gt}',${t.join(",")})`;
    }
};

__decorate([ s.bindable ], exports.ViewportCustomElement.prototype, "name", void 0);

__decorate([ s.bindable ], exports.ViewportCustomElement.prototype, "usedBy", void 0);

__decorate([ s.bindable ], exports.ViewportCustomElement.prototype, "default", void 0);

__decorate([ s.bindable ], exports.ViewportCustomElement.prototype, "fallback", void 0);

exports.ViewportCustomElement = __decorate([ s.customElement({
    name: "au-viewport"
}) ], exports.ViewportCustomElement);

const C = [ "name", "usedBy", "default", "fallback" ];

exports.LoadCustomAttribute = class LoadCustomAttribute {
    constructor() {
        this.ws = e.resolve(s.INode);
        this.Je = e.resolve(g);
        this.Kt = e.resolve(y);
        this.A = e.resolve(o);
        this.ue = e.resolve(a);
        this.attribute = "href";
        this.active = false;
        this.vs = null;
        this.ee = null;
        this.xs = null;
        this.onClick = t => {
            if (this.ee === null) {
                return;
            }
            if (t.altKey || t.ctrlKey || t.shiftKey || t.metaKey || t.button !== 0) {
                return;
            }
            t.preventDefault();
            void this.Je.load(this.ee, {
                context: this.context
            });
        };
        const t = this.ws;
        this.Es = !t.hasAttribute("external") && !t.hasAttribute("data-external");
        this.Rs = this.Je.options.activeClass;
    }
    binding() {
        if (this.Es) {
            this.ws.addEventListener("click", this.onClick);
        }
        this.valueChanged();
        this.xs = this.A.subscribe("au:router:navigation-end", (t => {
            const e = this.active = this.ee !== null && this.Je.isActive(this.ee, this.context);
            const s = this.Rs;
            if (s === null) return;
            this.ws.classList.toggle(s, e);
        }));
    }
    attaching() {
        const t = this.context;
        const e = t.allResolved;
        if (e !== null) {
            return e.then((() => {
                this.valueChanged();
            }));
        }
    }
    unbinding() {
        if (this.Es) {
            this.ws.removeEventListener("click", this.onClick);
        }
        this.xs.dispose();
    }
    valueChanged() {
        const t = this.Je;
        const e = t.options.useUrlFragmentHash;
        const i = this.route;
        let n = this.context;
        if (n === void 0) {
            n = this.context = this.Kt;
        } else if (n === null) {
            n = this.context = this.Kt.root;
        }
        if (i != null && n.allResolved === null) {
            const s = this.params;
            const r = this.ee = t.createViewportInstructions(typeof s === "object" && s !== null ? {
                component: i,
                params: s
            } : i, {
                context: n
            });
            this.vs = r.toUrl(false, e);
        } else {
            this.ee = null;
            this.vs = null;
        }
        const r = s.CustomElement.for(this.ws, {
            optional: true
        });
        if (r !== null) {
            r.viewModel[this.attribute] = this.ee;
        } else {
            if (this.vs === null) {
                this.ws.removeAttribute(this.attribute);
            } else {
                const t = e ? this.vs : this.ue.addBaseHref(this.vs);
                this.ws.setAttribute(this.attribute, t);
            }
        }
    }
};

__decorate([ s.bindable({
    mode: 2,
    primary: true,
    callback: "valueChanged"
}) ], exports.LoadCustomAttribute.prototype, "route", void 0);

__decorate([ s.bindable({
    mode: 2,
    callback: "valueChanged"
}) ], exports.LoadCustomAttribute.prototype, "params", void 0);

__decorate([ s.bindable({
    mode: 2
}) ], exports.LoadCustomAttribute.prototype, "attribute", void 0);

__decorate([ s.bindable({
    mode: 4
}) ], exports.LoadCustomAttribute.prototype, "active", void 0);

__decorate([ s.bindable({
    mode: 2,
    callback: "valueChanged"
}) ], exports.LoadCustomAttribute.prototype, "context", void 0);

exports.LoadCustomAttribute = __decorate([ s.customAttribute("load") ], exports.LoadCustomAttribute);

exports.HrefCustomAttribute = class HrefCustomAttribute {
    get ys() {
        return this.ws.hasAttribute("external") || this.ws.hasAttribute("data-external");
    }
    constructor() {
        this.ws = e.resolve(s.INode);
        this.Je = e.resolve(g);
        this.Kt = e.resolve(y);
        this.Ss = false;
        if (this.Je.options.useHref && this.ws.nodeName === "A") {
            const t = e.resolve(s.IWindow).name;
            switch (this.ws.getAttribute("target")) {
              case null:
              case t:
              case "_self":
                this.Es = true;
                break;

              default:
                this.Es = false;
                break;
            }
        } else {
            this.Es = false;
        }
    }
    binding() {
        if (!this.Ss) {
            this.Ss = true;
            this.Es = this.Es && s.getRef(this.ws, s.CustomAttribute.getDefinition(exports.LoadCustomAttribute).key) === null;
        }
        this.valueChanged(this.value);
        this.ws.addEventListener("click", this);
    }
    unbinding() {
        this.ws.removeEventListener("click", this);
    }
    valueChanged(t) {
        if (t == null) {
            this.ws.removeAttribute("href");
        } else {
            if (this.Je.options.useUrlFragmentHash && this.Kt.isRoot && !/^[.#]/.test(t)) {
                t = `#${t}`;
            }
            this.ws.setAttribute("href", t);
        }
    }
    handleEvent(t) {
        this.Cs(t);
    }
    Cs(t) {
        if (t.altKey || t.ctrlKey || t.shiftKey || t.metaKey || t.button !== 0 || this.ys || !this.Es) {
            return;
        }
        const e = this.ws.getAttribute("href");
        if (e !== null) {
            t.preventDefault();
            void this.Je.load(e, {
                context: this.Kt
            });
        }
    }
};

__decorate([ s.bindable({
    mode: 2
}) ], exports.HrefCustomAttribute.prototype, "value", void 0);

exports.HrefCustomAttribute = __decorate([ s.customAttribute({
    name: "href",
    noMultiBindings: true
}) ], exports.HrefCustomAttribute);

const b = g;

const _ = [ b ];

const N = exports.ViewportCustomElement;

const k = exports.LoadCustomAttribute;

const T = exports.HrefCustomAttribute;

const $ = [ exports.ViewportCustomElement, exports.LoadCustomAttribute, exports.HrefCustomAttribute ];

function configure(i, r) {
    let o = null;
    if (t.isObject(r)) {
        o = r.basePath ?? null;
    } else {
        r = {};
    }
    const a = RouterOptions.create(r);
    return i.register(e.Registration.cachedCallback(c, ((t, e, i) => {
        const n = t.get(s.IWindow);
        const r = new URL(n.document.baseURI);
        r.pathname = normalizePath(o ?? r.pathname);
        return r;
    })), e.Registration.instance(n, a), e.Registration.instance(RouterOptions, a), s.AppTask.hydrated(e.IContainer, RouteContext.setRoot), s.AppTask.activated(g, (t => t.start(true))), s.AppTask.deactivated(g, (t => {
        t.stop();
    })), ..._, ...$);
}

const I = {
    register(t) {
        return configure(t);
    },
    customize(t) {
        return {
            register(e) {
                return configure(e, t);
            }
        };
    }
};

class ScrollState {
    constructor(t) {
        this.ws = t;
        this.bs = t.scrollTop;
        this._s = t.scrollLeft;
    }
    static Ns(t) {
        return t.scrollTop > 0 || t.scrollLeft > 0;
    }
    ks() {
        this.ws.scrollTo(this._s, this.bs);
        this.ws = null;
    }
}

function restoreState(t) {
    t.ks();
}

class HostElementState {
    constructor(t) {
        this.Ts = [];
        this.$s(t.children);
    }
    $s(t) {
        let e;
        for (let s = 0, i = t.length; s < i; ++s) {
            e = t[s];
            if (ScrollState.Ns(e)) {
                this.Ts.push(new ScrollState(e));
            }
            this.$s(e.children);
        }
    }
    ks() {
        this.Ts.forEach(restoreState);
        this.Ts = null;
    }
}

const P = /*@__PURE__*/ e.DI.createInterface("IStateManager", (t => t.singleton(ScrollStateManager)));

class ScrollStateManager {
    constructor() {
        this.Is = new WeakMap;
    }
    saveState(t) {
        this.Is.set(t.host, new HostElementState(t.host));
    }
    restoreState(t) {
        const e = this.Is.get(t.host);
        if (e !== void 0) {
            e.ks();
            this.Is.delete(t.host);
        }
    }
}

exports.AST = x;

exports.ActionExpression = ActionExpression;

exports.AuNavId = r;

exports.ComponentExpression = ComponentExpression;

exports.CompositeSegmentExpression = CompositeSegmentExpression;

exports.DefaultComponents = _;

exports.DefaultResources = $;

exports.HrefCustomAttributeRegistration = T;

exports.ILocationManager = a;

exports.IRouteContext = y;

exports.IRouter = g;

exports.IRouterEvents = o;

exports.IRouterOptions = n;

exports.IStateManager = P;

exports.LoadCustomAttributeRegistration = k;

exports.LocationChangeEvent = LocationChangeEvent;

exports.NavigationCancelEvent = NavigationCancelEvent;

exports.NavigationEndEvent = NavigationEndEvent;

exports.NavigationErrorEvent = NavigationErrorEvent;

exports.NavigationOptions = NavigationOptions;

exports.NavigationStartEvent = NavigationStartEvent;

exports.ParameterExpression = ParameterExpression;

exports.ParameterListExpression = ParameterListExpression;

exports.Route = h;

exports.RouteConfig = RouteConfig;

exports.RouteContext = RouteContext;

exports.RouteExpression = RouteExpression;

exports.RouteNode = RouteNode;

exports.RouteTree = RouteTree;

exports.Router = Router;

exports.RouterConfiguration = I;

exports.RouterOptions = RouterOptions;

exports.RouterRegistration = b;

exports.ScopedSegmentExpression = ScopedSegmentExpression;

exports.SegmentExpression = SegmentExpression;

exports.SegmentGroupExpression = SegmentGroupExpression;

exports.Transition = Transition;

exports.ViewportAgent = ViewportAgent;

exports.ViewportCustomElementRegistration = N;

exports.ViewportExpression = ViewportExpression;

exports.isManagedState = isManagedState;

exports.route = route;

exports.toManagedState = toManagedState;
//# sourceMappingURL=index.cjs.map
