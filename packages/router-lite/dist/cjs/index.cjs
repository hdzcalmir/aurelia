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
        this.h = false;
        this.u = null;
        this.R = s ?? this;
    }
    static C(t) {
        return new Batch(0, t, null);
    }
    _() {
        let t = this;
        do {
            ++t.t;
            t = t.u;
        } while (t !== null);
    }
    N() {
        let t = this;
        do {
            if (--t.t === 0) {
                t.T();
            }
            t = t.u;
        } while (t !== null);
    }
    T() {
        const t = this.i;
        if (t !== null) {
            this.i = null;
            t(this);
            this.h = true;
        }
    }
    $(t) {
        if (this.u === null) {
            return this.u = new Batch(this.t, t, this.R);
        } else {
            return this.u.$(t);
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
            const t = this.A["j"];
            t.splice(t.indexOf(this), 1);
        }
    }
}

const o = /*@__PURE__*/ e.DI.createInterface("IRouterEvents", (t => t.singleton(RouterEvents)));

class RouterEvents {
    constructor() {
        this.L = 0;
        this.j = [];
        this.U = e.resolve(e.IEventAggregator);
        this.B = e.resolve(e.ILogger).scopeTo("RouterEvents");
    }
    publish(t) {
        this.U.publish(t.name, t);
    }
    subscribe(t, e) {
        const s = new Subscription(this, ++this.L, this.U.subscribe(t, (t => {
            e(t);
        })));
        this.j.push(s);
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

const h = e.emptyArray;

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
    constructor(t, e, s, i, n, r, o, c, a, h, u, l) {
        this.id = t;
        this.Y = e;
        this.title = s;
        this.redirectTo = i;
        this.caseSensitive = n;
        this.transitionPlan = r;
        this.viewport = o;
        this.data = c;
        this.routes = a;
        this.fallback = h;
        this.component = u;
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
            const a = s?.viewport ?? x;
            const u = s?.data ?? {};
            const l = s?.routes ?? h;
            return new RouteConfig(r, e, o, i, n, c, a, u, l, s?.fallback ?? null, s, s?.nav ?? true);
        } else if (typeof t === "object") {
            const i = t;
            validateRouteConfig(i, "");
            const n = ensureArrayOfStrings(i.path ?? s?.path ?? e.emptyArray);
            const r = i.title ?? s?.title ?? null;
            const o = i.redirectTo ?? s?.redirectTo ?? null;
            const c = i.caseSensitive ?? s?.caseSensitive ?? false;
            const a = i.id ?? s?.id ?? (n instanceof Array ? n[0] : n);
            const u = i.transitionPlan ?? s?.transitionPlan ?? null;
            const l = i.viewport ?? s?.viewport ?? x;
            const f = {
                ...s?.data,
                ...i.data
            };
            const p = [ ...i.routes ?? h, ...s?.routes ?? h ];
            return new RouteConfig(a, n, r, o, c, u, l, f, p, i.fallback ?? s?.fallback ?? null, i.component ?? s ?? null, i.nav ?? true);
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

const u = {
    name: e.Protocol.resource.keyFor("route-configuration"),
    isConfigured(e) {
        return t.Metadata.hasOwn(u.name, e);
    },
    configure(e, s) {
        const i = RouteConfig.K(e, s);
        t.Metadata.define(u.name, i, s);
        return s;
    },
    getConfig(e) {
        if (!u.isConfigured(e)) {
            u.configure({}, e);
        }
        return t.Metadata.getOwn(u.name, e);
    }
};

function route(t) {
    return function(e) {
        return u.configure(t, e);
    };
}

function resolveRouteConfiguration(t, s, i, n, r) {
    if (isPartialRedirectRouteConfig(t)) return RouteConfig.K(t, null);
    const [o, c] = resolveCustomElementDefinition(t, r);
    return e.onResolve(c, (r => {
        const c = r.Type;
        const a = u.getConfig(c);
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
        this.ht = "replace";
        this.ut = null;
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
                return e.C().h ? void 0 : s;
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
                return e.C().h ? void 0 : s;
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
        if (s !== x && i !== s) {
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
    bt(t, s) {
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
                for (const s of this.ut.children) {
                    s.context.vpa.bt(t, e);
                }
            })).$((e => {
                switch (this.it) {
                  case 4096:
                    switch (this.ht) {
                      case "none":
                        this.it = 1024;
                        return;

                      case "invoke-lifecycles":
                      case "replace":
                        this.it = 2048;
                        e._();
                        Batch.C((e => {
                            this.ot.bt(t, this.lt, e);
                        })).$((() => {
                            this.it = 1024;
                            e.N();
                        })).C();
                        return;
                    }

                  case 8192:
                    return;

                  default:
                    t.Ct(new Error(`Unexpected state at canUnload of ${this}`));
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
                switch (this.ht) {
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
            switch (this.ht) {
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
            for (const s of this.ut.children) {
                s.context.vpa.kt(t, e);
            }
        })).$((s => {
            switch (this.it) {
              case 1024:
                switch (this.ht) {
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
                for (const s of this.ut.children) {
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
                    switch (this.ht) {
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
            switch (this.ht) {
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
                switch (this.ht) {
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
        switch (this.ht) {
          case "none":
          case "invoke-lifecycles":
            {
                const e = mergeDistinct(this.lt.children, this.ut.children);
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
            this.ht = "replace";
        } else {
            this.ht = t.transitionPlan ?? e.context.config.Z(s, e);
        }
    }
    Ot() {
        if (this.ut !== null) {
            this.ut.children.forEach((function(t) {
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
                    this.ht = "replace";
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
    jt() {
        if (this.ut !== null) {
            this.ut.children.forEach((function(t) {
                t.context.vpa.jt();
            }));
        }
        if (this.lt !== null) {
            this.lt.children.forEach((function(t) {
                t.context.vpa.jt();
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
                    switch (this.ht) {
                      case "none":
                      case "invoke-lifecycles":
                        this.it = 4096;
                        break;

                      case "replace":
                        this.it = 4096;
                        this.ot = this.ct;
                        break;
                    }
                    this.ut = this.lt;
                    break;

                  default:
                    this.xt("endTransition 2");
                }
                break;

              default:
                this.xt("endTransition 3");
            }
            this.ht = "replace";
            this.nt = 64;
            this.lt = null;
            this.ct = null;
            this.ft = null;
        }
    }
    toString() {
        return `VPA(state:${$state(this._state)},plan:'${this.ht}',n:${this.lt},c:${this.ut},viewport:${this.viewport})`;
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

const f = new Map;

function $state(t) {
    let e = f.get(t);
    if (e === void 0) {
        f.set(t, e = stringifyState(t));
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
        return this.Lt.root;
    }
    get isInstructionsFinalized() {
        return this.Ut;
    }
    constructor(t, e, s, i, n, r, o, c, a, h, u, l, f, p) {
        this.path = t;
        this.finalPath = e;
        this.context = s;
        this.Bt = i;
        this.instruction = n;
        this.params = r;
        this.queryParams = o;
        this.fragment = c;
        this.data = a;
        this.zt = h;
        this.title = u;
        this.component = l;
        this.children = f;
        this.residue = p;
        this.Dt = 1;
        this.Ut = false;
        this.Bt ?? (this.Bt = n);
    }
    static create(t) {
        const {[i.RESIDUE]: s, ...n} = t.params ?? {};
        return new RouteNode(t.path, t.finalPath, t.context, t.originalInstruction ?? t.instruction, t.instruction, Object.freeze(n), t.queryParams ?? p, t.fragment ?? null, Object.freeze(t.data ?? e.emptyObject), t.zt ?? null, t.title ?? null, t.component, t.children ?? [], t.residue ?? []);
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
                    const h = s ? a.recognizedRoute?.route.endpoint : null;
                    const u = n[t + o] ?? null;
                    const l = u !== null ? !i && u.isInstructionsFinalized ? u.instruction : u.Bt : null;
                    const f = l?.recognizedRoute?.route.endpoint;
                    if (t + o < e && ((h?.equalsOrResidual(f) ?? false) || (l?.contains(a) ?? false))) {
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
        t.Ht(this.Lt);
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
        this.Lt = t;
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
        const t = new RouteNode(this.path, this.finalPath, this.context, this.Bt, this.instruction, this.params, this.queryParams, this.fragment, this.data, this.zt, this.title, this.component, this.children.map((t => t.I())), [ ...this.residue ]);
        t.Dt = this.Dt + 1;
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
        const t = new RouteTree(this.options.I(), this.queryParams, this.fragment, this.root.I());
        t.root.Ht(this);
        return t;
    }
    Wt() {
        return new ViewportInstructionTree(this.options, true, this.root.children.map((t => t.Gt())), this.queryParams, this.fragment);
    }
    Yt(t) {
        this.queryParams = Object.freeze(mergeURLSearchParams(this.queryParams, t, true));
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
                    const e = n.Qt(i);
                    if (e !== null) {
                        s.Lt.Yt(e.query);
                        const n = e.vi;
                        n.children.push(...i.children);
                        return appendNode(t, s, createConfiguredNode(t, s, n, n.recognizedRoute, i));
                    }
                }
                let c = 0;
                let a = i.component.value;
                let h = i;
                while (h.children.length === 1) {
                    h = h.children[0];
                    if (h.component.type === 0) {
                        ++c;
                        a = `${a}/${h.component.value}`;
                    } else {
                        break;
                    }
                }
                o = n.recognize(a);
                t.trace("createNode recognized route: %s", o);
                const u = o?.residue ?? null;
                t.trace("createNode residue:", u);
                const l = u === null;
                if (o === null || u === a) {
                    const r = n.Qt({
                        component: i.component.value,
                        params: i.params ?? e.emptyObject,
                        open: i.open,
                        close: i.close,
                        viewport: i.viewport,
                        children: i.children
                    });
                    if (r !== null) {
                        s.Lt.Yt(r.query);
                        return appendNode(t, s, createConfiguredNode(t, s, r.vi, r.vi.recognizedRoute, i));
                    }
                    const o = i.component.value;
                    if (o === "") return;
                    let c = i.viewport;
                    if (c === null || c.length === 0) c = x;
                    const a = n.getFallbackViewportAgent(c);
                    const h = a !== null ? a.viewport.et(i, s, n) : n.config.et(i, s, n);
                    if (h === null) throw new UnknownRouteError(getMessage(3401, o, n.gt, c, o, n.component.name));
                    if (typeof h === "string") {
                        t.trace(`Fallback is set to '${h}'. Looking for a recognized route.`);
                        const e = n.childRoutes.find((t => t.id === h));
                        if (e !== void 0) return appendNode(t, s, createFallbackNode(t, e, s, i));
                        t.trace(`No route configuration for the fallback '${h}' is found; trying to recognize the route.`);
                        const r = n.recognize(h, true);
                        if (r !== null && r.residue !== h) return appendNode(t, s, createConfiguredNode(t, s, i, r, null));
                    }
                    t.trace(`The fallback '${h}' is not recognized as a route; treating as custom element name.`);
                    return e.onResolve(resolveRouteConfiguration(h, false, n.config, null, n), (e => appendNode(t, s, createFallbackNode(t, e, s, i))));
                }
                o.residue = null;
                i.component.value = l ? a : a.slice(0, -(u.length + 1));
                let f = !l;
                for (let t = 0; t < c; ++t) {
                    const t = i.children[0];
                    if (u?.startsWith(t.component.value) ?? false) {
                        f = false;
                        break;
                    }
                    i.viewport = t.viewport;
                    i.children = t.children;
                }
                if (f) {
                    i.children.unshift(ViewportInstruction.create(u));
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
                const {vi: o, query: c} = n.Qt({
                    component: r,
                    params: i.params ?? e.emptyObject,
                    open: i.open,
                    close: i.close,
                    viewport: i.viewport,
                    children: i.children
                });
                s.Lt.Yt(c);
                return appendNode(t, s, createConfiguredNode(t, s, o, o.recognizedRoute, i));
            }));
        }
    }
}

function createConfiguredNode(t, s, i, n, r, o = n.route.endpoint.route) {
    const c = s.context;
    const a = s.Lt;
    return e.onResolve(o.handler, (h => {
        o.handler = h;
        t.trace(`creatingConfiguredNode(rdc:%s, vi:%s)`, h, i);
        if (h.redirectTo === null) {
            const u = (i.viewport?.length ?? 0) > 0;
            const l = u ? i.viewport : h.viewport;
            return e.onResolve(resolveCustomElementDefinition(h.component, c)[1], (f => {
                const p = c.Jt(new ViewportRequest(l, f.name));
                if (!u) {
                    i.viewport = p.viewport.name;
                }
                const g = c.container.get(d);
                return e.onResolve(g.getRouteContext(p, f, null, p.hostController.container, c.config, c, h), (e => {
                    t.trace("createConfiguredNode setting the context node");
                    const c = e.node = RouteNode.create({
                        path: n.route.endpoint.route.path,
                        finalPath: o.path,
                        context: e,
                        instruction: i,
                        originalInstruction: r,
                        params: n.route.params,
                        queryParams: a.queryParams,
                        fragment: a.fragment,
                        data: h.data,
                        zt: l,
                        component: f,
                        title: h.title,
                        residue: i.children.slice()
                    });
                    c.Ht(s.Lt);
                    t.trace(`createConfiguredNode(vi:%s) -> %s`, i, c);
                    return c;
                }));
            }));
        }
        const u = RouteExpression.parse(o.path, false);
        const l = RouteExpression.parse(h.redirectTo, false);
        let f;
        let p;
        const g = [];
        switch (u.root.kind) {
          case 2:
          case 4:
            f = u.root;
            break;

          default:
            throw new Error(getMessage(3502, u.root.kind));
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
                    g.push(n.route.params[v.component.parameterName]);
                } else {
                    g.push(v.raw);
                }
            }
        }
        const E = g.filter(Boolean).join("/");
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
        return e.context.vpa.Vt(s.Lt.options, e);
    }));
}

function createFallbackNode(t, s, n, r) {
    const o = new $RecognizedRoute(new i.RecognizedRoute(new i.Endpoint(new i.ConfigurableRoute(s.path[0], s.caseSensitive, s), []), e.emptyObject), null);
    r.children.length = 0;
    return createConfiguredNode(t, n, r, o, null);
}

const p = Object.freeze(new URLSearchParams);

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
        return this.Kt;
    }
    constructor(t, e, s, i, n, r, o, c, a, h, u, l, f, p, d) {
        this.id = t;
        this.prevInstructions = e;
        this.instructions = s;
        this.finalInstructions = i;
        this.instructionsChanged = n;
        this.trigger = r;
        this.options = o;
        this.managedState = c;
        this.previousRouteTree = a;
        this.routeTree = h;
        this.promise = u;
        this.resolve = l;
        this.reject = f;
        this.guardsResult = p;
        this.error = d;
        this.Kt = false;
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
                    this.Ct(t);
                }));
            } else {
                e(s);
            }
        } catch (t) {
            this.Ct(t);
        }
    }
    Ct(t) {
        this.Kt = t instanceof UnknownRouteError;
        this.reject(this.error = t);
    }
    toString() {
        return `T(id:${this.id},trigger:'${this.trigger}',instructions:${this.instructions})`;
    }
}

const d = /*@__PURE__*/ e.DI.createInterface("IRouter", (t => t.singleton(Router)));

class Router {
    get Xt() {
        const t = this.Zt;
        if (t !== null) return t;
        if (!this.c.has(E, true)) throw new Error(getMessage(3271));
        return this.Zt = this.c.get(E);
    }
    get routeTree() {
        let t = this.te;
        if (t === null) {
            const e = this.Xt;
            t = this.te = new RouteTree(NavigationOptions.create(this.options, {}), p, null, RouteNode.create({
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
        return this.ee ?? (this.ee = Transition.K({
            id: 0,
            prevInstructions: this.se,
            instructions: this.se,
            finalInstructions: this.se,
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
        }));
    }
    set currentTr(t) {
        this.ee = t;
    }
    get isNavigating() {
        return this.ie;
    }
    constructor() {
        this.Zt = null;
        this.te = null;
        this.ee = null;
        this.ne = false;
        this.re = 0;
        this.oe = null;
        this.ce = null;
        this.ae = false;
        this.ie = false;
        this.c = e.resolve(e.IContainer);
        this.he = e.resolve(s.IPlatform);
        this.B = e.resolve(e.ILogger).root.scopeTo("Router");
        this.A = e.resolve(o);
        this.ue = e.resolve(a);
        this.options = e.resolve(n);
        this.le = new Map;
        this.se = ViewportInstructionTree.create("", this.options);
        this.c.registerResolver(Router, e.Registration.instance(Router, this));
    }
    fe(t) {
        return RouteContext.resolve(this.Xt, t);
    }
    start(t) {
        this.ae = typeof this.options.buildTitle === "function";
        this.ue.startListening();
        this.ce = this.A.subscribe("au:router:location-change", (t => {
            this.he.taskQueue.queueTask((() => {
                const e = isManagedState(t.state) ? t.state : null;
                const s = this.options;
                const i = NavigationOptions.create(s, {
                    historyStrategy: "replace"
                });
                const n = ViewportInstructionTree.create(t.url, s, i, this.Xt);
                this.pe(n, t.trigger, e, null);
            }));
        }));
        if (!this.ne && t) {
            return this.load(this.ue.getPath(), {
                historyStrategy: "replace"
            });
        }
    }
    stop() {
        this.ue.stopListening();
        this.ce?.dispose();
    }
    load(t, e) {
        const s = this.createViewportInstructions(t, e);
        return this.pe(s, "api", null, null);
    }
    isActive(t, e) {
        const s = this.fe(e);
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
            let i = this.le.get(t);
            if (i === void 0) {
                this.le.set(t, i = new WeakMap);
            }
            let r = i.get(e);
            if (r !== void 0) {
                return r;
            }
            const o = n.has(E, true) ? n.get(E) : null;
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
            s = this.fe(s);
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
        }), this.Xt);
    }
    pe(t, e, s, i) {
        const n = this.currentTr;
        const r = this.B;
        if (e !== "api" && n.trigger === "api" && n.instructions.equals(t)) {
            return true;
        }
        let o = void 0;
        let c = void 0;
        let a;
        const h = this.options.restorePreviousRouteTreeOnError;
        if (i === null || i.erredWithUnknownRoute || i.error != null && h) {
            a = new Promise((function(t, e) {
                o = t;
                c = e;
            }));
        } else {
            a = i.promise;
            o = i.resolve;
            c = i.reject;
        }
        const u = this.oe = Transition.K({
            id: ++this.re,
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
            routeTree: this.te = this.routeTree.I(),
            guardsResult: true,
            error: void 0
        });
        if (!this.ie) {
            try {
                this.$t(u);
            } catch (t) {
                u.Ct(t);
            }
        }
        return u.promise.then((t => t)).catch((t => {
            error(r, 3270, u, t);
            if (u.erredWithUnknownRoute) {
                this.de(u);
            } else {
                this.ie = false;
                this.A.publish(new NavigationErrorEvent(u.id, u.instructions, t));
                if (h) {
                    this.de(u);
                } else {
                    const t = this.oe;
                    if (t !== null) {
                        t.previousRouteTree = u.previousRouteTree;
                    } else {
                        this.te = u.previousRouteTree;
                    }
                }
            }
            throw t;
        }));
    }
    $t(t) {
        this.currentTr = t;
        this.oe = null;
        this.ie = true;
        let s = this.fe(t.options.context);
        this.A.publish(new NavigationStartEvent(t.id, t.instructions, t.trigger, t.managedState));
        if (this.oe !== null) {
            return this.$t(this.oe);
        }
        t.$t((() => {
            const i = t.finalInstructions;
            const n = this.Xt;
            const r = t.routeTree;
            r.options = i.options;
            r.queryParams = n.node.Lt.queryParams = i.queryParams;
            r.fragment = n.node.Lt.fragment = i.fragment;
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
                    i.context.vpa.bt(t, s);
                }
            })).$((e => {
                if (t.guardsResult !== true) {
                    e._();
                    this.de(t);
                }
            })).$((e => {
                for (const i of s) {
                    i.context.vpa._t(t, e);
                }
            })).$((e => {
                if (t.guardsResult !== true) {
                    e._();
                    this.de(t);
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
                    t.context.vpa.jt();
                }));
                this.ne = true;
                this.se = t.finalInstructions = t.routeTree.Wt();
                this.ie = false;
                const e = t.finalInstructions.toUrl(true, this.options.useUrlFragmentHash);
                switch (t.options.P(this.se)) {
                  case "none":
                    break;

                  case "push":
                    this.ue.pushState(toManagedState(t.options.state, t.id), this.updateTitle(t), e);
                    break;

                  case "replace":
                    this.ue.replaceState(toManagedState(t.options.state, t.id), this.updateTitle(t), e);
                    break;
                }
                this.A.publish(new NavigationEndEvent(t.id, t.instructions, this.se));
                t.resolve(true);
                this.ge();
            })).C();
        }));
    }
    updateTitle(t = this.currentTr) {
        let e;
        if (this.ae) {
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
            this.he.document.title = e;
        }
        return this.he.document.title;
    }
    de(t) {
        const s = t.previousRouteTree.root.children;
        const i = t.routeTree.root.children;
        const n = mergeDistinct(s, i);
        n.forEach((function(t) {
            t.context.vpa.Ot();
        }));
        this.se = t.prevInstructions;
        this.te = t.previousRouteTree;
        this.ie = false;
        const r = t.guardsResult;
        this.A.publish(new NavigationCancelEvent(t.id, t.instructions, `guardsResult is ${r}`));
        if (r === false) {
            t.resolve(false);
            this.ge();
        } else {
            let s;
            if (this.ne && (t.erredWithUnknownRoute || t.error != null && this.options.restorePreviousRouteTreeOnError)) s = t.prevInstructions; else if (r === true) return; else s = r;
            void e.onResolve(this.pe(s, "api", t.managedState, t), (() => {}));
        }
    }
    ge() {
        if (this.oe === null) return;
        this.he.taskQueue.queueTask((() => {
            const t = this.oe;
            if (t === null) return;
            try {
                this.$t(t);
            } catch (e) {
                t.Ct(e);
            }
        }));
    }
}

function updateNode(t, s, i, n) {
    t.trace(`updateNode(ctx:%s,node:%s)`, i, n);
    n.queryParams = s.queryParams;
    n.fragment = s.fragment;
    if (!n.context.isRoot) {
        n.context.vpa.Vt(n.Lt.options, n);
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

const g = [ "?", "#", "/", "+", "(", ")", ".", "@", "!", "=", ",", "&", "'", "~", ";" ];

class ParserState {
    get h() {
        return this.we.length === 0;
    }
    constructor(t) {
        this.ve = t;
        this.me = [];
        this.xe = 0;
        this.Ee = 0;
        this.we = t;
    }
    Re(...t) {
        const e = this.we;
        return t.some((function(t) {
            return e.startsWith(t);
        }));
    }
    ye(t) {
        if (this.Re(t)) {
            this.we = this.we.slice(t.length);
            this.Ee += t.length;
            this.Se(t);
            return true;
        }
        return false;
    }
    be(t) {
        if (!this.ye(t)) {
            this.Ce(`'${t}'`);
        }
    }
    Ce(t) {
        throw new Error(getMessage(3500, t, this.Ee, this.ve, this.we, this.we));
    }
    _e() {
        if (!this.h) {
            throw new Error(getMessage(3501, this.we, this.Ee, this.ve));
        }
    }
    Ne() {
        const t = this.we[0];
        this.we = this.we.slice(1);
        ++this.Ee;
        this.Se(t);
    }
    ke() {
        this.me[this.xe++] = "";
    }
    Te() {
        const t = --this.xe;
        const e = this.me;
        const s = e[t];
        e[t] = "";
        return s;
    }
    $e() {
        this.me[--this.xe] = "";
    }
    Se(t) {
        const e = this.xe;
        const s = this.me;
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

const w = new Map;

const v = new Map;

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
        const s = e ? w : v;
        let i = s.get(t);
        if (i === void 0) {
            s.set(t, i = RouteExpression.Ie(t, e));
        }
        return i;
    }
    static Ie(t, e) {
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
            return new RouteExpression("", false, SegmentExpression.EMPTY, n != null ? Object.freeze(n) : p, s, e);
        }
        const o = new ParserState(t);
        o.ke();
        const c = o.ye("/");
        const a = CompositeSegmentExpression.Pe(o);
        o._e();
        const h = o.Te();
        return new RouteExpression(h, c, a, n != null ? Object.freeze(n) : p, s, e);
    }
    toInstructionTree(t) {
        return new ViewportInstructionTree(t, this.isAbsolute, this.root.Ae(0, 0), mergeURLSearchParams(this.queryParams, t.queryParams, true), this.fragment ?? t.fragment);
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
    static Pe(t) {
        t.ke();
        const e = t.ye("+");
        const s = [];
        do {
            s.push(ScopedSegmentExpression.Pe(t));
        } while (t.ye("+"));
        if (!e && s.length === 1) {
            t.$e();
            return s[0];
        }
        const i = t.Te();
        return new CompositeSegmentExpression(i, s);
    }
    Ae(t, e) {
        switch (this.siblings.length) {
          case 0:
            return [];

          case 1:
            return this.siblings[0].Ae(t, e);

          case 2:
            return [ ...this.siblings[0].Ae(t, 0), ...this.siblings[1].Ae(0, e) ];

          default:
            return [ ...this.siblings[0].Ae(t, 0), ...this.siblings.slice(1, -1).flatMap((function(t) {
                return t.Ae(0, 0);
            })), ...this.siblings[this.siblings.length - 1].Ae(0, e) ];
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
    static Pe(t) {
        t.ke();
        const e = SegmentGroupExpression.Pe(t);
        if (t.ye("/")) {
            const s = ScopedSegmentExpression.Pe(t);
            const i = t.Te();
            return new ScopedSegmentExpression(i, e, s);
        }
        t.$e();
        return e;
    }
    Ae(t, e) {
        const s = this.left.Ae(t, 0);
        const i = this.right.Ae(0, e);
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
    static Pe(t) {
        t.ke();
        if (t.ye("(")) {
            const e = CompositeSegmentExpression.Pe(t);
            t.be(")");
            const s = t.Te();
            return new SegmentGroupExpression(s, e);
        }
        t.$e();
        return SegmentExpression.Pe(t);
    }
    Ae(t, e) {
        return this.expression.Ae(t + 1, e + 1);
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
    static Pe(t) {
        t.ke();
        const e = ComponentExpression.Pe(t);
        const s = ActionExpression.Pe(t);
        const i = ViewportExpression.Pe(t);
        const n = !t.ye("!");
        const r = t.Te();
        return new SegmentExpression(r, e, s, i, n);
    }
    Ae(t, e) {
        return [ ViewportInstruction.create({
            component: this.component.name,
            params: this.component.parameterList.Ve(),
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
    static Pe(t) {
        t.ke();
        t.ke();
        if (!t.h) {
            if (t.Re("./")) {
                t.Ne();
            } else if (t.Re("../")) {
                t.Ne();
                t.Ne();
            } else {
                while (!t.h && !t.Re(...g)) {
                    t.Ne();
                }
            }
        }
        const e = decodeURIComponent(t.Te());
        if (e.length === 0) {
            t.Ce("component name");
        }
        const s = ParameterListExpression.Pe(t);
        const i = t.Te();
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
    static Pe(t) {
        t.ke();
        let e = "";
        if (t.ye(".")) {
            t.ke();
            while (!t.h && !t.Re(...g)) {
                t.Ne();
            }
            e = decodeURIComponent(t.Te());
            if (e.length === 0) {
                t.Ce("method name");
            }
        }
        const s = ParameterListExpression.Pe(t);
        const i = t.Te();
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
    static Pe(t) {
        t.ke();
        let e = null;
        if (t.ye("@")) {
            t.ke();
            while (!t.h && !t.Re(...g)) {
                t.Ne();
            }
            e = decodeURIComponent(t.Te());
            if (e.length === 0) {
                t.Ce("viewport name");
            }
        }
        const s = t.Te();
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
    static Pe(t) {
        t.ke();
        const e = [];
        if (t.ye("(")) {
            do {
                e.push(ParameterExpression.Pe(t, e.length));
                if (!t.ye(",")) {
                    break;
                }
            } while (!t.h && !t.Re(")"));
            t.be(")");
        }
        const s = t.Te();
        return new ParameterListExpression(s, e);
    }
    Ve() {
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
    static Pe(t, e) {
        t.ke();
        t.ke();
        while (!t.h && !t.Re(...g)) {
            t.Ne();
        }
        let s = decodeURIComponent(t.Te());
        if (s.length === 0) {
            t.Ce("parameter key");
        }
        let i;
        if (t.ye("=")) {
            t.ke();
            while (!t.h && !t.Re(...g)) {
                t.Ne();
            }
            i = decodeURIComponent(t.Te());
            if (i.length === 0) {
                t.Ce("parameter value");
            }
        } else {
            i = s;
            s = e.toString();
        }
        const n = t.Te();
        return new ParameterExpression(n, s, i);
    }
    toString() {
        return this.raw;
    }
}

const m = Object.freeze({
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

const x = "default";

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
            return new ViewportInstruction(t.open ?? 0, t.close ?? 0, t.recognizedRoute ?? null, e, t.viewport ?? null, Object.freeze(t.params ?? null), s);
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
        return new ViewportInstruction(this.open, this.close, this.recognizedRoute, this.component.I(), this.viewport, this.params, [ ...this.children ]);
    }
    toUrlComponent(t = true) {
        const e = this.component.toUrlComponent();
        const s = this.viewport;
        const i = e.length === 0 || s === null || s.length === 0 || s === x ? "" : `@${s}`;
        const n = `${"(".repeat(this.open)}${e}${stringifyParams(this.params)}${i}${")".repeat(this.close)}`;
        const r = t ? this.children.map((t => t.toUrlComponent())).join("+") : "";
        return n.length > 0 ? r.length > 0 ? `${n}/${r}` : n : r;
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
    if (t === null) return "";
    const s = Object.keys(t);
    const i = s.length;
    if (i === 0) return "";
    const n = Array(i);
    const r = [];
    const o = [];
    for (const t of s) {
        if (e.isArrayIndex(t)) {
            r.push(Number(t));
        } else {
            o.push(t);
        }
    }
    for (let e = 0; e < i; ++e) {
        const s = r.indexOf(e);
        if (s > -1) {
            n[e] = t[e];
            r.splice(s, 1);
        } else {
            const s = o.shift();
            n[e] = `${s}=${t[s]}`;
        }
    }
    return `(${n.join(",")})`;
}

class ViewportInstructionTree {
    constructor(t, e, s, i, n) {
        this.options = t;
        this.isAbsolute = e;
        this.children = s;
        this.queryParams = i;
        this.fragment = n;
        Object.freeze(i);
    }
    static create(t, s, i, n) {
        i = i instanceof NavigationOptions ? i : NavigationOptions.create(s, i ?? e.emptyObject);
        let r = i.context;
        if (!(r instanceof RouteContext) && n != null) {
            r = i.context = RouteContext.resolve(n, r);
        }
        const o = r != null;
        if (t instanceof Array) {
            const s = t.length;
            const n = new Array(s);
            const c = new URLSearchParams(i.queryParams ?? e.emptyObject);
            for (let e = 0; e < s; e++) {
                const s = t[e];
                const i = o ? r.Qt(s) : null;
                if (i !== null) {
                    n[e] = i.vi;
                    mergeURLSearchParams(c, i.query, false);
                } else {
                    n[e] = ViewportInstruction.create(s);
                }
            }
            return new ViewportInstructionTree(i, false, n, c, i.fragment);
        }
        if (typeof t === "string") {
            const e = RouteExpression.parse(t, s.useUrlFragmentHash);
            return e.toInstructionTree(i);
        }
        const c = o ? r.Qt(isPartialViewportInstruction(t) ? {
            ...t,
            params: t.params ?? e.emptyObject
        } : {
            component: t,
            params: e.emptyObject
        }) : null;
        const a = new URLSearchParams(i.queryParams ?? e.emptyObject);
        return c !== null ? new ViewportInstructionTree(i, false, [ c.vi ], mergeURLSearchParams(a, c.query, false), i.fragment) : new ViewportInstructionTree(i, false, [ ViewportInstruction.create(t) ], a, i.fragment);
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
                const i = s.it === 4096 ? s.ut : s.lt;
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
            s = "/";
            i = n.length > 0 ? `#/${n}/${r}` : `#/${r}`;
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
        this.Me = t;
        this.Oe = s;
        this.Mt = i;
        this.Xt = n;
        this.je = r;
        this.B = n.container.get(e.ILogger).scopeTo(`ComponentAgent<${n.gt}>`);
        const o = s.lifecycleHooks;
        this.Le = (o.canLoad ?? []).map((t => t.instance));
        this.Ue = (o.loading ?? []).map((t => t.instance));
        this.Be = (o.canUnload ?? []).map((t => t.instance));
        this.ze = (o.unloading ?? []).map((t => t.instance));
        this.De = "canLoad" in t;
        this.qe = "loading" in t;
        this.He = "canUnload" in t;
        this.Fe = "unloading" in t;
    }
    vt(t, e) {
        if (t === null) {
            return this.Oe.activate(this.Oe, e);
        }
        void this.Oe.activate(t, e);
    }
    Rt(t, e) {
        if (t === null) {
            return this.Oe.deactivate(this.Oe, e);
        }
        void this.Oe.deactivate(t, e);
    }
    It() {
        this.Oe.dispose();
    }
    bt(t, e, s) {
        s._();
        let i = Promise.resolve();
        for (const n of this.Be) {
            s._();
            i = i.then((() => new Promise((i => {
                if (t.guardsResult !== true) {
                    s.N();
                    i();
                    return;
                }
                t.$t((() => n.canUnload(this.Me, e, this.Mt)), (e => {
                    if (t.guardsResult === true && e !== true) {
                        t.guardsResult = false;
                    }
                    s.N();
                    i();
                }));
            }))));
        }
        if (this.He) {
            s._();
            i = i.then((() => {
                if (t.guardsResult !== true) {
                    s.N();
                    return;
                }
                t.$t((() => this.Me.canUnload(e, this.Mt)), (e => {
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
        const i = this.Xt.root;
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
                t.$t((() => r.canLoad(this.Me, e.params, e, this.Mt)), (e => {
                    if (t.guardsResult === true && e !== true) {
                        t.guardsResult = e === false ? false : ViewportInstructionTree.create(e, this.je, void 0, i);
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
                t.$t((() => this.Me.canLoad(e.params, e, this.Mt)), (e => {
                    if (t.guardsResult === true && e !== true) {
                        t.guardsResult = e === false ? false : ViewportInstructionTree.create(e, this.je, void 0, i);
                    }
                    s.N();
                }));
            }));
        }
        s.N();
    }
    kt(t, e, s) {
        s._();
        for (const i of this.ze) {
            t.$t((() => {
                s._();
                return i.unloading(this.Me, e, this.Mt);
            }), (() => {
                s.N();
            }));
        }
        if (this.Fe) {
            t.$t((() => {
                s._();
                return this.Me.unloading(e, this.Mt);
            }), (() => {
                s.N();
            }));
        }
        s.N();
    }
    Tt(t, e, s) {
        s._();
        for (const i of this.Ue) {
            t.$t((() => {
                s._();
                return i.loading(this.Me, e.params, e, this.Mt);
            }), (() => {
                s.N();
            }));
        }
        if (this.qe) {
            t.$t((() => {
                s._();
                return this.Me.loading(e.params, e, this.Mt);
            }), (() => {
                s.N();
            }));
        }
        s.N();
    }
}

const E = /*@__PURE__*/ e.DI.createInterface("IRouteContext");

const R = Object.freeze([ "string", "object", "function" ]);

function isEagerInstruction(t) {
    if (t == null) return false;
    const e = t.params;
    const s = t.component;
    return typeof e === "object" && e !== null && s != null && R.includes(typeof s) && !(s instanceof Promise);
}

class RouteContext {
    get isRoot() {
        return this.parent === null;
    }
    get depth() {
        return this.path.length - 1;
    }
    get allResolved() {
        return this.Ge;
    }
    get node() {
        const t = this.We;
        if (t === null) throw new Error(getMessage(3171, this));
        return t;
    }
    set node(t) {
        const e = this.Ye = this.We;
        if (e !== t) {
            this.We = t;
        }
    }
    get vpa() {
        const t = this.Qe;
        if (t === null) throw new Error(getMessage(3172, this));
        return t;
    }
    get navigationModel() {
        return this.Je;
    }
    constructor(t, n, r, c, a, h) {
        this.parent = n;
        this.component = r;
        this.config = c;
        this.Ke = h;
        this.Xe = [];
        this.childRoutes = [];
        this.Ge = null;
        this.Ye = null;
        this.We = null;
        this.Ze = false;
        this.Qe = t;
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
        this.ts = a.get(e.IModuleLoader);
        const u = this.container = a.createChild();
        u.registerResolver(s.IController, this.es = new e.InstanceProvider, true);
        const l = new e.InstanceProvider("IRouteContext", this);
        u.registerResolver(E, l);
        u.registerResolver(RouteContext, l);
        u.register(c);
        this.ss = new i.RouteRecognizer;
        if (h.options.useNavigationModel) {
            const t = this.Je = new NavigationModel([]);
            u.get(o).subscribe("au:router:navigation-end", (() => t.ns(h, this)));
        } else {
            this.Je = null;
        }
        this.rs(c);
    }
    rs(t) {
        const s = [];
        const i = t.routes ?? h;
        const n = i.length;
        if (n === 0) {
            const e = t.component.prototype?.getRouteConfig;
            this.Ze = e == null ? true : typeof e !== "function";
            return;
        }
        const r = this.Je;
        const o = r !== null;
        let c = 0;
        for (;c < n; c++) {
            const n = i[c];
            if (n instanceof Promise) {
                s.push(this.os(n));
                continue;
            }
            const a = resolveRouteConfiguration(n, true, t, null, this);
            if (a instanceof Promise) {
                if (!isPartialChildRouteConfig(n) || n.path == null) throw new Error(getMessage(3173));
                for (const t of ensureArrayOfStrings(n.path)) {
                    this.cs(t, n.caseSensitive ?? false, a);
                }
                const t = this.childRoutes.length;
                const i = a.then((e => this.childRoutes[t] = e));
                this.childRoutes.push(i);
                if (o) {
                    r.os(i);
                }
                s.push(i.then(e.noop));
                continue;
            }
            for (const t of a.path ?? e.emptyArray) {
                this.cs(t, a.caseSensitive, a);
            }
            this.childRoutes.push(a);
            if (o) {
                r.os(a);
            }
        }
        this.Ze = true;
        if (s.length > 0) {
            this.Ge = Promise.all(s).then((() => {
                this.Ge = null;
            }));
        }
    }
    static setRoot(t) {
        const i = t.get(e.ILogger).scopeTo("RouteContext");
        if (!t.has(s.IAppRoot, true)) {
            logAndThrow(new Error(getMessage(3167)), i);
        }
        if (t.has(E, true)) {
            logAndThrow(new Error(getMessage(3168)), i);
        }
        const {controller: n} = t.get(s.IAppRoot);
        if (n === void 0) {
            logAndThrow(new Error(getMessage(3169)), i);
        }
        const r = t.get(d);
        return e.onResolve(r.getRouteContext(null, n.definition, n.viewModel, n.container, null, null, null), (s => {
            t.register(e.Registration.instance(E, s));
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
                return t.container.get(E);
            } catch (t) {
                error(r, 3155, i.nodeName, t);
                throw t;
            }
        }
        if (s.isCustomElementViewModel(i)) {
            const t = i.$controller;
            return t.container.get(E);
        }
        if (s.isCustomElementController(i)) {
            const t = i;
            return t.container.get(E);
        }
        logAndThrow(new Error(getMessage(3170, Object.prototype.toString.call(i))), r);
    }
    dispose() {
        this.container.dispose();
    }
    Jt(t) {
        const e = this.Xe.find((e => e.yt(t)));
        if (e === void 0) throw new Error(getMessage(3174, t, this.us()));
        return e;
    }
    getAvailableViewportAgents() {
        return this.Xe.filter((t => t.St()));
    }
    getFallbackViewportAgent(t) {
        return this.Xe.find((e => e.St() && e.viewport.name === t && e.viewport.fallback !== "")) ?? null;
    }
    Nt(t, i) {
        this.es.prepare(t);
        const n = this.container;
        const r = n.get(i.component.key);
        const o = this.Ze ? void 0 : e.onResolve(resolveRouteConfiguration(r, false, this.config, i, null), (t => this.rs(t)));
        return e.onResolve(o, (() => {
            const e = s.Controller.$el(n, r, t.host, null);
            const o = new ComponentAgent(r, e, i, this, this.Ke.options);
            this.es.dispose();
            return o;
        }));
    }
    ls(t) {
        const e = ViewportAgent.for(t, this);
        if (this.Xe.includes(e)) {
            return e;
        }
        this.Xe.push(e);
        return e;
    }
    ps(t) {
        const e = ViewportAgent.for(t, this);
        if (!this.Xe.includes(e)) {
            return;
        }
        this.Xe.splice(this.Xe.indexOf(e), 1);
    }
    recognize(t, e = false) {
        let s = this;
        let n = true;
        let r = null;
        while (n) {
            r = s.ss.recognize(t);
            if (r === null) {
                if (!e || s.isRoot) return null;
                s = s.parent;
            } else {
                n = false;
            }
        }
        return new $RecognizedRoute(r, Reflect.has(r.params, i.RESIDUE) ? r.params[i.RESIDUE] ?? null : null);
    }
    os(t) {
        return e.onResolve(resolveRouteConfiguration(t, true, this.config, null, this), (t => {
            for (const s of t.path ?? e.emptyArray) {
                this.cs(s, t.caseSensitive, t);
            }
            this.Je?.os(t);
            this.childRoutes.push(t);
        }));
    }
    cs(t, e, s) {
        this.ss.add({
            path: t,
            caseSensitive: e,
            handler: s
        }, true);
    }
    st(t) {
        return this.ts.load(t, (s => {
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
    Qt(t) {
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
        const o = this.ss;
        const c = s.length;
        const a = [];
        let h = null;
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
        let u = 0;
        for (let t = 0; t < c; t++) {
            const e = core(s[t]);
            if (e === null) continue;
            if (h === null) {
                h = e;
                u = Object.keys(e.consumed).length;
            } else if (Object.keys(e.consumed).length > u) {
                h = e;
            }
        }
        if (h === null) {
            if (n) throw new Error(getMessage(3166, t, a));
            return null;
        }
        return {
            vi: ViewportInstruction.create({
                recognizedRoute: new $RecognizedRoute(new i.RecognizedRoute(h.endpoint, h.consumed), null),
                component: h.path,
                children: t.children,
                viewport: t.viewport,
                open: t.open,
                close: t.close
            }),
            query: h.query
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
        const t = this.Xe;
        const e = t.map(String).join(",");
        return `RC(path:'${this.gt}',viewports:[${e}])`;
    }
    us() {
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
        this.ds = void 0;
    }
    resolve() {
        return e.onResolve(this.ds, e.noop);
    }
    ns(t, s) {
        void e.onResolve(this.ds, (() => {
            for (const e of this.routes) {
                e.ns(t, s);
            }
        }));
    }
    os(t) {
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
        n = this.ds = e.onResolve(this.ds, (() => e.onResolve(t, (t => {
            if (t.nav) {
                s[i] = NavigationRoute.K(t);
            } else {
                s.splice(i, 1);
            }
            if (this.ds === n) {
                this.ds = void 0;
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
        this.gs = null;
    }
    static K(t) {
        return new NavigationRoute(t.id, ensureArrayOfStrings(t.path ?? e.emptyArray), t.redirectTo, t.title, t.data);
    }
    get isActive() {
        return this.rt;
    }
    ns(t, s) {
        let n = this.gs;
        if (n === null) {
            const r = t.options;
            n = this.gs = this.path.map((t => {
                const n = s.ss.getEndpoint(t);
                if (n === null) throw new Error(getMessage(3450, t));
                return new ViewportInstructionTree(NavigationOptions.create(r, {
                    context: s
                }), false, [ ViewportInstruction.create({
                    recognizedRoute: new $RecognizedRoute(new i.RecognizedRoute(n, e.emptyObject), null),
                    component: t
                }) ], p, null);
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
        this.name = x;
        this.usedBy = "";
        this.default = "";
        this.fallback = "";
        this.ws = void 0;
        this.Oe = void 0;
        this.Xt = e.resolve(E);
        this.B = e.resolve(e.ILogger).scopeTo(`au-viewport<${this.Xt.gt}>`);
    }
    et(t, e, i) {
        const n = this.fallback;
        return typeof n === "function" && !s.CustomElement.isType(n) ? n(t, e, i) : n;
    }
    hydrated(t) {
        this.Oe = t;
        this.ws = this.Xt.ls(this);
    }
    attaching(t, e) {
        return this.ws.wt(t, this.Oe);
    }
    detaching(t, e) {
        return this.ws.Et(t, this.Oe);
    }
    dispose() {
        this.Xt.ps(this);
        this.ws.It();
        this.ws = void 0;
    }
    toString() {
        const t = [];
        for (const e of y) {
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
        return `VP(ctx:'${this.Xt.gt}',${t.join(",")})`;
    }
};

__decorate([ s.bindable ], exports.ViewportCustomElement.prototype, "name", void 0);

__decorate([ s.bindable ], exports.ViewportCustomElement.prototype, "usedBy", void 0);

__decorate([ s.bindable ], exports.ViewportCustomElement.prototype, "default", void 0);

__decorate([ s.bindable ], exports.ViewportCustomElement.prototype, "fallback", void 0);

exports.ViewportCustomElement = __decorate([ s.customElement({
    name: "au-viewport"
}) ], exports.ViewportCustomElement);

const y = [ "name", "usedBy", "default", "fallback" ];

exports.LoadCustomAttribute = class LoadCustomAttribute {
    constructor() {
        this.vs = e.resolve(s.INode);
        this.Ke = e.resolve(d);
        this.Xt = e.resolve(E);
        this.A = e.resolve(o);
        this.ue = e.resolve(a);
        this.attribute = "href";
        this.active = false;
        this.xs = null;
        this.se = null;
        this.Es = null;
        this.onClick = t => {
            if (this.se === null) {
                return;
            }
            if (t.altKey || t.ctrlKey || t.shiftKey || t.metaKey || t.button !== 0) {
                return;
            }
            t.preventDefault();
            void this.Ke.load(this.se, {
                context: this.context
            });
        };
        const t = this.vs;
        this.Rs = !t.hasAttribute("external") && !t.hasAttribute("data-external");
        this.ys = this.Ke.options.activeClass;
    }
    binding() {
        if (this.Rs) {
            this.vs.addEventListener("click", this.onClick);
        }
        this.valueChanged();
        this.Es = this.A.subscribe("au:router:navigation-end", (t => {
            const e = this.active = this.se !== null && this.Ke.isActive(this.se, this.context);
            const s = this.ys;
            if (s === null) return;
            this.vs.classList.toggle(s, e);
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
        if (this.Rs) {
            this.vs.removeEventListener("click", this.onClick);
        }
        this.Es.dispose();
    }
    valueChanged() {
        const t = this.Ke;
        const e = t.options.useUrlFragmentHash;
        const i = this.route;
        let n = this.context;
        if (n === void 0) {
            n = this.context = this.Xt;
        } else if (n === null) {
            n = this.context = this.Xt.root;
        }
        if (i != null && n.allResolved === null) {
            const s = this.params;
            const r = this.se = t.createViewportInstructions(typeof s === "object" && s !== null ? {
                component: i,
                params: s
            } : i, {
                context: n
            });
            this.xs = r.toUrl(false, e);
        } else {
            this.se = null;
            this.xs = null;
        }
        const r = s.CustomElement.for(this.vs, {
            optional: true
        });
        if (r !== null) {
            r.viewModel[this.attribute] = this.se;
        } else {
            if (this.xs === null) {
                this.vs.removeAttribute(this.attribute);
            } else {
                const t = e ? this.xs : this.ue.addBaseHref(this.xs);
                this.vs.setAttribute(this.attribute, t);
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
    get Ss() {
        return this.vs.hasAttribute("external") || this.vs.hasAttribute("data-external");
    }
    constructor() {
        this.vs = e.resolve(s.INode);
        this.Ke = e.resolve(d);
        this.Xt = e.resolve(E);
        this.bs = false;
        if (this.Ke.options.useHref && this.vs.nodeName === "A") {
            const t = e.resolve(s.IWindow).name;
            switch (this.vs.getAttribute("target")) {
              case null:
              case t:
              case "_self":
                this.Rs = true;
                break;

              default:
                this.Rs = false;
                break;
            }
        } else {
            this.Rs = false;
        }
    }
    binding() {
        if (!this.bs) {
            this.bs = true;
            this.Rs = this.Rs && s.getRef(this.vs, s.CustomAttribute.getDefinition(exports.LoadCustomAttribute).key) === null;
        }
        this.valueChanged(this.value);
        this.vs.addEventListener("click", this);
    }
    unbinding() {
        this.vs.removeEventListener("click", this);
    }
    valueChanged(t) {
        if (t == null) {
            this.vs.removeAttribute("href");
        } else {
            if (this.Ke.options.useUrlFragmentHash && this.Xt.isRoot && !/^[.#]/.test(t)) {
                t = `#${t}`;
            }
            this.vs.setAttribute("href", t);
        }
    }
    handleEvent(t) {
        this.Cs(t);
    }
    Cs(t) {
        if (t.altKey || t.ctrlKey || t.shiftKey || t.metaKey || t.button !== 0 || this.Ss || !this.Rs) {
            return;
        }
        const e = this.vs.getAttribute("href");
        if (e !== null) {
            t.preventDefault();
            void this.Ke.load(e, {
                context: this.Xt
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

const S = d;

const b = [ S ];

const C = exports.ViewportCustomElement;

const _ = exports.LoadCustomAttribute;

const N = exports.HrefCustomAttribute;

const k = [ exports.ViewportCustomElement, exports.LoadCustomAttribute, exports.HrefCustomAttribute ];

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
    })), e.Registration.instance(n, a), e.Registration.instance(RouterOptions, a), s.AppTask.hydrated(e.IContainer, RouteContext.setRoot), s.AppTask.activated(d, (t => t.start(true))), s.AppTask.deactivated(d, (t => {
        t.stop();
    })), ...b, ...k);
}

const T = {
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
        this.vs = t;
        this._s = t.scrollTop;
        this.Ns = t.scrollLeft;
    }
    static ks(t) {
        return t.scrollTop > 0 || t.scrollLeft > 0;
    }
    Ts() {
        this.vs.scrollTo(this.Ns, this._s);
        this.vs = null;
    }
}

function restoreState(t) {
    t.Ts();
}

class HostElementState {
    constructor(t) {
        this.$s = [];
        this.Is(t.children);
    }
    Is(t) {
        let e;
        for (let s = 0, i = t.length; s < i; ++s) {
            e = t[s];
            if (ScrollState.ks(e)) {
                this.$s.push(new ScrollState(e));
            }
            this.Is(e.children);
        }
    }
    Ts() {
        this.$s.forEach(restoreState);
        this.$s = null;
    }
}

const $ = /*@__PURE__*/ e.DI.createInterface("IStateManager", (t => t.singleton(ScrollStateManager)));

class ScrollStateManager {
    constructor() {
        this.Ps = new WeakMap;
    }
    saveState(t) {
        this.Ps.set(t.host, new HostElementState(t.host));
    }
    restoreState(t) {
        const e = this.Ps.get(t.host);
        if (e !== void 0) {
            e.Ts();
            this.Ps.delete(t.host);
        }
    }
}

exports.AST = m;

exports.ActionExpression = ActionExpression;

exports.AuNavId = r;

exports.ComponentExpression = ComponentExpression;

exports.CompositeSegmentExpression = CompositeSegmentExpression;

exports.DefaultComponents = b;

exports.DefaultResources = k;

exports.HrefCustomAttributeRegistration = N;

exports.ILocationManager = a;

exports.IRouteContext = E;

exports.IRouter = d;

exports.IRouterEvents = o;

exports.IRouterOptions = n;

exports.IStateManager = $;

exports.LoadCustomAttributeRegistration = _;

exports.LocationChangeEvent = LocationChangeEvent;

exports.NavigationCancelEvent = NavigationCancelEvent;

exports.NavigationEndEvent = NavigationEndEvent;

exports.NavigationErrorEvent = NavigationErrorEvent;

exports.NavigationOptions = NavigationOptions;

exports.NavigationStartEvent = NavigationStartEvent;

exports.ParameterExpression = ParameterExpression;

exports.ParameterListExpression = ParameterListExpression;

exports.Route = u;

exports.RouteConfig = RouteConfig;

exports.RouteContext = RouteContext;

exports.RouteExpression = RouteExpression;

exports.RouteNode = RouteNode;

exports.RouteTree = RouteTree;

exports.Router = Router;

exports.RouterConfiguration = T;

exports.RouterOptions = RouterOptions;

exports.RouterRegistration = S;

exports.ScopedSegmentExpression = ScopedSegmentExpression;

exports.SegmentExpression = SegmentExpression;

exports.SegmentGroupExpression = SegmentGroupExpression;

exports.Transition = Transition;

exports.ViewportAgent = ViewportAgent;

exports.ViewportCustomElementRegistration = C;

exports.ViewportExpression = ViewportExpression;

exports.isManagedState = isManagedState;

exports.route = route;

exports.toManagedState = toManagedState;
//# sourceMappingURL=index.cjs.map
