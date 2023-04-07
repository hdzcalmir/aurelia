import { Protocol as t, getPrototypeChain as e, firstDefined as i, kebabCase as s, noop as n, DI as r, Registration as o, emptyArray as l, all as h, mergeArrays as a, IPlatform as c, IContainer as u, optional as f, InstanceProvider as d, resolveAll as m, onResolve as g, fromDefinitionOrDefault as p, pascalCase as v, fromAnnotationOrTypeOrDefault as x, fromAnnotationOrDefinitionOrTypeOrDefault as w, camelCase as b, toArray as y, ILogger as k, emptyObject as A, IServiceLocator as C, transient as B } from "@aurelia/kernel";

import { Metadata as R, isObject as S } from "@aurelia/metadata";

import { subscriberCollection as I, astEvaluate as T, ISignaler as E, connectable as L, astBind as P, astUnbind as _, astAssign as U, ConnectableSwitcher as D, ProxyObservable as $, IExpressionParser as q, IObserverLocator as M, Scope as F, ICoercionConfiguration as O, AccessScopeExpression as V, PrimitiveLiteralExpression as N, PropertyAccessor as j, INodeObserverLocator as H, getObserverLookup as W, SetterObserver as z, IDirtyChecker as G, createIndexMap as X, applyMutationsToIndices as K, getCollectionObserver as Q, synchronizeIndices as Y, BindingContext as Z } from "@aurelia/runtime";

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

const st = R.getOwn;

const nt = R.hasOwn;

const rt = R.define;

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

const Rt = t => t instanceof Array;

const St = t => "function" === typeof t;

const It = t => "string" === typeof t;

const Tt = dt.defineProperty;

const Et = t => {
    throw t;
};

const Lt = dt.is;

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

function Ut(t, e) {
    let i;
    function s(t, e) {
        if (arguments.length > 1) i.property = e;
        rt($t, BindableDefinition.create(e, t, i), t.constructor, e);
        ut(t.constructor, qt.keyFrom(e));
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
    return t.startsWith($t);
}

const $t = ht("bindable");

const qt = wt({
    name: $t,
    keyFrom: t => `${$t}:${t}`,
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
                if (!nt($t, t, n)) ut(t, qt.keyFrom(n));
                rt($t, e, t, n);
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
        const i = $t.length + 1;
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
            for (c = 0; c < h; ++c) s[o++] = st($t, a, l[c].slice(i));
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
    const s = i.type ?? R.get("design:type", e, t) ?? null;
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
        const a = this.u = St(l);
        const c = this.A = St(h);
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
            if (Lt(t, e)) return;
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

const jt = function(t) {
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
        this.U = "";
        this.$ = {};
        this.q = {};
    }
    get pattern() {
        const t = this.U;
        if ("" === t) return null; else return t;
    }
    set pattern(t) {
        if (null == t) {
            this.U = "";
            this.parts = l;
        } else {
            this.U = t;
            this.parts = this.q[t];
        }
    }
    append(t, e) {
        const i = this.$;
        if (void 0 === i[t]) i[t] = e; else i[t] += e;
    }
    next(t) {
        const e = this.$;
        let i;
        if (void 0 !== e[t]) {
            i = this.q;
            if (void 0 === i[t]) i[t] = [ e[t] ]; else i[t].push(e[t]);
            e[t] = void 0;
        }
    }
}

class AttrParsingState {
    get U() {
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
            if (!r.charSpec.isSymbol) e.next(r.U);
            e.pattern = r.U;
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
            de(this.o.ownerDocument.defaultView.MutationObserver, this.o, this);
        }
    }
    unsubscribe(t) {
        if (this.subs.remove(t) && 0 === this.subs.count) me(this.o, this);
    }
    st() {
        ve = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, ve);
    }
}

I(AttributeObserver);

const de = (t, e, i) => {
    if (void 0 === e.$eMObs) e.$eMObs = new Set;
    if (void 0 === e.$mObs) (e.$mObs = new t(ge)).observe(e, {
        attributes: true
    });
    e.$eMObs.add(i);
};

const me = (t, e) => {
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

const ge = t => {
    t[0].target.$eMObs.forEach(pe, t);
};

function pe(t) {
    t.handleMutation(this);
}

let ve;

function xe(t) {
    return function(e) {
        return ye.define(t, e);
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
        return new BindingBehaviorDefinition(e, i(be(e, "name"), s), a(be(e, "aliases"), n.aliases, e.aliases), ye.keyFrom(s));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        Wt(i, e).register(t);
        zt(i, e).register(t);
        Yt(s, ye, i, t);
    }
}

const we = at("binding-behavior");

const be = (t, e) => st(ht(e), t);

const ye = wt({
    name: we,
    keyFrom(t) {
        return `${we}:${t}`;
    },
    isType(t) {
        return St(t) && nt(we, t);
    },
    define(t, e) {
        const i = BindingBehaviorDefinition.create(t, e);
        rt(we, i, i.Type);
        rt(we, i, i);
        ct(e, we);
        return i.Type;
    },
    getDefinition(t) {
        const e = st(we, t);
        if (void 0 === e) throw vt(`AUR0151:${t.name}`);
        return e;
    },
    annotate(t, e, i) {
        rt(ht(e), i, t);
    },
    getAnnotation: be
});

function ke(t) {
    return function(e) {
        return Be.define(t, e);
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
        return new ValueConverterDefinition(e, i(Ce(e, "name"), s), a(Ce(e, "aliases"), n.aliases, e.aliases), Be.keyFrom(s));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        o.singleton(i, e).register(t);
        o.aliasTo(i, e).register(t);
        Yt(s, Be, i, t);
    }
}

const Ae = at("value-converter");

const Ce = (t, e) => st(ht(e), t);

const Be = wt({
    name: Ae,
    keyFrom: t => `${Ae}:${t}`,
    isType(t) {
        return St(t) && nt(Ae, t);
    },
    define(t, e) {
        const i = ValueConverterDefinition.create(t, e);
        rt(Ae, i, i.Type);
        rt(Ae, i, i);
        ct(e, Ae);
        return i.Type;
    },
    getDefinition(t) {
        const e = st(Ae, t);
        if (void 0 === e) throw vt(`AUR0152:${t.name}`);
        return e;
    },
    annotate(t, e, i) {
        rt(ht(e), i, t);
    },
    getAnnotation: Ce
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

const Re = t => {
    _t(t.prototype, "useScope", (function(t) {
        this.s = t;
    }));
};

const Se = (t, e = true) => i => {
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
        return this.l.root.get(E);
    }));
    _t(s, "getConverter", (function(t) {
        const e = Be.keyFrom(t);
        let i = Ie.get(this);
        if (null == i) Ie.set(this, i = new ResourceLookup);
        return i[e] ?? (i[e] = this.l.get(Nt(e)));
    }));
    _t(s, "getBehavior", (function(t) {
        const e = ye.keyFrom(t);
        let i = Ie.get(this);
        if (null == i) Ie.set(this, i = new ResourceLookup);
        return i[e] ?? (i[e] = this.l.get(Nt(e)));
    }));
};

const Ie = new WeakMap;

class ResourceLookup {}

const Te = Ht("IFlushQueue", (t => t.singleton(FlushQueue)));

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
            this.ot.forEach(Ee);
        } finally {
            this.rt = false;
        }
    }
    clear() {
        this.ot.clear();
        this.rt = false;
    }
}

function Ee(t, e, i) {
    i.delete(t);
    t.flush();
}

const Le = new WeakSet;

const Pe = (t, e) => {
    _t(t.prototype, "limit", (function(t) {
        if (Le.has(this)) throw vt(`AURXXXX: a rate limit has already been applied.`);
        Le.add(this);
        const i = e(this, t);
        const s = this[i];
        const n = (...t) => s.call(this, ...t);
        const r = "debounce" === t.type ? _e(t, n, this) : Ue(t, n, this);
        this[i] = r;
        return {
            dispose: () => {
                Le.delete(this);
                r.dispose();
                delete this[i];
            }
        };
    }));
};

const _e = (t, e, i) => {
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

const Ue = (t, e, i) => {
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

const De = {
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
                }), De);
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

Re(AttributeBinding);

Pe(AttributeBinding, (() => "updateTarget"));

L(AttributeBinding);

Se(true)(AttributeBinding);

const $e = {
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
            }), $e);
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
            if (Rt(t)) this.observeCollection(t);
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
        if (Rt(this.v)) this.observeCollection(this.v);
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

Re(InterpolationPartBinding);

Pe(InterpolationPartBinding, (() => "updateTarget"));

L(InterpolationPartBinding);

Se(true)(InterpolationPartBinding);

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
        if (Rt(t)) this.observeCollection(t);
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
        if (Rt(e)) this.observeCollection(e);
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
        }), $e);
        e?.cancel();
    }
}

Re(ContentBinding);

Pe(ContentBinding, (() => "updateTarget"));

L()(ContentBinding);

Se(void 0, false)(ContentBinding);

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

Re(LetBinding);

Pe(LetBinding, (() => "updateTarget"));

L(LetBinding);

Se(true)(LetBinding);

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
        U(this.ast, this.s, this, t);
    }
    handleChange() {
        if (!this.isBound) return;
        this.obs.version++;
        const t = T(this.ast, this.s, this, (2 & this.mode) > 0 ? this : null);
        this.obs.clear();
        const e = 1 !== this.ht.state && (4 & this.ut.type) > 0;
        if (e) {
            qe = this.lt;
            this.lt = this.ct.queueTask((() => {
                this.updateTarget(t);
                this.lt = null;
            }), Me);
            qe?.cancel();
            qe = null;
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
            s.subscribe(this.vt ?? (this.vt = new BindingTargetSubscriber(this, this.l.get(Te))));
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

Re(PropertyBinding);

Pe(PropertyBinding, (t => 4 & t.mode ? "updateSource" : "updateTarget"));

L(PropertyBinding);

Se(true, false)(PropertyBinding);

let qe = null;

const Me = {
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
        U(this.ast, this.s, this, this.target);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        if (T(this.ast, this.s, this, null) === this.target) U(this.ast, this.s, this, null);
        _(this.ast, this.s, this);
        this.s = void 0;
    }
}

Se(false)(RefBinding);

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
        if (St(i)) i = i(t);
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

Re(ListenerBinding);

Pe(ListenerBinding, (() => "callSource"));

Se(true, true)(ListenerBinding);

const Fe = Ht("IAppTask");

class $AppTask {
    constructor(t, e, i) {
        this.c = void 0;
        this.slot = t;
        this.k = e;
        this.cb = i;
    }
    register(t) {
        return this.c = t.register(Gt(Fe, this));
    }
    run() {
        const t = this.k;
        const e = this.cb;
        return null === t ? e() : e(this.c.get(t));
    }
}

const Oe = wt({
    creating: Ve("creating"),
    hydrating: Ve("hydrating"),
    hydrated: Ve("hydrated"),
    activating: Ve("activating"),
    activated: Ve("activated"),
    deactivating: Ve("deactivating"),
    deactivated: Ve("deactivated")
});

function Ve(t) {
    function e(e, i) {
        if (St(i)) return new $AppTask(t, e, i);
        return new $AppTask(t, null, e);
    }
    return e;
}

function Ne(t, e) {
    if (null == t) throw vt(`AUR0772`);
    return function i(s, n, r) {
        const o = null == n;
        const l = o ? s : s.constructor;
        const h = new WatchDefinition(t, o ? e : r.value);
        if (o) {
            if (!St(e) && (null == e || !(e in l.prototype))) throw vt(`AUR0773:${mt(e)}@${l.name}}`);
        } else if (!St(r?.value)) throw vt(`AUR0774:${mt(n)}`);
        We.add(l, h);
        if (Ye(l)) ti(l).watches.push(h);
        if (zs(l)) Ks(l).watches.push(h);
    };
}

class WatchDefinition {
    constructor(t, e) {
        this.expression = t;
        this.callback = e;
    }
}

const je = l;

const He = ht("watch");

const We = wt({
    name: He,
    add(t, e) {
        let i = st(He, t);
        if (null == i) rt(He, i = [], t);
        i.push(e);
    },
    getAnnotation(t) {
        return st(He, t) ?? je;
    }
});

function ze(t) {
    return function(e) {
        return Je(t, e);
    };
}

function Ge(t) {
    return function(e) {
        return Je(It(t) ? {
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
        return new CustomAttributeDefinition(e, i(Qe(e, "name"), s), a(Qe(e, "aliases"), n.aliases, e.aliases), Ke(s), i(Qe(e, "defaultBindingMode"), n.defaultBindingMode, e.defaultBindingMode, 2), i(Qe(e, "isTemplateController"), n.isTemplateController, e.isTemplateController, false), qt.from(e, ...qt.getAll(e), Qe(e, "bindables"), e.bindables, n.bindables), i(Qe(e, "noMultiBindings"), n.noMultiBindings, e.noMultiBindings, false), a(We.getAnnotation(e), e.watches), a(Qe(e, "dependencies"), n.dependencies, e.dependencies));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        Xt(i, e).register(t);
        zt(i, e).register(t);
        Yt(s, ei, i, t);
    }
}

const Xe = at("custom-attribute");

const Ke = t => `${Xe}:${t}`;

const Qe = (t, e) => st(ht(e), t);

const Ye = t => St(t) && nt(Xe, t);

const Ze = (t, e) => gs(t, Ke(e)) ?? void 0;

const Je = (t, e) => {
    const i = CustomAttributeDefinition.create(t, e);
    rt(Xe, i, i.Type);
    rt(Xe, i, i);
    ct(e, Xe);
    return i.Type;
};

const ti = t => {
    const e = st(Xe, t);
    if (void 0 === e) throw vt(`AUR0759:${t.name}`);
    return e;
};

const ei = wt({
    name: Xe,
    keyFrom: Ke,
    isType: Ye,
    for: Ze,
    define: Je,
    getDefinition: ti,
    annotate(t, e, i) {
        rt(ht(e), i, t);
    },
    getAnnotation: Qe
});

const ii = c;

const si = (t, e, i, s) => {
    t.addEventListener(e, i, s);
};

const ni = (t, e, i, s) => {
    t.removeEventListener(e, i, s);
};

const ri = t => {
    let e;
    const i = t.prototype;
    _t(i, "subscribe", (function(t) {
        if (this.subs.add(t) && 1 === this.subs.count) {
            for (e of this.cf.events) si(this.wt, e, this);
            this.bt = true;
            this.yt?.();
        }
    }));
    _t(i, "unsubscribe", (function(t) {
        if (this.subs.remove(t) && 0 === this.subs.count) {
            for (e of this.cf.events) ni(this.wt, e, this);
            this.bt = false;
            this.kt?.();
        }
    }));
    _t(i, "useConfig", (function(t) {
        this.cf = t;
        if (this.bt) {
            for (e of this.cf.events) ni(this.wt, e, this);
            for (e of this.cf.events) si(this.wt, e, this);
        }
    }));
};

const oi = t => {
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
            const i = li(t);
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

function li(t) {
    if (It(t)) return hi(t);
    if ("object" !== typeof t) return l;
    if (t instanceof Array) {
        const e = t.length;
        if (e > 0) {
            const i = [];
            let s = 0;
            for (;e > s; ++s) i.push(...li(t[s]));
            return i;
        } else return l;
    }
    const e = [];
    let i;
    for (i in t) if (Boolean(t[i])) if (i.includes(" ")) e.push(...hi(i)); else e.push(i);
    return e;
}

function hi(t) {
    const e = t.match(/\S+/g);
    if (null === e) return l;
    return e;
}

oi(ClassAttributeAccessor);

function ai(...t) {
    return new CSSModulesProcessorRegistry(t);
}

class CSSModulesProcessorRegistry {
    constructor(t) {
        this.modules = t;
    }
    register(t) {
        var e;
        const i = bt({}, ...this.modules);
        const s = Je({
            name: "class",
            bindables: [ "value" ],
            noMultiBindings: true
        }, (e = class CustomAttributeClass {
            constructor(t) {
                this.Rt = new ClassAttributeAccessor(t);
            }
            binding() {
                this.valueChanged();
            }
            valueChanged() {
                this.Rt.setValue(this.value?.split(/\s+/g).map((t => i[t] || t)) ?? "");
            }
        }, e.inject = [ vs ], e));
        t.register(s, Gt(bs, i));
    }
}

function ci(...t) {
    return new ShadowDOMRegistry(t);
}

const ui = Ht("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
    if (AdoptedStyleSheetsStyles.supported(t.get(ii))) return t.get(AdoptedStyleSheetsStylesFactory);
    return t.get(StyleElementStylesFactory);
}))));

class ShadowDOMRegistry {
    constructor(t) {
        this.css = t;
    }
    register(t) {
        const e = t.get(di);
        const i = t.get(ui);
        t.register(Gt(fi, i.createStyles(this.css, e)));
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

AdoptedStyleSheetsStylesFactory.inject = [ ii ];

class StyleElementStylesFactory {
    constructor(t) {
        this.p = t;
    }
    createStyles(t, e) {
        return new StyleElementStyles(this.p, t, e);
    }
}

StyleElementStylesFactory.inject = [ ii ];

const fi = Ht("IShadowDOMStyles");

const di = Ht("IShadowDOMGlobalStyles", (t => t.instance({
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

const mi = {
    shadowDOM(t) {
        return Oe.creating(u, (e => {
            if (null != t.sharedStyles) {
                const i = e.get(ui);
                e.register(Gt(di, i.createStyles(t.sharedStyles, null)));
            }
        }));
    }
};

const {enter: gi, exit: pi} = D;

const {wrap: vi, unwrap: xi} = $;

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
        if (!Lt(i, e)) this.cb.call(t, i, e, t);
    }
    compute() {
        this.running = true;
        this.obs.version++;
        try {
            gi(this);
            return this.v = xi(this.$get.call(void 0, this.useProxy ? vi(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            pi(this);
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
        this.St = s;
        this.cb = n;
    }
    handleChange(t) {
        const e = this.St;
        const i = this.obj;
        const s = this.v;
        const n = 1 === e.$kind && 1 === this.obs.count;
        if (!n) {
            this.obs.version++;
            t = T(e, this.scope, this, this);
            this.obs.clear();
        }
        if (!Lt(t, s)) {
            this.v = t;
            this.cb.call(i, t, s, i);
        }
    }
    bind() {
        if (this.isBound) return;
        this.obs.version++;
        this.v = T(this.St, this.scope, this, this);
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

L(ComputedWatcher);

L(ExpressionWatcher);

Se(true)(ExpressionWatcher);

const wi = Ht("ILifecycleHooks");

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
        Wt(wi, this.Type).register(t);
    }
}

const bi = new WeakMap;

const yi = ht("lifecycle-hooks");

const ki = wt({
    name: yi,
    define(t, e) {
        const i = LifecycleHooksDefinition.create(t, e);
        rt(yi, i, e);
        ct(e, yi);
        return i.Type;
    },
    resolve(t) {
        let e = bi.get(t);
        if (void 0 === e) {
            bi.set(t, e = new LifecycleHooksLookupImpl);
            const i = t.root;
            const s = i.id === t.id ? t.getAll(wi) : t.has(wi, false) ? i.getAll(wi).concat(t.getAll(wi)) : i.getAll(wi);
            let n;
            let r;
            let o;
            let l;
            let h;
            for (n of s) {
                r = st(yi, n.constructor);
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

function Ai() {
    return function t(e) {
        return ki.define({}, e);
    };
}

const Ci = Ht("IViewFactory");

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

const Bi = Ht("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.Tt ?? (this.Tt = this.Et.getAll(cn, false).reduce(((t, e) => {
            t[e.target] = e;
            return t;
        }), pt()));
    }
    constructor(t) {
        this.Lt = new WeakMap;
        this.Pt = new WeakMap;
        const e = t.root;
        this.p = (this.Et = e).get(ii);
        this.ep = e.get(q);
        this.oL = e.get(M);
        this._t = new FragmentNodeSequence(this.p, this.p.document.createDocumentFragment());
    }
    compile(t, e, i) {
        if (false !== t.needsCompile) {
            const s = this.Lt;
            const n = e.get(an);
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

var Ri;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["host"] = 1] = "host";
    t[t["shadowRoot"] = 2] = "shadowRoot";
    t[t["location"] = 3] = "location";
})(Ri || (Ri = {}));

const Si = {
    optional: true
};

const Ii = new WeakMap;

class Controller {
    get lifecycleHooks() {
        return this.Ut;
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
        return this.Dt;
    }
    get viewModel() {
        return this.$t;
    }
    set viewModel(t) {
        this.$t = t;
        this.Dt = null == t || 2 === this.vmKind ? HooksDefinition.none : new HooksDefinition(t);
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
        this.Ut = null;
        this.state = 0;
        this.qt = false;
        this.$initiator = null;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this.Mt = 0;
        this.Ft = 0;
        this.Ot = 0;
        this.$t = n;
        this.Dt = 2 === e ? HooksDefinition.none : new HooksDefinition(n);
        this.location = o;
        this.r = t.root.get(Bi);
    }
    static getCached(t) {
        return Ii.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (void 0 === e) throw vt(`AUR0500:${t}`);
        return e;
    }
    static $el(t, e, i, s, n = void 0, r = null) {
        if (Ii.has(e)) return Ii.get(e);
        n = n ?? Ks(e.constructor);
        const o = new Controller(t, 0, n, null, e, i, r);
        const l = t.get(f(Vi));
        if (n.dependencies.length > 0) t.register(...n.dependencies);
        Kt(t, Vi, new d("IHydrationContext", new HydrationContext(o, s, l)));
        Ii.set(e, o);
        if (null == s || false !== s.hydrate) o.hE(s, l);
        return o;
    }
    static $attr(t, e, i, s) {
        if (Ii.has(e)) return Ii.get(e);
        s = s ?? ti(e.constructor);
        const n = new Controller(t, 1, s, null, e, i, null);
        if (s.dependencies.length > 0) t.register(...s.dependencies);
        Ii.set(e, n);
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
        const s = this.$t;
        let n = this.definition;
        this.scope = F.create(s, null, true);
        if (n.watches.length > 0) _i(this, i, n, s);
        Ei(this, n, s);
        if (this.Dt.hasDefine) {
            const t = s.define(this, e, n);
            if (void 0 !== t && t !== n) n = CustomElementDefinition.getOrCreate(t);
        }
        this.Ut = ki.resolve(i);
        n.register(i);
        if (null !== n.injectable) Kt(i, n.injectable, new d("definition.injectable", s));
        if (null == t || false !== t.hydrate) {
            this.hS(t);
            this.hC();
        }
    }
    hS(t) {
        if (null != this.Ut.hydrating) this.Ut.hydrating.forEach(Hi, this);
        if (this.Dt.hasHydrating) this.$t.hydrating(this);
        const e = this.jt = this.r.compile(this.definition, this.container, t);
        const {shadowOptions: i, isStrictBinding: s, hasSlots: n, containerless: r} = e;
        let o = this.location;
        this.isStrictBinding = s;
        if (null !== (this.hostController = Gs(this.host, Si))) {
            this.host = this.container.root.get(ii).document.createElement(this.definition.name);
            if (r && null == o) o = this.location = Cs(this.host);
        }
        ps(this.host, Vs, this);
        ps(this.host, this.definition.key, this);
        if (null !== i || n) {
            if (null != o) throw vt(`AUR0501`);
            ps(this.shadowRoot = this.host.attachShadow(i ?? $i), Vs, this);
            ps(this.shadowRoot, this.definition.key, this);
            this.mountTarget = 2;
        } else if (null != o) {
            ps(o, Vs, this);
            ps(o, this.definition.key, this);
            this.mountTarget = 3;
        } else this.mountTarget = 1;
        this.$t.$controller = this;
        this.nodes = this.r.createNodes(e);
        if (void 0 !== this.Ut.hydrated) this.Ut.hydrated.forEach(Wi, this);
        if (this.Dt.hasHydrated) this.$t.hydrated(this);
    }
    hC() {
        this.r.render(this, this.nodes.findTargets(), this.jt, this.host);
        if (void 0 !== this.Ut.created) this.Ut.created.forEach(ji, this);
        if (this.Dt.hasCreated) this.$t.created(this);
    }
    Vt() {
        const t = this.definition;
        const e = this.$t;
        if (t.watches.length > 0) _i(this, this.container, t, e);
        Ei(this, t, e);
        e.$controller = this;
        this.Ut = ki.resolve(this.container);
        if (void 0 !== this.Ut.created) this.Ut.created.forEach(ji, this);
        if (this.Dt.hasCreated) this.$t.created(this);
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
            throw vt(`AUR0503:${this.name} ${Fi(this.state)}`);
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
        if (2 !== this.vmKind && null != this.Ut.binding) s = m(...this.Ut.binding.map(zi, this));
        if (this.Dt.hasBinding) s = m(s, this.$t.binding(this.$initiator, this.parent));
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
        if (2 !== this.vmKind && null != this.Ut.bound) i = m(...this.Ut.bound.map(Gi, this));
        if (this.Dt.hasBound) i = m(i, this.$t.bound(this.$initiator, this.parent));
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
                const e = t.has(fi, false) ? t.get(fi) : t.get(di);
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
        if (2 !== this.vmKind && null != this.Ut.attaching) e = m(...this.Ut.attaching.map(Xi, this));
        if (this.Dt.hasAttaching) e = m(e, this.$t.attaching(this.$initiator, this.parent));
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
            throw vt(`AUR0505:${this.name} ${Fi(this.state)}`);
        }
        this.$initiator = t;
        if (t === this) this.Qt();
        let i = 0;
        let s;
        if (null !== this.children) for (i = 0; i < this.children.length; ++i) void this.children[i].deactivate(t, this);
        if (2 !== this.vmKind && null != this.Ut.detaching) s = m(...this.Ut.detaching.map(Qi, this));
        if (this.Dt.hasDetaching) s = m(s, this.$t.detaching(this.$initiator, this.parent));
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
            Zi = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            Zi();
            Zi = void 0;
        }
    }
    zt(t) {
        if (void 0 !== this.$promise) {
            Ji = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            Ji(t);
            Ji = void 0;
        }
        if (this.$initiator !== this) this.parent.zt(t);
    }
    Ht() {
        ++this.Mt;
        if (this.$initiator !== this) this.parent.Ht();
    }
    Kt() {
        if (0 === --this.Mt) {
            if (2 !== this.vmKind && null != this.Ut.attached) ts = m(...this.Ut.attached.map(Ki, this));
            if (this.Dt.hasAttached) ts = m(ts, this.$t.attached(this.$initiator));
            if (Bt(ts)) {
                this.Wt();
                ts.then((() => {
                    this.state = 2;
                    this.Zt();
                    if (this.$initiator !== this) this.parent.Kt();
                })).catch((t => {
                    this.zt(t);
                }));
                ts = void 0;
                return;
            }
            ts = void 0;
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
                if (2 !== t.vmKind && null != t.Ut.unbinding) e = m(...t.Ut.unbinding.map(Yi, this));
                if (t.Dt.hasUnbinding) {
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
            return ti(this.$t.constructor).name === t;

          case 0:
            return Ks(this.$t.constructor).name === t;

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
            ps(t, Vs, this);
            ps(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = 1;
        return this;
    }
    setShadowRoot(t) {
        if (0 === this.vmKind) {
            ps(t, Vs, this);
            ps(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = 2;
        return this;
    }
    setLocation(t) {
        if (0 === this.vmKind) {
            ps(t, Vs, this);
            ps(t, this.definition.key, this);
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
        if (this.Dt.hasDispose) this.$t.dispose();
        if (null !== this.children) {
            this.children.forEach(Ni);
            this.children = null;
        }
        this.hostController = null;
        this.scope = null;
        this.nodes = null;
        this.location = null;
        this.viewFactory = null;
        if (null !== this.$t) {
            Ii.delete(this.$t);
            this.$t = null;
        }
        this.$t = null;
        this.host = null;
        this.shadowRoot = null;
        this.container.disposeResolvers();
    }
    accept(t) {
        if (true === t(this)) return true;
        if (this.Dt.hasAccept && true === this.$t.accept(t)) return true;
        if (null !== this.children) {
            const {children: e} = this;
            for (let i = 0, s = e.length; i < s; ++i) if (true === e[i].accept(t)) return true;
        }
    }
}

function Ti(t) {
    let e = t.$observers;
    if (void 0 === e) Reflect.defineProperty(t, "$observers", {
        enumerable: false,
        value: e = {}
    });
    return e;
}

function Ei(t, e, i) {
    const s = e.bindables;
    const n = yt(s);
    const r = n.length;
    if (r > 0) {
        let e;
        let o;
        let l = 0;
        const h = Ti(i);
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

const Li = new Map;

const Pi = t => {
    let e = Li.get(t);
    if (null == e) {
        e = new V(t, 0);
        Li.set(t, e);
    }
    return e;
};

function _i(t, e, i, s) {
    const n = e.get(M);
    const r = e.get(q);
    const o = i.watches;
    const l = 0 === t.vmKind ? t.scope : F.create(s, null, true);
    const h = o.length;
    let a;
    let c;
    let u;
    let f = 0;
    for (;h > f; ++f) {
        ({expression: a, callback: c} = o[f]);
        c = St(c) ? c : Reflect.get(s, c);
        if (!St(c)) throw vt(`AUR0506:${mt(c)}`);
        if (St(a)) t.addBinding(new ComputedWatcher(s, n, a, c, true)); else {
            u = It(a) ? r.parse(a, 16) : Pi(a);
            t.addBinding(new ExpressionWatcher(l, e, n, u, c));
        }
    }
}

function Ui(t) {
    return t instanceof Controller && 0 === t.vmKind;
}

function Di(t) {
    return S(t) && zs(t.constructor);
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

const $i = {
    mode: "open"
};

var qi;

(function(t) {
    t[t["customElement"] = 0] = "customElement";
    t[t["customAttribute"] = 1] = "customAttribute";
    t[t["synthetic"] = 2] = "synthetic";
})(qi || (qi = {}));

var Mi;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["activating"] = 1] = "activating";
    t[t["activated"] = 2] = "activated";
    t[t["deactivating"] = 4] = "deactivating";
    t[t["deactivated"] = 8] = "deactivated";
    t[t["released"] = 16] = "released";
    t[t["disposed"] = 32] = "disposed";
})(Mi || (Mi = {}));

function Fi(t) {
    const e = [];
    if (1 === (1 & t)) e.push("activating");
    if (2 === (2 & t)) e.push("activated");
    if (4 === (4 & t)) e.push("deactivating");
    if (8 === (8 & t)) e.push("deactivated");
    if (16 === (16 & t)) e.push("released");
    if (32 === (32 & t)) e.push("disposed");
    return 0 === e.length ? "none" : e.join("|");
}

const Oi = Ht("IController");

const Vi = Ht("IHydrationContext");

class HydrationContext {
    constructor(t, e, i) {
        this.instruction = e;
        this.parent = i;
        this.controller = t;
    }
}

function Ni(t) {
    t.dispose();
}

function ji(t) {
    t.instance.created(this.$t, this);
}

function Hi(t) {
    t.instance.hydrating(this.$t, this);
}

function Wi(t) {
    t.instance.hydrated(this.$t, this);
}

function zi(t) {
    return t.instance.binding(this.$t, this["$initiator"], this.parent);
}

function Gi(t) {
    return t.instance.bound(this.$t, this["$initiator"], this.parent);
}

function Xi(t) {
    return t.instance.attaching(this.$t, this["$initiator"], this.parent);
}

function Ki(t) {
    return t.instance.attached(this.$t, this["$initiator"]);
}

function Qi(t) {
    return t.instance.detaching(this.$t, this["$initiator"], this.parent);
}

function Yi(t) {
    return t.instance.unbinding(this.$t, this["$initiator"], this.parent);
}

let Zi;

let Ji;

let ts;

const es = Ht("IAppRoot");

class AppRoot {
    constructor(t, e, i, s) {
        this.config = t;
        this.platform = e;
        this.container = i;
        this.controller = void 0;
        this.ee = void 0;
        this.host = t.host;
        s.prepare(this);
        Kt(i, e.HTMLElement, Kt(i, e.Element, Kt(i, vs, new d("ElementResolver", t.host))));
        this.ee = g(this.ie("creating"), (() => {
            const e = t.component;
            const s = i.createChild();
            let n;
            if (zs(e)) n = this.container.get(e); else n = t.component;
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
        return m(...this.container.getAll(Fe).reduce(((e, i) => {
            if (i.slot === t) e.push(i.run());
            return e;
        }), []));
    }
    dispose() {
        this.controller?.dispose();
    }
}

const is = "au-start";

const ss = "au-end";

const ns = (t, e) => t.document.createElement(e);

const rs = (t, e) => t.document.createComment(e);

const os = t => {
    const e = rs(t, ss);
    e.$start = rs(t, is);
    return e;
};

const ls = (t, e) => t.document.createTextNode(e);

const hs = (t, e, i) => t.insertBefore(e, i);

const as = (t, e, i) => {
    if (null === t) return;
    const s = i.length;
    let n = 0;
    while (s > n) {
        t.insertBefore(i[n], e);
        ++n;
    }
};

const cs = t => t.previousSibling;

const us = (t, e) => t.content.appendChild(e);

const fs = (t, e) => {
    const i = e.length;
    let s = 0;
    while (i > s) {
        t.content.appendChild(e[s]);
        ++s;
    }
};

const ds = t => {
    const e = t.previousSibling;
    let i;
    if (8 === e?.nodeType && "au-end" === e.textContent) {
        i = e;
        if (null == (i.$start = i.previousSibling)) throw ms();
        t.parentNode?.removeChild(t);
        return i;
    } else throw ms();
};

const ms = () => vt(`AURxxxx`);

class Refs {}

function gs(t, e) {
    return t.$au?.[e] ?? null;
}

function ps(t, e, i) {
    var s;
    ((s = t).$au ?? (s.$au = new Refs))[e] = i;
}

const vs = Ht("INode");

const xs = Ht("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(es, true)) return t.get(es).host;
    return t.get(ii).document;
}))));

const ws = Ht("IRenderLocation");

const bs = Ht("CssModules");

const ys = new WeakMap;

function ks(t) {
    if (ys.has(t)) return ys.get(t);
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
        const e = Gs(t);
        if (void 0 === e) return null;
        if (2 === e.mountTarget) return ks(e.host);
    }
    return t.parentNode;
}

function As(t, e) {
    if (void 0 !== t.platform && !(t instanceof t.platform.Node)) {
        const i = t.childNodes;
        for (let t = 0, s = i.length; t < s; ++t) ys.set(i[t], e);
    } else ys.set(t, e);
}

function Cs(t) {
    if (Bs(t)) return t;
    const e = t.ownerDocument.createComment("au-end");
    const i = e.$start = t.ownerDocument.createComment("au-start");
    const s = t.parentNode;
    if (null !== s) {
        s.replaceChild(e, t);
        s.insertBefore(i, e);
    }
    return e;
}

function Bs(t) {
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
            if ("AU-M" === r.nodeName) o[s] = ds(r); else o[s] = r;
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
        if (Bs(t)) this.ref = t; else {
            this.next = t;
            this.le();
        }
    }
    le() {
        if (void 0 !== this.next) this.ref = this.next.firstChild; else this.ref = void 0;
    }
}

const Rs = Ht("IWindow", (t => t.callback((t => t.get(ii).window))));

const Ss = Ht("ILocation", (t => t.callback((t => t.get(Rs).location))));

const Is = Ht("IHistory", (t => t.callback((t => t.get(Rs).history))));

function Ts(t) {
    return function(e) {
        return Ws(t, e);
    };
}

function Es(t) {
    if (void 0 === t) return function(t) {
        Hs(t, "shadowOptions", {
            mode: "open"
        });
    };
    if (!St(t)) return function(e) {
        Hs(e, "shadowOptions", t);
    };
    Hs(t, "shadowOptions", {
        mode: "open"
    });
}

function Ls(t) {
    if (void 0 === t) return function(t) {
        Ps(t);
    };
    Ps(t);
}

function Ps(t) {
    const e = st(Vs, t);
    if (void 0 === e) {
        Hs(t, "containerless", true);
        return;
    }
    e.containerless = true;
}

function _s(t) {
    if (void 0 === t) return function(t) {
        Hs(t, "isStrictBinding", true);
    };
    Hs(t, "isStrictBinding", true);
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
            const s = p("name", i, js);
            if (St(i.Type)) e = i.Type; else e = Ys(v(s));
            return new CustomElementDefinition(e, s, a(i.aliases), p("key", i, (() => Ns(s))), p("cache", i, $s), p("capture", i, Ms), p("template", i, qs), a(i.instructions), a(i.dependencies), p("injectable", i, qs), p("needsCompile", i, Fs), a(i.surrogates), qt.from(e, i.bindables), p("containerless", i, Ms), p("isStrictBinding", i, Ms), p("shadowOptions", i, qs), p("hasSlots", i, Ms), p("enhance", i, Ms), p("watches", i, Os), x("processContent", e, qs));
        }
        if (It(t)) return new CustomElementDefinition(e, t, a(Xs(e, "aliases"), e.aliases), Ns(t), x("cache", e, $s), x("capture", e, Ms), x("template", e, qs), a(Xs(e, "instructions"), e.instructions), a(Xs(e, "dependencies"), e.dependencies), x("injectable", e, qs), x("needsCompile", e, Fs), a(Xs(e, "surrogates"), e.surrogates), qt.from(e, ...qt.getAll(e), Xs(e, "bindables"), e.bindables), x("containerless", e, Ms), x("isStrictBinding", e, Ms), x("shadowOptions", e, qs), x("hasSlots", e, Ms), x("enhance", e, Ms), a(We.getAnnotation(e), e.watches), x("processContent", e, qs));
        const i = p("name", t, js);
        return new CustomElementDefinition(e, i, a(Xs(e, "aliases"), t.aliases, e.aliases), Ns(i), w("cache", t, e, $s), w("capture", t, e, Ms), w("template", t, e, qs), a(Xs(e, "instructions"), t.instructions, e.instructions), a(Xs(e, "dependencies"), t.dependencies, e.dependencies), w("injectable", t, e, qs), w("needsCompile", t, e, Fs), a(Xs(e, "surrogates"), t.surrogates, e.surrogates), qt.from(e, ...qt.getAll(e), Xs(e, "bindables"), e.bindables, t.bindables), w("containerless", t, e, Ms), w("isStrictBinding", t, e, Ms), w("shadowOptions", t, e, qs), w("hasSlots", t, e, Ms), w("enhance", t, e, Ms), a(t.watches, We.getAnnotation(e), e.watches), w("processContent", t, e, qs));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) return t;
        if (Us.has(t)) return Us.get(t);
        const e = CustomElementDefinition.create(t);
        Us.set(t, e);
        rt(Vs, e, e.Type);
        return e;
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        if (!t.has(i, false)) {
            Xt(i, e).register(t);
            zt(i, e).register(t);
            Yt(s, Zs, i, t);
        }
    }
}

const Ds = {
    name: void 0,
    searchParents: false,
    optional: false
};

const $s = () => 0;

const qs = () => null;

const Ms = () => false;

const Fs = () => true;

const Os = () => l;

const Vs = at("custom-element");

const Ns = t => `${Vs}:${t}`;

const js = (() => {
    let t = 0;
    return () => `unnamed-${++t}`;
})();

const Hs = (t, e, i) => {
    rt(ht(e), i, t);
};

const Ws = (t, e) => {
    const i = CustomElementDefinition.create(t, e);
    rt(Vs, i, i.Type);
    rt(Vs, i, i);
    ct(i.Type, Vs);
    return i.Type;
};

const zs = t => St(t) && nt(Vs, t);

const Gs = (t, e = Ds) => {
    if (void 0 === e.name && true !== e.searchParents) {
        const i = gs(t, Vs);
        if (null === i) {
            if (true === e.optional) return null;
            throw vt(`AUR0762`);
        }
        return i;
    }
    if (void 0 !== e.name) {
        if (true !== e.searchParents) {
            const i = gs(t, Vs);
            if (null === i) throw vt(`AUR0763`);
            if (i.is(e.name)) return i;
            return;
        }
        let i = t;
        let s = false;
        while (null !== i) {
            const t = gs(i, Vs);
            if (null !== t) {
                s = true;
                if (t.is(e.name)) return t;
            }
            i = ks(i);
        }
        if (s) return;
        throw vt(`AUR0764`);
    }
    let i = t;
    while (null !== i) {
        const t = gs(i, Vs);
        if (null !== t) return t;
        i = ks(i);
    }
    throw vt(`AUR0765`);
};

const Xs = (t, e) => st(ht(e), t);

const Ks = t => {
    const e = st(Vs, t);
    if (void 0 === e) throw vt(`AUR0760:${t.name}`);
    return e;
};

const Qs = () => {
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

const Ys = function() {
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

const Zs = wt({
    name: Vs,
    keyFrom: Ns,
    isType: zs,
    for: Gs,
    define: Ws,
    getDefinition: Ks,
    annotate: Hs,
    getAnnotation: Xs,
    generateName: js,
    createInjectable: Qs,
    generateType: Ys
});

const Js = ht("processContent");

function tn(t) {
    return void 0 === t ? function(t, e, i) {
        rt(Js, en(t, e), t);
    } : function(e) {
        t = en(e, t);
        const i = st(Vs, e);
        if (void 0 !== i) i.processContent = t; else rt(Js, t, e);
        return e;
    };
}

function en(t, e) {
    if (It(e)) e = t[e];
    if (!St(e)) throw vt(`AUR0766:${typeof e}`);
    return e;
}

function sn(t) {
    return function(e) {
        const i = St(t) ? t : true;
        Hs(e, "capture", i);
        if (zs(e)) Ks(e).capture = i;
    };
}

const nn = Ht("IProjections");

const rn = Ht("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

var on;

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
})(on || (on = {}));

const ln = Ht("Instruction");

function hn(t) {
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

const an = Ht("ITemplateCompiler");

const cn = Ht("IRenderer");

function un(t) {
    return function e(i) {
        i.register = function(t) {
            Wt(cn, this).register(t);
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

function fn(t, e, i) {
    if (It(e)) return t.parse(e, i);
    return e;
}

function dn(t) {
    if (null != t.viewModel) return t.viewModel;
    return t;
}

function mn(t, e) {
    if ("element" === e) return t;
    switch (e) {
      case "controller":
        return Gs(t);

      case "view":
        throw vt(`AUR0750`);

      case "view-model":
        return Gs(t).viewModel;

      default:
        {
            const i = Ze(t, e);
            if (void 0 !== i) return i.viewModel;
            const s = Gs(t, {
                name: e
            });
            if (void 0 === s) throw vt(`AUR0751:${e}`);
            return s.viewModel;
        }
    }
}

let gn = class SetPropertyRenderer {
    render(t, e, i) {
        const s = dn(e);
        if (void 0 !== s.$observers?.[i.to]) s.$observers[i.to].setValue(i.value); else s[i.to] = i.value;
    }
};

gn = et([ un("re") ], gn);

let pn = class CustomElementRenderer {
    static get inject() {
        return [ Bi ];
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
            o = f.find(Zs, c);
            if (null == o) throw vt(`AUR0752:${c}@${t["name"]}`);
            break;

          default:
            o = c;
        }
        const m = i.containerless || o.containerless;
        const g = m ? Cs(e) : null;
        const p = Mn(s, t, e, i, g, null == u ? void 0 : new AuSlotsInfo(kt(u)));
        l = o.Type;
        h = p.invoke(l);
        Kt(p, l, new d(o.key, h));
        a = Controller.$el(p, h, e, i, o, g);
        ps(e, o.key, a);
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

pn = et([ un("ra") ], pn);

let vn = class CustomAttributeRenderer {
    static get inject() {
        return [ Bi ];
    }
    constructor(t) {
        this.r = t;
    }
    render(t, e, i, s, n, r) {
        let o = t.container;
        let l;
        switch (typeof i.res) {
          case "string":
            l = o.find(ei, i.res);
            if (null == l) throw vt(`AUR0753:${i.res}@${t["name"]}`);
            break;

          default:
            l = i.res;
        }
        const h = Fn(s, l, t, e, i, void 0, void 0);
        const a = Controller.$attr(h.ctn, h.vm, e, l);
        ps(e, l.key, a);
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

vn = et([ un("rb") ], vn);

let xn = class TemplateControllerRenderer {
    static get inject() {
        return [ Bi, ii ];
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
            l = o.find(ei, i.res);
            if (null == l) throw vt(`AUR0754:${i.res}@${t["name"]}`);
            break;

          default:
            l = i.res;
        }
        const h = this.r.getViewFactory(i.def, o);
        const a = Cs(e);
        const c = Fn(this.p, l, t, e, i, h, a);
        const u = Controller.$attr(c.ctn, c.vm, e, l);
        ps(a, l.key, u);
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

xn = et([ un("rc") ], xn);

let wn = class LetElementRenderer {
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
            u = fn(n, c.from, 16);
            t.addBinding(new LetBinding(h, r, u, c.to, l));
            ++f;
        }
    }
};

wn = et([ un("rd") ], wn);

let bn = class RefBindingRenderer {
    render(t, e, i, s, n) {
        t.addBinding(new RefBinding(t.container, fn(n, i.from, 16), mn(e, i.to)));
    }
};

bn = et([ un("rj") ], bn);

let yn = class InterpolationBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new InterpolationBinding(t, t.container, r, s.domWriteQueue, fn(n, i.from, 1), dn(e), i.to, 2));
    }
};

yn = et([ un("rf") ], yn);

let kn = class PropertyBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, fn(n, i.from, 16), dn(e), i.to, i.mode));
    }
};

kn = et([ un("rg") ], kn);

let An = class IteratorBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, fn(n, i.forOf, 2), dn(e), i.to, 2));
    }
};

An = et([ un("rk") ], An);

let Cn = class TextBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, s.domWriteQueue, s, fn(n, i.from, 16), hs(e.parentNode, ls(s, ""), e), i.strict));
    }
};

Cn = et([ un("ha") ], Cn);

let Bn = class ListenerBindingRenderer {
    render(t, e, i, s, n) {
        t.addBinding(new ListenerBinding(t.container, fn(n, i.from, 8), e, i.to, new ListenerBindingOptions(i.preventDefault, i.capture)));
    }
};

Bn = et([ un("hb") ], Bn);

let Rn = class SetAttributeRenderer {
    render(t, e, i) {
        e.setAttribute(i.to, i.value);
    }
};

Rn = et([ un("he") ], Rn);

let Sn = class SetClassAttributeRenderer {
    render(t, e, i) {
        Pn(e.classList, i.value);
    }
};

Sn = et([ un("hf") ], Sn);

let In = class SetStyleAttributeRenderer {
    render(t, e, i) {
        e.style.cssText += i.value;
    }
};

In = et([ un("hg") ], In);

let Tn = class StylePropertyBindingRenderer {
    render(t, e, i, s, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, s.domWriteQueue, fn(n, i.from, 16), e.style, i.to, 2));
    }
};

Tn = et([ un("hd") ], Tn);

let En = class AttributeBindingRenderer {
    render(t, e, i, s, n, r) {
        const o = t.container;
        const l = o.has(bs, false) ? o.get(bs) : null;
        t.addBinding(new AttributeBinding(t, o, r, s.domWriteQueue, fn(n, i.from, 16), e, i.attr, null == l ? i.to : i.to.split(/\s/g).map((t => l[t] ?? t)).join(" "), 2));
    }
};

En = et([ un("hc") ], En);

let Ln = class SpreadRenderer {
    static get inject() {
        return [ an, Bi ];
    }
    constructor(t, e) {
        this.he = t;
        this.r = e;
    }
    render(t, e, i, s, n, r) {
        const o = t.container;
        const h = o.get(Vi);
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
            const h = _n(o);
            const f = this.he.compileSpread(o.controller.definition, o.instruction?.captures ?? l, o.controller.container, e);
            let d;
            for (d of f) switch (d.type) {
              case "hs":
                u(i + 1);
                break;

              case "hp":
                a[d.instructions.type].render(h, Gs(e), d.instructions, s, n, r);
                break;

              default:
                a[d.type].render(h, e, d, s, n, r);
            }
            t.addBinding(h);
        };
        u(0);
    }
};

Ln = et([ un("hs") ], Ln);

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
        this.ae = t;
        this.ce = e;
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
        const e = this.scope = this.ce.controller.scope.parent ?? void 0;
        if (null == e) throw vt("Invalid spreading. Context scope is null/undefined");
        this.ae.forEach((t => t.bind(e)));
    }
    unbind() {
        this.ae.forEach((t => t.unbind()));
        this.isBound = false;
    }
    addBinding(t) {
        this.ae.push(t);
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

function Pn(t, e) {
    const i = e.length;
    let s = 0;
    for (let n = 0; n < i; ++n) if (32 === e.charCodeAt(n)) {
        if (n !== s) t.add(e.slice(s, n));
        s = n + 1;
    } else if (n + 1 === i) t.add(e.slice(s));
}

const _n = t => new SpreadBinding([], t);

const Un = "IController";

const Dn = "IInstruction";

const $n = "IRenderLocation";

const qn = "IAuSlotsInfo";

function Mn(t, e, i, s, n, r) {
    const o = e.container.createChild();
    Kt(o, t.HTMLElement, Kt(o, t.Element, Kt(o, vs, new d("ElementResolver", i))));
    Kt(o, Oi, new d(Un, e));
    Kt(o, ln, new d(Dn, s));
    Kt(o, ws, null == n ? On : new RenderLocationProvider(n));
    Kt(o, Ci, Vn);
    Kt(o, rn, null == r ? Nn : new d(qn, r));
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

function Fn(t, e, i, s, n, r, o, l) {
    const h = i.container.createChild();
    Kt(h, t.HTMLElement, Kt(h, t.Element, Kt(h, vs, new d("ElementResolver", s))));
    i = i instanceof Controller ? i : i.ctrl;
    Kt(h, Oi, new d(Un, i));
    Kt(h, ln, new d(Dn, n));
    Kt(h, ws, null == o ? On : new d($n, o));
    Kt(h, Ci, null == r ? Vn : new ViewFactoryProvider(r));
    Kt(h, rn, null == l ? Nn : new d(qn, l));
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

const On = new RenderLocationProvider(null);

const Vn = new ViewFactoryProvider(null);

const Nn = new d(qn, new AuSlotsInfo(l));

var jn;

(function(t) {
    t[t["None"] = 0] = "None";
    t[t["IgnoreAttr"] = 1] = "IgnoreAttr";
})(jn || (jn = {}));

function Hn(t) {
    return function(e) {
        return Xn.define(t, e);
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
        return new BindingCommandDefinition(e, i(Gn(e, "name"), s), a(Gn(e, "aliases"), n.aliases, e.aliases), zn(s), i(Gn(e, "type"), n.type, e.type, null));
    }
    register(t) {
        const {Type: e, key: i, aliases: s} = this;
        Wt(i, e).register(t);
        zt(i, e).register(t);
        Yt(s, Xn, i, t);
    }
}

const Wn = at("binding-command");

const zn = t => `${Wn}:${t}`;

const Gn = (t, e) => st(ht(e), t);

const Xn = wt({
    name: Wn,
    keyFrom: zn,
    define(t, e) {
        const i = BindingCommandDefinition.create(t, e);
        rt(Wn, i, i.Type);
        rt(Wn, i, i);
        ct(e, Wn);
        return i.Type;
    },
    getAnnotation: Gn
});

let Kn = class OneTimeBindingCommand {
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

Kn = et([ Hn("one-time") ], Kn);

let Qn = class ToViewBindingCommand {
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

Qn = et([ Hn("to-view") ], Qn);

let Yn = class FromViewBindingCommand {
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

Yn = et([ Hn("from-view") ], Yn);

let Zn = class TwoWayBindingCommand {
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

Zn = et([ Hn("two-way") ], Zn);

let Jn = class DefaultBindingCommand {
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

Jn = et([ Hn("bind") ], Jn);

let tr = class ForBindingCommand {
    get type() {
        return 0;
    }
    static get inject() {
        return [ ie ];
    }
    constructor(t) {
        this.ue = t;
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
                const r = this.ue.parse(t, s);
                n = [ new MultiAttrInstruction(s, r.target, r.command) ];
            }
        }
        return new IteratorBindingInstruction(s, i, n);
    }
};

tr = et([ Hn("for") ], tr);

let er = class TriggerBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, 8), t.attr.target, true, false);
    }
};

er = et([ Hn("trigger") ], er);

let ir = class CaptureBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, 8), t.attr.target, false, true);
    }
};

ir = et([ Hn("capture") ], ir);

let sr = class AttrBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction(t.attr.target, e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

sr = et([ Hn("attr") ], sr);

let nr = class StyleBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction("style", e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

nr = et([ Hn("style") ], nr);

let rr = class ClassBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new AttributeBindingInstruction("class", e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

rr = et([ Hn("class") ], rr);

let or = class RefBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new RefBindingInstruction(e.parse(t.attr.rawValue, 16), t.attr.target);
    }
};

or = et([ Hn("ref") ], or);

let lr = class SpreadBindingCommand {
    get type() {
        return 1;
    }
    build(t) {
        return new SpreadBindingInstruction;
    }
};

lr = et([ Hn("...$attrs") ], lr);

const hr = Ht("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

const ar = t => {
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
        return Wt(hr, this).register(t);
    }
    constructor(t) {
        this.fe = bt(pt(), {
            a: ar("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage target transform xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            altGlyph: ar("class dx dy externalResourcesRequired format glyphRef id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            altglyph: pt(),
            altGlyphDef: ar("id xml:base xml:lang xml:space"),
            altglyphdef: pt(),
            altGlyphItem: ar("id xml:base xml:lang xml:space"),
            altglyphitem: pt(),
            animate: ar("accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            animateColor: ar("accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            animateMotion: ar("accumulate additive begin by calcMode dur end externalResourcesRequired fill from id keyPoints keySplines keyTimes max min onbegin onend onload onrepeat origin path repeatCount repeatDur requiredExtensions requiredFeatures restart rotate systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            animateTransform: ar("accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to type values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            circle: ar("class cx cy externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup r requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            clipPath: ar("class clipPathUnits externalResourcesRequired id requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            "color-profile": ar("id local name rendering-intent xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            cursor: ar("externalResourcesRequired id requiredExtensions requiredFeatures systemLanguage x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            defs: ar("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            desc: ar("class id style xml:base xml:lang xml:space"),
            ellipse: ar("class cx cy externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rx ry style systemLanguage transform xml:base xml:lang xml:space"),
            feBlend: ar("class height id in in2 mode result style width x xml:base xml:lang xml:space y"),
            feColorMatrix: ar("class height id in result style type values width x xml:base xml:lang xml:space y"),
            feComponentTransfer: ar("class height id in result style width x xml:base xml:lang xml:space y"),
            feComposite: ar("class height id in in2 k1 k2 k3 k4 operator result style width x xml:base xml:lang xml:space y"),
            feConvolveMatrix: ar("bias class divisor edgeMode height id in kernelMatrix kernelUnitLength order preserveAlpha result style targetX targetY width x xml:base xml:lang xml:space y"),
            feDiffuseLighting: ar("class diffuseConstant height id in kernelUnitLength result style surfaceScale width x xml:base xml:lang xml:space y"),
            feDisplacementMap: ar("class height id in in2 result scale style width x xChannelSelector xml:base xml:lang xml:space y yChannelSelector"),
            feDistantLight: ar("azimuth elevation id xml:base xml:lang xml:space"),
            feFlood: ar("class height id result style width x xml:base xml:lang xml:space y"),
            feFuncA: ar("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feFuncB: ar("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feFuncG: ar("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feFuncR: ar("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feGaussianBlur: ar("class height id in result stdDeviation style width x xml:base xml:lang xml:space y"),
            feImage: ar("class externalResourcesRequired height id preserveAspectRatio result style width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            feMerge: ar("class height id result style width x xml:base xml:lang xml:space y"),
            feMergeNode: ar("id xml:base xml:lang xml:space"),
            feMorphology: ar("class height id in operator radius result style width x xml:base xml:lang xml:space y"),
            feOffset: ar("class dx dy height id in result style width x xml:base xml:lang xml:space y"),
            fePointLight: ar("id x xml:base xml:lang xml:space y z"),
            feSpecularLighting: ar("class height id in kernelUnitLength result specularConstant specularExponent style surfaceScale width x xml:base xml:lang xml:space y"),
            feSpotLight: ar("id limitingConeAngle pointsAtX pointsAtY pointsAtZ specularExponent x xml:base xml:lang xml:space y z"),
            feTile: ar("class height id in result style width x xml:base xml:lang xml:space y"),
            feTurbulence: ar("baseFrequency class height id numOctaves result seed stitchTiles style type width x xml:base xml:lang xml:space y"),
            filter: ar("class externalResourcesRequired filterRes filterUnits height id primitiveUnits style width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            font: ar("class externalResourcesRequired horiz-adv-x horiz-origin-x horiz-origin-y id style vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space"),
            "font-face": ar("accent-height alphabetic ascent bbox cap-height descent font-family font-size font-stretch font-style font-variant font-weight hanging id ideographic mathematical overline-position overline-thickness panose-1 slope stemh stemv strikethrough-position strikethrough-thickness underline-position underline-thickness unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical widths x-height xml:base xml:lang xml:space"),
            "font-face-format": ar("id string xml:base xml:lang xml:space"),
            "font-face-name": ar("id name xml:base xml:lang xml:space"),
            "font-face-src": ar("id xml:base xml:lang xml:space"),
            "font-face-uri": ar("id xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            foreignObject: ar("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform width x xml:base xml:lang xml:space y"),
            g: ar("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            glyph: ar("arabic-form class d glyph-name horiz-adv-x id lang orientation style unicode vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space"),
            glyphRef: ar("class dx dy format glyphRef id style x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            glyphref: pt(),
            hkern: ar("g1 g2 id k u1 u2 xml:base xml:lang xml:space"),
            image: ar("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage transform width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            line: ar("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform x1 x2 xml:base xml:lang xml:space y1 y2"),
            linearGradient: ar("class externalResourcesRequired gradientTransform gradientUnits id spreadMethod style x1 x2 xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space y1 y2"),
            marker: ar("class externalResourcesRequired id markerHeight markerUnits markerWidth orient preserveAspectRatio refX refY style viewBox xml:base xml:lang xml:space"),
            mask: ar("class externalResourcesRequired height id maskContentUnits maskUnits requiredExtensions requiredFeatures style systemLanguage width x xml:base xml:lang xml:space y"),
            metadata: ar("id xml:base xml:lang xml:space"),
            "missing-glyph": ar("class d horiz-adv-x id style vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space"),
            mpath: ar("externalResourcesRequired id xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            path: ar("class d externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup pathLength requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            pattern: ar("class externalResourcesRequired height id patternContentUnits patternTransform patternUnits preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage viewBox width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            polygon: ar("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup points requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            polyline: ar("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup points requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            radialGradient: ar("class cx cy externalResourcesRequired fx fy gradientTransform gradientUnits id r spreadMethod style xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space"),
            rect: ar("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rx ry style systemLanguage transform width x xml:base xml:lang xml:space y"),
            script: ar("externalResourcesRequired id type xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            set: ar("attributeName attributeType begin dur end externalResourcesRequired fill id max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            stop: ar("class id offset style xml:base xml:lang xml:space"),
            style: ar("id media title type xml:base xml:lang xml:space"),
            svg: ar("baseProfile class contentScriptType contentStyleType externalResourcesRequired height id onabort onactivate onclick onerror onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup onresize onscroll onunload onzoom preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage version viewBox width x xml:base xml:lang xml:space y zoomAndPan"),
            switch: ar("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            symbol: ar("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup preserveAspectRatio style viewBox xml:base xml:lang xml:space"),
            text: ar("class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength transform x xml:base xml:lang xml:space y"),
            textPath: ar("class externalResourcesRequired id lengthAdjust method onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures spacing startOffset style systemLanguage textLength xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space"),
            title: ar("class id style xml:base xml:lang xml:space"),
            tref: ar("class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength x xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space y"),
            tspan: ar("class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength x xml:base xml:lang xml:space y"),
            use: ar("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            view: ar("externalResourcesRequired id preserveAspectRatio viewBox viewTarget xml:base xml:lang xml:space zoomAndPan"),
            vkern: ar("g1 g2 id k u1 u2 xml:base xml:lang xml:space")
        });
        this.de = ar("a altGlyph animate animateColor circle clipPath defs ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feFlood feGaussianBlur feImage feMerge feMorphology feOffset feSpecularLighting feTile feTurbulence filter font foreignObject g glyph glyphRef image line linearGradient marker mask missing-glyph path pattern polygon polyline radialGradient rect stop svg switch symbol text textPath tref tspan use");
        this.me = ar("alignment-baseline baseline-shift clip-path clip-rule clip color-interpolation-filters color-interpolation color-profile color-rendering color cursor direction display dominant-baseline enable-background fill-opacity fill-rule fill filter flood-color flood-opacity font-family font-size-adjust font-size font-stretch font-style font-variant font-weight glyph-orientation-horizontal glyph-orientation-vertical image-rendering kerning letter-spacing lighting-color marker-end marker-mid marker-start mask opacity overflow pointer-events shape-rendering stop-color stop-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width stroke text-anchor text-decoration text-rendering unicode-bidi visibility word-spacing writing-mode");
        this.SVGElement = t.globalThis.SVGElement;
        const e = t.document.createElement("div");
        e.innerHTML = "<svg><altGlyph /></svg>";
        if ("altglyph" === e.firstElementChild.nodeName) {
            const t = this.fe;
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
        return true === this.de[t.nodeName] && true === this.me[e] || true === this.fe[t.nodeName]?.[e];
    }
}

SVGAnalyzer.inject = [ ii ];

const cr = Ht("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    static get inject() {
        return [ hr ];
    }
    constructor(t) {
        this.svg = t;
        this.fns = [];
        this.ge = pt();
        this.pe = pt();
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
            s = (e = this.ge)[n] ?? (e[n] = pt());
            for (r in i) {
                if (void 0 !== s[r]) throw fr(r, n);
                s[r] = i[r];
            }
        }
    }
    useGlobalMapping(t) {
        const e = this.pe;
        for (const i in t) {
            if (void 0 !== e[i]) throw fr(i, "*");
            e[i] = t[i];
        }
    }
    useTwoWay(t) {
        this.fns.push(t);
    }
    isTwoWay(t, e) {
        return ur(t, e) || this.fns.length > 0 && this.fns.some((i => i(t, e)));
    }
    map(t, e) {
        return this.ge[t.nodeName]?.[e] ?? this.pe[e] ?? (Ct(t, e, this.svg) ? e : null);
    }
}

function ur(t, e) {
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

function fr(t, e) {
    return vt(`Attribute ${t} has been already registered for ${"*" === e ? "all elements" : `<${e}/>`}`);
}

const dr = Ht("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const mr = {};

class TemplateElementFactory {
    constructor(t) {
        this.p = t;
        this.ve = gr(this.p);
    }
    createTemplate(t) {
        if (It(t)) {
            let e = mr[t];
            if (void 0 === e) {
                const i = this.ve;
                i.innerHTML = t;
                const s = i.content.firstElementChild;
                if (null == s || "TEMPLATE" !== s.nodeName || null != s.nextElementSibling) {
                    this.ve = gr(this.p);
                    e = i;
                } else {
                    i.content.removeChild(s);
                    e = s;
                }
                mr[t] = e;
            }
            return e.cloneNode(true);
        }
        if ("TEMPLATE" !== t.nodeName) {
            const e = gr(this.p);
            e.content.appendChild(t);
            return e;
        }
        t.parentNode?.removeChild(t);
        return t.cloneNode(true);
    }
}

TemplateElementFactory.inject = [ ii ];

const gr = t => t.document.createElement("template");

class TemplateCompiler {
    constructor() {
        this.debug = false;
        this.resolveResources = true;
    }
    static register(t) {
        return Wt(an, this).register(t);
    }
    compile(t, e, i) {
        const s = CustomElementDefinition.getOrCreate(t);
        if (null === s.template || void 0 === s.template) return s;
        if (false === s.needsCompile) return s;
        i ?? (i = Br);
        const n = new CompilationContext(t, e, i, null, null, void 0);
        const r = It(s.template) || !t.enhance ? n.xe.createTemplate(s.template) : s.template;
        const o = r.nodeName === xr && null != r.content;
        const h = o ? r.content : r;
        const a = e.get(jt(Dr));
        const c = a.length;
        let u = 0;
        if (c > 0) while (c > u) {
            a[u].compiling?.(r);
            ++u;
        }
        if (r.hasAttribute(Pr)) throw vt(`AUR0701`);
        this.we(h, n);
        this.be(h, n);
        return CustomElementDefinition.create({
            ...t,
            name: t.name || js(),
            dependencies: (t.dependencies ?? l).concat(n.deps ?? l),
            instructions: n.rows,
            surrogates: o ? this.ye(r, n) : l,
            template: r,
            hasSlots: n.hasSlot,
            needsCompile: false
        });
    }
    compileSpread(t, e, i, s) {
        const n = new CompilationContext(t, i, Br, null, null, void 0);
        const r = [];
        const o = n.ke(s.nodeName.toLowerCase());
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
            x = n.Ae(u);
            if (null !== x && (1 & x.type) > 0) {
                Sr.node = s;
                Sr.attr = u;
                Sr.bindable = null;
                Sr.def = null;
                r.push(x.build(Sr, n.ep, n.m));
                continue;
            }
            f = n.Ce(k);
            if (null !== f) {
                if (f.isTemplateController) throw vt(`AUR0703:${k}`);
                g = BindablesInfo.from(f, true);
                y = false === f.noMultiBindings && null === x && Ar(A);
                if (y) m = this.Be(s, A, f, n); else {
                    v = g.primary;
                    if (null === x) {
                        w = h.parse(A, 1);
                        m = [ null === w ? new SetPropertyInstruction(A, v.property) : new InterpolationInstruction(w, v.property) ];
                    } else {
                        Sr.node = s;
                        Sr.attr = u;
                        Sr.bindable = v;
                        Sr.def = f;
                        m = [ x.build(Sr, n.ep, n.m) ];
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
                        Sr.node = s;
                        Sr.attr = u;
                        Sr.bindable = p;
                        Sr.def = o;
                        r.push(new SpreadElementPropBindingInstruction(x.build(Sr, n.ep, n.m)));
                        continue;
                    }
                }
                Sr.node = s;
                Sr.attr = u;
                Sr.bindable = null;
                Sr.def = null;
                r.push(x.build(Sr, n.ep, n.m));
            }
        }
        Cr();
        if (null != d) return d.concat(r);
        return r;
    }
    ye(t, e) {
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
            c = e.ue.parse(h, a);
            w = c.target;
            y = c.rawValue;
            if (Ir[w]) throw vt(`AUR0702:${h}`);
            p = e.Ae(c);
            if (null !== p && (1 & p.type) > 0) {
                Sr.node = t;
                Sr.attr = c;
                Sr.bindable = null;
                Sr.def = null;
                i.push(p.build(Sr, e.ep, e.m));
                continue;
            }
            u = e.Ce(w);
            if (null !== u) {
                if (u.isTemplateController) throw vt(`AUR0703:${w}`);
                m = BindablesInfo.from(u, true);
                x = false === u.noMultiBindings && null === p && Ar(y);
                if (x) d = this.Be(t, y, u, e); else {
                    g = m.primary;
                    if (null === p) {
                        v = n.parse(y, 1);
                        d = [ null === v ? new SetPropertyInstruction(y, g.property) : new InterpolationInstruction(v, g.property) ];
                    } else {
                        Sr.node = t;
                        Sr.attr = c;
                        Sr.bindable = g;
                        Sr.def = u;
                        d = [ p.build(Sr, e.ep, e.m) ];
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
                Sr.node = t;
                Sr.attr = c;
                Sr.bindable = null;
                Sr.def = null;
                i.push(p.build(Sr, e.ep, e.m));
            }
        }
        Cr();
        if (null != f) return f.concat(i);
        return i;
    }
    be(t, e) {
        switch (t.nodeType) {
          case 1:
            switch (t.nodeName) {
              case "LET":
                return this.Re(t, e);

              default:
                return this.Se(t, e);
            }

          case 3:
            return this.Ie(t, e);

          case 11:
            {
                let i = t.firstChild;
                while (null !== i) i = this.be(i, e);
                break;
            }
        }
        return t.nextSibling;
    }
    Re(t, e) {
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
            a = e.ue.parse(c, u);
            d = a.target;
            m = a.rawValue;
            f = e.Ae(a);
            if (null !== f) {
                if ("bind" === a.command) n.push(new LetBindingInstruction(r.parse(m, 16), b(d))); else throw vt(`AUR0704:${a.command}`);
                continue;
            }
            g = r.parse(m, 1);
            n.push(new LetBindingInstruction(null === g ? new N(m) : g, b(d)));
        }
        e.rows.push([ new HydrateLetElementInstruction(n, o) ]);
        return this.Te(t).nextSibling;
    }
    Se(t, e) {
        var i, s, r, o;
        const h = t.nextSibling;
        const a = (t.getAttribute("as-element") ?? t.nodeName).toLowerCase();
        const c = e.ke(a);
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
        let R;
        let S;
        let I;
        let T = null;
        let E = false;
        let L;
        let P;
        let _;
        let U;
        let D;
        let $;
        let q;
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
            R = e.ue.parse(C, B);
            M = e.Ae(R);
            V = R.target;
            N = R.rawValue;
            if (d && (!m || m && d(V))) {
                if (null != M && 1 & M.type) {
                    v();
                    g.push(R);
                    continue;
                }
                W = V !== Vr && "slot" !== V;
                if (W) {
                    F = BindablesInfo.from(c, false);
                    if (null == F.attrs[V] && !e.Ce(V)?.isTemplateController) {
                        v();
                        g.push(R);
                        continue;
                    }
                }
            }
            if (null !== M && 1 & M.type) {
                Sr.node = t;
                Sr.attr = R;
                Sr.bindable = null;
                Sr.def = null;
                (S ?? (S = [])).push(M.build(Sr, e.ep, e.m));
                v();
                continue;
            }
            T = e.Ce(V);
            if (null !== T) {
                F = BindablesInfo.from(T, true);
                E = false === T.noMultiBindings && null === M && Ar(N);
                if (E) _ = this.Be(t, N, T, e); else {
                    O = F.primary;
                    if (null === M) {
                        $ = p.parse(N, 1);
                        _ = [ null === $ ? new SetPropertyInstruction(N, O.property) : new InterpolationInstruction($, O.property) ];
                    } else {
                        Sr.node = t;
                        Sr.attr = R;
                        Sr.bindable = O;
                        Sr.def = T;
                        _ = [ M.build(Sr, e.ep, e.m) ];
                    }
                }
                v();
                if (T.isTemplateController) (U ?? (U = [])).push(new HydrateTemplateController(Rr, this.resolveResources ? T : T.name, void 0, _)); else (P ?? (P = [])).push(new HydrateAttributeInstruction(this.resolveResources ? T : T.name, null != T.aliases && T.aliases.includes(V) ? V : void 0, _));
                continue;
            }
            if (null === M) {
                if (u) {
                    F = BindablesInfo.from(c, false);
                    L = F.attrs[V];
                    if (void 0 !== L) {
                        $ = p.parse(N, 1);
                        (I ?? (I = [])).push(null == $ ? new SetPropertyInstruction(N, L.property) : new InterpolationInstruction($, L.property));
                        v();
                        continue;
                    }
                }
                $ = p.parse(N, 1);
                if (null != $) {
                    v();
                    (S ?? (S = [])).push(new InterpolationInstruction($, e.m.map(t, V) ?? b(V)));
                }
                continue;
            }
            v();
            if (u) {
                F = BindablesInfo.from(c, false);
                L = F.attrs[V];
                if (void 0 !== L) {
                    Sr.node = t;
                    Sr.attr = R;
                    Sr.bindable = L;
                    Sr.def = c;
                    (I ?? (I = [])).push(M.build(Sr, e.ep, e.m));
                    continue;
                }
            }
            Sr.node = t;
            Sr.attr = R;
            Sr.bindable = null;
            Sr.def = null;
            (S ?? (S = [])).push(M.build(Sr, e.ep, e.m));
        }
        Cr();
        if (this.Ee(t, S) && null != S && S.length > 1) this.Le(t, S);
        if (u) {
            q = new HydrateElementInstruction(this.resolveResources ? c : c.name, void 0, I ?? l, null, H, g);
            if (a === Vr) {
                const i = t.getAttribute("name") || Or;
                const s = e.t();
                const n = e.Pe();
                let r = t.firstChild;
                while (null !== r) {
                    if (1 === r.nodeType && r.hasAttribute(Vr)) t.removeChild(r); else us(s, r);
                    r = t.firstChild;
                }
                this.be(s.content, n);
                q.auSlot = {
                    name: i,
                    fallback: CustomElementDefinition.create({
                        name: js(),
                        template: s,
                        instructions: n.rows,
                        needsCompile: false
                    })
                };
                t = this._e(t, e);
            }
        }
        if (null != S || null != q || null != P) {
            w = l.concat(q ?? l, P ?? l, S ?? l);
            this.Te(t);
        }
        let z;
        if (null != U) {
            y = U.length - 1;
            k = y;
            D = U[k];
            let n;
            if (yr(t)) {
                n = e.t();
                fs(n, [ e.Ue(wr), e.Ue(br), this.Te(e.h(vr)) ]);
            } else {
                this._e(t, e);
                if ("TEMPLATE" === t.nodeName) n = t; else {
                    n = e.t();
                    us(n, t);
                }
            }
            const r = n;
            const o = e.Pe(null == w ? [] : [ w ]);
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
                h = 1 === C.nodeType ? C.getAttribute(Vr) : null;
                if (null !== h) C.removeAttribute(Vr);
                if (u) {
                    l = C.nextSibling;
                    if (!f) {
                        B = 3 === C.nodeType && "" === C.textContent.trim();
                        if (!B) ((i = m ?? (m = {}))[s = h || Or] ?? (i[s] = [])).push(C);
                        t.removeChild(C);
                    }
                    C = l;
                } else {
                    if (null !== h) {
                        h = h || Or;
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
                        if ("TEMPLATE" === p.nodeName) if (p.attributes.length > 0) us(n, p); else us(n, p.content); else us(n, p);
                    }
                    x = e.Pe();
                    this.be(n.content, x);
                    d[h] = CustomElementDefinition.create({
                        name: js(),
                        template: n,
                        instructions: x.rows,
                        needsCompile: false,
                        isStrictBinding: e.root.def.isStrictBinding
                    });
                }
                q.projections = d;
            }
            if (u && (H || c.containerless)) this._e(t, e);
            z = !u || !c.containerless && !H && false !== j;
            if (z) if (t.nodeName === xr) this.be(t.content, o); else {
                C = t.firstChild;
                while (null !== C) C = this.be(C, o);
            }
            D.def = CustomElementDefinition.create({
                name: js(),
                template: r,
                instructions: o.rows,
                needsCompile: false,
                isStrictBinding: e.root.def.isStrictBinding
            });
            while (k-- > 0) {
                D = U[k];
                n = e.t();
                v = this.Te(e.h(vr));
                fs(n, [ e.Ue(wr), e.Ue(br), v ]);
                D.def = CustomElementDefinition.create({
                    name: js(),
                    template: n,
                    needsCompile: false,
                    instructions: [ [ U[k + 1] ] ],
                    isStrictBinding: e.root.def.isStrictBinding
                });
            }
            e.rows.push([ D ]);
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
                n = 1 === i.nodeType ? i.getAttribute(Vr) : null;
                if (null !== n) i.removeAttribute(Vr);
                if (u) {
                    s = i.nextSibling;
                    if (!f) {
                        v = 3 === i.nodeType && "" === i.textContent.trim();
                        if (!v) ((r = h ?? (h = {}))[o = n || Or] ?? (r[o] = [])).push(i);
                        t.removeChild(i);
                    }
                    i = s;
                } else {
                    if (null !== n) {
                        n = n || Or;
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
                        if (m.nodeName === xr) if (m.attributes.length > 0) us(g, m); else us(g, m.content); else us(g, m);
                    }
                    p = e.Pe();
                    this.be(g.content, p);
                    l[n] = CustomElementDefinition.create({
                        name: js(),
                        template: g,
                        instructions: p.rows,
                        needsCompile: false,
                        isStrictBinding: e.root.def.isStrictBinding
                    });
                }
                q.projections = l;
            }
            if (u && (H || c.containerless)) this._e(t, e);
            z = !u || !c.containerless && !H && false !== j;
            if (z && t.childNodes.length > 0) {
                i = t.firstChild;
                while (null !== i) i = this.be(i, e);
            }
        }
        return h;
    }
    Ie(t, e) {
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
            if (a = r[0]) hs(i, e.De(a), t);
            for (l = 0, h = o.length; h > l; ++l) {
                as(i, t, [ e.Ue(wr), e.Ue(br), this.Te(e.h(vr)) ]);
                if (a = r[l + 1]) hs(i, e.De(a), t);
                e.rows.push([ new TextBindingInstruction(o[l], e.root.def.isStrictBinding) ]);
            }
            i.removeChild(t);
        }
        return n;
    }
    Be(t, e, i, s) {
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
                f = s.ue.parse(l, h);
                d = s.Ae(f);
                m = n.attrs[f.target];
                if (null == m) throw vt(`AUR0707:${i.name}.${f.target}`);
                if (null === d) {
                    u = s.ep.parse(h, 1);
                    o.push(null === u ? new SetPropertyInstruction(h, m.property) : new InterpolationInstruction(u, m.property));
                } else {
                    Sr.node = t;
                    Sr.attr = f;
                    Sr.bindable = m;
                    Sr.def = i;
                    o.push(d.build(Sr, s.ep, s.m));
                }
                while (g < r && e.charCodeAt(++g) <= 32) ;
                a = g;
                l = void 0;
                h = void 0;
            }
        }
        Cr();
        return o;
    }
    we(t, e) {
        const i = t;
        const s = y(i.querySelectorAll("template[as-custom-element]"));
        const n = s.length;
        if (0 === n) return;
        if (n === i.childElementCount) throw vt(`AUR0708`);
        const r = new Set;
        const o = [];
        for (const t of s) {
            if (t.parentNode !== i) throw vt(`AUR0709`);
            const s = _r(t, r);
            const n = class LocalTemplate {};
            const l = t.content;
            const h = y(l.querySelectorAll("bindable"));
            const a = qt.for(n);
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
                    mode: Ur(t)
                });
                const s = t.getAttributeNames().filter((t => !Lr.includes(t)));
                if (s.length > 0) ;
                l.removeChild(t);
            }
            o.push(n);
            e.$e(Ws({
                name: s,
                template: t
            }, n));
            i.removeChild(t);
        }
        let h = 0;
        const a = o.length;
        for (;a > h; ++h) Ks(o[h]).dependencies.push(...e.def.dependencies ?? l, ...e.deps ?? l);
    }
    Ee(t, e) {
        const i = t.nodeName;
        return "INPUT" === i && 1 === Tr[t.type] || "SELECT" === i && (t.hasAttribute("multiple") || e?.some((t => "rg" === t.type && "multiple" === t.to)));
    }
    Le(t, e) {
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
    qe(t) {
        return t.nodeName === vr && kr(pr = cs(t)) && pr.textContent === br && kr(pr = cs(pr)) && pr.textContent === wr;
    }
    Te(t) {
        t.classList.add("au");
        return t;
    }
    _e(t, e) {
        if (yr(t)) return t;
        const i = t.parentNode;
        const s = this.Te(e.h(vr));
        as(i, t, [ e.Ue(wr), e.Ue(br), s ]);
        i.removeChild(t);
        return s;
    }
}

let pr;

const vr = "AU-M";

const xr = "TEMPLATE";

const wr = "au-start";

const br = "au-end";

const yr = t => t.nodeName === vr && kr(pr = cs(t)) && pr.textContent === br && kr(pr = cs(pr)) && pr.textContent === wr;

const kr = t => 8 === t?.nodeType;

class CompilationContext {
    constructor(t, e, i, s, n, r) {
        this.hasSlot = false;
        this.Me = pt();
        const o = null !== s;
        this.c = e;
        this.root = null === n ? this : n;
        this.def = t;
        this.ci = i;
        this.parent = s;
        this.xe = o ? s.xe : e.get(dr);
        this.ue = o ? s.ue : e.get(ie);
        this.ep = o ? s.ep : e.get(q);
        this.m = o ? s.m : e.get(cr);
        this.Fe = o ? s.Fe : e.get(k);
        this.p = o ? s.p : e.get(ii);
        this.localEls = o ? s.localEls : new Set;
        this.rows = r ?? [];
    }
    $e(t) {
        var e;
        ((e = this.root).deps ?? (e.deps = [])).push(t);
        this.root.c.register(t);
    }
    De(t) {
        return ls(this.p, t);
    }
    Ue(t) {
        return rs(this.p, t);
    }
    h(t) {
        const e = ns(this.p, t);
        if ("template" === t) this.p.document.adoptNode(e.content);
        return e;
    }
    t() {
        return this.h("template");
    }
    ke(t) {
        return this.c.find(Zs, t);
    }
    Ce(t) {
        return this.c.find(ei, t);
    }
    Pe(t) {
        return new CompilationContext(this.def, this.c, this.ci, this, this.root, t);
    }
    Ae(t) {
        if (this.root !== this) return this.root.Ae(t);
        const e = t.command;
        if (null === e) return null;
        let i = this.Me[e];
        if (void 0 === i) {
            i = this.c.create(Xn, e);
            if (null === i) throw vt(`AUR0713:${e}`);
            this.Me[e] = i;
        }
        return i;
    }
}

const Ar = t => {
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

const Cr = () => {
    Sr.node = Sr.attr = Sr.bindable = Sr.def = null;
};

const Br = {
    projections: null
};

const Rr = {
    name: "unnamed"
};

const Sr = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const Ir = bt(pt(), {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
});

const Tr = {
    checkbox: 1,
    radio: 1
};

const Er = new WeakMap;

class BindablesInfo {
    static from(t, e) {
        let i = Er.get(t);
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
            Er.set(t, i = new BindablesInfo(n, s, a));
        }
        return i;
    }
    constructor(t, e, i) {
        this.attrs = t;
        this.bindables = e;
        this.primary = i;
    }
}

const Lr = wt([ "property", "attribute", "mode" ]);

const Pr = "as-custom-element";

const _r = (t, e) => {
    const i = t.getAttribute(Pr);
    if (null === i || "" === i) throw vt(`AUR0715`);
    if (e.has(i)) throw vt(`AUR0716:${i}`); else {
        e.add(i);
        t.removeAttribute(Pr);
    }
    return i;
};

const Ur = t => {
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

const $r = new WeakMap;

const qr = at("compiler-hooks");

const Mr = wt({
    name: qr,
    define(t) {
        let e = $r.get(t);
        if (void 0 === e) {
            $r.set(t, e = new TemplateCompilerHooksDefinition(t));
            rt(qr, e, t);
            ct(t, qr);
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

const Fr = t => {
    return void 0 === t ? e : e(t);
    function e(t) {
        return Mr.define(t);
    }
};

const Or = "default";

const Vr = "au-slot";

const Nr = new Map;

class BindingModeBehavior {
    bind(t, e) {
        Nr.set(e, e.mode);
        e.mode = this.mode;
    }
    unbind(t, e) {
        e.mode = Nr.get(e);
        Nr.delete(e);
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

xe("oneTime")(OneTimeBindingBehavior);

xe("toView")(ToViewBindingBehavior);

xe("fromView")(FromViewBindingBehavior);

xe("twoWay")(TwoWayBindingBehavior);

const jr = new WeakMap;

const Hr = 200;

class DebounceBindingBehavior {
    constructor(t) {
        this.p = t;
    }
    bind(t, e, i) {
        i = Number(i);
        const s = {
            type: "debounce",
            delay: i > 0 ? i : Hr,
            now: this.p.performanceNow,
            queue: this.p.taskQueue
        };
        const n = e.limit?.(s);
        if (null == n) ; else jr.set(e, n);
    }
    unbind(t, e) {
        jr.get(e)?.dispose();
        jr.delete(e);
    }
}

DebounceBindingBehavior.inject = [ c ];

xe("debounce")(DebounceBindingBehavior);

class SignalBindingBehavior {
    constructor(t) {
        this.Oe = new Map;
        this.Ve = t;
    }
    bind(t, e, ...i) {
        if (!("handleChange" in e)) throw vt(`AUR0817`);
        if (0 === i.length) throw vt(`AUR0818`);
        this.Oe.set(e, i);
        let s;
        for (s of i) this.Ve.addSignalListener(s, e);
    }
    unbind(t, e) {
        const i = this.Oe.get(e);
        this.Oe.delete(e);
        let s;
        for (s of i) this.Ve.removeSignalListener(s, e);
    }
}

SignalBindingBehavior.inject = [ E ];

xe("signal")(SignalBindingBehavior);

const Wr = new WeakMap;

const zr = 200;

class ThrottleBindingBehavior {
    constructor(t) {
        this.Ne = t.performanceNow;
        this.ct = t.taskQueue;
    }
    bind(t, e, i) {
        i = Number(i);
        const s = {
            type: "throttle",
            delay: i > 0 ? i : zr,
            now: this.Ne,
            queue: this.ct
        };
        const n = e.limit?.(s);
        if (null == n) ; else Wr.set(e, n);
    }
    unbind(t, e) {
        Wr.get(e)?.dispose();
        Wr.delete(e);
    }
}

ThrottleBindingBehavior.inject = [ c ];

xe("throttle")(ThrottleBindingBehavior);

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

oi(DataAttributeAccessor);

const Gr = new DataAttributeAccessor;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) throw vt(`AURxxxx`);
        e.useTargetObserver(Gr);
    }
}

xe("attr")(AttrBindingBehavior);

class SelfBindingBehavior {
    bind(t, e) {
        if (!(e instanceof ListenerBinding)) throw vt(`AUR0801`);
        e.self = true;
    }
    unbind(t, e) {
        e.self = false;
    }
}

xe("self")(SelfBindingBehavior);

const Xr = pt();

class AttributeNSAccessor {
    static forNs(t) {
        return Xr[t] ?? (Xr[t] = new AttributeNSAccessor(t));
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

oi(AttributeNSAccessor);

function Kr(t, e) {
    return t === e;
}

class CheckedObserver {
    constructor(t, e, i, s) {
        this.type = 2 | 1 | 4;
        this.v = void 0;
        this.ov = void 0;
        this.je = void 0;
        this.He = void 0;
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
        this.We();
        this.ze();
        this.st();
    }
    handleCollectionChange() {
        this.ze();
    }
    handleChange(t, e) {
        this.ze();
    }
    ze() {
        const t = this.v;
        const e = this.wt;
        const i = xt.call(e, "model") ? e.model : e.value;
        const s = "radio" === e.type;
        const n = void 0 !== e.matcher ? e.matcher : Kr;
        if (s) e.checked = !!n(t, i); else if (true === t) e.checked = true; else {
            let s = false;
            if (Rt(t)) s = -1 !== t.findIndex((t => !!n(t, i))); else if (t instanceof Set) {
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
        const n = void 0 !== e.matcher ? e.matcher : Kr;
        if ("checkbox" === e.type) {
            if (Rt(t)) {
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
        this.We();
    }
    kt() {
        this.je?.unsubscribe(this);
        this.He?.unsubscribe(this);
        this.je = this.He = void 0;
    }
    st() {
        Qr = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Qr);
    }
    We() {
        const t = this.wt;
        (this.He ?? (this.He = t.$observers?.model ?? t.$observers?.value))?.subscribe(this);
        this.je?.unsubscribe(this);
        this.je = void 0;
        if ("checkbox" === t.type) (this.je = ho(this.v, this.oL))?.subscribe(this);
    }
}

ri(CheckedObserver);

I(CheckedObserver);

let Qr;

const Yr = {
    childList: true,
    subtree: true,
    characterData: true
};

function Zr(t, e) {
    return t === e;
}

class SelectValueObserver {
    constructor(t, e, i, s) {
        this.type = 2 | 1 | 4;
        this.v = void 0;
        this.ov = void 0;
        this.J = false;
        this.Ge = void 0;
        this.Xe = void 0;
        this.iO = false;
        this.bt = false;
        this.wt = t;
        this.oL = s;
        this.cf = i;
    }
    getValue() {
        return this.iO ? this.v : this.wt.multiple ? Jr(this.wt.options) : this.wt.value;
    }
    setValue(t) {
        this.ov = this.v;
        this.v = t;
        this.J = t !== this.ov;
        this.Ke(t instanceof Array ? t : null);
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
        const i = Rt(t);
        const s = e.matcher ?? Zr;
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
            const o = t.matcher || Zr;
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
        (this.Xe = new this.wt.ownerDocument.defaultView.MutationObserver(this.Qe.bind(this))).observe(this.wt, Yr);
        this.Ke(this.v instanceof Array ? this.v : null);
        this.iO = true;
    }
    kt() {
        this.Xe.disconnect();
        this.Ge?.unsubscribe(this);
        this.Xe = this.Ge = void 0;
        this.iO = false;
    }
    Ke(t) {
        this.Ge?.unsubscribe(this);
        this.Ge = void 0;
        if (null != t) {
            if (!this.wt.multiple) throw vt(`AUR0654`);
            (this.Ge = this.oL.getArrayObserver(t)).subscribe(this);
        }
    }
    handleEvent() {
        const t = this.syncValue();
        if (t) this.st();
    }
    Qe(t) {
        this.syncOptions();
        const e = this.syncValue();
        if (e) this.st();
    }
    st() {
        to = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, to);
    }
}

ri(SelectValueObserver);

I(SelectValueObserver);

function Jr(t) {
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

let to;

const eo = "--";

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
    Ye(t) {
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
    Ze(t) {
        let e;
        let i;
        const n = [];
        for (i in t) {
            e = t[i];
            if (null == e) continue;
            if (It(e)) {
                if (i.startsWith(eo)) {
                    n.push([ i, e ]);
                    continue;
                }
                n.push([ s(i), e ]);
                continue;
            }
            n.push(...this.Je(e));
        }
        return n;
    }
    ti(t) {
        const e = t.length;
        if (e > 0) {
            const i = [];
            let s = 0;
            for (;e > s; ++s) i.push(...this.Je(t[s]));
            return i;
        }
        return l;
    }
    Je(t) {
        if (It(t)) return this.Ye(t);
        if (t instanceof Array) return this.ti(t);
        if (t instanceof Object) return this.Ze(t);
        return l;
    }
    it() {
        if (this.J) {
            this.J = false;
            const t = this.v;
            const e = this.styles;
            const i = this.Je(t);
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
        if (null != e && St(e.indexOf) && e.includes("!important")) {
            i = "important";
            e = e.replace("!important", "");
        }
        this.obj.style.setProperty(t, e, i);
    }
    bind() {
        this.v = this.ov = this.obj.style.cssText;
    }
}

oi(StyleAttributeAccessor);

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
        if (Lt(t, this.v)) return;
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
        io = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, io);
    }
}

ri(ValueAttributeObserver);

I(ValueAttributeObserver);

let io;

const so = "http://www.w3.org/1999/xlink";

const no = "http://www.w3.org/XML/1998/namespace";

const ro = "http://www.w3.org/2000/xmlns/";

const oo = bt(pt(), {
    "xlink:actuate": [ "actuate", so ],
    "xlink:arcrole": [ "arcrole", so ],
    "xlink:href": [ "href", so ],
    "xlink:role": [ "role", so ],
    "xlink:show": [ "show", so ],
    "xlink:title": [ "title", so ],
    "xlink:type": [ "type", so ],
    "xml:lang": [ "lang", no ],
    "xml:space": [ "space", no ],
    xmlns: [ "xmlns", ro ],
    "xmlns:xlink": [ "xlink", ro ]
});

const lo = new j;

lo.type = 2 | 4;

class NodeObserverLocator {
    constructor(t, e, i, s) {
        this.locator = t;
        this.platform = e;
        this.dirtyChecker = i;
        this.svgAnalyzer = s;
        this.allowDirtyCheck = true;
        this.ei = pt();
        this.ii = pt();
        this.si = pt();
        this.ni = pt();
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
        const s = this.ei;
        let n;
        if (It(t)) {
            n = s[t] ?? (s[t] = pt());
            if (null == n[e]) n[e] = i; else ao(t, e);
        } else for (const i in t) {
            n = s[i] ?? (s[i] = pt());
            const r = t[i];
            for (e in r) if (null == n[e]) n[e] = r[e]; else ao(i, e);
        }
    }
    useConfigGlobal(t, e) {
        const i = this.ii;
        if ("object" === typeof t) for (const e in t) if (null == i[e]) i[e] = t[e]; else ao("*", e); else if (null == i[t]) i[t] = e; else ao("*", t);
    }
    getAccessor(t, e, i) {
        if (e in this.ni || e in (this.si[t.tagName] ?? A)) return this.getObserver(t, e, i);
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
            return Gr;

          default:
            {
                const i = oo[e];
                if (void 0 !== i) return AttributeNSAccessor.forNs(i[1]);
                if (Ct(t, e, this.svgAnalyzer)) return Gr;
                return lo;
            }
        }
    }
    overrideAccessor(t, e) {
        var i, s;
        let n;
        if (It(t)) {
            n = (i = this.si)[t] ?? (i[t] = pt());
            n[e] = true;
        } else for (const e in t) for (const i of t[e]) {
            n = (s = this.si)[e] ?? (s[e] = pt());
            n[i] = true;
        }
    }
    overrideAccessorGlobal(...t) {
        for (const e of t) this.ni[e] = true;
    }
    getNodeObserverConfig(t, e) {
        return this.ei[t.tagName]?.[e] ?? this.ii[e];
    }
    getNodeObserver(t, e, i) {
        const s = this.ei[t.tagName]?.[e] ?? this.ii[e];
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
        const n = oo[e];
        if (void 0 !== n) return AttributeNSAccessor.forNs(n[1]);
        if (Ct(t, e, this.svgAnalyzer)) return Gr;
        if (e in t.constructor.prototype) {
            if (this.allowDirtyCheck) return this.dirtyChecker.createProperty(t, e);
            throw vt(`AUR0652:${mt(e)}`);
        } else return new z(t, e);
    }
}

NodeObserverLocator.inject = [ C, ii, G, hr ];

function ho(t, e) {
    if (t instanceof Array) return e.getArrayObserver(t);
    if (t instanceof Map) return e.getMapObserver(t);
    if (t instanceof Set) return e.getSetObserver(t);
}

function ao(t, e) {
    throw vt(`AUR0653:${mt(e)}@${t}`);
}

class UpdateTriggerBindingBehavior {
    constructor(t, e) {
        if (!(e instanceof NodeObserverLocator)) throw vt("AURxxxx: updateTrigger binding behavior only works with the default implementation of Aurelia HTML observation. Implement your own node observation + updateTrigger");
        this.oL = t;
        this.ri = e;
    }
    bind(t, e, ...i) {
        if (0 === i.length) throw vt(`AUR0802`);
        if (!(e instanceof PropertyBinding) || !(4 & e.mode)) throw vt(`AUR0803`);
        const s = this.ri.getNodeObserverConfig(e.target, e.targetProperty);
        if (null == s) throw vt(`AURxxxx`);
        const n = this.ri.getNodeObserver(e.target, e.targetProperty, this.oL);
        n.useConfig({
            readonly: s.readonly,
            default: s.default,
            events: i
        });
        e.useTargetObserver(n);
    }
}

UpdateTriggerBindingBehavior.inject = [ M, H ];

xe("updateTrigger")(UpdateTriggerBindingBehavior);

class Focus {
    constructor(t, e) {
        this.oi = false;
        this.li = t;
        this.p = e;
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) this.hi(); else this.oi = true;
    }
    attached() {
        if (this.oi) {
            this.oi = false;
            this.hi();
        }
        this.li.addEventListener("focus", this);
        this.li.addEventListener("blur", this);
    }
    detaching() {
        const t = this.li;
        t.removeEventListener("focus", this);
        t.removeEventListener("blur", this);
    }
    handleEvent(t) {
        if ("focus" === t.type) this.value = true; else if (!this.ai) this.value = false;
    }
    hi() {
        const t = this.li;
        const e = this.ai;
        const i = this.value;
        if (i && !e) t.focus(); else if (!i && e) t.blur();
    }
    get ai() {
        return this.li === this.p.document.activeElement;
    }
}

Focus.inject = [ vs, ii ];

et([ Ut({
    mode: 6
}) ], Focus.prototype, "value", void 0);

ze("focus")(Focus);

let co = class Show {
    constructor(t, e, i) {
        this.el = t;
        this.p = e;
        this.ui = false;
        this.lt = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.lt = null;
            if (Boolean(this.value) !== this.fi) if (this.fi === this.di) {
                this.fi = !this.di;
                this.$val = this.el.style.getPropertyValue("display");
                this.$prio = this.el.style.getPropertyPriority("display");
                this.el.style.setProperty("display", "none", "important");
            } else {
                this.fi = this.di;
                this.el.style.setProperty("display", this.$val, this.$prio);
                if ("" === this.el.getAttribute("style")) this.el.removeAttribute("style");
            }
        };
        this.fi = this.di = "hide" !== i.alias;
    }
    binding() {
        this.ui = true;
        this.update();
    }
    detaching() {
        this.ui = false;
        this.lt?.cancel();
        this.lt = null;
    }
    valueChanged() {
        if (this.ui && null === this.lt) this.lt = this.p.domWriteQueue.queueTask(this.update);
    }
};

et([ Ut ], co.prototype, "value", void 0);

co = et([ it(0, vs), it(1, ii), it(2, ln) ], co);

Qt("hide")(co);

ze("show")(co);

class Portal {
    constructor(t, e, i) {
        this.position = "beforeend";
        this.strict = false;
        this.p = i;
        this.mi = i.document.createElement("div");
        (this.view = t.create()).setLocation(this.gi = os(i));
        As(this.view.nodes, e);
    }
    attaching(t) {
        if (null == this.callbackContext) this.callbackContext = this.$controller.scope.bindingContext;
        const e = this.mi = this.pi();
        this.vi(e, this.position);
        return this.xi(t, e);
    }
    detaching(t) {
        return this.wi(t, this.mi);
    }
    targetChanged() {
        const {$controller: t} = this;
        if (!t.isActive) return;
        const e = this.pi();
        if (this.mi === e) return;
        this.mi = e;
        const i = g(this.wi(null, e), (() => {
            this.vi(e, this.position);
            return this.xi(null, e);
        }));
        if (Bt(i)) i.catch(Et);
    }
    positionChanged() {
        const {$controller: t, mi: e} = this;
        if (!t.isActive) return;
        const i = g(this.wi(null, e), (() => {
            this.vi(e, this.position);
            return this.xi(null, e);
        }));
        if (Bt(i)) i.catch(Et);
    }
    xi(t, e) {
        const {activating: i, callbackContext: s, view: n} = this;
        return g(i?.call(s, e, n), (() => this.bi(t, e)));
    }
    bi(t, e) {
        const {$controller: i, view: s} = this;
        if (null === t) s.nodes.insertBefore(this.gi); else return g(s.activate(t ?? s, i, i.scope), (() => this.yi(e)));
        return this.yi(e);
    }
    yi(t) {
        const {activated: e, callbackContext: i, view: s} = this;
        return e?.call(i, t, s);
    }
    wi(t, e) {
        const {deactivating: i, callbackContext: s, view: n} = this;
        return g(i?.call(s, e, n), (() => this.ki(t, e)));
    }
    ki(t, e) {
        const {$controller: i, view: s} = this;
        if (null === t) s.nodes.remove(); else return g(s.deactivate(t, i), (() => this.Ai(e)));
        return this.Ai(e);
    }
    Ai(t) {
        const {deactivated: e, callbackContext: i, view: s} = this;
        return e?.call(i, t, s);
    }
    pi() {
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
    vi(t, e) {
        const i = this.gi;
        const s = i.$start;
        const n = t.parentNode;
        const r = [ s, i ];
        switch (e) {
          case "beforeend":
            as(t, null, r);
            break;

          case "afterbegin":
            as(t, t.firstChild, r);
            break;

          case "beforebegin":
            as(n, t, r);
            break;

          case "afterend":
            as(n, t.nextSibling, r);
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

Portal.inject = [ Ci, ws, ii ];

et([ Ut({
    primary: true
}) ], Portal.prototype, "target", void 0);

et([ Ut() ], Portal.prototype, "position", void 0);

et([ Ut({
    callback: "targetChanged"
}) ], Portal.prototype, "renderContext", void 0);

et([ Ut() ], Portal.prototype, "strict", void 0);

et([ Ut() ], Portal.prototype, "deactivating", void 0);

et([ Ut() ], Portal.prototype, "activating", void 0);

et([ Ut() ], Portal.prototype, "deactivated", void 0);

et([ Ut() ], Portal.prototype, "activated", void 0);

et([ Ut() ], Portal.prototype, "callbackContext", void 0);

Ge("portal")(Portal);

class If {
    constructor(t, e) {
        this.elseFactory = void 0;
        this.elseView = void 0;
        this.ifView = void 0;
        this.view = void 0;
        this.value = false;
        this.cache = true;
        this.pending = void 0;
        this.Ci = false;
        this.Bi = 0;
        this.Ri = t;
        this.l = e;
    }
    attaching(t, e) {
        let i;
        const s = this.$controller;
        const n = this.Bi++;
        const r = () => !this.Ci && this.Bi === n + 1;
        return g(this.pending, (() => {
            if (!r()) return;
            this.pending = void 0;
            if (this.value) i = this.view = this.ifView = this.cache && null != this.ifView ? this.ifView : this.Ri.create(); else i = this.view = this.elseView = this.cache && null != this.elseView ? this.elseView : this.elseFactory?.create();
            if (null == i) return;
            i.setLocation(this.l);
            this.pending = g(i.activate(t, s, s.scope), (() => {
                if (r()) this.pending = void 0;
            }));
        }));
    }
    detaching(t, e) {
        this.Ci = true;
        return g(this.pending, (() => {
            this.Ci = false;
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
        const n = this.Bi++;
        const r = () => !this.Ci && this.Bi === n + 1;
        let o;
        return g(this.pending, (() => this.pending = g(i?.deactivate(i, s), (() => {
            if (!r()) return;
            if (t) o = this.view = this.ifView = this.cache && null != this.ifView ? this.ifView : this.Ri.create(); else o = this.view = this.elseView = this.cache && null != this.elseView ? this.elseView : this.elseFactory?.create();
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

If.inject = [ Ci, ws ];

et([ Ut ], If.prototype, "value", void 0);

et([ Ut({
    set: t => "" === t || !!t && "false" !== t
}) ], If.prototype, "cache", void 0);

Ge("if")(If);

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

Else.inject = [ Ci ];

Ge({
    name: "else"
})(Else);

function uo(t) {
    t.dispose();
}

const fo = [ 18, 17 ];

class Repeat {
    constructor(t, e, i, s, n) {
        this.views = [];
        this.key = null;
        this.Si = new Map;
        this.Ii = new Map;
        this.Ti = void 0;
        this.Ei = false;
        this.Li = false;
        this.Pi = null;
        this._i = void 0;
        this.Ui = false;
        const r = t.props[0].props[0];
        if (void 0 !== r) {
            const {to: t, value: i, command: s} = r;
            if ("key" === t) if (null === s) this.key = i; else if ("bind" === s) this.key = e.parse(i, 16); else throw vt(`AUR775:${s}`); else throw vt(`AUR776:${t}`);
        }
        this.l = i;
        this.Di = s;
        this.f = n;
    }
    binding(t, e) {
        const i = this.Di.bindings;
        const s = i.length;
        let n;
        let r;
        let o = 0;
        for (;s > o; ++o) {
            n = i[o];
            if (n.target === this && "items" === n.targetProperty) {
                r = this.forOf = n.ast;
                this.$i = n;
                let t = r.iterable;
                while (null != t && fo.includes(t.$kind)) {
                    t = t.expression;
                    this.Ei = true;
                }
                this.Pi = t;
                break;
            }
        }
        this.qi();
        const l = r.declaration;
        if (!(this.Ui = 24 === l.$kind || 25 === l.$kind)) this.local = T(l, this.$controller.scope, n, null);
    }
    attaching(t, e) {
        this.Mi();
        return this.Fi(t);
    }
    detaching(t, e) {
        this.qi();
        return this.Oi(t);
    }
    unbinding(t, e) {
        this.Ii.clear();
        this.Si.clear();
    }
    itemsChanged() {
        if (!this.$controller.isActive) return;
        this.qi();
        this.Mi();
        this.Vi(this.items, void 0);
    }
    handleCollectionChange(t, e) {
        const i = this.$controller;
        if (!i.isActive) return;
        if (this.Ei) {
            if (this.Li) return;
            this.Li = true;
            this.items = T(this.forOf.iterable, i.scope, this.$i, null);
            this.Li = false;
            return;
        }
        this.Mi();
        this.Vi(t, e);
    }
    Vi(t, e) {
        const i = this.views;
        const s = i.length;
        const n = this.key;
        const r = null !== n;
        if (r || void 0 === e) {
            const t = this.local;
            const o = this._i;
            const l = o.length;
            const h = this.forOf;
            const a = h.declaration;
            const c = this.$i;
            const u = this.Ui;
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
                const A = this.Si;
                const C = this.Ii;
                const B = this.$controller.scope;
                f = 0;
                t: {
                    while (true) {
                        m = d[f];
                        g = o[f];
                        p = r ? So(A, n, m, Io(C, d[f], h, B, c, t, u), c) : m;
                        v = r ? So(A, n, g, Io(C, o[f], h, B, c, t, u), c) : g;
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
                        m = d[x];
                        g = o[x];
                        p = r ? So(A, n, m, Io(C, m, h, B, c, t, u), c) : m;
                        v = r ? So(A, n, g, Io(C, g, h, B, c, t, u), c) : g;
                        if (p !== v) {
                            A.set(m, p);
                            A.set(g, v);
                            break;
                        }
                        --x;
                        if (f > x) break t;
                    }
                }
                const R = f;
                const S = f;
                for (f = S; f <= b; ++f) {
                    if (A.has(g = o[f])) v = A.get(g); else {
                        v = r ? So(A, n, g, Io(C, g, h, B, c, t, u), c) : g;
                        A.set(g, v);
                    }
                    k.set(v, f);
                }
                for (f = R; f <= w; ++f) {
                    if (A.has(m = d[f])) p = A.get(m); else p = r ? So(A, n, m, i[f].scope, c) : m;
                    y.set(p, f);
                    if (k.has(p)) e[k.get(p)] = f; else {
                        e.deletedIndices.push(f);
                        e.deletedItems.push(m);
                    }
                }
                for (f = S; f <= b; ++f) if (!y.has(A.get(o[f]))) e[f] = -2;
                y.clear();
                k.clear();
            }
        }
        if (void 0 === e) {
            const t = g(this.Oi(null), (() => this.Fi(null)));
            if (Bt(t)) t.catch(Et);
        } else {
            const t = K(e);
            if (t.deletedIndices.length > 0) {
                const e = g(this.Ni(t), (() => this.ji(s, t)));
                if (Bt(e)) e.catch(Et);
            } else this.ji(s, t);
        }
    }
    qi() {
        const t = this.$controller.scope;
        let e = this.Hi;
        let i = this.Ei;
        let s;
        if (i) {
            e = this.Hi = T(this.Pi, t, this.$i, null) ?? null;
            i = this.Ei = !Lt(this.items, e);
        }
        const n = this.Ti;
        if (this.$controller.isActive) {
            s = this.Ti = Q(i ? e : this.items);
            if (n !== s) {
                n?.unsubscribe(this);
                s?.subscribe(this);
            }
        } else {
            n?.unsubscribe(this);
            this.Ti = void 0;
        }
    }
    Mi() {
        const {items: t} = this;
        if (Rt(t)) {
            this._i = t;
            return;
        }
        const e = [];
        ko(t, ((t, i) => {
            e[i] = t;
        }));
        this._i = e;
    }
    Fi(t) {
        let e;
        let i;
        let s;
        let n;
        const {$controller: r, f: o, local: l, l: h, items: a, Ii: c, $i: u, forOf: f, Ui: d} = this;
        const m = r.scope;
        const g = yo(a);
        const p = this.views = Array(g);
        ko(a, ((a, v) => {
            s = p[v] = o.create().setLocation(h);
            s.nodes.unlink();
            n = Io(c, a, f, m, u, l, d);
            wo(n.overrideContext, v, g);
            i = s.activate(t ?? s, r, n);
            if (Bt(i)) (e ?? (e = [])).push(i);
        }));
        if (void 0 !== e) return 1 === e.length ? e[0] : Promise.all(e);
    }
    Oi(t) {
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
    Ni(t) {
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
    ji(t, e) {
        let i;
        let s;
        let n;
        let r;
        let o = 0;
        const {$controller: l, f: h, local: a, _i: c, l: u, views: f, Ui: d, $i: m, Ii: g, forOf: p} = this;
        const v = e.length;
        for (;v > o; ++o) if (-2 === e[o]) {
            n = h.create();
            f.splice(o, 0, n);
        }
        if (f.length !== v) throw xo(f.length, v);
        const x = l.scope;
        const w = e.length;
        Y(f, e);
        const b = vo(e);
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
                r = Io(g, c[o], p, x, m, a, d);
                wo(r.overrideContext, o, w);
                n.setLocation(u);
                s = n.activate(n, l, r);
                if (Bt(s)) (i ?? (i = [])).push(s);
            } else if (C < 0 || 1 === y || o !== b[C]) {
                if (d) U(k, n.scope, m, c[o]); else n.scope.bindingContext[a] = c[o];
                wo(n.scope.overrideContext, o, w);
                n.nodes.insertBefore(n.location);
            } else {
                if (d) U(k, n.scope, m, c[o]); else n.scope.bindingContext[a] = c[o];
                if (t !== w) wo(n.scope.overrideContext, o, w);
                --C;
            }
        }
        if (void 0 !== i) return 1 === i.length ? i[0] : Promise.all(i);
    }
    dispose() {
        this.views.forEach(uo);
        this.views = void 0;
    }
    accept(t) {
        const {views: e} = this;
        if (void 0 !== e) for (let i = 0, s = e.length; i < s; ++i) if (true === e[i].accept(t)) return true;
    }
}

Repeat.inject = [ ln, q, ws, Oi, Ci ];

et([ Ut ], Repeat.prototype, "items", void 0);

Ge("repeat")(Repeat);

let mo = 16;

let go = new Int32Array(mo);

let po = new Int32Array(mo);

function vo(t) {
    const e = t.length;
    if (e > mo) {
        mo = e;
        go = new Int32Array(e);
        po = new Int32Array(e);
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
            o = go[i];
            n = t[o];
            if (-2 !== n && n < s) {
                po[r] = o;
                go[++i] = r;
                continue;
            }
            l = 0;
            h = i;
            while (l < h) {
                a = l + h >> 1;
                n = t[go[a]];
                if (-2 !== n && n < s) l = a + 1; else h = a;
            }
            n = t[go[l]];
            if (s < n || -2 === n) {
                if (l > 0) po[r] = go[l - 1];
                go[l] = r;
            }
        }
    }
    r = ++i;
    const c = new Int32Array(r);
    s = go[i - 1];
    while (i-- > 0) {
        c[i] = s;
        s = po[s];
    }
    while (r-- > 0) go[r] = 0;
    return c;
}

const xo = (t, e) => vt(`AUR0814:${t}!=${e}`);

const wo = (t, e, i) => {
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

const bo = gt.toString;

const yo = t => {
    switch (bo.call(t)) {
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
        throw vt(`Cannot count ${bo.call(t)}`);
    }
};

const ko = (t, e) => {
    switch (bo.call(t)) {
      case "[object Array]":
        return Ao(t, e);

      case "[object Map]":
        return Co(t, e);

      case "[object Set]":
        return Bo(t, e);

      case "[object Number]":
        return Ro(t, e);

      case "[object Null]":
        return;

      case "[object Undefined]":
        return;

      default:
        throw vt(`Cannot iterate over ${bo.call(t)}`);
    }
};

const Ao = (t, e) => {
    const i = t.length;
    let s = 0;
    for (;s < i; ++s) e(t[s], s, t);
};

const Co = (t, e) => {
    let i = -0;
    let s;
    for (s of t.entries()) e(s, i++, t);
};

const Bo = (t, e) => {
    let i = 0;
    let s;
    for (s of t.keys()) e(s, i++, t);
};

const Ro = (t, e) => {
    let i = 0;
    for (;i < t; ++i) e(i, i, t);
};

const So = (t, e, i, s, n) => {
    let r = t.get(i);
    if (void 0 === r) {
        if ("string" === typeof e) r = i[e]; else r = T(e, s, n, null);
        t.set(i, r);
    }
    return r;
};

const Io = (t, e, i, s, n, r, o) => {
    let l = t.get(e);
    if (void 0 === l) {
        if (o) U(i.declaration, l = F.fromParent(s, new Z), n, e); else l = F.fromParent(s, new Z(r, e));
        t.set(e, l);
    }
    return l;
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

With.inject = [ Ci, ws ];

et([ Ut ], With.prototype, "value", void 0);

Ge("with")(With);

let To = class Switch {
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
        this.queue((() => this.Wi(t)));
    }
    Wi(t) {
        const e = t.isMatch(this.value);
        const i = this.activeCases;
        const s = i.length;
        if (!e) {
            if (s > 0 && i[0].id === t.id) return this.zi(null);
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
        return g(this.zi(null, n), (() => {
            this.activeCases = n;
            return this.Gi(null);
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
        return g(this.activeCases.length > 0 ? this.zi(t, i) : void 0, (() => {
            this.activeCases = i;
            if (0 === i.length) return;
            return this.Gi(t);
        }));
    }
    Gi(t) {
        const e = this.$controller;
        if (!e.isActive) return;
        const i = this.activeCases;
        const s = i.length;
        if (0 === s) return;
        const n = e.scope;
        if (1 === s) return i[0].activate(t, n);
        return m(...i.map((e => e.activate(t, n))));
    }
    zi(t, e = []) {
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

et([ Ut ], To.prototype, "value", void 0);

To = et([ Ge("switch"), it(0, Ci), it(1, ws) ], To);

let Eo = 0;

let Lo = class Case {
    constructor(t, e, i, s) {
        this.f = t;
        this.Xi = e;
        this.l = i;
        this.id = ++Eo;
        this.fallThrough = false;
        this.view = void 0;
        this.Ki = s.config.level <= 1;
        this.Fe = s.scopeTo(`${this.constructor.name}-#${this.id}`);
    }
    link(t, e, i, s) {
        const n = t.parent;
        const r = n?.viewModel;
        if (r instanceof To) {
            this.$switch = r;
            this.linkToSwitch(r);
        } else throw vt(`AUR0815`);
    }
    detaching(t, e) {
        return this.deactivate(t);
    }
    isMatch(t) {
        this.Fe.debug("isMatch()");
        const e = this.value;
        if (Rt(e)) {
            if (void 0 === this.Ti) this.Ti = this.Qi(e);
            return e.includes(t);
        }
        return e === t;
    }
    valueChanged(t, e) {
        if (Rt(t)) {
            this.Ti?.unsubscribe(this);
            this.Ti = this.Qi(t);
        } else if (void 0 !== this.Ti) this.Ti.unsubscribe(this);
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
        this.Ti?.unsubscribe(this);
        this.view?.dispose();
        this.view = void 0;
    }
    linkToSwitch(t) {
        t.cases.push(this);
    }
    Qi(t) {
        const e = this.Xi.getArrayObserver(t);
        e.subscribe(this);
        return e;
    }
    accept(t) {
        if (true === this.$controller.accept(t)) return true;
        return this.view?.accept(t);
    }
};

Lo.inject = [ Ci, M, ws, k ];

et([ Ut ], Lo.prototype, "value", void 0);

et([ Ut({
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
}) ], Lo.prototype, "fallThrough", void 0);

Lo = et([ Ge("case") ], Lo);

let Po = class DefaultCase extends Lo {
    linkToSwitch(t) {
        if (void 0 !== t.defaultCase) throw vt(`AUR0816`);
        t.defaultCase = this;
    }
};

Po = et([ Ge("default-case") ], Po);

let _o = class PromiseTemplateController {
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

et([ Ut ], _o.prototype, "value", void 0);

_o = et([ Ge("promise"), it(0, Ci), it(1, ws), it(2, ii), it(3, k) ], _o);

let Uo = class PendingTemplateController {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.view = void 0;
    }
    link(t, e, i, s) {
        qo(t).pending = this;
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

et([ Ut({
    mode: 2
}) ], Uo.prototype, "value", void 0);

Uo = et([ Ge("pending"), it(0, Ci), it(1, ws) ], Uo);

let Do = class FulfilledTemplateController {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.view = void 0;
    }
    link(t, e, i, s) {
        qo(t).fulfilled = this;
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

et([ Ut({
    mode: 4
}) ], Do.prototype, "value", void 0);

Do = et([ Ge("then"), it(0, Ci), it(1, ws) ], Do);

let $o = class RejectedTemplateController {
    constructor(t, e) {
        this.f = t;
        this.l = e;
        this.view = void 0;
    }
    link(t, e, i, s) {
        qo(t).rejected = this;
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

et([ Ut({
    mode: 4
}) ], $o.prototype, "value", void 0);

$o = et([ Ge("catch"), it(0, Ci), it(1, ws) ], $o);

function qo(t) {
    const e = t.parent;
    const i = e?.viewModel;
    if (i instanceof _o) return i;
    throw vt(`AUR0813`);
}

let Mo = class PromiseAttributePattern {
    "promise.resolve"(t, e, i) {
        return new AttrSyntax(t, e, "promise", "bind");
    }
};

Mo = et([ se({
    pattern: "promise.resolve",
    symbols: ""
}) ], Mo);

let Fo = class FulfilledAttributePattern {
    then(t, e, i) {
        return new AttrSyntax(t, e, "then", "from-view");
    }
};

Fo = et([ se({
    pattern: "then",
    symbols: ""
}) ], Fo);

let Oo = class RejectedAttributePattern {
    catch(t, e, i) {
        return new AttrSyntax(t, e, "catch", "from-view");
    }
};

Oo = et([ se({
    pattern: "catch",
    symbols: ""
}) ], Oo);

class AuCompose {
    static get inject() {
        return [ u, Oi, vs, ws, ii, ln, B(CompositionContextFactory) ];
    }
    get pending() {
        return this.Yi;
    }
    get composition() {
        return this.Zi;
    }
    constructor(t, e, i, s, n, r, o) {
        this.c = t;
        this.parent = e;
        this.host = i;
        this.l = s;
        this.p = n;
        this.scopeBehavior = "auto";
        this.Zi = void 0;
        this.r = t.get(Bi);
        this.Ji = r;
        this.ts = o;
    }
    attaching(t, e) {
        return this.Yi = g(this.queue(new ChangeInfo(this.template, this.component, this.model, void 0), t), (t => {
            if (this.ts.isCurrent(t)) this.Yi = void 0;
        }));
    }
    detaching(t) {
        const e = this.Zi;
        const i = this.Yi;
        this.ts.invalidate();
        this.Zi = this.Yi = void 0;
        return g(i, (() => e?.deactivate(t)));
    }
    propertyChanged(t) {
        if ("model" === t && null != this.Zi) {
            this.Zi.update(this.model);
            return;
        }
        this.Yi = g(this.Yi, (() => g(this.queue(new ChangeInfo(this.template, this.component, this.model, t), void 0), (t => {
            if (this.ts.isCurrent(t)) this.Yi = void 0;
        }))));
    }
    queue(t, e) {
        const i = this.ts;
        const s = this.Zi;
        return g(i.create(t), (t => {
            if (i.isCurrent(t)) return g(this.compose(t), (n => {
                if (i.isCurrent(t)) return g(n.activate(e), (() => {
                    if (i.isCurrent(t)) {
                        this.Zi = n;
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
        const {ve: n, es: r, ss: o} = t.change;
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
            e = this.rs(f, r, i);
        } else {
            i = null == c ? h : c;
            e = this.rs(f, r, i);
        }
        const m = () => {
            if (null !== u) {
                const n = Controller.$el(f, e, i, {
                    projections: this.Ji.projections
                }, u);
                return new CompositionController(n, (t => n.activate(t ?? n, a, a.scope.parent)), (t => g(n.deactivate(t ?? n, a), s)), (t => e.activate?.(t)), t);
            } else {
                const s = CustomElementDefinition.create({
                    name: Zs.generateName(),
                    template: n
                });
                const r = this.r.getViewFactory(s, f);
                const o = Controller.$view(r, a);
                const l = "auto" === this.scopeBehavior ? F.fromParent(this.parent.scope, e) : F.create(e);
                if (Bs(i)) o.setLocation(i); else o.setHost(i);
                return new CompositionController(o, (t => o.activate(t ?? o, a, l)), (t => o.deactivate(t ?? o, a)), (t => e.activate?.(t)), t);
            }
        };
        if ("activate" in e) return g(e.activate(o), (() => m())); else return m();
    }
    rs(t, e, i) {
        if (null == e) return new EmptyComponent;
        if ("object" === typeof e) return e;
        const s = this.p;
        const n = Bs(i);
        Kt(t, s.Element, Kt(t, vs, new d("ElementResolver", n ? null : i)));
        Kt(t, ws, new d("IRenderLocation", n ? i : null));
        const r = t.invoke(e);
        Kt(t, e, new d("au-compose.component", r));
        return r;
    }
    getDef(t) {
        const e = St(t) ? t : t?.constructor;
        return Zs.isType(e) ? Zs.getDefinition(e) : null;
    }
}

et([ Ut ], AuCompose.prototype, "template", void 0);

et([ Ut ], AuCompose.prototype, "component", void 0);

et([ Ut ], AuCompose.prototype, "model", void 0);

et([ Ut({
    set: t => {
        if ("scoped" === t || "auto" === t) return t;
        throw vt(`AUR0805`);
    }
}) ], AuCompose.prototype, "scopeBehavior", void 0);

Ts("au-compose")(AuCompose);

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
        this.ve = t;
        this.es = e;
        this.ss = i;
        this.os = s;
    }
    load() {
        if (Bt(this.ve) || Bt(this.es)) return Promise.all([ this.ve, this.es ]).then((([t, e]) => new LoadedChangeInfo(t, e, this.ss, this.os))); else return new LoadedChangeInfo(this.ve, this.es, this.ss, this.os);
    }
}

class LoadedChangeInfo {
    constructor(t, e, i, s) {
        this.ve = t;
        this.es = e;
        this.ss = i;
        this.os = s;
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

let Vo = class AuSlot {
    static get inject() {
        return [ ws, ln, Vi, Bi ];
    }
    constructor(t, e, i, s) {
        this.ls = null;
        this.cs = null;
        let n;
        let r;
        const o = e.auSlot;
        const l = i.instruction?.projections?.[o.name];
        if (null == l) {
            n = s.getViewFactory(o.fallback, i.controller.container);
            this.us = false;
        } else {
            r = i.parent.controller.container.createChild();
            Kt(r, i.controller.definition.Type, new d(void 0, i.controller.viewModel));
            n = s.getViewFactory(l, r);
            this.us = true;
        }
        this.ds = i;
        this.view = n.create().setLocation(t);
    }
    binding(t, e) {
        this.ls = this.$controller.scope.parent;
        let i;
        if (this.us) {
            i = this.ds.controller.scope.parent;
            (this.cs = F.fromParent(i, i.bindingContext)).overrideContext.$host = this.expose ?? this.ls.bindingContext;
        }
    }
    attaching(t, e) {
        return this.view.activate(t, this.$controller, this.us ? this.cs : this.ls);
    }
    detaching(t, e) {
        return this.view.deactivate(t, this.$controller);
    }
    exposeChanged(t) {
        if (this.us && null != this.cs) this.cs.overrideContext.$host = t;
    }
    dispose() {
        this.view.dispose();
        this.view = void 0;
    }
    accept(t) {
        if (true === this.view?.accept(t)) return true;
    }
};

et([ Ut ], Vo.prototype, "expose", void 0);

Vo = et([ Ts({
    name: "au-slot",
    template: null,
    containerless: true
}) ], Vo);

const No = Ht("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw vt('"sanitize" method not implemented');
    }
})));

let jo = class SanitizeValueConverter {
    constructor(t) {
        this.gs = t;
    }
    toView(t) {
        if (null == t) return null;
        return this.gs.sanitize(t);
    }
};

jo = et([ it(0, No) ], jo);

ke("sanitize")(jo);

const Ho = DebounceBindingBehavior;

const Wo = OneTimeBindingBehavior;

const zo = ToViewBindingBehavior;

const Go = FromViewBindingBehavior;

const Xo = SignalBindingBehavior;

const Ko = ThrottleBindingBehavior;

const Qo = TwoWayBindingBehavior;

const Yo = TemplateCompiler;

const Zo = NodeObserverLocator;

const Jo = [ Yo, Zo ];

const tl = SVGAnalyzer;

const el = ue;

const il = ce;

const sl = ae;

const nl = he;

const rl = fe;

const ol = [ sl, nl, rl ];

const ll = [ el, il ];

const hl = Jn;

const al = tr;

const cl = Yn;

const ul = Kn;

const fl = Qn;

const dl = Zn;

const ml = or;

const gl = er;

const pl = ir;

const vl = sr;

const xl = rr;

const wl = nr;

const bl = lr;

const yl = [ hl, ul, cl, fl, dl, al, ml, gl, pl, xl, wl, vl, bl ];

const kl = jo;

const Al = If;

const Cl = Else;

const Bl = Repeat;

const Rl = With;

const Sl = To;

const Il = Lo;

const Tl = Po;

const El = _o;

const Ll = Uo;

const Pl = Do;

const _l = $o;

const Ul = Mo;

const Dl = Fo;

const $l = Oo;

const ql = SelfBindingBehavior;

const Ml = UpdateTriggerBindingBehavior;

const Fl = AuCompose;

const Ol = Portal;

const Vl = Focus;

const Nl = co;

const jl = [ Ho, Wo, zo, Go, Xo, Ko, Qo, kl, Al, Cl, Bl, Rl, Sl, Il, Tl, El, Ll, Pl, _l, Ul, Dl, $l, AttrBindingBehavior, ql, Ml, Fl, Ol, Vl, Nl, Vo ];

const Hl = [ kn, An, bn, yn, gn, pn, vn, xn, wn, Bn, En, Rn, Sn, In, Tn, Cn, Ln ];

const Wl = zl(n);

function zl(t) {
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
            return e.register(Gt(O, i.coercingOptions), ...Jo, ...jl, ...ol, ...yl, ...Hl);
        },
        customize(e) {
            return zl(e ?? t);
        }
    };
}

const Gl = Ht("IAurelia");

class Aurelia {
    get isRunning() {
        return this.ir;
    }
    get isStarting() {
        return this.ps;
    }
    get isStopping() {
        return this.vs;
    }
    get root() {
        if (null == this.xs) {
            if (null == this.next) throw vt(`AUR0767`);
            return this.next;
        }
        return this.xs;
    }
    constructor(t = r.createContainer()) {
        this.container = t;
        this.ir = false;
        this.ps = false;
        this.vs = false;
        this.xs = void 0;
        this.next = void 0;
        this.ws = void 0;
        this.bs = void 0;
        if (t.has(Gl, true)) throw vt(`AUR0768`);
        Kt(t, Gl, new d("IAurelia", this));
        Kt(t, es, this.ys = new d("IAppRoot"));
    }
    register(...t) {
        this.container.register(...t);
        return this;
    }
    app(t) {
        this.next = new AppRoot(t, this.ks(t.host), this.container, this.ys);
        return this;
    }
    enhance(t, e) {
        const i = t.container ?? this.container.createChild();
        const s = t.host;
        const n = this.ks(s);
        const r = t.component;
        let o;
        if (St(r)) {
            Kt(i, n.HTMLElement, Kt(i, n.Element, Kt(i, vs, new d("ElementResolver", s))));
            o = i.invoke(r);
        } else o = r;
        Kt(i, xs, new d("IEventTarget", s));
        e = e ?? null;
        const l = Controller.$el(i, o, s, null, CustomElementDefinition.create({
            name: js(),
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
    ks(t) {
        let e;
        if (!this.container.has(ii, false)) {
            if (null === t.ownerDocument.defaultView) throw vt(`AUR0769`);
            e = new tt(t.ownerDocument.defaultView);
            this.container.register(Gt(ii, e));
        } else e = this.container.get(ii);
        return e;
    }
    start(t = this.next) {
        if (null == t) throw vt(`AUR0770`);
        if (Bt(this.ws)) return this.ws;
        return this.ws = g(this.stop(), (() => {
            Reflect.set(t.host, "$aurelia", this);
            this.ys.prepare(this.xs = t);
            this.ps = true;
            return g(t.activate(), (() => {
                this.ir = true;
                this.ps = false;
                this.ws = void 0;
                this.As(t, "au-started", t.host);
            }));
        }));
    }
    stop(t = false) {
        if (Bt(this.bs)) return this.bs;
        if (true === this.ir) {
            const e = this.xs;
            this.ir = false;
            this.vs = true;
            return this.bs = g(e.deactivate(), (() => {
                Reflect.deleteProperty(e.host, "$aurelia");
                if (t) e.dispose();
                this.xs = void 0;
                this.ys.dispose();
                this.vs = false;
                this.As(e, "au-stopped", e.host);
            }));
        }
    }
    dispose() {
        if (this.ir || this.vs) throw vt(`AUR0771`);
        this.container.dispose();
    }
    As(t, e, i) {
        const s = new t.platform.window.CustomEvent(e, {
            detail: this,
            bubbles: true,
            cancelable: true
        });
        i.dispatchEvent(s);
    }
}

var Xl;

(function(t) {
    t[t["oneTime"] = 1] = "oneTime";
    t[t["toView"] = 2] = "toView";
    t[t["fromView"] = 4] = "fromView";
    t[t["twoWay"] = 6] = "twoWay";
    t[t["default"] = 8] = "default";
})(Xl || (Xl = {}));

var Kl;

(function(t) {
    t[t["Element"] = 1] = "Element";
    t[t["Attribute"] = 2] = "Attribute";
})(Kl || (Kl = {}));

function Ql(t, e) {
    let i;
    const s = "dependencies";
    function n(t, e, n) {
        if (arguments.length > 1) i.name = e;
        if ("function" === typeof t || "undefined" !== typeof n?.value) throw new Error(`Invalid usage. @children can only be used on a field`);
        const r = t.constructor;
        let o = Zs.getAnnotation(r, s);
        if (null == o) Zs.annotate(r, s, o = []);
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
    static create(t, e, i, s, n = Jl, r = th, o = eh, l = Yl) {
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
    constructor(t, e, i, s = Jl, n = th, r = eh, o = Yl) {
        this.Cs = void 0;
        this.Bs = Jl;
        this.Rs = th;
        this.Ss = eh;
        this.isBound = false;
        this.ht = t;
        this.cb = (this.obj = e)[i];
        this.Bs = s;
        this.Rs = n;
        this.Ss = r;
        this.xt = o;
        this.Ti = new (this.Is = t.host).ownerDocument.defaultView.MutationObserver((() => {
            this.Ts();
        }));
    }
    getValue() {
        return this.isBound ? this.Cs : this.Es();
    }
    setValue(t) {}
    bind() {
        if (this.isBound) return;
        this.isBound = true;
        this.Ti.observe(this.Is, this.xt);
        this.Cs = this.Es();
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        this.Ti.disconnect();
        this.Cs = l;
    }
    Ts() {
        this.Cs = this.Es();
        this.cb?.call(this.obj);
        this.subs.notify(this.Cs, void 0);
    }
    get() {
        throw Zl("get");
    }
    useScope() {}
    limit() {
        throw Zl("limit");
    }
    Es() {
        return sh(this.ht, this.Bs, this.Rs, this.Ss);
    }
}

I(ChildrenBinding);

const Yl = {
    childList: true
};

const Zl = t => vt(`Method "${t}": not implemented`);

const Jl = t => t.host.childNodes;

const th = (t, e, i) => !!i;

const eh = (t, e, i) => i;

const ih = {
    optional: true
};

const sh = (t, e, i, s) => {
    const n = e(t);
    const r = n.length;
    const o = [];
    let l;
    let h;
    let a;
    let c = 0;
    for (;c < r; ++c) {
        l = n[c];
        h = Gs(l, ih);
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
        Gt(wi, this).register(t);
    }
    hydrating(t, e) {
        const i = this.def;
        e.addBinding(ChildrenBinding.create(e, e.viewModel, i.name, i.callback ?? `${mt(i.name)}Changed`, i.query ?? Jl, i.filter ?? th, i.map ?? eh, i.options ?? Yl));
    }
}

Ai()(ChildrenLifecycleHooks);

export { AdoptedStyleSheetsStyles, AppRoot, Oe as AppTask, ue as AtPrefixedTriggerAttributePattern, el as AtPrefixedTriggerAttributePatternRegistration, AttrBindingBehavior, sr as AttrBindingCommand, vl as AttrBindingCommandRegistration, AttrSyntax, AttributeBinding, AttributeBindingInstruction, En as AttributeBindingRenderer, AttributeNSAccessor, le as AttributePattern, AuCompose, Vo as AuSlot, AuSlotsInfo, Aurelia, qt as Bindable, BindableDefinition, BindableObserver, BindablesInfo, ye as BindingBehavior, BindingBehaviorDefinition, Xn as BindingCommand, BindingCommandDefinition, Xl as BindingMode, BindingModeBehavior, BindingTargetSubscriber, CSSModulesProcessorRegistry, ir as CaptureBindingCommand, pl as CaptureBindingCommandRegistration, Lo as Case, CheckedObserver, ChildrenBinding, ClassAttributeAccessor, rr as ClassBindingCommand, xl as ClassBindingCommandRegistration, ce as ColonPrefixedBindAttributePattern, il as ColonPrefixedBindAttributePatternRegistration, jn as CommandType, ComputedWatcher, ContentBinding, Controller, ei as CustomAttribute, CustomAttributeDefinition, vn as CustomAttributeRenderer, Zs as CustomElement, CustomElementDefinition, pn as CustomElementRenderer, DataAttributeAccessor, DebounceBindingBehavior, Ho as DebounceBindingBehaviorRegistration, Jn as DefaultBindingCommand, hl as DefaultBindingCommandRegistration, yl as DefaultBindingLanguage, ol as DefaultBindingSyntax, Po as DefaultCase, Jo as DefaultComponents, Hl as DefaultRenderers, jl as DefaultResources, Kl as DefinitionType, he as DotSeparatedAttributePattern, nl as DotSeparatedAttributePatternRegistration, Else, Cl as ElseRegistration, ExpressionWatcher, FlushQueue, Focus, tr as ForBindingCommand, al as ForBindingCommandRegistration, FragmentNodeSequence, FromViewBindingBehavior, Go as FromViewBindingBehaviorRegistration, Yn as FromViewBindingCommand, cl as FromViewBindingCommandRegistration, Do as FulfilledTemplateController, HooksDefinition, HydrateAttributeInstruction, HydrateElementInstruction, HydrateLetElementInstruction, HydrateTemplateController, es as IAppRoot, Fe as IAppTask, cr as IAttrMapper, ie as IAttributeParser, ee as IAttributePattern, rn as IAuSlotsInfo, Gl as IAurelia, Oi as IController, xs as IEventTarget, Te as IFlushQueue, Is as IHistory, Vi as IHydrationContext, ln as IInstruction, wi as ILifecycleHooks, Ss as ILocation, vs as INode, Zo as INodeObserverLocatorRegistration, ii as IPlatform, nn as IProjections, ws as IRenderLocation, cn as IRenderer, Bi as IRendering, hr as ISVGAnalyzer, No as ISanitizer, di as IShadowDOMGlobalStyles, fi as IShadowDOMStyles, Zt as ISyntaxInterpreter, an as ITemplateCompiler, Dr as ITemplateCompilerHooks, Yo as ITemplateCompilerRegistration, dr as ITemplateElementFactory, Ci as IViewFactory, Rs as IWindow, If, Al as IfRegistration, on as InstructionType, InterpolationBinding, yn as InterpolationBindingRenderer, InterpolationInstruction, InterpolationPartBinding, Interpretation, IteratorBindingInstruction, An as IteratorBindingRenderer, LetBinding, LetBindingInstruction, wn as LetElementRenderer, ki as LifecycleHooks, LifecycleHooksDefinition, LifecycleHooksEntry, ListenerBinding, ListenerBindingInstruction, ListenerBindingOptions, Bn as ListenerBindingRenderer, MultiAttrInstruction, NodeObserverLocator, NoopSVGAnalyzer, OneTimeBindingBehavior, Wo as OneTimeBindingBehaviorRegistration, Kn as OneTimeBindingCommand, ul as OneTimeBindingCommandRegistration, Uo as PendingTemplateController, Portal, _o as PromiseTemplateController, PropertyBinding, PropertyBindingInstruction, kn as PropertyBindingRenderer, ae as RefAttributePattern, sl as RefAttributePatternRegistration, RefBinding, ml as RefBindingCommandRegistration, RefBindingInstruction, bn as RefBindingRenderer, $o as RejectedTemplateController, Rendering, Repeat, Bl as RepeatRegistration, SVGAnalyzer, tl as SVGAnalyzerRegistration, jo as SanitizeValueConverter, kl as SanitizeValueConverterRegistration, SelectValueObserver, SelfBindingBehavior, ql as SelfBindingBehaviorRegistration, SetAttributeInstruction, Rn as SetAttributeRenderer, SetClassAttributeInstruction, Sn as SetClassAttributeRenderer, SetPropertyInstruction, gn as SetPropertyRenderer, SetStyleAttributeInstruction, In as SetStyleAttributeRenderer, ShadowDOMRegistry, ll as ShortHandBindingSyntax, SignalBindingBehavior, Xo as SignalBindingBehaviorRegistration, SpreadBindingInstruction, SpreadElementPropBindingInstruction, Ln as SpreadRenderer, Wl as StandardConfiguration, Mi as State, StyleAttributeAccessor, nr as StyleBindingCommand, wl as StyleBindingCommandRegistration, mi as StyleConfiguration, StyleElementStyles, StylePropertyBindingInstruction, Tn as StylePropertyBindingRenderer, To as Switch, TemplateCompiler, Mr as TemplateCompilerHooks, xn as TemplateControllerRenderer, TextBindingInstruction, Cn as TextBindingRenderer, ThrottleBindingBehavior, Ko as ThrottleBindingBehaviorRegistration, ToViewBindingBehavior, zo as ToViewBindingBehaviorRegistration, Qn as ToViewBindingCommand, fl as ToViewBindingCommandRegistration, er as TriggerBindingCommand, gl as TriggerBindingCommandRegistration, TwoWayBindingBehavior, Qo as TwoWayBindingBehaviorRegistration, Zn as TwoWayBindingCommand, dl as TwoWayBindingCommandRegistration, UpdateTriggerBindingBehavior, Ml as UpdateTriggerBindingBehaviorRegistration, ValueAttributeObserver, Be as ValueConverter, ValueConverterDefinition, ViewFactory, qi as ViewModelKind, We as Watch, With, Rl as WithRegistration, Qt as alias, jt as allResources, se as attributePattern, Ut as bindable, xe as bindingBehavior, Hn as bindingCommand, sn as capture, Ql as children, Mt as coercer, Ls as containerless, Cs as convertToRenderLocation, ai as cssModules, ze as customAttribute, Ts as customElement, ks as getEffectiveParentNode, gs as getRef, Ui as isCustomElementController, Di as isCustomElementViewModel, hn as isInstruction, Bs as isRenderLocation, Ai as lifecycleHooks, Se as mixinAstEvaluator, Re as mixinUseScope, Pe as mixingBindingLimited, tn as processContent, Yt as registerAliases, un as renderer, As as setEffectiveParentNode, ps as setRef, ci as shadowCSS, _s as strict, Fr as templateCompilerHooks, Ge as templateController, Es as useShadowDOM, ke as valueConverter, Ne as watch };
//# sourceMappingURL=index.mjs.map
