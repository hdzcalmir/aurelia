import { Metadata as t } from "../../../metadata/dist/native-modules/index.mjs";

import { DI as e, Registration as r, resolve as s, IPlatform as n, isArrayIndex as i, emptyObject as o } from "../../../kernel/dist/native-modules/index.mjs";

const c = Object;

const a = c.prototype.hasOwnProperty;

const u = Reflect.defineProperty;

const createError = t => new Error(t);

const isFunction = t => typeof t === "function";

const isObject = t => t instanceof c;

const isArray = t => t instanceof Array;

const isSet = t => t instanceof Set;

const isMap = t => t instanceof Map;

const h = c.is;

function defineHiddenProp(t, e, r) {
    u(t, e, {
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

const l = Object.assign;

const f = Object.freeze;

const d = String;

const p = e.createInterface;

const createLookup = () => c.create(null);

const b = t.get;

const w = t.define;

const v = /*@__PURE__*/ e.createInterface("ICoercionConfiguration");

const g = 0;

const y = 1;

const O = 2;

const C = 4;

const A = /*@__PURE__*/ f({
    None: g,
    Observer: y,
    Node: O,
    Layout: C
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

let S = new Map;

let m = false;

function batch(t) {
    const e = S;
    const r = S = new Map;
    m = true;
    try {
        t();
    } finally {
        S = null;
        m = false;
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
            S = e;
        }
    }
}

function addCollectionBatch(t, e, r) {
    if (!S.has(t)) {
        S.set(t, [ 2, e, r ]);
    } else {
        S.get(t)[2] = r;
    }
}

function addValueBatch(t, e, r) {
    const s = S.get(t);
    if (s === void 0) {
        S.set(t, [ 1, e, r ]);
    } else {
        s[1] = e;
        s[2] = r;
    }
}

const R = (() => {
    function subscriberCollection(t) {
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
    function subscriberCollectionDeco(e) {
        if (t.has(e)) {
            return;
        }
        t.add(e);
        const r = e.prototype;
        u(r, "subs", {
            get: getSubscriberRecord
        });
        ensureProto(r, "subscribe", addSubscriber);
        ensureProto(r, "unsubscribe", removeSubscriber);
    }
    return subscriberCollection;
})();

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
        if (m) {
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

const createMappedError = (t, ...e) => new Error(`AUR${d(t).padStart(4, "0")}:${e.map(d)}`);

class CollectionLengthObserver {
    constructor(t) {
        this.owner = t;
        this.type = y;
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

class CollectionSizeObserver {
    constructor(t) {
        this.owner = t;
        this.type = y;
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

function implementLengthObserver(t) {
    const e = t.prototype;
    ensureProto(e, "subscribe", subscribe);
    ensureProto(e, "unsubscribe", unsubscribe);
    R(t);
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

implementLengthObserver(CollectionLengthObserver);

implementLengthObserver(CollectionSizeObserver);

const _ = Symbol.for("__au_arr_obs__");

const x = Array[_] ?? defineHiddenProp(Array, _, new WeakMap);

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
    let d, p, b;
    let w, v;
    let g, y, O, C;
    let A, S, m, R;
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
        d = n(c, a);
        if (d > 0) {
            w = c;
            v = h;
            c = a;
            h = l;
            a = w;
            l = v;
        }
        p = n(c, u);
        if (p >= 0) {
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
            S = e[o];
            m = n(A, g);
            if (m < 0) {
                t[o] = t[O];
                e[o] = e[O];
                t[O] = A;
                e[O] = S;
                O++;
            } else if (m > 0) {
                do {
                    C--;
                    if (C == o) {
                        break t;
                    }
                    R = t[C];
                    m = n(R, g);
                } while (m > 0);
                t[o] = t[C];
                e[o] = e[C];
                t[C] = A;
                e[C] = S;
                if (m < 0) {
                    A = t[o];
                    S = e[o];
                    t[o] = t[O];
                    e[o] = e[O];
                    t[O] = A;
                    e[O] = S;
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

const P = Array.prototype;

const M = [ "push", "unshift", "pop", "shift", "splice", "reverse", "sort" ];

let k;

let I;

function overrideArrayPrototypes() {
    const t = P.push;
    const e = P.unshift;
    const r = P.pop;
    const s = P.shift;
    const n = P.splice;
    const i = P.reverse;
    const o = P.sort;
    I = {
        push: t,
        unshift: e,
        pop: r,
        shift: s,
        splice: n,
        reverse: i,
        sort: o
    };
    k = {
        push: function(...e) {
            const r = x.get(this);
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
            const r = x.get(this);
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
            const t = x.get(this);
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
            const t = x.get(this);
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
            const s = x.get(this);
            if (s === void 0) {
                return n.apply(this, t);
            }
            const i = this.length;
            const o = e | 0;
            const c = o < 0 ? Math.max(i + o, 0) : Math.min(o, i);
            const a = s.indexMap;
            const u = t.length;
            const h = u === 0 ? 0 : u === 1 ? i - c : r;
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
                n.call(a, e, r, ...s);
            } else {
                n.apply(a, t);
            }
            const f = n.apply(this, t);
            if (h > 0 || l > 0) {
                s.notify();
            }
            return f;
        },
        reverse: function() {
            const t = x.get(this);
            if (t === void 0) {
                i.call(this);
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
            const e = x.get(this);
            if (e === void 0) {
                o.call(this, t);
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
            if (n || m) {
                e.notify();
            }
            return this;
        }
    };
    for (const t of M) {
        u(k[t], "observing", {
            value: true,
            writable: false,
            configurable: false,
            enumerable: false
        });
    }
}

let L = false;

const V = "__au_arr_on__";

function enableArrayObservation() {
    if (k === undefined) {
        overrideArrayPrototypes();
    }
    if (!(b(V, Array) ?? false)) {
        w(true, Array, V);
        for (const t of M) {
            if (P[t].observing !== true) {
                defineHiddenProp(P, t, k[t]);
            }
        }
    }
}

function disableArrayObservation() {
    for (const t of M) {
        if (P[t].observing === true) {
            defineHiddenProp(P, t, I[t]);
        }
    }
}

class ArrayObserver {
    constructor(t) {
        this.type = y;
        if (!L) {
            L = true;
            enableArrayObservation();
        }
        this.indexObservers = {};
        this.collection = t;
        this.indexMap = createIndexMap(t.length);
        this.lenObs = void 0;
        x.set(t, this);
    }
    notify() {
        const t = this.subs;
        const e = this.indexMap;
        if (m) {
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

R(ArrayObserver);

R(ArrayIndexObserver);

function getArrayObserver(t) {
    let e = x.get(t);
    if (e === void 0) {
        e = new ArrayObserver(t);
    }
    return e;
}

const D = Symbol.for("__au_set_obs__");

const N = Set[D] ?? defineHiddenProp(Set, D, new WeakMap);

const H = Set.prototype;

const F = H.add;

const j = H.clear;

const E = H.delete;

const z = {
    add: F,
    clear: j,
    delete: E
};

const $ = [ "add", "clear", "delete" ];

const B = {
    add: function(t) {
        const e = N.get(this);
        if (e === undefined) {
            F.call(this, t);
            return this;
        }
        const r = this.size;
        F.call(this, t);
        const s = this.size;
        if (s === r) {
            return this;
        }
        e.indexMap[r] = -2;
        e.notify();
        return this;
    },
    clear: function() {
        const t = N.get(this);
        if (t === undefined) {
            return j.call(this);
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
            j.call(this);
            e.length = 0;
            t.notify();
        }
        return undefined;
    },
    delete: function(t) {
        const e = N.get(this);
        if (e === undefined) {
            return E.call(this, t);
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
                const i = E.call(this, t);
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

const W = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const t of $) {
    u(B[t], "observing", {
        value: true,
        writable: false,
        configurable: false,
        enumerable: false
    });
}

let q = false;

const K = "__au_set_on__";

function enableSetObservation() {
    if (!(b(K, Set) ?? false)) {
        w(true, Set, K);
        for (const t of $) {
            if (H[t].observing !== true) {
                u(H, t, {
                    ...W,
                    value: B[t]
                });
            }
        }
    }
}

function disableSetObservation() {
    for (const t of $) {
        if (H[t].observing === true) {
            u(H, t, {
                ...W,
                value: z[t]
            });
        }
    }
}

class SetObserver {
    constructor(t) {
        this.type = y;
        if (!q) {
            q = true;
            enableSetObservation();
        }
        this.collection = t;
        this.indexMap = createIndexMap(t.size);
        this.lenObs = void 0;
        N.set(t, this);
    }
    notify() {
        const t = this.subs;
        const e = this.indexMap;
        if (m) {
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

R(SetObserver);

function getSetObserver(t) {
    let e = N.get(t);
    if (e === void 0) {
        e = new SetObserver(t);
    }
    return e;
}

const T = Symbol.for("__au_map_obs__");

const U = Map[T] ?? defineHiddenProp(Map, T, new WeakMap);

const G = Map.prototype;

const J = G.set;

const Q = G.clear;

const X = G.delete;

const Y = {
    set: J,
    clear: Q,
    delete: X
};

const Z = [ "set", "clear", "delete" ];

const tt = {
    set: function(t, e) {
        const r = U.get(this);
        if (r === undefined) {
            J.call(this, t, e);
            return this;
        }
        const s = this.get(t);
        const n = this.size;
        J.call(this, t, e);
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
        const t = U.get(this);
        if (t === undefined) {
            return Q.call(this);
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
            Q.call(this);
            e.length = 0;
            t.notify();
        }
        return undefined;
    },
    delete: function(t) {
        const e = U.get(this);
        if (e === undefined) {
            return X.call(this, t);
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
                const i = X.call(this, t);
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

const et = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const t of Z) {
    u(tt[t], "observing", {
        value: true,
        writable: false,
        configurable: false,
        enumerable: false
    });
}

let rt = false;

const st = "__au_map_on__";

function enableMapObservation() {
    if (!(b(st, Map) ?? false)) {
        w(true, Map, st);
        for (const t of Z) {
            if (G[t].observing !== true) {
                u(G, t, {
                    ...et,
                    value: tt[t]
                });
            }
        }
    }
}

function disableMapObservation() {
    for (const t of Z) {
        if (G[t].observing === true) {
            u(G, t, {
                ...et,
                value: Y[t]
            });
        }
    }
}

class MapObserver {
    constructor(t) {
        this.type = y;
        if (!rt) {
            rt = true;
            enableMapObservation();
        }
        this.collection = t;
        this.indexMap = createIndexMap(t.size);
        this.lenObs = void 0;
        U.set(t, this);
    }
    notify() {
        const t = this.subs;
        const e = this.indexMap;
        if (m) {
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

R(MapObserver);

function getMapObserver(t) {
    let e = U.get(t);
    if (e === void 0) {
        e = new MapObserver(t);
    }
    return e;
}

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

const nt = (() => {
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
        u(r, "obs", {
            get: getObserverRecord
        });
        ensureProto(r, "handleChange", noopHandleChange);
        ensureProto(r, "handleCollectionChange", noopHandleCollectionChange);
        return t;
    };
})();

function connectable(t, e) {
    return t == null ? nt : nt(t, e);
}

class BindingContext {
    constructor(t, e) {
        if (t !== void 0) {
            this[t] = e;
        }
    }
}

class Scope {
    constructor(t, e, r, s) {
        this.parent = t;
        this.bindingContext = e;
        this.overrideContext = r;
        this.isBoundary = s;
    }
    static getContext(t, e, r) {
        if (t == null) {
            throw createMappedError(203);
        }
        let s = t.overrideContext;
        let n = t;
        if (r > 0) {
            while (r > 0) {
                r--;
                n = n.parent;
                if (n == null) {
                    return void 0;
                }
            }
            s = n.overrideContext;
            return e in s ? s : n.bindingContext;
        }
        while (n != null && !n.isBoundary && !(e in n.overrideContext) && !(e in n.bindingContext)) {
            n = n.parent;
        }
        if (n == null) {
            return t.bindingContext;
        }
        s = n.overrideContext;
        return e in s ? s : n.bindingContext;
    }
    static create(t, e, r) {
        if (t == null) {
            throw createMappedError(204);
        }
        return new Scope(null, t, e ?? new OverrideContext, r ?? false);
    }
    static fromParent(t, e) {
        if (t == null) {
            throw createMappedError(203);
        }
        return new Scope(t, e, new OverrideContext, false);
    }
}

class OverrideContext {}

let it = null;

const ot = [];

let ct = false;

function pauseConnecting() {
    ct = false;
}

function resumeConnecting() {
    ct = true;
}

function currentConnectable() {
    return it;
}

function enterConnectable(t) {
    if (t == null) {
        throw createMappedError(206);
    }
    if (it == null) {
        it = t;
        ot[0] = it;
        ct = true;
        return;
    }
    if (it === t) {
        throw createMappedError(207);
    }
    ot.push(t);
    it = t;
    ct = true;
}

function exitConnectable(t) {
    if (t == null) {
        throw createMappedError(208);
    }
    if (it !== t) {
        throw createMappedError(209);
    }
    ot.pop();
    it = ot.length > 0 ? ot[ot.length - 1] : null;
    ct = it != null;
}

const at = /*@__PURE__*/ f({
    get current() {
        return it;
    },
    get connecting() {
        return ct;
    },
    enter: enterConnectable,
    exit: exitConnectable,
    pause: pauseConnecting,
    resume: resumeConnecting
});

const ut = Reflect.get;

const ht = Object.prototype.toString;

const lt = new WeakMap;

const ft = "__au_nw__";

const dt = "__au_nw";

function canWrap(t) {
    switch (ht.call(t)) {
      case "[object Object]":
        return t.constructor[ft] !== true;

      case "[object Array]":
      case "[object Map]":
      case "[object Set]":
        return true;

      default:
        return false;
    }
}

const pt = "__raw__";

function wrap(t) {
    return canWrap(t) ? getProxy(t) : t;
}

function getProxy(t) {
    return lt.get(t) ?? createProxy(t);
}

function getRaw(t) {
    return t[pt] ?? t;
}

function unwrap(t) {
    return canWrap(t) && t[pt] || t;
}

function doNotCollect(t, e) {
    return e === "constructor" || e === "__proto__" || e === "$observers" || e === Symbol.toPrimitive || e === Symbol.toStringTag || t.constructor[`${dt}_${d(e)}__`] === true;
}

function createProxy(t) {
    const e = isArray(t) ? wt : isMap(t) || isSet(t) ? vt : bt;
    const r = new Proxy(t, e);
    lt.set(t, r);
    lt.set(r, r);
    return r;
}

const bt = {
    get(t, e, r) {
        if (e === pt) {
            return t;
        }
        const s = currentConnectable();
        if (!ct || doNotCollect(t, e) || s == null) {
            return ut(t, e, r);
        }
        s.observe(t, e);
        return wrap(ut(t, e, r));
    }
};

const wt = {
    get(t, e, r) {
        if (e === pt) {
            return t;
        }
        if (!ct || doNotCollect(t, e) || it == null) {
            return ut(t, e, r);
        }
        switch (e) {
          case "length":
            it.observe(t, "length");
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
        it.observe(t, e);
        return wrap(ut(t, e, r));
    },
    ownKeys(t) {
        currentConnectable()?.observe(t, "length");
        return Reflect.ownKeys(t);
    }
};

function wrappedArrayMap(t, e) {
    const r = getRaw(this);
    const s = r.map(((r, s) => unwrap(t.call(e, wrap(r), s, this))));
    observeCollection(it, r);
    return wrap(s);
}

function wrappedArrayEvery(t, e) {
    const r = getRaw(this);
    const s = r.every(((r, s) => t.call(e, wrap(r), s, this)));
    observeCollection(it, r);
    return s;
}

function wrappedArrayFilter(t, e) {
    const r = getRaw(this);
    const s = r.filter(((r, s) => unwrap(t.call(e, wrap(r), s, this))));
    observeCollection(it, r);
    return wrap(s);
}

function wrappedArrayIncludes(t) {
    const e = getRaw(this);
    const r = e.includes(unwrap(t));
    observeCollection(it, e);
    return r;
}

function wrappedArrayIndexOf(t) {
    const e = getRaw(this);
    const r = e.indexOf(unwrap(t));
    observeCollection(it, e);
    return r;
}

function wrappedArrayLastIndexOf(t) {
    const e = getRaw(this);
    const r = e.lastIndexOf(unwrap(t));
    observeCollection(it, e);
    return r;
}

function wrappedArrayFindIndex(t, e) {
    const r = getRaw(this);
    const s = r.findIndex(((r, s) => unwrap(t.call(e, wrap(r), s, this))));
    observeCollection(it, r);
    return s;
}

function wrappedArrayFind(t, e) {
    const r = getRaw(this);
    const s = r.find(((e, r) => t(wrap(e), r, this)), e);
    observeCollection(it, r);
    return wrap(s);
}

function wrappedArrayFlat() {
    const t = getRaw(this);
    observeCollection(it, t);
    return wrap(t.flat());
}

function wrappedArrayFlatMap(t, e) {
    const r = getRaw(this);
    observeCollection(it, r);
    return getProxy(r.flatMap(((r, s) => wrap(t.call(e, wrap(r), s, this)))));
}

function wrappedArrayJoin(t) {
    const e = getRaw(this);
    observeCollection(it, e);
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
    observeCollection(it, e);
    return wrap(r);
}

function wrappedArraySome(t, e) {
    const r = getRaw(this);
    const s = r.some(((r, s) => unwrap(t.call(e, wrap(r), s, this))));
    observeCollection(it, r);
    return s;
}

function wrappedArraySort(t) {
    const e = getRaw(this);
    const r = e.sort(t);
    observeCollection(it, e);
    return wrap(r);
}

function wrappedArraySlice(t, e) {
    const r = getRaw(this);
    observeCollection(it, r);
    return getProxy(r.slice(t, e));
}

function wrappedReduce(t, e) {
    const r = getRaw(this);
    const s = r.reduce(((e, r, s) => t(e, wrap(r), s, this)), e);
    observeCollection(it, r);
    return wrap(s);
}

function wrappedReduceRight(t, e) {
    const r = getRaw(this);
    const s = r.reduceRight(((e, r, s) => t(e, wrap(r), s, this)), e);
    observeCollection(it, r);
    return wrap(s);
}

const vt = {
    get(t, e, r) {
        if (e === pt) {
            return t;
        }
        const s = currentConnectable();
        if (!ct || doNotCollect(t, e) || s == null) {
            return ut(t, e, r);
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
        return wrap(ut(t, e, r));
    }
};

function wrappedForEach(t, e) {
    const r = getRaw(this);
    observeCollection(it, r);
    return r.forEach(((r, s) => {
        t.call(e, wrap(r), wrap(s), this);
    }));
}

function wrappedHas(t) {
    const e = getRaw(this);
    observeCollection(it, e);
    return e.has(unwrap(t));
}

function wrappedGet(t) {
    const e = getRaw(this);
    observeCollection(it, e);
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
    observeCollection(it, t);
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
    observeCollection(it, t);
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
    observeCollection(it, t);
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

const gt = /*@__PURE__*/ f({
    getProxy: getProxy,
    getRaw: getRaw,
    wrap: wrap,
    unwrap: unwrap,
    rawKey: pt
});

class ComputedObserver {
    constructor(t, e, r, s, n) {
        this.type = y;
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
            if (!h(t, this.v)) {
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
        if (!h(e, t)) {
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

connectable(ComputedObserver, null);

R(ComputedObserver);

const yt = /*@__PURE__*/ p("IDirtyChecker", void 0);

const Ot = {
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
        t.register(r.singleton(this, this), r.aliasTo(this, yt));
    }
    constructor() {
        this.tracked = [];
        this.O = null;
        this.C = 0;
        this.p = s(n);
        this.check = () => {
            if (Ot.disabled) {
                return;
            }
            if (++this.C < Ot.timeoutsPerCheck) {
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
        R(DirtyCheckProperty);
    }
    createProperty(t, e) {
        if (Ot.throw) {
            throw createError(`AUR0222:${d(e)}`);
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
        this.type = g;
        this.ov = void 0;
        this.A = t;
    }
    getValue() {
        return this.obj[this.key];
    }
    setValue(t) {
        throw createError(`Trying to set value for property ${d(this.key)} in dirty checker`);
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
        this.type = g;
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
        this.type = g;
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
        this.type = y;
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
            if (h(t, this.v)) {
                return;
            }
            Ct = this.v;
            this.v = t;
            this.cb?.(t, Ct);
            this.subs.notify(t, Ct);
        } else {
            this.v = this.o[this.k] = t;
            this.cb?.(t, Ct);
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
            u(this.o, this.k, {
                enumerable: true,
                configurable: true,
                get: l((() => this.getValue()), {
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
            u(this.o, this.k, {
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

R(SetterObserver);

let Ct = void 0;

const At = new PropertyAccessor;

const St = /*@__PURE__*/ p("IObserverLocator", (t => t.singleton(ObserverLocator)));

const mt = /*@__PURE__*/ p("INodeObserverLocator", (t => t.cachedCallback((t => new DefaultNodeObserverLocator))));

class DefaultNodeObserverLocator {
    handles() {
        return false;
    }
    getObserver() {
        return At;
    }
    getAccessor() {
        return At;
    }
}

const Rt = /*@__PURE__*/ p("IComputedObserverLocator", (t => t.singleton(class DefaultLocator {
    getObserver(t, e, r, s) {
        const n = new ComputedObserver(t, r.get, r.set, s, true);
        u(t, e, {
            enumerable: r.enumerable,
            configurable: true,
            get: l((() => n.getValue()), {
                getObserver: () => n
            }),
            set: t => {
                n.setValue(t);
            }
        });
        return n;
    }
})));

class ObserverLocator {
    constructor() {
        this.R = [];
        this.A = s(yt);
        this._ = s(mt);
        this.P = s(Rt);
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
        return At;
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
    createObserver(t, e) {
        if (this._.handles(t, e, this)) {
            return this._.getObserver(t, e, this);
        }
        switch (e) {
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
            if (isArray(t) && i(e)) {
                return getArrayObserver(t).getIndexObserver(Number(e));
            }
            break;
        }
        let r = xt(t, e);
        if (r === void 0) {
            let s = _t(t);
            while (s !== null) {
                r = xt(s, e);
                if (r === void 0) {
                    s = _t(s);
                } else {
                    break;
                }
            }
        }
        if (r !== void 0 && !a.call(r, "value")) {
            let s = this.M(t, e, r);
            if (s == null) {
                s = (r.get?.getObserver)?.(t);
            }
            return s == null ? r.configurable ? this.P.getObserver(t, e, r, this) : this.A.createProperty(t, e) : s;
        }
        return new SetterObserver(t, e);
    }
    M(t, e, r) {
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

const _t = Object.getPrototypeOf;

const xt = Object.getOwnPropertyDescriptor;

const getObserverLookup = t => {
    let e = t.$observers;
    if (e === void 0) {
        u(t, "$observers", {
            enumerable: false,
            value: e = createLookup()
        });
    }
    return e;
};

const Pt = /*@__PURE__*/ p("IObservation", (t => t.singleton(Observation)));

class Observation {
    static get inject() {
        return [ St ];
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

connectable(RunEffect, null);

function getObserversLookup(t) {
    if (t.$observers === void 0) {
        u(t, "$observers", {
            value: {}
        });
    }
    return t.$observers;
}

const Mt = {};

function observable(t, e) {
    if (!SetterNotifier.mixed) {
        SetterNotifier.mixed = true;
        R(SetterNotifier);
    }
    let r = false;
    let s;
    if (typeof t === "object") {
        s = t;
    } else if (t != null) {
        s = {
            name: t
        };
        r = true;
    } else {
        s = o;
    }
    if (arguments.length === 0) {
        return function(t, e) {
            if (e.kind !== "field") throw createMappedError(224);
            return createFieldInitializer(e);
        };
    }
    if (e?.kind === "field") return createFieldInitializer(e);
    if (r) {
        return function(t, e) {
            createDescriptor(t, s.name, (() => Mt), true);
        };
    }
    return function(t, e) {
        switch (e.kind) {
          case "field":
            return createFieldInitializer(e);

          case "class":
            return createDescriptor(t, s.name, (() => Mt), true);

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
    function createDescriptor(t, e, r, n) {
        const i = s.callback || `${d(e)}Changed`;
        const o = s.set;
        const observableGetter = function() {
            const t = getNotifier(this, e, i, r, o);
            currentConnectable()?.subscribeTo(t);
            return t.getValue();
        };
        observableGetter.getObserver = function(t) {
            return getNotifier(t, e, i, r, o);
        };
        const c = {
            enumerable: true,
            configurable: true,
            get: observableGetter,
            set(t) {
                getNotifier(this, e, i, r, o).setValue(t);
            }
        };
        if (n) u(t.prototype, e, c); else u(t, e, c);
    }
}

function getNotifier(t, e, r, s, n) {
    const i = getObserversLookup(t);
    let o = i[e];
    if (o == null) {
        const c = s();
        o = new SetterNotifier(t, r, n, c === Mt ? void 0 : c);
        i[e] = o;
    }
    return o;
}

class SetterNotifier {
    constructor(t, e, r, s) {
        this.type = y;
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
        if (!h(t, this.v)) {
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

function nowrap(t, e) {
    return arguments.length === 0 ? decorator : decorator(t, e);
    function decorator(t, e) {
        switch (e.kind) {
          case "class":
            defineHiddenProp(t, ft, true);
            break;

          case "field":
            e.addInitializer((function() {
                const t = this.constructor;
                const r = `${dt}_${d(e.name)}__`;
                if (r in t) return;
                defineHiddenProp(t, r, true);
            }));
            break;
        }
    }
}

export { A as AccessorType, ArrayIndexObserver, ArrayObserver, BindingContext, BindingObserverRecord, CollectionLengthObserver, CollectionSizeObserver, ComputedObserver, at as ConnectableSwitcher, DirtyCheckProperty, Ot as DirtyCheckSettings, DirtyChecker, v as ICoercionConfiguration, yt as IDirtyChecker, mt as INodeObserverLocator, Pt as IObservation, St as IObserverLocator, MapObserver, Observation, ObserverLocator, PrimitiveObserver, PropertyAccessor, gt as ProxyObservable, Scope, SetObserver, SetterObserver, SubscriberRecord, batch, cloneIndexMap, connectable, copyIndexMap, createIndexMap, disableArrayObservation, disableMapObservation, disableSetObservation, enableArrayObservation, enableMapObservation, enableSetObservation, getCollectionObserver, getObserverLookup, isIndexMap, nowrap, observable, R as subscriberCollection };

