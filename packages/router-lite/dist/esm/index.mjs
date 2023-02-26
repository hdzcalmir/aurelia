import { Metadata as t, isObject as e } from "@aurelia/metadata";

import { DI as i, IEventAggregator as s, ILogger as n, Protocol as r, emptyArray as o, onResolve as h, emptyObject as a, resolveAll as c, IContainer as u, isArrayIndex as l, IModuleLoader as f, InstanceProvider as d, noop as p, Registration as g } from "@aurelia/kernel";

import { isCustomElementViewModel as w, IHistory as v, ILocation as m, IWindow as $, CustomElement as x, Controller as E, IPlatform as b, CustomElementDefinition as R, IController as y, IAppRoot as k, isCustomElementController as S, customElement as C, bindable as I, customAttribute as N, IEventTarget as V, INode as A, getRef as T, CustomAttribute as P, AppTask as U } from "@aurelia/runtime-html";

import { RecognizedRoute as L, Endpoint as O, ConfigurableRoute as j, RESIDUE as D, RouteRecognizer as B } from "@aurelia/route-recognizer";

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

function H(t, e, i) {
    const s = i ? new URLSearchParams(t) : t;
    if (null == e) return s;
    for (const [t, i] of Object.entries(e)) s.append(t, i);
    return s;
}

function _(t) {
    return "object" === typeof t && null !== t && !w(t);
}

function W(t) {
    return _(t) && true === Object.prototype.hasOwnProperty.call(t, "name");
}

function G(t) {
    return _(t) && true === Object.prototype.hasOwnProperty.call(t, "component");
}

function Y(t) {
    return _(t) && true === Object.prototype.hasOwnProperty.call(t, "redirectTo");
}

function J(t) {
    return _(t) && true === Object.prototype.hasOwnProperty.call(t, "component");
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
    constructor(t, e, i, s, n, r, o, h, a, c, u, l) {
        this.id = t;
        this.path = e;
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
    }
    static u(t, e, i) {
        if ("string" === typeof t || t instanceof Array) {
            const s = t;
            const n = e?.redirectTo ?? null;
            const r = e?.caseSensitive ?? false;
            const o = e?.id ?? (s instanceof Array ? s[0] : s);
            const h = e?.title ?? null;
            const a = e?.transitionPlan ?? i?.transitionPlan ?? null;
            const c = e?.viewport ?? null;
            const u = e?.data ?? {};
            const l = e?.routes ?? dt;
            return new RouteConfig(o, s, h, n, r, a, c, u, l, e?.fallback ?? null, null, e?.nav ?? true);
        } else if ("object" === typeof t) {
            const s = t;
            K(s, "");
            const n = s.path ?? e?.path ?? null;
            const r = s.title ?? e?.title ?? null;
            const o = s.redirectTo ?? e?.redirectTo ?? null;
            const h = s.caseSensitive ?? e?.caseSensitive ?? false;
            const a = s.id ?? e?.id ?? (n instanceof Array ? n[0] : n);
            const c = s.transitionPlan ?? e?.transitionPlan ?? i?.transitionPlan ?? null;
            const u = s.viewport ?? e?.viewport ?? null;
            const l = {
                ...e?.data,
                ...s.data
            };
            const f = [ ...s.routes ?? dt, ...e?.routes ?? dt ];
            return new RouteConfig(a, n, r, o, h, c, u, l, f, s.fallback ?? e?.fallback ?? null, s.component ?? null, s.nav ?? true);
        } else Z("string, function/class or object", "", t);
    }
    applyChildRouteConfig(t, e) {
        let i = this.path ?? "";
        if ("string" !== typeof i) i = i[0];
        K(t, i);
        return new RouteConfig(t.id ?? this.id, t.path ?? this.path, t.title ?? this.title, t.redirectTo ?? this.redirectTo, t.caseSensitive ?? this.caseSensitive, t.transitionPlan ?? this.transitionPlan ?? e?.transitionPlan ?? null, t.viewport ?? this.viewport, t.data ?? this.data, t.routes ?? this.routes, t.fallback ?? this.fallback, t.component ?? this.component, t.nav ?? this.nav);
    }
    getTransitionPlan(t, e) {
        const i = this.transitionPlan ?? pt;
        return "function" === typeof i ? i(t, e) : i;
    }
}

const gt = {
    name: r.resource.keyFor("route-configuration"),
    isConfigured(e) {
        return t.hasOwn(gt.name, e);
    },
    configure(e, i) {
        const s = RouteConfig.u(e, i, null);
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

class RouteDefinition {
    constructor(t, e, i) {
        this.config = t;
        this.component = e;
        this.hasExplicitPath = null !== t.path;
        this.caseSensitive = t.caseSensitive;
        this.path = q(t.path ?? e.name);
        this.redirectTo = t.redirectTo ?? null;
        this.viewport = t.viewport ?? zt;
        this.id = F(t.id ?? this.path);
        this.data = t.data ?? {};
        this.fallback = t.fallback ?? i?.fallback ?? null;
    }
    $(t, e, i) {
        const s = this.fallback;
        return "function" === typeof s ? s(t, e, i) : s;
    }
    static resolve(t, e, i, s) {
        const n = e?.config ?? null;
        if (Y(t)) return new RouteDefinition(RouteConfig.u(t, null, n), null, e);
        const r = this.createNavigationInstruction(t);
        let o;
        switch (r.type) {
          case 0:
            {
                if (void 0 === s) throw new Error(`When retrieving the RouteDefinition for a component name, a RouteContext (that can resolve it) must be provided`);
                const t = s.container.find(x, r.value);
                if (null === t) throw new Error(`Could not find a CustomElement named '${r.value}' in the current container scope of ${s}. This means the component is neither registered at Aurelia startup nor via the 'dependencies' decorator or static property.`);
                o = t;
                break;
            }

          case 2:
            o = r.value;
            break;

          case 4:
            o = x.getDefinition(r.value.constructor);
            break;

          case 3:
            if (void 0 === s) throw new Error(`RouteContext must be provided when resolving an imported module`);
            o = s.resolveLazy(r.value);
            break;
        }
        return h(o, (s => {
            let o = vt.get(s);
            const c = 4 === r.type && "function" === typeof t.getRouteConfig;
            if (null === o) {
                const r = s.Type;
                if (c) return h(t.getRouteConfig(e, i), (t => {
                    const i = RouteConfig.u(t ?? a, r, n);
                    o = new RouteDefinition(i, s, e);
                    vt.define(o, s);
                    return o;
                }));
                const u = G(t) ? gt.isConfigured(r) ? gt.getConfig(r).applyChildRouteConfig(t, n) : RouteConfig.u(t, r, n) : gt.getConfig(s.Type);
                o = new RouteDefinition(u, s, e);
                vt.define(o, s);
            } else if (0 === o.config.routes.length && c) return h(t.getRouteConfig?.(e, i), (t => {
                o.applyChildRouteConfig(t ?? a);
                return o;
            }));
            return o;
        }));
    }
    static createNavigationInstruction(t) {
        return G(t) ? this.createNavigationInstruction(t.component) : TypedNavigationInstruction.create(t);
    }
    applyChildRouteConfig(t) {
        this.config = t = this.config.applyChildRouteConfig(t, null);
        this.hasExplicitPath = null !== t.path;
        this.caseSensitive = t.caseSensitive ?? this.caseSensitive;
        this.path = q(t.path ?? this.path);
        this.redirectTo = t.redirectTo ?? null;
        this.viewport = t.viewport ?? zt;
        this.id = F(t.id ?? this.path);
        this.data = t.data ?? {};
        this.fallback = t.fallback ?? this.fallback;
    }
    register(t) {
        this.component?.register(t);
    }
    toString() {
        const t = null === this.config.path ? "null" : `'${this.config.path}'`;
        if (null !== this.component) return `RD(config.path:${t},c.name:'${this.component.name}',vp:'${this.viewport}')`; else return `RD(config.path:${t},redirectTo:'${this.redirectTo}')`;
    }
}

const vt = {
    name: r.resource.keyFor("route-definition"),
    isDefined(e) {
        return t.hasOwn(vt.name, e);
    },
    define(e, i) {
        t.define(vt.name, e, i);
    },
    get(e) {
        return vt.isDefined(e) ? t.getOwn(vt.name, e) : null;
    }
};

class ViewportRequest {
    constructor(t, e) {
        this.viewportName = t;
        this.componentName = e;
    }
    toString() {
        return `VR(viewport:'${this.viewportName}',component:'${this.componentName}')`;
    }
}

const mt = new WeakMap;

class ViewportAgent {
    get $state() {
        return Rt(this.state);
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
        this.R = null;
        this.logger = i.container.get(n).scopeTo(`ViewportAgent<${i.friendlyPath}>`);
        this.logger.trace(`constructor()`);
    }
    static for(t, e) {
        let i = mt.get(t);
        if (void 0 === i) {
            const s = E.getCachedOrThrow(t);
            mt.set(t, i = new ViewportAgent(t, s, e));
        }
        return i;
    }
    activateFromViewport(t, e, i) {
        const s = this.currTransition;
        if (null !== s) xt(s);
        this.isActive = true;
        switch (this.nextState) {
          case 64:
            switch (this.currState) {
              case 8192:
                this.logger.trace(`activateFromViewport() - nothing to activate at %s`, this);
                return;

              case 4096:
                this.logger.trace(`activateFromViewport() - activating existing componentAgent at %s`, this);
                return this.curCA.activate(t, e, i);

              default:
                this.unexpectedState("activateFromViewport 1");
            }

          case 2:
            {
                if (null === this.currTransition) throw new Error(`Unexpected viewport activation outside of a transition context at ${this}`);
                this.logger.trace(`activateFromViewport() - running ordinary activate at %s`, this);
                const e = Batch.start((e => {
                    this.activate(t, this.currTransition, e);
                }));
                const i = new Promise((t => {
                    e.continueWith((() => {
                        t();
                    }));
                }));
                return e.start().done ? void 0 : i;
            }

          default:
            this.unexpectedState("activateFromViewport 2");
        }
    }
    deactivateFromViewport(t, e, i) {
        const s = this.currTransition;
        if (null !== s) xt(s);
        this.isActive = false;
        switch (this.currState) {
          case 8192:
            this.logger.trace(`deactivateFromViewport() - nothing to deactivate at %s`, this);
            return;

          case 4096:
            this.logger.trace(`deactivateFromViewport() - deactivating existing componentAgent at %s`, this);
            return this.curCA.deactivate(t, e, i);

          case 128:
            this.logger.trace(`deactivateFromViewport() - already deactivating at %s`, this);
            return;

          default:
            {
                if (null === this.currTransition) throw new Error(`Unexpected viewport deactivation outside of a transition context at ${this}`);
                this.logger.trace(`deactivateFromViewport() - running ordinary deactivate at %s`, this);
                const e = Batch.start((e => {
                    this.deactivate(t, this.currTransition, e);
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
    handles(t) {
        if (!this.isAvailable()) return false;
        const e = this.viewport;
        const i = t.viewportName;
        const s = e.name;
        if (i !== zt && s !== i) {
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
    isAvailable() {
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
    canUnload(t, e) {
        if (null === this.currTransition) this.currTransition = t;
        xt(t);
        if (true !== t.guardsResult) return;
        e.push();
        void h(this.R, (() => {
            Batch.start((e => {
                this.logger.trace(`canUnload() - invoking on children at %s`, this);
                for (const i of this.currNode.children) i.context.vpa.canUnload(t, e);
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
                            this.curCA.canUnload(t, this.nextNode, e);
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
    canLoad(t, e) {
        if (null === this.currTransition) this.currTransition = t;
        xt(t);
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
                    return this.curCA.canLoad(t, this.nextNode, e);

                  case "replace":
                    e.push();
                    void h(this.nextNode.context.createComponentAgent(this.hostController, this.nextNode), (i => {
                        (this.nextCA = i).canLoad(t, this.nextNode, e);
                        e.pop();
                    }));
                }

              case 64:
                this.logger.trace(`canLoad() - nothing to load at %s`, this);
                return;

              default:
                this.unexpectedState("canLoad");
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
                    void h(i.resolved, (() => h(h(c(...e.residue.splice(0).map((t => St(this.logger, e, t)))), (() => c(...i.getAvailableViewportAgents().reduce(((t, i) => {
                        const s = i.viewport;
                        const n = s.default;
                        if (null === n) return t;
                        t.push(St(this.logger, e, ViewportInstruction.create({
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
                for (const i of this.nextNode.children) i.context.vpa.canLoad(t, e);
                return;

              case 64:
                return;

              default:
                this.unexpectedState("canLoad");
            }
        })).continueWith((() => {
            this.logger.trace(`canLoad() - finished at %s`, this);
            e.pop();
        })).start();
    }
    unloading(t, e) {
        xt(t);
        $t(this, t);
        e.push();
        Batch.start((e => {
            this.logger.trace(`unloading() - invoking on children at %s`, this);
            for (const i of this.currNode.children) i.context.vpa.unloading(t, e);
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
                        this.curCA.unloading(t, this.nextNode, e);
                    })).continueWith((() => {
                        this.logger.trace(`unloading() - finished at %s`, this);
                        this.currState = 256;
                        i.pop();
                    })).start();
                    return;
                }

              case 8192:
                this.logger.trace(`unloading() - nothing to unload at %s`, this);
                for (const i of this.currNode.children) i.context.vpa.unloading(t, e);
                return;

              default:
                this.unexpectedState("unloading");
            }
        })).continueWith((() => {
            e.pop();
        })).start();
    }
    loading(t, e) {
        xt(t);
        $t(this, t);
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
                    return this.curCA.loading(t, this.nextNode, e);

                  case "replace":
                    return this.nextCA.loading(t, this.nextNode, e);
                }

              case 64:
                this.logger.trace(`loading() - nothing to load at %s`, this);
                return;

              default:
                this.unexpectedState("loading");
            }
        })).continueWith((e => {
            switch (this.nextState) {
              case 4:
                this.logger.trace(`loading() - finished own component, now invoking on children at %s`, this);
                this.nextState = 2;
                for (const i of this.nextNode.children) i.context.vpa.loading(t, e);
                return;

              case 64:
                return;

              default:
                this.unexpectedState("loading");
            }
        })).continueWith((() => {
            this.logger.trace(`loading() - finished at %s`, this);
            e.pop();
        })).start();
    }
    deactivate(t, e, i) {
        xt(e);
        $t(this, e);
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
                    e.run((() => this.curCA.deactivate(t, s, 4)), (() => {
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
            this.unexpectedState("deactivate");
        }
    }
    activate(t, e, i) {
        xt(e);
        $t(this, e);
        i.push();
        if (32 === this.nextState) {
            this.logger.trace(`activate() - invoking canLoad(), loading() and activate() on new component due to resolution 'dynamic' at %s`, this);
            Batch.start((t => {
                this.canLoad(e, t);
            })).continueWith((t => {
                this.loading(e, t);
            })).continueWith((i => {
                this.activate(t, e, i);
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
                        const n = 0;
                        e.run((() => {
                            i.push();
                            return this.nextCA.activate(t, s, n);
                        }), (() => {
                            i.pop();
                        }));
                    }
                }
            })).continueWith((t => {
                this.processDynamicChildren(e, t);
            })).continueWith((() => {
                i.pop();
            })).start();
            return;

          case 64:
            this.logger.trace(`activate() - nothing to activate at %s`, this);
            i.pop();
            return;

          default:
            this.unexpectedState("activate");
        }
    }
    swap(t, e) {
        if (8192 === this.currState) {
            this.logger.trace(`swap() - running activate on next instead, because there is nothing to deactivate at %s`, this);
            this.activate(null, t, e);
            return;
        }
        if (64 === this.nextState) {
            this.logger.trace(`swap() - running deactivate on current instead, because there is nothing to activate at %s`, this);
            this.deactivate(null, t, e);
            return;
        }
        xt(t);
        $t(this, t);
        if (!(256 === this.currState && 2 === this.nextState)) this.unexpectedState("swap");
        this.currState = 128;
        this.nextState = 1;
        switch (this.$plan) {
          case "none":
          case "invoke-lifecycles":
            {
                this.logger.trace(`swap() - skipping this level and swapping children instead at %s`, this);
                const i = M(this.nextNode.children, this.currNode.children);
                for (const s of i) s.context.vpa.swap(t, e);
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
                        return s.deactivate(null, i, 4);
                    }), (() => {
                        e.pop();
                    }));
                })).continueWith((e => {
                    t.run((() => {
                        e.push();
                        return n.activate(null, i, 0);
                    }), (() => {
                        e.pop();
                    }));
                })).continueWith((e => {
                    this.processDynamicChildren(t, e);
                })).continueWith((() => {
                    e.pop();
                })).start();
                return;
            }
        }
    }
    processDynamicChildren(t, e) {
        this.logger.trace(`processDynamicChildren() - %s`, this);
        const i = this.nextNode;
        t.run((() => {
            e.push();
            const t = i.context;
            return h(t.resolved, (() => {
                const e = i.children.slice();
                return h(c(...i.residue.splice(0).map((t => St(this.logger, i, t)))), (() => h(c(...t.getAvailableViewportAgents().reduce(((t, e) => {
                    const s = e.viewport;
                    const n = s.default;
                    if (null === n) return t;
                    t.push(St(this.logger, i, ViewportInstruction.create({
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
                    return s.context.vpa.canLoad(t, e);
                }), (() => {
                    e.pop();
                }));
            })).continueWith((e => {
                for (const s of i) t.run((() => {
                    e.push();
                    return s.context.vpa.loading(t, e);
                }), (() => {
                    e.pop();
                }));
            })).continueWith((e => {
                for (const s of i) t.run((() => {
                    e.push();
                    return s.context.vpa.activate(null, t, e);
                }), (() => {
                    e.pop();
                }));
            })).continueWith((() => {
                e.pop();
            })).start();
        }));
    }
    scheduleUpdate(t, e) {
        switch (this.nextState) {
          case 64:
            this.nextNode = e;
            this.nextState = 32;
            break;

          default:
            this.unexpectedState("scheduleUpdate 1");
        }
        switch (this.currState) {
          case 8192:
          case 4096:
          case 1024:
            break;

          default:
            this.unexpectedState("scheduleUpdate 2");
        }
        const i = this.curCA?.routeNode ?? null;
        if (null === i || i.component !== e.component) this.$plan = "replace"; else this.$plan = e.context.definition.config.getTransitionPlan(i, e);
        this.logger.trace(`scheduleUpdate(next:%s) - plan set to '%s'`, e, this.$plan);
    }
    cancelUpdate() {
        if (null !== this.currNode) this.currNode.children.forEach((function(t) {
            t.context.vpa.cancelUpdate();
        }));
        if (null !== this.nextNode) this.nextNode.children.forEach((function(t) {
            t.context.vpa.cancelUpdate();
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
            this.R = h(this.nextCA?.deactivate(null, this.hostController, 0), (() => {
                this.nextCA?.dispose();
                this.$plan = "replace";
                this.nextState = 64;
                this.nextCA = null;
                this.nextNode = null;
                this.currTransition = null;
                this.R = null;
            }));
            break;
        }
    }
    endTransition() {
        if (null !== this.currNode) this.currNode.children.forEach((function(t) {
            t.context.vpa.endTransition();
        }));
        if (null !== this.nextNode) this.nextNode.children.forEach((function(t) {
            t.context.vpa.endTransition();
        }));
        if (null !== this.currTransition) {
            xt(this.currTransition);
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
                    this.unexpectedState("endTransition 1");
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
                    this.unexpectedState("endTransition 2");
                }
                break;

              default:
                this.unexpectedState("endTransition 3");
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
    dispose() {
        this.logger.trace(`dispose() - disposing %s`, this);
        this.curCA?.dispose();
    }
    unexpectedState(t) {
        throw new Error(`Unexpected state at ${t} of ${this}`);
    }
}

function $t(t, e) {
    if (true !== e.guardsResult) throw new Error(`Unexpected guardsResult ${e.guardsResult} at ${t}`);
}

function xt(t) {
    if (void 0 !== t.error && !t.erredWithUnknownRoute) throw t.error;
}

var Et;

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
})(Et || (Et = {}));

const bt = new Map;

function Rt(t) {
    let e = bt.get(t);
    if (void 0 === e) bt.set(t, e = yt(t));
    return e;
}

function yt(t) {
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

let kt = 0;

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
        const {[D]: e, ...i} = t.params ?? {};
        return new RouteNode(++kt, t.path, t.finalPath, t.context, t.originalInstruction ?? t.instruction, t.instruction, i, t.queryParams ?? Vt, t.fragment ?? null, t.data ?? {}, t.viewport ?? null, t.title ?? null, t.component, t.children ?? [], t.residue ?? []);
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
            t.context.vpa.cancelUpdate();
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
        const e = this.context?.definition.component?.name ?? "";
        if (e.length > 0) t.push(`c:'${e}'`);
        const i = this.context?.definition.config.path ?? "";
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

function St(t, e, i) {
    t.trace(`createAndAppendNodes(node:%s,vi:%s`, e, i);
    switch (i.component.type) {
      case 0:
        switch (i.component.value) {
          case "..":
            e = e.context.parent?.node ?? e;
            e.clearChildren();

          case ".":
            return c(...i.children.map((i => St(t, e, i))));

          default:
            {
                t.trace(`createAndAppendNodes invoking createNode`);
                const s = e.context;
                const n = i.clone();
                let r = i.recognizedRoute;
                if (null !== r) return It(t, e, Ct(t, e, i, r, n));
                if (0 === i.children.length) {
                    const n = s.generateViewportInstruction(i);
                    if (null !== n) {
                        e.tree.queryParams = H(e.tree.queryParams, n.query, true);
                        const s = n.vi;
                        s.children.push(...i.children);
                        return It(t, e, Ct(t, e, s, s.recognizedRoute, i));
                    }
                }
                let o = 0;
                let h = i.component.value;
                let c = i;
                while (1 === c.children.length) {
                    c = c.children[0];
                    if (0 === c.component.type) {
                        ++o;
                        h = `${h}/${c.component.value}`;
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
                        params: i.params ?? a,
                        open: i.open,
                        close: i.close,
                        viewport: i.viewport,
                        children: i.children.slice()
                    });
                    if (null !== n) {
                        e.tree.queryParams = H(e.tree.queryParams, n.query, true);
                        return It(t, e, Ct(t, e, n.vi, n.vi.recognizedRoute, i));
                    }
                    const r = i.component.value;
                    if ("" === r) return;
                    let o = i.viewport;
                    if (null === o || 0 === o.length) o = zt;
                    const h = s.getFallbackViewportAgent(o);
                    const c = null !== h ? h.viewport.$(i, e, s) : s.definition.$(i, e, s);
                    if (null === c) throw new UnknownRouteError(`Neither the route '${r}' matched any configured route at '${s.friendlyPath}' nor a fallback is configured for the viewport '${o}' - did you forget to add '${r}' to the routes list of the route decorator of '${s.component.name}'?`);
                    t.trace(`Fallback is set to '${c}'. Looking for a recognized route.`);
                    const u = s.childRoutes.find((t => t.id === c));
                    if (void 0 !== u) return It(t, e, Nt(t, u, e, i));
                    t.trace(`No route definition for the fallback '${c}' is found; trying to recognize the route.`);
                    const l = s.recognize(c, true);
                    if (null !== l && l.residue !== c) return It(t, e, Ct(t, e, i, l, null));
                    t.trace(`The fallback '${c}' is not recognized as a route; treating as custom element name.`);
                    return It(t, e, Nt(t, RouteDefinition.resolve(c, s.definition, null, s), e, i));
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
                return It(t, e, Ct(t, e, i, r, n));
            }
        }

      case 3:
      case 4:
      case 2:
        {
            const s = e.context;
            return h(RouteDefinition.resolve(i.component.value, s.definition, null, s), (n => {
                const {vi: r, query: o} = s.generateViewportInstruction({
                    component: n,
                    params: i.params ?? a,
                    open: i.open,
                    close: i.close,
                    viewport: i.viewport,
                    children: i.children.slice()
                });
                e.tree.queryParams = H(e.tree.queryParams, o, true);
                return It(t, e, Ct(t, e, r, r.recognizedRoute, i));
            }));
        }
    }
}

function Ct(t, e, i, s, n, r = s.route.endpoint.route) {
    const o = e.context;
    const a = e.tree;
    return h(r.handler, (c => {
        r.handler = c;
        t.trace(`creatingConfiguredNode(rd:%s, vi:%s)`, c, i);
        if (null === c.redirectTo) {
            const u = (i.viewport?.length ?? 0) > 0 ? i.viewport : c.viewport;
            const l = c.component;
            const f = o.resolveViewportAgent(new ViewportRequest(u, l.name));
            const d = o.container.get(Pt);
            return h(d.getRouteContext(f, l, null, f.hostController.container, o.definition), (o => {
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
                    title: c.config.title,
                    residue: [ ...null === s.residue ? [] : [ ViewportInstruction.create(s.residue) ], ...i.children ]
                });
                h.setTree(e.tree);
                t.trace(`createConfiguredNode(vi:%s) -> %s`, i, h);
                return h;
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
        return Ct(t, e, ViewportInstruction.create({
            recognizedRoute: x,
            component: $,
            children: i.children,
            viewport: i.viewport,
            open: i.open,
            close: i.close
        }), x, n);
    }));
}

function It(t, e, i) {
    return h(i, (i => {
        t.trace(`appendNode($childNode:%s)`, i);
        e.appendChild(i);
        return i.context.vpa.scheduleUpdate(e.tree.options, i);
    }));
}

function Nt(t, e, i, s) {
    const n = new $RecognizedRoute(new L(new O(new j(e.path[0], e.caseSensitive, e), []), a), null);
    s.children.length = 0;
    return Ct(t, i, s, n, null);
}

const Vt = Object.freeze(new URLSearchParams);

function At(t) {
    return e(t) && true === Object.prototype.hasOwnProperty.call(t, rt);
}

function Tt(t, e) {
    return {
        ...t,
        [rt]: e
    };
}

class UnknownRouteError extends Error {}

class Transition {
    get erredWithUnknownRoute() {
        return this.C;
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
        this.C = false;
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
        this.C = t instanceof UnknownRouteError;
        this.reject(this.error = t);
    }
    toString() {
        return `T(id:${this.id},trigger:'${this.trigger}',instructions:${this.instructions},options:${this.options})`;
    }
}

const Pt = i.createInterface("IRouter", (t => t.singleton(Ut)));

let Ut = class Router {
    get ctx() {
        let t = this.I;
        if (null === t) {
            if (!this.container.has(_t, true)) throw new Error(`Root RouteContext is not set. Did you forget to register RouteConfiguration, or try to navigate before calling Aurelia.start()?`);
            t = this.I = this.container.get(_t);
        }
        return t;
    }
    get routeTree() {
        let t = this.N;
        if (null === t) {
            const e = this.ctx;
            t = this.N = new RouteTree(NavigationOptions.create(this.options, {}), Vt, null, RouteNode.create({
                path: "",
                finalPath: "",
                context: e,
                instruction: null,
                component: e.definition.component,
                title: e.definition.config.title
            }));
        }
        return t;
    }
    get currentTr() {
        let t = this.V;
        if (null === t) t = this.V = Transition.create({
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
        this.V = t;
    }
    get isNavigating() {
        return this.A;
    }
    constructor(t, e, i, s, n, r) {
        this.container = t;
        this.p = e;
        this.logger = i;
        this.events = s;
        this.locationMgr = n;
        this.options = r;
        this.I = null;
        this.N = null;
        this.V = null;
        this.navigated = false;
        this.navigationId = 0;
        this.nextTr = null;
        this.locationChangeSubscription = null;
        this.T = false;
        this.A = false;
        this.P = false;
        this.vpaLookup = new Map;
        this.logger = i.root.scopeTo("Router");
        this.instructions = ViewportInstructionTree.create("", r);
    }
    resolveContext(t) {
        return RouteContext.resolve(this.ctx, t);
    }
    start(t) {
        this.T = "function" === typeof this.options.buildTitle;
        this.locationMgr.startListening();
        this.locationChangeSubscription = this.events.subscribe("au:router:location-change", (t => {
            this.p.taskQueue.queueTask((() => {
                const e = At(t.state) ? t.state : null;
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
    getRouteContext(t, e, i, s, r) {
        const o = s.get(n).scopeTo("RouteContext");
        return h(RouteDefinition.resolve("function" === typeof i?.getRouteConfig ? i : e.Type, r, null), (i => {
            let n = this.vpaLookup.get(t);
            if (void 0 === n) this.vpaLookup.set(t, n = new WeakMap);
            let r = n.get(i);
            if (void 0 !== r) {
                o.trace(`returning existing RouteContext for %s`, i);
                return r;
            }
            o.trace(`creating new RouteContext for %s`, i);
            const h = s.has(_t, true) ? s.get(_t) : null;
            n.set(i, r = new RouteContext(t, h, e, i, s, this));
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
            routeTree: this.N = this.routeTree.clone(),
            guardsResult: true,
            error: void 0
        });
        r.debug(`Scheduling transition: %s`, c);
        if (!this.A) try {
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
                this.A = false;
                this.events.publish(new NavigationErrorEvent(c.id, c.instructions, t));
                const e = this.nextTr;
                if (null !== e) e.previousRouteTree = c.previousRouteTree; else this.N = c.previousRouteTree;
            }
            throw t;
        }));
    }
    run(t) {
        this.currentTr = t;
        this.nextTr = null;
        this.A = true;
        let e = this.resolveContext(t.options.context);
        const i = t.instructions.children;
        const s = e.node.children;
        const r = this.options.useUrlFragmentHash;
        const o = !this.navigated || this.P || t.trigger === (r ? "hashchange" : "popstate") || i.length !== s.length || i.some(((t, e) => !(s[e]?.originalInstruction.equals(t) ?? false))) || "replace" === this.ctx.definition.config.getTransitionPlan(t.previousRouteTree.root, t.routeTree.root);
        if (!o) {
            this.logger.trace(`run(tr:%s) - NOT processing route`, t);
            this.navigated = true;
            this.A = false;
            t.resolve(false);
            this.runNextTransition();
            return;
        }
        this.P = false;
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
            return h(e.resolved, (() => Lt(o, i, e, s.node)));
        }), (() => {
            const e = t.previousRouteTree.root.children;
            const i = t.routeTree.root.children;
            const s = M(e, i);
            Batch.start((i => {
                this.logger.trace(`run() - invoking canUnload on ${e.length} nodes`);
                for (const s of e) s.context.vpa.canUnload(t, i);
            })).continueWith((e => {
                if (true !== t.guardsResult) {
                    e.push();
                    this.P = false === t.guardsResult;
                    this.cancelNavigation(t);
                }
            })).continueWith((e => {
                this.logger.trace(`run() - invoking canLoad on ${i.length} nodes`);
                for (const s of i) s.context.vpa.canLoad(t, e);
            })).continueWith((e => {
                if (true !== t.guardsResult) {
                    e.push();
                    this.cancelNavigation(t);
                }
            })).continueWith((i => {
                this.logger.trace(`run() - invoking unloading on ${e.length} nodes`);
                for (const s of e) s.context.vpa.unloading(t, i);
            })).continueWith((e => {
                this.logger.trace(`run() - invoking loading on ${i.length} nodes`);
                for (const s of i) s.context.vpa.loading(t, e);
            })).continueWith((e => {
                this.logger.trace(`run() - invoking swap on ${s.length} nodes`);
                for (const i of s) i.context.vpa.swap(t, e);
            })).continueWith((() => {
                this.logger.trace(`run() - finalizing transition`);
                s.forEach((function(t) {
                    t.context.vpa.endTransition();
                }));
                this.navigated = true;
                this.instructions = t.finalInstructions = t.routeTree.finalizeInstructions();
                this.A = false;
                const e = t.finalInstructions.toUrl(r);
                switch (t.options.i(this.instructions)) {
                  case "none":
                    break;

                  case "push":
                    this.locationMgr.pushState(Tt(t.options.state, t.id), this.updateTitle(t), e);
                    break;

                  case "replace":
                    this.locationMgr.replaceState(Tt(t.options.state, t.id), this.updateTitle(t), e);
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
        if (this.T) e = this.options.buildTitle(t) ?? ""; else switch (typeof t.options.title) {
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
            t.context.vpa.cancelUpdate();
        }));
        this.instructions = t.prevInstructions;
        this.N = t.previousRouteTree;
        this.A = false;
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

Ut = st([ nt(0, u), nt(1, b), nt(2, n), nt(3, ot), nt(4, ct), nt(5, it) ], Ut);

function Lt(t, e, i, s) {
    t.trace(`updateNode(ctx:%s,node:%s)`, i, s);
    s.queryParams = e.queryParams;
    s.fragment = e.fragment;
    if (!s.context.isRoot) s.context.vpa.scheduleUpdate(s.tree.options, s);
    if (s.context === i) {
        s.clearChildren();
        return h(c(...e.children.map((e => St(t, s, e)))), (() => c(...i.getAvailableViewportAgents().reduce(((e, i) => {
            const n = i.viewport;
            const r = n.default;
            if (null === r) return e;
            e.push(St(t, s, ViewportInstruction.create({
                component: r,
                viewport: n.name
            })));
            return e;
        }), []))));
    }
    return c(...s.children.map((s => Lt(t, e, i, s))));
}

const Ot = [ "?", "#", "/", "+", "(", ")", ".", "@", "!", "=", ",", "&", "'", "~", ";" ];

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

var jt;

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
})(jt || (jt = {}));

const Dt = new Map;

const Bt = new Map;

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
        const i = e ? Dt : Bt;
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
        if ("" === t) return new RouteExpression("", false, SegmentExpression.EMPTY, null != n ? Object.freeze(n) : Vt, i, e);
        const o = new ParserState(t);
        o.record();
        const h = o.consumeOptional("/");
        const a = CompositeSegmentExpression.parse(o);
        o.ensureDone();
        const c = o.playback();
        return new RouteExpression(c, h, a, null != n ? Object.freeze(n) : Vt, i, e);
    }
    toInstructionTree(t) {
        return new ViewportInstructionTree(t, this.isAbsolute, this.root.toInstructions(0, 0), H(this.queryParams, t.queryParams, true), this.fragment ?? t.fragment);
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
        } else while (!t.done && !t.startsWith(...Ot)) t.advance();
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
            while (!t.done && !t.startsWith(...Ot)) t.advance();
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
            while (!t.done && !t.startsWith(...Ot)) t.advance();
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
        while (!t.done && !t.startsWith(...Ot)) t.advance();
        let i = decodeURIComponent(t.playback());
        if (0 === i.length) t.expect("parameter key");
        let s;
        if (t.consumeOptional("=")) {
            t.record();
            while (!t.done && !t.startsWith(...Ot)) t.advance();
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

const Mt = Object.freeze({
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

const zt = "default";

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
        const i = null === this.params || 0 === Object.keys(this.params).length ? "" : `(${qt(this.params)})`;
        const s = this.viewport;
        const n = 0 === e.length || null === s || 0 === s.length || s === zt ? "" : `@${s}`;
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

function qt(t) {
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

const Ft = function() {
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
            const s = new URLSearchParams(n.queryParams ?? a);
            for (let n = 0; n < e; n++) {
                const e = t[n];
                const h = o ? r.generateViewportInstruction(e) : null;
                if (null !== h) {
                    i[n] = h.vi;
                    H(s, h.query, false);
                } else i[n] = ViewportInstruction.create(e);
            }
            return new ViewportInstructionTree(n, false, i, s, n.fragment);
        }
        if ("string" === typeof t) {
            const i = RouteExpression.parse(t, e.useUrlFragmentHash);
            return i.toInstructionTree(n);
        }
        const h = o ? r.generateViewportInstruction(t) : null;
        const c = new URLSearchParams(n.queryParams ?? a);
        return null !== h ? new ViewportInstructionTree(n, false, [ h.vi ], H(c, h.query, false), n.fragment) : new ViewportInstructionTree(n, false, [ ViewportInstruction.create(t) ], c, n.fragment);
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

var Ht;

(function(t) {
    t[t["string"] = 0] = "string";
    t[t["ViewportInstruction"] = 1] = "ViewportInstruction";
    t[t["CustomElementDefinition"] = 2] = "CustomElementDefinition";
    t[t["Promise"] = 3] = "Promise";
    t[t["IRouteViewModel"] = 4] = "IRouteViewModel";
})(Ht || (Ht = {}));

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
        if (t instanceof R) return new TypedNavigationInstruction(2, t);
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
            return `au$obj${Ft(this.value)}`;

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
    constructor(t, e, i, s, r, o) {
        this.instance = t;
        this.controller = e;
        this.definition = i;
        this.routeNode = s;
        this.ctx = r;
        this.routerOptions = o;
        this.U = r.container.get(n).scopeTo(`ComponentAgent<${r.friendlyPath}>`);
        this.U.trace(`constructor()`);
        const h = e.lifecycleHooks;
        this.canLoadHooks = (h.canLoad ?? []).map((t => t.instance));
        this.loadHooks = (h.loading ?? []).map((t => t.instance));
        this.canUnloadHooks = (h.canUnload ?? []).map((t => t.instance));
        this.unloadHooks = (h.unloading ?? []).map((t => t.instance));
        this.L = "canLoad" in t;
        this.O = "loading" in t;
        this.j = "canUnload" in t;
        this.B = "unloading" in t;
    }
    activate(t, e, i) {
        if (null === t) {
            this.U.trace(`activate() - initial`);
            return this.controller.activate(this.controller, e, i);
        }
        this.U.trace(`activate()`);
        void this.controller.activate(t, e, i);
    }
    deactivate(t, e, i) {
        if (null === t) {
            this.U.trace(`deactivate() - initial`);
            return this.controller.deactivate(this.controller, e, i);
        }
        this.U.trace(`deactivate()`);
        void this.controller.deactivate(t, e, i);
    }
    dispose() {
        this.U.trace(`dispose()`);
        this.controller.dispose();
    }
    canUnload(t, e, i) {
        this.U.trace(`canUnload(next:%s) - invoking ${this.canUnloadHooks.length} hooks`, e);
        i.push();
        let s = Promise.resolve();
        for (const n of this.canUnloadHooks) {
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
        if (this.j) {
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
    canLoad(t, e, i) {
        this.U.trace(`canLoad(next:%s) - invoking ${this.canLoadHooks.length} hooks`, e);
        const s = this.ctx.root;
        i.push();
        let n = Promise.resolve();
        for (const r of this.canLoadHooks) {
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
        if (this.L) {
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
    unloading(t, e, i) {
        this.U.trace(`unloading(next:%s) - invoking ${this.unloadHooks.length} hooks`, e);
        i.push();
        for (const s of this.unloadHooks) t.run((() => {
            i.push();
            return s.unloading(this.instance, e, this.routeNode);
        }), (() => {
            i.pop();
        }));
        if (this.B) t.run((() => {
            i.push();
            return this.instance.unloading(e, this.routeNode);
        }), (() => {
            i.pop();
        }));
        i.pop();
    }
    loading(t, e, i) {
        this.U.trace(`loading(next:%s) - invoking ${this.loadHooks.length} hooks`, e);
        i.push();
        for (const s of this.loadHooks) t.run((() => {
            i.push();
            return s.loading(this.instance, e.params, e, this.routeNode);
        }), (() => {
            i.pop();
        }));
        if (this.O) t.run((() => {
            i.push();
            return this.instance.loading(e.params, e, this.routeNode);
        }), (() => {
            i.pop();
        }));
        i.pop();
    }
    toString() {
        return `CA(ctx:'${this.ctx.friendlyPath}',c:'${this.definition.component.name}')`;
    }
}

const _t = i.createInterface("IRouteContext");

const Wt = Object.freeze([ "string", "object", "function" ]);

function Gt(t) {
    if (null == t) return false;
    const e = t.params;
    const i = t.component;
    return "object" === typeof e && null !== e && null != i && Wt.includes(typeof i) && !(i instanceof Promise);
}

class RouteContext {
    get isRoot() {
        return null === this.parent;
    }
    get depth() {
        return this.path.length - 1;
    }
    get resolved() {
        return this.M;
    }
    get allResolved() {
        return this.q;
    }
    get node() {
        const t = this.F;
        if (null === t) throw new Error(`Invariant violation: RouteNode should be set immediately after the RouteContext is created. Context: ${this}`);
        return t;
    }
    set node(t) {
        const e = this.prevNode = this.F;
        if (e !== t) {
            this.F = t;
            this.logger.trace(`Node changed from %s to %s`, this.prevNode, t);
        }
    }
    get vpa() {
        const t = this.H;
        if (null === t) throw new Error(`RouteContext has no ViewportAgent: ${this}`);
        return t;
    }
    get navigationModel() {
        return this._;
    }
    constructor(t, e, i, s, r, o) {
        this.parent = e;
        this.component = i;
        this.definition = s;
        this.parentContainer = r;
        this.W = o;
        this.childViewportAgents = [];
        this.childRoutes = [];
        this.M = null;
        this.q = null;
        this.prevNode = null;
        this.F = null;
        this.G = false;
        this.H = t;
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
        h.registerResolver(y, this.hostControllerProvider = new d, true);
        h.registerResolver(_t, new d("IRouteContext", this));
        h.register(s);
        this.Y = new B;
        if (o.options.useNavigationModel) {
            const t = this._ = new NavigationModel([]);
            h.get(ot).subscribe("au:router:navigation-end", (() => t.setIsActive(o, this)));
        } else this._ = null;
        this.processDefinition(s);
    }
    processDefinition(t) {
        const e = [];
        const i = [];
        const s = t.config.routes;
        const n = s.length;
        if (0 === n) {
            const e = t.component?.Type.prototype?.getRouteConfig;
            this.G = null == e ? true : "function" !== typeof e;
            return;
        }
        const r = this._;
        const o = null !== r;
        let h = 0;
        for (;h < n; h++) {
            const n = s[h];
            if (n instanceof Promise) {
                const t = this.addRoute(n);
                e.push(t);
                i.push(t);
            } else {
                const e = RouteDefinition.resolve(n, t, null, this);
                if (e instanceof Promise) {
                    if (!G(n) || null == n.path) throw new Error(`Invalid route config. When the component property is a lazy import, the path must be specified.`);
                    for (const t of q(n.path)) this.$addRoute(t, n.caseSensitive ?? false, e);
                    const t = this.childRoutes.length;
                    const s = e.then((e => this.childRoutes[t] = e));
                    this.childRoutes.push(s);
                    if (o) r.addRoute(s);
                    i.push(s.then(p));
                } else {
                    for (const t of e.path) this.$addRoute(t, e.caseSensitive, e);
                    this.childRoutes.push(e);
                    if (o) r.addRoute(e);
                }
            }
        }
        this.G = true;
        if (e.length > 0) this.M = Promise.all(e).then((() => {
            this.M = null;
        }));
        if (i.length > 0) this.q = Promise.all(i).then((() => {
            this.q = null;
        }));
    }
    static setRoot(t) {
        const e = t.get(n).scopeTo("RouteContext");
        if (!t.has(k, true)) Jt(new Error(`The provided container has no registered IAppRoot. RouteContext.setRoot can only be used after Aurelia.app was called, on a container that is within that app's component tree.`), e);
        if (t.has(_t, true)) Jt(new Error(`A root RouteContext is already registered. A possible cause is the RouterConfiguration being registered more than once in the same container tree. If you have a multi-rooted app, make sure you register RouterConfiguration only in the "forked" containers and not in the common root.`), e);
        const {controller: i} = t.get(k);
        if (void 0 === i) Jt(new Error(`The provided IAppRoot does not (yet) have a controller. A possible cause is calling this API manually before Aurelia.start() is called`), e);
        const s = t.get(Pt);
        return h(s.getRouteContext(null, i.definition, i.viewModel, i.container, null), (e => {
            t.register(g.instance(_t, e));
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
        if (Yt(e)) {
            s.trace(`resolve(context:%s) - returning provided RouteContext`, e);
            return e;
        }
        if (e instanceof i.get(b).Node) try {
            const t = x.for(e, {
                searchParents: true
            });
            s.trace(`resolve(context:Node(nodeName:'${e.nodeName}'),controller:'${t.definition.name}') - resolving RouteContext from controller's RenderContext`);
            return t.container.get(_t);
        } catch (t) {
            s.error(`Failed to resolve RouteContext from Node(nodeName:'${e.nodeName}')`, t);
            throw t;
        }
        if (w(e)) {
            const t = e.$controller;
            s.trace(`resolve(context:CustomElementViewModel(name:'${t.definition.name}')) - resolving RouteContext from controller's RenderContext`);
            return t.container.get(_t);
        }
        if (S(e)) {
            const t = e;
            s.trace(`resolve(context:CustomElementController(name:'${t.definition.name}')) - resolving RouteContext from controller's RenderContext`);
            return t.container.get(_t);
        }
        Jt(new Error(`Invalid context type: ${Object.prototype.toString.call(e)}`), s);
    }
    dispose() {
        this.container.dispose();
    }
    resolveViewportAgent(t) {
        this.logger.trace(`resolveViewportAgent(req:%s)`, t);
        const e = this.childViewportAgents.find((e => e.handles(t)));
        if (void 0 === e) throw new Error(`Failed to resolve ${t} at:\n${this.printTree()}`);
        return e;
    }
    getAvailableViewportAgents() {
        return this.childViewportAgents.filter((t => t.isAvailable()));
    }
    getFallbackViewportAgent(t) {
        return this.childViewportAgents.find((e => e.isAvailable() && e.viewport.name === t && e.viewport.fallback.length > 0)) ?? null;
    }
    createComponentAgent(t, e) {
        this.logger.trace(`createComponentAgent(routeNode:%s)`, e);
        this.hostControllerProvider.prepare(t);
        const i = this.container;
        const s = i.get(e.component.key);
        const n = this.definition;
        const r = this.G ? void 0 : h(RouteDefinition.resolve(s, n, e), (t => this.processDefinition(t)));
        return h(r, (() => {
            const r = RouteDefinition.resolve(s.constructor, n, null);
            const o = E.$el(i, s, t.host, null);
            const h = new ComponentAgent(s, o, r, e, this, this.W.options);
            this.hostControllerProvider.dispose();
            return h;
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
            n = i.Y.recognize(t);
            if (null === n) {
                if (!e || i.isRoot) return null;
                i = i.parent;
            } else s = false;
        }
        let r;
        if (Reflect.has(n.params, D)) r = n.params[D] ?? null; else r = null;
        return new $RecognizedRoute(n, r);
    }
    addRoute(t) {
        this.logger.trace(`addRoute(routeable:'${t}')`);
        return h(RouteDefinition.resolve(t, this.definition, null, this), (t => {
            for (const e of t.path) this.$addRoute(e, t.caseSensitive, t);
            this._?.addRoute(t);
            this.childRoutes.push(t);
        }));
    }
    $addRoute(t, e, i) {
        this.Y.add({
            path: t,
            caseSensitive: e,
            handler: i
        }, true);
    }
    resolveLazy(t) {
        return this.moduleLoader.load(t, (e => {
            const i = e.raw;
            if ("function" === typeof i) {
                const t = r.resource.getAll(i).find(Zt);
                if (void 0 !== t) return t;
            }
            let s;
            let n;
            for (const t of e.items) if (t.isConstructable) {
                const e = t.definitions.find(Zt);
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
        if (!Gt(t)) return null;
        const e = t.component;
        let i;
        let s = false;
        if (e instanceof RouteDefinition) {
            i = e;
            s = true;
        } else if ("string" === typeof e) i = this.childRoutes.find((t => t.id === e)); else if (0 === e.type) i = this.childRoutes.find((t => t.id === e.value)); else i = RouteDefinition.resolve(e, null, null, this);
        if (void 0 === i) return null;
        const n = t.params;
        const r = this.Y;
        const o = i.path;
        const h = o.length;
        const a = [];
        let c = null;
        if (1 === h) {
            const e = l(o[0]);
            if (null === e) {
                const e = `Unable to eagerly generate path for ${t}. Reasons: ${a}.`;
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
        let u = 0;
        for (let t = 0; t < h; t++) {
            const e = l(o[t]);
            if (null === e) continue;
            if (null === c) {
                c = e;
                u = Object.keys(e.consumed).length;
            } else if (Object.keys(e.consumed).length > u) c = e;
        }
        if (null === c) {
            const e = `Unable to eagerly generate path for ${t}. Reasons: ${a}.`;
            if (s) throw new Error(e);
            this.logger.debug(e);
            return null;
        }
        return {
            vi: ViewportInstruction.create({
                recognizedRoute: new $RecognizedRoute(new L(c.endpoint, c.consumed), null),
                component: c.path,
                children: t.children,
                viewport: t.viewport,
                open: t.open,
                close: t.close
            }),
            query: c.query
        };
        function l(t) {
            const e = r.getEndpoint(t);
            if (null === e) {
                a.push(`No endpoint found for the path: '${t}'.`);
                return null;
            }
            const i = Object.create(null);
            for (const s of e.params) {
                const e = s.name;
                let r = n[e];
                if (null == r || 0 === String(r).length) {
                    if (!s.isOptional) {
                        a.push(`No value for the required parameter '${e}' is provided for the path: '${t}'.`);
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

function Yt(t) {
    return t instanceof RouteContext;
}

function Jt(t, e) {
    e.error(t);
    throw t;
}

function Zt(t) {
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
        this.J = void 0;
    }
    resolve() {
        return h(this.J, p);
    }
    setIsActive(t, e) {
        void h(this.J, (() => {
            for (const i of this.routes) i.setIsActive(t, e);
        }));
    }
    addRoute(t) {
        const e = this.routes;
        if (!(t instanceof Promise)) {
            if (t.config.nav) e.push(NavigationRoute.create(t));
            return;
        }
        const i = e.length;
        e.push(void 0);
        let s;
        s = this.J = h(this.J, (() => h(t, (t => {
            if (t.config.nav) e[i] = NavigationRoute.create(t); else e.splice(i, 1);
            if (this.J === s) this.J = void 0;
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
        this.Z = null;
    }
    static create(t) {
        return new NavigationRoute(t.id, t.path, t.redirectTo, t.config.title, t.data);
    }
    get isActive() {
        return this.K;
    }
    setIsActive(t, e) {
        let i = this.Z;
        if (null === i) {
            const s = t.options;
            i = this.Z = this.path.map((t => {
                const i = e.Y.getEndpoint(t);
                if (null === i) throw new Error(`No endpoint found for path '${t}'`);
                return new ViewportInstructionTree(NavigationOptions.create(s, {
                    context: e
                }), false, [ ViewportInstruction.create({
                    recognizedRoute: new $RecognizedRoute(new L(i, a), null),
                    component: t
                }) ], Vt, null);
            }));
        }
        this.K = i.some((e => t.routeTree.contains(e, true)));
    }
}

let Kt = class ViewportCustomElement {
    constructor(t, e) {
        this.logger = t;
        this.ctx = e;
        this.name = zt;
        this.usedBy = "";
        this.default = "";
        this.fallback = "";
        this.agent = void 0;
        this.controller = void 0;
        this.logger = t.scopeTo(`au-viewport<${e.friendlyPath}>`);
        this.logger.trace("constructor()");
    }
    $(t, e, i) {
        const s = this.fallback;
        return "function" === typeof s ? s(t, e, i) : s;
    }
    hydrated(t) {
        this.logger.trace("hydrated()");
        this.controller = t;
        this.agent = this.ctx.registerViewport(this);
    }
    attaching(t, e, i) {
        this.logger.trace("attaching()");
        return this.agent.activateFromViewport(t, this.controller, i);
    }
    detaching(t, e, i) {
        this.logger.trace("detaching()");
        return this.agent.deactivateFromViewport(t, this.controller, i);
    }
    dispose() {
        this.logger.trace("dispose()");
        this.ctx.unregisterViewport(this);
        this.agent.dispose();
        this.agent = void 0;
    }
    toString() {
        const t = [];
        for (const e of Qt) {
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

st([ I ], Kt.prototype, "name", void 0);

st([ I ], Kt.prototype, "usedBy", void 0);

st([ I ], Kt.prototype, "default", void 0);

st([ I ], Kt.prototype, "fallback", void 0);

Kt = st([ C({
    name: "au-viewport"
}), nt(0, n), nt(1, _t) ], Kt);

const Qt = [ "name", "usedBy", "default", "fallback" ];

let Xt = class LoadCustomAttribute {
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
}) ], Xt.prototype, "route", void 0);

st([ I({
    mode: 2,
    callback: "valueChanged"
}) ], Xt.prototype, "params", void 0);

st([ I({
    mode: 2
}) ], Xt.prototype, "attribute", void 0);

st([ I({
    mode: 4
}) ], Xt.prototype, "active", void 0);

st([ I({
    mode: 2,
    callback: "valueChanged"
}) ], Xt.prototype, "context", void 0);

Xt = st([ N("load"), nt(0, V), nt(1, A), nt(2, Pt), nt(3, ot), nt(4, _t), nt(5, ct) ], Xt);

let te = class HrefCustomAttribute {
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
            this.isEnabled = this.isEnabled && null === T(this.el, P.getDefinition(Xt).key);
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
        this.X(t);
    }
    X(t) {
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
}) ], te.prototype, "value", void 0);

te = st([ N({
    name: "href",
    noMultiBindings: true
}), nt(0, V), nt(1, A), nt(2, Pt), nt(3, _t), nt(4, $) ], te);

const ee = Pt;

const ie = [ ee ];

const se = Kt;

const ne = Xt;

const re = te;

const oe = [ Kt, Xt, te ];

function he(t, i) {
    let s = null;
    if (e(i)) s = i.basePath ?? null; else i = {};
    const n = RouterOptions.create(i);
    return t.register(g.cachedCallback(at, ((t, e, i) => {
        const n = t.get($);
        const r = new URL(n.document.baseURI);
        r.pathname = lt(s ?? r.pathname);
        return r;
    })), g.instance(it, n), U.hydrated(u, RouteContext.setRoot), U.activated(Pt, (t => t.start(true))), U.deactivated(Pt, (t => {
        t.stop();
    })), ...ie, ...oe);
}

const ae = {
    register(t) {
        return he(t);
    },
    customize(t) {
        return {
            register(e) {
                return he(e, t);
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

function ce(t) {
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
        this.scrollStates.forEach(ce);
        this.scrollStates = null;
    }
}

const ue = i.createInterface("IStateManager", (t => t.singleton(ScrollStateManager)));

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

export { Mt as AST, ActionExpression, rt as AuNavId, ComponentAgent, ComponentExpression, CompositeSegmentExpression, ie as DefaultComponents, oe as DefaultResources, jt as ExpressionKind, te as HrefCustomAttribute, re as HrefCustomAttributeRegistration, ct as ILocationManager, _t as IRouteContext, Pt as IRouter, ot as IRouterEvents, it as IRouterOptions, ue as IStateManager, Xt as LoadCustomAttribute, ne as LoadCustomAttributeRegistration, LocationChangeEvent, NavigationCancelEvent, NavigationEndEvent, NavigationErrorEvent, NavigationOptions, NavigationStartEvent, ParameterExpression, ParameterListExpression, gt as Route, RouteConfig, RouteContext, RouteDefinition, RouteExpression, RouteNode, RouteTree, Ut as Router, ae as RouterConfiguration, RouterOptions, ee as RouterRegistration, ScopedSegmentExpression, SegmentExpression, SegmentGroupExpression, Transition, ViewportAgent, Kt as ViewportCustomElement, se as ViewportCustomElementRegistration, ViewportExpression, At as isManagedState, wt as route, Tt as toManagedState };
//# sourceMappingURL=index.mjs.map
