import { Metadata as t, isObject as e } from "@aurelia/metadata";

import { DI as i, IEventAggregator as s, ILogger as n, Protocol as r, emptyArray as o, onResolve as h, resolveAll as a, emptyObject as c, IContainer as u, isArrayIndex as l, IModuleLoader as f, InstanceProvider as d, noop as p, Registration as g } from "@aurelia/kernel";

import { isCustomElementViewModel as w, IHistory as v, ILocation as m, IWindow as $, CustomElement as x, Controller as E, IPlatform as b, CustomElementDefinition as y, IController as R, IAppRoot as k, isCustomElementController as S, customElement as C, bindable as I, customAttribute as N, IEventTarget as V, INode as A, getRef as T, CustomAttribute as P, AppTask as U } from "@aurelia/runtime-html";

import { RecognizedRoute as L, Endpoint as O, ConfigurableRoute as j, RESIDUE as _, RouteRecognizer as B } from "@aurelia/route-recognizer";

class Batch {
    constructor(t, e, i) {
        this.stack = t;
        this.cb = e;
        this.done = false;
        this.next = null;
        this.head = i ?? this;
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

function M(t, e) {
    t = t.slice();
    e = e.slice();
    const i = [];
    while (t.length > 0) {
        const s = t.shift();
        const n = s.context.vpa;
        if (i.every((t => t.context.vpa !== n))) {
            const t = e.findIndex((t => t.context.vpa === n));
            if (t >= 0) i.push(...e.splice(0, t + 1)); else i.push(s);
        }
    }
    i.push(...e);
    return i;
}

function z(t) {
    try {
        return JSON.stringify(t);
    } catch {
        return Object.prototype.toString.call(t);
    }
}

function q(t) {
    return "string" === typeof t ? [ t ] : t;
}

function F(t) {
    return "string" === typeof t ? t : t[0];
}

function D(t, e, i) {
    const s = i ? new URLSearchParams(t) : t;
    if (null == e) return s;
    for (const [t, i] of Object.entries(e)) s.append(t, i);
    return s;
}

function H(t) {
    return "object" === typeof t && null !== t && !w(t);
}

function W(t) {
    return H(t) && true === Object.prototype.hasOwnProperty.call(t, "name");
}

function G(t) {
    return H(t) && true === Object.prototype.hasOwnProperty.call(t, "component");
}

function Y(t) {
    return H(t) && true === Object.prototype.hasOwnProperty.call(t, "redirectTo");
}

function J(t) {
    return H(t) && true === Object.prototype.hasOwnProperty.call(t, "component");
}

function Z(t, e, i) {
    throw new Error(`Invalid route config property: "${e}". Expected ${t}, but got ${z(i)}.`);
}

function K(t, e) {
    if (null === t || void 0 === t) throw new Error(`Invalid route config: expected an object or string, but got: ${String(t)}.`);
    const i = Object.keys(t);
    for (const s of i) {
        const i = t[s];
        const n = [ e, s ].join(".");
        switch (s) {
          case "id":
          case "viewport":
          case "redirectTo":
            if ("string" !== typeof i) Z("string", n, i);
            break;

          case "caseSensitive":
          case "nav":
            if ("boolean" !== typeof i) Z("boolean", n, i);
            break;

          case "data":
            if ("object" !== typeof i || null === i) Z("object", n, i);
            break;

          case "title":
            switch (typeof i) {
              case "string":
              case "function":
                break;

              default:
                Z("string or function", n, i);
            }
            break;

          case "path":
            if (i instanceof Array) {
                for (let t = 0; t < i.length; ++t) if ("string" !== typeof i[t]) Z("string", `${n}[${t}]`, i[t]);
            } else if ("string" !== typeof i) Z("string or Array of strings", n, i);
            break;

          case "component":
            X(i, n);
            break;

          case "routes":
            if (!(i instanceof Array)) Z("Array", n, i);
            for (const t of i) {
                const e = `${n}[${i.indexOf(t)}]`;
                X(t, e);
            }
            break;

          case "transitionPlan":
            switch (typeof i) {
              case "string":
                switch (i) {
                  case "none":
                  case "replace":
                  case "invoke-lifecycles":
                    break;

                  default:
                    Z("string('none'|'replace'|'invoke-lifecycles') or function", n, i);
                }
                break;

              case "function":
                break;

              default:
                Z("string('none'|'replace'|'invoke-lifecycles') or function", n, i);
            }
            break;

          case "fallback":
            switch (typeof i) {
              case "string":
              case "function":
                break;

              default:
                Z("string or function", n, i);
            }
            break;

          default:
            throw new Error(`Unknown route config property: "${e}.${s}". Please specify known properties only.`);
        }
    }
}

function Q(t, e) {
    if (null === t || void 0 === t) throw new Error(`Invalid route config: expected an object or string, but got: ${String(t)}.`);
    const i = Object.keys(t);
    for (const s of i) {
        const i = t[s];
        const n = [ e, s ].join(".");
        switch (s) {
          case "path":
            if (i instanceof Array) {
                for (let t = 0; t < i.length; ++t) if ("string" !== typeof i[t]) Z("string", `${n}[${t}]`, i[t]);
            } else if ("string" !== typeof i) Z("string or Array of strings", n, i);
            break;

          case "redirectTo":
            if ("string" !== typeof i) Z("string", n, i);
            break;

          default:
            throw new Error(`Unknown redirect config property: "${e}.${s}". Only 'path' and 'redirectTo' should be specified for redirects.`);
        }
    }
}

function X(t, e) {
    switch (typeof t) {
      case "function":
        break;

      case "object":
        if (t instanceof Promise) break;
        if (Y(t)) {
            Q(t, e);
            break;
        }
        if (G(t)) {
            K(t, e);
            break;
        }
        if (!w(t) && !W(t)) Z(`an object with at least a 'component' property (see Routeable)`, e, t);
        break;

      case "string":
        break;

      default:
        Z("function, object or string (see Routeable)", e, t);
    }
}

function tt(t, e) {
    if (t === e) return true;
    if (typeof t !== typeof e) return false;
    if (null === t || null === e) return false;
    if (Object.getPrototypeOf(t) !== Object.getPrototypeOf(e)) return false;
    const i = Object.keys(t);
    const s = Object.keys(e);
    if (i.length !== s.length) return false;
    for (let n = 0, r = i.length; n < r; ++n) {
        const r = i[n];
        if (r !== s[n]) return false;
        if (t[r] !== e[r]) return false;
    }
    return true;
}

function et(t, e) {
    if ("function" === typeof e) return e(t);
    return e;
}

const it = i.createInterface("RouterOptions");

class RouterOptions {
    constructor(t, e, i, s, n) {
        this.useUrlFragmentHash = t;
        this.useHref = e;
        this.historyStrategy = i;
        this.buildTitle = s;
        this.useNavigationModel = n;
    }
    static create(t) {
        return new RouterOptions(t.useUrlFragmentHash ?? false, t.useHref ?? true, t.historyStrategy ?? "push", t.buildTitle ?? null, t.useNavigationModel ?? true);
    }
    t() {
        return [ [ "historyStrategy", "history" ] ].map((([t, e]) => {
            const i = this[t];
            return `${e}:${"function" === typeof i ? i : `'${i}'`}`;
        })).join(",");
    }
    toString() {
        return `RO(${this.t()})`;
    }
}

class NavigationOptions {
    constructor(t, e, i, s, n, r, o) {
        this.historyStrategy = t;
        this.title = e;
        this.titleSeparator = i;
        this.context = s;
        this.queryParams = n;
        this.fragment = r;
        this.state = o;
    }
    static create(t, e) {
        return new NavigationOptions(e.historyStrategy ?? t.historyStrategy, e.title ?? null, e.titleSeparator ?? " | ", e.context ?? null, e.queryParams ?? null, e.fragment ?? "", e.state ?? null);
    }
    clone() {
        return new NavigationOptions(this.historyStrategy, this.title, this.titleSeparator, this.context, {
            ...this.queryParams
        }, this.fragment, null === this.state ? null : {
            ...this.state
        });
    }
    i(t) {
        return et(t, this.historyStrategy);
    }
}

function st(t, e, i, s) {
    var n = arguments.length, r = n < 3 ? e : null === s ? s = Object.getOwnPropertyDescriptor(e, i) : s, o;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(t, e, i, s); else for (var h = t.length - 1; h >= 0; h--) if (o = t[h]) r = (n < 3 ? o(r) : n > 3 ? o(e, i, r) : o(e, i)) || r;
    return n > 3 && r && Object.defineProperty(e, i, r), r;
}

function nt(t, e) {
    return function(i, s) {
        e(i, s, t);
    };
}

const rt = "au-nav-id";

class Subscription {
    constructor(t, e, i) {
        this.events = t;
        this.serial = e;
        this.inner = i;
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

const ot = i.createInterface("IRouterEvents", (t => t.singleton(ht)));

let ht = class RouterEvents {
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
        const i = new Subscription(this, ++this.subscriptionSerial, this.ea.subscribe(t, (s => {
            this.logger.trace(`handling %s for subscription #${i.serial}`, t);
            e(s);
        })));
        this.subscriptions.push(i);
        return i;
    }
};

ht = st([ nt(0, s), nt(1, n) ], ht);

class LocationChangeEvent {
    get name() {
        return "au:router:location-change";
    }
    constructor(t, e, i, s) {
        this.id = t;
        this.url = e;
        this.trigger = i;
        this.state = s;
    }
    toString() {
        return `LocationChangeEvent(id:${this.id},url:'${this.url}',trigger:'${this.trigger}')`;
    }
}

class NavigationStartEvent {
    get name() {
        return "au:router:navigation-start";
    }
    constructor(t, e, i, s) {
        this.id = t;
        this.instructions = e;
        this.trigger = i;
        this.managedState = s;
    }
    toString() {
        return `NavigationStartEvent(id:${this.id},instructions:'${this.instructions}',trigger:'${this.trigger}')`;
    }
}

class NavigationEndEvent {
    get name() {
        return "au:router:navigation-end";
    }
    constructor(t, e, i) {
        this.id = t;
        this.instructions = e;
        this.finalInstructions = i;
    }
    toString() {
        return `NavigationEndEvent(id:${this.id},instructions:'${this.instructions}',finalInstructions:'${this.finalInstructions}')`;
    }
}

class NavigationCancelEvent {
    get name() {
        return "au:router:navigation-cancel";
    }
    constructor(t, e, i) {
        this.id = t;
        this.instructions = e;
        this.reason = i;
    }
    toString() {
        return `NavigationCancelEvent(id:${this.id},instructions:'${this.instructions}',reason:${String(this.reason)})`;
    }
}

class NavigationErrorEvent {
    get name() {
        return "au:router:navigation-error";
    }
    constructor(t, e, i) {
        this.id = t;
        this.instructions = e;
        this.error = i;
    }
    toString() {
        return `NavigationErrorEvent(id:${this.id},instructions:'${this.instructions}',error:${String(this.error)})`;
    }
}

const at = i.createInterface("IBaseHref");

const ct = i.createInterface("ILocationManager", (t => t.singleton(ut)));

let ut = class BrowserLocationManager {
    constructor(t, e, i, s, n, r, o) {
        this.logger = t;
        this.events = e;
        this.history = i;
        this.location = s;
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
    pushState(t, e, i) {
        i = this.addBaseHref(i);
        try {
            const s = JSON.stringify(t);
            this.logger.trace(`pushState(state:${s},title:'${e}',url:'${i}')`);
        } catch (t) {
            this.logger.warn(`pushState(state:NOT_SERIALIZABLE,title:'${e}',url:'${i}')`);
        }
        this.history.pushState(t, e, i);
    }
    replaceState(t, e, i) {
        i = this.addBaseHref(i);
        try {
            const s = JSON.stringify(t);
            this.logger.trace(`replaceState(state:${s},title:'${e}',url:'${i}')`);
        } catch (t) {
            this.logger.warn(`replaceState(state:NOT_SERIALIZABLE,title:'${e}',url:'${i}')`);
        }
        this.history.replaceState(t, e, i);
    }
    getPath() {
        const {pathname: t, search: e, hash: i} = this.location;
        const s = this.removeBaseHref(`${t}${ft(e)}${i}`);
        this.logger.trace(`getPath() -> '${s}'`);
        return s;
    }
    currentPathEquals(t) {
        const e = this.getPath() === this.removeBaseHref(t);
        this.logger.trace(`currentPathEquals(path:'${t}') -> ${e}`);
        return e;
    }
    addBaseHref(t) {
        const e = t;
        let i;
        let s = this.baseHref.href;
        if (s.endsWith("/")) s = s.slice(0, -1);
        if (0 === s.length) i = t; else {
            if (t.startsWith("/")) t = t.slice(1);
            i = `${s}/${t}`;
        }
        this.logger.trace(`addBaseHref(path:'${e}') -> '${i}'`);
        return i;
    }
    removeBaseHref(t) {
        const e = t;
        const i = this.baseHref.pathname;
        if (t.startsWith(i)) t = t.slice(i.length);
        t = lt(t);
        this.logger.trace(`removeBaseHref(path:'${e}') -> '${t}'`);
        return t;
    }
};

ut = st([ nt(0, n), nt(1, ot), nt(2, v), nt(3, m), nt(4, $), nt(5, at), nt(6, it) ], ut);

function lt(t) {
    let e;
    let i;
    let s;
    if ((s = t.indexOf("?")) >= 0 || (s = t.indexOf("#")) >= 0) {
        e = t.slice(0, s);
        i = t.slice(s);
    } else {
        e = t;
        i = "";
    }
    if (e.endsWith("/")) e = e.slice(0, -1); else if (e.endsWith("/index.html")) e = e.slice(0, -11);
    return `${e}${i}`;
}

function ft(t) {
    return t.length > 0 && !t.startsWith("?") ? `?${t}` : t;
}

const dt = o;

function pt(t, e) {
    if (!tt(t.params, e.params)) return "replace";
    return "none";
}

class RouteConfig {
    get path() {
        const t = this.u;
        if (t.length > 0) return t;
        return this.u = [ x.getDefinition(this.component).name ];
    }
    constructor(t, e, i, s, n, r, o, h, a, c, u, l) {
        this.id = t;
        this.u = e;
        this.title = i;
        this.redirectTo = s;
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
    static R(t, e) {
        if ("string" === typeof t || t instanceof Array) {
            const i = q(t);
            const s = e?.redirectTo ?? null;
            const n = e?.caseSensitive ?? false;
            const r = F(e?.id ?? (i instanceof Array ? i[0] : i));
            const o = e?.title ?? null;
            const h = e?.transitionPlan ?? null;
            const a = e?.viewport ?? Ft;
            const c = e?.data ?? {};
            const u = e?.routes ?? dt;
            return new RouteConfig(r, i, o, s, n, h, a, c, u, e?.fallback ?? null, e, e?.nav ?? true);
        } else if ("object" === typeof t) {
            const i = t;
            K(i, "");
            const s = q(i.path ?? e?.path ?? o);
            const n = i.title ?? e?.title ?? null;
            const r = i.redirectTo ?? e?.redirectTo ?? null;
            const h = i.caseSensitive ?? e?.caseSensitive ?? false;
            const a = i.id ?? e?.id ?? (s instanceof Array ? s[0] : s);
            const c = i.transitionPlan ?? e?.transitionPlan ?? null;
            const u = i.viewport ?? e?.viewport ?? Ft;
            const l = {
                ...e?.data,
                ...i.data
            };
            const f = [ ...i.routes ?? dt, ...e?.routes ?? dt ];
            return new RouteConfig(a, s, n, r, h, c, u, l, f, i.fallback ?? e?.fallback ?? null, i.component ?? e ?? null, i.nav ?? true);
        } else Z("string, function/class or object", "", t);
    }
    applyChildRouteConfig(t, e) {
        K(t, this.path[0] ?? "");
        const i = q(t.path ?? this.path);
        return new RouteConfig(F(t.id ?? this.id ?? i), i, t.title ?? this.title, t.redirectTo ?? this.redirectTo, t.caseSensitive ?? this.caseSensitive, t.transitionPlan ?? this.transitionPlan ?? e?.transitionPlan ?? null, t.viewport ?? this.viewport, t.data ?? this.data, t.routes ?? this.routes, t.fallback ?? this.fallback ?? e?.fallback ?? null, this.component, t.nav ?? this.nav);
    }
    getTransitionPlan(t, e) {
        const i = this.transitionPlan ?? pt;
        return "function" === typeof i ? i(t, e) : i;
    }
    C(t, e, i) {
        if (this.$) throw new Error("Invalid operation, the configuration from the get hook is already applied.");
        if ("function" !== typeof t.getRouteConfig) return;
        return h(t.getRouteConfig(e, i), (t => {
            this.$ = true;
            if (null == t) return;
            let i = e?.path ?? "";
            if ("string" !== typeof i) i = i[0];
            K(t, i);
            this.id = t.id ?? this.id;
            this.u = q(t.path ?? this.path);
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
        const s = this.fallback;
        return "function" === typeof s ? s(t, e, i) : s;
    }
}

const gt = {
    name: r.resource.keyFor("route-configuration"),
    isConfigured(e) {
        return t.hasOwn(gt.name, e);
    },
    configure(e, i) {
        const s = RouteConfig.R(e, i);
        t.define(gt.name, s, i);
        return i;
    },
    getConfig(e) {
        if (!gt.isConfigured(e)) gt.configure({}, e);
        return t.getOwn(gt.name, e);
    }
};

function wt(t) {
    return function(e) {
        return gt.configure(t, e);
    };
}

function vt(t, e, i, s, n) {
    if (Y(t)) return RouteConfig.R(t, null);
    const [r, o] = mt(t, n);
    return h(o, (n => {
        const o = n.Type;
        const a = gt.getConfig(o);
        if (G(t)) return a.applyChildRouteConfig(t, i);
        if (e) return a.I();
        if (!a.$ && 4 === r.type && "function" === typeof t.getRouteConfig) return h(a.C(t, i, s), (() => a));
        return a;
    }));
}

function mt(t, e) {
    const i = $t(t);
    let s;
    switch (i.type) {
      case 0:
        {
            if (null == e) throw new Error(`When retrieving the RouteConfig for a component name, a RouteContext (that can resolve it) must be provided`);
            const t = e.container.find(x, i.value);
            if (null === t) throw new Error(`Could not find a CustomElement named '${i.value}' in the current container scope of ${e}. This means the component is neither registered at Aurelia startup nor via the 'dependencies' decorator or static property.`);
            s = t;
            break;
        }

      case 2:
        s = i.value;
        break;

      case 4:
        s = x.getDefinition(i.value.constructor);
        break;

      case 3:
        if (null == e) throw new Error(`RouteContext must be provided when resolving an imported module`);
        s = e.resolveLazy(i.value);
        break;
    }
    return [ i, s ];
}

function $t(t) {
    return G(t) ? $t(t.component) : TypedNavigationInstruction.create(t);
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

const xt = new WeakMap;

class ViewportAgent {
    get $state() {
        return kt(this.state);
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
    constructor(t, e, i) {
        this.viewport = t;
        this.hostController = e;
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
        this.logger = i.container.get(n).scopeTo(`ViewportAgent<${i.friendlyPath}>`);
        this.logger.trace(`constructor()`);
    }
    static for(t, e) {
        let i = xt.get(t);
        if (void 0 === i) {
            const s = E.getCachedOrThrow(t);
            xt.set(t, i = new ViewportAgent(t, s, e));
        }
        return i;
    }
    A(t, e) {
        const i = this.currTransition;
        if (null !== i) bt(i);
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
                const i = new Promise((t => {
                    e.continueWith((() => {
                        t();
                    }));
                }));
                return e.start().done ? void 0 : i;
            }

          default:
            this.P("activateFromViewport 2");
        }
    }
    U(t, e) {
        const i = this.currTransition;
        if (null !== i) bt(i);
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
                const i = new Promise((t => {
                    e.continueWith((() => {
                        t();
                    }));
                }));
                return e.start().done ? void 0 : i;
            }
        }
    }
    O(t) {
        if (!this.j()) return false;
        const e = this.viewport;
        const i = t.viewportName;
        const s = e.name;
        if (i !== Ft && s !== i) {
            this.logger.trace(`handles(req:%s) -> false (viewport names don't match '%s')`, t, s);
            return false;
        }
        const n = e.usedBy;
        if (n.length > 0 && !n.split(",").includes(t.componentName)) {
            this.logger.trace(`handles(req:%s) -> false (componentName not included in usedBy)`, t);
            return false;
        }
        this.logger.trace(`viewport '%s' handles(req:%s) -> true`, s, t);
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
    _(t, e) {
        if (null === this.currTransition) this.currTransition = t;
        bt(t);
        if (true !== t.guardsResult) return;
        e.push();
        void h(this.V, (() => {
            Batch.start((e => {
                this.logger.trace(`canUnload() - invoking on children at %s`, this);
                for (const i of this.currNode.children) i.context.vpa._(t, e);
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
                e.pop();
            })).start();
        }));
    }
    B(t, e) {
        if (null === this.currTransition) this.currTransition = t;
        bt(t);
        if (true !== t.guardsResult) return;
        e.push();
        Batch.start((e => {
            switch (this.nextState) {
              case 32:
                this.logger.trace(`canLoad() - invoking on new component at %s`, this);
                this.nextState = 16;
                switch (this.$plan) {
                  case "none":
                    return;

                  case "invoke-lifecycles":
                    return this.curCA.B(t, this.nextNode, e);

                  case "replace":
                    e.push();
                    void h(this.nextNode.context.createComponentAgent(this.hostController, this.nextNode), (i => {
                        (this.nextCA = i).B(t, this.nextNode, e);
                        e.pop();
                    }));
                }

              case 64:
                this.logger.trace(`canLoad() - nothing to load at %s`, this);
                return;

              default:
                this.P("canLoad");
            }
        })).continueWith((t => {
            const e = this.nextNode;
            switch (this.$plan) {
              case "none":
              case "invoke-lifecycles":
                {
                    this.logger.trace(`canLoad(next:%s) - plan set to '%s', compiling residue`, e, this.$plan);
                    t.push();
                    const i = e.context;
                    void h(i.resolved, (() => h(h(a(...e.residue.splice(0).map((t => It(this.logger, e, t)))), (() => a(...i.getAvailableViewportAgents().reduce(((t, i) => {
                        const s = i.viewport;
                        const n = s.default;
                        if (null === n) return t;
                        t.push(It(this.logger, e, ViewportInstruction.create({
                            component: n,
                            viewport: s.name
                        })));
                        return t;
                    }), [])))), (() => {
                        t.pop();
                    }))));
                    return;
                }

              case "replace":
                this.logger.trace(`canLoad(next:%s), delaying residue compilation until activate`, e, this.$plan);
                return;
            }
        })).continueWith((e => {
            switch (this.nextState) {
              case 16:
                this.logger.trace(`canLoad() - finished own component, now invoking on children at %s`, this);
                this.nextState = 8;
                for (const i of this.nextNode.children) i.context.vpa.B(t, e);
                return;

              case 64:
                return;

              default:
                this.P("canLoad");
            }
        })).continueWith((() => {
            this.logger.trace(`canLoad() - finished at %s`, this);
            e.pop();
        })).start();
    }
    M(t, e) {
        bt(t);
        Et(this, t);
        e.push();
        Batch.start((e => {
            this.logger.trace(`unloading() - invoking on children at %s`, this);
            for (const i of this.currNode.children) i.context.vpa.M(t, e);
        })).continueWith((i => {
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
                    i.push();
                    Batch.start((e => {
                        this.logger.trace(`unloading() - finished invoking on children, now invoking on own component at %s`, this);
                        this.curCA.M(t, this.nextNode, e);
                    })).continueWith((() => {
                        this.logger.trace(`unloading() - finished at %s`, this);
                        this.currState = 256;
                        i.pop();
                    })).start();
                    return;
                }

              case 8192:
                this.logger.trace(`unloading() - nothing to unload at %s`, this);
                for (const i of this.currNode.children) i.context.vpa.M(t, e);
                return;

              default:
                this.P("unloading");
            }
        })).continueWith((() => {
            e.pop();
        })).start();
    }
    q(t, e) {
        bt(t);
        Et(this, t);
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
                for (const i of this.nextNode.children) i.context.vpa.q(t, e);
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
    L(t, e, i) {
        bt(e);
        Et(this, e);
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
                    const s = this.hostController;
                    const n = this.curCA;
                    e.run((() => h(n.L(t, s), (() => {
                        if (null === t) n.F();
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
    T(t, e, i) {
        bt(e);
        Et(this, e);
        i.push();
        if (32 === this.nextState) {
            this.logger.trace(`activate() - invoking canLoad(), loading() and activate() on new component due to resolution 'dynamic' at %s`, this);
            Batch.start((t => {
                this.B(e, t);
            })).continueWith((t => {
                this.q(e, t);
            })).continueWith((i => {
                this.T(t, e, i);
            })).continueWith((() => {
                i.pop();
            })).start();
            return;
        }
        switch (this.nextState) {
          case 2:
            this.logger.trace(`activate() - invoking on existing component at %s`, this);
            this.nextState = 1;
            Batch.start((i => {
                switch (this.$plan) {
                  case "none":
                  case "invoke-lifecycles":
                    return;

                  case "replace":
                    {
                        const s = this.hostController;
                        e.run((() => {
                            i.push();
                            return this.nextCA.T(t, s);
                        }), (() => {
                            i.pop();
                        }));
                    }
                }
            })).continueWith((t => {
                this.H(e, t);
            })).continueWith((() => {
                i.pop();
            })).start();
            return;

          case 64:
            this.logger.trace(`activate() - nothing to activate at %s`, this);
            i.pop();
            return;

          default:
            this.P("activate");
        }
    }
    W(t, e) {
        if (8192 === this.currState) {
            this.logger.trace(`swap() - running activate on next instead, because there is nothing to deactivate at %s`, this);
            this.T(null, t, e);
            return;
        }
        if (64 === this.nextState) {
            this.logger.trace(`swap() - running deactivate on current instead, because there is nothing to activate at %s`, this);
            this.L(null, t, e);
            return;
        }
        bt(t);
        Et(this, t);
        if (!(256 === this.currState && 2 === this.nextState)) this.P("swap");
        this.currState = 128;
        this.nextState = 1;
        switch (this.$plan) {
          case "none":
          case "invoke-lifecycles":
            {
                this.logger.trace(`swap() - skipping this level and swapping children instead at %s`, this);
                const i = M(this.nextNode.children, this.currNode.children);
                for (const s of i) s.context.vpa.W(t, e);
                return;
            }

          case "replace":
            {
                this.logger.trace(`swap() - running normally at %s`, this);
                const i = this.hostController;
                const s = this.curCA;
                const n = this.nextCA;
                e.push();
                Batch.start((e => {
                    t.run((() => {
                        e.push();
                        return h(s.L(null, i), (() => s.F()));
                    }), (() => {
                        e.pop();
                    }));
                })).continueWith((e => {
                    t.run((() => {
                        e.push();
                        return n.T(null, i);
                    }), (() => {
                        e.pop();
                    }));
                })).continueWith((e => {
                    this.H(t, e);
                })).continueWith((() => {
                    e.pop();
                })).start();
                return;
            }
        }
    }
    H(t, e) {
        this.logger.trace(`processDynamicChildren() - %s`, this);
        const i = this.nextNode;
        t.run((() => {
            e.push();
            const t = i.context;
            return h(t.resolved, (() => {
                const e = i.children.slice();
                return h(a(...i.residue.splice(0).map((t => It(this.logger, i, t)))), (() => h(a(...t.getAvailableViewportAgents().reduce(((t, e) => {
                    const s = e.viewport;
                    const n = s.default;
                    if (null === n) return t;
                    t.push(It(this.logger, i, ViewportInstruction.create({
                        component: n,
                        viewport: s.name
                    })));
                    return t;
                }), [])), (() => i.children.filter((t => !e.includes(t)))))));
            }));
        }), (i => {
            Batch.start((e => {
                for (const s of i) t.run((() => {
                    e.push();
                    return s.context.vpa.B(t, e);
                }), (() => {
                    e.pop();
                }));
            })).continueWith((e => {
                for (const s of i) t.run((() => {
                    e.push();
                    return s.context.vpa.q(t, e);
                }), (() => {
                    e.pop();
                }));
            })).continueWith((e => {
                for (const s of i) t.run((() => {
                    e.push();
                    return s.context.vpa.T(null, t, e);
                }), (() => {
                    e.pop();
                }));
            })).continueWith((() => {
                e.pop();
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
        const i = this.curCA?.routeNode ?? null;
        if (null === i || i.component !== e.component) this.$plan = "replace"; else this.$plan = e.context.config.getTransitionPlan(i, e);
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
            this.V = h(this.nextCA?.L(null, this.hostController), (() => {
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
            bt(this.currTransition);
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

function Et(t, e) {
    if (true !== e.guardsResult) throw new Error(`Unexpected guardsResult ${e.guardsResult} at ${t}`);
}

function bt(t) {
    if (void 0 !== t.error && !t.erredWithUnknownRoute) throw t.error;
}

var yt;

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
})(yt || (yt = {}));

const Rt = new Map;

function kt(t) {
    let e = Rt.get(t);
    if (void 0 === e) Rt.set(t, e = St(t));
    return e;
}

function St(t) {
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

let Ct = 0;

class RouteNode {
    get root() {
        return this.tree.root;
    }
    constructor(t, e, i, s, n, r, o, h, a, c, u, l, f, d, p) {
        this.id = t;
        this.path = e;
        this.finalPath = i;
        this.context = s;
        this.originalInstruction = n;
        this.instruction = r;
        this.params = o;
        this.queryParams = h;
        this.fragment = a;
        this.data = c;
        this.viewport = u;
        this.title = l;
        this.component = f;
        this.children = d;
        this.residue = p;
        this.version = 1;
        this.originalInstruction ?? (this.originalInstruction = r);
    }
    static create(t) {
        const {[_]: e, ...i} = t.params ?? {};
        return new RouteNode(++Ct, t.path, t.finalPath, t.context, t.originalInstruction ?? t.instruction, t.instruction, i, t.queryParams ?? Tt, t.fragment ?? null, t.data ?? {}, t.viewport ?? null, t.title ?? null, t.component, t.children ?? [], t.residue ?? []);
    }
    contains(t, e) {
        if (this.context === t.options.context) {
            const i = this.children;
            const s = t.children;
            for (let t = 0, n = i.length; t < n; ++t) for (let r = 0, o = s.length; r < o; ++r) {
                const h = s[r];
                const a = e ? h.recognizedRoute?.route.endpoint : null;
                const c = i[t + r];
                if (t + r < n && (null != a && c.instruction?.recognizedRoute?.route.endpoint === a || (c.originalInstruction?.contains(h) ?? false))) {
                    if (r + 1 === o) return true;
                } else break;
            }
        }
        return this.children.some((function(i) {
            return i.contains(t, e);
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
        const i = this.context?.config.path ?? "";
        if (i.length > 0) t.push(`path:'${i}'`);
        if (this.children.length > 0) t.push(`children:[${this.children.map(String).join(",")}]`);
        if (this.residue.length > 0) t.push(`residue:${this.residue.map((function(t) {
            if ("string" === typeof t) return `'${t}'`;
            return String(t);
        })).join(",")}`);
        return `RN(ctx:'${this.context?.friendlyPath}',${t.join(",")})`;
    }
}

class RouteTree {
    constructor(t, e, i, s) {
        this.options = t;
        this.queryParams = e;
        this.fragment = i;
        this.root = s;
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

function It(t, e, i) {
    t.trace(`createAndAppendNodes(node:%s,vi:%s`, e, i);
    switch (i.component.type) {
      case 0:
        switch (i.component.value) {
          case "..":
            e = e.context.parent?.node ?? e;
            e.clearChildren();

          case ".":
            return a(...i.children.map((i => It(t, e, i))));

          default:
            {
                t.trace(`createAndAppendNodes invoking createNode`);
                const s = e.context;
                const n = i.clone();
                let r = i.recognizedRoute;
                if (null !== r) return Vt(t, e, Nt(t, e, i, r, n));
                if (0 === i.children.length) {
                    const n = s.generateViewportInstruction(i);
                    if (null !== n) {
                        e.tree.queryParams = D(e.tree.queryParams, n.query, true);
                        const s = n.vi;
                        s.children.push(...i.children);
                        return Vt(t, e, Nt(t, e, s, s.recognizedRoute, i));
                    }
                }
                let o = 0;
                let h = i.component.value;
                let a = i;
                while (1 === a.children.length) {
                    a = a.children[0];
                    if (0 === a.component.type) {
                        ++o;
                        h = `${h}/${a.component.value}`;
                    } else break;
                }
                r = s.recognize(h);
                t.trace("createNode recognized route: %s", r);
                const u = r?.residue ?? null;
                t.trace("createNode residue:", u);
                const l = null === u;
                if (null === r || u === h) {
                    const n = s.generateViewportInstruction({
                        component: i.component.value,
                        params: i.params ?? c,
                        open: i.open,
                        close: i.close,
                        viewport: i.viewport,
                        children: i.children.slice()
                    });
                    if (null !== n) {
                        e.tree.queryParams = D(e.tree.queryParams, n.query, true);
                        return Vt(t, e, Nt(t, e, n.vi, n.vi.recognizedRoute, i));
                    }
                    const r = i.component.value;
                    if ("" === r) return;
                    let o = i.viewport;
                    if (null === o || 0 === o.length) o = Ft;
                    const h = s.getFallbackViewportAgent(o);
                    const a = null !== h ? h.viewport.N(i, e, s) : s.config.N(i, e, s);
                    if (null === a) throw new UnknownRouteError(`Neither the route '${r}' matched any configured route at '${s.friendlyPath}' nor a fallback is configured for the viewport '${o}' - did you forget to add '${r}' to the routes list of the route decorator of '${s.component.name}'?`);
                    t.trace(`Fallback is set to '${a}'. Looking for a recognized route.`);
                    const u = s.childRoutes.find((t => t.id === a));
                    if (void 0 !== u) return Vt(t, e, At(t, u, e, i));
                    t.trace(`No route configuration for the fallback '${a}' is found; trying to recognize the route.`);
                    const l = s.recognize(a, true);
                    if (null !== l && l.residue !== a) return Vt(t, e, Nt(t, e, i, l, null));
                    t.trace(`The fallback '${a}' is not recognized as a route; treating as custom element name.`);
                    return Vt(t, e, At(t, vt(a, false, s.config, null, s), e, i));
                }
                r.residue = null;
                i.component.value = l ? h : h.slice(0, -(u.length + 1));
                for (let t = 0; t < o; ++t) {
                    const t = i.children[0];
                    if (u?.startsWith(t.component.value) ?? false) break;
                    i.viewport = t.viewport;
                    i.children = t.children;
                }
                i.recognizedRoute = r;
                t.trace("createNode after adjustment vi:%s", i);
                return Vt(t, e, Nt(t, e, i, r, n));
            }
        }

      case 3:
      case 4:
      case 2:
        {
            const s = e.context;
            return h(mt(i.component.value, s)[1], (n => {
                const {vi: r, query: o} = s.generateViewportInstruction({
                    component: n,
                    params: i.params ?? c,
                    open: i.open,
                    close: i.close,
                    viewport: i.viewport,
                    children: i.children.slice()
                });
                e.tree.queryParams = D(e.tree.queryParams, o, true);
                return Vt(t, e, Nt(t, e, r, r.recognizedRoute, i));
            }));
        }
    }
}

function Nt(t, e, i, s, n, r = s.route.endpoint.route) {
    const o = e.context;
    const a = e.tree;
    return h(r.handler, (c => {
        r.handler = c;
        t.trace(`creatingConfiguredNode(rdc:%s, vi:%s)`, c, i);
        if (null === c.redirectTo) {
            const u = (i.viewport?.length ?? 0) > 0 ? i.viewport : c.viewport;
            return h(mt(c.component, o)[1], (l => {
                const f = o.resolveViewportAgent(new ViewportRequest(u, l.name));
                const d = o.container.get(Lt);
                return h(d.getRouteContext(f, l, null, f.hostController.container, o.config, o, c), (o => {
                    t.trace("createConfiguredNode setting the context node");
                    const h = o.node = RouteNode.create({
                        path: s.route.endpoint.route.path,
                        finalPath: r.path,
                        context: o,
                        instruction: i,
                        originalInstruction: n,
                        params: {
                            ...s.route.params
                        },
                        queryParams: a.queryParams,
                        fragment: a.fragment,
                        data: c.data,
                        viewport: u,
                        component: l,
                        title: c.title,
                        residue: [ ...null === s.residue ? [] : [ ViewportInstruction.create(s.residue) ], ...i.children ]
                    });
                    h.setTree(e.tree);
                    t.trace(`createConfiguredNode(vi:%s) -> %s`, i, h);
                    return h;
                }));
            }));
        }
        const u = RouteExpression.parse(r.path, false);
        const l = RouteExpression.parse(c.redirectTo, false);
        let f;
        let d;
        const p = [];
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
            d = l.root;
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
            if (m) w = null; else if (4 === d.kind) {
                w = d;
                m = true;
            } else if (4 === d.left.kind) {
                w = d.left;
                switch (d.right.kind) {
                  case 2:
                  case 4:
                    d = d.right;
                    break;

                  default:
                    throw new Error(`Unexpected expression kind ${d.right.kind}`);
                }
            } else throw new Error(`Unexpected expression kind ${d.left.kind}`);
            if (null !== w) if (w.component.isDynamic && (g?.component.isDynamic ?? false)) p.push(s.route.params[w.component.parameterName]); else p.push(w.raw);
        }
        const $ = p.filter(Boolean).join("/");
        const x = o.recognize($);
        if (null === x) throw new UnknownRouteError(`'${$}' did not match any configured route or registered component name at '${o.friendlyPath}' - did you forget to add '${$}' to the routes list of the route decorator of '${o.component.name}'?`);
        return Nt(t, e, ViewportInstruction.create({
            recognizedRoute: x,
            component: $,
            children: i.children,
            viewport: i.viewport,
            open: i.open,
            close: i.close
        }), x, n);
    }));
}

function Vt(t, e, i) {
    return h(i, (i => {
        t.trace(`appendNode($childNode:%s)`, i);
        e.appendChild(i);
        return i.context.vpa.G(e.tree.options, i);
    }));
}

function At(t, e, i, s) {
    const n = new $RecognizedRoute(new L(new O(new j(e.path[0], e.caseSensitive, e), []), c), null);
    s.children.length = 0;
    return Nt(t, i, s, n, null);
}

const Tt = Object.freeze(new URLSearchParams);

function Pt(t) {
    return e(t) && true === Object.prototype.hasOwnProperty.call(t, rt);
}

function Ut(t, e) {
    return {
        ...t,
        [rt]: e
    };
}

class UnknownRouteError extends Error {}

class Transition {
    get erredWithUnknownRoute() {
        return this.Z;
    }
    constructor(t, e, i, s, n, r, o, h, a, c, u, l, f, d, p) {
        this.id = t;
        this.prevInstructions = e;
        this.instructions = i;
        this.finalInstructions = s;
        this.instructionsChanged = n;
        this.trigger = r;
        this.options = o;
        this.managedState = h;
        this.previousRouteTree = a;
        this.routeTree = c;
        this.promise = u;
        this.resolve = l;
        this.reject = f;
        this.guardsResult = d;
        this.error = p;
        this.Z = false;
    }
    static create(t) {
        return new Transition(t.id, t.prevInstructions, t.instructions, t.finalInstructions, t.instructionsChanged, t.trigger, t.options, t.managedState, t.previousRouteTree, t.routeTree, t.promise, t.resolve, t.reject, t.guardsResult, void 0);
    }
    run(t, e) {
        if (true !== this.guardsResult) return;
        try {
            const i = t();
            if (i instanceof Promise) i.then(e).catch((t => {
                this.handleError(t);
            })); else e(i);
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

const Lt = i.createInterface("IRouter", (t => t.singleton(Ot)));

let Ot = class Router {
    get ctx() {
        let t = this.K;
        if (null === t) {
            if (!this.container.has(Gt, true)) throw new Error(`Root RouteContext is not set. Did you forget to register RouteConfiguration, or try to navigate before calling Aurelia.start()?`);
            t = this.K = this.container.get(Gt);
        }
        return t;
    }
    get routeTree() {
        let t = this.X;
        if (null === t) {
            const e = this.ctx;
            t = this.X = new RouteTree(NavigationOptions.create(this.options, {}), Tt, null, RouteNode.create({
                path: "",
                finalPath: "",
                context: e,
                instruction: null,
                component: x.getDefinition(e.config.component),
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
    constructor(t, e, i, s, n, r) {
        this.container = t;
        this.p = e;
        this.logger = i;
        this.events = s;
        this.locationMgr = n;
        this.options = r;
        this.K = null;
        this.X = null;
        this.tt = null;
        this.navigated = false;
        this.navigationId = 0;
        this.nextTr = null;
        this.locationChangeSubscription = null;
        this.it = false;
        this.et = false;
        this.vpaLookup = new Map;
        this.logger = i.root.scopeTo("Router");
        this.instructions = ViewportInstructionTree.create("", r);
    }
    resolveContext(t) {
        return RouteContext.resolve(this.ctx, t);
    }
    start(t) {
        this.it = "function" === typeof this.options.buildTitle;
        this.locationMgr.startListening();
        this.locationChangeSubscription = this.events.subscribe("au:router:location-change", (t => {
            this.p.taskQueue.queueTask((() => {
                const e = Pt(t.state) ? t.state : null;
                const i = this.options;
                const s = NavigationOptions.create(i, {
                    historyStrategy: "replace"
                });
                const n = ViewportInstructionTree.create(t.url, i, s, this.ctx);
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
        const i = this.createViewportInstructions(t, e);
        this.logger.trace("load(instructions:%s)", i);
        return this.enqueue(i, "api", null, null);
    }
    isActive(t, e) {
        const i = this.resolveContext(e);
        const s = t instanceof ViewportInstructionTree ? t : this.createViewportInstructions(t, {
            context: i,
            historyStrategy: this.options.historyStrategy
        });
        this.logger.trace("isActive(instructions:%s,ctx:%s)", s, i);
        return this.routeTree.contains(s, false);
    }
    getRouteContext(t, e, i, s, r, o, a) {
        const c = s.get(n).scopeTo("RouteContext");
        return h(a instanceof RouteConfig ? a : vt("function" === typeof i?.getRouteConfig ? i : e.Type, false, r, null, o), (i => {
            let n = this.vpaLookup.get(t);
            if (void 0 === n) this.vpaLookup.set(t, n = new WeakMap);
            let r = n.get(i);
            if (void 0 !== r) {
                c.trace(`returning existing RouteContext for %s`, i);
                return r;
            }
            c.trace(`creating new RouteContext for %s`, i);
            const o = s.has(Gt, true) ? s.get(Gt) : null;
            n.set(i, r = new RouteContext(t, o, e, i, s, this));
            return r;
        }));
    }
    createViewportInstructions(t, e) {
        if (t instanceof ViewportInstructionTree) return t;
        let i = e?.context ?? null;
        if ("string" === typeof t) {
            t = this.locationMgr.removeBaseHref(t);
            if (t.startsWith("../") && null !== i) {
                i = this.resolveContext(i);
                while (t.startsWith("../") && null !== (i?.parent ?? null)) {
                    t = t.slice(3);
                    i = i.parent;
                }
            }
        }
        const s = this.options;
        return ViewportInstructionTree.create(t, s, NavigationOptions.create(s, {
            ...e,
            context: i
        }), this.ctx);
    }
    enqueue(t, e, i, s) {
        const n = this.currentTr;
        const r = this.logger;
        if ("api" !== e && "api" === n.trigger && n.instructions.equals(t)) {
            r.debug(`Ignoring navigation triggered by '%s' because it is the same URL as the previous navigation which was triggered by 'api'.`, e);
            return true;
        }
        let o;
        let h;
        let a;
        if (null === s || s.erredWithUnknownRoute) a = new Promise((function(t, e) {
            o = t;
            h = e;
        })); else {
            r.debug(`Reusing promise/resolve/reject from the previously failed transition %s`, s);
            a = s.promise;
            o = s.resolve;
            h = s.reject;
        }
        const c = this.nextTr = Transition.create({
            id: ++this.navigationId,
            trigger: e,
            managedState: i,
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
        let e = this.resolveContext(t.options.context);
        this.logger.trace(`run(tr:%s) - processing route`, t);
        this.events.publish(new NavigationStartEvent(t.id, t.instructions, t.trigger, t.managedState));
        if (null !== this.nextTr) {
            this.logger.debug(`run(tr:%s) - aborting because a new transition was queued in response to the NavigationStartEvent`, t);
            return this.run(this.nextTr);
        }
        t.run((() => {
            const i = t.finalInstructions;
            this.logger.trace(`run() - compiling route tree: %s`, i);
            const s = this.ctx;
            const r = t.routeTree;
            r.options = i.options;
            r.queryParams = s.node.tree.queryParams = i.queryParams;
            r.fragment = s.node.tree.fragment = i.fragment;
            const o = e.container.get(n).scopeTo("RouteTree");
            if (i.isAbsolute) e = s;
            if (e === s) {
                r.root.setTree(r);
                s.node = r.root;
            }
            const a = e.resolved instanceof Promise ? " - awaiting promise" : "";
            o.trace(`updateRouteTree(rootCtx:%s,rt:%s,vit:%s)${a}`, s, r, i);
            return h(e.resolved, (() => jt(o, i, e, s.node)));
        }), (() => {
            const e = t.previousRouteTree.root.children;
            const i = t.routeTree.root.children;
            const s = M(e, i);
            Batch.start((i => {
                this.logger.trace(`run() - invoking canUnload on ${e.length} nodes`);
                for (const s of e) s.context.vpa._(t, i);
            })).continueWith((e => {
                if (true !== t.guardsResult) {
                    e.push();
                    this.cancelNavigation(t);
                }
            })).continueWith((e => {
                this.logger.trace(`run() - invoking canLoad on ${i.length} nodes`);
                for (const s of i) s.context.vpa.B(t, e);
            })).continueWith((e => {
                if (true !== t.guardsResult) {
                    e.push();
                    this.cancelNavigation(t);
                }
            })).continueWith((i => {
                this.logger.trace(`run() - invoking unloading on ${e.length} nodes`);
                for (const s of e) s.context.vpa.M(t, i);
            })).continueWith((e => {
                this.logger.trace(`run() - invoking loading on ${i.length} nodes`);
                for (const s of i) s.context.vpa.q(t, e);
            })).continueWith((e => {
                this.logger.trace(`run() - invoking swap on ${s.length} nodes`);
                for (const i of s) i.context.vpa.W(t, e);
            })).continueWith((() => {
                this.logger.trace(`run() - finalizing transition`);
                s.forEach((function(t) {
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
                    this.locationMgr.pushState(Ut(t.options.state, t.id), this.updateTitle(t), e);
                    break;

                  case "replace":
                    this.locationMgr.replaceState(Ut(t.options.state, t.id), this.updateTitle(t), e);
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
        if (this.it) e = this.options.buildTitle(t) ?? ""; else switch (typeof t.options.title) {
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
        const e = t.previousRouteTree.root.children;
        const i = t.routeTree.root.children;
        const s = M(e, i);
        s.forEach((function(t) {
            t.context.vpa.Y();
        }));
        this.instructions = t.prevInstructions;
        this.X = t.previousRouteTree;
        this.et = false;
        const n = t.guardsResult;
        this.events.publish(new NavigationCancelEvent(t.id, t.instructions, `guardsResult is ${n}`));
        if (false === n) {
            t.resolve(false);
            this.runNextTransition();
        } else {
            const e = t.erredWithUnknownRoute ? t.prevInstructions : n;
            void h(this.enqueue(e, "api", t.managedState, t), (() => {
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

Ot = st([ nt(0, u), nt(1, b), nt(2, n), nt(3, ot), nt(4, ct), nt(5, it) ], Ot);

function jt(t, e, i, s) {
    t.trace(`updateNode(ctx:%s,node:%s)`, i, s);
    s.queryParams = e.queryParams;
    s.fragment = e.fragment;
    if (!s.context.isRoot) s.context.vpa.G(s.tree.options, s);
    if (s.context === i) {
        s.clearChildren();
        return h(a(...e.children.map((e => It(t, s, e)))), (() => a(...i.getAvailableViewportAgents().reduce(((e, i) => {
            const n = i.viewport;
            const r = n.default;
            if (null === r) return e;
            e.push(It(t, s, ViewportInstruction.create({
                component: r,
                viewport: n.name
            })));
            return e;
        }), []))));
    }
    return a(...s.children.map((s => jt(t, e, i, s))));
}

const _t = [ "?", "#", "/", "+", "(", ")", ".", "@", "!", "=", ",", "&", "'", "~", ";" ];

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
        const i = e[t];
        e[t] = "";
        return i;
    }
    discard() {
        this.buffers[--this.bufferIndex] = "";
    }
    append(t) {
        const e = this.bufferIndex;
        const i = this.buffers;
        for (let s = 0; s < e; ++s) i[s] += t;
    }
}

var Bt;

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
})(Bt || (Bt = {}));

const Mt = new Map;

const zt = new Map;

class RouteExpression {
    get kind() {
        return 0;
    }
    constructor(t, e, i, s, n, r) {
        this.raw = t;
        this.isAbsolute = e;
        this.root = i;
        this.queryParams = s;
        this.fragment = n;
        this.fragmentIsRoute = r;
    }
    static parse(t, e) {
        const i = e ? Mt : zt;
        let s = i.get(t);
        if (void 0 === s) i.set(t, s = RouteExpression.$parse(t, e));
        return s;
    }
    static $parse(t, e) {
        let i = null;
        const s = t.indexOf("#");
        if (s >= 0) {
            const n = t.slice(s + 1);
            i = decodeURIComponent(n);
            if (e) t = i; else t = t.slice(0, s);
        }
        let n = null;
        const r = t.indexOf("?");
        if (r >= 0) {
            const e = t.slice(r + 1);
            t = t.slice(0, r);
            n = new URLSearchParams(e);
        }
        if ("" === t) return new RouteExpression("", false, SegmentExpression.EMPTY, null != n ? Object.freeze(n) : Tt, i, e);
        const o = new ParserState(t);
        o.record();
        const h = o.consumeOptional("/");
        const a = CompositeSegmentExpression.parse(o);
        o.ensureDone();
        const c = o.playback();
        return new RouteExpression(c, h, a, null != n ? Object.freeze(n) : Tt, i, e);
    }
    toInstructionTree(t) {
        return new ViewportInstructionTree(t, this.isAbsolute, this.root.toInstructions(0, 0), D(this.queryParams, t.queryParams, true), this.fragment ?? t.fragment);
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
        const i = [];
        do {
            i.push(ScopedSegmentExpression.parse(t));
        } while (t.consumeOptional("+"));
        if (!e && 1 === i.length) {
            t.discard();
            return i[0];
        }
        const s = t.playback();
        return new CompositeSegmentExpression(s, i);
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
    constructor(t, e, i) {
        this.raw = t;
        this.left = e;
        this.right = i;
    }
    static parse(t) {
        t.record();
        const e = SegmentGroupExpression.parse(t);
        if (t.consumeOptional("/")) {
            const i = ScopedSegmentExpression.parse(t);
            const s = t.playback();
            return new ScopedSegmentExpression(s, e, i);
        }
        t.discard();
        return e;
    }
    toInstructions(t, e) {
        const i = this.left.toInstructions(t, 0);
        const s = this.right.toInstructions(0, e);
        let n = i[i.length - 1];
        while (n.children.length > 0) n = n.children[n.children.length - 1];
        n.children.push(...s);
        return i;
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
            const i = t.playback();
            return new SegmentGroupExpression(i, e);
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
    constructor(t, e, i, s, n) {
        this.raw = t;
        this.component = e;
        this.action = i;
        this.viewport = s;
        this.scoped = n;
    }
    static parse(t) {
        t.record();
        const e = ComponentExpression.parse(t);
        const i = ActionExpression.parse(t);
        const s = ViewportExpression.parse(t);
        const n = !t.consumeOptional("!");
        const r = t.playback();
        return new SegmentExpression(r, e, i, s, n);
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
    constructor(t, e, i) {
        this.raw = t;
        this.name = e;
        this.parameterList = i;
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
        } else while (!t.done && !t.startsWith(..._t)) t.advance();
        const e = decodeURIComponent(t.playback());
        if (0 === e.length) t.expect("component name");
        const i = ParameterListExpression.parse(t);
        const s = t.playback();
        return new ComponentExpression(s, e, i);
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
    constructor(t, e, i) {
        this.raw = t;
        this.name = e;
        this.parameterList = i;
    }
    static parse(t) {
        t.record();
        let e = "";
        if (t.consumeOptional(".")) {
            t.record();
            while (!t.done && !t.startsWith(..._t)) t.advance();
            e = decodeURIComponent(t.playback());
            if (0 === e.length) t.expect("method name");
        }
        const i = ParameterListExpression.parse(t);
        const s = t.playback();
        return new ActionExpression(s, e, i);
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
            while (!t.done && !t.startsWith(..._t)) t.advance();
            e = decodeURIComponent(t.playback());
            if (0 === e.length) t.expect("viewport name");
        }
        const i = t.playback();
        return new ViewportExpression(i, e);
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
        const i = t.playback();
        return new ParameterListExpression(i, e);
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
    constructor(t, e, i) {
        this.raw = t;
        this.key = e;
        this.value = i;
    }
    static parse(t, e) {
        t.record();
        t.record();
        while (!t.done && !t.startsWith(..._t)) t.advance();
        let i = decodeURIComponent(t.playback());
        if (0 === i.length) t.expect("parameter key");
        let s;
        if (t.consumeOptional("=")) {
            t.record();
            while (!t.done && !t.startsWith(..._t)) t.advance();
            s = decodeURIComponent(t.playback());
            if (0 === s.length) t.expect("parameter value");
        } else {
            s = i;
            i = e.toString();
        }
        const n = t.playback();
        return new ParameterExpression(n, i, s);
    }
    toString() {
        return this.raw;
    }
}

const qt = Object.freeze({
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

const Ft = "default";

class ViewportInstruction {
    constructor(t, e, i, s, n, r, o) {
        this.open = t;
        this.close = e;
        this.recognizedRoute = i;
        this.component = s;
        this.viewport = n;
        this.params = r;
        this.children = o;
    }
    static create(t) {
        if (t instanceof ViewportInstruction) return t;
        if (J(t)) {
            const e = TypedNavigationInstruction.create(t.component);
            const i = t.children?.map(ViewportInstruction.create) ?? [];
            return new ViewportInstruction(t.open ?? 0, t.close ?? 0, t.recognizedRoute ?? null, e, t.viewport ?? null, t.params ?? null, i);
        }
        const e = TypedNavigationInstruction.create(t);
        return new ViewportInstruction(0, 0, null, e, null, null, []);
    }
    contains(t) {
        const e = this.children;
        const i = t.children;
        if (e.length < i.length) return false;
        if (!this.component.equals(t.component)) return false;
        for (let t = 0, s = i.length; t < s; ++t) if (!e[t].contains(i[t])) return false;
        return true;
    }
    equals(t) {
        const e = this.children;
        const i = t.children;
        if (e.length !== i.length) return false;
        if (!this.component.equals(t.component) || this.viewport !== t.viewport || !tt(this.params, t.params)) return false;
        for (let t = 0, s = e.length; t < s; ++t) if (!e[t].equals(i[t])) return false;
        return true;
    }
    clone() {
        return new ViewportInstruction(this.open, this.close, this.recognizedRoute, this.component.clone(), this.viewport, null === this.params ? null : {
            ...this.params
        }, [ ...this.children ]);
    }
    toUrlComponent(t = true) {
        const e = this.component.toUrlComponent();
        const i = null === this.params || 0 === Object.keys(this.params).length ? "" : `(${Dt(this.params)})`;
        const s = this.viewport;
        const n = 0 === e.length || null === s || 0 === s.length || s === Ft ? "" : `@${s}`;
        const r = `${"(".repeat(this.open)}${e}${i}${n}${")".repeat(this.close)}`;
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
        const i = 0 === this.children.length ? "" : `children:[${this.children.map(String).join(",")}]`;
        const s = [ t, e, i ].filter(Boolean).join(",");
        return `VPI(${s})`;
    }
}

function Dt(t) {
    const e = Object.keys(t);
    const i = Array(e.length);
    const s = [];
    const n = [];
    for (const t of e) if (l(t)) s.push(Number(t)); else n.push(t);
    for (let r = 0; r < e.length; ++r) {
        const e = s.indexOf(r);
        if (e > -1) {
            i[r] = t[r];
            s.splice(e, 1);
        } else {
            const e = n.shift();
            i[r] = `${e}=${t[e]}`;
        }
    }
    return i.join(",");
}

const Ht = function() {
    let t = 0;
    const e = new Map;
    return function(i) {
        let s = e.get(i);
        if (void 0 === s) e.set(i, s = ++t);
        return s;
    };
}();

class ViewportInstructionTree {
    constructor(t, e, i, s, n) {
        this.options = t;
        this.isAbsolute = e;
        this.children = i;
        this.queryParams = s;
        this.fragment = n;
    }
    static create(t, e, i, s) {
        const n = NavigationOptions.create(e, {
            ...i
        });
        let r = n.context;
        if (!(r instanceof RouteContext) && null != s) r = RouteContext.resolve(s, r);
        const o = null != r;
        if (t instanceof Array) {
            const e = t.length;
            const i = new Array(e);
            const s = new URLSearchParams(n.queryParams ?? c);
            for (let n = 0; n < e; n++) {
                const e = t[n];
                const h = o ? r.generateViewportInstruction(e) : null;
                if (null !== h) {
                    i[n] = h.vi;
                    D(s, h.query, false);
                } else i[n] = ViewportInstruction.create(e);
            }
            return new ViewportInstructionTree(n, false, i, s, n.fragment);
        }
        if ("string" === typeof t) {
            const i = RouteExpression.parse(t, e.useUrlFragmentHash);
            return i.toInstructionTree(n);
        }
        const h = o ? r.generateViewportInstruction(t) : null;
        const a = new URLSearchParams(n.queryParams ?? c);
        return null !== h ? new ViewportInstructionTree(n, false, [ h.vi ], D(a, h.query, false), n.fragment) : new ViewportInstructionTree(n, false, [ ViewportInstruction.create(t) ], a, n.fragment);
    }
    equals(t) {
        const e = this.children;
        const i = t.children;
        if (e.length !== i.length) return false;
        for (let t = 0, s = e.length; t < s; ++t) if (!e[t].equals(i[t])) return false;
        return true;
    }
    toUrl(t = false) {
        let e;
        let i;
        if (t) {
            e = "";
            i = `#${this.toPath()}`;
        } else {
            e = this.toPath();
            const t = this.fragment;
            i = null !== t && t.length > 0 ? `#${t}` : "";
        }
        let s = this.queryParams.toString();
        s = "" === s ? "" : `?${s}`;
        return `${e}${s}${i}`;
    }
    toPath() {
        return this.children.map((t => t.toUrlComponent())).join("+");
    }
    toString() {
        return `[${this.children.map(String).join(",")}]`;
    }
}

var Wt;

(function(t) {
    t[t["string"] = 0] = "string";
    t[t["ViewportInstruction"] = 1] = "ViewportInstruction";
    t[t["CustomElementDefinition"] = 2] = "CustomElementDefinition";
    t[t["Promise"] = 3] = "Promise";
    t[t["IRouteViewModel"] = 4] = "IRouteViewModel";
})(Wt || (Wt = {}));

class TypedNavigationInstruction {
    constructor(t, e) {
        this.type = t;
        this.value = e;
    }
    static create(t) {
        if (t instanceof TypedNavigationInstruction) return t;
        if ("string" === typeof t) return new TypedNavigationInstruction(0, t);
        if (!e(t)) Z("function/class or object", "", t);
        if ("function" === typeof t) if (x.isType(t)) {
            const e = x.getDefinition(t);
            return new TypedNavigationInstruction(2, e);
        } else return TypedNavigationInstruction.create(t());
        if (t instanceof Promise) return new TypedNavigationInstruction(3, t);
        if (J(t)) {
            const e = ViewportInstruction.create(t);
            return new TypedNavigationInstruction(1, e);
        }
        if (w(t)) return new TypedNavigationInstruction(4, t);
        if (t instanceof y) return new TypedNavigationInstruction(2, t);
        throw new Error(`Invalid component ${z(t)}: must be either a class, a custom element ViewModel, or a (partial) custom element definition`);
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
            return `au$obj${Ht(this.value)}`;

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
            return `VM(name:'${x.getDefinition(this.value.constructor).name}')`;

          case 1:
            return this.value.toString();

          case 0:
            return `'${this.value}'`;
        }
    }
}

class ComponentAgent {
    constructor(t, e, i, s, r) {
        this.instance = t;
        this.controller = e;
        this.routeNode = i;
        this.ctx = s;
        this.routerOptions = r;
        this.st = s.container.get(n).scopeTo(`ComponentAgent<${s.friendlyPath}>`);
        this.st.trace(`constructor()`);
        const o = e.lifecycleHooks;
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
            this.st.trace(`activate() - initial`);
            return this.controller.activate(this.controller, e);
        }
        this.st.trace(`activate()`);
        void this.controller.activate(t, e);
    }
    L(t, e) {
        if (null === t) {
            this.st.trace(`deactivate() - initial`);
            return this.controller.deactivate(this.controller, e);
        }
        this.st.trace(`deactivate()`);
        void this.controller.deactivate(t, e);
    }
    F() {
        this.st.trace(`dispose()`);
        this.controller.dispose();
    }
    _(t, e, i) {
        this.st.trace(`canUnload(next:%s) - invoking ${this.ot.length} hooks`, e);
        i.push();
        let s = Promise.resolve();
        for (const n of this.ot) {
            i.push();
            s = s.then((() => new Promise((s => {
                if (true !== t.guardsResult) {
                    i.pop();
                    s();
                    return;
                }
                t.run((() => n.canUnload(this.instance, e, this.routeNode)), (e => {
                    if (true === t.guardsResult && true !== e) t.guardsResult = false;
                    i.pop();
                    s();
                }));
            }))));
        }
        if (this.lt) {
            i.push();
            s = s.then((() => {
                if (true !== t.guardsResult) {
                    i.pop();
                    return;
                }
                t.run((() => this.instance.canUnload(e, this.routeNode)), (e => {
                    if (true === t.guardsResult && true !== e) t.guardsResult = false;
                    i.pop();
                }));
            }));
        }
        i.pop();
    }
    B(t, e, i) {
        this.st.trace(`canLoad(next:%s) - invoking ${this.nt.length} hooks`, e);
        const s = this.ctx.root;
        i.push();
        let n = Promise.resolve();
        for (const r of this.nt) {
            i.push();
            n = n.then((() => new Promise((n => {
                if (true !== t.guardsResult) {
                    i.pop();
                    n();
                    return;
                }
                t.run((() => r.canLoad(this.instance, e.params, e, this.routeNode)), (e => {
                    if (true === t.guardsResult && true !== e) t.guardsResult = false === e ? false : ViewportInstructionTree.create(e, this.routerOptions, void 0, s);
                    i.pop();
                    n();
                }));
            }))));
        }
        if (this.ct) {
            i.push();
            n = n.then((() => {
                if (true !== t.guardsResult) {
                    i.pop();
                    return;
                }
                t.run((() => this.instance.canLoad(e.params, e, this.routeNode)), (e => {
                    if (true === t.guardsResult && true !== e) t.guardsResult = false === e ? false : ViewportInstructionTree.create(e, this.routerOptions, void 0, s);
                    i.pop();
                }));
            }));
        }
        i.pop();
    }
    M(t, e, i) {
        this.st.trace(`unloading(next:%s) - invoking ${this.ht.length} hooks`, e);
        i.push();
        for (const s of this.ht) t.run((() => {
            i.push();
            return s.unloading(this.instance, e, this.routeNode);
        }), (() => {
            i.pop();
        }));
        if (this.ft) t.run((() => {
            i.push();
            return this.instance.unloading(e, this.routeNode);
        }), (() => {
            i.pop();
        }));
        i.pop();
    }
    q(t, e, i) {
        this.st.trace(`loading(next:%s) - invoking ${this.rt.length} hooks`, e);
        i.push();
        for (const s of this.rt) t.run((() => {
            i.push();
            return s.loading(this.instance, e.params, e, this.routeNode);
        }), (() => {
            i.pop();
        }));
        if (this.ut) t.run((() => {
            i.push();
            return this.instance.loading(e.params, e, this.routeNode);
        }), (() => {
            i.pop();
        }));
        i.pop();
    }
}

const Gt = i.createInterface("IRouteContext");

const Yt = Object.freeze([ "string", "object", "function" ]);

function Jt(t) {
    if (null == t) return false;
    const e = t.params;
    const i = t.component;
    return "object" === typeof e && null !== e && null != i && Yt.includes(typeof i) && !(i instanceof Promise);
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
        return this.$t;
    }
    constructor(t, e, i, s, r, o) {
        this.parent = e;
        this.component = i;
        this.config = s;
        this.xt = o;
        this.childViewportAgents = [];
        this.childRoutes = [];
        this.dt = null;
        this.gt = null;
        this.prevNode = null;
        this.wt = null;
        this.Et = false;
        this.vt = t;
        if (null === e) {
            this.root = this;
            this.path = [ this ];
            this.friendlyPath = i.name;
        } else {
            this.root = e.root;
            this.path = [ ...e.path, this ];
            this.friendlyPath = `${e.friendlyPath}/${i.name}`;
        }
        this.logger = r.get(n).scopeTo(`RouteContext<${this.friendlyPath}>`);
        this.logger.trace("constructor()");
        this.moduleLoader = r.get(f);
        const h = this.container = r.createChild();
        h.registerResolver(R, this.hostControllerProvider = new d, true);
        h.registerResolver(Gt, new d("IRouteContext", this));
        h.register(s);
        this.bt = new B;
        if (o.options.useNavigationModel) {
            const t = this.$t = new NavigationModel([]);
            h.get(ot).subscribe("au:router:navigation-end", (() => t.setIsActive(o, this)));
        } else this.$t = null;
        this.processConfiguration(s);
    }
    processConfiguration(t) {
        const e = [];
        const i = [];
        const s = t.routes ?? dt;
        const n = s.length;
        if (0 === n) {
            const e = t.component.prototype?.getRouteConfig;
            this.Et = null == e ? true : "function" !== typeof e;
            return;
        }
        const r = this.$t;
        const h = null !== r;
        let a = 0;
        for (;a < n; a++) {
            const n = s[a];
            if (n instanceof Promise) {
                const t = this.addRoute(n);
                e.push(t);
                i.push(t);
            } else {
                const e = vt(n, true, t, null, this);
                if (e instanceof Promise) {
                    if (!G(n) || null == n.path) throw new Error(`Invalid route config. When the component property is a lazy import, the path must be specified.`);
                    for (const t of q(n.path)) this.$addRoute(t, n.caseSensitive ?? false, e);
                    const t = this.childRoutes.length;
                    const s = e.then((e => this.childRoutes[t] = e));
                    this.childRoutes.push(s);
                    if (h) r.addRoute(s);
                    i.push(s.then(p));
                } else {
                    for (const t of e.path ?? o) this.$addRoute(t, e.caseSensitive, e);
                    this.childRoutes.push(e);
                    if (h) r.addRoute(e);
                }
            }
        }
        this.Et = true;
        if (e.length > 0) this.dt = Promise.all(e).then((() => {
            this.dt = null;
        }));
        if (i.length > 0) this.gt = Promise.all(i).then((() => {
            this.gt = null;
        }));
    }
    static setRoot(t) {
        const e = t.get(n).scopeTo("RouteContext");
        if (!t.has(k, true)) Kt(new Error(`The provided container has no registered IAppRoot. RouteContext.setRoot can only be used after Aurelia.app was called, on a container that is within that app's component tree.`), e);
        if (t.has(Gt, true)) Kt(new Error(`A root RouteContext is already registered. A possible cause is the RouterConfiguration being registered more than once in the same container tree. If you have a multi-rooted app, make sure you register RouterConfiguration only in the "forked" containers and not in the common root.`), e);
        const {controller: i} = t.get(k);
        if (void 0 === i) Kt(new Error(`The provided IAppRoot does not (yet) have a controller. A possible cause is calling this API manually before Aurelia.start() is called`), e);
        const s = t.get(Lt);
        return h(s.getRouteContext(null, i.definition, i.viewModel, i.container, null, null, null), (e => {
            t.register(g.instance(Gt, e));
            e.node = s.routeTree.root;
        }));
    }
    static resolve(t, e) {
        const i = t.container;
        const s = i.get(n).scopeTo("RouteContext");
        if (null === e || void 0 === e) {
            s.trace(`resolve(context:%s) - returning root RouteContext`, e);
            return t;
        }
        if (Zt(e)) {
            s.trace(`resolve(context:%s) - returning provided RouteContext`, e);
            return e;
        }
        if (e instanceof i.get(b).Node) try {
            const t = x.for(e, {
                searchParents: true
            });
            s.trace(`resolve(context:Node(nodeName:'${e.nodeName}'),controller:'${t.definition.name}') - resolving RouteContext from controller's RenderContext`);
            return t.container.get(Gt);
        } catch (t) {
            s.error(`Failed to resolve RouteContext from Node(nodeName:'${e.nodeName}')`, t);
            throw t;
        }
        if (w(e)) {
            const t = e.$controller;
            s.trace(`resolve(context:CustomElementViewModel(name:'${t.definition.name}')) - resolving RouteContext from controller's RenderContext`);
            return t.container.get(Gt);
        }
        if (S(e)) {
            const t = e;
            s.trace(`resolve(context:CustomElementController(name:'${t.definition.name}')) - resolving RouteContext from controller's RenderContext`);
            return t.container.get(Gt);
        }
        Kt(new Error(`Invalid context type: ${Object.prototype.toString.call(e)}`), s);
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
        return this.childViewportAgents.find((e => e.j() && e.viewport.name === t && e.viewport.fallback.length > 0)) ?? null;
    }
    createComponentAgent(t, e) {
        this.logger.trace(`createComponentAgent(routeNode:%s)`, e);
        this.hostControllerProvider.prepare(t);
        const i = this.container;
        const s = i.get(e.component.key);
        const n = this.Et ? void 0 : h(vt(s, false, this.config, e, null), (t => this.processConfiguration(t)));
        return h(n, (() => {
            const n = E.$el(i, s, t.host, null);
            const r = new ComponentAgent(s, n, e, this, this.xt.options);
            this.hostControllerProvider.dispose();
            return r;
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
        let i = this;
        let s = true;
        let n = null;
        while (s) {
            n = i.bt.recognize(t);
            if (null === n) {
                if (!e || i.isRoot) return null;
                i = i.parent;
            } else s = false;
        }
        return new $RecognizedRoute(n, Reflect.has(n.params, _) ? n.params[_] ?? null : null);
    }
    addRoute(t) {
        this.logger.trace(`addRoute(routeable:'${t}')`);
        return h(vt(t, true, this.config, null, this), (t => {
            for (const e of t.path ?? o) this.$addRoute(e, t.caseSensitive, t);
            this.$t?.addRoute(t);
            this.childRoutes.push(t);
        }));
    }
    $addRoute(t, e, i) {
        this.bt.add({
            path: t,
            caseSensitive: e,
            handler: i
        }, true);
    }
    resolveLazy(t) {
        return this.moduleLoader.load(t, (e => {
            const i = e.raw;
            if ("function" === typeof i) {
                const t = r.resource.getAll(i).find(Qt);
                if (void 0 !== t) return t;
            }
            let s;
            let n;
            for (const t of e.items) if (t.isConstructable) {
                const e = t.definitions.find(Qt);
                if (void 0 !== e) if ("default" === t.key) s = e; else if (void 0 === n) n = e;
            }
            if (void 0 === s) {
                if (void 0 === n) throw new Error(`${t} does not appear to be a component or CustomElement recognizable by Aurelia`);
                return n;
            }
            return s;
        }));
    }
    generateViewportInstruction(t) {
        if (!Jt(t)) return null;
        const e = t.component;
        let i;
        let s = false;
        if (e instanceof RouteConfig) {
            i = e.path;
            s = true;
        } else if ("string" === typeof e) {
            const t = this.childRoutes.find((t => t.id === e));
            if (void 0 === t) return null;
            i = t.path;
        } else if (0 === e.type) {
            const t = this.childRoutes.find((t => t.id === e.value));
            if (void 0 === t) return null;
            i = t.path;
        } else {
            const t = mt(e, this)[1];
            i = this.childRoutes.reduce(((e, i) => {
                if (i.component === t.Type) e.push(...i.path);
                return e;
            }), []);
            s = true;
        }
        if (void 0 === i) return null;
        const n = t.params;
        const r = this.bt;
        const o = i.length;
        const h = [];
        let a = null;
        if (1 === o) {
            const e = u(i[0]);
            if (null === e) {
                const e = `Unable to eagerly generate path for ${t}. Reasons: ${h}.`;
                if (s) throw new Error(e);
                this.logger.debug(e);
                return null;
            }
            return {
                vi: ViewportInstruction.create({
                    recognizedRoute: new $RecognizedRoute(new L(e.endpoint, e.consumed), null),
                    component: e.path,
                    children: t.children,
                    viewport: t.viewport,
                    open: t.open,
                    close: t.close
                }),
                query: e.query
            };
        }
        let c = 0;
        for (let t = 0; t < o; t++) {
            const e = u(i[t]);
            if (null === e) continue;
            if (null === a) {
                a = e;
                c = Object.keys(e.consumed).length;
            } else if (Object.keys(e.consumed).length > c) a = e;
        }
        if (null === a) {
            const e = `Unable to eagerly generate path for ${t}. Reasons: ${h}.`;
            if (s) throw new Error(e);
            this.logger.debug(e);
            return null;
        }
        return {
            vi: ViewportInstruction.create({
                recognizedRoute: new $RecognizedRoute(new L(a.endpoint, a.consumed), null),
                component: a.path,
                children: t.children,
                viewport: t.viewport,
                open: t.open,
                close: t.close
            }),
            query: a.query
        };
        function u(t) {
            const e = r.getEndpoint(t);
            if (null === e) {
                h.push(`No endpoint found for the path: '${t}'.`);
                return null;
            }
            const i = Object.create(null);
            for (const s of e.params) {
                const e = s.name;
                let r = n[e];
                if (null == r || 0 === String(r).length) {
                    if (!s.isOptional) {
                        h.push(`No value for the required parameter '${e}' is provided for the path: '${t}'.`);
                        return null;
                    }
                    r = "";
                } else i[e] = r;
                const o = s.isStar ? `*${e}` : s.isOptional ? `:${e}?` : `:${e}`;
                t = t.replace(o, r);
            }
            const s = Object.keys(i);
            const o = Object.fromEntries(Object.entries(n).filter((([t]) => !s.includes(t))));
            return {
                path: t.replace(/\/\//g, "/"),
                endpoint: e,
                consumed: i,
                query: o
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

function Zt(t) {
    return t instanceof RouteContext;
}

function Kt(t, e) {
    e.error(t);
    throw t;
}

function Qt(t) {
    return x.isType(t.Type);
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

i.createInterface("INavigationModel");

class NavigationModel {
    constructor(t) {
        this.routes = t;
        this.yt = void 0;
    }
    resolve() {
        return h(this.yt, p);
    }
    setIsActive(t, e) {
        void h(this.yt, (() => {
            for (const i of this.routes) i.setIsActive(t, e);
        }));
    }
    addRoute(t) {
        const e = this.routes;
        if (!(t instanceof Promise)) {
            if (t.nav ?? false) e.push(NavigationRoute.create(t));
            return;
        }
        const i = e.length;
        e.push(void 0);
        let s;
        s = this.yt = h(this.yt, (() => h(t, (t => {
            if (t.nav) e[i] = NavigationRoute.create(t); else e.splice(i, 1);
            if (this.yt === s) this.yt = void 0;
        }))));
    }
}

class NavigationRoute {
    constructor(t, e, i, s, n) {
        this.id = t;
        this.path = e;
        this.redirectTo = i;
        this.title = s;
        this.data = n;
        this.Rt = null;
    }
    static create(t) {
        return new NavigationRoute(t.id, q(t.path ?? o), t.redirectTo, t.title, t.data);
    }
    get isActive() {
        return this.kt;
    }
    setIsActive(t, e) {
        let i = this.Rt;
        if (null === i) {
            const s = t.options;
            i = this.Rt = this.path.map((t => {
                const i = e.bt.getEndpoint(t);
                if (null === i) throw new Error(`No endpoint found for path '${t}'`);
                return new ViewportInstructionTree(NavigationOptions.create(s, {
                    context: e
                }), false, [ ViewportInstruction.create({
                    recognizedRoute: new $RecognizedRoute(new L(i, c), null),
                    component: t
                }) ], Tt, null);
            }));
        }
        this.kt = i.some((e => t.routeTree.contains(e, true)));
    }
}

let Xt = class ViewportCustomElement {
    constructor(t, e) {
        this.logger = t;
        this.ctx = e;
        this.name = Ft;
        this.usedBy = "";
        this.default = "";
        this.fallback = "";
        this.agent = void 0;
        this.controller = void 0;
        this.logger = t.scopeTo(`au-viewport<${e.friendlyPath}>`);
        this.logger.trace("constructor()");
    }
    N(t, e, i) {
        const s = this.fallback;
        return "function" === typeof s ? s(t, e, i) : s;
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
        for (const e of te) {
            const i = this[e];
            switch (typeof i) {
              case "string":
                if ("" !== i) t.push(`${e}:'${i}'`);
                break;

              case "boolean":
                if (i) t.push(`${e}:${i}`);
                break;

              default:
                t.push(`${e}:${String(i)}`);
            }
        }
        return `VP(ctx:'${this.ctx.friendlyPath}',${t.join(",")})`;
    }
};

st([ I ], Xt.prototype, "name", void 0);

st([ I ], Xt.prototype, "usedBy", void 0);

st([ I ], Xt.prototype, "default", void 0);

st([ I ], Xt.prototype, "fallback", void 0);

Xt = st([ C({
    name: "au-viewport"
}), nt(0, n), nt(1, Gt) ], Xt);

const te = [ "name", "usedBy", "default", "fallback" ];

let ee = class LoadCustomAttribute {
    constructor(t, e, i, s, n, r) {
        this.target = t;
        this.el = e;
        this.router = i;
        this.events = s;
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
        let s = this.context;
        if (void 0 === s) s = this.context = this.ctx; else if (null === s) s = this.context = this.ctx.root;
        if (null != i && null === s.allResolved) {
            const n = this.params;
            const r = this.instructions = t.createViewportInstructions("object" === typeof n && null !== n ? {
                component: i,
                params: n
            } : i, {
                context: s
            });
            this.href = r.toUrl(e);
        } else {
            this.instructions = null;
            this.href = null;
        }
        const n = x.for(this.el, {
            optional: true
        });
        if (null !== n) n.viewModel[this.attribute] = this.instructions; else if (null === this.href) this.el.removeAttribute(this.attribute); else {
            const t = e ? this.href : this.locationMgr.addBaseHref(this.href);
            this.el.setAttribute(this.attribute, t);
        }
    }
};

st([ I({
    mode: 2,
    primary: true,
    callback: "valueChanged"
}) ], ee.prototype, "route", void 0);

st([ I({
    mode: 2,
    callback: "valueChanged"
}) ], ee.prototype, "params", void 0);

st([ I({
    mode: 2
}) ], ee.prototype, "attribute", void 0);

st([ I({
    mode: 4
}) ], ee.prototype, "active", void 0);

st([ I({
    mode: 2,
    callback: "valueChanged"
}) ], ee.prototype, "context", void 0);

ee = st([ N("load"), nt(0, V), nt(1, A), nt(2, Lt), nt(3, ot), nt(4, Gt), nt(5, ct) ], ee);

let ie = class HrefCustomAttribute {
    get isExternal() {
        return this.el.hasAttribute("external") || this.el.hasAttribute("data-external");
    }
    constructor(t, e, i, s, n) {
        this.target = t;
        this.el = e;
        this.router = i;
        this.ctx = s;
        this.isInitialized = false;
        if (i.options.useHref && "A" === e.nodeName) switch (e.getAttribute("target")) {
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
            this.isEnabled = this.isEnabled && null === T(this.el, P.getDefinition(ee).key);
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
        this.St(t);
    }
    St(t) {
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

st([ I({
    mode: 2
}) ], ie.prototype, "value", void 0);

ie = st([ N({
    name: "href",
    noMultiBindings: true
}), nt(0, V), nt(1, A), nt(2, Lt), nt(3, Gt), nt(4, $) ], ie);

const se = Lt;

const ne = [ se ];

const re = Xt;

const oe = ee;

const he = ie;

const ae = [ Xt, ee, ie ];

function ce(t, i) {
    let s = null;
    if (e(i)) s = i.basePath ?? null; else i = {};
    const n = RouterOptions.create(i);
    return t.register(g.cachedCallback(at, ((t, e, i) => {
        const n = t.get($);
        const r = new URL(n.document.baseURI);
        r.pathname = lt(s ?? r.pathname);
        return r;
    })), g.instance(it, n), U.hydrated(u, RouteContext.setRoot), U.activated(Lt, (t => t.start(true))), U.deactivated(Lt, (t => {
        t.stop();
    })), ...ne, ...ae);
}

const ue = {
    register(t) {
        return ce(t);
    },
    customize(t) {
        return {
            register(e) {
                return ce(e, t);
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

function le(t) {
    t.restore();
}

class HostElementState {
    constructor(t) {
        this.scrollStates = [];
        this.save(t.children);
    }
    save(t) {
        let e;
        for (let i = 0, s = t.length; i < s; ++i) {
            e = t[i];
            if (ScrollState.has(e)) this.scrollStates.push(new ScrollState(e));
            this.save(e.children);
        }
    }
    restore() {
        this.scrollStates.forEach(le);
        this.scrollStates = null;
    }
}

const fe = i.createInterface("IStateManager", (t => t.singleton(ScrollStateManager)));

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

export { qt as AST, ActionExpression, rt as AuNavId, ComponentAgent, ComponentExpression, CompositeSegmentExpression, ne as DefaultComponents, ae as DefaultResources, Bt as ExpressionKind, ie as HrefCustomAttribute, he as HrefCustomAttributeRegistration, ct as ILocationManager, Gt as IRouteContext, Lt as IRouter, ot as IRouterEvents, it as IRouterOptions, fe as IStateManager, ee as LoadCustomAttribute, oe as LoadCustomAttributeRegistration, LocationChangeEvent, NavigationCancelEvent, NavigationEndEvent, NavigationErrorEvent, NavigationOptions, NavigationStartEvent, ParameterExpression, ParameterListExpression, gt as Route, RouteConfig, RouteContext, RouteExpression, RouteNode, RouteTree, Ot as Router, ue as RouterConfiguration, RouterOptions, se as RouterRegistration, ScopedSegmentExpression, SegmentExpression, SegmentGroupExpression, Transition, ViewportAgent, Xt as ViewportCustomElement, re as ViewportCustomElementRegistration, ViewportExpression, Pt as isManagedState, wt as route, Ut as toManagedState };
//# sourceMappingURL=index.mjs.map
