"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var t = require("@aurelia/kernel");

var s = require("@aurelia/runtime");

var e = require("@aurelia/runtime-html");

const r = t.DI.createInterface("IDomRenderer");

const i = t.DI.createInterface("IScrollerObsererLocator");

const n = t.DI.createInterface("ICollectionStrategyLocator");

function o(t) {
    let e = false;
    while (t instanceof s.BindingBehaviorExpression) t = t.expression;
    while (t instanceof s.ValueConverterExpression) {
        t = t.expression;
        e = true;
    }
    return e ? t : null;
}

const l = t => {
    let s = t.parentNode;
    while (null !== s && s !== document.body) {
        if (c(s)) return s;
        s = s.parentNode;
    }
    throw new Error("Unable to find a scroller");
};

const c = t => {
    const s = window.getComputedStyle(t);
    return s && ("scroll" === s.overflowY || "scroll" === s.overflow || "auto" === s.overflowY || "auto" === s.overflow);
};

const h = (t, ...s) => {
    const e = window.getComputedStyle(t);
    let r = 0;
    let i = 0;
    for (let t = 0, n = s.length; n > t; ++t) {
        i = parseFloat(e[s[t]]);
        r += isNaN(i) ? 0 : i;
    }
    return r;
};

const a = t => {
    let s = t.getBoundingClientRect().height;
    s += h(t, "marginTop", "marginBottom");
    return s;
};

const u = (t, s) => {
    const e = t.offsetParent;
    const r = t.offsetTop;
    if (null === e || e === s) return r;
    if (e.contains(s)) return r - s.offsetTop;
    return r + u(e, s);
};

const f = {
    height: 0,
    scrollTop: 0,
    scroller: null,
    width: 0
};

class VirtualRepeat {
    constructor(t, s, e, r, i, n) {
        this.location = t;
        this.instruction = s;
        this.parent = e;
        this.f = r;
        this.c = i;
        this.items = void 0;
        this.views = [];
        this.task = null;
        this.i = f;
        this.itemHeight = 0;
        this.minViewsRequired = 0;
        this.dom = null;
        this.scrollerObserver = null;
        const l = s.props[0];
        const c = l.forOf;
        const h = this.iterable = o(c.iterable) ?? c.iterable;
        const a = this.u = c.iterable !== h;
        this.C = new CollectionObservationMediator(this, a ? "handleInnerCollectionChange" : "handleCollectionChange");
        this.local = c.declaration.name;
        this.taskQueue = n.domWriteQueue;
    }
    static get inject() {
        return [ e.IRenderLocation, e.IInstruction, e.IController, e.IViewFactory, t.IContainer, e.IPlatform ];
    }
    attaching() {
        const t = this.c;
        const s = t.get(n);
        const e = this.collectionStrategy = s.getStrategy(this.items);
        const o = e.count();
        if (0 === o) return;
        const l = this.dom = t.get(r).render(this.location);
        const c = this.O();
        (this.scrollerObserver = t.get(i).getObserver(l.scroller)).subscribe(this);
        this.L(c);
        this.itemsChanged(this.items);
    }
    detaching() {
        this.task?.cancel();
        this.T();
        this.dom.dispose();
        this.scrollerObserver.unsubscribe(this);
        this.dom = this.scrollerObserver = this.task = null;
    }
    L(t) {
        const s = a(t.nodes.firstChild);
        const e = this.scrollerObserver.getValue();
        const r = this.I(e, this.collectionStrategy.count(), s);
        if (1 & r.signals) this.T();
        if (0 === (2 & r.signals)) return;
        this.itemHeight = s;
        this.minViewsRequired = r.minViews;
    }
    I(t, s, e) {
        if (0 === s) return Calculation.reset;
        if (0 === e) return Calculation.none;
        const r = Math.floor(t.height / e);
        return Calculation.from(2, r);
    }
    T() {
        this.minViewsRequired = 0;
        this.itemHeight = 0;
    }
    itemsChanged(t) {
        const e = this.$controller;
        const r = this.collectionStrategy = this.c.get(n).getStrategy(t);
        const i = r.count();
        const o = this.views;
        const l = 2 * this.minViewsRequired;
        let c = 0;
        let h = o.length;
        let a = null;
        if (0 === i) {
            for (c = 0; h > c; ++c) {
                a = o[c];
                void a.deactivate(e, e, 2);
                a.nodes.remove();
            }
            o.length = 0;
            this.T();
            return;
        }
        if (h > l) {
            while (h > l) {
                a = o[h - 1];
                void a.deactivate(e, e, 2);
                a.nodes.remove();
                --h;
            }
            o.length = h;
        }
        if (h > i) {
            while (h > i) {
                a = o[h - 1];
                void a.deactivate(e, e, 2);
                a.nodes.remove();
                --h;
            }
            o.length = i;
        }
        h = o.length;
        const u = Math.min(l, i);
        for (c = h; c < u; c++) o.push(this.f.create());
        const f = this.itemHeight;
        const d = this.local;
        const {firstIndex: g, topCount: w, botCount: C} = this.measureBuffer(this.scrollerObserver.getValue(), o.length, i, f);
        let m = 0;
        let v;
        let b;
        let y;
        for (c = 0; u > c; ++c) {
            m = g + c;
            v = r.item(m);
            a = o[c];
            b = o[c - 1];
            if (a.isActive) {
                y = a.scope;
                y.bindingContext[d] = v;
                y.overrideContext.$index = m;
                y.overrideContext.$length = i;
            } else {
                a.nodes.insertBefore(b.nodes.firstChild.nextSibling);
                y = s.Scope.fromParent(e.scope, new s.BindingContext(d, r.item(m)));
                y.overrideContext.$index = m;
                y.overrideContext.$length = i;
                p(y.overrideContext);
                void a.activate(e, e, 1, y);
            }
        }
        this.C.start(t);
        this.dom.update(w * f, C * f);
    }
    calcRealScrollTop(t) {
        const s = t.scrollTop;
        const e = u(this.dom.top, t.scroller);
        const r = Math.max(0, 0 === s ? 0 : s - e);
        return r;
    }
    measureBuffer(t, s, e, r) {
        const i = this.calcRealScrollTop(t);
        let n = 0 === i ? 0 : Math.floor(i / r);
        if (n + s >= e) n = Math.max(0, e - s);
        const o = n;
        const l = Math.max(0, e - o - s);
        return {
            firstIndex: n,
            topCount: o,
            botCount: l
        };
    }
    handleScrollerChange(t) {
        const s = this.task;
        this.task = this.taskQueue.queueTask((() => {
            this.task = null;
            this.handleScroll(t);
        }));
        s?.cancel();
    }
    handleScroll(t) {
        if (0 === this.itemHeight) return;
        const s = this.i;
        const e = this.local;
        const r = this.itemHeight;
        const i = this.dom;
        const n = this.views;
        const o = this.collectionStrategy;
        const l = n.length;
        const c = o.count();
        const h = n[0].scope.overrideContext.$index;
        const {firstIndex: a, topCount: u, botCount: f} = this.measureBuffer(t, l, c, r);
        const d = t.scrollTop > s.scrollTop;
        const g = d ? a >= h + l : a + l <= h;
        this.i = t;
        if (a === h) return;
        let p = null;
        let w = null;
        let C = 0;
        let m = 0;
        let v = 0;
        let b = 0;
        if (g) for (b = 0; l > b; ++b) {
            C = a + b;
            w = n[b].scope;
            w.bindingContext[e] = o.item(C);
            w.overrideContext.$index = C;
            w.overrideContext.$length = c;
        } else if (d) {
            m = a - h;
            while (m > 0) {
                p = n.shift();
                C = n[n.length - 1].scope.overrideContext["$index"] + 1;
                n.push(p);
                w = p.scope;
                w.bindingContext[e] = o.item(C);
                w.overrideContext.$index = C;
                w.overrideContext.$length = c;
                p.nodes.insertBefore(i.bottom);
                ++v;
                --m;
            }
        } else {
            m = h - a;
            while (m > 0) {
                C = h - (v + 1);
                p = n.pop();
                w = p.scope;
                w.bindingContext[e] = o.item(C);
                w.overrideContext.$index = C;
                w.overrideContext.$length = c;
                p.nodes.insertBefore(n[0].nodes.firstChild);
                n.unshift(p);
                ++v;
                --m;
            }
        }
        if (d) {
            if (o.isNearBottom(a + (l - 1))) ;
        } else if (o.isNearTop(n[0].scope.overrideContext["$index"])) ;
        i.update(u * r, f * r);
    }
    getDistances() {
        return this.dom?.distances ?? [ 0, 0 ];
    }
    getViews() {
        return this.views.slice(0);
    }
    handleCollectionChange(t, s) {
        this.itemsChanged(this.items);
    }
    handleInnerCollectionChange() {
        const t = s.astEvaluate(this.iterable, this.parent.scope, {
            strict: true
        }, null);
        const e = this.items;
        this.items = t;
        if (t === e) this.itemsChanged(t);
    }
    O() {
        const t = this.getOrCreateFirstView();
        const e = this.$controller;
        const r = this.collectionStrategy;
        const i = e.scope;
        const n = s.Scope.fromParent(i, new s.BindingContext(this.local, r.first()));
        n.overrideContext.$index = 0;
        n.overrideContext.$length = r.count();
        p(n.overrideContext);
        t.nodes.insertBefore(this.dom.bottom);
        void t.activate(e, e, 0, n);
        return t;
    }
    getOrCreateFirstView() {
        const t = this.views;
        if (t.length > 0) return t[0];
        const s = this.f.create();
        t.push(s);
        return s;
    }
}

e.customAttribute({
    isTemplateController: true,
    name: "virtual-repeat",
    bindables: {
        local: {
            property: "local"
        },
        items: {
            property: "items",
            primary: true
        }
    }
})(VirtualRepeat);

class CollectionObservationMediator {
    constructor(t, s) {
        this.repeat = t;
        this.key = s;
    }
    handleCollectionChange(t, s) {
        this.repeat[this.key](t, s);
    }
    start(t) {
        if (this.M === t) return;
        this.stop();
        if (null != t) s.getCollectionObserver(this.M = t)?.subscribe(this);
    }
    stop() {
        s.getCollectionObserver(this.M)?.unsubscribe(this);
    }
}

var d;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["reset"] = 1] = "reset";
    t[t["has_sizing"] = 2] = "has_sizing";
})(d || (d = {}));

class Calculation {
    constructor(t, s) {
        this.signals = t;
        this.minViews = s;
    }
    static from(t, s) {
        return new Calculation(t, s);
    }
}

Calculation.reset = new Calculation(1, 0);

Calculation.none = new Calculation(0, 0);

const g = new WeakSet;

function p(t) {
    const s = t;
    if (g.has(s)) return;
    Object.defineProperties(s, {
        $first: w(v),
        $last: w(b),
        $middle: w(y),
        $even: w(C),
        $odd: w(m)
    });
}

function w(t) {
    return {
        configurable: true,
        enumerable: true,
        get: t
    };
}

function C() {
    return this.$index % 2 === 0;
}

function m() {
    return this.$index % 2 !== 0;
}

function v() {
    return 0 === this.$index;
}

function b() {
    return this.$index === this.$length - 1;
}

function y() {
    return this.$index > 0 && this.$index < this.$length - 1;
}

class CollectionStrategyLocator {
    static register(s) {
        return t.Registration.singleton(n, this).register(s);
    }
    getStrategy(t) {
        if (null == t) return new NullCollectionStrategy;
        if (t instanceof Array) return new ArrayCollectionStrategy(t);
        throw new Error(`Unable to find a strategy for collection type: ${typeof t}`);
    }
}

class ArrayCollectionStrategy {
    constructor(t) {
        this.val = t;
    }
    count() {
        return this.val.length;
    }
    first() {
        return this.val.length > 0 ? this.val[0] : null;
    }
    last() {
        return this.val.length > 0 ? this.val[this.val.length - 1] : null;
    }
    item(t) {
        return this.val[t] ?? null;
    }
    range(t, s) {
        const e = this.val;
        const r = e.length;
        if (r > t && s > t) return e.slice(t, s);
        return [];
    }
    isNearTop(t) {
        return t < 5;
    }
    isNearBottom(t) {
        return t > this.val.length - 5;
    }
}

class NullCollectionStrategy {
    get val() {
        return null;
    }
    count() {
        return 0;
    }
    isNearTop() {
        return false;
    }
    isNearBottom() {
        return false;
    }
    first() {
        return null;
    }
    last() {
        return null;
    }
    item() {
        return null;
    }
    range() {
        return [];
    }
}

class ScrollerObserverLocator {
    constructor(t) {
        this.cache = new WeakMap;
        this.p = t;
    }
    static get inject() {
        return [ e.IPlatform ];
    }
    static register(s) {
        return t.Registration.singleton(i, this).register(s);
    }
    getObserver(t) {
        const s = this.cache;
        let e = s.get(t);
        if (!s.has(t)) s.set(t, e = new ScrollerObserver(this.p, t));
        return e;
    }
}

class ScrollerObserver {
    constructor(t, s) {
        this.p = t;
        this.scroller = s;
        this.subs = new Set;
        this.geo = null;
    }
    start() {
        this.scroller.addEventListener("scroll", this);
        const t = D(this.p);
        if ("function" === typeof t) (this.sizeObs = new t((t => {
            const s = this.geo;
            const e = new ElementGeometry(t[0].contentRect);
            if (!e.equals(s)) {
                this.geo = e;
                this.notify();
            }
        }))).observe(this.scroller);
    }
    stop() {
        this.scroller.removeEventListener("scroll", this);
        this.sizeObs?.disconnect();
        this.sizeObs = void 0;
    }
    notify() {
        this.subs.forEach(S, this.getValue());
    }
    setValue() {
        throw new Error("scroller info is readonly");
    }
    getValue() {
        const t = this.scroller;
        const s = t.getBoundingClientRect();
        return new ScrollerInfo(t, t.scrollTop, s.width, s.height);
    }
    handleEvent(t) {
        this.notify();
    }
    subscribe(t) {
        if (0 === this.subs.size) this.start();
        this.subs.add(t);
    }
    unsubscribe(t) {
        const s = this.subs;
        if (s.has(t) && 1 === s.size) this.stop();
        s.delete(t);
    }
}

function S(t) {
    t.handleScrollerChange(this);
}

class ElementGeometry {
    constructor(t) {
        this.t = t.top;
        this.l = t.left;
        this.w = t.width;
        this.h = t.height;
    }
    equals(t) {
        if (null == t) return false;
        return this.t === t.t && this.l === t.l && this.w === t.w && this.h === t.h;
    }
}

class ScrollerInfo {
    constructor(t, s, e, r) {
        this.scroller = t;
        this.scrollTop = s;
        this.width = e;
        this.height = r;
    }
}

const D = t => t.window.ResizeObserver;

class DefaultDomRenderer {
    constructor(t) {
        this.p = t;
    }
    static get inject() {
        return [ e.IPlatform ];
    }
    static register(s) {
        return t.Registration.singleton(r, this).register(s);
    }
    render(t) {
        const s = this.p.document;
        const e = t.parentNode;
        if (null === e) throw new Error("Invalid render target");
        let r;
        switch (e.tagName) {
          case "TBODY":
          case "THEAD":
          case "TFOOT":
          case "TABLE":
            r = x(s, "tr", t);
            return new TableDom(e.closest("table"), t, r[0], r[1]);

          case "UL":
          case "OL":
            r = x(s, "div", t);
            return new ListDom(e, t, r[0], r[1]);

          default:
            r = x(s, "div", t);
            return new DefaultDom(t, r[0], r[1]);
        }
    }
}

class DefaultDom {
    constructor(t, s, e) {
        this.anchor = t;
        this.top = s;
        this.bottom = e;
        this.tH = 0;
        this.bH = 0;
    }
    get scroller() {
        return l(this.anchor);
    }
    get distances() {
        return [ this.tH, this.bH ];
    }
    update(t, s) {
        this.top.style.height = `${this.tH = t}px`;
        this.bottom.style.height = `${this.bH = s}px`;
    }
    dispose() {
        this.top.remove();
        this.bottom.remove();
    }
}

class ListDom extends DefaultDom {
    constructor(t, s, e, r) {
        super(s, e, r);
        this.list = t;
    }
    get scroller() {
        return l(this.list);
    }
}

class TableDom extends DefaultDom {
    constructor(t, s, e, r) {
        super(s, e, r);
        this.table = t;
    }
    get scroller() {
        return l(this.table);
    }
}

function x(t, s, e) {
    const r = e.parentNode;
    return [ r.insertBefore(t.createElement(s), e), r.insertBefore(t.createElement(s), e) ];
}

const O = {
    register(t) {
        return t.register(ScrollerObserverLocator, CollectionStrategyLocator, DefaultDomRenderer, VirtualRepeat);
    }
};

exports.CollectionStrategyLocator = CollectionStrategyLocator;

exports.DefaultDomRenderer = DefaultDomRenderer;

exports.DefaultVirtualRepeatConfiguration = O;

exports.ICollectionStrategyLocator = n;

exports.IDomRenderer = r;

exports.IScrollerObsererLocator = i;

exports.ScrollerObserver = ScrollerObserver;

exports.ScrollerObserverLocator = ScrollerObserverLocator;

exports.VirtualRepeat = VirtualRepeat;
//# sourceMappingURL=index.cjs.map
