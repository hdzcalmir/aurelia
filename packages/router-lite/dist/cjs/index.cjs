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
          case "fallback":
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
            v(s, n);
            break;

          case "routes":
            if (!(s instanceof Array)) d("Array", n, s);
            for (const t of s) {
                const e = `${n}[${s.indexOf(t)}]`;
                v(t, e);
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

function v(t, e) {
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
        if (!s.isCustomElementViewModel(t) && !u(t)) d(`an object with at least a 'component' property (see Routeable)`, e, t);
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

function x(t, e, s, i) {
    var n = arguments.length, r = n < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, s) : i, o;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(t, e, s, i); else for (var h = t.length - 1; h >= 0; h--) if (o = t[h]) r = (n < 3 ? o(r) : n > 3 ? o(e, s, r) : o(e, s)) || r;
    return n > 3 && r && Object.defineProperty(e, s, r), r;
}

function $(t, e) {
    return function(s, i) {
        e(s, i, t);
    };
}

const E = "au-nav-id";

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

const R = e.DI.createInterface("IRouterEvents", (t => t.singleton(b)));

let b = class RouterEvents {
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

b = x([ $(0, e.IEventAggregator), $(1, e.ILogger) ], b);

class LocationChangeEvent {
    constructor(t, e, s, i) {
        this.id = t;
        this.url = e;
        this.trigger = s;
        this.state = i;
    }
    get name() {
        return "au:router:location-change";
    }
    toString() {
        return `LocationChangeEvent(id:${this.id},url:'${this.url}',trigger:'${this.trigger}')`;
    }
}

class NavigationStartEvent {
    constructor(t, e, s, i) {
        this.id = t;
        this.instructions = e;
        this.trigger = s;
        this.managedState = i;
    }
    get name() {
        return "au:router:navigation-start";
    }
    toString() {
        return `NavigationStartEvent(id:${this.id},instructions:'${this.instructions}',trigger:'${this.trigger}')`;
    }
}

class NavigationEndEvent {
    constructor(t, e, s) {
        this.id = t;
        this.instructions = e;
        this.finalInstructions = s;
    }
    get name() {
        return "au:router:navigation-end";
    }
    toString() {
        return `NavigationEndEvent(id:${this.id},instructions:'${this.instructions}',finalInstructions:'${this.finalInstructions}')`;
    }
}

class NavigationCancelEvent {
    constructor(t, e, s) {
        this.id = t;
        this.instructions = e;
        this.reason = s;
    }
    get name() {
        return "au:router:navigation-cancel";
    }
    toString() {
        return `NavigationCancelEvent(id:${this.id},instructions:'${this.instructions}',reason:${String(this.reason)})`;
    }
}

class NavigationErrorEvent {
    constructor(t, e, s) {
        this.id = t;
        this.instructions = e;
        this.error = s;
    }
    get name() {
        return "au:router:navigation-error";
    }
    toString() {
        return `NavigationErrorEvent(id:${this.id},instructions:'${this.instructions}',error:${String(this.error)})`;
    }
}

const y = e.DI.createInterface("IBaseHref");

const k = e.DI.createInterface("ILocationManager", (t => t.singleton(S)));

let S = class BrowserLocationManager {
    constructor(t, e, s, i, n, r) {
        this.logger = t;
        this.events = e;
        this.history = s;
        this.location = i;
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
        const i = this.removeBaseHref(`${t}${I(e)}${s}`);
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
        t = C(t);
        this.logger.trace(`removeBaseHref(path:'${e}') -> '${t}'`);
        return t;
    }
};

x([ e.bound ], S.prototype, "onPopState", null);

x([ e.bound ], S.prototype, "onHashChange", null);

S = x([ $(0, e.ILogger), $(1, R), $(2, s.IHistory), $(3, s.ILocation), $(4, s.IWindow), $(5, y) ], S);

function C(t) {
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

function I(t) {
    return t.length > 0 && !t.startsWith("?") ? `?${t}` : t;
}

const N = [ "?", "#", "/", "+", "(", ")", ".", "@", "!", "=", ",", "&", "'", "~", ";" ];

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

const A = new Map;

const T = new Map;

class RouteExpression {
    constructor(t, e, s, i, n, r) {
        this.raw = t;
        this.isAbsolute = e;
        this.root = s;
        this.queryParams = i;
        this.fragment = n;
        this.fragmentIsRoute = r;
    }
    get kind() {
        return 0;
    }
    static parse(t, e) {
        const s = e ? A : T;
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
        if ("" === t) return new RouteExpression("", false, SegmentExpression.EMPTY, null != n ? Object.freeze(n) : W, s, e);
        const o = new ParserState(t);
        o.record();
        const h = o.consumeOptional("/");
        const a = CompositeSegmentExpression.parse(o);
        o.ensureDone();
        const c = o.playback();
        return new RouteExpression(c, h, a, null != n ? Object.freeze(n) : W, s, e);
    }
    toInstructionTree(t) {
        return new ViewportInstructionTree(t, this.isAbsolute, this.root.toInstructions(0, 0), a(this.queryParams, t.queryParams, true), this.fragment ?? t.fragment);
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
    constructor(t, e, s) {
        this.raw = t;
        this.left = e;
        this.right = s;
    }
    get kind() {
        return 2;
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
    constructor(t, e, s, i, n) {
        this.raw = t;
        this.component = e;
        this.action = s;
        this.viewport = i;
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
        } else while (!t.done && !t.startsWith(...N)) t.advance();
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
    constructor(t, e, s) {
        this.raw = t;
        this.name = e;
        this.parameterList = s;
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
            while (!t.done && !t.startsWith(...N)) t.advance();
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
            while (!t.done && !t.startsWith(...N)) t.advance();
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
    constructor(t, e, s) {
        this.raw = t;
        this.key = e;
        this.value = s;
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
        while (!t.done && !t.startsWith(...N)) t.advance();
        let s = decodeURIComponent(t.playback());
        if (0 === s.length) t.expect("parameter key");
        let i;
        if (t.consumeOptional("=")) {
            t.record();
            while (!t.done && !t.startsWith(...N)) t.advance();
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

const V = Object.freeze({
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

const P = new WeakMap;

class ViewportAgent {
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
        this.t = null;
        this.logger = i.container.get(e.ILogger).scopeTo(`ViewportAgent<${i.friendlyPath}>`);
        this.logger.trace(`constructor()`);
    }
    get $state() {
        return D(this.state);
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
        let i = P.get(t);
        if (void 0 === i) {
            const n = s.Controller.getCachedOrThrow(t);
            P.set(t, i = new ViewportAgent(t, n, e));
        }
        return i;
    }
    activateFromViewport(t, e, s) {
        const i = this.currTransition;
        if (null !== i) L(i);
        this.isActive = true;
        switch (this.nextState) {
          case 64:
            switch (this.currState) {
              case 8192:
                this.logger.trace(`activateFromViewport() - nothing to activate at %s`, this);
                return;

              case 4096:
                this.logger.trace(`activateFromViewport() - activating existing componentAgent at %s`, this);
                return this.curCA.activate(t, e, s);

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
                const s = new Promise((t => {
                    e.continueWith((() => {
                        t();
                    }));
                }));
                return e.start().done ? void 0 : s;
            }

          default:
            this.unexpectedState("activateFromViewport 2");
        }
    }
    deactivateFromViewport(t, e, s) {
        const i = this.currTransition;
        if (null !== i) L(i);
        this.isActive = false;
        switch (this.currState) {
          case 8192:
            this.logger.trace(`deactivateFromViewport() - nothing to deactivate at %s`, this);
            return;

          case 4096:
            this.logger.trace(`deactivateFromViewport() - deactivating existing componentAgent at %s`, this);
            return this.curCA.deactivate(t, e, s);

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
                const s = new Promise((t => {
                    e.continueWith((() => {
                        t();
                    }));
                }));
                return e.start().done ? void 0 : s;
            }
        }
    }
    handles(t) {
        if (!this.isAvailable()) return false;
        const e = this.viewport;
        const s = t.viewportName;
        const i = e.name;
        if (s !== nt && i !== s) {
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
    canUnload(t, s) {
        if (null === this.currTransition) this.currTransition = t;
        L(t);
        if (true !== t.guardsResult) return;
        s.push();
        void e.onResolve(this.t, (() => {
            Batch.start((e => {
                this.logger.trace(`canUnload() - invoking on children at %s`, this);
                for (const s of this.currNode.children) s.context.vpa.canUnload(t, e);
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
                s.pop();
            })).start();
        }));
    }
    canLoad(t, s) {
        if (null === this.currTransition) this.currTransition = t;
        L(t);
        if (true !== t.guardsResult) return;
        s.push();
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
            const s = this.nextNode;
            switch (this.$plan) {
              case "none":
              case "invoke-lifecycles":
                {
                    this.logger.trace(`canLoad(next:%s) - plan set to '%s', compiling residue`, s, this.$plan);
                    t.push();
                    const i = s.context;
                    void e.onResolve(i.resolved, (() => e.onResolve(e.onResolve(e.resolveAll(...s.residue.splice(0).map((t => q(this.logger, s, t)))), (() => e.resolveAll(...i.getAvailableViewportAgents().reduce(((t, e) => {
                        const i = e.viewport;
                        const n = i.default;
                        if (null === n) return t;
                        t.push(q(this.logger, s, ViewportInstruction.create({
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
                for (const s of this.nextNode.children) s.context.vpa.canLoad(t, e);
                return;

              case 64:
                return;

              default:
                this.unexpectedState("canLoad");
            }
        })).continueWith((() => {
            this.logger.trace(`canLoad() - finished at %s`, this);
            s.pop();
        })).start();
    }
    unloading(t, e) {
        L(t);
        U(this, t);
        e.push();
        Batch.start((e => {
            this.logger.trace(`unloading() - invoking on children at %s`, this);
            for (const s of this.currNode.children) s.context.vpa.unloading(t, e);
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
                        this.curCA.unloading(t, this.nextNode, e);
                    })).continueWith((() => {
                        this.logger.trace(`unloading() - finished at %s`, this);
                        this.currState = 256;
                        s.pop();
                    })).start();
                    return;
                }

              case 8192:
                this.logger.trace(`unloading() - nothing to unload at %s`, this);
                for (const s of this.currNode.children) s.context.vpa.unloading(t, e);
                return;

              default:
                this.unexpectedState("unloading");
            }
        })).continueWith((() => {
            e.pop();
        })).start();
    }
    loading(t, e) {
        L(t);
        U(this, t);
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
                for (const s of this.nextNode.children) s.context.vpa.loading(t, e);
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
    deactivate(t, e, s) {
        L(e);
        U(this, e);
        s.push();
        switch (this.currState) {
          case 256:
            this.logger.trace(`deactivate() - invoking on existing component at %s`, this);
            this.currState = 128;
            switch (this.$plan) {
              case "none":
              case "invoke-lifecycles":
                s.pop();
                return;

              case "replace":
                {
                    const i = this.hostController;
                    e.run((() => this.curCA.deactivate(t, i, 4)), (() => {
                        s.pop();
                    }));
                }
            }
            return;

          case 8192:
            this.logger.trace(`deactivate() - nothing to deactivate at %s`, this);
            s.pop();
            return;

          case 128:
            this.logger.trace(`deactivate() - already deactivating at %s`, this);
            s.pop();
            return;

          default:
            this.unexpectedState("deactivate");
        }
    }
    activate(t, e, s) {
        L(e);
        U(this, e);
        s.push();
        if (32 === this.nextState) {
            this.logger.trace(`activate() - invoking canLoad(), loading() and activate() on new component due to resolution 'dynamic' at %s`, this);
            Batch.start((t => {
                this.canLoad(e, t);
            })).continueWith((t => {
                this.loading(e, t);
            })).continueWith((s => {
                this.activate(t, e, s);
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
                        const n = 0;
                        e.run((() => {
                            s.push();
                            return this.nextCA.activate(t, i, n);
                        }), (() => {
                            s.pop();
                        }));
                    }
                }
            })).continueWith((t => {
                this.processDynamicChildren(e, t);
            })).continueWith((() => {
                s.pop();
            })).start();
            return;

          case 64:
            this.logger.trace(`activate() - nothing to activate at %s`, this);
            s.pop();
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
        L(t);
        U(this, t);
        if (!(256 === this.currState && 2 === this.nextState)) this.unexpectedState("swap");
        this.currState = 128;
        this.nextState = 1;
        switch (this.$plan) {
          case "none":
          case "invoke-lifecycles":
            {
                this.logger.trace(`swap() - skipping this level and swapping children instead at %s`, this);
                const s = n(this.nextNode.children, this.currNode.children);
                for (const i of s) i.context.vpa.swap(t, e);
                return;
            }

          case "replace":
            {
                this.logger.trace(`swap() - running normally at %s`, this);
                const s = this.hostController;
                const i = this.curCA;
                const n = this.nextCA;
                e.push();
                Batch.start((e => {
                    t.run((() => {
                        e.push();
                        return i.deactivate(null, s, 4);
                    }), (() => {
                        e.pop();
                    }));
                })).continueWith((e => {
                    t.run((() => {
                        e.push();
                        return n.activate(null, s, 0);
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
    processDynamicChildren(t, s) {
        this.logger.trace(`processDynamicChildren() - %s`, this);
        const i = this.nextNode;
        t.run((() => {
            s.push();
            const t = i.context;
            return e.onResolve(t.resolved, (() => {
                const s = i.children.slice();
                return e.onResolve(e.resolveAll(...i.residue.splice(0).map((t => q(this.logger, i, t)))), (() => e.onResolve(e.resolveAll(...t.getAvailableViewportAgents().reduce(((t, e) => {
                    const s = e.viewport;
                    const n = s.default;
                    if (null === n) return t;
                    t.push(q(this.logger, i, ViewportInstruction.create({
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
                    return i.context.vpa.canLoad(t, s);
                }), (() => {
                    s.pop();
                }));
            })).continueWith((s => {
                for (const i of e) t.run((() => {
                    s.push();
                    return i.context.vpa.loading(t, s);
                }), (() => {
                    s.pop();
                }));
            })).continueWith((s => {
                for (const i of e) t.run((() => {
                    s.push();
                    return i.context.vpa.activate(null, t, s);
                }), (() => {
                    s.pop();
                }));
            })).continueWith((() => {
                s.pop();
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
        const s = this.curCA?.routeNode ?? null;
        if (null === s || s.component !== e.component) this.$plan = "replace"; else this.$plan = e.context.definition.config.getTransitionPlan(s, e);
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
            this.t = e.onResolve(this.nextCA?.deactivate(null, this.hostController, 0), (() => {
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
            L(this.currTransition);
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

function U(t, e) {
    if (true !== e.guardsResult) throw new Error(`Unexpected guardsResult ${e.guardsResult} at ${t}`);
}

function L(t) {
    if (void 0 !== t.error && !t.erredWithUnknownRoute) throw t.error;
}

var O;

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
})(O || (O = {}));

const j = new Map;

function D(t) {
    let e = j.get(t);
    if (void 0 === e) j.set(t, e = M(t));
    return e;
}

function M(t) {
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

let B = 0;

class RouteNode {
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
    get root() {
        return this.tree.root;
    }
    static create(t) {
        const {[i.RESIDUE]: e, ...s} = t.params ?? {};
        return new RouteNode(++B, t.path, t.finalPath, t.context, t.originalInstruction ?? t.instruction, t.instruction, s, t.queryParams ?? W, t.fragment ?? null, t.data ?? {}, t.viewport ?? null, t.title ?? null, t.component, t.children ?? [], t.residue ?? []);
    }
    contains(t) {
        if (this.context === t.options.context) {
            const e = this.children;
            const s = t.children;
            for (let t = 0, i = e.length; t < i; ++t) for (let n = 0, r = s.length; n < r; ++n) if (t + n < i && (e[t + n].originalInstruction?.contains(s[n]) ?? false)) {
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
        const s = this.context?.definition.config.path ?? "";
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

function q(t, s, i) {
    t.trace(`createAndAppendNodes(node:%s,vi:%s`, s, i);
    switch (i.component.type) {
      case 0:
        switch (i.component.value) {
          case "..":
            s = s.context.parent?.node ?? s;
            s.clearChildren();

          case ".":
            return e.resolveAll(...i.children.map((e => q(t, s, e))));

          default:
            {
                t.trace(`createAndAppendNodes invoking createNode`);
                const n = s.context;
                const r = i.clone();
                let o = i.recognizedRoute;
                if (null !== o) return F(t, s, z(t, s, i, o, r));
                if (0 === i.children.length) {
                    const e = n.generateViewportInstruction(i);
                    if (null !== e) {
                        s.tree.queryParams = a(s.tree.queryParams, e.query, true);
                        const n = e.vi;
                        n.children.push(...i.children);
                        return F(t, s, z(t, s, n, n.recognizedRoute, i));
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
                        return F(t, s, z(t, s, r.vi, r.vi.recognizedRoute, i));
                    }
                    const o = i.component.value;
                    if ("" === o) return;
                    let h = i.viewport;
                    if (null === h || 0 === h.length) h = nt;
                    const c = n.getFallbackViewportAgent(h);
                    const u = null !== c ? c.viewport.fallback : n.definition.fallback;
                    if (null === u) throw new UnknownRouteError(`Neither the route '${o}' matched any configured route at '${n.friendlyPath}' nor a fallback is configured for the viewport '${h}' - did you forget to add '${o}' to the routes list of the route decorator of '${n.component.name}'?`);
                    t.trace(`Fallback is set to '${u}'. Looking for a recognized route.`);
                    const l = n.childRoutes.find((t => t.id === u));
                    if (void 0 !== l) return F(t, s, H(t, l, s, i));
                    t.trace(`No route definition for the fallback '${u}' is found; trying to recognize the route.`);
                    const f = n.recognize(u, true);
                    if (null !== f && f.residue !== u) return F(t, s, z(t, s, i, f, null));
                    t.trace(`The fallback '${u}' is not recognized as a route; treating as custom element name.`);
                    return F(t, s, H(t, RouteDefinition.resolve(u, n.definition, null, n), s, i));
                }
                o.residue = null;
                i.component.value = f ? c : c.slice(0, -(l.length + 1));
                for (let t = 0; t < h; ++t) {
                    const t = i.children[0];
                    if (l?.startsWith(t.component.value) ?? false) break;
                    i.viewport = t.viewport;
                    i.children = t.children;
                }
                t.trace("createNode after adjustment vi:%s", i);
                return F(t, s, z(t, s, i, o, r));
            }
        }

      case 3:
      case 4:
      case 2:
        {
            const n = s.context;
            return e.onResolve(RouteDefinition.resolve(i.component.value, n.definition, null, n), (r => {
                const {vi: o, query: h} = n.generateViewportInstruction({
                    component: r,
                    params: i.params ?? e.emptyObject,
                    open: i.open,
                    close: i.close,
                    viewport: i.viewport,
                    children: i.children.slice()
                });
                s.tree.queryParams = a(s.tree.queryParams, h, true);
                return F(t, s, z(t, s, o, o.recognizedRoute, i));
            }));
        }
    }
}

function z(t, s, i, n, r, o = n.route.endpoint.route) {
    const h = s.context;
    const a = s.tree;
    return e.onResolve(o.handler, (e => {
        o.handler = e;
        t.trace(`creatingConfiguredNode(rd:%s, vi:%s)`, e, i);
        if (null === e.redirectTo) {
            const c = (i.viewport?.length ?? 0) > 0 ? i.viewport : e.viewport;
            const u = e.component;
            const l = h.resolveViewportAgent(new ViewportRequest(c, u.name));
            const f = h.container.get(J);
            const p = f.getRouteContext(l, u, null, l.hostController.container, h.definition);
            t.trace("createConfiguredNode setting the context node");
            const d = p.node = RouteNode.create({
                path: n.route.endpoint.route.path,
                finalPath: o.path,
                context: p,
                instruction: i,
                originalInstruction: r,
                params: {
                    ...n.route.params
                },
                queryParams: a.queryParams,
                fragment: a.fragment,
                data: e.data,
                viewport: c,
                component: u,
                title: e.config.title,
                residue: [ ...null === n.residue ? [] : [ ViewportInstruction.create(n.residue) ], ...i.children ]
            });
            d.setTree(s.tree);
            t.trace(`createConfiguredNode(vi:%s) -> %s`, i, d);
            return d;
        }
        const c = RouteExpression.parse(o.path, false);
        const u = RouteExpression.parse(e.redirectTo, false);
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
            if (null !== g) if (g.component.isDynamic && (d?.component.isDynamic ?? false)) p.push(n.route.params[d.component.name]); else p.push(g.raw);
        }
        const m = p.filter(Boolean).join("/");
        const x = h.recognize(m);
        if (null === x) throw new UnknownRouteError(`'${m}' did not match any configured route or registered component name at '${h.friendlyPath}' - did you forget to add '${m}' to the routes list of the route decorator of '${h.component.name}'?`);
        return z(t, s, i, n, r, x.route.endpoint.route);
    }));
}

function F(t, s, i) {
    return e.onResolve(i, (e => {
        t.trace(`appendNode($childNode:%s)`, e);
        s.appendChild(e);
        return e.context.vpa.scheduleUpdate(s.tree.options, e);
    }));
}

function H(t, s, n, r) {
    const o = new $RecognizedRoute(new i.RecognizedRoute(new i.Endpoint(new i.ConfigurableRoute(s.path[0], s.caseSensitive, s), []), e.emptyObject), null);
    r.children.length = 0;
    return z(t, n, r, o, null);
}

const W = Object.freeze(new URLSearchParams);

function _(e) {
    return t.isObject(e) && true === Object.prototype.hasOwnProperty.call(e, E);
}

function G(t, e) {
    return {
        ...t,
        [E]: e
    };
}

function Y(t, e) {
    if ("function" === typeof e) return e(t);
    return e;
}

class RouterOptions {
    constructor(t, e, s, i) {
        this.useUrlFragmentHash = t;
        this.useHref = e;
        this.historyStrategy = s;
        this.buildTitle = i;
    }
    static get DEFAULT() {
        return RouterOptions.create({});
    }
    static create(t) {
        return new RouterOptions(t.useUrlFragmentHash ?? false, t.useHref ?? true, t.historyStrategy ?? "push", t.buildTitle ?? null);
    }
    getHistoryStrategy(t) {
        return Y(t, this.historyStrategy);
    }
    stringifyProperties() {
        return [ [ "historyStrategy", "history" ] ].map((([t, e]) => {
            const s = this[t];
            return `${e}:${"function" === typeof s ? s : `'${s}'`}`;
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
    constructor(t, e, s, i, n, r, o) {
        super(t.useUrlFragmentHash, t.useHref, t.historyStrategy, t.buildTitle);
        this.title = e;
        this.titleSeparator = s;
        this.context = i;
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
            const s = t();
            if (s instanceof Promise) s.then(e).catch((t => {
                this.handleError(t);
            })); else e(s);
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

const J = e.DI.createInterface("IRouter", (t => t.singleton(exports.Router)));

exports.Router = class Router {
    constructor(t, e, s, i, n) {
        this.container = t;
        this.p = e;
        this.logger = s;
        this.events = i;
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
        this.vpaLookup = new Map;
        this.logger = s.root.scopeTo("Router");
    }
    get ctx() {
        let t = this.h;
        if (null === t) {
            if (!this.container.has(ht, true)) throw new Error(`Root RouteContext is not set. Did you forget to register RouteConfiguration, or try to navigate before calling Aurelia.start()?`);
            t = this.h = this.container.get(ht);
        }
        return t;
    }
    get routeTree() {
        let t = this.u;
        if (null === t) {
            const e = this.ctx;
            t = this.u = new RouteTree(NavigationOptions.create({
                ...this.options
            }), W, null, RouteNode.create({
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
    I(t) {
        this.options = RouterOptions.create(t);
    }
    start(t) {
        this.R = "function" === typeof this.options.buildTitle;
        this.locationMgr.startListening();
        this.locationChangeSubscription = this.events.subscribe("au:router:location-change", (t => {
            this.p.taskQueue.queueTask((() => {
                const e = _(t.state) ? t.state : null;
                const s = NavigationOptions.create({
                    ...this.options,
                    historyStrategy: "replace"
                });
                const i = ViewportInstructionTree.create(t.url, s, this.ctx);
                this.enqueue(i, t.trigger, e, null);
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
            context: s
        });
        this.logger.trace("isActive(instructions:%s,ctx:%s)", i, s);
        return this.routeTree.contains(i);
    }
    getRouteContext(t, s, i, n, r) {
        const o = n.get(e.ILogger).scopeTo("RouteContext");
        const h = RouteDefinition.resolve("function" === typeof i?.getRouteConfig ? i : s.Type, r, null);
        let a = this.vpaLookup.get(t);
        if (void 0 === a) this.vpaLookup.set(t, a = new WeakMap);
        let c = a.get(h);
        if (void 0 !== c) {
            o.trace(`returning existing RouteContext for %s`, h);
            return c;
        }
        o.trace(`creating new RouteContext for %s`, h);
        const u = n.has(ht, true) ? n.get(ht) : null;
        a.set(h, c = new RouteContext(t, u, s, h, n, this));
        return c;
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
        return ViewportInstructionTree.create(t, NavigationOptions.create({
            ...this.options,
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
        let s = this.resolveContext(t.options.context);
        const i = t.instructions.children;
        const r = s.node.children;
        const o = !this.navigated || i.length !== r.length || i.some(((t, e) => !(r[e]?.originalInstruction.equals(t) ?? false)));
        const h = o || "replace" === this.ctx.definition.config.getTransitionPlan(t.previousRouteTree.root, t.routeTree.root);
        if (!h) {
            this.logger.trace(`run(tr:%s) - NOT processing route`, t);
            this.navigated = true;
            this.C = false;
            t.resolve(false);
            this.runNextTransition();
            return;
        }
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
            return e.onResolve(s.resolved, (() => Z(o, i, s, n.node)));
        }), (() => {
            const e = t.previousRouteTree.root.children;
            const s = t.routeTree.root.children;
            const i = n(e, s);
            Batch.start((s => {
                this.logger.trace(`run() - invoking canUnload on ${e.length} nodes`);
                for (const i of e) i.context.vpa.canUnload(t, s);
            })).continueWith((e => {
                if (true !== t.guardsResult) {
                    e.push();
                    this.cancelNavigation(t);
                }
            })).continueWith((e => {
                this.logger.trace(`run() - invoking canLoad on ${s.length} nodes`);
                for (const i of s) i.context.vpa.canLoad(t, e);
            })).continueWith((e => {
                if (true !== t.guardsResult) {
                    e.push();
                    this.cancelNavigation(t);
                }
            })).continueWith((s => {
                this.logger.trace(`run() - invoking unloading on ${e.length} nodes`);
                for (const i of e) i.context.vpa.unloading(t, s);
            })).continueWith((e => {
                this.logger.trace(`run() - invoking loading on ${s.length} nodes`);
                for (const i of s) i.context.vpa.loading(t, e);
            })).continueWith((e => {
                this.logger.trace(`run() - invoking swap on ${i.length} nodes`);
                for (const s of i) s.context.vpa.swap(t, e);
            })).continueWith((() => {
                this.logger.trace(`run() - finalizing transition`);
                i.forEach((function(t) {
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
                    this.locationMgr.pushState(G(t.options.state, t.id), this.updateTitle(t), e);
                    break;

                  case "replace":
                    this.locationMgr.replaceState(G(t.options.state, t.id), this.updateTitle(t), e);
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
        const s = t.previousRouteTree.root.children;
        const i = t.routeTree.root.children;
        const r = n(s, i);
        r.forEach((function(t) {
            t.context.vpa.cancelUpdate();
        }));
        this.instructions = t.prevInstructions;
        this.u = t.previousRouteTree;
        this.C = false;
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

exports.Router = x([ $(0, e.IContainer), $(1, s.IPlatform), $(2, e.ILogger), $(3, R), $(4, k) ], exports.Router);

function Z(t, s, i, n) {
    t.trace(`updateNode(ctx:%s,node:%s)`, i, n);
    n.queryParams = s.queryParams;
    n.fragment = s.fragment;
    if (!n.context.isRoot) n.context.vpa.scheduleUpdate(n.tree.options, n);
    if (n.context === i) {
        n.clearChildren();
        return e.onResolve(e.resolveAll(...s.children.map((e => q(t, n, e)))), (() => e.resolveAll(...i.getAvailableViewportAgents().reduce(((e, s) => {
            const i = s.viewport;
            const r = i.default;
            if (null === r) return e;
            e.push(q(t, n, ViewportInstruction.create({
                component: r,
                viewport: i.name
            })));
            return e;
        }), []))));
    }
    return e.resolveAll(...n.children.map((e => Z(t, s, i, e))));
}

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
        const s = null === this.params || 0 === Object.keys(this.params).length ? "" : `(${K(this.params)})`;
        const i = 0 === e.length || null === this.viewport || 0 === this.viewport.length ? "" : `@${this.viewport}`;
        const n = `${"(".repeat(this.open)}${e}${s}${i}${")".repeat(this.close)}`;
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
        const s = 0 === this.children.length ? "" : `children:[${this.children.map(String).join(",")}]`;
        const i = [ t, e, s ].filter(Boolean).join(",");
        return `VPI(${i})`;
    }
}

function K(t) {
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

const Q = function() {
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
    static create(t, s, i) {
        const n = NavigationOptions.create({
            ...s
        });
        let r = n.context;
        if (!(r instanceof RouteContext) && null != i) r = RouteContext.resolve(i, r);
        const o = null != r;
        if (t instanceof Array) {
            const s = t.length;
            const i = new Array(s);
            const h = new URLSearchParams(n.queryParams ?? e.emptyObject);
            for (let e = 0; e < s; e++) {
                const s = t[e];
                const n = o ? r.generateViewportInstruction(s) : null;
                if (null !== n) {
                    i[e] = n.vi;
                    a(h, n.query, false);
                } else i[e] = ViewportInstruction.create(s);
            }
            return new ViewportInstructionTree(n, false, i, h, n.fragment);
        }
        if ("string" === typeof t) {
            const e = RouteExpression.parse(t, n.useUrlFragmentHash);
            return e.toInstructionTree(n);
        }
        const h = o ? r.generateViewportInstruction(t) : null;
        const c = new URLSearchParams(n.queryParams ?? e.emptyObject);
        return null !== h ? new ViewportInstructionTree(n, false, [ h.vi ], a(c, h.query, false), n.fragment) : new ViewportInstructionTree(n, false, [ ViewportInstruction.create(t) ], c, n.fragment);
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
            s = this.fragment ?? "";
        }
        let i = this.queryParams.toString();
        i = "" === i ? "" : `?${i}`;
        return `${e}${s}${i}`;
    }
    toPath() {
        return this.children.map((t => t.toUrlComponent())).join("+");
    }
    toString() {
        return `[${this.children.map(String).join(",")}]`;
    }
}

var X;

(function(t) {
    t[t["string"] = 0] = "string";
    t[t["ViewportInstruction"] = 1] = "ViewportInstruction";
    t[t["CustomElementDefinition"] = 2] = "CustomElementDefinition";
    t[t["Promise"] = 3] = "Promise";
    t[t["IRouteViewModel"] = 4] = "IRouteViewModel";
})(X || (X = {}));

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
            return `au$obj${Q(this.value)}`;

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

const tt = e.emptyArray;

function et(t, e) {
    if (!m(t.params, e.params)) return "replace";
    return "none";
}

class RouteConfig {
    constructor(t, e, s, i, n, r, o, h, a, c, u, l) {
        this.id = t;
        this.path = e;
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
    }
    static N(t, e, s) {
        if ("string" === typeof t || t instanceof Array) {
            const i = t;
            const n = e?.redirectTo ?? null;
            const r = e?.caseSensitive ?? false;
            const o = e?.id ?? (i instanceof Array ? i[0] : i);
            const h = e?.title ?? null;
            const a = e?.transitionPlan ?? s?.transitionPlan ?? null;
            const c = e?.viewport ?? null;
            const u = e?.data ?? {};
            const l = e?.routes ?? tt;
            return new RouteConfig(o, i, h, n, r, a, c, u, l, e?.fallback ?? null, null, e?.nav ?? true);
        } else if ("object" === typeof t) {
            const i = t;
            g(i, "");
            const n = i.path ?? e?.path ?? null;
            const r = i.title ?? e?.title ?? null;
            const o = i.redirectTo ?? e?.redirectTo ?? null;
            const h = i.caseSensitive ?? e?.caseSensitive ?? false;
            const a = i.id ?? e?.id ?? (n instanceof Array ? n[0] : n);
            const c = i.transitionPlan ?? e?.transitionPlan ?? s?.transitionPlan ?? null;
            const u = i.viewport ?? e?.viewport ?? null;
            const l = {
                ...e?.data,
                ...i.data
            };
            const f = [ ...i.routes ?? tt, ...e?.routes ?? tt ];
            return new RouteConfig(a, n, r, o, h, c, u, l, f, i.fallback ?? e?.fallback ?? null, i.component ?? null, i.nav ?? true);
        } else d("string, function/class or object", "", t);
    }
    applyChildRouteConfig(t, e) {
        let s = this.path ?? "";
        if ("string" !== typeof s) s = s[0];
        g(t, s);
        return new RouteConfig(t.id ?? this.id, t.path ?? this.path, t.title ?? this.title, t.redirectTo ?? this.redirectTo, t.caseSensitive ?? this.caseSensitive, t.transitionPlan ?? this.transitionPlan ?? e?.transitionPlan ?? null, t.viewport ?? this.viewport, t.data ?? this.data, t.routes ?? this.routes, t.fallback ?? this.fallback, t.component ?? this.component, t.nav ?? this.nav);
    }
    getTransitionPlan(t, e) {
        const s = this.transitionPlan ?? et;
        return "function" === typeof s ? s(t, e) : s;
    }
}

const st = {
    name: e.Protocol.resource.keyFor("route-configuration"),
    isConfigured(e) {
        return t.Metadata.hasOwn(st.name, e);
    },
    configure(e, s) {
        const i = RouteConfig.N(e, s, null);
        t.Metadata.define(st.name, i, s);
        return s;
    },
    getConfig(e) {
        if (!st.isConfigured(e)) st.configure({}, e);
        return t.Metadata.getOwn(st.name, e);
    }
};

function it(t) {
    return function(e) {
        return st.configure(t, e);
    };
}

const nt = "default";

class RouteDefinition {
    constructor(t, e, s) {
        this.config = t;
        this.component = e;
        this.hasExplicitPath = null !== t.path;
        this.caseSensitive = t.caseSensitive;
        this.path = o(t.path ?? e.name);
        this.redirectTo = t.redirectTo ?? null;
        this.viewport = t.viewport ?? nt;
        this.id = h(t.id ?? this.path);
        this.data = t.data ?? {};
        this.fallback = t.fallback ?? s?.fallback ?? null;
    }
    static resolve(t, i, n, r) {
        const o = i?.config ?? null;
        if (f(t)) return new RouteDefinition(RouteConfig.N(t, null, o), null, i);
        const h = this.createNavigationInstruction(t);
        let a;
        switch (h.type) {
          case 0:
            {
                if (void 0 === r) throw new Error(`When retrieving the RouteDefinition for a component name, a RouteContext (that can resolve it) must be provided`);
                const t = r.container.find(s.CustomElement, h.value);
                if (null === t) throw new Error(`Could not find a CustomElement named '${h.value}' in the current container scope of ${r}. This means the component is neither registered at Aurelia startup nor via the 'dependencies' decorator or static property.`);
                a = t;
                break;
            }

          case 2:
            a = h.value;
            break;

          case 4:
            a = s.CustomElement.getDefinition(h.value.constructor);
            break;

          case 3:
            if (void 0 === r) throw new Error(`RouteContext must be provided when resolving an imported module`);
            a = r.resolveLazy(h.value);
            break;
        }
        return e.onResolve(a, (s => {
            let r = rt.get(s);
            const a = 4 === h.type && "function" === typeof t.getRouteConfig;
            if (null === r) {
                const h = s.Type;
                let c = null;
                if (a) c = RouteConfig.N(t.getRouteConfig(i, n) ?? e.emptyObject, h, o); else c = l(t) ? st.isConfigured(h) ? st.getConfig(h).applyChildRouteConfig(t, o) : RouteConfig.N(t, h, o) : st.getConfig(s.Type);
                r = new RouteDefinition(c, s, i);
                rt.define(r, s);
            } else if (0 === r.config.routes.length && a) r.applyChildRouteConfig(t.getRouteConfig?.(i, n) ?? e.emptyObject);
            return r;
        }));
    }
    static createNavigationInstruction(t) {
        return l(t) ? this.createNavigationInstruction(t.component) : TypedNavigationInstruction.create(t);
    }
    applyChildRouteConfig(t) {
        this.config = t = this.config.applyChildRouteConfig(t, null);
        this.hasExplicitPath = null !== t.path;
        this.caseSensitive = t.caseSensitive ?? this.caseSensitive;
        this.path = o(t.path ?? this.path);
        this.redirectTo = t.redirectTo ?? null;
        this.viewport = t.viewport ?? nt;
        this.id = h(t.id ?? this.path);
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

const rt = {
    name: e.Protocol.resource.keyFor("route-definition"),
    isDefined(e) {
        return t.Metadata.hasOwn(rt.name, e);
    },
    define(e, s) {
        t.Metadata.define(rt.name, e, s);
    },
    get(e) {
        return rt.isDefined(e) ? t.Metadata.getOwn(rt.name, e) : null;
    }
};

const ot = new WeakMap;

class ComponentAgent {
    constructor(t, s, i, n, r) {
        this.instance = t;
        this.controller = s;
        this.definition = i;
        this.routeNode = n;
        this.ctx = r;
        this.A = r.container.get(e.ILogger).scopeTo(`ComponentAgent<${r.friendlyPath}>`);
        this.A.trace(`constructor()`);
        const o = s.lifecycleHooks;
        this.canLoadHooks = (o.canLoad ?? []).map((t => t.instance));
        this.loadHooks = (o.loading ?? []).map((t => t.instance));
        this.canUnloadHooks = (o.canUnload ?? []).map((t => t.instance));
        this.unloadHooks = (o.unloading ?? []).map((t => t.instance));
        this.T = "canLoad" in t;
        this.V = "loading" in t;
        this.P = "canUnload" in t;
        this.U = "unloading" in t;
    }
    static for(t, e, i, n) {
        let r = ot.get(t);
        if (void 0 === r) {
            const o = n.container;
            const h = RouteDefinition.resolve(t.constructor, n.definition, null);
            const a = s.Controller.$el(o, t, e.host, null);
            ot.set(t, r = new ComponentAgent(t, a, h, i, n));
        }
        return r;
    }
    activate(t, e, s) {
        if (null === t) {
            this.A.trace(`activate() - initial`);
            return this.controller.activate(this.controller, e, s);
        }
        this.A.trace(`activate()`);
        void this.controller.activate(t, e, s);
    }
    deactivate(t, e, s) {
        if (null === t) {
            this.A.trace(`deactivate() - initial`);
            return this.controller.deactivate(this.controller, e, s);
        }
        this.A.trace(`deactivate()`);
        void this.controller.deactivate(t, e, s);
    }
    dispose() {
        this.A.trace(`dispose()`);
        this.controller.dispose();
    }
    canUnload(t, e, s) {
        this.A.trace(`canUnload(next:%s) - invoking ${this.canUnloadHooks.length} hooks`, e);
        s.push();
        let i = Promise.resolve();
        for (const n of this.canUnloadHooks) {
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
        if (this.P) {
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
    canLoad(t, e, s) {
        this.A.trace(`canLoad(next:%s) - invoking ${this.canLoadHooks.length} hooks`, e);
        const i = this.ctx.root;
        s.push();
        let n = Promise.resolve();
        for (const r of this.canLoadHooks) {
            s.push();
            n = n.then((() => new Promise((n => {
                if (true !== t.guardsResult) {
                    s.pop();
                    n();
                    return;
                }
                t.run((() => r.canLoad(this.instance, e.params, e, this.routeNode)), (e => {
                    if (true === t.guardsResult && true !== e) t.guardsResult = false === e ? false : ViewportInstructionTree.create(e, void 0, i);
                    s.pop();
                    n();
                }));
            }))));
        }
        if (this.T) {
            s.push();
            n = n.then((() => {
                if (true !== t.guardsResult) {
                    s.pop();
                    return;
                }
                t.run((() => this.instance.canLoad(e.params, e, this.routeNode)), (e => {
                    if (true === t.guardsResult && true !== e) t.guardsResult = false === e ? false : ViewportInstructionTree.create(e, void 0, i);
                    s.pop();
                }));
            }));
        }
        s.pop();
    }
    unloading(t, e, s) {
        this.A.trace(`unloading(next:%s) - invoking ${this.unloadHooks.length} hooks`, e);
        s.push();
        for (const i of this.unloadHooks) t.run((() => {
            s.push();
            return i.unloading(this.instance, e, this.routeNode);
        }), (() => {
            s.pop();
        }));
        if (this.U) t.run((() => {
            s.push();
            return this.instance.unloading(e, this.routeNode);
        }), (() => {
            s.pop();
        }));
        s.pop();
    }
    loading(t, e, s) {
        this.A.trace(`loading(next:%s) - invoking ${this.loadHooks.length} hooks`, e);
        s.push();
        for (const i of this.loadHooks) t.run((() => {
            s.push();
            return i.loading(this.instance, e.params, e, this.routeNode);
        }), (() => {
            s.pop();
        }));
        if (this.V) t.run((() => {
            s.push();
            return this.instance.loading(e.params, e, this.routeNode);
        }), (() => {
            s.pop();
        }));
        s.pop();
    }
    toString() {
        return `CA(ctx:'${this.ctx.friendlyPath}',c:'${this.definition.component.name}')`;
    }
}

const ht = e.DI.createInterface("IRouteContext");

const at = Object.freeze([ "string", "object", "function" ]);

function ct(t) {
    if (null == t) return false;
    const e = t.params;
    const s = t.component;
    return "object" === typeof e && null !== e && null != s && at.includes(typeof s) && !(s instanceof Promise);
}

class RouteContext {
    constructor(t, n, r, o, h, a) {
        this.parent = n;
        this.component = r;
        this.definition = o;
        this.parentContainer = h;
        this.L = a;
        this.childViewportAgents = [];
        this.childRoutes = [];
        this.O = null;
        this.j = null;
        this.prevNode = null;
        this.M = null;
        this.B = false;
        this.q = t;
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
        c.registerResolver(ht, new e.InstanceProvider("IRouteContext", this));
        c.register(o);
        c.register(...r.dependencies);
        this.recognizer = new i.RouteRecognizer;
        const u = this.F = new NavigationModel([]);
        c.get(R).subscribe("au:router:navigation-end", (() => u.setIsActive(a, this)));
        this.processDefinition(o);
    }
    get isRoot() {
        return null === this.parent;
    }
    get depth() {
        return this.path.length - 1;
    }
    get resolved() {
        return this.O;
    }
    get allResolved() {
        return this.j;
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
        const t = this.q;
        if (null === t) throw new Error(`RouteContext has no ViewportAgent: ${this}`);
        return t;
    }
    get navigationModel() {
        return this.F;
    }
    processDefinition(t) {
        const s = [];
        const i = [];
        const n = t.config.routes;
        const r = n.length;
        if (0 === r) {
            const e = t.component?.Type.prototype?.getRouteConfig;
            this.B = null == e ? true : "function" !== typeof e;
            return;
        }
        const h = this.F;
        let a = 0;
        for (;a < r; a++) {
            const r = n[a];
            if (r instanceof Promise) {
                const t = this.addRoute(r);
                s.push(t);
                i.push(t);
            } else {
                const s = RouteDefinition.resolve(r, t, null, this);
                if (s instanceof Promise) {
                    if (!l(r) || null == r.path) throw new Error(`Invalid route config. When the component property is a lazy import, the path must be specified.`);
                    for (const t of o(r.path)) this.$addRoute(t, r.caseSensitive ?? false, s);
                    const t = this.childRoutes.length;
                    const n = s.then((e => this.childRoutes[t] = e));
                    this.childRoutes.push(n);
                    h.addRoute(n);
                    i.push(n.then(e.noop));
                } else {
                    for (const t of s.path) this.$addRoute(t, s.caseSensitive, s);
                    this.childRoutes.push(s);
                    h.addRoute(s);
                }
            }
        }
        this.B = true;
        if (s.length > 0) this.O = Promise.all(s).then((() => {
            this.O = null;
        }));
        if (i.length > 0) this.j = Promise.all(i).then((() => {
            this.j = null;
        }));
    }
    static setRoot(t) {
        const i = t.get(e.ILogger).scopeTo("RouteContext");
        if (!t.has(s.IAppRoot, true)) lt(new Error(`The provided container has no registered IAppRoot. RouteContext.setRoot can only be used after Aurelia.app was called, on a container that is within that app's component tree.`), i);
        if (t.has(ht, true)) lt(new Error(`A root RouteContext is already registered. A possible cause is the RouterConfiguration being registered more than once in the same container tree. If you have a multi-rooted app, make sure you register RouterConfiguration only in the "forked" containers and not in the common root.`), i);
        const {controller: n} = t.get(s.IAppRoot);
        if (void 0 === n) lt(new Error(`The provided IAppRoot does not (yet) have a controller. A possible cause is calling this API manually before Aurelia.start() is called`), i);
        const r = t.get(J);
        const o = r.getRouteContext(null, n.definition, n.viewModel, n.container, null);
        t.register(e.Registration.instance(ht, o));
        o.node = r.routeTree.root;
    }
    static resolve(t, i) {
        const n = t.container;
        const r = n.get(e.ILogger).scopeTo("RouteContext");
        if (null === i || void 0 === i) {
            r.trace(`resolve(context:%s) - returning root RouteContext`, i);
            return t;
        }
        if (ut(i)) {
            r.trace(`resolve(context:%s) - returning provided RouteContext`, i);
            return i;
        }
        if (i instanceof n.get(s.IPlatform).Node) try {
            const t = s.CustomElement.for(i, {
                searchParents: true
            });
            r.trace(`resolve(context:Node(nodeName:'${i.nodeName}'),controller:'${t.definition.name}') - resolving RouteContext from controller's RenderContext`);
            return t.container.get(ht);
        } catch (t) {
            r.error(`Failed to resolve RouteContext from Node(nodeName:'${i.nodeName}')`, t);
            throw t;
        }
        if (s.isCustomElementViewModel(i)) {
            const t = i.$controller;
            r.trace(`resolve(context:CustomElementViewModel(name:'${t.definition.name}')) - resolving RouteContext from controller's RenderContext`);
            return t.container.get(ht);
        }
        if (s.isCustomElementController(i)) {
            const t = i;
            r.trace(`resolve(context:CustomElementController(name:'${t.definition.name}')) - resolving RouteContext from controller's RenderContext`);
            return t.container.get(ht);
        }
        lt(new Error(`Invalid context type: ${Object.prototype.toString.call(i)}`), r);
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
        const s = this.container.get(e.component.key);
        if (!this.B) {
            const t = RouteDefinition.resolve(s, this.definition, e);
            this.processDefinition(t);
        }
        const i = ComponentAgent.for(s, t, e, this);
        this.hostControllerProvider.dispose();
        return i;
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
            r = s.recognizer.recognize(t);
            if (null === r) {
                if (!e || s.isRoot) return null;
                s = s.parent;
            } else n = false;
        }
        let o;
        if (Reflect.has(r.params, i.RESIDUE)) o = r.params[i.RESIDUE] ?? null; else o = null;
        return new $RecognizedRoute(r, o);
    }
    addRoute(t) {
        this.logger.trace(`addRoute(routeable:'${t}')`);
        return e.onResolve(RouteDefinition.resolve(t, this.definition, null, this), (t => {
            for (const e of t.path) this.$addRoute(e, t.caseSensitive, t);
            this.F.addRoute(t);
            this.childRoutes.push(t);
        }));
    }
    $addRoute(t, e, s) {
        this.recognizer.add({
            path: t,
            caseSensitive: e,
            handler: s
        }, true);
    }
    resolveLazy(t) {
        return this.moduleLoader.load(t, (s => {
            const i = s.raw;
            if ("function" === typeof i) {
                const t = e.Protocol.resource.getAll(i).find(ft);
                if (void 0 !== t) return t;
            }
            let n;
            let r;
            for (const t of s.items) if (t.isConstructable) {
                const e = t.definitions.find(ft);
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
        if (!ct(t)) return null;
        const e = t.component;
        let s;
        let n = false;
        if (e instanceof RouteDefinition) {
            s = e;
            n = true;
        } else if ("string" === typeof e) s = this.childRoutes.find((t => t.id === e)); else if (0 === e.type) s = this.childRoutes.find((t => t.id === e.value)); else s = RouteDefinition.resolve(e, null, null, this);
        if (void 0 === s) return null;
        const r = t.params;
        const o = this.recognizer;
        const h = s.path;
        const a = h.length;
        const c = [];
        let u = null;
        if (1 === a) {
            const e = f(h[0]);
            if (null === e) {
                const e = `Unable to eagerly generate path for ${t}. Reasons: ${c}.`;
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
        let l = 0;
        for (let t = 0; t < a; t++) {
            const e = f(h[t]);
            if (null === e) continue;
            if (null === u) {
                u = e;
                l = Object.keys(e.consumed).length;
            } else if (Object.keys(e.consumed).length > l) u = e;
        }
        if (null === u) {
            const e = `Unable to eagerly generate path for ${t}. Reasons: ${c}.`;
            if (n) throw new Error(e);
            this.logger.debug(e);
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
        function f(t) {
            const e = o.getEndpoint(t);
            if (null === e) {
                c.push(`No endpoint found for the path: '${t}'.`);
                return null;
            }
            const s = Object.create(null);
            for (const i of e.params) {
                const e = i.name;
                let n = r[e];
                if (null == n || 0 === String(n).length) {
                    if (!i.isOptional) {
                        c.push(`No value for the required parameter '${e}' is provided for the path: '${t}'.`);
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

function ut(t) {
    return t instanceof RouteContext;
}

function lt(t, e) {
    e.error(t);
    throw t;
}

function ft(t) {
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
        this.H = void 0;
    }
    resolve() {
        return e.onResolve(this.H, e.noop);
    }
    setIsActive(t, s) {
        void e.onResolve(this.H, (() => {
            for (const e of this.routes) e.setIsActive(t, s);
        }));
    }
    addRoute(t) {
        const s = this.routes;
        if (!(t instanceof Promise)) {
            if (t.config.nav) s.push(NavigationRoute.create(t));
            return;
        }
        const i = s.length;
        s.push(void 0);
        let n;
        n = this.H = e.onResolve(this.H, (() => e.onResolve(t, (t => {
            if (t.config.nav) s[i] = NavigationRoute.create(t); else s.splice(i, 1);
            if (this.H === n) this.H = void 0;
        }))));
    }
}

class NavigationRoute {
    constructor(t, e, s, i) {
        this.id = t;
        this.path = e;
        this.title = s;
        this.data = i;
    }
    static create(t) {
        return new NavigationRoute(t.id, t.path, t.config.title, t.data);
    }
    get isActive() {
        return this.W;
    }
    setIsActive(t, e) {
        this.W = this.path.some((s => t.isActive(s, e)));
    }
}

exports.ViewportCustomElement = class ViewportCustomElement {
    constructor(t, e) {
        this.logger = t;
        this.ctx = e;
        this.name = nt;
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
    attaching(t, e, s) {
        this.logger.trace("attaching()");
        return this.agent.activateFromViewport(t, this.controller, s);
    }
    detaching(t, e, s) {
        this.logger.trace("detaching()");
        return this.agent.deactivateFromViewport(t, this.controller, s);
    }
    dispose() {
        this.logger.trace("dispose()");
        this.ctx.unregisterViewport(this);
        this.agent.dispose();
        this.agent = void 0;
    }
    toString() {
        const t = [];
        for (const e of pt) {
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

x([ s.bindable ], exports.ViewportCustomElement.prototype, "name", void 0);

x([ s.bindable ], exports.ViewportCustomElement.prototype, "usedBy", void 0);

x([ s.bindable ], exports.ViewportCustomElement.prototype, "default", void 0);

x([ s.bindable ], exports.ViewportCustomElement.prototype, "fallback", void 0);

exports.ViewportCustomElement = x([ s.customElement({
    name: "au-viewport"
}), $(0, e.ILogger), $(1, ht) ], exports.ViewportCustomElement);

const pt = [ "name", "usedBy", "default", "fallback" ];

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

x([ s.bindable({
    mode: 2,
    primary: true,
    callback: "valueChanged"
}) ], exports.LoadCustomAttribute.prototype, "route", void 0);

x([ s.bindable({
    mode: 2,
    callback: "valueChanged"
}) ], exports.LoadCustomAttribute.prototype, "params", void 0);

x([ s.bindable({
    mode: 2
}) ], exports.LoadCustomAttribute.prototype, "attribute", void 0);

x([ s.bindable({
    mode: 4
}) ], exports.LoadCustomAttribute.prototype, "active", void 0);

x([ s.bindable({
    mode: 2,
    callback: "valueChanged"
}) ], exports.LoadCustomAttribute.prototype, "context", void 0);

exports.LoadCustomAttribute = x([ s.customAttribute("load"), $(0, s.IEventTarget), $(1, s.INode), $(2, J), $(3, R), $(4, ht), $(5, k) ], exports.LoadCustomAttribute);

exports.HrefCustomAttribute = class HrefCustomAttribute {
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
    get isExternal() {
        return this.el.hasAttribute("external") || this.el.hasAttribute("data-external");
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
        this._(t);
    }
    _(t) {
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

x([ s.bindable({
    mode: 2
}) ], exports.HrefCustomAttribute.prototype, "value", void 0);

exports.HrefCustomAttribute = x([ s.customAttribute({
    name: "href",
    noMultiBindings: true
}), $(0, s.IEventTarget), $(1, s.INode), $(2, J), $(3, ht), $(4, s.IWindow) ], exports.HrefCustomAttribute);

const dt = J;

const gt = [ dt ];

const wt = exports.ViewportCustomElement;

const vt = exports.LoadCustomAttribute;

const mt = exports.HrefCustomAttribute;

const xt = [ exports.ViewportCustomElement, exports.LoadCustomAttribute, exports.HrefCustomAttribute ];

function $t(i, n) {
    let r = null;
    if (t.isObject(n)) r = n.basePath ?? null; else n = {};
    return i.register(e.Registration.cachedCallback(y, ((t, e, i) => {
        const n = t.get(s.IWindow);
        const o = new URL(n.document.baseURI);
        o.pathname = C(r ?? o.pathname);
        return o;
    })), s.AppTask.hydrated(J, (t => t.I(n))), s.AppTask.hydrated(e.IContainer, RouteContext.setRoot), s.AppTask.activated(J, (t => t.start(true))), s.AppTask.deactivated(J, (t => {
        t.stop();
    })), ...gt, ...xt);
}

const Et = {
    register(t) {
        return $t(t);
    },
    customize(t) {
        return {
            register(e) {
                return $t(e, t);
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

const bt = e.DI.createInterface("IStateManager", (t => t.singleton(ScrollStateManager)));

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

exports.AST = V;

exports.ActionExpression = ActionExpression;

exports.AuNavId = E;

exports.ComponentAgent = ComponentAgent;

exports.ComponentExpression = ComponentExpression;

exports.CompositeSegmentExpression = CompositeSegmentExpression;

exports.DefaultComponents = gt;

exports.DefaultResources = xt;

exports.HrefCustomAttributeRegistration = mt;

exports.ILocationManager = k;

exports.IRouteContext = ht;

exports.IRouter = J;

exports.IRouterEvents = R;

exports.IStateManager = bt;

exports.LoadCustomAttributeRegistration = vt;

exports.LocationChangeEvent = LocationChangeEvent;

exports.NavigationCancelEvent = NavigationCancelEvent;

exports.NavigationEndEvent = NavigationEndEvent;

exports.NavigationErrorEvent = NavigationErrorEvent;

exports.NavigationOptions = NavigationOptions;

exports.NavigationStartEvent = NavigationStartEvent;

exports.ParameterExpression = ParameterExpression;

exports.ParameterListExpression = ParameterListExpression;

exports.Route = st;

exports.RouteConfig = RouteConfig;

exports.RouteContext = RouteContext;

exports.RouteDefinition = RouteDefinition;

exports.RouteExpression = RouteExpression;

exports.RouteNode = RouteNode;

exports.RouteTree = RouteTree;

exports.RouterConfiguration = Et;

exports.RouterOptions = RouterOptions;

exports.RouterRegistration = dt;

exports.ScopedSegmentExpression = ScopedSegmentExpression;

exports.SegmentExpression = SegmentExpression;

exports.SegmentGroupExpression = SegmentGroupExpression;

exports.Transition = Transition;

exports.ViewportAgent = ViewportAgent;

exports.ViewportCustomElementRegistration = wt;

exports.ViewportExpression = ViewportExpression;

exports.isManagedState = _;

exports.route = it;

exports.toManagedState = G;
//# sourceMappingURL=index.cjs.map
