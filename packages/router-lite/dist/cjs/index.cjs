"use strict";

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
    N() {
        let t = this;
        do {
            ++t.t;
            t = t.h;
        } while (t !== null);
    }
    $() {
        let t = this;
        do {
            if (--t.t === 0) {
                t._();
            }
            t = t.h;
        } while (t !== null);
    }
    _() {
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
        this.R.N();
        this.R.$();
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

const n = s.BindingMode.toView;

const r = s.BindingMode.fromView;

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

const o = "au-nav-id";

class Subscription {
    constructor(t, e, s) {
        this.I = t;
        this.P = e;
        this.V = s;
        this.A = false;
    }
    dispose() {
        if (!this.A) {
            this.A = true;
            this.V.dispose();
            const t = this.I["O"];
            t.splice(t.indexOf(this), 1);
        }
    }
}

const a = /*@__PURE__*/ e.DI.createInterface("IRouterEvents", (t => t.singleton(RouterEvents)));

class RouterEvents {
    constructor() {
        this.M = 0;
        this.O = [];
        this.j = e.resolve(e.IEventAggregator);
        this.L = e.resolve(e.ILogger).scopeTo("RouterEvents");
    }
    publish(t) {
        this.j.publish(t.name, t);
    }
    subscribe(t, e) {
        const s = new Subscription(this, ++this.M, this.j.subscribe(t, (t => {
            e(t);
        })));
        this.O.push(s);
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

const u = /*@__PURE__*/ e.DI.createInterface("ILocationManager", (t => t.singleton(BrowserLocationManager)));

class BrowserLocationManager {
    constructor() {
        this.U = 0;
        this.L = e.resolve(e.ILogger).root.scopeTo("LocationManager");
        this.I = e.resolve(a);
        this.B = e.resolve(s.IHistory);
        this.l = e.resolve(s.ILocation);
        this.H = e.resolve(s.IWindow);
        this.q = e.resolve(c);
        this.F = e.resolve(y).useUrlFragmentHash ? "hashchange" : "popstate";
    }
    startListening() {
        this.H.addEventListener(this.F, this, false);
    }
    stopListening() {
        this.H.removeEventListener(this.F, this, false);
    }
    handleEvent(t) {
        this.I.publish(new LocationChangeEvent(++this.U, this.getPath(), this.F, "state" in t ? t.state : null));
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
        let s = this.q.href;
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
        const e = this.q.pathname;
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

class RouteConfig {
    get path() {
        const t = this.G;
        if (t.length > 0) return t;
        const e = s.CustomElement.getDefinition(this.component);
        return this.G = [ e.name, ...e.aliases ];
    }
    constructor(t, e, s, i, n, r, o, a, c, u, h, l) {
        this.id = t;
        this.G = e;
        this.title = s;
        this.redirectTo = i;
        this.caseSensitive = n;
        this.transitionPlan = r;
        this.viewport = o;
        this.data = a;
        this.routes = c;
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
            const a = s?.transitionPlan ?? null;
            const c = s?.viewport ?? R;
            const u = s?.data ?? {};
            const l = s?.routes ?? h;
            return new RouteConfig(r, e, o, i, n, a, c, u, l, s?.fallback ?? null, s, s?.nav ?? true);
        } else if (typeof t === "object") {
            const i = t;
            validateRouteConfig(i, "");
            const n = ensureArrayOfStrings(i.path ?? s?.path ?? e.emptyArray);
            const r = i.title ?? s?.title ?? null;
            const o = i.redirectTo ?? s?.redirectTo ?? null;
            const a = i.caseSensitive ?? s?.caseSensitive ?? false;
            const c = i.id ?? s?.id ?? (n instanceof Array ? n[0] : n);
            const u = i.transitionPlan ?? s?.transitionPlan ?? null;
            const l = i.viewport ?? s?.viewport ?? R;
            const f = {
                ...s?.data,
                ...i.data
            };
            const p = [ ...i.routes ?? h, ...s?.routes ?? h ];
            return new RouteConfig(c, n, r, o, a, u, l, f, p, i.fallback ?? s?.fallback ?? null, i.component ?? s ?? null, i.nav ?? true);
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
}

const l = {
    name: /*@__PURE__*/ e.getResourceKeyFor("route-configuration"),
    isConfigured(e) {
        return t.Metadata.has(l.name, e);
    },
    configure(e, s) {
        const i = RouteConfig.J(e, s);
        t.Metadata.define(i, s, l.name);
        return s;
    },
    getConfig(e) {
        if (!l.isConfigured(e)) {
            l.configure({}, e);
        }
        return t.Metadata.get(l.name, e);
    }
};

function route(t) {
    return function(e, s) {
        s.addInitializer((function() {
            l.configure(t, this);
        }));
        return e;
    };
}

function resolveRouteConfiguration(t, s, i, n, r) {
    if (isPartialRedirectRouteConfig(t)) return RouteConfig.J(t, null);
    const [o, a] = resolveCustomElementDefinition(t, r);
    return e.onResolve(a, (r => {
        const a = r.Type;
        const c = l.getConfig(a);
        if (isPartialChildRouteConfig(t)) return c.K(t, i);
        if (s) return c.Z();
        if (!c.W && o.type === 4 && typeof t.getRouteConfig === "function") {
            return e.onResolve(c.Y(t, i, n), (() => c));
        }
        return c;
    }));
}

function resolveCustomElementDefinition(t, e) {
    const i = createNavigationInstruction(t);
    let n;
    switch (i.type) {
      case 0:
        {
            if (e == null) throw new Error(getMessage(3551));
            const t = s.CustomElement.find(e.container, i.value);
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

const f = [ "?", "#", "/", "+", "(", ")", ".", "@", "!", "=", ",", "&", "'", "~", ";" ];

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
    Et() {
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

const p = new Map;

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
        let s = p.get(e);
        if (s === void 0) {
            p.set(e, s = RouteExpression.xt(t));
        }
        return s;
    }
    static xt(t) {
        const e = t.path;
        if (e === "") {
            return new RouteExpression(false, SegmentExpression.Empty, t.query, t.fragment);
        }
        const s = new ParserState(e);
        s.wt();
        const i = s.ut("/");
        const n = CompositeSegmentExpression.yt(s);
        s.gt();
        s.Et();
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
            t.Et();
            return s[0];
        }
        t.Et();
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
            t.Et();
            return new ScopedSegmentExpression(e, s);
        }
        t.Et();
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
            t.Et();
            return new SegmentGroupExpression(e);
        }
        t.Et();
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
        t.Et();
        return new SegmentExpression(e, s, i);
    }
    Rt(t, e) {
        return [ ViewportInstruction.create({
            component: this.component.name,
            params: this.component.parameterList.bt(),
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
                while (!t.u && !t.ct(...f)) {
                    t.dt();
                }
            }
        }
        const e = t.vt();
        if (e.length === 0) {
            t.ft("component name");
        }
        const s = ParameterListExpression.yt(t);
        t.Et();
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
            while (!t.u && !t.ct(...f)) {
                t.dt();
            }
            e = decodeURIComponent(t.vt());
            if (e.length === 0) {
                t.ft("viewport name");
            }
        }
        t.Et();
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
        t.Et();
        return new ParameterListExpression(e);
    }
    bt() {
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
        while (!t.u && !t.ct(...f)) {
            t.dt();
        }
        let s = t.vt();
        if (s.length === 0) {
            t.ft("parameter key");
        }
        let i;
        if (t.ut("=")) {
            t.wt();
            while (!t.u && !t.ct(...f)) {
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
        t.Et();
        return new ParameterExpression(s, i);
    }
}

const g = Object.freeze({
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

const d = new WeakMap;

class ViewportAgent {
    get St() {
        return this._state & 16256;
    }
    set St(t) {
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
        this.Nt = false;
        this.kt = null;
        this.$t = null;
        this._state = 8256;
        this._t = "replace";
        this.Tt = null;
        this.It = null;
        this.Pt = null;
        this.Vt = null;
        this.L = i.container.get(e.ILogger).scopeTo(`ViewportAgent<${i.At}>`);
    }
    static for(t, e) {
        let i = d.get(t);
        if (i === void 0) {
            const n = s.Controller.getCachedOrThrow(t);
            d.set(t, i = new ViewportAgent(t, n, e));
        }
        return i;
    }
    Ot(t, e) {
        const s = this.Pt;
        if (s !== null) {
            ensureTransitionHasNotErrored(s);
        }
        this.Nt = true;
        switch (this.Ct) {
          case 64:
            switch (this.St) {
              case 8192:
                return;

              case 4096:
                return this.kt.Mt(t, e);

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
    Lt(t, e) {
        const s = this.Pt;
        if (s !== null) {
            ensureTransitionHasNotErrored(s);
        }
        this.Nt = false;
        switch (this.St) {
          case 8192:
            return;

          case 4096:
            return this.kt.Ut(t, e);

          case 128:
            return;

          default:
            {
                if (this.Pt === null) throw new Error(getMessage(3351, this));
                const e = Batch.C((e => {
                    this.Ut(t, this.Pt, e);
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
        if (s !== R && i !== s) {
            return false;
        }
        const n = e.usedBy;
        if (n.length > 0 && !n.split(",").includes(t.componentName)) {
            return false;
        }
        return true;
    }
    Bt() {
        if (!this.Nt) {
            return false;
        }
        if (this.Ct !== 64) {
            return false;
        }
        return true;
    }
    Ht(t, s) {
        if (this.Pt === null) {
            this.Pt = t;
        }
        ensureTransitionHasNotErrored(t);
        if (t.guardsResult !== true) {
            return;
        }
        s.N();
        void e.onResolve(this.Vt, (() => {
            Batch.C((e => {
                for (const s of this.Tt.children) {
                    s.context.vpa.Ht(t, e);
                }
            })).T((e => {
                switch (this.St) {
                  case 4096:
                    switch (this._t) {
                      case "none":
                        this.St = 1024;
                        return;

                      case "invoke-lifecycles":
                      case "replace":
                        this.St = 2048;
                        e.N();
                        Batch.C((e => {
                            this.kt.Ht(t, this.It, e);
                        })).T((() => {
                            this.St = 1024;
                            e.$();
                        })).C();
                        return;
                    }

                  case 8192:
                    return;

                  default:
                    t.qt(new Error(`Unexpected state at canUnload of ${this}`));
                }
            })).T((() => {
                s.$();
            })).C();
        }));
    }
    Dt(t, s) {
        if (this.Pt === null) {
            this.Pt = t;
        }
        ensureTransitionHasNotErrored(t);
        if (t.guardsResult !== true) {
            return;
        }
        s.N();
        Batch.C((s => {
            switch (this.Ct) {
              case 32:
                this.Ct = 16;
                switch (this._t) {
                  case "none":
                    return;

                  case "invoke-lifecycles":
                    return this.kt.Dt(t, this.It, s);

                  case "replace":
                    s.N();
                    void e.onResolve(this.It.context.Ft(this.hostController, this.It), (e => {
                        (this.$t = e).Dt(t, this.It, s);
                        s.$();
                    }));
                }

              case 64:
                return;

              default:
                this.jt("canLoad");
            }
        })).T((t => {
            const s = this.It;
            switch (this._t) {
              case "none":
              case "invoke-lifecycles":
                {
                    t.N();
                    const i = s.context;
                    void e.onResolve(i.allResolved, (() => e.onResolve(e.onResolve(e.onResolveAll(...s.residue.splice(0).map((t => createAndAppendNodes(this.L, s, t)))), (() => e.onResolveAll(...i.getAvailableViewportAgents().reduce(((t, e) => {
                        const i = e.viewport;
                        const n = i.default;
                        if (n === null) return t;
                        t.push(createAndAppendNodes(this.L, s, ViewportInstruction.create({
                            component: n,
                            viewport: i.name
                        })));
                        return t;
                    }), [])))), (() => {
                        t.$();
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
                    s.context.vpa.Dt(t, e);
                }
                return;

              case 64:
                return;

              default:
                this.jt("canLoad");
            }
        })).T((() => {
            s.$();
        })).C();
    }
    Gt(t, e) {
        ensureTransitionHasNotErrored(t);
        ensureGuardsResultIsTrue(this, t);
        e.N();
        Batch.C((e => {
            for (const s of this.Tt.children) {
                s.context.vpa.Gt(t, e);
            }
        })).T((s => {
            switch (this.St) {
              case 1024:
                switch (this._t) {
                  case "none":
                    this.St = 256;
                    return;

                  case "invoke-lifecycles":
                  case "replace":
                    this.St = 512;
                    s.N();
                    Batch.C((e => {
                        this.kt.Gt(t, this.It, e);
                    })).T((() => {
                        this.St = 256;
                        s.$();
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
            e.$();
        })).C();
    }
    Wt(t, e) {
        ensureTransitionHasNotErrored(t);
        ensureGuardsResultIsTrue(this, t);
        e.N();
        Batch.C((e => {
            switch (this.Ct) {
              case 8:
                {
                    this.Ct = 4;
                    switch (this._t) {
                      case "none":
                        return;

                      case "invoke-lifecycles":
                        return this.kt.Wt(t, this.It, e);

                      case "replace":
                        return this.$t.Wt(t, this.It, e);
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
            e.$();
        })).C();
    }
    Ut(t, s, i) {
        ensureTransitionHasNotErrored(s);
        ensureGuardsResultIsTrue(this, s);
        i.N();
        switch (this.St) {
          case 256:
            this.St = 128;
            switch (this._t) {
              case "none":
              case "invoke-lifecycles":
                i.$();
                return;

              case "replace":
                {
                    const n = this.hostController;
                    const r = this.kt;
                    s.Qt((() => e.onResolve(r.Ut(t, n), (() => {
                        if (t === null) {
                            r.Jt();
                        }
                    }))), (() => {
                        i.$();
                    }));
                }
            }
            return;

          case 8192:
            i.$();
            return;

          case 128:
            i.$();
            return;

          default:
            this.jt("deactivate");
        }
    }
    Mt(t, e, s) {
        ensureTransitionHasNotErrored(e);
        ensureGuardsResultIsTrue(this, e);
        s.N();
        if (this.Ct === 32) {
            Batch.C((t => {
                this.Dt(e, t);
            })).T((t => {
                this.Wt(e, t);
            })).T((s => {
                this.Mt(t, e, s);
            })).T((() => {
                s.$();
            })).C();
            return;
        }
        switch (this.Ct) {
          case 2:
            this.Ct = 1;
            Batch.C((s => {
                switch (this._t) {
                  case "none":
                  case "invoke-lifecycles":
                    return;

                  case "replace":
                    {
                        const i = this.hostController;
                        e.Qt((() => {
                            s.N();
                            return this.$t.Mt(t, i);
                        }), (() => {
                            s.$();
                        }));
                    }
                }
            })).T((t => {
                this.Kt(e, t);
            })).T((() => {
                s.$();
            })).C();
            return;

          case 64:
            s.$();
            return;

          default:
            this.jt("activate");
        }
    }
    Xt(t, s) {
        if (this.St === 8192) {
            this.Mt(null, t, s);
            return;
        }
        if (this.Ct === 64) {
            this.Ut(null, t, s);
            return;
        }
        ensureTransitionHasNotErrored(t);
        ensureGuardsResultIsTrue(this, t);
        if (!(this.St === 256 && this.Ct === 2)) {
            this.jt("swap");
        }
        this.St = 128;
        this.Ct = 1;
        switch (this._t) {
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
                const n = this.kt;
                const r = this.$t;
                s.N();
                Batch.C((s => {
                    t.Qt((() => {
                        s.N();
                        return e.onResolve(n.Ut(null, i), (() => n.Jt()));
                    }), (() => {
                        s.$();
                    }));
                })).T((e => {
                    t.Qt((() => {
                        e.N();
                        return r.Mt(null, i);
                    }), (() => {
                        e.$();
                    }));
                })).T((e => {
                    this.Kt(t, e);
                })).T((() => {
                    s.$();
                })).C();
                return;
            }
        }
    }
    Kt(t, s) {
        const i = this.It;
        t.Qt((() => {
            s.N();
            const t = i.context;
            return e.onResolve(t.allResolved, (() => {
                const s = i.children.slice();
                return e.onResolve(e.onResolveAll(...i.residue.splice(0).map((t => createAndAppendNodes(this.L, i, t)))), (() => e.onResolve(e.onResolveAll(...t.getAvailableViewportAgents().reduce(((t, e) => {
                    const s = e.viewport;
                    const n = s.default;
                    if (n === null) return t;
                    t.push(createAndAppendNodes(this.L, i, ViewportInstruction.create({
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
                        s.N();
                        return i.context.vpa.Dt(t, s);
                    }), (() => {
                        s.$();
                    }));
                }
            })).T((s => {
                for (const i of e) {
                    t.Qt((() => {
                        s.N();
                        return i.context.vpa.Wt(t, s);
                    }), (() => {
                        s.$();
                    }));
                }
            })).T((s => {
                for (const i of e) {
                    t.Qt((() => {
                        s.N();
                        return i.context.vpa.Mt(null, t, s);
                    }), (() => {
                        s.$();
                    }));
                }
            })).T((() => {
                s.$();
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
        switch (this.St) {
          case 8192:
          case 4096:
          case 1024:
            break;

          default:
            this.jt("scheduleUpdate 2");
        }
        const s = this.kt?.Zt ?? null;
        if (s === null || s.component !== e.component) {
            this._t = "replace";
        } else {
            this._t = e.context.config.X(s, e, t.transitionPlan);
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
        switch (this.St) {
          case 8192:
          case 4096:
            this.Pt = null;
            break;

          case 2048:
          case 1024:
            this.St = 4096;
            this.Pt = null;
            break;

          case 512:
          case 256:
          case 128:
            t = e.onResolve(this.kt?.Ut(null, this.hostController), (() => {
                this.kt?.Jt();
                this.St = 8192;
                this.kt = null;
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
                s = e.onResolve(this.$t?.Ut(null, this.hostController), (() => {
                    this.$t?.Jt();
                    this._t = "replace";
                    this.Ct = 64;
                    this.$t = null;
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
                switch (this.St) {
                  case 8192:
                  case 128:
                    this.St = 8192;
                    this.kt = null;
                    break;

                  default:
                    this.jt("endTransition 1");
                }
                break;

              case 1:
                switch (this.St) {
                  case 8192:
                  case 128:
                    switch (this._t) {
                      case "none":
                        this.St = 4096;
                        break;

                      case "invoke-lifecycles":
                        this.St = 4096;
                        this.kt.Zt = this.It;
                        break;

                      case "replace":
                        this.St = 4096;
                        this.kt = this.$t;
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
            this._t = "replace";
            this.Ct = 64;
            this.It = null;
            this.$t = null;
            this.Pt = null;
        }
    }
    toString() {
        return `VPA(state:${$state(this._state)},plan:'${this._t}',n:${this.It},c:${this.Tt},viewport:${this.viewport})`;
    }
    Jt() {
        this.kt?.Jt();
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

const w = new Map;

function $state(t) {
    let e = w.get(t);
    if (e === void 0) {
        w.set(t, e = stringifyState(t));
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
    constructor(t, e, s, i, n, r, o, a, c, u, h, l, f) {
        this.path = t;
        this.finalPath = e;
        this.context = s;
        this.ne = i;
        this.instruction = n;
        this.params = r;
        this.queryParams = o;
        this.fragment = a;
        this.data = c;
        this.re = u;
        this.title = h;
        this.component = l;
        this.residue = f;
        this.oe = 1;
        this.ie = false;
        this.children = [];
        this.ne ??= n;
    }
    static create(t) {
        const {[i.RESIDUE]: s, ...n} = t.params ?? {};
        return new RouteNode(t.path, t.finalPath, t.context, t.originalInstruction ?? t.instruction, t.instruction, Object.freeze(n), t.queryParams ?? m, t.fragment ?? null, Object.freeze(t.data ?? e.emptyObject), t.re ?? null, t.title ?? null, t.component, t.residue ?? []);
    }
    contains(t, e = false) {
        if (this.context === t.options.context) {
            const s = this.children;
            const i = t.children;
            for (let t = 0, n = s.length; t < n; ++t) {
                for (let r = 0, o = i.length; r < o; ++r) {
                    const a = i[r];
                    const c = e ? a.recognizedRoute?.route.endpoint : null;
                    const u = s[t + r] ?? null;
                    const h = u !== null ? u.isInstructionsFinalized ? u.instruction : u.ne : null;
                    const l = h?.recognizedRoute?.route.endpoint;
                    if (t + r < n && ((c?.equalsOrResidual(l) ?? false) || (h?.contains(a) ?? false))) {
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
    ae(t) {
        this.children.push(t);
        t.ce(this.se);
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
    ce(t) {
        this.se = t;
        for (const e of this.children) {
            e.ce(t);
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
        return `RN(ctx:'${this.context?.At}',${t.join(",")})`;
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
        t.root.ce(this);
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
                let a = 0;
                let c = i.component.value;
                let u = i;
                while (u.children.length === 1) {
                    u = u.children[0];
                    if (u.component.type === 0) {
                        ++a;
                        c = `${c}/${u.component.value}`;
                    } else {
                        break;
                    }
                }
                o = n.recognize(c);
                t.trace("createNode recognized route: %s", o);
                const h = o?.residue ?? null;
                t.trace("createNode residue:", h);
                const l = h === null;
                if (o === null || h === c) {
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
                    let a = i.viewport;
                    if (a === null || a.length === 0) a = R;
                    const c = n.getFallbackViewportAgent(a);
                    const u = c !== null ? c.viewport.tt(i, s, n) : n.config.tt(i, s, n);
                    if (u === null) throw new UnknownRouteError(getMessage(3401, o, n.At, a, o, n.component.name));
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
                i.component.value = l ? c : c.slice(0, -(h.length + 1));
                let f = !l;
                for (let t = 0; t < a; ++t) {
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
                const {vi: o, query: a} = n.pe({
                    component: r,
                    params: i.params ?? e.emptyObject,
                    open: i.open,
                    close: i.close,
                    viewport: i.viewport,
                    children: i.children
                });
                s.se.fe(a);
                return appendNode(t, s, createConfiguredNode(t, s, o, o.recognizedRoute, i));
            }));
        }
    }
}

function createConfiguredNode(t, s, i, n, r, o = n.route.endpoint.route) {
    const a = s.context;
    const c = s.se;
    return e.onResolve(o.handler, (u => {
        o.handler = u;
        t.trace(`creatingConfiguredNode(rdc:%s, vi:%s)`, u, i);
        if (u.redirectTo === null) {
            const h = (i.viewport?.length ?? 0) > 0;
            const l = h ? i.viewport : u.viewport;
            return e.onResolve(resolveCustomElementDefinition(u.component, a)[1], (f => {
                const p = a.ge(new ViewportRequest(l, f.name));
                if (!h) {
                    i.viewport = p.viewport.name;
                }
                const g = a.container.get(v);
                return e.onResolve(g.getRouteContext(p, f, null, p.hostController.container, a.config, a, u), (e => {
                    t.trace("createConfiguredNode setting the context node");
                    const a = e.node = RouteNode.create({
                        path: n.route.endpoint.route.path,
                        finalPath: o.path,
                        context: e,
                        instruction: i,
                        originalInstruction: r,
                        params: n.route.params,
                        queryParams: c.queryParams,
                        fragment: c.fragment,
                        data: u.data,
                        re: l,
                        component: f,
                        title: u.title,
                        residue: i.children.slice()
                    });
                    a.ce(s.se);
                    t.trace(`createConfiguredNode(vi:%s) -> %s`, i, a);
                    return a;
                }));
            }));
        }
        const h = RouteExpression.parse(E.parse(o.path));
        const l = RouteExpression.parse(E.parse(u.redirectTo));
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
        let w;
        let m = false;
        let x = false;
        while (!(m && x)) {
            if (m) {
                d = null;
            } else if (f.kind === "Segment") {
                d = f;
                m = true;
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
            if (x) {
                w = null;
            } else if (p.kind === "Segment") {
                w = p;
                x = true;
            } else if (p.left.kind === "Segment") {
                w = p.left;
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
            if (w !== null) {
                if (w.component.isDynamic && (d?.component.isDynamic ?? false)) {
                    g.push(n.route.params[w.component.parameterName]);
                } else {
                    g.push(w.component.name);
                }
            }
        }
        const y = g.filter(Boolean).join("/");
        const R = a.recognize(y);
        if (R === null) throw new UnknownRouteError(getMessage(3402, y, a.At, y, a.component.name));
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
        s.ae(e);
        return e.context.vpa.Yt(s.se.options, e);
    }));
}

function createFallbackNode(t, s, n, r) {
    const o = new $RecognizedRoute(new i.RecognizedRoute(new i.Endpoint(new i.ConfigurableRoute(s.path[0], s.caseSensitive, s), []), e.emptyObject), null);
    r.children.length = 0;
    return createConfiguredNode(t, n, r, o, null);
}

const m = Object.freeze(new URLSearchParams);

function isManagedState(e) {
    return t.isObject(e) && Object.prototype.hasOwnProperty.call(e, o) === true;
}

function toManagedState(t, e) {
    return {
        ...t,
        [o]: e
    };
}

class UnknownRouteError extends Error {}

class Transition {
    get erredWithUnknownRoute() {
        return this.de;
    }
    constructor(t, e, s, i, n, r, o, a, c, u, h, l, f, p, g) {
        this.id = t;
        this.prevInstructions = e;
        this.instructions = s;
        this.finalInstructions = i;
        this.instructionsChanged = n;
        this.trigger = r;
        this.options = o;
        this.managedState = a;
        this.previousRouteTree = c;
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

const v = /*@__PURE__*/ e.DI.createInterface("IRouter", (t => t.singleton(Router)));

class Router {
    get we() {
        const t = this.me;
        if (t !== null) return t;
        if (!this.c.has(b, true)) throw new Error(getMessage(3271));
        return this.me = this.c.get(b);
    }
    get routeTree() {
        let t = this.ve;
        if (t === null) {
            const e = this.we;
            t = this.ve = new RouteTree(NavigationOptions.create(this.options, {}), m, null, RouteNode.create({
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
        return this.Ee ??= Transition.J({
            id: 0,
            prevInstructions: this.xe,
            instructions: this.xe,
            finalInstructions: this.xe,
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
        });
    }
    set currentTr(t) {
        this.Ee = t;
    }
    get isNavigating() {
        return this.ye;
    }
    constructor() {
        this.me = null;
        this.ve = null;
        this.Ee = null;
        this.Re = false;
        this.be = 0;
        this.Se = null;
        this.Ce = null;
        this.Ne = false;
        this.ye = false;
        this.c = e.resolve(e.IContainer);
        this.ke = e.resolve(s.IPlatform);
        this.L = e.resolve(e.ILogger).root.scopeTo("Router");
        this.I = e.resolve(a);
        this.$e = e.resolve(u);
        this.options = e.resolve(y);
        this._e = new Map;
        this.xe = ViewportInstructionTree.create("", this.options);
        this.c.registerResolver(Router, e.Registration.instance(Router, this));
    }
    Te(t) {
        return RouteContext.resolve(this.we, t);
    }
    start(t) {
        this.Ne = typeof this.options.buildTitle === "function";
        this.$e.startListening();
        this.Ce = this.I.subscribe("au:router:location-change", (t => {
            this.ke.taskQueue.queueTask((() => {
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
            return this.load(this.$e.getPath(), {
                historyStrategy: "replace"
            });
        }
    }
    stop() {
        this.$e.stopListening();
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
    getRouteContext(t, s, i, n, r, o, a) {
        return e.onResolve(a instanceof RouteConfig ? a : resolveRouteConfiguration(typeof i?.getRouteConfig === "function" ? i : s.Type, false, r, null, o), (e => {
            let i = this._e.get(t);
            if (i === void 0) {
                this._e.set(t, i = new WeakMap);
            }
            let r = i.get(e);
            if (r !== void 0) {
                return r;
            }
            const o = n.has(b, true) ? n.get(b) : null;
            i.set(e, r = new RouteContext(t, o, s, e, n, this));
            return r;
        }));
    }
    createViewportInstructions(t, e) {
        if (t instanceof ViewportInstructionTree) return t;
        let s = e?.context ?? null;
        if (typeof t === "string") {
            t = this.$e.removeBaseHref(t);
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
        const r = this.L;
        if (e !== "api" && n.trigger === "api" && n.instructions.equals(t)) {
            return true;
        }
        let o = void 0;
        let a = void 0;
        let c;
        const u = this.options.restorePreviousRouteTreeOnError;
        if (i === null || i.erredWithUnknownRoute || i.error != null && u) {
            c = new Promise((function(t, e) {
                o = t;
                a = e;
            }));
        } else {
            c = i.promise;
            o = i.resolve;
            a = i.reject;
        }
        const h = this.Se = Transition.J({
            id: ++this.be,
            trigger: e,
            managedState: s,
            prevInstructions: n.finalInstructions,
            finalInstructions: t,
            instructionsChanged: !n.finalInstructions.equals(t),
            instructions: t,
            options: t.options,
            promise: c,
            resolve: o,
            reject: a,
            previousRouteTree: this.routeTree,
            routeTree: this.ve = this.routeTree.Z(),
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
                    const t = this.Se;
                    if (t !== null) {
                        t.previousRouteTree = h.previousRouteTree;
                    } else {
                        this.ve = h.previousRouteTree;
                    }
                }
            }
            throw t;
        }));
    }
    Qt(t) {
        this.currentTr = t;
        this.Se = null;
        this.ye = true;
        let s = this.Te(t.options.context);
        this.I.publish(new NavigationStartEvent(t.id, t.instructions, t.trigger, t.managedState));
        if (this.Se !== null) {
            return this.Qt(this.Se);
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
                r.root.ce(r);
                n.node = r.root;
            }
            const a = s.allResolved instanceof Promise ? " - awaiting promise" : "";
            o.trace(`updateRouteTree(rootCtx:%s,rt:%s,vit:%s)${a}`, n, r, i);
            return e.onResolve(s.allResolved, (() => updateNode(o, i, s, n.node)));
        }), (() => {
            const e = t.previousRouteTree.root.children;
            const s = t.routeTree.root.children;
            const i = mergeDistinct(e, s);
            Batch.C((s => {
                for (const i of e) {
                    i.context.vpa.Ht(t, s);
                }
            })).T((e => {
                if (t.guardsResult !== true) {
                    e.N();
                    this.Pe(t);
                }
            })).T((e => {
                for (const i of s) {
                    i.context.vpa.Dt(t, e);
                }
            })).T((e => {
                if (t.guardsResult !== true) {
                    e.N();
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
                this.xe = t.finalInstructions = t.routeTree.le();
                this.ye = false;
                const e = t.finalInstructions.toUrl(true, this.options.Ve);
                switch (t.options.Ae(this.xe)) {
                  case "none":
                    break;

                  case "push":
                    this.$e.pushState(toManagedState(t.options.state, t.id), this.updateTitle(t), e);
                    break;

                  case "replace":
                    this.$e.replaceState(toManagedState(t.options.state, t.id), this.updateTitle(t), e);
                    break;
                }
                this.I.publish(new NavigationEndEvent(t.id, t.instructions, this.xe));
                t.resolve(true);
                this.Oe();
            })).C();
        }));
    }
    updateTitle(t = this.currentTr) {
        let e;
        if (this.Ne) {
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
            this.ke.document.title = e;
        }
        return this.ke.document.title;
    }
    Pe(t) {
        const s = t.previousRouteTree.root.children;
        const i = t.routeTree.root.children;
        const n = mergeDistinct(s, i);
        n.forEach((function(t) {
            t.context.vpa.te();
        }));
        this.xe = t.prevInstructions;
        this.ve = t.previousRouteTree;
        this.ye = false;
        const r = t.guardsResult;
        this.I.publish(new NavigationCancelEvent(t.id, t.instructions, `guardsResult is ${r}`));
        if (r === false) {
            t.resolve(false);
            this.Oe();
        } else {
            let s;
            if (this.Re && (t.erredWithUnknownRoute || t.error != null && this.options.restorePreviousRouteTreeOnError)) s = t.prevInstructions; else if (r === true) return; else s = r;
            void e.onResolve(this.Ie(s, "api", t.managedState, t), (() => {}));
        }
    }
    Oe() {
        if (this.Se === null) return;
        this.ke.taskQueue.queueTask((() => {
            const t = this.Se;
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
        return new ParsedUrl(t, i ?? m, e);
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
    e ??= m;
    let n = e.toString();
    n = n === "" ? "" : `?${n}`;
    const r = s != null && s.length > 0 ? `#${encodeURIComponent(s)}` : "";
    return `${i}${n}${r}`;
}

const E = Object.freeze({
    parse(t) {
        return ParsedUrl.J(t);
    },
    stringify(t, e, s) {
        return stringify(t, e, s);
    }
});

const x = Object.freeze({
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

const y = /*@__PURE__*/ e.DI.createInterface("RouterOptions");

class RouterOptions {
    constructor(t, e, s, i, n, r, o) {
        this.useUrlFragmentHash = t;
        this.useHref = e;
        this.historyStrategy = s;
        this.buildTitle = i;
        this.useNavigationModel = n;
        this.activeClass = r;
        this.restorePreviousRouteTreeOnError = o;
        this.Ve = t ? x : E;
    }
    static create(t) {
        return new RouterOptions(t.useUrlFragmentHash ?? false, t.useHref ?? true, t.historyStrategy ?? "push", t.buildTitle ?? null, t.useNavigationModel ?? true, t.activeClass ?? null, t.restorePreviousRouteTreeOnError ?? true);
    }
    toString() {
        return "RO";
    }
}

class NavigationOptions {
    constructor(t, e, s, i, n, r, o, a) {
        this.historyStrategy = t;
        this.title = e;
        this.titleSeparator = s;
        this.context = i;
        this.queryParams = n;
        this.fragment = r;
        this.state = o;
        this.transitionPlan = a;
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
    Ae(t) {
        return valueOrFuncToValue(t, this.historyStrategy);
    }
}

const R = "default";

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
        const i = e.length === 0 || s === null || s.length === 0 || s === R ? "" : `@${s}`;
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
            const a = new URLSearchParams(i.queryParams ?? e.emptyObject);
            for (let e = 0; e < s; e++) {
                const s = t[e];
                const i = o ? r.pe(s) : null;
                if (i !== null) {
                    n[e] = i.vi;
                    mergeURLSearchParams(a, i.query, false);
                } else {
                    n[e] = ViewportInstruction.create(s);
                }
            }
            return new ViewportInstructionTree(i, false, n, a, i.fragment);
        }
        if (typeof t === "string") {
            const e = RouteExpression.parse(s.Ve.parse(t));
            return e.toInstructionTree(i);
        }
        const a = o ? r.pe(isPartialViewportInstruction(t) ? {
            ...t,
            params: t.params ?? e.emptyObject
        } : {
            component: t,
            params: e.emptyObject
        }) : null;
        const c = new URLSearchParams(i.queryParams ?? e.emptyObject);
        return a !== null ? new ViewportInstructionTree(i, false, [ a.vi ], mergeURLSearchParams(c, a.query, false), i.fragment) : new ViewportInstructionTree(i, false, [ ViewportInstruction.create(t) ], c, i.fragment);
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
                const i = s.St === 4096 ? s.Tt : s.It;
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
        this.Le = r;
        this.L = n.container.get(e.ILogger).scopeTo(`ComponentAgent<${n.At}>`);
        const o = s.lifecycleHooks;
        this.Ue = (o.canLoad ?? []).map((t => t.instance));
        this.ze = (o.loading ?? []).map((t => t.instance));
        this.Be = (o.canUnload ?? []).map((t => t.instance));
        this.He = (o.unloading ?? []).map((t => t.instance));
        this.qe = "canLoad" in t;
        this.De = "loading" in t;
        this.Fe = "canUnload" in t;
        this.Ge = "unloading" in t;
    }
    Mt(t, e) {
        if (t === null) {
            return this.je.activate(this.je, e);
        }
        void this.je.activate(t, e);
    }
    Ut(t, e) {
        if (t === null) {
            return this.je.deactivate(this.je, e);
        }
        void this.je.deactivate(t, e);
    }
    Jt() {
        this.je.dispose();
    }
    Ht(t, e, s) {
        s.N();
        let i = Promise.resolve();
        for (const n of this.Be) {
            s.N();
            i = i.then((() => new Promise((i => {
                if (t.guardsResult !== true) {
                    s.$();
                    i();
                    return;
                }
                t.Qt((() => n.canUnload(this.Me, e, this.Zt)), (e => {
                    if (t.guardsResult === true && e !== true) {
                        t.guardsResult = false;
                    }
                    s.$();
                    i();
                }));
            }))));
        }
        if (this.Fe) {
            s.N();
            i = i.then((() => {
                if (t.guardsResult !== true) {
                    s.$();
                    return;
                }
                t.Qt((() => this.Me.canUnload(e, this.Zt)), (e => {
                    if (t.guardsResult === true && e !== true) {
                        t.guardsResult = false;
                    }
                    s.$();
                }));
            }));
        }
        s.$();
    }
    Dt(t, e, s) {
        const i = this.we.root;
        s.N();
        let n = Promise.resolve();
        for (const r of this.Ue) {
            s.N();
            n = n.then((() => new Promise((n => {
                if (t.guardsResult !== true) {
                    s.$();
                    n();
                    return;
                }
                t.Qt((() => r.canLoad(this.Me, e.params, e, this.Zt)), (e => {
                    if (t.guardsResult === true && e !== true) {
                        t.guardsResult = e === false ? false : ViewportInstructionTree.create(e, this.Le, void 0, i);
                    }
                    s.$();
                    n();
                }));
            }))));
        }
        if (this.qe) {
            s.N();
            n = n.then((() => {
                if (t.guardsResult !== true) {
                    s.$();
                    return;
                }
                t.Qt((() => this.Me.canLoad(e.params, e, this.Zt)), (e => {
                    if (t.guardsResult === true && e !== true) {
                        t.guardsResult = e === false ? false : ViewportInstructionTree.create(e, this.Le, void 0, i);
                    }
                    s.$();
                }));
            }));
        }
        s.$();
    }
    Gt(t, e, s) {
        s.N();
        for (const i of this.He) {
            t.Qt((() => {
                s.N();
                return i.unloading(this.Me, e, this.Zt);
            }), (() => {
                s.$();
            }));
        }
        if (this.Ge) {
            t.Qt((() => {
                s.N();
                return this.Me.unloading(e, this.Zt);
            }), (() => {
                s.$();
            }));
        }
        s.$();
    }
    Wt(t, e, s) {
        s.N();
        for (const i of this.ze) {
            t.Qt((() => {
                s.N();
                return i.loading(this.Me, e.params, e, this.Zt);
            }), (() => {
                s.$();
            }));
        }
        if (this.De) {
            t.Qt((() => {
                s.N();
                return this.Me.loading(e.params, e, this.Zt);
            }), (() => {
                s.$();
            }));
        }
        s.$();
    }
}

const b = /*@__PURE__*/ e.DI.createInterface("IRouteContext");

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
    constructor(t, n, r, o, c, u) {
        this.parent = n;
        this.component = r;
        this.config = o;
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
            this.At = r.name;
        } else {
            this.root = n.root;
            this.path = [ ...n.path, this ];
            this.At = `${n.At}/${r.name}`;
        }
        this.L = c.get(e.ILogger).scopeTo(`RouteContext<${this.At}>`);
        this.es = c.get(e.IModuleLoader);
        const h = this.container = c.createChild();
        h.registerResolver(s.IController, this.ss = new e.InstanceProvider, true);
        const l = new e.InstanceProvider("IRouteContext", this);
        h.registerResolver(b, l);
        h.registerResolver(RouteContext, l);
        this.ns = new i.RouteRecognizer;
        if (u.options.useNavigationModel) {
            const t = this.Xe = new NavigationModel([]);
            h.get(a).subscribe("au:router:navigation-end", (() => t.rs(u, this)));
        } else {
            this.Xe = null;
        }
        this.os(o);
    }
    os(t) {
        const s = [];
        const i = t.routes ?? h;
        const n = i.length;
        if (n === 0) {
            const e = t.component.prototype?.getRouteConfig;
            this.ts = e == null ? true : typeof e !== "function";
            return;
        }
        const r = this.Xe;
        const o = r !== null;
        let a = 0;
        for (;a < n; a++) {
            const n = i[a];
            if (n instanceof Promise) {
                s.push(this.cs(n));
                continue;
            }
            const c = resolveRouteConfiguration(n, true, t, null, this);
            if (c instanceof Promise) {
                if (!isPartialChildRouteConfig(n) || n.path == null) throw new Error(getMessage(3173));
                for (const t of ensureArrayOfStrings(n.path)) {
                    this.us(t, n.caseSensitive ?? false, c);
                }
                const t = this.childRoutes.length;
                const i = c.then((e => this.childRoutes[t] = e));
                this.childRoutes.push(i);
                if (o) {
                    r.cs(i);
                }
                s.push(i.then(e.noop));
                continue;
            }
            for (const t of c.path ?? e.emptyArray) {
                this.us(t, c.caseSensitive, c);
            }
            this.childRoutes.push(c);
            if (o) {
                r.cs(c);
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
        if (t.has(b, true)) {
            logAndThrow(new Error(getMessage(3168)), i);
        }
        const {controller: n} = t.get(s.IAppRoot);
        if (n === void 0) {
            logAndThrow(new Error(getMessage(3169)), i);
        }
        const r = t.get(v);
        return e.onResolve(r.getRouteContext(null, n.definition, n.viewModel, n.container, null, null, null), (s => {
            t.register(e.Registration.instance(b, s));
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
                return t.container.get(b);
            } catch (t) {
                error(r, 3155, i.nodeName, t);
                throw t;
            }
        }
        if (s.isCustomElementViewModel(i)) {
            const t = i.$controller;
            return t.container.get(b);
        }
        if (s.isCustomElementController(i)) {
            const t = i;
            return t.container.get(b);
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
        const r = n.invoke(i.component.Type);
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
        return this.es.load(t, (e => {
            const i = e.raw;
            if (typeof i === "function") {
                const t = s.CustomElement.isType(i) ? s.CustomElement.getDefinition(i) : null;
                if (t != null) return t;
            }
            let n = void 0;
            let r = void 0;
            for (const t of e.items) {
                const e = s.CustomElement.isType(t.value) ? t.definition : null;
                if (e != null) {
                    if (t.key === "default") {
                        n = e;
                    } else if (r === void 0) {
                        r = e;
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
        const a = s.length;
        const c = [];
        let u = null;
        if (a === 1) {
            const e = core(s[0]);
            if (e === null) {
                if (n) throw new Error(getMessage(3166, t, c));
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
        for (let t = 0; t < a; t++) {
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
            if (n) throw new Error(getMessage(3166, t, c));
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
                c.push(`No endpoint found for the path: '${t}'.`);
                return null;
            }
            const s = Object.create(null);
            for (const i of e.params) {
                const e = i.name;
                let n = r[e];
                if (n == null || String(n).length === 0) {
                    if (!i.isOptional) {
                        c.push(`No value for the required parameter '${e}' is provided for the path: '${t}'.`);
                        return null;
                    }
                    n = "";
                } else {
                    if (!i.satisfiesPattern(n)) {
                        c.push(`The value '${n}' for the parameter '${e}' does not satisfy the pattern '${i.pattern}'.`);
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
        return `RC(path:'${this.At}',viewports:[${e}])`;
    }
    ls() {
        const t = [];
        for (let e = 0; e < this.path.length; ++e) {
            t.push(`${" ".repeat(e)}${this.path[e]}`);
        }
        return t.join("\n");
    }
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
        return this.Nt;
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
                }) ], m, null);
            }));
        }
        this.Nt = n.some((e => t.routeTree.contains(e, true)));
    }
}

class ViewportCustomElement {
    constructor() {
        this.name = R;
        this.usedBy = "";
        this.default = "";
        this.fallback = "";
        this.Es = void 0;
        this.je = void 0;
        this.we = e.resolve(b);
        this.L = e.resolve(e.ILogger).scopeTo(`au-viewport<${this.we.At}>`);
    }
    tt(t, e, i) {
        const n = this.fallback;
        return typeof n === "function" && !s.CustomElement.isType(n) ? n(t, e, i) : n;
    }
    hydrated(t) {
        this.je = t;
        this.Es = this.we.ps(this);
    }
    attaching(t, e) {
        return this.Es.Ot(t, this.je);
    }
    detaching(t, e) {
        return this.Es.Lt(t, this.je);
    }
    dispose() {
        this.we.gs(this);
        this.Es.Jt();
        this.Es = void 0;
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

              default:
                {
                    t.push(`${e}:${String(s)}`);
                }
            }
        }
        return `VP(ctx:'${this.we.At}',${t.join(",")})`;
    }
}

s.CustomElement.define({
    name: "au-viewport",
    bindables: [ "name", "usedBy", "default", "fallback" ]
}, ViewportCustomElement);

const C = [ "name", "usedBy", "default", "fallback" ];

class LoadCustomAttribute {
    constructor() {
        this.xs = e.resolve(s.INode);
        this.Ye = e.resolve(v);
        this.we = e.resolve(b);
        this.I = e.resolve(a);
        this.$e = e.resolve(u);
        this.attribute = "href";
        this.active = false;
        this.ys = null;
        this.xe = null;
        this.Rs = null;
        this.onClick = t => {
            if (this.xe === null) {
                return;
            }
            if (t.altKey || t.ctrlKey || t.shiftKey || t.metaKey || t.button !== 0) {
                return;
            }
            t.preventDefault();
            void this.Ye.load(this.xe, {
                context: this.context
            });
        };
        const t = this.xs;
        this.bs = !t.hasAttribute("external") && !t.hasAttribute("data-external");
        this.Ss = this.Ye.options.activeClass;
    }
    binding() {
        if (this.bs) {
            this.xs.addEventListener("click", this.onClick);
        }
        this.valueChanged();
        this.Rs = this.I.subscribe("au:router:navigation-end", (t => {
            const e = this.active = this.xe !== null && this.Ye.isActive(this.xe, this.context);
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
        if (this.bs) {
            this.xs.removeEventListener("click", this.onClick);
        }
        this.Rs.dispose();
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
            const r = this.xe = t.createViewportInstructions(typeof s === "object" && s !== null ? {
                component: i,
                params: s
            } : i, {
                context: n
            });
            this.ys = r.toUrl(false, e.Ve);
        } else {
            this.xe = null;
            this.ys = null;
        }
        const r = s.CustomElement.for(this.xs, {
            optional: true
        });
        if (r !== null) {
            r.viewModel[this.attribute] = this.xe;
        } else {
            if (this.ys === null) {
                this.xs.removeAttribute(this.attribute);
            } else {
                const t = e.useUrlFragmentHash ? this.ys : this.$e.addBaseHref(this.ys);
                this.xs.setAttribute(this.attribute, t);
            }
        }
    }
}

s.CustomAttribute.define({
    name: "load",
    bindables: {
        route: {
            mode: n,
            primary: true,
            callback: "valueChanged"
        },
        params: {
            mode: n,
            callback: "valueChanged"
        },
        attribute: {
            mode: n
        },
        active: {
            mode: r
        },
        context: {
            mode: n,
            callback: "valueChanged"
        }
    }
}, LoadCustomAttribute);

class HrefCustomAttribute {
    get Cs() {
        return this.xs.hasAttribute("external") || this.xs.hasAttribute("data-external");
    }
    constructor() {
        this.xs = e.resolve(s.INode);
        this.Ye = e.resolve(v);
        this.we = e.resolve(b);
        this.Ns = false;
        if (this.Ye.options.useHref && this.xs.nodeName === "A") {
            const t = e.resolve(s.IWindow).name;
            switch (this.xs.getAttribute("target")) {
              case null:
              case t:
              case "_self":
                this.bs = true;
                break;

              default:
                this.bs = false;
                break;
            }
        } else {
            this.bs = false;
        }
    }
    binding() {
        if (!this.Ns) {
            this.Ns = true;
            this.bs = this.bs && s.getRef(this.xs, s.CustomAttribute.getDefinition(LoadCustomAttribute).key) === null;
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
        this.ks(t);
    }
    ks(t) {
        if (t.altKey || t.ctrlKey || t.shiftKey || t.metaKey || t.button !== 0 || this.Cs || !this.bs) {
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
}

HrefCustomAttribute.$au = {
    type: "custom-attribute",
    name: "href",
    noMultiBindings: true,
    bindables: {
        value: {
            mode: n
        }
    }
};

const N = v;

const k = [ N ];

const $ = ViewportCustomElement;

const _ = LoadCustomAttribute;

const T = HrefCustomAttribute;

const I = [ ViewportCustomElement, LoadCustomAttribute, HrefCustomAttribute ];

function configure(i, n) {
    let r = null;
    if (t.isObject(n)) {
        r = n.basePath ?? null;
    } else {
        n = {};
    }
    const o = RouterOptions.create(n);
    return i.register(e.Registration.cachedCallback(c, ((t, e, i) => {
        const n = t.get(s.IWindow);
        const o = new URL(n.document.baseURI);
        o.pathname = normalizePath(r ?? o.pathname);
        return o;
    })), e.Registration.instance(y, o), e.Registration.instance(RouterOptions, o), s.AppTask.creating(v, (t => {})), s.AppTask.hydrated(e.IContainer, RouteContext.setRoot), s.AppTask.activated(v, (t => t.start(true))), s.AppTask.deactivated(v, (t => {
        t.stop();
    })), ...k, ...I);
}

const P = {
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
        this.$s = t.scrollTop;
        this._s = t.scrollLeft;
    }
    static Ts(t) {
        return t.scrollTop > 0 || t.scrollLeft > 0;
    }
    Is() {
        this.xs.scrollTo(this._s, this.$s);
        this.xs = null;
    }
}

function restoreState(t) {
    t.Is();
}

class HostElementState {
    constructor(t) {
        this.Ps = [];
        this.Vs(t.children);
    }
    Vs(t) {
        let e;
        for (let s = 0, i = t.length; s < i; ++s) {
            e = t[s];
            if (ScrollState.Ts(e)) {
                this.Ps.push(new ScrollState(e));
            }
            this.Vs(e.children);
        }
    }
    Is() {
        this.Ps.forEach(restoreState);
        this.Ps = null;
    }
}

const V = /*@__PURE__*/ e.DI.createInterface("IStateManager", (t => t.singleton(ScrollStateManager)));

class ScrollStateManager {
    constructor() {
        this.As = new WeakMap;
    }
    saveState(t) {
        this.As.set(t.host, new HostElementState(t.host));
    }
    restoreState(t) {
        const e = this.As.get(t.host);
        if (e !== void 0) {
            e.Is();
            this.As.delete(t.host);
        }
    }
}

exports.AST = g;

exports.AuNavId = o;

exports.ComponentExpression = ComponentExpression;

exports.CompositeSegmentExpression = CompositeSegmentExpression;

exports.DefaultComponents = k;

exports.DefaultResources = I;

exports.HrefCustomAttribute = HrefCustomAttribute;

exports.HrefCustomAttributeRegistration = T;

exports.ILocationManager = u;

exports.IRouteContext = b;

exports.IRouter = v;

exports.IRouterEvents = a;

exports.IRouterOptions = y;

exports.IStateManager = V;

exports.LoadCustomAttribute = LoadCustomAttribute;

exports.LoadCustomAttributeRegistration = _;

exports.LocationChangeEvent = LocationChangeEvent;

exports.NavigationCancelEvent = NavigationCancelEvent;

exports.NavigationEndEvent = NavigationEndEvent;

exports.NavigationErrorEvent = NavigationErrorEvent;

exports.NavigationOptions = NavigationOptions;

exports.NavigationStartEvent = NavigationStartEvent;

exports.ParameterExpression = ParameterExpression;

exports.ParameterListExpression = ParameterListExpression;

exports.Route = l;

exports.RouteConfig = RouteConfig;

exports.RouteContext = RouteContext;

exports.RouteExpression = RouteExpression;

exports.RouteNode = RouteNode;

exports.RouteTree = RouteTree;

exports.Router = Router;

exports.RouterConfiguration = P;

exports.RouterOptions = RouterOptions;

exports.RouterRegistration = N;

exports.ScopedSegmentExpression = ScopedSegmentExpression;

exports.SegmentExpression = SegmentExpression;

exports.SegmentGroupExpression = SegmentGroupExpression;

exports.Transition = Transition;

exports.ViewportAgent = ViewportAgent;

exports.ViewportCustomElement = ViewportCustomElement;

exports.ViewportCustomElementRegistration = $;

exports.ViewportExpression = ViewportExpression;

exports.fragmentUrlParser = x;

exports.isManagedState = isManagedState;

exports.pathUrlParser = E;

exports.route = route;

exports.toManagedState = toManagedState;
//# sourceMappingURL=index.cjs.map
