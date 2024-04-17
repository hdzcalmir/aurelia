"use strict";

var t = require("@aurelia/metadata");

var e = require("@aurelia/kernel");

const r = Object;

const s = r.prototype.hasOwnProperty;

const n = Reflect.defineProperty;

const createError = t => new Error(t);

const isFunction = t => typeof t === "function";

const isObject = t => t instanceof r;

const isArray = t => t instanceof Array;

const isSet = t => t instanceof Set;

const isMap = t => t instanceof Map;

const i = r.is;

function defineHiddenProp(t, e, r) {
    n(t, e, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: r
    });
    return r;
}

function ensureProto(t, e, r) {
    if (!(e in t)) {
        defineHiddenProp(t, e, r);
    }
}

const o = Object.assign;

const c = Object.freeze;

const a = String;

const u = e.DI.createInterface;

const createLookup = () => r.create(null);

const h = t.Metadata.get;

const l = t.Metadata.define;

const f = /*@__PURE__*/ e.DI.createInterface("ICoercionConfiguration");

const p = 0;

const d = 1;

const b = 2;

const w = 4;

const v = /*@__PURE__*/ c({
    None: p,
    Observer: d,
    Node: b,
    Layout: w
});

function copyIndexMap(t, e, r) {
    const {length: s} = t;
    const n = Array(s);
    let i = 0;
    while (i < s) {
        n[i] = t[i];
        ++i;
    }
    if (e !== void 0) {
        n.deletedIndices = e.slice(0);
    } else if (t.deletedIndices !== void 0) {
        n.deletedIndices = t.deletedIndices.slice(0);
    } else {
        n.deletedIndices = [];
    }
    if (r !== void 0) {
        n.deletedItems = r.slice(0);
    } else if (t.deletedItems !== void 0) {
        n.deletedItems = t.deletedItems.slice(0);
    } else {
        n.deletedItems = [];
    }
    n.isIndexMap = true;
    return n;
}

function createIndexMap(t = 0) {
    const e = Array(t);
    let r = 0;
    while (r < t) {
        e[r] = r++;
    }
    e.deletedIndices = [];
    e.deletedItems = [];
    e.isIndexMap = true;
    return e;
}

function cloneIndexMap(t) {
    const e = t.slice();
    e.deletedIndices = t.deletedIndices.slice();
    e.deletedItems = t.deletedItems.slice();
    e.isIndexMap = true;
    return e;
}

function isIndexMap(t) {
    return isArray(t) && t.isIndexMap === true;
}

let g = new Map;

let y = false;

function batch(t) {
    const e = g;
    const r = g = new Map;
    y = true;
    try {
        t();
    } finally {
        g = null;
        y = false;
        try {
            let t;
            let s;
            let n;
            let i;
            let o;
            let c = false;
            let a;
            let u;
            for (t of r) {
                s = t[0];
                n = t[1];
                if (e?.has(s)) {
                    e.set(s, n);
                }
                if (n[0] === 1) {
                    s.notify(n[1], n[2]);
                } else {
                    i = n[1];
                    o = n[2];
                    c = false;
                    if (o.deletedIndices.length > 0) {
                        c = true;
                    } else {
                        for (a = 0, u = o.length; a < u; ++a) {
                            if (o[a] !== a) {
                                c = true;
                                break;
                            }
                        }
                    }
                    if (c) {
                        s.notifyCollection(i, o);
                    }
                }
            }
        } finally {
            g = e;
        }
    }
}

function addCollectionBatch(t, e, r) {
    if (!g.has(t)) {
        g.set(t, [ 2, e, r ]);
    } else {
        g.get(t)[2] = r;
    }
}

function addValueBatch(t, e, r) {
    const s = g.get(t);
    if (s === void 0) {
        g.set(t, [ 1, e, r ]);
    } else {
        s[1] = e;
        s[2] = r;
    }
}

const O = /*@__PURE__*/ (() => {
    function subscriberCollection(t, e) {
        return t == null ? subscriberCollectionDeco : subscriberCollectionDeco(t);
    }
    function getSubscriberRecord() {
        return defineHiddenProp(this, "subs", new SubscriberRecord);
    }
    function addSubscriber(t) {
        return this.subs.add(t);
    }
    function removeSubscriber(t) {
        return this.subs.remove(t);
    }
    const t = new WeakSet;
    function subscriberCollectionDeco(e, r) {
        if (!t.has(e)) {
            t.add(e);
            const r = e.prototype;
            n(r, "subs", {
                get: getSubscriberRecord
            });
            ensureProto(r, "subscribe", addSubscriber);
            ensureProto(r, "unsubscribe", removeSubscriber);
        }
        return e;
    }
    class SubscriberRecord {
        constructor() {
            this.count = 0;
            this.t = [];
        }
        add(t) {
            if (this.t.includes(t)) {
                return false;
            }
            this.t[this.t.length] = t;
            ++this.count;
            return true;
        }
        remove(t) {
            const e = this.t.indexOf(t);
            if (e !== -1) {
                this.t.splice(e, 1);
                --this.count;
                return true;
            }
            return false;
        }
        notify(t, e) {
            if (y) {
                addValueBatch(this, t, e);
                return;
            }
            const r = this.t.slice(0);
            const s = r.length;
            let n = 0;
            for (;n < s; ++n) {
                r[n].handleChange(t, e);
            }
            return;
        }
        notifyCollection(t, e) {
            const r = this.t.slice(0);
            const s = r.length;
            let n = 0;
            for (;n < s; ++n) {
                r[n].handleCollectionChange(t, e);
            }
            return;
        }
    }
    return subscriberCollection;
})();

const createMappedError = (t, ...e) => new Error(`AUR${a(t).padStart(4, "0")}:${e.map(a)}`);

class CollectionLengthObserver {
    constructor(t) {
        this.owner = t;
        this.type = d;
        this.v = (this.o = t.collection).length;
    }
    getValue() {
        return this.o.length;
    }
    setValue(t) {
        if (t !== this.v) {
            if (!Number.isNaN(t)) {
                this.o.splice(t);
                this.v = this.o.length;
            }
        }
    }
    handleCollectionChange(t, e) {
        const r = this.v;
        const s = this.o.length;
        if ((this.v = s) !== r) {
            this.subs.notify(this.v, r);
        }
    }
}

(() => {
    implementLengthObserver(CollectionLengthObserver);
})();

class CollectionSizeObserver {
    constructor(t) {
        this.owner = t;
        this.type = d;
        this.v = (this.o = t.collection).size;
    }
    getValue() {
        return this.o.size;
    }
    setValue() {
        throw createMappedError(220);
    }
    handleCollectionChange(t, e) {
        const r = this.v;
        const s = this.o.size;
        if ((this.v = s) !== r) {
            this.subs.notify(this.v, r);
        }
    }
}

(() => {
    implementLengthObserver(CollectionSizeObserver);
})();

function implementLengthObserver(t) {
    const e = t.prototype;
    ensureProto(e, "subscribe", subscribe);
    ensureProto(e, "unsubscribe", unsubscribe);
    return O(t, null);
}

function subscribe(t) {
    if (this.subs.add(t) && this.subs.count === 1) {
        this.owner.subscribe(this);
    }
}

function unsubscribe(t) {
    if (this.subs.remove(t) && this.subs.count === 0) {
        this.owner.subscribe(this);
    }
}

const C = Symbol.for("__au_arr_obs__");

const A = Array[C] ?? defineHiddenProp(Array, C, new WeakMap);

function sortCompare(t, e) {
    if (t === e) {
        return 0;
    }
    t = t === null ? "null" : t.toString();
    e = e === null ? "null" : e.toString();
    return t < e ? -1 : 1;
}

function preSortCompare(t, e) {
    if (t === void 0) {
        if (e === void 0) {
            return 0;
        } else {
            return 1;
        }
    }
    if (e === void 0) {
        return -1;
    }
    return 0;
}

function insertionSort(t, e, r, s, n) {
    let i, o, c, a, u;
    let h, l;
    for (h = r + 1; h < s; h++) {
        i = t[h];
        o = e[h];
        for (l = h - 1; l >= r; l--) {
            c = t[l];
            a = e[l];
            u = n(c, i);
            if (u > 0) {
                t[l + 1] = c;
                e[l + 1] = a;
            } else {
                break;
            }
        }
        t[l + 1] = i;
        e[l + 1] = o;
    }
}

function quickSort(t, e, r, s, n) {
    let i = 0, o = 0;
    let c, a, u;
    let h, l, f;
    let p, d, b;
    let w, v;
    let g, y, O, C;
    let A, x, S, m;
    while (true) {
        if (s - r <= 10) {
            insertionSort(t, e, r, s, n);
            return;
        }
        i = r + (s - r >> 1);
        c = t[r];
        h = e[r];
        a = t[s - 1];
        l = e[s - 1];
        u = t[i];
        f = e[i];
        p = n(c, a);
        if (p > 0) {
            w = c;
            v = h;
            c = a;
            h = l;
            a = w;
            l = v;
        }
        d = n(c, u);
        if (d >= 0) {
            w = c;
            v = h;
            c = u;
            h = f;
            u = a;
            f = l;
            a = w;
            l = v;
        } else {
            b = n(a, u);
            if (b > 0) {
                w = a;
                v = l;
                a = u;
                l = f;
                u = w;
                f = v;
            }
        }
        t[r] = c;
        e[r] = h;
        t[s - 1] = u;
        e[s - 1] = f;
        g = a;
        y = l;
        O = r + 1;
        C = s - 1;
        t[i] = t[O];
        e[i] = e[O];
        t[O] = g;
        e[O] = y;
        t: for (o = O + 1; o < C; o++) {
            A = t[o];
            x = e[o];
            S = n(A, g);
            if (S < 0) {
                t[o] = t[O];
                e[o] = e[O];
                t[O] = A;
                e[O] = x;
                O++;
            } else if (S > 0) {
                do {
                    C--;
                    if (C == o) {
                        break t;
                    }
                    m = t[C];
                    S = n(m, g);
                } while (S > 0);
                t[o] = t[C];
                e[o] = e[C];
                t[C] = A;
                e[C] = x;
                if (S < 0) {
                    A = t[o];
                    x = e[o];
                    t[o] = t[O];
                    e[o] = e[O];
                    t[O] = A;
                    e[O] = x;
                    O++;
                }
            }
        }
        if (s - C < O - r) {
            quickSort(t, e, C, s, n);
            s = O;
        } else {
            quickSort(t, e, r, O, n);
            r = C;
        }
    }
}

const x = Array.prototype;

const S = [ "push", "unshift", "pop", "shift", "splice", "reverse", "sort" ];

let m;

let R;

function overrideArrayPrototypes() {
    const t = x.push;
    const e = x.unshift;
    const r = x.pop;
    const s = x.shift;
    const i = x.splice;
    const o = x.reverse;
    const c = x.sort;
    R = {
        push: t,
        unshift: e,
        pop: r,
        shift: s,
        splice: i,
        reverse: o,
        sort: c
    };
    m = {
        push: function(...e) {
            const r = A.get(this);
            if (r === void 0) {
                return t.apply(this, e);
            }
            const s = this.length;
            const n = e.length;
            if (n === 0) {
                return s;
            }
            this.length = r.indexMap.length = s + n;
            let i = s;
            while (i < this.length) {
                this[i] = e[i - s];
                r.indexMap[i] = -2;
                i++;
            }
            r.notify();
            return this.length;
        },
        unshift: function(...t) {
            const r = A.get(this);
            if (r === void 0) {
                return e.apply(this, t);
            }
            const s = t.length;
            const n = new Array(s);
            let i = 0;
            while (i < s) {
                n[i++] = -2;
            }
            e.apply(r.indexMap, n);
            const o = e.apply(this, t);
            r.notify();
            return o;
        },
        pop: function() {
            const t = A.get(this);
            if (t === void 0) {
                return r.call(this);
            }
            const e = t.indexMap;
            const s = r.call(this);
            const n = e.length - 1;
            if (e[n] > -1) {
                e.deletedIndices.push(e[n]);
                e.deletedItems.push(s);
            }
            r.call(e);
            t.notify();
            return s;
        },
        shift: function() {
            const t = A.get(this);
            if (t === void 0) {
                return s.call(this);
            }
            const e = t.indexMap;
            const r = s.call(this);
            if (e[0] > -1) {
                e.deletedIndices.push(e[0]);
                e.deletedItems.push(r);
            }
            s.call(e);
            t.notify();
            return r;
        },
        splice: function(...t) {
            const e = t[0];
            const r = t[1];
            const s = A.get(this);
            if (s === void 0) {
                return i.apply(this, t);
            }
            const n = this.length;
            const o = e | 0;
            const c = o < 0 ? Math.max(n + o, 0) : Math.min(o, n);
            const a = s.indexMap;
            const u = t.length;
            const h = u === 0 ? 0 : u === 1 ? n - c : r;
            let l = c;
            if (h > 0) {
                const t = l + h;
                while (l < t) {
                    if (a[l] > -1) {
                        a.deletedIndices.push(a[l]);
                        a.deletedItems.push(this[l]);
                    }
                    l++;
                }
            }
            l = 0;
            if (u > 2) {
                const t = u - 2;
                const s = new Array(t);
                while (l < t) {
                    s[l++] = -2;
                }
                i.call(a, e, r, ...s);
            } else {
                i.apply(a, t);
            }
            const f = i.apply(this, t);
            if (h > 0 || l > 0) {
                s.notify();
            }
            return f;
        },
        reverse: function() {
            const t = A.get(this);
            if (t === void 0) {
                o.call(this);
                return this;
            }
            const e = this.length;
            const r = e / 2 | 0;
            let s = 0;
            while (s !== r) {
                const r = e - s - 1;
                const n = this[s];
                const i = t.indexMap[s];
                const o = this[r];
                const c = t.indexMap[r];
                this[s] = o;
                t.indexMap[s] = c;
                this[r] = n;
                t.indexMap[r] = i;
                s++;
            }
            t.notify();
            return this;
        },
        sort: function(t) {
            const e = A.get(this);
            if (e === void 0) {
                c.call(this, t);
                return this;
            }
            let r = this.length;
            if (r < 2) {
                return this;
            }
            quickSort(this, e.indexMap, 0, r, preSortCompare);
            let s = 0;
            while (s < r) {
                if (this[s] === void 0) {
                    break;
                }
                s++;
            }
            if (t === void 0 || !isFunction(t)) {
                t = sortCompare;
            }
            quickSort(this, e.indexMap, 0, s, t);
            let n = false;
            for (s = 0, r = e.indexMap.length; r > s; ++s) {
                if (e.indexMap[s] !== s) {
                    n = true;
                    break;
                }
            }
            if (n || y) {
                e.notify();
            }
            return this;
        }
    };
    for (const t of S) {
        n(m[t], "observing", {
            value: true,
            writable: false,
            configurable: false,
            enumerable: false
        });
    }
}

let _ = false;

const M = "__au_arr_on__";

function enableArrayObservation() {
    if (m === undefined) {
        overrideArrayPrototypes();
    }
    if (!(h(M, Array) ?? false)) {
        l(true, Array, M);
        for (const t of S) {
            if (x[t].observing !== true) {
                defineHiddenProp(x, t, m[t]);
            }
        }
    }
}

function disableArrayObservation() {
    for (const t of S) {
        if (x[t].observing === true) {
            defineHiddenProp(x, t, R[t]);
        }
    }
}

class ArrayObserver {
    constructor(t) {
        this.type = d;
        if (!_) {
            _ = true;
            enableArrayObservation();
        }
        this.indexObservers = {};
        this.collection = t;
        this.indexMap = createIndexMap(t.length);
        this.lenObs = void 0;
        A.set(t, this);
    }
    notify() {
        const t = this.subs;
        const e = this.indexMap;
        if (y) {
            addCollectionBatch(t, this.collection, e);
            return;
        }
        const r = this.collection;
        const s = r.length;
        this.indexMap = createIndexMap(s);
        this.subs.notifyCollection(r, e);
    }
    getLengthObserver() {
        return this.lenObs ??= new CollectionLengthObserver(this);
    }
    getIndexObserver(t) {
        return this.indexObservers[t] ??= new ArrayIndexObserver(this, t);
    }
}

(() => {
    O(ArrayObserver, null);
})();

class ArrayIndexObserver {
    constructor(t, e) {
        this.owner = t;
        this.index = e;
        this.doNotCache = true;
        this.value = this.getValue();
    }
    getValue() {
        return this.owner.collection[this.index];
    }
    setValue(t) {
        if (t === this.getValue()) {
            return;
        }
        const e = this.owner;
        const r = this.index;
        const s = e.indexMap;
        if (s[r] > -1) {
            s.deletedIndices.push(s[r]);
        }
        s[r] = -2;
        e.collection[r] = t;
        e.notify();
    }
    handleCollectionChange(t, e) {
        const r = this.index;
        const s = e[r] === r;
        if (s) {
            return;
        }
        const n = this.value;
        const i = this.value = this.getValue();
        if (n !== i) {
            this.subs.notify(i, n);
        }
    }
    subscribe(t) {
        if (this.subs.add(t) && this.subs.count === 1) {
            this.owner.subscribe(this);
        }
    }
    unsubscribe(t) {
        if (this.subs.remove(t) && this.subs.count === 0) {
            this.owner.unsubscribe(this);
        }
    }
}

(() => {
    O(ArrayIndexObserver, null);
})();

function getArrayObserver(t) {
    let e = A.get(t);
    if (e === void 0) {
        e = new ArrayObserver(t);
    }
    return e;
}

const P = Symbol.for("__au_set_obs__");

const k = Set[P] ?? defineHiddenProp(Set, P, new WeakMap);

const I = Set.prototype;

const L = I.add;

const V = I.clear;

const D = I.delete;

const N = {
    add: L,
    clear: V,
    delete: D
};

const H = [ "add", "clear", "delete" ];

const F = {
    add: function(t) {
        const e = k.get(this);
        if (e === undefined) {
            L.call(this, t);
            return this;
        }
        const r = this.size;
        L.call(this, t);
        const s = this.size;
        if (s === r) {
            return this;
        }
        e.indexMap[r] = -2;
        e.notify();
        return this;
    },
    clear: function() {
        const t = k.get(this);
        if (t === undefined) {
            return V.call(this);
        }
        const e = this.size;
        if (e > 0) {
            const e = t.indexMap;
            let r = 0;
            for (const t of this.keys()) {
                if (e[r] > -1) {
                    e.deletedIndices.push(e[r]);
                    e.deletedItems.push(t);
                }
                r++;
            }
            V.call(this);
            e.length = 0;
            t.notify();
        }
        return undefined;
    },
    delete: function(t) {
        const e = k.get(this);
        if (e === undefined) {
            return D.call(this, t);
        }
        const r = this.size;
        if (r === 0) {
            return false;
        }
        let s = 0;
        const n = e.indexMap;
        for (const r of this.keys()) {
            if (r === t) {
                if (n[s] > -1) {
                    n.deletedIndices.push(n[s]);
                    n.deletedItems.push(r);
                }
                n.splice(s, 1);
                const i = D.call(this, t);
                if (i === true) {
                    e.notify();
                }
                return i;
            }
            s++;
        }
        return false;
    }
};

const j = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const t of H) {
    n(F[t], "observing", {
        value: true,
        writable: false,
        configurable: false,
        enumerable: false
    });
}

let E = false;

const z = "__au_set_on__";

function enableSetObservation() {
    if (!(h(z, Set) ?? false)) {
        l(true, Set, z);
        for (const t of H) {
            if (I[t].observing !== true) {
                n(I, t, {
                    ...j,
                    value: F[t]
                });
            }
        }
    }
}

function disableSetObservation() {
    for (const t of H) {
        if (I[t].observing === true) {
            n(I, t, {
                ...j,
                value: N[t]
            });
        }
    }
}

class SetObserver {
    constructor(t) {
        this.type = d;
        if (!E) {
            E = true;
            enableSetObservation();
        }
        this.collection = t;
        this.indexMap = createIndexMap(t.size);
        this.lenObs = void 0;
        k.set(t, this);
    }
    notify() {
        const t = this.subs;
        const e = this.indexMap;
        if (y) {
            addCollectionBatch(t, this.collection, e);
            return;
        }
        const r = this.collection;
        const s = r.size;
        this.indexMap = createIndexMap(s);
        this.subs.notifyCollection(r, e);
    }
    getLengthObserver() {
        return this.lenObs ??= new CollectionSizeObserver(this);
    }
}

(() => {
    O(SetObserver, null);
})();

function getSetObserver(t) {
    let e = k.get(t);
    if (e === void 0) {
        e = new SetObserver(t);
    }
    return e;
}

const $ = Symbol.for("__au_map_obs__");

const B = Map[$] ?? defineHiddenProp(Map, $, new WeakMap);

const W = Map.prototype;

const q = W.set;

const K = W.clear;

const T = W.delete;

const U = {
    set: q,
    clear: K,
    delete: T
};

const G = [ "set", "clear", "delete" ];

const J = {
    set: function(t, e) {
        const r = B.get(this);
        if (r === undefined) {
            q.call(this, t, e);
            return this;
        }
        const s = this.get(t);
        const n = this.size;
        q.call(this, t, e);
        const i = this.size;
        if (i === n) {
            let e = 0;
            for (const n of this.entries()) {
                if (n[0] === t) {
                    if (n[1] !== s) {
                        r.indexMap.deletedIndices.push(r.indexMap[e]);
                        r.indexMap.deletedItems.push(n);
                        r.indexMap[e] = -2;
                        r.notify();
                    }
                    return this;
                }
                e++;
            }
            return this;
        }
        r.indexMap[n] = -2;
        r.notify();
        return this;
    },
    clear: function() {
        const t = B.get(this);
        if (t === undefined) {
            return K.call(this);
        }
        const e = this.size;
        if (e > 0) {
            const e = t.indexMap;
            let r = 0;
            for (const t of this.keys()) {
                if (e[r] > -1) {
                    e.deletedIndices.push(e[r]);
                    e.deletedItems.push(t);
                }
                r++;
            }
            K.call(this);
            e.length = 0;
            t.notify();
        }
        return undefined;
    },
    delete: function(t) {
        const e = B.get(this);
        if (e === undefined) {
            return T.call(this, t);
        }
        const r = this.size;
        if (r === 0) {
            return false;
        }
        let s = 0;
        const n = e.indexMap;
        for (const r of this.keys()) {
            if (r === t) {
                if (n[s] > -1) {
                    n.deletedIndices.push(n[s]);
                    n.deletedItems.push(r);
                }
                n.splice(s, 1);
                const i = T.call(this, t);
                if (i === true) {
                    e.notify();
                }
                return i;
            }
            ++s;
        }
        return false;
    }
};

const Q = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const t of G) {
    n(J[t], "observing", {
        value: true,
        writable: false,
        configurable: false,
        enumerable: false
    });
}

let X = false;

const Y = "__au_map_on__";

function enableMapObservation() {
    if (!(h(Y, Map) ?? false)) {
        l(true, Map, Y);
        for (const t of G) {
            if (W[t].observing !== true) {
                n(W, t, {
                    ...Q,
                    value: J[t]
                });
            }
        }
    }
}

function disableMapObservation() {
    for (const t of G) {
        if (W[t].observing === true) {
            n(W, t, {
                ...Q,
                value: U[t]
            });
        }
    }
}

class MapObserver {
    constructor(t) {
        this.type = d;
        if (!X) {
            X = true;
            enableMapObservation();
        }
        this.collection = t;
        this.indexMap = createIndexMap(t.size);
        this.lenObs = void 0;
        B.set(t, this);
    }
    notify() {
        const t = this.subs;
        const e = this.indexMap;
        if (y) {
            addCollectionBatch(t, this.collection, e);
            return;
        }
        const r = this.collection;
        const s = r.size;
        this.indexMap = createIndexMap(s);
        t.notifyCollection(r, e);
    }
    getLengthObserver() {
        return this.lenObs ??= new CollectionSizeObserver(this);
    }
}

(() => {
    O(MapObserver, null);
})();

function getMapObserver(t) {
    let e = B.get(t);
    if (e === void 0) {
        e = new MapObserver(t);
    }
    return e;
}

const Z = /*@__PURE__*/ (() => {
    class BindingObserverRecord {
        constructor(t) {
            this.version = 0;
            this.count = 0;
            this.o = new Map;
            this.b = t;
        }
        add(t) {
            if (!this.o.has(t)) {
                t.subscribe(this.b);
                ++this.count;
            }
            this.o.set(t, this.version);
        }
        clear() {
            this.o.forEach(unsubscribeStale, this);
            this.count = this.o.size;
        }
        clearAll() {
            this.o.forEach(unsubscribeAll, this);
            this.o.clear();
            this.count = 0;
        }
    }
    function unsubscribeAll(t, e) {
        e.unsubscribe(this.b);
    }
    function unsubscribeStale(t, e) {
        if (this.version !== t) {
            e.unsubscribe(this.b);
            this.o.delete(e);
        }
    }
    function getObserverRecord() {
        return defineHiddenProp(this, "obs", new BindingObserverRecord(this));
    }
    function observe(t, e) {
        this.obs.add(this.oL.getObserver(t, e));
    }
    function observeCollection(t) {
        let e;
        if (isArray(t)) {
            e = getArrayObserver(t);
        } else if (isSet(t)) {
            e = getSetObserver(t);
        } else if (isMap(t)) {
            e = getMapObserver(t);
        } else {
            throw createMappedError(210, t);
        }
        this.obs.add(e);
    }
    function subscribeTo(t) {
        this.obs.add(t);
    }
    function noopHandleChange() {
        throw createMappedError(99, "handleChange");
    }
    function noopHandleCollectionChange() {
        throw createMappedError(99, "handleCollectionChange");
    }
    return function connectableDecorator(t, e) {
        const r = t.prototype;
        ensureProto(r, "observe", observe);
        ensureProto(r, "observeCollection", observeCollection);
        ensureProto(r, "subscribeTo", subscribeTo);
        n(r, "obs", {
            get: getObserverRecord
        });
        ensureProto(r, "handleChange", noopHandleChange);
        ensureProto(r, "handleCollectionChange", noopHandleCollectionChange);
        return t;
    };
})();

function connectable(t, e) {
    return t == null ? Z : Z(t, e);
}

let tt = null;

const et = [];

let rt = false;

function pauseConnecting() {
    rt = false;
}

function resumeConnecting() {
    rt = true;
}

function currentConnectable() {
    return tt;
}

function enterConnectable(t) {
    if (t == null) {
        throw createMappedError(206);
    }
    if (tt == null) {
        tt = t;
        et[0] = tt;
        rt = true;
        return;
    }
    if (tt === t) {
        throw createMappedError(207);
    }
    et.push(t);
    tt = t;
    rt = true;
}

function exitConnectable(t) {
    if (t == null) {
        throw createMappedError(208);
    }
    if (tt !== t) {
        throw createMappedError(209);
    }
    et.pop();
    tt = et.length > 0 ? et[et.length - 1] : null;
    rt = tt != null;
}

const st = /*@__PURE__*/ c({
    get current() {
        return tt;
    },
    get connecting() {
        return rt;
    },
    enter: enterConnectable,
    exit: exitConnectable,
    pause: pauseConnecting,
    resume: resumeConnecting
});

const nt = Reflect.get;

const it = Object.prototype.toString;

const ot = new WeakMap;

const ct = "__au_nw__";

const at = "__au_nw";

function canWrap(t) {
    switch (it.call(t)) {
      case "[object Object]":
        return t.constructor[ct] !== true;

      case "[object Array]":
      case "[object Map]":
      case "[object Set]":
        return true;

      default:
        return false;
    }
}

const ut = "__raw__";

function wrap(t) {
    return canWrap(t) ? getProxy(t) : t;
}

function getProxy(t) {
    return ot.get(t) ?? createProxy(t);
}

function getRaw(t) {
    return t[ut] ?? t;
}

function unwrap(t) {
    return canWrap(t) && t[ut] || t;
}

function doNotCollect(t, e) {
    return e === "constructor" || e === "__proto__" || e === "$observers" || e === Symbol.toPrimitive || e === Symbol.toStringTag || t.constructor[`${at}_${a(e)}__`] === true;
}

function createProxy(t) {
    const e = isArray(t) ? lt : isMap(t) || isSet(t) ? ft : ht;
    const r = new Proxy(t, e);
    ot.set(t, r);
    ot.set(r, r);
    return r;
}

const ht = {
    get(t, e, r) {
        if (e === ut) {
            return t;
        }
        const s = currentConnectable();
        if (!rt || doNotCollect(t, e) || s == null) {
            return nt(t, e, r);
        }
        s.observe(t, e);
        return wrap(nt(t, e, r));
    }
};

const lt = {
    get(t, e, r) {
        if (e === ut) {
            return t;
        }
        if (!rt || doNotCollect(t, e) || tt == null) {
            return nt(t, e, r);
        }
        switch (e) {
          case "length":
            tt.observe(t, "length");
            return t.length;

          case "map":
            return wrappedArrayMap;

          case "includes":
            return wrappedArrayIncludes;

          case "indexOf":
            return wrappedArrayIndexOf;

          case "lastIndexOf":
            return wrappedArrayLastIndexOf;

          case "every":
            return wrappedArrayEvery;

          case "filter":
            return wrappedArrayFilter;

          case "find":
            return wrappedArrayFind;

          case "findIndex":
            return wrappedArrayFindIndex;

          case "flat":
            return wrappedArrayFlat;

          case "flatMap":
            return wrappedArrayFlatMap;

          case "join":
            return wrappedArrayJoin;

          case "push":
            return wrappedArrayPush;

          case "pop":
            return wrappedArrayPop;

          case "reduce":
            return wrappedReduce;

          case "reduceRight":
            return wrappedReduceRight;

          case "reverse":
            return wrappedArrayReverse;

          case "shift":
            return wrappedArrayShift;

          case "unshift":
            return wrappedArrayUnshift;

          case "slice":
            return wrappedArraySlice;

          case "splice":
            return wrappedArraySplice;

          case "some":
            return wrappedArraySome;

          case "sort":
            return wrappedArraySort;

          case "keys":
            return wrappedKeys;

          case "values":
          case Symbol.iterator:
            return wrappedValues;

          case "entries":
            return wrappedEntries;
        }
        tt.observe(t, e);
        return wrap(nt(t, e, r));
    },
    ownKeys(t) {
        currentConnectable()?.observe(t, "length");
        return Reflect.ownKeys(t);
    }
};

function wrappedArrayMap(t, e) {
    const r = getRaw(this);
    const s = r.map(((r, s) => unwrap(t.call(e, wrap(r), s, this))));
    observeCollection(tt, r);
    return wrap(s);
}

function wrappedArrayEvery(t, e) {
    const r = getRaw(this);
    const s = r.every(((r, s) => t.call(e, wrap(r), s, this)));
    observeCollection(tt, r);
    return s;
}

function wrappedArrayFilter(t, e) {
    const r = getRaw(this);
    const s = r.filter(((r, s) => unwrap(t.call(e, wrap(r), s, this))));
    observeCollection(tt, r);
    return wrap(s);
}

function wrappedArrayIncludes(t) {
    const e = getRaw(this);
    const r = e.includes(unwrap(t));
    observeCollection(tt, e);
    return r;
}

function wrappedArrayIndexOf(t) {
    const e = getRaw(this);
    const r = e.indexOf(unwrap(t));
    observeCollection(tt, e);
    return r;
}

function wrappedArrayLastIndexOf(t) {
    const e = getRaw(this);
    const r = e.lastIndexOf(unwrap(t));
    observeCollection(tt, e);
    return r;
}

function wrappedArrayFindIndex(t, e) {
    const r = getRaw(this);
    const s = r.findIndex(((r, s) => unwrap(t.call(e, wrap(r), s, this))));
    observeCollection(tt, r);
    return s;
}

function wrappedArrayFind(t, e) {
    const r = getRaw(this);
    const s = r.find(((e, r) => t(wrap(e), r, this)), e);
    observeCollection(tt, r);
    return wrap(s);
}

function wrappedArrayFlat() {
    const t = getRaw(this);
    observeCollection(tt, t);
    return wrap(t.flat());
}

function wrappedArrayFlatMap(t, e) {
    const r = getRaw(this);
    observeCollection(tt, r);
    return getProxy(r.flatMap(((r, s) => wrap(t.call(e, wrap(r), s, this)))));
}

function wrappedArrayJoin(t) {
    const e = getRaw(this);
    observeCollection(tt, e);
    return e.join(t);
}

function wrappedArrayPop() {
    return wrap(getRaw(this).pop());
}

function wrappedArrayPush(...t) {
    return getRaw(this).push(...t);
}

function wrappedArrayShift() {
    return wrap(getRaw(this).shift());
}

function wrappedArrayUnshift(...t) {
    return getRaw(this).unshift(...t);
}

function wrappedArraySplice(...t) {
    return wrap(getRaw(this).splice(...t));
}

function wrappedArrayReverse(...t) {
    const e = getRaw(this);
    const r = e.reverse();
    observeCollection(tt, e);
    return wrap(r);
}

function wrappedArraySome(t, e) {
    const r = getRaw(this);
    const s = r.some(((r, s) => unwrap(t.call(e, wrap(r), s, this))));
    observeCollection(tt, r);
    return s;
}

function wrappedArraySort(t) {
    const e = getRaw(this);
    const r = e.sort(t);
    observeCollection(tt, e);
    return wrap(r);
}

function wrappedArraySlice(t, e) {
    const r = getRaw(this);
    observeCollection(tt, r);
    return getProxy(r.slice(t, e));
}

function wrappedReduce(t, e) {
    const r = getRaw(this);
    const s = r.reduce(((e, r, s) => t(e, wrap(r), s, this)), e);
    observeCollection(tt, r);
    return wrap(s);
}

function wrappedReduceRight(t, e) {
    const r = getRaw(this);
    const s = r.reduceRight(((e, r, s) => t(e, wrap(r), s, this)), e);
    observeCollection(tt, r);
    return wrap(s);
}

const ft = {
    get(t, e, r) {
        if (e === ut) {
            return t;
        }
        const s = currentConnectable();
        if (!rt || doNotCollect(t, e) || s == null) {
            return nt(t, e, r);
        }
        switch (e) {
          case "size":
            s.observe(t, "size");
            return t.size;

          case "clear":
            return wrappedClear;

          case "delete":
            return wrappedDelete;

          case "forEach":
            return wrappedForEach;

          case "add":
            if (isSet(t)) {
                return wrappedAdd;
            }
            break;

          case "get":
            if (isMap(t)) {
                return wrappedGet;
            }
            break;

          case "set":
            if (isMap(t)) {
                return wrappedSet;
            }
            break;

          case "has":
            return wrappedHas;

          case "keys":
            return wrappedKeys;

          case "values":
            return wrappedValues;

          case "entries":
            return wrappedEntries;

          case Symbol.iterator:
            return isMap(t) ? wrappedEntries : wrappedValues;
        }
        return wrap(nt(t, e, r));
    }
};

function wrappedForEach(t, e) {
    const r = getRaw(this);
    observeCollection(tt, r);
    return r.forEach(((r, s) => {
        t.call(e, wrap(r), wrap(s), this);
    }));
}

function wrappedHas(t) {
    const e = getRaw(this);
    observeCollection(tt, e);
    return e.has(unwrap(t));
}

function wrappedGet(t) {
    const e = getRaw(this);
    observeCollection(tt, e);
    return wrap(e.get(unwrap(t)));
}

function wrappedSet(t, e) {
    return wrap(getRaw(this).set(unwrap(t), unwrap(e)));
}

function wrappedAdd(t) {
    return wrap(getRaw(this).add(unwrap(t)));
}

function wrappedClear() {
    return wrap(getRaw(this).clear());
}

function wrappedDelete(t) {
    return wrap(getRaw(this).delete(unwrap(t)));
}

function wrappedKeys() {
    const t = getRaw(this);
    observeCollection(tt, t);
    const e = t.keys();
    return {
        next() {
            const t = e.next();
            const r = t.value;
            const s = t.done;
            return s ? {
                value: void 0,
                done: s
            } : {
                value: wrap(r),
                done: s
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

function wrappedValues() {
    const t = getRaw(this);
    observeCollection(tt, t);
    const e = t.values();
    return {
        next() {
            const t = e.next();
            const r = t.value;
            const s = t.done;
            return s ? {
                value: void 0,
                done: s
            } : {
                value: wrap(r),
                done: s
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

function wrappedEntries() {
    const t = getRaw(this);
    observeCollection(tt, t);
    const e = t.entries();
    return {
        next() {
            const t = e.next();
            const r = t.value;
            const s = t.done;
            return s ? {
                value: void 0,
                done: s
            } : {
                value: [ wrap(r[0]), wrap(r[1]) ],
                done: s
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

const observeCollection = (t, e) => t?.observeCollection(e);

const pt = /*@__PURE__*/ c({
    getProxy: getProxy,
    getRaw: getRaw,
    wrap: wrap,
    unwrap: unwrap,
    rawKey: ut
});

class ComputedObserver {
    constructor(t, e, r, s, n) {
        this.type = d;
        this.v = void 0;
        this.ir = false;
        this.D = false;
        this.cb = void 0;
        this.i = void 0;
        this.u = void 0;
        this.o = t;
        this.h = n ? wrap(t) : t;
        this.$get = e;
        this.$set = r;
        this.oL = s;
    }
    init(t) {
        this.v = t;
        this.D = false;
    }
    getValue() {
        if (this.subs.count === 0) {
            return this.$get.call(this.o, this.o, this);
        }
        if (this.D) {
            this.compute();
            this.D = false;
        }
        return this.v;
    }
    setValue(t) {
        if (isFunction(this.$set)) {
            if (this.i !== void 0) {
                t = this.i.call(null, t, this.u);
            }
            if (!i(t, this.v)) {
                this.ir = true;
                this.$set.call(this.o, t);
                this.ir = false;
                this.run();
            }
        } else {
            throw createMappedError(221);
        }
    }
    useCoercer(t, e) {
        this.i = t;
        this.u = e;
        return true;
    }
    useCallback(t) {
        this.cb = t;
        return true;
    }
    handleChange() {
        this.D = true;
        if (this.subs.count > 0) {
            this.run();
        }
    }
    handleCollectionChange() {
        this.D = true;
        if (this.subs.count > 0) {
            this.run();
        }
    }
    subscribe(t) {
        if (this.subs.add(t) && this.subs.count === 1) {
            this.compute();
            this.D = false;
        }
    }
    unsubscribe(t) {
        if (this.subs.remove(t) && this.subs.count === 0) {
            this.D = true;
            this.obs.clearAll();
        }
    }
    run() {
        if (this.ir) {
            return;
        }
        const t = this.v;
        const e = this.compute();
        this.D = false;
        if (!i(e, t)) {
            this.cb?.(e, t);
            this.subs.notify(this.v, t);
        }
    }
    compute() {
        this.ir = true;
        this.obs.version++;
        try {
            enterConnectable(this);
            return this.v = unwrap(this.$get.call(this.h, this.h, this));
        } finally {
            this.obs.clear();
            this.ir = false;
            exitConnectable(this);
        }
    }
}

(() => {
    connectable(ComputedObserver, null);
    O(ComputedObserver, null);
})();

const dt = /*@__PURE__*/ u("IDirtyChecker", void 0);

const bt = {
    timeoutsPerCheck: 25,
    disabled: false,
    throw: false,
    resetToDefault() {
        this.timeoutsPerCheck = 6;
        this.disabled = false;
        this.throw = false;
    }
};

class DirtyChecker {
    static register(t) {
        t.register(e.Registration.singleton(this, this), e.Registration.aliasTo(this, dt));
    }
    constructor() {
        this.tracked = [];
        this.O = null;
        this.C = 0;
        this.p = e.resolve(e.IPlatform);
        this.check = () => {
            if (bt.disabled) {
                return;
            }
            if (++this.C < bt.timeoutsPerCheck) {
                return;
            }
            this.C = 0;
            const t = this.tracked;
            const e = t.length;
            let r;
            let s = 0;
            for (;s < e; ++s) {
                r = t[s];
                if (r.isDirty()) {
                    r.flush();
                }
            }
        };
        O(DirtyCheckProperty, null);
    }
    createProperty(t, e) {
        if (bt.throw) {
            throw createError(`AUR0222:${a(e)}`);
        }
        return new DirtyCheckProperty(this, t, e);
    }
    addProperty(t) {
        this.tracked.push(t);
        if (this.tracked.length === 1) {
            this.O = this.p.taskQueue.queueTask(this.check, {
                persistent: true
            });
        }
    }
    removeProperty(t) {
        this.tracked.splice(this.tracked.indexOf(t), 1);
        if (this.tracked.length === 0) {
            this.O.cancel();
            this.O = null;
        }
    }
}

class DirtyCheckProperty {
    constructor(t, e, r) {
        this.obj = e;
        this.key = r;
        this.type = p;
        this.ov = void 0;
        this.A = t;
    }
    getValue() {
        return this.obj[this.key];
    }
    setValue(t) {
        throw createError(`Trying to set value for property ${a(this.key)} in dirty checker`);
    }
    isDirty() {
        return this.ov !== this.obj[this.key];
    }
    flush() {
        const t = this.ov;
        const e = this.getValue();
        this.ov = e;
        this.subs.notify(e, t);
    }
    subscribe(t) {
        if (this.subs.add(t) && this.subs.count === 1) {
            this.ov = this.obj[this.key];
            this.A.addProperty(this);
        }
    }
    unsubscribe(t) {
        if (this.subs.remove(t) && this.subs.count === 0) {
            this.A.removeProperty(this);
        }
    }
}

class PrimitiveObserver {
    get doNotCache() {
        return true;
    }
    constructor(t, e) {
        this.type = p;
        this.o = t;
        this.k = e;
    }
    getValue() {
        return this.o[this.k];
    }
    setValue() {}
    subscribe() {}
    unsubscribe() {}
}

class PropertyAccessor {
    constructor() {
        this.type = p;
    }
    getValue(t, e) {
        return t[e];
    }
    setValue(t, e, r) {
        e[r] = t;
    }
}

class SetterObserver {
    constructor(t, e) {
        this.type = d;
        this.v = void 0;
        this.iO = false;
        this.cb = void 0;
        this.i = void 0;
        this.u = void 0;
        this.o = t;
        this.k = e;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (this.i !== void 0) {
            t = this.i.call(void 0, t, this.u);
        }
        if (this.iO) {
            if (i(t, this.v)) {
                return;
            }
            wt = this.v;
            this.v = t;
            this.cb?.(t, wt);
            this.subs.notify(t, wt);
        } else {
            this.v = this.o[this.k] = t;
            this.cb?.(t, wt);
        }
    }
    useCallback(t) {
        this.cb = t;
        this.start();
        return true;
    }
    useCoercer(t, e) {
        this.i = t;
        this.u = e;
        this.start();
        return true;
    }
    subscribe(t) {
        if (this.iO === false) {
            this.start();
        }
        this.subs.add(t);
    }
    start() {
        if (this.iO === false) {
            this.iO = true;
            this.v = this.o[this.k];
            n(this.o, this.k, {
                enumerable: true,
                configurable: true,
                get: o((() => this.getValue()), {
                    getObserver: () => this
                }),
                set: t => {
                    this.setValue(t);
                }
            });
        }
        return this;
    }
    stop() {
        if (this.iO) {
            n(this.o, this.k, {
                enumerable: true,
                configurable: true,
                writable: true,
                value: this.v
            });
            this.iO = false;
        }
        return this;
    }
}

(() => {
    O(SetterObserver, null);
})();

let wt = void 0;

const vt = new PropertyAccessor;

const gt = /*@__PURE__*/ u("IObserverLocator", (t => t.singleton(ObserverLocator)));

const yt = /*@__PURE__*/ u("INodeObserverLocator", (t => t.cachedCallback((t => new DefaultNodeObserverLocator))));

class DefaultNodeObserverLocator {
    handles() {
        return false;
    }
    getObserver() {
        return vt;
    }
    getAccessor() {
        return vt;
    }
}

const Ot = /*@__PURE__*/ u("IComputedObserverLocator", (t => t.singleton(class DefaultLocator {
    getObserver(t, e, r, s) {
        const i = new ComputedObserver(t, r.get, r.set, s, true);
        n(t, e, {
            enumerable: r.enumerable,
            configurable: true,
            get: o((() => i.getValue()), {
                getObserver: () => i
            }),
            set: t => {
                i.setValue(t);
            }
        });
        return i;
    }
})));

class ObserverLocator {
    constructor() {
        this.R = [];
        this.A = e.resolve(dt);
        this._ = e.resolve(yt);
        this.M = e.resolve(Ot);
    }
    addAdapter(t) {
        this.R.push(t);
    }
    getObserver(t, e) {
        if (t == null) {
            throw createMappedError(199, e);
        }
        if (!isObject(t)) {
            return new PrimitiveObserver(t, isFunction(e) ? "" : e);
        }
        if (isFunction(e)) {
            return new ComputedObserver(t, e, void 0, this, true);
        }
        const r = getObserverLookup(t);
        let s = r[e];
        if (s === void 0) {
            s = this.createObserver(t, e);
            if (!s.doNotCache) {
                r[e] = s;
            }
        }
        return s;
    }
    getAccessor(t, e) {
        const r = t.$observers?.[e];
        if (r !== void 0) {
            return r;
        }
        if (this._.handles(t, e, this)) {
            return this._.getAccessor(t, e, this);
        }
        return vt;
    }
    getArrayObserver(t) {
        return getArrayObserver(t);
    }
    getMapObserver(t) {
        return getMapObserver(t);
    }
    getSetObserver(t) {
        return getSetObserver(t);
    }
    createObserver(t, r) {
        if (this._.handles(t, r, this)) {
            return this._.getObserver(t, r, this);
        }
        switch (r) {
          case "length":
            if (isArray(t)) {
                return getArrayObserver(t).getLengthObserver();
            }
            break;

          case "size":
            if (isMap(t)) {
                return getMapObserver(t).getLengthObserver();
            } else if (isSet(t)) {
                return getSetObserver(t).getLengthObserver();
            }
            break;

          default:
            if (isArray(t) && e.isArrayIndex(r)) {
                return getArrayObserver(t).getIndexObserver(Number(r));
            }
            break;
        }
        let n = At(t, r);
        if (n === void 0) {
            let e = Ct(t);
            while (e !== null) {
                n = At(e, r);
                if (n === void 0) {
                    e = Ct(e);
                } else {
                    break;
                }
            }
        }
        if (n !== void 0 && !s.call(n, "value")) {
            let e = this.P(t, r, n);
            if (e == null) {
                e = (n.get?.getObserver)?.(t);
            }
            return e == null ? n.configurable ? this.M.getObserver(t, r, n, this) : this.A.createProperty(t, r) : e;
        }
        return new SetterObserver(t, r);
    }
    P(t, e, r) {
        if (this.R.length > 0) {
            for (const s of this.R) {
                const n = s.getObserver(t, e, r, this);
                if (n != null) {
                    return n;
                }
            }
        }
        return null;
    }
}

const getCollectionObserver = t => {
    let e;
    if (isArray(t)) {
        e = getArrayObserver(t);
    } else if (isMap(t)) {
        e = getMapObserver(t);
    } else if (isSet(t)) {
        e = getSetObserver(t);
    }
    return e;
};

const Ct = Object.getPrototypeOf;

const At = Object.getOwnPropertyDescriptor;

const getObserverLookup = t => {
    let e = t.$observers;
    if (e === void 0) {
        n(t, "$observers", {
            enumerable: false,
            value: e = createLookup()
        });
    }
    return e;
};

const xt = /*@__PURE__*/ u("IObservation", (t => t.singleton(Observation)));

class Observation {
    static get inject() {
        return [ gt ];
    }
    constructor(t) {
        this.oL = t;
        this.I = {
            immediate: true
        };
    }
    run(t) {
        const e = new RunEffect(this.oL, t);
        e.run();
        return e;
    }
    watch(t, e, r, s = this.I) {
        let n = undefined;
        let i = false;
        const o = this.oL.getObserver(t, e);
        const c = {
            handleChange: (t, e) => r(t, n = e)
        };
        const run = () => {
            if (i) return;
            r(o.getValue(), n);
        };
        const stop = () => {
            i = true;
            o.unsubscribe(c);
        };
        o.subscribe(c);
        if (s.immediate) {
            run();
        }
        return {
            run: run,
            stop: stop
        };
    }
}

class RunEffect {
    constructor(t, e) {
        this.oL = t;
        this.fn = e;
        this.maxRunCount = 10;
        this.queued = false;
        this.running = false;
        this.runCount = 0;
        this.stopped = false;
    }
    handleChange() {
        this.queued = true;
        this.run();
    }
    handleCollectionChange() {
        this.queued = true;
        this.run();
    }
    run() {
        if (this.stopped) {
            throw createMappedError(225);
        }
        if (this.running) {
            return;
        }
        ++this.runCount;
        this.running = true;
        this.queued = false;
        ++this.obs.version;
        try {
            enterConnectable(this);
            this.fn(this);
        } finally {
            this.obs.clear();
            this.running = false;
            exitConnectable(this);
        }
        if (this.queued) {
            if (this.runCount > this.maxRunCount) {
                this.runCount = 0;
                throw createMappedError(226);
            }
            this.run();
        } else {
            this.runCount = 0;
        }
    }
    stop() {
        this.stopped = true;
        this.obs.clearAll();
    }
}

(() => {
    connectable(RunEffect, null);
})();

const St = /*@__PURE__*/ (() => {
    function getObserversLookup(t) {
        if (t.$observers === void 0) {
            n(t, "$observers", {
                value: {}
            });
        }
        return t.$observers;
    }
    const t = {};
    function observable(r, s) {
        if (!SetterNotifier.mixed) {
            SetterNotifier.mixed = true;
            O(SetterNotifier, null);
        }
        let i = false;
        let o;
        if (typeof r === "object") {
            o = r;
        } else if (r != null) {
            o = {
                name: r
            };
            i = true;
        } else {
            o = e.emptyObject;
        }
        if (arguments.length === 0) {
            return function(t, e) {
                if (e.kind !== "field") throw createMappedError(224);
                return createFieldInitializer(e);
            };
        }
        if (s?.kind === "field") return createFieldInitializer(s);
        if (i) {
            return function(e, r) {
                createDescriptor(e, o.name, (() => t), true);
            };
        }
        return function(e, r) {
            switch (r.kind) {
              case "field":
                return createFieldInitializer(r);

              case "class":
                return createDescriptor(e, o.name, (() => t), true);

              default:
                throw createMappedError(224);
            }
        };
        function createFieldInitializer(t) {
            let e;
            t.addInitializer((function() {
                createDescriptor(this, t.name, (() => e), false);
            }));
            return function(t) {
                return e = t;
            };
        }
        function createDescriptor(t, e, r, s) {
            const i = o.callback || `${a(e)}Changed`;
            const c = o.set;
            const observableGetter = function() {
                const t = getNotifier(this, e, i, r, c);
                currentConnectable()?.subscribeTo(t);
                return t.getValue();
            };
            observableGetter.getObserver = function(t) {
                return getNotifier(t, e, i, r, c);
            };
            const u = {
                enumerable: true,
                configurable: true,
                get: observableGetter,
                set(t) {
                    getNotifier(this, e, i, r, c).setValue(t);
                }
            };
            if (s) n(t.prototype, e, u); else n(t, e, u);
        }
    }
    function getNotifier(e, r, s, n, i) {
        const o = getObserversLookup(e);
        let c = o[r];
        if (c == null) {
            const a = n();
            c = new SetterNotifier(e, s, i, a === t ? void 0 : a);
            o[r] = c;
        }
        return c;
    }
    class SetterNotifier {
        constructor(t, e, r, s) {
            this.type = d;
            this.v = void 0;
            this.ov = void 0;
            this.o = t;
            this.S = r;
            this.hs = isFunction(r);
            const n = t[e];
            this.cb = isFunction(n) ? n : void 0;
            this.v = s;
        }
        getValue() {
            return this.v;
        }
        setValue(t) {
            if (this.hs) {
                t = this.S(t);
            }
            if (!i(t, this.v)) {
                this.ov = this.v;
                this.v = t;
                this.cb?.call(this.o, this.v, this.ov);
                t = this.ov;
                this.ov = this.v;
                this.subs.notify(this.v, t);
            }
        }
    }
    SetterNotifier.mixed = false;
    return observable;
})();

function nowrap(t, e) {
    return arguments.length === 0 ? decorator : decorator(t, e);
    function decorator(t, e) {
        switch (e.kind) {
          case "class":
            defineHiddenProp(t, ct, true);
            break;

          case "field":
            e.addInitializer((function() {
                const t = this.constructor;
                const r = `${at}_${a(e.name)}__`;
                if (r in t) return;
                defineHiddenProp(t, r, true);
            }));
            break;
        }
    }
}

exports.AccessorType = v;

exports.ArrayIndexObserver = ArrayIndexObserver;

exports.ArrayObserver = ArrayObserver;

exports.CollectionLengthObserver = CollectionLengthObserver;

exports.CollectionSizeObserver = CollectionSizeObserver;

exports.ComputedObserver = ComputedObserver;

exports.ConnectableSwitcher = st;

exports.DirtyCheckProperty = DirtyCheckProperty;

exports.DirtyCheckSettings = bt;

exports.DirtyChecker = DirtyChecker;

exports.ICoercionConfiguration = f;

exports.IComputedObserverLocator = Ot;

exports.IDirtyChecker = dt;

exports.INodeObserverLocator = yt;

exports.IObservation = xt;

exports.IObserverLocator = gt;

exports.MapObserver = MapObserver;

exports.Observation = Observation;

exports.ObserverLocator = ObserverLocator;

exports.PrimitiveObserver = PrimitiveObserver;

exports.PropertyAccessor = PropertyAccessor;

exports.ProxyObservable = pt;

exports.SetObserver = SetObserver;

exports.SetterObserver = SetterObserver;

exports.batch = batch;

exports.cloneIndexMap = cloneIndexMap;

exports.connectable = connectable;

exports.copyIndexMap = copyIndexMap;

exports.createIndexMap = createIndexMap;

exports.disableArrayObservation = disableArrayObservation;

exports.disableMapObservation = disableMapObservation;

exports.disableSetObservation = disableSetObservation;

exports.enableArrayObservation = enableArrayObservation;

exports.enableMapObservation = enableMapObservation;

exports.enableSetObservation = enableSetObservation;

exports.getCollectionObserver = getCollectionObserver;

exports.getObserverLookup = getObserverLookup;

exports.isIndexMap = isIndexMap;

exports.nowrap = nowrap;

exports.observable = St;

exports.subscriberCollection = O;
//# sourceMappingURL=index.cjs.map
