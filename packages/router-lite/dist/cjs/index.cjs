"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var t = require("@aurelia/metadata");

var e = require("@aurelia/kernel");

var s = require("@aurelia/runtime-html");

var i = require("@aurelia/route-recognizer");

class Batch {
    constructor(t, e, s) {
        this.stack = t;
        this.cb = e;
        this.done = false;
        this.next = null;
        this.head = s ?? this;
    }
    static start(t) {
        return new Batch(0, t, null);
    }
    push() {
        let t = this;
        do {
            ++t.stack;
            t = t.next;
        } while (null !== t);
    }
    pop() {
        let t = this;
        do {
            if (0 === --t.stack) t.invoke();
            t = t.next;
        } while (null !== t);
    }
    invoke() {
        const t = this.cb;
        if (null !== t) {
            this.cb = null;
            t(this);
            this.done = true;
        }
    }
    continueWith(t) {
        if (null === this.next) return this.next = new Batch(this.stack, t, this.head); else return this.next.continueWith(t);
    }
    start() {
        this.head.push();
        this.head.pop();
        return this;
    }
}

function n(t, e) {
    t = t.slice();
    e = e.slice();
    const s = [];
    while (t.length > 0) {
        const i = t.shift();
        const n = i.context.vpa;
        if (s.every((t => t.context.vpa !== n))) {
            const t = e.findIndex((t => t.context.vpa === n));
            if (t >= 0) s.push(...e.splice(0, t + 1)); else s.push(i);
        }
    }
    s.push(...e);
    return s;
}

function r(t) {
    try {
        return JSON.stringify(t);
    } catch {
        return Object.prototype.toString.call(t);
    }
}

function o(t) {
    return "string" === typeof t ? [ t ] : t;
}

function h(t) {
    return "string" === typeof t ? t : t[0];
}

function a(t, e, s) {
    const i = s ? new URLSearchParams(t) : t;
    if (null == e) return i;
    for (const [t, s] of Object.entries(e)) i.append(t, s);
    return i;
}

function c(t) {
    return "object" === typeof t && null !== t && !s.isCustomElementViewModel(t);
}

function u(t) {
    return c(t) && true === Object.prototype.hasOwnProperty.call(t, "name");
}

function l(t) {
    return c(t) && true === Object.prototype.hasOwnProperty.call(t, "component");
}

function f(t) {
    return c(t) && true === Object.prototype.hasOwnProperty.call(t, "redirectTo");
}

function p(t) {
    return c(t) && true === Object.prototype.hasOwnProperty.call(t, "component");
}

function d(t, e, s) {
    throw new Error(`Invalid route config property: "${e}". Expected ${t}, but got ${r(s)}.`);
}

function g(t, e) {
    if (null === t || void 0 === t) throw new Error(`Invalid route config: expected an object or string, but got: ${String(t)}.`);
    const s = Object.keys(t);
    for (const i of s) {
        const s = t[i];
        const n = [ e, i ].join(".");
        switch (i) {
          case "id":
          case "viewport":
          case "redirectTo":
            if ("string" !== typeof s) d("string", n, s);
            break;

          case "caseSensitive":
          case "nav":
            if ("boolean" !== typeof s) d("boolean", n, s);
            break;

          case "data":
            if ("object" !== typeof s || null === s) d("object", n, s);
            break;

          case "title":
            switch (typeof s) {
              case "string":
              case "function":
                break;

              default:
                d("string or function", n, s);
            }
            break;

          case "path":
            if (s instanceof Array) {
                for (let t = 0; t < s.length; ++t) if ("string" !== typeof s[t]) d("string", `${n}[${t}]`, s[t]);
            } else if ("string" !== typeof s) d("string or Array of strings", n, s);
            break;

          case "component":
            v(s, n, "component");
            break;

          case "routes":
            if (!(s instanceof Array)) d("Array", n, s);
            for (const t of s) {
                const e = `${n}[${s.indexOf(t)}]`;
                v(t, e, "component");
            }
            break;

          case "transitionPlan":
            switch (typeof s) {
              case "string":
                switch (s) {
                  case "none":
                  case "replace":
                  case "invoke-lifecycles":
                    break;

                  default:
                    d("string('none'|'replace'|'invoke-lifecycles') or function", n, s);
                }
                break;

              case "function":
                break;

              default:
                d("string('none'|'replace'|'invoke-lifecycles') or function", n, s);
            }
            break;

          case "fallback":
            v(s, n, "fallback");
            break;

          default:
            throw new Error(`Unknown route config property: "${e}.${i}". Please specify known properties only.`);
        }
    }
}

function w(t, e) {
    if (null === t || void 0 === t) throw new Error(`Invalid route config: expected an object or string, but got: ${String(t)}.`);
    const s = Object.keys(t);
    for (const i of s) {
        const s = t[i];
        const n = [ e, i ].join(".");
        switch (i) {
          case "path":
            if (s instanceof Array) {
                for (let t = 0; t < s.length; ++t) if ("string" !== typeof s[t]) d("string", `${n}[${t}]`, s[t]);
            } else if ("string" !== typeof s) d("string or Array of strings", n, s);
            break;

          case "redirectTo":
            if ("string" !== typeof s) d("string", n, s);
            break;

          default:
            throw new Error(`Unknown redirect config property: "${e}.${i}". Only 'path' and 'redirectTo' should be specified for redirects.`);
        }
    }
}

function v(t, e, i) {
    switch (typeof t) {
      case "function":
        break;

      case "object":
        if (t instanceof Promise) break;
        if (f(t)) {
            w(t, e);
            break;
        }
        if (l(t)) {
            g(t, e);
            break;
        }
        if (!s.isCustomElementViewModel(t) && !u(t)) d(`an object with at least a '${i}' property (see Routeable)`, e, t);
        break;

      case "string":
        break;

      default:
        d("function, object or string (see Routeable)", e, t);
    }
}

function m(t, e) {
    if (t === e) return true;
    if (typeof t !== typeof e) return false;
    if (null === t || null === e) return false;
    if (Object.getPrototypeOf(t) !== Object.getPrototypeOf(e)) return false;
    const s = Object.keys(t);
    const i = Object.keys(e);
    if (s.length !== i.length) return false;
    for (let n = 0, r = s.length; n < r; ++n) {
        const r = s[n];
        if (r !== i[n]) return false;
        if (t[r] !== e[r]) return false;
    }
    return true;
}

function x(t, e) {
    if ("function" === typeof e) return e(t);
    return e;
}

const $ = e.DI.createInterface("RouterOptions");

class RouterOptions {
    constructor(t, e, s, i, n) {
        this.useUrlFragmentHash = t;
        this.useHref = e;
        this.historyStrategy = s;
        this.buildTitle = i;
        this.useNavigationModel = n;
    }
    static create(t) {
        return new RouterOptions(t.useUrlFragmentHash ?? false, t.useHref ?? true, t.historyStrategy ?? "push", t.buildTitle ?? null, t.useNavigationModel ?? true);
    }
    t() {
        return [ [ "historyStrategy", "history" ] ].map((([t, e]) => {
            const s = this[t];
            return `${e}:${"function" === typeof s ? s : `'${s}'`}`;
        })).join(",");
    }
    toString() {
        return `RO(${this.t()})`;
    }
}

class NavigationOptions {
    constructor(t, e, s, i, n, r, o, h) {
        this.historyStrategy = t;
        this.title = e;
        this.titleSeparator = s;
        this.context = i;
        this.queryParams = n;
        this.fragment = r;
        this.state = o;
        this.transitionPlan = h;
    }
    static create(t, e) {
        return new NavigationOptions(e.historyStrategy ?? t.historyStrategy, e.title ?? null, e.titleSeparator ?? " | ", e.context ?? null, e.queryParams ?? null, e.fragment ?? "", e.state ?? null, e.transitionPlan ?? null);
    }
    clone() {
        return new NavigationOptions(this.historyStrategy, this.title, this.titleSeparator, this.context, {
            ...this.queryParams
        }, this.fragment, null === this.state ? null : {
            ...this.state
        }, this.transitionPlan);
    }
    i(t) {
        return x(t, this.historyStrategy);
    }
}

function E(t, e, s, i) {
    var n = arguments.length, r = n < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, s) : i, o;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(t, e, s, i); else for (var h = t.length - 1; h >= 0; h--) if (o = t[h]) r = (n < 3 ? o(r) : n > 3 ? o(e, s, r) : o(e, s)) || r;
    return n > 3 && r && Object.defineProperty(e, s, r), r;
}

function b(t, e) {
    return function(s, i) {
        e(s, i, t);
    };
}

const y = "au-nav-id";

class Subscription {
    constructor(t, e, s) {
        this.events = t;
        this.serial = e;
        this.inner = s;
        this.disposed = false;
    }
    dispose() {
        if (!this.disposed) {
            this.disposed = true;
            this.inner.dispose();
            const t = this.events["subscriptions"];
            t.splice(t.indexOf(this), 1);
        }
    }
}

const R = e.DI.createInterface("IRouterEvents", (t => t.singleton(k)));

let k = class RouterEvents {
    constructor(t, e) {
        this.ea = t;
        this.logger = e;
        this.subscriptionSerial = 0;
        this.subscriptions = [];
        this.logger = e.scopeTo("RouterEvents");
    }
    publish(t) {
        this.logger.trace(`publishing %s`, t);
        this.ea.publish(t.name, t);
    }
    subscribe(t, e) {
        const s = new Subscription(this, ++this.subscriptionSerial, this.ea.subscribe(t, (i => {
            this.logger.trace(`handling %s for subscription #${s.serial}`, t);
            e(i);
        })));
        this.subscriptions.push(s);
        return s;
    }
};

k = E([ b(0, e.IEventAggregator), b(1, e.ILogger) ], k);

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
        return `LocationChangeEvent(id:${this.id},url:'${this.url}',trigger:'${this.trigger}')`;
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
        return `NavigationStartEvent(id:${this.id},instructions:'${this.instructions}',trigger:'${this.trigger}')`;
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
        return `NavigationEndEvent(id:${this.id},instructions:'${this.instructions}',finalInstructions:'${this.finalInstructions}')`;
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
        return `NavigationCancelEvent(id:${this.id},instructions:'${this.instructions}',reason:${String(this.reason)})`;
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
        return `NavigationErrorEvent(id:${this.id},instructions:'${this.instructions}',error:${String(this.error)})`;
    }
}

const S = e.DI.createInterface("IBaseHref");

const C = e.DI.createInterface("ILocationManager", (t => t.singleton(I)));

let I = class BrowserLocationManager {
    constructor(t, e, s, i, n, r, o) {
        this.logger = t;
        this.events = e;
        this.history = s;
        this.location = i;
        this.window = n;
        this.baseHref = r;
        this.eventId = 0;
        t = this.logger = t.root.scopeTo("LocationManager");
        t.debug(`baseHref set to path: ${r.href}`);
        this.h = o.useUrlFragmentHash ? "hashchange" : "popstate";
    }
    startListening() {
        this.logger.trace(`startListening()`);
        this.window.addEventListener(this.h, this, false);
    }
    stopListening() {
        this.logger.trace(`stopListening()`);
        this.window.removeEventListener(this.h, this, false);
    }
    handleEvent(t) {
        this.events.publish(new LocationChangeEvent(++this.eventId, this.getPath(), this.h, "state" in t ? t.state : null));
    }
    pushState(t, e, s) {
        s = this.addBaseHref(s);
        try {
            const i = JSON.stringify(t);
            this.logger.trace(`pushState(state:${i},title:'${e}',url:'${s}')`);
        } catch (t) {
            this.logger.warn(`pushState(state:NOT_SERIALIZABLE,title:'${e}',url:'${s}')`);
        }
        this.history.pushState(t, e, s);
    }
    replaceState(t, e, s) {
        s = this.addBaseHref(s);
        try {
            const i = JSON.stringify(t);
            this.logger.trace(`replaceState(state:${i},title:'${e}',url:'${s}')`);
        } catch (t) {
            this.logger.warn(`replaceState(state:NOT_SERIALIZABLE,title:'${e}',url:'${s}')`);
        }
        this.history.replaceState(t, e, s);
    }
    getPath() {
        const {pathname: t, search: e, hash: s} = this.location;
        const i = this.removeBaseHref(`${t}${V(e)}${s}`);
        this.logger.trace(`getPath() -> '${i}'`);
        return i;
    }
    currentPathEquals(t) {
        const e = this.getPath() === this.removeBaseHref(t);
        this.logger.trace(`currentPathEquals(path:'${t}') -> ${e}`);
        return e;
    }
    addBaseHref(t) {
        const e = t;
        let s;
        let i = this.baseHref.href;
        if (i.endsWith("/")) i = i.slice(0, -1);
        if (0 === i.length) s = t; else {
            if (t.startsWith("/")) t = t.slice(1);
            s = `${i}/${t}`;
        }
        this.logger.trace(`addBaseHref(path:'${e}') -> '${s}'`);
        return s;
    }
    removeBaseHref(t) {
        const e = t;
        const s = this.baseHref.pathname;
        if (t.startsWith(s)) t = t.slice(s.length);
        t = N(t);
        this.logger.trace(`removeBaseHref(path:'${e}') -> '${t}'`);
        return t;
    }
};

I = E([ b(0, e.ILogger), b(1, R), b(2, s.IHistory), b(3, s.ILocation), b(4, s.IWindow), b(5, S), b(6, $) ], I);

function N(t) {
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
    if (e.endsWith("/")) e = e.slice(0, -1); else if (e.endsWith("/index.html")) e = e.slice(0, -11);
    return `${e}${s}`;
}

function V(t) {
    return t.length > 0 && !t.startsWith("?") ? `?${t}` : t;
}

const A = e.emptyArray;

function T(t, e) {
    if (!m(t.params, e.params)) return "replace";
    return "none";
}

class RouteConfig {
    get path() {
        const t = this.u;
        if (t.length > 0) return t;
        const e = s.CustomElement.getDefinition(this.component);
        return this.u = [ e.name, ...e.aliases ];
    }
    constructor(t, e, s, i, n, r, o, h, a, c, u, l) {
        this.id = t;
        this.u = e;
        this.title = s;
        this.redirectTo = i;
        this.caseSensitive = n;
        this.transitionPlan = r;
        this.viewport = o;
        this.data = h;
        this.routes = a;
        this.fallback = c;
        this.component = u;
        this.nav = l;
        this.$ = false;
    }
    static R(t, s) {
        if ("string" === typeof t || t instanceof Array) {
            const e = o(t);
            const i = s?.redirectTo ?? null;
            const n = s?.caseSensitive ?? false;
            const r = h(s?.id ?? (e instanceof Array ? e[0] : e));
            const a = s?.title ?? null;
            const c = s?.transitionPlan ?? null;
            const u = s?.viewport ?? rt;
            const l = s?.data ?? {};
            const f = s?.routes ?? A;
            return new RouteConfig(r, e, a, i, n, c, u, l, f, s?.fallback ?? null, s, s?.nav ?? true);
        } else if ("object" === typeof t) {
            const i = t;
            g(i, "");
            const n = o(i.path ?? s?.path ?? e.emptyArray);
            const r = i.title ?? s?.title ?? null;
            const h = i.redirectTo ?? s?.redirectTo ?? null;
            const a = i.caseSensitive ?? s?.caseSensitive ?? false;
            const c = i.id ?? s?.id ?? (n instanceof Array ? n[0] : n);
            const u = i.transitionPlan ?? s?.transitionPlan ?? null;
            const l = i.viewport ?? s?.viewport ?? rt;
            const f = {
                ...s?.data,
                ...i.data
            };
            const p = [ ...i.routes ?? A, ...s?.routes ?? A ];
            return new RouteConfig(c, n, r, h, a, u, l, f, p, i.fallback ?? s?.fallback ?? null, i.component ?? s ?? null, i.nav ?? true);
        } else d("string, function/class or object", "", t);
    }
    applyChildRouteConfig(t, e) {
        g(t, this.path[0] ?? "");
        const s = o(t.path ?? this.path);
        return new RouteConfig(h(t.id ?? this.id ?? s), s, t.title ?? this.title, t.redirectTo ?? this.redirectTo, t.caseSensitive ?? this.caseSensitive, t.transitionPlan ?? this.transitionPlan ?? e?.transitionPlan ?? null, t.viewport ?? this.viewport, t.data ?? this.data, t.routes ?? this.routes, t.fallback ?? this.fallback ?? e?.fallback ?? null, this.component, t.nav ?? this.nav);
    }
    getTransitionPlan(t, e) {
        const s = this.transitionPlan ?? T;
        return "function" === typeof s ? s(t, e) : s;
    }
    C(t, s, i) {
        if (this.$) throw new Error("Invalid operation, the configuration from the get hook is already applied.");
        if ("function" !== typeof t.getRouteConfig) return;
        return e.onResolve(t.getRouteConfig(s, i), (t => {
            this.$ = true;
            if (null == t) return;
            let e = s?.path ?? "";
            if ("string" !== typeof e) e = e[0];
            g(t, e);
            this.id = t.id ?? this.id;
            this.u = o(t.path ?? this.path);
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
    N(t, e, i) {
        const n = this.fallback;
        return "function" === typeof n && !s.CustomElement.isType(n) ? n(t, e, i) : n;
    }
    register(t) {
        const e = this.component;
        if (null == e) return;
        t.register(e);
    }
}

const P = {
    name: e.Protocol.resource.keyFor("route-configuration"),
    isConfigured(e) {
        return t.Metadata.hasOwn(P.name, e);
    },
    configure(e, s) {
        const i = RouteConfig.R(e, s);
        t.Metadata.define(P.name, i, s);
        return s;
    },
    getConfig(e) {
        if (!P.isConfigured(e)) P.configure({}, e);
        return t.Metadata.getOwn(P.name, e);
    }
};

function U(t) {
    return function(e) {
        return P.configure(t, e);
    };
}

function L(t, s, i, n, r) {
    if (f(t)) return RouteConfig.R(t, null);
    const [o, h] = O(t, r);
    return e.onResolve(h, (r => {
        const h = r.Type;
        const a = P.getConfig(h);
        if (l(t)) return a.applyChildRouteConfig(t, i);
        if (s) return a.I();
        if (!a.$ && 4 === o.type && "function" === typeof t.getRouteConfig) return e.onResolve(a.C(t, i, n), (() => a));
        return a;
    }));
}

function O(t, e) {
    const i = j(t);
    let n;
    switch (i.type) {
      case 0:
        {
            if (null == e) throw new Error(`When retrieving the RouteConfig for a component name, a RouteContext (that can resolve it) must be provided`);
            const t = e.container.find(s.CustomElement, i.value);
            if (null === t) throw new Error(`Could not find a CustomElement named '${i.value}' in the current container scope of ${e}. This means the component is neither registered at Aurelia startup nor via the 'dependencies' decorator or static property.`);
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
        if (null == e) throw new Error(`RouteContext must be provided when resolving an imported module`);
        n = e.resolveLazy(i.value);
        break;
    }
    return [ i, n ];
}

function j(t) {
    return l(t) ? j(t.component) : TypedNavigationInstruction.create(t);
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

const _ = new WeakMap;

class ViewportAgent {
    get $state() {
        return F(this.state);
    }
    get currState() {
        return 16256 & this.state;
    }
    set currState(t) {
        this.state = 127 & this.state | t;
    }
    get nextState() {
        return 127 & this.state;
    }
    set nextState(t) {
        this.state = 16256 & this.state | t;
    }
    constructor(t, s, i) {
        this.viewport = t;
        this.hostController = s;
        this.ctx = i;
        this.isActive = false;
        this.curCA = null;
        this.nextCA = null;
        this.state = 8256;
        this.$plan = "replace";
        this.currNode = null;
        this.nextNode = null;
        this.currTransition = null;
        this.V = null;
        this.logger = i.container.get(e.ILogger).scopeTo(`ViewportAgent<${i.friendlyPath}>`);
        this.logger.trace(`constructor()`);
    }
    static for(t, e) {
        let i = _.get(t);
        if (void 0 === i) {
            const n = s.Controller.getCachedOrThrow(t);
            _.set(t, i = new ViewportAgent(t, n, e));
        }
        return i;
    }
    A(t, e) {
        const s = this.currTransition;
        if (null !== s) M(s);
        this.isActive = true;
        switch (this.nextState) {
          case 64:
            switch (this.currState) {
              case 8192:
                this.logger.trace(`activateFromViewport() - nothing to activate at %s`, this);
                return;

              case 4096:
                this.logger.trace(`activateFromViewport() - activating existing componentAgent at %s`, this);
                return this.curCA.T(t, e);

              default:
                this.P("activateFromViewport 1");
            }

          case 2:
            {
                if (null === this.currTransition) throw new Error(`Unexpected viewport activation outside of a transition context at ${this}`);
                this.logger.trace(`activateFromViewport() - running ordinary activate at %s`, this);
                const e = Batch.start((e => {
                    this.T(t, this.currTransition, e);
                }));
                const s = new Promise((t => {
                    e.continueWith((() => {
                        t();
                    }));
                }));
                return e.start().done ? void 0 : s;
            }

          default:
            this.P("activateFromViewport 2");
        }
    }
    U(t, e) {
        const s = this.currTransition;
        if (null !== s) M(s);
        this.isActive = false;
        switch (this.currState) {
          case 8192:
            this.logger.trace(`deactivateFromViewport() - nothing to deactivate at %s`, this);
            return;

          case 4096:
            this.logger.trace(`deactivateFromViewport() - deactivating existing componentAgent at %s`, this);
            return this.curCA.L(t, e);

          case 128:
            this.logger.trace(`deactivateFromViewport() - already deactivating at %s`, this);
            return;

          default:
            {
                if (null === this.currTransition) throw new Error(`Unexpected viewport deactivation outside of a transition context at ${this}`);
                this.logger.trace(`deactivateFromViewport() - running ordinary deactivate at %s`, this);
                const e = Batch.start((e => {
                    this.L(t, this.currTransition, e);
                }));
                const s = new Promise((t => {
                    e.continueWith((() => {
                        t();
                    }));
                }));
                return e.start().done ? void 0 : s;
            }
        }
    }
    O(t) {
        if (!this.j()) return false;
        const e = this.viewport;
        const s = t.viewportName;
        const i = e.name;
        if (s !== rt && i !== s) {
            this.logger.trace(`handles(req:%s) -> false (viewport names don't match '%s')`, t, i);
            return false;
        }
        const n = e.usedBy;
        if (n.length > 0 && !n.split(",").includes(t.componentName)) {
            this.logger.trace(`handles(req:%s) -> false (componentName not included in usedBy)`, t);
            return false;
        }
        this.logger.trace(`viewport '%s' handles(req:%s) -> true`, i, t);
        return true;
    }
    j() {
        if (!this.isActive) {
            this.logger.trace(`isAvailable -> false (viewport is not active)`);
            return false;
        }
        if (64 !== this.nextState) {
            this.logger.trace(`isAvailable -> false (update already scheduled for %s)`, this.nextNode);
            return false;
        }
        return true;
    }
    _(t, s) {
        if (null === this.currTransition) this.currTransition = t;
        M(t);
        if (true !== t.guardsResult) return;
        s.push();
        void e.onResolve(this.V, (() => {
            Batch.start((e => {
                this.logger.trace(`canUnload() - invoking on children at %s`, this);
                for (const s of this.currNode.children) s.context.vpa._(t, e);
            })).continueWith((e => {
                switch (this.currState) {
                  case 4096:
                    this.logger.trace(`canUnload() - invoking on existing component at %s`, this);
                    switch (this.$plan) {
                      case "none":
                        this.currState = 1024;
                        return;

                      case "invoke-lifecycles":
                      case "replace":
                        this.currState = 2048;
                        e.push();
                        Batch.start((e => {
                            this.logger.trace(`canUnload() - finished invoking on children, now invoking on own component at %s`, this);
                            this.curCA._(t, this.nextNode, e);
                        })).continueWith((() => {
                            this.logger.trace(`canUnload() - finished at %s`, this);
                            this.currState = 1024;
                            e.pop();
                        })).start();
                        return;
                    }

                  case 8192:
                    this.logger.trace(`canUnload() - nothing to unload at %s`, this);
                    return;

                  default:
                    t.handleError(new Error(`Unexpected state at canUnload of ${this}`));
                }
            })).continueWith((() => {
                s.pop();
            })).start();
        }));
    }
    B(t, s) {
        if (null === this.currTransition) this.currTransition = t;
        M(t);
        if (true !== t.guardsResult) return;
        s.push();
        Batch.start((s => {
            switch (this.nextState) {
              case 32:
                this.logger.trace(`canLoad() - invoking on new component at %s`, this);
                this.nextState = 16;
                switch (this.$plan) {
                  case "none":
                    return;

                  case "invoke-lifecycles":
                    return this.curCA.B(t, this.nextNode, s);

                  case "replace":
                    s.push();
                    void e.onResolve(this.nextNode.context.createComponentAgent(this.hostController, this.nextNode), (e => {
                        (this.nextCA = e).B(t, this.nextNode, s);
                        s.pop();
                    }));
                }

              case 64:
                this.logger.trace(`canLoad() - nothing to load at %s`, this);
                return;

              default:
                this.P("canLoad");
            }
        })).continueWith((t => {
            const s = this.nextNode;
            switch (this.$plan) {
              case "none":
              case "invoke-lifecycles":
                {
                    this.logger.trace(`canLoad(next:%s) - plan set to '%s', compiling residue`, s, this.$plan);
                    t.push();
                    const i = s.context;
                    void e.onResolve(i.resolved, (() => e.onResolve(e.onResolve(e.resolveAll(...s.residue.splice(0).map((t => W(this.logger, s, t)))), (() => e.resolveAll(...i.getAvailableViewportAgents().reduce(((t, e) => {
                        const i = e.viewport;
                        const n = i.default;
                        if (null === n) return t;
                        t.push(W(this.logger, s, ViewportInstruction.create({
                            component: n,
                            viewport: i.name
                        })));
                        return t;
                    }), [])))), (() => {
                        t.pop();
                    }))));
                    return;
                }

              case "replace":
                this.logger.trace(`canLoad(next:%s), delaying residue compilation until activate`, s, this.$plan);
                return;
            }
        })).continueWith((e => {
            switch (this.nextState) {
              case 16:
                this.logger.trace(`canLoad() - finished own component, now invoking on children at %s`, this);
                this.nextState = 8;
                for (const s of this.nextNode.children) s.context.vpa.B(t, e);
                return;

              case 64:
                return;

              default:
                this.P("canLoad");
            }
        })).continueWith((() => {
            this.logger.trace(`canLoad() - finished at %s`, this);
            s.pop();
        })).start();
    }
    M(t, e) {
        M(t);
        B(this, t);
        e.push();
        Batch.start((e => {
            this.logger.trace(`unloading() - invoking on children at %s`, this);
            for (const s of this.currNode.children) s.context.vpa.M(t, e);
        })).continueWith((s => {
            switch (this.currState) {
              case 1024:
                this.logger.trace(`unloading() - invoking on existing component at %s`, this);
                switch (this.$plan) {
                  case "none":
                    this.currState = 256;
                    return;

                  case "invoke-lifecycles":
                  case "replace":
                    this.currState = 512;
                    s.push();
                    Batch.start((e => {
                        this.logger.trace(`unloading() - finished invoking on children, now invoking on own component at %s`, this);
                        this.curCA.M(t, this.nextNode, e);
                    })).continueWith((() => {
                        this.logger.trace(`unloading() - finished at %s`, this);
                        this.currState = 256;
                        s.pop();
                    })).start();
                    return;
                }

              case 8192:
                this.logger.trace(`unloading() - nothing to unload at %s`, this);
                for (const s of this.currNode.children) s.context.vpa.M(t, e);
                return;

              default:
                this.P("unloading");
            }
        })).continueWith((() => {
            e.pop();
        })).start();
    }
    q(t, e) {
        M(t);
        B(this, t);
        e.push();
        Batch.start((e => {
            switch (this.nextState) {
              case 8:
                this.logger.trace(`loading() - invoking on new component at %s`, this);
                this.nextState = 4;
                switch (this.$plan) {
                  case "none":
                    return;

                  case "invoke-lifecycles":
                    return this.curCA.q(t, this.nextNode, e);

                  case "replace":
                    return this.nextCA.q(t, this.nextNode, e);
                }

              case 64:
                this.logger.trace(`loading() - nothing to load at %s`, this);
                return;

              default:
                this.P("loading");
            }
        })).continueWith((e => {
            switch (this.nextState) {
              case 4:
                this.logger.trace(`loading() - finished own component, now invoking on children at %s`, this);
                this.nextState = 2;
                for (const s of this.nextNode.children) s.context.vpa.q(t, e);
                return;

              case 64:
                return;

              default:
                this.P("loading");
            }
        })).continueWith((() => {
            this.logger.trace(`loading() - finished at %s`, this);
            e.pop();
        })).start();
    }
    L(t, s, i) {
        M(s);
        B(this, s);
        i.push();
        switch (this.currState) {
          case 256:
            this.logger.trace(`deactivate() - invoking on existing component at %s`, this);
            this.currState = 128;
            switch (this.$plan) {
              case "none":
              case "invoke-lifecycles":
                i.pop();
                return;

              case "replace":
                {
                    const n = this.hostController;
                    const r = this.curCA;
                    s.run((() => e.onResolve(r.L(t, n), (() => {
                        if (null === t) r.F();
                    }))), (() => {
                        i.pop();
                    }));
                }
            }
            return;

          case 8192:
            this.logger.trace(`deactivate() - nothing to deactivate at %s`, this);
            i.pop();
            return;

          case 128:
            this.logger.trace(`deactivate() - already deactivating at %s`, this);
            i.pop();
            return;

          default:
            this.P("deactivate");
        }
    }
    T(t, e, s) {
        M(e);
        B(this, e);
        s.push();
        if (32 === this.nextState) {
            this.logger.trace(`activate() - invoking canLoad(), loading() and activate() on new component due to resolution 'dynamic' at %s`, this);
            Batch.start((t => {
                this.B(e, t);
            })).continueWith((t => {
                this.q(e, t);
            })).continueWith((s => {
                this.T(t, e, s);
            })).continueWith((() => {
                s.pop();
            })).start();
            return;
        }
        switch (this.nextState) {
          case 2:
            this.logger.trace(`activate() - invoking on existing component at %s`, this);
            this.nextState = 1;
            Batch.start((s => {
                switch (this.$plan) {
                  case "none":
                  case "invoke-lifecycles":
                    return;

                  case "replace":
                    {
                        const i = this.hostController;
                        e.run((() => {
                            s.push();
                            return this.nextCA.T(t, i);
                        }), (() => {
                            s.pop();
                        }));
                    }
                }
            })).continueWith((t => {
                this.H(e, t);
            })).continueWith((() => {
                s.pop();
            })).start();
            return;

          case 64:
            this.logger.trace(`activate() - nothing to activate at %s`, this);
            s.pop();
            return;

          default:
            this.P("activate");
        }
    }
    W(t, s) {
        if (8192 === this.currState) {
            this.logger.trace(`swap() - running activate on next instead, because there is nothing to deactivate at %s`, this);
            this.T(null, t, s);
            return;
        }
        if (64 === this.nextState) {
            this.logger.trace(`swap() - running deactivate on current instead, because there is nothing to activate at %s`, this);
            this.L(null, t, s);
            return;
        }
        M(t);
        B(this, t);
        if (!(256 === this.currState && 2 === this.nextState)) this.P("swap");
        this.currState = 128;
        this.nextState = 1;
        switch (this.$plan) {
          case "none":
          case "invoke-lifecycles":
            {
                this.logger.trace(`swap() - skipping this level and swapping children instead at %s`, this);
                const e = n(this.nextNode.children, this.currNode.children);
                for (const i of e) i.context.vpa.W(t, s);
                return;
            }

          case "replace":
            {
                this.logger.trace(`swap() - running normally at %s`, this);
                const i = this.hostController;
                const n = this.curCA;
                const r = this.nextCA;
                s.push();
                Batch.start((s => {
                    t.run((() => {
                        s.push();
                        return e.onResolve(n.L(null, i), (() => n.F()));
                    }), (() => {
                        s.pop();
                    }));
                })).continueWith((e => {
                    t.run((() => {
                        e.push();
                        return r.T(null, i);
                    }), (() => {
                        e.pop();
                    }));
                })).continueWith((e => {
                    this.H(t, e);
                })).continueWith((() => {
                    s.pop();
                })).start();
                return;
            }
        }
    }
    H(t, s) {
        this.logger.trace(`processDynamicChildren() - %s`, this);
        const i = this.nextNode;
        t.run((() => {
            s.push();
            const t = i.context;
            return e.onResolve(t.resolved, (() => {
                const s = i.children.slice();
                return e.onResolve(e.resolveAll(...i.residue.splice(0).map((t => W(this.logger, i, t)))), (() => e.onResolve(e.resolveAll(...t.getAvailableViewportAgents().reduce(((t, e) => {
                    const s = e.viewport;
                    const n = s.default;
                    if (null === n) return t;
                    t.push(W(this.logger, i, ViewportInstruction.create({
                        component: n,
                        viewport: s.name
                    })));
                    return t;
                }), [])), (() => i.children.filter((t => !s.includes(t)))))));
            }));
        }), (e => {
            Batch.start((s => {
                for (const i of e) t.run((() => {
                    s.push();
                    return i.context.vpa.B(t, s);
                }), (() => {
                    s.pop();
                }));
            })).continueWith((s => {
                for (const i of e) t.run((() => {
                    s.push();
                    return i.context.vpa.q(t, s);
                }), (() => {
                    s.pop();
                }));
            })).continueWith((s => {
                for (const i of e) t.run((() => {
                    s.push();
                    return i.context.vpa.T(null, t, s);
                }), (() => {
                    s.pop();
                }));
            })).continueWith((() => {
                s.pop();
            })).start();
        }));
    }
    G(t, e) {
        switch (this.nextState) {
          case 64:
            this.nextNode = e;
            this.nextState = 32;
            break;

          default:
            this.P("scheduleUpdate 1");
        }
        switch (this.currState) {
          case 8192:
          case 4096:
          case 1024:
            break;

          default:
            this.P("scheduleUpdate 2");
        }
        const s = this.curCA?.routeNode ?? null;
        if (null === s || s.component !== e.component) this.$plan = "replace"; else this.$plan = t.transitionPlan ?? e.context.config.getTransitionPlan(s, e);
        this.logger.trace(`scheduleUpdate(next:%s) - plan set to '%s'`, e, this.$plan);
    }
    Y() {
        if (null !== this.currNode) this.currNode.children.forEach((function(t) {
            t.context.vpa.Y();
        }));
        if (null !== this.nextNode) this.nextNode.children.forEach((function(t) {
            t.context.vpa.Y();
        }));
        this.logger.trace(`cancelUpdate(nextNode:%s)`, this.nextNode);
        switch (this.currState) {
          case 8192:
          case 4096:
            break;

          case 2048:
          case 1024:
            this.currState = 4096;
            break;

          case 512:
          case 128:
            this.currState = 8192;
            this.curCA = null;
            this.currTransition = null;
            break;
        }
        switch (this.nextState) {
          case 64:
          case 32:
          case 16:
          case 8:
            this.nextNode = null;
            this.nextState = 64;
            break;

          case 4:
          case 1:
            this.V = e.onResolve(this.nextCA?.L(null, this.hostController), (() => {
                this.nextCA?.F();
                this.$plan = "replace";
                this.nextState = 64;
                this.nextCA = null;
                this.nextNode = null;
                this.currTransition = null;
                this.V = null;
            }));
            break;
        }
    }
    J() {
        if (null !== this.currNode) this.currNode.children.forEach((function(t) {
            t.context.vpa.J();
        }));
        if (null !== this.nextNode) this.nextNode.children.forEach((function(t) {
            t.context.vpa.J();
        }));
        if (null !== this.currTransition) {
            M(this.currTransition);
            switch (this.nextState) {
              case 64:
                switch (this.currState) {
                  case 8192:
                  case 128:
                    this.logger.trace(`endTransition() - setting currState to State.nextIsEmpty at %s`, this);
                    this.currState = 8192;
                    this.curCA = null;
                    break;

                  default:
                    this.P("endTransition 1");
                }
                break;

              case 1:
                switch (this.currState) {
                  case 8192:
                  case 128:
                    switch (this.$plan) {
                      case "none":
                      case "invoke-lifecycles":
                        this.logger.trace(`endTransition() - setting currState to State.currIsActive at %s`, this);
                        this.currState = 4096;
                        break;

                      case "replace":
                        this.logger.trace(`endTransition() - setting currState to State.currIsActive and reassigning curCA at %s`, this);
                        this.currState = 4096;
                        this.curCA = this.nextCA;
                        break;
                    }
                    this.currNode = this.nextNode;
                    break;

                  default:
                    this.P("endTransition 2");
                }
                break;

              default:
                this.P("endTransition 3");
            }
            this.$plan = "replace";
            this.nextState = 64;
            this.nextNode = null;
            this.nextCA = null;
            this.currTransition = null;
        }
    }
    toString() {
        return `VPA(state:${this.$state},plan:'${this.$plan}',n:${this.nextNode},c:${this.currNode},viewport:${this.viewport})`;
    }
    F() {
        this.logger.trace(`dispose() - disposing %s`, this);
        this.curCA?.F();
    }
    P(t) {
        throw new Error(`Unexpected state at ${t} of ${this}`);
    }
}

function B(t, e) {
    if (true !== e.guardsResult) throw new Error(`Unexpected guardsResult ${e.guardsResult} at ${t}`);
}

function M(t) {
    if (void 0 !== t.error && !t.erredWithUnknownRoute) throw t.error;
}

var z;

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
})(z || (z = {}));

const q = new Map;

function F(t) {
    let e = q.get(t);
    if (void 0 === e) q.set(t, e = D(t));
    return e;
}

function D(t) {
    const e = [];
    if (8192 === (8192 & t)) e.push("currIsEmpty");
    if (4096 === (4096 & t)) e.push("currIsActive");
    if (2048 === (2048 & t)) e.push("currCanUnload");
    if (1024 === (1024 & t)) e.push("currCanUnloadDone");
    if (512 === (512 & t)) e.push("currUnload");
    if (256 === (256 & t)) e.push("currUnloadDone");
    if (128 === (128 & t)) e.push("currDeactivate");
    if (64 === (64 & t)) e.push("nextIsEmpty");
    if (32 === (32 & t)) e.push("nextIsScheduled");
    if (16 === (16 & t)) e.push("nextCanLoad");
    if (8 === (8 & t)) e.push("nextCanLoadDone");
    if (4 === (4 & t)) e.push("nextLoad");
    if (2 === (2 & t)) e.push("nextLoadDone");
    if (1 === (1 & t)) e.push("nextActivate");
    return e.join("|");
}

let H = 0;

class RouteNode {
    get root() {
        return this.tree.root;
    }
    constructor(t, e, s, i, n, r, o, h, a, c, u, l, f, p, d) {
        this.id = t;
        this.path = e;
        this.finalPath = s;
        this.context = i;
        this.originalInstruction = n;
        this.instruction = r;
        this.params = o;
        this.queryParams = h;
        this.fragment = a;
        this.data = c;
        this.viewport = u;
        this.title = l;
        this.component = f;
        this.children = p;
        this.residue = d;
        this.version = 1;
        this.originalInstruction ?? (this.originalInstruction = r);
    }
    static create(t) {
        const {[i.RESIDUE]: e, ...s} = t.params ?? {};
        return new RouteNode(++H, t.path, t.finalPath, t.context, t.originalInstruction ?? t.instruction, t.instruction, s, t.queryParams ?? Z, t.fragment ?? null, t.data ?? {}, t.viewport ?? null, t.title ?? null, t.component, t.children ?? [], t.residue ?? []);
    }
    contains(t, e) {
        if (this.context === t.options.context) {
            const s = this.children;
            const i = t.children;
            for (let t = 0, n = s.length; t < n; ++t) for (let r = 0, o = i.length; r < o; ++r) {
                const h = i[r];
                const a = e ? h.recognizedRoute?.route.endpoint : null;
                const c = s[t + r];
                if (t + r < n && (null != a && c.instruction?.recognizedRoute?.route.endpoint === a || (c.originalInstruction?.contains(h) ?? false))) {
                    if (r + 1 === o) return true;
                } else break;
            }
        }
        return this.children.some((function(s) {
            return s.contains(t, e);
        }));
    }
    appendChild(t) {
        this.children.push(t);
        t.setTree(this.tree);
    }
    clearChildren() {
        for (const t of this.children) {
            t.clearChildren();
            t.context.vpa.Y();
        }
        this.children.length = 0;
    }
    getTitle(t) {
        const e = [ ...this.children.map((e => e.getTitle(t))), this.getTitlePart() ].filter((t => null !== t));
        if (0 === e.length) return null;
        return e.join(t);
    }
    getTitlePart() {
        if ("function" === typeof this.title) return this.title.call(void 0, this);
        return this.title;
    }
    computeAbsolutePath() {
        if (this.context.isRoot) return "";
        const t = this.context.parent.node.computeAbsolutePath();
        const e = this.instruction.toUrlComponent(false);
        if (t.length > 0) {
            if (e.length > 0) return [ t, e ].join("/");
            return t;
        }
        return e;
    }
    setTree(t) {
        this.tree = t;
        for (const e of this.children) e.setTree(t);
    }
    finalizeInstruction() {
        const t = this.children.map((t => t.finalizeInstruction()));
        const e = this.instruction.clone();
        e.children.splice(0, e.children.length, ...t);
        return this.instruction = e;
    }
    clone() {
        const t = new RouteNode(this.id, this.path, this.finalPath, this.context, this.originalInstruction, this.instruction, {
            ...this.params
        }, new URLSearchParams(this.queryParams), this.fragment, {
            ...this.data
        }, this.viewport, this.title, this.component, this.children.map((t => t.clone())), [ ...this.residue ]);
        t.version = this.version + 1;
        if (t.context.node === this) t.context.node = t;
        return t;
    }
    toString() {
        const t = [];
        const e = this.context?.config.component?.name ?? "";
        if (e.length > 0) t.push(`c:'${e}'`);
        const s = this.context?.config.path ?? "";
        if (s.length > 0) t.push(`path:'${s}'`);
        if (this.children.length > 0) t.push(`children:[${this.children.map(String).join(",")}]`);
        if (this.residue.length > 0) t.push(`residue:${this.residue.map((function(t) {
            if ("string" === typeof t) return `'${t}'`;
            return String(t);
        })).join(",")}`);
        return `RN(ctx:'${this.context?.friendlyPath}',${t.join(",")})`;
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
    clone() {
        const t = new RouteTree(this.options.clone(), new URLSearchParams(this.queryParams), this.fragment, this.root.clone());
        t.root.setTree(this);
        return t;
    }
    finalizeInstructions() {
        return new ViewportInstructionTree(this.options, true, this.root.children.map((t => t.finalizeInstruction())), this.queryParams, this.fragment);
    }
    toString() {
        return this.root.toString();
    }
}

function W(t, s, i) {
    t.trace(`createAndAppendNodes(node:%s,vi:%s`, s, i);
    switch (i.component.type) {
      case 0:
        switch (i.component.value) {
          case "..":
            s = s.context.parent?.node ?? s;
            s.clearChildren();

          case ".":
            return e.resolveAll(...i.children.map((e => W(t, s, e))));

          default:
            {
                t.trace(`createAndAppendNodes invoking createNode`);
                const n = s.context;
                const r = i.clone();
                let o = i.recognizedRoute;
                if (null !== o) return Y(t, s, G(t, s, i, o, r));
                if (0 === i.children.length) {
                    const e = n.generateViewportInstruction(i);
                    if (null !== e) {
                        s.tree.queryParams = a(s.tree.queryParams, e.query, true);
                        const n = e.vi;
                        n.children.push(...i.children);
                        return Y(t, s, G(t, s, n, n.recognizedRoute, i));
                    }
                }
                let h = 0;
                let c = i.component.value;
                let u = i;
                while (1 === u.children.length) {
                    u = u.children[0];
                    if (0 === u.component.type) {
                        ++h;
                        c = `${c}/${u.component.value}`;
                    } else break;
                }
                o = n.recognize(c);
                t.trace("createNode recognized route: %s", o);
                const l = o?.residue ?? null;
                t.trace("createNode residue:", l);
                const f = null === l;
                if (null === o || l === c) {
                    const r = n.generateViewportInstruction({
                        component: i.component.value,
                        params: i.params ?? e.emptyObject,
                        open: i.open,
                        close: i.close,
                        viewport: i.viewport,
                        children: i.children.slice()
                    });
                    if (null !== r) {
                        s.tree.queryParams = a(s.tree.queryParams, r.query, true);
                        return Y(t, s, G(t, s, r.vi, r.vi.recognizedRoute, i));
                    }
                    const o = i.component.value;
                    if ("" === o) return;
                    let h = i.viewport;
                    if (null === h || 0 === h.length) h = rt;
                    const c = n.getFallbackViewportAgent(h);
                    const u = null !== c ? c.viewport.N(i, s, n) : n.config.N(i, s, n);
                    if (null === u) throw new UnknownRouteError(`Neither the route '${o}' matched any configured route at '${n.friendlyPath}' nor a fallback is configured for the viewport '${h}' - did you forget to add '${o}' to the routes list of the route decorator of '${n.component.name}'?`);
                    if ("string" === typeof u) {
                        t.trace(`Fallback is set to '${u}'. Looking for a recognized route.`);
                        const e = n.childRoutes.find((t => t.id === u));
                        if (void 0 !== e) return Y(t, s, J(t, e, s, i));
                        t.trace(`No route configuration for the fallback '${u}' is found; trying to recognize the route.`);
                        const r = n.recognize(u, true);
                        if (null !== r && r.residue !== u) return Y(t, s, G(t, s, i, r, null));
                    }
                    t.trace(`The fallback '${u}' is not recognized as a route; treating as custom element name.`);
                    return e.onResolve(L(u, false, n.config, null, n), (e => Y(t, s, J(t, e, s, i))));
                }
                o.residue = null;
                i.component.value = f ? c : c.slice(0, -(l.length + 1));
                for (let t = 0; t < h; ++t) {
                    const t = i.children[0];
                    if (l?.startsWith(t.component.value) ?? false) break;
                    i.viewport = t.viewport;
                    i.children = t.children;
                }
                i.recognizedRoute = o;
                t.trace("createNode after adjustment vi:%s", i);
                return Y(t, s, G(t, s, i, o, r));
            }
        }

      case 3:
      case 4:
      case 2:
        {
            const n = s.context;
            return e.onResolve(O(i.component.value, n)[1], (r => {
                const {vi: o, query: h} = n.generateViewportInstruction({
                    component: r,
                    params: i.params ?? e.emptyObject,
                    open: i.open,
                    close: i.close,
                    viewport: i.viewport,
                    children: i.children.slice()
                });
                s.tree.queryParams = a(s.tree.queryParams, h, true);
                return Y(t, s, G(t, s, o, o.recognizedRoute, i));
            }));
        }
    }
}

function G(t, s, i, n, r, o = n.route.endpoint.route) {
    const h = s.context;
    const a = s.tree;
    return e.onResolve(o.handler, (c => {
        o.handler = c;
        t.trace(`creatingConfiguredNode(rdc:%s, vi:%s)`, c, i);
        if (null === c.redirectTo) {
            const u = (i.viewport?.length ?? 0) > 0 ? i.viewport : c.viewport;
            return e.onResolve(O(c.component, h)[1], (l => {
                const f = h.resolveViewportAgent(new ViewportRequest(u, l.name));
                const p = h.container.get(X);
                return e.onResolve(p.getRouteContext(f, l, null, f.hostController.container, h.config, h, c), (e => {
                    t.trace("createConfiguredNode setting the context node");
                    const h = e.node = RouteNode.create({
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
                        data: c.data,
                        viewport: u,
                        component: l,
                        title: c.title,
                        residue: [ ...null === n.residue ? [] : [ ViewportInstruction.create(n.residue) ], ...i.children ]
                    });
                    h.setTree(s.tree);
                    t.trace(`createConfiguredNode(vi:%s) -> %s`, i, h);
                    return h;
                }));
            }));
        }
        const u = RouteExpression.parse(o.path, false);
        const l = RouteExpression.parse(c.redirectTo, false);
        let f;
        let p;
        const d = [];
        switch (u.root.kind) {
          case 2:
          case 4:
            f = u.root;
            break;

          default:
            throw new Error(`Unexpected expression kind ${u.root.kind}`);
        }
        switch (l.root.kind) {
          case 2:
          case 4:
            p = l.root;
            break;

          default:
            throw new Error(`Unexpected expression kind ${l.root.kind}`);
        }
        let g;
        let w;
        let v = false;
        let m = false;
        while (!(v && m)) {
            if (v) g = null; else if (4 === f.kind) {
                g = f;
                v = true;
            } else if (4 === f.left.kind) {
                g = f.left;
                switch (f.right.kind) {
                  case 2:
                  case 4:
                    f = f.right;
                    break;

                  default:
                    throw new Error(`Unexpected expression kind ${f.right.kind}`);
                }
            } else throw new Error(`Unexpected expression kind ${f.left.kind}`);
            if (m) w = null; else if (4 === p.kind) {
                w = p;
                m = true;
            } else if (4 === p.left.kind) {
                w = p.left;
                switch (p.right.kind) {
                  case 2:
                  case 4:
                    p = p.right;
                    break;

                  default:
                    throw new Error(`Unexpected expression kind ${p.right.kind}`);
                }
            } else throw new Error(`Unexpected expression kind ${p.left.kind}`);
            if (null !== w) if (w.component.isDynamic && (g?.component.isDynamic ?? false)) d.push(n.route.params[w.component.parameterName]); else d.push(w.raw);
        }
        const x = d.filter(Boolean).join("/");
        const $ = h.recognize(x);
        if (null === $) throw new UnknownRouteError(`'${x}' did not match any configured route or registered component name at '${h.friendlyPath}' - did you forget to add '${x}' to the routes list of the route decorator of '${h.component.name}'?`);
        return G(t, s, ViewportInstruction.create({
            recognizedRoute: $,
            component: x,
            children: i.children,
            viewport: i.viewport,
            open: i.open,
            close: i.close
        }), $, r);
    }));
}

function Y(t, s, i) {
    return e.onResolve(i, (e => {
        t.trace(`appendNode($childNode:%s)`, e);
        s.appendChild(e);
        return e.context.vpa.G(s.tree.options, e);
    }));
}

function J(t, s, n, r) {
    const o = new $RecognizedRoute(new i.RecognizedRoute(new i.Endpoint(new i.ConfigurableRoute(s.path[0], s.caseSensitive, s), []), e.emptyObject), null);
    r.children.length = 0;
    return G(t, n, r, o, null);
}

const Z = Object.freeze(new URLSearchParams);

function K(e) {
    return t.isObject(e) && true === Object.prototype.hasOwnProperty.call(e, y);
}

function Q(t, e) {
    return {
        ...t,
        [y]: e
    };
}

class UnknownRouteError extends Error {}

class Transition {
    get erredWithUnknownRoute() {
        return this.Z;
    }
    constructor(t, e, s, i, n, r, o, h, a, c, u, l, f, p, d) {
        this.id = t;
        this.prevInstructions = e;
        this.instructions = s;
        this.finalInstructions = i;
        this.instructionsChanged = n;
        this.trigger = r;
        this.options = o;
        this.managedState = h;
        this.previousRouteTree = a;
        this.routeTree = c;
        this.promise = u;
        this.resolve = l;
        this.reject = f;
        this.guardsResult = p;
        this.error = d;
        this.Z = false;
    }
    static create(t) {
        return new Transition(t.id, t.prevInstructions, t.instructions, t.finalInstructions, t.instructionsChanged, t.trigger, t.options, t.managedState, t.previousRouteTree, t.routeTree, t.promise, t.resolve, t.reject, t.guardsResult, void 0);
    }
    run(t, e) {
        if (true !== this.guardsResult) return;
        try {
            const s = t();
            if (s instanceof Promise) s.then(e).catch((t => {
                this.handleError(t);
            })); else e(s);
        } catch (t) {
            this.handleError(t);
        }
    }
    handleError(t) {
        this.Z = t instanceof UnknownRouteError;
        this.reject(this.error = t);
    }
    toString() {
        return `T(id:${this.id},trigger:'${this.trigger}',instructions:${this.instructions},options:${this.options})`;
    }
}

const X = e.DI.createInterface("IRouter", (t => t.singleton(exports.Router)));

exports.Router = class Router {
    get ctx() {
        let t = this.K;
        if (null === t) {
            if (!this.container.has(ct, true)) throw new Error(`Root RouteContext is not set. Did you forget to register RouteConfiguration, or try to navigate before calling Aurelia.start()?`);
            t = this.K = this.container.get(ct);
        }
        return t;
    }
    get routeTree() {
        let t = this.X;
        if (null === t) {
            const e = this.ctx;
            t = this.X = new RouteTree(NavigationOptions.create(this.options, {}), Z, null, RouteNode.create({
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
        let t = this.tt;
        if (null === t) t = this.tt = Transition.create({
            id: 0,
            prevInstructions: this.instructions,
            instructions: this.instructions,
            finalInstructions: this.instructions,
            instructionsChanged: true,
            trigger: "api",
            options: NavigationOptions.create(this.options, {}),
            managedState: null,
            previousRouteTree: this.routeTree.clone(),
            routeTree: this.routeTree,
            resolve: null,
            reject: null,
            promise: null,
            guardsResult: true,
            error: void 0
        });
        return t;
    }
    set currentTr(t) {
        this.tt = t;
    }
    get isNavigating() {
        return this.et;
    }
    constructor(t, e, s, i, n, r) {
        this.container = t;
        this.p = e;
        this.logger = s;
        this.events = i;
        this.locationMgr = n;
        this.options = r;
        this.K = null;
        this.X = null;
        this.tt = null;
        this.navigated = false;
        this.navigationId = 0;
        this.nextTr = null;
        this.locationChangeSubscription = null;
        this.st = false;
        this.et = false;
        this.vpaLookup = new Map;
        this.logger = s.root.scopeTo("Router");
        this.instructions = ViewportInstructionTree.create("", r);
    }
    resolveContext(t) {
        return RouteContext.resolve(this.ctx, t);
    }
    start(t) {
        this.st = "function" === typeof this.options.buildTitle;
        this.locationMgr.startListening();
        this.locationChangeSubscription = this.events.subscribe("au:router:location-change", (t => {
            this.p.taskQueue.queueTask((() => {
                const e = K(t.state) ? t.state : null;
                const s = this.options;
                const i = NavigationOptions.create(s, {
                    historyStrategy: "replace"
                });
                const n = ViewportInstructionTree.create(t.url, s, i, this.ctx);
                this.enqueue(n, t.trigger, e, null);
            }));
        }));
        if (!this.navigated && t) return this.load(this.locationMgr.getPath(), {
            historyStrategy: "replace"
        });
    }
    stop() {
        this.locationMgr.stopListening();
        this.locationChangeSubscription?.dispose();
    }
    load(t, e) {
        const s = this.createViewportInstructions(t, e);
        this.logger.trace("load(instructions:%s)", s);
        return this.enqueue(s, "api", null, null);
    }
    isActive(t, e) {
        const s = this.resolveContext(e);
        const i = t instanceof ViewportInstructionTree ? t : this.createViewportInstructions(t, {
            context: s,
            historyStrategy: this.options.historyStrategy
        });
        this.logger.trace("isActive(instructions:%s,ctx:%s)", i, s);
        return this.routeTree.contains(i, false);
    }
    getRouteContext(t, s, i, n, r, o, h) {
        const a = n.get(e.ILogger).scopeTo("RouteContext");
        return e.onResolve(h instanceof RouteConfig ? h : L("function" === typeof i?.getRouteConfig ? i : s.Type, false, r, null, o), (e => {
            let i = this.vpaLookup.get(t);
            if (void 0 === i) this.vpaLookup.set(t, i = new WeakMap);
            let r = i.get(e);
            if (void 0 !== r) {
                a.trace(`returning existing RouteContext for %s`, e);
                return r;
            }
            a.trace(`creating new RouteContext for %s`, e);
            const o = n.has(ct, true) ? n.get(ct) : null;
            i.set(e, r = new RouteContext(t, o, s, e, n, this));
            return r;
        }));
    }
    createViewportInstructions(t, e) {
        if (t instanceof ViewportInstructionTree) return t;
        let s = e?.context ?? null;
        if ("string" === typeof t) {
            t = this.locationMgr.removeBaseHref(t);
            if (t.startsWith("../") && null !== s) {
                s = this.resolveContext(s);
                while (t.startsWith("../") && null !== (s?.parent ?? null)) {
                    t = t.slice(3);
                    s = s.parent;
                }
            }
        }
        const i = this.options;
        return ViewportInstructionTree.create(t, i, NavigationOptions.create(i, {
            ...e,
            context: s
        }), this.ctx);
    }
    enqueue(t, e, s, i) {
        const n = this.currentTr;
        const r = this.logger;
        if ("api" !== e && "api" === n.trigger && n.instructions.equals(t)) {
            r.debug(`Ignoring navigation triggered by '%s' because it is the same URL as the previous navigation which was triggered by 'api'.`, e);
            return true;
        }
        let o;
        let h;
        let a;
        if (null === i || i.erredWithUnknownRoute) a = new Promise((function(t, e) {
            o = t;
            h = e;
        })); else {
            r.debug(`Reusing promise/resolve/reject from the previously failed transition %s`, i);
            a = i.promise;
            o = i.resolve;
            h = i.reject;
        }
        const c = this.nextTr = Transition.create({
            id: ++this.navigationId,
            trigger: e,
            managedState: s,
            prevInstructions: n.finalInstructions,
            finalInstructions: t,
            instructionsChanged: !n.finalInstructions.equals(t),
            instructions: t,
            options: t.options,
            promise: a,
            resolve: o,
            reject: h,
            previousRouteTree: this.routeTree,
            routeTree: this.X = this.routeTree.clone(),
            guardsResult: true,
            error: void 0
        });
        r.debug(`Scheduling transition: %s`, c);
        if (!this.et) try {
            this.run(c);
        } catch (t) {
            c.handleError(t);
        }
        return c.promise.then((t => {
            r.debug(`Transition succeeded: %s`, c);
            return t;
        })).catch((t => {
            r.error(`Transition %s failed: %s`, c, t);
            if (c.erredWithUnknownRoute) this.cancelNavigation(c); else {
                this.et = false;
                this.events.publish(new NavigationErrorEvent(c.id, c.instructions, t));
                const e = this.nextTr;
                if (null !== e) e.previousRouteTree = c.previousRouteTree; else this.X = c.previousRouteTree;
            }
            throw t;
        }));
    }
    run(t) {
        this.currentTr = t;
        this.nextTr = null;
        this.et = true;
        let s = this.resolveContext(t.options.context);
        this.logger.trace(`run(tr:%s) - processing route`, t);
        this.events.publish(new NavigationStartEvent(t.id, t.instructions, t.trigger, t.managedState));
        if (null !== this.nextTr) {
            this.logger.debug(`run(tr:%s) - aborting because a new transition was queued in response to the NavigationStartEvent`, t);
            return this.run(this.nextTr);
        }
        t.run((() => {
            const i = t.finalInstructions;
            this.logger.trace(`run() - compiling route tree: %s`, i);
            const n = this.ctx;
            const r = t.routeTree;
            r.options = i.options;
            r.queryParams = n.node.tree.queryParams = i.queryParams;
            r.fragment = n.node.tree.fragment = i.fragment;
            const o = s.container.get(e.ILogger).scopeTo("RouteTree");
            if (i.isAbsolute) s = n;
            if (s === n) {
                r.root.setTree(r);
                n.node = r.root;
            }
            const h = s.resolved instanceof Promise ? " - awaiting promise" : "";
            o.trace(`updateRouteTree(rootCtx:%s,rt:%s,vit:%s)${h}`, n, r, i);
            return e.onResolve(s.resolved, (() => tt(o, i, s, n.node)));
        }), (() => {
            const e = t.previousRouteTree.root.children;
            const s = t.routeTree.root.children;
            const i = n(e, s);
            Batch.start((s => {
                this.logger.trace(`run() - invoking canUnload on ${e.length} nodes`);
                for (const i of e) i.context.vpa._(t, s);
            })).continueWith((e => {
                if (true !== t.guardsResult) {
                    e.push();
                    this.cancelNavigation(t);
                }
            })).continueWith((e => {
                this.logger.trace(`run() - invoking canLoad on ${s.length} nodes`);
                for (const i of s) i.context.vpa.B(t, e);
            })).continueWith((e => {
                if (true !== t.guardsResult) {
                    e.push();
                    this.cancelNavigation(t);
                }
            })).continueWith((s => {
                this.logger.trace(`run() - invoking unloading on ${e.length} nodes`);
                for (const i of e) i.context.vpa.M(t, s);
            })).continueWith((e => {
                this.logger.trace(`run() - invoking loading on ${s.length} nodes`);
                for (const i of s) i.context.vpa.q(t, e);
            })).continueWith((e => {
                this.logger.trace(`run() - invoking swap on ${i.length} nodes`);
                for (const s of i) s.context.vpa.W(t, e);
            })).continueWith((() => {
                this.logger.trace(`run() - finalizing transition`);
                i.forEach((function(t) {
                    t.context.vpa.J();
                }));
                this.navigated = true;
                this.instructions = t.finalInstructions = t.routeTree.finalizeInstructions();
                this.et = false;
                const e = t.finalInstructions.toUrl(this.options.useUrlFragmentHash);
                switch (t.options.i(this.instructions)) {
                  case "none":
                    break;

                  case "push":
                    this.locationMgr.pushState(Q(t.options.state, t.id), this.updateTitle(t), e);
                    break;

                  case "replace":
                    this.locationMgr.replaceState(Q(t.options.state, t.id), this.updateTitle(t), e);
                    break;
                }
                this.events.publish(new NavigationEndEvent(t.id, t.instructions, this.instructions));
                t.resolve(true);
                this.runNextTransition();
            })).start();
        }));
    }
    updateTitle(t = this.currentTr) {
        let e;
        if (this.st) e = this.options.buildTitle(t) ?? ""; else switch (typeof t.options.title) {
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
        if (e.length > 0) this.p.document.title = e;
        return this.p.document.title;
    }
    cancelNavigation(t) {
        this.logger.trace(`cancelNavigation(tr:%s)`, t);
        const s = t.previousRouteTree.root.children;
        const i = t.routeTree.root.children;
        const r = n(s, i);
        r.forEach((function(t) {
            t.context.vpa.Y();
        }));
        this.instructions = t.prevInstructions;
        this.X = t.previousRouteTree;
        this.et = false;
        const o = t.guardsResult;
        this.events.publish(new NavigationCancelEvent(t.id, t.instructions, `guardsResult is ${o}`));
        if (false === o) {
            t.resolve(false);
            this.runNextTransition();
        } else {
            const s = t.erredWithUnknownRoute ? t.prevInstructions : o;
            void e.onResolve(this.enqueue(s, "api", t.managedState, t), (() => {
                this.logger.trace(`cancelNavigation(tr:%s) - finished redirect`, t);
            }));
        }
    }
    runNextTransition() {
        if (null === this.nextTr) return;
        this.logger.trace(`scheduling nextTransition: %s`, this.nextTr);
        this.p.taskQueue.queueTask((() => {
            const t = this.nextTr;
            if (null === t) return;
            try {
                this.run(t);
            } catch (e) {
                t.handleError(e);
            }
        }));
    }
};

exports.Router = E([ b(0, e.IContainer), b(1, s.IPlatform), b(2, e.ILogger), b(3, R), b(4, C), b(5, $) ], exports.Router);

function tt(t, s, i, n) {
    t.trace(`updateNode(ctx:%s,node:%s)`, i, n);
    n.queryParams = s.queryParams;
    n.fragment = s.fragment;
    if (!n.context.isRoot) n.context.vpa.G(n.tree.options, n);
    if (n.context === i) {
        n.clearChildren();
        return e.onResolve(e.resolveAll(...s.children.map((e => W(t, n, e)))), (() => e.resolveAll(...i.getAvailableViewportAgents().reduce(((e, s) => {
            const i = s.viewport;
            const r = i.default;
            if (null === r) return e;
            e.push(W(t, n, ViewportInstruction.create({
                component: r,
                viewport: i.name
            })));
            return e;
        }), []))));
    }
    return e.resolveAll(...n.children.map((e => tt(t, s, i, e))));
}

const et = [ "?", "#", "/", "+", "(", ")", ".", "@", "!", "=", ",", "&", "'", "~", ";" ];

class ParserState {
    get done() {
        return 0 === this.rest.length;
    }
    constructor(t) {
        this.input = t;
        this.buffers = [];
        this.bufferIndex = 0;
        this.index = 0;
        this.rest = t;
    }
    startsWith(...t) {
        const e = this.rest;
        return t.some((function(t) {
            return e.startsWith(t);
        }));
    }
    consumeOptional(t) {
        if (this.startsWith(t)) {
            this.rest = this.rest.slice(t.length);
            this.index += t.length;
            this.append(t);
            return true;
        }
        return false;
    }
    consume(t) {
        if (!this.consumeOptional(t)) this.expect(`'${t}'`);
    }
    expect(t) {
        throw new Error(`Expected ${t} at index ${this.index} of '${this.input}', but got: '${this.rest}' (rest='${this.rest}')`);
    }
    ensureDone() {
        if (!this.done) throw new Error(`Unexpected '${this.rest}' at index ${this.index} of '${this.input}'`);
    }
    advance() {
        const t = this.rest[0];
        this.rest = this.rest.slice(1);
        ++this.index;
        this.append(t);
    }
    record() {
        this.buffers[this.bufferIndex++] = "";
    }
    playback() {
        const t = --this.bufferIndex;
        const e = this.buffers;
        const s = e[t];
        e[t] = "";
        return s;
    }
    discard() {
        this.buffers[--this.bufferIndex] = "";
    }
    append(t) {
        const e = this.bufferIndex;
        const s = this.buffers;
        for (let i = 0; i < e; ++i) s[i] += t;
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

const st = new Map;

const it = new Map;

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
        const s = e ? st : it;
        let i = s.get(t);
        if (void 0 === i) s.set(t, i = RouteExpression.$parse(t, e));
        return i;
    }
    static $parse(t, e) {
        let s = null;
        const i = t.indexOf("#");
        if (i >= 0) {
            const n = t.slice(i + 1);
            s = decodeURIComponent(n);
            if (e) t = s; else t = t.slice(0, i);
        }
        let n = null;
        const r = t.indexOf("?");
        if (r >= 0) {
            const e = t.slice(r + 1);
            t = t.slice(0, r);
            n = new URLSearchParams(e);
        }
        if ("" === t) return new RouteExpression("", false, SegmentExpression.EMPTY, null != n ? Object.freeze(n) : Z, s, e);
        const o = new ParserState(t);
        o.record();
        const h = o.consumeOptional("/");
        const a = CompositeSegmentExpression.parse(o);
        o.ensureDone();
        const c = o.playback();
        return new RouteExpression(c, h, a, null != n ? Object.freeze(n) : Z, s, e);
    }
    toInstructionTree(t) {
        return new ViewportInstructionTree(t, this.isAbsolute, this.root.toInstructions(0, 0), a(this.queryParams, t.queryParams, true), this.fragment ?? t.fragment);
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
    static parse(t) {
        t.record();
        const e = t.consumeOptional("+");
        const s = [];
        do {
            s.push(ScopedSegmentExpression.parse(t));
        } while (t.consumeOptional("+"));
        if (!e && 1 === s.length) {
            t.discard();
            return s[0];
        }
        const i = t.playback();
        return new CompositeSegmentExpression(i, s);
    }
    toInstructions(t, e) {
        switch (this.siblings.length) {
          case 0:
            return [];

          case 1:
            return this.siblings[0].toInstructions(t, e);

          case 2:
            return [ ...this.siblings[0].toInstructions(t, 0), ...this.siblings[1].toInstructions(0, e) ];

          default:
            return [ ...this.siblings[0].toInstructions(t, 0), ...this.siblings.slice(1, -1).flatMap((function(t) {
                return t.toInstructions(0, 0);
            })), ...this.siblings[this.siblings.length - 1].toInstructions(0, e) ];
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
    static parse(t) {
        t.record();
        const e = SegmentGroupExpression.parse(t);
        if (t.consumeOptional("/")) {
            const s = ScopedSegmentExpression.parse(t);
            const i = t.playback();
            return new ScopedSegmentExpression(i, e, s);
        }
        t.discard();
        return e;
    }
    toInstructions(t, e) {
        const s = this.left.toInstructions(t, 0);
        const i = this.right.toInstructions(0, e);
        let n = s[s.length - 1];
        while (n.children.length > 0) n = n.children[n.children.length - 1];
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
    static parse(t) {
        t.record();
        if (t.consumeOptional("(")) {
            const e = CompositeSegmentExpression.parse(t);
            t.consume(")");
            const s = t.playback();
            return new SegmentGroupExpression(s, e);
        }
        t.discard();
        return SegmentExpression.parse(t);
    }
    toInstructions(t, e) {
        return this.expression.toInstructions(t + 1, e + 1);
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
    static parse(t) {
        t.record();
        const e = ComponentExpression.parse(t);
        const s = ActionExpression.parse(t);
        const i = ViewportExpression.parse(t);
        const n = !t.consumeOptional("!");
        const r = t.playback();
        return new SegmentExpression(r, e, s, i, n);
    }
    toInstructions(t, e) {
        return [ ViewportInstruction.create({
            component: this.component.name,
            params: this.component.parameterList.toObject(),
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
    static parse(t) {
        t.record();
        t.record();
        if (!t.done) if (t.startsWith("./")) t.advance(); else if (t.startsWith("../")) {
            t.advance();
            t.advance();
        } else while (!t.done && !t.startsWith(...et)) t.advance();
        const e = decodeURIComponent(t.playback());
        if (0 === e.length) t.expect("component name");
        const s = ParameterListExpression.parse(t);
        const i = t.playback();
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
    static parse(t) {
        t.record();
        let e = "";
        if (t.consumeOptional(".")) {
            t.record();
            while (!t.done && !t.startsWith(...et)) t.advance();
            e = decodeURIComponent(t.playback());
            if (0 === e.length) t.expect("method name");
        }
        const s = ParameterListExpression.parse(t);
        const i = t.playback();
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
    static parse(t) {
        t.record();
        let e = "";
        if (t.consumeOptional("@")) {
            t.record();
            while (!t.done && !t.startsWith(...et)) t.advance();
            e = decodeURIComponent(t.playback());
            if (0 === e.length) t.expect("viewport name");
        }
        const s = t.playback();
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
    static parse(t) {
        t.record();
        const e = [];
        if (t.consumeOptional("(")) {
            do {
                e.push(ParameterExpression.parse(t, e.length));
                if (!t.consumeOptional(",")) break;
            } while (!t.done && !t.startsWith(")"));
            t.consume(")");
        }
        const s = t.playback();
        return new ParameterListExpression(s, e);
    }
    toObject() {
        const t = {};
        for (const e of this.expressions) t[e.key] = e.value;
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
    static parse(t, e) {
        t.record();
        t.record();
        while (!t.done && !t.startsWith(...et)) t.advance();
        let s = decodeURIComponent(t.playback());
        if (0 === s.length) t.expect("parameter key");
        let i;
        if (t.consumeOptional("=")) {
            t.record();
            while (!t.done && !t.startsWith(...et)) t.advance();
            i = decodeURIComponent(t.playback());
            if (0 === i.length) t.expect("parameter value");
        } else {
            i = s;
            s = e.toString();
        }
        const n = t.playback();
        return new ParameterExpression(n, s, i);
    }
    toString() {
        return this.raw;
    }
}

const nt = Object.freeze({
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

const rt = "default";

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
        if (p(t)) {
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
        if (e.length < s.length) return false;
        if (!this.component.equals(t.component)) return false;
        for (let t = 0, i = s.length; t < i; ++t) if (!e[t].contains(s[t])) return false;
        return true;
    }
    equals(t) {
        const e = this.children;
        const s = t.children;
        if (e.length !== s.length) return false;
        if (!this.component.equals(t.component) || this.viewport !== t.viewport || !m(this.params, t.params)) return false;
        for (let t = 0, i = e.length; t < i; ++t) if (!e[t].equals(s[t])) return false;
        return true;
    }
    clone() {
        return new ViewportInstruction(this.open, this.close, this.recognizedRoute, this.component.clone(), this.viewport, null === this.params ? null : {
            ...this.params
        }, [ ...this.children ]);
    }
    toUrlComponent(t = true) {
        const e = this.component.toUrlComponent();
        const s = null === this.params || 0 === Object.keys(this.params).length ? "" : `(${ot(this.params)})`;
        const i = this.viewport;
        const n = 0 === e.length || null === i || 0 === i.length || i === rt ? "" : `@${i}`;
        const r = `${"(".repeat(this.open)}${e}${s}${n}${")".repeat(this.close)}`;
        const o = t ? this.children.map((t => t.toUrlComponent())).join("+") : "";
        if (r.length > 0) {
            if (o.length > 0) return [ r, o ].join("/");
            return r;
        }
        return o;
    }
    toString() {
        const t = `c:${this.component}`;
        const e = null === this.viewport || 0 === this.viewport.length ? "" : `viewport:${this.viewport}`;
        const s = 0 === this.children.length ? "" : `children:[${this.children.map(String).join(",")}]`;
        const i = [ t, e, s ].filter(Boolean).join(",");
        return `VPI(${i})`;
    }
}

function ot(t) {
    const s = Object.keys(t);
    const i = Array(s.length);
    const n = [];
    const r = [];
    for (const t of s) if (e.isArrayIndex(t)) n.push(Number(t)); else r.push(t);
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

const ht = function() {
    let t = 0;
    const e = new Map;
    return function(s) {
        let i = e.get(s);
        if (void 0 === i) e.set(s, i = ++t);
        return i;
    };
}();

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
        if (!(o instanceof RouteContext) && null != n) o = RouteContext.resolve(n, o);
        const h = null != o;
        if (t instanceof Array) {
            const s = t.length;
            const i = new Array(s);
            const n = new URLSearchParams(r.queryParams ?? e.emptyObject);
            for (let e = 0; e < s; e++) {
                const s = t[e];
                const r = h ? o.generateViewportInstruction(s) : null;
                if (null !== r) {
                    i[e] = r.vi;
                    a(n, r.query, false);
                } else i[e] = ViewportInstruction.create(s);
            }
            return new ViewportInstructionTree(r, false, i, n, r.fragment);
        }
        if ("string" === typeof t) {
            const e = RouteExpression.parse(t, s.useUrlFragmentHash);
            return e.toInstructionTree(r);
        }
        const c = h ? o.generateViewportInstruction(t) : null;
        const u = new URLSearchParams(r.queryParams ?? e.emptyObject);
        return null !== c ? new ViewportInstructionTree(r, false, [ c.vi ], a(u, c.query, false), r.fragment) : new ViewportInstructionTree(r, false, [ ViewportInstruction.create(t) ], u, r.fragment);
    }
    equals(t) {
        const e = this.children;
        const s = t.children;
        if (e.length !== s.length) return false;
        for (let t = 0, i = e.length; t < i; ++t) if (!e[t].equals(s[t])) return false;
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
            s = null !== t && t.length > 0 ? `#${t}` : "";
        }
        let i = this.queryParams.toString();
        i = "" === i ? "" : `?${i}`;
        return `${e}${i}${s}`;
    }
    toPath() {
        return this.children.map((t => t.toUrlComponent())).join("+");
    }
    toString() {
        return `[${this.children.map(String).join(",")}]`;
    }
}

var at;

(function(t) {
    t[t["string"] = 0] = "string";
    t[t["ViewportInstruction"] = 1] = "ViewportInstruction";
    t[t["CustomElementDefinition"] = 2] = "CustomElementDefinition";
    t[t["Promise"] = 3] = "Promise";
    t[t["IRouteViewModel"] = 4] = "IRouteViewModel";
})(at || (at = {}));

class TypedNavigationInstruction {
    constructor(t, e) {
        this.type = t;
        this.value = e;
    }
    static create(e) {
        if (e instanceof TypedNavigationInstruction) return e;
        if ("string" === typeof e) return new TypedNavigationInstruction(0, e);
        if (!t.isObject(e)) d("function/class or object", "", e);
        if ("function" === typeof e) if (s.CustomElement.isType(e)) {
            const t = s.CustomElement.getDefinition(e);
            return new TypedNavigationInstruction(2, t);
        } else return TypedNavigationInstruction.create(e());
        if (e instanceof Promise) return new TypedNavigationInstruction(3, e);
        if (p(e)) {
            const t = ViewportInstruction.create(e);
            return new TypedNavigationInstruction(1, t);
        }
        if (s.isCustomElementViewModel(e)) return new TypedNavigationInstruction(4, e);
        if (e instanceof s.CustomElementDefinition) return new TypedNavigationInstruction(2, e);
        throw new Error(`Invalid component ${r(e)}: must be either a class, a custom element ViewModel, or a (partial) custom element definition`);
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
    clone() {
        return new TypedNavigationInstruction(this.type, this.value);
    }
    toUrlComponent() {
        switch (this.type) {
          case 2:
            return this.value.name;

          case 4:
          case 3:
            return `au$obj${ht(this.value)}`;

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
        this.instance = t;
        this.controller = s;
        this.routeNode = i;
        this.ctx = n;
        this.routerOptions = r;
        this.it = n.container.get(e.ILogger).scopeTo(`ComponentAgent<${n.friendlyPath}>`);
        this.it.trace(`constructor()`);
        const o = s.lifecycleHooks;
        this.nt = (o.canLoad ?? []).map((t => t.instance));
        this.rt = (o.loading ?? []).map((t => t.instance));
        this.ot = (o.canUnload ?? []).map((t => t.instance));
        this.ht = (o.unloading ?? []).map((t => t.instance));
        this.ct = "canLoad" in t;
        this.ut = "loading" in t;
        this.lt = "canUnload" in t;
        this.ft = "unloading" in t;
    }
    T(t, e) {
        if (null === t) {
            this.it.trace(`activate() - initial`);
            return this.controller.activate(this.controller, e);
        }
        this.it.trace(`activate()`);
        void this.controller.activate(t, e);
    }
    L(t, e) {
        if (null === t) {
            this.it.trace(`deactivate() - initial`);
            return this.controller.deactivate(this.controller, e);
        }
        this.it.trace(`deactivate()`);
        void this.controller.deactivate(t, e);
    }
    F() {
        this.it.trace(`dispose()`);
        this.controller.dispose();
    }
    _(t, e, s) {
        this.it.trace(`canUnload(next:%s) - invoking ${this.ot.length} hooks`, e);
        s.push();
        let i = Promise.resolve();
        for (const n of this.ot) {
            s.push();
            i = i.then((() => new Promise((i => {
                if (true !== t.guardsResult) {
                    s.pop();
                    i();
                    return;
                }
                t.run((() => n.canUnload(this.instance, e, this.routeNode)), (e => {
                    if (true === t.guardsResult && true !== e) t.guardsResult = false;
                    s.pop();
                    i();
                }));
            }))));
        }
        if (this.lt) {
            s.push();
            i = i.then((() => {
                if (true !== t.guardsResult) {
                    s.pop();
                    return;
                }
                t.run((() => this.instance.canUnload(e, this.routeNode)), (e => {
                    if (true === t.guardsResult && true !== e) t.guardsResult = false;
                    s.pop();
                }));
            }));
        }
        s.pop();
    }
    B(t, e, s) {
        this.it.trace(`canLoad(next:%s) - invoking ${this.nt.length} hooks`, e);
        const i = this.ctx.root;
        s.push();
        let n = Promise.resolve();
        for (const r of this.nt) {
            s.push();
            n = n.then((() => new Promise((n => {
                if (true !== t.guardsResult) {
                    s.pop();
                    n();
                    return;
                }
                t.run((() => r.canLoad(this.instance, e.params, e, this.routeNode)), (e => {
                    if (true === t.guardsResult && true !== e) t.guardsResult = false === e ? false : ViewportInstructionTree.create(e, this.routerOptions, void 0, i);
                    s.pop();
                    n();
                }));
            }))));
        }
        if (this.ct) {
            s.push();
            n = n.then((() => {
                if (true !== t.guardsResult) {
                    s.pop();
                    return;
                }
                t.run((() => this.instance.canLoad(e.params, e, this.routeNode)), (e => {
                    if (true === t.guardsResult && true !== e) t.guardsResult = false === e ? false : ViewportInstructionTree.create(e, this.routerOptions, void 0, i);
                    s.pop();
                }));
            }));
        }
        s.pop();
    }
    M(t, e, s) {
        this.it.trace(`unloading(next:%s) - invoking ${this.ht.length} hooks`, e);
        s.push();
        for (const i of this.ht) t.run((() => {
            s.push();
            return i.unloading(this.instance, e, this.routeNode);
        }), (() => {
            s.pop();
        }));
        if (this.ft) t.run((() => {
            s.push();
            return this.instance.unloading(e, this.routeNode);
        }), (() => {
            s.pop();
        }));
        s.pop();
    }
    q(t, e, s) {
        this.it.trace(`loading(next:%s) - invoking ${this.rt.length} hooks`, e);
        s.push();
        for (const i of this.rt) t.run((() => {
            s.push();
            return i.loading(this.instance, e.params, e, this.routeNode);
        }), (() => {
            s.pop();
        }));
        if (this.ut) t.run((() => {
            s.push();
            return this.instance.loading(e.params, e, this.routeNode);
        }), (() => {
            s.pop();
        }));
        s.pop();
    }
}

const ct = e.DI.createInterface("IRouteContext");

const ut = Object.freeze([ "string", "object", "function" ]);

function lt(t) {
    if (null == t) return false;
    const e = t.params;
    const s = t.component;
    return "object" === typeof e && null !== e && null != s && ut.includes(typeof s) && !(s instanceof Promise);
}

class RouteContext {
    get isRoot() {
        return null === this.parent;
    }
    get depth() {
        return this.path.length - 1;
    }
    get resolved() {
        return this.dt;
    }
    get allResolved() {
        return this.gt;
    }
    get node() {
        const t = this.wt;
        if (null === t) throw new Error(`Invariant violation: RouteNode should be set immediately after the RouteContext is created. Context: ${this}`);
        return t;
    }
    set node(t) {
        const e = this.prevNode = this.wt;
        if (e !== t) {
            this.wt = t;
            this.logger.trace(`Node changed from %s to %s`, this.prevNode, t);
        }
    }
    get vpa() {
        const t = this.vt;
        if (null === t) throw new Error(`RouteContext has no ViewportAgent: ${this}`);
        return t;
    }
    get navigationModel() {
        return this.xt;
    }
    constructor(t, n, r, o, h, a) {
        this.parent = n;
        this.component = r;
        this.config = o;
        this.$t = a;
        this.childViewportAgents = [];
        this.childRoutes = [];
        this.dt = null;
        this.gt = null;
        this.prevNode = null;
        this.wt = null;
        this.Et = false;
        this.vt = t;
        if (null === n) {
            this.root = this;
            this.path = [ this ];
            this.friendlyPath = r.name;
        } else {
            this.root = n.root;
            this.path = [ ...n.path, this ];
            this.friendlyPath = `${n.friendlyPath}/${r.name}`;
        }
        this.logger = h.get(e.ILogger).scopeTo(`RouteContext<${this.friendlyPath}>`);
        this.logger.trace("constructor()");
        this.moduleLoader = h.get(e.IModuleLoader);
        const c = this.container = h.createChild();
        c.registerResolver(s.IController, this.hostControllerProvider = new e.InstanceProvider, true);
        c.registerResolver(ct, new e.InstanceProvider("IRouteContext", this));
        c.register(o);
        this.bt = new i.RouteRecognizer;
        if (a.options.useNavigationModel) {
            const t = this.xt = new NavigationModel([]);
            c.get(R).subscribe("au:router:navigation-end", (() => t.setIsActive(a, this)));
        } else this.xt = null;
        this.yt(o);
    }
    yt(t) {
        const s = [];
        const i = [];
        const n = t.routes ?? A;
        const r = n.length;
        if (0 === r) {
            const e = t.component.prototype?.getRouteConfig;
            this.Et = null == e ? true : "function" !== typeof e;
            return;
        }
        const h = this.xt;
        const a = null !== h;
        let c = 0;
        for (;c < r; c++) {
            const r = n[c];
            if (r instanceof Promise) {
                const t = this.addRoute(r);
                s.push(t);
                i.push(t);
            } else {
                const s = L(r, true, t, null, this);
                if (s instanceof Promise) {
                    if (!l(r) || null == r.path) throw new Error(`Invalid route config. When the component property is a lazy import, the path must be specified.`);
                    for (const t of o(r.path)) this.$addRoute(t, r.caseSensitive ?? false, s);
                    const t = this.childRoutes.length;
                    const n = s.then((e => this.childRoutes[t] = e));
                    this.childRoutes.push(n);
                    if (a) h.addRoute(n);
                    i.push(n.then(e.noop));
                } else {
                    for (const t of s.path ?? e.emptyArray) this.$addRoute(t, s.caseSensitive, s);
                    this.childRoutes.push(s);
                    if (a) h.addRoute(s);
                }
            }
        }
        this.Et = true;
        if (s.length > 0) this.dt = Promise.all(s).then((() => {
            this.dt = null;
        }));
        if (i.length > 0) this.gt = Promise.all(i).then((() => {
            this.gt = null;
        }));
    }
    static setRoot(t) {
        const i = t.get(e.ILogger).scopeTo("RouteContext");
        if (!t.has(s.IAppRoot, true)) pt(new Error(`The provided container has no registered IAppRoot. RouteContext.setRoot can only be used after Aurelia.app was called, on a container that is within that app's component tree.`), i);
        if (t.has(ct, true)) pt(new Error(`A root RouteContext is already registered. A possible cause is the RouterConfiguration being registered more than once in the same container tree. If you have a multi-rooted app, make sure you register RouterConfiguration only in the "forked" containers and not in the common root.`), i);
        const {controller: n} = t.get(s.IAppRoot);
        if (void 0 === n) pt(new Error(`The provided IAppRoot does not (yet) have a controller. A possible cause is calling this API manually before Aurelia.start() is called`), i);
        const r = t.get(X);
        return e.onResolve(r.getRouteContext(null, n.definition, n.viewModel, n.container, null, null, null), (s => {
            t.register(e.Registration.instance(ct, s));
            s.node = r.routeTree.root;
        }));
    }
    static resolve(t, i) {
        const n = t.container;
        const r = n.get(e.ILogger).scopeTo("RouteContext");
        if (null === i || void 0 === i) {
            r.trace(`resolve(context:%s) - returning root RouteContext`, i);
            return t;
        }
        if (ft(i)) {
            r.trace(`resolve(context:%s) - returning provided RouteContext`, i);
            return i;
        }
        if (i instanceof n.get(s.IPlatform).Node) try {
            const t = s.CustomElement.for(i, {
                searchParents: true
            });
            r.trace(`resolve(context:Node(nodeName:'${i.nodeName}'),controller:'${t.definition.name}') - resolving RouteContext from controller's RenderContext`);
            return t.container.get(ct);
        } catch (t) {
            r.error(`Failed to resolve RouteContext from Node(nodeName:'${i.nodeName}')`, t);
            throw t;
        }
        if (s.isCustomElementViewModel(i)) {
            const t = i.$controller;
            r.trace(`resolve(context:CustomElementViewModel(name:'${t.definition.name}')) - resolving RouteContext from controller's RenderContext`);
            return t.container.get(ct);
        }
        if (s.isCustomElementController(i)) {
            const t = i;
            r.trace(`resolve(context:CustomElementController(name:'${t.definition.name}')) - resolving RouteContext from controller's RenderContext`);
            return t.container.get(ct);
        }
        pt(new Error(`Invalid context type: ${Object.prototype.toString.call(i)}`), r);
    }
    dispose() {
        this.container.dispose();
    }
    resolveViewportAgent(t) {
        this.logger.trace(`resolveViewportAgent(req:%s)`, t);
        const e = this.childViewportAgents.find((e => e.O(t)));
        if (void 0 === e) throw new Error(`Failed to resolve ${t} at:\n${this.printTree()}`);
        return e;
    }
    getAvailableViewportAgents() {
        return this.childViewportAgents.filter((t => t.j()));
    }
    getFallbackViewportAgent(t) {
        return this.childViewportAgents.find((e => e.j() && e.viewport.name === t && "" !== e.viewport.fallback)) ?? null;
    }
    createComponentAgent(t, i) {
        this.logger.trace(`createComponentAgent(routeNode:%s)`, i);
        this.hostControllerProvider.prepare(t);
        const n = this.container;
        const r = n.get(i.component.key);
        const o = this.Et ? void 0 : e.onResolve(L(r, false, this.config, i, null), (t => this.yt(t)));
        return e.onResolve(o, (() => {
            const e = s.Controller.$el(n, r, t.host, null);
            const o = new ComponentAgent(r, e, i, this, this.$t.options);
            this.hostControllerProvider.dispose();
            return o;
        }));
    }
    registerViewport(t) {
        const e = ViewportAgent.for(t, this);
        if (this.childViewportAgents.includes(e)) this.logger.trace(`registerViewport(agent:%s) -> already registered, so skipping`, e); else {
            this.logger.trace(`registerViewport(agent:%s) -> adding`, e);
            this.childViewportAgents.push(e);
        }
        return e;
    }
    unregisterViewport(t) {
        const e = ViewportAgent.for(t, this);
        if (this.childViewportAgents.includes(e)) {
            this.logger.trace(`unregisterViewport(agent:%s) -> unregistering`, e);
            this.childViewportAgents.splice(this.childViewportAgents.indexOf(e), 1);
        } else this.logger.trace(`unregisterViewport(agent:%s) -> not registered, so skipping`, e);
    }
    recognize(t, e = false) {
        this.logger.trace(`recognize(path:'${t}')`);
        let s = this;
        let n = true;
        let r = null;
        while (n) {
            r = s.bt.recognize(t);
            if (null === r) {
                if (!e || s.isRoot) return null;
                s = s.parent;
            } else n = false;
        }
        return new $RecognizedRoute(r, Reflect.has(r.params, i.RESIDUE) ? r.params[i.RESIDUE] ?? null : null);
    }
    addRoute(t) {
        this.logger.trace(`addRoute(routeable:'${t}')`);
        return e.onResolve(L(t, true, this.config, null, this), (t => {
            for (const s of t.path ?? e.emptyArray) this.$addRoute(s, t.caseSensitive, t);
            this.xt?.addRoute(t);
            this.childRoutes.push(t);
        }));
    }
    $addRoute(t, e, s) {
        this.bt.add({
            path: t,
            caseSensitive: e,
            handler: s
        }, true);
    }
    resolveLazy(t) {
        return this.moduleLoader.load(t, (s => {
            const i = s.raw;
            if ("function" === typeof i) {
                const t = e.Protocol.resource.getAll(i).find(dt);
                if (void 0 !== t) return t;
            }
            let n;
            let r;
            for (const t of s.items) if (t.isConstructable) {
                const e = t.definitions.find(dt);
                if (void 0 !== e) if ("default" === t.key) n = e; else if (void 0 === r) r = e;
            }
            if (void 0 === n) {
                if (void 0 === r) throw new Error(`${t} does not appear to be a component or CustomElement recognizable by Aurelia`);
                return r;
            }
            return n;
        }));
    }
    generateViewportInstruction(t) {
        if (!lt(t)) return null;
        const e = t.component;
        let s;
        let n = false;
        if (e instanceof RouteConfig) {
            s = e.path;
            n = true;
        } else if ("string" === typeof e) {
            const t = this.childRoutes.find((t => t.id === e));
            if (void 0 === t) return null;
            s = t.path;
        } else if (0 === e.type) {
            const t = this.childRoutes.find((t => t.id === e.value));
            if (void 0 === t) return null;
            s = t.path;
        } else {
            const t = O(e, this)[1];
            s = this.childRoutes.reduce(((e, s) => {
                if (s.component === t.Type) e.push(...s.path);
                return e;
            }), []);
            n = true;
        }
        if (void 0 === s) return null;
        const r = t.params;
        const o = this.bt;
        const h = s.length;
        const a = [];
        let c = null;
        if (1 === h) {
            const e = l(s[0]);
            if (null === e) {
                const e = `Unable to eagerly generate path for ${t}. Reasons: ${a}.`;
                if (n) throw new Error(e);
                this.logger.debug(e);
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
        for (let t = 0; t < h; t++) {
            const e = l(s[t]);
            if (null === e) continue;
            if (null === c) {
                c = e;
                u = Object.keys(e.consumed).length;
            } else if (Object.keys(e.consumed).length > u) c = e;
        }
        if (null === c) {
            const e = `Unable to eagerly generate path for ${t}. Reasons: ${a}.`;
            if (n) throw new Error(e);
            this.logger.debug(e);
            return null;
        }
        return {
            vi: ViewportInstruction.create({
                recognizedRoute: new $RecognizedRoute(new i.RecognizedRoute(c.endpoint, c.consumed), null),
                component: c.path,
                children: t.children,
                viewport: t.viewport,
                open: t.open,
                close: t.close
            }),
            query: c.query
        };
        function l(t) {
            const e = o.getEndpoint(t);
            if (null === e) {
                a.push(`No endpoint found for the path: '${t}'.`);
                return null;
            }
            const s = Object.create(null);
            for (const i of e.params) {
                const e = i.name;
                let n = r[e];
                if (null == n || 0 === String(n).length) {
                    if (!i.isOptional) {
                        a.push(`No value for the required parameter '${e}' is provided for the path: '${t}'.`);
                        return null;
                    }
                    n = "";
                } else s[e] = n;
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
        const t = this.childViewportAgents;
        const e = t.map(String).join(",");
        return `RC(path:'${this.friendlyPath}',viewports:[${e}])`;
    }
    printTree() {
        const t = [];
        for (let e = 0; e < this.path.length; ++e) t.push(`${" ".repeat(e)}${this.path[e]}`);
        return t.join("\n");
    }
}

function ft(t) {
    return t instanceof RouteContext;
}

function pt(t, e) {
    e.error(t);
    throw t;
}

function dt(t) {
    return s.CustomElement.isType(t.Type);
}

class $RecognizedRoute {
    constructor(t, e) {
        this.route = t;
        this.residue = e;
    }
    toString() {
        const t = this.route;
        const e = t.endpoint.route;
        return `RR(route:(endpoint:(route:(path:${e.path},handler:${e.handler})),params:${JSON.stringify(t.params)}),residue:${this.residue})`;
    }
}

e.DI.createInterface("INavigationModel");

class NavigationModel {
    constructor(t) {
        this.routes = t;
        this.Rt = void 0;
    }
    resolve() {
        return e.onResolve(this.Rt, e.noop);
    }
    setIsActive(t, s) {
        void e.onResolve(this.Rt, (() => {
            for (const e of this.routes) e.setIsActive(t, s);
        }));
    }
    addRoute(t) {
        const s = this.routes;
        if (!(t instanceof Promise)) {
            if (t.nav ?? false) s.push(NavigationRoute.create(t));
            return;
        }
        const i = s.length;
        s.push(void 0);
        let n;
        n = this.Rt = e.onResolve(this.Rt, (() => e.onResolve(t, (t => {
            if (t.nav) s[i] = NavigationRoute.create(t); else s.splice(i, 1);
            if (this.Rt === n) this.Rt = void 0;
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
        this.kt = null;
    }
    static create(t) {
        return new NavigationRoute(t.id, o(t.path ?? e.emptyArray), t.redirectTo, t.title, t.data);
    }
    get isActive() {
        return this.St;
    }
    setIsActive(t, s) {
        let n = this.kt;
        if (null === n) {
            const r = t.options;
            n = this.kt = this.path.map((t => {
                const n = s.bt.getEndpoint(t);
                if (null === n) throw new Error(`No endpoint found for path '${t}'`);
                return new ViewportInstructionTree(NavigationOptions.create(r, {
                    context: s
                }), false, [ ViewportInstruction.create({
                    recognizedRoute: new $RecognizedRoute(new i.RecognizedRoute(n, e.emptyObject), null),
                    component: t
                }) ], Z, null);
            }));
        }
        this.St = n.some((e => t.routeTree.contains(e, true)));
    }
}

exports.ViewportCustomElement = class ViewportCustomElement {
    constructor(t, e) {
        this.logger = t;
        this.ctx = e;
        this.name = rt;
        this.usedBy = "";
        this.default = "";
        this.fallback = "";
        this.agent = void 0;
        this.controller = void 0;
        this.logger = t.scopeTo(`au-viewport<${e.friendlyPath}>`);
        this.logger.trace("constructor()");
    }
    N(t, e, i) {
        const n = this.fallback;
        return "function" === typeof n && !s.CustomElement.isType(n) ? n(t, e, i) : n;
    }
    hydrated(t) {
        this.logger.trace("hydrated()");
        this.controller = t;
        this.agent = this.ctx.registerViewport(this);
    }
    attaching(t, e) {
        this.logger.trace("attaching()");
        return this.agent.A(t, this.controller);
    }
    detaching(t, e) {
        this.logger.trace("detaching()");
        return this.agent.U(t, this.controller);
    }
    dispose() {
        this.logger.trace("dispose()");
        this.ctx.unregisterViewport(this);
        this.agent.F();
        this.agent = void 0;
    }
    toString() {
        const t = [];
        for (const e of gt) {
            const s = this[e];
            switch (typeof s) {
              case "string":
                if ("" !== s) t.push(`${e}:'${s}'`);
                break;

              case "boolean":
                if (s) t.push(`${e}:${s}`);
                break;

              default:
                t.push(`${e}:${String(s)}`);
            }
        }
        return `VP(ctx:'${this.ctx.friendlyPath}',${t.join(",")})`;
    }
};

E([ s.bindable ], exports.ViewportCustomElement.prototype, "name", void 0);

E([ s.bindable ], exports.ViewportCustomElement.prototype, "usedBy", void 0);

E([ s.bindable ], exports.ViewportCustomElement.prototype, "default", void 0);

E([ s.bindable ], exports.ViewportCustomElement.prototype, "fallback", void 0);

exports.ViewportCustomElement = E([ s.customElement({
    name: "au-viewport"
}), b(0, e.ILogger), b(1, ct) ], exports.ViewportCustomElement);

const gt = [ "name", "usedBy", "default", "fallback" ];

exports.LoadCustomAttribute = class LoadCustomAttribute {
    constructor(t, e, s, i, n, r) {
        this.target = t;
        this.el = e;
        this.router = s;
        this.events = i;
        this.ctx = n;
        this.locationMgr = r;
        this.attribute = "href";
        this.active = false;
        this.href = null;
        this.instructions = null;
        this.navigationEndListener = null;
        this.onClick = t => {
            if (null === this.instructions) return;
            if (t.altKey || t.ctrlKey || t.shiftKey || t.metaKey || 0 !== t.button) return;
            t.preventDefault();
            void this.router.load(this.instructions, {
                context: this.context
            });
        };
        this.isEnabled = !e.hasAttribute("external") && !e.hasAttribute("data-external");
    }
    binding() {
        if (this.isEnabled) this.el.addEventListener("click", this.onClick);
        this.valueChanged();
        this.navigationEndListener = this.events.subscribe("au:router:navigation-end", (t => {
            this.valueChanged();
            this.active = null !== this.instructions && this.router.isActive(this.instructions, this.context);
        }));
    }
    attaching() {
        const t = this.context;
        const e = t.allResolved;
        if (null !== e) return e.then((() => {
            this.valueChanged();
        }));
    }
    unbinding() {
        if (this.isEnabled) this.el.removeEventListener("click", this.onClick);
        this.navigationEndListener.dispose();
    }
    valueChanged() {
        const t = this.router;
        const e = t.options.useUrlFragmentHash;
        const i = this.route;
        let n = this.context;
        if (void 0 === n) n = this.context = this.ctx; else if (null === n) n = this.context = this.ctx.root;
        if (null != i && null === n.allResolved) {
            const s = this.params;
            const r = this.instructions = t.createViewportInstructions("object" === typeof s && null !== s ? {
                component: i,
                params: s
            } : i, {
                context: n
            });
            this.href = r.toUrl(e);
        } else {
            this.instructions = null;
            this.href = null;
        }
        const r = s.CustomElement.for(this.el, {
            optional: true
        });
        if (null !== r) r.viewModel[this.attribute] = this.instructions; else if (null === this.href) this.el.removeAttribute(this.attribute); else {
            const t = e ? this.href : this.locationMgr.addBaseHref(this.href);
            this.el.setAttribute(this.attribute, t);
        }
    }
};

E([ s.bindable({
    mode: 2,
    primary: true,
    callback: "valueChanged"
}) ], exports.LoadCustomAttribute.prototype, "route", void 0);

E([ s.bindable({
    mode: 2,
    callback: "valueChanged"
}) ], exports.LoadCustomAttribute.prototype, "params", void 0);

E([ s.bindable({
    mode: 2
}) ], exports.LoadCustomAttribute.prototype, "attribute", void 0);

E([ s.bindable({
    mode: 4
}) ], exports.LoadCustomAttribute.prototype, "active", void 0);

E([ s.bindable({
    mode: 2,
    callback: "valueChanged"
}) ], exports.LoadCustomAttribute.prototype, "context", void 0);

exports.LoadCustomAttribute = E([ s.customAttribute("load"), b(0, s.IEventTarget), b(1, s.INode), b(2, X), b(3, R), b(4, ct), b(5, C) ], exports.LoadCustomAttribute);

exports.HrefCustomAttribute = class HrefCustomAttribute {
    get isExternal() {
        return this.el.hasAttribute("external") || this.el.hasAttribute("data-external");
    }
    constructor(t, e, s, i, n) {
        this.target = t;
        this.el = e;
        this.router = s;
        this.ctx = i;
        this.isInitialized = false;
        if (s.options.useHref && "A" === e.nodeName) switch (e.getAttribute("target")) {
          case null:
          case n.name:
          case "_self":
            this.isEnabled = true;
            break;

          default:
            this.isEnabled = false;
            break;
        } else this.isEnabled = false;
    }
    binding() {
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.isEnabled = this.isEnabled && null === s.getRef(this.el, s.CustomAttribute.getDefinition(exports.LoadCustomAttribute).key);
        }
        this.valueChanged(this.value);
        this.el.addEventListener("click", this);
    }
    unbinding() {
        this.el.removeEventListener("click", this);
    }
    valueChanged(t) {
        if (null == t) this.el.removeAttribute("href"); else {
            if (this.router.options.useUrlFragmentHash && this.ctx.isRoot && !/^[.#]/.test(t)) t = `#${t}`;
            this.el.setAttribute("href", t);
        }
    }
    handleEvent(t) {
        this.Ct(t);
    }
    Ct(t) {
        if (t.altKey || t.ctrlKey || t.shiftKey || t.metaKey || 0 !== t.button || this.isExternal || !this.isEnabled) return;
        const e = this.el.getAttribute("href");
        if (null !== e) {
            t.preventDefault();
            void this.router.load(e, {
                context: this.ctx
            });
        }
    }
};

E([ s.bindable({
    mode: 2
}) ], exports.HrefCustomAttribute.prototype, "value", void 0);

exports.HrefCustomAttribute = E([ s.customAttribute({
    name: "href",
    noMultiBindings: true
}), b(0, s.IEventTarget), b(1, s.INode), b(2, X), b(3, ct), b(4, s.IWindow) ], exports.HrefCustomAttribute);

const wt = X;

const vt = [ wt ];

const mt = exports.ViewportCustomElement;

const xt = exports.LoadCustomAttribute;

const $t = exports.HrefCustomAttribute;

const Et = [ exports.ViewportCustomElement, exports.LoadCustomAttribute, exports.HrefCustomAttribute ];

function bt(i, n) {
    let r = null;
    if (t.isObject(n)) r = n.basePath ?? null; else n = {};
    const o = RouterOptions.create(n);
    return i.register(e.Registration.cachedCallback(S, ((t, e, i) => {
        const n = t.get(s.IWindow);
        const o = new URL(n.document.baseURI);
        o.pathname = N(r ?? o.pathname);
        return o;
    })), e.Registration.instance($, o), s.AppTask.hydrated(e.IContainer, RouteContext.setRoot), s.AppTask.activated(X, (t => t.start(true))), s.AppTask.deactivated(X, (t => {
        t.stop();
    })), ...vt, ...Et);
}

const yt = {
    register(t) {
        return bt(t);
    },
    customize(t) {
        return {
            register(e) {
                return bt(e, t);
            }
        };
    }
};

class ScrollState {
    constructor(t) {
        this.el = t;
        this.top = t.scrollTop;
        this.left = t.scrollLeft;
    }
    static has(t) {
        return t.scrollTop > 0 || t.scrollLeft > 0;
    }
    restore() {
        this.el.scrollTo(this.left, this.top);
        this.el = null;
    }
}

function Rt(t) {
    t.restore();
}

class HostElementState {
    constructor(t) {
        this.scrollStates = [];
        this.save(t.children);
    }
    save(t) {
        let e;
        for (let s = 0, i = t.length; s < i; ++s) {
            e = t[s];
            if (ScrollState.has(e)) this.scrollStates.push(new ScrollState(e));
            this.save(e.children);
        }
    }
    restore() {
        this.scrollStates.forEach(Rt);
        this.scrollStates = null;
    }
}

const kt = e.DI.createInterface("IStateManager", (t => t.singleton(ScrollStateManager)));

class ScrollStateManager {
    constructor() {
        this.cache = new WeakMap;
    }
    saveState(t) {
        this.cache.set(t.host, new HostElementState(t.host));
    }
    restoreState(t) {
        const e = this.cache.get(t.host);
        if (void 0 !== e) {
            e.restore();
            this.cache.delete(t.host);
        }
    }
}

exports.AST = nt;

exports.ActionExpression = ActionExpression;

exports.AuNavId = y;

exports.ComponentAgent = ComponentAgent;

exports.ComponentExpression = ComponentExpression;

exports.CompositeSegmentExpression = CompositeSegmentExpression;

exports.DefaultComponents = vt;

exports.DefaultResources = Et;

exports.HrefCustomAttributeRegistration = $t;

exports.ILocationManager = C;

exports.IRouteContext = ct;

exports.IRouter = X;

exports.IRouterEvents = R;

exports.IRouterOptions = $;

exports.IStateManager = kt;

exports.LoadCustomAttributeRegistration = xt;

exports.LocationChangeEvent = LocationChangeEvent;

exports.NavigationCancelEvent = NavigationCancelEvent;

exports.NavigationEndEvent = NavigationEndEvent;

exports.NavigationErrorEvent = NavigationErrorEvent;

exports.NavigationOptions = NavigationOptions;

exports.NavigationStartEvent = NavigationStartEvent;

exports.ParameterExpression = ParameterExpression;

exports.ParameterListExpression = ParameterListExpression;

exports.Route = P;

exports.RouteConfig = RouteConfig;

exports.RouteContext = RouteContext;

exports.RouteExpression = RouteExpression;

exports.RouteNode = RouteNode;

exports.RouteTree = RouteTree;

exports.RouterConfiguration = yt;

exports.RouterOptions = RouterOptions;

exports.RouterRegistration = wt;

exports.ScopedSegmentExpression = ScopedSegmentExpression;

exports.SegmentExpression = SegmentExpression;

exports.SegmentGroupExpression = SegmentGroupExpression;

exports.Transition = Transition;

exports.ViewportAgent = ViewportAgent;

exports.ViewportCustomElementRegistration = mt;

exports.ViewportExpression = ViewportExpression;

exports.isManagedState = K;

exports.route = U;

exports.toManagedState = Q;
//# sourceMappingURL=index.cjs.map
