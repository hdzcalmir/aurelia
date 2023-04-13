import { Protocol as t, getPrototypeChain as e, firstDefined as i, kebabCase as s, noop as n, DI as r, Registration as o, emptyArray as l, all as h, mergeArrays as a, IPlatform as c, IContainer as u, optional as f, InstanceProvider as d, resolveAll as m, onResolve as g, fromDefinitionOrDefault as p, pascalCase as v, fromAnnotationOrTypeOrDefault as x, fromAnnotationOrDefinitionOrTypeOrDefault as w, camelCase as b, toArray as y, ILogger as k, emptyObject as A, IServiceLocator as C, transient as B } from "../kernel/dist/native-modules/index.mjs";

import { Metadata as S, isObject as R } from "../metadata/dist/native-modules/index.mjs";

import { subscriberCollection as I, astEvaluate as T, ISignaler as L, connectable as E, astBind as P, astUnbind as _, astAssign as $, ConnectableSwitcher as U, ProxyObservable as q, IExpressionParser as D, IObserverLocator as M, Scope as F, ICoercionConfiguration as O, AccessScopeExpression as V, PrimitiveLiteralExpression as N, PropertyAccessor as j, INodeObserverLocator as H, getObserverLookup as W, SetterObserver as z, IDirtyChecker as G, createIndexMap as X, applyMutationsToIndices as K, getCollectionObserver as Q, synchronizeIndices as Y, BindingContext as Z } from "../runtime/dist/native-modules/index.mjs";

import { TaskAbortError as J } from "../platform/dist/native-modules/index.mjs";

import { BrowserPlatform as tt } from "../platform-browser/dist/native-modules/index.mjs";

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

const $t = (t, e, i) => t.addSignalListener(e, i);

const Ut = (t, e, i) => t.removeSignalListener(e, i);

function qt(t, e) {
    let i;
    function s(t, e) {
        if (arguments.length > 1) i.property = e;
        rt(Mt, BindableDefinition.create(e, t, i), t.constructor, e);
        ut(t.constructor, Ft.keyFrom(e));
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

function Dt(t) {
    return t.startsWith(Mt);
}

const Mt = ht("bindable");

const Ft = wt({
    name: Mt,
    keyFrom: t => `${Mt}:${t}`,
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
                if (!nt(Mt, t, n)) ut(t, Ft.keyFrom(n));
                rt(Mt, e, t, n);
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
        const i = Mt.length + 1;
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
            l = ft(a).filter(Dt);
            h = l.length;
            for (c = 0; c < h; ++c) s[o++] = st(Mt, a, l[c].slice(i));
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
        return new BindableDefinition(i(n.attribute, s(t)), i(n.callback, `${t}Changed`), i(n.mode, 2), i(n.primary, false), i(n.property, t), i(n.set, Nt(t, e, n)));
    }
}

function Ot(t, e, i) {
    Vt.define(t, e);
}

const Vt = {
    key: ht("coercer"),
    define(t, e) {
        rt(Vt.key, t[e].bind(t), t);
    },
    for(t) {
        return st(Vt.key, t);
    }
};

function Nt(t, e, i = {}) {
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
            r = "function" === typeof t ? t.bind(s) : Vt.for(s) ?? n;
            break;
        }
    }
    return r === n ? r : jt(r, i.nullable);
}

function jt(t, e) {
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

const Ht = function(t) {
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

const Wt = t => {
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

const zt = r.createInterface;

const Gt = o.singleton;

const Xt = o.aliasTo;

const Kt = o.instance;

o.callback;

const Qt = o.transient;

const Yt = (t, e, i) => t.registerResolver(e, i);

function Zt(...t) {
    return function(e) {
        const i = ht("aliases");
        const s = st(i, e);
        if (void 0 === s) rt(i, t, e); else s.push(...t);
    };
}

function Jt(t, e, i, s) {
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

const te = zt("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

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
        s = s.filter(ee);
        if (s.length > 0) {
            s.sort(ie);
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

function ee(t) {
    return t.M;
}

function ie(t, e) {
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

const se = zt("IAttributePattern");

const ne = zt("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor(t, e) {
        this.Y = {};
        this.Z = t;
        const i = this.F = {};
        const s = e.reduce(((t, e) => {
            const s = he(e.constructor);
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

AttributeParser.inject = [ te, h(se) ];

function re(...t) {
    return function e(i) {
        return ae.define(t, i);
    };
}

class AttributePatternResourceDefinition {
    constructor(t) {
        this.Type = t;
        this.name = void 0;
    }
    register(t) {
        Gt(se, this.Type).register(t);
    }
}

const oe = at("attribute-pattern");

const le = "attribute-pattern-definitions";

const he = e => t.annotation.get(e, le);

const ae = wt({
    name: oe,
    definitionAnnotationKey: le,
    define(e, i) {
        const s = new AttributePatternResourceDefinition(i);
        rt(oe, s, i);
        ct(i, oe);
        t.annotation.set(i, le, e);
        ut(i, le);
        return i;
    },
    getPatternDefinitions: he
});

let ce = class DotSeparatedAttributePattern {
    "PART.PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], i[1]);
    }
    "PART.PART.PART"(t, e, i) {
        return new AttrSyntax(t, e, `${i[0]}.${i[1]}`, i[2]);
    }
};

ce = et([ re({
    pattern: "PART.PART",
    symbols: "."
}, {
    pattern: "PART.PART.PART",
    symbols: "."
}) ], ce);

let ue = class RefAttributePattern {
    ref(t, e, i) {
        return new AttrSyntax(t, e, "element", "ref");
    }
    "PART.ref"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "ref");
    }
};

ue = et([ re({
    pattern: "ref",
    symbols: ""
}, {
    pattern: "PART.ref",
    symbols: "."
}) ], ue);

let fe = class ColonPrefixedBindAttributePattern {
    ":PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "bind");
    }
};

fe = et([ re({
    pattern: ":PART",
    symbols: ":"
}) ], fe);

let de = class AtPrefixedTriggerAttributePattern {
    "@PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "trigger");
    }
};

de = et([ re({
    pattern: "@PART",
    symbols: "@"
}) ], de);

let me = class SpreadAttributePattern {
    "...$attrs"(t, e, i) {
        return new AttrSyntax(t, e, "", "...$attrs");
    }
};

me = et([ re({
    pattern: "...$attrs",
    symbols: ""
}) ], me);

const ge = "au-start";

const pe = "au-end";

const ve = (t, e) => t.document.createElement(e);

const xe = (t, e) => t.document.createComment(e);

const we = t => {
    const e = xe(t, pe);
    e.$start = xe(t, ge);
    return e;
};

const be = (t, e) => t.document.createTextNode(e);

const ye = (t, e, i) => t.insertBefore(e, i);

const ke = (t, e, i) => {
    if (null === t) return;
    const s = i.length;
    let n = 0;
    while (s > n) {
        t.insertBefore(i[n], e);
        ++n;
    }
};

const Ae = t => t.previousSibling;

const Ce = (t, e) => t.content.appendChild(e);

const Be = (t, e) => {
    const i = e.length;
    let s = 0;
    while (i > s) {
        t.content.appendChild(e[s]);
        ++s;
    }
};

const Se = t => {
    const e = t.previousSibling;
    let i;
    if (8 === e?.nodeType && "au-end" === e.textContent) {
        i = e;
        if (null == (i.$start = i.previousSibling)) throw Ie();
        t.parentNode?.removeChild(t);
        return i;
    } else throw Ie();
};

const Re = (t, e) => new t.ownerDocument.defaultView.MutationObserver(e);

const Ie = () => vt(`AURxxxx`);

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
            Te(this.o, this);
        }
    }
    unsubscribe(t) {
        if (this.subs.remove(t) && 0 === this.subs.count) Le(this.o, this);
    }
    st() {
        _e = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, _e);
    }
}

I(AttributeObserver);

const Te = (t, e) => {
    if (void 0 === t.$eMObs) t.$eMObs = new Set;
    if (void 0 === t.$mObs) (t.$mObs = Re(t, Ee)).observe(t, {
        attributes: true
    });
    t.$eMObs.add(e);
};

const Le = (t, e) => {
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

const Ee = t => {
    t[0].target.$eMObs.forEach(Pe, t);
};

function Pe(t) {
    t.handleMutation(this);
}

let _e;

function $e(t) {
    return function(e) {
        return De.define(t, e);
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
        return new BindingBehaviorDefinition(e, i(qe(e, "name"), s), a(qe(e, "aliases"), n.aliases, e.aliases), De.keyFrom(s));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        Gt(i, e).register(t);
        Xt(i, e).register(t);
        Jt(s, De, i, t);
    }
}

const Ue = at("binding-behavior");

const qe = (t, e) => st(ht(e), t);

const De = wt({
    name: Ue,
    keyFrom(t) {
        return `${Ue}:${t}`;
    },
    isType(t) {
        return Rt(t) && nt(Ue, t);
    },
    define(t, e) {
        const i = BindingBehaviorDefinition.create(t, e);
        rt(Ue, i, i.Type);
        rt(Ue, i, i);
        ct(e, Ue);
        return i.Type;
    },
    getDefinition(t) {
        const e = st(Ue, t);
        if (void 0 === e) throw vt(`AUR0151:${t.name}`);
        return e;
    },
    annotate(t, e, i) {
        rt(ht(e), i, t);
    },
    getAnnotation: qe
});

function Me(t) {
    return function(e) {
        return Ve.define(t, e);
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
        return new ValueConverterDefinition(e, i(Oe(e, "name"), s), a(Oe(e, "aliases"), n.aliases, e.aliases), Ve.keyFrom(s));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        o.singleton(i, e).register(t);
        o.aliasTo(i, e).register(t);
        Jt(s, Ve, i, t);
    }
}

const Fe = at("value-converter");

const Oe = (t, e) => st(ht(e), t);

const Ve = wt({
    name: Fe,
    keyFrom: t => `${Fe}:${t}`,
    isType(t) {
        return Rt(t) && nt(Fe, t);
    },
    define(t, e) {
        const i = ValueConverterDefinition.create(t, e);
        rt(Fe, i, i.Type);
        rt(Fe, i, i);
        ct(e, Fe);
        return i.Type;
    },
    getDefinition(t) {
        const e = st(Fe, t);
        if (void 0 === e) throw vt(`AUR0152:${t.name}`);
        return e;
    },
    annotate(t, e, i) {
        rt(ht(e), i, t);
    },
    getAnnotation: Oe
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

const Ne = t => {
    _t(t.prototype, "useScope", (function(t) {
        this.s = t;
    }));
};

const je = (t, e = true) => i => {
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
        const e = Ve.keyFrom(t);
        let i = He.get(this);
        if (null == i) He.set(this, i = new ResourceLookup);
        return i[e] ?? (i[e] = this.l.get(Ht(e)));
    }));
    _t(s, "getBehavior", (function(t) {
        const e = De.keyFrom(t);
        let i = He.get(this);
        if (null == i) He.set(this, i = new ResourceLookup);
        return i[e] ?? (i[e] = this.l.get(Ht(e)));
    }));
};

const He = new WeakMap;

class ResourceLookup {}

const We = zt("IFlushQueue", (t => t.singleton(FlushQueue)));

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
            this.ot.forEach(ze);
        } finally {
            this.rt = false;
        }
    }
    clear() {
        this.ot.clear();
        this.rt = false;
    }
}

function ze(t, e, i) {
    i.delete(t);
    t.flush();
}

const Ge = new WeakSet;

const Xe = (t, e) => {
    _t(t.prototype, "limit", (function(t) {
        if (Ge.has(this)) throw vt(`AURXXXX: a rate limit has already been applied.`);
        Ge.add(this);
        const i = e(this, t);
        const s = t.signals;
        const n = s.length > 0 ? this.get(L) : null;
        const r = this[i];
        const o = (...t) => r.call(this, ...t);
        const l = "debounce" === t.type ? Ke(t, o, this) : Qe(t, o, this);
        const h = n ? {
            handleChange: l.flush
        } : null;
        this[i] = l;
        if (n) s.forEach((t => $t(n, t, h)));
        return {
            dispose: () => {
                if (n) s.forEach((t => Ut(n, t, h)));
                Ge.delete(this);
                l.dispose();
                delete this[i];
            }
        };
    }));
};

const Ke = (t, e, i) => {
    let s;
    let n;
    let r;
    let o = false;
    const l = t.queue;
    const h = () => e(r);
    const a = e => {
        r = e;
        if (i.isBound) {
            n = s;
            s = l.queueTask(h, {
                delay: t.delay,
                reusable: false
            });
            n?.cancel();
        } else h();
    };
    const c = a.dispose = () => {
        n?.cancel();
        s?.cancel();
        n = s = void 0;
    };
    a.flush = () => {
        o = 0 === s?.status;
        c();
        if (o) h();
    };
    return a;
};

const Qe = (t, e, i) => {
    let s;
    let n;
    let r = 0;
    let o = 0;
    let l;
    let h = false;
    const a = t.queue;
    const c = () => t.now();
    const u = () => e(l);
    const f = e => {
        l = e;
        if (i.isBound) {
            o = c() - r;
            n = s;
            if (o > t.delay) {
                r = c();
                u();
            } else s = a.queueTask((() => {
                r = c();
                u();
            }), {
                delay: t.delay - o,
                reusable: false
            });
            n?.cancel();
        } else u();
    };
    const d = f.dispose = () => {
        n?.cancel();
        s?.cancel();
        n = s = void 0;
    };
    f.flush = () => {
        h = 0 === s?.status;
        d();
        if (h) u();
    };
    return f;
};

const Ye = {
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
                }), Ye);
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

Ne(AttributeBinding);

Xe(AttributeBinding, (() => "updateTarget"));

E(AttributeBinding);

je(true)(AttributeBinding);

const Ze = {
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
            }), Ze);
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

Ne(InterpolationPartBinding);

Xe(InterpolationPartBinding, (() => "updateTarget"));

E(InterpolationPartBinding);

je(true)(InterpolationPartBinding);

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
        }), Ze);
        e?.cancel();
    }
}

Ne(ContentBinding);

Xe(ContentBinding, (() => "updateTarget"));

E()(ContentBinding);

je(void 0, false)(ContentBinding);

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

Ne(LetBinding);

Xe(LetBinding, (() => "updateTarget"));

E(LetBinding);

je(true)(LetBinding);

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
            Je = this.lt;
            this.lt = this.ct.queueTask((() => {
                this.updateTarget(t);
                this.lt = null;
            }), ti);
            Je?.cancel();
            Je = null;
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
            s.subscribe(this.vt ?? (this.vt = new BindingTargetSubscriber(this, this.l.get(We))));
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

Ne(PropertyBinding);

Xe(PropertyBinding, (t => 4 & t.mode ? "updateSource" : "updateTarget"));

E(PropertyBinding);

je(true, false)(PropertyBinding);

let Je = null;

const ti = {
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

je(false)(RefBinding);

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

Ne(ListenerBinding);

Xe(ListenerBinding, (() => "callSource"));

je(true, true)(ListenerBinding);

const ei = zt("IAppTask");

class $AppTask {
    constructor(t, e, i) {
        this.c = void 0;
        this.slot = t;
        this.k = e;
        this.cb = i;
    }
    register(t) {
        return this.c = t.register(Kt(ei, this));
    }
    run() {
        const t = this.k;
        const e = this.cb;
        return null === t ? e() : e(this.c.get(t));
    }
}

const ii = wt({
    creating: si("creating"),
    hydrating: si("hydrating"),
    hydrated: si("hydrated"),
    activating: si("activating"),
    activated: si("activated"),
    deactivating: si("deactivating"),
    deactivated: si("deactivated")
});

function si(t) {
    function e(e, i) {
        if (Rt(i)) return new $AppTask(t, e, i);
        return new $AppTask(t, null, e);
    }
    return e;
}

function ni(t, e) {
    if (null == t) throw vt(`AUR0772`);
    return function i(s, n, r) {
        const o = null == n;
        const l = o ? s : s.constructor;
        const h = new WatchDefinition(t, o ? e : r.value);
        if (o) {
            if (!Rt(e) && (null == e || !(e in l.prototype))) throw vt(`AUR0773:${mt(e)}@${l.name}}`);
        } else if (!Rt(r?.value)) throw vt(`AUR0774:${mt(n)}`);
        li.add(l, h);
        if (di(l)) pi(l).watches.push(h);
        if (Ks(l)) Zs(l).watches.push(h);
    };
}

class WatchDefinition {
    constructor(t, e) {
        this.expression = t;
        this.callback = e;
    }
}

const ri = l;

const oi = ht("watch");

const li = wt({
    name: oi,
    add(t, e) {
        let i = st(oi, t);
        if (null == i) rt(oi, i = [], t);
        i.push(e);
    },
    getAnnotation(t) {
        return st(oi, t) ?? ri;
    }
});

function hi(t) {
    return function(e) {
        return gi(t, e);
    };
}

function ai(t) {
    return function(e) {
        return gi(It(t) ? {
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
        return new CustomAttributeDefinition(e, i(fi(e, "name"), s), a(fi(e, "aliases"), n.aliases, e.aliases), ui(s), i(fi(e, "defaultBindingMode"), n.defaultBindingMode, e.defaultBindingMode, 2), i(fi(e, "isTemplateController"), n.isTemplateController, e.isTemplateController, false), Ft.from(e, ...Ft.getAll(e), fi(e, "bindables"), e.bindables, n.bindables), i(fi(e, "noMultiBindings"), n.noMultiBindings, e.noMultiBindings, false), a(li.getAnnotation(e), e.watches), a(fi(e, "dependencies"), n.dependencies, e.dependencies));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        Qt(i, e).register(t);
        Xt(i, e).register(t);
        Jt(s, vi, i, t);
    }
}

const ci = at("custom-attribute");

const ui = t => `${ci}:${t}`;

const fi = (t, e) => st(ht(e), t);

const di = t => Rt(t) && nt(ci, t);

const mi = (t, e) => xs(t, ui(e)) ?? void 0;

const gi = (t, e) => {
    const i = CustomAttributeDefinition.create(t, e);
    rt(ci, i, i.Type);
    rt(ci, i, i);
    ct(e, ci);
    return i.Type;
};

const pi = t => {
    const e = st(ci, t);
    if (void 0 === e) throw vt(`AUR0759:${t.name}`);
    return e;
};

const vi = wt({
    name: ci,
    keyFrom: ui,
    isType: di,
    for: mi,
    define: gi,
    getDefinition: pi,
    annotate(t, e, i) {
        rt(ht(e), i, t);
    },
    getAnnotation: fi
});

const xi = c;

const wi = (t, e, i, s) => {
    t.addEventListener(e, i, s);
};

const bi = (t, e, i, s) => {
    t.removeEventListener(e, i, s);
};

const yi = t => {
    let e;
    const i = t.prototype;
    _t(i, "subscribe", (function(t) {
        if (this.subs.add(t) && 1 === this.subs.count) {
            for (e of this.cf.events) wi(this.wt, e, this);
            this.bt = true;
            this.yt?.();
        }
    }));
    _t(i, "unsubscribe", (function(t) {
        if (this.subs.remove(t) && 0 === this.subs.count) {
            for (e of this.cf.events) bi(this.wt, e, this);
            this.bt = false;
            this.kt?.();
        }
    }));
    _t(i, "useConfig", (function(t) {
        this.cf = t;
        if (this.bt) {
            for (e of this.cf.events) bi(this.wt, e, this);
            for (e of this.cf.events) wi(this.wt, e, this);
        }
    }));
};

const ki = t => {
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
            const i = Ai(t);
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

function Ai(t) {
    if (It(t)) return Ci(t);
    if ("object" !== typeof t) return l;
    if (t instanceof Array) {
        const e = t.length;
        if (e > 0) {
            const i = [];
            let s = 0;
            for (;e > s; ++s) i.push(...Ai(t[s]));
            return i;
        } else return l;
    }
    const e = [];
    let i;
    for (i in t) if (Boolean(t[i])) if (i.includes(" ")) e.push(...Ci(i)); else e.push(i);
    return e;
}

function Ci(t) {
    const e = t.match(/\S+/g);
    if (null === e) return l;
    return e;
}

ki(ClassAttributeAccessor);

function Bi(...t) {
    return new CSSModulesProcessorRegistry(t);
}

class CSSModulesProcessorRegistry {
    constructor(t) {
        this.modules = t;
    }
    register(t) {
        var e;
        const i = bt({}, ...this.modules);
        const s = gi({
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
        }, e.inject = [ bs ], e));
        t.register(s, Kt(As, i));
    }
}

function Si(...t) {
    return new ShadowDOMRegistry(t);
}

const Ri = zt("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
    if (AdoptedStyleSheetsStyles.supported(t.get(xi))) return t.get(AdoptedStyleSheetsStylesFactory);
    return t.get(StyleElementStylesFactory);
}))));

class ShadowDOMRegistry {
    constructor(t) {
        this.css = t;
    }
    register(t) {
        const e = t.get(Ti);
        const i = t.get(Ri);
        t.register(Kt(Ii, i.createStyles(this.css, e)));
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

AdoptedStyleSheetsStylesFactory.inject = [ xi ];

class StyleElementStylesFactory {
    constructor(t) {
        this.p = t;
    }
    createStyles(t, e) {
        return new StyleElementStyles(this.p, t, e);
    }
}

StyleElementStylesFactory.inject = [ xi ];

const Ii = zt("IShadowDOMStyles");

const Ti = zt("IShadowDOMGlobalStyles", (t => t.instance({
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

const Li = {
    shadowDOM(t) {
        return ii.creating(u, (e => {
            if (null != t.sharedStyles) {
                const i = e.get(Ri);
                e.register(Kt(Ti, i.createStyles(t.sharedStyles, null)));
            }
        }));
    }
};

const {enter: Ei, exit: Pi} = U;

const {wrap: _i, unwrap: $i} = q;

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
            Ei(this);
            return this.v = $i(this.$get.call(void 0, this.useProxy ? _i(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            Pi(this);
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

je(true)(ExpressionWatcher);

const Ui = zt("ILifecycleHooks");

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
        Gt(Ui, this.Type).register(t);
    }
}

const qi = new WeakMap;

const Di = ht("lifecycle-hooks");

const Mi = wt({
    name: Di,
    define(t, e) {
        const i = LifecycleHooksDefinition.create(t, e);
        rt(Di, i, e);
        ct(e, Di);
        return i.Type;
    },
    resolve(t) {
        let e = qi.get(t);
        if (void 0 === e) {
            qi.set(t, e = new LifecycleHooksLookupImpl);
            const i = t.root;
            const s = i.id === t.id ? t.getAll(Ui) : t.has(Ui, false) ? i.getAll(Ui).concat(t.getAll(Ui)) : i.getAll(Ui);
            let n;
            let r;
            let o;
            let l;
            let h;
            for (n of s) {
                r = st(Di, n.constructor);
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

function Fi() {
    return function t(e) {
        return Mi.define({}, e);
    };
}

const Oi = zt("IViewFactory");

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

const Vi = zt("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.Tt ?? (this.Tt = this.Lt.getAll(mn, false).reduce(((t, e) => {
            t[e.target] = e;
            return t;
        }), pt()));
    }
    constructor(t) {
        this.Et = new WeakMap;
        this.Pt = new WeakMap;
        const e = t.root;
        this.p = (this.Lt = e).get(xi);
        this.ep = e.get(D);
        this.oL = e.get(M);
        this._t = new FragmentNodeSequence(this.p, this.p.document.createDocumentFragment());
    }
    compile(t, e, i) {
        if (false !== t.needsCompile) {
            const s = this.Et;
            const n = e.get(dn);
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

var Ni;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["host"] = 1] = "host";
    t[t["shadowRoot"] = 2] = "shadowRoot";
    t[t["location"] = 3] = "location";
})(Ni || (Ni = {}));

const ji = {
    optional: true
};

const Hi = new WeakMap;

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
        this.r = t.root.get(Vi);
    }
    static getCached(t) {
        return Hi.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (void 0 === e) throw vt(`AUR0500:${t}`);
        return e;
    }
    static $el(t, e, i, s, n = void 0, r = null) {
        if (Hi.has(e)) return Hi.get(e);
        n = n ?? Zs(e.constructor);
        const o = new Controller(t, 0, n, null, e, i, r);
        const l = t.get(f(ss));
        if (n.dependencies.length > 0) t.register(...n.dependencies);
        Yt(t, ss, new d("IHydrationContext", new HydrationContext(o, s, l)));
        Hi.set(e, o);
        if (null == s || false !== s.hydrate) o.hE(s, l);
        return o;
    }
    static $attr(t, e, i, s) {
        if (Hi.has(e)) return Hi.get(e);
        s = s ?? pi(e.constructor);
        const n = new Controller(t, 1, s, null, e, i, null);
        if (s.dependencies.length > 0) t.register(...s.dependencies);
        Hi.set(e, n);
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
        if (n.watches.length > 0) Ki(this, i, n, s);
        zi(this, n, s);
        if (this.Ut.hasDefine) {
            const t = s.define(this, e, n);
            if (void 0 !== t && t !== n) n = CustomElementDefinition.getOrCreate(t);
        }
        this.$t = Mi.resolve(i);
        n.register(i);
        if (null !== n.injectable) Yt(i, n.injectable, new d("definition.injectable", s));
        if (null == t || false !== t.hydrate) {
            this.hS(t);
            this.hC();
        }
    }
    hS(t) {
        if (null != this.$t.hydrating) this.$t.hydrating.forEach(os, this);
        if (this.Ut.hasHydrating) this.qt.hydrating(this);
        const e = this.jt = this.r.compile(this.definition, this.container, t);
        const {shadowOptions: i, isStrictBinding: s, hasSlots: n, containerless: r} = e;
        let o = this.location;
        this.isStrictBinding = s;
        if (null !== (this.hostController = Qs(this.host, ji))) {
            this.host = this.container.root.get(xi).document.createElement(this.definition.name);
            if (r && null == o) o = this.location = Rs(this.host);
        }
        ws(this.host, Hs, this);
        ws(this.host, this.definition.key, this);
        if (null !== i || n) {
            if (null != o) throw vt(`AUR0501`);
            ws(this.shadowRoot = this.host.attachShadow(i ?? Zi), Hs, this);
            ws(this.shadowRoot, this.definition.key, this);
            this.mountTarget = 2;
        } else if (null != o) {
            ws(o, Hs, this);
            ws(o, this.definition.key, this);
            this.mountTarget = 3;
        } else this.mountTarget = 1;
        this.qt.$controller = this;
        this.nodes = this.r.createNodes(e);
        if (void 0 !== this.$t.hydrated) this.$t.hydrated.forEach(ls, this);
        if (this.Ut.hasHydrated) this.qt.hydrated(this);
    }
    hC() {
        this.r.render(this, this.nodes.findTargets(), this.jt, this.host);
        if (void 0 !== this.$t.created) this.$t.created.forEach(rs, this);
        if (this.Ut.hasCreated) this.qt.created(this);
    }
    Vt() {
        const t = this.definition;
        const e = this.qt;
        if (t.watches.length > 0) Ki(this, this.container, t, e);
        zi(this, t, e);
        e.$controller = this;
        this.$t = Mi.resolve(this.container);
        if (void 0 !== this.$t.created) this.$t.created.forEach(rs, this);
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
            throw vt(`AUR0503:${this.name} ${es(this.state)}`);
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
        if (2 !== this.vmKind && null != this.$t.binding) s = m(...this.$t.binding.map(hs, this));
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
        if (2 !== this.vmKind && null != this.$t.bound) i = m(...this.$t.bound.map(as, this));
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
                const e = t.has(Ii, false) ? t.get(Ii) : t.get(Ti);
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
        if (2 !== this.vmKind && null != this.$t.attaching) e = m(...this.$t.attaching.map(cs, this));
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
            throw vt(`AUR0505:${this.name} ${es(this.state)}`);
        }
        this.$initiator = t;
        if (t === this) this.Qt();
        let i = 0;
        let s;
        if (null !== this.children) for (i = 0; i < this.children.length; ++i) void this.children[i].deactivate(t, this);
        if (2 !== this.vmKind && null != this.$t.detaching) s = m(...this.$t.detaching.map(fs, this));
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
            ms = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            ms();
            ms = void 0;
        }
    }
    zt(t) {
        if (void 0 !== this.$promise) {
            gs = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            gs(t);
            gs = void 0;
        }
        if (this.$initiator !== this) this.parent.zt(t);
    }
    Ht() {
        ++this.Mt;
        if (this.$initiator !== this) this.parent.Ht();
    }
    Kt() {
        if (0 === --this.Mt) {
            if (2 !== this.vmKind && null != this.$t.attached) ps = m(...this.$t.attached.map(us, this));
            if (this.Ut.hasAttached) ps = m(ps, this.qt.attached(this.$initiator));
            if (Bt(ps)) {
                this.Wt();
                ps.then((() => {
                    this.state = 2;
                    this.Zt();
                    if (this.$initiator !== this) this.parent.Kt();
                })).catch((t => {
                    this.zt(t);
                }));
                ps = void 0;
                return;
            }
            ps = void 0;
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
                if (2 !== t.vmKind && null != t.$t.unbinding) e = m(...t.$t.unbinding.map(ds, this));
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
            return pi(this.qt.constructor).name === t;

          case 0:
            return Zs(this.qt.constructor).name === t;

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
            ws(t, Hs, this);
            ws(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = 1;
        return this;
    }
    setShadowRoot(t) {
        if (0 === this.vmKind) {
            ws(t, Hs, this);
            ws(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = 2;
        return this;
    }
    setLocation(t) {
        if (0 === this.vmKind) {
            ws(t, Hs, this);
            ws(t, this.definition.key, this);
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
            this.children.forEach(ns);
            this.children = null;
        }
        this.hostController = null;
        this.scope = null;
        this.nodes = null;
        this.location = null;
        this.viewFactory = null;
        if (null !== this.qt) {
            Hi.delete(this.qt);
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

function Wi(t) {
    let e = t.$observers;
    if (void 0 === e) Reflect.defineProperty(t, "$observers", {
        enumerable: false,
        value: e = {}
    });
    return e;
}

function zi(t, e, i) {
    const s = e.bindables;
    const n = yt(s);
    const r = n.length;
    if (r > 0) {
        let e;
        let o;
        let l = 0;
        const h = Wi(i);
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

const Gi = new Map;

const Xi = t => {
    let e = Gi.get(t);
    if (null == e) {
        e = new V(t, 0);
        Gi.set(t, e);
    }
    return e;
};

function Ki(t, e, i, s) {
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
            u = It(a) ? r.parse(a, 16) : Xi(a);
            t.addBinding(new ExpressionWatcher(l, e, n, u, c));
        }
    }
}

function Qi(t) {
    return t instanceof Controller && 0 === t.vmKind;
}

function Yi(t) {
    return R(t) && Ks(t.constructor);
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

const Zi = {
    mode: "open"
};

var Ji;

(function(t) {
    t[t["customElement"] = 0] = "customElement";
    t[t["customAttribute"] = 1] = "customAttribute";
    t[t["synthetic"] = 2] = "synthetic";
})(Ji || (Ji = {}));

var ts;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["activating"] = 1] = "activating";
    t[t["activated"] = 2] = "activated";
    t[t["deactivating"] = 4] = "deactivating";
    t[t["deactivated"] = 8] = "deactivated";
    t[t["released"] = 16] = "released";
    t[t["disposed"] = 32] = "disposed";
})(ts || (ts = {}));

function es(t) {
    const e = [];
    if (1 === (1 & t)) e.push("activating");
    if (2 === (2 & t)) e.push("activated");
    if (4 === (4 & t)) e.push("deactivating");
    if (8 === (8 & t)) e.push("deactivated");
    if (16 === (16 & t)) e.push("released");
    if (32 === (32 & t)) e.push("disposed");
    return 0 === e.length ? "none" : e.join("|");
}

const is = zt("IController");

const ss = zt("IHydrationContext");

class HydrationContext {
    constructor(t, e, i) {
        this.instruction = e;
        this.parent = i;
        this.controller = t;
    }
}

function ns(t) {
    t.dispose();
}

function rs(t) {
    t.instance.created(this.qt, this);
}

function os(t) {
    t.instance.hydrating(this.qt, this);
}

function ls(t) {
    t.instance.hydrated(this.qt, this);
}

function hs(t) {
    return t.instance.binding(this.qt, this["$initiator"], this.parent);
}

function as(t) {
    return t.instance.bound(this.qt, this["$initiator"], this.parent);
}

function cs(t) {
    return t.instance.attaching(this.qt, this["$initiator"], this.parent);
}

function us(t) {
    return t.instance.attached(this.qt, this["$initiator"]);
}

function fs(t) {
    return t.instance.detaching(this.qt, this["$initiator"], this.parent);
}

function ds(t) {
    return t.instance.unbinding(this.qt, this["$initiator"], this.parent);
}

let ms;

let gs;

let ps;

const vs = zt("IAppRoot");

class AppRoot {
    constructor(t, e, i, s) {
        this.config = t;
        this.platform = e;
        this.container = i;
        this.controller = void 0;
        this.ee = void 0;
        this.host = t.host;
        s.prepare(this);
        Yt(i, e.HTMLElement, Yt(i, e.Element, Yt(i, bs, new d("ElementResolver", t.host))));
        this.ee = g(this.ie("creating"), (() => {
            const e = t.component;
            const s = i.createChild();
            let n;
            if (Ks(e)) n = this.container.get(e); else n = t.component;
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
        return m(...this.container.getAll(ei).reduce(((e, i) => {
            if (i.slot === t) e.push(i.run());
            return e;
        }), []));
    }
    dispose() {
        this.controller?.dispose();
    }
}

class Refs {}

function xs(t, e) {
    return t.$au?.[e] ?? null;
}

function ws(t, e, i) {
    var s;
    ((s = t).$au ?? (s.$au = new Refs))[e] = i;
}

const bs = zt("INode");

const ys = zt("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(vs, true)) return t.get(vs).host;
    return t.get(xi).document;
}))));

const ks = zt("IRenderLocation");

const As = zt("CssModules");

const Cs = new WeakMap;

function Bs(t) {
    if (Cs.has(t)) return Cs.get(t);
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
        const e = Qs(t);
        if (void 0 === e) return null;
        if (2 === e.mountTarget) return Bs(e.host);
    }
    return t.parentNode;
}

function Ss(t, e) {
    if (void 0 !== t.platform && !(t instanceof t.platform.Node)) {
        const i = t.childNodes;
        for (let t = 0, s = i.length; t < s; ++t) Cs.set(i[t], e);
    } else Cs.set(t, e);
}

function Rs(t) {
    if (Is(t)) return t;
    const e = t.ownerDocument.createComment("au-end");
    const i = e.$start = t.ownerDocument.createComment("au-start");
    const s = t.parentNode;
    if (null !== s) {
        s.replaceChild(e, t);
        s.insertBefore(i, e);
    }
    return e;
}

function Is(t) {
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
            if ("AU-M" === r.nodeName) o[s] = Se(r); else o[s] = r;
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
        if (Is(t)) this.ref = t; else {
            this.next = t;
            this.le();
        }
    }
    le() {
        if (void 0 !== this.next) this.ref = this.next.firstChild; else this.ref = void 0;
    }
}

const Ts = zt("IWindow", (t => t.callback((t => t.get(xi).window))));

const Ls = zt("ILocation", (t => t.callback((t => t.get(Ts).location))));

const Es = zt("IHistory", (t => t.callback((t => t.get(Ts).history))));

function Ps(t) {
    return function(e) {
        return Xs(t, e);
    };
}

function _s(t) {
    if (void 0 === t) return function(t) {
        Gs(t, "shadowOptions", {
            mode: "open"
        });
    };
    if (!Rt(t)) return function(e) {
        Gs(e, "shadowOptions", t);
    };
    Gs(t, "shadowOptions", {
        mode: "open"
    });
}

function $s(t) {
    if (void 0 === t) return function(t) {
        Us(t);
    };
    Us(t);
}

function Us(t) {
    const e = st(Hs, t);
    if (void 0 === e) {
        Gs(t, "containerless", true);
        return;
    }
    e.containerless = true;
}

function qs(t) {
    if (void 0 === t) return function(t) {
        Gs(t, "isStrictBinding", true);
    };
    Gs(t, "isStrictBinding", true);
}

const Ds = new WeakMap;

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
            const s = p("name", i, zs);
            if (Rt(i.Type)) e = i.Type; else e = tn(v(s));
            return new CustomElementDefinition(e, s, a(i.aliases), p("key", i, (() => Ws(s))), p("cache", i, Fs), p("capture", i, Vs), p("template", i, Os), a(i.instructions), a(i.dependencies), p("injectable", i, Os), p("needsCompile", i, Ns), a(i.surrogates), Ft.from(e, i.bindables), p("containerless", i, Vs), p("isStrictBinding", i, Vs), p("shadowOptions", i, Os), p("hasSlots", i, Vs), p("enhance", i, Vs), p("watches", i, js), x("processContent", e, Os));
        }
        if (It(t)) return new CustomElementDefinition(e, t, a(Ys(e, "aliases"), e.aliases), Ws(t), x("cache", e, Fs), x("capture", e, Vs), x("template", e, Os), a(Ys(e, "instructions"), e.instructions), a(Ys(e, "dependencies"), e.dependencies), x("injectable", e, Os), x("needsCompile", e, Ns), a(Ys(e, "surrogates"), e.surrogates), Ft.from(e, ...Ft.getAll(e), Ys(e, "bindables"), e.bindables), x("containerless", e, Vs), x("isStrictBinding", e, Vs), x("shadowOptions", e, Os), x("hasSlots", e, Vs), x("enhance", e, Vs), a(li.getAnnotation(e), e.watches), x("processContent", e, Os));
        const i = p("name", t, zs);
        return new CustomElementDefinition(e, i, a(Ys(e, "aliases"), t.aliases, e.aliases), Ws(i), w("cache", t, e, Fs), w("capture", t, e, Vs), w("template", t, e, Os), a(Ys(e, "instructions"), t.instructions, e.instructions), a(Ys(e, "dependencies"), t.dependencies, e.dependencies), w("injectable", t, e, Os), w("needsCompile", t, e, Ns), a(Ys(e, "surrogates"), t.surrogates, e.surrogates), Ft.from(e, ...Ft.getAll(e), Ys(e, "bindables"), e.bindables, t.bindables), w("containerless", t, e, Vs), w("isStrictBinding", t, e, Vs), w("shadowOptions", t, e, Os), w("hasSlots", t, e, Vs), w("enhance", t, e, Vs), a(t.watches, li.getAnnotation(e), e.watches), w("processContent", t, e, Os));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) return t;
        if (Ds.has(t)) return Ds.get(t);
        const e = CustomElementDefinition.create(t);
        Ds.set(t, e);
        rt(Hs, e, e.Type);
        return e;
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        if (!t.has(i, false)) {
            Qt(i, e).register(t);
            Xt(i, e).register(t);
            Jt(s, en, i, t);
        }
    }
}

const Ms = {
    name: void 0,
    searchParents: false,
    optional: false
};

const Fs = () => 0;

const Os = () => null;

const Vs = () => false;

const Ns = () => true;

const js = () => l;

const Hs = at("custom-element");

const Ws = t => `${Hs}:${t}`;

const zs = (() => {
    let t = 0;
    return () => `unnamed-${++t}`;
})();

const Gs = (t, e, i) => {
    rt(ht(e), i, t);
};

const Xs = (t, e) => {
    const i = CustomElementDefinition.create(t, e);
    rt(Hs, i, i.Type);
    rt(Hs, i, i);
    ct(i.Type, Hs);
    return i.Type;
};

const Ks = t => Rt(t) && nt(Hs, t);

const Qs = (t, e = Ms) => {
    if (void 0 === e.name && true !== e.searchParents) {
        const i = xs(t, Hs);
        if (null === i) {
            if (true === e.optional) return null;
            throw vt(`AUR0762`);
        }
        return i;
    }
    if (void 0 !== e.name) {
        if (true !== e.searchParents) {
            const i = xs(t, Hs);
            if (null === i) throw vt(`AUR0763`);
            if (i.is(e.name)) return i;
            return;
        }
        let i = t;
        let s = false;
        while (null !== i) {
            const t = xs(i, Hs);
            if (null !== t) {
                s = true;
                if (t.is(e.name)) return t;
            }
            i = Bs(i);
        }
        if (s) return;
        throw vt(`AUR0764`);
    }
    let i = t;
    while (null !== i) {
        const t = xs(i, Hs);
        if (null !== t) return t;
        i = Bs(i);
    }
    throw vt(`AUR0765`);
};

const Ys = (t, e) => st(ht(e), t);

const Zs = t => {
    const e = st(Hs, t);
    if (void 0 === e) throw vt(`AUR0760:${t.name}`);
    return e;
};

const Js = () => {
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

const tn = function() {
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

const en = wt({
    name: Hs,
    keyFrom: Ws,
    isType: Ks,
    for: Qs,
    define: Xs,
    getDefinition: Zs,
    annotate: Gs,
    getAnnotation: Ys,
    generateName: zs,
    createInjectable: Js,
    generateType: tn
});

const sn = ht("processContent");

function nn(t) {
    return void 0 === t ? function(t, e, i) {
        rt(sn, rn(t, e), t);
    } : function(e) {
        t = rn(e, t);
        const i = st(Hs, e);
        if (void 0 !== i) i.processContent = t; else rt(sn, t, e);
        return e;
    };
}

function rn(t, e) {
    if (It(e)) e = t[e];
    if (!Rt(e)) throw vt(`AUR0766:${typeof e}`);
    return e;
}

function on(t) {
    return function(e) {
        const i = Rt(t) ? t : true;
        Gs(e, "capture", i);
        if (Ks(e)) Zs(e).capture = i;
    };
}

const ln = zt("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

const hn = zt("IAuSlotWatcher");

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
}

I(AuSlotWatcherBinding);

class SlottedLifecycleHooks {
    constructor(t) {
        this.def = t;
    }
    register(t) {
        Kt(Ui, this).register(t);
    }
    hydrating(t, e) {
        const i = this.def;
        const s = AuSlotWatcherBinding.create(e, i.name, i.callback ?? `${mt(i.name)}Changed`, i.slotName ?? "default", i.query ?? "*");
        Kt(hn, s).register(e.container);
        e.addBinding(s);
    }
}

Fi()(SlottedLifecycleHooks);

function an(t, e) {
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
        let h = en.getAnnotation(l, i);
        if (null == h) en.annotate(l, i, h = []);
        h.push(new SlottedLifecycleHooks(o));
    }
    return s;
}

var cn;

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
})(cn || (cn = {}));

const un = zt("Instruction");

function fn(t) {
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

const dn = zt("ITemplateCompiler");

const mn = zt("IRenderer");

function gn(t) {
    return function e(i) {
        i.register = function(t) {
            Gt(mn, this).register(t);
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

function pn(t, e, i) {
    if (It(e)) return t.parse(e, i);
    return e;
}

function vn(t) {
    if (null != t.viewModel) return t.viewModel;
    return t;
}

function xn(t, e) {
    if ("element" === e) return t;
    switch (e) {
      case "controller":
        return Qs(t);

      case "view":
        throw vt(`AUR0750`);

      case "view-model":
        return Qs(t).viewModel;

      default:
        {
            const i = mi(t, e);
            if (void 0 !== i) return i.viewModel;
            const s = Qs(t, {
                name: e
            });
            if (void 0 === s) throw vt(`AUR0751:${e}`);
            return s.viewModel;
        }
    }
}

let wn = class SetPropertyRenderer {
    render(t, e, i) {
        const s = vn(e);
        if (void 0 !== s.$observers?.[i.to]) s.$observers[i.to].setValue(i.value); else s[i.to] = i.value;
    }
};

wn = et([ gn("re") ], wn);

let bn = class CustomElementRenderer {
    static get inject() {
        return [ Vi ];
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
            o = f.find(en, c);
            if (null == o) throw vt(`AUR0752:${c}@${t["name"]}`);
            break;

          default:
            o = c;
        }
        const m = i.containerless || o.containerless;
        const g = m ? Rs(e) : null;
        const p = Nn(s, t, e, i, g, null == u ? void 0 : new AuSlotsInfo(kt(u)));
        l = o.Type;
        h = p.invoke(l);
        Yt(p, l, new d(o.key, h));
        a = Controller.$el(p, h, e, i, o, g);
        ws(e, o.key, a);
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

bn = et([ gn("ra") ], bn);

let yn = class CustomAttributeRenderer {
    static get inject() {
        return [ Vi ];
    }
    constructor(t) {
        this.r = t;
    }
    render(t, e, i, s, n, r) {
        let o = t.container;
        let l;
        switch (typeof i.res) {
          case "string":
            l = o.find(vi, i.res);
            if (null == l) throw vt(`AUR0753:${i.res}@${t["name"]}`);
            break;

          default:
            l = i.res;
        }
        const h = jn(s, l, t, e, i, void 0, void 0);
        const a = Controller.$attr(h.ctn, h.vm, e, l);
        ws(e, l.key, a);
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

yn = et([ gn("rb") ], yn);

let kn = class TemplateControllerRenderer {
    static get inject() {
        return [ Vi, xi ];
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
            l = o.find(vi, i.res);
            if (null == l) throw vt(`AUR0754:${i.res}@${t["name"]}`);
            break;

          default:
            l = i.res;
        }
        const h = this.r.getViewFactory(i.def, o);
        const a = Rs(e);
        const c = jn(this.p, l, t, e, i, h, a);
        const u = Controller.$attr(c.ctn, c.vm, e, l);
        ws(a, l.key, u);
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

kn = et([ gn("rc") ], kn);

let An = class LetElementRenderer {
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
            u = pn(n, c.from, 16);
            t.addBinding(new LetBinding(h, r, u, c.to, l));
            ++f;
        }
    }
};

An = et([ gn("rd") ], An);

let Cn = class RefBindingRenderer {
    render(t, e, i, s, n) {
        t.addBinding(new RefBinding(t.container, pn(n, i.from, 16), xn(e, i.to)));
    }
};

Cn = et([ gn("rj") ], Cn);

let Bn = class InterpolationBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new InterpolationBinding(t, t.container, r, s.domWriteQueue, pn(n, i.from, 1), vn(e), i.to, 2));
    }
};

Bn = et([ gn("rf") ], Bn);

let Sn = class PropertyBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, pn(n, i.from, 16), vn(e), i.to, i.mode));
    }
};

Sn = et([ gn("rg") ], Sn);

let Rn = class IteratorBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, pn(n, i.forOf, 2), vn(e), i.to, 2));
    }
};

Rn = et([ gn("rk") ], Rn);

let In = class TextBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, s.domWriteQueue, s, pn(n, i.from, 16), ye(e.parentNode, be(s, ""), e), i.strict));
    }
};

In = et([ gn("ha") ], In);

let Tn = class ListenerBindingRenderer {
    render(t, e, i, s, n) {
        t.addBinding(new ListenerBinding(t.container, pn(n, i.from, 8), e, i.to, new ListenerBindingOptions(i.preventDefault, i.capture)));
    }
};

Tn = et([ gn("hb") ], Tn);

let Ln = class SetAttributeRenderer {
    render(t, e, i) {
        e.setAttribute(i.to, i.value);
    }
};

Ln = et([ gn("he") ], Ln);

let En = class SetClassAttributeRenderer {
    render(t, e, i) {
        qn(e.classList, i.value);
    }
};

En = et([ gn("hf") ], En);

let Pn = class SetStyleAttributeRenderer {
    render(t, e, i) {
        e.style.cssText += i.value;
    }
};

Pn = et([ gn("hg") ], Pn);

let _n = class StylePropertyBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, pn(n, i.from, 16), e.style, i.to, 2));
    }
};

_n = et([ gn("hd") ], _n);

let $n = class AttributeBindingRenderer {
    render(t, e, i, s, n, r) {
        const o = t.container;
        const l = o.has(As, false) ? o.get(As) : null;
        t.addBinding(new AttributeBinding(t, o, r, s.domWriteQueue, pn(n, i.from, 16), e, i.attr, null == l ? i.to : i.to.split(/\s/g).map((t => l[t] ?? t)).join(" "), 2));
    }
};

$n = et([ gn("hc") ], $n);

let Un = class SpreadRenderer {
    static get inject() {
        return [ dn, Vi ];
    }
    constructor(t, e) {
        this.ue = t;
        this.r = e;
    }
    render(t, e, i, s, n, r) {
        const o = t.container;
        const h = o.get(ss);
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
            const h = Dn(o);
            const f = this.ue.compileSpread(o.controller.definition, o.instruction?.captures ?? l, o.controller.container, e);
            let d;
            for (d of f) switch (d.type) {
              case "hs":
                u(i + 1);
                break;

              case "hp":
                a[d.instructions.type].render(h, Qs(e), d.instructions, s, n, r);
                break;

              default:
                a[d.type].render(h, e, d, s, n, r);
            }
            t.addBinding(h);
        };
        u(0);
    }
};

Un = et([ gn("hs") ], Un);

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
}

function qn(t, e) {
    const i = e.length;
    let s = 0;
    for (let n = 0; n < i; ++n) if (32 === e.charCodeAt(n)) {
        if (n !== s) t.add(e.slice(s, n));
        s = n + 1;
    } else if (n + 1 === i) t.add(e.slice(s));
}

const Dn = t => new SpreadBinding([], t);

const Mn = "IController";

const Fn = "IInstruction";

const On = "IRenderLocation";

const Vn = "ISlotsInfo";

function Nn(t, e, i, s, n, r) {
    const o = e.container.createChild();
    Yt(o, t.HTMLElement, Yt(o, t.Element, Yt(o, bs, new d("ElementResolver", i))));
    Yt(o, is, new d(Mn, e));
    Yt(o, un, new d(Fn, s));
    Yt(o, ks, null == n ? Hn : new RenderLocationProvider(n));
    Yt(o, Oi, Wn);
    Yt(o, ln, null == r ? zn : new d(Vn, r));
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

function jn(t, e, i, s, n, r, o, l) {
    const h = i.container.createChild();
    Yt(h, t.HTMLElement, Yt(h, t.Element, Yt(h, bs, new d("ElementResolver", s))));
    i = i instanceof Controller ? i : i.ctrl;
    Yt(h, is, new d(Mn, i));
    Yt(h, un, new d(Fn, n));
    Yt(h, ks, null == o ? Hn : new d(On, o));
    Yt(h, Oi, null == r ? Wn : new ViewFactoryProvider(r));
    Yt(h, ln, null == l ? zn : new d(Vn, l));
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

const Hn = new RenderLocationProvider(null);

const Wn = new ViewFactoryProvider(null);

const zn = new d(Vn, new AuSlotsInfo(l));

var Gn;

(function(t) {
    t[t["None"] = 0] = "None";
    t[t["IgnoreAttr"] = 1] = "IgnoreAttr";
})(Gn || (Gn = {}));

function Xn(t) {
    return function(e) {
        return Zn.define(t, e);
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
        return new BindingCommandDefinition(e, i(Yn(e, "name"), s), a(Yn(e, "aliases"), n.aliases, e.aliases), Qn(s), i(Yn(e, "type"), n.type, e.type, null));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        Gt(i, e).register(t);
        Xt(i, e).register(t);
        Jt(s, Zn, i, t);
    }
}

const Kn = at("binding-command");

const Qn = t => `${Kn}:${t}`;

const Yn = (t, e) => st(ht(e), t);

const Zn = wt({
    name: Kn,
    keyFrom: Qn,
    define(t, e) {
        const i = BindingCommandDefinition.create(t, e);
        rt(Kn, i, i.Type);
        rt(Kn, i, i);
        ct(e, Kn);
        return i.Type;
    },
    getAnnotation: Yn
});

let Jn = class OneTimeBindingCommand {
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

Jn = et([ Xn("one-time") ], Jn);

let tr = class ToViewBindingCommand {
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

tr = et([ Xn("to-view") ], tr);

let er = class FromViewBindingCommand {
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

er = et([ Xn("from-view") ], er);

let ir = class TwoWayBindingCommand {
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

ir = et([ Xn("two-way") ], ir);

let sr = class DefaultBindingCommand {
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

sr = et([ Xn("bind") ], sr);

let nr = class ForBindingCommand {
    get type() {
        return 0;
    }
    static get inject() {
        return [ ne ];
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

nr = et([ Xn("for") ], nr);

let rr = class TriggerBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, 8), t.attr.target, true, false);
    }
};

rr = et([ Xn("trigger") ], rr);

let or = class CaptureBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, 8), t.attr.target, false, true);
    }
};

or = et([ Xn("capture") ], or);

let lr = class AttrBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction(t.attr.target, e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

lr = et([ Xn("attr") ], lr);

let hr = class StyleBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction("style", e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

hr = et([ Xn("style") ], hr);

let ar = class ClassBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction("class", e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

ar = et([ Xn("class") ], ar);

let cr = class RefBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new RefBindingInstruction(e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

cr = et([ Xn("ref") ], cr);

let ur = class SpreadBindingCommand {
    get type() {
        return 1;
    }
    build(t) {
        return new SpreadBindingInstruction;
    }
};

ur = et([ Xn("...$attrs") ], ur);

const fr = zt("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

const dr = t => {
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
        return Gt(fr, this).register(t);
    }
    constructor(t) {
        this.ge = bt(pt(), {
            a: dr("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage target transform xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            altGlyph: dr("class dx dy externalResourcesRequired format glyphRef id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            altglyph: pt(),
            altGlyphDef: dr("id xml:base xml:lang xml:space"),
            altglyphdef: pt(),
            altGlyphItem: dr("id xml:base xml:lang xml:space"),
            altglyphitem: pt(),
            animate: dr("accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            animateColor: dr("accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            animateMotion: dr("accumulate additive begin by calcMode dur end externalResourcesRequired fill from id keyPoints keySplines keyTimes max min onbegin onend onload onrepeat origin path repeatCount repeatDur requiredExtensions requiredFeatures restart rotate systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            animateTransform: dr("accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to type values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            circle: dr("class cx cy externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup r requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            clipPath: dr("class clipPathUnits externalResourcesRequired id requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            "color-profile": dr("id local name rendering-intent xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            cursor: dr("externalResourcesRequired id requiredExtensions requiredFeatures systemLanguage x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            defs: dr("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            desc: dr("class id style xml:base xml:lang xml:space"),
            ellipse: dr("class cx cy externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rx ry style systemLanguage transform xml:base xml:lang xml:space"),
            feBlend: dr("class height id in in2 mode result style width x xml:base xml:lang xml:space y"),
            feColorMatrix: dr("class height id in result style type values width x xml:base xml:lang xml:space y"),
            feComponentTransfer: dr("class height id in result style width x xml:base xml:lang xml:space y"),
            feComposite: dr("class height id in in2 k1 k2 k3 k4 operator result style width x xml:base xml:lang xml:space y"),
            feConvolveMatrix: dr("bias class divisor edgeMode height id in kernelMatrix kernelUnitLength order preserveAlpha result style targetX targetY width x xml:base xml:lang xml:space y"),
            feDiffuseLighting: dr("class diffuseConstant height id in kernelUnitLength result style surfaceScale width x xml:base xml:lang xml:space y"),
            feDisplacementMap: dr("class height id in in2 result scale style width x xChannelSelector xml:base xml:lang xml:space y yChannelSelector"),
            feDistantLight: dr("azimuth elevation id xml:base xml:lang xml:space"),
            feFlood: dr("class height id result style width x xml:base xml:lang xml:space y"),
            feFuncA: dr("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feFuncB: dr("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feFuncG: dr("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feFuncR: dr("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feGaussianBlur: dr("class height id in result stdDeviation style width x xml:base xml:lang xml:space y"),
            feImage: dr("class externalResourcesRequired height id preserveAspectRatio result style width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            feMerge: dr("class height id result style width x xml:base xml:lang xml:space y"),
            feMergeNode: dr("id xml:base xml:lang xml:space"),
            feMorphology: dr("class height id in operator radius result style width x xml:base xml:lang xml:space y"),
            feOffset: dr("class dx dy height id in result style width x xml:base xml:lang xml:space y"),
            fePointLight: dr("id x xml:base xml:lang xml:space y z"),
            feSpecularLighting: dr("class height id in kernelUnitLength result specularConstant specularExponent style surfaceScale width x xml:base xml:lang xml:space y"),
            feSpotLight: dr("id limitingConeAngle pointsAtX pointsAtY pointsAtZ specularExponent x xml:base xml:lang xml:space y z"),
            feTile: dr("class height id in result style width x xml:base xml:lang xml:space y"),
            feTurbulence: dr("baseFrequency class height id numOctaves result seed stitchTiles style type width x xml:base xml:lang xml:space y"),
            filter: dr("class externalResourcesRequired filterRes filterUnits height id primitiveUnits style width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            font: dr("class externalResourcesRequired horiz-adv-x horiz-origin-x horiz-origin-y id style vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space"),
            "font-face": dr("accent-height alphabetic ascent bbox cap-height descent font-family font-size font-stretch font-style font-variant font-weight hanging id ideographic mathematical overline-position overline-thickness panose-1 slope stemh stemv strikethrough-position strikethrough-thickness underline-position underline-thickness unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical widths x-height xml:base xml:lang xml:space"),
            "font-face-format": dr("id string xml:base xml:lang xml:space"),
            "font-face-name": dr("id name xml:base xml:lang xml:space"),
            "font-face-src": dr("id xml:base xml:lang xml:space"),
            "font-face-uri": dr("id xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            foreignObject: dr("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform width x xml:base xml:lang xml:space y"),
            g: dr("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            glyph: dr("arabic-form class d glyph-name horiz-adv-x id lang orientation style unicode vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space"),
            glyphRef: dr("class dx dy format glyphRef id style x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            glyphref: pt(),
            hkern: dr("g1 g2 id k u1 u2 xml:base xml:lang xml:space"),
            image: dr("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage transform width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            line: dr("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform x1 x2 xml:base xml:lang xml:space y1 y2"),
            linearGradient: dr("class externalResourcesRequired gradientTransform gradientUnits id spreadMethod style x1 x2 xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space y1 y2"),
            marker: dr("class externalResourcesRequired id markerHeight markerUnits markerWidth orient preserveAspectRatio refX refY style viewBox xml:base xml:lang xml:space"),
            mask: dr("class externalResourcesRequired height id maskContentUnits maskUnits requiredExtensions requiredFeatures style systemLanguage width x xml:base xml:lang xml:space y"),
            metadata: dr("id xml:base xml:lang xml:space"),
            "missing-glyph": dr("class d horiz-adv-x id style vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space"),
            mpath: dr("externalResourcesRequired id xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            path: dr("class d externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup pathLength requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            pattern: dr("class externalResourcesRequired height id patternContentUnits patternTransform patternUnits preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage viewBox width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            polygon: dr("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup points requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            polyline: dr("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup points requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            radialGradient: dr("class cx cy externalResourcesRequired fx fy gradientTransform gradientUnits id r spreadMethod style xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space"),
            rect: dr("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rx ry style systemLanguage transform width x xml:base xml:lang xml:space y"),
            script: dr("externalResourcesRequired id type xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            set: dr("attributeName attributeType begin dur end externalResourcesRequired fill id max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            stop: dr("class id offset style xml:base xml:lang xml:space"),
            style: dr("id media title type xml:base xml:lang xml:space"),
            svg: dr("baseProfile class contentScriptType contentStyleType externalResourcesRequired height id onabort onactivate onclick onerror onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup onresize onscroll onunload onzoom preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage version viewBox width x xml:base xml:lang xml:space y zoomAndPan"),
            switch: dr("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            symbol: dr("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup preserveAspectRatio style viewBox xml:base xml:lang xml:space"),
            text: dr("class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength transform x xml:base xml:lang xml:space y"),
            textPath: dr("class externalResourcesRequired id lengthAdjust method onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures spacing startOffset style systemLanguage textLength xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space"),
            title: dr("class id style xml:base xml:lang xml:space"),
            tref: dr("class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength x xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space y"),
            tspan: dr("class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength x xml:base xml:lang xml:space y"),
            use: dr("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            view: dr("externalResourcesRequired id preserveAspectRatio viewBox viewTarget xml:base xml:lang xml:space zoomAndPan"),
            vkern: dr("g1 g2 id k u1 u2 xml:base xml:lang xml:space")
        });
        this.pe = dr("a altGlyph animate animateColor circle clipPath defs ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feFlood feGaussianBlur feImage feMerge feMorphology feOffset feSpecularLighting feTile feTurbulence filter font foreignObject g glyph glyphRef image line linearGradient marker mask missing-glyph path pattern polygon polyline radialGradient rect stop svg switch symbol text textPath tref tspan use");
        this.ve = dr("alignment-baseline baseline-shift clip-path clip-rule clip color-interpolation-filters color-interpolation color-profile color-rendering color cursor direction display dominant-baseline enable-background fill-opacity fill-rule fill filter flood-color flood-opacity font-family font-size-adjust font-size font-stretch font-style font-variant font-weight glyph-orientation-horizontal glyph-orientation-vertical image-rendering kerning letter-spacing lighting-color marker-end marker-mid marker-start mask opacity overflow pointer-events shape-rendering stop-color stop-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width stroke text-anchor text-decoration text-rendering unicode-bidi visibility word-spacing writing-mode");
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

SVGAnalyzer.inject = [ xi ];

const mr = zt("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    static get inject() {
        return [ fr ];
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
                if (void 0 !== s[r]) throw pr(r, n);
                s[r] = i[r];
            }
        }
    }
    useGlobalMapping(t) {
        const e = this.we;
        for (const i in t) {
            if (void 0 !== e[i]) throw pr(i, "*");
            e[i] = t[i];
        }
    }
    useTwoWay(t) {
        this.fns.push(t);
    }
    isTwoWay(t, e) {
        return gr(t, e) || this.fns.length > 0 && this.fns.some((i => i(t, e)));
    }
    map(t, e) {
        return this.xe[t.nodeName]?.[e] ?? this.we[e] ?? (Ct(t, e, this.svg) ? e : null);
    }
}

function gr(t, e) {
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

function pr(t, e) {
    return vt(`Attribute ${t} has been already registered for ${"*" === e ? "all elements" : `<${e}/>`}`);
}

const vr = zt("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const xr = {};

class TemplateElementFactory {
    constructor(t) {
        this.p = t;
        this.be = wr(this.p);
    }
    createTemplate(t) {
        if (It(t)) {
            let e = xr[t];
            if (void 0 === e) {
                const i = this.be;
                i.innerHTML = t;
                const s = i.content.firstElementChild;
                if (null == s || "TEMPLATE" !== s.nodeName || null != s.nextElementSibling) {
                    this.be = wr(this.p);
                    e = i;
                } else {
                    i.content.removeChild(s);
                    e = s;
                }
                xr[t] = e;
            }
            return e.cloneNode(true);
        }
        if ("TEMPLATE" !== t.nodeName) {
            const e = wr(this.p);
            e.content.appendChild(t);
            return e;
        }
        t.parentNode?.removeChild(t);
        return t.cloneNode(true);
    }
}

TemplateElementFactory.inject = [ xi ];

const wr = t => t.document.createElement("template");

class TemplateCompiler {
    constructor() {
        this.debug = false;
        this.resolveResources = true;
    }
    static register(t) {
        return Gt(dn, this).register(t);
    }
    compile(t, e, i) {
        const s = CustomElementDefinition.getOrCreate(t);
        if (null === s.template || void 0 === s.template) return s;
        if (false === s.needsCompile) return s;
        i ?? (i = Tr);
        const n = new CompilationContext(t, e, i, null, null, void 0);
        const r = It(s.template) || !t.enhance ? n.ye.createTemplate(s.template) : s.template;
        const o = r.nodeName === kr && null != r.content;
        const h = o ? r.content : r;
        const a = e.get(Wt(Fr));
        const c = a.length;
        let u = 0;
        if (c > 0) while (c > u) {
            a[u].compiling?.(r);
            ++u;
        }
        if (r.hasAttribute(qr)) throw vt(`AUR0701`);
        this.ke(h, n);
        this.Ae(h, n);
        return CustomElementDefinition.create({
            ...t,
            name: t.name || zs(),
            dependencies: (t.dependencies ?? l).concat(n.deps ?? l),
            instructions: n.rows,
            surrogates: o ? this.Ce(r, n) : l,
            template: r,
            hasSlots: n.hasSlot,
            needsCompile: false
        });
    }
    compileSpread(t, e, i, s) {
        const n = new CompilationContext(t, i, Tr, null, null, void 0);
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
                Er.node = s;
                Er.attr = u;
                Er.bindable = null;
                Er.def = null;
                r.push(x.build(Er, n.ep, n.m));
                continue;
            }
            f = n.Re(k);
            if (null !== f) {
                if (f.isTemplateController) throw vt(`AUR0703:${k}`);
                g = BindablesInfo.from(f, true);
                y = false === f.noMultiBindings && null === x && Rr(A);
                if (y) m = this.Ie(s, A, f, n); else {
                    v = g.primary;
                    if (null === x) {
                        w = h.parse(A, 1);
                        m = [ null === w ? new SetPropertyInstruction(A, v.property) : new InterpolationInstruction(w, v.property) ];
                    } else {
                        Er.node = s;
                        Er.attr = u;
                        Er.bindable = v;
                        Er.def = f;
                        m = [ x.build(Er, n.ep, n.m) ];
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
                        Er.node = s;
                        Er.attr = u;
                        Er.bindable = p;
                        Er.def = o;
                        r.push(new SpreadElementPropBindingInstruction(x.build(Er, n.ep, n.m)));
                        continue;
                    }
                }
                Er.node = s;
                Er.attr = u;
                Er.bindable = null;
                Er.def = null;
                r.push(x.build(Er, n.ep, n.m));
            }
        }
        Ir();
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
            if (Pr[w]) throw vt(`AUR0702:${h}`);
            p = e.Se(c);
            if (null !== p && (1 & p.type) > 0) {
                Er.node = t;
                Er.attr = c;
                Er.bindable = null;
                Er.def = null;
                i.push(p.build(Er, e.ep, e.m));
                continue;
            }
            u = e.Re(w);
            if (null !== u) {
                if (u.isTemplateController) throw vt(`AUR0703:${w}`);
                m = BindablesInfo.from(u, true);
                x = false === u.noMultiBindings && null === p && Rr(y);
                if (x) d = this.Ie(t, y, u, e); else {
                    g = m.primary;
                    if (null === p) {
                        v = n.parse(y, 1);
                        d = [ null === v ? new SetPropertyInstruction(y, g.property) : new InterpolationInstruction(v, g.property) ];
                    } else {
                        Er.node = t;
                        Er.attr = c;
                        Er.bindable = g;
                        Er.def = u;
                        d = [ p.build(Er, e.ep, e.m) ];
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
                Er.node = t;
                Er.attr = c;
                Er.bindable = null;
                Er.def = null;
                i.push(p.build(Er, e.ep, e.m));
            }
        }
        Ir();
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
                W = V !== Wr && "slot" !== V;
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
                Er.node = t;
                Er.attr = S;
                Er.bindable = null;
                Er.def = null;
                (R ?? (R = [])).push(M.build(Er, e.ep, e.m));
                v();
                continue;
            }
            T = e.Re(V);
            if (null !== T) {
                F = BindablesInfo.from(T, true);
                L = false === T.noMultiBindings && null === M && Rr(N);
                if (L) _ = this.Ie(t, N, T, e); else {
                    O = F.primary;
                    if (null === M) {
                        q = p.parse(N, 1);
                        _ = [ null === q ? new SetPropertyInstruction(N, O.property) : new InterpolationInstruction(q, O.property) ];
                    } else {
                        Er.node = t;
                        Er.attr = S;
                        Er.bindable = O;
                        Er.def = T;
                        _ = [ M.build(Er, e.ep, e.m) ];
                    }
                }
                v();
                if (T.isTemplateController) ($ ?? ($ = [])).push(new HydrateTemplateController(Lr, this.resolveResources ? T : T.name, void 0, _)); else (P ?? (P = [])).push(new HydrateAttributeInstruction(this.resolveResources ? T : T.name, null != T.aliases && T.aliases.includes(V) ? V : void 0, _));
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
                    Er.node = t;
                    Er.attr = S;
                    Er.bindable = E;
                    Er.def = c;
                    (I ?? (I = [])).push(M.build(Er, e.ep, e.m));
                    continue;
                }
            }
            Er.node = t;
            Er.attr = S;
            Er.bindable = null;
            Er.def = null;
            (R ?? (R = [])).push(M.build(Er, e.ep, e.m));
        }
        Ir();
        if (this._e(t, R) && null != R && R.length > 1) this.$e(t, R);
        if (u) {
            D = new HydrateElementInstruction(this.resolveResources ? c : c.name, void 0, I ?? l, null, H, g);
            if (a === Wr) {
                const i = t.getAttribute("name") || Hr;
                const s = e.t();
                const n = e.Ue();
                let r = t.firstChild;
                while (null !== r) {
                    if (1 === r.nodeType && r.hasAttribute(Wr)) t.removeChild(r); else Ce(s, r);
                    r = t.firstChild;
                }
                this.Ae(s.content, n);
                D.auSlot = {
                    name: i,
                    fallback: CustomElementDefinition.create({
                        name: zs(),
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
            if (Br(t)) {
                n = e.t();
                Be(n, [ e.De(Ar), e.De(Cr), this.Pe(e.h(yr)) ]);
            } else {
                this.qe(t, e);
                if ("TEMPLATE" === t.nodeName) n = t; else {
                    n = e.t();
                    Ce(n, t);
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
                h = 1 === C.nodeType ? C.getAttribute(Wr) : null;
                if (null !== h) C.removeAttribute(Wr);
                if (u) {
                    l = C.nextSibling;
                    if (!f) {
                        B = 3 === C.nodeType && "" === C.textContent.trim();
                        if (!B) ((i = m ?? (m = {}))[s = h || Hr] ?? (i[s] = [])).push(C);
                        t.removeChild(C);
                    }
                    C = l;
                } else {
                    if (null !== h) {
                        h = h || Hr;
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
                        if ("TEMPLATE" === p.nodeName) if (p.attributes.length > 0) Ce(n, p); else Ce(n, p.content); else Ce(n, p);
                    }
                    x = e.Ue();
                    this.Ae(n.content, x);
                    d[h] = CustomElementDefinition.create({
                        name: zs(),
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
            if (z) if (t.nodeName === kr) this.Ae(t.content, o); else {
                C = t.firstChild;
                while (null !== C) C = this.Ae(C, o);
            }
            U.def = CustomElementDefinition.create({
                name: zs(),
                template: r,
                instructions: o.rows,
                needsCompile: false,
                isStrictBinding: e.root.def.isStrictBinding
            });
            while (k-- > 0) {
                U = $[k];
                n = e.t();
                v = this.Pe(e.h(yr));
                Be(n, [ e.De(Ar), e.De(Cr), v ]);
                U.def = CustomElementDefinition.create({
                    name: zs(),
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
                n = 1 === i.nodeType ? i.getAttribute(Wr) : null;
                if (null !== n) i.removeAttribute(Wr);
                if (u) {
                    s = i.nextSibling;
                    if (!f) {
                        v = 3 === i.nodeType && "" === i.textContent.trim();
                        if (!v) ((r = h ?? (h = {}))[o = n || Hr] ?? (r[o] = [])).push(i);
                        t.removeChild(i);
                    }
                    i = s;
                } else {
                    if (null !== n) {
                        n = n || Hr;
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
                        if (m.nodeName === kr) if (m.attributes.length > 0) Ce(g, m); else Ce(g, m.content); else Ce(g, m);
                    }
                    p = e.Ue();
                    this.Ae(g.content, p);
                    l[n] = CustomElementDefinition.create({
                        name: zs(),
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
            if (a = r[0]) ye(i, e.Me(a), t);
            for (l = 0, h = o.length; h > l; ++l) {
                ke(i, t, [ e.De(Ar), e.De(Cr), this.Pe(e.h(yr)) ]);
                if (a = r[l + 1]) ye(i, e.Me(a), t);
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
                    Er.node = t;
                    Er.attr = f;
                    Er.bindable = m;
                    Er.def = i;
                    o.push(d.build(Er, s.ep, s.m));
                }
                while (g < r && e.charCodeAt(++g) <= 32) ;
                a = g;
                l = void 0;
                h = void 0;
            }
        }
        Ir();
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
            const s = Dr(t, r);
            const n = class LocalTemplate {};
            const l = t.content;
            const h = y(l.querySelectorAll("bindable"));
            const a = Ft.for(n);
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
                    mode: Mr(t)
                });
                const s = t.getAttributeNames().filter((t => !Ur.includes(t)));
                if (s.length > 0) ;
                l.removeChild(t);
            }
            o.push(n);
            e.Fe(Xs({
                name: s,
                template: t
            }, n));
            i.removeChild(t);
        }
        let h = 0;
        const a = o.length;
        for (;a > h; ++h) Zs(o[h]).dependencies.push(...e.def.dependencies ?? l, ...e.deps ?? l);
    }
    _e(t, e) {
        const i = t.nodeName;
        return "INPUT" === i && 1 === _r[t.type] || "SELECT" === i && (t.hasAttribute("multiple") || e?.some((t => "rg" === t.type && "multiple" === t.to)));
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
        return t.nodeName === yr && Sr(br = Ae(t)) && br.textContent === Cr && Sr(br = Ae(br)) && br.textContent === Ar;
    }
    Pe(t) {
        t.classList.add("au");
        return t;
    }
    qe(t, e) {
        if (Br(t)) return t;
        const i = t.parentNode;
        const s = this.Pe(e.h(yr));
        ke(i, t, [ e.De(Ar), e.De(Cr), s ]);
        i.removeChild(t);
        return s;
    }
}

let br;

const yr = "AU-M";

const kr = "TEMPLATE";

const Ar = "au-start";

const Cr = "au-end";

const Br = t => t.nodeName === yr && Sr(br = Ae(t)) && br.textContent === Cr && Sr(br = Ae(br)) && br.textContent === Ar;

const Sr = t => 8 === t?.nodeType;

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
        this.ye = o ? s.ye : e.get(vr);
        this.me = o ? s.me : e.get(ne);
        this.ep = o ? s.ep : e.get(D);
        this.m = o ? s.m : e.get(mr);
        this.Ne = o ? s.Ne : e.get(k);
        this.p = o ? s.p : e.get(xi);
        this.localEls = o ? s.localEls : new Set;
        this.rows = r ?? [];
    }
    Fe(t) {
        var e;
        ((e = this.root).deps ?? (e.deps = [])).push(t);
        this.root.c.register(t);
    }
    Me(t) {
        return be(this.p, t);
    }
    De(t) {
        return xe(this.p, t);
    }
    h(t) {
        const e = ve(this.p, t);
        if ("template" === t) this.p.document.adoptNode(e.content);
        return e;
    }
    t() {
        return this.h("template");
    }
    Be(t) {
        return this.c.find(en, t);
    }
    Re(t) {
        return this.c.find(vi, t);
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
            i = this.c.create(Zn, e);
            if (null === i) throw vt(`AUR0713:${e}`);
            this.Ve[e] = i;
        }
        return i;
    }
}

const Rr = t => {
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

const Ir = () => {
    Er.node = Er.attr = Er.bindable = Er.def = null;
};

const Tr = {
    projections: null
};

const Lr = {
    name: "unnamed"
};

const Er = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const Pr = bt(pt(), {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
});

const _r = {
    checkbox: 1,
    radio: 1
};

const $r = new WeakMap;

class BindablesInfo {
    static from(t, e) {
        let i = $r.get(t);
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
            $r.set(t, i = new BindablesInfo(n, s, a));
        }
        return i;
    }
    constructor(t, e, i) {
        this.attrs = t;
        this.bindables = e;
        this.primary = i;
    }
}

const Ur = wt([ "property", "attribute", "mode" ]);

const qr = "as-custom-element";

const Dr = (t, e) => {
    const i = t.getAttribute(qr);
    if (null === i || "" === i) throw vt(`AUR0715`);
    if (e.has(i)) throw vt(`AUR0716:${i}`); else {
        e.add(i);
        t.removeAttribute(qr);
    }
    return i;
};

const Mr = t => {
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

const Fr = zt("ITemplateCompilerHooks");

const Or = new WeakMap;

const Vr = at("compiler-hooks");

const Nr = wt({
    name: Vr,
    define(t) {
        let e = Or.get(t);
        if (void 0 === e) {
            Or.set(t, e = new TemplateCompilerHooksDefinition(t));
            rt(Vr, e, t);
            ct(t, Vr);
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
        t.register(Gt(Fr, this.Type));
    }
}

const jr = t => {
    return void 0 === t ? e : e(t);
    function e(t) {
        return Nr.define(t);
    }
};

const Hr = "default";

const Wr = "au-slot";

const zr = new Map;

class BindingModeBehavior {
    bind(t, e) {
        zr.set(e, e.mode);
        e.mode = this.mode;
    }
    unbind(t, e) {
        e.mode = zr.get(e);
        zr.delete(e);
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

$e("oneTime")(OneTimeBindingBehavior);

$e("toView")(ToViewBindingBehavior);

$e("fromView")(FromViewBindingBehavior);

$e("twoWay")(TwoWayBindingBehavior);

const Gr = new WeakMap;

const Xr = 200;

class DebounceBindingBehavior {
    constructor(t) {
        this.p = t;
    }
    bind(t, e, i, s) {
        const n = {
            type: "debounce",
            delay: i ?? Xr,
            now: this.p.performanceNow,
            queue: this.p.taskQueue,
            signals: It(s) ? [ s ] : s ?? l
        };
        const r = e.limit?.(n);
        if (null == r) ; else Gr.set(e, r);
    }
    unbind(t, e) {
        Gr.get(e)?.dispose();
        Gr.delete(e);
    }
}

DebounceBindingBehavior.inject = [ c ];

$e("debounce")(DebounceBindingBehavior);

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
        for (s of i) $t(this.He, s, e);
    }
    unbind(t, e) {
        const i = this.je.get(e);
        this.je.delete(e);
        let s;
        for (s of i) Ut(this.He, s, e);
    }
}

SignalBindingBehavior.inject = [ L ];

$e("signal")(SignalBindingBehavior);

const Kr = new WeakMap;

const Qr = 200;

class ThrottleBindingBehavior {
    constructor(t) {
        this.We = t.performanceNow;
        this.ct = t.taskQueue;
    }
    bind(t, e, i, s) {
        const n = {
            type: "throttle",
            delay: i ?? Qr,
            now: this.We,
            queue: this.ct,
            signals: It(s) ? [ s ] : s ?? l
        };
        const r = e.limit?.(n);
        if (null == r) ; else Kr.set(e, r);
    }
    unbind(t, e) {
        Kr.get(e)?.dispose();
        Kr.delete(e);
    }
}

ThrottleBindingBehavior.inject = [ c ];

$e("throttle")(ThrottleBindingBehavior);

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

ki(DataAttributeAccessor);

const Yr = new DataAttributeAccessor;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) throw vt(`AURxxxx`);
        e.useTargetObserver(Yr);
    }
}

$e("attr")(AttrBindingBehavior);

class SelfBindingBehavior {
    bind(t, e) {
        if (!(e instanceof ListenerBinding)) throw vt(`AUR0801`);
        e.self = true;
    }
    unbind(t, e) {
        e.self = false;
    }
}

$e("self")(SelfBindingBehavior);

const Zr = pt();

class AttributeNSAccessor {
    static forNs(t) {
        return Zr[t] ?? (Zr[t] = new AttributeNSAccessor(t));
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

ki(AttributeNSAccessor);

function Jr(t, e) {
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
        const n = void 0 !== e.matcher ? e.matcher : Jr;
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
        const n = void 0 !== e.matcher ? e.matcher : Jr;
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
        to = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, to);
    }
    Xe() {
        const t = this.wt;
        (this.Ge ?? (this.Ge = t.$observers?.model ?? t.$observers?.value))?.subscribe(this);
        this.ze?.unsubscribe(this);
        this.ze = void 0;
        if ("checkbox" === t.type) (this.ze = fo(this.v, this.oL))?.subscribe(this);
    }
}

yi(CheckedObserver);

I(CheckedObserver);

let to;

const eo = {
    childList: true,
    subtree: true,
    characterData: true
};

function io(t, e) {
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
        return this.iO ? this.v : this.wt.multiple ? so(this.wt.options) : this.wt.value;
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
        const s = e.matcher ?? io;
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
            const o = t.matcher || io;
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
        (this.Ye = Re(this.wt, this.Je.bind(this))).observe(this.wt, eo);
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
        no = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, no);
    }
}

yi(SelectValueObserver);

I(SelectValueObserver);

function so(t) {
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

let no;

const ro = "--";

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
                if (i.startsWith(ro)) {
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

ki(StyleAttributeAccessor);

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
        oo = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, oo);
    }
}

yi(ValueAttributeObserver);

I(ValueAttributeObserver);

let oo;

const lo = "http://www.w3.org/1999/xlink";

const ho = "http://www.w3.org/XML/1998/namespace";

const ao = "http://www.w3.org/2000/xmlns/";

const co = bt(pt(), {
    "xlink:actuate": [ "actuate", lo ],
    "xlink:arcrole": [ "arcrole", lo ],
    "xlink:href": [ "href", lo ],
    "xlink:role": [ "role", lo ],
    "xlink:show": [ "show", lo ],
    "xlink:title": [ "title", lo ],
    "xlink:type": [ "type", lo ],
    "xml:lang": [ "lang", ho ],
    "xml:space": [ "space", ho ],
    xmlns: [ "xmlns", ao ],
    "xmlns:xlink": [ "xlink", ao ]
});

const uo = new j;

uo.type = 2 | 4;

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
        Xt(H, NodeObserverLocator).register(t);
        Gt(H, NodeObserverLocator).register(t);
    }
    handles(t, e) {
        return t instanceof this.platform.Node;
    }
    useConfig(t, e, i) {
        const s = this.ni;
        let n;
        if (It(t)) {
            n = s[t] ?? (s[t] = pt());
            if (null == n[e]) n[e] = i; else mo(t, e);
        } else for (const i in t) {
            n = s[i] ?? (s[i] = pt());
            const r = t[i];
            for (e in r) if (null == n[e]) n[e] = r[e]; else mo(i, e);
        }
    }
    useConfigGlobal(t, e) {
        const i = this.ri;
        if ("object" === typeof t) for (const e in t) if (null == i[e]) i[e] = t[e]; else mo("*", e); else if (null == i[t]) i[t] = e; else mo("*", t);
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
            return Yr;

          default:
            {
                const i = co[e];
                if (void 0 !== i) return AttributeNSAccessor.forNs(i[1]);
                if (Ct(t, e, this.svgAnalyzer)) return Yr;
                return uo;
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
        const n = co[e];
        if (void 0 !== n) return AttributeNSAccessor.forNs(n[1]);
        if (Ct(t, e, this.svgAnalyzer)) return Yr;
        if (e in t.constructor.prototype) {
            if (this.allowDirtyCheck) return this.dirtyChecker.createProperty(t, e);
            throw vt(`AUR0652:${mt(e)}`);
        } else return new z(t, e);
    }
}

NodeObserverLocator.inject = [ C, xi, G, fr ];

function fo(t, e) {
    if (t instanceof Array) return e.getArrayObserver(t);
    if (t instanceof Map) return e.getMapObserver(t);
    if (t instanceof Set) return e.getSetObserver(t);
}

function mo(t, e) {
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

$e("updateTrigger")(UpdateTriggerBindingBehavior);

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

Focus.inject = [ bs, xi ];

et([ qt({
    mode: 6
}) ], Focus.prototype, "value", void 0);

hi("focus")(Focus);

let go = class Show {
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

et([ qt ], go.prototype, "value", void 0);

go = et([ it(0, bs), it(1, xi), it(2, un) ], go);

Zt("hide")(go);

hi("show")(go);

class Portal {
    constructor(t, e, i) {
        this.position = "beforeend";
        this.strict = false;
        this.p = i;
        this.vi = i.document.createElement("div");
        (this.view = t.create()).setLocation(this.xi = we(i));
        Ss(this.view.nodes, e);
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
            ke(t, null, r);
            break;

          case "afterbegin":
            ke(t, t.firstChild, r);
            break;

          case "beforebegin":
            ke(n, t, r);
            break;

          case "afterend":
            ke(n, t.nextSibling, r);
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

Portal.inject = [ Oi, ks, xi ];

et([ qt({
    primary: true
}) ], Portal.prototype, "target", void 0);

et([ qt() ], Portal.prototype, "position", void 0);

et([ qt({
    callback: "targetChanged"
}) ], Portal.prototype, "renderContext", void 0);

et([ qt() ], Portal.prototype, "strict", void 0);

et([ qt() ], Portal.prototype, "deactivating", void 0);

et([ qt() ], Portal.prototype, "activating", void 0);

et([ qt() ], Portal.prototype, "deactivated", void 0);

et([ qt() ], Portal.prototype, "activated", void 0);

et([ qt() ], Portal.prototype, "callbackContext", void 0);

ai("portal")(Portal);

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

If.inject = [ Oi, ks ];

et([ qt ], If.prototype, "value", void 0);

et([ qt({
    set: t => "" === t || !!t && "false" !== t
}) ], If.prototype, "cache", void 0);

ai("if")(If);

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

Else.inject = [ Oi ];

ai({
    name: "else"
})(Else);

function po(t) {
    t.dispose();
}

const vo = [ 18, 17 ];

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
                while (null != t && vo.includes(t.$kind)) {
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
                            p = Eo(A, n, m, Po(C, m, h, B, c, t, u), c);
                            v = Eo(A, n, g, Po(C, g, h, B, c, t, u), c);
                        } else {
                            m = p = _o(d[f], f);
                            g = v = _o(o[f], f);
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
                            p = Eo(A, n, m, Po(C, m, h, B, c, t, u), c);
                            v = Eo(A, n, g, Po(C, g, h, B, c, t, u), c);
                        } else {
                            m = p = _o(d[f], f);
                            g = v = _o(o[f], f);
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
                    if (A.has(g = r ? o[f] : _o(o[f], f))) v = A.get(g); else {
                        v = r ? Eo(A, n, g, Po(C, g, h, B, c, t, u), c) : g;
                        A.set(g, v);
                    }
                    k.set(v, f);
                }
                for (f = S; f <= w; ++f) {
                    if (A.has(m = r ? d[f] : _o(d[f], f))) p = A.get(m); else p = r ? Eo(A, n, m, i[f].scope, c) : m;
                    y.set(p, f);
                    if (k.has(p)) e[k.get(p)] = f; else {
                        e.deletedIndices.push(f);
                        e.deletedItems.push(m);
                    }
                }
                for (f = R; f <= b; ++f) if (!y.has(A.get(r ? o[f] : _o(o[f], f)))) e[f] = -2;
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
        So(t, ((t, i) => {
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
        const g = Bo(a);
        const p = this.views = Array(g);
        So(a, ((a, v) => {
            s = p[v] = o.create().setLocation(h);
            s.nodes.unlink();
            n = Po(c, a, f, m, u, l, d);
            Ao(n.overrideContext, v, g);
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
        if (f.length !== v) throw ko(f.length, v);
        const x = l.scope;
        const w = e.length;
        Y(f, e);
        const b = yo(e);
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
                r = Po(g, c[o], p, x, m, a, d);
                Ao(r.overrideContext, o, w);
                n.setLocation(u);
                s = n.activate(n, l, r);
                if (Bt(s)) (i ?? (i = [])).push(s);
            } else if (C < 0 || 1 === y || o !== b[C]) {
                if (d) $(k, n.scope, m, c[o]); else n.scope.bindingContext[a] = c[o];
                Ao(n.scope.overrideContext, o, w);
                n.nodes.insertBefore(n.location);
            } else {
                if (d) $(k, n.scope, m, c[o]); else n.scope.bindingContext[a] = c[o];
                if (t !== w) Ao(n.scope.overrideContext, o, w);
                --C;
            }
        }
        if (void 0 !== i) return 1 === i.length ? i[0] : Promise.all(i);
    }
    dispose() {
        this.views.forEach(po);
        this.views = void 0;
    }
    accept(t) {
        const {views: e} = this;
        if (void 0 !== e) for (let i = 0, s = e.length; i < s; ++i) if (true === e[i].accept(t)) return true;
    }
}

Repeat.inject = [ un, D, ks, is, Oi ];

et([ qt ], Repeat.prototype, "items", void 0);

ai("repeat")(Repeat);

let xo = 16;

let wo = new Int32Array(xo);

let bo = new Int32Array(xo);

function yo(t) {
    const e = t.length;
    if (e > xo) {
        xo = e;
        wo = new Int32Array(e);
        bo = new Int32Array(e);
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
            o = wo[i];
            n = t[o];
            if (-2 !== n && n < s) {
                bo[r] = o;
                wo[++i] = r;
                continue;
            }
            l = 0;
            h = i;
            while (l < h) {
                a = l + h >> 1;
                n = t[wo[a]];
                if (-2 !== n && n < s) l = a + 1; else h = a;
            }
            n = t[wo[l]];
            if (s < n || -2 === n) {
                if (l > 0) bo[r] = wo[l - 1];
                wo[l] = r;
            }
        }
    }
    r = ++i;
    const c = new Int32Array(r);
    s = wo[i - 1];
    while (i-- > 0) {
        c[i] = s;
        s = bo[s];
    }
    while (r-- > 0) wo[r] = 0;
    return c;
}

const ko = (t, e) => vt(`AUR0814:${t}!=${e}`);

const Ao = (t, e, i) => {
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

const Co = gt.toString;

const Bo = t => {
    switch (Co.call(t)) {
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
        throw vt(`Cannot count ${Co.call(t)}`);
    }
};

const So = (t, e) => {
    switch (Co.call(t)) {
      case "[object Array]":
        return Ro(t, e);

      case "[object Map]":
        return Io(t, e);

      case "[object Set]":
        return To(t, e);

      case "[object Number]":
        return Lo(t, e);

      case "[object Null]":
        return;

      case "[object Undefined]":
        return;

      default:
        throw vt(`Cannot iterate over ${Co.call(t)}`);
    }
};

const Ro = (t, e) => {
    const i = t.length;
    let s = 0;
    for (;s < i; ++s) e(t[s], s, t);
};

const Io = (t, e) => {
    let i = -0;
    let s;
    for (s of t.entries()) e(s, i++, t);
};

const To = (t, e) => {
    let i = 0;
    let s;
    for (s of t.keys()) e(s, i++, t);
};

const Lo = (t, e) => {
    let i = 0;
    for (;i < t; ++i) e(i, i, t);
};

const Eo = (t, e, i, s, n) => {
    let r = t.get(i);
    if (void 0 === r) {
        if ("string" === typeof e) r = i[e]; else r = T(e, s, n, null);
        t.set(i, r);
    }
    return r;
};

const Po = (t, e, i, s, n, r, o) => {
    let l = t.get(e);
    if (void 0 === l) {
        if (o) $(i.declaration, l = F.fromParent(s, new Z), n, e); else l = F.fromParent(s, new Z(r, e));
        t.set(e, l);
    }
    return l;
};

const _o = (t, e) => {
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

With.inject = [ Oi, ks ];

et([ qt ], With.prototype, "value", void 0);

ai("with")(With);

let $o = class Switch {
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

et([ qt ], $o.prototype, "value", void 0);

$o = et([ ai("switch"), it(0, Oi), it(1, ks) ], $o);

let Uo = 0;

let qo = class Case {
    constructor(t, e, i, s) {
        this.f = t;
        this.Yi = e;
        this.l = i;
        this.id = ++Uo;
        this.fallThrough = false;
        this.view = void 0;
        this.Zi = s.config.level <= 1;
        this.Ne = s.scopeTo(`${this.constructor.name}-#${this.id}`);
    }
    link(t, e, i, s) {
        const n = t.parent;
        const r = n?.viewModel;
        if (r instanceof $o) {
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

qo.inject = [ Oi, M, ks, k ];

et([ qt ], qo.prototype, "value", void 0);

et([ qt({
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
}) ], qo.prototype, "fallThrough", void 0);

qo = et([ ai("case") ], qo);

let Do = class DefaultCase extends qo {
    linkToSwitch(t) {
        if (void 0 !== t.defaultCase) throw vt(`AUR0816`);
        t.defaultCase = this;
    }
};

Do = et([ ai("default-case") ], Do);

let Mo = class PromiseTemplateController {
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

et([ qt ], Mo.prototype, "value", void 0);

Mo = et([ ai("promise"), it(0, Oi), it(1, ks), it(2, xi), it(3, k) ], Mo);

let Fo = class PendingTemplateController {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.view = void 0;
    }
    link(t, e, i, s) {
        No(t).pending = this;
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

et([ qt({
    mode: 2
}) ], Fo.prototype, "value", void 0);

Fo = et([ ai("pending"), it(0, Oi), it(1, ks) ], Fo);

let Oo = class FulfilledTemplateController {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.view = void 0;
    }
    link(t, e, i, s) {
        No(t).fulfilled = this;
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

et([ qt({
    mode: 4
}) ], Oo.prototype, "value", void 0);

Oo = et([ ai("then"), it(0, Oi), it(1, ks) ], Oo);

let Vo = class RejectedTemplateController {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.view = void 0;
    }
    link(t, e, i, s) {
        No(t).rejected = this;
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

et([ qt({
    mode: 4
}) ], Vo.prototype, "value", void 0);

Vo = et([ ai("catch"), it(0, Oi), it(1, ks) ], Vo);

function No(t) {
    const e = t.parent;
    const i = e?.viewModel;
    if (i instanceof Mo) return i;
    throw vt(`AUR0813`);
}

let jo = class PromiseAttributePattern {
    "promise.resolve"(t, e, i) {
        return new AttrSyntax(t, e, "promise", "bind");
    }
};

jo = et([ re({
    pattern: "promise.resolve",
    symbols: ""
}) ], jo);

let Ho = class FulfilledAttributePattern {
    then(t, e, i) {
        return new AttrSyntax(t, e, "then", "from-view");
    }
};

Ho = et([ re({
    pattern: "then",
    symbols: ""
}) ], Ho);

let Wo = class RejectedAttributePattern {
    catch(t, e, i) {
        return new AttrSyntax(t, e, "catch", "from-view");
    }
};

Wo = et([ re({
    pattern: "catch",
    symbols: ""
}) ], Wo);

class AuCompose {
    static get inject() {
        return [ u, is, bs, ks, xi, un, B(CompositionContextFactory) ];
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
        this.r = t.get(Vi);
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
                    name: en.generateName(),
                    template: n
                });
                const r = this.r.getViewFactory(s, f);
                const o = Controller.$view(r, a);
                const l = "auto" === this.scopeBehavior ? F.fromParent(this.parent.scope, e) : F.create(e);
                if (Is(i)) o.setLocation(i); else o.setHost(i);
                return new CompositionController(o, (t => o.activate(t ?? o, a, l)), (t => o.deactivate(t ?? o, a)), (t => e.activate?.(t)), t);
            }
        };
        if ("activate" in e) return g(e.activate(o), (() => m())); else return m();
    }
    cs(t, e, i) {
        if (null == e) return new EmptyComponent;
        if ("object" === typeof e) return e;
        const s = this.p;
        const n = Is(i);
        Yt(t, s.Element, Yt(t, bs, new d("ElementResolver", n ? null : i)));
        Yt(t, ks, new d("IRenderLocation", n ? i : null));
        const r = t.invoke(e);
        Yt(t, e, new d("au-compose.component", r));
        return r;
    }
    getDef(t) {
        const e = Rt(t) ? t : t?.constructor;
        return en.isType(e) ? en.getDefinition(e) : null;
    }
}

et([ qt ], AuCompose.prototype, "template", void 0);

et([ qt ], AuCompose.prototype, "component", void 0);

et([ qt ], AuCompose.prototype, "model", void 0);

et([ qt({
    set: t => {
        if ("scoped" === t || "auto" === t) return t;
        throw vt(`AUR0805`);
    }
}) ], AuCompose.prototype, "scopeBehavior", void 0);

Ps("au-compose")(AuCompose);

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

let zo = class AuSlot {
    static get inject() {
        return [ ks, un, ss, Vi ];
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
            Yt(r, a.definition.Type, new d(void 0, a.viewModel));
            n = s.getViewFactory(h, r);
            this.xs = true;
            this.ws = a.container.getAll(hn, false)?.filter((t => "*" === t.slotName || t.slotName === o.name)) ?? l;
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
        (this.Pi = Re(e, (e => {
            if (Xo(t, e)) this.ks();
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

et([ qt ], zo.prototype, "expose", void 0);

et([ qt ], zo.prototype, "slotchange", void 0);

zo = et([ Ps({
    name: "au-slot",
    template: null,
    containerless: true
}) ], zo);

const Go = (t, e) => t.compareDocumentPosition(e);

const Xo = (t, e) => {
    for (const {addedNodes: i, removedNodes: s, nextSibling: n} of e) {
        let e = 0;
        let r = i.length;
        let o;
        for (;e < r; ++e) {
            o = i[e];
            if (4 === Go(t.$start, o) && 2 === Go(t, o)) return true;
        }
        if (s.length > 0) if (null != n && 4 === Go(t.$start, n) && 2 === Go(t, n)) return true;
    }
};

const Ko = zt("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw vt('"sanitize" method not implemented');
    }
})));

let Qo = class SanitizeValueConverter {
    constructor(t) {
        this.Cs = t;
    }
    toView(t) {
        if (null == t) return null;
        return this.Cs.sanitize(t);
    }
};

Qo = et([ it(0, Ko) ], Qo);

Me("sanitize")(Qo);

const Yo = DebounceBindingBehavior;

const Zo = OneTimeBindingBehavior;

const Jo = ToViewBindingBehavior;

const tl = FromViewBindingBehavior;

const el = SignalBindingBehavior;

const il = ThrottleBindingBehavior;

const sl = TwoWayBindingBehavior;

const nl = TemplateCompiler;

const rl = NodeObserverLocator;

const ol = [ nl, rl ];

const ll = SVGAnalyzer;

const hl = de;

const al = fe;

const cl = ue;

const ul = ce;

const fl = me;

const dl = [ cl, ul, fl ];

const ml = [ hl, al ];

const gl = sr;

const pl = nr;

const vl = er;

const xl = Jn;

const wl = tr;

const bl = ir;

const yl = cr;

const kl = rr;

const Al = or;

const Cl = lr;

const Bl = ar;

const Sl = hr;

const Rl = ur;

const Il = [ gl, xl, vl, wl, bl, pl, yl, kl, Al, Bl, Sl, Cl, Rl ];

const Tl = Qo;

const Ll = If;

const El = Else;

const Pl = Repeat;

const _l = With;

const $l = $o;

const Ul = qo;

const ql = Do;

const Dl = Mo;

const Ml = Fo;

const Fl = Oo;

const Ol = Vo;

const Vl = jo;

const Nl = Ho;

const jl = Wo;

const Hl = SelfBindingBehavior;

const Wl = UpdateTriggerBindingBehavior;

const zl = AuCompose;

const Gl = Portal;

const Xl = Focus;

const Kl = go;

const Ql = [ Yo, Zo, Jo, tl, el, il, sl, Tl, Ll, El, Pl, _l, $l, Ul, ql, Dl, Ml, Fl, Ol, Vl, Nl, jl, AttrBindingBehavior, Hl, Wl, zl, Gl, Xl, Kl, zo ];

const Yl = [ Sn, Rn, Cn, Bn, wn, bn, yn, kn, An, Tn, $n, Ln, En, Pn, _n, In, Un ];

const Zl = Jl(n);

function Jl(t) {
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
            return e.register(Kt(O, i.coercingOptions), ...ol, ...Ql, ...dl, ...Il, ...Yl);
        },
        customize(e) {
            return Jl(e ?? t);
        }
    };
}

const th = zt("IAurelia");

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
        if (t.has(th, true)) throw vt(`AUR0768`);
        Yt(t, th, new d("IAurelia", this));
        Yt(t, vs, this.Ls = new d("IAppRoot"));
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
            Yt(i, n.HTMLElement, Yt(i, n.Element, Yt(i, bs, new d("ElementResolver", s))));
            o = i.invoke(r);
        } else o = r;
        Yt(i, ys, new d("IEventTarget", s));
        e = e ?? null;
        const l = Controller.$el(i, o, s, null, CustomElementDefinition.create({
            name: zs(),
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
        if (!this.container.has(xi, false)) {
            if (null === t.ownerDocument.defaultView) throw vt(`AUR0769`);
            e = new tt(t.ownerDocument.defaultView);
            this.container.register(Kt(xi, e));
        } else e = this.container.get(xi);
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

var eh;

(function(t) {
    t[t["oneTime"] = 1] = "oneTime";
    t[t["toView"] = 2] = "toView";
    t[t["fromView"] = 4] = "fromView";
    t[t["twoWay"] = 6] = "twoWay";
    t[t["default"] = 8] = "default";
})(eh || (eh = {}));

var ih;

(function(t) {
    t[t["Element"] = 1] = "Element";
    t[t["Attribute"] = 2] = "Attribute";
})(ih || (ih = {}));

function sh(t, e) {
    let i;
    const s = "dependencies";
    function n(t, e, n) {
        if (arguments.length > 1) i.name = e;
        if ("function" === typeof t || "undefined" !== typeof n?.value) throw new Error(`Invalid usage. @children can only be used on a field`);
        const r = t.constructor;
        let o = en.getAnnotation(r, s);
        if (null == o) en.annotate(r, s, o = []);
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
    static create(t, e, i, s, n = oh, r = lh, o = hh, l = nh) {
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
    constructor(t, e, i, s = oh, n = lh, r = hh, o = nh) {
        this._s = void 0;
        this.ce = oh;
        this.$s = lh;
        this.Us = hh;
        this.isBound = false;
        this.ht = t;
        this.cb = (this.obj = e)[i];
        this.ce = s;
        this.$s = n;
        this.Us = r;
        this.xt = o;
        this.Pi = Re(this.qs = t.host, (() => {
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
        throw rh("get");
    }
    Ms() {
        return ch(this.ht, this.ce, this.$s, this.Us);
    }
}

I(ChildrenBinding);

const nh = {
    childList: true
};

const rh = t => vt(`Method "${t}": not implemented`);

const oh = t => t.host.childNodes;

const lh = (t, e, i) => !!i;

const hh = (t, e, i) => i;

const ah = {
    optional: true
};

const ch = (t, e, i, s) => {
    const n = e(t);
    const r = n.length;
    const o = [];
    let l;
    let h;
    let a;
    let c = 0;
    for (;c < r; ++c) {
        l = n[c];
        h = Qs(l, ah);
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
        Kt(Ui, this).register(t);
    }
    hydrating(t, e) {
        const i = this.def;
        e.addBinding(ChildrenBinding.create(e, e.viewModel, i.name, i.callback ?? `${mt(i.name)}Changed`, i.query ?? oh, i.filter ?? lh, i.map ?? hh, i.options ?? nh));
    }
}

Fi()(ChildrenLifecycleHooks);

export { AdoptedStyleSheetsStyles, AppRoot, ii as AppTask, de as AtPrefixedTriggerAttributePattern, hl as AtPrefixedTriggerAttributePatternRegistration, AttrBindingBehavior, lr as AttrBindingCommand, Cl as AttrBindingCommandRegistration, AttrSyntax, AttributeBinding, AttributeBindingInstruction, $n as AttributeBindingRenderer, AttributeNSAccessor, ae as AttributePattern, AuCompose, zo as AuSlot, AuSlotsInfo, Aurelia, Ft as Bindable, BindableDefinition, BindableObserver, BindablesInfo, De as BindingBehavior, BindingBehaviorDefinition, Zn as BindingCommand, BindingCommandDefinition, eh as BindingMode, BindingModeBehavior, BindingTargetSubscriber, CSSModulesProcessorRegistry, or as CaptureBindingCommand, Al as CaptureBindingCommandRegistration, qo as Case, CheckedObserver, ChildrenBinding, ClassAttributeAccessor, ar as ClassBindingCommand, Bl as ClassBindingCommandRegistration, fe as ColonPrefixedBindAttributePattern, al as ColonPrefixedBindAttributePatternRegistration, Gn as CommandType, ComputedWatcher, ContentBinding, Controller, vi as CustomAttribute, CustomAttributeDefinition, yn as CustomAttributeRenderer, en as CustomElement, CustomElementDefinition, bn as CustomElementRenderer, DataAttributeAccessor, DebounceBindingBehavior, Yo as DebounceBindingBehaviorRegistration, sr as DefaultBindingCommand, gl as DefaultBindingCommandRegistration, Il as DefaultBindingLanguage, dl as DefaultBindingSyntax, Do as DefaultCase, ol as DefaultComponents, Yl as DefaultRenderers, Ql as DefaultResources, ih as DefinitionType, ce as DotSeparatedAttributePattern, ul as DotSeparatedAttributePatternRegistration, Else, El as ElseRegistration, ExpressionWatcher, FlushQueue, Focus, nr as ForBindingCommand, pl as ForBindingCommandRegistration, FragmentNodeSequence, FromViewBindingBehavior, tl as FromViewBindingBehaviorRegistration, er as FromViewBindingCommand, vl as FromViewBindingCommandRegistration, Oo as FulfilledTemplateController, HooksDefinition, HydrateAttributeInstruction, HydrateElementInstruction, HydrateLetElementInstruction, HydrateTemplateController, vs as IAppRoot, ei as IAppTask, mr as IAttrMapper, ne as IAttributeParser, se as IAttributePattern, hn as IAuSlotWatcher, ln as IAuSlotsInfo, th as IAurelia, is as IController, ys as IEventTarget, We as IFlushQueue, Es as IHistory, ss as IHydrationContext, un as IInstruction, Ui as ILifecycleHooks, Ls as ILocation, bs as INode, rl as INodeObserverLocatorRegistration, xi as IPlatform, ks as IRenderLocation, mn as IRenderer, Vi as IRendering, fr as ISVGAnalyzer, Ko as ISanitizer, Ti as IShadowDOMGlobalStyles, Ii as IShadowDOMStyles, te as ISyntaxInterpreter, dn as ITemplateCompiler, Fr as ITemplateCompilerHooks, nl as ITemplateCompilerRegistration, vr as ITemplateElementFactory, Oi as IViewFactory, Ts as IWindow, If, Ll as IfRegistration, cn as InstructionType, InterpolationBinding, Bn as InterpolationBindingRenderer, InterpolationInstruction, InterpolationPartBinding, Interpretation, IteratorBindingInstruction, Rn as IteratorBindingRenderer, LetBinding, LetBindingInstruction, An as LetElementRenderer, Mi as LifecycleHooks, LifecycleHooksDefinition, LifecycleHooksEntry, ListenerBinding, ListenerBindingInstruction, ListenerBindingOptions, Tn as ListenerBindingRenderer, MultiAttrInstruction, NodeObserverLocator, NoopSVGAnalyzer, OneTimeBindingBehavior, Zo as OneTimeBindingBehaviorRegistration, Jn as OneTimeBindingCommand, xl as OneTimeBindingCommandRegistration, Fo as PendingTemplateController, Portal, Mo as PromiseTemplateController, PropertyBinding, PropertyBindingInstruction, Sn as PropertyBindingRenderer, ue as RefAttributePattern, cl as RefAttributePatternRegistration, RefBinding, yl as RefBindingCommandRegistration, RefBindingInstruction, Cn as RefBindingRenderer, Vo as RejectedTemplateController, Rendering, Repeat, Pl as RepeatRegistration, SVGAnalyzer, ll as SVGAnalyzerRegistration, Qo as SanitizeValueConverter, Tl as SanitizeValueConverterRegistration, SelectValueObserver, SelfBindingBehavior, Hl as SelfBindingBehaviorRegistration, SetAttributeInstruction, Ln as SetAttributeRenderer, SetClassAttributeInstruction, En as SetClassAttributeRenderer, SetPropertyInstruction, wn as SetPropertyRenderer, SetStyleAttributeInstruction, Pn as SetStyleAttributeRenderer, ShadowDOMRegistry, ml as ShortHandBindingSyntax, SignalBindingBehavior, el as SignalBindingBehaviorRegistration, SpreadBindingInstruction, SpreadElementPropBindingInstruction, Un as SpreadRenderer, Zl as StandardConfiguration, ts as State, StyleAttributeAccessor, hr as StyleBindingCommand, Sl as StyleBindingCommandRegistration, Li as StyleConfiguration, StyleElementStyles, StylePropertyBindingInstruction, _n as StylePropertyBindingRenderer, $o as Switch, TemplateCompiler, Nr as TemplateCompilerHooks, kn as TemplateControllerRenderer, TextBindingInstruction, In as TextBindingRenderer, ThrottleBindingBehavior, il as ThrottleBindingBehaviorRegistration, ToViewBindingBehavior, Jo as ToViewBindingBehaviorRegistration, tr as ToViewBindingCommand, wl as ToViewBindingCommandRegistration, rr as TriggerBindingCommand, kl as TriggerBindingCommandRegistration, TwoWayBindingBehavior, sl as TwoWayBindingBehaviorRegistration, ir as TwoWayBindingCommand, bl as TwoWayBindingCommandRegistration, UpdateTriggerBindingBehavior, Wl as UpdateTriggerBindingBehaviorRegistration, ValueAttributeObserver, Ve as ValueConverter, ValueConverterDefinition, ViewFactory, Ji as ViewModelKind, li as Watch, With, _l as WithRegistration, Zt as alias, Wt as allResources, re as attributePattern, qt as bindable, $e as bindingBehavior, Xn as bindingCommand, on as capture, sh as children, Ot as coercer, $s as containerless, Rs as convertToRenderLocation, Bi as cssModules, hi as customAttribute, Ps as customElement, Bs as getEffectiveParentNode, xs as getRef, Qi as isCustomElementController, Yi as isCustomElementViewModel, fn as isInstruction, Is as isRenderLocation, Fi as lifecycleHooks, je as mixinAstEvaluator, Ne as mixinUseScope, Xe as mixingBindingLimited, nn as processContent, Jt as registerAliases, gn as renderer, Ss as setEffectiveParentNode, ws as setRef, Si as shadowCSS, an as slotted, qs as strict, jr as templateCompilerHooks, ai as templateController, _s as useShadowDOM, Me as valueConverter, ni as watch };

