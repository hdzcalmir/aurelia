"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var e = require("@aurelia/platform");

var t = require("@aurelia/kernel");

var n = require("@aurelia/runtime");

var i = require("@aurelia/runtime-html");

var r = require("@aurelia/platform-browser");

var s = require("@aurelia/metadata");

const {getPrototypeOf: o, getOwnPropertyDescriptor: a, getOwnPropertyDescriptors: l, getOwnPropertyNames: u, getOwnPropertySymbols: c, defineProperty: f, defineProperties: h} = Object;

const d = Object.keys;

const p = Object.is;

const m = Object.freeze;

const g = Object.assign;

const b = Number.isNaN;

const v = Reflect.apply;

const x = ArrayBuffer.isView;

function $(e) {
    return (t, ...n) => v(e, t, n);
}

const y = $(Object.prototype.hasOwnProperty);

const w = $(Object.prototype.propertyIsEnumerable);

const k = o(Uint8Array.prototype);

const C = $(a(k, Symbol.toStringTag).get);

const S = $(Object.prototype.toString);

const O = $(RegExp.prototype.toString);

const E = $(Date.prototype.toISOString);

const j = $(Date.prototype.toString);

const A = $(Error.prototype.toString);

const R = $(Date.prototype.getTime);

const q = $(Set.prototype.values);

const M = $(Map.prototype.entries);

const L = $(Boolean.prototype.valueOf);

const T = $(Number.prototype.valueOf);

const z = $(Symbol.prototype.valueOf);

const F = $(String.prototype.valueOf);

function N(e) {
    return "number" === typeof e;
}

function P(e) {
    return "string" === typeof e;
}

function I(e) {
    return "symbol" === typeof e;
}

function B(e) {
    return void 0 === e;
}

function D(e) {
    return null !== e && "object" === typeof e;
}

function U(e) {
    return "function" === typeof e;
}

function V(e) {
    return null === e || "object" !== typeof e && "function" !== typeof e;
}

function H(e) {
    return e instanceof ArrayBuffer;
}

function J(e) {
    return e instanceof ArrayBuffer || "undefined" !== typeof SharedArrayBuffer && e instanceof SharedArrayBuffer;
}

function W(e) {
    return e instanceof Date;
}

function _(e) {
    return e instanceof Map;
}

function G(e) {
    return "[object Map Iterator]" === S(e);
}

function Y(e) {
    return e instanceof RegExp;
}

function K(e) {
    return e instanceof Set;
}

function Q(e) {
    return "[object Set Iterator]" === S(e);
}

function X(e) {
    return e instanceof Error;
}

function Z(e) {
    return e instanceof Number;
}

function ee(e) {
    return e instanceof String;
}

function te(e) {
    return e instanceof Boolean;
}

function ne(e) {
    return e instanceof Symbol;
}

function ie(e) {
    return Z(e) || ee(e) || te(e) || ne(e);
}

function re(e) {
    return void 0 !== C(e);
}

function se(e) {
    return "Uint8Array" === C(e);
}

function oe(e) {
    return "Uint8ClampedArray" === C(e);
}

function ae(e) {
    return "Uint16Array" === C(e);
}

function le(e) {
    return "Uint32Array" === C(e);
}

function ue(e) {
    return "Int8Array" === C(e);
}

function ce(e) {
    return "Int16Array" === C(e);
}

function fe(e) {
    return "Int32Array" === C(e);
}

function he(e) {
    return "Float32Array" === C(e);
}

function de(e) {
    return "Float64Array" === C(e);
}

function pe(e) {
    return "[object Arguments]" === S(e);
}

function me(e) {
    return "[object DataView]" === S(e);
}

function ge(e) {
    return "[object Promise]" === S(e);
}

function be(e) {
    return "[object WeakSet]" === S(e);
}

function ve(e) {
    return "[object WeakMap]" === S(e);
}

function xe(e, n) {
    if (n) return u(e).filter((e => !t.isArrayIndex(e))); else return d(e).filter((e => !t.isArrayIndex(e)));
}

function $e(e, t) {
    return t.filter((t => w(e, t)));
}

const ye = m({
    bold(e) {
        return `[1m${e}[22m`;
    },
    italic(e) {
        return `[3m${e}[23m`;
    },
    underline(e) {
        return `[4m${e}[24m`;
    },
    inverse(e) {
        return `[7m${e}[27m`;
    },
    white(e) {
        return `[37m${e}[39m`;
    },
    grey(e) {
        return `[90m${e}[39m`;
    },
    black(e) {
        return `[30m${e}[39m`;
    },
    blue(e) {
        return `[34m${e}[39m`;
    },
    cyan(e) {
        return `[36m${e}[39m`;
    },
    green(e) {
        return `[32m${e}[39m`;
    },
    magenta(e) {
        return `[35m${e}[39m`;
    },
    red(e) {
        return `[31m${e}[39m`;
    },
    yellow(e) {
        return `[33m${e}[39m`;
    }
});

const we = /\u001b\[\d\d?m/g;

const ke = /[\x00-\x1f\x27\x5c]/;

const Ce = /[\x00-\x1f\x27\x5c]/g;

const Se = /[\x00-\x1f\x5c]/;

const Oe = /[\x00-\x1f\x5c]/g;

function Ee(e) {
    return e.replace(we, "");
}

function je(e, t) {
    let n = "";
    if (0 !== e.length) {
        let i = 0;
        for (;i < e.length - 1; i++) {
            n += e[i];
            n += t;
        }
        n += e[i];
    }
    return n;
}

const Ae = m([ "\\u0000", "\\u0001", "\\u0002", "\\u0003", "\\u0004", "\\u0005", "\\u0006", "\\u0007", "\\b", "\\t", "\\n", "\\u000b", "\\f", "\\r", "\\u000e", "\\u000f", "\\u0010", "\\u0011", "\\u0012", "\\u0013", "\\u0014", "\\u0015", "\\u0016", "\\u0017", "\\u0018", "\\u0019", "\\u001a", "\\u001b", "\\u001c", "\\u001d", "\\u001e", "\\u001f", "", "", "", "", "", "", "", "\\'", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "\\\\" ]);

function Re(e, t) {
    if (-1 === t) return `"${e}"`;
    if (-2 === t) return `\`${e}\``;
    return `'${e}'`;
}

const qe = e => Ae[e.charCodeAt(0)];

function Me(e) {
    let t = ke;
    let n = Ce;
    let i = 39;
    if (e.includes("'")) {
        if (!e.includes('"')) i = -1; else if (!e.includes("`") && !e.includes("${")) i = -2;
        if (39 !== i) {
            t = Se;
            n = Oe;
        }
    }
    if (e.length < 5e3 && !t.test(e)) return Re(e, i);
    if (e.length > 100) {
        e = e.replace(n, qe);
        return Re(e, i);
    }
    let r = "";
    let s = 0;
    let o = 0;
    for (;o < e.length; o++) {
        const t = e.charCodeAt(o);
        if (t === i || 92 === t || t < 32) {
            if (s === o) r += Ae[t]; else r += `${e.slice(s, o)}${Ae[t]}`;
            s = o + 1;
        }
    }
    if (s !== o) r += e.slice(s);
    return Re(r, i);
}

function Le(e) {
    return e.replace(Ce, qe);
}

const Te = function() {
    const e = {};
    return function(t) {
        let n = e[t];
        if (void 0 === n) {
            n = "";
            const i = t.length;
            let r = 0;
            for (let e = 0; e < i; ++e) {
                r = t.charCodeAt(e);
                if (r > 32) n += String.fromCharCode(r);
            }
            e[t] = n;
        }
        return n;
    };
}();

function ze(e, n, i) {
    const r = [];
    function s() {
        r.length = 0;
    }
    let o;
    let a;
    if (void 0 === e) {
        o = function e(...t) {
            r.push(t);
        };
        a = t.noop;
    } else if (void 0 === n) {
        o = function t(...n) {
            r.push(n);
            return e(...n);
        };
        a = t.noop;
    } else {
        if (!(n in e)) throw new Error(`No method named '${String(n)}' exists in object of type ${Reflect.getPrototypeOf(e).constructor.name}`);
        let t = e;
        let s = Reflect.getOwnPropertyDescriptor(t, n);
        while (void 0 === s) {
            t = Reflect.getPrototypeOf(t);
            s = Reflect.getOwnPropertyDescriptor(t, n);
        }
        if (null !== s.value && ("object" === typeof s.value || "function" === typeof s.value) && "function" === typeof s.value.restore) {
            s.value.restore();
            s = Reflect.getOwnPropertyDescriptor(t, n);
        }
        a = function i() {
            if (e === t) Reflect.defineProperty(e, n, s); else Reflect.deleteProperty(e, n);
        };
        if (void 0 === i) o = function e(...t) {
            r.push(t);
        }; else if (true === i) o = function t(...n) {
            r.push(n);
            return s.value.apply(e, n);
        }; else if ("function" === typeof i) o = function e(...t) {
            r.push(t);
            return i(...t);
        }; else throw new Error(`Invalid spy`);
        Reflect.defineProperty(e, n, {
            ...s,
            value: o
        });
    }
    Reflect.defineProperty(o, "calls", {
        value: r
    });
    Reflect.defineProperty(o, "reset", {
        value: s
    });
    Reflect.defineProperty(o, "restore", {
        value: a
    });
    return o;
}

var Fe;

(function(e) {
    e[e["noIterator"] = 0] = "noIterator";
    e[e["isArray"] = 1] = "isArray";
    e[e["isSet"] = 2] = "isSet";
    e[e["isMap"] = 3] = "isMap";
})(Fe || (Fe = {}));

function Ne(e, t) {
    return e.source === t.source && e.flags === t.flags;
}

function Pe(e, t) {
    if (e.byteLength !== t.byteLength) return false;
    const {byteLength: n} = e;
    for (let i = 0; i < n; ++i) if (e[i] !== t[i]) return false;
    return true;
}

function Ie(e, t) {
    if (e === t) return 0;
    const n = e.length;
    const i = t.length;
    const r = Math.min(n, i);
    for (let n = 0; n < r; ++n) if (e[n] !== t[n]) {
        const i = e[n];
        const r = t[n];
        if (i < r) return -1;
        if (r < i) return 1;
        return 0;
    }
    if (n < i) return -1;
    if (i < n) return 1;
    return 0;
}

function Be(e, t) {
    if (e.byteLength !== t.byteLength) return false;
    return 0 === Ie(new Uint8Array(e.buffer, e.byteOffset, e.byteLength), new Uint8Array(t.buffer, t.byteOffset, t.byteLength));
}

function De(e, t) {
    return e.byteLength === t.byteLength && 0 === Ie(new Uint8Array(e), new Uint8Array(t));
}

function Ue(e, t) {
    if (Z(e)) return Z(t) && p(T(e), T(t));
    if (ee(e)) return ee(t) && F(e) === F(t);
    if (te(e)) return te(t) && L(e) === L(t);
    return ne(t) && z(e) === z(t);
}

function Ve(e, t, n, i) {
    if (e === t) {
        if (0 !== e) return true;
        return n ? p(e, t) : true;
    }
    if (n) {
        if ("object" !== typeof e) return N(e) && b(e) && b(t);
        if ("object" !== typeof t || null === e || null === t) return false;
        if (o(e) !== o(t)) return false;
    } else {
        if (!D(e)) {
            if (!D(t)) return e == t;
            return false;
        }
        if (!D(t)) return false;
    }
    const r = S(e);
    const s = S(t);
    if (r !== s) return false;
    if ("[object URLSearchParams]" === r) return Ve(Array.from(e.entries()), Array.from(t.entries()), n, i);
    if (Array.isArray(e)) {
        if (e.length !== t.length) return false;
        const r = xe(e, false);
        const s = xe(t, false);
        if (r.length !== s.length) return false;
        return He(e, t, n, i, 1, r);
    }
    if ("[object Object]" === r) return He(e, t, n, i, 0);
    if (W(e)) {
        if (R(e) !== R(t)) return false;
    } else if (Y(e)) {
        if (!Ne(e, t)) return false;
    } else if (X(e)) {
        if (e.message !== t.message || e.name !== t.name) return false;
    } else if (x(e)) {
        if (!n && (he(e) || de(e))) {
            if (!Pe(e, t)) return false;
        } else if (!Be(e, t)) return false;
        const r = xe(e, false);
        const s = xe(t, false);
        if (r.length !== s.length) return false;
        return He(e, t, n, i, 0, r);
    } else if (K(e)) {
        if (!K(t) || e.size !== t.size) return false;
        return He(e, t, n, i, 2);
    } else if (_(e)) {
        if (!_(t) || e.size !== t.size) return false;
        return He(e, t, n, i, 3);
    } else if (J(e)) {
        if (!De(e, t)) return false;
    } else if (ie(e) && !Ue(e, t)) return false;
    return He(e, t, n, i, 0);
}

function He(e, t, n, i, r, s) {
    if (5 === arguments.length) {
        s = d(e);
        const n = d(t);
        if (s.length !== n.length) return false;
    }
    let o = 0;
    for (;o < s.length; o++) if (!y(t, s[o])) return false;
    if (n && 5 === arguments.length) {
        const n = c(e);
        if (0 !== n.length) {
            let i = 0;
            for (o = 0; o < n.length; o++) {
                const r = n[o];
                if (w(e, r)) {
                    if (!w(t, r)) return false;
                    s.push(r);
                    i++;
                } else if (w(t, r)) return false;
            }
            const r = c(t);
            if (n.length !== r.length && $e(t, r).length !== i) return false;
        } else {
            const e = c(t);
            if (0 !== e.length && 0 !== $e(t, e).length) return false;
        }
    }
    if (0 === s.length && (0 === r || 1 === r && 0 === e.length || 0 === e.size)) return true;
    if (void 0 === i) i = {
        val1: new Map,
        val2: new Map,
        position: 0
    }; else {
        const n = i.val1.get(e);
        if (void 0 !== n) {
            const e = i.val2.get(t);
            if (void 0 !== e) return n === e;
        }
        i.position++;
    }
    i.val1.set(e, i.position);
    i.val2.set(t, i.position);
    const a = Xe(e, t, n, s, i, r);
    i.val1.delete(e);
    i.val2.delete(t);
    return a;
}

function Je(e, t, n, i) {
    for (const r of e) if (Ve(t, r, n, i)) {
        e.delete(r);
        return true;
    }
    return false;
}

function We(e) {
    switch (typeof e) {
      case "undefined":
        return null;

      case "object":
        return;

      case "symbol":
        return false;

      case "string":
        e = +e;

      case "number":
        if (b(e)) return false;
    }
    return true;
}

function _e(e, t, n) {
    const i = We(n);
    if (null != i) return i;
    return t.has(i) && !e.has(i);
}

function Ge(e, t, n, i, r) {
    const s = We(n);
    if (null != s) return s;
    const o = t.get(s);
    if (void 0 === o && !t.has(s) || !Ve(i, o, false, r)) return false;
    return !e.has(s) && Ve(i, o, false, r);
}

function Ye(e, t, n, i) {
    let r = null;
    for (const i of e) if (D(i)) {
        if (null === r) r = new Set;
        r.add(i);
    } else if (!t.has(i)) {
        if (n) return false;
        if (!_e(e, t, i)) return false;
        if (null === r) r = new Set;
        r.add(i);
    }
    if (null !== r) {
        for (const s of t) if (D(s)) {
            if (!Je(r, s, n, i)) return false;
        } else if (!n && !e.has(s) && !Je(r, s, n, i)) return false;
        return 0 === r.size;
    }
    return true;
}

function Ke(e, t, n, i, r, s) {
    for (const o of e) if (Ve(n, o, r, s) && Ve(i, t.get(o), r, s)) {
        e.delete(o);
        return true;
    }
    return false;
}

function Qe(e, t, n, i) {
    let r = null;
    for (const [s, o] of e) if (D(s)) {
        if (null === r) r = new Set;
        r.add(s);
    } else {
        const a = t.get(s);
        if (void 0 === a && !t.has(s) || !Ve(o, a, n, i)) {
            if (n) return false;
            if (!Ge(e, t, s, o, i)) return false;
            if (null === r) r = new Set;
            r.add(s);
        }
    }
    if (null !== r) {
        for (const [s, o] of t) if (D(s)) {
            if (!Ke(r, e, s, o, n, i)) return false;
        } else if (!n && (!e.has(s) || !Ve(e.get(s), o, false, i)) && !Ke(r, e, s, o, false, i)) return false;
        return 0 === r.size;
    }
    return true;
}

function Xe(e, t, n, i, r, s) {
    let o = 0;
    if (2 === s) {
        if (!Ye(e, t, n, r)) return false;
    } else if (3 === s) {
        if (!Qe(e, t, n, r)) return false;
    } else if (1 === s) for (;o < e.length; o++) if (y(e, o)) {
        if (!y(t, o) || !Ve(e[o], t[o], n, r)) return false;
    } else if (y(t, o)) return false; else {
        const i = d(e);
        for (;o < i.length; o++) {
            const s = i[o];
            if (!y(t, s) || !Ve(e[s], t[s], n, r)) return false;
        }
        if (i.length !== d(t).length) return false;
        return true;
    }
    for (o = 0; o < i.length; o++) {
        const s = i[o];
        if (!Ve(e[s], t[s], n, r)) return false;
    }
    return true;
}

function Ze(e, t) {
    return Ve(e, t, false);
}

function et(e, t) {
    return Ve(e, t, true);
}

class TestContext {
    constructor() {
        this.c = void 0;
        this.p = void 0;
        this.t = void 0;
        this.oL = void 0;
        this.i = void 0;
    }
    get wnd() {
        return this.platform.globalThis;
    }
    get doc() {
        return this.platform.document;
    }
    get userAgent() {
        return this.platform.navigator.userAgent;
    }
    get UIEvent() {
        return this.platform.globalThis.UIEvent;
    }
    get Event() {
        return this.platform.globalThis.Event;
    }
    get CustomEvent() {
        return this.platform.globalThis.CustomEvent;
    }
    get Node() {
        return this.platform.globalThis.Node;
    }
    get Element() {
        return this.platform.globalThis.Element;
    }
    get HTMLElement() {
        return this.platform.globalThis.HTMLElement;
    }
    get HTMLDivElement() {
        return this.platform.globalThis.HTMLDivElement;
    }
    get Text() {
        return this.platform.globalThis.Text;
    }
    get Comment() {
        return this.platform.globalThis.Comment;
    }
    get DOMParser() {
        return this.platform.globalThis.DOMParser;
    }
    get container() {
        if (void 0 === this.c) {
            this.c = t.DI.createContainer();
            i.StandardConfiguration.register(this.c);
            this.c.register(t.Registration.instance(TestContext, this));
            if (false === this.c.has(i.IPlatform, true)) this.c.register(exports.PLATFORMRegistration);
        }
        return this.c;
    }
    get platform() {
        if (void 0 === this.p) this.p = this.container.get(i.IPlatform);
        return this.p;
    }
    get templateCompiler() {
        if (void 0 === this.t) this.t = this.container.get(i.ITemplateCompiler);
        return this.t;
    }
    get observerLocator() {
        if (void 0 === this.oL) this.oL = this.container.get(n.IObserverLocator);
        return this.oL;
    }
    get domParser() {
        if (void 0 === this.i) this.i = this.doc.createElement("div");
        return this.i;
    }
    static create() {
        return new TestContext;
    }
    createElementFromMarkup(e) {
        this.domParser.innerHTML = e;
        return this.domParser.firstElementChild;
    }
    createElement(e) {
        return this.doc.createElement(e);
    }
    createAttribute(e, t) {
        const n = this.doc.createAttribute(e);
        n.value = t;
        return n;
    }
    type(e, t, n) {
        const i = e.querySelector(t);
        i.value = n;
        i.dispatchEvent(new this.CustomEvent("change", {
            bubbles: true
        }));
    }
}

exports.PLATFORM = void 0;

exports.PLATFORMRegistration = void 0;

function tt(e) {
    exports.PLATFORM = e;
    exports.PLATFORMRegistration = t.Registration.instance(i.IPlatform, e);
}

function nt(...e) {
    return t.DI.createContainer().register(exports.PLATFORMRegistration, ...e);
}

let it;

let rt;

function st(e) {
    if (void 0 === rt) try {
        function t() {
            t();
        }
        t();
    } catch (e) {
        rt = e.message;
        it = e.name;
    }
    return e.name === it && e.message === rt;
}

const ot = m({
    showHidden: false,
    depth: 2,
    colors: true,
    customInspect: true,
    showProxy: false,
    maxArrayLength: 100,
    breakLength: 60,
    compact: true,
    sorted: false,
    getters: false,
    userOptions: void 0,
    stylize: dt
});

const at = d(ot);

function lt(e) {
    const t = {};
    for (const n of at) t[n] = e[n];
    if (void 0 !== e.userOptions) g(t, e.userOptions);
    return t;
}

function ut(e) {
    const t = {
        ...ot,
        budget: {},
        indentationLvl: 0,
        seen: [],
        currentDepth: 0,
        stylize: e.colors ? dt : pt
    };
    for (const n of at) if (y(e, n)) t[n] = e[n];
    if (void 0 === t.userOptions) t.userOptions = e;
    return t;
}

const ct = m({
    special: "cyan",
    number: "yellow",
    boolean: "yellow",
    undefined: "grey",
    null: "bold",
    string: "green",
    symbol: "green",
    date: "magenta",
    regexp: "red"
});

const ft = m({
    deepStrictEqual: "Expected values to be strictly deep-equal:",
    strictEqual: "Expected values to be strictly equal:",
    strictEqualObject: 'Expected "actual" to be reference-equal to "expected":',
    deepEqual: "Expected values to be loosely deep-equal:",
    equal: "Expected values to be loosely equal:",
    notDeepStrictEqual: 'Expected "actual" not to be strictly deep-equal to:',
    notStrictEqual: 'Expected "actual" to be strictly unequal to:',
    notStrictEqualObject: 'Expected "actual" not to be reference-equal to "expected":',
    notDeepEqual: 'Expected "actual" not to be loosely deep-equal to:',
    notEqual: 'Expected "actual" to be loosely unequal to:',
    notIdentical: "Values identical but not reference-equal:"
});

const ht = Symbol.for("customInspect");

function dt(e, t) {
    const n = ct[t];
    if (P(n)) return ye[n](e); else return e;
}

function pt(e, t) {
    return e;
}

class AssertionError extends Error {
    constructor(e) {
        const {actual: t, expected: n, message: i, operator: r, stackStartFn: s} = e;
        const o = Error.stackTraceLimit;
        Error.stackTraceLimit = 0;
        let a = null == i ? "" : `${i} - `;
        if ("deepStrictEqual" === r || "strictEqual" === r) super(`${a}${gt(t, n, r)}`); else if ("notDeepStrictEqual" === r || "notStrictEqual" === r) {
            let e = ft[r];
            let n = pn(t).split("\n");
            if ("notStrictEqual" === r && D(t)) e = ft.notStrictEqualObject;
            if (n.length > 30) {
                n[26] = ye.blue("...");
                while (n.length > 27) n.pop();
            }
            if (1 === n.length) super(`${a}${e} ${n[0]}`); else super(`${a}${e}\n\n${je(n, "\n")}\n`);
        } else {
            let e = pn(t);
            let i = "";
            const s = ft[r];
            if ("notDeepEqual" === r || "notEqual" === r) {
                e = `${ft[r]}\n\n${e}`;
                if (e.length > 1024) e = `${e.slice(0, 1021)}...`;
            } else {
                i = `${pn(n)}`;
                if (e.length > 512) e = `${e.slice(0, 509)}...`;
                if (i.length > 512) i = `${i.slice(0, 509)}...`;
                if ("deepEqual" === r || "equal" === r) e = `${s}\n\n${e}\n\nshould equal\n\n`; else i = ` ${r} ${i}`;
            }
            if (!r) {
                i = "";
                e = "";
                a = a.slice(0, -3);
            }
            super(`${a}${e}${i}`);
        }
        Error.stackTraceLimit = o;
        this.generatedMessage = !i || "Failed" === i;
        f(this, "name", {
            value: "AssertionError [ERR_ASSERTION]",
            enumerable: false,
            writable: true,
            configurable: true
        });
        this.code = "ERR_ASSERTION";
        this.actual = t;
        this.expected = n;
        this.operator = r;
        if ("function" === typeof Error.captureStackTrace) {
            Error.captureStackTrace(this, s);
            this.stack;
        } else Error().stack;
        this.name = "AssertionError";
    }
    toString() {
        return `${this.name} [${this.code}]: ${this.message}`;
    }
    [ht](e, t) {
        return dn(this, {
            ...t,
            customInspect: false,
            depth: 0
        });
    }
}

const mt = 10;

function gt(e, t, n) {
    let i = "";
    let r = "";
    let s = 0;
    let o = "";
    let a = false;
    const l = pn(e);
    const u = l.split("\n");
    const c = pn(t).split("\n");
    let f = 0;
    let h = "";
    if ("strictEqual" === n && D(e) && D(t)) n = "strictEqualObject";
    if (1 === u.length && 1 === c.length && u[0] !== c[0]) {
        const i = u[0].length + c[0].length;
        if (i <= mt) {
            if (!D(e) && !D(t) && (0 !== e || 0 !== t)) return `${ft[n]}\n\n${u[0]} !== ${c[0]}\n`;
        } else if ("strictEqualObject" !== n && i < 80) {
            while (u[0][f] === c[0][f]) f++;
            if (f > 2) {
                h = `\n  ${" ".repeat(f)}^`;
                f = 0;
            }
        }
    }
    let d = u[u.length - 1];
    let p = c[c.length - 1];
    while (d === p) {
        if (f++ < 2) o = `\n  ${d}${o}`; else i = d;
        u.pop();
        c.pop();
        if (0 === u.length || 0 === c.length) break;
        d = u[u.length - 1];
        p = c[c.length - 1];
    }
    const m = Math.max(u.length, c.length);
    if (0 === m) {
        const e = l.split("\n");
        if (e.length > 30) {
            e[26] = ye.blue("...");
            while (e.length > 27) e.pop();
        }
        return `${ft.notIdentical}\n\n${je(e, "\n")}\n`;
    }
    if (f > 3) {
        o = `\n${ye.blue("...")}${o}`;
        a = true;
    }
    if ("" !== i) {
        o = `\n  ${i}${o}`;
        i = "";
    }
    let g = 0;
    const b = `${ft[n]}\n${ye.green("+ actual")} ${ye.red("- expected")}`;
    const v = ` ${ye.blue("...")} Lines skipped`;
    for (f = 0; f < m; f++) {
        const e = f - s;
        if (u.length < f + 1) {
            if (e > 1 && f > 2) {
                if (e > 4) {
                    r += `\n${ye.blue("...")}`;
                    a = true;
                } else if (e > 3) {
                    r += `\n  ${c[f - 2]}`;
                    g++;
                }
                r += `\n  ${c[f - 1]}`;
                g++;
            }
            s = f;
            i += `\n${ye.red("-")} ${c[f]}`;
            g++;
        } else if (c.length < f + 1) {
            if (e > 1 && f > 2) {
                if (e > 4) {
                    r += `\n${ye.blue("...")}`;
                    a = true;
                } else if (e > 3) {
                    r += `\n  ${u[f - 2]}`;
                    g++;
                }
                r += `\n  ${u[f - 1]}`;
                g++;
            }
            s = f;
            r += `\n${ye.green("+")} ${u[f]}`;
            g++;
        } else {
            const t = c[f];
            let n = u[f];
            let o = n !== t && (!n.endsWith(",") || n.slice(0, -1) !== t);
            if (o && t.endsWith(",") && t.slice(0, -1) === n) {
                o = false;
                n += ",";
            }
            if (o) {
                if (e > 1 && f > 2) {
                    if (e > 4) {
                        r += `\n${ye.blue("...")}`;
                        a = true;
                    } else if (e > 3) {
                        r += `\n  ${u[f - 2]}`;
                        g++;
                    }
                    r += `\n  ${u[f - 1]}`;
                    g++;
                }
                s = f;
                r += `\n${ye.green("+")} ${n}`;
                i += `\n${ye.red("-")} ${t}`;
                g += 2;
            } else {
                r += i;
                i = "";
                if (1 === e || 0 === f) {
                    r += `\n  ${n}`;
                    g++;
                }
            }
        }
        if (g > 1e3 && f < m - 2) return `${b}${v}\n${r}\n${ye.blue("...")}${i}\n${ye.blue("...")}`;
    }
    return `${b}${a ? v : ""}\n${r}${i}${o}${h}`;
}

const bt = 0;

const vt = 1;

const xt = 2;

const $t = new Int8Array(128);

const yt = new Int8Array(128);

for (let e = 0; e < 128; ++e) if (36 === e || 95 === e || e >= 65 && e <= 90 || e >= 97 && e <= 122) $t[e] = yt[e] = 1; else if (e >= 49 && e <= 57) yt[e] = 1;

function wt(e) {
    if (1 !== $t[e.charCodeAt(0)]) return false;
    const {length: t} = e;
    for (let n = 1; n < t; ++n) if (1 !== yt[e.charCodeAt(n)]) return false;
    return true;
}

const kt = {};

const Ct = 16;

const St = 0;

const Ot = 1;

const Et = 2;

function jt(e, t) {
    let n = 0;
    let i = 0;
    let r = 0;
    const s = new Array(t.length);
    for (;r < t.length; r++) {
        const o = e.colors ? Ee(t[r]).length : t[r].length;
        s[r] = o;
        n += o;
        if (i < o) i = o;
    }
    const o = i + 2;
    if (3 * o + e.indentationLvl < e.breakLength && (n / i > 5 || i <= 6)) {
        const n = 2.5;
        const a = 1;
        const l = Math.min(Math.round(Math.sqrt(n * (o - a) * t.length) / (o - a)), 3 * e.compact, 10);
        if (l <= 1) return t;
        const u = [];
        let c = s[0];
        for (r = l; r < s.length; r += l) if (s[r] > c) c = s[r];
        for (r = 0; r < t.length; r += l) {
            let e = t[r].length - s[r];
            let n = t[r].padStart(c + e, " ");
            const o = Math.min(r + l, t.length);
            for (let a = r + 1; a < o; a++) {
                e = t[a].length - s[a];
                n += `, ${t[a].padStart(i + e, " ")}`;
            }
            u.push(n);
        }
        t = u;
    }
    return t;
}

function At(e, t, n, i, r) {
    if (st(t)) {
        e.seen.pop();
        e.indentationLvl = r;
        return e.stylize(`[${It(n, i)}: Inspection interrupted prematurely. Maximum call stack size exceeded.]`, "special");
    }
    throw t;
}

const Rt = m([ "BYTES_PER_ELEMENT", "length", "byteLength", "byteOffset", "buffer" ]);

function qt(e) {
    const t = [];
    for (const [n, i] of e) t.push(n, i);
    return t;
}

function Mt(e, t, n) {
    let i = t.length + n;
    if (i + t.length > e.breakLength) return false;
    for (let n = 0; n < t.length; n++) {
        if (e.colors) i += Ee(t[n]).length; else i += t[n].length;
        if (i > e.breakLength) return false;
    }
    return true;
}

function Lt(e, t, n, i, r = false) {
    if (true !== e.compact) {
        if (r) {
            const r = t.length + e.indentationLvl + i[0].length + n.length + 10;
            if (Mt(e, t, r)) return `${n ? `${n} ` : ""}${i[0]} ${je(t, ", ")} ${i[1]}`;
        }
        const s = `\n${" ".repeat(e.indentationLvl)}`;
        return `${n ? `${n} ` : ""}${i[0]}${s}  ${je(t, `,${s}  `)}${s}${i[1]}`;
    }
    if (Mt(e, t, 0)) return `${i[0]}${n ? ` ${n}` : ""} ${je(t, ", ")} ${i[1]}`;
    const s = " ".repeat(e.indentationLvl);
    const o = "" === n && 1 === i[0].length ? " " : `${n ? ` ${n}` : ""}\n${s}  `;
    return `${i[0]}${o}${je(t, `,\n${s}  `)} ${i[1]}`;
}

function Tt(e, t) {
    let n;
    while (e) {
        const t = a(e, "constructor");
        if (!B(t) && U(t.value) && "" !== t.value.name) return t.value.name;
        e = o(e);
        if (void 0 === n) n = e;
    }
    if (null === n) return null;
    const i = {
        ...t,
        customInspect: false
    };
    return `<${dn(n, i)}>`;
}

function zt() {
    return [];
}

function Ft(e, t, n) {
    if (null === e) {
        if ("" !== t) return `[${n}: null prototype] [${t}] `;
        return `[${n}: null prototype] `;
    }
    if ("" !== t && e !== t) return `${e} [${t}] `;
    return `${e} `;
}

const Nt = Gt.bind(null, pt);

function Pt(e, t) {
    let n;
    const i = c(e);
    if (t) {
        n = u(e);
        if (0 !== i.length) n.push(...i);
    } else {
        n = d(e);
        if (0 !== i.length) n.push(...i.filter((t => w(e, t))));
    }
    return n;
}

function It(e, t) {
    return e || t || "Object";
}

const Bt = m([ [ se, Uint8Array ], [ oe, Uint8ClampedArray ], [ ae, Uint16Array ], [ le, Uint32Array ], [ ue, Int8Array ], [ ce, Int16Array ], [ fe, Int32Array ], [ he, Float32Array ], [ de, Float64Array ] ]);

const Dt = Bt.length;

function Ut(e) {
    for (let t = 0; t < Dt; ++t) {
        const [n, i] = Bt[t];
        if (n(e)) return i;
    }
    return;
}

function Vt(e, t) {
    if (t !== `${e} Iterator`) {
        if ("" !== t) t += "] [";
        t += `${e} Iterator`;
    }
    return [ `[${t}] {`, "}" ];
}

let Ht;

function Jt(e, t) {
    if (void 0 === Ht) Ht = new Map; else {
        const t = Ht.get(e);
        if (void 0 !== t) return t;
    }
    class NullPrototype extends e {
        get [Symbol.toStringTag]() {
            return "";
        }
    }
    f(NullPrototype.prototype.constructor, "name", {
        value: `[${t}: null prototype]`
    });
    Ht.set(e, NullPrototype);
    return NullPrototype;
}

function Wt(e, t, n) {
    let i;
    if (K(t)) {
        const e = Jt(Set, "Set");
        i = new e(q(t));
    } else if (_(t)) {
        const e = Jt(Map, "Map");
        i = new e(M(t));
    } else if (Array.isArray(t)) {
        const e = Jt(Array, "Array");
        i = new e(t.length);
    } else if (re(t)) {
        const e = Ut(t);
        const n = Jt(e, e.name);
        i = new n(t);
    }
    if (void 0 !== i) {
        h(i, l(t));
        return fn(e, i, n);
    }
    return;
}

function _t(e, t) {
    return e(p(t, -0) ? "-0" : `${t}`, "number");
}

function Gt(e, t, n) {
    switch (typeof t) {
      case "string":
        if (true !== n.compact && n.indentationLvl + t.length > n.breakLength && t.length > Ct) {
            const i = n.breakLength - n.indentationLvl;
            const r = Math.max(i, Ct);
            const s = Math.ceil(t.length / r);
            const o = Math.ceil(t.length / s);
            const a = Math.max(o, Ct);
            if (void 0 === kt[a]) kt[a] = new RegExp(`(.|\\n){1,${a}}(\\s|$)|(\\n|.)+?(\\s|$)`, "gm");
            const l = t.match(kt[a]);
            if (l.length > 1) {
                const t = " ".repeat(n.indentationLvl);
                let i = `${e(Me(l[0]), "string")} +\n`;
                let r = 1;
                for (;r < l.length - 1; r++) i += `${t}  ${e(Me(l[r]), "string")} +\n`;
                i += `${t}  ${e(Me(l[r]), "string")}`;
                return i;
            }
        }
        return e(Me(t), "string");

      case "number":
        return _t(e, t);

      case "boolean":
        return e(t.toString(), "boolean");

      case "undefined":
        return e("undefined", "undefined");

      case "symbol":
        return e(t.toString(), "symbol");
    }
    throw new Error(`formatPrimitive only handles non-null primitives. Got: ${S(t)}`);
}

function Yt(e) {
    return e.stack || A(e);
}

function Kt(e, n, i, r, s, o) {
    const a = d(n);
    let l = o;
    for (;o < a.length && s.length < r; o++) {
        const u = a[o];
        const c = +u;
        if (c > 2 ** 32 - 2) break;
        if (`${l}` !== u) {
            if (!t.isArrayIndex(u)) break;
            const n = c - l;
            const i = n > 1 ? "s" : "";
            const o = `<${n} empty item${i}>`;
            s.push(e.stylize(o, "undefined"));
            l = c;
            if (s.length === r) break;
        }
        s.push(cn(e, n, i, u, vt));
        l++;
    }
    const u = n.length - l;
    if (s.length !== r) {
        if (u > 0) {
            const t = u > 1 ? "s" : "";
            const n = `<${u} empty item${t}>`;
            s.push(e.stylize(n, "undefined"));
        }
    } else if (u > 0) s.push(`... ${u} more item${u > 1 ? "s" : ""}`);
    return s;
}

function Qt(e, t) {
    const n = new Uint8Array(t);
    let i = je(n.slice(0, Math.min(e.maxArrayLength, n.length)).map((e => e.toString(16))), " ");
    const r = n.length - e.maxArrayLength;
    if (r > 0) i += ` ... ${r} more byte${r > 1 ? "s" : ""}`;
    return [ `${e.stylize("[Uint8Contents]", "special")}: <${i}>` ];
}

function Xt(e, t, n) {
    const i = t.length;
    const r = Math.min(Math.max(0, e.maxArrayLength), i);
    const s = i - r;
    const o = [];
    for (let i = 0; i < r; i++) {
        if (!y(t, i)) return Kt(e, t, n, r, o, i);
        o.push(cn(e, t, n, i, vt));
    }
    if (s > 0) o.push(`... ${s} more item${s > 1 ? "s" : ""}`);
    return o;
}

function Zt(e, t, n) {
    const i = Math.min(Math.max(0, e.maxArrayLength), t.length);
    const r = t.length - i;
    const s = new Array(i);
    let o = 0;
    for (;o < i; ++o) s[o] = _t(e.stylize, t[o]);
    if (r > 0) s[o] = `... ${r} more item${r > 1 ? "s" : ""}`;
    if (e.showHidden) {
        e.indentationLvl += 2;
        for (const i of Rt) {
            const r = hn(e, t[i], n, true);
            s.push(`[${i}]: ${r}`);
        }
        e.indentationLvl -= 2;
    }
    return s;
}

function en(e, t, n) {
    const i = [];
    e.indentationLvl += 2;
    for (const r of t) i.push(hn(e, r, n));
    e.indentationLvl -= 2;
    if (e.showHidden) i.push(`[size]: ${e.stylize(t.size.toString(), "number")}`);
    return i;
}

function tn(e, t, n) {
    const i = [];
    e.indentationLvl += 2;
    for (const [r, s] of t) i.push(`${hn(e, r, n)} => ${hn(e, s, n)}`);
    e.indentationLvl -= 2;
    if (e.showHidden) i.push(`[size]: ${e.stylize(t.size.toString(), "number")}`);
    return i;
}

function nn(e, t, n, i) {
    const r = Math.max(e.maxArrayLength, 0);
    const s = Math.min(r, n.length);
    const o = new Array(s);
    e.indentationLvl += 2;
    for (let i = 0; i < s; i++) o[i] = hn(e, n[i], t);
    e.indentationLvl -= 2;
    if (i === St) o.sort();
    const a = n.length - s;
    if (a > 0) o.push(`... ${a} more item${a > 1 ? "s" : ""}`);
    return o;
}

function rn(e, t, n, i) {
    const r = Math.max(e.maxArrayLength, 0);
    const s = n.length / 2;
    const o = s - r;
    const a = Math.min(r, s);
    const l = new Array(a);
    let u = "";
    let c = "";
    let f = " => ";
    let h = 0;
    if (i === Et) {
        u = "[ ";
        c = " ]";
        f = ", ";
    }
    e.indentationLvl += 2;
    for (;h < a; h++) {
        const i = 2 * h;
        l[h] = `${u}${hn(e, n[i], t)}` + `${f}${hn(e, n[i + 1], t)}${c}`;
    }
    e.indentationLvl -= 2;
    if (i === St) l.sort();
    if (o > 0) l.push(`... ${o} more item${o > 1 ? "s" : ""}`);
    return l;
}

function sn(e) {
    return [ e.stylize("<items unknown>", "special") ];
}

function on(e, t, n) {
    return nn(e, n, [], St);
}

function an(e, t, n) {
    return rn(e, n, [], St);
}

function ln(e, t, n, i) {
    const r = qt(t.entries());
    if (t instanceof Map) {
        i[0] = i[0].replace(/ Iterator] {$/, " Entries] {");
        return rn(e, n, r, Et);
    }
    return nn(e, n, r, Ot);
}

function un(e, t, n) {
    return [ "[object Promise]" ];
}

function cn(e, t, n, i, r) {
    switch (i) {
      case "$controller":
        return `$controller: { id: ${t.$controller.name} } (omitted for brevity)`;

      case "overrideContext":
        return "overrideContext: (omitted for brevity)";
    }
    let s, o;
    let l = " ";
    const u = a(t, i) || {
        value: t[i],
        enumerable: true
    };
    if (void 0 !== u.value) {
        const t = r !== bt || true !== e.compact ? 2 : 3;
        e.indentationLvl += t;
        o = hn(e, u.value, n);
        if (3 === t) {
            const t = e.colors ? Ee(o).length : o.length;
            if (e.breakLength < t) l = `\n${" ".repeat(e.indentationLvl)}`;
        }
        e.indentationLvl -= t;
    } else if (void 0 !== u.get) {
        const r = void 0 !== u.set ? "Getter/Setter" : "Getter";
        const s = e.stylize;
        const a = "special";
        if (e.getters && (true === e.getters || "get" === e.getters && void 0 === u.set || "set" === e.getters && void 0 !== u.set)) try {
            const l = t[i];
            e.indentationLvl += 2;
            if (null === l) o = `${s(`[${r}:`, a)} ${s("null", "null")}${s("]", a)}`; else if ("object" === typeof l) o = `${s(`[${r}]`, a)} ${hn(e, l, n)}`; else {
                const t = Gt(s, l, e);
                o = `${s(`[${r}:`, a)} ${t}${s("]", a)}`;
            }
            e.indentationLvl -= 2;
        } catch (e) {
            const t = `<Inspection threw (${e.message})>`;
            o = `${s(`[${r}:`, a)} ${t}${s("]", a)}`;
        } else o = e.stylize(`[${r}]`, a);
    } else if (void 0 !== u.set) o = e.stylize("[Setter]", "special"); else o = e.stylize("undefined", "undefined");
    if (r === vt) return o;
    if (I(i)) {
        const t = Le(i.toString());
        s = `[${e.stylize(t, "symbol")}]`;
    } else if (false === u.enumerable) s = `[${Le(i.toString())}]`; else if (wt(i)) s = e.stylize(i, "name"); else s = e.stylize(Me(i), "string");
    return `${s}:${l}${o}`;
}

function fn(e, t, n, i) {
    let r;
    const s = Tt(t, e);
    switch (s) {
      case "Container":
      case "ObserverLocator":
      case "Window":
        return e.stylize(`${s} (omitted for brevity)`, "special");

      case "Function":
        if ("Node" === t.name) return e.stylize("Node constructor (omitted for brevity)", "special");
    }
    let o = t[Symbol.toStringTag];
    if (!P(o)) o = "";
    let a = "";
    let l = zt;
    let u;
    let c = true;
    let f = 0;
    let h = bt;
    if (t[Symbol.iterator]) {
        c = false;
        if (Array.isArray(t)) {
            r = xe(t, e.showHidden);
            const n = Ft(s, o, "Array");
            u = [ `${"Array " === n ? "" : n}[`, "]" ];
            if (0 === t.length && 0 === r.length) return `${u[0]}]`;
            h = xt;
            l = Xt;
        } else if (K(t)) {
            r = Pt(t, e.showHidden);
            const n = Ft(s, o, "Set");
            if (0 === t.size && 0 === r.length) return `${n}{}`;
            u = [ `${n}{`, "}" ];
            l = en;
        } else if (_(t)) {
            r = Pt(t, e.showHidden);
            const n = Ft(s, o, "Map");
            if (0 === t.size && 0 === r.length) return `${n}{}`;
            u = [ `${n}{`, "}" ];
            l = tn;
        } else if (re(t)) {
            r = xe(t, e.showHidden);
            const n = null !== s ? Ft(s, o) : Ft(s, o, Ut(t).name);
            u = [ `${n}[`, "]" ];
            if (0 === t.length && 0 === r.length && !e.showHidden) return `${u[0]}]`;
            l = Zt;
            h = xt;
        } else if (G(t)) {
            r = Pt(t, e.showHidden);
            u = Vt("Map", o);
            l = ln;
        } else if (Q(t)) {
            r = Pt(t, e.showHidden);
            u = Vt("Set", o);
            l = ln;
        } else c = true;
    }
    if (c) {
        r = Pt(t, e.showHidden);
        u = [ "{", "}" ];
        if ("Object" === s) {
            if (pe(t)) u[0] = "[Arguments] {"; else if ("" !== o) u[0] = `${Ft(s, o, "Object")}{`;
            if (0 === r.length) return `${u[0]}}`;
        } else if (U(t)) {
            const n = s || o || "Function";
            let i = `${n}`;
            if (t.name && P(t.name)) i += `: ${t.name}`;
            if (0 === r.length) return e.stylize(`[${i}]`, "special");
            a = `[${i}]`;
        } else if (Y(t)) {
            a = O(null !== s ? t : new RegExp(t));
            const i = Ft(s, o, "RegExp");
            if ("RegExp " !== i) a = `${i}${a}`;
            if (0 === r.length || n > e.depth && null !== e.depth) return e.stylize(a, "regexp");
        } else if (W(t)) {
            a = Number.isNaN(R(t)) ? j(t) : E(t);
            const n = Ft(s, o, "Date");
            if ("Date " !== n) a = `${n}${a}`;
            if (0 === r.length) return e.stylize(a, "date");
        } else if (X(t)) {
            a = Yt(t);
            const n = a.indexOf("\n    at");
            if (-1 === n) a = `[${a}]`;
            if (0 !== e.indentationLvl) {
                const n = " ".repeat(e.indentationLvl);
                a = Yt(t).replace(/\n/g, `\n${n}`);
            }
            if (0 === r.length) return a;
            if (false === e.compact && -1 !== n) {
                u[0] += `${a.slice(n)}`;
                a = `[${a.slice(0, n)}]`;
            }
        } else if (J(t)) {
            const n = H(t) ? "ArrayBuffer" : "SharedArrayBuffer";
            const a = Ft(s, o, n);
            if (void 0 === i) l = Qt; else if (0 === r.length) return `${a}{ byteLength: ${_t(e.stylize, t.byteLength)} }`;
            u[0] = `${a}{`;
            r.unshift("byteLength");
        } else if (me(t)) {
            u[0] = `${Ft(s, o, "DataView")}{`;
            r.unshift("byteLength", "byteOffset", "buffer");
        } else if (ge(t)) {
            u[0] = `${Ft(s, o, "Promise")}{`;
            l = un;
        } else if (be(t)) {
            u[0] = `${Ft(s, o, "WeakSet")}{`;
            l = e.showHidden ? on : sn;
        } else if (ve(t)) {
            u[0] = `${Ft(s, o, "WeakMap")}{`;
            l = e.showHidden ? an : sn;
        } else if (ie(t)) {
            let n;
            if (Z(t)) {
                a = `[Number: ${Nt(T(t), e)}]`;
                n = "number";
            } else if (ee(t)) {
                a = `[String: ${Nt(F(t), e)}]`;
                n = "string";
                r = r.slice(t.length);
            } else if (te(t)) {
                a = `[Boolean: ${Nt(L(t), e)}]`;
                n = "boolean";
            } else {
                a = `[Symbol: ${Nt(z(t), e)}]`;
                n = "symbol";
            }
            if (0 === r.length) return e.stylize(a, n);
        } else {
            if (null === s) {
                const i = Wt(e, t, n);
                if (i) return i;
            }
            if (G(t)) {
                u = Vt("Map", o);
                l = ln;
            } else if (Q(t)) {
                u = Vt("Set", o);
                l = ln;
            } else if (0 === r.length) return `${Ft(s, o, "Object")}{}`; else u[0] = `${Ft(s, o, "Object")}{`;
        }
    }
    if (n > e.depth && null !== e.depth) return e.stylize(`[${It(s, o)}]`, "special");
    n += 1;
    e.seen.push(t);
    e.currentDepth = n;
    let d;
    const p = e.indentationLvl;
    try {
        d = l(e, t, n, r, u);
        let i;
        const s = null != exports.PLATFORM?.Node && !(t instanceof exports.PLATFORM.Node);
        for (f = 0; f < r.length; f++) {
            i = r[f];
            if ((s || "textContent" === i || "outerHTML" === i) && "$$calls" !== i) d.push(cn(e, t, n, r[f], h));
        }
    } catch (t) {
        return At(e, t, s, o, p);
    }
    e.seen.pop();
    if (e.sorted) {
        const t = true === e.sorted ? void 0 : e.sorted;
        if (h === bt) d.sort(t); else if (r.length > 1) {
            const e = d.slice(d.length - r.length).sort(t);
            d.splice(d.length - r.length, r.length, ...e);
        }
    }
    let m = false;
    if (N(e.compact)) {
        const t = d.length;
        if (h === xt && d.length > 6) d = jt(e, d);
        if (e.currentDepth - n < e.compact && t === d.length) m = true;
    }
    const g = Lt(e, d, a, u, m);
    const b = e.budget[e.indentationLvl] || 0;
    const v = b + g.length;
    e.budget[e.indentationLvl] = v;
    if (v > 2 ** 27) e.stop = true;
    return g;
}

function hn(e, t, n, i) {
    if ("object" !== typeof t && "function" !== typeof t) return Gt(e.stylize, t, e);
    if (null === t) return e.stylize("null", "null");
    if (void 0 !== e.stop) {
        const n = Tt(t, e) || t[Symbol.toStringTag];
        return e.stylize(`[${n || "Object"}]`, "special");
    }
    if (e.customInspect) {
        const i = t[ht];
        if (U(i) && i !== dn && !(t.constructor && t.constructor.prototype === t)) {
            const r = null === e.depth ? null : e.depth - n;
            const s = i.call(t, r, lt(e));
            if (s !== t) {
                if (!P(s)) return hn(e, s, n);
                return s.replace(/\n/g, `\n${" ".repeat(e.indentationLvl)}`);
            }
        }
    }
    if (e.seen.includes(t)) return e.stylize("[Circular]", "special");
    return fn(e, t, n, i);
}

function dn(e, t = {}) {
    const n = ut(t);
    return hn(n, e, 0);
}

function pn(e) {
    return dn(e, {
        compact: false,
        customInspect: false,
        depth: 100,
        maxArrayLength: 1 / 0,
        showHidden: false,
        breakLength: 1 / 0,
        showProxy: false,
        sorted: true,
        getters: true
    });
}

function mn(e, t, n, i, r) {
    if (void 0 === n) n = 0;
    if ("object" !== typeof t || null === t) {
        mi.strictEqual(e, t, `actual, depth=${n}, prop=${i}, index=${r}`);
        return;
    }
    if (t instanceof Array) {
        for (let r = 0; r < t.length; r++) mn(e[r], t[r], n + 1, i, r);
        return;
    }
    if (t.nodeType > 0) {
        if (11 === t.nodeType) for (let r = 0; r < t.childNodes.length; r++) mn(e.childNodes.item(r), t.childNodes.item(r), n + 1, i, r); else mi.strictEqual(e.outerHTML, t.outerHTML, `actual.outerHTML, depth=${n}, prop=${i}, index=${r}`);
        return;
    }
    if (e) {
        mi.strictEqual(e.constructor.name, t.constructor.name, `actual.constructor.name, depth=${n}, prop=${i}, index=${r}`);
        mi.strictEqual(e.toString(), t.toString(), `actual.toString(), depth=${n}, prop=${i}, index=${r}`);
        for (const i of Object.keys(t)) mn(e[i], t[i], n + 1, i, r);
    }
}

function gn(e, t) {
    const n = t.parentNode ?? t.host ?? null;
    if (null === n || n === e) return null;
    return n.nextSibling ?? gn(e, n);
}

function bn(e, t) {
    return i.CustomElement.for(t, {
        optional: true
    })?.shadowRoot?.firstChild ?? t.firstChild ?? t.nextSibling ?? gn(e, t);
}

function vn(e, t) {
    let n = "";
    let r = i.CustomElement.for(e, {
        optional: true
    })?.shadowRoot?.firstChild ?? e.firstChild;
    while (null !== r) {
        if (3 === r.nodeType) n += r.data;
        r = bn(e, r);
    }
    return t && n ? n.replace(/\s\s+/g, " ").trim() : n;
}

function xn(e) {
    switch (e) {
      case "ha":
        return "textBinding";

      case "rf":
        return "interpolation";

      case "rg":
        return "propertyBinding";

      case "rk":
        return "iteratorBinding";

      case "hb":
        return "listenerBinding";

      case "rj":
        return "refBinding";

      case "hd":
        return "stylePropertyBinding";

      case "re":
        return "setProperty";

      case "he":
        return "setAttribute";

      case "ra":
        return "hydrateElement";

      case "rb":
        return "hydrateAttribute";

      case "rc":
        return "hydrateTemplateController";

      case "rd":
        return "hydrateLetElement";

      case "ri":
        return "letBinding";

      default:
        return e;
    }
}

function $n(e, t, n, i) {
    if (void 0 === i) i = "instruction";
    if (void 0 === n) n = [];
    if (!(t instanceof Object) || !(e instanceof Object)) if (e !== t) if (i.endsWith(".name")) {
        if ("unnamed" === String(t) && String(e).startsWith("unnamed-")) n.push(`OK   : ${i} === ${t} (${e})`);
    } else if (i.endsWith(".key")) {
        if (String(t).endsWith("unnamed") && /unnamed-\d+$/.test(String(e))) n.push(`OK   : ${i} === ${t} (${e})`);
    } else {
        if ("object" === typeof t && null != t) t = JSON.stringify(t);
        if ("object" === typeof e && null != e) e = JSON.stringify(e);
        if (i.endsWith("type")) {
            t = xn(t);
            e = xn(e);
        }
        n.push(`WRONG: ${i} === ${e} (expected: ${t})`);
    } else n.push(`OK   : ${i} === ${t}`); else if (t instanceof Array) for (let r = 0, s = Math.max(t.length, e.length); r < s; ++r) $n(e[r], t[r], n, `${i}[${r}]`); else if (t.nodeType > 0) if (11 === t.nodeType) for (let r = 0, s = Math.max(t.childNodes.length, e.childNodes.length); r < s; ++r) $n(e.childNodes.item(r), t.childNodes.item(r), n, `${i}.childNodes[${r}]`); else if (e.outerHTML !== t["outerHTML"]) n.push(`WRONG: ${i}.outerHTML === ${e.outerHTML} (expected: ${t["outerHTML"]})`); else n.push(`OK   : ${i}.outerHTML === ${t}`); else if (e) {
        const r = {};
        for (const s in t) {
            $n(e[s], t[s], n, `${i}.${s}`);
            r[s] = true;
        }
        for (const s in e) if (!r[s]) $n(e[s], t[s], n, `${i}.${s}`);
    }
    if ("instruction" === i && n.some((e => e.startsWith("W")))) throw new Error(`Failed assertion: binding instruction mismatch\n  - ${n.join("\n  - ")}`);
}

function yn(t) {
    if (!t) t = r.BrowserPlatform.getOrCreate(globalThis);
    e.ensureEmpty(t.taskQueue);
    e.ensureEmpty(t.domWriteQueue);
    e.ensureEmpty(t.domReadQueue);
}

const wn = Symbol("noException");

function kn(e) {
    if (X(e.message)) throw e.message;
    throw new AssertionError(e);
}

function Cn(e, t, n, i) {
    if (!n) {
        let r = false;
        if (0 === t) {
            r = true;
            i = "No value argument passed to `assert.ok()`";
        } else if (X(i)) throw i;
        const s = new AssertionError({
            actual: n,
            expected: true,
            message: i,
            operator: "==",
            stackStartFn: e
        });
        s.generatedMessage = r;
        throw s;
    }
}

class Comparison {
    constructor(e, t, n) {
        for (const i of t) if (i in e) if (!B(n) && P(n[i]) && Y(e[i]) && e[i].test(n[i])) this[i] = n[i]; else this[i] = e[i];
    }
}

function Sn(e, t, n, i, r) {
    if (!(n in e) || !et(e[n], t[n])) {
        if (!i) {
            const n = new Comparison(e, r);
            const i = new Comparison(t, r, e);
            const s = new AssertionError({
                actual: n,
                expected: i,
                operator: "deepStrictEqual",
                stackStartFn: qn
            });
            s.actual = e;
            s.expected = t;
            s.operator = "throws";
            throw s;
        }
        kn({
            actual: e,
            expected: t,
            message: i,
            operator: "throws",
            stackStartFn: qn
        });
    }
}

function On(e, t, n) {
    if (!U(t)) {
        if (Y(t)) return t.test(e);
        if (V(e)) {
            const i = new AssertionError({
                actual: e,
                expected: t,
                message: n,
                operator: "deepStrictEqual",
                stackStartFn: qn
            });
            i.operator = "throws";
            throw i;
        }
        const i = d(t);
        if (X(t)) i.push("name", "message");
        for (const r of i) {
            if (P(e[r]) && Y(t[r]) && t[r].test(e[r])) continue;
            Sn(e, t, r, n, i);
        }
        return true;
    }
    if (void 0 !== t.prototype && e instanceof t) return true;
    if (Object.prototype.isPrototypeOf.call(Error, t)) return false;
    return true === t.call({}, e);
}

function En(e) {
    try {
        e();
    } catch (e) {
        return e;
    }
    return wn;
}

async function jn(e) {
    let t;
    if (U(e)) t = e(); else t = e;
    try {
        await t;
    } catch (e) {
        return e;
    }
    return wn;
}

function An(e, t, n, i) {
    if (P(n)) {
        i = n;
        n = void 0;
    }
    if (t === wn) {
        let t = "";
        if (n && n.name) t += ` (${n.name})`;
        t += i ? `: ${i}` : ".";
        const r = "rejects" === e.name ? "rejection" : "exception";
        kn({
            actual: void 0,
            expected: n,
            operator: e.name,
            message: `Missing expected ${r}${t}`,
            stackStartFn: e
        });
    }
    if (n && false === On(t, n, i)) throw t;
}

function Rn(e, t, n, i) {
    if (t === wn) return;
    if (P(n)) {
        i = n;
        n = void 0;
    }
    if (!n || On(t, n)) {
        const r = i ? `: ${i}` : ".";
        const s = "doesNotReject" === e.name ? "rejection" : "exception";
        kn({
            actual: t,
            expected: n,
            operator: e.name,
            message: `Got unwanted ${s}${r}\nActual message: "${t && t.message}"`,
            stackStartFn: e
        });
    }
    throw t;
}

function qn(e, t, n) {
    An(qn, En(e), t, n);
}

async function Mn(e, t, n) {
    An(Mn, await jn(e), t, n);
}

function Ln(e, t, n) {
    Rn(Ln, En(e), t, n);
}

async function Tn(e, t, n) {
    Rn(Tn, await jn(e), t, n);
}

function zn(...e) {
    Cn(zn, e.length, ...e);
}

function Fn(e = "Failed") {
    if (X(e)) throw e;
    const t = new AssertionError({
        message: e,
        actual: void 0,
        expected: void 0,
        operator: "fail",
        stackStartFn: Fn
    });
    t.generatedMessage = "Failed" === e;
    throw t;
}

function Nn(e, t, n) {
    const i = vn(e);
    if (i !== t) kn({
        actual: i,
        expected: t,
        message: n,
        operator: "==",
        stackStartFn: Nn
    });
}

function Pn(e, t, n) {
    if (e != t) kn({
        actual: e,
        expected: t,
        message: n,
        operator: "==",
        stackStartFn: Pn
    });
}

function In(e, t, n) {
    if (typeof e !== t) kn({
        actual: e,
        expected: t,
        message: n,
        operator: "typeof",
        stackStartFn: In
    });
}

function Bn(e, t, n) {
    if (!(e instanceof t)) kn({
        actual: e,
        expected: t,
        message: n,
        operator: "instanceOf",
        stackStartFn: Bn
    });
}

function Dn(e, t, n) {
    if (e instanceof t) kn({
        actual: e,
        expected: t,
        message: n,
        operator: "notInstanceOf",
        stackStartFn: Dn
    });
}

function Un(e, t, n) {
    if (!e.includes(t)) kn({
        actual: e,
        expected: t,
        message: n,
        operator: "includes",
        stackStartFn: Un
    });
}

function Vn(e, t, n) {
    if (e.includes(t)) kn({
        actual: e,
        expected: t,
        message: n,
        operator: "notIncludes",
        stackStartFn: Vn
    });
}

function Hn(e, t, n) {
    if (!e.contains(t)) kn({
        actual: e,
        expected: t,
        message: n,
        operator: "contains",
        stackStartFn: Hn
    });
}

function Jn(e, t, n) {
    if (e.contains(t)) kn({
        actual: e,
        expected: t,
        message: n,
        operator: "notContains",
        stackStartFn: Jn
    });
}

function Wn(e, t, n) {
    if (!(e > t)) kn({
        actual: e,
        expected: t,
        message: n,
        operator: "greaterThan",
        stackStartFn: Wn
    });
}

function _n(e, t, n) {
    if (!(e >= t)) kn({
        actual: e,
        expected: t,
        message: n,
        operator: "greaterThanOrEqualTo",
        stackStartFn: _n
    });
}

function Gn(e, t, n) {
    if (!(e < t)) kn({
        actual: e,
        expected: t,
        message: n,
        operator: "lessThan",
        stackStartFn: Gn
    });
}

function Yn(e, t, n) {
    if (!(e <= t)) kn({
        actual: e,
        expected: t,
        message: n,
        operator: "lessThanOrEqualTo",
        stackStartFn: Yn
    });
}

function Kn(e, t, n) {
    if (e == t) kn({
        actual: e,
        expected: t,
        message: n,
        operator: "!=",
        stackStartFn: Kn
    });
}

function Qn(e, t, n) {
    if (!Ze(e, t)) kn({
        actual: e,
        expected: t,
        message: n,
        operator: "deepEqual",
        stackStartFn: Qn
    });
}

function Xn(e, t, n) {
    if (Ze(e, t)) kn({
        actual: e,
        expected: t,
        message: n,
        operator: "notDeepEqual",
        stackStartFn: Xn
    });
}

function Zn(e, t, n) {
    if (!et(e, t)) kn({
        actual: e,
        expected: t,
        message: n,
        operator: "deepStrictEqual",
        stackStartFn: Zn
    });
}

function ei(e, t, n) {
    if (et(e, t)) kn({
        actual: e,
        expected: t,
        message: n,
        operator: "notDeepStrictEqual",
        stackStartFn: ei
    });
}

function ti(e, t, n) {
    if (!p(e, t)) kn({
        actual: e,
        expected: t,
        message: n,
        operator: "strictEqual",
        stackStartFn: ti
    });
}

function ni(e, t, n) {
    if (p(e, t)) kn({
        actual: e,
        expected: t,
        message: n,
        operator: "notStrictEqual",
        stackStartFn: ni
    });
}

function ii(e, t, n) {
    if (!t.test(e)) kn({
        actual: e,
        expected: t,
        message: n,
        operator: "match",
        stackStartFn: ii
    });
}

function ri(e, t, n) {
    if (t.test(e)) kn({
        actual: e,
        expected: t,
        message: n,
        operator: "notMatch",
        stackStartFn: ri
    });
}

function si(e, t) {
    if (!i.CustomElement.isType(e)) kn({
        actual: false,
        expected: true,
        message: t,
        operator: "isCustomElementType",
        stackStartFn: si
    });
}

function oi(e, t) {
    if (!i.CustomAttribute.isType(e)) kn({
        actual: false,
        expected: true,
        message: t,
        operator: "isCustomAttributeType",
        stackStartFn: si
    });
}

function ai(e, t = exports.PLATFORM.document) {
    return "string" === typeof e ? t.querySelector(e) : e;
}

function li(e, t, n, i) {
    const r = ai(e, i);
    const s = r && vn(r, true);
    if (s !== t) kn({
        actual: s,
        expected: t,
        message: n,
        operator: "==",
        stackStartFn: li
    });
}

function ui(e, t, n, i) {
    const r = ai(e, i);
    const s = r instanceof HTMLInputElement && r.value;
    if (s !== t) kn({
        actual: s,
        expected: t,
        message: n,
        operator: "==",
        stackStartFn: ui
    });
}

function ci(e, t, n, i, r = true) {
    const s = ai(e, i);
    let o = s.innerHTML;
    if (r) o = o.replace(/<!--au-start-->/g, "").replace(/<!--au-end-->/g, "").replace(/\s+/g, " ").trim();
    if (o !== t) kn({
        actual: o,
        expected: t,
        message: n,
        operator: "==",
        stackStartFn: ci
    });
}

function fi(e, t) {
    const n = exports.PLATFORM.window.getComputedStyle(e);
    for (const [e, i] of Object.entries(t)) {
        const t = n[e];
        if (t !== i) return {
            isMatch: false,
            property: e,
            actual: t,
            expected: i
        };
    }
    return {
        isMatch: true
    };
}

function hi(e, t, n) {
    const i = fi(e, t);
    if (!i.isMatch) {
        const {property: e, actual: t, expected: r} = i;
        kn({
            actual: `${e}:${t}`,
            expected: `${e}:${r}`,
            message: n,
            operator: "==",
            stackStartFn: hi
        });
    }
}

function di(e, t, n) {
    const i = fi(e, t);
    if (i.isMatch) {
        const e = Object.entries(t).map((([e, t]) => `${e}:${t}`)).join(",");
        kn({
            actual: e,
            expected: e,
            message: n,
            operator: "!=",
            stackStartFn: di
        });
    }
}

const pi = function() {
    function t(e) {
        return (10 * e + .5 | 0) / 10;
    }
    function n(e) {
        const n = e.id;
        const i = t(e.createdTime);
        const r = t(e.queueTime);
        const s = e.preempt;
        const o = e.reusable;
        const a = e.persistent;
        const l = e.status;
        return `    task id=${n} createdTime=${i} queueTime=${r} preempt=${s} reusable=${o} persistent=${a} status=${l}\n` + `    task callback="${e.callback?.toString()}"`;
    }
    function i(t, i) {
        const {processing: r, pending: s, delayed: o, flushRequested: a} = e.reportTaskQueue(i);
        let l = `${t} has processing=${r.length} pending=${s.length} delayed=${o.length} flushRequested=${a}\n\n`;
        if (r.length > 0) l += `  Tasks in processing:\n${r.map(n).join("")}`;
        if (s.length > 0) l += `  Tasks in pending:\n${s.map(n).join("")}`;
        if (o.length > 0) l += `  Tasks in delayed:\n${o.map(n).join("")}`;
        return l;
    }
    return function e(t) {
        const n = r.BrowserPlatform.getOrCreate(globalThis);
        const s = n.domWriteQueue;
        const o = n.taskQueue;
        const a = n.domReadQueue;
        let l = true;
        let u = "";
        if (!s.isEmpty) {
            u += `\n${i("domWriteQueue", s)}\n\n`;
            l = false;
        }
        if (!o.isEmpty) {
            u += `\n${i("taskQueue", o)}\n\n`;
            l = false;
        }
        if (!a.isEmpty) {
            u += `\n${i("domReadQueue", a)}\n\n`;
            l = false;
        }
        if (!l) {
            if (true === t) yn(n);
            kn({
                actual: void 0,
                expected: void 0,
                message: u,
                operator: "",
                stackStartFn: e
            });
        }
    };
}();

const mi = m({
    throws: qn,
    doesNotThrow: Ln,
    rejects: Mn,
    doesNotReject: Tn,
    ok: zn,
    fail: Fn,
    equal: Pn,
    typeOf: In,
    instanceOf: Bn,
    notInstanceOf: Dn,
    includes: Un,
    notIncludes: Vn,
    contains: Hn,
    notContains: Jn,
    greaterThan: Wn,
    greaterThanOrEqualTo: _n,
    lessThan: Gn,
    lessThanOrEqualTo: Yn,
    notEqual: Kn,
    deepEqual: Qn,
    notDeepEqual: Xn,
    deepStrictEqual: Zn,
    notDeepStrictEqual: ei,
    strictEqual: ti,
    notStrictEqual: ni,
    match: ii,
    notMatch: ri,
    visibleTextEqual: Nn,
    areTaskQueuesEmpty: pi,
    isCustomElementType: si,
    isCustomAttributeType: oi,
    strict: {
        deepEqual: Zn,
        notDeepEqual: ei,
        equal: ti,
        notEqual: ni
    },
    html: {
        textContent: li,
        innerEqual: ci,
        value: ui,
        computedStyle: hi,
        notComputedStyle: di
    }
});

const gi = {
    "align-content": {
        values: [ "baseline", "center", "end", "first baseline", "flex-end", "flex-start", "inherit", "initial", "last baseline", "normal", "safe", "space-around", "space-between", "space-evenly", "start", "stretch", "unsafe", "unset" ]
    },
    "align-items": {
        values: [ "baseline", "center", "end", "first baseline", "flex-end", "flex-start", "inherit", "initial", "last baseline", "normal", "safe", "self-end", "self-start", "start", "stretch", "unsafe", "unset" ]
    },
    "align-self": {
        values: [ "auto", "baseline", "center", "end", "first baseline", "flex-end", "flex-start", "inherit", "initial", "last baseline", "normal", "safe", "self-end", "self-start", "start", "stretch", "unsafe", "unset" ]
    },
    all: {
        values: [ "inherit", "initial", "unset" ]
    },
    animation: {
        values: [ "alternate", "alternate-reverse", "backwards", "both", "cubic-bezier", "ease", "ease-in", "ease-in-out", "ease-out", "forwards", "frames", "infinite", "inherit", "initial", "linear", "none", "normal", "paused", "reverse", "running", "step-end", "step-start", "steps", "unset" ]
    },
    "animation-delay": {
        values: [ "inherit", "initial", "unset" ]
    },
    "animation-direction": {
        values: [ "alternate", "alternate-reverse", "inherit", "initial", "normal", "reverse", "unset" ]
    },
    "animation-duration": {
        values: [ "inherit", "initial", "unset" ]
    },
    "animation-fill-mode": {
        values: [ "backwards", "both", "forwards", "inherit", "initial", "none", "unset" ]
    },
    "animation-iteration-count": {
        values: [ "infinite", "inherit", "initial", "unset" ]
    },
    "animation-name": {
        values: [ "inherit", "initial", "none", "unset" ]
    },
    "animation-play-state": {
        values: [ "inherit", "initial", "paused", "running", "unset" ]
    },
    "animation-timing-function": {
        values: [ "cubic-bezier", "ease", "ease-in", "ease-in-out", "ease-out", "frames", "inherit", "initial", "linear", "step-end", "step-start", "steps", "unset" ]
    },
    "backface-visibility": {
        values: [ "hidden", "inherit", "initial", "unset", "visible" ]
    },
    background: {
        values: [ "COLOR", "auto", "border-box", "bottom", "center", "contain", "content-box", "cover", "currentColor", "fixed", "hsl", "hsla", "inherit", "initial", "left", "linear-gradient", "local", "no-repeat", "none", "padding-box", "radial-gradient", "repeat", "repeat-x", "repeat-y", "repeating-linear-gradient", "repeating-radial-gradient", "rgb", "rgba", "right", "round", "scroll", "space", "text", "top", "transparent", "unset", "url" ]
    },
    "background-attachment": {
        values: [ "fixed", "inherit", "initial", "local", "scroll", "unset" ]
    },
    "background-blend-mode": {
        values: [ "color", "color-burn", "color-dodge", "darken", "difference", "exclusion", "hard-light", "hue", "inherit", "initial", "lighten", "luminosity", "multiply", "normal", "overlay", "saturation", "screen", "soft-light", "unset" ]
    },
    "background-clip": {
        values: [ "border-box", "content-box", "inherit", "initial", "padding-box", "text", "unset" ]
    },
    "background-color": {
        values: [ "COLOR", "currentColor", "hsl", "hsla", "inherit", "initial", "rgb", "rgba", "transparent", "unset" ]
    },
    "background-image": {
        values: [ "inherit", "initial", "linear-gradient", "none", "radial-gradient", "repeating-linear-gradient", "repeating-radial-gradient", "unset", "url" ]
    },
    "background-origin": {
        values: [ "border-box", "content-box", "inherit", "initial", "padding-box", "unset" ]
    },
    "background-position": {
        values: [ "bottom", "center", "inherit", "initial", "left", "right", "top", "unset" ]
    },
    "background-position-x": {
        values: [ "center", "inherit", "initial", "left", "right", "unset" ]
    },
    "background-position-y": {
        values: [ "bottom", "center", "inherit", "initial", "top", "unset" ]
    },
    "background-repeat": {
        values: [ "inherit", "initial", "no-repeat", "repeat", "repeat-x", "repeat-y", "round", "space", "unset" ]
    },
    "background-size": {
        values: [ "auto", "contain", "cover", "inherit", "initial", "unset" ]
    },
    "block-size": {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    border: {
        values: [ "COLOR", "currentColor", "dashed", "dotted", "double", "groove", "hidden", "hsl", "hsla", "inherit", "initial", "inset", "medium", "none", "outset", "rgb", "rgba", "ridge", "solid", "thick", "thin", "transparent", "unset" ]
    },
    "border-block-end": {
        values: [ "COLOR", "currentColor", "dashed", "dotted", "double", "groove", "hidden", "hsl", "hsla", "inherit", "initial", "inset", "medium", "none", "outset", "rgb", "rgba", "ridge", "solid", "thick", "thin", "transparent", "unset" ]
    },
    "border-block-end-color": {
        values: [ "COLOR", "currentColor", "hsl", "hsla", "inherit", "initial", "rgb", "rgba", "transparent", "unset" ]
    },
    "border-block-end-style": {
        values: [ "dashed", "dotted", "double", "groove", "hidden", "inherit", "initial", "inset", "none", "outset", "ridge", "solid", "unset" ]
    },
    "border-block-end-width": {
        values: [ "inherit", "initial", "medium", "thick", "thin", "unset" ]
    },
    "border-block-start": {
        values: [ "COLOR", "currentColor", "dashed", "dotted", "double", "groove", "hidden", "hsl", "hsla", "inherit", "initial", "inset", "medium", "none", "outset", "rgb", "rgba", "ridge", "solid", "thick", "thin", "transparent", "unset" ]
    },
    "border-block-start-color": {
        values: [ "COLOR", "currentColor", "hsl", "hsla", "inherit", "initial", "rgb", "rgba", "transparent", "unset" ]
    },
    "border-block-start-style": {
        values: [ "dashed", "dotted", "double", "groove", "hidden", "inherit", "initial", "inset", "none", "outset", "ridge", "solid", "unset" ]
    },
    "border-block-start-width": {
        values: [ "inherit", "initial", "medium", "thick", "thin", "unset" ]
    },
    "border-bottom": {
        values: [ "COLOR", "currentColor", "dashed", "dotted", "double", "groove", "hidden", "hsl", "hsla", "inherit", "initial", "inset", "medium", "none", "outset", "rgb", "rgba", "ridge", "solid", "thick", "thin", "transparent", "unset" ]
    },
    "border-bottom-color": {
        values: [ "COLOR", "currentColor", "hsl", "hsla", "inherit", "initial", "rgb", "rgba", "transparent", "unset" ]
    },
    "border-bottom-left-radius": {
        values: [ "inherit", "initial", "unset" ]
    },
    "border-bottom-right-radius": {
        values: [ "inherit", "initial", "unset" ]
    },
    "border-bottom-style": {
        values: [ "dashed", "dotted", "double", "groove", "hidden", "inherit", "initial", "inset", "none", "outset", "ridge", "solid", "unset" ]
    },
    "border-bottom-width": {
        values: [ "inherit", "initial", "medium", "thick", "thin", "unset" ]
    },
    "border-collapse": {
        values: [ "collapse", "inherit", "initial", "separate", "unset" ]
    },
    "border-color": {
        values: [ "COLOR", "currentColor", "hsl", "hsla", "inherit", "initial", "rgb", "rgba", "transparent", "unset" ]
    },
    "border-image": {
        values: [ "auto", "fill", "inherit", "initial", "linear-gradient", "none", "radial-gradient", "repeat", "repeating-linear-gradient", "repeating-radial-gradient", "round", "space", "stretch", "unset", "url" ]
    },
    "border-image-outset": {
        values: [ "inherit", "initial", "unset" ]
    },
    "border-image-repeat": {
        values: [ "inherit", "initial", "repeat", "round", "space", "stretch", "unset" ]
    },
    "border-image-slice": {
        values: [ "fill", "inherit", "initial", "unset" ]
    },
    "border-image-source": {
        values: [ "inherit", "initial", "linear-gradient", "none", "radial-gradient", "repeating-linear-gradient", "repeating-radial-gradient", "unset", "url" ]
    },
    "border-image-width": {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    "border-inline-end": {
        values: [ "COLOR", "currentColor", "dashed", "dotted", "double", "groove", "hidden", "hsl", "hsla", "inherit", "initial", "inset", "medium", "none", "outset", "rgb", "rgba", "ridge", "solid", "thick", "thin", "transparent", "unset" ]
    },
    "border-inline-end-color": {
        values: [ "COLOR", "currentColor", "hsl", "hsla", "inherit", "initial", "rgb", "rgba", "transparent", "unset" ]
    },
    "border-inline-end-style": {
        values: [ "dashed", "dotted", "double", "groove", "hidden", "inherit", "initial", "inset", "none", "outset", "ridge", "solid", "unset" ]
    },
    "border-inline-end-width": {
        values: [ "inherit", "initial", "medium", "thick", "thin", "unset" ]
    },
    "border-inline-start": {
        values: [ "COLOR", "currentColor", "dashed", "dotted", "double", "groove", "hidden", "hsl", "hsla", "inherit", "initial", "inset", "medium", "none", "outset", "rgb", "rgba", "ridge", "solid", "thick", "thin", "transparent", "unset" ]
    },
    "border-inline-start-color": {
        values: [ "COLOR", "currentColor", "hsl", "hsla", "inherit", "initial", "rgb", "rgba", "transparent", "unset" ]
    },
    "border-inline-start-style": {
        values: [ "dashed", "dotted", "double", "groove", "hidden", "inherit", "initial", "inset", "none", "outset", "ridge", "solid", "unset" ]
    },
    "border-inline-start-width": {
        values: [ "inherit", "initial", "medium", "thick", "thin", "unset" ]
    },
    "border-left": {
        values: [ "COLOR", "currentColor", "dashed", "dotted", "double", "groove", "hidden", "hsl", "hsla", "inherit", "initial", "inset", "medium", "none", "outset", "rgb", "rgba", "ridge", "solid", "thick", "thin", "transparent", "unset" ]
    },
    "border-left-color": {
        values: [ "COLOR", "currentColor", "hsl", "hsla", "inherit", "initial", "rgb", "rgba", "transparent", "unset" ]
    },
    "border-left-style": {
        values: [ "dashed", "dotted", "double", "groove", "hidden", "inherit", "initial", "inset", "none", "outset", "ridge", "solid", "unset" ]
    },
    "border-left-width": {
        values: [ "inherit", "initial", "medium", "thick", "thin", "unset" ]
    },
    "border-radius": {
        values: [ "inherit", "initial", "unset" ]
    },
    "border-right": {
        values: [ "COLOR", "currentColor", "dashed", "dotted", "double", "groove", "hidden", "hsl", "hsla", "inherit", "initial", "inset", "medium", "none", "outset", "rgb", "rgba", "ridge", "solid", "thick", "thin", "transparent", "unset" ]
    },
    "border-right-color": {
        values: [ "COLOR", "currentColor", "hsl", "hsla", "inherit", "initial", "rgb", "rgba", "transparent", "unset" ]
    },
    "border-right-style": {
        values: [ "dashed", "dotted", "double", "groove", "hidden", "inherit", "initial", "inset", "none", "outset", "ridge", "solid", "unset" ]
    },
    "border-right-width": {
        values: [ "inherit", "initial", "medium", "thick", "thin", "unset" ]
    },
    "border-spacing": {
        values: [ "inherit", "initial", "unset" ]
    },
    "border-style": {
        values: [ "dashed", "dotted", "double", "groove", "hidden", "inherit", "initial", "inset", "none", "outset", "ridge", "solid", "unset" ]
    },
    "border-top": {
        values: [ "COLOR", "currentColor", "dashed", "dotted", "double", "groove", "hidden", "hsl", "hsla", "inherit", "initial", "inset", "medium", "none", "outset", "rgb", "rgba", "ridge", "solid", "thick", "thin", "transparent", "unset" ]
    },
    "border-top-color": {
        values: [ "COLOR", "currentColor", "hsl", "hsla", "inherit", "initial", "rgb", "rgba", "transparent", "unset" ]
    },
    "border-top-left-radius": {
        values: [ "inherit", "initial", "unset" ]
    },
    "border-top-right-radius": {
        values: [ "inherit", "initial", "unset" ]
    },
    "border-top-style": {
        values: [ "dashed", "dotted", "double", "groove", "hidden", "inherit", "initial", "inset", "none", "outset", "ridge", "solid", "unset" ]
    },
    "border-top-width": {
        values: [ "inherit", "initial", "medium", "thick", "thin", "unset" ]
    },
    "border-width": {
        values: [ "inherit", "initial", "medium", "thick", "thin", "unset" ]
    },
    bottom: {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    "box-decoration-break": {
        values: [ "clone", "inherit", "initial", "slice", "unset" ]
    },
    "box-shadow": {
        values: [ "COLOR", "currentColor", "hsl", "hsla", "inherit", "initial", "inset", "none", "rgb", "rgba", "transparent", "unset" ]
    },
    "box-sizing": {
        values: [ "border-box", "content-box", "inherit", "initial", "unset" ]
    },
    "caption-side": {
        values: [ "bottom", "bottom-outside", "inherit", "initial", "left", "right", "top", "top-outside", "unset" ]
    },
    "caret-color": {
        values: [ "COLOR", "auto", "currentColor", "hsl", "hsla", "inherit", "initial", "rgb", "rgba", "transparent", "unset" ]
    },
    clear: {
        values: [ "both", "inherit", "initial", "inline-end", "inline-start", "left", "none", "right", "unset" ]
    },
    clip: {
        values: [ "auto", "inherit", "initial", "rect", "unset" ]
    },
    "clip-path": {
        values: [ "border-box", "circle", "content-box", "ellipse", "fill-box", "inherit", "initial", "inset", "margin-box", "none", "padding-box", "polygon", "stroke-box", "unset", "url", "view-box" ]
    },
    "clip-rule": {
        values: [ "evenodd", "inherit", "initial", "nonzero", "unset" ]
    },
    color: {
        values: [ "COLOR", "currentColor", "hsl", "hsla", "inherit", "initial", "rgb", "rgba", "transparent", "unset" ]
    },
    "color-adjust": {
        values: [ "economy", "exact", "inherit", "initial", "unset" ]
    },
    "color-interpolation": {
        values: [ "auto", "inherit", "initial", "linearrgb", "srgb", "unset" ]
    },
    "color-interpolation-filters": {
        values: [ "auto", "inherit", "initial", "linearrgb", "srgb", "unset" ]
    },
    "column-count": {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    "column-fill": {
        values: [ "auto", "balance", "inherit", "initial", "unset" ]
    },
    "column-gap": {
        values: [ "inherit", "initial", "normal", "unset" ]
    },
    "column-rule": {
        values: [ "COLOR", "currentColor", "dashed", "dotted", "double", "groove", "hidden", "hsl", "hsla", "inherit", "initial", "inset", "medium", "none", "outset", "rgb", "rgba", "ridge", "solid", "thick", "thin", "transparent", "unset" ]
    },
    "column-rule-color": {
        values: [ "COLOR", "currentColor", "hsl", "hsla", "inherit", "initial", "rgb", "rgba", "transparent", "unset" ]
    },
    "column-rule-style": {
        values: [ "dashed", "dotted", "double", "groove", "hidden", "inherit", "initial", "inset", "none", "outset", "ridge", "solid", "unset" ]
    },
    "column-rule-width": {
        values: [ "inherit", "initial", "medium", "thick", "thin", "unset" ]
    },
    "column-width": {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    columns: {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    content: {
        values: [ "attr", "close-quote", "counter", "counters", "inherit", "initial", "no-close-quote", "no-open-quote", "none", "normal", "open-quote", "unset", "url" ]
    },
    "counter-increment": {
        values: [ "inherit", "initial", "none", "unset" ]
    },
    "counter-reset": {
        values: [ "inherit", "initial", "none", "unset" ]
    },
    cursor: {
        values: [ "alias", "all-scroll", "auto", "cell", "col-resize", "context-menu", "copy", "crosshair", "default", "e-resize", "ew-resize", "grab", "grabbing", "help", "inherit", "initial", "move", "n-resize", "ne-resize", "nesw-resize", "no-drop", "none", "not-allowed", "ns-resize", "nw-resize", "nwse-resize", "pointer", "progress", "row-resize", "s-resize", "se-resize", "sw-resize", "text", "unset", "url", "vertical-text", "w-resize", "wait", "zoom-in", "zoom-out" ]
    },
    direction: {
        values: [ "inherit", "initial", "ltr", "rtl", "unset" ]
    },
    display: {
        values: [ "block", "contents", "flex", "flow-root", "grid", "inherit", "initial", "inline", "inline-block", "inline-flex", "inline-grid", "inline-table", "list-item", "none", "ruby", "ruby-base", "ruby-base-container", "ruby-text", "ruby-text-container", "table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row", "table-row-group", "unset" ]
    },
    "dominant-baseline": {
        values: [ "alphabetic", "auto", "central", "hanging", "ideographic", "inherit", "initial", "mathematical", "middle", "no-change", "reset-size", "text-after-edge", "text-before-edge", "unset", "use-script" ]
    },
    "empty-cells": {
        values: [ "hide", "inherit", "initial", "show", "unset" ]
    },
    fill: {
        values: [ "COLOR", "context-fill", "context-stroke", "currentColor", "hsl", "hsla", "inherit", "initial", "none", "rgb", "rgba", "transparent", "unset", "url" ]
    },
    "fill-opacity": {
        values: [ "context-fill-opacity", "context-stroke-opacity", "inherit", "initial", "unset" ]
    },
    "fill-rule": {
        values: [ "evenodd", "inherit", "initial", "nonzero", "unset" ]
    },
    filter: {
        values: [ "blur", "brightness", "contrast", "drop-shadow", "grayscale", "hue-rotate", "inherit", "initial", "invert", "none", "opacity", "saturate", "sepia", "unset", "url" ]
    },
    flex: {
        values: [ "auto", "content", "inherit", "initial", "unset" ]
    },
    "flex-basis": {
        values: [ "auto", "content", "inherit", "initial", "unset" ]
    },
    "flex-direction": {
        values: [ "column", "column-reverse", "inherit", "initial", "row", "row-reverse", "unset" ]
    },
    "flex-flow": {
        values: [ "column", "column-reverse", "inherit", "initial", "nowrap", "row", "row-reverse", "unset", "wrap", "wrap-reverse" ]
    },
    "flex-grow": {
        values: [ "inherit", "initial", "unset" ]
    },
    "flex-shrink": {
        values: [ "inherit", "initial", "unset" ]
    },
    "flex-wrap": {
        values: [ "inherit", "initial", "nowrap", "unset", "wrap", "wrap-reverse" ]
    },
    float: {
        values: [ "inherit", "initial", "inline-end", "inline-start", "left", "none", "right", "unset" ]
    },
    "flood-color": {
        values: [ "COLOR", "currentColor", "hsl", "hsla", "inherit", "initial", "rgb", "rgba", "transparent", "unset" ]
    },
    "flood-opacity": {
        values: [ "inherit", "initial", "unset" ]
    },
    font: {
        values: [ "all-petite-caps", "all-small-caps", "bold", "bolder", "caption", "condensed", "expanded", "extra-condensed", "extra-expanded", "icon", "inherit", "initial", "italic", "large", "larger", "lighter", "medium", "menu", "message-box", "normal", "oblique", "petite-caps", "semi-condensed", "semi-expanded", "small", "small-caps", "small-caption", "smaller", "status-bar", "titling-caps", "ultra-condensed", "ultra-expanded", "unicase", "unset", "x-large", "x-small", "xx-large", "xx-small" ]
    },
    "font-family": {
        values: [ "inherit", "initial", "unset" ]
    },
    "font-feature-settings": {
        values: [ "inherit", "initial", "normal", "unset" ]
    },
    "font-kerning": {
        values: [ "auto", "inherit", "initial", "none", "normal", "unset" ]
    },
    "font-language-override": {
        values: [ "inherit", "initial", "normal", "unset" ]
    },
    "font-optical-sizing": {
        values: [ "auto", "inherit", "initial", "none", "unset" ]
    },
    "font-size": {
        values: [ "inherit", "initial", "large", "larger", "medium", "small", "smaller", "unset", "x-large", "x-small", "xx-large", "xx-small" ]
    },
    "font-size-adjust": {
        values: [ "inherit", "initial", "none", "unset" ]
    },
    "font-stretch": {
        values: [ "condensed", "expanded", "extra-condensed", "extra-expanded", "inherit", "initial", "normal", "semi-condensed", "semi-expanded", "ultra-condensed", "ultra-expanded", "unset" ]
    },
    "font-style": {
        values: [ "inherit", "initial", "italic", "normal", "oblique", "unset" ]
    },
    "font-synthesis": {
        values: [ "inherit", "initial", "style", "unset", "weight" ]
    },
    "font-variant": {
        values: [ "all-petite-caps", "all-small-caps", "annotation", "character-variant", "common-ligatures", "contextual", "diagonal-fractions", "discretionary-ligatures", "full-width", "historical-forms", "historical-ligatures", "inherit", "initial", "jis04", "jis78", "jis83", "jis90", "lining-nums", "no-common-ligatures", "no-contextual", "no-discretionary-ligatures", "no-historical-ligatures", "none", "normal", "oldstyle-nums", "ordinal", "ornaments", "petite-caps", "proportional-nums", "proportional-width", "ruby", "simplified", "slashed-zero", "small-caps", "stacked-fractions", "styleset", "stylistic", "sub", "super", "swash", "tabular-nums", "titling-caps", "traditional", "unicase", "unset" ]
    },
    "font-variant-alternates": {
        values: [ "annotation", "character-variant", "historical-forms", "inherit", "initial", "normal", "ornaments", "styleset", "stylistic", "swash", "unset" ]
    },
    "font-variant-caps": {
        values: [ "all-petite-caps", "all-small-caps", "inherit", "initial", "normal", "petite-caps", "small-caps", "titling-caps", "unicase", "unset" ]
    },
    "font-variant-east-asian": {
        values: [ "full-width", "inherit", "initial", "jis04", "jis78", "jis83", "jis90", "normal", "proportional-width", "ruby", "simplified", "traditional", "unset" ]
    },
    "font-variant-ligatures": {
        values: [ "common-ligatures", "contextual", "discretionary-ligatures", "historical-ligatures", "inherit", "initial", "no-common-ligatures", "no-contextual", "no-discretionary-ligatures", "no-historical-ligatures", "none", "normal", "unset" ]
    },
    "font-variant-numeric": {
        values: [ "diagonal-fractions", "inherit", "initial", "lining-nums", "normal", "oldstyle-nums", "ordinal", "proportional-nums", "slashed-zero", "stacked-fractions", "tabular-nums", "unset" ]
    },
    "font-variant-position": {
        values: [ "inherit", "initial", "normal", "sub", "super", "unset" ]
    },
    "font-variation-settings": {
        values: [ "inherit", "initial", "normal", "unset" ]
    },
    "font-weight": {
        values: [ "bold", "bolder", "inherit", "initial", "lighter", "normal", "unset" ]
    },
    gap: {
        values: [ "inherit", "initial", "normal", "unset" ]
    },
    grid: {
        values: [ "auto", "column", "dense", "fit-content", "inherit", "initial", "max-content", "min-content", "minmax", "none", "repeat", "row", "unset" ]
    },
    "grid-area": {
        values: [ "inherit", "initial", "unset" ]
    },
    "grid-auto-columns": {
        values: [ "auto", "fit-content", "inherit", "initial", "max-content", "min-content", "minmax", "unset" ]
    },
    "grid-auto-flow": {
        values: [ "column", "dense", "inherit", "initial", "row", "unset" ]
    },
    "grid-auto-rows": {
        values: [ "auto", "fit-content", "inherit", "initial", "max-content", "min-content", "minmax", "unset" ]
    },
    "grid-column": {
        values: [ "inherit", "initial", "unset" ]
    },
    "grid-column-end": {
        values: [ "inherit", "initial", "unset" ]
    },
    "grid-column-gap": {
        values: [ "inherit", "initial", "normal", "unset" ]
    },
    "grid-column-start": {
        values: [ "inherit", "initial", "unset" ]
    },
    "grid-gap": {
        values: [ "inherit", "initial", "normal", "unset" ]
    },
    "grid-row": {
        values: [ "inherit", "initial", "unset" ]
    },
    "grid-row-end": {
        values: [ "inherit", "initial", "unset" ]
    },
    "grid-row-gap": {
        values: [ "inherit", "initial", "normal", "unset" ]
    },
    "grid-row-start": {
        values: [ "inherit", "initial", "unset" ]
    },
    "grid-template": {
        values: [ "auto", "fit-content", "inherit", "initial", "max-content", "min-content", "minmax", "none", "repeat", "unset" ]
    },
    "grid-template-areas": {
        values: [ "inherit", "initial", "none", "unset" ]
    },
    "grid-template-columns": {
        values: [ "auto", "fit-content", "inherit", "initial", "max-content", "min-content", "minmax", "none", "repeat", "unset" ]
    },
    "grid-template-rows": {
        values: [ "auto", "fit-content", "inherit", "initial", "max-content", "min-content", "minmax", "none", "repeat", "unset" ]
    },
    height: {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    hyphens: {
        values: [ "auto", "inherit", "initial", "manual", "none", "unset" ]
    },
    "image-orientation": {
        values: [ "from-image", "inherit", "initial", "none", "unset" ]
    },
    "image-rendering": {
        values: [ "auto", "inherit", "initial", "optimizequality", "optimizespeed", "unset" ]
    },
    "ime-mode": {
        values: [ "active", "auto", "disabled", "inactive", "inherit", "initial", "normal", "unset" ]
    },
    "inline-size": {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    "inset-block-end": {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    "inset-block-start": {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    "inset-inline-end": {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    "inset-inline-start": {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    isolation: {
        values: [ "auto", "inherit", "initial", "isolate", "unset" ]
    },
    "justify-content": {
        values: [ "center", "end", "flex-end", "flex-start", "inherit", "initial", "left", "normal", "right", "safe", "space-around", "space-between", "space-evenly", "start", "stretch", "unsafe", "unset" ]
    },
    "justify-items": {
        values: [ "baseline", "center", "end", "first baseline", "flex-end", "flex-start", "inherit", "initial", "last baseline", "left", "legacy", "normal", "right", "safe", "self-end", "self-start", "start", "stretch", "unsafe", "unset" ]
    },
    "justify-self": {
        values: [ "auto", "baseline", "center", "end", "first baseline", "flex-end", "flex-start", "inherit", "initial", "last baseline", "left", "normal", "right", "safe", "self-end", "self-start", "start", "stretch", "unsafe", "unset" ]
    },
    left: {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    "letter-spacing": {
        values: [ "inherit", "initial", "normal", "unset" ]
    },
    "lighting-color": {
        values: [ "COLOR", "currentColor", "hsl", "hsla", "inherit", "initial", "rgb", "rgba", "transparent", "unset" ]
    },
    "line-height": {
        values: [ "inherit", "initial", "normal", "unset" ]
    },
    "list-style": {
        values: [ "arabic-indic", "armenian", "bengali", "cambodian", "circle", "cjk-decimal", "cjk-earthly-branch", "cjk-heavenly-stem", "cjk-ideographic", "decimal", "decimal-leading-zero", "devanagari", "disc", "disclosure-closed", "disclosure-open", "ethiopic-numeric", "georgian", "gujarati", "gurmukhi", "hebrew", "hiragana", "hiragana-iroha", "inherit", "initial", "inside", "japanese-formal", "japanese-informal", "kannada", "katakana", "katakana-iroha", "khmer", "korean-hangul-formal", "korean-hanja-formal", "korean-hanja-informal", "lao", "lower-alpha", "lower-armenian", "lower-greek", "lower-latin", "lower-roman", "malayalam", "mongolian", "myanmar", "none", "oriya", "outside", "persian", "simp-chinese-formal", "simp-chinese-informal", "square", "symbols", "tamil", "telugu", "thai", "tibetan", "trad-chinese-formal", "trad-chinese-informal", "unset", "upper-alpha", "upper-armenian", "upper-latin", "upper-roman", "url" ]
    },
    "list-style-image": {
        values: [ "inherit", "initial", "none", "unset", "url" ]
    },
    "list-style-position": {
        values: [ "inherit", "initial", "inside", "outside", "unset" ]
    },
    "list-style-type": {
        values: [ "arabic-indic", "armenian", "bengali", "cambodian", "circle", "cjk-decimal", "cjk-earthly-branch", "cjk-heavenly-stem", "cjk-ideographic", "decimal", "decimal-leading-zero", "devanagari", "disc", "disclosure-closed", "disclosure-open", "ethiopic-numeric", "georgian", "gujarati", "gurmukhi", "hebrew", "hiragana", "hiragana-iroha", "inherit", "initial", "japanese-formal", "japanese-informal", "kannada", "katakana", "katakana-iroha", "khmer", "korean-hangul-formal", "korean-hanja-formal", "korean-hanja-informal", "lao", "lower-alpha", "lower-armenian", "lower-greek", "lower-latin", "lower-roman", "malayalam", "mongolian", "myanmar", "none", "oriya", "persian", "simp-chinese-formal", "simp-chinese-informal", "square", "symbols", "tamil", "telugu", "thai", "tibetan", "trad-chinese-formal", "trad-chinese-informal", "unset", "upper-alpha", "upper-armenian", "upper-latin", "upper-roman" ]
    },
    margin: {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    "margin-block-end": {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    "margin-block-start": {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    "margin-bottom": {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    "margin-inline-end": {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    "margin-inline-start": {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    "margin-left": {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    "margin-right": {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    "margin-top": {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    marker: {
        values: [ "inherit", "initial", "none", "unset", "url" ]
    },
    "marker-end": {
        values: [ "inherit", "initial", "none", "unset", "url" ]
    },
    "marker-mid": {
        values: [ "inherit", "initial", "none", "unset", "url" ]
    },
    "marker-start": {
        values: [ "inherit", "initial", "none", "unset", "url" ]
    },
    mask: {
        values: [ "add", "alpha", "auto", "border-box", "bottom", "center", "contain", "content-box", "cover", "exclude", "fill-box", "inherit", "initial", "intersect", "left", "linear-gradient", "luminance", "match-source", "no-clip", "no-repeat", "none", "padding-box", "radial-gradient", "repeat", "repeat-x", "repeat-y", "repeating-linear-gradient", "repeating-radial-gradient", "right", "round", "space", "stroke-box", "subtract", "top", "unset", "url", "view-box" ]
    },
    "mask-clip": {
        values: [ "border-box", "content-box", "fill-box", "inherit", "initial", "no-clip", "padding-box", "stroke-box", "unset", "view-box" ]
    },
    "mask-composite": {
        values: [ "add", "exclude", "inherit", "initial", "intersect", "subtract", "unset" ]
    },
    "mask-image": {
        values: [ "inherit", "initial", "linear-gradient", "none", "radial-gradient", "repeating-linear-gradient", "repeating-radial-gradient", "unset", "url" ]
    },
    "mask-mode": {
        values: [ "alpha", "inherit", "initial", "luminance", "match-source", "unset" ]
    },
    "mask-origin": {
        values: [ "border-box", "content-box", "fill-box", "inherit", "initial", "padding-box", "stroke-box", "unset", "view-box" ]
    },
    "mask-position": {
        values: [ "bottom", "center", "inherit", "initial", "left", "right", "top", "unset" ]
    },
    "mask-position-x": {
        values: [ "center", "inherit", "initial", "left", "right", "unset" ]
    },
    "mask-position-y": {
        values: [ "bottom", "center", "inherit", "initial", "top", "unset" ]
    },
    "mask-repeat": {
        values: [ "inherit", "initial", "no-repeat", "repeat", "repeat-x", "repeat-y", "round", "space", "unset" ]
    },
    "mask-size": {
        values: [ "auto", "contain", "cover", "inherit", "initial", "unset" ]
    },
    "mask-type": {
        values: [ "alpha", "inherit", "initial", "luminance", "unset" ]
    },
    "max-block-size": {
        values: [ "inherit", "initial", "none", "unset" ]
    },
    "max-height": {
        values: [ "inherit", "initial", "none", "unset" ]
    },
    "max-inline-size": {
        values: [ "inherit", "initial", "none", "unset" ]
    },
    "max-width": {
        values: [ "inherit", "initial", "none", "unset" ]
    },
    "min-block-size": {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    "min-height": {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    "min-inline-size": {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    "min-width": {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    "mix-blend-mode": {
        values: [ "color", "color-burn", "color-dodge", "darken", "difference", "exclusion", "hard-light", "hue", "inherit", "initial", "lighten", "luminosity", "multiply", "normal", "overlay", "saturation", "screen", "soft-light", "unset" ]
    },
    "object-fit": {
        values: [ "contain", "cover", "fill", "inherit", "initial", "none", "scale-down", "unset" ]
    },
    "object-position": {
        values: [ "bottom", "center", "inherit", "initial", "left", "right", "top", "unset" ]
    },
    opacity: {
        values: [ "inherit", "initial", "unset" ]
    },
    order: {
        values: [ "inherit", "initial", "unset" ]
    },
    outline: {
        values: [ "COLOR", "auto", "currentColor", "dashed", "dotted", "double", "groove", "hidden", "hsl", "hsla", "inherit", "initial", "inset", "medium", "none", "outset", "rgb", "rgba", "ridge", "solid", "thick", "thin", "transparent", "unset" ]
    },
    "outline-color": {
        values: [ "COLOR", "currentColor", "hsl", "hsla", "inherit", "initial", "rgb", "rgba", "transparent", "unset" ]
    },
    "outline-offset": {
        values: [ "inherit", "initial", "unset" ]
    },
    "outline-style": {
        values: [ "auto", "dashed", "dotted", "double", "groove", "hidden", "inherit", "initial", "inset", "none", "outset", "ridge", "solid", "unset" ]
    },
    "outline-width": {
        values: [ "inherit", "initial", "medium", "thick", "thin", "unset" ]
    },
    overflow: {
        values: [ "auto", "hidden", "inherit", "initial", "scroll", "unset", "visible" ]
    },
    "overflow-wrap": {
        values: [ "break-word", "inherit", "initial", "normal", "unset" ]
    },
    "overflow-x": {
        values: [ "auto", "hidden", "inherit", "initial", "scroll", "unset", "visible" ]
    },
    "overflow-y": {
        values: [ "auto", "hidden", "inherit", "initial", "scroll", "unset", "visible" ]
    },
    "overscroll-behavior": {
        values: [ "auto", "contain", "inherit", "initial", "none", "unset" ]
    },
    "overscroll-behavior-x": {
        values: [ "auto", "contain", "inherit", "initial", "none", "unset" ]
    },
    "overscroll-behavior-y": {
        values: [ "auto", "contain", "inherit", "initial", "none", "unset" ]
    },
    padding: {
        values: [ "inherit", "initial", "unset" ]
    },
    "padding-block-end": {
        values: [ "inherit", "initial", "unset" ]
    },
    "padding-block-start": {
        values: [ "inherit", "initial", "unset" ]
    },
    "padding-bottom": {
        values: [ "inherit", "initial", "unset" ]
    },
    "padding-inline-end": {
        values: [ "inherit", "initial", "unset" ]
    },
    "padding-inline-start": {
        values: [ "inherit", "initial", "unset" ]
    },
    "padding-left": {
        values: [ "inherit", "initial", "unset" ]
    },
    "padding-right": {
        values: [ "inherit", "initial", "unset" ]
    },
    "padding-top": {
        values: [ "inherit", "initial", "unset" ]
    },
    "page-break-after": {
        values: [ "always", "auto", "avoid", "inherit", "initial", "left", "right", "unset" ]
    },
    "page-break-before": {
        values: [ "always", "auto", "avoid", "inherit", "initial", "left", "right", "unset" ]
    },
    "page-break-inside": {
        values: [ "auto", "avoid", "inherit", "initial", "unset" ]
    },
    "paint-order": {
        values: [ "inherit", "initial", "unset" ]
    },
    perspective: {
        values: [ "inherit", "initial", "none", "unset" ]
    },
    "perspective-origin": {
        values: [ "bottom", "center", "inherit", "initial", "left", "right", "top", "unset" ]
    },
    "place-content": {
        values: [ "baseline", "center", "end", "first baseline", "flex-end", "flex-start", "inherit", "initial", "last baseline", "left", "normal", "right", "safe", "space-around", "space-between", "space-evenly", "start", "stretch", "unsafe", "unset" ]
    },
    "place-items": {
        values: [ "baseline", "center", "end", "first baseline", "flex-end", "flex-start", "inherit", "initial", "last baseline", "left", "legacy", "normal", "right", "safe", "self-end", "self-start", "start", "stretch", "unsafe", "unset" ]
    },
    "place-self": {
        values: [ "auto", "baseline", "center", "end", "first baseline", "flex-end", "flex-start", "inherit", "initial", "last baseline", "left", "normal", "right", "safe", "self-end", "self-start", "start", "stretch", "unsafe", "unset" ]
    },
    "pointer-events": {
        values: [ "all", "auto", "fill", "inherit", "initial", "none", "painted", "stroke", "unset", "visible", "visiblefill", "visiblepainted", "visiblestroke" ]
    },
    position: {
        values: [ "absolute", "fixed", "inherit", "initial", "relative", "static", "sticky", "unset" ]
    },
    quotes: {
        values: [ "inherit", "initial", "none", "unset" ]
    },
    resize: {
        values: [ "block", "both", "horizontal", "inherit", "initial", "inline", "none", "unset", "vertical" ]
    },
    right: {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    "row-gap": {
        values: [ "inherit", "initial", "normal", "unset" ]
    },
    "ruby-align": {
        values: [ "center", "inherit", "initial", "space-around", "space-between", "start", "unset" ]
    },
    "ruby-position": {
        values: [ "inherit", "initial", "over", "under", "unset" ]
    },
    "scroll-behavior": {
        values: [ "auto", "inherit", "initial", "smooth", "unset" ]
    },
    "scroll-snap-coordinate": {
        values: [ "bottom", "center", "inherit", "initial", "left", "none", "right", "top", "unset" ]
    },
    "scroll-snap-destination": {
        values: [ "bottom", "center", "inherit", "initial", "left", "right", "top", "unset" ]
    },
    "scroll-snap-points-x": {
        values: [ "inherit", "initial", "none", "repeat", "unset" ]
    },
    "scroll-snap-points-y": {
        values: [ "inherit", "initial", "none", "repeat", "unset" ]
    },
    "scroll-snap-type": {
        values: [ "inherit", "initial", "mandatory", "none", "proximity", "unset" ]
    },
    "scroll-snap-type-x": {
        values: [ "inherit", "initial", "mandatory", "none", "proximity", "unset" ]
    },
    "scroll-snap-type-y": {
        values: [ "inherit", "initial", "mandatory", "none", "proximity", "unset" ]
    },
    "shape-image-threshold": {
        values: [ "inherit", "initial", "unset" ]
    },
    "shape-margin": {
        values: [ "inherit", "initial", "unset" ]
    },
    "shape-outside": {
        values: [ "border-box", "circle", "content-box", "ellipse", "inherit", "initial", "inset", "linear-gradient", "margin-box", "none", "padding-box", "polygon", "radial-gradient", "repeating-linear-gradient", "repeating-radial-gradient", "unset", "url" ]
    },
    "shape-rendering": {
        values: [ "auto", "crispedges", "geometricprecision", "inherit", "initial", "optimizespeed", "unset" ]
    },
    "stop-color": {
        values: [ "COLOR", "currentColor", "hsl", "hsla", "inherit", "initial", "rgb", "rgba", "transparent", "unset" ]
    },
    "stop-opacity": {
        values: [ "inherit", "initial", "unset" ]
    },
    stroke: {
        values: [ "COLOR", "context-fill", "context-stroke", "currentColor", "hsl", "hsla", "inherit", "initial", "none", "rgb", "rgba", "transparent", "unset", "url" ]
    },
    "stroke-dasharray": {
        values: [ "context-value", "inherit", "initial", "none", "unset" ]
    },
    "stroke-dashoffset": {
        values: [ "context-value", "inherit", "initial", "unset" ]
    },
    "stroke-linecap": {
        values: [ "butt", "inherit", "initial", "round", "square", "unset" ]
    },
    "stroke-linejoin": {
        values: [ "bevel", "inherit", "initial", "miter", "round", "unset" ]
    },
    "stroke-miterlimit": {
        values: [ "inherit", "initial", "unset" ]
    },
    "stroke-opacity": {
        values: [ "context-fill-opacity", "context-stroke-opacity", "inherit", "initial", "unset" ]
    },
    "stroke-width": {
        values: [ "context-value", "inherit", "initial", "unset" ]
    },
    "table-layout": {
        values: [ "auto", "fixed", "inherit", "initial", "unset" ]
    },
    "text-align": {
        values: [ "center", "end", "inherit", "initial", "justify", "left", "match-parent", "right", "start", "unset" ]
    },
    "text-align-last": {
        values: [ "auto", "center", "end", "inherit", "initial", "justify", "left", "right", "start", "unset" ]
    },
    "text-anchor": {
        values: [ "end", "inherit", "initial", "middle", "start", "unset" ]
    },
    "text-combine-upright": {
        values: [ "all", "inherit", "initial", "none", "unset" ]
    },
    "text-decoration": {
        values: [ "COLOR", "blink", "currentColor", "dashed", "dotted", "double", "hsl", "hsla", "inherit", "initial", "line-through", "none", "overline", "rgb", "rgba", "solid", "transparent", "underline", "unset", "wavy" ]
    },
    "text-decoration-color": {
        values: [ "COLOR", "currentColor", "hsl", "hsla", "inherit", "initial", "rgb", "rgba", "transparent", "unset" ]
    },
    "text-decoration-line": {
        values: [ "blink", "inherit", "initial", "line-through", "none", "overline", "underline", "unset" ]
    },
    "text-decoration-style": {
        values: [ "dashed", "dotted", "double", "inherit", "initial", "solid", "unset", "wavy" ]
    },
    "text-emphasis": {
        values: [ "COLOR", "circle", "currentColor", "dot", "double-circle", "filled", "hsl", "hsla", "inherit", "initial", "none", "open", "rgb", "rgba", "sesame", "transparent", "triangle", "unset" ]
    },
    "text-emphasis-color": {
        values: [ "COLOR", "currentColor", "hsl", "hsla", "inherit", "initial", "rgb", "rgba", "transparent", "unset" ]
    },
    "text-emphasis-position": {
        values: [ "inherit", "initial", "left", "over", "right", "under", "unset" ]
    },
    "text-emphasis-style": {
        values: [ "circle", "dot", "double-circle", "filled", "inherit", "initial", "none", "open", "sesame", "triangle", "unset" ]
    },
    "text-indent": {
        values: [ "inherit", "initial", "unset" ]
    },
    "text-justify": {
        values: [ "auto", "distribute", "inherit", "initial", "inter-character", "inter-word", "none", "unset" ]
    },
    "text-orientation": {
        values: [ "inherit", "initial", "mixed", "sideways", "sideways-right", "unset", "upright" ]
    },
    "text-overflow": {
        values: [ "clip", "ellipsis", "inherit", "initial", "unset" ]
    },
    "text-rendering": {
        values: [ "auto", "geometricprecision", "inherit", "initial", "optimizelegibility", "optimizespeed", "unset" ]
    },
    "text-shadow": {
        values: [ "COLOR", "currentColor", "hsl", "hsla", "inherit", "initial", "none", "rgb", "rgba", "transparent", "unset" ]
    },
    "text-transform": {
        values: [ "capitalize", "full-width", "inherit", "initial", "lowercase", "none", "unset", "uppercase" ]
    },
    top: {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    "touch-action": {
        values: [ "auto", "inherit", "initial", "manipulation", "none", "pan-x", "pan-y", "unset" ]
    },
    transform: {
        values: [ "accumulatematrix", "inherit", "initial", "interpolatematrix", "matrix", "matrix3d", "none", "perspective", "rotate", "rotate3d", "rotateX", "rotateY", "rotateZ", "scale", "scale3d", "scaleX", "scaleY", "scaleZ", "skew", "skewX", "skewY", "translate", "translate3d", "translateX", "translateY", "translateZ", "unset" ]
    },
    "transform-box": {
        values: [ "border-box", "fill-box", "inherit", "initial", "unset", "view-box" ]
    },
    "transform-origin": {
        values: [ "bottom", "center", "inherit", "initial", "left", "right", "top", "unset" ]
    },
    "transform-style": {
        values: [ "flat", "inherit", "initial", "preserve-3d", "unset" ]
    },
    transition: {
        values: [ "all", "cubic-bezier", "ease", "ease-in", "ease-in-out", "ease-out", "frames", "inherit", "initial", "linear", "none", "step-end", "step-start", "steps", "unset" ]
    },
    "transition-delay": {
        values: [ "inherit", "initial", "unset" ]
    },
    "transition-duration": {
        values: [ "inherit", "initial", "unset" ]
    },
    "transition-property": {
        values: [ "all", "inherit", "initial", "none", "unset" ]
    },
    "transition-timing-function": {
        values: [ "cubic-bezier", "ease", "ease-in", "ease-in-out", "ease-out", "frames", "inherit", "initial", "linear", "step-end", "step-start", "steps", "unset" ]
    },
    "unicode-bidi": {
        values: [ "bidi-override", "embed", "inherit", "initial", "isolate", "isolate-override", "normal", "plaintext", "unset" ]
    },
    "vector-effect": {
        values: [ "inherit", "initial", "non-scaling-stroke", "none", "unset" ]
    },
    "vertical-align": {
        values: [ "baseline", "bottom", "inherit", "initial", "middle", "sub", "super", "text-bottom", "text-top", "top", "unset" ]
    },
    visibility: {
        values: [ "collapse", "hidden", "inherit", "initial", "unset", "visible" ]
    },
    "white-space": {
        values: [ "inherit", "initial", "normal", "nowrap", "pre", "pre-line", "pre-wrap", "unset" ]
    },
    width: {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    "will-change": {
        values: [ "auto", "inherit", "initial", "unset" ]
    },
    "word-break": {
        values: [ "break-all", "inherit", "initial", "keep-all", "normal", "unset" ]
    },
    "word-spacing": {
        values: [ "inherit", "initial", "normal", "unset" ]
    },
    "word-wrap": {
        values: [ "break-word", "inherit", "initial", "normal", "unset" ]
    },
    "writing-mode": {
        values: [ "horizontal-tb", "inherit", "initial", "lr", "lr-tb", "rl", "rl-tb", "sideways-lr", "sideways-rl", "tb", "tb-rl", "unset", "vertical-lr", "vertical-rl" ]
    },
    "z-index": {
        values: [ "auto", "inherit", "initial", "unset" ]
    }
};

const bi = [ ":after", ":before", ":backdrop", ":cue", ":first-letter", ":first-line", ":selection", ":placeholder" ];

const vi = [ "xml:lang", "xml:base", "accesskey", "autocapitalize", "aria-foo", "class", "contenteditable", "contextmenu", "data-foo", "dir", "draggable", "dropzone", "hidden", "id", "is", "itemid", "itemprop", "itemref", "itemscope", "itemtype", "lang", "slot", "spellcheck", "style", "tabindex", "title", "translate", "onabort", "onautocomplete", "onautocompleteerror", "onblur", "oncancel", "oncanplay", "oncanplaythrough", "onchange", "onclick", "onclose", "oncontextmenu", "oncuechange", "ondblclick", "ondrag", "ondragend", "ondragenter", "ondragexit", "ondragleave", "ondragover", "ondragstart", "ondrop", "ondurationchange", "onemptied", "onended", "onerror", "onfocus", "oninput", "oninvalid", "onkeydown", "onkeypress", "onkeyup", "onload", "onloadeddata", "onloadedmetadata", "onloadstart", "onmousedown", "onmouseenter", "onmouseleave", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onmousewheel", "onpause", "onplay", "onplaying", "onprogress", "onratechange", "onreset", "onresize", "onscroll", "onseeked", "onseeking", "onselect", "onshow", "onsort", "onstalled", "onsubmit", "onsuspend", "ontimeupdate", "ontoggle", "onvolumechange", "onwaiting" ];

function xi(e, t) {
    e = e.slice(0).filter((e => e.length > 0));
    if ("function" !== typeof t) throw new Error("Callback is not a function");
    if (0 === e.length) return;
    const n = e.reduce(((e, t) => e *= t.length), 1);
    const i = Array(e.length).fill(0);
    const r = [];
    let s = null;
    try {
        s = $i(e, Array(e.length), i);
        t(...s);
    } catch (e) {
        r.push(e);
    }
    let o = 1;
    if (n === o) return;
    let a = false;
    while (!a) {
        const l = ki(e, i);
        if (l) {
            try {
                t(...$i(e, s, i));
            } catch (e) {
                r.push(e);
            }
            o++;
            if (n < o) throw new Error("Invalid loop implementation.");
        } else a = true;
    }
    if (r.length > 0) {
        const e = `eachCartesionJoinFactory failed to load ${r.length} tests:\n\n${r.map((e => e.message)).join("\n")}`;
        throw new Error(e);
    }
}

function $i(e, t, n) {
    for (let i = 0, r = e.length; r > i; ++i) t[i] = e[i][n[i]](...t);
    return t;
}

function yi(e, t) {
    e = e.slice(0).filter((e => e.length > 0));
    if ("function" !== typeof t) throw new Error("Callback is not a function");
    if (0 === e.length) return;
    const n = e.reduce(((e, t) => e *= t.length), 1);
    const i = Array(e.length).fill(0);
    const r = Ci(e, Array(e.length), i);
    t(...r, 0);
    let s = 1;
    if (n === s) return;
    let o = false;
    while (!o) {
        const a = ki(e, i);
        if (a) {
            t(...Ci(e, r, i), s);
            s++;
            if (n < s) throw new Error("Invalid loop implementation.");
        } else o = true;
    }
}

async function wi(e, t) {
    e = e.slice(0).filter((e => e.length > 0));
    if ("function" !== typeof t) throw new Error("Callback is not a function");
    if (0 === e.length) return;
    const n = e.reduce(((e, t) => e *= t.length), 1);
    const i = Array(e.length).fill(0);
    const r = Ci(e, Array(e.length), i);
    await t(...r, 0);
    let s = 1;
    if (n === s) return;
    let o = false;
    while (!o) {
        const a = ki(e, i);
        if (a) {
            await t(...Ci(e, r, i), s);
            s++;
            if (n < s) throw new Error("Invalid loop implementation.");
        } else o = true;
    }
}

function ki(e, t) {
    let n = e.length;
    while (n--) {
        if (t[n] === e[n].length - 1) {
            if (0 === n) return false;
            continue;
        }
        t[n] += 1;
        for (let i = n + 1, r = e.length; r > i; ++i) t[i] = 0;
        return true;
    }
    return false;
}

function Ci(e, t, n) {
    for (let i = 0, r = e.length; r > i; ++i) t[i] = e[i][n[i]];
    return t;
}

function* Si(e) {
    const [t, ...n] = e;
    const i = n.length > 0 ? Si(n) : [ [] ];
    for (const e of i) for (const n of t) yield [ n, ...e ];
}

function Oi(e, n = null, ...i) {
    const r = exports.PLATFORM.document;
    const s = r.createElement(e);
    for (const e in n) if ("class" === e || "className" === e || "cls" === e) {
        let i = n[e];
        i = void 0 === i || null === i ? t.emptyArray : Array.isArray(i) ? i : `${i}`.split(" ");
        s.classList.add(...i.filter(Boolean));
    } else if (e in s || "data" === e || e.startsWith("_")) s[e.replace(/^_/, "")] = n[e]; else s.setAttribute(e, n[e]);
    const o = "TEMPLATE" === s.tagName ? s.content : s;
    for (const e of i) {
        if (null === e || void 0 === e) continue;
        o.appendChild(Ei(e) ? e : r.createTextNode(`${e}`));
    }
    return s;
}

function Ei(e) {
    return e.nodeType > 0;
}

const ji = {
    delegate: 1,
    capture: 1,
    call: 1
};

const Ai = function(e, n, ...i) {
    const r = this || exports.PLATFORM.document;
    const s = r.createElement("let$" === e ? "let" : e);
    if (null != n) {
        let e;
        for (const i in n) {
            e = n[i];
            if ("class" === i || "className" === i || "cls" === i) {
                e = null == e ? [] : Array.isArray(e) ? e : `${e}`.split(" ");
                s.classList.add(...e);
            } else if (i in s || "data" === i || i.startsWith("_")) s[i] = e; else if ("asElement" === i) s.setAttribute("as-element", e); else if (i.startsWith("o") && "n" === i[1] && !i.endsWith("$")) {
                const n = t.kebabCase(i.slice(2));
                const r = n.split("-");
                if (r.length > 1) {
                    const t = r[r.length - 1];
                    const n = ji[t] ? t : "trigger";
                    s.setAttribute(`${r.slice(0, -1).join("-")}.${n}`, e);
                } else s.setAttribute(`${r[0]}.trigger`, e);
            } else {
                const n = i.split("$");
                if (1 === n.length) s.setAttribute(t.kebabCase(i), e); else {
                    if ("" === n[n.length - 1]) n[n.length - 1] = "bind";
                    s.setAttribute(n.map(t.kebabCase).join("."), e);
                }
            }
        }
    }
    const o = null != s.content ? s.content : s;
    for (const e of i) {
        if (null == e) continue;
        if (Array.isArray(e)) for (const t of e) o.appendChild(t instanceof exports.PLATFORM.Node ? t : r.createTextNode(`${t}`)); else o.appendChild(e instanceof exports.PLATFORM.Node ? e : r.createTextNode(`${e}`));
    }
    return s;
};

Ai.Fragment = "template";

const Ri = new t.EventAggregator;

const qi = e => Ri.subscribe("fixture:created", (t => {
    try {
        e(t);
    } catch (e) {
        console.log("(!) Error in fixture:created callback");
        console.log(e);
    }
}));

function Mi(e, n, r = [], o = true, a = TestContext.create()) {
    const {container: l} = a;
    l.register(...r);
    const {platform: u, observerLocator: c} = a;
    const f = a.doc.body.appendChild(a.createElement("div"));
    const h = f.appendChild(a.createElement("app"));
    const d = new i.Aurelia(l);
    const p = "function" === typeof n ? n : null == n ? class {} : function e() {
        Object.setPrototypeOf(n, e.prototype);
        return n;
    };
    const m = [ "aliases", "bindables", "cache", "capture", "childrenObservers", "containerless", "dependencies", "enhance" ];
    if (p !== n && null != n) m.forEach((e => {
        s.Metadata.define(e, i.CustomElement.getAnnotation(n, e), p);
    }));
    const g = i.CustomElement.isType(p) ? i.CustomElement.getDefinition(p) : {};
    const b = i.CustomElement.define({
        ...g,
        name: "app",
        template: e
    }, p);
    if (l.has(b, true)) throw new Error("Container of the context contains instance of the application root component. " + "Consider using a different class, or context as it will likely cause surprises in tests.");
    const v = l.get(b);
    let x;
    if (o) try {
        d.app({
            host: h,
            component: v
        });
        x = d.start();
    } catch (e) {
        try {
            const e = () => {
                f.remove();
                d.dispose();
            };
            const t = d.stop();
            if (t instanceof Promise) void t.then(e); else e();
        } catch {
            console.warn("(!) corrupted fixture state, should isolate the failing test and restart the run" + "as it is likely that this failing fixture creation will pollute others.");
        }
        throw e;
    }
    let $ = 0;
    const y = e => {
        const t = h.querySelectorAll(e);
        if (t.length > 1) throw new Error(`There is more than 1 element with selector "${e}": ${t.length} found`);
        if (0 === t.length) throw new Error(`No element found for selector: "${e}"`);
        return t[0];
    };
    function w(e) {
        return Array.from(h.querySelectorAll(e));
    }
    function k(e) {
        const t = h.querySelectorAll(e);
        if (t.length > 1) throw new Error(`There is more than 1 element with selector "${e}": ${t.length} found`);
        return 0 === t.length ? null : t[0];
    }
    function C(e, t) {
        if (2 === arguments.length) {
            const n = k(e);
            if (null === n) throw new Error(`No element found for selector "${e}" to compare text content with "${t}"`);
            mi.strictEqual(n.textContent, t);
        } else mi.strictEqual(h.textContent, e);
    }
    function S(e, t) {
        let n = e.innerHTML;
        if (t) n = n.replace(/<!--au-start-->/g, "").replace(/<!--au-end-->/g, "").replace(/\s+/g, " ").trim();
        return n;
    }
    function O(e, t = e, {compact: n} = {
        compact: false
    }) {
        if (arguments.length > 1) {
            const i = k(e);
            if (null === i) throw new Error(`No element found for selector "${e}" to compare innerHTML against "${t}"`);
            mi.strictEqual(S(i, n), t);
        } else mi.strictEqual(S(h, n), e);
    }
    function E(e, t, n) {
        const i = k(e);
        if (null === i) throw new Error(`No element found for selector "${e}" to compare attribute "${t}" against "${n}"`);
        mi.strictEqual(i.getAttribute(t), n);
    }
    function j(e, t, n, i) {
        const r = k(e);
        if (null === r) throw new Error(`No element found for selector "${e}" to compare attribute "${n}" against "${i}"`);
        mi.strictEqual(r.getAttributeNS(t, n), i);
    }
    function A(e, t) {
        const n = k(e);
        if (null === n) throw new Error(`No element found for selector "${e}" to compare value against "${t}"`);
        mi.strictEqual(n.value, t);
    }
    function R(e, t, n) {
        const i = k(e);
        if (null === i) throw new Error(`No element found for selector "${e}" to fire event "${t}"`);
        i.dispatchEvent(new a.CustomEvent(t, n));
    }
    [ "click", "change", "input", "scroll" ].forEach((e => {
        Object.defineProperty(R, e, {
            configurable: true,
            writable: true,
            value: (t, n) => {
                const i = k(t);
                if (null === i) throw new Error(`No element found for selector "${t}" to fire event "${e}"`);
                i.dispatchEvent(new a.CustomEvent(e, n));
            }
        });
    }));
    function q(e, t) {
        const n = "string" === typeof e ? k(e) : e;
        if (null === n || !/input|textarea/i.test(n.nodeName)) throw new Error(`No <input>/<textarea> element found for selector "${e}" to emulate input for "${t}"`);
        n.value = t;
        n.dispatchEvent(new u.window.Event("input"));
    }
    const M = (e, t) => {
        const n = k(e);
        if (null === n) throw new Error(`No element found for selector "${e}" to scroll by "${JSON.stringify(t)}"`);
        n.scrollBy("number" === typeof t ? {
            top: t
        } : t);
        n.dispatchEvent(new u.window.Event("scroll"));
    };
    const L = e => {
        a.platform.domWriteQueue.flush(e);
    };
    const T = new class Results {
        constructor() {
            this.startPromise = x;
            this.ctx = a;
            this.container = l;
            this.platform = u;
            this.testHost = f;
            this.appHost = h;
            this.au = d;
            this.component = v;
            this.observerLocator = c;
            this.logger = l.get(t.ILogger);
            this.hJsx = Ai.bind(a.doc);
            this.getBy = y;
            this.getAllBy = w;
            this.queryBy = k;
            this.assertText = C;
            this.assertHtml = O;
            this.assertAttr = E;
            this.assertAttrNS = j;
            this.assertValue = A;
            this.createEvent = (e, t) => new u.CustomEvent(e, t);
            this.trigger = R;
            this.type = q;
            this.scrollBy = M;
            this.flush = L;
        }
        start() {
            return d.app({
                host: h,
                component: v
            }).start();
        }
        tearDown() {
            if (2 === ++$) {
                console.log("(!) Fixture has already been torn down");
                return;
            }
            const e = () => {
                f.remove();
                d.dispose();
            };
            const t = d.stop();
            if (t instanceof Promise) return t.then(e); else return e();
        }
        get torn() {
            return $ > 0;
        }
        get started() {
            if (x instanceof Promise) return Promise.resolve(x).then((() => this));
            return Promise.resolve(this);
        }
    };
    Ri.publish("fixture:created", T);
    return T;
}

class FixtureBuilder {
    html(e, ...t) {
        this.u = e;
        this.h = t;
        return this;
    }
    component(e) {
        this.$ = e;
        return this;
    }
    deps(...e) {
        this.C = e;
        return this;
    }
    build() {
        if (void 0 === this.u) throw new Error("Builder is not ready, missing template, call .html()/.html`` first");
        return Mi("string" === typeof this.u ? this.u : Li(this.u, ...this.h ?? []), this.$, this.C);
    }
}

function Li(e, ...t) {
    let n = e[0];
    for (let i = 0; i < t.length; ++i) n += String(t[i]) + e[i + 1];
    return n;
}

Mi.html = (e, ...t) => (new FixtureBuilder).html(e, ...t);

Mi.component = e => (new FixtureBuilder).component(e);

Mi.deps = (...e) => (new FixtureBuilder).deps(...e);

class MockBinding {
    constructor() {
        this.calls = [];
    }
    get(e) {
        this.trace("get", e);
        return null;
    }
    updateTarget(e) {
        this.trace("updateTarget", e);
    }
    updateSource(e) {
        this.trace("updateSource", e);
    }
    handleChange(e, t) {
        this.trace("handleChange", e, t);
    }
    handleCollectionChange(e, t) {
        this.trace("handleCollectionChange", e, t);
    }
    observe(e, t) {
        this.trace("observe", e, t);
    }
    observeCollection(e) {
        this.trace("observeCollection", e);
    }
    subscribeTo(e) {
        this.trace("subscribeTo", e);
    }
    bind(e) {
        this.trace("bind", e);
    }
    unbind() {
        this.trace("unbind");
    }
    trace(e, ...t) {
        this.calls.push([ e, ...t ]);
    }
    dispose() {
        this.trace("dispose");
    }
    limit(e) {
        this.trace("limit", e);
        return {
            dispose: () => {}
        };
    }
    useScope(e) {
        this.trace("useScope", e);
    }
}

class MockBindingBehavior {
    constructor() {
        this.calls = [];
    }
    bind(e, t, ...n) {
        this.trace("bind", e, t, ...n);
    }
    unbind(e, t, ...n) {
        this.trace("unbind", e, t, ...n);
    }
    trace(e, ...t) {
        this.calls.push([ e, ...t ]);
    }
}

class MockServiceLocator {
    constructor(e) {
        this.registrations = e;
        this.calls = [];
    }
    get(e) {
        this.trace("get", e);
        return this.registrations.get(e);
    }
    trace(e, ...t) {
        this.calls.push([ e, ...t ]);
    }
}

class MockSignaler {
    constructor() {
        this.calls = [];
    }
    dispatchSignal(...e) {
        this.trace("dispatchSignal", ...e);
    }
    addSignalListener(...e) {
        this.trace("addSignalListener", ...e);
    }
    removeSignalListener(...e) {
        this.trace("removeSignalListener", ...e);
    }
    trace(e, ...t) {
        this.calls.push([ e, ...t ]);
    }
}

class MockPropertySubscriber {
    constructor() {
        this.calls = [];
    }
    handleChange(e, t) {
        this.trace(`handleChange`, e, t);
    }
    trace(e, ...t) {
        this.calls.push([ e, ...t ]);
    }
}

class MockTracingExpression {
    constructor(e) {
        this.inner = e;
        this.$kind = 28;
        this.hasBind = true;
        this.hasUnbind = true;
        this.calls = [];
    }
    evaluate(...e) {
        this.trace("evaluate", ...e);
        return n.astEvaluate(this.inner, ...e);
    }
    assign(...e) {
        this.trace("assign", ...e);
        return n.astAssign(this.inner, ...e);
    }
    bind(...e) {
        this.trace("bind", ...e);
        n.astBind(this.inner, ...e);
    }
    unbind(...e) {
        this.trace("unbind", ...e);
        n.astUnbind(this.inner, ...e);
    }
    accept(...e) {
        this.trace("accept", ...e);
        this.inner.accept(...e);
    }
    trace(e, ...t) {
        this.calls.push([ e, ...t ]);
    }
}

class MockValueConverter {
    constructor(e) {
        this.calls = [];
        for (const t of e) this[t] = this[`$${t}`];
    }
    $fromView(e, ...t) {
        this.trace("fromView", e, ...t);
        return e;
    }
    $toView(e, ...t) {
        this.trace("toView", e, ...t);
        return e;
    }
    trace(e, ...t) {
        this.calls.push([ e, ...t ]);
    }
}

class MockContext {
    constructor() {
        this.log = [];
    }
}

class MockBrowserHistoryLocation {
    constructor() {
        this.states = [ {} ];
        this.paths = [ "" ];
        this.index = 0;
    }
    get length() {
        return this.states.length;
    }
    get state() {
        return this.states[this.index];
    }
    get path() {
        return this.paths[this.index];
    }
    get pathname() {
        const e = this.parts;
        let t = e.shift();
        if (!t.startsWith("/")) t = `/${t}`;
        return t;
    }
    get search() {
        const e = this.parts;
        e.shift();
        const t = e.shift();
        return void 0 !== t ? `?${t}` : "";
    }
    get hash() {
        const e = this.parts;
        e.shift();
        e.shift();
        const t = e.shift();
        return void 0 !== t ? `#${t}` : "";
    }
    set hash(e) {
        if (e.startsWith("#")) e = e.substring(1);
        const t = this.parts;
        let n = t.shift();
        const i = t.shift();
        if (void 0 !== i) n += `?${i}`;
        t.shift();
        n += `#${e}`;
        this.pushState({}, null, n);
        this.notifyChange();
    }
    activate() {
        return;
    }
    deactivate() {
        return;
    }
    get parts() {
        const e = [];
        const t = this.path.split("#");
        if (t.length > 1) e.unshift(t.pop()); else e.unshift(void 0);
        const n = t[0].split("?");
        if (n.length > 1) e.unshift(n.pop()); else e.unshift(void 0);
        e.unshift(n[0]);
        return e;
    }
    pushState(e, t, n) {
        this.states.splice(this.index + 1);
        this.paths.splice(this.index + 1);
        this.states.push(e);
        this.paths.push(n);
        this.index++;
    }
    replaceState(e, t, n) {
        this.states[this.index] = e;
        this.paths[this.index] = n;
    }
    go(e) {
        const t = this.index + e;
        if (t >= 0 && t < this.states.length) {
            this.index = t;
            this.notifyChange();
        }
    }
    notifyChange() {
        if (this.changeCallback) this.changeCallback(null).catch((e => {
            throw e;
        }));
    }
}

class ChangeSet {
    constructor(e, t, n) {
        this.index = e;
        this.O = t;
        this.ov = n;
    }
    get newValue() {
        return this.O;
    }
    get oldValue() {
        return this.ov;
    }
    dispose() {
        this.O = void 0;
        this.ov = void 0;
    }
}

class ProxyChangeSet {
    constructor(e, t, n, i, r) {
        this.index = e;
        this.flags = t;
        this.key = n;
        this.O = i;
        this.ov = r;
    }
    get newValue() {
        return this.O;
    }
    get oldValue() {
        return this.ov;
    }
    dispose() {
        this.O = void 0;
        this.ov = void 0;
    }
}

class CollectionChangeSet {
    constructor(e, t) {
        this.index = e;
        this.j = t;
    }
    get indexMap() {
        return this.j;
    }
    dispose() {
        this.j = void 0;
    }
}

class SpySubscriber {
    constructor() {
        this.A = void 0;
        this.R = void 0;
        this.q = void 0;
        this.M = 0;
    }
    get changes() {
        if (void 0 === this.A) return [];
        return this.A;
    }
    get proxyChanges() {
        if (void 0 === this.R) return [];
        return this.R;
    }
    get collectionChanges() {
        if (void 0 === this.q) return [];
        return this.q;
    }
    get hasChanges() {
        return void 0 !== this.A;
    }
    get hasProxyChanges() {
        return void 0 !== this.R;
    }
    get hasCollectionChanges() {
        return void 0 !== this.q;
    }
    get callCount() {
        return this.M;
    }
    handleChange(e, t) {
        if (void 0 === this.A) this.A = [ new ChangeSet(this.M++, e, t) ]; else this.A.push(new ChangeSet(this.M++, e, t));
    }
    handleCollectionChange(e, t) {
        if (void 0 === this.q) this.q = [ new CollectionChangeSet(this.M++, t) ]; else this.q.push(new CollectionChangeSet(this.M++, t));
    }
    dispose() {
        if (void 0 !== this.A) {
            this.A.forEach((e => e.dispose()));
            this.A = void 0;
        }
        if (void 0 !== this.R) {
            this.R.forEach((e => e.dispose()));
            this.R = void 0;
        }
        if (void 0 !== this.q) {
            this.q.forEach((e => e.dispose()));
            this.q = void 0;
        }
        this.M = 0;
    }
}

function Ti(e, t, n, i) {
    var r = arguments.length, s = r < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i, o;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) s = Reflect.decorate(e, t, n, i); else for (var a = e.length - 1; a >= 0; a--) if (o = e[a]) s = (r < 3 ? o(s) : r > 3 ? o(t, n, s) : o(t, n)) || s;
    return r > 3 && s && Object.defineProperty(t, n, s), s;
}

exports.SortValueConverter = class SortValueConverter {
    toView(e, t, n = "asc") {
        if (Array.isArray(e)) {
            const i = "asc" === n ? 1 : -1;
            if (t?.length) e.sort(((e, n) => e[t] - n[t] * i)); else e.sort(((e, t) => e - t * i));
        }
        return e;
    }
};

exports.SortValueConverter = Ti([ i.valueConverter("sort") ], exports.SortValueConverter);

exports.JsonValueConverter = class JsonValueConverter {
    toView(e) {
        return JSON.stringify(e);
    }
    fromView(e) {
        return JSON.parse(e);
    }
};

exports.JsonValueConverter = Ti([ i.valueConverter("json") ], exports.JsonValueConverter);

let zi = class NameTag {};

Ti([ i.bindable() ], zi.prototype, "name", void 0);

zi = Ti([ i.customElement({
    name: "name-tag",
    template: `<template>\${name}</template>`,
    needsCompile: true,
    dependencies: [],
    instructions: [],
    surrogates: []
}) ], zi);

const Fi = [ exports.SortValueConverter, exports.JsonValueConverter, zi ];

const Ni = {
    register(e) {
        e.register(...Fi);
    }
};

function Pi(e, ...t) {
    const n = {
        result: ""
    };
    const i = t.length;
    for (let r = 0; r < i; ++r) n.result = n.result + e[r] + Ui(t[r], n);
    return n.result + e[i];
}

const Ii = /\r?\n/g;

const Bi = /\s+/g;

const Di = Object.prototype.toString;

function Ui(e, t) {
    const n = Di.call(e);
    switch (n) {
      case "[object Undefined]":
        return "undefined";

      case "[object Null]":
        return "null";

      case "[object String]":
        return `'${e}'`;

      case "[object Boolean]":
      case "[object Number]":
        return e;

      case "[object Array]":
        return `[${e.map((e => Ui(e, t))).join(",")}]`;

      case "[object Event]":
        return `'${e.type}'`;

      case "[object Object]":
        {
            const n = Object.getPrototypeOf(e);
            if (!n || !n.constructor || "Object" === n.constructor.name) return Vi(e, t);
            return `class ${n.constructor.name}${Vi(e, t)}`;
        }

      case "[object Function]":
        if (e.name && e.name.length) return `class ${e.name}`;
        return e.toString().replace(Bi, "");

      default:
        return Vi(e, t);
    }
}

function Vi(e, t) {
    if (t.result.length > 100) return "(json string)";
    try {
        let n = [];
        let i = 0;
        const r = JSON.stringify(e, (function(e, r) {
            if ("dom" === e) return "(dom)";
            if (2 === ++i) return String(r);
            if ("object" === typeof r && null !== r) {
                if (r.nodeType > 0) {
                    --i;
                    return Hi(r, t);
                }
                if (n.includes(r)) try {
                    --i;
                    return JSON.parse(JSON.stringify(r));
                } catch (e) {
                    return;
                }
                n.push(r);
            }
            --i;
            return r;
        }));
        n = void 0;
        let s = r.replace(Ii, "");
        if (s.length > 25) {
            const e = s.length;
            s = `${s.slice(0, 25)}...(+${e - 25})`;
        }
        t.result += s;
        return s;
    } catch (e) {
        return `error stringifying to json: ${e}`;
    }
}

function Hi(e, t) {
    if (t.result.length > 100) return "(html string)";
    if (null === e) return "null";
    if (void 0 === e) return "undefined";
    if (null != e.textContent && e.textContent.length || 3 === e.nodeType || 8 === e.nodeType) {
        const t = e.textContent.replace(Ii, "");
        if (t.length > 10) {
            const e = t.length;
            return `${t.slice(0, 10)}...(+${e - 10})`;
        }
        return t;
    }
    if (1 === e.nodeType) {
        if (e.innerHTML.length) {
            const t = e.innerHTML.replace(Ii, "");
            if (t.length > 10) {
                const e = t.length;
                return `${t.slice(0, 10)}...(+${e - 10})`;
            }
            return t;
        }
        if ("TEMPLATE" === e.nodeName) return Hi(e.content, t);
    }
    let n = "";
    for (let i = 0, r = e.childNodes.length; i < r; ++i) {
        const r = e.childNodes[i];
        n += Hi(r, t);
    }
    return n;
}

function Ji(e, t) {
    const n = `${e}`;
    const i = n.length;
    if (i >= t) return n;
    return n + new Array(t - i + 1).join(" ");
}

function Wi(e, t) {
    const n = `${e}`;
    const i = n.length;
    if (i >= t) return n;
    return new Array(t - i + 1).join(" ") + n;
}

function _i(e) {
    let i;
    if (void 0 === e || !("get" in e)) i = nt(); else i = e;
    const r = {
        handles() {
            return false;
        }
    };
    t.Registration.instance(n.IDirtyChecker, null).register(i);
    t.Registration.instance(n.INodeObserverLocator, r).register(i);
    return i.get(n.IObserverLocator);
}

function Gi(e = {}, t, i) {
    return t ? n.Scope.fromParent(n.Scope.create(t), e) : n.Scope.create(e, null, i);
}

class Call {
    constructor(e, t, n, i) {
        this.instance = e;
        this.args = t;
        this.method = n;
        this.index = i;
    }
}

class CallCollection {
    constructor() {
        this.calls = [];
    }
    static register(e) {
        e.register(t.Registration.singleton(this, this));
    }
    addCall(e, t, ...n) {
        this.calls.push(new Call(e, n, t, this.calls.length));
        return this;
    }
}

function Yi(e, n) {
    const i = e.prototype;
    const r = l(i);
    for (const e in r) {
        const s = r[e];
        if ("constructor" !== e && "function" === typeof s.value && true === s.configurable && true === s.writable) {
            const t = s.value;
            const r = function(...i) {
                n.addCall(this, e, ...i);
                return v(t, this, i);
            };
            Reflect.defineProperty(r, "original", {
                value: t,
                writable: true,
                configurable: true,
                enumerable: false
            });
            Reflect.defineProperty(i, e, {
                value: r,
                writable: s.writable,
                configurable: s.configurable,
                enumerable: s.enumerable
            });
        } else {
            const {get: r, set: o} = s;
            let a, l;
            if (r) {
                a = function() {
                    n.addCall(this, `get ${e}`, t.emptyArray);
                    return v(r, this, t.emptyArray);
                };
                Reflect.defineProperty(a, "original", {
                    value: r
                });
            }
            if (o) {
                l = function(i) {
                    n.addCall(this, `get ${e}`, t.emptyArray);
                    v(o, this, [ i ]);
                };
                Reflect.defineProperty(l, "original", {
                    value: o
                });
            }
            if (r || o) Reflect.defineProperty(i, e, {
                ...s,
                get: a,
                set: l
            });
        }
    }
}

function Ki(e) {
    const t = e.prototype;
    const n = l(t);
    for (const e in n) {
        const i = n[e];
        if ("constructor" !== e && "function" === typeof i.value && true === i.configurable && true === i.writable) Reflect.defineProperty(t, e, {
            value: i.value.original,
            writable: i.writable,
            configurable: i.configurable,
            enumerable: i.enumerable
        }); else {
            const {get: n, set: r} = i;
            if (n || r) Reflect.defineProperty(t, e, {
                ...i,
                get: n && Reflect.get(n, "original"),
                set: r && Reflect.get(r, "original")
            });
        }
    }
}

function Qi(e) {
    return function(t) {
        Yi(t, e);
    };
}

exports.CSS_PROPERTIES = gi;

exports.Call = Call;

exports.CallCollection = CallCollection;

exports.ChangeSet = ChangeSet;

exports.CollectionChangeSet = CollectionChangeSet;

exports.MockBinding = MockBinding;

exports.MockBindingBehavior = MockBindingBehavior;

exports.MockBrowserHistoryLocation = MockBrowserHistoryLocation;

exports.MockContext = MockContext;

exports.MockPropertySubscriber = MockPropertySubscriber;

exports.MockServiceLocator = MockServiceLocator;

exports.MockSignaler = MockSignaler;

exports.MockTracingExpression = MockTracingExpression;

exports.MockValueConverter = MockValueConverter;

exports.PSEUDO_ELEMENTS = bi;

exports.ProxyChangeSet = ProxyChangeSet;

exports.SpySubscriber = SpySubscriber;

exports.TestConfiguration = Ni;

exports.TestContext = TestContext;

exports._ = Pi;

exports.assert = mi;

exports.createContainer = nt;

exports.createFixture = Mi;

exports.createObserverLocator = _i;

exports.createScopeForTest = Gi;

exports.createSpy = ze;

exports.eachCartesianJoin = yi;

exports.eachCartesianJoinAsync = wi;

exports.eachCartesianJoinFactory = xi;

exports.ensureTaskQueuesEmpty = yn;

exports.fail = Fn;

exports.generateCartesianProduct = Si;

exports.getVisibleText = vn;

exports.globalAttributeNames = vi;

exports.h = Oi;

exports.hJsx = Ai;

exports.htmlStringify = Hi;

exports.inspect = dn;

exports.instructionTypeName = xn;

exports.jsonStringify = Vi;

exports.onFixtureCreated = qi;

exports.padLeft = Wi;

exports.padRight = Ji;

exports.recordCalls = Yi;

exports.setPlatform = tt;

exports.stopRecordingCalls = Ki;

exports.stringify = Ui;

exports.trace = Qi;

exports.trimFull = Te;

exports.verifyBindingInstructionsEqual = $n;

exports.verifyEqual = mn;
//# sourceMappingURL=index.cjs.map
