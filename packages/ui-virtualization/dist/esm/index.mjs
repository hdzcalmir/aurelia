import { DI as t, resolve as s, Registration as e } from "@aurelia/kernel";

import { getCollectionObserver as r } from "@aurelia/runtime";

import { IRenderLocation as i, IInstruction as n, IController as o, IViewFactory as l, IPlatform as h, Scope as c, BindingContext as a, astEvaluate as u } from "@aurelia/runtime-html";

import { BindingBehaviorExpression as f, ValueConverterExpression as d } from "@aurelia/expression-parser";

const m = /*@__PURE__*/ t.createInterface("IDomRenderer");

const p = /*@__PURE__*/ t.createInterface("IScrollerObsererLocator");

const g = /*@__PURE__*/ t.createInterface("ICollectionStrategyLocator");

function unwrapExpression(t) {
    let s = false;
    while (t instanceof f) {
        t = t.expression;
    }
    while (t instanceof d) {
        t = t.expression;
        s = true;
    }
    return s ? t : null;
}

const getScrollerElement = t => {
    let s = t.parentNode;
    while (s !== null && s !== document.body) {
        if (hasOverflowScroll(s)) {
            return s;
        }
        s = s.parentNode;
    }
    throw new Error("Unable to find a scroller");
};

const hasOverflowScroll = t => {
    const s = window.getComputedStyle(t);
    return s && (s.overflowY === "scroll" || s.overflow === "scroll" || s.overflowY === "auto" || s.overflow === "auto");
};

const getStyleValues = (t, ...s) => {
    const e = window.getComputedStyle(t);
    let r = 0;
    let i = 0;
    for (let t = 0, n = s.length; n > t; ++t) {
        i = parseFloat(e[s[t]]);
        r += isNaN(i) ? 0 : i;
    }
    return r;
};

const calcOuterHeight = t => {
    let s = t.getBoundingClientRect().height;
    s += getStyleValues(t, "marginTop", "marginBottom");
    return s;
};

const calcScrollerViewportHeight = t => {
    let s = t.getBoundingClientRect().height;
    s -= getStyleValues(t, "borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom");
    return s;
};

const getDistanceToScroller = (t, s) => {
    const e = t.offsetParent;
    const r = t.offsetTop;
    if (e === null || e === s) {
        return r;
    }
    if (e.contains(s)) {
        return r - s.offsetTop;
    }
    return r + getDistanceToScroller(e, s);
};

const w = {
    height: 0,
    scrollTop: 0,
    scroller: null,
    width: 0
};

class VirtualRepeat {
    constructor() {
        this.items = void 0;
        this.views = [];
        this.task = null;
        this.i = w;
        this.u = true;
        this.itemHeight = 0;
        this.minViewsRequired = 0;
        this.dom = null;
        this.scrollerObserver = null;
        this.location = s(i);
        this.instruction = s(n);
        this.parent = s(o);
        this.f = s(l);
        this.C = s(g);
        this.O = s(m);
        this.scrollerObserverLocator = s(p);
        const t = this.instruction.props[0];
        const e = t.forOf;
        const r = this.iterable = unwrapExpression(e.iterable) ?? e.iterable;
        const c = this.$ = e.iterable !== r;
        this.T = new CollectionObservationMediator(this, (() => c ? this.I() : this.L()));
        this.local = e.declaration.name;
        this.taskQueue = s(h).domWriteQueue;
    }
    attaching() {
        this.dom = this.O.render(this.location);
        (this.scrollerObserver = this.scrollerObserverLocator.getObserver(this.dom.scroller)).subscribe(this);
        this.T.start(this.items);
        this.collectionStrategy = this.C.getStrategy(this.items);
        this.B(this.items, this.collectionStrategy);
    }
    detaching() {
        this.task?.cancel();
        this.R();
        this.dom.dispose();
        this.scrollerObserver.unsubscribe(this);
        this.T.stop();
        this.dom = this.scrollerObserver = this.task = null;
    }
    V() {
        if (!(this.collectionStrategy.count > 0)) {
            throw new Error("AURxxxx: Invalid calculation state. Virtual repeater has no items.");
        }
        const t = this._();
        const s = calcOuterHeight(t.nodes.firstChild);
        const e = this.scrollerObserver.getValue();
        const r = this.M(e, this.collectionStrategy.count, s);
        if (r.signals & 1) {
            this.R();
            return r;
        }
        if ((r.signals & 2) === 0) {
            this.R();
            return r;
        }
        this.itemHeight = s;
        this.minViewsRequired = r.minViews;
        this.u = false;
        return r;
    }
    M(t, s, e) {
        if (s === 0) {
            return Calculation.reset;
        }
        if (e === 0) {
            return Calculation.none;
        }
        const r = Math.ceil(calcScrollerViewportHeight(t.scroller) / e);
        return Calculation.from(2, r);
    }
    R() {
        this.u = true;
        this.minViewsRequired = 0;
        this.itemHeight = 0;
        this.dom.update(0, 0);
    }
    B(t, s) {
        const e = this.$controller;
        const r = s.count;
        const i = this.views;
        let n = 0;
        let o = i.length;
        let l = null;
        if (r === 0) {
            for (n = 0; o > n; ++n) {
                l = i[n];
                void l.deactivate(l, e);
            }
            i.length = 0;
            this.R();
            return;
        }
        if (this.u) {
            const t = this.V();
            if (t.signals === 1 || (t.signals & 2) === 0) {
                return;
            }
        } else {
            if (this.itemHeight === 0) {
                return;
            }
        }
        const h = this.minViewsRequired * 2;
        const u = Math.min(h, r);
        if (o > h) {
            while (o > h) {
                l = i[o - 1];
                void l.deactivate(l, e);
                --o;
            }
            i.length = o;
        }
        if (o > r) {
            while (o > r) {
                l = i[o - 1];
                void l.deactivate(l, e);
                --o;
            }
            i.length = r;
        }
        o = i.length;
        for (n = o; n < u; n++) {
            i.push(this.f.create());
        }
        const f = this.itemHeight;
        const d = this.local;
        const {firstIndex: m, topCount: p, botCount: g} = this.measureBuffer(this.scrollerObserver.getValue(), i.length, r, f);
        let w = 0;
        let C;
        let b;
        let v;
        for (n = 0; u > n; ++n) {
            w = m + n;
            C = s.item(w);
            l = i[n];
            b = i[n - 1];
            if (l.isActive) {
                v = l.scope;
                v.bindingContext[d] = C;
                v.overrideContext.$index = w;
                v.overrideContext.$length = r;
            } else {
                l.nodes.insertBefore(b.nodes.firstChild.nextSibling);
                v = c.fromParent(e.scope, new a(d, s.item(w)));
                v.overrideContext.$index = w;
                v.overrideContext.$length = r;
                enhanceOverrideContext(v.overrideContext);
                void l.activate(e, e, v);
            }
        }
        this.dom.update(p * f, g * f);
    }
    itemsChanged(t) {
        this.T.start(t);
        this.collectionStrategy = this.C.getStrategy(t);
        this.A();
    }
    G(t) {
        const s = t.scrollTop;
        const e = getDistanceToScroller(this.dom.top, t.scroller);
        const r = Math.max(0, s === 0 ? 0 : s - e);
        return r;
    }
    measureBuffer(t, s, e, r) {
        const i = this.G(t);
        let n = i === 0 ? 0 : Math.floor(i / r);
        if (n + s >= e) {
            n = Math.max(0, e - s);
        }
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
            if (this.views.length > 0 && this.itemHeight > 0) {
                this.V();
                this.handleScroll(t);
            }
        }));
        s?.cancel();
    }
    handleScroll(t) {
        const s = this.i;
        const e = this.local;
        const r = this.itemHeight;
        const i = this.dom;
        const n = this.views;
        const o = this.collectionStrategy;
        const l = n.length;
        const h = o.count;
        const c = n[0].scope.overrideContext.$index;
        const {firstIndex: a, topCount: u, botCount: f} = this.measureBuffer(t, l, h, r);
        const d = t.scrollTop > s.scrollTop;
        const m = d ? a >= c + l : a + l <= c;
        this.i = t;
        if (a === c) {
            return;
        }
        let p = null;
        let g = null;
        let w = 0;
        let C = 0;
        let b = 0;
        let v = 0;
        if (m) {
            for (v = 0; l > v; ++v) {
                w = a + v;
                g = n[v].scope;
                g.bindingContext[e] = o.item(w);
                g.overrideContext.$index = w;
                g.overrideContext.$length = h;
            }
        } else if (d) {
            C = a - c;
            while (C > 0) {
                p = n.shift();
                w = n[n.length - 1].scope.overrideContext["$index"] + 1;
                n.push(p);
                g = p.scope;
                g.bindingContext[e] = o.item(w);
                g.overrideContext.$index = w;
                g.overrideContext.$length = h;
                p.nodes.insertBefore(i.bottom);
                ++b;
                --C;
            }
        } else {
            C = c - a;
            while (C > 0) {
                w = c - (b + 1);
                p = n.pop();
                g = p.scope;
                g.bindingContext[e] = o.item(w);
                g.overrideContext.$index = w;
                g.overrideContext.$length = h;
                p.nodes.insertBefore(n[0].nodes.firstChild);
                n.unshift(p);
                ++b;
                --C;
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
    L() {
        this.A();
    }
    I() {
        const t = u(this.iterable, this.parent.scope, {
            strict: true
        }, null);
        const s = this.items;
        this.items = t;
        if (t === s) {
            this.A();
        }
    }
    A() {
        const t = this.task;
        this.task = this.taskQueue.queueTask((() => {
            this.task = null;
            this.B(this.items, this.collectionStrategy);
        }));
        t?.cancel();
    }
    _() {
        const t = this.getOrCreateFirstView();
        if (!t.isActive) {
            const s = this.$controller;
            const e = this.collectionStrategy;
            const r = s.scope;
            const i = c.fromParent(r, new a(this.local, e.first()));
            i.overrideContext.$index = 0;
            i.overrideContext.$length = e.count;
            enhanceOverrideContext(i.overrideContext);
            t.nodes.insertBefore(this.dom.bottom);
            void t.activate(t, s, i);
        }
        return t;
    }
    getOrCreateFirstView() {
        const t = this.views;
        if (t.length > 0) {
            return t[0];
        }
        const s = this.f.create();
        t.push(s);
        return s;
    }
}

VirtualRepeat.$au = {
    type: "custom-attribute",
    name: "virtual-repeat",
    isTemplateController: true,
    bindables: {
        local: true,
        items: {
            primary: true
        }
    }
};

class CollectionObservationMediator {
    constructor(t, s) {
        this.repeat = t;
        this.handleCollectionChange = s;
    }
    start(t) {
        if (this.N === t) {
            return;
        }
        this.stop();
        if (t != null) {
            r(this.N = t)?.subscribe(this);
        }
    }
    stop() {
        r(this.N)?.unsubscribe(this);
    }
}

var C;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["reset"] = 1] = "reset";
    t[t["has_sizing"] = 2] = "has_sizing";
})(C || (C = {}));

class Calculation {
    static from(t, s) {
        return new Calculation(t, s);
    }
    constructor(t, s) {
        this.signals = t;
        this.minViews = s;
    }
}

Calculation.reset = new Calculation(1, 0);

Calculation.none = new Calculation(0, 0);

const b = new WeakSet;

function enhanceOverrideContext(t) {
    const s = t;
    if (b.has(s)) {
        return;
    }
    Object.defineProperties(s, {
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
    static register(t) {
        return e.singleton(g, this).register(t);
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
    get count() {
        return this.val.length;
    }
    first() {
        return this.count > 0 ? this.val[0] : null;
    }
    last() {
        return this.count > 0 ? this.val[this.count - 1] : null;
    }
    item(t) {
        return this.val[t] ?? null;
    }
    range(t, s) {
        const e = this.val;
        const r = this.count;
        if (r > t && s > t) {
            return e.slice(t, s);
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
    constructor() {
        this.val = null;
        this.count = 0;
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
        return [ h ];
    }
    static register(t) {
        return e.singleton(p, this).register(t);
    }
    constructor(t) {
        this.cache = new WeakMap;
        this.p = t;
    }
    getObserver(t) {
        const s = this.cache;
        let e = s.get(t);
        if (!s.has(t)) {
            s.set(t, e = new ScrollerObserver(this.p, t));
        }
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
        const t = getResizeObserverClass(this.p);
        if (typeof t === "function") {
            (this.sizeObs = new t((t => {
                const s = this.geo;
                const e = new ElementGeometry(t[0].contentRect);
                if (!e.equals(s)) {
                    this.geo = e;
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
        const s = t.getBoundingClientRect();
        return new ScrollerInfo(t, t.scrollTop, s.width, s.height);
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
        const s = this.subs;
        if (s.has(t) && s.size === 1) {
            this.stop();
        }
        s.delete(t);
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
    constructor(t, s, e, r) {
        this.scroller = t;
        this.scrollTop = s;
        this.width = e;
        this.height = r;
    }
}

const getResizeObserverClass = t => t.window.ResizeObserver;

class DefaultDomRenderer {
    static get inject() {
        return [ h ];
    }
    static register(t) {
        return e.singleton(m, this).register(t);
    }
    constructor(t) {
        this.p = t;
    }
    render(t) {
        const s = this.p.document;
        const e = t.parentNode;
        if (e === null) {
            throw new Error("Invalid render target");
        }
        let r;
        switch (e.tagName) {
          case "TBODY":
          case "THEAD":
          case "TFOOT":
          case "TABLE":
            r = insertBefore(s, "tr", t);
            return new TableDom(e.closest("table"), t, r[0], r[1]);

          case "UL":
          case "OL":
            r = insertBefore(s, "div", t);
            return new ListDom(e, t, r[0], r[1]);

          default:
            r = insertBefore(s, "div", t);
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
        return getScrollerElement(this.anchor);
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
        return getScrollerElement(this.list);
    }
}

class TableDom extends DefaultDom {
    constructor(t, s, e, r) {
        super(s, e, r);
        this.table = t;
    }
    get scroller() {
        return getScrollerElement(this.table);
    }
}

function insertBefore(t, s, e) {
    const r = e.parentNode;
    return [ r.insertBefore(t.createElement(s), e), r.insertBefore(t.createElement(s), e) ];
}

const v = {
    register(t) {
        return t.register(ScrollerObserverLocator, CollectionStrategyLocator, DefaultDomRenderer, VirtualRepeat);
    }
};

export { CollectionStrategyLocator, DefaultDomRenderer, v as DefaultVirtualizationConfiguration, g as ICollectionStrategyLocator, m as IDomRenderer, p as IScrollerObsererLocator, ScrollerObserver, ScrollerObserverLocator, VirtualRepeat };
//# sourceMappingURL=index.mjs.map
