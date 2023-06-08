import { Metadata as t, isObject as e } from "@aurelia/metadata";

import { DI as s, resolve as i, IEventAggregator as n, ILogger as r, Protocol as o, emptyArray as c, onResolve as a, onResolveAll as h, emptyObject as u, IContainer as l, Registration as f, isArrayIndex as p, IModuleLoader as d, InstanceProvider as g, noop as w } from "@aurelia/kernel";

import { isCustomElementViewModel as v, IHistory as m, ILocation as E, IWindow as R, CustomElement as y, Controller as x, IPlatform as S, CustomElementDefinition as C, IController as b, IAppRoot as _, isCustomElementController as N, customElement as k, bindable as T, customAttribute as $, INode as I, getRef as P, CustomAttribute as A, AppTask as V } from "@aurelia/runtime-html";

import { RecognizedRoute as M, Endpoint as O, ConfigurableRoute as L, RESIDUE as j, RouteRecognizer as U } from "@aurelia/route-recognizer";

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
    return typeof t === "object" && t !== null && !v(t);
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

function validateComponent(t, e, s) {
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
        if (!v(t) && !isPartialCustomElementDefinition(t)) {
            expectType(`an object with at least a '${s}' property (see Routeable)`, e, t);
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

const B = /*@__PURE__*/ s.createInterface("RouterOptions");

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

const D = "au-nav-id";

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

const z = /*@__PURE__*/ s.createInterface("IRouterEvents", (t => t.singleton(RouterEvents)));

class RouterEvents {
    constructor() {
        this.j = 0;
        this.L = [];
        this.U = i(n);
        this.B = i(r).scopeTo("RouterEvents");
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

const H = /*@__PURE__*/ s.createInterface("IBaseHref");

const q = /*@__PURE__*/ s.createInterface("ILocationManager", (t => t.singleton(BrowserLocationManager)));

class BrowserLocationManager {
    constructor() {
        this.H = 0;
        this.B = i(r).root.scopeTo("LocationManager");
        this.A = i(z);
        this.q = i(m);
        this.l = i(E);
        this.F = i(R);
        this.G = i(H);
        this.W = i(B).useUrlFragmentHash ? "hashchange" : "popstate";
    }
    startListening() {
        this.F.addEventListener(this.W, this, false);
    }
    stopListening() {
        this.F.removeEventListener(this.W, this, false);
    }
    handleEvent(t) {
        this.A.publish(new LocationChangeEvent(++this.H, this.getPath(), this.W, "state" in t ? t.state : null));
    }
    pushState(t, e, s) {
        s = this.addBaseHref(s);
        this.q.pushState(t, e, s);
    }
    replaceState(t, e, s) {
        s = this.addBaseHref(s);
        this.q.replaceState(t, e, s);
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

const F = c;

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
        const e = y.getDefinition(this.component);
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
    static K(t, e) {
        if (typeof t === "string" || t instanceof Array) {
            const s = ensureArrayOfStrings(t);
            const i = e?.redirectTo ?? null;
            const n = e?.caseSensitive ?? false;
            const r = ensureString(e?.id ?? (s instanceof Array ? s[0] : s));
            const o = e?.title ?? null;
            const c = e?.transitionPlan ?? null;
            const a = e?.viewport ?? it;
            const h = e?.data ?? {};
            const u = e?.routes ?? F;
            return new RouteConfig(r, s, o, i, n, c, a, h, u, e?.fallback ?? null, e, e?.nav ?? true);
        } else if (typeof t === "object") {
            const s = t;
            validateRouteConfig(s, "");
            const i = ensureArrayOfStrings(s.path ?? e?.path ?? c);
            const n = s.title ?? e?.title ?? null;
            const r = s.redirectTo ?? e?.redirectTo ?? null;
            const o = s.caseSensitive ?? e?.caseSensitive ?? false;
            const a = s.id ?? e?.id ?? (i instanceof Array ? i[0] : i);
            const h = s.transitionPlan ?? e?.transitionPlan ?? null;
            const u = s.viewport ?? e?.viewport ?? it;
            const l = {
                ...e?.data,
                ...s.data
            };
            const f = [ ...s.routes ?? F, ...e?.routes ?? F ];
            return new RouteConfig(a, i, n, r, o, h, u, l, f, s.fallback ?? e?.fallback ?? null, s.component ?? e ?? null, s.nav ?? true);
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
    tt(t, e, s) {
        if (this.J) throw new Error(getMessage(3550));
        if (typeof t.getRouteConfig !== "function") return;
        return a(t.getRouteConfig(e, s), (t => {
            this.J = true;
            if (t == null) return;
            let s = e?.path ?? "";
            if (typeof s !== "string") {
                s = s[0];
            }
            validateRouteConfig(t, s);
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
    et(t, e, s) {
        const i = this.fallback;
        return typeof i === "function" && !y.isType(i) ? i(t, e, s) : i;
    }
    register(t) {
        const e = this.component;
        if (e == null) return;
        t.register(e);
    }
}

const G = {
    name: o.resource.keyFor("route-configuration"),
    isConfigured(e) {
        return t.hasOwn(G.name, e);
    },
    configure(e, s) {
        const i = RouteConfig.K(e, s);
        t.define(G.name, i, s);
        return s;
    },
    getConfig(e) {
        if (!G.isConfigured(e)) {
            G.configure({}, e);
        }
        return t.getOwn(G.name, e);
    }
};

function route(t) {
    return function(e) {
        return G.configure(t, e);
    };
}

function resolveRouteConfiguration(t, e, s, i, n) {
    if (isPartialRedirectRouteConfig(t)) return RouteConfig.K(t, null);
    const [r, o] = resolveCustomElementDefinition(t, n);
    return a(o, (n => {
        const o = n.Type;
        const c = G.getConfig(o);
        if (isPartialChildRouteConfig(t)) return c.X(t, s);
        if (e) return c.I();
        if (!c.J && r.type === 4 && typeof t.getRouteConfig === "function") {
            return a(c.tt(t, s, i), (() => c));
        }
        return c;
    }));
}

function resolveCustomElementDefinition(t, e) {
    const s = createNavigationInstruction(t);
    let i;
    switch (s.type) {
      case 0:
        {
            if (e == null) throw new Error(getMessage(3551));
            const t = e.container.find(y, s.value);
            if (t === null) throw new Error(getMessage(3552, s.value, e));
            i = t;
            break;
        }

      case 2:
        i = s.value;
        break;

      case 4:
        i = y.getDefinition(s.value.constructor);
        break;

      case 3:
        if (e == null) throw new Error(getMessage(3553));
        i = e.st(s.value);
        break;
    }
    return [ s, i ];
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

const W = new WeakMap;

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
    constructor(t, e, s) {
        this.viewport = t;
        this.hostController = e;
        this.rt = false;
        this.ot = null;
        this.ct = null;
        this._state = 8256;
        this.ht = "replace";
        this.ut = null;
        this.lt = null;
        this.ft = null;
        this.dt = null;
        this.B = s.container.get(r).scopeTo(`ViewportAgent<${s.gt}>`);
    }
    static for(t, e) {
        let s = W.get(t);
        if (s === void 0) {
            const i = x.getCachedOrThrow(t);
            W.set(t, s = new ViewportAgent(t, i, e));
        }
        return s;
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
                this.Et("activateFromViewport 1");
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
            this.Et("activateFromViewport 2");
        }
    }
    Rt(t, e) {
        const s = this.ft;
        if (s !== null) {
            ensureTransitionHasNotErrored(s);
        }
        this.rt = false;
        switch (this.it) {
          case 8192:
            return;

          case 4096:
            return this.ot.yt(t, e);

          case 128:
            return;

          default:
            {
                if (this.ft === null) throw new Error(getMessage(3351, this));
                const e = Batch.C((e => {
                    this.yt(t, this.ft, e);
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
    xt(t) {
        if (!this.St()) {
            return false;
        }
        const e = this.viewport;
        const s = t.viewportName;
        const i = e.name;
        if (s !== it && i !== s) {
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
    Ct(t, e) {
        if (this.ft === null) {
            this.ft = t;
        }
        ensureTransitionHasNotErrored(t);
        if (t.guardsResult !== true) {
            return;
        }
        e._();
        void a(this.dt, (() => {
            Batch.C((e => {
                for (const s of this.ut.children) {
                    s.context.vpa.Ct(t, e);
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
                e.N();
            })).C();
        }));
    }
    _t(t, e) {
        if (this.ft === null) {
            this.ft = t;
        }
        ensureTransitionHasNotErrored(t);
        if (t.guardsResult !== true) {
            return;
        }
        e._();
        Batch.C((e => {
            switch (this.nt) {
              case 32:
                this.nt = 16;
                switch (this.ht) {
                  case "none":
                    return;

                  case "invoke-lifecycles":
                    return this.ot._t(t, this.lt, e);

                  case "replace":
                    e._();
                    void a(this.lt.context.Nt(this.hostController, this.lt), (s => {
                        (this.ct = s)._t(t, this.lt, e);
                        e.N();
                    }));
                }

              case 64:
                return;

              default:
                this.Et("canLoad");
            }
        })).$((t => {
            const e = this.lt;
            switch (this.ht) {
              case "none":
              case "invoke-lifecycles":
                {
                    t._();
                    const s = e.context;
                    void a(s.allResolved, (() => a(a(h(...e.residue.splice(0).map((t => createAndAppendNodes(this.B, e, t)))), (() => h(...s.getAvailableViewportAgents().reduce(((t, s) => {
                        const i = s.viewport;
                        const n = i.default;
                        if (n === null) return t;
                        t.push(createAndAppendNodes(this.B, e, ViewportInstruction.create({
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
                this.Et("canLoad");
            }
        })).$((() => {
            e.N();
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
                this.Et("unloading");
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
                this.Et("loading");
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
                this.Et("loading");
            }
        })).$((() => {
            e.N();
        })).C();
    }
    yt(t, e, s) {
        ensureTransitionHasNotErrored(e);
        ensureGuardsResultIsTrue(this, e);
        s._();
        switch (this.it) {
          case 256:
            this.it = 128;
            switch (this.ht) {
              case "none":
              case "invoke-lifecycles":
                s.N();
                return;

              case "replace":
                {
                    const i = this.hostController;
                    const n = this.ot;
                    e.$t((() => a(n.yt(t, i), (() => {
                        if (t === null) {
                            n.It();
                        }
                    }))), (() => {
                        s.N();
                    }));
                }
            }
            return;

          case 8192:
            s.N();
            return;

          case 128:
            s.N();
            return;

          default:
            this.Et("deactivate");
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
            this.Et("activate");
        }
    }
    At(t, e) {
        if (this.it === 8192) {
            this.vt(null, t, e);
            return;
        }
        if (this.nt === 64) {
            this.yt(null, t, e);
            return;
        }
        ensureTransitionHasNotErrored(t);
        ensureGuardsResultIsTrue(this, t);
        if (!(this.it === 256 && this.nt === 2)) {
            this.Et("swap");
        }
        this.it = 128;
        this.nt = 1;
        switch (this.ht) {
          case "none":
          case "invoke-lifecycles":
            {
                const s = mergeDistinct(this.lt.children, this.ut.children);
                for (const i of s) {
                    i.context.vpa.At(t, e);
                }
                return;
            }

          case "replace":
            {
                const s = this.hostController;
                const i = this.ot;
                const n = this.ct;
                e._();
                Batch.C((e => {
                    t.$t((() => {
                        e._();
                        return a(i.yt(null, s), (() => i.It()));
                    }), (() => {
                        e.N();
                    }));
                })).$((e => {
                    t.$t((() => {
                        e._();
                        return n.vt(null, s);
                    }), (() => {
                        e.N();
                    }));
                })).$((e => {
                    this.Pt(t, e);
                })).$((() => {
                    e.N();
                })).C();
                return;
            }
        }
    }
    Pt(t, e) {
        const s = this.lt;
        t.$t((() => {
            e._();
            const t = s.context;
            return a(t.allResolved, (() => {
                const e = s.children.slice();
                return a(h(...s.residue.splice(0).map((t => createAndAppendNodes(this.B, s, t)))), (() => a(h(...t.getAvailableViewportAgents().reduce(((t, e) => {
                    const i = e.viewport;
                    const n = i.default;
                    if (n === null) return t;
                    t.push(createAndAppendNodes(this.B, s, ViewportInstruction.create({
                        component: n,
                        viewport: i.name
                    })));
                    return t;
                }), [])), (() => s.children.filter((t => !e.includes(t)))))));
            }));
        }), (s => {
            Batch.C((e => {
                for (const i of s) {
                    t.$t((() => {
                        e._();
                        return i.context.vpa._t(t, e);
                    }), (() => {
                        e.N();
                    }));
                }
            })).$((e => {
                for (const i of s) {
                    t.$t((() => {
                        e._();
                        return i.context.vpa.Tt(t, e);
                    }), (() => {
                        e.N();
                    }));
                }
            })).$((e => {
                for (const i of s) {
                    t.$t((() => {
                        e._();
                        return i.context.vpa.vt(null, t, e);
                    }), (() => {
                        e.N();
                    }));
                }
            })).$((() => {
                e.N();
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
            this.Et("scheduleUpdate 1");
        }
        switch (this.it) {
          case 8192:
          case 4096:
          case 1024:
            break;

          default:
            this.Et("scheduleUpdate 2");
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
        let e = null;
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
            t = a(this.ot?.yt(null, this.hostController), (() => {
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
                e = a(this.ct?.yt(null, this.hostController), (() => {
                    this.ct?.It();
                    this.ht = "replace";
                    this.nt = 64;
                    this.ct = null;
                    this.lt = null;
                }));
                break;
            }
        }
        if (t !== null && e !== null) {
            this.dt = a(h(t, e), (() => {
                this.ft = null;
                this.dt = null;
            }));
        }
    }
    Lt() {
        if (this.ut !== null) {
            this.ut.children.forEach((function(t) {
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
                    this.Et("endTransition 1");
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
                    this.Et("endTransition 2");
                }
                break;

              default:
                this.Et("endTransition 3");
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
    Et(t) {
        throw new Error(getMessage(3352, t, this));
    }
}

function ensureGuardsResultIsTrue(t, e) {
    if (e.guardsResult !== true) throw new Error(getMessage(3353, e.guardsResult, t));
}

function ensureTransitionHasNotErrored(t) {
    if (t.error !== void 0 && !t.erredWithUnknownRoute) throw t.error;
}

var Y;

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
})(Y || (Y = {}));

const Q = new Map;

function $state(t) {
    let e = Q.get(t);
    if (e === void 0) {
        Q.set(t, e = stringifyState(t));
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
        this.Dt = h;
        this.title = u;
        this.component = l;
        this.children = f;
        this.residue = p;
        this.zt = 1;
        this.Ut = false;
        this.Bt ?? (this.Bt = n);
    }
    static create(t) {
        const {[j]: e, ...s} = t.params ?? {};
        return new RouteNode(t.path, t.finalPath, t.context, t.originalInstruction ?? t.instruction, t.instruction, Object.freeze(s), t.queryParams ?? J, t.fragment ?? null, Object.freeze(t.data ?? u), t.Dt ?? null, t.title ?? null, t.component, t.children ?? [], t.residue ?? []);
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
    Ht(t) {
        this.children.push(t);
        t.qt(this.jt);
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
    qt(t) {
        this.jt = t;
        for (const e of this.children) {
            e.qt(t);
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
        t.root.qt(this);
        return t;
    }
    Wt() {
        return new ViewportInstructionTree(this.options, true, this.root.children.map((t => t.Gt())), this.queryParams, this.fragment);
    }
    toString() {
        return this.root.toString();
    }
}

function createAndAppendNodes(t, e, s) {
    t.trace(`createAndAppendNodes(node:%s,vi:%s`, e, s);
    switch (s.component.type) {
      case 0:
        switch (s.component.value) {
          case "..":
            e = e.context.parent?.node ?? e;
            e.Ft();

          case ".":
            return h(...s.children.map((s => createAndAppendNodes(t, e, s))));

          default:
            {
                t.trace(`createAndAppendNodes invoking createNode`);
                const i = e.context;
                const n = s.I();
                let r = s.recognizedRoute;
                if (r !== null) return appendNode(t, e, createConfiguredNode(t, e, s, r, n));
                if (s.children.length === 0) {
                    const n = i.Yt(s);
                    if (n !== null) {
                        e.jt.queryParams = mergeURLSearchParams(e.jt.queryParams, n.query, true);
                        const i = n.vi;
                        i.children.push(...s.children);
                        return appendNode(t, e, createConfiguredNode(t, e, i, i.recognizedRoute, s));
                    }
                }
                let o = 0;
                let c = s.component.value;
                let h = s;
                while (h.children.length === 1) {
                    h = h.children[0];
                    if (h.component.type === 0) {
                        ++o;
                        c = `${c}/${h.component.value}`;
                    } else {
                        break;
                    }
                }
                r = i.recognize(c);
                t.trace("createNode recognized route: %s", r);
                const l = r?.residue ?? null;
                t.trace("createNode residue:", l);
                const f = l === null;
                if (r === null || l === c) {
                    const n = i.Yt({
                        component: s.component.value,
                        params: s.params ?? u,
                        open: s.open,
                        close: s.close,
                        viewport: s.viewport,
                        children: s.children.slice()
                    });
                    if (n !== null) {
                        e.jt.queryParams = mergeURLSearchParams(e.jt.queryParams, n.query, true);
                        return appendNode(t, e, createConfiguredNode(t, e, n.vi, n.vi.recognizedRoute, s));
                    }
                    const r = s.component.value;
                    if (r === "") return;
                    let o = s.viewport;
                    if (o === null || o.length === 0) o = it;
                    const c = i.getFallbackViewportAgent(o);
                    const h = c !== null ? c.viewport.et(s, e, i) : i.config.et(s, e, i);
                    if (h === null) throw new UnknownRouteError(getMessage(3401, r, i.gt, o, r, i.component.name));
                    if (typeof h === "string") {
                        t.trace(`Fallback is set to '${h}'. Looking for a recognized route.`);
                        const n = i.childRoutes.find((t => t.id === h));
                        if (n !== void 0) return appendNode(t, e, createFallbackNode(t, n, e, s));
                        t.trace(`No route configuration for the fallback '${h}' is found; trying to recognize the route.`);
                        const r = i.recognize(h, true);
                        if (r !== null && r.residue !== h) return appendNode(t, e, createConfiguredNode(t, e, s, r, null));
                    }
                    t.trace(`The fallback '${h}' is not recognized as a route; treating as custom element name.`);
                    return a(resolveRouteConfiguration(h, false, i.config, null, i), (i => appendNode(t, e, createFallbackNode(t, i, e, s))));
                }
                r.residue = null;
                s.component.value = f ? c : c.slice(0, -(l.length + 1));
                let p = !f;
                for (let t = 0; t < o; ++t) {
                    const t = s.children[0];
                    if (l?.startsWith(t.component.value) ?? false) {
                        p = false;
                        break;
                    }
                    s.viewport = t.viewport;
                    s.children = t.children;
                }
                if (p) {
                    s.children.unshift(ViewportInstruction.create(l));
                }
                s.recognizedRoute = r;
                t.trace("createNode after adjustment vi:%s", s);
                return appendNode(t, e, createConfiguredNode(t, e, s, r, n));
            }
        }

      case 3:
      case 4:
      case 2:
        {
            const i = e.context;
            return a(resolveCustomElementDefinition(s.component.value, i)[1], (n => {
                const {vi: r, query: o} = i.Yt({
                    component: n,
                    params: s.params ?? u,
                    open: s.open,
                    close: s.close,
                    viewport: s.viewport,
                    children: s.children.slice()
                });
                e.jt.queryParams = mergeURLSearchParams(e.jt.queryParams, o, true);
                return appendNode(t, e, createConfiguredNode(t, e, r, r.recognizedRoute, s));
            }));
        }
    }
}

function createConfiguredNode(t, e, s, i, n, r = i.route.endpoint.route) {
    const o = e.context;
    const c = e.jt;
    return a(r.handler, (h => {
        r.handler = h;
        t.trace(`creatingConfiguredNode(rdc:%s, vi:%s)`, h, s);
        if (h.redirectTo === null) {
            const u = (s.viewport?.length ?? 0) > 0;
            const l = u ? s.viewport : h.viewport;
            return a(resolveCustomElementDefinition(h.component, o)[1], (f => {
                const p = o.Qt(new ViewportRequest(l, f.name));
                if (!u) {
                    s.viewport = p.viewport.name;
                }
                const d = o.container.get(K);
                return a(d.getRouteContext(p, f, null, p.hostController.container, o.config, o, h), (o => {
                    t.trace("createConfiguredNode setting the context node");
                    const a = o.node = RouteNode.create({
                        path: i.route.endpoint.route.path,
                        finalPath: r.path,
                        context: o,
                        instruction: s,
                        originalInstruction: n,
                        params: {
                            ...i.route.params
                        },
                        queryParams: c.queryParams,
                        fragment: c.fragment,
                        data: h.data,
                        Dt: l,
                        component: f,
                        title: h.title,
                        residue: s.children.slice()
                    });
                    a.qt(e.jt);
                    t.trace(`createConfiguredNode(vi:%s) -> %s`, s, a);
                    return a;
                }));
            }));
        }
        const u = RouteExpression.parse(r.path, false);
        const l = RouteExpression.parse(h.redirectTo, false);
        let f;
        let p;
        const d = [];
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
        let g;
        let w;
        let v = false;
        let m = false;
        while (!(v && m)) {
            if (v) {
                g = null;
            } else if (f.kind === 4) {
                g = f;
                v = true;
            } else if (f.left.kind === 4) {
                g = f.left;
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
            if (m) {
                w = null;
            } else if (p.kind === 4) {
                w = p;
                m = true;
            } else if (p.left.kind === 4) {
                w = p.left;
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
            if (w !== null) {
                if (w.component.isDynamic && (g?.component.isDynamic ?? false)) {
                    d.push(i.route.params[w.component.parameterName]);
                } else {
                    d.push(w.raw);
                }
            }
        }
        const E = d.filter(Boolean).join("/");
        const R = o.recognize(E);
        if (R === null) throw new UnknownRouteError(getMessage(3402, E, o.gt, E, o.component.name));
        return createConfiguredNode(t, e, ViewportInstruction.create({
            recognizedRoute: R,
            component: E,
            children: s.children,
            viewport: s.viewport,
            open: s.open,
            close: s.close
        }), R, n);
    }));
}

function appendNode(t, e, s) {
    return a(s, (s => {
        t.trace(`appendNode($childNode:%s)`, s);
        e.Ht(s);
        return s.context.vpa.Vt(e.jt.options, s);
    }));
}

function createFallbackNode(t, e, s, i) {
    const n = new $RecognizedRoute(new M(new O(new L(e.path[0], e.caseSensitive, e), []), u), null);
    i.children.length = 0;
    return createConfiguredNode(t, s, i, n, null);
}

const J = Object.freeze(new URLSearchParams);

function isManagedState(t) {
    return e(t) && Object.prototype.hasOwnProperty.call(t, D) === true;
}

function toManagedState(t, e) {
    return {
        ...t,
        [D]: e
    };
}

class UnknownRouteError extends Error {}

class Transition {
    get erredWithUnknownRoute() {
        return this.Jt;
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

const K = /*@__PURE__*/ s.createInterface("IRouter", (t => t.singleton(Router)));

class Router {
    get Kt() {
        const t = this.Xt;
        if (t !== null) return t;
        if (!this.c.has(rt, true)) throw new Error(getMessage(3271));
        return this.Xt = this.c.get(rt);
    }
    get routeTree() {
        let t = this.Zt;
        if (t === null) {
            const e = this.Kt;
            t = this.Zt = new RouteTree(NavigationOptions.create(this.options, {}), J, null, RouteNode.create({
                path: "",
                finalPath: "",
                context: e,
                instruction: null,
                component: y.getDefinition(e.config.component),
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
        this.c = i(l);
        this.ae = i(S);
        this.B = i(r).root.scopeTo("Router");
        this.A = i(z);
        this.he = i(q);
        this.options = i(B);
        this.ue = new Map;
        this.ee = ViewportInstructionTree.create("", this.options);
        this.c.registerResolver(Router, f.instance(Router, this));
    }
    le(t) {
        return RouteContext.resolve(this.Kt, t);
    }
    start(t) {
        this.ce = typeof this.options.buildTitle === "function";
        this.he.startListening();
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
            return this.load(this.he.getPath(), {
                historyStrategy: "replace"
            });
        }
    }
    stop() {
        this.he.stopListening();
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
    getRouteContext(t, e, s, i, n, r, o) {
        return a(o instanceof RouteConfig ? o : resolveRouteConfiguration(typeof s?.getRouteConfig === "function" ? s : e.Type, false, n, null, r), (s => {
            let n = this.ue.get(t);
            if (n === void 0) {
                this.ue.set(t, n = new WeakMap);
            }
            let r = n.get(s);
            if (r !== void 0) {
                return r;
            }
            const o = i.has(rt, true) ? i.get(rt) : null;
            n.set(s, r = new RouteContext(t, o, e, s, i, this));
            return r;
        }));
    }
    createViewportInstructions(t, e) {
        if (t instanceof ViewportInstructionTree) return t;
        let s = e?.context ?? null;
        if (typeof t === "string") {
            t = this.he.removeBaseHref(t);
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
        const u = this.re = Transition.K({
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
                this.$t(u);
            } catch (t) {
                u.bt(t);
            }
        }
        return u.promise.then((t => t)).catch((t => {
            error(r, 3270, u, t);
            if (u.erredWithUnknownRoute) {
                this.pe(u);
            } else {
                this.se = false;
                this.A.publish(new NavigationErrorEvent(u.id, u.instructions, t));
                if (h) {
                    this.pe(u);
                } else {
                    const t = this.re;
                    if (t !== null) {
                        t.previousRouteTree = u.previousRouteTree;
                    } else {
                        this.Zt = u.previousRouteTree;
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
        let e = this.le(t.options.context);
        this.A.publish(new NavigationStartEvent(t.id, t.instructions, t.trigger, t.managedState));
        if (this.re !== null) {
            return this.$t(this.re);
        }
        t.$t((() => {
            const s = t.finalInstructions;
            const i = this.Kt;
            const n = t.routeTree;
            n.options = s.options;
            n.queryParams = i.node.jt.queryParams = s.queryParams;
            n.fragment = i.node.jt.fragment = s.fragment;
            const o = /*@__PURE__*/ e.container.get(r).scopeTo("RouteTree");
            if (s.isAbsolute) {
                e = i;
            }
            if (e === i) {
                n.root.qt(n);
                i.node = n.root;
            }
            const c = e.allResolved instanceof Promise ? " - awaiting promise" : "";
            o.trace(`updateRouteTree(rootCtx:%s,rt:%s,vit:%s)${c}`, i, n, s);
            return a(e.allResolved, (() => updateNode(o, s, e, i.node)));
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
                const e = t.finalInstructions.toUrl(this.options.useUrlFragmentHash);
                switch (t.options.P(this.ee)) {
                  case "none":
                    break;

                  case "push":
                    this.he.pushState(toManagedState(t.options.state, t.id), this.updateTitle(t), e);
                    break;

                  case "replace":
                    this.he.replaceState(toManagedState(t.options.state, t.id), this.updateTitle(t), e);
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
        const e = t.previousRouteTree.root.children;
        const s = t.routeTree.root.children;
        const i = mergeDistinct(e, s);
        i.forEach((function(t) {
            t.context.vpa.Ot();
        }));
        this.ee = t.prevInstructions;
        this.Zt = t.previousRouteTree;
        this.se = false;
        const n = t.guardsResult;
        this.A.publish(new NavigationCancelEvent(t.id, t.instructions, `guardsResult is ${n}`));
        if (n === false) {
            t.resolve(false);
            this.de();
        } else {
            let e;
            if (this.ie && (t.erredWithUnknownRoute || t.error != null && this.options.restorePreviousRouteTreeOnError)) e = t.prevInstructions; else if (n === true) return; else e = n;
            void a(this.fe(e, "api", t.managedState, t), (() => {}));
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

function updateNode(t, e, s, i) {
    t.trace(`updateNode(ctx:%s,node:%s)`, s, i);
    i.queryParams = e.queryParams;
    i.fragment = e.fragment;
    if (!i.context.isRoot) {
        i.context.vpa.Vt(i.jt.options, i);
    }
    if (i.context === s) {
        i.Ft();
        return a(h(...e.children.map((e => createAndAppendNodes(t, i, e)))), (() => h(...s.getAvailableViewportAgents().reduce(((e, s) => {
            const n = s.viewport;
            const r = n.default;
            if (r === null) return e;
            e.push(createAndAppendNodes(t, i, ViewportInstruction.create({
                component: r,
                viewport: n.name
            })));
            return e;
        }), []))));
    }
    return h(...i.children.map((i => updateNode(t, e, s, i))));
}

const X = [ "?", "#", "/", "+", "(", ")", ".", "@", "!", "=", ",", "&", "'", "~", ";" ];

class ParserState {
    get h() {
        return this.ge.length === 0;
    }
    constructor(t) {
        this.we = t;
        this.ve = [];
        this.me = 0;
        this.Ee = 0;
        this.ge = t;
    }
    Re(...t) {
        const e = this.ge;
        return t.some((function(t) {
            return e.startsWith(t);
        }));
    }
    ye(t) {
        if (this.Re(t)) {
            this.ge = this.ge.slice(t.length);
            this.Ee += t.length;
            this.xe(t);
            return true;
        }
        return false;
    }
    Se(t) {
        if (!this.ye(t)) {
            this.Ce(`'${t}'`);
        }
    }
    Ce(t) {
        throw new Error(getMessage(3500, t, this.Ee, this.we, this.ge, this.ge));
    }
    be() {
        if (!this.h) {
            throw new Error(getMessage(3501, this.ge, this.Ee, this.we));
        }
    }
    _e() {
        const t = this.ge[0];
        this.ge = this.ge.slice(1);
        ++this.Ee;
        this.xe(t);
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
    xe(t) {
        const e = this.me;
        const s = this.ve;
        for (let i = 0; i < e; ++i) {
            s[i] += t;
        }
    }
}

var Z;

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
})(Z || (Z = {}));

const tt = new Map;

const et = new Map;

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
        const s = e ? tt : et;
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
            return new RouteExpression("", false, SegmentExpression.EMPTY, n != null ? Object.freeze(n) : J, s, e);
        }
        const o = new ParserState(t);
        o.Ne();
        const c = o.ye("/");
        const a = CompositeSegmentExpression.Ie(o);
        o.be();
        const h = o.ke();
        return new RouteExpression(h, c, a, n != null ? Object.freeze(n) : J, s, e);
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
        const e = t.ye("+");
        const s = [];
        do {
            s.push(ScopedSegmentExpression.Ie(t));
        } while (t.ye("+"));
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
        if (t.ye("/")) {
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
        if (t.ye("(")) {
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
        const n = !t.ye("!");
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
        if (!t.h) {
            if (t.Re("./")) {
                t._e();
            } else if (t.Re("../")) {
                t._e();
                t._e();
            } else {
                while (!t.h && !t.Re(...X)) {
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
        if (t.ye(".")) {
            t.Ne();
            while (!t.h && !t.Re(...X)) {
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
        if (t.ye("@")) {
            t.Ne();
            while (!t.h && !t.Re(...X)) {
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
        if (t.ye("(")) {
            do {
                e.push(ParameterExpression.Ie(t, e.length));
                if (!t.ye(",")) {
                    break;
                }
            } while (!t.h && !t.Re(")"));
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
        while (!t.h && !t.Re(...X)) {
            t._e();
        }
        let s = decodeURIComponent(t.ke());
        if (s.length === 0) {
            t.Ce("parameter key");
        }
        let i;
        if (t.ye("=")) {
            t.Ne();
            while (!t.h && !t.Re(...X)) {
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

const st = Object.freeze({
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

const it = "default";

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
        const n = e.length === 0 || i === null || i.length === 0 || i === it ? "" : `@${i}`;
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
    const e = Object.keys(t);
    const s = Array(e.length);
    const i = [];
    const n = [];
    for (const t of e) {
        if (p(t)) {
            i.push(Number(t));
        } else {
            n.push(t);
        }
    }
    for (let r = 0; r < e.length; ++r) {
        const e = i.indexOf(r);
        if (e > -1) {
            s[r] = t[r];
            i.splice(e, 1);
        } else {
            const e = n.shift();
            s[r] = `${e}=${t[e]}`;
        }
    }
    return s.join(",");
}

class ViewportInstructionTree {
    constructor(t, e, s, i, n) {
        this.options = t;
        this.isAbsolute = e;
        this.children = s;
        this.queryParams = i;
        this.fragment = n;
    }
    static create(t, e, s, i) {
        const n = NavigationOptions.create(e, {
            ...s
        });
        let r = n.context;
        if (!(r instanceof RouteContext) && i != null) {
            r = RouteContext.resolve(i, r);
        }
        const o = r != null;
        if (t instanceof Array) {
            const e = t.length;
            const s = new Array(e);
            const i = new URLSearchParams(n.queryParams ?? u);
            for (let n = 0; n < e; n++) {
                const e = t[n];
                const c = o ? r.Yt(e) : null;
                if (c !== null) {
                    s[n] = c.vi;
                    mergeURLSearchParams(i, c.query, false);
                } else {
                    s[n] = ViewportInstruction.create(e);
                }
            }
            return new ViewportInstructionTree(n, false, s, i, n.fragment);
        }
        if (typeof t === "string") {
            const s = RouteExpression.parse(t, e.useUrlFragmentHash);
            return s.toInstructionTree(n);
        }
        const c = o ? r.Yt(isPartialViewportInstruction(t) ? {
            ...t,
            params: t.params ?? u
        } : {
            component: t,
            params: u
        }) : null;
        const a = new URLSearchParams(n.queryParams ?? u);
        return c !== null ? new ViewportInstructionTree(n, false, [ c.vi ], mergeURLSearchParams(a, c.query, false), n.fragment) : new ViewportInstructionTree(n, false, [ ViewportInstruction.create(t) ], a, n.fragment);
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
    toUrl(t = false) {
        let e;
        let s;
        if (t) {
            e = "";
            s = `#${this.toPath()}`;
        } else {
            e = this.toPath();
            const t = this.fragment;
            s = t !== null && t.length > 0 ? `#${t}` : "";
        }
        let i = this.queryParams.toString();
        i = i === "" ? "" : `?${i}`;
        return `${e}${i}${s}`;
    }
    toPath() {
        return this.children.map((t => t.toUrlComponent())).join("+");
    }
    toString() {
        return `[${this.children.map(String).join(",")}]`;
    }
}

var nt;

(function(t) {
    t[t["string"] = 0] = "string";
    t[t["ViewportInstruction"] = 1] = "ViewportInstruction";
    t[t["CustomElementDefinition"] = 2] = "CustomElementDefinition";
    t[t["Promise"] = 3] = "Promise";
    t[t["IRouteViewModel"] = 4] = "IRouteViewModel";
})(nt || (nt = {}));

class TypedNavigationInstruction {
    constructor(t, e) {
        this.type = t;
        this.value = e;
    }
    static create(t) {
        if (t instanceof TypedNavigationInstruction) {
            return t;
        }
        if (typeof t === "string") return new TypedNavigationInstruction(0, t);
        if (!e(t)) expectType("function/class or object", "", t);
        if (typeof t === "function") {
            if (y.isType(t)) {
                const e = y.getDefinition(t);
                return new TypedNavigationInstruction(2, e);
            } else {
                return TypedNavigationInstruction.create(t());
            }
        }
        if (t instanceof Promise) return new TypedNavigationInstruction(3, t);
        if (isPartialViewportInstruction(t)) {
            const e = ViewportInstruction.create(t);
            return new TypedNavigationInstruction(1, e);
        }
        if (v(t)) return new TypedNavigationInstruction(4, t);
        if (t instanceof C) return new TypedNavigationInstruction(2, t);
        throw new Error(getMessage(3400, tryStringify(t)));
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
            return `VM(name:'${y.getDefinition(this.value.constructor).name}')`;

          case 1:
            return this.value.toString();

          case 0:
            return `'${this.value}'`;
        }
    }
}

class ComponentAgent {
    constructor(t, e, s, i, n) {
        this.Ve = t;
        this.Me = e;
        this.Mt = s;
        this.Kt = i;
        this.Oe = n;
        this.B = i.container.get(r).scopeTo(`ComponentAgent<${i.gt}>`);
        const o = e.lifecycleHooks;
        this.Le = (o.canLoad ?? []).map((t => t.instance));
        this.je = (o.loading ?? []).map((t => t.instance));
        this.Ue = (o.canUnload ?? []).map((t => t.instance));
        this.Be = (o.unloading ?? []).map((t => t.instance));
        this.De = "canLoad" in t;
        this.ze = "loading" in t;
        this.He = "canUnload" in t;
        this.qe = "unloading" in t;
    }
    vt(t, e) {
        if (t === null) {
            return this.Me.activate(this.Me, e);
        }
        void this.Me.activate(t, e);
    }
    yt(t, e) {
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
        if (this.He) {
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
        if (this.qe) {
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

const rt = /*@__PURE__*/ s.createInterface("IRouteContext");

const ot = Object.freeze([ "string", "object", "function" ]);

function isEagerInstruction(t) {
    if (t == null) return false;
    const e = t.params;
    const s = t.component;
    return typeof e === "object" && e !== null && s != null && ot.includes(typeof s) && !(s instanceof Promise);
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
    constructor(t, e, s, i, n, o) {
        this.parent = e;
        this.component = s;
        this.config = i;
        this.Je = o;
        this.Ke = [];
        this.childRoutes = [];
        this.Fe = null;
        this.We = null;
        this.Ge = null;
        this.Xe = false;
        this.Ye = t;
        if (e === null) {
            this.root = this;
            this.path = [ this ];
            this.gt = s.name;
        } else {
            this.root = e.root;
            this.path = [ ...e.path, this ];
            this.gt = `${e.gt}/${s.name}`;
        }
        this.B = n.get(r).scopeTo(`RouteContext<${this.gt}>`);
        this.Ze = n.get(d);
        const c = this.container = n.createChild();
        c.registerResolver(b, this.ts = new g, true);
        const a = new g("IRouteContext", this);
        c.registerResolver(rt, a);
        c.registerResolver(RouteContext, a);
        c.register(i);
        this.es = new U;
        if (o.options.useNavigationModel) {
            const t = this.Qe = new NavigationModel([]);
            c.get(z).subscribe("au:router:navigation-end", (() => t.ss(o, this)));
        } else {
            this.Qe = null;
        }
        this.ns(i);
    }
    ns(t) {
        const e = [];
        const s = t.routes ?? F;
        const i = s.length;
        if (i === 0) {
            const e = t.component.prototype?.getRouteConfig;
            this.Xe = e == null ? true : typeof e !== "function";
            return;
        }
        const n = this.Qe;
        const r = n !== null;
        let o = 0;
        for (;o < i; o++) {
            const i = s[o];
            if (i instanceof Promise) {
                e.push(this.rs(i));
                continue;
            }
            const a = resolveRouteConfiguration(i, true, t, null, this);
            if (a instanceof Promise) {
                if (!isPartialChildRouteConfig(i) || i.path == null) throw new Error(getMessage(3173));
                for (const t of ensureArrayOfStrings(i.path)) {
                    this.os(t, i.caseSensitive ?? false, a);
                }
                const t = this.childRoutes.length;
                const s = a.then((e => this.childRoutes[t] = e));
                this.childRoutes.push(s);
                if (r) {
                    n.rs(s);
                }
                e.push(s.then(w));
                continue;
            }
            for (const t of a.path ?? c) {
                this.os(t, a.caseSensitive, a);
            }
            this.childRoutes.push(a);
            if (r) {
                n.rs(a);
            }
        }
        this.Xe = true;
        if (e.length > 0) {
            this.Fe = Promise.all(e).then((() => {
                this.Fe = null;
            }));
        }
    }
    static setRoot(t) {
        const e = t.get(r).scopeTo("RouteContext");
        if (!t.has(_, true)) {
            logAndThrow(new Error(getMessage(3167)), e);
        }
        if (t.has(rt, true)) {
            logAndThrow(new Error(getMessage(3168)), e);
        }
        const {controller: s} = t.get(_);
        if (s === void 0) {
            logAndThrow(new Error(getMessage(3169)), e);
        }
        const i = t.get(K);
        return a(i.getRouteContext(null, s.definition, s.viewModel, s.container, null, null, null), (e => {
            t.register(f.instance(rt, e));
            e.node = i.routeTree.root;
        }));
    }
    static resolve(t, e) {
        const s = t.container;
        const i = s.get(r).scopeTo("RouteContext");
        if (e == null) {
            return t;
        }
        if (e instanceof RouteContext) {
            return e;
        }
        if (e instanceof s.get(S).Node) {
            try {
                const t = y.for(e, {
                    searchParents: true
                });
                return t.container.get(rt);
            } catch (t) {
                error(i, 3155, e.nodeName, t);
                throw t;
            }
        }
        if (v(e)) {
            const t = e.$controller;
            return t.container.get(rt);
        }
        if (N(e)) {
            const t = e;
            return t.container.get(rt);
        }
        logAndThrow(new Error(getMessage(3170, Object.prototype.toString.call(e))), i);
    }
    dispose() {
        this.container.dispose();
    }
    Qt(t) {
        const e = this.Ke.find((e => e.xt(t)));
        if (e === void 0) throw new Error(getMessage(3174, t, this.cs()));
        return e;
    }
    getAvailableViewportAgents() {
        return this.Ke.filter((t => t.St()));
    }
    getFallbackViewportAgent(t) {
        return this.Ke.find((e => e.St() && e.viewport.name === t && e.viewport.fallback !== "")) ?? null;
    }
    Nt(t, e) {
        this.ts.prepare(t);
        const s = this.container;
        const i = s.get(e.component.key);
        const n = this.Xe ? void 0 : a(resolveRouteConfiguration(i, false, this.config, e, null), (t => this.ns(t)));
        return a(n, (() => {
            const n = x.$el(s, i, t.host, null);
            const r = new ComponentAgent(i, n, e, this, this.Je.options);
            this.ts.dispose();
            return r;
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
        let i = true;
        let n = null;
        while (i) {
            n = s.es.recognize(t);
            if (n === null) {
                if (!e || s.isRoot) return null;
                s = s.parent;
            } else {
                i = false;
            }
        }
        return new $RecognizedRoute(n, Reflect.has(n.params, j) ? n.params[j] ?? null : null);
    }
    rs(t) {
        return a(resolveRouteConfiguration(t, true, this.config, null, this), (t => {
            for (const e of t.path ?? c) {
                this.os(e, t.caseSensitive, t);
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
        return this.Ze.load(t, (e => {
            const s = e.raw;
            if (typeof s === "function") {
                const t = o.resource.getAll(s).find(isCustomElementDefinition);
                if (t !== void 0) return t;
            }
            let i = void 0;
            let n = void 0;
            for (const t of e.items) {
                if (t.isConstructable) {
                    const e = t.definitions.find(isCustomElementDefinition);
                    if (e !== void 0) {
                        if (t.key === "default") {
                            i = e;
                        } else if (n === void 0) {
                            n = e;
                        }
                    }
                }
            }
            if (i === void 0 && n === void 0) throw new Error(getMessage(3175, t));
            return n ?? i;
        }));
    }
    Yt(t) {
        if (!isEagerInstruction(t)) return null;
        const e = t.component;
        let s;
        let i = false;
        if (e instanceof RouteConfig) {
            s = e.path;
            i = true;
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
            i = true;
        }
        if (s === void 0) return null;
        const n = t.params;
        const r = this.es;
        const o = s.length;
        const c = [];
        let a = null;
        if (o === 1) {
            const e = core(s[0]);
            if (e === null) {
                if (i) throw new Error(getMessage(3166, t, c));
                return null;
            }
            return {
                vi: ViewportInstruction.create({
                    recognizedRoute: new $RecognizedRoute(new M(e.endpoint, e.consumed), null),
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
        for (let t = 0; t < o; t++) {
            const e = core(s[t]);
            if (e === null) continue;
            if (a === null) {
                a = e;
                h = Object.keys(e.consumed).length;
            } else if (Object.keys(e.consumed).length > h) {
                a = e;
            }
        }
        if (a === null) {
            if (i) throw new Error(getMessage(3166, t, c));
            return null;
        }
        return {
            vi: ViewportInstruction.create({
                recognizedRoute: new $RecognizedRoute(new M(a.endpoint, a.consumed), null),
                component: a.path,
                children: t.children,
                viewport: t.viewport,
                open: t.open,
                close: t.close
            }),
            query: a.query
        };
        function core(t) {
            const e = r.getEndpoint(t);
            if (e === null) {
                c.push(`No endpoint found for the path: '${t}'.`);
                return null;
            }
            const s = Object.create(null);
            for (const i of e.params) {
                const e = i.name;
                let r = n[e];
                if (r == null || String(r).length === 0) {
                    if (!i.isOptional) {
                        c.push(`No value for the required parameter '${e}' is provided for the path: '${t}'.`);
                        return null;
                    }
                    r = "";
                } else {
                    s[e] = r;
                }
                const o = i.isStar ? `*${e}` : i.isOptional ? `:${e}?` : `:${e}`;
                t = t.replace(o, r);
            }
            const i = Object.keys(s);
            const o = Object.fromEntries(Object.entries(n).filter((([t]) => !i.includes(t))));
            return {
                path: t.replace(/\/\//g, "/"),
                endpoint: e,
                consumed: s,
                query: o
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
    return y.isType(t.Type);
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
        return a(this.ps, w);
    }
    ss(t, e) {
        void a(this.ps, (() => {
            for (const s of this.routes) {
                s.ss(t, e);
            }
        }));
    }
    rs(t) {
        const e = this.routes;
        if (!(t instanceof Promise)) {
            if (t.nav ?? false) {
                e.push(NavigationRoute.K(t));
            }
            return;
        }
        const s = e.length;
        e.push(void 0);
        let i = void 0;
        i = this.ps = a(this.ps, (() => a(t, (t => {
            if (t.nav) {
                e[s] = NavigationRoute.K(t);
            } else {
                e.splice(s, 1);
            }
            if (this.ps === i) {
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
        return new NavigationRoute(t.id, ensureArrayOfStrings(t.path ?? c), t.redirectTo, t.title, t.data);
    }
    get isActive() {
        return this.rt;
    }
    ss(t, e) {
        let s = this.ds;
        if (s === null) {
            const i = t.options;
            s = this.ds = this.path.map((t => {
                const s = e.es.getEndpoint(t);
                if (s === null) throw new Error(getMessage(3450, t));
                return new ViewportInstructionTree(NavigationOptions.create(i, {
                    context: e
                }), false, [ ViewportInstruction.create({
                    recognizedRoute: new $RecognizedRoute(new M(s, u), null),
                    component: t
                }) ], J, null);
            }));
        }
        this.rt = s.some((e => t.routeTree.contains(e, {
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

let ct = class ViewportCustomElement {
    constructor() {
        this.name = it;
        this.usedBy = "";
        this.default = "";
        this.fallback = "";
        this.gs = void 0;
        this.Me = void 0;
        this.Kt = i(rt);
        this.B = i(r).scopeTo(`au-viewport<${this.Kt.gt}>`);
    }
    et(t, e, s) {
        const i = this.fallback;
        return typeof i === "function" && !y.isType(i) ? i(t, e, s) : i;
    }
    hydrated(t) {
        this.Me = t;
        this.gs = this.Kt.us(this);
    }
    attaching(t, e) {
        return this.gs.wt(t, this.Me);
    }
    detaching(t, e) {
        return this.gs.Rt(t, this.Me);
    }
    dispose() {
        this.Kt.ls(this);
        this.gs.It();
        this.gs = void 0;
    }
    toString() {
        const t = [];
        for (const e of at) {
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

__decorate([ T ], ct.prototype, "name", void 0);

__decorate([ T ], ct.prototype, "usedBy", void 0);

__decorate([ T ], ct.prototype, "default", void 0);

__decorate([ T ], ct.prototype, "fallback", void 0);

ct = __decorate([ k({
    name: "au-viewport"
}) ], ct);

const at = [ "name", "usedBy", "default", "fallback" ];

let ht = class LoadCustomAttribute {
    constructor() {
        this.ws = i(I);
        this.Je = i(K);
        this.Kt = i(rt);
        this.A = i(z);
        this.he = i(q);
        this.attribute = "href";
        this.active = false;
        this.vs = null;
        this.ee = null;
        this.Es = null;
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
        this.Rs = !t.hasAttribute("external") && !t.hasAttribute("data-external");
        this.ys = this.Je.options.activeClass;
    }
    binding() {
        if (this.Rs) {
            this.ws.addEventListener("click", this.onClick);
        }
        this.valueChanged();
        this.Es = this.A.subscribe("au:router:navigation-end", (t => {
            const e = this.active = this.ee !== null && this.Je.isActive(this.ee, this.context);
            const s = this.ys;
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
        if (this.Rs) {
            this.ws.removeEventListener("click", this.onClick);
        }
        this.Es.dispose();
    }
    valueChanged() {
        const t = this.Je;
        const e = t.options.useUrlFragmentHash;
        const s = this.route;
        let i = this.context;
        if (i === void 0) {
            i = this.context = this.Kt;
        } else if (i === null) {
            i = this.context = this.Kt.root;
        }
        if (s != null && i.allResolved === null) {
            const n = this.params;
            const r = this.ee = t.createViewportInstructions(typeof n === "object" && n !== null ? {
                component: s,
                params: n
            } : s, {
                context: i
            });
            this.vs = r.toUrl(e);
        } else {
            this.ee = null;
            this.vs = null;
        }
        const n = y.for(this.ws, {
            optional: true
        });
        if (n !== null) {
            n.viewModel[this.attribute] = this.ee;
        } else {
            if (this.vs === null) {
                this.ws.removeAttribute(this.attribute);
            } else {
                const t = e ? this.vs : this.he.addBaseHref(this.vs);
                this.ws.setAttribute(this.attribute, t);
            }
        }
    }
};

__decorate([ T({
    mode: 2,
    primary: true,
    callback: "valueChanged"
}) ], ht.prototype, "route", void 0);

__decorate([ T({
    mode: 2,
    callback: "valueChanged"
}) ], ht.prototype, "params", void 0);

__decorate([ T({
    mode: 2
}) ], ht.prototype, "attribute", void 0);

__decorate([ T({
    mode: 4
}) ], ht.prototype, "active", void 0);

__decorate([ T({
    mode: 2,
    callback: "valueChanged"
}) ], ht.prototype, "context", void 0);

ht = __decorate([ $("load") ], ht);

let ut = class HrefCustomAttribute {
    get xs() {
        return this.ws.hasAttribute("external") || this.ws.hasAttribute("data-external");
    }
    constructor() {
        this.ws = i(I);
        this.Je = i(K);
        this.Kt = i(rt);
        this.Ss = false;
        if (this.Je.options.useHref && this.ws.nodeName === "A") {
            const t = i(R).name;
            switch (this.ws.getAttribute("target")) {
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
        if (!this.Ss) {
            this.Ss = true;
            this.Rs = this.Rs && P(this.ws, A.getDefinition(ht).key) === null;
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
        if (t.altKey || t.ctrlKey || t.shiftKey || t.metaKey || t.button !== 0 || this.xs || !this.Rs) {
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

__decorate([ T({
    mode: 2
}) ], ut.prototype, "value", void 0);

ut = __decorate([ $({
    name: "href",
    noMultiBindings: true
}) ], ut);

const lt = K;

const ft = [ lt ];

const pt = ct;

const dt = ht;

const gt = ut;

const wt = [ ct, ht, ut ];

function configure(t, s) {
    let i = null;
    if (e(s)) {
        i = s.basePath ?? null;
    } else {
        s = {};
    }
    const n = RouterOptions.create(s);
    return t.register(f.cachedCallback(H, ((t, e, s) => {
        const n = t.get(R);
        const r = new URL(n.document.baseURI);
        r.pathname = normalizePath(i ?? r.pathname);
        return r;
    })), f.instance(B, n), f.instance(RouterOptions, n), V.hydrated(l, RouteContext.setRoot), V.activated(K, (t => t.start(true))), V.deactivated(K, (t => {
        t.stop();
    })), ...ft, ...wt);
}

const vt = {
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

const mt = /*@__PURE__*/ s.createInterface("IStateManager", (t => t.singleton(ScrollStateManager)));

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

export { st as AST, ActionExpression, D as AuNavId, ComponentExpression, CompositeSegmentExpression, ft as DefaultComponents, wt as DefaultResources, Z as ExpressionKind, ut as HrefCustomAttribute, gt as HrefCustomAttributeRegistration, q as ILocationManager, rt as IRouteContext, K as IRouter, z as IRouterEvents, B as IRouterOptions, mt as IStateManager, ht as LoadCustomAttribute, dt as LoadCustomAttributeRegistration, LocationChangeEvent, NavigationCancelEvent, NavigationEndEvent, NavigationErrorEvent, NavigationOptions, NavigationStartEvent, ParameterExpression, ParameterListExpression, G as Route, RouteConfig, RouteContext, RouteExpression, RouteNode, RouteTree, Router, vt as RouterConfiguration, RouterOptions, lt as RouterRegistration, ScopedSegmentExpression, SegmentExpression, SegmentGroupExpression, Transition, ViewportAgent, ct as ViewportCustomElement, pt as ViewportCustomElementRegistration, ViewportExpression, isManagedState, route, toManagedState };
//# sourceMappingURL=index.mjs.map
