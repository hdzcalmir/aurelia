import { Protocol as t, getPrototypeChain as e, firstDefined as i, kebabCase as s, noop as n, DI as r, Registration as o, emptyArray as l, all as h, mergeArrays as a, IPlatform as c, IContainer as u, optional as f, InstanceProvider as d, resolveAll as m, onResolve as g, fromDefinitionOrDefault as p, pascalCase as v, fromAnnotationOrTypeOrDefault as x, fromAnnotationOrDefinitionOrTypeOrDefault as w, camelCase as b, toArray as y, ILogger as k, emptyObject as A, IServiceLocator as C, transient as B } from "@aurelia/kernel";

import { Metadata as S, isObject as R } from "@aurelia/metadata";

import { subscriberCollection as I, astEvaluate as T, ISignaler as L, connectable as E, astBind as P, astUnbind as _, astAssign as $, ConnectableSwitcher as U, ProxyObservable as q, IExpressionParser as D, IObserverLocator as M, Scope as F, ICoercionConfiguration as O, AccessScopeExpression as V, PrimitiveLiteralExpression as N, PropertyAccessor as j, INodeObserverLocator as H, getObserverLookup as W, SetterObserver as z, IDirtyChecker as G, createIndexMap as X, applyMutationsToIndices as K, getCollectionObserver as Q, synchronizeIndices as Y, BindingContext as Z } from "@aurelia/runtime";

import { TaskAbortError as J } from "@aurelia/platform";

import { BrowserPlatform as tt } from "@aurelia/platform-browser";

function et(t, e, i, s) {
    var n = arguments.length, r = n < 3 ? e : null === s ? s = Object.getOwnPropertyDescriptor(e, i) : s, o;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(t, e, i, s); else for (var l = t.length - 1; l >= 0; l--) if (o = t[l]) r = (n < 3 ? o(r) : n > 3 ? o(e, i, r) : o(e, i)) || r;
    return n > 3 && r && Object.defineProperty(e, i, r), r;
}

function it(t, e) {
    return function(i, s) {
        e(i, s, t);
    };
}

const st = S.getOwn;

const nt = S.hasOwn;

const rt = S.define;

const {annotation: ot, resource: lt} = t;

const ht = ot.keyFor;

const at = lt.keyFor;

const ct = lt.appendTo;

const ut = ot.appendTo;

const ft = ot.getKeys;

const dt = Object;

const mt = String;

const gt = dt.prototype;

const pt = () => dt.create(null);

const vt = t => new Error(t);

const xt = gt.hasOwnProperty;

const wt = dt.freeze;

const bt = dt.assign;

const yt = dt.getOwnPropertyNames;

const kt = dt.keys;

const At = pt();

const Ct = (t, e, i) => {
    if (true === At[e]) return true;
    if (!It(e)) return false;
    const s = e.slice(0, 5);
    return At[e] = "aria-" === s || "data-" === s || i.isStandardSvgAttribute(t, e);
};

const Bt = t => t instanceof Promise;

const St = t => t instanceof Array;

const Rt = t => "function" === typeof t;

const It = t => "string" === typeof t;

const Tt = dt.defineProperty;

const Lt = t => {
    throw t;
};

const Et = dt.is;

const Pt = Reflect.defineProperty;

const _t = (t, e, i) => {
    Pt(t, e, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: i
    });
    return i;
};

function $t(t, e) {
    let i;
    function s(t, e) {
        if (arguments.length > 1) i.property = e;
        rt(qt, BindableDefinition.create(e, t, i), t.constructor, e);
        ut(t.constructor, Dt.keyFrom(e));
    }
    if (arguments.length > 1) {
        i = {};
        s(t, e);
        return;
    } else if (It(t)) {
        i = {};
        return s;
    }
    i = void 0 === t ? {} : t;
    return s;
}

function Ut(t) {
    return t.startsWith(qt);
}

const qt = ht("bindable");

const Dt = wt({
    name: qt,
    keyFrom: t => `${qt}:${t}`,
    from(t, ...e) {
        const i = {};
        const s = Array.isArray;
        function n(e) {
            i[e] = BindableDefinition.create(e, t);
        }
        function r(e, s) {
            i[e] = s instanceof BindableDefinition ? s : BindableDefinition.create(e, t, s);
        }
        function o(t) {
            if (s(t)) t.forEach(n); else if (t instanceof BindableDefinition) i[t.property] = t; else if (void 0 !== t) kt(t).forEach((e => r(e, t[e])));
        }
        e.forEach(o);
        return i;
    },
    for(t) {
        let e;
        const i = {
            add(s) {
                let n;
                let r;
                if (It(s)) {
                    n = s;
                    r = {
                        property: n
                    };
                } else {
                    n = s.property;
                    r = s;
                }
                e = BindableDefinition.create(n, t, r);
                if (!nt(qt, t, n)) ut(t, Dt.keyFrom(n));
                rt(qt, e, t, n);
                return i;
            },
            mode(t) {
                e.mode = t;
                return i;
            },
            callback(t) {
                e.callback = t;
                return i;
            },
            attribute(t) {
                e.attribute = t;
                return i;
            },
            primary() {
                e.primary = true;
                return i;
            },
            set(t) {
                e.set = t;
                return i;
            }
        };
        return i;
    },
    getAll(t) {
        const i = qt.length + 1;
        const s = [];
        const n = e(t);
        let r = n.length;
        let o = 0;
        let l;
        let h;
        let a;
        let c;
        while (--r >= 0) {
            a = n[r];
            l = ft(a).filter(Ut);
            h = l.length;
            for (c = 0; c < h; ++c) s[o++] = st(qt, a, l[c].slice(i));
        }
        return s;
    }
});

class BindableDefinition {
    constructor(t, e, i, s, n, r) {
        this.attribute = t;
        this.callback = e;
        this.mode = i;
        this.primary = s;
        this.property = n;
        this.set = r;
    }
    static create(t, e, n = {}) {
        return new BindableDefinition(i(n.attribute, s(t)), i(n.callback, `${t}Changed`), i(n.mode, 2), i(n.primary, false), i(n.property, t), i(n.set, Ot(t, e, n)));
    }
}

function Mt(t, e, i) {
    Ft.define(t, e);
}

const Ft = {
    key: ht("coercer"),
    define(t, e) {
        rt(Ft.key, t[e].bind(t), t);
    },
    for(t) {
        return st(Ft.key, t);
    }
};

function Ot(t, e, i = {}) {
    const s = i.type ?? S.get("design:type", e, t) ?? null;
    if (null == s) return n;
    let r;
    switch (s) {
      case Number:
      case Boolean:
      case String:
      case BigInt:
        r = s;
        break;

      default:
        {
            const t = s.coerce;
            r = "function" === typeof t ? t.bind(s) : Ft.for(s) ?? n;
            break;
        }
    }
    return r === n ? r : Vt(r, i.nullable);
}

function Vt(t, e) {
    return function(i, s) {
        if (!s?.enableCoercion) return i;
        return (e ?? (s?.coerceNullish ?? false ? false : true)) && null == i ? i : t(i, s);
    };
}

class BindableObserver {
    get type() {
        return 1;
    }
    constructor(t, e, i, s, r, o) {
        this.set = s;
        this.$controller = r;
        this.i = o;
        this.v = void 0;
        this.ov = void 0;
        const l = t[i];
        const h = t.propertyChanged;
        const a = this.u = Rt(l);
        const c = this.A = Rt(h);
        const u = this.hs = s !== n;
        let f;
        this.o = t;
        this.k = e;
        this.C = c ? h : n;
        this.cb = a ? l : n;
        if (void 0 === this.cb && !c && !u) this.iO = false; else {
            this.iO = true;
            f = t[e];
            this.v = u && void 0 !== f ? s(f, this.i) : f;
            this.B();
        }
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (this.hs) t = this.set(t, this.i);
        const e = this.v;
        if (this.iO) {
            if (Et(t, e)) return;
            this.v = t;
            this.ov = e;
            if (null == this.$controller || this.$controller.isBound) {
                if (this.u) this.cb.call(this.o, t, e);
                if (this.A) this.C.call(this.o, this.k, t, e);
            }
            this.subs.notify(this.v, this.ov);
        } else this.o[this.k] = t;
    }
    subscribe(t) {
        if (false === !this.iO) {
            this.iO = true;
            this.v = this.hs ? this.set(this.o[this.k], this.i) : this.o[this.k];
            this.B();
        }
        this.subs.add(t);
    }
    B() {
        Reflect.defineProperty(this.o, this.k, {
            enumerable: true,
            configurable: true,
            get: () => this.v,
            set: t => {
                this.setValue(t);
            }
        });
    }
}

I(BindableObserver);

const Nt = function(t) {
    function e(t, i, s) {
        r.inject(e)(t, i, s);
    }
    e.$isResolver = true;
    e.resolve = function(e, i) {
        if (i.root === i) return i.get(t);
        return i.has(t, false) ? i.get(t) : i.root.get(t);
    };
    return e;
};

const jt = t => {
    function e(t, i, s) {
        r.inject(e)(t, i, s);
    }
    e.$isResolver = true;
    e.resolve = function(e, i) {
        if (i.root === i) return i.getAll(t, false);
        return i.has(t, false) ? i.getAll(t, false).concat(i.root.getAll(t, false)) : i.root.getAll(t, false);
    };
    return e;
};

const Ht = r.createInterface;

const Wt = o.singleton;

const zt = o.aliasTo;

const Gt = o.instance;

o.callback;

const Xt = o.transient;

const Kt = (t, e, i) => t.registerResolver(e, i);

function Qt(...t) {
    return function(e) {
        const i = ht("aliases");
        const s = st(i, e);
        if (void 0 === s) rt(i, t, e); else s.push(...t);
    };
}

function Yt(t, e, i, s) {
    for (let n = 0, r = t.length; n < r; ++n) o.aliasTo(i, e.keyFrom(t[n])).register(s);
}

class CharSpec {
    constructor(t, e, i, s) {
        this.chars = t;
        this.repeat = e;
        this.isSymbol = i;
        this.isInverted = s;
        if (s) switch (t.length) {
          case 0:
            this.has = this.R;
            break;

          case 1:
            this.has = this.I;
            break;

          default:
            this.has = this.T;
        } else switch (t.length) {
          case 0:
            this.has = this.L;
            break;

          case 1:
            this.has = this.P;
            break;

          default:
            this.has = this._;
        }
    }
    equals(t) {
        return this.chars === t.chars && this.repeat === t.repeat && this.isSymbol === t.isSymbol && this.isInverted === t.isInverted;
    }
    _(t) {
        return this.chars.includes(t);
    }
    P(t) {
        return this.chars === t;
    }
    L(t) {
        return false;
    }
    T(t) {
        return !this.chars.includes(t);
    }
    I(t) {
        return this.chars !== t;
    }
    R(t) {
        return true;
    }
}

class Interpretation {
    constructor() {
        this.parts = l;
        this.$ = "";
        this.U = {};
        this.q = {};
    }
    get pattern() {
        const t = this.$;
        if ("" === t) return null; else return t;
    }
    set pattern(t) {
        if (null == t) {
            this.$ = "";
            this.parts = l;
        } else {
            this.$ = t;
            this.parts = this.q[t];
        }
    }
    append(t, e) {
        const i = this.U;
        if (void 0 === i[t]) i[t] = e; else i[t] += e;
    }
    next(t) {
        const e = this.U;
        let i;
        if (void 0 !== e[t]) {
            i = this.q;
            if (void 0 === i[t]) i[t] = [ e[t] ]; else i[t].push(e[t]);
            e[t] = void 0;
        }
    }
}

class AttrParsingState {
    get $() {
        return this.M ? this.F[0] : null;
    }
    constructor(t, ...e) {
        this.charSpec = t;
        this.O = [];
        this.V = null;
        this.M = false;
        this.F = e;
    }
    findChild(t) {
        const e = this.O;
        const i = e.length;
        let s = null;
        let n = 0;
        for (;n < i; ++n) {
            s = e[n];
            if (t.equals(s.charSpec)) return s;
        }
        return null;
    }
    append(t, e) {
        const i = this.F;
        if (!i.includes(e)) i.push(e);
        let s = this.findChild(t);
        if (null == s) {
            s = new AttrParsingState(t, e);
            this.O.push(s);
            if (t.repeat) s.O.push(s);
        }
        return s;
    }
    findMatches(t, e) {
        const i = [];
        const s = this.O;
        const n = s.length;
        let r = 0;
        let o = null;
        let l = 0;
        let h = 0;
        for (;l < n; ++l) {
            o = s[l];
            if (o.charSpec.has(t)) {
                i.push(o);
                r = o.F.length;
                h = 0;
                if (o.charSpec.isSymbol) for (;h < r; ++h) e.next(o.F[h]); else for (;h < r; ++h) e.append(o.F[h], t);
            }
        }
        return i;
    }
}

class StaticSegment {
    constructor(t) {
        this.text = t;
        const e = this.N = t.length;
        const i = this.j = [];
        let s = 0;
        for (;e > s; ++s) i.push(new CharSpec(t[s], false, false, false));
    }
    eachChar(t) {
        const e = this.N;
        const i = this.j;
        let s = 0;
        for (;e > s; ++s) t(i[s]);
    }
}

class DynamicSegment {
    constructor(t) {
        this.text = "PART";
        this.H = new CharSpec(t, true, false, true);
    }
    eachChar(t) {
        t(this.H);
    }
}

class SymbolSegment {
    constructor(t) {
        this.text = t;
        this.H = new CharSpec(t, false, true, false);
    }
    eachChar(t) {
        t(this.H);
    }
}

class SegmentTypes {
    constructor() {
        this.statics = 0;
        this.dynamics = 0;
        this.symbols = 0;
    }
}

const Zt = Ht("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

class SyntaxInterpreter {
    constructor() {
        this.W = new AttrParsingState(null);
        this.G = [ this.W ];
    }
    add(t) {
        t = t.slice(0).sort(((t, e) => t.pattern > e.pattern ? 1 : -1));
        const e = t.length;
        let i;
        let s;
        let n;
        let r;
        let o;
        let l;
        let h;
        let a = 0;
        let c;
        while (e > a) {
            i = this.W;
            s = t[a];
            n = s.pattern;
            r = new SegmentTypes;
            o = this.X(s, r);
            l = o.length;
            h = t => i = i.append(t, n);
            for (c = 0; l > c; ++c) o[c].eachChar(h);
            i.V = r;
            i.M = true;
            ++a;
        }
    }
    interpret(t) {
        const e = new Interpretation;
        const i = t.length;
        let s = this.G;
        let n = 0;
        let r;
        for (;n < i; ++n) {
            s = this.K(s, t.charAt(n), e);
            if (0 === s.length) break;
        }
        s = s.filter(Jt);
        if (s.length > 0) {
            s.sort(te);
            r = s[0];
            if (!r.charSpec.isSymbol) e.next(r.$);
            e.pattern = r.$;
        }
        return e;
    }
    K(t, e, i) {
        const s = [];
        let n = null;
        const r = t.length;
        let o = 0;
        for (;o < r; ++o) {
            n = t[o];
            s.push(...n.findMatches(e, i));
        }
        return s;
    }
    X(t, e) {
        const i = [];
        const s = t.pattern;
        const n = s.length;
        const r = t.symbols;
        let o = 0;
        let l = 0;
        let h = "";
        while (o < n) {
            h = s.charAt(o);
            if (0 === r.length || !r.includes(h)) if (o === l) if ("P" === h && "PART" === s.slice(o, o + 4)) {
                l = o += 4;
                i.push(new DynamicSegment(r));
                ++e.dynamics;
            } else ++o; else ++o; else if (o !== l) {
                i.push(new StaticSegment(s.slice(l, o)));
                ++e.statics;
                l = o;
            } else {
                i.push(new SymbolSegment(s.slice(l, o + 1)));
                ++e.symbols;
                l = ++o;
            }
        }
        if (l !== o) {
            i.push(new StaticSegment(s.slice(l, o)));
            ++e.statics;
        }
        return i;
    }
}

function Jt(t) {
    return t.M;
}

function te(t, e) {
    const i = t.V;
    const s = e.V;
    if (i.statics !== s.statics) return s.statics - i.statics;
    if (i.dynamics !== s.dynamics) return s.dynamics - i.dynamics;
    if (i.symbols !== s.symbols) return s.symbols - i.symbols;
    return 0;
}

class AttrSyntax {
    constructor(t, e, i, s) {
        this.rawName = t;
        this.rawValue = e;
        this.target = i;
        this.command = s;
    }
}

const ee = Ht("IAttributePattern");

const ie = Ht("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor(t, e) {
        this.Y = {};
        this.Z = t;
        const i = this.F = {};
        const s = e.reduce(((t, e) => {
            const s = oe(e.constructor);
            s.forEach((t => i[t.pattern] = e));
            return t.concat(s);
        }), l);
        t.add(s);
    }
    parse(t, e) {
        let i = this.Y[t];
        if (null == i) i = this.Y[t] = this.Z.interpret(t);
        const s = i.pattern;
        if (null == s) return new AttrSyntax(t, e, t, null); else return this.F[s][s](t, e, i.parts);
    }
}

AttributeParser.inject = [ Zt, h(ee) ];

function se(...t) {
    return function e(i) {
        return le.define(t, i);
    };
}

class AttributePatternResourceDefinition {
    constructor(t) {
        this.Type = t;
        this.name = void 0;
    }
    register(t) {
        Wt(ee, this.Type).register(t);
    }
}

const ne = at("attribute-pattern");

const re = "attribute-pattern-definitions";

const oe = e => t.annotation.get(e, re);

const le = wt({
    name: ne,
    definitionAnnotationKey: re,
    define(e, i) {
        const s = new AttributePatternResourceDefinition(i);
        rt(ne, s, i);
        ct(i, ne);
        t.annotation.set(i, re, e);
        ut(i, re);
        return i;
    },
    getPatternDefinitions: oe
});

let he = class DotSeparatedAttributePattern {
    "PART.PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], i[1]);
    }
    "PART.PART.PART"(t, e, i) {
        return new AttrSyntax(t, e, `${i[0]}.${i[1]}`, i[2]);
    }
};

he = et([ se({
    pattern: "PART.PART",
    symbols: "."
}, {
    pattern: "PART.PART.PART",
    symbols: "."
}) ], he);

let ae = class RefAttributePattern {
    ref(t, e, i) {
        return new AttrSyntax(t, e, "element", "ref");
    }
    "PART.ref"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "ref");
    }
};

ae = et([ se({
    pattern: "ref",
    symbols: ""
}, {
    pattern: "PART.ref",
    symbols: "."
}) ], ae);

let ce = class ColonPrefixedBindAttributePattern {
    ":PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "bind");
    }
};

ce = et([ se({
    pattern: ":PART",
    symbols: ":"
}) ], ce);

let ue = class AtPrefixedTriggerAttributePattern {
    "@PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "trigger");
    }
};

ue = et([ se({
    pattern: "@PART",
    symbols: "@"
}) ], ue);

let fe = class SpreadAttributePattern {
    "...$attrs"(t, e, i) {
        return new AttrSyntax(t, e, "", "...$attrs");
    }
};

fe = et([ se({
    pattern: "...$attrs",
    symbols: ""
}) ], fe);

const de = "au-start";

const me = "au-end";

const ge = (t, e) => t.document.createElement(e);

const pe = (t, e) => t.document.createComment(e);

const ve = t => {
    const e = pe(t, me);
    e.$start = pe(t, de);
    return e;
};

const xe = (t, e) => t.document.createTextNode(e);

const we = (t, e, i) => t.insertBefore(e, i);

const be = (t, e, i) => {
    if (null === t) return;
    const s = i.length;
    let n = 0;
    while (s > n) {
        t.insertBefore(i[n], e);
        ++n;
    }
};

const ye = t => t.previousSibling;

const ke = (t, e) => t.content.appendChild(e);

const Ae = (t, e) => {
    const i = e.length;
    let s = 0;
    while (i > s) {
        t.content.appendChild(e[s]);
        ++s;
    }
};

const Ce = t => {
    const e = t.previousSibling;
    let i;
    if (8 === e?.nodeType && "au-end" === e.textContent) {
        i = e;
        if (null == (i.$start = i.previousSibling)) throw Se();
        t.parentNode?.removeChild(t);
        return i;
    } else throw Se();
};

const Be = (t, e) => new t.ownerDocument.defaultView.MutationObserver(e);

const Se = () => vt(`AURxxxx`);

class AttributeObserver {
    constructor(t, e, i) {
        this.type = 2 | 1 | 4;
        this.v = null;
        this.ov = null;
        this.J = false;
        this.o = t;
        this.tt = e;
        this.et = i;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        this.v = t;
        this.J = t !== this.ov;
        this.it();
    }
    it() {
        if (this.J) {
            this.J = false;
            this.ov = this.v;
            switch (this.et) {
              case "class":
                this.o.classList.toggle(this.tt, !!this.v);
                break;

              case "style":
                {
                    let t = "";
                    let e = this.v;
                    if (It(e) && e.includes("!important")) {
                        t = "important";
                        e = e.replace("!important", "");
                    }
                    this.o.style.setProperty(this.tt, e, t);
                    break;
                }

              default:
                if (null == this.v) this.o.removeAttribute(this.et); else this.o.setAttribute(this.et, mt(this.v));
            }
        }
    }
    handleMutation(t) {
        let e = false;
        for (let i = 0, s = t.length; s > i; ++i) {
            const s = t[i];
            if ("attributes" === s.type && s.attributeName === this.tt) {
                e = true;
                break;
            }
        }
        if (e) {
            let t;
            switch (this.et) {
              case "class":
                t = this.o.classList.contains(this.tt);
                break;

              case "style":
                t = this.o.style.getPropertyValue(this.tt);
                break;

              default:
                throw vt(`AUR0651:${this.et}`);
            }
            if (t !== this.v) {
                this.ov = this.v;
                this.v = t;
                this.J = false;
                this.st();
            }
        }
    }
    subscribe(t) {
        if (this.subs.add(t) && 1 === this.subs.count) {
            this.v = this.ov = this.o.getAttribute(this.tt);
            Re(this.o, this);
        }
    }
    unsubscribe(t) {
        if (this.subs.remove(t) && 0 === this.subs.count) Ie(this.o, this);
    }
    st() {
        Ee = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Ee);
    }
}

I(AttributeObserver);

const Re = (t, e) => {
    if (void 0 === t.$eMObs) t.$eMObs = new Set;
    if (void 0 === t.$mObs) (t.$mObs = Be(t, Te)).observe(t, {
        attributes: true
    });
    t.$eMObs.add(e);
};

const Ie = (t, e) => {
    const i = t.$eMObs;
    if (i && i.delete(e)) {
        if (0 === i.size) {
            t.$mObs.disconnect();
            t.$mObs = void 0;
        }
        return true;
    }
    return false;
};

const Te = t => {
    t[0].target.$eMObs.forEach(Le, t);
};

function Le(t) {
    t.handleMutation(this);
}

let Ee;

function Pe(t) {
    return function(e) {
        return Ue.define(t, e);
    };
}

class BindingBehaviorDefinition {
    constructor(t, e, i, s) {
        this.Type = t;
        this.name = e;
        this.aliases = i;
        this.key = s;
    }
    static create(t, e) {
        let s;
        let n;
        if (It(t)) {
            s = t;
            n = {
                name: s
            };
        } else {
            s = t.name;
            n = t;
        }
        return new BindingBehaviorDefinition(e, i($e(e, "name"), s), a($e(e, "aliases"), n.aliases, e.aliases), Ue.keyFrom(s));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        Wt(i, e).register(t);
        zt(i, e).register(t);
        Yt(s, Ue, i, t);
    }
}

const _e = at("binding-behavior");

const $e = (t, e) => st(ht(e), t);

const Ue = wt({
    name: _e,
    keyFrom(t) {
        return `${_e}:${t}`;
    },
    isType(t) {
        return Rt(t) && nt(_e, t);
    },
    define(t, e) {
        const i = BindingBehaviorDefinition.create(t, e);
        rt(_e, i, i.Type);
        rt(_e, i, i);
        ct(e, _e);
        return i.Type;
    },
    getDefinition(t) {
        const e = st(_e, t);
        if (void 0 === e) throw vt(`AUR0151:${t.name}`);
        return e;
    },
    annotate(t, e, i) {
        rt(ht(e), i, t);
    },
    getAnnotation: $e
});

function qe(t) {
    return function(e) {
        return Fe.define(t, e);
    };
}

class ValueConverterDefinition {
    constructor(t, e, i, s) {
        this.Type = t;
        this.name = e;
        this.aliases = i;
        this.key = s;
    }
    static create(t, e) {
        let s;
        let n;
        if (It(t)) {
            s = t;
            n = {
                name: s
            };
        } else {
            s = t.name;
            n = t;
        }
        return new ValueConverterDefinition(e, i(Me(e, "name"), s), a(Me(e, "aliases"), n.aliases, e.aliases), Fe.keyFrom(s));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        o.singleton(i, e).register(t);
        o.aliasTo(i, e).register(t);
        Yt(s, Fe, i, t);
    }
}

const De = at("value-converter");

const Me = (t, e) => st(ht(e), t);

const Fe = wt({
    name: De,
    keyFrom: t => `${De}:${t}`,
    isType(t) {
        return Rt(t) && nt(De, t);
    },
    define(t, e) {
        const i = ValueConverterDefinition.create(t, e);
        rt(De, i, i.Type);
        rt(De, i, i);
        ct(e, De);
        return i.Type;
    },
    getDefinition(t) {
        const e = st(De, t);
        if (void 0 === e) throw vt(`AUR0152:${t.name}`);
        return e;
    },
    annotate(t, e, i) {
        rt(ht(e), i, t);
    },
    getAnnotation: Me
});

class BindingTargetSubscriber {
    constructor(t, e) {
        this.v = void 0;
        this.b = t;
        this.nt = e;
    }
    flush() {
        this.b.updateSource(this.v);
    }
    handleChange(t, e) {
        const i = this.b;
        if (t !== T(i.ast, i.s, i, null)) {
            this.v = t;
            this.nt.add(this);
        }
    }
}

const Oe = t => {
    _t(t.prototype, "useScope", (function(t) {
        this.s = t;
    }));
};

const Ve = (t, e = true) => i => {
    const s = i.prototype;
    if (null != t) Pt(s, "strict", {
        enumerable: true,
        get: function() {
            return t;
        }
    });
    Pt(s, "strictFnCall", {
        enumerable: true,
        get: function() {
            return e;
        }
    });
    _t(s, "get", (function(t) {
        return this.l.get(t);
    }));
    _t(s, "getSignaler", (function() {
        return this.l.root.get(L);
    }));
    _t(s, "getConverter", (function(t) {
        const e = Fe.keyFrom(t);
        let i = Ne.get(this);
        if (null == i) Ne.set(this, i = new ResourceLookup);
        return i[e] ?? (i[e] = this.l.get(Nt(e)));
    }));
    _t(s, "getBehavior", (function(t) {
        const e = Ue.keyFrom(t);
        let i = Ne.get(this);
        if (null == i) Ne.set(this, i = new ResourceLookup);
        return i[e] ?? (i[e] = this.l.get(Nt(e)));
    }));
};

const Ne = new WeakMap;

class ResourceLookup {}

const je = Ht("IFlushQueue", (t => t.singleton(FlushQueue)));

class FlushQueue {
    constructor() {
        this.rt = false;
        this.ot = new Set;
    }
    get count() {
        return this.ot.size;
    }
    add(t) {
        this.ot.add(t);
        if (this.rt) return;
        this.rt = true;
        try {
            this.ot.forEach(He);
        } finally {
            this.rt = false;
        }
    }
    clear() {
        this.ot.clear();
        this.rt = false;
    }
}

function He(t, e, i) {
    i.delete(t);
    t.flush();
}

const We = new WeakSet;

const ze = (t, e) => {
    _t(t.prototype, "limit", (function(t) {
        if (We.has(this)) throw vt(`AURXXXX: a rate limit has already been applied.`);
        We.add(this);
        const i = e(this, t);
        const s = this[i];
        const n = (...t) => s.call(this, ...t);
        const r = "debounce" === t.type ? Ge(t, n, this) : Xe(t, n, this);
        this[i] = r;
        return {
            dispose: () => {
                We.delete(this);
                r.dispose();
                delete this[i];
            }
        };
    }));
};

const Ge = (t, e, i) => {
    let s;
    let n;
    let r;
    const o = t.queue;
    const l = l => {
        r = l;
        if (i.isBound) {
            n = s;
            s = o.queueTask((() => e(r)), {
                delay: t.delay,
                reusable: false
            });
            n?.cancel();
        } else e(r);
    };
    l.dispose = () => {
        n?.cancel();
        s?.cancel();
    };
    return l;
};

const Xe = (t, e, i) => {
    let s;
    let n;
    let r = 0;
    let o = 0;
    let l;
    const h = t.queue;
    const a = () => t.now();
    const c = c => {
        l = c;
        if (i.isBound) {
            o = a() - r;
            n = s;
            if (o > t.delay) {
                r = a();
                e(l);
            } else s = h.queueTask((() => {
                r = a();
                e(l);
            }), {
                delay: t.delay - o,
                reusable: false
            });
            n?.cancel();
        } else e(l);
    };
    c.dispose = () => {
        n?.cancel();
        s?.cancel();
    };
    return c;
};

const Ke = {
    reusable: false,
    preempt: true
};

class AttributeBinding {
    constructor(t, e, i, s, n, r, o, l, h) {
        this.targetAttribute = o;
        this.targetProperty = l;
        this.mode = h;
        this.isBound = false;
        this.s = void 0;
        this.lt = null;
        this.v = void 0;
        this.boundFn = false;
        this.l = e;
        this.ast = n;
        this.ht = t;
        this.target = r;
        this.oL = i;
        this.ct = s;
    }
    updateTarget(t) {
        this.ut.setValue(t, this.target, this.targetProperty);
    }
    handleChange() {
        if (!this.isBound) return;
        let t;
        this.obs.version++;
        const e = T(this.ast, this.s, this, (2 & this.mode) > 0 ? this : null);
        this.obs.clear();
        if (e !== this.v) {
            this.v = e;
            const i = 1 !== this.ht.state && (4 & this.ut.type) > 0;
            if (i) {
                t = this.lt;
                this.lt = this.ct.queueTask((() => {
                    this.lt = null;
                    this.updateTarget(e);
                }), Ke);
                t?.cancel();
            } else this.updateTarget(e);
        }
    }
    handleCollectionChange() {
        this.handleChange();
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) return;
            this.unbind();
        }
        this.s = t;
        P(this.ast, t, this);
        this.ut ?? (this.ut = new AttributeObserver(this.target, this.targetProperty, this.targetAttribute));
        if (this.mode & (2 | 1)) this.updateTarget(this.v = T(this.ast, t, this, (2 & this.mode) > 0 ? this : null));
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        _(this.ast, this.s, this);
        this.s = void 0;
        this.v = void 0;
        this.lt?.cancel();
        this.lt = null;
        this.obs.clearAll();
    }
}

Oe(AttributeBinding);

ze(AttributeBinding, (() => "updateTarget"));

E(AttributeBinding);

Ve(true)(AttributeBinding);

const Qe = {
    reusable: false,
    preempt: true
};

class InterpolationBinding {
    constructor(t, e, i, s, n, r, o, l) {
        this.ast = n;
        this.target = r;
        this.targetProperty = o;
        this.mode = l;
        this.isBound = false;
        this.s = void 0;
        this.lt = null;
        this.ht = t;
        this.oL = i;
        this.ct = s;
        this.ut = i.getAccessor(r, o);
        const h = n.expressions;
        const a = this.partBindings = Array(h.length);
        const c = h.length;
        let u = 0;
        for (;c > u; ++u) a[u] = new InterpolationPartBinding(h[u], r, o, e, i, this);
    }
    ft() {
        this.updateTarget();
    }
    updateTarget() {
        const t = this.partBindings;
        const e = this.ast.parts;
        const i = t.length;
        let s = "";
        let n = 0;
        if (1 === i) s = e[0] + t[0].v + e[1]; else {
            s = e[0];
            for (;i > n; ++n) s += t[n].v + e[n + 1];
        }
        const r = this.ut;
        const o = 1 !== this.ht.state && (4 & r.type) > 0;
        let l;
        if (o) {
            l = this.lt;
            this.lt = this.ct.queueTask((() => {
                this.lt = null;
                r.setValue(s, this.target, this.targetProperty);
            }), Qe);
            l?.cancel();
            l = null;
        } else r.setValue(s, this.target, this.targetProperty);
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) return;
            this.unbind();
        }
        this.s = t;
        const e = this.partBindings;
        const i = e.length;
        let s = 0;
        for (;i > s; ++s) e[s].bind(t);
        this.updateTarget();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        this.s = void 0;
        const t = this.partBindings;
        const e = t.length;
        let i = 0;
        for (;e > i; ++i) t[i].unbind();
        this.lt?.cancel();
        this.lt = null;
    }
}

class InterpolationPartBinding {
    constructor(t, e, i, s, n, r) {
        this.ast = t;
        this.target = e;
        this.targetProperty = i;
        this.owner = r;
        this.mode = 2;
        this.task = null;
        this.isBound = false;
        this.v = "";
        this.boundFn = false;
        this.l = s;
        this.oL = n;
    }
    updateTarget() {
        this.owner.ft();
    }
    handleChange() {
        if (!this.isBound) return;
        this.obs.version++;
        const t = T(this.ast, this.s, this, (2 & this.mode) > 0 ? this : null);
        this.obs.clear();
        if (t != this.v) {
            this.v = t;
            if (St(t)) this.observeCollection(t);
            this.updateTarget();
        }
    }
    handleCollectionChange() {
        this.handleChange();
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) return;
            this.unbind();
        }
        this.s = t;
        P(this.ast, t, this);
        this.v = T(this.ast, this.s, this, (2 & this.mode) > 0 ? this : null);
        if (St(this.v)) this.observeCollection(this.v);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        _(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

Oe(InterpolationPartBinding);

ze(InterpolationPartBinding, (() => "updateTarget"));

E(InterpolationPartBinding);

Ve(true)(InterpolationPartBinding);

class ContentBinding {
    constructor(t, e, i, s, n, r, o, l) {
        this.p = n;
        this.ast = r;
        this.target = o;
        this.strict = l;
        this.isBound = false;
        this.mode = 2;
        this.lt = null;
        this.v = "";
        this.boundFn = false;
        this.l = e;
        this.ht = t;
        this.oL = i;
        this.ct = s;
    }
    updateTarget(t) {
        const e = this.target;
        const i = this.p.Node;
        const s = this.v;
        this.v = t;
        if (s instanceof i) s.parentNode?.removeChild(s);
        if (t instanceof i) {
            e.textContent = "";
            e.parentNode?.insertBefore(t, e);
        } else e.textContent = mt(t);
    }
    handleChange() {
        if (!this.isBound) return;
        this.obs.version++;
        const t = T(this.ast, this.s, this, (2 & this.mode) > 0 ? this : null);
        this.obs.clear();
        if (t === this.v) {
            this.lt?.cancel();
            this.lt = null;
            return;
        }
        const e = 1 !== this.ht.state;
        if (e) this.dt(t); else this.updateTarget(t);
    }
    handleCollectionChange() {
        if (!this.isBound) return;
        this.obs.version++;
        const t = this.v = T(this.ast, this.s, this, (2 & this.mode) > 0 ? this : null);
        this.obs.clear();
        if (St(t)) this.observeCollection(t);
        const e = 1 !== this.ht.state;
        if (e) this.dt(t); else this.updateTarget(t);
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) return;
            this.unbind();
        }
        this.s = t;
        P(this.ast, t, this);
        const e = this.v = T(this.ast, this.s, this, (2 & this.mode) > 0 ? this : null);
        if (St(e)) this.observeCollection(e);
        this.updateTarget(e);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        _(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
        this.lt?.cancel();
        this.lt = null;
    }
    dt(t) {
        const e = this.lt;
        this.lt = this.ct.queueTask((() => {
            this.lt = null;
            this.updateTarget(t);
        }), Qe);
        e?.cancel();
    }
}

Oe(ContentBinding);

ze(ContentBinding, (() => "updateTarget"));

E()(ContentBinding);

Ve(void 0, false)(ContentBinding);

class LetBinding {
    constructor(t, e, i, s, n = false) {
        this.ast = i;
        this.targetProperty = s;
        this.isBound = false;
        this.s = void 0;
        this.target = null;
        this.boundFn = false;
        this.l = t;
        this.oL = e;
        this.gt = n;
    }
    updateTarget() {
        this.target[this.targetProperty] = this.v;
    }
    handleChange() {
        if (!this.isBound) return;
        this.obs.version++;
        this.v = T(this.ast, this.s, this, this);
        this.obs.clear();
        this.updateTarget();
    }
    handleCollectionChange() {
        this.handleChange();
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) return;
            this.unbind();
        }
        this.s = t;
        this.target = this.gt ? t.bindingContext : t.overrideContext;
        P(this.ast, t, this);
        this.v = T(this.ast, this.s, this, this);
        this.updateTarget();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        _(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

Oe(LetBinding);

ze(LetBinding, (() => "updateTarget"));

E(LetBinding);

Ve(true)(LetBinding);

class PropertyBinding {
    constructor(t, e, i, s, n, r, o, l) {
        this.ast = n;
        this.target = r;
        this.targetProperty = o;
        this.mode = l;
        this.isBound = false;
        this.s = void 0;
        this.ut = void 0;
        this.lt = null;
        this.vt = null;
        this.boundFn = false;
        this.l = e;
        this.ht = t;
        this.ct = s;
        this.oL = i;
    }
    updateTarget(t) {
        this.ut.setValue(t, this.target, this.targetProperty);
    }
    updateSource(t) {
        $(this.ast, this.s, this, t);
    }
    handleChange() {
        if (!this.isBound) return;
        this.obs.version++;
        const t = T(this.ast, this.s, this, (2 & this.mode) > 0 ? this : null);
        this.obs.clear();
        const e = 1 !== this.ht.state && (4 & this.ut.type) > 0;
        if (e) {
            Ye = this.lt;
            this.lt = this.ct.queueTask((() => {
                this.updateTarget(t);
                this.lt = null;
            }), Ze);
            Ye?.cancel();
            Ye = null;
        } else this.updateTarget(t);
    }
    handleCollectionChange() {
        this.handleChange();
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) return;
            this.unbind();
        }
        this.s = t;
        P(this.ast, t, this);
        const e = this.oL;
        const i = this.mode;
        let s = this.ut;
        if (!s) {
            if (4 & i) s = e.getObserver(this.target, this.targetProperty); else s = e.getAccessor(this.target, this.targetProperty);
            this.ut = s;
        }
        const n = (2 & i) > 0;
        if (i & (2 | 1)) this.updateTarget(T(this.ast, this.s, this, n ? this : null));
        if (4 & i) {
            s.subscribe(this.vt ?? (this.vt = new BindingTargetSubscriber(this, this.l.get(je))));
            if (!n) this.updateSource(s.getValue(this.target, this.targetProperty));
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        _(this.ast, this.s, this);
        this.s = void 0;
        if (this.vt) {
            this.ut.unsubscribe(this.vt);
            this.vt = null;
        }
        this.lt?.cancel();
        this.lt = null;
        this.obs.clearAll();
    }
    useTargetObserver(t) {
        this.ut?.unsubscribe(this);
        (this.ut = t).subscribe(this);
    }
    useTargetSubscriber(t) {
        if (null != this.vt) throw vt(`AURxxxx: binding already has a target subscriber`);
        this.vt = t;
    }
}

Oe(PropertyBinding);

ze(PropertyBinding, (t => 4 & t.mode ? "updateSource" : "updateTarget"));

E(PropertyBinding);

Ve(true, false)(PropertyBinding);

let Ye = null;

const Ze = {
    reusable: false,
    preempt: true
};

class RefBinding {
    constructor(t, e, i) {
        this.ast = e;
        this.target = i;
        this.isBound = false;
        this.s = void 0;
        this.l = t;
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) return;
            this.unbind();
        }
        this.s = t;
        P(this.ast, t, this);
        $(this.ast, this.s, this, this.target);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        if (T(this.ast, this.s, this, null) === this.target) $(this.ast, this.s, this, null);
        _(this.ast, this.s, this);
        this.s = void 0;
    }
}

Ve(false)(RefBinding);

class ListenerBindingOptions {
    constructor(t, e = false) {
        this.prevent = t;
        this.capture = e;
    }
}

class ListenerBinding {
    constructor(t, e, i, s, n) {
        this.ast = e;
        this.target = i;
        this.targetEvent = s;
        this.isBound = false;
        this.self = false;
        this.boundFn = true;
        this.l = t;
        this.xt = n;
    }
    callSource(t) {
        const e = this.s.overrideContext;
        e.$event = t;
        let i = T(this.ast, this.s, this, null);
        delete e.$event;
        if (Rt(i)) i = i(t);
        if (true !== i && this.xt.prevent) t.preventDefault();
        return i;
    }
    handleEvent(t) {
        if (this.self) if (this.target !== t.composedPath()[0]) return;
        this.callSource(t);
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) return;
            this.unbind();
        }
        this.s = t;
        P(this.ast, t, this);
        this.target.addEventListener(this.targetEvent, this, this.xt);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        _(this.ast, this.s, this);
        this.s = void 0;
        this.target.removeEventListener(this.targetEvent, this, this.xt);
    }
}

Oe(ListenerBinding);

ze(ListenerBinding, (() => "callSource"));

Ve(true, true)(ListenerBinding);

const Je = Ht("IAppTask");

class $AppTask {
    constructor(t, e, i) {
        this.c = void 0;
        this.slot = t;
        this.k = e;
        this.cb = i;
    }
    register(t) {
        return this.c = t.register(Gt(Je, this));
    }
    run() {
        const t = this.k;
        const e = this.cb;
        return null === t ? e() : e(this.c.get(t));
    }
}

const ti = wt({
    creating: ei("creating"),
    hydrating: ei("hydrating"),
    hydrated: ei("hydrated"),
    activating: ei("activating"),
    activated: ei("activated"),
    deactivating: ei("deactivating"),
    deactivated: ei("deactivated")
});

function ei(t) {
    function e(e, i) {
        if (Rt(i)) return new $AppTask(t, e, i);
        return new $AppTask(t, null, e);
    }
    return e;
}

function ii(t, e) {
    if (null == t) throw vt(`AUR0772`);
    return function i(s, n, r) {
        const o = null == n;
        const l = o ? s : s.constructor;
        const h = new WatchDefinition(t, o ? e : r.value);
        if (o) {
            if (!Rt(e) && (null == e || !(e in l.prototype))) throw vt(`AUR0773:${mt(e)}@${l.name}}`);
        } else if (!Rt(r?.value)) throw vt(`AUR0774:${mt(n)}`);
        ri.add(l, h);
        if (ui(l)) mi(l).watches.push(h);
        if (Gs(l)) Qs(l).watches.push(h);
    };
}

class WatchDefinition {
    constructor(t, e) {
        this.expression = t;
        this.callback = e;
    }
}

const si = l;

const ni = ht("watch");

const ri = wt({
    name: ni,
    add(t, e) {
        let i = st(ni, t);
        if (null == i) rt(ni, i = [], t);
        i.push(e);
    },
    getAnnotation(t) {
        return st(ni, t) ?? si;
    }
});

function oi(t) {
    return function(e) {
        return di(t, e);
    };
}

function li(t) {
    return function(e) {
        return di(It(t) ? {
            isTemplateController: true,
            name: t
        } : {
            isTemplateController: true,
            ...t
        }, e);
    };
}

class CustomAttributeDefinition {
    get type() {
        return 2;
    }
    constructor(t, e, i, s, n, r, o, l, h, a) {
        this.Type = t;
        this.name = e;
        this.aliases = i;
        this.key = s;
        this.defaultBindingMode = n;
        this.isTemplateController = r;
        this.bindables = o;
        this.noMultiBindings = l;
        this.watches = h;
        this.dependencies = a;
    }
    static create(t, e) {
        let s;
        let n;
        if (It(t)) {
            s = t;
            n = {
                name: s
            };
        } else {
            s = t.name;
            n = t;
        }
        return new CustomAttributeDefinition(e, i(ci(e, "name"), s), a(ci(e, "aliases"), n.aliases, e.aliases), ai(s), i(ci(e, "defaultBindingMode"), n.defaultBindingMode, e.defaultBindingMode, 2), i(ci(e, "isTemplateController"), n.isTemplateController, e.isTemplateController, false), Dt.from(e, ...Dt.getAll(e), ci(e, "bindables"), e.bindables, n.bindables), i(ci(e, "noMultiBindings"), n.noMultiBindings, e.noMultiBindings, false), a(ri.getAnnotation(e), e.watches), a(ci(e, "dependencies"), n.dependencies, e.dependencies));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        Xt(i, e).register(t);
        zt(i, e).register(t);
        Yt(s, gi, i, t);
    }
}

const hi = at("custom-attribute");

const ai = t => `${hi}:${t}`;

const ci = (t, e) => st(ht(e), t);

const ui = t => Rt(t) && nt(hi, t);

const fi = (t, e) => ps(t, ai(e)) ?? void 0;

const di = (t, e) => {
    const i = CustomAttributeDefinition.create(t, e);
    rt(hi, i, i.Type);
    rt(hi, i, i);
    ct(e, hi);
    return i.Type;
};

const mi = t => {
    const e = st(hi, t);
    if (void 0 === e) throw vt(`AUR0759:${t.name}`);
    return e;
};

const gi = wt({
    name: hi,
    keyFrom: ai,
    isType: ui,
    for: fi,
    define: di,
    getDefinition: mi,
    annotate(t, e, i) {
        rt(ht(e), i, t);
    },
    getAnnotation: ci
});

const pi = c;

const vi = (t, e, i, s) => {
    t.addEventListener(e, i, s);
};

const xi = (t, e, i, s) => {
    t.removeEventListener(e, i, s);
};

const wi = t => {
    let e;
    const i = t.prototype;
    _t(i, "subscribe", (function(t) {
        if (this.subs.add(t) && 1 === this.subs.count) {
            for (e of this.cf.events) vi(this.wt, e, this);
            this.bt = true;
            this.yt?.();
        }
    }));
    _t(i, "unsubscribe", (function(t) {
        if (this.subs.remove(t) && 0 === this.subs.count) {
            for (e of this.cf.events) xi(this.wt, e, this);
            this.bt = false;
            this.kt?.();
        }
    }));
    _t(i, "useConfig", (function(t) {
        this.cf = t;
        if (this.bt) {
            for (e of this.cf.events) xi(this.wt, e, this);
            for (e of this.cf.events) vi(this.wt, e, this);
        }
    }));
};

const bi = t => {
    _t(t.prototype, "subscribe", n);
    _t(t.prototype, "unsubscribe", n);
};

class ClassAttributeAccessor {
    get doNotCache() {
        return true;
    }
    constructor(t) {
        this.obj = t;
        this.type = 2 | 4;
        this.value = "";
        this.ov = "";
        this.At = {};
        this.Ct = 0;
        this.J = false;
    }
    getValue() {
        return this.value;
    }
    setValue(t) {
        this.value = t;
        this.J = t !== this.ov;
        this.it();
    }
    it() {
        if (this.J) {
            this.J = false;
            const t = this.value;
            const e = this.At;
            const i = yi(t);
            let s = this.Ct;
            this.ov = t;
            if (i.length > 0) this.Bt(i);
            this.Ct += 1;
            if (0 === s) return;
            s -= 1;
            for (const t in e) {
                if (!xt.call(e, t) || e[t] !== s) continue;
                this.obj.classList.remove(t);
            }
        }
    }
    Bt(t) {
        const e = this.obj;
        const i = t.length;
        let s = 0;
        let n;
        for (;s < i; s++) {
            n = t[s];
            if (0 === n.length) continue;
            this.At[n] = this.Ct;
            e.classList.add(n);
        }
    }
}

function yi(t) {
    if (It(t)) return ki(t);
    if ("object" !== typeof t) return l;
    if (t instanceof Array) {
        const e = t.length;
        if (e > 0) {
            const i = [];
            let s = 0;
            for (;e > s; ++s) i.push(...yi(t[s]));
            return i;
        } else return l;
    }
    const e = [];
    let i;
    for (i in t) if (Boolean(t[i])) if (i.includes(" ")) e.push(...ki(i)); else e.push(i);
    return e;
}

function ki(t) {
    const e = t.match(/\S+/g);
    if (null === e) return l;
    return e;
}

bi(ClassAttributeAccessor);

function Ai(...t) {
    return new CSSModulesProcessorRegistry(t);
}

class CSSModulesProcessorRegistry {
    constructor(t) {
        this.modules = t;
    }
    register(t) {
        var e;
        const i = bt({}, ...this.modules);
        const s = di({
            name: "class",
            bindables: [ "value" ],
            noMultiBindings: true
        }, (e = class CustomAttributeClass {
            constructor(t) {
                this.St = new ClassAttributeAccessor(t);
            }
            binding() {
                this.valueChanged();
            }
            valueChanged() {
                this.St.setValue(this.value?.split(/\s+/g).map((t => i[t] || t)) ?? "");
            }
        }, e.inject = [ xs ], e));
        t.register(s, Gt(ys, i));
    }
}

function Ci(...t) {
    return new ShadowDOMRegistry(t);
}

const Bi = Ht("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
    if (AdoptedStyleSheetsStyles.supported(t.get(pi))) return t.get(AdoptedStyleSheetsStylesFactory);
    return t.get(StyleElementStylesFactory);
}))));

class ShadowDOMRegistry {
    constructor(t) {
        this.css = t;
    }
    register(t) {
        const e = t.get(Ri);
        const i = t.get(Bi);
        t.register(Gt(Si, i.createStyles(this.css, e)));
    }
}

class AdoptedStyleSheetsStylesFactory {
    constructor(t) {
        this.p = t;
        this.cache = new Map;
    }
    createStyles(t, e) {
        return new AdoptedStyleSheetsStyles(this.p, t, this.cache, e);
    }
}

AdoptedStyleSheetsStylesFactory.inject = [ pi ];

class StyleElementStylesFactory {
    constructor(t) {
        this.p = t;
    }
    createStyles(t, e) {
        return new StyleElementStyles(this.p, t, e);
    }
}

StyleElementStylesFactory.inject = [ pi ];

const Si = Ht("IShadowDOMStyles");

const Ri = Ht("IShadowDOMGlobalStyles", (t => t.instance({
    applyTo: n
})));

class AdoptedStyleSheetsStyles {
    constructor(t, e, i, s = null) {
        this.sharedStyles = s;
        this.styleSheets = e.map((e => {
            let s;
            if (e instanceof t.CSSStyleSheet) s = e; else {
                s = i.get(e);
                if (void 0 === s) {
                    s = new t.CSSStyleSheet;
                    s.replaceSync(e);
                    i.set(e, s);
                }
            }
            return s;
        }));
    }
    static supported(t) {
        return "adoptedStyleSheets" in t.ShadowRoot.prototype;
    }
    applyTo(t) {
        if (null !== this.sharedStyles) this.sharedStyles.applyTo(t);
        t.adoptedStyleSheets = [ ...t.adoptedStyleSheets, ...this.styleSheets ];
    }
}

class StyleElementStyles {
    constructor(t, e, i = null) {
        this.p = t;
        this.localStyles = e;
        this.sharedStyles = i;
    }
    applyTo(t) {
        const e = this.localStyles;
        const i = this.p;
        for (let s = e.length - 1; s > -1; --s) {
            const n = i.document.createElement("style");
            n.innerHTML = e[s];
            t.prepend(n);
        }
        if (null !== this.sharedStyles) this.sharedStyles.applyTo(t);
    }
}

const Ii = {
    shadowDOM(t) {
        return ti.creating(u, (e => {
            if (null != t.sharedStyles) {
                const i = e.get(Bi);
                e.register(Gt(Ri, i.createStyles(t.sharedStyles, null)));
            }
        }));
    }
};

const {enter: Ti, exit: Li} = U;

const {wrap: Ei, unwrap: Pi} = q;

class ComputedWatcher {
    get value() {
        return this.v;
    }
    constructor(t, e, i, s, n) {
        this.obj = t;
        this.$get = i;
        this.useProxy = n;
        this.isBound = false;
        this.running = false;
        this.v = void 0;
        this.cb = s;
        this.oL = e;
    }
    handleChange() {
        this.run();
    }
    handleCollectionChange() {
        this.run();
    }
    bind() {
        if (this.isBound) return;
        this.compute();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        this.obs.clearAll();
    }
    run() {
        if (!this.isBound || this.running) return;
        const t = this.obj;
        const e = this.v;
        const i = this.compute();
        if (!Et(i, e)) this.cb.call(t, i, e, t);
    }
    compute() {
        this.running = true;
        this.obs.version++;
        try {
            Ti(this);
            return this.v = Pi(this.$get.call(void 0, this.useProxy ? Ei(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            Li(this);
        }
    }
}

class ExpressionWatcher {
    get value() {
        return this.v;
    }
    constructor(t, e, i, s, n) {
        this.scope = t;
        this.l = e;
        this.oL = i;
        this.isBound = false;
        this.boundFn = false;
        this.obj = t.bindingContext;
        this.Rt = s;
        this.cb = n;
    }
    handleChange(t) {
        const e = this.Rt;
        const i = this.obj;
        const s = this.v;
        const n = 1 === e.$kind && 1 === this.obs.count;
        if (!n) {
            this.obs.version++;
            t = T(e, this.scope, this, this);
            this.obs.clear();
        }
        if (!Et(t, s)) {
            this.v = t;
            this.cb.call(i, t, s, i);
        }
    }
    bind() {
        if (this.isBound) return;
        this.obs.version++;
        this.v = T(this.Rt, this.scope, this, this);
        this.obs.clear();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        this.obs.clearAll();
        this.v = void 0;
    }
}

E(ComputedWatcher);

E(ExpressionWatcher);

Ve(true)(ExpressionWatcher);

const _i = Ht("ILifecycleHooks");

class LifecycleHooksEntry {
    constructor(t, e) {
        this.definition = t;
        this.instance = e;
    }
}

class LifecycleHooksDefinition {
    constructor(t, e) {
        this.Type = t;
        this.propertyNames = e;
    }
    static create(t, e) {
        const i = new Set;
        let s = e.prototype;
        while (s !== gt) {
            for (const t of yt(s)) if ("constructor" !== t && !t.startsWith("_")) i.add(t);
            s = Object.getPrototypeOf(s);
        }
        return new LifecycleHooksDefinition(e, i);
    }
    register(t) {
        Wt(_i, this.Type).register(t);
    }
}

const $i = new WeakMap;

const Ui = ht("lifecycle-hooks");

const qi = wt({
    name: Ui,
    define(t, e) {
        const i = LifecycleHooksDefinition.create(t, e);
        rt(Ui, i, e);
        ct(e, Ui);
        return i.Type;
    },
    resolve(t) {
        let e = $i.get(t);
        if (void 0 === e) {
            $i.set(t, e = new LifecycleHooksLookupImpl);
            const i = t.root;
            const s = i.id === t.id ? t.getAll(_i) : t.has(_i, false) ? i.getAll(_i).concat(t.getAll(_i)) : i.getAll(_i);
            let n;
            let r;
            let o;
            let l;
            let h;
            for (n of s) {
                r = st(Ui, n.constructor);
                o = new LifecycleHooksEntry(r, n);
                for (l of r.propertyNames) {
                    h = e[l];
                    if (void 0 === h) e[l] = [ o ]; else h.push(o);
                }
            }
        }
        return e;
    }
});

class LifecycleHooksLookupImpl {}

function Di() {
    return function t(e) {
        return qi.define({}, e);
    };
}

const Mi = Ht("IViewFactory");

class ViewFactory {
    constructor(t, e) {
        this.isCaching = false;
        this.Y = null;
        this.It = -1;
        this.name = e.name;
        this.container = t;
        this.def = e;
    }
    setCacheSize(t, e) {
        if (t) {
            if ("*" === t) t = ViewFactory.maxCacheSize; else if (It(t)) t = parseInt(t, 10);
            if (-1 === this.It || !e) this.It = t;
        }
        if (this.It > 0) this.Y = []; else this.Y = null;
        this.isCaching = this.It > 0;
    }
    canReturnToCache(t) {
        return null != this.Y && this.Y.length < this.It;
    }
    tryReturnToCache(t) {
        if (this.canReturnToCache(t)) {
            this.Y.push(t);
            return true;
        }
        return false;
    }
    create(t) {
        const e = this.Y;
        let i;
        if (null != e && e.length > 0) {
            i = e.pop();
            return i;
        }
        i = Controller.$view(this, t);
        return i;
    }
}

ViewFactory.maxCacheSize = 65535;

const Fi = Ht("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.Tt ?? (this.Tt = this.Lt.getAll(fn, false).reduce(((t, e) => {
            t[e.target] = e;
            return t;
        }), pt()));
    }
    constructor(t) {
        this.Et = new WeakMap;
        this.Pt = new WeakMap;
        const e = t.root;
        this.p = (this.Lt = e).get(pi);
        this.ep = e.get(D);
        this.oL = e.get(M);
        this._t = new FragmentNodeSequence(this.p, this.p.document.createDocumentFragment());
    }
    compile(t, e, i) {
        if (false !== t.needsCompile) {
            const s = this.Et;
            const n = e.get(un);
            let r = s.get(t);
            if (null == r) s.set(t, r = n.compile(t, e, i)); else e.register(...r.dependencies);
            return r;
        }
        return t;
    }
    getViewFactory(t, e) {
        return new ViewFactory(e, CustomElementDefinition.getOrCreate(t));
    }
    createNodes(t) {
        if (true === t.enhance) return new FragmentNodeSequence(this.p, t.template);
        let e;
        let i = false;
        const s = this.Pt;
        const n = this.p;
        const r = n.document;
        if (s.has(t)) e = s.get(t); else {
            const o = t.template;
            let l;
            if (null === o) e = null; else if (o instanceof n.Node) if ("TEMPLATE" === o.nodeName) {
                e = o.content;
                i = true;
            } else (e = r.createDocumentFragment()).appendChild(o.cloneNode(true)); else {
                l = r.createElement("template");
                if (It(o)) l.innerHTML = o;
                e = l.content;
                i = true;
            }
            s.set(t, e);
        }
        return null == e ? this._t : new FragmentNodeSequence(this.p, i ? r.importNode(e, true) : r.adoptNode(e.cloneNode(true)));
    }
    render(t, e, i, s) {
        const n = i.instructions;
        const r = this.renderers;
        const o = e.length;
        if (e.length !== n.length) throw vt(`AUR0757:${o}<>${n.length}`);
        let l = 0;
        let h = 0;
        let a = 0;
        let c;
        let u;
        let f;
        if (o > 0) while (o > l) {
            c = n[l];
            f = e[l];
            h = 0;
            a = c.length;
            while (a > h) {
                u = c[h];
                r[u.type].render(t, f, u, this.p, this.ep, this.oL);
                ++h;
            }
            ++l;
        }
        if (null != s) {
            c = i.surrogates;
            if ((a = c.length) > 0) {
                h = 0;
                while (a > h) {
                    u = c[h];
                    r[u.type].render(t, s, u, this.p, this.ep, this.oL);
                    ++h;
                }
            }
        }
    }
}

Rendering.inject = [ u ];

var Oi;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["host"] = 1] = "host";
    t[t["shadowRoot"] = 2] = "shadowRoot";
    t[t["location"] = 3] = "location";
})(Oi || (Oi = {}));

const Vi = {
    optional: true
};

const Ni = new WeakMap;

class Controller {
    get lifecycleHooks() {
        return this.$t;
    }
    get isActive() {
        return (this.state & (1 | 2)) > 0 && 0 === (4 & this.state);
    }
    get name() {
        if (null === this.parent) switch (this.vmKind) {
          case 1:
            return `[${this.definition.name}]`;

          case 0:
            return this.definition.name;

          case 2:
            return this.viewFactory.name;
        }
        switch (this.vmKind) {
          case 1:
            return `${this.parent.name}>[${this.definition.name}]`;

          case 0:
            return `${this.parent.name}>${this.definition.name}`;

          case 2:
            return this.viewFactory.name === this.parent.definition?.name ? `${this.parent.name}[view]` : `${this.parent.name}[view:${this.viewFactory.name}]`;
        }
    }
    get hooks() {
        return this.Ut;
    }
    get viewModel() {
        return this.qt;
    }
    set viewModel(t) {
        this.qt = t;
        this.Ut = null == t || 2 === this.vmKind ? HooksDefinition.none : new HooksDefinition(t);
    }
    constructor(t, e, i, s, n, r, o) {
        this.container = t;
        this.vmKind = e;
        this.definition = i;
        this.viewFactory = s;
        this.host = r;
        this.head = null;
        this.tail = null;
        this.next = null;
        this.parent = null;
        this.bindings = null;
        this.children = null;
        this.hasLockedScope = false;
        this.isStrictBinding = false;
        this.scope = null;
        this.isBound = false;
        this.hostController = null;
        this.mountTarget = 0;
        this.shadowRoot = null;
        this.nodes = null;
        this.location = null;
        this.$t = null;
        this.state = 0;
        this.Dt = false;
        this.$initiator = null;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this.Mt = 0;
        this.Ft = 0;
        this.Ot = 0;
        this.qt = n;
        this.Ut = 2 === e ? HooksDefinition.none : new HooksDefinition(n);
        this.location = o;
        this.r = t.root.get(Fi);
    }
    static getCached(t) {
        return Ni.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (void 0 === e) throw vt(`AUR0500:${t}`);
        return e;
    }
    static $el(t, e, i, s, n = void 0, r = null) {
        if (Ni.has(e)) return Ni.get(e);
        n = n ?? Qs(e.constructor);
        const o = new Controller(t, 0, n, null, e, i, r);
        const l = t.get(f(es));
        if (n.dependencies.length > 0) t.register(...n.dependencies);
        Kt(t, es, new d("IHydrationContext", new HydrationContext(o, s, l)));
        Ni.set(e, o);
        if (null == s || false !== s.hydrate) o.hE(s, l);
        return o;
    }
    static $attr(t, e, i, s) {
        if (Ni.has(e)) return Ni.get(e);
        s = s ?? mi(e.constructor);
        const n = new Controller(t, 1, s, null, e, i, null);
        if (s.dependencies.length > 0) t.register(...s.dependencies);
        Ni.set(e, n);
        n.Vt();
        return n;
    }
    static $view(t, e = void 0) {
        const i = new Controller(t.container, 2, null, t, null, null, null);
        i.parent = e ?? null;
        i.Nt();
        return i;
    }
    hE(t, e) {
        const i = this.container;
        const s = this.qt;
        let n = this.definition;
        this.scope = F.create(s, null, true);
        if (n.watches.length > 0) Gi(this, i, n, s);
        Hi(this, n, s);
        if (this.Ut.hasDefine) {
            const t = s.define(this, e, n);
            if (void 0 !== t && t !== n) n = CustomElementDefinition.getOrCreate(t);
        }
        this.$t = qi.resolve(i);
        n.register(i);
        if (null !== n.injectable) Kt(i, n.injectable, new d("definition.injectable", s));
        if (null == t || false !== t.hydrate) {
            this.hS(t);
            this.hC();
        }
    }
    hS(t) {
        if (null != this.$t.hydrating) this.$t.hydrating.forEach(ns, this);
        if (this.Ut.hasHydrating) this.qt.hydrating(this);
        const e = this.jt = this.r.compile(this.definition, this.container, t);
        const {shadowOptions: i, isStrictBinding: s, hasSlots: n, containerless: r} = e;
        let o = this.location;
        this.isStrictBinding = s;
        if (null !== (this.hostController = Xs(this.host, Vi))) {
            this.host = this.container.root.get(pi).document.createElement(this.definition.name);
            if (r && null == o) o = this.location = Bs(this.host);
        }
        vs(this.host, Ns, this);
        vs(this.host, this.definition.key, this);
        if (null !== i || n) {
            if (null != o) throw vt(`AUR0501`);
            vs(this.shadowRoot = this.host.attachShadow(i ?? Qi), Ns, this);
            vs(this.shadowRoot, this.definition.key, this);
            this.mountTarget = 2;
        } else if (null != o) {
            vs(o, Ns, this);
            vs(o, this.definition.key, this);
            this.mountTarget = 3;
        } else this.mountTarget = 1;
        this.qt.$controller = this;
        this.nodes = this.r.createNodes(e);
        if (void 0 !== this.$t.hydrated) this.$t.hydrated.forEach(rs, this);
        if (this.Ut.hasHydrated) this.qt.hydrated(this);
    }
    hC() {
        this.r.render(this, this.nodes.findTargets(), this.jt, this.host);
        if (void 0 !== this.$t.created) this.$t.created.forEach(ss, this);
        if (this.Ut.hasCreated) this.qt.created(this);
    }
    Vt() {
        const t = this.definition;
        const e = this.qt;
        if (t.watches.length > 0) Gi(this, this.container, t, e);
        Hi(this, t, e);
        e.$controller = this;
        this.$t = qi.resolve(this.container);
        if (void 0 !== this.$t.created) this.$t.created.forEach(ss, this);
        if (this.Ut.hasCreated) this.qt.created(this);
    }
    Nt() {
        this.jt = this.r.compile(this.viewFactory.def, this.container, null);
        this.isStrictBinding = this.jt.isStrictBinding;
        this.r.render(this, (this.nodes = this.r.createNodes(this.jt)).findTargets(), this.jt, void 0);
    }
    activate(t, e, i) {
        switch (this.state) {
          case 0:
          case 8:
            if (!(null === e || e.isActive)) return;
            this.state = 1;
            break;

          case 2:
            return;

          case 32:
            throw vt(`AUR0502:${this.name}`);

          default:
            throw vt(`AUR0503:${this.name} ${Ji(this.state)}`);
        }
        this.parent = e;
        switch (this.vmKind) {
          case 0:
            this.scope.parent = i ?? null;
            break;

          case 1:
            this.scope = i ?? null;
            break;

          case 2:
            if (void 0 === i || null === i) throw vt(`AUR0504`);
            if (!this.hasLockedScope) this.scope = i;
            break;
        }
        if (this.isStrictBinding) ;
        this.$initiator = t;
        this.Ht();
        let s;
        if (2 !== this.vmKind && null != this.$t.binding) s = m(...this.$t.binding.map(os, this));
        if (this.Ut.hasBinding) s = m(s, this.qt.binding(this.$initiator, this.parent));
        if (Bt(s)) {
            this.Wt();
            s.then((() => {
                this.bind();
            })).catch((t => {
                this.zt(t);
            }));
            return this.$promise;
        }
        this.bind();
        return this.$promise;
    }
    bind() {
        let t = 0;
        let e = 0;
        let i;
        if (null !== this.bindings) {
            t = 0;
            e = this.bindings.length;
            while (e > t) {
                this.bindings[t].bind(this.scope);
                ++t;
            }
        }
        if (2 !== this.vmKind && null != this.$t.bound) i = m(...this.$t.bound.map(ls, this));
        if (this.Ut.hasBound) i = m(i, this.qt.bound(this.$initiator, this.parent));
        if (Bt(i)) {
            this.Wt();
            i.then((() => {
                this.isBound = true;
                this.Gt();
            })).catch((t => {
                this.zt(t);
            }));
            return;
        }
        this.isBound = true;
        this.Gt();
    }
    Xt(...t) {
        switch (this.mountTarget) {
          case 1:
            this.host.append(...t);
            break;

          case 2:
            this.shadowRoot.append(...t);
            break;

          case 3:
            {
                let e = 0;
                for (;e < t.length; ++e) this.location.parentNode.insertBefore(t[e], this.location);
                break;
            }
        }
    }
    Gt() {
        if (null !== this.hostController) switch (this.mountTarget) {
          case 1:
          case 2:
            this.hostController.Xt(this.host);
            break;

          case 3:
            this.hostController.Xt(this.location.$start, this.location);
            break;
        }
        switch (this.mountTarget) {
          case 1:
            this.nodes.appendTo(this.host, null != this.definition && this.definition.enhance);
            break;

          case 2:
            {
                const t = this.container;
                const e = t.has(Si, false) ? t.get(Si) : t.get(Ri);
                e.applyTo(this.shadowRoot);
                this.nodes.appendTo(this.shadowRoot);
                break;
            }

          case 3:
            this.nodes.insertBefore(this.location);
            break;
        }
        let t = 0;
        let e;
        if (2 !== this.vmKind && null != this.$t.attaching) e = m(...this.$t.attaching.map(hs, this));
        if (this.Ut.hasAttaching) e = m(e, this.qt.attaching(this.$initiator, this.parent));
        if (Bt(e)) {
            this.Wt();
            this.Ht();
            e.then((() => {
                this.Kt();
            })).catch((t => {
                this.zt(t);
            }));
        }
        if (null !== this.children) for (;t < this.children.length; ++t) void this.children[t].activate(this.$initiator, this, this.scope);
        this.Kt();
    }
    deactivate(t, e) {
        switch (~16 & this.state) {
          case 2:
            this.state = 4;
            break;

          case 0:
          case 8:
          case 32:
          case 8 | 32:
            return;

          default:
            throw vt(`AUR0505:${this.name} ${Ji(this.state)}`);
        }
        this.$initiator = t;
        if (t === this) this.Qt();
        let i = 0;
        let s;
        if (null !== this.children) for (i = 0; i < this.children.length; ++i) void this.children[i].deactivate(t, this);
        if (2 !== this.vmKind && null != this.$t.detaching) s = m(...this.$t.detaching.map(cs, this));
        if (this.Ut.hasDetaching) s = m(s, this.qt.detaching(this.$initiator, this.parent));
        if (Bt(s)) {
            this.Wt();
            t.Qt();
            s.then((() => {
                t.Yt();
            })).catch((e => {
                t.zt(e);
            }));
        }
        if (null === t.head) t.head = this; else t.tail.next = this;
        t.tail = this;
        if (t !== this) return;
        this.Yt();
        return this.$promise;
    }
    removeNodes() {
        switch (this.vmKind) {
          case 0:
          case 2:
            this.nodes.remove();
            this.nodes.unlink();
        }
        if (null !== this.hostController) switch (this.mountTarget) {
          case 1:
          case 2:
            this.host.remove();
            break;

          case 3:
            this.location.$start.remove();
            this.location.remove();
            break;
        }
    }
    unbind() {
        let t = 0;
        if (null !== this.bindings) for (;t < this.bindings.length; ++t) this.bindings[t].unbind();
        this.parent = null;
        switch (this.vmKind) {
          case 1:
            this.scope = null;
            break;

          case 2:
            if (!this.hasLockedScope) this.scope = null;
            if (16 === (16 & this.state) && !this.viewFactory.tryReturnToCache(this) && this.$initiator === this) this.dispose();
            break;

          case 0:
            this.scope.parent = null;
            break;
        }
        this.state = 8;
        this.$initiator = null;
        this.Zt();
    }
    Wt() {
        if (void 0 === this.$promise) {
            this.$promise = new Promise(((t, e) => {
                this.$resolve = t;
                this.$reject = e;
            }));
            if (this.$initiator !== this) this.parent.Wt();
        }
    }
    Zt() {
        if (void 0 !== this.$promise) {
            fs = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            fs();
            fs = void 0;
        }
    }
    zt(t) {
        if (void 0 !== this.$promise) {
            ds = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            ds(t);
            ds = void 0;
        }
        if (this.$initiator !== this) this.parent.zt(t);
    }
    Ht() {
        ++this.Mt;
        if (this.$initiator !== this) this.parent.Ht();
    }
    Kt() {
        if (0 === --this.Mt) {
            if (2 !== this.vmKind && null != this.$t.attached) ms = m(...this.$t.attached.map(as, this));
            if (this.Ut.hasAttached) ms = m(ms, this.qt.attached(this.$initiator));
            if (Bt(ms)) {
                this.Wt();
                ms.then((() => {
                    this.state = 2;
                    this.Zt();
                    if (this.$initiator !== this) this.parent.Kt();
                })).catch((t => {
                    this.zt(t);
                }));
                ms = void 0;
                return;
            }
            ms = void 0;
            this.state = 2;
            this.Zt();
        }
        if (this.$initiator !== this) this.parent.Kt();
    }
    Qt() {
        ++this.Ft;
    }
    Yt() {
        if (0 === --this.Ft) {
            this.Jt();
            this.removeNodes();
            let t = this.$initiator.head;
            let e;
            while (null !== t) {
                if (t !== this) {
                    if (t.debug) t.logger.trace(`detach()`);
                    t.removeNodes();
                }
                if (2 !== t.vmKind && null != t.$t.unbinding) e = m(...t.$t.unbinding.map(us, this));
                if (t.Ut.hasUnbinding) {
                    if (t.debug) t.logger.trace("unbinding()");
                    e = m(e, t.viewModel.unbinding(t.$initiator, t.parent));
                }
                if (Bt(e)) {
                    this.Wt();
                    this.Jt();
                    e.then((() => {
                        this.te();
                    })).catch((t => {
                        this.zt(t);
                    }));
                }
                e = void 0;
                t = t.next;
            }
            this.te();
        }
    }
    Jt() {
        ++this.Ot;
    }
    te() {
        if (0 === --this.Ot) {
            let t = this.$initiator.head;
            let e = null;
            while (null !== t) {
                if (t !== this) {
                    t.isBound = false;
                    t.unbind();
                }
                e = t.next;
                t.next = null;
                t = e;
            }
            this.head = this.tail = null;
            this.isBound = false;
            this.unbind();
        }
    }
    addBinding(t) {
        if (null === this.bindings) this.bindings = [ t ]; else this.bindings[this.bindings.length] = t;
    }
    addChild(t) {
        if (null === this.children) this.children = [ t ]; else this.children[this.children.length] = t;
    }
    is(t) {
        switch (this.vmKind) {
          case 1:
            return mi(this.qt.constructor).name === t;

          case 0:
            return Qs(this.qt.constructor).name === t;

          case 2:
            return this.viewFactory.name === t;
        }
    }
    lockScope(t) {
        this.scope = t;
        this.hasLockedScope = true;
    }
    setHost(t) {
        if (0 === this.vmKind) {
            vs(t, Ns, this);
            vs(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = 1;
        return this;
    }
    setShadowRoot(t) {
        if (0 === this.vmKind) {
            vs(t, Ns, this);
            vs(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = 2;
        return this;
    }
    setLocation(t) {
        if (0 === this.vmKind) {
            vs(t, Ns, this);
            vs(t, this.definition.key, this);
        }
        this.location = t;
        this.mountTarget = 3;
        return this;
    }
    release() {
        this.state |= 16;
    }
    dispose() {
        if (32 === (32 & this.state)) return;
        this.state |= 32;
        if (this.Ut.hasDispose) this.qt.dispose();
        if (null !== this.children) {
            this.children.forEach(is);
            this.children = null;
        }
        this.hostController = null;
        this.scope = null;
        this.nodes = null;
        this.location = null;
        this.viewFactory = null;
        if (null !== this.qt) {
            Ni.delete(this.qt);
            this.qt = null;
        }
        this.qt = null;
        this.host = null;
        this.shadowRoot = null;
        this.container.disposeResolvers();
    }
    accept(t) {
        if (true === t(this)) return true;
        if (this.Ut.hasAccept && true === this.qt.accept(t)) return true;
        if (null !== this.children) {
            const {children: e} = this;
            for (let i = 0, s = e.length; i < s; ++i) if (true === e[i].accept(t)) return true;
        }
    }
}

function ji(t) {
    let e = t.$observers;
    if (void 0 === e) Reflect.defineProperty(t, "$observers", {
        enumerable: false,
        value: e = {}
    });
    return e;
}

function Hi(t, e, i) {
    const s = e.bindables;
    const n = yt(s);
    const r = n.length;
    if (r > 0) {
        let e;
        let o;
        let l = 0;
        const h = ji(i);
        const a = t.container;
        const c = a.has(O, true) ? a.get(O) : null;
        for (;l < r; ++l) {
            e = n[l];
            if (void 0 === h[e]) {
                o = s[e];
                h[e] = new BindableObserver(i, e, o.callback, o.set, t, c);
            }
        }
    }
}

const Wi = new Map;

const zi = t => {
    let e = Wi.get(t);
    if (null == e) {
        e = new V(t, 0);
        Wi.set(t, e);
    }
    return e;
};

function Gi(t, e, i, s) {
    const n = e.get(M);
    const r = e.get(D);
    const o = i.watches;
    const l = 0 === t.vmKind ? t.scope : F.create(s, null, true);
    const h = o.length;
    let a;
    let c;
    let u;
    let f = 0;
    for (;h > f; ++f) {
        ({expression: a, callback: c} = o[f]);
        c = Rt(c) ? c : Reflect.get(s, c);
        if (!Rt(c)) throw vt(`AUR0506:${mt(c)}`);
        if (Rt(a)) t.addBinding(new ComputedWatcher(s, n, a, c, true)); else {
            u = It(a) ? r.parse(a, 16) : zi(a);
            t.addBinding(new ExpressionWatcher(l, e, n, u, c));
        }
    }
}

function Xi(t) {
    return t instanceof Controller && 0 === t.vmKind;
}

function Ki(t) {
    return R(t) && Gs(t.constructor);
}

class HooksDefinition {
    constructor(t) {
        this.hasDefine = "define" in t;
        this.hasHydrating = "hydrating" in t;
        this.hasHydrated = "hydrated" in t;
        this.hasCreated = "created" in t;
        this.hasBinding = "binding" in t;
        this.hasBound = "bound" in t;
        this.hasAttaching = "attaching" in t;
        this.hasAttached = "attached" in t;
        this.hasDetaching = "detaching" in t;
        this.hasUnbinding = "unbinding" in t;
        this.hasDispose = "dispose" in t;
        this.hasAccept = "accept" in t;
    }
}

HooksDefinition.none = new HooksDefinition({});

const Qi = {
    mode: "open"
};

var Yi;

(function(t) {
    t[t["customElement"] = 0] = "customElement";
    t[t["customAttribute"] = 1] = "customAttribute";
    t[t["synthetic"] = 2] = "synthetic";
})(Yi || (Yi = {}));

var Zi;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["activating"] = 1] = "activating";
    t[t["activated"] = 2] = "activated";
    t[t["deactivating"] = 4] = "deactivating";
    t[t["deactivated"] = 8] = "deactivated";
    t[t["released"] = 16] = "released";
    t[t["disposed"] = 32] = "disposed";
})(Zi || (Zi = {}));

function Ji(t) {
    const e = [];
    if (1 === (1 & t)) e.push("activating");
    if (2 === (2 & t)) e.push("activated");
    if (4 === (4 & t)) e.push("deactivating");
    if (8 === (8 & t)) e.push("deactivated");
    if (16 === (16 & t)) e.push("released");
    if (32 === (32 & t)) e.push("disposed");
    return 0 === e.length ? "none" : e.join("|");
}

const ts = Ht("IController");

const es = Ht("IHydrationContext");

class HydrationContext {
    constructor(t, e, i) {
        this.instruction = e;
        this.parent = i;
        this.controller = t;
    }
}

function is(t) {
    t.dispose();
}

function ss(t) {
    t.instance.created(this.qt, this);
}

function ns(t) {
    t.instance.hydrating(this.qt, this);
}

function rs(t) {
    t.instance.hydrated(this.qt, this);
}

function os(t) {
    return t.instance.binding(this.qt, this["$initiator"], this.parent);
}

function ls(t) {
    return t.instance.bound(this.qt, this["$initiator"], this.parent);
}

function hs(t) {
    return t.instance.attaching(this.qt, this["$initiator"], this.parent);
}

function as(t) {
    return t.instance.attached(this.qt, this["$initiator"]);
}

function cs(t) {
    return t.instance.detaching(this.qt, this["$initiator"], this.parent);
}

function us(t) {
    return t.instance.unbinding(this.qt, this["$initiator"], this.parent);
}

let fs;

let ds;

let ms;

const gs = Ht("IAppRoot");

class AppRoot {
    constructor(t, e, i, s) {
        this.config = t;
        this.platform = e;
        this.container = i;
        this.controller = void 0;
        this.ee = void 0;
        this.host = t.host;
        s.prepare(this);
        Kt(i, e.HTMLElement, Kt(i, e.Element, Kt(i, xs, new d("ElementResolver", t.host))));
        this.ee = g(this.ie("creating"), (() => {
            const e = t.component;
            const s = i.createChild();
            let n;
            if (Gs(e)) n = this.container.get(e); else n = t.component;
            const r = {
                hydrate: false,
                projections: null
            };
            const o = this.controller = Controller.$el(s, n, this.host, r);
            o.hE(r, null);
            return g(this.ie("hydrating"), (() => {
                o.hS(null);
                return g(this.ie("hydrated"), (() => {
                    o.hC();
                    this.ee = void 0;
                }));
            }));
        }));
    }
    activate() {
        return g(this.ee, (() => g(this.ie("activating"), (() => g(this.controller.activate(this.controller, null, void 0), (() => this.ie("activated")))))));
    }
    deactivate() {
        return g(this.ie("deactivating"), (() => g(this.controller.deactivate(this.controller, null), (() => this.ie("deactivated")))));
    }
    ie(t) {
        return m(...this.container.getAll(Je).reduce(((e, i) => {
            if (i.slot === t) e.push(i.run());
            return e;
        }), []));
    }
    dispose() {
        this.controller?.dispose();
    }
}

class Refs {}

function ps(t, e) {
    return t.$au?.[e] ?? null;
}

function vs(t, e, i) {
    var s;
    ((s = t).$au ?? (s.$au = new Refs))[e] = i;
}

const xs = Ht("INode");

const ws = Ht("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(gs, true)) return t.get(gs).host;
    return t.get(pi).document;
}))));

const bs = Ht("IRenderLocation");

const ys = Ht("CssModules");

const ks = new WeakMap;

function As(t) {
    if (ks.has(t)) return ks.get(t);
    let e = 0;
    let i = t.nextSibling;
    while (null !== i) {
        if (8 === i.nodeType) switch (i.textContent) {
          case "au-start":
            ++e;
            break;

          case "au-end":
            if (0 === e--) return i;
        }
        i = i.nextSibling;
    }
    if (null === t.parentNode && 11 === t.nodeType) {
        const e = Xs(t);
        if (void 0 === e) return null;
        if (2 === e.mountTarget) return As(e.host);
    }
    return t.parentNode;
}

function Cs(t, e) {
    if (void 0 !== t.platform && !(t instanceof t.platform.Node)) {
        const i = t.childNodes;
        for (let t = 0, s = i.length; t < s; ++t) ks.set(i[t], e);
    } else ks.set(t, e);
}

function Bs(t) {
    if (Ss(t)) return t;
    const e = t.ownerDocument.createComment("au-end");
    const i = e.$start = t.ownerDocument.createComment("au-start");
    const s = t.parentNode;
    if (null !== s) {
        s.replaceChild(e, t);
        s.insertBefore(i, e);
    }
    return e;
}

function Ss(t) {
    return "au-end" === t.textContent;
}

class FragmentNodeSequence {
    get firstChild() {
        return this.se;
    }
    get lastChild() {
        return this.ne;
    }
    constructor(t, e) {
        this.platform = t;
        this.next = void 0;
        this.re = false;
        this.oe = false;
        this.ref = null;
        this.f = e;
        const i = e.querySelectorAll(".au");
        let s = 0;
        let n = i.length;
        let r;
        let o = this.t = Array(n);
        while (n > s) {
            r = i[s];
            if ("AU-M" === r.nodeName) o[s] = Ce(r); else o[s] = r;
            ++s;
        }
        const l = e.childNodes;
        const h = this.childNodes = Array(n = l.length);
        s = 0;
        while (n > s) {
            h[s] = l[s];
            ++s;
        }
        this.se = e.firstChild;
        this.ne = e.lastChild;
    }
    findTargets() {
        return this.t;
    }
    insertBefore(t) {
        if (this.oe && !!this.ref) this.addToLinked(); else {
            const e = t.parentNode;
            if (this.re) {
                let i = this.se;
                let s;
                const n = this.ne;
                while (null != i) {
                    s = i.nextSibling;
                    e.insertBefore(i, t);
                    if (i === n) break;
                    i = s;
                }
            } else {
                this.re = true;
                t.parentNode.insertBefore(this.f, t);
            }
        }
    }
    appendTo(t, e = false) {
        if (this.re) {
            let e = this.se;
            let i;
            const s = this.ne;
            while (null != e) {
                i = e.nextSibling;
                t.appendChild(e);
                if (e === s) break;
                e = i;
            }
        } else {
            this.re = true;
            if (!e) t.appendChild(this.f);
        }
    }
    remove() {
        if (this.re) {
            this.re = false;
            const t = this.f;
            const e = this.ne;
            let i;
            let s = this.se;
            while (null !== s) {
                i = s.nextSibling;
                t.appendChild(s);
                if (s === e) break;
                s = i;
            }
        }
    }
    addToLinked() {
        const t = this.ref;
        const e = t.parentNode;
        if (this.re) {
            let i = this.se;
            let s;
            const n = this.ne;
            while (null != i) {
                s = i.nextSibling;
                e.insertBefore(i, t);
                if (i === n) break;
                i = s;
            }
        } else {
            this.re = true;
            e.insertBefore(this.f, t);
        }
    }
    unlink() {
        this.oe = false;
        this.next = void 0;
        this.ref = void 0;
    }
    link(t) {
        this.oe = true;
        if (Ss(t)) this.ref = t; else {
            this.next = t;
            this.le();
        }
    }
    le() {
        if (void 0 !== this.next) this.ref = this.next.firstChild; else this.ref = void 0;
    }
}

const Rs = Ht("IWindow", (t => t.callback((t => t.get(pi).window))));

const Is = Ht("ILocation", (t => t.callback((t => t.get(Rs).location))));

const Ts = Ht("IHistory", (t => t.callback((t => t.get(Rs).history))));

function Ls(t) {
    return function(e) {
        return zs(t, e);
    };
}

function Es(t) {
    if (void 0 === t) return function(t) {
        Ws(t, "shadowOptions", {
            mode: "open"
        });
    };
    if (!Rt(t)) return function(e) {
        Ws(e, "shadowOptions", t);
    };
    Ws(t, "shadowOptions", {
        mode: "open"
    });
}

function Ps(t) {
    if (void 0 === t) return function(t) {
        _s(t);
    };
    _s(t);
}

function _s(t) {
    const e = st(Ns, t);
    if (void 0 === e) {
        Ws(t, "containerless", true);
        return;
    }
    e.containerless = true;
}

function $s(t) {
    if (void 0 === t) return function(t) {
        Ws(t, "isStrictBinding", true);
    };
    Ws(t, "isStrictBinding", true);
}

const Us = new WeakMap;

class CustomElementDefinition {
    get type() {
        return 1;
    }
    constructor(t, e, i, s, n, r, o, l, h, a, c, u, f, d, m, g, p, v, x, w) {
        this.Type = t;
        this.name = e;
        this.aliases = i;
        this.key = s;
        this.cache = n;
        this.capture = r;
        this.template = o;
        this.instructions = l;
        this.dependencies = h;
        this.injectable = a;
        this.needsCompile = c;
        this.surrogates = u;
        this.bindables = f;
        this.containerless = d;
        this.isStrictBinding = m;
        this.shadowOptions = g;
        this.hasSlots = p;
        this.enhance = v;
        this.watches = x;
        this.processContent = w;
    }
    static create(t, e = null) {
        if (null === e) {
            const i = t;
            if (It(i)) throw vt(`AUR0761:${t}`);
            const s = p("name", i, Hs);
            if (Rt(i.Type)) e = i.Type; else e = Zs(v(s));
            return new CustomElementDefinition(e, s, a(i.aliases), p("key", i, (() => js(s))), p("cache", i, Ds), p("capture", i, Fs), p("template", i, Ms), a(i.instructions), a(i.dependencies), p("injectable", i, Ms), p("needsCompile", i, Os), a(i.surrogates), Dt.from(e, i.bindables), p("containerless", i, Fs), p("isStrictBinding", i, Fs), p("shadowOptions", i, Ms), p("hasSlots", i, Fs), p("enhance", i, Fs), p("watches", i, Vs), x("processContent", e, Ms));
        }
        if (It(t)) return new CustomElementDefinition(e, t, a(Ks(e, "aliases"), e.aliases), js(t), x("cache", e, Ds), x("capture", e, Fs), x("template", e, Ms), a(Ks(e, "instructions"), e.instructions), a(Ks(e, "dependencies"), e.dependencies), x("injectable", e, Ms), x("needsCompile", e, Os), a(Ks(e, "surrogates"), e.surrogates), Dt.from(e, ...Dt.getAll(e), Ks(e, "bindables"), e.bindables), x("containerless", e, Fs), x("isStrictBinding", e, Fs), x("shadowOptions", e, Ms), x("hasSlots", e, Fs), x("enhance", e, Fs), a(ri.getAnnotation(e), e.watches), x("processContent", e, Ms));
        const i = p("name", t, Hs);
        return new CustomElementDefinition(e, i, a(Ks(e, "aliases"), t.aliases, e.aliases), js(i), w("cache", t, e, Ds), w("capture", t, e, Fs), w("template", t, e, Ms), a(Ks(e, "instructions"), t.instructions, e.instructions), a(Ks(e, "dependencies"), t.dependencies, e.dependencies), w("injectable", t, e, Ms), w("needsCompile", t, e, Os), a(Ks(e, "surrogates"), t.surrogates, e.surrogates), Dt.from(e, ...Dt.getAll(e), Ks(e, "bindables"), e.bindables, t.bindables), w("containerless", t, e, Fs), w("isStrictBinding", t, e, Fs), w("shadowOptions", t, e, Ms), w("hasSlots", t, e, Fs), w("enhance", t, e, Fs), a(t.watches, ri.getAnnotation(e), e.watches), w("processContent", t, e, Ms));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) return t;
        if (Us.has(t)) return Us.get(t);
        const e = CustomElementDefinition.create(t);
        Us.set(t, e);
        rt(Ns, e, e.Type);
        return e;
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        if (!t.has(i, false)) {
            Xt(i, e).register(t);
            zt(i, e).register(t);
            Yt(s, Js, i, t);
        }
    }
}

const qs = {
    name: void 0,
    searchParents: false,
    optional: false
};

const Ds = () => 0;

const Ms = () => null;

const Fs = () => false;

const Os = () => true;

const Vs = () => l;

const Ns = at("custom-element");

const js = t => `${Ns}:${t}`;

const Hs = (() => {
    let t = 0;
    return () => `unnamed-${++t}`;
})();

const Ws = (t, e, i) => {
    rt(ht(e), i, t);
};

const zs = (t, e) => {
    const i = CustomElementDefinition.create(t, e);
    rt(Ns, i, i.Type);
    rt(Ns, i, i);
    ct(i.Type, Ns);
    return i.Type;
};

const Gs = t => Rt(t) && nt(Ns, t);

const Xs = (t, e = qs) => {
    if (void 0 === e.name && true !== e.searchParents) {
        const i = ps(t, Ns);
        if (null === i) {
            if (true === e.optional) return null;
            throw vt(`AUR0762`);
        }
        return i;
    }
    if (void 0 !== e.name) {
        if (true !== e.searchParents) {
            const i = ps(t, Ns);
            if (null === i) throw vt(`AUR0763`);
            if (i.is(e.name)) return i;
            return;
        }
        let i = t;
        let s = false;
        while (null !== i) {
            const t = ps(i, Ns);
            if (null !== t) {
                s = true;
                if (t.is(e.name)) return t;
            }
            i = As(i);
        }
        if (s) return;
        throw vt(`AUR0764`);
    }
    let i = t;
    while (null !== i) {
        const t = ps(i, Ns);
        if (null !== t) return t;
        i = As(i);
    }
    throw vt(`AUR0765`);
};

const Ks = (t, e) => st(ht(e), t);

const Qs = t => {
    const e = st(Ns, t);
    if (void 0 === e) throw vt(`AUR0760:${t.name}`);
    return e;
};

const Ys = () => {
    const t = function(e, i, s) {
        const n = r.getOrCreateAnnotationParamTypes(e);
        n[s] = t;
        return e;
    };
    t.register = function(e) {
        return {
            resolve(e, i) {
                if (i.has(t, true)) return i.get(t); else return null;
            }
        };
    };
    return t;
};

const Zs = function() {
    const t = {
        value: "",
        writable: false,
        enumerable: false,
        configurable: true
    };
    const e = {};
    return function(i, s = e) {
        const n = class {};
        t.value = i;
        Reflect.defineProperty(n, "name", t);
        if (s !== e) bt(n.prototype, s);
        return n;
    };
}();

const Js = wt({
    name: Ns,
    keyFrom: js,
    isType: Gs,
    for: Xs,
    define: zs,
    getDefinition: Qs,
    annotate: Ws,
    getAnnotation: Ks,
    generateName: Hs,
    createInjectable: Ys,
    generateType: Zs
});

const tn = ht("processContent");

function en(t) {
    return void 0 === t ? function(t, e, i) {
        rt(tn, sn(t, e), t);
    } : function(e) {
        t = sn(e, t);
        const i = st(Ns, e);
        if (void 0 !== i) i.processContent = t; else rt(tn, t, e);
        return e;
    };
}

function sn(t, e) {
    if (It(e)) e = t[e];
    if (!Rt(e)) throw vt(`AUR0766:${typeof e}`);
    return e;
}

function nn(t) {
    return function(e) {
        const i = Rt(t) ? t : true;
        Ws(e, "capture", i);
        if (Gs(e)) Qs(e).capture = i;
    };
}

const rn = Ht("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

const on = Ht("IAuSlotWatcher");

class AuSlotWatcherBinding {
    static create(t, e, i, s, n) {
        const r = t.viewModel;
        const o = new AuSlotWatcherBinding(r, i, s, n);
        Pt(r, e, {
            enumerable: true,
            configurable: true,
            get: bt((() => o.getValue()), {
                getObserver: () => o
            }),
            set: () => {}
        });
        return o;
    }
    constructor(t, e, i, s) {
        this.he = new Set;
        this.ae = l;
        this.isBound = false;
        this.cb = (this.o = t)[e];
        this.slotName = i;
        this.ce = s;
    }
    bind() {
        this.isBound = true;
    }
    unbind() {
        this.isBound = false;
    }
    getValue() {
        return this.ae;
    }
    watch(t) {
        if (!this.he.has(t)) {
            this.he.add(t);
            t.subscribe(this);
        }
    }
    unwatch(t) {
        if (this.he.delete(t)) t.unsubscribe(this);
    }
    handleSlotChange(t, e) {
        if (!this.isBound) return;
        const i = this.ae;
        const s = [];
        let n;
        let r;
        for (n of this.he) for (r of n === t ? e : n.nodes) if ("*" === this.ce || 1 === r.nodeType && r.matches(this.ce)) s[s.length] = r;
        if (s.length !== i.length || s.some(((t, e) => t !== i[e]))) {
            this.ae = s;
            this.cb?.call(this.o, s);
            this.subs.notify(s, i);
        }
    }
    get() {
        throw new Error("not implemented");
    }
    useScope(t) {}
    limit(t) {
        throw new Error("not implemented");
    }
}

I(AuSlotWatcherBinding);

class SlottedLifecycleHooks {
    constructor(t) {
        this.def = t;
    }
    register(t) {
        Gt(_i, this).register(t);
    }
    hydrating(t, e) {
        const i = this.def;
        const s = AuSlotWatcherBinding.create(e, i.name, i.callback ?? `${mt(i.name)}Changed`, i.slotName ?? "default", i.query ?? "*");
        Gt(on, s).register(e.container);
        e.addBinding(s);
    }
}

Di()(SlottedLifecycleHooks);

function ln(t, e) {
    const i = "dependencies";
    function s(s, n, r) {
        const o = "object" === typeof t ? t : {
            query: t,
            slotName: e,
            name: ""
        };
        o.name = n;
        if ("function" === typeof s || "undefined" !== typeof r?.value) throw new Error(`Invalid usage. @slotted can only be used on a field`);
        const l = s.constructor;
        let h = Js.getAnnotation(l, i);
        if (null == h) Js.annotate(l, i, h = []);
        h.push(new SlottedLifecycleHooks(o));
    }
    return s;
}

var hn;

(function(t) {
    t["hydrateElement"] = "ra";
    t["hydrateAttribute"] = "rb";
    t["hydrateTemplateController"] = "rc";
    t["hydrateLetElement"] = "rd";
    t["setProperty"] = "re";
    t["interpolation"] = "rf";
    t["propertyBinding"] = "rg";
    t["letBinding"] = "ri";
    t["refBinding"] = "rj";
    t["iteratorBinding"] = "rk";
    t["multiAttr"] = "rl";
    t["textBinding"] = "ha";
    t["listenerBinding"] = "hb";
    t["attributeBinding"] = "hc";
    t["stylePropertyBinding"] = "hd";
    t["setAttribute"] = "he";
    t["setClassAttribute"] = "hf";
    t["setStyleAttribute"] = "hg";
    t["spreadBinding"] = "hs";
    t["spreadElementProp"] = "hp";
})(hn || (hn = {}));

const an = Ht("Instruction");

function cn(t) {
    const e = t.type;
    return It(e) && 2 === e.length;
}

class InterpolationInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = "rf";
    }
}

class PropertyBindingInstruction {
    constructor(t, e, i) {
        this.from = t;
        this.to = e;
        this.mode = i;
        this.type = "rg";
    }
}

class IteratorBindingInstruction {
    constructor(t, e, i) {
        this.forOf = t;
        this.to = e;
        this.props = i;
        this.type = "rk";
    }
}

class RefBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = "rj";
    }
}

class SetPropertyInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = "re";
    }
}

class MultiAttrInstruction {
    constructor(t, e, i) {
        this.value = t;
        this.to = e;
        this.command = i;
        this.type = "rl";
    }
}

class HydrateElementInstruction {
    constructor(t, e, i, s, n, r) {
        this.res = t;
        this.alias = e;
        this.props = i;
        this.projections = s;
        this.containerless = n;
        this.captures = r;
        this.type = "ra";
        this.auSlot = null;
    }
}

class HydrateAttributeInstruction {
    constructor(t, e, i) {
        this.res = t;
        this.alias = e;
        this.props = i;
        this.type = "rb";
    }
}

class HydrateTemplateController {
    constructor(t, e, i, s) {
        this.def = t;
        this.res = e;
        this.alias = i;
        this.props = s;
        this.type = "rc";
    }
}

class HydrateLetElementInstruction {
    constructor(t, e) {
        this.instructions = t;
        this.toBindingContext = e;
        this.type = "rd";
    }
}

class LetBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = "ri";
    }
}

class TextBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.strict = e;
        this.type = "ha";
    }
}

class ListenerBindingInstruction {
    constructor(t, e, i, s) {
        this.from = t;
        this.to = e;
        this.preventDefault = i;
        this.capture = s;
        this.type = "hb";
    }
}

class StylePropertyBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = "hd";
    }
}

class SetAttributeInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = "he";
    }
}

class SetClassAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = "hf";
    }
}

class SetStyleAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = "hg";
    }
}

class AttributeBindingInstruction {
    constructor(t, e, i) {
        this.attr = t;
        this.from = e;
        this.to = i;
        this.type = "hc";
    }
}

class SpreadBindingInstruction {
    constructor() {
        this.type = "hs";
    }
}

class SpreadElementPropBindingInstruction {
    constructor(t) {
        this.instructions = t;
        this.type = "hp";
    }
}

const un = Ht("ITemplateCompiler");

const fn = Ht("IRenderer");

function dn(t) {
    return function e(i) {
        i.register = function(t) {
            Wt(fn, this).register(t);
        };
        Tt(i.prototype, "target", {
            configurable: true,
            get: function() {
                return t;
            }
        });
        return i;
    };
}

function mn(t, e, i) {
    if (It(e)) return t.parse(e, i);
    return e;
}

function gn(t) {
    if (null != t.viewModel) return t.viewModel;
    return t;
}

function pn(t, e) {
    if ("element" === e) return t;
    switch (e) {
      case "controller":
        return Xs(t);

      case "view":
        throw vt(`AUR0750`);

      case "view-model":
        return Xs(t).viewModel;

      default:
        {
            const i = fi(t, e);
            if (void 0 !== i) return i.viewModel;
            const s = Xs(t, {
                name: e
            });
            if (void 0 === s) throw vt(`AUR0751:${e}`);
            return s.viewModel;
        }
    }
}

let vn = class SetPropertyRenderer {
    render(t, e, i) {
        const s = gn(e);
        if (void 0 !== s.$observers?.[i.to]) s.$observers[i.to].setValue(i.value); else s[i.to] = i.value;
    }
};

vn = et([ dn("re") ], vn);

let xn = class CustomElementRenderer {
    static get inject() {
        return [ Fi ];
    }
    constructor(t) {
        this.r = t;
    }
    render(t, e, i, s, n, r) {
        let o;
        let l;
        let h;
        let a;
        const c = i.res;
        const u = i.projections;
        const f = t.container;
        switch (typeof c) {
          case "string":
            o = f.find(Js, c);
            if (null == o) throw vt(`AUR0752:${c}@${t["name"]}`);
            break;

          default:
            o = c;
        }
        const m = i.containerless || o.containerless;
        const g = m ? Bs(e) : null;
        const p = On(s, t, e, i, g, null == u ? void 0 : new AuSlotsInfo(kt(u)));
        l = o.Type;
        h = p.invoke(l);
        Kt(p, l, new d(o.key, h));
        a = Controller.$el(p, h, e, i, o, g);
        vs(e, o.key, a);
        const v = this.r.renderers;
        const x = i.props;
        const w = x.length;
        let b = 0;
        let y;
        while (w > b) {
            y = x[b];
            v[y.type].render(t, a, y, s, n, r);
            ++b;
        }
        t.addChild(a);
    }
};

xn = et([ dn("ra") ], xn);

let wn = class CustomAttributeRenderer {
    static get inject() {
        return [ Fi ];
    }
    constructor(t) {
        this.r = t;
    }
    render(t, e, i, s, n, r) {
        let o = t.container;
        let l;
        switch (typeof i.res) {
          case "string":
            l = o.find(gi, i.res);
            if (null == l) throw vt(`AUR0753:${i.res}@${t["name"]}`);
            break;

          default:
            l = i.res;
        }
        const h = Vn(s, l, t, e, i, void 0, void 0);
        const a = Controller.$attr(h.ctn, h.vm, e, l);
        vs(e, l.key, a);
        const c = this.r.renderers;
        const u = i.props;
        const f = u.length;
        let d = 0;
        let m;
        while (f > d) {
            m = u[d];
            c[m.type].render(t, a, m, s, n, r);
            ++d;
        }
        t.addChild(a);
    }
};

wn = et([ dn("rb") ], wn);

let bn = class TemplateControllerRenderer {
    static get inject() {
        return [ Fi, pi ];
    }
    constructor(t, e) {
        this.r = t;
        this.p = e;
    }
    render(t, e, i, s, n, r) {
        let o = t.container;
        let l;
        switch (typeof i.res) {
          case "string":
            l = o.find(gi, i.res);
            if (null == l) throw vt(`AUR0754:${i.res}@${t["name"]}`);
            break;

          default:
            l = i.res;
        }
        const h = this.r.getViewFactory(i.def, o);
        const a = Bs(e);
        const c = Vn(this.p, l, t, e, i, h, a);
        const u = Controller.$attr(c.ctn, c.vm, e, l);
        vs(a, l.key, u);
        c.vm.link?.(t, u, e, i);
        const f = this.r.renderers;
        const d = i.props;
        const m = d.length;
        let g = 0;
        let p;
        while (m > g) {
            p = d[g];
            f[p.type].render(t, u, p, s, n, r);
            ++g;
        }
        t.addChild(u);
    }
};

bn = et([ dn("rc") ], bn);

let yn = class LetElementRenderer {
    render(t, e, i, s, n, r) {
        e.remove();
        const o = i.instructions;
        const l = i.toBindingContext;
        const h = t.container;
        const a = o.length;
        let c;
        let u;
        let f = 0;
        while (a > f) {
            c = o[f];
            u = mn(n, c.from, 16);
            t.addBinding(new LetBinding(h, r, u, c.to, l));
            ++f;
        }
    }
};

yn = et([ dn("rd") ], yn);

let kn = class RefBindingRenderer {
    render(t, e, i, s, n) {
        t.addBinding(new RefBinding(t.container, mn(n, i.from, 16), pn(e, i.to)));
    }
};

kn = et([ dn("rj") ], kn);

let An = class InterpolationBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new InterpolationBinding(t, t.container, r, s.domWriteQueue, mn(n, i.from, 1), gn(e), i.to, 2));
    }
};

An = et([ dn("rf") ], An);

let Cn = class PropertyBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, mn(n, i.from, 16), gn(e), i.to, i.mode));
    }
};

Cn = et([ dn("rg") ], Cn);

let Bn = class IteratorBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, mn(n, i.forOf, 2), gn(e), i.to, 2));
    }
};

Bn = et([ dn("rk") ], Bn);

let Sn = class TextBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, s.domWriteQueue, s, mn(n, i.from, 16), we(e.parentNode, xe(s, ""), e), i.strict));
    }
};

Sn = et([ dn("ha") ], Sn);

let Rn = class ListenerBindingRenderer {
    render(t, e, i, s, n) {
        t.addBinding(new ListenerBinding(t.container, mn(n, i.from, 8), e, i.to, new ListenerBindingOptions(i.preventDefault, i.capture)));
    }
};

Rn = et([ dn("hb") ], Rn);

let In = class SetAttributeRenderer {
    render(t, e, i) {
        e.setAttribute(i.to, i.value);
    }
};

In = et([ dn("he") ], In);

let Tn = class SetClassAttributeRenderer {
    render(t, e, i) {
        $n(e.classList, i.value);
    }
};

Tn = et([ dn("hf") ], Tn);

let Ln = class SetStyleAttributeRenderer {
    render(t, e, i) {
        e.style.cssText += i.value;
    }
};

Ln = et([ dn("hg") ], Ln);

let En = class StylePropertyBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, mn(n, i.from, 16), e.style, i.to, 2));
    }
};

En = et([ dn("hd") ], En);

let Pn = class AttributeBindingRenderer {
    render(t, e, i, s, n, r) {
        const o = t.container;
        const l = o.has(ys, false) ? o.get(ys) : null;
        t.addBinding(new AttributeBinding(t, o, r, s.domWriteQueue, mn(n, i.from, 16), e, i.attr, null == l ? i.to : i.to.split(/\s/g).map((t => l[t] ?? t)).join(" "), 2));
    }
};

Pn = et([ dn("hc") ], Pn);

let _n = class SpreadRenderer {
    static get inject() {
        return [ un, Fi ];
    }
    constructor(t, e) {
        this.ue = t;
        this.r = e;
    }
    render(t, e, i, s, n, r) {
        const o = t.container;
        const h = o.get(es);
        const a = this.r.renderers;
        const c = t => {
            let e = t;
            let i = h;
            while (null != i && e > 0) {
                i = i.parent;
                --e;
            }
            if (null == i) throw vt("No scope context for spread binding.");
            return i;
        };
        const u = i => {
            const o = c(i);
            const h = Un(o);
            const f = this.ue.compileSpread(o.controller.definition, o.instruction?.captures ?? l, o.controller.container, e);
            let d;
            for (d of f) switch (d.type) {
              case "hs":
                u(i + 1);
                break;

              case "hp":
                a[d.instructions.type].render(h, Xs(e), d.instructions, s, n, r);
                break;

              default:
                a[d.type].render(h, e, d, s, n, r);
            }
            t.addBinding(h);
        };
        u(0);
    }
};

_n = et([ dn("hs") ], _n);

class SpreadBinding {
    get container() {
        return this.locator;
    }
    get definition() {
        return this.ctrl.definition;
    }
    get isStrictBinding() {
        return this.ctrl.isStrictBinding;
    }
    get state() {
        return this.ctrl.state;
    }
    constructor(t, e) {
        this.fe = t;
        this.de = e;
        this.isBound = false;
        this.ctrl = e.controller;
        this.locator = this.ctrl.container;
    }
    get(t) {
        return this.locator.get(t);
    }
    bind(t) {
        if (this.isBound) return;
        this.isBound = true;
        const e = this.scope = this.de.controller.scope.parent ?? void 0;
        if (null == e) throw vt("Invalid spreading. Context scope is null/undefined");
        this.fe.forEach((t => t.bind(e)));
    }
    unbind() {
        this.fe.forEach((t => t.unbind()));
        this.isBound = false;
    }
    addBinding(t) {
        this.fe.push(t);
    }
    addChild(t) {
        if (1 !== t.vmKind) throw vt("Spread binding does not support spreading custom attributes/template controllers");
        this.ctrl.addChild(t);
    }
    limit() {
        throw vt("not implemented");
    }
    useScope() {
        throw vt("not implemented");
    }
}

function $n(t, e) {
    const i = e.length;
    let s = 0;
    for (let n = 0; n < i; ++n) if (32 === e.charCodeAt(n)) {
        if (n !== s) t.add(e.slice(s, n));
        s = n + 1;
    } else if (n + 1 === i) t.add(e.slice(s));
}

const Un = t => new SpreadBinding([], t);

const qn = "IController";

const Dn = "IInstruction";

const Mn = "IRenderLocation";

const Fn = "ISlotsInfo";

function On(t, e, i, s, n, r) {
    const o = e.container.createChild();
    Kt(o, t.HTMLElement, Kt(o, t.Element, Kt(o, xs, new d("ElementResolver", i))));
    Kt(o, ts, new d(qn, e));
    Kt(o, an, new d(Dn, s));
    Kt(o, bs, null == n ? Nn : new RenderLocationProvider(n));
    Kt(o, Mi, jn);
    Kt(o, rn, null == r ? Hn : new d(Fn, r));
    return o;
}

class ViewFactoryProvider {
    get $isResolver() {
        return true;
    }
    constructor(t) {
        this.f = t;
    }
    resolve() {
        const t = this.f;
        if (null === t) throw vt(`AUR7055`);
        if (!It(t.name) || 0 === t.name.length) throw vt(`AUR0756`);
        return t;
    }
}

function Vn(t, e, i, s, n, r, o, l) {
    const h = i.container.createChild();
    Kt(h, t.HTMLElement, Kt(h, t.Element, Kt(h, xs, new d("ElementResolver", s))));
    i = i instanceof Controller ? i : i.ctrl;
    Kt(h, ts, new d(qn, i));
    Kt(h, an, new d(Dn, n));
    Kt(h, bs, null == o ? Nn : new d(Mn, o));
    Kt(h, Mi, null == r ? jn : new ViewFactoryProvider(r));
    Kt(h, rn, null == l ? Hn : new d(Fn, l));
    return {
        vm: h.invoke(e.Type),
        ctn: h
    };
}

class RenderLocationProvider {
    get name() {
        return "IRenderLocation";
    }
    get $isResolver() {
        return true;
    }
    constructor(t) {
        this.l = t;
    }
    resolve() {
        return this.l;
    }
}

const Nn = new RenderLocationProvider(null);

const jn = new ViewFactoryProvider(null);

const Hn = new d(Fn, new AuSlotsInfo(l));

var Wn;

(function(t) {
    t[t["None"] = 0] = "None";
    t[t["IgnoreAttr"] = 1] = "IgnoreAttr";
})(Wn || (Wn = {}));

function zn(t) {
    return function(e) {
        return Qn.define(t, e);
    };
}

class BindingCommandDefinition {
    constructor(t, e, i, s, n) {
        this.Type = t;
        this.name = e;
        this.aliases = i;
        this.key = s;
        this.type = n;
    }
    static create(t, e) {
        let s;
        let n;
        if (It(t)) {
            s = t;
            n = {
                name: s
            };
        } else {
            s = t.name;
            n = t;
        }
        return new BindingCommandDefinition(e, i(Kn(e, "name"), s), a(Kn(e, "aliases"), n.aliases, e.aliases), Xn(s), i(Kn(e, "type"), n.type, e.type, null));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        Wt(i, e).register(t);
        zt(i, e).register(t);
        Yt(s, Qn, i, t);
    }
}

const Gn = at("binding-command");

const Xn = t => `${Gn}:${t}`;

const Kn = (t, e) => st(ht(e), t);

const Qn = wt({
    name: Gn,
    keyFrom: Xn,
    define(t, e) {
        const i = BindingCommandDefinition.create(t, e);
        rt(Gn, i, i.Type);
        rt(Gn, i, i);
        ct(e, Gn);
        return i.Type;
    },
    getAnnotation: Kn
});

let Yn = class OneTimeBindingCommand {
    get type() {
        return 0;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = t.attr.rawValue;
        if (null == t.bindable) n = i.map(t.node, n) ?? b(n); else {
            if ("" === r && 1 === t.def.type) r = b(n);
            n = t.bindable.property;
        }
        return new PropertyBindingInstruction(e.parse(r, 16), n, 1);
    }
};

Yn = et([ zn("one-time") ], Yn);

let Zn = class ToViewBindingCommand {
    get type() {
        return 0;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = t.attr.rawValue;
        if (null == t.bindable) n = i.map(t.node, n) ?? b(n); else {
            if ("" === r && 1 === t.def.type) r = b(n);
            n = t.bindable.property;
        }
        return new PropertyBindingInstruction(e.parse(r, 16), n, 2);
    }
};

Zn = et([ zn("to-view") ], Zn);

let Jn = class FromViewBindingCommand {
    get type() {
        return 0;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = s.rawValue;
        if (null == t.bindable) n = i.map(t.node, n) ?? b(n); else {
            if ("" === r && 1 === t.def.type) r = b(n);
            n = t.bindable.property;
        }
        return new PropertyBindingInstruction(e.parse(r, 16), n, 4);
    }
};

Jn = et([ zn("from-view") ], Jn);

let tr = class TwoWayBindingCommand {
    get type() {
        return 0;
    }
    build(t, e, i) {
        const s = t.attr;
        let n = s.target;
        let r = s.rawValue;
        if (null == t.bindable) n = i.map(t.node, n) ?? b(n); else {
            if ("" === r && 1 === t.def.type) r = b(n);
            n = t.bindable.property;
        }
        return new PropertyBindingInstruction(e.parse(r, 16), n, 6);
    }
};

tr = et([ zn("two-way") ], tr);

let er = class DefaultBindingCommand {
    get type() {
        return 0;
    }
    build(t, e, i) {
        const s = t.attr;
        const n = t.bindable;
        let r;
        let o;
        let l = s.target;
        let h = s.rawValue;
        if (null == n) {
            o = i.isTwoWay(t.node, l) ? 6 : 2;
            l = i.map(t.node, l) ?? b(l);
        } else {
            if ("" === h && 1 === t.def.type) h = b(l);
            r = t.def.defaultBindingMode;
            o = 8 === n.mode || null == n.mode ? null == r || 8 === r ? 2 : r : n.mode;
            l = n.property;
        }
        return new PropertyBindingInstruction(e.parse(h, 16), l, o);
    }
};

er = et([ zn("bind") ], er);

let ir = class ForBindingCommand {
    get type() {
        return 0;
    }
    static get inject() {
        return [ ie ];
    }
    constructor(t) {
        this.me = t;
    }
    build(t, e) {
        const i = null === t.bindable ? b(t.attr.target) : t.bindable.property;
        const s = e.parse(t.attr.rawValue, 2);
        let n = l;
        if (s.semiIdx > -1) {
            const e = t.attr.rawValue.slice(s.semiIdx + 1);
            const i = e.indexOf(":");
            if (i > -1) {
                const t = e.slice(0, i).trim();
                const s = e.slice(i + 1).trim();
                const r = this.me.parse(t, s);
                n = [ new MultiAttrInstruction(s, r.target, r.command) ];
            }
        }
        return new IteratorBindingInstruction(s, i, n);
    }
};

ir = et([ zn("for") ], ir);

let sr = class TriggerBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, 8), t.attr.target, true, false);
    }
};

sr = et([ zn("trigger") ], sr);

let nr = class CaptureBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, 8), t.attr.target, false, true);
    }
};

nr = et([ zn("capture") ], nr);

let rr = class AttrBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction(t.attr.target, e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

rr = et([ zn("attr") ], rr);

let or = class StyleBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction("style", e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

or = et([ zn("style") ], or);

let lr = class ClassBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction("class", e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

lr = et([ zn("class") ], lr);

let hr = class RefBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new RefBindingInstruction(e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

hr = et([ zn("ref") ], hr);

let ar = class SpreadBindingCommand {
    get type() {
        return 1;
    }
    build(t) {
        return new SpreadBindingInstruction;
    }
};

ar = et([ zn("...$attrs") ], ar);

const cr = Ht("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

const ur = t => {
    const e = pt();
    t = It(t) ? t.split(" ") : t;
    let i;
    for (i of t) e[i] = true;
    return e;
};

class NoopSVGAnalyzer {
    isStandardSvgAttribute(t, e) {
        return false;
    }
}

class SVGAnalyzer {
    static register(t) {
        return Wt(cr, this).register(t);
    }
    constructor(t) {
        this.ge = bt(pt(), {
            a: ur("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage target transform xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            altGlyph: ur("class dx dy externalResourcesRequired format glyphRef id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            altglyph: pt(),
            altGlyphDef: ur("id xml:base xml:lang xml:space"),
            altglyphdef: pt(),
            altGlyphItem: ur("id xml:base xml:lang xml:space"),
            altglyphitem: pt(),
            animate: ur("accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            animateColor: ur("accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            animateMotion: ur("accumulate additive begin by calcMode dur end externalResourcesRequired fill from id keyPoints keySplines keyTimes max min onbegin onend onload onrepeat origin path repeatCount repeatDur requiredExtensions requiredFeatures restart rotate systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            animateTransform: ur("accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to type values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            circle: ur("class cx cy externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup r requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            clipPath: ur("class clipPathUnits externalResourcesRequired id requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            "color-profile": ur("id local name rendering-intent xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            cursor: ur("externalResourcesRequired id requiredExtensions requiredFeatures systemLanguage x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            defs: ur("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            desc: ur("class id style xml:base xml:lang xml:space"),
            ellipse: ur("class cx cy externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rx ry style systemLanguage transform xml:base xml:lang xml:space"),
            feBlend: ur("class height id in in2 mode result style width x xml:base xml:lang xml:space y"),
            feColorMatrix: ur("class height id in result style type values width x xml:base xml:lang xml:space y"),
            feComponentTransfer: ur("class height id in result style width x xml:base xml:lang xml:space y"),
            feComposite: ur("class height id in in2 k1 k2 k3 k4 operator result style width x xml:base xml:lang xml:space y"),
            feConvolveMatrix: ur("bias class divisor edgeMode height id in kernelMatrix kernelUnitLength order preserveAlpha result style targetX targetY width x xml:base xml:lang xml:space y"),
            feDiffuseLighting: ur("class diffuseConstant height id in kernelUnitLength result style surfaceScale width x xml:base xml:lang xml:space y"),
            feDisplacementMap: ur("class height id in in2 result scale style width x xChannelSelector xml:base xml:lang xml:space y yChannelSelector"),
            feDistantLight: ur("azimuth elevation id xml:base xml:lang xml:space"),
            feFlood: ur("class height id result style width x xml:base xml:lang xml:space y"),
            feFuncA: ur("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feFuncB: ur("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feFuncG: ur("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feFuncR: ur("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feGaussianBlur: ur("class height id in result stdDeviation style width x xml:base xml:lang xml:space y"),
            feImage: ur("class externalResourcesRequired height id preserveAspectRatio result style width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            feMerge: ur("class height id result style width x xml:base xml:lang xml:space y"),
            feMergeNode: ur("id xml:base xml:lang xml:space"),
            feMorphology: ur("class height id in operator radius result style width x xml:base xml:lang xml:space y"),
            feOffset: ur("class dx dy height id in result style width x xml:base xml:lang xml:space y"),
            fePointLight: ur("id x xml:base xml:lang xml:space y z"),
            feSpecularLighting: ur("class height id in kernelUnitLength result specularConstant specularExponent style surfaceScale width x xml:base xml:lang xml:space y"),
            feSpotLight: ur("id limitingConeAngle pointsAtX pointsAtY pointsAtZ specularExponent x xml:base xml:lang xml:space y z"),
            feTile: ur("class height id in result style width x xml:base xml:lang xml:space y"),
            feTurbulence: ur("baseFrequency class height id numOctaves result seed stitchTiles style type width x xml:base xml:lang xml:space y"),
            filter: ur("class externalResourcesRequired filterRes filterUnits height id primitiveUnits style width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            font: ur("class externalResourcesRequired horiz-adv-x horiz-origin-x horiz-origin-y id style vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space"),
            "font-face": ur("accent-height alphabetic ascent bbox cap-height descent font-family font-size font-stretch font-style font-variant font-weight hanging id ideographic mathematical overline-position overline-thickness panose-1 slope stemh stemv strikethrough-position strikethrough-thickness underline-position underline-thickness unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical widths x-height xml:base xml:lang xml:space"),
            "font-face-format": ur("id string xml:base xml:lang xml:space"),
            "font-face-name": ur("id name xml:base xml:lang xml:space"),
            "font-face-src": ur("id xml:base xml:lang xml:space"),
            "font-face-uri": ur("id xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            foreignObject: ur("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform width x xml:base xml:lang xml:space y"),
            g: ur("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            glyph: ur("arabic-form class d glyph-name horiz-adv-x id lang orientation style unicode vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space"),
            glyphRef: ur("class dx dy format glyphRef id style x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            glyphref: pt(),
            hkern: ur("g1 g2 id k u1 u2 xml:base xml:lang xml:space"),
            image: ur("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage transform width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            line: ur("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform x1 x2 xml:base xml:lang xml:space y1 y2"),
            linearGradient: ur("class externalResourcesRequired gradientTransform gradientUnits id spreadMethod style x1 x2 xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space y1 y2"),
            marker: ur("class externalResourcesRequired id markerHeight markerUnits markerWidth orient preserveAspectRatio refX refY style viewBox xml:base xml:lang xml:space"),
            mask: ur("class externalResourcesRequired height id maskContentUnits maskUnits requiredExtensions requiredFeatures style systemLanguage width x xml:base xml:lang xml:space y"),
            metadata: ur("id xml:base xml:lang xml:space"),
            "missing-glyph": ur("class d horiz-adv-x id style vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space"),
            mpath: ur("externalResourcesRequired id xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            path: ur("class d externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup pathLength requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            pattern: ur("class externalResourcesRequired height id patternContentUnits patternTransform patternUnits preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage viewBox width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            polygon: ur("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup points requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            polyline: ur("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup points requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            radialGradient: ur("class cx cy externalResourcesRequired fx fy gradientTransform gradientUnits id r spreadMethod style xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space"),
            rect: ur("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rx ry style systemLanguage transform width x xml:base xml:lang xml:space y"),
            script: ur("externalResourcesRequired id type xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            set: ur("attributeName attributeType begin dur end externalResourcesRequired fill id max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            stop: ur("class id offset style xml:base xml:lang xml:space"),
            style: ur("id media title type xml:base xml:lang xml:space"),
            svg: ur("baseProfile class contentScriptType contentStyleType externalResourcesRequired height id onabort onactivate onclick onerror onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup onresize onscroll onunload onzoom preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage version viewBox width x xml:base xml:lang xml:space y zoomAndPan"),
            switch: ur("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            symbol: ur("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup preserveAspectRatio style viewBox xml:base xml:lang xml:space"),
            text: ur("class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength transform x xml:base xml:lang xml:space y"),
            textPath: ur("class externalResourcesRequired id lengthAdjust method onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures spacing startOffset style systemLanguage textLength xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space"),
            title: ur("class id style xml:base xml:lang xml:space"),
            tref: ur("class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength x xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space y"),
            tspan: ur("class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength x xml:base xml:lang xml:space y"),
            use: ur("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            view: ur("externalResourcesRequired id preserveAspectRatio viewBox viewTarget xml:base xml:lang xml:space zoomAndPan"),
            vkern: ur("g1 g2 id k u1 u2 xml:base xml:lang xml:space")
        });
        this.pe = ur("a altGlyph animate animateColor circle clipPath defs ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feFlood feGaussianBlur feImage feMerge feMorphology feOffset feSpecularLighting feTile feTurbulence filter font foreignObject g glyph glyphRef image line linearGradient marker mask missing-glyph path pattern polygon polyline radialGradient rect stop svg switch symbol text textPath tref tspan use");
        this.ve = ur("alignment-baseline baseline-shift clip-path clip-rule clip color-interpolation-filters color-interpolation color-profile color-rendering color cursor direction display dominant-baseline enable-background fill-opacity fill-rule fill filter flood-color flood-opacity font-family font-size-adjust font-size font-stretch font-style font-variant font-weight glyph-orientation-horizontal glyph-orientation-vertical image-rendering kerning letter-spacing lighting-color marker-end marker-mid marker-start mask opacity overflow pointer-events shape-rendering stop-color stop-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width stroke text-anchor text-decoration text-rendering unicode-bidi visibility word-spacing writing-mode");
        this.SVGElement = t.globalThis.SVGElement;
        const e = t.document.createElement("div");
        e.innerHTML = "<svg><altGlyph /></svg>";
        if ("altglyph" === e.firstElementChild.nodeName) {
            const t = this.ge;
            let e = t.altGlyph;
            t.altGlyph = t.altglyph;
            t.altglyph = e;
            e = t.altGlyphDef;
            t.altGlyphDef = t.altglyphdef;
            t.altglyphdef = e;
            e = t.altGlyphItem;
            t.altGlyphItem = t.altglyphitem;
            t.altglyphitem = e;
            e = t.glyphRef;
            t.glyphRef = t.glyphref;
            t.glyphref = e;
        }
    }
    isStandardSvgAttribute(t, e) {
        if (!(t instanceof this.SVGElement)) return false;
        return true === this.pe[t.nodeName] && true === this.ve[e] || true === this.ge[t.nodeName]?.[e];
    }
}

SVGAnalyzer.inject = [ pi ];

const fr = Ht("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    static get inject() {
        return [ cr ];
    }
    constructor(t) {
        this.svg = t;
        this.fns = [];
        this.xe = pt();
        this.we = pt();
        this.useMapping({
            LABEL: {
                for: "htmlFor"
            },
            IMG: {
                usemap: "useMap"
            },
            INPUT: {
                maxlength: "maxLength",
                minlength: "minLength",
                formaction: "formAction",
                formenctype: "formEncType",
                formmethod: "formMethod",
                formnovalidate: "formNoValidate",
                formtarget: "formTarget",
                inputmode: "inputMode"
            },
            TEXTAREA: {
                maxlength: "maxLength"
            },
            TD: {
                rowspan: "rowSpan",
                colspan: "colSpan"
            },
            TH: {
                rowspan: "rowSpan",
                colspan: "colSpan"
            }
        });
        this.useGlobalMapping({
            accesskey: "accessKey",
            contenteditable: "contentEditable",
            tabindex: "tabIndex",
            textcontent: "textContent",
            innerhtml: "innerHTML",
            scrolltop: "scrollTop",
            scrollleft: "scrollLeft",
            readonly: "readOnly"
        });
    }
    useMapping(t) {
        var e;
        let i;
        let s;
        let n;
        let r;
        for (n in t) {
            i = t[n];
            s = (e = this.xe)[n] ?? (e[n] = pt());
            for (r in i) {
                if (void 0 !== s[r]) throw mr(r, n);
                s[r] = i[r];
            }
        }
    }
    useGlobalMapping(t) {
        const e = this.we;
        for (const i in t) {
            if (void 0 !== e[i]) throw mr(i, "*");
            e[i] = t[i];
        }
    }
    useTwoWay(t) {
        this.fns.push(t);
    }
    isTwoWay(t, e) {
        return dr(t, e) || this.fns.length > 0 && this.fns.some((i => i(t, e)));
    }
    map(t, e) {
        return this.xe[t.nodeName]?.[e] ?? this.we[e] ?? (Ct(t, e, this.svg) ? e : null);
    }
}

function dr(t, e) {
    switch (t.nodeName) {
      case "INPUT":
        switch (t.type) {
          case "checkbox":
          case "radio":
            return "checked" === e;

          default:
            return "value" === e || "files" === e || "value-as-number" === e || "value-as-date" === e;
        }

      case "TEXTAREA":
      case "SELECT":
        return "value" === e;

      default:
        switch (e) {
          case "textcontent":
          case "innerhtml":
            return t.hasAttribute("contenteditable");

          case "scrolltop":
          case "scrollleft":
            return true;

          default:
            return false;
        }
    }
}

function mr(t, e) {
    return vt(`Attribute ${t} has been already registered for ${"*" === e ? "all elements" : `<${e}/>`}`);
}

const gr = Ht("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const pr = {};

class TemplateElementFactory {
    constructor(t) {
        this.p = t;
        this.be = vr(this.p);
    }
    createTemplate(t) {
        if (It(t)) {
            let e = pr[t];
            if (void 0 === e) {
                const i = this.be;
                i.innerHTML = t;
                const s = i.content.firstElementChild;
                if (null == s || "TEMPLATE" !== s.nodeName || null != s.nextElementSibling) {
                    this.be = vr(this.p);
                    e = i;
                } else {
                    i.content.removeChild(s);
                    e = s;
                }
                pr[t] = e;
            }
            return e.cloneNode(true);
        }
        if ("TEMPLATE" !== t.nodeName) {
            const e = vr(this.p);
            e.content.appendChild(t);
            return e;
        }
        t.parentNode?.removeChild(t);
        return t.cloneNode(true);
    }
}

TemplateElementFactory.inject = [ pi ];

const vr = t => t.document.createElement("template");

class TemplateCompiler {
    constructor() {
        this.debug = false;
        this.resolveResources = true;
    }
    static register(t) {
        return Wt(un, this).register(t);
    }
    compile(t, e, i) {
        const s = CustomElementDefinition.getOrCreate(t);
        if (null === s.template || void 0 === s.template) return s;
        if (false === s.needsCompile) return s;
        i ?? (i = Rr);
        const n = new CompilationContext(t, e, i, null, null, void 0);
        const r = It(s.template) || !t.enhance ? n.ye.createTemplate(s.template) : s.template;
        const o = r.nodeName === br && null != r.content;
        const h = o ? r.content : r;
        const a = e.get(jt(Dr));
        const c = a.length;
        let u = 0;
        if (c > 0) while (c > u) {
            a[u].compiling?.(r);
            ++u;
        }
        if (r.hasAttribute($r)) throw vt(`AUR0701`);
        this.ke(h, n);
        this.Ae(h, n);
        return CustomElementDefinition.create({
            ...t,
            name: t.name || Hs(),
            dependencies: (t.dependencies ?? l).concat(n.deps ?? l),
            instructions: n.rows,
            surrogates: o ? this.Ce(r, n) : l,
            template: r,
            hasSlots: n.hasSlot,
            needsCompile: false
        });
    }
    compileSpread(t, e, i, s) {
        const n = new CompilationContext(t, i, Rr, null, null, void 0);
        const r = [];
        const o = n.Be(s.nodeName.toLowerCase());
        const l = null !== o;
        const h = n.ep;
        const a = e.length;
        let c = 0;
        let u;
        let f = null;
        let d;
        let m;
        let g;
        let p;
        let v;
        let x = null;
        let w;
        let y;
        let k;
        let A;
        for (;a > c; ++c) {
            u = e[c];
            k = u.target;
            A = u.rawValue;
            x = n.Se(u);
            if (null !== x && (1 & x.type) > 0) {
                Tr.node = s;
                Tr.attr = u;
                Tr.bindable = null;
                Tr.def = null;
                r.push(x.build(Tr, n.ep, n.m));
                continue;
            }
            f = n.Re(k);
            if (null !== f) {
                if (f.isTemplateController) throw vt(`AUR0703:${k}`);
                g = BindablesInfo.from(f, true);
                y = false === f.noMultiBindings && null === x && Br(A);
                if (y) m = this.Ie(s, A, f, n); else {
                    v = g.primary;
                    if (null === x) {
                        w = h.parse(A, 1);
                        m = [ null === w ? new SetPropertyInstruction(A, v.property) : new InterpolationInstruction(w, v.property) ];
                    } else {
                        Tr.node = s;
                        Tr.attr = u;
                        Tr.bindable = v;
                        Tr.def = f;
                        m = [ x.build(Tr, n.ep, n.m) ];
                    }
                }
                (d ?? (d = [])).push(new HydrateAttributeInstruction(this.resolveResources ? f : f.name, null != f.aliases && f.aliases.includes(k) ? k : void 0, m));
                continue;
            }
            if (null === x) {
                w = h.parse(A, 1);
                if (l) {
                    g = BindablesInfo.from(o, false);
                    p = g.attrs[k];
                    if (void 0 !== p) {
                        w = h.parse(A, 1);
                        r.push(new SpreadElementPropBindingInstruction(null == w ? new SetPropertyInstruction(A, p.property) : new InterpolationInstruction(w, p.property)));
                        continue;
                    }
                }
                if (null != w) r.push(new InterpolationInstruction(w, n.m.map(s, k) ?? b(k))); else switch (k) {
                  case "class":
                    r.push(new SetClassAttributeInstruction(A));
                    break;

                  case "style":
                    r.push(new SetStyleAttributeInstruction(A));
                    break;

                  default:
                    r.push(new SetAttributeInstruction(A, k));
                }
            } else {
                if (l) {
                    g = BindablesInfo.from(o, false);
                    p = g.attrs[k];
                    if (void 0 !== p) {
                        Tr.node = s;
                        Tr.attr = u;
                        Tr.bindable = p;
                        Tr.def = o;
                        r.push(new SpreadElementPropBindingInstruction(x.build(Tr, n.ep, n.m)));
                        continue;
                    }
                }
                Tr.node = s;
                Tr.attr = u;
                Tr.bindable = null;
                Tr.def = null;
                r.push(x.build(Tr, n.ep, n.m));
            }
        }
        Sr();
        if (null != d) return d.concat(r);
        return r;
    }
    Ce(t, e) {
        const i = [];
        const s = t.attributes;
        const n = e.ep;
        let r = s.length;
        let o = 0;
        let l;
        let h;
        let a;
        let c;
        let u = null;
        let f;
        let d;
        let m;
        let g;
        let p = null;
        let v;
        let x;
        let w;
        let y;
        for (;r > o; ++o) {
            l = s[o];
            h = l.name;
            a = l.value;
            c = e.me.parse(h, a);
            w = c.target;
            y = c.rawValue;
            if (Lr[w]) throw vt(`AUR0702:${h}`);
            p = e.Se(c);
            if (null !== p && (1 & p.type) > 0) {
                Tr.node = t;
                Tr.attr = c;
                Tr.bindable = null;
                Tr.def = null;
                i.push(p.build(Tr, e.ep, e.m));
                continue;
            }
            u = e.Re(w);
            if (null !== u) {
                if (u.isTemplateController) throw vt(`AUR0703:${w}`);
                m = BindablesInfo.from(u, true);
                x = false === u.noMultiBindings && null === p && Br(y);
                if (x) d = this.Ie(t, y, u, e); else {
                    g = m.primary;
                    if (null === p) {
                        v = n.parse(y, 1);
                        d = [ null === v ? new SetPropertyInstruction(y, g.property) : new InterpolationInstruction(v, g.property) ];
                    } else {
                        Tr.node = t;
                        Tr.attr = c;
                        Tr.bindable = g;
                        Tr.def = u;
                        d = [ p.build(Tr, e.ep, e.m) ];
                    }
                }
                t.removeAttribute(h);
                --o;
                --r;
                (f ?? (f = [])).push(new HydrateAttributeInstruction(this.resolveResources ? u : u.name, null != u.aliases && u.aliases.includes(w) ? w : void 0, d));
                continue;
            }
            if (null === p) {
                v = n.parse(y, 1);
                if (null != v) {
                    t.removeAttribute(h);
                    --o;
                    --r;
                    i.push(new InterpolationInstruction(v, e.m.map(t, w) ?? b(w)));
                } else switch (h) {
                  case "class":
                    i.push(new SetClassAttributeInstruction(y));
                    break;

                  case "style":
                    i.push(new SetStyleAttributeInstruction(y));
                    break;

                  default:
                    i.push(new SetAttributeInstruction(y, h));
                }
            } else {
                Tr.node = t;
                Tr.attr = c;
                Tr.bindable = null;
                Tr.def = null;
                i.push(p.build(Tr, e.ep, e.m));
            }
        }
        Sr();
        if (null != f) return f.concat(i);
        return i;
    }
    Ae(t, e) {
        switch (t.nodeType) {
          case 1:
            switch (t.nodeName) {
              case "LET":
                return this.Te(t, e);

              default:
                return this.Le(t, e);
            }

          case 3:
            return this.Ee(t, e);

          case 11:
            {
                let i = t.firstChild;
                while (null !== i) i = this.Ae(i, e);
                break;
            }
        }
        return t.nextSibling;
    }
    Te(t, e) {
        const i = t.attributes;
        const s = i.length;
        const n = [];
        const r = e.ep;
        let o = false;
        let l = 0;
        let h;
        let a;
        let c;
        let u;
        let f;
        let d;
        let m;
        let g;
        for (;s > l; ++l) {
            h = i[l];
            c = h.name;
            u = h.value;
            if ("to-binding-context" === c) {
                o = true;
                continue;
            }
            a = e.me.parse(c, u);
            d = a.target;
            m = a.rawValue;
            f = e.Se(a);
            if (null !== f) {
                if ("bind" === a.command) n.push(new LetBindingInstruction(r.parse(m, 16), b(d))); else throw vt(`AUR0704:${a.command}`);
                continue;
            }
            g = r.parse(m, 1);
            n.push(new LetBindingInstruction(null === g ? new N(m) : g, b(d)));
        }
        e.rows.push([ new HydrateLetElementInstruction(n, o) ]);
        return this.Pe(t).nextSibling;
    }
    Le(t, e) {
        var i, s, r, o;
        const h = t.nextSibling;
        const a = (t.getAttribute("as-element") ?? t.nodeName).toLowerCase();
        const c = e.Be(a);
        const u = null !== c;
        const f = u && null != c.shadowOptions;
        const d = c?.capture;
        const m = null != d && "boolean" !== typeof d;
        const g = d ? [] : l;
        const p = e.ep;
        const v = this.debug ? n : () => {
            t.removeAttribute(C);
            --k;
            --y;
        };
        let x = t.attributes;
        let w;
        let y = x.length;
        let k = 0;
        let A;
        let C;
        let B;
        let S;
        let R;
        let I;
        let T = null;
        let L = false;
        let E;
        let P;
        let _;
        let $;
        let U;
        let q;
        let D;
        let M = null;
        let F;
        let O;
        let V;
        let N;
        let j = true;
        let H = false;
        let W = false;
        if ("slot" === a) {
            if (null == e.root.def.shadowOptions) throw vt(`AUR0717:${e.root.def.name}`);
            e.root.hasSlot = true;
        }
        if (u) {
            j = c.processContent?.call(c.Type, t, e.p);
            x = t.attributes;
            y = x.length;
        }
        if (e.root.def.enhance && t.classList.contains("au")) throw vt(`AUR0705`);
        for (;y > k; ++k) {
            A = x[k];
            C = A.name;
            B = A.value;
            switch (C) {
              case "as-element":
              case "containerless":
                v();
                if (!H) H = "containerless" === C;
                continue;
            }
            S = e.me.parse(C, B);
            M = e.Se(S);
            V = S.target;
            N = S.rawValue;
            if (d && (!m || m && d(V))) {
                if (null != M && 1 & M.type) {
                    v();
                    g.push(S);
                    continue;
                }
                W = V !== jr && "slot" !== V;
                if (W) {
                    F = BindablesInfo.from(c, false);
                    if (null == F.attrs[V] && !e.Re(V)?.isTemplateController) {
                        v();
                        g.push(S);
                        continue;
                    }
                }
            }
            if (null !== M && 1 & M.type) {
                Tr.node = t;
                Tr.attr = S;
                Tr.bindable = null;
                Tr.def = null;
                (R ?? (R = [])).push(M.build(Tr, e.ep, e.m));
                v();
                continue;
            }
            T = e.Re(V);
            if (null !== T) {
                F = BindablesInfo.from(T, true);
                L = false === T.noMultiBindings && null === M && Br(N);
                if (L) _ = this.Ie(t, N, T, e); else {
                    O = F.primary;
                    if (null === M) {
                        q = p.parse(N, 1);
                        _ = [ null === q ? new SetPropertyInstruction(N, O.property) : new InterpolationInstruction(q, O.property) ];
                    } else {
                        Tr.node = t;
                        Tr.attr = S;
                        Tr.bindable = O;
                        Tr.def = T;
                        _ = [ M.build(Tr, e.ep, e.m) ];
                    }
                }
                v();
                if (T.isTemplateController) ($ ?? ($ = [])).push(new HydrateTemplateController(Ir, this.resolveResources ? T : T.name, void 0, _)); else (P ?? (P = [])).push(new HydrateAttributeInstruction(this.resolveResources ? T : T.name, null != T.aliases && T.aliases.includes(V) ? V : void 0, _));
                continue;
            }
            if (null === M) {
                if (u) {
                    F = BindablesInfo.from(c, false);
                    E = F.attrs[V];
                    if (void 0 !== E) {
                        q = p.parse(N, 1);
                        (I ?? (I = [])).push(null == q ? new SetPropertyInstruction(N, E.property) : new InterpolationInstruction(q, E.property));
                        v();
                        continue;
                    }
                }
                q = p.parse(N, 1);
                if (null != q) {
                    v();
                    (R ?? (R = [])).push(new InterpolationInstruction(q, e.m.map(t, V) ?? b(V)));
                }
                continue;
            }
            v();
            if (u) {
                F = BindablesInfo.from(c, false);
                E = F.attrs[V];
                if (void 0 !== E) {
                    Tr.node = t;
                    Tr.attr = S;
                    Tr.bindable = E;
                    Tr.def = c;
                    (I ?? (I = [])).push(M.build(Tr, e.ep, e.m));
                    continue;
                }
            }
            Tr.node = t;
            Tr.attr = S;
            Tr.bindable = null;
            Tr.def = null;
            (R ?? (R = [])).push(M.build(Tr, e.ep, e.m));
        }
        Sr();
        if (this._e(t, R) && null != R && R.length > 1) this.$e(t, R);
        if (u) {
            D = new HydrateElementInstruction(this.resolveResources ? c : c.name, void 0, I ?? l, null, H, g);
            if (a === jr) {
                const i = t.getAttribute("name") || Nr;
                const s = e.t();
                const n = e.Ue();
                let r = t.firstChild;
                while (null !== r) {
                    if (1 === r.nodeType && r.hasAttribute(jr)) t.removeChild(r); else ke(s, r);
                    r = t.firstChild;
                }
                this.Ae(s.content, n);
                D.auSlot = {
                    name: i,
                    fallback: CustomElementDefinition.create({
                        name: Hs(),
                        template: s,
                        instructions: n.rows,
                        needsCompile: false
                    })
                };
                t = this.qe(t, e);
            }
        }
        if (null != R || null != D || null != P) {
            w = l.concat(D ?? l, P ?? l, R ?? l);
            this.Pe(t);
        }
        let z;
        if (null != $) {
            y = $.length - 1;
            k = y;
            U = $[k];
            let n;
            if (Ar(t)) {
                n = e.t();
                Ae(n, [ e.De(yr), e.De(kr), this.Pe(e.h(wr)) ]);
            } else {
                this.qe(t, e);
                if ("TEMPLATE" === t.nodeName) n = t; else {
                    n = e.t();
                    ke(n, t);
                }
            }
            const r = n;
            const o = e.Ue(null == w ? [] : [ w ]);
            let l;
            let h;
            let d;
            let m;
            let g;
            let p;
            let v;
            let x;
            let b = 0, A = 0;
            let C = t.firstChild;
            let B = false;
            if (false !== j) while (null !== C) {
                h = 1 === C.nodeType ? C.getAttribute(jr) : null;
                if (null !== h) C.removeAttribute(jr);
                if (u) {
                    l = C.nextSibling;
                    if (!f) {
                        B = 3 === C.nodeType && "" === C.textContent.trim();
                        if (!B) ((i = m ?? (m = {}))[s = h || Nr] ?? (i[s] = [])).push(C);
                        t.removeChild(C);
                    }
                    C = l;
                } else {
                    if (null !== h) {
                        h = h || Nr;
                        throw vt(`AUR0706:${a}[${h}]`);
                    }
                    C = C.nextSibling;
                }
            }
            if (null != m) {
                d = {};
                for (h in m) {
                    n = e.t();
                    g = m[h];
                    for (b = 0, A = g.length; A > b; ++b) {
                        p = g[b];
                        if ("TEMPLATE" === p.nodeName) if (p.attributes.length > 0) ke(n, p); else ke(n, p.content); else ke(n, p);
                    }
                    x = e.Ue();
                    this.Ae(n.content, x);
                    d[h] = CustomElementDefinition.create({
                        name: Hs(),
                        template: n,
                        instructions: x.rows,
                        needsCompile: false,
                        isStrictBinding: e.root.def.isStrictBinding
                    });
                }
                D.projections = d;
            }
            if (u && (H || c.containerless)) this.qe(t, e);
            z = !u || !c.containerless && !H && false !== j;
            if (z) if (t.nodeName === br) this.Ae(t.content, o); else {
                C = t.firstChild;
                while (null !== C) C = this.Ae(C, o);
            }
            U.def = CustomElementDefinition.create({
                name: Hs(),
                template: r,
                instructions: o.rows,
                needsCompile: false,
                isStrictBinding: e.root.def.isStrictBinding
            });
            while (k-- > 0) {
                U = $[k];
                n = e.t();
                v = this.Pe(e.h(wr));
                Ae(n, [ e.De(yr), e.De(kr), v ]);
                U.def = CustomElementDefinition.create({
                    name: Hs(),
                    template: n,
                    needsCompile: false,
                    instructions: [ [ $[k + 1] ] ],
                    isStrictBinding: e.root.def.isStrictBinding
                });
            }
            e.rows.push([ U ]);
        } else {
            if (null != w) e.rows.push(w);
            let i = t.firstChild;
            let s;
            let n;
            let l = null;
            let h;
            let d;
            let m;
            let g;
            let p;
            let v = false;
            let x = 0, b = 0;
            if (false !== j) while (null !== i) {
                n = 1 === i.nodeType ? i.getAttribute(jr) : null;
                if (null !== n) i.removeAttribute(jr);
                if (u) {
                    s = i.nextSibling;
                    if (!f) {
                        v = 3 === i.nodeType && "" === i.textContent.trim();
                        if (!v) ((r = h ?? (h = {}))[o = n || Nr] ?? (r[o] = [])).push(i);
                        t.removeChild(i);
                    }
                    i = s;
                } else {
                    if (null !== n) {
                        n = n || Nr;
                        throw vt(`AUR0706:${a}[${n}]`);
                    }
                    i = i.nextSibling;
                }
            }
            if (null != h) {
                l = {};
                for (n in h) {
                    g = e.t();
                    d = h[n];
                    for (x = 0, b = d.length; b > x; ++x) {
                        m = d[x];
                        if (m.nodeName === br) if (m.attributes.length > 0) ke(g, m); else ke(g, m.content); else ke(g, m);
                    }
                    p = e.Ue();
                    this.Ae(g.content, p);
                    l[n] = CustomElementDefinition.create({
                        name: Hs(),
                        template: g,
                        instructions: p.rows,
                        needsCompile: false,
                        isStrictBinding: e.root.def.isStrictBinding
                    });
                }
                D.projections = l;
            }
            if (u && (H || c.containerless)) this.qe(t, e);
            z = !u || !c.containerless && !H && false !== j;
            if (z && t.childNodes.length > 0) {
                i = t.firstChild;
                while (null !== i) i = this.Ae(i, e);
            }
        }
        return h;
    }
    Ee(t, e) {
        const i = t.parentNode;
        const s = e.ep.parse(t.textContent, 1);
        const n = t.nextSibling;
        let r;
        let o;
        let l;
        let h;
        let a;
        if (null !== s) {
            ({parts: r, expressions: o} = s);
            if (a = r[0]) we(i, e.Me(a), t);
            for (l = 0, h = o.length; h > l; ++l) {
                be(i, t, [ e.De(yr), e.De(kr), this.Pe(e.h(wr)) ]);
                if (a = r[l + 1]) we(i, e.Me(a), t);
                e.rows.push([ new TextBindingInstruction(o[l], e.root.def.isStrictBinding) ]);
            }
            i.removeChild(t);
        }
        return n;
    }
    Ie(t, e, i, s) {
        const n = BindablesInfo.from(i, true);
        const r = e.length;
        const o = [];
        let l;
        let h;
        let a = 0;
        let c = 0;
        let u;
        let f;
        let d;
        let m;
        for (let g = 0; g < r; ++g) {
            c = e.charCodeAt(g);
            if (92 === c) ++g; else if (58 === c) {
                l = e.slice(a, g);
                while (e.charCodeAt(++g) <= 32) ;
                a = g;
                for (;g < r; ++g) {
                    c = e.charCodeAt(g);
                    if (92 === c) ++g; else if (59 === c) {
                        h = e.slice(a, g);
                        break;
                    }
                }
                if (void 0 === h) h = e.slice(a);
                f = s.me.parse(l, h);
                d = s.Se(f);
                m = n.attrs[f.target];
                if (null == m) throw vt(`AUR0707:${i.name}.${f.target}`);
                if (null === d) {
                    u = s.ep.parse(h, 1);
                    o.push(null === u ? new SetPropertyInstruction(h, m.property) : new InterpolationInstruction(u, m.property));
                } else {
                    Tr.node = t;
                    Tr.attr = f;
                    Tr.bindable = m;
                    Tr.def = i;
                    o.push(d.build(Tr, s.ep, s.m));
                }
                while (g < r && e.charCodeAt(++g) <= 32) ;
                a = g;
                l = void 0;
                h = void 0;
            }
        }
        Sr();
        return o;
    }
    ke(t, e) {
        const i = t;
        const s = y(i.querySelectorAll("template[as-custom-element]"));
        const n = s.length;
        if (0 === n) return;
        if (n === i.childElementCount) throw vt(`AUR0708`);
        const r = new Set;
        const o = [];
        for (const t of s) {
            if (t.parentNode !== i) throw vt(`AUR0709`);
            const s = Ur(t, r);
            const n = class LocalTemplate {};
            const l = t.content;
            const h = y(l.querySelectorAll("bindable"));
            const a = Dt.for(n);
            const c = new Set;
            const u = new Set;
            for (const t of h) {
                if (t.parentNode !== l) throw vt(`AUR0710`);
                const e = t.getAttribute("property");
                if (null === e) throw vt(`AUR0711`);
                const i = t.getAttribute("attribute");
                if (null !== i && u.has(i) || c.has(e)) throw vt(`AUR0712:${e}+${i}`); else {
                    if (null !== i) u.add(i);
                    c.add(e);
                }
                a.add({
                    property: e,
                    attribute: i ?? void 0,
                    mode: qr(t)
                });
                const s = t.getAttributeNames().filter((t => !_r.includes(t)));
                if (s.length > 0) ;
                l.removeChild(t);
            }
            o.push(n);
            e.Fe(zs({
                name: s,
                template: t
            }, n));
            i.removeChild(t);
        }
        let h = 0;
        const a = o.length;
        for (;a > h; ++h) Qs(o[h]).dependencies.push(...e.def.dependencies ?? l, ...e.deps ?? l);
    }
    _e(t, e) {
        const i = t.nodeName;
        return "INPUT" === i && 1 === Er[t.type] || "SELECT" === i && (t.hasAttribute("multiple") || e?.some((t => "rg" === t.type && "multiple" === t.to)));
    }
    $e(t, e) {
        switch (t.nodeName) {
          case "INPUT":
            {
                const t = e;
                let i;
                let s;
                let n = 0;
                let r;
                for (let e = 0; e < t.length && n < 3; e++) {
                    r = t[e];
                    switch (r.to) {
                      case "model":
                      case "value":
                      case "matcher":
                        i = e;
                        n++;
                        break;

                      case "checked":
                        s = e;
                        n++;
                        break;
                    }
                }
                if (void 0 !== s && void 0 !== i && s < i) [t[i], t[s]] = [ t[s], t[i] ];
                break;
            }

          case "SELECT":
            {
                const t = e;
                let i = 0;
                let s = 0;
                let n = 0;
                let r;
                for (let e = 0; e < t.length && n < 2; ++e) {
                    r = t[e];
                    switch (r.to) {
                      case "multiple":
                        s = e;
                        n++;
                        break;

                      case "value":
                        i = e;
                        n++;
                        break;
                    }
                    if (2 === n && i < s) [t[s], t[i]] = [ t[i], t[s] ];
                }
            }
        }
    }
    Oe(t) {
        return t.nodeName === wr && Cr(xr = ye(t)) && xr.textContent === kr && Cr(xr = ye(xr)) && xr.textContent === yr;
    }
    Pe(t) {
        t.classList.add("au");
        return t;
    }
    qe(t, e) {
        if (Ar(t)) return t;
        const i = t.parentNode;
        const s = this.Pe(e.h(wr));
        be(i, t, [ e.De(yr), e.De(kr), s ]);
        i.removeChild(t);
        return s;
    }
}

let xr;

const wr = "AU-M";

const br = "TEMPLATE";

const yr = "au-start";

const kr = "au-end";

const Ar = t => t.nodeName === wr && Cr(xr = ye(t)) && xr.textContent === kr && Cr(xr = ye(xr)) && xr.textContent === yr;

const Cr = t => 8 === t?.nodeType;

class CompilationContext {
    constructor(t, e, i, s, n, r) {
        this.hasSlot = false;
        this.Ve = pt();
        const o = null !== s;
        this.c = e;
        this.root = null === n ? this : n;
        this.def = t;
        this.ci = i;
        this.parent = s;
        this.ye = o ? s.ye : e.get(gr);
        this.me = o ? s.me : e.get(ie);
        this.ep = o ? s.ep : e.get(D);
        this.m = o ? s.m : e.get(fr);
        this.Ne = o ? s.Ne : e.get(k);
        this.p = o ? s.p : e.get(pi);
        this.localEls = o ? s.localEls : new Set;
        this.rows = r ?? [];
    }
    Fe(t) {
        var e;
        ((e = this.root).deps ?? (e.deps = [])).push(t);
        this.root.c.register(t);
    }
    Me(t) {
        return xe(this.p, t);
    }
    De(t) {
        return pe(this.p, t);
    }
    h(t) {
        const e = ge(this.p, t);
        if ("template" === t) this.p.document.adoptNode(e.content);
        return e;
    }
    t() {
        return this.h("template");
    }
    Be(t) {
        return this.c.find(Js, t);
    }
    Re(t) {
        return this.c.find(gi, t);
    }
    Ue(t) {
        return new CompilationContext(this.def, this.c, this.ci, this, this.root, t);
    }
    Se(t) {
        if (this.root !== this) return this.root.Se(t);
        const e = t.command;
        if (null === e) return null;
        let i = this.Ve[e];
        if (void 0 === i) {
            i = this.c.create(Qn, e);
            if (null === i) throw vt(`AUR0713:${e}`);
            this.Ve[e] = i;
        }
        return i;
    }
}

const Br = t => {
    const e = t.length;
    let i = 0;
    let s = 0;
    while (e > s) {
        i = t.charCodeAt(s);
        if (92 === i) ++s; else if (58 === i) return true; else if (36 === i && 123 === t.charCodeAt(s + 1)) return false;
        ++s;
    }
    return false;
};

const Sr = () => {
    Tr.node = Tr.attr = Tr.bindable = Tr.def = null;
};

const Rr = {
    projections: null
};

const Ir = {
    name: "unnamed"
};

const Tr = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const Lr = bt(pt(), {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
});

const Er = {
    checkbox: 1,
    radio: 1
};

const Pr = new WeakMap;

class BindablesInfo {
    static from(t, e) {
        let i = Pr.get(t);
        if (null == i) {
            const s = t.bindables;
            const n = pt();
            const r = e ? void 0 === t.defaultBindingMode ? 8 : t.defaultBindingMode : 8;
            let o;
            let l;
            let h = false;
            let a;
            let c;
            for (l in s) {
                o = s[l];
                c = o.attribute;
                if (true === o.primary) {
                    if (h) throw vt(`AUR0714:${t.name}`);
                    h = true;
                    a = o;
                } else if (!h && null == a) a = o;
                n[c] = BindableDefinition.create(l, t.Type, o);
            }
            if (null == o && e) a = n.value = BindableDefinition.create("value", t.Type, {
                mode: r
            });
            Pr.set(t, i = new BindablesInfo(n, s, a));
        }
        return i;
    }
    constructor(t, e, i) {
        this.attrs = t;
        this.bindables = e;
        this.primary = i;
    }
}

const _r = wt([ "property", "attribute", "mode" ]);

const $r = "as-custom-element";

const Ur = (t, e) => {
    const i = t.getAttribute($r);
    if (null === i || "" === i) throw vt(`AUR0715`);
    if (e.has(i)) throw vt(`AUR0716:${i}`); else {
        e.add(i);
        t.removeAttribute($r);
    }
    return i;
};

const qr = t => {
    switch (t.getAttribute("mode")) {
      case "oneTime":
        return 1;

      case "toView":
        return 2;

      case "fromView":
        return 4;

      case "twoWay":
        return 6;

      case "default":
      default:
        return 8;
    }
};

const Dr = Ht("ITemplateCompilerHooks");

const Mr = new WeakMap;

const Fr = at("compiler-hooks");

const Or = wt({
    name: Fr,
    define(t) {
        let e = Mr.get(t);
        if (void 0 === e) {
            Mr.set(t, e = new TemplateCompilerHooksDefinition(t));
            rt(Fr, e, t);
            ct(t, Fr);
        }
        return t;
    }
});

class TemplateCompilerHooksDefinition {
    get name() {
        return "";
    }
    constructor(t) {
        this.Type = t;
    }
    register(t) {
        t.register(Wt(Dr, this.Type));
    }
}

const Vr = t => {
    return void 0 === t ? e : e(t);
    function e(t) {
        return Or.define(t);
    }
};

const Nr = "default";

const jr = "au-slot";

const Hr = new Map;

class BindingModeBehavior {
    bind(t, e) {
        Hr.set(e, e.mode);
        e.mode = this.mode;
    }
    unbind(t, e) {
        e.mode = Hr.get(e);
        Hr.delete(e);
    }
}

class OneTimeBindingBehavior extends BindingModeBehavior {
    get mode() {
        return 1;
    }
}

class ToViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return 2;
    }
}

class FromViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return 4;
    }
}

class TwoWayBindingBehavior extends BindingModeBehavior {
    get mode() {
        return 6;
    }
}

Pe("oneTime")(OneTimeBindingBehavior);

Pe("toView")(ToViewBindingBehavior);

Pe("fromView")(FromViewBindingBehavior);

Pe("twoWay")(TwoWayBindingBehavior);

const Wr = new WeakMap;

const zr = 200;

class DebounceBindingBehavior {
    constructor(t) {
        this.p = t;
    }
    bind(t, e, i) {
        i = Number(i);
        const s = {
            type: "debounce",
            delay: i > 0 ? i : zr,
            now: this.p.performanceNow,
            queue: this.p.taskQueue
        };
        const n = e.limit?.(s);
        if (null == n) ; else Wr.set(e, n);
    }
    unbind(t, e) {
        Wr.get(e)?.dispose();
        Wr.delete(e);
    }
}

DebounceBindingBehavior.inject = [ c ];

Pe("debounce")(DebounceBindingBehavior);

class SignalBindingBehavior {
    constructor(t) {
        this.je = new Map;
        this.He = t;
    }
    bind(t, e, ...i) {
        if (!("handleChange" in e)) throw vt(`AUR0817`);
        if (0 === i.length) throw vt(`AUR0818`);
        this.je.set(e, i);
        let s;
        for (s of i) this.He.addSignalListener(s, e);
    }
    unbind(t, e) {
        const i = this.je.get(e);
        this.je.delete(e);
        let s;
        for (s of i) this.He.removeSignalListener(s, e);
    }
}

SignalBindingBehavior.inject = [ L ];

Pe("signal")(SignalBindingBehavior);

const Gr = new WeakMap;

const Xr = 200;

class ThrottleBindingBehavior {
    constructor(t) {
        this.We = t.performanceNow;
        this.ct = t.taskQueue;
    }
    bind(t, e, i) {
        i = Number(i);
        const s = {
            type: "throttle",
            delay: i > 0 ? i : Xr,
            now: this.We,
            queue: this.ct
        };
        const n = e.limit?.(s);
        if (null == n) ; else Gr.set(e, n);
    }
    unbind(t, e) {
        Gr.get(e)?.dispose();
        Gr.delete(e);
    }
}

ThrottleBindingBehavior.inject = [ c ];

Pe("throttle")(ThrottleBindingBehavior);

class DataAttributeAccessor {
    constructor() {
        this.type = 2 | 4;
    }
    getValue(t, e) {
        return t.getAttribute(e);
    }
    setValue(t, e, i) {
        if (null == t) e.removeAttribute(i); else e.setAttribute(i, t);
    }
}

bi(DataAttributeAccessor);

const Kr = new DataAttributeAccessor;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) throw vt(`AURxxxx`);
        e.useTargetObserver(Kr);
    }
}

Pe("attr")(AttrBindingBehavior);

class SelfBindingBehavior {
    bind(t, e) {
        if (!(e instanceof ListenerBinding)) throw vt(`AUR0801`);
        e.self = true;
    }
    unbind(t, e) {
        e.self = false;
    }
}

Pe("self")(SelfBindingBehavior);

const Qr = pt();

class AttributeNSAccessor {
    static forNs(t) {
        return Qr[t] ?? (Qr[t] = new AttributeNSAccessor(t));
    }
    constructor(t) {
        this.ns = t;
        this.type = 2 | 4;
    }
    getValue(t, e) {
        return t.getAttributeNS(this.ns, e);
    }
    setValue(t, e, i) {
        if (null == t) e.removeAttributeNS(this.ns, i); else e.setAttributeNS(this.ns, i, t);
    }
}

bi(AttributeNSAccessor);

function Yr(t, e) {
    return t === e;
}

class CheckedObserver {
    constructor(t, e, i, s) {
        this.type = 2 | 1 | 4;
        this.v = void 0;
        this.ov = void 0;
        this.ze = void 0;
        this.Ge = void 0;
        this.bt = false;
        this.wt = t;
        this.oL = s;
        this.cf = i;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        const e = this.v;
        if (t === e) return;
        this.v = t;
        this.ov = e;
        this.Xe();
        this.Ke();
        this.st();
    }
    handleCollectionChange() {
        this.Ke();
    }
    handleChange(t, e) {
        this.Ke();
    }
    Ke() {
        const t = this.v;
        const e = this.wt;
        const i = xt.call(e, "model") ? e.model : e.value;
        const s = "radio" === e.type;
        const n = void 0 !== e.matcher ? e.matcher : Yr;
        if (s) e.checked = !!n(t, i); else if (true === t) e.checked = true; else {
            let s = false;
            if (St(t)) s = -1 !== t.findIndex((t => !!n(t, i))); else if (t instanceof Set) {
                for (const e of t) if (n(e, i)) {
                    s = true;
                    break;
                }
            } else if (t instanceof Map) for (const e of t) {
                const t = e[0];
                const r = e[1];
                if (n(t, i) && true === r) {
                    s = true;
                    break;
                }
            }
            e.checked = s;
        }
    }
    handleEvent() {
        let t = this.ov = this.v;
        const e = this.wt;
        const i = xt.call(e, "model") ? e.model : e.value;
        const s = e.checked;
        const n = void 0 !== e.matcher ? e.matcher : Yr;
        if ("checkbox" === e.type) {
            if (St(t)) {
                const e = t.findIndex((t => !!n(t, i)));
                if (s && -1 === e) t.push(i); else if (!s && -1 !== e) t.splice(e, 1);
                return;
            } else if (t instanceof Set) {
                const e = {};
                let r = e;
                for (const e of t) if (true === n(e, i)) {
                    r = e;
                    break;
                }
                if (s && r === e) t.add(i); else if (!s && r !== e) t.delete(r);
                return;
            } else if (t instanceof Map) {
                let e;
                for (const s of t) {
                    const t = s[0];
                    if (true === n(t, i)) {
                        e = t;
                        break;
                    }
                }
                t.set(e, s);
                return;
            }
            t = s;
        } else if (s) t = i; else return;
        this.v = t;
        this.st();
    }
    yt() {
        this.Xe();
    }
    kt() {
        this.ze?.unsubscribe(this);
        this.Ge?.unsubscribe(this);
        this.ze = this.Ge = void 0;
    }
    st() {
        Zr = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Zr);
    }
    Xe() {
        const t = this.wt;
        (this.Ge ?? (this.Ge = t.$observers?.model ?? t.$observers?.value))?.subscribe(this);
        this.ze?.unsubscribe(this);
        this.ze = void 0;
        if ("checkbox" === t.type) (this.ze = co(this.v, this.oL))?.subscribe(this);
    }
}

wi(CheckedObserver);

I(CheckedObserver);

let Zr;

const Jr = {
    childList: true,
    subtree: true,
    characterData: true
};

function to(t, e) {
    return t === e;
}

class SelectValueObserver {
    constructor(t, e, i, s) {
        this.type = 2 | 1 | 4;
        this.v = void 0;
        this.ov = void 0;
        this.J = false;
        this.Qe = void 0;
        this.Ye = void 0;
        this.iO = false;
        this.bt = false;
        this.wt = t;
        this.oL = s;
        this.cf = i;
    }
    getValue() {
        return this.iO ? this.v : this.wt.multiple ? eo(this.wt.options) : this.wt.value;
    }
    setValue(t) {
        this.ov = this.v;
        this.v = t;
        this.J = t !== this.ov;
        this.Ze(t instanceof Array ? t : null);
        this.it();
    }
    it() {
        if (this.J) {
            this.J = false;
            this.syncOptions();
        }
    }
    handleCollectionChange() {
        this.syncOptions();
    }
    syncOptions() {
        const t = this.v;
        const e = this.wt;
        const i = St(t);
        const s = e.matcher ?? to;
        const n = e.options;
        let r = n.length;
        while (r-- > 0) {
            const e = n[r];
            const o = xt.call(e, "model") ? e.model : e.value;
            if (i) {
                e.selected = -1 !== t.findIndex((t => !!s(o, t)));
                continue;
            }
            e.selected = !!s(o, t);
        }
    }
    syncValue() {
        const t = this.wt;
        const e = t.options;
        const i = e.length;
        const s = this.v;
        let n = 0;
        if (t.multiple) {
            if (!(s instanceof Array)) return true;
            let r;
            const o = t.matcher || to;
            const l = [];
            while (n < i) {
                r = e[n];
                if (r.selected) l.push(xt.call(r, "model") ? r.model : r.value);
                ++n;
            }
            let h;
            n = 0;
            while (n < s.length) {
                h = s[n];
                if (-1 === l.findIndex((t => !!o(h, t)))) s.splice(n, 1); else ++n;
            }
            n = 0;
            while (n < l.length) {
                h = l[n];
                if (-1 === s.findIndex((t => !!o(h, t)))) s.push(h);
                ++n;
            }
            return false;
        }
        let r = null;
        let o;
        while (n < i) {
            o = e[n];
            if (o.selected) {
                r = xt.call(o, "model") ? o.model : o.value;
                break;
            }
            ++n;
        }
        this.ov = this.v;
        this.v = r;
        return true;
    }
    yt() {
        (this.Ye = Be(this.wt, this.Je.bind(this))).observe(this.wt, Jr);
        this.Ze(this.v instanceof Array ? this.v : null);
        this.iO = true;
    }
    kt() {
        this.Ye.disconnect();
        this.Qe?.unsubscribe(this);
        this.Ye = this.Qe = void 0;
        this.iO = false;
    }
    Ze(t) {
        this.Qe?.unsubscribe(this);
        this.Qe = void 0;
        if (null != t) {
            if (!this.wt.multiple) throw vt(`AUR0654`);
            (this.Qe = this.oL.getArrayObserver(t)).subscribe(this);
        }
    }
    handleEvent() {
        const t = this.syncValue();
        if (t) this.st();
    }
    Je(t) {
        this.syncOptions();
        const e = this.syncValue();
        if (e) this.st();
    }
    st() {
        io = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, io);
    }
}

wi(SelectValueObserver);

I(SelectValueObserver);

function eo(t) {
    const e = [];
    if (0 === t.length) return e;
    const i = t.length;
    let s = 0;
    let n;
    while (i > s) {
        n = t[s];
        if (n.selected) e[e.length] = xt.call(n, "model") ? n.model : n.value;
        ++s;
    }
    return e;
}

let io;

const so = "--";

class StyleAttributeAccessor {
    constructor(t) {
        this.obj = t;
        this.type = 2 | 4;
        this.v = "";
        this.ov = "";
        this.styles = {};
        this.version = 0;
        this.J = false;
    }
    getValue() {
        return this.obj.style.cssText;
    }
    setValue(t) {
        this.v = t;
        this.J = t !== this.ov;
        this.it();
    }
    ti(t) {
        const e = [];
        const i = /url\([^)]+$/;
        let s = 0;
        let n = "";
        let r;
        let o;
        let l;
        let h;
        while (s < t.length) {
            r = t.indexOf(";", s);
            if (-1 === r) r = t.length;
            n += t.substring(s, r);
            s = r + 1;
            if (i.test(n)) {
                n += ";";
                continue;
            }
            o = n.indexOf(":");
            l = n.substring(0, o).trim();
            h = n.substring(o + 1).trim();
            e.push([ l, h ]);
            n = "";
        }
        return e;
    }
    ei(t) {
        let e;
        let i;
        const n = [];
        for (i in t) {
            e = t[i];
            if (null == e) continue;
            if (It(e)) {
                if (i.startsWith(so)) {
                    n.push([ i, e ]);
                    continue;
                }
                n.push([ s(i), e ]);
                continue;
            }
            n.push(...this.ii(e));
        }
        return n;
    }
    si(t) {
        const e = t.length;
        if (e > 0) {
            const i = [];
            let s = 0;
            for (;e > s; ++s) i.push(...this.ii(t[s]));
            return i;
        }
        return l;
    }
    ii(t) {
        if (It(t)) return this.ti(t);
        if (t instanceof Array) return this.si(t);
        if (t instanceof Object) return this.ei(t);
        return l;
    }
    it() {
        if (this.J) {
            this.J = false;
            const t = this.v;
            const e = this.styles;
            const i = this.ii(t);
            let s;
            let n = this.version;
            this.ov = t;
            let r;
            let o;
            let l;
            let h = 0;
            const a = i.length;
            for (;h < a; ++h) {
                r = i[h];
                o = r[0];
                l = r[1];
                this.setProperty(o, l);
                e[o] = n;
            }
            this.styles = e;
            this.version += 1;
            if (0 === n) return;
            n -= 1;
            for (s in e) {
                if (!xt.call(e, s) || e[s] !== n) continue;
                this.obj.style.removeProperty(s);
            }
        }
    }
    setProperty(t, e) {
        let i = "";
        if (null != e && Rt(e.indexOf) && e.includes("!important")) {
            i = "important";
            e = e.replace("!important", "");
        }
        this.obj.style.setProperty(t, e, i);
    }
    bind() {
        this.v = this.ov = this.obj.style.cssText;
    }
}

bi(StyleAttributeAccessor);

class ValueAttributeObserver {
    constructor(t, e, i) {
        this.type = 2 | 1 | 4;
        this.v = "";
        this.ov = "";
        this.J = false;
        this.bt = false;
        this.wt = t;
        this.k = e;
        this.cf = i;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (Et(t, this.v)) return;
        this.ov = this.v;
        this.v = t;
        this.J = true;
        if (!this.cf.readonly) this.it();
    }
    it() {
        if (this.J) {
            this.J = false;
            this.wt[this.k] = this.v ?? this.cf.default;
            this.st();
        }
    }
    handleEvent() {
        this.ov = this.v;
        this.v = this.wt[this.k];
        if (this.ov !== this.v) {
            this.J = false;
            this.st();
        }
    }
    yt() {
        this.v = this.ov = this.wt[this.k];
    }
    st() {
        no = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, no);
    }
}

wi(ValueAttributeObserver);

I(ValueAttributeObserver);

let no;

const ro = "http://www.w3.org/1999/xlink";

const oo = "http://www.w3.org/XML/1998/namespace";

const lo = "http://www.w3.org/2000/xmlns/";

const ho = bt(pt(), {
    "xlink:actuate": [ "actuate", ro ],
    "xlink:arcrole": [ "arcrole", ro ],
    "xlink:href": [ "href", ro ],
    "xlink:role": [ "role", ro ],
    "xlink:show": [ "show", ro ],
    "xlink:title": [ "title", ro ],
    "xlink:type": [ "type", ro ],
    "xml:lang": [ "lang", oo ],
    "xml:space": [ "space", oo ],
    xmlns: [ "xmlns", lo ],
    "xmlns:xlink": [ "xlink", lo ]
});

const ao = new j;

ao.type = 2 | 4;

class NodeObserverLocator {
    constructor(t, e, i, s) {
        this.locator = t;
        this.platform = e;
        this.dirtyChecker = i;
        this.svgAnalyzer = s;
        this.allowDirtyCheck = true;
        this.ni = pt();
        this.ri = pt();
        this.oi = pt();
        this.li = pt();
        const n = [ "change", "input" ];
        const r = {
            events: n,
            default: ""
        };
        this.useConfig({
            INPUT: {
                value: r,
                valueAsNumber: {
                    events: n,
                    default: 0
                },
                checked: {
                    type: CheckedObserver,
                    events: n
                },
                files: {
                    events: n,
                    readonly: true
                }
            },
            SELECT: {
                value: {
                    type: SelectValueObserver,
                    events: [ "change" ],
                    default: ""
                }
            },
            TEXTAREA: {
                value: r
            }
        });
        const o = {
            events: [ "change", "input", "blur", "keyup", "paste" ],
            default: ""
        };
        const l = {
            events: [ "scroll" ],
            default: 0
        };
        this.useConfigGlobal({
            scrollTop: l,
            scrollLeft: l,
            textContent: o,
            innerHTML: o
        });
        this.overrideAccessorGlobal("css", "style", "class");
        this.overrideAccessor({
            INPUT: [ "value", "checked", "model" ],
            SELECT: [ "value" ],
            TEXTAREA: [ "value" ]
        });
    }
    static register(t) {
        zt(H, NodeObserverLocator).register(t);
        Wt(H, NodeObserverLocator).register(t);
    }
    handles(t, e) {
        return t instanceof this.platform.Node;
    }
    useConfig(t, e, i) {
        const s = this.ni;
        let n;
        if (It(t)) {
            n = s[t] ?? (s[t] = pt());
            if (null == n[e]) n[e] = i; else uo(t, e);
        } else for (const i in t) {
            n = s[i] ?? (s[i] = pt());
            const r = t[i];
            for (e in r) if (null == n[e]) n[e] = r[e]; else uo(i, e);
        }
    }
    useConfigGlobal(t, e) {
        const i = this.ri;
        if ("object" === typeof t) for (const e in t) if (null == i[e]) i[e] = t[e]; else uo("*", e); else if (null == i[t]) i[t] = e; else uo("*", t);
    }
    getAccessor(t, e, i) {
        if (e in this.li || e in (this.oi[t.tagName] ?? A)) return this.getObserver(t, e, i);
        switch (e) {
          case "src":
          case "href":
          case "role":
          case "minLength":
          case "maxLength":
          case "placeholder":
          case "size":
          case "pattern":
          case "title":
            return Kr;

          default:
            {
                const i = ho[e];
                if (void 0 !== i) return AttributeNSAccessor.forNs(i[1]);
                if (Ct(t, e, this.svgAnalyzer)) return Kr;
                return ao;
            }
        }
    }
    overrideAccessor(t, e) {
        var i, s;
        let n;
        if (It(t)) {
            n = (i = this.oi)[t] ?? (i[t] = pt());
            n[e] = true;
        } else for (const e in t) for (const i of t[e]) {
            n = (s = this.oi)[e] ?? (s[e] = pt());
            n[i] = true;
        }
    }
    overrideAccessorGlobal(...t) {
        for (const e of t) this.li[e] = true;
    }
    getNodeObserverConfig(t, e) {
        return this.ni[t.tagName]?.[e] ?? this.ri[e];
    }
    getNodeObserver(t, e, i) {
        const s = this.ni[t.tagName]?.[e] ?? this.ri[e];
        let n;
        if (null != s) {
            n = new (s.type ?? ValueAttributeObserver)(t, e, s, i, this.locator);
            if (!n.doNotCache) W(t)[e] = n;
            return n;
        }
        return null;
    }
    getObserver(t, e, i) {
        switch (e) {
          case "class":
            return new ClassAttributeAccessor(t);

          case "css":
          case "style":
            return new StyleAttributeAccessor(t);
        }
        const s = this.getNodeObserver(t, e, i);
        if (null != s) return s;
        const n = ho[e];
        if (void 0 !== n) return AttributeNSAccessor.forNs(n[1]);
        if (Ct(t, e, this.svgAnalyzer)) return Kr;
        if (e in t.constructor.prototype) {
            if (this.allowDirtyCheck) return this.dirtyChecker.createProperty(t, e);
            throw vt(`AUR0652:${mt(e)}`);
        } else return new z(t, e);
    }
}

NodeObserverLocator.inject = [ C, pi, G, cr ];

function co(t, e) {
    if (t instanceof Array) return e.getArrayObserver(t);
    if (t instanceof Map) return e.getMapObserver(t);
    if (t instanceof Set) return e.getSetObserver(t);
}

function uo(t, e) {
    throw vt(`AUR0653:${mt(e)}@${t}`);
}

class UpdateTriggerBindingBehavior {
    constructor(t, e) {
        if (!(e instanceof NodeObserverLocator)) throw vt("AURxxxx: updateTrigger binding behavior only works with the default implementation of Aurelia HTML observation. Implement your own node observation + updateTrigger");
        this.oL = t;
        this.hi = e;
    }
    bind(t, e, ...i) {
        if (0 === i.length) throw vt(`AUR0802`);
        if (!(e instanceof PropertyBinding) || !(4 & e.mode)) throw vt(`AUR0803`);
        const s = this.hi.getNodeObserverConfig(e.target, e.targetProperty);
        if (null == s) throw vt(`AURxxxx`);
        const n = this.hi.getNodeObserver(e.target, e.targetProperty, this.oL);
        n.useConfig({
            readonly: s.readonly,
            default: s.default,
            events: i
        });
        e.useTargetObserver(n);
    }
}

UpdateTriggerBindingBehavior.inject = [ M, H ];

Pe("updateTrigger")(UpdateTriggerBindingBehavior);

class Focus {
    constructor(t, e) {
        this.ai = false;
        this.ui = t;
        this.p = e;
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) this.fi(); else this.ai = true;
    }
    attached() {
        if (this.ai) {
            this.ai = false;
            this.fi();
        }
        this.ui.addEventListener("focus", this);
        this.ui.addEventListener("blur", this);
    }
    detaching() {
        const t = this.ui;
        t.removeEventListener("focus", this);
        t.removeEventListener("blur", this);
    }
    handleEvent(t) {
        if ("focus" === t.type) this.value = true; else if (!this.di) this.value = false;
    }
    fi() {
        const t = this.ui;
        const e = this.di;
        const i = this.value;
        if (i && !e) t.focus(); else if (!i && e) t.blur();
    }
    get di() {
        return this.ui === this.p.document.activeElement;
    }
}

Focus.inject = [ xs, pi ];

et([ $t({
    mode: 6
}) ], Focus.prototype, "value", void 0);

oi("focus")(Focus);

let fo = class Show {
    constructor(t, e, i) {
        this.el = t;
        this.p = e;
        this.mi = false;
        this.lt = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.lt = null;
            if (Boolean(this.value) !== this.gi) if (this.gi === this.pi) {
                this.gi = !this.pi;
                this.$val = this.el.style.getPropertyValue("display");
                this.$prio = this.el.style.getPropertyPriority("display");
                this.el.style.setProperty("display", "none", "important");
            } else {
                this.gi = this.pi;
                this.el.style.setProperty("display", this.$val, this.$prio);
                if ("" === this.el.getAttribute("style")) this.el.removeAttribute("style");
            }
        };
        this.gi = this.pi = "hide" !== i.alias;
    }
    binding() {
        this.mi = true;
        this.update();
    }
    detaching() {
        this.mi = false;
        this.lt?.cancel();
        this.lt = null;
    }
    valueChanged() {
        if (this.mi && null === this.lt) this.lt = this.p.domWriteQueue.queueTask(this.update);
    }
};

et([ $t ], fo.prototype, "value", void 0);

fo = et([ it(0, xs), it(1, pi), it(2, an) ], fo);

Qt("hide")(fo);

oi("show")(fo);

class Portal {
    constructor(t, e, i) {
        this.position = "beforeend";
        this.strict = false;
        this.p = i;
        this.vi = i.document.createElement("div");
        (this.view = t.create()).setLocation(this.xi = ve(i));
        Cs(this.view.nodes, e);
    }
    attaching(t) {
        if (null == this.callbackContext) this.callbackContext = this.$controller.scope.bindingContext;
        const e = this.vi = this.wi();
        this.bi(e, this.position);
        return this.yi(t, e);
    }
    detaching(t) {
        return this.ki(t, this.vi);
    }
    targetChanged() {
        const {$controller: t} = this;
        if (!t.isActive) return;
        const e = this.wi();
        if (this.vi === e) return;
        this.vi = e;
        const i = g(this.ki(null, e), (() => {
            this.bi(e, this.position);
            return this.yi(null, e);
        }));
        if (Bt(i)) i.catch(Lt);
    }
    positionChanged() {
        const {$controller: t, vi: e} = this;
        if (!t.isActive) return;
        const i = g(this.ki(null, e), (() => {
            this.bi(e, this.position);
            return this.yi(null, e);
        }));
        if (Bt(i)) i.catch(Lt);
    }
    yi(t, e) {
        const {activating: i, callbackContext: s, view: n} = this;
        return g(i?.call(s, e, n), (() => this.Ai(t, e)));
    }
    Ai(t, e) {
        const {$controller: i, view: s} = this;
        if (null === t) s.nodes.insertBefore(this.xi); else return g(s.activate(t ?? s, i, i.scope), (() => this.Ci(e)));
        return this.Ci(e);
    }
    Ci(t) {
        const {activated: e, callbackContext: i, view: s} = this;
        return e?.call(i, t, s);
    }
    ki(t, e) {
        const {deactivating: i, callbackContext: s, view: n} = this;
        return g(i?.call(s, e, n), (() => this.Bi(t, e)));
    }
    Bi(t, e) {
        const {$controller: i, view: s} = this;
        if (null === t) s.nodes.remove(); else return g(s.deactivate(t, i), (() => this.Si(e)));
        return this.Si(e);
    }
    Si(t) {
        const {deactivated: e, callbackContext: i, view: s} = this;
        return e?.call(i, t, s);
    }
    wi() {
        const t = this.p;
        const e = t.document;
        let i = this.target;
        let s = this.renderContext;
        if ("" === i) {
            if (this.strict) throw vt(`AUR0811`);
            return e.body;
        }
        if (It(i)) {
            let n = e;
            if (It(s)) s = e.querySelector(s);
            if (s instanceof t.Node) n = s;
            i = n.querySelector(i);
        }
        if (i instanceof t.Node) return i;
        if (null == i) {
            if (this.strict) throw vt(`AUR0812`);
            return e.body;
        }
        return i;
    }
    bi(t, e) {
        const i = this.xi;
        const s = i.$start;
        const n = t.parentNode;
        const r = [ s, i ];
        switch (e) {
          case "beforeend":
            be(t, null, r);
            break;

          case "afterbegin":
            be(t, t.firstChild, r);
            break;

          case "beforebegin":
            be(n, t, r);
            break;

          case "afterend":
            be(n, t.nextSibling, r);
            break;

          default:
            throw new Error("Invalid portal insertion position");
        }
    }
    dispose() {
        this.view.dispose();
        this.view = void 0;
        this.callbackContext = null;
    }
    accept(t) {
        if (true === this.view?.accept(t)) return true;
    }
}

Portal.inject = [ Mi, bs, pi ];

et([ $t({
    primary: true
}) ], Portal.prototype, "target", void 0);

et([ $t() ], Portal.prototype, "position", void 0);

et([ $t({
    callback: "targetChanged"
}) ], Portal.prototype, "renderContext", void 0);

et([ $t() ], Portal.prototype, "strict", void 0);

et([ $t() ], Portal.prototype, "deactivating", void 0);

et([ $t() ], Portal.prototype, "activating", void 0);

et([ $t() ], Portal.prototype, "deactivated", void 0);

et([ $t() ], Portal.prototype, "activated", void 0);

et([ $t() ], Portal.prototype, "callbackContext", void 0);

li("portal")(Portal);

class If {
    constructor(t, e) {
        this.elseFactory = void 0;
        this.elseView = void 0;
        this.ifView = void 0;
        this.view = void 0;
        this.value = false;
        this.cache = true;
        this.pending = void 0;
        this.Ri = false;
        this.Ii = 0;
        this.Ti = t;
        this.l = e;
    }
    attaching(t, e) {
        let i;
        const s = this.$controller;
        const n = this.Ii++;
        const r = () => !this.Ri && this.Ii === n + 1;
        return g(this.pending, (() => {
            if (!r()) return;
            this.pending = void 0;
            if (this.value) i = this.view = this.ifView = this.cache && null != this.ifView ? this.ifView : this.Ti.create(); else i = this.view = this.elseView = this.cache && null != this.elseView ? this.elseView : this.elseFactory?.create();
            if (null == i) return;
            i.setLocation(this.l);
            this.pending = g(i.activate(t, s, s.scope), (() => {
                if (r()) this.pending = void 0;
            }));
        }));
    }
    detaching(t, e) {
        this.Ri = true;
        return g(this.pending, (() => {
            this.Ri = false;
            this.pending = void 0;
            void this.view?.deactivate(t, this.$controller);
        }));
    }
    valueChanged(t, e) {
        if (!this.$controller.isActive) return;
        t = !!t;
        e = !!e;
        if (t === e) return;
        const i = this.view;
        const s = this.$controller;
        const n = this.Ii++;
        const r = () => !this.Ri && this.Ii === n + 1;
        let o;
        return g(this.pending, (() => this.pending = g(i?.deactivate(i, s), (() => {
            if (!r()) return;
            if (t) o = this.view = this.ifView = this.cache && null != this.ifView ? this.ifView : this.Ti.create(); else o = this.view = this.elseView = this.cache && null != this.elseView ? this.elseView : this.elseFactory?.create();
            if (null == o) return;
            o.setLocation(this.l);
            return g(o.activate(o, s, s.scope), (() => {
                if (r()) this.pending = void 0;
            }));
        }))));
    }
    dispose() {
        this.ifView?.dispose();
        this.elseView?.dispose();
        this.ifView = this.elseView = this.view = void 0;
    }
    accept(t) {
        if (true === this.view?.accept(t)) return true;
    }
}

If.inject = [ Mi, bs ];

et([ $t ], If.prototype, "value", void 0);

et([ $t({
    set: t => "" === t || !!t && "false" !== t
}) ], If.prototype, "cache", void 0);

li("if")(If);

class Else {
    constructor(t) {
        this.f = t;
    }
    link(t, e, i, s) {
        const n = t.children;
        const r = n[n.length - 1];
        if (r instanceof If) r.elseFactory = this.f; else if (r.viewModel instanceof If) r.viewModel.elseFactory = this.f; else throw vt(`AUR0810`);
    }
}

Else.inject = [ Mi ];

li({
    name: "else"
})(Else);

function mo(t) {
    t.dispose();
}

const go = [ 18, 17 ];

class Repeat {
    constructor(t, e, i, s, n) {
        this.views = [];
        this.key = null;
        this.Li = new Map;
        this.Ei = new Map;
        this.Pi = void 0;
        this._i = false;
        this.$i = false;
        this.Ui = null;
        this.qi = void 0;
        this.Di = false;
        const r = t.props[0].props[0];
        if (void 0 !== r) {
            const {to: t, value: i, command: s} = r;
            if ("key" === t) if (null === s) this.key = i; else if ("bind" === s) this.key = e.parse(i, 16); else throw vt(`AUR775:${s}`); else throw vt(`AUR776:${t}`);
        }
        this.l = i;
        this.Mi = s;
        this.f = n;
    }
    binding(t, e) {
        const i = this.Mi.bindings;
        const s = i.length;
        let n;
        let r;
        let o = 0;
        for (;s > o; ++o) {
            n = i[o];
            if (n.target === this && "items" === n.targetProperty) {
                r = this.forOf = n.ast;
                this.Fi = n;
                let t = r.iterable;
                while (null != t && go.includes(t.$kind)) {
                    t = t.expression;
                    this._i = true;
                }
                this.Ui = t;
                break;
            }
        }
        this.Oi();
        const l = r.declaration;
        if (!(this.Di = 24 === l.$kind || 25 === l.$kind)) this.local = T(l, this.$controller.scope, n, null);
    }
    attaching(t, e) {
        this.Vi();
        return this.Ni(t);
    }
    detaching(t, e) {
        this.Oi();
        return this.ji(t);
    }
    unbinding(t, e) {
        this.Ei.clear();
        this.Li.clear();
    }
    itemsChanged() {
        if (!this.$controller.isActive) return;
        this.Oi();
        this.Vi();
        this.Hi(this.items, void 0);
    }
    handleCollectionChange(t, e) {
        const i = this.$controller;
        if (!i.isActive) return;
        if (this._i) {
            if (this.$i) return;
            this.$i = true;
            this.items = T(this.forOf.iterable, i.scope, this.Fi, null);
            this.$i = false;
            return;
        }
        this.Vi();
        this.Hi(t, e);
    }
    Hi(t, e) {
        const i = this.views;
        const s = i.length;
        const n = this.key;
        const r = null !== n;
        if (r || void 0 === e) {
            const t = this.local;
            const o = this.qi;
            const l = o.length;
            const h = this.forOf;
            const a = h.declaration;
            const c = this.Fi;
            const u = this.Di;
            e = X(l);
            let f = 0;
            if (0 === s) for (;f < l; ++f) e[f] = -2; else if (0 === l) if (u) for (f = 0; f < s; ++f) {
                e.deletedIndices.push(f);
                e.deletedItems.push(T(a, i[f].scope, c, null));
            } else for (f = 0; f < s; ++f) {
                e.deletedIndices.push(f);
                e.deletedItems.push(i[f].scope.bindingContext[t]);
            } else {
                const d = Array(s);
                if (u) for (f = 0; f < s; ++f) d[f] = T(a, i[f].scope, c, null); else for (f = 0; f < s; ++f) d[f] = i[f].scope.bindingContext[t];
                let m;
                let g;
                let p;
                let v;
                let x = 0;
                const w = s - 1;
                const b = l - 1;
                const y = new Map;
                const k = new Map;
                const A = this.Li;
                const C = this.Ei;
                const B = this.$controller.scope;
                f = 0;
                t: {
                    while (true) {
                        if (r) {
                            m = d[f];
                            g = o[f];
                            p = To(A, n, m, Lo(C, m, h, B, c, t, u), c);
                            v = To(A, n, g, Lo(C, g, h, B, c, t, u), c);
                        } else {
                            m = p = Eo(d[f], f);
                            g = v = Eo(o[f], f);
                        }
                        if (p !== v) {
                            A.set(m, p);
                            A.set(g, v);
                            break;
                        }
                        ++f;
                        if (f > w || f > b) break t;
                    }
                    if (w !== b) break t;
                    x = b;
                    while (true) {
                        if (r) {
                            m = d[x];
                            g = o[x];
                            p = To(A, n, m, Lo(C, m, h, B, c, t, u), c);
                            v = To(A, n, g, Lo(C, g, h, B, c, t, u), c);
                        } else {
                            m = p = Eo(d[f], f);
                            g = v = Eo(o[f], f);
                        }
                        if (p !== v) {
                            A.set(m, p);
                            A.set(g, v);
                            break;
                        }
                        --x;
                        if (f > x) break t;
                    }
                }
                const S = f;
                const R = f;
                for (f = R; f <= b; ++f) {
                    if (A.has(g = r ? o[f] : Eo(o[f], f))) v = A.get(g); else {
                        v = r ? To(A, n, g, Lo(C, g, h, B, c, t, u), c) : g;
                        A.set(g, v);
                    }
                    k.set(v, f);
                }
                for (f = S; f <= w; ++f) {
                    if (A.has(m = r ? d[f] : Eo(d[f], f))) p = A.get(m); else p = r ? To(A, n, m, i[f].scope, c) : m;
                    y.set(p, f);
                    if (k.has(p)) e[k.get(p)] = f; else {
                        e.deletedIndices.push(f);
                        e.deletedItems.push(m);
                    }
                }
                for (f = R; f <= b; ++f) if (!y.has(A.get(r ? o[f] : Eo(o[f], f)))) e[f] = -2;
                y.clear();
                k.clear();
            }
        }
        if (void 0 === e) {
            const t = g(this.ji(null), (() => this.Ni(null)));
            if (Bt(t)) t.catch(Lt);
        } else {
            const t = K(e);
            if (t.deletedIndices.length > 0) {
                const e = g(this.Wi(t), (() => this.zi(s, t)));
                if (Bt(e)) e.catch(Lt);
            } else this.zi(s, t);
        }
    }
    Oi() {
        const t = this.$controller.scope;
        let e = this.Gi;
        let i = this._i;
        let s;
        if (i) {
            e = this.Gi = T(this.Ui, t, this.Fi, null) ?? null;
            i = this._i = !Et(this.items, e);
        }
        const n = this.Pi;
        if (this.$controller.isActive) {
            s = this.Pi = Q(i ? e : this.items);
            if (n !== s) {
                n?.unsubscribe(this);
                s?.subscribe(this);
            }
        } else {
            n?.unsubscribe(this);
            this.Pi = void 0;
        }
    }
    Vi() {
        const {items: t} = this;
        if (St(t)) {
            this.qi = t;
            return;
        }
        const e = [];
        Co(t, ((t, i) => {
            e[i] = t;
        }));
        this.qi = e;
    }
    Ni(t) {
        let e;
        let i;
        let s;
        let n;
        const {$controller: r, f: o, local: l, l: h, items: a, Ei: c, Fi: u, forOf: f, Di: d} = this;
        const m = r.scope;
        const g = Ao(a);
        const p = this.views = Array(g);
        Co(a, ((a, v) => {
            s = p[v] = o.create().setLocation(h);
            s.nodes.unlink();
            n = Lo(c, a, f, m, u, l, d);
            yo(n.overrideContext, v, g);
            i = s.activate(t ?? s, r, n);
            if (Bt(i)) (e ?? (e = [])).push(i);
        }));
        if (void 0 !== e) return 1 === e.length ? e[0] : Promise.all(e);
    }
    ji(t) {
        let e;
        let i;
        let s;
        let n = 0;
        const {views: r, $controller: o} = this;
        const l = r.length;
        for (;l > n; ++n) {
            s = r[n];
            s.release();
            i = s.deactivate(t ?? s, o);
            if (Bt(i)) (e ?? (e = [])).push(i);
        }
        if (void 0 !== e) return 1 === e.length ? e[0] : Promise.all(e);
    }
    Wi(t) {
        let e;
        let i;
        let s;
        const {$controller: n, views: r} = this;
        const o = t.deletedIndices;
        const l = o.length;
        let h = 0;
        for (;l > h; ++h) {
            s = r[o[h]];
            s.release();
            i = s.deactivate(s, n);
            if (Bt(i)) (e ?? (e = [])).push(i);
        }
        h = 0;
        let a = 0;
        for (;l > h; ++h) {
            a = o[h] - h;
            r.splice(a, 1);
        }
        if (void 0 !== e) return 1 === e.length ? e[0] : Promise.all(e);
    }
    zi(t, e) {
        let i;
        let s;
        let n;
        let r;
        let o = 0;
        const {$controller: l, f: h, local: a, qi: c, l: u, views: f, Di: d, Fi: m, Ei: g, forOf: p} = this;
        const v = e.length;
        for (;v > o; ++o) if (-2 === e[o]) {
            n = h.create();
            f.splice(o, 0, n);
        }
        if (f.length !== v) throw bo(f.length, v);
        const x = l.scope;
        const w = e.length;
        Y(f, e);
        const b = wo(e);
        const y = b.length;
        const k = p.declaration;
        let A;
        let C = y - 1;
        o = w - 1;
        for (;o >= 0; --o) {
            n = f[o];
            A = f[o + 1];
            n.nodes.link(A?.nodes ?? u);
            if (-2 === e[o]) {
                r = Lo(g, c[o], p, x, m, a, d);
                yo(r.overrideContext, o, w);
                n.setLocation(u);
                s = n.activate(n, l, r);
                if (Bt(s)) (i ?? (i = [])).push(s);
            } else if (C < 0 || 1 === y || o !== b[C]) {
                if (d) $(k, n.scope, m, c[o]); else n.scope.bindingContext[a] = c[o];
                yo(n.scope.overrideContext, o, w);
                n.nodes.insertBefore(n.location);
            } else {
                if (d) $(k, n.scope, m, c[o]); else n.scope.bindingContext[a] = c[o];
                if (t !== w) yo(n.scope.overrideContext, o, w);
                --C;
            }
        }
        if (void 0 !== i) return 1 === i.length ? i[0] : Promise.all(i);
    }
    dispose() {
        this.views.forEach(mo);
        this.views = void 0;
    }
    accept(t) {
        const {views: e} = this;
        if (void 0 !== e) for (let i = 0, s = e.length; i < s; ++i) if (true === e[i].accept(t)) return true;
    }
}

Repeat.inject = [ an, D, bs, ts, Mi ];

et([ $t ], Repeat.prototype, "items", void 0);

li("repeat")(Repeat);

let po = 16;

let vo = new Int32Array(po);

let xo = new Int32Array(po);

function wo(t) {
    const e = t.length;
    if (e > po) {
        po = e;
        vo = new Int32Array(e);
        xo = new Int32Array(e);
    }
    let i = 0;
    let s = 0;
    let n = 0;
    let r = 0;
    let o = 0;
    let l = 0;
    let h = 0;
    let a = 0;
    for (;r < e; r++) {
        s = t[r];
        if (-2 !== s) {
            o = vo[i];
            n = t[o];
            if (-2 !== n && n < s) {
                xo[r] = o;
                vo[++i] = r;
                continue;
            }
            l = 0;
            h = i;
            while (l < h) {
                a = l + h >> 1;
                n = t[vo[a]];
                if (-2 !== n && n < s) l = a + 1; else h = a;
            }
            n = t[vo[l]];
            if (s < n || -2 === n) {
                if (l > 0) xo[r] = vo[l - 1];
                vo[l] = r;
            }
        }
    }
    r = ++i;
    const c = new Int32Array(r);
    s = vo[i - 1];
    while (i-- > 0) {
        c[i] = s;
        s = xo[s];
    }
    while (r-- > 0) vo[r] = 0;
    return c;
}

const bo = (t, e) => vt(`AUR0814:${t}!=${e}`);

const yo = (t, e, i) => {
    const s = 0 === e;
    const n = e === i - 1;
    const r = e % 2 === 0;
    t.$index = e;
    t.$first = s;
    t.$last = n;
    t.$middle = !s && !n;
    t.$even = r;
    t.$odd = !r;
    t.$length = i;
};

const ko = gt.toString;

const Ao = t => {
    switch (ko.call(t)) {
      case "[object Array]":
        return t.length;

      case "[object Map]":
        return t.size;

      case "[object Set]":
        return t.size;

      case "[object Number]":
        return t;

      case "[object Null]":
        return 0;

      case "[object Undefined]":
        return 0;

      default:
        throw vt(`Cannot count ${ko.call(t)}`);
    }
};

const Co = (t, e) => {
    switch (ko.call(t)) {
      case "[object Array]":
        return Bo(t, e);

      case "[object Map]":
        return So(t, e);

      case "[object Set]":
        return Ro(t, e);

      case "[object Number]":
        return Io(t, e);

      case "[object Null]":
        return;

      case "[object Undefined]":
        return;

      default:
        throw vt(`Cannot iterate over ${ko.call(t)}`);
    }
};

const Bo = (t, e) => {
    const i = t.length;
    let s = 0;
    for (;s < i; ++s) e(t[s], s, t);
};

const So = (t, e) => {
    let i = -0;
    let s;
    for (s of t.entries()) e(s, i++, t);
};

const Ro = (t, e) => {
    let i = 0;
    let s;
    for (s of t.keys()) e(s, i++, t);
};

const Io = (t, e) => {
    let i = 0;
    for (;i < t; ++i) e(i, i, t);
};

const To = (t, e, i, s, n) => {
    let r = t.get(i);
    if (void 0 === r) {
        if ("string" === typeof e) r = i[e]; else r = T(e, s, n, null);
        t.set(i, r);
    }
    return r;
};

const Lo = (t, e, i, s, n, r, o) => {
    let l = t.get(e);
    if (void 0 === l) {
        if (o) $(i.declaration, l = F.fromParent(s, new Z), n, e); else l = F.fromParent(s, new Z(r, e));
        t.set(e, l);
    }
    return l;
};

const Eo = (t, e) => {
    const i = typeof t;
    switch (i) {
      case "object":
        if (null !== t) return t;

      case "string":
      case "number":
      case "bigint":
      case "undefined":
      case "boolean":
        return `${e}${i}${t}`;

      default:
        return t;
    }
};

class With {
    constructor(t, e) {
        this.view = t.create().setLocation(e);
    }
    valueChanged(t, e) {
        const i = this.$controller;
        const s = this.view.bindings;
        let n;
        let r = 0, o = 0;
        if (i.isActive && null != s) {
            n = F.fromParent(i.scope, void 0 === t ? {} : t);
            for (o = s.length; o > r; ++r) s[r].bind(n);
        }
    }
    attaching(t, e) {
        const {$controller: i, value: s} = this;
        const n = F.fromParent(i.scope, void 0 === s ? {} : s);
        return this.view.activate(t, i, n);
    }
    detaching(t, e) {
        return this.view.deactivate(t, this.$controller);
    }
    dispose() {
        this.view.dispose();
        this.view = void 0;
    }
    accept(t) {
        if (true === this.view?.accept(t)) return true;
    }
}

With.inject = [ Mi, bs ];

et([ $t ], With.prototype, "value", void 0);

li("with")(With);

let Po = class Switch {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.cases = [];
        this.activeCases = [];
        this.promise = void 0;
    }
    link(t, e, i, s) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(t, e) {
        const i = this.view;
        const s = this.$controller;
        this.queue((() => i.activate(t, s, s.scope)));
        this.queue((() => this.swap(t, this.value)));
        return this.promise;
    }
    detaching(t, e) {
        this.queue((() => {
            const e = this.view;
            return e.deactivate(t, this.$controller);
        }));
        return this.promise;
    }
    dispose() {
        this.view?.dispose();
        this.view = void 0;
    }
    valueChanged(t, e) {
        if (!this.$controller.isActive) return;
        this.queue((() => this.swap(null, this.value)));
    }
    caseChanged(t) {
        this.queue((() => this.Xi(t)));
    }
    Xi(t) {
        const e = t.isMatch(this.value);
        const i = this.activeCases;
        const s = i.length;
        if (!e) {
            if (s > 0 && i[0].id === t.id) return this.Ki(null);
            return;
        }
        if (s > 0 && i[0].id < t.id) return;
        const n = [];
        let r = t.fallThrough;
        if (!r) n.push(t); else {
            const e = this.cases;
            const i = e.indexOf(t);
            for (let t = i, s = e.length; t < s && r; t++) {
                const i = e[t];
                n.push(i);
                r = i.fallThrough;
            }
        }
        return g(this.Ki(null, n), (() => {
            this.activeCases = n;
            return this.Qi(null);
        }));
    }
    swap(t, e) {
        const i = [];
        let s = false;
        for (const t of this.cases) {
            if (s || t.isMatch(e)) {
                i.push(t);
                s = t.fallThrough;
            }
            if (i.length > 0 && !s) break;
        }
        const n = this.defaultCase;
        if (0 === i.length && void 0 !== n) i.push(n);
        return g(this.activeCases.length > 0 ? this.Ki(t, i) : void 0, (() => {
            this.activeCases = i;
            if (0 === i.length) return;
            return this.Qi(t);
        }));
    }
    Qi(t) {
        const e = this.$controller;
        if (!e.isActive) return;
        const i = this.activeCases;
        const s = i.length;
        if (0 === s) return;
        const n = e.scope;
        if (1 === s) return i[0].activate(t, n);
        return m(...i.map((e => e.activate(t, n))));
    }
    Ki(t, e = []) {
        const i = this.activeCases;
        const s = i.length;
        if (0 === s) return;
        if (1 === s) {
            const s = i[0];
            if (!e.includes(s)) {
                i.length = 0;
                return s.deactivate(t);
            }
            return;
        }
        return g(m(...i.reduce(((i, s) => {
            if (!e.includes(s)) i.push(s.deactivate(t));
            return i;
        }), [])), (() => {
            i.length = 0;
        }));
    }
    queue(t) {
        const e = this.promise;
        let i;
        i = this.promise = g(g(e, t), (() => {
            if (this.promise === i) this.promise = void 0;
        }));
    }
    accept(t) {
        if (true === this.$controller.accept(t)) return true;
        if (this.activeCases.some((e => e.accept(t)))) return true;
    }
};

et([ $t ], Po.prototype, "value", void 0);

Po = et([ li("switch"), it(0, Mi), it(1, bs) ], Po);

let _o = 0;

let $o = class Case {
    constructor(t, e, i, s) {
        this.f = t;
        this.Yi = e;
        this.l = i;
        this.id = ++_o;
        this.fallThrough = false;
        this.view = void 0;
        this.Zi = s.config.level <= 1;
        this.Ne = s.scopeTo(`${this.constructor.name}-#${this.id}`);
    }
    link(t, e, i, s) {
        const n = t.parent;
        const r = n?.viewModel;
        if (r instanceof Po) {
            this.$switch = r;
            this.linkToSwitch(r);
        } else throw vt(`AUR0815`);
    }
    detaching(t, e) {
        return this.deactivate(t);
    }
    isMatch(t) {
        this.Ne.debug("isMatch()");
        const e = this.value;
        if (St(e)) {
            if (void 0 === this.Pi) this.Pi = this.Ji(e);
            return e.includes(t);
        }
        return e === t;
    }
    valueChanged(t, e) {
        if (St(t)) {
            this.Pi?.unsubscribe(this);
            this.Pi = this.Ji(t);
        } else if (void 0 !== this.Pi) this.Pi.unsubscribe(this);
        this.$switch.caseChanged(this);
    }
    handleCollectionChange() {
        this.$switch.caseChanged(this);
    }
    activate(t, e) {
        let i = this.view;
        if (void 0 === i) i = this.view = this.f.create().setLocation(this.l);
        if (i.isActive) return;
        return i.activate(t ?? i, this.$controller, e);
    }
    deactivate(t) {
        const e = this.view;
        if (void 0 === e || !e.isActive) return;
        return e.deactivate(t ?? e, this.$controller);
    }
    dispose() {
        this.Pi?.unsubscribe(this);
        this.view?.dispose();
        this.view = void 0;
    }
    linkToSwitch(t) {
        t.cases.push(this);
    }
    Ji(t) {
        const e = this.Yi.getArrayObserver(t);
        e.subscribe(this);
        return e;
    }
    accept(t) {
        if (true === this.$controller.accept(t)) return true;
        return this.view?.accept(t);
    }
};

$o.inject = [ Mi, M, bs, k ];

et([ $t ], $o.prototype, "value", void 0);

et([ $t({
    set: t => {
        switch (t) {
          case "true":
            return true;

          case "false":
            return false;

          default:
            return !!t;
        }
    },
    mode: 1
}) ], $o.prototype, "fallThrough", void 0);

$o = et([ li("case") ], $o);

let Uo = class DefaultCase extends $o {
    linkToSwitch(t) {
        if (void 0 !== t.defaultCase) throw vt(`AUR0816`);
        t.defaultCase = this;
    }
};

Uo = et([ li("default-case") ], Uo);

let qo = class PromiseTemplateController {
    constructor(t, e, i, s) {
        this.f = t;
        this.l = e;
        this.p = i;
        this.preSettledTask = null;
        this.postSettledTask = null;
        this.logger = s.scopeTo("promise.resolve");
    }
    link(t, e, i, s) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(t, e) {
        const i = this.view;
        const s = this.$controller;
        return g(i.activate(t, s, this.viewScope = F.fromParent(s.scope, {})), (() => this.swap(t)));
    }
    valueChanged(t, e) {
        if (!this.$controller.isActive) return;
        this.swap(null);
    }
    swap(t) {
        const e = this.value;
        if (!Bt(e)) {
            this.logger.warn(`The value '${mt(e)}' is not a promise. No change will be done.`);
            return;
        }
        const i = this.p.domWriteQueue;
        const s = this.fulfilled;
        const n = this.rejected;
        const r = this.pending;
        const o = this.viewScope;
        let l;
        const h = {
            reusable: false
        };
        const a = () => {
            void m(l = (this.preSettledTask = i.queueTask((() => m(s?.deactivate(t), n?.deactivate(t), r?.activate(t, o))), h)).result.catch((t => {
                if (!(t instanceof J)) throw t;
            })), e.then((a => {
                if (this.value !== e) return;
                const c = () => {
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => m(r?.deactivate(t), n?.deactivate(t), s?.activate(t, o, a))), h)).result;
                };
                if (1 === this.preSettledTask.status) void l.then(c); else {
                    this.preSettledTask.cancel();
                    c();
                }
            }), (a => {
                if (this.value !== e) return;
                const c = () => {
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => m(r?.deactivate(t), s?.deactivate(t), n?.activate(t, o, a))), h)).result;
                };
                if (1 === this.preSettledTask.status) void l.then(c); else {
                    this.preSettledTask.cancel();
                    c();
                }
            })));
        };
        if (1 === this.postSettledTask?.status) void this.postSettlePromise.then(a); else {
            this.postSettledTask?.cancel();
            a();
        }
    }
    detaching(t, e) {
        this.preSettledTask?.cancel();
        this.postSettledTask?.cancel();
        this.preSettledTask = this.postSettledTask = null;
        return this.view.deactivate(t, this.$controller);
    }
    dispose() {
        this.view?.dispose();
        this.view = void 0;
    }
};

et([ $t ], qo.prototype, "value", void 0);

qo = et([ li("promise"), it(0, Mi), it(1, bs), it(2, pi), it(3, k) ], qo);

let Do = class PendingTemplateController {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.view = void 0;
    }
    link(t, e, i, s) {
        Oo(t).pending = this;
    }
    activate(t, e) {
        let i = this.view;
        if (void 0 === i) i = this.view = this.f.create().setLocation(this.l);
        if (i.isActive) return;
        return i.activate(i, this.$controller, e);
    }
    deactivate(t) {
        const e = this.view;
        if (void 0 === e || !e.isActive) return;
        return e.deactivate(e, this.$controller);
    }
    detaching(t) {
        return this.deactivate(t);
    }
    dispose() {
        this.view?.dispose();
        this.view = void 0;
    }
};

et([ $t({
    mode: 2
}) ], Do.prototype, "value", void 0);

Do = et([ li("pending"), it(0, Mi), it(1, bs) ], Do);

let Mo = class FulfilledTemplateController {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.view = void 0;
    }
    link(t, e, i, s) {
        Oo(t).fulfilled = this;
    }
    activate(t, e, i) {
        this.value = i;
        let s = this.view;
        if (void 0 === s) s = this.view = this.f.create().setLocation(this.l);
        if (s.isActive) return;
        return s.activate(s, this.$controller, e);
    }
    deactivate(t) {
        const e = this.view;
        if (void 0 === e || !e.isActive) return;
        return e.deactivate(e, this.$controller);
    }
    detaching(t, e) {
        return this.deactivate(t);
    }
    dispose() {
        this.view?.dispose();
        this.view = void 0;
    }
};

et([ $t({
    mode: 4
}) ], Mo.prototype, "value", void 0);

Mo = et([ li("then"), it(0, Mi), it(1, bs) ], Mo);

let Fo = class RejectedTemplateController {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.view = void 0;
    }
    link(t, e, i, s) {
        Oo(t).rejected = this;
    }
    activate(t, e, i) {
        this.value = i;
        let s = this.view;
        if (void 0 === s) s = this.view = this.f.create().setLocation(this.l);
        if (s.isActive) return;
        return s.activate(s, this.$controller, e);
    }
    deactivate(t) {
        const e = this.view;
        if (void 0 === e || !e.isActive) return;
        return e.deactivate(e, this.$controller);
    }
    detaching(t, e) {
        return this.deactivate(t);
    }
    dispose() {
        this.view?.dispose();
        this.view = void 0;
    }
};

et([ $t({
    mode: 4
}) ], Fo.prototype, "value", void 0);

Fo = et([ li("catch"), it(0, Mi), it(1, bs) ], Fo);

function Oo(t) {
    const e = t.parent;
    const i = e?.viewModel;
    if (i instanceof qo) return i;
    throw vt(`AUR0813`);
}

let Vo = class PromiseAttributePattern {
    "promise.resolve"(t, e, i) {
        return new AttrSyntax(t, e, "promise", "bind");
    }
};

Vo = et([ se({
    pattern: "promise.resolve",
    symbols: ""
}) ], Vo);

let No = class FulfilledAttributePattern {
    then(t, e, i) {
        return new AttrSyntax(t, e, "then", "from-view");
    }
};

No = et([ se({
    pattern: "then",
    symbols: ""
}) ], No);

let jo = class RejectedAttributePattern {
    catch(t, e, i) {
        return new AttrSyntax(t, e, "catch", "from-view");
    }
};

jo = et([ se({
    pattern: "catch",
    symbols: ""
}) ], jo);

class AuCompose {
    static get inject() {
        return [ u, ts, xs, bs, pi, an, B(CompositionContextFactory) ];
    }
    get pending() {
        return this.ts;
    }
    get composition() {
        return this.es;
    }
    constructor(t, e, i, s, n, r, o) {
        this.c = t;
        this.parent = e;
        this.host = i;
        this.l = s;
        this.p = n;
        this.scopeBehavior = "auto";
        this.es = void 0;
        this.r = t.get(Fi);
        this.ss = r;
        this.rs = o;
    }
    attaching(t, e) {
        return this.ts = g(this.queue(new ChangeInfo(this.template, this.component, this.model, void 0), t), (t => {
            if (this.rs.isCurrent(t)) this.ts = void 0;
        }));
    }
    detaching(t) {
        const e = this.es;
        const i = this.ts;
        this.rs.invalidate();
        this.es = this.ts = void 0;
        return g(i, (() => e?.deactivate(t)));
    }
    propertyChanged(t) {
        if ("model" === t && null != this.es) {
            this.es.update(this.model);
            return;
        }
        this.ts = g(this.ts, (() => g(this.queue(new ChangeInfo(this.template, this.component, this.model, t), void 0), (t => {
            if (this.rs.isCurrent(t)) this.ts = void 0;
        }))));
    }
    queue(t, e) {
        const i = this.rs;
        const s = this.es;
        return g(i.create(t), (t => {
            if (i.isCurrent(t)) return g(this.compose(t), (n => {
                if (i.isCurrent(t)) return g(n.activate(e), (() => {
                    if (i.isCurrent(t)) {
                        this.es = n;
                        return g(s?.deactivate(e), (() => t));
                    } else return g(n.controller.deactivate(n.controller, this.$controller), (() => {
                        n.controller.dispose();
                        return t;
                    }));
                }));
                n.controller.dispose();
                return t;
            }));
            return t;
        }));
    }
    compose(t) {
        let e;
        let i;
        let s;
        const {be: n, os: r, ls: o} = t.change;
        const {c: l, host: h, $controller: a, l: c} = this;
        const u = this.getDef(r);
        const f = l.createChild();
        const d = null == c ? h.parentNode : c.parentNode;
        if (null !== u) {
            if (u.containerless) throw vt(`AUR0806`);
            if (null == c) {
                i = h;
                s = () => {};
            } else {
                i = d.insertBefore(this.p.document.createElement(u.name), c);
                s = () => {
                    i.remove();
                };
            }
            e = this.cs(f, r, i);
        } else {
            i = null == c ? h : c;
            e = this.cs(f, r, i);
        }
        const m = () => {
            if (null !== u) {
                const n = Controller.$el(f, e, i, {
                    projections: this.ss.projections
                }, u);
                return new CompositionController(n, (t => n.activate(t ?? n, a, a.scope.parent)), (t => g(n.deactivate(t ?? n, a), s)), (t => e.activate?.(t)), t);
            } else {
                const s = CustomElementDefinition.create({
                    name: Js.generateName(),
                    template: n
                });
                const r = this.r.getViewFactory(s, f);
                const o = Controller.$view(r, a);
                const l = "auto" === this.scopeBehavior ? F.fromParent(this.parent.scope, e) : F.create(e);
                if (Ss(i)) o.setLocation(i); else o.setHost(i);
                return new CompositionController(o, (t => o.activate(t ?? o, a, l)), (t => o.deactivate(t ?? o, a)), (t => e.activate?.(t)), t);
            }
        };
        if ("activate" in e) return g(e.activate(o), (() => m())); else return m();
    }
    cs(t, e, i) {
        if (null == e) return new EmptyComponent;
        if ("object" === typeof e) return e;
        const s = this.p;
        const n = Ss(i);
        Kt(t, s.Element, Kt(t, xs, new d("ElementResolver", n ? null : i)));
        Kt(t, bs, new d("IRenderLocation", n ? i : null));
        const r = t.invoke(e);
        Kt(t, e, new d("au-compose.component", r));
        return r;
    }
    getDef(t) {
        const e = Rt(t) ? t : t?.constructor;
        return Js.isType(e) ? Js.getDefinition(e) : null;
    }
}

et([ $t ], AuCompose.prototype, "template", void 0);

et([ $t ], AuCompose.prototype, "component", void 0);

et([ $t ], AuCompose.prototype, "model", void 0);

et([ $t({
    set: t => {
        if ("scoped" === t || "auto" === t) return t;
        throw vt(`AUR0805`);
    }
}) ], AuCompose.prototype, "scopeBehavior", void 0);

Ls("au-compose")(AuCompose);

class EmptyComponent {}

class CompositionContextFactory {
    constructor() {
        this.id = 0;
    }
    isCurrent(t) {
        return t.id === this.id;
    }
    create(t) {
        return g(t.load(), (t => new CompositionContext(++this.id, t)));
    }
    invalidate() {
        this.id++;
    }
}

class ChangeInfo {
    constructor(t, e, i, s) {
        this.be = t;
        this.os = e;
        this.ls = i;
        this.us = s;
    }
    load() {
        if (Bt(this.be) || Bt(this.os)) return Promise.all([ this.be, this.os ]).then((([t, e]) => new LoadedChangeInfo(t, e, this.ls, this.us))); else return new LoadedChangeInfo(this.be, this.os, this.ls, this.us);
    }
}

class LoadedChangeInfo {
    constructor(t, e, i, s) {
        this.be = t;
        this.os = e;
        this.ls = i;
        this.us = s;
    }
}

class CompositionContext {
    constructor(t, e) {
        this.id = t;
        this.change = e;
    }
}

class CompositionController {
    constructor(t, e, i, s, n) {
        this.controller = t;
        this.start = e;
        this.stop = i;
        this.update = s;
        this.context = n;
        this.state = 0;
    }
    activate(t) {
        if (0 !== this.state) throw vt(`AUR0807:${this.controller.name}`);
        this.state = 1;
        return this.start(t);
    }
    deactivate(t) {
        switch (this.state) {
          case 1:
            this.state = -1;
            return this.stop(t);

          case -1:
            throw vt(`AUR0808`);

          default:
            this.state = -1;
        }
    }
}

let Ho = class AuSlot {
    static get inject() {
        return [ bs, an, es, Fi ];
    }
    constructor(t, e, i, s) {
        this.ds = null;
        this.gs = null;
        this.ps = false;
        this.expose = null;
        this.slotchange = null;
        this.vs = new Set;
        this.Pi = null;
        let n;
        let r;
        const o = e.auSlot;
        const h = i.instruction?.projections?.[o.name];
        const a = i.controller;
        this.name = o.name;
        if (null == h) {
            n = s.getViewFactory(o.fallback, a.container);
            this.xs = false;
        } else {
            r = i.parent.controller.container.createChild();
            Kt(r, a.definition.Type, new d(void 0, a.viewModel));
            n = s.getViewFactory(h, r);
            this.xs = true;
            this.ws = a.container.getAll(on, false)?.filter((t => "*" === t.slotName || t.slotName === o.name)) ?? l;
        }
        this.bs = (this.ws ?? (this.ws = l)).length > 0;
        this.ys = i;
        this.view = n.create().setLocation(this.l = t);
    }
    get nodes() {
        const t = [];
        const e = this.l;
        let i = e.$start.nextSibling;
        while (null != i && i !== e) {
            if (8 !== i.nodeType) t.push(i);
            i = i.nextSibling;
        }
        return t;
    }
    subscribe(t) {
        this.vs.add(t);
    }
    unsubscribe(t) {
        this.vs.delete(t);
    }
    binding(t, e) {
        this.ds = this.$controller.scope.parent;
        let i;
        if (this.xs) {
            i = this.ys.controller.scope.parent;
            (this.gs = F.fromParent(i, i.bindingContext)).overrideContext.$host = this.expose ?? this.ds.bindingContext;
        }
    }
    attaching(t, e) {
        return g(this.view.activate(t, this.$controller, this.xs ? this.gs : this.ds), (() => {
            if (this.bs) {
                this.ws.forEach((t => t.watch(this)));
                this.Xe();
                this.ks();
                this.ps = true;
            }
        }));
    }
    detaching(t, e) {
        this.ps = false;
        this.As();
        this.ws.forEach((t => t.unwatch(this)));
        return this.view.deactivate(t, this.$controller);
    }
    exposeChanged(t) {
        if (this.xs && null != this.gs) this.gs.overrideContext.$host = t;
    }
    dispose() {
        this.view.dispose();
        this.view = void 0;
    }
    accept(t) {
        if (true === this.view?.accept(t)) return true;
    }
    Xe() {
        if (null != this.Pi) return;
        const t = this.l;
        const e = t.parentElement;
        if (null == e) return;
        (this.Pi = Be(e, (e => {
            if (zo(t, e)) this.ks();
        }))).observe(e, {
            childList: true
        });
    }
    As() {
        this.Pi?.disconnect();
        this.Pi = null;
    }
    ks() {
        const t = this.nodes;
        const e = new Set(this.vs);
        let i;
        if (this.ps) this.slotchange?.call(void 0, this.name, t);
        for (i of e) i.handleSlotChange(this, t);
    }
};

et([ $t ], Ho.prototype, "expose", void 0);

et([ $t ], Ho.prototype, "slotchange", void 0);

Ho = et([ Ls({
    name: "au-slot",
    template: null,
    containerless: true
}) ], Ho);

const Wo = (t, e) => t.compareDocumentPosition(e);

const zo = (t, e) => {
    for (const {addedNodes: i, removedNodes: s, nextSibling: n} of e) {
        let e = 0;
        let r = i.length;
        let o;
        for (;e < r; ++e) {
            o = i[e];
            if (4 === Wo(t.$start, o) && 2 === Wo(t, o)) return true;
        }
        if (s.length > 0) if (null != n && 4 === Wo(t.$start, n) && 2 === Wo(t, n)) return true;
    }
};

const Go = Ht("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw vt('"sanitize" method not implemented');
    }
})));

let Xo = class SanitizeValueConverter {
    constructor(t) {
        this.Cs = t;
    }
    toView(t) {
        if (null == t) return null;
        return this.Cs.sanitize(t);
    }
};

Xo = et([ it(0, Go) ], Xo);

qe("sanitize")(Xo);

const Ko = DebounceBindingBehavior;

const Qo = OneTimeBindingBehavior;

const Yo = ToViewBindingBehavior;

const Zo = FromViewBindingBehavior;

const Jo = SignalBindingBehavior;

const tl = ThrottleBindingBehavior;

const el = TwoWayBindingBehavior;

const il = TemplateCompiler;

const sl = NodeObserverLocator;

const nl = [ il, sl ];

const rl = SVGAnalyzer;

const ol = ue;

const ll = ce;

const hl = ae;

const al = he;

const cl = fe;

const ul = [ hl, al, cl ];

const fl = [ ol, ll ];

const dl = er;

const ml = ir;

const gl = Jn;

const pl = Yn;

const vl = Zn;

const xl = tr;

const wl = hr;

const bl = sr;

const yl = nr;

const kl = rr;

const Al = lr;

const Cl = or;

const Bl = ar;

const Sl = [ dl, pl, gl, vl, xl, ml, wl, bl, yl, Al, Cl, kl, Bl ];

const Rl = Xo;

const Il = If;

const Tl = Else;

const Ll = Repeat;

const El = With;

const Pl = Po;

const _l = $o;

const $l = Uo;

const Ul = qo;

const ql = Do;

const Dl = Mo;

const Ml = Fo;

const Fl = Vo;

const Ol = No;

const Vl = jo;

const Nl = SelfBindingBehavior;

const jl = UpdateTriggerBindingBehavior;

const Hl = AuCompose;

const Wl = Portal;

const zl = Focus;

const Gl = fo;

const Xl = [ Ko, Qo, Yo, Zo, Jo, tl, el, Rl, Il, Tl, Ll, El, Pl, _l, $l, Ul, ql, Dl, Ml, Fl, Ol, Vl, AttrBindingBehavior, Nl, jl, Hl, Wl, zl, Gl, Ho ];

const Kl = [ Cn, Bn, kn, An, vn, xn, wn, bn, yn, Rn, Pn, In, Tn, Ln, En, Sn, _n ];

const Ql = Yl(n);

function Yl(t) {
    return {
        optionsProvider: t,
        register(e) {
            const i = {
                coercingOptions: {
                    enableCoercion: false,
                    coerceNullish: false
                }
            };
            t(i);
            return e.register(Gt(O, i.coercingOptions), ...nl, ...Xl, ...ul, ...Sl, ...Kl);
        },
        customize(e) {
            return Yl(e ?? t);
        }
    };
}

const Zl = Ht("IAurelia");

class Aurelia {
    get isRunning() {
        return this.ir;
    }
    get isStarting() {
        return this.Bs;
    }
    get isStopping() {
        return this.Ss;
    }
    get root() {
        if (null == this.Rs) {
            if (null == this.next) throw vt(`AUR0767`);
            return this.next;
        }
        return this.Rs;
    }
    constructor(t = r.createContainer()) {
        this.container = t;
        this.ir = false;
        this.Bs = false;
        this.Ss = false;
        this.Rs = void 0;
        this.next = void 0;
        this.Is = void 0;
        this.Ts = void 0;
        if (t.has(Zl, true)) throw vt(`AUR0768`);
        Kt(t, Zl, new d("IAurelia", this));
        Kt(t, gs, this.Ls = new d("IAppRoot"));
    }
    register(...t) {
        this.container.register(...t);
        return this;
    }
    app(t) {
        this.next = new AppRoot(t, this.Es(t.host), this.container, this.Ls);
        return this;
    }
    enhance(t, e) {
        const i = t.container ?? this.container.createChild();
        const s = t.host;
        const n = this.Es(s);
        const r = t.component;
        let o;
        if (Rt(r)) {
            Kt(i, n.HTMLElement, Kt(i, n.Element, Kt(i, xs, new d("ElementResolver", s))));
            o = i.invoke(r);
        } else o = r;
        Kt(i, ws, new d("IEventTarget", s));
        e = e ?? null;
        const l = Controller.$el(i, o, s, null, CustomElementDefinition.create({
            name: Hs(),
            template: s,
            enhance: true
        }));
        return g(l.activate(l, e), (() => l));
    }
    async waitForIdle() {
        const t = this.root.platform;
        await t.domWriteQueue.yield();
        await t.domReadQueue.yield();
        await t.taskQueue.yield();
    }
    Es(t) {
        let e;
        if (!this.container.has(pi, false)) {
            if (null === t.ownerDocument.defaultView) throw vt(`AUR0769`);
            e = new tt(t.ownerDocument.defaultView);
            this.container.register(Gt(pi, e));
        } else e = this.container.get(pi);
        return e;
    }
    start(t = this.next) {
        if (null == t) throw vt(`AUR0770`);
        if (Bt(this.Is)) return this.Is;
        return this.Is = g(this.stop(), (() => {
            Reflect.set(t.host, "$aurelia", this);
            this.Ls.prepare(this.Rs = t);
            this.Bs = true;
            return g(t.activate(), (() => {
                this.ir = true;
                this.Bs = false;
                this.Is = void 0;
                this.Ps(t, "au-started", t.host);
            }));
        }));
    }
    stop(t = false) {
        if (Bt(this.Ts)) return this.Ts;
        if (true === this.ir) {
            const e = this.Rs;
            this.ir = false;
            this.Ss = true;
            return this.Ts = g(e.deactivate(), (() => {
                Reflect.deleteProperty(e.host, "$aurelia");
                if (t) e.dispose();
                this.Rs = void 0;
                this.Ls.dispose();
                this.Ss = false;
                this.Ps(e, "au-stopped", e.host);
            }));
        }
    }
    dispose() {
        if (this.ir || this.Ss) throw vt(`AUR0771`);
        this.container.dispose();
    }
    Ps(t, e, i) {
        const s = new t.platform.window.CustomEvent(e, {
            detail: this,
            bubbles: true,
            cancelable: true
        });
        i.dispatchEvent(s);
    }
}

var Jl;

(function(t) {
    t[t["oneTime"] = 1] = "oneTime";
    t[t["toView"] = 2] = "toView";
    t[t["fromView"] = 4] = "fromView";
    t[t["twoWay"] = 6] = "twoWay";
    t[t["default"] = 8] = "default";
})(Jl || (Jl = {}));

var th;

(function(t) {
    t[t["Element"] = 1] = "Element";
    t[t["Attribute"] = 2] = "Attribute";
})(th || (th = {}));

function eh(t, e) {
    let i;
    const s = "dependencies";
    function n(t, e, n) {
        if (arguments.length > 1) i.name = e;
        if ("function" === typeof t || "undefined" !== typeof n?.value) throw new Error(`Invalid usage. @children can only be used on a field`);
        const r = t.constructor;
        let o = Js.getAnnotation(r, s);
        if (null == o) Js.annotate(r, s, o = []);
        o.push(new ChildrenLifecycleHooks(i));
    }
    if (arguments.length > 1) {
        i = {};
        n(t, e);
        return;
    } else if (It(t)) {
        i = {
            filter: e => 1 === e.nodeType && e.matches(t),
            map: t => t
        };
        return n;
    }
    i = void 0 === t ? {} : t;
    return n;
}

class ChildrenBinding {
    static create(t, e, i, s, n = nh, r = rh, o = oh, l = ih) {
        const h = new ChildrenBinding(t, e, s, n, r, o, l);
        Pt(e, i, {
            enumerable: true,
            configurable: true,
            get: bt((() => h.getValue()), {
                getObserver: () => h
            }),
            set: () => {}
        });
        return h;
    }
    constructor(t, e, i, s = nh, n = rh, r = oh, o = ih) {
        this._s = void 0;
        this.ce = nh;
        this.$s = rh;
        this.Us = oh;
        this.isBound = false;
        this.ht = t;
        this.cb = (this.obj = e)[i];
        this.ce = s;
        this.$s = n;
        this.Us = r;
        this.xt = o;
        this.Pi = Be(this.qs = t.host, (() => {
            this.Ds();
        }));
    }
    getValue() {
        return this.isBound ? this._s : this.Ms();
    }
    setValue(t) {}
    bind() {
        if (this.isBound) return;
        this.isBound = true;
        this.Pi.observe(this.qs, this.xt);
        this._s = this.Ms();
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        this.Pi.disconnect();
        this._s = l;
    }
    Ds() {
        this._s = this.Ms();
        this.cb?.call(this.obj);
        this.subs.notify(this._s, void 0);
    }
    get() {
        throw sh("get");
    }
    useScope() {}
    limit() {
        throw sh("limit");
    }
    Ms() {
        return hh(this.ht, this.ce, this.$s, this.Us);
    }
}

I(ChildrenBinding);

const ih = {
    childList: true
};

const sh = t => vt(`Method "${t}": not implemented`);

const nh = t => t.host.childNodes;

const rh = (t, e, i) => !!i;

const oh = (t, e, i) => i;

const lh = {
    optional: true
};

const hh = (t, e, i, s) => {
    const n = e(t);
    const r = n.length;
    const o = [];
    let l;
    let h;
    let a;
    let c = 0;
    for (;c < r; ++c) {
        l = n[c];
        h = Xs(l, lh);
        a = h?.viewModel ?? null;
        if (i(l, h, a)) o.push(s(l, h, a));
    }
    return o;
};

class ChildrenLifecycleHooks {
    constructor(t) {
        this.def = t;
    }
    register(t) {
        Gt(_i, this).register(t);
    }
    hydrating(t, e) {
        const i = this.def;
        e.addBinding(ChildrenBinding.create(e, e.viewModel, i.name, i.callback ?? `${mt(i.name)}Changed`, i.query ?? nh, i.filter ?? rh, i.map ?? oh, i.options ?? ih));
    }
}

Di()(ChildrenLifecycleHooks);

export { AdoptedStyleSheetsStyles, AppRoot, ti as AppTask, ue as AtPrefixedTriggerAttributePattern, ol as AtPrefixedTriggerAttributePatternRegistration, AttrBindingBehavior, rr as AttrBindingCommand, kl as AttrBindingCommandRegistration, AttrSyntax, AttributeBinding, AttributeBindingInstruction, Pn as AttributeBindingRenderer, AttributeNSAccessor, le as AttributePattern, AuCompose, Ho as AuSlot, AuSlotsInfo, Aurelia, Dt as Bindable, BindableDefinition, BindableObserver, BindablesInfo, Ue as BindingBehavior, BindingBehaviorDefinition, Qn as BindingCommand, BindingCommandDefinition, Jl as BindingMode, BindingModeBehavior, BindingTargetSubscriber, CSSModulesProcessorRegistry, nr as CaptureBindingCommand, yl as CaptureBindingCommandRegistration, $o as Case, CheckedObserver, ChildrenBinding, ClassAttributeAccessor, lr as ClassBindingCommand, Al as ClassBindingCommandRegistration, ce as ColonPrefixedBindAttributePattern, ll as ColonPrefixedBindAttributePatternRegistration, Wn as CommandType, ComputedWatcher, ContentBinding, Controller, gi as CustomAttribute, CustomAttributeDefinition, wn as CustomAttributeRenderer, Js as CustomElement, CustomElementDefinition, xn as CustomElementRenderer, DataAttributeAccessor, DebounceBindingBehavior, Ko as DebounceBindingBehaviorRegistration, er as DefaultBindingCommand, dl as DefaultBindingCommandRegistration, Sl as DefaultBindingLanguage, ul as DefaultBindingSyntax, Uo as DefaultCase, nl as DefaultComponents, Kl as DefaultRenderers, Xl as DefaultResources, th as DefinitionType, he as DotSeparatedAttributePattern, al as DotSeparatedAttributePatternRegistration, Else, Tl as ElseRegistration, ExpressionWatcher, FlushQueue, Focus, ir as ForBindingCommand, ml as ForBindingCommandRegistration, FragmentNodeSequence, FromViewBindingBehavior, Zo as FromViewBindingBehaviorRegistration, Jn as FromViewBindingCommand, gl as FromViewBindingCommandRegistration, Mo as FulfilledTemplateController, HooksDefinition, HydrateAttributeInstruction, HydrateElementInstruction, HydrateLetElementInstruction, HydrateTemplateController, gs as IAppRoot, Je as IAppTask, fr as IAttrMapper, ie as IAttributeParser, ee as IAttributePattern, on as IAuSlotWatcher, rn as IAuSlotsInfo, Zl as IAurelia, ts as IController, ws as IEventTarget, je as IFlushQueue, Ts as IHistory, es as IHydrationContext, an as IInstruction, _i as ILifecycleHooks, Is as ILocation, xs as INode, sl as INodeObserverLocatorRegistration, pi as IPlatform, bs as IRenderLocation, fn as IRenderer, Fi as IRendering, cr as ISVGAnalyzer, Go as ISanitizer, Ri as IShadowDOMGlobalStyles, Si as IShadowDOMStyles, Zt as ISyntaxInterpreter, un as ITemplateCompiler, Dr as ITemplateCompilerHooks, il as ITemplateCompilerRegistration, gr as ITemplateElementFactory, Mi as IViewFactory, Rs as IWindow, If, Il as IfRegistration, hn as InstructionType, InterpolationBinding, An as InterpolationBindingRenderer, InterpolationInstruction, InterpolationPartBinding, Interpretation, IteratorBindingInstruction, Bn as IteratorBindingRenderer, LetBinding, LetBindingInstruction, yn as LetElementRenderer, qi as LifecycleHooks, LifecycleHooksDefinition, LifecycleHooksEntry, ListenerBinding, ListenerBindingInstruction, ListenerBindingOptions, Rn as ListenerBindingRenderer, MultiAttrInstruction, NodeObserverLocator, NoopSVGAnalyzer, OneTimeBindingBehavior, Qo as OneTimeBindingBehaviorRegistration, Yn as OneTimeBindingCommand, pl as OneTimeBindingCommandRegistration, Do as PendingTemplateController, Portal, qo as PromiseTemplateController, PropertyBinding, PropertyBindingInstruction, Cn as PropertyBindingRenderer, ae as RefAttributePattern, hl as RefAttributePatternRegistration, RefBinding, wl as RefBindingCommandRegistration, RefBindingInstruction, kn as RefBindingRenderer, Fo as RejectedTemplateController, Rendering, Repeat, Ll as RepeatRegistration, SVGAnalyzer, rl as SVGAnalyzerRegistration, Xo as SanitizeValueConverter, Rl as SanitizeValueConverterRegistration, SelectValueObserver, SelfBindingBehavior, Nl as SelfBindingBehaviorRegistration, SetAttributeInstruction, In as SetAttributeRenderer, SetClassAttributeInstruction, Tn as SetClassAttributeRenderer, SetPropertyInstruction, vn as SetPropertyRenderer, SetStyleAttributeInstruction, Ln as SetStyleAttributeRenderer, ShadowDOMRegistry, fl as ShortHandBindingSyntax, SignalBindingBehavior, Jo as SignalBindingBehaviorRegistration, SpreadBindingInstruction, SpreadElementPropBindingInstruction, _n as SpreadRenderer, Ql as StandardConfiguration, Zi as State, StyleAttributeAccessor, or as StyleBindingCommand, Cl as StyleBindingCommandRegistration, Ii as StyleConfiguration, StyleElementStyles, StylePropertyBindingInstruction, En as StylePropertyBindingRenderer, Po as Switch, TemplateCompiler, Or as TemplateCompilerHooks, bn as TemplateControllerRenderer, TextBindingInstruction, Sn as TextBindingRenderer, ThrottleBindingBehavior, tl as ThrottleBindingBehaviorRegistration, ToViewBindingBehavior, Yo as ToViewBindingBehaviorRegistration, Zn as ToViewBindingCommand, vl as ToViewBindingCommandRegistration, sr as TriggerBindingCommand, bl as TriggerBindingCommandRegistration, TwoWayBindingBehavior, el as TwoWayBindingBehaviorRegistration, tr as TwoWayBindingCommand, xl as TwoWayBindingCommandRegistration, UpdateTriggerBindingBehavior, jl as UpdateTriggerBindingBehaviorRegistration, ValueAttributeObserver, Fe as ValueConverter, ValueConverterDefinition, ViewFactory, Yi as ViewModelKind, ri as Watch, With, El as WithRegistration, Qt as alias, jt as allResources, se as attributePattern, $t as bindable, Pe as bindingBehavior, zn as bindingCommand, nn as capture, eh as children, Mt as coercer, Ps as containerless, Bs as convertToRenderLocation, Ai as cssModules, oi as customAttribute, Ls as customElement, As as getEffectiveParentNode, ps as getRef, Xi as isCustomElementController, Ki as isCustomElementViewModel, cn as isInstruction, Ss as isRenderLocation, Di as lifecycleHooks, Ve as mixinAstEvaluator, Oe as mixinUseScope, ze as mixingBindingLimited, en as processContent, Yt as registerAliases, dn as renderer, Cs as setEffectiveParentNode, vs as setRef, Ci as shadowCSS, ln as slotted, $s as strict, Vr as templateCompilerHooks, li as templateController, Es as useShadowDOM, qe as valueConverter, ii as watch };
//# sourceMappingURL=index.mjs.map
