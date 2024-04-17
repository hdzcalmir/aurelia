import { ensureEmpty as e, reportTaskQueue as t } from "../../../platform/dist/native-modules/index.mjs";

import { noop as n, isArrayIndex as i, DI as r, Registration as a, kebabCase as s, emptyArray as o, EventAggregator as l, ILogger as u } from "../../../kernel/dist/native-modules/index.mjs";

import { IObserverLocator as c, IDirtyChecker as f, INodeObserverLocator as d, Scope as p } from "../../../runtime/dist/native-modules/index.mjs";

import { StandardConfiguration as m, IPlatform as g, ITemplateCompiler as b, CustomElement as v, InstructionType as y, CustomAttribute as x, Aurelia as $, astEvaluate as w, astAssign as E, astBind as k, astUnbind as S } from "../../../runtime-html/dist/native-modules/index.mjs";

import { BrowserPlatform as C } from "../../../platform-browser/dist/native-modules/index.mjs";

import { Metadata as O } from "../../../metadata/dist/native-modules/index.mjs";

const {getPrototypeOf: q, getOwnPropertyDescriptor: j, getOwnPropertyDescriptors: A, getOwnPropertyNames: T, getOwnPropertySymbols: F, defineProperty: I, defineProperties: M} = Object;

const R = Object.keys;

const P = Object.is;

const B = Object.freeze;

const N = Object.assign;

const L = Number.isNaN;

const z = Reflect.apply;

const D = ArrayBuffer.isView;

function uncurryThis(e) {
    return (t, ...n) => z(e, t, n);
}

const V = uncurryThis(Object.prototype.hasOwnProperty);

const Q = uncurryThis(Object.prototype.propertyIsEnumerable);

const H = q(Uint8Array.prototype);

const U = uncurryThis(j(H, Symbol.toStringTag).get);

const W = uncurryThis(Object.prototype.toString);

const K = uncurryThis(RegExp.prototype.toString);

const J = uncurryThis(Date.prototype.toISOString);

const G = uncurryThis(Date.prototype.toString);

const Y = uncurryThis(Error.prototype.toString);

const X = uncurryThis(Date.prototype.getTime);

const Z = uncurryThis(Set.prototype.values);

const ee = uncurryThis(Map.prototype.entries);

const te = uncurryThis(Boolean.prototype.valueOf);

const ne = uncurryThis(Number.prototype.valueOf);

const ie = uncurryThis(Symbol.prototype.valueOf);

const re = uncurryThis(String.prototype.valueOf);

function isNumber(e) {
    return typeof e === "number";
}

function isString(e) {
    return typeof e === "string";
}

function isSymbol(e) {
    return typeof e === "symbol";
}

function isUndefined(e) {
    return e === void 0;
}

function isObject(e) {
    return e !== null && typeof e === "object";
}

function isFunction(e) {
    return typeof e === "function";
}

function isPrimitive(e) {
    return e === null || typeof e !== "object" && typeof e !== "function";
}

function isArrayBuffer(e) {
    return e instanceof ArrayBuffer;
}

function isAnyArrayBuffer(e) {
    return e instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && e instanceof SharedArrayBuffer;
}

function isDate(e) {
    return e instanceof Date;
}

function isMap(e) {
    return e instanceof Map;
}

function isMapIterator(e) {
    return W(e) === "[object Map Iterator]";
}

function isRegExp(e) {
    return e instanceof RegExp;
}

function isSet(e) {
    return e instanceof Set;
}

function isSetIterator(e) {
    return W(e) === "[object Set Iterator]";
}

function isError(e) {
    return e instanceof Error;
}

function isNumberObject(e) {
    return e instanceof Number;
}

function isStringObject(e) {
    return e instanceof String;
}

function isBooleanObject(e) {
    return e instanceof Boolean;
}

function isSymbolObject(e) {
    return e instanceof Symbol;
}

function isBoxedPrimitive(e) {
    return isNumberObject(e) || isStringObject(e) || isBooleanObject(e) || isSymbolObject(e);
}

function isTypedArray(e) {
    return U(e) !== void 0;
}

function isUint8Array(e) {
    return U(e) === "Uint8Array";
}

function isUint8ClampedArray(e) {
    return U(e) === "Uint8ClampedArray";
}

function isUint16Array(e) {
    return U(e) === "Uint16Array";
}

function isUint32Array(e) {
    return U(e) === "Uint32Array";
}

function isInt8Array(e) {
    return U(e) === "Int8Array";
}

function isInt16Array(e) {
    return U(e) === "Int16Array";
}

function isInt32Array(e) {
    return U(e) === "Int32Array";
}

function isFloat32Array(e) {
    return U(e) === "Float32Array";
}

function isFloat64Array(e) {
    return U(e) === "Float64Array";
}

function isArgumentsObject(e) {
    return W(e) === "[object Arguments]";
}

function isDataView(e) {
    return W(e) === "[object DataView]";
}

function isPromise(e) {
    return W(e) === "[object Promise]";
}

function isWeakSet(e) {
    return W(e) === "[object WeakSet]";
}

function isWeakMap(e) {
    return W(e) === "[object WeakMap]";
}

function getOwnNonIndexProperties(e, t) {
    if (t) {
        return T(e).filter((e => !i(e)));
    } else {
        return R(e).filter((e => !i(e)));
    }
}

function getEnumerables(e, t) {
    return t.filter((t => Q(e, t)));
}

const ae = B({
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

const se = /\u001b\[\d\d?m/g;

const oe = /[\x00-\x1f\x27\x5c]/;

const le = /[\x00-\x1f\x27\x5c]/g;

const ue = /[\x00-\x1f\x5c]/;

const ce = /[\x00-\x1f\x5c]/g;

function removeColors(e) {
    return e.replace(se, "");
}

function join(e, t) {
    let n = "";
    if (e.length !== 0) {
        let i = 0;
        for (;i < e.length - 1; i++) {
            n += e[i];
            n += t;
        }
        n += e[i];
    }
    return n;
}

const fe = B([ "\\u0000", "\\u0001", "\\u0002", "\\u0003", "\\u0004", "\\u0005", "\\u0006", "\\u0007", "\\b", "\\t", "\\n", "\\u000b", "\\f", "\\r", "\\u000e", "\\u000f", "\\u0010", "\\u0011", "\\u0012", "\\u0013", "\\u0014", "\\u0015", "\\u0016", "\\u0017", "\\u0018", "\\u0019", "\\u001a", "\\u001b", "\\u001c", "\\u001d", "\\u001e", "\\u001f", "", "", "", "", "", "", "", "\\'", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "\\\\" ]);

function addQuotes(e, t) {
    if (t === -1) {
        return `"${e}"`;
    }
    if (t === -2) {
        return `\`${e}\``;
    }
    return `'${e}'`;
}

const escapeFn = e => fe[e.charCodeAt(0)];

function escapeAndQuoteString(e) {
    let t = oe;
    let n = le;
    let i = 39;
    if (e.includes("'")) {
        if (!e.includes('"')) {
            i = -1;
        } else if (!e.includes("`") && !e.includes("${")) {
            i = -2;
        }
        if (i !== 39) {
            t = ue;
            n = ce;
        }
    }
    if (e.length < 5e3 && !t.test(e)) return addQuotes(e, i);
    if (e.length > 100) {
        e = e.replace(n, escapeFn);
        return addQuotes(e, i);
    }
    let r = "";
    let a = 0;
    let s = 0;
    for (;s < e.length; s++) {
        const t = e.charCodeAt(s);
        if (t === i || t === 92 || t < 32) {
            if (a === s) {
                r += fe[t];
            } else {
                r += `${e.slice(a, s)}${fe[t]}`;
            }
            a = s + 1;
        }
    }
    if (a !== s) {
        r += e.slice(a);
    }
    return addQuotes(r, i);
}

function escapeString(e) {
    return e.replace(le, escapeFn);
}

const de = function() {
    const e = {};
    return function(t) {
        let n = e[t];
        if (n === void 0) {
            n = "";
            const i = t.length;
            let r = 0;
            for (let e = 0; e < i; ++e) {
                r = t.charCodeAt(e);
                if (r > 32) {
                    n += String.fromCharCode(r);
                }
            }
            e[t] = n;
        }
        return n;
    };
}();

function createSpy(e, t, i) {
    const r = [];
    function reset() {
        r.length = 0;
    }
    let a;
    let s;
    if (e === void 0) {
        a = function spy(...e) {
            r.push(e);
        };
        s = n;
    } else if (t === void 0) {
        a = function spy(...t) {
            r.push(t);
            return e(...t);
        };
        s = n;
    } else {
        if (!(t in e)) {
            throw new Error(`No method named '${String(t)}' exists in object of type ${Reflect.getPrototypeOf(e).constructor.name}`);
        }
        let n = e;
        let o = Reflect.getOwnPropertyDescriptor(n, t);
        while (o === void 0) {
            n = Reflect.getPrototypeOf(n);
            o = Reflect.getOwnPropertyDescriptor(n, t);
        }
        if (o.value !== null && (typeof o.value === "object" || typeof o.value === "function") && typeof o.value.restore === "function") {
            o.value.restore();
            o = Reflect.getOwnPropertyDescriptor(n, t);
        }
        s = function restore() {
            if (e === n) {
                Reflect.defineProperty(e, t, o);
            } else {
                Reflect.deleteProperty(e, t);
            }
        };
        if (i === void 0) {
            a = function spy(...e) {
                r.push(e);
            };
        } else if (i === true) {
            a = function spy(...t) {
                r.push(t);
                return o.value.apply(e, t);
            };
        } else if (typeof i === "function") {
            a = function spy(...e) {
                r.push(e);
                return i(...e);
            };
        } else {
            throw new Error(`Invalid spy`);
        }
        Reflect.defineProperty(e, t, {
            ...o,
            value: a
        });
    }
    Reflect.defineProperty(a, "calls", {
        value: r
    });
    Reflect.defineProperty(a, "reset", {
        value: reset
    });
    Reflect.defineProperty(a, "restore", {
        value: s
    });
    return a;
}

var he;

(function(e) {
    e[e["noIterator"] = 0] = "noIterator";
    e[e["isArray"] = 1] = "isArray";
    e[e["isSet"] = 2] = "isSet";
    e[e["isMap"] = 3] = "isMap";
})(he || (he = {}));

function areSimilarRegExps(e, t) {
    return e.source === t.source && e.flags === t.flags;
}

function areSimilarFloatArrays(e, t) {
    if (e.byteLength !== t.byteLength) {
        return false;
    }
    const {byteLength: n} = e;
    for (let i = 0; i < n; ++i) {
        if (e[i] !== t[i]) {
            return false;
        }
    }
    return true;
}

function compare(e, t) {
    if (e === t) {
        return 0;
    }
    const n = e.length;
    const i = t.length;
    const r = Math.min(n, i);
    for (let n = 0; n < r; ++n) {
        if (e[n] !== t[n]) {
            const i = e[n];
            const r = t[n];
            if (i < r) {
                return -1;
            }
            if (r < i) {
                return 1;
            }
            return 0;
        }
    }
    if (n < i) {
        return -1;
    }
    if (i < n) {
        return 1;
    }
    return 0;
}

function areSimilarTypedArrays(e, t) {
    if (e.byteLength !== t.byteLength) {
        return false;
    }
    return compare(new Uint8Array(e.buffer, e.byteOffset, e.byteLength), new Uint8Array(t.buffer, t.byteOffset, t.byteLength)) === 0;
}

function areEqualArrayBuffers(e, t) {
    return e.byteLength === t.byteLength && compare(new Uint8Array(e), new Uint8Array(t)) === 0;
}

function isEqualBoxedPrimitive(e, t) {
    if (isNumberObject(e)) {
        return isNumberObject(t) && P(ne(e), ne(t));
    }
    if (isStringObject(e)) {
        return isStringObject(t) && re(e) === re(t);
    }
    if (isBooleanObject(e)) {
        return isBooleanObject(t) && te(e) === te(t);
    }
    return isSymbolObject(t) && ie(e) === ie(t);
}

function innerDeepEqual(e, t, n, i) {
    if (e === t) {
        if (e !== 0) {
            return true;
        }
        return n ? P(e, t) : true;
    }
    if (n) {
        if (typeof e !== "object") {
            return isNumber(e) && L(e) && L(t);
        }
        if (typeof t !== "object" || e === null || t === null) {
            return false;
        }
        if (q(e) !== q(t)) {
            return false;
        }
    } else {
        if (!isObject(e)) {
            if (!isObject(t)) {
                return e == t;
            }
            return false;
        }
        if (!isObject(t)) {
            return false;
        }
    }
    const r = W(e);
    const a = W(t);
    if (r !== a) {
        return false;
    }
    if (r === "[object URLSearchParams]") {
        return innerDeepEqual(Array.from(e.entries()), Array.from(t.entries()), n, i);
    }
    if (Array.isArray(e)) {
        if (e.length !== t.length) {
            return false;
        }
        const r = getOwnNonIndexProperties(e, false);
        const a = getOwnNonIndexProperties(t, false);
        if (r.length !== a.length) {
            return false;
        }
        return keyCheck(e, t, n, i, 1, r);
    }
    if (r === "[object Object]") {
        return keyCheck(e, t, n, i, 0);
    }
    if (isDate(e)) {
        if (X(e) !== X(t)) {
            return false;
        }
    } else if (isRegExp(e)) {
        if (!areSimilarRegExps(e, t)) {
            return false;
        }
    } else if (isError(e)) {
        if (e.message !== t.message || e.name !== t.name) {
            return false;
        }
    } else if (D(e)) {
        if (!n && (isFloat32Array(e) || isFloat64Array(e))) {
            if (!areSimilarFloatArrays(e, t)) {
                return false;
            }
        } else if (!areSimilarTypedArrays(e, t)) {
            return false;
        }
        const r = getOwnNonIndexProperties(e, false);
        const a = getOwnNonIndexProperties(t, false);
        if (r.length !== a.length) {
            return false;
        }
        return keyCheck(e, t, n, i, 0, r);
    } else if (isSet(e)) {
        if (!isSet(t) || e.size !== t.size) {
            return false;
        }
        return keyCheck(e, t, n, i, 2);
    } else if (isMap(e)) {
        if (!isMap(t) || e.size !== t.size) {
            return false;
        }
        return keyCheck(e, t, n, i, 3);
    } else if (isAnyArrayBuffer(e)) {
        if (!areEqualArrayBuffers(e, t)) {
            return false;
        }
    } else if (isBoxedPrimitive(e) && !isEqualBoxedPrimitive(e, t)) {
        return false;
    }
    return keyCheck(e, t, n, i, 0);
}

function keyCheck(e, t, n, i, r, a) {
    if (arguments.length === 5) {
        a = R(e);
        const n = R(t);
        if (a.length !== n.length) {
            return false;
        }
    }
    let s = 0;
    for (;s < a.length; s++) {
        if (!V(t, a[s])) {
            return false;
        }
    }
    if (n && arguments.length === 5) {
        const n = F(e);
        if (n.length !== 0) {
            let i = 0;
            for (s = 0; s < n.length; s++) {
                const r = n[s];
                if (Q(e, r)) {
                    if (!Q(t, r)) {
                        return false;
                    }
                    a.push(r);
                    i++;
                } else if (Q(t, r)) {
                    return false;
                }
            }
            const r = F(t);
            if (n.length !== r.length && getEnumerables(t, r).length !== i) {
                return false;
            }
        } else {
            const e = F(t);
            if (e.length !== 0 && getEnumerables(t, e).length !== 0) {
                return false;
            }
        }
    }
    if (a.length === 0 && (r === 0 || r === 1 && e.length === 0 || e.size === 0)) {
        return true;
    }
    if (i === void 0) {
        i = {
            val1: new Map,
            val2: new Map,
            position: 0
        };
    } else {
        const n = i.val1.get(e);
        if (n !== void 0) {
            const e = i.val2.get(t);
            if (e !== void 0) {
                return n === e;
            }
        }
        i.position++;
    }
    i.val1.set(e, i.position);
    i.val2.set(t, i.position);
    const o = objEquiv(e, t, n, a, i, r);
    i.val1.delete(e);
    i.val2.delete(t);
    return o;
}

function setHasEqualElement(e, t, n, i) {
    for (const r of e) {
        if (innerDeepEqual(t, r, n, i)) {
            e.delete(r);
            return true;
        }
    }
    return false;
}

function findLooseMatchingPrimitives(e) {
    switch (typeof e) {
      case "undefined":
        return null;

      case "object":
        return undefined;

      case "symbol":
        return false;

      case "string":
        e = +e;

      case "number":
        if (L(e)) {
            return false;
        }
    }
    return true;
}

function setMightHaveLoosePrimitive(e, t, n) {
    const i = findLooseMatchingPrimitives(n);
    if (i != null) {
        return i;
    }
    return t.has(i) && !e.has(i);
}

function mapMightHaveLoosePrimitive(e, t, n, i, r) {
    const a = findLooseMatchingPrimitives(n);
    if (a != null) {
        return a;
    }
    const s = t.get(a);
    if (s === void 0 && !t.has(a) || !innerDeepEqual(i, s, false, r)) {
        return false;
    }
    return !e.has(a) && innerDeepEqual(i, s, false, r);
}

function setEquiv(e, t, n, i) {
    let r = null;
    for (const i of e) {
        if (isObject(i)) {
            if (r === null) {
                r = new Set;
            }
            r.add(i);
        } else if (!t.has(i)) {
            if (n) {
                return false;
            }
            if (!setMightHaveLoosePrimitive(e, t, i)) {
                return false;
            }
            if (r === null) {
                r = new Set;
            }
            r.add(i);
        }
    }
    if (r !== null) {
        for (const a of t) {
            if (isObject(a)) {
                if (!setHasEqualElement(r, a, n, i)) {
                    return false;
                }
            } else if (!n && !e.has(a) && !setHasEqualElement(r, a, n, i)) {
                return false;
            }
        }
        return r.size === 0;
    }
    return true;
}

function mapHasEqualEntry(e, t, n, i, r, a) {
    for (const s of e) {
        if (innerDeepEqual(n, s, r, a) && innerDeepEqual(i, t.get(s), r, a)) {
            e.delete(s);
            return true;
        }
    }
    return false;
}

function mapEquiv(e, t, n, i) {
    let r = null;
    for (const [a, s] of e) {
        if (isObject(a)) {
            if (r === null) {
                r = new Set;
            }
            r.add(a);
        } else {
            const o = t.get(a);
            if (o === void 0 && !t.has(a) || !innerDeepEqual(s, o, n, i)) {
                if (n) {
                    return false;
                }
                if (!mapMightHaveLoosePrimitive(e, t, a, s, i)) {
                    return false;
                }
                if (r === null) {
                    r = new Set;
                }
                r.add(a);
            }
        }
    }
    if (r !== null) {
        for (const [a, s] of t) {
            if (isObject(a)) {
                if (!mapHasEqualEntry(r, e, a, s, n, i)) {
                    return false;
                }
            } else if (!n && (!e.has(a) || !innerDeepEqual(e.get(a), s, false, i)) && !mapHasEqualEntry(r, e, a, s, false, i)) {
                return false;
            }
        }
        return r.size === 0;
    }
    return true;
}

function objEquiv(e, t, n, i, r, a) {
    let s = 0;
    if (a === 2) {
        if (!setEquiv(e, t, n, r)) {
            return false;
        }
    } else if (a === 3) {
        if (!mapEquiv(e, t, n, r)) {
            return false;
        }
    } else if (a === 1) {
        for (;s < e.length; s++) {
            if (V(e, s)) {
                if (!V(t, s) || !innerDeepEqual(e[s], t[s], n, r)) {
                    return false;
                }
            } else if (V(t, s)) {
                return false;
            } else {
                const i = R(e);
                for (;s < i.length; s++) {
                    const a = i[s];
                    if (!V(t, a) || !innerDeepEqual(e[a], t[a], n, r)) {
                        return false;
                    }
                }
                if (i.length !== R(t).length) {
                    return false;
                }
                return true;
            }
        }
    }
    for (s = 0; s < i.length; s++) {
        const a = i[s];
        if (!innerDeepEqual(e[a], t[a], n, r)) {
            return false;
        }
    }
    return true;
}

function isDeepEqual(e, t) {
    return innerDeepEqual(e, t, false);
}

function isDeepStrictEqual(e, t) {
    return innerDeepEqual(e, t, true);
}

class TestContext {
    get wnd() {
        return this.platform.globalThis;
    }
    get doc() {
        return this.platform.document;
    }
    get userAgent() {
        return this.platform.window.navigator.userAgent;
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
    get KeyboardEvent() {
        return this.platform.globalThis.KeyboardEvent;
    }
    get MouseEvent() {
        return this.platform.globalThis.MouseEvent;
    }
    get SubmitEvent() {
        return this.platform.globalThis.SubmitEvent;
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
        if (this.c === void 0) {
            this.c = r.createContainer();
            m.register(this.c);
            this.c.register(a.instance(TestContext, this));
            if (this.c.has(g, true) === false) {
                this.c.register(me);
            }
        }
        return this.c;
    }
    get platform() {
        if (this.p === void 0) {
            this.p = this.container.get(g);
        }
        return this.p;
    }
    get templateCompiler() {
        if (this.t === void 0) {
            this.t = this.container.get(b);
        }
        return this.t;
    }
    get observerLocator() {
        if (this.oL === void 0) {
            this.oL = this.container.get(c);
        }
        return this.oL;
    }
    get domParser() {
        if (this.i === void 0) {
            this.i = this.doc.createElement("div");
        }
        return this.i;
    }
    constructor() {
        this.c = void 0;
        this.p = void 0;
        this.t = void 0;
        this.oL = void 0;
        this.i = void 0;
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

let pe;

let me;

function setPlatform(e) {
    pe = e;
    me = a.instance(g, e);
}

function createContainer(...e) {
    return r.createContainer().register(me, ...e);
}

let ge;

let be;

function isStackOverflowError(e) {
    if (be === undefined) {
        try {
            function overflowStack() {
                overflowStack();
            }
            overflowStack();
        } catch (e) {
            be = e.message;
            ge = e.name;
        }
    }
    return e.name === ge && e.message === be;
}

const ve = B({
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
    stylize: stylizeWithColor
});

const ye = R(ve);

function getUserOptions(e) {
    const t = {};
    for (const n of ye) {
        t[n] = e[n];
    }
    if (e.userOptions !== void 0) {
        N(t, e.userOptions);
    }
    return t;
}

function getInspectContext(e) {
    const t = {
        ...ve,
        budget: {},
        indentationLvl: 0,
        seen: [],
        currentDepth: 0,
        stylize: e.colors ? stylizeWithColor : stylizeNoColor
    };
    for (const n of ye) {
        if (V(e, n)) {
            t[n] = e[n];
        }
    }
    if (t.userOptions === void 0) {
        t.userOptions = e;
    }
    return t;
}

const xe = B({
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

const $e = B({
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

const we = Symbol.for("customInspect");

function stylizeWithColor(e, t) {
    const n = xe[t];
    if (isString(n)) {
        return ae[n](e);
    } else {
        return e;
    }
}

function stylizeNoColor(e, t) {
    return e;
}

class AssertionError extends Error {
    constructor(e) {
        const {actual: t, expected: n, message: i, operator: r, stackStartFn: a} = e;
        const s = Error.stackTraceLimit;
        Error.stackTraceLimit = 0;
        let o = i == null ? "" : `${i} - `;
        if (r === "deepStrictEqual" || r === "strictEqual") {
            super(`${o}${createErrDiff(t, n, r)}`);
        } else if (r === "notDeepStrictEqual" || r === "notStrictEqual") {
            let e = $e[r];
            let n = inspectValue(t).split("\n");
            if (r === "notStrictEqual" && isObject(t)) {
                e = $e.notStrictEqualObject;
            }
            if (n.length > 30) {
                n[26] = ae.blue("...");
                while (n.length > 27) {
                    n.pop();
                }
            }
            if (n.length === 1) {
                super(`${o}${e} ${n[0]}`);
            } else {
                super(`${o}${e}\n\n${join(n, "\n")}\n`);
            }
        } else {
            let e = inspectValue(t);
            let i = "";
            const a = $e[r];
            if (r === "notDeepEqual" || r === "notEqual") {
                e = `${$e[r]}\n\n${e}`;
                if (e.length > 1024) {
                    e = `${e.slice(0, 1021)}...`;
                }
            } else {
                i = `${inspectValue(n)}`;
                if (e.length > 512) {
                    e = `${e.slice(0, 509)}...`;
                }
                if (i.length > 512) {
                    i = `${i.slice(0, 509)}...`;
                }
                if (r === "deepEqual" || r === "equal") {
                    e = `${a}\n\n${e}\n\nshould equal\n\n`;
                } else {
                    i = ` ${r} ${i}`;
                }
            }
            if (!r) {
                i = "";
                e = "";
                o = o.slice(0, -3);
            }
            super(`${o}${e}${i}`);
        }
        Error.stackTraceLimit = s;
        this.generatedMessage = !i || i === "Failed";
        I(this, "name", {
            value: "AssertionError [ERR_ASSERTION]",
            enumerable: false,
            writable: true,
            configurable: true
        });
        this.code = "ERR_ASSERTION";
        this.actual = t;
        this.expected = n;
        this.operator = r;
        if (typeof Error.captureStackTrace === "function") {
            Error.captureStackTrace(this, a);
            this.stack;
        } else {
            Error().stack;
        }
        this.name = "AssertionError";
    }
    toString() {
        return `${this.name} [${this.code}]: ${this.message}`;
    }
    [we](e, t) {
        return inspect(this, {
            ...t,
            customInspect: false,
            depth: 0
        });
    }
}

const Ee = 10;

function createErrDiff(e, t, n) {
    let i = "";
    let r = "";
    let a = 0;
    let s = "";
    let o = false;
    const l = inspectValue(e);
    const u = l.split("\n");
    const c = inspectValue(t).split("\n");
    let f = 0;
    let d = "";
    if (n === "strictEqual" && isObject(e) && isObject(t)) {
        n = "strictEqualObject";
    }
    if (u.length === 1 && c.length === 1 && u[0] !== c[0]) {
        const i = u[0].length + c[0].length;
        if (i <= Ee) {
            if (!isObject(e) && !isObject(t) && (e !== 0 || t !== 0)) {
                return `${$e[n]}\n\n${u[0]} !== ${c[0]}\n`;
            }
        } else if (n !== "strictEqualObject" && i < 80) {
            while (u[0][f] === c[0][f]) {
                f++;
            }
            if (f > 2) {
                d = `\n  ${" ".repeat(f)}^`;
                f = 0;
            }
        }
    }
    let p = u[u.length - 1];
    let m = c[c.length - 1];
    while (p === m) {
        if (f++ < 2) {
            s = `\n  ${p}${s}`;
        } else {
            i = p;
        }
        u.pop();
        c.pop();
        if (u.length === 0 || c.length === 0) {
            break;
        }
        p = u[u.length - 1];
        m = c[c.length - 1];
    }
    const g = Math.max(u.length, c.length);
    if (g === 0) {
        const e = l.split("\n");
        if (e.length > 30) {
            e[26] = ae.blue("...");
            while (e.length > 27) {
                e.pop();
            }
        }
        return `${$e.notIdentical}\n\n${join(e, "\n")}\n`;
    }
    if (f > 3) {
        s = `\n${ae.blue("...")}${s}`;
        o = true;
    }
    if (i !== "") {
        s = `\n  ${i}${s}`;
        i = "";
    }
    let b = 0;
    const v = `${$e[n]}\n${ae.green("+ actual")} ${ae.red("- expected")}`;
    const y = ` ${ae.blue("...")} Lines skipped`;
    for (f = 0; f < g; f++) {
        const e = f - a;
        if (u.length < f + 1) {
            if (e > 1 && f > 2) {
                if (e > 4) {
                    r += `\n${ae.blue("...")}`;
                    o = true;
                } else if (e > 3) {
                    r += `\n  ${c[f - 2]}`;
                    b++;
                }
                r += `\n  ${c[f - 1]}`;
                b++;
            }
            a = f;
            i += `\n${ae.red("-")} ${c[f]}`;
            b++;
        } else if (c.length < f + 1) {
            if (e > 1 && f > 2) {
                if (e > 4) {
                    r += `\n${ae.blue("...")}`;
                    o = true;
                } else if (e > 3) {
                    r += `\n  ${u[f - 2]}`;
                    b++;
                }
                r += `\n  ${u[f - 1]}`;
                b++;
            }
            a = f;
            r += `\n${ae.green("+")} ${u[f]}`;
            b++;
        } else {
            const t = c[f];
            let n = u[f];
            let s = n !== t && (!n.endsWith(",") || n.slice(0, -1) !== t);
            if (s && t.endsWith(",") && t.slice(0, -1) === n) {
                s = false;
                n += ",";
            }
            if (s) {
                if (e > 1 && f > 2) {
                    if (e > 4) {
                        r += `\n${ae.blue("...")}`;
                        o = true;
                    } else if (e > 3) {
                        r += `\n  ${u[f - 2]}`;
                        b++;
                    }
                    r += `\n  ${u[f - 1]}`;
                    b++;
                }
                a = f;
                r += `\n${ae.green("+")} ${n}`;
                i += `\n${ae.red("-")} ${t}`;
                b += 2;
            } else {
                r += i;
                i = "";
                if (e === 1 || f === 0) {
                    r += `\n  ${n}`;
                    b++;
                }
            }
        }
        if (b > 1e3 && f < g - 2) {
            return `${v}${y}\n${r}\n${ae.blue("...")}${i}\n${ae.blue("...")}`;
        }
    }
    return `${v}${o ? y : ""}\n${r}${i}${s}${d}`;
}

const ke = 0;

const Se = 1;

const Ce = 2;

const Oe = new Int8Array(128);

const qe = new Int8Array(128);

for (let e = 0; e < 128; ++e) {
    if (e === 36 || e === 95 || e >= 65 && e <= 90 || e >= 97 && e <= 122) {
        Oe[e] = qe[e] = 1;
    } else if (e >= 49 && e <= 57) {
        qe[e] = 1;
    }
}

function isValidIdentifier(e) {
    if (Oe[e.charCodeAt(0)] !== 1) {
        return false;
    }
    const {length: t} = e;
    for (let n = 1; n < t; ++n) {
        if (qe[e.charCodeAt(n)] !== 1) {
            return false;
        }
    }
    return true;
}

const je = {};

const Ae = 16;

const Te = 0;

const Fe = 1;

const Ie = 2;

function groupArrayElements(e, t) {
    let n = 0;
    let i = 0;
    let r = 0;
    const a = new Array(t.length);
    for (;r < t.length; r++) {
        const s = e.colors ? removeColors(t[r]).length : t[r].length;
        a[r] = s;
        n += s;
        if (i < s) {
            i = s;
        }
    }
    const s = i + 2;
    if (s * 3 + e.indentationLvl < e.breakLength && (n / i > 5 || i <= 6)) {
        const n = 2.5;
        const o = 1;
        const l = Math.min(Math.round(Math.sqrt(n * (s - o) * t.length) / (s - o)), e.compact * 3, 10);
        if (l <= 1) {
            return t;
        }
        const u = [];
        let c = a[0];
        for (r = l; r < a.length; r += l) {
            if (a[r] > c) {
                c = a[r];
            }
        }
        for (r = 0; r < t.length; r += l) {
            let e = t[r].length - a[r];
            let n = t[r].padStart(c + e, " ");
            const s = Math.min(r + l, t.length);
            for (let o = r + 1; o < s; o++) {
                e = t[o].length - a[o];
                n += `, ${t[o].padStart(i + e, " ")}`;
            }
            u.push(n);
        }
        t = u;
    }
    return t;
}

function handleMaxCallStackSize(e, t, n, i, r) {
    if (isStackOverflowError(t)) {
        e.seen.pop();
        e.indentationLvl = r;
        return e.stylize(`[${getCtxStyle(n, i)}: Inspection interrupted prematurely. Maximum call stack size exceeded.]`, "special");
    }
    throw t;
}

const Me = B([ "BYTES_PER_ELEMENT", "length", "byteLength", "byteOffset", "buffer" ]);

function entriesToArray(e) {
    const t = [];
    for (const [n, i] of e) {
        t.push(n, i);
    }
    return t;
}

function isBelowBreakLength(e, t, n) {
    let i = t.length + n;
    if (i + t.length > e.breakLength) {
        return false;
    }
    for (let n = 0; n < t.length; n++) {
        if (e.colors) {
            i += removeColors(t[n]).length;
        } else {
            i += t[n].length;
        }
        if (i > e.breakLength) {
            return false;
        }
    }
    return true;
}

function reduceToSingleString(e, t, n, i, r = false) {
    if (e.compact !== true) {
        if (r) {
            const r = t.length + e.indentationLvl + i[0].length + n.length + 10;
            if (isBelowBreakLength(e, t, r)) {
                return `${n ? `${n} ` : ""}${i[0]} ${join(t, ", ")} ${i[1]}`;
            }
        }
        const a = `\n${" ".repeat(e.indentationLvl)}`;
        return `${n ? `${n} ` : ""}${i[0]}${a}  ${join(t, `,${a}  `)}${a}${i[1]}`;
    }
    if (isBelowBreakLength(e, t, 0)) {
        return `${i[0]}${n ? ` ${n}` : ""} ${join(t, ", ")} ${i[1]}`;
    }
    const a = " ".repeat(e.indentationLvl);
    const s = n === "" && i[0].length === 1 ? " " : `${n ? ` ${n}` : ""}\n${a}  `;
    return `${i[0]}${s}${join(t, `,\n${a}  `)} ${i[1]}`;
}

function getConstructorName(e, t) {
    let n;
    while (e) {
        const t = j(e, "constructor");
        if (!isUndefined(t) && isFunction(t.value) && t.value.name !== "") {
            return t.value.name;
        }
        e = q(e);
        if (n === void 0) {
            n = e;
        }
    }
    if (n === null) {
        return null;
    }
    const i = {
        ...t,
        customInspect: false
    };
    return `<${inspect(n, i)}>`;
}

function getEmptyFormatArray() {
    return [];
}

function getPrefix(e, t, n) {
    if (e === null) {
        if (t !== "") {
            return `[${n}: null prototype] [${t}] `;
        }
        return `[${n}: null prototype] `;
    }
    if (t !== "" && e !== t) {
        return `${e} [${t}] `;
    }
    return `${e} `;
}

const Re = formatPrimitive.bind(null, stylizeNoColor);

function getKeys(e, t) {
    let n;
    const i = F(e);
    if (t) {
        n = T(e);
        if (i.length !== 0) {
            n.push(...i);
        }
    } else {
        n = R(e);
        if (i.length !== 0) {
            n.push(...i.filter((t => Q(e, t))));
        }
    }
    return n;
}

function getCtxStyle(e, t) {
    return e || t || "Object";
}

const Pe = B([ [ isUint8Array, Uint8Array ], [ isUint8ClampedArray, Uint8ClampedArray ], [ isUint16Array, Uint16Array ], [ isUint32Array, Uint32Array ], [ isInt8Array, Int8Array ], [ isInt16Array, Int16Array ], [ isInt32Array, Int32Array ], [ isFloat32Array, Float32Array ], [ isFloat64Array, Float64Array ] ]);

const Be = Pe.length;

function findTypedConstructor(e) {
    for (let t = 0; t < Be; ++t) {
        const [n, i] = Pe[t];
        if (n(e)) {
            return i;
        }
    }
    return void 0;
}

function setIteratorBraces(e, t) {
    if (t !== `${e} Iterator`) {
        if (t !== "") {
            t += "] [";
        }
        t += `${e} Iterator`;
    }
    return [ `[${t}] {`, "}" ];
}

let Ne;

function clazzWithNullPrototype(e, t) {
    if (Ne === undefined) {
        Ne = new Map;
    } else {
        const t = Ne.get(e);
        if (t !== undefined) {
            return t;
        }
    }
    class NullPrototype extends e {
        get [Symbol.toStringTag]() {
            return "";
        }
    }
    I(NullPrototype.prototype.constructor, "name", {
        value: `[${t}: null prototype]`
    });
    Ne.set(e, NullPrototype);
    return NullPrototype;
}

function noPrototypeIterator(e, t, n) {
    let i;
    if (isSet(t)) {
        const e = clazzWithNullPrototype(Set, "Set");
        i = new e(Z(t));
    } else if (isMap(t)) {
        const e = clazzWithNullPrototype(Map, "Map");
        i = new e(ee(t));
    } else if (Array.isArray(t)) {
        const e = clazzWithNullPrototype(Array, "Array");
        i = new e(t.length);
    } else if (isTypedArray(t)) {
        const e = findTypedConstructor(t);
        const n = clazzWithNullPrototype(e, e.name);
        i = new n(t);
    }
    if (i !== undefined) {
        M(i, A(t));
        return formatRaw(e, i, n);
    }
    return void 0;
}

function formatNumber(e, t) {
    return e(P(t, -0) ? "-0" : `${t}`, "number");
}

function formatPrimitive(e, t, n) {
    switch (typeof t) {
      case "string":
        if (n.compact !== true && n.indentationLvl + t.length > n.breakLength && t.length > Ae) {
            const i = n.breakLength - n.indentationLvl;
            const r = Math.max(i, Ae);
            const a = Math.ceil(t.length / r);
            const s = Math.ceil(t.length / a);
            const o = Math.max(s, Ae);
            if (je[o] === void 0) {
                je[o] = new RegExp(`(.|\\n){1,${o}}(\\s|$)|(\\n|.)+?(\\s|$)`, "gm");
            }
            const l = t.match(je[o]);
            if (l.length > 1) {
                const t = " ".repeat(n.indentationLvl);
                let i = `${e(escapeAndQuoteString(l[0]), "string")} +\n`;
                let r = 1;
                for (;r < l.length - 1; r++) {
                    i += `${t}  ${e(escapeAndQuoteString(l[r]), "string")} +\n`;
                }
                i += `${t}  ${e(escapeAndQuoteString(l[r]), "string")}`;
                return i;
            }
        }
        return e(escapeAndQuoteString(t), "string");

      case "number":
        return formatNumber(e, t);

      case "boolean":
        return e(t.toString(), "boolean");

      case "undefined":
        return e("undefined", "undefined");

      case "symbol":
        return e(t.toString(), "symbol");
    }
    throw new Error(`formatPrimitive only handles non-null primitives. Got: ${W(t)}`);
}

function formatError(e) {
    return e.stack || Y(e);
}

function formatSpecialArray(e, t, n, r, a, s) {
    const o = R(t);
    let l = s;
    for (;s < o.length && a.length < r; s++) {
        const u = o[s];
        const c = +u;
        if (c > 2 ** 32 - 2) {
            break;
        }
        if (`${l}` !== u) {
            if (!i(u)) {
                break;
            }
            const t = c - l;
            const n = t > 1 ? "s" : "";
            const s = `<${t} empty item${n}>`;
            a.push(e.stylize(s, "undefined"));
            l = c;
            if (a.length === r) {
                break;
            }
        }
        a.push(formatProperty(e, t, n, u, Se));
        l++;
    }
    const u = t.length - l;
    if (a.length !== r) {
        if (u > 0) {
            const t = u > 1 ? "s" : "";
            const n = `<${u} empty item${t}>`;
            a.push(e.stylize(n, "undefined"));
        }
    } else if (u > 0) {
        a.push(`... ${u} more item${u > 1 ? "s" : ""}`);
    }
    return a;
}

function formatArrayBuffer(e, t) {
    const n = new Uint8Array(t);
    let i = join(n.slice(0, Math.min(e.maxArrayLength, n.length)).map((e => e.toString(16))), " ");
    const r = n.length - e.maxArrayLength;
    if (r > 0) {
        i += ` ... ${r} more byte${r > 1 ? "s" : ""}`;
    }
    return [ `${e.stylize("[Uint8Contents]", "special")}: <${i}>` ];
}

function formatArray(e, t, n) {
    const i = t.length;
    const r = Math.min(Math.max(0, e.maxArrayLength), i);
    const a = i - r;
    const s = [];
    for (let i = 0; i < r; i++) {
        if (!V(t, i)) {
            return formatSpecialArray(e, t, n, r, s, i);
        }
        s.push(formatProperty(e, t, n, i, Se));
    }
    if (a > 0) {
        s.push(`... ${a} more item${a > 1 ? "s" : ""}`);
    }
    return s;
}

function formatTypedArray(e, t, n) {
    const i = Math.min(Math.max(0, e.maxArrayLength), t.length);
    const r = t.length - i;
    const a = new Array(i);
    let s = 0;
    for (;s < i; ++s) {
        a[s] = formatNumber(e.stylize, t[s]);
    }
    if (r > 0) {
        a[s] = `... ${r} more item${r > 1 ? "s" : ""}`;
    }
    if (e.showHidden) {
        e.indentationLvl += 2;
        for (const i of Me) {
            const r = formatValue(e, t[i], n, true);
            a.push(`[${i}]: ${r}`);
        }
        e.indentationLvl -= 2;
    }
    return a;
}

function formatSet(e, t, n) {
    const i = [];
    e.indentationLvl += 2;
    for (const r of t) {
        i.push(formatValue(e, r, n));
    }
    e.indentationLvl -= 2;
    if (e.showHidden) {
        i.push(`[size]: ${e.stylize(t.size.toString(), "number")}`);
    }
    return i;
}

function formatMap(e, t, n) {
    const i = [];
    e.indentationLvl += 2;
    for (const [r, a] of t) {
        i.push(`${formatValue(e, r, n)} => ${formatValue(e, a, n)}`);
    }
    e.indentationLvl -= 2;
    if (e.showHidden) {
        i.push(`[size]: ${e.stylize(t.size.toString(), "number")}`);
    }
    return i;
}

function formatSetIterInner(e, t, n, i) {
    const r = Math.max(e.maxArrayLength, 0);
    const a = Math.min(r, n.length);
    const s = new Array(a);
    e.indentationLvl += 2;
    for (let i = 0; i < a; i++) {
        s[i] = formatValue(e, n[i], t);
    }
    e.indentationLvl -= 2;
    if (i === Te) {
        s.sort();
    }
    const o = n.length - a;
    if (o > 0) {
        s.push(`... ${o} more item${o > 1 ? "s" : ""}`);
    }
    return s;
}

function formatMapIterInner(e, t, n, i) {
    const r = Math.max(e.maxArrayLength, 0);
    const a = n.length / 2;
    const s = a - r;
    const o = Math.min(r, a);
    const l = new Array(o);
    let u = "";
    let c = "";
    let f = " => ";
    let d = 0;
    if (i === Ie) {
        u = "[ ";
        c = " ]";
        f = ", ";
    }
    e.indentationLvl += 2;
    for (;d < o; d++) {
        const i = d * 2;
        l[d] = `${u}${formatValue(e, n[i], t)}` + `${f}${formatValue(e, n[i + 1], t)}${c}`;
    }
    e.indentationLvl -= 2;
    if (i === Te) {
        l.sort();
    }
    if (s > 0) {
        l.push(`... ${s} more item${s > 1 ? "s" : ""}`);
    }
    return l;
}

function formatWeakCollection(e) {
    return [ e.stylize("<items unknown>", "special") ];
}

function formatWeakSet(e, t, n) {
    return formatSetIterInner(e, n, [], Te);
}

function formatWeakMap(e, t, n) {
    return formatMapIterInner(e, n, [], Te);
}

function formatIterator(e, t, n, i) {
    const r = entriesToArray(t.entries());
    if (t instanceof Map) {
        i[0] = i[0].replace(/ Iterator] {$/, " Entries] {");
        return formatMapIterInner(e, n, r, Ie);
    }
    return formatSetIterInner(e, n, r, Fe);
}

function formatPromise(e, t, n) {
    return [ "[object Promise]" ];
}

function formatProperty(e, t, n, i, r) {
    switch (i) {
      case "$controller":
        return `$controller: { id: ${t.$controller.name} } (omitted for brevity)`;

      case "overrideContext":
        return "overrideContext: (omitted for brevity)";
    }
    let a, s;
    let o = " ";
    const l = j(t, i) || {
        value: t[i],
        enumerable: true
    };
    if (l.value !== void 0) {
        const t = r !== ke || e.compact !== true ? 2 : 3;
        e.indentationLvl += t;
        s = formatValue(e, l.value, n);
        if (t === 3) {
            const t = e.colors ? removeColors(s).length : s.length;
            if (e.breakLength < t) {
                o = `\n${" ".repeat(e.indentationLvl)}`;
            }
        }
        e.indentationLvl -= t;
    } else if (l.get !== void 0) {
        const r = l.set !== void 0 ? "Getter/Setter" : "Getter";
        const a = e.stylize;
        const o = "special";
        if (e.getters && (e.getters === true || e.getters === "get" && l.set === void 0 || e.getters === "set" && l.set !== void 0)) {
            try {
                const l = t[i];
                e.indentationLvl += 2;
                if (l === null) {
                    s = `${a(`[${r}:`, o)} ${a("null", "null")}${a("]", o)}`;
                } else if (typeof l === "object") {
                    s = `${a(`[${r}]`, o)} ${formatValue(e, l, n)}`;
                } else {
                    const t = formatPrimitive(a, l, e);
                    s = `${a(`[${r}:`, o)} ${t}${a("]", o)}`;
                }
                e.indentationLvl -= 2;
            } catch (e) {
                const t = `<Inspection threw (${e.message})>`;
                s = `${a(`[${r}:`, o)} ${t}${a("]", o)}`;
            }
        } else {
            s = e.stylize(`[${r}]`, o);
        }
    } else if (l.set !== void 0) {
        s = e.stylize("[Setter]", "special");
    } else {
        s = e.stylize("undefined", "undefined");
    }
    if (r === Se) {
        return s;
    }
    if (isSymbol(i)) {
        const t = escapeString(i.toString());
        a = `[${e.stylize(t, "symbol")}]`;
    } else if (l.enumerable === false) {
        a = `[${escapeString(i.toString())}]`;
    } else if (isValidIdentifier(i)) {
        a = e.stylize(i, "name");
    } else {
        a = e.stylize(escapeAndQuoteString(i), "string");
    }
    return `${a}:${o}${s}`;
}

function formatRaw(e, t, n, i) {
    let r = void 0;
    const a = getConstructorName(t, e);
    switch (a) {
      case "Container":
      case "ObserverLocator":
      case "Window":
        return e.stylize(`${a} (omitted for brevity)`, "special");

      case "Function":
        if (t.name === "Node") {
            return e.stylize("Node constructor (omitted for brevity)", "special");
        }
    }
    let s = t[Symbol.toStringTag];
    if (!isString(s)) {
        s = "";
    }
    let o = "";
    let l = getEmptyFormatArray;
    let u = void 0;
    let c = true;
    let f = 0;
    let d = ke;
    if (t[Symbol.iterator]) {
        c = false;
        if (Array.isArray(t)) {
            r = getOwnNonIndexProperties(t, e.showHidden);
            const n = getPrefix(a, s, "Array");
            u = [ `${n === "Array " ? "" : n}[`, "]" ];
            if (t.length === 0 && r.length === 0) {
                return `${u[0]}]`;
            }
            d = Ce;
            l = formatArray;
        } else if (isSet(t)) {
            r = getKeys(t, e.showHidden);
            const n = getPrefix(a, s, "Set");
            if (t.size === 0 && r.length === 0) {
                return `${n}{}`;
            }
            u = [ `${n}{`, "}" ];
            l = formatSet;
        } else if (isMap(t)) {
            r = getKeys(t, e.showHidden);
            const n = getPrefix(a, s, "Map");
            if (t.size === 0 && r.length === 0) {
                return `${n}{}`;
            }
            u = [ `${n}{`, "}" ];
            l = formatMap;
        } else if (isTypedArray(t)) {
            r = getOwnNonIndexProperties(t, e.showHidden);
            const n = a !== null ? getPrefix(a, s) : getPrefix(a, s, findTypedConstructor(t).name);
            u = [ `${n}[`, "]" ];
            if (t.length === 0 && r.length === 0 && !e.showHidden) {
                return `${u[0]}]`;
            }
            l = formatTypedArray;
            d = Ce;
        } else if (isMapIterator(t)) {
            r = getKeys(t, e.showHidden);
            u = setIteratorBraces("Map", s);
            l = formatIterator;
        } else if (isSetIterator(t)) {
            r = getKeys(t, e.showHidden);
            u = setIteratorBraces("Set", s);
            l = formatIterator;
        } else {
            c = true;
        }
    }
    if (c) {
        r = getKeys(t, e.showHidden);
        u = [ "{", "}" ];
        if (a === "Object") {
            if (isArgumentsObject(t)) {
                u[0] = "[Arguments] {";
            } else if (s !== "") {
                u[0] = `${getPrefix(a, s, "Object")}{`;
            }
            if (r.length === 0) {
                return `${u[0]}}`;
            }
        } else if (isFunction(t)) {
            const n = a || s || "Function";
            let i = `${n}`;
            if (t.name && isString(t.name)) {
                i += `: ${t.name}`;
            }
            if (r.length === 0) {
                return e.stylize(`[${i}]`, "special");
            }
            o = `[${i}]`;
        } else if (isRegExp(t)) {
            o = K(a !== null ? t : new RegExp(t));
            const i = getPrefix(a, s, "RegExp");
            if (i !== "RegExp ") {
                o = `${i}${o}`;
            }
            if (r.length === 0 || n > e.depth && e.depth !== null) {
                return e.stylize(o, "regexp");
            }
        } else if (isDate(t)) {
            o = Number.isNaN(X(t)) ? G(t) : J(t);
            const n = getPrefix(a, s, "Date");
            if (n !== "Date ") {
                o = `${n}${o}`;
            }
            if (r.length === 0) {
                return e.stylize(o, "date");
            }
        } else if (isError(t)) {
            o = formatError(t);
            const n = o.indexOf("\n    at");
            if (n === -1) {
                o = `[${o}]`;
            }
            if (e.indentationLvl !== 0) {
                const n = " ".repeat(e.indentationLvl);
                o = formatError(t).replace(/\n/g, `\n${n}`);
            }
            if (r.length === 0) {
                return o;
            }
            if (e.compact === false && n !== -1) {
                u[0] += `${o.slice(n)}`;
                o = `[${o.slice(0, n)}]`;
            }
        } else if (isAnyArrayBuffer(t)) {
            const n = isArrayBuffer(t) ? "ArrayBuffer" : "SharedArrayBuffer";
            const o = getPrefix(a, s, n);
            if (i === void 0) {
                l = formatArrayBuffer;
            } else if (r.length === 0) {
                return `${o}{ byteLength: ${formatNumber(e.stylize, t.byteLength)} }`;
            }
            u[0] = `${o}{`;
            r.unshift("byteLength");
        } else if (isDataView(t)) {
            u[0] = `${getPrefix(a, s, "DataView")}{`;
            r.unshift("byteLength", "byteOffset", "buffer");
        } else if (isPromise(t)) {
            u[0] = `${getPrefix(a, s, "Promise")}{`;
            l = formatPromise;
        } else if (isWeakSet(t)) {
            u[0] = `${getPrefix(a, s, "WeakSet")}{`;
            l = e.showHidden ? formatWeakSet : formatWeakCollection;
        } else if (isWeakMap(t)) {
            u[0] = `${getPrefix(a, s, "WeakMap")}{`;
            l = e.showHidden ? formatWeakMap : formatWeakCollection;
        } else if (isBoxedPrimitive(t)) {
            let n;
            if (isNumberObject(t)) {
                o = `[Number: ${Re(ne(t), e)}]`;
                n = "number";
            } else if (isStringObject(t)) {
                o = `[String: ${Re(re(t), e)}]`;
                n = "string";
                r = r.slice(t.length);
            } else if (isBooleanObject(t)) {
                o = `[Boolean: ${Re(te(t), e)}]`;
                n = "boolean";
            } else {
                o = `[Symbol: ${Re(ie(t), e)}]`;
                n = "symbol";
            }
            if (r.length === 0) {
                return e.stylize(o, n);
            }
        } else {
            if (a === null) {
                const i = noPrototypeIterator(e, t, n);
                if (i) {
                    return i;
                }
            }
            if (isMapIterator(t)) {
                u = setIteratorBraces("Map", s);
                l = formatIterator;
            } else if (isSetIterator(t)) {
                u = setIteratorBraces("Set", s);
                l = formatIterator;
            } else if (r.length === 0) {
                return `${getPrefix(a, s, "Object")}{}`;
            } else {
                u[0] = `${getPrefix(a, s, "Object")}{`;
            }
        }
    }
    if (n > e.depth && e.depth !== null) {
        return e.stylize(`[${getCtxStyle(a, s)}]`, "special");
    }
    n += 1;
    e.seen.push(t);
    e.currentDepth = n;
    let p;
    const m = e.indentationLvl;
    try {
        p = l(e, t, n, r, u);
        let i;
        const a = pe?.Node != null && !(t instanceof pe.Node);
        for (f = 0; f < r.length; f++) {
            i = r[f];
            if ((a || i === "textContent" || i === "outerHTML") && i !== "$$calls") {
                p.push(formatProperty(e, t, n, r[f], d));
            }
        }
    } catch (t) {
        return handleMaxCallStackSize(e, t, a, s, m);
    }
    e.seen.pop();
    if (e.sorted) {
        const t = e.sorted === true ? undefined : e.sorted;
        if (d === ke) {
            p.sort(t);
        } else if (r.length > 1) {
            const e = p.slice(p.length - r.length).sort(t);
            p.splice(p.length - r.length, r.length, ...e);
        }
    }
    let g = false;
    if (isNumber(e.compact)) {
        const t = p.length;
        if (d === Ce && p.length > 6) {
            p = groupArrayElements(e, p);
        }
        if (e.currentDepth - n < e.compact && t === p.length) {
            g = true;
        }
    }
    const b = reduceToSingleString(e, p, o, u, g);
    const v = e.budget[e.indentationLvl] || 0;
    const y = v + b.length;
    e.budget[e.indentationLvl] = y;
    if (y > 2 ** 27) {
        e.stop = true;
    }
    return b;
}

function formatValue(e, t, n, i) {
    if (typeof t !== "object" && typeof t !== "function") {
        return formatPrimitive(e.stylize, t, e);
    }
    if (t === null) {
        return e.stylize("null", "null");
    }
    if (e.stop !== void 0) {
        const n = getConstructorName(t, e) || t[Symbol.toStringTag];
        return e.stylize(`[${n || "Object"}]`, "special");
    }
    if (e.customInspect) {
        const i = t[we];
        if (isFunction(i) && i !== inspect && !(t.constructor && t.constructor.prototype === t)) {
            const r = e.depth === null ? null : e.depth - n;
            const a = i.call(t, r, getUserOptions(e));
            if (a !== t) {
                if (!isString(a)) {
                    return formatValue(e, a, n);
                }
                return a.replace(/\n/g, `\n${" ".repeat(e.indentationLvl)}`);
            }
        }
    }
    if (e.seen.includes(t)) {
        return e.stylize("[Circular]", "special");
    }
    return formatRaw(e, t, n, i);
}

function inspect(e, t = {}) {
    const n = getInspectContext(t);
    return formatValue(n, e, 0);
}

function inspectValue(e) {
    return inspect(e, {
        compact: false,
        customInspect: false,
        depth: 100,
        maxArrayLength: Infinity,
        showHidden: false,
        breakLength: Infinity,
        showProxy: false,
        sorted: true,
        getters: true
    });
}

function verifyEqual(e, t, n, i, r) {
    if (n === undefined) {
        n = 0;
    }
    if (typeof t !== "object" || t === null) {
        De.strictEqual(e, t, `actual, depth=${n}, prop=${i}, index=${r}`);
        return;
    }
    if (t instanceof Array) {
        for (let r = 0; r < t.length; r++) {
            verifyEqual(e[r], t[r], n + 1, i, r);
        }
        return;
    }
    if (t.nodeType > 0) {
        if (t.nodeType === 11) {
            for (let r = 0; r < t.childNodes.length; r++) {
                verifyEqual(e.childNodes.item(r), t.childNodes.item(r), n + 1, i, r);
            }
        } else {
            De.strictEqual(e.outerHTML, t.outerHTML, `actual.outerHTML, depth=${n}, prop=${i}, index=${r}`);
        }
        return;
    }
    if (e) {
        De.strictEqual(e.constructor.name, t.constructor.name, `actual.constructor.name, depth=${n}, prop=${i}, index=${r}`);
        De.strictEqual(e.toString(), t.toString(), `actual.toString(), depth=${n}, prop=${i}, index=${r}`);
        for (const i of Object.keys(t)) {
            verifyEqual(e[i], t[i], n + 1, i, r);
        }
    }
}

function nextAncestor(e, t) {
    const n = t.parentNode ?? t.host ?? null;
    if (n === null || n === e) {
        return null;
    }
    return n.nextSibling ?? nextAncestor(e, n);
}

function nextNode(e, t) {
    return v.for(t, {
        optional: true
    })?.shadowRoot?.firstChild ?? t.firstChild ?? t.nextSibling ?? nextAncestor(e, t);
}

function getVisibleText(e, t) {
    let n = "";
    let i = v.for(e, {
        optional: true
    })?.shadowRoot?.firstChild ?? e.firstChild;
    while (i !== null) {
        if (i.nodeType === 3) {
            n += i.data;
        }
        i = nextNode(e, i);
    }
    return t && n ? n.replace(/\s\s+/g, " ").trim() : n;
}

function instructionTypeName(e) {
    switch (e) {
      case y.textBinding:
        return "textBinding";

      case y.interpolation:
        return "interpolation";

      case y.propertyBinding:
        return "propertyBinding";

      case y.iteratorBinding:
        return "iteratorBinding";

      case y.listenerBinding:
        return "listenerBinding";

      case y.refBinding:
        return "refBinding";

      case y.stylePropertyBinding:
        return "stylePropertyBinding";

      case y.setProperty:
        return "setProperty";

      case y.setAttribute:
        return "setAttribute";

      case y.hydrateElement:
        return "hydrateElement";

      case y.hydrateAttribute:
        return "hydrateAttribute";

      case y.hydrateTemplateController:
        return "hydrateTemplateController";

      case y.hydrateLetElement:
        return "hydrateLetElement";

      case y.letBinding:
        return "letBinding";

      default:
        return e;
    }
}

function verifyBindingInstructionsEqual(e, t, n, i) {
    if (i === undefined) {
        i = "instruction";
    }
    if (n === undefined) {
        n = [];
    }
    if (!(t instanceof Object) || !(e instanceof Object)) {
        if (e?.nodeType > 0 && typeof t === "string" || typeof e === "string" && t?.nodeType > 0) {
            e = typeof e === "string" ? e : e.outerHTML;
            t = typeof t === "string" ? t : t.outerHTML;
        }
        if (e !== t) {
            if (i.endsWith(".name")) {
                if (String(t) === "unnamed" && String(e).startsWith("unnamed-")) {
                    n.push(`OK   : ${i} === ${t} (${e})`);
                }
            } else if (i.endsWith(".key")) {
                if (String(t).endsWith("unnamed") && /unnamed-\d+$/.test(String(e))) {
                    n.push(`OK   : ${i} === ${t} (${e})`);
                }
            } else {
                if (typeof t === "object" && t != null) {
                    t = JSON.stringify(t);
                }
                if (typeof e === "object" && e != null) {
                    e = JSON.stringify(e);
                }
                if (i.endsWith("type")) {
                    t = instructionTypeName(t);
                    e = instructionTypeName(e);
                }
                n.push(`WRONG: ${i} === ${e} (expected: ${t})`);
            }
        } else {
            n.push(`OK   : ${i} === ${t}`);
        }
    } else if (t instanceof Array) {
        for (let r = 0, a = Math.max(t.length, e.length); r < a; ++r) {
            verifyBindingInstructionsEqual(e[r], t[r], n, `${i}[${r}]`);
        }
    } else if (t.nodeType > 0) {
        if (t.nodeType === 11) {
            for (let r = 0, a = Math.max(t.childNodes.length, e.childNodes.length); r < a; ++r) {
                verifyBindingInstructionsEqual(e.childNodes.item(r), t.childNodes.item(r), n, `${i}.childNodes[${r}]`);
            }
        } else {
            if (e.outerHTML !== t["outerHTML"]) {
                n.push(`WRONG: ${i}.outerHTML === ${e.outerHTML} (expected: ${t["outerHTML"]})`);
            } else {
                n.push(`OK   : ${i}.outerHTML === ${t}`);
            }
        }
    } else if (e) {
        const r = {};
        for (const a in t) {
            verifyBindingInstructionsEqual(e[a], t[a], n, `${i}.${a}`);
            r[a] = true;
        }
        for (const a in e) {
            if (!r[a]) {
                verifyBindingInstructionsEqual(e[a], t[a], n, `${i}.${a}`);
            }
        }
    }
    if (i === "instruction" && n.some((e => e.startsWith("W")))) {
        throw new Error(`Failed assertion: binding instruction mismatch\n  - ${n.join("\n  - ")}`);
    }
}

function ensureTaskQueuesEmpty(t) {
    if (!t) {
        t = C.getOrCreate(globalThis);
    }
    e(t.taskQueue);
    e(t.domWriteQueue);
    e(t.domReadQueue);
}

const Le = Symbol("noException");

function innerFail(e) {
    if (isError(e.message)) {
        throw e.message;
    }
    throw new AssertionError(e);
}

function innerOk(e, t, n, i) {
    if (!n) {
        let r = false;
        if (t === 0) {
            r = true;
            i = "No value argument passed to `assert.ok()`";
        } else if (isError(i)) {
            throw i;
        }
        const a = new AssertionError({
            actual: n,
            expected: true,
            message: i,
            operator: "==",
            stackStartFn: e
        });
        a.generatedMessage = r;
        throw a;
    }
}

class Comparison {
    constructor(e, t, n) {
        for (const i of t) {
            if (i in e) {
                if (!isUndefined(n) && isString(n[i]) && isRegExp(e[i]) && e[i].test(n[i])) {
                    this[i] = n[i];
                } else {
                    this[i] = e[i];
                }
            }
        }
    }
}

function compareExceptionKey(e, t, n, i, r) {
    if (!(n in e) || !isDeepStrictEqual(e[n], t[n])) {
        if (!i) {
            const n = new Comparison(e, r);
            const i = new Comparison(t, r, e);
            const a = new AssertionError({
                actual: n,
                expected: i,
                operator: "deepStrictEqual",
                stackStartFn: throws
            });
            a.actual = e;
            a.expected = t;
            a.operator = "throws";
            throw a;
        }
        innerFail({
            actual: e,
            expected: t,
            message: i,
            operator: "throws",
            stackStartFn: throws
        });
    }
}

function expectedException(e, t, n) {
    if (!isFunction(t)) {
        if (isRegExp(t)) {
            return t.test(e);
        }
        if (isPrimitive(e)) {
            const i = new AssertionError({
                actual: e,
                expected: t,
                message: n,
                operator: "deepStrictEqual",
                stackStartFn: throws
            });
            i.operator = "throws";
            throw i;
        }
        const i = R(t);
        if (isError(t)) {
            i.push("name", "message");
        }
        for (const r of i) {
            if (isString(e[r]) && isRegExp(t[r]) && t[r].test(e[r])) {
                continue;
            }
            compareExceptionKey(e, t, r, n, i);
        }
        return true;
    }
    if (t.prototype !== void 0 && e instanceof t) {
        return true;
    }
    if (Object.prototype.isPrototypeOf.call(Error, t)) {
        return false;
    }
    return t.call({}, e) === true;
}

function getActual(e) {
    try {
        e();
    } catch (e) {
        return e;
    }
    return Le;
}

async function waitForActual(e) {
    let t;
    if (isFunction(e)) {
        t = e();
    } else {
        t = e;
    }
    try {
        await t;
    } catch (e) {
        return e;
    }
    return Le;
}

function expectsError(e, t, n, i) {
    if (isString(n)) {
        i = n;
        n = void 0;
    }
    if (t === Le) {
        let t = "";
        if (n && n.name) {
            t += ` (${n.name})`;
        }
        t += i ? `: ${i}` : ".";
        const r = e.name === "rejects" ? "rejection" : "exception";
        innerFail({
            actual: undefined,
            expected: n,
            operator: e.name,
            message: `Missing expected ${r}${t}`,
            stackStartFn: e
        });
    }
    if (n && expectedException(t, n, i) === false) {
        throw t;
    }
}

function expectsNoError(e, t, n, i) {
    if (t === Le) {
        return;
    }
    if (isString(n)) {
        i = n;
        n = void 0;
    }
    if (!n || expectedException(t, n)) {
        const r = i ? `: ${i}` : ".";
        const a = e.name === "doesNotReject" ? "rejection" : "exception";
        innerFail({
            actual: t,
            expected: n,
            operator: e.name,
            message: `Got unwanted ${a}${r}\nActual message: "${t && t.message}"`,
            stackStartFn: e
        });
    }
    throw t;
}

function throws(e, t, n) {
    expectsError(throws, getActual(e), t, n);
}

async function rejects(e, t, n) {
    expectsError(rejects, await waitForActual(e), t, n);
}

function doesNotThrow(e, t, n) {
    expectsNoError(doesNotThrow, getActual(e), t, n);
}

async function doesNotReject(e, t, n) {
    expectsNoError(doesNotReject, await waitForActual(e), t, n);
}

function ok(...e) {
    innerOk(ok, e.length, ...e);
}

function fail(e = "Failed") {
    if (isError(e)) {
        throw e;
    }
    const t = new AssertionError({
        message: e,
        actual: void 0,
        expected: void 0,
        operator: "fail",
        stackStartFn: fail
    });
    t.generatedMessage = e === "Failed";
    throw t;
}

function visibleTextEqual(e, t, n) {
    const i = getVisibleText(e);
    if (i !== t) {
        innerFail({
            actual: i,
            expected: t,
            message: n,
            operator: "==",
            stackStartFn: visibleTextEqual
        });
    }
}

function equal(e, t, n) {
    if (e != t) {
        innerFail({
            actual: e,
            expected: t,
            message: n,
            operator: "==",
            stackStartFn: equal
        });
    }
}

function typeOf(e, t, n) {
    if (typeof e !== t) {
        innerFail({
            actual: e,
            expected: t,
            message: n,
            operator: "typeof",
            stackStartFn: typeOf
        });
    }
}

function instanceOf(e, t, n) {
    if (!(e instanceof t)) {
        innerFail({
            actual: e,
            expected: t,
            message: n,
            operator: "instanceOf",
            stackStartFn: instanceOf
        });
    }
}

function notInstanceOf(e, t, n) {
    if (e instanceof t) {
        innerFail({
            actual: e,
            expected: t,
            message: n,
            operator: "notInstanceOf",
            stackStartFn: notInstanceOf
        });
    }
}

function includes(e, t, n) {
    if (!e.includes(t)) {
        innerFail({
            actual: e,
            expected: t,
            message: n,
            operator: "includes",
            stackStartFn: includes
        });
    }
}

function notIncludes(e, t, n) {
    if (e.includes(t)) {
        innerFail({
            actual: e,
            expected: t,
            message: n,
            operator: "notIncludes",
            stackStartFn: notIncludes
        });
    }
}

function contains(e, t, n) {
    if (!e.contains(t)) {
        innerFail({
            actual: e,
            expected: t,
            message: n,
            operator: "contains",
            stackStartFn: contains
        });
    }
}

function notContains(e, t, n) {
    if (e.contains(t)) {
        innerFail({
            actual: e,
            expected: t,
            message: n,
            operator: "notContains",
            stackStartFn: notContains
        });
    }
}

function greaterThan(e, t, n) {
    if (!(e > t)) {
        innerFail({
            actual: e,
            expected: t,
            message: n,
            operator: "greaterThan",
            stackStartFn: greaterThan
        });
    }
}

function greaterThanOrEqualTo(e, t, n) {
    if (!(e >= t)) {
        innerFail({
            actual: e,
            expected: t,
            message: n,
            operator: "greaterThanOrEqualTo",
            stackStartFn: greaterThanOrEqualTo
        });
    }
}

function lessThan(e, t, n) {
    if (!(e < t)) {
        innerFail({
            actual: e,
            expected: t,
            message: n,
            operator: "lessThan",
            stackStartFn: lessThan
        });
    }
}

function lessThanOrEqualTo(e, t, n) {
    if (!(e <= t)) {
        innerFail({
            actual: e,
            expected: t,
            message: n,
            operator: "lessThanOrEqualTo",
            stackStartFn: lessThanOrEqualTo
        });
    }
}

function notEqual(e, t, n) {
    if (e == t) {
        innerFail({
            actual: e,
            expected: t,
            message: n,
            operator: "!=",
            stackStartFn: notEqual
        });
    }
}

function deepEqual(e, t, n) {
    if (!isDeepEqual(e, t)) {
        innerFail({
            actual: e,
            expected: t,
            message: n,
            operator: "deepEqual",
            stackStartFn: deepEqual
        });
    }
}

function notDeepEqual(e, t, n) {
    if (isDeepEqual(e, t)) {
        innerFail({
            actual: e,
            expected: t,
            message: n,
            operator: "notDeepEqual",
            stackStartFn: notDeepEqual
        });
    }
}

function deepStrictEqual(e, t, n) {
    if (!isDeepStrictEqual(e, t)) {
        innerFail({
            actual: e,
            expected: t,
            message: n,
            operator: "deepStrictEqual",
            stackStartFn: deepStrictEqual
        });
    }
}

function notDeepStrictEqual(e, t, n) {
    if (isDeepStrictEqual(e, t)) {
        innerFail({
            actual: e,
            expected: t,
            message: n,
            operator: "notDeepStrictEqual",
            stackStartFn: notDeepStrictEqual
        });
    }
}

function strictEqual(e, t, n) {
    if (!P(e, t)) {
        innerFail({
            actual: e,
            expected: t,
            message: n,
            operator: "strictEqual",
            stackStartFn: strictEqual
        });
    }
}

function notStrictEqual(e, t, n) {
    if (P(e, t)) {
        innerFail({
            actual: e,
            expected: t,
            message: n,
            operator: "notStrictEqual",
            stackStartFn: notStrictEqual
        });
    }
}

function match(e, t, n) {
    if (!t.test(e)) {
        innerFail({
            actual: e,
            expected: t,
            message: n,
            operator: "match",
            stackStartFn: match
        });
    }
}

function notMatch(e, t, n) {
    if (t.test(e)) {
        innerFail({
            actual: e,
            expected: t,
            message: n,
            operator: "notMatch",
            stackStartFn: notMatch
        });
    }
}

function isCustomElementType(e, t) {
    if (!v.isType(e)) {
        innerFail({
            actual: false,
            expected: true,
            message: t,
            operator: "isCustomElementType",
            stackStartFn: isCustomElementType
        });
    }
}

function isCustomAttributeType(e, t) {
    if (!x.isType(e)) {
        innerFail({
            actual: false,
            expected: true,
            message: t,
            operator: "isCustomAttributeType",
            stackStartFn: isCustomElementType
        });
    }
}

function getNode(e, t = pe.document) {
    return typeof e === "string" ? t.querySelector(e) : e;
}

function isTextContentEqual(e, t, n, i) {
    const r = getNode(e, i);
    const a = r && getVisibleText(r, true);
    if (a !== t) {
        innerFail({
            actual: a,
            expected: t,
            message: n,
            operator: "==",
            stackStartFn: isTextContentEqual
        });
    }
}

function isValueEqual(e, t, n, i) {
    const r = getNode(e, i);
    const a = r instanceof HTMLInputElement && r.value;
    if (a !== t) {
        innerFail({
            actual: a,
            expected: t,
            message: n,
            operator: "==",
            stackStartFn: isValueEqual
        });
    }
}

function isInnerHtmlEqual(e, t, n, i, r = true) {
    const a = getNode(e, i);
    let s = a.innerHTML;
    if (r) {
        s = s.replace(/<!--au-start-->/g, "").replace(/<!--au-end-->/g, "").replace(/\s+/g, " ").trim();
    }
    if (s !== t) {
        innerFail({
            actual: s,
            expected: t,
            message: n,
            operator: "==",
            stackStartFn: isInnerHtmlEqual
        });
    }
}

function matchStyle(e, t) {
    const n = pe.window.getComputedStyle(e);
    for (const [e, i] of Object.entries(t)) {
        const t = n[e];
        if (t !== i) {
            return {
                isMatch: false,
                property: e,
                actual: t,
                expected: i
            };
        }
    }
    return {
        isMatch: true
    };
}

function computedStyle(e, t, n) {
    const i = matchStyle(e, t);
    if (!i.isMatch) {
        const {property: e, actual: t, expected: r} = i;
        innerFail({
            actual: `${e}:${t}`,
            expected: `${e}:${r}`,
            message: n,
            operator: "==",
            stackStartFn: computedStyle
        });
    }
}

function notComputedStyle(e, t, n) {
    const i = matchStyle(e, t);
    if (i.isMatch) {
        const e = Object.entries(t).map((([e, t]) => `${e}:${t}`)).join(",");
        innerFail({
            actual: e,
            expected: e,
            message: n,
            operator: "!=",
            stackStartFn: notComputedStyle
        });
    }
}

const ze = function() {
    function round(e) {
        return (e * 10 + .5 | 0) / 10;
    }
    function reportTask(e) {
        const t = e.id;
        const n = round(e.createdTime);
        const i = round(e.queueTime);
        const r = e.preempt;
        const a = e.reusable;
        const s = e.persistent;
        const o = e.status;
        return `    task id=${t} createdTime=${n} queueTime=${i} preempt=${r} reusable=${a} persistent=${s} status=${o}\n` + `    task callback="${e.callback?.toString()}"`;
    }
    function $reportTaskQueue(e, n) {
        const {processing: i, pending: r, delayed: a, flushRequested: s} = t(n);
        let o = `${e} has processing=${i.length} pending=${r.length} delayed=${a.length} flushRequested=${s}\n\n`;
        if (i.length > 0) {
            o += `  Tasks in processing:\n${i.map(reportTask).join("")}`;
        }
        if (r.length > 0) {
            o += `  Tasks in pending:\n${r.map(reportTask).join("")}`;
        }
        if (a.length > 0) {
            o += `  Tasks in delayed:\n${a.map(reportTask).join("")}`;
        }
        return o;
    }
    return function $areTaskQueuesEmpty(e) {
        const t = C.getOrCreate(globalThis);
        const n = t.domWriteQueue;
        const i = t.taskQueue;
        const r = t.domReadQueue;
        let a = true;
        let s = "";
        if (!n.isEmpty) {
            s += `\n${$reportTaskQueue("domWriteQueue", n)}\n\n`;
            a = false;
        }
        if (!i.isEmpty) {
            s += `\n${$reportTaskQueue("taskQueue", i)}\n\n`;
            a = false;
        }
        if (!r.isEmpty) {
            s += `\n${$reportTaskQueue("domReadQueue", r)}\n\n`;
            a = false;
        }
        if (!a) {
            if (e === true) {
                ensureTaskQueuesEmpty(t);
            }
            innerFail({
                actual: void 0,
                expected: void 0,
                message: s,
                operator: "",
                stackStartFn: $areTaskQueuesEmpty
            });
        }
    };
}();

const De = B({
    throws: throws,
    doesNotThrow: doesNotThrow,
    rejects: rejects,
    doesNotReject: doesNotReject,
    ok: ok,
    fail: fail,
    equal: equal,
    typeOf: typeOf,
    instanceOf: instanceOf,
    notInstanceOf: notInstanceOf,
    includes: includes,
    notIncludes: notIncludes,
    contains: contains,
    notContains: notContains,
    greaterThan: greaterThan,
    greaterThanOrEqualTo: greaterThanOrEqualTo,
    lessThan: lessThan,
    lessThanOrEqualTo: lessThanOrEqualTo,
    notEqual: notEqual,
    deepEqual: deepEqual,
    notDeepEqual: notDeepEqual,
    deepStrictEqual: deepStrictEqual,
    notDeepStrictEqual: notDeepStrictEqual,
    strictEqual: strictEqual,
    notStrictEqual: notStrictEqual,
    match: match,
    notMatch: notMatch,
    visibleTextEqual: visibleTextEqual,
    areTaskQueuesEmpty: ze,
    isCustomElementType: isCustomElementType,
    isCustomAttributeType: isCustomAttributeType,
    strict: {
        deepEqual: deepStrictEqual,
        notDeepEqual: notDeepStrictEqual,
        equal: strictEqual,
        notEqual: notStrictEqual
    },
    html: {
        textContent: isTextContentEqual,
        innerEqual: isInnerHtmlEqual,
        value: isValueEqual,
        computedStyle: computedStyle,
        notComputedStyle: notComputedStyle
    }
});

const Ve = {
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

const Qe = [ ":after", ":before", ":backdrop", ":cue", ":first-letter", ":first-line", ":selection", ":placeholder" ];

const He = [ "xml:lang", "xml:base", "accesskey", "autocapitalize", "aria-foo", "class", "contenteditable", "contextmenu", "data-foo", "dir", "draggable", "dropzone", "hidden", "id", "is", "itemid", "itemprop", "itemref", "itemscope", "itemtype", "lang", "slot", "spellcheck", "style", "tabindex", "title", "translate", "onabort", "onautocomplete", "onautocompleteerror", "onblur", "oncancel", "oncanplay", "oncanplaythrough", "onchange", "onclick", "onclose", "oncontextmenu", "oncuechange", "ondblclick", "ondrag", "ondragend", "ondragenter", "ondragexit", "ondragleave", "ondragover", "ondragstart", "ondrop", "ondurationchange", "onemptied", "onended", "onerror", "onfocus", "oninput", "oninvalid", "onkeydown", "onkeypress", "onkeyup", "onload", "onloadeddata", "onloadedmetadata", "onloadstart", "onmousedown", "onmouseenter", "onmouseleave", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onmousewheel", "onpause", "onplay", "onplaying", "onprogress", "onratechange", "onreset", "onresize", "onscroll", "onseeked", "onseeking", "onselect", "onshow", "onsort", "onstalled", "onsubmit", "onsuspend", "ontimeupdate", "ontoggle", "onvolumechange", "onwaiting" ];

function eachCartesianJoinFactory(e, t) {
    e = e.slice(0).filter((e => e.length > 0));
    if (typeof t !== "function") {
        throw new Error("Callback is not a function");
    }
    if (e.length === 0) {
        return;
    }
    const n = e.reduce(((e, t) => e *= t.length), 1);
    const i = Array(e.length).fill(0);
    const r = [];
    let a = null;
    try {
        a = updateElementByIndicesFactory(e, Array(e.length), i);
        t(...a);
    } catch (e) {
        r.push(e);
    }
    let s = 1;
    if (n === s) {
        return;
    }
    let o = false;
    while (!o) {
        const l = updateIndices(e, i);
        if (l) {
            try {
                t(...updateElementByIndicesFactory(e, a, i));
            } catch (e) {
                r.push(e);
            }
            s++;
            if (n < s) {
                throw new Error("Invalid loop implementation.");
            }
        } else {
            o = true;
        }
    }
    if (r.length > 0) {
        const e = `eachCartesionJoinFactory failed to load ${r.length} tests:\n\n${r.map((e => e.message)).join("\n")}`;
        throw new Error(e);
    }
}

function updateElementByIndicesFactory(e, t, n) {
    for (let i = 0, r = e.length; r > i; ++i) {
        t[i] = e[i][n[i]](...t);
    }
    return t;
}

function eachCartesianJoin(e, t) {
    e = e.slice(0).filter((e => e.length > 0));
    if (typeof t !== "function") {
        throw new Error("Callback is not a function");
    }
    if (e.length === 0) {
        return;
    }
    const n = e.reduce(((e, t) => e *= t.length), 1);
    const i = Array(e.length).fill(0);
    const r = updateElementByIndices(e, Array(e.length), i);
    t(...r, 0);
    let a = 1;
    if (n === a) {
        return;
    }
    let s = false;
    while (!s) {
        const o = updateIndices(e, i);
        if (o) {
            t(...updateElementByIndices(e, r, i), a);
            a++;
            if (n < a) {
                throw new Error("Invalid loop implementation.");
            }
        } else {
            s = true;
        }
    }
}

async function eachCartesianJoinAsync(e, t) {
    e = e.slice(0).filter((e => e.length > 0));
    if (typeof t !== "function") {
        throw new Error("Callback is not a function");
    }
    if (e.length === 0) {
        return;
    }
    const n = e.reduce(((e, t) => e *= t.length), 1);
    const i = Array(e.length).fill(0);
    const r = updateElementByIndices(e, Array(e.length), i);
    await t(...r, 0);
    let a = 1;
    if (n === a) {
        return;
    }
    let s = false;
    while (!s) {
        const o = updateIndices(e, i);
        if (o) {
            await t(...updateElementByIndices(e, r, i), a);
            a++;
            if (n < a) {
                throw new Error("Invalid loop implementation.");
            }
        } else {
            s = true;
        }
    }
}

function updateIndices(e, t) {
    let n = e.length;
    while (n--) {
        if (t[n] === e[n].length - 1) {
            if (n === 0) {
                return false;
            }
            continue;
        }
        t[n] += 1;
        for (let i = n + 1, r = e.length; r > i; ++i) {
            t[i] = 0;
        }
        return true;
    }
    return false;
}

function updateElementByIndices(e, t, n) {
    for (let i = 0, r = e.length; r > i; ++i) {
        t[i] = e[i][n[i]];
    }
    return t;
}

function* generateCartesianProduct(e) {
    const [t, ...n] = e;
    const i = n.length > 0 ? generateCartesianProduct(n) : [ [] ];
    for (const e of i) {
        for (const n of t) {
            yield [ n, ...e ];
        }
    }
}

function h(e, t = null, ...n) {
    const i = pe.document;
    const r = i.createElement(e);
    for (const e in t) {
        if (e === "class" || e === "className" || e === "cls") {
            let n = t[e];
            n = n === undefined || n === null ? o : Array.isArray(n) ? n : `${n}`.split(" ");
            r.classList.add(...n.filter(Boolean));
        } else if (e in r || e === "data" || e.startsWith("_")) {
            r[e.replace(/^_/, "")] = t[e];
        } else {
            r.setAttribute(e, t[e]);
        }
    }
    const a = r.tagName === "TEMPLATE" ? r.content : r;
    for (const e of n) {
        if (e === null || e === undefined) {
            continue;
        }
        a.appendChild(isNodeOrTextOrComment(e) ? e : i.createTextNode(`${e}`));
    }
    return r;
}

function isNodeOrTextOrComment(e) {
    return e.nodeType > 0;
}

const Ue = {
    delegate: 1,
    capture: 1,
    call: 1
};

const hJsx = function(e, t, ...n) {
    const i = this || pe.document;
    const r = i.createElement(e === "let$" ? "let" : e);
    if (t != null) {
        let e;
        for (const n in t) {
            e = t[n];
            if (n === "class" || n === "className" || n === "cls") {
                e = e == null ? [] : Array.isArray(e) ? e : `${e}`.split(" ");
                r.classList.add(...e);
            } else if (n in r || n === "data" || n.startsWith("_")) {
                r[n] = e;
            } else if (n === "asElement") {
                r.setAttribute("as-element", e);
            } else {
                if (n.startsWith("o") && n[1] === "n" && !n.endsWith("$")) {
                    const t = s(n.slice(2));
                    const i = t.split("-");
                    if (i.length > 1) {
                        const t = i[i.length - 1];
                        const n = Ue[t] ? t : "trigger";
                        r.setAttribute(`${i.slice(0, -1).join("-")}.${n}`, e);
                    } else {
                        r.setAttribute(`${i[0]}.trigger`, e);
                    }
                } else {
                    const t = n.split("$");
                    if (t.length === 1) {
                        r.setAttribute(s(n), e);
                    } else {
                        if (t[t.length - 1] === "") {
                            t[t.length - 1] = "bind";
                        }
                        r.setAttribute(t.map(s).join("."), e);
                    }
                }
            }
        }
    }
    const a = r.content != null ? r.content : r;
    for (const e of n) {
        if (e == null) {
            continue;
        }
        if (Array.isArray(e)) {
            for (const t of e) {
                a.appendChild(t instanceof pe.Node ? t : i.createTextNode(`${t}`));
            }
        } else {
            a.appendChild(e instanceof pe.Node ? e : i.createTextNode(`${e}`));
        }
    }
    return r;
};

hJsx.Fragment = "template";

const We = new l;

const onFixtureCreated = e => We.subscribe("fixture:created", (t => {
    try {
        e(t);
    } catch (e) {
        console.log("(!) Error in fixture:created callback");
        console.log(e);
    }
}));

function createFixture(e, t, n = [], i = true, r = TestContext.create(), a = {}) {
    const {container: s} = r;
    s.register(...n);
    const {platform: o, observerLocator: l} = r;
    const c = r.doc.body.appendChild(r.createElement("div"));
    const f = c.appendChild(r.createElement("app"));
    const d = new $(s);
    const p = typeof t === "function" ? t : t == null ? class {} : function $Ctor() {
        Object.setPrototypeOf(t, $Ctor.prototype);
        return t;
    };
    const m = [ "aliases", "bindables", "cache", "capture", "containerless", "dependencies", "enhance" ];
    if (p !== t && t != null) {
        m.forEach((e => {
            O.define(v.getAnnotation(t, e, null), p, e);
        }));
    }
    const g = v.isType(p) ? v.getDefinition(p) : {};
    const b = v.define({
        ...g,
        name: g.name ?? "app",
        template: e
    }, p);
    if (s.has(b, true)) {
        throw new Error("Container of the context contains instance of the application root component. " + "Consider using a different class, or context as it will likely cause surprises in tests.");
    }
    const y = s.get(b);
    let x = void 0;
    function startFixtureApp() {
        if (i) {
            try {
                d.app({
                    host: f,
                    component: y,
                    ...a
                });
                k.startPromise = x = d.start();
            } catch (e) {
                try {
                    const dispose = () => {
                        c.remove();
                        d.dispose();
                    };
                    const e = d.stop();
                    if (e instanceof Promise) void e.then(dispose); else dispose();
                } catch {
                    console.warn("(!) corrupted fixture state, should isolate the failing test and restart the run" + "as it is likely that this failing fixture creation will pollute others.");
                }
                throw e;
            }
        }
    }
    let w = 0;
    const getBy = e => {
        const t = f.querySelectorAll(e);
        if (t.length > 1) {
            throw new Error(`There is more than 1 element with selector "${e}": ${t.length} found`);
        }
        if (t.length === 0) {
            throw new Error(`No element found for selector: "${e}"`);
        }
        return t[0];
    };
    function getAllBy(e) {
        return Array.from(f.querySelectorAll(e));
    }
    function queryBy(e) {
        const t = f.querySelectorAll(e);
        if (t.length > 1) {
            throw new Error(`There is more than 1 element with selector "${e}": ${t.length} found`);
        }
        return t.length === 0 ? null : t[0];
    }
    function strictQueryBy(e, t = "") {
        const n = f.querySelectorAll(e);
        if (n.length > 1) {
            throw new Error(`There is more than 1 element with selector "${e}": ${n.length} found${t ? ` ${t}` : ""}`);
        }
        if (n.length === 0) {
            throw new Error(`There is no element with selector "${e}" found${t ? ` ${t}` : ""}`);
        }
        return n[0];
    }
    function assertText(e, t, n) {
        let i;
        let r;
        if (arguments.length === 1) {
            De.strictEqual(getVisibleText(f, false), e);
            return;
        }
        if (t == null) {
            throw new Error("Invalid null/undefined expected html value");
        }
        if (typeof t !== "string") {
            i = e;
            r = t;
            De.strictEqual(getVisibleText(f, r?.compact), i);
            return;
        }
        const a = strictQueryBy(e, `to compare text content against "${t}`);
        r = n;
        De.strictEqual(getVisibleText(a, r?.compact), t);
    }
    function assertTextContain(e, t) {
        if (arguments.length === 2) {
            const n = strictQueryBy(e);
            if (n === null) {
                throw new Error(`No element found for selector "${e}" to compare text content with "${t}"`);
            }
            De.includes(getVisibleText(n), t);
        } else {
            De.includes(getVisibleText(f), e);
        }
    }
    function getInnerHtml(e, t) {
        let n = e.innerHTML;
        if (t) {
            n = n.trim().replace(/<!--au-start-->/g, "").replace(/<!--au-end-->/g, "").replace(/\s+/g, " ");
        }
        return n;
    }
    function assertHtml(e, t, n) {
        let i;
        let r;
        if (arguments.length === 1) {
            De.strictEqual(getInnerHtml(f), e);
            return;
        }
        if (t == null) {
            throw new Error("Invalid null/undefined expected html value");
        }
        if (typeof t !== "string") {
            i = e;
            r = t;
            De.strictEqual(getInnerHtml(f, r?.compact), i);
            return;
        }
        const a = strictQueryBy(e, `to compare innerHTML against "${t}`);
        r = n;
        De.strictEqual(getInnerHtml(a, r?.compact), t);
    }
    function assertClass(e, ...t) {
        const n = strictQueryBy(e, `to assert className contains "${t}"`);
        t.forEach((e => De.contains(n.classList, e)));
    }
    function assertAttr(e, t, n) {
        const i = strictQueryBy(e, `to compare attribute "${t}" against "${n}"`);
        De.strictEqual(i.getAttribute(t), n);
    }
    function assertAttrNS(e, t, n, i) {
        const r = strictQueryBy(e, `to compare attribute "${n}" against "${i}"`);
        De.strictEqual(r.getAttributeNS(t, n), i);
    }
    function assertStyles(e, t) {
        const n = strictQueryBy(e, `to compare style attribute against ${JSON.stringify(t ?? {})}`);
        const i = {};
        for (const e in t) {
            i[e] = n.style[e];
        }
        De.deepStrictEqual(i, t);
    }
    function assertValue(e, t) {
        const n = strictQueryBy(e, `to compare value against "${t}"`);
        De.strictEqual(n.value, t);
    }
    function trigger(e, t, n, i) {
        const a = strictQueryBy(e, `to fire event "${t}"`);
        return $triggerEvent(a, r, t, n, i);
    }
    Ke.forEach((e => {
        Object.defineProperty(trigger, e, {
            configurable: true,
            writable: true,
            value: (t, n, i) => triggerMouseEvent(strictQueryBy(t, `to fire event "${e}"`), r, e, n, i)
        });
    }));
    Je.forEach((e => {
        Object.defineProperty(trigger, e, {
            configurable: true,
            writable: true,
            value: (t, n, i) => triggerKeyboardEvent(strictQueryBy(t, `to fire event "${e}"`), r, e, n, i)
        });
    }));
    [ "change", "input", "scroll" ].forEach((e => {
        Object.defineProperty(trigger, e, {
            configurable: true,
            writable: true,
            value: (t, n, i) => $triggerEvent(strictQueryBy(t, `to fire event "${e}"`), r, e, n, i)
        });
    }));
    function type(e, t) {
        const n = typeof e === "string" ? strictQueryBy(e, `to emulate input for "${t}"`) : e;
        if (n === null || !/input|textarea/i.test(n.nodeName)) {
            throw new Error(`No <input>/<textarea> element found for selector "${e}" to emulate input for "${t}"`);
        }
        n.value = t;
        n.dispatchEvent(new o.window.Event("input"));
    }
    const scrollBy = (e, t) => {
        const n = strictQueryBy(e, `to scroll by "${JSON.stringify(t)}"`);
        n.scrollBy(typeof t === "number" ? {
            top: t
        } : t);
        n.dispatchEvent(new o.window.Event("scroll"));
    };
    const flush = e => {
        r.platform.domWriteQueue.flush(e);
    };
    const stop = (e = false) => {
        let t = void 0;
        try {
            t = d.stop(e);
        } finally {
            if (e) {
                if (++w > 1) {
                    console.log("(!) Fixture has already been torn down");
                } else {
                    const $dispose = () => {
                        c.remove();
                        d.dispose();
                    };
                    if (t instanceof Promise) {
                        t = t.then($dispose);
                    } else {
                        $dispose();
                    }
                }
            }
        }
        return t;
    };
    let E;
    const k = new class Results {
        constructor() {
            this.startPromise = x;
            this.ctx = r;
            this.container = s;
            this.platform = o;
            this.testHost = c;
            this.appHost = f;
            this.au = d;
            this.component = y;
            this.observerLocator = l;
            this.logger = s.get(u);
            this.hJsx = hJsx.bind(r.doc);
            this.stop = stop;
            this.getBy = getBy;
            this.getAllBy = getAllBy;
            this.queryBy = queryBy;
            this.assertText = assertText;
            this.assertTextContain = assertTextContain;
            this.assertHtml = assertHtml;
            this.assertClass = assertClass;
            this.assertAttr = assertAttr;
            this.assertAttrNS = assertAttrNS;
            this.assertStyles = assertStyles;
            this.assertValue = assertValue;
            this.createEvent = (e, t) => new o.CustomEvent(e, t);
            this.trigger = trigger;
            this.type = type;
            this.scrollBy = scrollBy;
            this.flush = flush;
        }
        start() {
            return (E ??= d.app({
                host: f,
                component: y
            })).start();
        }
        tearDown() {
            return stop(true);
        }
        get torn() {
            return w > 0;
        }
        get started() {
            if (x instanceof Promise) {
                return Promise.resolve(x).then((() => this));
            }
            return Promise.resolve(this);
        }
        printHtml() {
            const e = f.innerHTML;
            console.log(e);
            return e;
        }
    };
    We.publish("fixture:created", k);
    startFixtureApp();
    return k;
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
    config(e) {
        this.cf = e;
        return this;
    }
    build() {
        if (this.u === void 0) {
            throw new Error("Builder is not ready, missing template, call .html()/.html`` first");
        }
        return createFixture(typeof this.u === "string" ? this.u : brokenProcessFastTemplate(this.u, ...this.h ?? []), this.$, this.C);
    }
}

function brokenProcessFastTemplate(e, ...t) {
    let n = e[0];
    for (let i = 0; i < t.length; ++i) {
        n += String(t[i]) + e[i + 1];
    }
    return n;
}

createFixture.html = (e, ...t) => (new FixtureBuilder).html(e, ...t);

createFixture.component = e => (new FixtureBuilder).component(e);

createFixture.deps = (...e) => (new FixtureBuilder).deps(...e);

createFixture.config = e => (new FixtureBuilder).config(e);

const Ke = [ "click", "mousedown", "mouseup", "mousemove", "dbclick", "contextmenu" ];

const Je = [ "keydown", "keyup", "keypress" ];

function $triggerEvent(e, t, n, i, r) {
    if (Ke.includes(n)) {
        return triggerMouseEvent(e, t, n, i, r);
    }
    if (Je.includes(n)) {
        return triggerKeyboardEvent(e, t, n, i, r);
    }
    const a = new t.CustomEvent(n, i);
    if (r !== void 0) {
        for (const e in r) {
            Object.defineProperty(a, e, {
                value: r[e]
            });
        }
    }
    e.dispatchEvent(a);
}

function triggerKeyboardEvent(e, t, n, i, r) {
    const a = new t.KeyboardEvent(n, i);
    if (r !== void 0) {
        for (const e in r) {
            Object.defineProperty(a, e, {
                value: r[e]
            });
        }
    }
    e.dispatchEvent(a);
}

function triggerMouseEvent(e, t, n, i, r) {
    const a = new t.MouseEvent(n, i);
    if (r !== void 0) {
        for (const e in r) {
            Object.defineProperty(a, e, {
                value: r[e]
            });
        }
    }
    e.dispatchEvent(a);
}

Ke.forEach((e => {
    Object.defineProperty($triggerEvent, e, {
        configurable: true,
        writable: true,
        value: (t, n, i, r) => triggerMouseEvent(t, n, e, i, r)
    });
}));

Je.forEach((e => {
    Object.defineProperty($triggerEvent, e, {
        configurable: true,
        writable: true,
        value: (t, n, i, r) => triggerKeyboardEvent(t, n, e, i, r)
    });
}));

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
        this.$kind = "Custom";
        this.hasBind = true;
        this.hasUnbind = true;
        this.calls = [];
    }
    evaluate(...e) {
        this.trace("evaluate", ...e);
        return w(this.inner, ...e);
    }
    assign(...e) {
        this.trace("assign", ...e);
        return E(this.inner, ...e);
    }
    bind(...e) {
        this.trace("bind", ...e);
        k(this.inner, ...e);
    }
    unbind(...e) {
        this.trace("unbind", ...e);
        S(this.inner, ...e);
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
        for (const t of e) {
            this[t] = this[`$${t}`];
        }
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
        if (!t.startsWith("/")) {
            t = `/${t}`;
        }
        return t;
    }
    get search() {
        const e = this.parts;
        e.shift();
        const t = e.shift();
        return t !== undefined ? `?${t}` : "";
    }
    get hash() {
        const e = this.parts;
        e.shift();
        e.shift();
        const t = e.shift();
        return t !== undefined ? `#${t}` : "";
    }
    set hash(e) {
        if (e.startsWith("#")) {
            e = e.substring(1);
        }
        const t = this.parts;
        let n = t.shift();
        const i = t.shift();
        if (i !== undefined) {
            n += `?${i}`;
        }
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
        const e = this.path;
        try {
            const t = new URL(e);
            let n = t.hash;
            if (n.length > 1) {
                n = n.substring(1);
            }
            const i = t.search;
            return [ t.pathname, i.length > 1 ? i : undefined, n.length ? n : undefined ];
        } catch (e) {
            const t = [];
            const n = this.path.split("#");
            if (n.length > 1) {
                t.unshift(n.pop());
            } else {
                t.unshift(undefined);
            }
            const i = n[0].split("?");
            if (i.length > 1) {
                t.unshift(i.pop());
            } else {
                t.unshift(undefined);
            }
            t.unshift(i[0]);
            return t;
        }
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
    back() {
        this.go(-1);
    }
    forward() {
        this.go(1);
    }
    notifyChange() {
        if (this.changeCallback) {
            this.changeCallback(null).catch((e => {
                throw e;
            }));
        }
    }
}

class ChangeSet {
    get newValue() {
        return this.O;
    }
    get oldValue() {
        return this.ov;
    }
    constructor(e, t, n) {
        this.index = e;
        this.O = t;
        this.ov = n;
    }
    dispose() {
        this.O = void 0;
        this.ov = void 0;
    }
}

class ProxyChangeSet {
    get newValue() {
        return this.O;
    }
    get oldValue() {
        return this.ov;
    }
    constructor(e, t, n, i) {
        this.index = e;
        this.key = t;
        this.O = n;
        this.ov = i;
    }
    dispose() {
        this.O = void 0;
        this.ov = void 0;
    }
}

class CollectionChangeSet {
    get indexMap() {
        return this.q;
    }
    constructor(e, t) {
        this.index = e;
        this.q = t;
    }
    dispose() {
        this.q = void 0;
    }
}

class SpySubscriber {
    get changes() {
        if (this.j === void 0) {
            return [];
        }
        return this.j;
    }
    get collectionChanges() {
        if (this.A === void 0) {
            return [];
        }
        return this.A;
    }
    get hasChanges() {
        return this.j !== void 0;
    }
    get hasProxyChanges() {
        return this.T !== void 0;
    }
    get hasCollectionChanges() {
        return this.A !== void 0;
    }
    get callCount() {
        return this.F;
    }
    constructor() {
        this.j = void 0;
        this.T = void 0;
        this.A = void 0;
        this.F = 0;
    }
    handleChange(e, t) {
        if (this.j === void 0) {
            this.j = [ new ChangeSet(this.F++, e, t) ];
        } else {
            this.j.push(new ChangeSet(this.F++, e, t));
        }
    }
    handleCollectionChange(e, t) {
        if (this.A === void 0) {
            this.A = [ new CollectionChangeSet(this.F++, t) ];
        } else {
            this.A.push(new CollectionChangeSet(this.F++, t));
        }
    }
    dispose() {
        if (this.j !== void 0) {
            this.j.forEach((e => e.dispose()));
            this.j = void 0;
        }
        if (this.T !== void 0) {
            this.T.forEach((e => e.dispose()));
            this.T = void 0;
        }
        if (this.A !== void 0) {
            this.A.forEach((e => e.dispose()));
            this.A = void 0;
        }
        this.F = 0;
    }
}

function _(e, ...t) {
    const n = {
        result: ""
    };
    const i = t.length;
    for (let r = 0; r < i; ++r) {
        n.result = n.result + e[r] + stringify(t[r], n);
    }
    return n.result + e[i];
}

const _e = /\r?\n/g;

const Ge = /\s+/g;

const Ye = Object.prototype.toString;

function stringify(e, t) {
    const n = Ye.call(e);
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
        return `[${e.map((e => stringify(e, t))).join(",")}]`;

      case "[object Event]":
        return `'${e.type}'`;

      case "[object Object]":
        {
            const n = Object.getPrototypeOf(e);
            if (!n || !n.constructor || n.constructor.name === "Object") {
                return jsonStringify(e, t);
            }
            return `class ${n.constructor.name}${jsonStringify(e, t)}`;
        }

      case "[object Function]":
        if (e.name && e.name.length) {
            return `class ${e.name}`;
        }
        return e.toString().replace(Ge, "");

      default:
        return jsonStringify(e, t);
    }
}

function jsonStringify(e, t) {
    if (t.result.length > 100) {
        return "(json string)";
    }
    try {
        let n = [];
        let i = 0;
        const r = JSON.stringify(e, (function(e, r) {
            if (e === "dom") {
                return "(dom)";
            }
            if (++i === 2) {
                return String(r);
            }
            if (typeof r === "object" && r !== null) {
                if (r.nodeType > 0) {
                    --i;
                    return htmlStringify(r, t);
                }
                if (n.includes(r)) {
                    try {
                        --i;
                        return JSON.parse(JSON.stringify(r));
                    } catch (e) {
                        return void 0;
                    }
                }
                n.push(r);
            }
            --i;
            return r;
        }));
        n = void 0;
        let a = r.replace(_e, "");
        if (a.length > 25) {
            const e = a.length;
            a = `${a.slice(0, 25)}...(+${e - 25})`;
        }
        t.result += a;
        return a;
    } catch (e) {
        return `error stringifying to json: ${e}`;
    }
}

function htmlStringify(e, t) {
    if (t.result.length > 100) {
        return "(html string)";
    }
    if (e === null) {
        return "null";
    }
    if (e === undefined) {
        return "undefined";
    }
    if (e.textContent != null && e.textContent.length || e.nodeType === 3 || e.nodeType === 8) {
        const t = e.textContent.replace(_e, "");
        if (t.length > 10) {
            const e = t.length;
            return `${t.slice(0, 10)}...(+${e - 10})`;
        }
        return t;
    }
    if (e.nodeType === 1) {
        if (e.innerHTML.length) {
            const t = e.innerHTML.replace(_e, "");
            if (t.length > 10) {
                const e = t.length;
                return `${t.slice(0, 10)}...(+${e - 10})`;
            }
            return t;
        }
        if (e.nodeName === "TEMPLATE") {
            return htmlStringify(e.content, t);
        }
    }
    let n = "";
    for (let i = 0, r = e.childNodes.length; i < r; ++i) {
        const r = e.childNodes[i];
        n += htmlStringify(r, t);
    }
    return n;
}

function padRight(e, t) {
    const n = `${e}`;
    const i = n.length;
    if (i >= t) {
        return n;
    }
    return n + new Array(t - i + 1).join(" ");
}

function padLeft(e, t) {
    const n = `${e}`;
    const i = n.length;
    if (i >= t) {
        return n;
    }
    return new Array(t - i + 1).join(" ") + n;
}

function createObserverLocator(e) {
    let t;
    if (e === undefined || !("get" in e)) {
        t = createContainer();
    } else {
        t = e;
    }
    const n = {
        handles() {
            return false;
        }
    };
    a.instance(f, null).register(t);
    a.instance(d, n).register(t);
    return t.get(c);
}

function createScopeForTest(e = {}, t, n) {
    return t ? p.fromParent(p.create(t), e) : p.create(e, null, n);
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
        e.register(a.singleton(this, this));
    }
    addCall(e, t, ...n) {
        this.calls.push(new Call(e, n, t, this.calls.length));
        return this;
    }
}

function recordCalls(e, t) {
    const n = e.prototype;
    const i = A(n);
    for (const e in i) {
        const r = i[e];
        if (e !== "constructor" && typeof r.value === "function" && r.configurable === true && r.writable === true) {
            const i = r.value;
            const wrapper = function(...n) {
                t.addCall(this, e, ...n);
                return z(i, this, n);
            };
            Reflect.defineProperty(wrapper, "original", {
                value: i,
                writable: true,
                configurable: true,
                enumerable: false
            });
            Reflect.defineProperty(n, e, {
                value: wrapper,
                writable: r.writable,
                configurable: r.configurable,
                enumerable: r.enumerable
            });
        } else {
            const {get: i, set: a} = r;
            let s, l;
            if (i) {
                s = function() {
                    t.addCall(this, `get ${e}`, o);
                    return z(i, this, o);
                };
                Reflect.defineProperty(s, "original", {
                    value: i
                });
            }
            if (a) {
                l = function(n) {
                    t.addCall(this, `get ${e}`, o);
                    z(a, this, [ n ]);
                };
                Reflect.defineProperty(l, "original", {
                    value: a
                });
            }
            if (i || a) {
                Reflect.defineProperty(n, e, {
                    ...r,
                    get: s,
                    set: l
                });
            }
        }
    }
}

function stopRecordingCalls(e) {
    const t = e.prototype;
    const n = A(t);
    for (const e in n) {
        const i = n[e];
        if (e !== "constructor" && typeof i.value === "function" && i.configurable === true && i.writable === true) {
            Reflect.defineProperty(t, e, {
                value: i.value.original,
                writable: i.writable,
                configurable: i.configurable,
                enumerable: i.enumerable
            });
        } else {
            const {get: n, set: r} = i;
            if (n || r) {
                Reflect.defineProperty(t, e, {
                    ...i,
                    get: n && Reflect.get(n, "original"),
                    set: r && Reflect.get(r, "original")
                });
            }
        }
    }
}

function trace(e) {
    return function(t, n) {
        recordCalls(t, e);
    };
}

export { Ve as CSS_PROPERTIES, Call, CallCollection, ChangeSet, CollectionChangeSet, MockBinding, MockBindingBehavior, MockBrowserHistoryLocation, MockContext, MockPropertySubscriber, MockServiceLocator, MockSignaler, MockTracingExpression, MockValueConverter, pe as PLATFORM, me as PLATFORMRegistration, Qe as PSEUDO_ELEMENTS, ProxyChangeSet, SpySubscriber, TestContext, _, De as assert, createContainer, createFixture, createObserverLocator, createScopeForTest, createSpy, eachCartesianJoin, eachCartesianJoinAsync, eachCartesianJoinFactory, ensureTaskQueuesEmpty, fail, generateCartesianProduct, getVisibleText, He as globalAttributeNames, h, hJsx, htmlStringify, inspect, instructionTypeName, jsonStringify, onFixtureCreated, padLeft, padRight, recordCalls, setPlatform, stopRecordingCalls, stringify, trace, de as trimFull, verifyBindingInstructionsEqual, verifyEqual };

