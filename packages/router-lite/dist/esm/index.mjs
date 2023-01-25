import { isObject as t, Metadata as e } from "@aurelia/metadata";

import { DI as i, IEventAggregator as s, ILogger as n, bound as r, onResolve as o, resolveAll as h, emptyObject as a, IContainer as c, isArrayIndex as u, Protocol as l, emptyArray as f, IModuleLoader as p, InstanceProvider as d, noop as g, Registration as w } from "@aurelia/kernel";

import { isCustomElementViewModel as v, IHistory as m, ILocation as $, IWindow as x, Controller as E, IPlatform as R, CustomElement as b, CustomElementDefinition as y, IController as k, IAppRoot as S, isCustomElementController as C, customElement as I, bindable as N, customAttribute as A, IEventTarget as T, INode as V, getRef as P, CustomAttribute as U, AppTask as L } from "@aurelia/runtime-html";

import { RecognizedRoute as O, Endpoint as j, ConfigurableRoute as D, RESIDUE as B, RouteRecognizer as M } from "@aurelia/route-recognizer";

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

function z(t, e) {
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

function q(t) {
    try {
        return JSON.stringify(t);
    } catch {
        return Object.prototype.toString.call(t);
    }
}

function F(t) {
    return "string" === typeof t ? [ t ] : t;
}

function H(t) {
    return "string" === typeof t ? t : t[0];
}

function W(t, e, i) {
    const s = i ? new URLSearchParams(t) : t;
    if (null == e) return s;
    for (const [t, i] of Object.entries(e)) s.append(t, i);
    return s;
}

function G(t) {
    return "object" === typeof t && null !== t && !v(t);
}

function Y(t) {
    return G(t) && true === Object.prototype.hasOwnProperty.call(t, "name");
}

function _(t) {
    return G(t) && true === Object.prototype.hasOwnProperty.call(t, "component");
}

function J(t) {
    return G(t) && true === Object.prototype.hasOwnProperty.call(t, "redirectTo");
}

function Z(t) {
    return G(t) && true === Object.prototype.hasOwnProperty.call(t, "component");
}

function K(t, e, i) {
    throw new Error(`Invalid route config property: "${e}". Expected ${t}, but got ${q(i)}.`);
}

function Q(t, e) {
    if (null === t || void 0 === t) throw new Error(`Invalid route config: expected an object or string, but got: ${String(t)}.`);
    const i = Object.keys(t);
    for (const s of i) {
        const i = t[s];
        const n = [ e, s ].join(".");
        switch (s) {
          case "id":
          case "viewport":
          case "redirectTo":
          case "fallback":
            if ("string" !== typeof i) K("string", n, i);
            break;

          case "caseSensitive":
          case "nav":
            if ("boolean" !== typeof i) K("boolean", n, i);
            break;

          case "data":
            if ("object" !== typeof i || null === i) K("object", n, i);
            break;

          case "title":
            switch (typeof i) {
              case "string":
              case "function":
                break;

              default:
                K("string or function", n, i);
            }
            break;

          case "path":
            if (i instanceof Array) {
                for (let t = 0; t < i.length; ++t) if ("string" !== typeof i[t]) K("string", `${n}[${t}]`, i[t]);
            } else if ("string" !== typeof i) K("string or Array of strings", n, i);
            break;

          case "component":
            tt(i, n);
            break;

          case "routes":
            if (!(i instanceof Array)) K("Array", n, i);
            for (const t of i) {
                const e = `${n}[${i.indexOf(t)}]`;
                tt(t, e);
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
                    K("string('none'|'replace'|'invoke-lifecycles') or function", n, i);
                }
                break;

              case "function":
                break;

              default:
                K("string('none'|'replace'|'invoke-lifecycles') or function", n, i);
            }
            break;

          default:
            throw new Error(`Unknown route config property: "${e}.${s}". Please specify known properties only.`);
        }
    }
}

function X(t, e) {
    if (null === t || void 0 === t) throw new Error(`Invalid route config: expected an object or string, but got: ${String(t)}.`);
    const i = Object.keys(t);
    for (const s of i) {
        const i = t[s];
        const n = [ e, s ].join(".");
        switch (s) {
          case "path":
            if (i instanceof Array) {
                for (let t = 0; t < i.length; ++t) if ("string" !== typeof i[t]) K("string", `${n}[${t}]`, i[t]);
            } else if ("string" !== typeof i) K("string or Array of strings", n, i);
            break;

          case "redirectTo":
            if ("string" !== typeof i) K("string", n, i);
            break;

          default:
            throw new Error(`Unknown redirect config property: "${e}.${s}". Only 'path' and 'redirectTo' should be specified for redirects.`);
        }
    }
}

function tt(t, e) {
    switch (typeof t) {
      case "function":
        break;

      case "object":
        if (t instanceof Promise) break;
        if (J(t)) {
            X(t, e);
            break;
        }
        if (_(t)) {
            Q(t, e);
            break;
        }
        if (!v(t) && !Y(t)) K(`an object with at least a 'component' property (see Routeable)`, e, t);
        break;

      case "string":
        break;

      default:
        K("function, object or string (see Routeable)", e, t);
    }
}

function et(t, e) {
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

function it(t, e, i, s) {
    var n = arguments.length, r = n < 3 ? e : null === s ? s = Object.getOwnPropertyDescriptor(e, i) : s, o;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(t, e, i, s); else for (var h = t.length - 1; h >= 0; h--) if (o = t[h]) r = (n < 3 ? o(r) : n > 3 ? o(e, i, r) : o(e, i)) || r;
    return n > 3 && r && Object.defineProperty(e, i, r), r;
}

function st(t, e) {
    return function(i, s) {
        e(i, s, t);
    };
}

const nt = "au-nav-id";

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

const rt = i.createInterface("IRouterEvents", (t => t.singleton(ot)));

let ot = class RouterEvents {
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

ot = it([ st(0, s), st(1, n) ], ot);

class LocationChangeEvent {
    constructor(t, e, i, s) {
        this.id = t;
        this.url = e;
        this.trigger = i;
        this.state = s;
    }
    get name() {
        return "au:router:location-change";
    }
    toString() {
        return `LocationChangeEvent(id:${this.id},url:'${this.url}',trigger:'${this.trigger}')`;
    }
}

class NavigationStartEvent {
    constructor(t, e, i, s) {
        this.id = t;
        this.instructions = e;
        this.trigger = i;
        this.managedState = s;
    }
    get name() {
        return "au:router:navigation-start";
    }
    toString() {
        return `NavigationStartEvent(id:${this.id},instructions:'${this.instructions}',trigger:'${this.trigger}')`;
    }
}

class NavigationEndEvent {
    constructor(t, e, i) {
        this.id = t;
        this.instructions = e;
        this.finalInstructions = i;
    }
    get name() {
        return "au:router:navigation-end";
    }
    toString() {
        return `NavigationEndEvent(id:${this.id},instructions:'${this.instructions}',finalInstructions:'${this.finalInstructions}')`;
    }
}

class NavigationCancelEvent {
    constructor(t, e, i) {
        this.id = t;
        this.instructions = e;
        this.reason = i;
    }
    get name() {
        return "au:router:navigation-cancel";
    }
    toString() {
        return `NavigationCancelEvent(id:${this.id},instructions:'${this.instructions}',reason:${String(this.reason)})`;
    }
}

class NavigationErrorEvent {
    constructor(t, e, i) {
        this.id = t;
        this.instructions = e;
        this.error = i;
    }
    get name() {
        return "au:router:navigation-error";
    }
    toString() {
        return `NavigationErrorEvent(id:${this.id},instructions:'${this.instructions}',error:${String(this.error)})`;
    }
}

const ht = i.createInterface("IBaseHref");

const at = i.createInterface("ILocationManager", (t => t.singleton(ct)));

let ct = class BrowserLocationManager {
    constructor(t, e, i, s, n, r) {
        this.logger = t;
        this.events = e;
        this.history = i;
        this.location = s;
        this.window = n;
        this.baseHref = r;
        this.eventId = 0;
        t = this.logger = t.root.scopeTo("LocationManager");
        t.debug(`baseHref set to path: ${r.href}`);
    }
    startListening() {
        this.logger.trace(`startListening()`);
        this.window.addEventListener("popstate", this.onPopState, false);
        this.window.addEventListener("hashchange", this.onHashChange, false);
    }
    stopListening() {
        this.logger.trace(`stopListening()`);
        this.window.removeEventListener("popstate", this.onPopState, false);
        this.window.removeEventListener("hashchange", this.onHashChange, false);
    }
    onPopState(t) {
        this.logger.trace(`onPopState()`);
        this.events.publish(new LocationChangeEvent(++this.eventId, this.getPath(), "popstate", t.state));
    }
    onHashChange(t) {
        this.logger.trace(`onHashChange()`);
        this.events.publish(new LocationChangeEvent(++this.eventId, this.getPath(), "hashchange", null));
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
        const s = this.removeBaseHref(`${t}${lt(e)}${i}`);
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
        t = ut(t);
        this.logger.trace(`removeBaseHref(path:'${e}') -> '${t}'`);
        return t;
    }
};

it([ r ], ct.prototype, "onPopState", null);

it([ r ], ct.prototype, "onHashChange", null);

ct = it([ st(0, n), st(1, rt), st(2, m), st(3, $), st(4, x), st(5, ht) ], ct);

function ut(t) {
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

function lt(t) {
    return t.length > 0 && !t.startsWith("?") ? `?${t}` : t;
}

const ft = [ "?", "#", "/", "+", "(", ")", ".", "@", "!", "=", ",", "&", "'", "~", ";" ];

class ParserState {
    constructor(t) {
        this.input = t;
        this.buffers = [];
        this.bufferIndex = 0;
        this.index = 0;
        this.rest = t;
    }
    get done() {
        return 0 === this.rest.length;
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

var pt;

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
})(pt || (pt = {}));

const dt = new Map;

const gt = new Map;

class RouteExpression {
    constructor(t, e, i, s, n, r) {
        this.raw = t;
        this.isAbsolute = e;
        this.root = i;
        this.queryParams = s;
        this.fragment = n;
        this.fragmentIsRoute = r;
    }
    get kind() {
        return 0;
    }
    static parse(t, e) {
        const i = e ? dt : gt;
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
        if ("" === t) return new RouteExpression("", false, SegmentExpression.EMPTY, null != n ? Object.freeze(n) : Nt, i, e);
        const o = new ParserState(t);
        o.record();
        const h = o.consumeOptional("/");
        const a = CompositeSegmentExpression.parse(o);
        o.ensureDone();
        const c = o.playback();
        return new RouteExpression(c, h, a, null != n ? Object.freeze(n) : Nt, i, e);
    }
    toInstructionTree(t) {
        return new ViewportInstructionTree(t, this.isAbsolute, this.root.toInstructions(0, 0), W(this.queryParams, t.queryParams, true), this.fragment ?? t.fragment);
    }
    toString() {
        return this.raw;
    }
}

class CompositeSegmentExpression {
    constructor(t, e) {
        this.raw = t;
        this.siblings = e;
    }
    get kind() {
        return 1;
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
    constructor(t, e, i) {
        this.raw = t;
        this.left = e;
        this.right = i;
    }
    get kind() {
        return 2;
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
    constructor(t, e) {
        this.raw = t;
        this.expression = e;
    }
    get kind() {
        return 3;
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
    constructor(t, e, i, s, n) {
        this.raw = t;
        this.component = e;
        this.action = i;
        this.viewport = s;
        this.scoped = n;
    }
    get kind() {
        return 4;
    }
    static get EMPTY() {
        return new SegmentExpression("", ComponentExpression.EMPTY, ActionExpression.EMPTY, ViewportExpression.EMPTY, true);
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
    get kind() {
        return 5;
    }
    static get EMPTY() {
        return new ComponentExpression("", "", ParameterListExpression.EMPTY);
    }
    static parse(t) {
        t.record();
        t.record();
        if (!t.done) if (t.startsWith("./")) t.advance(); else if (t.startsWith("../")) {
            t.advance();
            t.advance();
        } else while (!t.done && !t.startsWith(...ft)) t.advance();
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
    constructor(t, e, i) {
        this.raw = t;
        this.name = e;
        this.parameterList = i;
    }
    get kind() {
        return 6;
    }
    static get EMPTY() {
        return new ActionExpression("", "", ParameterListExpression.EMPTY);
    }
    static parse(t) {
        t.record();
        let e = "";
        if (t.consumeOptional(".")) {
            t.record();
            while (!t.done && !t.startsWith(...ft)) t.advance();
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
    constructor(t, e) {
        this.raw = t;
        this.name = e;
    }
    get kind() {
        return 7;
    }
    static get EMPTY() {
        return new ViewportExpression("", "");
    }
    static parse(t) {
        t.record();
        let e = "";
        if (t.consumeOptional("@")) {
            t.record();
            while (!t.done && !t.startsWith(...ft)) t.advance();
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
    constructor(t, e) {
        this.raw = t;
        this.expressions = e;
    }
    get kind() {
        return 8;
    }
    static get EMPTY() {
        return new ParameterListExpression("", []);
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
    constructor(t, e, i) {
        this.raw = t;
        this.key = e;
        this.value = i;
    }
    get kind() {
        return 9;
    }
    static get EMPTY() {
        return new ParameterExpression("", "", "");
    }
    static parse(t, e) {
        t.record();
        t.record();
        while (!t.done && !t.startsWith(...ft)) t.advance();
        let i = decodeURIComponent(t.playback());
        if (0 === i.length) t.expect("parameter key");
        let s;
        if (t.consumeOptional("=")) {
            t.record();
            while (!t.done && !t.startsWith(...ft)) t.advance();
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

const wt = Object.freeze({
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

class ViewportRequest {
    constructor(t, e) {
        this.viewportName = t;
        this.componentName = e;
    }
    toString() {
        return `VR(viewport:'${this.viewportName}',component:'${this.componentName}')`;
    }
}

const vt = new WeakMap;

class ViewportAgent {
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
        this.t = null;
        this.logger = i.container.get(n).scopeTo(`ViewportAgent<${i.friendlyPath}>`);
        this.logger.trace(`constructor()`);
    }
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
    static for(t, e) {
        let i = vt.get(t);
        if (void 0 === i) {
            const s = E.getCachedOrThrow(t);
            vt.set(t, i = new ViewportAgent(t, s, e));
        }
        return i;
    }
    activateFromViewport(t, e, i) {
        const s = this.currTransition;
        if (null !== s) $t(s);
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
        if (null !== s) $t(s);
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
        $t(t);
        if (true !== t.guardsResult) return;
        e.push();
        void o(this.t, (() => {
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
        $t(t);
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
                    this.nextCA = this.nextNode.context.createComponentAgent(this.hostController, this.nextNode);
                    return this.nextCA.canLoad(t, this.nextNode, e);
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
                    void o(i.resolved, (() => o(o(h(...e.residue.splice(0).map((t => kt(this.logger, e, t)))), (() => h(...i.getAvailableViewportAgents().reduce(((t, i) => {
                        const s = i.viewport;
                        const n = s.default;
                        if (null === n) return t;
                        t.push(kt(this.logger, e, ViewportInstruction.create({
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
        $t(t);
        mt(this, t);
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
        $t(t);
        mt(this, t);
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
        $t(e);
        mt(this, e);
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
        $t(e);
        mt(this, e);
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
        $t(t);
        mt(this, t);
        if (!(256 === this.currState && 2 === this.nextState)) this.unexpectedState("swap");
        this.currState = 128;
        this.nextState = 1;
        switch (this.$plan) {
          case "none":
          case "invoke-lifecycles":
            {
                this.logger.trace(`swap() - skipping this level and swapping children instead at %s`, this);
                const i = z(this.nextNode.children, this.currNode.children);
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
            return o(t.resolved, (() => {
                const e = i.children.slice();
                return o(h(...i.residue.splice(0).map((t => kt(this.logger, i, t)))), (() => o(h(...t.getAvailableViewportAgents().reduce(((t, e) => {
                    const s = e.viewport;
                    const n = s.default;
                    if (null === n) return t;
                    t.push(kt(this.logger, i, ViewportInstruction.create({
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
            this.t = o(this.nextCA?.deactivate(null, this.hostController, 0), (() => {
                this.nextCA?.dispose();
                this.$plan = "replace";
                this.nextState = 64;
                this.nextCA = null;
                this.nextNode = null;
                this.currTransition = null;
                this.t = null;
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
            $t(this.currTransition);
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

function mt(t, e) {
    if (true !== e.guardsResult) throw new Error(`Unexpected guardsResult ${e.guardsResult} at ${t}`);
}

function $t(t) {
    if (void 0 !== t.error && !t.erredWithUnknownRoute) throw t.error;
}

var xt;

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
})(xt || (xt = {}));

const Et = new Map;

function Rt(t) {
    let e = Et.get(t);
    if (void 0 === e) Et.set(t, e = bt(t));
    return e;
}

function bt(t) {
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

let yt = 0;

class RouteNode {
    constructor(t, e, i, s, n, r, o, h, a, c, u, l, f, p, d) {
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
        this.children = p;
        this.residue = d;
        this.version = 1;
        this.originalInstruction ?? (this.originalInstruction = r);
    }
    get root() {
        return this.tree.root;
    }
    static create(t) {
        const {[B]: e, ...i} = t.params ?? {};
        return new RouteNode(++yt, t.path, t.finalPath, t.context, t.originalInstruction ?? t.instruction, t.instruction, i, t.queryParams ?? Nt, t.fragment ?? null, t.data ?? {}, t.viewport ?? null, t.title ?? null, t.component, t.children ?? [], t.residue ?? []);
    }
    contains(t) {
        if (this.context === t.options.context) {
            const e = this.children;
            const i = t.children;
            for (let t = 0, s = e.length; t < s; ++t) for (let n = 0, r = i.length; n < r; ++n) if (t + n < s && (e[t + n].originalInstruction?.contains(i[n]) ?? false)) {
                if (n + 1 === r) return true;
            } else break;
        }
        return this.children.some((function(e) {
            return e.contains(t);
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
    contains(t) {
        return this.root.contains(t);
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

function kt(t, e, i) {
    t.trace(`createAndAppendNodes(node:%s,vi:%s`, e, i);
    switch (i.component.type) {
      case 0:
        switch (i.component.value) {
          case "..":
            e = e.context.parent?.node ?? e;
            e.clearChildren();

          case ".":
            return h(...i.children.map((i => kt(t, e, i))));

          default:
            {
                t.trace(`createAndAppendNodes invoking createNode`);
                const s = e.context;
                const n = i.clone();
                let r = i.recognizedRoute;
                if (null !== r) return Ct(t, e, St(t, e, i, r, n));
                if (0 === i.children.length) {
                    const n = s.generateViewportInstruction(i);
                    if (null !== n) {
                        e.tree.queryParams = W(e.tree.queryParams, n.query, true);
                        const s = n.vi;
                        s.children.push(...i.children);
                        return Ct(t, e, St(t, e, s, s.recognizedRoute, i));
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
                        e.tree.queryParams = W(e.tree.queryParams, n.query, true);
                        return Ct(t, e, St(t, e, n.vi, n.vi.recognizedRoute, i));
                    }
                    const r = i.component.value;
                    if ("" === r) return;
                    let o = i.viewport;
                    if (null === o || 0 === o.length) o = Ft;
                    const h = s.getFallbackViewportAgent(o);
                    const c = null !== h ? h.viewport.fallback : s.definition.fallback;
                    if (null === c) throw new UnknownRouteError(`Neither the route '${r}' matched any configured route at '${s.friendlyPath}' nor a fallback is configured for the viewport '${o}' - did you forget to add '${r}' to the routes list of the route decorator of '${s.component.name}'?`);
                    t.trace(`Fallback is set to '${c}'. Looking for a recognized route.`);
                    const u = s.childRoutes.find((t => t.id === c));
                    if (void 0 !== u) return Ct(t, e, It(t, u, e, i));
                    t.trace(`No route definition for the fallback '${c}' is found; trying to recognize the route.`);
                    const l = s.recognize(c, true);
                    if (null !== l && l.residue !== c) return Ct(t, e, St(t, e, i, l, null));
                    t.trace(`The fallback '${c}' is not recognized as a route; treating as custom element name.`);
                    return Ct(t, e, It(t, RouteDefinition.resolve(c, s.definition, null, s), e, i));
                }
                r.residue = null;
                i.component.value = l ? h : h.slice(0, -(u.length + 1));
                for (let t = 0; t < o; ++t) {
                    const t = i.children[0];
                    if (u?.startsWith(t.component.value) ?? false) break;
                    i.viewport = t.viewport;
                    i.children = t.children;
                }
                t.trace("createNode after adjustment vi:%s", i);
                return Ct(t, e, St(t, e, i, r, n));
            }
        }

      case 3:
      case 4:
      case 2:
        {
            const s = e.context;
            return o(RouteDefinition.resolve(i.component.value, s.definition, null, s), (n => {
                const {vi: r, query: o} = s.generateViewportInstruction({
                    component: n,
                    params: i.params ?? a,
                    open: i.open,
                    close: i.close,
                    viewport: i.viewport,
                    children: i.children.slice()
                });
                e.tree.queryParams = W(e.tree.queryParams, o, true);
                return Ct(t, e, St(t, e, r, r.recognizedRoute, i));
            }));
        }
    }
}

function St(t, e, i, s, n, r = s.route.endpoint.route) {
    const h = e.context;
    const a = e.tree;
    return o(r.handler, (o => {
        r.handler = o;
        t.trace(`creatingConfiguredNode(rd:%s, vi:%s)`, o, i);
        if (null === o.redirectTo) {
            const c = (i.viewport?.length ?? 0) > 0 ? i.viewport : o.viewport;
            const u = o.component;
            const l = h.resolveViewportAgent(new ViewportRequest(c, u.name));
            const f = h.container.get(Pt);
            const p = f.getRouteContext(l, u, null, l.hostController.container, h.definition);
            t.trace("createConfiguredNode setting the context node");
            const d = p.node = RouteNode.create({
                path: s.route.endpoint.route.path,
                finalPath: r.path,
                context: p,
                instruction: i,
                originalInstruction: n,
                params: {
                    ...s.route.params
                },
                queryParams: a.queryParams,
                fragment: a.fragment,
                data: o.data,
                viewport: c,
                component: u,
                title: o.config.title,
                residue: [ ...null === s.residue ? [] : [ ViewportInstruction.create(s.residue) ], ...i.children ]
            });
            d.setTree(e.tree);
            t.trace(`createConfiguredNode(vi:%s) -> %s`, i, d);
            return d;
        }
        const c = RouteExpression.parse(r.path, false);
        const u = RouteExpression.parse(o.redirectTo, false);
        let l;
        let f;
        const p = [];
        switch (c.root.kind) {
          case 2:
          case 4:
            l = c.root;
            break;

          default:
            throw new Error(`Unexpected expression kind ${c.root.kind}`);
        }
        switch (u.root.kind) {
          case 2:
          case 4:
            f = u.root;
            break;

          default:
            throw new Error(`Unexpected expression kind ${u.root.kind}`);
        }
        let d;
        let g;
        let w = false;
        let v = false;
        while (!(w && v)) {
            if (w) d = null; else if (4 === l.kind) {
                d = l;
                w = true;
            } else if (4 === l.left.kind) {
                d = l.left;
                switch (l.right.kind) {
                  case 2:
                  case 4:
                    l = l.right;
                    break;

                  default:
                    throw new Error(`Unexpected expression kind ${l.right.kind}`);
                }
            } else throw new Error(`Unexpected expression kind ${l.left.kind}`);
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
            if (null !== g) if (g.component.isDynamic && (d?.component.isDynamic ?? false)) p.push(s.route.params[g.component.parameterName]); else p.push(g.raw);
        }
        const m = p.filter(Boolean).join("/");
        const $ = h.recognize(m);
        if (null === $) throw new UnknownRouteError(`'${m}' did not match any configured route or registered component name at '${h.friendlyPath}' - did you forget to add '${m}' to the routes list of the route decorator of '${h.component.name}'?`);
        return St(t, e, ViewportInstruction.create({
            recognizedRoute: $,
            component: m,
            children: i.children,
            viewport: i.viewport,
            open: i.open,
            close: i.close
        }), $, n);
    }));
}

function Ct(t, e, i) {
    return o(i, (i => {
        t.trace(`appendNode($childNode:%s)`, i);
        e.appendChild(i);
        return i.context.vpa.scheduleUpdate(e.tree.options, i);
    }));
}

function It(t, e, i, s) {
    const n = new $RecognizedRoute(new O(new j(new D(e.path[0], e.caseSensitive, e), []), a), null);
    s.children.length = 0;
    return St(t, i, s, n, null);
}

const Nt = Object.freeze(new URLSearchParams);

function At(e) {
    return t(e) && true === Object.prototype.hasOwnProperty.call(e, nt);
}

function Tt(t, e) {
    return {
        ...t,
        [nt]: e
    };
}

function Vt(t, e) {
    if ("function" === typeof e) return e(t);
    return e;
}

class RouterOptions {
    constructor(t, e, i, s) {
        this.useUrlFragmentHash = t;
        this.useHref = e;
        this.historyStrategy = i;
        this.buildTitle = s;
    }
    static get DEFAULT() {
        return RouterOptions.create({});
    }
    static create(t) {
        return new RouterOptions(t.useUrlFragmentHash ?? false, t.useHref ?? true, t.historyStrategy ?? "push", t.buildTitle ?? null);
    }
    getHistoryStrategy(t) {
        return Vt(t, this.historyStrategy);
    }
    stringifyProperties() {
        return [ [ "historyStrategy", "history" ] ].map((([t, e]) => {
            const i = this[t];
            return `${e}:${"function" === typeof i ? i : `'${i}'`}`;
        })).join(",");
    }
    clone() {
        return new RouterOptions(this.useUrlFragmentHash, this.useHref, this.historyStrategy, this.buildTitle);
    }
    toString() {
        return `RO(${this.stringifyProperties()})`;
    }
}

class NavigationOptions extends RouterOptions {
    constructor(t, e, i, s, n, r, o) {
        super(t.useUrlFragmentHash, t.useHref, t.historyStrategy, t.buildTitle);
        this.title = e;
        this.titleSeparator = i;
        this.context = s;
        this.queryParams = n;
        this.fragment = r;
        this.state = o;
    }
    static get DEFAULT() {
        return NavigationOptions.create({});
    }
    static create(t) {
        return new NavigationOptions(RouterOptions.create(t), t.title ?? null, t.titleSeparator ?? " | ", t.context ?? null, t.queryParams ?? null, t.fragment ?? "", t.state ?? null);
    }
    clone() {
        return new NavigationOptions(super.clone(), this.title, this.titleSeparator, this.context, {
            ...this.queryParams
        }, this.fragment, null === this.state ? null : {
            ...this.state
        });
    }
    toString() {
        return `NO(${super.stringifyProperties()})`;
    }
}

class UnknownRouteError extends Error {}

class Transition {
    constructor(t, e, i, s, n, r, o, h, a, c, u, l, f, p, d) {
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
        this.guardsResult = p;
        this.error = d;
        this.i = false;
    }
    get erredWithUnknownRoute() {
        return this.i;
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
        this.i = t instanceof UnknownRouteError;
        this.reject(this.error = t);
    }
    toString() {
        return `T(id:${this.id},trigger:'${this.trigger}',instructions:${this.instructions},options:${this.options})`;
    }
}

const Pt = i.createInterface("IRouter", (t => t.singleton(Ut)));

let Ut = class Router {
    constructor(t, e, i, s, n) {
        this.container = t;
        this.p = e;
        this.logger = i;
        this.events = s;
        this.locationMgr = n;
        this.h = null;
        this.u = null;
        this.$ = null;
        this.options = RouterOptions.DEFAULT;
        this.navigated = false;
        this.navigationId = 0;
        this.instructions = ViewportInstructionTree.create("");
        this.nextTr = null;
        this.locationChangeSubscription = null;
        this.R = false;
        this.C = false;
        this.I = false;
        this.vpaLookup = new Map;
        this.logger = i.root.scopeTo("Router");
    }
    get ctx() {
        let t = this.h;
        if (null === t) {
            if (!this.container.has(Gt, true)) throw new Error(`Root RouteContext is not set. Did you forget to register RouteConfiguration, or try to navigate before calling Aurelia.start()?`);
            t = this.h = this.container.get(Gt);
        }
        return t;
    }
    get routeTree() {
        let t = this.u;
        if (null === t) {
            const e = this.ctx;
            t = this.u = new RouteTree(NavigationOptions.create({
                ...this.options
            }), Nt, null, RouteNode.create({
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
        let t = this.$;
        if (null === t) t = this.$ = Transition.create({
            id: 0,
            prevInstructions: this.instructions,
            instructions: this.instructions,
            finalInstructions: this.instructions,
            instructionsChanged: true,
            trigger: "api",
            options: NavigationOptions.DEFAULT,
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
        this.$ = t;
    }
    get isNavigating() {
        return this.C;
    }
    resolveContext(t) {
        return RouteContext.resolve(this.ctx, t);
    }
    N(t) {
        this.options = RouterOptions.create(t);
    }
    start(t) {
        this.R = "function" === typeof this.options.buildTitle;
        this.locationMgr.startListening();
        this.locationChangeSubscription = this.events.subscribe("au:router:location-change", (t => {
            this.p.taskQueue.queueTask((() => {
                const e = At(t.state) ? t.state : null;
                const i = NavigationOptions.create({
                    ...this.options,
                    historyStrategy: "replace"
                });
                const s = ViewportInstructionTree.create(t.url, i, this.ctx);
                this.enqueue(s, t.trigger, e, null);
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
            context: i
        });
        this.logger.trace("isActive(instructions:%s,ctx:%s)", s, i);
        return this.routeTree.contains(s);
    }
    getRouteContext(t, e, i, s, r) {
        const o = s.get(n).scopeTo("RouteContext");
        const h = RouteDefinition.resolve("function" === typeof i?.getRouteConfig ? i : e.Type, r, null);
        let a = this.vpaLookup.get(t);
        if (void 0 === a) this.vpaLookup.set(t, a = new WeakMap);
        let c = a.get(h);
        if (void 0 !== c) {
            o.trace(`returning existing RouteContext for %s`, h);
            return c;
        }
        o.trace(`creating new RouteContext for %s`, h);
        const u = s.has(Gt, true) ? s.get(Gt) : null;
        a.set(h, c = new RouteContext(t, u, e, h, s, this));
        return c;
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
        return ViewportInstructionTree.create(t, NavigationOptions.create({
            ...this.options,
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
            routeTree: this.u = this.routeTree.clone(),
            guardsResult: true,
            error: void 0
        });
        r.debug(`Scheduling transition: %s`, c);
        if (!this.C) try {
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
                this.C = false;
                const t = this.nextTr;
                if (null !== t) t.previousRouteTree = c.previousRouteTree; else this.u = c.previousRouteTree;
            }
            throw t;
        }));
    }
    run(t) {
        this.currentTr = t;
        this.nextTr = null;
        this.C = true;
        let e = this.resolveContext(t.options.context);
        const i = t.instructions.children;
        const s = e.node.children;
        const r = !this.navigated || this.I || i.length !== s.length || i.some(((t, e) => !(s[e]?.originalInstruction.equals(t) ?? false))) || "replace" === this.ctx.definition.config.getTransitionPlan(t.previousRouteTree.root, t.routeTree.root);
        if (!r) {
            this.logger.trace(`run(tr:%s) - NOT processing route`, t);
            this.navigated = true;
            this.C = false;
            t.resolve(false);
            this.runNextTransition();
            return;
        }
        this.I = false;
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
            const h = e.container.get(n).scopeTo("RouteTree");
            if (i.isAbsolute) e = s;
            if (e === s) {
                r.root.setTree(r);
                s.node = r.root;
            }
            const a = e.resolved instanceof Promise ? " - awaiting promise" : "";
            h.trace(`updateRouteTree(rootCtx:%s,rt:%s,vit:%s)${a}`, s, r, i);
            return o(e.resolved, (() => Lt(h, i, e, s.node)));
        }), (() => {
            const e = t.previousRouteTree.root.children;
            const i = t.routeTree.root.children;
            const s = z(e, i);
            Batch.start((i => {
                this.logger.trace(`run() - invoking canUnload on ${e.length} nodes`);
                for (const s of e) s.context.vpa.canUnload(t, i);
            })).continueWith((e => {
                if (true !== t.guardsResult) {
                    e.push();
                    this.I = false === t.guardsResult;
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
                this.C = false;
                const e = t.finalInstructions.toUrl(this.options.useUrlFragmentHash);
                switch (t.options.getHistoryStrategy(this.instructions)) {
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
        if (this.R) e = this.options.buildTitle(t) ?? ""; else switch (typeof t.options.title) {
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
        const s = z(e, i);
        s.forEach((function(t) {
            t.context.vpa.cancelUpdate();
        }));
        this.instructions = t.prevInstructions;
        this.u = t.previousRouteTree;
        this.C = false;
        const n = t.guardsResult;
        this.events.publish(new NavigationCancelEvent(t.id, t.instructions, `guardsResult is ${n}`));
        if (false === n) {
            t.resolve(false);
            this.runNextTransition();
        } else {
            const e = t.erredWithUnknownRoute ? t.prevInstructions : n;
            void o(this.enqueue(e, "api", t.managedState, t), (() => {
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

Ut = it([ st(0, c), st(1, R), st(2, n), st(3, rt), st(4, at) ], Ut);

function Lt(t, e, i, s) {
    t.trace(`updateNode(ctx:%s,node:%s)`, i, s);
    s.queryParams = e.queryParams;
    s.fragment = e.fragment;
    if (!s.context.isRoot) s.context.vpa.scheduleUpdate(s.tree.options, s);
    if (s.context === i) {
        s.clearChildren();
        return o(h(...e.children.map((e => kt(t, s, e)))), (() => h(...i.getAvailableViewportAgents().reduce(((e, i) => {
            const n = i.viewport;
            const r = n.default;
            if (null === r) return e;
            e.push(kt(t, s, ViewportInstruction.create({
                component: r,
                viewport: n.name
            })));
            return e;
        }), []))));
    }
    return h(...s.children.map((s => Lt(t, e, i, s))));
}

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
        if (Z(t)) {
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
        if (!this.component.equals(t.component) || this.viewport !== t.viewport || !et(this.params, t.params)) return false;
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
        const i = null === this.params || 0 === Object.keys(this.params).length ? "" : `(${Ot(this.params)})`;
        const s = 0 === e.length || null === this.viewport || 0 === this.viewport.length ? "" : `@${this.viewport}`;
        const n = `${"(".repeat(this.open)}${e}${i}${s}${")".repeat(this.close)}`;
        const r = t ? this.children.map((t => t.toUrlComponent())).join("+") : "";
        if (n.length > 0) {
            if (r.length > 0) return [ n, r ].join("/");
            return n;
        }
        return r;
    }
    toString() {
        const t = `c:${this.component}`;
        const e = null === this.viewport || 0 === this.viewport.length ? "" : `viewport:${this.viewport}`;
        const i = 0 === this.children.length ? "" : `children:[${this.children.map(String).join(",")}]`;
        const s = [ t, e, i ].filter(Boolean).join(",");
        return `VPI(${s})`;
    }
}

function Ot(t) {
    const e = Object.keys(t);
    const i = Array(e.length);
    const s = [];
    const n = [];
    for (const t of e) if (u(t)) s.push(Number(t)); else n.push(t);
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

const jt = function() {
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
    static create(t, e, i) {
        const s = NavigationOptions.create({
            ...e
        });
        let n = s.context;
        if (!(n instanceof RouteContext) && null != i) n = RouteContext.resolve(i, n);
        const r = null != n;
        if (t instanceof Array) {
            const e = t.length;
            const i = new Array(e);
            const o = new URLSearchParams(s.queryParams ?? a);
            for (let s = 0; s < e; s++) {
                const e = t[s];
                const h = r ? n.generateViewportInstruction(e) : null;
                if (null !== h) {
                    i[s] = h.vi;
                    W(o, h.query, false);
                } else i[s] = ViewportInstruction.create(e);
            }
            return new ViewportInstructionTree(s, false, i, o, s.fragment);
        }
        if ("string" === typeof t) {
            const e = RouteExpression.parse(t, s.useUrlFragmentHash);
            return e.toInstructionTree(s);
        }
        const o = r ? n.generateViewportInstruction(t) : null;
        const h = new URLSearchParams(s.queryParams ?? a);
        return null !== o ? new ViewportInstructionTree(s, false, [ o.vi ], W(h, o.query, false), s.fragment) : new ViewportInstructionTree(s, false, [ ViewportInstruction.create(t) ], h, s.fragment);
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

var Dt;

(function(t) {
    t[t["string"] = 0] = "string";
    t[t["ViewportInstruction"] = 1] = "ViewportInstruction";
    t[t["CustomElementDefinition"] = 2] = "CustomElementDefinition";
    t[t["Promise"] = 3] = "Promise";
    t[t["IRouteViewModel"] = 4] = "IRouteViewModel";
})(Dt || (Dt = {}));

class TypedNavigationInstruction {
    constructor(t, e) {
        this.type = t;
        this.value = e;
    }
    static create(e) {
        if (e instanceof TypedNavigationInstruction) return e;
        if ("string" === typeof e) return new TypedNavigationInstruction(0, e);
        if (!t(e)) K("function/class or object", "", e);
        if ("function" === typeof e) if (b.isType(e)) {
            const t = b.getDefinition(e);
            return new TypedNavigationInstruction(2, t);
        } else return TypedNavigationInstruction.create(e());
        if (e instanceof Promise) return new TypedNavigationInstruction(3, e);
        if (Z(e)) {
            const t = ViewportInstruction.create(e);
            return new TypedNavigationInstruction(1, t);
        }
        if (v(e)) return new TypedNavigationInstruction(4, e);
        if (e instanceof y) return new TypedNavigationInstruction(2, e);
        throw new Error(`Invalid component ${q(e)}: must be either a class, a custom element ViewModel, or a (partial) custom element definition`);
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
            return `au$obj${jt(this.value)}`;

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
            return `VM(name:'${b.getDefinition(this.value.constructor).name}')`;

          case 1:
            return this.value.toString();

          case 0:
            return `'${this.value}'`;
        }
    }
}

const Bt = f;

function Mt(t, e) {
    if (!et(t.params, e.params)) return "replace";
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
    static A(t, e, i) {
        if ("string" === typeof t || t instanceof Array) {
            const s = t;
            const n = e?.redirectTo ?? null;
            const r = e?.caseSensitive ?? false;
            const o = e?.id ?? (s instanceof Array ? s[0] : s);
            const h = e?.title ?? null;
            const a = e?.transitionPlan ?? i?.transitionPlan ?? null;
            const c = e?.viewport ?? null;
            const u = e?.data ?? {};
            const l = e?.routes ?? Bt;
            return new RouteConfig(o, s, h, n, r, a, c, u, l, e?.fallback ?? null, null, e?.nav ?? true);
        } else if ("object" === typeof t) {
            const s = t;
            Q(s, "");
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
            const f = [ ...s.routes ?? Bt, ...e?.routes ?? Bt ];
            return new RouteConfig(a, n, r, o, h, c, u, l, f, s.fallback ?? e?.fallback ?? null, s.component ?? null, s.nav ?? true);
        } else K("string, function/class or object", "", t);
    }
    applyChildRouteConfig(t, e) {
        let i = this.path ?? "";
        if ("string" !== typeof i) i = i[0];
        Q(t, i);
        return new RouteConfig(t.id ?? this.id, t.path ?? this.path, t.title ?? this.title, t.redirectTo ?? this.redirectTo, t.caseSensitive ?? this.caseSensitive, t.transitionPlan ?? this.transitionPlan ?? e?.transitionPlan ?? null, t.viewport ?? this.viewport, t.data ?? this.data, t.routes ?? this.routes, t.fallback ?? this.fallback, t.component ?? this.component, t.nav ?? this.nav);
    }
    getTransitionPlan(t, e) {
        const i = this.transitionPlan ?? Mt;
        return "function" === typeof i ? i(t, e) : i;
    }
}

const zt = {
    name: l.resource.keyFor("route-configuration"),
    isConfigured(t) {
        return e.hasOwn(zt.name, t);
    },
    configure(t, i) {
        const s = RouteConfig.A(t, i, null);
        e.define(zt.name, s, i);
        return i;
    },
    getConfig(t) {
        if (!zt.isConfigured(t)) zt.configure({}, t);
        return e.getOwn(zt.name, t);
    }
};

function qt(t) {
    return function(e) {
        return zt.configure(t, e);
    };
}

const Ft = "default";

class RouteDefinition {
    constructor(t, e, i) {
        this.config = t;
        this.component = e;
        this.hasExplicitPath = null !== t.path;
        this.caseSensitive = t.caseSensitive;
        this.path = F(t.path ?? e.name);
        this.redirectTo = t.redirectTo ?? null;
        this.viewport = t.viewport ?? Ft;
        this.id = H(t.id ?? this.path);
        this.data = t.data ?? {};
        this.fallback = t.fallback ?? i?.fallback ?? null;
    }
    static resolve(t, e, i, s) {
        const n = e?.config ?? null;
        if (J(t)) return new RouteDefinition(RouteConfig.A(t, null, n), null, e);
        const r = this.createNavigationInstruction(t);
        let h;
        switch (r.type) {
          case 0:
            {
                if (void 0 === s) throw new Error(`When retrieving the RouteDefinition for a component name, a RouteContext (that can resolve it) must be provided`);
                const t = s.container.find(b, r.value);
                if (null === t) throw new Error(`Could not find a CustomElement named '${r.value}' in the current container scope of ${s}. This means the component is neither registered at Aurelia startup nor via the 'dependencies' decorator or static property.`);
                h = t;
                break;
            }

          case 2:
            h = r.value;
            break;

          case 4:
            h = b.getDefinition(r.value.constructor);
            break;

          case 3:
            if (void 0 === s) throw new Error(`RouteContext must be provided when resolving an imported module`);
            h = s.resolveLazy(r.value);
            break;
        }
        return o(h, (s => {
            let o = Ht.get(s);
            const h = 4 === r.type && "function" === typeof t.getRouteConfig;
            if (null === o) {
                const r = s.Type;
                let c = null;
                if (h) c = RouteConfig.A(t.getRouteConfig(e, i) ?? a, r, n); else c = _(t) ? zt.isConfigured(r) ? zt.getConfig(r).applyChildRouteConfig(t, n) : RouteConfig.A(t, r, n) : zt.getConfig(s.Type);
                o = new RouteDefinition(c, s, e);
                Ht.define(o, s);
            } else if (0 === o.config.routes.length && h) o.applyChildRouteConfig(t.getRouteConfig?.(e, i) ?? a);
            return o;
        }));
    }
    static createNavigationInstruction(t) {
        return _(t) ? this.createNavigationInstruction(t.component) : TypedNavigationInstruction.create(t);
    }
    applyChildRouteConfig(t) {
        this.config = t = this.config.applyChildRouteConfig(t, null);
        this.hasExplicitPath = null !== t.path;
        this.caseSensitive = t.caseSensitive ?? this.caseSensitive;
        this.path = F(t.path ?? this.path);
        this.redirectTo = t.redirectTo ?? null;
        this.viewport = t.viewport ?? Ft;
        this.id = H(t.id ?? this.path);
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

const Ht = {
    name: l.resource.keyFor("route-definition"),
    isDefined(t) {
        return e.hasOwn(Ht.name, t);
    },
    define(t, i) {
        e.define(Ht.name, t, i);
    },
    get(t) {
        return Ht.isDefined(t) ? e.getOwn(Ht.name, t) : null;
    }
};

const Wt = new WeakMap;

class ComponentAgent {
    constructor(t, e, i, s, r) {
        this.instance = t;
        this.controller = e;
        this.definition = i;
        this.routeNode = s;
        this.ctx = r;
        this.T = r.container.get(n).scopeTo(`ComponentAgent<${r.friendlyPath}>`);
        this.T.trace(`constructor()`);
        const o = e.lifecycleHooks;
        this.canLoadHooks = (o.canLoad ?? []).map((t => t.instance));
        this.loadHooks = (o.loading ?? []).map((t => t.instance));
        this.canUnloadHooks = (o.canUnload ?? []).map((t => t.instance));
        this.unloadHooks = (o.unloading ?? []).map((t => t.instance));
        this.V = "canLoad" in t;
        this.P = "loading" in t;
        this.U = "canUnload" in t;
        this.L = "unloading" in t;
    }
    static for(t, e, i, s) {
        let n = Wt.get(t);
        if (void 0 === n) {
            const r = s.container;
            const o = RouteDefinition.resolve(t.constructor, s.definition, null);
            const h = E.$el(r, t, e.host, null);
            Wt.set(t, n = new ComponentAgent(t, h, o, i, s));
        }
        return n;
    }
    activate(t, e, i) {
        if (null === t) {
            this.T.trace(`activate() - initial`);
            return this.controller.activate(this.controller, e, i);
        }
        this.T.trace(`activate()`);
        void this.controller.activate(t, e, i);
    }
    deactivate(t, e, i) {
        if (null === t) {
            this.T.trace(`deactivate() - initial`);
            return this.controller.deactivate(this.controller, e, i);
        }
        this.T.trace(`deactivate()`);
        void this.controller.deactivate(t, e, i);
    }
    dispose() {
        this.T.trace(`dispose()`);
        this.controller.dispose();
    }
    canUnload(t, e, i) {
        this.T.trace(`canUnload(next:%s) - invoking ${this.canUnloadHooks.length} hooks`, e);
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
        if (this.U) {
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
        this.T.trace(`canLoad(next:%s) - invoking ${this.canLoadHooks.length} hooks`, e);
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
                    if (true === t.guardsResult && true !== e) t.guardsResult = false === e ? false : ViewportInstructionTree.create(e, void 0, s);
                    i.pop();
                    n();
                }));
            }))));
        }
        if (this.V) {
            i.push();
            n = n.then((() => {
                if (true !== t.guardsResult) {
                    i.pop();
                    return;
                }
                t.run((() => this.instance.canLoad(e.params, e, this.routeNode)), (e => {
                    if (true === t.guardsResult && true !== e) t.guardsResult = false === e ? false : ViewportInstructionTree.create(e, void 0, s);
                    i.pop();
                }));
            }));
        }
        i.pop();
    }
    unloading(t, e, i) {
        this.T.trace(`unloading(next:%s) - invoking ${this.unloadHooks.length} hooks`, e);
        i.push();
        for (const s of this.unloadHooks) t.run((() => {
            i.push();
            return s.unloading(this.instance, e, this.routeNode);
        }), (() => {
            i.pop();
        }));
        if (this.L) t.run((() => {
            i.push();
            return this.instance.unloading(e, this.routeNode);
        }), (() => {
            i.pop();
        }));
        i.pop();
    }
    loading(t, e, i) {
        this.T.trace(`loading(next:%s) - invoking ${this.loadHooks.length} hooks`, e);
        i.push();
        for (const s of this.loadHooks) t.run((() => {
            i.push();
            return s.loading(this.instance, e.params, e, this.routeNode);
        }), (() => {
            i.pop();
        }));
        if (this.P) t.run((() => {
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

const Gt = i.createInterface("IRouteContext");

const Yt = Object.freeze([ "string", "object", "function" ]);

function _t(t) {
    if (null == t) return false;
    const e = t.params;
    const i = t.component;
    return "object" === typeof e && null !== e && null != i && Yt.includes(typeof i) && !(i instanceof Promise);
}

class RouteContext {
    constructor(t, e, i, s, r, o) {
        this.parent = e;
        this.component = i;
        this.definition = s;
        this.parentContainer = r;
        this.O = o;
        this.childViewportAgents = [];
        this.childRoutes = [];
        this.j = null;
        this.B = null;
        this.prevNode = null;
        this.M = null;
        this.q = false;
        this.F = t;
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
        this.moduleLoader = r.get(p);
        const h = this.container = r.createChild();
        h.registerResolver(k, this.hostControllerProvider = new d, true);
        h.registerResolver(Gt, new d("IRouteContext", this));
        h.register(s);
        h.register(...i.dependencies);
        this.recognizer = new M;
        const a = this.H = new NavigationModel([]);
        h.get(rt).subscribe("au:router:navigation-end", (() => a.setIsActive(o, this)));
        this.processDefinition(s);
    }
    get isRoot() {
        return null === this.parent;
    }
    get depth() {
        return this.path.length - 1;
    }
    get resolved() {
        return this.j;
    }
    get allResolved() {
        return this.B;
    }
    get node() {
        const t = this.M;
        if (null === t) throw new Error(`Invariant violation: RouteNode should be set immediately after the RouteContext is created. Context: ${this}`);
        return t;
    }
    set node(t) {
        const e = this.prevNode = this.M;
        if (e !== t) {
            this.M = t;
            this.logger.trace(`Node changed from %s to %s`, this.prevNode, t);
        }
    }
    get vpa() {
        const t = this.F;
        if (null === t) throw new Error(`RouteContext has no ViewportAgent: ${this}`);
        return t;
    }
    get navigationModel() {
        return this.H;
    }
    processDefinition(t) {
        const e = [];
        const i = [];
        const s = t.config.routes;
        const n = s.length;
        if (0 === n) {
            const e = t.component?.Type.prototype?.getRouteConfig;
            this.q = null == e ? true : "function" !== typeof e;
            return;
        }
        const r = this.H;
        let o = 0;
        for (;o < n; o++) {
            const n = s[o];
            if (n instanceof Promise) {
                const t = this.addRoute(n);
                e.push(t);
                i.push(t);
            } else {
                const e = RouteDefinition.resolve(n, t, null, this);
                if (e instanceof Promise) {
                    if (!_(n) || null == n.path) throw new Error(`Invalid route config. When the component property is a lazy import, the path must be specified.`);
                    for (const t of F(n.path)) this.$addRoute(t, n.caseSensitive ?? false, e);
                    const t = this.childRoutes.length;
                    const s = e.then((e => this.childRoutes[t] = e));
                    this.childRoutes.push(s);
                    r.addRoute(s);
                    i.push(s.then(g));
                } else {
                    for (const t of e.path) this.$addRoute(t, e.caseSensitive, e);
                    this.childRoutes.push(e);
                    r.addRoute(e);
                }
            }
        }
        this.q = true;
        if (e.length > 0) this.j = Promise.all(e).then((() => {
            this.j = null;
        }));
        if (i.length > 0) this.B = Promise.all(i).then((() => {
            this.B = null;
        }));
    }
    static setRoot(t) {
        const e = t.get(n).scopeTo("RouteContext");
        if (!t.has(S, true)) Zt(new Error(`The provided container has no registered IAppRoot. RouteContext.setRoot can only be used after Aurelia.app was called, on a container that is within that app's component tree.`), e);
        if (t.has(Gt, true)) Zt(new Error(`A root RouteContext is already registered. A possible cause is the RouterConfiguration being registered more than once in the same container tree. If you have a multi-rooted app, make sure you register RouterConfiguration only in the "forked" containers and not in the common root.`), e);
        const {controller: i} = t.get(S);
        if (void 0 === i) Zt(new Error(`The provided IAppRoot does not (yet) have a controller. A possible cause is calling this API manually before Aurelia.start() is called`), e);
        const s = t.get(Pt);
        const r = s.getRouteContext(null, i.definition, i.viewModel, i.container, null);
        t.register(w.instance(Gt, r));
        r.node = s.routeTree.root;
    }
    static resolve(t, e) {
        const i = t.container;
        const s = i.get(n).scopeTo("RouteContext");
        if (null === e || void 0 === e) {
            s.trace(`resolve(context:%s) - returning root RouteContext`, e);
            return t;
        }
        if (Jt(e)) {
            s.trace(`resolve(context:%s) - returning provided RouteContext`, e);
            return e;
        }
        if (e instanceof i.get(R).Node) try {
            const t = b.for(e, {
                searchParents: true
            });
            s.trace(`resolve(context:Node(nodeName:'${e.nodeName}'),controller:'${t.definition.name}') - resolving RouteContext from controller's RenderContext`);
            return t.container.get(Gt);
        } catch (t) {
            s.error(`Failed to resolve RouteContext from Node(nodeName:'${e.nodeName}')`, t);
            throw t;
        }
        if (v(e)) {
            const t = e.$controller;
            s.trace(`resolve(context:CustomElementViewModel(name:'${t.definition.name}')) - resolving RouteContext from controller's RenderContext`);
            return t.container.get(Gt);
        }
        if (C(e)) {
            const t = e;
            s.trace(`resolve(context:CustomElementController(name:'${t.definition.name}')) - resolving RouteContext from controller's RenderContext`);
            return t.container.get(Gt);
        }
        Zt(new Error(`Invalid context type: ${Object.prototype.toString.call(e)}`), s);
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
        const i = this.container.get(e.component.key);
        if (!this.q) {
            const t = RouteDefinition.resolve(i, this.definition, e);
            this.processDefinition(t);
        }
        const s = ComponentAgent.for(i, t, e, this);
        this.hostControllerProvider.dispose();
        return s;
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
            n = i.recognizer.recognize(t);
            if (null === n) {
                if (!e || i.isRoot) return null;
                i = i.parent;
            } else s = false;
        }
        let r;
        if (Reflect.has(n.params, B)) r = n.params[B] ?? null; else r = null;
        return new $RecognizedRoute(n, r);
    }
    addRoute(t) {
        this.logger.trace(`addRoute(routeable:'${t}')`);
        return o(RouteDefinition.resolve(t, this.definition, null, this), (t => {
            for (const e of t.path) this.$addRoute(e, t.caseSensitive, t);
            this.H.addRoute(t);
            this.childRoutes.push(t);
        }));
    }
    $addRoute(t, e, i) {
        this.recognizer.add({
            path: t,
            caseSensitive: e,
            handler: i
        }, true);
    }
    resolveLazy(t) {
        return this.moduleLoader.load(t, (e => {
            const i = e.raw;
            if ("function" === typeof i) {
                const t = l.resource.getAll(i).find(Kt);
                if (void 0 !== t) return t;
            }
            let s;
            let n;
            for (const t of e.items) if (t.isConstructable) {
                const e = t.definitions.find(Kt);
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
        if (!_t(t)) return null;
        const e = t.component;
        let i;
        let s = false;
        if (e instanceof RouteDefinition) {
            i = e;
            s = true;
        } else if ("string" === typeof e) i = this.childRoutes.find((t => t.id === e)); else if (0 === e.type) i = this.childRoutes.find((t => t.id === e.value)); else i = RouteDefinition.resolve(e, null, null, this);
        if (void 0 === i) return null;
        const n = t.params;
        const r = this.recognizer;
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
                    recognizedRoute: new $RecognizedRoute(new O(e.endpoint, e.consumed), null),
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
                recognizedRoute: new $RecognizedRoute(new O(c.endpoint, c.consumed), null),
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

function Jt(t) {
    return t instanceof RouteContext;
}

function Zt(t, e) {
    e.error(t);
    throw t;
}

function Kt(t) {
    return b.isType(t.Type);
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
        this.W = void 0;
    }
    resolve() {
        return o(this.W, g);
    }
    setIsActive(t, e) {
        void o(this.W, (() => {
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
        s = this.W = o(this.W, (() => o(t, (t => {
            if (t.config.nav) e[i] = NavigationRoute.create(t); else e.splice(i, 1);
            if (this.W === s) this.W = void 0;
        }))));
    }
}

class NavigationRoute {
    constructor(t, e, i, s) {
        this.id = t;
        this.path = e;
        this.title = i;
        this.data = s;
    }
    static create(t) {
        return new NavigationRoute(t.id, t.path, t.config.title, t.data);
    }
    get isActive() {
        return this.G;
    }
    setIsActive(t, e) {
        this.G = this.path.some((i => t.isActive(i, e)));
    }
}

let Qt = class ViewportCustomElement {
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
        for (const e of Xt) {
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

it([ N ], Qt.prototype, "name", void 0);

it([ N ], Qt.prototype, "usedBy", void 0);

it([ N ], Qt.prototype, "default", void 0);

it([ N ], Qt.prototype, "fallback", void 0);

Qt = it([ I({
    name: "au-viewport"
}), st(0, n), st(1, Gt) ], Qt);

const Xt = [ "name", "usedBy", "default", "fallback" ];

let te = class LoadCustomAttribute {
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
        const n = b.for(this.el, {
            optional: true
        });
        if (null !== n) n.viewModel[this.attribute] = this.instructions; else if (null === this.href) this.el.removeAttribute(this.attribute); else {
            const t = e ? this.href : this.locationMgr.addBaseHref(this.href);
            this.el.setAttribute(this.attribute, t);
        }
    }
};

it([ N({
    mode: 2,
    primary: true,
    callback: "valueChanged"
}) ], te.prototype, "route", void 0);

it([ N({
    mode: 2,
    callback: "valueChanged"
}) ], te.prototype, "params", void 0);

it([ N({
    mode: 2
}) ], te.prototype, "attribute", void 0);

it([ N({
    mode: 4
}) ], te.prototype, "active", void 0);

it([ N({
    mode: 2,
    callback: "valueChanged"
}) ], te.prototype, "context", void 0);

te = it([ A("load"), st(0, T), st(1, V), st(2, Pt), st(3, rt), st(4, Gt), st(5, at) ], te);

let ee = class HrefCustomAttribute {
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
    get isExternal() {
        return this.el.hasAttribute("external") || this.el.hasAttribute("data-external");
    }
    binding() {
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.isEnabled = this.isEnabled && null === P(this.el, U.getDefinition(te).key);
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
        this.Y(t);
    }
    Y(t) {
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

it([ N({
    mode: 2
}) ], ee.prototype, "value", void 0);

ee = it([ A({
    name: "href",
    noMultiBindings: true
}), st(0, T), st(1, V), st(2, Pt), st(3, Gt), st(4, x) ], ee);

const ie = Pt;

const se = [ ie ];

const ne = Qt;

const re = te;

const oe = ee;

const he = [ Qt, te, ee ];

function ae(e, i) {
    let s = null;
    if (t(i)) s = i.basePath ?? null; else i = {};
    return e.register(w.cachedCallback(ht, ((t, e, i) => {
        const n = t.get(x);
        const r = new URL(n.document.baseURI);
        r.pathname = ut(s ?? r.pathname);
        return r;
    })), L.hydrated(Pt, (t => t.N(i))), L.hydrated(c, RouteContext.setRoot), L.activated(Pt, (t => t.start(true))), L.deactivated(Pt, (t => {
        t.stop();
    })), ...se, ...he);
}

const ce = {
    register(t) {
        return ae(t);
    },
    customize(t) {
        return {
            register(e) {
                return ae(e, t);
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

function ue(t) {
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
        this.scrollStates.forEach(ue);
        this.scrollStates = null;
    }
}

const le = i.createInterface("IStateManager", (t => t.singleton(ScrollStateManager)));

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

export { wt as AST, ActionExpression, nt as AuNavId, ComponentAgent, ComponentExpression, CompositeSegmentExpression, se as DefaultComponents, he as DefaultResources, pt as ExpressionKind, ee as HrefCustomAttribute, oe as HrefCustomAttributeRegistration, at as ILocationManager, Gt as IRouteContext, Pt as IRouter, rt as IRouterEvents, le as IStateManager, te as LoadCustomAttribute, re as LoadCustomAttributeRegistration, LocationChangeEvent, NavigationCancelEvent, NavigationEndEvent, NavigationErrorEvent, NavigationOptions, NavigationStartEvent, ParameterExpression, ParameterListExpression, zt as Route, RouteConfig, RouteContext, RouteDefinition, RouteExpression, RouteNode, RouteTree, Ut as Router, ce as RouterConfiguration, RouterOptions, ie as RouterRegistration, ScopedSegmentExpression, SegmentExpression, SegmentGroupExpression, Transition, ViewportAgent, Qt as ViewportCustomElement, ne as ViewportCustomElementRegistration, ViewportExpression, At as isManagedState, qt as route, Tt as toManagedState };
//# sourceMappingURL=index.mjs.map
