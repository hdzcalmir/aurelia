"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var t = require("@aurelia/kernel");

var e = require("@aurelia/runtime");

var s = require("@aurelia/runtime-html");

const r = /*@__PURE__*/ t.DI.createInterface("IDomRenderer");

const i = /*@__PURE__*/ t.DI.createInterface("IScrollerObsererLocator");

const n = /*@__PURE__*/ t.DI.createInterface("ICollectionStrategyLocator");

function unwrapExpression(t) {
    let s = false;
    while (t instanceof e.BindingBehaviorExpression) {
        t = t.expression;
    }
    while (t instanceof e.ValueConverterExpression) {
        t = t.expression;
        s = true;
    }
    return s ? t : null;
}

const getScrollerElement = t => {
    let e = t.parentNode;
    while (e !== null && e !== document.body) {
        if (hasOverflowScroll(e)) {
            return e;
        }
        e = e.parentNode;
    }
    throw new Error("Unable to find a scroller");
};

const hasOverflowScroll = t => {
    const e = window.getComputedStyle(t);
    return e && (e.overflowY === "scroll" || e.overflow === "scroll" || e.overflowY === "auto" || e.overflow === "auto");
};

const getStyleValues = (t, ...e) => {
    const s = window.getComputedStyle(t);
    let r = 0;
    let i = 0;
    for (let t = 0, n = e.length; n > t; ++t) {
        i = parseFloat(s[e[t]]);
        r += isNaN(i) ? 0 : i;
    }
    return r;
};

const calcOuterHeight = t => {
    let e = t.getBoundingClientRect().height;
    e += getStyleValues(t, "marginTop", "marginBottom");
    return e;
};

const getDistanceToScroller = (t, e) => {
    const s = t.offsetParent;
    const r = t.offsetTop;
    if (s === null || s === e) {
        return r;
    }
    if (s.contains(e)) {
        return r - e.offsetTop;
    }
    return r + getDistanceToScroller(s, e);
};

const o = {
    height: 0,
    scrollTop: 0,
    scroller: null,
    width: 0
};

class VirtualRepeat {
    static get inject() {
        return [ s.IRenderLocation, s.IInstruction, s.IController, s.IViewFactory, t.IContainer, s.IPlatform ];
    }
    constructor(t, e, s, r, i, n) {
        this.location = t;
        this.instruction = e;
        this.parent = s;
        this.f = r;
        this.c = i;
        this.items = void 0;
        this.views = [];
        this.task = null;
        this.i = o;
        this.itemHeight = 0;
        this.minViewsRequired = 0;
        this.dom = null;
        this.scrollerObserver = null;
        const l = e.props[0];
        const c = l.forOf;
        const h = this.iterable = unwrapExpression(c.iterable) ?? c.iterable;
        const a = this.u = c.iterable !== h;
        this.C = new CollectionObservationMediator(this, a ? "handleInnerCollectionChange" : "handleCollectionChange");
        this.local = c.declaration.name;
        this.taskQueue = n.domWriteQueue;
    }
    attaching() {
        const t = this.c;
        const e = t.get(n);
        const s = this.collectionStrategy = e.getStrategy(this.items);
        const o = s.count();
        if (o === 0) {
            return;
        }
        const l = this.dom = t.get(r).render(this.location);
        const c = this.O();
        (this.scrollerObserver = t.get(i).getObserver(l.scroller)).subscribe(this);
        this.$(c);
        this.itemsChanged(this.items);
    }
    detaching() {
        this.task?.cancel();
        this.L();
        this.dom.dispose();
        this.scrollerObserver.unsubscribe(this);
        this.dom = this.scrollerObserver = this.task = null;
    }
    $(t) {
        const e = calcOuterHeight(t.nodes.firstChild);
        const s = this.scrollerObserver.getValue();
        const r = this.T(s, this.collectionStrategy.count(), e);
        if (r.signals & 1) {
            this.L();
        }
        if ((r.signals & 2) === 0) {
            return;
        }
        this.itemHeight = e;
        this.minViewsRequired = r.minViews;
    }
    T(t, e, s) {
        if (e === 0) {
            return Calculation.reset;
        }
        if (s === 0) {
            return Calculation.none;
        }
        const r = Math.floor(t.height / s);
        return Calculation.from(2, r);
    }
    L() {
        this.minViewsRequired = 0;
        this.itemHeight = 0;
    }
    itemsChanged(t) {
        const s = this.$controller;
        const r = this.collectionStrategy = this.c.get(n).getStrategy(t);
        const i = r.count();
        const o = this.views;
        const l = this.minViewsRequired * 2;
        let c = 0;
        let h = o.length;
        let a = null;
        if (i === 0) {
            for (c = 0; h > c; ++c) {
                a = o[c];
                void a.deactivate(s, s);
                a.nodes.remove();
            }
            o.length = 0;
            this.L();
            return;
        }
        if (h > l) {
            while (h > l) {
                a = o[h - 1];
                void a.deactivate(s, s);
                a.nodes.remove();
                --h;
            }
            o.length = h;
        }
        if (h > i) {
            while (h > i) {
                a = o[h - 1];
                void a.deactivate(s, s);
                a.nodes.remove();
                --h;
            }
            o.length = i;
        }
        h = o.length;
        const u = Math.min(l, i);
        for (c = h; c < u; c++) {
            o.push(this.f.create());
        }
        const f = this.itemHeight;
        const d = this.local;
        const {firstIndex: p, topCount: g, botCount: w} = this.measureBuffer(this.scrollerObserver.getValue(), o.length, i, f);
        let C = 0;
        let m;
        let v;
        let b;
        for (c = 0; u > c; ++c) {
            C = p + c;
            m = r.item(C);
            a = o[c];
            v = o[c - 1];
            if (a.isActive) {
                b = a.scope;
                b.bindingContext[d] = m;
                b.overrideContext.$index = C;
                b.overrideContext.$length = i;
            } else {
                a.nodes.insertBefore(v.nodes.firstChild.nextSibling);
                b = e.Scope.fromParent(s.scope, new e.BindingContext(d, r.item(C)));
                b.overrideContext.$index = C;
                b.overrideContext.$length = i;
                enhanceOverrideContext(b.overrideContext);
                void a.activate(s, s, b);
            }
        }
        this.C.start(t);
        this.dom.update(g * f, w * f);
    }
    calcRealScrollTop(t) {
        const e = t.scrollTop;
        const s = getDistanceToScroller(this.dom.top, t.scroller);
        const r = Math.max(0, e === 0 ? 0 : e - s);
        return r;
    }
    measureBuffer(t, e, s, r) {
        const i = this.calcRealScrollTop(t);
        let n = i === 0 ? 0 : Math.floor(i / r);
        if (n + e >= s) {
            n = Math.max(0, s - e);
        }
        const o = n;
        const l = Math.max(0, s - o - e);
        return {
            firstIndex: n,
            topCount: o,
            botCount: l
        };
    }
    handleScrollerChange(t) {
        const e = this.task;
        this.task = this.taskQueue.queueTask((() => {
            this.task = null;
            this.handleScroll(t);
        }));
        e?.cancel();
    }
    handleScroll(t) {
        if (this.itemHeight === 0) {
            return;
        }
        const e = this.i;
        const s = this.local;
        const r = this.itemHeight;
        const i = this.dom;
        const n = this.views;
        const o = this.collectionStrategy;
        const l = n.length;
        const c = o.count();
        const h = n[0].scope.overrideContext.$index;
        const {firstIndex: a, topCount: u, botCount: f} = this.measureBuffer(t, l, c, r);
        const d = t.scrollTop > e.scrollTop;
        const p = d ? a >= h + l : a + l <= h;
        this.i = t;
        if (a === h) {
            return;
        }
        let g = null;
        let w = null;
        let C = 0;
        let m = 0;
        let v = 0;
        let b = 0;
        if (p) {
            for (b = 0; l > b; ++b) {
                C = a + b;
                w = n[b].scope;
                w.bindingContext[s] = o.item(C);
                w.overrideContext.$index = C;
                w.overrideContext.$length = c;
            }
        } else if (d) {
            m = a - h;
            while (m > 0) {
                g = n.shift();
                C = n[n.length - 1].scope.overrideContext["$index"] + 1;
                n.push(g);
                w = g.scope;
                w.bindingContext[s] = o.item(C);
                w.overrideContext.$index = C;
                w.overrideContext.$length = c;
                g.nodes.insertBefore(i.bottom);
                ++v;
                --m;
            }
        } else {
            m = h - a;
            while (m > 0) {
                C = h - (v + 1);
                g = n.pop();
                w = g.scope;
                w.bindingContext[s] = o.item(C);
                w.overrideContext.$index = C;
                w.overrideContext.$length = c;
                g.nodes.insertBefore(n[0].nodes.firstChild);
                n.unshift(g);
                ++v;
                --m;
            }
        }
        if (d) {
            if (o.isNearBottom(a + (l - 1))) ;
        } else {
            if (o.isNearTop(n[0].scope.overrideContext["$index"])) ;
        }
        i.update(u * r, f * r);
    }
    getDistances() {
        return this.dom?.distances ?? [ 0, 0 ];
    }
    getViews() {
        return this.views.slice(0);
    }
    handleCollectionChange(t, e) {
        this.itemsChanged(this.items);
    }
    handleInnerCollectionChange() {
        const t = e.astEvaluate(this.iterable, this.parent.scope, {
            strict: true
        }, null);
        const s = this.items;
        this.items = t;
        if (t === s) {
            this.itemsChanged(t);
        }
    }
    O() {
        const t = this.getOrCreateFirstView();
        const s = this.$controller;
        const r = this.collectionStrategy;
        const i = s.scope;
        const n = e.Scope.fromParent(i, new e.BindingContext(this.local, r.first()));
        n.overrideContext.$index = 0;
        n.overrideContext.$length = r.count();
        enhanceOverrideContext(n.overrideContext);
        t.nodes.insertBefore(this.dom.bottom);
        void t.activate(s, s, n);
        return t;
    }
    getOrCreateFirstView() {
        const t = this.views;
        if (t.length > 0) {
            return t[0];
        }
        const e = this.f.create();
        t.push(e);
        return e;
    }
}

s.customAttribute({
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
    constructor(t, e) {
        this.repeat = t;
        this.key = e;
    }
    handleCollectionChange(t, e) {
        this.repeat[this.key](t, e);
    }
    start(t) {
        if (this.I === t) {
            return;
        }
        this.stop();
        if (t != null) {
            e.getCollectionObserver(this.I = t)?.subscribe(this);
        }
    }
    stop() {
        e.getCollectionObserver(this.I)?.unsubscribe(this);
    }
}

var l;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["reset"] = 1] = "reset";
    t[t["has_sizing"] = 2] = "has_sizing";
})(l || (l = {}));

class Calculation {
    static from(t, e) {
        return new Calculation(t, e);
    }
    constructor(t, e) {
        this.signals = t;
        this.minViews = e;
    }
}

Calculation.reset = new Calculation(1, 0);

Calculation.none = new Calculation(0, 0);

const c = new WeakSet;

function enhanceOverrideContext(t) {
    const e = t;
    if (c.has(e)) {
        return;
    }
    Object.defineProperties(e, {
        $first: createGetterDescriptor($first),
        $last: createGetterDescriptor($last),
        $middle: createGetterDescriptor($middle),
        $even: createGetterDescriptor($even),
        $odd: createGetterDescriptor($odd)
    });
}

function createGetterDescriptor(t) {
    return {
        configurable: true,
        enumerable: true,
        get: t
    };
}

function $even() {
    return this.$index % 2 === 0;
}

function $odd() {
    return this.$index % 2 !== 0;
}

function $first() {
    return this.$index === 0;
}

function $last() {
    return this.$index === this.$length - 1;
}

function $middle() {
    return this.$index > 0 && this.$index < this.$length - 1;
}

class CollectionStrategyLocator {
    static register(e) {
        return t.Registration.singleton(n, this).register(e);
    }
    getStrategy(t) {
        if (t == null) {
            return new NullCollectionStrategy;
        }
        if (t instanceof Array) {
            return new ArrayCollectionStrategy(t);
        }
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
    range(t, e) {
        const s = this.val;
        const r = s.length;
        if (r > t && e > t) {
            return s.slice(t, e);
        }
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
    static get inject() {
        return [ s.IPlatform ];
    }
    static register(e) {
        return t.Registration.singleton(i, this).register(e);
    }
    constructor(t) {
        this.cache = new WeakMap;
        this.p = t;
    }
    getObserver(t) {
        const e = this.cache;
        let s = e.get(t);
        if (!e.has(t)) {
            e.set(t, s = new ScrollerObserver(this.p, t));
        }
        return s;
    }
}

class ScrollerObserver {
    constructor(t, e) {
        this.p = t;
        this.scroller = e;
        this.subs = new Set;
        this.geo = null;
    }
    start() {
        this.scroller.addEventListener("scroll", this);
        const t = getResizeObserverClass(this.p);
        if (typeof t === "function") {
            (this.sizeObs = new t((t => {
                const e = this.geo;
                const s = new ElementGeometry(t[0].contentRect);
                if (!s.equals(e)) {
                    this.geo = s;
                    this.notify();
                }
            }))).observe(this.scroller);
        }
    }
    stop() {
        this.scroller.removeEventListener("scroll", this);
        this.sizeObs?.disconnect();
        this.sizeObs = void 0;
    }
    notify() {
        this.subs.forEach(notifySubscriber, this.getValue());
    }
    setValue() {
        throw new Error("scroller info is readonly");
    }
    getValue() {
        const t = this.scroller;
        const e = t.getBoundingClientRect();
        return new ScrollerInfo(t, t.scrollTop, e.width, e.height);
    }
    handleEvent(t) {
        this.notify();
    }
    subscribe(t) {
        if (this.subs.size === 0) {
            this.start();
        }
        this.subs.add(t);
    }
    unsubscribe(t) {
        const e = this.subs;
        if (e.has(t) && e.size === 1) {
            this.stop();
        }
        e.delete(t);
    }
}

function notifySubscriber(t) {
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
        if (t == null) {
            return false;
        }
        return this.t === t.t && this.l === t.l && this.w === t.w && this.h === t.h;
    }
}

class ScrollerInfo {
    constructor(t, e, s, r) {
        this.scroller = t;
        this.scrollTop = e;
        this.width = s;
        this.height = r;
    }
}

const getResizeObserverClass = t => t.window.ResizeObserver;

class DefaultDomRenderer {
    static get inject() {
        return [ s.IPlatform ];
    }
    static register(e) {
        return t.Registration.singleton(r, this).register(e);
    }
    constructor(t) {
        this.p = t;
    }
    render(t) {
        const e = this.p.document;
        const s = t.parentNode;
        if (s === null) {
            throw new Error("Invalid render target");
        }
        let r;
        switch (s.tagName) {
          case "TBODY":
          case "THEAD":
          case "TFOOT":
          case "TABLE":
            r = insertBefore(e, "tr", t);
            return new TableDom(s.closest("table"), t, r[0], r[1]);

          case "UL":
          case "OL":
            r = insertBefore(e, "div", t);
            return new ListDom(s, t, r[0], r[1]);

          default:
            r = insertBefore(e, "div", t);
            return new DefaultDom(t, r[0], r[1]);
        }
    }
}

class DefaultDom {
    constructor(t, e, s) {
        this.anchor = t;
        this.top = e;
        this.bottom = s;
        this.tH = 0;
        this.bH = 0;
    }
    get scroller() {
        return getScrollerElement(this.anchor);
    }
    get distances() {
        return [ this.tH, this.bH ];
    }
    update(t, e) {
        this.top.style.height = `${this.tH = t}px`;
        this.bottom.style.height = `${this.bH = e}px`;
    }
    dispose() {
        this.top.remove();
        this.bottom.remove();
    }
}

class ListDom extends DefaultDom {
    constructor(t, e, s, r) {
        super(e, s, r);
        this.list = t;
    }
    get scroller() {
        return getScrollerElement(this.list);
    }
}

class TableDom extends DefaultDom {
    constructor(t, e, s, r) {
        super(e, s, r);
        this.table = t;
    }
    get scroller() {
        return getScrollerElement(this.table);
    }
}

function insertBefore(t, e, s) {
    const r = s.parentNode;
    return [ r.insertBefore(t.createElement(e), s), r.insertBefore(t.createElement(e), s) ];
}

const h = {
    register(t) {
        return t.register(ScrollerObserverLocator, CollectionStrategyLocator, DefaultDomRenderer, VirtualRepeat);
    }
};

exports.CollectionStrategyLocator = CollectionStrategyLocator;

exports.DefaultDomRenderer = DefaultDomRenderer;

exports.DefaultVirtualRepeatConfiguration = h;

exports.ICollectionStrategyLocator = n;

exports.IDomRenderer = r;

exports.IScrollerObsererLocator = i;

exports.ScrollerObserver = ScrollerObserver;

exports.ScrollerObserverLocator = ScrollerObserverLocator;

exports.VirtualRepeat = VirtualRepeat;
//# sourceMappingURL=index.cjs.map
