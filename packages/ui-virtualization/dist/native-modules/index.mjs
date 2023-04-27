import { DI as t, IContainer as e, Registration as s } from "../kernel/dist/native-modules/index.mjs";

import { BindingBehaviorExpression as r, ValueConverterExpression as i, Scope as n, BindingContext as o, astEvaluate as l, getCollectionObserver as c } from "../runtime/dist/native-modules/index.mjs";

import { customAttribute as h, IRenderLocation as a, IInstruction as u, IController as f, IViewFactory as d, IPlatform as g } from "../runtime-html/dist/native-modules/index.mjs";

const p = /*@__PURE__*/ t.createInterface("IDomRenderer");

const m = /*@__PURE__*/ t.createInterface("IScrollerObsererLocator");

const w = /*@__PURE__*/ t.createInterface("ICollectionStrategyLocator");

function unwrapExpression(t) {
    let e = false;
    while (t instanceof r) {
        t = t.expression;
    }
    while (t instanceof i) {
        t = t.expression;
        e = true;
    }
    return e ? t : null;
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

const C = {
    height: 0,
    scrollTop: 0,
    scroller: null,
    width: 0
};

class VirtualRepeat {
    static get inject() {
        return [ a, u, f, d, e, g ];
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
        this.i = C;
        this.itemHeight = 0;
        this.minViewsRequired = 0;
        this.dom = null;
        this.scrollerObserver = null;
        const o = e.props[0];
        const l = o.forOf;
        const c = this.iterable = unwrapExpression(l.iterable) ?? l.iterable;
        const h = this.u = l.iterable !== c;
        this.C = new CollectionObservationMediator(this, h ? "handleInnerCollectionChange" : "handleCollectionChange");
        this.local = l.declaration.name;
        this.taskQueue = n.domWriteQueue;
    }
    attaching() {
        const t = this.c;
        const e = t.get(w);
        const s = this.collectionStrategy = e.getStrategy(this.items);
        const r = s.count();
        if (r === 0) {
            return;
        }
        const i = this.dom = t.get(p).render(this.location);
        const n = this.O();
        (this.scrollerObserver = t.get(m).getObserver(i.scroller)).subscribe(this);
        this.$(n);
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
        const e = this.$controller;
        const s = this.collectionStrategy = this.c.get(w).getStrategy(t);
        const r = s.count();
        const i = this.views;
        const l = this.minViewsRequired * 2;
        let c = 0;
        let h = i.length;
        let a = null;
        if (r === 0) {
            for (c = 0; h > c; ++c) {
                a = i[c];
                void a.deactivate(e, e);
                a.nodes.remove();
            }
            i.length = 0;
            this.L();
            return;
        }
        if (h > l) {
            while (h > l) {
                a = i[h - 1];
                void a.deactivate(e, e);
                a.nodes.remove();
                --h;
            }
            i.length = h;
        }
        if (h > r) {
            while (h > r) {
                a = i[h - 1];
                void a.deactivate(e, e);
                a.nodes.remove();
                --h;
            }
            i.length = r;
        }
        h = i.length;
        const u = Math.min(l, r);
        for (c = h; c < u; c++) {
            i.push(this.f.create());
        }
        const f = this.itemHeight;
        const d = this.local;
        const {firstIndex: g, topCount: p, botCount: m} = this.measureBuffer(this.scrollerObserver.getValue(), i.length, r, f);
        let C = 0;
        let b;
        let v;
        let D;
        for (c = 0; u > c; ++c) {
            C = g + c;
            b = s.item(C);
            a = i[c];
            v = i[c - 1];
            if (a.isActive) {
                D = a.scope;
                D.bindingContext[d] = b;
                D.overrideContext.$index = C;
                D.overrideContext.$length = r;
            } else {
                a.nodes.insertBefore(v.nodes.firstChild.nextSibling);
                D = n.fromParent(e.scope, new o(d, s.item(C)));
                D.overrideContext.$index = C;
                D.overrideContext.$length = r;
                enhanceOverrideContext(D.overrideContext);
                void a.activate(e, e, D);
            }
        }
        this.C.start(t);
        this.dom.update(p * f, m * f);
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
        const g = d ? a >= h + l : a + l <= h;
        this.i = t;
        if (a === h) {
            return;
        }
        let p = null;
        let m = null;
        let w = 0;
        let C = 0;
        let b = 0;
        let v = 0;
        if (g) {
            for (v = 0; l > v; ++v) {
                w = a + v;
                m = n[v].scope;
                m.bindingContext[s] = o.item(w);
                m.overrideContext.$index = w;
                m.overrideContext.$length = c;
            }
        } else if (d) {
            C = a - h;
            while (C > 0) {
                p = n.shift();
                w = n[n.length - 1].scope.overrideContext["$index"] + 1;
                n.push(p);
                m = p.scope;
                m.bindingContext[s] = o.item(w);
                m.overrideContext.$index = w;
                m.overrideContext.$length = c;
                p.nodes.insertBefore(i.bottom);
                ++b;
                --C;
            }
        } else {
            C = h - a;
            while (C > 0) {
                w = h - (b + 1);
                p = n.pop();
                m = p.scope;
                m.bindingContext[s] = o.item(w);
                m.overrideContext.$index = w;
                m.overrideContext.$length = c;
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
    handleCollectionChange(t, e) {
        this.itemsChanged(this.items);
    }
    handleInnerCollectionChange() {
        const t = l(this.iterable, this.parent.scope, {
            strict: true
        }, null);
        const e = this.items;
        this.items = t;
        if (t === e) {
            this.itemsChanged(t);
        }
    }
    O() {
        const t = this.getOrCreateFirstView();
        const e = this.$controller;
        const s = this.collectionStrategy;
        const r = e.scope;
        const i = n.fromParent(r, new o(this.local, s.first()));
        i.overrideContext.$index = 0;
        i.overrideContext.$length = s.count();
        enhanceOverrideContext(i.overrideContext);
        t.nodes.insertBefore(this.dom.bottom);
        void t.activate(e, e, i);
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

h({
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
            c(this.I = t)?.subscribe(this);
        }
    }
    stop() {
        c(this.I)?.unsubscribe(this);
    }
}

var b;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["reset"] = 1] = "reset";
    t[t["has_sizing"] = 2] = "has_sizing";
})(b || (b = {}));

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

const v = new WeakSet;

function enhanceOverrideContext(t) {
    const e = t;
    if (v.has(e)) {
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
    static register(t) {
        return s.singleton(w, this).register(t);
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
        return [ g ];
    }
    static register(t) {
        return s.singleton(m, this).register(t);
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
        return [ g ];
    }
    static register(t) {
        return s.singleton(p, this).register(t);
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

const D = {
    register(t) {
        return t.register(ScrollerObserverLocator, CollectionStrategyLocator, DefaultDomRenderer, VirtualRepeat);
    }
};

export { CollectionStrategyLocator, DefaultDomRenderer, D as DefaultVirtualRepeatConfiguration, w as ICollectionStrategyLocator, p as IDomRenderer, m as IScrollerObsererLocator, ScrollerObserver, ScrollerObserverLocator, VirtualRepeat };

