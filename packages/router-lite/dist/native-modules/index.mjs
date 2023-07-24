import { Metadata as t, isObject as e } from "../metadata/dist/native-modules/index.mjs";

import { DI as s, resolve as i, IEventAggregator as n, ILogger as r, Protocol as o, emptyArray as c, onResolve as a, onResolveAll as u, emptyObject as h, IContainer as l, Registration as f, isArrayIndex as p, IModuleLoader as d, InstanceProvider as g, noop as w } from "../kernel/dist/native-modules/index.mjs";

import { isCustomElementViewModel as v, IHistory as m, ILocation as E, IWindow as R, CustomElement as y, Controller as b, IPlatform as C, CustomElementDefinition as S, IController as x, IAppRoot as _, isCustomElementController as N, customElement as k, bindable as $, customAttribute as T, INode as I, getRef as P, CustomAttribute as V, AppTask as O } from "../runtime-html/dist/native-modules/index.mjs";

import { RecognizedRoute as A, Endpoint as M, ConfigurableRoute as j, RESIDUE as U, RouteRecognizer as L } from "../route-recognizer/dist/native-modules/index.mjs";

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

const B = "au-nav-id";

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

const z = /*@__PURE__*/ s.createInterface("IRouterEvents", (t => t.singleton(RouterEvents)));

class RouterEvents {
    constructor() {
        this.M = 0;
        this.A = [];
        this.j = i(n);
        this.U = i(r).scopeTo("RouterEvents");
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

const D = /*@__PURE__*/ s.createInterface("IBaseHref");

const H = /*@__PURE__*/ s.createInterface("ILocationManager", (t => t.singleton(BrowserLocationManager)));

class BrowserLocationManager {
    constructor() {
        this.L = 0;
        this.U = i(r).root.scopeTo("LocationManager");
        this.I = i(z);
        this.B = i(m);
        this.l = i(E);
        this.H = i(R);
        this.q = i(D);
        this.F = i(st).useUrlFragmentHash ? "hashchange" : "popstate";
    }
    startListening() {
        this.H.addEventListener(this.F, this, false);
    }
    stopListening() {
        this.H.removeEventListener(this.F, this, false);
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

const q = c;

function defaultReentryBehavior(t, e) {
    if (!shallowEquals(t.params, e.params)) {
        return "replace";
    }
    return "none";
}

class RouteConfig {
    get path() {
        const t = this.G;
        if (t.length > 0) return t;
        const e = y.getDefinition(this.component);
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
    static J(t, e) {
        if (typeof t === "string" || t instanceof Array) {
            const s = ensureArrayOfStrings(t);
            const i = e?.redirectTo ?? null;
            const n = e?.caseSensitive ?? false;
            const r = ensureString(e?.id ?? (s instanceof Array ? s[0] : s));
            const o = e?.title ?? null;
            const c = e?.transitionPlan ?? null;
            const a = e?.viewport ?? it;
            const u = e?.data ?? {};
            const h = e?.routes ?? q;
            return new RouteConfig(r, s, o, i, n, c, a, u, h, e?.fallback ?? null, e, e?.nav ?? true);
        } else if (typeof t === "object") {
            const s = t;
            validateRouteConfig(s, "");
            const i = ensureArrayOfStrings(s.path ?? e?.path ?? c);
            const n = s.title ?? e?.title ?? null;
            const r = s.redirectTo ?? e?.redirectTo ?? null;
            const o = s.caseSensitive ?? e?.caseSensitive ?? false;
            const a = s.id ?? e?.id ?? (i instanceof Array ? i[0] : i);
            const u = s.transitionPlan ?? e?.transitionPlan ?? null;
            const h = s.viewport ?? e?.viewport ?? it;
            const l = {
                ...e?.data,
                ...s.data
            };
            const f = [ ...s.routes ?? q, ...e?.routes ?? q ];
            return new RouteConfig(a, i, n, r, o, u, h, l, f, s.fallback ?? e?.fallback ?? null, s.component ?? e ?? null, s.nav ?? true);
        } else {
            expectType("string, function/class or object", "", t);
        }
    }
    K(t, e) {
        validateRouteConfig(t, this.path[0] ?? "");
        const s = ensureArrayOfStrings(t.path ?? this.path);
        return new RouteConfig(ensureString(t.id ?? this.id ?? s), s, t.title ?? this.title, t.redirectTo ?? this.redirectTo, t.caseSensitive ?? this.caseSensitive, t.transitionPlan ?? this.transitionPlan ?? e?.transitionPlan ?? null, t.viewport ?? this.viewport, t.data ?? this.data, t.routes ?? this.routes, t.fallback ?? this.fallback ?? e?.fallback ?? null, this.component, t.nav ?? this.nav);
    }
    X(t, e) {
        const s = this.transitionPlan ?? defaultReentryBehavior;
        return typeof s === "function" ? s(t, e) : s;
    }
    Y(t, e, s) {
        if (this.W) throw new Error(getMessage(3550));
        if (typeof t.getRouteConfig !== "function") return;
        return a(t.getRouteConfig(e, s), (t => {
            this.W = true;
            if (t == null) return;
            let s = e?.path ?? "";
            if (typeof s !== "string") {
                s = s[0];
            }
            validateRouteConfig(t, s);
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
    tt(t, e, s) {
        const i = this.fallback;
        return typeof i === "function" && !y.isType(i) ? i(t, e, s) : i;
    }
    register(t) {
        const e = this.component;
        if (e == null) return;
        t.register(e);
    }
}

const F = {
    name: o.resource.keyFor("route-configuration"),
    isConfigured(e) {
        return t.hasOwn(F.name, e);
    },
    configure(e, s) {
        const i = RouteConfig.J(e, s);
        t.define(F.name, i, s);
        return s;
    },
    getConfig(e) {
        if (!F.isConfigured(e)) {
            F.configure({}, e);
        }
        return t.getOwn(F.name, e);
    }
};

function route(t) {
    return function(e) {
        return F.configure(t, e);
    };
}

function resolveRouteConfiguration(t, e, s, i, n) {
    if (isPartialRedirectRouteConfig(t)) return RouteConfig.J(t, null);
    const [r, o] = resolveCustomElementDefinition(t, n);
    return a(o, (n => {
        const o = n.Type;
        const c = F.getConfig(o);
        if (isPartialChildRouteConfig(t)) return c.K(t, s);
        if (e) return c.Z();
        if (!c.W && r.type === 4 && typeof t.getRouteConfig === "function") {
            return a(c.Y(t, s, i), (() => c));
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
        i = e.et(s.value);
        break;
    }
    return [ s, i ];
}

function createNavigationInstruction(t) {
    return isPartialChildRouteConfig(t) ? createNavigationInstruction(t.component) : TypedNavigationInstruction.create(t);
}

const G = [ "?", "#", "/", "+", "(", ")", ".", "@", "!", "=", ",", "&", "'", "~", ";" ];

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
    dt() {
        if (!this.u) {
            throw new Error(getMessage(3501, this.st, this.ot, this.it));
        }
    }
    gt() {
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

var W;

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
})(W || (W = {}));

const Q = new Map;

class RouteExpression {
    get kind() {
        return 0;
    }
    constructor(t, e, s, i) {
        this.isAbsolute = t;
        this.root = e;
        this.queryParams = s;
        this.fragment = i;
    }
    static parse(t) {
        const e = t.toString();
        let s = Q.get(e);
        if (s === void 0) {
            Q.set(e, s = RouteExpression.Rt(t));
        }
        return s;
    }
    static Rt(t) {
        const e = t.path;
        if (e === "") {
            return new RouteExpression(false, SegmentExpression.Empty, t.query, t.fragment);
        }
        const s = new ParserState(e);
        s.wt();
        const i = s.ut("/");
        const n = CompositeSegmentExpression.yt(s);
        s.dt();
        s.Et();
        return new RouteExpression(i, n, t.query, t.fragment);
    }
    toInstructionTree(t) {
        return new ViewportInstructionTree(t, this.isAbsolute, this.root.bt(0, 0), mergeURLSearchParams(this.queryParams, t.queryParams, true), this.fragment ?? t.fragment);
    }
}

class CompositeSegmentExpression {
    get kind() {
        return 1;
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
    bt(t, e) {
        switch (this.siblings.length) {
          case 0:
            return [];

          case 1:
            return this.siblings[0].bt(t, e);

          case 2:
            return [ ...this.siblings[0].bt(t, 0), ...this.siblings[1].bt(0, e) ];

          default:
            return [ ...this.siblings[0].bt(t, 0), ...this.siblings.slice(1, -1).flatMap((function(t) {
                return t.bt(0, 0);
            })), ...this.siblings[this.siblings.length - 1].bt(0, e) ];
        }
    }
}

class ScopedSegmentExpression {
    get kind() {
        return 2;
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
    bt(t, e) {
        const s = this.left.bt(t, 0);
        const i = this.right.bt(0, e);
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
        return 3;
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
    bt(t, e) {
        return this.expression.bt(t + 1, e + 1);
    }
}

class SegmentExpression {
    get kind() {
        return 4;
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
    bt(t, e) {
        return [ ViewportInstruction.create({
            component: this.component.name,
            params: this.component.parameterList.Ct(),
            viewport: this.viewport.name,
            open: t,
            close: e
        }) ];
    }
}

class ComponentExpression {
    get kind() {
        return 5;
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
                t.gt();
            } else if (t.ct("../")) {
                t.gt();
                t.gt();
            } else {
                while (!t.u && !t.ct(...G)) {
                    t.gt();
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
        return 7;
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
            while (!t.u && !t.ct(...G)) {
                t.gt();
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
        return 8;
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
    Ct() {
        const t = {};
        for (const e of this.expressions) {
            t[e.key] = e.value;
        }
        return t;
    }
}

class ParameterExpression {
    get kind() {
        return 9;
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
        while (!t.u && !t.ct(...G)) {
            t.gt();
        }
        let s = t.vt();
        if (s.length === 0) {
            t.ft("parameter key");
        }
        let i;
        if (t.ut("=")) {
            t.wt();
            while (!t.u && !t.ct(...G)) {
                t.gt();
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

const J = Object.freeze({
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

const K = new WeakMap;

class ViewportAgent {
    get St() {
        return this._state & 16256;
    }
    set St(t) {
        this._state = this._state & 127 | t;
    }
    get xt() {
        return this._state & 127;
    }
    set xt(t) {
        this._state = this._state & 16256 | t;
    }
    constructor(t, e, s) {
        this.viewport = t;
        this.hostController = e;
        this._t = false;
        this.Nt = null;
        this.kt = null;
        this._state = 8256;
        this.$t = "replace";
        this.Tt = null;
        this.It = null;
        this.Pt = null;
        this.Vt = null;
        this.U = s.container.get(r).scopeTo(`ViewportAgent<${s.Ot}>`);
    }
    static for(t, e) {
        let s = K.get(t);
        if (s === void 0) {
            const i = b.getCachedOrThrow(t);
            K.set(t, s = new ViewportAgent(t, i, e));
        }
        return s;
    }
    At(t, e) {
        const s = this.Pt;
        if (s !== null) {
            ensureTransitionHasNotErrored(s);
        }
        this._t = true;
        switch (this.xt) {
          case 64:
            switch (this.St) {
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
        switch (this.St) {
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
    Bt(t) {
        if (!this.zt()) {
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
    zt() {
        if (!this._t) {
            return false;
        }
        if (this.xt !== 64) {
            return false;
        }
        return true;
    }
    Dt(t, e) {
        if (this.Pt === null) {
            this.Pt = t;
        }
        ensureTransitionHasNotErrored(t);
        if (t.guardsResult !== true) {
            return;
        }
        e._();
        void a(this.Vt, (() => {
            Batch.C((e => {
                for (const s of this.Tt.children) {
                    s.context.vpa.Dt(t, e);
                }
            })).T((e => {
                switch (this.St) {
                  case 4096:
                    switch (this.$t) {
                      case "none":
                        this.St = 1024;
                        return;

                      case "invoke-lifecycles":
                      case "replace":
                        this.St = 2048;
                        e._();
                        Batch.C((e => {
                            this.Nt.Dt(t, this.It, e);
                        })).T((() => {
                            this.St = 1024;
                            e.N();
                        })).C();
                        return;
                    }

                  case 8192:
                    return;

                  default:
                    t.Ht(new Error(`Unexpected state at canUnload of ${this}`));
                }
            })).T((() => {
                e.N();
            })).C();
        }));
    }
    qt(t, e) {
        if (this.Pt === null) {
            this.Pt = t;
        }
        ensureTransitionHasNotErrored(t);
        if (t.guardsResult !== true) {
            return;
        }
        e._();
        Batch.C((e => {
            switch (this.xt) {
              case 32:
                this.xt = 16;
                switch (this.$t) {
                  case "none":
                    return;

                  case "invoke-lifecycles":
                    return this.Nt.qt(t, this.It, e);

                  case "replace":
                    e._();
                    void a(this.It.context.Ft(this.hostController, this.It), (s => {
                        (this.kt = s).qt(t, this.It, e);
                        e.N();
                    }));
                }

              case 64:
                return;

              default:
                this.jt("canLoad");
            }
        })).T((t => {
            const e = this.It;
            switch (this.$t) {
              case "none":
              case "invoke-lifecycles":
                {
                    t._();
                    const s = e.context;
                    void a(s.allResolved, (() => a(a(u(...e.residue.splice(0).map((t => createAndAppendNodes(this.U, e, t)))), (() => u(...s.getAvailableViewportAgents().reduce(((t, s) => {
                        const i = s.viewport;
                        const n = i.default;
                        if (n === null) return t;
                        t.push(createAndAppendNodes(this.U, e, ViewportInstruction.create({
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
            switch (this.xt) {
              case 16:
                this.xt = 8;
                for (const s of this.It.children) {
                    s.context.vpa.qt(t, e);
                }
                return;

              case 64:
                return;

              default:
                this.jt("canLoad");
            }
        })).T((() => {
            e.N();
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
            switch (this.St) {
              case 1024:
                switch (this.$t) {
                  case "none":
                    this.St = 256;
                    return;

                  case "invoke-lifecycles":
                  case "replace":
                    this.St = 512;
                    s._();
                    Batch.C((e => {
                        this.Nt.Gt(t, this.It, e);
                    })).T((() => {
                        this.St = 256;
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
            switch (this.xt) {
              case 8:
                {
                    this.xt = 4;
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
            switch (this.xt) {
              case 4:
                this.xt = 2;
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
    Lt(t, e, s) {
        ensureTransitionHasNotErrored(e);
        ensureGuardsResultIsTrue(this, e);
        s._();
        switch (this.St) {
          case 256:
            this.St = 128;
            switch (this.$t) {
              case "none":
              case "invoke-lifecycles":
                s.N();
                return;

              case "replace":
                {
                    const i = this.hostController;
                    const n = this.Nt;
                    e.Qt((() => a(n.Lt(t, i), (() => {
                        if (t === null) {
                            n.Jt();
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
            this.jt("deactivate");
        }
    }
    Mt(t, e, s) {
        ensureTransitionHasNotErrored(e);
        ensureGuardsResultIsTrue(this, e);
        s._();
        if (this.xt === 32) {
            Batch.C((t => {
                this.qt(e, t);
            })).T((t => {
                this.Wt(e, t);
            })).T((s => {
                this.Mt(t, e, s);
            })).T((() => {
                s.N();
            })).C();
            return;
        }
        switch (this.xt) {
          case 2:
            this.xt = 1;
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
    Xt(t, e) {
        if (this.St === 8192) {
            this.Mt(null, t, e);
            return;
        }
        if (this.xt === 64) {
            this.Lt(null, t, e);
            return;
        }
        ensureTransitionHasNotErrored(t);
        ensureGuardsResultIsTrue(this, t);
        if (!(this.St === 256 && this.xt === 2)) {
            this.jt("swap");
        }
        this.St = 128;
        this.xt = 1;
        switch (this.$t) {
          case "none":
          case "invoke-lifecycles":
            {
                const s = mergeDistinct(this.It.children, this.Tt.children);
                for (const i of s) {
                    i.context.vpa.Xt(t, e);
                }
                return;
            }

          case "replace":
            {
                const s = this.hostController;
                const i = this.Nt;
                const n = this.kt;
                e._();
                Batch.C((e => {
                    t.Qt((() => {
                        e._();
                        return a(i.Lt(null, s), (() => i.Jt()));
                    }), (() => {
                        e.N();
                    }));
                })).T((e => {
                    t.Qt((() => {
                        e._();
                        return n.Mt(null, s);
                    }), (() => {
                        e.N();
                    }));
                })).T((e => {
                    this.Kt(t, e);
                })).T((() => {
                    e.N();
                })).C();
                return;
            }
        }
    }
    Kt(t, e) {
        const s = this.It;
        t.Qt((() => {
            e._();
            const t = s.context;
            return a(t.allResolved, (() => {
                const e = s.children.slice();
                return a(u(...s.residue.splice(0).map((t => createAndAppendNodes(this.U, s, t)))), (() => a(u(...t.getAvailableViewportAgents().reduce(((t, e) => {
                    const i = e.viewport;
                    const n = i.default;
                    if (n === null) return t;
                    t.push(createAndAppendNodes(this.U, s, ViewportInstruction.create({
                        component: n,
                        viewport: i.name
                    })));
                    return t;
                }), [])), (() => s.children.filter((t => !e.includes(t)))))));
            }));
        }), (s => {
            Batch.C((e => {
                for (const i of s) {
                    t.Qt((() => {
                        e._();
                        return i.context.vpa.qt(t, e);
                    }), (() => {
                        e.N();
                    }));
                }
            })).T((e => {
                for (const i of s) {
                    t.Qt((() => {
                        e._();
                        return i.context.vpa.Wt(t, e);
                    }), (() => {
                        e.N();
                    }));
                }
            })).T((e => {
                for (const i of s) {
                    t.Qt((() => {
                        e._();
                        return i.context.vpa.Mt(null, t, e);
                    }), (() => {
                        e.N();
                    }));
                }
            })).T((() => {
                e.N();
            })).C();
        }));
    }
    Yt(t, e) {
        switch (this.xt) {
          case 64:
            this.It = e;
            this.xt = 32;
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
        const s = this.Nt?.Zt ?? null;
        if (s === null || s.component !== e.component) {
            this.$t = "replace";
        } else {
            this.$t = t.transitionPlan ?? e.context.config.X(s, e);
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
        let e = null;
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
            t = a(this.Nt?.Lt(null, this.hostController), (() => {
                this.Nt?.Jt();
                this.St = 8192;
                this.Nt = null;
            }));
            break;
        }
        switch (this.xt) {
          case 64:
          case 32:
          case 16:
          case 8:
            this.It = null;
            this.xt = 64;
            break;

          case 4:
          case 2:
          case 1:
            {
                e = a(this.kt?.Lt(null, this.hostController), (() => {
                    this.kt?.Jt();
                    this.$t = "replace";
                    this.xt = 64;
                    this.kt = null;
                    this.It = null;
                }));
                break;
            }
        }
        if (t !== null && e !== null) {
            this.Vt = a(u(t, e), (() => {
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
            switch (this.xt) {
              case 64:
                switch (this.St) {
                  case 8192:
                  case 128:
                    this.St = 8192;
                    this.Nt = null;
                    break;

                  default:
                    this.jt("endTransition 1");
                }
                break;

              case 1:
                switch (this.St) {
                  case 8192:
                  case 128:
                    switch (this.$t) {
                      case "none":
                      case "invoke-lifecycles":
                        this.St = 4096;
                        break;

                      case "replace":
                        this.St = 4096;
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
            this.xt = 64;
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

const X = new Map;

function $state(t) {
    let e = X.get(t);
    if (e === void 0) {
        X.set(t, e = stringifyState(t));
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
    constructor(t, e, s, i, n, r, o, c, a, u, h, l, f, p) {
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
        this.children = f;
        this.residue = p;
        this.oe = 1;
        this.ie = false;
        this.ne ?? (this.ne = n);
    }
    static create(t) {
        const {[U]: e, ...s} = t.params ?? {};
        return new RouteNode(t.path, t.finalPath, t.context, t.originalInstruction ?? t.instruction, t.instruction, Object.freeze(s), t.queryParams ?? Y, t.fragment ?? null, Object.freeze(t.data ?? h), t.re ?? null, t.title ?? null, t.component, t.children ?? [], t.residue ?? []);
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
                    const l = h !== null ? !i && h.isInstructionsFinalized ? h.instruction : h.ne : null;
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
        const t = new RouteNode(this.path, this.finalPath, this.context, this.ne, this.instruction, this.params, this.queryParams, this.fragment, this.data, this.re, this.title, this.component, this.children.map((t => t.Z())), [ ...this.residue ]);
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
    contains(t, e) {
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

function createAndAppendNodes(t, e, s) {
    t.trace(`createAndAppendNodes(node:%s,vi:%s`, e, s);
    switch (s.component.type) {
      case 0:
        switch (s.component.value) {
          case "..":
            e = e.context.parent?.node ?? e;
            e.ue();

          case ".":
            return u(...s.children.map((s => createAndAppendNodes(t, e, s))));

          default:
            {
                t.trace(`createAndAppendNodes invoking createNode`);
                const i = e.context;
                const n = s.Z();
                let r = s.recognizedRoute;
                if (r !== null) return appendNode(t, e, createConfiguredNode(t, e, s, r, n));
                if (s.children.length === 0) {
                    const n = i.pe(s);
                    if (n !== null) {
                        e.se.fe(n.query);
                        const i = n.vi;
                        i.children.push(...s.children);
                        return appendNode(t, e, createConfiguredNode(t, e, i, i.recognizedRoute, s));
                    }
                }
                let o = 0;
                let c = s.component.value;
                let u = s;
                while (u.children.length === 1) {
                    u = u.children[0];
                    if (u.component.type === 0) {
                        ++o;
                        c = `${c}/${u.component.value}`;
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
                    const n = i.pe({
                        component: s.component.value,
                        params: s.params ?? h,
                        open: s.open,
                        close: s.close,
                        viewport: s.viewport,
                        children: s.children
                    });
                    if (n !== null) {
                        e.se.fe(n.query);
                        return appendNode(t, e, createConfiguredNode(t, e, n.vi, n.vi.recognizedRoute, s));
                    }
                    const r = s.component.value;
                    if (r === "") return;
                    let o = s.viewport;
                    if (o === null || o.length === 0) o = it;
                    const c = i.getFallbackViewportAgent(o);
                    const u = c !== null ? c.viewport.tt(s, e, i) : i.config.tt(s, e, i);
                    if (u === null) throw new UnknownRouteError(getMessage(3401, r, i.Ot, o, r, i.component.name));
                    if (typeof u === "string") {
                        t.trace(`Fallback is set to '${u}'. Looking for a recognized route.`);
                        const n = i.childRoutes.find((t => t.id === u));
                        if (n !== void 0) return appendNode(t, e, createFallbackNode(t, n, e, s));
                        t.trace(`No route configuration for the fallback '${u}' is found; trying to recognize the route.`);
                        const r = i.recognize(u, true);
                        if (r !== null && r.residue !== u) return appendNode(t, e, createConfiguredNode(t, e, s, r, null));
                    }
                    t.trace(`The fallback '${u}' is not recognized as a route; treating as custom element name.`);
                    return a(resolveRouteConfiguration(u, false, i.config, null, i), (i => appendNode(t, e, createFallbackNode(t, i, e, s))));
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
                const {vi: r, query: o} = i.pe({
                    component: n,
                    params: s.params ?? h,
                    open: s.open,
                    close: s.close,
                    viewport: s.viewport,
                    children: s.children
                });
                e.se.fe(o);
                return appendNode(t, e, createConfiguredNode(t, e, r, r.recognizedRoute, s));
            }));
        }
    }
}

function createConfiguredNode(t, e, s, i, n, r = i.route.endpoint.route) {
    const o = e.context;
    const c = e.se;
    return a(r.handler, (u => {
        r.handler = u;
        t.trace(`creatingConfiguredNode(rdc:%s, vi:%s)`, u, s);
        if (u.redirectTo === null) {
            const h = (s.viewport?.length ?? 0) > 0;
            const l = h ? s.viewport : u.viewport;
            return a(resolveCustomElementDefinition(u.component, o)[1], (f => {
                const p = o.de(new ViewportRequest(l, f.name));
                if (!h) {
                    s.viewport = p.viewport.name;
                }
                const d = o.container.get(Z);
                return a(d.getRouteContext(p, f, null, p.hostController.container, o.config, o, u), (o => {
                    t.trace("createConfiguredNode setting the context node");
                    const a = o.node = RouteNode.create({
                        path: i.route.endpoint.route.path,
                        finalPath: r.path,
                        context: o,
                        instruction: s,
                        originalInstruction: n,
                        params: i.route.params,
                        queryParams: c.queryParams,
                        fragment: c.fragment,
                        data: u.data,
                        re: l,
                        component: f,
                        title: u.title,
                        residue: s.children.slice()
                    });
                    a.ae(e.se);
                    t.trace(`createConfiguredNode(vi:%s) -> %s`, s, a);
                    return a;
                }));
            }));
        }
        const h = RouteExpression.parse(tt.parse(r.path));
        const l = RouteExpression.parse(tt.parse(u.redirectTo));
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
                    d.push(w.component.name);
                }
            }
        }
        const E = d.filter(Boolean).join("/");
        const R = o.recognize(E);
        if (R === null) throw new UnknownRouteError(getMessage(3402, E, o.Ot, E, o.component.name));
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
        e.ce(s);
        return s.context.vpa.Yt(e.se.options, s);
    }));
}

function createFallbackNode(t, e, s, i) {
    const n = new $RecognizedRoute(new A(new M(new j(e.path[0], e.caseSensitive, e), []), h), null);
    i.children.length = 0;
    return createConfiguredNode(t, s, i, n, null);
}

const Y = Object.freeze(new URLSearchParams);

function isManagedState(t) {
    return e(t) && Object.prototype.hasOwnProperty.call(t, B) === true;
}

function toManagedState(t, e) {
    return {
        ...t,
        [B]: e
    };
}

class UnknownRouteError extends Error {}

class Transition {
    get erredWithUnknownRoute() {
        return this.ge;
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
        this.ge = false;
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
                    this.Ht(t);
                }));
            } else {
                e(s);
            }
        } catch (t) {
            this.Ht(t);
        }
    }
    Ht(t) {
        this.ge = t instanceof UnknownRouteError;
        this.reject(this.error = t);
    }
    toString() {
        return `T(id:${this.id},trigger:'${this.trigger}',instructions:${this.instructions})`;
    }
}

const Z = /*@__PURE__*/ s.createInterface("IRouter", (t => t.singleton(Router)));

class Router {
    get we() {
        const t = this.ve;
        if (t !== null) return t;
        if (!this.c.has(nt, true)) throw new Error(getMessage(3271));
        return this.ve = this.c.get(nt);
    }
    get routeTree() {
        let t = this.me;
        if (t === null) {
            const e = this.we;
            t = this.me = new RouteTree(NavigationOptions.create(this.options, {}), Y, null, RouteNode.create({
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
        return this.Ee ?? (this.Ee = Transition.J({
            id: 0,
            prevInstructions: this.Re,
            instructions: this.Re,
            finalInstructions: this.Re,
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
        this.Ee = t;
    }
    get isNavigating() {
        return this.ye;
    }
    constructor() {
        this.ve = null;
        this.me = null;
        this.Ee = null;
        this.be = false;
        this.Ce = 0;
        this.Se = null;
        this.xe = null;
        this._e = false;
        this.ye = false;
        this.c = i(l);
        this.Ne = i(C);
        this.U = i(r).root.scopeTo("Router");
        this.I = i(z);
        this.ke = i(H);
        this.options = i(st);
        this.$e = new Map;
        this.Re = ViewportInstructionTree.create("", this.options);
        this.c.registerResolver(Router, f.instance(Router, this));
    }
    Te(t) {
        return RouteContext.resolve(this.we, t);
    }
    start(t) {
        this._e = typeof this.options.buildTitle === "function";
        this.ke.startListening();
        this.xe = this.I.subscribe("au:router:location-change", (t => {
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
        if (!this.be && t) {
            return this.load(this.ke.getPath(), {
                historyStrategy: "replace"
            });
        }
    }
    stop() {
        this.ke.stopListening();
        this.xe?.dispose();
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
        return this.routeTree.contains(i, {
            matchEndpoint: false
        });
    }
    getRouteContext(t, e, s, i, n, r, o) {
        return a(o instanceof RouteConfig ? o : resolveRouteConfiguration(typeof s?.getRouteConfig === "function" ? s : e.Type, false, n, null, r), (s => {
            let n = this.$e.get(t);
            if (n === void 0) {
                this.$e.set(t, n = new WeakMap);
            }
            let r = n.get(s);
            if (r !== void 0) {
                return r;
            }
            const o = i.has(nt, true) ? i.get(nt) : null;
            n.set(s, r = new RouteContext(t, o, e, s, i, this));
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
        const h = this.Se = Transition.J({
            id: ++this.Ce,
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
                h.Ht(t);
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
                        this.me = h.previousRouteTree;
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
        let e = this.Te(t.options.context);
        this.I.publish(new NavigationStartEvent(t.id, t.instructions, t.trigger, t.managedState));
        if (this.Se !== null) {
            return this.Qt(this.Se);
        }
        t.Qt((() => {
            const s = t.finalInstructions;
            const i = this.we;
            const n = t.routeTree;
            n.options = s.options;
            n.queryParams = i.node.se.queryParams = s.queryParams;
            n.fragment = i.node.se.fragment = s.fragment;
            const o = /*@__PURE__*/ e.container.get(r).scopeTo("RouteTree");
            if (s.isAbsolute) {
                e = i;
            }
            if (e === i) {
                n.root.ae(n);
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
                    i.context.vpa.Dt(t, s);
                }
            })).T((e => {
                if (t.guardsResult !== true) {
                    e._();
                    this.Pe(t);
                }
            })).T((e => {
                for (const i of s) {
                    i.context.vpa.qt(t, e);
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
                this.be = true;
                this.Re = t.finalInstructions = t.routeTree.le();
                this.ye = false;
                const e = t.finalInstructions.toUrl(true, this.options.Ve);
                switch (t.options.Oe(this.Re)) {
                  case "none":
                    break;

                  case "push":
                    this.ke.pushState(toManagedState(t.options.state, t.id), this.updateTitle(t), e);
                    break;

                  case "replace":
                    this.ke.replaceState(toManagedState(t.options.state, t.id), this.updateTitle(t), e);
                    break;
                }
                this.I.publish(new NavigationEndEvent(t.id, t.instructions, this.Re));
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
        const e = t.previousRouteTree.root.children;
        const s = t.routeTree.root.children;
        const i = mergeDistinct(e, s);
        i.forEach((function(t) {
            t.context.vpa.te();
        }));
        this.Re = t.prevInstructions;
        this.me = t.previousRouteTree;
        this.ye = false;
        const n = t.guardsResult;
        this.I.publish(new NavigationCancelEvent(t.id, t.instructions, `guardsResult is ${n}`));
        if (n === false) {
            t.resolve(false);
            this.Ae();
        } else {
            let e;
            if (this.be && (t.erredWithUnknownRoute || t.error != null && this.options.restorePreviousRouteTreeOnError)) e = t.prevInstructions; else if (n === true) return; else e = n;
            void a(this.Ie(e, "api", t.managedState, t), (() => {}));
        }
    }
    Ae() {
        if (this.Se === null) return;
        this.Ne.taskQueue.queueTask((() => {
            const t = this.Se;
            if (t === null) return;
            try {
                this.Qt(t);
            } catch (e) {
                t.Ht(e);
            }
        }));
    }
}

function updateNode(t, e, s, i) {
    t.trace(`updateNode(ctx:%s,node:%s)`, s, i);
    i.queryParams = e.queryParams;
    i.fragment = e.fragment;
    if (!i.context.isRoot) {
        i.context.vpa.Yt(i.se.options, i);
    }
    if (i.context === s) {
        i.ue();
        return a(u(...e.children.map((e => createAndAppendNodes(t, i, e)))), (() => u(...s.getAvailableViewportAgents().reduce(((e, s) => {
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
    return u(...i.children.map((i => updateNode(t, e, s, i))));
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
        return new ParsedUrl(t, i != null ? i : Y, e);
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
    e ?? (e = Y);
    let n = e.toString();
    n = n === "" ? "" : `?${n}`;
    const r = s != null && s.length > 0 ? `#${encodeURIComponent(s)}` : "";
    return `${i}${n}${r}`;
}

const tt = Object.freeze({
    parse(t) {
        return ParsedUrl.J(t);
    },
    stringify(t, e, s) {
        return stringify(t, e, s);
    }
});

const et = Object.freeze({
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

const st = /*@__PURE__*/ s.createInterface("RouterOptions");

class RouterOptions {
    constructor(t, e, s, i, n, r, o) {
        this.useUrlFragmentHash = t;
        this.useHref = e;
        this.historyStrategy = s;
        this.buildTitle = i;
        this.useNavigationModel = n;
        this.activeClass = r;
        this.restorePreviousRouteTreeOnError = o;
        this.Ve = t ? et : tt;
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
        const i = e.length === 0 || s === null || s.length === 0 || s === it ? "" : `@${s}`;
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
    const e = Object.keys(t);
    const s = e.length;
    if (s === 0) return "";
    const i = Array(s);
    const n = [];
    const r = [];
    for (const t of e) {
        if (p(t)) {
            n.push(Number(t));
        } else {
            r.push(t);
        }
    }
    for (let e = 0; e < s; ++e) {
        const s = n.indexOf(e);
        if (s > -1) {
            i[e] = t[e];
            n.splice(s, 1);
        } else {
            const s = r.shift();
            i[e] = `${s}=${t[s]}`;
        }
    }
    return `(${i.join(",")})`;
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
    static create(t, e, s, i) {
        s = s instanceof NavigationOptions ? s : NavigationOptions.create(e, s ?? h);
        let n = s.context;
        if (!(n instanceof RouteContext) && i != null) {
            n = s.context = RouteContext.resolve(i, n);
        }
        const r = n != null;
        if (t instanceof Array) {
            const e = t.length;
            const i = new Array(e);
            const o = new URLSearchParams(s.queryParams ?? h);
            for (let s = 0; s < e; s++) {
                const e = t[s];
                const c = r ? n.pe(e) : null;
                if (c !== null) {
                    i[s] = c.vi;
                    mergeURLSearchParams(o, c.query, false);
                } else {
                    i[s] = ViewportInstruction.create(e);
                }
            }
            return new ViewportInstructionTree(s, false, i, o, s.fragment);
        }
        if (typeof t === "string") {
            const i = RouteExpression.parse(e.Ve.parse(t));
            return i.toInstructionTree(s);
        }
        const o = r ? n.pe(isPartialViewportInstruction(t) ? {
            ...t,
            params: t.params ?? h
        } : {
            component: t,
            params: h
        }) : null;
        const c = new URLSearchParams(s.queryParams ?? h);
        return o !== null ? new ViewportInstructionTree(s, false, [ o.vi ], mergeURLSearchParams(c, o.query, false), s.fragment) : new ViewportInstructionTree(s, false, [ ViewportInstruction.create(t) ], c, s.fragment);
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
        if (t instanceof S) return new TypedNavigationInstruction(2, t);
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
        this.Me = t;
        this.je = e;
        this.Zt = s;
        this.we = i;
        this.Ue = n;
        this.U = i.container.get(r).scopeTo(`ComponentAgent<${i.Ot}>`);
        const o = e.lifecycleHooks;
        this.Le = (o.canLoad ?? []).map((t => t.instance));
        this.Be = (o.loading ?? []).map((t => t.instance));
        this.ze = (o.canUnload ?? []).map((t => t.instance));
        this.De = (o.unloading ?? []).map((t => t.instance));
        this.He = "canLoad" in t;
        this.qe = "loading" in t;
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
        for (const n of this.ze) {
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
    qt(t, e, s) {
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
        if (this.He) {
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
        for (const i of this.Be) {
            t.Qt((() => {
                s._();
                return i.loading(this.Me, e.params, e, this.Zt);
            }), (() => {
                s.N();
            }));
        }
        if (this.qe) {
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

const nt = /*@__PURE__*/ s.createInterface("IRouteContext");

const rt = Object.freeze([ "string", "object", "function" ]);

function isEagerInstruction(t) {
    if (t == null) return false;
    const e = t.params;
    const s = t.component;
    return typeof e === "object" && e !== null && s != null && rt.includes(typeof s) && !(s instanceof Promise);
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
    constructor(t, e, s, i, n, o) {
        this.parent = e;
        this.component = s;
        this.config = i;
        this.Ye = o;
        this.Ze = [];
        this.childRoutes = [];
        this.We = null;
        this.Je = null;
        this.Qe = null;
        this.ts = false;
        this.Ke = t;
        if (e === null) {
            this.root = this;
            this.path = [ this ];
            this.Ot = s.name;
        } else {
            this.root = e.root;
            this.path = [ ...e.path, this ];
            this.Ot = `${e.Ot}/${s.name}`;
        }
        this.U = n.get(r).scopeTo(`RouteContext<${this.Ot}>`);
        this.es = n.get(d);
        const c = this.container = n.createChild();
        c.registerResolver(x, this.ss = new g, true);
        const a = new g("IRouteContext", this);
        c.registerResolver(nt, a);
        c.registerResolver(RouteContext, a);
        c.register(i);
        this.ns = new L;
        if (o.options.useNavigationModel) {
            const t = this.Xe = new NavigationModel([]);
            c.get(z).subscribe("au:router:navigation-end", (() => t.rs(o, this)));
        } else {
            this.Xe = null;
        }
        this.os(i);
    }
    os(t) {
        const e = [];
        const s = t.routes ?? q;
        const i = s.length;
        if (i === 0) {
            const e = t.component.prototype?.getRouteConfig;
            this.ts = e == null ? true : typeof e !== "function";
            return;
        }
        const n = this.Xe;
        const r = n !== null;
        let o = 0;
        for (;o < i; o++) {
            const i = s[o];
            if (i instanceof Promise) {
                e.push(this.cs(i));
                continue;
            }
            const a = resolveRouteConfiguration(i, true, t, null, this);
            if (a instanceof Promise) {
                if (!isPartialChildRouteConfig(i) || i.path == null) throw new Error(getMessage(3173));
                for (const t of ensureArrayOfStrings(i.path)) {
                    this.us(t, i.caseSensitive ?? false, a);
                }
                const t = this.childRoutes.length;
                const s = a.then((e => this.childRoutes[t] = e));
                this.childRoutes.push(s);
                if (r) {
                    n.cs(s);
                }
                e.push(s.then(w));
                continue;
            }
            for (const t of a.path ?? c) {
                this.us(t, a.caseSensitive, a);
            }
            this.childRoutes.push(a);
            if (r) {
                n.cs(a);
            }
        }
        this.ts = true;
        if (e.length > 0) {
            this.We = Promise.all(e).then((() => {
                this.We = null;
            }));
        }
    }
    static setRoot(t) {
        const e = t.get(r).scopeTo("RouteContext");
        if (!t.has(_, true)) {
            logAndThrow(new Error(getMessage(3167)), e);
        }
        if (t.has(nt, true)) {
            logAndThrow(new Error(getMessage(3168)), e);
        }
        const {controller: s} = t.get(_);
        if (s === void 0) {
            logAndThrow(new Error(getMessage(3169)), e);
        }
        const i = t.get(Z);
        return a(i.getRouteContext(null, s.definition, s.viewModel, s.container, null, null, null), (e => {
            t.register(f.instance(nt, e));
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
        if (e instanceof s.get(C).Node) {
            try {
                const t = y.for(e, {
                    searchParents: true
                });
                return t.container.get(nt);
            } catch (t) {
                error(i, 3155, e.nodeName, t);
                throw t;
            }
        }
        if (v(e)) {
            const t = e.$controller;
            return t.container.get(nt);
        }
        if (N(e)) {
            const t = e;
            return t.container.get(nt);
        }
        logAndThrow(new Error(getMessage(3170, Object.prototype.toString.call(e))), i);
    }
    dispose() {
        this.container.dispose();
    }
    de(t) {
        const e = this.Ze.find((e => e.Bt(t)));
        if (e === void 0) throw new Error(getMessage(3174, t, this.ls()));
        return e;
    }
    getAvailableViewportAgents() {
        return this.Ze.filter((t => t.zt()));
    }
    getFallbackViewportAgent(t) {
        return this.Ze.find((e => e.zt() && e.viewport.name === t && e.viewport.fallback !== "")) ?? null;
    }
    Ft(t, e) {
        this.ss.prepare(t);
        const s = this.container;
        const i = s.get(e.component.key);
        const n = this.ts ? void 0 : a(resolveRouteConfiguration(i, false, this.config, e, null), (t => this.os(t)));
        return a(n, (() => {
            const n = b.$el(s, i, t.host, null);
            const r = new ComponentAgent(i, n, e, this, this.Ye.options);
            this.ss.dispose();
            return r;
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
    ds(t) {
        const e = ViewportAgent.for(t, this);
        if (!this.Ze.includes(e)) {
            return;
        }
        this.Ze.splice(this.Ze.indexOf(e), 1);
    }
    recognize(t, e = false) {
        let s = this;
        let i = true;
        let n = null;
        while (i) {
            n = s.ns.recognize(t);
            if (n === null) {
                if (!e || s.isRoot) return null;
                s = s.parent;
            } else {
                i = false;
            }
        }
        return new $RecognizedRoute(n, Reflect.has(n.params, U) ? n.params[U] ?? null : null);
    }
    cs(t) {
        return a(resolveRouteConfiguration(t, true, this.config, null, this), (t => {
            for (const e of t.path ?? c) {
                this.us(e, t.caseSensitive, t);
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
    pe(t) {
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
        const r = this.ns;
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
                    recognizedRoute: new $RecognizedRoute(new A(e.endpoint, e.consumed), null),
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
        for (let t = 0; t < o; t++) {
            const e = core(s[t]);
            if (e === null) continue;
            if (a === null) {
                a = e;
                u = Object.keys(e.consumed).length;
            } else if (Object.keys(e.consumed).length > u) {
                a = e;
            }
        }
        if (a === null) {
            if (i) throw new Error(getMessage(3166, t, c));
            return null;
        }
        return {
            vi: ViewportInstruction.create({
                recognizedRoute: new $RecognizedRoute(new A(a.endpoint, a.consumed), null),
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
                t = t.replace(o, encodeURIComponent(r));
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
        this.gs = void 0;
    }
    resolve() {
        return a(this.gs, w);
    }
    rs(t, e) {
        void a(this.gs, (() => {
            for (const s of this.routes) {
                s.rs(t, e);
            }
        }));
    }
    cs(t) {
        const e = this.routes;
        if (!(t instanceof Promise)) {
            if (t.nav ?? false) {
                e.push(NavigationRoute.J(t));
            }
            return;
        }
        const s = e.length;
        e.push(void 0);
        let i = void 0;
        i = this.gs = a(this.gs, (() => a(t, (t => {
            if (t.nav) {
                e[s] = NavigationRoute.J(t);
            } else {
                e.splice(s, 1);
            }
            if (this.gs === i) {
                this.gs = void 0;
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
        this.ws = null;
    }
    static J(t) {
        return new NavigationRoute(t.id, ensureArrayOfStrings(t.path ?? c), t.redirectTo, t.title, t.data);
    }
    get isActive() {
        return this._t;
    }
    rs(t, e) {
        let s = this.ws;
        if (s === null) {
            const i = t.options;
            s = this.ws = this.path.map((t => {
                const s = e.ns.getEndpoint(t);
                if (s === null) throw new Error(getMessage(3450, t));
                return new ViewportInstructionTree(NavigationOptions.create(i, {
                    context: e
                }), false, [ ViewportInstruction.create({
                    recognizedRoute: new $RecognizedRoute(new A(s, h), null),
                    component: t
                }) ], Y, null);
            }));
        }
        this._t = s.some((e => t.routeTree.contains(e, {
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

let ot = class ViewportCustomElement {
    constructor() {
        this.name = it;
        this.usedBy = "";
        this.default = "";
        this.fallback = "";
        this.vs = void 0;
        this.je = void 0;
        this.we = i(nt);
        this.U = i(r).scopeTo(`au-viewport<${this.we.Ot}>`);
    }
    tt(t, e, s) {
        const i = this.fallback;
        return typeof i === "function" && !y.isType(i) ? i(t, e, s) : i;
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
        this.we.ds(this);
        this.vs.Jt();
        this.vs = void 0;
    }
    toString() {
        const t = [];
        for (const e of ct) {
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
        return `VP(ctx:'${this.we.Ot}',${t.join(",")})`;
    }
};

__decorate([ $ ], ot.prototype, "name", void 0);

__decorate([ $ ], ot.prototype, "usedBy", void 0);

__decorate([ $ ], ot.prototype, "default", void 0);

__decorate([ $ ], ot.prototype, "fallback", void 0);

ot = __decorate([ k({
    name: "au-viewport"
}) ], ot);

const ct = [ "name", "usedBy", "default", "fallback" ];

let at = class LoadCustomAttribute {
    constructor() {
        this.Es = i(I);
        this.Ye = i(Z);
        this.we = i(nt);
        this.I = i(z);
        this.ke = i(H);
        this.attribute = "href";
        this.active = false;
        this.Rs = null;
        this.Re = null;
        this.ys = null;
        this.onClick = t => {
            if (this.Re === null) {
                return;
            }
            if (t.altKey || t.ctrlKey || t.shiftKey || t.metaKey || t.button !== 0) {
                return;
            }
            t.preventDefault();
            void this.Ye.load(this.Re, {
                context: this.context
            });
        };
        const t = this.Es;
        this.bs = !t.hasAttribute("external") && !t.hasAttribute("data-external");
        this.Cs = this.Ye.options.activeClass;
    }
    binding() {
        if (this.bs) {
            this.Es.addEventListener("click", this.onClick);
        }
        this.valueChanged();
        this.ys = this.I.subscribe("au:router:navigation-end", (t => {
            const e = this.active = this.Re !== null && this.Ye.isActive(this.Re, this.context);
            const s = this.Cs;
            if (s === null) return;
            this.Es.classList.toggle(s, e);
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
            this.Es.removeEventListener("click", this.onClick);
        }
        this.ys.dispose();
    }
    valueChanged() {
        const t = this.Ye;
        const e = t.options;
        const s = this.route;
        let i = this.context;
        if (i === void 0) {
            i = this.context = this.we;
        } else if (i === null) {
            i = this.context = this.we.root;
        }
        if (s != null && i.allResolved === null) {
            const n = this.params;
            const r = this.Re = t.createViewportInstructions(typeof n === "object" && n !== null ? {
                component: s,
                params: n
            } : s, {
                context: i
            });
            this.Rs = r.toUrl(false, e.Ve);
        } else {
            this.Re = null;
            this.Rs = null;
        }
        const n = y.for(this.Es, {
            optional: true
        });
        if (n !== null) {
            n.viewModel[this.attribute] = this.Re;
        } else {
            if (this.Rs === null) {
                this.Es.removeAttribute(this.attribute);
            } else {
                const t = e.useUrlFragmentHash ? this.Rs : this.ke.addBaseHref(this.Rs);
                this.Es.setAttribute(this.attribute, t);
            }
        }
    }
};

__decorate([ $({
    mode: 2,
    primary: true,
    callback: "valueChanged"
}) ], at.prototype, "route", void 0);

__decorate([ $({
    mode: 2,
    callback: "valueChanged"
}) ], at.prototype, "params", void 0);

__decorate([ $({
    mode: 2
}) ], at.prototype, "attribute", void 0);

__decorate([ $({
    mode: 4
}) ], at.prototype, "active", void 0);

__decorate([ $({
    mode: 2,
    callback: "valueChanged"
}) ], at.prototype, "context", void 0);

at = __decorate([ T("load") ], at);

let ut = class HrefCustomAttribute {
    get Ss() {
        return this.Es.hasAttribute("external") || this.Es.hasAttribute("data-external");
    }
    constructor() {
        this.Es = i(I);
        this.Ye = i(Z);
        this.we = i(nt);
        this.xs = false;
        if (this.Ye.options.useHref && this.Es.nodeName === "A") {
            const t = i(R).name;
            switch (this.Es.getAttribute("target")) {
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
        if (!this.xs) {
            this.xs = true;
            this.bs = this.bs && P(this.Es, V.getDefinition(at).key) === null;
        }
        this.valueChanged(this.value);
        this.Es.addEventListener("click", this);
    }
    unbinding() {
        this.Es.removeEventListener("click", this);
    }
    valueChanged(t) {
        if (t == null) {
            this.Es.removeAttribute("href");
        } else {
            if (this.Ye.options.useUrlFragmentHash && this.we.isRoot && !/^[.#]/.test(t)) {
                t = `#${t}`;
            }
            this.Es.setAttribute("href", t);
        }
    }
    handleEvent(t) {
        this._s(t);
    }
    _s(t) {
        if (t.altKey || t.ctrlKey || t.shiftKey || t.metaKey || t.button !== 0 || this.Ss || !this.bs) {
            return;
        }
        const e = this.Es.getAttribute("href");
        if (e !== null) {
            t.preventDefault();
            void this.Ye.load(e, {
                context: this.we
            });
        }
    }
};

__decorate([ $({
    mode: 2
}) ], ut.prototype, "value", void 0);

ut = __decorate([ T({
    name: "href",
    noMultiBindings: true
}) ], ut);

const ht = Z;

const lt = [ ht ];

const ft = ot;

const pt = at;

const dt = ut;

const gt = [ ot, at, ut ];

function configure(t, s) {
    let i = null;
    if (e(s)) {
        i = s.basePath ?? null;
    } else {
        s = {};
    }
    const n = RouterOptions.create(s);
    return t.register(f.cachedCallback(D, ((t, e, s) => {
        const n = t.get(R);
        const r = new URL(n.document.baseURI);
        r.pathname = normalizePath(i ?? r.pathname);
        return r;
    })), f.instance(st, n), f.instance(RouterOptions, n), O.hydrated(l, RouteContext.setRoot), O.activated(Z, (t => t.start(true))), O.deactivated(Z, (t => {
        t.stop();
    })), ...lt, ...gt);
}

const wt = {
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
        this.Es = t;
        this.Ns = t.scrollTop;
        this.ks = t.scrollLeft;
    }
    static $s(t) {
        return t.scrollTop > 0 || t.scrollLeft > 0;
    }
    Ts() {
        this.Es.scrollTo(this.ks, this.Ns);
        this.Es = null;
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

const vt = /*@__PURE__*/ s.createInterface("IStateManager", (t => t.singleton(ScrollStateManager)));

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

export { J as AST, B as AuNavId, ComponentExpression, CompositeSegmentExpression, lt as DefaultComponents, gt as DefaultResources, W as ExpressionKind, ut as HrefCustomAttribute, dt as HrefCustomAttributeRegistration, H as ILocationManager, nt as IRouteContext, Z as IRouter, z as IRouterEvents, st as IRouterOptions, vt as IStateManager, at as LoadCustomAttribute, pt as LoadCustomAttributeRegistration, LocationChangeEvent, NavigationCancelEvent, NavigationEndEvent, NavigationErrorEvent, NavigationOptions, NavigationStartEvent, ParameterExpression, ParameterListExpression, F as Route, RouteConfig, RouteContext, RouteExpression, RouteNode, RouteTree, Router, wt as RouterConfiguration, RouterOptions, ht as RouterRegistration, ScopedSegmentExpression, SegmentExpression, SegmentGroupExpression, Transition, ViewportAgent, ot as ViewportCustomElement, ft as ViewportCustomElementRegistration, ViewportExpression, et as fragmentUrlParser, isManagedState, tt as pathUrlParser, route, toManagedState };

