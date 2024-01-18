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
                t.$();
            }
            t = t.h;
        } while (t !== null);
    }
    $() {
        const t = this.i;
        if (t !== null) {
            this.i = null;
            t(this);
            this.u = true;
        }
    }
    T(t) {
        if (this.h === null) {
            return this.h = new Batch(this.t, t, this.R);
        } else {
            return this.h.T(t);
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
        if (s == null) continue;
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

const n = "au-nav-id";

class Subscription {
    constructor(t, e, s) {
        this.I = t;
        this.P = e;
        this.V = s;
        this.O = false;
    }
    dispose() {
        if (!this.O) {
            this.O = true;
            this.V.dispose();
            const t = this.I["A"];
            t.splice(t.indexOf(this), 1);
        }
    }
}

const r = /*@__PURE__*/ e.DI.createInterface("IRouterEvents", (t => t.singleton(RouterEvents)));

class RouterEvents {
    constructor() {
        this.M = 0;
        this.A = [];
        this.j = e.resolve(e.IEventAggregator);
        this.U = e.resolve(e.ILogger).scopeTo("RouterEvents");
    }
    publish(t) {
        this.j.publish(t.name, t);
    }
    subscribe(t, e) {
        const s = new Subscription(this, ++this.M, this.j.subscribe(t, (t => {
            e(t);
        })));
        this.A.push(s);
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

const o = /*@__PURE__*/ e.DI.createInterface("IBaseHref");

const c = /*@__PURE__*/ e.DI.createInterface("ILocationManager", (t => t.singleton(BrowserLocationManager)));

class BrowserLocationManager {
    constructor() {
        this.L = 0;
        this.U = e.resolve(e.ILogger).root.scopeTo("LocationManager");
        this.I = e.resolve(r);
        this.B = e.resolve(s.IHistory);
        this.l = e.resolve(s.ILocation);
        this.q = e.resolve(s.IWindow);
        this.H = e.resolve(o);
        this.F = e.resolve(x).useUrlFragmentHash ? "hashchange" : "popstate";
    }
    startListening() {
        this.q.addEventListener(this.F, this, false);
    }
    stopListening() {
        this.q.removeEventListener(this.F, this, false);
    }
    handleEvent(t) {
        this.I.publish(new LocationChangeEvent(++this.L, this.getPath(), this.F, "state" in t ? t.state : null));
    }
    pushState(t, e, s) {
        s = this.addBaseHref(s);
        this.B.pushState(t, e, s);
    }
    replaceState(t, e, s) {
        s = this.addBaseHref(s);
        this.B.replaceState(t, e, s);
    }
    getPath() {
        const {pathname: t, search: e, hash: s} = this.l;
        return this.removeBaseHref(`${t}${normalizeQuery(e)}${s}`);
    }
    addBaseHref(t) {
        let e;
        let s = this.H.href;
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
        const e = this.H.pathname;
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

const a = e.emptyArray;

class RouteConfig {
    get path() {
        const t = this.G;
        if (t.length > 0) return t;
        const e = s.CustomElement.getDefinition(this.component);
        return this.G = [ e.name, ...e.aliases ];
    }
    constructor(t, e, s, i, n, r, o, c, a, u, h, l) {
        this.id = t;
        this.G = e;
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
        this.W = false;
    }
    static J(t, s) {
        if (typeof t === "string" || t instanceof Array) {
            const e = ensureArrayOfStrings(t);
            const i = s?.redirectTo ?? null;
            const n = s?.caseSensitive ?? false;
            const r = ensureString(s?.id ?? (e instanceof Array ? e[0] : e));
            const o = s?.title ?? null;
            const c = s?.transitionPlan ?? null;
            const u = s?.viewport ?? E;
            const h = s?.data ?? {};
            const l = s?.routes ?? a;
            return new RouteConfig(r, e, o, i, n, c, u, h, l, s?.fallback ?? null, s, s?.nav ?? true);
        } else if (typeof t === "object") {
            const i = t;
            validateRouteConfig(i, "");
            const n = ensureArrayOfStrings(i.path ?? s?.path ?? e.emptyArray);
            const r = i.title ?? s?.title ?? null;
            const o = i.redirectTo ?? s?.redirectTo ?? null;
            const c = i.caseSensitive ?? s?.caseSensitive ?? false;
            const u = i.id ?? s?.id ?? (n instanceof Array ? n[0] : n);
            const h = i.transitionPlan ?? s?.transitionPlan ?? null;
            const l = i.viewport ?? s?.viewport ?? E;
            const f = {
                ...s?.data,
                ...i.data
            };
            const p = [ ...i.routes ?? a, ...s?.routes ?? a ];
            return new RouteConfig(u, n, r, o, c, h, l, f, p, i.fallback ?? s?.fallback ?? null, i.component ?? s ?? null, i.nav ?? true);
        } else {
            expectType("string, function/class or object", "", t);
        }
    }
    K(t, e) {
        validateRouteConfig(t, this.path[0] ?? "");
        const s = ensureArrayOfStrings(t.path ?? this.path);
        return new RouteConfig(ensureString(t.id ?? this.id ?? s), s, t.title ?? this.title, t.redirectTo ?? this.redirectTo, t.caseSensitive ?? this.caseSensitive, t.transitionPlan ?? this.transitionPlan ?? e?.transitionPlan ?? null, t.viewport ?? this.viewport, t.data ?? this.data, t.routes ?? this.routes, t.fallback ?? this.fallback ?? e?.fallback ?? null, this.component, t.nav ?? this.nav);
    }
    X(t, e, s) {
        const i = shallowEquals(t.params, e.params);
        if (i) return "none";
        if (s != null) return s;
        const n = this.transitionPlan ?? "replace";
        return typeof n === "function" ? n(t, e) : n;
    }
    Y(t, s, i) {
        if (this.W) throw new Error(getMessage(3550));
        if (typeof t.getRouteConfig !== "function") return;
        return e.onResolve(t.getRouteConfig(s, i), (t => {
            this.W = true;
            if (t == null) return;
            let e = s?.path ?? "";
            if (typeof e !== "string") {
                e = e[0];
            }
            validateRouteConfig(t, e);
            this.id = t.id ?? this.id;
            this.G = ensureArrayOfStrings(t.path ?? this.path);
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
    Z() {
        return new RouteConfig(this.id, this.path, this.title, this.redirectTo, this.caseSensitive, this.transitionPlan, this.viewport, this.data, this.routes, this.fallback, this.component, this.nav);
    }
    tt(t, e, i) {
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
        const i = RouteConfig.J(e, s);
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
    if (isPartialRedirectRouteConfig(t)) return RouteConfig.J(t, null);
    const [o, c] = resolveCustomElementDefinition(t, r);
    return e.onResolve(c, (r => {
        const c = r.Type;
        const a = u.getConfig(c);
        if (isPartialChildRouteConfig(t)) return a.K(t, i);
        if (s) return a.Z();
        if (!a.W && o.type === 4 && typeof t.getRouteConfig === "function") {
            return e.onResolve(a.Y(t, i, n), (() => a));
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
        n = e.et(i.value);
        break;
    }
    return [ i, n ];
}

function createNavigationInstruction(t) {
    return isPartialChildRouteConfig(t) ? createNavigationInstruction(t.component) : TypedNavigationInstruction.create(t);
}

const h = [ "?", "#", "/", "+", "(", ")", ".", "@", "!", "=", ",", "&", "'", "~", ";" ];

class ParserState {
    get u() {
        return this.st.length === 0;
    }
    constructor(t) {
        this.it = t;
        this.nt = [];
        this.rt = 0;
        this.ot = 0;
        this.st = t;
    }
    ct(...t) {
        const e = this.st;
        return t.some((function(t) {
            return e.startsWith(t);
        }));
    }
    ut(t) {
        if (this.ct(t)) {
            this.st = this.st.slice(t.length);
            this.ot += t.length;
            this.ht(t);
            return true;
        }
        return false;
    }
    lt(t) {
        if (!this.ut(t)) {
            this.ft(`'${t}'`);
        }
    }
    ft(t) {
        throw new Error(getMessage(3500, t, this.ot, this.it, this.st, this.st));
    }
    gt() {
        if (!this.u) {
            throw new Error(getMessage(3501, this.st, this.ot, this.it));
        }
    }
    dt() {
        const t = this.st[0];
        this.st = this.st.slice(1);
        ++this.ot;
        this.ht(t);
    }
    wt() {
        this.nt[this.rt++] = "";
    }
    vt() {
        const t = --this.rt;
        const e = this.nt;
        const s = e[t];
        e[t] = "";
        return s;
    }
    xt() {
        this.nt[--this.rt] = "";
    }
    ht(t) {
        const e = this.rt;
        const s = this.nt;
        for (let i = 0; i < e; ++i) {
            s[i] += t;
        }
    }
}

const l = new Map;

class RouteExpression {
    get kind() {
        return "Route";
    }
    constructor(t, e, s, i) {
        this.isAbsolute = t;
        this.root = e;
        this.queryParams = s;
        this.fragment = i;
    }
    static parse(t) {
        const e = t.toString();
        let s = l.get(e);
        if (s === void 0) {
            l.set(e, s = RouteExpression.Et(t));
        }
        return s;
    }
    static Et(t) {
        const e = t.path;
        if (e === "") {
            return new RouteExpression(false, SegmentExpression.Empty, t.query, t.fragment);
        }
        const s = new ParserState(e);
        s.wt();
        const i = s.ut("/");
        const n = CompositeSegmentExpression.yt(s);
        s.gt();
        s.xt();
        return new RouteExpression(i, n, t.query, t.fragment);
    }
    toInstructionTree(t) {
        return new ViewportInstructionTree(t, this.isAbsolute, this.root.Rt(0, 0), mergeURLSearchParams(this.queryParams, t.queryParams, true), this.fragment ?? t.fragment);
    }
}

class CompositeSegmentExpression {
    get kind() {
        return "CompositeSegment";
    }
    constructor(t) {
        this.siblings = t;
    }
    static yt(t) {
        t.wt();
        const e = t.ut("+");
        const s = [];
        do {
            s.push(ScopedSegmentExpression.yt(t));
        } while (t.ut("+"));
        if (!e && s.length === 1) {
            t.xt();
            return s[0];
        }
        t.xt();
        return new CompositeSegmentExpression(s);
    }
    Rt(t, e) {
        switch (this.siblings.length) {
          case 0:
            return [];

          case 1:
            return this.siblings[0].Rt(t, e);

          case 2:
            return [ ...this.siblings[0].Rt(t, 0), ...this.siblings[1].Rt(0, e) ];

          default:
            return [ ...this.siblings[0].Rt(t, 0), ...this.siblings.slice(1, -1).flatMap((function(t) {
                return t.Rt(0, 0);
            })), ...this.siblings[this.siblings.length - 1].Rt(0, e) ];
        }
    }
}

class ScopedSegmentExpression {
    get kind() {
        return "ScopedSegment";
    }
    constructor(t, e) {
        this.left = t;
        this.right = e;
    }
    static yt(t) {
        t.wt();
        const e = SegmentGroupExpression.yt(t);
        if (t.ut("/")) {
            const s = ScopedSegmentExpression.yt(t);
            t.xt();
            return new ScopedSegmentExpression(e, s);
        }
        t.xt();
        return e;
    }
    Rt(t, e) {
        const s = this.left.Rt(t, 0);
        const i = this.right.Rt(0, e);
        let n = s[s.length - 1];
        while (n.children.length > 0) {
            n = n.children[n.children.length - 1];
        }
        n.children.push(...i);
        return s;
    }
}

class SegmentGroupExpression {
    get kind() {
        return "SegmentGroup";
    }
    constructor(t) {
        this.expression = t;
    }
    static yt(t) {
        t.wt();
        if (t.ut("(")) {
            const e = CompositeSegmentExpression.yt(t);
            t.lt(")");
            t.xt();
            return new SegmentGroupExpression(e);
        }
        t.xt();
        return SegmentExpression.yt(t);
    }
    Rt(t, e) {
        return this.expression.Rt(t + 1, e + 1);
    }
}

class SegmentExpression {
    get kind() {
        return "Segment";
    }
    static get Empty() {
        return new SegmentExpression(ComponentExpression.Empty, ViewportExpression.Empty, true);
    }
    constructor(t, e, s) {
        this.component = t;
        this.viewport = e;
        this.scoped = s;
    }
    static yt(t) {
        t.wt();
        const e = ComponentExpression.yt(t);
        const s = ViewportExpression.yt(t);
        const i = !t.ut("!");
        t.xt();
        return new SegmentExpression(e, s, i);
    }
    Rt(t, e) {
        return [ ViewportInstruction.create({
            component: this.component.name,
            params: this.component.parameterList.St(),
            viewport: this.viewport.name,
            open: t,
            close: e
        }) ];
    }
}

class ComponentExpression {
    get kind() {
        return "Component";
    }
    static get Empty() {
        return new ComponentExpression("", ParameterListExpression.Empty);
    }
    constructor(t, e) {
        this.name = t;
        this.parameterList = e;
        switch (t.charAt(0)) {
          case ":":
            this.isParameter = true;
            this.isStar = false;
            this.isDynamic = true;
            this.parameterName = t.slice(1);
            break;

          case "*":
            this.isParameter = false;
            this.isStar = true;
            this.isDynamic = true;
            this.parameterName = t.slice(1);
            break;

          default:
            this.isParameter = false;
            this.isStar = false;
            this.isDynamic = false;
            this.parameterName = t;
            break;
        }
    }
    static yt(t) {
        t.wt();
        t.wt();
        if (!t.u) {
            if (t.ct("./")) {
                t.dt();
            } else if (t.ct("../")) {
                t.dt();
                t.dt();
            } else {
                while (!t.u && !t.ct(...h)) {
                    t.dt();
                }
            }
        }
        const e = t.vt();
        if (e.length === 0) {
            t.ft("component name");
        }
        const s = ParameterListExpression.yt(t);
        t.xt();
        return new ComponentExpression(e, s);
    }
}

class ViewportExpression {
    get kind() {
        return "Viewport";
    }
    static get Empty() {
        return new ViewportExpression("");
    }
    constructor(t) {
        this.name = t;
    }
    static yt(t) {
        t.wt();
        let e = null;
        if (t.ut("@")) {
            t.wt();
            while (!t.u && !t.ct(...h)) {
                t.dt();
            }
            e = decodeURIComponent(t.vt());
            if (e.length === 0) {
                t.ft("viewport name");
            }
        }
        t.xt();
        return new ViewportExpression(e);
    }
}

class ParameterListExpression {
    get kind() {
        return "ParameterList";
    }
    static get Empty() {
        return new ParameterListExpression([]);
    }
    constructor(t) {
        this.expressions = t;
    }
    static yt(t) {
        t.wt();
        const e = [];
        if (t.ut("(")) {
            do {
                e.push(ParameterExpression.yt(t, e.length));
                if (!t.ut(",")) {
                    break;
                }
            } while (!t.u && !t.ct(")"));
            t.lt(")");
        }
        t.xt();
        return new ParameterListExpression(e);
    }
    St() {
        const t = {};
        for (const e of this.expressions) {
            t[e.key] = e.value;
        }
        return t;
    }
}

class ParameterExpression {
    get kind() {
        return "Parameter";
    }
    static get Empty() {
        return new ParameterExpression("", "");
    }
    constructor(t, e) {
        this.key = t;
        this.value = e;
    }
    static yt(t, e) {
        t.wt();
        t.wt();
        while (!t.u && !t.ct(...h)) {
            t.dt();
        }
        let s = t.vt();
        if (s.length === 0) {
            t.ft("parameter key");
        }
        let i;
        if (t.ut("=")) {
            t.wt();
            while (!t.u && !t.ct(...h)) {
                t.dt();
            }
            i = decodeURIComponent(t.vt());
            if (i.length === 0) {
                t.ft("parameter value");
            }
        } else {
            i = s;
            s = e.toString();
        }
        t.xt();
        return new ParameterExpression(s, i);
    }
}

const f = Object.freeze({
    RouteExpression: RouteExpression,
    CompositeSegmentExpression: CompositeSegmentExpression,
    ScopedSegmentExpression: ScopedSegmentExpression,
    SegmentGroupExpression: SegmentGroupExpression,
    SegmentExpression: SegmentExpression,
    ComponentExpression: ComponentExpression,
    ViewportExpression: ViewportExpression,
    ParameterListExpression: ParameterListExpression,
    ParameterExpression: ParameterExpression
});

class ViewportRequest {
    constructor(t, e) {
        this.viewportName = t;
        this.componentName = e;
    }
    toString() {
        return `VR(viewport:'${this.viewportName}',component:'${this.componentName}')`;
    }
}

const p = new WeakMap;

class ViewportAgent {
    get bt() {
        return this._state & 16256;
    }
    set bt(t) {
        this._state = this._state & 127 | t;
    }
    get Ct() {
        return this._state & 127;
    }
    set Ct(t) {
        this._state = this._state & 16256 | t;
    }
    constructor(t, s, i) {
        this.viewport = t;
        this.hostController = s;
        this._t = false;
        this.Nt = null;
        this.kt = null;
        this._state = 8256;
        this.$t = "replace";
        this.Tt = null;
        this.It = null;
        this.Pt = null;
        this.Vt = null;
        this.U = i.container.get(e.ILogger).scopeTo(`ViewportAgent<${i.Ot}>`);
    }
    static for(t, e) {
        let i = p.get(t);
        if (i === void 0) {
            const n = s.Controller.getCachedOrThrow(t);
            p.set(t, i = new ViewportAgent(t, n, e));
        }
        return i;
    }
    At(t, e) {
        const s = this.Pt;
        if (s !== null) {
            ensureTransitionHasNotErrored(s);
        }
        this._t = true;
        switch (this.Ct) {
          case 64:
            switch (this.bt) {
              case 8192:
                return;

              case 4096:
                return this.Nt.Mt(t, e);

              default:
                this.jt("activateFromViewport 1");
            }

          case 2:
            {
                if (this.Pt === null) throw new Error(getMessage(3350, this));
                const e = Batch.C((e => {
                    this.Mt(t, this.Pt, e);
                }));
                const s = new Promise((t => {
                    e.T((() => {
                        t();
                    }));
                }));
                return e.C().u ? void 0 : s;
            }

          default:
            this.jt("activateFromViewport 2");
        }
    }
    Ut(t, e) {
        const s = this.Pt;
        if (s !== null) {
            ensureTransitionHasNotErrored(s);
        }
        this._t = false;
        switch (this.bt) {
          case 8192:
            return;

          case 4096:
            return this.Nt.Lt(t, e);

          case 128:
            return;

          default:
            {
                if (this.Pt === null) throw new Error(getMessage(3351, this));
                const e = Batch.C((e => {
                    this.Lt(t, this.Pt, e);
                }));
                const s = new Promise((t => {
                    e.T((() => {
                        t();
                    }));
                }));
                return e.C().u ? void 0 : s;
            }
        }
    }
    zt(t) {
        if (!this.Bt()) {
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
    Bt() {
        if (!this._t) {
            return false;
        }
        if (this.Ct !== 64) {
            return false;
        }
        return true;
    }
    Dt(t, s) {
        if (this.Pt === null) {
            this.Pt = t;
        }
        ensureTransitionHasNotErrored(t);
        if (t.guardsResult !== true) {
            return;
        }
        s._();
        void e.onResolve(this.Vt, (() => {
            Batch.C((e => {
                for (const s of this.Tt.children) {
                    s.context.vpa.Dt(t, e);
                }
            })).T((e => {
                switch (this.bt) {
                  case 4096:
                    switch (this.$t) {
                      case "none":
                        this.bt = 1024;
                        return;

                      case "invoke-lifecycles":
                      case "replace":
                        this.bt = 2048;
                        e._();
                        Batch.C((e => {
                            this.Nt.Dt(t, this.It, e);
                        })).T((() => {
                            this.bt = 1024;
                            e.N();
                        })).C();
                        return;
                    }

                  case 8192:
                    return;

                  default:
                    t.qt(new Error(`Unexpected state at canUnload of ${this}`));
                }
            })).T((() => {
                s.N();
            })).C();
        }));
    }
    Ht(t, s) {
        if (this.Pt === null) {
            this.Pt = t;
        }
        ensureTransitionHasNotErrored(t);
        if (t.guardsResult !== true) {
            return;
        }
        s._();
        Batch.C((s => {
            switch (this.Ct) {
              case 32:
                this.Ct = 16;
                switch (this.$t) {
                  case "none":
                    return;

                  case "invoke-lifecycles":
                    return this.Nt.Ht(t, this.It, s);

                  case "replace":
                    s._();
                    void e.onResolve(this.It.context.Ft(this.hostController, this.It), (e => {
                        (this.kt = e).Ht(t, this.It, s);
                        s.N();
                    }));
                }

              case 64:
                return;

              default:
                this.jt("canLoad");
            }
        })).T((t => {
            const s = this.It;
            switch (this.$t) {
              case "none":
              case "invoke-lifecycles":
                {
                    t._();
                    const i = s.context;
                    void e.onResolve(i.allResolved, (() => e.onResolve(e.onResolve(e.onResolveAll(...s.residue.splice(0).map((t => createAndAppendNodes(this.U, s, t)))), (() => e.onResolveAll(...i.getAvailableViewportAgents().reduce(((t, e) => {
                        const i = e.viewport;
                        const n = i.default;
                        if (n === null) return t;
                        t.push(createAndAppendNodes(this.U, s, ViewportInstruction.create({
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
        })).T((e => {
            switch (this.Ct) {
              case 16:
                this.Ct = 8;
                for (const s of this.It.children) {
                    s.context.vpa.Ht(t, e);
                }
                return;

              case 64:
                return;

              default:
                this.jt("canLoad");
            }
        })).T((() => {
            s.N();
        })).C();
    }
    Gt(t, e) {
        ensureTransitionHasNotErrored(t);
        ensureGuardsResultIsTrue(this, t);
        e._();
        Batch.C((e => {
            for (const s of this.Tt.children) {
                s.context.vpa.Gt(t, e);
            }
        })).T((s => {
            switch (this.bt) {
              case 1024:
                switch (this.$t) {
                  case "none":
                    this.bt = 256;
                    return;

                  case "invoke-lifecycles":
                  case "replace":
                    this.bt = 512;
                    s._();
                    Batch.C((e => {
                        this.Nt.Gt(t, this.It, e);
                    })).T((() => {
                        this.bt = 256;
                        s.N();
                    })).C();
                    return;
                }

              case 8192:
                for (const s of this.Tt.children) {
                    s.context.vpa.Gt(t, e);
                }
                return;

              default:
                this.jt("unloading");
            }
        })).T((() => {
            e.N();
        })).C();
    }
    Wt(t, e) {
        ensureTransitionHasNotErrored(t);
        ensureGuardsResultIsTrue(this, t);
        e._();
        Batch.C((e => {
            switch (this.Ct) {
              case 8:
                {
                    this.Ct = 4;
                    switch (this.$t) {
                      case "none":
                        return;

                      case "invoke-lifecycles":
                        return this.Nt.Wt(t, this.It, e);

                      case "replace":
                        return this.kt.Wt(t, this.It, e);
                    }
                }

              case 64:
                return;

              default:
                this.jt("loading");
            }
        })).T((e => {
            switch (this.Ct) {
              case 4:
                this.Ct = 2;
                for (const s of this.It.children) {
                    s.context.vpa.Wt(t, e);
                }
                return;

              case 64:
                return;

              default:
                this.jt("loading");
            }
        })).T((() => {
            e.N();
        })).C();
    }
    Lt(t, s, i) {
        ensureTransitionHasNotErrored(s);
        ensureGuardsResultIsTrue(this, s);
        i._();
        switch (this.bt) {
          case 256:
            this.bt = 128;
            switch (this.$t) {
              case "none":
              case "invoke-lifecycles":
                i.N();
                return;

              case "replace":
                {
                    const n = this.hostController;
                    const r = this.Nt;
                    s.Qt((() => e.onResolve(r.Lt(t, n), (() => {
                        if (t === null) {
                            r.Jt();
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
            this.jt("deactivate");
        }
    }
    Mt(t, e, s) {
        ensureTransitionHasNotErrored(e);
        ensureGuardsResultIsTrue(this, e);
        s._();
        if (this.Ct === 32) {
            Batch.C((t => {
                this.Ht(e, t);
            })).T((t => {
                this.Wt(e, t);
            })).T((s => {
                this.Mt(t, e, s);
            })).T((() => {
                s.N();
            })).C();
            return;
        }
        switch (this.Ct) {
          case 2:
            this.Ct = 1;
            Batch.C((s => {
                switch (this.$t) {
                  case "none":
                  case "invoke-lifecycles":
                    return;

                  case "replace":
                    {
                        const i = this.hostController;
                        e.Qt((() => {
                            s._();
                            return this.kt.Mt(t, i);
                        }), (() => {
                            s.N();
                        }));
                    }
                }
            })).T((t => {
                this.Kt(e, t);
            })).T((() => {
                s.N();
            })).C();
            return;

          case 64:
            s.N();
            return;

          default:
            this.jt("activate");
        }
    }
    Xt(t, s) {
        if (this.bt === 8192) {
            this.Mt(null, t, s);
            return;
        }
        if (this.Ct === 64) {
            this.Lt(null, t, s);
            return;
        }
        ensureTransitionHasNotErrored(t);
        ensureGuardsResultIsTrue(this, t);
        if (!(this.bt === 256 && this.Ct === 2)) {
            this.jt("swap");
        }
        this.bt = 128;
        this.Ct = 1;
        switch (this.$t) {
          case "none":
          case "invoke-lifecycles":
            {
                const e = mergeDistinct(this.It.children, this.Tt.children);
                for (const i of e) {
                    i.context.vpa.Xt(t, s);
                }
                return;
            }

          case "replace":
            {
                const i = this.hostController;
                const n = this.Nt;
                const r = this.kt;
                s._();
                Batch.C((s => {
                    t.Qt((() => {
                        s._();
                        return e.onResolve(n.Lt(null, i), (() => n.Jt()));
                    }), (() => {
                        s.N();
                    }));
                })).T((e => {
                    t.Qt((() => {
                        e._();
                        return r.Mt(null, i);
                    }), (() => {
                        e.N();
                    }));
                })).T((e => {
                    this.Kt(t, e);
                })).T((() => {
                    s.N();
                })).C();
                return;
            }
        }
    }
    Kt(t, s) {
        const i = this.It;
        t.Qt((() => {
            s._();
            const t = i.context;
            return e.onResolve(t.allResolved, (() => {
                const s = i.children.slice();
                return e.onResolve(e.onResolveAll(...i.residue.splice(0).map((t => createAndAppendNodes(this.U, i, t)))), (() => e.onResolve(e.onResolveAll(...t.getAvailableViewportAgents().reduce(((t, e) => {
                    const s = e.viewport;
                    const n = s.default;
                    if (n === null) return t;
                    t.push(createAndAppendNodes(this.U, i, ViewportInstruction.create({
                        component: n,
                        viewport: s.name
                    })));
                    return t;
                }), [])), (() => i.children.filter((t => !s.includes(t)))))));
            }));
        }), (e => {
            Batch.C((s => {
                for (const i of e) {
                    t.Qt((() => {
                        s._();
                        return i.context.vpa.Ht(t, s);
                    }), (() => {
                        s.N();
                    }));
                }
            })).T((s => {
                for (const i of e) {
                    t.Qt((() => {
                        s._();
                        return i.context.vpa.Wt(t, s);
                    }), (() => {
                        s.N();
                    }));
                }
            })).T((s => {
                for (const i of e) {
                    t.Qt((() => {
                        s._();
                        return i.context.vpa.Mt(null, t, s);
                    }), (() => {
                        s.N();
                    }));
                }
            })).T((() => {
                s.N();
            })).C();
        }));
    }
    Yt(t, e) {
        switch (this.Ct) {
          case 64:
            this.It = e;
            this.Ct = 32;
            break;

          default:
            this.jt("scheduleUpdate 1");
        }
        switch (this.bt) {
          case 8192:
          case 4096:
          case 1024:
            break;

          default:
            this.jt("scheduleUpdate 2");
        }
        const s = this.Nt?.Zt ?? null;
        if (s === null || s.component !== e.component) {
            this.$t = "replace";
        } else {
            this.$t = e.context.config.X(s, e, t.transitionPlan);
        }
    }
    te() {
        if (this.Tt !== null) {
            this.Tt.children.forEach((function(t) {
                t.context.vpa.te();
            }));
        }
        if (this.It !== null) {
            this.It.children.forEach((function(t) {
                t.context.vpa.te();
            }));
        }
        let t = null;
        let s = null;
        switch (this.bt) {
          case 8192:
          case 4096:
            this.Pt = null;
            break;

          case 2048:
          case 1024:
            this.bt = 4096;
            this.Pt = null;
            break;

          case 512:
          case 256:
          case 128:
            t = e.onResolve(this.Nt?.Lt(null, this.hostController), (() => {
                this.Nt?.Jt();
                this.bt = 8192;
                this.Nt = null;
            }));
            break;
        }
        switch (this.Ct) {
          case 64:
          case 32:
          case 16:
          case 8:
            this.It = null;
            this.Ct = 64;
            break;

          case 4:
          case 2:
          case 1:
            {
                s = e.onResolve(this.kt?.Lt(null, this.hostController), (() => {
                    this.kt?.Jt();
                    this.$t = "replace";
                    this.Ct = 64;
                    this.kt = null;
                    this.It = null;
                }));
                break;
            }
        }
        if (t !== null && s !== null) {
            this.Vt = e.onResolve(e.onResolveAll(t, s), (() => {
                this.Pt = null;
                this.Vt = null;
            }));
        }
    }
    ee() {
        if (this.Tt !== null) {
            this.Tt.children.forEach((function(t) {
                t.context.vpa.ee();
            }));
        }
        if (this.It !== null) {
            this.It.children.forEach((function(t) {
                t.context.vpa.ee();
            }));
        }
        if (this.Pt !== null) {
            ensureTransitionHasNotErrored(this.Pt);
            switch (this.Ct) {
              case 64:
                switch (this.bt) {
                  case 8192:
                  case 128:
                    this.bt = 8192;
                    this.Nt = null;
                    break;

                  default:
                    this.jt("endTransition 1");
                }
                break;

              case 1:
                switch (this.bt) {
                  case 8192:
                  case 128:
                    switch (this.$t) {
                      case "none":
                        this.bt = 4096;
                        break;

                      case "invoke-lifecycles":
                        this.bt = 4096;
                        this.Nt.Zt = this.It;
                        break;

                      case "replace":
                        this.bt = 4096;
                        this.Nt = this.kt;
                        break;
                    }
                    this.Tt = this.It;
                    break;

                  default:
                    this.jt("endTransition 2");
                }
                break;

              default:
                this.jt("endTransition 3");
            }
            this.$t = "replace";
            this.Ct = 64;
            this.It = null;
            this.kt = null;
            this.Pt = null;
        }
    }
    toString() {
        return `VPA(state:${$state(this._state)},plan:'${this.$t}',n:${this.It},c:${this.Tt},viewport:${this.viewport})`;
    }
    Jt() {
        this.Nt?.Jt();
    }
    jt(t) {
        throw new Error(getMessage(3352, t, this));
    }
}

function ensureGuardsResultIsTrue(t, e) {
    if (e.guardsResult !== true) throw new Error(getMessage(3353, e.guardsResult, t));
}

function ensureTransitionHasNotErrored(t) {
    if (t.error !== void 0 && !t.erredWithUnknownRoute) throw t.error;
}

const g = new Map;

function $state(t) {
    let e = g.get(t);
    if (e === void 0) {
        g.set(t, e = stringifyState(t));
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
        return this.se.root;
    }
    get isInstructionsFinalized() {
        return this.ie;
    }
    constructor(t, e, s, i, n, r, o, c, a, u, h, l, f) {
        this.path = t;
        this.finalPath = e;
        this.context = s;
        this.ne = i;
        this.instruction = n;
        this.params = r;
        this.queryParams = o;
        this.fragment = c;
        this.data = a;
        this.re = u;
        this.title = h;
        this.component = l;
        this.residue = f;
        this.oe = 1;
        this.ie = false;
        this.children = [];
        this.ne ?? (this.ne = n);
    }
    static create(t) {
        const {[i.RESIDUE]: s, ...n} = t.params ?? {};
        return new RouteNode(t.path, t.finalPath, t.context, t.originalInstruction ?? t.instruction, t.instruction, Object.freeze(n), t.queryParams ?? d, t.fragment ?? null, Object.freeze(t.data ?? e.emptyObject), t.re ?? null, t.title ?? null, t.component, t.residue ?? []);
    }
    contains(t, e = false) {
        if (this.context === t.options.context) {
            const s = this.children;
            const i = t.children;
            for (let t = 0, n = s.length; t < n; ++t) {
                for (let r = 0, o = i.length; r < o; ++r) {
                    const c = i[r];
                    const a = e ? c.recognizedRoute?.route.endpoint : null;
                    const u = s[t + r] ?? null;
                    const h = u !== null ? u.isInstructionsFinalized ? u.instruction : u.ne : null;
                    const l = h?.recognizedRoute?.route.endpoint;
                    if (t + r < n && ((a?.equalsOrResidual(l) ?? false) || (h?.contains(c) ?? false))) {
                        if (r + 1 === o) {
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
    ce(t) {
        this.children.push(t);
        t.ae(this.se);
    }
    ue() {
        for (const t of this.children) {
            t.ue();
            t.context.vpa.te();
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
    ae(t) {
        this.se = t;
        for (const e of this.children) {
            e.ae(t);
        }
    }
    he() {
        this.ie = true;
        const t = this.children.map((t => t.he()));
        const e = this.instruction.Z();
        e.children.splice(0, e.children.length, ...t);
        return this.instruction = e;
    }
    Z() {
        const t = new RouteNode(this.path, this.finalPath, this.context, this.ne, this.instruction, this.params, this.queryParams, this.fragment, this.data, this.re, this.title, this.component, [ ...this.residue ]);
        const e = this.children;
        const s = e.length;
        for (let i = 0; i < s; ++i) {
            t.children.push(e[i].Z());
        }
        t.oe = this.oe + 1;
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
        return `RN(ctx:'${this.context?.Ot}',${t.join(",")})`;
    }
}

class RouteTree {
    constructor(t, e, s, i) {
        this.options = t;
        this.queryParams = e;
        this.fragment = s;
        this.root = i;
    }
    contains(t, e = false) {
        return this.root.contains(t, e);
    }
    Z() {
        const t = new RouteTree(this.options.Z(), this.queryParams, this.fragment, this.root.Z());
        t.root.ae(this);
        return t;
    }
    le() {
        return new ViewportInstructionTree(this.options, true, this.root.children.map((t => t.he())), this.queryParams, this.fragment);
    }
    fe(t) {
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
            s.ue();

          case ".":
            return e.onResolveAll(...i.children.map((e => createAndAppendNodes(t, s, e))));

          default:
            {
                t.trace(`createAndAppendNodes invoking createNode`);
                const n = s.context;
                const r = i.Z();
                let o = i.recognizedRoute;
                if (o !== null) return appendNode(t, s, createConfiguredNode(t, s, i, o, r));
                if (i.children.length === 0) {
                    const e = n.pe(i);
                    if (e !== null) {
                        s.se.fe(e.query);
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
                    const r = n.pe({
                        component: i.component.value,
                        params: i.params ?? e.emptyObject,
                        open: i.open,
                        close: i.close,
                        viewport: i.viewport,
                        children: i.children
                    });
                    if (r !== null) {
                        s.se.fe(r.query);
                        return appendNode(t, s, createConfiguredNode(t, s, r.vi, r.vi.recognizedRoute, i));
                    }
                    const o = i.component.value;
                    if (o === "") return;
                    let c = i.viewport;
                    if (c === null || c.length === 0) c = E;
                    const a = n.getFallbackViewportAgent(c);
                    const u = a !== null ? a.viewport.tt(i, s, n) : n.config.tt(i, s, n);
                    if (u === null) throw new UnknownRouteError(getMessage(3401, o, n.Ot, c, o, n.component.name));
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
                const {vi: o, query: c} = n.pe({
                    component: r,
                    params: i.params ?? e.emptyObject,
                    open: i.open,
                    close: i.close,
                    viewport: i.viewport,
                    children: i.children
                });
                s.se.fe(c);
                return appendNode(t, s, createConfiguredNode(t, s, o, o.recognizedRoute, i));
            }));
        }
    }
}

function createConfiguredNode(t, s, i, n, r, o = n.route.endpoint.route) {
    const c = s.context;
    const a = s.se;
    return e.onResolve(o.handler, (u => {
        o.handler = u;
        t.trace(`creatingConfiguredNode(rdc:%s, vi:%s)`, u, i);
        if (u.redirectTo === null) {
            const h = (i.viewport?.length ?? 0) > 0;
            const l = h ? i.viewport : u.viewport;
            return e.onResolve(resolveCustomElementDefinition(u.component, c)[1], (f => {
                const p = c.ge(new ViewportRequest(l, f.name));
                if (!h) {
                    i.viewport = p.viewport.name;
                }
                const g = c.container.get(w);
                return e.onResolve(g.getRouteContext(p, f, null, p.hostController.container, c.config, c, u), (e => {
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
                        data: u.data,
                        re: l,
                        component: f,
                        title: u.title,
                        residue: i.children.slice()
                    });
                    c.ae(s.se);
                    t.trace(`createConfiguredNode(vi:%s) -> %s`, i, c);
                    return c;
                }));
            }));
        }
        const h = RouteExpression.parse(v.parse(o.path));
        const l = RouteExpression.parse(v.parse(u.redirectTo));
        let f;
        let p;
        const g = [];
        switch (h.root.kind) {
          case "ScopedSegment":
          case "Segment":
            f = h.root;
            break;

          default:
            throw new Error(getMessage(3502, h.root.kind));
        }
        switch (l.root.kind) {
          case "ScopedSegment":
          case "Segment":
            p = l.root;
            break;

          default:
            throw new Error(getMessage(3502, l.root.kind));
        }
        let d;
        let m;
        let x = false;
        let E = false;
        while (!(x && E)) {
            if (x) {
                d = null;
            } else if (f.kind === "Segment") {
                d = f;
                x = true;
            } else if (f.left.kind === "Segment") {
                d = f.left;
                switch (f.right.kind) {
                  case "ScopedSegment":
                  case "Segment":
                    f = f.right;
                    break;

                  default:
                    throw new Error(getMessage(3502, f.right.kind));
                }
            } else {
                throw new Error(getMessage(3502, f.left.kind));
            }
            if (E) {
                m = null;
            } else if (p.kind === "Segment") {
                m = p;
                E = true;
            } else if (p.left.kind === "Segment") {
                m = p.left;
                switch (p.right.kind) {
                  case "ScopedSegment":
                  case "Segment":
                    p = p.right;
                    break;

                  default:
                    throw new Error(getMessage(3502, p.right.kind));
                }
            } else {
                throw new Error(getMessage(3502, p.left.kind));
            }
            if (m !== null) {
                if (m.component.isDynamic && (d?.component.isDynamic ?? false)) {
                    g.push(n.route.params[m.component.parameterName]);
                } else {
                    g.push(m.component.name);
                }
            }
        }
        const y = g.filter(Boolean).join("/");
        const R = c.recognize(y);
        if (R === null) throw new UnknownRouteError(getMessage(3402, y, c.Ot, y, c.component.name));
        return createConfiguredNode(t, s, ViewportInstruction.create({
            recognizedRoute: R,
            component: y,
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
        s.ce(e);
        return e.context.vpa.Yt(s.se.options, e);
    }));
}

function createFallbackNode(t, s, n, r) {
    const o = new $RecognizedRoute(new i.RecognizedRoute(new i.Endpoint(new i.ConfigurableRoute(s.path[0], s.caseSensitive, s), []), e.emptyObject), null);
    r.children.length = 0;
    return createConfiguredNode(t, n, r, o, null);
}

const d = Object.freeze(new URLSearchParams);

function isManagedState(e) {
    return t.isObject(e) && Object.prototype.hasOwnProperty.call(e, n) === true;
}

function toManagedState(t, e) {
    return {
        ...t,
        [n]: e
    };
}

class UnknownRouteError extends Error {}

class Transition {
    get erredWithUnknownRoute() {
        return this.de;
    }
    constructor(t, e, s, i, n, r, o, c, a, u, h, l, f, p, g) {
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
        this.error = g;
        this.de = false;
    }
    static J(t) {
        return new Transition(t.id, t.prevInstructions, t.instructions, t.finalInstructions, t.instructionsChanged, t.trigger, t.options, t.managedState, t.previousRouteTree, t.routeTree, t.promise, t.resolve, t.reject, t.guardsResult, void 0);
    }
    Qt(t, e) {
        if (this.guardsResult !== true) {
            return;
        }
        try {
            const s = t();
            if (s instanceof Promise) {
                s.then(e).catch((t => {
                    this.qt(t);
                }));
            } else {
                e(s);
            }
        } catch (t) {
            this.qt(t);
        }
    }
    qt(t) {
        this.de = t instanceof UnknownRouteError;
        this.reject(this.error = t);
    }
    toString() {
        return `T(id:${this.id},trigger:'${this.trigger}',instructions:${this.instructions})`;
    }
}

const w = /*@__PURE__*/ e.DI.createInterface("IRouter", (t => t.singleton(Router)));

class Router {
    get we() {
        const t = this.ve;
        if (t !== null) return t;
        if (!this.c.has(y, true)) throw new Error(getMessage(3271));
        return this.ve = this.c.get(y);
    }
    get routeTree() {
        let t = this.me;
        if (t === null) {
            const e = this.we;
            t = this.me = new RouteTree(NavigationOptions.create(this.options, {}), d, null, RouteNode.create({
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
        return this.xe ?? (this.xe = Transition.J({
            id: 0,
            prevInstructions: this.Ee,
            instructions: this.Ee,
            finalInstructions: this.Ee,
            instructionsChanged: true,
            trigger: "api",
            options: NavigationOptions.create(this.options, {}),
            managedState: null,
            previousRouteTree: this.routeTree.Z(),
            routeTree: this.routeTree,
            resolve: null,
            reject: null,
            promise: null,
            guardsResult: true,
            error: void 0
        }));
    }
    set currentTr(t) {
        this.xe = t;
    }
    get isNavigating() {
        return this.ye;
    }
    constructor() {
        this.ve = null;
        this.me = null;
        this.xe = null;
        this.Re = false;
        this.Se = 0;
        this.be = null;
        this.Ce = null;
        this._e = false;
        this.ye = false;
        this.c = e.resolve(e.IContainer);
        this.Ne = e.resolve(s.IPlatform);
        this.U = e.resolve(e.ILogger).root.scopeTo("Router");
        this.I = e.resolve(r);
        this.ke = e.resolve(c);
        this.options = e.resolve(x);
        this.$e = new Map;
        this.Ee = ViewportInstructionTree.create("", this.options);
        this.c.registerResolver(Router, e.Registration.instance(Router, this));
    }
    Te(t) {
        return RouteContext.resolve(this.we, t);
    }
    start(t) {
        this._e = typeof this.options.buildTitle === "function";
        this.ke.startListening();
        this.Ce = this.I.subscribe("au:router:location-change", (t => {
            this.Ne.taskQueue.queueTask((() => {
                const e = isManagedState(t.state) ? t.state : null;
                const s = this.options;
                const i = NavigationOptions.create(s, {
                    historyStrategy: "replace"
                });
                const n = ViewportInstructionTree.create(t.url, s, i, this.we);
                this.Ie(n, t.trigger, e, null);
            }));
        }));
        if (!this.Re && t) {
            return this.load(this.ke.getPath(), {
                historyStrategy: "replace"
            });
        }
    }
    stop() {
        this.ke.stopListening();
        this.Ce?.dispose();
    }
    load(t, e) {
        const s = this.createViewportInstructions(t, e);
        return this.Ie(s, "api", null, null);
    }
    isActive(t, e) {
        const s = this.Te(e);
        const i = t instanceof ViewportInstructionTree ? t : this.createViewportInstructions(t, {
            context: s,
            historyStrategy: this.options.historyStrategy
        });
        return this.routeTree.contains(i, false);
    }
    getRouteContext(t, s, i, n, r, o, c) {
        return e.onResolve(c instanceof RouteConfig ? c : resolveRouteConfiguration(typeof i?.getRouteConfig === "function" ? i : s.Type, false, r, null, o), (e => {
            let i = this.$e.get(t);
            if (i === void 0) {
                this.$e.set(t, i = new WeakMap);
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
            t = this.ke.removeBaseHref(t);
        }
        const i = isPartialViewportInstruction(t);
        let n = i ? t.component : t;
        if (typeof n === "string" && n.startsWith("../") && s !== null) {
            s = this.Te(s);
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
        }), this.we);
    }
    Ie(t, e, s, i) {
        const n = this.currentTr;
        const r = this.U;
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
        const h = this.be = Transition.J({
            id: ++this.Se,
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
            routeTree: this.me = this.routeTree.Z(),
            guardsResult: true,
            error: void 0
        });
        if (!this.ye) {
            try {
                this.Qt(h);
            } catch (t) {
                h.qt(t);
            }
        }
        return h.promise.then((t => t)).catch((t => {
            error(r, 3270, h, t);
            if (h.erredWithUnknownRoute) {
                this.Pe(h);
            } else {
                this.ye = false;
                this.I.publish(new NavigationErrorEvent(h.id, h.instructions, t));
                if (u) {
                    this.Pe(h);
                } else {
                    const t = this.be;
                    if (t !== null) {
                        t.previousRouteTree = h.previousRouteTree;
                    } else {
                        this.me = h.previousRouteTree;
                    }
                }
            }
            throw t;
        }));
    }
    Qt(t) {
        this.currentTr = t;
        this.be = null;
        this.ye = true;
        let s = this.Te(t.options.context);
        this.I.publish(new NavigationStartEvent(t.id, t.instructions, t.trigger, t.managedState));
        if (this.be !== null) {
            return this.Qt(this.be);
        }
        t.Qt((() => {
            const i = t.finalInstructions;
            const n = this.we;
            const r = t.routeTree;
            r.options = i.options;
            r.queryParams = n.node.se.queryParams = i.queryParams;
            r.fragment = n.node.se.fragment = i.fragment;
            const o = /*@__PURE__*/ s.container.get(e.ILogger).scopeTo("RouteTree");
            if (i.isAbsolute) {
                s = n;
            }
            if (s === n) {
                r.root.ae(r);
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
                    i.context.vpa.Dt(t, s);
                }
            })).T((e => {
                if (t.guardsResult !== true) {
                    e._();
                    this.Pe(t);
                }
            })).T((e => {
                for (const i of s) {
                    i.context.vpa.Ht(t, e);
                }
            })).T((e => {
                if (t.guardsResult !== true) {
                    e._();
                    this.Pe(t);
                }
            })).T((s => {
                for (const i of e) {
                    i.context.vpa.Gt(t, s);
                }
            })).T((e => {
                for (const i of s) {
                    i.context.vpa.Wt(t, e);
                }
            })).T((e => {
                for (const s of i) {
                    s.context.vpa.Xt(t, e);
                }
            })).T((() => {
                i.forEach((function(t) {
                    t.context.vpa.ee();
                }));
                this.Re = true;
                this.Ee = t.finalInstructions = t.routeTree.le();
                this.ye = false;
                const e = t.finalInstructions.toUrl(true, this.options.Ve);
                switch (t.options.Oe(this.Ee)) {
                  case "none":
                    break;

                  case "push":
                    this.ke.pushState(toManagedState(t.options.state, t.id), this.updateTitle(t), e);
                    break;

                  case "replace":
                    this.ke.replaceState(toManagedState(t.options.state, t.id), this.updateTitle(t), e);
                    break;
                }
                this.I.publish(new NavigationEndEvent(t.id, t.instructions, this.Ee));
                t.resolve(true);
                this.Ae();
            })).C();
        }));
    }
    updateTitle(t = this.currentTr) {
        let e;
        if (this._e) {
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
            this.Ne.document.title = e;
        }
        return this.Ne.document.title;
    }
    Pe(t) {
        const s = t.previousRouteTree.root.children;
        const i = t.routeTree.root.children;
        const n = mergeDistinct(s, i);
        n.forEach((function(t) {
            t.context.vpa.te();
        }));
        this.Ee = t.prevInstructions;
        this.me = t.previousRouteTree;
        this.ye = false;
        const r = t.guardsResult;
        this.I.publish(new NavigationCancelEvent(t.id, t.instructions, `guardsResult is ${r}`));
        if (r === false) {
            t.resolve(false);
            this.Ae();
        } else {
            let s;
            if (this.Re && (t.erredWithUnknownRoute || t.error != null && this.options.restorePreviousRouteTreeOnError)) s = t.prevInstructions; else if (r === true) return; else s = r;
            void e.onResolve(this.Ie(s, "api", t.managedState, t), (() => {}));
        }
    }
    Ae() {
        if (this.be === null) return;
        this.Ne.taskQueue.queueTask((() => {
            const t = this.be;
            if (t === null) return;
            try {
                this.Qt(t);
            } catch (e) {
                t.qt(e);
            }
        }));
    }
}

function updateNode(t, s, i, n) {
    t.trace(`updateNode(ctx:%s,node:%s)`, i, n);
    n.queryParams = s.queryParams;
    n.fragment = s.fragment;
    if (!n.context.isRoot) {
        n.context.vpa.Yt(n.se.options, n);
    }
    if (n.context === i) {
        n.ue();
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

class ParsedUrl {
    constructor(t, e, s) {
        this.path = t;
        this.query = e;
        this.fragment = s;
        this.id = `${t}?${e?.toString() ?? ""}#${s ?? ""}`;
    }
    toString() {
        return this.id;
    }
    static J(t) {
        let e = null;
        const s = t.indexOf("#");
        if (s >= 0) {
            const i = t.slice(s + 1);
            e = decodeURIComponent(i);
            t = t.slice(0, s);
        }
        let i = null;
        const n = t.indexOf("?");
        if (n >= 0) {
            const e = t.slice(n + 1);
            t = t.slice(0, n);
            i = Object.freeze(new URLSearchParams(e));
        }
        return new ParsedUrl(t, i != null ? i : d, e);
    }
}

function stringify(t, e, s) {
    let i;
    if (typeof t === "string") {
        i = t;
    } else {
        i = t.path;
        e = t.query;
        s = t.fragment;
    }
    e ?? (e = d);
    let n = e.toString();
    n = n === "" ? "" : `?${n}`;
    const r = s != null && s.length > 0 ? `#${encodeURIComponent(s)}` : "";
    return `${i}${n}${r}`;
}

const v = Object.freeze({
    parse(t) {
        return ParsedUrl.J(t);
    },
    stringify(t, e, s) {
        return stringify(t, e, s);
    }
});

const m = Object.freeze({
    parse(t) {
        const e = t.indexOf("#");
        if (e >= 0) {
            const s = t.slice(e + 1);
            t = decodeURIComponent(s);
        }
        return ParsedUrl.J(t);
    },
    stringify(t, e, s) {
        return `/#/${stringify(t, e, s)}`;
    }
});

function valueOrFuncToValue(t, e) {
    if (typeof e === "function") {
        return e(t);
    }
    return e;
}

const x = /*@__PURE__*/ e.DI.createInterface("RouterOptions");

class RouterOptions {
    constructor(t, e, s, i, n, r, o) {
        this.useUrlFragmentHash = t;
        this.useHref = e;
        this.historyStrategy = s;
        this.buildTitle = i;
        this.useNavigationModel = n;
        this.activeClass = r;
        this.restorePreviousRouteTreeOnError = o;
        this.Ve = t ? m : v;
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
    Z() {
        return new NavigationOptions(this.historyStrategy, this.title, this.titleSeparator, this.context, {
            ...this.queryParams
        }, this.fragment, this.state === null ? null : {
            ...this.state
        }, this.transitionPlan);
    }
    Oe(t) {
        return valueOrFuncToValue(t, this.historyStrategy);
    }
}

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
    Z() {
        return new ViewportInstruction(this.open, this.close, this.recognizedRoute, this.component.Z(), this.viewport, this.params, [ ...this.children ]);
    }
    toUrlComponent(t = true) {
        const e = this.component.toUrlComponent();
        const s = this.viewport;
        const i = e.length === 0 || s === null || s.length === 0 || s === E ? "" : `@${s}`;
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
                const i = o ? r.pe(s) : null;
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
            const e = RouteExpression.parse(s.Ve.parse(t));
            return e.toInstructionTree(i);
        }
        const c = o ? r.pe(isPartialViewportInstruction(t) ? {
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
        let s = "";
        if (!t) {
            const t = [];
            let e = this.options.context;
            if (e != null && !(e instanceof RouteContext)) throw new Error("Invalid operation; incompatible navigation context.");
            while (e != null && !e.isRoot) {
                const s = e.vpa;
                const i = s.bt === 4096 ? s.Tt : s.It;
                if (i == null) throw new Error("Invalid operation; nodes of the viewport agent are not set.");
                t.splice(0, 0, i.instruction.toUrlComponent());
                e = e.parent;
            }
            if (t[0] === "") {
                t.splice(0, 1);
            }
            s = t.join("/");
        }
        const i = this.toPath();
        return e.stringify(s.length > 0 ? `${s}/${i}` : i, this.queryParams, this.fragment);
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
    Z() {
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
        this.je = s;
        this.Zt = i;
        this.we = n;
        this.Ue = r;
        this.U = n.container.get(e.ILogger).scopeTo(`ComponentAgent<${n.Ot}>`);
        const o = s.lifecycleHooks;
        this.Le = (o.canLoad ?? []).map((t => t.instance));
        this.ze = (o.loading ?? []).map((t => t.instance));
        this.Be = (o.canUnload ?? []).map((t => t.instance));
        this.De = (o.unloading ?? []).map((t => t.instance));
        this.qe = "canLoad" in t;
        this.He = "loading" in t;
        this.Fe = "canUnload" in t;
        this.Ge = "unloading" in t;
    }
    Mt(t, e) {
        if (t === null) {
            return this.je.activate(this.je, e);
        }
        void this.je.activate(t, e);
    }
    Lt(t, e) {
        if (t === null) {
            return this.je.deactivate(this.je, e);
        }
        void this.je.deactivate(t, e);
    }
    Jt() {
        this.je.dispose();
    }
    Dt(t, e, s) {
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
                t.Qt((() => n.canUnload(this.Me, e, this.Zt)), (e => {
                    if (t.guardsResult === true && e !== true) {
                        t.guardsResult = false;
                    }
                    s.N();
                    i();
                }));
            }))));
        }
        if (this.Fe) {
            s._();
            i = i.then((() => {
                if (t.guardsResult !== true) {
                    s.N();
                    return;
                }
                t.Qt((() => this.Me.canUnload(e, this.Zt)), (e => {
                    if (t.guardsResult === true && e !== true) {
                        t.guardsResult = false;
                    }
                    s.N();
                }));
            }));
        }
        s.N();
    }
    Ht(t, e, s) {
        const i = this.we.root;
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
                t.Qt((() => r.canLoad(this.Me, e.params, e, this.Zt)), (e => {
                    if (t.guardsResult === true && e !== true) {
                        t.guardsResult = e === false ? false : ViewportInstructionTree.create(e, this.Ue, void 0, i);
                    }
                    s.N();
                    n();
                }));
            }))));
        }
        if (this.qe) {
            s._();
            n = n.then((() => {
                if (t.guardsResult !== true) {
                    s.N();
                    return;
                }
                t.Qt((() => this.Me.canLoad(e.params, e, this.Zt)), (e => {
                    if (t.guardsResult === true && e !== true) {
                        t.guardsResult = e === false ? false : ViewportInstructionTree.create(e, this.Ue, void 0, i);
                    }
                    s.N();
                }));
            }));
        }
        s.N();
    }
    Gt(t, e, s) {
        s._();
        for (const i of this.De) {
            t.Qt((() => {
                s._();
                return i.unloading(this.Me, e, this.Zt);
            }), (() => {
                s.N();
            }));
        }
        if (this.Ge) {
            t.Qt((() => {
                s._();
                return this.Me.unloading(e, this.Zt);
            }), (() => {
                s.N();
            }));
        }
        s.N();
    }
    Wt(t, e, s) {
        s._();
        for (const i of this.ze) {
            t.Qt((() => {
                s._();
                return i.loading(this.Me, e.params, e, this.Zt);
            }), (() => {
                s.N();
            }));
        }
        if (this.He) {
            t.Qt((() => {
                s._();
                return this.Me.loading(e.params, e, this.Zt);
            }), (() => {
                s.N();
            }));
        }
        s.N();
    }
}

const y = /*@__PURE__*/ e.DI.createInterface("IRouteContext");

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
        return this.We;
    }
    get node() {
        const t = this.Qe;
        if (t === null) throw new Error(getMessage(3171, this));
        return t;
    }
    set node(t) {
        const e = this.Je = this.Qe;
        if (e !== t) {
            this.Qe = t;
        }
    }
    get vpa() {
        const t = this.Ke;
        if (t === null) throw new Error(getMessage(3172, this));
        return t;
    }
    get navigationModel() {
        return this.Xe;
    }
    constructor(t, n, o, c, a, u) {
        this.parent = n;
        this.component = o;
        this.config = c;
        this.Ye = u;
        this.Ze = [];
        this.childRoutes = [];
        this.We = null;
        this.Je = null;
        this.Qe = null;
        this.ts = false;
        this.Ke = t;
        if (n === null) {
            this.root = this;
            this.path = [ this ];
            this.Ot = o.name;
        } else {
            this.root = n.root;
            this.path = [ ...n.path, this ];
            this.Ot = `${n.Ot}/${o.name}`;
        }
        this.U = a.get(e.ILogger).scopeTo(`RouteContext<${this.Ot}>`);
        this.es = a.get(e.IModuleLoader);
        const h = this.container = a.createChild();
        h.registerResolver(s.IController, this.ss = new e.InstanceProvider, true);
        const l = new e.InstanceProvider("IRouteContext", this);
        h.registerResolver(y, l);
        h.registerResolver(RouteContext, l);
        h.register(c);
        this.ns = new i.RouteRecognizer;
        if (u.options.useNavigationModel) {
            const t = this.Xe = new NavigationModel([]);
            h.get(r).subscribe("au:router:navigation-end", (() => t.rs(u, this)));
        } else {
            this.Xe = null;
        }
        this.os(c);
    }
    os(t) {
        const s = [];
        const i = t.routes ?? a;
        const n = i.length;
        if (n === 0) {
            const e = t.component.prototype?.getRouteConfig;
            this.ts = e == null ? true : typeof e !== "function";
            return;
        }
        const r = this.Xe;
        const o = r !== null;
        let c = 0;
        for (;c < n; c++) {
            const n = i[c];
            if (n instanceof Promise) {
                s.push(this.cs(n));
                continue;
            }
            const a = resolveRouteConfiguration(n, true, t, null, this);
            if (a instanceof Promise) {
                if (!isPartialChildRouteConfig(n) || n.path == null) throw new Error(getMessage(3173));
                for (const t of ensureArrayOfStrings(n.path)) {
                    this.us(t, n.caseSensitive ?? false, a);
                }
                const t = this.childRoutes.length;
                const i = a.then((e => this.childRoutes[t] = e));
                this.childRoutes.push(i);
                if (o) {
                    r.cs(i);
                }
                s.push(i.then(e.noop));
                continue;
            }
            for (const t of a.path ?? e.emptyArray) {
                this.us(t, a.caseSensitive, a);
            }
            this.childRoutes.push(a);
            if (o) {
                r.cs(a);
            }
        }
        this.ts = true;
        if (s.length > 0) {
            this.We = Promise.all(s).then((() => {
                this.We = null;
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
        const r = t.get(w);
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
    ge(t) {
        const e = this.Ze.find((e => e.zt(t)));
        if (e === void 0) throw new Error(getMessage(3174, t, this.ls()));
        return e;
    }
    getAvailableViewportAgents() {
        return this.Ze.filter((t => t.Bt()));
    }
    getFallbackViewportAgent(t) {
        return this.Ze.find((e => e.Bt() && e.viewport.name === t && e.viewport.fallback !== "")) ?? null;
    }
    Ft(t, i) {
        this.ss.prepare(t);
        const n = this.container;
        const r = n.get(i.component.key);
        const o = this.ts ? void 0 : e.onResolve(resolveRouteConfiguration(r, false, this.config, i, null), (t => this.os(t)));
        return e.onResolve(o, (() => {
            const e = s.Controller.$el(n, r, t.host, null);
            const o = new ComponentAgent(r, e, i, this, this.Ye.options);
            this.ss.dispose();
            return o;
        }));
    }
    ps(t) {
        const e = ViewportAgent.for(t, this);
        if (this.Ze.includes(e)) {
            return e;
        }
        this.Ze.push(e);
        return e;
    }
    gs(t) {
        const e = ViewportAgent.for(t, this);
        if (!this.Ze.includes(e)) {
            return;
        }
        this.Ze.splice(this.Ze.indexOf(e), 1);
    }
    recognize(t, e = false) {
        let s = this;
        let n = true;
        let r = null;
        while (n) {
            r = s.ns.recognize(t);
            if (r === null) {
                if (!e || s.isRoot) return null;
                s = s.parent;
            } else {
                n = false;
            }
        }
        return new $RecognizedRoute(r, Reflect.has(r.params, i.RESIDUE) ? r.params[i.RESIDUE] ?? null : null);
    }
    cs(t) {
        return e.onResolve(resolveRouteConfiguration(t, true, this.config, null, this), (t => {
            for (const s of t.path ?? e.emptyArray) {
                this.us(s, t.caseSensitive, t);
            }
            this.Xe?.cs(t);
            this.childRoutes.push(t);
        }));
    }
    us(t, e, s) {
        this.ns.add({
            path: t,
            caseSensitive: e,
            handler: s
        }, true);
    }
    et(t) {
        return this.es.load(t, (s => {
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
    pe(t) {
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
        const o = this.ns;
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
                    if (!i.satisfiesPattern(n)) {
                        a.push(`The value '${n}' for the parameter '${e}' does not satisfy the pattern '${i.pattern}'.`);
                        return null;
                    }
                    s[e] = n;
                }
                const o = i.isStar ? `*${e}` : i.isOptional ? `:${e}?` : `:${e}`;
                t = t.replace(o, encodeURIComponent(n));
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
        const t = this.Ze;
        const e = t.map(String).join(",");
        return `RC(path:'${this.Ot}',viewports:[${e}])`;
    }
    ls() {
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
    rs(t, s) {
        void e.onResolve(this.ds, (() => {
            for (const e of this.routes) {
                e.rs(t, s);
            }
        }));
    }
    cs(t) {
        const s = this.routes;
        if (!(t instanceof Promise)) {
            if ((t.nav ?? false) && t.redirectTo === null) {
                s.push(NavigationRoute.J(t));
            }
            return;
        }
        const i = s.length;
        s.push(void 0);
        let n = void 0;
        n = this.ds = e.onResolve(this.ds, (() => e.onResolve(t, (t => {
            if (t.nav && t.redirectTo === null) {
                s[i] = NavigationRoute.J(t);
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
    constructor(t, e, s, i) {
        this.id = t;
        this.path = e;
        this.title = s;
        this.data = i;
        this.ws = null;
    }
    static J(t) {
        return new NavigationRoute(t.id, ensureArrayOfStrings(t.path ?? e.emptyArray), t.title, t.data);
    }
    get isActive() {
        return this._t;
    }
    rs(t, s) {
        let n = this.ws;
        if (n === null) {
            const r = t.options;
            n = this.ws = this.path.map((t => {
                const n = s.ns.getEndpoint(t);
                if (n === null) throw new Error(getMessage(3450, t));
                return new ViewportInstructionTree(NavigationOptions.create(r, {
                    context: s
                }), false, [ ViewportInstruction.create({
                    recognizedRoute: new $RecognizedRoute(new i.RecognizedRoute(n, e.emptyObject), null),
                    component: t
                }) ], d, null);
            }));
        }
        this._t = n.some((e => t.routeTree.contains(e, true)));
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
        this.vs = void 0;
        this.je = void 0;
        this.we = e.resolve(y);
        this.U = e.resolve(e.ILogger).scopeTo(`au-viewport<${this.we.Ot}>`);
    }
    tt(t, e, i) {
        const n = this.fallback;
        return typeof n === "function" && !s.CustomElement.isType(n) ? n(t, e, i) : n;
    }
    hydrated(t) {
        this.je = t;
        this.vs = this.we.ps(this);
    }
    attaching(t, e) {
        return this.vs.At(t, this.je);
    }
    detaching(t, e) {
        return this.vs.Ut(t, this.je);
    }
    dispose() {
        this.we.gs(this);
        this.vs.Jt();
        this.vs = void 0;
    }
    toString() {
        const t = [];
        for (const e of S) {
            const s = this[e];
            switch (typeof s) {
              case "string":
                if (s !== "") {
                    t.push(`${e}:'${s}'`);
                }
                break;

              default:
                {
                    t.push(`${e}:${String(s)}`);
                }
            }
        }
        return `VP(ctx:'${this.we.Ot}',${t.join(",")})`;
    }
};

__decorate([ s.bindable ], exports.ViewportCustomElement.prototype, "name", void 0);

__decorate([ s.bindable ], exports.ViewportCustomElement.prototype, "usedBy", void 0);

__decorate([ s.bindable ], exports.ViewportCustomElement.prototype, "default", void 0);

__decorate([ s.bindable ], exports.ViewportCustomElement.prototype, "fallback", void 0);

exports.ViewportCustomElement = __decorate([ s.customElement({
    name: "au-viewport"
}) ], exports.ViewportCustomElement);

const S = [ "name", "usedBy", "default", "fallback" ];

exports.LoadCustomAttribute = class LoadCustomAttribute {
    constructor() {
        this.xs = e.resolve(s.INode);
        this.Ye = e.resolve(w);
        this.we = e.resolve(y);
        this.I = e.resolve(r);
        this.ke = e.resolve(c);
        this.attribute = "href";
        this.active = false;
        this.Es = null;
        this.Ee = null;
        this.ys = null;
        this.onClick = t => {
            if (this.Ee === null) {
                return;
            }
            if (t.altKey || t.ctrlKey || t.shiftKey || t.metaKey || t.button !== 0) {
                return;
            }
            t.preventDefault();
            void this.Ye.load(this.Ee, {
                context: this.context
            });
        };
        const t = this.xs;
        this.Rs = !t.hasAttribute("external") && !t.hasAttribute("data-external");
        this.Ss = this.Ye.options.activeClass;
    }
    binding() {
        if (this.Rs) {
            this.xs.addEventListener("click", this.onClick);
        }
        this.valueChanged();
        this.ys = this.I.subscribe("au:router:navigation-end", (t => {
            const e = this.active = this.Ee !== null && this.Ye.isActive(this.Ee, this.context);
            const s = this.Ss;
            if (s === null) return;
            this.xs.classList.toggle(s, e);
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
            this.xs.removeEventListener("click", this.onClick);
        }
        this.ys.dispose();
    }
    valueChanged() {
        const t = this.Ye;
        const e = t.options;
        const i = this.route;
        let n = this.context;
        if (n === void 0) {
            n = this.context = this.we;
        } else if (n === null) {
            n = this.context = this.we.root;
        }
        if (i != null && n.allResolved === null) {
            const s = this.params;
            const r = this.Ee = t.createViewportInstructions(typeof s === "object" && s !== null ? {
                component: i,
                params: s
            } : i, {
                context: n
            });
            this.Es = r.toUrl(false, e.Ve);
        } else {
            this.Ee = null;
            this.Es = null;
        }
        const r = s.CustomElement.for(this.xs, {
            optional: true
        });
        if (r !== null) {
            r.viewModel[this.attribute] = this.Ee;
        } else {
            if (this.Es === null) {
                this.xs.removeAttribute(this.attribute);
            } else {
                const t = e.useUrlFragmentHash ? this.Es : this.ke.addBaseHref(this.Es);
                this.xs.setAttribute(this.attribute, t);
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
    get bs() {
        return this.xs.hasAttribute("external") || this.xs.hasAttribute("data-external");
    }
    constructor() {
        this.xs = e.resolve(s.INode);
        this.Ye = e.resolve(w);
        this.we = e.resolve(y);
        this.Cs = false;
        if (this.Ye.options.useHref && this.xs.nodeName === "A") {
            const t = e.resolve(s.IWindow).name;
            switch (this.xs.getAttribute("target")) {
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
        if (!this.Cs) {
            this.Cs = true;
            this.Rs = this.Rs && s.getRef(this.xs, s.CustomAttribute.getDefinition(exports.LoadCustomAttribute).key) === null;
        }
        this.valueChanged(this.value);
        this.xs.addEventListener("click", this);
    }
    unbinding() {
        this.xs.removeEventListener("click", this);
    }
    valueChanged(t) {
        if (t == null) {
            this.xs.removeAttribute("href");
        } else {
            if (this.Ye.options.useUrlFragmentHash && this.we.isRoot && !/^[.#]/.test(t)) {
                t = `#${t}`;
            }
            this.xs.setAttribute("href", t);
        }
    }
    handleEvent(t) {
        this._s(t);
    }
    _s(t) {
        if (t.altKey || t.ctrlKey || t.shiftKey || t.metaKey || t.button !== 0 || this.bs || !this.Rs) {
            return;
        }
        const e = this.xs.getAttribute("href");
        if (e !== null) {
            t.preventDefault();
            void this.Ye.load(e, {
                context: this.we
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

const b = w;

const C = [ b ];

const _ = exports.ViewportCustomElement;

const N = exports.LoadCustomAttribute;

const k = exports.HrefCustomAttribute;

const $ = [ exports.ViewportCustomElement, exports.LoadCustomAttribute, exports.HrefCustomAttribute ];

function configure(i, n) {
    let r = null;
    if (t.isObject(n)) {
        r = n.basePath ?? null;
    } else {
        n = {};
    }
    const c = RouterOptions.create(n);
    return i.register(e.Registration.cachedCallback(o, ((t, e, i) => {
        const n = t.get(s.IWindow);
        const o = new URL(n.document.baseURI);
        o.pathname = normalizePath(r ?? o.pathname);
        return o;
    })), e.Registration.instance(x, c), e.Registration.instance(RouterOptions, c), s.AppTask.creating(w, (t => {})), s.AppTask.hydrated(e.IContainer, RouteContext.setRoot), s.AppTask.activated(w, (t => t.start(true))), s.AppTask.deactivated(w, (t => {
        t.stop();
    })), ...C, ...$);
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
        this.xs = t;
        this.Ns = t.scrollTop;
        this.ks = t.scrollLeft;
    }
    static $s(t) {
        return t.scrollTop > 0 || t.scrollLeft > 0;
    }
    Ts() {
        this.xs.scrollTo(this.ks, this.Ns);
        this.xs = null;
    }
}

function restoreState(t) {
    t.Ts();
}

class HostElementState {
    constructor(t) {
        this.Is = [];
        this.Ps(t.children);
    }
    Ps(t) {
        let e;
        for (let s = 0, i = t.length; s < i; ++s) {
            e = t[s];
            if (ScrollState.$s(e)) {
                this.Is.push(new ScrollState(e));
            }
            this.Ps(e.children);
        }
    }
    Ts() {
        this.Is.forEach(restoreState);
        this.Is = null;
    }
}

const I = /*@__PURE__*/ e.DI.createInterface("IStateManager", (t => t.singleton(ScrollStateManager)));

class ScrollStateManager {
    constructor() {
        this.Vs = new WeakMap;
    }
    saveState(t) {
        this.Vs.set(t.host, new HostElementState(t.host));
    }
    restoreState(t) {
        const e = this.Vs.get(t.host);
        if (e !== void 0) {
            e.Ts();
            this.Vs.delete(t.host);
        }
    }
}

exports.AST = f;

exports.AuNavId = n;

exports.ComponentExpression = ComponentExpression;

exports.CompositeSegmentExpression = CompositeSegmentExpression;

exports.DefaultComponents = C;

exports.DefaultResources = $;

exports.HrefCustomAttributeRegistration = k;

exports.ILocationManager = c;

exports.IRouteContext = y;

exports.IRouter = w;

exports.IRouterEvents = r;

exports.IRouterOptions = x;

exports.IStateManager = I;

exports.LoadCustomAttributeRegistration = N;

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

exports.RouterRegistration = b;

exports.ScopedSegmentExpression = ScopedSegmentExpression;

exports.SegmentExpression = SegmentExpression;

exports.SegmentGroupExpression = SegmentGroupExpression;

exports.Transition = Transition;

exports.ViewportAgent = ViewportAgent;

exports.ViewportCustomElementRegistration = _;

exports.ViewportExpression = ViewportExpression;

exports.fragmentUrlParser = m;

exports.isManagedState = isManagedState;

exports.pathUrlParser = v;

exports.route = route;

exports.toManagedState = toManagedState;
//# sourceMappingURL=index.cjs.map
